# The Avatar, the Purpose Map and the boundary

The becoming half of the product. Release empties an address. Replace fills it.
Neither of them says what the person is filling it toward. The Avatar is that
target, and it is the thing that turns a sequence of releases into a direction.

This document is a design. The only code it has changed is the horizon and the
marker ladder, which the owner ruled in this pass and which is built, gated and
described in section 5. Everything else here is specified and not built.

---

## Where this comes from

Not invented here. Scanned out of the original Atüned build and the codex, and
quoted rather than paraphrased so the port is a port.

- **The app.** `_migrate/build/index.html`, 1.33 MB, the original Atüned. The
  Avatar is there and shipped: `AVATAR` at line 8672, `avatarGap` at 8684,
  `avatarProgress` at 8694, `avatarActivate` at 8704, `toolAvatar` at 8718, the
  two journal questions at 8905, the onboarding seed at 12663, the door at
  2918 and 13844.
- **The product bible**, `ATUNED_PRODUCT_BIBLE_v1.md`, decision log entries 237,
  238, 246, 263, 264, 265, 266, 268, 392, 425, 434, 598, 635, 636, 637, 645.
- **The codex**, `index.html` in this repo, for the Purpose Map, the boundary
  and the developmental thresholds.

The boundary tool is **not in the app**. The bible's artifact register names
`ATUNED_AVATAR_AND_BOUNDARY.md` and `Mock_Boundary.png`, so it was designed and
mocked and never built. The codex holds its definition, and that is the ground
this design stands on.

---

## 1. What the Avatar is

The owner's own sentence, from the code comment at line 8669:

> one side is who the person is at their best, the other is who they are not.
> It is not a diagnosis and the app never rules on whether an attribute is a
> real edge or a saboteur wearing a virtue. That depends on where they are in
> their growth, and it is the thing they revise upward as they climb.

Two columns of attributes. Left is who you are becoming. Right is the inversion
of the same attribute, in the person's own words. They are written as a pair,
never separately, because the pair is what makes the attribute addressable: the
left side is a value and a value has no address, while the right side is a
sentence about a bad day and a sentence about a bad day parses.

Verified in the bible at entry 267, on Sofia:

> I leave work at work resolves to Heart, heavily impaired, 3 holding, weight
> 69. The furthest attribute routes straight to a release.

That is the whole mechanism. The right side is fed to the resolver, the
resolver returns a seat, the seat has live imprints, and the imprints have
weight. The gap between who a person is and who they are becoming is not a
mood, it is a number at an address.

### Why it is the missing piece

The product currently measures the field and moves it. It has no statement of
where the person is going, so every release is correct and none of them is
aimed. Three things change the moment the Avatar exists:

- **The release queue gets an order.** Today the heaviest address wins. With an
  Avatar, the heaviest address *standing in the way of a named attribute* wins,
  and the person can see why that one came up.
- **The replacement gets a target.** `relCoolDown` installs the coherent
  opposite at 62 percent of what it removed, and the coherent opposite is
  currently whatever the axis says it is. With an Avatar the axis opposite is
  the floor and the person's own attribute is the ceiling.
- **The reading gets a destination.** The scale says Oscillating. It does not
  say Oscillating on the way to what. `avatarProgress` answers that from work
  done rather than from work declared.

---

## 2. Both sides are tags, which is the owner's ruling

Each attribute pair becomes two tags on the same object:

    {be:'I leave work at work', notbe:'I take every meeting home with me'}

The tag on the right resolves to a seat, a band and a set of live imprints. The
tag on the left is what the replacement statements are steered toward. So one
written pair reaches four systems that already exist:

| Existing system | What the tag does to it |
|---|---|
| Imprints | the right tag matches imprints by seat, so an imprint can say which attribute it is blocking |
| Child fetters | the seat resolves to an axis, so the attribute has a pole and a coherent opposite |
| Saboteurs | a named saboteur firing at that seat is named on the attribute row |
| Release | the queue sorts by attribute distance, not only by weight |
| Replace | the install statement is written toward the left tag |

Nothing new is measured. The tag is a join, not an instrument.

**The routing is one way and it matters.** The right tag steers the **release**,
because that is what is in the way. The left tag steers the **reframe**, because
that is what is being installed. Wiring them the other way round would have the
product releasing a person's values, which is the one thing it must never do.

### The app never rules on the attribute

Entry 264 is a standing ruling and it survives the port:

> The app never rules on whether an attribute is a real edge or a saboteur
> wearing a virtue. That depends on where they are in their growth. It is a
> target they revise upward as they climb.

So `I am always the strong one` is accepted as written. It may be a value at
CQ 30 and a saboteur at CQ 70. The product does not adjudicate, it measures the
distance to what the person wrote and shows them what is in the way. The monthly
review is where the person revises it, and the review exists precisely because
the product will not do it for them.

---

## 3. How it is written, and how it fills itself

Three sources, in order of how little the person has to do.

**Seeded at onboarding, from answers already given.** Line 12663 of the original
does this without a word being typed:

    if(ONB.sleep==='deep'||ONB.sleep==='wake')
     AVATAR.be.push({nm:'I rest properly', inv:'I have not slept properly in weeks'});
    if(ONB.breath==='low')
     AVATAR.be.push({nm:'I breathe low and slow', inv:'my chest is tight and my breath is high'});

Two attributes from seven onboarding items. The Avatar is never empty, which is
the difference between a feature and a blank form.

**Written in the journal, through two questions.** From line 8905:

> Describe yourself on your best day. Not what you achieved. How you were.

> Now the opposite. On your worst day, who runs the show?

These are already in the question rail and already routed. They fire when the
Avatar is due, which the original checks first, ahead of every other question.

**Harvested from what cleared.** A release that empties an address the resolver
already tied to an attribute is evidence for that attribute. The person is
offered the sentence back and can promote it. This is the loop closing: the work
writes the target, and the target orders the work.

---

## 4. The Purpose Map and the boundary, ruled

The owner's model, given in full and superseding the codex sketch. The codex
draws the geometry. This says what the geometry means.

**Meaning is the end point of expression. At the end of expression, meaning
creates purpose.** That is the direction of the whole object and it runs one
way: expression, then meaning, then purpose. Purpose is never entered. It is
what is left standing at the end of the other two.

**The upward triangle is the higher purpose.** The soul's. Its corners are
values, entered by the person, and the soul's values are universal: freedom,
free will, knowledge, wisdom, that register. The centre point of the triangle is
the sum of the three corners.

**The downward triangle is the earthly purpose.** The ego's. Its corners are
also values, entered by the person, and the ego's values are the ones with a
body attached: health, fitness, financial stability, wealth, family. Its centre
is likewise the sum of its three.

**Overlaid, the two centres answer two different questions.** The upward centre
is what motivates you in the spirit. The downward centre is what drives you on
the earth. And the relation between the two is the useful one:

> the purpose between those two tells you how you make money and then how you
> find fulfilment doing it.

So the product asks for six and reports three. Six values in, purpose out twice,
plus the line between them. A person cannot type any of the three outputs.
Purpose is derived, ruled.

**The overlap is a hexagon and the hexagon is the boundary.**

> when you overlap those two triangles, that six-sided shape is the boundary of
> your behaviour. That is what is your containment. This is a mirror you hold up
> to yourself.

Its six sides are the six relationships the codex names: partner, family,
friends, community, coworkers, alone. Five commitments each, thirty in total.
Inside is yours to protect. Outside is choice.

### How it connects to the Avatar

    Avatar         who you are becoming          revised monthly
    Purpose Map    what that is for              revised rarely
    Boundary       what is yours to protect      tested daily

The boundary is the one that touches the release work every day, because a
crossed boundary is a stress response and a stress response is an imprint. A
person with thirty commitments written has given the journal thirty things to
notice, and the resolver can say which side of the line an entry sits on. That
is the first time this product could tell a person why the charge landed rather
than only where.

The corpus already carries the release for it:

> State one boundary once, plainly, and do not repeat it.

> Solar release on resentment, then one boundary stated once.

The ritual step exists. It needs the tool, not the copy.

### On the objection, withdrawn

The last pass called thirty commitments a lot to ask, and put it to the owner as
a friction problem to be fixed by seeding the sides out of the journal.

That was wrong, and it is worth recording because it is a failure mode this
project will meet again. Thirty was costed as onboarding, and the instinct that
applies to onboarding is to reduce what is asked. This is not onboarding. It is
the instrument, and the instrument is a mirror a person holds up to themselves
for as long as it takes to clear what they are carrying. Asking somebody to name
thirty things they will protect, across the six relationships they actually live
in, is not friction. It is the tool working. A mirror you have only half
described shows you half of yourself.

The seeding idea survives on its own merits and only on them: an entry a person
already wrote is better evidence than an answer they gave to a form, so the
journal should be able to propose a side and the person accepts or rewrites it.
That is a different argument from the one made last pass and it does not reduce
the thirty. The count stands.

## 5. The ladder is a fraction of the person, not a table of counts

The owner's ruling, and it overturns what the engine shipped this morning.

> remember, it's a percent of a person's total age. I had to release 15,000 by
> the time I was 50.

> a person who's 30 may not have to release 2,500 patterns. They're going to
> release a percent smaller.

**The arithmetic, stated rather than rounded.** Fifteen thousand by fifty is
three hundred a year and three thousand a decade. The estimate given out loud
was a little over two thousand a decade; the anchor says three. Every marker in
the product derives from this figure, so it is worth being exact: the engine now
carries three hundred a year, against the two hundred it had.

**The three named thresholds are exact thirtieths of that total.**

    breaking duality        500  of 15,000   =  1/30
    beginning of nirvana 10,000  of 15,000   = 20/30
    ascension            15,000  of 15,000   = 30/30

And the three the book already names fall on thirtieths too:

    the still mind        2,500  of 15,000   =  5/30
    the open heart        3,500  of 15,000   =  7/30
    clear perception      4,500  of 15,000   =  9/30

One, five, seven, nine, twenty, thirty. The absolute counts were never a ladder.
They were one man's numbers at one man's age, and the ladder underneath them is
a fraction of whatever a person is carrying.

**So the ladder resolves against the reader.** Entry stays absolute, because a
first address is a first address at any age. The other six are computed from the
person's own horizon the moment a birth date exists:

    age 20   load  6,000    200 · 1,000 · 1,400 · 1,800 ·  4,000 ·  6,000
    age 30   load  9,000    300 · 1,500 · 2,100 · 2,700 ·  6,000 ·  9,000
    age 40   load 12,000    400 · 2,000 · 2,800 · 3,600 ·  8,000 · 12,000
    age 50   load 15,000    500 · 2,500 · 3,500 · 4,500 · 10,000 · 15,000

A twenty year old does not reach ascension at fifteen thousand. They reach it at
six, and it is the same distance, because it is all of what they are carrying.
Ascension is the whole of it for everyone, which is the only definition that
survives the owner's own framing:

> ascension in this state simply means you're no longer being stimulated by the
> external environment.

Nothing is left to be stimulated by. That is a complete clearing, not a
milestone, and it cannot be a fixed number in a table.

**Until a birth date exists the surface says whose numbers it is showing.** A
record with no birth date reads against the reference scale, which is the
owner's own, and the read carries `scaled:false` so the surface can say so. A
distance computed from somebody else's age is a different claim and the product
has to be able to make that visible.

**One seam left open and it is his.** He observed that younger people are more
identified, which raises the yearly rate for later cohorts rather than lowering
it. That is a real effect and not yet a number, so `PAT_COHORT` exists,
multiplies the rate, and is one. The shape is in without the figure being
invented.

**And the book now disagrees with the product.** The codex prints
`Ascension (11,664)`, the square of the node count. The owner says fifteen
thousand. His ruling governs, the number moved, and the disagreement is recorded
in `BOOK-ERRATA.md` as the book's to settle rather than quietly dropped.

## 6. What this needs from the schema

Additive, and small, because the resolver and the meter already do the work.

    avatar: {
      built:      false,
      at:         null,        /* when it was first written */
      reviewedAt: null,        /* monthly review, a ritual step */
      pairs:      [ {be:'', notbe:''} ]
    }
    purpose: {
      soul: ['','',''],        /* upward triangle, the higher purpose */
      ego:  ['','',''],        /* downward triangle, the earthly purpose */
      sides:{ partner:[], family:[], friends:[],
              community:[], coworkers:[], alone:[] }       /* five each, thirty */
    }

Six values in. Nothing else is stored, because everything else is derived: each
triangle's centre is the sum of its three corners, the line between the two
centres is how a person makes money and how they find fulfilment doing it, and
the hexagon is the overlap. A derived value that is also stored is a value that
can drift.

Validated at the boundary in the existing refuse by name style: a pair missing
either half is refused, a side holding more than five is refused, and an older
profile without either object is filled from the blank. Nothing is clamped.

New pure functions, all host free and all reading existing state:

    avatarGap(pair)        seat, weight and nerve state standing in the way
    avatarProgress()       done against total, read from cleared ground
    avatarDue(now)         thirty days since the last review
    purposeCentre(three)   the sum of a triangle's corners, derived and not typed
    purposeLine()          the relation between the two centres
    boundaryCross(imprint) which side of the line an imprint landed on

`avatarGap` is a port. The original is fifteen lines and its body and signature
come across unchanged, per the standing rule.

---

## 7. Where it lives on screen

The owner ruled this in the original and the ruling holds, bible entry 425:

> AVATAR sits in the CENTRE OF THE RING. It is the summary of everything, so it
> is the middle of the thing that summarises. Tap the ring, not a row.

This product already has that ring and already has a number in the middle of it.
The core of the wheel is the door. Entry 598 records that it was nearly broken
once by `pointer-events:none` on the label, which is worth knowing before it is
wired.

The Purpose Map is its own surface and not a pane of the Avatar, because it is
revised on a different clock and because the geometry needs the whole stage. The
boundary sits inside it as the outer hexagon, not as a separate tool, since the
codex draws them as one figure.

---

## 8. Open, and whose call

- **The cohort rate.** Younger people are more identified, so later cohorts
  carry more per year rather than fewer. `PAT_COHORT` is the seam and it is one
  until he sets it.
- **The Buddha and Christ and Musashi compass.** Asked for separately and it is
  a different object: a compass of people, not a ladder of thresholds. It should
  not share the marker table. Whether it is built at all is his.
- **Whether the Avatar is free.** It is the piece that makes the release work
  feel aimed, which argues for free. It is also the piece that makes a plan
  worth renewing, which argues for paid. Not mine.

