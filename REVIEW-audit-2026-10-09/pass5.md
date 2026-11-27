# Review pass 5 of 5: Practice, Becoming, Summary, Points, the client side of push, crash and export, and the master reconciliation

Read on 9 Oct 2026. MOB main = `b2b7a03` (PR #38). Worker main = `12b2e48` (FETCH_HEAD; the `origin/main` ref inside /home/user/reboot-os is stale, see pass1). Nothing was committed or pushed. Probes ran in a scratch copy of `atuned_src`, `tests`, `tools` and the root documents of b2b7a03, built fresh.
My runs: `tests/engine.js` 5002 passed, 0 failed, 10 expected red. `tests/practice.js` 780/0. `tests/trace.js` 276/0. `tests/daily.js` 437/0. In Chromium on a fresh `source.html`: `tests/becoming.js` 36/0, `tests/dailyui.js` 58/0, `tests/flowtools.js` (Ritual and flow tools) 179/0. `tests/loopui.js` 54 passed, 2 failed: one check, at 1600 and at 390, where Your patterns reads Practised 18 and the test expects 1. The fixture loads the worked example Angela, who now carries her own ritual log, and the graph counts those days as practice events, so the fixture looks stale; I did not prove it. `tests/valuefeltui.js` was queued behind the browser lock and not run.
Probe scripts are saved in `pass5-probes/` (probe1 to probe8). Short names: p1, p2, p3, p4 = the other passes' files (p3 and p4 were read at the end and agree with my probes where they overlap). R = REVIEW-sniffer-audit-2026-10-09.md. M = MVP-OPEN-ITEMS. GP = GAME-PLAN. HG = HANDOFF-GAPS. BA, PA, SA, POA = BECOMING-, PRACTICE-, SUMMARY-, POINTS-AUDIT.md. Paths are under `atuned_src/` unless they start with `tests/`.

## 1. TOP FINDINGS

1. **The four older audits were stale on arrival and the Dev 1 to 6 register copied them.** Between 1 and 3 Oct main gained: a streak that counts only days done (1759ca0, 6b29369), avatar ratings, tags, identity, a purpose writer and a boundary figure on the record (84fc283, PR #21), the daily summary frozen on open with an aim (a93f388, bbe5a75), "What changed?" evidence per address (fa40f03, 3892f18), heavy marks kept on the record (ce91fe6). The audit's claim of no normal UI caller for `practiceDo` or `traceFromRecord` is wrong: callers are `ui/release.js:1137`, `ui/valuefelt.js:67`, `ui/loopread.js`, `ui/character.js:313`.
2. **Profile sync does not run.** `profiles()` is declared nowhere in atuned_src, so `profileSyncEligible()` is always false. Probe6, signed in: `{state:'skip'}`, zero requests. Audit P0-03, P0-04 and B11.1 to B11.3 rest on a premise main contradicts (DECISIONS "Profile sync, 9 October"; TASKS PB1). The defects are real the day sync is switched on (GP block 3).
3. **Real defects in my scope, each probed.** (a) A ritual day dated +400 days passes the boundary, and 90 future days earn "Ninety days". (b) Deleting a local profile leaves its `atuned-ritual-more` entry: a third side store, in no audit. (c) Ritual plans, the avatar daily rule and `atuned-ritual-more` are not in `pExport`. (d) Unknown keys are dropped silently on import. (e) Importing one record twice leaves three profiles with one id (M8). (f) Marks are recomputed, so deleting one of 30 days un-earns "Thirty days".
4. **Round trip works for most of it.** Avatar ratings, weights, tags, name, title, version, status, the six values, the thirty lines, the ritual day log, practice evidence and summaries all survive `pExport` then `pImport` (probe3). The audit's "avatar ratings live in a side store" is true now only for the daily rule.
5. **The audit tells us to honour "sight is not for sale". The owner reversed it on 1 Oct** (`engine/plan.js:23`; DECISIONS Round OJ and OK) and ruled that points exist and only rise (Round OJ). No points exist in code.
6. **Client side of B15 is empty.** Nothing calls `/v1/push`, `/v1/crash`, `/v1/admin/*`, `/v1/export`, `/v1/consent`, `/v1/version` or `DELETE /v1/me`. No `Notification`, `PushManager` or service worker exists. Planned: M51 (crash), M71 (export, delete, consent), M87 (push, Block Q).
7. **The cleanup plan holds nothing for Practice, Becoming, Summary or Points** beyond M29, M46, M87, S18, S20. Their plan lives in older files: PRIORITY 21.J1 to J11, TASKS rounds, the four audits' slices, points TDD v3. Finding 3 is ALPHA work ("existing features complete and bug free") with no block.
8. **Two audit asks collide with decisions already on file:** "skipped" stored as a verification state (`engine/practice.js:150-160` says no, on purpose); P0-06 and P1-01 as P0 and P1 against R section 3, which files SB5 to SB7 after alpha. Both are written below as defaults with a cost.
9. **Four of my scope's tests run in no CI job, even after PR 39:** becoming, dailyui, loopui, valuefeltui (p1 11.5). loopui has 2 known failures on main (PR 39 body; my run reproduced them).
10. **Master table (section 4), tallied by awk from its last column: OPEN 33, PART 25, BLOCK 12, DONE 10, CONTRA 4, DEFER 3, STALE 3, RETIRED 1 (of 91 rows).**

## 2. PART A: the table, one row per audit item in my scope

Verdicts: CONFIRMED, ALREADY FIXED, AUDIT STALE OR WRONG, OWNER-DEFERRED, OWNER-BLOCKED. ALPHA = existing features complete and bug free. PUBLIC = public launch only. Sizes: tiny under 2 h, small half a day, medium 1 to 2 days, large 3 days or more.

| ID | what the audit says | what is TRUE on main now (evidence) | verdict | in plan already? | action, size, priority, gate |
|---|---|---|---|---|---|
| B7.1 | Practice domain PARTIAL; historical audit found no screen caller | `engine/practice.js` (Goal, Protocol, Ritual, PracticeEvent, Evidence, Outcome, miss path) is built, tests/practice.js 780/0. Only two UI writers touch `CURP.practice`, both evidence: `ui/release.js:1141` and `ui/valuefelt.js:70`. No UI writes Goal, Protocol, Ritual or PracticeEvent; `practiceFromLegacy` has no caller on purpose (`practice.js:32`). Readers: `ui/loopread.js`, `ui/ritcal.js:173`, `ui/practitioner.js:575` | CONFIRMED in part; "no caller" is AUDIT STALE | PA B1 to B8, J2 ("the UI build"); PRIORITY 21.J3, 21.J6. Cleanup plan: NO | Decide the one writer: the Ritual tab writes PracticeEvents, `practiceFromLegacy` runs once. Large. P2. PUBLIC |
| B7.2 | Ritual plan in `atuned-ritual-active`, daily log in `p.rituals`; make export, sync, deletion explicit | Plans: `ui/ritual.js:210,277`. Day log `p.rituals` is in the record and exported. THIRD side store `atuned-ritual-more` (`ui/ritcal.js:60`): saved and dismissed suggestions, said affirmations, done challenges. Avatar daily rule in `atuned-avatar-side` (`ui/avatarui.js:148`). Probe3: export has the day log and none of the three. Probe4: `accForget` (`ui/account.js:346`) clears avatar-side and ritual-active but leaves ritual-more (added by fc33b5b on 3 Oct, after accForget in 602b1da). No test covers it. p3 Run 5 found the same leak independently | CONFIRMED, plus a NEW defect | PA A7, B6 ("19.C5 plans onto the record"); PRIORITY 21.J3; PLAN.md K P20 (side stores, forget; partly built: accForget names two keys, p3). Cleanup plan: NO | Block P5-A. Delete leak: tiny, P2, ALPHA. Export of side stores: medium, P2, PUBLIC |
| B7.3 | Streak can count a set-but-never-done day and future dates | Never-done: FIXED. `pracDays` skips `done:false` (`engine/ladder.js:37`; 1759ca0), marks read days practised (6b29369). Probe2: 30 days set, none done, earns nothing, run 0. Future dates STILL TRUE: +1..+90 days done earn first, week, month, season; a ritual dated +400 days passes `validateProfile` (probe5). No-expiry: marks are derived on read; deleting one of 30 days dropped "Thirty days" (probe2); the Ritual tab can delete a day (`ui/ritual.js:691,763`); no grant set exists in the blank profile. Same-day: two rituals one day count one (tests/engine.js:2984). No test varies the time zone | PARTLY ALREADY FIXED; future dates and no-expiry CONFIRMED | POA X7, X9; points TDD v3 slice 2; PRIORITY 21.J2 (done). Cleanup plan: NO | Block P5-B. Boundary refuses a day later than now plus one day: tiny, P1, ALPHA. Grants set: small, P2, PUBLIC |
| B7.4 | Longitudinal evidence PARTIAL; build from immutable dated observations; show unknowns | History snapshots carry CQ_MODEL (`engine/schema.js`); `meter.firsts` is dated and append only; frozen summary days are append only (`engine/daily.js`) with week, month, quarter spans; the Ritual page draws ten spans and says blank days are blank (`ui/ritcal.js` header). Behaviour is not recorded: probe7, 4 of 5 behaviour sentences read as nothing | CONFIRMED (PARTIAL stands) | SA M33, M67; PRIORITY 21.J6. Cleanup plan: NO | Nothing until the behaviour question (P2-05) is answered. P2. PUBLIC |
| B8.1 | Avatar pairs: add, edit, remove, export/import, older schema, monthly review | User writes every pair; no model is called (`ui/storyui.js:601`); status line on each write; identity row answers the monthly look; tests/becoming.js 36/0 (S1 to S3) and engine group RB; round trip passes (probe3); an older record fills from the blank | ALREADY FIXED (84fc283, PR #21, merged in round SH) | BA S1 to S3 done; S4 onward open. Cleanup plan: NO | Put becoming.js in a CI job (p1: in none). Tiny. P2. ALPHA |
| B8.2 | Avatar id, title, version, status missing; side ratings and tags not exported | Id on every pair (`engine/avatar.js:65-77`), name, title, description, version, status draft/active/archived, arch, load0, tags on the record (`avatar.js:48-52`). Only `rule` (Release once a day, Say it once a day) still sits beside the record (`ui/avatarui.js:269-335`). No earlier avatar text is kept; version only counts revisions | ALREADY FIXED (84fc283), except `rule` and revision history | BA S7 (rule becomes a ritual step); revisions are a TD call. Cleanup plan: NO | `rule` moves with the plans in P5-A. Small. P2. PUBLIC |
| B8.3 | Purpose versus six values: CONFLICT, OWNER BLOCKED | Code follows the ruling (DECISIONS 459-478): six typed values, three readings derived and never typed (`avatar.js` purposeRead; `ui/avatarui.js:1995+`). A typed Unified Purpose sentence is not built. A 500 character value is refused by name (probe5) | CONFIRMED as a document conflict; code already took option A | BA Q2. Cleanup plan: NO | Keep A. No work. Typed sentence stays OWNER-BLOCKED (Q2). PUBLIC |
| B8.4 | Boundary, non-negotiables, values, ethical AI handshake: inventory UI callers | Boundary figure (six facets, five marks) and the writer exist (`ui/avatarui.js:1936-2075`, S3). Commitments are bare strings, no ids or states (BA R20 to R24, S4 not built). `boundaryCross` has no UI caller (git grep: 0). No model is bound, so no handshake and no generated value (srcchat is scripted) | PARTLY FIXED; objects CONFIRMED open | BA S4 to S6, S10, Q4, Q5, Q10. Cleanup plan: NO | Wait for Q5 (what counts as tested). P2. PUBLIC |
| B9.1 | Summary page reads energetic state, not behaviour or verified interventions; add tests for dates, snapshots, corrections, no evidence | Three things share the word: the energetic reading (`ui/summary.js`, `rootsum.js`), "Your patterns" (`ui/loopread.js`, #sumloop; reads release answers, misses, declines) and Today (`ui/daily.js`). tests/daily.js 437/0 cover dates, frozen days, no evidence. Response controls: `dlyRespond` (`engine/daily.js:510`, six responses, corrections as events) and the why drawer `dlyWhy` (`daily.js:1152`) have no UI caller | PARTLY AUDIT STALE; response controls and drawer CONFIRMED open | SA D8 and after; SA Q9, Q11. Cleanup plan: NO | Block P5-D. Medium. P2. ALPHA only if the owner counts them as part of the shipped Today column |
| B9.2 | Daily snapshot when the app is closed MISSING unless proven | Built as the owner ruled in Round OI: once a day, on open, frozen, previous day banked (`engine/daily.js:1120` dlyDayOpen; a93f388; bbe5a75). A day nobody opened has no summary and cannot be made later (`daily.js` header; tests/daily.js:738-740). The audit's own first option, already chosen. No server job, none wanted. Day is the local date through `pracDay`; no test varies the time zone | AUDIT STALE OR WRONG | DECISIONS Round OI; SA Q3. Cleanup plan: NO | Add a time zone test (tiny, P3). Never word it as "daily push" in copy |
| B9.3 | Points, achievements, unlocks: re-audit; keep "Sight is not for sale" visible | Marks derive from the record (`engine/ladder.js`); no grants set, no points (blank profile keys: none). "Purpose set" is earnable since the writer landed. Streak marks read days practised. Owner reversed "Sight is not for sale" on 1 Oct (`engine/plan.js:23`) and ruled points exist and only rise (DECISIONS Round OJ) | PARTLY FIXED; the instruction is OWNER-REVERSED | points TDD v3; POA section 5; PLAN-LIST backlog. Cleanup plan: NO | P5-B grants set. Points wait on accounts (OJ). P2. PUBLIC |
| B15-1 | Push subscription PARTIAL; browser permission, persistence, unsubscribe need live smoke | Client: none. git grep finds no `Notification`, `PushManager`, `serviceWorker`, `/v1/push` or `/v1/push/key` in atuned_src. Server half: p2 B15-1 | CONFIRMED (client absent) | M87 (Block Q, "not designed"); PRIORITY 21.J8. | Design first, then build. Large. P3. PUBLIC |
| B15-2 | Crash and admin routes: rate limits, redaction | Client: no caller of `/v1/crash` or `/v1/admin/*`. The boot guard (`shell/guard.html`) shows the failure and sends nothing. Feedback goes to the `/feedback` relay with a deny list (`ui/auth.js:339-383`, `engine/outbox.js`) | CONFIRMED | M51 (guard posts to /v1/crash). Admin is operator only | Add Worker redaction first (p2 W6), then the guard post. Small. P2. PUBLIC |
| B15-3 | Export and import round trip every field, refuse by name, never silently drop | Probe3: avatar, purpose, day log, practice, trace, summaries round trip. Not exported: the three side stores. Probe5: unknown top level key accepted and dropped (`validateProfile` has no closed key set); unknown key inside avatar accepted and dropped; bad types refused by name. Same record imported twice: 3 profiles, one id (probe8) | CONFIRMED | M8 (duplicates); PLAN.md K P03 (unknown keys carried, new id on import), P20, P21, P22; BA Q9 option C. P03 is not built on main (probe5, probe8) | Block P5-F: small, P2, ALPHA for duplicates, PUBLIC for the rest |
| P1-07 | Re-evaluate avatar, purpose, boundary, non-negotiables | Done by this pass: see B8.1 to B8.4. Built: S1 to S3. Open: S4 to S16 and owner questions Q1 to Q12 | PARTLY ALREADY FIXED | BA section 11 and 12 | Owner defaults at section 6 |
| P2-02 | Pattern lifecycle object | No Pattern object or status. A pattern id is `addr:N` or `fetter:Name` (`practicePatternOk`); readings are rebuilt every `compute()` (`engine/compute.js:266-322`) | CONFIRMED; OWNER-BLOCKED (relationship model, BA Q8) | M46 (Block Q); PA A1; BA Q8 | Design round. P2. PUBLIC |
| P2-03 | Release lifecycle, persisted run | `RUN.log` is memory only (`ui/release.js:406,1263`). Heavy marks ARE kept (`release.js:1288` meterHeavy; ce91fe6). Verification kept per address. No release id on the record (p4) | CONFIRMED (log, id); AUDIT STALE (heavy) | M46 (S3, S15, S23); GP "does not do on purpose" | Design round. Large. P2. PUBLIC |
| P2-04 | Trace graph and evidence drawer UX: no wired UI surface | Consumers exist: Your patterns on the Field side column and Summary, `ui/character.js:313`, `engine/daily.js:981`; tests/trace.js 276/0. No per-claim drawer in the UI (`dlyWhy` no caller). `tests/loopui.js` fails 2 checks on main (my run: Practised 18 vs expected 1, likely a stale fixture) | AUDIT STALE OR WRONG in part | funnel review F23, P18a; PLAN.md K P14, P16 (cut first if short). Cleanup plan: NO | Fix loopui, then P5-D. Medium. P2. PUBLIC |
| P2-05 | Behaviour, goal and integrity evidence | Probe7: "I stated the concern directly.", "I avoided telling them...", "I postponed...", "I handled..." read as nothing; "I put it off... changed the subject" reads. Goal and BehaviorObjective exist in the engine only. `sniffLaws` reads law violations from stories | CONFIRMED; OWNER-BLOCKED (SA Q8, BA Q12: read what a person did, or ask) | BA S14; SA Q8 | Default: ask, add no cues. Cost: no automatic behaviour read. P2 |
| P2-06 | Summary and longitudinal report: one definition, truthful 7/30/90 | Definition partly ruled (Round OI, daily on open). Spans week, month, quarter exist in the engine; the screen lists the bank by date and has no span view; missed days are not made up | PARTLY ALREADY FIXED | SA Q9; DECISIONS Round OI | Span view after P5-D. Medium. P2. PUBLIC |
| P2-07 | Achievements, points, unlocks | See B9.3. Probe2 shows non-monotonic marks. Anti-gaming: future dates (B7.3) | CONFIRMED; sight ruling OWNER-REVERSED | points TDD v3 slices; POA section 5, 6 | P5-B. P2 |
| P2-08 | Cross-device and export completeness | Three side stores outside the export; sync is dead code, so nothing crosses devices today (probe6). `GET /v1/export` has no client | CONFIRMED | PA 19.C5; M71 (export button); PLAN.md K P20, P21. Cleanup plan: NO for the side stores | P5-A and P5-E. Medium. P2. PUBLIC |
| P2-10 | Push, crash, admin live behaviour (client half) | See B15-1, B15-2. Server half in p2 | CONFIRMED | M51, M87 | See B15 rows |

### 2a. Older audit findings, today (commit that fixed it, or the line that proves it is still true)

PRACTICE-AUDIT (stamp 1968880, 1 Oct):
- FIXED since: A3 trace graph (engine/trace.js, UI readers above); A4 evidence (`practiceDo evidence_record`, UI writers above); A18 `traceApply` (called inside `traceFromRecord(p,intents)`, `engine/loop.js:78`); A15 heavy marks (ce91fe6); H3 streak half (1759ca0, 6b29369).
- STILL TRUE: A1 no Pattern object; A5 `RUN.log` in memory; A7 and B6 plans beside the record; A8 `intentionRead` has no surface (comment only); A12 and G7 no sync (dead code); A14 no AI handshake; B1 to B5, B7, B8 objects have no UI writer; K6 the Ritual tab deletes day entries (`ui/ritual.js:691,760,763`); K7 two meanings of "ritual".
- MIS-STATED by the Dev 1 to 6 audit: "no confirmed normal UI caller for practiceDo, traceFromRecord or traceApply" (two writers, four readers; only `traceApply` is called from inside the engine); "heavy marks disappear when a card closes".

BECOMING-AUDIT (80c11de, 1 Oct), fixed by 84fc283: R02 identity, R05 version and monthly answer, R06 status words, R08 ratings, weights and tags onto the record, R10, R11, R15 writer, R18, R73, R74 boundary figure, purpose over-length refused by name. STILL TRUE: R03, R04 (Q1); R12 typed purpose (Q2); R13 (Q3); R19 `boundaryCross` unused; R20 to R24 objects (S4); R26 entry ids; R28 decisions store; R47 two writers of a daily practice (the avatar `rule` is still separate); R51 (Q6); R79 (Q7); R81 unknown top level key silently dropped (probe5); R90 behaviour sentences (probe7). Not rechecked: R91 law names across three tables.

SUMMARY-AUDIT (06f5c52, 1 Oct), fixed: M06, M21, M32 aim (`dlyAimSet`, `ui/daily.js:224`); M25, M41, M65 frozen day with eight blocks (a93f388, bbe5a75); M69 trace graph. STILL TRUE: M04, M37, M49, M56 no behaviour emitter; M86, M87 response controls and M71 drawer have no UI caller; M33, M67 no span view.

POINTS-AUDIT (2dd3823, 1 Oct), fixed: X2 never-done streak; "Purpose set" earnable. STILL TRUE: X7 future dates; X9, X10 marks can be lost; no grants set; X11 unknown key dropped. RULING CHANGED: "Sight is not for sale" reversed (Round OJ, OK); points "exist, only rise" (OJ).

## 3. Probe log (commands in `pass5-probes/`)

| probe | what it did | printed |
|---|---|---|
| probe1, probe2 | `streakRead` and `ladderRead` on 30 days set not done, 90 days +1..+90, 30 days done minus one | set not done: earned none, run 0. Future: `first,week,month,season`, run 90, gap -90. 30 done earned `first,week,month,hour`; minus one day: `first,week,hour` |
| probe3 | build a profile with avatar, purpose, day log; `pExport`; fresh store; `pImport` | export keys `v,id,name,created,updated,soul,axes,who,ui,seed,meter,plan,avatar,purpose,laws,intake,work,gates,story,rituals,history,practice,trace,summaries`; avatar arch, load0, tags, name, version 3, status, purpose.soul and the day log all back; no `plans`, `ritual-active`, `rule` in the text |
| probe4 | Chromium: write one entry in each of the three side keys, call `accForget(id)` | before `[true,true,true]`, after `[false,false,true]` (ritual-more stays) |
| probe5 | `validateProfile` on edited exports | unknown top key `progress`: ok, dropped. `avatar.mystery`: ok, dropped. Ritual +400 days: ok. Purpose 500 chars: refused by name. `avatar.version "three"`: refused. `token`: refused. `plan:{tier:4}`: refused |
| probe6 | Chromium, fake signed in session, routes stubbed | `typeof profiles` undefined, `eligible:false`, `{state:'skip'}`, requests `[]` |
| probe7 | `parseStory` on five behaviour sentences | four read as nothing, one reads root 18 |
| probe8 | `pImport` of the same export twice | 3 profiles, one id |

## 4. PART B: the master reconciliation

One line per audit row. Last column "now": DONE closed on main, PART part done, OPEN open, DEFER owner-deferred, BLOCK owner-blocked, CONTRA the audit's premise is contradicted, STALE audit out of date, RETIRED. "DONE" cells cite a PR or commit. p1, p2, p3, p4 cite the other passes.

### 4a. Section 5 register (56 rows)

| audit id | audit status | DONE on main (PR or commit) | IN PLAN (document, id) | NOT IN PLAN | CONTRADICTED by evidence | owner-deferred or blocked | now |
|---|---|---|---|---|---|---|---|
| B0.1 source and build | PARTIAL | CI rebuilds from source each job (deploy.yml:148,212,260); build is byte reproducible (p1) | GP rule 6, blocks 0 to 1; DEV-STRATEGY P1b; M1, M77 | hash record, stamp uses wall clock, tracked builds 86 commits old, Pages publishes ungated (p1) | "tested hash equals deployed hash" cannot hold today (p1) | Pages off: owner (M49) | PART |
| B0.2 retired file | RETIRED | file absent from main and 85 branches (p1); ARTIFACT-RETIRED-2026-10-08.md | GP block 0; HG B3, S5, S10 | guard against its return (p1) | - | - | RETIRED |
| B1.1 journey record, resume | PASS in scope | PR #38 bf9085f (F13); journey2 77/0 at 1600 and 390 (p4) | PR 39 adds journey2 to CI | reload at every checkpoint | - | - | DONE |
| B1.2 mobile first release | PASS in scope | 0029d5e (PR #38); 1be0469 (PR #37, M28) | M28 | keyboard and reduced motion pass (p1 P7-c) | - | - | DONE |
| B1.3 distress gate | MISSING / BLOCKER | - | GP block 2 step 1; M59, M61; HG B11, B13; PLAN-LIST 6 | - | "no commit while stopped" vs the ruled one way pause (p4) | DECISIONS 9 Oct: crisis check waits for the MVP beta; parked on b2a-crisis, b2a-crisis2; 10 xf cases stay red | DEFER |
| B2.1 raw story, offsets, one parser | PARTIAL | entries keep text; `normMap` (sniff.js:305); clauseFloor test engine.js:5466 | HANDSHAKE-sniffer; R section 6 | - | - | - | PART |
| B2.2 denial | PASS in scope | PR #38 aeda35b; engine.js:5425-5455, 7398-7451 incl. "not afraid. Afraid now." and "can't stop crying" | R S1 | - | - | - | DONE |
| B2.3 third person | PASS in scope | PR #38 (R S2) | R S2 | - | 36 + 78 vs 109 is an overlap of 5 sentences, not an error (p1) | - | DONE |
| B3.1 rough day vocabulary | PASS in scope | PR #38 R S0 (LEXPROF) | R S0 | - | - | - | DONE |
| B3.2 sniffStory on Story path | MISSING / BLOCKER | - (one caller, `ui/tutorial.js:331`, after the commit) | R SB5 (P2, after alpha); DECISIONS 9 Oct | - | audit: blocker; seats: after alpha | seat ruling, owner may overturn | OPEN |
| B3.3 accept, correct, reject | PARTIAL | onboarding yes/no events only | R SB5 | - | Story page has no Mirror; "Not me" changes nothing (p4) | - | OPEN |
| B3.4 full candidate list | PARTIAL / verify | PR #38 R S3: every positive candidate returned, display cap SAB_SHOW=6 (sniff.js:1605,1849) | R S3 | - | - | - | DONE |
| B3.5 tense, modifiers | PARTIAL | - | R rulings 3, 4; SB2b (P2) | "a bit", "unbearably" missing (p4) | "sniffAxes ignores modifiers": p4 shows they reach the axis through the parse amount | seat ruling: wait | OPEN |
| B3.6 frame, nature, circles | MISSING / UNREAD | stay UNREAD by design | R section 2.6, 2.7; SB3, SB4 | - | - | owner supplies four canon files | BLOCK |
| B3.7 canon conflicts | CONFLICT / OWNER BLOCKED | - | DECISIONS 9 Oct "still the owner's"; R SB3 | - | - | owner: E43 divisor, Joy, Surprise, Avoider vs Innocent | BLOCK |
| B3.8 inferred address wording | PARTIAL | R S4 (p4: fixed, small residual) | R S4 | repo wide renderer gate (grep finds none) | - | - | PART |
| B4.1 Source AI | PARTIAL | scripted; `ui/storyui.js:601` says so; tests/srcchat.js | TASKS "Talk" round; HG S18 | - | - | - | PART |
| B4.2 evidence and uncertainty shown | PARTIAL | R S5 3344378: held and denied marks said on the Story page | R S5, SB4 | - | - | - | PART |
| B5.1 Release Engine | PARTIAL | first release says what its card says (1be0469, PR #37) | R SB6 | confirm before release | Story page offers top three addresses with no Yes (p4) | - | OPEN |
| B5.2 Reframe | PARTIAL | truth channel and `meter.truthLines` as before | HG S3, S15; M46 | - | - | - | PART |
| B5.3 multi address identity | UNVERIFIED | unknown address fails closed (`engine/journey.js` releaseVerify) | M46 (S3, S15, S23) | one answer per address | one answer is copied to every address of a run (`ui/release.js:1134-1137`, p4) | - | OPEN |
| B6.1 verification states | UNVERIFIED / partial | five answers kept per address (practice.js:184; fa40f03, 3892f18) | M46 with S20 rename | "skipped persists" | audit's four states vs code: Skip stores nothing by design (practice.js:150-160) | seat decision, owner unruled | PART |
| B6.2 evidence ledger | PARTIAL | write `release.js:1137`, `valuefelt.js:67`; read `ritcal.js:173`, `loopread.js` | M46 | link to a release id (none persisted) | "no normal UI write or read" is stale | - | STALE |
| B6.3 trace graph | PARTIAL | `traceFromRecord` read by loop.js:78, daily.js:981, character.js:313; Your patterns; tests/trace.js 276/0 | R SB7 | evidence drawer (`dlyWhy` no caller) | "UI consumer not proven" stale (p4 V4.5) | - | STALE |
| B6.4 CQ and Field after verified work | PARTIAL | compute() never reads verification; first visit CQ stays 0 (p4) | R SB7 with divisor ruling | integration test release to CQ to history | - | owner: E43 | OPEN |
| B7.1 Practice domain | PARTIAL | evidence writers only (A table) | PA, PRIORITY 21.J3 | - | "no screen caller" stale | - | PART |
| B7.2 Ritual plan, daily log | PARTIAL | day log exported | PA A7, B6; PLAN.md K P20 | third side store, delete leak, no export of plans | - | - | OPEN |
| B7.3 accountability, streaks | PARTIAL | never-done 1759ca0; marks on days practised 6b29369 | POA X7, X9 | future dates, no-expiry grants | - | - | PART |
| B7.4 longitudinal evidence | PARTIAL | frozen days, snapshots, spans in engine | SA M33, M67 | span view | - | - | PART |
| B8.1 avatar pairs | PARTIAL | 84fc283 (PR #21); becoming.js 36/0 | BA S1 to S3 | becoming.js in CI | - | - | DONE |
| B8.2 identity, version | PARTIAL / CONFLICT | 84fc283 | BA S2, S7 | `rule` still beside the record | stale conflict | - | DONE |
| B8.3 purpose vs six values | CONFLICT / OWNER BLOCKED | six values and derived readings (84fc283) | BA Q2 | - | - | owner: typed sentence (Q2) | BLOCK |
| B8.4 boundary, non-negotiables | PARTIAL / MISSING | boundary figure and writer (84fc283) | BA S4 to S6, S10 | objects with ids | - | owner: Q5, Q10 | PART |
| B9.1 Summary page | PARTIAL | Today (bbe5a75), Your patterns | SA D8 and after | response controls, drawer | - | owner: SA Q9, Q11 | PART |
| B9.2 daily snapshot | MISSING | a93f388, bbe5a75 (on open, frozen) | DECISIONS Round OI | time zone test | audit says MISSING | - | STALE |
| B9.3 points, achievements | PARTIAL / CONFLICT | 6b29369 marks; writer for Purpose set | points TDD v3 | grants, anti gaming | "sight is not for sale" reversed 1 Oct | owner: do points buy patterns | PART |
| B10.1 sign up, in, reset, out | PASS code and test | PR #35 49e0d13 (reset screen `auth.js:495-529`, tests/reset.js); Worker PR #11 | M3 done; M11 to M17 (N1) | M11: minimum is 8 (`auth.js:54`) | - | - | PART |
| B10.2 guest route | PASS | `ui/login.js:138`; PR #35 keeps a guest's record (`ui/keep.js`, M9) | M9 | live check | - | - | DONE |
| B11.1 sync caller and timer | PARTIAL | - | GP block 3, M7; DECISIONS "Profile sync, 9 October"; TASKS PB1 | guard that fails if `profiles` is defined without the DTO (p3 A1, A2) | code never runs: `profiles()` undefined, probe6 and p3 Run 1 (one request in 50 s) | - | CONTRA |
| B11.2 payload identity | FAIL / P0 | - (latent: pExport carries `who`) | M7; GP block 3 "identity stays home"; DECISIONS 8 Oct | allow list test (in block 3) | audit says it leaves now; it cannot | name never leaves the device: owner ruling | CONTRA |
| B11.3 privacy statements, consent | FAIL / P0 | PR #35 honest privacy words; tests/copy.js | M62 done; M63; M71 | consent control (no `/v1/consent` caller); no gate fails if `profiles` gets defined (p3) | copy "stays on this device" (`ui/account.js:127,143`) is true while sync is dead; p3 checked 13 shipped sentences | owner: modelling consent M63, default off | PART |
| B11.4 local delete vs account delete | FAIL / P0 | - | M25, M71, GP block 6; PLAN.md K P20 | ritual-more survives profile delete (probe4; found independently in p3 Run 5) | - | - | OPEN |
| B12.1 funnel session | PARTIAL | - | M20; HG B8; GP block 4 | - | audit understates: four faults (p2) | - | OPEN |
| B12.2 Supabase migrations | UNVERIFIED | 13 migrations exist and apply (p2) | M21 | CI assertion on RPCs (p2 W5) | "stops at 0010" stale (p2) | - | PART |
| B13.1 route contracts | PARTIAL | 75 Worker tests pass (p2) | M23 | - | - | - | PART |
| B13.2 CORS PATCH | FAIL / P0 | - | M20; GP block 4 | - | confirmed, patch ready (p2) | - | OPEN |
| B13.3 Google key fail open | FAIL / P1 | - | NO | whole item (p2) | - | - | OPEN |
| B13.4 delete cascade | FAIL / P0 | - | M25; HG B7; GP block 6 | - | confirmed (p2) | - | OPEN |
| B14.1 server owns tier | PASS code | p2 | M36, M37 | - | - | - | DONE |
| B14.2 Stripe prices | BLOCKED | placeholder guard returns 503 (p2) | M39; GP block 5 | - | - | owner: prices, keys, portal, webhook | BLOCK |
| B14.3 Apple, Google purchases | UNVERIFIED | - | TASKS (can wait) | - | - | owner: store accounts and keys | BLOCK |
| B15-1 push | PARTIAL | server tests (p2) | M87 | client absent | - | - | OPEN |
| B15-2 crash, admin | PARTIAL | server tests (p2) | M51 | client absent | - | - | OPEN |
| B15-3 export, import | PARTIAL | round trip of the record (probe3) | M8, M71; PLAN.md K P03, P20, P21 | side stores; closed key set (P03 unbuilt) | - | owner: BA Q9 | OPEN |
| B16.1 gates, evidence | PARTIAL | gates-fast + boot, collide, funnel required (p1) | PR 39; M1; GP block 1 | lint pin, artifacts, hash record (p1) | - | - | PART |
| B16.2 production behaviour | UNVERIFIED | Cloudflare label readback only (p1) | M50, M58, N5 | app smoke after deploy | - | - | OPEN |

### 4b. Section 7 queue (26 rows)

| audit id | audit status | DONE on main | IN PLAN | NOT IN PLAN | CONTRADICTED | owner-deferred or blocked | now |
|---|---|---|---|---|---|---|---|
| P0-01 distress gate | P0 | - | see B1.3 | - | - | DECISIONS 9 Oct: waits for the MVP beta | DEFER |
| P0-02 CORS PATCH | P0 | - | M20; GP block 4 | the browser read back after reload (p2) | - | - | OPEN |
| P0-03 sync policy, privacy copy | P0, owner policy | PR #35 words | GP block 3; M62, M63; DECISIONS 8 Oct | - | sync is dead code; copy is true today | policy default taken: name stays home | CONTRA |
| P0-04 first sync, conflicts | P0 | - | GP block 3 (one record per story, M7) | - | defect real in `auth.js:265-269` but unreachable | - | OPEN |
| P0-05 account delete | P0 | - | M25; GP block 6 | - | - | owner: Stripe policy if cancel fails | OPEN |
| P0-06 golden chain gate | P0 | door exists (p4 V2.1) | R SB5 to SB7 (P2); p4 proposes tests/golden.js | a gate with remove-one-edge rule | audit P0 vs R section 3 | owner call: does the chain gate alpha. Default p4: G0, G1, G5 gate alpha | OPEN |
| P0-07 functional gate blocks | P0 | - (PR 39 open) | PR 39; M1; GP block 1 | lint pin (p1) | - | - | OPEN |
| P0-08 Supabase proof | P0 | offline: 13 migrations apply (p2) | M20, M21 | attach, uuid ids, 0013 live (p2) | - | key visibility: owner | OPEN |
| P1-01 sniffStory into Story | P1 | - | R SB5 (after alpha) | - | seat ruling vs P1 | - | OPEN |
| P1-02 Mirror events | P1 | - | R SB5 | - | - | - | OPEN |
| P1-03 confirmed to Release | P1 | - | R SB6 | - | - | - | OPEN |
| P1-04 verification, evidence, Trace, CQ | P1 | fa40f03, 3892f18, Your patterns; five answers kept | R SB7 | per address answers | - | - | PART |
| P1-05 Google fail closed | P1 | - | NO | whole item | - | - | OPEN |
| P1-06 canon gaps, rulings | P1 | - | R SB3; DECISIONS 9 Oct | - | - | owner: files and rulings | BLOCK |
| P1-07 avatar, purpose, boundary | P1 | 84fc283 (S1 to S3) | BA S4 onward | - | audit register stale | owner: Q1 to Q12 | PART |
| P1-08 run derived report | P1 | floors.js reads counts off runs | PR 39; GP rule 4 | JSON, hash, screenshots, archive (p1) | PR 38 sum is an overlap (p1) | - | PART |
| P2-01 sniffer semantics | P2 | - | R SB2b, SB3, SB4, SB10 | - | - | owner: canon files, labelled sample | BLOCK |
| P2-02 pattern object | P2 | - | M46; BA Q8 | - | - | owner: relationship model | BLOCK |
| P2-03 persisted run | P2 | heavy marks kept (ce91fe6) | M46 | run log, release id | audit stale on heavy marks | - | OPEN |
| P2-04 trace UI, drawer | P2 | Your patterns, character page | F23 funnel review; PLAN.md K P16 | drawer, loopui fix | audit stale in part | - | PART |
| P2-05 behaviour evidence | P2 | - | BA S14 | - | - | owner: SA Q8, BA Q12 | BLOCK |
| P2-06 summary, longitudinal | P2 | Today (bbe5a75) | SA Q9 | span view | - | owner: SA Q9 | PART |
| P2-07 achievements, points | P2 | 6b29369 | points TDD v3 | grants | "sight is not for sale" reversed | owner: points buy patterns | PART |
| P2-08 export completeness | P2 | record round trip | PA 19.C5; M71 | side stores | - | - | OPEN |
| P2-09 billing launch | P2 | code and 36 tests (p2) | M36, M37, M39, GP block 5 | - | - | owner: Stripe steps | BLOCK |
| P2-10 push, crash, admin live | P2 | server tests (p2) | M51, M87 | client | - | - | OPEN |

### 4c. Section 12 numbered actions (9 rows)

| audit id | audit status | DONE on main | IN PLAN | NOT IN PLAN | CONTRADICTED | owner-deferred or blocked | now |
|---|---|---|---|---|---|---|---|
| A12.1 distress gate | do first | - | M59 | - | - | DECISIONS 9 Oct: beta | DEFER |
| A12.2 CORS PATCH | do second | - | M20; GP block 4 | - | - | - | OPEN |
| A12.3 sync, privacy, consent, first sync | do third | PR #35 words | GP block 3; M62, M63 | consent wiring until M71 | sync is dead code | owner: consent (M63) | CONTRA |
| A12.4 delete wired | do fourth | - | M25; M71; GP block 6 | - | - | - | OPEN |
| A12.5 sniffStory chain to CQ | do fifth | - | R SB5 to SB7 (after alpha) | - | priority conflict | owner call, see P0-06 | OPEN |
| A12.6 functional blocks release | do sixth | - | PR 39; GP block 1 | - | - | - | OPEN |
| A12.7 canon rulings | do seventh | - | R SB3 | - | - | owner | BLOCK |
| A12.8 Stripe | do eighth | - | GP block 5; M39 | - | - | owner steps | BLOCK |
| A12.9 full suite, fix PR 38 arithmetic, status artifact | do ninth | my run: engine 5002/0/10; PR 38 wording explained (p1) | GP rule 4; PR 39 | fresh status artifact (p1) | - | - | PART |

## 5. Lists

### 5a. In the audit and in NO plan document
- P1-05 / B13.3 Google store route fails open (p2: 51 unauthenticated posts wrote 51 rows).
- B6.1 "skipped" as a stored state (code says no on purpose; no document records the owner's view).
- B5.3 one verification answer per address (the plan queues release ids, not per address answers).
- B7.3 tests for future dated days and a grants rule: only in POA and points TDD v3, not in the cleanup plan.
- B15-3 / P2-08 side stores in the export: only in PA 19.C5 and PRIORITY 21.J3 (older), not in the cleanup plan.
- B16.2 an app smoke from a real browser after deploy (M58 is a one time walk by the owner).
- P0-06 as a P0 gate with a remove-one-edge rule (plan has the chain as P2).
- Audit section 10: a filled handshake per element (HANDSHAKE files exist per block, not per element).

### 5b. In plan documents, not in the audit, open on main (probed unless marked)
- M8 duplicate import (probe8). M11 password minimum 8 (`auth.js:54`). M14 no `_headers` file. M60 no "not medical care" copy in ui or shell. M66 "From your diagnostic" still printed (`ui/drills.js:276`). M71 no client for export, delete, consent. M87 and M51 as above.
- Unprobed, listed so they are not lost: M4 to M7, M10, M12, M13, M15 to M19, M21 to M27, M29 to M34, M35 to M45, M47 to M58, M61 to M65, M67 to M70, M72 to M86, M88 to M94 (all in MVP-OPEN-ITEMS; none is in the audit).
- Older plan items: PA K6 (Ritual tab deletes day entries); PRIORITY 21.J6 (`intentionRead` on no surface, `engine/ladder.js:160`); BA Q1 to Q12; round JZ "hide undo arrows" (CLAUDE.md "Open", not rechecked); situational questions; seed decay policy.
- Found by this pass, in no document: `atuned-ritual-more` survives a profile delete; ritual days later than now are accepted; "Ninety days" can be earned from the future.

### 5c. Contradictions (audit vs main)
1. Sync runs every 30 s (audit) vs dead code (probe6, DECISIONS 9 Oct).
2. No UI caller for practiceDo or traceFromRecord (audit) vs release.js:1137, valuefelt.js:67, loopread.js, character.js:313.
3. Daily snapshot MISSING vs built on open (a93f388, bbe5a75).
4. Keep "sight is not for sale" visible vs owner reversal 1 Oct.
5. Avatar identity, version, ratings missing vs 84fc283.
6. Heavy marks vanish vs kept since ce91fe6.
7. Streak counts set-not-done vs fixed 1759ca0.
8. "Skipped" must persist vs `practice.js:150-160`.
9. "36 + 78 does not reconcile" vs overlap of 5 sentences (p1).
10. Privacy copy contradicts sync vs copy true while sync is dead.
11. P0-06 and P1-01 priority vs R section 3.

## 6. PROPOSED BLOCKS (my scope), in order

Defaults taken where the owner has not ruled; each can be overturned. Run order: P5-F, P5-B, P5-A step 1 are small engine fixes for ALPHA; the rest follow.

**P5-F Strict boundary (PLAN.md K slice P03: "unknown keys carried, new id on import"; not built on main).** Entry: none. Work: `pImport` replaces or refuses a record whose id is held and says which (M8); `validateProfile` refuses an unknown top level key and an unknown key in a named bag by name and keeps the raw text (BA Q9 option C, default; P03 would carry them instead, which keeps data but lets an older build re-save keys it cannot read). Failing first: probe8 as a test (second import must not add a profile); probe5 with `progress` must be refused, not dropped. Exit: engine tests green, an older export still loads. Small. P2. ALPHA for duplicates, PUBLIC for the key rule. Cost: a newer export on an older build is refused, not silently cut.

**P5-B A mark is a fact.** Entry: none. Work: refuse a ritual day later than now plus one day (the daily summary already allows one day of slack); then an additive append only `grants` set keyed by mark id, written the first time a mark reads earned (points TDD v3 slice 2). Failing first: a record with +400 day entry must be refused by name; 30 days done then one deleted must still show "Thirty days". Exit: both pass, export round trip keeps grants, grants refuse duplicates. Small to medium. P1 for the boundary, P2 for grants. Points stay unbuilt (owner: waits on accounts).

**P5-A Nothing lives only beside the record.** Step 1 (tiny, ALPHA): one table of side keys read by `accForget`; failing test writes all three keys, deletes the profile, expects none left. Step 2 (medium, PUBLIC): the three side stores travel with the export under a validated bag with caps, refused by name, after P5-F. Failing first: export, clear stores, import, expect plans, rule and ritual-more back. Exit: round trip equal; sync allow list (block 3) updated in the same change. Owner default: additive in schema v2 (BA Q9).

**P5-D Today answers back.** Entry: loopui fixed or quarantined with a reason. Work: wire `dlyRespond` and `dlyWhy` into `ui/daily.js`; default three visible controls (Accurate, Partly, Not quite), more behind one fold (SA Q11). Failing first in `tests/dailyui.js`: press Not quite, an event exists, reload keeps it, the why list names real evidence; a refused write says so. Exit: green, and becoming and dailyui added to CI (p1 CI5). Medium. P2.

**P5-C One run, one answer, said so.** p4 G2 proposes per address questions (medium, P1). My default is the cheaper one: keep one question per run; give each evidence row of a run a shared run key so three rows are not read as three confirmations; the owner can ask for per address questions. Failing first: a three address run writes three rows with one run key and Your patterns counts it once. Small. P2.

**P5-E Client doors.** Entry: Worker redaction and delete cascade (p2 W4, W6). Work: guard posts to `/v1/crash`; Privacy page gets Export, Delete (two step) and consent, calling the routes with honest words; push waits for the M87 design. Failing first: a stub Worker in a browser test sees the right method, path and body, and a failed call shows a status line. Medium. P2. PUBLIC.

**Owner questions written as defaults:** (1) typed Unified Purpose: default no (BA Q2). (2) skipped stored: default no. (3) points buy patterns: default wait for accounts. (4) does the golden chain gate alpha: default yes for G0, G1, G5 (p4). (5) read behaviour or ask: default ask.
