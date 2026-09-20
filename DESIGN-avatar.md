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

**PART TWO is at the foot of this file** and it is where the current ruling
lives: the app opens on the avatar, the avatar is a dashboard, and the kundalini
rise is its progress bar. Everything above Part Two stands unless Part Two says
it does not, and Part Two says so in one place only, section 16.

Three runnable prototypes sit in `proto/avatar/`, and a fourth,
`proto/avatar/dash.html`, is Part Two's. They load the product's own
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

---
---

# PART TWO. THE DASHBOARD, AND THE KUNDALINI AS THE BAR

Added 20 September, after his ruling recorded at `TASKS.md` 0o. Nothing above
this line was deleted. Sections 12 and 13 carry rulings that still stand and
section 5's honesty argument is the spine of everything below.

Read off the build at commit `4713ab6`, `engine.js` md5
`676857a14fe486609a52be230bc5a148`, not dirty in the working tree.
`node tests/engine.js` on it: **1168 passed, 0 failed.**

    proto/avatar/rise.js         the derivation, 190 lines, no browser in it
    proto/avatar/risesim.js      the ten runs against the weighted thousand
    proto/avatar/dash.src.html   the surface, with its two script tags
    proto/avatar/build-dash.js   -> dash.html, one file, no siblings
    proto/avatar/shots-dash.js   shoots and measures in the same run
    proto/avatar/dash.html       553 KB. Open it. It needs nothing beside it.

---

## 16. HIS RULING, AND WHAT IT REVERSES

> "What you're improving is the conductivity of the kundalini. That's our
> primary goal with the avatar, to reconnect people's kundalini. So we should
> have progress bars of the kundalini snaking around the chakras, and we use
> that as a progress bar of how a person is doing. Like where their starting
> point is and how it's rising. Whether it's blocked or open, and where it's
> blocked."

That is the clearest statement of what the avatar is for this project has, and
it is the spine of Part Two.

**It answers question 1 of section 10.** The avatar is the surface the app
opens on. That reverses the ruling of 19 September, which itself reversed
Summary for the Field. The lesson that ruling taught is not reversed and is
section 22: whatever renders there renders to somebody who has entered nothing.

**It answers question 3.** Both, and the split is now exact. The rise is
today's reading and it falls on a bad month. The mark where a person started
is a dated fact and it does not move. Nothing is taken away, because the bar
slides back toward a mark that stays where it was.

**It does not answer question 2,** which is whether the avatar is a body, a
light or a diagram. Part Two is drawn on the armature's coordinates, since
`PMBANDS` is where the seats already live, but the figure here is the channel
and the seven seats rather than a body. That is a narrowing of the armature and
not a fourth option, and it is still his to look at.

---

## 17. THE RISE, COMPUTED

### The glossary is the specification

> **Kundalini.** The stored vital energy at the base of the spine. Rises root
> to crown when enough nodes are cleared for the channel to conduct.

Three things are needed and the engine already has all three.

**One. A conductivity per address.** `compute()` writes it at
`atuned_src/engine/compute.js:61`:

    n.open = clamp(1 - n.sq/10 + n.pole/26, 0, 1.18)

with the engine's own comment beside it: *"an address with the opposite in does
not merely read zero, it conducts."* That is conductivity, the engine already
calls it `open`, and open or blocked is his own word for a seat. Nothing was
invented to get it.

**Two. A seat.** Each of the seated addresses carries `n.b`, one of the seven
in `BANDS`. The four field addresses, Sol Star and Stellar Gateway above the
crown and Earth Star and Gaia Gateway below the root, carry `Field-Above` and
`Field-Below`. They are not on the channel and the rise never reads them.

**Three. A way to turn seven conductivities into one height.** This is the only
part that was a decision, and it was measured rather than chosen.

### Two wrong answers, and they are in the file because they had to be run

**A threshold per seat, at the product's own carrying line.** A seat conducts
when its mean conductivity clears what an address sitting exactly on the
display line would have, `1 - 4/10 = 0.60`, where 4 is the carrying line at
`compute.js:64`. Measured on the roster, **seven of ten read 100 per cent while
carrying between 52 and 99 addresses.** Marcus carries 99 and the bar said his
channel was fully open. That is the same class of defect as the guaranteed all
clear at `summary.js:273` in section 1, arrived at from the other direction.

**A stricter threshold.** At 0.95, nine of ten read between 5 and 14 per cent
and **every one of them was blocked at the root**, because a channel in series
always blames the first seat. A bar pinned near zero for everybody, naming the
same seat for everybody, carries no reading at all.

The sweep is printed in `risesim.js` run 9b so both failures stay visible.

### The answer, and there is no threshold in it

    t(seat) = clamp( mean(n.open at that seat) / 1.18, 0, 1 )
    cum(i)  = t(seat 1) x ... x t(seat i)          root first
    reach   = cum(1) + cum(2) + ... + cum(7)       0 to 7 seats
    pct     = round(100 x reach / 7)

Every part is read off the engine. **1.18 is the clamp ceiling on `n.open` at
`compute.js:61`,** so a seat cleared to nothing with no opposite installed
transmits 1/1.18 = 0.847 and only a seat with the opposite installed transmits
1.00. That is the engine's own claim, that clearing takes an address to zero
and the installed pole is what makes it conduct, and the normaliser honours it
instead of flattening it. Replacing 1.18 with 1.00 was swept: the median rise
goes from 33 to 53 and the number of the panel reading 95 or over goes from 15
to 128, which is the saturation the whole design is avoiding.

**The product is what makes it a channel.** A shut root throttles everything
above it, which is his model exactly. A bar that averaged the seven would tell
a person with a clear crown over a blocked solar plexus that the channel
conducts.

### The functions used, named

| Read | Where it lives | What it gives the rise |
|---|---|---|
| `compute()` | `engine/compute.js:43` | `n.open`, `n.sq`, `n.pole`, `n.held`, `n.susc` per address, and `r.carrying` already sorted heaviest first |
| `n.open` | `compute.js:61` | the conductivity, and the engine's own word for it |
| the carrying line, 4 | `compute.js:64` | the first threshold tried, and why it was dropped |
| the clamp ceiling, 1.18 | `compute.js:61` | the normaliser |
| `BANDS` | `engine/core.js` | the seven seats, root to crown, read by name and never by position |
| `bandIg(seat)` | `engine/core.js:197` | the integrity local to a seat, which is one of the two levers |
| `SI`, filtered on `.b` | `engine/data` | which of the twenty one laws carry a seat |
| `PMBANDS` | `engine/data/practice.js:105` | the seat heights and radii, the same space the pain map uses |
| `tierOf(CQ)` | `engine/data/canon.js` | the summary block's reading |
| `PRACTICE` | `engine/data/practice.js` | the seventeen a protocol is chosen from |
| `ui/release.js:88` | the release arithmetic | ported verbatim into both levers, run on local copies |

**`cqCeiling` is not used and could not be.** It is still absent from
`engine/export.js`, as section 1 recorded, so the headless probe cannot reach
it. The rise's own reach is built the way `cqCeiling` is built and not by
calling it: every charge at zero, the laws and installed opposites as they
stand, held zero by construction, nothing mutated. That defect is still open
and is not mine to fix this pass.

---

## 18. WHERE IT IS BLOCKED, WHICH IS THE USEFUL HALF

**The blocked seat is the seat with the lowest transmission, not the first seat
under a line.** That is the change that makes the readout carry information.
Measured on the weighted thousand, six of the seven seats are named: the solar
plexus for 443, the throat for 259, the sacral for 207, the root for 50, the
heart for 35 and the crown for 6. The third eye is never named, which is
section 5's finding about the release queue never reaching it, arriving again
from a different direction.

**The address.** `compute()` already sorted `r.carrying` heaviest first, so the
blockage has a name, a plexus, a fetter and a weight without another sort.
Marcus, at arrival: the throat, conducting 74 out of a hundred, twelve
addresses holding something there, the heaviest Deceit at the cervical plexus
at a weight of 2.1. Gordon: the throat, 26 out of a hundred, the heaviest
Deceit at 7.9.

**The direction out, and the arithmetic has exactly two.** `n.sq` is held minus
the installed opposite, and held is charge x susceptibility x
(1 - `bandIg(seat)`/10 x 0.42). So a seat's transmission moves on the charge,
which a release empties, and on the laws carrying that seat, which nothing but
conduct moves. Both are computed by running the engine's own bodies on local
copies of `S.charge` and `S.replace`. Nothing in `S` is touched, and the file
asserts it.

**Both levers carry what they cost, because they are not the same size of act.**
A quarter of release work at one seat against one change of conduct is not a
fair race, and the sentence names the work beside the number rather than
pretending it is. Marcus: twelve runs at the throat takes it from 74 to 86,
two points on transparency takes it to 74. Gordon: 26 to 87, against 28.

### The finding this surfaced, and it is the argument for the whole design

**On coherence the laws are the lever. On the rise the release is the lever.**

Section 5 measured that a quarter of releases moves Marcus 1.3 points of
coherence and two points on three laws moves him 3.3, and concluded that the
release, the thing the product is built around, is not his lever. That holds and
it is still true.

The rise reverses it, and the reason is arithmetic rather than taste. CQ is
(Intention x Integrity) / Resistance and Integrity is the twenty one laws, so
coherence answers to conduct. The rise reads `n.open`, which answers to `sq`,
which is charge. Measured on the thousand:

    coherence headroom   median 2.2 points of 100   530 of 1000 under 3 points
    rise headroom        median 28 points of 100    low 0, high 49

**530 of 1000 can run every release the product will ever offer them and not
move the number they were shown. The same people have a median of 28 points of
rise waiting.** And at the blocked seat the release is the bigger lever for 985
of 1000, against 0 for the law.

So the product's core loop finally has a channel that reports it. That is not a
reason to build the rise; it is the reason the rise is the right primary
measure for this product specifically, and it is computed rather than argued.

---

## 19. THE STARTING POINT, AND WHAT THE SCHEMA NEEDS

**Nothing in the profile stores a first reading and the rise cannot be shown
without one.** Confirmed on this build: `blankProfile()` carries
`avatar:{built,at,reviewedAt,pairs}` and `meter:{lines,unique,firsts,first,last}`
and there is no baseline of any kind in either.

### What has to be stored

    avatar: {
      built, at, reviewedAt, pairs,           /* unchanged */
      rise0: {                                /* NEW, and write once */
        at:   '<ISO date>',
        open: { Root:0.00, Sacral:0.00, Solar:0.00, Heart:0.00,
                Throat:0.00, '3rd Eye':0.00, Crown:0.00 }
      }
    }

**Seven numbers and a date, and nothing derived from them.** The percentage,
the seat that was blocked at the start and the delta all read out of those
seven through the same function that reads today's, so there is one truth and
it is read twice. Storing the percentage as well would be two truths about one
reading, which is the failure this repository already records under storing a
derived value.

**Keyed by seat name, never by position.** The project's own rule. A list of
seven would tie the baseline to the order of `BANDS`, and a baseline written
before a reorder would read as a different person's.

### Why a stored derived value is the right call here, said plainly

The rule is that a derived value is not stored. `rise0` is derived, so it needs
its exemption named rather than assumed. **It is not derived from current state.
It is derived from state that no longer exists.** That makes it the same class
of object as `meter.firsts`, which is already in the schema and already
append only: a dated fact about the past that cannot be recomputed because the
past is gone. It is written once, never recomputed and never updated, and if it
is ever rewritten the product has lost the only thing it was for.

### When it is written

**The first time `compute()` returns `unread:false`.** Not on arrival. A
baseline taken from a blank profile is a baseline of the defaults: measured, a
field with nothing in it returns 54 per cent through this arithmetic, so a
baseline stamped there would tell a person they had fallen 20 points by
entering their first story. `unread` is already computed and already the guard
both reading surfaces use.

### How it validates at the boundary

Refuse by name, never clamp, in the style `plan.tier` and `seed.axes` already
use:

    avatar.rise0 is not an object
    avatar.rise0.at is not a date
    avatar.rise0.open is not an object
    avatar.rise0.open.<name> is not a seat this build knows: <name>
    avatar.rise0.open.Throat is 3, outside 0 to 1.18

The ceiling is 1.18 because that is the clamp on `n.open`, so the boundary and
the arithmetic agree on one number rather than each carrying its own. A key
that is not one of the seven is refused by name rather than dropped, which is
the `plan` pattern and not the old `rituals` pattern. A missing seat is refused
rather than filled, because a baseline missing a seat is not an older baseline,
it is a broken one: six of seven multiplied together is a different reading.

### An older profile with no baseline

**It draws.** The bar is today's rise and needs no baseline at all. What it
cannot draw is the mark where the person started, and the surface says so
rather than drawing a rise from nothing. That is the same pattern the ladder
already uses when there is no birth date: the read carries `scaled:false` and
the surface says whose numbers it is showing. `avatar.rise0` absent is an older
profile and is filled from the blank as `null`, which is the standing rule.

### The version bump

**It does not need one, and it is not mine either way.** The field is additive,
a v1 or v2 record with no `rise0` reads as an older record and is filled from
the blank, and nothing that exists breaks. `SCHEMA_V` is already 2 on this
build. Whether schema v2 is settled is the cross compatibility contract with
SOURCE and it is recorded as his in `DECISIONS.md`. **This recommendation does
not need it and does not touch it.**

---

## 20. THE TAGS

> "being able to edit and add tags, so the tags can set up my protocol, and we
> need to have the tags set for each major chakra."

### Is this the shape the tag review endorsed

**The slot is. The value is not yet, and saying otherwise would quietly reopen
the free text version.**

`DESIGN-tags.md` said no to free text tags on measured grounds and yes to a
closed field validated against a table. `TASKS.md` TG4 reads his sentence as
that shape on the grounds that seven chakras is a closed set of seven. **Seven
chakras is a closed set of seven slots.** It says nothing about what goes in a
slot, and the slot was never the objection. The objection was a person typing
anything they like into a field the practitioner model would then have to hide,
and a field keyed by seat is still free text if its value is free text.

So the endorsement is conditional and the condition is the value.

### The shape I do endorse

    avatar.protocol: {
      Root:      [ <practice key>, ... ],
      Sacral:    [ ... ],  Solar: [ ... ],  Heart: [ ... ],
      Throat:    [ ... ],  '3rd Eye': [ ... ],  Crown: [ ... ]
    }

Keyed by seat name. Each value a list of keys out of `PRACTICE`, which is
seventeen entries with identity keys, four tracks and three tiers, already in
the schema and already used this way: `ritual.steps` is a list of practice
identity keys and is validated against them at `schema.js` today. Every key
refused by name against the table, the list capped, and no field anywhere in it
accepts typing. The prototype's protocol block writes only these.

### The job it does that no existing family does

**Nothing routes a named seat to a chosen set of practices.** Section 4's table
already says so in the row psyche to ritual: *"Partly. The practices exist and
are seated. Nothing routes a named pattern to one."* The rise makes that gap
concrete, because the rise names exactly one seat at a time and that seat is
the thing to work. `ritFor` at `ui/ritual.js` picks the lightest practice in the
track the darkest seat maps to, which is the product choosing. `avatar.protocol`
is the person choosing, once, per seat, and it is the first field in the product
where a person sets what happens rather than answering what is. That is the job,
and TG5 is right that it earns the field.

### The word

**It cannot be called tags in the schema.** `GLOSS` defines a tag as *"the
moment a charged experience is named and coded at a node address. The name locks
the experience in."* Two more entries are built on that definition. In this
product a tag is the injury, and under one word per concept a field called tags
would be one name for two concepts where the two are opposites. His word stays
in the conversation, where everyone knows what he means. The field is named for
what it does. The prototype calls it Protocol on the surface and
`avatar.protocol` in the schema.

### The price, which is small now and was not before

`DESIGN-tags.md` measured that a tag array passed `validateProfile` with no
schema change at all, because `rituals` and `story.entries` were the two bags
the boundary did not look in. **That has been fixed since.** `RIT_KEYS`,
`vEntry` and `ENT_KEYS` are in `schema.js` on this build and both bags are
typed. So the field can now be added in a place where it will be checked, which
was the condition that recommendation set.

**Additive, and no version bump.** An older profile with no `avatar.protocol` is
an older profile and is filled from the blank.

---

## 21. THE DASHBOARD. READING ACROSS, NOT DOWN

AV2: a dashboard that shows one surface's numbers is that surface with a new
name. What the prototype reads, and where each one comes from:

| Block | The read | The tool it belongs to |
|---|---|---|
| The rise, and the seven seats | `n.open` over `BANDS` | the Field |
| Where it stops | `r.carrying` filtered to the seat | the Field |
| The two levers | `ui/release.js:88` and `bandIg` over `SI` | Release, and the Intake's laws |
| Where it gets with nothing held | the reach, built like `cqCeiling` | Release |
| Summary | `tierOf(r.CQ)`, name, state and definition | Summary |
| Ritual | `PRACTICE` filtered to the blocked seat's track | Ritual |
| What is improving | seats clear, the rise since the baseline, addresses a release has reached | Release and the meter |
| Protocol | `PRACTICE` keys per seat | Ritual |

Seven of the nine tabs are read. Analytics and Knowledge are not, and that is a
gap rather than a decision: Analytics has `seriesRead` and `spanOf` and a
dashboard should carry a trend off them.

**Summary and ritual are the sticky parts, AV3.** They sit directly under the
reading and above the record, they are the only two doors on the surface, and
each is a door into its own page. The label never changes and the value under
it carries the state, which is the standing rule: an earlier cut put the tier
name where the label goes, so the slot changed identity every time the data
moved.

**What is improving, AV4, and not what is wrong.** Three facts and every one of
them is either a dated fact or a comparison against a mark that cannot move:
seats clear of what they held, points of rise since the baseline, addresses a
release has reached. The block shows only the ones that have something in them.
An earlier cut printed three zeroes to somebody on the morning they arrived,
which is the wall of absence the ritual heat map already learned about, drawn in
type instead of squares.

---

## 22. THE EMPTY STATE, WHICH IS THE DESIGN

The ruling of 19 September taught that whatever renders on the opening surface
renders to somebody who has entered nothing. Opening on the avatar does not
retire that, it inherits it.

**Measured: a field with nothing in it returns 54 per cent through this
arithmetic,** because every address reads `sq` 0 and `pole` 0, so every seat
transmits 0.847 and the product of seven is not small. Drawn, that is a claim of
54 points to a person who has typed nothing.

**So the bar does not draw on `unread`.** `compute()` already returns it. Undrawn
it is honest; drawn it is the largest lie on the screen. 15 of the weighted
thousand read as unread at arrival and all 15 see this state.

**The channel and the seven seats still draw.** A person has a spine and seven
seats before this product touches them. What they do not have yet is a rise. An
earlier cut returned early when there was no reading and left a bare vertical
line in a tall card while the copy beside it said the seven seats were drawn,
which is a caption asserting something the picture does not show.

**The card that says where it stops becomes the card that says where to start,**
carrying the four doors verbatim from `component.js:410`. Summary reads "No
reading yet, it opens once something is entered" and ritual reads "Nothing
saved yet". No number anywhere on the surface reads zero.

---

## 23. THE TEN RUNS

`node proto/avatar/risesim.js`. The panel is the weighted thousand from
`PANEL-ritual-1000.md`, lifted verbatim out of `proto/ritual/losssim.js:93`,
nine reference profiles carrying weights that sum to 1000, at seed 20260920.
Nothing reweights it and the weights are printed in run 0.

**One coefficient is mine,** `JIT`, the per person charge jitter that turns nine
profiles into a thousand distinct fields. It is swept 0 to 2.0 in run 9 and
every headline is reported at 0 as well, which is the bare weighted panel with
none of my invention in it.

**Run 0 is the self check and the report exits non zero if it fails.** Five
assertions against answers the product already states: the blank profile
validates, `plan.tier` platinum is refused by name, Rosa carries nothing, the
most loaded of the nine carries 107, and the rise does not read state left by
another profile. That last one is there because a probe in this repository once
read shared state after another run and reported a whole lane as empty.

| Run | What it measured | What it found |
|---|---|---|
| 1 | how many can be drawn a rise at all | **985 of 1000.** 15 read as nothing entered. A blank field returns 54 per cent, so the bar is gated on `unread`. |
| 2 | the spread at arrival | low 5, median 33, high 99. **1 of 1000 at or under 5 per cent, 15 at or over 95.** By twenties: 87, 488, 270, 140, 15. |
| 3 | where it is blocked | Solar 443, Throat 259, Sacral 207, Root 50, Heart 35, Crown 6, third eye none. **Six of seven seats named, the commonest at 44 per cent.** |
| 4 | does it move for somebody doing the work | twelve releases move the rise a median of **31 points** and coherence a median of **2.9**. 985 of 1000 see the rise move 5 points or more. **468 of 1000 see coherence move under 2 points over the same quarter.** |
| 5 | does it stay still for somebody who is not | **1000 of 1000 read exactly the same number.** The rise has no clock in it. |
| 6 | a hard month, every axis up 2.2 | the rise fell a median of **9 points**, worst 15. **The baseline mark did not move for 1000 of 1000.** |
| 7 | whose lever is it | rise headroom median **28** of 100, coherence headroom median **2.2**. 530 of 1000 have under 3 points of coherence to gain from every release the product will ever offer them. |
| 8 | the direction out at the blocked seat | the release is the bigger lever for **985 of 1000**, the seat's weakest law for 0. The laws named: Accountability 228, Courage 180, Transparency 168, Temperance 144, Truth 91, Detachment 63, and six more. |
| 9 | the sweep | median rise 32 at jitter 0 and 34 at 2.0. The normaliser at 1.00 instead of 1.18 moves the median to 53 and saturates 128 of 1000. |
| 10 | is the blocked seat stable | the named seat changed a median of **3 times** over twelve releases, worst 10, best 0. |

**Run 10 is the one with a finding I am not comfortable with.** A worst case of
ten changes over twelve runs means the surface named a different seat almost
every week for somebody. That is correct arithmetic, since clearing one seat
makes the next one the constraint, and it is still a readout a person cannot
build a habit on. The median of 3 is right. The tail is not, and the fix is
probably that the named seat holds until the seat actually clears rather than
until another seat overtakes it by a fraction. Not built, and it wants a
measurement before it is.

---

## 24. THE HONEST PART

The seat to plexus correspondence and the seven count are a modern Western
reading. The source traditions give five, six, eight and more, and the welding
of seats to nerve plexuses dates to 1927. `GLOSS` already says this under
Chakra, in those words. A frequency in hertz for a seat is not a measured
quantity and the rise is not one either. Kundalini is a model.

Every number on this surface is computed from what the engine holds about a
field, and the arithmetic is the engine's own. A consistent internal system
built on a model is worth having, and it is not a measurement. This product
already says exactly that about the aura and the biophoton field, and it says it
here in the same voice, once, on the surface itself and not only in this
document.

---

## 25. WHAT IS HIS AND WHAT IS MINE

**His.**

1. **The normaliser, if he wants it argued.** 1.18 says a seat is not fully
   conducting until the coherent opposite is installed, so clearing alone tops
   out at 85 of a hundred. That is the engine's claim and I have kept it, and it
   means the bar cannot read 100 on clearing alone. It is a claim about what
   reconnecting the kundalini means and it should be his.
2. **`Root_08_Unnamed`.** It carries no fetter, so its conductivity is fixed at
   1.000 where every other root address can reach 1.180. **The root can
   therefore never transmit 1.00 and the rise can never read 100 for anybody.**
   Measured: Rosa and Lance, both fully installed, read 99. It is already on his
   list in `CLAUDE.md` and this is a second reason to settle it.
3. **Schema v2.** Untouched, and nothing here needs it.
4. **Whether the rise replaces coherence as the headline number anywhere else.**
   Section 18 says the two answer to different levers. A person shown both will
   ask which one is them, and the product should have one sentence ready.
5. **Whether the practitioner may see the rise.** `leadSees` carries five
   families and the rise is not one of them. It is engine derived, so it would
   qualify on the existing rule, but it is a single number about a person's
   whole channel and that is a different thing from a saboteur list.

**Mine, when the above is ruled.**

- The blocked seat holding until the seat clears, run 10's tail.
- Analytics and Knowledge are not read by the dashboard and should be.
- `cqCeiling` and `cqHeadroom` still absent from `engine/export.js`, section 1.

---

## 26. RECORD OF THIS PASS

Six defects, and four of them were found by driving the page or the panel
rather than by reading either.

**The first threshold was wrong and only the panel said so.** Seven of ten read
100 per cent while carrying up to 99 addresses. It looked right in the code and
it was a full progress bar for a person who had done nothing.

**The second threshold was wrong in the other direction** and named the root for
nine of ten, which reads as a working feature until you notice the answer never
changes.

**The empty state drew a bare line while the copy said the seats were drawn.**
Found by shooting the empty profile and looking, which is the whole argument for
the instruction to look at the images.

**A CSS selector written as `.rise b` matched every seat value in the same
card,** and the narrow media query redeclared it after the seat rule, so under
900 pixels the seven seat numbers rendered at 44 pixels and overran their
column. Found at 390 and invisible at 1600. It is the same class of defect as a
label that changes identity with the data: a selector that matches more than the
slot it was written for.

**The engine's top level bindings are not on `window`.** `PAL` is declared with
`const`, so `window.PAL` is undefined and `var PAL` in a later script throws on
a name already taken. The first cut of the page did both and booted to an empty
select. Worth knowing for anything else that loads `engine.js` beside its own
script.

**Three zeroes on the morning somebody arrives.** The improving block counted
nothing three times rather than saying what it was waiting for.

**And one thing that was checked and was fine.** The lever probe runs the
release arithmetic twelve times and the law substitution once, and both could
have written into `S`. They run on local copies and the file asserts the seat is
unchanged afterward, on every profile in the roster. That assertion exists
because section 15 records two probes in this repository that read shared state
and reported a defect that was their own.

### Measured on the delivered page

    outbound requests            0, at 1600 and at 390, on four profiles
                                 counted by wrapping fetch, XMLHttpRequest,
                                 Image, WebSocket, EventSource and sendBeacon
                                 before any other script, and by a
                                 PerformanceObserver on every resource
    page errors                  0
    simultaneous choices         10, of which 4 are the review controls that
                                 would not ship. Six on the surface itself.
    touch targets under 44       0
    hero redraw                  0.20 ms median, 0.40 ms at the 95th, against
                                 a 16.7 ms frame. 1.2 per cent of the budget.
    shot at                      1600 by 1000 and 390 by 844, on Marcus,
                                 Gordon, Sofia and a first ever open, each
                                 before and after a quarter of release work
