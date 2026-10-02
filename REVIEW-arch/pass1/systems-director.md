# Pass 1, systems director (Yuki Brennan): the data side of the six areas

Read: BRIEF.md, OWNER-INPUT.md, then the code. Everything below was read off the repo at `c4a829f`, plus the onboarding build agent's uncommitted work in `.claude/worktrees/agent-ad7f4b5294abbc82c` (journey.js, onboarding.js, journeyui.js; based on `7b2941b`, not on main). I probed the built `engine.js` headless where I say "measured". I did not run the gates and I did not read the server (it is a separate repo, `reboot-os`, known here only through `REBOOT-OS-STATUS.md`).

GRADE: 54/100 (how ready the data side is to be built as proposed)

| Criterion | Score | Evidence |
|---|---|---|
| Name a thing once | 4 | "Evidence" is already a practice object, a trace node type and a daily-summary citation. "Ledger" is already `ledgerRead` in `ladder.js:84` (four counts). "Journey" is already the onboarding record. "Intent" and "confidence" are taken too. |
| Stored vs derived | 6 | The repo already derives first and stores a little (`trace.js` header, `journey.js` header). The proposal does not say which of its fields are stored. |
| Validation at one door | 7 | `practiceDo`, `journeyValidate`, `dlyValidate`, `validateTrace` are all closed-key doors that refuse by name. A new store can copy them. |
| Additive migration | 6 | Additive works for reading old records. It fails for old builds reading new ones (measured, below). |
| Failure reporting | 5 | On main, `relCoolDown` discards the result of `pSave()` and `pSnap()` (the worktree fixes it). No UI calls `practiceDo` or `traceFromRecord`, so `p.practice` and `p.trace` are empty on every real record. |
| Privacy as structure | 4 | No deletion route for kept or unreadable bytes; a consent flag nothing reads; the privacy page and the claim packet disagree; one ruling in the persona text was superseded. |
| Round trip | 4 | Export drops two side stores. Importing your own export makes duplicate ids (measured). |
| A record from six months ago | 6 | Old records fill from the blank. New top-level keys are silently deleted by an older build (measured). |

## 1. The Evidence Ledger as a record shape

**Finding: most of it already exists, split across four stores.** The ledger the proposal wants is a read over those stores plus two small stored facts that nothing holds today. Building it as a fifth store would make two truths.

| Proposal field | Already held as | Where |
|---|---|---|
| source | `evidence.source` (user, system, observation, behavioral_event, outcome) and `src` (known, inferred, proposed, user_confirmed, observed) | `practice.js:43,52` |
| timestamp | `evidence.timestamp`, trace edge `at`, log `at` | same |
| context | `evidence.context` (free text, 500) or a trace `context` node (id only) | `practice.js`, `trace.js:67` |
| claim | a trace edge between two typed nodes, held as `proposed`. No free text. | `trace.js:114` rules |
| evidence type | `evidence.type` (internal, behavioral, contextual, outcome, negative) and `dimension` (effect or affect) | `practice.js:53,88` |
| relationship | one of 19 trace edge types, checked against a rule table | `trace.js:71,114` |
| prior and new state | `before`, `after`, `later`; log `data.from/to`; `history` rows | `practice.js`, `schema.js` |
| user confirmation | the `confirm` action: `src` becomes `user_confirmed`, `approved_by` stamped | `practice.js:623` |
| verification status | `practiceStage()`: verified, evidence, outcome. Derived, never stored. | `practice.js:939` |

**The six-step chain (said, detected, thought, experienced, changed, verified) maps without a new vocabulary.** Said is a story entry, an intake answer or an aim. Detected is `parseStory` imprints. Thought is a `proposed` or `inferred` edge. Experienced is evidence with dimension affect. Changed is evidence with dimension effect, or an outcome. Verified is evidence whose source is not the user. The five provenance words (`PR_SRC`) are already the shared language: `daily.js:80` reuses them. The six words are stage names and should be one derived function, not a second field.

**"An agent cannot turn an inference into a fact" is already executable.** `daily.js` refuses a statement stronger than the weakest thing it cites (`DLY_RANK`, rule `no_hidden_inference`) and refuses a cause stated as fact (`no_unsupported_causality`). `trace.js` allows promotion only `proposed or inferred` to `user_confirmed or observed` (`TRACE_PROMOTE`). `dlyResolve` (`daily.js:982`) is already the backward chain: it checks every citation resolves to something on the record. The ledger's "why do you think that" is that function lifted out of the daily summary.

**What is genuinely new and has no home:**
1. A hypothesis with a status. There is no hypothesis object anywhere in the engine (grepped). Recommended shape: a hypothesis is a `proposed` trace edge. Competing hypotheses are proposed edges into the same node. Strengthened or weakened is derived by counting supports against contradicts. Nothing new is stored for that.
2. A memory of "declined". `TRACE_PROMOTE` has no way to say the person said no, so a rejected hypothesis can be proposed again at the next run. This is the one stored addition I would make: a closed list `{from, edge, to, at}` under `p.trace`.
3. Per-address release history. `meter.unique` is a set of keys with no times. The worktree's `journey.runs` store `{t, lines, fresh, rerun, end}` with no addresses. So "pattern X was rerun in a second context" cannot be answered today. Add `addrs` (a list of address numbers) to a run, now, while journey.js is unshipped.

**One rule is violated by the proposal.** It wants CONFIDENCE in every agent contract. `daily.js:109` refuses `confidence`, `score`, `weight` and `percent` by name on a day or statement, and the ruling is that a rung is a count a person can check (once, repeated, windowed, apart). `practice.evidence.confidence` (0 to 1) exists but is never shown. Confidence in the contract must be a rung plus counts, never a float that reaches a screen.

**The free text trap.** The proposal's "claim" field would be a second copy of the story if it held words. `journey.js:118` already rules "no free text in the log, a log that held words would be a second copy of the story". The ledger inherits that: references and closed words only.

## 2. Does it force schema v2?

**No bump is needed, and "v2" is already shipped.** `SCHEMA_V=2` has been live since the gates field (`schema.js:13`), yet the comments in `schema.js:6-11` and `:115,:129` still say a bump is "flagged for his ruling". That is a doc that disagrees with the code. The next bump would be v3. Every recent addition (practice, trace, summaries, journey) took its own version (`PRACTICE_SCHEMA_V`, `TRACE_V`, `DLY_SCHEMA_V`, `JOURNEY_V`) and left `SCHEMA_V` alone. The ledger and `declined` can do the same.

**But "additive" has two failure modes, and the safer one is the opposite of what the word suggests.** Measured with the built engine, one older-build save over a record written by a newer build:
- A new top-level key (`p.ledger`): silently deleted. `validateProfile` rebuilds from the blank and copies only keys it names. The disk lost it.
- A new key inside an existing closed bag (`story.entries[].kind`): the whole record is refused, kept as raw bytes and written back untouched. Invisible but preserved.

So a new top-level key is the data-losing choice for anyone who opens a newer record in an older file. This is real: the committed `atuned-packed.html` was 17 hours stale at the last measurement, and a downloaded single file keeps being opened from Downloads. The worktree adds `STORE_DROPPED`, which reports the loss but still deletes. Recommendation, additive and no bump: make `validateProfile` carry unknown top-level keys through untouched (the way `STORE_KEPT` carries refused records), or refuse to save over a record holding keys it does not know. **The owner's call is only this:** whether the sibling app contract in `reboot-os` needs a shared version number for the ledger key. Flagged, not decided.

## 3. JourneyState against `journey.js` and `practice.js`

`journey.js` (uncommitted) stores runs, a log capped at 500, ten integrity answers, a gift counter and a claim stamp. `journeyRead()` derives a stage of four values: new, storied, continuing, released. That is an onboarding position, not the proposal's ten program stages. Two meanings of "stage" must be told apart before anything is built.

| JourneyState field | What exists | Verdict |
|---|---|---|
| current_stage | `journeyRead().stage`, four onboarding values | Program stages (day 0 to 90) do not exist. Also: `ATUNED-MVP-architecture-v2.md:187` lists 13 stages in 4 phases (Discover, Play, Flow, Embody), the proposal lists 10. Two lists. |
| current_objective | `practice.behavior_objectives`, `goals`; plus the daily "aim" | Three words for it. No UI writes any. |
| patterns_opened | `meter.unique` grouped by address | Derivable. No per-address time. |
| patterns_released, patterns_repeated | `journey.runs` counts only | Per address: not held. |
| rituals_active | Side store `atuned-ritual-active` (UI only) and `practice.rituals[].active` | Two places. The engine cannot read the side store. |
| rituals_completed | `p.rituals` day log and `practice_events` | Two places. `practiceFromLegacy` is stated and not run (`practice.js` header). |
| evidence_collected | `practice.evidence` | Empty on every record: no writer. |
| behavior_changes | none | `BEHAVIOR_OBSERVED` has no event name; closest is evidence type behavioral. |
| context_transfers | `CONTEXT_TRANSFERRED`, trace edges `transfers_to`, `generalizes_to` | No writer. |
| verification_state | `practiceStage()` | Derived. Good. |
| last_meaningful_change | none | "Meaningful" is undefined. `DLY_MOVE` thresholds (`daily.js:117`) are hand-set and say they are not calibrated. |
| current_friction | `practiceMissRead`, `dlyContra` | Derived. |
| next_best_action | `dlyFocus`, `ladderRead().next`, `planNextSight`, avatar review due, `onbMiniPlan` | Five "next" functions already. The proposal's central worry, agents disagreeing, is visible here already. |

**Rules for building it:**
- JourneyState is a pure function `(record, host inputs, now)`. It is not stored. The one exception is a high-water mark: stage-reached stamps, append-only, carrying a rule version (the way `DLY_RULES` stamps a day). Otherwise a retracted piece of evidence moves a person backwards and a rule change rewrites history.
- Gates must read the objects (runs, practice events, evidence), never the log. The log is capped and called "the lesser record" (`journey.js:325`). A gate on a full log stops opening.
- The ritual plans must either move into `p.practice` first (the cutover that is not done) or the host passes them in as an argument. Until then `rituals_active` has two truths.
- Spell gate ids once, lower snake, matching `JOURNEY_EVENTS`. The proposal's FIRST_RELEASE_COMPLETE is `first_release_completed` in the log and PRACTICE_COMPLETED is upper case in `PR_EVENTS`. Two spellings already exist.
- The worktree stores `gift.used` and `remaining`, which are derivable from `meter.unique`. It argues the exception (the owner ruled a counter) and reports `drift`. Acceptable. It is a stored derived value, and the one to watch.
- Other stored derived values, all deliberate and stamped: `story.entries[].imprints/bands` (stamped `lex`), `history` rows (stamped `m`), `summaries.days` (frozen as shown).

## 4. Privacy as a data inventory

See Appendix A for the table. What it shows:

1. **Today nothing leaves the device except sign in, billing and an opt-in browser feature.** The only `fetch` is `ui/auth.js` (email, password, token, tier). There is no record sync in this app. `journeyClaim` builds the packet that would be sent and sends nothing.
2. **The structural rulings hold in code, partly.** The claim packet refuses `who`, `name`, `id`, `plan`, `ui` by name (`JOURNEY_CLAIM_NEVER`) and a gate must name every top-level key in one list or the other. But at the record's top level only `token`, `session`, `password`, `email` are refused by name. Measured: `key`, `secret`, `customer`, `subscription`, `stripe`, `user_id`, `customer_id` at top level are silently dropped, not refused. The worktree adds `user_id`, `userId`, `customer_id`. Add `key`, `secret`, `subscription`.
3. **"The record is never held joined to the story" is superseded** (`DECISIONS.md:1382`, round of 25 September: the story is stored for recovery, never shared). The claim packet carries story text beside the analytic fields under one account. The "name never leaves" ruling stands. The Settings copy (`account.js`, Improve the Models) still says "the record and the story are never held together". That sentence is now false, and the toggle it sits on has no reader: `ui.model` is read nowhere except the toggle.
4. **Claim vs published page.** `CONSUMER-HEALTH-DATA.md` lists four things collected. The claim carries more: practice objects (free text up to 2,000 characters), trace, rituals, intake, seed, gates, ten integrity answers, summaries with the person's aims and response notes. The page must list the packet, not a summary of it.
5. **Deletion has holes.** No `removeItem` exists anywhere. "Delete this record" removes a profile from the array. It cannot remove raw records the boundary refused (`STORE_KEPT`, rewritten on every save), the `source.profiles.unreadable.*` copies, or `source.outbox`.
6. **"People who can see this record: nobody" is a constant** (`account.js`, Who Can See This), not read from a grants list. No grant schema exists. When practitioner sight ships the line becomes false unless it is derived. Grants belong server side (authoritative, revocable) with the client showing a copy.
7. **Dictation sends audio to the browser vendor.** `storyui.js:1790` uses the browser's speech recognition. The privacy page says so. I found no disclosure in the UI at the point of use. The release voice does disclose a network voice (`sound.js:641`).
8. **No safety classification is stored or should be.** There is no distress detection in the engine or UI today (no hits for crisis, suicide, 988). When it is built: the screen is a runtime function; if a trace of it is stored at all, it is a closed event with a time and no text, listed in `JOURNEY_CLAIM_NEVER` and `OB_NEVER`, so it never goes in an account copy, an envelope or a practitioner view. A stored "crisis language detected" label is a surveillance record. Whether to store it is the owner's call; my default is no.

## 5. The persistence discrepancy, resolved

The security review's claim is right and incomplete. There are three models, not two:
- **This app (`atuned_src`):** `localStorage` only. No IndexedDB, sessionStorage or cookie in the source (grepped). One key holds every profile on the browser, rewritten whole on every save (`pPersist`). Unencrypted. `hostfree.py` does not forbid `indexedDB` (`reviews/REVIEW-architecture-schema.md` Y22).
- **`reboot-os` (other repo):** server on Cloudflare with a D1 database (SQLite), records sealed on the server, journal encrypted on the phone, sync where the newer copy wins. Built, tested 30 of 30, never run on a real database, and "the MOB app has none of that code" (`REBOOT-OS-STATUS.md`). Which app goes online first is still unanswered there.
- **The architecture document:** I could not find the IndexedDB design the review cites. IndexedDB appears only in the review itself and as a possible audio cache in `DESIGN-release.md:190`.

**Data-side recommendation:** for MVP, `localStorage` stays the one local store and IndexedDB is not added. Reasons and limits, measured:
- A fully populated evidence object is 540 bytes and a log line 160 (measured). The caps in `PR_CAP` (20,000 evidence, 100,000 log) and `DLY_CAP` (3,660 days) are larger than a roughly 5 MB browser quota (browser figure assumed, not measured here). The quota fails first, and when it does every save fails, including the story. The caps need a shared budget.
- Newer-copy-wins cannot merge two devices' ledgers. Every append-only list here numbers its lines by array position (`journey.log` requires `seq===i+1`; practice log and summaries events likewise), so two devices' lines cannot be unioned. Any list that must sync needs a device-independent id. `DECISIONS.md:232` lists the two-device conflict as blocking.
- A downloaded single file opened from different places may or may not share one `localStorage`, depending on the browser. Not measured. It decides whether "my data is gone" is a real support case.

## Area by area (data side)

| Area | Exists | New | Conflicts | MVP cut | Size |
|---|---|---|---|---|---|
| 1 Orchestrator | Agents are pure functions. `daily.js` statements (`src`, `ev` refs, `rung`, hedged variant) are nearly the contract. | A common envelope: `agent, input refs, claims[{kind, src, ev, rung}], recommend` | CONFIDENCE as a number (see section 1) | The envelope as a return shape, not stored; the orchestrator a pure function over the record | M |
| 2 90-day engine | `journeyRead`, `practiceStage`, ladder, plan | Program gates as derived predicates; stage-reached stamps | 10 stages vs 13 stages in the architecture doc | Gates 1 to 4 over runs and rituals; no new store beyond stamps | M |
| 3 Ledger | See section 1 | Hypothesis (as proposed edge), `declined`, run `addrs` | Name `ledger`; confidence as number | Writers first (practice and trace have none), then the chain read | L |
| 4 Safety | Nothing | Runtime screen | Never stored, never in a claim | Define what is stored: default nothing | S for data, L for the screen |
| 5 Privacy | Boundaries, `OB_NEVER`, claim lists | Inventory as a gate; deletion route; grants schema | Superseded joined-ruling copy; page vs packet | Deletion for kept bytes; correct the Settings copy | M |
| 6 Commerce | `plan.js` SIGHT and allowance; `p.plan` written only from server state | Server-held counter and entitlements | `planSight` reads the current tier only, so a downgrade today re-locks layers once seen. The "ground survives downgrade" point needs a stored high-water fact the server sends. | Keep the lock as a product boundary (`DECISIONS.md:2679`: not security); the high-water fact is the owner's call | L |

## Risks
- Two truths if the ledger is built as a store. It is a read.
- Old builds delete a new top-level key (measured). Fix before the first ledger record exists.
- Importing your own export duplicates the id (measured: three records, one id). The ritual and avatar side stores are keyed by that id and `profFind` returns the first. This is the identity bug that breaks per-record deletion and per-record ledgers.
- Export is not a round trip: the two side stores (`atuned-ritual-active`, `atuned-avatar-side`) are outside `pExport` and outside the claim. The proposal's "export" promise fails until they move into the record.
- Journey refusals partly go to `console.warn` (`journeyui.js`) beside a status line; acceptable, but the second status write must not replace a real save failure.
- Capped logs at 500 make log-gated stages fragile.

## Recommended order (data side)
1. Close the round-trip and identity defects: new id on import, side stores into the record, unknown top-level keys carried through. S to M. Nothing else is safe to build on these.
2. Add run `addrs` and the `declined` list to journey and trace while both are unshipped. S.
3. Give practice and trace their first writers (release card and story card), so there is evidence to read. M.
4. Build the chain read (`dlyResolve` generalised) and JourneyState as pure functions. M.
5. Deletion route, packet-versus-page table, correct the Settings copy. M.
6. Hold every later store to a shared quota budget. S.

Needs the owner: whether the `reboot-os` contract needs a shared record version (section 2), whether any safety trace is stored (section 4.8), and whether a downgrade keeps sight once seen (area 6). All three are flagged, none decided.

---

## Appendix A. Data inventory, from the code

| Where | What | Who can see it | How long | Leaves the device | Removed by |
|---|---|---|---|---|---|
| `localStorage` key `source.profiles` (one array, all profiles) | Identity (first, middle, last, sex, birth date, time, place, zone), 63 answers, laws, axes, story text verbatim, imprints and seats, snapshots, meter, avatar and purpose text, rituals, practice and trace, summaries (aims, notes), prefs, plan | The person; any script on that origin; anyone with the browser profile or its backup. Not encrypted. | Until cleared. No expiry; history is never trimmed. | Only by Export (copied to the clipboard, `account.js:581`, `intakeui.js:1074`) or the person's own file. The app sends none of it. | "Delete this record" removes that profile only |
| Same key, refused records (`STORE_KEPT`) | Raw bytes of any record the boundary refused | Same | For ever; rewritten on every save | No | Nothing |
| `source.profiles.unreadable.<time>` | Raw copy of a store that would not parse | Same | For ever | No | Nothing |
| `atuned-ritual-active` | Ritual plans per profile id (steps, when, where, seat, timers) | Same | Until deleted | No. Not in Export or the claim | Profile delete (`accForget`) |
| `atuned-avatar-side` | Avatar ratings, starting weights, rules with done days, tags | Same | Until deleted | No. Not in Export or the claim | Profile delete |
| `source.session` | `{token, email}` of a signed-in account | Same origin scripts; the token is sent as a bearer on each call | 90 days per `PRIVACY-BREAKDOWN.md` | The token goes to the server on each call | Sign out writes an empty string |
| `source.outbox` | Up to 20 feedback envelopes, closed keys, no name or story | Same | Until sent. No sender is bound (`bindSend` has no caller), so never | No | Nothing |
| UI keys (`fbar`, `rcol`, `axdial`, `fview`, `dens`, `bm*`, `cnov`, `devsight`) | Panel and view switches. `devsight` is a developer switch that shows every tier. | Same | Until cleared | No | Nothing |
| Memory only | Working state, undo stack (story text) | The page | Until reload | No | Reload |
| Network, `ui/auth.js` to `atuned-api.lance-o-powell.workers.dev` | Email and password (sign up, sign in), email (forgot), token (me, sign out, billing), tier (checkout). Back: the plan. | The server | Server side, `PRIVACY-BREAKDOWN.md`: account log 12 months, dormant 24 months, backup 90 days | Yes, on an explicit action | Account deletion (route not in this app) |
| Browser dictation, `storyui.js:1790` | Audio of the person's voice | The browser vendor | Their terms | Yes. No point-of-use disclosure found in the UI | Not ours |
| Quiz page, `funnel/quiz.html` | `atuned.quiz.v2` answers on its own origin; a downloaded `atuned-record.json` holding a whole profile | The person; the disk | Until deleted | The file leaves by the person's hand | The person |
| Account copy (planned; packet in `journeyClaim`) | Everything in `JOURNEY_CLAIM_SEND`: soul, axes, laws, seed, intake, work, gates, story with text, rituals, history, meter, avatar, purpose, practice, trace, summaries, journey. Never: who, name, id, plan, ui. | The server, sealed at rest per `DECISIONS.md` | Per the legal defaults in `DECISIONS.md:2696` | Not built. The call is a later slice. | Not built |
