# Hosting setup, steps for him

**Done, his own words, round LV: "steps 3 and 4 complete. git and cloud
setup."** All four things in the section below are now done: the
Cloudflare account, the D1 database, the two GitHub secrets, and the
Worker's own `RECORDS_KEY`. The next push to `main` on `reboot-os`
migrates and deploys the Worker automatically. Kept below as a record
of how it was done and what each piece is, not as a live checklist any
more.

## Going live: atuned.world, round LW

His ruling: "the engine needs to be online, the engine is the focus...
the landing page is the funnel, Atuned is a destination, the user has
to go through their funnel in order to get to Atuned... the most
important part is to get everything up on atuned.world so that we're
live." This is `MOB`'s own deploy, a different repository and a
different Cloudflare product (Pages, not the Worker `reboot-os` uses),
and it is new: nothing about it existed before this round.

**What's built and waiting.** `.github/workflows/deploy.yml`, in this
repository, builds the engine and the funnel on every push and deploys
both to one Cloudflare Pages project. The address each page lands at is
not invented for this: `funnel/BUILD-single.sh` already names the door
from the quiz to the app `atuned.html`, the same name the handover rule
elsewhere in this document already gives `source.html` when it is sent
to him, so a build sent as one file and a build served as one file
share a name. `atuned-funnel.html` is also copied to `index.html`, so
`atuned.world` itself opens on the funnel. Until the two secrets below
exist, the workflow builds and stops, the same shape the server
workflow already uses.

**Three things left, only he can do them.**

1. **Create the Cloudflare Pages project.** In the Cloudflare dashboard
   (`dash.cloudflare.com`, the same account as everything else here),
   click **Workers & Pages** in the left sidebar, then **Create**, then
   the **Pages** tab, then **Upload assets** (sometimes labelled
   **Direct Upload**). Name the project exactly `atuned`, lower case,
   since the workflow's own `--project-name` flag is written to match
   that name exactly. It will ask for a first upload to create the
   project: any single small file works as a placeholder, the real
   site arrives on the next push once the secrets below exist.
   (Cloudflare's own screens move; if "Upload assets" is not there,
   the dashboard's own search box, typed with "Pages", finds the
   create flow.)
2. **Add two secrets to `MOB`'s own GitHub repository.** These are a
   second copy of the same idea as `reboot-os`'s two secrets, in a
   different repository, since GitHub keeps a repository's secrets to
   itself.
   - `CLOUDFLARE_ACCOUNT_ID`: the same value already used for
     `reboot-os`, copied from the Cloudflare dashboard's own overview
     page (right side, a box labelled "Account ID", a copy icon beside
     it).
   - `CLOUDFLARE_API_TOKEN`: this one needs a different permission than
     the `reboot-os` token carries, **Cloudflare Pages: Edit**, so it
     is a new token rather than a reused one. Same path as before:
     profile icon, top right, **My Profile**, **API Tokens** tab,
     **Create Token**, **Create Custom Token**, one permission row,
     `Account`, `Cloudflare Pages`, `Edit`, **Continue to summary**,
     **Create Token**, copy it, it shows once.
   Then, in `github.com/rebootos-sourcce/MOB` (not `reboot-os`, the
   other one this time): **Settings**, **Secrets and variables**,
   **Actions**, **New repository secret**, once for each name above,
   pasting the matching value.
3. **Point `atuned.world` at Cloudflare.** The domain is registered at
   GoDaddy and parked, confirmed round KJ/KK, which means Cloudflare
   does not yet control its DNS. In the Cloudflare dashboard, **Add a
   domain** (or **Add site**), type `atuned.world`, and Cloudflare
   assigns it two nameservers, a pair of addresses ending in
   `.ns.cloudflare.com`. At GoDaddy, in the domain's own DNS or
   Nameservers settings, replace GoDaddy's nameservers with those two.
   This can take up to a day to take effect, sometimes minutes. Once
   Cloudflare shows the domain as active, open the `atuned` Pages
   project's own **Custom domains** tab and add `atuned.world` there;
   Cloudflare wires the rest.

**How to know it worked.** Push anything to this repository's working
branch, or wait for the next push, then open the **Actions** tab on
`github.com/rebootos-sourcce/MOB` and click the newest `deploy` run.
Before the two secrets exist, it builds and stops. With both in place,
it also deploys, and the run's own log names the Pages URL it shipped
to. Once step 3 is also done, that same build answers at
`atuned.world`.

Written at round JN, rewritten at round KR once `reboot-os` was actually
read rather than guessed at, checked again round LR against the real
`origin/main` rather than the stale local checkout this session had been
reading. These were the steps he took himself, in a Cloudflare account
only he could create, and the things in that repository that were still
open.

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

**The database is created.** Checked directly against `origin/main`
round LR, not assumed from an old copy: `wrangler.toml` line 10 carries
a real id, `70031c42-615b-465b-92a5-9d3340847ec5`, not the placeholder.
Commit `ee73363`, "Update wrangler.toml", 27 September. Step 2 below is
done. Eight migration files already exist (`atuned/server/migrations/0001`
through `0008`) and apply automatically now that the id is real.

## The three things left, only he can do them

1. **Create or confirm the Cloudflare account.** Same one already used for
   the Worker setup screens he's been sending screenshots of. Confirmed
   round LS from his own Version History screenshot, `atuned-api`, five
   deployments in the last day, all his own name. Done.
2. ~~Create the D1 database and paste its id into `wrangler.toml`.~~ Done,
   see above, and confirmed a second time round LS: the same screenshot's
   top row is that exact change, "Update wrangler.toml added CloudFlare
   ID Key for D1 - Database (SupaBase) for Atuned," committed by him.
3. **Add the two GitHub secrets named above**, `CLOUDFLARE_API_TOKEN` and
   `CLOUDFLARE_ACCOUNT_ID`, to the `reboot-os` repository (not `MOB`).
4. **Set the Worker's own secrets**, which never live in any repository,
   starting with `RECORDS_KEY`, the one that matters first.

Walked through step by step below, round LS, since the summary above was
not enough to act on by itself.

## Step 3, done in full, click by click

This step has two halves: getting two values out of Cloudflare, then
pasting them into GitHub. Fifteen minutes, no coding.

**Half one. Get the two values from Cloudflare.**

1. Go to `dash.cloudflare.com` and log in. Same account as the
   screenshot in round LS.
2. Look at the main screen. Cloudflare shows an "Account ID" somewhere
   on this page, usually on the right side of the Workers & Pages
   overview, next to a small copy icon. Click the copy icon. That copied
   text is the value for `CLOUDFLARE_ACCOUNT_ID`. Paste it somewhere safe
   for a minute, a notes app is fine, nothing permanent.
   (Cloudflare moves this box from time to time. If it is not on the
   right side of the overview page, the search box at the top of the
   dashboard, typing "Account ID," finds it.)
3. Click your profile icon, top right corner of the page.
4. Click "My Profile."
5. Click the "API Tokens" tab.
6. Click "Create Token."
7. Scroll down and click "Create Custom Token" (not one of the
   ready-made ones above it).
8. Give it a name, anything recognisable, for example
   `reboot-os deploy`.
9. Under "Permissions," add two rows. Each row is three dropdowns:
   - Row one: `Account`, `Workers Scripts`, `Edit`.
   - Row two: `Account`, `D1`, `Edit`.
   Click "+ Add more" to get the second row.
10. Under "Account Resources," leave it on "Include" and choose the one
    Cloudflare account in the next dropdown.
11. Click "Continue to summary," then click "Create Token."
12. Cloudflare shows the token exactly once, on this screen only. Copy
    it now. That is the value for `CLOUDFLARE_API_TOKEN`. If the page is
    closed before it is copied, the token cannot be recovered and a new
    one has to be made; nothing is broken, just repeat steps 6 through
    12.

**Half two. Put the two values into GitHub.**

1. Go to `github.com/rebootos-sourcce/reboot-os`. Not `MOB`, the other
   one, `reboot-os`.
2. Click "Settings," in the row of tabs near the top of the repository
   (Code, Issues, Pull requests, Actions, ... Settings). This needs
   admin access on the repository; if that tab is missing, the signed
   in account is not an admin on `reboot-os` and someone who is has to
   do this part, or add admin access first.
3. In the left sidebar, click "Secrets and variables," then click
   "Actions" underneath it.
4. Click the green "New repository secret" button.
5. Name field: type `CLOUDFLARE_API_TOKEN`, exactly that, capital
   letters and underscores included. Value field: paste the token from
   half one, step 12. Click "Add secret."
6. Click "New repository secret" again.
7. Name field: type `CLOUDFLARE_ACCOUNT_ID`, exactly that. Value field:
   paste the account id from half one, step 2. Click "Add secret."

**How to know it worked.** A secret's value never shows again once
saved, on purpose, so there is nothing to read back and check. Instead:
push anything to `main` on `reboot-os`, or wait for the next push, then
open the "Actions" tab and click the newest run. Before these two
secrets existed, every run stopped after its tests. With both secrets
in place, the same run continues past tests into a migrate step and a
deploy step, and finishes green. That is the confirmation.

## Step 4, done in full, click by click

This step needs a terminal, a plain text window that runs commands
instead of clicking buttons. It only has to be done once, ever, for
`RECORDS_KEY`, because it is never allowed to change once real records
exist under it.

**No `git` needed for this step.** The first version of this document
said to clone the whole `reboot-os` repository first. That was more
than this step actually needs, and it broke on a computer with no
`git` installed, a Windows PowerShell window reading "git is not
recognized." Fixed here, checked against the tool's own instructions:
`wrangler secret put` takes the Worker's name directly on the command
line, `--name atuned-api`, so nothing has to be downloaded or cloned
first.

1. Open a terminal.
   - On a Mac: press Cmd and Space together, type `Terminal`, press
     Enter.
   - On Windows: press the Windows key, type `PowerShell`, press Enter.
2. Check Node.js is installed. Type `node -v` and press Enter. A
   version number like `v20.11.0` means it is installed; an error means
   it is not, and it has to be installed first from `nodejs.org` (the
   big green button, the LTS version).
3. Log the deploy tool into the Cloudflare account. Type:

       npx wrangler login

   The first run downloads the tool itself, which takes a moment, then
   a browser window opens asking to approve access. Click "Allow." This
   is the same Cloudflare account confirmed in round LS.

4. Generate the secret's value. This is the exact line the server's own
   files carry for it, `atuned/server/wrangler.toml`, quoted rather than
   invented: thirty two random bytes, so nobody, including him, has to
   remember or type a password for it. Type:

       node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"

   It prints one line of random looking letters and numbers. That is
   the value.

5. Before anything else, save that value somewhere outside Cloudflare, a
   password manager or a note kept safe. This is the one piece that
   cannot be recovered: it is never shown again, Cloudflare only stores
   it encrypted, and every record saved under it is unreadable forever
   if it is lost.

6. Set the secret. Type:

       npx wrangler secret put RECORDS_KEY --name atuned-api

   It asks for a value. Paste the line from step 4 and press Enter.
   `atuned-api` is the Worker's own name, written in `wrangler.toml`;
   passing it this way is what makes step 3 in the old version of this
   document, cloning the whole repository, unnecessary.

7. Done. The Worker now has the key it needs to seal every stored
   record. Nothing else has to happen for sync to start working once
   the two GitHub secrets from the "Step 3" section above are also in
   place.

Everything else the README lists as a secret (`VAPID_PUBLIC`,
`VAPID_PRIVATE`, `RESEND_KEY`, `ADMIN_KEY`, the Apple and Google store
keys) is only read by features not turned on yet, push notifications,
password reset by email, the support console, store purchases, and can
wait until those are actually being built and switched on.

Once the two GitHub secrets exist, the next push to `main` migrates and
deploys the Worker automatically, since the database id is already real.
Nothing in this list needs a code change from this side any more.

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
Sent alongside this one, pulled fresh off `origin/main` round LR rather
than any local copy, so what he opens matches what is really there.
