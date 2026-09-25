# Atüned / SOURCE. The Bible

Version one. Assembled 25 September 2026 against commit `f885d8f` on branch
`claude/laughing-feynman-xhfyj3`. Kept by the project manager as a standing
job, not a document that closes (`DECISIONS.md`, "New, logged the same round",
One Bible; `TASKS.md` AZ2).

His words: "I want to lock the CQ formula into the brief, and make sure all
the stuff is combined in our brief, so that we have one Bible that has our
entire product in it, engineering, design, art, everything we've done,
schemas, architecture, all of our technical and creative design docs being
updated constantly. That's the job of the project manager, to make sure things
are just updated."

This file replaces the first `BIBLE.md` (19 September), which held only the
settled rulings. Every line of that page is carried forward below, corrected
where a later ruling or the code overtook it. Section 14.4 lists each
correction, so nothing was dropped without a record.

---

## 0. How to read this

**What this is.** The whole product in one place: what it is, the rulings
that govern it, the coherence formula, the look, the motion, the screens, the
architecture and the schema, the mechanisms, the gamification, the commercial
and privacy position, and the state of the desktop port. Each part states the
current position and names the file that holds the detail.

**What this is not.** It is not the backlog, the order of work or the log of
rulings. Those move every day and live in `TASKS.md`, `PRIORITY.md` and
`DECISIONS.md`. Section 12 points at them. A fast list copied into a slow
document goes stale within days. `CLAUDE.md` records more than a dozen cases of
this in this repository.

**Four rules this document keeps.**

1. **The code wins over any document about the code.** Built behaviour
   described here was read off the source or off a run. The stamp says which
   commit.
2. **His later ruling wins over his earlier one.** Where he has ruled twice,
   both are recorded with their dates. The later one is stated as current.
3. **Where two sources disagree and nothing has ruled between them, this
   document says so and names both.** It does not pick. Section 13 lists every
   disagreement found while assembling it.
4. **No count is typed here that the product can outgrow.** Gate counts,
   choice counts and file sizes are read off the run. The few fixed values
   below (hex colours, TAB integers, formula constants) carry the commit they
   were read at.

**Status tags.**

| Tag | Meaning |
|---|---|
| RULED | The owner has ruled. Settled until he rules again. It is not re-argued without named new evidence. |
| BUILT | In `atuned_src/` at the stamp. |
| DESIGNED | Specified in a design document or a prototype. Not built. Being designed does not mean approved. |
| PROPOSAL | A team recommendation put to him and not yet confirmed. |
| OPEN | His call, unresolved. Build a seam that fits either answer. |
| RUNNING | Ordered and under way. No result yet. |

**Contents**

1. [The product, and the rulings that govern everything](#1-the-product-and-the-rulings-that-govern-everything)
2. [The coherence formula: CQ, DQ and SQ](#2-the-coherence-formula-cq-dq-and-sq)
3. [Visual language](#3-visual-language)
4. [Motion](#4-motion)
5. [Information architecture and screens](#5-information-architecture-and-screens)
6. [Interaction design](#6-interaction-design)
7. [Architecture, data and schema](#7-architecture-data-and-schema)
8. [The engine and its mechanisms](#8-the-engine-and-its-mechanisms)
9. [Gamification](#9-gamification)
10. [Commercial, privacy and the accounts fork](#10-commercial-privacy-and-the-accounts-fork)
11. [The desktop port](#11-the-desktop-port)
12. [Where everything else lives](#12-where-everything-else-lives)
13. [Where the sources disagree](#13-where-the-sources-disagree)
14. [Keeping this document](#14-keeping-this-document)

---

## 1. The product, and the rulings that govern everything

### 1.1 What it is

Atüned is a somatic diagnostic instrument and a mirror. A person tells it
something true, in their own words. The engine reads charge out of the story:
which of nine axes is carrying, at which of the 112 addresses, against which
of the 21 laws of integrity. It renders where that charge sits in the body and
what it costs. It says what is running and never who somebody is.
(`PRODUCT.md` 1, `CLAUDE.md`.)

It says: this is you, this is everything that is running you, from the top to
the bottom. Everything is exposed. Transparency is held as a natural law, not
a policy: a mirror you cannot inspect is not a mirror. (First Bible, "The
product".)

The name is Atüned. The line "Source OS" sits under the wordmark (colour, see
section 13, item 10).

**Form today (BUILT).** One HTML file, no dependencies, no outbound request,
no backend. The person's record lives in their own browser. The engine is also
built alone as `engine.js` and runs headless.

**What the practice is for, in his words** (`DECISIONS.md`):

> This is the practice of finding the biases that have conditioned our
> behaviour in ways that are against our better nature, our intentions, and the
> lives that we truly seek to live. This is a path of liberation. A mirror held
> up to you with the practice that aids the spiritual journey. Turning decades
> into months, and showing your true nature, revealed. Without judgment. With
> the purpose of becoming better people. Regardless of our score.

Three rulings sit inside that and the copy may not soften them. **Turning
decades into months** is a time claim, not an outcome claim. **Without
judgment** is why no label is ever about a person. **Regardless of our score**
means coherence is not a rank, and no surface may imply that a person at a low
reading is further from becoming a better person than anybody else.

**Coherence, as he framed it** (first Bible): the alignment between the world
around you, what arrives from it, the way you read what arrives, the intention
behind it, and the action that follows. Four stations, one circuit. The field
is the geometry of awareness's radiance. It is harmonic, so patterns sit at
registers, and what radiates outward carries the colour of the loudest seat.

**Who it is for** (`PRODUCT.md` 2). A person between 36 and 57 who is already
working on themselves and has run out of instruments. Not in crisis, not new
to the material, output at stake, able to describe their own problem, and
missing a measurement. The reference people are in section 6.1.

### 1.2 What it is becoming (RULED)

**The fork is called. This becomes an accounts product.** A web quiz as its
own flow, a record store, sign in, a practitioner who can be granted sight of
a person's data, paid tiers, and push notifications for ritual
accountability. (`CLAUDE.md`.)

That does not license building it all at once, and the engineering posture
survives it:

- `source.html` stays one file with no dependencies. The app gains network at
  exactly one seam: fetching a record at sign in.
- The engine stays host free. No `fetch` in `engine/`.
- Storage is the person's own device for everything except the quiz record,
  so a save failure is still reported, never swallowed.
- A practitioner seeing somatic and psychological self report is a
  consequential grant: explicit consent, a visible list of who has sight, and
  revocation. Never a silent default.
- Records off the device mean a controller exists. Access, deletion and breach
  obligations attach.

In scope now and still undesigned: auth, the paywall and tiers, push, a points
and badge ladder, and a practitioner view. Each is designed before it is
built.

### 1.3 The loop, the centre and the content chain (RULED, 20 September)

**The process is discover, play, flow, embody.** His correction: the last
word is embody, not body. It is the spine. Nothing ships that does not move a
person through those four.

**It is a circle, never a list.** His reason: "we're showing a core game loop
mechanic." A numbered column of four says the fourth is the end. Anywhere the
four appear together, they close. Status: the loop is drawn nowhere in the
build. It exists in two prototypes, which map it differently (section 9.3).

**The avatar is the centrepiece.** "What is Atuned? Your avatar." Not a page,
the centre. A person watches their avatar improve, driven by releases and by
going round the loop. The layers are sewn: the avatar to the ritual, the
ritual to the psyche, the psyche to the body locations, the body to the story.
Then, sharper: "What you're improving is the conductivity of the kundalini.
That's our primary goal with the avatar." Status: the avatar data model is
built, nothing writes to it, and no figure exists (section 9.10).

**The content chain, in his words.** What a person enters in the journal is
added to the imprints. Part of that becomes a story they have to release. Part
becomes a practice inside the ritual. Sometimes it becomes an affirmation,
also in the ritual. The gamification exists to keep that turning, so the
content has to be driven enough to make it sticky. Status: built from journal
to ritual pick. The last link, the person's own words carried into the
practice or an affirmation, is DESIGNED (section 9.4).

### 1.4 The standing rulings

Each line is RULED unless marked. The source is named where it is not
`CLAUDE.md`.

**Voice**

- No em dashes, anywhere, including commit messages and documents.
- The count stated to users is 112. Never say 108.
- Mechanical and precise. Short sentences. Physical metaphors only. No soft
  wellness language. Grounded and direct, humble, insightful, meaningful
  context, nothing abstract (first Bible).
- **Case.** Body copy is sentence case. Headers and labels take a capital on
  every word, applied by style, not typed. A person's own name is exempt: de
  Vries is never De Vries. No all caps anywhere, except the logotype.
  (`DECISIONS.md`, "Case, ruled" and 19 September: "the stylesheet was right
  and `CLAUDE.md` was wrong". Two documents still say plain sentence case:
  section 13, item 5.)
- Menus: one word, and the word says exactly what the thing does.
- One word per concept. A real distinction keeps its own word: held,
  installed and firing are three states and stay three words.
- **The register** ("We are not judging anybody."). The product says what is
  running, not what a person is. A label on a pattern may be blunt. A label on
  the whole person may not be a moral word. A label this product puts on a
  person carries a definition, the behaviour it produces, and the direction
  out of it. The order of every reading: what is running, how it works, how it
  operates in you, the behaviour you want, let us release it, the route to it.
  (`DECISIONS.md`, "The register".)
- **The felt sense has a fixed order**: resistance, barrier, release, relief,
  calm, peace. The copy may not reorder it or promise the end before the
  barrier. (`DECISIONS.md`.)
- **Equivalence.** Throughput, never outcome: "as many patterns as", never
  "the same as" or "instead of". The low end of a range gets said.
  (`DECISIONS.md`, "The equivalence".)
- The house voice as a system (the Encarta anchor, the warmth pass, the micro
  rules V1 to V20, his objections as a database, and the gate) is
  `.claude/skills/atuned-voice/SKILL.md`. It loads before any user facing
  string is written.

**Form**

- Icons are ring, not fill.
- If it has a name it has an icon. The icon has a family. The family has a
  colour. The colour means something.
- Muted palette, argued from autonomic response. Severity is carried by
  saturation and size, never by hue. Lumen is the one named exception: "Lumen
  is about vibrancy."
- The alarm colour is reserved for something being wrong. A high reading on
  a scale where high is good is never the alarm colour.
- Every percentage is one object: an icon, a ring showing the value as an
  arc, and a pill carrying the number. A domain is a choice and never gets a
  ring, because a ring is a measurement.
- Top level navigation is tabs, not buttons. No boxes. A selected item
  changes its text, not its ground. (This collides with the solid fill
  lightings: section 13, item 11.)
- Reduced motion gets the end state, not a faster animation.
- Nothing over a surface that repaints every frame carries a backdrop filter.
- One build, two compositions for the phone. Never a forked mobile design.
  Capability is read from `(max-width:720px) and (pointer:coarse)`, never the
  user agent. (`DESIGN-mobile.md`.)

**Numbers and readings**

- A reading is not a score. Never print a count against a total.
- A reading is never invented. Never print a percentage off a default. A
  person who has entered nothing sees the four doors, not a tier. (`DESIGN.md`
  Law 5.)
- Every number says what it is out of, on the screen, not in a tooltip. His
  words: "You read 13, what does that mean."
- A band prints as a range, "21 to 30", never a threshold.
- No ranking of people. "A practitioner panel sorted by coherence is a
  leaderboard with a licence." Group views sort by what needs attention.

**Engineering**

- `source.html` and `engine.js` are build products. Never edit them. Edit
  `atuned_src/` and build.
- `atuned_src/MANIFEST` decides load order and nothing else may. Data, then
  engine, then renderers, then UI.
- The engine may not touch the host: no `document`, `window`, `navigator`,
  `localStorage`, `fetch`, `new Image`, and the rest of the list in 7.3.
- **Port, do not rebuild.** The arithmetic core keeps its bodies and
  signatures.
- TAB integers are identity. They are persisted and compared and never
  renumbered. `TABDEF` is display order and moves freely. Anything needing a
  tab's entry looks it up by `.k`, never by position. New surfaces are
  appended.
- A tab host that carries a folded surface cannot also be the render target.
- Validate at the boundary. A missing field is an older profile and is filled
  from the blank. A wrong type or an out of range value is refused by name and
  never clamped. `pImport` is atomic.
- Every write that can fail reports through `status()`. A control never
  claims success before it has it.
- Reproduce a failure before fixing it, and re-measure after. Check the tool
  against a known good case first: a tool that lies is worse than no tool.
- Read the count off the run.
- The gates are the definition of done (commands in 12.3). A round is done
  when the gates are green, not when the work is.

**Data and money**

- **We never sell anybody's data. Ever.** The strongest ruling in
  `DECISIONS.md`.
- **Sight is not for sale.** Every tier, free included, sees the whole
  reading. A tier buys new ground, nothing else.
- The name never leaves the device. A key replaces it. Records are never
  looked up by name.
- **The story is stored, for recovery, never shared, and used only for
  modelling** (25 September). This supersedes the 18 September line that the
  record and the story are never held joined. Modelling use is asked as
  consent, the story is encrypted at rest, and it is de-identified before any
  model sees it (section 10.5).
- The record never carries a customer id, subscription id, email, key, secret
  or token. The boundary refuses them by name.
- A cohort lead sees outputs, not tools, and never the story cloud.
- Stripe never appears in the app.

**The bar and the pace**

- **The bar** (25 September): "our plan is not for a demo, our plan is not
  for a prototype, our plan is for an MVP... our checklist needs to be
  production quality, enterprise grade, Apple is our bar, minimum." His
  reason: "this is a purpose based product, it's an impact based product, our
  ethical and moral standards are exceptional."
- **Operational before complete** (19 September): close the whole loop first,
  crude where it must be, then refine. "A full loop that is crude beats a
  polished half." The two sit together: one is the sequence, the other is the
  destination. A stopper wired in rough today is brought up to the bar before
  it reaches a real person outside the team.

**Working with the owner**

- **Reporting: four headings, in his order, and nothing else.** What I did.
  How it impacts you. What I am doing next. What I need from you. Bullets.
  The questions are listed in full under the last heading. A finding that does
  not change what he decides goes in the backlog, not the reply.
- **The team is always asking** (25 September). "I always want the team to be
  in a question asking mode." A question is framed for the person who holds
  the vision, never as which library. A question he cannot answer yet is
  written down as open with its two or three answers and what each costs, and
  is never answered for him by default.
- **A question about a drawing is asked with the drawing.** Both answers side
  by side, same profile, both widths.
- **Every build goes to him as a download.** Named `atuned.html`, sent as an
  attachment and never rendered, with the commit and the md5 stated, and the
  pushed branch named as a second route. The file is packed so a cut delivery
  says it was cut (section 7.2).

### 1.5 The opening surface

It has been ruled three times, so it gets its own entry.

| When | Ruling | Where recorded |
|---|---|---|
| user journey pass | The app opens on Summary | `DECISIONS.md` |
| 19 September | The app opens on the Field, reversing Summary | `CLAUDE.md`; `TASKS.md` A23 |
| 20 September | The app opens on the avatar, reversing the Field | `TASKS.md` AV1, AO2; `DESIGN-avatar.md` 16 |

**As built: the Field** (`engine/core.js` `tab:TAB.FIELD`). The avatar is not
built. `TASKS.md` D11 asks him whether the avatar replaces the Field or sits
beside it. OPEN. `DECISIONS.md` records only the first of the three rulings
(section 13, item 1).

What holds under every answer: whatever renders on the opening surface
renders to somebody who has entered nothing, so the empty state is the design
(section 5.4).

### 1.6 Grades on record

He grades. A is the destination. A grade is not a feeling: each
recommendation states what would move a grade and by how much, so the next
review can check.

- The Body page was a D. Rebuilt.
- The compass is a D trending D plus. Target C or C plus.
- Glass is a C: clunky, needs to be crisper, fonts too much in the face.
- The knowledge base was linear and boring. Rebuilt as a deck.
- The story page is a D: "really visually unimpressive and uninteresting"
  (`DESIGN-story4.md`).
- The ritual builder is a D minus (20 September, `DESIGN-ritual.md`).

---

## 2. The coherence formula: CQ, DQ and SQ

**Status.** RULED in three passes on 25 September (`DECISIONS.md`, "One CQ",
"The CQ ruling, corrected" and "The CQ ruling, third pass"). Everything marked
PROPOSAL comes from the unification bundle (`cq-unified.md`, Tomas Egilsson,
section 12.9) and has not been confirmed by him.

**The simulation is complete.** `TASKS.md` AZ5 closed the same day, run twice
on two seeds against the real engine and its nine ICPs. The fitted shadow
curve is a bell over each address's weight: centre 5, width 1.25. Paralyzed
pulls 122 times as hard as a little tense, inside the bound his own words set.
CQ built up from zero across 630,000 simulated answers with zero false drops;
a release changed CQ, DQ or any address zero times across about 17,800 runs.
Three other curve shapes were tried and rejected on the evidence, not on
preference (`DECISIONS.md`, "The CQ model, fitted"; `cq-unified.md`).
**Corrected the same day, after ship:** the release half of that run wrote
charge only and never let a release reach the laws, so "zero changes to CQ"
was built in, not found. He corrected the invariant itself; a release now
lifts the laws at its seat a little (2.1, "A release lifts the laws at its
seat"). DQ and the 112 still never rise on a release.

### 2.1 The three quantities, as ruled

**CQ, the coherence quotient.** The 21 laws of integrity and nothing else.
Each law is scored 0 to 10. The 21 together sum to 210, and 210 is 100
percent.

    CQ = (sum of the 21 law scores) / 210 x 100

His words: "we can have the sum equal to 10, and that 210 equals one hundred
percent." Five is average. Four to six is the range a person travels in.

The roster is `SI` in `atuned_src/engine/data/canon.js`, live in the engine,
seated by band:

| Seat | Laws |
|---|---|
| Throat | Truth, Transparency, Justice |
| Crown | Unity, Awareness, Nature |
| 3rd Eye | Presence, Humility, Equanimity |
| Heart | Compassion, Forgiveness, Generosity, Aesthetic Beauty |
| Solar | Courage, Duty, Responsibility, Accountability |
| Sacral | Temperance, Detachment |
| Root | Non-Harm, Patience |

CQ is a function, a formula that reads the schema. It is not a schema. The
schema is the shape of the profile and the 21 laws and 112 addresses it reads.

**CQ builds up from nothing as the laws are answered.** It never starts full
and falls. His words: "You're basically saying I have an input, my integrity
yet, and once I do, this is where it is now. I don't want to do it the
opposite, where it goes from 100 down, because that's demoralizing." Fitted:
an unanswered law contributes nothing to the sum, so the running figure rises
with each law answered rather than falling from a false start. Proven across
630,000 simulated answers with zero false drops, against the desktop's old
running-mean rule, which fell by up to 28 points and started above the
person's final score more than half the time, the exact drop he ruled
against.

**A release lifts the laws at its seat.** Ruled 25 September, after ship,
correcting the team: "I didn't say CQ doesn't move on a release. That
wouldn't make sense. If a fetter is released, you may not see CQ move, but it
may move 0.1 or 0.05. I had about 15,000 patterns for my CQ. My CQ is about
between 88 and 92, plus or minus 3 points of accuracy. Those 15k releases
raised my CQ." Built in both engines the same day, the same constant, the same
seats, the same arithmetic:

    law as CQ reads it = 10 - (10 - answer) x (1 - LIFT_R)^n,   LIFT_R = 0.00077
    CQ = (sum of the 21 laws as CQ reads them) / 210 x 100

- CQ is still the 21 laws over 210. SQ and DQ are not folded in, and the
  lever still acts on expression only.
- n is the releases at the law's seat since that law was answered. The seat
  is `SI`'s own (the table above), so a release at the heart lifts the four
  heart laws and nothing else. MOB counts a release as one pattern of new
  ground, the meter's unit; the desktop as one of the person's own cleared
  stories. A rerun of open ground, a cascade and an unanswered law get
  nothing.
- **A new answer starts the count again.** His own 88 to 92 is a reading
  taken after the work, which already contains it. Carrying the lift through a
  new answer would count his fifteen thousand twice.
- **Fitted, not chosen, to one data point.** His start is not known; 50 is
  assumed, his "five is the average". This shape (each release closes a share
  of the distance left) lands fifteen thousand at 86, 90 and 94 from starts of
  30, 50 and 70, all inside his range with his plus or minus 3. A flat step
  fitted the same way lands 71, 90 and 100. A full run of 25 patterns moves CQ
  0.14 at 50, 0.11 at 60 and 0.055 at 80, which is his other sentence, and it
  was not fitted to it; one pattern moves it by thousandths. In MOB, release
  alone tops out near 95 from 50; the last points are the laws themselves
  moving.
- **Against the lock bar** (`DECISIONS.md`, "The formula is locked once it
  passes this bar"): every reference person whose CQ starts between 25 and
  75, nine of fourteen, lands inside 85 to 95 after his fifteen thousand, and
  for all fourteen the lift leaves the saboteurs, complexes and all 112
  weights exactly as they were. The roster's Lance reads 97.2 under the ruled
  formula, above his own 88 to 92 (`TASKS.md` BE8).
- Proven in `tests/engine.js` 36b and 36e, `tests/functional.js`, and the
  desktop gate, which replays MOB's own lift vectors (`data/cq_worked.json`).
  Open questions in `TASKS.md` BE.

**SQ, the shadow quotient.** The weight at each of the 112 addresses. "SQ is
an individual fetter, there are 112 that we track, period." That is 112
values, each 0 to 10, and never one aggregate. 54 on each side of the body and
four outside it.

The four outside addresses count as SQ: "they're related to nerves within the
body, but the assemblage point field at which they create is outside of the
body. Think of it like a torus field." RULED by simulation: each takes the
mean SQ of the seat it extends, Sol Star and Stellar Gateway from the Crown,
Earth Star and Gaia Gateway from the Root. Measured 0.06 of a point from the
alternative (the heaviest of the seat) on retest, so the simpler rule stands.

**DQ, the decoherence quotient.** The total shadow. His words, third pass:
"DQ is a total shadow. I don't know why you keep asking me that, I keep saying
it, it's like the eighth time I've said it." **Settled, and not to be asked
again.** DQ is not 100 minus CQ, and it is not both.

    DQ = sum(SQ over all 112 addresses) / 1120 x 100

**How SQ acts on CQ: a lever, and a multiplier.** His words: "you can always
put SQ within CQ and say CQ 100 SQ 0, DQ 0, SQ 100, any deviation, one pulls
down and the other, it's a lever. And then the expression and emotion, the
other laws or variables, like the intensity curve is a multiplier. I'm a
little tense is different than I'm paralyzed, it's orders of magnitude
different, so there's your multiplier right there. So our bell curve becomes
our multiplier."

As the team reads it (`DECISIONS.md`): SQ and CQ act on each other as a
lever, not as terms summed into one number. CQ stays the pure measure of the
laws, exactly as ruled: it does not move when the lever pulls. **The lever
produces a second, separate figure, expression, and does not change the CQ a
person sees.** This is settled. The sentence that stood after it, that a
release moves neither CQ nor the person's law scores, was the team's and was
wrong: a release lifts the laws at its seat a little, and CQ with them (above).
What a release still never does is move CQ through the shadow.

    expression = CQ x (1 - PULL)
    PULL = a bell curve over each address's own weight (0-10), averaged
           across all 112 addresses. Fitted: centre 5, width 1.25.

Worked: every law 5 and heavily loaded reads CQ 50, expression 29.4. Every
law 10 and heavily loaded reads CQ 100, expression 80.1. Gordon, carrying 22
addresses near paralysis, drops from 20.1 to 11.1 on expression alone; Diane,
whose weight is spread thin, loses 0.6. CQ does not move for either.

**Intention.** Two statements, the later one current.

- Second pass: "Intention is powered by the laws of emotion. When emotional
  control is being spurred on by SQ, then we get lower awareness, lower
  intention, lower integrity, lower expression."
- Third pass: "I don't think intention ultimately is will, and awareness,
  it's a modifier. You either did the thing you said you were gonna do or you
  didn't, and the reason why is going to be, there's a story in there from the
  SQ somewhere in the body." And: "you can have an emotion without an
  intention. Intention is the output of what you're trying to get done."

As ruled: intention is not read off charge directly. It is the gap between
what a person said they would do and what they did. Only charge tied to an
actual output counts toward it. Felt charge with no action attached is not
intention. **No formula is written.** The bundle's proposal (intention from
the mean shadow on each of the nine axes, B.4) predates the third pass and its
basis is overtaken. The nearest arithmetic anywhere is the desktop's
`intentionOne`: ritual steps kept, over kept plus broken, across seven days.
It is not adopted.

**Expression.** The output. "The six axis determine the output. The SQ
determines which output you're going to do." RULED as arithmetic: expression
is CQ pulled down by the fitted bell curve, above. Which of the six axes
leads the output a person is shown is still PROPOSAL: each of the three pairs
reads 0 to 100 from its evidence, the lowest pair names the output, the level
is their mean (bundle B.4). That naming layer is not what the simulation
fitted; only the pull on the number was.

**The band.** "Oscillating does not print as a word, but four to six should
always show a slightly different band, same thing with five, so people can see
there's a range at which we travel, and five is the average." RULED as a
design instruction: every 0 to 10 scale draws four to six in a slightly
different fill and marks five. PROPOSAL: on CQ the same band is 40 to 60 with
50 marked, drawn and never labelled. The band is never a dampening, because
discounting laws in the band would stop CQ being the sum. Collision: the tier
named Oscillating (41 to 50) still prints the word, in the largest type on the
Summary (section 13, item 7).

**The harmonic layer.** "I think the harmonic layer is information. All
hundred and twelve should have a tone, and we can measure the tones based off
the tones the sound bowls are measured to, in hertz." RULED:

- Information, not a reading. It never enters CQ, SQ, DQ, intention or
  expression.
- One tone per address, sourced from real bowl measurements, offered as an
  optional sound healing tool. "I don't want to bombard people with options."
- Every Hz figure prints in its chakra's own colour.
- It is not a claim about physical length: the nervous system's response is
  independent of body size, "it acts like a current." The research finding
  that a standing wave model does not hold is still true. It tested a
  different claim. His claim is untested, not refuted, and because it is
  information it needs a label, not a test.
- Defect today: the build prints solfeggio numbers beside plexus names with no
  label (`TASKS.md` AX8). Research is in `harmonic-research.md` (Eero
  Vatnajokull, section 12.9).

### 2.2 What ships today, and why neither engine matches the ruling

Neither engine had been changed to the ruling as of MOB `21e78ca` and the
desktop at reboot-os `8ba42de`. RUNNING: the rebuild of both engines to the
fitted model above was dispatched the same day; this table is what shipped
before that work lands, kept so the before-and-after is on record.

| | MOB (`engine/compute.js`) | Desktop (`45_the-psyche-map.js`) | As ruled |
|---|---|---|---|
| CQ | `It x Ig / Rz`: the law mean read twice (once by seat), divided by a resistance built from the shadow and the six gates. Roughly the law mean squared | the committed law mean, times the square root of ritual follow-through, over a resistance from a placeholder shadow term (`A_SQ = 1.0`, its comment says so) | the law sum over 210 |
| Laws | 21, the `SI` roster | 20, a different roster (`LAWS1`) | 21, `SI` |
| SQ | per address `n.sq`, 0 to 10; the four outside forced to 0 | one number, a presence count per band | 112 values, outside four carry |
| DQ | a total of loaded shadow, no fixed scale | 100 minus CQ | the total shadow |
| Every law 5, nothing held | 25 | 50 | 50 |

- MOB puts the laws into CQ twice (`TASKS.md` AY2) and the shadow into CQ
  twice.
- **MOB's live formula lowers CQ on a release** in 22 of 10,000 seeded runs,
  worst case minus 0.82 (AY1). The unified model gave 0 of 10,000.
- The desktop's shadow term cannot tell weight 360 from weight 2000 (AY3).

### 2.3 What follows for the product

- **Corrected 25 September, after ship: a release does move CQ, by a
  small amount.** The line that stood here, that a release cannot move CQ,
  was the team's own inference and not his ruling; he corrected it
  directly, with a real data point (`DECISIONS.md`, "Correction. A release
  does move CQ"): about fifteen thousand of his own releases moved his CQ
  into the high eighties to low nineties. **Fitted and built the same day**
  (2.1, "A release lifts the laws at its seat"): a share of the distance
  left, per release, per law at the seat, fitted to his one data point on an
  assumed start of 50. What still holds: CQ reads only the laws, a release
  does not fold SQ or DQ into it directly, and the loop and the avatar still
  show a release working through the addresses, DQ and expression as the
  visible movement, with CQ itself moving too slowly for one release to show.
- **The fixed divisors are load bearing.** A mean over whatever is carrying
  rises when the lightest item clears. That is how the desktop's first
  simulation produced dips. Every divisor in the unified model is fixed.
- **Copy that becomes false** when the formula changes: every tier
  description in `TIERDEF`, the release screen's CQ before and after, the
  "oscillating band" sentence on the Compass, and the desktop's lever prices.
  The full per file change list is bundle section C.
- **History will not compare across the change.** `dq` and `sq` in stored
  snapshots change meaning. The snapshot needs a version on the row. That
  touches schema v2, which is his.
- **The privacy note in the bundle is out of date.** Bundle H says the
  population test of "SQ corrupts the volume" is forbidden because the record
  and the story may not be held joined. The 25 September ruling stores the
  story. Whether de-identified laws and stories may be joined for that test is
  OPEN.

### 2.4 Still to put to him

Settled and not to be asked again: DQ is the total. Settled by the
simulation: the build-up rule, whether the lever changes CQ (it does not),
how the four outside addresses take their weight, Aesthetic Beauty stays in
the 21, the eight expression laws are not CQ inputs, Ownership is not a CQ
input. Five remain, each with a recommendation and worked people in
`cq-unified.md` section F:

1. Does a tier word (Severe, Mastery) name CQ or expression? Recommended:
   expression.
2. Does "Oscillating" print for the 41 to 50 band? Recommended: no, matching
   the standing rule that the word never prints.
3. Do the eight expression laws sit beside expression or cap it? Recommended:
   beside it.
4. Does awareness sit beside intention in words, or scale the number?
   Recommended: beside it, in words. Not run either way.
5. The colour of the four outside tones: crown above, root below, or one
   shared colour? Recommended: crown and root.

Also still open, not from the simulation: the exact intention formula under
the third pass has no arithmetic yet, only the ruled shape (gap between
committed and done). `TASKS.md` AZ6: neither engine's sniffer can currently
tell "a little tense" from "paralyzed," so the ruled orders of magnitude
come entirely from the fitted curve until the lexicon is fixed.

---

## 3. Visual language

Sources: `brief-foundations.md` (Mika Ueda-Salas with Sol Amadi, Bjorn
Haraldsson and Petra Nikau), read at `1c021f4`, and `DESIGN.md`, the design
law. The seat palette was re-read at `f885d8f` for this version. The brief is
the detailed reference: every token, tint recipe and component state.

### 3.1 The argument under all of it

This is an instrument, not a wellness app. The person looking at it is often
at their most loaded. Every visual decision starts from one question: what
does this do to the nervous system of the person reading it? Three rules
follow.

1. **Colour means place.** A colour names a seat, a family or a state. It is
   never decoration.
2. **Severity is carried by saturation and size, never by hue.** Root, Sacral
   and Solar are the warm hues and carry the heaviest load. At full chroma the
   product would show its most loaded people its most activating picture. Hue
   stays fixed because hue is the language. Chroma comes down.
3. **Full chroma belongs to one thing: something actually being wrong.**

Restraint is how it works. The palette gives up chroma so the alarm reads. The
type gives up size so weight, space and value carry the hierarchy. The hero
graphic gives up captions so the drawing does the work.

### 3.2 Tokens

A token is named by what it does, never by what it looks like. Three layers:
primitive (the seat palettes, the tier ramp, the alarm, declared once in data),
semantic (`--bg --panel --panel-2 --sunk --edge --edge-2 --ink --mid --dim
--accent --on-accent --alarm --good --bad`, redefined per lighting), and
component (scoped). **`--c` is the most important component token**: each
element receives its family colour inline, and every tint is mixed from it
with `color-mix`, so one set of rules draws seven seats in every lighting. A
canvas cannot read a CSS variable, so the palettes exist in JavaScript too, and
a test holds the two in step.

### 3.3 The seven seats

`PAL`, the default palette, used by Dark, Punch, Glass, Glass white and Flat.
Read at `f885d8f`; `engine/data/canon.js` is the authority.

| Seat | Hex |
|---|---|
| Root | `#D6524C` |
| Sacral | `#D8924E` |
| Solar | `#DABF6A` |
| Heart | `#5FD5A6` |
| Throat | `#5EBBDB` |
| 3rd Eye | `#7D93E0` |
| Crown | `#A77EDB` |

Snow takes `PAL_LIGHT`, the same hues deepened into ink for paper. Lumen takes
`PAL_VIVID`, the named exception to the muted ruling. The lookup is one
function every renderer calls. Saturation runs in a narrow band so seven hues
read as one set, after two rulings that lifted Root, Heart and Crown.

**Contrast law.** A seat colour is never small text on `--panel-2`. Where a
seat name must be read as text, it is mixed toward the ink. In Lumen a seat
colour is a graphic, never text.

The values in the first Bible (`#C4635E` and the rest) are the palette before
the saturation rulings and are retired.

### 3.4 The accent, the alarm, good and bad

- **The accent is blue, `#7EB8D4`.** Gold is out. He chose this blue, the
  original app's own `--law-accent`, and never chose gold. It deepens to
  `#2F6E92` on paper. It sits between Throat and 3rd Eye at lower saturation,
  so it belongs to the family and to no seat: it marks where you are and what
  you can do, and must never be mistaken for a reading.
- **Traps.** `--gold` is an alias that holds the blue. The port names it
  `--accent` everywhere. `--au` is real gold, with one caller (the boot halo).
- **Alarm, `#FF2E1F`.** The only full chroma value. A reading reddens only
  when a high value is the cost (shadow weight, carried depth, seat load,
  saboteur weight, mask weight), past 90 percent of its scale. A reading where
  high is the person getting better never reddens. His words: "96 per cent
  flow accuracy and yet it is red. Red is a colour of danger. That is bad
  colouring."
- **Destructive is a decision, not an alarm.** Delete uses `--bad`, never the
  alarm. The alarm never appears in a tooltip, a tier word or a high good end
  reading.

### 3.5 The tier ramp

Coherence shows as one of ten bands, each with its own colour, printed wherever
the band word is printed. The ramp runs cool and clear at the top, warms
through the middle where the work is, and **desaturates at the floor instead of
reddening**: numb is less present, not louder. None of the ten is the alarm.
Hex values and contrast are in the brief, 1.3.6. The band words are in 8.2.

### 3.6 The seven lightings

A lighting is a position on what the interface is made of, not a skin. Order
in the switcher: Dark, Snow, Punch, Glass, Glass white, Flat, Lumen. Dark is
the default. A gate proves seven distinct grounds, each resolving its own
tokens, with the list read at run time.

| Lighting | Register | Palette | Accent | Selection |
|---|---|---|---|---|
| Dark | a clinician's room at night with one lamp on | PAL | `#7EB8D4` | ring |
| Snow | the same instrument on paper | PAL_LIGHT | `#2F6E92` | ring |
| Punch | nothing outlined, everything solid; the ground tints toward the heaviest seat | PAL | `#7EB8D4` | solid fill |
| Glass | holographic: refraction, one light source upper left, depth as elevation | PAL | `#7EB8D4` | colour and weight |
| Glass white | Glass in daylight, lit from the front | PAL | `#2F6E92` | colour and weight |
| Flat | made of nothing, only the reading is real | PAL | `#5FD4C4` | solid fill |
| Lumen | white and flat, black panels where the tools draw; vibrancy | PAL_VIVID | `#0091EA` | solid fill |

- The three instrument stages (Field, Body, Compass) draw on `#101010` in
  every lighting except Glass and Glass white.
- **Glass loses its blur on the Field, and only there.** Measured at
  `1c021f4`: backdrop filters over the live wheel dropped Glass from about 60
  to about 12 frames a second, and no smaller fix worked. On the Field every
  backdrop filter is removed and a denser pane stands in. Tint, specular,
  fringe, edge and shadow stay.
- **Punch's accent does not follow the seat.** It used to, and a Sacral heavy
  field turned every pressed control orange. He chose blue. The seat tints the
  ground, and the accent stays.

### 3.7 Light and hierarchy

A screen is lit, not painted. Each lighting states where its light comes from,
and every surface agrees. **Hierarchy is value before size**: ink, then mid,
then dim, by lightness contrast before anything gets bigger. The squint check
from six feet: on Summary the eye lands on the name, then the tier word, then
the red shadow figure. On the Field it lands on the wheel, then the red DQ
pill, then the rail. The port must reproduce that order.

### 3.8 Type

- **One face: Inter**, variable, latin subset, weights 300 to 700, one file,
  embedded as base64 in the document. No monospace: figures align through
  Inter's tabular numerals on every figure. Google Fonts is gone because every
  load sent the person's IP address to Google before they had typed a word. A
  gate fails on any outbound request and on a silent fallback.
- **Weights have jobs.** 300 for long prose at 14px and above. 350 for tabs at
  rest. 400 the workhorse. 500 for values and the pressed tab. 600 for labels,
  headings and tier words.
- **Floors, tested.** 16px for reading text. 13px for data rows. 11px for
  labels; nothing a person must read to use the product goes below 11. The one
  exception is the "Source OS" line under the wordmark.
- **Case**: section 1.4. Labels are four words or fewer with no comma
  followed by another word; everything else is a sentence.
- **The wordmark**: "Atuned" set in capitals by style, sky blue, with the
  umlaut drawn as two white dots because one glyph cannot carry two colours.
  It goes home to the Field and carries no button styling.
- **OPEN, his call (D12).** The stylesheet uses about thirty distinct sizes, a
  record of decisions rather than a scale. Reproduce it, or consolidate to a
  ladder of 11, 12.5, 13.5, 16, 19, 22, 34 and 48. The floors hold either way.

### 3.9 Icons, and the signature object

- **Ring, not fill.** Every glyph is a stroke on a 24 unit grid with round
  caps and joins. The smaller the mark, the heavier the stroke. No glyph is
  filled in any lighting. The one intentional fill is the Punch icon in the
  lighting menu, where the fill is the message.
- **Families borrow seat colours, never invent one.** The four roots wear
  3rd Eye, Sacral, Heart and Crown. Domains take their root's colour. The nine
  charges take their seat's.
- **CQ, DQ and SQ use their letters**, not a drawing, because the letters are
  already their names.
- **Selection is a ring.** Punch, Flat and Lumen fill a selected control on
  their own rulings. A depth reached by zooming, rather than chosen, is ringed
  with a small accent dot: reached, not chosen.
- **The ring and pill is the product's grammar for every quantity**: an icon,
  a ring around it showing the value as an arc, a pill with the number. The
  ring gives the impression and the pill the figure. New users want the
  number and long term users want the glyph, so one object serves both. The
  pill sits inside the badge's own reserved padding: it was once clipped and
  once laid over the glyph, and both are recorded failures.

### 3.10 Space, radius, edge, depth, texture

- Spacing: three steps with reasons, 6px inside a control, 10px between
  controls, 16px between blocks.
- Desktop columns: left rail 302px, stage, right rail 336px, 10px gaps.
- Radii 16, 11 and 8, concentric by construction. Flat and Lumen go to 4, 4
  and 3. Pills stay pills.
- The tap floor is 44 by 44 on every control. A small control reaches it by
  growing its hit area, not its drawing.
- The hairline is the only border. Alpha, so it takes its colour from the
  surface. A left rule in a colour marks attribution. A dotted underline marks
  a word with a definition. A dashed border means pending or inferred.
- **No grain, noise or paper texture.** Gradients appear only where they have a
  job. **The aura is the one atmosphere, and it is data**: the accent at the
  centre, reaching wider with coherence, and seat colours in the corners scaled
  by DQ. It is painted at one eighth size and scaled up, because a live blur
  once took the Field to under 8 frames a second.

### 3.11 Components, in one line each

Focus is one rule everywhere and is never removed. One primary, filled button
per surface. A tab is not a button and wears no box. A segmented control is a
setting, so its selection fills. A chip that is a place drops its ground when
chosen; a chip that is a setting takes the accent. Panel, card and well are
three different names. Rows are scanned, so every row is the same object. The
0 to 10 scale is eleven equal cells. The polarity bar grows from its midline.
**There is one tooltip**, which grows out of its carrier along a line of the
carrier's colour and becomes a sheet on a phone. **There is one status line**:
failures persist, confirmations clear after 2.4 seconds. Scrollbars are always
visible.

### 3.12 Defects to port as intent, not as shipped

From the brief, section 1.10. The first three are the grade holders.

- **D1.** Snow's dark inks on the black instrument stages read at about 1 to 1.
  Give Snow's stages scoped dark stage tokens, as Lumen does.
- **D2.** The per lighting aura strength does nothing; an inline value wins.
- **D3.** The pre-ruling gold survives as eleven literal values, putting a
  warm wash under a blue accent.
- **D4. His call.** In Punch, Flat and Lumen the top tabs get boxes and a
  solid accent fill, against the tab ruling. Which ruling governs the tabs is
  not written down (section 13, item 11).
- **D6.** Lumen's accent fails contrast on paper.
- **D7, D8.** White on the alarm fails contrast, and the microphone fills with
  the alarm while a person is only talking, which breaks the alarm law.
- **D12. His call.** The type scale (3.8).

Grade from the brief: a strong foundation that loses points on D1, D2, D3 and
D12. With D1 to D3 fixed in the port, other teams could copy it.

---

## 4. Motion

Source: `brief-motion.md` (motion and effects direction), measured on build
`da6cca6`. It carries every timeline, curve and defect. Where a source comment
states a motion value, do not trust it: several are stale, and the brief lists
each against the value the code runs (its section 13).

### 4.1 The rules the code actually keeps

1. Every animation has a job, and the job is stated. A motion that cannot name
   its job is cut.
2. Motion that carries data beats motion that decorates.
3. A data mark never overshoots its value.
4. Three curves and four durations, named for the job.
5. Arrive fast and settle long. Leave without being watched.
6. An entrance happens once. The Field assembles once per session.
7. Reduced motion gets the end state, never a slower animation.
8. Nothing over the live canvas carries a backdrop filter.
9. The hit target is where the thing lands, not where it is mid flight.
10. Easing on a canvas runs on elapsed time, not frame count, so a 120 Hz
    screen settles in the same time as a 60 Hz one.

### 4.2 The vocabulary

    --ease-out   cubic-bezier(.22, 1, .36, 1)     a thing arriving
    --ease-in    cubic-bezier(.4, 0, 1, 1)        a thing leaving
    --ease-land  cubic-bezier(.34, 1.56, .64, 1)  a thing that lands: one overshoot

    --t-micro    120ms   hover, press, focus
    --t-element  220ms   one thing entering or leaving
    --t-surface  320ms   a panel, a rail, a lighting change
    --t-context  420ms   a whole tab, the longest the product may take

Anything longer than 420ms justifies itself and offers a way out. On a canvas
every ease is `k = 1 - exp(-rate x dt)` with the frame delta clamped, so a tab
hidden for a minute does not snap on return.

### 4.3 The set pieces

- **The boot.** A loader that spins says only "wait". This one shows the
  shape of the instrument before anything is entered: a spine rises root to
  crown, seven seats take light in order, a ring of addresses closes, a halo
  settles over the crown, and the name arrives. It plays on every launch by
  ruling ("it is the overture and it is worth watching"). Any press or key
  skips it. Under reduced motion it never shows. Its length is his call (D1).
- **The Field assembles once, root to crown.** Seats arrive in body order and
  the core blooms last, in under a second, because an entrance that must be
  waited out is a loading screen. Today it plays hidden under the boot (D2).
- **Charge lands where it can be seen.** One ease for every change to the
  field, frozen while the Field is off screen, so a story written on another
  tab lands on the wheel when the person comes back. The most important
  motion in the product.
- **Zoom is a timeline the person scrubs.** The core atomises into feathers
  (the triad, then the seven seats, then the 21 laws) and the shell into named
  fetters and then into the stories that put the charge there. Layers are
  functions of zoom, not of time.
- **The oscillating band beside the wheel** swings wide when coherence is low
  and holds still when it is high. The motion is the measurement.
- **The core breathes** at a resting respiratory rate. It is the one motion
  that is not a reading. Making the breath a reading is prototyped and his
  call (D14).
- **The compass** carries a drifting crowd in the median band and the
  person's own marker swinging across their own range.
- **The tooltip** grows out of its carrier: a tether leads, and the panel
  lands on a T. The most finished motion in the product.

### 4.4 No reward animation

No confetti, no badge unlock, no count up, no streak flame, no variable
reward. A reading is about the person and a ledger is about the work, so
celebrating a reading would score the person. The only defensible arrival for
a new mark is the product's own element entrance: 220ms, ease out, a 6px rise,
once. It says "this is new" without saying "well done".

### 4.5 Defects, and the ones that are his

The three set pieces never reach the eye today: the boot is cut by a timer
before its fade, the Field assembles under the boot, and the release plays
under a blur at about 18 frames a second. The compass speeds up every time it
is touched. No control responds to being pressed. His calls among the fixes:
the boot's length (D1), the release cooldown choreography (D3), an in app
motion toggle (D7), and the breath as a reading (D14).

Grade from the brief: **B now, A minus after D1 to D12.** Nothing new is
invented to get there; every move is the source's own declared intent. The
brief's section 18 is the port checklist.

---

## 5. Information architecture and screens

Source: `brief-screens.md` (UI UX architecture), read at `1c021f4`, md5
`26ff48bd4f111fa1dcd90822d6c62778`. Every surface there has its job, layout,
empty and loaded states, interactions, loop station, choice count and where
people stop. `DESIGN-ia.md` is the first drawing of the whole product.

### 5.1 What a person hires it for

> Show me what is running me, where it sits in my body, what it costs, and give
> me a way to put it down. Then show me it moving.

Five sub jobs, served unevenly by the tabs: put something in (Story,
Energetics), see what the instrument read (Field, Body, Compass, Summary),
understand a word (Knowledge, every drill), act on it (the release, Ritual),
and practise at low stakes (Games).

### 5.2 The shell

**The rails are the app and the tabs are a stage.** Both rails, the top bar,
the status line and the one detail panel sit on every tab except Settings.
`setTab` swaps only the centre. A new capability belongs in a rail section or
a drill first; a new tab is the expensive option.

**Four zones, each with a logic** (his ruling):

| Zone | Logic |
|---|---|
| Top | where you are, how to leave, what you can change everywhere: wordmark, the tab doors, status, profile, undo, lighting, help, account |
| Sub bar | the controls for the current hero graphic only (Field depths, Body layers) |
| Left rail | what you are made of, as inputs: orientation, balance, blueprint, archetypes, the nine axes, birth derived states, the matrix |
| Right rail | what the instrument reads, and the answer to whatever you just pressed: coherence line, the reading, Selection (the drill host), flow, what is running, the 21 laws, Run a release |

- **The top bar is written into the document**, not generated. Three times a
  script that stopped early took the navigation with it.
- **The drill is the one detail surface.** Every element that carries data
  opens a drill, and every drill renders into one host in the right rail
  through one shell: a sticky back control naming where it returns, an
  eyebrow, a name, labelled blocks, and a Close at the bottom.
- **Overlays are not tabs**: the release run, the ritual as a modal, the card
  deck, the compass as a sheet, the help sheet, onboarding, the boot, and the
  one tooltip.
- **Below 1180px** the grid becomes one column in the order stage, left rail,
  right rail. The stage comes first; it used to sit 1,900 pixels down a phone.

### 5.3 The surfaces, by identity

The integers are fixed forever. Display order is `TABDEF`, as it stood at the
stamp.

| Bar label | Key | Integer | Host | Renderer file |
|---|---|---|---|---|
| Energetics | INTAKE | 5 | `#iq` | `ui/intakeui.js` |
| Ritual | RITUAL | 10 | `#rit` | `ui/ritual.js` |
| Story | STORY | 0 | `#story` | `ui/storyui.js`, `ui/imprints.js` |
| Field | FIELD | 2 | `#cv` (canvas) | `ui/wheel.js`, `ui/ui.js` |
| Body | ENERGY | 3 | `#emap` | `ui/map.js`, `ui/mapshelf.js` |
| Compass | COMPASS | 8 | `#cone` | `ui/cone.js` |
| Knowledge | KNOW | 6 | `#know` holding `#knowbody` | `ui/knowledge.js` |
| Games | GAMES | 7 | `#games` | `ui/games.js` |
| Summary | SUMMARY | 1 | `#sum` holding `#sumbody` | `ui/summary.js` |
| (folded into Summary) | ANALYTICS | 4 | `#sum` holding `#ana` | `ui/analytics.js` |
| (no door) Settings | SETTINGS | 9 | `#settings` | `ui/account.js` |

`TABREAL` maps a folded surface to the tab that carries it, and every caller
of `setTab` goes through it. `TABEXTRA` holds surfaces with a host and no door.

### 5.4 The empty state is the design

The engine computes a full reading off defaults even for a blank profile. So
every surface that prints a reading checks `compute().unread` first. Unread
means nothing is loaded, no law has been answered, and nothing sits under the
line. **The four doors** are the way in:

| Door | Label | Where it goes |
|---|---|---|
| story | Write what happened | Story, cursor in the box |
| nine | Read nine sentences | nine first person sentences, one per circle of descent, none a diagnosis |
| ages | Go year by year | sixteen years, three to eighteen, one question each |
| avatar | Say who you are becoming | the avatar surface |

One set of doors per screen. They vanish the moment anything is read: "a call
to action that survives the action is furniture." Known weaknesses: on a phone
the doors sit several screens below the fold, three of the four write
nothing, and several surfaces still print off defaults (the brief's 3.4 lists
each; treat them as defects, not intent).

### 5.5 The surfaces, one paragraph each

- **Energetics (5).** "Measure how I actually act, and record the moment I
  was born." The only place the 21 laws are measured: 63 questions, three
  framings per law side by side, because the gap between the three answers is
  the measurement. Seven seat groups, Crown down to Root. Progress says what is
  left, never "N of 63". The birth form seals to one line. Renamed from Intake:
  "a person does not arrive to perform an intake."
- **Ritual (10).** "Turn what the release found into one small thing I will
  actually do, at a time and a place, and keep a record that I did it." A
  primary product. One practice on the card, the one the state calls for, and
  the shortest in its track. When and where fields turn it into a plan. The
  record (streak, ledger, marks) lives here and on the Compass, drawn by one
  function.
- **Story (0).** "Let me say what happened, in my own words, and see what the
  instrument heard in it before anything lands." Where the content chain
  starts. Words the sniffer read are marked in seat colour on exactly the
  characters it read. Pending pills show where the text will land before
  Commit. Typing and recording are equal paths. Graded D. Three redesigns are
  on file (`DESIGN-story.md`, `DESIGN-story4.md`, `DESIGN-container.md`);
  which belief wins is OPEN.
- **Field (2).** "Show me the whole of what I am carrying, in one picture I
  can move into." The hero graphic: the core sized and lit by coherence, six
  gates, the 21 law spokes, the shell of addresses, chains, archetypes, masks,
  domains. Depth is a ladder (Charge, Patterns, Chains, Blueprint) and zoom only
  adds. Nothing on the stage covers the wheel. CQ, DQ and SQ sit in rings in a
  strip above it; vitality, awareness, will and flow in a strip below. A tap on
  a phone reads and never writes.
- **Body (3).** "Show me where it sits in my body and how much gets through."
  A filled silhouette with a continuous heat field clipped to the skin, one
  channel down the spine that narrows where a seat closes, and one label where
  it stops. Names live in the rail: "The body shows WHERE and HOW MUCH. The
  rail shows WHAT." The pain layer opens blank by ruling.
- **Compass (8).** "Show me where I sit between coherent and decoherent, on
  each of eight qualities, and which way I am moving." It opens flat by ruling,
  an arrow up and an arrow down: "It is a compass." Names are off the canvas,
  and the reading goes to the rail.
- **Knowledge (6).** "Tell me what this word means, and how much of it is in
  me." The codex reads the engine's tables directly, so the knowledge base and
  the reading cannot disagree. Every row is four things: the icon, the percent,
  the word, and its family. Universal laws sit in order by default because they
  are a flow. The highest choice count in the product.
- **Games (7).** "Somewhere to go for brain release, and practise the letting
  go at speed." Independent by ruling. Two games, both dealt from the engine,
  neither inventing a pattern (9.8).
- **Summary (1), with Analytics folded under it (4).** "Tell me, in words,
  what this all adds up to, and what to do next." The plate says this is you:
  name, ring, tier word and where it goes. The centre is text about you, your
  own words first. Everything energetic sits in the right column. Every scale is
  printed on screen.
- **Settings (9, no door).** A standard account page, by ruling: "We don't need
  coherence and everything else." No rails. Six row types and no seventh. Stub
  rows are full opacity and never pressable. Privacy states: "We never sell
  anybody's data. Ever."
- **The release run.** A modal in four phases: pick (the cost is shown before
  the run), opening, run, done. It refuses on a reference case with a named
  reason and pushes one undo step before it writes.
- **Onboarding.** Built and switched off ("let's turn off onboarding for
  now", 20 September). Replayable from Settings. Writes nothing to the reading.

### 5.6 Navigation, proposed and open

- **Two level navigation** (`DESIGN-nav.md`, PROPOSED): Ritual, Story (Summary
  under it), Tools (Field, Body, Compass), Insight (Knowledge, Games), with
  Intake as a door at the top of the left rail. His calls: what a container
  door does, whether "Insight" is the word, the reserved second row, and the
  phone alignment. By its own measurement it is a navigation fix, not a
  cognitive load fix.
- **The phone composition**, two PROPOSED versions that disagree: a four slot
  bottom bar (`DESIGN-mobile.md`), or one object, one action, one way back
  (`DESIGN-mobile-icp.md` pass five). Both agree on one build and one boolean.

### 5.7 Cognitive load: the open architectural problem

The standing problem is simultaneous choice. The fixed shell alone was 81 to
98 choices on every surface but Settings at `1c021f4`, against a working
memory of about four and a working screen target of under twelve. Every later
measurement is higher than the one before it. Re-measure on the build in hand
before quoting any figure. The load lives in the rails, not the centre: the
left rail alone was about 52 on every surface.

It is produced by rulings that are each right on their own (four sides each
carry at a glance information, every section can be open at once, never hide a
control with no affordance, show the options, delete nothing from the
addresses, laws or domains) against the rule to remove, hide, shrink and
organise. **They cannot all hold on one screen. That is his decision.** The
options on file are in 6.2. Until he decides: build rail sections as
components that could become drawers, keep the drill independent of the rail
it sits in, and put a count gate in from the first commit, reporting per
surface by name.

---

## 6. Interaction design

Source: `design-uxdeep.md` (Dani Sorensen, UI UX architect), read at
`eb788a2`, and `.claude/skills/atuned-ux/SKILL.md`. The deep brief covers how
things behave when pressed, in what order a person meets them, what a person
can take back, and where they stop.

### 6.1 Designed against named people

The product designs against reference people loaded as real profiles, and
tissue tests every flow through at least three of them. **Every quotation and
percentage attached to them is simulated panel output, not human behaviour.**
They are lenses, not evidence.

| Person | Who | What stops them |
|---|---|---|
| Sofia, 41 | somatic practitioner, brings clients | who else can see a client's record |
| Diane, 46 | founder | no delta; an ask before a payoff |
| Marcus, 44 | creative director | anything clipped, squeezed or undecided |
| Angela, 36 | seeker, level 5, her phone is the product | the word Incoherent; losing her place |
| Derek, 39 | endurance, level 7 to 8 | a claim with no instrument; the action five screens down |
| James, 57 | C suite, level 3, defended | anything that accuses; a demo control over his own data |
| Ana, 47 | teacher, in it now | one more choice than she can hold; a moral word about herself |
| Gordon, 58 | the most loaded profile; refuses the frame | do not chase him: softening the pain line loses Ana and Derek |
| Rosa, 61 | retired midwife, nothing held | correctly not the customer; the test that empty reads as empty |

The owner's buyer grid (`BUYERS.md`) is not monotonic. It peaks at levels 8 to
10 and is largest and hardest at 4 and 5. **Onboarding is written for Angela,
not Derek.** The first screens meet a person with the least spare working
memory the product will ever see from them, primed to read any number as a
verdict.

### 6.2 The UX rulebook

Ten rules, reconciled with his rulings; where a principle collides with a
ruling, the ruling wins and the collision is named. R1 one word per concept
(canonical: nothing held, held, profile, release, opposite). R2 a slot keeps
its label and the value carries the state. R3 provide a status and never lie.
R4 prevent the error at the boundary. R5 undo beats confirm. R6 recognition
over recall. R7 less is more: remove, hide, shrink, organise, in that order.
R8 accessibility built in; motion is a toggle, not only a query. R9 every
action gets a response; no dead states. R10 never hide a control with no
affordance.

Floors: 44 by 44 targets; feedback under 1 second needs no indicator, 1 to 3 a
spinner, 3 to 10 progress showing what is left, over 10 an estimate and a way
out; five people for a usability test. Nothing local ever takes long enough
for a spinner, and one would be "a lie about effort".

The skill file is stale in three places (section 13, item 6).

**The cognitive load options on file**, none ruled: A, the left rail becomes a
spine of drawers; B, two level navigation; C, one object, one action, one way
back; D, a bar that grows as it is earned; E, density. Which metric a gate
holds (raw choices or decision groups) is part of the same decision.

### 6.3 What a person can take back, and how they are told

- **Undo is built**: unlimited, with redo, snapshotting before a commit or a
  release lands. It does not restore gate evidence, the story entry, the
  snapshot or the meter (7.8). The arrows are the only route to it.
- **Undo beats confirm.** The one confirm left is deleting a record.
- **Commit** is two calls with a boundary drawn between them on the page:
  `parseStory` reads, `applyStory` writes. A commit on a reference case is
  refused with a named reason, never repointed.
- **The status contract.** One writer. A refusal names its own reason, so
  "this is a worked example, switch to your own profile first" is a different
  sentence from "storage is full or blocked". Known gaps: the story commit
  reports nothing on success and ignores its own save result.
- **The microphone says its cost before it opens**: browser speech
  recognition sends audio to the browser vendor. We do not sell it and do not
  control it. Typing is the equal path.

### 6.4 Principles for surfaces that do not exist yet

For auth, the paywall, the practitioner view, push and the ladder. Each is a
principle with the ruling it comes from; the designs are his to approve.

1. A reading is never invented. A notification never states a reading the
   person has not produced.
2. A reading is not a score. No rank, no percentile, no "you are ahead of".
   Settle the word tier before the paywall: it names both a band and a plan.
3. Sight is not for sale. The paywall sells volume and says so.
4. Never claim success before you have it: signed in, a tier change, reminders
   on, each only after it is true.
5. A consequential grant is explicit, listed and revocable.
6. A crossing is refused, never repointed. A practitioner cannot commit,
   release or answer on a client's field.
7. Undo beats confirm; confirm only where undo cannot reach.
8. Validate at the boundary, refuse by name, never clamp.
9. Every surface opens showing something true, or says why it cannot.
10. Say the cost at the control, before the act, in one line, beside the
    alternative.
11. One word per concept, one slot one label.
12. Refusal is a first class answer.
13. The asymmetric error: a false positive on the lack side is the one error
    the product cannot afford. No verdict about a person travels in a
    notification or a client summary.
14. Things empty as a person improves: the bar is drawn full, and what is drawn
    inside it is the load, which falls (`DESIGN-sheet.md`).
15. Voice (1.4).
16. Form (1.4).
17. Motion: a surface arrives, it does not appear.
18. The network lives at named seams, each a write that reports.
19. Four sides, each with a logic. A new surface earns its place or is a drill.

---

## 7. Architecture, data and schema

Sources: `design-architecture.md` (read at `eb788a2`) and
`brief-technical.md` (rendering, read at `1c021f4`), with `CLAUDE.md`.

### 7.1 The shape in one paragraph

One HTML file, no dependencies, no network. About fifty source files are
concatenated, in an order fixed by `atuned_src/MANIFEST`, into one script
block. The **engine** (`atuned_src/engine/`) holds data tables, arithmetic,
the profile schema and persistence logic, and may not touch the browser. The
**UI** (`atuned_src/ui/`) holds renderers and wiring and is the only half
allowed a document. Working state sits in a few module level globals, the
largest being `S`. A person's data is a profile; many profiles live in one
array (`PROFILES`), one is current (`CURP`), and the whole array is written as
one JSON string under one key. The engine never knows what storage is: the
host hands it a get and a set. Every profile from disk or a paste goes through
one validator. The UI moves between surfaces through one function, keyed by
permanent integers.

**Three hosts run the same engine today**: the app (`source.html`), the web
quiz (`funnel/quiz.html`, which loads `engine.js`), and the node tests. The
desktop build would be a fourth. That is the whole reason the engine is host
free.

### 7.2 The build

- `./atuned_src/BUILD.sh` concatenates in MANIFEST order into `source.html`.
  It fails on a parse error in any module, unbalanced `<div>` tags, or an em
  dash. It stamps the build onto the document and writes an end of file length
  marker, so a truncated file can say so. A separate guard script runs first
  and can name the module where a script stopped.
- `./atuned_src/BUILD-engine.sh` builds `engine.js` and asserts it host free.
- The shell has four parts, not three: head, body, **guard**, foot.
- A var used before its declaration throws at parse, which is why MANIFEST is
  load bearing and nothing else may order the files.
- **Packing.** `tools/pack.js` gzips the build, base64 encodes it and wraps it
  in a few hundred bytes that inflate it with `DecompressionStream`. It is
  still one file with nothing fetched. The watchdog sits ahead of the payload,
  because a cut file cuts the loader. A truncated gzip stream cannot inflate,
  where a truncated script parses most of the way and leaves a plausible empty
  shell.
- `tools/equiv.py` compares every top level declaration by name and hashed
  body. It is a reliable detector of changed function bodies and renamed
  declarations, and nothing more: it passes a deleted declaration and cannot
  see top level statements after a column 0 comment (architecture brief 10).

### 7.3 The engine and the host

`atuned_src/hostfree.py` strips comments and strings from `engine.js`, then
refuses `document`, `window`, `navigator`, `localStorage`, `sessionStorage`,
`requestAnimationFrame`, `alert`, `fetch`, `XMLHttpRequest`, `AudioContext`,
`webkitAudioContext`, `speechSynthesis`, `SpeechRecognition`,
`webkitSpeechRecognition` and `new Image`. The engine is host free, not
deterministic in time: it uses dates and random ids.

**The seams**, all one pattern: a slot, a `bind` setter, and callers that say
so honestly when nothing is bound.

| Seam | What unbound means |
|---|---|
| `bindStore(get,set)` (`engine/schema.js`) | saves refuse with a named reason rather than report a save that did not happen |
| `bindSend(fn)` (`engine/outbox.js`) | envelopes stay queued; the UI says "Held on this device", never "sent" |
| `bindPlan(fn)` (`ui/panels.js`) | "Billing is not connected yet" |

**Stored on the device**: `source.profiles` (every profile, plus any raw
record the boundary refused, kept so a later version can read it),
`source.outbox`, and the density choice. Nothing else persists: not the
lighting, not the current tab, not undo history.

### 7.4 The profile record, schema v2

Created by `blankProfile`. Schema v2 added `gates`; a v1 record loads with
gates read as zero, and saving upgrades it. **The schema version is his call:
it is the cross compatibility contract with SOURCE.**

| Field | Holds |
|---|---|
| `v`, `id`, `name`, `created`, `updated` | version, the only identity a record has, the profile label |
| `soul` | selected domains, archetypes and roots |
| `axes` | the nine axes, each `held` (charge) and `opp` (the installed opposite), 0 to 10 |
| `laws` | the 21 laws, each a number or `null`. Null means not yet measured, and that is load bearing |
| `who` | first, middle and last name, sex, birth date, time and place. Nothing derived from them is stored |
| `ui` | `quiet` (reduced motion) and `model` (consent to use stories to refine models, off by default; nothing reads it yet) |
| `seed` | a stated four letter type and the charge it wrote |
| `meter` | lines spoken, the unique pattern keys ever opened, dated firsts |
| `plan` | tier, status, granted, carried, base, since, until. Written by the record store, never the app. No customer id, email or key |
| `avatar` | built, dates, and the pairs of who you are and who you are not |
| `purpose` | three soul values, three earthly values, and the six sided boundary |
| `intake` | the 63 answers and which laws are done |
| `gates` | counts of cue sentences from stories |
| `story` | the person's own words verbatim, with what the reading said at the time |
| `rituals` | each saved ritual: track, steps, minutes, when, where, done |
| `history` | snapshots of readings, stored on purpose because a snapshot is what the record said at the time |

The rule is that a derived value is never stored, because storing it creates
two truths. The exceptions are deliberate (`history`, `meter.unique`) or
recorded as defects (`laws` has two writers; `intake.done` is stored and
derived). A field written onto a record that is not in `blankProfile` and
`validateProfile` is erased on the next boot.

**Working state.** `loadProfile` copies a profile into `S`, everything
computes from `S`, and `saveProfile` copies it back. `S` mixes field inputs,
identity pointers and view state. The demo personas are a second route into
`S` that skips `loadProfile`, and `S.who` is a position in a list a UI module
reorders at load. The port keys personas by id and routes them through
`loadProfile`.

### 7.5 Validation at the boundary

`validateProfile` is the one door for any profile this session did not
create. It fills a missing field from the blank and refuses a wrong type or
an out of range value by name. `pImport` is atomic: nothing moves until the
profile has validated, loaded and saved, and a failure restores what was there
and says why. Known holes, measured: it truncates some strings, drops some
wrong entries silently, and the same record imported twice becomes two records
with one id (architecture brief 4.4). There is an import control in Settings
(Load a record), which `CLAUDE.md` still says does not exist (section 13,
item 13).

### 7.6 The impure core and the front door

`compute()` takes no arguments. It reads `S`, the domain ring, the gate
evidence and `CURP.laws`, and writes per address results onto the node
objects themselves. `engine/read.js` is the front door and the only place
permitted to drive that state, in one order: input (load, apply the intake,
optionally apply a story), throughput (compute and the secondary reads),
output (save). Read twice, it gives the same number. **The UI mostly bypasses
it.** Where the containment leaks, measured: `unread` follows `CURP` rather
than the profile loaded; gate evidence leaks across persona switches; undo
does not restore the gates. Purifying the core is a signature rewrite and is
**deliberately deferred** under port, do not rebuild. Its shape is written
down (architecture brief 7.4).

### 7.7 Rendering and the frame budget

Three technologies, on purpose. **Canvas** where the picture repaints
continuously (the wheel, the wash, the compass). **SVG** where the picture is
static between interactions and needs clipping and blur (the Body map, rings,
icons). **DOM** for everything a person reads, focuses or taps. `compute()`
runs every frame; `render()` runs per interaction. The dominant cost is the
wheel on the heaviest profile at the deepest zoom. The regressions this
codebase measured, and what fixed each one, are in the technical brief 2.4.
The rule to carry: any backdrop blur above a surface that repaints every frame
re-reads and re-filters its backdrop every frame, and the cost scales with
area.

**The gap in verification.** The gates check at exactly two widths, 1600 by
1000 and 390 by 844. Nothing automated looks at 721 to 1180, which is a real
layout and where a tablet or a narrow window lands.

### 7.8 Undo

Unlimited, with a redo stack, keyed by record id (`engine/undo.js`). The UI
snapshots before a commit or a release lands. What it does not take back:
gate evidence, the story entry, the snapshot and the meter. It does take back
a release's lift on the laws (`p.work`, 2.1), which is an input. Because the
meter is not refunded, undoing a release forfeits the lift on that ground for
good: a rerun of it is free and lifts nothing. After undoing a story, the
headline CQ does not move. The unit of undo, and whether a release refunds
when undone, are his.

### 7.9 The network, for the accounts fork

Today the file makes no request, and a gate fails on any. Under the fork the
app gains network at one seam, the record fetch at sign in, in the host and
never the engine, entering through the existing boundary:

    sign in (host) -> fetch record -> text -> pImport -> validateProfile
                   -> loadProfile -> PROFILES, CURP -> pPersist

Billing and support stay behind their own host bound seams. Support queued in
the outbox is a second outbound need, which whoever binds it is adding.
**The local profile is not the shape that may travel**: it carries `who` and
story text together. A record store needs a projection (a key in place of
identity, a merge that does not overwrite the local story), and it does not
exist yet. **Save conflict between two devices is open and blocks the record
store**: the whole array is written under one key with no revision.

### 7.10 How the product is verified

    ./atuned_src/BUILD.sh
    ./atuned_src/BUILD-engine.sh
    node tests/engine.js
    node tests/functional.js
    node tests/collide.js
    node tests/design.js
    node tools/monitor.js
    node tests/funnel.js
    python3 .claude/skills/atuned-voice/check.py --objections

Counts are read off the run. `tools/monitor.js` walks every surface named in
`TABDEF` and `TABEXTRA` at both widths, blank and loaded, and appends a stamped
block to `MONITOR.log`. Three lessons are built into it and must not be
optimised out: `innerText` does not see SVG, so a surface passes on markup;
a canvas has no markup, so the Field is counted in lit pixels; and a CSS
animation runs without scripts, so the no script notice is asserted. A fourth,
learned by the watch failing: find a host by its id, never by where it sits.

---

## 8. The engine and its mechanisms

Source: `design-mechanisms.md` (the arithmetic and inference core), read at
`eb788a2` and checked against the built `engine.js`. It carries the full
formulas, the test vectors and ten reproduced defects.

### 8.1 There is no model

Nothing is trained, learned or estimated from data. A story is lowercased and
matched against hand built word and phrase tables. Every match carries a seat
and an intensity someone typed in. Those are summed, scaled, and added to nine
0 to 10 axes. Everything after is arithmetic over the nine axes, the 21 self
rated laws and a self selected soul. A port that copies the arithmetic copies
the product. A port that "improves" it with a classifier has built a
different product.

| Kind of input | Where it enters |
|---|---|
| Matched from what the person wrote | the sniffer, the gate scanner, the lean |
| Self report | the axis sliders, the 63 intake answers, the four letter type, the soul picker |
| Symbolic, from birth data | astrology, the I Ching gates, numerology. Never feeds the charge |

### 8.2 The shared vocabulary

- **The nine axes**, each with its seat and its coherent opposite: Fear
  (Root, toward Trust), Anger (Solar, Equanimity), Shame (Sacral, Worth),
  Disgust (Sacral, Acceptance), Apathy (Throat, Vitality), Shock (3rd Eye,
  Groundedness), Sad (Heart, Joy), Surprise (Heart, Readiness), Anticipation
  (Solar, Presence). Order matters: ties go to the earlier.
- **The seven seats**: Root, Sacral, Solar, Heart, Throat, 3rd Eye, Crown.
- **The 112 addresses** (`engine/data/nodes.js`). Four are field anchors
  outside the body that carry no charge today (section 2 rules that they
  count). Which axis an address belongs to is derived at load from its name
  and its raw charge label, not stored, and the axes are not equally
  represented: Anger carries by far the most addresses and Surprise the fewest.
  One address, `Root_08_Unnamed`, carries no axis at all (his, open).
- **The 21 laws**, seated by band (section 2.1). An unmeasured law reads 6 in
  working state and stays null on the record.
- **The pattern chain**: 33 saboteurs, then complexes, hyper complexes, and
  the character layer. Six families with overshot poles (Predatory, Collapse,
  Rigidity, Dysregulation, Dissociation, Grandiosity).
- **The ten bands** on CQ: Mastery 91 to 100, Embodied 81 to 90, Compounding
  71 to 80, Gaining 61 to 70, Even 51 to 60, Oscillating 41 to 50,
  Incoherent 31 to 40, Corrupt 21 to 30, Severe 11 to 20, Collapsed 0 to 10.
  Ruled as a word every ten points. The four low band words are under review
  and his; Collapsed also means three other things in the product (candidate:
  Seized); Oscillating may no longer print (section 2.1).

### 8.3 The sniffer

`engine/sniff.js`, tables in `engine/lexicon.js`. Normalise the text; match
phrases first, then words longest first, then adjectives that name a charge;
turn hits into imprints at addresses; and only then, on Commit, write charge.
`applyStory` is the only function in the sniffer that writes. `sniffStory`
returns the full contract with a `because` on every row, and `inferred`
separates what the words named from what was placed by fallback.

**What it cannot read, and must not silently start reading**: no negation
("I am not angry" scores as angry), no subject, no tense. It refuses to stem;
a short allow list of confirmed inflections stands in. Each of these is an
open ruling and each changes every reading (`DESIGN-sniffer.md`). Its weakness
is recall, not method: a lexicon with a precedence rule can be audited, and a
small model cannot.

### 8.4 The compute core as it ships

"Port, do not rebuild" covers these bodies. **The CQ line below is what ships
today and is superseded by the ruling in section 2.** It stays here because it
is the code until the change lands.

Per address, with `relief` the mean of that seat's laws over ten:

    held = charge on the address's axis x susceptibility x (1 - 0.42 x relief)
    rep  = the installed opposite x (0.72 + 0.28 x relief)
    sq   = held - 0.86 x rep, clamped 0 to 10
    loaded when sq >= 4

As shipped: `CQ = It x Ig / Rz`, where Ig and It are the law mean read two
ways, adjusted for installed and overshot opposites, and Rz is a resistance
built from the loaded shadow and the six gates. A blank profile computes 36,
which the unread guard silences.

Two facts the reading depends on:

- **The charge an address shows is not where the story landed.** An address
  reads its whole axis, scaled by susceptibility and by that seat's laws.
- **Susceptibility comes entirely from self selection** (the soul), and
  domain weighting is on his open list.

Also in the core: secondary readouts (radiance, will and drag, the lean, the
quadrant of shape and control), an accuracy figure that is a **completeness
index** and must never be labelled a confidence, and the release arithmetic,
which lowers the axis by a share and installs the opposite at 0.62 times
that share.

### 8.5 The seed, and birth material

- **The seed.** A person may state a four letter type. Four additive terms,
  one per letter, write a starting charge so a new field is not empty on day
  one. "Sixteen patterns would be sixteen assertions about people, each
  unarguable. Four terms are four assertions, each of which can be argued."
  It writes charge only, never a law, gate or domain. Whether it fades on its
  own is his (`CLAUDE.md`, open).
- **Birth material** is real astronomy mapped into symbolic systems (sun, moon
  and rising signs, I Ching gates, gene key, Chinese year) plus numerology in
  full. None of it reads the story or writes the charge. The agreement score
  between systems is not evidence and must not be called a confidence.

### 8.6 What is learnable

Nothing learns today. From stories alone, the vocabulary gap is learnable: the
words and frames the instrument reads as nothing. Not learnable, ever:
whether a reading is right, because there is no ground truth. That is why
every claim is sourced to the person's own words.

### 8.7 Open, and his

Schema v2. `Root_08_Unnamed`. The compressed CQ mid range, for which no
definition exists in the repository. Domain weighting. The depth button names
and the Matrix wiring. Whether the kink sits at the highest charge or the
lowest (`parseStory().path` reports both). Also found in the code: negation;
whether the lexicon is the book's or an instrument vocabulary; four axes where
the charge to seat table and the addresses disagree; four opposites that
differ between tables; the I Ching wheel order; which of three meanings "child
pattern" has. The mechanisms brief section 12 lists ten reproduced defects,
including a stated fetter printing an unrelated address name, and seeding
overwriting existing charge with no undo.

---

## 9. Gamification

Source: `design-gamification.md` (game director), read at `eb788a2`. Status
tags there were checked against `atuned_src/`, not against design documents.

The one sentence every mechanic is judged against (the game director's words):
**a person must be able to stop and be glad they used it.** If a mechanic only
works because leaving is punished, it does not ship.

### 9.1 What exists

**BUILT**: the record (a practice streak that halves on a miss rather than
resetting, a ledger of what happened, sixteen marks), two card games, the
progression spine underneath (unique ground, lines spoken, dated firsts,
markers scaled to the person's age), and the economy (patterns as the one
unit).

**DESIGNED, and most of the ambition**: the loop drawn as a ring and the turn
counter, a corrected set of marks and an award shelf, karma, the content
chain's middle, four more quotients, and the avatar as a figure.

### 9.2 The rules under everything

| Rule | What it forbids |
|---|---|
| A reading is never a score | coherence, the band, the avatar or a quotient shown as an achievement, rank or level |
| Never a count against a total | "3 of 14", a list of unearned marks, a completion bar on a person's nervous system |
| A fact, never a cause | "coherence up ten because you released" |
| Fixed, announced thresholds | variable ratio reward, near misses, random prizes. Randomness may pick which address; never how much |
| Nothing expires, nothing is taken back | scarcity timers, seasons that can be lost |
| Never name an absence | "welcome back", "you missed" |
| No ranking of people | leaderboards, lists sortable by coherence |
| Reward is paid for the record, after the fact | a reward promised in advance for doing the practice |
| In a crisis the product may hide what it sells, never what it measures | upsells in front of an acute reading |

Refused mechanics carry their measured price from the loop simulation (loss
framing, a streak that resets, rewards promised in advance, asserted
affirmations), so a refusal is an argued decision, not a preference.

**The vocabulary is OPEN.** One design bans points, badge, streak and score
from every surface; a later ruling of his says badges, achievements and a
score are in. The build shows "The record", "Marks", "running" and "last run".

### 9.3 The loop

Drawn nowhere in the build. Four documents say what each quarter is, and no
two agree (OPEN):

| Quarter | By act | By timestamp | By tab (onboarding) | His note |
|---|---|---|---|---|
| Discover | write an entry | a story entry | Story | the journal |
| Play | the ritual dealt | a ritual saved | Field | the imprints |
| Flow | keep the day | a ritual marked done | Ritual | the release |
| Embody | see what moved | a snapshot | Body | the ritual |

Recommendation on file: count turns on the by act mapping, the only one
instrumentable from stored timestamps, and use the by tab mapping only as the
tour's words. **The turn** (DESIGNED): one closed circle is one turn and the
only thing counted; it cannot be farmed. A defect in the design: a story
commit writes a snapshot, so Discover also stamps Embody. Do not port it as
written. "Turn" is also claimed by a quotient, so one of the two moves.

### 9.4 The content chain

| Step | Status |
|---|---|
| Journal to imprints: Commit needs at least one imprint | BUILT |
| Imprints to release: the heaviest or this entry's addresses | BUILT |
| Which practice: the seat carrying most picks the track, load picks the tier, the shortest practice wins | BUILT |
| When and where: the plan in the person's own words | BUILT |
| The practice carries one verbatim span of the person's own sentence | DESIGNED |
| The affirmation: never an assertion; a hedge on the person's own absolute, or a question | DESIGNED |
| The sixty second floor: one sentence held against the body keeps the day | DESIGNED |

**The safety invariant**: every span the chain returns is a verbatim
substring of what the person wrote. The product may find, cut and mark. It may
not write, complete or correct, except the one named hedge, which the person
can overwrite. **The chain is content bound**: measured against the
repository's own persona voices, the sniffer could cut a quotation out of 1
of 14. A content mechanic is worth nothing until the content arrives.

### 9.5 The record as built

Pure functions over the profile (`engine/ladder.js`). The streak halves on a
miss and does not reset. The ledger counts things that happened. Sixteen marks
in three families; only earned marks and the one next mark are ever shown,
never a total. It renders on Ritual and the Compass from one function, because
two places that report a streak are two places it can be wrong. Defects are in
the brief 5.9, including one place the build names an absence.

### 9.6 The economy and karma

BUILT: the pattern is the only unit (section 10.1). Nothing pays a pattern for
a mark, a streak or a game.

DESIGNED: karma, read as the name for patterns a person earned, paid for the
record after the fact: a ritual marked done, a journal entry that produced an
imprint, a mark, an award, a season finished. His words: "Whenever you get an
achievement or badge, that's your good karma." His achievement idea, clearing
a fetter, a saboteur or a hyper complex scaled upward, is designed nowhere in
MOB (the desktop has built it). OPEN: the word (patterns, points or karma),
the rate per mark, whether the balance prints, and whether a floor day equals
a full day.

### 9.7 The games

Two, BUILT, and both write nothing to the profile.

- **The letting go run.** Twenty four cards dealt from what is carrying, a
  pole to choose, a clock: "the practice is two or three minutes and a person
  who has never timed it does not believe that." Every line names its source:
  a printed card, else an axis card, else the strict syntax at the address.
  Every string is his catalogue, ported verbatim. Defects: on a blank profile
  it deals twenty four addresses carrying nothing, one of them
  `Root_08_Unnamed`, read aloud as a release line; for a loaded person it is
  not the heaviest twenty four; "N of 24 cleared" is a count against a total,
  and nothing is cleared.
- **The match.** Eight axes, two cards each. A match opens where the axis
  sits in this person's field, and "See the N running you" leads back into
  Story, the only built link from a game into the loop.

Whether a game played counts toward the day or the loop is OPEN.

### 9.8 The quotients

Only CQ exists. Four more are DESIGNED with formulas (`DESIGN-quotients.md`),
each a function of the record, never stored, each reading its own unread
state: **IQ, aperture** ("Fetters narrow awareness"), **EQ, turn** (how much
has turned over to its opposite), **AQ, release** (adversity met: the share of
the heaviest weight ever recorded that has been put down), and **PQ,
boundary** (stated, and labelled stated). AQ matters because for about half
the panel coherence barely moves under release, and something has to show the
work. The drawing is one iris, not five gauges. CQ's row in that document is
now governed by section 2.

### 9.9 The avatar

**BUILT (engine only)**: pairs of who a person is at their best and who they
are not on a bad day, the purpose triangles, and the six sided boundary. A
pair is a pair because "a value has no address and a sentence about a bad day
does". **Nothing in the app can write a pair, and no figure exists.** The
Summary's avatar paragraph can only print an all clear: it becomes a false
statement the moment a pair writer ships, so it is fixed before or with the
writer.

**DESIGNED**: three channels. The record is append only and it is the
drawing. The reach moves only by conduct, through the laws. The weather is
load today and the only channel allowed to move both ways. The record and the
reach never trade against each other, and neither is drawn as the same mark as
the weather: an avatar that gets prettier on a good day tells a person they
are worth more on a good day. **The kundalini rise is the progress bar**: per
seat transmission multiplied root first, so a shut root throttles everything
above it; the blocked seat named with its heaviest address; the starting point
written once, the first time a reading exists. On unread the bar does not
draw.

OPEN: body, light or diagram; whether the rise replaces coherence as the
headline anywhere; whether a practitioner sees it; the printed percentage
against the no score rule; the opening surface (1.5). Four requirements the
gamification places on it are in the brief 10.3, including a figure that still
moves for the people who cannot release.

### 9.10 What it is worth, modelled

From `tools/loopsim.js`, a weighted panel that is warm by construction, not an
install cohort. None of it is a promise. The final design roughly doubles day
thirty retention against the baseline build in the model. The largest single
item is the sniffer work behind the content chain. The largest new mechanic
is the first session showing what landed. The honest claim is that the design
reaches past a published category leader's shape on a warmer sample, not that
it beats it. The first hundred real people settle what this argued about.

---

## 10. Commercial, privacy and the accounts fork

Sources: `DECISIONS.md` (tiers and the meter, the key, billing, data, sight,
the practitioner, the stack), `DESIGN-billing.md`, `DESIGN-economics.md`,
`engine/plan.js`.

### 10.1 The unit: one pattern

**A pattern is one thought line, at an address, by way of a channel** (RULED).
"It is not spoken line, it is one thought line. And as one thought line, it
targets the address by way of the channel." Reading it in thought spends it.
Nothing requires a person to say anything aloud.

- The key is three parts: address, channel, line. Keyed that way the product
  holds 21,400 units of new ground (107 releasable addresses, by 4 channels, by
  50 lines a channel). Keyed by address and channel alone it held 428, and
  tier one would have finished it in five weeks.
- **A rerun of ground already opened costs nothing, forever.** Only new
  ground spends.
- **A run is a plan built when it is picked.** A person sees what it costs
  before beginning, and the plan cannot change between shown and charged. It
  costs the minimum the selection needs, capped at twenty five.
- **Spend is never stored.** It is always the unique count against a baseline.
- One pattern is valued at one dollar, internally, and that figure is never
  printed.

### 10.2 The ladder

BUILT in `engine/plan.js`:

| Rung | Patterns | Sees |
|---|---|---|
| The gift | 100, once | everything |
| Free | 10 a week, for life, banking toward a run | everything |
| Tier one | 400 a month | everything |
| Tier two | 800 a month | everything |
| Tier three | 1,200 a month | everything |
| Tier four | 1,200 a month, plus the cohort lead suite | everything |

**Prices**: he ruled 12, 24, 36 and 99 on 19 September. On 25 September he
recalled them as 12, 24, a third he did not name, and 99, "to be checked
against the simulation that set them". Tier four at 99 appears in every MOB
record; the desktop ships 99.99. Two months free is out; whether an annual plan carries
any discount is his. The allowance arrives monthly whatever the price,
"because the allowance is a pace". Other price and referral figures on record
disagree (section 13, items 2 to 4).

### 10.3 Sight

**Sight is not for sale** (RULED): "Tier one can see the Jungian archetypes.
Actually, they can see all that shit. It is really about the patterns and what
the patterns are doing. And then how many they can release." Every tier sees
the whole reading.

The desktop ships a second mechanism, `tierCanSee`, that hides part of a
person's own reading by tier. He had not known it existed. It is separate from
the ladder, it was never licensed, and it is **BLOCKED on his ruling**
(`TASKS.md` AZ3).

### 10.4 Billing

Stripe never appears in the app: no key, no script, no customer id, no card
field, and a gate sweeps the build for them. The app reads a plan off the
record and calls one host function. Checkout for the purchase, the customer
portal for everything after, hosted both times. What is in force is what
counts: a cancelled subscription is free, an unknown status grants nothing,
and past due keeps access, because "cutting somebody off over a bank's timing
is a punishment." A cancellation destroys nothing. The store writes five
fields and nothing else. (`DESIGN-billing.md`.)

### 10.5 Data and the private record

- **We never sell anybody's data. Ever.** He has worked in the field and knows
  what a person's data is worth to someone else.
- A person gets a key. The name never leaves the device.
- **The story is stored** (25 September), in his words: "since we're capturing
  it, what if you want to recover it, then you'd have to start all over again,
  so we should actually get that information. We should just say we have a
  policy to never share your data, we use the data for modelling purposes
  only." RULED: stored for recovery, never shared, used only for modelling. It
  supersedes the 18 September line that the record and the story are never
  held joined.
- What the team added, and what must be built under it (`TASKS.md` AZ4):
  **encryption at rest** (the desktop today is not, `AW6`), **consent asked**
  for any modelling use rather than assumed, and **de-identification** before
  anything touches a model. It rides the one seam, sign in. It gates whether
  sync may carry story text at all.
- The `ui.model` consent flag already exists on the profile, off by default,
  and nothing reads it.
- A developer side analytics view is in scope and never ships in a person's
  build. Whether it is a separate build from day one is his.
- A name can sit inside a story. Stripping names on the device is the only
  way that holds, and it will miss some. OPEN.

### 10.6 The practitioner and the cohort lead

- A practitioner is also a coach, with a panel of clients down the right side.
  Either side can start the connection; the person whose data it is consents.
- **Grant rule**: explicit consent, a visible list of who has sight, and
  revocation. Never a silent default.
- **A cohort lead sees outputs, not tools**: fetters, saboteurs, complexes,
  hyper complexes and their analytics. Not the spiritual material and **not
  the story cloud** (`LEAD_SEES` and `LEAD_HIDDEN` in `engine/plan.js`).
- Whether a practitioner sees everything or only the tier scope is OPEN.
  Three architectures are on file (`DESIGN-profiles.md`).
- **Frequency by Atüned**, matching people by coherence, is recorded as his
  idea and not designed. Three things come first: it is the leaderboard
  problem with the stakes raised, it joins a reading to an identity, and a low
  reading must not become an exclusion.

### 10.7 The stack and the channels

- **Cloudflare holds the record; GitHub holds the code** (25 September). A
  domain exists; his exact domain string is still needed. Cloudflare Pages
  can deploy from the branch with one DNS record.
- **Push access** to the desktop repository is granted and confirmed.
- **A ritual reminder as a pop up, outside the push channel** (`TASKS.md`
  AZ1): "The ritual, I think, is the only thing I want so far talking directly
  to the customer outside of the push notification." Design open.
- The community (Discord, beehiiv, or both) is open, and it decides where the
  referral attaches.

### 10.8 Claims

- Rapid rewiring is the mechanism claim, and it is fine. "Two years of
  therapy" is an outcome claim, and it is not.
- Rates quoted are the codex's own, with the low end said. Plant medicine is
  deliberately absent from the equivalence: the book gives no rate for it.
- Below the floor the product stops working the problem and refers to a
  licensed clinician, which is the book's own instruction.

---

## 11. The desktop port

Sources: `gap-desktop-wiring.md`, `gap-parity-matrix.md` and
`gap-ux-opportunities.md`, all read only, measured 25 September against
`rebootos-sourcce/reboot-os`, branch `claude/app-migration-decision-yx56cj`,
HEAD `8ba42de`; `PRIORITY.md` section 16; `TASKS.md` section AW. Nothing here
is built yet.

### 11.1 The verdict

The desktop file is byte for byte what its source builds, with no drift. **It
is not wired in.** The database exists as code and passing tests, but nothing
deployed and nothing the client ships ever talks to it. The shipped client is
fully offline. Its CI gate had been red for 81 consecutive pushes since 19
September. The first red run added a tool that hard codes a path; why the
latest runs die within seconds could not be read from here. The calibrated pattern map
geometry never moved into the build. The desktop recolour reached the CSS but
not the places that draw seat colour from script. Nine screens got no desktop
pass. There is one build, not a separate desktop file: the desktop is a set of
wide screen rules on the phone app.

### 11.2 The gap, foundation first

His order for everything: foundation and logic, then UI UX, then the look,
then content, then animation, then possibly sound.

**Foundation and logic**
1. The server is not wired: the database id is a placeholder, deploy runs only
   from `main`, which has no `atuned/`, and nothing sets the API address.
2. The CI gate is red. Until it is green, nothing after it is provable.
3. Sync drops four record kinds (week, cascade, applied, wins). A second
   device or a reinstall would lose them.
4. The calibrated geometry (113 nerve positions, 7 chakra orbs, 6 arm nodes)
   is read by nothing; the build scatters imprints by hash.
5. `canon.json`, which says it governs, is read by nothing.
6. The book handoffs never reached `atuned/` (Sol Star against Soul Star, six
   modes against eight clinical labels, nine registers against seven
   channels, no crisis resource).
7. The journal is not encrypted at rest; the lock is an overlay.

**UX**: nine surfaces with no desktop pass; the lit tab shows the last click,
not the screen; Home has no tab; tab names mean different things from MOB
(Energetics, Body); 901 to 1200 pixels gets the phone card.

**Look**: seat colours split between the DOM and script in six of seven
lightings; one row reads black on near black; the typeface is fetched from
Google Fonts, against MOB's embedded Inter.

**Content and records**: canon holes, and docs out of step with the code.

### 11.3 The two engines, system by system

| System | MOB | Desktop | Same model? |
|---|---|---|---|
| Address canon | 112, axis derived per address | 112, three names differ, no per address axis in arithmetic | same table |
| Laws | 21 (`SI`), seated, measured three ways | 20 (`LAWS1`), unseated | different rosters |
| Axes and charges | nine axis values | fourteen charge densities folded onto nine names | different unit |
| Coherence | law mean squared over resistance | law mean times root of follow-through over a placeholder | different formula |
| Sniffer | every hit counts, no stemming, inspectable | one hit per segment, stems, better recall | different method |
| Charge and release | per address charge | a cascade over hours, before and after density | same decrement, different target |
| Quotients | CQ built, four designed | CQ plus vitality, awareness, flow | different |
| Ladder and currency | spend model, record ladder | earned rewards, clearing achievements, store billing | different economy |
| Avatar | data, no writer, no figure; rise designed | data, a writer, a page | same concept |
| Seed and birth | real astronomy, numerology, type seed | typed text only | desktop has none |
| Intake | 63 questions | a 20 law diagnostic and somatic onboarding | different |
| Persistence | validating boundary, no server | server, no validating boundary | different |
| Undo | built | none | MOB only |
| Practitioner | outputs only, never the story | the story held under the account with its email | contradict |

**Foundation MOB has that the desktop lacks**: a headless host free engine
with a front door, per address arithmetic over all 112, the installed opposite
as state, the self selected soul, law measurement by triangulation, the seed
and birth systems, an inspectable sniffer contract, the validating boundary,
undo, the outbound and sight rules, the spend model, and the designed
quotients and rise.

**Foundation the desktop has that MOB lacks**: a server (accounts, consent,
sync, deletion, push, support), billing through the app stores, a canon
database held equal to the build, intention as follow-through, the release
record with a cascade, earned rewards and clearing achievements, sniffer
recall machinery including a learned personal vocabulary, readouts MOB lacks,
somatic onboarding and the pain map, a simulation harness, and content corpora.

**Contradictions that change a number or a promise a person sees**: the law
roster, the CQ formula, DQ, SQ, intention, word to axis routing, seats, the
opposites, masks and their seats, the saboteur table, the load per year and
distance ladder, tiers and sight (the desktop sells reach by tier at 9.99,
29.99, 49.99 and 99.99), and the story held joined to identity. Each is his
ruling or already on an open list. The full 29 row table is in the parity
matrix.

### 11.4 The desktop's own documents

The desktop repository carries its own product bible
(`atuned/docs/ATUNED_PRODUCT_BIBLE_v1.md`), a set of generated bibles
(`atuned/docs/bibles/`: design, art direction, animation, copy, customer,
marketing, owner rulings, his own words), and a numbered ruling ledger
(`THE_RULINGS.md`, `THE_LOG.md`). **They are not folded into this version.**
They disagree with this document on points a person sees; for example, the
generated design bible still gives a gold accent and the pre-ruling seat
palette. Which governs for the desktop is part of `AW7` and `AW14`, and his.
One Bible means these are either folded in or retired. That is the first job
for version two (14.3).

### 11.5 The order, and what waits on him

From `PRIORITY.md` section 16. Rows that can start now without a ruling: fix
the three hard coded paths so the gate runs; wire the calibrated geometry;
embed the typeface; move the script drawn colours to the ruled table; correct
the stale desktop documents. Rows that wait on him: which coherence formula
and laws roster is canon (`AW7`); sight by tier and story beside email
(`AW8`); backend region, provider and PIN recovery (`AW1`, now partly answered
by the Cloudflare ruling); whether the book handoffs bind Atüned (`AW14`); the
body typeface. The visuals come last by his own order.

### 11.6 Missed opportunities

From the UX opportunities walk (both builds, read at MOB `bc29d9e`). The five
that matter most:

1. **The turn leaves no mark.** After a whole loop, MOB's Field read what it
   read before, and the desktop's Home read worse. A completed turn looks like
   no effect or like harm.
2. **One slot called Next.** The four doors vanish once anything is read, and
   nothing replaces them. The desktop already has the rule engine for it.
3. **Return appointments the engine already predicts** ("the rebound is day
   four and a half"), and nothing ever comes back to them. The honest version
   of variable reward.
4. **The status line evicts the navigation** at desktop width. Small, and
   first.
5. **Imprint flight on commit.** The words just written should travel to
   where they land. Today they vanish.

The 2027 trend set, each judged against his rulings: predictive UX from local
behaviour only, adaptive density that follows proficiency, voice as an equal
input across the loop, depth by scale and opacity and never by blur,
structured content for two audiences, and cognitive inclusion as the floor.
Refused or held for him: a cloud model for personalisation or chat,
personalisation from data joined off device, warmth in the instrument where it
measures, experimental navigation, and gamification as points.

---

## 12. Where everything else lives

Anything that changes faster than this document should track stays in its own
file. Read it there. Do not copy it here.

### 12.1 The live records

| File | What it is | How to read it |
|---|---|---|
| `TASKS.md` | The single backlog: technical items and review feedback in one list, plus "The record", his words note by note | Read it first. Sections run past AZ. `[?]` marks a question waiting on him |
| `PRIORITY.md` | The sequenced order, owned by the project manager | Each section carries its own stamp. Section 16 is the desktop, foundation first |
| `DECISIONS.md` | Every ruling, verbatim in substance, open items named as open | Read before proposing anything it may already settle |
| `QUESTIONS.md` | Every `[?]` in `TASKS.md`, gathered | His queue |
| `FEEDBACK-log.md` | One entry per piece of feedback that moved the product | Newest first |
| `MONITOR.log` | One stamped block per render watch run | Diff two blocks |
| `MILESTONES.md` | The sequenced plan, scrubbed by five disciplines: what each milestone unlocks and what must be decided first | Dated |
| `STABILITY.md` | A measured snapshot behind the technical half of the backlog | Old; its numbers predate most of the product |

### 12.2 Product, brand and voice

`PRODUCT.md` (the product brief, 20 September; section 13, item 14),
`BRAND.md`, `BUYERS.md` (his ten level grid), `COPY.md` (the buckets every
string belongs to), `COPY-questions.md`, `COPY-OBJECTIONS.md` (a build
product from `.claude/skills/atuned-voice/objections.json`; never edit it),
`.claude/skills/atuned-voice/SKILL.md` and `check.py`,
`.claude/skills/atuned-ux/SKILL.md`.

### 12.3 The design documents

| File | What it holds |
|---|---|
| `DESIGN.md` | The design law: colour, tier colour, alarm, icon, number, type, motion, composition, lightings, and the gates as a set |
| `DESIGN-ia.md` | The first drawing of the whole product, every claim cited to a line |
| `DESIGN-nav.md` | Two level navigation, proposed |
| `DESIGN-information.md` | How the product says what it means, one layer above the tooltip |
| `DESIGN-tooltip.md` | Eight mechanisms replaced by one tooltip |
| `DESIGN-story.md`, `DESIGN-story4.md` | The story page rebuilt, then four competing designs |
| `DESIGN-container.md` | The journal as a container with a lid and a seam |
| `DESIGN-sniffer.md` | What the sniffer looks for, may claim, and cannot read |
| `DESIGN-lean.md` | Benign and malignant as two channels |
| `DESIGN-integrity.md` | The laws of integrity and whether they need a system |
| `DESIGN-quotients.md` | The five quotients, ruled 21 September |
| `DESIGN-feathers.md` | The core graphic of the Field |
| `DESIGN-compass.md` | The compass, the descent, and the groups around them |
| `DESIGN-knowledge.md` | The knowledge base, five passes |
| `DESIGN-avatar.md` | The avatar, the kundalini rise |
| `DESIGN-sheet.md` | The character sheet: things empty as a person improves |
| `DESIGN-gamification.md` | The gamification, the content chain and the loop |
| `DESIGN-ladder.md` | Scoring, marks and awards on the loop |
| `DESIGN-progression.md` | Progression, scoring and reward as one system |
| `DESIGN-ritual.md` | The ritual builder, from D minus |
| `DESIGN-release.md` | The release as something a person hears |
| `DESIGN-onboard.md` | Onboarding, measured and stopped |
| `DESIGN-mobile.md`, `DESIGN-mobile-icp.md` | The phone build, and the simulated panel's five passes |
| `DESIGN-profiles.md` | Profiles and practitioners, designed three times |
| `DESIGN-tags.md` | Whether tags earn their place |
| `DESIGN-billing.md`, `DESIGN-economics.md` | Billing and the seam; the ladder priced |

### 12.4 Research, panels, reviews and plans

Research: `RESEARCH-icp.md`, `RESEARCH-ladder.md`, `RESEARCH-signal.md`,
`RESEARCH-somatics.md`, `RESEARCH-sources.md`, `RESEARCH-analytics.md`.
Simulated panels (model output, never human behaviour): `PANEL-10k.md`,
`PANEL-flow-1000.md`, `PANEL-ritual-1000.md`, `PANEL-fourfields.md`,
`PANEL-usability.md`. Reviews: `REVIEW-source.md`, `REVIEW-pass2.md`,
`REVIEW-five-lens.md`, `REVIEW-fields.md`, `REVIEW-quality.md`, and the
discipline reviews under `reviews/`. Plans: `PLAN.md`, `PLAN-quality.md`,
`RITUAL-RECONCILE.md`. The book: `BOOK-ERRATA.md` (every place the codex and
the engine disagree), `SNIFFER_SPEC.md`, `TDD-sniffer.md`. The team:
`TEAM.md` and `.claude/agents/`. Tests: `tests/README.md`.

### 12.5 The 25 September briefs

The source documents behind sections 2 to 11. **At the time of writing they
sit outside the repository**, in the session's working files, and were sent
to him as compiled pages. Until they are committed (14.3), this document is
the only copy of their conclusions inside the repository.

| File | Covers | Read at |
|---|---|---|
| `brief-foundations.md` | colour, light, type, icons, space, components | `1c021f4` |
| `brief-screens.md` | shell, surfaces, empty state, navigation, load | `1c021f4` |
| `brief-motion.md` | every motion, the boot, the defect register | `da6cca6` |
| `brief-technical.md` | rendering, frame budget, breakpoints, font, gates | `1c021f4` |
| `design-architecture.md` | build, host, state, boundary, undo, network | `eb788a2` |
| `design-mechanisms.md` | sniffer, compute, seed, birth, test vectors | `eb788a2` |
| `design-gamification.md` | loop, chain, ladder, economy, games, quotients, avatar | `eb788a2` |
| `design-uxdeep.md` | first run, story, drill, principles for new surfaces | `eb788a2` |
| `gap-desktop-wiring.md` | is the desktop current and wired | reboot-os `8ba42de` |
| `gap-parity-matrix.md` | the two engines compared | MOB `bc29d9e`, reboot-os `8ba42de` |
| `gap-ux-opportunities.md` | missed opportunities, the 2027 trend set | MOB `bc29d9e` |
| `cq-unified.md` | the two formulas against his ruling, the unified model | MOB `5d4c778`, reboot-os `8ba42de` |
| `harmonic-research.md` | can the nervous system be measured in hertz | 25 September |

---

## 13. Where the sources disagree

Found while assembling this version. Each is stated, not resolved. Where one
side is his later ruling, that side is current and the other document is
stale. Where neither is, it is his call.

1. **The opening surface.** `DECISIONS.md` says Summary and records neither
   reversal. `CLAUDE.md` and the code say Field. `TASKS.md` AV1 and AO2 say
   the avatar, his latest ruling, unbuilt. D11 asks whether the avatar replaces
   the Field (1.5).
2. **Prices.** Recommended 12, 29, 59, 99 (business pass); ruled 12, 24, 36,
   99 (19 September); recalled 12, 24, unnamed, 99 (25 September); the desktop
   ships 9.99, 29.99, 49.99, 99.99.
3. **Free.** Ten a week, banking (ruled, and built). Also ruled 19 September:
   "Free is ten unique patterns", swapping against the set held by weight.
   Those are different mechanisms, and the second is not built.
4. **Referral.** Ten more per person who joins (the first tier ruling); fifty
   (ruled, "Four rulings"); twenty five (`TASKS.md` AK1).
5. **Case.** `DECISIONS.md` rules title case on headers and sentence case in
   body, and says `CLAUDE.md` was wrong. `CLAUDE.md` and the UX skill still say
   plain sentence case. The first Bible said sentence case.
6. **The UX skill is stale in three places.** It says there is no undo (built,
   unlimited, with redo); that `loadProfile` accepts a charge of 9999 (the
   boundary now refuses it); and that personalisation is out of scope because
   there is no account (the fork is called).
7. **Oscillating.** He ruled it never prints as a word. It is the name of the
   41 to 50 tier and prints in the largest type on the Summary, on the
   Compass, and in the desktop's charge state.
8. **DQ.** Settled as the total shadow. The book says DQ is 100 minus CQ
   (`BOOK-ERRATA.md` 26), and the desktop ships 100 minus CQ.
9. **The record and the story.** 18 September: never held joined. 25
   September: the story is stored, for recovery and modelling. The earlier
   line is still stated as current in `PRODUCT.md`, `DESIGN-billing.md`,
   `DESIGN-sniffer.md`, `engine/plan.js`, several reviews, the architecture
   and mechanisms briefs, and the CQ bundle's section H. It is also constraint
   T2 in `DESIGN-profiles.md`, and all three practitioner architectures there
   are built on it, so that document needs re-reading against the new ruling,
   not a one word correction.
10. **The "Source OS" line under the wordmark.** The first Bible said it sits
    in the accent. The code sets it in the ink, and the art review asked for
    the Bible to follow the code (`reviews/art-direction.md` AD-37).
11. **Tabs in the solid lightings.** "A tab is not a button" and "a selected
    item changes its text, not its ground" against Punch and Lumen's "anything
    selected should be flat solid colour". Nobody has written which governs
    the top tabs (brief D4).
12. **The number of lightings and the seat colours.** The first Bible listed
    four lightings and the pre-ruling hexes. Seven ship, with the palette in
    3.3.
13. **The import control.** `CLAUDE.md` says there is none in the UI. Settings
    has Load a record, and the web quiz's downloaded record is its caller.
14. **`PRODUCT.md`** still describes "no backend and no accounts". The fork
    is called.
15. **Gate counts typed into documents.** `CLAUDE.md` removed them. `TEAM.md`
    and `.claude/agents/project-manager.md` still carry 741, 572, 96 and 62,
    which the runs have long since passed.
16. **When the team asks.** `TEAM.md`: "They ask when they are blocked and not
    before." His 25 September ruling: "always pose questions." The later
    ruling is current.
17. **The release channels.** Six (the first ruling), nine verbs in one line
    (the catalogue, "non negotiable"), four channels in the key arithmetic,
    and seven on the desktop. Which unit a pattern's channel is remains his
    (`DECISIONS.md`, "Still open").
18. **The vocabulary of reward.** One design bans badge, streak, score and
    points on every surface; his later note says badges, achievements and a
    score are in. The gate that would enforce the ban was never written.
19. **Four stale comments in the code**: Games described as folded inside
    Knowledge, the opening described as Summary, the frame loop described as
    guarded, and several motion values (brief-motion 13).
20. **The quotient table** in `DESIGN-quotients.md` and the gamification brief
    gives CQ as intention times integrity over resistance, as does "The core
    atomizes" in `DECISIONS.md`. Superseded by section 2.
21. **The desktop's own bibles** give a gold accent and the pre-ruling palette
    (11.4).
22. **The unit of his fifteen thousand.** MOB's ladder (`MARKERS`) reads it as
    unique thought lines, one channel at one address; the desktop's
    (`RELLADDER`) as cleared releases, one journal story cleared. Both engines'
    release lift (2.1) is fitted to his fifteen thousand in its own ladder's
    unit, so the same constant describes different amounts of work in each.
    His to settle (`TASKS.md` BE3).

---

## 14. Keeping this document

### 14.1 The job

Standing, and it belongs to the project manager. The document is right when a
new seat, or an engineer on the desktop port, can find the current position on
anything in it without asking.

### 14.2 When it changes, and how

- **Every ruling that lands in `DECISIONS.md`** is reflected here the same
  round, in his words, with its date. A reversal is recorded as a reversal;
  the earlier ruling is not erased.
- **Every brief or design document that changes a position** here moves the
  section it touches, and the stamp.
- **Every change to a stamped value** (a palette, a TAB, a constant) is
  re-read off the code, not off another document.
- **What never goes in**: backlog items, the order of work, counts that grow,
  or anything the run can say better. Point to it instead.
- A disagreement found is added to section 13 before it is resolved, and
  moved out when he rules.
- Each change adds a line to the version log.

### 14.3 Open work for version two

1. **Fold in the simulation result** (`TASKS.md` AZ5) as soon as it reports,
   and settle section 2.1's lever and build-up rule with him.
2. **Commit the 25 September briefs** to the repository (a `docs/briefs/`
   folder is the natural home) so the citations in 12.5 resolve.
3. **One Bible means one.** Fold in or retire the desktop's product bible, its
   generated bibles and its ruling ledger, once `AW7` and `AW14` are ruled.
4. **Line references to the first Bible are now broken.** `PRIORITY.md` cites
   `BIBLE.md` by line number in four places, and
   `.claude/skills/atuned-voice/objections.json` cites line 154 (rendered
   into `COPY-OBJECTIONS.md`, which is never edited by hand). They should cite
   sections.
5. **The stale documents in section 13** are each a small correction for the
   seat that owns them.

### 14.4 What changed from the first BIBLE.md (19 September)

The first page was the settled subset. Every line of it is carried above. The
corrections:

- Seat hexes: the pre-ruling values are retired for the shipped palette (3.3).
- Four lightings became seven (3.6).
- "Sentence case" is now sentence case in body and title case on headers
  (1.4, 13 item 5).
- The "Source OS" subtitle colour follows the code (13 item 10).
- "The record is never held joined to the story" is superseded by the 25
  September story storage ruling (1.4, 10.5).
- "Compass is 8 and Settings is 9" is kept and extended: Ritual is 10,
  appended for the same reason (5.3).
- "The app opens on Field" is kept as built, with the avatar ruling beside it
  (1.5).
- The grades on record gained the story page and the ritual builder (1.6).

### 14.5 Version log

| Version | Date | Commit read | What changed |
|---|---|---|---|
| 1 | 25 September 2026 | `f885d8f` | First assembly. The settled rulings page merged with the 25 September briefs, the CQ rulings of the same day, the standing documents and the skills. The CQ simulation was still running and nothing fitted is printed. |
| 2 | 25 September 2026 | `21e78ca` | Section 2 updated with the fitted CQ model: the bell curve (centre 5, width 1.25), the expression formula, and the build-up, lever and outside-address rules the simulation settled. Five questions remain of the bundle's fifteen. |
| 3 | 25 September 2026 | `26827d6` | The correction, after ship: a release does move CQ. Section 2.1 gains the release lift as built in both engines, fitted to his fifteen thousand, and the two sentences that said a release cannot move CQ are recorded as the team's error, not erased. 7.8 says undo takes the lift back. Section 13 gains item 22, the unit of his fifteen thousand. |
