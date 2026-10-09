# Game plan: one line, cleaned up, with a real MVP on it

Ruled 8 October: main is the line. The recent work on branch `claude/laughing-feynman-xhfyj3` comes onto main by hand, one piece at a time, each piece gated. Nothing is bulk merged.

Built from `HANDOFF-GAPS-2026-10-08.md` (56 items, 13 blockers) and reviewed three times before you saw it: once for sequence and size, once for whether every gate can actually fail, once for feasibility with the merges measured in a scratch copy. The three reviews made 37 changes to the first draft. The biggest: the first draft's total of 20 to 26 days was wrong, the honest figure is below; three blocks the draft said could run side by side cannot; and the plan's single riskiest step had no guard, and now does.

Item numbers (B1 to B13, S1 to S30) point into the gap review.

## The rules that protect quality

These are the rules. Each one says what makes it real, because a rule that is only a sentence protects nothing.

1. **Main is locked.** Every change reaches main through a pull request, and the pull request must show every gate green. Today this is not true: CI runs only on a push to main, runs the engine gate alone, and then deploys. Made real by block 1 (a pull request workflow with every gate as a required check, and the deploy job made to wait on the gates) plus one GitHub setting only you can turn on (branch protection, including admins, your step 2 below).
2. **One port per pull request.** A pull request template names the one port it carries. A pull request that touches two concerns is split.
3. **Reproduce, then fix, then re-measure.** Every fix ships with a gate that fails on the merge base and passes on the fix. CI runs each new test against the merge base and requires the failure.
4. **Numbers are read off the run, never typed.** Every status line cites the CI artifact it came from. The gap review found "30 tests" checked against the number 30.
5. **Risky features stay dark until their gate is green.** One switch table in the engine, and an engine test that fails if any switch is on while its named gate is missing from the required list. Sync, delete and the first visit server routes all sit behind switches.
6. **The build you receive is always `BUILD.sh` from main HEAD, stamped, packed, attached.** CI unpacks `atuned-packed.html` and fails if its stamp differs from `source.html`. The 4.96 MB artifact is retired in block 0 and never shipped.
7. **The engine's numbers cannot drift silently.** CI rebuilds base and head on every pull request and runs `tools/equiv.py`, which compares every top level declaration by name and body.
8. **Every merge to main goes live on atuned.world.** There is no staging. So order inside a block is by harm to a person, and nothing merges that is not safe to be live within the hour.

## Block 0. Freeze, baseline, and the two things only you can do

Size: 1 day of team time. Needs from you: steps 1, 2 and 3 at the end. You are stopped once, now, not three times later.

- Tag main at `869610b` as `pre-cleanup` and this branch at its head as `fork-archive`. Tags are bookmarks; nothing is deleted.
- Run every gate on main as it stands and record the result from the CI artifact into `STABILITY.md` with the commit beside it. Expect red: main has no crisis check, and the four browser gates have never run on main's 100 handoff commits. A red baseline is written down as red. That is the point of a baseline.
- Retire the 4.96 MB artifact (B3, S5, S10). List its 130 edits. Mark each "dropped" or "port candidate". Port candidates become backlog items with a citation. The file is never shipped.
- Take a snapshot of the live Supabase schema (S6, S28). Supabase keeps no record of which migrations were applied, so the only way to know what is live is to read it, and that must happen before anything in block 4 writes to it.
- Rebuild `source.html` and `atuned-packed.html` from main HEAD and send you that build, so from today you are testing the real line.

Exit gate: the tags exist, the baseline (red where red) is in `STABILITY.md` with its artifact cited, the schema snapshot is in the repository, you hold a build stamped with main's commit.

## Block 1. Fix the ruler before measuring with it

Size: 4 to 5 days. Needs from you: nothing.

You cannot protect quality with a test suite that does not run. What is true today: CI has no pull request trigger, runs the engine gate only, then deploys. About 30 test files have a Chromium path typed in that does not exist on a CI runner. The sign in test has crashed since 5 October on this branch.

- A gates workflow that runs on every pull request, with no path filter (so a docs only change still gets a check and a required check never sits pending for ever). The deploy job waits on it. The gates, by name: `BUILD.sh`, `BUILD-engine.sh`, `tests/engine.js`, `tests/functional.js`, `tests/collide.js`, `tests/design.js`, `tools/monitor.js`, `tests/funnel.js`, `tests/boot.js`, `tools/hostfree.py`, `tools/equiv.py`, the voice check, and `npm test` in `atuned_funnel_system`. Browser gates run as parallel jobs because one job will not finish inside the runner's time limit.
- Chromium on the runner: pin playwright and set `PLAYWRIGHT_BROWSERS_PATH`, or add one shared override, so the 30 typed paths stop mattering. Prove `boot.js` runs headless with its throwing extension loaded. Expect design gate 13 (the frame rate floor) and `collide.js` (which depends on font metrics) to be the first to misbehave on a 2 core runner; fix the floor's environment, never lower the floor.
- Fix `tests/functional.js` against main (B9). Main keeps its Guest door; the test is repaired where it drifted.
- Three new gates, written now, each expected red until its block fixes the fault, and marked as expected red so the required check still passes. The moment one goes green unexpectedly the job turns red, so someone has to flip it on purpose:
  - `tests/copy.js` (B1): walks every surface named by `TABDEF`, reads SVG text too, fails on "this device", "nowhere else" or "no store" while sync is reachable. Green after block 3.
  - Crisis cases in `tests/engine.js` (B13), which need no browser: seven phrases that must trip ("I wanna die", "killing myself", "ending my life", "hurting myself", "better off without me", plus the two already covered), three that must not ("I cut myself a slice of bread" and two more). Plus one browser check that a first visit story reaches the check. Green after block 2.
  - `tests/sync.js` (B4, B10, B12, S14, S24): two browser contexts against a fake Worker, asserting a journal entry written on each side survives on both, and that signing out clears the open profile and stored version. Green after block 3.
- Design gate 7 (no outbound request) extended to the signed in release screen, so the ElevenLabs voice request in block 2 cannot slip past it.
- `MONITOR.log` gets a block stamped at main HEAD.

Exit gate: CI green on a pull request against main with every gate named above running, the three new gates present and marked expected red.

## Block 2. Port this branch's work onto main, by harm first

Size: 4 to 6 days. Needs from you: nothing.

The feasibility review measured each port in a scratch copy. The one that looked like a three way merge (20 conflicts, 274 lines, 6 files) is avoided by porting the seam folder alone; done that way it compiled and 97 of 97 funnel tests passed (main's 44 plus 53 of this branch's). The other ported files were not touched on main since the fork, and `release.js` merges clean.

Each line is one pull request with the full gate run. Order is by harm to a person, because every merge goes live.

1. **Crisis check** (`e2aa6f8`), fixed to B13 first: word forms, simple negation, wired into the first visit story. The crisis gate from block 1 goes green in this pull request. Then the live site has a crisis check (B11). The safety stop exit in the funnel state machine (S9) takes the team's default: the stop is a one way door to the 988 screen, recorded in `DECISIONS.md`.
2. **Sniffer word pass** (`94d328e`) and the `LEXPROF` refusal fix from `5ce3934`. `tools/equiv.py` runs because a data table changed.
3. **Privacy copy made true** (B1): the first card, the Privacy page, the Account section; the "Improve the Models" switch removed from source. `tests/copy.js` goes green. This is in block 2 and not block 3 because the words are harm now and the fix is strings.
4. **Send you a stamped build here.** Three harms closed on the live line before the funnel ports start.
5. **Funnel seam** (rounds SI, SJ, SK): this branch's `seam/` folder and its `domain.ts` types onto main. Not `funnelService.ts` or `realAdapters.ts`; main's stay. Main's `requestRelease(patternId)` survives for now because nothing live calls the funnel service; this branch's release plan (meter keys, required address ids) is its own later pull request built on main's fencing. This branch's `leaseExpiresAt` is dropped (S30 closes free). The 97 tests are the count, read off the run.
6. **Practitioner migration**, rewritten and renumbered 0014 (S6): its ids become text to match main's 0013, its lease column goes because main's 0009 already has one. A migration map is written listing every number across D1 and Supabase, and who owns the next number.
7. **Release screen cleanup, ElevenLabs voice, knowledge base snippets, funnel bypass for returning people.** `1a025e6` carries both the release cleanup and the Guest removal, so it is split by file and the five lines in `login.js` are dropped (B9).
8. **Dropped, not ported:** this branch's record sync (`authRecordSave`, `authRecordPull`, the push hook in `pSave`). Main's sync is the one kept and fixed in block 3 (B4, B10).

Exit gate: every port merged green; this branch tagged and closed; `DECISIONS.md` carries one line per item, ported or dropped and why.

## Block 3. Keep records safe

Size: 6 to 8 days. Needs from you: nothing. Two defaults are taken and recorded below.

**The riskiest step in this plan is here, and it has a guard.** Main's sync does not run today only because it calls a `profiles()` function that does not exist (B12). Fixing that one call switches sync on live, every 30 seconds, and on first sign in it copies the server's record over the local one. So, in this order and in one pull request: the off switch lands first (rule 5), a local snapshot is taken before any import, and the merge fix below is in the same change. Sync is not switched on until `tests/sync.js` is green.

- **The merge rule.** No Worker change is needed: `/v1/sync` already keeps only the higher version and returns `kept` and `stale`. The loss is in the client, which copies the whole record over local. Fix: one server record per story (`kind:'state'`, `id:'story:<id>'`), so two devices adding stories add, and never replace. A single whole profile record would also hit the 200,000 character cap and fail with no message. Never use `kind:'imprint'` for this: that kind is copied to research when a person has agreed to share.
- **Identity stays home** (B6). Name, birth date, time and place are stripped from the synced records. Your ruling "The name never leaves" (`DECISIONS.md:140`) already covers this, so it is taken, not asked. Because `validateProfile` fills a missing field from the blank, a stripped record pulled on a second device would blank the name there; the import keeps local identity and takes everything else.
- **Sign out clears the open profile and the stored version** (B10, S14). Two tabs share one write lock (S24).
- **Schema v2** (S21): the sync sends v2 fields and v1 still loads. Default taken: keep sending, recorded in `DECISIONS.md` as taken, yours to overrule.

Exit gate: `tests/copy.js` and `tests/sync.js` green, and a real run on two browsers where a journal entry written on each survives on both.

## Block 4. Make the first visit server routes actually work

Size: 7 to 9 days. Needs from you: nothing, if block 0's steps are done.

The four code faults behind the missing key (B8) split two ways. Two are Worker only and can be tested offline: the CORS rule (the rule that says which websites a browser may send requests to) gets PATCH added; the anonymous credential's 15 minute expiry is extended to the length of a first visit, and ships only together with sign out clearing the funnel session. Two need a database change, migration 0015: a starter gift created when a session starts, and release and verification ids becoming UUIDs (the fixed id format the columns require). The Worker's test stand in accepts ids the real database refuses, so these two are tested on a local Postgres with 0001 to 0013 applied, not against the stand in.

- The contract first (S22): every route, request shape, error shape and version, in one file both repositories carry, with a test in each that fails if the other drifts.
- Migrations 0011 to 0015 applied through a pipeline step, checked against block 0's schema snapshot, so no human applies one by hand again.
- Saves that fail say so (S8): every first visit save reports through `status()`, the app's status line. On reload, saved progress is read back and the person lands where they left off. A browser test of `authFunnelCheckpoint` backs it.
- The second plan table in the funnel package goes, and the engine's own `planSight` is read instead (S4).

Exit gate: the live smoke passes end to end, the checkpoint browser test is green, and one real person (you, on atuned.world, not a downloaded file, which cannot sign in) walks arrival, concern, story, Mirror, release, verification, reload, with every step surviving the reload.

## Block 5. Money

Size: 8 to 10 days. Needs from you: the Stripe steps, step 4 at the end. Comes before delete because delete has to cancel a subscription, so Stripe has to be real first.

- The money faults on main (S17): the crash window between claiming a request and completing it, which can charge twice; the fencing check that runs after the debit instead of before.
- Stripe gaps (S29): refunds and disputes leave paid access on; two tabs can make two live subscriptions; an unmatched payment message is dropped for good. These are blockers before any real money moves.
- The plan field travels inside the synced record and races the server's answer (S13). The server's answer wins.
- The gift counted in one unit (S7): the engine's pattern. The second count is removed.
- Replayed Stripe events in the Worker's CI, and a nightly run against Stripe test mode: one purchase, one plan change, one cancellation, one renewal, each read back by `/v1/me`.

Exit gate: the four lifecycle events pass in test mode nightly, and the app shows the right plan after each.

## Block 6. Delete and the data obligations

Size: 7 to 8 days. Needs from you: nothing. Retention is already ruled.

- Delete everywhere (B7), in this order: cancel Stripe first, then Supabase, then D1 (the Worker's own database, holding accounts and sealed records) last, with a pending delete row that stays until all three succeed. D1 first was the draft's order and it was wrong: deleting D1 first loses the ids needed to retry the other two. A tombstone in the browser stops a stale tab resurrecting the record. The delete screen says what is removed and from where.
- D1 enters the architecture map and the six layer table (B5).
- Supabase events carry plain ids only, never story text or body readings (S12).
- Retention (S26): you already accepted 24 months. It is enforced, not re-asked, and the delete screen says it.
- `tests/delete.js`: delete, then sign in again, shows nothing; the sealed record is gone; Stripe shows no subscription.

Exit gate: `tests/delete.js` green against the live test mode.

## Block 7. Honest labels and the real MVP acceptance

Size: 2 to 3 days. Needs from you: one hour to walk the product on atuned.world.

- Every PASS line that cannot fail is relabelled (S1). The six state ICP check and the golden journey check either gain a real assertion or are renamed smoke.
- The funnel package is described as what it is (S2): a tested reference, not live code. Verification is described as a self report log (S20). The server's test engine is pinned to a build stamp (S19). The journey document carries your loop and the avatar (S18).
- The handoff is rewritten as `HANDOFF-2026-10-xx.md` with the true status matrix, every row citing a run.
- `tests/journey.js` scripts the full walk, so it cannot regress after you have walked it.
- You walk it: arrive, concern, story, Mirror, release, verify, reload, sign up, see the record, delete the account.

Exit gate: you say it worked, `tests/journey.js` is green on the commit you walked, and every gate is green on that commit.

## What this plan does not do, on purpose

Real and serious, and each needs a design before a build. Queued, not dropped.

- Verification ids that point at nothing, addresses not bound to a release, releases not recording their word list (S3, S15, S23). One design round.
- The funnel state machine's missing exits for session expiry and attachment refused (S9, the rest of it).
- The server engine adapters that are shells (S16).
- The service role lock and record key rotation on the Worker (S27, S28).
- This branch's release plan with meter keys, as its own port on main's fencing.
- Too many choices on the concern screen (S25). A UX round.

## Size, honestly

Blocks 0 to 7 in sequence: 39 to 50 working days for one engineer. The first draft said 20 to 26, and the review that summed the items showed why that was wrong.

What can run side by side: block 1 and the first three ports of block 2 (crisis, sniffer, copy) overlap, because the ports need only the engine gate and the three new gates, which land first. Blocks 4, 5 and 6 cannot overlap: all three edit the same Worker file and add migrations, 6 needs 4's key and 5's Stripe, and one seat has to own migration numbers. Calendar with two seats: about 30 to 38 working days.

What you get and when:
- End of block 2, item 4: a live site with a crisis check, an honest first card, and a stamped build in your hands. About two weeks in.
- End of block 4: a first visit that survives a reload. About five weeks in.
- End of block 7: the MVP, walked by you. About eight to ten weeks in.

## Your steps

Written as if you are ten. All four are asked now so you are stopped once.

**Step 1. The Supabase key (stops block 4).**
1. Open a browser and go to supabase.com. Log in. This is a different account from Cloudflare and from GitHub.
2. Click the project called `tuvpjbduarteszwkdmuu` (it may show as Atuned).
3. In the left sidebar near the bottom, click the gear icon, Project Settings.
4. Click API in the list that opens.
5. Find the box labelled `service_role`. Click Reveal, then Copy. This key can read everything, so paste it nowhere except step 9.
6. Open a new tab and go to github.com. Log in.
7. Open the repository `rebootos-sourcce/Reboot-OS`.
8. Click Settings (the tab at the right of the top row). In the left list click Secrets and variables, then Actions.
9. Click New repository secret. Name: `SUPABASE_SERVICE_ROLE_KEY`. Value: paste the key. Click Add secret.
10. Tell me it is done.

**Step 2. Lock main (stops rule 1).**
1. On github.com, open the repository `rebootos-sourcce/MOB`.
2. Click Settings, then in the left list click Branches.
3. Click Add branch protection rule (or Add rule). In the pattern box type `main`.
4. Tick "Require a pull request before merging".
5. Tick "Require status checks to pass before merging". A search box appears; it will list the gates once block 1's workflow has run once, so come back for this tick after I tell you block 1 is in.
6. Tick "Do not allow bypassing the above settings" (on some screens it reads "Include administrators").
7. Click Create (or Save changes).
8. Tell me it is done.

**Step 3. Attach Reboot-OS to the working session (stops blocks 4, 5, 6).** Reply "attach Reboot-OS". Two seats already read it through GitHub for the gap review; the plan needs to run its tests, not only read them.

**Step 4. Stripe (stops block 5, not needed yet).** The eight steps from Round OU are in `WAITING-ON-YOU.md`. I will resend them when block 5 opens so you are not holding them now.

**Defaults taken, yours to overrule.** Recorded in `DECISIONS.md` as taken.
- The name never leaves the device. Your existing ruling, applied to the sync.
- Schema v2 keeps being sent, since v1 still loads.
- The crisis stop is a one way door to the 988 screen.
- Retention is 24 months, as you already accepted.
