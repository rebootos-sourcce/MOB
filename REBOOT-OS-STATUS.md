# The online build: what exists, what blocks it, what you decide

Written 27 September 2026 by the technical director seat, answering
`TASKS.md` round GX. Everything below was checked directly today against
`rebootos-sourcce/reboot-os` at commit `d23fff7` (branch
`claude/app-migration-decision-yx56cj`) and against GitHub's own record of
that repository's automated test runs. Where a number is an estimate, it
says so and says what it rests on.

Your words, 27 September: "I've been asking for, I don't know, a week now
for this to be an enterprise product. I said not a flat HTML file. I said
Supabase. That's a separate file."

## The short version

- **The online version is built.** A real server, a real database design,
  encrypted journals and sync between devices, in a second repository
  (`reboot-os`). The server's own tests pass 30 of 30, run today.
- **It is not live, and none of what stops it is code.** Three things: a
  final word from you on the provider, a database that has never been
  created on a real Cloudflare account, and GitHub refusing to run the
  repository's automated checks, which reads as a billing lock.
- **One more thing you should know before it goes live.** The server talks
  to the Atüned app in `reboot-os`. The MOB app you have been reviewing
  (`source.html`) has no code that talks to it at all. Which app goes
  online first is a decision, and it is yours.

## 1. What already exists and works

| What | What it means for you | Evidence |
|---|---|---|
| The server | A program on Cloudflare's machines that the app talks to: sign up, sign in, password reset, sync, consent, account deletion, export of a person's data, purchases, the morning reminder, a support console. 797 lines in six files | `atuned/server/src/` |
| The database design | Eight scripts that build the tables. The person's side follows the same record shape the app already uses, so the phone and the server agree on what a record is | `atuned/server/migrations/` |
| Journal encryption | The journal is locked on the phone with AES-GCM 256, a standard strong cipher. The key is locked under the PIN with 600,000 rounds of scrambling (PBKDF2). What it replaced: one unscrambled hash that broke a four digit PIN in under a second | reboot-os `fa7a0f8` |
| Encryption on the server | Every record is sealed on the server too, and the server refuses to store anything if its key is missing rather than store it readable | `atuned/server/src/seal.js` |
| Sync | The phone sends changes two seconds after a save and fetches on every open; the newer copy wins. Proven by filling a record, signing in as a second device and getting every list back identical | reboot-os `6cc0027` |
| Tests | 30 of 30 server tests pass, run today, offline against a local stand in for the database | `node --test test/*.test.mjs` |

What the tests do not prove: none of this has ever run against a real
Cloudflare database, because none exists yet (section 3).

## 2. Decision: Cloudflare or Supabase, and where

**You have ruled both ways, and the team needs one final word.**

- Their ruling 1201, marked "Proposed": "Hosting: Supabase, United States
  region, Postgres with row-level security... Any of these changes on one
  word from Lance."
- Their ruling 1216, the engineer who built it: "Cloudflare over others
  because the project already runs a Worker and D1 is SQLite like the
  canon... Any of them reversible on one word."
- You, 25 September (`DECISIONS.md:1386`): "I don't mind things being on
  Cloudflare for now since it's the easiest to work with." Recorded as
  "Cloudflare, for now, kept."
- You, 27 September: "I said Supabase."

**On "a separate file".** Both options are separate from the HTML file.
The server and database already live apart from the app, in their own
folder, on someone else's machines. Choosing Supabase is not what makes it
separate; that part is done either way.

| Path | What it costs | What you get |
|---|---|---|
| **A. Cloudflare, as built** | Nothing rebuilt. Live within about a day of work once access exists (estimate, based on the steps in section 5). Cloudflare's paid plan was about 5 US dollars a month when last checked; confirm before paying | Works today in tests. Its database is SQLite, a simpler engine. Who may see which rows is enforced by our server code, not by the database itself |
| **B. Switch to Supabase** | Redo real finished work: the database layer of the server, sign in, seven table scripts converted to Postgres, the 199 line sync client, and every test re proven. Estimate one to two weeks, based on about 1,500 lines of server, table scripts and tests plus the client. About 25 US dollars a month for the paid tier when last checked; its free tier pauses a project after a week idle | Postgres, a heavier database, with row-level security: the database itself refuses to hand one person's rows to another. A built in sign in service and a dashboard |
| **C. Cloudflare now, Supabase later if a reason appears** | Same as A today. A later move is copying data across, not a redesign, because the record shape is already fixed in one file | Live soonest, and the door stays open |

**My recommendation is A, or C if you want the door written down as open.**
Nothing the product needs today requires Postgres, and B spends one to two
weeks to arrive where A already is.

**Where the data lives.** The server is set to western North America
(`wnam`). This must be settled before the database is created: after that,
changing it means moving everyone's data. If your first real users are in
Europe, their data should probably sit in Europe, which is a legal
question as well as a speed one.

**PIN recovery**, once listed as the third blocker here, is answered by your
own ruling of 25 September (`DECISIONS.md:1371`): "the story is stored, for
recovery, never shared, and used only for modelling." The team confirms the
built version matches that before launch. Nothing needed from you.

## 3. The database was never created

The server has one line where its database's address goes, and it still
holds placeholder text:

    atuned/server/wrangler.toml, line 10
    database_id = "REPLACE_AFTER_wrangler_d1_create"

Creating it takes someone signed in to the Cloudflare account, about
fifteen minutes, one of two ways:

- **You run it.** One command, `npx wrangler d1 create atuned --location wnam`
  (the last word changes if you pick another region), and send the team
  the id it prints.
- **You give the team a key.** In Cloudflare, create an API token with
  permission to edit Workers and D1, and add it with your account id to the
  repository's secrets. The team does the rest.

Either way, one more secret is made once: `RECORDS_KEY`, the key that seals
every record on the server. **A copy must be kept somewhere outside
Cloudflare. If it is lost, every stored record is lost with it.** This is
the one step with no undo.

## 4. GitHub has stopped running the checks

This is an account problem, not an engineering one.

- Every run since 21:05 UTC on 24 September has failed, logged as 81 pushes
  on 25 September. Checked again today: the most recent server run started
  at 17:12:31 and ended at 17:12:33 with no steps run and no log. A real run
  installs a browser and takes minutes.
- The same tests pass when run by hand: 30 of 30 on the server today, and
  840 of 840 on the app per the last commit's own record.
- The one code cause, three tools pointing at a fixed folder path, was
  found and fixed on 25 September (`af0bf48`). The runs stayed red.

What this pattern usually means is spent Actions minutes, a spending limit
set to zero, or a failed payment. **Someone signed in as the account that
owns the repository (`rebootos-sourcce`) opens Settings, then Billing and
plans, and checks Actions usage and the payment method.** Nobody inside a
coding session can see or change that page.

Why it matters beyond a red mark: the automatic deploy to Cloudflare is
itself one of these runs. Until GitHub runs them again, a deploy has to be
done by hand from a machine, which works but loses the safety net.

## 5. Once those are cleared: how close it really is

**Waiting on you or on access, nothing else:**
- The provider and region word (section 2).
- Cloudflare access (section 3).
- GitHub billing (section 4).
- The exact domain. You said "attuned, I think it's .app or something"; the
  server is set to `atuned.app`, one t. Which is it?

**Ours, small, about a day once unblocked** (estimate):
- The deploy only runs from the `main` branch, and `main` does not contain
  any of this work yet; it sits on a side branch. Bring it onto `main`.
- Create the database, build the tables, set the sealing key, deploy, point
  the app at the live address, and lock the server to the app's own address
  (it currently accepts requests from anywhere, `ALLOWED_ORIGIN = "*"`).
- A first real sign up and sync against the live server.

**Ours, real work before real people's journals go on it, days not weeks**
(estimate):
- A wrong password at sign in signs the person out as if their session had
  expired.
- A new device sends "sharing off" on sign in, which can silently switch
  off a person's own sharing choice.
- Deleting or undoing an entry does not reach the server, so it comes back
  on the next sync.
- Anyone can register someone else's email address; there is no email
  check yet.
- The research copy of a person's records can be matched back to their
  account in one query, which makes the promise that it "cannot be walked
  back" untrue as built. Their backlog files this as your call: redesign
  it, or reword the promise.

**Not needed to go live:** payments. Store and Stripe keys wait on
developer accounts, and until then every account is set to the Growth tier.

## What I need from you

1. **Cloudflare or Supabase?** On 25 September you said "I don't mind things
   being on Cloudflare for now since it's the easiest to work with." On 27
   September you said "I said Supabase." A: Cloudflare as built, about a day
   to live. B: Supabase, one to two weeks of rebuilding to reach the same
   point, with the database itself guarding who sees what. C: Cloudflare
   now, Supabase later if a reason appears. The team recommends A or C.
2. **Where do your first real users live?** The server is set to western
   North America. The choices are US west, US east, or Europe. This is
   decided once, before the database is created; changing it later means
   moving everyone's data.
3. **Do you have a Cloudflare account, and will you run the one command or
   give the team a key?** About fifteen minutes either way (section 3).
   Also: where will you keep the copy of the sealing key, since losing it
   loses every record?
4. **Who can sign in to GitHub as `rebootos-sourcce` and check Settings,
   then Billing and plans?** Until that is cleared no automated check or
   deploy runs, whatever the code does.
5. **Which app goes online first?** The server already talks to the Atüned
   app in `reboot-os`. The MOB app you have been reviewing has none of that
   code, and the two apps calculate some numbers differently (29 places,
   `TASKS.md` AW7). The ways it could go: put the `reboot-os` app online
   first, soonest but not the one you have been reviewing; connect the MOB
   app to this server, several days of work porting the sync; or bring the
   two together first, the largest. Nothing about this is decided by
   default.
6. **The domain, spelled exactly.** `atuned.app` with one t, or something
   else?
