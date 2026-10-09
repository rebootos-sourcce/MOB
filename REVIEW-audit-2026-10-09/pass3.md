# Review pass 3 of 5: privacy, profile sync, deletion, consent, identity (client side)

Read-only. Base: MOB main `b2b7a03` (confirmed with `git ls-remote`), Worker main `12b2e48` (read by sha, the local `origin/main` ref there is stale at `ee73363`). Built in a private copy, Chromium 1194, Playwright 1.56.1, every Worker request answered by a stub through `page.route`. Probe scripts and printed logs are in `pass3-evidence/` beside this file. Counts below are read off those runs.

## 1. TOP FINDINGS

1. **The audit's headline is wrong on main: profile sync does not run.** Signed in, with a name, birth details and a story in the profile, 50.5 s in Chromium: one Worker request, `GET /v1/me`, no body. `profileSyncEligible` needs a global `profiles` (auth.js:186-190) that is defined nowhere in the source or the built page. Name, birth and stories do not leave. The repo already says so (tests/copy.js:26, M7, HANDOFF-GAPS B12, DECISIONS "Profile sync, 9 October", TASKS PB1).
2. **It is one line from live, and woken it is worse than the audit says.** With `profiles` defined: the first poll (1.2 s) saves metadata and pushes nothing (audit right). From 31.2 s, every 30 s, the whole profile (name, birth, story text, 2.6 KB) goes to `PUT /v1/sync` even when nothing changed, because `pExport()` re-stamps `updated` (schema.js:281) so the change hash never repeats. The audit's "next poll marks clean" is wrong.
3. **Every shipped sentence about what stays on the device is true today** (14 checked, section 4). But no gate proves it after sign in: tests/copy.js never signs in, and nothing fails if `profiles` gets defined. The real P0-03 work is a guard, not a rewrite.
4. **Three real defects in existing features.** (a) ui/keep.js goes silent for signed-in people on purpose, and tests/storage.js:395-411 holds that, but it assumes a server copy that does not exist (Run 4). (b) Profile delete leaves `atuned-ritual-more`; import twice then delete once leaves 2 copies; both say "deleted" (Run 5). (c) The committed `source.html`, `engine.js` and `atuned-packed.html` (stamp `869610b`, 8 Oct) still print "Nothing you write leaves this device" and "There is no store yet"; the raw GitHub URL serves them.
5. **No account delete exists in the client, and none is safe to add yet.** Worker `deleteAccount` is D1 only (index.js:86-97). Planned as M25 and Block 6. Local delete is honest about the gap (account.js:505-508).
6. **Consent is unwired but not needed today.** `state` is not a research kind (index.js:22); research is off by team default (M63 awaits the owner); withdrawing deletes nothing already shared (index.js:395-402).
7. **No P0 here for ALPHA.** P0 appears the day someone defines `profiles`, so the guard (A1, A2) is P1 and goes first.
8. **Owner decision D1.** Three rulings disagree on whether story text goes to the server (DECISIONS.md:140, :1382, :2700) against the shipped "Your stories are not sent to us". GAME-PLAN Block 3 syncs story text. Default: stays on the device.

## 2. PROBE RECORD (facts, printed)

Profile: name "Zephyrine Quillfeather", who.first/middle/last, birth 1984-03-02 04:15 Reykjavik, story containing "Marrowgate", a second story added at t=35 s. `pExport()` top keys: v,id,name,created,updated,soul,axes,who,ui,seed,meter,plan,avatar,purpose,laws,intake,work,gates,story,rituals,history,practice,trace,summaries. `who`: first,middle,last,sex,sealed,born{date,time,place,zone,timeUnknown}. A profile with a name and one story exports at about 3.4 KB (3,359 to 3,393 chars, pretty printed).

**Run 1, main as built (`out-shipped.txt`), 50.5 s:**
```
t(s)  method path     | bytes | name f/m/l | born d/t/p | story text/marker
  0.9 GET /v1/me      |     0 | ----       | ---        | --        (the only Worker request)
non-Worker network: []   page errors: []   PROFILE_SYNC_TIMER set at boot, eligible=false at every sample
source.profile.sync = null at every sample.   direct authProfileSync() at 50.5 s -> {"state":"skip"}
```
Repeated on a clean rebuilt copy (`out-shipped2.txt`): identical, one request. **Run 1b, signing in through `authEnter`, the function the Log in card calls (`out-signin.txt`):** `POST /v1/auth/signin` (64 bytes, keys email,password), `GET /v1/me`, then nothing for 45 s; the timer starts, every tick skips.
**Run 2, COUNTERFACTUAL, `window.profiles` defined, 75.7 s (`out-counter.txt`):**
```
  1.0 GET /v1/me                 |    0
  1.2 GET /v1/sync               |    0        boot call: meta {version:0, hash} saved, NO push, server holds nothing
 31.2 GET /v1/sync + PUT /v1/sync| 2615 | YYYY | YYY | YY   nothing changed since boot, pushed anyway (v1)
 61.2 GET /v1/sync + PUT /v1/sync| 2795 | YYYY | YYY | YY   after the second story (v2)
 75.7 PUT /v1/sync (by hand)     | 2795 | YYYY | YYY | YY   nothing changed since 61.2, pushed again (v3)
```
**Run 3, logic (`out-logic.txt`, `out-logic2.txt`):** two `pExport()` calls 5 ms apart differ only in `.updated`. Three calls with nothing changed: `pushed v1, pushed v2, pushed v3`, three PUTs of 2,286 bytes, never `clean`. A local delete then a call: pushed v5 with a blank profile over the account copy. With `profiles` undefined, calling `profileSyncImport` throws `ReferenceError: profiles is not defined` after `pImport` already added a second profile with the same id (PROFILES 1 to 2, same id twice). Record size (456-char stories, one snapshot each, compact JSON, Worker cap 200,000 per body, index.js:29): 100 stories 113,587; 150 stories 169,287; 200 stories 224,987 over the cap. The cap is reached near 175 stories; the client then sees a non-ok PUT, returns `{state:'retry'}` and says nothing.

**Run 4, UI (`out-ui.txt`):** K signed OUT after one saved story: KEEP line set, marker `source.profiles.saved` written, text "kept only in this browser" on screen. K signed IN, same save: line null, marker null, `n:0`, text absent (`keepSignedIn()` returns early, keep.js:56,76,93,118). D: confirm text `Delete You from this browser? The identity, the 63 answers, the stories, the imprints and every snapshot go. It cannot be undone and there is no copy unless you made one.`; Worker requests during delete: none; afterwards `source.session` still held, `funnel.session` still held, a blank "You" profile created; status `You is deleted from this browser, the only place it was held. You is open.` S: sign out sends one `POST /v1/auth/signout`, removes `source.session`, leaves `funnel.session`, the local record, no sync meta.
**Run 5, side stores (`out-side.txt`):** `pExport()` carries none of the three side keys. After `accProfDelete`, `atuned-avatar-side` and `atuned-ritual-active` are cleared, `atuned-ritual-more` still holds the deleted profile's entry (account.js:346-355 names two keys). Import the same export twice: 3 profiles, 3 with one id; one delete leaves 2 copies, status "deleted".

**Gates run on the rebuilt main:** `node tests/reset.js` 39 passed, 0 failed. `node tests/copy.js` 149 passed, 0 failed. The same copy gate on the committed `source.html`: 117 passed, 52 failed. Not run by me: functional, storage, recordlink, funnel (read, not run).

## 3. CLIENT CALLERS OF EACH WORKER ROUTE (section 9), grepped in ui/*.js and funnel/*

Client calls the network from one seam, `authCall` (auth.js:307), 17 call sites: 16 to the Worker and 1 to the Pages function `/feedback` (auth.js:379). Nothing in `funnel/*` calls the Worker (quiz says "makes no request", funnel/quiz.html:556, held by tests/funnel.js).

| Route | Client caller | State |
|---|---|---|
| POST /v1/auth/signup, /signin | auth.js:428 `authEnter` from account.js:718, login.js:309 | wired |
| POST /v1/auth/forgot, /reset | auth.js:468, :529 from login.js:321, :219 | wired, tests/reset.js |
| POST /v1/auth/signout | auth.js:548 from account.js:873 | wired |
| GET /v1/me | auth.js:573 `authCheck` (login.js:329), :759 `authPlanRead` | wired; reads account and billing, ignores `consent`, `records`, `entitlement` |
| POST /v1/funnel/session | auth.js:116 from onboard.js:608 | wired |
| PATCH .../checkpoint | auth.js:136 from onboard.js:1633,1690, release.js:1146,1333 | wired |
| POST .../attach | auth.js:148 from `authHold` (auth.js:442), result ignored | wired, best effort |
| GET /v1/funnel/session/:id | auth.js:130 `authFunnelRead` | **no caller** |
| GET, PUT /v1/sync | auth.js:194, :207 inside `authProfileSync` | **unreachable** (needs `profiles`) |
| POST /v1/billing/checkout, /portal | auth.js:617, :663 from ui.js:1653 | wired |
| POST /v1/voice/synthesize | auth.js:643 from sound.js:857 (opt in, default off) | wired |
| **PUT /v1/consent** | none | **no caller** |
| **DELETE /v1/me** | none | **no caller** |
| **GET /v1/export** | none | **no caller** |
| PUT, DELETE /v1/push, GET /v1/push/key, POST /v1/crash, GET /v1/version, /canon, /health, POST /v1/purchase, /store/*, /admin/* | none | no caller (admin is the Worker's own console page) |

## 4. SHIPPED SENTENCES ABOUT WHERE DATA GOES, checked against the probe

All TRUE on main today because sync is off. Column "if sync wakes" says whether the sentence would then be false.

| Sentence (short) | Where | True now? | If sync wakes |
|---|---|---|---|
| "Your stories and readings stay on this device. Signing in does not copy them anywhere." | account.js:127 (signed in) | yes, Run 1 | FALSE |
| "Your email and password go to our server, and what your first visit sent joins the account. Your stories and readings stay on this device." | account.js:141-143 (signed out); the audit's "different footer" | yes (attach is real, auth.js:148) | FALSE |
| "Held in this browser. Delete cannot be undone and there is no copy unless you made one." | account.js:254 | yes | FALSE |
| Confirm "Delete X from this browser? ... no copy unless you made one" and status "...the only place it was held" | account.js:359, :371 | yes (Run 4, D); grammar bug "You is deleted" | FALSE |
| "Held in this browser. Your stories are not sent to us, and the name you enter never leaves this device." | account.js:442, panels.js:1138 | yes | FALSE (stories), name needs the DTO |
| "A first visit sends our server a random code ... topic ... a mark when you finish ... A sign in sends your email and password and joins those marks to your account." | account.js:451-456 | yes, held by copy.js SENDS | TRUE but incomplete |
| "Delete removes this record from this browser now ... Our server has no copy of it ... Our server does keep your sign in ... and what your first visit sent. Delete does not reach those." | account.js:505-508 | yes, and honest about the gap | FALSE (first clause) |
| "Your story and your name stay on this device. Our server gets a random code ..., the topic you pick next, and which steps you finish." | onboard.js:979 | yes | FALSE |
| "Your answers stay on your record, in this browser. Nothing is sent." | valuefelt.js:43 | yes | FALSE |
| "Your record is kept only in this browser, and the browser may clear it." | keep.js:53 | **wrongly hidden when signed in** | n/a |
| "typing does not leave this device" (dictation) | storyui.js:113 | yes | still true |
| Login card (Log in, Create account, Guest) | login.js:136-138; rendered text read | no privacy claim on it | n/a |
| funnel FAQ "It stays in this browser ... It does not sync, and nobody at Atüned can read it" | funnel/faq.html:345-346 | yes | FALSE |
| funnel about "Your stories are not sent to us, and an account is yours to make or skip" | funnel/about.html:332-333 | yes | FALSE |
| quiz "Nothing you answer leaves this browser. This page makes no request of any kind." | funnel/quiz.html:556, :1173, :1213 | yes (no fetch in funnel/*) | still true |
| Auth.js header "It does not sync" (code comment) and login.js "Nothing here syncs" | auth.js:16, login.js:42 | yes | comment must move with the code |
| Quiz record link `#r=`: the record carries the generic name "Web reading", scores and answers, no story | funnel/quiz.html:498,1268,1280; app takes and removes the fragment at load, panels.js:1054-1060, and says if it could not (:1096) | yes by source; the fragment is never sent by the browser; tests/recordlink.js holds the route (not run by me) | still true |
| Old words "Nothing you write leaves this device", "There is no store yet", "nowhere else" | committed source.html, engine.js, atuned-packed.html at `869610b` | **FALSE, still shipped in the committed files** | n/a |
| Public privacy policy draft: stories ARE copied at account creation, "Delete account" control exists, birth never sent | funnel/legal/privacy.html sections 3, 4, 8 | contradicts the app; page carries a "do not go live" banner, is not deployed (deploy.yml:551-557 copies five pages) and no funnel page links to it | n/a |

## 4b. WHAT `pExport()` CARRIES, AND WHAT AN ALLOW LIST MUST DROP (question 5)

Keys read off the Run 1 export. "Drop" means not in the sync body in any design that keeps "the name never leaves". Counterfactual Run 2 sent every row below.

| Key | What it holds | Class | Allow list |
|---|---|---|---|
| `v`, `id`, `created` | schema version, random profile id, date | plain | keep |
| `updated` | stamped "now" on every export (schema.js:281) | breaks change detection | keep out of any hash |
| `name` | profile name; people type their own name | identity | **drop** |
| `who.first`, `who.middle`, `who.last`, `who.sex`, `who.sealed` | legal name parts, sex at birth, seal stamp | identity | **drop** |
| `who.born.date`, `.time`, `.place`, `.zone`, `.timeUnknown` | birth moment | identity | **drop** |
| `story.entries[].text` | the story in the person's words | free text | **drop** unless D1 says otherwise; keep `t`, `imprints`, `bands` only |
| `avatar` (name, title, description, pairs), `purpose` (soul, ego, sides) | words about who the person is becoming | free text | **drop** |
| `practice`, `rituals`, `trace`, `summaries` | goals and logs, ritual names, claims, frozen day sentences (daily.js:204-218 refuses a day sentence that holds the person's own name tokens, so the code already treats names as able to reach these) | free text | **drop** until each is reviewed |
| `plan` | tier, status, period | server owned | **drop**; a synced plan would let a record grant itself a tier |
| `soul`, `axes`, `laws`, `gates`, `meter`, `work`, `intake` (answers, done), `seed`, `history[]` snapshots, `ui` | numbers, choices, preferences | numeric | keep (default D2) |
| three side keys (`atuned-avatar-side`, `atuned-ritual-active`, `atuned-ritual-more`) | per profile, outside the record, saved reasons up to 240 chars | free text | not in the record; decide with D2 |

## 4c. LOCAL PROFILE DELETE VERSUS ACCOUNT DELETE (question 3)

| Thing | Local delete (`accProfDelete`, account.js:356; Run 4 and 5) | Account delete (Worker `DELETE /v1/me`, index.js:394; no client caller) |
|---|---|---|
| The profile in `source.profiles` | removed; a blank "You" is made if it was the last | not touched |
| Side stores | avatar and ritual-active entries removed; `atuned-ritual-more` stays | not touched |
| A second copy with the same id (import twice) | stays | n/a |
| `source.session` (sign in) | stays | the token stops working; the client learns at the next boot check (401, auth.js:588) |
| `funnel.session` (first visit credential) | stays | not touched |
| D1: account, sessions, consent, records, research copy, push, crashes | stay | removed in one batch; entitlements and resets by foreign key; an `audit` row keeps the account id |
| Supabase funnel row (topic, marks, gift, `user_id`) | stays | stays |
| Stripe subscription and customer | stay | stay, so billing continues |
| Tombstone against a stale tab or device | none | none |
| Words | account.js:359, :371, :505-508, honest about the gap | none in the app |

## 5. AUDIT ITEM TABLE

| ID | What the audit says (short) | What is TRUE on main now (evidence) | Verdict | In the plan already? | Action, size, priority, blocks |
|---|---|---|---|---|---|
| E3 | Privacy words contradict the implemented profile sync; `auth.js` sends `pExport()` to `/v1/sync` every 30 s; consent has no caller | Sync is dead. Run 1: 1 request in 50.5 s, `GET /v1/me`. `profiles` undefined (auth.js:189; built file has 3 mentions, no definition). Timer runs, every tick returns skip. Sentences all true (section 4) | AUDIT STALE OR WRONG for now; CONFIRMED as latent | M7, M62, HANDOFF-GAPS B12, DECISIONS "Profile sync, 9 October", copy.js:26, PB1 | Guard A1 + gate A2 below, S, P1. Does not block ALPHA; protects it |
| E4 | Account deletion is not end to end | Client: no `DELETE /v1/me` caller (section 3). Local delete sends nothing (Run 4, D). Worker `deleteAccount` D1 only, no Supabase, no Stripe (index.js:86-97); its test checks D1 tables only (api.test.mjs) | CONFIRMED | M25, B7, GAME-PLAN Block 6 (`tests/delete.js` not written) | Block B. Client half S-M, Worker half L. P1. Blocks PUBLIC, not ALPHA (no account delete exists; local delete is honest) |
| P5.1 | `profileSyncStart()` runs now and every 30 s, sends whole profile as `state` via `PUT /v1/sync` | Called from `authHold` (auth.js:456) and `authCheck` (:586); timer 30000 ms (:293); first call, then each tick, returns skip. Woken: first PUT at 31.2 s, then every 30 s, nothing changed, 2.6 KB (Run 2) | AUDIT STALE OR WRONG (now); CONFIRMED (if woken) | M7 | A1, A2. P1 |
| P5.2 | `pExport()` carries name and birth details; no sanitizer | Shape confirmed (section 2). No sanitizer: `local` goes to `profileSyncPush` unchanged (auth.js:280). Woken PUT body had full name, middle, last, birth date, time, place, story text | CONFIRMED (latent) | B6, GAME-PLAN Block 3 "Identity stays home" | DTO in Block C, M. P1 before any sync, PUBLIC |
| P5.3 | Account/login text says stories stay local; different footer says first visit joins account; profile delete says only held locally; contradicts sync | Section 4: all true now. The "different footer" is the signed-out one, true because attach is real. Login card makes no privacy claim | AUDIT STALE OR WRONG | M62 (partly done by PR 35), tests/copy.js | A5: make the gate read signed-in surfaces. S, P1 |
| P5.3b | (new, not in audit) committed build files carry the false words | `source.html`, `engine.js`, `atuned-packed.html` stamped `v1867 869610b 2026-10-08 21:14` (commit c6a730c), before PRs 35 to 38; contain "Nothing you write leaves this device", "There is no store yet", "nowhere else"; raw URL for `atuned-packed.html` returns 200; repo public, `has_pages:true`; the repo's own copy gate fails 52 checks on the committed `source.html` (section 2, gates). CI deploy rebuilds first (deploy.yml:517) so atuned.world itself is likely fresh, UNVERIFIED (proxy blocks atuned.world) | CONFIRMED NEW | CLAUDE.md notes the packed file is stale; M49 (public repo). Not the words | A0: restamp or stop committing; CI gate runs copy.js on the committed files. S, P1. Blocks ALPHA if the owner is handed the committed file (CLAUDE.md handover rule) |
| P5.4 | `PUT /v1/consent` exists, no client caller; name-never-leaves must be reconciled with sync | No caller (grep). `state` is not in RESEARCH_KINDS (index.js:22), so consent would not copy a profile sync. Withdrawing deletes no earlier research rows (index.js:395-402). Research off and not offered (DECISIONS 9 Oct) | CONFIRMED; OWNER-BLOCKED (M63: team default is research off and not offered; the owner has not confirmed) | M63, M65, M71 | None in A. Consent screen in Block C, M, P2. PUBLIC only |
| P5.5 | First account/no remote record sets metadata with no push; next unchanged poll can mark clean | First half TRUE: auth.js:254 saves `{version:0,hash}`, returns `associated`; Run 2 boot made `GET /v1/me`, `GET /v1/sync`, no PUT. Second half WRONG: `pExport()` re-stamps `updated` (schema.js:281), hash differs every call, so the next poll PUSHES (v1, v2, v3 with nothing changed, Run 3); `clean` is unreachable | CONFIRMED (first half); AUDIT WRONG (second half) | HANDOFF-GAPS B12 states the double timestamp; M7 | Failing test in `tests/sync.js` (Block C). P1 before sync |
| P5.5b | Whole profile replace may overwrite another device; merge by entry needed | Code pushes `local` whole and pulls whole via `pImport` (auth.js:218-226); `local.updated` is always "now" so `ru>lu` never fires: no pull after first association; devices overwrite each other every 30 s. A local delete then pushes a blank profile over the account copy (Run 3) | CONFIRMED (latent) | GAME-PLAN Block 3 (one record per story), DECISIONS:232 open | Block C, D4. L |
| P5.6 | Local delete is not account delete; no `DELETE /v1/me` call; helper skips Supabase and Stripe | All confirmed. Run 4, D: no request, session and funnel session stay. Honest words at account.js:505-508 | CONFIRMED | M25, B7 | Block B. Keep the honest sentence until then |
| P5.7 | Avatar ratings and ritual plans live in side stores outside the exported profile | Three keys: `atuned-avatar-side` (avatarui.js:148), `atuned-ritual-active` (ritual.js:210), `atuned-ritual-more` (ritcal.js:60). None in `pExport()`. Delete clears the first two only (account.js:346-355); the third keeps the deleted profile's saved suggestions and reasons | CONFIRMED, third key NEW | PLAN.md K "P20 side stores, forget" (partly built: `accForget` names two keys) | A3: one key registry plus "no key holds the id" assertion. S, P1. Blocks ALPHA (delete says everything goes) |
| P5.8 | Handshake: sign out clears session association; no data resurrected by next sync | Sign out: session removed, timer stopped, `funnel.session` stays, local record stays (Run 4, S; functional.js:3679-3682). Resurrection by sync cannot happen today; woken it would (P5.5b) | CONFIRMED (in part) | S14, B10 | Decide in Block C (D7). P3 now |
| B10a | Signup/signin/reset/signout PASS at code and test scope | Wired (section 3). `node tests/reset.js` on this build: 39 passed, 0 failed (token off the address before the first request, one request per press, no token in storage or status, 44 px targets at 390 and 1600, forgot says one sentence for both cases). functional.js:3470-3682 covers sign in, out, stale 401, offline sign out. Gaps: forgot 503 only for a known account when mail is unset (Worker auth.test.mjs:29,40: oracle); sign up needs no email check (M13); client floor 8 (auth.js:54) vs plan floor 15 (M11); `funnel.session` survives sign out | CONFIRMED with caveats | M13, M11, M16, M17, S14 | Worker: mail check before lookup, S, P2, PUBLIC. Rest as planned |
| B10b | Guest route and public entry work | Login card carries Log in, Create account, Guest (login.js:135-137); `?dev=1` skip; sign in is not required (pages booted without a session in every probe). Live site UNVERIFIED | CONFIRMED in source; live UNVERIFIED | none needed | none |
| B10c | (asked: identity and reset flows against tests/reset.js) | reset.js is a real gate and passes. It does NOT cover: the 503 for a known account when mail is unset (its stub always answers 200 to forgot); the side effects of the sign in a reset triggers (`authHold` runs attach and plan read, auth.js:442-457); a reset link opened while a different account's session is held; or the set of routes hit (a stray `/v1/sync` would get the stub's 404 and pass). The Worker's mailed link is `APP_URL/atuned.html?reset=` (index.js:168) and the client reads `?reset=` and `#reset=` from any path, so they match | CONFIRMED, gaps are small | M3 built; M17 | Add the forgot 503 case and an allow list of routes to reset.js. XS, P2 |
| B11a | Sync caller and periodic execution PARTIAL; first remote-absent path needs a failing test | See P5.1, P5.5. Failing test exists as the counterfactual run | CONFIRMED (latent) | M7 | Block C |
| B11b | Payload identity minimization FAIL / P0 | Latent only (P5.2). Not a live P0 | AUDIT STALE OR WRONG on severity | B6 | P1 guard first |
| B11c | Privacy statements and server consent FAIL / P0 | Statements true now; consent unwired by design (P5.4) | AUDIT STALE OR WRONG | M62, M63 | A5 |
| B11d | Local delete vs account delete FAIL / P0 | See E4, P5.6 | CONFIRMED, severity P1 | M25 | Block B |
| B13d | D1 deletion cascade misses Supabase and Stripe (Worker half, noted for completeness) | index.js:86-97 D1 only; `audit` row keeps the account id after delete (api.test.mjs "the deletion is on the record, the data is not"); funnel rows keep `user_id` (funnel.js:74) | CONFIRMED | M25 | Block B Worker half |
| B15a | Export/import completeness PARTIAL | `pExport` omits the three side keys (Run 5). `pImport` of the same record twice makes duplicates with one id (3 profiles, 1 id); one delete leaves 2 and says deleted | CONFIRMED | M8 (duplicates); side stores PLAN.md K P20 | A3 fixes both. S-M, P1. Blocks ALPHA |
| B15b | `GET /v1/export` account export | No caller. With sync off the account holds no records, so it would export entitlements and events only. Policy draft promises it, marked not built | CONFIRMED | M71, Block 6 | Block B/C, S, P2, PUBLIC |
| S9-sync | `PUT /v1/sync` FAIL on policy, first sync, conflict; `GET /v1/sync` PARTIAL | See P5.1 to P5.5b. Worker side: `kind:'state'` accepted, one body capped at 200,000 chars (index.js:29); reached near 175 stories (Run 3); client says nothing on 413 | CONFIRMED (latent); NEW detail: silent cap | GAME-PLAN Block 3 knows the cap; PB2 (silent refused pull) | Block C: per-entry records |
| S9-me | `GET /v1/me` PARTIAL; consent and billing match | Client reads account and billing, ignores `consent` (auth.js:573-585) | CONFIRMED | M71 | with consent screen |
| S9-signout | `POST /v1/auth/signout` PARTIAL: stops timer, invalidates session, reload does not sign back in | Does all three (Run 4, S; storage key empty; functional.js:3680). Leaves `funnel.session` | CONFIRMED | S14 | P3 |
| G17 to G20 | Golden steps 17 to 20: profile survives reload; attach single use; sync obeys identity and consent; deletion removes local and server | 17: local persistence reports failure (SAVE_ERR) and is gated (functional.js:1088-1103). 18: attach ignores its result (auth.js:456); others' scope. 19, 20: not built | CONFIRMED (19 and 20 are not built) | B12, M7, M25 | Blocks B, C |
| P0-03 | Resolve sync policy and false copy; consent call tested | Policy: team default "name never leaves" (DECISIONS 9 Oct) stands; story policy OWNER-BLOCKED (D1). Copy: true now | OWNER-BLOCKED (D1) for the story half; ALREADY FIXED for copy (PR 35, tests/copy.js) | M62, M63, M7 | A-block now; C later |
| P5-req | Owner policy needed: local only or synced; identity local only; plain consent for research; storage, retention and delete boundaries stated accurately | Storage and delete boundaries are stated accurately (section 4). Retention is stated nowhere in the app or the funnel pages (grep: no "months", "retention", "how long"); the server keeps sign in and first visit marks with no period given. The 24 month dormant rule (DECISIONS round PD) is only in the unpublished draft | CONFIRMED (retention missing); policy half OWNER-BLOCKED (D1, D3) | DECISIONS "Retention after delete is 24 months"; GAME-PLAN Block 6 says the delete screen says it | One retention sentence with Block B. XS, P2, PUBLIC |
| P0-04 | Fix first remote-absent sync and conflict | Latent, dead code. First-sync claim half right | CONFIRMED (latent) | M7, B12 | Block C; no value in fixing dead code first |
| P0-05 | Account delete client to server, full cascade | Not built; honest local delete stands | CONFIRMED | M25, Block 6 | Block B |
| §8.1 | "A privacy payload proof showing name and birth never cross the network" does not exist | Run 1 is that proof for main today, but not a gate | CONFIRMED (no gate) | M62 "copy.js fails ... while sync is reachable" (not implemented) | A2 turns Run 1 into `tests/sends.js` |
| §12.3, §12.4 | Resolve policy, wire account delete | As P0-03, P0-05 | see above | | |
| N1 | (new) keep.js hides the "only copy" warning when signed in | Run 4, K: signed out the line shows and the marker is written; signed in neither. It is deliberate: keep.js:45-46 "A signed in person's server copy is Block 3", and tests/storage.js:34, :395-411 assert "not asked, not shown, not marked". No server copy exists, so a signed-in person's browser is still the only copy | CONFIRMED NEW (an unproven assumption written into a gate) | M9 (built in PR 36) does not cover it | A4: P1, XS. Blocks ALPHA (existing feature, wrong for signed-in people) |
| N2 | (new) Delete status grammar "You is deleted ... You is open" | Run 4, D (the blank profile is named "You") | CONFIRMED NEW | no | P3, XS, voice gate |
| N3 | (new) Worker `forgot` answers 503 only for a real account when mail is unset | index.js:158-170; test asserts it (auth.test.mjs:40) | CONFIRMED NEW | M13 covers signup only | P2, S, PUBLIC |
| N4 | (new) Public privacy draft contradicts the app and is unpublished | Section 4 last row; no page links to it | CONFIRMED NEW | M64 (drafts, 85 markers), M72 | P2 for PUBLIC; add DRAFT-banner gate |

## 6. NOT IN THE PLAN, CONTRADICTIONS

**Not in any plan document:** N1 (keep.js signed in), the third side key and import-twice-delete-once (P5.7, B15a), committed build products carrying the old words (P5.3b), no gate that signs in and watches the wire (M62's "closes when" asks for copy.js to fail "while sync is reachable"; the banned phrase half is built in copy.js BANNED, the reachability half is not, because copy.js never signs in), N2, N3, N4's specific contradiction, "withdrawing consent keeps what was already shared" (policy section 12 admits it; no UI says it).

**Contradictions:**
- Audit E3/P5.1: sync is live. Main: dead (Run 1).
- Audit P5.5: "next unchanged poll marks clean". Main: never clean, pushes every tick (Run 3).
- Audit P5.3: copy says local while sync exists. Main: no sync, copy true.
- GAME-PLAN Block 3 and DECISIONS:2700 sync story text (`story:<id>` records); shipped words, the owner's brief and DECISIONS 9 Oct say stories are not sent. Both cannot ship.
- `funnel/legal/privacy.html` section 3 says birth details never leave and section 4 says stories do; GAME-PLAN says the same. App says neither leaves.
- CLAUDE.md "the record fetch at sign in will be the second [boundary caller]" assumes a server record the product no longer plans to hold without a ruling.
- Worker `RESEARCH_KINDS` (imprint, release, reading) vs the plan "kind:'state'": consent has no effect on a profile record, which is right, and should be said.

## 7. PROPOSED BLOCKS

Order: A now (nothing server side, nothing switched on), B as already planned (Block 6), C only after the owner answers D1.

### Block A: make every sentence true, keep it true, make the existing delete honest. Client only. About 3 to 4 days.
- Entry: none to wait for. Touches ui/auth.js, ui/keep.js, ui/account.js, ui/panels.js (import), tests/, CI. No Worker change, no new route, nothing switched on. Order A1, A2, A4, A3, A5, A0, A6.
- **A0. Committed artifacts.** Restamp `source.html`, `engine.js`, `atuned-packed.html` at HEAD or stop committing them; CI step runs `copy.js` on the committed files. Failing first, run: `ATUNED_FILE=<committed source.html> node tests/copy.js` gives 117 passed, 52 failed ("Held in this browser and nowhere else", "no store", "Nothing you write leaves this device", "Improve The Models", "Nothing has left this device"); the same gate on a fresh build gives 149 passed, 0 failed (`out-copy-committed.txt`, `out-copy-gate.txt`). S, P1.
- **A1. An off switch that is a switch.** `var PROFILE_SYNC_ON=false` checked first in `profileSyncEligible`, `profileSyncStart` a no-op, the accidental `typeof profiles` test removed. Failing first (known bad case): init script defines `window.profiles`; assert zero `/v1/sync` requests and no body holding the name or story. Today it sends (Run 2). S, P1.
- **A2. `tests/sends.js`, a signed-in wire gate.** Sign in through `authEnter` on a stub, name and story profile, `page.clock.fastForward(35000)`, assert every request is in an allow list `[method, path, body keys]` (signin/signup `email,password`; attach `credential`; me; signout; billing; voice `text,style`) and no body or Referer carries a name, birth or story marker. Add the A1 mutation as a second case. Prototype run (`out-clock.txt`): `page.clock.fastForward(65000)` takes about 6 s real time; main as built sends no `/v1/sync`; the known bad case sends `GET` and `PUT` (2,484 bytes, name and story inside). S, P1.
- **A3. Delete is complete or says it is not.** One registry of per-profile keys (avatar, ritual active, ritual more) used by `accForget`; after `accProfDelete` assert no localStorage value contains the deleted id; `pImport` replaces or refuses a record whose id is held (M8) and says which; delete then leaves no copy. Failing first: Run 5. S-M, P1, blocks ALPHA.
- **A4. keep.js ignores sign in** until a server copy exists: `keepSignedIn()` stops silencing the warning and the marker. Failing first: invert the signed-in case in `tests/storage.js:395-411` (it asserts the opposite today, so it goes red on the fix and green only on the new rule); Run 4, K is the manual proof. XS, P1, blocks ALPHA.
- **A5. Copy gate reads signed-in surfaces.** Second pass in `tests/copy.js` with a held session; REQUIRED for the sign-in footer; each negative claim ("not sent", "does not copy") listed beside the A2 case that proves it. S, P1.
- **A6. Words.** "You is deleted" fixed; sign out says the record stays on this device. XS, P3.
- Exit: A0 to A5 green, `tests/sends.js` mutation red, voice gate clean, one screenshot pair of the Account Privacy section signed in and out at 1600 and 390.
- Not in A, on purpose: wiring `DELETE /v1/me`. A button on the half cascade cancels nothing at Stripe and leaves Supabase; the honest sentence (account.js:505-508) is better until Block B.

### Block B: account delete everywhere (M25, GAME-PLAN Block 6). Worker L, client S-M. P1, PUBLIC.
- Entry: Stripe real (Block 5), staging (M4). Order Stripe, then Supabase, then D1, pending row until all three succeed, tombstone, two step confirm (type the word, or password again; a stolen token must not delete), result states done or pending retry, then clear `source.session`, `funnel.session`, sync meta.
- Failing first: `tests/delete.js` and a Worker test: account with a test subscription and a funnel session; delete; assert the subscription is cancelled, the Supabase row gone, D1 gone, sign in again shows nothing, a stale tab cannot bring it back. Exit: both green against test mode.

### Block C: designed, consented sync (M7, M63, M65). L, 6 to 8 days plus the owner's answers. Not before A and the owner's D1.
- Entry: A1 and A2 merged, M5 backup, M6 key copy, `tests/sync.js` written failing. Failing first: Run 2 and Run 3 as cases (idle profile must reach `clean`; a second device edit must add, not replace; name, birth and the answers to D1 absent from the body; a body over the cap must say so). Exit: two browsers each write an entry and both survive; a local delete leaves a tombstone; sign out then sign in as another account never auto associates; consent read back from `/v1/me`.
- Needed fixes inside it: hash excludes `updated`; server version only, never the device clock; one record per entry with a stable entry id (entries have only a timestamp today); `profileSyncImport` must not add a duplicate id; a visible sync state and a status line on every refusal (PB2).

**OWNER DECISIONS (each with default and cost). All OWNER-BLOCKED, none stops Block A.**
- **D1. Does any story text ever sit on our server?** Default: no. Account holds sign in, plan, first visit marks. Sync, if built, carries numbers and choices only. Cost: no recovery of a cleared browser beyond the saved file and the keep warning. Other ways: (i) opt in backup encrypted on the device with a passphrase we never see, "not sent to us" stays literally true, 2 to 3 weeks, a lost passphrase is lost data; (ii) sealed copy we can read (DECISIONS:1382, :2700, GAME-PLAN), the words change to "we keep an encrypted copy of your stories", needs the lawyer (M64), consent and age box (M65), 6 to 8 days.
- **D2. Allow list.** Default: axes, laws, gates, meter, history snapshots, intake answers, seed, soul, ui. Never: `name`, all of `who`, `story.entries[].text`, `avatar`, `purpose`, `practice`, `rituals`, `trace`, `summaries` (free text), `plan` (server owned; a synced plan would be a self grant). Cost: a restored record has readings and no words.
- **D3. Research sharing.** Default stays off and not offered. Cost: none now. If ever: its own screen, its own record kinds, withdrawal that deletes.
- **D4. Merge rule.** Default: per entry id, newest server version wins per field, never whole replace. Cost: schema addition (entry id), 2 days.
- **D5. Shared browser.** Default: a local record is never uploaded to a different account automatically; sign in as someone else asks keep apart, upload, or delete. Cost: one sheet.
- **D6. Sign up consent.** Default: separate unticked box for health data and an 18 box, policy version stored (M65). Cost: 1 day, lawyer wording.
- **D7. Sign out and the local record.** Default: record stays on the device, sync state cleared. Cost: none.
