GRADE: 58/100

Dani Sorensen, UI UX architect. Pass 1, 2 October 2026, round PK. Read: BRIEF, OWNER-INPUT, then the repo. I did not re-run the browser counts. Every count below is either my 1 October measurement (`REVIEW-skin/pass1/uiux-architect.md`, build `65ed759`) or a BUDGET I am setting for the new parts. Budgets are targets, not forecasts.

Grade means: how ready this is to be built as proposed, as screens a person can live with. The proposal is a backend architecture. It names almost no screen. My job is to say where each idea lands and what it costs the person's head.

| Criterion | /10 | Evidence |
|---|---|---|
| Fits the owner's loop and rulings | 7 | Evidence first, "may" language and no diagnosis all match the voice rules. Day labels ("Day 31 to 45") and a "90" bar would break "never print a count against a total". |
| Surfaces exist to carry it | 5 | Next action: three cards already. Right to say no: engine only. Why chain: engine only. See below. |
| Cognitive load as proposed | 4 | Field loaded was 49 choices, right rail has seven accordions (`body.html` rpanel). The proposal adds items and removes none. |
| Right to say no | 6 | The six response types exist (`daily.js:90`). No screen shows them (`summary.js:868`, `sumDayHtml` returns an empty string). |
| Verification without an exam | 5 | The cheap route exists: a rerun costs nothing (`release.js:176`). Behaviour checks have no surface. |
| Heightened care | 3 | No detector, no quiet register on distress. `lexicon.js:104` scores "hopeless" as heart charge 26. That is a reading, not a gate. |
| Day one for levels 4 and 5 | 6 | Angela's lane is the unread Summary and Story. The four doors sit in the rail at 12px. |
| Honest affordance | 7 | The lock pattern (`ui/lock.js`) is honest. Anything hidden by this architecture needs the same. |

## THE JOB, in the person's words
- Summary: "Tell me the one thing to do today, and why you think so."
- A claim about me: "Is that me? Let me say no without being argued with."
- Verification: "Did it work? Ask me like a friend, not a teacher."
- Care: "Do not make this bigger than it is. Do not leave me either."
- Stage: "Am I getting somewhere? Do not tell me a day number."
- Evidence: "Show me what I said that made you think that."

## AREA BY AREA

### 1. Next best action (NBA)
- **Exists.** Three competing "nexts": `sumOutput` (`summary.js:875`) prints a row of three cards (The protocol, Release this first, Next marker). `startHTML` (`component.js:1161`) prints "Where to start" with four doors in the right rail. Source AI asks one question in Story (`storyui.js:624`). Four labels, three authors. This is the proposal's "agents compete" problem, already visible.
- **Move.** One slot, one label: **Next**. Same sentence wherever it shows. It names an act in the person's words ("Write what happened this week"), not a feature ("Open Story"). One primary button, one quiet "Not now".
- **Where.** Summary: top, directly under the plate, replacing the three card row (Next marker folds under the ladder). Field and Story right rail: first item. Ritual: not shown, the ritual is the next. Compass: not shown, it is an instrument.
- **Count.** Budget 2 controls. It REPLACES four doors plus three cards, so the first screen goes down by 5.
- **Where they stop.** Angela, if it reads as an order. Derek, if it nags. Diane, if it contradicts the page under it.

### 2. A claim the person may disagree with
- **Exists.** `DLY_RESP` has accurate, partly, not, why, context, correct. No UI. Imprints in the Story rail are readings with no way to say no.
- **Move.** One row component, used everywhere a claim appears: the person's quote first, then the claim worded "may", then three buttons: **Fits**, **Not me**, **Why**. "Partly", "context" and "correct" sit one level down, shown after Not me. Slot label for a claim: **Maybe**. The voice seat can overrule the word.
- **No is final and quiet.** No confirm box. A 10 second Undo in place. The claim moves to "Set aside", which is listed, never counted, never scored. It must change what shows next. A No that changes nothing is a fake right.
- **Never.** No confidence number (daily.js bans it, `DLY_SCORE`). No claim shown before the person has written something it quotes. This is the Angela rule.
- **Sold claims need No most.** Saboteurs and complexes are what tiers sell (`plan.js:81`, SIGHT). A person pays to see a claim about themselves. Compass and Character claims need the same row.
- **Count.** Budget 4 per claim (3 plus Why). One live claim at a time on Summary; others fold under one text button.
- **Where they stop.** Angela at any claim worded as fact. Sofia wants to correct it in her own words (that is `correct`, one level down, and must be reachable). James, if there is no source on it.

### 3. Verification that does not feel like an exam
- **Exists.** A rerun (`meterRerunPlan`) checks a release by the instrument itself, free and forever per DECISIONS. Nothing asks about behaviour.
- **Move.** Ask only after an event (a ritual marked done, a rerun, a new entry that touches the same seat), never on a timer. One question per session, at most. Four answers in plain speech ("It came up and I stayed", "It came up, same as before", "It did not come up", "Skip"). No pass or fail word. No score. Skip costs nothing and is remembered.
- **One word.** The chain's last step reads **Confirmed**, not "verified". The system confirms nothing about a person; the person confirms what happened.
- **Where.** Ritual on done (it already feels like closing a loop). Story, in the next entry's Source AI lane. Summary once, inside Next. Never Compass.
- **Count.** Budget 4 buttons. **Where they stop.** James reads it as a quiz. Derek answers fast to get past it, which is fine: the stage must come from behaviour, never from this tap alone.

### 4. Heightened care, on screen, without alarm
- **Exists.** Nothing. There is a Quiet mode (`body.quiet`) for motion. No distress detector. The ruling is no permanent safety line, so the screen must be silent until it is needed.
- **Move.** Change the register, not the volume. The layout stays. Motion stops. Next, streak, locks and ladder disappear for that entry. No red, no modal, no siren icon, no words like "detected". One sentence in the Source AI lane, in the person's own quoted words: "You wrote 'I cannot do this anymore.' Keep writing, or stop here?" Three choices: **Keep writing**, **Stop here**, **Talk to a person**. The third opens help, matched to place, in one tap. The journal never blocks and never leaves the device.
- **Tell them what changed.** One line, "Quiet is on for this entry. Turn it off." Hiding it with no affordance is the same as lying (ruling 10).
- **Levels.** Possible trauma activation: slow the pace, offer "Stop and ground". Crisis: the same lane widens to one calm panel, one number, one "Not now, keep writing". Medical, substance, abuse: same lane, different third button. Never a clinical word on screen.
- **Where.** Story box, the Release run, and Ritual practices that load the body. Reading surfaces (Summary, Compass) get safe wording by content rule, no new UI.
- **Count.** Budget 3 to 5 choices, always LOWER than the page before. Care mode is the one place load must fall.
- **Where they stop.** Ana, the crisis persona (`DECISIONS.md` near line 2420): anything over 12 words. Sofia and Derek: a false alarm on hyperbole. One dismissal must hold for that entry.

### 5. The 90-day state, no days
- **Exists.** `ladder.js` prints streaks in days ("days best kept" on Ritual). `daily.js` bans `streak` and loss words in the daily day (`DLY_LOSS`). The two disagree. Avatar and the four loop sections exist.
- **Move.** Never print Day N or N of 90. Show a stage as a place: one word and one sentence of "what is next to experience". Draw it as the lit station on the loop drawn as a circle (the standing ruling), not a bar. Ten proposed stage names are too many to hold. Fold them to the four loop words (discover, play, flow, embody) on the ring and the finer name in the sentence. A step back reads "Back at pattern recognition", never loss language.
- **Where.** Right rail: tile **Where you are**, second item under Next. Summary: opens with the stage sentence, since the Summary is generated from the state. Avatar: the long view. Not on Compass.
- **Count.** 1 control (open the sentence). **Where they stop.** Derek wants a number; give him a recorded count of events that happened, never a total. Diane wants the cost; the stage sentence must name it.

### 6. "Why do you think that?" in one tap
- **Exists.** Engine only: `tracePatternWhy` (`trace.js:306`), `traceNodeWhy`, `tracePath`, `dlyWhy` (`daily.js:1152`), and each Source AI rung is a count a person can check (`sourceai.js:111`). No surface calls any of them.
- **Move.** **Why** is a 44 pixel text button on every claim. It opens a chain IN PLACE under the claim, not a new page, a bottom sheet on a phone. Six rows in a fixed order, same labels every time: **Said, Heard, Maybe, Felt, Changed, Confirmed**. An empty row keeps its label and reads "Not yet" (the value carries the state, ruling 2). Top three rows open by default, the rest unfold. Each row quotes the person's own words and gives a date as a relative word.
- **Where.** On desktop the Selection section of the right rail mirrors it when the claim is about an address. No tenth tab: Trace stays a view, not a surface.
- **Count.** 1 tap to open, 1 to close, 6 rows of text. Never hover only. The backlog already found 195 definitions reachable only by hover.
- **Where they stop.** Angela when the chain uses seat and saboteur words. James when a row cannot be traced to his sentence. The lexicon must show his word, not its own label.

## HOW IT CHANGES THE FIRST SCREEN AND THE RIGHT RAIL
- **First screen, unread.** The wheel and bar stay. The rail's "Four ways in" becomes **Next: Write what happened** with one button; the other three doors fold under "Other ways in". Nothing about a hypothesis, stage or Maybe appears. A stranger has said nothing, so the system has nothing to doubt.
- **Right rail, read.** Order: **Next**, **Where you are**, one live **Maybe** with its three buttons, then the seven existing accordions (Energetic Summary, Imprints, Reading, Selection, Flow, Running, Moral integrity) folded by default, chevron kept as the affordance. The rail was wallpaper (same Marcus reading on five tabs); the top three items make it the only part that changes with the person.
- **Budget.** New items on the rail: 3 groups, about 8 controls. Removed: four doors, three cards, six open accordions. Target Field loaded 30 or less (was 49), Summary first viewport 12 or less.

## RISKS
1. Additive build. If the proposal lands as new panels beside the old, load rises about 10 and the rail gets louder. Fix: every new item replaces an old one.
2. Care mode as false alarm. A hyperbole gate trips on "I could kill him" in a work story. The gate and the screen must be tested together.
3. Right to say no is fake if the reading does not change. Needs engine support (a set aside list that feeds the Orchestrator).
4. The word Maybe, Fits and Not me against the voice rules. Needs the voice seat.
5. Streak in days against the 90-day idea. Pick one counter language. Owner or Product seat.
6. Entitlements (area 6): a downgrade must not re-lock opened ground, so the padlock count on the first screen goes DOWN, not up.

## WHAT TO INSTRUMENT, so pass 3 can tell if it worked
Counts stay on the device (no network). Five person test, three from levels 4 to 6.
- Next: shown, taken, "Not now". Test: 4 of 5 say what to do next within 4 seconds.
- Claim: Fits, Not me, Partly, Why opened, time to the first Not me. Test: 4 of 5 find Not me without help in 10 seconds. A claim set aside 3 or more times in a row means the wording is wrong, not the person.
- Chain: depth opened, taps. Test: 4 of 5 can point to the sentence they wrote that caused the claim.
- Verification: shown, answered, skipped. Test: 0 of 5 call it a quiz, test or exam in their own words.
- Care: triggered, Keep writing, Stop here, Talk to a person, "Turn it off". Test the copy with a script and consenting people only, never a live distress test.
- Stage: moved forward, moved back. A stage that never moves back is not reading behaviour.

## RECOMMENDED ORDER (my six areas)
1. **Care register** (M). Spec now, ship before any new claim. Intimate text is already taken in Story. Needs the Safety seat's gate.
2. **Claim row with Fits, Not me, Why** (M). Ship on the Story imprints panel first, the surface that exists. Uses `dlyRespond` and `tracePatternWhy`. Depends on a Set aside list.
3. **Next slot** (S to M). Replace the four doors and the three cards. Rule based at first, from existing data. Becomes the Orchestrator's output later.
4. **Why chain sheet** (M). Reuse the row component. Six labels agreed with the Voice and Evidence seats.
5. **Verification ask** (S). On ritual done and on the next entry only. Needs the Evidence seat's states.
6. **Stage tile and the loop as a circle** (M). Last, because it needs the 90-day state to exist first and the loop redraw is the Art seat's.
7. **Fold the right rail** (S). Do this with step 3, not after.

## GRADE DELTA
Skin pass: 51. This architecture, built as I cut it, adds clarity (one Next, a No that works, a Why in one tap): about 60. Built as new panels beside the old: about 45. The difference is entirely whether each new item replaces an old one.
