# Backlog

One list. It merges the measured technical items from `STABILITY.md` with the
review session in `FEEDBACK-alexander.md`, so there is nothing to reconcile
between two competing documents. Nothing here is started. Sizes are honest
estimates against this codebase, not encouragement.

Every task names where it lives, because "improve the analytics" is not a task.

---

## A. Buildable now. One file, no architecture change.

**A1. Full intake before the first reading.** `ui/intakeui.js`, `engine/intake.js`
The intake is 63 questions and the app renders a full reading with zero of them
answered. Gate the first reading behind completing it, state the time cost up
front, and show the interval as the reason. Measured: 0 answered reads 20.8
percent plus or minus 19.3, all 21 laws reads 48.8 plus or minus 12.1, so an
unanswered profile can legitimately move 39 points later. This is the item with
evidence and the one Alexander argued hardest for.
*Medium. Needs a ruling on whether it is a hard gate or a strong default.*

**A2. Layer isolation on the Field wheel.** `ui/wheel.js`
The four depths are strictly cumulative: `L>=1`, `L>=2`, `L===3`. There is no
way to see the saboteurs alone. The Energy tab already solves this with
`PMLAYER` and a row of buttons, so the pattern exists and can be ported rather
than invented. This is Alexander's "it is a lot of stuff" and the 57 to 71
simultaneous choices finding, arriving from two directions.
*Medium. The clearest win for cognitive load.*

**A3. Percentage per category.** `ui/analytics.js`, `ui/ui.js`
Analytics shows weighted amounts. Show the share instead, or alongside: what
percentage of this person each archetype is, each of the four root domains,
each mask. `r.aff` is already a normalised 12 vector and the right rail already
prints first, second and third with percentages, so the data is there.
Archetypes first, per Alexander.
*Small.*

**A4. Schema validation at the boundary.** `engine/schema.js`
`loadProfile` throws on all four malformed profiles tested and accepts a charge
of 9999. `pImport` checks only that a version field exists. Reachable by a
person through the import control. The UI clamps, the boundary does not.
*Small. The only reachable crash in the product.*

**A5. Undo on applying a story.** `ui/storyui.js`, `engine/read.js`
Applying a story bakes charge into the axes with no way back. Snapshot before
apply, offer a revert window.
*Medium. Largest product gap, unrelated to this review.*

**A6. Continuous integration.** new `.github/workflows/`
522 assertions across four gates and nothing runs them automatically.
*Small. Cheapest item here and it protects everything else.*

**A7. A tutorial that completes one loop.** new `ui/tutorial.js`
Not a tour of the interface. Find a pattern, release it, watch it change.
Alexander was specific that the walkthrough has to reach the release.
*Large. Needs the copy written before the code.*

**A8. A somatic opener.** new, small
Turn the senses inward, feel yes and no, before anything else. Establishes what
the instrument is reading.
*Small. Copy first again.*

**A9. Analytics drill depth.** `ui/analytics.js`
Correction to my own note: the bubbles ARE already clickable. `[data-ab]` sets
`ANA_PICK` and calls `anaDrill()`. So the task is not "make it clickable", it
is either that the affordance is invisible or that the drill stops one level
too shallow. Needs him to look once and say which.
*Unknown until that question is answered.*

**A10. Google Fonts.** `shell/head.html`
Two outbound requests per load, sending an IP to Google before anything is
typed, in an app holding somatic self report. Self host or fall back to a
system stack.
*Small. His call, it costs bytes.*

**A11. Saboteur presentation.** `ui/wheel.js`, `ui/drills.js`
"Covering up too much, feels blocked in, not designed." Still needs one answer
from him: is it the panel, or the labels crowding the centre of the wheel.
*Blocked on that answer.*

**A12. The missing somatic practices.** `engine/data/practice.js`
Content, not code.
*Unsized. Depends how many are missing.*

---

## B. The funnel, and the small service behind it.

Part B described this properly, and one instinct in it changes the size of the
work: keep the quiz store separate from the app rather than making the app
talk to a backend. That is the right call and it is worth saying why.

**The funnel as described**

1. The ad does not say download the app. It says take the test, learn your CQ.
2. The quiz runs on the web. All the questions.
3. At the end the person enters an email. The answers are keyed to it.
4. To see the score they download at least the free app.
5. They sign up with the same email, and the answers come down with them.

**What actually has to exist**

Measured against the real schema, not estimated:

    questions in the quiz        63
    answers payload             432 bytes
    laws payload                304 bytes
    one quiz record, keyed      1.1 KB      512 bytes gzipped
    100,000 people              about 49 MB total

That is the entire service. A key value store holding half a kilobyte per
person, a write when the quiz completes, and a read when the app asks. It is
not a backend for the app. The app stays a single file and gains exactly one
capability: fetch a record by email, once, at sign in. Every other item in the
old version of this section assumed far more than that.

**B1. The web quiz.** A separate build from the same `atuned_src/`. It runs the
63 questions and nothing else, so it shares the intake and the schema and
carries none of the renderers.
*Medium. Mostly reuse.*

**B2. The record store.** Email keyed, versioned with the same `SCHEMA_V`, one
write and one read. Separate from anything else by design, per part B, so it
can be moved or replaced without touching the app.
*Small, and smaller than it sounds at 0.5 KB a record.*

**B3. Claim on first run.** The app asks for an email at sign in and pulls the
record down once. After that the profile is local again, which keeps the
privacy posture everywhere except the handoff.
*Small.*

**B4. Desktop and app talking.** Same mechanism as B3. No new surface.

**Two things the design as described does not yet handle**

*The email is the only key.* As stated, anything that knows an address can
retrieve that person's somatic and psychological profile. That is not a
hypothetical, it is what "ping the email address and get the answers" means. A
one time code sent to the address, or a signed claim link, closes it and costs
very little. Given what this data is, it is not optional.

*Data leaving the device changes the legal position.* While everything stayed
in the browser there was no controller and no processor. A stored quiz record
keyed to an email is personal data held by someone, so access, deletion and
breach obligations attach. Worth one hour with someone who knows the ground
before the first record is written, not after.

**Still a fork, but a much narrower one**

The old version of this section listed pings, streaks, a community feed and
manager reporting as one decision with the funnel. They are not. The funnel
needs 0.5 KB a person and one read. Engagement mechanics need identity,
sessions, social graph and a notification channel. Taking the funnel does not
commit to any of the rest.

**Deferred, and genuinely separate**

- Notification pings and a chosen practice time
- Streaks
- Community feed, curated or open
- Seeing other people's progress
- Manager reporting and an admin portal
- Paid desktop tier against a free pattern only tier

## C. Already open, his call, unchanged by this review.

- Schema v2, the gates bump, cross compatibility contract with SOURCE
- `Root_08_Unnamed`, compressed CQ mid range, domain weighting, depth button
  names, the Matrix wiring
- Whether the kink sits at the highest charge or the lowest
- Compositing: Field measures about 100ms per frame from layer blending, not
  from our drawing. Needs one measurement on real hardware before anyone
  optimises it.

---

## D. Deferred on purpose.

- **D1. Purify the impure core.** A signature rewrite. The path work showed the
  interface has not settled, so doing it now would be invalidated.
- **D2. Headless coverage for the ui layer.** 15 modules, 5 reachable from the
  headless gate.

---

## If it were mine to order

A4 and A6 first: both small, both protect everything else, neither touches
design. Then A2, because layer isolation is the complaint that arrived from a
person and from a measurement at the same time. A3 is small enough to ride
along with A2.

Then A1, and it is worth seeing that A1 and B1 are the same work. The funnel's
quiz IS the full intake. Building the gate inside the app and building the web
quiz are one job done twice if they are scheduled apart, and one job done once
if they are scheduled together. That is the strongest argument for doing the
intake next rather than later.

A11 and A9 are blocked on one question each. Answering both costs a minute of
looking and would unblock real work.

## B0. The quiz has to have stakes. Noted 18 September.

Ahead of the mechanics, the ruling on what the quiz is:

**It has to talk directly to the pain.** Not a personality test, not a
curiosity. A person arrives carrying something. The quiz has to name it back
to them in a way that lands before it asks for anything.

**A magical solution without the magic.** That phrase is the brief. The result
should feel like it should not be possible to know that from a few questions,
and every line of it has to be mechanically defensible. The instrument already
is: it reads charge, it names the address, it costs it out. The copy has to
carry that without reaching for wonder, because the mechanism is the wonder.

**Open, the delivery format.** A video that sets it all up, or give it to them
raw and let them work it out. These are different products. The video
de-risks comprehension and adds production and a place to host it. Raw is
faster to ship, respects the person, and loses everyone who needs the frame.
Untested either way, so the focus group decides it rather than either of us.

**Open, the funnel shape.** Which funnel actually gets these people in is a
question for the ICPs, not an assumption. Ask them: what would get them to the
test, what they need to hear to take it, what they expect to get out of it,
and what makes them think this is too good to be true. Then shape the
narrative from the mechanics of being, sharp and short.

---

# The owner's queue, this session

Recorded verbatim in substance as it was given, so nothing is lost between
passes. Items are struck as they land. What is DONE below was done this
session and is in the history with its own commit; what is OPEN is not
started and is not being claimed.

## Done this session

- Body page: heat map, chain arcs, the clip defect that hid every address
- CQ copy rewritten to the owner's own language for coherence
- Lean removed; benign or malignant named; balance returned to the rail
- Balance strip rebuilt to the ruling: symbols, one line with a centre break,
  fill from the centre out, percent as a pill
- Console split: vitality, awareness, will and flow as their own readings
- Compass: halo on Source, ego compression and pitchfork on the blueprint,
  the 40 to 60 band with souls in it, your own marker oscillating, and the
  paragraph replaced with the reading and the integrity loop
- The atom: zoom past the fetters to the story weights, selectable and named
- Rail rows are doors with tooltips and a jump into the codex
- Source OS under the wordmark; the app opens on Field
- Back and forward, not just undo
- Top nav reads as tabs; the bar holds one line
- The boot: three seconds, twelve principles, and it removes itself
- Codex as a deck of cards rather than a wiki list
- Record replaces Speak, reports its failures, green and red dot
- Fetters highlighted in the person's own sentence in their seat colour
- Settings in the centre panel, integer 9, no tab
- Rail sections: pressing a header puts that section at the top

## Open, in the order it was given

**Story imprints, a fifth menu.** Ultra modern, flat, ten out of ten on
innovation, drawing on current UI direction. The dropdown has to sing.

**The compass, D to C plus.** Oscillation range over time in the lower left,
30 day, quarter, annual, to show whether a person is improving. The six axis
arrows: three that up regulate and three that down regulate, which is the
nervous system and the spine composited onto the figure as toggleable
overlays. A symbol for every character, Jesus through Lucifer. Selecting a
character shows their story and their polar opposite, because the whole point
of the compass is two paths of the same behaviour, and Socrates' framework of
virtue against the compression below. A layers button, with Dante's Inferno
and Paradiso as a suggestion for what compression over time looks like. And a
flat 2D version on a button, alongside the spinning one.

**The numbers, everywhere.** Lethargy, disconnection and the rest print as
bare figures. They become an icon with the percent complete on it, and the
pill to the lower right carrying the actual number. This is the item repeated
most and it is UX work across every surface.

**Tooltips on every number and every button.** Nothing on screen without one.

**The intake needs to say what it is asking.** Fetters as emotional
attachments: is the number how often they appear in the story cloud, or
something a person types in? What does "fear towards trust" mean? Is this the
laws of expression, in which case the sniffer will eventually supply the
value. Intention, integrity and expression probably belong on this screen.
Same question for the matrix: what is a person meant to do with it.

**Screen zones.** Top, bottom, left and right each need a logic, so the
areas around the centre carry at a glance information that is worth having.

**Badges, achievements and score.** Not integrated at all yet.

**Onboarding and the tutorial.** The welcome, the why, the story loop, how
mindset programming works, the geometric nature of behaviour, a walk through
the release protocol and the tools. Warm and inviting: this is for you, to
return yourself to your own state, and everything is exposed so you can see
how it works. The tutorial turns off once seen. Maximum flow and retention
with no burden, while still capturing enough for CQ and the energetics.

**Glass is a C.** Clunky. Crisper, and the fonts are too much in the face.

**Two months free is out.** The offer is not two months free. Any copy
saying so is wrong and comes out.

**Simulations to run.** Onboarding and tutorial against the ICPs and the
focus group. The story journal, Source AI, imprints and release, with release
treated as the special one because it is the true gamification and the audio.
Day one to day thirty, at a sample large enough to stop moving. Sign ups,
tier changes, drop off, acquisition cost. And the closing questions: would
you pay for this, would you pay this price, and how long would you use it.

**Technical questions to answer.** Does the engine need optimising. Does
anything need exposing that is not exposed yet.


---

# Queue, round two

Added as given. Struck as they land.

## Landed since the last queue entry

- Source OS is gold. `--gold` is an alias for the accent and has been since
  the accent was ruled blue, so everything asking for gold got blue. `--au` is
  a real gold token and nothing else uses it unless it asks by name.
- The centre stage ground is #101010, stated, on Field, Body and Compass. They
  were each sitting on the panel colour, which mixes from the heaviest seat
  and therefore drifts with the reading.
- Benign and malignant carry symbols, like balance. One form in two states:
  a closed ring with a rising stroke, and the same ring broken at its lower
  right with the stroke falling out of the gap.
- The Body footer list is back. It was never missing: `#eshelf` had seven
  children and real text and measured zero by zero, because it sits in a rail
  section that is closed by default. A surface now opens the sections it is
  about, once, the first time it is reached.
- The saboteurs were not broken, they were three of thirty four. Eight now
  draw as rings, and the wash underneath carries all of them.
- The heat map now matches what is selected. It was reading the field's own
  address load on every layer, so Saboteurs and Complexes drew an identical
  wash. Measured after the fix: four layers, four genuinely different
  distributions.

## Open, round two

**The summary page.** Terrible layout, terrible use of space, terrible
visuals. Bolded without the chakra colours. Simulate against the ICPs for a
frictionless flow that is symbolic, clean and well designed. It has to feel
special: this is you. First name, big, almost a welcome. Then buckets: top
line energetics, full name, the astrological systems and how those patterns
work through you, stated as a matter of fact and never wishy washy. Then
complexes, hyper complexes, saboteurs and how they work through you. Then the
output: how these raise or lower moral integrity, what is going well, what is
not, the protocol suggestions and the ritual recommendations.

**Source AI window on the summary.** A conversation about any of this data.

**Scrub the software ten times** for missed opportunities and ways to beef up
the innovation, the look and the feel. C to C plus.

**The tools rail is missing tools.** Examine every tool that could be exposed
on the left so a person can hold the mirror up and see themselves as deeply as
possible. The owner does not know what is missing, which is the brief.

**The Field is a missed opportunity for animation.** Which lines are showing
tension. What the weight of a connection is. As you zoom in, the symbols
should be all over it.

**The Body page needs the chakra image.** It was supplied and is not being
used. Selecting head, throat or shoulders should zoom to that location.

**The pain map starts blank and is touch select.** Tap anywhere on the figure
to mark tension, then go granular: find what is going on there, find the story
associated with it, release it. The system around this needs building.

**Body page: the stringy lines pointing at nothing** do not help. UI UX to
innovate on the design rather than patch it.

**The knowledge base.** Where is the stack, the universal laws, coherence. The
design looks nothing like the rest of the product. Review five times and
dramatically improve.

**Systems deep dive.** Go through every system, not willy nilly. Check five
times that everything works, then ten more for efficiency, tested against the
ICPs.

**The ritual builder and the accountability tracker** from the original
Atüned app. Research it, produce an integration and build plan, fit it to the
badge and achievement system, review the plan ten times, run it against the
ICPs, get analytics on the sticking points, fix, simulate until smooth, then
build.

## Still open from round one

Everything in the previous queue block that is not struck above, in
particular: the compass overhaul, the story imprints fifth menu, onboarding
and the tutorial, badges and achievements, screen zone logic, intake clarity,
glass crispness, tooltips on every number, and the ICP simulations with the
pricing questions.

---

# The team's four reviews, and what came out of them

Art direction, motion and VFX, UX structure and innovation, run in parallel
against the same captured evidence. Every finding below carries a measurement
taken off the live page. Full reports are in the session record.

## Built this round

- **The aura blur was eating 87 percent of the frame budget.** Measured 7.7
  fps on the Field with a loaded profile, 59.5 with that one element hidden.
  A 120px CSS blur over a 2400 by 1500 canvas, blurring four radial gradients
  that are already soft. Dropping the radius did not save it either: 40px at a
  smaller inset still only reached 15.2. Painted at an eighth scale and
  stretched instead, so the browser's bilinear upscale is the blur and it is
  free. **60.2 fps.**
- **The chords carry weight.** 163 of them were stroked at four constant
  widths by tier while the engine had already computed a real spread, 3.73 to
  6.00 across 34 saboteurs, and discarded it at the draw call. Heaviest chord
  is now about four times the lightest.
- **The chords carry tension, and the first definition was wrong.** I took
  tension as held minus installed and shipped it before measuring. Three
  distinct values across 120 chords: a reading with no variance. Susceptibility
  discriminates, 16 distinct values on the same set, and it is the Domain
  Matrix, which this instrument has computed since the first commit and never
  drawn. A taut chord is one the person is susceptible at.
- **`--dim` carried 104 of 105 contrast failures.** One token, measured at
  3.70 to 1, now 5.11. It marks the entire second tier of the information
  architecture, and six of the thirteen reference people are 57 or older.
- **Snow was broken and I broke it.** The `#101010` ruling named field, body
  and compass; I applied it to `.stage`, which also hosts every text surface,
  so Snow rendered a black box in a white app. 174 of 360 text runs failed,
  the reading paragraph at 2.22 to 1. Scoped to the three ruled surfaces:
  now 7.99.
- **The surface ramp was narrower than a printing tolerance.** `--bg` to
  `--panel` measured 1.08 to 1. Four declared levels of surface inside a sixth
  of a stop, which is why the page squints to three grey slabs. Now 1.15 and
  1.32.

## Open, with the spec attached

**The travelling charge on each chord.** One charge per chord moving inward,
address to saboteur to complex to hyper, period set by weight because heavy
things are slow. Turns the diagram into a circuit and teaches the compounding
direction without a word. 1.60s to 4.20s by weight, sine alpha envelope,
deterministic phase off the node id. Measured cost: about +1.2ms, taking the
frame to 14 percent of budget.

**Zoom is a hard cut, and every reveal layer opens after the ring has left
the frame.** Measured: the shell is fully on screen only to zoom 2.08, and the
glyph layer starts at 2.60, names at 3.90, atoms at 4.40. Every symbol the
owner asked to see is being drawn where he cannot see them. Two moves: ease
`S.zoom` over 260ms, which makes all five reveal ramps dissolve instead of
snap for free, and pull the thresholds down to 1.55, 2.05 and 2.60. The
threshold move changes what a depth means and is the owner's call.

**The Body has no pulse.** 144 SVG nodes, zero animated. Bloom radius and
alpha pulsing at a rate set by charge, asymmetric so it is a pulse and not a
throb, phase offset per marker so the body shimmers rather than flashing.
Compositor only, under 0.3ms.

**The house curve is on zero live elements.** 382 of 384 animated elements use
the browser default `ease`; the product's own `cubic-bezier(.22,1,.36,1)` is
in the stylesheet and on nothing. 323 elements transition `all`. Three easing
tokens and four duration tokens, then replace the `all`.

**`n.disp` is frame rate bound.** 0.14 per frame settles in 331ms at 60Hz and
165ms at 120Hz: the same instrument reads charge as moving at two different
speeds on two machines. Critically damped spring against real dt, plus a 90ms
stagger by tier so the chain reads as caused rather than simultaneous.

**The readings change in zero frames.** CQ goes 15 to 22 with no mark of any
kind. Count the number over 420ms when the delta is 2 or more, and let the
tile acknowledge with the seat colour of the direction of travel. Never the
alarm colour.

**The Summary structure**, as an ordered outline: the plate with the first
name at display size and the band and `TIERDEF.toward` beside it; four top
line readings on one scale each; the blueprint in one sentence; the spiritual
layer; what is running as one block rather than four; moral integrity, which
the owner asked for by name and which needs no new arithmetic; the output row
of protocol, release and next marker, which is the block the page has none of;
and what the instrument does not know. Analytics comes off Summary entirely
and becomes its own tool. Measured today: 115 interactive elements, 3990px
tall, the person's name first appearing 1.9 screens down inside a numerology
sentence, and 46 percent of the page a second rendering of its own top.

**Eighteen tools the engine computes and no surface draws**, ranked. The top
eight: the direction out of the band, moral integrity, the protocol this state
calls for, governance, the marker ladder, what is under the line, purpose and
the boundary, and the six gates. `pathOf`, `markersFor`, `boundaryCross`,
`equivOf`, `verpShare`, `r.steer` and `CASCADE` have zero callers anywhere in
the UI. That is the honest answer to "we are missing tools and I do not know
what."

**The pain map, paint to select.** `NERVEBR` is 72 traced polylines, about
1500 points, in the figure's own coordinate space, each tagged with its seat,
currently used only to draw strokes. It is the hit geometry, already in the
file, and it resolves what the region buttons cannot: `PAINREG` has no x, so
arms and torso at the same height are indistinguishable. Capture, locate,
answer, release, and `relPick` already exists. The discipline: the stroke
selects addresses and never writes charge.

**27 named things have no icon.** All 21 laws and all 6 masks. The laws are
the numerator of CQ and render as bare radial spokes. This is why zooming in
resolves into geometry rather than into language, and it is a standing Bible
violation.

**Eight defects filed regardless of any redesign**, including two direct self
contradictions on the Summary: "leans benign at 82 percent, which means it is
contracting" takes the word from one reading and the verb from another, and
"installed pole is past the point where it pays" prints beside installed 0.0.
The pole ring is labelled 0 to 1 and reads 2.26. `sq>=4` gates "held" while
the saboteur gate is 3, so "nothing is held" prints beside ten named
saboteurs.

**The Field is too small.** The drawn disc is 26 percent of its own canvas and
16 percent of its column. An art direction call, and it caps what motion can
deliver.


---

# Queue, round three

## The audit he asked for. What was asked and never built.

Checked against the code, not against memory. A grep count of zero is the
evidence.

**Never started, asked for in earlier rounds:**

- **Onboarding.** One mention in the source and it is a comment. The welcome,
  the why, the story loop, how mindset programming works, the geometric nature
  of behaviour, the walk through the release protocol and the tools.
- **The tutorial.** Zero. Turns off once seen. Walks the tools and says what
  to expect from each.
- **Badges, achievements, score.** Two files mention a badge and neither is a
  system. Asked for twice.
- **Source AI.** Zero. A conversation with the reading, on the summary.
- **The ritual builder and the accountability tracker** from the original
  Atüned app. Zero.
- **The chakra image the owner supplied.** Zero. Still unused.
- **Selecting head, throat or shoulders should zoom to that location.** Not
  built.
- **The pain map starting blank, touch select.** Not built.
- **The intake redesign**, the Ultima style moral dilemma questions, the nine
  child emotion questions, and exposing every question in the centre rather
  than the rail. Not built.
- **The story redesign.** Called static and dull. Not done.
- **The summary redesign.** Specified in detail twice. Not done.
- **Tooltips on every number and every button.** Partial: the rail rows have
  them, most numbers do not.
- **Glass crispness.** Graded C twice, unchanged.
- **The compass overhaul.** Oscillation over time in the lower left, the six
  axis arrows, the nervous system and spine overlay, character symbols,
  selecting a character showing their story and polar opposite, the Dante
  layers, the flat 2D toggle. None built.
- **Screen zone logic.** Specified by the UX architect this round, not built.
- **The story imprints fifth menu.** Not built.
- **The ICP simulations** with the pricing questions. Not run.
- **The systems deep dive**, five passes then ten more for efficiency. Not
  run.
- **Knowledge base: where is the stack, the universal laws, coherence.** Not
  addressed.
- **The tools rail is missing tools.** Eighteen identified this round, none
  added.

## New this round

**The heat map and the pain map need the Nummenmaa treatment.** He supplied
the bodily maps of emotion figures as reference. The current zones are not
noticeable. What those images do and this does not: a continuous field across
the whole body rather than blooms at seven points, a diverging scale with
activation and deactivation as two directions from a black midpoint, and a
silhouette that is filled rather than outlined. Ours reads as dots on a
diagram; theirs reads as a body.

**Source OS.** White, not gold. Four more pixels of space between the
wordmark and it. One or two points smaller.

**Two more lightings.** A fifth, Glass on white. A sixth, flat colour, super
futuristic, high end, really sexy, with less beveled edges than the current
work.

**The tabs.** They read as flat buttons. They should feel integrated into the
navigation, and the design should be sexier.

**Summary, the reading block.** It looks boring with text sitting on the
background. It needs to look like a display area, with a home.

**Summary, the blueprint block.** Primary, secondary, masks. Stacked is
wasting space. The numerology belongs at the top. The icons at the centre top
take too much room because everything is on one horizontal line; they should
be stacked, and hovering one should give information.

**Analytics.** Its own header, just the word Analytics. Can the charts be
clicked and zoomed.

**Moral integrity.** Bigger header. And three copy lines that do not
communicate: "Shut. Temperance, detachment, patience", "Every law is measured,
so nothing here is a default", and "The record. No snapshot yet."

**The knowledge base.** Address becomes Node. What is the difference between
an address and a fetter, and the page has to answer it. Add the weight, the
icon and the percent of the weight for anything identified in this person, and
nothing for what is not. The fetter cards already carry the icon; the number
goes in a pill at the lower right of it. And the word Fetter on the card is
replaced by the thing itself: Fear, Anger. Icon, then the action.

**The games come out of the knowledge base.** They are independent games, a
place a person comes for brain release games. This needs a game development
director with thirty years of mobile experience, Jam City, EA, Supercell, who
owns it: the structure, the game design document, the art direction, two
really rad games, and how they work into the point and badge system. Simulated
against the ICPs until the friction is out and they feel satisfying.

**The Field depth names are broken language.** Charge, Cluster, Chain,
Blueprint. Blueprint is understood. Chain is not. Is a cluster nodes, or
fetters, or a saboteur. Is charge the individual fetter. The architecture may
be right and the words are not, and this is the highest visibility naming
failure in the product.

**The wordmark restarts the app from the intro.** That is the behaviour; it is
worth deciding whether it should be.

**The intro animation is the face of the whole thing.** Two beats of black,
fade in and fade out, as bookends. Two more seconds of animation. Then the
animation director, the UI UX and the art director simulate it twenty times
and produce three dramatically different versions. What he likes, in his
words: line weight, effects, things that feel special, colour, feeling invited
to something brand new, really awesome animation timing, smart and clever ease
in and ease out, anticipation, timing, staging. The material is already
there: the halo, the soul, the pitchfork, the geometric nature of the soul.

**Profile save.** Is it automatic, is there a save button, is one needed. The
question needs an answer on the screen.

**A release tab, standalone.** The imprints panel on the left, split into two
halves that scroll independently: imprints on top, and the release with all
its settings on the bottom. How many patterns, how long, how quick, and
selecting which ones.

---

## Ruled 19 September, second note. Account, help and the feedback loop.

His words, and the whole block is his: the profile page is non-standard, the
identity form should put itself away once it is saved, undo and redo are just
the arrows, and feedback lives in help alongside customer support. The point he
made at the end is the one that orders the rest: the funnel, the product and
the feedback loop are one loop, not three features.

**Q1. The identity block rolls up on save.** `ui/intakeui.js`, `engine/schema.js`
Once a person has entered name, sex, date, time and place and pressed save, the
form collapses to one line stating what was entered, and an edit control is what
reopens it. His reasoning: a birth moment does not change, and a form left open
invites somebody to fiddle with the one input that cannot be wrong.
*Small. Done, this commit. `who.sealed` is an ISO stamp and passes the boundary.*

**Q2. A standard account area.** `ui/ui.js` settings surface, new module
The profile page is non-standard and he does not want it invented here.
Sections, in his order: account, security, privacy, billing and tier. Coherence
does not belong in it, because coherence is everywhere else in the app already.
*Large. Blocked on the IA report. Most of it is a stub until sign in exists,
and a stub has to say so rather than look broken.*

**Q3. Help, and what is in it.** new module
Customer support, which is a question that goes to a record store this product
does not have yet. A rating a person can give in seconds. The full alpha
questionnaire. All three need network, and the app has exactly one seam.
*Large. The queue and the honest failure report are the real work, not the form.*

**Q4. The alpha questionnaire.** new module
Eleven questions he named, across marketing, production and development. Do you
know what you are doing. How good is it. Does the information make sense. Do you
know what you are reading. What would improve the experience. Is the information
helpful, or not. Does the protocol make sense. Does the explanation around the
problem make sense. Do you know why we are doing this. Does the content and the
knowledge base make sense.
*Medium. Every answer has to name a decision it would change, or it is cut.*

**Q5. Undo and redo are the arrows.** `ui/ui.js`
No labels. The arrows carry it.
*Small.*

**Q6. One loop.** funnel, product, feedback
His close: "That way we have our funnel, the product, and feedback loop all in
one." Whatever gets built for Q2 to Q4 is designed as one path, not three
surfaces that happen to sit near each other.
*The framing, not a task. It decides the shape of Q2 to Q4.*

**What is ruled and not negotiable inside this block.** A feedback payload
leaves the device, so it is a record. It never carries a name, an email, a
customer id, a subscription id, a key or a token, and it never carries a story.
Free text is the risk and the control says so in one line before anybody types.
Every control that can fail reports through `status()` and never claims a send
it did not get.

---

## Ruled 19 September, third note. The Field, the fetters and imprints.

**R1. Imprints gets its own tab and its own robustness.** `ui/imprints.js`
He likes seeing an imprint appear inside the story and likes running one from
there, because it is instantaneous. That stays. What it does not have is a
surface of its own. His instruction: go and look at the original design and
review it twice, because a layout and a flow for this already exist there.
*Medium. Read the original before drawing anything.*

**R2. The rainbow bands at the centre of the Field.** `ui/wheel.js`
Zoomed in, the centre carries colour bands that read as feathers. His questions,
which are the spec: what is the intention, is it the expression of the energy,
what values is it deriving, and what is associated with it. Today it is a symbol
with no information, no click target and no behaviour.
*Medium. It either carries a reading and can be interrogated, or it comes out.*

**R3. The six axis icons are barely visible.** `ui/wheel.js`
Redesign so they stand out. They are also missing the pill carrying the percent
at which a person tends to do that thing most often.
*Medium.*

**R4. The Field top row takes too much horizontal space.** `ui/wheel.js`, `ui/panels.js`
Pills and percents across a full line for something that should be a circle and
a pill with text. Same information, far less real estate.
*Medium.*

**R5. The accuracy readout in the lower right.** `ui/wheel.js`
The percent is right and is what he wants: behavioural accuracy, stated. The
word identification is not needed. What is needed is the number, that it is
simulated, and the plus or minus gap around it.
*Small.*

**R6. Benign and malignant, masculine and feminine, are one feature.** `ui/panels.js`
They are the same kind of reading and they look dramatically different. One
design, one icon family, streamlined rather than a heavy bar. Click gives the
information, hover gives a tooltip. His instruction: draw it three or four
times and look at what information it is actually providing first.
*Medium.*

**R7. The fetters surface is broken.** `ui/panels.js`, `ui/map.js`
His report: a cluster of circles with no information, nothing clickable, no text
saying what is going on, and no way to tell how accurate it is. His instruction
is explicit about who and how: the art director, the design director and the UI
UX architect together, ten simulated passes, pitched to the ICPs, aiming at the
least friction and the most reason to come back. Then simulated against the ICPs
again and fixed on what that finds.
*Large. The one on this list a person has called broken, so it goes first.*

---

## Ruled 19 September, fourth note. The Compass, and the Summary.

He sent a screenshot of the Compass and called the page completely broken.

**T1. Field, Compass and Body become sub buttons under one parent.** `ui/ui.js`, `shell/body.html`
His word for the parent is tools. Three surfaces you cycle between rather than
three separate top level tabs. The TAB integers are identity and do not move.
*Medium.*

**T2. The Compass is a feature and must not hold the dominant space.** `ui/cone.js`
*Medium.*

**T3. It opens flat, in 2D.** `ui/cone.js`
Then click and drag to move around it. Today it opens in the turned figure,
which is the state he has to work out how to get out of.
*Small once T2 is decided.*

**T4. Flat, Regulation and Layers go to the upper left.** `ui/cone.js`
He does not know what they do, which is a naming problem as much as a placement
one. Move them, and make each one say what it is.
*Small.*

**T5. The lower left block comes out.** `ui/cone.js`
The right hand side is the information layer. A second information layer in the
lower left is the same reading in two places.
*Small.*

**T6. 30 day, quarter and year become a 2D graph in the lower right.** `ui/cone.js`
Cycling the three shows progress in graph form rather than switching a label.
Clicking the graph opens Summary.
*Medium.*

**T7. Summary carries integrity over time, full width.** `ui/summary.js`
One horizontal graph across the whole line, sortable by day, week, month,
quarter, year and five years.
*Medium. The five year bucket has no data behind it yet and must say so
rather than draw an empty axis as though it were flat.*

**T8. The Summary is bracketed and written.** `ui/summary.js`
His frame, and it is the spec: how the spiritual psychology runs through me,
how the ego runs through me, and how the spiritual influences the ego. Then a
summary. In depth, direct, accurate, computed from everything already entered
rather than assembled on the page.
*Large. It is the piece with the most engine behind it already.*

**T9. A widget to talk to Source AI from the Summary.** new module
A conversation about the summary, asking for specifics. Needs the seam, needs a
ruling on what the conversation may see, and the story boundary applies.
*Large. Blocked on his ruling about what Source AI is allowed to read.*

**T10. The archetypes wear their chakra colours.** `engine/data`, `ui/summary.js`
Primary and secondary archetypes are seated. Warrior is root, sage is crown,
mage is third eye. They are rendered without their colour today, which breaks
the standing rule that a named thing has an icon, the icon has a family and the
family has a colour.
*Small, and it is the one on this list that can land immediately.*
