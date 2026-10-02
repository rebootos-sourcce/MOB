# Pass 3, UI UX architect (Dani Sorensen). Round PK, 2 October

Counts are my 1 October measurements (build `65ed759`) or budgets I set; a budget is a target, not a forecast. "Choices" means things a person can press at once on one screen. A0 re-measures first.

## 1. The architecture in three sentences

Four shared engines (reading rules, trace, loop read, safety screen) feed four fixed slots on screen: Next, Maybe, Why, Set aside. Privacy and entitlement are tables the screen reads, so lock copy and the data page are generated, not written twice. Everything new replaces something old, and a person in care gets the same layout with motion, locks and ladder removed.

The merge bent three things I care about. (a) It took "Continue" over my "Keep writing". Narrative's reason (menus are one word) is sound and I accept it, with a test: beside "Call" it could read as "continue the call". A5 carries a five person check on that one word. (b) It keeps the owner's gift ruling, the whole reading visible while the gift lasts. My pass 2 side (base sight only) was a default and he has ruled, so mine falls. The gift-end screen is still the take-away moment, so its copy must say what is kept and what changes before it happens. (c) No slice owned the loop ring. I add A16.

## 2. The ICP room

I judge only structure, flow and load.

- **Marta, acute distress, 02:00.** Sees the Story box she was in. She types "I can't do this anymore." The box does not lag (A1). At the sentence end a quiet card paints in one frame: her own words, one number line, Call, Text, Continue, under 25 words. No red, no label, no padlock, Next gone for this entry. She taps Text. She leaves if the card blocks the box, the quote is wrong, or a lock line sits below it. Voice: "It heard me and it did not make a scene."
- **Nils, the skeptic.** Sees one Next sentence of 14 words, then a Maybe with the quote it came from. He taps Why: six rows, three open, his own words and dates. He trusts rows that say "Nothing recorded." He leaves if any row is filled from a guess without "The instrument guesses". Voice: "Show me where it got that. Okay. It did."
- **Camille, somatic practitioner.** Presses Not me, then In my words, one level down and visible. She opens the data page in the profile sheet: Stays, Leaves, Delete, and "People who can see this record" read from grants. She trusts a list that can be empty. She leaves if it is a tenth tab or a constant. Voice: "I can hand this to a client because I can see who sees it."
- **Whitney, phone only.** At 390 wide: the Field, one Next, one primary button. The rail is a sheet and Why is a bottom sheet. Targets 44 by 44, 8 px apart. She stops at anything needing two thumbs or a chain with more than three open rows. Voice: "I have my thumb and ten minutes."
- **Renata, wants the chain as a number.** Looks for a score and finds six rungs with a count of distinct days each, never a total. She can add them herself. By ruling a reading is not a score, so we lose some of her. Voice: "Give me the number."
- **Gordon, refuses anything clinical.** No clinical word on any card. Not me goes to Set aside, listed and never counted, and the next Maybe differs. A No that works is his trust point. He leaves if Not me asks "are you sure" or a card names a state. Voice: "It took no for an answer."
- **Sofia, needs the consent list.** Sees revoke on each grant, and "Nobody" when empty. She trusts the page if Delete reaches the unreadable copies and the outbox (A11). She leaves if the encrypted export has no restore drill. Voice: "Show me the list, then show me it empty."
- **Trey, the quiz tourist.** Four seconds. He sees a result and a Next he did not ask for. If it says "Write one sentence about it" he writes one. If it names a feature he is gone. Gate: first useful act in under four taps and 40 words. Voice: "Is this the body map one? Fine, one sentence."

## 3. Unified quality: 72/100

Up because the screen now has one grammar: four slot labels, closed row names, one verb set. Three biggest gaps:

1. **Nothing has met a person.** The care card, Not me and Why are words, not screens. Five testers will move this score more than any slice.
2. **No writer exists yet.** Until the claim row ships, every real chain reads "Nothing recorded" and looks broken, not honest.
3. **Weight is unmeasured.** DOM is 3,998 nodes against 3,000, typing is 79 ms median at 1000 words under 4x throttle, and my choice counts are a day old.

## 4. Final grade

`GRADE: 70/100` (pass 1 58, pass 2 64).

Up: the merge took my slot grammar, the stage tile is gone, care is three outcomes under 25 words, and the claim row is the first writer. Held back: the gift ruling keeps a take-away moment, "Continue" is untested in care, and the ring had no owner. Built as panels beside the old: about 45. Built as replacements: about 75.

## 5. My part of the slices

Ids follow the technical director; I add A0, A14, A15, A16. Every slice must not touch TAB integers, `engine/core.js` tab order, or `source.html`. Size S, M, L.

**A0 Re-measure (S, MVP).** Goal: one stamped table of choice counts, nodes, typing p95. Changes: a script in `tools/` writing to `MONITOR.log`. Touch no product code. Gate: the table exists with commit and md5. Unlocks every budget. ICPs: none yet, but nobody argues from stale numbers.

**A1 Typing floor (S, MVP).** Goal: paint in one frame, parse after 150 ms. Changes: `ui/storyui.js` (`stRefresh`). Not engine or record. Gate: new `tests/perf.js`, p95 at or under 16 ms, 1000 words, 4x. Unlocks A5. Marta feels no lag; Whitney no stutter.

**A5 Care register, UI half of A4 (M, MVP).** Goal: quiet layout, card under 25 words, Call, Text, Continue, and "Quiet is on for this entry. Turn it off." always shown. Changes: `ui/storyui.js`, CSS. Not commit semantics, Ritual, Compass or the record. Gate: `tests/functional.js` (card shows, Continue works, nothing stored, choices fall), `tests/design.js` (18 px body, 48 px buttons), five person check on "Continue". Unlocks A12 hushing Next. Marta trusts it; Gordon sees no label; Nils sees no theatre.

**A12 Next slot (M, MVP).** Goal: one sentence, 14 words (12 in care), one primary button, Not now holds 7 days; replaces four doors and three cards; rail becomes Next, one live Maybe, seven folded accordions. Changes: `ui/component.js`, `ui/summary.js`, `ui/railtiles.js`, `engine/loop.js`. Not Compass or Ritual pages. Gate: "Day", "of 90", a stage name and any feature name never render; one Next per surface; Summary first viewport 12 choices or fewer; Field loaded 30 or fewer. Unlocks A13 and A16. Trey, Whitney and Diane get one act.

**A13a Claim row (M, MVP).** Goal: quote, claim in "may" form, Fits, Not me, Why; Not me goes to Set aside and changes what shows next; 10 second Undo in place. Changes: `ui/imprints.js` (the imprints panel, so the hot file `ui/storyui.js` gets one hook only). Not a new store. Gate: `functional.js` shows Not me changes the next Maybe; under 300 nodes net; one live claim per surface; no claim before a quotable sentence. Unlocks A13b and A8's first writer. Gordon, Nils, Sofia.

**A13b Why chain (M, MVP).** Goal: six closed rows, top three open, plain list, bottom sheet at 390. Changes: `ui/imprints.js`, CSS. Never a canvas, never hover only. Gate: each row leads with its verb; an empty row reads "Nothing recorded."; Confirmed fills only after a tap. Nils and Renata.

**A14 Lock fold and gift end (S, MVP).** Goal: one lock line per layer group (3 or fewer on the first Field screen, about 9 now); gift-end copy says what is kept before it happens. Changes: `ui/lock.js`, `ui/plans.js`. Not `engine/plan.js` rules; no lock, checkout or upsell in any care card, ever. Gate: `tests/locks.js` counts locks per screen; downgrade copy names ground, record, reruns. Nils sees no padlock wall; gift end does not read as a take-away.

**A15 Data page (M, MVP).** Goal: Stays, Leaves, Delete in two states, about 40 words, in the profile sheet. Changes: `ui/account.js`, `ui/panels.js`. No tenth tab; the table is A3's. Gate: text generated from the `PRIVACY` table; a missing key fails the build; delete then scan finds nothing. Unlocks A10 and A11 being visible. Sofia, Camille, Gordon.

**A16 Loop ring (M, later, after A12).** Goal: four quarters, the four ruled words, each lit from its newest dated act, dim after 14 days of none; art seat draws it. Changes: `ui/rings.js` or `ui/avatarui.js`. No stage, number or day. Gate: no digit or stage name in the ring's markup; it closes, never a list. Angela and Diane see a circle, not a staircase.

Merged duplicates: creative's slice 1 and A4 plus A5 are one safety line (A4 engine, A5 mine); creative's slice 7 and A13 are A13a and A13b; creative's slice 8 and A12 are one.

## 6. The order

1. **Parallel first:** A0, A1, A2, A3, R0 to R3 (server repo).
2. **Series on `ui/storyui.js`:** A1, then A5, then the single A13a hook. A4 and A6 run beside them on `engine/` only.
3. **Parallel with that series, other files:** A14 (`ui/lock.js`, `ui/plans.js`) and A15 (`ui/account.js`, `ui/panels.js`).
4. **After A8 writes real evidence:** A13a, then A13b (same file), then A12 (needs `loop.js` and the journey worktree merged), then A16.
5. **The five person test** runs on A5 and A13a before A12 is built. If "Continue" fails, change the word, not the layout.

`engine/schema.js` (A2, A9) never runs beside another slice on that file.

## 7. Question for the owner

None. Defaults taken, he can overrule: Continue stays pending the five person check; the gift stands as he ruled, with honest end copy; the ring is a later slice.

Instrument: Not now rate per Next sentence; Not me rate per claim; taps from Next to first written sentence; Why opened versus Fits tapped; care card Continue versus Pause; time from card shown to a tap, with no text stored. Proof: 4 of 5 testers name the Next act in 4 seconds, find Not me in 10, and in care say they were not labelled.
