# The Avatar

The centre of the product, ruled 20 September. His words: "It is also tied into
the avatar. You are looking at your avatar improve, shown by the releases, by
going through the discover play flow mechanic. So the avatar itself becomes the
centrepiece. What is Atuned? Your avatar. So we are sewing all of its layers."

And, mid pass, the sharpening that changed what this document had to be:

> This has got to be rock solid. You have got to feel like this is the very
> first tool that makes you feel like you are not only seeing yourself, but you
> are able to fine tune who you are.

An avatar a person reads is a portrait. An avatar a person turns is an
instrument. Everything below is built to the second sentence.

Three runnable prototypes sit in `proto/avatar/`. They load the product's own
`engine.js` and compute live, so every number in them is the arithmetic and not
a stored frame. Press them.

    proto/avatar/index.html            the three, with their costs
    proto/avatar/one-armature.html     the recommendation
    proto/avatar/two-lantern.html
    proto/avatar/three-seam.html
    proto/avatar/engine.js             a COPY of the build product, not an edit
    proto/avatar/gen.js                the four month walk, regenerable

`proto/avatar/engine.js` is a byte copy of the repository's `engine.js` so the
pages run from a folder and need no network. It is a copy and never a fork:
nothing in `proto/` is read by the build, and re-syncing it is `cp engine.js
proto/avatar/engine.js`. It was re-synced after another seat changed the
engine mid pass and every number in section 5 came back identical.

---

## 1. WHAT EXISTS TODAY, MEASURED

### The engine half is built and it is sound

`atuned_src/engine/avatar.js`, 115 lines, host free, covered by
`tests/engine.js` group 20.

    AV_MONTH           :17   thirty days, the review clock
    avatarBlank()      :18   {built:false, at:null, reviewedAt:null, pairs:[]}
    avatarValid(pair)  :23   both halves present and non empty, or nothing
    avatarDue(av,now)  :26   thirty days since the last review
    avatarDaysLeft()   :30   the countdown
    avatarGap(...)     :38   seat, load, integrity, clear, and mirrorAt
    avatarProgress()   :44   done, total, pct, read off cleared ground

The purpose map and the boundary sit in the same file: `PUR_SIDES` at :69,
`purposeBlank` :73, `purposeReady` :76, `purposeCentre` :83, `purposeRead` :86,
`boundaryCount` :95, `boundaryCross` :105. The schema carries both objects,
`schema.js:61`, and `validateProfile` refuses a malformed pair by name at
`schema.js:396`.

### The UI half is a page of text and it cannot be written to

`ui/drills.js` holds the whole surface. `avOf` :660, `avRows` :661, `readSeat`
:672, `runAvatarDrill` :685, `runAvPair` :727, `runPurposeDrill` :754. Two
doors reach it: `component.js:384` on the blank profile's four ways in, and
`panels.js:569` in the sheet.

**There is no picture of the avatar anywhere in this product.** Not a figure,
not a mark, not a glyph. Grepped across every renderer: no canvas, no SVG, no
arc is drawn for it. The thing the owner has named as the centre of the product
is, today, three paragraphs and a list.

### Four things that are dead, and one that is worse than dead

**Nothing in the product can write an avatar pair.** `avatar.pairs` has three
readers, `drills.js:663`, `summary.js:265` and the validator, and no writer. It
is written only by `validateProfile` when a record is imported, and there is no
import control in the UI. `avatar.built` is set in exactly one place,
`schema.js:390`, from an imported record. So `avatarDue`, `avatarDaysLeft` and
the whole monthly review clock can never fire, because `built` can never become
true from inside the app.

**The two journal questions do not exist.** `drills.js:709` tells the person
"the journal asks for it in two questions: describe yourself on your best day,
not what you achieved but how you were. Then the opposite." Grepped: neither
question exists in the question rail, in `COPY-questions.md`, or anywhere else.
The surface describes a route that was never built.

**The avatar is one of the four doors, and it is the only one that cannot be
walked through.** `PANEL-flow-1000.md` Break One measured that three of the
four doors write nothing. The avatar door is worse than the other two: `ages`
at least keeps `AGE_ANS` as module state. The avatar keeps nothing at all.

**`boundaryCross` is dead.** Exported at `export.js:22`, asserted at
`tests/engine.js:1548`, called by no renderer. The journal never asks which
side of the line an entry landed on, which is the one thing the boundary was
built to answer.

**And the Summary prints a false all clear.** `summary.js:265` filters
`av.pairs` through `avatarValid`, which passes only `{be, notbe}`. Three lines
later, `:273` reads `x.pair.becoming || x.pair.seat` and `:269` matches on
`x.p.n === pair.seat`. Nothing in this repository ever writes `becoming` or
`seat` on a pair. So `st` is always undefined, `clear` is always true, `blocked`
is always empty, and the surface always takes the other branch at `:275`:

> Every seat your avatar depends on is passing. What you stated you are becoming
> is not being blocked by the field.

That sentence cannot be false. It is the only place the avatar reaches the
Summary and it is a guaranteed all clear about the exact thing the avatar
exists to measure. It has never fired because nothing can write a pair, which
is the only reason it has not already been shown to somebody.

### Two smaller defects, named where they are

`drills.js:706` prints `pg.done + ' of ' + pg.total` clear at the address behind
them. That is a reading printed as a count against a total, which
`DESIGN.md` Law 5 forbids and `CLAUDE.md` states twice.

`cqCeiling` and `cqHeadroom`, `compute.js:263` and `:279`, are not in
`engine/export.js`. They are browser globals, so `release.js:83`,
`summary.js:581` and `tests/functional.js:1820` reach them and the headless
gate cannot. The most important number in this document is the one number the
fast gate cannot see.

---

## 2. WHAT I KEPT AND WHAT I OVERTURNED

### Kept, and it is most of it

**The pair, and the direction of its wiring.** The right hand sentence steers
the release, the left hand one steers the reframe, never the other way round.
That was right and the prototypes implement it: state a pair and the seat the
parser returns goes to the head of the release queue.

**That the app never rules on whether an attribute is a real edge or a saboteur
wearing a virtue.** Entry 264, and it survives untouched. It is also the reason
the fine tune control below is safe: the product computes a reach off what a
person claims and never argues with the claim.

**The three clocks.** Avatar revised monthly, purpose map rarely, boundary
tested daily. Unchanged.

**The whole of section 5, the ladder as a fraction of a person's own horizon.**
That is his ruling and it is built. Nothing here touches it.

**The seeding idea, and the harvest.** An entry a person already wrote is
better evidence than an answer to a form.

### Overturned

**"AVATAR sits in the CENTRE OF THE RING", bible entry 425, and the old
section 7.** The Field's core is not free. `DESIGN-feathers.md` has already
committed it: the core is the heart the twenty one feathers are weighed
against, its breath rate is the reading, and its radius is the coherence. Two
systems cannot own one mark. The avatar needs its own surface, and it needs to
be the surface a person lands on.

**That the avatar's job is to give the release work a direction.** That was the
old framing and it is too small. The measurement in section 5 says the release
work is not the main lever for half the roster. The avatar's job is to show a
person which lever is theirs.

**That `avatarProgress` is the improvement channel.** It reports done against
total on stated pairs, which is a completion bar on a person's own values, and
`cone.js:863` already carries the ruling that this is not a game about
becoming a completed self. It stays as arithmetic and it never becomes a mark
on the figure.

**That the avatar is a page.** It is not. It is the surface the app opens on,
or it is not the centre of anything.

**The objection to thirty boundary commitments, which the last pass withdrew.**
I am reinstating it in one narrow form only, and it is a different argument.
Thirty is right for the instrument. It is wrong as the first thing. The
prototypes ask for nothing at the door and everything over months.

---

## 3. WHAT IS ATUNED? YOUR AVATAR

Your avatar is not a picture of how you are doing. It is the part of you that
the work has already reached, drawn at the address where it happened, and it is
built out of facts that carry a date: an address a release has touched, an
address taken to nothing, a seat reached, a run done, a law answered. Nothing
in this product can take one of those back, so the figure can only ever be
added to. Beside it, and never inside it, are two things that move: how far you
stand from where you could get, which is today and is allowed to get worse, and
how far you could get at all, which is the only thing you can reach in and
change directly, because it is made of the twenty one things you actually do.
That is the whole instrument. The drawing is what you have built. The gauge is
what is in the way. The pegs are who you are. A person watches the drawing
complete over months, watches the gauge swing week to week, and turns a peg
when they decide to be different, and no arrangement of those three can ever
tell them they are worth more on a good day than on a bad one.

---

## 4. SEWING THE LAYERS

His chain, each joint named, with the file it would live in and whether it
exists today.

| Joint | What it is, mechanically | Where it lives | State |
|---|---|---|---|
| Story to body | The sniffer resolves a sentence to imprints, each with a band | `engine/sniff.js:152`, `parseStory` | **Built.** Verified in the prototypes: "I take every meeting home with me and I cannot put it down" returns four Heart imprints |
| Avatar to body | The right half of a pair goes to the same parser and comes back a seat | `ui/drills.js:672`, `readSeat` | **Built and unreachable**, because no pair can be written |
| Avatar to the queue | The stated seat goes to the head of the release queue | Does not exist. Would be `ui/release.js:88` | **Not built.** It is the single highest value joint on this list and section 5 shows why |
| Body to psyche | Every saboteur, complex and hyper complex stands on named addresses at named seats | `engine/compute.js:67` to `:106` | **Built** |
| Psyche to ritual | A pattern becomes a practice | `engine/data/practice.js`, `ui/ritual.js` | **Partly.** The practices exist and are seated. Nothing routes a named pattern to one |
| Ritual to record | A saved ritual is a day on the streak | `engine/ladder.js`, `streakRead` | **Built, and it counts the wrong thing.** `PANEL-flow-1000.md` measured it: minutes planned printed as minutes practised, and 0 of 1000 reach seven days |
| Release to record | `meterFirst` stamps the first time an address is touched, with a date | `ui/release.js:126` | **Built.** This is the append only channel the whole design rests on and it is already in the code |
| Law to reach | The twenty one laws set the seat's integrity and the reading's ceiling | `engine/core.js:197` `bandIg`, `compute.js:263` `cqCeiling` | **Built, and invisible.** Nothing tells a person their laws are the only lever on their ceiling |
| Boundary to journal | Which of the six relationships an entry crossed | `engine/avatar.js:105`, `boundaryCross` | **Built and called by nothing** |
| Body to figure | Seat heights, radii and pain regions in one 100 by 100 space | `engine/data/practice.js:105` `PMBANDS`, `:138` `PAINREG` | **Built.** The avatar in `proto/avatar/one-armature.html` places its seats off these numbers without adding a single coordinate |

Read down the state column. Seven of the ten joints exist. The avatar is not a
new system, it is the surface that shows the seven that are already there and
forces the three that are not.

---

## 5. HOW IMPROVEMENT IS SHOWN, AND HOW IT STAYS HONEST

### The hard part, said plainly

This product reads somatic and psychological self report. An avatar that gets
prettier as a person clears charge is one decision away from telling somebody
they are worth more when they are less distressed. That is not a hypothetical
and it is not a subtle failure mode. It shipped, at scale, in 2008: Wii Fit
weighed a player and made their Mii visibly fatter, hang its head and produce a
sound of disappointment, and obesity specialists went to the press over a ten
year old who was told she was fat by a game.
(<https://gulfnews.com/world/europe/10-year-old-too-fat-for-nintendo-game-1.105647>,
<https://en.wikipedia.org/wiki/Mii>.) The mechanism was not malice. It was one
designer deciding that the avatar should reflect the reading.

The quantified self version is better documented. Orthosomnia is a named
clinical phenomenon: patients whose sleep got worse because they were anxious
about a sleep score, first described in the Journal of Clinical Sleep Medicine
in 2017 (<https://pmc.ncbi.nlm.nih.gov/articles/PMC5263088/>,
<https://en.wikipedia.org/wiki/Orthosomnia>). Oura publishes a page about it
themselves (<https://ouraring.com/blog/what-is-orthosomnia/>). A daily readiness
number, from a device with a reputation for rigour, reliably makes some fraction
of its users worse at the thing it measures. This product's readings are more
personal than sleep latency.

`PRODUCT.md` section 4 already rules on this in his own words: **regardless of
our score**, and it settles that coherence is not a rank and that nobody at a
low reading is further from becoming a better person than anybody else. An
avatar driven by the reading breaks that ruling in the largest graphic on the
screen.

### And the arithmetic says the reading is the wrong channel anyway

Measured by running the release arithmetic at `ui/release.js:88` verbatim,
eight addresses a run, twelve runs, on the roster. The prototypes recompute
this live, and the table in each page is the same run.

| Who | As they stand | Twelve releases | Two points on the weakest three laws | Both |
|---|---|---|---|---|
| Marcus | reads 39.2, reaches 39.4 | **40.5**, reaches 42.1 | **42.5**, reaches 42.8 | 43.8, reaches 45.5 |
| Diane | reads 28.1, reaches 33.9 | **34.8**, reaches 37.8 | **31.5**, reaches 37.8 | 38.8, reaches 42.0 |
| Gordon | reads 0.8, reaches 3.1 | **3.9**, reaches 6.1 | **1.1**, reaches 4.1 | 4.9, reaches 7.4 |
| Sofia | reads 56.6, reaches 58.0 | **57.3**, reaches 59.1 | **61.6**, reaches 63.1 | 62.1, reaches 64.1 |

**Twelve releases is a quarter of work at one run a week. It moves Marcus 1.3
points and never changes his band.** It moves Sofia 0.7. Two points on the
three laws each of them is weakest at moves Marcus 3.3 and Sofia 5.0. The
ratio reverses for Gordon, who is carrying so much that conduct cannot be the
thing that moves first: clearing is worth 3.1 to him and turning is worth 0.3.

So which lever matters is a property of the person, it changes as they work,
and **the product has never said so to anybody.** That sentence, computed live
from where a person stands, is the single most useful thing this surface can
say, and it is the thing the prototypes put directly under the figure.

### The three channels, and the rule they obey

**RECORD.** Append only. Addresses touched, addresses emptied, seats reached,
runs done, days. Every one is a fact with a date that `meterFirst` already
stamps. It is the drawing.

**REACH.** `cqCeiling()` for the whole reading, `mirrorAt(0, bandIg(seat))` for
each seat. How far this person gets with nothing held. It is the dotted end of
the gauge.

**WEATHER.** Load, what is carrying, what the chain is running. It is the grey
bar, and it is the only channel allowed to move both ways.

**The record and the reach never trade against each other, and neither is ever
the same mark as the weather.** That is the whole honesty mechanism and it is
arithmetic rather than a rule in a renderer.

### What a person sees when it gets worse

Driven in the browser on Diane, twelve releases and then a hard month, which
adds 2.2 to every axis:

    after twelve runs   reads 34.8   carrying 0    record 20 touched, 91 emptied, 4 seats
    after a hard month  reads 32.7   carrying 84   record 20 touched, 91 emptied, 4 seats

Every record number is byte identical. The drawing does not move. The grey bar
comes back and the bead on every gauge slides in. Nothing is taken away,
nothing goes grey, no word changes, and there is no level to fall out of,
because there was never a level.

Measured the same way on Marcus: reads 44.1 to 42.3, carrying 0 to 99, record
22 touched, 99 emptied, 3 seats, before and after.

### The two things that make this ungameable

**A peg you turn without changing anything buys a reach the figure will never
travel to, and the gap is drawn.** The product does not adjudicate a law, per
the standing ruling. It does not have to. Claiming a law you have not earned
extends the dotted line and leaves the solid one where it was, and a widening
gap between the two is exactly what a false claim looks like. The design is
honest by construction rather than by policing.

**The record is keyed on contact, not completion, and that had to be measured
to be got right.** Keyed on an address taken to nothing, Gordon does four real
runs and his record still reads zero, because his charge is so high that a 21
percent cut takes nothing to zero until run seven. The most loaded person in
the roster would be told he had done nothing after a month of work. Keyed on
contact, the same four runs read 20 addresses. `meterFirst` at
`release.js:126` already stamps contact, so the honest channel is the one
already in the code. Both are drawn, because contact saturates fast (Diane 17
by run four, 20 by run twelve) while completion keeps climbing (15 then 91).

### One finding the avatar surfaced that is not the avatar's problem

**The release queue never reaches the Crown or the third eye.** Sorted by
weight, eight at a time, twelve runs: Diane, Marcus and Gordon all finish with
0 of 21 Crown addresses and 0 of 12 third eye addresses contacted. They get
emptied by axis spillover but are never worked directly.

State a Heart pair and the queue reorders: Heart contacted goes from 0 to 8 on
Marcus, 0 to 15 on Gordon, 0 to 11 on Diane. **The stated pair is the only
thing in the design that gets a release somewhere the weight sort will not take
it.** That is the avatar to queue joint in section 4, it is not built, and this
is the argument for building it.

---

## 6. THE THREE APPROACHES

All three are one 2D canvas, the surface the Field already owns. None needs a
3D library, none is promoted to its own layer, none adds a backdrop filter.
Frame cost is the median and 95th percentile of the hero draw over 600 frames
at device pixel ratio 1, measured in the page itself and printed at the bottom
of it. Kilobytes are the drawing code with comments stripped, which is what
would land in a new `ui/avatarui.js`. All three share a control surface of
22.6 KB and 6.2 KB of CSS, so the difference between them is the drawing.

### One. The armature

**What it shows.** A body reduced to the parts that carry a reading: a spine,
seven seats at the `PMBANDS` heights, and eleven segment families hanging off
them. Line work continuous where a release has reached and broken where it has
not. One ring per seat at the pain map's own radius, carrying two arcs for
touched and emptied. Beside the body, one gauge per seat: dotted to the reach,
solid to where it stands, a bead at the end of the solid, and a grey bar under
it as long as the share of that seat which is carrying.

**What it refuses to show.** No face. No mass, no body type, no weight, no sex,
no age, no clothing, no accessory. It refuses to draw a person who could be
better looking. It refuses to print the coherence number on the figure. And it
refuses to let a peg move the body: a peg moves only the dotted line.

**The symbol argument.** An armature is what a figure is built on. It is a
thing you add to, which is the correct object for a record. The body is not a
metaphor here: all 112 addresses carry a named plexus and a location, the seat
heights come out of `practice.js:105` without a coordinate being invented, and
a body chart is the clinically validated form for somatic self report rather
than a decorative choice. The CHOIR body map was validated in almost 600 people
with chronic pain and is used to track spatial spread and regression over time
(<https://painnews.stanford.edu/news/creating-new-tool-pain-choir-body-map-puts-pain-map>,
<https://formative.jmir.org/2022/6/e36687/>). The load bearing part is the
broken segment: a drawing that is not finished is not a damaged drawing.

**Frame cost.** 0.20ms median, 0.30ms at the 95th, at 344 by 500. 1.2 percent
of a 16.7ms budget. The Field currently spends 0.4ms on 31 marks
(`DESIGN-feathers.md`), so this is half of what is already spent.

**Kilobytes.** 5.8 KB of drawing code.

**The honest risk.** A standing human figure invites identification with body
shape however hard the drawing refuses it, and a seat drawn dark on a body
reads as a statement about an organ. The mitigation is that the dark channel
left the body entirely and lives on the gauge, so the figure is never drawn as
less than itself. That is a mitigation and not a proof. Test it on a real
person at grid level two before it ships.

### Two. The lantern

**What it shows.** No body. Seven concentric arcs, Root innermost to Crown
outermost, each closing as the record at that seat accumulates. A light at the
centre sized by the installed coherent opposite. An aperture, dotted, at the
reach, and the light's own edge at where the reading stands. Grey shutters on
each seat's ring, one per carrying address.

**What it refuses to show.** Anatomy, so it cannot be read as a claim about a
body part. It refuses to size the light by coherence, which is the obvious move
and the wrong one. It refuses any count on the graphic.

**The symbol argument.** A lantern is a housing and a light and the two are
independent: a good housing with no fuel is dark, a bright flame in a broken
housing does not carry. That is exactly the relation between a record and a
reading. It inherits ring not fill without an argument. The light is the
installed opposite that `relCoolDown` puts in at 62 percent of what it removed,
which is the only quantity in the engine that cannot fall when a person works.

**Frame cost.** 0.10ms median, 0.20ms at the 95th, at 400 by 400. The cheapest
of the three, and the only one that still reads at 100 pixels square.

**Kilobytes.** 4.2 KB.

**The honest risk.** It may not read as you. The Proteus effect literature is
consistent that identification with a self representation is what changes
behaviour (<https://nickyee.com/pubs/Yee,%20Bailenson,%20Ducheneaut%20-%20Proteus%20Implications.pdf>,
<https://en.wikipedia.org/wiki/Proteus_effect>), and a ring diagram gives a
person nothing to identify with and nothing to make their own without adding
cosmetics. It is also the one most likely to be mistaken for the Field, and two
surfaces that look the same are one surface with a bug.

### Three. The seam

**What it shows.** His own word, literally. Five rails in his order, avatar to
ritual to psyche to body to story, always present and always the same length.
A thread between two rails only where the joint was actually made. Seat nodes
on the body rail with their own dotted reach ring. Sag on a thread that runs
off a loaded seat.

**What it refuses to show.** A person. There is no figure, no light and no
body, so there is nothing that can be read as a picture of how somebody is
doing. It also refuses to draw a layer as earned: a person has a body and a
story before this product touches them.

**The symbol argument.** A seam is a joint that shows, and what makes a seam
trustworthy is that you can see what it holds together. It is the only one of
the three that answers the sentence he actually said, which was about sewing
layers and not about a figure. Sag is right because a load on a line is the
physical fact the voice already reaches for and a sagging thread is plainly
still attached.

**Frame cost.** 0.10ms median, 0.20ms at the 95th, at 400 by 440.

**Kilobytes.** 5.2 KB.

**The honest risk.** A diagram is not an avatar. A person at grid level two,
numb, will not look at a wiring harness and feel represented, and 800 of the
1000 arrive at level four or below. Its blank state is the worst of the three:
five dotted lines and one ring. It is the strongest systems answer and the
weakest first minute.

### Against bulky, and against needing to be taught

He rejected two Field concepts in these words: "too bulky, too simple, there
are some interesting things about it but it does not make as intuitive sense."
Both tests are live here and both were failed once before they were passed.

**Bulky is ink that carries no more reading than half of it would, and it is
measurable.** The first armature stacked a reach ring, a standing ring and a
ring of calipers concentric at every seat: 21 circles and up to 112 spokes on a
300 pixel figure, 11,687 lit pixels, and it read as a sea urchin. Splitting the
channels between the body and a gauge beside it brought the same profile to
7,461 lit pixels with every reading kept. A third of the ink gone and nothing
lost is the definition of the first version being bulky. The lantern's first
arrival state was seven fields of grey shutters with the seat colours drawn at
0.085 alpha, which meant the one rule this project never breaks, that a named
thing has a colour, was being broken by the arrival state of its own
centrepiece. The seam is still the bulkiest of the three and the measurement
says so: at twelve runs on a loaded profile the weave carries over a hundred
and forty strokes and the reading a person takes off it is a density.

**Nothing to be taught is the harder test.** The armature passes it cold: a
person knows what a body is, knows a dashed line is not finished, and knows
that a bar filling up is an amount. The lantern needs four sentences, one each
for housing, light, aperture and shutters. The seam needs a paragraph. On this
test the ordering is not close.

---

## 7. ATMOSPHERE AND LIGHTING

His last instruction, and the one that turns out not to be a separate
deliverable. Argued from autonomic response, not from taste.

**The light is the honesty mechanism.** A drawing that stays exactly where it
was while the light on it changes is the only arrangement in which a bad month
cannot be a demotion. Atmosphere is not decoration sitting on top of this
design, it is the load bearing half of it. Everything below follows from that
one sentence.

**Breath rate is the reading, and it is already ruled.** `DESIGN-feathers.md`
sets it: period from 2.0 seconds at coherence 0 to 5.0 at 100, amplitude 0.010
to 0.030 of the radius, per seat phase offset of one seventh of a cycle so the
Root leads and the Crown arrives a sixth of a cycle later. Slow and deep against
fast and shallow is what an autonomic system actually does, and a person in
sympathetic arousal entrains to a slow rhythm without being told to. All three
prototypes use this function unchanged. It is the single most defensible piece
of atmosphere in the product because it is the only one that is a physiological
claim rather than a mood.

**Chroma comes out at the floor, and it already does.** `TIERCOL` in
`canon.js:382` desaturates toward collapse rather than reddening: "a palette
that shouts loudest at the bottom is a palette that tells somebody at the floor
that they are an emergency." The avatar inherits that without restating it.

**Grey is pressure and it is never a seat colour.** The weather channel in all
three prototypes is `#94908A`, the existing `--dim`. Pressure is not a property
of a seat, so it never borrows a seat's language. A person can therefore tell,
without a caption, which marks are about them and which are about this week.

**A new interface is an added lighting, never a replacement.** The seven stand.
`TASKS.md` 0c carries the open question of whether Atmosphere is an eighth
lighting or a change to how the Field draws in Dark, and it is his. What I can
say from the prototypes is that the avatar does not need one: it reads correctly
in Dark at both sizes and every colour it uses resolves in all seven.

**What actually keeps a person there.** Not the atmosphere. `PANEL-flow-1000.md`
measured the four candidate return mechanisms and found exactly one in the code,
the streak, on a surface a phone cannot reach, counting minutes planned rather
than minutes practised, earned by 0 of 1000. The avatar's contribution to
retention is not a glow. It is that the drawing is visibly unfinished and the
unfinished parts are named. A person who has never had a release reach their
Crown can see that the Crown segment is dashed, and that is a reason to come
back that no amount of lighting produces.

**And one thing to refuse.** No particles, no drift, no ambient motion that is
not a reading. The Field already learned this: `DESIGN-feathers.md` records a
core that breathed on a constant, so a person at coherence 18 and a person at 88
were given identically paced breath on an instrument whose subject is a nervous
system. Motion that is not a reading is a lie at 60 frames a second.

---

## 8. THE RECOMMENDATION

**The armature.** Build `proto/avatar/one-armature.html`.

Four reasons, in order of weight.

**One. It is the only one that needs no teaching,** and he has already rejected
two concepts for failing that exact test. A body needs no caption. The lantern
needs four sentences and the seam needs a paragraph. 800 of the 1000 arrive at
grid level four or below, frustrated or numb, and a person in that state does
not read a legend.

**Two. It is the only one that reads as you.** The Proteus effect literature is
consistent that identification is what changes behaviour, and this is the
product's centrepiece. A housing and a weave are diagrams of a system. A body
is a person, and this product's whole claim is that the psyche has a physical
address.

**Three. It costs nothing to place.** Seven seats, their heights and their
radii are already in `practice.js:105`, the same space the pain map uses. The
avatar and the pain map are the same figure seen twice, which means the
"click any chunk of yourself and open it" promise in `PRODUCT.md` section 4 has
a natural landing place, and the body page and the avatar page share a
coordinate system rather than competing for one.

**Four. It is affordable.** 0.20ms median and 5.8 KB of drawing code, against a
Field that already spends 0.4ms.

**What I would not do.** I would not put it in the centre of the ring. That
mark belongs to the feathers now and two systems cannot own one graphic.

**The grade delta.** The avatar today is three paragraphs of text, no picture,
no writer, one guaranteed false sentence on the Summary, and one of the four
doors that cannot be walked through. Call that a D. The armature as prototyped,
with the pegs, the release and the stated pair wired, is a B. It is not an A
until two things land that I cannot decide: the journal questions that write a
pair, and a queue that takes its order from one.

**The order I would build it in**, and each step is worth shipping alone:

1. **The two journal questions and the pair writer.** Everything is downstream
   of a pair existing. Half a day.
2. **Fix `summary.js:273`.** It reads a schema that does not exist and prints a
   guaranteed all clear. Twenty minutes, and it becomes dangerous the moment
   step 1 lands.
3. **The armature on its own surface,** record and weather only. No pegs yet.
4. **The reach.** `cqCeiling` and `mirrorAt(0, bandIg)` onto the gauge, plus
   the one sentence naming which lever is theirs. This is the step that makes it
   an instrument rather than a portrait.
5. **The pegs.** The twenty one laws, seated, on the avatar surface.
6. **The queue takes its order from the stated pair.** `release.js:88`.

Steps 2 and 4 are the two I would not let slip. Step 2 because a false all clear
about somebody's own stated becoming is the worst sentence this product could
print. Step 4 because without it the avatar is a portrait, and he has asked for
an instrument in as many words.

---

## 9. THE COMPS

Found by search. Direct fetch is blocked by the egress policy in this
environment, so these are cited from the search index and I have marked what
that means: the URL and the claim are what the index returned, and I have not
opened the page. Nothing here is unsourced, and nothing here is verified to
primary.

**Where an avatar is genuinely earned and genuinely the centre.**

- **Journey**, thatgamecompany. The scarf lengthens by collecting symbols and
  its length is flight. It is cosmetic and functional at once, it reads as a
  history of where you have been, and it is never a score.
  <https://journey.fandom.com/wiki/Scarf>,
  <https://en.wikipedia.org/wiki/Journey_(2012_video_game)>. This is the
  closest thing in games to the record channel: a mark that only accumulates
  and that carries meaning without carrying a number.
- **Finch**, the self care pet. The design move worth stealing is that the
  avatar is deliberately *not* you: caring for a bird is easier than caring for
  yourself, and there is no penalty for an off day. <https://finchcare.com/about-finch>,
  <https://ixd.prattsi.org/2026/02/design-critique-finch-self-care-pet-ios-app/>.
  The critique in that same source is the warning: "a virtual pet that visibly
  suffers when you neglect it can recreate the exact dynamic the category was
  supposed to escape." That is this document's hard part, stated by somebody
  else about a different product.
- **Apple Health Trends.** Not an avatar, and it is here for one design
  decision: it compares the last 90 days against the previous 365 rather than
  reporting a daily number, explicitly separating motivation from insight
  because individual days contain too much variation to show progress.
  <https://applemagazine.com/apple-fitness-trends/>,
  <https://support.apple.com/en-us/HT210343>. This is the argument for a record
  channel measured in months.

**Where avatar systems decay.**

- **Habitica.** The canonical cosmetic treadmill: the XP economy is closed, XP
  buys gear, gear changes the avatar, and none of it transfers to real
  capability. The reported failure is that the mechanics go from novel to
  routine and then to another notification you ignore.
  <https://habitica.fandom.com/wiki/Gamification>,
  <https://taskcoach.ai/blog/taskcoach-vs-habitica/>.
- **Battle passes and the overjustification effect.** Rewarding an already
  intrinsically motivated activity reduces the intrinsic motivation, which is a
  sixty year old result and not a games industry opinion.
  <https://en.wikipedia.org/wiki/Overjustification_effect>,
  <https://www.wayline.io/blog/battle-pass-dilemma-ethical-implications>. This
  is the argument against any cosmetic the avatar could earn.
- **Duolingo's streak.** The forgiveness design is worth taking, streak freezes
  capped small and deliberate. The guilt design is not: "You made Duo sad" is
  weaponised guilt and people quit over a broken streak.
  <https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification>,
  <https://duolingo.deconstructoroffun.com/mechanics/streaks>.

**Where an avatar told somebody they were worth less.**

- **Wii Fit.** Already argued in section 5.
  <https://gulfnews.com/world/europe/10-year-old-too-fat-for-nintendo-game-1.105647>,
  <https://en.wikipedia.org/wiki/Mii>,
  <https://mediacommons.org/imr/content/it%E2%80%99s-not-you-it%E2%80%99s-wii-defining-fitness-exergames>.
- **Orthosomnia.** <https://pmc.ncbi.nlm.nih.gov/articles/PMC5263088/>,
  <https://en.wikipedia.org/wiki/Orthosomnia>,
  <https://ouraring.com/blog/what-is-orthosomnia/>.

**Where identification comes from.**

- **The Proteus effect**, Yee and Bailenson, Stanford, 2007. Behaviour conforms
  to the self representation independent of how others perceive it.
  <https://nickyee.com/pubs/Yee,%20Bailenson,%20Ducheneaut%20-%20Proteus%20Implications.pdf>,
  <https://en.wikipedia.org/wiki/Proteus_effect>. It is the reason the armature
  is the recommendation and it is also the reason the armature is the riskiest:
  the same mechanism that makes a body read as you would make a body read as a
  judgement of you.

**Where the form comes from.**

- **The CHOIR body map**, Stanford, validated in almost 600 people with chronic
  pain. <https://painnews.stanford.edu/news/creating-new-tool-pain-choir-body-map-puts-pain-map>,
  <https://formative.jmir.org/2022/6/e36687/>.

---

## 10. THE QUESTIONS FOR HIM

Ten, ordered by how much the answer changes. Each answerable in a sentence.

**1. Does the avatar replace the Field as the surface the app opens on, or does
it sit beside it?**
Everything in this document assumes the avatar is the first thing a person
sees, because you said it is the centre and a centre you have to navigate to is
not one. But the Field is where the 112 addresses live and the feathers have
just been designed into it. I need to know whether I am replacing an opening
surface or adding a ninth tab, and the two are different products.

**2. Is the avatar a body, a light or a diagram?**
I recommend the body and the reasons are in section 8, but this is the choice
that fixes every other decision in the system and it is the one you should make
by looking rather than by reading. All three are in `proto/avatar/`.

**3. Should the avatar ever show a person that things got worse, or should it
show only what they have built?**
I have designed the honest answer, which is both, with the worse half in grey
and off the figure. The cowardly answer is also defensible: show only the
record and put the reading elsewhere. A person who is numb may need the second
one for the first month. Which?

**4. A quarter of releases moves Marcus 1.3 points and two points on three laws
moves him 3.3. Do we tell him that?**
It is the truest thing the instrument can say to him and it also says that the
release, the thing the product is built around, is not his lever. I think we
say it. I want you to rule, because it is a sentence that could lose a
customer.

**5. Can a person turn a law peg freely, or does a change have to be earned?**
Freely is what the standing ruling implies, since the app never adjudicates an
attribute, and it is self correcting because a false claim only widens the gap
between the dotted line and the solid one. The alternative is that a law moves
only through the intake. Freely is more useful and more gameable.

**6. When a person states who they are becoming, does that reorder the release
queue?**
Measured: with the weight sort, no release reaches the Crown or the third eye
for any of Diane, Marcus or Gordon in twelve runs. Stating a Heart pair takes
Heart contact from zero to fifteen on Gordon. It is the single highest value
joint that is not built, and it means the person, not the arithmetic, chooses
what gets worked.

**7. Does the avatar carry anything a person chooses for its own sake, a
colour, a mark, a name?**
I have designed none, because every comp that added one decayed into a cosmetic
treadmill. But the Proteus research says identification is what makes an avatar
change behaviour, and nothing here is identifiably theirs. Is that a gap you
want closed, and if so where is the line?

**8. Is the avatar free or paid?**
The old document left this open and it is now more consequential, because the
avatar is the surface. If it is the centre of the product it is hard to argue
it sits behind a tier. If it is free, the thing a person renews for has to be
something else.

**9. Is Atmosphere an eighth lighting or a change to how Dark draws?**
Still open from the last pass and it now blocks the avatar's finish. The avatar
reads correctly in all seven today, so this is not urgent, but the answer
decides whether I design a lighting or a surface.

**10. Should the avatar say anything out loud, or only draw?**
Today it is three paragraphs of text and no picture. The prototypes are a
picture with the words in a rail beside it. There is a third position, that the
avatar surface carries one sentence of plain language a week and nothing else.
Your voice, your call.

---

## 11. WHAT IS STILL OPEN AND WHOSE IT IS

**Mine, and I will do them when the above is ruled.**

- The pair writer and the two journal questions. Nothing works without them.
- `summary.js:273`, the guaranteed all clear. It is not my file this pass.
- Whether `avatarProgress` survives at all. It reports done against total on a
  person's own values and I would delete it rather than draw it.

**His.**

- Everything in section 10.
- The cohort rate. `PAT_COHORT` is the seam and it is one until he sets it.
- Whether the Buddha and Christ and Musashi compass is built. It is a compass
  of people, not a ladder of thresholds, and it should not share the marker
  table.

---

## 12. THE PURPOSE MAP AND THE BOUNDARY, CARRIED FORWARD UNCHANGED

His model, ruled, and it supersedes the codex sketch. Nothing in this pass
touched it. It is reproduced here rather than referred to, because a ruling
that survives only in a superseded draft is a ruling that gets lost.

**Meaning is the end point of expression. At the end of expression, meaning
creates purpose.** The direction runs one way: expression, then meaning, then
purpose. Purpose is never entered. It is what is left standing at the end of
the other two.

**The upward triangle is the higher purpose,** the soul's. Its three corners
are values the person enters, and the soul's values are universal: freedom,
free will, knowledge, wisdom, that register. The centre is the sum of the
three.

**The downward triangle is the earthly purpose,** the ego's. Three more
corners, and the ego's values have a body attached: health, fitness, financial
stability, wealth, family. Its centre is likewise the sum of its three.

**Overlaid, the two centres answer two different questions.** The upward centre
is what motivates you in the spirit, the downward what drives you on the earth,
and the relation between them is the useful one:

> the purpose between those two tells you how you make money and then how you
> find fulfilment doing it.

Six values in, three readings out, and a person may type none of the three.
Purpose is derived, ruled.

**The overlap is a hexagon and the hexagon is the boundary.**

> when you overlap those two triangles, that six-sided shape is the boundary of
> your behaviour. That is what is your containment. This is a mirror you hold up
> to yourself.

Its six sides are the six relationships the codex names: partner, family,
friends, community, coworkers, alone. Five commitments each, thirty in all.
Inside is yours to protect. Outside is choice.

    Avatar         who you are becoming          revised monthly
    Purpose Map    what that is for              revised rarely
    Boundary       what is yours to protect      tested daily

The boundary is the one that touches the release work every day, because a
crossed boundary is a stress response and a stress response is an imprint. A
person with thirty commitments written has given the journal thirty things to
notice, and `boundaryCross` can say which side of the line an entry sits on.
That is the first time this product could tell somebody **why** the charge
landed rather than only where. The corpus already carries the release for it:
"State one boundary once, plainly, and do not repeat it." The ritual step
exists. It needs the tool, not the copy.

**On the count of thirty, and the objection that was withdrawn.** Thirty was
once costed as onboarding and called friction. That was wrong and it stays
withdrawn: this is the instrument, not a form, and a mirror you have only half
described shows you half of yourself. The count stands. My one narrowing, and
it is a different argument, is about *when*, not *how many*: thirty is right
for the instrument and wrong as the first thing a stranger meets, so the avatar
surface asks for nothing at the door and everything over months. The seeding
idea survives on its own merits, because an entry a person already wrote is
better evidence than an answer to a form.

**The Purpose Map is its own surface and not a pane of the avatar,** because it
is revised on a different clock and because the geometry needs the whole stage.
The boundary sits inside it as the outer hexagon, since the codex draws them as
one figure.

---

## 13. THE LADDER, CARRIED FORWARD UNCHANGED

His ruling, and it is built, gated and live. Reproduced for the same reason.

> remember, it's a percent of a person's total age. I had to release 15,000 by
> the time I was 50.

Fifteen thousand by fifty is three hundred a year and three thousand a decade.
The three named thresholds are exact thirtieths of that total, and the three
the book already names fall on thirtieths too:

    breaking duality        500  of 15,000   =  1/30
    the still mind        2,500  of 15,000   =  5/30
    the open heart        3,500  of 15,000   =  7/30
    clear perception      4,500  of 15,000   =  9/30
    beginning of nirvana 10,000  of 15,000   = 20/30
    ascension            15,000  of 15,000   = 30/30

One, five, seven, nine, twenty, thirty. The absolute counts were never a
ladder. They were one man's numbers at one man's age. So the ladder resolves
against the reader: entry stays absolute, because a first address is a first
address at any age, and the other six are computed from the person's own
horizon the moment a birth date exists.

    age 20   load  6,000    200 · 1,000 · 1,400 · 1,800 ·  4,000 ·  6,000
    age 30   load  9,000    300 · 1,500 · 2,100 · 2,700 ·  6,000 ·  9,000
    age 40   load 12,000    400 · 2,000 · 2,800 · 3,600 ·  8,000 · 12,000
    age 50   load 15,000    500 · 2,500 · 3,500 · 4,500 · 10,000 · 15,000

A twenty year old reaches ascension at six thousand, not fifteen, and it is the
same distance, because it is all of what they are carrying:

> ascension in this state simply means you're no longer being stimulated by the
> external environment.

Nothing is left to be stimulated by. That is a complete clearing and it cannot
be a fixed number in a table. Until a birth date exists the surface says whose
numbers it is showing: the read carries `scaled:false` and says so, because a
distance computed from somebody else's age is a different claim. `PAT_COHORT`
is the open seam for the observation that younger people are more identified,
and it is one until he sets it. The codex prints `Ascension (11,664)` and his
ruling governs, with the disagreement recorded in `BOOK-ERRATA.md` rather than
quietly dropped.

---

## 14. THE SCHEMA, CARRIED FORWARD, AND WHAT THE FINE TUNE ADDS

Built, at `schema.js:61`, and validated at the boundary in the refuse by name
style: a pair missing either half is refused, a side holding more than five is
refused, an older profile without either object is filled from the blank, and
nothing is clamped.

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

Six values in. Nothing else is stored, because a derived value that is also
stored is one that can drift.

**What this pass adds, and it is small because the record already exists.**
Nothing new needs storing for the record channel: `p.meter.firsts`, written by
`meterFirst` at `release.js:126`, already stamps every address the first time a
release touches it, with a date and a label. The emptied channel is the one
addition, and it belongs beside it rather than in a new object:

    meter: { ..., emptied: [] }    /* address ids ever taken to nothing */

Append only by contract, never removed, and validated as a list of known node
ids. That is the entire schema cost of everything in sections 3 through 8.

**And one field that must not be added.** No level, no rank, no stage, no tier
on the avatar. The moment one exists it can go down, and a thing that can go
down is a demotion whatever it is drawn as.

---

## 15. RECORD OF THIS PASS

Two defects were found by driving the prototypes rather than by reading them,
and both are the kind a screenshot never shows.

**The contact sheet reset the live field.** Walking every profile to draw the
sheet calls `arrive()`, which overwrites the working charge, and putting back
only four fields of the live record left the field sitting at arrival. Every
control worked once and then silently undid itself: four releases moved the
figure, the repaint put the charge back, and the next four produced identical
numbers.

**And it left `CURP` holding the last profile walked,** which is the blank one.
`compute()` reads `CURP.laws` for `measured` and `measured` feeds `unread`, so
a person who had just cleared all 99 of their carrying addresses was told
nothing had been entered.

Neither would have been caught by looking at a picture, which is the argument
for the instruction that the prototypes are the deliverable.

**Three drawing decisions were reversed after measurement**, and each is
recorded in the code that fixed it. The armature's first legs closed into a
bell and read as a figure in a skirt, which is a body shape and a sex the
drawing refuses. The seam's first weave converged on one node and read as a
beach umbrella, where the loudest mark on the figure carried a count of runs.
The lantern's first light was drawn as stacked rings at low alpha and read as a
dartboard, which is what forced the one argued exception to ring not fill in
this document.
