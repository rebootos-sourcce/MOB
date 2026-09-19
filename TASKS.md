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
