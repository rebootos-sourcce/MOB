/* ============================================================
   THE FUNNEL STATE MACHINE. One table, one validate function. The TDD's
   own rule (Implementation TDD section 2.2): "No arbitrary state jumps are
   permitted. Every transition is validated by the deterministic state
   machine before persistence." This file is that validation and nothing
   else: it does not persist, does not call an adapter, does not know
   about patterns or money. funnelService.ts is the only caller.
   ============================================================ */

import { FunnelError, type FunnelState } from './domain.js';

export const FUNNEL_STATES: readonly FunnelState[] = [
  'ARRIVE',
  'RECOGNIZE',
  'UNDERSTAND_ENOUGH',
  'SIGNAL_TEST',
  'AHA',
  'BASELINE',
  'READING',
  'STORY',
  'MIRROR',
  'CONFIRM_CORRECT',
  'ADDRESS',
  'RELEASE',
  'REFRAME',
  'VERIFY',
  'RITUAL',
  'COLLECTION',
  'ACCOUNT',
  'PRACTICE',
  'RETURN',
  'SAFETY_STOP',
];

/* THE TABLE, read verbatim off Implementation TDD section 2.2. Every state
   may also move to SAFETY_STOP; that line is folded into every row here
   rather than written twenty times, and section 38's rule is enforced by
   keeping it unconditional: nothing may remove SAFETY_STOP from a row to
   "optimise" a flow, because that would let a paywall or a referral
   screen outrun a safety decision, which the TDD names as a system
   invariant on its own ("NO SAFETY OVERRIDE FOR CONVERSION"). */
const BASE_TRANSITIONS: Record<FunnelState, FunnelState[]> = {
  ARRIVE: ['RECOGNIZE'],
  RECOGNIZE: ['UNDERSTAND_ENOUGH'],
  UNDERSTAND_ENOUGH: ['SIGNAL_TEST', 'AHA', 'STORY'],
  SIGNAL_TEST: ['AHA'],
  AHA: ['BASELINE'],
  BASELINE: ['READING'],
  READING: ['STORY', 'MIRROR'],
  STORY: ['MIRROR'],
  MIRROR: ['CONFIRM_CORRECT'],
  CONFIRM_CORRECT: ['ADDRESS', 'MIRROR'],
  ADDRESS: ['RELEASE'],
  RELEASE: ['REFRAME', 'VERIFY'],
  REFRAME: ['VERIFY'],
  VERIFY: ['RITUAL'],
  RITUAL: ['COLLECTION', 'PRACTICE'],
  COLLECTION: ['ACCOUNT', 'PRACTICE'],
  ACCOUNT: ['PRACTICE'],
  PRACTICE: ['RETURN'],
  RETURN: ['STORY', 'RECOGNIZE'],
  SAFETY_STOP: ['RECOGNIZE', 'RETURN'],
};

function withSafetyStop(table: Record<FunnelState, FunnelState[]>): Record<FunnelState, FunnelState[]> {
  const out = {} as Record<FunnelState, FunnelState[]>;
  for (const state of FUNNEL_STATES) {
    const row = table[state] ?? [];
    out[state] = state === 'SAFETY_STOP' ? row : [...row, 'SAFETY_STOP'];
  }
  return out;
}

export const FUNNEL_TRANSITIONS: Readonly<Record<FunnelState, readonly FunnelState[]>> =
  Object.freeze(withSafetyStop(BASE_TRANSITIONS));

export interface TransitionCheck {
  allowed: boolean;
  reason?: string;
}

/** Pure. No side effects, no I/O. Call this before every persisted state write. */
export function canTransition(from: FunnelState, to: FunnelState): TransitionCheck {
  if (from === to) {
    return { allowed: false, reason: `already in state ${from}` };
  }
  const row = FUNNEL_TRANSITIONS[from];
  if (!row) {
    return { allowed: false, reason: `unknown state ${from}` };
  }
  if (!row.includes(to)) {
    return { allowed: false, reason: `${from} -> ${to} is not a permitted transition` };
  }
  return { allowed: true };
}

/** Throws FunnelError('INVALID_TRANSITION', ...) on an invalid move; otherwise returns `to`. */
export function assertTransition(from: FunnelState, to: FunnelState): FunnelState {
  const check = canTransition(from, to);
  if (!check.allowed) {
    throw new FunnelError('INVALID_TRANSITION', check.reason ?? `${from} -> ${to} is not permitted`);
  }
  return to;
}

/** True once a session has reached a state with no further forward motion
 *  expected in this visit (RETURN loops back out; PRACTICE is the steady
 *  state once the first-use journey is done). Used only for reporting,
 *  never to gate a transition. */
export function isTerminalForFirstUse(state: FunnelState): boolean {
  return state === 'PRACTICE' || state === 'RETURN';
}
