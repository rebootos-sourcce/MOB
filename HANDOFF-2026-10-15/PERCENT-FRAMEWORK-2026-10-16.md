# The percent framework, 16 October 2026

MOB. Phase 1 of the owner's ruling of 16 October. The code is `atuned_src/engine/pct.js`; the list of every place a number is printed is `PERCENT-INVENTORY-2026-10-16.md` beside this file.

## The ruling, in his words

> "Instead of 0.0, site wide, we need to convert those numbers into percent. I think it's a more natural language for people to understand. So we need to create a framework and a formula and to make sure that all of our elements are percent-based. If it says 6.2, then we should change that to percent. If it's 112 patterns, just leave it alone. Or, sorry, chakras, leave it alone."

## The rule, in plain words

1. **The percent you read is how full the ring or bar is.** If a ring is drawn two thirds full, the number beside it says 67%. What is read and what is drawn can never disagree.
2. **One formula, one table.** Every kind of score has a bottom (lo) and a top (hi) written once, in one table, with the line of engine code that sets that range. The percent is how far the value sits between the two.
3. **A change is said as before and after.** "CQ moved from 58% to 61% since last session", never "up 3", because "3" of what is not on the screen.
4. **Counts stay counts.** 112 addresses, 25 patterns, 21 laws, nine axes, seven seats and their names, days, minutes, answers, prices, tier numbers, versions, dates, ids, coordinates and geometry never get a percent.
5. **"Points" goes.** "Holds back about 3.0 points of your coherence" becomes a percent on the same scale as coherence. The engine's headroom (`exHeadroom`, `engine/compute.js:585`) is the gap between expression now and expression with every charge released, and expression is CQ (0 to 100) times what the shadow leaves, so the gap is already out of 100: 3.0 points is 3%. Said as before and after it reads "release could take your expression from 47% to 50%". A gap that rounds to 0% prints no sentence at all.
6. **CQ and DQ print as N% everywhere.** They are already 0 to 100.

## The formula

```
pct(kind, value) = clamp(round(100 * (value - lo) / (hi - lo)), 0, 100)
```

- `pct(kind, value)` gives a whole number from 0 to 100, or `null` when the value is not a number (so "nothing to read" is never confused with "read, and it is nought"). A kind that is not in the table throws, naming the kind, so a typo can never print a believable figure.
- `fmtPct(kind, value, opts)` gives what a person reads: `62%`, a plain sign, a whole number, no space. A value that rounds to nothing gives the en dash `–`, the dash every surface already uses for "nothing here", never `0%`. With `opts.unread` (the reading's own `r.unread`) it gives the dash whatever the value, because a default is not a reading.
- `pctMove(kind, before, after)` gives `{from:"58%", to:"61%", moved:true, up:true}`. When the two print the same, `moved` is false and the surface says the reading held, not "from 58% to 58%".

Worked examples, from the gate: a weight of 6.2 reads 62%; CQ 58.4 reads 58%; vitality 0.17 reads 17%; a law at 0.04 reads `–` and at 0.05 reads 1%.

## The registry

Each row is one kind. "Range from" is the line in the engine (or in a renderer, where the formula lives there today) that bounds the value; the gate reads that file and fails by name if the bound is no longer written there. Line numbers are those on main at `f403588`, after the merge of 16 October.

| Kind | lo | hi | What it is | Range from | Who prints it |
|---|---|---|---|---|---|
| `cq` | 0 | 100 | coherence, the 21 laws summed over 210 | `engine/compute.js:172` | analytics.js, character.js, component.js, cone.js, drills.js, engine/data/canon.js, fieldbar.js, funnel/quiz.html, intakeui.js, panels.js, personas.js, record.js, release.js, rings.js, summary.js, ui.js, wheel.js |
| `dq` | 0 | 100 | decoherence, the shadow on all 112 against the most they could hold | `engine/compute.js:408` | analytics.js, character.js, component.js, drills.js, fieldbar.js, record.js, release.js, rings.js, summary.js |
| `expression` | 0 | 100 | expression, and the headroom a release still has in it | `engine/compute.js:448` | analytics.js, drills.js, funnel/about.html, release.js, summary.js |
| `accuracy` | 0 | 100 | identification, how much of the person the instrument has measured | `engine/compute.js:622` | analytics.js, personas.js, summary.js |
| `axis` | 0 | 100 | the position on a compass axis | `engine/data/compass.js:484` | cone.js, drills.js |
| `match` | 0 | 100 | a saboteur match | `engine/core.js:426` | analytics.js, drills.js, imprints.js, map.js |
| `gate` | 0 | 100 | the share of the story through one gate | `engine/verp.js:357` | drills.js, fieldbar.js, rings.js, ui.js, wheel.js |
| `lean` | 0 | 100 | the benign or malignant share | `engine/verp.js:496` | component.js, drills.js, ui.js |
| `kept` | 0 | 100 | the days a ritual was kept against the days it was due | `ui/ritual.js:1087` | ritual.js |
| `law` | 0 | 10 | one law | `engine/schema.js:1047` | analytics.js, cone.js, drills.js, funnel/quiz.html, imprints.js, intakeui.js, mapshelf.js, rings.js, ui.js |
| `charge` | 0 | 10 | the charge on one axis | `engine/schema.js:1040` | analytics.js, character.js, drills.js, games.js, imprints.js, summary.js, ui.js |
| `installed` | 0 | 10 | an opposite installed | `engine/schema.js:1041` | analytics.js, drills.js, games.js, imprints.js, knowledge.js, summary.js, ui.js |
| `held` | 0 | 10 | the charge held at one address | `engine/compute.js:290` | drills.js, knowledge.js, ui.js |
| `weight` | 0 | 10 | the weight at an address, or a mean of it | `engine/compute.js:295` | *.js, analytics.js, character.js, component.js, cone.js, drills.js, fieldbar.js, funnel/about.html, funnel/quiz.html, imprints.js, knowledge.js, map.js, mapshelf.js, personas.js, record.js, release.js, rings.js, ritstage.js, summary.js, ui.js |
| `chain` | 0 | 10 | the weight of a saboteur, complex, hyper complex or character layer | `engine/core.js:430` | analytics.js, avatarui.js, component.js, drills.js, imprints.js, map.js, mapshelf.js, rings.js, ui.js |
| `pole` | 0 | 10 | how far the opposite outweighs the charge | `engine/compute.js:296` | analytics.js, drills.js, imprints.js, record.js, summary.js, ui.js |
| `overshoot` | 0 | 10 | an opposite pushed past the point where it helps | `engine/compute.js:300` | analytics.js, record.js, ui.js |
| `distortion` | 0 | 10 | how much what is running bends what is meant | `engine/compute.js:381` | drills.js, ui.js |
| `integrity` | 0 | 10 | integrity, the laws lifted by the poles and pulled down by overshoot | `engine/compute.js:390` | cone.js, drills.js, summary.js, ui.js |
| `intention` | 0 | 10 | intention, the same laws read seat by seat | `engine/compute.js:391` | drills.js, ui.js |
| `spread` | 0 | 10 | how far apart a law's three answers sit | `engine/intake.js:55` | drills.js, intakeui.js |
| `atom` | 0 | 10 | what one entry put at one address | `engine/sniff.js:906` | drills.js, ui.js |
| `atomsum` **cap** | 0 | 10 | what several entries put at one address, added up | `engine/sniff.js:906` | drills.js, imprints.js, map.js, storyui.js |
| `vitality` | 0 | 1 | vitality | `engine/compute.js:510` | character.js, drills.js, ui.js |
| `awareness` | 0 | 1 | awareness | `engine/compute.js:511` | drills.js, ui.js |
| `will` | 0 | 1 | will | `engine/compute.js:512` | drills.js, ui.js |
| `radiance` | 0 | 1 | radiance, vitality, awareness and will together | `engine/compute.js:513` | drills.js, ui.js |
| `energy` | 0 | 1 | energy, the mean of vitality, awareness and will | `ui/summary.js:76` | drills.js, summary.js |
| `pull` | 0 | 1 | how hard the shadow drags | `engine/compute.js:280` | analytics.js, drills.js |
| `seatload` | 0 | 1 | the load a seat carries | `ui/map.js:202` | drills.js, summary.js |
| `pass` | 0 | 1 | what one seat passes on | `ui/map.js:203` | analytics.js, drills.js, map.js, mapshelf.js |
| `flow` | 0 | 1 | flow, what gets from the root to the crown | `ui/map.js:206` | drills.js, map.js, ui.js |
| `affinity` | 0 | 1 | an archetype against the strongest | `engine/core.js:403` | analytics.js, drills.js, ui.js |
| `share` | 0 | 1 | an archetype's share of all twelve | `ui/summary.js:438` | fieldbar.js, summary.js |
| `domain` | 0 | 1 | a blueprint domain against the strongest | `engine/core.js:394` | fieldbar.js, ui.js |
| `shape` | 0 | 1 | shape, the share of what is running that points at other people | `engine/data/compass.js:655` | drills.js |
| `control` | 0 | 1 | control, the share of what is running that is organised | `engine/data/compass.js:634` | drills.js |
| `portion` | 0 | 1 | how many of a set, against the whole set | `ui/knowledge.js:212` | fieldbar.js, intakeui.js, knowledge.js, personas.js, storyui.js |
| `closed` | 0 | 1 | how closed a seat is, the shadow at that seat | `engine/charfield.js:60` | character.js |
| `leak` | 0 | 1 | how much a seat leaks | `engine/charfield.js:160` | character.js |
| `complete` | 0 | 1 | the avatar's percent complete | `ui/avatarui.js:624` | avatarui.js, ritstage.js |

## What stays as it is

- **Counts:** addresses, patterns, stories, entries, sentences, days, minutes, answers, questions, laws, axes, seats, fetters, saboteurs, complexes, cues, prices, tier numbers, the 112.
- **Names that happen to be numbers:** life path, expression and soul urge numbers, karmic debt, Human Design gates and lines (60.1), profile (6/2), card ranks.
- **Factors:** the gate multiplier (×0.60 to ×1.35), susceptibility (×0.448 to ×1.3), the zoom (1.0×). A factor can stand above one and is not the fill of anything.
- **Inputs the person chooses:** the intake slider marks 0 to 10, the profile sheet sliders, the pain brush level, the avatar's one to five rating. These are the scale the person answers on. See the open list.
- **Physical units and time:** hertz, the release clock, the game timer, dates.
- **The accountability page,** which already prints no score, only days.

## Caps for the owner to rule on

A cap is a top chosen because the quantity has no true maximum. There is one.

- **`atomsum`, what several entries put at one address, added up, capped at 10.** It is a sum over entries, so it has no ceiling. Measured over all 16 people in the worked example roster on 16 October: only two carry a story that lands, eight imprints in all; the 99th percentile of the sum at one address is 2.2 and of a merged pill 8.8. Both are under what a single entry can already put at one seat, 10 (`engine/sniff.js:906`), and a cap below that would print 100% on one ordinary entry. So the cap is 10. The roster cannot measure more, because each person in it carries one story. **The question:** keep 10, or pick a larger top (for example 30, three heavy entries) once real records with several entries exist.
- **Not a cap, a choice taken:** the release's "163 weight freed" is also a sum with no ceiling. Rather than invent a top for it, phase 2 says the same fact as DQ before and after the run (rule 3), so no cap is needed. His to overturn.

## Open, and whose call (the lead decides or carries one question)

1. **One archetype, three figures.** Summary prints a share of all twelve (Caregiver 17%), the hover prints a share of the strongest (100%), Analytics prints the strongest times ten (10.0). The registry carries both `share` and `affinity`. Recommended: `affinity` everywhere, because it is what the engine returns and the strongest reading 100% matches "primary"; the Summary's ordering already carries rank.
2. **The 14 October plate.** `tests/golden.js` station 4 holds that the Summary plate prints a word ("early", "partial", "full") and not the figure on a quiz only record. The lead has ruled that a percent of a defined maximum is not a raw score; whether the plate returns to `48%` or keeps the word is a call the lead makes before phase 2 touches `summary.js`.
3. **Inputs.** The intake slider, the profile sheet sliders and the pain brush are answered on 0 to 10. Recommended: the scale a person answers on stays as it is; what the engine reads back from those answers is printed as a percent.
4. **"Answers 36% apart".** The law spread converts cleanly, but the sentence needs rewriting ("your three answers sit 36% of the scale apart"); that is copy for phase 2.
5. **The line at 4.** Several glosses say a charge "reaches 4 and starts to cost your body". On the weight scale that is 40%. Recommended: phase 2 says 40%.

## What phase 2 will change, and the tests that move with it

- **Renderers:** every PERCENT row in the inventory prints through `fmtPct`, and where the drawn fill is computed separately it moves onto `pct` for the same kind. The local copies go: `rbPct` and `rbBare` in `ui/component.js`, `f1`, `nb` and `pc` in `ui/fieldbar.js`, `kbPct` and `kbPct100` in `ui/knowledge.js`, `avPct` in `ui/avatarui.js`.
- **The defects found by the inventory get fixed in passing,** because each one is the rule broken: the release log ring, the glass bar and body map orbs, the analytics bubble floors and the domain bubbles' constant.
- **Tests whose assertions flip:** `tests/release-percent.js` (all of it: it asserts no percent sign on the release screen); `tests/railmenu.js` RM2 ("prints the two figures bare, no percent sign"); `tests/design.js` section "the headline coherence is a number, not a percent" (round PQ: the Laws circle, the Decoherence circle and the ring at the foot of the stage); `tests/golden.js` station 4 (the Summary plate word, item 2 above); `tests/copy.js` lines 85 and 86 ("a weight prints as a whole number", "a change in CQ is said in whole numbers", which become "a weight prints as a percent" and "a change is said from and to"); `tests/functional.js` lines 355 and 382 compare the Character page's figure against `toFixed(1)` and move to `fmtPct`.

