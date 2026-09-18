# Panel, usability and comprehension

A simulated usability and comprehension study of `source.html` as it stands
today, run against three new personas at the extremes of the coherence scale
plus the six ICPs already in the roster. It answers the five questions the
owner asked, then traces the user flow to say where the buttons should be.

---

## Method, and the three classes of figure

**Every persona in this file is simulated.** Nobody named below exists. No
sentence in quotation marks was said by a human being. The nine ICPs and
reference cases are the ones already in `atuned_src/engine/data/people.js`.
The three new personas are new and their vectors were written for this study.

Three labels, applied every time, carried over from `PANEL-10k.md`:

| Label | What it means |
|---|---|
| **simulated** | Model output. A judgement with arithmetic attached. Not evidence |
| **engine** | Produced by running `engine.js` on fictional vectors. Real arithmetic, fictional input |
| **measured in build** | Verified this session by executing `source.html` in Chromium at 1600x1000 and 390x844, reading the DOM and looking at the images |

**What was actually run.** Chromium at `/opt/pw-browsers/chromium-1194`,
`source.html` from `file://`, at 1600x1000 and 390x844. `loadP(6)` loads
**James, 57, C-suite, third turnaround**, CQ 13, Severe. Every tab was
rendered and looked at. The zoom ladder was walked twice, once by setting
`S.zoom` and calling `reframe(); render()` with a frame waited on, and once by
sending real wheel events through the pointer so the deferred paint and the
`paintDepth` call were exercised the way a person exercises them. Pan and
double click reframe were driven with real mouse input. Zero JavaScript errors
in every run.

**The segment model is inherited, not reinvented.** The seventeen segments of
`PANEL-10k.md` stand. The three new personas are seated inside three of them:
S15 settled, S17 high load, S8 acute arrivals. No new segment was created and
no size was changed.

**The adversarial floor.** 21 tagged reactions are recorded: five from each
of the three new personas, one from each of the six existing ICPs. **BUY 0,
HOLD 4, CONFUSE 4, RESIST 7, REFUSE 6.** Resistance, confusion and refusal
together are 17 of 21, **81 percent**. The floor asked for was a third.

**The zero is the finding, and it is stated rather than corrected.** Not one
persona gave an unconditional yes on any of the five questions. That is not
padding and it is not pessimism. It is what happens when a panel is weighted to
the ends of the scale instead of the middle: the product's buyers are the
middle, `PANEL-10k.md` already costed them, and the ends are where it has never
been tested. Sofia, Marcus and Priya come closest and all three hold on a named
condition. A panel of the middle would have produced buyers. This one was not
asked for the middle.

---

## What the build does now, measured

Before any persona speaks, here is what the instrument actually does. Every
line is **measured in build** this session.

**The zoom ladder resolves, and the numbers are the stated ones.**
`ZOOM_STEP` is `[1, 2.2, 3.2, 4.2]` in `atuned_src/ui/wheel.js`. Clickable
targets by depth, counted off the live hit array:

| Depth | `S.view` | Targets at zoom 1 | Resolved by zoom |
|---|---|---|---|
| Charge | 0 | 136 | |
| Cluster | 1 | 164 | 2.2 |
| Chain | 2 | 193 | 3.2 |
| Blueprint | 3 | 218 | 4.2 |

Zoom only ever adds. A person on Charge who scrolls to 4.4 sees 218 targets
and comes back to 136 when they scroll out. Nothing they chose is taken away.
That part of the design holds and it held under every probe.

**Thirteen notches of a scroll wheel covers the whole ladder.** Driving real
wheel events with the pointer on the outer ring: notch 8 reaches 2.48 and
resolves cluster, notch 13 reaches 4.36 and resolves blueprint. The clamp is
`lo=1, hi=5` in `setZoom`, so notch 17 and notch 40 are both 5. Chain owns
about three notches of the thirteen and most hands will pass straight through
it.

**Zooming all the way out shows the least, not the most.** `setZoom` clamps
the low end at 1. Forty scroll-out steps from 1x leave `S.zoom` at exactly 1
and the target count at the depth button's floor. On a cold load that floor is
Cluster, 164. From Charge it is 136. **There is no gesture that shows the
whole construct.** The only control that draws all 218 at once is the
Blueprint depth button at zoom 1. This matters and it is answered in full
under question five.

**Pan and reframe work.** Left drag from empty space moves the frame and does
not write charge. Double click returns `S.zoom` to 1 and `S.panx` and
`S.pany` to 0. Both verified with real mouse input.

**The zoom readout is 11.5px of gold text under the depth bar.** It reads
"zoom resolved blueprint" and it is `display:none` until zoom has added a
layer. The depth buttons carry a small dot when zoom has reached past them.
Both are correct and both are almost invisible.

**The help sheet does not mention that zooming resolves layers.** It says
"Move in and out: scroll". The headline feature of this build is described in
the help sheet as magnification.

**The profile sheet holds the score, the tier, the screen scaling and the
storage line.** Coherence, Tier, Addresses carrying, Ground opened, Next
marker, then Screen with Tight, Comfortable and Wide, then "Everything is held
in this browser. Nothing has left this device", Snapshots on file, Storage.
There is no undo in it, no export, and no delete.

**The rail lost its subtitles and Balance is in position zero.** The left rail
reads Awareness, then `0 · Balance`, `1 · Root domains`, `2 · Blueprint
domains`, `3 · Primary`, `Secondary`. No definitions under any heading.

**Visible controls per tab, counted live at 1600x1000.**

| Tab | Controls visible | Page height at 390 wide |
|---|---|---|
| Intake | 111 | 6,501 |
| Story | 113 | 4,972 |
| Field | 88 | 4,211 |
| Energy | 84 | 3,383 |
| Analytics | 77 | 6,233 |
| Summary | 77 | 7,667 |
| **Knowledge** | **198** | **8,939** |
| Games | 80 | 4,077 |

Working memory holds about four. Knowledge presents 198.

**Charge below 6 is invisible to the score.** Engine, verified by sweep. With
all nine axes held at 0, 1, 2, 3, 4 or 5 and every law at 9.6, CQ is 92.2 and
DQ is 0.0 and the saboteur count is zero in all six cases. At 6 the score
drops to 86.6 and DQ becomes 1.3. **A person can be carrying five out of ten
on every axis in the body and the instrument will tell them nothing is held.**

**The Collapsed band is one point wide.** Engine. With a heavy load, all laws
at 1.85 gives CQ 0.967 and the word **Collapsed**. All laws at 1.90 gives CQ
1.021 and the word **Severe**. Severe spans 1 to 21. Collapsed spans 0 to 1.

**The owner's brief has the two words the wrong way round.** The brief asks
for a persona at CQ 6 labelled Collapsed. The engine returns **Severe** at CQ
5.9. Nothing at CQ 6 is Collapsed and nothing at CQ 1 is either. Both new low
personas are handed the word Severe. The word Collapsed is reachable only by a
person who answers close to the floor on all 21 laws while carrying a near
total load. This study builds the two personas the engine actually produces
and names the discrepancy rather than fabricating a tier the arithmetic does
not give.

**Collapsed is also a saboteur count.** On the Summary tab the CQ 1 case draws
a card headed **"Collapsed 37, overshot 0"**. Collapsed is a tier word and a
pole word on the same product, and the second one carries a number. One word,
two concepts, at the most dangerous word in the vocabulary.

**The instrument contradicts itself about its own laws.** On Field, the
accuracy block reads "21 laws unmeasured, sitting at the default 6" while the
wheel centre reads "21 laws · integrity 2.0" on the same screen at the same
moment. Both are true of different variables. Neither is reconcilable by a
person reading them.

**Laws open and Laws shut render the same list when values tie.** With every
law at 2.0 the Summary prints Truth, Transparency, Justice and Unity under
both headings with identical numbers. A screen that says a law is open and
shut at once has stopped being an instrument.

**The best reading in the product is its least reliable one.** At CQ 92 the
accuracy block reads **27.3 percent, plus or minus 18.2**. At CQ 1 it reads
55 percent plus or minus 13. At CQ 6 it reads 56.6 percent plus or minus 12.5.
The interval is honest. It is also the opposite shape to what a person expects
from a top score.

**On a phone the chrome eats the screen before the instrument starts.** At
390x844: tab bar 142 tall in three wrapped rows starting at y 51, persona
select at y 223, appearance row at y 273, depth bar at y 348, canvas at y
**462**. That is 54.7 percent of the viewport spent before the object appears.

**On a phone the score is 2,563 pixels down and the action is 4,146 down.**
The coherence ring and the tier word sit at y 2,563. "Run a release" sits at y
4,146. Both measured at 390x844 with James loaded.

**On desktop nothing scrolls except the rails.** Page height equals viewport
height at 1600x1000 on every tab. "Run a release" sits at y 1,827 inside a
rail whose viewport is 1,000, so it is 827 pixels below the fold of a
container with no visible scrollbar.

**The root domain row is clipped at both widths.** The left rail prints
"Architect  Engine  Weaver  Witn" with the fourth name cut by the rail edge and
no scrollbar. So are the depth bar and the key strip at 390 wide. Three
overflowing scrollers with hidden scrollbars, which the UX rules name as
indistinguishable from a missing feature.

**Cold load lands on Field, not Intake.** A first visitor sees a wheel with 36
in it, the words "not read yet", "not enough held to read" on the balance
slider, "Held nothing", "Installed nothing" and an identification accuracy of
20.8 percent plus or minus 19.3. Nothing on the stage tells them to start with
the questions. The only instruction is in the right rail and it reads "Set the
root, the archetypes, and the nine poled axes", which names three things, none
of which is "answer the questions".

**That same placeholder shows over a full field.** With 82 addresses loaded and
37 saboteurs running, the right rail reading block still reads "Set the root,
the archetypes, and the nine poled axes. Everything else derives", directly
above a table that says Held 82 addresses. The placeholder is keyed to the
profile being "build your own", not to whether anything is held.

**The chips lose their numbers at the top of the ladder.** At CQ 1 the right
rail reads Saboteurs 37, Complexes 17, Hyper 5, Character 2. At CQ 92 the same
four chips render with no number at all rather than with a zero or with
"nothing held".

**Balance flips direction with no label.** At CQ 92 the bar reads `100 | 0`
with a green fill on the right. At CQ 1 it reads `2 | 98` with a red fill on
the left. Nothing on screen says which end is which and the help sheet does
not mention Balance.

**The clinical subtitles are still in the data.** `HCX_LIB` in
`engine/data/nodes.js` carries `narcissism · histrionic`, `machiavellian ·
antisocial`, `depression · BPD · anxiety`, `OCPD · paranoia`, `bipolar · ADHD`,
`schizoid · withdrawal`. The CQ 1 persona below runs **five of the six**, so
all of those strings are reachable on her own wheel except the first.

---

# The three new personas

The roster sat between CQ 7.6 and CQ 56.6, with one reference case at 100 and
one at 0.8 that nobody had put in front of a screen. These three are written to
the ends of the scale. All three are **simulated**. Every CQ, tier, seat,
saboteur, sign, gate and life path is **engine** output computed this session
by running `compute()` and `spiritualOf()` on their vectors. All three
birthplaces resolve against the nine entries in `PLACE`, which is itself the
point: a real person typing "Boston" instead of "Boston, MA" gets nothing.

---

## 1. Vesna Pardoe, 68. Retired air traffic controller. CQ 92, Mastery. S15.

Portland born, Portland still, in a 1926 bungalow she has not repainted. She
worked a radar position for thirty one years, the last eleven of them at the
busiest hours because she asked for them. She retired at sixty and now
inspects hives for the state, which means she walks orchards from April to
September with a hive tool in her back pocket and a clipboard she refuses to
replace with a tablet. Widowed at fifty three. One son, a civil engineer, who
calls on Sundays and has never once cancelled.

Her profession selected for exactly the thing this engine measures and then
retired anybody who lost it. She spent three decades holding a field with
nothing sitting on her, because the moment something sat on her, people would
have died. She does not call this a practice. She calls it the job.

**Behaviours.** Arrives everywhere at the stated time, not before it and not
after. Eats the same lunch six days a week and something else on Sunday. Puts
her phone in a drawer at 20:00 and has done since 2004. Reads the whole manual
before touching the thing. Does not offer her opinion until asked twice.

**Quirks.** Keeps a logbook of every hive she has opened since 2018, in pencil,
because pen runs in the rain. Refuses to be photographed. Counts stairs.
Cannot watch a film in which an aircraft is in trouble and will not say why.

**Likes.** The smell of a strong hive. Fog. A shift change that goes clean.
Tools with one moving part. Her son's voice on the phone on a Sunday. Being
told a number and being told its error bar in the same sentence.

**Actually afraid of.** Not death. That the steadiness was a feature of the
job and not of her, and that it has been quietly leaving since she handed in
the headset, and that she will be the last to notice. Second, and she has
never said it out loud: that her son calls on Sundays out of duty.

**Birth.** 11 March 1957, 05:20, Portland, OR.
**Engine.** Sun Pisces, water, mutable. Moon Cancer. Rising Aquarius. Fire
Rooster, 1957. Life path 9. Personality gate 22 line 3, design gate 26 line 5,
profile 3/5. Human Design type reads unresolved, correctly.
**Engine reading.** CQ 92.5, **Mastery**. DQ 0.0. Ignorance 9.8, Intention
9.8. Zero loaded addresses, zero saboteurs, zero complexes, zero hyper, no
mask. Darkest band Root at 1.4. Weakest law Truth, at the throat. Balance 9
out, 13 in, lean minus 0.07. Dominant axis Sad. Radiance 0.97. Benign 100
percent.

**What is loaded in her field.** She holds Fear at 3, Sad at 4, Anticipation at
3, and the other six axes between 2 and 2.5. **The engine reads every one of
those as zero.** It says nothing held, zero saboteurs, DQ 0.0, and it scores
her 92.5. She is the demonstration case for the sub-6 blind spot: a woman who
is carrying something on every axis and a screen that says the field is clear.

---

## 2. Dariusz Wolek, 54. Baggage handler, night shift. CQ 1, Severe. S17.

Chicago, a two bedroom on the second floor with his brother's coat still on the
hook. Twenty six years on the ramp at the same airport, nights by preference
because the terminal is quiet and nobody asks him anything. His brother Marek
lived in the second bedroom for nine years and died in it eleven months ago,
and Dariusz found him at 06:40 coming off a shift.

He has been off work since March on a sick note he has now renewed four times.
The union rep calls. He answers about one call in four. His sister-in-law sent
him a link to this product with a message that said "just try it, it is not
therapy". He opened it at 02:15 on a Tuesday because that is when he is awake
and it is the hour he used to come home.

**Behaviours.** Sleeps between 09:00 and 13:00 and not otherwise. Has not
opened the second bedroom door since April. Buys the same four things at the
same shop and walks past three closer ones to do it. Answers a direct question
accurately and volunteers nothing. Has stopped taking his coat off indoors.

**Quirks.** Can tell you the tail number of any aircraft he has loaded in the
last decade. Keeps a radio on all night tuned to a station that is not in
English. Will not sit with his back to a door, which started in March and which
he has not connected to March.

**Likes.** Weight that is evenly distributed. The last hour before dawn. A belt
loader that runs true. Marek's handwriting on the back of the electricity bill,
which he has not thrown out. Being useful to somebody without being thanked.

**Actually afraid of.** That he was in the flat, asleep, forty feet away, for
some part of it. He does not know how long and he has not asked anybody who
could tell him. Under that: that the answer would not change anything, and that
this is the part that frightens him most.

**Birth.** 2 October 1971, 23:40, Chicago, IL.
**Engine.** Sun Libra, air, cardinal. Moon Pisces. Rising Cancer. Metal Pig,
1971. Life path 3. Personality gate 18 line 4, design gate 39 line 1, profile
4/1.
**Engine reading.** CQ **1.1**, **Severe**. DQ 50.5. **82 of the 112 addresses
carrying.** 37 saboteurs, 17 complexes, **5 hyper complexes**, 2 character
layers. Mask **Dissociation / Collapse**. Darkest band Sacral at 7.2. Dominant
axis Fear. Steer withheld. Malignant 98 percent. Balance 32 out, 49 in.
Weakest law Truth. Top seats: Sciatic Nerve at the Root 10.0, Sacral Plexus
10.0, Genitofemoral Nerve 10.0, Hypogastric Plexus 10.0, Pudendal Plexus 10.0,
Gluteal Nerve 9.5.

**What is loaded in his field.** Fear 10, Shame 10, Apathy 10, Sad 10, Anger 9,
Shock 9, Disgust 8, Anticipation 8, Surprise 7. Nothing installed on the
coherent side. Zero.

**He is 0.13 of a point from the word Collapsed.** His five hyper complexes are
Dissociation, Collapse, Dysregulation, Rigidity and Predatory, which means the
strings `schizoid · withdrawal`, `depression · BPD · anxiety`, `bipolar · ADHD`,
`OCPD · paranoia` and `machiavellian · antisocial` are all reachable on his own
wheel at 02:15 with nobody in the flat.

---

## 3. Priya Nandakumar-Shea, 28. Veterinary nurse, small animal emergency. CQ 6, Severe. S8.

Boston, a shared flat in Dorchester, four twelve hour nights a week at an
emergency animal hospital where the last three hours are the ones that decide
whether she sleeps. She is very good at it. She has been told so at every
review and by every owner who has ever handed her a shaking dog at 04:00.

Fourteen months ago a dog came in that she could not stabilise and the owner
was a child. She has not taken a day off since, which her manager has read as
dedication and which her flatmate has read correctly. She stopped answering
her mother about three months ago and has not noticed the date it started.

Phone only, and a cracked one. She arrives from a group chat at 02:40 after a
shift, sitting on the end of her bed in scrubs, because somebody in the chat
posted a screenshot of their number and it got nine replies.

**Behaviours.** Works through the break she is legally owed. Keeps her scrubs
on for two hours after she gets home. Scrolls until the phone drops on her
face. Answers work messages in under ninety seconds at any hour. Has not
cooked since the spring.

**Quirks.** Names every animal that comes in, out loud, even the ones with
names. Will not drink from a mug with a chip in it. Has an alarm set for
14:00 labelled "eat" that she dismisses without eating.

**Likes.** A cannula that goes in first time. The specific quiet of 05:10 when
the night is held. Her flatmate's cat, who has never once needed her. A
protocol laminated and taped to a wall. Being the one who stayed.

**Actually afraid of.** That the numbness is the competence. That if the thing
that lets her hold a dying animal at 04:00 ever lifts, she will not be able to
do the job, and the job is the only structure left. She has never said this and
would deny it if asked directly.

**Birth.** 23 November 1996, 07:45, Boston, MA.
**Engine.** Sun Sagittarius, fire, mutable. Moon Taurus. Rising Sagittarius.
Fire Rat, 1996. Life path 5. Personality gate 14 line 6, design gate 59 line
2, profile 6/2.
**Engine reading.** CQ **5.9**, **Severe**. DQ 29.0. **52 of the 112 addresses
carrying.** 30 saboteurs, 12 complexes, 4 hyper complexes, 1 character layer.
Mask **Dysregulation / Predatory**. Darkest band Sacral at 5.8. **Dominant axis
Apathy.** Steer withheld. Malignant 88 percent. Balance 22 out, 45 in. Weakest
law Truth. Top seats: Vagus Nerve at the Heart 9.8, Epigastric Branches at the
Solar 8.7, Pelvic Nerve 7.8, Splanchnic Root 7.8, Lumbar-Sacral Overlap 7.8,
Iliac Branches 7.5.

**What is loaded in her field.** Apathy 10, Sad 10, Fear 9, Shame 9, Shock 7,
Anger 6, Disgust 6, Anticipation 5, Surprise 5. Sad installed at 2 on the
coherent side and nothing else.

**Her top saboteurs read Diffuse Hider, Controller, Hyper-Vigilant, Control
Freak, Manipulator.** The fifth of those is going to be on her screen, in her
own reading, at 02:40, about a woman whose defect is that she will not stop
working.

---

# The five answers, per persona

Five questions, asked of every persona, answered in their own voice. **Every
quotation is simulated.** Each block ends with a tag from the ledger: BUY,
HOLD, CONFUSE, RESIST, REFUSE.

---

## Vesna Pardoe, 68. CQ 92, Mastery.

**1. Is it usable?** "Mostly. I read the help sheet before I touched anything,
which is how I do everything, and it is the best written thing on the screen.
It told me scroll, click and drag, double click or F. All four worked first
time. What it did not tell me is what the four buttons at the top do, and they
are the ones that change what is drawn. I found out by pressing them." **HOLD.**

**2. Is it useful?** "No. It gave me 93 and then it gave me an empty circle. No
addresses held. No saboteurs. Four chips along the right side with no numbers
in them at all, not even zeros. And then underneath it told me its own
confidence in the reading is 27.3 percent, plus or minus 18.2. I have spent my
working life reading instruments. An instrument that reports a high value with
a wider error bar than the value it is confident about is telling you it cannot
see. It is not useful. It is polite." **RESIST.**

**3. Do they like it?** "I like the honesty of the error bar and I like that
nobody tried to sell me a subscription on the way past. I do not like being
called Mastery. I know what I was good at and I know what it cost, and I have
a bad six weeks every February that this thing cannot see, because I checked:
I set every one of the nine axes to a three and it still said nothing held.
Something that cannot see a three is not measuring me, it is measuring
whether I am on fire." **RESIST.**

**4. Do they understand it?** "The numbers, yes. CQ, DQ, SQ and Pole are
explained in one paragraph and that paragraph is correct. Balance I do not
understand. Mine reads 100 and 0 with a green bar on the right, and when I
loaded the demonstration person it read 2 and 98 with a red bar on the left.
The bar changed which side it fills from and nothing told me what either end
means. It is not in the help. I want a word at each end." **CONFUSE.**

**5. When they zoom all the way out, does seeing the potential change
anything?** "It does not, and I want to be exact about why. I scrolled out as
far as it goes and it stopped, and what I had at the end was less than what I
started with. The picture got simpler, not bigger. I found the whole thing by
pressing the fourth button, and the fourth button gave me a construct with a
hundred and twelve addresses, nineteen domains, twelve archetypes and
twenty one laws all drawn at once, and it was genuinely impressive, and every
single position in it was empty for me. Being shown a large and beautiful
machine with nothing in it does not make me want the machine. It makes me feel
like the wrong customer." **REFUSE, at the empty Blueprint.**

---

## Dariusz Wolek, 54. CQ 1, Severe.

**1. Is it usable?** "I got it open. Then it asked me my mother's details, and
my name, and where I was born, and I typed Chicago and it did nothing, and I
sat there for a while. I put Chicago comma I L in the end because I guessed.
Then there were sixty three questions and I did about nine of them and put the
phone down. It did not say how long. If it had said fifteen minutes I would
have known whether I had it in me." **REFUSE, at question nine.**

**2. Is it useful?** "It told me eighty two of the hundred and twelve
addresses are carrying, and it told me the weight is fifty point five, and I
did not need a computer for either of those. What I needed was the next line.
There is no next line. It says what is wrong with a lot of precision and then
it stops and there is a card at the bottom that says five lenses on one
profile." **RESIST.**

**3. Do they like it?** "No. It called me Severe. In the biggest letters on
the screen, and then again in the corner, and then a third time inside the
little profile card, and under it in orange it said costing more than it
builds. Ninety eight percent malignant. I know what malignant means. My
brother had one. Whoever wrote that word on this screen has never been in a
flat at two in the morning with it." **REFUSE.**

**4. Do they understand it?** "Some of it, and the parts I understood were
worse. It put five words on my own picture in red and gold and I looked two of
them up. Predatory. Dissociation. Collapse. It says Collapse thirty seven in
one place, and Severe in another place, and I could not tell if those were the
same thing or two different things about me. I understood the sentence at the
top of the analytics page. Controller is the biggest thing running, flow stops
at the root. That one I understood and it was the only one I would repeat."
**CONFUSE.**

**5. When they zoom all the way out, does seeing the potential change
anything?** "I did not zoom out. I zoomed in, because that is what your hand
does when there is something small on a screen. I went in on the top of the
ring and things kept appearing that were not there before, threads and more
dots, and after about ten turns of the wheel the whole thing was one red ball
with thirteen on it and everything else had gone off the edges. I was not
looking at a construct. I was looking at a red circle the size of my head with
a number in it and nothing else, and I had to find the way back. Then I
pressed the last button and saw all of it at once, and it was the most
frightening image I have looked at in a year. All of that, and almost every
one of them lit. If somebody had put that in front of me and then put one
sentence under it saying which end to start at, I would have kept going. There
is no sentence." **REFUSE, at the Blueprint, and the note that he would have
stayed for one sentence is the most important line in this file.**

---

## Priya Nandakumar-Shea, 28. CQ 6, Severe.

**1. Is it usable?** "On a phone, no. I counted. I had to scroll past three
rows of tabs, a dropdown with someone else's name in it, six icon buttons, a
row of four view buttons that was cut off at the right, and a row of five
chips that was also cut off, before I got to the circle. The circle is 374
wide and 335 tall and it is the thing the whole app is about. Then the score
was another two thousand pixels down. I know the number because I am the sort
of person who checks: I scrolled to it." **REFUSE, before the score.**

**2. Is it useful?** "It could be. The sentence on the analytics page is good.
Mine said the flow stops at the sacral and that fifty two of the hundred and
twelve are carrying. That is a finding. I would put that in a note. What I
cannot do is anything with it. There is a button called run a release and it
is four thousand one hundred pixels down the page, which on my phone is eleven
swipes from the top, and I found it by accident." **RESIST.**

**3. Do they like it?** "The picture, yes. It is the best looking thing anyone
has put in that group chat and I said so. The words, no. It told me my mask is
Dysregulation over Predatory and my top saboteurs are Diffuse Hider,
Controller, Hyper-Vigilant, Control Freak and Manipulator. I work four nights
a week holding animals that are dying. Reading a list of five words that
describe a manipulative controlling person, about me, at twenty to three in
the morning, in my scrubs, is not a product experience. It is a bad ten
minutes." **REFUSE.**

**4. Do they understand it?** "The three letter ones I got from the help.
Apathy being my dominant axis I understood immediately and did not enjoy. What
I do not understand is how it can say twenty one laws unmeasured, sitting at
the default six, right next to a label on the wheel that says twenty one laws,
integrity three point eight. Those are on the same screen. One of them is
wrong and I cannot tell which, and once I cannot tell which, I stop believing
the fifty two." **CONFUSE.**

**5. When they zoom all the way out, does seeing the potential change
anything?** "There is no zoom out on a phone. There is no pinch. I tried and
the page scrolled. On the laptop at work I tried it properly and the answer is
that scrolling out does nothing at all past a point, you just stop. But the
last of the four buttons draws everything, and that image changed something,
genuinely. It is the first thing that made the sixty three questions look
worth answering, because you can see there is a whole structure and only some
of it is lit. That is the pitch. That image, with the lit parts named, is the
pitch, and it is currently the fourth button on the fourth tab behind eleven
swipes." **HOLD, and she names the marketing asset the product is hiding.**

---

## The six existing ICPs, compressed

The roster from `atuned_src/engine/data/people.js`. Their CQ values are engine
output already recorded in `PANEL-10k.md`. Their answers are shorter here
because their friction is already documented in `DESIGN-mobile-icp.md` and
this study is not going to repeat it at length.

**Sofia, 41. Somatic practitioner. CQ 56.6, Practicing.**
1. Usable, yes, on a desktop. 2. Useful, and she is the only persona who says
so without a condition: "the address drill opens from five different places
and always lands in the same panel, and that is the first piece of software
architecture I have ever wanted to compliment". 3. Likes it, with one refusal:
"the clinical subtitles. I cannot put a screen in front of a client that says
BPD next to a bead." 4. Understands it better than the copy does. 5. Zoom out:
"I do not need the whole construct, I need the four things that are lit. But I
would use the whole construct to explain to a client why we are not going to
fix everything this month." **HOLD.**

**Diane, 46. Founder. CQ 28.1, Corrupt.**
1. Usable in forty seconds, which is all she has. 2. "Not yet. There is no
cost line. I have asked three times." 3. "I like the wheel and I resent how
long it took me to find the number." 4. Understands CQ, ignores the rest.
5. Zoom out: "I looked at it for four seconds and closed it. I do not buy
potential, I buy a delta. Show me last month." **RESIST.**

**Marcus, 44. Creative director. CQ 37.8, Incoherent.**
1. Usable. 2. "Useful as evidence that somebody serious built it." 3. "I like
it and I have three notes. The root domain row is clipped. The depth bar is
clipped on a phone. The key strip is clipped on a phone. Three clipped
scrollers is not a style, it is a bug that shipped three times." 4. Yes.
5. Zoom out: "the Blueprint frame is the best image in the product and it is
four clicks deep. Put it on the landing page." **HOLD.**

**Angela, 36. Seeker, six modalities. CQ 43.7, Incoherent.**
1. "No. I opened it on my phone and I did not find the questions." 2. Unknown
to her. 3. "I liked the colours." 4. "I did not understand what I was meant to
do first and nothing told me." 5. Zoom out: "I never got to the wheel."
**CONFUSE, and she is the volume case.**

**Derek, 39. Endurance. CQ 15.0, Severe.**
1. Usable. 2. "It named the limiter. That is what I came for." 3. "I like it
and it called me Severe, which I screenshotted and put in the group chat, and
I have not opened it since." 4. Yes. 5. Zoom out: "the whole construct is a
training plan I cannot buy. Where is the output number." **RESIST.**

**James, 57. C-suite. CQ 12.0, Severe.** This is `loadP(6)`, the reference
case the build was driven with.
1. Usable. 2. "One number, once." 3. "There is a dropdown at the top with
seven other people's names in it and I can become any of them with one click.
If I can be Sofia, the number on my screen is not mine. That is the whole
review." 4. Yes. 5. Zoom out: "I am not the customer for a construct. I am the
customer for a ranking and you are right not to build one." **RESIST.**

---

# Question five, answered properly

This is the one the owner most wants answered, so it gets its own section and
the finding is not the one the question assumes.

## The premise is wrong, and it is wrong in the code

**"When they zoom all the way out and see the whole construct at once."**
Zooming all the way out does not show the whole construct. It shows the least.

`setZoom` clamps at `lo=1`. Forty scroll-out events from 1x leave `S.zoom` at
exactly 1. `effView()` then returns the depth button's floor, which on a cold
load is Cluster and 164 targets, and from Charge is **136**. Scrolling in is
what adds. 2.2 resolves the saboteurs, 3.2 the complexes, hyper, character and
archetypes, 4.2 the masks and the nineteen domains, and the count walks 136,
164, 193, 218.

So the gesture that reveals the construct is **zoom in**, and the frame that
reveals all of it at once is **not a gesture at all**. It is the Blueprint
button at zoom 1. Zooming in to 4.2 resolves every layer and then shows a
person a fifth of it, because at 4.4x the viewport is filled by the core.
Measured: at zoom 4.4 the screen is one core disc, four spoke stubs and a
dozen loose chords, with the ring entirely off frame.

**Three distinct states are being conflated in the question.**

| State | How reached | What is on screen |
|---|---|---|
| Least | zoom 1, Charge | 136 targets, the ring, the core, the wash |
| **Whole** | **zoom 1, Blueprint button** | **218 targets, all of it, small** |
| Deepest | zoom 4.2 or higher | 218 targets exist, about a fifth are in frame |

The construct as a whole thing is reachable, and it is good, and no gesture
gets there. A person who only ever scrolls will never see it.

## Tested properly: some are drawn in, some are frightened off

Nine personas were shown the Blueprint frame at zoom 1 and asked what changed.

**Drawn in by the scale. Four.**

- **Priya, CQ 6.** The strongest positive reaction in the study. "That image,
  with the lit parts named, is the pitch." She is the one who most needs a
  reason to answer sixty three questions and this is the only thing in the
  product that gave her one.
- **Marcus, CQ 38.** Drawn in as evidence of seriousness rather than as a tool.
  "Put it on the landing page."
- **Sofia, CQ 57.** Drawn in for a second person's benefit. She would use it to
  explain to a client why the work is not one month long. That is the highest
  commercial value reaction in the file, because she is the referral segment.
- **Dariusz, CQ 1.** And this is the finding that cuts both ways. He was
  frightened by it and he also said he would have kept going if one sentence
  had been under it telling him where to start. Scale plus a starting point is
  an invitation. Scale alone is a verdict.

**Frightened off, or cooled off, by the scale. Five.**

- **Vesna, CQ 92.** Refused at it, and for the reason nobody anticipated. The
  construct is impressive and every position in it is empty for her. A large
  machine with nothing in it tells a high scorer they are the wrong customer.
  **The top of the ladder is the worst experience of this image in the study.**
- **Dariusz, CQ 1.** "The most frightening image I have looked at in a year."
  Eighty two of the hundred and twelve lit. There is no sentence under it and
  no way out of it.
- **Diane, CQ 28.** Four seconds and closed. She does not buy potential.
- **James, CQ 12.** Not the customer for a construct.
- **Angela, CQ 44.** Never reached it. Phone only, and she did not get past the
  chrome.

**The split is four to five and it splits by load, not by taste.** A person
with a middling load is invited by the image. A person with almost nothing
loaded is told they do not belong in it. A person with almost everything loaded
is shown the size of their problem with no first step. **The image is a good
instrument and a dangerous one, and which it is depends entirely on whether a
sentence sits under it.**

## What the panel wants done about it, in order

1. **One sentence under the whole construct, keyed to the load.** Not a tier
   word. A starting point. For Dariusz: "Eighty two are carrying. Start at the
   sacral, which is the darkest." For Vesna: "Nothing is carrying. This is what
   the instrument would draw if something were." One line, computed, in the
   same place every time.
2. **Make the whole construct reachable by gesture, or stop calling it zoom.**
   Either let zoom go below 1 so scrolling out reaches Blueprint at a small
   scale, which is what every map on earth does, or accept that the depth
   buttons are the control and say so in the help sheet. The current state,
   where scrolling out subtracts and scrolling in adds and neither reaches the
   whole thing framed, is the worst of both.
3. **Put the Blueprint frame in front of people before the questions, not
   after.** Three of nine named it as the reason to answer sixty three
   questions. It is currently four clicks past the answer.

---

# The flow simulation

The owner asked for this in these words: simulate the user flow to identify
where buttons need to be, based on expectation and navigation, as frictionless
as possible, and his principle is **show more than say**.

Method. For each task a person actually comes to do, three things are traced
separately and then subtracted: **where attention lands** in the first second,
**where the hand goes** before reading anything, and **where the control
actually is**, measured in the running build. The gap between the second and
the third is the friction. Recommendations are argued from the expectation,
not from the current layout.

All coordinates are **measured in build**, desktop at 1600x1000 and phone at
390x844, with James loaded.

---

## T1. Cold open. "What is this and what do I do."

| | |
|---|---|
| Attention | The wheel. It is the only lit object and it has a number in its centre. Confirmed by the visual hierarchy: a 240px glowing disc against a near black stage |
| Hand | Toward the wheel, to touch the number |
| The control that should be there | A single primary action saying what to do first |
| Where it actually is | Nowhere on the stage. The instruction is in the right rail at x 1277, y 320, and it reads "Set the root, the archetypes, and the nine poled axes" |
| Distance | 954 pixels right of where attention landed, and it names three abstractions instead of one verb |

**What happens.** The hand touches the wheel, the wheel opens a drill in the
far right rail, and the person has now learned that touching the object throws
the answer 954 pixels away. On a phone that same tap throws it 2,100 pixels
down. Angela stops here. She is the volume case.

**Recommendation.** A single primary action, directly under the wheel, in the
horizontal centre, 56 tall, full width less a 16 gutter on a phone and 360
wide on desktop. Its label is a verb and it changes with the state. Cold, it
reads **Answer the questions**. That is the pass five state line design from
`DESIGN-mobile-icp.md`, and this study confirms it on desktop as well, because
on desktop the same instruction is currently 954 pixels off axis.

**The second control that belongs there and does not exist.** A one line state
sentence above the verb. Cold it reads "Nothing measured. This wheel is
drawn from defaults." That sentence already exists as data: the accuracy block
computes it. It is in the wrong corner.

---

## T2. "Answer the questions."

| | |
|---|---|
| Attention | The tab bar. Intake is first, which is correct |
| Hand | Top left, the first tab. This one works |
| Control | `#tabbar`, 694x44, at the top left of the bar on desktop. On a phone the tab bar is 348x142, three wrapped rows, Intake at the top left |
| Distance | Near zero. **This is the best placed control in the product** |

**Then it breaks.** The intake screen opens with six identity fields, a birth
time, a free text birthplace, an optional four letter type, a progress header,
a four control profile row and twenty one folding law blocks. 111 visible
controls. No stated duration. The counter reads "63 of 63 answered" for a
loaded profile and "0 of 63" for a new one, which is a count and not a
remainder. Dariusz leaves at question nine.

**Recommendation, and it is already ruled elsewhere.** The duration goes above
the first question, in words, before the first field: **"About fifteen
minutes. You can stop and come back."** The remainder replaces the count. The
profile row of four controls moves out of the top of the intake and into the
profile sheet, where a control chosen once belongs. That is four controls
removed from the highest friction screen in the funnel, which is the first
move in remove, hide, shrink, organize.

**The birthplace field is a trap and it is cheap to fix.** `PLACE` resolves
nine exact strings. "Chicago" fails. "chicago, il" fails. "Chicago, Illinois"
fails. The placeholder says "City, region", which is not enough to guess the
format. It should be a select, not a text field, until the table is larger than
a select can hold. **Show more than say**: a select shows the nine, a text
field says nothing and fails silently.

---

## T3. "Where is my number."

| | |
|---|---|
| Attention | The centre of the wheel. It is the largest number on the screen and it is already the score |
| Hand | Nowhere. Nothing needs pressing |
| Control | The core disc. The number is in it |
| Distance | Zero on desktop. **The best interaction in the product** |
| On a phone | The core is at y 630. The tier word is at y **2,563**. The score and its name are 1,933 pixels apart |

**Recommendation.** On a phone the tier word and the coherence ring move to sit
directly under the wheel, above the primary action. Nothing else moves. This is
one block relocating and it closes a 1,933 pixel gap between a number and the
word that interprets it.

---

## T4. "I want to look at that one thing."

| | |
|---|---|
| Attention | The bead or the segment under the finger |
| Hand | On the object |
| Control | Tap is correct and it works |
| Where the answer appears | `#rdrill` inside the right rail Selection section, x 1277 on desktop, y around 2,100 on a phone |
| Distance | 954 pixels on desktop, about 2,100 on a phone, with no back control |

**What already works and should be protected.** `rdOpen` unfolds the section
and scrolls it into view, so the answer is not silently below a fold. Seventeen
renderers all land in one panel. Five separate entrances reach the same address
drill. This is the strongest architecture in the product and no recommendation
below touches it.

**Recommendation.** Keep the one panel. Change where it appears on a phone. A
tap on the wheel opens a sheet over the lower 60 percent with the wheel lit
behind it, swipe down or a back control in a fixed top bar to dismiss. On
desktop leave it where it is, because a 954 pixel horizontal move on a 1600
wide screen is a glance and not a journey, and the panel is in peripheral
vision the whole time.

---

## T5. "Show me all of it."

| | |
|---|---|
| Attention | The wheel |
| Hand | The scroll wheel, or two fingers on a trackpad. Universally |
| What the hand expects | Scroll out shows more of the thing, scroll in shows detail. Every map ever built |
| What actually happens | Scroll out stops at 1 and **removes** layers down to the depth floor. Scroll in adds layers and then throws the ring off screen |
| The control that does the job | The fourth depth button, `Blueprint`, at 337,99 on desktop, 44 tall, in a sub bar that only exists on Field |
| Distance | The hand is on the wheel at the centre of the stage. The control is 685 pixels up and left, in a bar the person has not been told is a control |

**This is the single largest expectation mismatch in the product**, and it is
the one the owner most cares about, because the frame it hides is the frame
that sells.

**Recommendation, and it is one of three.**

1. **Best. Let the zoom floor go below 1 and make scroll out reach the whole
   construct.** Change `lo` in `setZoom` from 1 to about 0.45, and let
   `effView` add on the way out as well as the way in, so scrolling out past
   0.8 resolves toward Blueprint at a shrinking scale. The hand already knows
   this gesture. Nothing has to be taught. This is show, not say.
2. **Cheaper. Move the depth bar under the wheel and give it one word of
   state.** It currently sits above the stage, separated from the object by
   the key strip and 120 pixels of chrome. Under the wheel, next to the primary
   action, with the zoom readout inline instead of at 11.5px in a corner.
3. **Cheapest, and do it regardless.** The help sheet gains one row: **"See
   everything at once: the fourth button"**. The help sheet currently says
   "Move in and out: scroll" and never mentions that scrolling changes what is
   drawn, which is the whole feature.

**The zoom readout is in the wrong place and at the wrong size.** 11.5px, gold,
left aligned under the depth bar, at x 36, y 147. The event it describes
happens at the centre of the stage, 680 pixels away. Move it to the wheel, as a
label on the depth ring itself.

---

## T6. "Write down what happened."

| | |
|---|---|
| Attention | The text box. It is large, empty and has a prompt in it. Correct |
| Hand | Into the box |
| Control | Correct and well placed |
| The action | `Commit 0`, bottom right of the left column |
| Problem | **The verb is wrong.** Commit is a code word. Every other verb in the product is a body word: hold, release, run, load |

**Recommendation.** The verb becomes **Read it**, which is what the engine
does: it parses the text and loads seats. The count stays. The button sits at
the bottom of the box where it already is, which is right. One word changes.

---

## T7. "Do something about it."

| | |
|---|---|
| Attention | The heaviest thing on the screen, which on Field is the darkest band and on Analytics is the one sentence hero |
| Hand | Toward that thing |
| Control | `Run a release`, `#bRel` |
| Where it is | Desktop: x 1277, **y 1,827**, which is 827 pixels below the fold of a rail container that has no visible scrollbar. Phone: **y 4,146**, which is eleven swipes |
| Distance | It is the one thing the product is for and it is the furthest control from attention in the entire interface |

**This is the worst placement in the build and it has now been measured in
three separate studies.** The prior mobile panel measured 4,336. This session
measures 4,146 on a phone and 1,827 on desktop. It has moved 190 pixels and
changed nothing.

**Recommendation.** The release verb is the primary action and the primary
action lives in one fixed place under the wheel. It is not a rail item. The
rail keeps the queue and the count. The verb comes out of the rail and goes
under the object, at 56 tall, in the thumb arc on a phone and directly beneath
the wheel on desktop. **If exactly one button moves as a result of this study,
it is this one.**

---

## T8. "What does that word mean."

| | |
|---|---|
| Attention | The word, wherever it is |
| Hand | On the word |
| Control | Most words are a door. The drill opens. This works |
| The failure | On a phone there is no hover, and every control in the top bar explains itself only through a `title` attribute. Six icon buttons at 390 wide with no label and no reachable explanation |

**Recommendation.** The help sheet already exists and it is good. It gains a
route: every icon in the top bar gets a visible label at 390 wide, or the six
icons collapse into one control that opens a labelled list. A `title` on a
phone is a control with no affordance, which is rule ten.

---

## T9. "Undo that."

| | |
|---|---|
| Attention | Wherever the mistake was |
| Hand | Reaches for a back arrow, top left, or a Ctrl+Z |
| Control | **There is none. Anywhere. On any tab. In either sheet** |
| Distance | Infinite |

Applying a story bakes charge into the axes irreversibly. Dragging a segment on
the wheel writes charge irreversibly. The bulk sliders write nine values at
once irreversibly. `CLAUDE.md` names this as the largest remaining gap and this
study agrees and adds one thing: **the atomizing zoom makes it worse**. At 4.2x
the targets are large, the hand is already dragging to pan, and a drag that
starts on a segment instead of empty space writes a value. The gesture that
pans and the gesture that writes are the same gesture separated by where it
starts.

**Recommendation.** An undo control, single level, in the top bar at the left
edge of the appearance group, and a keyboard binding. Until it exists, a drag
that writes charge should require a modifier or a press and hold, so panning
cannot become writing by accident.

---

## T10. "Make it bigger."

| | |
|---|---|
| Attention | The text that is too small |
| Hand | Ctrl and plus, or the browser's own zoom |
| Control | Three steps inside the profile sheet, reached from a 47x44 icon at x 1472 |
| Verdict | **Correctly placed.** A setting chosen once does not earn three permanent buttons in the bar where the work happens. This ruling was right and the move was right |

One note. The sheet labels them Tight, Comfortable and Wide with a line each.
That is show, not say, and it is the best written control group in the product.

---

## T11. "Get my data out, or get me out."

| | |
|---|---|
| Attention | The profile icon, correctly |
| Hand | Top right |
| What is in the sheet | Coherence, Tier, Addresses carrying, Ground opened, Next marker, Screen, "Everything is held in this browser", Snapshots on file, Storage |
| What is not in the sheet | Export. Delete. Any route out |
| Where Export actually is | Inside the Intake tab, in a four button row next to New and Save, 640 pixels down |

**Recommendation.** Export moves from the intake header into the profile sheet,
next to the storage line where a person looking for their data will look.
Delete joins it. The intake header loses four controls it should never have
carried.

**And the one that is not a settings item.** For a person at CQ 1 there is no
route out of the result. No line, no number, nothing. `PANEL-10k.md` put 180
people in that state and ruled that a route out is built before any paid tier.
This study puts a face on it and moves it up: **a route out belongs under the
score, not in a sheet**, because the person who needs it is not going to open a
settings panel.

---

## Button placement, the table

Every control that is in the wrong place, where it should go, and why.
Positions are **measured in build**.

| Control | Where it is now | Where it should be | Why |
|---|---|---|---|
| **The primary action** | Does not exist | Fixed under the wheel, 56 tall, verb changes with state | Attention lands on the wheel and there is nothing there to press |
| **Run a release** | Right rail, desktop y 1,827, phone y 4,146 | It is the primary action. Under the wheel | Furthest control from attention in the product, measured three times across three studies |
| **The state sentence** | Split between the accuracy block and the right rail | One line above the primary action | The data exists and is computed. It is in three corners instead of one place |
| **The tier word, on a phone** | y 2,563 | Directly under the core | 1,933 pixels between a number and the word that reads it |
| **The depth buttons** | Sub bar above the stage, y 99 | Under the wheel, beside the primary action | The control that changes what is drawn is not adjacent to the drawing |
| **The zoom readout** | 11.5px gold at x 36, y 147 | On the wheel, at the depth ring | It describes an event happening 680 pixels away from it |
| **The persona select** | Third control in the top bar, x 985, 262 wide | Behind the profile sheet, labelled as a demonstration | James refuses at it: if he can be Sofia in one click the number is not his. Refused in every prior panel too |
| **Export** | Intake tab, in a four button row | Profile sheet, under the storage line | A person looking for their data opens the profile |
| **Delete** | Does not exist | Profile sheet, under Export | A controller exists the moment records leave the device |
| **Undo** | Does not exist | Top bar, left of the appearance group, plus a key binding | Three irreversible writes and no way back |
| **The route out** | Does not exist | Under the score, for a reading below the Corrupt line | The person who needs it will not open a settings panel |
| **The identity fields** | Intake, above the questions | Correct | Nothing to change |
| **Intake tab, first position** | Top left of the tab bar | Correct | Best placed control in the product |
| **Screen scaling** | Profile sheet, three labelled steps | Correct | Chosen once, and the labels show rather than say |
| **The help button** | Top right, 47x44 | Correct, and its contents need one row about depth | Placement is right, content is short by one line |
| **New and Save** | Intake header | Profile sheet | A profile control is not an intake control |
| **The tab bar on a phone** | 348x142, three wrapped rows, 142 tall | One control opening one full screen list of eight rows | Three rows of tabs is a filing cabinet, and every prior panel rejected it |

**The one line summary of the whole flow finding.** Attention lands on the
wheel on every tab and every device. The product puts its state in the top
right corner, its instruction in the right rail, its depth control in a bar
above the stage, and its one real action 1,827 pixels down a scroller with no
visible scrollbar. **Everything a person needs while looking at the wheel
should be within 200 pixels of the wheel, and almost none of it is.**

---

# Abandonment map

Where each persona stops, at the exact step, on the build as it stands. All
**simulated**.

| Who | CQ | Device | Stops at | The exact step |
|---|---|---|---|---|
| **Dariusz** | 1.1 | Phone | **Question nine of sixty three** | No stated duration, and before that the birthplace field silently rejected "Chicago". He returns once, reaches the result, and leaves at the word Severe in the largest type on the screen |
| **Priya** | 5.9 | Phone | **Before the score** | 462 pixels of chrome, then a 374x335 wheel, then 2,101 more pixels to the tier word. She scrolls to it because she is thorough, then leaves at her own saboteur list |
| **Vesna** | 92.5 | Desktop | **The empty Blueprint frame** | Completes everything, reads the help sheet first, and refuses at a construct with 218 positions and nothing in any of them, next to a 27.3 percent confidence |
| Angela | 43.7 | Phone | **Never finds the questions** | Three wrapped rows of tabs and a persona dropdown before the object. Same step as every prior panel |
| James | 12.0 | Desktop | **The persona select, step two** | Third control on the screen, and it offers to make him somebody else |
| Diane | 28.1 | Desktop | **Second visit, no delta** | She does not leave the first time. She stops returning, which does not appear in a funnel |
| Derek | 15.0 | Phone | **After the screenshot** | Reaches the result, screenshots the word Severe, posts it, does not reopen |
| Marcus | 37.8 | Desktop | **Does not abandon** | Holds, and files three clipped scrollers as a defect |
| Sofia | 56.6 | Desktop | **Does not abandon, withholds** | Will not recommend while `HCX_LIB` can print a clinical label next to a bead on a client's wheel |

**Three abandonments that do not appear in any funnel.** Diane stops returning
rather than leaving. Sofia keeps using it and stops recommending it. Derek
converts the product into a joke in a group chat, which looks like a share and
is an exit. All three are worth more than the measured exits above them and
none of them can be instrumented from inside a single HTML file.

**The two that matter most, stated plainly.** Dariusz and Priya are the people
the brief said matter most. Neither of them reaches a release. Dariusz leaves
the funnel at question nine on a silent input failure, and when he comes back
the product's first substantial statement to him is a moral adjective at 28px
followed by "costing more than it builds" and "98 percent malignant". Priya
reaches further, likes the picture, says so publicly, and is then handed a list
of five words describing a manipulative and controlling person, about herself,
at 02:40, in scrubs, after four nights of holding dying animals.

**Neither of those is a copy problem in the ordinary sense.** They are the
product's own arithmetic, correctly computed, rendered without a reader in
mind.

---

# What the panel rejects, including what the owner asked for

Agreement where there is none is worthless. These are named plainly.

**1. "Zoom all the way out and see the whole construct." Rejected as a
description of the build.** It is not what the code does. Scroll out clamps at
1 and returns the depth floor, which is 136 or 164 targets. The whole construct
is the Blueprint button, and it is a button, not a gesture. The panel does not
reject the idea. It rejects describing an unbuilt behaviour as a built one, and
it recommends building it, because the gesture is the right gesture and the
hand already knows it.

**2. The persona spread request, half rejected.** The owner asked for three
new personas at CQ 92, CQ 1 and CQ 6, labelled Mastery, Severe and Collapsed.
Two of the three labels are wrong against his own engine. CQ 5.9 is **Severe**.
CQ 1.1 is **Severe**. Collapsed requires CQ under 1, and the band is one point
wide out of a hundred. The panel built the personas the arithmetic produces and
declines to invent a Collapsed reading the engine does not return. The finding
underneath is the real one: **the Severe band is twenty points wide and
Collapsed is one, so in practice the product has one word for everybody below
the Corrupt line, and that word is Severe.**

**3. The moral band vocabulary. Rejected, for the fourth consecutive panel.**
Severe, Corrupt and Collapsed. Two of the three new personas are handed Severe
and one of them is 0.13 of a point from Collapsed. `PANEL-10k.md` costed this
at the largest marginal payer gain in its model and it remains the cheapest fix
on any list. High resistance, high load, high drag. It is four words and one
data table.

**4. The clinical subtitles. Rejected again, and the new evidence is worse.**
`HCX_LIB` still carries `depression · BPD · anxiety` and `schizoid ·
withdrawal`. The CQ 1 persona runs five of the six hyper complexes, so five of
those six strings are reachable on his own wheel, on the night he opens it.
Sofia withholds her recommendation over this and she is the highest value entry
in the roster.

**5. "Show more than say" as a blanket principle. Accepted, with one carve
out.** It is the right principle and the screen scaling control is the proof:
three options with a line each, shown rather than explained. But three of nine
personas failed on something that could only have been said. Dariusz needed a
stated duration. Priya needed a label on the Balance bar. Vesna needed the
depth buttons named. **Show more than say is not say nothing.** The rule the
panel will hold to is: show the state, say the contract. A duration is a
contract. A band direction is a contract. Neither can be shown.

**6. The empty state at the top of the ladder. Rejected as shipped.** At CQ 92
four chips render with no number, the reading block prints the cold placeholder
over a completed profile, and "Law shut: Truth" appears next to a law value of
9.6. Three separate empty state failures on the best reading the product can
produce. A slot keeps its label and the value carries the state. "Shut" is not
a label, it is a value, and at 9.6 it is a false one. The slot should read
**weakest law**.

**7. Charge below 6 reading as nothing. Rejected as an instrument claim.** A
person holding every axis at 5 is told the field is clear. Vesna is the case
and she found it herself in under a minute by setting all nine to a three. The
panel has no standing on the arithmetic and does not propose a threshold. It
records that **the screen says "nothing held" for a state that is not nothing
held**, and that under the terms of rule three, that is the instrument claiming
something it has not got.

**8. The clipped scrollers. Rejected, three instances.** The root domain row
at both widths, the depth bar at 390, the key strip at 390. An overflowing
scroller with a hidden scrollbar is indistinguishable from a missing feature.
Marcus named all three unprompted.

**9. Contradictory statements about the same variable. Rejected.** "21 laws
unmeasured, sitting at the default 6" beside "21 laws · integrity 2.0" on one
screen. "Laws open" and "Laws shut" printing the same four laws with the same
four values. Priya stops believing the whole reading at the first of these, and
she is right to.

**10. What the panel does not reject, and wants protected.** The address drill
with seventeen renderers and one panel. `rdOpen` unfolding and scrolling the
answer into view. The accuracy block and its interval, which is the most honest
thing in the product and must not be softened to look confident. The help
sheet's "What it does not claim" paragraph. The screen scaling control. The
Analytics one sentence hero, which is the only line in the product that three
separate personas said they would repeat to somebody else.

---

# Director notes

**[PL] The Blueprint frame is the marketing asset and it is four clicks deep.**
Three of nine personas named it as the reason to answer sixty three questions,
including the two lowest scorers in the study. It is currently reachable only
after the quiz, on the third tab, from a sub bar that only exists on that tab.
It belongs on the landing page with the lit positions named.

**[PL] One computed sentence under the whole construct, keyed to the load.**
Dariusz said he would have kept going for one sentence telling him where to
start. Vesna refused because nothing in the construct was hers. The same slot
serves both and the data for it already exists in `compute()`.

**[UX] The primary action does not exist and everything else is downstream of
that.** Attention lands on the wheel on every tab and every device. There is
nothing under the wheel to press. Run a release is 1,827 pixels down a rail on
desktop and 4,146 down on a phone. This has now been measured in three studies
and moved 190 pixels.

**[TD] `setZoom` clamps at 1 and the product's headline gesture is therefore
one directional.** Either lower the floor to about 0.45 and let `effView` add
on the way out, or say in the help sheet that the depth buttons are the control.
The current state teaches the hand that scrolling out removes things.

**[TD] The help sheet does not mention that scroll changes what is drawn.** One
row. "See everything at once: the fourth button." It is the cheapest item in
this file.

**[TD] Three clipped scrollers with hidden scrollbars.** Root domains at both
widths, depth bar and key strip at 390. Wrap instead.

**[TD] The empty state at CQ 92 fails three ways.** Chips with no number, the
cold placeholder over a loaded profile, and "Law shut" printed against 9.6.

**[TD] Two screens contradict themselves.** "21 laws unmeasured, default 6"
against "integrity 2.0" on Field. "Laws open" and "Laws shut" printing an
identical list when law values tie on Summary.

**[Owner] The tier words, fourth panel running.** Both new low personas are
handed Severe. One is 0.13 of a point from Collapsed. The Severe band is twenty
points wide and Collapsed is one, so the low end of the ladder has effectively
one word and it is a moral adjective.

**[Owner] Collapsed means two things in this product.** It is a tier and it is
a saboteur pole count, and the Summary prints "Collapsed 37" as a card heading
for a person whose tier is Severe. One word per concept, at the word that can
do the most harm.

**[Owner] A route out belongs under the score, not in a sheet.** The person who
needs it is at CQ 1 at 02:15 and will not open a settings panel. This was ruled
before any paid tier. This study only moves it earlier and gives it a face.

**[Owner] The persona select, refused in every panel including this one.** It
is the third control on the screen and it offers to make a person somebody
else. Behind the profile sheet, labelled as a demonstration.

**[Owner] Charge under 6 reads as nothing held.** Not a copy item and not
mine to rule. Recorded because a persona found it in under a minute and it
cost the product its only Mastery customer.

---

# What this file is not

Every persona, reaction, quotation, abandonment and percentage above is
**simulated model output**. The CQ readings, tiers, seats, saboteurs, masks,
signs, gates and life paths are **engine output on fictional inputs**. The
items marked **measured in build** are facts about `source.html` as it stands
today, verified by executing it in Chromium at 1600x1000 and 390x844 this
session and by looking at the images. No figure in this document is evidence
about any human being, and none of it should be quoted as research.
