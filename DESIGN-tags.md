# Tags. Whether the system earns its place

Answers TG1, TG2 and TG3 in `TASKS.md`, and the queue questions QU2 and QU3
that depend on them.

Everything below is read off the built software at commit `78964c3`,
`engine.js` md5 `07631d81c8af769a51fce10489da5c73`, `source.html` md5
`57c97a3fd9eae10117f89aaaa24146bb`. `node tests/engine.js` on that build:
**1083 passed, 0 failed**. Neither built file is dirty in the working tree.

Every probe used here was checked against a case whose answer the product
already states before it was trusted. Those checks are printed where they
happened.

---

## The one line

**Do not build a tag system.** Build one closed `kind` field on a ritual, three
values, validated by name against a table, and nothing else. The word tag is
already taken by the codex for a different thing, and every dimension a free
tag would carry is already carried by a named family that something measured
put a person into.

---

## 1. What the product already names

### The count is not eleven. It is twenty eight.

The criterion used: a closed set of named members that the product classifies
something into, and that has a single owner. Counted off the build:

| naming system | members | who sets the value | table |
|---|---|---|---|
| addresses | 112 | engine | `NODES` |
| axes, the nine | 9 | measured | `CHILD` |
| laws of moral integrity | 21 | measured | `SI` |
| saboteurs | 33 | derived | `SAB33`, 39 with the seat derived ones in `ALL_SAB` |
| hyper complex families | 6 | derived | `HCX_LIB` |
| blueprint domains | 19 | chosen | `DOMAINS` |
| archetypes | 12 | chosen | `ARCH` |
| masks | 6 | derived | `MASKS` |
| seats | 7 | derived | `BANDS` |
| coherence bands | 10 | derived | `TIERDEF` |
| expressions | 10 | derived | `EXPR` |
| VERP gates | 6 | measured | `VERP` |
| practices | 17 | library | `PRACTICE` |
| practice tracks | 4 | library | `PRACTICE[].track` |
| practice tiers | 3 | library | `PRACTICE[].tier` |
| marks | 16 | earned | `MARKS`, in 3 families |
| ladder markers | 7 | derived | `MARKERS` |
| Inferno circles | 9 | chosen | `CIRCLES` |
| compass mirror axes | 8 | derived | `MIRROR` |
| plan tiers | 6 | record store | `PLANS` |
| age ladder questions | 16 | answered | `AGES` |
| stated types | 16 | stated | `TYPE16` |
| purpose sides | 6 | answered | `PUR_SIDES` |
| release channels | 4 | engine | `CHAN`, `ui/release.js:7` |
| release verbs | 9 | engine | `C3_VERB` |
| pattern kinds | 6 | engine | `C3_KIND` |
| outbox kinds | 4 | engine | `OB_KINDS` |
| reference roster | 14 | authored | `PEOPLE` |

**28 naming systems. 396 named members.** The eleven in the question are the
eleven that reach a person's reading. The other seventeen are real and carry
the same maintenance cost.

### And the product already has the thing a tag is for

336 entries exist whose entire job is to take words a person actually typed and
land them on those families: `LEX` 231, `ADJ2CHG` 83, `PHRASES` 22. That is the
answer this product has already given to "a person's own language". It is a
resolver, not a label. The person types freely and the instrument resolves,
which is the opposite of the person choosing the vocabulary.

Measured, one sentence in, one call:

    parseStory("I am always so angry at my boss and I feel worthless
                and scared of money")

    hits      6
    bands     {solar:44, root:18}
    charges   {anger:1, shame:1, fear:1}
    imprints  8, the first being
              {node:33, name:"Pride", band:"Solar", fetter:"Anger",
               inferred:false, amt:2.5, from:"solar"}

Nine words of ordinary speech produced a node integer, a seat, an axis, a
fetter name and a weight. No tag was typed and none could have improved that
row.

### The dimension a free tag would carry

**There is none.** Every candidate resolves to a family that already exists,
and the family is better because a number put the person in it.

| what a tag would be for | already carried by | and it is better because |
|---|---|---|
| what this is about | `NODES`, `CHILD`, `SAB33`, `HCX_LIB` | it is resolved from the words, not chosen |
| where it sits | `BANDS`, node integer | it has a position on the body |
| how bad it is | `sq`, `amt`, `TIERDEF` | it is a number, so it sorts |
| what kind of thing | `C3_KIND`, 6 named kinds | it has examples attached |
| who it involves | `PUR_SIDES` via `boundaryCross` | it is resolved from the words too |
| what to do about it | `PRACTICE`, `track`, `tier` | it maps from the seat carrying the most |
| when it happened | `t` on every record | it is a date, so it sorts |
| how to find it again | five grouping axes, below | built, and needs no typing |

The retrieval case is the strongest one for tags anywhere, and it is built.
`ui/imprints.js:9` offers five ways to group a person's own material:

    IMP_GROUPS = [['band','Seat'], ['charge','Charge'], ['sab','Saboteur'],
                  ['story','Story'], ['expr','Expression']]

And a journal entry is already stored classified. `ui/storyui.js:85` writes
`{t, text, imprints:<count>, bands:{seat:amount}}`, so every entry carries the
seats it loaded and how much. `ui/analytics.js:218` already filters entries by
seat off that field, and `ui/imprints.js:129` already reads an entry's seats
back. A person can find the entries that loaded their throat today, without
having tagged anything.

### The word is taken, and that is not a quibble

`GLOSS` has 56 entries. Four of them use the word tag, and one of them is the
definition:

> **Tag.** The moment a charged experience is named and coded at a node
> address. The name locks the experience in. The tag is what the body scans for
> in all future input, firing the resident pattern when it finds a match.

And two more are built on top of it:

> **Limiting belief.** A tag that compresses the full range of experience into
> a limited label.

> **Justification mechanic.** Blame, deflection, rationalization, all are the
> tag's immune response.

In this product a tag is the injury. It is the naming that locked the
experience in, and the whole instrument exists to release it. A feature called
tags, where a person adds their own labels, is the mechanism the codex names as
the cause, offered as a tool. Under the standing one word per concept rule that
is a collision, and it is the worst kind: not two names for one concept, but
one name for two concepts, where the two are opposites.

`DESIGN-progression.md:223` already uses the word in a third sense, Peloton's
own controls to "hide tags". Three meanings before anything is built.

### What a twenty ninth naming system costs, measured on an existing one

`BOOK-ERRATA.md:61`: the glossary says eight hyper complexes, every other
passage says six, and the engine has six. Verified on this build, `HCX_LIB`
carries 6. That is one count, in one family, with one owner, and it still
drifted. Four other counts checked against the glossary on the same run agreed:
addresses 112, saboteurs 33, archetypes 12, laws 21. So the failure rate on
closed families with an owner is one in five, and those all have gates.

A free tag has no owner, no count and no gate. There is nothing to reconcile it
against, so drift is not a risk, it is the resting state.

---

## 2. The three uses he named, tested

### The three ritual kinds. It is a field, not a tag

The three kinds are: what a person always has to do for the avatar to be
fulfilled, what is designed to transform behaviour, and what belongs to the
release protocol. That is three values. It is exhaustive, it is his to name, and
a ritual is exactly one of them.

That is a field with three values, which is the cheapest thing in this schema
and has two working precedents:

    plan.tier      refused by name against PLAN_BY
    seed.type      refused by name against the sixteen

Measured, both refuse rather than clamp:

    plan.tier = "platinum"
      -> ok=false  ["plan.tier is not a tier this build knows: platinum"]

A tag cannot do this job at all, and the reason is arithmetic rather than taste.
The avatar kind is the one whose whole purpose is that it is **mandatory**.
Something mandatory has to be countable: how many are there, how many are done,
is the avatar fulfilled. A free tag gives no denominator, because a person can
add a fourth spelling of the same kind and the count moves. Two people tagging
`daily` and `Daily` are in two kinds. A closed field cannot do that.

The ritual record already carries two closed classifications of exactly this
shape, written at `ui/ritual.js:186`:

    {t, track, band, steps:[practice keys], min, when, where, done}

`track` is one of four. `band` is one of seven. `steps` are practice identity
keys. `kind` sits beside them and reads the same way. It is roughly a line in
the writer, a line in the boundary and an entry in a table.

**One warning on the third kind.** Rituals that belong to the release protocol
are not a new object. A release is already tracked, and not in `rituals`: it is
`meter.unique`, keyed by address and channel and line. If a release ritual
writes its own record too, the product holds two answers to how much ground was
opened, and DECISIONS is explicit that the cursor is read and never stored for
exactly this reason. A release kind ritual must point at the run rather than
restate it.

### The queue. A tag lets the sniffer propose nothing it cannot already

QU4 is the requirement that decides this: "Ordered, not listed. A queue that is
a list is a backlog." **A tag carries no magnitude, so it cannot order
anything.** That alone disqualifies it as the queue's organising field.

What orders the queue exists and is measured. Both proposers he named are
already built, in embryo, at `ui/storyui.js:103` to `:130`:

    ST_RELSRC = 'heavy'    r.loaded sorted by sq, descending
    ST_RELSRC = 'story'    ST_PARSED.imprints, this story's own hits

That second one is the sniffer proposing into a queue. It already resolves the
words to node integers, caps at `RUN_MAX`, and prices the run through
`meterPlan`, which is the same call the run itself makes, so the person sees the
real cost and not an estimate. What is missing is not a tag. It is that this
proposes only into a release run and never into a ritual, and that there is one
queue rather than two panels.

There is one person supplied annotation already ruled, and it is not a tag.
DECISIONS, on the free tier: "the swap is decided by weight: what a person marks
heavy stays, what sits light drops off first." A weight. **It is not built**,
confirmed by grep across `atuned_src/`. That is the annotation to build, and it
beats a tag on every axis that matters here: it is a number, so it range checks,
it sorts, and it can never carry a name off the device.

### The avatar. It already has a cross cutting join, and it is measured

`engine/avatar.js:39`, `avatarGap`, is the mechanism the tag was supposed to be:

    the right side of a pair, free text
      -> the resolver returns a seat
      -> the seat has live imprints
      -> the imprints have weight
      -> {seat, load, ig, clear, at}

"The distance between who somebody is and who they are becoming is not a mood,
it is a number at an address." The avatar's link to everything else is a
resolved seat plus a load. `avatarProgress` then reads completion "from work
done rather than from work declared".

A tag on an avatar pair would be work declared. It would be a second route to
the same join, unmeasured, and the two would disagree the first time a person
tagged a pair with a seat the resolver does not agree with. `boundaryCross` in
the same file does the identical trick for the six purpose sides, resolving a
name in the text to a side rather than asking for a label.

So on all three: no.

---

## 3. The price

### It is a schema change, and the cost is not the field

The boundary was probed. Self check first, on three cases the product already
states the answer to:

    blank profile validates                              true
    plan.tier = "platinum"        refused by name        "not a tier this build knows"
    axes.Fear.held = 9999         refused, not clamped   "is 9999, outside 0 to 10"

The probe is behaving. Then the ritual record, which is where the tags were
going to go:

    rituals = [{ t, track:"NotATrack", band:"NotASeat",
                 steps:["nosuchpractice"], min:-5,
                 when:<5000 characters>, where:"<an email address>",
                 done:"yes", tags:["a","b"],
                 secret:"sk_live_123", email:"a@b.com",
                 note:<100000 characters> }]

    validateProfile ->  ok = true, no errors
    kept keys:  t, track, band, steps, min, when, where, done,
                tags, secret, email, note

**Every one of those survived.** `atuned_src/engine/schema.js:437` is the whole
check:

    if(Array.isArray(o.rituals))p.rituals=o.rituals.filter(function(x){
      return x&&typeof x==='object';});

`story.entries` at `schema.js:330` is the same, a bare `.slice()`.

Three things follow, and the first two are defects that exist today,
independent of tags.

1. **`rituals` and `story.entries` are the two bags the boundary does not
   look in.** Everything else is typed, bounded and refused by name: avatar
   pairs at 200 characters, purpose values at 120, meter keys at 64, and a
   dated first checked field by field. These two are not.
2. **The same field name is refused under `plan` and accepted under
   `rituals`.** `plan.email` and `plan.secret` are both refused by name, from
   the explicit list at `schema.js:385`. Inside a ritual they pass silently,
   including the literal `sk_live_123`, which is the exact prefix the billing
   gate sweeps the build for. The gate sweeps the build. It does not sweep a
   record.
3. **`when` came through at 5000 characters where the control caps it at 40.**
   `ui/ritual.js:133` sets `maxlength="40"`. A `maxlength` is a control, not a
   boundary.

So the honest price of a tag system is not one field. **A tag array already
passes `validateProfile` today with no schema change at all**, which means it
would be built in the one place nothing is checked, and nobody would notice
until a record came back wrong. Building tags properly means first closing the
`rituals` bag, which is work that should happen anyway.

### What validation a free tag actually gets

Free text cannot be range checked. This is the real answer, and it is thin:

| check | possible | worth having |
|---|---|---|
| is a string | yes | yes |
| length ceiling | yes | yes, and refused rather than truncated |
| count ceiling per record | yes | yes |
| looks like an email or a phone number | yes, `obValidate` already does it | yes, and it will miss things |
| is one of a known set | **no, that is what free means** | it is the only check that catches a wrong value |
| carries no name | **no** | this is the one that matters |

`obValidate` in `engine/outbox.js` is the existing precedent and it says so
about itself in the code: "This will not catch a first name in a sentence and
nothing anywhere may claim that it does."

That leaves a tag with typed, bounded and counted, and nothing else. Compare the
three value field, which gets all of that plus refused by name, which is the
check that catches an actual mistake.

### The record goes off device, and this is where it stops being cheap

DECISIONS is settled on three things a tag runs straight into.

**"We do not keep the record joined to the story."** The record identifies, the
story does not. A tag a person typed is the story, in miniature. It is their
words about their own material. Put it on the record and the record now carries
the person's words, which is the join the promise forbids, in the smallest and
easiest to overlook form there is.

**The lead sees outputs, not words.** Measured on this build:

    LEAD_SEES    fetters, saboteurs, complexes, hyper complexes, analytics
    LEAD_HIDDEN  the story cloud, the spiritual material, the tools themselves

    leadSees('fetters')  true      leadSees('story')  false
    leadSees('tags')     false

Every one of the five a lead may see is engine derived. Nothing a person typed
is on that list, and the first thing on the hidden list is the person's own
words. So a tag is caught in a vice with no good end:

- Show tags to a practitioner, and the product has shown a practitioner the
  person's own words. That is the story cloud arriving through a side door,
  against a ruling that DECISIONS records as having **tightened** from an
  earlier position that had a practitioner seeing stories.
- Hide tags from a practitioner, and the tag earns nothing in the practitioner
  model, which was one of the few places it looked useful.

**The name never leaves the device.** DECISIONS already records this as open and
unsolved for stories: "a story is free text, so a name can be inside the story.
Stripping named entities on device is the only way that holds, and it will miss
some." A tag is free text. It inherits that open problem in full and adds a
second place it has to be solved. `my mum` and `Sarah` are both plausible tags,
and one of them is a third party's name in a record that goes off device.

**The outbox would need a thirtieth name on its refusal list.** `OB_NEVER`
carries 44 names, including `story`, `journal`, `imprints`, `avatar`, `purpose`
and `meter`. `tags` is not on it. The envelope is allowlisted at `OB_KEYS`, so
nothing leaks today, but the pattern is clear: every person authored field in
this product has had to be named on a refusal list, and somebody has to remember
to add the new one.

### The consent a tag would need

If tags are ever shown to a practitioner, they need their own grant, separate
from the existing one, with its own line in the consent list and its own
revocation. That follows from CLAUDE.md: "A practitioner seeing somatic and
psychological self report is a consequential grant. It needs explicit consent, a
visible list of who has sight, and revocation. Never a silent default."

The reason it cannot ride on the existing grant is that the existing grant is
scoped to derived outputs. A person consenting to a lead seeing their saboteurs
has consented to seeing arithmetic about themselves. They have not consented to
their own sentences being read, and the product must not treat the two as one
permission.

**A closed three value `kind` field needs none of this.** It is not the person's
words. It is a selection from a list the product wrote, exactly like `track` and
`band` are today, and it is safe to show a lead for the same reason
`leadSees('analytics')` is true.

### Version bump

**No.** The three value field is additive, and a v1 or v2 record with no `kind`
on a ritual reads as an older record and is filled from the blank, which is the
standing rule. Nothing breaks and nothing needs to move.

Whether schema v2 itself is settled is the owner's call and is untouched by
this. Recorded in DECISIONS as his, and this recommendation does not need it.

---

## 4. The argument, short

The product's whole method is that a person speaks in their own words and an
instrument resolves those words onto named, measured, positioned things. 336
lexicon entries exist to do that. Twenty eight families exist to be resolved
onto. Five grouping axes exist so a person can find their own material again.
The avatar resolves a free sentence to a seat and then to a load. The journal
already stores which seats an entry landed on. Every one of those is the product
doing the work so the person does not have to.

A tag system inverts that. It asks the person to supply the vocabulary, which
means supplying a classification with no measurement behind it, no position on
the body, no magnitude, no owner and no gate. It is the one kind of field this
instrument has spent its whole architecture avoiding. And the word for it
already means, in this product's own glossary, the act of naming that installed
the pattern in the first place.

The three kinds he named are real and worth building. They are a field.

---

## 5. What to build, named exactly, and nowhere else

Answering TG2 by naming every place, which is the condition for building
anything here.

1. **`ritual.kind`, one of three values.** Named by him. Validated by name at
   the boundary against a table, refused rather than defaulted, exactly as
   `plan.tier` is. Additive, so an older ritual with no kind reads as an older
   record.
2. **Close the `rituals` bag first**, at `schema.js:437`. Type and bound every
   field the writer at `ui/ritual.js:186` actually writes: `track` against the
   four, `band` against the seven, `steps` against the practice keys, `min` in
   range, `when` and `where` at the 40 the control already claims, `done` as a
   boolean or a date. Refuse anything else by name, the way `plan` does. This
   is worth doing on its own and it is a prerequisite for anything that adds a
   field there.
3. **Close `story.entries` at `schema.js:330` the same way**, since it is the
   other bag and it holds the most sensitive field in the product.
4. **The weight, not a tag.** Build the person supplied weight that DECISIONS
   already ruled and nothing implements. A number in a fixed range, which range
   checks, sorts, orders the queue, and can never carry a name off the device.
5. **One queue, ordered, fed by what already proposes.** Lift `ST_RELSRC` out
   of the release panel into the queue, and let both sources feed it: heaviest,
   by `sq`, and this story, by the sniffer's own hits. The avatar's proposal is
   `avatarGap` sorted by `load`. All three order by a measured number. None of
   them needs a new field.
6. **Colour, RC6, against the kind.** RC6 asks whether colour goes against the
   kind, the seat or the track, and notes the seat is spoken for everywhere
   else. The three kinds are the answer. Three values is a palette a person can
   learn. A free tag set is not.

**And nowhere else.** No tags on imprints, no tags on journal entries, no tags
on avatar pairs, no tags on the queue. Each of those already has a derived
classification that a measurement put there, and adding a typed one beside it
creates two truths about the same object, which is the failure this repository
has already recorded under storing a derived value.

---

## 6. Incidental, found on the way

- `CLAUDE.md` states the engine gate at 843. It ran **1083 passed, 0 failed** on
  this build. The file's own rule applies: read the count off the run. Not
  edited here.
- `BOOK-ERRATA.md:61` on the hyper complex count is confirmed against this
  build. Glossary 8, `HCX_LIB` 6.
- The word tier now means three different things in the engine: a coherence
  band in `TIERDEF`, a price rung in `PLANS`, and a difficulty step in
  `PRACTICE[].tier`. Three concepts, one word, already shipped. It is the same
  class of problem as the tag collision and it is worth a separate look. Not in
  scope here.
