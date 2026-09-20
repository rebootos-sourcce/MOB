# The ritual builder, simulated a thousand times

Brief: `TASKS.md` AP1, AP2 and AP3. The owner's question was "where is our
gamification", and the instruction was that it is baked into the ritual rather
than bolted beside it, benchmarked against the top two ritual builders and
accountability trackers actually in market, and simulated a thousand times
against the ICPs.

Seats at the table: game director, design, UI UX, creative director, project
manager. The game director holds the pen and the hard line that goes with it:
**this product reads somebody's nervous system, so no manipulation pattern goes
on it.** Every mechanic below was checked against that before it was costed, and
the ones that were refused are named with what they would have been worth.

**The tool.** `tools/ritualsim.js`. It loads the real engine, measures what the
build actually deals to each ICP, then runs 1,000 people for 90 days. It
validates before it reports and exits non zero if validation fails. Every
number in section 3 onward is its output at seed 20260920.

**What is measured and what is modelled.** Section 2 and the first table of
section 3 are measurements off `engine.js` and `atuned_src/ui/ritual.js`.
Everything after is a model, and every coefficient in it either carries a
citation or is labelled MINE and swept.

**Network note.** Direct page fetch is blocked in this environment by the
organisation egress policy: `curl` and WebFetch return 403 on every third party
host tried, including `finch.fandom.com`, `thefabulous.co`,
`businessofapps.com` and `en.wikipedia.org`. Every benchmark figure below was
obtained through the search index against the URL given, and the URL is cited.
Where a mechanic could not be sourced at all it is marked **unsourced** and not
described.

---

# 1. THE TWO BENCHMARKS

## Who they are, and why these two

The category is "ritual builder and accountability tracker". Duolingo is the
reference implementation of the streak and is not in this category, so it is
used below only for a retention comparison. The two picked are **Finch: Self
Care Pet** and **Fabulous**.

| | Finch | Fabulous |
|---|---|---|
| What it is | virtual pet, self care goals, accountability | ritual builder. Its own noun for a habit is a ritual |
| Scale | about 10 million monthly active users | 37 million users claimed by the company |
| Money | about $2.0M a month on the App Store and $0.9M on Google Play in the month measured; $30M ARR reported, bootstrapped | not published. Reported to command among the highest ARPU in the category |
| Retention | **D1 54 percent, D7 37 percent** | not published |
| Pedigree | founded May 2021 | out of Duke's Behavioral Economics Lab, 2013, Dan Ariely's group |

Sources, in order:
Finch MAU, D1 and D7, and the Duolingo comparison at D1 51 percent and D7 35
percent, from Deconstructor of Fun citing Sensor Tower,
https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl .
Finch monthly downloads and revenue from Sensor Tower's own app pages,
https://app.sensortower.com/overview/1528595748?country=US and
https://app.sensortower.com/overview/com.finch.finch?country=US . Finch at
about $380K a month, about 126K downloads and near 8.3M active users in Q2
2025, from
https://sensortower.com/blog/2025-q2-unified-top-5-health%20and%20fitness-units-us-600af518241bc16eb8dce802 .
The $30M ARR and the bootstrapped claim from
https://blog.sparrowapps.io/p/finch-how-a-self-care-app-hit-30m-arr-without-vc-money .
Fabulous at 37 million users, the Duke lab and the Journeys mechanic from
https://www.thefabulous.co/ and
https://www.thefabulous.co/science-behind-fabulous/ . The Google Play Editors'
Choice badge with 10 million plus downloads and the App Store Best Self Care
App 2018 award from
https://play.google.com/store/apps/details?id=co.thefabulous.app and
https://habitbox.app/blog/fabulous-app-review .

**One contrary source, recorded rather than hidden.** A market research page
names Habitica and Fabulous as the top two of 2025 and puts Habitica at more
than 4.5 million registered users,
https://straitsresearch.com/report/habit-tracking-apps-market . That is
overruled here on the evidence: Habitica's figure is registered accounts and
Finch's is monthly actives and paid revenue, and Finch's D1 and D7 are above
Duolingo's. If the owner wants Habitica benchmarked instead, say so and it is
one more pass.

## Finch, mechanic by mechanic

**How a habit is created.** A person adds a goal. Completing goals pays two
things: **energy**, which sends the bird on adventures, and **rainbow stones**,
which buy clothes, furniture and accessories in the shop. Source:
https://www.internetmatters.org/advice/apps-and-platforms/wellbeing/finch/ and
https://finch.fandom.com/wiki/Rainbow_Stones . The core loop as deconstructed:
do self care tasks, earn rewards, make progress by evolving the pet, unlocking
areas and completing adventures.

**Streak rules.** Four selectable levels, **Baby steps, Normal, Intermediate
and On fire**, chosen by how much consistency the person wants to commit to.
Higher streaks pay more rainbow stones on adventures. Source:
https://finch.fandom.com/wiki/Streaks .

**What happens on a miss.** The bird never dies, the streak does not punish,
and a missed day costs nothing. **Pause Mode** preserves a streak for a set
number of days. A broken streak can be restored with a **Streak Repair
Hammer**, of which a person holds **two**; past that the streak is lost
permanently. Sources: https://finch.fandom.com/wiki/Streaks ,
https://www.lemon8-app.com/zoecoreas/7393795452791980549?region=us ,
https://habitbox.app/blog/finch-app-review .

**Notification cadence.** Encouraging pushes through the day, affirmations
among them, user configurable, and described by reviewers as gentle with no
urgency. https://slate.com/technology/2026/09/finch-app-self-care-wellness-review.html
and https://techanjan.com/finch-review-boosting-productivity-without-the-shame/ .
**The exact number per day is unsourced.**

**What is paywalled.** Finch Plus at about £70.99 a year with a 7 day trial.
Reviewers consistently describe it as cosmetics, outfits, adventures and
soundscapes rather than a wall across the useful parts.
https://www.internetmatters.org/advice/apps-and-platforms/wellbeing/finch/ .

**Published day 30.** Not published. D1 54 and D7 37 are the two figures that
exist.

## Fabulous, mechanic by mechanic

**How a habit is created.** A person designs rituals for morning, afternoon and
evening, stacking steps into a routine, and **Journeys** introduce keystone
habits gradually under a coaching structure.
https://www.thefabulous.co/science-behind-fabulous/ and
https://medium.com/@preciousebunoluwaa/how-fabulous-turns-habits-into-rituals-a-case-study-in-behavior-design-51b3ae18ffd3 .
Reported limitation: habits can be added, removed and reordered, but the home
screen layout is fixed. https://www.choosingtherapy.com/fabulous-app-review/ .

**Streak rules.** A streak is carried on the home screen widget.
https://apps.apple.com/us/app/fabulous-daily-habit-tracker/id1203637303 .

**What happens on a miss. Unsourced.** Nothing found states the reset rule, the
grace period or whether a repair exists. Not described here.

**Notification cadence.** Per ritual reminders for morning, afternoon and
evening, which are configurable, **plus several other notifications and emails
through the day**, and many reviewers report the volume as a complaint.
https://www.choosingtherapy.com/fabulous-app-review/ .

**What is paywalled.** Reported at $39.99 a year with a 7 day trial, with
reports of the paywall toggling between $39 and $79 and of prices between
$16.99 and $59.99 depending on plan and promotion.
https://www.choosingtherapy.com/fabulous-app-review/ ,
https://habitbox.app/blog/fabulous-app-review . A paywall inconsistency that
users notice is a trust cost and it is the one place Fabulous is plainly
beatable on conduct rather than on features.

**Published day 30.** Not published.

## The retention floor this product is being measured against

| Figure | Value | Source |
|---|---|---|
| D30, health and fitness, install cohort | **2.78 percent** | AppsFlyer, quoted at https://apsteq.com/blog/app-retention-benchmarks/ |
| D1, D7, D30 cross industry | **25 to 26, 11 to 13, 5 to 7 percent** | https://enable3.io/blog/app-retention-benchmarks-2025 and https://apsteq.com/blog/app-retention-benchmarks/ |
| D1 and D7, Finch | 54 and 37 percent | Deconstructor of Fun, above |
| D1 and D7, Duolingo | 51 and 35 percent | same |

Read the spread honestly. The category median at day 30 is under 3 percent of
installs. Finch is top decile and does not publish a day 30 at all. **Any day
30 number this product quotes has to say which of those two it is being
compared against, or it is marketing.**

---

# 2. WHERE THIS PRODUCT ALREADY WINS

Three places, and they are real. Then the honest part.

**1. The ritual is dealt, not chosen.** `ui/ritual.js` calls `compute()` on
every render, takes the seat carrying the most as the track and the load on DQ
as the tier, and names the practice. Neither benchmark does this. Finch asks a
person to pick goals from a list. Fabulous asks a person to build a routine.
Both are blank sheets with coaching on top. This product reads a state and says
what the state calls for, from `engine/data/practice.js`, with the seat named
and the reason printed. That is a diagnostic instrument dealing a prescription
and it is not a feature either benchmark can add without an engine.

**2. The miss rule is already better than both, and it is arithmetic rather
than a consumable.** Finch's answer to a broken streak is two repair hammers,
after which the run is gone forever. That is a scarcity item dressed as
kindness. The owner's Bible 1133, reconstructed at
`reviews/SPEC-ritual-accountability.md`, is `Math.max(1, Math.ceil(s/2))` with
one free grace day: 7 kept, one miss, one kept reads 8; two missed reads 4;
never 0. **Nothing resets and nothing runs out.** The empirical case is
Lally 2010, where missing one opportunity did not materially affect habit
formation, https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674 . A reset to
zero asserts something the habit literature says is false. This product's rule
does not. It is not built.

**3. The record is already honest by construction.** `engine/ladder.js` counts
events that happened, never a count against a total, and the 16 marks are tests
against a ledger rather than prizes. Neither benchmark refuses the completion
bar. This is the part the product should be loudest about, and it is the part
that is hardest to see, for the reason in section 4.

**And the honest part. On the loop itself it wins nowhere yet.** Finch's loop
closes: act, earn, spend, see the pet change. This product's loop is open at
two joints. The ritual saves to `CURP.rituals` at `ui/ritual.js:76` and the only
surface that reads it back is `ladderHtml()` at `ui/cone.js:866`, which is
called from exactly one place, `coneOpen` at `:765`. The record therefore
renders **inside the Compass card**, a surface that
`reviews/simulation-quarter.md` section 6.5 measures at 22 percent touched with
the note that nobody can say what it is for. And there is no coin, so nothing
converts the work into the ability to do more of it. `PRODUCT.md` section 3
says as much: points, not built; points buy patterns, not built.

So: better diagnosis, better ethics, better miss rule, and a loop that does not
close. That is a fixable position and it is not a flattering one.

---

# 3. THE SIMULATION RESULT

## 3.1 What the build actually deals. Measured, not modelled

Read off `engine.js` through `compute()` and a line for line port of `ritFor()`
from `ui/ritual.js`. Choices is the count of practice rows the card renders
plus its two controls, which is what a person is asked to choose among.
Releasable is the number of addresses at `sq >= 4`, which is the threshold
`ui/personas.js:418` builds the release queue at.

| Who | Weight | CQ | DQ | Seat | Track | Tier | Practice called for | Minutes | Choices | Releasable |
|---|---|---|---|---|---|---|---|---|---|---|
| Diane | 180 | 28.1 | 3.51 | Solar | Somatic | 3 | The Emotional Scan | 20 | 19 | 8 |
| Derek | 170 | 15.0 | 10.09 | Solar | Somatic | 1 | The Emotional Scan | 20 | 6 | 20 |
| Marcus | 160 | 39.2 | 0 | Throat | Mind | 3 | Noting Meditation | 15 | 19 | **0** |
| Angela | 150 | 40.9 | 0 | Root | Body | 3 | Box Breathing | 5 | 19 | **0** |
| Sofia | 140 | 56.6 | 0 | Throat | Mind | 3 | Noting Meditation | 15 | 19 | **0** |
| James | 100 | 12.0 | 9.19 | Sacral | Somatic | 1 | The Emotional Scan | 20 | 6 | 18 |
| Ana | 50 | 7.6 | 22.84 | Solar | Somatic | 1 | The Emotional Scan | 20 | 6 | 41 |
| Gordon | 35 | 0.8 | 55.19 | Throat | Somatic | 1 | The Emotional Scan | 20 | 6 | 97 |
| Rosa | 15 | 100 | 0 | Root | Body | 3 | Box Breathing | 5 | 19 | **0** |

Three measured facts fall out of that table and they are the whole of section 4:

- **465 of 1000 cannot run a release at all.** Marcus, Angela, Sofia and Rosa.
- **1000 of 1000 meet more choices than working memory** on the ritual card.
  The best case is 6 against about 4. The worst is 19.
- **835 of 1000 are asked for 15 minutes or more as their first practice**, and
  585 of 1000 are asked for 20.

Note the inversion in the tier rule. `r.DQ>=8` selects tier 1, so the people
carrying the **most** load are the ones offered the **fewest** choices, and the
people carrying least are offered all seventeen practices. The comment in the
code says heavy load starts at entry, which is right, and the side effect is
that the calmest person in the panel gets the busiest screen.

## 3.2 Retention, whole sample of 1000

CURRENT is the build as it stands. SPEC is the design in section 5 with the coin
paid after the fact. The third column is the same design with the coin announced
in advance and made contingent on doing the practice, which is the shape almost
every free to play game would ship.

| Day | CURRENT | SPEC | Coin announced in advance |
|---|---|---|---|
| 1 | 571 of 1000 | **733 of 1000** | 712 of 1000 |
| 7 | 137 of 1000 | **358 of 1000** | 321 of 1000 |
| 14 | 93 of 1000 | **246 of 1000** | 213 of 1000 |
| 30 | 59 of 1000 | **136 of 1000** | 96 of 1000 |
| 60 | 42 of 1000 | **84 of 1000** | 43 of 1000 |
| 90 | 28 of 1000 | **48 of 1000** | 23 of 1000 |

**Read the third column before the second.** Announcing the coin in advance and
paying it for the act costs **40 of 1000 at day 30 and 25 of 1000 at day 90**,
against paying the same coin for the record after the fact. The mechanism is
Deci, Koestner and Ryan 1999, 128 studies, where engagement contingent reward
undermined free choice intrinsic motivation at d = -0.40,
https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf .
In this model the standard free to play framing of a reward is **worse than no
framing at all by day 60**. That is the single most commercially useful line in
this document.

**The day 90 denominator, stated because it has to be.** The published curve
this model is calibrated against has Diane, Derek, Angela, James, Gordon and
Rosa at exactly 0.00 percent on day 90, and inverting a zero produces a hazard
that reaches certainty, so those six rows empty whatever the mechanics do.
**Only 350 of 1000 are permitted by the calibration to be alive on day 90 at
all.** Against that denominator day 90 reads CURRENT 8.0 percent and SPEC 13.7
percent. Every day 90 figure here is a floor.

## 3.3 By ICP

CURRENT. Each cell is people out of that ICP's row.

| Who | of | d1 | d7 | d14 | d30 | d60 | d90 |
|---|---|---|---|---|---|---|---|
| Diane | 180 | 180 | 13 | 8 | 6 | 2 | 0 |
| Derek | 170 | 102 | 12 | 6 | 4 | 4 | 0 |
| Marcus | 160 | 64 | 29 | 21 | 14 | 10 | 9 |
| Angela | 150 | 50 | 7 | 3 | 0 | 0 | 0 |
| Sofia | 140 | 112 | 58 | 46 | 31 | 23 | 18 |
| James | 100 | 25 | 4 | 1 | 0 | 0 | 0 |
| Ana | 50 | 36 | 14 | 8 | 4 | 3 | 1 |
| Gordon | 35 | 2 | 0 | 0 | 0 | 0 | 0 |
| Rosa | 15 | 0 | 0 | 0 | 0 | 0 | 0 |

SPEC. Each cell is people out of that ICP's row.

| Who | of | d1 | d7 | d14 | d30 | d60 | d90 |
|---|---|---|---|---|---|---|---|
| Diane | 180 | 180 | 56 | 38 | 20 | 11 | 0 |
| Derek | 170 | 128 | 44 | 29 | 14 | 8 | 0 |
| Marcus | 160 | 114 | 80 | 58 | 32 | 23 | 17 |
| Angela | 150 | 99 | 47 | 27 | 11 | 5 | 0 |
| Sofia | 140 | 130 | 87 | 63 | 41 | 25 | 20 |
| James | 100 | 29 | 14 | 6 | 2 | 1 | 0 |
| Ana | 50 | 42 | 26 | 21 | 16 | 11 | 11 |
| Gordon | 35 | 5 | 0 | 0 | 0 | 0 | 0 |
| Rosa | 15 | 6 | 4 | 4 | 0 | 0 | 0 |

**Where the gain is.** Angela goes from 7 of 150 to 47 of 150 at day 7, the
largest proportional move in the table, and she is the panel member
`reviews/SPEC-ritual-accountability.md` says lives on the run. Ana goes from 4
of 50 to 16 of 50 at day 30. Diane goes from 13 of 180 to 56 of 180 at day 7 and
is still gone by day 90, because her published day 90 is zero and the
calibration will not let her live.

**Where it is not.** Gordon, 5 of 35 at day 1 and nothing after. Correct. Rosa,
6 of 15 at day 1 and nothing after day 14. Also correct, and the product should
not chase either.

## 3.4 Against the benchmarks, with the comparison stated properly

| | This product, CURRENT | This product, SPEC | Finch | Category |
|---|---|---|---|---|
| D1 | 57.1 percent of 1000 | 73.3 percent of 1000 | 54 percent | 25 to 26 percent |
| D7 | 13.7 percent of 1000 | 35.8 percent of 1000 | 37 percent | 11 to 13 percent |
| D30 | 5.9 percent of 1000 | 13.6 percent of 1000 | not published | 2.78 to 7 percent |

**Two warnings on that table and they are not decoration.** First, the two
product columns are a weighted ICP panel and not an install cohort. The panel is
weighted by willingness to pay and ability to find the product, per
`RESEARCH-icp.md`, so it is a warmer sample than an install cohort by
construction and its day 1 is not comparable to Finch's on equal terms. Second,
Finch's 54 and 37 are measured on real installs by a third party. **The honest
claim is that SPEC reaches Finch's published shape on a warmer sample, not that
it beats Finch.** Anyone who states it the other way is quoting a simulation as
a measurement.

---

# 4. WHAT KILLS THE MOST PEOPLE

Ranked by people retained at day 30 when the thing is fixed, one at a time,
against SPEC with everything else held. This is an ablation, so each row is what
that one item is worth in people rather than a story about it.

| # | The thing | People at d30 | People at d90 | File and screen |
|---|---|---|---|---|
| **1** | **The if then plan is saved and never read back.** `CURP.rituals` carries a track, a seat, a step list and minutes, and no surface asks when and where | **72 of 1000** | 33 of 1000 | `atuned_src/ui/ritual.js:76`, the Ritual tab |
| **2** | **The record is inside the Compass.** The streak, the ledger and the 16 marks render only from `coneOpen` | **40 of 1000** | 25 of 1000 | `atuned_src/ui/cone.js:765` and `:866`, the Compass card |
| **3** | **A broken run resets instead of halving.** Bible 1133 is not built | **36 of 1000** | 19 of 1000 | `engine/ladder.js`, `streakRead` |
| **4** | **465 of 1000 cannot run a release**, so the ritual cannot say where it came from | **22 of 1000** | 19 of 1000 | `atuned_src/ui/personas.js:418`, the `sq >= 4` threshold |
| **5** | **The whole practice list is on the card.** 19 choices for 465 of 1000, 6 for the rest, against a working memory of about four | **19 of 1000** | 12 of 1000 | `atuned_src/ui/ritual.js:47` to `:60`, the Ritual card |
| 6 | No push at all | 7 of 1000 | 6 of 1000 | not built |
| 7 | No season, so nothing ever ends | 5 of 1000 | 4 of 1000 | not built |

**Item 1 is the largest and it is nearly free.** The `rituals` array already
stores everything an if then plan needs except the when and the where.
Gollwitzer and Sheeran 2006, 94 studies and over 8,000 participants, mean
d = 0.65, is the largest effect in the whole research file and it is larger than
any badge mechanic in the literature,
https://cancercontrol.cancer.gov/sites/default/files/2020-06/goal_intent_attain.pdf .
`RESEARCH-ladder.md` section 1 already says this is the highest yield item in
the document. The simulation agrees and puts a number on it.

**Item 2 is a navigation bug wearing a design problem's clothes.** The record is
built, correct, ruled and unreachable. Harkin 2016, 138 studies and 19,951
participants, d = 0.40, with effects larger when the information was physically
recorded, https://pubmed.ncbi.nlm.nih.gov/26479070/ . The best supported
mechanism in the literature is in this repository behind a tab that 22 percent
of people open.

**Item 4 needs one honest caveat.** In the calibrated CURRENT curve, people who
**can** release are gone by day 7 slightly more often than people who cannot,
492 of 535 against 371 of 465. That is because the high hazard personas are also
the loaded ones, and it means the release wall does **not** show up as an early
exit predictor in the data this model was calibrated on. Its 22 people at day 30
come from the model's own term, which halves the log odds of the if then effect
when the plan is not tied to something the person cleared. That term is mine.
The measured fact underneath it, 465 of 1000, is not.

---

# 5. THE GAMIFICATION DESIGN

The core loop in one sentence, which is the test every item below has to pass:

> **The journal feeds the imprints, the imprints feed the release, the release
> deals the ritual, the ritual keeps the day, and the day pays the coin that
> buys the next release.**

That is a closed ring. Today it is a line that stops after the release. Ten
items close it, in build order, and each says what it does to the loop.

## 5.1 The card is the address you cleared

`ritOpen(fromLog)` already receives the release log and prints "After releasing
3". It then throws it away. **The saved ritual carries the address and the seat,
and the card is titled with them.** "Fear, Root. Released 14 March." That is the
line the panel says moves Diane, and the reason is not copy: a container for a
hole she made herself is not a habit somebody sold her.

*Loop:* joins the release to the ritual. *Files:* `ui/ritual.js`,
`engine/ladder.js`.

## 5.2 One practice, and the rest behind a control

The called practice is the card. Everything else sits behind one control reading
"something else". Measured cost of not doing this: 19 of 1000 at day 30, and the
worst case on screen today is 19 simultaneous choices against a working memory
of about four.

And the entry practice is **Box Breathing at 5 minutes**, not The Emotional Scan
at 20, for a first session. The 20 minute practice is right and it is not a door.

*Loop:* protects the first session, which is what decides the first week.

## 5.3 The stake sentence

The owner's own, TULA page 219: **"What's at stake for you not doing this?"**
One line, written by the person, never edited by the app, shown back beside what
they actually did at the end of the week. It is the only string in the product
that a person cannot argue with, because they wrote it.

*Loop:* it is the accountability half, and it is the only user facing control on
a term of the coherence formula.

## 5.4 The if then plan, and it is the largest single item

The save already stores the practice, the track, the seat and the minutes. It
gains two fields: **when** and **where**. The card reads them back on the next
render. Nothing else changes.

*Loop:* turns a saved ritual into a plan. Worth 72 of 1000 at day 30.

## 5.5 The record comes out of the Compass

`ladderHtml()` moves to the Ritual surface and stays on the Compass only if the
owner wants it in both. The streak is **drawn and never printed as a number**,
per the ruling already on record. The ledger's four counts stay as they are. The
marks stay as they are.

*Loop:* the day is visible, so keeping it means something. Worth 40 of 1000 at
day 30.

## 5.6 The halving, built

`Math.max(1, Math.ceil(s/2))`, one free grace day, never zero. It is the owner's
own arithmetic, derived from his own three cases. Worth **26 to 39 of 1000 at
day 30** across the whole plausible range of the break shock coefficient, which
is the most robust finding in the sensitivity table.

## 5.7 The season, seven days with an end

The one number on the surface is the season day, 1 through 7. **A thing that
ends cannot be a guilt engine.** The end of a season is where a person is told
they can stop and be glad they used it, and it is the only place in the design
where an exit is a designed outcome rather than a failure.

## 5.8 The coin, and the one rule that makes it legal here

**Karma is paid for the record, after the fact, and is never promised in advance
for the act.** That is not a copy preference. Measured: announcing it in advance
costs 40 of 1000 at day 30 and 25 of 1000 at day 90 against paying it after.

Earn rates, and every one is a count of something that happened:

| Act | Karma |
|---|---|
| a ritual saved with today's date | 3 |
| a journal entry committed that produced at least one imprint | 2 |
| a new address opened by a release | 1 |
| a mark earned | 25 |
| a season completed, seven of seven with grace | 40 |

**Price: 5 karma a pattern, sold in units of 4**, which is the floor sized run,
one address across the four channels. A run at the cap is 25 patterns and
therefore 125 karma.

## 5.9 The arithmetic, and whether it closes

Closed form, somebody who runs the whole loop every day:

    7 x (3 + 2 + 1) + 40  =  82 karma a week
    82 / 5                =  16.4 patterns a week
    125 / 82              =  1.5 weeks for a run at the cap

Against the free allowance of 10 patterns a week, which banks. So a daily
practitioner on the free plan reaches **26.4 patterns a week, about 114 a
month**, against tier one at 400 a month. **That is 29 percent of the bottom
paid rung.** Karma more than doubles a free person's rate and does not come near
cannibalising a subscription. The ladder holds.

Somebody who runs it twice a week:

    2 x (3 + 2 + 1)       =  12 karma a week
    12 / 5                =  2.4 patterns a week
    125 / 12              =  10.4 weeks for a run at the cap

**So the honest answer to whether it is a fair trade.** For a daily
practitioner, fair and then some: a run at the cap in eleven days of work, and
the work is the product. For a twice a week practitioner it is close to
theatre: ten and a half weeks against the free allowance's two and a half.
**The fix is the unit, not the rate.** Selling in units of 4 at 20 karma means a
twice a week person opens a new address every week and a bit, which is
something. Selling only in runs of 25 would make karma a number they watch and
never spend, and a currency you cannot spend is a countdown.

Measured over the simulated 90 days, all 1000 including everybody who left:

- karma earned: median 43, 75th 162, 90th 545, max 1047
- among the 48 still active at day 90: median 977, max 1047
- **afforded one unit of 4 patterns, 20 karma: 96.0 percent, 960 of 1000, median
  on day 1**
- **afforded a run at the cap, 125 karma: 35.9 percent, 359 of 1000, median on
  day 7**

**One number the owner needs to see before he signs the rate.** All 16 marks at
25 karma is 400 karma, which is 80 patterns, which is 20 percent of one tier one
month handed to somebody who never pays, on top of the gift of 100. That is
defensible as part of the gift and it is not defensible by accident. Either the
mark rate comes down to 10, or the 80 patterns are called what they are: the
second half of the gift.

## 5.10 What was refused, and what it would have been worth

Named so the refusals are on the record with prices attached, because a refusal
without a price is a preference.

| Refused | What it buys, with the source | Why not here |
|---|---|---|
| **Loss framing** | Patel 2016: 0.45 of participant days against 0.30 control. The best performing design in the trial. https://www.acpjournals.org/doi/10.7326/m15-1635 | It works by making stopping feel like a loss, on a product that reads distress |
| **Streak reset to zero** | The sharpest version of the same lever | Lally 2010 says the behaviour does not reset when the counter does. Item 5.6 is the alternative and it is worth 36 of 1000 at day 30 |
| **Variable ratio reward** | The schedule the gambling literature is about | Natasha Schull, *Addiction by Design*. Not on a nervous system |
| **A scarcity timer or a countdown** | Real, and measurable | Nothing in this product expires, including unaccrued allowance |
| **A repair consumable, Finch's own answer** | Two hammers, then the run is gone forever | It is scarcity wearing kindness. The halving needs no inventory |
| **A leaderboard** | Real for James, who said so in his own persona line | It ranks people who handed a machine their distress. `DESIGN-progression.md` 3.4 already argued it |
| **A fear of missing out push** | Real | The push model is one per ritual at the time it runs, plus one to mark the day. Nothing else pushes |

**The retention this costs, stated with a number rather than hidden.** Against a
free to play benchmark that would ship all seven, the model's best estimate is
that loss framing alone is worth the difference between the Patel control arm at
0.30 and the loss arm at 0.45 on the daily probability of practising. Rerunning
SPEC at the loss framed daily probability instead of the control one is the one
counterfactual not run here, because running it invites somebody to build it. The
order of magnitude is the same as the whole SPEC gain. **Call it half again on
day 30 and do not build it.**

---

# 6. THE CURRENCY COLLISION

**Stated plainly, and not resolved here.** There are three names for one thing
in three documents that are all current.

| Document | What it says | Where |
|---|---|---|
| `DESIGN-progression.md` section 2.2 | "There is exactly one currency and it is patterns. There is no second unit that buys anything, converts into anything, or accumulates." It goes further: points, XP, score, coin and token are on a banned word list with a gate to enforce it | 2.2, and the ban list |
| `PRODUCT.md` section 3, from `TASKS.md` AE1 | "that loop is what earns **points**, and points buy patterns for somebody who will not pay" | section 3, items 8 and 9 |
| `TASKS.md` AK2 | "The coin is **karma**, for now. The karma bank." AK4 adds that achievements and badges pay karma, and AK5 asks for karma to be explained in product | 0c, second pass |

**The collision is not cosmetic.** `DESIGN-progression.md` does not merely
prefer one word, it rules that a second unit may not exist and asks for a gate
in `tools/terms.py` that fails the build if one appears. The owner's later
ruling introduces exactly such a unit and names it twice, first points and then
karma. One of those three has to move and **it is his call which**.

For what it is worth as input and not as a decision: this design was costed with
karma, because AK5 gives it the best reason any of the three has. His words:
"all the stories basically are karmic patterns". A coin that is the same word as
the thing the product releases is a coin that explains itself, and it is the only
one of the three names that does.

**The question, put to him:**

> Three words are live for one thing: patterns, points, karma.
> `DESIGN-progression.md` rules there is exactly one currency and it is
> patterns, with a build gate to stop a second one. You have since named points,
> and then karma. Which survives, and does the banned word list move with it?
>
> And the second half, which the arithmetic cannot answer: if karma survives,
> is karma a **second currency that buys patterns**, or is karma just the
> **name for patterns you earned rather than were granted**? Those are different
> products. One has an exchange rate a person will publish. The other has none,
> because there is nothing to exchange.

The second reading is cheaper, simpler and passes the existing gate. It is still
not mine to pick.

---

# 7. THE FIX LIST

Ordered by people retained at day 30 per unit of work. Sizes are the game
director's estimate against what the files already carry.

| # | Fix | Worth at d30 | Work | File |
|---|---|---|---|---|
| **1** | **Read the ritual back, with a when and a where.** Two fields on the save and two lines on the card | **72 of 1000** | Small | `atuned_src/ui/ritual.js` |
| **2** | **Move `ladderHtml()` out of the Compass** onto the Ritual surface | **40 of 1000** | Small. The function already exists and takes no arguments | `atuned_src/ui/cone.js:866`, `atuned_src/ui/ritual.js` |
| **3** | **Build the halving.** One line, derived from the owner's own three cases | **36 of 1000** | Small | `atuned_src/engine/ladder.js`, `streakRead` |
| **4** | **One practice on the card**, the rest behind one control, and Box Breathing as the entry | **19 of 1000** | Small | `atuned_src/ui/ritual.js:47` to `:60` |
| **5** | **The release wall.** 465 of 1000 reach a complete reading with nothing to release | **22 of 1000** | Medium, and it needs a ruling on the `sq >= 4` threshold | `atuned_src/ui/personas.js:418` |
| 6 | **The card is titled with the address released** | inside item 1 | Small | `atuned_src/ui/ritual.js`, `atuned_src/ui/release.js:215` |
| 7 | **The stake sentence** | not modelled | Small | `atuned_src/ui/ritual.js` |
| 8 | **The season, seven days with an end** | 5 of 1000 | Medium | new |
| 9 | **Karma, earned and spent** | it is the conversion, not the retention | Large, and it needs section 6 ruled first | new, plus `engine/schema.js` |
| 10 | Push | 7 of 1000 | Large. It needs the server | behind the funnel work |

**Items 1 through 4 are all small, they are all in files that already exist, and
together they are 167 of 1000 at day 30 against a current 59.** That is the
whole of the recommendation. Items 9 and 10 are the expensive half and they are
worth less than the cheap half.

**One thing not on the list that should be.** Undo. `CLAUDE.md` calls it the
largest remaining gap in the product, `reviews/simulation-quarter.md` measures
that 3 percent of people find it, and it is not modelled here because this
simulation is about the ritual. A person who cannot undo a commit cannot safely
experiment, and a person who cannot safely experiment will not journal twice.
It belongs in front of item 8.

---

# 8. HOW THE MODEL COULD BE WRONG

Nine ways, worst first.

**1. CURRENT is calibrated, not predicted.** The per persona hazard is inverted
out of the four published points in `reviews/simulation-quarter.md` section 6.3.
Those points were hand derived in that document, not measured on real people.
**If they are wrong, every number here is wrong by the same factor.** The only
defence is that the whole output is a delta from them, so a common scaling error
mostly cancels in the comparison and not in the absolute levels.

**2. Six of nine ICPs are forced to zero at day 90.** The published curve has
them at exactly 0.00 percent, and inverting a zero gives certainty of exit.
Only 350 of 1000 are permitted to be alive at day 90 whatever the mechanics do.
Day 90 is a floor and should be read as 13.7 percent of the 350, not 4.8 percent
of the 1000.

**3. Three coefficients are mine and they carry real weight.** The break shock
at 0.25, the push odds ratio at 1.30 and the choice load credit at 0.02. All
three are swept in the tool. The halving's value is robust at 26 to 39 people at
day 30 across the whole shock range, which is the good news. The choice load
credit is the opposite: at a coefficient of 0 it is worth nothing and at 0.04 it
is worth 64 of 1000 at day 7, so **item 4 on the fix list is the one whose value
I am least sure of.**

**4. Effect sizes from the literature are being moved to a different outcome.**
Harkin's d is on goal attainment, Gollwitzer's on plan enactment, Nunes and
Dreze's on card completion. They are applied here to a daily probability of
practising and, through one reciprocal, to a churn hazard. The d to odds ratio
conversion is the standard logistic approximation and is itself an
approximation. **Nothing in the cited literature measured app retention.**

**5. The model has no social layer, no seasonality and no weekday effect.**
Real practice is worse at weekends and better in January. None of that is here.

**6. The push term is the weakest sourced thing in the file.** The plus 6 figure
it derives from is marked unverified in repo in the spec that states it. The
sweep says push is worth 0 to 7 people at day 30 in this model, which is small
enough that if the real figure is much larger the whole ordering of the fix list
changes and push climbs.

**7. One person cannot quit twice and cannot come back.** The model is a single
absorbing exit. Real people lapse for three weeks and return, and the season
design in 5.7 is specifically built for that case, so the model **understates**
the season. The season's 5 people at day 30 should be read as a lower bound and
it is the item I would most expect to be undervalued here.

**8. Karma is modelled on three of the sixteen marks.** Only three marks are
functions of days practised. The other thirteen read ground, stories, axes,
intake and snapshots, which this model does not simulate. Measured karma is a
floor, and the 80 pattern figure in 5.9 is the arithmetic ceiling, not the
simulated one.

**9. The panel is warm by construction.** `RESEARCH-icp.md` weights by
willingness to pay and ability to find the product, so day 1 at 57 percent is
not comparable to an install cohort's day 1 and should never be quoted against
Finch's 54 as though it were.

---

# 9. THE QUESTIONS I CANNOT ANSWER

Nine, and each says who owns it.

**1. Which word survives. His.** Patterns, points or karma. And if karma
survives, whether it is a second currency with an exchange rate or the name for
patterns that were earned. Section 6.

**2. What a mark is worth in karma. His.** 25 karma a mark is 80 patterns over
the sixteen, which is 20 percent of a tier one month for a non payer. Either it
is part of the gift and is called that, or the rate comes down.

**3. The `sq >= 4` release threshold. His, and it is the oldest open one.**
465 of 1000 reach a complete reading with nothing to release. The code already
names the problem in a comment. Lowering the threshold changes what the product
claims about a calm person, which is a product question and not a tuning one.

**4. Whether the record lives on Ritual, on the Compass, or on both.** UI UX
has a view and the owner has a standing rule that the reading and the record are
different things. The simulation says it has to be somewhere a person opens. It
does not say which.

**5. Whether a season replaces the open ended streak or sits beside it.** The
spec ruled both, with the season as the surface and the streak as the
arithmetic. That predates the karma ruling and should be reconfirmed now that
the coin exists.

**6. The push cadence, and whether push exists before the server.** It needs the
funnel work. Until then every push number in this file is a parameter and not a
plan.

**7. Whether tier one is 400 a month or 100 a week.** `PRODUCT.md` calls it the
oldest open item on the ladder, and the karma rate in 5.9 is priced against 400
a month. If it becomes 100 a week the 29 percent figure moves.

**8. Whether a person's karma balance is a number they see.** Every other
quantity in this product is either drawn or printed as a count of events. A
balance is neither. It is the one place the design might need a number and the
product's rulings are against printing one.

**9. Whether Habitica should be benchmarked instead of Fabulous.** One market
research source names Habitica and Fabulous as the top two. The evidence here
favours Finch on actives and revenue and Fabulous on the word ritual. If the
owner wants Habitica, it is one more pass and the mechanic to study is its
damage model, which is the one thing in the category this product would never
ship.

---

## Running it

    node tools/ritualsim.js              validation, then the whole report
    node tools/ritualsim.js --validate   the three checks alone, exit 1 on any failure
    node tools/ritualsim.js --sweep      the sensitivity tables alone

**Validation, and how it was done.** The report is suppressed and the process
exits non zero if any of eighteen checks fail. Check one: the nine weights sum
to 1,000 and every ICP is sampled at its stated weight. Check two: a constant
hazard of 0.10 a day is run through the same machinery and compared against its
own closed form, 0.9 to the power of the day, at days 1, 7 and 30; it agrees to
within 0.005. Check three: the CURRENT configuration reproduces the whole sample
curve published at `reviews/simulation-quarter.md` section 6.3, 57.9, 13.6, 5.9
and 3.1 percent, and every persona's day 1, within two people or six percentage
points, whichever is wider.

**The first cut of this tool failed check three and the failure is worth
recording.** It added a choice load penalty and a minutes penalty on top of the
calibrated hazard, which double counted friction the published curve already
contained, and it printed a day 1 of 42.8 percent against the published 57.9.
The structural rule that came out of it is in the tool's own comments: CURRENT
is the bare calibrated hazard and nothing is added to it, so every mechanic in
SPEC is a credit against that hazard and never a penalty removed from thin air.
