/* ============================================================
   THE ENGINE HOST. Loads the real, shipped `engine.js` (the host-free
   build this repository already produces via `atuned_src/BUILD-engine.sh`
   and already runs under Node for `tests/engine.js`, 4574 passing checks)
   and hands back a fresh, fully isolated instance of it on every call.

   WHY ISOLATION, NOT A SHARED REQUIRE. `engine/core.js` declares its state
   as a single module level object: `const S={dom:0,doms:[0],...}`. CLAUDE.md
   names this directly: "The impure core. compute() and friends read shared
   state. A front door contains it. Purifying is a signature rewrite and is
   deliberately deferred." That sentence is true and still correct; it is
   also a real landmine for a server that calls into this engine on behalf
   of more than one person. A plain `require('../../engine.js')`, called
   once, gives every request the SAME `S`: one person's law scores would
   bleed into another's mid-release. This file is the one safe way to call
   the real engine from a multi-tenant Node process without waiting on the
   purifying rewrite: compile the engine's source once (expensive, done at
   process start), then run the compiled script fresh, in a brand new V8
   context, on every call that needs it (cheap, a few milliseconds). Two
   instances from `freshEngine()` share no state; verified directly,
   `tests/engineHost.test.ts`.

   WHAT THIS DOES NOT SOLVE. A fresh `S` starts from the engine's own
   defaults, not from a real person's stored profile. Seeding it from a
   real profile, and reading the result back out to persist, is the real
   adapters' own job (`realAdapters.ts`), and persisting a profile at all is
   explicitly not this funnel's domain (`PLAN.md` section U/T: "existing
   stories, observations, evidence, patterns... remain authoritative
   wherever they already exist"). Today that "wherever" is the browser's own
   IndexedDB/localStorage; a server-side profile store is the account/sync
   seam CLAUDE.md already names as not yet built. Named here so it is not
   quietly assumed solved by this file.
   ============================================================ */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));

/** Finds the repo root's built `engine.js`. Overridable (same env var
 *  `tests/engine.js` itself honours) for a worktree or CI layout where the
 *  repo root is not three directories up from `dist/src/`. */
export function resolveEngineJsPath(): string {
  if (process.env.ENGINE) return resolve(process.env.ENGINE);
  const candidates = [
    join(here, '..', '..', '..', 'engine.js'), // dist/src/ -> atuned_funnel_system/ -> repo root
    join(here, '..', '..', 'engine.js'), // src/ -> atuned_funnel_system/ -> repo root (ts-node style)
    resolve('engine.js'), // run from repo root directly
  ];
  const found = candidates.find((c) => existsSync(c));
  if (!found) {
    throw new Error(
      `engine.js not found; looked at ${candidates.join(', ')}. Run atuned_src/BUILD-engine.sh at the repo root first, or set ENGINE=/path/to/engine.js`,
    );
  }
  return found;
}

let compiled: vm.Script | null = null;

function getCompiledScript(): vm.Script {
  if (!compiled) {
    const path = resolveEngineJsPath();
    const source = readFileSync(path, 'utf8');
    compiled = new vm.Script(source, { filename: path });
  }
  return compiled;
}

/** The subset of the real engine's exports the funnel's adapters call.
 *  Matches `engine.js`'s own `module.exports` shape (see
 *  `atuned_src/engine/export.js`); listed narrowly here rather than typed
 *  as `any` so a renamed export fails this file at compile time instead of
 *  silently returning `undefined` at call time. */
export interface EngineInstance {
  S: Record<string, unknown> & { law: Record<string, number>; charge: Record<string, number> };
  /** Whether each law has ever actually been answered (true) or still sits
   *  at the engine's own unseeded default (false, excluded from `cqSum`).
   *  A profile-seeding caller must clear this for every law it is actually
   *  loading real values for, the same step `tests/engine.js`'s own
   *  `reset()` helper takes, or `cqSum` silently ignores the seeded value. */
  LAW_UNSET: Record<string, boolean>;
  compute: () => unknown;
  cqSum: () => number;
  lawLift: (v: number, n: number) => number;
  releaseWork: (p: unknown, keys: string[]) => { laws: Record<string, unknown>; cq0: number; cq1: number; n: number };
  releaseVerify: (
    P: unknown,
    answer: string,
    addrs: (string | number)[],
    opt: unknown,
    now?: string,
  ) => { ok: boolean; P: unknown; ids?: string[]; errs?: string[] };
  srcHear: (text: string, prior?: unknown) => unknown;
  srcPrior: (entries: unknown[]) => unknown;
  srcTurn: (heard: unknown, state: unknown) => unknown;
  SIGHT: unknown[];
  PLAN_PRICE: Record<string, number>;
  RV_ANSWERS: string[];
  practiceBlank: () => unknown;
}

/** One fresh, fully isolated engine instance. Safe to call concurrently
 *  from different requests; NOT safe to cache and reuse across two
 *  different people's calls, since `S` is this instance's own mutable
 *  state, exactly like a browser tab's would be. */
export function freshEngine(): EngineInstance {
  const sandbox: { module: { exports: Record<string, unknown> }; exports?: unknown; console: Console } = {
    module: { exports: {} },
    console,
  };
  sandbox.exports = sandbox.module.exports;
  const context = vm.createContext(sandbox);
  getCompiledScript().runInContext(context);
  return sandbox.module.exports as unknown as EngineInstance;
}

/** For read-only, stateless lookups only (SIGHT, PLAN_PRICE, and the like):
 *  one instance, built once, reused. Never call this for anything that
 *  reads or writes `S` on behalf of a specific person; use `freshEngine()`
 *  for that every time. */
let staticInstance: EngineInstance | null = null;
export function staticEngine(): EngineInstance {
  if (!staticInstance) staticInstance = freshEngine();
  return staticInstance;
}
