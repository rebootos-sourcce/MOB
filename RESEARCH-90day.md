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

**Corrected 27 September, Sam Oyelaran, QA.** Ledger item 7, the free tier
after the gift, and every finding that rested on it, re-measured. The first
run's reading was true of the build it ran on, `2dff0f3`. The engine was
fixed 25 minutes later (`b0eed95`), and at the current build the unmodified
script kept reporting "never refills" only because it ran ninety days in a
few real seconds, so no simulated week could ever open. Re-run on a simulated
clock, the free tier opens ten patterns a week after the gift and the release
runs about once a week. The passages below that relied on it are corrected in
place. Section 9 has both runs side by side, which reading is true, and the
commands.

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
4. **Around day 20 the loop narrows at the release to once a week.** A person
   who does the whole loop daily spends the 100 pattern gift between day 17
   and day 41. After it the free tier opens ten patterns a week and banks what
   is not spent, which on the daily walk buys one release run a week. On the
   days between, the release refuses whenever there is load on the wheel: 20
   to 56 times over the rest of the quarter for five of the six who spend the
   gift, and never for Angela. Measured, corrected 27 September: the first
   run's "never refills" was the old build and then the test harness, not
   this build (section 9).
5. **The number a person watches barely moves.** Without the 63 questions,
   CQ reads 0 on day 90 exactly as on day 1. With them, ninety days of daily
   release moves it by a quarter of a point to just under one point.
   Expression, the reading with the load in it, dips through the first month
   while the gift is spent and load builds, by up to 2.9 points, and is back
   within 0.3 of where it started by day 90 for all seven. The first run
   reported it ending lower for all seven; that was the same harness fault.
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

**Re-run 27 September on a simulated clock.** The script now installs the
simulated clock from `proto/gamification-timeline/extract.js` by default and
printed `proto/ninety/arc90-1364e0e.txt`, the current reading, on a clean
engine at commit `1364e0e`, `engine.js` md5
`0ffab0adbd49c22ceda12aec29e9aa9d`. `--clock wall` keeps the first run's
harness and printed `proto/ninety/arc90-1364e0e-wall.txt` beside it for the
comparison. Sections A, B and D are identical in all three files. Only
section C moved, and section 9 says by how much and why.

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
over the line on day 7; she spends the gift on day 41 and is never refused
after it: her load stays under the line on most days and the weekly ten bank
to 56 by day 90. (The first run had 43 refusals; section 9.) Without the 63 her headline reads 0
all ninety days. The marks come fast, eleven of them, then nothing between day
30 and day 90. Simulated: "It saw me once, on the first day. After that it
mostly did not." The storyboard's own discover text, written for her, puts
Pride and Arrogance among its imprints from "angry at myself"
(`RESEARCH-firstrun.md` section 3), which is the word that loses her.

**Derek, 39, endurance. 170.** Model: 42 percent gone by day 2, 77 percent by
day 7, the row flattens at day 21 with 7 percent left. Measured: his first
address over the line takes ten turns. With the 63 answered, the gift is gone
on day 24; after it he runs a release once a week, ten in all, and is refused
56 times, the most of anybody. He is the one who takes the 63, so his CQ
exists: 48.48 on day 1, 49.42 on day 90, a displayed 48 to 49. His expression
falls from 48.5 to 45.6 by day 30 and is back to 48.2 by day 90; load goes
from 0 to 15.7 at day 30 and ends at 8.9. The simulated line first written
here, "I did the protocol every day for a quarter and the number got worse",
rested on the first run's expression of 39.9 and load of 23, which were the
harness (section 9). Whether a headline that moves 48 to 49 in a quarter meets
his stated exit, "if my resting rate does not move ... this is a mood", is
judgement, and is left open for the author to redo against the corrected run.

**James, 57, C suite. 100.** Model: 49 percent gone on day 1, 92 percent by day
30. Measured: first over the line day 9, gift gone day 22, then six weekly
runs and 27 refusals; CQ with the laws 42.29 to 43.05, expression 42.3 to
42.6. Judgement: he never reaches the gift.
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
nothing; gift gone on day 29 with the laws answered, then five weekly runs
and 20 refusals, and 42 banked by day 90. CQ 72.86 to 73.58. Simulated: "It
tells me what to run and how long, which is what I asked." The second line
first written here, "Then it stopped letting me run it", rested on the first
run's 61 refusals and a release that never reopened, and is withdrawn
(section 9). She also cannot hand it to a
client, which `sim/harness.js` logged as F12.

**Diane, 46, founder. 180.** Model: all of her row opens on day 1, 31 percent
gone on day 2, 70 percent by day 7, the row flattens at day 30 with 11 percent
left. Measured: she spends the gift on day 21 with the laws answered, second
of the six after Ana, then ten weekly runs and 52 refusals. Expression 59.0,
down to 56.5 at day 30, and 58.8 at day 90. Judgement: under today's
build she does not take the 63, because nothing states fifteen minutes
(`RESEARCH-icp.md` section 2), so her headline is 0 for ninety days. Simulated:
"Does it give me back an hour or does it give me another practice to fail at."
The practice it calls for is two minutes, which fits her; nothing tells her
what it is buying.

**Ana, 47, one year out. 50.** Model: she stays longest of anybody, 23 percent
at day 30, 12 percent at day 90. Measured: first over the line on day 5, the
earliest, and **the gift is gone on day 17, the earliest, then nine weekly
runs and 45 refusals with load on the wheel.** Load climbs from 0 to 11.3 at
day 30 and is back to 7.7 by day 90, about where it stood on day 14;
expression dips from 41.1 to 38.9 at day 30 and ends at 41.2. Judgement: the
person in the roster for whom a wrong answer costs something is the one who
stays longest and the first to meet the weekly limit, and she meets the
refusal on 45 of the 73 days after it. The first run called this the most serious
finding in the file, with the release shut and more held on day 90 than on
day 17. That was the harness (section 9): the release reopens every week and
by day 90 her load is lower than at day 30. What she asked, "will it tell me
this has an end", is still not answered by anything the product says.

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
| 11 | Days 17 to 41 | Gift spent; after it the free tier opens ten a week and banks the rest, one release run a week on the daily walk, and the release refuses on the days between when there is load. Corrected 27 Sept: the first run read "0 left this week, banking toward a run of 4" and never refilled (section 9) | Gift spent Ana d17, Diane d21, James d22, Derek d24, Sofia d29, Angela d41 on the every day walk; d22 to d58 for the most engaged. Refused after it: Derek 56, Diane 52, Ana 45, James 27, Sofia 20, Angela 0 | measured, engine |
| 12 | Days 1 to 90 | Without the 63, CQ reads 0 on day 90 as on day 1 | Diane, James, Angela, Marcus under today's build, by judgement of who takes it | measured, engine |
| 13 | Days 1 to 90 | With the 63, ninety days of daily release moves CQ by 0.25 to 0.94 (first run: 0.13 to 0.50) | everyone who answers | measured, engine |
| 14 | Weeks 2 to 5 | Expression dips while the gift is spent and load builds, and recovers on the weekly release: within 0.3 of the start by day 90 for all seven. Corrected 27 Sept: the first run had it ending lower for all seven, Derek by 8.6 (section 9) | Lowest at day 30: Derek -2.9, Diane -2.5, Ana -2.2, James -1.7 | measured, engine |
| 15 | Days 15 to 40 | The curve flattens with 6 to 26 percent of each row left | all | model |
| 16 | Any day | A broken run is in 17 to 59 percent of exits, across the seven who arrive | Sofia 59%, Marcus 43% | model |
| 17 | Days 30 to 90 | No new mark from Thirty days to Ninety days, except Derek's First clearing on day 38; the most engaged earn their last new mark between day 34 and day 58 (first run: day 30 to day 42) | all | measured, engine |

---

# 5. Where the arc flattens or reverses

**The loop in one sentence.** Tell it what is on you, see where it sits, take
it off, and come back when you said you would. Each friction above breaks one
clause of that sentence, and I read them in my three passes: loop, session,
week.

**The loop.** It narrows at the release from about day 20 for anybody who
uses it daily (row 11): one run a week, refused on the days between when
there is load. And it is open at discover for most first entries (rows 4 and
9). A loop that reads nothing in half of what it is told, and then lets a
person act on the rest once a week, turns slowly. That is measured. The first
run said the release stopped for good; that was the harness (section 9).

**The session.** Day 0 is still the product's worst session and nothing about
it has moved since 26 September (rows 2, 3, 5, 7). The storyboard fixes the
order and leaves the empty entry undrawn.

**The week, and the quarter.** The model's curve is steepest on days 1 and 2
and flat by day 15 to 40, which is ordinary for the category: `sim/harness.js`
cites a median of 3.3 percent active at day 30, and the model's built arc is at
9.9. That is a benchmark from elsewhere, not a promise here. What the model
cannot see, because it has no term for it, is that the people it keeps are the
ones who meet rows 11 to 14 hardest: the daily users spend the gift, are
refused on up to 56 of the days after it, watch expression dip through the first month,
and earn almost nothing new after day 30. **Judgement: the model is
optimistic after day 20 for exactly the people it retains.** The dip is real
in the measurement (expression lowest around day 30, by up to 2.9 points) and
absent from the model. It is not a reversal: on the corrected run it recovers
to within 0.3 of the start by day 90. The first run's reversal, expression
down by more than half a point for six at day 90, was the harness (section 9).

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

1. **Resolved. The free tier read nothing after the gift.** True of `2dff0f3`,
   the build this file first ran on: a blank profile carried `plan.base` 0, so
   `planAllowance` counted every pattern ever opened against this week's ten
   and said "0 left this week, banking toward a run of 4" from the first day
   after the gift, and that build had no way to start a new week. Both halves
   were fixed in the engine by `b0eed95`, 25 minutes after the run: `base` is
   null and floored at the gift's end, and the free weeks are counted from
   `meter.giftAt`, the moment the gift ran out. At the current build the day
   after the gift reads "10 of 10 left this week" and ten more open every
   seven days. The script only kept reporting "never refills" because of its
   clock, which is corrected (section 9). The plan card's "Ten patterns a
   week, for life" is what the build now delivers.
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

**Q3. Is ten a week the right pace after the gift?** Rewritten 27
September. The question first asked here was whether to fix a free tier that
delivered zero; the engine was fixed the same night (backlog item 1). The
plan card says "Ten patterns a week, for life", and the build now delivers
that, banking what is not spent. Measured on the daily walk: after the gift a
person runs a release about once a week, and on the days between the release
refuses whenever there is load on the wheel, 20 to 56 times over the rest of
the quarter for five of the six who spend the gift.
- *Keep ten a week.* No work. A daily user runs the release once a week and
  is told to wait on the other days; Ana meets it first, on day 17.
- *Revisit the ten.* A change to the tier ladder in `DECISIONS.md`, and to
  what the paid tiers sell, since more free patterns is less reason to pay.

**Q4. What is the headline for somebody who has not answered the 63?** Today
it is 0 percent, for ninety days, whatever they do (row 12).
- *Keep CQ, show nothing until the laws are in.* Honest, and the biggest number
  on the screen never moves for four of six ICPs.
- *Lead with something that moves on stories and releases*, such as how much
  is held above the line. Costs a ruling on which number is the headline,
  which sits beside his open question 1 in `DECISIONS.md`, whether the tier
  word names CQ or expression.

**Q5. What does day 31 to day 89 give?** Measured: no new mark in that window
for somebody who never misses, with one exception on the corrected run:
Derek earns First clearing on day 38. The Structure marks that could fill it
(First clearing, Five clear) need releases, which after the gift arrive about
once a week.
- *Marks that read the coherent side*, an axis that held for seven days. Already
  designed as the award family in `losssim.js` pass 6, not built.
- *Leave it quiet.* A quarter with an ending is honest, and it costs the
  people the model keeps longest.

---

# 9. The free tier after the gift, re-measured on a simulated clock

Sam Oyelaran, QA. 27 September 2026.

**What was wrong with the measurement.** The engine stamps time on its own.
`meterRun` writes `meter.giftAt`, the moment the gift ran out, with
`new Date()`, and `meterBudget(p, now)` counts free weeks from that stamp up
to `now`, or up to `Date.now()` when no `now` is given. `arc90.js` walked
ninety days in about three real seconds and called `meterBudget(p)` with no
`now`. So the gift was stamped in the real present, every later read was in
that same present, and no free week could ever open inside the walk. The
engine already takes `now` (`engine/schema.js`, `meterBudget(p,now)`). The
fix is in the script alone: the simulated clock from
`proto/gamification-timeline/extract.js`, a `Date` whose no argument
constructor and `Date.now()` return the simulated moment, installed before
`engine.js` is loaded, with that moment passed to every `meterBudget` call.
Day 0 is 1 September 2026, 07:00 UTC, as in `extract.js`. Nothing under
`atuned_src/` moved.

**Which reading is true.**

- **For the build as it stands, the simulated clock run is true:**
  `proto/ninety/arc90-1364e0e.txt`. After the gift the free tier opens ten
  patterns every seven days and banks what is not spent.
- **Item 7 as first printed was true of the build it ran on,** `2dff0f3`.
  That build had no free week at all: `plan.base` was 0 and nothing counted
  weeks. It reads the same under either clock, line for line, and the
  committed `arc90-2dff0f3.txt` reproduces byte for byte apart from its
  timestamp. The engine was fixed 25 minutes after that run, in `b0eed95`.
- **What was an artifact is the claim at the current build.** Run unmodified
  on this build, the script still said the allowance never rises again. That
  was its wall clock. `proto/ninety/arc90-1364e0e-wall.txt` is kept beside the
  true reading to show it, and is not a reading of the product.

**The two readings of item 7, side by side.**

| Run | Engine | Clock | Blank record, the day after the gift | Seven days later | Allowance rose after the gift, every day walk |
|---|---|---|---|---|---|
| `arc90-2dff0f3.txt`, the first run | `2dff0f3` | wall | "0 left this week, banking toward a run of 4" | the same | never |
| re-run, not kept | `2dff0f3` | simulated | "0 left this week, banking toward a run of 4" | the same | never |
| `arc90-1364e0e-wall.txt` | `1364e0e` | wall | "10 of 10 left this week" | "10 of 10 left this week" | never |
| `arc90-1364e0e.txt`, **true** | `1364e0e` | simulated | "10 of 10 left this week" | "10 of 10 left this week" | 7 to 10 times, once per week that opened |

The two middle columns are `planAllowance` read with an explicit date, which
no clock can move: ten more patterns opened three days into the first free
week read "0 left this week, banking toward a run of 4", and the same count
read on the seventh day reads "10 of 10 left this week" on the current
engine. The last column is the walk, and it is the one the clock decides.

**The every day walk with the 63 answered.** "Gift spent" is the day the
count of opened patterns reached 100. It is the same in all four runs.

| Who | Gift spent | Refused with load: first run, `2dff0f3` sim, `1364e0e` wall, `1364e0e` sim | Release runs after the gift, same order | Expression day 1 to day 90: first run, then true | Day 90 allowance, true |
|---|---|---|---|---|---|
| Ana | d17 | 73, 73, 70, **45** | 0, 0, 1, **9** | 41.1 to 35.5, then **41.1 to 41.2** | "22 banked, and 10 more arrive each week" |
| Diane | d21 | 69, 69, 67, **52** | 0, 0, 1, **10** | 59.0 to 51.9, then **59.0 to 58.8** | "2 left this week, banking toward a run of 4" |
| James | d22 | 68, 68, 67, **27** | 0, 0, 1, **6** | 42.3 to 38.6, then **42.3 to 42.6** | "46 banked, and 10 more arrive each week" |
| Derek | d24 | 66, 66, 65, **56** | 0, 0, 1, **10** | 48.5 to 39.9, then **48.5 to 48.2** | "0 left this week, banking toward a run of 4" |
| Sofia | d29 | 61, 61, 57, **20** | 0, 0, 1, **5** | 72.9 to 70.7, then **72.9 to 72.9** | "42 banked, and 10 more arrive each week" |
| Angela | d41 | 43, 43, 36, **0** | 0, 0, 1, **2** | 64.4 to 63.4, then **64.4 to 64.2** | "56 banked, and 10 more arrive each week" |

For the most engaged walk the model deals, the gift is spent on the same days
as before, d22 to d58, and the refusals fall from Angela 11, Derek 45, James
53, Sofia 34, Diane 50, Ana 57 to Angela 0, Derek 36, James 33, Sofia 0,
Diane 35, Ana 36.

**The first run's "gift spent day N" column.** It printed the first day the
allowance read nought. On `2dff0f3` that was the day the gift ran out. On the
current engine the first free week's ten come between the two, so the script
now prints both under their own names: the allowance first reads nought on
day 20 for Ana, 22 Diane, 23 James, 25 Derek and 30 Sofia on either clock,
and never for Angela on the true run (day 48 on the wall clock).

**What moved it, one cause at a time.**

- *`2dff0f3` to `1364e0e`, both on the wall clock.* The engine change. The
  first free week's ten now arrive, so each daily user gets exactly one more
  release after the gift and 1 to 7 fewer refusals. The engine commits since
  also moved figures this correction does not rest on: CQ with the laws ends
  up to 0.12 higher, and Marcus's most engaged walk earns its last new
  mark on day 53, not day 30.
- *`1364e0e` wall to simulated.* The clock alone. The allowance rises every
  seven days, the release runs once a week, and expression recovers.
- *`2dff0f3` wall to simulated.* Nothing on any measured line. That engine
  has no week to open.

Sections A, B and D read the same in all three files. In the printed ledger
every item reads the same except four: item 7 itself, the CQ moved by a
quarter (item 9), expression (item 10, which the true run no longer prints
because it no longer ends lower), and the quiet ladder, where Derek's day 38
is the clock and Marcus's day 53 is the engine change.

**How the tool was checked before it was believed.**

1. The unmodified script at `2dff0f3` reproduces the committed
   `arc90-2dff0f3.txt` byte for byte, apart from its timestamp.
2. `--clock wall` reproduces the unmodified script on every measured line at
   both `2dff0f3` and the current build. Only the typed sentences it replaced
   differ.
3. The number of refills has a known answer: a week opens every seven days
   after the stamp, so inside ninety days it is the whole number of weeks
   from the gift day to day 90. Predicted Ana 10, Derek 9, James 9, Diane 9,
   Sofia 8, Angela 7. Measured the same, and 0 on the wall clock. The first
   cut of this probe read the allowance after the day's release, reported
   Derek refilled 0 while he ran ten releases after the gift, and was wrong;
   it reads before the release now.
4. Under the simulated clock the stamp the engine writes falls on the
   simulated day (Derek, day 24, `meter.giftAt` 25 September 2026). The
   script stops if it does not. Proved by removing the clock: it stopped on
   Angela, stamped with the real date against walk day 29 October.
5. `extract.js`, built separately on the same engine, gives the same
   refusals, the same number of releases after the gift, the same day 90 readings and the same
   expression for all six, and the same Derek reading, "10 of 10 left this
   week", on day 24.
6. Three runs on the simulated clock are identical apart from the timestamp.

**To reproduce,** from the repository root:

    node proto/ninety/arc90.js --walk proto/ninety/walk-11830df.jsonl
    node proto/ninety/arc90.js --walk proto/ninety/walk-11830df.jsonl --clock wall

The first is the simulated clock and the default. For the first run's engine,
check out `2dff0f3` in a separate worktree and run `arc90.js` from `1364e0e`
there with either clock.

**What this does not settle.** The walk still rests on the judgement stated
in section 1, one release over the three heaviest addresses on every kept
day. Whether a weekly run is enough is a question for him, and it is Q3.
