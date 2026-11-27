# One CQ: the model under his third ruling, fitted by simulation

Tomas Egilsson. 25 September, third revision. Read only: nothing in either repository was edited, and nothing was pushed.

**Sources.** The authority is `DECISIONS.md` at `f885d8f`, in three sections: "One CQ", "The CQ ruling, corrected" and "The CQ ruling, third pass", plus "Sight, tiers and the private record". Where they differ, the later section wins. This revision replaces the two before it. Every reading those rulings settled has been taken out, not argued with.

**Builds.**
- MOB `engine.js`, md5 `4a8f587b707f6bca0346bd6206998fec`, run headless.
- Desktop `atuned/build/atuned.html` at `8ba42de`, run in Chromium.

**Scripts** are all in `scratchpad/cq/`:
- `cqsim.js`: the simulation. Output in `cqsim.out.json` (seed 7) and `cqsim.seed11.json` (seed 11).
- `worked.js` and `worked_sd1.js`: the worked people.
- `mob.js`, `mob2.js`, `mob_release.js`, `desk.js`, `desk2.js`, `desk3.js`: the two engines as they stand.

Anything not run is marked **unrun**.

## Fixed by him, and not to be reopened

| | Ruled |
|---|---|
| CQ | The 21 laws in `SI` (`canon.js:400-442`), summed: 210 is 100 percent. Pure: nothing else enters it |
| CQ before all 21 are in | Builds up from zero as laws are answered. It never starts full and falls |
| SQ | One value per address, 112 of them, the four outside the body included |
| DQ | **The total shadow.** Not the gap, not both. He asked not to be asked again |
| SQ against CQ | A lever. The shadow pulls against CQ, and the pull is a bell curve over intensity: "a little tense" and "paralyzed" differ by orders of magnitude. The curve is **fitted, not assumed** |
| Intention | What a person said they would do against what they did. Charge read directly is not intention. Only charge tied to an action counts, and it counts as the reason, not in the number |
| Awareness | A modifier on that gap, not a term |
| The band | 4 to 6 drawn slightly differently, 5 marked, "oscillating" never printed |
| Harmonic layer | Information, not a reading. One tone per address, from measured bowls, in the chakra's colour |
| The story | Stored server side for recovery, never shared, used for modelling only |

---

## A. The two formulas as they run, in brief

The live lines were quoted in this file's earlier revision and are at `compute.js:50-140` and `45_the-psyche-map.js:329-788`. What matters now:

| | MOB, `compute.js:124-140` | Desktop, `45_the-psyche-map.js:717-729` |
|---|---|---|
| CQ | `It x Ig / Rz`: the law mean counted twice (so squared), with the shadow in `Rz` and in the pole and overshoot terms | `mean(committed laws) x 10 x sqrt(follow-through) / (1 + sqTen/10)` |
| DQ | A total of the shadow, over addresses at 4 or more. **His ruling's definition already, apart from the threshold and the scale** | `100 - cq`. **Now wrong under his ruling** |
| SQ per address | Exists: `n.sq`. The four outside are forced to 0 (`compute.js:64`) | Does not exist. Twelve charge levels, no addresses |
| Every law 5, nothing held | 25 | 50 |
| Every law 5, heavily loaded | 9.68 | 25 |

MOB's live formula also lowers CQ on a release in 22 of 10,000 runs. The installed opposite pushes past the overshoot line and is subtracted from both law factors. This is logged at `9f4c7e5`.

---

## B. The model

### B.1 Code-ready arithmetic

```
// INPUTS
//   answers[63]  the intake, three framings per law, null until answered (MOB intake.js)
//   sq[112]      weight at each address, 0..10. MOB: n.sq on the body ring; the four
//                outside take the mean of the seat they extend (Crown above, Root below)
//   said[], did[]  commitments in the window and whether each was kept (the ritual record)
//   reasonNamed[]  for each broken commitment, whether the person tied it to a story

// CQ. Builds from zero. A law counts once its three framings are in (intake.js:53).
law[l] = all three answered ? round1(mean of the three) : null
CQ     = sum over the 21 of (law[l] ?? 0) / 210 * 100       // 0 at the start, never falls while answering
complete = every law[l] != null                             // the tier word waits for this (D)

// SQ. 112 values. Never collapsed into one number on screen.
SQ[a]  = sq[a]

// DQ. The total shadow, on the same 0..100 scale as CQ.
DQ     = sum(sq) / 1120 * 100

// THE LEVER. Fitted (C.3): a bell over intensity, per address, centre 5, width 1.25.
pull[a] = Phi((sq[a] - 5) / 1.25) / Phi((10 - 5) / 1.25)    // 0.008 at 2, 0.5 at 5, 0.999 at 9
PULL    = sum(pull) / 112                                   // 0 with nothing held, 1 with every address at 10
expression = CQ * (1 - PULL)                                // CQ 100 SQ 0 gives 100; any shadow pulls it down

// INTENTION. The gap between said and did. The desktop's window: the last seven days.
intention = said.length ? 100 * did.length / said.length : null     // null: nothing was said
reasons   = for each broken commitment, the address it was tied to, heaviest SQ first,
            and the stored story at that address. Shown as the why. Never in the number.
awareness = reasons named against reasons missing, in words, beside intention   // PROPOSAL, unrun
```

`Phi` is the standard normal cumulative. `cqsim.js` carries a working implementation.

**Why each piece is this simple:**
- **CQ builds from zero** because an unanswered law contributes 0 to a fixed denominator of 210. Answering can only add. The alternative, a mean over the laws answered so far, is what the desktop does, and C.1 measures how often it falls.
- **DQ is a plain total.** It is what he ruled, and it is already what MOB computes, less the threshold at 4.
- **The pull is applied per address** because "a little tense" and "paralyzed" describe intensity at a place, and SQ is per address by his ruling. The simulation compared this with a bell on the total (C.3).
- **Expression is CQ times what the shadow leaves.** That is his lever, "CQ 100, SQ 0 ... one pulls down the other", with CQ itself untouched.
- **Intention has no charge in it.** A commitment carries the address it was made for; the ritual is already built from the release addresses. When a commitment breaks, the heaviest address it was tied to, and the story stored there, is the reason. That is his "there's a story in there from the SQ somewhere in the body". Because the story is now stored server side, that link survives a reinstall.

### B.2 The worked people

Run in `worked.js`. MOB's default soul. The four outside take their seat's mean.

| Person | CQ | DQ | Addresses at 7 or more | PULL | Expression |
|---|---|---|---|---|---|
| **Nothing entered** | 0, building | not read | none | not read | not read |
| **Every law 5, nothing held** | 50 | 0 | none | 0 | 50 |
| **Every law 5, heavily loaded** | 50 | 47.9 | 16 | 0.413 | **29.4** |
| **Every law 10, heavily loaded** | 100 | 35.2 | none | 0.199 | **80.1** |

- The last two carry similar totals, but only the first has addresses at 7 or more, so it is pulled twice as hard. That is the bell doing what he described: sixteen places near paralysis cost far more than weight spread thin.
- The fourth person reads lighter than the third because MOB's law relief cuts `held` at seats whose laws are high. That term (`compute.js:51`) is still in. He has not ruled on it and it is not in the short list below, because it is an engine constant rather than a question of taste. It is flagged for the owner of `compute.js`.

---

## C. The simulation, run for real

### C.0 Method

**10,000 readings on seed 7, and 10,000 more on seed 11, through the shipped MOB engine.** Each run takes 32 seconds.

**The roster** is the nine ICPs of `sim/harness.js` (`SHOWUP`, lines 228-290): Diane, Derek, Marcus, Angela, Sofia, James, Ana, Gordon, Rosa. Readings are stratified, about 1,111 per ICP, so Rosa and Gordon are measured as well as Diane. The roster weights are used where a fit represents the population.

**Real, from the repository:**
- `compute()`, `applyStory()` and every address's `sq`;
- each persona's soul, charge and opposites (`PEOPLE`) and laws (`LAWSET`);
- their own lines (`sim/stories.js`, written before the lexicon was consulted);
- the intake answer shape (`seedIntake`, `ui/personas.js:439-453`);
- the release arithmetic (`ui/release.js:116-124`, lifted as the harness lifts it);
- the base showup and follow-through rates (`SHOWUP`).

**Judgement, added here:**
- self-report noise of 0.6 on each intake answer;
- the day drawn uniformly from 0 to 90;
- sessions drawn from base rate times day;
- stories and releases drawn from sessions, capped at 12 and 20.

**The retest** is the same person on the same day: a fresh draw of their answers, and of which of their own lines they happened to write and which addresses they released. That is measurement noise as a person would produce it. A first cut that only nudged the charges by 3 percent gave retest correlations of 0.9999, which is too gentle to decide anything, and was replaced.

**Both seeds agree on every fitted parameter**, to the grid step. The numbers below are seed 7.

### C.1 CQ builds from zero

| Rule | Steps where partial CQ fell (of 630,000 answers) | Readings where it ever fell | Started above the person's final CQ | Largest single fall |
|---|---|---|---|---|
| **Sum over 210, missing counts 0** (the ruled rule) | **0** | **0** | **0** | none |
| Mean of the laws answered so far (the desktop's `diagBase`) | 92,829 | all 10,000 | 5,788 | 28 points |

**The desktop's rule is the demoralizing one he described, and it happens to everyone.** The first law answered sets a number, and in 58 percent of readings that number is above where the person ends. Every ICP falls at some point during the intake.

**The tier word must wait for the full 21.** After seven laws the partial CQ can be at most 33. A tier word on a partial reading would therefore call every person on day one Incoherent or worse. Settled by his own reason for the ruling: the partial shows as filling, with no tier word, until all 21 are in (D).

### C.2 Releasing never makes anything worse

8,872 simulated releases on seed 7 and 8,876 on seed 11:

| | Seed 7 | Seed 11 |
|---|---|---|
| CQ changed | 0 | 0 |
| DQ rose | 0 | 0 |
| Any single address rose | 0 | 0 |
| The pull rose, so expression fell | 0 on every candidate curve | 0 |

This follows from the arithmetic, and the proof from the earlier revision stands. CQ reads only the laws. A release writes only charge (down) and installed opposites (up). `sq` is non-decreasing in charge and non-increasing in opposites. Every divisor is fixed. Any cumulative bell is non-decreasing. The simulation confirms it.

### C.3 The bell, fitted

**His two anchors cannot be read by either sniffer.** Measured, one line on a blank field:

| Line | MOB (`parseStory`, `applyStory`) | Desktop (`readSegment`) |
|---|---|---|
| "I am tense" | Disgust 1.82, the heaviest address 1.07 | weight 10, level 1 |
| "I am a little tense" | **identical to "tense"** | weight 6, level 1 |
| "I am extremely tense" | **identical to "tense"** | weight 18, level 2 |
| "I am paralyzed" | **nothing read** | weight 30, level 3 |

MOB has no intensifiers and no row for paralyzed. The desktop reads a fivefold difference in weight and then compresses it to levels 1 and 3. **So the orders of magnitude he described exist in neither instrument's input. They have to come from the curve.** Intensity reaches an address only by repetition. This also marks the sniffer as the next constraint on the lever (H).

**The candidates, scored on the simulation.** Each is scored on:
- **his orders-of-magnitude test:** the pull at the roster's 90th-percentile shadow against its 10th;
- **engagement:** the share of readings where the pull is graded, between 0.05 and 0.95, rather than pinned at none or full;
- **retest:** how well the same person on the same day reproduces it;
- **release safety.**

| Curve | Tense to paralyzed | Engaged | Retest r | Expression retest, 95th percentile | Release safe | Verdict |
|---|---|---|---|---|---|---|
| Linear, `1 - DQ/100` | 24 times | 64 percent | 0.994 | 2.6 points | yes | Fails "orders of magnitude" |
| Population bell, normal fit to the roster's DQ | 5 times | 86 percent | 0.988 | 6.1 points | yes | **Rejected.** DQ across the roster is not bell shaped (KS 0.14; lognormal is worse at 0.17). Fitting a bell to it produces a curve that is nearly flat between a little tense and paralyzed, and it is the least stable |
| Ruled bell on the total (centre 5, width 1, on DQ/10) | 670,000 times | **13 percent** | 0.992 | 2.1 points | yes | **Rejected.** The total is spread over 112, so its median is about 10 (1 on the 0 to 10 scale). A bell centred at 5 on the total engages almost only for Gordon |
| Best bell on the total, inside the constraints | 210 times | 38 percent | 0.995 | | yes | Workable, but it puts the curve on a diluted total rather than on intensity at a place |
| **Bell per address, inside the constraints** | 122 times at the chosen point | 25 percent of carrying addresses graded | **0.994** | | **yes** | **Chosen** |

**How the per-address curve was fitted**, and what decided what:
- **His words set the admissible region.** "Orders of magnitude" is read as at least 100 times the pull at 9 (paralyzed) as at 2 (a little tense). "The range at which we travel", 4 to 6, is read as the bell's graded middle being at least that wide (width at least 1). The region also requires a retest r of at least 0.9 and zero release violations.
- **Inside that region, the data placed the curve.** The criterion was the share of the roster's carrying addresses on the graded part of the bell: the curve should sit where weight actually sits. Grid: centre 2 to 8 in steps of 0.25, width 0.5 to 3 in steps of 0.125. 525 points, 102 admissible.
- **Result, identical on both seeds:** the best point is centre 5.5, width 1.5. Every point within one percentage point of it lies in **centre 5 to 5.5, width 1.25 to 1.5**.
- **The centre he ruled, 5 ("five is the average"), is inside that range.** The data cannot tell 5 from 5.5, so his ruling decides. At centre 5 the widest admissible width is 1.29 (solved exactly), and 1.25 on the grid.
- **Fitted: centre 5, width 1.25.** The pull is 0.008 at 2, 0.21 at 4, 0.50 at 5, 0.79 at 6, 0.95 at 7 and 0.999 at 9. Paralyzed pulls 122 times as hard as a little tense.
- **The width barely matters to anyone.** At width 1.0 (741 times) the heavily loaded person reads 30.4 against 29.4. The width mainly changes how little light charge costs. That is why it is settled here rather than asked.

**What the fit rests on, stated plainly.**
- The simulation cannot say that 5 is where paralysis begins in a human body. It can say three things: the ruled centre sits where the simulated roster's addresses actually carry weight; the curve is reliable; and it never punishes a release.
- The width is at the edge of his own "orders of magnitude". His words fix it, not the data.
- The first trial also optimised for telling the nine ICPs apart. That picked a width of 0.25, a switch that was graded for only 1 in 100 readings, because it rewarded separating personas we wrote ourselves. That is leakage, so persona separation is reported and was not optimised.
- The real refit belongs to real stories, which his storage ruling now permits for modelling (H).

### C.4 The nine, under the fitted model

Medians across each ICP's readings over ninety days, seed 7. Intention is the median over the readings where anything was said.

| ICP | CQ | DQ median (10th to 90th percentile) | Addresses at 7 or more | PULL | Expression | Intention | Readings with nothing said |
|---|---|---|---|---|---|---|---|
| Rosa | 95.8 | 0 (0 to 0) | 0 | 0 | 95.8 | 50 | 51 percent |
| Sofia | 73.3 | 2.1 (0.4 to 3.7) | 0 | 0 | 73.2 | 67 | 7 percent |
| Angela | 64.5 | 3.4 (1.3 to 5.4) | 0 | 0 | 64.4 | 33 | 5 percent |
| Marcus | 62.1 | 9.8 (6.8 to 12.4) | 0 | 0.002 | 61.9 | 0 | 13 percent |
| Diane | 59.6 | 11.9 (4.4 to 19.7) | 0 | 0.006 | 59.0 | 16 | 4 percent |
| Derek | 49.2 | 11.1 (2.7 to 24.1) | 0 | 0.005 | 48.6 | 73 | 4 percent |
| James | 43.9 | 26.5 (20.3 to 29.3) | 0 | 0.090 | 40.1 | 0 | 28 percent |
| Ana | 41.3 | 20.2 (10.3 to 34.7) | 0 | 0.040 | 39.6 | 61 | 4 percent |
| Gordon | 20.1 | 53.6 (47.6 to 53.8) | 22 | 0.454 | 11.1 | 0 | 63 percent |

**What this shows:**
- **The lever bites where the weight is concentrated, and almost nowhere else.** Diane carries a DQ near 12 spread thin and loses half a point. Gordon has 22 addresses near paralysis and loses nine. That is "a little tense is different than paralyzed" on the roster.
- **Intention here is not evidence.** The simulation's kept rate is the harness's authored follow-through (`SHOWUP.work`), so the intention column only reads back what was written into the personas. The link between action-linked shadow and the gap **cannot be learned from this data**, because nothing in the simulation makes a broken step depend on the body. It needs real ritual records with the reason tied, which the stored story now makes possible.
- **What the simulation does show about intention:** for Gordon, Rosa and James, a large share of readings have nothing said, so intention is "not read" for them much of the time. The surface has to carry that state well.

### C.5 The four outside addresses

| Rule | Retest r | Retest, 95th percentile | Median DQ | 90th percentile DQ |
|---|---|---|---|---|
| Zero (the engine today) | 0.9935 | 4.04 | 9.87 | 45.8 |
| **Mean of the seat they extend** | 0.9935 | 4.16 | 10.11 | 47.6 |
| Heaviest of that seat | 0.9935 | 4.22 | 10.39 | 48.2 |

His ruling excludes zero. The simulation cannot tell the mean from the heaviest: their retest differs by 0.06 of a point. **Settled: the seat mean, as the simpler rule.** The Sol Star and Stellar Gateway take the Crown's mean, and the Earth Star and Gaia Gateway take the Root's. This matches the desktop's `NODEREG` seating and his torus.

---

## D. Settled this round, with the evidence

| Item | Settled as | On what |
|---|---|---|
| The four outside addresses | Seat mean | His ruling that they count, plus C.5 |
| The bell | Per address, centre 5, width 1.25 | His words set the region, the simulation placed it (C.3) |
| Partial CQ | Sum over 210, filling from zero, with no tier word until all 21 are in | His ruling, plus C.1: every alternative falls, and a tier word on a partial calls everyone Incoherent or worse |
| The band | 4 to 6 drawn slightly differently on every 0 to 10 scale (each law, each address), 5 marked. On CQ, 40 to 60 with 50 marked (MOB already draws this range). Never the word | His instruction |
| Aesthetic Beauty | One of the 21, as `SI` has it | His ruling that `SI` is the roster. The desktop's `LAWS1` moves it back from expression |
| The eight expression laws | Not in CQ | `SI` is the 21. Whether they enter expression is question 3 |
| Ownership (`PATHLAW`, `MASTERLAW`: "Moses": "Ownership") | Not a CQ input, so it does not block this. Sent to the canon seat. MOB's own compass records Moses as "was Order" (`compass.js:111`), which is a desktop expression law, not one of the 21 | It does not touch the arithmetic |
| DQ | The total shadow | His ruling |

---

## E. What each engine has to change

### MOB

| File | Change |
|---|---|
| `engine/compute.js:124-140` | CQ becomes `sum(law ?? 0) / 210 * 100`. `Ig`, `It` and `Rz` leave it; keep them computed only for `Y`, `Z`, `will` and `drag` if those readouts stay |
| `engine/compute.js:64` | The four outside take their seat's mean instead of 0 |
| `engine/compute.js:127` | DQ becomes `sum(sq over 112) / 1120 * 100`, with no threshold at 4 |
| `engine/compute.js`, new | `pull[a]`, `PULL`, `expression = CQ * (1 - PULL)`, with the constants `LEVER_MU = 5` and `LEVER_SD = 1.25` named and commented with this fit |
| `engine/compute.js:51,54` | The law relief inside `sq`. Unruled; flagged to the owner of the file, not to him |
| `engine/compute.js:242-276` `cqCeiling`, `cqHeadroom` | Retire them, since a release cannot move CQ, or repoint them to expression |
| `engine/verp.js:353` | `verpFactor` stops multiplying anything in CQ |
| `engine/intake.js:64-70` `iqApply` | Already scores a law only when all three framings are in. Unchanged. The partial CQ reads it as it stands |
| `engine/data/canon.js` `TIERDEF` | The tier word waits for all 21 laws. Its copy describes load against build, which is expression (question 1). The 41 to 50 tier word changes (question 2) |
| Ritual record, schema | A commitment carries the address it was made for, so a broken one can name its reason. This is a schema addition, so SOURCE compatibility applies, and that is his call |
| `engine/schema.js:175` `snapshot` | `dq` changes meaning. Version the row |
| `ui/release.js:111,205` | Report expression and the addresses, not CQ, before and after |
| `tests/engine.js` | Add the invariants: a release never changes CQ or raises any address; partial CQ never falls while answering. Add the fitted pull values at 2, 5 and 9 as a pinned fixture |

### Desktop

| File | Change |
|---|---|
| `src/32_story.js:184` `LAWS1` | Match `SI`, and it becomes 21 |
| `src/46_...js:695-706` `diagBase` | Sum over 210 with missing laws counting 0. Today's mean over committed laws fell in every simulated intake (C.1) |
| `src/45_the-psyche-map.js:717-729,788` | `cq = diagBase()`, no `sqrt(intent)`, no `R`. `dq` becomes the total shadow, not `100 - cq` |
| `src/45_:329-337` `bandTen`, `sqTen` | Retire. The desktop needs a weight per address before it can compute SQ, DQ or the pull at all. Until then, any figure is a stand-in read from the charges and must say so |
| `src/45_:357-361` `intentionOne` | Already the gap between said and did over seven days. It stays, as intention, and leaves CQ |
| `src/30_:649` `chargeState` | Stops printing "Oscillating" |
| `data/readings_fixture.json`, `simulateReadings` | Every pinned reading moves. Add the new invariants |

---

## F. Open, and his to call

Only what needs his taste. Each option is worked on people from C.4 or B.2.

1. **Does the tier word name the integrity or what gets out?**
   - (a) CQ, the laws only. Gordon reads 20.1, Severe. The person with every law at 10 and a heavy body reads 100, Mastery.
   - (b) Expression, after the pull. Gordon reads 11.1, still Severe. That same person reads 80.1, Compounding.
   - The ladder's copy ("builds more than it costs", "almost nothing is held") describes (b). Under (a), a person at 100 with 35 of total shadow is told almost nothing is held.
   - **Recommend (b).**

2. **The 41 to 50 tier is called Oscillating, and the word may not print.**
   - (a) Median, the word the desktop already uses for 5.
   - (b) A word you choose.
   - Worked: Derek at 48.6 expression lands in this tier.

3. **Do the eight laws of expression** (Curiosity, Play, Creativity, Flow, Beauty, Order, Love, Will) **enter the expression number?**
   - (a) No. They are shown beside it as the high points, answered like the 21.
   - (b) Yes, as a ceiling: expression cannot read above their sum over 80, times 100.
   - Worked under (b): a person with CQ 64 (Angela) whose expression laws sum to 40 of 80 reads expression 50, not 64.4.
   - **Recommend (a)** until they have been measured on anyone. No ICP has expression law scores, so nothing can be simulated for (b).

4. **How does awareness modify the gap?** You said it is a modifier.
   - Take a person who said ten things this week and did six. They tied a story to three of the four they did not do.
   - (a) It is shown beside intention in words ("you can see why for most of what you did not do"), and it changes no number.
   - (b) It scales intention: 60 becomes 60 x (0.5 + 0.5 x three quarters) = 52.5.
   - **Recommend (a).** Under (b), knowing why gets folded into whether you did it, so two people who kept exactly the same promises read differently.
   - This one is **unrun**: the simulation has no model of naming a reason.

5. **The tone colour for the four outside addresses.**
   - (a) Crown colour above, root colour below. This matches where their weight now comes from (C.5).
   - (b) One field colour for all four.
   - **Recommend (a).**

---

## G. The harmonic layer

- **Information, not a reading.** One tone per address, offered as a sound healing option. It never enters CQ, SQ, DQ, the pull, intention or expression. It prints in the chakra's colour.
- **Real bowls, not folklore numbers.** The only measured numbers available are recordings of actual bowls: each fundamental and its overtones. Which bowl goes with which address is an assignment the product states, not a measurement of the person.
- **A correction to `harmonic-research.md` that keeps its finding.**
  - The memo tested a standing-wave model, a pitch set by physical length, and its conclusion stands for that model.
  - His claim is different: a tone registers the same way whatever the body's size, "like a current".
  - The memo neither tested nor refuted that claim. It found no study comparing one bowl frequency against another for a seat-specific effect, and measured bowl effects run through tempo, not pitch.
  - Untested, not refuted. Ruled as information, it needs a label, not a test.

## H. What would make this wrong, and how we would know

- **The fit is on authored people.** The ruled centre was confirmed against the simulated roster's weights, not against bodies. Real stories are now stored for modelling under his ruling. The team's note in `DECISIONS.md` asks for consent at the point of use and de-identification before any fit.
- **Once that is in place, refit centre and width on real addresses** with the same code (`cqsim.js`), the same constraints and the same criterion. His constraints stay; the data may move the centre within them.
- **The sniffer caps the lever.** MOB cannot tell "a little tense" from "extremely tense" and does not read "paralyzed" at all. Until it reads intensity, one line of any strength weighs the same, and intensity arrives only by repetition. The desktop's intensifier table (`MOD`, 23 entries) is the obvious port. It is a sniffer change, so it goes through the lexicon rules and not through this file.
- **The link between shadow and intention is not learnable from any simulation.** It needs real records of commitments and their tied reasons, and it is now answerable: within a person, does a commitment tied to an address at 7 or more break more often than one tied to an address at 2? That is the first honest test of "there's a story in there from the SQ", and it needs no labels, only the record.
- **CQ is self-report.** Each law's spread across its three framings (3 or more marks it unreliable, `intake.js:57`) belongs beside it.
