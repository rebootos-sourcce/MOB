# Pass 3, technical director (Anders Kjeld). Round PK

Facts checked in the tree today: `engine/reading.js`, `loop.js`, `privacy.js`, `tests/perf.js` and `tests/safety.js` do not exist. The reader `distress.js` lives only on `worktree-agent-a6d4e60928876b711` (commit `c1cbc1a`, which exists). The "inference never becomes fact" rule is in `trace.js` (twice, `TRACE_CAUSE_SRC` and `TRACE_PROMOTE`) and in `daily.js` (`dlyGroundOne`). The two big files are `ui/storyui.js` at 117 KB and `engine/schema.js` at 97 KB.

## 1. The architecture in three sentences

The reasoning stays as pure functions in `engine/` (one shared reader, one rule for what an inference may become, a derived trace chain, a derived loop read, a safety screen that stores nothing), and the screen shows one Next, one Maybe and, when needed, a quiet care card. The record gets additive keys only, carried through old builds, with a privacy table that a build gate enforces, and the server owns tier and money while the browser owns pace. The merge kept what I care about; it bent one thing: it still lists A1 (typing floor) as one of thirteen, when it is the floor under every other slice. Every new function runs on every keystroke path unless it is told not to, and that path is already at 79 ms median.

## 2. The ICP room (from the frame budget view)

- **Marta, 02:00, acute distress, phone.** Sees a box that must not lag. At 4x throttle the input handler is 79 ms; a person in pain who sees letters trail her fingers feels unheard. After A1 she types at 16 ms or better. The safety screen costs about 40 microseconds on the last sentence (estimate). She meets one card with Call, Text, Continue. Trust holds if the card paints in the same frame. She leaves if it is a modal or a spinner. "Please just let me type."
- **Nils, skeptic.** Opens the Why chain and counts rows. Six closed rows, each resolving to an id, is checkable, so he stays. He leaves if a row prints a number he cannot trace. "Show me where it got that."
- **Camille, practitioner.** Exports a record and imports it on a second machine. A2 and A11 make the round trip equal, side stores included. Without them she gets a second record with the same id. "My client's file must come back whole."
- **Whitney, phone only.** Cold start matters: the file is 2.4 MB raw, packed about half (measured 27 September). One Next replaces seven cards, so the DOM falls toward 3,000 (now 3,998). Safari may clear storage after about seven days (from memory, verify on a real iPhone), so A10 is her only honest backup. "Did I lose it?"
- **Renata, operator.** Wants the chain as a number. She gets counts of distinct days, no score. That is right, but she will ask for a count export; `traceChain` is pure and can feed one later. "Give me the count, not a mood."
- **Gordon, refuses clinical.** Sees no state names, no label, Not me works and changes what shows. Compositor cost of that is nil; trust is a copy matter. He leaves if "Maybe" reads like a diagnosis. "I did not say that."
- **Sofia, needs the consent list.** The list is generated from the `PRIVACY` table, so it cannot drift from the code. Practitioner grants (R5) are not built yet, so the list says nobody. That is true. "Who can see this, today, right now?"
- **Trey, quiz tourist.** Sees the first screen at once if cold start is held. He never meets the chain or care. He leaves at any wait over about three seconds (estimate). "Is this a quiz or not."

## 3. Unified quality: 70 out of 100

Gaps:
1. Nothing is measured yet for the new work. Every figure for A4, A6 and A12 is an estimate until `tests/perf.js` exists. Budget: 8 ms of the 16.7 ms frame.
2. Cold recall of the safety reader is 5 of 18 on phrases it had not seen. The merge ships it to the private build only. That is right, but it is a floor on known phrases, not recall, and the gate must say so.
3. DOM is 3,998 against a budget of 3,000, and the claim row, Next and Why chain all add nodes. Net down must be a gate, not a hope.

## 4. FINAL GRADE: GRADE: 70/100 (pass 1 62, pass 2 66)

Moved up: one hot path fix named first, one reader instead of two, record loss fixed before any new write, privacy as a gated table. Held back by missing measurements and an undeployed server.

## 5. My part of the slices

Slices that touch the same file run in series. "Not" lists what the slice must not change. ICP feel in the last column.

| Id | Name and goal | Changes | Not | Gate | Size | Unlocks | MVP | Feel |
|---|---|---|---|---|---|---|---|---|
| A1 | Typing floor: paint in one rAF, parse 150 ms after a pause | `ui/storyui.js` (`stRefresh`), new `tests/perf.js`, `tools/monitor.js` stamp | engine, record | 1000 words at 4x throttle, input p95 at or under 16 ms; fails at 17 | S | A4, A5, A6 | MVP | Marta: no lag; Whitney: no heat |
| A2 | Record door: carry unknown top level keys (`p.carry`, 256 KB, depth 6), new id on import, one storage budget by name | `engine/schema.js`, `pImport` | `SCHEMA_V`, TAB integers | `tests/engine.js`: newer key survives an older save; import twice gives two ids; over budget names the key | S | A8, A10, A11 | MVP | Camille: file returns whole |
| A3 | Privacy table and ban words | new `engine/privacy.js`, `atuned_src/hostfree.py`, `ui/account.js` (remove toggle) | strings | build fails on any `blankProfile` key missing from the table; `crypto`, `indexedDB` banned in `engine/` | S | A10, A11, R3 | MVP | Sofia: list matches code |
| A4 | Safety screen from `c1cbc1a`, cues as editable data | `engine/sniff.js` neighbour (new `engine/distress.js`), `MANIFEST`, `ui/storyui.js` call site | commit semantics, record | new `tests/safety.js`: six known misses hit, negation never voids a crisis cue, curly apostrophe, nothing stored, works offline, cold recall printed not claimed | M | A5 | MVP, private build only | Marta: quiet, fast |
| A5 | Care register: three outcomes, one card, motion stops | `ui/storyui.js`, CSS | Ritual, Compass | `functional.js` card appears and Continue works; `design.js`; counts of choices on screen fall | M | public launch after clinician review | MVP | Marta: not a modal |
| A6 | One shared reading and the one rule: `readEntry`, one negation handler, `lex` stamp, `obsValid`, `SRC_CEIL` | new `engine/reading.js`, `trace.js`, `daily.js`, `sourceai.js` callers | lexicon weights, `TRACE_PROMOTE` meaning | story bank agreement (zero disagreements); `tools/equiv.py`; 1000 word parse under 5 ms (3.5 ms each today, so about 3.5 saved, estimate) | M | A8, A12 | MVP | Nils: same answer twice |
| A8 | Trace chain, `declined`, first writers | `engine/trace.js`, `ui/release.js`, `ui/storyui.js` card hook | `p.rituals` cutover | every Summary sentence resolves to ids; a declined edge is not proposed again; `p.practice` non empty after a real run | M | A13 | MVP | Nils, Renata |
| A9 | Entitlements on `SIGHT`: clamp `granted`, lease on `until` plus 3 days, keep `base`, free banking cap | `engine/plan.js`, `engine/schema.js` | server | one test per forge; downgrade keeps opened ground | S | R0 | MVP | Whitney: pays, is told |
| A10 | Encrypted export, restore drill | `ui/record.js` | plain `pExport` | export, wipe, import, hash equal; wrong key fails; cut file says cut; no `crypto.subtle` gives a plain file that says so | M | R4 | MVP | Whitney, Camille |
| A11 | Deletion reaches every key; side stores into `p.side` | `ui/account.js`, `engine/schema.js` | `accForget` meaning | delete then scan `localStorage`: no key holds the id | M | R3 | MVP | Sofia |
| A12 | `loopRead` and one Next | new `engine/loop.js`, `ui/component.js` | any day count in UI | `tools/loopsim.js`; "Day", "of 90" never render; one Next per surface; DOM total falls | M | ring and avatar | MVP | Whitney, Gordon |
| A13 | Claim row (Fits, Not me, Why) as a plain list under 300 nodes | `ui/imprints.js` first, `ui/storyui.js` only if forced | canvas | Not me changes what shows next; DOM total below 3,998 | M | Confirmed ask | MVP | Gordon, Nils |

Server repo `/home/user/reboot-os`. R0 deploy (S, commit, merge, price ids, `BASE_PLAN=0`, timed real signup; gate: 30 tests plus one real D1 run; MVP). R1 contract test for plan integers (S; fails on drift; MVP). R2 billing hygiene, second live subscription refused, refund and dispute heard (S; webhook tests; MVP). R3 deletion clears every table (S; delete then scan; MVP). R4 sync kinds, one sealed chunk per day (L; after A2, A10, R0 to R3; later). R5 practitioner grants with audit rows and revoke (M; after R4; later; Sofia sees a real list). Not touched by any MOB slice: `ui/auth.js` stays the only `fetch` caller.

## 6. The order

- **Wave 1, parallel:** A1, A2, A3, R0 to R3. A1 owns `ui/storyui.js`; A2 owns `engine/schema.js`.
- **Wave 2:** A4 and A9 in parallel (different files). A9 waits for A2 (same file).
- **Wave 3, series on `ui/storyui.js`:** A5 after A4, then A13 only if it needs that file.
- **Wave 3, parallel:** A6 (engine), A10 (`ui/record.js`), A11 after A2 (`schema.js`).
- **Wave 4:** A8 after A6 (`trace.js`). A12 after A6, and after the journey worktree merges. R4 and R5 last.
- **Hot file rule:** `ui/storyui.js` takes A1, A4, A5 one at a time in that order. `engine/schema.js` takes A2, A9, A11 in that order. Every slice runs the full commit gate list before it merges.

## 7. Question for the owner

None.
