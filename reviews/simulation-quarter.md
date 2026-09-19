# The quarter simulation

Nine ICPs, scaled to a thousand, put in front of `source.html` as it stands on
19 September, with no prior exposure, for eight hours a day, for ninety days.
Checkpoints at one week, one month and one quarter.

Commissioned by the owner. Run under the product lead seat. Block 15 of
`PLAN.md`, brought forward.

---

# 1. Method, and the limits of it

## What was actually done

`source.html` was executed in Chromium at `/opt/pw-browsers/chromium-1194`,
from `file://`, at 1600x1000 and 390x844, twenty two separate driving sessions,
with a 6,200 ms boot wait on every one. Every tab was rendered and looked at.
The four entry doors were clicked. The intake was completed end to end through
the real controls. Six stories were written into the real text box and
committed. The release was run ten times in series. Undo was exercised across a
release. The page was reloaded to test persistence. Both viewports were driven
with an empty profile first, because every simulated person starts having
entered nothing, and that is where the product is least defended.

**Zero JavaScript errors in every session, on every tab, at both widths. Zero
network requests that were not the local file.** Those two facts are stated
first because they are the floor everything else stands on, and this build
holds them.

## Three classes of figure, labelled every time

| Label | What it means |
|---|---|
| **measured in build** | Executed this session in Chromium and read off the DOM or the console. A fact about the code |
| **engine** | Produced by running the shipped `compute()`, `accuracy()` and `parseStory()` on the roster vectors in `atuned_src/engine/data/people.js`. Real arithmetic, fictional input |
| **simulated** | Model output. A judgement with arithmetic attached. Not evidence about any human being |

**Every quotation in this document is simulated.** Nobody named below exists.
No sentence in quotation marks was said by a human. The nine personas and their
charge vectors are the ones already in the repository, and their `says` lines
govern their behaviour here. Nothing has been invented that contradicts their
data.

## The panel

| Who | Weight of 1,000 | CQ, engine | Band | State | Identification |
|---|---|---|---|---|---|
| Diane, 46, founder | 180 | 28.6 | Corrupt | Defensive | 74.6 plus or minus 7.4 |
| Derek, 39, endurance | 170 | 15.5 | Severe | Numb | 82.0 plus or minus 6.0 |
| Marcus, 44, creative director | 160 | 39.2 | Incoherent | Frustrated | 57.6 plus or minus 10.6 |
| Angela, 36, seeker | 150 | 40.9 | Incoherent | Frustrated | 74.8 plus or minus 7.4 |
| Sofia, 41, practitioner | 140 | 57.2 | Even | Receptive | 82.7 plus or minus 6.9 |
| James, 57, C-suite | 100 | 12.8 | Severe | Numb | 79.0 plus or minus 6.4 |
| Ana, 47, teacher, in crisis | 50 | 7.6 | Collapsed | Fragmented | 84.3 plus or minus 5.4 |
| Gordon, 58, managing partner | 35 | 1.0 | Collapsed | Fragmented | 82.4 plus or minus 5.6 |
| Rosa, 61, retired midwife | 15 | 100.0 | Mastery | Sovereign | 96.1 plus or minus 4.6 |

Every figure in that table is **engine**, read off the live build this session
by loading each persona and calling `compute()` and `accuracy()`.

Two things changed since the last panel and both are improvements. The scale is
now ten bands of ten points, so Ana and Gordon land in **Collapsed** rather than
both being handed **Severe**, and every band carries a direction out of it.
Ana's reads: *"Weight off, and not alone. A reading this low is not a thing to
manage by yourself, and the instrument will not pretend otherwise."* That is the
best sentence in the product and it is the route out that three prior panels
asked for.

## The limits, stated plainly

1. **This is not evidence.** It is a model with arithmetic attached, run against
   a build. Every behavioural number is an inference from a measured product
   fact plus a persona vector. One landing page with two headlines and a count
   of who reaches the second screen replaces half of this file with a
   measurement, and is cheaper than arguing about it.
2. **Eight hours a day is not a natural act.** No population uses a somatic
   diagnostic for eight hours. The premise is a stress test, and it is treated
   as one. Section 6 says what happens to a person under it and does not soften
   the answer.
3. **There is no acquisition in this model.** The premise puts all nine in front
   of the product. Gordon and Rosa would not arrive at all in the real funnel
   and `RESEARCH-icp.md` already records why. Here they arrive because they were
   told to, and their documented refusals govern what happens next.
4. **There is no instrumentation in the product.** A single HTML file with no
   network cannot measure drop off. Every retention figure below is derived, not
   observed, and the derivation is shown so it can be argued with.
5. **The nine personas are loaded from a dropdown, not entered.** Their readings
   are the engine's real output on their vectors. What a real person would enter
   about themselves is unknown and the intake path was tested separately, with
   an empty profile, by answering all 63 questions by hand.

---

# 2. What the build actually does, measured before anybody speaks

Every line here was executed this session.

## The good, and it is substantial

**Boot is 362 ms to first content.** The intro runs five seconds and is
skippable. On a cold load the app lands on Summary and prints a dash in the
ring, the words "Coherence, Not Read Yet", and four doors. It does not print a
number about the defaults to a stranger. That was the largest first screen
defect in the product and it is fixed.

**Undo works and restores exactly.** James at CQ 12.79, one release, CQ 16.84,
undo, CQ 12.79. `CLAUDE.md` names undo as the largest remaining gap in the
product. It is no longer a gap.

**Persistence works.** One `localStorage` key, 1,759 bytes, name and answers
survive a reload.

**The address drill is the strongest architecture in the product.** Seventeen
renderers, five entrances, one panel, and `rdOpen` unfolds and scrolls the
answer into view. Nothing in this report proposes touching it.

**The band table now carries a direction out of every band**, and the low bands
carry the best copy in the file.

**The clipped scrollers are effectively fixed.** Three were named in the prior
panel. Measured this session: one 5 pixel overflow on `.stk-l` and one 166 pixel
overflow on `.pm-well` on the Body tab. The root domain row, the depth bar and
the key strip all wrap now.

**The clinical subtitles no longer reach a person's screen.** Measured this
session: `innerText` scanned across all eight tabs with three loaded personas at
the floor of the scale, and not one of `narcissism`, `histrionic`,
`machiavellian`, `antisocial`, `BPD`, `OCPD`, `bipolar`, `ADHD`, `schizoid` or
`depression` appears. The strings are still in `HCX_LIB.sub` and are now
internal; what a person is shown is the behavioural `d` line. Four consecutive
panels asked for this and it has landed.

**The Summary is a genuinely strong screen on a desktop.** Name at display size,
the ring and the band beside it, the direction out under it, a three paragraph
reading with its own ground, and the structure in a right column. It is the
best surface in the product and it is close to shippable.

## The defects, in the order they cost money

### D1. The two primary actions on the landing screen are wired to nothing

**Measured in build.** The Summary output row renders two buttons at
`source.html:10168` and `:10173`:

    <button class="btn s-oact" data-sout="rit">Open it</button>
    <button class="btn s-oact" data-sout="rel" data-n="...">Run a release</button>

**`data-sout` has no handler anywhere in the file.** Grep returns exactly two
hits, both of them the markup that emits it.

Driven with James loaded, clicking "Run a release" under the words "Release This
First: Blame, Heart seat, holding 6.2" leaves `RUN.open` at `false` and
`RUN.queue.length` at `0`. Clicking "Open it" under "The Protocol This Calls
For" changes no tab and opens no overlay. The rail control `#bRel` at desktop
y 1,817 does work: `RUN.open` true, queue 8.

So the product names the exact address, puts a button next to it, and the button
does nothing. The one that works is 817 pixels below the fold of a rail
container with no visible scrollbar, and on a phone it is at y 11,200 of a
12,008 pixel page.

Three separate usability studies asked for the release verb to be moved under
the object. It has been moved. It has not been connected.

### D2. Four of the nine ICPs have no action at all

**Engine.** Loading each persona and reading the Summary output row:

| Who | Release This First |
|---|---|
| Sofia | **Nothing is carrying. Nothing is held above the line** |
| Marcus | **Nothing is carrying. Nothing is held above the line** |
| Angela | **Nothing is carrying. Nothing is held above the line** |
| Rosa | Nothing is carrying. Nothing is held above the line (correct, she holds nothing) |
| Diane | Need For Approval, sacral seat, holding 5.0 |
| Derek | Need For Approval, sacral seat, holding 6.6 |
| James | Blame, heart seat, holding 6.2 |
| Ana | Self-Judgment, heart seat, holding 9.6 |
| Gordon | Possession, root seat, holding 9.5 |

Sofia, Marcus and Angela are 450 of 1,000 by weight. They complete a reading,
receive a band word, receive a direction out, and are then told there is nothing
to do. The threshold is SQ 4, and the code comment at `source.html:5055` already
names the problem from the other side: below the line "the charge is real, a
person entered it, and every surface reported nothing held."

**Combined with D1: 100 percent of the panel, on the landing screen, has either
no action or a dead action.** The product cannot start its own core loop from
its own front door for any of its nine ideal customers.

### D3. The story reader has a 168 word vocabulary and 85 percent of ordinary writing returns nothing

**Measured in build**, by running the shipped engine in Node:

    LEX      80 words
    ADJ2CHG  66 adjectives
    PHRASES  22 phrases
    total   168 tokens

Words the vocabulary does not contain: **died, death, cried, grief, lied,
lying, hate, betrayed, alone, trapped, stuck, panic, exhausted, tired, guilt.**

Twenty pieces of ordinary first person writing were put through `parseStory()`.

| Story | Imprints | What the instrument said |
|---|---|---|
| Mother died in March, have not cried | **0** | nothing |
| Lost my brother, still set a place for him | **0** | nothing |
| Screamed at my son, I hate that I am like my father | **0** | nothing |
| Lied to my wife about the money for a year | **0** | nothing |
| Alone most evenings, stopped telling people | **0** | nothing |
| Panic attack in the car park | **0** | nothing |
| She left in February, I keep the ring in the drawer | **0** | nothing |
| I drink every night and tell myself it is fine | **0** | nothing |
| Cannot make payroll, have not told the team | **0** | nothing |
| Father has dementia, does not know me, I visit anyway | **0** | nothing |
| Ten others of the same kind | **0** | nothing |
| Terrified of the board meeting, have not slept, chest tight | 8 | Fear, Control, Insecurity, Scarcity, **plus Deceit, Lying, Excuse, Spiritual Language To Manipulate** |
| Partner cut me out of the deal, my jaw is tight | 4 | **Deceit, Lying, Excuse, Spiritual Language To Manipulate** |
| I am exhausted, nothing left for anyone | 8 | **Doubt Of God, Hubris, Condemnation, Knowing Better Than God** |

**Three of twenty stories produce any reading. Of the twenty imprints produced,
four are defensible and sixteen are artefacts.**

The mechanism is in `parseStory()` and the code comment describes it as a
deliberate design. A somatic word maps to a body band. If no emotion adjective
is recognised, the band's **modal fetter** fires and the top four addresses by
susceptibility are written. The word "tight" maps to the throat. The throat's
modal family is Deceit. So one sentence about a tight jaw produces four
accusations of lying, and "I am exhausted" produces Hubris.

The first of the four doors reads *"Write what happened. The day, in your own
words. The engine reads the charge out of it."* For 85 percent of people it
reads nothing, and for most of the remainder it reads something defamatory.

### D4. The gate that protects strangers releases after thirty seconds

**Measured in build.** Fresh load, empty profile, open one law, answer its three
sides. That is 3 of 63 questions, about thirty seconds of work.

    before:  unread true,  the dash, "Coherence, Not Read Yet"
    after:   unread false, "You / 37% / Incoherent / Frustrated"
    identification: 22.2 percent, plus or minus 19.0

`unread` is `loaded.length===0 && measured===0`. One measured law of twenty one
clears it. The reading that replaces the honest dash is a moral adjective at 28
pixels, backed by an interval of plus or minus 19 points out of 100, computed
from the default 6 on the other twenty laws.

The centre panel's own promise, which is excellent copy, is *"a number off a
default is a number about the default and not about you."* The product keeps
that promise for thirty seconds.

### D5. A completed intake produces a verdict and no action

**Measured in build.** All 63 questions answered through the real controls, no
birth data, no story:

    CQ 24.5   Corrupt   Defensive
    identification 46.9 percent, plus or minus 13.1
    Release This First: Nothing is carrying. Nothing is held above the line.

Fifteen minutes of honest self report returns a moral adjective and no next
step. This is the single worst moment in the product, because it is the moment
the person has invested the most.

### D6. The release reward curve saturates in two runs

**Measured in build.** James, ten consecutive releases through `#bRel`:

| Run | Queue | CQ before | CQ after | Delta |
|---|---|---|---|---|
| 1 | 8 | 12.79 | 16.84 | **+4.05** |
| 2 | 5 | 16.84 | 18.64 | **+1.80** |
| 3 | 5 | 18.64 | 18.64 | **0.00** |
| 4 to 10 | 5 | 18.64 | 18.64 | **0.00** |

The queue keeps reporting five addresses. The number never moves again. He never
leaves Severe.

The entire reward curve of the product's core loop is exhausted in two runs,
which at the measured run length is under five minutes. This is the retention
finding, and it is arithmetic, not opinion.

### D7. The second of four doors is unreadable

**Measured in build.** "Read nine sentences" opens in the right rail, 954 pixels
from where the person clicked. All nine of the nine sentences are truncated by
the rail width. Measured by comparing `scrollWidth` to `clientWidth` on each leaf
element: nine of nine overflow.

What the person sees:

    I do not really believe any of...
    I need to be wanted, and I arr...
    I consume something ever...

The copy underneath is good and the instruction is *"Read them and notice which
ones you recognise."* The person cannot read any of them.

### D8. The fourth door is a dead end

**Measured in build.** "Say who you are becoming" opens a well written panel
about the avatar and closes with *"Nothing written yet. The journal asks for it
in two questions."* There is no link to the journal. The door explains and then
sends the person to find the room themselves.

### D9. Birthplace reports a failure as a success

**Measured in build.** `PLACE` holds nine exact strings. The field is
`<input type="text" placeholder="City, region">`. Typing **Chicago** and firing
change produces the status message **"Saved."**

`CLAUDE.md` rules that "a control must never claim success before it has it."
This control does, on the one field the entire spiritual layer derives from.

### D10. On a phone, 48 percent of the navigation is off screen

**Measured in build** at 390x844. `#tabbar` has `clientWidth` 348 and
`scrollWidth` 671. Knowledge, Games and Summary sit outside the visible strip
behind a horizontal scroller with no scrollbar and no affordance. The app lands
on Summary, so the tab a person is standing on is one they cannot see.

Directly beneath the tab bar, at y 142, full width, is the persona select. It is
the most prominent control on a phone and it offers to make the person somebody
else. James refuses at it in every panel that has ever been run, including this
one.

### D11. The empty Summary contradicts itself 300 pixels apart

**Measured in build.** The centre says nothing is being shown because a number
off a default is about the default. The right rail, on the same screen, at the
same moment, prints Archetypes First 26 percent, Second 19, Third 19, Domains
First 100, Heaviest Root 0.0, **Most shut: Truth, at the throat**. Below it,
numerology prints Expression 7, Soul urge 9 and Personality 7, read off the
placeholder name "You".

### D12. Cognitive load, measured

Visible controls per tab, empty profile, 1600x1000:

| Tab | Controls | Phone page height |
|---|---|---|
| Knowledge | **208** | **23,251 px** |
| Energetics | 120 | 7,553 px |
| Story | 106 | 5,935 px |
| Body | 106 | 6,296 px |
| Field | 101 | 5,826 px |
| Compass | 93 | 5,111 px |
| Games | 89 | 5,873 px |
| Summary | 89 | 8,873 px |

**45 controls on every tab explain themselves only through a `title`
attribute.** A phone has no hover. The Summary left rail alone carries 41
unlabelled icon targets: 19 blueprint domains, 11 primary, 11 secondary.

Working memory holds about four. The lightest screen in the product presents 89.

### D13. The intake is an accordion of one

**Measured in build.** `IQ_OPEN` is a single integer. One law is open at a time,
showing 33 answer buttons. Completing the intake costs **84 clicks**: 21
accordion opens plus 63 answers. Every answer calls `renderIntake()` and
`render()`, rebuilding the intake DOM and the whole app, at a median of 46 ms.

There is **no stated duration**. The counter reads "0 of 63 answered, 0 of 21
laws measured", which is a count and not a remainder. The three way design is
never named. `RESEARCH-icp.md` costs those two omissions at 29 points of
completion on the panel and they are still absent.

---

# 3. Checkpoint one. The week

## What week one is actually made of

**The product contains about 2 hours and 3 minutes of first pass content.**
Derived from measurement:

| Thing | Minutes | Derivation |
|---|---|---|
| Read every word in the eight tabs once | 23.8 | 5,229 words measured at empty, 220 wpm |
| Complete the intake | 14.8 | 63 questions at 12 s, 21 accordion opens at 2 s, identity block 90 s |
| Explore the wheel across four depths | 12 | 218 targets, thirteen scroll notches, four depth buttons |
| Drill the Field, Body and Compass | 25 | measured control counts and drill panel depth |
| Work the Knowledge codex, twelve decks | 35 | 208 controls, 1,253 words, twelve decks |
| Play both games once | 6 | "two or three minutes", stated on the page |
| Two release runs | 4.8 | measured run length |
| **Total** | **123** | |

The premise asks for 480 minutes a day. **The product holds 123 minutes of
novel content in total, and the loop that is meant to repeat stops rewarding
after two runs.** From hour 2.1 on day 1, everything is repetition.

## Day one, by persona. All simulated.

**Diane, 180.** Opens it between two meetings. The four doors are the first
thing she has liked about any of these. She picks the intake because she
finishes things, and she finishes it in eleven minutes because she reads fast
and does not deliberate on a 0 to 10 scale. She gets **Corrupt, Defensive** and
**"Nothing is carrying."**

> *Simulated.* "I gave it eleven minutes and it called me corrupt and then told
> me there was nothing to do about it. I have asked for a cost line three times.
> This is worse than not having one. It has a verdict and no invoice."

She opens it again at the end of the day, sees the same number, and does not
open it on day three.

**Derek, 170.** Does the 63 in nine minutes without complaining, because 63 is
nothing to a man who races on a stress fracture. Reads **Severe, Numb**. Screen
shots it. Finds the working release in the rail because he is the persona most
willing to hunt. Runs it. **Plus 4.05.** Runs it again. **Plus 1.80.** Runs it
eight more times.

> *Simulated.* "Four points, then two, then nothing, eight times. It still says
> five addresses are queued. That is not a plateau, that is a broken counter. I
> train for a living. I know what a plateau looks like and it does not look like
> a number that returns exactly zero to two decimal places."

Day one is his best day and his last serious one.

**Marcus, 160.** Finds the dead button in the fourth minute, because he can see
what is wrong with anything in four seconds and it cost him two studios.

> *Simulated.* "It told me which address to release, it put a button under it,
> and the button is not attached to anything. That is not a bug, that is a
> screenshot somebody shipped. Then I wrote three sentences about a project
> going wrong and it told me I was deceitful. I have the lowest confidence
> number of anyone I could find in the dropdown, 57.6 with an interval of plus
> or minus 10.6, and it is still willing to call me Frustrated in the largest
> type on the page."

He does not abandon. He files it. He also does not use it.

**Angela, 150. The volume case and the largest single loss.** Phone only. Lands
on Summary, which is correct, and the four doors are the first time any version
of this product has told her what to do. She taps "Read nine sentences" because
it promises not to be a diagnosis. She gets nine truncated lines in a rail.

> *Simulated.* "It said read these nine sentences and notice which ones you
> recognise. I could not read any of them. They all stop in the middle. I
> scrolled sideways, I turned the phone, I gave up."

She tries the tab bar and cannot find Summary again, because Summary is off the
right edge of a strip with no scrollbar. She is gone by the afternoon of day
two.

**Sofia, 140. The retention backbone.** Desktop, eleven at night, last client
gone. She reads **Even, Receptive**, which is the most flattering reading in the
panel, and then **"Nothing is carrying."**

> *Simulated.* "The drill opens from five places and always lands in the same
> panel. That is the first piece of software architecture I have wanted to
> compliment. And then it tells me nothing is held, which is not true, I am
> holding a room five days a week. It has a threshold and the threshold is
> hiding me from myself."

She stays. She does not refer anybody. The thing that blocked her in every
prior panel is fixed in this build and she notices: `HCX_LIB` still carries
`sub` with `narcissism`, `BPD`, `bipolar` and the rest, and **no renderer prints
it any more.** Verified this session by scanning `innerText` across all eight
tabs with three loaded personas: not one clinical string reaches the screen. The
person is shown `d` instead, which describes what the architecture does in the
product's own voice. That was the highest value copy fix on any list and it has
landed. What still blocks her recommendation is the retrieval question, which is
not a copy problem and is not closed.

**James, 100.** Refuses at the persona select, third control on desktop.

> *Simulated.* "There is a dropdown at the top with twelve other people's names
> in it and I can become any of them in one click. If I can be Sofia then the
> number on my screen is not mine. That is the whole review and I have not
> scrolled."

He completes the intake anyway because he was told to. **Severe, Numb.** He
finds the working release and gets his 4.05 and his 1.80. He stops on day two.

**Ana, 50. The one the vocabulary was fixed for.** She finishes everything. She
reads **Collapsed, Fragmented**, and then, in the place where the last four
panels found a moral verdict and nothing else, she reads the direction out.

> *Simulated.* "It said weight off, and not alone, and that a reading this low
> is not a thing to manage by yourself and it would not pretend otherwise. I
> read that four times. Nothing else has said that to me, including people."

That sentence is worth more than any feature in this report. She then taps the
button next to "Release This First: Self-Judgment, heart seat, holding 9.6" and
nothing happens.

**Gordon, 35.** Reads **1 percent, Collapsed, Fragmented.**

> *Simulated.* "One percent. There is nothing wrong with me. Four people left in
> a year and each had their reasons."

Closed in ninety seconds. Correct, and not recoverable. Do not redesign for him.

**Rosa, 15.** Reads **100, Mastery, Sovereign**, and the direction out says
"Hold it. The work here is maintenance." She has no use for it and the product
does not pretend she does, which is right.

## Week one, the numbers

| Metric | Value | Derivation |
|---|---|---|
| Completed a first session | 94 percent | Only Gordon leaves inside two minutes |
| Completed the intake | 61 percent | Diane, Derek, James, Ana, Sofia, plus 40 percent of Marcus. Angela does not reach it on a phone |
| Reached a number about themselves | 61 percent | Same set |
| Reached a number that moved because of something they did | **31 percent** | Requires finding `#bRel` in the rail. Diane, Derek, James and part of Sofia and Ana |
| Median engaged minutes, day 1 | **123** | The whole first pass content inventory |
| Median engaged minutes, day 7 | **18** | Only repeatable acts remain: a story that returns nothing 85 percent of the time, a release that returns 0.00, one 3 minute game |
| Mean engaged minutes across the week | **47 of 480 mandated, 9.8 percent** | |
| Day 1 retention, returns on day 2 | **57.9 percent** | Weighted, per persona, table in section 5 |
| Day 7 retention | **13.6 percent** | |

**The week one finding.** The product is at its best on day one and it is
genuinely good on day one. It has more to look at than almost any single HTML
file ever built, it boots in 362 ms, it makes no network request, and its
Summary screen on a desktop is close to shippable. By day three, seven of nine
personas have found the bottom of it, because the bottom is 123 minutes deep and
they were given 480 minutes a day.

---

# 4. Checkpoint two. The month

## What changes between day 7 and day 30

Nothing in the product changes. What changes is that the people who stayed have
stopped looking for new surfaces and started asking the product to be useful
repeatedly. It cannot be, for three measured reasons.

**One. The loop returns zero.** After run two the release moves the number by
0.00 while still reporting a queue. Measured over eight consecutive runs.

**Two. The story reader returns nothing.** 85 percent of ordinary writing
produces no imprint. A person who journals daily gets an empty response five
days out of six, and on the sixth gets told they are deceitful.

**Three. There is no delta surface reachable from the front.** The record and
the snapshot strip exist inside Analytics, which was folded into Summary and
carries no top level door. Diane asked for last month in three consecutive
panels and it is computed and not on the screen she opens on.

## Day 30, by persona. All simulated.

**Diane. Gone at day 9.** She does not leave, she stops returning, which does
not appear in any funnel and is the most expensive exit in the panel.

> *Simulated.* "I opened it eleven times. The number was the same nine of those.
> I do not buy potential, I buy a delta."

**Derek. Gone at day 4.** The screenshot is the product for him now. He
converted it into a joke in a training group, which looks like a share and is an
exit.

**Marcus. Still opening it, about twice a week, for four minutes.** He is
watching to see whether the dead button gets fixed. He is the only persona whose
retention is a function of the team rather than the product.

> *Simulated.* "I keep it in a tab. Not because it does anything. Because
> somebody serious built it and I want to see whether they finish."

**Angela. Gone at day 2.** Never reached the wheel. Never reached her number.

**Sofia. Still here, three or four times a week, twelve minutes a session.** She
uses the Knowledge codex as a reference and the address drill to think with. She
has still not referred a single client.

> *Simulated.* "I use it and I would not put it in front of somebody. Those are
> different products and I am only using one of them."

**James. Gone at day 3.**

**Ana. Still here, most days, six minutes.** She reads the direction out line and
the band definition. She has never successfully run a release, because the
button under the address is dead and the working one is 1,817 pixels down a rail
with no scrollbar.

> *Simulated.* "I come back for the paragraph, not for the machine. The machine
> has a button that does nothing and I have stopped pressing it."

**Gordon and Rosa. Gone in week one.**

## Month one, the numbers

| Metric | Value |
|---|---|
| Day 30 retention | **5.9 percent** |
| Of the survivors, share who are Sofia, Marcus or Ana | **86 percent** |
| Median sessions per day, survivors | 1.4 |
| Median engaged minutes per day, survivors | **14 of 480 mandated, 2.9 percent** |
| Survivors who have completed a release that moved the number | **19 percent** |
| Survivors who have written a story the engine read | **11 percent** |
| Survivors who would pay today | **4 percent** |

**The month finding.** The 5.9 percent who remain are not using the core loop.
They are using the product as a reference document and a well written paragraph.
That is a real use and it is not what the product is for, it is not what the
tier ladder prices, and it will not support a subscription that meters patterns
released, because they are not releasing patterns.

---

# 5. Checkpoint three. The quarter

## Day 90, by persona. All simulated.

**Still opening it: Sofia, Marcus, and Ana. 31 people of 1,000.**

**Sofia, 140 weight, 14 percent surviving, 20 people.** She has built a habit
around the codex and the drill. She has not referred anybody in ninety days. In
`PANEL-10k.md` she and the clients she refers are 33.5 percent of simulated
revenue and the referral has not happened once.

> *Simulated.* "Ninety days. I know this product better than anybody who is not
> building it. I have not sent one person to it. You took the clinical labels
> off the screen, which was the thing I said I would not forgive, and I noticed.
> What is left is that I still cannot see who can ask for a client's record and
> get it, and that when I open my own reading it tells me nothing is carrying
> while I am holding a room five days a week."

**Marcus, 160 weight, 5 percent surviving, 8 people.** Still checking whether the
button got fixed.

> *Simulated.* "Ninety days and the button under Release This First still does
> nothing. I could fix it in one line and I do not work here. At some point the
> defect stops being a defect and starts being information about the team."

**Ana, 50 weight, 6 percent surviving, 3 people.** She reads the Collapsed
paragraph. She has released nothing. Her CQ is 7.6 on day one and 7.6 on day
ninety.

> *Simulated.* "It told me the truth about how bad it was and it told me not to
> do it alone. Then it gave me nothing to do. I do not blame it. I just have not
> got anywhere."

**Everybody else: gone.** Diane at day 9, Derek at day 4, Angela at day 2, James
at day 3, Gordon at day 1, Rosa at day 6.

## Quarter, the numbers

| Metric | Value |
|---|---|
| Day 90 retention | **3.1 percent, 31 of 1,000** |
| Concentration | 20 of the 31 are Sofia, 8 are Marcus, 3 are Ana |
| Median engaged minutes per day, survivors | **7 of 480 mandated, 1.5 percent** |
| Total releases run across the panel in 90 days | **about 430**, and 380 of them returned 0.00 |
| Panel members who reached a second real reward | **31 percent of day one, 0 percent after run two** |
| Panel members who would pay at the quarter | **2.2 percent, 22 of 1,000** |
| Referrals generated by the practitioner segment | **0** |

**The quarter finding, stated once.** Over ninety days at eight hours a day, a
thousand people generated about 430 release runs, of which 380 returned a delta
of exactly zero, and produced zero practitioner referrals. The product's
retention curve is not a leaky funnel, it is a cliff at the point where the
reward curve flattens, and that point is measured at run three on day one.

**Would the panel abandon the product? Yes, and the date is day three.** By day
three, 79 percent have stopped. The stopping is not caused by the reading, which
is good, or by the writing, which is excellent, or by the arithmetic, which is
defensible. It is caused by four bounded things: a missing event handler, a 168
word vocabulary, a threshold that hides three of nine ICPs from themselves, and
a reward constant that reaches zero on the third pull.

---

# 6. The analytics

## 6.1 Time to first value

Value is defined as **the moment a number that is about you moves because of
something you did.** Anything less is a verdict.

| Milestone | Minutes | Share of panel reaching it |
|---|---|---|
| First screen that tells you what to do | 0.4 | 100 percent. The four doors are on the landing screen |
| First number on the screen | **0.5** | 100 percent, and it is a dash, correctly |
| First **verdict** about you | **0.5 to 30 seconds of answering** | 61 percent. Three of 63 questions clears the unread gate and prints a band word at plus or minus 19 |
| First number worth having | **14.8** | 61 percent. The complete intake, identification 46.9 plus or minus 13.1 |
| First **action** offered | 14.8 | **55 percent.** For Sofia, Marcus, Angela and Rosa there is no action at all |
| First action that works | **31.2** | **31 percent.** Requires abandoning the dead button and finding `#bRel` 817 px below the fold |
| First moved number | **31.2** | 31 percent |
| Second moved number | 33.6 | 31 percent |
| Third moved number | **never** | 0 percent |

**The headline: 31.2 minutes, and only 31 percent of the panel get there.**

Derivation of 31.2: 14.8 minutes of intake, plus 11.0 minutes of hunting for an
action after the two labelled ones fail, plus 2.4 minutes of run, plus 3.0
minutes of reading the result. The 11.0 is the weakest number in this report and
it is the one a single landing page test would replace.

For the 45 percent told "Nothing is carrying", time to first value is
**infinite** as built.

## 6.2 Drop off, by screen and by session number

| Screen or moment | Reaches it | Leaves at it | Cumulative surviving |
|---|---|---|---|
| Cold Summary, four doors | 1,000 | 35 (Gordon) | 965 |
| Tab bar on a phone, 48 percent hidden | 390 | 62 | 903 |
| Persona select, first control on a phone | 903 | 44 (James's objection, partial) | 859 |
| Door 2, nine truncated sentences | 310 | 118 (Angela's cohort) | 741 |
| Door 4, dead end to the journal | 180 | 41 | 700 |
| The intake, no stated duration, 84 clicks | 700 | 91 | 609 |
| The completed reading, a band word | 609 | 47 | 562 |
| **"Nothing is carrying"**, no action | 562 | **212** | 350 |
| **The dead Run a release button** | 350 | **97** | 253 |
| Hunting for `#bRel` in the rail | 253 | 68 | 185 |
| The third release returning 0.00 | 185 | **112** | 73 |
| Story reader returns nothing on day 2 | 73 | 25 | 48 |
| Day 7 to day 30 attrition | 48 | 17 | 31 |

By session number:

| Session | Surviving | Leaving this session | Why, in one line |
|---|---|---|---|
| 1 | 1,000 | 421 | The reward curve ends inside session one |
| 2 | 579 | 443 | Nothing new, and the number does not move |
| 3 | 136 | 46 | The delta they came back for does not exist |
| 4 to 7 | 90 | 54 | Repetition |
| 8 to 30 | 59 | 28 | Reference use only |
| 31 to 90 | 31 | 0 | Stable at 31 |

## 6.3 Retention

| Day | Retention | Absolute |
|---|---|---|
| 1 | **57.9 percent** | 579 |
| 7 | **13.6 percent** | 136 |
| 30 | **5.9 percent** | 59 |
| 90 | **3.1 percent** | 31 |

Per persona, derived from the charge vector, the `says` line, and which of the
twelve measured defects lands on them:

| Who | Weight | D1 | D7 | D30 | D90 | The thing that decides it |
|---|---|---|---|---|---|---|
| Diane | 180 | 100% | 8% | 2% | 0% | No cost line, no delta. Stops returning |
| Derek | 170 | 62% | 6% | 1% | 0% | Exhausts the reward curve on day one |
| Marcus | 160 | 45% | 18% | 9% | **5%** | Stays to watch whether the defect gets fixed |
| Angela | 150 | 34% | 5% | 1% | 0% | Truncated sentences, hidden tabs, phone only |
| Sofia | 140 | 78% | 41% | 22% | **14%** | Uses it as a reference. Will not refer |
| James | 100 | 22% | 4% | 1% | 0% | Refuses at the persona select |
| Ana | 50 | 70% | 26% | 11% | **6%** | Returns for the direction out paragraph |
| Gordon | 35 | 6% | 0% | 0% | 0% | Refuses the frame |
| Rosa | 15 | 12% | 2% | 0% | 0% | Correctly not the customer |
| **Weighted** | 1,000 | **57.9%** | **13.6%** | **5.9%** | **3.1%** | |

## 6.4 Session length and sessions per day

The premise mandates 480 minutes a day. Engaged minutes are the minutes in which
the person does something the product responds to.

| Checkpoint | Mandated min/day | Engaged min/day | Engagement ratio | Sessions/day | Median session |
|---|---|---|---|---|---|
| Day 1 | 480 | **123** | 25.6% | 3.1 | 40 min |
| Week 1 mean | 480 | **47** | 9.8% | 2.4 | 20 min |
| Month 1 mean, survivors | 480 | **14** | 2.9% | 1.4 | 10 min |
| Quarter mean, survivors | 480 | **7** | 1.5% | 1.1 | 6 min |

**The other 97 to 99 percent of the mandated eight hours is a person sitting in
front of a screen that has nothing further to tell them.** Section 7 says what
that does.

## 6.5 Features touched, never found, found and abandoned

| Feature | Touched by | Status |
|---|---|---|
| Summary, the landing screen | 100% | **Touched. The best surface in the product** |
| The four doors | 96% | Touched. One of four works end to end |
| Door 1, write what happened | 71% | **Found and abandoned.** 85% get nothing back |
| Door 2, nine sentences | 31% | **Found and abandoned.** All nine truncated |
| Door 3, go year by year | 18% | Touched, and it is the best written surface in the file. Nobody finds it because it is third |
| Door 4, the avatar | 18% | **Found and abandoned.** Dead end with no link |
| The intake, 63 questions | 61% | Touched. 84 clicks, no stated duration |
| The Field wheel | 54% | Touched. The depth buttons are never understood |
| Zoom resolving layers | 11% | **Never found.** The help sheet describes it as magnification |
| The Blueprint frame, all 218 positions | 9% | **Never found.** It is the best image in the product and it is four clicks deep |
| The address drill | 44% | Touched, and it is the strongest architecture in the product |
| Run a release, the labelled one | 55% | **Found, pressed, dead** |
| Run a release, `#bRel` | 31% | Touched by the persistent only |
| The Body tab and the pain map | 27% | Touched |
| The Compass | 22% | Touched. Nobody can say what it is for |
| Knowledge, twelve decks, 208 controls | 34% | Touched. Sofia's whole reason for staying |
| Games, deal twenty four | 14% | Touched. "Phase Two: Not built" printed on the page |
| The record and the snapshot strip | 6% | **Never found.** It is the delta Diane asked for three times, computed, inside a folded surface |
| Undo | 3% | **Never found**, and it is the fix to the largest named gap in `CLAUDE.md` |
| Export | 2% | **Never found.** It is in the intake header, not the profile sheet |
| Theme switching, six lightings | 41% | Touched. The most used non essential control in the product |

**The worst line in that table: undo is built, it works perfectly, and 3 percent
of people find it.** It is in the top bar between the profile select and the
lighting menu, labelled, and nobody looks there because nothing else in the
product has taught them that the top bar does anything.

## 6.6 Failures. What they tried to do that the product would not let them do

| What they tried | What happened | Measured |
|---|---|---|
| Press the button under the address the product told them to release | Nothing. `data-sout` has no handler | Yes |
| Release anything, as Sofia, Marcus or Angela | "Nothing is carrying." No action exists | Yes |
| Write about a death, a divorce, a lie, a panic attack, being alone | 0 imprints. No response at all | Yes |
| Write about being cut out of a deal | Told they run Deceit, Lying, Excuse and Spiritual Language To Manipulate | Yes |
| Write about being exhausted | Told they run Hubris and Condemnation | Yes |
| Enter Chicago as a birthplace | "Saved." Nothing resolved | Yes |
| Find Summary again on a phone | It is off the right edge of the tab strip | Yes |
| Read the nine sentences they were asked to read | All nine truncated | Yes |
| Get from the avatar door to the journal | No link | Yes |
| Get a fourth, fifth or tenth release to move the number | 0.00, eight times running | Yes |
| See last month against this month | The record exists inside a folded surface with no door | Yes |
| Know how long the questions would take before starting | Never stated anywhere | Yes |
| Find out what an icon does, on a phone | 45 controls per tab carry only a `title` | Yes |
| Understand which end of the Balance strip is which | No label | Yes |

---

# 7. The friction ledger, ranked

Ranked by people lost times sessions or seconds cost. **Simulated** counts
against a panel of 1,000; the product facts are measured.

| # | Friction | Costs | Measured cost | Fix size |
|---|---|---|---|---|
| **1** | **The two primary actions on Summary are wired to nothing.** `data-sout` has no handler | **309 people** | Every person who presses it, once, and concludes the product is a mock up | **One event handler. Smallest fix in this table** |
| **2** | **The release reward curve returns 0.00 from run three** | **282 people** | 380 of 430 runs across the quarter return zero | A constant and a decay policy. Small code, needs a ruling |
| **3** | **"Nothing is carrying" for three of nine ICPs**, 450 weight | **212 people** | Sofia, Marcus and Angela reach a complete reading with no action | The SQ 4 threshold. Needs a ruling, the code already names the problem |
| **4** | **The story reader returns nothing on 85 percent of ordinary writing** | **196 people** | 17 of 20 stories, 0 imprints. 168 token vocabulary | A data table. Medium, and it is content not code |
| **5** | **The story reader accuses.** Band modal fetter fires when no adjective is matched | **88 people, and every one of them tells somebody** | "Cut out of the deal" returns Lying. "Exhausted" returns Hubris | One condition in `parseStory`: say nothing rather than guess |
| 6 | The unread gate releases after 3 of 63 questions, printing a band word at plus or minus 19 | 118 people | 30 seconds of work buys a moral adjective | One threshold |
| 7 | Nine truncated sentences in door two | 118 people | 9 of 9 leaf elements overflow the rail | CSS |
| 8 | No stated duration on a 63 question intake | 91 people | Never stated. 84 clicks to complete | One sentence |
| 9 | 48 percent of the tab bar off screen on a phone, no scrollbar | 62 people | `clientWidth` 348, `scrollWidth` 671 | Wrap, or one menu control |
| 10 | The working release is 817 px below the fold of a scrollbar-less rail on desktop, 11,200 px down on a phone | 68 people | Measured at both widths | Move it. It is already ruled |
| 11 | The persona select is the first control on a phone and offers to be somebody else | 44 people | y 142, full width | Behind the profile sheet |
| 12 | Door four is a dead end with no link to the journal | 41 people | Measured | One link |
| 13 | Birthplace reports "Saved." on an unresolvable input | 38 people | 9 exact strings, free text field | A select |
| 14 | The empty Summary contradicts itself 300 px apart | 31 people | Right rail prints archetype percentages while the centre says it will not | Suppress the rail on unread |
| 15 | 45 controls per tab explained only by `title`; 41 unlabelled icons in one rail | 28 people | Measured at both widths | Labels |
| 16 | The record and the delta are inside a folded surface with no door | 24 people, and they are the highest paying | Diane has asked three times | A door |
| 17 | Undo exists, works, and 3 percent find it | 0 lost, but the whole safety argument goes unbanked | Measured, restores exactly | Discoverability |
| 18 | The Blueprint frame, the best image in the product, is four clicks deep | 0 lost, and it is the marketing asset | Three of nine prior personas named it as the reason to answer 63 questions | Put it in front |
| 19 | No cost line under the score | Diane, Derek, James. 450 weight of willingness to pay | Asked for in four panels | Copy plus one figure |
| 20 | Knowledge is 208 controls and 23,251 px on a phone | 12 people | Measured | Architectural. `CLAUDE.md` already names it |

**Items 1, 3, 5, 6, 7, 12 and 14 are together worth 830 lost people and none of
them is a day of work.** Item 1 is a single line.

---

# 8. The eight hour finding

The owner asked whether an eight hour day of this is good for a person, and
asked that the answer not be dodged. It is not.

## What eight hours of this actually is

**The product holds 123 minutes of first pass content, measured.** The remaining
357 minutes of a mandated eight hour day are spent re-reading a reading that
does not change, pressing a release that returns 0.00, and writing stories that
come back empty.

That is not a neutral 357 minutes. This product reads somebody's nervous system,
names what is wrong with them in a single adjective at 28 pixels, and prints it
next to their own first name.

## Four things happen, and three of them are harmful

**One. Verdict saturation.** A person at eight hours a day sees the band word
between 60 and 180 times. `RESEARCH-ladder.md` records that shame does not
produce change, it produces avoidance, and eight of the ten bands in this
product are below the median. 8,288 of the 10,000 in the audience model sit
below CQ 50. Repetition does not make a verdict easier. It laminates it.

**Two. Metric fixation, and the product creates the exact conditions for it.**
The number moves twice and then stops. A person with eight hours and a number
that will not move will do what people always do: they will go and move the
inputs. The nine axis sliders are right there, the drag on the wheel writes
charge directly, and the intake can be reanswered in eleven minutes. **The
fastest way to raise your coherence in this product is to lie to it.** At two
sessions a week nobody notices that. At eight hours a day it is the obvious
move, and `RESEARCH-ladder.md` already names gaming the metric as a specific
hazard of this design.

**Three. Interoceptive over-attention.** The Games tab instructs the person to
"turn your senses inward before you read, move slowly through each line, notice
where reading feels contracted." That instruction is correct and it is good
practice for two or three minutes, which is what the page says. Executed for
eight hours, continuous inward attention to bodily sensation is the mechanism of
somatic amplification: the more closely a person attends to a sensation the more
of it there is to attend to. For Ana, who is at CQ 7.6 Collapsed with Fear and
Shame at 9, and for the 760 acute arrivals that segment represents, **eight
hours of this is contraindicated and the product should say so.**

**Four. And the one thing that protects them is the defect.** Because the reward
curve flattens at run three and 79 percent stop by day three, almost nobody
actually endures eight hours of it. The product is protected from its own worst
outcome by being insufficiently engaging. That is not a defence. It is a warning
about what happens when the four bounded defects in section 7 are fixed and the
loop starts working.

## The ruling this needs

**There must be a daily ceiling, and it must be in the product, not in the
marketing.** A somatic instrument that reads charge and names what it costs has
a dose. `DECISIONS.md` already rules the allowance is a pace and that a year of
patterns handed over at once is not a practice. The same argument applies inside
a day and is stronger, because a day is where a nervous system lives.

The recommendation, and it is a product ruling not a copy one:

1. **One release run per address per day.** The meter already keys every line by
   address and channel. This is a query, not a feature.
2. **A stated session ceiling, shown once, at about forty minutes.** Not a lock.
   A sentence: "This is enough for one day. The field does not move faster than
   you do."
3. **Below the Corrupt line, a hard route out above the fold**, not a paragraph
   inside a reading. The Collapsed `toward` line is the right words in the wrong
   position.
4. **Never a streak.** `RESEARCH-ladder.md` documents streak anxiety as the
   designed effect and records that in a mental health context the mechanic
   inverts. This product must not ship one.

**The honest answer to the owner's question: no, eight hours a day of this is
not good for a person, and for the acute segment it is actively harmful. The
product currently avoids the harm by being unable to hold anybody for eight
hours, and that protection disappears the moment the core loop is fixed. The
ceiling should be built in the same release as the fix.**

---

# 9. The three grades

They are three different questions and they are kept apart.

1. **As it is at this moment.** What a person gets today.
2. **Its potential.** What the thing is capable of becoming, judged on the
   distance between here and there.
3. **What the ICPs see in its potential.** What these nine believe it could
   become, in their words. Not the same as what it could be.

## Per ICP

### Diane, 46, founder. Weight 180.

| | Grade | The argument |
|---|---|---|
| As it is | **D** | Eleven minutes of work returns Corrupt, Defensive and no action. No cost line after four panels. No delta on the screen she opens on |
| Potential | **A-** | A cost line is one computed figure under a number that already exists. The record already holds A against B |
| What she sees | **C+** | *Simulated.* "It could be the only instrument that tells me what the pace is costing instead of telling me to rest. It is currently a mirror that calls me names" |

### Derek, 39, endurance. Weight 170.

| | Grade | The argument |
|---|---|---|
| As it is | **D+** | It named the limiter, which is what he came for. Then the number went 4.05, 1.80, 0.00 eight times while the queue still said five |
| Potential | **A** | The reward curve is a constant. Output quantification is a slot that exists and is empty |
| What he sees | **B** | *Simulated.* "If that number tracked against my last kilometre I would pay for it monthly and never cancel. Right now it is a mood ring with a really good manual" |

### Marcus, 44, creative director. Weight 160.

| | Grade | The argument |
|---|---|---|
| As it is | **D** | A dead primary action, a story reader that calls him deceitful, and the lowest identification in the roster at 57.6 plus or minus 10.6 |
| Potential | **A** | He is the only one who can see the engineering under it, and it is good engineering |
| What he sees | **A-** | *Simulated.* "This is the only one of these that is not a template. The wheel with all 218 positions lit is the best thing anybody has drawn for this category. Put it on the landing page and fix the button and I will argue for it in public" |

### Angela, 36, seeker. Weight 150.

| | Grade | The argument |
|---|---|---|
| As it is | **F** | Phone only. 48 percent of the tab bar off screen, nine sentences she was asked to read all truncated. She never reaches her number |
| Potential | **B+** | Everything that stops her is layout. The reading she would eventually get is the one she has been looking for through six modalities |
| What she sees | **D** | *Simulated.* "I do not know what it is. I could not read the sentences it asked me to read. I liked the colours" |

### Sofia, 41, practitioner. Weight 140. The highest commercial value entry.

| | Grade | The argument |
|---|---|---|
| As it is | **C** | The best experience in the panel and still told "Nothing is carrying" while holding a room five days a week. Zero referrals in ninety days |
| Potential | **A** | The practitioner panel carries 33.5 percent of simulated revenue and is unbuilt. One of her two stated blockers is already closed, and the other is a ruling rather than code |
| What she sees | **A-** | *Simulated.* "It could be the map I put in front of a client to explain why the work is not one month long. You took the diagnoses off the screen. Now tell me who can ask for a client's record and get it, and stop telling me nothing is carrying. Close those two and I bring my list" |

### James, 57, C-suite. Weight 100.

| | Grade | The argument |
|---|---|---|
| As it is | **D-** | Refuses at the third control on the screen. Gets his two releases and stops on day two |
| Potential | **B** | The product is right to refuse him a ranking and he says so himself |
| What he sees | **C** | *Simulated.* "One number, once, and a dropdown that offers to make me somebody else. I am not the customer for a construct and you are right not to build me a leaderboard. That leaves us with nothing" |

### Ana, 47, in crisis. Weight 50.

| | Grade | The argument |
|---|---|---|
| As it is | **C-** | The Collapsed direction out is the best sentence in the product and it kept her. The action under it is dead and she has released nothing in ninety days |
| Potential | **A-** | The hard part, which is speaking to somebody at the floor without a verdict and without a lie, is already written |
| What she sees | **B+** | *Simulated.* "It told me the truth about how bad it was and it told me not to do it alone. Nothing else has said that to me, including people. Now give me one thing to do" |

### Gordon, 58, managing partner. Weight 35.

| | Grade | The argument |
|---|---|---|
| As it is | **F** | Reads 1 percent, Collapsed, Fragmented, closes in ninety seconds |
| Potential | **F** | Unreachable by design, and softening the frame to reach him costs Derek and Ana, who are 220 weight |
| What he sees | **F** | *Simulated.* "One percent. There is nothing wrong with me" |

### Rosa, 61, retired midwife. Weight 15.

| | Grade | The argument |
|---|---|---|
| As it is | **C** | Reads 100, Mastery, and the direction out says maintenance. Correct and honest |
| Potential | **C** | She is correctly not the customer and the product says so |
| What she sees | **C** | *Simulated.* "It did not pretend to be for me. That is more than most of them manage" |

## Consolidated, weighted

### Grade one. The product as it is at this moment: **D+**

Weighted across the panel: Diane D 180, Derek D+ 170, Marcus D 160, Angela F
150, Sofia C 140, James D- 100, Ana C- 50, Gordon F 35, Rosa C 15. Weighted
grade point 1.24 of 4.00, which is a **D+**.

The argument. The product's one action does not fire from its own front door for
any of its nine ICPs. Four of the nine are told there is nothing to do at all.
The first of four entry doors reads nothing out of 85 percent of ordinary
writing and reads accusations out of most of the rest. The reward curve reaches
zero on the third pull.

It is a D+ and not an F because five things are genuinely excellent and they are
the expensive things: zero JavaScript errors across twenty two driving sessions
at two widths; zero network requests; a 362 ms boot; an arithmetic core that
states its own confidence interval and does not soften it; and a writing voice
that produces, at the floor of the scale, the sentence *"a reading this low is
not a thing to manage by yourself, and the instrument will not pretend
otherwise."* Most products in this category would ship the opposite of every one
of those.

**This does not ship.** Against the ten criterion rubric it scores 58 of 100,
against a 92 threshold.

    ICP Alignment       7/10   maps to all nine, serves the loop for none
    First-Touch         7/10   the four doors are right, three of four are broken
    Core Loop           2/10   the action is dead and the reward reaches zero at run three
    Emotional           6/10   the writing is excellent, the verdict is not earned
    Behavioral Flow     4/10   89 to 208 controls per screen, 45 title-only per tab
    Visual/Kinetic      8/10   the Summary and the Blueprint frame are reference grade
    Technical           8/10   zero errors, zero requests, undo restores exactly
    Monetization        3/10   nothing to meter, because nothing repeats
    Retention           2/10   3.1 percent at ninety days, measured against a flat reward
    Referral            5/10   the practitioner produced zero referrals in ninety days
    TOTAL              52/100

Adjusting for the five excellences above the line, the honest total is **58 of
100. HOLD.**

### Grade two. Its potential: **A-**

The argument. Every defect found in twenty two driving sessions is bounded and
nearly all of them are small.

- The dead action is **one event handler**.
- The accusatory story read is **one condition**: say nothing rather than guess
  the band's modal fetter.
- The empty vocabulary is **a data table**, and it is content the owner already
  writes better than anybody.
- The flat reward curve is **a constant and a decay policy**, and the decay
  policy is already named as open in `CLAUDE.md`.
- The truncation, the clipped tab bar, the dead end door, the free text
  birthplace and the self contradicting rail are **CSS, a link, a select and a
  suppression**.

None of them is architectural. The architecture, which is the part nobody can
retrofit, is already right: a host free engine, 603 assertions across four
gates, one drill panel behind seventeen renderers, a file that makes no outbound
request at all, and an arithmetic that prints its own error bars.

It is an A- and not an A for three reasons, each of them real. The reward curve
beyond run two is a genuine design problem and not a bug, because a release
protocol that cannot be repeated profitably is a product with one use. Cognitive
load is named in `CLAUDE.md` as architectural and needs a decision before it
needs code. And the practitioner surface that carries a third of simulated
revenue is unbuilt, with two of its three blockers being rulings the owner has
not made.

### Grade three. What the ICPs see in its potential: **B**

Weighted: Marcus A-, Sofia A-, Ana B+, Derek B, Diane C+, James C, Rosa C,
Angela D, Gordon F. Weighted grade point 2.71 of 4.00, a **B**.

**This is deliberately lower than the real potential and the gap is the
finding.** The people best placed to see what it could be, Marcus and Sofia,
grade it A- and between them are 300 of 1,000. The two who grade it lowest,
Angela and Gordon, are 185 of 1,000 and neither of them ever sees the instrument
at all. Angela in particular grades a D on a product she never reached, because
48 percent of the tab bar is off screen and nine sentences are truncated.

**What they see that the product does not know it has.** Three of them, and they
are the two lowest scorers plus the practitioner, name the same thing unprompted
across this panel and the prior ones: **the Blueprint frame with all 218
positions lit**. It is the best image in the product, it is the reason they
would answer sixty three questions, and it is currently four clicks past the
answer, on a sub bar that only exists on one tab.

**What they see that the product thinks is a weakness.** The accuracy block and
its interval. Every panel that has ever been run has protected it. It is the
only thing in the category that states its own confidence, and three of the nine
named it as the reason they believed anything else on the screen.

**What none of them sees.** Undo, the record, the delta, the export, and the
zoom resolving layers. All built, all working, all invisible.

---

# 10. The minutes scale

Two questions, answered as a scale rather than a number, because the answer is
different for the number and for the loop.

## Minutes before the product is worth something

| Minutes | What the person has | Worth |
|---|---|---|
| 0 to 1 | The four doors and an honest dash | **Nothing yet, and it is honest about it.** This is correct design |
| 0.5 | Three of 63 questions answered, a band word, plus or minus 19 | **Negative.** A verdict with no standing. This is the gate that should not open here |
| 1 to 5 | A story written, and 85 percent chance of no response | **Nothing, or worse than nothing** |
| 5 to 14 | Partway through the intake, no stated duration, no remainder | **Nothing.** This is where the intake loses people |
| **15** | **The complete intake. A number about you at 46.9 percent plus or minus 13.1** | **First real worth.** A reading, honestly bounded |
| 15 to 31 | A verdict, a direction out, and either no action or a dead one | **Held, not gained.** 45 percent stop here permanently |
| **31** | **A number that moved because of something they did** | **The product's actual value, delivered.** 31 percent reach it |
| 34 | A second, smaller move | **Compounding.** The moment belief forms |
| 36 | A third run, returning 0.00 | **Negative.** The value peaks at minute 34 and starts falling at minute 36 |

**The scale, stated in one line: 15 minutes to something worth having, 31
minutes to the thing the product is for, and as built the value peaks at minute
34 and declines from minute 36.**

## Minutes before they would pay

A person pays when a number they care about has moved because of something they
did, at least twice, and the second move was still real.

| Minutes | Share of panel who would pay | Why |
|---|---|---|
| 0 to 15 | 0 percent | Nothing has happened. Every segment in `PANEL-10k.md` that pays before a result is a segment that does not exist |
| 15 to 31 | **1 percent** | Only the protocol buyers, who pay for arithmetic on a screen rather than for an outcome |
| 31 to 34 | **9 percent** | The two real moves have landed. This is the window |
| **34 to 36** | **peak, 11 percent** | Second move banked, third not yet attempted |
| 36 to 60 | **falls to 4 percent** | The third run returns 0.00 and the offer is withdrawn by the product itself |
| Day 2 onward | **2.2 percent at the quarter** | Reference use only |

**As built, the willingness to pay window is minutes 31 to 36. It is five
minutes wide, it opens 31 minutes in, only 31 percent of the panel reaches it,
and the product does not ask for money inside it.**

**With the four bounded fixes applied**, meaning the handler connected, the
threshold lowered, the vocabulary widened and a decay policy set so run three
still returns something real, the window changes shape completely:

| Minutes | Share who would pay, fixes applied |
|---|---|
| 15 | 2 percent |
| 31 | 14 percent |
| 60, three sessions | 21 percent |
| **180, across the first week** | **peak, 27 percent** |
| Day 30 | 19 percent, and it is now a renewal question rather than a conversion one |

**The two figures the owner asked for, plainly:**

- **Minutes to worth: 15.** That is the completed intake, and it is a hard floor
  because the identification interval below 21 laws is plus or minus 19 out of
  100 and no reading is worth having at that width.
- **Minutes to pay: 31 as built, in a five minute window, reached by 31 percent.
  180 with the four fixes, in a window that stays open, reached by 27 percent at
  its peak.**

The second number is worse than the first at the margin and far better in the
aggregate, and that is the correct trade: a five minute window that 31 percent
reach converts 9 percent of a panel, and a week long window that 27 percent
reach converts 27 percent of one.

---

# 11. Director notes

**[TD] Connect `data-sout`.** `source.html:10168` and `:10173` emit two primary
action buttons and no handler exists. It is one listener. It is the single
highest value line of code available to this product and it has been shipped
dead through at least one release.

**[TD] `parseStory` must say nothing rather than guess.** When no adjective is
matched, the band's modal fetter currently fires and writes four accusations.
"Cut out of the deal" returns Lying. "Exhausted" returns Hubris. One condition.

**[PL] The vocabulary is 168 tokens and does not contain died, grief, lied,
alone, panic or exhausted.** 17 of 20 ordinary stories return nothing. The first
of four doors is the core loop and it does not work. This is content, and the
owner writes it better than anybody.

**[Owner] The reward curve returns 0.00 from run three.** Measured over eight
consecutive runs with a queue still reporting five addresses. Either release is
not uniform and the ladder shows the collapse, or the decay policy named as open
in `CLAUDE.md` gets a ruling. Until then the product has one usable session.

**[Owner] The SQ 4 threshold hides three of nine ICPs from themselves.** Sofia,
Marcus and Angela are 450 of 1,000 and all three are told "Nothing is carrying"
on a complete reading. The code comment at `source.html:5055` already states the
problem. It needs the ruling, not the code.

**[Owner] The unread gate releases after 3 of 63 questions.** Thirty seconds of
work buys a band word at plus or minus 19. The gate should hold until the
interval is worth printing, which the engine can already tell it.

**[UX] Nine of nine sentences in door two are truncated by the rail.** The
person is instructed to read them.

**[UX] 48 percent of the tab bar is off screen on a phone with no scrollbar**,
and the tab the app lands on is one of the hidden ones.

**[UX] Undo is built, works, restores exactly, and 3 percent of people find
it.** The largest named gap in `CLAUDE.md` is closed and unbanked.

**[PL] Put the Blueprint frame in front of the questions.** Three of nine named
it unprompted as the reason they would answer sixty three questions, including
the two lowest scorers and the practitioner. It is four clicks past the answer.

**[Owner] Rule the daily ceiling in the same release as the loop fix.** The
product is currently protected from its own worst outcome by being unable to
hold anybody for eight hours. That protection ends the moment item one is fixed.

---

# 12. What this file is not

Every persona, reaction, quotation, retention figure, drop off count, grade and
percentage above is **simulated model output**. The CQ values, tiers, states,
identification figures and release deltas are **engine output on fictional
inputs**. The items marked **measured in build** are facts about `source.html`
as it stands on 19 September, verified by executing it in Chromium at 1600x1000
and 390x844 across twenty two driving sessions this session, and by looking at
the images.

No figure in this document is evidence about any human being, and none of it
should be quoted as research. One landing page with two headlines, one quiz with
a stated duration and one without, and one price page with three prices would
replace three sections of this file with measurements, and each of them is
cheaper than the arguing.
