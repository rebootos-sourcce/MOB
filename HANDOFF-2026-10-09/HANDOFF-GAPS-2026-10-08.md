# Gap review of the 8 October handoff

Six seats reviewed the 8 October AI handoff, its execution report, its manifest and the 4.96 MB build file it describes. The seats were Yuki (schema and state), Anders (architecture and the server boundary), Tomas (algorithms and the graph), Dani (UX and the journey), Priya (logic, and whether the code matches the words) and Sam (evidence). Each seat read the material five times, each time through a different lens. Together they wrote 192 raw gaps: 191 numbered, plus one new gap Yuki found when she re-checked against main. Many were the same problem found by different seats. After merging duplicates there are 56 items: 13 blockers, 30 serious and 13 minor. Each item gets one class letter:

- **A**: wrong or missing on main and in the handoff itself.
- **B**: built on main but not merged into this branch. That is a merge job, not a defect.
- **C**: a defect in this branch's own 13 commits.
- **D**: a defect in the 4.96 MB build file, which exists in no branch.

## Read this first

1. **Two copies of the app have split apart, and someone has to pick one.** The website atuned.world runs "main". The file you were handed came from a different line, this branch. Each has things the other does not, and both save a person's record in different ways that clash. Nothing should be merged until you choose which line is the real one. Class A, blocker. This is the one question at the end.
2. **The live website has no crisis check.** When someone types that they want to hurt themselves, it should show the 988 crisis line, and on atuned.world it does not. This branch has a crisis check, but it misses common wordings like "I wanna die" and "I keep thinking about killing myself". It also does not run on a first visitor's first story. Class A for the live site, class C for the branch's check, both blockers.
3. **The app tells people "Nothing you write leaves this device", and that is false.** Once a person signs in, their whole record goes to the server, including their name and birth details. You ruled that the story may be stored for recovery. You never ruled that the name may leave, and your earlier rule says it never does. There is also no way to delete the server copy. Class A, blockers.
4. **The file you were handed is a hand-edited copy of the app.** It changes the core coherence number (CQ) maths, so it disagrees with the real engine. Its twelve "fixes" are patches stuck onto the end of the file. The next real build wipes them all, and the file has passed none of this project's own tests. It cannot ship as it is. Class D, blocker.
5. **Two "done" labels are not done.** "MVP PASS" rests on checks that cannot fail, for example a test count typed as 30 and then checked against 30. The handoff also says the server only needs one missing password-like key (the Supabase key). The seats found at least four more code faults behind that key, so adding it will not make the server work. Class D (serious) and class A (blocker).

## The fork

This branch and main have split. Since they last agreed (commit `e1a21f0`), main has 123 commits this branch does not have, and this branch has 13 that main does not have. I measured that here with git. The handoff describes main, while the build file it hands over is this branch's lineage stamped `5ce3934`.

**What this branch has that main lacks**
- The crisis check (`e2aa6f8`).
- Record sync on every save (`5ce3934`: `authRecordSave`, `authRecordPull`, and a push hook inside `pSave`).
- The funnel rounds SI, SJ and SK. The funnel is the first-visit path from arrival to first release. These rounds added the `seam/` folder (8 files, 1,258 lines), practitioner access, migration `0002_practitioner.sql`, and 94 funnel package tests.
- The sniffer pass for profanity and distress words (`94d328e`). The sniffer is the word reader that turns a story into charge.
- ElevenLabs as the default voice, the release screen cleanup, the funnel bypass for returning users, and the knowledge base snippets.
- The removal of the Guest button (`1a025e6`).

**What main has that this branch lacks**
- The first-visit continuity client: `authFunnelStart`, `authFunnelCheckpoint`, `authFunnelAttach`, `authFunnelRead`.
- A Guest door.
- Its own profile sync on a 30 second timer.
- `runtime.ts`, `supabaseRepository.ts`, fencing tokens, `consumeUsage`, `getEvents`, `transferStarterGift`, and random release ids. A fencing token is a number that lets the server refuse a late worker's write.
- Supabase migrations 0002 to 0013.
- The deploy to atuned.world.
- The 100 commits the handoff lists.

**Where they collide**
- **Two profile sync seams.** A seam is the one place the app talks to the server.
  - This branch saves the record as `state/profile`, uses the clock time as its version, and pushes on every save.
  - Main saves it as `state/atuned.primary-profile`, uses a counter as its version, and pushes every 30 seconds. Main also deleted the push hook this branch added to `pSave`.
  - If both are merged as they are, one person gets two server copies under two names. Each copy is pulled by its own seam, and they drift apart.
  - (Yuki re-check table, Anders G24, Priya G28, Sam G30, Dani G8)
- **Two migration 0002s.** A migration is a numbered change to the database layout. This branch's `0002_practitioner.sql` adds a lease column to the idempotency table, which is the table that stops one request from being charged twice. Main's 0002 is `0002_funnel_concurrency_functions.sql`, and main adds that lease differently in its 0009. On top of that, the server's own D1 database uses 0009 and 0010 for Stripe. So one sequence of numbers names three different things. (Anders G13, Sam G12, Yuki G4)
- **Two `requestRelease` signatures.** On this branch it takes a release plan with meter keys (`funnelService.ts:377-381`). On main it takes one bare `patternId` (main `funnelService.ts:378-382`). The two lines also feed the engine's `releaseWork` different inputs. (Priya G7, Tomas G8)
- **The same files, rewritten twice.**
  - `auth.js` changed 59 lines here and 242 on main from the same starting point.
  - `login.js` removed Guest here and kept it on main.
  - The funnel package differs by 18 files, with 850 lines added and 1,673 removed.
  - None of this merges by machine. (Anders G24, Priya G7)

A decision on which line wins must come before any merge. Every sync blocker below depends on it.

## Blockers

The order follows the team rule: blockers first, then how many seats found the item, then how cheaply it closes. That is why the crisis items sit lower here than in "Read this first", which is ordered by harm to a person.

**B1. The privacy words are false, on the first screen and on the Privacy page.**
- The first card a stranger reads says "Nothing you write leaves this device." One tap later, their chosen concern (for example Grief) goes to the server.
- Once they sign in, the whole record goes too.
- The Privacy page still says "Held in this browser and nowhere else". Delete still says "There is no store yet". File headers still say "It does not sync".
- The handoff says Block 6 fixed this. It did not. Block 6 is a find-and-replace run on the screen text of one Account section, inside the build file only. The source files on both lines still carry the old words. The dead "Improve the Models" switch is still drawn, along with its promise. The Block 6 check only reads the section it patched, so it passes anyway.
- Class A. Seats: Yuki G8, Dani G6, G7, G13, Anders G12, Priya G9, Sam G23, Tomas G6. Evidence: read here.
- Size: 1 day. Half a day to rewrite about six strings in `atuned_src` and remove the switch. Half a day for a gate (an automatic check) that fails on "this device", "nowhere else" or "no store" whenever the build can sync.

**B2. The two lines have forked, and the handoff does not say so.**
- See "The fork" above.
- The handoff calls the build file "the product artifact", but that file contains none of the continuity client the handoff describes.
- Class A, because the handoff is the document that hides it. Seats: Priya G7, G8, G28, Anders G9, G24, Sam G8, G9, G29, G30, Yuki G9 and its re-check, Dani G8, Tomas G8. Evidence: run here (git counts) and read here.
- Size: 1 hour of your time to choose. Then 3 to 5 days to merge, plus a full gate run, whichever line wins.

**B3. The build file is a hand-edited second engine.**
- Its build stamp is the same as this branch's `source.html`, but it is 130 KB bigger and differs in 130 places across 27 modules, including the engine.
- It deletes `cqSum`, the ruled "21 laws over 210" CQ. In its place is a new coherence formula that returns nothing until all 21 laws are measured, so a partly measured person gets an empty CQ and an expression of 0. The engine gate at `tests/engine.js:236` checks the opposite.
- It adds two new canon registers, one with a body count that is not the 112 the product states.
- It cannot be rebuilt from either line. Its base file (`v13`) is in no repository. It would fail `BUILD.sh`: 12 em dashes, twelve script blocks sharing one id, and a hand-typed length marker.
- CLAUDE.md says "source.html is a BUILD PRODUCT. Never edit it" and "Port, do not rebuild". So the team decides this one: none of the engine edits are kept, and only the privacy wording (B1) is carried into source.
- Class D. Seats: Anders G10, G11, Sam G6, G7, G1, G35, Priya G9, Tomas G12, Yuki G9. Evidence: read here. Sam ran the diff. The CQ gate failure is predicted from the code, not run.
- Size: half a day to list the 130 changes and record each as dropped or ported.

**B4. This branch's record sync loses records without saying so.**
- Pulling the server copy creates a second profile with the same id. Yuki reproduced this here: two records, one id, on disk. On reload the old copy opens, and the next save pushes it back over the server copy.
- The version is the device clock, so a phone whose clock runs fast wins every clash.
- The version is stamped before the save lands, so a failed push still counts as done.
- The whole record is replaced, so journal entries written on the other device are lost. A new device can overwrite the account copy before its first pull arrives.
- It pushes whichever profile is open. A partner's profile on the same browser can replace the account holder's.
- No failure reaches `status()`, the line that tells a person a save failed. No gate tests any of this.
- Class C (`5ce3934`). Seats: Yuki G18, G19, G21, G23, G25, Priya G5, G32, G34, Dani G20, Tomas G22, Anders G24. Evidence: run here.
- Size: 2 hours to remove it if main wins. 3 days to fix if this branch wins.

**B5. The handoff never mentions D1, the server's own database.**
- D1 is Cloudflare's database inside the Worker, the small server program. It holds accounts, sign-ins, what each person has paid for, Stripe customer ids, and every synced record.
- The handoff's system map shows Supabase as the only server store. Any deletion, recovery or breach plan written from it would miss the most sensitive store.
- Class A. Seats: Anders G1, Yuki G1, Priya G2, Dani G5. Evidence: read here (branch `auth.js:525`), and read from Reboot-OS, not run.
- Size: 2 hours to add it to the map and the six-layer table.

**B6. The person's name and identity leave the device.**
- Both lines send the whole exported record. That includes the name, the legal name parts, and the birth date, time and place.
- You ruled that the story is stored for recovery (DECISIONS.md:1384), and the team took "the account copy includes the story text" as a default (DECISIONS.md:2700). Those rulings replaced only the old line that the record and the story are never held together.
- "The name never leaves" (DECISIONS.md:140, repeated at :673) still stands. So the story going up is ruled, and the name going up breaks a ruling.
- Your modelling ruling also says consent must be asked plainly. Block 6 deleted the only consent control. The Worker has a consent route (`PUT /v1/consent`) that nothing in the app calls.
- The team can decide this, because it follows rulings you already made: keep the name on the device, replace it with the key, and ask consent before any modelling.
- Class A. Seats: Yuki G6, Tomas G6, Dani G22, Sam G31. Evidence: run here (Yuki's export shows the name fields).
- Size: 2 days. 1 day to strip identity fields from the synced copy, 1 day for the consent question.

**B7. There is no way to delete an account everywhere.**
- The Worker's account delete removes only D1 rows. Funnel rows in Supabase stay.
- A live Stripe subscription is not cancelled, so a deleted person keeps being billed. Stripe's later messages about it are then dropped.
- In the app, delete is local only. It never sends a "this was deleted" marker (a tombstone). So the next device's pull brings the deleted record back.
- CLAUDE.md: "Records off device mean a controller exists. Access, deletion and breach obligations attach."
- Class A. Seats: Yuki G2, Anders G4, Dani G4, G27, Priya G2. Evidence: read here, plus read from Reboot-OS, not run (the Worker and Stripe half).
- Size: 4 to 5 days. A delete route that reaches D1, Supabase and Stripe, a tombstone in the client, honest delete words, and a gate.

**B8. Adding the missing Supabase key will not make the server's first-visit routes work.**
Behind the missing key the seats found:
- **The browser rule blocks the save.** CORS, the rule for which websites a browser may send requests to, does not allow the `PATCH` method that every checkpoint save uses.
- **The ids are the wrong shape.** The release id and the verification id are sent as `release_...` and `ev_...`. The database expects a uuid (a fixed 36-character id), so both saves would fail.
- **The free gift is never created.** No starter gift is ever issued, so joining a first visit to an account always fails.
- **The first-visit pass runs out.** The anonymous pass expires after 15 minutes and is never renewed.
- **The database may be out of date.** The Worker calls functions defined in migrations 0011 to 0013. The handoff says the live database stops at 0010, and no pipeline applies Supabase migrations at all.

Class A. Seats: Anders G16, G20, G3, Sam G28, Yuki G4, G10. Evidence: read from Reboot-OS, not run (CORS, gift, 15 minutes), and read here (the uuid columns in main's SQL).

Size: 2 days, plus a check of the live migration list with the key.

**B9. The build file has no way in, and the main test gate has been broken since 5 October.**
- Commit `1a025e6` on this branch removed Guest. The only route past sign-in is now a "Skip" on the loading sheet, labelled as skipping the animation.
- A downloaded copy, which is how every build reaches you, cannot sign in either. The server only accepts atuned.world, and the error wrongly says "Check the connection".
- The same commit left `tests/functional.js` clicking the deleted button. The run stops there, so about 3,500 lines of later checks have not run since 5 October, and `5ce3934` landed untested.
- Class C. Seats: Dani G9, Priya G15. Evidence: run here (Dani measured the door in Chromium) and read here.
- Size: 1 day. 2 hours to restore a plain "Continue without an account", 2 hours to fix the test, and the rest for whatever the unrun checks find.

**B10. On this branch, a shared browser pushes one person's record into another person's account.**
- Signing out clears only the session. The open profile and the version number survive.
- When a second person signs in, their own server copy is skipped as "older", and the next save writes the first person's somatic record into the second account.
- Main narrows this by tying sync to the account id. It is still open there on first sign-in (Yuki re-check).
- Class C. Seats: Yuki G22, Priya G33. Evidence: read here.
- Size: half a day on whichever seam wins.

**B11. The live website has no crisis check.**
- Main, which atuned.world runs, has no `srcSafe`, no `move:'safe'`, and no 988 anywhere in its Source, Story, onboarding or sniffer files. Main's own deploy file calls the missing distress check "the single most important open risk".
- The handoff never mentions it. The Source "PASS" was proven on this branch's lineage only.
- Your Round PK ruling: "the distress reader ships to the private build first and clinician and counsel review gate any public launch."
- Class A. Seats: Sam G27, Tomas G2. Evidence: read here.
- Size: 1 day to bring the check onto main, after B13 is fixed.

**B12. Main's profile sync never runs, and if it did, two devices would overwrite each other.**
- It checks for a `profiles()` function that does not exist anywhere on main, so it always skips.
- If that were fixed, it decides who wins by comparing device clocks. The export stamps "now" every time, so the local copy always wins, and every device pushes every 30 seconds and never pulls.
- How to settle a clash between two devices is still open in DECISIONS.md:232. Under the Round PD rule ("a choice that has a sensible default is taken and recorded as taken"), the team will take merge by entry as the default: journal entries are combined by time and never replaced wholesale. You can overrule it.
- Class A. Seats: Yuki G0, G7, G25 re-check. Evidence: read here, and run here for the double timestamp.
- Size: 2 hours to fix the missing call. 1 to 2 days for the merge rule. Do not switch it on before both are done.

**B13. This branch's crisis check misses common wordings and does not cover the first visit.**
- Tomas ran it here. These pass with no crisis screen: "I keep thinking about killing myself", "I am thinking of ending my life", "I wanna die", "everyone would be better off without me" and "I took too many pills on purpose".
- These show the crisis screen: "I cut myself a slice of bread" and "I would never kill myself".
- It only runs on the Story tab. Onboarding still says in its own code that a stranger's first words are read "with no distress check of any kind". The funnel adapters never pass it the text, and the build file's Block 1 commits a crisis story into the field anyway.
- No gate tests it.
- Class C (`e2aa6f8`). Seats: Tomas G2, G11, G23. Evidence: run here.
- Size: 1 to 2 days. Word forms, simple negation, wiring into the first story, and a gate with these seven phrases both ways. Clinician review stays as ruled in Round PW: "explicitly not now".

## Serious

**S1. Many PASS lines cannot fail.**
- "30 server tests" is a 30 checked against a typed 30, and the real Worker has 71. "58 holes" is a 58 checked against 58.
- The signoff reads only 2 of the audits.
- The ICP pass (ICP: the six imagined customer types) passes on any input. Four of the six sentences hit the "not enough charge" dead end in the real app.
- The golden journey is a few function calls, with no screen, Mirror or release.
- The state bridge compares a value with itself.
- The 2,500 simulations only check that numbers stay in range.
- The persistence check only looks for a name.
- The privacy check reads its own patch, and the copy check reads one screen.
- Class D. Seats: all six: Anders G17, G18, Tomas G3, G14 to G17, G19, Sam G11, G16 to G18, G21, G22, G24, G26, Priya G19 to G21, Yuki G14, G15, Dani G14, G15. Evidence: read here, and run here by Dani and Tomas.
- Size: 1 day to relabel them honestly. The real proof is S20.

**S2. The funnel package runs no live traffic, so its guarantees are not live.**
- The six promises (no duplicate gift, no rerun charge, and so on) and the release-to-verification chain are proven only in a Node package that nothing in production calls.
- On the live path, the server stores whatever ids the browser makes up.
- Class A. Seats: Anders G8, G19, G31, Priya G1, G27, Yuki G17, Tomas G9, Dani G17. Evidence: read here, and read from Reboot-OS, not run.
- Size: 1 hour to say this plainly in the handoff. Server-side checking is a 1 to 2 week design job, not this round.

**S3. Verification ids point at nothing.**
- The id comes from a blank practice record that is thrown away.
- The live path sends only the first of several evidence ids, not tied to the release.
- One answer is copied onto every address in a run.
- Class A. Seats: Yuki G10, Tomas G10, G19, Priya G17, Dani G26, Anders G16. Evidence: run here (Priya probed the engine).
- Size: 1 to 2 days.

**S4. A second plan table exists, though the handoff says it does not.**
- `funnelConfig.ts` calls itself "a second copy of the same numbers". It uses `tier1` where the engine says `one`, and one tier has four names across the code.
- The handoff's ladder lists the Kundalini, which is not built, and leaves tier 4 as a placeholder.
- Class A. Seats: Tomas G7, Priya G10, Dani G10, Yuki G11. Evidence: read here, and run here (the engine's plan keys).
- Size: 1 day to read the engine's own `planSight` instead.

**S5. The build file's persistence check sends a test profile to a signed-in person's account.**
- It also empties the stores that keep refused and unreadable records.
- It is one console call away inside the product.
- Class D. Seats: Yuki G28, Anders G27, Sam G32. Evidence: read here, not run.
- Size: nothing extra once the build file is not shipped.

**S6. Migration numbers collide, and the Supabase chain has no map.**
- See "The fork". There is also no list of which number means which table, and no record of what was applied live.
- Class A. Seats: Anders G13, G3, Sam G12, Yuki G4. Evidence: read here, and read from Reboot-OS, not run.
- Size: half a day.

**S7. The free gift of 100 is counted twice, in two different units.**
- The browser counts patterns (at least 4 per run). The server counts releases (1 per run). That is a second copy of engine truth.
- It becomes a blocker the day the server count controls anything.
- Class A. Seats: Yuki G16, Dani G11, Priya G14. Evidence: read here.
- Size: 1 to 2 days. The team takes the engine's pattern as the unit.

**S8. First-visit saves fail silently and are never read back.**
- Every result of those saves is thrown away, with no `status()`. Today every visitor gets a server error (503) and is told nothing.
- Each failed start also uses up the visitor's shared address rate limit (how many tries one internet address gets).
- On reload nothing is read back, so "reload preserves continuity" has no code to test.
- Class A. Seats: Dani G1, G2, G17, G25, G26, Priya G27, Anders G26. Evidence: read here.
- Size: 1 day for the status lines, 2 days for the read-back.

**S9. The funnel's state machine has holes.**
- There are no states for failure, expiry or deletion, and no trace step.
- A safety stop is a one-way door.
- `advancePresentation` can skip release and verification.
- On the live path the state never moves from ARRIVE.
- Class A. Seats: Yuki G5, G29, Priya G36, G37, Anders G19. Evidence: read here, and read from Reboot-OS, not run.
- Size: 2 days. The team takes a default for the safety stop exit and records it.

**S10. The graph changes in the build file break the graph's own rules.**
- The build file adds a second graph rule table.
- Its editor lets any caller label an edge "user confirmed", so it can fake the person's own confirmation.
- A published graph cannot pass the engine's validation, and the editor has no button to open it.
- Class D. Seats: Tomas G12, G18, G21, G24, Sam G25. Evidence: read here.
- Size: nothing, it goes with the build file. A real editor is a design job later.

**S11. The project's own gates were never run on any of this.**
- The handoff names none of them.
- Main's CI (the automatic checks on every push) runs only the engine and build checks, never the browser gates, on all 100 handoff commits.
- `MONITOR.log`, the render watch, last ran 4 October.
- No run output was kept for any block or for the live "100 to 99 to 98" proof.
- The existing `tests/functional.js` already tests real storage across a reload. Pointing it at the build file closes the "localStorage limit" in one command.
- Class A. Seats: Sam G1, G2, G5, G19, G36, G37, G38, Anders G21. Evidence: read here, and run here (engine gate 4678 passed).
- Size: half a day to run the four browser gates on main and on the build file. 2 days to make CI run them.

**S12. Supabase holds somatic self report beside an account.**
- Event data is free-form JSON stored next to the user id.
- The concern pick leaves under the "nothing leaves" card.
- Class A. Seats: Yuki G20, Dani G6. Evidence: read here.
- Size: 1 day to limit event data to plain ids.

**S13. The plan travels inside the synced record and races the server's answer.**
- Nothing on the device checks the expiry date, so paid sight stays on until the next server check.
- Class A. Seats: Yuki G24, Tomas G13. Evidence: read here.
- Size: 1 day.

**S14. On a shared device, one person's first visit gets attached to the next person's account.**
- The first-visit pass is never cleared on sign-out.
- Someone who signs up first is never attached at all, and "owned by someone else" is never shown.
- Two tabs make orphan sessions.
- Class A. Seats: Dani G18, G19, G21, G23, G24, Anders G28, G29. Evidence: read here.
- Size: 1 day.

**S15. A release's addresses are not bound to the release.**
- The address list comes from the caller.
- A replay returns whatever the replaying caller sent, and the plan hash is never checked.
- On main, the rule "do not use a caller's id when a stored one exists" is reversed.
- Class A. Seats: Priya G13, G25, G31, Tomas G8, G25. Evidence: read here.
- Size: 1 to 2 days.

**S16. The server engine adapters are shells.**
- The Source adapter never runs the sniffer, and `candidatePatternId` is always empty.
- It never passes the story text, so the crisis check cannot fire.
- A release starts from a default soul and keeps nothing.
- Low urgency, since nothing live calls these adapters.
- Class A. Seats: Tomas G11, G20, Priya G16, G18. Evidence: run here (Priya probed `releaseWork`).
- Size: 2 days.

**S17. Money faults that exist on main too.**
- A caller can label a release a rerun and pay nothing.
- "Already opened" is never written.
- Attaching an account changes who is charged, so a unit is debited twice.
- On main the fencing check runs after the charge has already happened.
- Gift uniqueness holds per session, not per person.
- These become blockers before any money is wired.
- Class A. Seats: Priya G24, G26, G30, Yuki G30. Evidence: read here.
- Size: 3 days.

**S18. The handoff's journey leaves out your loop and the avatar.**
- It runs arrival to checkout, a list that ends. It should be the circle you ruled: discover, play, flow, embody, with the avatar at the centre.
- Class A. Seats: Dani G3. Evidence: read here.
- Size: 2 hours.

**S19. The server's test engine may be stale, and it has no production home.**
- It loads whatever `engine.js` sits at the root, and nothing checks its version.
- It needs Node features the Worker does not offer.
- Class A. Seats: Priya G6, Anders G8. Evidence: run here (the engine md5 matches today).
- Size: 2 hours.

**S20. Verification is a self-report log, not a measure.**
- There is no "before" reading. Three of the five answers are positive.
- "Nothing changed" changes nothing downstream.
- Class A. Seats: Tomas G5, G27. Evidence: read here.
- Size: 1 hour to name it a log in the documents. A real design comes later.

**S21. Schema v2 is shipped by the sync without your ruling.**
- Every save stamps version 2 and sends it off the device.
- CLAUDE.md lists schema v2 as yours.
- Not blocking, because v1 still loads. Kept here so it does not disappear.
- Class A. Seats: Yuki G27. Evidence: read here.
- Size: none to build.

**S22. No written contract between the app and the Worker.**
- There is no route list, no error shape and no version handshake.
- Old downloaded copies will call old routes forever.
- Class A. Seats: Anders G2, G26. Evidence: read here, and read from Reboot-OS, not run.
- Size: 1 day.

**S23. Releases do not record which word list or soul chose their addresses.**
- When the word list changes, a story's addresses can move while its release records stay pinned to the old ones.
- Class A. Seats: Tomas G1, G4. Evidence: read here.
- Size: 1 day.

**S24. Two tabs overwrite each other.**
- There is no cross-tab signal, so the tab that saves last overwrites the browser store and then the server.
- Class A. Seats: Yuki G26. Evidence: read here.
- Size: 1 day.

**S25. Too many choices on one screen.**
- The concern screen has 15 choices, over the floor of 12.
- The Field has 53 at desktop width.
- On a phone, Continue sits below the fold.
- Unclassified, because it was measured on the build file only.
- Seats: Dani G16. Evidence: run here.
- Size: 1 day for the concern screen.

**S26. Retention has a type and no policy.**
- The 24-month default you accepted is shown nowhere and built nowhere.
- Class A. Seats: Yuki G3. Evidence: read here.
- Size: 2 days.

**S27. Supabase's "server only" lock does not limit the Worker.**
- The Worker's key bypasses it entirely.
- Class A. Seats: Anders G22. Evidence: read from Reboot-OS, not run.
- Size: 2 days.

**S28. The record key has no rotation, and losing it loses every stored record.**
- One bad row also fails every sync read for everyone.
- Class A. Seats: Anders G5, G30. Evidence: read from Reboot-OS, not run.
- Size: 2 to 3 days.

**S29. Stripe gaps.**
- Refunds and disputes leave paid access on.
- Two tabs can make two live subscriptions, which charges a person twice.
- An unmatched payment message is dropped for good.
- These become blockers before Stripe goes live.
- Class A. Seats: Anders G6, Priya G38. Evidence: read from Reboot-OS, not run.
- Size: 2 to 3 days.

**S30. Faults only in this branch's funnel package.**
- A crash mid-release kills the request key for good and invites a second charge.
- There is no recovery route.
- A zero balance is never enforced, and the starting balance defaults to 1000, not 100.
- These close free if main wins.
- Class C. Seats: Priya G3, G4, G29. Evidence: read here.
- Size: 2 days if this branch wins.

## Minor

- M1. The handoff says "expired" access was tested, but only active, canceled and unknown were. Class A. (Yuki G13, Tomas G13, Dani G12, Sam G10)
- M2. Test counts disagree: 41, 43 and 44 on main, 94 here, and 30 against 71 for the Worker. Class A. (Anders G14, Sam G13, G20, Priya G23)
- M3. A comment on main says the browser's id is kept out of the request, and the next line sends it. Class A. (Anders G15, Sam G15)
- M4. Whether the tutorial is finished is stored in four places. Class A. (Yuki G12)
- M5. The `/feedback` relay to Discord is a fourth server piece, not in the map, with no rate limit. Class A. (Anders G7)
- M6. The deploy writes a revoked server key back on every run, and there is no rotation procedure. Class A, read from Reboot-OS, not run. (Anders G23)
- M7. Raw database errors reach public routes. Class A, read from Reboot-OS, not run. (Anders G25)
- M8. The live smoke test (a quick check against the real server) writes fake visitors to production on every run and never cleans up. Class A, read from Reboot-OS, not run. (Sam G33)
- M9. A deploy can go green with no database. Class A, read from Reboot-OS, not run. (Sam G34)
- M10. The report's base file, its citations and its file paths point at another sandbox and cannot be checked. Class D. (Sam G3, G4, G14)
- M11. The "real concurrency" tests run one after another, so no race is ever tested. Unclassified. (Priya G22)
- M12. The identity adapter calls `/v1/auth/whoami`, while the handoff says `/v1/me`. Unclassified. (Priya G12)
- M13. The build file's Block 2 adds its own rule for repeated addresses beside the engine's. Class D. (Tomas G26)

## What the handoff got right

- **The bytes match the documents.** The build file's hash matches the handoff and the manifest exactly. (Sam, Anders, Dani)
- **It is honest about what is open.** Rows 27 and 30 to 35 of its proof table are labelled open or not running, and they are. It admits the transcripts were not read, and it labels sections 31 onward as reconstruction. (Sam)
- **Several claims check out.**
  - The funnel package's 44 tests on main pass in CI.
  - The Worker's 71 tests match a static count.
  - Its diagnosis of the Worker CI failure (a missing secret) is correct.
  - Stripe code is present with 36 tests.
  - Tier 4 is closed on the server.
  (Sam rows 13, 19, 20, 24 to 29)
- **Some of the server logic is sound.**
  - A Stripe message arriving before checkout finishes is handled correctly. (Anders G6)
  - Main's `transferStarterGift` stops a second owner taking a gift. (Priya G35)
  - Main ties sync state to the account. (Yuki re-check)
- **The engine itself is sound.**
  - The engine host isolation test is real. (Priya G16)
  - `engine.js` matches its source and is host free. (Priya)
  - The engine gate passed 4678 of 4678 here. (Sam)
- **Some of what it built is real.**
  - The 2,500 simulations are a real property test (a check that rules hold, not that answers are right). (Sam G17)
  - The 58 holes count agrees with the file in Reboot-OS today, though the hash does not. (Sam G18)
  - The report's own caveat that ICP is "not customer research" is right. (Sam G21)
- **The app's behaviour holds in places.**
  - The tier 4 screen is honest: "Not open yet... nothing here can be bought", with no buy button.
  - Locked controls stay 44 pixels, focusable, and explain themselves on tap.
  - The app still opens on the Field, as ruled.
  (Dani G10, G3)
- **The checkpoint route is narrow.** It carries no raw story. (Dani G22)

## What is not merged here yet (class B)

These are on main and missing here. Bringing them over is a merge job, not a fault to fix. They only come over if main is not the line chosen to win.

- The first-visit continuity client: `authFunnelStart`, `authFunnelCheckpoint`, `authFunnelAttach`, `authFunnelRead`.
- The Guest door on the sign-in screen.
- Main's profile sync `authProfileSync` (which has its own blocker, B12).
- The dedupe after import and the account-tied sync state that narrow B4 and B10.
- `runtime.ts` and `supabaseRepository.ts`.
- Fencing tokens, `consumeUsage`, `getEvents`.
- `transferStarterGift`, which fixes this branch's gift race. (Priya G35)
- Random release ids, which fix this branch's restarting counter. (Priya G11)
- The stored replay result.
- Supabase migrations 0002 to 0013.
- The Mirror transition fix (`153ccded`) and main's 44 funnel tests.
- The atuned.world deploy workflow and the `/feedback` function.
- The 100 MOB commits listed in handoff section 32.

## The one question

**Which line becomes the real one: main, or this branch?**

The team cannot pick this for you. It decides whether the build you have been handed and testing is the product, or the build atuned.world runs is. Every sync fix above depends on the answer.

- **Main wins.** This is the team's default if we hear nothing.
  - What happens: we carry this branch's good work onto main by hand. That is the crisis check (after B13), the sniffer word pass, the voice, the release screen cleanup, the knowledge base snippets, and practitioner access with a renumbered migration. This branch's record sync is dropped, and main's is fixed (B12) before it is switched on.
  - Cost: about 3 to 4 days.
  - You lose: the build file and this branch's 94 seam tests, unless we port them.
  - You keep: the live site's line and its 100 commits.
- **This branch wins.**
  - What happens: we merge main's 123 commits into it. Both `auth.js` files were rewritten from the same start, the funnel package differs by 18 files, and the migrations clash.
  - Cost: about 5 to 8 days, with higher risk.
  - Also: the live site would switch to a different server record name and version rule.
- **Keep both.** The team will not do this. It means two server copies of every signed-in person, drifting apart.

Earlier rulings beside it. No ruling names a line of record.
- Round PD: "A choice that has a sensible default is taken and recorded as taken, so he can overrule it later."
- DECISIONS.md:1406-1407 on the stack: "Cloudflare Pages ... deploys straight from the branch on a push", so whichever line deploys is the product a person meets.
- CLAUDE.md: "Port, do not rebuild."

Rough total for the blockers if main wins: about four working weeks for one engineer.
