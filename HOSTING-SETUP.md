# Hosting setup, steps for him

Written at round JN, his words: "Give me my steps to setting it up on
hosting and cloudflare and a document." These are the steps he takes
himself, in a Cloudflare account only he can create, plus the one
question this repository still needs answered before the server side
can be built.

**Where this splits.** This repository (`MOB`) is the engine and the
one file build. The server, the database and the deploy workflow live
in a different repository, `reboot-os`. This session cannot see or
touch that repository right now, so the steps below are accurate about
what Cloudflare itself requires, but the exact commands and file paths
inside `reboot-os` are named from `PRIORITY.md`'s own reading of it,
not verified fresh here. If he wants a session to actually build the
database connection rather than only write these steps, that session
needs `reboot-os` added to it.

## What is already decided

**Cloudflare, for now, kept.** His words, recorded in `DECISIONS.md`,
"The stack": "I don't mind things being on Cloudflare for now since
it's the easiest to work with." Cloudflare Pages hosts the site, on
the same account and platform as the database, and a push to the right
branch deploys it. One DNS record points the domain at it.

**The domain.** `atuned.app`, spelled A-T-U-N-E-D, confirmed at round
HD. `reboot-os`'s server already carries this spelling.

**The one afternoon task, already scoped.** `PRIORITY.md` names it
`AW1`: create the D1 database, set `ATUNED_API`, prove one record
round trips from the client, and point the deploy workflow at the
branch that has `atuned/`. It is rated medium effort, and the note
beside it reads: "his region and provider ruling, never given. If he
rules Cloudflare, it is one afternoon." Cloudflare is now named. The
region is the one piece still missing.

## What is still open, and why it is not skipped

- **Which product goes online first**, this engine or the Atüned app
  in `reboot-os`. `BACKLOG-AUDIT.md` section 2.1, item 3. Asked six
  times, never answered.
- **The repository's own visibility.** `MOB` is still public. A real
  secret, `RECORDS_KEY` or `ATUNED_API`, committed into a public
  repository is exposed the moment it lands, not after. This is why no
  key has been generated yet on this side.
- **The data region**, part of stage zero accounts, `BACKLOG-AUDIT.md`
  section 2.1 item 6. Cloudflare asks for this when a D1 database is
  created and it is not reversible without moving the database.

None of these block him doing the account level setup below. They
block only the moment a real secret would be typed into a real file.

## Steps, in order

### 1. The Cloudflare account

1. Create a Cloudflare account, or confirm the one already in use for
   `reboot-os`'s deploys is the one to keep building on.
2. Under that account, confirm billing is set up in the company's own
   name, not a personal card, per `BACKLOG-AUDIT.md` section 2.1 item 6.
3. Pick the data region for anything stored there. Cloudflare asks for
   this at database creation and it is a one time choice per database.

### 2. The domain

1. `atuned.app` needs its nameservers pointed at Cloudflare. This is
   done from wherever the domain is currently registered, by changing
   its nameserver records to the two Cloudflare gives after the domain
   is added to the account.
2. Cloudflare then manages DNS for the domain. A single record (a
   `CNAME` for Cloudflare Pages) is what actually points the domain at
   the deployed site, added after step 3 below.

### 3. Cloudflare Pages, the hosting

1. Create a Cloudflare Pages project connected to the `reboot-os`
   repository (GitHub authorization, the same one already granted and
   confirmed working per `DECISIONS.md`, "Push access").
2. Point the deploy at the branch that carries the `atuned/` build,
   per `AW1`.
3. Once the first deploy succeeds, attach the `atuned.app` domain to
   the Pages project. Cloudflare writes the DNS record itself when a
   custom domain is attached this way.

### 4. The database

1. Create a D1 database on the same Cloudflare account, in the region
   chosen in step 1.
2. Generate `RECORDS_KEY`, the encryption secret for a person's stored
   record. This is generated once and never regenerated: losing it
   loses every record encrypted with it. It is set as a Cloudflare
   environment secret on the Pages project, never committed to a
   repository, public or private.
3. Set `ATUNED_API`, the same way, as a Cloudflare environment secret.
4. `AW1` then proves one record round trips: a client call writes a
   record, a client call reads it back, byte for byte.

### 5. What this repository still needs from him before any of this touches `MOB`

- Which product goes online first (this engine, or the app already in
  `reboot-os`), since that decides which one's sign in this database
  actually serves first.
- Whether `MOB` goes private. It does not have to, to do the steps
  above; it has to, before any code in this repository ever reads a
  real key.

## Plain answers, round JP

He said the region question had no context, and he was right: a
question with no context is exactly what round JK's rule exists to
catch, so this is answered properly rather than re-asked.

**What a region actually is.** Cloudflare runs its computers in
buildings all over the world. A database has to physically sit in one
of them. "Region" just means: which building, roughly, which country
or continent. It changes two things and two things only:
1. **Speed.** A person in the same part of the world as the database
   gets a faster response. A person on the other side of the planet
   waits a little longer.
2. **Law.** Some countries require certain kinds of personal data to
   stay inside their own borders. A therapy-adjacent record, which this
   product's own record is, is exactly the kind of data this can apply
   to.

There is no wrong answer that breaks anything today. The two sane
choices, given the product is in English and its first real users are
almost certainly American: **United States**, or, if he wants to
leave room for a European customer base later without moving anything,
**one of Cloudflare's regions inside the EU.** If he has no reason to
care yet, United States is the plain default and it can be said out
loud as exactly that: pick United States for now.

**Where the line sits between GitHub and Cloudflare.** GitHub holds
code. It is a filing cabinet: it stores every version of every file
and remembers the history, but it does not run anything and nothing
lives on a webpage because it is in GitHub. Cloudflare is the part that
takes code out of that filing cabinet and actually runs it where a
browser can reach it, plus it holds the database, the actual person
records. The two are connected by exactly one thing: Cloudflare Pages
watches a GitHub repository, and every time new code is pushed to the
right branch, Cloudflare automatically takes it and puts it on the live
site. Nothing else crosses between them.

**What needs to be hooked up now, and where.** Nothing in this
repository (`MOB`) needs hooking up today; it produces the one file
build and nothing here calls a network. The hookup happens entirely in
`reboot-os`: that repository gets connected to a Cloudflare Pages
project (step 3 above), and a D1 database gets created on the same
Cloudflare account (step 4 above). That is the whole hookup. Nothing
else needs wiring for the sign in shell already built here to have
somewhere real to send its call.

**What from ElevenLabs or another API is needed.** ("11 labs" is
ElevenLabs, a company that turns text into a spoken voice, is heard
correctly here.) Nothing from them is needed to finish the steps
above; hosting and the database do not touch voice at all. It only
becomes relevant for one specific, already-named piece: the release
protocol's opening line is currently a placeholder that says, in
effect, "his recorded voice goes here" (`atuned_src/ui/release.js`,
round JF). Two ways to fill that in:
- **Record it himself,** in his own voice, and the file gets played
  back. No API, no account, no cost, and it is his own voice, which is
  what the design already calls for.
- **Or generate it with a service like ElevenLabs,** which needs an
  account there and an API key, the same kind of secret as
  `RECORDS_KEY` above: never committed to a public repository, set only
  once a real place exists to hold it.

Recording it himself is the simpler path and needs nothing from
Cloudflare or any other account at all.

## What happens after

Once the D1 database exists and `AW1` is proven in `reboot-os`, the
sign in shell already built in this repository (`atuned_src/ui/account.js`)
has a real place to send its call. Today it refuses honestly, "Accounts
are not live yet," because there is nothing to call. That line comes
out the day this document's steps are done and the two open items
above are answered, not before.
