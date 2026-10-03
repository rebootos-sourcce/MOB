# Creative direction review

Ines Halldors. Five passes, run separately, in the order they are written.
Nothing below is taste alone. Every finding was reproduced in a real Chromium
at 1600x1000 and at 390x844, against an empty profile and against Diane, and
every file and line was opened before it was named.

## Method, and what I sampled

I drove the build rather than read it. Nine tabs at desktop, four at phone
width, six lightings, the boot at ten timestamps, and the core loop end to end:
a stranger opens the app, writes a real story about staying at the office until
eleven and lying to his wife about it, commits it, and looks at what came back.

ICPs sampled: the six weighted panel entries in `engine/data/people.js`, the
reaction ledger in `RESEARCH-icp.md` sections 3 and 5, the walk table, and the
buyer grid in `BUYERS.md`. Where a finding lands on a specific person I name
them and the line that breaks them. Three of my findings were confirmed by a
number the record already holds and I did not have to invent one.

Measurements taken this session, all reproducible:

    empty summary       89 visible interactive elements, 0 data behind them
    Diane summary      116 page total, 34 in the centre, 66 in the left rail
    summary centre    2873px, which is 2.9 screens at 1000px
    knowledge cards      8 sampled, 3 unique icons
    canvas renderers     0 of 3 read S.theme (wheel.js, cone.js, map.js)
    collision gate       covers TAB.FIELD only
    boot                 4.2 seconds to a hard cut

---

# Pass one. Intent. What is this trying to be, and does the screen say it

The written intent is not in doubt and it is good. `BIBLE.md`: "a somatic
diagnostic instrument and a mirror. It says: this is you, this is everything
that is running you, from the top to the bottom." That is a real proposition,
it is unusual, and it is defensible.

The screen does not say it. Here is what the screen says, in the order a
stranger reads it.

## 1.1 The first screen is a cockpit with the engine off

**The finding.** A person who has entered nothing meets 89 working controls,
and the loudest thing on the screen is a bank of empty readouts.

Field, empty profile: eight chips across the top reading `CQ -`, `DQ 0.0`,
`SQ 0.0`, `Pole 0.00`, `Vitality -`, `Awareness -`, `Will -`, `Flow -`. A wheel
with `112 addresses, SQ, 0 loaded` and `saboteurs, 0` written across it. A left
rail of 66 controls. That is a flight deck at the gate with no fuel in the
tanks, and the four second question a stranger asks is answered wrong: it says
this is a dashboard, and dashboards are things you configure.

**The cause.** Not the empty states, which are individually well written. The
cause is that the instrument and its controls occupy the same plane at the same
weight at all times. There is no state in this product where the reading is
loud and the machinery is quiet. The renderers were built per surface and
nobody owns the composite.

**The move.** One state token, `r.unread`, already exists and two surfaces
already honour it. Extend it to the shell. On an unread field the left rail
collapses to its five headings, the readout strip does not render at all, and
the centre carries the four doors at display size with nothing else on screen.
`ui/panels.js` renders the rail, `shell/body.html:197-233` holds its sections.

**The cost.** Half a day. Risks nothing: the rail is already collapsible by
section and the doors already exist and already read well.

**The grade delta.** The stranger's first screen moves from D to B minus. It is
the cheapest large move on this list.

## 1.2 The rail prints a reading the centre refuses to print

**The finding.** On an unread profile the left rail prints `0 · Benign or
malignant, 72 / 28` and a balance slider, while the centre of the same screen
says, in so many words, that it will not show a number off a default because
"a number off a default is a number about the default and not about you."

Two surfaces, one screen, opposite epistemologies. The centre is right and the
rail is lying, and the rail is the one a person reads first because it is on
the left.

**The cause.** The rail was built as an input surface and later started
carrying readings. `72 / 28` is a control and a readout in the same widget and
nobody decided which it is.

**The move.** On `r.unread` the rail's readout halves render blank with their
labels, or the sections collapse. The rule to write into the Bible: no surface
prints a value derived from a default, ever, and the empty state of a readout
is the readout with no number in it, not the default.

**The cost.** Small. Same edit as 1.1.

**The grade delta.** Trust on the first screen. It also closes the copy
director's F1 from the other direction: he wants the invented numerology off
the unread hero, I want the whole class of invented numbers off the unread app.

## 1.3 Two records of the first screen disagree, so nobody owns it

**The finding.** `BIBLE.md`, stated as settled law, says "The app opens on
Field." `CLAUDE.md` says "The app opens on Summary, so Summary is a stranger's
first screen." The code opens on tab 1, Summary.

**The cause.** The Bible is the record of what is ruled and it went stale
without anybody noticing, which means it stopped being load bearing. A law
nobody checks is a comment.

**The move.** Correct the line, and add the rule that the Bible is diffed
against the build every round the way `equiv.py` diffs the engine. The
first screen is the most consequential creative decision in the product and it
currently has two answers on file.

**The cost.** Minutes for the line. The discipline is free and it is the owner's
to enforce.

**The grade delta.** None on screen. It is the difference between a team that
has rulings and a team that has documents.

## 1.4 The intent is stated nowhere a stranger will meet it

Four seconds on the empty app and a stranger can tell you it is about a body,
that there are 112 of something, and that there are a lot of settings. They
cannot tell you what it is for. The sentence that would do it already exists,
written and approved, in `RESEARCH-icp.md`:

    You are still paying for every charge you never released.

It is on no surface in the product. The best line the team has written is in a
research file.

---

# Pass two. Is it one thing, or several things wearing the same palette

Several. Four, by my count, and they are separable by eye.

**The instrument.** The wheel, the body, the compass. Canvas and SVG, drawn
geometry, colour by seat, ring not fill. This is the product.

**The dashboard.** The readout chips, the badges, the rail, the settings grid.
Rounded rectangles, pills, segmented controls. Competent, generic, and it could
be lifted into any analytics product without changing a pixel.

**The document.** The summary plate, the reading paragraph, the codex cards.
Display type, generous leading, real prose. This is the best writing and the
best typography in the build.

**The form.** The intake, the release settings, the story box. Native controls
with a dark skin on them.

Four dialects is not automatically wrong. Tufte's layering says separate
systems should look separate. The problem is that they are not layered, they
are tiled, at equal weight, on the same plane, in the same three column frame,
on every one of the eight tabs.

## 2.1 The frame never changes, so the tabs are not places

**The finding.** The left rail and the right rail are pixel identical on all
eight tabs. Roughly 40 percent of the screen does not move when a person
navigates. Tabs are supposed to be rooms. These are one room with a window that
changes what it looks out on.

**The cause.** The shell was built before the surfaces and it was built to hold
everything at once, which is the correct decision for an instrument you operate
and the wrong one for a product you are met by.

**The move.** Not a rebuild. Give the rail a per tab identity: the rail on
Story is the imprint cloud, the rail on Compass is the axis list, the rail on
Knowledge is nothing at all. The controls that are genuinely global are the
theme, the profile and undo, and they are already in the top bar where they
belong. The rest of the rail is intake, and intake has a tab.

The innovation director reaches the same conclusion from a different door and
he is right: "the left rail, as a permanent fixture beside every reading. Not
because it is too big, because it is the wrong category of thing." Agreed, and
I will sign it.

**The cost.** Medium. `ui/panels.js` renders the rail from one function; it
needs a per tab branch and four small renderers. Nothing in the engine moves.

**The grade delta.** This is the cognitive load item in `CLAUDE.md` that is
recorded as architectural and blocked on a decision. The decision is this one
and I am making it. 57 to 71 simultaneous choices drops to roughly 20 on every
tab except Energetics, which is a form and is allowed to be a form.

## 2.2 The lighting system reaches the chrome and stops at the instrument

**The finding.** Six lightings exist. `wheel.js`, `cone.js` and `map.js`
contain zero references to `S.theme`. The wheel, the compass figure and the
body are byte identical in Dark, Punch, Glass, Glass white and Flat. Only Snow
changes them, through `seatCol`.

So Punch, which is defined as "nothing outlined and everything solid", solids
the buttons and leaves the one object on screen made entirely of outlines
exactly as it was. The theme reaches about 30 percent of the pixels and misses
the 70 percent a person is actually looking at.

**The cause.** Canvas drawing does not inherit CSS custom properties, so the
palette had to be duplicated in JS and only one branch, Snow, was ever written.
An honest engineering reason for a result that is not defensible.

**The move.** One function, `inkFor(theme)`, returning the eight drawing values
the canvas uses: ground, rule, chord, glyph, halo, plate, plate ink, dim.
Called at the top of `draw()`. Then Punch fills the seat arcs solid, Glass
gives the wheel a refracting ground, Flat drops the halo entirely. This is
three hours of work and it is the largest visible return per hour on the list.

**The cost.** Small to medium. It touches three renderers and no data.

**The grade delta.** Glass moves from C to B minus on this alone, because the
owner's note on Glass is "clunky, needs to be crisper" and the reason it reads
clunky is that it is Dark with different button borders and the same wheel.

## 2.3 The lighting gate proves a thing the eye does not see

**The finding.** `tests/design.js` gate 9 asserts six lightings produce six
distinct grounds and passes. Side by side, Dark and Glass are within a hair on
Summary. The gate measures numeric difference in one token and reports it as
character.

`CLAUDE.md` already carries the right rule: "a tool that lies is worse than no
tool, so check the tool against a known good case first." The known good case
here is a person's eye, and the gate was never checked against it.

**The move.** Gate 9 gains a perceptual clause: render the same tab in every
pair of lightings and require a minimum mean pixel delta across the centre
column, not the body background. That is `tools/shots.js` machinery plus a
subtraction.

**The cost.** An afternoon, and it will fail on the day it lands, which is the
point.

**The grade delta.** None directly. It stops a class of finding from recurring,
which is what a gate is for.

## 2.4 Punch breaks a Bible ruling about form

**The finding.** `BIBLE.md`: "Top level navigation is tabs, not buttons. No
boxes." In Punch the nav renders as filled boxes with the active tab as a solid
blue chip. Verified on screen.

**The move.** Either Punch exempts `.top` from its fill rule, or the Bible
ruling gains the words "in every lighting". I would do the first: the nav is
the one place the eye returns to on every screen and it should be the one place
the lighting does not shout.

**The cost.** One CSS selector.

## 2.5 One word, two concepts, and the accounts fork walks straight into it

**The finding.** `TIERDEF` in `engine/data/canon.js` names the CQ bands as
tiers: Corrupt, Oscillating, Embodied. `DECISIONS.md` names the commercial rungs
as tiers: one, two, three, four. In the Settings panel today, `Tier Corrupt`
and `Move to tier one` render 200 pixels apart in the same grid.

The Bible rules one word per concept. This is the clearest live violation in
the product and it is about to get much worse, because the accounts fork puts a
paid ladder and a reading ladder on the same compass.

**The cause.** Both ladders were named by whoever built them first.

**The move.** The reading word becomes **band**, which the code already uses in
`BANDS` and which `BUYERS.md` uses in its own column header. The commercial word
stays **tier**. `TIERDEF` keeps its identifier so no data migrates, and the
renderers change one string. Do it before the accounts build, not after.

**The cost.** Small now. Large in six weeks.

**The grade delta.** None visible. It is the difference between a product that
can explain its own pricing and one that cannot.

---

# Pass three. The emotional arc of a first session, and whether it earns trust

I ran it. This is the pass that found the worst thing in the product.

## 3.1 The product tells a person who just opened up that they wrote nothing

**The finding.** I wrote a real story. The office until eleven, the lie to his
wife, the tightness across the chest, the anger at her for asking. I pressed
commit. This is what came back:

- The top bar changed to `Undo committing the story`. Good.
- The badge moved from `not read yet` to `36%` and the word `Incoherent`.
- The imprint panel, occupying the entire right half of the Story tab, said
  **`Imprints, 0`** and **`You have not written anything yet. Whatever you
  write gets pulled apart and collected here.`**
- The right rail said `Nothing has been entered yet. Write what happened.`
- Simultaneously, the Summary reading said `There are 27 addresses carrying
  under it, which is signal and not yet cost.`

So the engine heard him. It found 27 addresses. And then three separate
surfaces told him he had not written anything. I left the tab and came back and
it still said it.

**The cause.** `ui/imprints.js:69`. The branch is `if(!live.length &&
!ghosts.length)` and the string is `You have not written anything yet.` The
comment above it shows the team choosing that phrasing deliberately, to sound
like a person rather than like the product. It is the right instinct attached to
the wrong condition. The condition is not "nothing written", it is "nothing
crossed the threshold", and those are opposite messages to the person who just
did the bravest thing this product asks of anybody.

**The move.** Split the branch.

    no story committed      You have not written anything yet. Whatever you
                            write gets pulled apart and collected here.
    story committed, none   27 addresses took charge from that and none of
    above the line          them is loaded enough to hold yet. Keep writing
                            and the heavy ones surface here.

The count is already in hand: `impIndex()` has it. The number 27 is the proof
that he was heard and it is being thrown away.

**The cost.** An hour. One branch, two strings, one existing variable.

**The grade delta.** The first session moves from F to C on this single edit.
I am not exaggerating the letter. Right now the product's answer to a person's
first act of honesty is to deny it happened.

## 3.2 The reward for the first story is a verdict, and it is the wrong word

**The finding.** After the story, the product's complete emotional output is:
`36%`, `Incoherent`, and underneath it `Frustrated`.

No acknowledgement. No quotation of his own words back to him. No "here is what
I heard". A number and two judgements.

And look at who receives it. `BUYERS.md` level 4 is Frustrated, band Incoherent
at 31 to 40, and the grid's own note is that this is "the largest population and
the hardest sell". `RESEARCH-icp.md` has Angela walking on this exact word:
"It told me I am incoherent. I closed it. I am not coming back and I am telling
the group chat."

The product's response to a first story from its largest addressable group is
to print that group's own name at them as a diagnosis.

**The cause.** The band word is a data label that was never designed as an
utterance. It reads fine in a table and it is a verdict on a plate.

**The move.** Two parts, and the second is mine rather than the copy
director's.

First, the band words go mechanical. The copy director's F6 proposes `Losing
ground, Under load, Heavy load, Stalled` and those are good. I will sign them.

Second, and this is the creative move: the first reading after a first story is
not a band at all. It is one sentence quoting what the instrument found in his
own words. The engine has it. `parseStory()` returns the addresses it hit and
the highlight layer already exists. The plate on first read says:

    You wrote about the office and about your wife. The charge landed at the
    solar plexus, on the shame axis, at three addresses. Nothing is heavy
    enough to hold yet.

Then the band, on the second reading, when it is earned. A verdict from a
stranger is an insult. A verdict from something that has demonstrated it was
listening is a diagnosis.

**The cost.** Medium. The copy half is a table edit. The quoting half needs
`parseStory().hits` surfaced on the plate, which is a renderer change in
`ui/summary.js` and no engine change.

**The grade delta.** First session C to B plus. It is also the largest
commercial item in this review, because it is the difference between Angela
telling the group chat she closed it and Angela telling the group chat it named
something.

## 3.3 The longest piece of work in the product pays out from a vocabulary of three

**The finding.** The intake asks 63 questions. The payoff is 21 law rows, each
with a score and a finding line. `engine/intake.js:42` generates the finding
line from a three way switch:

    spread < 3        even, within measurement noise
    v[0] > v[1]       holds when it costs, slips when unseen
    otherwise         holds when unseen, slips when it costs

Three sentences for 21 laws. On screen with Diane loaded, Truth, Transparency
and Justice read `6.1` and `spread 3.6, holds when it costs, slips when unseen`,
three times, identically, one under the other.

A person who gives this product fifteen minutes of honest self report gets back
a column in which the instrument appears to say the same thing about
everything. That is the most expensive credibility loss available, because it
happens after the investment rather than before it.

**The cause.** `iqScore` reduces three answers to a mean, a spread and a sign,
and the sign is the only thing the sentence reads. The law's own identity never
enters the sentence.

**The move.** The finding sentence takes the law. `SI` already carries the name
and the seat, and `IQ_STEM` already carries a behavioural stem per law
(`Detachment: let the outcome be the outcome`). Compose from those:

    Truth, 6.1. It holds when it costs you and slips when nobody is looking.
    Seated at the throat, which is where it will show first.

Twenty one distinct sentences from data that is already in the file. This is
not new content, it is content that is already written and not being used.

**The cost.** Small. One function in `engine/intake.js`, no schema change, and
`tests/engine.js` will want a case per law.

**The grade delta.** The intake moves from C minus to B. Derek and James, the
two panel members who walk on measurement claims, both name repetition as the
tell.

## 3.4 The arc has no acknowledgement anywhere in it

Across a full first session there is not one moment where the product stops and
marks that something happened. Commit is instant and silent. The reading
changes in zero frames. `PLAN.md` block 14 lists "reading acknowledgement" as
remaining and it is the most important remaining item in that block.

Miyazaki's rule applies exactly: the quiet moments are what make the loud ones
land. This product is all loud. Every surface is at full density at all times,
so nothing can be emphasised, because emphasis is a ratio.

## 3.5 The boot is the only place the product has an emotional register, and it lasts four seconds

At 0.5 seconds a single dot. By 1.8 a spine of coloured dots rising. By 2.6 a
ring forms around them with a halo above. At 3.4 the wordmark. At 4.2 a hard
cut to the three column dashboard.

Those four seconds are the best creative work in the build. They state the
whole idea without a word: charge sits in a stack in a body, and a field forms
around it. Then the app cuts to something that shares none of that language,
with no transition, and never refers back to it.

That is the shape of the whole product in miniature and it is pass four.

---

# Pass four. Character and stylisation, or tasteful and anonymous

The owner graded Glass a C and asked for character. He is right and the grade
is generous. The honest statement is harder than that, so here it is.

**This is impressive engineering wrapped around a proposition the screen never
makes.** The arithmetic is deep, the content is real, the refusals are better
than anything else in the category, and the thing a person actually looks at is
a well made dark dashboard. I can name four products it would be mistaken for
at a glance and so can Marcus, who is in the panel precisely so that somebody
says this out loud: "If the wheel looks like a dashboard I have already closed
the tab."

It is not that the work has bad taste. It has no point of view. Those are
different defects with opposite fixes, and confusing them is how a team spends
a quarter polishing.

## 4.1 The boldest idea in the product is drawn the most timidly

**The finding.** The compass places a person on an axis running from Jesus,
Buddha, Musashi, Moses, Rumi, Meister Eckhart and Ramakrishna at the top, to
Moloch, Lucifer, Asmodeus, Set, Geryon, Phlegyas, Charon and the Furies at the
bottom, with Dante's layers as the reading of compression over time.

That is an extraordinary thing to put in a piece of software. It is the single
most distinctive asset this product owns, it is unrepeatable by any competitor
because it requires having read the material, and it is rendered as 11 pixel
grey labels with small outline glyphs, scattered over a pale wireframe, with the
person's own position drawn as a 6 pixel dot.

The names collide. `The blueprint` sits on top of `Asmodeus`. `Charon` sits on
the reader's own number. `Geryon` runs into a mesh line. The hierarchy is
inverted: the demons and the saints are drawn at the same weight as the axis
labels, and the one mark that answers the question the person came with, where
am I, is the faintest thing on the canvas.

**The cause.** The compass was built as a data view and the figures were added
to it as annotations. Nobody art directed it as a picture.

**The move.** Three things, in order.

1. The person's mark becomes the brightest object on the canvas. A haloed disc
   at three times its current radius with the number set in display type
   alongside it, not inside it. Everything else drops to 60 percent.
2. The figures get real symbols at real size. `PLAN.md` block 3 item 3 already
   calls for "a symbol for every character, Jesus through Lucifer" and it is
   unbuilt. Mignola is the reference: a black shape carries more than a label
   does, and it does not collide because it is a shape.
3. The label layer gets the collision solver that `tests/collide.js` already
   runs on the wheel. That gate covers `TAB.FIELD` only. The surface that
   visibly collides has no gate on it, and the surface that does not collide
   has 40 assertions.

**The cost.** Medium for 1 and 3, an afternoon per batch for 2. `PLAN.md` sizes
block 3 as the biggest single surface rebuild and most of it is already done.

**The grade delta.** The compass moves from D plus to B minus, and it becomes
the screenshot. Marcus's stated condition for opening the product at all is
"one screenshot of the instrument that is clearly not a template". This is that
screenshot and it is four fifths built.

## 4.2 The icon system states a law and then breaks it in the codex

**The finding.** The Bible: "If it has a name it has an icon. The icon has a
family. The family has a colour." In Knowledge I sampled eight cards and found
three unique icon paths. Fear, Shame, Guilt, Control, Insecurity, Victimhood,
Scarcity, Possession all wear the same hexagonal ring, distinguished only by
the red of the Root family.

So the codex, which is the surface whose whole argument is "every part of the
system, open", renders 112 named things as one glyph repeated. A person zooming
into it resolves into geometry rather than into language, which is exactly what
`PLAN.md` block 4 item 2 says and marks as a standing Bible violation.

**The move.** It is an afternoon per family and there are eleven families. But
the sequencing matters and this is the creative call: do not draw 112 icons.
Draw the 21 laws and the 6 masks first, which block 4 names, because those are
the things a person meets in a finding. The node cards can keep the family mark
and gain a second, smaller mark for their axis, which is nine shapes rather than
112.

**The cost.** Two afternoons for the priority set. Reduces the standing debt
from 112 to 27.

**The grade delta.** Knowledge from C to B minus. It also fixes the thing the
owner called linear and boring, because a deck of identical cards is a list
with rounded corners.

## 4.3 The badge is the right component applied to the wrong half of the data

The innovation director wants the ring plus pill badge killed, on the grounds
that it contradicts "a reading is never a count against a total". I am ruling
against him and for a third thing.

A ring closing by share is honest when the quantity is a share. `Creator 22%`
of the archetype weight is a proportion and a closing ring is the correct mark
for it. The same badge is dishonest when the quantity is a position on a scale:
the masks render `Child 1.4`, `Preteen 3.1`, `Teen 2.4` inside a ring that
implies a whole those numbers do not belong to.

So: keep the badge, restrict it to proportions, and give scalars a different
mark. A scale with a needle, which is what innovation proposes, is the right
mark for the second class and the wrong one for the first. Two marks, each
truthful about a different kind of number, is more character than one mark
everywhere and it costs the same rewrite in `ui/component.js`.

This also resolves the live violation that nobody has flagged: Settings prints
`Coherence 29 of 100`, which is the Bible's forbidden form in plain text, on
the one surface a person opens to find out what they have.

## 4.4 What character would actually look like here

The material is sitting in the file. The four words the team already shares are
the answer and they are not being applied.

**Ma.** There is no emptiness anywhere in this product. Every panel is full at
all times. The wheel is 26 percent of its own canvas with dead space around it
that reads as an accident rather than as a decision, which is the worst of both:
the emptiness is there and it is not doing anything. Either the wheel fills its
column, which `PLAN.md` block 2 item 1 asks for, or the emptiness becomes the
frame and gets a horizon line. Undecided emptiness reads as a bug.

**Shibui.** Quality that reveals more the longer you stay. The zoom is exactly
this and it is the best interaction in the product. Almost nothing else
rewards a second look, because everything is at maximum density on the first.

**Wabi-sabi.** Evidence of the hand. There is none. Every line is 1 pixel and
mathematically clean. The one place a hand would change everything is the body
figure, where the field is already continuous and beautiful and the markers are
mechanical rings clotted at the solar plexus into something that reads as a
rash.

The specific stylisation I would direct, and I can defend every part of it from
the library:

- **Light does the exposition.** Blade Runner, and this product already has the
  mechanism: the halo, the aura, the seat colour. Stop labelling and start
  lighting. The heaviest seat should be the brightest thing in the room and
  everything else should fall away. `render()` already sets the heaviest seat on
  the body for Punch. Use it everywhere.
- **The black shape carries the meaning.** Mignola. The figures on the compass,
  the icons in the codex, the markers on the body. Shapes, not rings with
  labels.
- **One series, not twelve one-offs.** Hokusai. The 112 addresses are a series
  and they are currently one drawing repeated. A series is where the character
  lives in a product with this much content.
- **The quiet makes the loud land.** Miyazaki. There is no quiet.

---

# Pass five. The competitive question. Why would a person stay

## 5.1 What is genuinely defensible

Three things, and they are real.

**The refusals.** This product tells a person what it has not measured. "No
birth data on file, so the spiritual layer is not in this reading." "Nothing is
generated from anything the instrument has not measured." Nothing in the
category does this. It is the strongest asset the product has and it is
currently a footnote in 11 pixel grey at the bottom of a panel.

**The content depth.** 112 addresses, 21 laws, the Dante layers, the compass
figures. A competitor can copy a wheel in a week. They cannot copy this without
writing the book.

**The one file.** No network, no account, no backend. In a category built
entirely on harvesting intimate self report, "nothing left this device" is a
position, not a constraint. `DECISIONS.md` already rules it: "We never sell
anybody's data. Ever." That is a marketing asset the product does not use.

## 5.2 Why a person would leave anyway

**The proposition is unstated.** Pass one. Four seconds on the screen produces
no answer to "what is this for".

**The payoff is a label.** Pass three. The thing you get for your honesty is a
word about your character.

**There is no tomorrow in it.** The game director grades the product's ability
to bring somebody back a D, and I agree with his facts. The compass shows
`0 days, last run` and `Nothing on the record yet`. The ladder exists in `engine/ladder.js` and is
careful work, and `PLAN.md` block 12 has points and tiers unbuilt. Nothing in
the product answers "why would I open this again on Thursday". The one mechanism
that could, undo plus the field as a vector over time, is the innovation
director's proposal seven and I back it.

## 5.3 The commercial model is invisible and it is the best thing about the offer

**The finding.** `DECISIONS.md` rules a gift: a new person gets 100 patterns
free with everything visible, and explores the whole app until the gift is
spent. That is a genuinely good offer and it is unusual: sight is not for sale,
every tier sees the whole reading, what a tier buys is new ground.

The entire thing lives in a card in Settings, between Lighting and Screen
density, styled identically to both. The gift counter reads `New ground, 100 of
the gift left` in a label the same size as `Comfortable, what the reading was
designed at`.

The product's business model is rendered as a preference.

**The cause.** Billing was designed in `DESIGN-billing.md` and placed wherever
there was room.

**The move.** The gift is an onboarding device, not a setting. It belongs on
the first screen as the fifth door: "You have a hundred patterns. Spend them on
anything. Nothing is locked." And the meter belongs beside the release control
in Story, where a pattern is actually spent, so a person learns the currency by
using it rather than by reading about it in Settings.

**The cost.** Medium. `ui/release.js` already computes `meterPlan` and
`meterFirst` and nothing renders them prominently.

**The grade delta.** Conversion, which I cannot letter grade. But
`RESEARCH-icp.md` records Diane and James both walking at step 4 on a payoff
that is one install away, and a visible gift is the answer to exactly that.

## 5.4 The arithmetic nobody has run in front of a customer

**The finding.** Derek, the endurance ICP, runs the division in
`RESEARCH-icp.md` section 5 and every number in it comes from `DECISIONS.md`:

> "Two thousand patterns a decade, so at 39 I hold about 7,800. Free tier is
> 10 a week, 520 a year, and I accrue 200 a year just by living. Net 320. That
> is twenty four years. Tier one is 400 a month, so call it twenty months of
> paying every month to clear what I walked in with."

Twenty four years on free. Twenty months on tier one. The product has a
horizon problem and the horizon is in the data model.

This is not mine to price. It is mine to say that the product must not let a
customer be the first person to do this division. Either the horizon is stated
honestly on the tier screen, which Derek's own reaction says he would respect,
or the pattern grant is not the thing tiers are sold on. The one option that is
not available is silence, because Derek is the ICP who buys at 85 percent and
he is also the one who will publish the arithmetic.

## 5.5 Mobile, which is where the accounts fork will be met

**The finding.** At 390x844, the header consumes 580 of the first 844 pixels.
Wordmark, eight tab nav, profile select, undo, redo, theme, help, account. The
nav clips mid word at `Comp`, so Body, Compass, Knowledge, Games and Summary are
behind a horizontal scroll with no affordance. On Field, the badges `112
addresses, SQ, 8 loaded` and `saboteurs, 13` are drawn across the seat labels,
striking through `Crown` and `Root`.

That last one has already been ruled on. `FEEDBACK-log.md`, the owner, 17
September: "display information over the main feature is bad design, shrink it"
and "I do not like text hovering over things unless I can read it." The ruling
was applied to the key card and the same defect shipped at phone width in the
same place.

**Who this breaks.** Sofia, weight 140: "it has to be findable from a phone, in
bed, with no install first." She is the practitioner ICP and the practitioner
panel is the tier four product.

**The move.** At phone width the nav becomes a bottom bar of five with the rest
behind one control, the header collapses to wordmark plus profile plus account,
and the wheel badges move into the strip above the canvas the way the key
already did.

**The cost.** Medium, and it is a media query plus the same fix that already
shipped once.

**The grade delta.** Phone from D to C plus. It is a prerequisite for the
accounts fork rather than an improvement to it.

## 5.6 The honest answer to the question

If a person saw this beside anything else today, what would make them stay is
the writing and the refusals, and neither of those is visible in a screenshot.
Nothing in the picture would hold them. That is the whole finding of pass five
and it is why 4.1 is on this list: the compass is the one image this product
could own outright, and it is four fifths built and drawn at a whisper.

---

# The three things that matter most

## One. The product denies the person's first act of honesty

`ui/imprints.js:69`. A committed story that produces 27 carrying addresses
returns `Imprints, 0` and `You have not written anything yet` on the surface the
person is looking at, while another surface in the same build reports the 27.

**Why this is first.** Everything else on this list is a matter of degree. This
is the product being wrong about something the person knows for a fact, at the
single moment of maximum vulnerability, in the core loop. No amount of craft
survives it. A mirror that says nothing is there when you are standing in front
of it is not a mirror, and `BIBLE.md` says a mirror you cannot inspect is not a
mirror. This is worse: it is a mirror that reports empty.

It also costs an hour. One branch, two strings, one variable already in scope.
The ratio of damage to cost is the highest in this document by an order of
magnitude, and it will have been shipping for as long as imprints have existed.

**Delta:** first session F to C, for one hour of work.

## Two. The rail is a permanent control surface parked beside every reading, and it is why nothing can be emphasised

66 interactive controls, identical on all eight tabs, rendering a value derived
from a default on a profile that has entered nothing. 89 visible controls on a
stranger's first screen with no data behind any of them.

**Why this is second.** It is the cause behind four separate symptoms that are
being tracked as four separate problems: the cognitive load item in `CLAUDE.md`
recorded as architectural and blocked, the stranger's first screen reading as a
dashboard, the summary rebuild that took the centre from 115 interactive
elements to 34 while the page stayed at 116, and the fact that no surface in
this product can be made loud because everything is already at maximum.

That summary number is the tell and it is uncomfortable. `PLAN.md` block 1 is
marked DONE with the stated proof "under 40 interactive elements at rest, under
two screens tall". The centre is 34 and passes. The page is 116 and the centre
alone is 2873 pixels, which is 2.9 screens. The work was real and the
measurement was taken on the surface being graded rather than on the person's
screen. The clutter did not go away. It moved left, and by moving left it
became permanent, because the rail persists across every tab while the centre
at least changes.

The innovation director reached the same conclusion independently and by a
different route. Two of six reviewers converging on one structural cause is the
strongest signal available in a round like this.

**Delta:** 57 to 71 simultaneous choices per screen down to roughly 20 on seven
of eight tabs. It closes the standing architectural item.

## Three. The compass is the only image this product could own, and it is drawn at a whisper

Saints at the top, Dante's hell at the bottom, a person's own position between
them, and the whole thing rendered in grey 11 pixel labels that collide with
each other over a pale wireframe, with the person's own mark as the faintest
object on the canvas.

**Why this is third and not lower.** The owner asked for character and
stylisation. Character is not a treatment you apply evenly; it is one thing
drawn so hard that everything else is read in its light. This product has
exactly one candidate and it is already built, already argued from the material,
already ruled in `DECISIONS.md` under "The Inferno is the way in", and
unrepeatable by any competitor who has not read the book.

Three moves get it there and two of them are already in `PLAN.md` block 3,
unbuilt: the person's mark becomes the brightest object, the figures get real
symbols instead of labels, and the label layer gets the collision solver that
already exists and currently runs on `TAB.FIELD` only.

It is also the answer to pass five. Marcus's stated condition for opening the
product at all is one screenshot that is clearly not a template. This is it.

**Delta:** compass D plus to B minus, and the product gains a picture.

---

# Missed opportunities

Twelve. Ordered by what they would return, not by cost.

**1. The refusals are the brand and they are set in 11 pixel grey.** "Nothing
here is generated from anything the instrument has not measured." Nothing in
this category says that. It is the single most trust building sentence in the
build and it is a footnote. It should be a fixed element with its own mark, in
the same position on every surface, the way a watermark sits on a banknote. Make
the honesty a visible piece of furniture and it becomes the thing people
describe to each other.

**2. The boot states the whole idea and is never referred to again.** A spine
of coloured dots rising into a haloed ring. That is the product. Then a hard cut
to a dashboard that shares none of that language. The boot should not end, it
should resolve: the ring becomes the wheel, the spine becomes the left edge, and
a person who understands the picture at 4 seconds still understands it at 40.
This is a transition, not a rebuild.

**3. The body is the best surface and the least used.** The Nummenmaa field
landed and it is genuinely good. `NERVEBR` holds 72 traced polylines already
tagged by seat, sitting in the file with nothing reading them. Painting where it
hurts and getting back "this is what sits there and here is the story you told
about it" is the most native interaction this product could have, and the hit
geometry is already built.

**4. The engine knows eighteen things it never says.** `PLAN.md` block 7:
`pathOf`, `markersFor`, `boundaryCross`, `equivOf`, `verpShare`, `r.steer`,
`CASCADE` have zero callers in the UI. Seven computed readings, drawn nowhere.
`pathOf` in particular, the route a thought takes through the stack, is the
thing a person would screenshot.

**5. The gift is the best offer in the category and it is a Settings row.**
A hundred patterns, everything visible, spend it on anything. Put it on the
first screen as the fifth door and put the meter where a pattern is spent.

**6. Nobody hears anything.** There is a sound director on the roster and not
one earcon in the build. A product about charge in a body, on a phone, with
haptics available, is silent. The commit is the moment: one low sound and one
short haptic when the instrument takes a story in would do more for
acknowledgement than any amount of motion, and it costs one audio buffer
generated in code, which does not break the one file rule.

**7. The four doors are the best structural idea and they appear once.** "Write
what happened. Read nine sentences. Go year by year. Say who you are becoming."
Four genuinely different ways in, each pitched at a different person, and they
vanish the moment anything is entered. They should be a permanent, quiet
affordance: four ways to add to the reading, always available, always in the
same place.

**8. The story is entered and never seen again.** A person writes the most
honest thing in their week and it disappears into a scoring engine. It is never
quoted back, never shown next to the reading it produced, never re-readable
against a field that has moved since. The innovation director's proposal six
names this and I am putting it here as a creative loss, not a feature gap:
the person's own words are the only asset in this product they made themselves.

**9. Six lightings and one instrument.** Three hours of `inkFor(theme)` and the
product goes from one look with six chromes to six looks. The owner's C on
Glass is a direct consequence.

**10. The compass figures have no stories.** `PLAN.md` block 3 item 4: select a
character, see their story and their polar opposite, because the whole point is
two paths of one behaviour. That is the codex's best teaching device and it is
an unbuilt click handler.

**11. The zoom is the best interaction and only the wheel has it.** Scroll to
atomise, F to reframe. `DECISIONS.md` rules that analytics atomises the same way
and it is not built. One verb across the whole instrument is what makes a set of
surfaces feel like one machine.

**12. Nothing anywhere is allowed to be empty.** Every panel is full at all
times, so no surface can be emphasised, because emphasis is a ratio and this
product has no denominator. Ma is in the team's own shared vocabulary and it is
on no screen. The single richest unused tool in the building is the decision to
leave a region deliberately blank.

---

# Disagreements

All seven parallel reviews had landed by the time I reached this pass:
`copy.md`, `innovation.md`, `uiux.md`, `sound.md`, `game-design.md`,
`technology.md` and `funnel-strategy.md`. I read the grades and the finding
tables, not the full texts, and I am only writing down where we actually
differ or where the convergence itself is the finding.

## First, a correction against my own method

The UI/UX architect's F01 records that the Games tab renders an empty stage,
because `gmRender` is gated on `i===TAB.KNOW` in `ui/panels.js:168`. My own
Games screenshot shows a populated tab, because I drove the app with
`setTab(7)` through the console rather than by clicking the tab. My method
bypassed the broken path and produced a picture of a defect not happening.

I am recording that at the head of this section rather than burying it.
`CLAUDE.md` says to check the tool against a known good case first, and a
screenshot harness that navigates by function call is not a known good case for
anything a person reaches by clicking. Every screenshot in this review, and in
`tools/shots.js`, carries the same blind spot. The harness should click.

## Where we agree, which is worth recording

The copy director's F1, the invented numerology on an unread field, and my 1.2,
the rail printing a default derived reading, are the same defect found from two
directions. Neither of us saw the other's. That is the cause worth naming: this
product has no rule about what a surface may render before it has data, and two
reviewers independently tripped over the consequence.

The innovation director's "kill the left rail as a permanent fixture" and my
number two are the same finding. He is right about the reason as well as the
conclusion: it is the wrong category of thing, not merely too much of it. The
UI/UX architect lands on it a third time as his F09, and he has the number
moving in the wrong direction: the repository records 57 to 71 simultaneous
choices and he measures 70 to 111, of which 63 to 73 are constant chrome. Three
independent reviewers, one cause, and the load has grown since it was last
written down. That is no longer a finding, it is a decision that is overdue,
and pass two of this review makes it.

Four of us found the same collision on the word tier: my 2.5, the UI/UX
architect's F14, and it is implicit in both commercial reviews. Nobody
disagrees. Settle it before the paywall.

Three of us found a surface printing a reading off a default before anything is
entered: copy F1, UI/UX F03, my 1.2. Again no disagreement, and again the
absence of a rule is the cause. Write the rule.

## 1. The repeated law gloss. I say he has the severity wrong

`copy.md` F31 lists `spread 5.6, holds when it costs, slips when unseen`
repeated twenty one times as **low** severity, and the fix as "the gloss once at
the head of the column."

I disagree, and this one matters. The repetition is not a typographic problem,
it is the visible symptom of `engine/intake.js:42` generating all 21 findings
from a three way switch. Moving the gloss to the column head hides the tell and
keeps the defect: the person still has 21 rows of law names attached to readings
that do not vary by law. That is the payoff of the longest task in the product
and the credibility loss happens after the investment, which is the most
expensive place for it to happen.

**Who is right:** I am on severity, he is on cost. His fix is an hour and mine
is a morning. Do mine. The data to compose 21 distinct sentences is already in
`SI` and `IQ_STEM` and is not being read.

## 2. The ring and pill badge. I am ruling against innovation

`innovation.md` wants the badge killed as the universal rendering of a reading,
on the grounds that it contradicts "a reading is never a count against a total",
and explicitly asks the owner to move a Bible ruling.

He is half right and the half he has wrong is the half that matters. A ring
closing by share is not a count against a total, it is a proportion, and a
proportion is a legitimate reading. `Creator 22%` of the archetype weight is
honestly drawn by a closing ring. What is dishonest is the same badge around
`Child 1.4` and `Teen 3.1`, which are positions on a scale and have no whole to
close against.

**Who is right:** neither, and the third answer is better than both. Keep the
badge for proportions, give scalars a needle on a scale, and the product gains a
distinction it currently does not make instead of losing a component it has
already standardised on. Same rewrite in `ui/component.js`, no Bible ruling
moves, and the live violation both of us should have flagged is Settings
printing `Coherence 29 of 100` in plain text.

## 3. Killing Knowledge as a top level destination. I am with him, with a condition

He proposes Knowledge stops being a tab and becomes what the drills open into.
I agree with the architecture and I want the condition stated: the codex is the
thing that makes this unrepeatable, and burying it behind drills only works if
every named thing in a reading is a door into it. Today most are not. Build the
doors first, then fold the tab. Fold it first and the best content in the
product becomes unreachable.

## 4. The band words. Both of them are right and I want to add the second half

Copy F6 replaces `Severe, Corrupt, Incoherent, Collapsed` with `Losing ground,
Under load, Heavy load, Stalled`. Signed, and it is the largest commercial item
in either review.

The half neither of them names: the first reading after a first story should
not be a band at all. It should quote what the instrument heard. A verdict from
a stranger is an insult; the same verdict from something that has demonstrated
it was listening is a diagnosis. The band words being gentler does not change
which of those two is happening.

## 5. The one nobody else found, and I want it checked

My number one, the imprint panel telling a person who has just committed a
story that they have not written anything, appears in no other review. The
UI/UX architect's F02 is adjacent and is a different string in a different
file: he found the right rail printing `Nothing has been entered yet` from
`p.says` beside a live 36 percent reading, at `ui/ui.js:738`. Mine is
`ui/imprints.js:69` and it fires on a profile that has genuinely written
something.

They are two instances of one class, and the class is the real finding: this
product has several empty state strings that are conditioned on the wrong
predicate, and they fire together. On the screen I captured after committing a
story, three separate surfaces told the person nothing had been entered while a
fourth reported 36 percent and 27 carrying addresses. Fix them as one job, with
one rule: an empty state may be conditioned on "this person has entered
nothing" or on "this list is empty", and those two conditions never share a
string.

## 6. Where the game director and I differ on emphasis, not on fact

`game-design.md` grades the product's ability to bring somebody back a D and
names the streak as the only returning mechanic. I agree with every fact in it.
Where I would push back is on sequencing: he moves D to B through five
mechanics, and four of the five are things rendered on a surface. None of them
will hold anybody if the product still denies the person's first story, because
returning is downstream of the first session being worth having. Fix the loop's
honesty, then build the ladder onto it. His cheapest item, reading the ritual
log back as an if then plan, I would pull forward regardless.

## 7. The sound director's microphone finding outranks his own grade

`sound.md` grades the audio dimension C minus and records, inside it, that
`ui/storyui.js:224` uses `SpeechRecognition`, which in Chrome, Edge and Safari
sends the audio to the browser vendor, in a product whose entire position is
that nothing leaves the device.

That is not an audio finding. It is the single largest breach of the product's
stated position anywhere in this build, and it sits filed under a review most
people will skim for earcons. I am lifting it out.

It is also the sharpest instance of my 2.3. `tests/design.js` gate 7 is the
gate that watches the network and it stays green, because a speech call is a
platform call rather than a page request. So the product has a gate whose whole
job is to prove nothing leaves the device, passing, while a person's spoken
story leaves the device. That is the definition of a tool that lies, and this
project already wrote the rule about those. Two findings, one cause: the gates
prove the things that were already fixed.

Handle it as a privacy blocker, not as sound, and give gate 7 the platform
calls as well as the page requests.

---

# Grade

**The whole, now: C minus.**

Not a C. I have taken it below the owner's grade on Glass because I am grading
the composite and he was grading a lighting, and the composite carries three
things a lighting does not.

The build is real. The arithmetic is deep, the gates are serious, the refusals
are the best in the category and the summary plate is genuinely good work. That
is all true and it is what holds the grade at C minus rather than lower.

It is pulled down by three things, each verified this session.

The core loop denies what the person just did. A committed story returns
`Imprints, 0` and `You have not written anything yet` on one surface while
another surface in the same build reports 27 carrying addresses. Everything
downstream of that is decoration.

The proposition is not on the screen. Four seconds with the empty app produces
no answer to what this is for, because the loudest thing on a stranger's first
screen is 89 controls with no data behind them and a bank of readouts showing
dashes. The best sentence the team has written is in a research file.

And it has no point of view yet. This is impressive engineering wrapped around a
proposition the picture never makes, and at a glance it would be mistaken for
four other products. That is not bad taste, it is absent direction, and the two
have opposite fixes.

**The ceiling: A minus.**

Not an A, and the reason is the same one the copy director reached by a
different route. This product carries more named things than a person can hold
on one screen, and that is structural rather than editorial. An A would need the
stack exposed progressively rather than simultaneously, and that is a season of
architecture, not a quarter of craft.

A minus is genuinely reachable and most of what stands in the way is already
written and not wired up. Seven computed readings with no caller. 72 traced
nerve polylines with nothing reading them. The compass figures ruled and drawn
as labels. `inkFor(theme)` unwritten and six lightings waiting on it. The gift
sitting in a Settings row. The four doors rendered once and thrown away.

**The specific thing that closes the gap: make one surface load bearing, and
make it the compass.**

Not a pass over everything. This product's problem is that twelve surfaces are
all at the same volume, and the fix for that is never to raise eleven of them.
Pick the one thing that could only exist here, draw it so hard that everything
else is read in its light, and let the rest of the product get quieter around
it.

The compass is that surface and it is four fifths built. Saints at the top,
Dante at the bottom, a person's own position between them, moving over thirty
days. Make the person's mark the brightest object on the canvas. Give the
figures real symbols instead of grey labels. Run the collision solver that
already exists on the labels that actually collide. Then let selecting a
character open their story and their opposite, which block 3 already ruled and
nobody built.

That gets the product a picture. Once it has a picture it has a point of view,
and once it has a point of view every other surface has something to be quieter
than. C minus to B is the compass plus the imprint branch plus the rail. B to A
minus is the twelve missed opportunities, in the order they are written.

The imprint branch is one hour and it comes first regardless, because a product
that tells a person they said nothing has not earned the right to be graded on
anything else.
