# Hosting setup, steps for him

Written at round JN, rewritten at round KR once `reboot-os` was actually
read rather than guessed at. These are the steps he takes himself, in a
Cloudflare account only he can create, and the two things in that
repository still open.

**Where this splits.** This repository (`MOB`) is the engine and the one
file build. It calls no network and needs none of the steps below. The
server, the database and the deploy workflow live in `reboot-os`, a
separate repository. `main` there is now current (merged round KP, 183
commits) and already carries the `atuned.world` fix, so everything named
below is read from the real files on `main` today, not from an old plan.

## The domain is settled: atuned.world, not atuned.app

Confirmed round KJ/KK: he is setting up `atuned.world`, registered at
GoDaddy, parked. The earlier document here said `atuned.app`; that was
wrong and is dropped. `reboot-os`'s server config (`atuned/server/wrangler.toml`)
was updated to `APP_URL = "https://atuned.world"` and `MAIL_FROM = "Atuned
<hello@atuned.world>"` and that change is merged into `main`.

## What's already built and waiting, read straight off `reboot-os` main

The server is not a plan any more, it is a working Cloudflare Worker with
a real README (`atuned/server/README.md`) and a real deploy workflow
(`.github/workflows/server.yml`). Both are quoted here rather than
paraphrased, so nothing is invented:

**The deploy workflow already exists and already runs on every push to
`main`.** It runs the server's tests every time. It only migrates and
deploys when two GitHub repository secrets are present:

    CLOUDFLARE_API_TOKEN     needs Workers Scripts: Edit and D1: Edit permission
    CLOUDFLARE_ACCOUNT_ID

Until those two secrets exist in the `reboot-os` repository's own GitHub
settings (Settings, Secrets and variables, Actions), the workflow tests
the code and stops there. Nothing deploys, nothing breaks.

**The database is scaffolded but not created.** `wrangler.toml` has a
placeholder, `REPLACE_AFTER_wrangler_d1_create`, where a real database id
goes. Eight migration files already exist (`atuned/server/migrations/0001`
through `0008`) and apply automatically once the id is real. The workflow
itself checks for the placeholder and skips the deploy step cleanly if it
finds it, rather than failing.

## The four things only he can do

1. **Create or confirm the Cloudflare account.** Same one already used for
   the Worker setup screens he's been sending screenshots of.
2. **Create the D1 database, once, and paste its id into `wrangler.toml`.**
   From a terminal with `wrangler` installed and logged in:

       npx wrangler d1 create atuned --location wnam

   `wnam` is Cloudflare's label for the US West data center region.
   That command prints a `database_id`. It replaces
   `REPLACE_AFTER_wrangler_d1_create` in `atuned/server/wrangler.toml`,
   line 8. This is the one edit to that file itself; everything else in
   this document is account settings, not code.
3. **Add the two GitHub secrets named above**, `CLOUDFLARE_API_TOKEN` and
   `CLOUDFLARE_ACCOUNT_ID`, to the `reboot-os` repository (not `MOB`).
   The token is created in the Cloudflare dashboard under My Profile, API
   Tokens, with exactly the two permissions named above. The account id
   is on the Cloudflare dashboard's own overview page.
4. **Set the Worker's own secrets**, which never live in any repository.
   From the same terminal, inside `atuned/server`:

       npx wrangler secret put RECORDS_KEY

   This is the one that matters first: it encrypts every stored record,
   is generated once, and is never regenerated (losing it loses every
   record encrypted with it, permanently). The README gives the exact
   one line to generate 32 random bytes for it. Everything else
   (`VAPID_PUBLIC`, `VAPID_PRIVATE`, `RESEND_KEY`, `ADMIN_KEY`, the Apple
   and Google store keys) is only needed for the features that use them
   (push notifications, password reset, the support console, store
   purchases) and can wait until those are actually being turned on.

Once the database id is real and the two GitHub secrets exist, the next
push to `main` migrates and deploys the Worker automatically. Nothing
else in this list needs a code change from this side.

## What is still open, and why it is not skipped

- **Which product goes online first**, this engine (`MOB`) or the app
  already built in `reboot-os`. Asked repeatedly across many rounds,
  never answered. It decides which one's sign in this database actually
  serves first.
- **`MOB`'s own visibility.** It is still a public repository. A real
  secret committed here is exposed the moment it lands, not after. This
  is why no key has ever been generated or committed on this side, and
  why the sign in shell already built in `atuned_src/ui/account.js`
  still refuses honestly ("Accounts are not live yet") rather than
  pretending to work.

## Where the line sits between GitHub and Cloudflare

GitHub holds code, a filing cabinet: it stores every version of every
file and remembers the history, but nothing lives on a webpage because
it is in GitHub. Cloudflare is the part that takes code out of that
filing cabinet and actually runs it where a browser can reach it, plus
it holds the database, the real person records. The two are connected
by exactly the two secrets above: once they exist, every push to `main`
is automatically taken and deployed. Nothing else crosses between them.

## The files themselves, if he wants them directly rather than described

`atuned/server/wrangler.toml` and `atuned/server/README.md` in
`reboot-os`, on `main`, are the actual files this document is describing.
