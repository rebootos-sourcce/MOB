# Onboarding And The Tutorial. Twelve Questions

Dani Sorensen, UI UX architect. 19 September.

You asked to be asked. Twelve questions, each answerable with a sentence or a
choice. Every one of them is a thing I cannot decide for you and a thing that
changes what gets built. Anything I could settle myself is not in here.

My working is underneath, starting at section 2. It exists so the questions
are worth your time, not so you read it. The first run is the real subject and
it is section 3.

Measured against commit `0617b78`, md5 `615ce6837e29f62565b6df61548e3e43`, real
Chromium, blank profile, 1600 by 1000 and 390 by 844.

---

## 1. The Questions

### Q1. Where does a stranger land

**The question.** On a cold open with nothing entered, is the first screen the
Field, the Summary, or a finished reading of a named case who is not them.

**Why it is yours.** You ruled Summary in the user journey pass and
`DECISIONS.md` records it. The code opens on Field. `atuned_src/engine/core.js`
line 140 sets `tab:TAB.FIELD` and that is what a real browser does. One of the
two has to move and only you can say which. The third option is new since that
ruling: `reviews/funnel-strategy.md` argues the strongest asset the product
owns is the instrument working on somebody else, and thirteen worked cases
already boot.

**My default if you do not answer.** Summary, because your ruling exists and
the Summary cold screen is measurably the better one. It refuses, says why,
and gives the four doors at full width.

**Live options.**
- *Field.* Forfeits the four seconds. A stranger meets a wheel with seven
  dashes in it and thirty unlabelled glyphs beside it. This is today.
- *Summary.* Forfeits the demo. The strongest proof the product has stays
  behind a dropdown labelled Profile.
- *A loaded case, then the refusal.* Forfeits the clean slate. The person's
  first impression of their own field is somebody else's, and you have to
  decide how they get out of it.

---

### Q2. What counts as day one done

**The question.** Name the single thing a person must have done for the first
session to have worked.

**Why it is yours.** Everything downstream is arithmetic once this is fixed:
what onboarding drives at, what the tutorial ends on, what gets instrumented,
what a notification is allowed to nag about. Nothing in the repo states it.

**My default.** One story written and applied, because it is the only input
that moves identification materially, 20.8 percent to near 79 on a full
profile.

**Live options.**
- *A story applied.* Forfeits the people who cannot write one, which the
  product's own door copy says is most people.
- *Nine sentences read and one recognised.* Forfeits depth. It is the cheapest
  possible yes and it barely moves the reading.
- *One release completed.* Forfeits reach. It is the true loop and the
  flagship, and it is unbuilt.
- *All sixty three answered.* Forfeits day one. Fifteen minutes is not a first
  session, it is a commitment.

---

### Q3. What may onboarding ask for before it gives anything

**The question.** Does the product take anything from a stranger before it has
put a number on the screen, and if so what.

**Why it is yours.** Today Energetics opens on a form asking first name,
middle, last, sex at birth, date of birth, time of birth and place of birth,
and the save control is disabled with the line "Enter a name or a date of
birth first." That is the product's current answer and it was not a decision.
The accounts fork adds an email to the same seam.

**My default.** Nothing. Not a name, not a birth date, not an address. The
number comes first and the asking comes after.

**Live options.**
- *Nothing first.* Forfeits the spiritual layer on day one, which cannot run
  without date, time and place.
- *A first name only.* Forfeits almost nothing and buys the ability to address
  the person. It is the cheapest ask in the set.
- *Birth data first.* Forfeits Diane and James at the door. Both walk at an
  ask placed before a payoff, and it is already the recorded reason they walk
  in the funnel.

---

### Q4. Is the tutorial a thing you can finish, or a thing that never announces itself

**The question.** Does the tutorial appear as a tutorial, with a beginning and
an end and a skip, or does it live as a hand on the elbow that never names
itself.

**Why it is yours.** You said the tutorial turns off once seen, which implies
a thing with an end. You also said maximum flow with no burden, which points
the other way. Nielsen Norman measured seventy people across four apps and
found that people who read the tutorial rated the app easier to use at 4.92
against 5.49 for the people who skipped it. A tutorial makes a product feel
harder. That is the trade and it is a positioning call.

**My default.** No named tutorial. The product teaches through consequence,
the way the `Portal` and `Half-Life 2` openings do, and Knowledge carries the
one explicit walkthrough for anybody who wants it.

**Live options.**
- *Named and finishable.* Forfeits the four seconds and some of the instrument
  posture. Buys completion you can actually measure.
- *Unannounced and contextual.* Forfeits measurability. You cannot report a
  completion rate on a thing with no end.
- *Both, with the named one opt in.* Forfeits build time. It is two things.

---

### Q5. Does the tutorial spend real charge

**The question.** When the walkthrough reaches the release, does it release on
the person's own field, or on a sandbox that is thrown away.

**Why it is yours.** Undo is unbuilt and you have it listed as the largest
remaining gap in the product. A tutorial that releases for real is
irreversible on somebody's first session. A tutorial that releases on a
sandbox teaches the motion and not the consequence, and consequence is the
entire argument for `Dark Souls` as a teaching model.

**My default.** Real, on their own field, and the tutorial does not start
until undo exists.

**Live options.**
- *Real, undo first.* Forfeits schedule. The tutorial waits on A5.
- *Real, no undo.* Forfeits trust the first time somebody regrets it, and it
  is the one kind of regret this product cannot afford.
- *Sandbox.* Forfeits the lesson. Alexander was specific that the walkthrough
  has to reach the release, and a rehearsal does not reach it.

---

### Q6. Warm, or mechanical

**The question.** In onboarding specifically, which of your two rulings wins.

**Why it is yours.** `TASKS.md` records your instruction for onboarding as
"warm and inviting: this is for you, to return yourself to your own state."
`BIBLE.md` and `CLAUDE.md` rule mechanical and precise, short sentences, no
soft wellness language, physical metaphors only. Both are yours. In the
onboarding copy they collide on every line and a writer cannot start without
the answer.

**My default.** Mechanical everywhere, and warmth carried by what the product
refuses to do rather than by adjectives. The refusal paragraph on the cold
Summary is already the warmest thing in the build and it does not contain one
warm word.

**Live options.**
- *Mechanical.* Forfeits Angela, who is level 4 and wants to be met.
- *Warm in onboarding, mechanical after.* Forfeits consistency. The voice
  changes at the exact moment the person starts trusting it.
- *Warm throughout.* Forfeits Marcus, and Marcus is the beachhead.

---

### Q7. Is the length stated before the first question

**The question.** Does the product say sixty three and fifteen minutes up
front, or does it let a person start and find out.

**Why it is yours.** It is an honesty position with a price attached and the
price is measured. The panel in `RESEARCH-icp.md` finishes at 31 percent with
no stated duration and no visible remainder, 60 percent with both, and 68
percent with the three way design named in one line. Outside the repo, survey
research puts completion at about 42 percent once a form passes fifteen
questions, and abandonment climbs sharply around sixty.

**My default.** Stated, plus the one line about each law being asked three
ways. It is worth roughly thirty points of completion on the panel and it
costs one sentence.

**Live options.**
- *State it.* Forfeits some starts. Fifteen minutes scares people off at the
  door instead of at question forty.
- *Hide it.* Forfeits finishers, and the drop lands at the most expensive
  possible place, which is after the work has been done.
- *Split it.* Forfeits the spread. Twenty one on day one and the rest later
  breaks the three way design that makes the reading a reading.

---

### Q8. Four doors, or one

**The question.** Do the four ways in stay equal, or does one of them become
the front door with the other three folded behind it.

**Why it is yours.** Ranking them is a statement about what the product is
for, not a layout preference. Today all four carry the same weight, the same
size and the same visual treatment, and they sit in the right rail.

**My default.** Rank them. Write what happened is the front door at full
width, and the other three sit under one line that says what they are for.

**Live options.**
- *One front door.* Forfeits the people the other three exist for, and the
  door copy says outright that is most people.
- *Four equal.* Forfeits the decision. Four equal choices at the moment of
  least context is the most expensive place in the product to put a choice.
- *Two and two.* Write what happened and read nine sentences up, the other
  two folded. Forfeits the avatar, which is the only one that points forward
  rather than back.

---

### Q9. Where does the somatic opener sit

**The question.** Turn the senses inward, feel yes and no. Is that before the
doors, behind one of them, or somewhere else entirely.

**Why it is yours.** You asked for it. Nobody has said where it goes, and
where it goes decides whether it is the product's first impression or a tool
inside it.

**My default.** Behind a door, as a fifth way in, not in front of everything.
A stranger at four seconds does not yet trust the product enough to close
their eyes for it.

**Live options.**
- *First, before anything.* Forfeits Marcus and James in four seconds. It is
  the single most wellness looking move available.
- *A fifth door.* Forfeits its power. It becomes an option rather than a
  frame.
- *At the end of the first session.* Forfeits the framing job it was meant to
  do, and buys a closing move that is genuinely good.

---

### Q10. Does the bar start whole

**The question.** On day one, does a person see all eight surfaces, or does
the bar grow as they earn it.

**Why it is yours.** This is the cognitive load decision and `CLAUDE.md` names
it as architectural and needing a ruling before anything is built. Measured
on this build, the Field carries 71 simultaneous choices in a 1600 viewport
and Knowledge carries 95. The working floor is under 12. It is also in direct
tension with your own standing ruling that a control is never hidden without
an affordance.

**My default.** The bar starts whole. Growth is applied inside the surfaces
instead, with the left rail folded on day one and unfolding on first use.

**Live options.**
- *Whole bar.* Forfeits the load reduction. Day one stays at 71.
- *Growing bar.* Forfeits your no hidden control ruling unless each locked
  surface shows what unlocks it, which is a visible affordance and therefore
  allowed, but it is a whole new state to design.
- *Whole bar, folded rails.* Forfeits some of the at a glance logic you ruled
  for the four screen zones, because a folded rail is not at a glance.

---

### Q11. Do the two arrivals get the same onboarding

**The question.** A person who has finished the web quiz and a person who
opens the app cold are two different strangers. Same onboarding, or two.

**Why it is yours.** The fork to accounts is yours and this is its first
concrete consequence. The quiz arrival has twenty one laws answered and a
reading already seen. The cold arrival has nothing. Running one flow for both
means one of them is being lied to about what it knows.

**My default.** Two. The quiz arrival skips straight to the reading it was
promised and gets the tutorial only. The cold arrival gets the doors.

**Live options.**
- *Two flows.* Forfeits build simplicity. Two states, two sets of copy.
- *One flow.* Forfeits the quiz arrival, who is the highest intent person in
  the entire funnel and is asked to start over.
- *One flow that detects.* Forfeits nothing except that it needs the record
  fetch working first, and it is the right answer if M5 is close.

---

### Q12. Is there a day two, and who asks

**The question.** Does the product ask a person to come back, and by what
means.

**Why it is yours.** Push notifications are in scope on your ruling and the
ritual accountability spec is written and unwired. Session design for day one,
day three and day thirty cannot be laid out until somebody says whether the
product is allowed to initiate.

**My default.** Yes on day two, once, and only after a reading exists. Never
before.

**Live options.**
- *Product initiates.* Forfeits some of the instrument posture. An instrument
  that texts you is a different category of object.
- *Person initiates only.* Forfeits the loop. Health and wellness apps lose
  most of their day one cohort by day thirty, and a product that never asks
  is choosing the bottom of that range.
- *The practitioner initiates.* Forfeits reach, because it only works for
  people who have one, and it is the strongest version for those who do.

---

## 2. Onboarding And The Tutorial Are Two Things

You named them as two and they are two. They have different jobs, different
audiences, different lengths and different failure modes, and merging them is
how both usually fail.

**Onboarding is a funnel.** Its job is to get a stranger from four seconds to
a number that is about them. It is measured in drop off. It runs once, it
happens before trust exists, and every second of it is a second where the
person can leave. The correct instinct for onboarding is always to remove.

**The tutorial is a lesson.** Its job is to teach the loop: find a pattern,
release it, watch it change. It is measured in whether the person can do the
thing afterwards without help. It happens after trust exists, because a person
who has seen their own number has a reason to learn the instrument. The
correct instinct for a tutorial is to slow down at the part that matters.

They collide when the tutorial is put in front of the number. That is the
standard product tour and it is the version that measures worse than no
tutorial at all in the Nielsen Norman study. It teaches an interface to
somebody who has not yet been given a reason to care about the interface.

**The sequence that follows from that.** Onboarding ends at the first reading.
The tutorial starts after it and ends at the first release. Q2 fixes which of
those is day one done, and Q5 fixes whether the release in the tutorial is
real.

One caveat. If Q1 lands on a loaded case, the boundary moves: the demo is
doing a teaching job before the funnel job is finished, and onboarding and
the tutorial overlap for about one screen. That is fine and it is worth
knowing before anybody writes it.

---

## 3. The First Run, In Order, As A Stranger

Real Chromium, `executablePath /opt/pw-browsers/chromium-1194/chrome-linux/chrome`,
blank context, no localStorage, no persona loaded. Screenshots read, not
inferred.

### At 1600 by 1000

**Nought to 4.8 seconds.** Black. One small blue dot at the centre of the
screen. No wordmark, no name, no word of any kind. The boot sheet clears at
4776ms measured. The first four seconds, which are the ones that decide
everything, are spent on a dot.

**On open, the app is on Field.** Not Summary. `S.tab` reads 2.
`atuned_src/engine/core.js` line 140 is the cause. `DECISIONS.md` and
`CLAUDE.md` both state the app opens on Summary and both are describing a
build that does not exist.

**What is on the screen.** 71 interactive elements in the viewport against a
working memory of about four and a floor of under 12. Eight tabs. A Profile
dropdown as the second control in the bar, listing fourteen named strangers,
which reads as an account picker and is in fact the best asset in the product.
A left rail carrying thirty unlabelled glyphs under the headings Blueprint
Domains, Primary and Secondary, none of which says what any glyph does. Seven
pill readouts across the top of the stage. A wheel. A right rail.

**What it says.** Fourteen words before the first number, and the first number
is 41, which is Sofia's age inside the Profile dropdown.

**What it prints to somebody who has entered nothing.** CQ correctly shows a
dash. Everything else does not. Orientation 72 and 28. Twenty one laws,
integrity 6.0. Swing 13. DQ 0.0, SQ 0.0, Pole 0.00. Instruments integrity 6.0
and intention 6.0. Archetypes first 26 percent, second 19 percent, third 19
percent. Domains first 100 percent. Fetters 9. Heaviest Root 0.0. Most shut
Truth, at the throat. All nine axes at 0.0 held and 0.0 opposite. The ruling
that a number off a default is a number about the default is enforced in one
place and broken in about twenty.

**What it invites.** The four doors are real, they are well written, and they
are in the right rail underneath two separate statements that nothing has been
read. The invitation is the third thing in the third column.

### At 390 by 844

Same tab, Field. Twenty interactive elements in the viewport. Zero controls
under 44 by 44 across 355 of them, so that floor holds everywhere and is not
a finding.

The bar is cut at "Comp". Knowledge, Games and Summary are off the right edge.
Summary, which is where the doors read best, is the furthest item in the
product from a thumb.

Both rails are gone. The order a person scrolls is: wordmark, a dropdown of
fourteen strangers, a Charge header, three pills reading dash, 0.0 and 0.0,
the wheel, then "not read yet", then "Nothing read yet, so there is no split
to show", and the doors are below all of it.

The wheel's own labels collide. "112 addresses · SQ · 0 loaded" runs across
the Crown label and across a marker.

### Behind Each Door

- **Write what happened.** Goes to Story, focuses the text area. This one
  works.
- **Read nine sentences.** Stays on Field and writes the nine into the right
  rail, where every one of them is truncated. "I do not really believe any
  of...". "I need to be wanted, and I arr...". Nine sentences, none of them
  readable, in a column far under the 50 character measure. The centre stage
  keeps showing the wheel and its dashes.
- **Go year by year** and **Say who you are becoming.** Same shape. The rail
  fills, the stage does not move.

### The Intake, Cold

Energetics opens on "Who This Is". First name, middle, last, sex at birth,
date of birth, time of birth, place of birth, Myers-Briggs. Save and close is
disabled and reads "Enter a name or a date of birth first."

The sixty three sit below that form and the status line reads "0 answered, 63
left · 0 laws measured, 21 still at the default."

### Where Three Named People Stop

- **Marcus, 44, creative director.** Four seconds. Lands on a dashboard of
  dashes beside thirty glyphs with no labels. His break is whether this is a
  template. He stops at the left rail, before he reaches a door.
- **Angela, 36, seeker.** Reads that nothing has been read twice before she
  reads a verb. Takes "Read nine sentences" because it is the one that
  promises not to diagnose her, and receives nine truncated fragments in a
  narrow rail. She stops there, and she is level 4, which is the largest
  population in the grid.
- **Diane, 46, founder.** Goes to Energetics because the bar puts it first, is
  asked for her full name and her birth data before anything has been given,
  and is told she cannot save without one. She stops at the form.

Three ICPs from three levels, three different stopping points, three different
causes. None of them is a copy problem alone.

### The Counts

Simultaneous choices in the viewport, blank profile.

| Surface | 1600 by 1000 | 390 by 844 |
|---|---|---|
| Story | 90 | 22 |
| Summary | 76 | 14 |
| Field | 71 | 20 |
| Body | 65 | 19 |
| Energetics | 84 | 16 |
| Knowledge | 95 | 27 |
| Compass | 81 | 15 |

Working floor is under 12 on a working screen. The desktop range is 65 to 95,
which is worse than the 57 to 71 previously recorded, because Story and
Knowledge had not been counted. Mobile sits at 14 to 27 and is close to
survivable, which says the small screen already made most of the decisions the
large one refused to.

---

## 4. The Constraint. Which Of The Three Comes First

The Field, the intake and the story surface. Ranked, with what it costs to be
wrong.

**The intake must never be first.** Fifteen minutes and sixty three questions
before anything is given is a middle of funnel ask placed at the top. The
panel finishes at 31 percent when duration and remainder are not stated, and
today neither is stated before the first question. Outside the repo, the
sharpest abandonment on long forms lands around sixty questions. Being wrong
here costs about two thirds of everybody who starts, and it costs them after
they have done the work, which is the most expensive place in the funnel to
lose somebody.

**The story surface is second.** It is the highest quality input the product
takes and it moves identification further than anything else. It is also the
highest refusal rate, because writing something true is harder than answering
a question, and the product's own door copy concedes that most people cannot
think of anything they identify with. Being wrong here costs the level 4 and
5 population, which is the largest one.

**The Field is first, and only if it is loaded.** An empty Field is the worst
of the three and it is what ships today: an instrument showing dashes is a
broken instrument, and Marcus reads it as a template in four seconds. A
loaded Field is the best thing the product owns, because a working reading on
somebody who is not you is proof that cannot be faked, and thirteen of them
already render with nothing entered. Being wrong here costs the four seconds,
and the funnel prices the four second bounce at about half of everybody who
arrives.

**So, plainly.** Of the three, the Field. But the honest answer is that the
first screen should be a finished reading, and the cold Summary is the second
screen. That is Q1 and it is the reason Q1 is first.

---

## 5. Who The Stranger Actually Is

From `BUYERS.md`, `RESEARCH-icp.md` and `reviews/funnel-strategy.md`.

The grid peaks at 10, 9 and 8, collapses through 5 and 4, and floors at 1. The
product sells hardest to people already working and is close to unsellable to
the people whose readings are lowest.

The finding that decides the onboarding: **coherence is not targetable.** You
cannot know a stranger's band before they have been read, so the grid is a
post reading segmentation and not a targeting instrument. What exists at the
moment of the click is posture, and posture is one split: does this person
troubleshoot themselves, or do they want to be comforted.

Measured against the engine, not one ICP in the roster sits at level 7, 8 or
9. Marcus reads 39.2 and Angela reads 40.9, which is level 4 for both. Sofia
reads 56.6, level 6, and is the only one whose posture and measurement agree.

**The stranger at the door is Marcus and Angela, not Sofia.** Onboarding
written for level 8 is written for people who are not there. Onboarding
written soft enough for Angela loses Marcus in four seconds, and Marcus is the
beachhead and the referral channel. That gap is the central design problem in
the funnel and questions 6, 8 and 9 are the three places it has to be
resolved.

---

## 6. What First Run Costs Elsewhere

Named, so the numbers can be argued with. Everything in this section is from
outside the repo and is labelled as such.

- **Onboarding completion, all mobile apps.** Global completion at day 30
  reached 8.4 percent in Q2 2025, and the figure has moved only slightly since
  2021. Finance, health and fitness sit highest at day one at about 26 percent.
  Business of Apps, via search summary.
- **Onboarding completion by product complexity.** Simple products commonly
  reach 70 to 80 percent. Complex ones, which this is, commonly sit at 50 to
  65. Userpilot and Appcues benchmark write ups.
- **Tutorials measure worse than no tutorial.** Nielsen Norman ran a
  quantitative test with seventy users across four apps using deck of cards
  tutorials. People who read the tutorial rated ease of use at 4.92. People who
  skipped it rated it 5.49. A tutorial in front of the product makes the
  product feel harder. `nngroup.com/articles/mobile-tutorials/`.
- **Form length.** Completion runs about 83 percent at one to three questions,
  about 65 percent at four to eight, about 56 percent at nine to fourteen, and
  about 42 percent once a form passes fifteen. Abandonment climbs sharply
  around sixty. Survicate's study of roughly 21,000 surveys, via search
  summary. The repo's own panel figure of 68 percent for sixty three framed
  questions is above every one of those brackets, which is either the framing
  working or the panel being kind. Worth testing with five real people before
  it is trusted.
- **Personality assessments.** Quiz funnels commonly complete at 35 to 42
  percent, personality formats at 60 to 80 percent because the format itself
  is the reward. 16Personalities runs ten to fifteen minutes free and converts
  to paid at under 2 percent. Interact and Outgrow benchmark reports.
- **Health and wellness retention.** Day one commonly 25 to 30 percent, day
  thirty commonly 8 to 25 percent depending on who is counting. The nearest
  neighbours, Oura and Whoop, both withhold their headline reading behind a
  personal baseline of about fourteen days and tell the person so, which is
  the same posture as this product's refusal to print a number off a default.
  uxcam and Business of Apps benchmark pages.

The useful shape of all of it: **the product is not unusual in asking a lot.
It is unusual in asking a lot before it has given anything.** Oura asks for
fourteen days and gives a reason. This asks for fifteen minutes and gives a
dot for the first five seconds.

---

## 7. What To Instrument Before Anything Is Built

So the next round can tell whether it worked. None of this needs the record
store.

1. **Time to first number about them.** From first paint to the first figure
   on screen that is derived from something the person entered. Today that
   figure is unbounded, because a person can sit on the Field forever and
   never enter anything.
2. **Which door, and whether it completed.** Four doors, four counters, plus
   whether the thing behind the door reached its end. The nine sentences door
   is the one I expect to open most and complete least.
3. **Stop point on the intake.** Which question index the last answer landed
   on. The panel says question forty. A real number either confirms it or
   kills a copy fix nobody needed.
4. **Left rail first touch.** Whether any of the thirty glyphs is ever pressed
   in the first session. I expect close to none, and that is the evidence for
   folding the rail rather than an argument about it.
5. **Whether the person returns.** One flag, day two. It is the only retention
   number that matters before there is a loop to retain them in.
6. **Tutorial skip, if Q4 lands on a named tutorial.** Skip rate and
   completion rate, separately, because the Nielsen Norman finding says the
   skippers may be the happier group.

Then five people. Not a panel, not a simulation. Five real strangers, watched,
at 390. Five surfaces about 85 percent of what is wrong and the sixth onward
mostly confirm.

---

## 8. The Grade

First run today, as a stranger, at both widths: **D.**

The parts are better than the whole. The refusal paragraph is excellent. The
four doors are the best written copy in the product. The cold Summary is a
genuinely good stranger screen. The tap target floor holds everywhere.

The whole is a D because the app does not open on that screen, it opens on an
instrument full of dashes with 71 choices around it, it spends the first four
and a half seconds on a black field with a dot, it prints about twenty numbers
off a default to somebody who was promised it would not, and the one door most
likely to be taken by the largest population in the grid delivers nine
sentences that cannot be read.

With Q1 answered and nothing else changed, it is a **C**. With Q1, Q3 and Q8
answered and built, **B minus**. The rest of the ladder needs the tutorial,
and the tutorial needs Q2 and Q5.

---

## 9. Files

- `/home/user/MOB/atuned_src/engine/core.js` line 140, the opening tab
- `/home/user/MOB/atuned_src/ui/component.js` lines 300 to 340, the four doors
- `/home/user/MOB/atuned_src/ui/summary.js`, the cold Summary
- `/home/user/MOB/atuned_src/ui/intakeui.js`, Who This Is and the sixty three
- `/home/user/MOB/BUYERS.md`, the grid
- `/home/user/MOB/RESEARCH-icp.md`, the completion table and the walk points
- `/home/user/MOB/reviews/funnel-strategy.md`, the funnel and the posture finding
