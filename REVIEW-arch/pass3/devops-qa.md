# Pass 3, DevOps and QA (Sam Oyelaran). Round PK

Built tree, code unchanged since `fed5be4`. Counts in order: engine 3638, functional 1806 (pass 1 run, same code), collide 351, design 186. Design read 185 with 1 failed once ("Field still animates under punch, measured 29.8", floor 30), then 186 clean twice. A flake in the gate (floor with no margin), still a defect.

## 1. The architecture in three sentences
Pure rules in `engine/` read the record and never store a verdict: one reader, one trace view, one Next, one safety screen. The server owns money only; the record, privacy table and backup are the person's. Nothing ships until a named gate fails first on a known bad case.
The merge bent three things: care button "Continue" there, "Keep writing" in the UI seat; the gift shows the whole reading (J8) while three seats say base sight; "private build only" has no mechanism, since every build leaves as one file. Gates read those words from one table, and a public build refuses while the safety table says unreviewed.

## 2. The ICP room
- **Marta, 02:00.** A quiet card in one frame, no red, nothing saved. I can prove speed, no network, no stored verdict, not recall: 13 of 22 apostrophe phrases are missed today when typed curly. "Just keep what I wrote."
- **Nils, skeptic.** Opens Why, six rows with ids. Leaves if a self report reads Confirmed. "Show me where that came from."
- **Camille, practitioner.** Restores her export, hashes match. Leaves if tier four sells an empty roster. "I cannot hand over a file I cannot reopen."
- **Whitney, phone only.** The box takes 80 to 90 ms a key today (4x slowdown). Leaves on lag. "It stuttered, so I stopped."
- **Renata, operator.** Gets counts of distinct days; `confidence` and `score` keys are refused. "Give me the count, not a vibe."
- **Gordon, no clinical.** No label, no modal; Not me changes what comes next, proven. "I said no. Did it hear no?"
- **Sofia, consent.** Reads Stays, Leaves, Delete; who can see is empty until R5 and says so. "How do I take it back?"
- **Trey, tourist.** Funnel: 0 outbound requests. Three locks or fewer on screen one. "Quiz or wall?"

## 3. Unified quality: 62/100
Gaps: cold recall of distress text can only be floored; real D1, Worker CPU and Safari storage clearing cannot be proven in this sandbox; the full list takes about 20 minutes.

## 4. Final grade
`GRADE: 68/100` (pass 1 57; pass 2 not filed by this seat). Up: every slice has a first-red case, six reproduced here. Down: R0 and recall unproven.

## 5. Slices and gates
Files and must-not-touch follow the technical director's table. (m) measured, (e) estimate. Red means it fails on HEAD.

| Slice | Gate: file, asserts, first red, time | Size |
|---|---|---|
| A0 truth sweep | `tools/truth.py`: no string says what a body part "means"; Red: `summary.js:254,293,318`, `drills.js:1348`. | S |
| A1 typing | `tests/perf.js`, 4x slowdown, 1000 words: handler p95 at most 16 ms, frame p95 at most 50. Bare textarea control (m: 0.5 and 20 ms) over 25 reads "gate invalid". Red (m, 3 runs): median 80 to 91, p95 111 to 143. 20 s (e) | S |
| A2 record door | `tests/record.js`, headless: unknown key survives save and load; `RECORD_NEVER` refused by name; import twice gives two ids. Red (m): key dropped, 3 records 1 id. `tools/packcheck.js`: packed stamp equals source (equal today, m). | S |
| A3 privacy | `tests/privacy.js`: every `blankProfile` key (24) and storage key is in `PRIVACY`, including constants like `RIT_KEY` a literal grep misses; runtime wraps `setItem` through a loaded session, writes must be a subset, a planted key must be seen. 40 s (e) | S |
| A4 safety | `tests/safety.js`, `fixtures/safety.json`: floor on known phrases; curly twin of every fixture same level; crisis negation steps down, never void; ordinary false alarms at most 2 per 100; no clinical word out; storage unchanged; last sentence under 1 ms; deleting a cue row fails the gate; cold recall printed, never claimed. `BUILD.sh --public` fails while unreviewed. Red (m): 13 of 22 curly misses. 3 s (e) | M |
| A5 care | `tests/care.js`, Chromium: card in one frame; three buttons from the label table, 48 px, under 25 words; no network; storage unchanged; no motion; colour read by 1 px canvas (so `color-mix()` cannot fool it) with a red div as known good; Next, locks, ladder, "tier" absent by id; commit still works. Red: no card. 40 s (e) | M |
| A6 one reading | `tests/reading.js`: `parseStory`, `srcHear`, `readEntry` agree on every persona text; "not" never raises a seat; curly and case invariance; every span slices back to its word; `equiv.py` shows only named diffs. Red (m): 4 of 10 probe sentences disagree. | M |
| A7 rules | Same file: every source and kind pair; agent sources refused by name; `confidence`, `score`, free text refused; static scan finds exactly 1 promotion order (3 today). | S |
| A8 trace | Extend `tests/trace.js` (266, 0.5 s m): six closed rows in order; a self report never Confirmed; shuffle stores, same chain; declined edge not re-proposed; frozen record shape fails on a new stored key. | M |
| A9 plan | `tests/plan.js`, one test per forge: `granted` over 1,200 refused; lease at `until` plus 3 days; `base` kept on upgrade; downgrade keeps opened ground; tier four closed while `built` is false. Red (m): `granted:1000000` accepted. | S |
| A10 export | `tests/drill.js`, headless: export, wipe, import, hash equal; wrong key fails; cut file says cut; no `crypto.subtle` gives a plain file that says so. Red (m): side keys missing from `pExport`. Key step 128 ms (m). | M |
| A11 deletion | In `record.js` and `privacy.js`: after `forget`, no key holds the id, outbox, session and `unreadable.*` included. Red: they survive. | M |
| A12 `loopRead` | `tests/loop.js`: same answer twice; record unchanged; no `Date.now` or `Math.random` in the file; a reported change or spent supply never moves `next`. `monitor.js` gains a forbidden list ("Day 3", "of 90", "Verified") read from `textContent` so SVG counts, and one Next by id per surface. | M |
| A13 claim row | `tests/claim.js`: Not me changes the next claim and lists in Set aside; hit area by `elementFromPoint` at four corners, not bounding box; quote is a substring of the entry; chain under 300 nodes; DOM and choices against `tests/budgets.json`, which may only fall. 40 s (e) | M |
| R0 | 56 Worker tests (m, 4 s) on a clean `main`; today they pass on a dirty tree, four modified files and an unmerged migration. Then a timed signup on the deployed Worker; node needs 18 to 34 ms for 100k rounds (m), the free limit is about 10 (unverified). Not provable here. | S |
| R1 to R3 | Shared fixtures for the contract; webhook tests for refund, dispute, second subscription; delete then scan every table. 4 s (m) | S |
| R4, R5 | After A2, A10, R0 to R3: merge by id, grant audit rows. Later. | L |

MVP: A0 to A11, R0 to R3. New standing gates: the ten files above, `prove-gates.js` (reruns each gate against its mutation and demands red), and a median of three in `design.js` fps.

## 6. The order
1. `BUILD.sh` 17 s (m), `BUILD-engine.sh` 1.3 s (m).
2. Headless in parallel: engine 10 s (m), trace, practice, daily, then record, reading, safety, plan, drill, loop, truth, packcheck.
3. Voice check and objections.
4. Browser, two at a time: care, claim, privacy, boot 56 s, funnel 8 s, monitor 50 s, collide 43 s (all m).
5. Alone, last: perf, design (141 to 189 s m), functional (687 s m).
A slice runs 1 to 3 plus its own gate; the full list runs before main.
Parallel now: A0, A1, A2, A3, R0 to R3. Series on `ui/storyui.js`: A1, A4, A5, A13; on `engine/schema.js`: A2 then A9; then A6, A7, A8; A12 after the journey merge; A10, A11 after A2.

## 7. Question
None. NOT SIGNED OFF to build A4 or A5 until `safety.js` exists and is red on HEAD. Signed off on the order.
