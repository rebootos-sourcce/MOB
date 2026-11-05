# A year, ten thousand people. Measured 5 November, corrected after review

His words, the brief for this run: "push 10,000 customers through a year and then see who makes them all ICPs and see who stays and who drops out and get some stats off that."

Stamp: run on `main` at `0b2a066`, `engine.js` built the same day (961 exports). The harness is `sim/year/` on branch `sim/year-10000-365-2026-11-05`. Every figure below is read off `sim/year/out/aggregate.json`, which `node sim/year/aggregate.js` writes from the per person files. Those files total about 675 MiB and are not committed; `node sim/year/main.js` writes them again, in roughly ninety minutes on four cores for the full set of arms below.

**This replaces the first draft.** Three independent adversarial reviews read that draft against the code and the raw output. Two real defects in the harness came back from that: the story door's own memory was never cleared between sessions, so a story that found nothing could release an address found weeks earlier (the product forgets this on every reload, and the sim did not); and a control arm meant to carry zero friction still cost its people five percent of a hazard term by an oversight. Both are fixed, and every number below is from the rerun after the fix, not the first draft. The reviews also found that how an exit gets blamed on one friction or another was biased toward whichever friction costs the most inside a session, which understated some causes and overstated others; this version ranks causes by a cleaner test, explained below, and keeps the simpler count as a secondary number rather than the headline.

## Words used here, said once

- An **ICP** (ideal customer profile) is one kind of person we build for. This run uses the nine in `RESEARCH-icp.md`, at its weights times ten: Diane 1,800, Derek 1,700, Marcus 1,600, Angela 1,500, Sofia 1,400, James 1,000, Ana 500, Gordon 350, Rosa 150. That is 10,000 people.
- **Active at day D** means the person opened the app at least once in the seven days ending on day D. This is the rolling definition the published category figures use.
- **Active and not yet gone** is active at day D, and the model has also not yet decided this person has left for good. The plain active figure can include people the model has already written off, because its seven day window can span the week somebody quit in. Both are reported; the gap between them is itself a finding, not noise.
- **The last day they opened** is the actual last day a person is seen in the record. It differs from the **exit day**, which is the day the model's own quitting roll happened to land, and for a drift exit (below) that roll fires only after a run of days spent not opening the app at all, so the exit day reads later than when the person was last really there.
- **Drift** is the model's rule for when an absence becomes permanent. Each day a person does not open the app carries a small, growing chance of ending the record for good, win or lose, whatever the product did or did not do that day.
- An **arm** is one run of the same 10,000 people under one changed condition. A **seed** is the number the random draws start from; five seeds is the same arm run five times with different draws, so a reader can see how much the figures move on their own.
- An **ablation** is a run with exactly one friction's cost set to zero and nothing else changed. The gap between that run and the one with everything in is the cleanest read of what that one friction, alone, is costing. It is the primary evidence in this report, in place of counting which friction happened to be named on the day somebody left.
- A **friction** is something in the product that costs a person a reason to come back, for example "the box read nothing out of what I wrote." The list, with its costs, is `sim/year/model.js`.
- **CQ** is coherence, the 21 laws summed over 210. A reading is **complete** only once all 21 have been answered; before that CQ is a partial number and the product shows no coherence figure on screen. **Shadow weight** is the DQ figure the Summary prints as a percent. **Expression** is the EX figure the release card reports.
- **The allowance wall** is the moment a release is refused because this week's free patterns are spent. A **pattern** is one line of a release, one channel at one address. Free is a 100 pattern gift once, then 10 a week.

## The answer, first

- **Nobody reaches a year, in any arm that still has even one friction left in it.** Across the six arms that model today's product (as built, every friction's cost raised a quarter, lowered a quarter, paid, no free rerun at the wall, and a habituation term added) and the seven arms with exactly one friction removed, active at day 365 is zero, out of 50,000 person-runs for each of the six and 10,000 for each of the seven. Only the two control arms that remove every friction at once show anyone there at all: 3 of 20,000 with no friction, 112 of 20,000 (0.56 percent) with no friction and a habituation term besides. **So the model's own machinery for forced absence and fading curiosity, not any one fixable defect, is most of what caps the long run.** This run can speak with real confidence through about day 60, with fair confidence through day 90, and the picture thins fast after that.
- **As built, 6.3 percent of the 10,000 are active at day 30**, falling to 4.2 percent once the people the model has already written off inside that window are taken out. At day 60 it is 1.2 percent, at day 90, 0.27 percent. The median last day anyone who leaves is actually seen is day 4.
- **Ranked by what removing it alone actually buys back, on the same 10,000 people and the same draws:** the printed number not moving is worth four times what the box reading nothing is worth, which in turn is worth about double a story making the shadow weight worse or no way to hand the product to a colleague, which in turn is worth noticeably more than the sixty three question intake, an unmet want, or the allowance wall, measured this way:

  | Removed | Active at day 30, built vs that one friction gone | Lift |
  |---|---|---|
  | **The printed number does not move (F4)** | 6.1% to 10.4% | +4.3 points, about 70 percent more people |
  | The box reads nothing (F1) | 6.1% to 8.1% | +2.0 points |
  | A story makes the shadow weight worse (F14) | 6.1% to 7.4% | +1.3 points |
  | No way to hand it to a colleague (F12) | 6.1% to 7.3% | +1.2 points |
  | The sixty three question intake (F7) | 6.1% to 6.5% | +0.4 points |
  | An unmet want, no credit (WANT) | 6.1% to 6.3% | +0.2 points |
  | The allowance wall (WALL) | 6.1% to 6.2% | +0.1 points, inside this test's own noise |

  This is a single seed per row, so the smallest rows are not reliable past their own order of magnitude; the top three are the real, repeatable finding.
- **The printed number lever is really two different people's problem, and the fix is not the same for both.** Pulled apart by who it helps: removing it lifts Diane from 1.8 to 16.1 percent active at day 30, and Derek from 2.7 to 12.8. Diane never once writes a story or runs a release in 9,000 simulated Dianes; her sessions are too short for either door (0.7 to 2.5 minutes against a 3.4 minute story and a 1.2 minute release), so for her this friction is standing in for "nothing happens in the two minutes I have," not "the release I ran did not show." Derek does release more than half the time he opens the app; for him it genuinely is that a release's real effect on CQ, about 0.0008 of what is left per pattern, rounds to no visible move.
- **Diane reaches the intake and nothing past it.** 37.4 percent of her arrivals answer at least one block of the sixty three questions; none complete it, and none ever write a story or run a release. She is the largest ICP by weight.
- **Who stays longest, as built, active and not yet gone at day 30:** Ana 18.5 percent, Sofia 8.6, Marcus 9.4. **Who is gone soonest, by the day they were last actually seen:** James (day 1), Angela (day 3), Diane (day 2). Gordon and Rosa barely arrive at all, which is what their own `RESEARCH-icp.md` entries already say they would do.
- **The allowance wall decides almost nobody overall, and one real person in this roster it decides a lot for.** It lifts no ICP's day 30 figure by more than Ana's 1.4 points in the single-friction test above, and in the five-seed paid arm (everyone on tier one, 400 patterns a month, written the way the real server would write it) Ana's day 90 figure nearly quadruples, 0.80 to roughly 3 percent of her arrivals, because she is the one person in the roster who uses the product often enough to spend a hundred patterns before she would otherwise have left anyway. 34 percent of her arrivals hit the wall, at a median of day 23.

## How this was built, and what is measured versus modelled

Port, do not rebuild. This is `sim/harness.js` (the repository's own 1,000 person, 90 day harness) carried to 10,000 people and 365 days, on the current doors. PR #159 was read first: it used seven ICPs from Google Drive, an even split, no weights, no show up model, and everyone opened the app every day, so it could not say who drops out. Its seven are not the ones `DECISIONS.md` names for simulation ("against the real engine and its nine ICPs", round AZ5), and only the nine have engine data. So this run uses the nine.

**Measured, by the shipped engine, every day a person opens the app.** None of this is modelled:
- The story commit, as `ui/storyui.js` `stCommit` does it: `parseStory`, `applyStory`, `applyStoryAddr`, `verpApply`, `leanApply`, the entry, the save and the history row.
- The release, as `ui/release.js` `relCoolDown` does it: the allowance (`meterBudget`), whole address plans (`meterPlanWhole`), `relWrite` at every address, `meterRun`, `releaseWork` (the only thing that lifts CQ), the firsts, the save, and the free rerun when the wall is hit.
- The ritual, as `ui/ritual.js` does it: `ritFor` calls one practice, the plan is kept seven days, and the entry is marked done only when the person did it.
- The daily summary, as `ui/daily.js` does it: `dlyDayOpen`, the aim, and yesterday's aim answered kept or not.
- The intake, three answers at a time through `iqAnswer` and `iqApply`, drawn around that ICP's own law table in `engine/data/people.js`.
- The streak, the marks and the allowance, read every day off `streakRead`, `ladderRead` and `meterBudget`.
- A paid month, written the way `planFromServer` writes it.

**Modelled, and it is judgement.** Whether a person opens the app today, how many minutes they have, whether they write, whether they do the practice, and whether a session's frictions make them stop. Every one of those numbers is the old harness's `SHOWUP` table, carried unchanged, checked by `check.js` against the harness's own copy so the two cannot silently drift apart. Where the product has changed since that harness was written, the friction was changed to match, and each change is written in the header of `sim/year/model.js` with its reason.

**The clock.** A year cannot be run in a year, and several engine paths read the real clock directly. `sim/year/clock.js` replaces the clock before the engine loads, so every engine read sees the simulated day, in America/New York, because the streak counts days in the person's own local time.

**Two known gaps, left as judgement rather than silently fixed, both measured on 2,500 people:** the simulated ritual plan never carries the address a release just worked on, so a finished release does not mark that day's ritual done through `ritRelDone` the way the product does (129 extra days marked done out of about 4,500, a mean streak at day 30 of 1.05 rather than 0.92, medians unmoved); and the simulated daily summary opens every session, where the product only writes a day when the Summary tab is the one actually showing. Both are written into `sim/year/doors.js`'s own header, not fixed here, because fixing them changes the model's assumptions about session shape and that call belongs with whoever next tunes the SHOWUP table.

**Checked before it was believed.** `node sim/year/check.js` runs 22 known good cases and `main.js` refuses to run the year if any fails. Among them: a ritual planned but not done counts no day; a blank profile reads nothing; a story never moves CQ; a release spends whole addresses, lowers the charge it ran on, and lifts CQ through `releaseWork`; the allowance refuses a run once spent and refills a week later; the same person run twice is identical; a true zero friction control puts no exit down to a friction; and switching one named friction off removes only that one. Across every run, `dlyDayOpen` returned an error 0 times.

## The arms

Active at day D, percent of all 10,000, pooled across seeds. Five seeds for the six arms that model today's product (and the two controls that remove every friction, at two seeds, because they run far longer per person and the headline point does not need five); one seed each for the seven single-friction ablations above.

| Arm | What changes | d7 | d14 | d30 | d60 | d90 | d120 | d180 | d365 |
|---|---|---|---|---|---|---|---|---|---|
| **As built** | free tier only, nobody can pay | 64.1 | 19.8 | **6.3** | 1.2 | 0.27 | 0.04 | 0.0 | 0.0 |
| Frictions raised a quarter | every cost times 1.25 | 64.1 | 16.6 | 4.7 | 0.74 | 0.17 | 0.04 | 0.0 | 0.0 |
| Frictions cut a quarter | every cost times 0.75 | 64.1 | 25.1 | 8.8 | 2.0 | 0.43 | 0.06 | 0.0 | 0.0 |
| Habit | drift fades as kept practice approaches 66 days (the Lally 2010 term `tools/ritualsim.js` already carries) | 64.1 | 19.8 | 6.3 | 1.2 | 0.28 | 0.04 | 0.0 | 0.0 |
| No rerun | nobody takes the free rerun at the wall | 64.1 | 19.8 | 6.2 | 1.1 | 0.27 | 0.03 | 0.0 | 0.0 |
| Paid | everyone on tier one, 400 patterns a month | 64.1 | 19.8 | 6.4 | 1.4 | 0.35 | 0.05 | 0.0 | 0.0 |
| No friction (control) | every friction cost is zero | 64.3 | 48.5 | 36.9 | 18.9 | 8.8 | 3.7 | 0.81 | 0.01 |
| No friction and habit (control) | the same, plus the habit term above | 64.3 | 48.5 | 37.1 | 19.7 | 10.0 | 4.9 | 1.6 | 0.56 |

How to read it:
- **The gap between "as built" and the no friction control is the product's real cost, and it is large: about six times the day 30 figure, and about thirty times the day 90 figure.** That gap is the finding. The absolute level of any one row depends on the judgement layer underneath it.
- **The habit row barely moves against built**, because almost nobody keeps a practice often enough, long enough, for the term to start working before something else ends the record. It moves a great deal against the frictionless control, where people live long enough for it to matter: day 180 goes from 0.81 to 1.6 percent, day 365 from near zero to 0.56. **A habit mechanism is worth little while the other frictions are still removing most people early; it would be worth a great deal more once they are fixed.**
- **How stable the built figures are.** Across five seeds, day 30 runs 6.1 to 6.5 percent, and the pooled 95 percent interval is 6.0 to 6.5. At day 90 it runs 0.24 to 0.29. The cohort is large enough that seed noise is not the main source of uncertainty here; the judgement layer is. Moving every friction cost a quarter either way moves day 30 between 4.7 and 8.8.

## Who stays and who leaves, by ICP, as built

Pooled over five seeds, 50,000 person-runs. "Opened" is the share who opened the app at all. "Active and not yet gone" takes out the people the active figure's seven day window still counts though the model has already closed their record.

| Who | People per seed | Opened | Active d30 | ...and not yet gone | Active d90 | ...and not yet gone | Last day actually seen, median |
|---|---|---|---|---|---|---|---|
| Ana | 500 | 71.2% | 23.7% | **18.5%** | 0.80% | 0.56% | 15 |
| Sofia | 1,400 | 81.4% | 13.4% | **8.6%** | 0.34% | 0.24% | 10 |
| Marcus | 1,600 | 57.6% | 12.0% | **9.4%** | 0.57% | 0.38% | 9 |
| Derek | 1,700 | 72.7% | 3.2% | 1.3% | 0.02% | 0.02% | 6 |
| Angela | 1,500 | 79.4% | 2.6% | 1.1% | 0.05% | 0.01% | 3 |
| Diane | 1,800 | 86.0% | 1.6% | 0.79% | 0.44% | 0.19% | 2 |
| James | 1,000 | 41.2% | 0.52% | 0.24% | 0.0% | 0.0% | 1 |
| Rosa | 150 | 12.8% | 0.40% | 0.40% | 0.0% | 0.0% | 1 |
| Gordon | 350 | 4.6% | 0.0% | 0.0% | 0.0% | 0.0% | 1 |
| **All** | 10,000 | 68.4% | 6.3% | **4.2%** | 0.27% | 0.16% | 4 |

What each row is saying, backed by what the record actually holds for them over their whole run (not only the last day):

- **Ana and Sofia are the product's real users in this model.** Ana releases 7.45 times on average, across 91 percent of her arrivals who release at least once, and closes the whole loop (a story, a release, and a kept practice, all at some point in the record) in 78 percent of arrivals. Sofia closes it in 57 percent, releasing 2.33 times on average across 67 percent who ever release. They are also the only two who reach the allowance wall in real numbers: 34 percent of Ana's arrivals and 2.3 percent of Sofia's.
- **Sofia's own largest named exit, among the sessions she leaves on, is that she cannot hand the product to a colleague (26.5 percent of her exits), which is the ICP whose whole stated value is referral.** The practitioner view still returns an empty list (`pracSightList`), and the practitioner tier is not buildable in this build.
- **Derek and Diane both want the number to move, and for most of the sessions they have, nothing visible happens at all.** Derek writes a story in 75 percent of his arrivals and releases in 55 percent; his own exits are led by the number not moving (36 percent) and a story making the shadow weight worse (22 percent), both real sessions where he did something. Diane never does either, in 0 of 7,737 arrivals; her number-not-moving exits (42 percent of hers) are sessions where nothing at all happened in her 0.7 to 2.5 minutes.
- **Marcus and Angela sit in between.** Marcus writes in 56 percent of arrivals and releases in 35; his biggest named exit is the box reading nothing (10 percent of his exits), and removing that friction alone would lift his day 30 figure from 11.9 to 14.1 percent. Angela writes in 91 percent of her arrivals (the highest in the roster) and releases in 62, and her biggest named exit is a story making the shadow weight worse (29 percent); removing that friction alone lifts her from 3.3 to 7.3 percent.
- **James and Rosa barely engage even when they open the app**, and Gordon almost never opens it at all (4.6 percent of his 350-weighted share, falling to 0 active by day 30 across all five seeds), which is exactly what his own entry in `RESEARCH-icp.md` says he would do.

## What the engine reads for the people still here

For the people active at day 30 (3,126 of 50,000 runs): median CQ 49.5, 64 percent with a complete reading, median streak 1, median marks earned 3, median 20 patterns opened, median 80 left. At day 90 (136 runs): median CQ 44.3, 54 percent complete. **These medians are lower than the first draft's, because the session-memory fix removes a number of releases that were running on stale, weeks-old addresses; the engine readings here are the honest ones.** The people who stay are, on the whole, not seeing a complete reading, and the ones with one are not seeing it climb.

The daily summary froze a real day 2.84 times per arrival and stayed silent 0.27 times (figures carried from the first draft's door counts; the session-memory fix does not touch this door). `dlyDayOpen` returned an error 0 times across every run in this report.

## What this run cannot tell you, plainly

- **Who is here at a year, with any confidence.** Only the two controls that remove every friction at once show anyone there at all, and even then under one percent. A year-long answer needs a real, sourced model of habit formation that this repository does not have; borrowing the Lally fragility term, as the habit arm does, moves the frictionless control's figure noticeably but barely touches the built one, because the built one loses almost everyone long before a habit could form.
- **Absolute retention.** Every absolute figure sits on the old harness's `SHOWUP` table, which is a reasoned estimate and not a measurement. Moving the friction costs a quarter either way moves day 30 between 4.7 and 8.8 percent. Read the gaps between arms and the ranking of the ablations; do not read the levels as a forecast.
- **A clean split of "the number did not move" into its two different causes, person by person.** The per-person files hold totals across a whole year, not a session-by-session ledger, so the claim that this friction means one thing for Diane and James (nothing happened) and another for Derek (something happened and still did not show) rests on whether that ICP ever releases at all, not on a direct count of which case fired on which day. Settling it exactly would need the harness to log the reason at the moment it fires, which it does not do today.
- **Anything about Gordon, Rosa or James past day 30.** Too few of them are ever active to say anything with the sample sizes here.
- **Money, beyond the allowance.** Checkout is closed in the build (`PLAN_CHECKOUT_OPEN` is false), so nobody can pay as built. The paid arm writes the plan the way the server would. It is a test of the allowance wall, not a revenue forecast.
- **The interface, directly.** The engine is driven directly, through the same calls the UI makes. The landing counts and some friction magnitudes were measured in a real browser on 5 November on a blank profile and are inputs to the model, not live readings taken during this run.

## What would move the curve, in the order the ablations rank it

1. **Give Diane, and anyone like her, a door that fits in under a minute.** She never reaches a story or a release in this entire run. This is the single biggest lever measured (+4.3 points of day 30 retention when the friction standing for it is removed), and for her specifically it is not about a release's visible effect, since she never runs one.
2. **Make a release's effect on Derek's printed number actually visible.** He does the work; the number does not move enough to notice. The same lever, aimed at the other half of the people it affects.
3. **Read more of what people write.** The box reads nothing for 17 of 41 story bank lines tried; removing this friction is worth 2.0 points of day 30, concentrated in Sofia, Ana, Marcus and Angela.
4. **Stop an honest story from making the screen worse.** Worth 1.3 points, concentrated in Angela and Ana.
5. **A way to hand it on, for Sofia specifically.** Worth 1.2 points overall, and it is her single named exit reason.
6. **The sixty three question intake and the allowance wall are real but small**, worth 0.4 and 0.1 points respectively on this test, except that the wall is worth a great deal to Ana alone, who is one of only two people in this roster who stay long enough and use the product hard enough to hit it.

## To run it again

    node sim/year/check.js                  the 22 self checks, about 15 seconds
    node sim/year/main.js                   every main arm, five seeds, about ninety minutes on four cores
    node sim/year/main.js built 20261105    one arm, one seed, about two minutes
    node sim/year/main.js off-F4 20261105    one single-friction ablation arm
    node sim/year/aggregate.js              the tables above, from whatever files main.js has written
