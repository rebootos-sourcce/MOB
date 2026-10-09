# Review pass 2 of 5: the Worker and its API

Scope: audit section 4 Pass 6, blocks B12 to B15 (server half), all of section 9, queue items P0-02, P0-05 (server half), P0-08, P1-05, P2-09, P2-10, and the Worker evidence in section 8.
Read: Reboot-OS `main` = `12b2e48a` (merge of PR #11, 8 Oct 18:13 PT), file paths below are `atuned/server/...` unless marked MOB. MOB = `main` `b2b7a03e`. Nothing was committed or pushed. Worker tests were run in a scratch copy: 75 pass, 0 fail (unchanged code).
Live probes of the deployed Worker are NOT possible from this sandbox (the proxy returns 403 for workers.dev). So "live" claims rest on CI run logs. Newest Worker main run: `37868749420`, every step green, including "live public boundary smoke passed" (01:14:41Z, Worker version `45bbb8ff`).
To rerun: `git -C /home/user/reboot-os archive 12b2e48a | tar -x -C <dir>`, copy the `pass2-*.test.mjs` files into `<dir>/atuned/server/test/`, run `node --test test/*.test.mjs`; the browser probe is `NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node pass2-probe-cors.cjs <dir>/atuned/server`; the SQL files run against a scratch Postgres 16 with migrations 0001 to 0013 and stub roles `anon`, `authenticated`, `service_role`.
Probe files are in this folder: `pass2-cors.test.mjs`, `pass2-cors-patch.diff`, `pass2-probe-cors.cjs`, `pass2-delete-probe.test.mjs`, `pass2-googlekey-probe.test.mjs`, `pass2-servererr-probe.test.mjs`, `pass2-supabase-rpc-probe.sql`, `pass2-funnel-delete-account.sql`.

## 1. TOP FINDINGS

1. **CORS is a live P0 and the audit is right.** `index.js:509` sends `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`. The client sends `PATCH` (`MOB ui/auth.js:136`). Real Chromium against the real handler: create and read pass, the checkpoint fails with "Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response", and the PATCH never leaves the browser. One word added to line 509 fixes it. 3 of 4 new node tests fail first; 79 of 79 pass after.
2. **The CORS fix alone does not make the first visit work.** Two of the four checkpoint calls still fail. The client sends `firstReleaseId = "release_<uuid>"` and `verificationId = "ev_..."`; the Supabase columns are `uuid`. Run on Postgres 16 with MOB migrations 0001 to 0013: `ERROR: invalid input syntax for type uuid`. The live smoke writes only `selectedGroundId` (a text column), so it cannot see this.
3. **Account attach cannot succeed today.** Nothing issues a starter gift: the Worker never calls `funnel_save_starter_gift`, and the database has no trigger for it. Attach returns `gift_not_found` (HTTP 409) for every session. The first-visit pass also dies at 15 minutes (`funnel.js:101`). Both proven on Postgres. The smoke never calls attach.
4. **Delete is not end to end.** `DELETE /v1/me` makes zero calls to Stripe or Supabase (probe: outbound calls `[]`). The D1 cascade also deletes the `entitlements` row, the only link to the Stripe subscription, so Stripe must be cancelled FIRST. A second delete returns 401, not a clean repeat. A candidate Supabase function `funnel_delete_account` is proven on the real schema. No client code calls `DELETE /v1/me`.
5. **Google store route fails open (`index.js:383`), and it is worse than the audit says.** With `GOOGLE_PUSH_KEY` unset, 51 unauthenticated posts wrote 51 `store_events` rows, no limit. The Apple route stores a 5,000 character unsigned field. No plan forgery (the server re-reads the store), but unbounded writes, and `store_events` and `audit` are never pruned.
6. **The live smoke proves less than it looks.** It uses Node `fetch` (no CORS rule), its OPTIONS call sends no request-method header, it writes one text field, its health check cannot fail (health answers HTTP 200 even when `ok:false`), and it skips attach. A Playwright `page.route` stub also hides the bug (probe B: the preflight is answered by Playwright).
7. **Audit points that are stale or wrong:** the Supabase migrations ARE in the repo (MOB `atuned_funnel_system/sql/0001..0013`), apply cleanly, and the three RPC names and argument lists match the Worker. The live database is at least at 0012 (create works), so "stops at 0010" is wrong. Health does a real Supabase read, not only "configured". `/v1/admin/delete` is listed twice in section 9.
8. **New faults the audit and plan do not have:** every thrown 4xx is saved as a server error (30 bad requests, 30 rows); the forgot route reveals that an account exists when mail is down; one record is capped at 200 KB but the client sends the whole profile as one record; Stripe secrets are missing from the documented secret list; a push subscription may point at any https host.
9. **Constant time:** admin key and sign-in hash are constant time. The Google key uses `!==` and sits in the URL. All four Stripe prices are placeholders; the guard works (503 before any call to Stripe).
10. **Crash route can carry story text:** no server-side scrubbing (500, 4000, 80 character free text). No client on main sends to it today; M51 plans to wire the guard to it. Add redaction before that lands.

## 2. TABLE (one row per audit item in scope)

Priority key: P0 blocker, P1 highest, P2 moderate, P3 cosmetic. Sizes: tiny under 2 hours, small half a day, medium 1 to 2 days, large 3 days or more. "ALPHA" = existing features complete and bug free. "PUBLIC" = public launch only.

### 2a. Pass 6 and register blocks

| ID | Audit says | TRUE on main now (evidence) | Verdict | In plan already? | Action, size, priority, gate |
|---|---|---|---|---|---|
| PASS6-1 | Route code covers auth, health, funnel, sync, consent, billing, store, push, crash, admin | 34 route keys in `index.js:117-492`. Client callers on MOB main exist only for auth, `GET /v1/me`, billing checkout and portal, funnel create/attach/checkpoint, `GET`/`PUT /v1/sync`. No caller for delete, consent, export, push, version, health, crash, canon, purchase | CONFIRMED (audit right; the no-caller list is longer than the audit says) | M25, M23 (route contract), HANDOFF B7 | Fold the caller gaps into the contract file of M23. Medium. P1. ALPHA for delete and consent copy, PUBLIC otherwise |
| PASS6-2 | System map must show D1 and Supabase | D1 holds accounts, sessions, billing, sealed records (`index.js:57,405`). Supabase holds funnel rows only (`funnel.js:1-5`). Both are called from one Worker | CONFIRMED | GAME-PLAN block 6 ("D1 enters the architecture map") | Doc only. Tiny. P3. PUBLIC |
| PASS6-3 | Direct Node test can pass while the browser fails | Reproduced in real Chromium (see B13-2) | CONFIRMED | M20, HANDOFF B8 | See B13-2 |
| PASS6-4 | Health does not prove Stripe, Apple/Google secrets, mail, key, payment | Health also does a live Supabase read when configured (`index.js:292-298`, `supabase.js:40`). It still says nothing on Stripe, mail, `RECORDS_KEY`, store keys. It answers HTTP 200 when `ok:false` (probe: DB failing gave HTTP 200 `{"ok":false}`) | AUDIT STALE OR WRONG on "only configured"; right on the rest | M51 (alarms) only | Return 503 when not ok; add boolean-only readiness fields. Small. P2. PUBLIC |
| PASS6-5 | Stripe prices are placeholders; `priceFor()` guards; portal needs a customer | `wrangler.toml:25-28` all four are `REPLACE_WITH_STRIPE_PRICE_ID_FOR_TIER_*`; `STRIPE_TIER_FOUR_ENABLED="0"` (line 29). `stripe.js:38-41` reads `REPLACE*` as unset; checkout order is tier, tier four, key, price (`:47-52`); test `billing.test.mjs:154` proves nothing reaches Stripe. Deploy log of `37868749420` prints the placeholders as live vars | CONFIRMED | M39, GAME-PLAN block 5 | Owner steps only. P2. PUBLIC (paid tier) |
| PASS6-6 | Google key checked only if secret truthy; fail closed | `index.js:383`: `if(env.GOOGLE_PUSH_KEY && key!==env.GOOGLE_PUSH_KEY) return 403`. Probe: unset gives 200 and a row written | CONFIRMED | NO | See B13-3 |
| PASS6-7 | Supabase RPC level and service role not proven; run browser smoke | Files exist: MOB `atuned_funnel_system/sql/0001..0013`. All 13 apply with no error on Postgres 16 (stub `auth` schema). Live: create, read, save of a text field pass in CI (`37868749420`), so 0012 is live. 0013 (text user ids) is not provable from the smoke | AUDIT STALE OR WRONG (files exist) and partly CONFIRMED (live level of 0013 and attach unproven) | M21, M20 | See B12-2 |
| B12-1 | Supabase create/read/attach/checkpoint PARTIAL; preflight fails for PATCH | `funnel.js` uses 3 RPCs (`:96,:202,:214`) plus two table reads (`:41-62`). Create, read and checkpoint of `selectedGroundId` pass live. PATCH fails in a browser. Plus: uuid columns reject two ids, no gift, 15 minute pass (all proven below) | CONFIRMED (audit understates: four faults, not one) | HANDOFF B8, M20, GAME-PLAN block 4 | Block W1 then W3. Medium. P0. ALPHA |
| B12-2 | Migrations/runtime state UNVERIFIED; CI should fail if RPCs are absent | CI step 31-50 of `server.yml` already calls `GET $SUPABASE_URL/rest/v1/` with the key and throws the answer away (`/tmp/sb-check.json`). That document lists every RPC and column type. No step parses it | CONFIRMED | M21 (apply step), not the assertion | Add the OpenAPI assertion (block W5). Small. P0. ALPHA |
| B13-1 | One contract test per route; bounded errors; no partial writes | 75 tests in 8 files cover most routes (see 2c). Gaps: PATCH preflight, Google unset key, crash/`server_errors` prune, push cross-account, canon 402 path, admin read audit, delete cascade | CONFIRMED | M23 | Blocks W1 to W4 add the missing ones. Medium. P1. ALPHA for CORS, PUBLIC for rest |
| B13-2 | CORS allows only GET, POST, PUT, DELETE, OPTIONS; route and client use PATCH | See row `OPTIONS *` in 2c. Exact lines in section 5, block W1 | CONFIRMED, live P0 | M20, B8, GAME-PLAN block 4 (as "add PATCH") | Block W1. Tiny code, small with CI step. P0. ALPHA |
| B13-3 | Google key checked only if secret truthy | Same as PASS6-6. Also compared with `!==` (not constant time) and carried in the URL query | CONFIRMED | NO | Block W2. Tiny. P1. PUBLIC (Google Play not live) |
| B13-4 | `deleteAccount()` deletes only D1; no Supabase RPC, no Stripe cancel | `index.js:86-98`: one `env.DB.batch` of 9 statements, no `fetch`. Probe with an attached Stripe row: 0 outbound calls. Also: batch is atomic in D1; second `DELETE /v1/me` gives 401; second admin delete gives 404; `audit` rows naming the account stay (2 left in probe) | CONFIRMED | M25, HANDOFF B7, GAME-PLAN block 6 | Block W4. Large. P0. PUBLIC (ALPHA only if real money or real testers' records are at stake) |
| B14-1 | Server authority for tier; PASS at code boundary | Plan comes from `entitlements` only (`store.js:102-122`); client never sets it. 36 billing tests, 9 store tests. Stale and out-of-order events are safe by design (re-read, `stripe.js:182-189`, test `billing.test.mjs:328`) | CONFIRMED (audit right; PASS holds at code level) | M36, M37 | None beyond M36 gaps (refund, two tabs). PUBLIC |
| B14-2 | Paid Stripe config BLOCKED | Same as PASS6-5. Also `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are missing from the secrets list in `wrangler.toml:32` and `README.md:45-56` | CONFIRMED, OWNER-BLOCKED (Stripe prices, keys, portal switch, webhook secret) | M39, GAME-PLAN block 5 step 4 | Add the two names to the secret list. Tiny. P3. PUBLIC |
| B14-3 | Apple/Google live purchases UNVERIFIED | Code present (`store.js:41-91`), tested only with a faked store (`STORE_VERIFY` hook, and fake `FETCH` for the Apple/Google paths in `store.test.mjs:115,133`). Apple answer is not signature-checked, by documented choice (`store.js:36-40`). No `appAccountToken` binding: first account to present a valid transaction id owns it | CONFIRMED, OWNER-BLOCKED (store accounts and keys) | TASKS ("can wait", `HOSTING-SETUP.md`) | Add token binding before Apple goes live. Medium. P2. PUBLIC |
| B15-1 | Push: browser permission, persistence, unsubscribe, delivery need live smoke | `push.js` and `push.test.mjs:21` (one test: subscribe, send at local hour, once a day, drop dead, delete). `DELETE /v1/push` filters `account_id` (`index.js:364`) but no cross-account test. `PUT /v1/push` takes any `https://` host; the hourly job POSTs to it (`push.js:21`) | CONFIRMED | NO | Add host allowlist and cross-account test. Small. P2. PUBLIC |
| B15-2 | Crash and admin: rate limits, fail closed, constant time, no sensitive bodies in logs, redaction | Crash: limit 10 per 15 min per address (`index.js:305-307`, test `ops.test.mjs:27`). Admin: no key gives 403; lockout; constant time (`index.js:101-116`). No scrubbing of crash text (500, 4000, 80, 20 chars, `ops.js:13-16`). Admin reads are not audited (only plan and delete writes) | CONFIRMED (mostly right; two gaps the audit asks about are open: redaction, access audit) | M51 | Block W6. Small. P2. PUBLIC |
| B15-3 | Export/import completeness (server half) | `GET /v1/export` returns records, consent, entitlements, events (`ops.js:27-34`); no session tokens; test `ops.test.mjs:37`. It omits Supabase funnel rows and the shared research copy | CONFIRMED | HANDOFF "export, delete and consent routes, app calls none" (MVP-OPEN line 473) | Add funnel rows to export in block W4. Small. P2. PUBLIC |

### 2b. Queue items and section 8

| ID | Audit says | TRUE on main now | Verdict | In plan already? | Action, size, priority, gate |
|---|---|---|---|---|---|
| P0-02 | Fix CORS PATCH/checkpoint; browser reads back after reload | CORS part: confirmed, patch ready (`pass2-cors-patch.diff`). Reload readback: no client reads the session back (`authFunnelRead` has no caller); and two ids fail on the database | CONFIRMED | Block 4, M20, B8 | W1 now; W3 for the rest. P0. ALPHA |
| P0-05 (server half) | Delete cascade to Supabase, research, Stripe; no resurrection | Research copy IS deleted (`index.js:89`, test `api.test.mjs:120`). Supabase and Stripe are not. Stripe events after deletion are ignored (`stripe.js:241-249`) while Stripe keeps charging | CONFIRMED | M25, B7, block 6 (order: Stripe, Supabase, D1 last, pending row) | W4. Large. P0. PUBLIC |
| P0-08 | Prove real Supabase schema, RPC, keys | Done offline: 13 migrations apply; 3 RPC names and arguments match `funnel.js`. Live: key accepted (CI step 7 green), create/read/save live. Not proven live: 0013, attach, uuid ids | CONFIRMED (open), with new evidence | M21, M20 | W5 OpenAPI assertion. Small. P0. ALPHA |
| P1-05 | Google fail closed; re-read purchase state; duplicate safe | Re-read and duplicate safety already hold (`store.js:190-196`). Fail closed does not | CONFIRMED | NO | W2. Tiny. P1. PUBLIC |
| P2-09 | Production billing launch | Blocked on owner steps; code and 36 tests ready | OWNER-BLOCKED (Stripe account steps, M39) | M36, M37, M39, block 5 | After owner steps. P2. PUBLIC |
| P2-10 | Push/crash/admin live behaviors | See B15-1, B15-2. Retention prune is in code (`index.js:528`), no test | CONFIRMED | M51 | W6. Medium. P2. PUBLIC |
| S8-a | Reboot-OS tests: api, auth, billing, funnel, ops, push | Eight files, not six: also `store.test.mjs`, `supabase.test.mjs`. 75 tests, run here: 75 pass, 0 fail | CONFIRMED (audit understates) | n/a | none |
| S8-b | Workflow runs `node --test` and a live smoke | `server.yml:23` and `:78-138`. Run `37868749420` (main, head) and `37853093835` green, including the smoke. Failures before were the key kind and a smoke fired within one second of deploy (fixed by the 20 second wait, `:71-77`) | CONFIRMED | M50 (deploy order) | none |
| S8-c | No browser CORS proof exists | True of CI. Now exists as a one-off here: real Chromium, before and after | CONFIRMED | M20 | Make it a CI job (W5) |

### 2c. Section 9, every route row

"Test" names the test file and line. "Audit right?" is the verdict on the audit's status word.

| Route | What the code does (line) | Test that covers it | Audit status right? / action |
|---|---|---|---|
| `POST /v1/auth/signup` | Rate limit 10 per 15 min per address, counts every try (`index.js:118-137`); email shape; password 8 to 200; 409 on duplicate; PBKDF2 100k | `api.test:35`, `ops.test:69`, `auth.test:54` | PASS at code: right. The 409 tells a stranger an email has an account (code comment `:146`, "Q32" open). P3. PUBLIC |
| `POST /v1/auth/signin` | Always runs the hash, dummy salt if no account, constant time compare (`:138-156`); lock after 10 fails | `api.test:35`, `auth.test:14,:62` | Right. No change |
| `POST /v1/auth/forgot` | Same 200 for unknown email; but with mail unavailable an existing account gets 503 and an unknown one gets 200 (`:164-171`) | `auth.test:26,:40,:47` | PARTIAL right; wrong on one point: the audit wants "must not reveal existence", and under a mail outage it does. Send the mail check before the lookup. Small. P2. PUBLIC |
| `POST /v1/auth/reset` | One use, 1 hour, deletes all sessions, link points at the app (`:174-190`) | `auth.test:26` and PR #11 test | Right |
| `POST /v1/auth/signout` | Deletes this one session hash (`:191`) | `api.test:35` | Right; client side is pass 5 |
| `GET /v1/me` | Account, consent, record count, entitlement, billing (`:195`) | `api.test:35`, `billing.test:386` | Right |
| `POST /v1/funnel/session` | Limit 10 per 15 min per address (`:206-213`); random 64 hex credential; hash stored; pass expires in 15 minutes (`funnel.js:101`) | `funnel.test:146,:161` (mock Supabase) | PARTIAL right. Live create proven by CI. Risks: 15 minutes is shorter than a first visit; shared networks hit the limit and the client ignores a 429 |
| `GET /v1/funnel/session/:id` | Signed in: must own it (403 if not yet attached, even if you hold the credential). Anonymous: credential, unexpired, unused (`:214-220`, `funnel.js:106-120`) | `funnel.test:146,:220` | PARTIAL right. No client caller reads it back. Wrong credential 401 is tested |
| `POST /v1/funnel/session/:id/attach` | RPC `funnel_attach_session` (`funnel.js:212-228`) | `funnel.test:220` (mock sets a gift by hand: `e._sessions...starter_gift_id='gift_test'`) | Audit says PARTIAL; real state is BROKEN BY CONSTRUCTION: no gift is ever issued, so 409. Proven on Postgres: no gift gives `gift_not_found`; with a gift, `transferred`, then `invalid_credential` on repeat (single use works). Expired pass gives `invalid_credential`. P0 with W3. ALPHA |
| `PATCH .../checkpoint` | CAS save through `funnel_save_session`; fields `selectedGroundId`, `tutorialCompleted`, `firstReleaseId`, `verificationId` (`funnel.js:122-210`) | `funnel.test:172` (mock accepts any string) | Audit says FAIL from CORS: right, and understated. After CORS: two fields still fail on uuid columns. Pass expiry also applies. P0. ALPHA |
| `POST /v1/purchase` | Asks Apple/Google, derives plan (`:233-241`) | `store.test:34,:52,:62`, `ops.test:37` | UNVERIFIED live: right. OWNER-BLOCKED |
| `POST /v1/billing/checkout` | Order: tier, tier four closed, key, price, one-plan check, then Stripe (`stripe.js:46-100`) | `billing.test:85,:99,:154,:408-488` | BLOCKED: right |
| `POST /v1/billing/portal` | Needs customer id; says which store holds the plan (`stripe.js:116-141`) | `billing.test:164,:180,:193,:202,:488` | BLOCKED: right |
| `POST /v1/billing/webhook` | Signature with 300 second age limit (`stripe.js:154`), constant time (`:162-164`), re-reads the subscription, 5 event types (`index.js:257-288`) | `billing.test:110,:251-379` | PARTIAL: right. M37 says age is not checked; that is stale. Version still not pinned (no `Stripe-Version` header, `stripe.js:91,132,227`). Parser keeps only the last `v1=` value, so key rotation may reject good events: tiny, P3 |
| `POST /v1/crash` | Public; stores version, platform, message, stack, place (`ops.js:12-19`) | `ops.test:17` | PARTIAL: right. Free text is stored as sent; see B15-2 |
| `POST /v1/admin/plan` | Key, lockout, plan 0 to 4 or null, audit row (`:325-341`) | `ops.test:37,:69` | PARTIAL: right. Unknown id returns ok:true (tiny) |
| `POST /v1/admin/delete` (listed twice in the audit) | Same `deleteAccount` as `/v1/me` (`:342-349`) | `ops.test:37` | FAIL cascade: right. The duplicate row in section 9 should be removed |
| `POST /v1/store/apple` | Unsigned payload read, re-read from Apple, always 200 (`:371-379`) | `store.test:79` | PARTIAL: right. Also: no limit, writes `store_events` with attacker text of any length (probe: 5,000 chars) |
| `POST /v1/store/google` | Key check fails open (`:383`) | `store.test:79` (only with the secret set) | FAIL-OPEN: right. No test for the unset case; W2 adds it |
| `PUT /v1/push` | Upsert by endpoint, any https host (`:352-361`) | `push.test:21` | PARTIAL: right. Add host allowlist (P2) |
| `DELETE /v1/push` | Own rows only (`:362-367`) | `push.test:21` (own account only) | PARTIAL: right. Add cross-account test |
| `DELETE /v1/me` | `deleteAccount` (`:394`) | `api.test:109` (D1 and research only) | FAIL: right. No client caller |
| `PUT /v1/consent` | Upserts share flag, audit row (`:395-403`) | `api.test:109` | FAIL not wired: right. Nothing calls it from MOB main |
| `PUT /v1/sync` | Max 500 records, 200,000 characters each, needs `RECORDS_KEY`, one upsert per record (`:405-462`) | `api.test:52,:66,:78,:136,:152`, `ops.test:91` | FAIL on policy: pass 5. Server side holds. New: the whole profile is ONE record (`MOB ui/auth.js:207`), so a profile over 200 KB gets 413 forever and the client only retries (`auth.js:282`) |
| `GET /v1/sync` | Paged, 1000 rows, cursor, opens sealed bodies (`:463-477`) | `api.test:136,:152` | PARTIAL: right; paging IS tested |
| `GET /v1/health` | D1 table count plus a live Supabase read (`:290-299`) | `ops.test:17` | PASS "as health only": half right. HTTP 200 even when `ok:false`. Fix in W2 |
| `GET /v1/version` | From vars, cached 10 minutes (`:302`) | `ops.test:17` | PASS: right. No client caller (M23) |
| `GET /v1/export` | Whole account as JSON, no tokens (`:312-316`) | `ops.test:37` | PARTIAL: right; omits funnel rows |
| `GET /v1/admin/account`, `/crashes` | Key, lockout, counts only, never a body (`:319-324`) | `ops.test:37,:69` | PARTIAL: right. Reads are not audited. P2 |
| `GET /v1/push/key` | Public VAPID key (`:351`) | `push.test:21` | PASS: right |
| `GET /v1/canon`, `/:table` | Name checked by regex and manifest; tier gate coded but `CANON_TIER` is empty, so nothing is gated (`:23,:482-491`) | `api.test:127` (no 402 test) | PARTIAL: right. "Tier gate enforced" is not true today; it is unused |
| `OPTIONS *` / CORS | Returns 204 for any path with one fixed origin and a fixed method list (`:509-510`) | `api.test:27` only checks `GET` is listed | FAIL for PATCH: right. The old test is too weak; replace with `pass2-cors.test.mjs` |

## 3. NOT IN THE PLAN

Checked against `MVP-OPEN-ITEMS` (M1 to M94), `GAME-PLAN`, `HANDOFF-GAPS`, `DEV-STRATEGY`, repo `TASKS.md` and `DECISIONS.md`.

1. Google receiver fails open, and any unauthenticated post writes to `store_events` (also Apple). `store_events` and `audit` are never pruned (`index.js:528`). P1/P2. PUBLIC.
2. Every thrown 4xx is saved to `server_errors` (`index.js:519` runs before the status check). Probe: 30 bad funnel calls gave 30 rows, each with a 1,162 character stack. Unauthenticated, no limit on funnel read or patch. It also fills the support console with 401s. P2. PUBLIC.
3. Health answers HTTP 200 on failure. An outside monitor (M51) that reads the status code will never fire. P2.
4. Forgot route leaks account existence when mail is down or unconfigured. P2.
5. One-record whole-profile sync against a 200 KB record cap. Needs a size measurement on the heaviest fixture; if a heavy profile is over about 150 KB, raise to P1.
6. `funnel_events.user_id` is still `uuid` (migration 0013 changed six columns and skipped this one). Latent; nothing writes events yet. P3.
7. Push endpoint accepts any https host (the Worker will POST to it hourly). P2.
8. `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are not in the documented secret list. P3.
9. Crash route has no content scrubbing, and M51 plans to wire the guard to it. A browser error message can quote text (V8 JSON errors include a snippet of the input). Ruling "stories are not sent to us" needs a server and client redaction rule first. P2.
10. Admin reads are not audited; the audit asks for it. P2.
11. Test design: Playwright `page.route` or `context.route` answers CORS preflights itself, so any gate that stubs the Worker that way can never show a CORS fault. MOB stubs also copy the defect: `tests/functional.js:3460-3461` and `tests/reset.js:76-77` carry `GET, POST, PUT, DELETE, OPTIONS` and origin `*`, while production sends `https://atuned.world`. P1 test hygiene.
12. The smoke leaves one `ci-live-*` row in production Supabase on every deploy. (M50 says "the smoke cleans up after itself"; no cleanup exists yet.) P3.
13. `server.yml:67` exits green and skips migrate and deploy if `REPLACE_AFTER` is found in `wrangler.toml`. Harmless today. P3.
14. Apple purchases have no account binding token (B14-3). P2.

## 4. CONTRADICTIONS (audit versus main)

| Audit says | Main says |
|---|---|
| Pass 6: health "checks DB and whether Supabase is configured" | It also reads Supabase (`index.js:292-298`). It then returns HTTP 200 regardless |
| B12: migration chain "not proven from current public source" | Files are in MOB `atuned_funnel_system/sql`, 13 apply clean here. Live is at least 0012. HANDOFF B8 says live "stops at 0010": disproved by the green create in CI |
| B12 / section 9: attach is PARTIAL | Attach is blocked by construction (no gift) and by the 15 minute pass |
| B12 / section 9: checkpoint fails only on CORS | Two of four fields also fail on the database |
| Section 9 `crash`: "90-day retention verified" | Prune is in code (`index.js:528`); no test covers it |
| Section 9 `canon`: "tier gate server enforced" | Gate is coded, `CANON_TIER` is empty, no test for 402 |
| Section 9 `forgot`: "unknown email must not reveal existence" | Not true while mail is down |
| Section 9: `POST /v1/admin/delete` listed twice (lines 356 and 359) | One route (`index.js:342`) |
| Section 8: six server test files | Eight files, 75 tests (run here) |
| M37 (MVP-OPEN): webhook does not check age | It does, 300 seconds (`stripe.js:154`). Version pin is still missing |
| Section 9: `GET /v1/sync` "page through >1,000 rows" as to-do | Already tested (`api.test.mjs:136`) |

## 5. PROPOSED BLOCKS (order of work for the Worker)

Each block names the failing-first test. "Removal check" = take the patch out and see the test fail again. Block names W1 to W6 sit inside GAME-PLAN blocks 4, 5, 6.

### The exact CORS evidence (decisive probe 1)

Worker, `index.js:509` (unchanged since the Sep 27 base):
`'access-control-allow-headers':'authorization, content-type, x-funnel-credential', 'access-control-allow-methods':'GET, POST, PUT, DELETE, OPTIONS'`
Client, MOB `ui/auth.js:136` (via `authCall`, `:307-325`): `fetch(AUTH_API+'/v1/funnel/session/<id>/checkpoint', {method:'PATCH', headers:{'Content-Type':'application/json', 'x-funnel-credential':<cred>, Authorization:'Bearer <t>' when signed in}, credentials:'omit'})`. `AUTH_API` is the workers.dev address (`auth.js:38`), so it is cross origin from `https://atuned.world`.
A browser must preflight this: PATCH is not a safelisted method, and `x-funnel-credential` is not a safelisted header. Its request carries `Access-Control-Request-Method: PATCH` and `Access-Control-Request-Headers: content-type,x-funnel-credential` (plus `authorization` when signed in). The headers are allowed. The method is not. So a real preflight from `https://atuned.world` FAILS in every browser.
Real Chromium, real socket, ALLOWED_ORIGIN set to the page origin (`pass2-probe-cors.cjs`):
- Before: `create` 201 ok, `read` 200 ok, `check PATCH` -> `Failed to fetch`. API socket saw `OPTIONS .../checkpoint [preflight asks PATCH with content-type,x-funnel-credential]` and nothing after it. Console: `Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response.`
- After the patch: the same three calls all pass; socket shows `OPTIONS` then `PATCH`.
- Probe B, same page with `page.route` switched on: the PATCH "passes" even on the unpatched Worker, and no OPTIONS reaches the server. So interception hides the fault.
Minimal patch (`pass2-cors-patch.diff`, one word): `'GET, POST, PUT, DELETE, OPTIONS'` becomes `'GET, POST, PUT, PATCH, DELETE, OPTIONS'`. Optional beside it: `'access-control-max-age':'600'` to cut repeat preflights.
Failing-first test: `pass2-cors.test.mjs` (4 tests: PATCH preflight with and without `authorization`; every routed method is listed; a foreign origin is not echoed). Unpatched: 3 fail, 1 pass. Patched: 4 pass, full suite 79 of 79.

### W1. CORS hot fix (small, P0, blocks ALPHA)
- Entry: Reboot-OS main `12b2e48`.
- Work: the one word above; move `pass2-cors.test.mjs` into `test/`; add a server.yml step (below).
- Exit: 79 tests green; removal check fails 3; deploy green; CI step reports the browser predicate true; real Chromium probe passes against the deployed Worker from `https://atuned.world` (a person or a CI job, not `page.route`).
- Add to `server.yml` after the smoke create: send `OPTIONS` with `Origin: https://atuned.world`, `Access-Control-Request-Method: PATCH`, `Access-Control-Request-Headers: content-type,x-funnel-credential,authorization`; fail unless the allow-methods list holds `PATCH` and the allow-headers list holds all three names. Also keep it for POST, GET, DELETE, PUT.

### W2. Store routes and error hygiene (small, P1/P2, PUBLIC)
- Work: Google route returns 503 when `GOOGLE_PUSH_KEY` is unset, compares with a constant-time helper (reuse `constantTimeEqual` over SHA-256 of both); both store routes: cap body at 16 KB, cap `kind` and `ref` at 100 characters, per-address limit; prune `store_events` and `audit` after 24 months (retention already ruled); `server_errors` written only for non-status errors; health returns 503 when not ok.
- Failing-first: `pass2-googlekey-probe.test.mjs` (test 2 fails now), `pass2-servererr-probe.test.mjs` (assert 0 rows after 30 refusals), new health test (status 503 with DB down), new store_events cap test.
- Exit: all green; removal check fails each; no other test changes.

### W3. First-visit data path (medium, P0, blocks ALPHA). Needs Supabase migration 0015
- Faults, all proven on Postgres 16: (a) `firstReleaseId`/`verificationId` are not uuids; (b) no starter gift is issued; (c) pass lives 15 minutes (`funnel.js:101`; read filter `:55`; RPC `expires_at > p_now`).
- Decision for ids, default stated: change the two columns to `text` in 0015 (client ids `release_<uuid>` and `ev_...` stay what the rest of the app stores; the Worker already allows up to 200 characters). Cost: tiny migration, one cast removed in `funnel_save_session`. The plan's choice (client mints uuids) costs client and profile changes and breaks older records. Either works; do not do both.
- Gift: issue it in `funnel_create_session` or on first `selectedGroundId` checkpoint (100 items need the pattern list; the app side decides who owns that list: S4/S7 in the plan). Until then attach must say so honestly.
- Pass: extend with a sliding renewal on each successful checkpoint (new `expires_at`), ship together with "sign out clears the funnel session" as the plan says.
- Failing-first: a Postgres test script (`pass2-supabase-rpc-probe.sql` is the seed; steps 6, 7, 8 must flip from ERROR/`gift_not_found` to saved/`transferred`), plus a Worker test that uses the real RPC names against a Postgres-backed `FETCH` instead of the in-memory mock (the mock in `funnel.test.mjs:14-100` accepts `'release_test_1'`, which the real database refuses).
- Exit: the live smoke gains `tutorialCompleted`, `firstReleaseId`, `verificationId`, and an attach with a throwaway account; all green in CI.

### W4. Delete everywhere, server half (large, P0 for PUBLIC). After real Stripe (plan block 5)
- Order, as GAME-PLAN block 6 says: Stripe cancel, then Supabase, then D1 last, with a pending row. Evidence for the order: the D1 cascade deletes `entitlements` (`0003:6`), the only record of `stripe:sub_...`. Today Stripe events for a deleted account return `handled:false` (`stripe.js:241-249`) while the card is still billed.
- Work: `deleteAccount` reads the account's Stripe entitlement refs, cancels each (`DELETE /v1/subscriptions/{id}`; 404 `resource_missing` counts as done), calls RPC `funnel_delete_account(p_user_id text)` (candidate in `pass2-funnel-delete-account.sql`, proven on the real schema: removes sessions, gifts, items, progress, events, challenges, ledger, referrals for that user, leaves a bystander and anonymous sessions, second call is a clean no-op), then runs the existing D1 batch. Keep the session valid until the end (today `auth()` rejects a half-deleted account, so no retry is possible). Return `{deleted:true}` or 502 `{deleted:false, pending:['stripe'|'supabase']}`. Add `DELETE FROM entitlements` and `resets` to the batch so it does not depend on foreign key cascade (the test shim turns foreign keys on, `d1shim.js:4`; live D1 behaviour UNVERIFIED from here).
- Client must call: `DELETE /v1/me` with `Authorization: Bearer <token>`, no body; on `{deleted:true}` clear `source.session`, `funnel.session`, `source.profile.sync`, stop the sync timer, write the tombstone, then remove the local profile; on 502 show "Not deleted yet. Nothing was lost. Try again." and keep the session. (Client work is pass 5 scope.)
- Failing-first: `pass2-delete-probe.test.mjs` second test (fails now: asserts one Stripe `DELETE` and one `funnel_delete_account` call); add: provider failure leaves the account usable and retry succeeds; export includes funnel rows.
- Exit: `tests/delete.js` per plan against Stripe test mode, plus Postgres test for the RPC.

### W5. Live proof in CI (medium, P0 for the first two, ALPHA)
- (a) Parse the PostgREST document already fetched at `server.yml:45`: require `/rpc/funnel_create_session`, `/rpc/funnel_save_session`, `/rpc/funnel_attach_session`, `p_user_id` of type text on attach, and the two id columns' type. (Exact `jq` paths to be fixed on the first run; print the document once.) This is what B12-2 and P0-08 ask for.
- (b) Preflight predicate step from W1.
- (c) A cross-origin Chromium job: load `https://atuned.world`, run the real `authFunnelStart` then `authFunnelCheckpoint` from the deployed bundle, assert via `page.on('request')` that an `OPTIONS` and then a `PATCH` were sent; never `page.route` on the Worker origin. Cleanup of `ci-live-*` rows through a delete RPC keyed by anonymous id prefix.
- (d) Throwaway account smoke: signup, attach, sync, `DELETE /v1/me`, sign in refused. It doubles as the delete proof.
- Exit: step (a) fails on a deploy where the RPC is missing (removal check: run against a project without 0012).

### W6. Hardening (medium, P2, PUBLIC)
- Crash: allowlist fields, strip quoted text and digits runs, cap message at 200; test that a story-like body is not stored verbatim. Do this before M51 wires the guard.
- Push: allow only known push hosts; cross-account delete test.
- Forgot: do the mail check before the account lookup.
- Admin reads: audit row.
- Funnel read and patch: rate limit per address.
- Stripe: pin `Stripe-Version`; take every `v1=` value in the signature header.
- Secret list: add the two Stripe names; add a deploy check that fails when a required secret is absent (M24).
- Sync record size: measure; split the profile into several records or raise the cap with a test.

## 6. Defaults taken (no owner questions)

- Release and verification id shape: columns become text (above). Overrule to switch to client uuids. OWNER-BLOCKED only if he wants the funnel package's uuid release ids to stay the source of truth.
- Delete order and the pending row: as GAME-PLAN block 6 already rules.
- Stripe-dependent parts (W4 Stripe step, P2-09): OWNER-BLOCKED on Stripe prices, secret key, webhook secret and the portal switch (M39).
- Apple and Google store keys: OWNER-BLOCKED, deferred by `HOSTING-SETUP.md`.
- Records retention for `store_events`/`audit`: 24 months, the accepted default (S26).

## 7. What I could not prove

- Anything on the deployed Worker beyond CI logs (no outbound access to workers.dev from here).
- Whether migration 0013 is applied live, and whether live D1 enforces foreign keys the way the test shim does.
- The exact format of `verificationId` values (used `ev_1` from HANDOFF-GAPS B8; any non-uuid fails the same way).
- Size of a heavy real profile against the 200 KB cap.
