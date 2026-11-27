# Pass 2, technical director (Anders Kjeld). Round PK, 2 October

Read all eight other pass 1 reports. No new measurements. Numbers are my pass 1 ones (headless Chromium, 4x CPU throttle as a stand in for a four year old laptop) or marked estimates.

## 1. AGREEMENTS

- **The ledger is a derived view, not a store.** AI, systems, creative, game and me. Four stores already hold it (practice evidence, trace edges, practice log, daily resolve). A fifth store would be two truths and would add a sync problem. I withdraw my pass 1 `p.ledger` key.
- **The "inference never becomes fact" rule exists three times** (`TRACE_PROMOTE`, `TRACE_CAUSE_SRC`, `dlyGroundOne`). AI and systems found it in code, creative in the rulings. Merge, do not add a fourth.
- **The competition is duplicate code, not agents.** AI measured it: `parseStory` and `srcHear` disagree on negation. Nothing autonomous exists to arbitrate.
- **Nothing screens text for distress at runtime.** AI, narrative, uiux, creative, systems, me. The reader (`distress.js`) is on the unmerged branch.
- **Confidence must not be a number a screen shows.** AI and systems (`daily.js` refuses `confidence` by name). Use a rung and counts a person can check.
- **A server owned meter cannot work.** Sales and me. All content ships in the file.
- **No gate on access from days or stages.** Game, creative, uiux. A derived read that orders one suggestion.
- **Old builds delete new top level keys.** Systems measured it. It sets the order of my first slices.

## 2. DISAGREEMENTS

- **Sales vs my pass 1 meter endpoint.** I proposed `POST /v1/ground/open {key}`. Sales is right: a server that sees keys learns which addresses a person opens, and `OB_NEVER` keeps `meter` off the wire. I drop it. The server owns tier, period and a lease. The browser owns pace. Server authority protects the money, not the content.
- **Sales vs my pass 1 downgrade latch.** I said latch layer sight per opened address on the server. Sales says layer sight is a property of the tier (the owner's 1 October table) and ground is what stays. I take Sales: latch ground only (`meter.unique`, reruns, journal, history, all already on the device). A lapse takes layer sight, and the lock says what is kept. Reason: a per address server table with nothing to enforce is cost with no protection.
- **Systems vs game on where the run log lives.** Game says `p.meter.runs`, systems says `journey.runs` in the unshipped worktree. One run log, not two. I side with `journey.runs` with `addrs` added, because it is unshipped and can change for free. Needs the journey worktree merged first.
- **AI (four levels) vs narrative (seven states) vs creative (three outcomes).** Engine returns `{level: none | care | crisis, route: null | medical | substance | abuse}`. The person sees three outcomes: nothing, a change of pace, a card that says a person can help now. State names never print (narrative block A). Reason: the engine needs routes to pick the right card; the screen needs fewer words.
- **Name collisions.** `journeyRead` exists in the worktree and means onboarding position. `ledgerRead` exists in `ladder.js`. So the new reads are `loopRead` and `traceChain`, not `journeyRead` and `ledger`. Copy words ("held", "Confirmed", "reading rules") belong to the voice seat; I do not care which, only that code names are not reused.

## 3. WHAT I MISSED

- **AI: one shared parse (`readEntry`) pays for my keystroke fix.** `parseStory` and `srcHear` each cost 3.5ms at 1000 words, and both run on each keystroke. One parse feeds both. Estimate, not measured: about 3.5 of the 12.8ms `stRead` cost goes away. I had only proposed a debounce.
- **Systems: unknown keys.** I called the ledger shape "the irreversible risk". The bigger one is that a stale downloaded file deletes whatever it does not know. Fix before any new write exists.
- **Systems: deletion holes and duplicate ids.** `STORE_KEPT`, `source.profiles.unreadable.*`, `source.outbox` and two side stores survive "delete". Importing your own export makes a second record with the same id. Both break the restore drill I asked for.
- **AI: `distress.js` recall.** Narrative quotes 31 of 33 on its tuning set and 5 of 18 cold. My "fixture floor" gate must therefore say what it measures: a floor on known phrases, not recall.
- **Sales: `until` unused and `granted` up to 1,000,000.** Both are cheap client fixes I had not found.

## 4. THE ARCHITECTURE, TOGETHER

**Shape.** All reasoning stays pure functions in `engine/`. No service, no new store except two small additive lists. Crypto and network stay in `ui/`; `ui/auth.js` stays the only file that calls `fetch`. Add `crypto` and `indexedDB` to the `hostfree.py` ban list.

**Stored additions (all additive, flagged for the owner, no `SCHEMA_V` bump).** `SCHEMA_V` is 2 already; modules version themselves. (a) `p.trace.declined`, closed list `{from, edge, to, at}`, bumps `TRACE_V`. (b) `addrs` on each `journey.runs` entry. (c) Nothing else. No safety result is stored, ever. A stored distress flag is a surveillance record and goes in `OB_NEVER`. Any new list that may sync carries a random id plus a clock stamp, never an array position.

**Settled for section 4 (my side of the eleven):**
1. Ledger: derived view (`traceChain`). 2. Hypothesis: a `proposed` trace edge plus the declined list; no ranked list, no surface in MVP. 3. Next: one derived slot, in the person's words, an order and never a score. 4. 90 day engine: `loopRead(p, now, care)`, pure, never stored, no days printed, gates rest on free acts only. 5. Safety: above. **Interim:** build now with a conservative, recall leaning cue list kept as data a clinician can edit; ship to the private build; clinician review is a gate on the first public release. That is acceptable because no public person is exposed before then and the Help line says it misses things. States with no detection yet: possible trauma, activated, and most of substance and abuse. They get pace and withdrawal rules only where a cue exists. 6. Entitlements: re-cut onto `SIGHT`, five verbs, ground latch only. 8. Record: carry unknown top level keys, new id on import, side stores into the record. 10. Privacy: `PRIVACY` data table with a gate, "Improve the Models" toggle removed (it has no reader and research sharing is ruled off), deletion reaches every key, encrypted export.

### The order of slices

Lanes run in parallel. Within the MOB lane, slices that touch the same file run in series, because worktrees conflict on `ui/storyui.js` (A1, A4, A5, A6) and on `engine/schema.js` (A2, A12).

**MOB lane (`atuned_src/`)**

| # | Slice | Size | Files | Gate that proves it | Must not touch |
|---|---|---|---|---|---|
| A1 | Typing floor | S | `ui/storyui.js` (`stRefresh`): paint in one rAF, parse after a 150ms pause | new `tests/perf.js`: 1000 words at 4x, input handler p95 at or under 16ms (79ms median today); bytes stamped in `MONITOR.log` | engine, record |
| A2 | Record safety | S | `engine/schema.js` (carry unknown top level keys, report by `status()` if dropped), `pImport` (new id on import) | `tests/engine.js`: newer key survives an older save; import twice gives two ids | `SCHEMA_V`, TAB integers |
| A3 | Privacy table | S | new `engine/privacy.js` (data), `tools/hostfree.py`, remove the toggle in `ui/account.js` | build fails if any `blankProfile` key is missing from the table; hostfree passes with the new ban words | strings (voice seat) |
| A4 | Safety screen | M | merge `distress.js` from `c1cbc1a` after `sniff.js` in MANIFEST; cue lists as data; `ui/storyui.js` calls it on a sentence end (last sentence only, about 40 microseconds, estimate) and on commit | new `tests/safety.js`: the six measured misses in AI's table must hit; negation not honoured for crisis; no clinical word in output; commit never blocked; works offline; cold set recall printed, not claimed | commit semantics, record |
| A5 | Care register | M | `ui/storyui.js`, CSS; three outcomes; "Quiet is on for this entry" line | `tests/functional.js`: card shows, Keep writing works, choices on screen fall, nothing stored; `tests/design.js` | Ritual, Compass |
| A6 | One shared reading | M | new `engine/reading.js` (`readEntry`, negation once, `lex` stamp); move `srcHear`, trace, daily over | agreement test over the story bank (target zero disagreements); `tools/equiv.py`; 1000 word parse under budget | lexicon weights |
| A7 | Reading rules | S | `engine/reading.js` (`obsValid`, agent ceiling table) replacing three copies | every source and kind pair; agent sources refused by name | `TRACE_PROMOTE` meaning |
| A8 | Trace chain and writers | M | `engine/trace.js` (`traceChain`, `declined`), first writers from release and story cards via `practiceDo` | every Summary sentence resolves to ids (`traceOrphans` precedent); a declined edge is not proposed again; `p.practice` non empty after a real run | `p.rituals` cutover |
| A9 | Entitlements on `SIGHT` | S | `engine/plan.js`, `engine/schema.js`: clamp `granted` to the tier grant; lease on `until` plus 3 day grace; base kept on tier change; free banking cap 12 weeks; verbs as keys | one test per forge in Sales' list; downgrade keeps opened ground; a refused run re-reads `/v1/me` once | server |
| A10 | Encrypted export | M | `ui/` backup (PBKDF2 600k plus AES-GCM, header with format, KDF, iv, length) | restore drill: export, wipe, import, hash equal; wrong key fails; cut file says it was cut; no `crypto.subtle` gives a plain file that says so | plain `pExport` format |
| A11 | Deletion and side stores | M | `ui/account.js`; side stores (`atuned-ritual-active`, `atuned-avatar-side`) into the record, flagged | delete then scan `localStorage`: no key holds the id; export then import equal including side stores | `accForget` semantics |
| A12 | `loopRead` and Next | M | new `engine/loop.js`; `ui/component.js` replaces four doors and three cards with one Next | `loopsim.js` price; the strings "Day", "of 90" and a stage name never render; one Next on each surface | days anywhere in UI |
| A13 | Claim row and Why | M | `ui/storyui.js` imprints panel, plain list under 300 nodes (not a canvas) | `functional.js`: Not me changes what shows next | DOM total (3,998 now, budget 3,000: net down) |

**reboot-os lane (`atuned/server`, own repo)**

| # | Slice | Size | What | Gate |
|---|---|---|---|---|
| R0 | Deploy first | S | Commit the four modified files, merge to `main`, check the local checkout against `origin/main`, set price ids and secrets, `BASE_PLAN=0`, return address reads `?billing=`. Confirm the Workers plan (10ms CPU on free, estimate to verify) and the D1 region | the 30 existing tests plus one run on a real D1, which has never happened |
| R1 | Contract test | S | plan integers (`PLAN_OF`, 0 to 4) against client keys (free, one to four) | test fails on drift |
| R2 | Billing hygiene | S | refuse a second live subscription, hear `charge.refunded` and `charge.dispute.created` | webhook tests |
| R3 | Deletion complete | S | `deleteAccount` clears every table | delete, then scan every table for the id |
| R4 | Sync kinds | L | new kinds (entry, event-day, profile meta); one sealed chunk per day (200KB body cap; per event rows run out near 5,000 daily users on the D1 free write limit, from memory, verify); grow only merge by id | after A2, A10, R0 to R3; second wave, not first public |
| R5 | Practitioner grants | M | `grants` plus audit rows, visible list, revoke; crisis card reads grant state | after R4 |

**Deferred, with a reason.** Meter service (leaks keys, protects nothing). Per address `opened` table (same). End to end encryption (forfeits support recovery, needs an owner ruling, L). IndexedDB (breaks the synchronous `bindStore`, L). Signed lease, founding seats, crypto shredding (M each, after R5).

**Build order, one line.** A1, A2 and R0 to R3 first and in parallel. Then A3, A4, A9. Then A5, A6, A7. Then A10, A8, A11. Then A12, A13. R4 and R5 after, and A12 waits on the journey worktree merge.

## 5. REVISED GRADE

`GRADE: 66/100` (was 62). Moved up: the ledger is a view, so my storage, quota and sync id risks fall; the server meter is cut, so my L slice is gone. Moved down: unknown key loss, deletion holes, duplicate import ids, and `distress.js` cold recall are real defects I had missed.

## 6. TOP 5 RECOMMENDATIONS

1. **A1 typing floor (S).** Everything adds to a path that is already over budget. Moves the phone only arrival and the person in distress (a laggy box is the worst place for lag).
2. **A4 and A5 safety screen and care register (M each).** Highest harm if absent. Moves the person in acute distress; the skeptic gets one sentence, no label, no modal.
3. **A2 record safety (S).** Stops silent data loss before any new write exists. Moves every ICP, most of all the practitioner who exports.
4. **R0 deploy plus A9 entitlement fixes (S each).** Nothing is on `main`; a forged `granted` reads 1,000,000. Moves the phone only buyer who pays and is told nothing.
5. **A10 encrypted export with a restore drill (M).** Safari clears script written storage after about seven days without a visit (from memory, verify on a real iPhone), so a backup is the only truthful promise before sync. Moves the phone only arrival and the skeptic.

## 7. QUESTION FOR THE OWNER

None. Decisions taken: clinician review gates the first public release, not the private build; ground is latched, layer sight is not; no meter service. He can overrule any of them.
