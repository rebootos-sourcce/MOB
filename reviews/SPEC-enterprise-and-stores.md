# The Developer End, The Two Stores, And What Enterprise Actually Means

Ruled by the owner, 19 September 2026: "Login and password. That goes up to the
database, right? Unlocks their software. I'm not sure what that needs to do on
our developer end. We need the developer end of the software spec'd out. I don't
think that you've added that to the queue. Do we need two factor auth? For this
product to be enterprise, go grab a checklist of everything that's enterprise
app based, so we can pass submissions to the Apple Store and to the Google
Store."

This is research and a specification. No product code was written and nothing
outside this file was edited.

**Sizes are build effort for one developer.** S is under a day. M is up to a
week. L is more than a week. Where a thing is months rather than weeks it says
months in words, because L stops being useful at that scale.

**Two honesty notes before anything else.**

I am not a lawyer and I am not a security auditor. Section 9 splits this file
into what a researcher can settle and what needs one of those two.

The network proxy in this session blocked every Google owned domain, plus
`developers.cloudflare.com`, `pages.nist.gov`, `cheatsheetseries.owasp.org`,
`docs.stripe.com` and `www.hhs.gov`. Apple's guidelines I read directly. Google
Play policy, NIST and OWASP I reached through search result summaries and
secondary sources. The URLs given are the correct primary locations and the
substance matched across independent secondary sources, but any wording I
attribute to a Play policy page should be read in the Play Console Help page
itself before a submission is built on it. Same rule as `LEGAL-floor.md`.

**What this file does not redo.** `reviews/technology.md` already decided the
stack, the seam, the cryptography, the record store, the mail provider, the
payment shape and the cost. `reviews/LEGAL-floor.md` already covers the FDA
wellness line, the FTC claims exposure, Washington My Health My Data, the FTC
Health Breach Notification Rule, GDPR Article 9, terms, the age floor and the
subscription disclosure. `DECISIONS.md` rules the key, the no sale promise, the
tier ladder and the practitioner scope. This file adds the four things none of
them carry: an account with a password in it, the server side as a system, the
two store submissions, and the enterprise checklist.

**One conflict to name at the top, because everything else hangs on it.**
`reviews/technology.md` decided, in writing, "no users table, no password, no
session, no cookie, no bearer token." The owner has now ruled login and
password. The ruling governs. Section 1 is the smallest change to the decided
architecture that carries a password without breaking the promise in
`DECISIONS.md` that we cannot read anybody's record.

---

## 1. His First Question. Does Login And Password Go Up To The Database And Unlock The Software

Short answer. Yes to the first half, with one correction, and a hard no to the
second half as stated. The password goes up, but not the password. And the
server can unlock the record, or the tier, but it cannot unlock the software,
because the software is one file sitting on the person's device.

### 1.1 What Actually Goes Up

Not the password. Never the password. The client turns the password into two
different values and sends only one of them.

    MK        = PBKDF2-SHA-256(password, salt = HKDF(email), 600,000 iterations)
    authKey   = HKDF-SHA-256(MK, info "atuned/auth/v1")
    wrapKey   = HKDF-SHA-256(MK, info "atuned/wrap/v1")

`authKey` goes up. `wrapKey` never leaves the device. The server stores a slow
hash of `authKey` and a random per account salt, so a stolen database yields
neither the password nor the wrap key.

Every primitive in that block is native. The Web Crypto API in the browser and
in a Cloudflare Worker both carry PBKDF2, HKDF, HMAC and AES-GCM, so the client
stays one file with no dependencies and the Worker needs no library either.

- Workers implements Web Crypto including PBKDF2 `deriveBits` with HMAC-SHA-256: https://developers.cloudflare.com/workers/runtime-apis/web-crypto/ and a worked 600,000 iteration example: https://lord.technology/2024/02/21/hashing-passwords-on-cloudflare-workers.html
- 600,000 iterations of PBKDF2-HMAC-SHA-256 is OWASP's current number, and Argon2id at 19 MiB, t=2, p=1 is its first choice where a library is available: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html and the source of that page: https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Password_Storage_Cheat_Sheet.md
- A pepper is held outside the database and cannot be rotated without a reset, which is why it is a Worker secret and not a column: same OWASP page.

**Argon2id or PBKDF2 on our side.** PBKDF2 at 600,000 is the shipping answer
because it is in the runtime already. Argon2id is better and reaches a Worker
only as a WebAssembly module, which is a server side dependency and therefore
allowed, since the one file rule is a rule about the client. Decide it once,
record which one the `kdf` column names, and the upgrade path is the OWASP one:
rehash at next successful sign in. *S to ship PBKDF2. M to add Argon2id later
without a migration, because the column already says which.*

### 1.2 What The Password Unlocks, And What It Cannot

Three different things get called unlocking and only two of them are real.

**It unlocks the record, on a device that has never seen the key.** This is the
part that earns the password. `DECISIONS.md` gives every person a key and says
the record is never readable by us. `reviews/technology.md` made that concrete:
128 random bits, held by the person, and if they lose it the record is gone by
construction. That is honest and it is also the single worst moment in the
product, because a person who reinstalls and cannot find a card of base32
characters has lost their reading. A password fixes it without softening the
promise. One new row holds the person's key sealed under `wrapKey`:

    wrap    aid TEXT PK, rid TEXT, wrapped BLOB     AES-256-GCM under wrapKey

We hold ciphertext of a key we cannot derive, because `wrapKey` never arrives.
A password change re seals the same key and the record is untouched. The printed
key card stays, and its job changes from "your only way in" to "your recovery
code if you forget the password". That is a better product and a stronger
privacy position at the same time. *M.*

**It unlocks the tier.** The plan row is already decided: tier, status, granted,
base, since, until. Sign in returns it. Nothing about that needs a password, a
one time code would do, but a session makes it cheap to re read. *S on top of
the session work.*

**It cannot unlock the software, and this is the finding he should hear.**
`source.html` is one file with no network. Every pattern, every axis, every
renderer is already on the device before anybody signs in. A tier gate in that
file is a comparison against a number in local storage, and a number in local
storage is editable by anybody who opens developer tools. So the meter is
advisory. It shapes what an honest person can do and it does not stop a
determined one.

Three ways out, and it is his call:

1. **Accept it.** The gate is advisory, the product does not pretend otherwise,
   and the loss is confined to people who would not have paid. This is what
   every downloadable one file tool has always done. *Nothing to build.*
2. **Move the minting, not the app.** Unique ground costs a pattern, and
   `DECISIONS.md` says a rerun costs nothing. So the paid act is opening new
   ground. If the release lines for newly opened ground are minted by the Worker
   against the plan row, the paywall becomes real and the app still renders
   everything it already renders offline. This is the only design where the
   money is actually defended, and it puts content generation behind the seam,
   which is a real change to the one file posture. *Months, and it needs a
   ruling first because it moves the product's centre of gravity.*
3. **Obfuscate.** No. It costs build time, breaks the gates, and delays a
   determined person by an evening.

My recommendation is 1 now and 2 named as the decision it is, not slid into.

### 1.3 What A Session Is, Concretely

`reviews/technology.md` refused a session on purpose. A password login needs
one, because asking for a password on every screen is not a product. The
narrowest session that carries the ruling:

| Property | Decision |
|---|---|
| Shape | 256 random bits, opaque, never a self describing token |
| At rest | only SHA-256 of the token, in D1, so a database read cannot mint a session |
| Transport | `HttpOnly; Secure; SameSite=Lax` cookie, same origin as the app, so no token sits in local storage |
| Life, a person | 30 days sliding, re issued on use, absolute cap 90 days |
| Life, a practitioner | 12 hours idle, 24 hours absolute |
| Life, an admin or developer view | 8 hours, and behind Cloudflare Access as well |
| Revocation | a row delete, and a visible device list with sign out everywhere |
| Rotation | new token on sign in, on password change, on second factor enrolment |

Same origin matters. The app is served by Cloudflare Pages on the same hostname
as `/v1/*`, which `reviews/technology.md` already chose to avoid CORS. That
choice is what makes a cookie possible, which is what keeps the credential out
of local storage.

NIST's current revision sets the password rules this implies: at least 8
characters and 15 recommended where a password stands alone, a blocklist of
known breached and trivial values, no composition rules, no forced periodic
rotation, throttling on failed attempts, and salted hashing with a key
derivation function.

- NIST SP 800-63B, revision 4, finalised 2025: https://pages.nist.gov/800-63-4/sp800-63b.html and the series landing page: https://pages.nist.gov/800-63-4/
- The password rules restated, with the no rotation and no composition points: https://netwrix.com/en/resources/blog/nist-password-guidelines/ and https://specopssoft.com/blog/nist-800-63b/

*The whole of 1.3 is M, and it is the single largest piece of new server work.*

---

## 2. His Second Question. Does This Product Need Two Factor Auth

Yes. Not for everybody, not on day one for everybody, and not as a hedge. Here
is the real answer with the reasoning, and the reasoning is about what the data
is rather than about what is fashionable.

**What is at stake if one account is taken.** Somatic and psychological self
report. Stories about shame, rage and despair in the person's own words, a body
map of where charge sits, a coherence score, and, once the practitioner feature
lands, a named human being attached to all of it. `LEGAL-floor.md` section 6
shows what the FTC does to companies that leak exactly this category, and
`DECISIONS.md` calls the no sale promise the thing the product is built on. An
account takeover is the fastest way to break that promise without selling
anything.

**Three rulings already in the repo push the same way.** `TASKS.md` B says an
email alone as the key means anything that knows an address can retrieve a
person's profile, and calls the one time code not optional. `DECISIONS.md` says
records are never looked up by name and the key is not held beside the name.
`reviews/technology.md` built sign in out of two facts, the mailbox and the key,
and said neither alone is anything. Two factors is not a new idea being imported
here. It is the position the product already took, and a password without a
second factor would be a step down from it.

**So the answer by account class.**

| Account | Second factor | Why |
|---|---|---|
| A person, free or paid | Offered, prompted once, not forced | Forcing it on a wellness product costs sign ups, and the loss is one person's own record. Their sealed key already means a stolen password without the wrap key yields ciphertext. |
| A person who has granted a practitioner sight | Required | The grant makes the account a door into a relationship, and revocation is only meaningful if the account cannot be taken. |
| A practitioner or cohort lead | Required, no opt out | One credential reaches a roster of other people's readings. This is the account an attacker wants. |
| Admin or developer view | Required, plus Cloudflare Access on top | It reaches the corpus and every plan row. |
| Our Apple and Google developer accounts | Already mandatory, imposed by the stores | Apple requires two factor on any Apple Account used with the Developer Program, and Play Console requires 2 Step Verification. Not optional and not ours to decide. |

- Apple's requirement: https://developer.apple.com/support/account/authentication and https://developer.apple.com/help/account/access/sign-in-to-your-developer-account
- Play Console 2 Step Verification: https://support.google.com/googleplay/android-developer/answer/2543765 and the announcement: https://android-developers.googleblog.com/2021/06/play-dev-id-requirements-2-step.html

**Which second factors, and one to refuse.** TOTP as the default, because it is
RFC 6238, it is six digits from an app the person already has, and it needs no
vendor. Passkeys, meaning WebAuthn, as the better option to add next, for the
reason `reviews/technology.md` already gave: good as a second factor, useless as
the thing that decrypts a record. Ten single use recovery codes, hashed, printed
once. Not SMS. NIST's revision 4 treats SMS as the weakest of the set and a
current reading of it says it no longer carries AAL2 on its own, which is the
level a product holding health self report should be aiming at.

- RFC 6238, TOTP: https://www.rfc-editor.org/info/rfc6238
- AAL2 needs either a multi factor authenticator or two single factor ones, and the SMS position under revision 4: https://pages.nist.gov/800-63-4/sp800-63b.html and https://bellatorcyber.com/blog/nist-password-manager-recommendation-official/

**The thing worth noticing.** With the design in section 1 a person signing in
on a new device already presents two factors: the password, which is knowledge,
and the mailbox code, which is possession. Keep the mailbox code on any sign in
from an unrecognised device and the ordinary account is at two factors without
anybody enrolling in anything. TOTP then exists for the accounts in the table
that need it always. *TOTP plus recovery codes is M. Device recognition on top of
the existing code verb is S. Passkeys are M and can wait.*

**No store requires two factor inside the app.** I looked. Neither Apple's
guidelines nor Play's policies impose it on an app's own accounts. It is
required of us as developers, and it is required of us by the data, not by a
reviewer.

---

## 3. The Developer End, Specced

Everything here extends what `reviews/technology.md` already decided rather than
replacing it: Cloudflare Workers with D1, Wrangler, no framework, no ORM, one
origin, Resend then Amazon SES for mail, Stripe Checkout by REST with no SDK,
first party counters only. What follows is the part that document deliberately
did not build, because at the time there was no account.

### 3.1 The Services, And Why They Are Separate

Four Workers. The separation is not tidiness, it is the mechanism that holds the
promise, exactly as `reviews/technology.md` used an absent binding to keep the
corpus away from the records.

    api        the person facing seam. bound to DB one. the only Worker the app talks to
    corpus     stories with no rid. bound to DB two only. no handle to the records exists
    admin      the developer view. bound to DB one read mostly and DB two. behind Cloudflare Access
    jobs       cron. retention sweeps, plan reconciliation, code expiry, counter rollups

`admin` is a separate Worker on a separate hostname and it never ships inside
`source.html`. `DECISIONS.md` leaves open whether the developer view is its own
build or a tab stripped at build time. This answers it from the server side: the
admin surface needs a binding the app must never have, so it is its own
artifact, which also settles it the safe way round. *The four Worker split is S
as scaffolding. What goes in them is the rest of this section.*

### 3.2 The Tables

DB one, bound to `api`, and to `admin` under a policy. New tables are marked new.

    account   aid PK, rk, kdf, kdf_params, salt, verifier, created, status      new
    wrap      aid PK, rid, wrapped, alg, updated                               new
    session   sid_hash PK, aid, created, last_seen, expires, device_label      new
    mfa       aid, kind, secret_sealed, confirmed_at, PK (aid, kind)           new
    recovery  aid, code_hash, used_at                                          new
    grant     gid PK, owner_aid, pro_aid, scope, created, revoked_at           new
    audit     seq PK, at, actor_aid, action, target, outcome                   new
    record    rid PK, v, alg, iv, ct, at                                       decided
    mail      rk PK, rid, at                                                   decided
    code      rk PK, ch, exp, tries                                            decided
    plan      rid PK, tier, status, granted, base, since, until                decided
    seen      evt PK, at                                                       decided
    ev        day, name, n                                                     decided

DB two, bound to `corpus` only, unchanged: `corpus sid PK, text, at`.

**What the new tables still must never hold.** An email address in plaintext, a
name, a password, a plaintext record, a customer id, an IP address at rest, a
story beside a rid. `audit` records the actor as an `aid` and the action as a
verb, never a body and never an address. That keeps `reviews/technology.md`'s T4
intact and it is also what makes the audit log safe to keep for years.

### 3.3 The API Surface

The seam stays one module in the client, `ui/net.js`, one origin, and every call
fires from a press. The verb list grows because an account, a subscription and a
deletion obligation cannot be served by four verbs. Each line says what the
client sends and what it gets back.

    POST   /v1/code          {e}                      always 204. a code to the mailbox
    POST   /v1/account       {e,c,authKey,rid,wrapped} create. atomic or nothing
    POST   /v1/session       {e,authKey,c?}           sets the cookie. returns plan, wrapped, rec
    POST   /v1/session/mfa   {otp}                    second step when mfa is enrolled
    DELETE /v1/session       -                        this session. or {all:true}
    GET    /v1/me            -                        plan, mfa state, devices, grants
    GET    /v1/record        -                        the sealed envelope. 304 on etag
    PUT    /v1/record        {rec}                    sealed by the client. if match on version
    POST   /v1/password      {authKeyOld,authKeyNew,wrapped}  rewrap and rotate sessions
    POST   /v1/mfa           {kind}                   enrol. returns a provisioning payload
    DELETE /v1/mfa           {otp}                    unenrol, second factor required
    POST   /v1/grant         {pro_handle,scope}       grant a practitioner sight
    DELETE /v1/grant/:gid    -                        revoke. takes effect on the next request
    GET    /v1/roster        -                        practitioner only. their clients
    GET    /v1/client/:rid   -                        practitioner only. the snapshot scope
    POST   /v1/forget        -                        delete everything. returns a receipt
    POST   /v1/stripe        signed                   webhook. HMAC verified, idempotent by evt

The inbound envelope keeps the closed key set `reviews/technology.md` specified,
with `plan` and `wrapped` as named members and any unknown key refusing the
whole response by name through `importError()`. Nothing is defaulted, nothing is
clamped, nothing negotiates an algorithm.

**What the client sends, in full, and nothing else.** An address, a code, an
`authKey`, a sealed record, a sealed wrapped key, a grant handle, a scope, an
OTP. Never the profile in clear, never one word of story with a rid attached,
never the name, never the birth date, never a screen size. The gate
`reviews/technology.md` proposed, a grep over `ui/net.js` for `CURP`,
`PROFILES`, `axes`, `laws`, `story`, `meter` and `history`, extends to the new
verbs unchanged and is the reason that sentence is a fact rather than a promise.
*The verb set is M. The gate is S.*

### 3.4 Migrations, Environments, Deploys

**Migrations.** D1 is SQLite and Wrangler carries a migrations command, so one
numbered forward only SQL file per change, applied in CI, never edited after it
has run anywhere. No ORM and no migration framework. A destructive change is two
migrations and a release between them, because Time Travel restores a database
and does not restore a column somebody dropped on Tuesday.

**Environments.** Three, and the names are the only interesting part. `dev` runs
locally against a local D1 with `wrangler dev`, seeded by a script, so nobody
needs a network to work on the store. `staging` is its own Worker, its own D1,
its own Stripe test keys and its own subdomain, and it is where the store
submission builds point during review. `production`. Secrets are Worker secrets
set with `wrangler secret put` and never in the repo: the mail pepper, the mail
provider key, the Stripe secret and webhook secret, the VAPID pair when push
lands.

**Deploys.** GitHub Actions, one workflow, and it runs this repo's own gates
before it touches Cloudflare: `BUILD.sh`, `BUILD-engine.sh`, `tests/engine.js`,
`tests/functional.js`, `tests/collide.js`, `tests/design.js`,
`tools/monitor.js`, then `wrangler deploy`. Workers keep prior versions, so a
rollback is a redeploy of a named version rather than a revert commit under
pressure, and a risky change can go out to a percentage first.

**The client is not part of that deploy.** `source.html` ships to the owner as a
download, per `CLAUDE.md`. The funnel and the app on Pages are a separate
publish, and the API version tolerance question in `reviews/technology.md`
remains the thing that decides whether an old download keeps working. *S each
for migrations, environments and the workflow, once the Worker exists.*

### 3.5 Observability, Without Acquiring A Third Party

The ruling against third party scripts is a client side ruling, but a vendor who
sees error payloads from a health product is a subprocessor either way, so the
default is our own numbers.

- **Counters.** Workers Analytics Engine, or the `ev` table already decided,
  integers by day and name, no identifiers. This answers "is sign in working"
  without acquiring anybody.
- **Errors.** A D1 `err` table with a class, a verb, a status and a timestamp,
  never a body, never an address. Enough to see a spike, not enough to leak.
- **Latency and status.** Cloudflare's own Worker metrics.
- **Logs.** Logpush stays off, per `reviews/technology.md`. No request body is
  ever logged.
- **Alerts.** Two are enough to start: the error rate on `/v1/session` and the
  webhook failure count. A missed Stripe webhook is a person who paid and did
  not get their tier, which is the failure that must never be silent, and it is
  the same rule as `CLAUDE.md`'s: a control must never claim success before it
  has it.

An external error tracker is a decision with a privacy notice consequence, so if
one is ever wanted, put it on `admin` only, where the only users are us. *S.*

### 3.6 The Admin And Developer View, Which He Asked For Separately

`TASKS.md` Z2 calls it a developer API and `DECISIONS.md` says it has to be
separate. What it is, concretely: a small server rendered surface on its own
hostname, served by the `admin` Worker, with no build system and no framework,
behind Cloudflare Access so that the front door is single sign on we do not
write. The free Zero Trust plan covers up to 50 seats, which is this team for a
long time, and it gives the admin surface SSO, a policy engine and a login log
before we have written a line of auth for ourselves.

- Zero Trust plans and the 50 seat free tier: https://www.cloudflare.com/plans/zero-trust-services/ and publishing a self hosted application behind it: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/

What it shows, and the list is deliberately short, because every field on it is
a field somebody could stare at:

1. Counters over time. Accounts, sign ins, claims, subscriptions, deletions,
   quiz completions, and the funnel drop off.
2. Plan reconciliation. Every Stripe subscription against every plan row, with
   the mismatches at the top. This is the screen that catches the failure in
   3.5.
3. The corpus, read only, story text with no rid, for the model refinement
   `DECISIONS.md` puts in scope. It cannot show a person beside a story because
   the binding to do so does not exist.
4. Health of the queue. Codes issued and expired, rate limit trips, webhook
   retries, error classes.
5. One account, by `aid`, for support: tier, status, mfa on or off, grants, last
   seen. Never the record, never a story, never an address.
6. The audit log, searchable by actor and action.

Every read of an account through this surface writes an `audit` row naming who
looked. A developer view of a product like this without that is an unlogged door
into other people's self report. *M for the first three items, M again for the
rest, and it is the cheapest possible version of Z2 rather than the analytics
engine that item describes.*

---

## 4. Apple. What Fails Review, And What Is Only Good Practice

Read directly from the App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

**There is no app today.** `source.html` is one HTML file on the web, so none of
this binds until somebody wraps it. What follows is what a wrap has to carry.

### 4.1 Hard. These Fail Review

| Guideline | What it demands | What it costs us |
|---|---|---|
| 4.2 Minimum functionality | "features, content, and UI that elevate it beyond a repackaged website" and 4.2.2 rules out web clippings | A WebView around `source.html` and nothing else is the textbook rejection. This is the expensive one. |
| 5.1.1(i) Privacy policy | A link in App Store Connect and inside the app, naming what is collected, all uses, retention and deletion, and how consent is revoked | The policy `LEGAL-floor.md` already calls an L, plus the in app link |
| 5.1.1(v) Account sign in | If the app supports account creation it must offer account deletion in the app. If there are no significant account based features, let people use it without a login | The delete verb exists in the plan. The screen does not. Note that this product can genuinely run without sign in, which is a rare advantage |
| 5.1.1(ix) Regulated fields | Apps in healthcare or requiring sensitive information "should be submitted by a legal entity" and not an individual developer | Tool of Unified LLC, not a personal account |
| 5.1.2(i) Data use and sharing | No sharing of personal data without permission, explicit permission before sharing with third parties "including with third-party AI", and no requiring push or tracking to unlock functionality | The corpus, model refinement and any future AI feature need a consent step, not a policy paragraph |
| 5.1.2(ii) Repurposing | Data collected for one purpose may not be repurposed without further consent | Refining a model off stories is a second purpose and needs its own consent |
| 5.1.3(i) Health data | Health and fitness data may not be used or disclosed for advertising, marketing or "other use-based data mining purposes other than improving health management, or for the purpose of health research, and then only with permission" | The corpus is defensible under improving health management or health research, and only with permission. Say which, in the consent |
| 1.4.1 Medical | Apps must clearly disclose data and methodology behind accuracy claims, and if accuracy cannot be validated the app is rejected. Apps should remind people to check with a doctor | A 0 to 100 coherence score, a pattern count and a release estimate all read as measurements. This is the guideline most likely to catch this specific product |
| 3.1.1 In app purchase | To unlock features you must use in app purchase, and "apps may not use their own mechanisms to unlock content or functionality, such as license keys" | A Stripe subscription bought on our funnel cannot be the thing that unlocks tiers inside the iOS app, with one exception in 4.2 below |
| App privacy details | The privacy questionnaire is required for every new submission and update, must cover third party SDKs, and must be kept accurate | Health and Sensitive Info are both categories we would be declaring: https://developer.apple.com/app-store/app-privacy-details/ |
| Developer account 2FA | Two factor on the Apple Account used for the Developer Program | Already covered in section 2 |

### 4.2 Two Things That Are Not Requirements, And Both Help

**Sign in with Apple does not attach to us.** Guideline 4.8 triggers only if the
app uses a third party or social login to set up the primary account, and it
explicitly does not apply where "your app exclusively uses your company's own
account setup and sign-in systems." `reviews/technology.md` rejected OAuth with
Google and Apple for its own reasons, and that rejection has now bought a store
requirement we do not have to satisfy. If a Google sign in button is ever added,
4.8 attaches the same day and an equivalent private login service is required.

**3.1.3(b) multiplatform services is the paywall route.** "Apps that operate
across multiple platforms may allow users to access content, subscriptions, or
features they have acquired in your app on other platforms or your web site,
provided those items are also available as in-app purchases within the app." So
a person who subscribed on the funnel may use that subscription in the iOS app,
as long as the same tiers are also purchasable through in app purchase. Apple
takes its cut on the in app path and not on the web path. That is the standard
shape and it is compatible with `DESIGN-billing.md`'s ruling that Stripe never
appears in the app.

**Linking out is currently allowed on the United States storefront and it is
live litigation.** The guidelines now say the external purchase link entitlement
is "not required for developers to include buttons, external links, or other
calls to action in their United States storefront apps." The Ninth Circuit found
a total ban on commission overbroad and remanded, Apple has taken the contempt
question to the Supreme Court, and the commission number is being settled in the
district court. Do not build a business case on the fee being zero.

- Ninth Circuit largely upholding the injunction: https://www.fenwick.com/insights/publications/ninth-circuit-largely-upholds-ruling-in-epic-v-apple
- The modification on fees: https://www.macrumors.com/2025/12/11/apple-app-store-fees-external-payment-links/
- Where it stands now: https://www.courthousenews.com/apples-fight-over-commissions-for-linked-out-app-store-purchases-continues-in-federal-court/

### 4.3 The Web View Question, Answered Plainly

A WebView wrapper is not banned. A thin one is. The pattern that passes is a
native shell with real native capability around web content: native navigation,
native purchase, push, biometric unlock, offline behaviour that is not a browser
error page, and no web chrome. A Capacitor or plain WKWebView project that loads
a URL and stops is the case 4.2 exists to reject.

- Apple's wording, in 4.2 and 4.2.2: https://developer.apple.com/app-store/review/guidelines/
- What reviewers look for in practice, and what passes: https://www.mobiloud.com/blog/app-store-review-guidelines-webview-wrapper and https://appcompliance.io/blog/apple-guideline-4-2-minimum-functionality/

For this product the native capabilities that would earn the wrap are the ones
already wanted anyway: push for ritual accountability, biometric unlock in front
of the record, offline by design, and in app purchase. *Months, not weeks, and
it is a second codebase to keep alive. The honest alternative is in 6.4.*

---

## 5. Google Play. What Fails Review, And What Is Only Good Practice

Every Google domain was blocked from this session, so each line below is
summarised from search results and secondary sources with the primary Play
Console Help URL given. Read the Help page before building to it.

### 5.1 Hard. These Fail Review Or Block Publishing

| Requirement | What it demands | Source |
|---|---|---|
| Data safety form | Mandatory for every submission, fourteen data categories, what is collected, what is shared, why, how it is secured, whether encryption in transit is used, and whether deletion can be requested. Inaccuracy is a policy violation | https://support.google.com/googleplay/android-developer/answer/10787469 and a 2026 walkthrough: https://www.applander.io/blog/google-play-data-safety-form-complete-guide |
| Account deletion | An app that allows account creation must offer in app deletion **and** a web URL where deletion can be requested, and the URL must be functional, prominent and name the app or developer | https://support.google.com/googleplay/android-developer/answer/13327111 and https://www.termsfeed.com/blog/google-data-safety-form-delete-account-url/ |
| Health apps declaration | Every developer with a published app must complete it, including apps with no health features, which certify that they have none. Not completing it blocks any change to the listing | https://support.google.com/googleplay/android-developer/answer/14738291 and https://myappmonitor.com/blog/google-play-health-apps-update-2026-requirements |
| Health Content and Services | A health or medical app that is not a regulated device must carry a disclaimer in the app description that it is not a medical device and does not diagnose, treat, cure or prevent any condition, and must remind people to consult a professional. Secondary reporting says the disclaimer belongs in the first paragraph of the description | https://support.google.com/googleplay/android-developer/answer/16679511 and https://myappmonitor.com/blog/google-play-health-apps-update-2026-requirements |
| Personal and sensitive user data | Health data requires a prominent in app disclosure before the request, in normal use, not buried in a menu, plus affirmative consent and a privacy policy | https://support.google.com/googleplay/android-developer/answer/10144311 and https://support.google.com/googleplay/android-developer/answer/11150561 |
| Target API level | New apps and updates must target Android 16, API 36, since 31 August 2026, with an extension route to 1 November 2026 | https://support.google.com/googleplay/android-developer/answer/11926878 and https://developer.android.com/google/play/requirements/target-sdk |
| Verified organisation account | Organisations need a D-U-N-S number and a verified website, and D-U-N-S issuance can take up to 28 days. Secondary reporting says existing health apps had to be on a verified organisation account by 28 January 2026 | https://support.google.com/googleplay/android-developer/answer/13628312 and https://appcompliance.io/blog/google-play-health-connect-android-16-declaration/ |
| Closed testing, if a personal account is used | Personal accounts created after 13 November 2023 must run a closed test with at least 12 testers opted in continuously for 14 days before applying for production access. Organisation accounts are exempt | https://support.google.com/googleplay/android-developer/answer/14151465 and https://ontest.app/blog/google-play-12-testers-14-days-requirement-explained |
| Play Console 2SV | Required to sign in | https://support.google.com/googleplay/android-developer/answer/2543765 |

**Two of those are cheap and slow, which is the worst combination.** The D-U-N-S
number and the organisation verification are minutes of work and weeks of
waiting, and everything else waits behind them. Start them before anything is
built, not when a build is ready. *S of work, up to a month of calendar.*

### 5.2 Payments On Play, Currently Looser Than Apple

The October 2024 injunction in Epic against Google remains in force while Judge
Donato considers the proposed settlement, and under it United States developers
may offer alternative payment methods and link out. Google reworked its United
States, United Kingdom and European Economic Area policies in mid 2026 around
external links and alternative billing, with service fees reported to start at
10 percent and reporting obligations for enrolled developers from 1 October
2026. This is moving quarterly. Treat any fee number as needing a check on the
day the paywall is built.

- Google's own notice page for United States developers: https://support.google.com/googleplay/android-developer/answer/15582165
- Status of the settlement and the injunction: https://www.stash.gg/blog/blog-epic-v-google-settlement-update-april-2026
- The 2026 billing and linking changes: https://www.neonpay.com/blog/google-plays-new-u.s.-billing-linking-policies-what-game-developers-need-to-know and https://www.strataigize.com/insights/google-play-external-payments-fee-changes-2026/

---

## 6. What Both Stores Demand Of A Health Or Wellness App, Given This Vocabulary

This product names fetters, saboteurs and complexes, prints a coherence score,
marks anatomical locations on a body figure, and speaks of the sympathetic and
parasympathetic branches. `LEGAL-floor.md` section 1 already makes the point
that intended use is read off the copy rather than the arithmetic. Both stores
read the same copy, and they read the store listing first.

**The four things that are the same at both stores.**

1. **A disclaimer that names what it is not.** Apple wants a reminder to check
   with a doctor. Play wants "not a medical device and does not diagnose, treat,
   cure, or prevent any medical condition" in the description. Block B in
   `LEGAL-floor.md` was written for this and is the block to reuse. *S.*
2. **Methodology behind any number that looks like a measurement.** Apple 1.4.1
   rejects unvalidatable accuracy claims. A coherence score, a pattern estimate
   and a release count are numbers a reviewer can read as clinical. The
   defensible position is to state that they are self report arithmetic, say what
   goes in, and never call them a measurement of a condition. *M, and it is a
   copy and framing job, not code.*
3. **Consent, not just a policy, for anything that leaves the device.** Apple
   5.1.2 and 5.1.3 and Play's sensitive data policy all want an affirmative act
   before health data moves, immediately preceded by a plain disclosure, and
   Apple adds that a second purpose needs a second consent. The corpus is a
   second purpose. *M.*
4. **A deletion path a reviewer can click.** In app at both stores, plus a web
   URL at Play. *S once the forget verb exists.*

**One thing to watch that is ours and not theirs.** Naming a person's state with
the compass vocabulary is exactly the material `LEGAL-floor.md` and
`DECISIONS.md` already put under the rule that the product describes a pattern
and never judges a person. That rule is also the store defence. Keep it.

---

## 7. Enterprise Readiness. The Checklist, With Honest Timing

"Enterprise" is not a quality level, it is a procurement questionnaire. Almost
nothing on it is needed to sign in, and almost all of it is needed to sell to a
company that has a security team. The column that matters is When.

| Item | What it is | When | Cost and size |
|---|---|---|---|
| Encryption in transit | TLS everywhere, HSTS, no mixed content | Now | Free. Cloudflare terminates TLS already. *S* |
| Encryption at rest | The database encrypts stored bytes | Now, and already true | D1 encrypts at rest with AES-256 and is covered by Cloudflare's SOC 2 and ISO 27001: https://developers.cloudflare.com/d1/reference/data-security/ *Nothing to build* |
| Application layer encryption | The record is sealed client side so the host cannot read it | Now. This is the product's differentiator | Already decided in `reviews/technology.md`. *S to keep* |
| Password policy | Length floor, breach blocklist, no composition rules, no forced rotation, throttling | At accounts | NIST revision 4 as cited in 1.3. *S* |
| Session management | Opaque tokens, hashed at rest, idle and absolute limits, revocation, a device list | At accounts | Section 1.3. *M* |
| Two factor | TOTP, recovery codes, passkeys later | At accounts for practitioners and admin. Offered to everybody | Section 2. *M* |
| RBAC | Person, practitioner, support, admin, and a scope on every grant | At the practitioner feature | Four roles and one scope column, enforced in the Worker and never in the client. *M* |
| Rate limiting | Per address, per account, per IP bucket, on every verb | At accounts, and it is not optional once there is a password | Workers rate limiting binding plus Turnstile, both already chosen. Add credential stuffing limits on `/v1/session`. *S* |
| Audit logging | Who did what to whose data, when, immutable enough | At the practitioner feature. Build the table at accounts | The `audit` table in 3.2. Enterprise buyers then ask for export. *M* |
| Backup and recovery | A restore that has actually been run | At accounts | D1 Time Travel gives any minute in the last 30 days at no extra cost: https://developers.cloudflare.com/d1/reference/time-travel/ The work is a written restore drill and a stated retention window, which `reviews/technology.md` already ties to the deletion promise. *S* |
| Incident response | A named owner, a severity scale, a contact route, a 72 hour clock | Before the first record is written | GDPR Article 33 sets 72 hours from awareness, and the amended FTC Health Breach Notification Rule sets 60 days and treats an unauthorised disclosure as a breach: https://gdpr-info.eu/art-33-gdpr/ and `LEGAL-floor.md` section 6. *M, and mostly writing* |
| Vulnerability disclosure | A published route for a researcher, a safe harbour sentence, a response time | At accounts. It costs almost nothing and its absence is what turns a finding into a tweet | A `security.txt`, an address, and a page. *S* |
| Penetration test | An external tester against the real thing, annually and after a big change | Before enterprise sale. Before the practitioner feature if a company is in the room | 5,000 to 30,000 dollars per engagement, with small scoped SaaS tests from about 5,000 to 10,000: https://www.redfoxsec.com/blog/how-much-does-web-application-penetration-testing-cost-2026-pricing-guide and https://www.blazeinfosec.com/post/how-much-does-penetration-testing-cost/ *Weeks of calendar, days of our time* |
| Subprocessor list | A public, current list of every vendor who touches data, with notice of changes | Before the first record is written, because the privacy notice needs it | Cloudflare, the mail provider, Stripe. `reviews/technology.md` section 3.6 already names all three. Article 28(2) requires authorisation and a maintained list: https://gdpr-info.eu/art-28-gdpr/ and https://www.orbiqhq.com/trust-center/gdpr-subprocessor-change-notices *S* |
| Data processing agreement | The contract a business customer makes us sign, with the eight Article 28(3) clauses | At enterprise sale, and as a signed DPA from our own vendors now | Template plus counsel. *Counsel, not code* |
| Business associate agreement | The HIPAA contract, required only when we handle protected health information for a covered entity | Only if a clinic, insurer or employer plan deploys this. A consumer wellness app with no covered entity behind it is outside HIPAA | The moment a practitioner is a covered entity using this to carry out their practice, the analysis changes: https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html and https://www.hollandhart.com/avoiding-business-associate-agreements *Counsel first* |
| SSO with SAML or OIDC | A company's identity provider authenticates their people | At enterprise sale, never before. Not needed for a single practitioner | Build against SAML 2.0 and OIDC, or buy. WorkOS is about 125 dollars per connection per month: https://ssojet.com/blog/enterprise-authentication-pricing-2026 and https://idsync.com/guides/workos-pricing *Weeks to build, and it is the classic enterprise tax* |
| SCIM provisioning | Their directory creates and deletes accounts automatically | At enterprise sale, and later than SSO. RFC 7643 and 7644 | https://www.rfc-editor.org/info/rfc7644 and https://scim.cloud/ Directory Sync priced like SSO per connection. *Weeks* |
| Data residency | A guarantee that data stays in a region | Only when a buyer asks, usually a European one | Cloudflare's localisation products are an Enterprise plan concern, and the cheap answer is to run a second deployment in the wanted region rather than to promise residency on one: https://www.cloudflare.com/plans/zero-trust-services/ and https://developers.cloudflare.com/data-localization/ *Months if promised. Nothing if honestly declined* |
| Key management | Where secrets live, who can read them, how they rotate | At accounts | Worker secrets, a written rotation for the mail pepper and the Stripe keys, and the honest note that the mail pepper cannot rotate without invalidating the mail map. *S to document, M to make rotation real* |
| SOC 2 Type II | An auditor's report that the controls you claim were operating over a window | At enterprise sale. It is the first thing a security team asks for and it cannot be rushed, because the window is the point | 25,000 to 80,000 dollars in year one for a small team, of which the audit alone is roughly 15,000 to 50,000 and the compliance platform 7,500 to 30,000 a year: https://www.vanta.com/collection/soc-2/soc-2-audit-cost and https://simpleaudit.io/research/state-of-soc2-2026 *Months, and most of it is evidence collection rather than engineering* |
| PCI DSS | Card data obligations | Now, and already minimal | Stripe Checkout keeps card entry on Stripe's domain, which puts us in SAQ A, and network security, patching, logging and scanning stay ours: https://stripe.com/guides/pci-compliance and https://www.vanta.com/resources/why-companies-that-use-stripe-still-need-pci-compliance *S* |

**The shape of that table, said out loud.** Eleven items are needed at accounts
and every one of them is S or M. Four are needed when a practitioner can see
another person's reading. Six exist only to answer a procurement form, and three
of those six cost real money: SOC 2, the penetration test, and the SSO tax. None
of the six should be started before a buyer with a budget has asked, and SOC 2
should be started the month after the first one does, because the observation
window cannot be bought back.

---

## 8. Sequence. What Must Exist Before Each Thing Ships

Sizes as defined at the top. Calendar is for one developer working on this and
nothing else.

### 8.1 Before Sign In Can Ship

    1  the record store as decided, four verbs, D1, rate limits      M
    2  account, wrap, session, mfa tables and migrations             S
    3  the password derivation and the verifier                      M
    4  the session cookie, revocation, a device list                 M
    5  the code verb hardened for new devices                        S
    6  in app deletion, end to end, with a receipt                   S
    7  the privacy notice, the subprocessor list, the security page  M and counsel
    8  the incident response note and the restore drill              M
    9  the seam gate over the new verbs                              S
    10 a claim conflict answer, which nothing has written yet        M and a ruling

Days to weeks, not months. Item 10 is the one that is missing rather than hard:
`MILESTONES.md` M6 names it and no document says what happens when a person
claims a record onto a device that already holds a profile. Silent overwrite is
the default and it is wrong.

### 8.2 Before Payment Can Ship

    1  everything in 8.1
    2  the price list, which is blocked on two open rulings          blocked
    3  Stripe Checkout, the webhook, idempotency, reconciliation     M
    4  the plan row to tier gate in the client                       S
    5  the subscription disclosure and the separate consent step     M and counsel
    6  the failure alert on webhooks                                 S

Blocked, not sized: `reviews/technology.md` names tier one at 400 a month or 100
a week, and the free grant at ten or twenty five a week, as the two rulings that
block the price ids. No Checkout price can be created before they are answered.

### 8.3 Before A Practitioner Can Be Granted Sight

    1  everything in 8.1
    2  roles and the scope column, enforced server side              M
    3  the grant, the visible list of who has sight, revocation      M
    4  mandatory two factor on practitioner accounts                 M
    5  the audit log, and a read of a client writing a row           M
    6  the snapshot scope built to the DECISIONS.md narrowing        M
    7  the consent copy, block H, drafted for counsel                counsel
    8  a penetration test, because this is the feature that earns it weeks

Weeks of engineering, and the legal and consent work is the long pole. This is
the feature where a mistake is somebody else's self report, so it is the one to
build slowest.

### 8.4 Before Either Store Will Accept A Submission

Calendar first, because two items are slow and cheap.

    now      apply for the D-U-N-S number and verify the website     S, up to 28 days
    now      an organisation account at both stores, under the LLC   S
    then     everything in 8.1, because both stores demand deletion
    then     the privacy policy, linked in the listing and in app    M and counsel
    then     Apple's app privacy questionnaire                       S
    then     Play's data safety form and health apps declaration     S each
    then     the not a medical device disclaimer, first paragraph    S
    then     the methodology statement behind every number           M
    then     a native shell that passes 4.2 on its own merits        months
    then     in app purchase for the tiers, alongside the web path   M

Everything above the native shell is days. The native shell is months and it is
a second codebase forever. That is the real cost of a store submission for this
product, and it is worth saying before anybody commits to it.

### 8.5 What Is Days And What Is Months, In One Paragraph

Days: the tables, the session, the deletion screen, the forms, the disclaimers,
the security page, the subprocessor list, the organisation accounts. Weeks: the
password and wrap model, two factor, the admin view, Stripe, the audit log, the
practitioner grant. Months: SOC 2, a native app that earns its place in a store,
SSO and SCIM, data residency, and moving pattern minting behind the seam if the
paywall is ever to be more than advisory.

---

## 9. What Needs A Lawyer Or A Security Auditor Rather Than A Researcher

**A lawyer, and these are not close calls.**

- The privacy policy and the separate Washington consumer health data policy,
  both already L in `LEGAL-floor.md`, and now with an account, a session and a
  subprocessor list to describe.
- The consent wording for the corpus, because Apple 5.1.2(ii) and Play's
  sensitive data policy both turn on a second purpose being separately
  consented, and because `DECISIONS.md` puts model refinement in scope.
- The practitioner grant, the scope, and whether a practitioner who is a
  licensed clinician makes us a business associate the day they use this in
  their practice. That question changes the whole compliance posture and it is
  not a researcher's to answer.
- The subscription disclosure and the auto renewal consent step, per
  `LEGAL-floor.md` section 8.
- Whether European or United Kingdom sign ups are accepted at launch.
- The claims review `LEGAL-floor.md` section 2 already puts first in the queue.
  Nothing in this file softens that.
- Whether the store listing copy, which is marketing, stays inside the FDA
  general wellness policy and the FTC standard.

**A security auditor, or at least somebody who breaks things for a living.**

- The password and wrap design in section 1, before it is built. The derivation
  split, the iteration count, the salt derivation from the email, and the wrap
  algorithm are the four places this kind of scheme goes wrong, and I have
  specified them from public guidance rather than from having attacked one.
- The session model, specifically fixation, rotation and the cookie flags.
- The grant and scope enforcement, once written.
- A penetration test before the practitioner feature is exposed to a real
  roster.

**What I am not.** Not a lawyer, not an auditor. Google's own policy pages were
unreachable from this session and every Play claim above is a secondary reading
of a primary URL I could not open. Check each one on the Help page before a
submission depends on it.

---

## 10. What Should Go In The Queue, Since He Is Right That It Is Not There

`TASKS.md` carries `Z1` the funnel, `Z2` a developer API and `Z3` practitioner
tools, and nothing that says account, session, password, store or enterprise. I
did not edit `TASKS.md`. These are the items I would add, in this order, with the
sizes above.

    Z4  The auth service. account, wrap, session, mfa, the verbs in 3.3,
        rate limits, and the seam gate extended over them.            Large
    Z5  Deletion, end to end. in app, the web URL Play requires, the
        receipt, the Stripe cancel, the retention window stated.      Medium
    Z6  The admin and developer view, the cheap version in 3.6, behind
        Cloudflare Access, with an audit row on every account read.   Large
    Z7  Store readiness, non code. organisation accounts, D-U-N-S,
        the two forms, the disclaimer copy, the methodology statement. Medium
    Z8  The enterprise floor. security page, subprocessor list,
        key rotation note, incident response, restore drill.          Medium
    Z9  Claim conflict. what a second claim does to a local profile.  Medium,
        and blocked on a ruling
    Z10 Enterprise sale readiness. SOC 2, pen test, SSO, SCIM.        Months,
        and it should not start until a buyer asks

Two rulings block work in that list and both are already named elsewhere: the
tier one allowance and the free grant block the price ids, and the paywall
enforcement question in 1.2 decides whether pattern minting ever moves behind
the seam.
