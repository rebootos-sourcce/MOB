# Sign in with Google (OAuth), and sign in by username: the design, and the steps for him

Written 1 October 2026, round OU, and updated for round OV, where he ruled
"Let's use Google's OAuth." Google is the provider. Apple is a short note at the
end of Part B. His round OU words: "We need to add an OAuth for
security. How do we do that? I still need to, we still need to wire Stripe. So
I need the steps for those, like I'm nine." The Stripe half is in
`STRIPE-STEPS-NOW.md`. This file is the OAuth half. It is two parts.

- **Part A** is the design, in plain words, with the exact routes, tables and
  checks the server and the app need. It is for him to decide from, and for the
  build seats to build from.
- **Part B** is the steps for his own part: the Google website only he can log
  in to, and where each value he copies goes. Written so he never has to guess
  which screen he is on.

**What this was written against.** The server is the separate repository
`reboot-os`, branch `claude/app-migration-decision-yx56cj`, folder
`atuned/server/`. The app side is `atuned_src/ui/auth.js`, `ui/login.js` and
`ui/account.js` in this repository. Nothing in either repository was changed to
write this. **Every route, table and variable name below is a proposal until
its slice is built**, and says so. Where I could not confirm a screen layout on
somebody else's website from the repository, the step says "look for a button
called X" and the unsure ones are listed at the end of Part B.

---

# Part A. The design

## A1. Where sign in stands today, read off the code

- **An account is an email and a password.** `POST /v1/auth/signup` and
  `POST /v1/auth/signin` in `atuned/server/src/index.js`. The password is
  scrambled with PBKDF2 (a deliberately slow scrambling method, 100,000 rounds,
  with a different random salt per account) before it is stored, so the server
  never holds the password itself.
- **There is no username.** The accounts table (`migrations/0002_identity.sql`)
  has an id, a research id, an email that must exist and be unique, a password
  hash that must exist, and a plan. The app used to show a username field and
  it was removed on 30 September because the server ignored it
  (`ui/login.js`, header).
- **The email is never checked.** Signup does not send a confirmation mail, so
  the server cannot tell a real owner of an address from somebody who typed it.
  This matters a great deal for the linking rules in A9.
- **A session is a random token the browser keeps.** `newSession` in
  `index.js` makes 32 random bytes, stores only its SHA-256 fingerprint in the
  database, hands the token back once, and it lasts 90 days (`SESSION_DAYS`).
  `ui/auth.js` keeps it in the browser's own storage under the key
  `source.session` and sends it as `Authorization: Bearer <token>` with cookies
  switched off (`credentials:'omit'`). There is no cookie anywhere today.
- **The server's address is public and fixed in the app:**
  `AUTH_API='https://atuned-api.lance-o-powell.workers.dev'` in `ui/auth.js`.
  The server is a Cloudflare Worker (a small program Cloudflare runs for us)
  named `atuned-api`, with a Cloudflare D1 database (Cloudflare's hosted SQLite
  database) named `atuned`. The site itself, `atuned.world`, is a separate
  Cloudflare Pages project (`HOSTING-SETUP.md`).
- **The brute force guard exists.** Ten failed tries per email or per network
  address in fifteen minutes locks that key for fifteen minutes (`LIMIT_N`,
  `LIMIT_MS`). The new routes reuse it.
- **A forgotten password already works** by mailed link (`/v1/auth/forgot`,
  `/v1/auth/reset`), through Resend, once `RESEND_KEY` is set.
- **Two factor is not built** and is the systems engineer's by round EZ
  (`ui/account.js`, Security section). This design gives it for free to anyone
  who signs in with Google, because Google runs its own two step check.

## A2. What OAuth is, in plain words

**OAuth is a way to say "let Google tell Atüned who this is", so Atüned never
needs the password.**

The person presses "Continue with Google". Google's own page opens, on
Google's own address, and they log in there the way they always do. Google then
tells our server, privately and with a signature we can check, "this is the
same person as last time, and their email address is such and such". Our
server never sees the Google password, never stores one, and has nothing to
lose if somebody breaks in, because for these accounts there is no password in
the database to steal.

**Why it adds security, honestly.**

- No password is stored for these accounts, so a stolen database leaks nothing
  that logs into anything else.
- No password can be guessed, reused from another website's leak, or typed into
  a fake Atüned page.
- It inherits whatever Google already protects the account with: its two step
  check, its sign in alerts, its breach monitoring.

**What it does not do.** It does not make our session token safer. After the
person is let in, our server still hands the browser a session token, and that
token is held and protected exactly as today. It also means we trust the
provider: whoever controls a person's Google account controls their Atüned
account. And it is partly a convenience feature: fewer passwords to forget is
also fewer forgotten-password mails. The "two factor" he asked for in round MP
is a separate piece of work; signing in with Google is the nearest
thing to it that costs nothing.

### Two named terms, one plain sentence each

**Authorization code flow.** Instead of Google handing our server the identity
straight through the person's web browser, where anything on the page could
read it, Google hands the browser only a short, single use "ticket" (the
code), and our server then takes that ticket to Google directly, server to
server, and trades it for the identity, using a secret that only our server
knows.

**PKCE** (said "pixie", short for Proof Key for Code Exchange). Before the trip
begins, our server invents a one time secret word and gives Google only a
fingerprint of it; when it comes back to trade the ticket, it must say the
secret word, so a stolen ticket is useless to anybody who did not start the
trip.

## A3. Which provider

**Google, ruled in round OV.** It is the one provider this design builds. Most
people already have a Google account; setup is free and takes about thirty
minutes; and Google speaks OpenID Connect, which is the standard layer on top of
OAuth that returns a signed statement of who the person is, so the server can
check the answer rather than trust it. What it costs him: a Google account to
own the setup, a Google Cloud project, a consent screen and one OAuth client,
all in Part B, and no money.

**Apple, later and optional.** Apple's App Store rules (guideline 4.8, check the
current wording) say an iPhone app that offers another company's sign in must
also offer one that limits what is collected. The repository already names an
iPhone bundle id, `com.tulaunified.atuned`, so the day the iPhone app ships with
Google sign in, Apple sign in has to ship beside it. It needs a paid Apple
Developer Program membership (about 99 US dollars a year, check), a Services ID,
a private key file and the server's own address. It is slice OA5 and the end of
Part B says no more than this.

**GitHub, not proposed.** Our people are not mainly programmers, and its sign in
is not OpenID Connect (no signed identity comes back, and the email needs a
second request). Slice OA8 if he ever wants it.

Also worth knowing, not proposed: passkeys (the fingerprint or face unlock a
phone offers) are the strongest option and need no provider at all, and are a
later, separate decision.

## A4. How it fits with sign in by username

His round OT ask: sign in by username. These two fit together as one rule.

- **A username is the person's handle.** It is chosen once, at their first
  sign in, whichever way they came: password or provider. It is the name shown
  wherever a name is shown. It is not their email and it is not their provider
  name.
- **The provider is the proof.** For a provider account, "who they are" is the
  pair (provider, the provider's own permanent id for them). The username is
  only a label stuck to that.
- **Email is optional and is only for recovery.** The person may leave it out.
  If they give one, it is for the forgotten-password mail and nothing else.
  The server must therefore stop requiring an email (A8).
- **Username and password still works.** `POST /v1/auth/signin` will accept
  either an email or a username in a field called `login`, and the old `email`
  field stays accepted, because people have downloaded copies of `atuned.html`
  that still send `email` and must keep working.
- **A person who signs in with a provider has no password.** To log in on a
  device where they cannot or will not use the provider, they would need to set
  one. That is a later, small slice (OA4's "set a password" row).
- **No guessing the handle from the provider.** The username box starts empty,
  or with a random suggestion made by the server ("steady-river-4821"), never
  the person's Google name. A somatic instrument should not silently turn a
  real name into a public label.

**Username rules proposed** (each one is his to change): 3 to 20 characters;
lower case letters, digits and underscore only; must start with a letter;
unique with capitals ignored; a reserved list that nobody can take (admin,
support, atuned, root, staff, system, help, billing and similar); no two
underscores in a row; changing it allowed once every 30 days. The "public
handle" idea is his, and where it is shown is not yet built, so these are
conservative.

## A5. What the app does, and what it never holds

The app is one HTML file. A file anyone can open and read cannot keep a secret,
so **there is no Google client secret and not even the Google client id in the
app.** The app only does three things.

1. **A button.** "Continue with Google", on the login card in
   `ui/login.js` and in Settings, Account in `ui/account.js`.
2. **A request, then a redirect.** On press, the app makes up a one time secret
   word of its own (the "app verifier"), keeps it in the browser's session
   storage (the browser's memory for one tab), sends only its SHA-256
   fingerprint to our server at `POST /v1/auth/oauth/start`, gets back an
   address, and moves the browser there with `location.assign`. The request
   goes through `authCall`, so the rule that `ui/auth.js` is the only file that
   calls `fetch` stays true.
3. **A hand-back.** The server later sends the browser back to the app with a
   short lived single use code after the `#` in the address, for example
   `https://atuned.world/atuned.html#oauth=XXXX`. The app reads it, removes it
   from the address at once, and posts it with the app verifier to
   `POST /v1/auth/oauth/exchange`. What comes back is a session token, kept the
   same way as today.

The part after `#` is never sent to a server and never appears in the next
page's referrer, which is why the code goes there and not after a `?`.

**A limit he should know.** A downloaded copy of `atuned.html` opened from a
folder cannot receive a redirect, because it has no web address to come back
to. The Google button must hide itself, with one plain line
("Sign in with Google works on atuned.world."), when the page is not open on
the site's own address. Email or username and password keep working there.

## A6. What the server does

1. **Start.** On `POST /v1/auth/oauth/start` it makes a random `state` (a
   one time ticket number that proves the person who comes back is the one who
   left), a random PKCE secret word and a random `nonce` (a second one time
   number that Google signs into its answer to prove the answer is fresh). It
   stores them in a new table with the app's fingerprint, valid for ten
   minutes, and returns the Google address with those values in it.
2. **Redirect.** The browser goes to Google, the person logs in and says yes.
3. **Callback.** Google sends the browser to our callback address with the
   code and the state. The server looks the state up, refuses a missing,
   used or expired one, marks it used, and trades the code at Google's token
   address, sending the client secret and the PKCE secret word. Google answers
   with an id token (a signed statement of who this is).
4. **Check the statement.** The server checks: Google's signature on it (using
   Google's published public keys), that it was issued by Google, that it was
   made for our client id, that it has not expired, and that its nonce is the
   one we made.
5. **Find or create.** Using only the provider's permanent id (`sub`), never
   the email, it finds the linked identity. Found: sign that account in. Not
   found: it is a new person, so a username must be chosen (A4).
6. **Our own session.** The server never passes Google's token to the browser.
   It makes its own random session token exactly as `newSession` does today and
   throws away Google's tokens, since it needs nothing from Google after the
   login.

## A7. Where each secret lives

| Value | Secret? | Lives in | Who sees it |
|---|---|---|---|
| Google client id | Not truly secret, but kept the same way for one method | Worker secret `GOOGLE_OAUTH_CLIENT_ID` | Cloudflare, the running server |
| Google client secret | **Yes** | Worker secret `GOOGLE_OAUTH_CLIENT_SECRET` | Same, and he sees it once on Google's screen |
| The address Google sends people back to | No | A plain setting in `wrangler.toml`, `OAUTH_REDIRECT_BASE` | Anybody |

**Rules.** A "Worker secret" is set with `npx wrangler secret put NAME --name
atuned-api`, is stored encrypted by Cloudflare, is never in a repository and
never in the app. When Apple is added later its names will begin `APPLE_SIGNIN_`, kept apart
from the Apple store names already in `wrangler.toml` (`APPLE_ISSUER_ID`,
`APPLE_KEY_ID`, `APPLE_KEY_P8`), which are for in-app purchases.
`MOB` is a public repository (`HOSTING-SETUP.md`): a secret committed there is
exposed the moment it lands.

## A8. The data model change

A new migration, `0011_oauth.sql`, in `atuned/server/migrations/`. Proposed
shape:

    -- accounts gains a handle. email and the password stop being required,
    -- because a person who signed in with a provider may have neither.
    -- SQLite cannot drop NOT NULL from a column, so accounts is rebuilt (see risk below).
    username        TEXT UNIQUE COLLATE NOCASE    -- the handle. NULL only for accounts older than this migration
    username_set_at INTEGER                       -- when it was last changed, for the 30 day rule
    email           TEXT UNIQUE                   -- now optional. several NULLs are allowed in a UNIQUE column
    pass_hash, pass_salt  TEXT                    -- now optional. NULL means "no password on this account"

    CREATE TABLE oauth_identities (               -- the linked identities: who proves each account
      id           TEXT PRIMARY KEY,
      account_id   TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      provider     TEXT NOT NULL,                 -- google today; apple or github only if added later
      subject      TEXT NOT NULL,                 -- the provider's permanent id for the person ('sub')
      email        TEXT,                          -- what the provider said, kept for display only
      email_verified INTEGER NOT NULL DEFAULT 0,
      created_at   INTEGER NOT NULL,
      last_used_at INTEGER,
      UNIQUE (provider, subject)                  -- one provider identity can belong to one account, ever
    );
    CREATE INDEX oauth_identities_account ON oauth_identities(account_id);

    CREATE TABLE oauth_states (                   -- one row per trip to a provider, ten minutes
      state_hash TEXT PRIMARY KEY,                -- SHA-256 of the state, never the state itself
      provider TEXT NOT NULL, server_verifier TEXT NOT NULL, nonce TEXT NOT NULL,
      app_challenge TEXT NOT NULL,                -- the fingerprint the app sent
      intent TEXT NOT NULL,                       -- signin | link
      account_id TEXT,                            -- set only when intent is link
      created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, used_at INTEGER
    );

    CREATE TABLE oauth_handoffs (                 -- what the callback leaves for the app to collect, two minutes, once
      code_hash TEXT PRIMARY KEY,
      provider TEXT NOT NULL, subject TEXT NOT NULL,
      email TEXT, email_verified INTEGER NOT NULL DEFAULT 0,
      outcome TEXT NOT NULL,                      -- signin | new | link | collision
      account_id TEXT, app_challenge TEXT NOT NULL,
      created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, used_at INTEGER
    );

The hourly cleanup in `scheduled()` also deletes expired rows from the two
short tables. `deleteAccount` in `index.js` also deletes the account's
`oauth_identities` rows explicitly, the way it already deletes the rows it
could leave to the cascade.

**The risky part, said plainly.** Rebuilding `accounts` means creating a new
table, copying every row, dropping the old one and renaming the new one, while
`sessions`, `consent` and `entitlements` all point at it with "delete along
with the account" rules. Done carelessly, dropping the old table could delete
every session and every purchase. It is done as its own slice (OA0), tested
against the existing migrations in the offline test harness first, with the
database exported before it is applied to the real one. The cheaper alternative
is to keep email required and give provider accounts a made-up address ending
in `.invalid`. That avoids the rebuild and puts a lie in the data, which the
mail routes would then have to be taught to skip. Recommended: the rebuild.

**What provider accounts do to what exists.** `/v1/me` and `auth()` return
`email`, which may now be null. The Stripe code already copes: `createCheckout`
only sends `customer_email` when there is one. The app does not yet: see A12.
`ops.js` (`supportView`, `exportAccount`) must be read for the same
assumption. **Never store the provider's tokens**: the access and refresh
tokens are used once and dropped.

## A9. The routes

All under `/v1/auth/`, all on the existing Worker. "Public" means no session
needed, like `signin`. Every one uses the existing `limited()` and `failed()`
helpers (the same attempts table) with its own key.

| Method and path | Who may call | Takes | Returns |
|---|---|---|---|
| `POST /v1/auth/oauth/start` | Public. With a session when `intent` is `link` | `{provider:'google', challenge, intent:'signin'\|'link'}` where `challenge` is the app's fingerprint. The provider field is kept so a second provider is a new value and not a new route | `200 {url}` the provider address to send the browser to. `400` unknown provider or bad challenge. `503` that provider has no id or secret set yet, said in plain words. `429` rate limit |
| `GET /v1/auth/oauth/google/callback` | Public, called by the browser coming back from Google | `?code=&state=` (or `?error=` if the person said no) | `303` redirect to the app at `OAUTH_APP_URL#oauth=<code>` on success, or `#oauth_error=<one word>` on any failure: `denied`, `expired`, `provider`, `collision`. Never details, never an email in the address. Header `Referrer-Policy: no-referrer` and `Cache-Control: no-store` |
| `POST /v1/auth/oauth/exchange` | Public | `{code, verifier}` | `200 {token, account}` when the identity is already linked. `200 {needs:'username', suggestion}` when it is a new person. `200 {collision:true}` when the provider email matches an existing account (no sign in is given). `400` the verifier does not match, `410` expired or already used |
| `POST /v1/auth/oauth/complete` | Public | `{code, verifier, username, email?}` | `201 {token, account}` creating the account, the linked identity and the session together. `409` username taken. `400` a rule broken, named |
| `GET /v1/auth/username/check?u=` | Public, rate limited hard | the name | `{available:true\|false, why?}`. Rate limited per address so it cannot be used to harvest every taken name |
| `POST /v1/auth/signin` | Public. **Changed** | `{login, password}`, or the old `{email, password}` | As today. `login` containing `@` is an email, otherwise a username. Same error for "no such account" and "wrong password", same hashing time (the `DUMMY_SALT` path already exists) |
| `POST /v1/auth/signup` | Public. **Changed** | `{username?, email?, password}` | As today. New builds send a username, old builds do not and are given a generated one |
| `GET /v1/auth/identities` | Signed in | nothing | `[{provider, email, linked_at, last_used_at}]`, plus whether a password is set |
| `DELETE /v1/auth/identities/:provider` | Signed in | nothing | `200`. `409` if that would leave the account with no way to sign in |
| `POST /v1/auth/password` | Signed in, for an account with no password | `{password}` | `200`. Lets a provider-only account add one |

Everything above follows the existing style: JSON in, JSON out, `{error:'...'}` in lower case with a status,
the app setting it in sentence case (`authSay`).

## A10. The security checklist

Each line is a check a test must be able to fail.

1. **State.** A random 32 byte value per trip, stored hashed, ten minute life,
   single use. A callback with no state, a wrong state, a used state or an
   expired one is refused. This stops somebody feeding a victim's browser a
   login they started (login CSRF, "cross site request forgery": forcing a
   person's browser to do something they did not choose).
2. **PKCE with S256** (the fingerprint method, SHA-256) on every trip to a
   provider that supports it. Google does.
3. **A second PKCE between the app and our server.** The app's verifier never
   leaves the browser until the exchange. It binds the finished login to the
   browser that started it, so a code stolen from an address bar or a log can
   be redeemed by nobody else. This is also why the state need not live in a
   cookie: a cookie would not travel on every kind of return trip, and a
   second provider added later may return by a cross site form post.
4. **Exact redirect address match.** The address is built from the fixed
   setting `OAUTH_REDIRECT_BASE`, never from the incoming `Host` header or any
   parameter. Google compares it character for character against what he typed
   into its console, so a trailing slash, `http` against `https` or
   a different subdomain fails. The final redirect back to the app goes only to
   the fixed `OAUTH_APP_URL`, never to a value the request supplied, so the
   callback cannot be used as an open redirect.
5. **The id token is checked, not trusted.** Signature against the provider's
   published keys (`https://www.googleapis.com/oauth2/v3/certs`), issuer, audience equal to our
   client id, expiry, and nonce.
6. **Only a provider-verified email counts.** If `email_verified` is not true,
   the email is treated as absent.
7. **Account linking never happens by email. This is the takeover risk.**
   The attack: today nobody checks that an email belongs to the person who
   typed it (A1). An attacker signs up with the victim's email and a password
   the attacker knows. Later the victim presses "Continue with Google"; if the
   server linked "same email, so same person", the victim would land inside the
   attacker's account, with the attacker's password still working, and
   everything the victim then records is open to the attacker. So: a provider
   identity is only ever linked to an account in one of two ways. Either the
   person is already signed in to that account and presses "Link Google" in
   Settings (the signed-in session is the proof), or the provider identity is
   brand new and creates a new account. If the provider's email matches an
   existing account and the identity is unknown, nothing is linked and the
   person is told: "An account already uses this email. Log in with your
   password, then link Google in Settings." This stays true until emails are
   verified by a mailed link, and even then linking stays a signed-in action.
8. **Session.** Same random 32 byte token, stored only as a fingerprint, 90
   days, as today. **If sessions ever move to a cookie** (the security review,
   `ATUNED-architecture-security-review.md` section 8, recommends it): `HttpOnly`
   (scripts cannot read it), `Secure` (only over https), `SameSite=Lax` (sent on
   a link from another site but not on a hidden form post; `Strict` would break
   the return from Google), `Path=/`, the `__Host-` name prefix, and a new
   token issued at every login so an old one cannot be planted. Cookies only
   work cleanly when the app and the server share a site, which means giving
   the server `api.atuned.world`. See the decisions at the end.
9. **Rate limits.** New keys in the existing attempts table: `oauthstart:` per
   address, `oauthcb:` per address, `username:` per address for the
   availability check (strict), `exchange:` per code. Ten per fifteen minutes
   is the existing rule.
10. **Unlinking and password.** Refuse to remove the last way of signing in.
    Removing a link or setting a password ends the other sessions, as a reset
    already does.
11. **Destructive actions** (delete account, unlink) should ask for a fresh
    sign in. Today `DELETE /v1/me` needs only the held token. Flagged, and
    larger than this feature.
12. **Nothing sensitive in an address.** Only the single use code after `#`,
    which dies in two minutes or at first use. No session token, no email.
13. **No logging of codes, states, tokens or id tokens.** `recordServerError`
    in `ops.js` must be checked so a failed exchange does not store them.
14. **Separate Google clients for development and for the real site**, so a
    leaked test secret does not open the real one. Google allows
    `http://localhost` addresses for a development client.
15. **Never mix the public handle with the research id.** A username is a
    label that can be shown; the research id is deliberately never the account
    id and a handle must never be derived from or stored beside it.
16. **Pre-existing, noted not in scope:** `POST /v1/auth/signup` answers 409
    "an account with this email exists", which tells a stranger who has an
    account (already recorded as Q32 in the server's own comments). The same
    leak applies to a taken username through the check route and is rate
    limited for that reason.

## A11. What changes in the app, a list only

`atuned_src/ui/auth.js`

- A session now holds `{token, email, handle}`; `email` may be empty. Today
  `authSession` refuses a stored session with no string `email`, and `authCheck`
  signs the person out unless `/v1/me` returns one. Both change.
- `authEnter` sends `login` as well as `email`, and the field checks
  (`authFieldsWhy`, `AUTH_MAIL`) accept a username.
- New: `authOAuthStart(provider)` (makes the app verifier, keeps it in
  `sessionStorage`, posts the fingerprint, returns the address),
  `authOAuthBack()` (reads and removes `#oauth=` from the address, as
  `authBillingBack` already does for `?billing=`), `authOAuthExchange`,
  `authOAuthComplete`, `authUsernameCheck`, and `authIdentities` plus link and
  unlink calls for Settings.
- `authWhy` gets sentences for the new refusals (collision, username taken,
  username broken, provider not set up).
- `AUTH_API` changes to `api.atuned.world` when the custom address exists.

`atuned_src/ui/login.js`

- A "Continue with Google" button on the login card, above the email and
  password rows, hidden with one plain line when the page is not
  on the site's own address.
- The email field becomes "Email or username".
- A new card, "Choose your username", shown after a first provider sign in:
  username box, a live "available" line, an optional email box with its
  one-line purpose ("only used if you forget how you signed in"), and a
  statement that without a password or an email, losing access to the provider
  means losing access here.
- `loginBoot` also reads `authOAuthBack()` before deciding whether to show the
  door.
- Create account asks for a username as well.

`atuned_src/ui/account.js` (not named in the brief, needed for the same
feature)

- `ses.email` is printed in the profile menu and in the Security section
  ("Sign in method" currently prints "email and password"). Both must print the
  handle, and the method must name the linked providers.
- A "Linked sign ins" group in Security: Google linked or not, a Link and an
  Unlink button, and "Set a password" for provider-only accounts.

The tests, gates and monitors in this repository that watch the network
(`tests/design.js` gate 7, the funnel gate, the monitor) must keep seeing zero
outbound requests until a person presses a sign in button, which holds because
the only new request is made on a press.

## A12. What to test

Server, offline, in `atuned/server/test/` with a fake Google standing in for the
real one, the way `billing.test.mjs` already fakes Stripe through
`env.FETCH`:

- A good login makes an account, a handle, a linked identity and a session, and
  the same Google person signing in again gets the same account.
- A missing, wrong, reused and expired state is refused. A replayed callback is
  refused the second time.
- An exchange with the wrong app verifier is refused, and a code redeemed once
  cannot be redeemed twice.
- An id token with the wrong audience, wrong issuer, expired, wrong nonce, or a
  bad signature is refused.
- The redirect address sent to the provider equals `OAUTH_REDIRECT_BASE` plus
  the path, with a hostile `Host` header changing nothing.
- A provider email that matches an existing account and an unknown identity
  links nothing and says so (the takeover test). It must fail if the linking
  rule is reverted to match by email.
- An unverified provider email is ignored.
- Link needs a session, and a provider identity already on another account is
  refused. Unlink of the last method is refused.
- Username rules: too short, too long, bad characters, reserved, case
  insensitive clash, two simultaneous claims of one name (the unique index
  decides, one gets a 409), rename within thirty days refused.
- Sign in by username and by email both work, give the same wrong-password
  answer and take about the same time for an unknown name.
- An account with no email and no password signs in by provider, can read
  `/v1/me`, and can open Stripe checkout.
- Deleting an account removes its linked identities.
- The migration on a database holding accounts, sessions, consent and
  entitlements loses none of them (the rebuild test).

App, in `tests/functional.js` against the stub server the gate already stands
up: the button is hidden off the site's own address; pressing it posts only a
fingerprint and never the verifier; the address is cleaned after the hand-back;
a session with no email survives the boot check; the username card refuses bad
names before sending; no token, code or verifier is written into the profile or
its export. And a gate that fails the build if the Google client id, a client
secret or an `AIza` or `GOCSPX-` string appears anywhere in the built file,
the same way the billing gate sweeps for `sk_`.

By hand, once, with a real Google test account: log in, log out, log in again
(same account), link Google to a password account from Settings, unlink it, and
a second Google account (must be a different Atüned account).

## A13. The slices

S is under a day of work, M is one to three days, L is more. In order.

| Slice | What | Size | Needs first |
|---|---|---|---|
| **OA0** | Migration `0011_oauth.sql`: rebuild of `accounts` (email and password optional, username added), the three new tables, the rebuild test with data in every dependent table, database export before applying | M | Nothing. The riskiest slice, done early and alone |
| **OA1** | Username: rules, reserved list, check route, signup takes a username, signin takes `login`, old `email` field still accepted; app login and Create account get the username field | M | OA0 |
| **OA2** | Google on the server: start, callback, exchange, complete, id token check, state and handoff tables in use, all tests in A12 against a fake provider | L | OA0, OA1. His Part B steps for the real test |
| **OA3** | Google in the app: button, hand-back, "Choose your username" card, session with no email, the hide-off-site rule | M | OA2 |
| **OA4** | Linking: identities route, Link and Unlink in Settings, Set a password, last-method guard, the takeover test | S | OA2 |
| **OA5** | Later, optional: Apple. Client secret made from the key, form post callback, relay email handling, button | L | OA2. Needed the day the iPhone app offers Google sign in. His Apple steps, written then. A custom server address |
| **OA6** | Hardening: custom address `api.atuned.world`, `ALLOWED_ORIGIN` narrowed from `*`, the return address fixed to the app's real page (see note below), referrer and cache headers, log scrubbing, fresh sign in for delete | S | Custom address from him |
| **OA7** | Optional: sessions as a secure cookie instead of a stored token (security review section 8) | M | OA6. His decision |
| **OA8** | Optional: email confirmation by mailed link, and GitHub | S each | RESEND_KEY set |

**One finding on the way, which touches this and Stripe.** The site opens on
the funnel: `deploy.yml` copies the funnel to `index.html` and the app to
`atuned.html`. But the server sends people back to `APP_URL + '/?billing=done'`
(Stripe) and `APP_URL + '/?reset='` (password reset), and `APP_URL` is
`https://atuned.world`, which is the funnel page and not the app. The OAuth
return must therefore go to `https://atuned.world/atuned.html`, as a new
setting `OAUTH_APP_URL`, and the Stripe and reset returns should follow.
**Check this** with whoever owns the site layout before slice OA6.

## A14. What he can decide now, and what each choice costs

1. **Give the server its own address, `api.atuned.world`?** Costs a few
   minutes in Cloudflare (once `atuned.world` is on Cloudflare, which
   `HOSTING-SETUP.md` step 3 left to him). Gains: it sits on the domain named on
   Google's consent screen, so Google is happier with it; cookies become
   possible; Apple will need it later. Without it, Google works from the
   `workers.dev` address.
2. **Keep the stored token or move to a cookie?** Stored token: nothing to
   change, works from a downloaded file, readable by any script that ever runs
   in the page. Cookie: safer against that, needs `api.atuned.world`, and a
   downloaded file could no longer sign in.
3. **Apple.** Later, ruled by round OV. Required the day the iPhone app offers
   Google.
4. **On the username screen, is "keep my provider's email for recovery"
   ticked or unticked to start?** Ticked helps recovery. Unticked says nothing
   is kept unless asked. Proposed: unticked.

---

# Part B. Steps for him, like he is ten

**What you are doing.** You are making one key at Google. It lets our server ask
Google "is this person who they say they are?". You make the key on Google's
website, copy the two values it gives you, and paste them into our server. That
is all.

**Nothing in the app changes when you finish.** The server does not read these
yet. We build that after you say go. Doing this first just saves time later,
and nothing you do here can break the app.

**Three rules.**

1. **Secrets go in one place only.** The terminal commands in this document.
   Never paste a secret into the chat, an email, a text, a screenshot or a file
   in GitHub. The one that matters most is the Google client secret.
2. **These are separate logins.** Google, Cloudflare, GitHub, Stripe and Claude
   are five different accounts with five different passwords, even where some
   use the same email. Each section below says which one it is.
3. **If a screen does not match, stop.** Websites move their buttons. Take a
   screenshot and send it. That is the website changing, not you doing it
   wrong. These steps were written on 1 October 2026 without being able to open
   the website, so the words on the buttons below are from the last time its
   layout was known, and the ones I am unsure of say "look for".

**Where the server lives, so you know what you are pasting into.** The server
is a small program on Cloudflare (a company that runs websites and programs for
us), named `atuned-api`. Its code is in the GitHub repository `reboot-os`. A
push to the `main` branch there starts a helper called GitHub Actions that
updates the server (`HOSTING-SETUP.md` explains it). Secrets do not go through
GitHub. They go straight to Cloudflare from your terminal.

## Before you start

- A computer with a web browser.
- A terminal, which is a plain text window where you type commands. You opened
  one before for `RECORDS_KEY`. If you need to again: on a Mac press Cmd and
  Space together, type `Terminal`, press Enter. On Windows press the Windows
  key, type `PowerShell`, press Enter. Type `node -v` and press Enter; a number
  such as `v20.11.0` means it is ready. If it says "not recognized", install
  Node from `nodejs.org` (the big green button, the LTS one).
- You must be logged in to Cloudflare in that terminal. Type
  `npx wrangler login`, press Enter, a browser window opens, click "Allow".
  You only do this once on a computer.
- A notes file or a password manager open, for copying values into for a
  minute. A secret that is lost cannot always be shown again.
- About thirty minutes.

## B0. Decide the address Google sends people back to

Google checks the return address letter for letter. The address we plan
to use is:

    https://api.atuned.world/v1/auth/oauth/google/callback

and, only while `api.atuned.world` does not exist yet, this second one is also
added at Google so the first tests can work:

    https://atuned-api.lance-o-powell.workers.dev/v1/auth/oauth/google/callback

Where these come from: `atuned-api` is the server's name in `wrangler.toml`;
`lance-o-powell.workers.dev` is the address the app already talks to
(`AUTH_API` in `ui/auth.js`); `/v1/auth/oauth/google/callback` is the route
this design adds (A9).

**Check this:** is `atuned.world` already added to Cloudflare? `HOSTING-SETUP.md`
step 3 (point `atuned.world` at Cloudflare) was left open at the time of
writing. If it is not done, Google still works with the second address. If it is done, do the optional step below, or tell us and we add
it in the server's settings file.

**Optional, the server's own address.**

1. Go to **dash.cloudflare.com** and log in. This is your Cloudflare login,
   which is separate from Google, GitHub and Stripe.
2. In the **left menu** click **Workers & Pages** (it may sit under a heading
   called **Compute**).
3. In the list of names click **atuned-api**. That is the server.
4. Along the row of tabs near the top, click **Settings**.
5. Look for a section called **Domains & Routes**. Click **+ Add** beside it,
   then choose **Custom domain**.
6. In the box type `api.atuned.world` and click **Add domain**. Cloudflare sets
   the rest up itself. It can say "Initializing" for a few minutes.
7. The server's code and the app then also need to use that address. That part
   is ours, slice OA6. Tell us it is added.

If any word here is not on your screen, look for the nearest one, or send a
screenshot.

---

## B1. Google

**Website:** `console.cloud.google.com`. It is Google Cloud, the part of Google
for building things. **Log in with a Google account.** That is a separate login
from Claude, GitHub, Cloudflare and Stripe. Use the Google account you want to
own this for good. If the business has its own Google account, use that one,
not a personal one, because the keys belong to whoever creates them.
**Check this:** which Google account should own it.

### B1.1 Make a project

A project is a folder at Google that holds this one thing.

1. Open `console.cloud.google.com`. If Google shows a page about terms of
   service, tick the box and click **Agree and continue**.
2. Look at the **very top bar**. Near the **top left**, right of the words
   "Google Cloud", there is a **drop down box** showing a project name, or the
   words "Select a project". Click it.
3. A window opens. At its **top right** click **New project**.
4. In **Project name** type `Atuned`.
5. Leave **Organization** and **Location** as they are (usually "No
   organization").
6. Click **Create**. Wait about ten seconds.
7. Click the drop down box at the top left again and click **Atuned** in the
   list, so the top bar now says Atuned.

### B1.2 Fill in the consent screen

This is the page the person sees at Google saying "Atüned wants to know who
you are". Google may call this area **Google Auth Platform**, or **OAuth
consent screen**, depending on the version of the site you get. Both are fine.

1. Click the **three line menu** at the **top left** (the one called
   "Navigation menu"). Click **APIs & Services**, then **OAuth consent
   screen**. If you cannot see it, click the **search box in the top bar**,
   type `Google Auth Platform`, press Enter and click the result.
2. If you see a button **Get started**, click it. Then:
   - **App name:** type `Atüned`. (If your keyboard cannot type the dotted u,
     `Atuned` is fine.)
   - **User support email:** click the box and pick your own email from the
     list.
   - Click **Next**.
   - **Audience:** choose **External**. External means anybody with a Google
     account may sign in. Click **Next**.
   - **Contact information:** type your email. Click **Next**.
   - Tick the box agreeing to Google's user data policy. Click **Continue**,
     then **Create**.
3. In the **left menu** of this section click **Branding**. Fill in:
   - **App logo:** **skip for now.** Look for the words that say a logo makes
     Google review your app before it can go public. That review can take
     several days. You can add the logo later, in the same place. **Check
     this:** whether adding a logo triggers that review, at the moment you see
     the page.
   - **Application home page:** `https://atuned.world`
   - **Application privacy policy link** and **Application terms of service
     link:** the addresses of the Atüned privacy and terms pages.
     **Check this:** the address of the privacy page. The word "privacy" is
     already on the product's privacy screen, but I could not find a web
     address for it in the repository. Leave these empty if there is none yet
     and tell us.
   - **Authorized domains:** look for **+ Add domain**. Click it and type
     `atuned.world` (nothing else: no `https://`, no slash).
   - **Developer contact information:** your email.
   - Click **Save** at the bottom.
4. In the **left menu** click **Data Access** (older versions call it
   **Scopes**). Click **Add or remove scopes**. A panel slides in with a long
   list. Tick **only these two**, which are the only things we ask Google for:
   - `openid`
   - `.../auth/userinfo.email`  (described as "See your primary Google Account
     email address")

   **Do not tick** the profile or photo one. We do not want a real name or a
   photo, on purpose. Click **Update** at the bottom of the panel, then click
   **Save** on the page.
5. In the **left menu** click **Audience**. It will say **Testing**. In
   Testing, only people you list under **Test users** can sign in. Click
   **+ Add users**, type your own email, click **Save**. Add any friend who
   will try it. **Leave it on Testing for now.** On launch day you will press
   **Publish app** here and confirm. With only these two scopes Google does not
   need to inspect the app, but **check this** when you press it.

### B1.3 Make the key, which Google calls an OAuth client

1. In the **left menu** click **Clients**. (On the older layout, click
   **Credentials** in the left menu instead.)
2. Click **+ Create client** near the **top** of the page. (Older layout:
   **+ Create credentials** at the top, then **OAuth client ID**.)
3. **Application type:** click the box and choose **Web application**.
4. **Name:** type `Atuned server`. This is only a label for you.
5. **Authorized JavaScript origins:** **leave empty.** Our server makes the
   exchange, not the web page, so Google does not need any.
6. **Authorized redirect URIs:** click **+ Add URI** and paste exactly this,
   with nothing before or after, no space at the end, and the `s` in `https`:

       https://api.atuned.world/v1/auth/oauth/google/callback

   Click **+ Add URI** again and paste this second one too (this is the
   temporary one, see B0):

       https://atuned-api.lance-o-powell.workers.dev/v1/auth/oauth/google/callback

   A redirect URI is the web address Google sends the person's browser back to
   after they say yes. Google refuses to send them anywhere that is not on this
   list, which is the whole point.
7. Click **Create** at the bottom.
8. A box appears called **OAuth client created**, showing a **Client ID** (a
   long address ending `.apps.googleusercontent.com`) and a **Client secret**
   (a shorter mixed string, usually starting `GOCSPX-`).
   **Copy both into your notes right now**, and click **Download JSON** and
   keep that file somewhere safe outside the repository. Google may show the
   secret only in this box and never again. **Check this:** if you close the
   box and cannot see the whole secret later, delete the client and make a new
   one, there is no harm in it.

### B1.4 Put the two values into the server

You are going to run two commands. Each one asks you to paste a value. The
paste shows nothing on screen. That is normal.

1. Open your terminal.
2. Type this and press Enter:

       npx wrangler secret put GOOGLE_OAUTH_CLIENT_ID --name atuned-api

3. It says "Enter a secret value". Paste the **Client ID** and press Enter. It
   says "Success" when done.
4. Type this and press Enter:

       npx wrangler secret put GOOGLE_OAUTH_CLIENT_SECRET --name atuned-api

5. Paste the **Client secret** and press Enter.
6. Check they are there. Type:

       npx wrangler secret list --name atuned-api

   It prints the names, never the values. You should see
   `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET`. **Check this:**
   that this command exists in the version of the tool you have. If it does
   not, open **dash.cloudflare.com**, **Workers & Pages**, click
   **atuned-api**, click **Settings**, and look for **Variables and Secrets**,
   which lists the names the same way.
7. Delete the secret from your notes when you have a safe copy in a password
   manager.

Those two names are the ones the server slice OA2 will read. They are fixed by
this document, so do not rename them.

**You are done with Google.** Tell us "Google keys are in". We build the server
side (OA2) and the button (OA3). When the button exists, you press it with a
test user and the first thing you should see is Google's own page asking which
account to use, with the name Atüned at the top, and after you say yes, a
screen asking you to choose a username.

---

## B2. What you will see when it is built, so you know it worked

These are the lines to check against once slices OA2 and OA3 are live. They are
not true yet.

1. On the login card there is a **Continue with Google** button above the
   email and password.
2. Pressing it takes the whole window to a Google page headed with the name
   Atüned. Choosing your test account and pressing **Continue** brings you back
   to `atuned.world`.
3. A card says **Choose your username**. Typing one shows "available" or says
   why not. Pressing the button takes you in, and the status line says you are
   signed in.
4. Signing out and pressing the Google button again takes you in with no
   username question, to the same account.
5. In Settings, Security, the sign in method names Google.

If step 2 shows a Google page that says **Error 400: redirect_uri_mismatch**,
the web address in B1.3 step 6 does not match what the server sent. Copy the
address Google shows in that error and send it to us.

## B3. What I could not confirm, as questions for him

Each of these is a "check this" above.

1. **Which Google account should own the keys?** The business's, if there is
   one.
2. **Is `atuned.world` already added to Cloudflare** (step 3 of
   `HOSTING-SETUP.md`)? This decides whether `api.atuned.world` can exist now.
3. **What is the web address of the privacy policy and terms page** that Google
   asks for on the consent screen? I found none in the repository.
4. **Will the iPhone app offer Google sign in?** If yes, Apple sign in must
   ship with it, and the Apple steps are written then. If no, Apple can wait.
5. **When you press Add domain at Google, or Publish app, does Google say it
   needs to verify anything** (a logo, the domain)? Send a screenshot if so.
6. **Where should the Google button send people back to**:
   `atuned.world/atuned.html` (the app) or the funnel page `atuned.world/`?
   Today the Stripe and password reset links go to the funnel (A13 note).
7. **Stored token or cookie** (A14 question 2), **username rule changes**
   (A4), and **the default on the email tick box** (A14 question 4). Each is
   his call and none blocks Part B.
8. **Does the version of `wrangler` on his computer have `secret list`?**
   Only matters for the check step.

---

## B4. Apple, later and optional. A note, not steps

**Round OV ruled Google: "Let's use Google's OAuth."** Apple is not part
of this round and there is nothing for him to do at Apple today.

Why it is still written down: Apple's App Store rules (guideline 4.8, check the
current wording) say an iPhone app that offers another company's sign in must
also offer one that limits what is collected, which Apple's own does. The
repository already names an iPhone bundle id, `com.tulaunified.atuned`. So **the
day the iPhone app ships with Google sign in, Apple sign in has to ship beside
it.** What it would need from him then, in one breath: a paid Apple Developer
Program membership (about 99 US dollars a year, check the current price), a
Services ID (Apple's name for a website that uses its sign in), a private key
file that Apple shows only once, and the server's own address
`api.atuned.world`. The server side is slice OA5. When that day comes, ask for
steps like these ones and they will be written then, against Apple's screens
as they are that day.
