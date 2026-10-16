# Percent inventory, 16 October 2026

MOB, branch `claude/percent-framework`, built from main at `4c6185d`, and merged with main at `f403588` the same morning. Line numbers are at `4c6185d` except where a row says `f403588`: main changed `ui/drills.js` and `ui/summary.js` in between, and only `drills.js` gained a printed number (the CQ span, rows marked). Phase 1 of the owner's 16 October ruling. Nothing here changes a screen; it is the list phase 2 works from.

## How this was made

- **Read off the code.** Every line in `atuned_src/ui/*.js`, `funnel/quiz.html`, `funnel/about.html`, `funnel/index.html` and `funnel/ring.js` that formats a number (`toFixed`, `Math.round`, `Math.floor`, `Math.ceil`, a percent sign, "per cent", "percent"), with comments stripped first: 816 lines. 294 of them build geometry, colour, timing or cache keys and print nothing. The rest were read one by one.
- **Read off the screen.** A Playwright probe walked every tab TABDEF and TABEXTRA name, on a blank profile and on all sixteen roster people at 1600, and on three at 390, plus the release setup, and kept every visible text node, title, tooltip, aria label and canvas `fillText` that carries a digit: 1391 distinct templates. Where a surface was reached, the sample is what it printed on 16 October. A surface the walk does not open (a drill behind a press, the release's finished card, the quiz result) has its template with a figure of the size the roster produces.
- **Counts are grouped.** A count (addresses, days, sentences, laws) keeps its form under the ruling, so count sites are listed by family rather than one row per pluralisation.

## The split

| Class | Rows | What happens in phase 2 |
|---|---|---|
| PERCENT | 268 | Printed through `fmtPct(kind, value)`, and the drawn fill moves onto `pct(kind, value)` where it does not already agree |
| COUNT | 35 | Untouched. A count never gets a percent |
| OTHER | 21 | Untouched, with the reason in the row: a factor, an input the person chose, an id, a unit, time, geometry, or a figure that is not a measure at all |
| Total | 324 | |

Kinds and ranges are read from `PCT_KIND` in `atuned_src/engine/pct.js`; the citation for each range is in `PERCENT-FRAMEWORK-2026-10-16.md`.

## Defects found on the way, all of them the rule being broken today

- `ui/analytics.js:68`, "Explorer, 10.0 (archetype bubble)": v is max(0.4, aff*10), analytics.js:227, so a weak archetype prints the floor 0.4 and not its value
- `ui/analytics.js:68`, "Fear, 1.5 (axis bubble)": v is max(0.3, charge), analytics.js:241, so an axis holding nothing prints 0.3
- `ui/analytics.js:68`, "Crown, 0.3 (seat bubble)": v is max(0.3, s.hot), analytics.js:244, a COUNT of held addresses printed as a decimal, and 0.3 when none are held
- `ui/analytics.js:68`, "Restoration, 9.0 / Knowledge, 2.0 (domain bubble)": v is the constant 9 for a selected domain and 2 for the rest, analytics.js:222 to 224, a sizing number printed as a reading; phase 2 prints no figure
- `ui/fieldbar.js:188`, "Addresses 4 (segment depth, at a weight of 4)": what is drawn and what is printed disagree: fill SQm*10 (44) and print round(SQm) (4) disagree since PR 83
- `ui/release.js:3014`, "Pineal 42 Lowered (log ring, raw w0)": what is drawn and what is printed disagree: w0 is already 0 to 100 (release.js:1275) and the ring fills w0*10, so every row above 10 draws a full ring
- `ui/summary.js:442`, `ui/ui.js:76` and `ui/analytics.js:227` print one archetype three ways: a share of all twelve (17%), a share of the strongest (100%) and the strongest times ten (10.0).

## ui/ui.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/ui.js:25` | CQ 48 the core (hover) | PERCENT | cq 0 to 100 |  |
| `ui/ui.js:38` | 26% of your story, in 4 sentences | PERCENT | gate 0 to 100 | already a percent; the sentence count is a COUNT |
| `ui/ui.js:39` | everything held weighs ×1.35 | OTHER | factor | the gate multiplier, 0.60 to 1.35; not a fill |
| `ui/ui.js:53` | charge held 4.2 | PERCENT | held 0 to 10 |  |
| `ui/ui.js:54` | trust installed 3.0 | PERCENT | installed 0 to 10 | n.rep at the address |
| `ui/ui.js:55` | left after that 1.2 | PERCENT | weight 0 to 10 |  |
| `ui/ui.js:56` | takes 1.20× the charge | OTHER | factor | susceptibility, 0.448 to 1.3 (compute.js:19); not a fill |
| `ui/ui.js:67` | weighed 2.0 at this address | PERCENT | atom 0 to 10 |  |
| `ui/ui.js:74` | reads 6.0 (law hover) | PERCENT | law 0 to 10 |  |
| `ui/ui.js:76` | 100% as strong as your strongest | PERCENT | affinity 0 to 1 | already a percent |
| `ui/ui.js:79` | weight 0.47 (domain hover) | PERCENT | domain 0 to 1 |  |
| `ui/ui.js:91` | weight 4.9 (chain hover) | PERCENT | chain 0 to 10 |  |
| `ui/ui.js:91` | built on 3 addresses | COUNT | addresses |  |
| `ui/ui.js:93` | Pineal 4.2 (the parts of a pattern) | PERCENT | weight 0 to 10 |  |
| `ui/ui.js:94` | and 2 more | COUNT | addresses |  |
| `ui/ui.js:868` | Fear 9.0 (stack ring, title "Fear held 9.0") | PERCENT | charge 0 to 10 | fill v*10 already agrees |
| `ui/ui.js:871` | Trust 5.0 (stack ring, "installed") | PERCENT | installed 0 to 10 | fill p*10 already agrees |
| `ui/ui.js:879` | Opposite installed 5.0 | PERCENT | installed 0 to 10 |  |
| `ui/ui.js:1044` | Coherence, 48 (rail ring at the foot of the stage) | PERCENT | cq 0 to 100 | fill r.CQ already agrees |
| `ui/ui.js:1106` | Benign 76% | PERCENT | lean 0 to 100 | already a percent; bar width agrees |
| `ui/ui.js:1109` | Malignant 24% | PERCENT | lean 0 to 100 | already a percent |
| `ui/ui.js:1150` | read from 3 cues in your stories | COUNT | cues |  |
| `ui/ui.js:1219` | Vitality, 0.17 | PERCENT | vitality 0 to 1 | fill r.X*100 already agrees: 0.17 becomes 17% |
| `ui/ui.js:1221` | Awareness, 0.30 | PERCENT | awareness 0 to 1 | fill agrees |
| `ui/ui.js:1223` | Will, 0.28 | PERCENT | will 0 to 1 | fill agrees |
| `ui/ui.js:1225` | Radiance, 0.25 | PERCENT | radiance 0 to 1 | fill agrees |
| `ui/ui.js:1227` | Flow, 0.61 | PERCENT | flow 0 to 1 | fill f*100 agrees |
| `ui/ui.js:1379` | Carrying 49 addresses / 52 sitting under the line | COUNT | addresses |  |
| `ui/ui.js:1380` | Filled in 7 addresses | COUNT | addresses |  |
| `ui/ui.js:1381` | Heaviest Solar 3.8 | PERCENT | weight 0 to 10 | darkV, a seat mean |
| `ui/ui.js:1396` | integrity 4.9 | PERCENT | integrity 0 to 10 |  |
| `ui/ui.js:1398` | intention 4.6 | PERCENT | intention 0 to 10 |  |
| `ui/ui.js:1405` | pole 0.80 | PERCENT | pole 0 to 10 |  |
| `ui/ui.js:1407` | overshoot 0.52 | PERCENT | overshoot 0 to 10 |  |
| `ui/ui.js:1408` | 24 addresses overshot | COUNT | addresses |  |
| `ui/ui.js:1410` | distortion 3.6 | PERCENT | distortion 0 to 10 |  |
| `ui/ui.js:1488` | Collapse 4.9 (running badge, title "weight 4.9") | PERCENT | chain 0 to 10 | fill o.w*10 already agrees |

## ui/analytics.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/analytics.js:68` | Child, 0.4 (mask bubble title) | PERCENT | weight 0 to 10 | bubble size is relative to the top bubble, not the fill: phase 2 prints the kind |
| `ui/analytics.js:68` | Explorer, 10.0 (archetype bubble) | PERCENT | affinity 0 to 1 | DEFECT: v is max(0.4, aff*10), analytics.js:227, so a weak archetype prints the floor 0.4 and not its value |
| `ui/analytics.js:68` | Collapse, 4.9 (running bubble) | PERCENT | chain 0 to 10 |  |
| `ui/analytics.js:68` | Fear, 1.5 (axis bubble) | PERCENT | charge 0 to 10 | DEFECT: v is max(0.3, charge), analytics.js:241, so an axis holding nothing prints 0.3 |
| `ui/analytics.js:68` | Crown, 0.3 (seat bubble) | COUNT | held addresses | DEFECT: v is max(0.3, s.hot), analytics.js:244, a COUNT of held addresses printed as a decimal, and 0.3 when none are held |
| `ui/analytics.js:68` | Restoration, 9.0 / Knowledge, 2.0 (domain bubble) | OTHER | not a measure | DEFECT: v is the constant 9 for a selected domain and 2 for the rest, analytics.js:222 to 224, a sizing number printed as a reading; phase 2 prints no figure |
| `ui/analytics.js:162` | 8 addresses are held | COUNT | addresses |  |
| `ui/analytics.js:163` | the shadow across all 112 reads 22 per cent | PERCENT | dq 0 to 100 | "per cent" becomes the sign |
| `ui/analytics.js:181` | CQ up 3 since last session | PERCENT | cq 0 to 100 | rule 3: becomes "CQ moved from 58% to 61%" via pctMove |
| `ui/analytics.js:201` | Identification 82% | PERCENT | accuracy 0 to 100 | already a percent |
| `ui/analytics.js:205` | 21 laws measured, 1 address held | COUNT | laws, addresses |  |
| `ui/analytics.js:275` | Truth 6.0 / Temperance 3.1, shut (law tile title) | PERCENT | law 0 to 10 |  |
| `ui/analytics.js:440` | Fear 6.8 (held badge) | PERCENT | charge 0 to 10 |  |
| `ui/analytics.js:456` | Collapse 4.9 (pattern badge) | PERCENT | chain 0 to 10 |  |
| `ui/analytics.js:545` | Weight 4.9 (pattern drill) | PERCENT | chain 0 to 10 |  |
| `ui/analytics.js:566` | Matched at 80% | PERCENT | match 0 to 100 | already a percent |
| `ui/analytics.js:587` | Held 9.0 (axis drill) | PERCENT | charge 0 to 10 |  |
| `ui/analytics.js:588` | Installed 5.0 (axis drill) | PERCENT | installed 0 to 10 |  |
| `ui/analytics.js:609` | passes 75% of what reaches it | PERCENT | pass 0 to 1 | already a percent |
| `ui/analytics.js:609` | 3 addresses are held here | COUNT | addresses |  |
| `ui/analytics.js:616` | Truth 6.0 (seat drill law badge) | PERCENT | law 0 to 10 |  |
| `ui/analytics.js:642` | 61% as strong as your strongest | PERCENT | affinity 0 to 1 | already a percent |
| `ui/analytics.js:655` | Load 0.4 (mask drill) | PERCENT | weight 0 to 10 |  |
| `ui/analytics.js:700` | Coherence 48 (telemetry ring) | PERCENT | cq 0 to 100 |  |
| `ui/analytics.js:703` | Shadow 26% | PERCENT | dq 0 to 100 | already a percent |
| `ui/analytics.js:706` | Pull 12% | PERCENT | pull 0 to 1 | already a percent |
| `ui/analytics.js:709` | Expression 43 | PERCENT | expression 0 to 100 |  |
| `ui/analytics.js:712` | Overshoot 0.5 | PERCENT | overshoot 0 to 10 | fill JQ*10 agrees |
| `ui/analytics.js:715` | Pole 0.8 | PERCENT | pole 0 to 10 | fill agrees |
| `ui/analytics.js:736` | Truth 6.0 (law row badge) | PERCENT | law 0 to 10 |  |
| `ui/analytics.js:749` | drags 50% | PERCENT | pull 0 to 1 | already a percent, leverPull per address |
| `ui/analytics.js:753` | CQ 48, pull 12%, expression 43 | PERCENT | cq 0 to 100; pull 0 to 1; expression 0 to 100 |  |
| `ui/analytics.js:755` | With every charge released it would read 50 | PERCENT | expression 0 to 100 | exCeiling |
| `ui/analytics.js:778` | up 0.4 / no change (session card delta) | PERCENT | per row kind | rule 3: the delta goes, the row is said from and to |
| `ui/analytics.js:785` | Coherence 48.2 / Shadow 26.0% (session card) | PERCENT | cq 0 to 100; dq 0 to 100 | NOTE: a row from before 25 September holds the old DQ, a sum with no ceiling (schema.js:1376 allows 0 to 1e4); clamped it would print 100%; phase 2 dashes a row whose model is not CQ_MODEL |
| `ui/analytics.js:786` | Held 8 / Saboteurs 26 / Complexes 11 / Hyper 2 / Character 0 | COUNT | counts |  |
| `ui/analytics.js:787` | Overshoot 0.52 / Installed 0.80 (session card) | PERCENT | overshoot 0 to 10; pole 0 to 10 |  |
| `ui/analytics.js (ana-rung, stk-t)` | 20 / 26 / 11 / 2 (rung and stack counts) | COUNT | counts |  |

## ui/summary.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/summary.js:88` | Coherence, 48 (plate ring) | PERCENT | cq 0 to 100 | golden.js station 4 asserts this plate prints a word on a quiz only record (14 October); see open list |
| `ui/summary.js:101` | Shadow weight, 26 (plate ring) | PERCENT | dq 0 to 100 |  |
| `ui/summary.js:112` | Carried depth, 4.4 | PERCENT | weight 0 to 10 | fill SQm*10 agrees |
| `ui/summary.js:116` | Pole 0.80 | PERCENT | pole 0 to 10 |  |
| `ui/summary.js:118` | Energy 0.30 | PERCENT | energy 0 to 1 | fill e*100 agrees |
| `ui/summary.js:125` | Identification 82% | PERCENT | accuracy 0 to 100 | already a percent |
| `ui/summary.js:315` | at a weight of 9 (heaviest address sentence) | PERCENT | weight 0 to 10 |  |
| `ui/summary.js:322` | Shadow weight is 20 | PERCENT | dq 0 to 100 |  |
| `ui/summary.js:442` | Caregiver, 17% (Primary and secondary) | PERCENT | share 0 to 1 | already a percent; a share of all twelve, not the strongest; see open list |
| `ui/summary.js:457` | Child 0.4 (mask row) | PERCENT | weight 0 to 10 |  |
| `ui/summary.js:474` | Heaviest seats 35% | PERCENT | seatload 0 to 1 | already a percent |
| `ui/summary.js:980` | Fear 9.0 (the nine) | PERCENT | charge 0 to 10 |  |
| `ui/summary.js:1036` | Sacral seat, holding 5.1 | PERCENT | weight 0 to 10 |  |
| `ui/summary.js:1041` | holds back about 3.0 points of your coherence | PERCENT | expression 0 to 100 | rule 5: becomes a before and after of expression; under 1% it says nothing |
| `ui/summary.js:1045` | below the line at 2.5 | PERCENT | weight 0 to 10 |  |
| `ui/summary.js:1056` | holds back about 0.1 points of your coherence | PERCENT | expression 0 to 100 | rule 5: rounds to 0%, so no sentence |
| `ui/summary.js:1248` | at a weight of 9 (heaviest of the nine) | PERCENT | charge 0 to 10 |  |
| `ui/summary.js:1255` | in the centre chest at 9.0 | PERCENT | charge 0 to 10 |  |
| `ui/summary.js:1261` | Five more are carrying something | COUNT | axes |  |
| `ui/summary.js:1265` | Standing against them: Trust at 3.0 | PERCENT | installed 0 to 10 |  |
| `ui/summary.js:1267` | and 2 others installed | COUNT | axes |  |
| `ui/summary.js:1329` | One reading with an integrity on it, at 4.9 | PERCENT | integrity 0 to 10 |  |
| `ui/summary.js:1355` | 4.2 up 4.9 (integrity graph ends) | PERCENT | integrity 0 to 10 | already before and after |
| `ui/summary.js (numerology, design)` | Life path 22, Expression 6, Soul urge 7, karmic debt 14, Design gate 43, profile 6/2, 60.1 | OTHER | ids | numerology numbers, gates and lines are names, not measures |
| `ui/summary.js (sumday)` | In the last 7 days you set 5 rituals and marked 5 done | COUNT | days, rituals |  |
| `ui/summary.js (loop)` | 3 entries, Show all 19 | COUNT | entries |  |
| `ui/summary.js (out row)` | 452 new addresses away | COUNT | addresses |  |

## engine/data/canon.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `engine/data/canon.js:778` | Oscillating, which starts at 41 | PERCENT | cq 0 to 100 | a tier floor on the CQ scale; every TIERDEF toward line and tierRange ("61 to 70") reads as 41%, 61% to 70% |
| `engine/data/canon.js:825` | tierRange: 61 to 70 (the ladder) | PERCENT | cq 0 to 100 | a band of CQ |

## ui/drills.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/drills.js:194` | Matched at 80% | PERCENT | match 0 to 100 | already a percent |
| `ui/drills.js:254` | Truth 6.0 (law drill head) | PERCENT | law 0 to 10 |  |
| `ui/drills.js:281` | answers 3.6 apart, holds when it costs | PERCENT | spread 0 to 10 | becomes "answers 36% of the scale apart"; wording is phase 2 |
| `ui/drills.js:283` | it defaults to 6.0 | PERCENT | law 0 to 10 | a default; it may print because the sentence says it is a default |
| `ui/drills.js:312` | Charge held here 4.2 | PERCENT | held 0 to 10 |  |
| `ui/drills.js:313` | Trust installed 3.0 | PERCENT | installed 0 to 10 |  |
| `ui/drills.js:314` | Left after that 1.2 | PERCENT | weight 0 to 10 |  |
| `ui/drills.js:334` | Collapse 4.9 (chip) | PERCENT | chain 0 to 10 |  |
| `ui/drills.js:381` | put 2.0 here | PERCENT | atom 0 to 10 |  |
| `ui/drills.js:419` | CQ 48, oscillating | PERCENT | cq 0 to 100 |  |
| `ui/drills.js:434 (main f403588)` | The reading swings between 40 and 56 | PERCENT | cq 0 to 100 | moved into coreRangeSay on main; the sentence "not a mark out of a hundred" contradicts a percent and is rewritten in phase 2 |
| `ui/drills.js:430 (main f403588)` | With 7 of 21 laws answered, the finished figure lands between 12 and 79 | PERCENT | cq 0 to 100 | added on main (cqSpan): both ends are CQ; the answered count is a COUNT |
| `ui/drills.js:429 (main f403588)` | 3 of 21 laws are answered | COUNT | laws |  |
| `ui/drills.js:443` | expression 43 | PERCENT | expression 0 to 100 |  |
| `ui/drills.js:444` | with the shadow taking 12 per cent | PERCENT | pull 0 to 1 |  |
| `ui/drills.js:448` | contracting 40% | PERCENT | lean 0 to 100 | already a percent (malig) |
| `ui/drills.js:449` | Radiance 25% | PERCENT | radiance 0 to 1 | already a percent |
| `ui/drills.js:466` | 26% (gate row) | PERCENT | gate 0 to 100 | already a percent |
| `ui/drills.js:467` | ×1.35 (gate row) | OTHER | factor |  |
| `ui/drills.js:481` | 26% of the story ran through awareness, 4 sentences | PERCENT | gate 0 to 100 | sentence count is a COUNT |
| `ui/drills.js:482` | Everything held is multiplied by 1.35 | OTHER | factor |  |
| `ui/drills.js:499` | DQ 26% | PERCENT | dq 0 to 100 | already a percent |
| `ui/drills.js:505` | SQ 4.4 mean | PERCENT | weight 0 to 10 |  |
| `ui/drills.js:508` | Solar at 3.8 | PERCENT | weight 0 to 10 |  |
| `ui/drills.js:511` | Pole 0.80 on average | PERCENT | pole 0 to 10 |  |
| `ui/drills.js:529` | apathy 2.0, shadow weight 26 | PERCENT | charge 0 to 10; dq 0 to 100 |  |
| `ui/drills.js:530` | Intention 4.6, distortion 3.6 | PERCENT | intention 0 to 10; distortion 0 to 10 |  |
| `ui/drills.js:532` | Integrity 4.9, mean depth 4.4 | PERCENT | integrity 0 to 10; weight 0 to 10 |  |
| `ui/drills.js:536` | Energy 30% across three axes | PERCENT | energy 0 to 1 | already a percent |
| `ui/drills.js:541` | Vitality 0.17 ring beside 17% | PERCENT | vitality 0 to 1; awareness 0 to 1; will 0 to 1 | the same figure printed twice in two forms; phase 2 keeps the percent |
| `ui/drills.js:563` | This entry put 2.0 at this address | PERCENT | atom 0 to 10 |  |
| `ui/drills.js:564` | The 3 entries that landed here put 14.2 in all | PERCENT | atomsum 0 to 10 | the one cap; the entry count is a COUNT |
| `ui/drills.js:569` | It is holding 4.2 | PERCENT | weight 0 to 10 |  |
| `ui/drills.js:570` | the opposite is installed at 3.0 | PERCENT | pole 0 to 10 | NOTE: prints n.pole under the word "installed"; n.rep is installed |
| `ui/drills.js:592` | 61% reaches the crown | PERCENT | flow 0 to 1 | already a percent |
| `ui/drills.js:601` | Root 0.75 ring beside 75% (seat pass) | PERCENT | pass 0 to 1 | printed twice, phase 2 keeps the percent |
| `ui/drills.js:616` | Fear 2.0 (balance axis row) | PERCENT | charge 0 to 10 |  |
| `ui/drills.js:640` | Outward mean 2.5 against inward mean 3.1 | PERCENT | charge 0 to 10 | means of charges stay on the charge scale |
| `ui/drills.js:686` | Held 4.0 | PERCENT | charge 0 to 10 |  |
| `ui/drills.js:687` | Trust installed 3.0 | PERCENT | installed 0 to 10 |  |
| `ui/drills.js:739` | 61% (archetype drill) | PERCENT | affinity 0 to 1 | already a percent |
| `ui/drills.js:756` | Load 0.4 (mask drill) | PERCENT | weight 0 to 10 |  |
| `ui/drills.js:880` | is carrying 35% | PERCENT | seatload 0 to 1 | already a percent |
| `ui/drills.js:881` | its integrity reads 4.6 | PERCENT | law 0 to 10 | bandIg is the mean of the seat's laws |
| `ui/drills.js:1020` | shape 40, control 60 | PERCENT | shape 0 to 1; control 0 to 1 | printed bare out of a hundred today |
| `ui/drills.js:1190` | gap ring 65 (avatar pair) | PERCENT | axis 0 to 100 | mirrorAt |
| `ui/drills.js:1192` | heart, 4.2 (avatar pair row) | PERCENT | weight 0 to 10 | seat mean sq |
| `ui/drills.js:1226` | carrying 4.2 ... you read 65 | PERCENT | weight 0 to 10; axis 0 to 100 |  |
| `ui/drills.js:1404` | CQ 48, oscillating (compass drill) | PERCENT | cq 0 to 100 |  |
| `ui/drills.js:1500` | A 7 at CQ 48 | PERCENT | cq 0 to 100 | the 7 is a life path, an id |

## ui/component.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/component.js:240` | cr(): prints round(p)+% when no raw is given | PERCENT | component | the ring's own default is already the rule; phase 2 makes raw come from fmtPct |
| `ui/component.js:331` | the dock tween counts n0 to n1 at m.dp places | PERCENT | component | the tween prints whatever form it is handed; it must count whole percents |
| `ui/component.js:782` | rbPct: 26% | PERCENT | component | a local percent; replaced by fmtPct |
| `ui/component.js:788` | rbBare: 48 (CQ and DQ on the pair) | PERCENT | cq 0 to 100; dq 0 to 100 | railmenu RM2 asserts this is bare; flips |
| `ui/component.js:816` | CQ 48 per cent / Masculine 24 per cent (pair aria) | PERCENT | cq 0 to 100; dq 0 to 100; lean 0 to 100 | spoken form; "per cent" stays the spoken word for the sign |
| `ui/component.js:922` | crNode: Overanalysis 8.7, "8.7 left after the opposite" | PERCENT | weight 0 to 10 | every address ring in the product; fill sq*10 agrees |
| `ui/component.js:983` | crBadge(): default round(p)+% | PERCENT | component |  |
| `ui/component.js:1009` | crNodeBadge: 8.7 left after the opposite | PERCENT | weight 0 to 10 |  |
| `ui/component.js:1013` | crPat: Collapse, weight 4.9 | PERCENT | chain 0 to 10 |  |

## ui/fieldbar.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/fieldbar.js:188` | Addresses 4 (segment depth, at a weight of 4) | PERCENT | weight 0 to 10 | DEFECT under rule 1: fill SQm*10 (44) and print round(SQm) (4) disagree since PR 83 |
| `ui/fieldbar.js:191` | Assemblage points 5 (heaviest, at a weight of 5) | PERCENT | weight 0 to 10 | same disagreement, darkV |
| `ui/fieldbar.js:194` | Laws 48 | PERCENT | cq 0 to 100 | design.js PQ asserts bare; flips |
| `ui/fieldbar.js:198` | Gates 30% | PERCENT | gate 0 to 100 | already a percent |
| `ui/fieldbar.js:201` | Decoherence 26 | PERCENT | dq 0 to 100 | design.js PQ asserts bare; flips |
| `ui/fieldbar.js:204` | Stories 35% | PERCENT | portion 0 to 1 | already a percent |
| `ui/fieldbar.js:210` | Saboteurs 26, Complexes 11, Hyper 2, Character 0 | COUNT | counts | the ring beside it is a portion and the number a count; both stay as they are |
| `ui/fieldbar.js:215` | Archetypes 17% | PERCENT | share 0 to 1 | already a percent |
| `ui/fieldbar.js:220` | Domains 35% | PERCENT | domain 0 to 1 | already a percent, the mean of DOMAIN |
| `ui/fieldbar.js:533` | Reframe 1.0× | OTHER | zoom | a view scale |

## ui/map.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/map.js:228` | 80% match exact | PERCENT | match 0 to 100 | already a percent |
| `ui/map.js:624` | Crown, 0.3 (seat title) | PERCENT | weight 0 to 10 |  |
| `ui/map.js:884` | Overanalysis · 8.7 (address title) | PERCENT | weight 0 to 10 |  |
| `ui/map.js:943` | Collapse · 4.9 (bead title, m.v*10) | PERCENT | chain 0 to 10 |  |
| `ui/map.js:2157` | Complex at a weight of 5, built on 3 addresses | PERCENT | chain 0 to 10 | address count is a COUNT |
| `ui/map.js:2206` | Crown, blocked. 21 addresses carrying, 5 percent of the flow getting through | PERCENT | pass 0 to 1 | already a percent; the address count is a COUNT |
| `ui/map.js:2701` | Pineal · Fear · cranial · 4.2 (cell aria) | PERCENT | weight 0 to 10 |  |
| `ui/map.js:2759` | Loading, at a weight of 5 | PERCENT | chain 0 to 10 |  |
| `ui/map.js:2927` | painted 7 / heaviest 4.2 | PERCENT | weight 0 to 10 | the painted level is the person's own input, 1 to 10: see OTHER rows and the open list |
| `ui/map.js:2927` | painted 7 | OTHER | input | the brush level the person chose |
| `ui/map.js:2934` | with 4.2 of charge held | PERCENT | weight 0 to 10 |  |
| `ui/map.js:2956` | Put 2.0 here, most on Pineal | PERCENT | atomsum 0 to 10 | one entry summed across its addresses at this region |
| `ui/map.js:2978` | Collapse 4.9 (running through here) | PERCENT | chain 0 to 10 |  |
| `ui/map.js:3374` | Masks 1 (the heaviest mask, at a weight of 1) | PERCENT | weight 0 to 10 | fill mr.w*10 and print round(mr.w) disagree, as fieldbar |
| `ui/map.js:3381` | Flow 35% | PERCENT | flow 0 to 1 | already a percent |

## ui/mapshelf.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/mapshelf.js:40` | Collapse 4.9 (shelf row, m.v*10) | PERCENT | chain 0 to 10 |  |
| `ui/mapshelf.js:52` | Pineal 4.2 (shelf row) | PERCENT | weight 0 to 10 |  |
| `ui/mapshelf.js:88` | Root 75% | PERCENT | pass 0 to 1 | already a percent |
| `ui/mapshelf.js:162` | passes 75% | PERCENT | pass 0 to 1 | already a percent |
| `ui/mapshelf.js:164` | mean SQ 4.2 | PERCENT | weight 0 to 10 |  |
| `ui/mapshelf.js:165` | integrity 4.6 | PERCENT | law 0 to 10 | bandIg |
| `ui/mapshelf.js:168` | Truth 6.0 (seat laws) | PERCENT | law 0 to 10 |  |
| `ui/mapshelf.js:175` | Pineal 4.2 | PERCENT | weight 0 to 10 |  |
| `ui/mapshelf.js:193` | Pineal 4.2 | PERCENT | weight 0 to 10 |  |
| `ui/mapshelf.js (pm-sub)` | 8 held | COUNT | addresses |  |

## ui/cone.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/cone.js:141` | 1.0× (reframe) | OTHER | zoom |  |
| `ui/cone.js:2485` | Truth 6.0 (compass law) | PERCENT | law 0 to 10 |  |
| `ui/cone.js:2652` | you read 48 (compass prose) | PERCENT | cq 0 to 100 |  |
| `ui/cone.js:2694` | Your integrity is 4.9 | PERCENT | integrity 0 to 10 |  |
| `ui/cone.js:2741` | One reading in this span, at 48 | PERCENT | cq 0 to 100 | seriesRead |
| `ui/cone.js:2762` | 41 up 48 (graph ends) | PERCENT | cq 0 to 100 | already before and after |
| `ui/cone.js:2909` | Light: Jesus, opposite Lucifer. 65 / You sit at 91 on this axis | PERCENT | axis 0 to 100 | fill already agrees, printed bare |
| `ui/cone.js:2997` | Gravity well 4 (heaviest, at a weight of 4) | PERCENT | weight 0 to 10 | fill darkV*10 and print round(darkV) disagree |

## ui/knowledge.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/knowledge.js:212` | Crown 26% (seat tile) | PERCENT | portion 0 to 1 | already a percent |
| `ui/knowledge.js:420` | Sage · 61% (row title) | PERCENT | per deck | kbPct (v*10) and kbPct100 (v*100) at knowledge.js:79 to 80 are a local version of this formula and are replaced |
| `ui/knowledge.js:423` | 95% (row value) | PERCENT | per deck | already a percent |
| `ui/knowledge.js:482` | The percent is <what the deck measures> | PERCENT | per deck | copy |
| `ui/knowledge.js:713` | Doubt Of God, weight 2.9 / Opposite, Equanimity, weight 8.0 (aria) | PERCENT | held 0 to 10; installed 0 to 10 |  |
| `ui/knowledge.js:724` | Doubt Of God 2.9 (pole row) | PERCENT | held 0 to 10 |  |
| `ui/knowledge.js:726` | Equanimity 8.0 (pole row) | PERCENT | installed 0 to 10 |  |
| `ui/knowledge.js:732` | 91% / 9% (the lean between the two) | PERCENT | portion 0 to 1 | already a percent; the two add to a hundred |
| `ui/knowledge.js:792` | Pineal 2.9 (address pole row) | PERCENT | held 0 to 10 |  |
| `ui/knowledge.js:793` | 8.0 (installed at that address) | PERCENT | installed 0 to 10 |  |
| `ui/knowledge.js:907` | card 4.2 (letting go deck) | PERCENT | weight 0 to 10 |  |
| `ui/knowledge.js:887` | card rank 1 to 13 | OTHER | id | a playing card rank |
| `ui/knowledge.js (kb-t)` | By kind 76 / 7 / 25 | COUNT | counts |  |

## ui/character.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/character.js:288` | Charge 7.0 (address hover) | PERCENT | weight 0 to 10 | achT is sq over ten |
| `ui/character.js:293` | Heart seat, 62 percent shadow | PERCENT | closed 0 to 1 | already a percent |
| `ui/character.js:351` | Leaking, 24 percent | PERCENT | leak 0 to 1 | already a percent |
| `ui/character.js:355` | Charge 8.7 (trace step) | PERCENT | weight 0 to 10 |  |
| `ui/character.js:376` | Leading pattern Anticipation 8.0 | PERCENT | charge 0 to 10 | the "Anticipation8.0" the lead named; there is no space between the name and the figure in the rendered row either |
| `ui/character.js:386` | Coherence 48% | PERCENT | cq 0 to 100 | already a percent |
| `ui/character.js:387` | Vitality 0.24 | PERCENT | vitality 0 to 1 |  |
| `ui/character.js:388` | Decoherence 26% | PERCENT | dq 0 to 100 | already a percent |
| `ui/character.js:396` | seat bar 62 (no sign) | PERCENT | closed 0 to 1 | printed bare out of a hundred |
| `ui/character.js:560` | seat bar 62 (no sign) | PERCENT | closed 0 to 1 |  |
| `ui/character.js:564` | Charge 8.7 (heaviest rows) | PERCENT | weight 0 to 10 |  |

## ui/rings.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/rings.js:600` | CQ 48 / DQ 26 at the centre of the rings | PERCENT | cq 0 to 100; dq 0 to 100 |  |
| `ui/rings.js:736` | 26% (gate pill) | PERCENT | gate 0 to 100 | already a percent |
| `ui/rings.js:1081` | Pineal. SQ 4.2 (keyboard list) | PERCENT | weight 0 to 10 |  |
| `ui/rings.js:1089` | Most shut law. 3.1 | PERCENT | law 0 to 10 |  |
| `ui/rings.js:1092` | Heaviest pattern. Weight 4.9 | PERCENT | chain 0 to 10 |  |

## ui/wheel.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/wheel.js:506` | 48 (CQ at the wheel core, canvas) | PERCENT | cq 0 to 100 |  |
| `ui/wheel.js:618` | 26% (gate pill, canvas) | PERCENT | gate 0 to 100 | already a percent |
| `ui/wheel.js:627` | costs ×1.35 on everything held | OTHER | factor |  |

## ui/avatarui.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/avatarui.js:251` | avPct: 40% | PERCENT | complete 0 to 1 | already a percent |
| `ui/avatarui.js:722` | Crown, story written, 40 percent complete (aria) | PERCENT | complete 0 to 1 | already a percent |
| `ui/avatarui.js:1136` | Collapse 6.0 (avatar running row) | PERCENT | chain 0 to 10 | bar min(100,w*10) agrees |
| `ui/avatarui.js:1279` | How much of this is you: 1 2 3 4 5 | OTHER | input | a rating the person chooses |
| `ui/avatarui.js:445` | About 5 minutes | COUNT | minutes |  |

## ui/ritstage.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/ritstage.js:235` | Pineal 4.2 (ritual address badge) | PERCENT | weight 0 to 10 |  |
| `ui/ritstage.js:238` | fear held at the crown, at 4.2 | PERCENT | weight 0 to 10 |  |
| `ui/ritstage.js:281` | Complete 40% | PERCENT | complete 0 to 1 | already a percent |
| `ui/ritstage.js:304` | area 40% | PERCENT | complete 0 to 1 | already a percent |

## ui/ritual.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/ritual.js:1093` | kept 67% | PERCENT | kept 0 to 100 | already a percent |
| `ui/ritual.js:960` | Best 8 days / Kept 15 days / Practised 190 min / Streak 41 | COUNT | days, minutes |  |
| `ui/ritual.js (rv-*)` | Kept 9 days, 3 days left, 1 day missed, 5 min a day, Oct 1, 12 Oct to 18 Oct | COUNT | days, dates |  |

## ui/ritcal.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/ritcal.js:457` | Kept by seat 4 days | COUNT | days |  |

## ui/accountability.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/accountability.js` | no figure but counts and dates ("There is no percent, no score and no rate on this page") | COUNT | days | the ruling for this page stands: nothing to convert |

## ui/intakeui.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/intakeui.js:93` | 62% of what the axes carry is still the seed | PERCENT | portion 0 to 1 | already a percent (seedShare) |
| `ui/intakeui.js:783` | answers 3.6 apart (intake law row) | PERCENT | spread 0 to 10 |  |
| `ui/intakeui.js:938` | CQ 48 (intake head) | PERCENT | cq 0 to 100 |  |
| `ui/intakeui.js:992` | 4.6 (seat tile mean) | PERCENT | law 0 to 10 |  |
| `ui/intakeui.js:1004` | 4.6 (law row score) | PERCENT | law 0 to 10 |  |
| `ui/intakeui.js:1071` | CQ 48 (intake wheel centre) | PERCENT | cq 0 to 100 |  |
| `ui/intakeui.js:1094` | 4.6 (law score on the wheel) | PERCENT | law 0 to 10 |  |
| `ui/intakeui.js (iq-sl)` | slider marks 0 to 10, and 0, 5, 10 under the scale | OTHER | input | the answer scale itself; see open list |
| `ui/intakeui.js (iqa-hh)` | 63 questions left, 21 laws measured | COUNT | questions, laws |  |

## ui/personas.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/personas.js:15` | 4 addresses, SQ 4.2 (grid cell) | PERCENT | weight 0 to 10 | address count is a COUNT |
| `ui/personas.js:351` | 48 (the compass pole, CQ) | PERCENT | cq 0 to 100 |  |
| `ui/personas.js:363` | signal 57%, 8 held | PERCENT | portion 0 to 1 | already a percent (accuracy signal) |
| `ui/personas.js:364` | expression 40% | PERCENT | portion 0 to 1 | already a percent (accuracy exq) |
| `ui/personas.js:423` | Accuracy, 82 (orb, no sign) | PERCENT | accuracy 0 to 100 | printed bare today |
| `ui/personas.js:436` | 82.4% (accuracy drill head) | PERCENT | accuracy 0 to 100 | one decimal today |
| `ui/personas.js:452` | 33% of the laws are spread three or more | PERCENT | portion 0 to 1 | already a percent |

## ui/panels.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/panels.js:35` | profile sheet slider 6.2 (input box and aria-valuenow) | OTHER | input | what the person types; see open list |
| `ui/panels.js:70` | slider read back 6.2 | OTHER | input |  |
| `ui/panels.js:1177` | CQ 48 (profile row) | PERCENT | cq 0 to 100 |  |

## ui/storyui.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/storyui.js:1924` | Anger +1.7 (story pill) | PERCENT | atomsum 0 to 10 | rule 3 says a delta of an unknown unit goes: it becomes what the entry puts there, as a percent |
| `ui/storyui.js:2318` | Avoidance reads 40 per cent | PERCENT | portion 0 to 1 | already a percent |
| `ui/storyui.js:2320` | Aware against reactive, clean: 60 per cent | PERCENT | portion 0 to 1 | already a percent |
| `ui/storyui.js (vault)` | 14 / 10 / 3 (released counts) | COUNT | patterns |  |

## ui/imprints.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/imprints.js:69` | +2.0 / ✓ 3.0 / 4.2 (imprint chip) | PERCENT | atomsum 0 to 10; pole 0 to 10; weight 0 to 10 | the +ghost is a delta; rule 3 |
| `ui/imprints.js:75` | Waiting to land: 2.0 | PERCENT | atomsum 0 to 10 |  |
| `ui/imprints.js:76` | Trust installed at 3.0 | PERCENT | pole 0 to 10 | NOTE: n.pole under the word installed, as drills.js:570 |
| `ui/imprints.js:77` | Charge left 4.2, pain 6 | PERCENT | weight 0 to 10 | painOf is min(10, ...) on a ten scale (imprints.js:42): a weight, PERCENT kind weight |
| `ui/imprints.js:213` | Pineal 4.2 | PERCENT | weight 0 to 10 |  |
| `ui/imprints.js:251` | held 9.0, opposite 5.0 | PERCENT | charge 0 to 10; installed 0 to 10 |  |
| `ui/imprints.js:260` | 80% match, weight 4.9 | PERCENT | match 0 to 100; chain 0 to 10 |  |
| `ui/imprints.js:277` | fill 6.2, leaks 2 | PERCENT | law 0 to 10 | exprRead fill is on the law scale; leaks is a COUNT |

## ui/release.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/release.js:867` | DQ 26.14 (finished card) | PERCENT | dq 0 to 100 | two decimals today; release-percent.js asserts no sign; flips |
| `ui/release.js:868` | Down 0.14 | PERCENT | dq 0 to 100 | rule 3: becomes DQ from 26% to 26%, and "did not move" when the two round alike |
| `ui/release.js:956` | DQ 26.14 (live) | PERCENT | dq 0 to 100 |  |
| `ui/release.js:957` | Down 0.14 (live) | PERCENT | dq 0 to 100 | rule 3 |
| `ui/release.js:959` | CQ 48.02 (live) | PERCENT | cq 0 to 100 |  |
| `ui/release.js:960` | Up 0.01 (live) | PERCENT | cq 0 to 100 | rule 3; a single run moves CQ by less than a whole percent ("you may not see CQ move"), so it will read as no move |
| `ui/release.js:2965` | seat 4.2 → 3.1 | PERCENT | weight 0 to 10 | already before and after |
| `ui/release.js:2974` | CQ 48.02 (finished) | PERCENT | cq 0 to 100 |  |
| `ui/release.js:2975` | Up 0.01 (finished) | PERCENT | cq 0 to 100 | rule 3 |
| `ui/release.js:3011` | 8 addresses, 2 recharged, 1 read low | COUNT | addresses |  |
| `ui/release.js:3011` | 163 weight freed | PERCENT | dq 0 to 100 | a sum of freed weight on 0 to 100 per address, no ceiling; said as DQ before and after instead (rule 3), so no cap is registered |
| `ui/release.js:3014` | Pineal 42 Lowered (log ring, raw w0) | PERCENT | weight 0 to 10 | DEFECT under rule 1: w0 is already 0 to 100 (release.js:1275) and the ring fills w0*10, so every row above 10 draws a full ring |
| `ui/release.js:3020` | Expression up 0.4, now 47.3 | PERCENT | expression 0 to 100 | rule 3: from 47% to 47%, "did not move" when equal |
| `ui/release.js:3026` | Release has about 1.2 points left to give you | PERCENT | expression 0 to 100 | rule 5, as summary.js:1041 |
| `ui/release.js:3029` | Release has about 3.0 points more in it | PERCENT | expression 0 to 100 | rule 5 |
| `ui/release.js:3107` | running plate 4.2 | PERCENT | weight 0 to 10 | release-percent.js asserts no sign; flips |
| `ui/release.js:2865` | Left ear 216 Hz, right ear 224 Hz, gap of 8 | OTHER | unit | hertz is a physical unit |
| `ui/release.js:594` | 1:30 (clock) | OTHER | time |  |

## ui/record.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/record.js:132` | Coherence 48.2 → 50.1 +1.9 | PERCENT | cq 0 to 100 | already before and after; the signed delta goes (rule 3) |
| `ui/record.js:132` | Shadow weight 26.0 → 24.5 -1.5 | PERCENT | dq 0 to 100 | same |
| `ui/record.js:136` | Carried depth 4.42 → 4.10 | PERCENT | weight 0 to 10 |  |
| `ui/record.js:137` | Opposite installed 0.80 → 0.92 | PERCENT | pole 0 to 10 |  |
| `ui/record.js:138` | Overshot 0.52 → 0.40 | PERCENT | overshoot 0 to 10 |  |
| `ui/record.js:139` | Addresses carrying, Saboteurs, Complexes, Hyper, Character | COUNT | counts |  |
| `ui/record.js:33` | 3 days / 5 hours (since) | COUNT | days |  |

## ui/games.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/games.js:123` | Held 4.0. Trust installed 3.0 | PERCENT | charge 0 to 10; installed 0 to 10 |  |
| `ui/games.js:60` | 1:30 (timer) | OTHER | time |  |

## ui/practitioner.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/practitioner.js:826` | Kept, 15 minutes | COUNT | minutes |  |

## ui/onboard.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/onboard.js:1478` | about 2 minutes | COUNT | minutes |  |

## ui/plans.js,

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/plans.js, buy.html` | prices, 400 a month, tier one | COUNT | prices, tiers |  |

## ui/railtiles.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/railtiles.js` | no printed figure (fills only) | OTHER | geometry |  |

## funnel/quiz.html

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `funnel/quiz.html:666` | 48 Oscillating (the snapshot) | PERCENT | cq 0 to 100 |  |
| `funnel/quiz.html:724` | Root 4.2 (load at each seat, "out of ten") | PERCENT | weight 0 to 10 | fill v*10 agrees; the sentence "Average load per seat, out of ten" is rewritten in phase 2 |
| `funnel/quiz.html:811` | Truth 6.0 (law rows) | PERCENT | law 0 to 10 | fill v*10 agrees |
| `funnel/quiz.html:1335` | progress bar fill | OTHER | geometry | no figure printed |

## funnel/about.html

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `funnel/about.html:496` | Ceiling 0 to 100 | PERCENT | expression 0 to 100 | becomes 0% to 100% |
| `funnel/about.html:499` | Drag points of 100 | PERCENT | expression 0 to 100 | rule 5: the "points" unit goes |
| `funnel/about.html:436` | 4 or over counts as loaded | PERCENT | weight 0 to 10 | the line at 4, which is 40% |

## funnel/about.html,

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `funnel/about.html, index.html, faq.html, buy.html` | 112 addresses, 21 laws, 25 patterns, 21,400, 100 patterns, prices | COUNT | counts, prices |  |

## funnel/index.html,

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `funnel/index.html, ring.js` | canvas and ring geometry | OTHER | geometry |  |

## ui/*.js

| Where | Prints today | Class | Kind, lo to hi | Note |
|---|---|---|---|---|
| `ui/*.js (tipu "the line")` | the charge at one address reaches 4 and starts to cost your body | PERCENT | weight 0 to 10 | the line is 40% on the weight scale; LOADED is a threshold, printed in several glosses |

## Lines that format a number and print nothing

Not rows in the table, because no person reads them. Listed by file so the claim can be checked.

| File | Lines |
|---|---|
| `atuned_src/ui/analytics.js` | 14 |
| `atuned_src/ui/avatarui.js` | 5 |
| `atuned_src/ui/character.js` | 6 |
| `atuned_src/ui/chcloud.js` | 3 |
| `atuned_src/ui/component.js` | 19 |
| `atuned_src/ui/cone.js` | 15 |
| `atuned_src/ui/fieldbar.js` | 3 |
| `atuned_src/ui/games.js` | 2 |
| `atuned_src/ui/intakeui.js` | 4 |
| `atuned_src/ui/keep.js` | 1 |
| `atuned_src/ui/knowledge.js` | 4 |
| `atuned_src/ui/login.js` | 1 |
| `atuned_src/ui/loopread.js` | 1 |
| `atuned_src/ui/map.js` | 64 |
| `atuned_src/ui/onboard.js` | 8 |
| `atuned_src/ui/panels.js` | 3 |
| `atuned_src/ui/personas.js` | 7 |
| `atuned_src/ui/plans.js` | 1 |
| `atuned_src/ui/practitioner.js` | 2 |
| `atuned_src/ui/railtiles.js` | 5 |
| `atuned_src/ui/record.js` | 1 |
| `atuned_src/ui/release.js` | 12 |
| `atuned_src/ui/rings.js` | 63 |
| `atuned_src/ui/ritcal.js` | 2 |
| `atuned_src/ui/ritstage.js` | 3 |
| `atuned_src/ui/ritual.js` | 1 |
| `atuned_src/ui/sound.js` | 2 |
| `atuned_src/ui/storyui.js` | 11 |
| `atuned_src/ui/summary.js` | 1 |
| `atuned_src/ui/tip.js` | 4 |
| `atuned_src/ui/ui.js` | 6 |
| `atuned_src/ui/wheel.js` | 8 |
| `funnel/index.html` | 9 |
| `funnel/quiz.html` | 1 |
| `funnel/ring.js` | 2 |

