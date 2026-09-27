# Ninety days, from the storyboard to day 90

Ngozi Achebe-Lindgren, game director. 27 September 2026.

**What this is.** The simulation ordered in `TASKS.md` FO, his words: "let's
set up a simulation with the ICPs and the focus group. Let's have them start
ninety days from the app, from onboarding, all the way through to ninety days,
and let's find all the friction spots. I know we don't have our tutorial in
our onboarding yet, but let's just kind of use what we have, there's a
storyboard, see if it helps them understand purpose of the tool. And we give
like high level feedback, what their experience was."

**Nothing under `atuned_src/` moved for this file, and `source.html` was not
touched.** `tools/loopsim.js` and `proto/ritual/losssim.js` were read and run,
never edited.

---

# The answer, in six lines

1. **The storyboard shows how the tool works and never says what it is for.**
   Where the charge sits, yes (T2, T3). A release, yes (T3). When to come back,
   yes (T4). What holding it costs: on no frame. That is the purpose Diane,
   Derek and James came for, 450 of the 1,000 panel.
2. **The storyboard's best moment depends on the sniffer reading the first
   entry, and it read 1 of 9.** The frame was drawn on Angela's story, which is
   the one voice in the roster the engine reads on a first line.
3. **The first ninety seconds and the first two days are still where most
   people go.** The model loses 40 percent of the thousand by day 2 and 68
   percent by day 7.
4. **Around day 20 the loop breaks at the release.** A person who does the
   whole loop daily spends the 100 pattern gift between day 17 and day 41, and
   from then the release refuses for good: the free tier reads "0 left this
   week" and never refills. That is a defect, measured, not a policy.
5. **The number a person watches does not move.** Without the 63 questions,
   CQ reads 0 on day 90 exactly as on day 1. With them, ninety days of daily
   release moves it by hundredths. Expression, the reading with the load in
   it, ends lower for all seven and by more than half a point for six, because
   telling the truth adds load faster than a locked release can take it off.
6. **From day 30 to day 90 the ladder is silent.** Somebody who never misses
   earns Thirty days on day 30 and nothing new until Ninety days.

---

# 1. Method

**The script.** `proto/ninety/arc90.js`, run once from the repo root:

    node proto/ninety/arc90.js --walk proto/ninety/walk-11830df.jsonl

It printed `proto/ninety/arc90-2dff0f3.txt`, which is committed beside it, on
a clean tree at commit `2dff0f3`. It was first run at `11830df` while the CQ
cleanup seat's edit to `losssim.js` was uncommitted; the two outputs are
identical apart from the commit, the timestamp and the dirty flag. `engine.js`
md5 `85941fb4443bc35187c9e6dd5d2cc2c8`, `losssim.js` md5
`7aa57f73ac69c5660998ab262a81fdda`, storyboard md5
`886b343a45252b3d884ca873434b5551`. `atuned_src/` has no commit since
`acc8181`, the build the first run walk measured.

**Every number carries one of three labels**, the way `DESIGN-firstrun.md`
labels its own.

| Label | What it means here |
|---|---|
| **measured** | A call into the shipped `engine.js`, a string read out of the storyboard file, or real Chromium. Reproducible from the command above. |
| **model** | `proto/ritual/losssim.js`, the project's own day 1 to day 90 retention model, required as a module and not edited. Calibrated to an earlier simulation (`reviews/simulation-quarter.md` 6.3), not to observed people. |
| **judgement** | Mine, with the reasoning shown. Includes every line of what a person thinks, which is simulated. |

**Four layers.**

- **A, onboarding (measured copy, judged need).** The person facing text of
  all twelve storyboard frames, read out of `proto/firstrun/storyboard.html` at
  run time. Checked for the three things `RESEARCH-icp.md` section 4 found land
  with the widest spread of the panel ("it names where the charge is held,
  tells you what holding it costs, and gives you the sentences that release
  it"), plus why to come back, plus Ana's own need, that it has an end. Each
  ICP's first entry put through the shipped sniffer to see which storyboard
  frame they would actually meet.
- **B, the retention arc (model).** `losssim.js` validated first, as a child
  process: **49 checks passed, 0 failed.** Then run on five seeds for the build
  as it stands ("built") and the designed loop that is not built ("final").
  The CQ cleanup seat's change to `losssim.js`, landed in `2dff0f3`, touches
  printed text in its chain report only, not `runSim`, so the arc is the same
  on both sides of it.
- **C, the engine arc (measured, joined by judgement).** The shipped engine
  driven day by day, two ways per person: along the exact practice days
  `losssim.js` deals the most engaged member of that ICP (its exported `TRACE`,
  the longest walk), and along every one of ninety days as the ceiling. Each
  twice: with no laws answered, which is today's default, and with the person's
  reference laws answered on day one. The join is mine and it is stated once:
  **a kept day is one turn of the loop**, one entry from their own story bank,
  one release over the three heaviest addresses above the line if there are
  any, and the practice the build calls for. The one lifted piece is eight lines
  of charge arithmetic in `ui/release.js` `relCoolDown`, which touches the page
  and cannot be required; the script asserts its constants against the source
  and refuses to run if they move.
- **D, the first run (measured).** `proto/firstrun/walk.js` re-run today on a
  fresh build of `11830df` from `git archive`, in real Chromium, saved as
  `proto/ninety/walk-11830df.jsonl`. Build md5
  `84054aa7f651937e5ebeface4d5b511a`; `atuned_src/` is the same at `2dff0f3`.
  It reproduces every figure `RESEARCH-firstrun.md` reported on 26 September: 102 controls on
  the landing at 1600, 22 at 390, the first door 3,216 px down on a phone, "You
  have committed 1 story and nothing reaches the line yet" after a first story,
  three addresses held after a second, the nine sentences opening at 2,056 px
  on an 844 px screen, 0 page errors.

**What each person writes.** `sim/stories.js`, five or six lines per ICP,
written in each voice before the lexicon was consulted, then their `says`
line from `engine/data/people.js`. It is the nearest thing the repository has
to what these people would type. It is one sentence per entry, and a longer
entry reads more: the storyboard's own 35 word discover text lights 6 words and
reads 12 imprints through the same sniffer, which is the known good case the
tool was checked against.

**Terms, once, in plain words.** *The line* is the level an address has to
reach before the product counts it as held and lets a release run on it (4 on
a scale of 10). *CQ* is the headline coherence number; since 25 September it
is the 21 laws alone, so it only exists once the 63 questions are answered.
*Expression* is CQ with the pull of what a person is carrying taken off, so it
is the number that answers to stories and releases. *Load* (DQ) is the total
of what is being carried. *The gift* is the 100 patterns every new person gets;
a release spends one pattern per new line it opens.

**What this cannot say.** Whether any of these people comes back on day 14 is
retention psychology this project has not measured. Layer B is a model of it.
Layers A, C and D say what the product would show them if they did.

---

# 2. Did the storyboard say what the tool is for

**Measured: the copy, frame by frame.** Every clause the matcher found, with
the word it matched, so a reader can disagree with a specific hit.

| Clause | As drawn | With Q3 column B |
|---|---|---|
| Where the charge sits | F2 "body", F6 "body", T2 "landed here", T3 "throat" | and discover |
| What holding it costs | **none** | play: "what it costs you over time" |
| That a release takes it off | T3 "Run one release over it" | and flow |
| Why come back | T4 "Pick when you will come back to it" | and embody |
| That this has an end | **none** | **none** |

The closing frame, T5, says "The wheel is your field. Left is what you are made
of. Right is what it reads." That is a map of the screen, not a reason to use
it.

**Judgement: each ICP's need against that table.** Needs quoted from
`RESEARCH-icp.md`, itself simulated.

| Who | Weight | What they said they need | Said as drawn | With column B |
|---|---|---|---|---|
| Angela | 150 | "None of them told me where it lives." | yes | yes |
| Marcus | 160 | "Does it show me the mechanism." | yes, by showing | yes |
| Sofia | 140 | "Tell me what to run and how long it takes." | yes | yes |
| Derek | 170 | "Name the one thing capping my output and where it sits." | half: where, not cost | yes |
| Diane | 180 | "A number and a cost." | no | yes |
| James | 100 | "Ask me instead what it improves." | no | yes |
| Ana | 50 | "Will it tell me this has an end." | no | no |

**Measured: what discover actually shows them.** The storyboard's T1 lights the
person's own words and T1b says "12 found, all under the line for now". That
is the reward the revision in `DESIGN-firstrun.md` 0.2 put first, and it holds
only if the sniffer reads the entry.

| Who | First entry, verbatim | Lit | Read | Frame they meet |
|---|---|---|---|---|
| Angela | "Everything happens for a reason. I have said that at three funerals and I believed it each time." | 1 | 4 imprints | T1b and T2 as drawn |
| Derek | "My last three sessions were slower and nothing in the data explains it." | 0 | nothing | none drawn |
| James | "I make the call and I sleep fine. People find that cold. It is what they hired." | 0 | nothing | none drawn |
| Marcus | "I can see what is wrong with anything in four seconds. It has cost me two studios." | 0 | nothing | none drawn |
| Sofia | "I hold the room for everyone. I have not been held in four years and I would not know how to ask." | 0 | nothing | none drawn |
| Diane | "I worked until eleven again and I have nothing to show anyone for it." | 0 | nothing | none drawn |
| Ana | "I am in the middle of something and I cannot see the far side of it." | 0 | nothing | none drawn |

Weighted, 850 of the 1,000 write a first entry the sniffer reads as nothing.
**No first entry crosses the line for anybody**, so flow on day 0 is the
practice run the storyboard proposes (its Q10) for all nine or it is nothing.

**The verdict, judgement.** The storyboard communicates the mechanism, by
doing it, to the three people who came for a mechanism: Angela, Marcus and
Sofia, 450 of the thousand. It does not communicate the purpose to the three
who came for a cost, Diane, Derek and James, another 450. It has nothing for
Ana. And it rests on a moment that, on the repository's own writing, arrives
for one person in nine. Q3's column B, already drafted in the storyboard, would
close the cost gap with one line on play. A frame for the empty entry is not
drawn at all.

Simulated, and only simulated:

- Angela: "It lit up my words. It knows where this sits." The storyboard works
  for her, and it was drawn on her.
- Derek: "I wrote the thing and nothing lit. What is this for." Then, at play,
  a faint wheel with nothing of his on it.
- Diane: "What does this cost me. It has not said." She leaves at embody or
  before, which `DESIGN-firstrun.md` 0.7 already predicted.
- Marcus: "The drawing is real. The reader missed my sentence." He stays to
  inspect, not to practise.
- Sofia: "When, where, how long. Good." embody is her station, as designed.
- James: ticks the box on Hello and lands on the Field. The opening never
  reaches him, as designed.
- Ana: "It shows me where. It does not say there is a way out."

---

# 3. The ninety days, person by person

Retention is **model**. What the screen shows is **measured**. What they think
is **simulated**. "Every day" is the ceiling walk; "most engaged" is the
longest walk the model deals that ICP. Day numbers in the every day walk equal
turns of the loop.

**Angela, 36, seeker. 150 of 1,000.** Model: 48 percent of her row gone by day
2, 75 percent by day 7, 94 percent by day 30; the curve flattens at day 30
with 6 percent left. Measured: 3 of her 6 lines read as nothing; first address
over the line on day 7; she spends the gift on day 41 and the release refuses
43 times after it with load on the wheel. Without the 63 her headline reads 0
all ninety days. The marks come fast, eleven of them, then nothing between day
30 and day 90. Simulated: "It saw me once, on the first day. After that it
mostly did not." The storyboard's own discover text, written for her, puts
Pride and Arrogance among its imprints from "angry at myself"
(`RESEARCH-firstrun.md` section 3), which is the word that loses her.

**Derek, 39, endurance. 170.** Model: 42 percent gone by day 2, 77 percent by
day 7, the row flattens at day 21 with 7 percent left. Measured: his first
address over the line takes ten turns. With the 63 answered, the gift is gone
on day 24 and the release refuses 66 times after it. He is the one who takes the 63, so his CQ
exists: 48.48 on day 1, 48.96 on day 90, a displayed 48 to 49. His expression
goes from 48.5 to 39.9, load from 0 to 23. Simulated: "I did the protocol every
day for a quarter and the number got worse." That is his stated exit, "if my
resting rate does not move ... this is a mood", met in full.

**James, 57, C suite. 100.** Model: 49 percent gone on day 1, 92 percent by day
30. Measured: first over the line day 9, gift gone day 22, CQ with the laws
42.29 to 42.78, expression 42.3 to 38.6. Judgement: he never reaches the gift.
He leaves on day 1 at the Summary rail that says it knows nothing and then says
what is shut in him (`RESEARCH-firstrun.md`, still present). `BUYERS.md` says he
is not the market; the arc agrees.

**Marcus, 44, creative director. 160.** Model: the second best row, 13 percent
at day 30, 3 percent at day 90; 43 percent of his exits carry a broken run.
Measured: **3 of his 5 lines read as nothing, 60 of 90 turns.** First over the
line on day 15. He never spends the gift; he opens eight releases in ninety
days. CQ 62.10 to 62.23. Simulated: "The instrument is good and it cannot read
me." He is the inspector, and two in three of his inspections come back empty.

**Sofia, 41, practitioner. 140.** Model: the best row, 58 percent at day 7, 15
percent at day 30, 4 percent at day 90, and **59 percent of her exits carry a
broken run**, the highest in the panel: she practises weekly at eleven at
night and the run is the thing that breaks. Measured: 3 of 5 lines read as
nothing; gift gone on day 29 with the laws answered, then 61 refusals. CQ
72.86 to 73.34. Simulated: "It tells me what to run and how long, which is
what I asked. Then it stopped letting me run it." She also cannot hand it to a
client, which `sim/harness.js` logged as F12.

**Diane, 46, founder. 180.** Model: all of her row opens on day 1, 31 percent
gone on day 2, 70 percent by day 7, the row flattens at day 30 with 11 percent
left. Measured: she spends the gift first of the six, on day 21 with the laws
answered, then 69 refusals. Expression 59.0 to 51.9. Judgement: under today's
build she does not take the 63, because nothing states fifteen minutes
(`RESEARCH-icp.md` section 2), so her headline is 0 for ninety days. Simulated:
"Does it give me back an hour or does it give me another practice to fail at."
The practice it calls for is two minutes, which fits her; nothing tells her
what it is buying.

**Ana, 47, one year out. 50.** Model: she stays longest of anybody, 23 percent
at day 30, 12 percent at day 90. Measured: first over the line on day 5, the
earliest, and **the gift is gone on day 17, the earliest, then 73 refusals
with load on the wheel.** Load climbs from 0 to 24; expression falls from 41.1
to 35.5. Judgement: this is the most serious finding in the file. The person
in the roster for whom a wrong answer costs something is the one who stays
longest and the one the locked release lands on hardest. She asked one thing,
"will it tell me this has an end", and at day 90 the product shows her more
held than on day 17, with the release shut.

**Gordon and Rosa. 35 and 15.** `RESEARCH-icp.md` has neither arriving.
Measured: every line either writes reads as nothing, all ninety days. Correct
for Rosa. For Gordon it is the refusal the research already recorded.

---

# 4. The friction spots, in the order a person meets them

| # | When | What | Who | Kind |
|---|---|---|---|---|
| 1 | Day 0, opening | The storyboard never says what holding it costs, or that it has an end | Derek, James, Diane, Ana | copy measured, need judged |
| 2 | Day 0, landing | 102 controls in view at 1600, 22 at 390, first door 3,216 px down on a phone, no instruction | anyone not led | measured, Chromium, today |
| 3 | Day 0, first minute | Field rail, Summary rail and Ritual state a reading on a blank record | everyone | measured 26 Sept, `atuned_src` unchanged since |
| 4 | Day 0, discover | First entry read as nothing; storyboard has no frame for it | 8 of 9, 850 of 1,000 | measured, engine |
| 5 | Day 0, first commit | "nothing reaches the line yet", CQ "0%" | everyone who writes | measured, Chromium, today |
| 6 | Day 0, flow | No first entry crosses the line, so the release refuses | all nine | measured, engine |
| 7 | Day 0, doors | "Read nine sentences" opens 2,056 px down on an 844 px screen | phone | measured, Chromium, today |
| 8 | Days 1 and 2 | The largest loss in the model: 40 percent of the thousand | James 62%, Angela 48%, Derek 42% | model |
| 9 | Every session | Share of their own lines read as nothing: Marcus and Sofia 3 of 5, Angela 3 of 6, James 2 of 5, Derek and Diane 2 of 6, Ana 1 of 5 | all | measured, engine |
| 10 | Weeks 1 and 2 | First address over the line takes 5 to 15 turns of their own writing | Ana 5, Angela 7, James 9, Derek and Sofia 10, Diane 11, Marcus 15 | measured, engine |
| 11 | Days 17 to 41 | Gift spent; the free tier reads "0 left this week, banking toward a run of 4" and never refills; every release after refuses | Ana d17, Diane d21, James d22, Derek d24, Sofia d29, Angela d41 on the every day walk; d22 to d58 for the most engaged | measured, engine |
| 12 | Days 1 to 90 | Without the 63, CQ reads 0 on day 90 as on day 1 | Diane, James, Angela, Marcus under today's build, by judgement of who takes it | measured, engine |
| 13 | Days 1 to 90 | With the 63, ninety days of daily release moves CQ by 0.13 to 0.50 | everyone who answers | measured, engine |
| 14 | Weeks 2 to 13 | Expression ends below where it began | Derek -8.6, Diane -7.1, Ana -5.6, James -3.7, Sofia -2.2, Angela -1.0, Marcus -0.3 | measured, engine |
| 15 | Days 15 to 40 | The curve flattens with 6 to 26 percent of each row left | all | model |
| 16 | Any day | A broken run is in 17 to 59 percent of exits, across the seven who arrive | Sofia 59%, Marcus 43% | model |
| 17 | Days 30 to 90 | No new mark from Thirty days to Ninety days; the most engaged earn their last new mark between day 30 and day 42 | all | measured, engine |

---

# 5. Where the arc flattens or reverses

**The loop in one sentence.** Tell it what is on you, see where it sits, take
it off, and come back when you said you would. Each friction above breaks one
clause of that sentence, and I read them in my three passes: loop, session,
week.

**The loop.** It is open at the release from about day 20 for anybody who uses
it daily (row 11), and it is open at discover for most first entries (rows 4
and 9). A loop that refuses half of what it is told and then stops letting a
person act on the rest is not turning. That is measured.

**The session.** Day 0 is still the product's worst session and nothing about
it has moved since 26 September (rows 2, 3, 5, 7). The storyboard fixes the
order and leaves the empty entry undrawn.

**The week, and the quarter.** The model's curve is steepest on days 1 and 2
and flat by day 15 to 40, which is ordinary for the category: `sim/harness.js`
cites a median of 3.3 percent active at day 30, and the model's built arc is at
9.9. That is a benchmark from elsewhere, not a promise here. What the model
cannot see, because it has no term for it, is that the people it keeps are the
ones who meet rows 11 to 14 hardest: the daily users spend the gift, watch
expression fall, and earn nothing new after day 30. **Judgement: the model is
optimistic after day 20 for exactly the people it retains.** The reversal is
real in the measurement (expression down for all seven, by more than half a
point for six) and absent from the model.

**Where the model and the walk disagree.** The model's "built" gives everybody
the When row, the if then plan. The walk measured that nothing leads a stranger
to it. The model prices that plan at 56 people of 1,000 at day 30 (on the
designed loop), so "built" overstates today by up to that much. The walk is the
measurement and wins.

**What the storyboard's own mechanics are worth in the model.** "The first
session ends by showing what landed" (T1b, T2, T5) is worth 66 people of 1,000
at day 7 and 30 at day 30. The When row (T4), if the plan is actually set, is
worth 37 at day 7 and 56 at day 30. Model, on the designed loop, and not
additive by construction. play and flow have no term in the model and are not
priced.

---

# 6. The line, stated because the obvious fixes cross it

Rows 11, 16 and 17 invite the fixes free to play reaches for first: a
countdown on the gift, a streak that punishes the missed day, a random reward
to fill day 31 to 89. Each works. Each works because it uses the survival
machinery this instrument exists to release, and would install the load the
product claims to reduce. **They are not in any recommendation here.** The
price of refusing them is known: `DESIGN-gamification.md` costs the loss framed
arm at 2.9 points of 1,000 at day 30, and `losssim.js --loss` models the
owner's deduction on a miss. Neither is rerun here. The fixes below
are fixed and earned, and a person must be able to stop and be glad they used
it.

---

# 7. Found in passing, for the backlog, not dispatched

1. **The free tier reads nothing after the gift. Measured, engine seat.** A
   blank profile carries `plan.base` 0 (`engine/schema.js:111` and `:1063`), so
   `planAllowance` counts every pattern ever opened against this week's ten and
   says "0 left this week, banking toward a run of 4" on the first day after
   the gift. With `base` unset it reads "10 of 10 left this week", which is
   what the comment in `engine/plan.js` says the default is meant to be.
   Nothing in the one file build ever writes a new period either. The plan
   card promises "Ten patterns a week, for life."
2. **`losssim.js` `TRACE.alive30` counts the row still in at day 90**, not day
   30: it is incremented after the ninety day loop on `live`. Its three readers
   in `proto/ritual/` label it "survived", which is correct; the name is not.
3. **`sim/harness.js verify` fails today** on every CQ line (65 against the 42
   to 34 it recorded), because CQ was refit to the laws on 25 September
   (`dd0bf23`). Its charge lines still agree. Its grade, the 38.91 in
   `sim/ninety.js`, and `reviews/SIM-ninety-days.md` predate the refit and
   should not be quoted as current.
4. **12 of the 14 `says` lines in `engine/data/people.js` read as nothing**
   through the shipped sniffer. They are the roster's signature lines and the
   voice every simulation in this repository starts from.

---

# 8. Questions for him

Each is open. None is answered here by default.

**Q1. Should the opening say what the tool is for?** His two rulings, quoted in
the storyboard: 20 September, "At no point are we talking about results or
purpose." 26 September, "Highest purpose of the product results." The
storyboard drew column A, what to do, and drafted column B, what it is for.
- *Column A as drawn.* Serves Angela, Marcus and Sofia, 450 of 1,000. Says
  nothing about cost to Diane, Derek and James, another 450.
- *Column B, one more line per station.* Play would read "It finds what that
  story is wired to, and what it costs you over time." Closes the cost gap for
  all but Ana. Costs four lines through the refusal gate.

**Q2. What does discover show when the first entry reads nothing?** Measured
for 8 of the 9 first entries in the repository's own writing. The storyboard
draws "12 found, all under the line for now" and nothing for zero.
- *Ask for a second line.* One prompt, still in discover. Costs a frame and
  about thirty seconds, and a second entry usually reads.
- *Say it plainly and move on to play.* Honest, and play then has nothing of
  theirs to show.
- *Widen the reader first.* The stemmer and frame layer in `proto/game/` are
  built and measured and not shipped. Costs engine work before the opening.

**Q3. What should the free tier deliver after the gift?** The plan card says
"Ten patterns a week, for life." The build delivers zero (backlog item 1).
- *Fix it to ten a week, as ruled.* Engineering, small. Ten is under one
  release at three addresses, which opens twelve.
- *Fix it and revisit the ten.* Ana is the person the shortfall reaches first,
  on day 17 of daily use.

**Q4. What is the headline for somebody who has not answered the 63?** Today
it is 0 percent, for ninety days, whatever they do (row 12).
- *Keep CQ, show nothing until the laws are in.* Honest, and the biggest number
  on the screen never moves for four of six ICPs.
- *Lead with something that moves on stories and releases*, such as how much
  is held above the line. Costs a ruling on which number is the headline,
  which sits beside his open question 1 in `DECISIONS.md`, whether the tier
  word names CQ or expression.

**Q5. What does day 31 to day 89 give?** Measured: no new mark in that window
for somebody who never misses. The Structure marks that could fill it (First
clearing, Five clear) need releases, which the gift has shut by then.
- *Marks that read the coherent side*, an axis that held for seven days. Already
  designed as the award family in `losssim.js` pass 6, not built.
- *Leave it quiet.* A quarter with an ending is honest, and it costs the
  people the model keeps longest.
