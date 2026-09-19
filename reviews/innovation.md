# Innovation review

Rua Whitmore. Five passes, not merged. Read against the build at
`source.html` on branch `claude/laughing-feynman-xhfyj3`, screenshotted at
1600x1000 and 390x844 on the reference case James, 57.

The standing question in this seat is not whether the work is good. It is
whether it is the most interesting true thing available. Most of this product
is good. A specific and nameable part of it is the most interesting thing
anybody in this category has built, and it is not on screen.

One line I hold against myself throughout: this is a diagnostic instrument. A
novel thing that makes a reading less true is not an innovation. Two of the
ideas I most wanted to propose are refused below on that ground and are named
so nobody has to rediscover them.

---

## Pass one. What is genuinely novel here, and is it being wasted

### The ordinary version, named

The ordinary version of this product is a quiz that produces an archetype, a
body heat map, a library of named patterns, and a practice tracker. That
product exists about forty times. Most of what is currently on screen would be
at home in any of them.

### What is actually new, in order of how new it is

**1. The sentence has a route through the body, and the route is computed.**

`pathOf()` in `atuned_src/engine/sniff.js` takes the character offsets that
`scanStory` already records and returns the ordered walk a sentence takes
through the anatomy: `steps`, `span`, `net`, `drop`, `rise`, `dwell`, `start`,
`end`, `kink`, `floor`. Every step sits at a measured coordinate, the centroid
of that seat's own traced nerve branches in `SEATXY`, derived from 72 hand
traced polylines and not invented.

It has zero callers in `atuned_src/ui/`. I checked every file. The engine
computes the single most original object in this codebase on every keystroke
and throws it away.

The file even knows this and says so in a comment: it is a record, not an
input, deliberately kept out of the arithmetic because the claim is not
measured yet. That reasoning is correct for the arithmetic and wrong for the
screen. A thing that must not move a number can still be the truest picture
the instrument can draw. The route is not a claim about what a sentence does
to a person. It is a description of what the instrument read, in the order it
read it, which is exactly what a mirror is for.

Nothing else in this category can do this. It requires a word level parser
with offsets, an address book keyed to named anatomy, and traced geometry in
one coordinate space. This product has all three and shipped none of the
result.

**2. Saboteurs are matched on ranges, not floors.**

`SAB33` in `canon.js` keys every one of the 33 on charge bands with a ceiling.
The comment states the intent plainly: below the band the saboteur has not
formed, above it the charge has escalated past this one into a heavier
profile. That is a phase model. A person does not get more Avoider, they leave
Avoider and arrive somewhere else.

This is rendered as the number 28 in a pill. The one library in the category
that knows a pattern can be outgrown upward prints it as a count.

**3. The cure is measured as a defect.**

`n.jq` in `compute.js`. Jouissance, the coherent opposite overshot past the
point where it serves, computed at every somatic address and folded into
integrity with a negative coefficient. I know of no other instrument in this
space that models overinstall at all. Every one of them treats the positive
pole as an unbounded good.

On screen it is the word "overshot" appended to a saboteur name in a list.

**4. The instrument has a fitted error model and names its own deficit.**

`accuracy()` returns a percentage, an interval, and the decomposition that
produced both: law coverage, held signal with a saturation constant, expression
quality, degeneracy. The product can say what it does not know and what would
be cheapest to find out. It shows this as a percentage badge.

**5. The six gates are a cost multiplier read out of idiom.**

`VERPMULT` in `verp.js`. Detachment costs 0.60 of what a held pattern would
otherwise cost, attachment costs 1.35. Read from phrases in the person's own
prose. So how a person relates to what they carry changes what it costs them,
measured from how they write about it. `verpShare` has no UI caller.

**6. The 21 laws are asked three times and the gap is the measurement.**

`iqScore` returns `spread` and `reliable` and refuses to name a lean under a
spread of three, because that is inside self report noise. An instrument that
declines to read what it cannot see is rarer than it should be.

### The finding for this pass

Six genuinely new things. All six are computed. Zero are the primary rendering
of anything. The invention in this product sits below the waterline at roughly
an A minus and reaches the screen at roughly a C.

That is not a polish problem. It is a decision about what the surfaces are
for. Every surface currently renders **state**: how much, where, what it is
called. Not one renders **mechanism**: the route, the escalation, the
overshoot, the deficit, the gap. The mechanism is the only thing here that
nobody else has.

---

## Pass two. What is a commodity pattern, and what could replace it

I went through every surface and asked one question: if I removed the data and
the copy, would this component be recognisable as belonging to a different
product. Here is what came back yes.

**The ring plus pill badge.** It is on every surface, multiple times per
screen. A circular arc filled to a percentage with the number in a capsule
beside it is the Oura, Whoop, Fitbit, Apple Fitness gesture. It is the most
copied component of the last eight years.

And it contradicts this product's own ruling. `BIBLE.md` says a reading is not
a score and never print a count against a total. A ring filled to 13 percent
is a count against a total. It says thirteen of one hundred, and it says it in
the visual language of a goal. CQ 13 on James is not thirteen percent of a
person completed. It is a position on a poled scale whose own band table runs
Collapsed to Mastery.

There are two rulings in the Bible and they cannot both stand. One says a named
thing renders as a ring carrying the percent. The other says never print a
count against a total. I am not recommending a change here, I am flagging that
a ruling has to move, and arguing which. The arithmetic says the ring is the
one that is wrong.

**What replaces it, and it is native.** Every reading in this product is a
position on an axis with two named ends. That is a scale and a needle, not a
fill. Aircraft primary flight displays solved this in the nineteen sixties and
nobody has beaten it: a tape, a pointer, a band, and the band is coloured for
what it means rather than for how full it is. It reads in a glance, it reads at
3am, it is honest about having two directions, and it costs less to draw than
an arc. Medical telemetry made the same choice for the same reason.

That one change would do more for the C grade on the look than any amount of
lighting work, because it changes what the product looks like it *is*. Right
now it looks like a wellness tracker with unusually good content. A needle on a
scale looks like an instrument.

**The left rail.** Fifty seven to seventy one simultaneous controls, present on
every screen. This is a 1997 desktop preferences pane. It is already logged as
a cognitive load item in `CLAUDE.md`, which frames it as an architecture
problem. I would frame it differently and more cheaply: it is a **category**
error, not a volume one. Those are inputs sitting permanently beside outputs.
The blueprint domain grid is a thing you set once. It is parked next to a
reading you consult daily. Move every input into the intake, where the product
already has a surface whose job is taking input, and the rail question answers
itself without an architecture round.

**The ladder as sixteen achievement cards, a streak number and a ledger row.**
This shipped this round and it is the safest thing in the build. Remove the
copy and it is Duolingo. The engine underneath is careful and good: the streak
runs from the most recent day practised rather than breaking at midnight, the
ledger separates what happened from what is true, and `ladderRead` deliberately
refuses to enumerate the unearned. All of that is right. The rendering is a
trophy shelf.

**What replaces it, and it is native.** A mark in this product is always earned
*somewhere*. First clearing happened at an address. First release at the
throat happened at the throat. `meterFirst` already records the address and the
seat and the date and explicitly declines to make it a claim about the person.
So the record is not a shelf, it is a map with dates on it. Put the marks on
the body and on the wheel, at the addresses where they were earned, and the
record becomes the one thing a trophy case can never be: a picture of where you
have actually been. Same data, same engine, one renderer.

**The release run overlay.** A progress bar, a count, a pause button. That is a
meditation app player. More on this in pass three, because the problem with it
is not that it looks ordinary.

**The match game.** A memory matching game is the most ordinary interaction in
the file. `The letting go run` is fine and is native, because it deals from the
person's own field. The match is filler and should go.

**The Knowledge deck.** Cards in a grid with a search box and filter chips. It
is a better list, and it is still a list. What is native is already half built
elsewhere: the drills reach the codex from the thing being read. A reference
you arrive at from a finding is a different object from a reference you browse.
The deck should be what the drills open into, not a destination in the tab bar.

**The story textarea with a word count and a Commit button.** The highlight
layer behind the text, colouring matched words by seat, is genuinely good and I
want to be clear that it is not on this list. The frame around it is a notes
app. "Commit 0" is the worst label in the product: it reads as a transaction
count and it turns telling the truth about your day into a submit action.

---

## Pass three. Is reading your own body an interaction, or is this a dashboard
with a body picture on it

### The honest answer

It is a dashboard with a body picture on it. I want to be precise about the
evidence rather than rhetorical, because the body page was rebuilt this round
and the rebuild was real work.

**The figure accepts no input.** `NERVEBR` is 72 traced polylines in the
figure's coordinate space, each tagged with its seat. That is hit geometry. It
is in the file, it is paid for, and it is currently used only to set an
opacity. The pain map is region buttons. You cannot point at where it hurts.

**Nothing in the product takes a reading from the body.** Every input is
typed text, a slider, a dropdown or a date. A product whose first sentence is
"a somatic diagnostic instrument" collects no somatic data at all. It collects
a person's *account* of their body, which is a different and much older thing.

**The one moment of contact measures nothing.** This is the finding of the
pass and it is worth stating on its own.

`DECISIONS.md` carries a ruling from the owner, in his sequence: the word lands
and hits the resistance, the person feels a barrier, then a release, then
relief. The order is fixed and the copy may not reorder it. The Games tab says
it out loud to the person: "What your body does as you read is the data."

Then the release run puts a line on screen, waits `RUN.speed` seconds, and
advances. It is a teleprompter. It asserts that resistance happened, it draws a
progress bar, and it collects nothing. The instrument states that the body's
response is the data and then does not take the reading.

That gap is not a missing feature. It is the product's own thesis going
unmeasured at the exact moment it is available at native resolution and for
free.

**Everything is measured before and asserted after.** Story in, reading out.
Release runs, reading changes by arithmetic. At no point does the person's
behaviour during an act feed back into what the instrument believes. Compare
any real instrument: an oscilloscope reads continuously, telemetry reads
continuously, a sonar waterfall is nothing but continuous reading. This reads
twice and interpolates.

### What has already been tried, here and elsewhere

Worth saying what the failures are, because this is the part of the map people
skip.

- **Wearables solved the continuous somatic read and lost the meaning.** HRV,
  EDA and respiration are trivially available and tell you almost nothing about
  what a person is carrying. That road is closed and it is correct that this
  product did not take it. It also requires network and hardware, which the
  constraints forbid.
- **Biofeedback breathing games.** Twenty years of them. They work as
  regulation and fail as diagnosis, because the measurement and the
  intervention are the same signal.
- **Body scan audio, in every meditation app.** Passive. Collects nothing.
- **What has not been tried, and is the open ground:** using *reading latency*
  as the somatic channel. How long a person takes with a line, where they stop,
  what they reread, what they skip. It is free, it needs no sensor, no network
  and no permission, it is available only during an act the product already
  performs, and it is the one signal in this space that is about the specific
  words rather than about arousal in general. The closest prior art is not in
  wellness at all, it is in reading research and in eye tracking, and nobody
  has brought it here.

That is proposal two below and I think it is the most important thing in this
document after the path.

---

## Pass four. The loop. What brings somebody back tomorrow that is not a streak

### The ordinary version, named, and it just shipped

A streak, sixteen marks, a ledger, and a points ladder in scope. That is the
2014 answer and every product in this category has it. It works, at a cost the
research already priced: it manufactures a reason to open the app that has
nothing to do with the app being useful. On a product that reads a nervous
system, a streak also does something specific and bad. It gives a person a
reason to record a practice they did not do.

### What is native, and it is already written down and thrown away

**The product makes a dated, falsifiable prediction about the person's body and
never checks it.**

`release.js`, in the copy shown at the end of every run:

> Release empties the address. The coherent opposite is installing on the same
> pass. The rebound is day four and a half. Completion is day twenty seven.

That is an appointment. It is specific, it is dated, it is checkable, and the
product prints it once and forgets it. On day five the instrument owes this
person a question, and on day twenty seven it owes them an answer.

This is the loop. It inverts the direction of obligation. A streak is the
person owing the app. A forecast is the app owing the person. Nobody in
wellness ships a dated prediction because being wrong in public is expensive,
which is exactly why it is available ground.

It also answers the panel directly. Marcus, the ICP whose reaction is RESIST
on every question in `RESEARCH-icp.md`, says: "I expect to get something I can
argue with. If it is unfalsifiable I have learned nothing. Give me a claim
specific enough to be wrong." He is describing this feature. Diane says "show
me a number I do not already have." Derek says "name the one thing capping my
output and I will train it like anything else." A dated forecast with a scored
outcome serves all three, and the two who want recognition rather than cost,
Angela and Sofia, are not harmed by it because it is a second surface and not a
different reading.

**Second native loop: the instrument's error log.** If it forecasts, it should
keep score of itself and show the score. An instrument that publishes its own
hit rate is trustworthy in a way that no privacy policy can buy, and this is a
product whose entire commercial position is that it does not sell you. "This
instrument has made 14 forecasts on you and been inside its own interval 9
times" is the most persuasive sentence this product could ever print, and it
cannot be faked by a competitor without building the forecast first.

**Third native loop, and it costs nothing by ruling.** Rerunning opened ground
is free. So re-reading a story from six weeks ago through the field as it is
now is free, and the diff is a real finding: same words, different route,
different addresses. That is a reason to return with no counter attached to it.

**Fourth: the deficit.** `accuracy()` already knows the cheapest next
measurement. "Plus or minus 12.1. Four more laws would take three minutes and
narrow it to plus or minus 9." That is a next action that is not a nag, because
it is about the instrument and not about the person.

### What I would not do

Points, badges beyond the sixteen, and push notifications for ritual
accountability are all in scope by ruling and none of them is my call. I will
say the one thing that is mine: a push notification on this product is a
machine telling a person to go and feel something. Everything else in the
product refuses to instruct a person to feel. `DECISIONS.md` says a route, not
an instruction to feel something. A notification that says "time for your
practice" breaks that ruling from outside the app where no gate can catch it.
A notification that says "the instrument forecast a rebound today, and it is
ready to find out whether it was right" does not. Same channel, and only one
of them is this product.

---

## Pass five. The thing this product could be that nobody has asked for

### The version nobody has shipped

**An instrument that draws the route a sentence takes through a body, and then
keeps score of its own predictions about that body.**

Two halves, and they are the same idea at two time scales. In the moment: you
wrote a sentence, and here is the walk it took, in order, through named
anatomy, with the place it caught marked. Over weeks: here is what the
instrument said would happen, here is what happened, here is how often it has
been right about you.

Nothing in this category does either. Almost nothing in software does the
second at all. The closest things are not products, they are instruments:
seismographs, which record and are judged by the record; and weather models,
which are the only widely used forecasting systems that publish their own skill
scores.

The reason only this product can do it is boring and decisive. It needs a parser
that reads charge out of prose at word resolution, an address book of 112 named
anatomical locations, traced geometry in the same coordinate space as the
figure, a poled model that knows both what is held and what is installed,
cooldown arithmetic with named day counts, and a snapshot history to check
against. All six exist in this repository and all six were built for other
reasons.

### Two ideas I want and am refusing

I will not propose these, and I am writing them down so nobody spends a round
rediscovering them.

**Sound.** There is no audio anywhere in the file. A sound director sits on the
team with nothing built. My instinct is to sonify the field, nine axes as nine
intervals, coherence as consonance. I am refusing it because I cannot answer
the question I hold everybody else to. It does not make any reading more true.
It makes the product more atmospheric, and atmospheric is the house style of
the AI smooth perfection this product is supposed to be the counter signal to.
If sound ever enters, it enters as a metronome for the release pace, which is
functional, and not as a mood.

**Reading another person's words.** The parser would happily take the email
your colleague sent you and tell you what charge is in it. It is the obvious
extension and it is a different product with a different ethics. `DECISIONS.md`
already forbids a cohort lead from seeing the story cloud for reasons that
apply with more force here. Refused, permanently, and not because it is hard.

---

# The twelve

Ranked by value to the person times novelty, over cost. Sizes are against this
codebase, not in the abstract. Every one is costed against the standing
constraints: one file, no dependencies, 60fps floor, engine stays host free,
never a count against a total, no soft wellness language.

---

## 1. The path. Draw the route the sentence takes

**What it is.** `pathOf()` already returns the ordered walk of a sentence
through named anatomy with measured coordinates. Draw it on the body figure as
a line with numbered stops, mark the kink and the floor, and let a tap on a
word in the story jump the marker to the seat that word landed on and back.

**Why only this product can do it.** It needs word level offsets from a charge
parser, 112 addresses seated at named nerves, and 72 traced branches in the
figure's own coordinate space. No other product in this category has one of the
three. The function is already written, tested and returning `span`, `net`,
`drop`, `rise`, `dwell`, `kink` and `floor`.

**Cost.** Small to medium. `ui/map.js` gains a polyline layer, `ui/storyui.js`
gains a two way link between the highlight layer and the figure. No engine
change, no new data, no new table. Under thirty steps in a typical entry, so
the draw is free at 60fps.

**Constraint check.** Engine untouched, so host free holds. No count against a
total: the path prints an order and a distance, never "18 of 24 words".

**What would have to be true for this to be a bad idea.** That the route is
noise. It is derived from a keyword parser, so a long entry could produce a
scribble rather than a line. Test before advocating: run the thirty existing
reference stories through it and look at the shapes. If they are all the same
shape, it is measuring the lexicon and not the person, and it dies in an
afternoon, which is the right price.

**Retention.** This is the screenshot. Marcus, RESIST on everything, says what
gets him in is "one screenshot of the instrument that is clearly not a
template." This is that screenshot and there is not a second candidate in the
build.

**Grade delta.** Look C to B minus on its own. It is the first thing on screen
that could not be a different product.

---

## 2. The barrier, measured during the run

**What it is.** During a release run, measure how long the person stays with
each line before advancing, and give them one control: this one caught. The
run stops being a timer and becomes advance on your own pace, with the pace as
the reading.

**Why only this product can do it.** The owner has already ruled that
resistance on the first read is the line working, in a fixed order that the
copy may not change, and the product already tells the person that what their
body does as they read is the data. It is the only product that has both a line
by line release run over named addresses and a stated theory that the response
to each line is the measurement. Everyone else's timer has nothing under it to
attach a latency to.

**Cost.** Medium. `ui/release.js` changes from an interval timer to an advance
control with a timestamp. The engine gains a pure function taking the collected
dwell times plus the plan, so host free holds exactly the way `ladderRead`
already does, by having the caller pass the moment. One additive schema field
on the run log. `validateProfile` gains one entry.

**Constraint check.** No new dependency, no network. The measurement never
becomes a score: it reports which addresses caught, never a total or a
percentage of lines resisted.

**What would have to be true for this to be a bad idea.** That latency is
measuring reading speed rather than resistance, which it partly is. Mitigation
is inside the data: the same person's own baseline across their own run is the
comparison, never anybody else's. If within person variance is flat across
addresses, there is no signal and it is deleted. Also, and this is the real
risk, self advance turns a two minute run into a five minute run for some
people. That is either the point or a drop off, and only a test tells you.

**Retention.** It makes the run the thing worth doing rather than the thing you
sit through, and it gives the forecast in proposal three something to be
forecasting from.

**Grade delta.** It is the first time the instrument touches the person rather
than describing them. On its own it moves nothing visual and it moves the
product's honesty a long way.

---

## 3. The forecast, and the instrument's own error log

**What it is.** The rebound at day four and a half and completion at day twenty
seven are already printed as fact. Record them as a dated forecast against the
specific addresses released, and on those days ask one question and score the
instrument. Then show the running hit rate.

**Why only this product can do it.** It requires cooldown arithmetic with named
day counts, a snapshot history, and addresses specific enough that the
prediction is about something rather than about a mood. All three exist.
`relCoolDown` already writes the log with `w0`, `d`, `w1` and `cleared` per
address. Nobody else in this category will publish a falsifiable claim, which
is precisely why the ground is empty.

**Cost.** Medium. A new pure engine module, `forecast.js`, on the pattern of
`ladder.js`: the caller passes the moment, the module holds no dates of its
own. One additive schema array. One surface, which should live on the compass
beside the record because the record is already the "what happened" surface.

**Constraint check.** Host free by construction. The hit rate is a count of
events that happened, which `ladder.js` already establishes as permitted, and
it is a count about the instrument rather than about the person, which makes it
the safest count in the product. No soft language: "forecast", "due",
"checked", "inside interval", "outside".

**What would have to be true for this to be a bad idea.** That the instrument
is mostly wrong. If the hit rate comes back at chance, the product has just
published evidence against its own arithmetic. I think that is a reason to
build it rather than not to, but the owner should agree to that before it
ships, because it cannot be quietly withdrawn afterwards. Second risk: asking a
person on day five how they are is the most ordinary check in wellness. The
question has to be about the specific address, not about how they feel.

**Retention.** This is the loop. It is a dated appointment the instrument owes
the person, and it survives the streak being deleted.

**Grade delta.** It is the only proposal here that changes what the product
*is* rather than what it shows. Category position moves from instrument to
instrument with a track record, and nothing else in wellness holds that ground.

---

## 4. The law is the gap, not the number

**What it is.** Every law is asked three ways: when it costs you, when nobody
would know, on an ordinary day. The product renders a law as one number with
the spread as a grey subtitle. Invert it. A law renders as three points on a
short scale with the gap drawn, because the gap is the measurement and the mean
is the byproduct.

**Why only this product can do it.** Nothing else asks the same question three
times under three costs on purpose, and `iqScore` already refuses to name a
lean under a spread of three because that is inside self report noise. An
instrument that declines to read what it cannot see has earned the right to
draw what it can.

**Cost.** Small. `ui/intakeui.js` and one drill in `ui/drills.js`. No engine
change, `iqScore` already returns `spread`, `reliable` and `lean`.

**Constraint check.** A three point scale with a gap is a position, not a fill,
so it is on the right side of the count against a total ruling, unlike the ring
it replaces.

**What would have to be true for this to be a bad idea.** That people cannot
read it. Twenty one small multiples of a three point range is a dense screen
and this product already has a cognitive load problem. It is a case for a
sparkline treatment rather than twenty one charts.

**Retention.** It is the thing to argue with, which is what the hardest ICP in
the panel asked for by name. It also makes finishing the intake pay off
visibly, which is the measured difference between 31 percent and 68 percent
completion.

**Grade delta.** Small on look, real on the intake, which is currently the
weakest surface in the product and is Block 9, still OPEN.

---

## 5. The deficit sentence

**What it is.** Replace the accuracy percentage badge with one sentence that
names the interval and the cheapest thing that would narrow it. "Plus or minus
12.1. Four more laws is three minutes and takes it to about 9."

**Why only this product can do it.** `accuracy()` is a fitted model with named
terms, not a confidence adjective. It knows that law coverage is worth 28
points, that held signal saturates at about eight addresses, and how far each
term currently is from full. Almost every product in this space either prints a
confidence number with no decomposition or prints none at all.

**Cost.** Extra small. One function in the engine that ranks the four terms by
points per minute of the person's time, and one string. `accuracy()` already
returns every input it needs.

**Constraint check.** No count against a total. It is an interval and a next
step, never a completion.

**What would have to be true for this to be a bad idea.** That it reads as a
nag, or that it reads as the product asking for more data for its own benefit
on a product whose whole promise is that it does not. The wording carries the
whole risk and it is the narrative director's call, not mine.

**Retention.** It is the only next action in the product that is about the
instrument rather than about the person, which makes it the only one that does
not feel like homework.

**Grade delta.** Small, and it is the cheapest item on this list by a wide
margin.

---

## 6. Re-read. Your own words through the field as it is now

**What it is.** Take any stored story and run it through the current field.
Show the two routes side by side: the sentence you wrote six weeks ago, the
addresses it landed on then, and the addresses it lands on now.

**Why only this product can do it.** It stores the raw text, the parse is a
pure function of text plus field, susceptibility is recomputed per profile by
`suscAll`, and rerunning opened ground costs nothing by ruling. The finding is
only available to a product where the reader changes and the text does not.

**Cost.** Small. `ui/record.js` and `ui/storyui.js`. No engine change.
`parseStory` is already pure with respect to everything except the current
field, which is the point.

**Constraint check.** Nothing new. No count. The diff is described, never
scored.

**What would have to be true for this to be a bad idea.** That the diff is
usually nothing, because susceptibility moves slowly. Cheap to test: load a
reference case, apply six stories, and diff story one before and after. If
nothing moves, it is a two hour loss.

**Retention.** A reason to come back that has no counter in it, and it gets
stronger with tenure, which is the opposite of a streak.

**Grade delta.** None on look. It is a retention and a meaning item.

---

## 7. The scrubber. The field is a 39 number vector and undo already records it

**What it is.** `UNDO` holds every input state with a label and a timestamp,
unlimited by the owner's ruling: nine charges, nine installed opposites, twenty
one laws, the soul. That is a complete record of the field's inputs. Turn it
from a button into a track you can drag, with the wheel, the body and the
reading all moving as you drag.

**Why only this product can do it.** Everything downstream is a pure function
of that vector, which is stated in the architecture and enforced by
`undoApply`. Very few products can restore a whole application state from 39
numbers. This one already does, once per click, and calls it undo.

**Cost.** Medium, and almost all of it is UI. The engine work is done. The one
real risk is frame budget: a full `compute()` plus the saboteur and complex
chain per frame during a drag. The honest build is to redraw the wheel and the
body during the drag and run the full render on release, which is the standard
scrub contract anyway.

**Constraint check.** Engine untouched. No dependency. Reduced motion gets the
end state, per the Bible.

**What would have to be true for this to be a bad idea.** That `compute()` will
not run inside a frame. That is measurable in ten minutes and should be
measured before anything is built. Second: a scrub across states that were
never real readings could show a person a field they never had. The track has
to be labelled with the change names that `undoPush` already stores, so what is
being scrubbed is a sequence of acts and not a continuous history.

**Retention.** It turns the largest safety feature in the product into the way
you read your own history, which is a much better job for it.

**Grade delta.** Look C to C plus. Motion as a functional layer rather than
decoration, which is the tracked trend and the one this product has real
material for.

---

## 8. Say how much of this is still just what you told us

**What it is.** A stated four letter type writes charge onto the nine axes and
`seedShare` reports how much of the field is still that seed. Put that number
on every reading as a visible qualifier until the person's own material
displaces it.

**Why only this product can do it.** It is the only instrument here that
separates what a person asserted about themselves from what it measured, and
that already has the arithmetic to say what fraction is which. Every other
product in this category takes a self report and returns it as a finding
without marking the difference.

**Cost.** Small to medium. `seedShare` exists and has one caller in
`ui/intakeui.js`. It needs to reach the reading surfaces, and the decay policy
is a named open item that the owner has to rule before the number means
anything stable.

**Constraint check.** No count against a total, because it is a share of the
field and not a progress bar. Blocked on a ruling, which is stated rather than
guessed.

**What would have to be true for this to be a bad idea.** That it undermines
the reading on day one, when the seed share is highest and the person is
deciding whether to trust the product at all. That is a real risk and the
honest answer is that it is also true, and the alternative is showing somebody
their own Myers-Briggs answer back and calling it a measurement.

**Retention.** It is a visible reason for the field to become more yours over
time, which is a progression that is not a ladder.

**Grade delta.** None on look. It is the single strongest honesty move
available and honesty is this product's commercial position.

---

## 9. Escalation. A saboteur is a band you leave

**What it is.** `SAB33` keys on ranges with ceilings. Render the 33 as a ladder
of bands with the person's own charge as a line crossing them, so a person can
see which one they have just left and which one they are approaching.

**Why only this product can do it.** It is the only saboteur library keyed on a
band with a top rather than a threshold. Everybody else's is a floor, which can
only ever say more or less.

**Cost.** Small to medium. One drill and one knowledge deck view. No engine
change: `sab33Detect` already returns `score` and `exact`.

**Constraint check.** A position on a ladder, never "you have 12 of 33". This
must be watched carefully in the build because the shape invites a count.

**What would have to be true for this to be a bad idea.** That seeing the
heavier saboteur one band up reads as a threat. That is a real hazard on a
product whose buyers at level 4 in `BUYERS.md` avoid the work because the work
hurts. The mitigation is that both directions are always drawn, so the band
below is as visible as the band above.

**Retention.** It makes movement legible without a score, which is the problem
the ladder was invented to solve and did not.

**Grade delta.** Look, small. Meaning, large: it is the difference between a
label and a mechanism.

---

## 10. Overshoot as its own reading

**What it is.** `n.jq` measures the coherent opposite installed past the point
where it serves, at every somatic address, and folds into integrity
negatively. Give it its own surface: where the cure has become the problem, on
the body, with the same figure and the opposite polarity.

**Why only this product can do it.** It models installing as well as releasing,
so it is the only one that can measure overinstalling. Every other instrument
in this space treats the positive pole as unbounded.

**Cost.** Small to medium. The arithmetic is done. It is a second layer on the
body figure and one drill.

**Constraint check.** No new engine work, no new dependency.

**What would have to be true for this to be a bad idea.** That it reads as the
product punishing progress. "You got better at this and now that is also
wrong." The copy carries all of the risk and the framing has to be that the
dose is what changed, not the person.

**Retention.** It is the one reading that stays interesting for a person who is
doing well, which is the segment the product sells hardest to and currently
serves worst: `BUYERS.md` puts the buying probability at 85 to 100 percent for
levels 7 through 10, and there is nothing in the product aimed at them.

**Grade delta.** Look, small. Strategic value, high, because it extends the
product's useful life past the point where a person's charge comes down.

---

## 11. Paint the nerve, and make it a query

**What it is.** Block 8 already asks for paint to select on the figure. The
thing that makes it native rather than a pain map: `NERVEBR` is 72 traced
branches, each tagged with its seat, and every seat feeds named addresses. So
painting a region is not a symptom log. It is a query against the address book:
here is what is loaded on this nerve.

**Why only this product can do it.** The traced geometry and the address book
are in the same coordinate space and were built to be. Every other body map in
this category paints on a picture.

**Cost.** Medium. A point in polygon or nearest branch hit test against 72
polylines, which is trivially inside frame budget, plus the layer and the
result panel. `ui/map.js`.

**Constraint check.** No dependency. The hit test is a loop over about 1,300
points, which is nothing.

**What would have to be true for this to be a bad idea.** That people paint
where they think the problem is rather than where the sensation is, which
turns a somatic input into another self report. This is the one proposal here I
would tissue test with real people before building, because the failure mode is
invisible from the code.

**Retention.** It is the only proposal that gives the body figure an input, and
the product cannot keep calling itself somatic while the figure is read only.

**Grade delta.** Body page, D to C plus on its own. It is the thing the owner
went looking for.

---

## 12. The waterfall

**What it is.** The compass currently says "30 day oscillation, no readings in
this window" beside an empty box. Replace the empty box with a sonar style
waterfall: nine axes as nine columns, time scrolling downward, each cell
coloured by the seat and lit by the charge. One canvas.

**Why only this product can do it.** It has nine poled axes with a fixed colour
system already argued from autonomic response, and a snapshot written on every
story commit and every release. The form matches the data exactly: many
channels, one time axis, no aggregation. It is also the correct prior art to
steal from, because submarine waterfall displays were designed for a person
watching for hours who must notice a change without being told about it, which
is the same job.

**Cost.** Medium. One canvas, one draw, `ui/cone.js`. No engine change,
`snapshot()` already stores what it needs.

**Constraint check.** One canvas, no dependency. At 30, 90 or 365 columns it is
a single image drawn once per change, so 60fps is not even in question.

**What would have to be true for this to be a bad idea.** That a new person has
no history and the surface is empty for weeks. It is empty today, so this is
not a regression, but it argues for the waterfall being the *second* thing on
the compass and not the first.

**Retention.** It is the surface that rewards tenure, and it is the only
answer in this document to "am I improving" that is not a number going up.

**Grade delta.** Compass D plus to C plus. It is also the strongest single
answer to the owner's character and stylization note, because a waterfall
reads as an instrument at a glance and nothing else in the file does.

---

# What to kill

**The ring plus pill badge, as the universal rendering of a reading.** It is
the most copied component in the category and it contradicts the product's own
ruling that a reading is never a count against a total. Replace with a scale
and a needle. This requires the owner to move one of two Bible rulings and I
am arguing which. It is the single largest available move on the C grade and
it costs one component rewrite in `ui/component.js`, which every surface
already goes through.

**The left rail, as a permanent fixture beside every reading.** Not because it
is too big, because it is the wrong category of thing. Inputs belong in the
intake. Move them and the load problem resolves without an architecture round.

**Sixteen achievement cards.** Keep `ladder.js` entirely, it is careful work.
Kill the trophy shelf rendering and put the marks on the body and the wheel at
the addresses where they were earned. `meterFirst` already records the address,
the seat and the date.

**"The match".** A memory matching game. Cut it. "The letting go run" is native
and should be the whole tab, or the tab should fold back into Knowledge.

**"Commit 0" as a button label.** It makes telling the truth about your day a
transaction with a counter on it. It is also the only place in the product that
prints a number that means nothing to the person reading it.

**Knowledge as a top level destination.** Keep the deck. Make it what the
drills open into. A reference you arrive at from a finding is a different and
better object than a reference you browse, and this product already has the
better one half built.

**The release run as a timer.** Replaced by proposal two, not deleted. A timer
that asserts resistance happened without measuring it is the ordinary version
of the one thing this product could uniquely do.

---

# Grade

**How inventive the product is now: C plus.**

The engine is inventing at a genuinely high level and almost none of it reaches
a person. Six original mechanisms are computed and zero are the primary
rendering of anything. What a stranger meets is a competent, careful, well
written dashboard with unusually good content, and I can name four other
products it would be mistaken for. The plus is entirely for the story
highlight layer, the felt sense ruling, and the fact that `pathOf` exists at
all, which is somebody in this codebase reaching for the right thing and then
correctly refusing to let it touch the arithmetic.

**Ceiling: A minus.**

Not A, and the reason is worth stating. The constraints are a generator here
rather than a limit: one file, no network and no backend is the Obra Dinn
constraint, and it is why this can be an instrument instead of a service. What
caps it at A minus is that the product's deepest claims are not checkable
inside the file. An instrument that forecasts and scores itself would reach A,
and the forecast needs weeks of a person's real time to become evidence. That
is not a build problem and it is not solvable by anything in this document. It
is the one thing that only shipping can buy.

Three things move it from C plus to B plus, and they are proposals one, two and
three. They are also, not by coincidence, the three that make the instrument
touch the person rather than describe them.
