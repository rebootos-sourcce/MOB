# A year, ten thousand people. Measured 5 November

His words, the brief for this run: "push 10,000 customers through a year and then see who makes them all ICPs and see who stays and who drops out and get some stats off that."

Stamp: run on `main` at `0b2a066`, `engine.js` built the same day (961 exports). The harness is `sim/year/` on branch `sim/year-10000-365-2026-11-05`. Every figure below is read off `sim/year/out/aggregate.json`, which `node sim/year/aggregate.js` writes from the per person files. Those files are 632 MB and are not committed; `node sim/year/main.js` writes them again in about an hour on four cores.

## Words used here, said once

- An **ICP** (ideal customer profile) is one kind of person we build for. This run uses the nine in `RESEARCH-icp.md`, at its weights times ten: Diane 1,800, Derek 1,700, Marcus 1,600, Angela 1,500, Sofia 1,400, James 1,000, Ana 500, Gordon 350, Rosa 150. That is 10,000.
- **Active at day D** means the person opened the app at least once in the seven days ending on day D. This is the rolling definition the published category figures use. **Alive** means the person has not yet stopped for good. Alive is the softer number.
- An **arm** is one run of the same 10,000 people under one condition, with nothing else changed. A **seed** is the number the random draws start from. Five seeds means the same arm run five times with different draws.
- A **friction** is something in the product that costs a person a reason to come back, for example "the box read nothing out of what I wrote". The list is in `sim/year/model.js`.
- **Drift** is the model's rule for an absence that becomes permanent: a person who stops opening the app without ever deciding to stop.
- **The allowance wall** is the moment a release is refused because this week's free patterns are spent. A **pattern** is one line of a release, one channel at one address. Free is a 100 pattern gift once, then 10 a week.
- **CQ** is coherence, the 21 laws summed over 210. **Shadow weight** is the DQ figure the Summary prints as a percent. **Expression** is the EX figure the release card reports.

## The answer, first

- **Nobody is active at day 365, in any arm, on any seed.** Not as built, not with every price paid, not with every friction cut by a quarter.
- **That zero is the model's, not the product's.** It is the first thing to know about this run. A control arm with every friction set to zero, a product with no defect at all, also ends the year at zero active. The drift rule this run carries over from `sim/harness.js` was written for 90 days, and over 365 days it removes everyone who does not open the app nearly every day. So this run cannot say who is still here at a year. It can say who leaves, when, and what pushed them, through about day 120.
- **What it can say, with numbers that hold across five seeds:**
  - As built, 8.2 percent of the 10,000 are active at day 30, 1.8 percent at day 60, 0.34 percent at day 90. Half of everyone who leaves has left by day 12.
  - The product's own frictions are worth most of that loss. The same people with no frictions are 33.2 percent active at day 30. As built they are 8.2. About three in four of the people the model would keep a month are lost to something in the build.
  - The single largest named cause is **the printed number does not move** (12.9 percent of all 50,000 person runs end on it). Second is **a story raised the shadow weight on screen** (8.6 percent). Third is **the box read nothing** (5.9 percent).
  - **Who stays longest:** Ana (32 percent active at day 30), Sofia (21.8), Marcus (12.8). **Who leaves first:** James (0.5), Diane (1.6), Angela (3.4), Derek (3.5). Gordon and Rosa barely start, which is what their own entries say they would do.
  - **The allowance wall decides almost nobody.** Only 58 of 50,000 exits are attributed to it, because most people are gone before they spend the 100 pattern gift. It matters for exactly two ICPs, the two who use the product the most: put on a paid tier, Ana's day 60 figure goes from 8.2 to 14.6 percent and Sofia's from 4.3 to 5.8.
  - **Diane never writes a word.** Not once, in 1,800 people times five seeds. Her session is 0.7 to 2.5 minutes and a story costs 3.4. She is the largest ICP by weight, and she never reaches the part of the product that reads anything.

## How this was built, and what is measured versus modelled

Port, do not rebuild. This is `sim/harness.js` (the repository's 1,000 person, 90 day harness) carried to 10,000 people and 365 days, on the current doors. PR #159 was read first: it used seven ICPs from Google Drive, an even split, no weights, no show up model, and everyone opened the app every day, so it could not say who drops out. Its seven are not the ones `DECISIONS.md` names for simulation ("against the real engine and its nine ICPs", AZ5), and only the nine have engine data. So this run uses the nine.

**Measured, by the shipped engine, every day a person opens the app.** None of this is modelled:
- The story commit, as `ui/storyui.js` `stCommit` does it: `parseStory`, `applyStory`, `applyStoryAddr`, `verpApply`, `leanApply`, the entry, the save and the history row.
- The release, as `ui/release.js` `relCoolDown` does it: the allowance (`meterBudget`), whole address plans (`meterPlanWhole`), `relWrite` at every address, `meterRun`, `releaseWork` (the only thing that lifts CQ), the firsts, the save. And the free rerun when the wall is hit.
- The ritual, as `ui/ritual.js` does it: `ritFor` calls one practice, the plan is kept seven days, and the entry is marked done only when the person did it.
- The daily summary, as `ui/daily.js` does it: `dlyDayOpen`, the aim, and yesterday's aim answered kept or not.
- The intake, three answers at a time through `iqAnswer` and `iqApply`, drawn around that ICP's own law table in `engine/data/people.js`.
- The streak, the marks and the allowance, read every day off `streakRead`, `ladderRead` and `meterBudget`.
- A paid month, written the way `planFromServer` writes it.

**Modelled, and it is judgement.** Whether a person opens the app today, how many minutes they have, whether they write, whether they do the practice, and whether a session's frictions make them stop. Every one of those numbers is the old harness's `SHOWUP` table, carried unchanged, and the self check refuses to run if it drifts from the harness's own copy. Where the product has changed since that harness was written, the friction was changed to match, and each change is written in the header of `sim/year/model.js` with its reason.

**The clock.** A year cannot be run in a year, and several engine paths read the real clock directly. Left alone, all 365 days would happen in the same real minute: no streak could form and no weekly allowance would refill. `sim/year/clock.js` replaces the clock before the engine loads, so every engine read sees the simulated day. Time zone is America/New_York, because the streak counts days in the person's own local time.

**Checked before it was believed.** `node sim/year/check.js` runs 20 known good cases and `main.js` refuses to run the year if any fails. Among them: a ritual planned but not done counts no day; a blank profile reads nothing; a story never moves CQ; a release spends whole addresses, lowers the charge it ran on, and lifts CQ through `releaseWork`; the allowance refuses a run once spent and refills a week later; the same person run twice is identical. Across every run, `dlyDayOpen` returned an error 0 times.

**Two bugs in my own harness were caught and fixed before any number here was kept.** A zero friction setting was read as full friction by a default that treated 0 as missing; the control arm showed it. And an edit removed the closing mark of a comment and the runner refused to start. Neither touched a reported figure.

## The arms

Active at day D, percent of all 10,000. Five seeds for each product arm, one for each control.

| Arm | What changes | d7 | d14 | d30 | d60 | d90 | d120 | d180 | d365 | Median exit day |
|---|---|---|---|---|---|---|---|---|---|---|
| No friction (control) | every friction cost is zero | 64.2 | 46.3 | 33.2 | 16.3 | 7.0 | 2.6 | 0.5 | 0.0 | 33 |
| No friction and habit (control) | the same, plus drift fades with kept practice | 64.2 | 46.3 | 33.4 | 16.8 | 7.8 | 3.5 | 0.9 | 0.2 | 33 |
| Frictions cut a quarter | every cost times 0.75 | 64.1 | 26.1 | 11.2 | 3.1 | 0.8 | 0.1 | 0.0 | 0.0 | 13 |
| **As built** | free tier only, nobody can pay | 64.1 | 21.1 | **8.2** | 1.8 | 0.34 | 0.07 | 0.0 | 0.0 | 12 |
| Frictions raised a quarter | every cost times 1.25 | 64.1 | 17.8 | 5.9 | 1.0 | 0.2 | 0.04 | 0.0 | 0.0 | 10 |
| Habit | drift fades with kept practice | 64.1 | 21.1 | 8.2 | 1.8 | 0.4 | 0.1 | 0.0 | 0.0 | 12 |
| No rerun | nobody takes the free rerun at the wall | 64.1 | 21.1 | 8.1 | 1.6 | 0.3 | 0.1 | 0.0 | 0.0 | 12 |
| Paid | everyone on tier one, 400 patterns a month | 64.1 | 21.1 | 8.3 | 2.3 | 0.6 | 0.1 | 0.0 | 0.0 | 12 |

How to read it:
- **The gap between the first row and "as built" is the product's cost.** That gap is the finding. The absolute level of any row depends on the judgement layer.
- **The habit row barely moves**, because almost nobody keeps a practice often enough for the habit term to start working before they leave. The habit term is the fragility rule from `tools/ritualsim.js` (Lally 2010, fragility falls as kept days approach 66). Carrying it onto drift is my extension and is labelled as such.
- **How stable the figures are.** As built, active at day 30 runs 7.9 to 8.4 percent across the five seeds, and the pooled 95 percent interval is 7.9 to 8.4. At day 90 it runs 0.32 to 0.36. The cohort is large enough that seed noise is not the uncertainty here. The judgement layer is: moving every friction cost a quarter either way moves day 30 from 5.9 to 11.2.

## Who stays and who leaves, by ICP, as built

Pooled over five seeds. "Opened" is the share who opened the app at all.

| Who | People per seed | Opened | Active d7 | d14 | d30 | d60 | d90 | Median exit day | Top named exits, among those who opened |
|---|---|---|---|---|---|---|---|---|---|
| Ana | 500 | 71.2 | 68.1 | 52.7 | **32.0** | 8.2 | 1.3 | 23 | drift 46, shadow weight rose 29, box read nothing 14 |
| Sofia | 1,400 | 81.4 | 76.8 | 43.5 | **21.8** | 4.3 | 0.66 | 17 | drift 48, no way to hand it on 26, box read nothing 18 |
| Marcus | 1,600 | 57.6 | 52.4 | 21.5 | **12.8** | 3.2 | 0.59 | 22 | drift 71, box read nothing 8, no way to hand it on 7 |
| Derek | 1,700 | 72.7 | 70.8 | 26.6 | 3.5 | 0.33 | 0.04 | 7 | number did not move 42, shadow weight rose 23, drift 19 |
| Angela | 1,500 | 79.4 | 71.6 | 17.1 | 3.4 | 0.21 | 0.04 | 8 | drift 42, shadow weight rose 31, box read nothing 22 |
| Diane | 1,800 | 86.0 | 84.3 | 9.3 | 1.6 | 0.74 | 0.44 | 8 | drift 47, number did not move 42, sixty three questions 11 |
| James | 1,000 | 41.2 | 34.3 | 1.2 | 0.52 | 0.12 | 0.0 | 12 | drift 64, number did not move 29, sixty three questions 7 |
| Rosa | 150 | 12.8 | 8.3 | 0.93 | 0.40 | 0.13 | 0.0 | 16 | drift 98 |
| Gordon | 350 | 4.6 | 2.9 | 0.0 | 0.0 | 0.0 | 0.0 | 18 | drift 86, sixty three questions 11 |

What each row is saying:
- **Ana and Sofia are the product's real users in this model.** Ana releases 9.8 times on average and closes the whole loop (a story, a release and a kept practice) in 82 percent of arrivals. Sofia closes it in 59 percent. They are also the only two who reach the allowance wall in numbers: half of Ana's arrivals and 16 percent of Sofia's, at a median of day 22 and day 31.
- **Sofia's second biggest exit is that she cannot hand it to anybody**, which is the ICP whose whole value is referral. The practitioner view still returns an empty list (`pracSightList`), and the practitioner tier is not buildable.
- **Derek and Diane want the number to move, and it does not.** Since 25 September, CQ is the laws alone, and a release lifts it by 0.00077 of what is left per pattern. In the self check a whole release moved CQ from 50.0000 to 50.0657, which prints as no change. Derek runs releases (55 percent of his arrivals do) and still leaves on day 7.
- **Diane never reaches the engine.** 0 stories, 0 releases, 0 intakes completed, across 9,000 Diane runs. Her session is too short for every door the product has. This is the narrow door the old harness found (its change C1), and it still holds.
- **Angela and Ana are hit hardest by the shadow weight rising.** A story can no longer lower CQ, but it raises the shadow weight the Summary prints, on 126 of 369 applications of the story bank in the door survey and on none did it fall. Every honest story shows a worse number.

## What the engine reads for the people still here

For the people active at day 30 (4,075 of 50,000 runs): median CQ 55.3, 71 percent with a complete reading, median streak 1, median marks earned 4, median 48 patterns opened, median 52 left. At day 90 (171 runs) the readings are almost the same: median CQ 55.4, marks 4. **The people who stay do not see the reading move in three months.**

The daily summary froze a day (wrote a real summary) 2.84 times per arrival and stayed silent 0.27 times. That is the summary working: it is silent when there is nothing to say and there usually is something.

## What this run cannot tell you, plainly

- **Who is here at a year.** The drift rule ends every arm at zero, the frictionless control included. A year long answer needs a show up model that lets a habit form, and the repository does not have a sourced one. The habit row shows that borrowing the Lally term is not enough on its own.
- **Absolute retention.** Every absolute figure sits on the old harness's `SHOWUP` table, which is reasoned estimate and not measurement. Moving the friction costs a quarter either way moves day 30 between 5.9 and 11.2 percent. Read the gaps between arms, not the levels.
- **Anything about Gordon, Rosa or James past day 14.** Too few of them are active to say anything. At day 90 the pooled count of active people is 0 for each of the three, out of 1,750, 750 and 5,000 runs.
- **Money.** Checkout is closed in the build (`PLAN_CHECKOUT_OPEN` is false), so nobody can pay as built. The paid arm writes the plan the way the server would. It is a test of the allowance, not a revenue forecast.
- **The interface.** The engine is driven directly. The landing counts and the frictions that live in the interface were measured in a real browser on 5 November, on a blank profile, and are inputs, not live readings.

## What would move the curve, in the order the numbers rank it

1. **Make a release visibly move something.** "The number did not move" ends 12.9 percent of all runs, and is the top exit for Derek and the second for Diane and James.
2. **Stop every honest story from making the screen worse.** "Shadow weight rose" ends 8.6 percent, and is the top named exit for Angela and Ana.
3. **Give Diane a door she can afford.** A story box she can use in under a minute, on the surface she lands on.
4. **Read more of what people write.** "The box read nothing" ends 5.9 percent. 17 of the 41 story bank lines read as nothing.
5. **A way to hand it on, for Sofia.**
6. **Price, last.** The wall is real for Ana and Sofia and for nobody else, because nobody else stays long enough to reach it.

## To run it again

    node sim/year/check.js            the 20 self checks, about 10 seconds
    node sim/year/main.js             every arm, five seeds, about an hour on four cores
    node sim/year/main.js built 20261105    one arm, one seed, about two minutes
    node sim/year/aggregate.js        the tables above, from the files main.js wrote
