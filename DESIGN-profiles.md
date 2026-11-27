# Profiles and practitioners, designed three times

Three architectures for the person's profile, the practitioner's panel, the
grant that joins them, and the schema underneath. They are not one design with
options. They differ on one question, and everything else follows from the
answer: **where the join between a name and a story is allowed to exist.**

Every claim about what the code does today cites a file and a line. Every claim
about what a person or a practitioner wants cites the panel work in
`RESEARCH-icp.md` or `DESIGN-mobile-icp.md` rather than asserting it. Nothing
here is built and nothing else in the repository was touched.

What this settles: the shape of the profile, the shape of the practitioner
panel, the invitation in both directions, the scope of a grant, revocation, and
the field names. What this does not settle: the four items in section 10, which
are the owner's and which each design is built to accept either way.

---

# 0. What exists today

## 0.1 The profile object

`atuned_src/engine/schema.js:13` sets `SCHEMA_V=2` and `PKEY='source.profiles'`.
`blankProfile` at `schema.js:14` is the whole of what a person is to this
product:

| Block | Line | What it holds |
|---|---|---|
| `v`, `id`, `name`, `created`, `updated` | `schema.js:15` | identity of the record, not of the person |
| `soul` | `schema.js:17` | domains, archetypes, roots. the invariant |
| `axes` | `schema.js:18`, filled `:41` | nine poled child fetters, `held` and `opp` |
| `who` | `schema.js:23` | first, middle, last, sex, and the birth moment |
| `seed` | `schema.js:25` | a stated four letter type, null until stated |
| `meter` | `schema.js:36` | `lines`, `unique[]`, `first`, `last` |
| `laws` | `schema.js:37` | 21 laws, null until measured (`:42`) |
| `intake` | `schema.js:37` | 63 answers, `done`, `startedAt`, `completedAt` |
| `gates` | `schema.js:38` | the VERP mix and the lean, added in v2 |
| `story.entries` | `schema.js:40` | the log of stories, written at `ui/storyui.js:31` |
| `rituals`, `history` | `schema.js:40` | the ritual log, and the derived snapshots |

Storage is the person's own browser. The engine ships a no operation store
(`schema.js:90`) and the host binds `localStorage` through `bindStore`
(`schema.js:93`, bound at `ui/ui.js:401` to `:403`). `pPersist` refuses to claim
a write it cannot make (`schema.js:99`), and `saveState` reports it
(`schema.js:104`).

`validateProfile` at `schema.js:130` is the boundary. It builds a blank and
copies named fields onto it (`schema.js:134`), so **a field the boundary does
not name is silently dropped**. That fact governs every schema proposal below.

`meterRead` at `schema.js:271` computes the gift (`:278`), the horizon estimate
and its ten percent swing (`:280` to `:282`), the six markers (`:284`) and the
next one only (`:288`). `MARKERS` at `schema.js:258` holds six distances.
`meterFirst` at `schema.js:299` records a dated first.

## 0.2 The profile sheet

`profileSheet` at `ui/panels.js:264`, opened from the person icon at
`shell/body.html:22` onto the one sheet surface at `body.html:30`. Four blocks:
this reading (`panels.js:268` to `:273`), density (`:275`), your record (`:278`)
and close (`:283`). It prints coherence, the coherence band, addresses carrying
of 112 (`:271`), ground opened, the next marker, snapshots on file, and whether
storage is writing or blocked (`:281`).

It says, at `panels.js:279`: "Everything is held in this browser. Nothing has
left this device." **That sentence is the thing every design below has to keep
true, or replace with a sentence that is true.**

`DESIGN-ia.md:559` to `:682` specifies this sheet as it should stand, including
the rows the accounts fork adds: sign in (`DESIGN-ia.md:616`), the key (`:622`),
practitioner grants (`:628`), tier and allowance (`:644`), notifications, and
data with export and delete (`:666`). This document does not replace that
specification. It designs the two things section 4 of that document names and
cannot hold: the grant system, and the practitioner's own panel
(`DESIGN-ia.md:735` to `:740`).

## 0.3 Two defects found while reading, before any design

**`meter.firsts` is dropped by the boundary.** `meterFirst` writes it
(`schema.js:306`), `meterRead` returns it (`schema.js:293`), and the meter block
of `validateProfile` copies only `lines`, `unique`, `first` and `last`
(`schema.js:194` to `:201`). Every dated first is lost through `pImport`. The
dated first is described at `schema.js:291` as the only achievement shape this
product allows, and it does not survive an import. Small, and it is a boundary
bug rather than a design question.

**The paid ladder has no word.** `DESIGN-ia.md:362` rules that tier is the
coherence band and nothing else, and `:371` reserves the problem: the accounts
fork needs that word and cannot have it. The profile sheet is where the
collision lands, because the coherence band (`engine/compute.js:137`) and the
paid ladder (`DECISIONS.md:17`) appear in the same sheet, four rows apart. Every
design below therefore uses **plan** for what is bought, **tier** for the
coherence band, and **allowance** for the monthly count of new ground. That is a
proposal, not a ruling.

---

# 1. What a person wants in their profile

Researched, not asserted. The panel is nine simulated ICPs in `RESEARCH-icp.md`
weighted 1,000 and re run against five mobile layouts in `DESIGN-mobile-icp.md`.
Each row below is a request a named panel member made, and the row it becomes.

| Who | What they asked for | Where | The row it becomes |
|---|---|---|---|
| Diane, 46 | "What moved since Tuesday. I have asked in five passes." | `DESIGN-mobile-icp.md:656` | **The delta.** Last reading against this one, one line |
| Diane | "A number and a cost" | `RESEARCH-icp.md:186` | The cost line, under the reading |
| Derek, 39 | Runs the ladder arithmetic unprompted and reads a subscription with no end | `RESEARCH-icp.md:321` to `:331` | **Allowance and horizon, never adjacent without the collapse story** |
| Marcus, 44 | "Give me a claim specific enough to be wrong" | `RESEARCH-icp.md:192` | Identification and its interval, on the sheet, always |
| Marcus | The anatomy is precision as costume unless framed as a coordinate system | `RESEARCH-icp.md:275` | One sentence on what the seats are |
| Angela, 36 | Closed the product at the word Incoherent and told the group chat | `RESEARCH-icp.md:306` | Mechanical band words, no moral adjective anywhere in the sheet |
| Sofia, 41 | "Who else can see a client's record. It is the only thing between you and my recommendation" | `DESIGN-mobile-icp.md:646` | **The sight list, and it is the highest value row in the sheet** |
| Sofia | "The question is who can ask for it and get it" | `RESEARCH-icp.md:343` | Retrieval rule, stated. Not a promise, a mechanism |
| James, 57 | Wants a rank against peers, and is refused | `RESEARCH-icp.md:203`, `:218` | **No comparison row. Ever.** He is 100 of 1,000 and would corrupt his own reading |
| Ana, 47 | "Will it tell me this has an end" | `RESEARCH-icp.md:250` | The ladder as distance, next marker only |
| Ana | "Nobody is reading them but me" | `RESEARCH-icp.md:153` | The stories row says where the story text is held |
| Sofia, Ana | Resumable, interruptible, does not lose work | `RESEARCH-icp.md:145` | Storage state row, which already exists at `panels.js:281` |

**The nine rows that fall out.** In this order, because the order is the
argument.

1. **Your reading.** Coherence, the band in mechanical words, addresses held of
   112, the cost line, and the delta. Five values, one of which does not exist
   in the code today.
2. **What the instrument knows.** Identification and its interval, from
   `accuracy` at `engine/compute.js:176`. Marcus and James both move from
   resistance to hold when this is shown (`RESEARCH-icp.md:301`).
3. **Your record.** Snapshots on file, storage state, ground opened, lines
   spoken with reruns stated free, rituals saved, dated firsts.
4. **The ladder.** The next marker as a distance. Six markers exist at
   `schema.js:258` and nothing in the product shows one.
5. **Your plan and allowance.** What the plan sees, new ground this month
   against the allowance, reruns free, the gift of 100 remaining
   (`schema.js:278`).
6. **Your key.** Masked, reveal, copy, and the one sentence that it is not held
   beside the name (`DECISIONS.md:112`). Specified at `DESIGN-ia.md:622`.
7. **Who has sight.** The grant list. Empty state: "Nobody has sight of your
   record."
8. **Your device.** Density, theme, legible, motion. Three of those four do not
   persist today (`ui/panels.js:129`, `:136` set no store; density does, at
   `panels.js:241`).
9. **Your data.** The promise in one sentence, that the record and the story are
   never held together, export (exists at `ui/intakeui.js:153`), import (built
   at `schema.js:310`, no control anywhere) and delete (does not exist).

**What no design adds.** A rank, a streak, a badge that is not a dated fact, or
a leaderboard. One panel member wants a rank and the study refuses him by name
(`RESEARCH-icp.md:218`). A marker is a distance and never a trophy
(`schema.js:255`).

---

# 2. What a practitioner wants

One panel member is a practitioner: Sofia, 41, weight 140, and she is the
highest value entry in the roster because she brings clients
(`RESEARCH-icp.md:349`). She has two jobs and they are different products.

**Job one, in session, on a client's phone.** "In session I need one image and
one sentence" (`DESIGN-mobile-icp.md:142`). "I open the wheel and lift a sheet
on one address and read the client the seat and the plexus"
(`DESIGN-mobile-icp.md:642`). Knowledge is how she works, and moving it behind
an overflow control ends her recommendation (`DESIGN-mobile-icp.md:496` to
`:503`).

**Job two, at night, alone.** "Eleven at night, last client gone, in bed"
(`DESIGN-mobile-icp.md:139`). "Tell me what to run and how long it takes"
(`RESEARCH-icp.md:244`).

**What she will not do.** "I will not put a client in front of a screen that
asks whose field this is before it asks anything about them"
(`DESIGN-mobile-icp.md:152`). The persona selector at `shell/body.html:11` is
the control she means, and `DESIGN-ia.md:604` already rules it the first thing
removed when sign in lands.

**What gates everything.** "Who else can see a client's record. That is not a
layout problem and it is still the only thing between you and my
recommendation" (`DESIGN-mobile-icp.md:646`). And: "You are telling me you will
never sell it. I believe you. That is not the question. The question is who can
ask for it and get it" (`RESEARCH-icp.md:343`).

That is the sharpest finding in the whole panel for this document. **A promise
does not answer her. A retrieval mechanism answers her.** Every design below is
graded first on whether it can be described to Sofia in one sentence that is
mechanically true.

**The practitioner's own rows, ruled at `DECISIONS.md:119` to `:133`.** A
practitioner is also a coach. They get a panel listing their clients down the
right side (`:121`). Either side can start it (`:124`). The person whose data it
is gives consent (`:125`). Partial information is first name, last name, date of
birth, what has been released, what has not, the structure, and the stories
(`:127`). Access is by the person's key, scoped to their plan data (`:131`).
Whether it is the plan scope or all of it is open (`:133`).

From that plus her two jobs, the practitioner panel is six things:

1. **The roster.** One row per client. Name as the practitioner knows them,
   last reading, the delta, the heaviest seat, and the grant state.
2. **One client, opened.** The structure: nine axes held and installed, the 21
   laws, the soul, the coherence band. This is the wheel and the rails the app
   already renders, pointed at somebody else's numbers.
3. **Released and not released.** `meter.unique` against the addresses held.
   This is the one thing the app computes today that answers "is this person
   doing the work" without a report from them.
4. **The stories**, at whatever fidelity the grant allows. This is the row where
   the three designs diverge most.
5. **What to run.** The release queue for this client, and its duration. The
   engine already picks the seats (`ui/personas.js:246`).
6. **Her own notes**, which are hers, never the client's record, and never
   visible to the client unless she sends them.

**What a practitioner must not get.** A roster wide export, a search across
people who have not granted sight, a comparison between clients, or any way to
read a client after revocation. The first three are the shapes that turn a
consent list into a list.

---

# 3. The constraint, written as a test

`DECISIONS.md:234` to `:249` is the strongest ruling in the file. Restated as
four tests, so a design can pass or fail rather than be argued about.

**T1. The name never leaves the device.** `DECISIONS.md:110`. A key replaces it
(`:112`), and records are never looked up by name (`:112`).

**T2. The record is never held joined to the story.** `DECISIONS.md:243`. The
record identifies, the story does not, and we do not hold the two together.

**T3. The story without the record is what refines the models.**
`DECISIONS.md:245`. A story with a person attached is somatic and psychological
self report about a named human and we do not hold that.

**T4. A grant of sight is explicit, listed, revocable, and never a default.**
`DECISIONS.md:125` puts consent with the person whose data it is, and
`CLAUDE.md` adds the rest: explicit consent, a visible list of who has sight,
revocation, and never a silent default.

**The collision inside the ruling itself, and it must be named rather than
quietly relaxed.** `DECISIONS.md:110` says the name never leaves the device.
`DECISIONS.md:127` says a practitioner sees first name, last name, date of
birth and the stories. Those two sentences cannot both be true of a system where
the practitioner's view is served from a store we operate. They can both be true
of a system where the person's device hands the practitioner the name directly
and we carry only ciphertext. **So the ruling is not self contradictory, it is a
specification of where the join is allowed: inside a device, never inside our
store.** Design one is built on that reading. Designs two and three take the two
other available readings, and each says plainly what it gives up.

One more standing constraint, from `CLAUDE.md`: the app gains network at exactly
one seam, and there is no `fetch` in `engine/`. `atuned_src/hostfree.py:11`
enforces the second mechanically. Every design below puts its network code in a
new `ui/` module and injects it into the engine the way `bindStore` already does
at `schema.js:93`, because that seam is already the shape this codebase uses for
a host capability.

---

# 4. Design one. The sealed envelope

**One sentence for Sofia:** nobody can ask us for a client's record and get it,
because we cannot read it either; the person's own device encrypted it to your
key before it left their hands.

## 4.1 Architecture

The store is blind. Three collections, all opaque to the operator.

    record      one row per quiz taker. rk = hash(email, pepper).
                value is ciphertext of the 1.1 KB quiz record.
                TASKS.md:109 measures it at 512 bytes gzipped.
    envelope    one row per live grant. addressed to a practitioner key hash.
                value is ciphertext of the share bundle the person built.
    corpus      stories with no record attached. no key, no rk, no grant id.
                this is T3, and it is a separate collection so the join
                cannot be made by a query.

The person holds a key pair. The secret half is derived from the key at
`DECISIONS.md:112` and never transmitted. The public half is published beside
the key hash so a counterparty can wrap to it.

The join between a name and a story exists in exactly two places: the person's
device, and the device of a practitioner the person chose. It never exists in
the store, so it cannot be produced by a subpoena, a breach, an employee, or a
future product decision. The key is what unlocks a record in an emergency
(`DECISIONS.md:113`) and the key is held by the person, which is what that
sentence already says.

The engine stays host free. Encryption is `crypto.subtle`, a host API, so it
lives in a new `ui/crypto.js` and the engine receives it the way it receives
storage: `bindSeal(seal, open)` beside `bindStore` at `schema.js:93`. The engine
computes what goes in the envelope, the host seals it, and neither knows the
other's business.

## 4.2 The flows

**Sign in and claim, once.** The person enters their email. A one time code goes
to the address. The code, not the address, retrieves the record. `TASKS.md:137`
already rules this not optional and the panel confirms it commercially:
`RESEARCH-icp.md:500` records James refusing to hand an address to a stranger
for a number he was already promised. The record arrives, passes
`validateProfile` (`schema.js:130`), and a failure names the refused field
through `importError` (`schema.js:324`). After the claim the profile is local
again and the sheet's sentence at `panels.js:279` becomes: "Everything is held
in this browser. One record came down when you signed in. Nothing goes back up
unless you send it."

**The person adds a practitioner.** The practitioner gives a practice code, in
person, on a card, in a booking email. Ours is not a directory and cannot be
searched, which is what stops a grant system becoming a list.

    1  Sheet, Who has sight, Add a practitioner. Enter the practice code.
    2  The app fetches that code's public half and display name only.
    3  The scope sheet. Every line is a checkbox, all off by default.
         First and last name              off
         Date of birth                    off
         The structure, nine axes and 21 laws      on by default
         What is released, and what is not         on by default
         The stories                      off, and it says what full text means
       One line above it, in the house voice: this is somatic and psychological
       self report about you, and it does not come back once it is sent.
    4  Give sight. The button is not primary until at least one box is on.
    5  The device builds the bundle, seals it to their key, writes one envelope,
       and the row appears in the list as live with today's date.

Four taps from the sheet, one of them a deliberate scope pass. That is the
minimum viable interaction for a consequential grant: shorter would be a dark
pattern and longer would not be finished.

**The practitioner adds a person.** The practitioner enters the person's key, or
sends a link carrying their practice code.

    1  The practitioner's panel writes a request envelope addressed to the
       person's key hash. It carries the practice code and the display name and
       nothing else. It cannot carry data, because the practitioner has none.
    2  The person's app, at next open, shows one row in the sheet: a request,
       who from, and Review. The status region says it once, politely, through
       status() at ui/component.js:90. There is no badge on a tab and no
       interruption of a reading.
    3  Review opens the same scope sheet as above, with the same defaults off.
       The practitioner may mark lines as requested. A request is a request and
       it does not pre tick a box.
    4  Nothing is shared until the person taps Give sight. Declining leaves no
       trace on the practitioner's panel beyond the row going quiet, because a
       decline that reports itself is pressure.

**What keeps the envelope current.** The person's device re seals on a schedule
they set per grant: on every save, daily, or only when they press Send. Default
is daily. A practitioner opening a stale row sees the date of what they are
reading, in the row, always. A chart with no date is the lie this codebase
forbids by name.

**Revocation.** One tap on the row. Immediate. The envelope is deleted, the
grant state becomes revoked with a date, and the practitioner's panel loses the
row on its next open and wipes its local copy.

The confirmation says, once, plainly, and never again:

    Revoking stops new readings reaching them now. It cannot unsee what they
    have already read, and it cannot recover a copy they saved outside this
    product. The row stays in your list, marked revoked, so you can see it
    happened.

That is the honest sentence. Any design that implies otherwise is lying about a
failure, which rule 3 of the UX skill forbids.

**What the practitioner sees after revocation.** The row, greyed, with the date
sight ended, and the last reading date. No numbers. Not deleted from their
panel, because a row that vanishes silently is indistinguishable from a bug, and
because the practitioner has a professional record keeping obligation about who
was a client. Their own notes stay theirs.

## 4.3 The schema

Bump to `SCHEMA_V=3`. Two new blocks on the profile, both additive, both absent
on a v2 profile, both filled from the blank by `loadProfile` exactly as `who`
and `meter` already are at `schema.js:45` to `:48`.

    account:{
      key:'',              /* 26 char base32. the person's key, DECISIONS:112 */
      keyAckAt:null,       /* when they were shown the one sentence about it */
      pub:'',              /* public half, publishable */
      sec:'',              /* secret half. never transmitted, never exported
                              into a shareable bundle, see 4.5 */
      emailHash:null,      /* hash only. the address itself is never stored */
      claimedAt:null,      /* the one network seam fired once, at this time */
      plan:0,              /* 0 free, 1 to 4 paid. DECISIONS:17 */
      allowanceAt:null,    /* the month boundary the allowance resets on */
      practice:null        /* null for a person. see 4.3.1 for a practitioner */
    }

    grants:[{
      id:'g_<base36>',
      dir:'person'|'prac',        /* who started it. DECISIONS:124 */
      peer:{code:'', pub:'', name:''},   /* name is what they call themselves */
      label:'',                   /* what the person calls them. local only */
      scope:{who:false, born:false, structure:true, released:true,
             stories:'none'|'digest'|'full'},
      state:'requested'|'live'|'revoked'|'expired',
      requestedAt:null, consentAt:null, revokedAt:null, expiresAt:null,
      cadence:'save'|'daily'|'manual',
      sentAt:null, sentBytes:0
    }]

Three field level notes, and each is load bearing.

**`scope.stories` is three valued, not a boolean.** `none` sends no story text.
`digest` sends what `parseStory` derived and not what the person wrote: the
imprint count, the bands, the tagged axes, the dates. `full` sends the text as
written at `ui/storyui.js:31`. Three values exist because the free text is where
a name hides, which `DECISIONS.md:116` already names as open, and because a
digest is enough for most of what a practitioner actually does with a story.

**`peer.name` is what the practitioner says their name is, and `label` is what
the person calls them.** Two fields, because one field that changes owner is the
slot problem at rule 2 of the UX skill.

**`expiresAt` is present and may be null.** A grant that expires is not a
substitute for revocation and does not weaken T4. It is there because Sofia's
in session job is one hour long and a grant for one session should be able to
say so.

### 4.3.1 The practitioner's own block

A practitioner is a person with one more block. Not a second account type, not a
second app, and not a second profile shape. `account.practice` is null for
everybody else.

    practice:{
      code:'',            /* the practice code. shareable, not searchable */
      name:'',            /* display name shown in a scope sheet */
      pub:'', sec:'',     /* their own pair. sec never leaves */
      roster:[{
        grantId:'',
        alias:'',         /* what the practitioner calls this client.
                             THEIR text, on THEIR device, never synced */
        openedAt:null,    /* last time they opened the row */
        cachedAt:null,    /* the date of the reading they hold */
        note:''           /* their own notes. never sent to the client */
      }]
    }

The roster is on the practitioner's device. It is their professional record and
their liability. We never hold a list of who somebody's clients are, which means
there is no list to breach, sell or be compelled to produce.

### 4.3.2 The migration, and the one thing it breaks

Absent blocks read as absent. `loadProfile` fills them, the same two lines per
block that `who`, `who.born` and `meter` already get at `schema.js:45` to `:48`.
A v2 profile loads and saving upgrades it, which is exactly what the v2 comment
at `schema.js:7` to `:12` describes for gates.

`validateProfile` needs a branch per new block or the block is dropped at the
boundary (`schema.js:134`). Concretely: a `grants` array whose entries are
checked for a known `dir`, a known `state`, a `scope` whose keys are the six
above, and timestamps that are strings. An unknown `state` is refused by name
and not defaulted, because a grant that defaults to live is the silent default
`CLAUDE.md` forbids. **A `sec` present in imported text is refused
outright**, because a secret half arriving from a paste is either an accident or
an attack and there is no third case.

**What it breaks, and it needs the owner's ruling.** `schema.js:133` refuses any
profile whose `v` exceeds `SCHEMA_V`. A v3 record therefore cannot be read by a
v2 build at all. That is the cross compatibility contract with SOURCE
(`TASKS.md:168`). Two options, and they are both his: either the boundary starts
accepting a higher version, dropping the blocks it does not know and saying so
through `importError`, or a v3 record is simply refused by older builds and the
funnel writes v2 records until every build is upgraded. This document does not
choose.

## 4.4 The systems it implies

| System | Where it lives | Why |
|---|---|---|
| A blind key value store, three collections | new service | `TASKS.md:110` sizes it at about 49 MB for 100,000 people, `:123` scopes it |
| A one time code sender | that service | `TASKS.md:137` rules the email alone cannot be the key |
| `ui/net.js`, the one seam | new ui module, late in MANIFEST | `CLAUDE.md`, no `fetch` in `engine/` |
| `ui/crypto.js`, seal and open | new ui module | `crypto.subtle` is a host API |
| `bindSeal(seal, open)` | `engine/schema.js` | mirrors `bindStore` at `schema.js:93` |
| A key recovery decision | product, not code | see 4.5 |
| A controller, and the obligations | legal | `TASKS.md:143`, `CLAUDE.md` |
| `hostfree.py` gains `crypto` and `subtle` | `atuned_src/hostfree.py:11` | the gate does not list them today, so the engine could reach for them and pass |

## 4.5 Where it holds, and where it strains

**T1, the name.** Holds. The name reaches a practitioner's device inside
ciphertext the store cannot open. The store holds `emailHash` and never an
address, and lookups are by `rk`, never by name (`DECISIONS.md:113`).

**T2, never joined.** Holds, structurally. The record collection and the corpus
collection share no key, and no query can join them.

**T3, the corpus.** Holds, and it is the weakest of the four in every design:
the person's free text can contain their own name (`DECISIONS.md:116`). Stripping
named entities on device is the only mechanism that works and it will miss some.
That is already recorded as open and this design does not close it. What it does
add is that the corpus contribution is a separate, explicit act with its own
consent, and `scope.stories:'digest'` means a practitioner grant does not force
the person to move raw text at all.

**T4, explicit and revocable.** Holds. Defaults off, consent is a tap on a sheet
that states the payload, revocation is one tap, and the list is always visible.

**Where it strains, and it is one place.** Lose the key and the envelopes are
unreadable and the record is unrecoverable. That is the cost of the store being
blind, and it lands exactly on the row `DESIGN-ia.md:626` already describes as
the one row in the sheet that can lose a person everything. Three ways out, and
the choice is the owner's: a printed recovery phrase at first run, a second
factor held by the person, or an escrow that we hold, which reintroduces exactly
the capability this design exists to remove. The first is honest and the panel
will accept it, because the panel already accepts a stated limit and punishes a
discovered one (`RESEARCH-icp.md:300`).

## 4.6 What it forbids later

No server side analytics over named readings, ever, because there are no named
readings. Model refinement runs on the corpus only, which is what
`DECISIONS.md:245` says. No practitioner directory search. No "recover my
account" that we can perform alone. No feature that needs to read a person's
numbers on a server, which includes server rendered emails about their reading
and server computed streaks.

---

# 5. Design two. Two ledgers that cannot be joined

**One sentence for Sofia:** we hold your client's numbers under a pseudonym and
we never hold their name or their words, so what anyone can ask us for is a
column of numbers with nobody attached, and you supply the name yourself.

## 5.1 Architecture

The store is readable by the operator and structurally unable to name anybody.
Two ledgers with no join key between them, plus the corpus.

    identity     pid, emailHash, keyHash, plan, allowance, grant rows.
                 no name, no date of birth, no axes, no laws, no stories.
    reading      rid, and the numbers. axes, laws, soul, meter counts,
                 snapshots, story digests. no name, no free text, no pid.
    corpus       stories with no record attached, as in design one.

A grant mints a `rid` and a `view` row that points a practitioner at it. The
practitioner already knows who their client is, because they booked them. The
name is supplied by the practitioner, on their own device, into their own
roster. **We never learn it and we never need it.**

The join between a name and numbers exists only in the practitioner's head and
in their local roster. The join between a pid and a rid exists only in the grant
row, which is the thing the person controls.

This is the cheapest of the three by a wide margin. It is a normal service with
a normal schema and no cryptography, and every row in it is readable, which is
the point and the price.

## 5.2 The flows

Same two directions, same consent gate, same revocation, one difference: the
scope sheet has fewer lines because two of them are not on offer.

    First and last name              NOT AVAILABLE. we do not carry it.
    Date of birth                    NOT AVAILABLE, and see 5.5
    The structure                    on by default
    What is released, and what is not on by default
    The stories                      digest only. never full text.

Person adds practitioner: enter the practice code, review scope, Give sight. The
device sends the numbers and the digests to a fresh `rid`, and the grant row
carries the pointer. Practitioner adds person: a request row lands in the
person's sheet and shares nothing until consent, identical to design one.

Revocation: one tap, the `view` row is revoked, and the `rid` row is deleted
outright rather than orphaned. Deleting it is possible here in a way it is not
in design one, because the operator can act on plaintext, and that is the one
place this design is stronger: revocation can be complete on the store side
within the second.

What the practitioner sees after revocation: their own roster row, their own
alias, their own notes, and no numbers. They lose the chart and keep their
record that a client existed.

## 5.3 The schema

Same `account` and `grants` blocks as design one with three changes:

    account: no pub, no sec.    /* nothing is encrypted client side */
             add rid:''         /* the pseudonym the readings sit under */
    grants[].scope: {structure, released, stories:'none'|'digest'}
             /* who and born are removed. they are not offerable */
    grants[].rid:''             /* the per grant pseudonym. one per grant,
                                   so two practitioners cannot correlate */

One pseudonym per grant, not one per person, is the whole security argument of
this design. If two practitioners hold the same `rid` then a leak of either
side's roster names a reading. One `rid` per grant costs storage, about half a
kilobyte per grant by the measurement at `TASKS.md:109`, and closes it.

The practitioner block is the same as design one's, minus the key pair. The
roster and the alias are still local and still theirs.

Migration is the same additive story and the same v3 refusal problem at
`schema.js:133`.

## 5.4 The systems it implies

A conventional service with two schemas and an access layer that must be audited
to prove the ledgers are never joined in a query. A one time code sender. One
seam in `ui/net.js`. No client cryptography, so no `ui/crypto.js`, no
`bindSeal`, no key loss, no recovery phrase. A controller and the obligations,
as in every design. Plus one system the others do not need: **an internal
prohibition with teeth**, because nothing structural stops a future engineer
adding a join. That is a code review rule, a schema constraint and an audit,
which is a weaker instrument than arithmetic.

## 5.5 Where it holds, and where it does not

**T1, the name.** Holds, and better than design one on the store side: the name
is not present at all, in any form, ciphertext included.

**T2, never joined.** Holds by construction between the two ledgers, and it
holds only as long as nobody writes the query. It is a policy, enforced by
review, not by mathematics.

**T3, the corpus.** Same as design one. The digest is the default here rather
than an option, which is a genuine improvement: `scope.stories` has no `full`
value, so raw text never moves for a grant at all.

**T4, explicit and revocable.** Holds, and revocation is more complete than in
design one because the operator can delete the plaintext row.

**Where it does not hold, and this is the design's honest failure.**
`DECISIONS.md:127` rules that a practitioner sees first name, last name, date of
birth and the stories. **This design cannot deliver three of those four.** It
offers no name, no date of birth and no full story text. It does not relax the
ruling quietly, it contradicts it openly, and it needs the owner to either
accept the substitution (the practitioner supplies the name, the person tells
them their birth date in the room, the digest replaces the text) or reject the
design. Date of birth is the sharpest of the three because it is not
administrative here: `renderSpirit` at `ui/personas.js:36` and `spiritualOf` at
`:45` read the birth moment, and a practitioner without it cannot see the
cosmological half of the reading at all.

**Second failure, and it is quieter.** The operator can read every person's
axes, laws and coherence, keyed to a pseudonym, with a plan and an allowance
beside it. That is a somatic and psychological self report corpus with a
customer record attached in a second table. `DECISIONS.md:247` says a story with
a person attached is what we do not hold. A pseudonym with a payment record and
an email hash is a person attached by any regulator's reading, even if not by
ours.

## 5.6 What it forbids later

Almost nothing, which is the honest argument for it and against it. Everything
the operator might want to build later is buildable, including the things this
product has ruled it will never do. It relies on the ruling holding rather than
on the architecture holding it.

---

# 6. Design three. Paired sight, and no practitioner store

**One sentence for Sofia:** nobody can ask us for a client's record because we
do not hold one; you read a client's field while they are with you, on their
device or over a live pairing, and nothing about them stays on ours.

## 6.1 Architecture

There is no practitioner facing store. The person's device holds the only copy
of their profile, exactly as `panels.js:279` says today. The quiz record store
from `TASKS.md:123` still exists for the funnel, because the funnel needs it,
and it is the one seam.

A grant is a **capability to read, not a copy of what is read**. Two ways to
exercise it:

    In session.     A short pairing code. The person's device serves the
                    reading to the practitioner's device for the length of
                    the session. Same room, or a call.
    Between.        The person's device pushes a signed, expiring bundle to
                    a parking slot when they choose to. The practitioner
                    pulls it once, the slot is emptied, and what they hold
                    after that is their own cache and is labelled as such.

The practitioner's panel is a roster they typed, on their device, with a status
per row: paired now, a cached reading from a date, or no sight. That is a real
product for Sofia's in session job, which is the job the panel says she actually
does with a client (`DESIGN-mobile-icp.md:642`).

## 6.2 The flows

**Person adds practitioner, in the room.** The practitioner shows a code, the
person types it, the scope sheet appears on the person's device, consent is a
tap, and the reading appears on the practitioner's screen while both people are
looking at it. That is the strongest consent moment any of these three designs
produces, because the person watches the data arrive.

**Practitioner adds person.** A request code the practitioner reads aloud or
sends. Same scope sheet, same defaults off, same silence on decline.

**Between sessions.** Per grant, the person chooses: no sight between sessions,
or a bundle they push. Default is no sight between sessions. That default is the
one place this design is deliberately less useful than the other two, and it is
a deliberate choice rather than an oversight.

**Revocation.** One tap. The pairing dies, the parking slot is emptied, and the
practitioner's row goes to no sight on their next open. Same honest sentence as
design one about what cannot be unseen, and it bites harder here because the
practitioner's cache is the normal case rather than the exception.

## 6.3 The schema

    account:{ key, keyAckAt, emailHash, claimedAt, plan, allowance, practice }
             /* no pub or sec unless the bundle path is used, in which case
                design one's pair returns for that path only */
    grants:[{ id, dir, peer, label, scope,
              state:'requested'|'live'|'revoked',
              between:'none'|'bundle',      /* the whole difference */
              lastPairedAt, lastPushedAt }]

The parking slot, and it is the entire server side of the practitioner feature:

    parked   { slot, toPracKeyHash, blob, exp }
             one row, deleted on read, expires in 72 hours.

The practitioner block is design one's, with `cachedAt` doing more work because
a cache is the normal state.

Migration, identical additive story. `schema.js:133` problem, identical.

## 6.4 The systems it implies

A pairing broker, which is the one genuinely new piece of infrastructure in this
document: two devices have to find each other in real time, which means a
relay, which means a connection that is neither of the one seam nor a fetch. The
smallest honest version is long polling the parking slot, which is slow and
works. The good version is a websocket, which is a second network capability and
a second thing to operate. Plus the parking slot, plus the one time code sender,
plus a controller. No client key pair unless the bundle path is taken.

## 6.5 Where it holds, and where it costs

**T1 through T4.** All four hold, and hold better than in either other design.
Nothing about a named person is ever at rest on our side for longer than 72
hours, and in the pairing path, never.

**Where it costs, and the panel measures it.** Sofia has two jobs
(`DESIGN-mobile-icp.md:139` to `:143`). This design serves the in session job
completely and the night job not at all: she cannot look at a client's field at
eleven at night with the last client gone, because the client is asleep and not
paired. Her request at `DESIGN-mobile-icp.md:640` is explicitly both.

Worse, it cannot deliver requirement 3 of the practitioner panel, released
against not released between sessions, which is the one thing a coach needs to
know before a session starts rather than during it. A coaching product where the
coach cannot see whether the work happened is a diminished coaching product, and
`DECISIONS.md:119` says a practitioner is also a coach.

**And one thing it makes worse rather than better.** With no durable practitioner
side record, practitioners will export. They will screenshot the pairing, paste
numbers into their own notes, and keep a spreadsheet. The data still leaves, with
no scope, no expiry, no revocation and no log. A design that holds the ruling on
our side and pushes the copying into a channel we cannot see has improved our
posture and not the person's.

## 6.6 What it forbids later

Any asynchronous practitioner feature: a nudge when a client stalls, a weekly
roster digest, progress across a caseload. Push notifications for ritual
accountability are still possible, because those are addressed to the person and
not about them to somebody else.

---

# 7. Comparison

| | One. Sealed envelope | Two. Two ledgers | Three. Paired sight |
|---|---|---|---|
| Where the name to story join lives | the person's device and the granted practitioner's device | nowhere. the practitioner supplies the name | the person's device only |
| What the operator can be compelled to produce | ciphertext | numbers under a pseudonym, with a plan and an email hash beside them | the funnel record, and a parked blob for at most 72 hours |
| Enforced by | arithmetic | policy and code review | absence |
| T1 name never leaves | holds | holds, and more strictly | holds |
| T2 never joined | holds structurally | holds by policy | holds, nothing to join |
| T3 story without record | holds. digest is optional | holds. digest is the only option | holds |
| T4 explicit and revocable | holds | holds, and revocation is more complete server side | holds, and consent is witnessed |
| Delivers `DECISIONS.md:127` in full | yes | **no. name, birth date and full stories are all refused** | yes in session, no between |
| Practitioner sees a client when the person is absent | yes | yes | **no, except a stale cache** |
| Sofia's night job | served | served | **not served** |
| Sofia's in session job | served | served | served best |
| Released against not released, between sessions | yes | yes | no |
| Key loss consequence | **record and envelopes unrecoverable** | none | none, unless the bundle path is used |
| Network capabilities beyond the one seam | one blind store, three verbs | one store, read and write | store, plus a pairing relay |
| New engine seam | `bindSeal`, mirrors `bindStore` | none | `bindSeal` only on the bundle path |
| Engine stays host free | yes, crypto lives in `ui/` | yes | yes |
| Invites a future join | no. it is not possible | **yes. nothing structural prevents it** | no |
| Practitioners will copy data out anyway | some | some | **most, and invisibly** |
| Build cost | large | small | medium, and the relay is the risk |

Three differences actually decide it, and the rest of the table is detail.

**One. Whether the ruling is held by arithmetic or by promise.** Design two
holds the data ruling as long as the ruling holds. Designs one and three hold it
whatever anybody later decides, because the capability is absent. The owner's
ruling at `DECISIONS.md:236` is explicitly not a policy line to be softened
later. An architecture that can be softened later contradicts the sentence that
says it must not be.

**Two. Whether a practitioner can look when the person is asleep.** Design three
says no, and that deletes half of the highest value ICP's use of the product
(`DESIGN-mobile-icp.md:139`, `:640`). This is not a privacy win, because the data
leaves anyway through screenshots and spreadsheets, where we can neither scope
it nor revoke it.

**Three. Whether `DECISIONS.md:127` survives.** Design two refuses three of the
four things the owner ruled a practitioner sees. That is a direct contradiction
of a decision and it has to be argued to him, not worked around.

---

# 8. Recommendation

**Build design one, the sealed envelope. Take two pieces of design two into it
and one piece of design three.**

## 8.1 The argument

**It is the only design that answers Sofia in a sentence that is mechanically
true.** She is the highest value entry in the roster because she brings clients
(`RESEARCH-icp.md:349`), and her condition is not a promise but a retrieval
rule: "The question is who can ask for it and get it" (`RESEARCH-icp.md:343`).
Design one's answer is that nobody can, including us, and it is checkable rather
than trustable. Design two's answer is that they can get numbers with nobody
attached, which is a good answer that requires her to accept a policy. Design
three's answer is the strongest of all and it costs her the half of the product
she works in at night.

**It is the only reading of `DECISIONS.md` under which both of its own sentences
are true.** `:110` says the name never leaves the device and `:127` says the
practitioner sees the name. Both hold when the store carries ciphertext and the
person's device does the sending. That is not a workaround, it is what the two
rulings jointly specify, and it is why this design exists.

**It holds the ruling with arithmetic rather than with discipline.**
`DECISIONS.md:236` says the data promise is not a policy line to be softened
later. A blind store cannot be softened. A readable store softens by one pull
request, written by somebody who has not read this file, in eighteen months, for
a good reason.

**It does not delete the practitioner product.** Released against not released
between sessions is what a coach needs to prepare a session, and design three
cannot deliver it.

**It fails in exactly one place and the failure is honest.** Lose the key, lose
the record. That failure lands on a row the IA already specifies as the one row
in the sheet that can lose a person everything (`DESIGN-ia.md:626`), it is
stated once and never again, and the panel has already shown it accepts a stated
limit and punishes a discovered one (`RESEARCH-icp.md:300`).

## 8.2 What to take from design two

**The digest as the default story scope.** `scope.stories` defaults to `digest`,
not `full`, so the common grant moves derived tags and counts rather than the
person's sentences. `full` remains available because `DECISIONS.md:127` names the
stories, and it carries the sentence about what full text means. This closes most
of the exposure `DECISIONS.md:116` leaves open without contradicting `:127`.

**One pseudonym per grant.** Even inside a blind store, the addressing metadata
is metadata. A distinct grant scoped identifier means two practitioners holding
envelopes cannot be correlated by the store operator, and the cost is half a
kilobyte per grant.

## 8.3 What to take from design three

**The pairing path as the in session mode, later.** Sofia's session job wants
one image and one sentence on a client's phone
(`DESIGN-mobile-icp.md:142`, `:642`). A live pairing is the better shape for
that, and it is additive: `grants[].between` from 6.3 becomes a fourth cadence
alongside `save`, `daily` and `manual`. It is not in the first build.

## 8.4 What to refuse in all three

A practitioner directory that can be searched. A roster wide export. Any
comparison between clients, or between a client and a population
(`RESEARCH-icp.md:218`). A grant that defaults to on. A revocation that reads as
more complete than it is. A recovery path we can perform without the person.

## 8.5 The order to build it

1. **The boundary first.** `validateProfile` branches for `account` and
   `grants`, plus the `meter.firsts` bug in 0.3. No network, no UI, headless
   testable, and it is the thing the fetch at sign in will call
   (`schema.js:130`, `CLAUDE.md`).
2. **The sheet, offline.** The nine rows of section 1, with the grant list
   showing its empty state and no way to add one yet. It is honest, it is
   useful, and it needs no service.
3. **The one seam.** `ui/net.js`, the one time code, the record claim,
   `importError` on the failure path (`schema.js:324`).
4. **Seal and open.** `ui/crypto.js`, `bindSeal`, the key row and the recovery
   phrase. `hostfree.py:11` gains `crypto` and `subtle` in the same commit.
5. **Grants, both directions.** The scope sheet, the request row, revocation.
6. **The practitioner panel.** The roster, one client opened, released against
   not released, what to run.
7. **Pairing**, if the session mode earns it after 6 is measured.

Steps 1 and 2 are worth doing whatever he rules on section 10, because neither
depends on any of it.

---

# 9. What each design costs to build

Sizes in the register `TASKS.md` uses. Honest estimates against this codebase.

## Design one

| Piece | Where | Size |
|---|---|---|
| `account` and `grants` blocks, blank and load | `engine/schema.js:14`, `:44` | Small |
| Boundary branches for both, plus refusing `sec` | `engine/schema.js:130` | Small |
| `meter.firsts` at the boundary | `engine/schema.js:194` | Trivial, and a bug fix |
| Grant state machine, pure, headless testable | new `engine/grant.js`, after `schema.js` in MANIFEST | Small |
| Bundle builder, scope to payload | `engine/grant.js` | Medium |
| Story digest, from `parseStory` output | `engine/sniff.js` neighbourhood | Small |
| `bindSeal`, mirroring `bindStore` | `engine/schema.js:93` | Trivial |
| `ui/crypto.js`, seal and open | new, late in MANIFEST | Medium |
| `ui/net.js`, the one seam | new, late in MANIFEST | Medium |
| The nine row sheet | `ui/panels.js:264` rewritten | Medium |
| Scope sheet and consent flow | `ui/panels.js` | Medium |
| The practitioner panel | new `ui/practice.js` | **Large. It is a second application wearing this one's chrome, as `DESIGN-ia.md:739` already says** |
| Blind store, three collections | new service | Small. `TASKS.md:110` sizes it |
| One time code sender | that service | Small |
| Key recovery phrase, and its copy | product | Small, and it needs writing before coding |
| `hostfree.py` additions | `atuned_src/hostfree.py:11` | Trivial |
| Gates: engine assertions for the state machine, functional for the flows | `tests/` | Medium |

**Total: large, and one Large piece inside it.** The practitioner panel is the
bulk and it can ship a release behind the person's sheet.

## Design two

Everything above except `ui/crypto.js`, `bindSeal`, the recovery phrase and the
`hostfree.py` change. Add: a ledger separation audit, and the access layer that
proves the join is impossible in a query. **Total: medium.** It is the cheapest
by a clear margin and roughly two thirds of design one.

## Design three

Everything in design one except the envelope collection, plus a pairing relay
and a live session renderer on the practitioner side. The relay is the risk: it
is the only piece in this document that is neither the one seam nor a fetch, and
it is a service with uptime obligations during somebody's session.
**Total: medium to large, with the highest operational cost of the three and the
smallest product.**

---

# 10. What has to be ruled before any of this starts

Four items. Each is the owner's, each is named as open elsewhere, and each
changes what gets built rather than how it looks.

**1. `DECISIONS.md:133`, plan scope or everything.** Whether a practitioner sees
all of a person's data or only what their plan exposes. All three designs carry
`scope` as data so either answer is a value and not a rewrite, but the scope
sheet copy cannot be written until it is answered.

**2. `schema.js:133`, the version refusal.** A v3 record cannot be read by a v2
build. Either the boundary starts tolerating a higher version and dropping what
it does not know, or the funnel writes v2 until every build is upgraded. This is
the cross compatibility contract with SOURCE (`TASKS.md:168`).

**3. The word for the paid ladder.** `DESIGN-ia.md:371` reserves the problem and
this document proposes plan, tier and allowance as the three words. The profile
sheet cannot be written until one word means one thing, because the coherence
band and the paid ladder sit four rows apart in it.

**4. `DECISIONS.md:183`, save conflict between two devices.** Already named as
blocking the record store. It also blocks the envelope cadence in design one: if
two devices can both re seal a grant, the practitioner reads whichever wrote
last, and neither device knows it lost.

One more, and it is a copy ruling rather than an architecture one. The delta that
Diane asked for in five passes (`DESIGN-mobile-icp.md:656`) needs a stored
previous reading to compare against. `history` already holds snapshots
(`schema.js:40`, written at `schema.js:107`), so the data exists and nothing
reads it back as a change. That is the cheapest row in section 1 and the most
asked for.

---

# 11. Defects this reading found, unrelated to the designs

Recorded here because they were measured while reading, and neither needs a
decision.

**`meter.firsts` does not survive the boundary.** `schema.js:194` to `:201`
copies four meter fields and not `firsts`, which `meterFirst` writes at
`schema.js:306` and `meterRead` returns at `schema.js:293`. Every dated first is
lost on import. Small.

**Theme and legible do not persist.** `ui/panels.js:129` and `:136` set no
store, while density does at `panels.js:241`. Three appearance controls, two
persistence contracts. Named already at `DESIGN-ia.md:582`.

**`hostfree.py` would not catch crypto.** The forbidden list at
`atuned_src/hostfree.py:11` names `document`, `window`, `navigator`,
`localStorage`, `sessionStorage`, `requestAnimationFrame`, `alert`, `fetch`,
`XMLHttpRequest` and `new Image`. It does not name `crypto` or `subtle`. Nothing
reaches for them today. If design one lands, they belong in that list in the
same commit, or the engine can quietly acquire a host dependency the gate says
it does not have.
