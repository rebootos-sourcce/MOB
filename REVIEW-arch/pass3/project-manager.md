# Pass 3, project manager (Rosa Iwasaki). Round PK, 2 October

Read: `PASS3-INSTRUCTIONS.md`, `PROPOSAL.md`, the eight pass 2 reports, and the plan blocks in `PLAN.md` section J. Checked in the repo: `journey.js` sits only in the dirty worktree `.claude/worktrees/agent-ad7f4b5294abbc82c` (533 lines, uncommitted, and it edits `schema.js`, `ui.js`, `release.js`, `export.js`). `distress.js` is on branch `worktree-agent-a6d4e60928876b711`, commit `c1cbc1a`. This file is the one merged table; the other seats write their own parts.

## 0. The architecture in three sentences, and what the merge bent

Reading, trace and Next are pure functions in `engine/` over the four stores that already exist; nothing new is stored except two closed lists (`p.trace.declined` and `addrs` on `journey.runs`) and one carry bag for unknown keys. A safety screen runs before any of it, stores nothing, and quiets the screen for one entry. The server owns tier, status and period only; the browser owns pace, content and the record.

What the merge bent, from a sequencing view: (1) it never says that `journey.js`, which `addrs` and `loopRead` both need, is an unmerged dirty tree that edits `schema.js`. It is now a slice (P19). (2) It never says that Next and the new right rail land on the files that plan blocks J2, J3 and J4 are about to rewrite. Next now waits for J4 (P18b). (3) The care register needs a `care` argument that the lock, Next and commerce all read, so P09 must land before them.

## (a) The single slice table, in build order

Sizes against this codebase. S is about 1 agent day, M about 2 to 3, L about 5. An agent day is one build agent from worktree to green gates, merge included. Every slice also needs the standing gates: `./atuned_src/BUILD.sh`, `BUILD-engine.sh`, `tests/engine.js`, `functional.js`, `collide.js`, `design.js`, plus `tools/monitor.js`, `funnel.js`, `boot.js` and the voice check. The counts are read off the run, never typed (the numbers in the brief are dated; the journey worktree already reports bigger ones). "Gate" below is the extra proof that slice adds.

Aliases. A = technical `A1..A13`, R = server `R0..R5`, C = creative slice number, W = narrative `W1..W6`. Overlap names the plan block, if any.

| id | name | goal | owns | must not touch | gate | size | depends on | group | MVP | overlap |
|---|---|---|---|---|---|---|---|---|---|---|
| P01 | Re-measure (uiux slice 0) | Fresh counts of DOM nodes, choices per screen, gate totals, so budgets are real | `MONITOR.log` stamp only | any source | `monitor.js` block diffed against the 1 October numbers | S | none | W1 | yes | none |
| P02 | Typing floor (A1, C4) | Paint in one frame, parse after a 150 ms pause | `ui/storyui.js` (`stRefresh`), new `tests/perf.js` | engine, record | `perf.js`: input p95 at or under 16 ms at 1000 words, 4x throttle (79 ms median today) | S | none | W1 | yes | none |
| P03 | Record door (A2, C3) | Carry unknown top level keys (`p.carry`, 256 KB, depth 6), `RECORD_NEVER` by name, new id on import, duplicate id repair, `bindStore(get,set,del)`, one storage budget by name | `engine/schema.js`, `pImport`, `ui/ui.js` store binding, repack `atuned-packed.html` | `SCHEMA_V`, TAB integers, strings | `engine.js`: a newer key survives an older save; import twice gives two ids; delete reads back | M | none | W1 | yes | none |
| P04 | Truth sweep and voice gates (W1, W3, C2) | Six causal lines rewritten, "Improve the Models" toggle gone, "Not your stories" replaced, Tula name on the buy page; new sensation rule and lead verb rule | `ui/summary.js`, `ui/drills.js`, `ui/account.js`, `funnel/buy.html`, `objections.json` | engine, `storyui.js` | voice check runs first and FAILS on `summary.js:293`, then passes; `funnel.js` | S | none | W1 | yes | J9 |
| P05 | Safety engine, self harm kind (A4 engine, C1, AI 1) | Merge `distress.js`, fold the curly apostrophe inside it, negation steps down one level, raw span out, cues as data, version stamp, built once not per call | new `engine/distress.js`, cue data, `MANIFEST`, new `tests/safety.js` | `sniff.js`, `lexicon.js`, `storyui.js`, any stored key | `safety.js`: the six measured misses hit; curly mark hits; no clinical word in output; cold set recall PRINTED, not claimed; commit never blocked; `hostfree.py` | M | none | W1 | yes | J0 |
| P06 | Server deploy (R0) | Commit and merge the four modified files, price ids, `BASE_PLAN=0`, return address reads `?billing=`, one timed real sign up on the deployed Worker | `reboot-os` only | the MOB repo | the server's own 30 tests plus one run on a real D1 and a timed sign up | S | owner steps (price ids, secrets) | W1 | yes | none |
| P12 | One reading (A6, C5) | `readEntry`: tokenise once, one negation handler, `lex` stamp; `parseStory` and `srcHear` read from it; fix the `addicted` and `numb` data rows | new `engine/reading.js`, `sniff.js`, `sourceai.js`, `lexicon.js` rows only, `MANIFEST` | lexicon weights, `trace.js`, UI | agreement test over the story bank (zero disagreements); adding "not" never raises a seat; `equiv.py`; 1000 word parse under budget | L | none | W1 | yes | J10 (after) |
| P05b | Safety kinds (AI 6, C1) | Danger, medical, substance, past harm as cue data; care only, never a label | `engine/distress.js`, cue data | `sniff.js`, UI | `safety.js` per kind; "my chest gets tight" triggers nothing | M | P05 | W2 | yes, private build only | J0 |
| P07 | Server hygiene (R1, R2, R3) | Plan integers against client keys; refuse a second live subscription; hear refund and dispute events; delete clears every table | `reboot-os` | MOB repo | contract test fails on drift; webhook tests; delete then scan every table | M | P06 | W2 | yes | none |
| P08 | Privacy table (A3) | `PRIVACY` data table, build fails on any unlisted key; `crypto` and `indexedDB` join the ban list | new `engine/privacy.js`, `tools/hostfree.py`, `tests/engine.js` | strings, `account.js` | fails if a `blankProfile` key, a `localStorage` literal in `ui/` or a server column is missing | S | P03, P04 | W2 | yes | none |
| P09 | Care register and Help sheet (A5, W2, C1) | Three outcomes; quiet for one entry (motion stops, Next and locks gone); card quote, one number, Call, Text, Continue, under 25 words; the runtime `care` accessor, never stored | new `ui/care.js`, a thin hook in `storyui.js`, CSS | Ritual, Compass, record | `functional.js`: card shows, Continue works, choices on screen fall, nothing stored; `design.js` | M | P02 (same file), P05 | W2 | yes | J0 |
| P19 | Land `journey.js` with `addrs` (new) | Commit the worktree, rebase onto P03, add `addrs` and `JOURNEY_V` before it ships | `engine/journey.js`, `journeyui.js`, `onboarding.js`, `schema.js`, `release.js`, `export.js` | `ui.js` beyond its hook | its own `tests/journey.js`; runs refused by name if outside the 112 addresses; old record loads | M | P03 | W2 | yes | J1 |
| P13 | One rule table (A7, C5) | `obsValid` and `SRC_CEIL` replace the three copies of "an inference never becomes a fact" | `engine/reading.js`, `trace.js`, `daily.js` | `TRACE_PROMOTE` meaning | every source and kind pair; a test fails if a fourth copy appears | S | P12 | W2 | yes | none |
| P10 | Entitlement rules (A9, sales list) | Refuse `granted` above 1,200, read the smaller of `granted` and tier grant, lease on `until` plus 3 days, `base` kept on tier change, banking cap 120, five verbs through `planCan`, `lead` carries `built:false`, tier four reads "Opens with the lead suite" | `engine/plan.js`, `schema.js`, `funnel/buy.html` | server, lock UI | one test per forge; downgrade keeps opened ground; a refused run re-reads `/v1/me` once | M | P03, P19 (schema series), P06 | W3 | yes | none |
| P11 | Gift and lock (J8, sales 4) | Gift shows the whole reading as the owner ruled; gift end says what is kept; one lock line per layer group (9 padlocks to 3 or fewer); "Unlock all sight" behind `?dev=1`; nothing sells in care | `engine/plan.js`, `ui/lock.js`, `ui/login.js`, `ui/plans.js` | `storyui.js`, server | `planSees(null,'sab')` true during gift; lock count at or under 3 on first Field; nothing prints with `care` on; `locks.js` | M | P10, P09 | W3 | yes | J8 |
| P14 | The trace (A8 engine, C6) | `traceChain` (six closed rows), `p.trace.declined` (cap 500, random ids), a declined edge is not proposed again | `engine/trace.js`, `practice.js`, `daily.js` | `p.rituals` cutover, UI | every Summary sentence resolves to ids; `trace.js` test; refused by name | M | P13 | W3 | yes | none |
| P17 | First writers (A8 writers, W6 in part) | A real run writes practice evidence and a run row with `addrs` | `ui/release.js`, `ui/ritual.js` (one call each) | `storyui.js`, scoring | `p.practice` non empty after a real run; nothing pays for a report | S | P19, P14 | W3 | yes | none |
| P15 | Claim row (A13, C7, W5) | One live Maybe with a quote; Fits, Not me, Why; Set aside list; Not me changes what shows next | new `ui/claim.js`, a hook in the `storyui.js` imprints panel | `ui/imprints.js` (J4's), DOM budget up | `functional.js`: Not me changes what shows next; claim row 4 nodes; list under 300 | M | P14, P09 (same file) | W4 | yes | none |
| P18a | Loop read and sayNext (A12 engine, C8) | `loopRead(p,now,care)` pure, one slot, fixed order, silent in care, never a day or stage | new `engine/loop.js`, `engine/says.js`, `MANIFEST`, `tools/loopsim.js` | UI, record | strings "Day", "of 90", a stage name never render; `loopsim.js` price; `planNextSight` never an input | M | P19, P14 | W4 | yes | none |
| P16 | Why chain (A13 chain, C7) | Six rows inline, a sheet on a phone, quote the raw words, "Nothing recorded." | new `ui/why.js` | `storyui.js` beyond a hook | every row resolves to ids; DOM under 300 nodes | M | P14, P17, P15 | W4 | yes | none |
| P20 | Side stores, forget, entry delete (A11, systems 4.8) | `p.side` holds the two side stores; `forget(id)` reaches every key and reads each back; entry level delete | `schema.js`, `ui/account.js`, `ui/ritual.js`, `ui/avatarui.js` | `accForget` meaning | delete then scan `localStorage`: no key holds the id; export then import equal incl. side | M | P10 (schema series), P08 | W4 | yes | none |
| P18b | Next slot and the rail (A12 UI, C8) | One Next replaces four doors and three cards; rail is Next, one live Maybe, accordions folded | `ui/component.js`, `ui/ui.js`, `ui/summary.js` | `imprints.js` beyond J4's | one Next per surface; first Field choices 30 or fewer (49 now); `design.js` | M | P15, P18a, P11, **J4 merged** | W5 | yes | J4 |
| P21 | Encrypted export and restore drill (A10, C9) | PBKDF2 plus AES-GCM file with header and length; cut file says so | new `ui/backup.js` | plain `pExport` format | export, wipe, import, hash equal; wrong password fails; no `crypto.subtle` says the file is plain | M | P20 | W5 | yes | none |
| P09b | Kind cards (W2) | Strings for medical, substance, danger by kind | `ui/care.js`, data | `storyui.js` | `safety.js` card per kind; no label word | S | P05b, P09 | W3 | yes, private only | J0 |
| P22 | Data page and consent (W4, C9) | Stays, Leaves, Delete from the table in two states; three consent boxes; "People who can see this record" read from grants | `ui/account.js`, profile sheet | tab list | generated text equals the table; no unlisted key | M | P08, P20, P21 | W5 | yes | none |
| P23 | Release candidate | Whole gate run on the merged tree, repack, ICP walk, public gate list | integrator only | slices | all gates, `monitor.js` diff, packed file stamp equals `source.html` | M | all MVP | W6 | yes | J7 after |
| L1 | Ring and avatar from dated facts (C11) | Four quarters lit by newest dated act, dim after 14 days | `ui/rings.js`, `avatarui.js` | any stage name | `design.js` | M | P18b | later | no | none |
| L2 | Confirmed ask after a ritual (C12, W6) | One question at most once a session | `ui/ritual.js` | scoring | functional | S | P17 | later | no | none |
| L3 | Sync kinds (R4) | One sealed chunk per day, merge by id | server and `ui/auth.js` | `engine/` | restore across devices | L | P03, P21, P06, P07 | later | no | none |
| L4 | Practitioner grants (R5) | `grants`, audit rows, visible list, revoke | server, UI | none | revoke test | M | L3 | later | no | none |
| L5 | Trauma detection, locales, lead suite, signed lease, founding seats, crypto shredding, end to end encryption | Each needs its own ruling or evidence | none yet | none | none yet | L | named in section (c) | later | no | none |

## (b) Critical path and parallel work

Hot files and their order (series, never two worktrees at once):
- `ui/storyui.js` (1,828 lines): P02, then P09, then P15. To shrink it, each slice puts its code in a new file (`care.js`, `claim.js`, `why.js`) and leaves a hook of a few lines.
- `engine/schema.js` (1,621 lines): P03, P19, P10, P20.
- `engine/plan.js`: P10, then P11.
- `sniff.js`, `lexicon.js`: P12, then J10.
- `trace.js`, `daily.js`: P12, P13, P14.
- `ui/ui.js`, `component.js`, `summary.js`, `imprints.js`: J2, J3, J4, then P18b.
- `ui/account.js`: P04, P20, P22. `release.js`: P19, then P17. `MANIFEST`: one line each, merged in order.
- `source.html`, `engine.js` and `atuned-packed.html` are build products and conflict on every merge. Slices commit sources only; one integrator rebuilds and runs the gates on the merged tree, as the standing process says.

Critical path, about 17 agent days in series: P12 (5), P13 (1), P14 (2.5), P15 (3), P18b (3), P23 (2). A second path of equal length: P03 (2.5), P19 (2.5), P10 (2.5), P20 (3), P21 (3), P22 (2.5). P18b also waits on J2, J3, J4, about 10 more days, but that runs beside the others.

Wave 1 (day 1, separate sparse worktrees, no shared file): P01, P02, P03, P04, P05, P12, and P06 in the server repo. Cap at four builders at once, because browser gates need a quiet machine. Sparse checkout holds `atuned_src/`, `tests/`, `tools/` and `MANIFEST`.

## (c) The cut line

MVP (private build, the owner and closed testers): P01 to P23 above. Safety kinds and cards are private build only.

Public launch adds, and these are not slices: clinician and counsel review of every cue list and the 988, 911 and SAMHSA lines; one timed real sign up passed; the restore drill proven on a real iPhone; tier four closed; the gift end copy read by the owner.

If time runs short, cut in this order: P16 (Why chain), then P22 down to the table gate only, then P09b. Never cut P02, P03, P05, P09, P10, P21; each protects a person or the money.

Explicitly later, with reasons: ring and avatar (needs Next first); Confirmed ask; sync and practitioner grants (the second wave); lead suite (tier four stays closed until it exists); trauma detection (no evidence named yet); locales; meter service (a server that sees keys learns what a person opens); `p.ledger` (a second truth); stage stamps and a "Where you are" tile (a grade, and a loss frame); end to end encryption (forfeits support recovery, needs a ruling); IndexedDB (breaks the synchronous `bindStore`); encrypting local storage (theatre).

## (d) Risks

1. Unmeasured safety recall: 5 of 18 on cold phrases. The gate proves a floor, and copy must say "it misses things". A private build only, and nothing may claim monitoring.
2. J4 is on Next's path and is an L. Mitigation: hand J4's agent the rail contract now (slot one reserved for Next, slot two for the Maybe).
3. P12 changes how every reading is made. Test totals will move. Ship it as zero output change except a named diff, with `equiv.py`.
4. `journey.js` is uncommitted and diverging from `schema.js` every day. Commit it first (P19) even before it is rebased.
5. The gift. Three seats call it a take-away at gift end. The owner ruled it stands. The risk is copy, so P11's gate includes the lock line text.
6. Server work depends on owner steps and on facts I could not verify (Workers CPU limit, D1 write limits, Safari storage clearing). Verify each before P06 and L3.
7. New gates (`perf.js`, `safety.js`, journey) are ungated until they are added to the pre-commit list in `CLAUDE.md`. The funnel gate was missing for the same reason.
8. DOM budget: 3,998 nodes against 3,000. Every UI slice must replace something; P01 sets the line.
9. Scope creep inside good ideas: a ranked Maybe list, a ring with stage names, trauma cues without a detector, a score beside a chain. All cut above.
10. Phone cost: PBKDF2 at 600,000 rounds on an old phone. P21 must time it at 4x throttle.

## (e) Honest estimate in agent days

Build: 8 S (8 days), 17 M (42.5), 1 L (5), about 55 agent days. With 20 percent for rebase, gate reruns and rework, about 67. Add J2, J3, J4 (about 10) and J10 (5) that sit on or beside the path, about 82. Wall clock with four builders and one integrator: 18 working days if nothing slips, 24 likely, 32 if the merge queue or J4 stalls. External waits, not agent time: owner steps for P06, clinician and counsel for the public gate.

## (f) The ICP room, from a sequencing view

- Marta, acute distress, 02:00. Nothing helps her until P05 and P09 land; P02 matters first because a laggy box is the worst place for lag. Until P09b only the self harm card exists. "Just show me where to call."
- Nils, the skeptic. P04 removes the false lines, P15 gives his No a result, P16 shows the chain; P16 is the first cut, so he waits longest. "Show me why you said that."
- Camille, somatic practitioner. P04 (a sensation is a report, not a cause) wins her; the grants list is empty until L4, so her clinic use waits. "Do not tell my client what their body means."
- Whitney, phone only. P02, P03, P21: she gets a backup before sync. Without P21 a cleared Safari loses her record. "Where did my reading go?"
- Renata, operator, wants the chain as a number. She gets counts of days and entries only, from P16, never a score. This is a ruled loss. "Give me a figure I can track."
- Gordon, refuses anything clinical. P09 has no label, no modal, no red; P15 lets him say no. "Do not name me."
- Sofia, needs the consent list. P08 and P22 show the data table; real grants are L4, so the list is honestly empty and tier four stays closed (P10). "Who can see this?"
- Trey, quiz tourist. P18b gives him one next act; P11 gives a gift and a lock that says what is kept; J1 onboarding is his front door. "Fine, what do I do now?"

## (g) FINAL GRADE

GRADE: 72/100 (the PM seat was not graded in pass 1 or 2; the other seats averaged about 55 then 66).

Up: one ordered table, series and parallel marked, the hot files named, build products handled by one integrator. Down: a clinician and counsel dependency outside our control; J4 on the path; the journey tree uncommitted; server facts unverified; new gates not yet written; the 18 to 32 day range is wide.

## Not doing this round, and why

Everything in section (c) under later. Also J10 coverage, J1 build and J7 copy check: separate plan blocks, ordered around this table (J10 after P12, J7 last).

## Needs a ruling

None. Two owner actions, not rulings: the Stripe price ids and secrets for P06, and booking a clinician and counsel review before the first public launch.
