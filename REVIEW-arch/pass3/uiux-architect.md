# Pass 3, UI UX architect (Dani Sorensen). Round PK, 2 October

Counts are my 1 October measurements (build `65ed759`) or budgets I set. "Choices" means things a person can press at once. A0 re-measures first.

## 1. The architecture in three sentences

Four shared engines (reading rules, trace, loop read, safety screen) feed four fixed slots on screen: Next, Maybe, Why, Set aside. Privacy and entitlement are tables the screen reads, so lock copy and the data page are generated, not written twice. Everything new replaces something old, and a person in care gets the same layout with motion, locks and ladder removed.

The merge bent three things I care about. (a) It took "Continue" over my "Keep writing". I accept it (menus are one word), with a test: beside "Call" it could read as "continue the call". A5 checks it with five people. (b) It keeps the owner's gift ruling, the whole reading visible while the gift lasts. He has ruled, so my pass 2 side falls. The gift end is still a take-away moment, so its copy must say what is kept and what changes before it happens. (c) No slice owned the loop ring. I add A16.

## 2. The ICP room

I judge only structure, flow and load.

- **Marta, acute distress, 02:00.** Types "I can't do this anymore." The box does not lag (A1). At the sentence end a quiet card paints in one frame: her own words, one number line, Call, Text, Continue, under 25 words. No red, label or padlock. She taps Text. Voice: "It heard me and made no scene."
- **Nils, the skeptic.** Sees one Next sentence, then a Maybe with the quote it came from. Taps Why: six rows, three open, his words and dates. He trusts "Nothing recorded." He leaves if any row holds a guess without "The instrument guesses". Voice: "Show me where it got that. Okay. It did."
- **Camille, somatic practitioner.** Presses Not me, then In my words, one level down and visible. Opens the data page in the profile sheet: Stays, Leaves, Delete, and who can see this record, read from grants. Voice: "I can hand this to a client because I can see who sees it."
- **Whitney, phone only.** At 390 wide: the Field, one Next, one primary button. The rail and Why are sheets. Targets 44 by 44. She stops at anything needing two thumbs. "Thumb and ten minutes."
- **Renata, wants the chain as a number.** Finds six rungs with a count of distinct days each, never a total, and can add them herself. By ruling a reading is not a score, so we lose some of her. "Just give me the number."
- **Gordon, refuses anything clinical.** No clinical word on any card. Not me goes to Set aside, listed and never counted, and the next Maybe differs. A No that works is his trust point. He leaves on "are you sure" or any named state. Voice: "It took no for an answer."
- **Sofia, needs the consent list.** Sees revoke on each grant, "Nobody" when empty. She trusts it if Delete reaches unreadable copies and the outbox (A11). Voice: "Show me the list, then empty."
- **Trey, the quiz tourist.** Four seconds. If Next says "Write one sentence about it" he writes one. If it names a feature he is gone. Gate: first useful act in under four taps and 40 words. "Fine, one sentence."

## 3. Unified quality: 72/100

One grammar now: four slot labels, closed row names, one verb set. Three biggest gaps:

1. **Nothing has met a person.** The care card, Not me and Why are words, not screens.
2. **No writer exists yet.** Until the claim row ships, every real chain reads "Nothing recorded" and looks broken, not honest.
3. **Weight is unmeasured.** DOM is 3,998 nodes against 3,000, typing is 79 ms median at 1000 words under 4x throttle, my choice counts are a day old.

## 4. Final grade

`GRADE: 70/100` (pass 1 58, pass 2 64).

Up: slot grammar adopted, stage tile gone, care is three outcomes, the claim row is the first writer. Held back: the gift keeps a take-away moment, "Continue" is untested in care, the ring had no owner. Built beside the old: about 45. Built as replacements: about 75.

## 5. My part of the slices

Ids follow the technical director; I add A0, A14, A15, A16. No slice touches TAB integers, `engine/core.js` tab order or `source.html`.

- **A0 Re-measure. S, MVP.** One stamped table of choices, nodes, typing p95. A script in `tools/` writing `MONITOR.log`. Gate: the table exists, stamped.
- **A1 Typing floor. S, MVP.** Paint in one frame, parse after 150 ms. `ui/storyui.js` (`stRefresh`); not engine or record. Gate: new `tests/perf.js`, p95 at or under 16 ms, 1000 words, 4x. Unlocks A5.
- **A5 Care register, the screen half of A4. M, MVP.** Quiet layout, card under 25 words, Call, Text, Continue, "Quiet is on for this entry. Turn it off." always shown. `ui/storyui.js`, CSS; not commit semantics, Ritual, Compass, record. Gate: `tests/functional.js` (card shows, Continue works, nothing stored, choices fall), `tests/design.js` (18 px body, 48 px buttons), five person check on "Continue". Unlocks A12 hushing Next.
- **A12 Next slot. M, MVP.** One sentence, 14 words (12 in care), one primary button, Not now holds 7 days; replaces four doors and three cards; rail becomes Next, one live Maybe, seven folded accordions. `ui/component.js`, `ui/summary.js`, `ui/railtiles.js`, `engine/loop.js`; not Compass or Ritual pages. Gate: "Day", "of 90", a stage name or a feature name never render; one Next per surface; Summary first viewport 12 choices or fewer; Field loaded 30 or fewer. Unlocks A13 and A16. Trey, Whitney, Diane.
- **A13a Claim row. M, MVP.** Quote, claim in "may" form, Fits, Not me, Why; Not me goes to Set aside and changes what shows next; 10 second Undo in place. `ui/imprints.js` (the imprints panel, so the hot file `ui/storyui.js` gets one hook); no new store. Gate: `functional.js` shows Not me changes the next Maybe; under 300 nodes net; one live claim per surface. Unlocks A13b and A8's first writer. Gordon, Nils, Sofia.
- **A13b Why chain. M, MVP.** Six closed rows, top three open, plain list, bottom sheet at 390. `ui/imprints.js`, CSS; never a canvas, never hover only. Gate: each row leads with its verb; empty reads "Nothing recorded."; Confirmed fills only after a tap. Nils, Renata.
- **A14 Lock fold and gift end. S, MVP.** One lock line per layer group (3 or fewer on the first Field screen, about 9 now); gift-end copy says what is kept before it happens. `ui/lock.js`, `ui/plans.js`; not `engine/plan.js`; no lock, checkout or upsell in any care card. Gate: `tests/locks.js` counts locks per screen; downgrade copy names ground, record, reruns.
- **A15 Data page. M, MVP.** Stays, Leaves, Delete in two states, about 40 words, in the profile sheet. `ui/account.js`, `ui/panels.js`; no tenth tab; the table is A3's. Gate: text generated from `PRIVACY`; a missing key fails the build; delete then scan finds nothing. Makes A10 and A11 visible. Sofia, Camille, Gordon.
- **A16 Loop ring. M, later, after A12.** Four quarters, the four ruled words, each lit from its newest dated act, dim after 14 days of none; art seat draws it. `ui/rings.js` or `ui/avatarui.js`; no stage, number or day. Gate: no digit or stage name in its markup; it closes, never a list. Angela, Diane.

Merged: creative slice 1 with A4 and A5, slice 7 with A13, slice 8 with A12.

## 6. The order

1. **Parallel first:** A0, A1, A2, A3, R0 to R3 (server repo).
2. **Series on `ui/storyui.js`:** A1, then A5, then the one A13a hook. A4 and A6 run beside them on `engine/` only.
3. **Parallel with that series, other files:** A14 and A15.
4. **After A8 writes real evidence:** A13a, then A13b (same file), then A12 (needs `loop.js` and the journey worktree merged), then A16.
5. **Five person test** on A5 and A13a before A12 is built. If "Continue" fails, change the word, not the layout.

`engine/schema.js` (A2, A9) never runs beside another slice on that file.

## 7. Question for the owner

None. Defaults taken, he can overrule: Continue stays pending the check; the gift stands as he ruled, with honest end copy; the ring is later.

Instrument: Not now rate per Next sentence; Not me rate per claim; taps from Next to first written sentence; Why opened versus Fits tapped; care card Continue versus Pause; time from card shown to tap, no text stored. Proof: 4 of 5 testers name the Next act in 4 seconds, find Not me in 10, and in care say they were not labelled.
