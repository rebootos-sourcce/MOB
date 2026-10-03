# Architecture And Schema Review

Six passes over the engine, the schema and the store. Nothing in here is
remembered. Every number came from running the build named below, and every
claim that surprised me is followed by the control experiment that decided it.
Seven probes have lied in this repo this session, so each one of mine ran a
known good case first and I have kept the two that came back inconclusive.

I wrote no product code. This document is the only file I touched.

## What I Measured, And On What

    source.html        1,190,266 chars   md5 f304c295
    engine.js            385,049 bytes
    commit             124421d, tree DIRTY
    engine modules     19 plus 11 data tables, 3,407 lines
    gates              node tests/engine.js  818 passed, 0 failed, 0.46s

The tree moved under me while I worked. `124421d` landed mid review and touched
only `TASKS.md` and `CHECKLIST.md`, and a parallel change to
`atuned_src/ui/ui.js`, `atuned_src/ui/personas.js` and the two shell files was
uncommitted when I finished. That change is the accuracy label and the tier
button. It does not touch `loadP`, `pStore`, `PROF_BY` or `bindStore`, verified
by `git diff` on those symbols, and I re-ran the three headline findings against
the current build at md5 f304c295 before writing them down. All three
reproduce.

Every line number in this document is against the working tree as it stands,
md5 f304c295, not against `124421d`. The parallel change shifted `ui/ui.js` and
`ui/personas.js` by seventeen to nineteen lines and every citation to those two
files was re-resolved after it landed.

`STABILITY.md` says 279 engine assertions and 331.6 KB. It is 818 and 1.19 MB.
`reviews/technical.md` T15 already filed that and I am not filing it twice.

## The Shape Of The Profile, As It Stands

It is not written down as a table anywhere, so here it is, read off
`blankProfile` at `atuned_src/engine/schema.js:14` and what the boundary will
accept at `:241`.

| Block | Shape | Stored or derived | What the boundary checks |
|---|---|---|---|
| `v` | int | stored | 1 to `SCHEMA_V`, currently 2. Outside that refuses the record |
| `id` | `'p'+base36 time+4 random` | stored | string or a fresh one is minted |
| `name` | string | stored | any string, no length cap |
| `created`, `updated` | ISO string | stored | string only, never parsed |
| `soul` | `{doms[],arcs[],roots[]}` | stored | index range against `DOMAINS` and `ARCH`, refills empties |
| `axes` | 9 of `{held,opp}` | stored | 0 to 10 by name, never clamped |
| `who` | 5 strings plus `born{date,time,place,timeUnknown}` | stored | strings, cut to 200 |
| `ui` | `{quiet,model}` | stored | coerced to boolean |
| `seed` | `{type,at,axes}` or null | stored | one of sixteen types or refused |
| `meter` | `{lines,unique[],firsts[],first,last}` | stored | counts bounded, keys typed, firsts typed |
| `plan` | `{tier,status,granted,carried,base,since,until}` | stored, written by the host | tier by name, six identifiers refused by name |
| `avatar` | `{built,at,reviewedAt,pairs[]}` | stored | whole pairs only, halves refused |
| `purpose` | `{soul[3],ego[3],sides{6 of 5}}` | stored | three and three, five a side |
| `laws` | 21 of number or null | stored | 0 to 10, null means unmeasured |
| `intake` | `{answers{0..62},done[],startedAt,completedAt}` | stored | key 0 to 62, value 0 to 10 |
| `gates` | `{verp{6},lean{2}}` | stored, v2 | counts 0 to 1e6 |
| `story.entries` | `[{t,text,imprints,bands}]` | stored | **array only. entry shape unchecked** |
| `rituals` | `[{t,track,band,steps[],min}]` | stored | **is an object, nothing else** |
| `history` | snapshots | derived, stored | every field typed and ranged, one bad row refuses the record |

Two things are not in the profile and both matter to everything ruled this
session. The **outbox** lives under its own key, `source.outbox`
(`engine/outbox.js:17`), so it does not round trip, does not export and does not
reach a second device. The **release history** is `RUN.log` in memory
(`ui/release.js:79`) and is never written anywhere, so the only surviving trace
of a release is the meter keys and the dated firsts.

### The Four Names For Who Is Loaded

This is the architecture finding under most of what follows. "The person in
front of the instrument" is held in four places at once.

    S.who              a persona index          ui/personas.js:351
    CURP               a record pointer         engine/schema.js:160
    PROF_BY[name]      name to record           ui/personas.js:268
    PROFILES[0]        position as identity     ui/ui.js:917

Nothing in the schema marks which record is the person's own. `CURP=PROFILES[0]`
is the whole of it. This project has a written rule that identity is never
position, and the profile list is the one place the rule is not kept.

---

# Pass One. The Profile Shape And Its Migrations

## What This Pass Changed

It moved `pStore` from a fix to a two sided instrument. Validating everything off
the disk closed tonight's crash and opened a deletion path, because the
in memory list is what the next write persists.

## A Refused Record Is Not Kept. The Next Save Erases It

`engine/schema.js:189` says, in the file's own words: "A profile store is the one
place a refusal must not be fatal: one bad record must not take the other nine
with it," and `:185` says a refused record "is kept rather than dropped, because
a person's own data is not ours to discard in silence."

The first sentence is true. The second is not true of the disk.

`pStore` (`:192`) returns only the records that validated. `ui/ui.js:915` assigns
that result to `PROFILES`. `pPersist` (`:212`) writes `JSON.stringify(PROFILES)`
over the whole key. So the first save after a refusal deletes the refused record
permanently, and no surface ever says so: `storeRefused()` (`:205`) has exactly
zero callers outside `tests/engine.js`.

Measured, with a control that passes first:

    control: one valid v2 record, boot, pSave()   -> 1 record, id pAAA, unchanged
    a v3 record beside a v2 record, boot          -> PROFILES ["Keeper"]
                                                     disk ["FromNewerBuild","Keeper"]
                                                     storeRefused() names it
    then one pSave()                              -> disk ["Keeper"]
                                                     nothing on screen mentions it

Severity is high because the trigger is ordinary. Any of the six refusal classes
does it: an unknown tier, one malformed history row, a wrong typed leaf, a
version from a newer build.
*Fix: keep the raw refused entries and write them back untouched, or hold them
under a second key before the first write. S.*

## A Refused Own Record Hands The Person A Reference Case

The chain, and this is the one I would fix tonight. `PROFILES[0]` is the
person's record by position only. Refuse it and position 0 becomes whatever
survived. `ui/ui.js:917` then sets `CURP=PROFILES[0]`, and `:924` sets
`PROF_BY[PEOPLE[0].nm]=CURP`, so the name "You" now points at a reference case.

Measured, a store holding a "You" with `plan.tier:'nonesuch'` and a valid
"Marcus":

    storeRefused()   plan.tier is not a tier this build knows: nonesuch
    PROFILES         ["Marcus"]
    CURP             Marcus
    PROF_BY["You"]   Marcus
    S.who            0            a claim that S holds the person's own field
    S.charge.Anger   9            which is Marcus's
    unread           false
    CQ               28.7
    then toYou(), one edit, persistNow()
    disk             [{"name":"Marcus","id":"pMAR","fear":7}]

The person boots into a stranger's reading, is told it is theirs, and their edit
is written into the stranger's record while their own record is erased by the
same write. `DECISIONS.md:838` already records `toYou` repointing the record as a
defect once fixed, and commit `a68f5dd` records "a stranger's field was being
written into your record". This is a third route to the same place, reached
through the boundary rather than through the dropdown.
*Fix: mark the person's own record in the schema and resolve it by that mark,
never by index. One additive boolean, `own`, defaulted true for the first record
a build creates. M, and the flag itself is the owner's call because it is the
schema.*

## The Person's Own Field Has Two Truths, And The Wrong One Wins

`loadP(0)` restores the nine charges from `PEOPLE[0].c`, the in memory persona row
(`ui/personas.js:358`), not from the record. Then `:409` calls
`saveProfile(CURP)`, which writes the live field into the record. `PEOPLE[0].c` is
only updated by `saveYou()` (`:302`), and the story apply path never calls it.

So any route through `toYou()` after a change that did not go through `saveYou`
overwrites the person's stored charge with the persona row, which is zeros.

Measured, control first:

    control: apply a story, reload         You anger 5.35  fear 3.41  stories 1
    case:    apply the same story          You anger 5.35  fear 3.41  stories 1
             loadP(3)                      unchanged on disk
             toYou() then a save           You anger 0     fear 0     stories 1
             reload                        You anger 0     fear 0     stories 1

The story entry survives and the field it produced is gone. Undo cannot reach it
either: `loadP` never calls `undoPush`, so the largest destructive write in the
product is the one with no entry on the stack.
*Fix: `loadP(0)` reads the person's field from the record, and `PEOPLE[0]` stops
being a store. M.*

## Reference Cases Are Written Into The Person's Own Store, Once Per Session

`loadP` creates `blankProfile(p.nm)` for any persona with no entry in `PROF_BY`
and pushes it onto `PROFILES` (`ui/personas.js:404`). `PROF_BY` is rebuilt empty
at every boot and only `PEOPLE[0]` is repopulated (`ui/ui.js:924`), so the
duplicate check cannot see what is already on disk.

Measured:

    fresh store, visit two reference cases, save   disk ["You","Marcus","Rosa"]
    reload, visit the same two, save               disk ["You","Marcus","Rosa","Marcus","Rosa"]

It grows without limit, one duplicate per persona per session, and the record
list shows them to the person as their own profiles. The Marcus record also
carries 21 measured laws off the demo table, so the person's store holds a
complete reading of somebody who does not exist.
*Fix: rebuild `PROF_BY` from `PROFILES` at boot, and keep reference cases out of
the persisted array entirely. S for the first half, M for the second.*

## Importing Your Own Export Produces Two Records With One Identity

`pExport` keeps `id`, `validateProfile` keeps `id` (`:247`), `pImport` pushes
(`:654`). Measured in the browser: ids after the import are
`["pmu917p7nlion","pmu917p7nlion"]` and both are named "You". The boundary raises
nothing. For a store that will key anything on a record id this is a collision
waiting for a reason.

`pExport` is also not a read. It calls `saveProfile(CURP)` (`:219`), so exporting
bakes the live field into the record and stamps `updated`. If another profile's
field is loaded, export writes that field into the record it exports.
*Fix: mint a fresh id on import and record `from` as the original, and let
`pExport` serialise without writing. S.*

## Two Smaller Ones In The Same Family

A record with no `id` gets a new one from `blankProfile` at every boundary pass,
so its identity moves every boot until something saves. Verified in node: two
calls to `validateProfile` on the same input return different ids.

An undated history row is given `new Date().toISOString()` (`:422`), and a row
with an unreadable `dark` or `tier` is given `'Heart'` and `'Collapsed'`
(`:423`). That is the clamped 9999 in date and band form: an undated reading
becomes today's reading, and it moves again on the next boot. The rule in
`CLAUDE.md` is refuse by name, and here the boundary invents.
*Fix: drop the row and name it, do not date it. S.*

---

# Pass Two. What The Engine Computes, And Whether It Is Honest

## What This Pass Changed

It found the arithmetic sound and two of its carriers dishonest. `compute()` is
internally consistent and reports what it computes. `snapshot()` reports on a
profile it never reads, and the core loop can walk a person's own number
downward with no brake.

## snapshot(p) Ignores p

`engine/schema.js:153`:

    function snapshot(p){
     var r=compute();

`p` is never referenced in the body. The snapshot is of whatever is in `S`.
`pSnap` (`:218`) does `CURP.history.push(snapshot(CURP))`, which reads as a
snapshot of `CURP` and is not one.

Measured in node:

    a heavy field in S, snapshot(B) where B is an empty profile   cq 7.6
    the field emptied, snapshot(B), same B                        cq 36.0

So the whole snapshot series is a record of the field that happened to be loaded
at each push, and `history` is the one block the boundary validates hardest.
Combined with the story path below, this is how a reference case's history
acquires a person's numbers.
*Fix: either take the profile and load from it, or drop the parameter so no
caller can believe it. S for the signature, M if the loading is done properly.*

## compute() Reads The Record For One Field And The Field For The Rest

`engine/compute.js:154`:

    const measured=SI.filter(function(l){return CURP&&CURP.laws&&CURP.laws[l.nm]!=null;}).length;
    const unread=(loaded.length===0&&measured===0);

Everything else in `compute()` comes off `S`. So `CQ` can be one person's and
`unread` can be another's, which is exactly the state pass one produced: charge 9
from Marcus, `unread` false from Marcus's laws, and `S.who` claiming both belong
to the person. `unread` is the flag every surface checks before it agrees to
print a tier.
*Fix: `measured` comes off `S.law` and `LAW_UNSET`, which are already loaded per
profile, or it is passed in. S, and it is the cheapest purity win in the file.*

## The Release Loop Has No Brake, And Past The Peak It Costs

The formula is `CQ = (It * Ig) / Rz`. The installed opposite raises `poleMean`,
which appears in both `Ig` at 0.30 and `It` at 0.22, and raises `JQ` past 6,
which subtracts from both at 0.42 and 0.30. Swept in node, charges at zero and
laws at the default 6:

    opposite   0   CQ 36.00
    opposite   5   CQ 51.00
    opposite   6   CQ 54.31
    opposite   7   CQ 54.84        the peak
    opposite   8   CQ 46.85
    opposite  10   CQ 32.71        below where it started

With a measured field, charges 7 and laws 7, the peak is at opposite 6 at 58.44
and opposite 10 reads 33.25 against 32.68 for a person who never released
anything.

Release installs `share*0.62` with no ceiling (`ui/release.js:78`, clamped only
at 10), so a person who keeps running the core loop is driven over the top of
the curve by the product. The panel cannot warn them, because `cqHeadroom`
measures the ceiling at the current pole and the current pole is already past the
peak.

The arithmetic is not wrong. Overshoot is meant to cost and the file argues for
it at `compute.js:58`. What is missing is a ceiling on the install, or a sentence
at the moment it stops paying.
*This is the owner's call, not mine: it is a model shape and it touches the core
loop. M to cap the install, S to say it.*

## Two Functions That Decide A Printed Claim Are Unreachable From The Gate

`cqCeiling` and `cqHeadroom` (`engine/compute.js:255`, `:271`) are absent from
`engine/export.js` and appear zero times in `tests/engine.js`. `ui/release.js:163`
prints their output to a person as "Release has about 3.2 left to give you". A
number a person is shown, computed by a function no gate can call.
*Fix: export both and assert the monotonic property the comment claims. S.*

## What The Arithmetic Got Right, Stated So It Is Not Re Litigated

`suscAll()` runs inside `loadProfile` (`compute.js:13`), so susceptibility belongs
to the profile being read. `accuracy(r,prof)` takes the profile as an argument and
defaults to the live one, which is the pattern `snapshot` should have used.
`planAllowance` derives spend from the unique count and never stores it
(`plan.js:150`). `meterNext` reads the cursor off the keys rather than storing one
(`schema.js:464`). Every one of those is the right call and the comments explain
why. `read.js` is the correct front door and zeroes what accumulates.

---

# Pass Three. The Host Boundary, And Whether It Holds

## What This Pass Changed

The DOM boundary holds. The data boundary out of the engine does not: there is
one function that hands stored bytes to a host sender without revalidating them,
and it is the function that will be pointed at the network.

## The Outbox Drain Trusts The Disk And Breaks Ruling T4

`obQueue` validates on the way in (`engine/outbox.js:78`). `obDrain` (`:96`) reads
`obStore()` and calls `SEND_HOST(q[i])` with no validation at all. `obStore`
(`:36`) parses the key and does not even check it is an array, which `pStore`
learned to do at `schema.js:195`.

Measured in node, with a bound sender and a control that passes:

    a valid enqueue                {"ok":true,"queued":1}
    an enqueue carrying name       refused: the envelope may not carry name
    a hand written queue entry, drained, what crossed the seam:
      {"kind":"question","body":"mail me at a@b.com","name":"Lance Powell",
       "email":"lance@example.com","rid":"01ABCDEF","story":"the whole of it",
       "axes":{"Anger":9}}
    obValidate on that same entry  refuses name, email, rid, story, axes and
                                   the mail shaped body, by name
    the key set to a bare string   drain reports {"state":"sent","n":13}

Every item on `OB_NEVER` crossed. The queue is in `localStorage`, so anything with
script on the origin can write it, and the drain will send it and report success.
`reviews/technology.md` states T4 as a test rather than an intention and says a
gate greps `ui/net.js` for those names. The grep cannot see this, because the
module that sends is clean and the data comes off the disk.
*Fix: `obDrain` runs `obValidate` on every entry before the sender sees it, drops
what fails and says which. `obStore` gets the `Array.isArray` guard. S, and it
should land before `bindSend` has anything real behind it.*

## The DOM Boundary Itself

`hostfree.py` passes on the current engine and the assertion is real: comments and
strings are stripped first, and it caught `AudioContext` and
`webkitSpeechRecognition` as bare names. `BUILD-engine.sh` runs it on every build.
`bindStore` is the only route to storage and `STORE_BOUND` is what makes a save
claimable. This is a good boundary and I would not change its shape.

Three names are missing from the forbidden list and all three are reachable from
`engine/`: `WebSocket`, `EventSource` and `indexedDB`. `crypto` and `subtle` are
already named as additions in `reviews/technology.md` for when `ui/crypto.js`
lands. `Worker` and `postMessage` are the next two.
*Fix: add five names to `BAD` in `atuned_src/hostfree.py`. S.*

The engine is host free and it is not clock free or entropy free: seventeen sites
call `new Date()`, `Date.now()` or `Math.random` (`engine/`, excluding data
tables). `ladder.js` takes `now` as an argument for exactly this reason and says
so at `:18`. `meterRun`, `meterFirst`, `seedApply` and `snapshot` do not. That is
why a test can pin a streak and cannot pin a first.
*Fix: pass the moment in wherever a stamp is written, the way the ladder already
does. S per function, M for all of them, and it is worth doing before the store
lands because a server will disagree with a client clock.*

---

# Pass Four. When The Record Store Lands And This Shape Goes Over A Wire

## What This Pass Changed

It turned the version ruling in `reviews/technology.md` from a preference into a
data loss path, because refusal and erasure are now the same event.

## A Record From A Newer Build Is Refused And Then Deleted

`schema.js:244` refuses any `v` above `SCHEMA_V`, which refuses the whole record,
and pass one showed a refused record is erased by the next write. So the
sequence, all of it ordinary once there are two builds in the world:

    a person uses a v3 build          the record on disk says v3
    a v2 build loads, from a cache,
      a second device, a shared
      machine or a rollback           the record is refused, nothing says so
    anything at all is saved          the record is gone from the disk

`reviews/technology.md` names version tolerance as the first of five rulings the
owner owes before the first record is written. I would raise it: it is the first
ruling owed before the second build ships, store or no store, because the
deletion does not need a network.

The boundary also drops unknown blocks in silence. Verified: a record carrying
`points` and `release` validates `ok` and comes back without either.
*Fix, and it is the owner's ruling to make: either the boundary accepts a higher
`v`, keeps what it knows, and reports the dropped blocks by name through
`importError`, or it refuses and preserves. It may not refuse and delete. S once
ruled.*

## The Boundary's Strictness Is Inverted Against The Cost Of Loss

    history       every field typed and ranged. one bad row refuses the whole
                  record, and the record is then erased by the next write.
                  history is DERIVED and reproducible from the axes.
    story.entries array checked, entries not checked at all. the story is the
                  person's own words and is the one block in the profile that
                  cannot be recomputed from anything.

That is the wrong way round on both counts. A derived block should never be able
to refuse a record, and the irreplaceable one is the one with no shape check.
*Fix: history rows that fail are dropped and named rather than refusing the
record, and story entries get a typed shape. S each.*

## What Must Not Cross, Restated Against The Schema

`validateProfile` already refuses `plan.customer`, `plan.subscription`,
`plan.email`, `plan.key`, `plan.secret` and `plan.token` by name (`:361`) and
refuses an unknown tier rather than rounding it down. That is the strongest block
in the file and the seam should not need anything added to it.

What the schema has no place for, and will need one when the seam lands:

- a **record revision**, because without one the app cannot tell a record it has
  already seen from one it has not, and cannot say which of two is newer.
- a **provenance mark** on the profile, funnel or local, because
  `reviews/technology.md` 1.4 rules that a claim never overwrites and pushes a
  new profile instead. Two profiles that look identical and came from different
  places need to say so.
- the **own** flag from pass one, because a claim that pushes a second record
  makes `PROFILES[0]` even less able to answer who the person is.

---

# Pass Five. Concurrency, And Two Devices Writing One Record

## What This Pass Changed

It moved the concurrency problem forward in time. `DECISIONS.md:183` carries save
conflict between two devices as open and blocking the record store, and
`reviews/technology.md` 2.3 rules no sync at launch, which is right. Both are
about two devices. The product already loses data with one device and two tabs,
today, with no network anywhere.

## Two Tabs, One Origin, One Lost Profile

Every profile lives in one key and every save writes all of them
(`schema.js:212`). There is no `storage` event listener, no `BroadcastChannel`
and no revision, verified by grep across `atuned_src/`.

Measured, two tabs in one context:

    A opens                          mem ["You"]            disk ["You"]
    B opens                          mem ["You"]            disk ["You"]
    B creates "Second", writes a
      story into it, saves           disk ["You","Second"]
    A has not noticed                A mem ["You"]
    A saves once, anything at all    disk ["You"]

The profile and its story are gone and neither tab reports anything. Two tabs is
not an exotic state: the app is a single file people open from wherever it
landed.
*Fix, smallest honest version: listen for `storage` on `PKEY`, and on a change
that this tab did not write, stop claiming the in memory list is current and say
so. Real version: one key per profile plus an index, which makes a write touch
one record and makes a merge possible. S for the notice, M for the split, and the
split is also the fix for the O(all data) write in the performance section.*

## What A Second Device Will Add To That

The shape above is the shape a sealed sync would inherit: last writer wins over
the whole array, with no revision to compare and no way to show a conflict. The
ruling to ship without sync is correct and it is not enough on its own, because
the claim path pushes a new profile into the same single key from a second device
whose clock the first has never seen. A revision and a per record key are the two
additive changes that make the later decision possible. Neither needs the network
to be useful now.

---

# Pass Six. Read As Somebody Maintaining It In Two Years

## What This Pass Changed

Nothing new about behaviour. It changed my view of where the risk actually sits:
not in the arithmetic, which is documented to a standard I have rarely seen, but
in the number of places that answer the same question.

## Six Pairs Of Two Truths

    the person's field          PEOPLE[0].c            vs   CURP.axes
    who is loaded               S.who, CURP, PROF_BY, PROFILES[0]
    the live reading            S                      vs   CURP, read by compute()
    the undo stack              module level UNDO      vs   per profile state
    the outbox                  source.outbox          vs   the profile
    what a save reports         pPersist's return      vs   saveState()

Every defect in this review is one of those six pairs disagreeing. That is the
thing to fix structurally, and it is a bigger job than any single item.

## The Undo Stack Belongs To No Profile

`UNDO` and `REDO` are module level (`engine/undo.js:28`, `:38`) and nothing calls
`undoClear` on a profile switch. Measured in node:

    a change pushed while A is loaded, label "A change on A"
    loadProfile(B), B charge 0, undoDepth 1, undoPeek "A change on A"
    undoPop()  ->  B charge 9

One profile's field is applied to another and the control says so in the other
profile's words. The stack is otherwise the best defended unbounded structure in
the codebase, which `reviews/technical.md` measured at 636 bytes an entry.
*Fix: `undoClear()` wherever `CURP` moves, or key the stack by profile id. S.*

## Two Controls That Claim What They Do Not Have

`reviews/technical.md` T5 already has the story commit, the release, the ritual
button and `panels.js`. I found one more and it is the worst of them, because it
is the one about deletion.

`accDelete` at `ui/account.js:321` guards with `if(!pSave())`. `pSave` returns
`CURP` or null (`schema.js:217`), never the result of the write, so the guard can
only fire when there is no current profile. Measured with the store rebound to
throw `QuotaExceededError`, control first:

    control, a working store        saveState {"ok":true}
    every write failing             pPersist false, saveState {"ok":false,"err":"QuotaExceededError"}
    pSave() still truthy            true
    accDelete() returned            true
    the status line said            "Deleted from this browser. Nothing was held anywhere else."
    records on disk before          1
    records on disk after           1

The person is told their somatic self report was deleted and it is still there and
comes back on the next reload. The information was available: `saveState()` named
the error one line away.
*Fix: `pSave` returns the persist result, or every caller reads `saveState()`.
`statusSaved()` at `ui/component.js:181` already exists and already says the right
thing. S, and it is the same one line that fixes the other four.*

## schema.js Is Five Concerns In One File

658 lines holding the shape, the loader, the writer, the snapshot, the store, the
boundary, the meter, the key format, the horizon, the markers and the import. The
meter and the markers are not schema; they are a ledger that happens to live on
the record. `MANIFEST` makes a split cheap and `tools/equiv.py` proves a split
changed nothing.
*Fix: `engine/meter.js` and `engine/markers.js` out of `engine/schema.js`, same
bodies, same signatures. M, and `equiv.py` is the whole test.*

## What A Maintainer Will Thank Somebody For

The comments. Nearly every defect in this file is recorded above the line that
fixes it, with the measurement that found it. `TAB` against `TABDEF`, `TABREAL`
and `TABEXTRA` is the clearest worked example of identity against display order I
have read in a codebase. `LAW_UNSET` and `LAW_SEED` exist because two callers
seeded a default differently and the comment says so. That is institutional
memory and it is load bearing. Nothing in my recommendations touches it.

---

# The Class Behind Tonight's Defect

Tonight: a profile written by an earlier build had no `soul`, `loadProfile` read
`p.soul.doms` without a guard, the boot threw, the centre canvas came back 0 by
0, and every cold boot test passed. The fix was to route the disk through the
boundary. That was the right fix and it is not the whole class.

The class has three members and I went looking for all three.

## One. Stored Fields Read Without A Guard

The boundary now normalises everything it accepts, so the surviving holes are
exactly the fields the boundary does not check. It does not check story entry
shape (`schema.js:309` is a bare `slice()`), and two surfaces read `e.text`
unguarded.

    ui/imprints.js:133    esc(e.text.slice(0,130))+(e.text.length>130?'…':'')
    ui/analytics.js:218   the same expression

Measured, control first. A stored profile whose entries carry `txt` instead of
`text`, which is what a differently keyed build would write:

    the boundary took it, storeRefused() empty, entry keys ["t","txt","imprints","bands"]
    control, a well formed entry, Imprints grouped by story   rendered 775 chars
    the stored shape, same surface   THREW: Cannot read properties of undefined (reading 'slice')

The same sentence as tonight's, on a different surface, from the same cause.
`ui/wheel.js:191` and `ui/summary.js:163` guard correctly, so the pattern to copy
is already in the file twice.
*Fix: type story entries at the boundary and drop what fails by name. S.*

`rituals` is the same hole not yet exercised: the boundary accepts any object
(`:416`), and `engine/ladder.js:64` and `:34` read `x.min` and `x.t` defensively.
That is luck rather than design, and the ritual block is about to grow, because
Ritual is now a primary surface.
*Fix: type a ritual entry. S.*

## Two. Migrations Assumed Rather Than Performed

`loadProfile` fills seven missing blocks in place (`:78` to `:91`) and
`meterRun` fills five of the same ones again (`:501` to `:508`). Two copies of a
migration in one file, which is the `LAW_DEFAULT` lesson wearing different
clothes.

The real assumption is that the boundary's fill is the migration. It is not: the
fill is not written back until something saves, so between boot and the first
save a v1 record is a v2 record in memory and a v1 record on disk, and the only
thing that upgrades it is a side effect of an unrelated write. `saveProfile:150`
stamps `p.v=SCHEMA_V` whatever happened, so a record can be stamped v2 by a build
that never performed the gates migration, only the default fill. It happens to be
harmless for v1 to v2 because absent gates read as zeroes. It will not be harmless
twice.
*Fix: one `migrate(p)` that runs after validation, performs each step by version
and returns what it did, so the upgrade is a named event rather than a side
effect of a save. M, and it is what makes a v3 possible at all.*

## Three. Tests That Only Ever Run Cold

    tests/engine.js       27b at :1786 is the one test in the repo that boots
                          an older record through pStore. It is good and it
                          is engine level only.
    tests/functional.js   4 mentions of localStorage: two are
                          localStorage.clear() to force a cold boot, two check
                          that a write lands. No gate ever loads the page with
                          a foreign record already on the disk.
    tools/monitor.js      "loaded" is loadP(Lance), an in memory persona.
                          :72. Nine surfaces, two widths, both on an empty store.
    tests/design.js       no localStorage at all.
    tests/collide.js      no localStorage at all.

That is the hole, stated plainly: the product is tested against the state a
stranger arrives in and never against the state a returning person arrives in,
which is the only state that has produced a mayday.
*Fix: a fixtures file of stored profiles, one per class, seeded into
`localStorage` before `goto`, walked across all nine surfaces by
`tools/monitor.js`. The classes that matter: a v1 record, a record with a missing
block, a record from a newer build, a record with a foreign story entry shape, a
record whose own entry is refused, and a store holding two profiles where the
first is refused. Six fixtures, and five of the findings above would have been
caught by them. M, and it is the highest value item in this review.*

---

# What A v3 Would Have To Carry

The bump is the owner's. This is what the shape has to be for the things ruled
this session to be storable, and what happens to a v1 or v2 record when it
arrives.

| Block | Why it needs schema | Migrates from v2 |
|---|---|---|
| `who.sealed` | already in v2 at `:27`, stamped when the identity is saved. No work. | clean, absent reads as unsealed |
| `ui` | already in v2 at `:33`, `{quiet,model}`. Both booleans, both filled from blank. | clean |
| `rituals` | in v2 as an untyped list. Ritual is a primary surface now, and the accountability tracker lives inside it, so an entry needs a typed shape: `{t,track,band,steps[],min,done,at}` and a stable key per ritual so a tracker can point at one. | clean, but the entries already written have no key. A key minted on migration is a new key, and any tracker history that predates it cannot be attached. Do this before a tracker ships, not after. |
| `outbox` | currently a second key, `source.outbox`. It does not export, does not reach a second device and does not survive a store clear. If it stays outside the profile, say so in the schema comment; if it comes in, it has to be excluded from the record that crosses the seam, because it carries free text. | clean either way, and the drain must validate first |
| release history | does not exist. `RUN.log` is memory only. A run is `{t,plan[],freed,cleared[],cq0,cq1}`. Without it, "unless you override it" in the avatar ruling has no memory of what was ordered, and undo has no record of what a release did beyond one stack entry. | nothing to migrate. Everything before v3 has no history, and the meter keys plus `meter.firsts` are the only reconstruction available. It is partial and it must not be presented as complete. |
| points and badges | `MARKS` at `engine/ladder.js:86` are derived live from the ledger. Two of them read `clear`, which is current state and can fall (`:67`), so an earned mark can silently un earn. The product already has the right shape for this: `meter.firsts`, dated, append only, "a first happens once" (`:637`). Badges belong there, not in a live test. | clean, and the migration can award every mark the current ledger passes, dated at the migration. That date is honest only if it says it is the migration date and not the day the thing happened. |
| the avatar as a priority setter | `TASKS.md:1339` rules that what a person sets for their avatar becomes the priority the ritual releases against, unless they override it. `avatar.pairs` is an unordered list of `{be,notbe}`. It needs a stable key and an explicit order, and the override needs to be stored as an override rather than as a reordering, or the product cannot tell what it suggested from what the person chose. | clean. Order on migration is the stored array order, which is arrival order, and that is the one honest default. |
| a record revision | pass five. An integer that increments on every write, so two copies can be compared without a clock. | clean, absent reads as 0 |
| provenance and `own` | pass one and pass four. Which record is the person's, and where each came from. | `own` cannot be migrated safely for a store holding several records: position 0 is a guess, and it is the guess this review found failing. If v3 carries `own`, the migration has to ask, or take the record with a non empty `who` and the most recent `updated`, and say which rule it used. |

Two things that do not migrate cleanly, stated separately because they are the
ones that will bite.

**Any record whose `id` collides.** Importing an export already produces two
records with one id today. A v3 that keys anything on `id` inherits every
duplicate already sitting on people's disks. The migration has to detect
duplicates and re mint, and it has to keep the old id as `from` or a shared record
between two devices cannot be recognised.

**Any record refused by the v2 boundary.** It is not on the disk to migrate,
because the next save deleted it. That is the strongest argument for fixing the
erasure before the bump rather than after.

---

# The Performance Envelope

All measured in Chromium at 1600 by 1000 on the current build, five profile
shapes, each on its own page with the store seeded before the load. Times are the
mean of the repeat counts named in the harness.

| snapshots / stories / unique keys | store | boot to CURP | compute | loadProfile | pStore | pPersist | snapshot | render | seriesRead year | meterPlan |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 / 0 / 0 | 0.3 KB | 369ms | 0.37ms | 0.055ms | 0.05ms | 0.04ms | 0.24ms | 3.26ms | 0.01ms | 0.05ms |
| 1000 / 0 / 0 | 157 KB | 255ms | 0.22ms | 0.05ms | 1.57ms | 0.88ms | 0.21ms | 3.36ms | 0.37ms | 0.04ms |
| 0 / 1000 / 0 | 284 KB | 259ms | 0.19ms | 0.035ms | 0.46ms | 1.03ms | 0.23ms | 3.02ms | 0.01ms | 0.04ms |
| 1000 / 1000 / 10000 | 586 KB | 219ms | 0.27ms | 0.035ms | 3.07ms | 3.48ms | 0.46ms | 3.10ms | 0.40ms | **20.4ms** |
| 5000 / 0 / 0 | 787 KB | 309ms | 0.21ms | 0.035ms | 6.27ms | 5.86ms | 0.20ms | 3.40ms | 1.32ms | 0.04ms |

`compute()` costs a fifth of a millisecond and does not move with data volume,
because it reads the field and not the record. `loadProfile` is flat. `render()`
is flat at about 3.2ms. Boot to a usable `CURP` is 220 to 370ms at every scale and
the variation is noise, not shape. This agrees with `reviews/technical.md` pass 5
and with `STABILITY.md`, measured independently.

**Where it goes non linear.** One place, and it is new:

    meterPlan against the size of meter.unique
      100 keys       0.22ms
      1,000          1.48ms
      10,000        19.68ms
      40,000        97.50ms

`meterNext` (`schema.js:464`) rebuilds a lookup of every key the person has ever
opened, and `meterPlan` (`:472`) calls it once per address per channel, so the
cost is addresses times channels times the whole meter. Eight addresses and four
channels is thirty two rebuilds. It is called once per release pick
(`ui/release.js:22`), so today it is a 20ms stall for a heavy user and not a
frame problem. At tier three, 1,200 a month, a person passes 10,000 keys inside a
year and 40,000 in three.
*Fix: build the lookup once in `meterPlan` and pass it down. S, and it makes the
whole function flat.*

**What a thousand of each costs.** A thousand snapshots is 157 KB and a 1.6ms
boundary pass. A thousand stories is 284 KB. Five thousand snapshots is 787 KB
and a 6ms write. Everything is under a frame except the write at the top end,
and `reviews/technical.md` measured the real wall as capacity: about 4.75 MB for
the origin, one profile year at 0.134 MB. I agree with that number and I would
add one thing to it. The wall arrives sooner than profile years suggest, because
of pass one: reference case records accumulate in the same key, one duplicate per
persona per session, each with a full law table.

**The shape of the write is the thing to change.** Every save serialises every
profile, so the cost of writing one field is the cost of all the data. It is 5.9ms
today and it is also the reason two tabs lose records and the reason a refused
record is erased. One key per profile fixes the performance shape, the
concurrency shape and the erasure at the same time, which is why I would put it
ahead of the other performance work.
*M, and it is the only structural change I would argue for before the store
lands.*

---

# What I Would Refuse To Build On, And What I Would Keep

## Refuse

**The profile store, as a place to put anything new.** Not the schema, the store.
Position is identity, a refusal deletes, two tabs overwrite, and reference cases
are mixed in with the person's own records. Every one of those is in the write and
read path that a record fetch will join. Building the seam on top of this means
the first network feature inherits four ways to lose a record. The four fixes are
`own`, keep the refused, one key per profile, and rebuild `PROF_BY` from disk.

**`snapshot()` and `compute()`'s read of `CURP`.** Anything that plots, compares
or reports history is building on a function that does not read the profile it is
given. Analytics, the practitioner view and the cohort suite all sit on this.

**The outbox drain, as the pattern for the seam.** `bindSend` is the right shape
and the drain is the wrong implementation of it. It must not be the template for
`ui/net.js`.

**Badges as live tests.** If points and badges are built on `MARKS` as they
stand, they will un earn themselves and the product will have taken something
back from somebody. The dated first is the shape and it already exists.

## Keep Unchanged

`validateProfile`'s posture. Refuse by name, never clamp, fill a missing field
from the blank. It is the best thing in the codebase and every recommendation
above works with it rather than against it.

`bindStore`, `bindSend`, `bindPlan` and `hostfree.py`. The host boundary is
correct in shape and cheap to extend.

`TAB` against `TABDEF`, `TABREAL`, `TABFOLD` and `TABEXTRA`. Integers are
identity, display order moves, lookup is by `.k`. Do not touch it.

`read.js` as the front door, and the rule that it is the only thing permitted to
order the chain.

`plan.js`. Spend is derived, the tier in force is a function and not a field, an
unknown status grants nothing, an unknown tier is refused rather than rounded
down. It is ready for a processor to write into it.

`meter.unique` and `meter.firsts` as the two shapes for what happened. Append
only, dated, never derived. Everything the progression ladder needs is already
the right shape.

The comments. They are the reason this review could be written in one pass.

## Does The Impure Core Deferral Still Hold

Partly, and less than it did. `CLAUDE.md` defers purifying `compute()` on the
grounds that it is a signature rewrite and the interface has not settled. That
reasoning still holds for the big rewrite and I am not asking for it.

What no longer holds is the claim that the front door contains the impurity.
`read.js` contains it for callers that go through `read.js`. Three things do not:
`snapshot(p)` ignores its argument, `compute()` reads `CURP` for `unread` while
reading `S` for everything else, and `pSnap`, `pSave` and `pExport` are all called
directly from renderers while another profile's field is loaded. The result is
measurable and I measured it: a snapshot of an empty profile reading CQ 7.6, and a
reading whose number belongs to one person and whose `unread` flag belongs to
another.

So the deferral holds for the rewrite and does not hold for the two leaks. Both
are small and neither changes a signature:

    compute()'s measured comes off S.law and LAW_UNSET, not CURP      S
    snapshot(p) either loads p or drops the parameter                 S

After those two, the impure core is genuinely contained and the deferral is
honest again.

---

# Findings

| id | finding | file:line | sev | size |
|---|---|---|---|---|
| Y1 | `loadP(0)` restores the person's field from `PEOPLE[0].c` and then persists it, erasing the stored charge. Measured: anger 5.35 and fear 3.41 to zero, on disk, after one round trip through a reference case | personas.js:358, :409 | critical | M |
| Y2 | A record refused by the boundary is dropped from `PROFILES` and deleted from the disk by the next save. `storeRefused()` has no caller outside the gate | schema.js:192, :212; ui.js:915 | critical | S |
| Y3 | If the person's own record is refused, `CURP=PROFILES[0]` hands them a reference case with `S.who` 0 and `unread` false, and their next edit is written into it | ui.js:917, :924 | critical | M |
| Y4 | `obDrain` sends whatever is in `source.outbox` with no validation. Name, email, rid, story and axes all crossed a bound sender in a control run. Every one is on `OB_NEVER` | outbox.js:96, :36 | critical | S |
| Y5 | `accDelete` guards on `if(!pSave())`, and `pSave` returns `CURP`, so the guard cannot fire. With writes failing the app says "Deleted from this browser" and the record is still there | account.js:321; schema.js:217 | high | S |
| Y6 | `snapshot(p)` never reads `p`. Measured: `snapshot(B)` on an empty profile returned cq 7.6 with another field loaded, 36.0 with it cleared | schema.js:153 | high | S |
| Y7 | Story entries are unchecked at the boundary and two surfaces read `e.text` unguarded. An entry keyed `txt` throws "Cannot read properties of undefined", the same shape as tonight's boot failure | schema.js:309; imprints.js:133; analytics.js:218 | high | S |
| Y8 | A record from a newer build is refused whole and then erased by Y2. The version ruling is now a data loss path and does not need a network | schema.js:244 | high | S |
| Y9 | No gate boots the page with a record already on the disk. `monitor.js` "loaded" is an in memory persona; `functional.js` uses `localStorage` only to clear it | monitor.js:72; functional.js:376, :1589 | high | M |
| Y10 | Reference case records are persisted into the person's own store and duplicate once per session per persona. Measured 1 to 3 to 5 across two sessions | personas.js:404; ui.js:924 | high | M |
| Y11 | `compute()` reads `CURP.laws` for `measured` and `S` for everything else, so `CQ` and `unread` can belong to different people | compute.js:154 | high | S |
| Y12 | Two tabs on one device lose a whole profile silently. One key, whole array writes, no `storage` listener, no revision | schema.js:212 | high | M |
| Y13 | The release loop installs the opposite with no ceiling, and CQ peaks at opposite 6 to 7 and falls below its starting value at 10. Swept: 36.00, peak 54.84, 32.71 | release.js:78; compute.js:61 | medium | M, owner's call |
| Y14 | `UNDO` is module level and no profile switch clears it. Measured: A's charge 9 applied to B, labelled in A's words | undo.js:28; personas.js:350 | medium | S |
| Y15 | The boundary is strict on derived history, where one bad row refuses the record, and absent on the irreplaceable story text | schema.js:420 against :309 | medium | S |
| Y16 | `meterPlan` rebuilds the whole key lookup once per address per channel. 0.22ms at 100 keys, 19.68ms at 10,000, 97.50ms at 40,000 | schema.js:464, :472 | medium | S |
| Y17 | Importing your own export makes two records with one id and one name, and the boundary says nothing. `pExport` also mutates the record it exports | schema.js:219, :247, :654 | medium | S |
| Y18 | The fill in `loadProfile` is treated as the migration but is not written back until an unrelated save, and `saveProfile` stamps `v=SCHEMA_V` regardless of what was performed | schema.js:78, :150, :501 | medium | M |
| Y19 | An undated history row is dated now, and an unreadable band or tier is given `Heart` and `Collapsed`. Invented values in the one block that is validated hardest | schema.js:422 | medium | S |
| Y20 | `cqCeiling` and `cqHeadroom` decide a sentence a person reads and are not exported, so no gate can reach them | compute.js:255, :271; export.js | medium | S |
| Y21 | `rituals` passes the boundary as any object, and Ritual is now a primary surface with a tracker going inside it | schema.js:416 | medium | S |
| Y22 | `hostfree.py` does not forbid `WebSocket`, `EventSource`, `indexedDB`, `Worker` or `postMessage` | hostfree.py:16 | low | S |
| Y23 | The engine is host free and not clock free. 17 sites read the clock or the RNG. `ladder.js` takes the moment as an argument and the meter does not | engine/, ladder.js:18 | low | M |
| Y24 | A record with no `id` is given a new one at every boundary pass, so its identity moves every boot until something saves | schema.js:15, :247 | low | S |
| Y25 | `schema.js` is 658 lines holding the shape, the store, the boundary, the meter and the markers. `MANIFEST` plus `equiv.py` make the split cheap and provable | schema.js | low | M |
| Y26 | `dens` is the one storage key with no `source.` prefix | panels.js:449 | trivial | S |

## The Order I Would Take Them In

Y2, Y5, Y4, Y11, Y6 first. All S, all one to a few lines, and they close two
silent deletions, one false claim about deletion, one privacy breach and two
misattributions.

Then Y9, because after the five above it is the thing that stops the class coming
back. Then Y1, Y3, Y10, Y12 as one piece of work, because they are all the same
store.

# How Each Surprising Claim Was Checked

Every browser probe ran against `source.html` at md5 f304c295 through Chromium at
`/opt/pw-browsers/chromium-1194`, with `NODE_PATH=/opt/node22/lib/node_modules`.
Every engine probe ran against the `engine.js` built from this tree, in node 22.
Scratchpad, not the repo.

    Y1   control: apply a story, reload, charge survives. then the same with a
         reference case round trip. printed the disk at four points.
    Y2   control: one valid record survives a save with its id intact. then a
         refused record beside it, printed the disk before and after one save.
    Y3   seeded a store with a refused "You" and a valid "Marcus", printed
         storeRefused, PROFILES, CURP, PROF_BY, S.who, S.charge, unread and CQ,
         then made one edit and printed the disk.
    Y4   control: a valid enqueue is taken, an enqueue carrying a name is
         refused by name. then wrote the queue by hand and printed exactly what
         reached a bound sender, and ran obValidate on it to show the asymmetry.
    Y5   control: a working store reports ok. then rebound the store to throw
         QuotaExceededError and printed the return value, the status line and
         the disk. Reported the record count before and after.
    Y6   two calls to snapshot(B) on the same empty B with different fields
         loaded.
    Y7   control: a well formed entry renders 775 chars and reaches the story
         branch. then the same surface with an entry keyed txt.
    Y13  swept the installed opposite 0 to 10 at two law levels and printed Ig,
         It, poleMean and JQ beside CQ, so the peak is visible rather than
         asserted.
    Y16  four sizes of meter.unique, five calls each, in one page.

## Two Probes Of Mine That Did Not Settle, Kept In The Record

**A story applied while a reference case is loaded.** My first attempt clicked
the apply control before `stRender` had built it and reported no change
anywhere, which would have read as "no defect". The control failed, so I threw
the result away and rebuilt it. The second run, with a passing control, showed
the person's own words and a snapshot written into the Marcus record and the
charge landing on Marcus's axes. The cause is that `ui/storyui.js:89` calls
`toYou()` after the write, where `ui/release.js:64` calls it before, with a
comment explaining why the ordering was moved. The story path did not get the
same fix. I have not given it a finding id of its own because Y1 and Y3 cover
the same ordering, but the one line to change is `storyui.js:89`.

**The quota wall.** I tried to force `pPersist` to fail by filling the origin
with ballast to `QuotaExceededError` and then saving. The save succeeded, because
overwriting an existing key of similar size is allowed. So I cannot claim
anything about the natural quota path from that run and I did not. Y5 was proved
by rebinding the store to throw, which is the mechanism, not the trigger.
`reviews/technical.md` measured the ceiling at 4.75 MB and I am citing that
rather than a number of my own.
