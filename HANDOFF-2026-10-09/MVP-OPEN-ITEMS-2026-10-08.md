# Everything still open to complete the MVP

Three seats checked main at `869610b` against a researched checklist of 100 items (C1 to C100, `MVP-CHECKLIST-sources.md`). Priya (technical director) took the foundation, Dani (UX architect) walked the journey as four imagined people in a real browser, and Sam (DevOps and QA) took operations, compliance and safety. Read off their passes: Priya 31 items, 2 done, 20 partial, 9 open; Dani 38 items, 5 done, 21 partial, 12 open; Sam 40 items, 1 done, 16 partial, 23 open. Nine items were checked by two seats. They agreed on eight; on C91 Priya said done and Dani measured a false message, so it counts as partial. Across the 100 that leaves 7 done, 54 partial and 39 open. Those 93, the 51 items of the 8 October gap review that are still open, six findings outside the checklist, and the dead password reset link merge into the 94 lines below, M1 to M94, 16 of them blockers.

How to read each line:

- **Ids.** C numbers are the checklist. B and S numbers are the gap review (`HANDOFF-GAPS-2026-10-08.md`). The gap review's minor items are written "gap M5" so they do not get mixed up with this list's M numbers. "Priya X1" and "Sam X1" are findings outside the checklist.
- **Size.** Small is under a day, medium is 1 to 2 days, large is 3 days or more. Days are one engineer's working days.
- **Block.** Blocks 1 to 7 are the game plan (`GAME-PLAN-main-cleanup.md`). Five new blocks are proposed for work the plan does not cover: **N1** sign in hardening, **N2** running the service, **N3** legal and policy, **N4** the circle and the screens a person meets, **N5** the private launch. **Q** is the plan's own list of things queued on purpose.
- **Order of work is the block, not the section.** Now: block 1 (M1), with N2's practice server (M4) and the key's second copy (M6) beside it, and the lawyer booked (M64). Then block 2: crisis check first (M59), then honest privacy words (M62), the reset screen (M3), then the other ports (M2). Then block 3 (records), with the backup export (M5) landing before sync switches on, and N1 running beside it, because N1 is mostly server work and block 3 changes no server code. Then blocks 4, 5 and 6 in order, since they edit the same server file. N4 starts once block 4 makes the first visit work. N3 finishes before launch. Then block 7, then N5.

## Done, so you know what you have

- **The engine is solid.** 4678 of 4678 engine checks pass on main (`STABILITY.md` baseline). Boot checks pass 13 of 13.
- **Bad imports are refused by name and rolled back.** A typed 9999, ten other bad fields and a failed save all roll back cleanly (`tests/engine.js:548-596`).
- **Each sign in gets a fresh pass.** 32 new random bytes every time, and the server keeps only a fingerprint of them (C12).
- **A failed sign in and a reset request give one answer whoever asks**, so they do not reveal who has an account (C7, half of it).
- **Records on the server are sealed at rest**, and the server refuses to store anything if the key is missing (C18, half of it).
- **Every Supabase table has row security on**, which means only allowed readers get rows (C17, half of it).
- **The microphone is asked for only when Record is pressed.** No other permission is asked anywhere (C19, half of it).
- **The record link from the quiz is wiped from the address before it is read**, and a test checks it (C14).
- **No Stripe key, customer id or card field is in the build**, and a gate holds that (C16, half of it).
- **The paid plan is read from what is in force.** An unknown status grants nothing, and a late payment keeps access (C36).
- **Paste and password managers work at sign in**, with no puzzle (C79).
- **Every tab fits a 320 pixel screen** with no sideways scroll, even with enlarged text spacing (C85).
- **Status messages are announced to screen readers**, and nothing flashes fast enough to harm (C88, C89).
- **No data is sold, no location is asked, and no tracker loads.** A gate fails on any outside request (C60).
- **The results screen after a release is good.** It explains Bank, Vault and DQ in place (Dani's walk).
- **The path works for a practitioner.** Sofia, level 8 on the team's customer grid, walked it without stopping.

## In flight today

- **Supabase key: done, and the live check is green.** You set the key today. It took four small server fixes to get there (Reboot-OS PRs #7 to #10: accept both kinds of key, route the first visit code through the one header builder, check the key against the project before deploying, and wait for the new version to reach the edge). Run 37853093835 passed every step: health, the browser origin rule, create a first visit session, read it, write a checkpoint, read it back. So the red runs Sam counted in M50 were this one failure. The deploy order problem in M50 stays open.

## Foundation (must be stable before anything else)

**M1. The tests do not run on every change.**
The automatic checks that guard the product (the gates) only run the engine test, only after a change is already on main, and then the change goes live. The browser tests have never run there, about 30 test files point at a browser path that does not exist on GitHub's machines, and the main browser test fails 2 checks on one test that drifted. Until this is fixed, nothing else on this list can be proven fixed.
- State: open. Severity: blocker. Size: large, 4 to 5 days. Block: 1.
- Ids: S11, B9 (the test half), Sam X5, C14 (`tests/recordlink.js` is not in the gates), C52 (part); plan rule 1.
- Closes when: every gate runs on every pull request as a required check, the deploy waits for them, `tests/recordlink.js` is in the list, and you turn on branch protection (plan step 2).

**M2. The good work from the other branch is not on main yet.**
Main is ruled the line, so the old branch's work comes over by hand, one piece per pull request. That is the sniffer word pass (the word reader that turns a story into charge), the funnel seam folder, the practitioner database change renumbered 0014, the release screen cleanup, the voice, the knowledge snippets and the skip for returning people. The old branch's own record copying is dropped, which closes B4 and S30 for free.
- State: open. Severity: serious. Size: large, 3 to 4 days (the crisis and privacy ports are M59 and M62). Block: 2.
- Ids: B2, B4, S30, S6 (part).
- Depends on: M23 (the voice calls a server route that does not exist) and M68 (the voice company is in no policy). Until both land, the voice stays off by default, as it is today.
- Closes when: each port is merged green and `DECISIONS.md` has one line per piece, ported or dropped.

**M3. "Forgot your password?" leads nowhere.**
The server emails a reset link, but the app never reads it, so the link opens the plain Log in card. A person who forgets their password cannot get back to the record in their account. The retired file had a "Set a new password" screen, but it read the wrong kind of link, so it is ported rewritten, not copied.
- State: partial (the server half exists). Severity: blocker. Size: medium, 1 day. Block: 2, as a port from the retired file.
- Ids: C9, C10, C30 (part), Priya, Dani; ARTIFACT-RETIRED new finding, proposed S31.
- Closes when: `?reset=` opens a set password screen, the token is wiped from the address, the screen says every device was signed out, the person then lands on Log in (team default for C10), and a browser gate that fails today passes.

**M4. There is no practice copy of the server.**
Today there is one server program, one of each database, and every merge goes straight to atuned.world. A practice copy (staging) is where a change can break first. It changes the plan's rule 8, which says there is no staging, and it lets blocks 4 to 6 be tested away from real people.
- State: open. Severity: serious. Size: medium, 1 day. Block: N2, start now.
- Ids: C38, Priya, Sam; plan rule 8.
- Closes when: a staging Worker with its own D1 database and its own Supabase project exists, and a gate can point the app at it.

**M5. There is no backup beyond the built in window, and the policy promises 90 days.**
The policy drafts promise a deleted record stays in backups for 90 days, and that one account can be restored. Cloudflare's built in undo for D1 (the Worker's own database) keeps 7 or 30 days depending on the plan, and it restores the whole database at once, not one person. Nobody knows which plan this is, and nothing exports a copy.
- State: open. Severity: blocker. Size: medium, 1 day. Block: 6, pulled forward to land before block 3 switches sync on, because sync puts records on the server.
- Ids: C43, C59, B5 (part), Priya, Sam.
- Closes when: the plan is read, a sealed export to R2 (Cloudflare's file store) runs on a schedule and is deleted at 90 days, and the policy says what the export really does.

**M6. One key locks every stored record, there is one copy of it, and it cannot be changed.**
Every record on the server is sealed with one key. Lose it and every record is lost, and one bad row breaks every sync read for everyone. A second sealed offline copy, held by one trusted person, is already ruled (round PD) and not done.
- State: partial (the sealing itself is done). Severity: blocker. Size: large, 2 to 3 days for the change; 1 hour for the second copy. Block: second copy now; the change in N2 (the plan queues S28).
- Ids: S28, C18 (part), C43 (part), Priya, Sam.
- Closes when: the second copy exists, each sealed row carries a key version so the key can be swapped, and one bad row is skipped and reported instead of failing every read.

**M7. Record copying must be fixed before it switches on.**
Main's sync (copying a person's record between their device and the server) does not run today only because it calls a function that does not exist. Fixing that one call switches it on live, and as written it would copy one device over another, send the name and birth details off the device against your ruling "The name never leaves", and on a shared browser push one person's record into the next person's account. The plan fixes all of it in one change, with an off switch first.
- State: open. Severity: blocker. Size: large, 6 to 8 days. Block: 3.
- Ids: B12, B6, B10, S14, S24, S21, C19 (part), C51 (part: the sync's answer is never read), Priya.
- Depends on: M5 (a backup before records land on the server), M1 (`tests/sync.js`).
- Closes when: `tests/sync.js` is green, a journal entry written on each of two browsers survives on both, and name and birth stay on the device.

**M8. Importing the same record twice makes two copies.**
Bad and broken records are refused and rolled back, and that is tested. But pasting or opening the same record twice leaves two profiles with one id, and only the sync import cleans that up. On reload the wrong copy can open.
- State: partial. Severity: serious. Size: small, 2 to 3 hours. Block: 3.
- Ids: C22, Priya (measured), same class as B4.
- Closes when: `pImport` (the one door every import goes through) replaces or refuses a record whose id is already held, says which, and a test pins it.

**M9. The browser can wipe a guest's only copy without a word.**
For anyone not signed in, the only copy of their record is the browser's own storage. Safari deletes that storage when a site has gone unused for seven days of browsing, and any browser may clear it when the disk is full. A failed save is reported; a cleared store is not, so the person just finds nothing.
- State: open. Severity: blocker. Size: small, half a day. Block: 3.
- Ids: Priya X1.
- Closes when: the app asks the browser to keep its data after the first committed story, the profile sheet says plainly that the saved file is the backup, and what Safari does is measured.

**M10. "Tutorial finished" is kept in four places.**
Whether a person finished the tutorial is stored four times. Four copies can disagree, and once sync runs they can disagree across devices.
- State: open. Severity: minor. Size: small, 2 hours. Block: 3.
- Ids: gap M4.
- Closes when: one place holds it and the rest read from it.

**M11. The password minimum is 8 characters.**
With no second sign in step, the security standard most teams use (OWASP) asks for at least 15 characters and no rules about symbols. It is cheap now and costly after the first hundred sign ups, because their passwords cannot be lengthened for them.
- State: open. Severity: serious. Size: small, 2 hours plus a server deploy. Block: N1.
- Ids: C5, Priya.
- Closes when: new accounts need 15 on both the app and the server; existing accounts still sign in.

**M12. Passwords are scrambled less than the standard asks.**
Passwords are stored scrambled with a method called PBKDF2 at 100,000 rounds, and the standard now asks for 600,000. Cloudflare may refuse more than 100,000, which would explain the number; that is to be confirmed. The team default is to keep 100,000 together with the 15 character floor in M11 and record it as decided, unless a stronger method measures as fitting.
- State: partial. Severity: serious. Size: small, 1 hour to record; medium, 1 to 2 days to replace. Block: N1.
- Ids: C6, Priya.
- Closes when: the choice is recorded before the first hundred accounts, or a stronger method (scrypt or Argon2id) upgrades each password at its next sign in.

**M13. Email addresses are never checked, and sign up tells strangers who has an account.**
Sign up creates the account and signs in at once without checking the email is real, so recovery mail and breach notices may go nowhere. Sign up also answers "An account already uses that email", which tells anyone who types an address that this person uses a somatic self report tool. Checking the email first lets sign up give the same answer every time.
- State: open. Severity: serious. Size: medium, 1 to 2 days. Block: N1.
- Ids: C29, C7, Priya, Dani.
- Closes when: a short lived confirm link is sent, the app says "check your email" until it is pressed, and sign up answers the same whether or not the address exists.

**M14. The site sends none of the standard safety rules with its pages.**
There is no content policy (a rule sent with the page that says which scripts may run), no rule forcing the secure address on atuned.world (HSTS), and nothing stopping another site from showing our sign in page inside its own. This matters more here because the sign in pass sits in browser storage, where any injected script could read it. The team keeps that design, records it as decided (C11), and makes the content policy its guard.
- State: open. Severity: serious. Size: medium, 1.5 to 2.5 days. Block: N1.
- Ids: C1, C2, C3, C11, Priya.
- Closes when: a `_headers` file ships with the site carrying the content policy (report only first, then enforced), no sniffing, no framing and HSTS; the server sends the same; and the site is submitted to the browsers' secure only list.

**M15. The lockout can be used to lock a person out on purpose.**
Ten wrong passwords in fifteen minutes locks that email for fifteen minutes, counted per email and per internet address, which is right. But the lock never grows, so a stranger can keep someone locked out just by typing their email, and nobody can see how often it fires.
- State: partial. Severity: serious. Size: small, half a day. Block: N1.
- Ids: C8, C45 (part), Priya.
- Closes when: the lock grows with each round of failures, and every lock is counted where we can see it.

**M16. A sign in lasts 90 days, with no sign out for being idle.**
Sign out works on the server, which is right. But a sign in lasts 90 days whether or not the phone is used, phones get shared and left open, and the record behind it is health data. Team default: signed out after 7 days unused, and after 90 days in any case (yours to change, below).
- State: partial. Severity: serious. Size: small, half a day. Block: N1.
- Ids: C13, Priya.
- Closes when: the server ends a session at the idle limit and at the overall limit.

**M17. The reset email's sender and limit are unchecked.**
Reset mail goes through a sending company (Resend) from hello@atuned.world once its key is set. Nobody has checked the two mail records that prove the mail is really from us, or how many mails an hour it allows. A launch on a low limit strands most of the first group.
- State: partial. Severity: serious. Size: small, half a day. Block: N1.
- Ids: C30 (part), Priya, Dani.
- Depends on: M3, so a real reset can be sent end to end.
- Closes when: the domain is verified with the sender, one real reset is sent and used, and the hourly limit is read before the private launch.

**M18. The quiz's record link may stay in browser history.**
The quiz can open the app with the person's scores in the address after `#r=`. That part of an address never reaches a server, and the app wipes it before reading it. Nobody has checked whether the browser's own history list keeps it on a shared device.
- State: partial. Severity: minor. Size: small, 2 hours. Block: N1.
- Ids: C14, Priya, Sam.
- Closes when: measured in Chromium and Safari; if history keeps it, the quiz sentence says so or the saved file becomes the default route.

**M19. The Supabase account is not locked down, and the server's key goes around its lock.**
Row security on every table is good. But the Worker uses a master key that skips that lock entirely. The account's own settings (secure connections only, network limits, a second login step on the account, a second owner) cannot be seen from here.
- State: partial. Severity: serious. Size: medium, 2.5 days (half a day of settings, 2 days for the key). Block: N1.
- Ids: C17, S27, Priya.
- Closes when: the settings are on and recorded, and the Worker uses a narrower key or its own policies.

**M20. The first visit server routes work from a script; the browser side is unproven.**
The key is in and the live check is green from a script (run 37853093835), which already disproves part of the gap review's B8: the session is created, so the database functions it needs are live, and the checkpoint writes and reads back. What the script does not exercise is what a browser does: the preflight for the PATCH save (the browser origin rule, CORS, names which sites and which methods may send), the free gift being created, the shape of the release and verification ids, and the 15 minute expiry of the first visit pass against a real first visit's length. Those four stay open until a browser test proves or disproves each.
- State: partial. Severity: blocker. Size: 2 to 3 days. Block: 4.
- Ids: B8 (part), S4, C17 (part).
- Depends on: M1.
- Closes when: the live check passes end to end, the funnel's second copy of the plan table is replaced by the engine's own (S4), and one real person walks arrival to release to reload on atuned.world with every step surviving.

**M21. Database changes are applied by hand, and their numbers collide.**
A migration is a numbered change to a database's layout. D1's are applied by the pipeline, but Supabase's 0001 to 0013 are applied by nobody, and nothing records what is live. The same numbers also name different changes across the two databases and the old branch.
- State: partial. Severity: serious. Size: medium, 1 to 2 days. Block: 2 (the number map) and 4 (the apply step).
- Ids: C39, S6, B8 (part), Priya, Sam.
- Closes when: one number map exists, and a deploy step applies Supabase changes and refuses to go green on a mismatch with block 0's snapshot.

**M22. When the server fails, the person is not told, or is told the wrong thing.**
Every first visit save throws its result away, so today each visitor gets a server error and hears nothing, and nothing is read back on reload. A downloaded copy that cannot sign in says "Check the connection" when the real cause is that the server only accepts atuned.world. There is no written list of what a person sees when the Worker, a database, Stripe or the mail sender is down.
- State: partial. Severity: serious. Size: large, 3 days. Block: 4.
- Ids: S8, C51, B9 (the download error), C26 (part), Priya, Sam.
- Closes when: every save reports through `status()` (the app's status line), progress is read back on reload with a browser test, and a four row failure table has a status line for each row.

**M23. The app and the server have no written agreement on how they talk.**
There is no list of routes, error shapes or versions both sides follow. The app already calls a voice route the server does not have, and it never asks the server's version route, so old downloaded copies will call old routes for ever.
- State: open. Severity: serious. Size: medium, 1 to 1.5 days. Block: 4.
- Ids: S22, C41 (part), Sam X4, gap M12.
- Closes when: one contract file sits in both repositories with a test in each that fails on drift, and the app checks `/v1/version` at sign in.

**M24. A server deploy can go green with no database, and it writes back a revoked key.**
The Worker's deploy can report success with no database behind it, and it writes an old, revoked key back on every run. Its secrets (keys Cloudflare keeps for it) are not listed as required, so a missing one fails at the first customer, not at deploy.
- State: partial. Severity: serious. Size: small, half a day. Block: 4.
- Ids: C4, gap M6, gap M9, Priya.
- Closes when: every secret is listed as required and both deploy faults are fixed.

**M25. Deleting an account does not delete it everywhere.**
In the app, delete is local only and says "There is no store yet". The server's delete clears D1 only, leaving Supabase rows and a live Stripe subscription, so a deleted person keeps being billed. With no "this was deleted" marker (a tombstone), another device brings the record back.
- State: open. Severity: blocker. Size: large, 4 to 5 days. Block: 6.
- Ids: C67, B7, C59 (part), Priya, Sam.
- Depends on: block 5 (Stripe must be real to cancel it), M4 (to test away from real people).
- Closes when: one delete cancels Stripe, then Supabase, then D1 last, with a pending row until all three succeed, a tombstone, honest words, a two step confirm, and `tests/delete.js` green.

**M26. Supabase keeps free form notes next to the account.**
First visit events are stored as free form notes beside the person's account id, unsealed. They can carry what a person picked, such as a concern like grief.
- State: partial. Severity: serious. Size: medium, 1 day. Block: 6.
- Ids: S12, C18 (part), C19 (part), Priya.
- Closes when: event data carries plain ids only, never story text or body readings.

**M27. A restore has never been practised.**
A D1 restore overwrites the whole database in place and stops anything running. The first time it runs should not be the day it is needed.
- State: open. Severity: serious. Size: medium, 1 day. Block: N2.
- Ids: C44, Priya, Sam.
- Depends on: M4 (staging) and M5 (an export to restore).
- Closes when: the export is restored into staging, a known record opens with the record key, and the steps are written down.

## Journey (the core loop a person walks)

**M28. The first release breaks the promise made one screen before.**
The card before it says the first release is 4 lines, read in silence, with no countdown. The next screen shows 200 patterns, a 28 minute timer counting down, the voice switched on, and a placeholder line ("Until it is recorded, read it to yourself"). In Dani's walk Angela stops right there; the engine is right, the screen reads the wrong numbers, and no test looks at the screen.
- State: open. Severity: blocker. Size: medium, 1 to 1.5 days. Block: 2 (the release screen port may close part), then N4.
- Ids: C26 (part), Dani.
- Closes when: the setup and run screens read the 4 line plan, the voice and the countdown match the card, the placeholder line is gone, and a gate checks the screen and not only the plan.

**M29. The circle does not close, and the avatar never appears.**
After a release, Done and End session drop a person on a Field with 55 to 59 choices and no line saying what comes next. The avatar, ruled the centrepiece, is missing from the whole first visit except as the fourth door in a side column. Your loop, discover, play, flow, embody, has no next turn.
- State: partial. Severity: blocker. Size: large, 2 to 3 days, after your one sentence (below). Block: N4.
- Ids: C23, S18, C25 (part), Dani.
- Closes when: after a release the screen shows one next step back into the circle, the avatar is on the results and in the first visit, and block 7's walk closes the circle.

**M30. Too many choices on one screen.**
The Field shows 53 choices at desktop width and the concern screen 15, against the product's own floor of 12. The private build also carries 12 tabs and 7 lightings that are not on the circle.
- State: partial. Severity: serious. Size: large, 3 days. Block: N4.
- Ids: C25, S25, Dani.
- Closes when: everything not on the circle sits behind one door in the private build, and the concern screen is under 12.

**M31. A stranger's first seven seconds say nothing, then "Log in".**
A stranger sees dots, then a black screen, then a card headed "Log in" with a "Guest" button that has no meaning beside it. Taps in the first six seconds are swallowed by the loading sheet, and a guest meets the Log in card again on every visit.
- State: partial. Severity: serious. Size: medium, 1 day. Block: N4 (block 2's skip for returning people covers part).
- Ids: C83 (part), B9 (the door), C90 (part), Dani.
- Closes when: the first screen says what this is, taps work as soon as the card shows, Guest carries its meaning, and a guest with a record skips the card on return.

**M32. Labels print with no meaning beside them.**
James's first release is named "Spiritual Language To Manipulate" with nothing explaining it, and he closes the tab. The release setup also prints Separation, Run speed, Left and right 25 50 100 and Binaural tone bare, and the login card prints Guest. The checklist filed this as polish, but your round PO ruling makes it a gate: a term with no meaning beside it fails.
- State: partial. Severity: serious. Size: small, half a day. Block: N4.
- Ids: C98, Dani; round PO.
- Closes when: the unpack gate (`tests/unpack.js`) covers the release setup and the login card, and passes.

**M33. The quiz story has to be written twice.**
The quiz's link carries the scores but not the story, so a person who wrote it on the quiz writes it again in the app.
- State: partial. Severity: minor. Size: medium, 1 day. Block: N4.
- Ids: C83 (part), Dani.
- Depends on: M18. If browser history keeps the link, the story stays out of it.
- Closes when: the story rides in the part of the link a server never sees, and lands in the app.

**M34. The free gift is counted twice, in two different units.**
The app counts the gift of 100 in patterns, at least 4 per run; the server counts releases, 1 per run. Billing says "100 patterns left" while the first release screen offers 200.
- State: open. Severity: serious, and a blocker the day the server's count controls anything. Size: medium, 1 to 2 days. Block: 5.
- Ids: S7, C26 (part), Dani.
- Closes when: the engine's pattern is the only unit and the second count is gone.

**M35. Money faults that can charge twice or charge nothing.**
A caller can label a release a rerun and pay nothing, and attaching an account can charge one unit twice. The fencing check (a number that refuses a late write) runs after the charge instead of before, and the gift is one per session, not one per person.
- State: open. Severity: blocker before any real money moves. Size: large, 3 days. Block: 5.
- Ids: S17.
- Closes when: each fault has a test that fails first and passes after.

**M36. Stripe can leave paid access on, or charge twice.**
Refunds and disputes leave paid access on. Two tabs can make two live subscriptions for one person, and a payment message that matches nobody is dropped for good.
- State: open. Severity: blocker before any real money moves. Size: large, 2 to 3 days. Block: 5.
- Ids: S29 (part).
- Closes when: each case is replayed in the server's tests and in the nightly Stripe test mode run.

**M37. Stripe's payment messages are not fully checked.**
A webhook is the message Stripe sends us when a payment changes. Ours checks the signature but not its age, so a captured message can be replayed for ever; it keeps no unique id, so a repeat is not skipped; and the Stripe version is not pinned, so the message's shape can change under us.
- State: partial. Severity: blocker before any real money moves. Size: medium, 1 day. Block: 5.
- Ids: C32, C33, C35, S29 (part), Dani.
- Closes when: messages older than five minutes are refused, event ids are unique and skipped on repeat, the version is pinned, and the live endpoint has its own live secret.

**M38. The plan the app shows can be out of date.**
The paid plan travels inside the synced record, and nothing on the device checks its end date, so paid access stays on until the next server check.
- State: open. Severity: serious. Size: medium, 1 day. Block: 5.
- Ids: S13.
- Closes when: the server's answer always wins and the device checks the end date.

**M39. Nobody but a developer has walked the billing.**
Checkout and the billing page use Stripe's own hosted screens, which is right. Nobody has walked buy, upgrade, downgrade, cancel and a failed card, and the price ids are still placeholders, so the walk cannot happen yet.
- State: partial. Severity: serious. Size: small, half a day of your time. Block: 5.
- Ids: C31, C52 (part), S29 (part), Dani, Sam.
- Closes when: you walk the five paths in Stripe test mode on atuned.world once the price ids are real (plan step 4).

**M40. Stripe keys are not rotated, and the server's key can do everything.**
No key is in the code, and a gate holds that. Before go live every key should be replaced in case one was pasted somewhere, and the server should get a narrow key that can only read subscriptions and open Stripe's own screens.
- State: partial. Severity: serious. Size: small, 1 hour. Block: 5, at go live.
- Ids: C16, Priya.
- Closes when: the keys are rotated and the narrow key is in use.

**M41. The Stripe handler does its work before it answers.**
Stripe expects a quick answer; ours reads Stripe first and then answers. That is fine at this size and slow under load.
- State: partial. Severity: minor. Size: small, 1 hour to record. Block: 5.
- Ids: C34, Dani.
- Closes when: recorded as accepted for the private launch, with a queue noted for later.

**M42. There is no chosen first group.**
The advice is 10 to 30 hand picked people with a direct line to you. "The first hundred" is named as a tier perk, but nobody is chosen and there is no group channel or date.
- State: open. Severity: serious, since there is nobody to launch to. Size: small, 1 day. Block: N5.
- Ids: C24, Dani.
- Closes when: a named list, a group channel and a date exist (your pick, below).

**M43. The way to tell us something is hidden.**
Product feedback sits two levels deep in Account, goes to Discord with no way to reply, and nobody is named to read it daily.
- State: partial. Severity: serious. Size: small, half a day. Block: N5.
- Ids: C37, Dani.
- Closes when: a "Tell us" line sits on the results screen and in Help with an optional reply email, and a daily reader is named.

**M44. There is no measure of the first moment that works.**
Activation is the first moment a new person gets real value, the one that predicts they come back. None is defined, and the checkpoints the app sends fail silently and are never read back.
- State: open. Severity: serious. Size: medium, 2 days. Block: N5.
- Ids: C26 (part), S8 (part), Dani.
- Depends on: M22 (checkpoints land) and M28 (the screen keeps its promise).
- Closes when: activation is "first release finished and What changed answered", and the share of all new people who reach it is counted.

**M45. There is no measure of who comes back.**
Cohort retention means: of the people who started the same week, how many came back. The only figures are a simulation of made up people, and the test that a milestone predicts return (the 2x test) has nothing to compare yet.
- State: open. Severity: minor until the group exists. Size: medium, 2 days plus 2 hours. Block: N5.
- Ids: C27, C28, Dani.
- Closes when: weekly cohorts are read off real server rows, and after four weeks the 2x test is run.

**M46. Release records do not prove what they claim.**
Verification ids point at a blank practice record, a release's body addresses are not tied to the release, and releases do not record which word list chose them. Verification is a self report log, the funnel's step machine has no exits for failure or expiry, and the server's engine adapters are empty shells. The plan queues these on purpose for one design round.
- State: open. Severity: serious. Size: large, 7 to 9 days. Block: Q, with S20's renaming in block 7.
- Ids: S3, S9, S15, S16, S20, S23.
- Closes when: a design round settles the shape and each is built with a test.

**M47. Google sign in is not built.**
Email and password is the launch route. Google sign in is designed and not built, and it is not needed for the MVP.
- State: open. Severity: minor, not an MVP gate. Size: large, 3 to 5 days. Block: N1, after launch.
- Ids: C15, Priya.
- Closes when: it lands with the code flow plus PKCE (a one time proof that the app asking is the app that started), an exact return address and a one time state value.

## Operations (deploy, tests, backup, recovery, support)

**M48. The FAQ link is likely broken on the live site.**
The FAQ page is built and linked seven times from three live pages, but the deploy never copies it up, so it likely shows "not found".
- State: open. Severity: minor. Size: small, 10 minutes. Block: 1.
- Ids: Sam X2.
- Closes when: the deploy stages it and the built files check covers it.

**M49. The repository is public, and GitHub serves a second copy of the site.**
Anyone can read the MOB repository, and GitHub Pages builds from main, so builds without a crisis check and documents that call this "a somatic diagnostic instrument" sit at an address that is not atuned.world. It also undoes the reason dev branch previews were stopped. No live key was found in today's files, and the history was not checked.
- State: open. Severity: serious. Size: small, 10 minutes for Pages; up to a day to go private. Block: 1, after your call.
- Ids: Sam X1.
- Closes when: you rule (below), and the git history is swept for keys either way.

**M50. The server goes live before its own check, and going back has never been practised.**
The Worker deploys first and only then runs its quick live check (the smoke test). It was red on 5 of the last 8 runs Sam read, and nothing rolled it back. Upload and go live are one step, there is no gradual rollout, rollback (putting the last good version back) is written down nowhere, and each smoke run leaves fake visitors in the live database.
- State: open. Severity: serious. Size: small, half a day to 1 day. Block: N2.
- Ids: C40, C41 (part), C42, Sam X3, gap M8.
- Closes when: a version is uploaded, checked on its own preview address and only then put live; a Worker and a Pages rollback have each been run once and written down; and the smoke cleans up after itself.

**M51. Nothing raises an alarm when the server breaks.**
The server records crashes and errors, but its log setting is unknown, no alert fires on the Worker's own error codes, the app never sends its crashes, and the health check runs only at deploy time.
- State: partial. Severity: serious. Size: medium, 1 day. Block: N2.
- Ids: C45, C46, Sam.
- Closes when: Worker logs are on in full, the app's guard posts to `/v1/crash`, and an outside check on atuned.world and `/v1/health` texts a phone.

**M52. Logs have no stated limits.**
The feedback route logs a status and never the message, which is right. Whether the Worker logs request bodies, which at sign in are the record, and how long logs are kept, is written down nowhere.
- State: partial. Severity: serious. Size: small, 2 hours. Block: N2.
- Ids: C21, Priya.
- Closes when: Worker logs leave request bodies out and the policy states how long logs live.

**M53. There is no support address a person can see.**
The policy drafts name hello@atuned.world, but the app prints no address, nobody has confirmed the mailbox gets mail, and the feedback relay has no limit on how often it can be used.
- State: partial. Severity: serious. Size: small, half a day. Block: N2.
- Ids: C53, gap M5, Sam.
- Closes when: the address forwards to a person, is printed in Help and a footer with a reply window, and the relay is rate limited.

**M54. Nobody is named for when things go wrong.**
There is no severity scale (how bad an incident is, and who says so), no template for writing up what happened, and no backup person for when you cannot be reached.
- State: open. Severity: serious. Size: small, half a day. Block: N2.
- Ids: C47, C48, C49, Sam.
- Closes when: a one page scale puts any data exposure at the top, a write up is due within 5 days, and a backup person and a runbook are named (your pick, below).

**M55. Nobody has checked the Cloudflare limits against the first group.**
Cloudflare's plan and its daily limits are unknown, so nobody knows whether the first group could use up a daily allowance and cut sign in for the rest of the day.
- State: open. Severity: minor. Size: small, half a day. Block: N2.
- Ids: C50, C43 (part), Sam.
- Closes when: requests per person per day are counted and compared with the plan's limits.

**M56. Raw database errors reach public routes.**
Some public routes pass the database's own error text straight back, which can show inner detail to anyone.
- State: open. Severity: minor. Size: small, half a day. Block: 4.
- Ids: gap M7.
- Closes when: public routes return a plain error with an id, and the detail stays in the log.

**M57. Some "pass" labels cannot fail.**
Several checks in the handoff pass on any input, like a test count typed as 30 and checked against 30. The funnel package is a tested reference that nothing live calls, and verification is a self report log, but the documents say otherwise.
- State: open. Severity: serious. Size: large, 2 to 3 days. Block: 7.
- Ids: S1, S2, S19, S20, S18 (the journey document), gap M1, gap M2, gap M3, gap M11; retired file groups 9 and 15.
- Closes when: every such line gets a real check or an honest name, and the new handoff cites a run for each row.

**M58. The whole launch path has never been run end to end.**
Build, gates, pack, deploy, sign in, pay, cancel and delete have never been run in one go. Pay and delete cannot be yet, because the Stripe ids are placeholders and delete everywhere does not exist.
- State: open. Severity: serious. Size: medium, 1 to 1.5 days plus 1 hour of yours. Block: 7.
- Ids: C52, Sam; block 7's exit gate.
- Depends on: M25, M39.
- Closes when: `tests/journey.js` scripts the walk and you walk it on atuned.world.

## Compliance and safety (health data, privacy, crisis, claims)

**M59. The live site has no crisis check.**
When someone types that they want to hurt themselves, the app should show 988 (the US suicide and crisis line); on main it does not, and the public quiz takes a story with no check either. The old branch's check misses "I wanna die" and "I keep thinking about killing myself", fires on "I cut myself a slice of bread", and skips a stranger's first story.
- State: open. Severity: blocker. Size: large, 2 to 3 days. Block: 2, the first pull request (its gate lands in block 1).
- Ids: B11, B13, C73, Sam.
- Closes when: the fixed check runs on main and on the quiz, the seven phrases trip it and the three do not, the first visit story reaches it, 988 can be tapped, and a check that the number still works is scheduled.

**M60. The app never says it is not medical care.**
The buy page says it does not diagnose or treat, but the app itself says nothing, and nothing sits beside the Story box where a person in distress writes.
- State: partial. Severity: serious. Size: small, 2 hours. Block: 2, with M59.
- Ids: C72, Sam.
- Closes when: the "not medical care" and "not an emergency" lines (`reviews/LEGAL-floor.md` blocks B and C) sit in the app beside the composer.

**M61. The crisis words are unchecked against the field's guidance, and 988 is US only.**
There is no crisis copy on main to review yet. 988 works only in the United States, and Europe and the UK are open at launch, so a person there needs their own route.
- State: open. Severity: serious. Size: small, half a day. Block: 2, with M59.
- Ids: C74, C75, Sam.
- Closes when: the copy is checked against the 988 Messaging Framework, the 988 logo is used unaltered, and one line plus a finder link covers other countries.

**M62. The privacy words are false.**
The first card says "Nothing you write leaves this device", and one tap later the chosen concern goes to the server. The Privacy page says "Held in this browser and nowhere else", delete says "There is no store yet", and the quiz says "There is no account and no server". An "Improve the Models" switch is drawn that nothing reads.
- State: partial. Severity: blocker. Size: medium, 1 day. Block: 2, item 3.
- Ids: B1, C20, C19 (part), C83 (part), C100 (part), Priya, Dani, Sam; retired file port candidate 2.
- Closes when: the words match what main does, the switch is gone, and `tests/copy.js` fails on "this device", "nowhere else" or "no store" while sync is reachable.

**M63. The modelling switch and the policy say opposite things.**
Your ruling says the story is "used only for modelling", a later team default says research sharing is "off, not offered at launch", and all three policies say no model is trained. The server has a research path behind a consent flag that starts off.
- State: partial. Severity: serious. Size: small, half a day after your line. Block: 2, item 3.
- Ids: C69, B6 (the consent part), Sam.
- Closes when: you confirm or change the default (below), `DECISIONS.md` records it, the switch is gone (M62), and the server path stays unreachable or behind its own consent box.

**M64. The policies are drafts, and no lawyer has read them.**
The three policies carry 85 open markers ([CHECK], [PLACEHOLDER], [PROPOSED]), counted by Sam. The health data policy, which Washington's law wants at its own link on the home page, is not deployed or linked, and the drafts say "Effective from: [PLACEHOLDER]".
- State: open. Severity: blocker for any launch. Size: half a day to 1 day of team time; the lawyer's days to weeks. Block: N3, book the lawyer now.
- Ids: C55, C77, C96 (part), Sam.
- Closes when: a lawyer who knows Washington and Nevada law reads them, every marker is resolved, and the health data page is live at its own link with a real date.

**M65. Sign up asks no consent and no age.**
Create account is one button. There is no separate yes to collecting health data, no record of which policy version was accepted, and no box confirming the person is 18, which you ruled.
- State: open. Severity: serious. Size: medium, 1 day. Block: N3.
- Ids: C56, C68, B6 (part), Sam.
- Closes when: sign up has its own consent box and an 18 or over box, refuses without them, and the server records the policy version accepted.

**M66. The word "diagnostic" and clinical names still ship.**
Public pages say "not a diagnosis", which is right. But the app prints "From your diagnostic", the shipped file carries clinical names like "depression, BPD, anxiety" that anyone can read with view source, and a public page carries a hidden comment quoting "a somatic diagnostic instrument". The government's line between wellness and medical devices (FDA general wellness) judges by what the maker says, too.
- State: partial. Severity: serious. Size: small, half a day. Block: N3.
- Ids: C70, Sam.
- Closes when: the two labels change, the clinical field leaves the shipped data, comments are stripped from deployed pages, and the medical word gate also runs over the app.

**M67. The buy page makes benefit claims with nothing behind them.**
It lists "Reduced resistance", "Behavioral change", "Improved presence" and "Healing and restoration". Health claims need real evidence, and testimonials never count.
- State: open. Severity: serious. Size: medium, 1 day. Block: N3.
- Ids: C71, Sam.
- Closes when: each is rewritten in wellness safe words or cut, and the lawyer reads it.

**M68. The policies do not name every company that touches data.**
Supabase, Discord and ElevenLabs (the voice company) are in no policy, yet first visit events go to Supabase, feedback to Discord, and release lines to ElevenLabs when voice is on. Nobody has read any company's terms for how fast they would tell us about a breach, or confirmed the written data agreements.
- State: open. Severity: serious. Size: medium, 1 day. Block: N3.
- Ids: C62, C64, C19 (part), gap M5, Priya, Sam.
- Closes when: all six companies are named with their notice period, and each agreement is confirmed or the company dropped. It must land before block 2's voice port turns voice on for anyone.

**M69. There is no breach plan.**
The federal rule (the FTC Health Breach Notification Rule) gives 60 days to tell people, with extra notices at 500 or more. There is no plan, template or named person, and no breach log for Europe.
- State: open. Severity: serious. Size: small, half a day. Block: N3.
- Ids: C61, C65 (part), B5 (part), Sam.
- Closes when: one plan, one template, a log and a named person exist.

**M70. Europe and the UK are open at launch with none of the 13 requirements done.**
The team default (round PD) opens sign up to the EU and UK from launch. `LEGAL-IA.md` section 9.1 lists 13 things that requires, none done, and recommends holding sign up there until items 1 to 9 are.
- State: partial. Severity: serious. Size: small, 2 hours for the hold. Block: N3.
- Ids: C65, Sam.
- Closes when: the hold below is taken, or the 9.1 list is done.

**M71. A person's rights are not buttons in the app.**
The server has export, delete and consent routes, and the app calls none of them. The policy promises two ways to ask, Settings and email, and neither works yet.
- State: partial. Severity: serious. Size: medium, 2 days. Block: 6.
- Ids: C58, C66 (part), B6 (part), B7 (part), Sam.
- Depends on: M25, M53.
- Closes when: Export, Delete and consent in Privacy call those routes with honest words.

**M72. The map of where data sits is missing the biggest store.**
The draft data map leaves out D1 (the Worker's own database, holding accounts and records), Supabase events, Discord and ElevenLabs. It says birth details stay on the device, which is false until M7 lands.
- State: partial. Severity: serious. Size: medium, 1 day. Block: 6.
- Ids: C63, B5, B6 (part), S12 (part), S27 (part), Sam.
- Closes when: one table is built from the code, not from the policy.

**M73. Keeping data for 24 months is accepted and not built.**
You accepted a 24 month default. Nothing deletes old data and no screen says so.
- State: open. Severity: serious. Size: medium, 2 days. Block: 6.
- Ids: S26.
- Closes when: old data is deleted on schedule and the delete screen states the rule.

**M74. The federal and California checks are not written down.**
The legal floor review already reasons through the FTC's ten question tool and California's thresholds. Neither is written down as answers and filed with the policies.
- State: partial. Severity: minor. Size: small, half a day. Block: N3.
- Ids: C54, C66 (part), Sam.
- Closes when: one page of answers is filed.

**M75. A clinician cannot check us from the site.**
The American Psychiatric Association's app checklist asks who makes it, what it costs, what is collected, whether it is deleted and when it was last updated. The answers exist only in drafts.
- State: partial. Severity: minor. Size: small, half a day. Block: N3.
- Ids: C76, Sam.
- Depends on: M64.
- Closes when: an "About this app" block in Help answers them once the policies are live.

**M76. Practitioner sharing has no consent yet.**
Nothing is shared today and the page says "nobody", so nothing is wrong now. When the practitioner view ships it needs its own yes, a list of who can see, and a way to take it back.
- State: open. Severity: minor for the MVP, if the practitioner stays out. Size: medium, 2 days when it ships. Block: Q.
- Ids: C57, Sam.
- Watch: block 2 ports the practitioner database change. Nothing may expose it until this is built.
- Closes when: built with the practitioner feature.

## Device and accessibility

**M77. The packed file blames a cut download for a missing browser feature.**
In a browser that cannot unpack the file, it says "This build did not finish arriving... The file itself is short", which is false: the file is whole. Priya marked this done and Dani measured the false sentence, so it counts as partial.
- State: partial. Severity: serious. Size: small, 2 hours to half a day. Block: 1.
- Ids: C91, C100 (part), Priya, Dani.
- Closes when: the loader checks for the feature first and says "this browser cannot open the packed copy, open the full one", with a `tests/boot.js` case.

**M78. "Forgot your password?" is 20 pixels tall.**
It is under the accessibility floor of 24 and the product's own 44.
- State: partial. Severity: minor. Size: small, 1 hour. Block: 2, with M3.
- Ids: C78, Dani.
- Closes when: padded to 44.

**M79. Pop ups cover the button a person is about to press.**
On a phone, the "Committed" message sits on top of Cancel and Run release for about 2.4 seconds. On desktop, the Field's tooltip covers the rows a keyboard user is moving through.
- State: partial. Severity: serious. Size: small, half a day. Block: N4.
- Ids: C81, Dani.
- Closes when: the message clears the release buttons and tooltips open away from focus.

**M80. Some things can only be done with a mouse.**
The Field and the Body drawing cannot be reached by keyboard, a node on the wheel and moving a zoomed Field need a pointer, and the account button shows no focus ring.
- State: partial. Severity: serious. Size: medium, 2.5 days. Block: N4.
- Ids: C86, C80, Dani.
- Closes when: every tab passes a keyboard walk with a gate, each wheel node has a key route, and a zoomed Field moves by arrow keys or buttons.

**M81. The pictures do not say the reading in words.**
The Field and Body have labels, but they describe the drawing, not the person's reading, and on a phone the panels that carry the reading are folded away.
- State: partial. Severity: serious. Size: medium, 1 day. Block: N4.
- Ids: C87, Dani.
- Closes when: each label carries the reading in one sentence, like "Heaviest at the Heart, 1.8".

**M82. Some text is too faint in every lighting.**
Contrast is how much text stands out from its background. A rough probe found 2 to 6 text runs below the floor in each of the 7 lightings, and rings and focus outlines were not measured.
- State: partial. Severity: serious. Size: medium, 1 day. Block: N4.
- Ids: C84, Dani.
- Closes when: a real contrast gate passes across all seven lightings.

**M83. No automatic or human accessibility pass has been run.**
No automatic checker (axe or Lighthouse) runs in the tests, and nobody has walked the circle with a screen reader (the tool blind people use to hear a page).
- State: open. Severity: serious. Size: medium, 1 to 2 days. Block: N4.
- Ids: C94, Dani.
- Closes when: axe runs on every tab in `tests/design.js`, and one VoiceOver walk of the circle is recorded.

**M84. Help cannot be reached in onboarding or during a release.**
Help lives in Account on every tab, but not inside the onboarding sheet or a full screen release that can run 28 minutes.
- State: partial. Severity: minor. Size: small, 2 hours. Block: N4.
- Ids: C82, Dani.
- Closes when: a help ring in the corner of both sheets opens the same Help.

**M85. Nobody has timed it on a real phone.**
On a slowed down copy of a phone the engine is ready in 3 to 6 seconds, but the Log in card waits behind the loading sheet until about 7 seconds on every device.
- State: partial. Severity: minor. Size: small, half a day. Block: N5.
- Ids: C90, Dani.
- Closes when: one mid range phone on 4G is timed to the first card on atuned.world.

**M86. Installable or not is undecided.**
An installable web app needs a small manifest file, a helper script and an offline page; without one, a visitor who loses signal sees the browser's own error page. Your call, default no.
- State: open. Severity: minor. Size: small, 1 hour to decide; 1 to 2 days if yes. Block: N4.
- Ids: C92, Dani.
- Closes when: you rule; if yes, the manifest, the helper and the offline page ship.

**M87. Ritual reminders are not designed.**
Push for ritual accountability is planned, and correctly nothing asks for it yet. It needs a design first: ask only after a ritual, with our own question before the browser's, a settings switch and an email route.
- State: open. Severity: minor, not an MVP gate. Size: large, 3 to 5 days. Block: Q.
- Ids: C93, Dani.
- Closes when: designed, then built that way.

## Cosmetic (last, by the owner's ruling)

Your own cosmetic list joins here, after these.

- **M88.** Offline page in the house look, only if installable is yes (C95, Dani). Open, minor. 2 hours. Block N4.
- **M89.** A "last updated" stamp in Help; the policy dates come with M64 (C96, Dani). Partial, minor. 1 hour. Block N3.
- **M90.** Every reminder useful and timely, once reminders exist (C97, Dani). Open, minor. Comes with M87. Block Q.
- **M91.** Icons that crop well on a phone and a short app name, only if installable is yes (C99, Dani). Open, minor. 1 hour. Block N4.
- **M92.** Tab tooltips say the action ("Open your story.") or repeat the label; one line from the UX seat settles it (retired file group 2). Open, minor. 2 hours. Block N4.
- **M93.** Create account shares the saved password field, so a password manager offers the old password; Suggest covers it (C79 note, Dani). Open, minor. 1 hour. Block N4.
- **M94.** Anatomy name corrections found in the retired file go through `BOOK-ERRATA.md` and you, not a port (retired file group 4). Open, minor. Half a day plus your read. Block N4.

## Your calls

Nothing here stops the team. Each has a default we take if you say nothing, recorded in `DECISIONS.md` as taken, yours to overrule.

1. **The public repository and the second GitHub Pages address (M49).** Today anyone can read the MOB repository, and GitHub builds a second copy of the site from main at an address that is not atuned.world. Options: turn Pages off (10 minutes, atuned.world is served by Cloudflare and loses nothing); make the repository private (stops outside reading, but the raw address you save builds from then needs you signed in to GitHub); or leave both. **Default: Pages off now, the repository stays public until you say, and the history is swept for keys.**
2. **The word "diagnostic" (M66).** `CLAUDE.md` line 3 reads "A somatic diagnostic instrument", and the app prints "From your diagnostic". The FDA judges by what the maker says. **Default: the word leaves everything the app prints and everything public; `CLAUDE.md` line 3 becomes "A somatic instrument"; the two labels become "From the questions you answered".**
3. **The modelling consent ruling (M63).** You ruled (`DECISIONS.md:1382`): "the story is stored, for recovery, never shared, and used only for modelling". The team default since (round PD, `DECISIONS.md:2715`): "Research sharing: off, not offered at launch." The policies say no model is trained. **Default: confirm "off, not offered at launch"; record the 1382 ruling as set aside for launch; remove the switch; keep the server's research path unreachable.**
4. **Your one sentence for the MVP (M29).** Who it is for and what they leave with. **Default if you say nothing: "For people who carry a charge in the body they cannot name: one story in, see where it sits, one short release done, and your avatar moves."**
5. **Europe and the UK at launch (M70).** Round PD opened them from launch, and none of the 13 requirements is done. **Default: hold Create account in the EU and UK until `LEGAL-IA.md` 9.1 items 1 to 9 are done. That narrows the PD default for launch, it does not reverse it.**
6. **Who is in the first group (M42).** **Default: the team proposes 10 to 30 people from levels 4 to 7 on the customer grid, the largest group and the one the first release loses, and you pick the names.**
7. **How long a sign in lasts (M16).** Today 90 days, with no idle limit. **Default: signed out after 7 days unused, and after 90 days in any case.**
8. **Whether the copy on the device is locked (C18, Priya).** On the device the record is plain text in browser storage; on the server it is sealed. **Default: not locked on the device, said plainly on the Privacy page, with the saved file named as the backup.**
9. **Who backs you up (M54, M6).** Round PD rules "a sealed offline second copy with one trusted person" for the record key, and an incident needs someone when you cannot be reached. **Default: until you name someone, the runbook says the service stays up and nothing is restored until you are back.**
10. **Installable or not (M86).** **Default: no. The saved file stays the offline route.**

Not decisions, but only you can do them:

- Paste for the Supabase re-run (in flight today).
- Lock main on GitHub once block 1's checks have run once (plan step 2).
- Attach Reboot-OS to the working session, if it is not already (plan step 3; blocks 4 to 6 need it).
- The Stripe steps when block 5 opens (plan step 4; we resend them then).
- Book a lawyer who knows Washington and Nevada law (M64).
- Walk the billing (M39) and the whole MVP on atuned.world (M58).

## Totals

Read off the list above.

| Section | Items | Blockers | Rough size, one engineer |
|---|---|---|---|
| Foundation | 27 | 8 | 41 to 53 days |
| Journey | 20 | 5 | 33 to 41 days, of which 10 to 14 are queued or not an MVP gate (M46, M47) |
| Operations | 11 | 0 | 7 to 10 days |
| Compliance and safety | 18 | 3 | 16 to 19 days of team time, plus the lawyer's own; 2 queued (M76) |
| Device and accessibility | 11 | 0 | 10 to 15 days, of which 3 to 5 are queued (M87) |
| Cosmetic | 7 | 0 | 1 to 2 days, plus your own list |
| **All** | **94** | **16** | **about 110 to 140 days; about 95 to 120 without the queued items** |

Why this is bigger than the game plan's figure. The plan put blocks 0 to 7 at 39 to 50 days. This list adds the checklist's new ground in five new blocks (sign in hardening, running the service, legal, the circle and the screens, the private launch), about 40 to 50 days, plus 15 to 21 days the plan queues on purpose. The sizes here are summed item by item, which runs higher than a block estimate, because some items will share a pull request.

The 16 blockers, in the order they get worked: M1, M59, M62, M3, M28, M6, M5, M7, M9, M20, M35, M36, M37, M25, M29, M64.
