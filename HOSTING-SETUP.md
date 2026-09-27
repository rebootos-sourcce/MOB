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

## What happens after

Once the D1 database exists and `AW1` is proven in `reboot-os`, the
sign in shell already built in this repository (`atuned_src/ui/account.js`)
has a real place to send its call. Today it refuses honestly, "Accounts
are not live yet," because there is nothing to call. That line comes
out the day this document's steps are done and the two open items
above are answered, not before.
