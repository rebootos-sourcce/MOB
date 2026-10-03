# The technology package

What gets built with what, and what it costs. Decisions, not a survey. Where a
constraint made the obvious choice impossible it is named and the surviving
route is given.

Measured on this build, not remembered:

    source.html                1,042,162 bytes
    source.html gzip -9          376,547 bytes
    one quiz record, plaintext     1.1 KB, 512 bytes gzipped  (TASKS.md:99)
    engine modules                    19, ui modules 19, MANIFEST decides order

Everything below holds five constraints as tests rather than as intentions.

    T1  the name never leaves the device. a key replaces it.
    T2  the record is never held joined to the story.
    T3  the story without the record is what refines the models.
    T4  no customer id, subscription id, email, key, secret or token on the
        record, and the boundary refuses each by name.
    T5  one file, no dependencies, no network except at the seam. the engine
        stays host free and hostfree.py proves it.

The decisions in one block, so the rest of the document is the argument.

| | Decided |
|---|---|
| Seam | one `ui/net.js`, one origin, four verbs, never unattended, `connect-src 'self'` in the CSP |
| Sign in | email one time code plus the person's key. no password, no cookie, no session, no token |
| Cryptography | WebCrypto only. AES-256-GCM, HKDF-SHA-256, HMAC-SHA-256, ECDSA and ECDH on P-256 |
| Record store | Cloudflare Workers plus D1, four tables, ciphertext records, plaintext plan row |
| Corpus | a second Worker with a second D1 binding and no access to the record tables |
| Mail | Resend to start, Amazon SES v2 above roughly fifty thousand messages a month |
| Funnel | `BUILD-quiz.sh` to one `quiz.html`, Cloudflare Pages, same zone as the store |
| Measurement | first party counters in our own D1. no script from anybody else, no cookie, no cross visit id |
| Payments | Stripe Checkout in subscription mode, Customer Portal after, REST by `fetch`, no SDK |
| Push | web push by VAPID, and it costs a second file at the origin. that is unavoidable |
| Practitioner | its own artifact from the same `atuned_src/`. not a mode inside the app |
| Infrastructure cost | about 6 dollars a month at a hundred accounts and at a thousand, about 26 at ten thousand |

**The five rulings this needs before the first record is written.** Each is the
owner's and each changes what gets built rather than how it looks.

1. **Version tolerance at the boundary.** `schema.js` refuses a profile whose
   `v` exceeds `SCHEMA_V`. Either the boundary starts dropping blocks it does
   not know and saying so through `importError`, or the funnel writes the
   current version until every build is upgraded. This is the cross
   compatibility contract with SOURCE.
2. **Push may add a second file.** It cannot work without one. Named as open in
   `DECISIONS.md:207` and section 6 shows why there is no third option.
3. **Whether a practitioner sees the plan scope or everything.** Carried as
   data either way, so it is a value and not a rewrite, but the scope sheet
   copy cannot be written until it is answered.
4. **Free at ten or twenty five a week**, because the funnel's result page has
   to state what the person walks into.
5. **Tier one at 400 a month or 100 a week**, which blocks the price list and
   therefore the Checkout price ids.

---

# 1. The one seam

## 1.1 What the seam is, exactly

One new module, `atuned_src/ui/net.js`, late in MANIFEST, after `ui/ui.js`
binds the store. One origin. Four verbs. Every one of them fires from a press
and none of them fires on load, on a timer, or from a service worker.

    POST  /v1/code     {e}          ask for a one time code. always 204.
    POST  /v1/claim    {e,c}        the record and the plan, once.
    GET   /v1/plan/:rid             the five plan fields. no email, no code.
    POST  /v1/forget   {e,c}        delete the record, the map and the plan.

"Exactly one seam" is one module, one origin and one authenticated shape, not
one request in a lifetime. A person who subscribes has to be able to see that
they did without signing in again, and a person who asks to be deleted has to
be able to reach it. Four verbs behind one module is the version of the rule
that survives contact with a subscription and a deletion obligation. What the
rule forbids and this keeps forbidden: a background poll, a sync loop, a
service worker fetch handler that talks to us, a second origin, a beacon, and
any request the person did not cause.

**The browser enforces it, not a review.** `BUILD.sh` gains a step that hashes
each inline script block and emits a Content Security Policy meta into the
shell:

    default-src 'none'; connect-src 'self'; img-src 'self' data:;
    style-src 'self' 'unsafe-inline'; script-src 'sha256-...' ...;
    base-uri 'none'; form-action 'none'

`connect-src 'self'` means a future mistake cannot reach a third party even if
somebody writes the code. `tests/design.js` gate 7 already watches the network
and fails on any request that is not one of the two local rasters. The CSP makes
that structural rather than observed, and the two together are the whole
defence. Small, and it should land in the same commit as `ui/net.js`.

## 1.2 What crosses, in what shape

**Outbound, and this is the complete set.** Nothing else is ever sent.

| Verb | Body | Bytes |
|---|---|---|
| `/v1/code` | `{"e":"<address>"}`, 320 char ceiling, mail shaped or refused locally | under 350 |
| `/v1/claim` | `{"e":"<address>","c":"<six digits>"}` | under 360 |
| `/v1/plan/:rid` | nothing. the rid is 26 base32 characters in the path | 0 |
| `/v1/forget` | `{"e":"<address>","c":"<six digits>"}` | under 360 |

Never sent, at any verb: the profile, a single axis, a single law, one word of
story, the name, the birth date, the birth place, the key, the local profile
id, a timing, a screen size, or a user agent string of our own making.

**The mechanical guarantee, because a promise in a document is not one.**
`ui/net.js` builds every body from its own arguments and never reads `CURP`. A
gate greps the module for `CURP`, `PROFILES`, `profile`, `who`, `axes`, `laws`,
`story`, `meter` and `history` and fails on a hit. It is four lines of Python
next to `hostfree.py` and it is the reason the claim above can be stated as a
fact.

**Inbound, and the envelope is closed.**

    {"v":3,
     "rid":"<26 base32>",
     "rec":{"alg":"A256GCM","iv":"<16 base64>","ct":"<about 1000 base64>"},
     "plan":{"tier":"two","status":"active","granted":800,"base":0,
             "since":"...","until":"..."},
     "at":"2026-09-19"}

## 1.3 What is refused, by name

Refusal happens at four depths and each one names what it refused. Nothing is
clamped, nothing is negotiated, nothing is defaulted.

**At the envelope.** The allowed key set is `v, rid, rec, plan, at`. Any other
key refuses the whole response and reports the key by name through
`importError()`. There is no forward compatibility here on purpose: a server
that grew a field is a server the app has not been built against.

**At the algorithm.** `rec.alg` must equal the string `A256GCM`. Anything else
is refused and never negotiated. Algorithm negotiation is how a downgrade gets
in, and there is exactly one algorithm in this product.

**At the plaintext, before `validateProfile` sees it.**

    story        refused outright. the record and the story are never held
                 joined, so a record carrying a story is either a bug in our
                 own funnel or an injection, and there is no third case.
    history      refused. the funnel has no snapshots to write.
    account.sec  refused. a secret half arriving from the network is an
                 accident or an attack.
    axes         refused. the record carries inputs, never derived values.
    meter        refused. new ground opened is not a thing the funnel knows.

**At the boundary.** `validateProfile` then runs unchanged, and it already
refuses `plan.customer`, `plan.subscription`, `plan.email`, `plan.key`,
`plan.secret` and `plan.token` by name, refuses an unknown tier rather than
rounding it down, and reads an unknown status as pending, which grants nothing.
The seam is the first real caller of that boundary, which is what `CLAUDE.md`
already predicted it would be.

## 1.4 The flow, with every failure named

    press sign in       nothing has left yet
    address typed       shape checked locally. malformed never leaves.
    POST /v1/code       always 204, whether or not the address is known, so
                        the endpoint cannot be used to ask whether somebody
                        has an account
    code typed          six digits, five attempts, fifteen minutes
    key typed or read   from the fragment the funnel handed over, or pasted.
                        the Crockford check character is verified locally, so
                        a mistyped key never becomes a network request
    POST /v1/claim      ciphertext plus the plan row
    open                AES-256-GCM in ui/crypto.js. a tag failure means the
                        wrong key and says exactly that, never "record not
                        found"
    validate            validateProfile. errors reported by name
    land                a NEW profile is pushed. nothing is overwritten.

Every failure above reports through `status()` and `importError()` and none of
them claims success before it has it. The three that matter most:

- **network unreachable.** The app says the store cannot be reached and stays
  fully usable. Nothing in the product except the claim depends on the network,
  which is the property the whole file is built on.
- **wrong key.** The tag fails. The message is that the key does not open this
  record, not that the record is missing.
- **a second claim over an existing local profile.** `MILESTONES.md` records
  that nothing specifies this and that silent overwrite is the default and the
  wrong one. Decided: **a claim never overwrites.** It pushes a new profile
  named from the record's own date and the person chooses which to keep. The
  atomicity `pImport` already has is the shape, so this costs one branch.

## 1.5 The gate that proves the seam agrees with itself

`tests/seam.js`, new. It takes one record, feeds it to the quiz build and to
the app build, and asserts an identical CQ from both. The funnel shows a score
and the app shows a score, and if those two ever disagree the product has lied
to somebody at the moment it asked for their trust. This is the same discipline
`tools/equiv.py` applies to the concatenation, pointed at the one place two
builds compute the same number.

---

# 2. The identity model

The hard one. The name stays on the device and a person still signs in on a
second device.

## 2.1 The mechanism

**There is no account.** No users table, no password, no session, no cookie, no
bearer token held by the app after a claim. Two facts authorise a claim and the
store holds neither of them.

    the mailbox      proved by a six digit code, fifteen minutes, five tries
    the key          128 random bits the person holds and we never see

The code gets you ciphertext. The key opens it. Neither alone is anything.

**The key.** 16 bytes from `crypto.getRandomValues`, Crockford base32, 26
characters plus one Crockford check character, displayed in five groups. No
password anywhere in the product, so no password hashing, no reset flow, and
nothing to phish. It is generated on the funnel page at the moment the quiz
completes, before anything is uploaded.

**Three derivations, and each exists for a reason.**

    rid  = base32( SHA-256("atuned/rid/v1" || k)[0..16] )
           the row name. a one way function of the key, so the name of a row
           reveals nothing and the person needs only their key to find their
           own record.

    rk   = base32( HMAC-SHA-256(PEPPER, NFKC(lower(trim(email))))[0..16] )
           computed in the Worker, never in a browser. the pepper lives in a
           Worker secret and never in the database, because SHA-256 of an
           email address is not anonymous: the input space is a list somebody
           already has.

    K    = HKDF-SHA-256(ikm=k, salt="atuned/rec/v1"||rid, info="record")
           the AES-256-GCM key. 96 bit random iv per seal, never reused.

**Named cryptography, all of it WebCrypto.** AES-256-GCM for the record,
HKDF-SHA-256 for derivation, HMAC-SHA-256 for the mail key and for Stripe
signature verification, ECDSA on P-256 for the VAPID token, ECDH on P-256 plus
HKDF for the practitioner envelope when it lands. `crypto.subtle` is a host API,
so all of it lives in a new `ui/crypto.js` and reaches the engine through
`bindSeal(seal, open)` beside the existing `bindStore(get, set)`. `hostfree.py`
gains `crypto` and `subtle` to its forbidden list in the same commit, or the
engine quietly acquires a host dependency the gate says it does not have.

## 2.2 The second device

    device one    has the name, the profile, and the key in localStorage
    device two    person types the address, gets a code, enters the key
                  (typed from the card, or carried by the QR the funnel
                  printed), claims, decrypts, holds the record

The name is never part of any of that. The store answers with ciphertext and a
tier. It has never held a name, so the second device cannot learn one from us,
and the person's own device has to be told their name once. That is the whole
trick and it is not a trick: **the only thing the store contributes to identity
is proof that somebody controls a mailbox.** Everything that makes the record
readable travels with the person.

## 2.3 What a second device does not get, at launch

The quiz record, not the current field. There is no sync. `DECISIONS.md:183`
names save conflict between two devices as open and as blocking the record
store, and it is right: two devices that can both re seal one row give a last
writer nobody told the loser about. Decided: **no sync at launch.** The store
holds the record as written once by the funnel. Everything after it is local to
the device it happened on, exactly as today.

Sealed sync with a visible conflict row is in the deferred list at Medium. It is
the right shape when it comes and it is not the shape of a first release.

## 2.4 Lose the key, honestly

**What is gone, permanently.** The record in the store. It is ciphertext under
a key derived from theirs and we cannot read it, which is the property that
makes the whole promise checkable rather than trustable. There is no recovery
path we can perform, by construction. If that is ever softened, the sentence at
`DECISIONS.md:236` about the promise not being a policy line to be softened
later is softened with it.

**What is not gone.**

- The working profile on every device they use it on. localStorage is the
  working copy and the record is only the handoff. A person who loses their key
  and still has their phone has lost nothing they can see.
- The subscription. Stripe holds the payer's email and carries `rid` in
  metadata, so a paying person who loses their key can have a tier re attached
  to a new key by a human. Money is recoverable and the reading is not, and
  that asymmetry is deliberate: the reading is the part we promised.

**What the product must do about it, at the moment the key is minted.** One
sentence, once, on the funnel's result page and on the key row in the profile
sheet: this is the only copy of your key, we cannot send it to you, and without
it your record cannot be opened. Then a download of a small text file, a print
view, and a copy button. The panel research says a stated limit is accepted and
a discovered one is punished, so it is stated exactly once and never nagged.

## 2.5 What this rejects

**OAuth with Google or Apple.** It sends a person's identity to a third party
before they have typed anything, which is precisely the objection that removed
Google Fonts. Rejected on the same ruling.

**A magic link.** Works, and it puts a bearer credential in a mailbox that
outlives the login, and it opens in whichever browser the mail client prefers,
which is the wrong browser on a phone about half the time. A six digit code
crosses from a phone to a laptop without caring.

**Passkeys and WebAuthn.** Genuinely better than a code as a mailbox
replacement, and it solves none of the problem: a passkey does not decrypt a
record, and its recovery story is a platform cloud, which reintroduces a third
party holding the credential. Worth revisiting as a second factor after launch,
never as the thing that opens the record.

**A passphrase the person chooses, stretched with Argon2id.** Rejected for two
reasons. It needs a library, which the one file rule forbids, and a chosen
passphrase against an offline ciphertext is a guessing game we would have handed
the attacker. 128 random bits is not guessable and the cost is that it has to be
kept.

---

# 3. The record store

## 3.1 Where it runs

**Cloudflare Workers with D1.** Wrangler 4.x, a pinned `compatibility_date`,
plain `export default { fetch, scheduled }`, no framework, no router library,
no ORM. D1 is SQLite, so deletion is a `DELETE` and retention is a cron.

Chosen because it is one vendor, one language, one deploy, and because the
funnel on Cloudflare Pages can serve from the same hostname as `/v1/*`, which
removes CORS entirely. No preflight, no `Access-Control-Allow-Origin`, no
origin allowlist to get wrong.

Rejected, with reasons. **Firebase**: a client SDK is a dependency and the
vendor is the one the fonts ruling was about. **Supabase**: a good Postgres, a
25 dollar floor, and a client library we do not need for four JSON endpoints.
**Vercel functions plus Upstash**: two vendors for one 0.5 KB row. **A VPS with
Postgres**: 6 dollars a month and a patching obligation forever, for a service
whose whole job is four verbs. **Workers KV for the records**: eventually
consistent, which is fine for a record and wrong for a one time code, and
mixing two stores to avoid one SQL file is not a saving.

## 3.2 What it holds

Two databases, and the separation is the point.

    DB one, bound to the record Worker
    record  rid TEXT PK, v INT, alg TEXT, iv BLOB, ct BLOB, at TEXT
    mail    rk  TEXT PK, rid TEXT, at TEXT
    code    rk  TEXT PK, ch BLOB, exp INT, tries INT
    plan    rid TEXT PK, tier, status, granted INT, base INT, since, until
    seen    evt TEXT PK, at TEXT          Stripe idempotency
    ev      day TEXT, name TEXT, n INT    first party counters, integers only

    DB two, bound to the corpus Worker, which has no binding to DB one
    corpus  sid TEXT PK, text TEXT, at TEXT       day resolution, no rid

**T2 and T3 are held by an absent binding, not by a policy.** The corpus Worker
cannot read `record` or `mail` because it is not bound to them. A join across
the two cannot be written, not because a reviewer would catch it, but because
there is no handle to write it with. That is the difference between a promise
and an architecture, and `DECISIONS.md:236` asks for the second one.

## 3.3 What it must never hold

An email address. A name. Any plaintext record. A customer id or a subscription
id. An IP address at rest. A story beside a rid. A practitioner's roster. A
cross visit identifier. A cookie, because the store sets none, ever, which
means there is no session to steal.

The address is handled at the edge and never written: `/v1/code` receives it,
computes `rk`, hands it to the mail provider, and drops it. It exists in memory
for the life of one request and in the mail provider's send log, which is an
honest residual named in 3.6.

## 3.4 How deletion actually deletes

`POST /v1/forget {e,c}`, code verified exactly as a claim, then one D1 batch:

    DELETE FROM record WHERE rid = (SELECT rid FROM mail WHERE rk=?);
    DELETE FROM plan   WHERE rid = (SELECT rid FROM mail WHERE rk=?);
    DELETE FROM code   WHERE rk=?;
    DELETE FROM mail   WHERE rk=?;

Then, if a live subscription carries that rid, cancel it through Stripe, and
return a receipt the person keeps. No tombstone row, because a tombstone is the
identifier we just promised to drop. The counter in `ev` goes up by one and that
is all that is left.

Three things that make it true rather than nearly true. **D1 point in time
recovery** is on by default and it is a backup that still holds the row, so the
retention window is set to the minimum the plan allows and the window is stated
in the privacy notice, because a deletion that a restore undoes is not one.
**Logs**: Logpush stays off, no request body is ever logged, and the Worker logs
no address. **The corpus is out of scope of a deletion request and must say so**
at the moment of contribution: a story with no person attached cannot be found
to be deleted, which is the same fact as it not being personal data, and the
person is told that before they contribute rather than after.

## 3.5 Abuse, and what it costs

Rate limits on every verb through the Workers rate limiting binding, keyed by
`rk` and by IP bucket: five code requests per address per hour, five claim
attempts per code, twenty writes per IP per hour on the funnel record write.
**Cloudflare Turnstile** on the quiz completion write, free and unlimited, no
cookie, no cross site profile. Rejected: reCAPTCHA, on the fonts ruling.

## 3.6 The residual, stated rather than buried

Three parties learn something, and all three go in the privacy notice by name.

- **Cloudflare** sees IP addresses at the edge, as any host does.
- **The mail provider** sees the address and holds a send log. Retention set to
  the minimum, open and click tracking off, and verified by reading the source
  of a delivered message rather than by trusting a settings page.
- **Stripe** holds the payer's email beside a rid, because somebody has to take
  the money. It reaches a tier, never a reading.

---

# 4. The funnel's stack

## 4.1 What it is built with

**A separate artifact from the same source tree.** `atuned_src/BUILD-quiz.sh`
to one `quiz.html`, its own `atuned_src/QUIZ-MANIFEST`, reusing
`engine/data/*`, `engine/core.js`, `engine/intake.js`, `engine/compute.js`,
`engine/schema.js` and `engine/plan.js`, and carrying none of the 19 ui
renderers. A new `quiz/` folder holds the three surfaces it needs: the landing,
the question run, and the result. The house rules apply unchanged: MANIFEST
order is load bearing, the engine stays host free, the crypto lives in a
`quiz/crypto.js` that is the same file as the app's `ui/crypto.js` so there is
one implementation of the seal in the product.

No React, no Next, no Svelte, no build toolchain beyond `cat`. The reason is not
purity: it is that the quiz is the intake, the intake is engine code that
already exists and is gated, and wrapping it in a component framework would mean
maintaining a second implementation of the thing the four gates already prove.
`TASKS.md:114` calls B1 "mostly reuse" and that is only true if the quiz is
built this way.

**Hosted on Cloudflare Pages**, same zone and same hostname as the store, so
`/v1/*` is same origin. Static files, unmetered egress, one deploy.

## 4.2 How the quiz hands a person into the app

At completion, in this order, all of it on the page:

1. Generate the key. `crypto.getRandomValues`, 16 bytes, Crockford base32 with
   its check character.
2. Build the record. Inputs only: answers, laws, gates, and nothing derived.
   1.1 KB, 512 bytes gzipped, sealed to about 1 KB of base64.
3. Seal, compute the rid, `POST /v1/record {e, rid, alg, iv, ct}` behind
   Turnstile. The store writes `record` and `mail` and learns nothing.
4. Show the score, the reading around it, and the key, with its one sentence.
5. Hand over three ways, because one way always fails for somebody:
   - a button to the app origin with the key in the **URL fragment**, which is
     never transmitted to a server, and which the app strips from the address
     bar with `history.replaceState` the moment it has read it;
   - a **QR of that same fragment URL**, for the desktop to phone case, which
     is most of them;
   - the key **printed**, for a person who would rather type it.

The app on first run reads the fragment, holds the key locally, asks for the
address, gets a code, claims. The person never sees the word token.

**The funnel asks for no name.** Not first, not last. `who` stays empty until
the app, which makes T1 true in the strong sense at the funnel as well: there is
no name in the record to protect. It also lets the result page be honest about
what we know, which is the register this product writes in.

## 4.3 How it is measured, without contradicting the ruling

We never sell anybody's data, and a tracker is how somebody else's product gets
the data instead. So: **first party counters, in our own D1, holding integers.**

    POST /v1/ev  {"s":"q31","v":"a","w":390,"t":41200}

    s   the step reached, one of a fixed enumerated list
    v   the page variant, from the campaign token WE put in the ad URL
    w   viewport width bucket, four values
    t   milliseconds since page load, bucketed to five seconds

The Worker increments a row in `ev(day, name, n)`. **The raw event is not
stored.** What exists at rest is a table of daily integers per step per
variant, which cannot be re-identified because there is nobody in it. Drop off
by question, by variant and by device class is computable from that, and nothing
else is.

What is deliberately impossible as a result: a per person funnel, a cohort, a
retargeting audience, a lookalike, a session replay, a heat map. Those are the
things a tracker is for and they are the things the ruling forbids selling, so
the capability is absent rather than unused.

    no cookie                     nothing to consent to under the ePrivacy rule
    no localStorage id            so no cross visit identity
    no IP stored                  the edge sees one, we write none
    no user agent string          only a width bucket
    no referrer                   only the token we minted ourselves

Rejected: **Google Analytics**, on the ruling and on the fonts precedent.
**Plausible or Fathom hosted**, which are respectable and are still a third
party script on the page, which is the exact thing gate 7 was written to catch.
**Self hosted Plausible**, which is a Postgres, a ClickHouse and a container to
patch in order to count six steps. **Cloudflare Web Analytics**, because its
beacon is a script from another origin and it samples; Cloudflare's own
server side request counts already exist for free and we take those.

A/B testing is two static pages and a campaign token, not a client side
experiment framework.

## 4.4 What the result page must carry, and it is not mine

`DECISIONS.md:157` specifies the content: the coherence score, what CQ, DQ and
SQ mean in relation to it, how that lands mentally, physically, spiritually and
on the soul, and that the app carries enough to work with what troubles a person
most. `TASKS.md` B0 rules that it has to talk directly to the pain, and
`MILESTONES.md` names the gap that decides conversion: two walls stacked with no
payoff between them only converts people who already trust the brand. The
technology hands the page a real score and a real key. Whether it also hands
over a video is open and is the owner's, and it is the one item here that
changes the hosting bill, because video is the only asset in this whole package
that is not measured in kilobytes.

---

# 5. Payments

## 5.1 The shape

Stripe. The app never sees it. `DESIGN-billing.md` already rules the
integration and this section only says how the store does it without holding an
identifier.

    the app          reads plan off the record, answers what may be opened
    the store        reads Stripe, writes five fields onto the plan row
    Stripe           holds the customer, the card, the subscription, the email

**Checkout in subscription mode** for the purchase and the **Customer Portal**
for everything after, both hosted, for the reasons `DESIGN-billing.md` gives:
the app has no network and cannot host a payment element without breaking the
property the product is built on, and building cancellation, proration and
dunning means getting them wrong.

## 5.2 How a subscription is taken with no id on the record

The joins are placed where each one is unavoidable and nowhere else.

    email  <-> customer  <-> rid        inside Stripe, because it must be
    rid    <-> tier                     inside our store
    rid    <-> the reading              nowhere. the record is ciphertext.

**Buying.** The app opens `https://<origin>/v1/pay?rid=<rid>&tier=two` in a new
tab. The Worker creates a Checkout Session with
`subscription_data.metadata.rid`, `client_reference_id = rid`, and a 303 to the
session URL. Checkout collects the email. We never ask for it and never store
it.

**Provisioning.** The five webhooks `DESIGN-billing.md` names, each writing the
same five fields and nothing else, each idempotent on the event id through
`seen`. The handler reads `metadata.rid`, `status`, the period end and the plan,
and **a gate greps the handler source for `email`, `customer_details`, `cus_`,
`sub_` and `receipt` and fails on a hit.** The same sweep runs over the whole
app build, which `DESIGN-billing.md` already specifies.

**Managing.** The portal needs a customer id we do not store, so the Worker asks
Stripe for it at the moment of the press, with a search on
`metadata['rid']:'<rid>'`, and creates a portal session from the result. The id
lives in the response and dies with the request. Stripe's search index lags by
about a minute, so the webhook also writes `rid` into `customer.metadata` at
provisioning time, which makes the customer findable by the same query and
removes the lag from the path a person actually presses.

**Cancelling.** The subscription runs to period end and the record drops to
free. No account is destroyed by a cancellation, ever. One string changes.

## 5.3 The client, and what was rejected

**Plain `fetch` to the Stripe REST API from the Worker, with the API version
pinned in every call and recorded in the store's readme.** Six calls and a
signature check. Signature verification is HMAC-SHA-256 through `crypto.subtle`
with a constant time compare, about twenty lines.

Rejected: **the Stripe Node SDK**, which is a large dependency needing
`nodejs_compat` for six requests, and whose default of floating the API version
is exactly the behaviour `planState` was written to survive rather than to
rely on. Rejected: **Stripe's prebuilt pricing table**, which is a script from
another origin on a page we control, for a table we can write in HTML.

`plan.js` already handles the part everybody gets wrong: an unknown status
reads as pending and pending grants nothing, `past_due` keeps access, and the
period roll writes `base` rather than computing it. None of that changes.

---

# 6. Push notifications

## 6.1 What it requires, and the one that is a ruling

**Web push**: RFC 8030 for the protocol, RFC 8292 for VAPID, RFC 8291 for
payload encryption. The Worker signs a VAPID JWT with ECDSA on P-256 and
encrypts each payload with ECDH on P-256, HKDF and AES-128-GCM, all through
`crypto.subtle`. Rejected: the `web-push` npm package, which wants Node crypto
and is a dependency.

Four requirements, and the fourth is the owner's ruling.

1. **An origin.** The app must be served over HTTPS from a hostname. It already
   will be, and it still opens from a file with no network, which is the
   property that matters.
2. **A permission press.** Asked once, at the moment a person sets a practice
   time, never on load. A permission prompt on arrival is the pattern this
   product's UX floor refuses.
3. **iOS costs a step.** Web push on iPhone works only for a site added to the
   home screen. That is Apple's rule, it is not negotiable, and it means the
   ritual reminder is available to an iPhone person only after an install
   gesture. It should be asked for at the moment the reminder is set, with the
   reason stated, and it will cost some percentage of iPhone people the
   feature. There is no route around it that does not involve shipping a native
   app.
4. **A second file.** `navigator.serviceWorker.register` takes a URL, and the
   worker script must be a separate file at the origin. There is no inline
   service worker, no data URL registration, and no blob URL that survives a
   reload. **So push cannot exist under the one file rule, and
   `DECISIONS.md:207` has to be ruled.**

The route that survives, if it is ruled in: `sw.js` at the origin root, under
fifty lines, containing a `push` handler and a `notificationclick` handler and
nothing else. It never imports the app, never caches the app, never has a
`fetch` handler, and never talks to our store. A gate asserts that `sw.js`
contains no engine symbol, no `fetch(`, and no string from the reading, so the
second file cannot quietly become half the product.

## 6.2 What it costs in trust, plainly

**A push subscription is a stable identifier for a device, held by us and by
Google, Mozilla or Apple.** The endpoint is a bearer URL: anybody holding it can
wake that device. And the row has to be readable by the sender, so it cannot be
sealed. Push is therefore the one table in this design that the operator can
read about a person, and what it says is a behavioural fact: this device wants a
nudge at seven in the morning in this timezone.

Three decisions contain it.

- **A third database, bound to a third Worker, with no rid column and no link to
  a record.** The app holds the mapping locally. A breach of the push table
  yields endpoints and hours and cannot be joined to a reading or an address.
- **The payload carries nothing from the reading.** One of a fixed set of
  neutral lines, chosen by index. Never a pattern name, never a saboteur, never
  a number. RFC 8291 encrypts it so the push service cannot read it anyway, and
  the fixed line rule is about the lock screen in front of somebody else in the
  room, which is a real threat in a product about shame.
- **Revocation is one press and it deletes the row**, and the app also
  unsubscribes at the browser so the endpoint dies rather than going quiet.

Rejected: **native apps with APNs and FCM**, which means two store accounts, two
build pipelines and the end of the one file. **Email reminders**, which are
cheaper in trust and weaker in accountability, and which raise the mail bill
from cents to the largest line in the table. **A page timer or the Notification
Triggers API**, which do not fire when the tab is closed and are therefore not
accountability at all.

---

# 7. The practitioner view

**Its own artifact.** `atuned_src/BUILD-practice.sh` to `practice.html`, its
own manifest, sharing the engine modules through the same discipline as the
quiz, with its own gates. Not a mode inside `source.html`.

Four reasons, and the first is measured rather than argued.

1. `DESIGN-profiles.md` sizes the panel as Large and calls it "a second
   application wearing this one's chrome". A second application does not belong
   inside a file that must stay one file.
2. It would grow every person's download with code that 99 percent of people
   never run, in a build already at 1,042,162 bytes.
3. The roster is a professional's client book and a professional's liability. It
   must not share a localStorage namespace with a person's own reading, and on a
   shared machine it must not be one tab away.
4. The practitioner is a different person on a different device with a different
   consent relationship. One artifact per role is the honest structure.

**What stays in the app, because consent belongs to the person.** The grant
list, the scope sheet, the request row and revocation are panels in
`source.html`. `DESIGN-profiles.md` specifies the shape: `grants[]` with a
three valued `scope.stories` defaulting to `digest`, one pseudonym per grant so
two practitioners cannot be correlated by the operator, and an unknown grant
state refused by name rather than defaulted, because a grant that defaults to
live is the silent default `CLAUDE.md` forbids.

**The envelope.** Sealed on the person's device to the practitioner's public
half, ECDH on P-256 plus HKDF plus AES-256-GCM, stored as an opaque row
addressed to a hash of the practitioner's key. The operator holds ciphertext
addressed to a pseudonym. X25519 would be the modern choice and it is rejected
on availability: P-256 has been in every WebCrypto implementation for a decade
and the security margin difference is irrelevant at this size.

Deferred past launch, and the grant panels ship a release before the
practitioner artifact does. That ordering is `DESIGN-profiles.md`'s and it is
right: the consent surface is useful on its own and needs no service.

---

# 8. Launch order, with sizes

Sizes in the register `TASKS.md` uses. Trivial, Small, Medium, Large.

## 8.1 Must exist at launch

| # | Piece | Where | Size |
|---|---|---|---|
| 1 | `account` block, blank and load, boundary branch, version tolerance once ruled | `engine/schema.js` | S |
| 2 | Seam refusals: story, history, axes, meter, `account.sec`, closed envelope, `alg` fixed | `engine/schema.js` | S |
| 3 | `meter.firsts` at the boundary | `engine/schema.js` | Trivial, and a bug fix |
| 4 | `bindSeal`, mirroring `bindStore` | `engine/schema.js` | Trivial |
| 5 | `ui/crypto.js`: key mint, check char, HKDF, seal, open | new, late in MANIFEST | M |
| 6 | `ui/net.js`: four verbs, every failure through `status()` and `importError()` | new, late in MANIFEST | M |
| 7 | `hostfree.py` gains `crypto` and `subtle`; the net gate greps `ui/net.js` | `atuned_src/` | Trivial |
| 8 | CSP hashes emitted by the build, `connect-src 'self'` | `BUILD.sh`, `shell/head.html` | S |
| 9 | The store: Worker, D1, six tables, rate limits, Turnstile, `/v1/code`, `/v1/claim`, `/v1/plan`, `/v1/forget`, `/v1/record` | new service | M |
| 10 | Mail: Resend client, twenty lines, no tracking, verified by reading a delivered message | that service | S |
| 11 | `BUILD-quiz.sh`, `QUIZ-MANIFEST`, `quiz.html`: landing, run, result, key, QR, handoff | new | M |
| 12 | The key row, the recovery copy, the one sentence. Written before it is coded | product | S |
| 13 | Claim conflict: a claim never overwrites, it pushes a new profile | `ui/panels.js` | S |
| 14 | Stripe: `/v1/pay`, five webhooks, `seen`, `/v1/portal` by search, the id sweep gate | that service | M |
| 15 | Delete path end to end, PITR window set and stated, privacy notice with three named subprocessors | service and product | S |
| 16 | `tests/seam.js`: one record, two builds, identical CQ. Plus a gate that cuts the network and asserts the app still works | `tests/` | M |
| 17 | First party counters: `/v1/ev`, integers only, the six step enumeration | that service | S |

Eleven Small or Trivial, six Medium, no Large. That is deliberate: **nothing
at launch is Large, because the two Large things in this package are the
practitioner artifact and the points ladder, and neither is needed to take a
stranger from an ad to a reading they paid for.**

## 8.2 Can wait, in the order I would take them

| Piece | Size | Waits because |
|---|---|---|
| Push, `sw.js`, the practice time row, the cron | M | it needs the second file ruling, and it is worthless before there is a ritual log to be accountable to. `ritual.js` writes a completed ritual and nothing reads it |
| Grants, scope sheet, revocation, the person's side | M | useful alone, needs no service, ships a release before the panel |
| Sealed sync with a visible conflict row | M | needs the two device conflict ruling |
| The practitioner artifact | L | a second application. it earns its own release |
| Corpus contribution and the developer view, own build, behind Cloudflare Access | M | it adds a second origin to `connect-src`, which has to be argued when it lands and not assumed now |
| Referral at fifty, capped at four a month | S | it is a coupon and a counter once payments work |
| Annual, whatever the discount is ruled to be | S | `PLAN_YEAR_FREE` is already the one place the number lives |
| SES with SigV4 and bounce handling | S | worth a day's work at about fifty thousand messages a month and not before |
| Points, badges, the ladder | L | the game director owns it and it is not a technology decision |

---

# 9. Cost

## 9.1 The assumptions, every one labelled

    A1  an account is one person who claimed a record.
    A2  6 percent of accounts pay. model output over PANEL-10k, not a
        measurement: 6,066 payers per 100,000.
    A3  average paid price 16.95 a month. the same model's 102,800 over 6,066.
        the ladder itself is still open, so this is a placeholder with
        arithmetic attached and not a price.
    A4  Stripe at 2.9 percent plus 30 cents, domestic card. international adds
        about 1 percent and is not modelled.
    A5  Stripe Tax at 0.5 percent of volume, once there is a registration.
    A6  emails per month = new accounts x 1 plus existing accounts x 0.5.
    A7  one record is about 1 KB at rest sealed, plus a 100 byte plan row.
    A8  8 app loads per account per month at 376,547 bytes gzipped, measured.
    A9  Cloudflare paid plan allowances as published at the time of writing:
        5 dollars, 10 million requests, 5 GB of D1, 25 billion row reads.
        re-check before a price list is printed.
    A10 one .com at registrar cost, 12 a year.
    A11 push at 40 percent opt in, one message a day, only where push is built.

## 9.2 The arithmetic

**At 100 accounts.**

    Workers paid plan                                          5.00
    D1, 100 KB of 5 GB, 600 row writes of 50 million           0.00
    Pages, unmetered egress. 100 x 8 x 376,547 = 301 MB        0.00
    Turnstile, unlimited                                       0.00
    mail, 100 new + 50 sign ins = 150, free tier is 3,000      0.00
    domain, 12 a year                                          1.00
    infrastructure                                             6.00
    Stripe, 6 payers x 16.95 = 101.70
      101.70 x 0.029 = 2.95, plus 6 x 0.30 = 1.80              4.75
    Stripe Tax, 101.70 x 0.005                                 0.51
    TOTAL                                                     11.26

**At 1,000 accounts.**

    Workers paid plan                                          5.00
    D1, 1.1 MB, about 20,000 requests a month                  0.00
    Pages, 1,000 x 8 x 376,547 = 3.0 GB                        0.00
    mail, 1,000 + 500 = 1,500, still inside the free 3,000     0.00
    domain                                                     1.00
    infrastructure                                             6.00
    Stripe, 60 payers x 16.95 = 1,017.00
      1,017 x 0.029 = 29.49, plus 60 x 0.30 = 18.00           47.49
    Stripe Tax, 1,017 x 0.005                                  5.09
    TOTAL                                                     58.58

**At 10,000 accounts.**

    Workers paid plan                                          5.00
    D1, 11 MB, about 300,000 requests of 10 million            0.00
    Pages, 10,000 x 8 x 376,547 = 30.1 GB                      0.00
    push, 4,000 devices x 30 = 120,000 sends, plus 2,880
      cron invocations. inside the included requests           0.00
    mail, 10,000 + 5,000 = 15,000. past the free 3,000,
      so the 50,000 message plan                              20.00
    domain                                                     1.00
    infrastructure                                            26.00
    Stripe, 600 payers x 16.95 = 10,170.00
      10,170 x 0.029 = 294.93, plus 600 x 0.30 = 180.00      474.93
    Stripe Tax, 10,170 x 0.005                                50.85
    TOTAL                                                    551.78

## 9.3 What the table says

| Accounts | Infrastructure | Stripe and tax | Total | Infrastructure as a share of revenue |
|---|---|---|---|---|
| 100 | 6.00 | 5.26 | 11.26 | 5.9 percent |
| 1,000 | 6.00 | 52.58 | 58.58 | 0.59 percent |
| 10,000 | 26.00 | 525.78 | 551.78 | 0.26 percent |

**Infrastructure goes from 6 dollars to 26 dollars across a hundredfold
increase in accounts.** Everything that actually scales is a percentage of money
taken, which is the correct shape: the product's cost per person is a kilobyte
of ciphertext and four requests, and it was designed that way rather than
discovered to be that way.

**What breaks first as it grows, and what it costs to fix.** The mail free tier,
at about 3,000 messages a month, fixed by 20 dollars. Then the mail plan itself,
at about 50,000 messages a month, where SigV4 against SES for a day's work turns
20 dollars into about 5. Then nothing for a long time: D1's storage ceiling at
this record size is somewhere near ten million accounts, and the Workers request
allowance is not reached until the app is asking for far more than a claim.

**What is not in the table, said plainly.** One hour with a lawyer before the
first record is written, which `TASKS.md` already rules is worth it and which is
a one off. Video hosting, if the result page takes a video, which is the only
asset in this package not measured in kilobytes. A dedicated mail subdomain's
warm up, which is time and not money. And an Apple developer account at 99 a
year plus Google's 25, **avoided entirely** by web push and a home screen
install, which is the one place the one file rule saves money instead of costing
it.

---

# 10. What I rejected and why

**A framework for the funnel.** React, Next, Svelte, any of them. The quiz is
the intake, the intake is gated engine code that already exists, and a component
framework means maintaining a second implementation of the thing the four gates
already prove. `TASKS.md` calls B1 mostly reuse and that is only true if it is
the same code.

**Firebase, Supabase, Vercel with Upstash, and a VPS.** One vendor, one
language, one deploy, and a funnel that can be same origin with the store, so
CORS does not exist. A VPS additionally buys a patching obligation forever for
four verbs.

**Workers KV for the records.** Eventually consistent, which is fine for a
record and wrong for a one time code. Two stores to avoid one SQL file is not a
saving.

**OAuth with Google or Apple.** It sends identity to a third party before a
person has typed anything, which is the objection that removed Google Fonts.

**A magic link.** A bearer credential that outlives the login, sitting in a
mailbox, opening in whichever browser the mail client prefers.

**Passkeys.** Better than a code as a mailbox proof, and they decrypt nothing,
and their recovery story is a platform cloud holding the credential. Revisit as
a second factor, never as the thing that opens the record.

**A chosen passphrase with Argon2id.** Needs a library the one file rule
forbids, and hands an attacker a guessing game against offline ciphertext. 128
random bits cannot be guessed and the cost is that it has to be kept.

**libsodium or tweetnacl.** WebCrypto does AES-GCM, HKDF, HMAC, ECDSA and ECDH
natively. A dependency for a build with none.

**X25519 for the practitioner envelope.** The modern choice, rejected on
availability. P-256 has been everywhere for a decade and the margin difference
does not matter at this size.

**The Stripe Node SDK, and the prebuilt pricing table.** A large dependency for
six calls, whose default of floating the API version is the behaviour
`planState` was written to survive rather than rely on. And a script from
another origin for a table we can write in HTML.

**Google Analytics, hosted Plausible or Fathom, self hosted Plausible, and
Cloudflare's own beacon.** The first is the ruling. The second and third are a
third party script on the page, which is exactly what gate 7 exists to catch.
The fourth is a ClickHouse to patch in order to count six steps. The fifth
samples and comes from another origin.

**reCAPTCHA.** The fonts ruling, again.

**Native apps with APNs and FCM.** Two store accounts, two pipelines, 124
dollars a year, and the end of the one file.

**Email as the accountability channel.** Cheaper in trust, weaker in practice,
and it makes the mail bill the largest line in the cost table.

**A background sync, a service worker fetch handler that talks to our store, and
any unattended request.** Every one of them is a second seam wearing the first
one's name.

**A tombstone row on deletion.** It is the identifier we just promised to drop.

**A recovery path we can perform without the person.** It is the one thing that
would make the whole promise a policy instead of an architecture, and
`DECISIONS.md` says in the owner's own words that it is not a policy line to be
softened later.
