# Pass 1, game director: area 2, the 90-day engine

Ngozi Achebe-Lindgren. 2 October 2026. Audited against the repo at the working tree, not against memory. Numbers marked "model" come from `tools/loopsim.js` as quoted in `DESIGN-gamification.md` and `RESEARCH-90day.md`. They are benchmarks from a simulation, not promises.

GRADE: 50/100 as proposed. Roughly 75 if rebuilt as below: a derived read plus one suggestion, with no gate on access.

| Criterion | Score | Evidence |
|---|---|---|
| Fits the loop (a circle, not a list) | 5 | The ten stages are a line. But read in order they go discover, play, flow, discover, flow, play, flow, embody, embody, so each stage is a different pass round the ring, not a different loop. Needs saying that way. |
| Honours the hard line | 4 | A stage that holds features back until a behaviour is shown is a resource drip that gates a session. Days framed as "Day 23" is a calendar timer. `ATUNED-MVP-architecture-v2.md` line 201 puts a "next-tier decision" on days 85 to 90: a sale on a clock. Fixable, not as written. |
| Progression is depth, not a number | 7 | The behaviour gates are understanding gates: opened, rerun, recognised, practised, changed, transferred. Good bones, close to the Pattern machine in `ATUNED-becoming-system-TDD.md` section 31. |
| Derivable from what exists | 4 | Three of the eight gates can be read off the record today. See the table below. |
| Session shape | 5 | Nothing says what a 60 second visit or a 20 minute visit gets from the machine. |
| Pacing and readiness (the safety system) | 4 | `careState` is designed in `DESIGN-progression.md` 4.2 and does not exist in `engine/` or `ui/`. A behaviour experiment suggested at acute is the failure. |
| Entitlement coherence | 5 | Points TDD sections 19 and 20 let achievements unlock Saboteur and Complex views. The 1 October ruling and `plan.js` SIGHT make tier the key to that door. Two keys, one door. |
| Testable and watchable | 6 | A pure read of the record is the easiest thing in this repo to test, and `loopsim.js` can price it. Telemetry cannot say why someone stalls, so each stage drop needs watched people. |

## Area 2, by area

### What exists today (`atuned_src/engine/ladder.js` and neighbours)

- Derived, pure, `now` passed in: `streakRead` (halves, one grace day, lines 46 to 75), `ledgerRead` (minutes, ritual done, ground, clear, carry, lines 84 to 107), `intentionRead`, `ladderRead` (16 marks, one next), `seriesRead`. These are reads of the record. None is a state.
- Dated facts: `meter.firsts` (`schema.js` 1595), `meter.giftAt`, stamped story entries, rituals and snapshots.
- Daily summary (`engine/daily.js`): rules and templates over the record. Each sentence carries a provenance rank. It already has `attention` and `try` blocks and a priority table (`DLY_PRI`). That is the seat a next action belongs in. The page itself is not built.
- Practice object (`engine/practice.js`): outcome and evidence types, miss path (`practiceMissRead`, "a miss is not read as a failure of motivation"), and `practiceStage`, which is "read off what is linked, never stored". That precedent is the right one.
- Not there: `turnRead`, `careState`, `journeyRead`, any stage field. Grep finds no journey state in `engine/`.

### Where the proposed gates meet the record

| Gate | Readable today? | Why |
|---|---|---|
| FIRST_RELEASE_COMPLETE | Yes | `meter.firsts` carries the dated first address. |
| SECOND_RELEASE_COMPLETE | No | `meter.unique` is a set of keys, not runs. Count is also wrong: it counts lines, not addresses (`DESIGN-ladder.md` defect 2). |
| PATTERN_RERUN | No | A rerun never reaches `meterRun`, by design, so it leaves no stamp. |
| PRACTICE_COMPLETED | Yes | `p.rituals[].done` with `t`. |
| EVIDENCE_RECORDED | No in practice | The engine holds `P.evidence`. Nothing under `ui/` calls `practiceDo`, so no surface writes it. |
| BEHAVIOR_OBSERVED | No | Same writer is missing. And it is self report: nobody observes. Name it "reported". |
| CONTEXT_TRANSFER | No | No field. `AUDIT-source-tdd-v3.md` gap D5 says the same. |
| INTEGRATION | Partly | An axis held at the pole across readings is derivable from `history` once snapshots carry the nine axes (`DESIGN-ladder.md` 1.3). |

### What it adds that is new

- The idea that behaviour, not days, is the gate. Right, and consistent with the ladder's refusal to count a streak as the only ruler.
- Verification as a chain per pattern. Real, and it belongs on a per pattern state machine, not a per person one.

### Where it is wrong or conflicts

1. **Gate one is unreachable for most people, and it is measured.** `RESEARCH-90day.md` rows 4, 6 and 10: 8 of 9 first entries read as nothing, no first entry crosses the line so the release refuses for all nine personas, and the first address over the line takes 5 to 15 turns of their own writing. A "Day 2 first release" gate strands most arrivals at stage two on day two. The model already loses 40 percent of the thousand by day 2.
2. **Release gated stages shut half the roster.** Release candidates are empty for 7 of the 14 roster people, at the lowest and highest CQ (`DESIGN-ladder.md` 1.5).
3. **A gate on a metered act is a drip.** After the gift, new ground is ten a week and the release refuses between runs (20 to 56 times a quarter for five of six daily users, `RESEARCH-90day.md` row 11). Gate rule: **a gate may rest only on a free act** (an entry, a rerun, a ritual, a reading), never on spent supply.
4. **Stage on a person is a grade.** A stored `current_stage` is a label about a person, which `careState` was ruled never to be ("Nothing in the schema says somebody was in crisis in April"). Show a stage and "stage 4 of 10" is a count against a total, refused by house rule.
5. **Two incompatible day tables exist.** The proposal has ten stages. `ATUNED-MVP-architecture-v2.md` section 7 has thirteen in seven day blocks. Neither is ruled. I take neither as a calendar.
6. **`current_friction` and `last_meaningful_change` name gaps.** `DESIGN-progression.md` 4.4: the product never mentions the absence. Keep as counted facts internally, never as a sentence.

## Questions you asked

**Is a behaviour gated stage machine good for stickiness?** As a gate on access, no. The person stuck feels graded and the person ahead is bored: both risks are real here, and the second is worse, because this product's best users (the experienced, the typed, the ones who arrive with an intake) are the ones a staircase holds back. As an ordering of one suggestion, yes. Stage reads the record, the record decides, and the person can always walk through any of the four doors (`STARTD` in `ui/component.js` 1139). Tier stays the only key to ground. Behaviour opens nothing; it only chooses what is offered first.

Price, labelled: gates as proposed have no term in the model, so I estimate within plus or minus 1 point at day 30 of 1000 weighted people (my judgement). The suggestion vehicle carries two priced mechanics: "the first session ends by showing what landed", 2.8 points, and leading a stranger to the if then plan, up to 5.6 (model, not additive). Cost of the refusal I keep: a loss framed arm is worth 2.9 points and I decline it.

**How Summary and next best action read from it.** One function, `journeyRead(p, now, care)`, feeding both. Do not make Summary read from a stored state: two derived layers can disagree, which is the very fault the orchestrator area names. Summary sentences stay `known` or `inferred`. The suggestion is `proposed`, the lowest rank, and says so (`DLY_RANK`). It lands in the existing `try` and `attention` blocks, and on the Field as one line above the four doors. The daily page is frozen once a day, so the Field carries the live suggestion and the page carries what was shown.

**Should days appear in the UI?** No position in days. No "Day 23", no "of 90", no countdown, no stage name, no review timed to day 85. Days are allowed as dated facts ("opened 14 September"), as windows the person picks (week, month, quarter already exist in `SPANS`), and as the unit inside the engine. The Ninety days mark stays, counted on days practised, not an unbroken row (`DESIGN-ladder.md` 1.4, defect 1).

## Minimal JourneyState (MVP)

Derived, not stored, host free, `now` passed in:

    journeyRead(p, now, care) ->
      touched:  {discover, play, flow, embody}  newest stamp per quarter, or null
      turns:    closed circles (turnRead, DESIGN-ladder 1.3)
      ground:   {opened (distinct addresses), runs, reruns}
      standing: {clear, carry}                  from ledgerRead
      evidence: {reported, observed}            counts, zero until a surface writes
      care:     ordinary | high load | acute
      next:     {act, quarter, floor, because[], src:'proposed'}

`edge` is the quarter touched least recently, the open side of the circle. The rule table keys on the edge, so there is no staircase. Order: acute, then one address and one line. No reading, then the four doors. Reading but no run, then "write a second line" (Q2 of the 90 day file). Run but no ritual done, then the ritual or its 60 second floor. Done but no new reading, then read again. Turn closed, then rerun an opened address (free). After several turns, the compass or the avatar.

One stored addition only: an append only run log, `p.meter.runs = [{t, addrs, mode}]`, capped like `supply.log`. It makes second release and rerun readable. Additive, so it is **flagged for the owner as a schema change**.

Cut for later: `current_stage`, `current_objective` (same as `next`), `patterns_released` (a binary the release TDD rejects, use `standing`), `behavior_changes`, `context_transfers`, `verification_state`, `last_meaningful_change`, `current_friction`.

## Risks

- **Grading by the back door.** Any surface that prints a stage, a rank or a "behind". Gate: a test that the string never renders.
- **Two keys on one door.** Points TDD section 19 unlocks versus tier SIGHT. Behaviour reveals what was read, never gates it.
- **Wrong day table baked into code.** Keep days inside windows only.
- **Self report sold as observation.** Call it "reported" until a second source exists.
- **Acute person offered an experiment.** Needs `careState` first.
- **A number that cannot say why.** Pair every stall with five watched sessions per ICP (person we build for). Instrument locally only; the engine has no network.

## Recommended order

1. Fix `ground` to count distinct addresses, and `week`, `month`, `season` to count days practised (S, no schema change).
2. `turnRead` and `careState`, pure reads (S to M).
3. Run log in `p.meter.runs` with its validation (S, owner flag).
4. `journeyRead` with the rule table and tests, priced in `loopsim.js` (M).
5. One line on the Field and the `try` block in Summary (M).
6. Per pattern state machine, the becoming TDD section 31, and a surface that writes evidence (L, later).
7. Context transfer as a tag on evidence (L, after 6).
