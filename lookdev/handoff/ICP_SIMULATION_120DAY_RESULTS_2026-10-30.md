# ICP panel simulation: 1,000 synthetic people x 120 days, real MOB engine

Run 2026-10-30. Built and executed in an isolated clone of this repo
(`/home/user/mob-icp-sim`, never `/home/user/mob`), on branch
`sim/icp-1000-120day-2026-10-30`. Tooling lives under `tools/sim/icp-120day/`
and does not touch `canon.json`, `trace.js`, or any shipped engine/content
file.

Every number below is read directly off this run's own output
(`tools/sim/icp-120day/out/aggregate.json` and the per-shard `.jsonl` files
it was built from), not estimated or extrapolated. Where a number could not
be produced honestly from the simulation, that is said plainly instead of
filled in with something plausible.

---

## 1. What was read, and where it did not match the task's description

**01_IDENTITY_PROFILE.md** (Google Drive, `1i1oVtpVS03xind014ZGEDYtG8Phhv78Q`)
has the "ICP PANEL (7 ICPs)" table, read in full. It has exactly 5 columns:
ICP, Type, Key Need, Trigger, Kill. That is the whole of the per-ICP content
in that document.

    Marcus Webb        Creative Director   Visible architecture              Bloom animation   Mechanism invisible
    Sofia Vasquez       Practitioner        Session-usable tools              Anatomical precision   No practitioner mode
    Angela Tomás        Seeker              Contemplative depth               Ancestral language      Clinical register
    Derek Han           High-Performer      Single highest-leverage move fast Speed mode               Pacer too slow
    James Worthington   C-Suite             Physical anchor                   "OVERREACH" lands        No somatic instruction
    Diane               Founder             Win state after release           Bloom                    No post-release landing
    The 1000             Disillusioned buyers Journal Negotiator detection     Mechanism distinctness   Looks like affirmations

**This is thinner than the task description implied.** There is no
demographic or psychographic field beyond "Type" in this document. Flagging
this plainly rather than inventing fields and presenting them as Drive's.

A second document, **MOB_Master_Reference_May2026.md**
(`1hKSQySUj0i7CNNr_5gneRQwRoHCedX7b`), has a separate "ICP GRADES -- CURRENT
(May 6 2026)" section that does carry one demographic field, age, plus an
independent 0-1 completeness grade from a different review pass (Marcus
44/0.91, Sofia 38/0.89, Angela 51/0.87, Derek 36/0.86, "Dr. Worthington"
57/0.87, Diane 43/0.90, The 1000/0.91). This is a **different number** from
07_PREPRO_ROADMAP's Current%/Target%, not a contradiction to resolve: two
separate review passes exist in Drive. This simulation reports against
07_PREPRO_ROADMAP's numbers because that is the document the task named and
the one gating the real sprint milestone.

**07_PREPRO_ROADMAP.md** (`17R0e8dZPfoDF_mUpIFz4sChOqdV0C8QZ`), "ICP TARGET
SCORES FOR MVT ENTRY," read in full and verbatim:

| ICP | Current% | Target% |
|---|---|---|
| Marcus Webb | 55 | 80+ |
| Sofia Vasquez | 76 | 85+ |
| Angela Tomás | 48 | 80+ |
| Derek Han | 62 | 80+ |
| James Worthington | 44 | 80+ |
| Diane | 72 | 85+ |
| The 1000 | 60 | 80+ |

That document also states, in its own words: **"Primary score blocker across
all ICPs: Spiral invisible on white,"** second blocker "No win state after
release," third "No 'next node' surfacing." All three are named as visual or
interaction-design defects, not backend/engine defects. That is relevant to
section 5 below.

**The real engine files**, all read directly in the isolated clone before
anything was built against them:

- `atuned_src/engine/compute.js`: `function compute()`, zero arguments,
  confirmed.
- `atuned_src/engine/profiles.js`: `profOpen`/`profCreate`/`profDelete`,
  confirmed.
- `atuned_src/engine/daily.js`: header reads, verbatim, "HOST FREE. Nothing
  here touches a document, a store or a network, and the moment is always
  passed in." `dlyDayOpen(p,now,save,opt)` confirmed, 4-arg signature exactly
  as described.
- `atuned_src/engine/practice.js`: `practiceDo(P,act,a,now)` confirmed, but
  with one correction to the task's framing: **`practiceDo` operates on
  `p.practice`, a sub-object, and returns a new one** (`{ok,P,...}`); the
  caller must assign `p.practice = result.P` itself. It does not take or
  return the whole profile.
- `atuned_src/engine/seed.js`: `SEED16` confirmed real; on its own it tops
  out around 4-5/10 charge per axis (see section 4).
- `atuned_src/engine/trace.js`: `TRACE_CHAIN = ['saboteur','complex',
  'hyper_complex','super_complex']` confirmed verbatim, and the graph-walk
  table `TRACE_CHAIN_OF` has exactly these 4 rungs and nothing above them.
- `vendor/reboot-os/canon.json`: `registers.complexes` is 23 rows, each
  **exactly** `[name, glyph, [saboteur names], evidence code, one sentence]`
  -- 5 fields, confirmed on every row, not a sample. `registers.
  hyper_complexes` is 9 rows, the same shape. By contrast,
  `atuned_src/engine/data/kb.js`'s `SABDEF` table (one rung down, the
  saboteurs) carries 4 real prose fields per entry -- a definition, a
  trigger, an intervention, and a quoted internal line, often hundreds of
  words. **Saboteurs are richly described in this codebase. Complexes and
  hyper-complexes, one rung up the same chain, are not.** That is the real,
  concrete shape of the content gap this run measured against, not an
  abstract claim.
- `engine.js` (repo root, 24,447 lines): the real, already-built engine file
  `tests/daily.js` itself requires by default. Loads and runs headless with
  a plain `require('./engine.js')`, confirmed.
- `blankProfile()` / `validateProfile()`: both confirmed, in
  `atuned_src/engine/schema.js`.

No prior 1,000x120 harness existed to resume; this is new work, confirmed
by this session's own search before building anything.

---

## 2. The generator's real design

`tools/sim/icp-120day/icps.js` carries the 7 ICPs' real fields from Drive
plus this generator's own, explicitly-labeled modeling layer built on top of
them (MBTI pool, which 2-3 laws and which 1-2 of the 9 child-fetter charges
each ICP's stated Kill condition loads, grounded in the Kill/Key Need text
and stated inline so it is auditable, never presented as something Drive
itself said).

**Distribution: even split across the 7 ICPs**, ~143 each (1000 / 7 =
142.86; six ICPs get 143, one gets 142, assigned deterministically by index).
Nothing in either Drive document suggests a different weighting (no stated
market size or priority order among the 7), so even split is the plain
default, stated rather than assumed silently.

**What varies per profile, within its ICP, all through real engine
mechanisms:**

- **MBTI type**, drawn from a 4-type pool per ICP (`seedApply`, `seed.js`'s
  real `SEED16` mechanism).
- **63 real intake answers** (`iqAnswer`/`iqApply`, `intake.js`): each of the
  21 laws' left/right/neutral triad drawn around the ICP's own Current% (as
  a 0-10 mean), with extra bias on the 2-3 laws tied to that ICP's Kill
  condition, and real per-triad spread so the engine's own reliable/
  unreliable read (`iqScore`'s `spread>=3` rule) varies person to person.
- **Child-fetter axis severity**, on top of the MBTI seed: 1-2 of the 9 real
  charges (`seed.js`'s `CHARGES`) per ICP, bumped by a skewed per-profile
  draw (most of the cohort mild, a real minority severe). Added because the
  MBTI seed alone tops out around 4-5/10 and essentially never crosses the
  engine's own `sq>=3.7-4` complex-naming thresholds, which would have
  starved the whole canon-content-gap question of volume to measure.
- Sex at birth alternated; first/last name drawn from a small pool, cosmetic
  only, for a readable gap log.

**All 1,000 generated profiles passed `validateProfile()`** -- 0 invalid, 0
errors, confirmed in this run's own `aggregate.json` (`peopleInvalid: 0`).

Six real generator bugs were found and fixed before the real run (not MOB
engine defects; this tool's own bugs against a stricter-than-assumed real
contract, caught by running small and reading the actual refusal messages,
per this project's own rule 4):

1. `practiceDo` create actions refuse `src:'user_confirmed'` by design (that
   value is for a two-step generated-then-confirmed flow only); a person's
   own creation is `src:'known'`.
2. `goal.desired_outcome` must be an object (`{description, measurable,
   ...}`), not a string.
3. `behavior.frequency` is a `{value, unit}` object, not a string.
4. `protocol.objective_id` must be a **behavior objective** id, not the goal
   id.
5. `ritual.cadence` is `{type: 'daily'}` and `ritual.days` is a list of
   `'mon'..'sun'` strings, not integers.
6. `event_move` to `'missed'` is correctly refused until the day after the
   scheduled date ends ("not missed yet," the engine's own message); fixed
   by asking for that move two simulated days later, and skipping
   `protocol_accept` entirely for a `known`-sourced protocol, which the
   engine creates already-accepted (calling `protocol_accept` on it is
   correctly refused, not a bug to route around).

---

## 3. Real performance, and the real scale run

Calibration (measured directly, not estimated): 7 profiles x 120 days took
7.7s single-process, about **1.1s per person per 120 days**. Generating all
1,000 profiles (no simulation yet) took 12.6s. Scaling that up, full single-
threaded 1,000x120 would be roughly 18-19 minutes; sharded across this
machine's 4 CPUs (confirmed: `os.cpus().length === 4`), each of 4 worker
processes ran 250 people independently (own `require('./engine.js')`, own
module state, no cross-contamination).

**The real run completed all 1,000 people x 120 days (120,000 day-advances)
in 296 seconds (4 minutes 56 seconds) wall-clock**, 4-way sharded, exit code
0 on every shard. This is the actual measured time of this run, not the
~25-minute estimate carried in the task description.

---

## 4. The real gaps found, ranked by how many of the 1,000 people hit them

Only two distinct gap types were actually hit across all 120,000 day-
advances. Nothing else logged: **zero engine errors, zero thrown exceptions,
zero refused statements, zero refused practice-door calls** across the
entire run (see section 6).

| Rank | Gap | People hit (of 1,000) | First day hit | Real cause |
|---|---|---|---|---|
| 1 | A named **complex** was reached whose only content is a 5-field canon shell | **423 (42.3%)** | Day 0, for every one of the 423 | `compute()` (`atuned_src/engine/compute.js`) names saboteur-pairs into a complex once their combined weight crosses its real threshold; `vendor/reboot-os/canon.json registers.complexes` has nothing beyond `[name, glyph, saboteurs, code, one sentence]` for any of its 23 rows, confirmed directly, so whatever is reached has no deeper content to show |
| 2 | A named **hyper-complex** was reached, same shell shape | **69 (6.9%)** | Day 0, for every one of the 69 | Same mechanism one rung up (`r.hys`); `registers.hyper_complexes`'s 9 rows are the identical 5-field shape |
| -- | A **super-complex** was reached | **0 (0%)** | never | Needs two hyper-complexes averaging weight >=5.6 (`SUP_W`), or one well past it; this cohort's 1-2-axis severity bias never produced that much simultaneous weight across two different families in 1,000 draws |
| -- | **Any TRACE_CHAIN edge above super_complex** (to a mask, an archetype/domain, or a Character node) | **0 (0%), structurally, for all 1,000** | n/a | Not data-dependent: `trace.js`'s `TRACE_CHAIN` array has exactly 4 entries. No input, however extreme, can produce a 5th-rung edge; this is a ceiling in the code, confirmed by reading it, not something this run's severity happened to miss |

**Per-ICP breakdown of who hits the complex/hyper-complex content gap**
(real, measured, from this run's own per-ICP rows):

| ICP | n | % reaching a named complex | % reaching a hyper-complex |
|---|---|---|---|
| James Worthington | 143 | 70.6% | 18.2% |
| Angela Tomás | 143 | 67.1% | 11.9% |
| Marcus Webb | 143 | 60.1% | 9.1% |
| The 1000 | 142 | 45.1% | 6.3% |
| Diane | 143 | 32.9% | 2.8% |
| Sofia Vasquez | 143 | 10.5% | 0% |
| Derek Han | 143 | 9.8% | 0% |

This spread is a direct, expected consequence of this generator's own axis-
severity choices per ICP (James: Fear+Shock; Angela: Disgust+Sad; Marcus:
Apathy+Disgust -- see `icps.js`), not an independent discovery about which
real customers are more distressed. It is reported here as what this
specific synthetic cohort hit, not as a claim about the real population.

**An honest limitation of this run, stated plainly rather than hidden:**
every hit above happened on day 0, for every single person who hit it. The
reason is real and worth stating: this run exercises the daily/practice
doors the task named (`dlyDayOpen`, `dlyCompose`, `practiceDo`, journaling,
aim-setting), and none of those doors move `S.charge` (the 9 child-fetter
addresses `compute()` reads to decide whether a complex has formed). Only an
explicit **release** action does that, through `relWrite`/`releaseWork`
(`compute.js`), which was not in the task's named door list and was not
built into this harness. So whether a synthetic person's 120-day *journey*
crosses this threshold is, in this run, decided entirely at profile-
generation time, not something that emerges gradually across the 120 days.
**The 120-day loop genuinely stress-tested the daily-door machinery (see
section 6) over real volume; it did not, as built, test whether sustained
practice moves a person's charge down over 120 days**, because that would
require simulating the release button itself, a real but separate exercise.

**Zero drawer dead-ends.** `dlyWhy` (the "why did you say this" door) was
called on a frozen statement every 10th day for every person who had one --
12,044 real calls across the run -- and never once came back refused. No
isolated-node dead end was found in the trace-graph drawer itself, for this
cohort, at this scale.

**One small, benign, non-gap observation**: 65 of 120,000 day-advances
(0.054%) came back `silent` (0 or 1 occurrence for a handful of people,
never more than 2 for any one person) instead of `frozen`. This is the
engine's own correct, intentional "nothing new to say" behavior
(`dlyComposeIn`'s `state:'thin'`/`'unread'` paths), not an error and not
counted as a gap above.

---

## 5. Two percent-complete numbers, methods stated plainly

### (a) A simulation-informed read against Lance's own Current%/Target% rubric

**Stated plainly: this simulation cannot independently reproduce
07_PREPRO_ROADMAP's Current%/Target% numbers, and no number below claims to.**
That rubric blends visual design, content lock, badge/mechanic completeness
and UX fine-tuning (07_PREPRO_ROADMAP's own definition of "pre-pro"); a
backend day-advance simulation observes none of the visual/UX half of that,
and the roadmap's own text names its top blockers as exactly that half
("Spiral invisible on white," "no win state after release," "no next node
surfacing") -- not a backend defect.

What this run **does** show, as a real, independently measured cross-check:
across all 7 ICPs, the backend's own day-advance reliability is **100%**,
with no ICP doing worse than any other. If the backend engine does not
discriminate between ICPs, and Lance's own roadmap already names UI-layer
causes for the Current% gaps between ICPs, this run's measurement is
consistent with that: nothing in the backend is currently the differentiator.
That is a real finding, not an estimate.

A constructed proxy was also computed (40% final completeness-of-instrument
coverage + 30% final `accuracy()` confidence fit + 30% day-advance
reliability, all real, measured per-ICP means) and is reported in
`aggregate.json` as `simEstimatePct`, but **it is reported here as a weak,
not-fit-for-use proxy, and that weakness is itself the honest finding**:
every one of the 7 ICPs lands within 85.5-87.7 on this proxy, a 2.2-point
spread, while their real Current% spans 44-76, a 32-point spread. The two
independent, non-circular signals this run measured (`accuracy().pct` and
`accCover().pct`) do not discriminate between these 7 ICPs the way Lance's
own rubric does -- `accCover` saturates at 100% for every ICP once intake
and ten story entries are in (the ceiling this harness's own 120-day journal
reaches for everyone), and `accuracy().pct` varies only in a narrow band
(51.6-58.9% mean per ICP). **This is reported as a real, if negative,
finding about what these two engine-native reads can and cannot tell you
about ICP readiness, not patched into a better-looking number.**

| ICP | Roadmap Current% | Roadmap Target% | Mean final `accuracy()` | Mean final `accCover()` | Day-advance reliability |
|---|---|---|---|---|---|
| James Worthington | 44 | 80+ | 55.1% | 100% | 100% |
| Angela Tomás | 48 | 80+ | 56.3% | 100% | 100% |
| Marcus Webb | 55 | 80+ | 54.2% | 100% | 100% |
| The 1000 | 60 | 80+ | 51.6% | 100% | 100% |
| Derek Han | 62 | 80+ | 53.8% | 100% | 100% |
| Diane | 72 | 85+ | 58.9% | 100% | 100% |
| Sofia Vasquez | 76 | 85+ | 55.8% | 100% | 100% |

### (b) The simulation-native coverage number

**100.0% of the 120,000 real day-advances this run executed (1,000 people x
120 real simulated days) completed through the real `dlyDayOpen` door with
no engine error and no thrown exception** (`okDayAdvances: 120000` of
`totalDayAdvances: 120000`, `aggregate.json`). This is a clean, computed-
only-by-counting technical reliability number: the real build's daily/
practice machinery, run at this volume and this duration, did not break once.

Separately, and not blended into that number: **100% of the canon complex/
hyper-complex content actually reached by this cohort (492 of 1,000 people,
42.3% + 6.9%) was shell-only** -- this is not a percentage the simulation
needed volume to discover (every row in `canon.json` is a shell, confirmed
by direct read, section 1); what the simulation adds is the real, measured
answer to *how often a synthetic journey actually reaches that shell at
all*: 42.3% within 120 days for a named complex, 6.9% for a hyper-complex,
0% for a super-complex, for this specific synthetic cohort and severity
model.

---

## 6. What this run is, and is not, confident about

**Confident, directly measured:**
- 1,000/1,000 generated profiles pass `validateProfile()`.
- 120,000/120,000 day-advances completed with zero engine errors or
  exceptions, across `dlyDayOpen`, `dlyCompose`/`dlyComposeIn`, `dlyGround`/
  `dlyGroundIn` (internal to compose), `dlyValidate` (internal to seal),
  `dlyAimSet`, `dlyAimAnswer`, `dlyRespond`, `dlyWhy`, `dlySize`'s own
  boundary, and the full `practiceDo` lifecycle (goal, behavior, protocol,
  ritual, event schedule/move, evidence).
- 42.3% of this cohort reaches a named complex, 6.9% a hyper-complex, 0% a
  super-complex, within the real engine's own thresholds, at this severity
  model.
- The complex/hyper-complex/super-complex canon-shell content gap and the
  trace-chain ceiling above super_complex are both real, both confirmed by
  direct code and data read, independent of this run.

**Not claimed, and said so rather than guessed:**
- Whether a *real* customer population's severity distribution matches this
  generator's own axis-bias model (it is this generator's own explicit,
  stated choice, not a measurement of real users).
- Whether sustained practice over 120 real days would lower a person's
  charge and move them out of the complex-content-gap zone (this run did
  not simulate the release door; see section 4).
- A reproduction of Lance's own Current%/Target% rubric (section 5a is
  explicit that this cannot be done from a backend simulation alone, and
  reports the attempted proxy's real weakness rather than its number alone).

---

## Files

- `tools/sim/icp-120day/icps.js` -- the 7 ICPs, real fields plus this
  generator's own explicitly-labeled modeling layer.
- `tools/sim/icp-120day/generate.js` -- the profile generator.
- `tools/sim/icp-120day/run-one.js` -- the 120-day-advance harness and gap
  instrumentation for one profile.
- `tools/sim/icp-120day/worker.js` -- one shard (one OS process, one real
  `engine.js`).
- `tools/sim/icp-120day/main.js` -- the orchestrator (spawns one worker per
  CPU, aggregates).
- `tools/sim/icp-120day/aggregate.js` -- reads every shard's JSONL output,
  computes both percent-complete numbers and the ranked gap list.
- `tools/sim/icp-120day/out/aggregate.json` -- this run's full real output.
- `tools/sim/icp-120day/out/shard-*-profiles.jsonl`,
  `tools/sim/icp-120day/out/shard-*-gaps.jsonl` -- the 1,000 per-person rows
  and every logged gap, raw.

Rerun with: `node tools/sim/icp-120day/main.js 1000 120 4 20261030` from the
repo root (seed `20261030` reproduces this exact run; the RNG is seeded and
deterministic).
