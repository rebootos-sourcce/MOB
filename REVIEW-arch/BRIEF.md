# Review brief: the six-area architecture proposal (round PK, 2 October)

Run under the standing framework in `REVIEW-FRAMEWORK/README.md`: three passes, each
seat grading its own discipline, ending in a tally and executable steps. READ
`REVIEW-arch/OWNER-INPUT.md` FIRST. It is his instruction and the proposal, verbatim.

The owner's instruction: "review this three times. Figure out the steps to execute this
efficiently. And to put it in the plan. As part of our improvements for MVP."

## What is being reviewed
A proposal to turn ATUNED from a sophisticated instrument into a reliable operating
system, as ONE connected architecture of six areas: (1) an orchestrator above the
intelligence agents with one contract (INPUT, OBSERVATION, EVIDENCE, HYPOTHESIS,
CONFIDENCE, UNCERTAINTY, RECOMMENDATION; an agent may never turn an inference into a
fact); (2) the 90-day engine as the product's state machine, gated by behaviour and not
by days; (3) an Evidence Ledger as the single source of truth with a verification chain
(said, detected, thought, experienced, changed, verified); (4) a runtime Safety Gate
(ordinary, activated, possible trauma, crisis, medical, substance, abuse; never
diagnose); (5) privacy as architecture (what data, where, who, how long, why, what leaves
the device, what is encrypted, deleted, exported); (6) commerce and identity as one
server authoritative system (identity, subscription, entitlement, meter, experience).

## What each seat must do in PASS 1
Audit the proposal AGAINST THE REPO as it stands. For each of the six areas your
discipline touches: (a) what already exists, with file and line (engine in
`atuned_src/engine/`, e.g. `trace.js`, `practice.js`, `sourceai.js`, `lexicon.js`,
`plan.js`, `ladder.js`; UI in `atuned_src/ui/`; docs `ATUNED-MVP-architecture-v2.md`,
`ATUNED-architecture-security-review.md`, `ARCHITECTURE-RESEARCH.md`,
`ATUNED-practice-ritual-accountability-trace-graph-TDD.md`, `ATUNED-becoming-system-TDD.md`,
`ATUNED-funnel-to-software-journey-TDD-v1.md`, `DESIGN-*.md`, `DECISIONS.md`); (b) what
the proposal adds that is genuinely new; (c) where it is wrong, redundant or conflicts
with a ruling; (d) what is MVP and what is later; (e) size S, M or L, dependencies, risks.
Note: "agents" here means the in-product reasoning modules (sniffer, trace, pattern,
release intelligence), not the AI assistants that build the product.

## Fixed rulings (do not argue; build around them)
- THE ENGINE IS HOST FREE. No `document`, `window`, `fetch`, `localStorage` in
  `atuned_src/engine/`. Network lives at exactly one seam. `source.html` is one file with
  no dependencies. A host binds storage with `bindStore(get,set)`.
- Validate at the boundary and never lie about a failure; failed writes report through
  `status()`. `validateProfile` / `pImport` are the boundary.
- THE FORK IS CALLED: this becomes an accounts product (web quiz, record store, sign in,
  practitioner with consented sight, paid tiers, push). Practitioner sight needs explicit
  consent, a visible list, revocation, never a silent default. Records off device mean a
  controller exists; access, deletion and breach duties attach.
- CORRECTION TO THE PROPOSAL, a standing conflict to settle: it quotes "Sight is not for
  sale. New ground is." The owner REVERSED that on 1 October (round OK). Now: everybody
  sees their own reading at the level of the 112 addresses, domains, archetypes, laws,
  gates and shadow; tier one adds saboteurs, tier two complexes, tier three and four
  hyper complexes and the character, registers and masks (`engine/plan.js` SIGHT). What
  tiers also buy is velocity (new patterns a month). Reconcile entitlements to THAT. The
  proposal's point that downgrading must never take away ground already opened is sound
  and should survive.
- Tier ladder 12, 29, 59, 99. Gift is a counter of 100. Account created AFTER the first
  release. Age 18. Research sharing off. Legal facts in `DECISIONS.md`. Tula Unified LLC.
- No permanent safety line; the sniffer must detect distress and respond (his ruling).
  It must never diagnose. The sniffer follows the feelings wheel (`FEELINGS-WHEEL.md`).
- Voice: no em dashes, sentence case, mechanical and precise, no wellness language.
- Never renumber TAB integers. Schema v2 is the owner's call: anything that changes the
  record shape must be additive and flagged.

## Report format
`GRADE: NN/100` for how ready this area is to be built as proposed, in your discipline's
terms, then a table of 6 to 8 criteria scored out of 10 with a line of evidence each.
Then: AREA BY AREA (exists today / adds / conflicts / MVP cut / size). Then RISKS. Then
YOUR RECOMMENDED ORDER of work for the areas you cover. Plain short words, each term of
art explained in the same sentence. Under 1500 words, no em dashes. Write only your file.

## The three passes
1. PASS 1, independent audit against the repo (above).
2. PASS 2, `PASS2-INSTRUCTIONS.md`: cross reading; agreements, disagreements with rulings,
   misses; ONE merged architecture and ONE build order. Replace "the skin" with "the
   architecture" wherever that file says skin.
3. PASS 3, `REVIEW-FRAMEWORK/PASS3.template.md` adapted: the executable STEPS. Cut the
   work into slices an agent can build in a worktree and a gate can prove: each slice has
   a name, what it changes (files), what it must not touch, the test that proves it, size,
   what it unlocks, MVP or later. Include a "what the ICPs feel" check per slice (a
   person in acute distress, a skeptic, a phone only arrival, a practitioner).
