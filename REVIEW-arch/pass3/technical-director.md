# Pass 3, technical director (Anders Kjeld). Round PK

Not yet in the tree: `engine/reading.js`, `loop.js`, `privacy.js`, `tests/perf.js`, `tests/safety.js`. The safety reader lives only on branch `worktree-agent-a6d4e60928876b711` (commit `c1cbc1a`). The "inference never becomes fact" rule sits in `trace.js` (twice) and `daily.js` (`dlyGroundOne`). Hot files: `ui/storyui.js` (117 KB), `engine/schema.js` (97 KB).

## 1. The architecture in three sentences

Reasoning stays as pure functions in `engine/`: one shared reader, one rule for what an inference may become, a derived trace chain, a derived loop read, and a safety screen that stores nothing. The screen shows one Next, one Maybe and, when needed, a quiet care card, while the record gets additive keys only and a privacy table that a build gate enforces. The server owns tier and money, the browser owns pace. The merge bent one thing I care about: it files the typing floor (A1) as one slice of thirteen, when it is the floor under all the others, because every new function lands on a path already at 79 ms median.

## 2. The ICP room

- **Marta, 02:00, distress, phone.** Sees a box that must not lag. At 4x throttle the handler is 79 ms; letters trailing her fingers feels like not being heard. After A1 it is 16 ms or less. The safety screen costs about 40 microseconds on the last sentence (estimate). She gets one card: Call, Text, Continue. She leaves if it is a modal. "Please just let me type."
- **Nils, skeptic.** Opens Why and counts rows. Six closed rows that resolve to ids are checkable, so he stays. A number he cannot trace sends him away. "Show me where it got that."
- **Camille, practitioner.** Exports, imports on a second machine. A2 and A11 make the round trip equal, side stores included. Without them she holds a second record with the same id. "My client's file must come back whole."
- **Whitney, phone only.** Cold start matters: 2.4 MB raw (measured 27 September), packed about half. One Next replaces seven cards, so the DOM falls toward 3,000 from 3,998. Safari may clear storage after about seven days (from memory, verify on a real iPhone), so A10 is her only honest backup. "Did I lose it?"
- **Renata, operator.** Wants the chain as a number. She gets counts of distinct days, never a score. `traceChain` is pure, so a count export is cheap later. "Give me the count, not a mood."
- **Gordon, refuses clinical.** No state names, no label, Not me works and changes what shows. He leaves if Maybe reads like a diagnosis, a copy matter. "I did not say that."
- **Sofia, consent list.** The list is generated from the `PRIVACY` table, so it cannot drift from the code. No grants exist before R5, so it says nobody, which is true. "Who can see this, today?"
- **Trey, quiz tourist.** Sees the first screen at once if cold start holds. Never meets the chain or care. Leaves at a wait over about three seconds (estimate). "Is this a quiz or not."

## 3. Unified quality: 70 out of 100

Gaps:
1. Nothing new is measured. Figures for A4, A6 and A12 are estimates until `tests/perf.js` exists. My budget is 8 ms of the 16.7 ms frame.
2. The safety reader got 5 of 18 on phrases it had not seen. Private build only is right, but the gate must say it is a floor on known phrases, not recall.
3. DOM is 3,998 against a budget of 3,000. Claim row, Next and Why all add nodes, so "net down" must be a gate.

## 4. FINAL GRADE

GRADE: 70/100 (pass 1 62, pass 2 66). Up: the typing fix is named first, one reader replaces two, record loss is fixed before any new write, privacy is a gated table. Held back by missing measurements and a server that has never run on a real D1.

## 5. My part of the slices

Format: name, goal | changes | must not touch | gate | size | unlocks | MVP | what ICPs feel.

- **A1 Typing floor.** Paint in one rAF, parse after a 150 ms pause. Changes `ui/storyui.js` (`stRefresh`), new `tests/perf.js`, `tools/monitor.js` stamp. Not engine or record. Gate: 1000 words at 4x, input p95 at or under 16 ms. S. Unlocks A4, A5, A6. MVP. Marta no lag, Whitney no heat.
- **A2 Record door.** Carry unknown top level keys (256 KB, depth 6), new id on import, one storage budget. Changes `engine/schema.js`, `pImport`. Not `SCHEMA_V`, TAB integers. Gate in `tests/engine.js`: a newer key survives an older save; import twice gives two ids; over budget names the key. S. Unlocks A9, A10, A11. MVP. Camille's file returns whole.
- **A3 Privacy table.** Changes new `engine/privacy.js`, `atuned_src/hostfree.py`, `ui/account.js` (remove the toggle). Not strings. Gate: build fails on a `blankProfile` key missing from the table; `crypto` and `indexedDB` banned in `engine/`. S. Unlocks A10, A11, R3. MVP. Sofia's list matches the code.
- **A4 Safety screen.** Merge `c1cbc1a` as `engine/distress.js`, cues as editable data. Changes `MANIFEST`, `ui/storyui.js` call site. Not commit semantics, record. Gate in new `tests/safety.js`: six known misses hit, negation never voids a crisis cue, curly apostrophe, nothing stored, works offline, cold recall printed not claimed. M. Unlocks A5. MVP, private build only. Marta feels quiet.
- **A5 Care register.** Three outcomes, one card, motion stops. Changes `ui/storyui.js`, CSS. Not Ritual, Compass. Gate: `functional.js` card appears and Continue works; `design.js`; choices on screen fall. M. Unlocks public launch after clinician review. MVP. Marta: no modal.
- **A6 One reading and one rule.** `readEntry`, one negation handler, `lex` stamp, `obsValid` with one `SRC_CEIL` table. Changes new `engine/reading.js`, `trace.js`, `daily.js`. Not lexicon weights, `TRACE_PROMOTE` meaning. Gate: story bank agreement at zero disagreements; `tools/equiv.py`; 1000 word parse under 5 ms (about 3.5 ms saved, estimate). M. Unlocks A8, A12. MVP. Nils gets the same answer twice. This merges pass 2 A6 and A7.
- **A8 Trace chain.** `traceChain`, `declined`, first writers. Changes `engine/trace.js`, `ui/release.js`. Not `p.rituals`. Gate: every Summary sentence resolves to ids; a declined edge is not proposed again; `p.practice` non empty after a real run. M. Unlocks A13. MVP. Nils, Renata.
- **A9 Entitlements on `SIGHT`.** Clamp `granted`, lease on `until` plus 3 days, keep `base`, free banking cap. Changes `engine/plan.js`, `engine/schema.js`. Not server. Gate: one test per forge; downgrade keeps opened ground. S. Unlocks R0 contract. MVP. Whitney pays and is told.
- **A10 Encrypted export.** Changes `ui/record.js`. Not plain `pExport`. Gate: export, wipe, import, hash equal; wrong key fails; cut file says so; no `crypto.subtle` gives a plain file that says so. M. Unlocks R4. MVP. Whitney, Camille.
- **A11 Deletion and side stores.** Side stores into `p.side`. Changes `ui/account.js`, `engine/schema.js`. Not `accForget` meaning. Gate: delete, then scan `localStorage` for the id. M. Unlocks R3. MVP. Sofia.
- **A12 `loopRead` and Next.** Changes new `engine/loop.js`, `ui/component.js`. Not any day count in UI. Gate: `tools/loopsim.js`; "Day" and "of 90" never render; one Next per surface; DOM falls. M. Unlocks ring and avatar. MVP. Whitney, Gordon.
- **A13 Claim row.** Fits, Not me, Why as a plain list under 300 nodes. Changes `ui/imprints.js`, `ui/storyui.js` only if forced. Not a canvas. Gate: Not me changes what shows next; DOM total below 3,998. M. Unlocks the Confirmed ask. MVP. Gordon, Nils.

Server repo `/home/user/reboot-os`, all touching only that repo: **R0** deploy (S; 30 tests plus one real D1 run; MVP). **R1** plan integer contract test (S; fails on drift; MVP). **R2** one live subscription, refund and dispute events (S; webhook tests; MVP). **R3** deletion clears every table (S; delete then scan; MVP). **R4** sync kinds, one sealed chunk per day (L; after A2, A10, R0 to R3; later). **R5** practitioner grants with audit and revoke (M; after R4; later; Sofia sees a real list). `ui/auth.js` stays the only `fetch` caller.

## 6. The order

- **Wave 1, parallel:** A1, A2, A3, R0 to R3.
- **Wave 2:** A4 (after A1) and A9 (after A2), in parallel.
- **Wave 3:** A5 after A4 on `ui/storyui.js`; A6, A10 and A11 (after A2) in parallel.
- **Wave 4:** A8 after A6. A12 after A6 and the journey worktree merge. A13 after A5. R4, R5 last.
- **Hot files in series:** `ui/storyui.js` takes A1, A4, A5, A13. `engine/schema.js` takes A2, A9, A11.
## 7. Question for the owner

None.
