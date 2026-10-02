# Pass 3, UI UX architect (Dani Sorensen). Round PK, 2 October

Counts are my 1 October measurements (build `65ed759`) or budgets I set. A budget is a target, not a forecast. "Choices" means things a person can press or decide on one screen at once. Slice 0 (A0 below) re-measures before anything is built.

## 1. The architecture in three sentences

The six areas become one reading library, one derived trace, one loop read and one safety screen, and the person meets them as four fixed slots on screen: Next, Maybe, Why, Set aside. Privacy and entitlement are tables the screen reads from, so the lock copy and the data page are generated, not written twice. Everything new replaces something old, and a person in care gets the same layout with the motion, locks and ladder removed.

Did the merge bend anything I care about? Three things. (a) It took "Continue" over my "Keep writing". Narrative's reason (menus are one word, three verbs in one grammar) is sound and I accept it, with a test: in a care card, "Continue" sits beside "Call" and could read as "continue the call". Slice A5 carries a five person check on that one word. (b) It keeps the owner's gift ruling, whole reading visible while the gift lasts. My pass 2 position (base sight only) was a default and the owner has ruled, so mine falls. The risk I named stays: the gift-end screen is the take-away moment, so its copy must say what is kept and what changes before it happens, not at the lock. (c) The merge lists "the loop ring dims after 14 days" but no slice owns the ring. I add one (A16).

## 2. The ICP room

I judge only structure, flow and load. Eight people, one screen each.

**Marta, acute distress, 02:00.** Sees the Story box she was already in. Types "I can't do this anymore, I want it to stop." The box does not lag (A1). At the sentence end a quiet card paints in one frame: her own words quoted, one number line, three buttons: Call, Text, Continue. Under 25 words. No red, no label, no padlock. Next is gone for this entry. She taps Text. Where she would leave: if the card is a modal she cannot type past, if the quote is wrong, or if a lock line appears below it. Trust point: the card quotes her, it does not name her. Voice: "It heard me and it did not make a scene."

**Nils, the skeptic.** Sees the Field and one sentence in Next, 14 words. First test: what is this, what does it want. He reads the Maybe claim, sees the quote it came from, and taps Why. Six rows, the first three open, each with his own words and a date. He trusts the Not yet and Nothing recorded rows because they are empty and say so. He leaves if any row is filled from a guess without a "The instrument guesses" lead. Voice: "Show me where it got that. Okay. It did."

**Camille, somatic practitioner.** Sees the claim row and presses In my words after Not me. That path exists and is visible one level down. She wants the data page: Stays, Leaves, Delete, and the list of who can see this record, read from grants. She trusts a list that can be empty. She leaves if the page is one tab deeper than the profile sheet or has a constant where grants should be. Voice: "I can hand this to a client because I can see who sees it."

**Whitney, phone only.** At 390 wide she gets the Field, a plate, one Next with one primary button. The right rail is a sheet, not a column. Claim Why opens as a bottom sheet. Targets are 44 by 44, 8 px apart. Where she stops: any screen needing two thumbs, a rail that pushes the centre off, a chain longer than three open rows. Voice: "I only have my thumb and ten minutes."

**Renata, the operator who wants the chain as a number.** Looks for a score. Finds Said, Heard, Maybe, Felt, Changed, Confirmed, with a count of distinct days per rung, never a total. This is the point where she either learns to read the chain as sentences or leaves. The standing ruling holds: a reading is not a score. I give her one thing: the counts are checkable, so she can add them herself. Voice: "Give me the number." Honest result: we lose some of her, by ruling.

**Gordon, refuses anything clinical.** Sees no clinical word on any card. Taps Not me on a Maybe. It goes to Set aside, listed, never counted, and the next Maybe is different. A No that works is his trust point. He leaves if Not me needs a confirm box, or if the care card ever names a state. Voice: "It took no for an answer."

**Sofia, needs the consent list.** The data page shows "People who can see this record" from grants, with a revoke on each. Empty reads "Nobody." She trusts the page if Delete reaches the unreadable copies and the outbox, which A11 does. She leaves if the page says "Leaves" with nothing listed, or if the encrypted export has no restore drill. Voice: "Show me the list, then show me it empty."

**Trey, the quiz tourist.** Four seconds in. He sees a quiz result, not the loop, and a Next slot he did not ask for. If Next says "Write one sentence about it", he does. If it says a feature name, he is gone. Gate: no feature name in Next (A12 test). His first useful thing must come in under four taps and under 40 words. Voice: "Is this the one with the body map? ok one sentence."

## 3. Unified quality, out of 100

**72.** Up from my earlier sense of the proposal because it now has one grammar for the screen: four slot labels, closed row names, one verb set. It stops short for three reasons.

1. **Nothing has been tested with a person.** The care card, Not me and the Why chain are drawn in words only. Five testers will move this score more than any slice.
2. **No writer exists yet.** The claim row is the first writer; until A13 ships, the chain reads "Nothing recorded" on every real record and looks broken, not honest.
3. **Weight is unmeasured.** DOM is 3,998 nodes against a 3,000 budget, typing is 79 ms median at 1000 words under 4x throttle, and my choice counts are a day old.

## 4. Final grade

`GRADE: 70/100` (pass 1 58, pass 2 64).

Moved up: the merge adopted my slot grammar, the stage tile is gone, the care card is three outcomes under 25 words, and the claim row is the first writer. Moved down a little from my own optimism: the gift ruling keeps a take-away moment, "Continue" is untested in care, and the ring has no owner. Built as panels beside the old ones I would score it 45. Built as replacements, about 75.

## 5. My part of the slices

Ids follow the technical director. Files "must not touch" always includes the TAB integers, `engine/core.js` tab order and `source.html`. I add A0, A14, A15, A16. Hot files: `ui/storyui.js` and `engine/schema.js`.

| Id | Name | Goal | Changes | Must not touch | Gate | Size | Unlocks | MVP | ICPs feel |
|---|---|---|---|---|---|---|---|---|---|
| A0 | Re-measure | One dated table of choice counts, nodes, typing p95 on `65ed759` or HEAD | `tools/` script writing to `MONITOR.log` | all product code | the table exists, stamped with commit and md5 | S | every budget below | MVP | none, but nobody argues from stale numbers |
| A1 | Typing floor | Paint in one frame, parse after a 150 ms pause | `ui/storyui.js` (`stRefresh`) | engine, record | `tests/perf.js`, p95 at or under 16 ms at 1000 words, 4x | S | A4, A5 | MVP | Marta: no lag. Whitney: no stutter |
| A5 | Care register (UI half of A4) | Quiet layout, card under 25 words, Call, Text, Continue, "Quiet is on for this entry. Turn it off." always shown | `ui/storyui.js`, CSS | commit semantics, Ritual, Compass, record | `tests/functional.js`: card shows, Continue works, nothing stored, choices on screen fall; `tests/design.js` for 18 px body and 48 px buttons; five person check on the word Continue | M | A12 knows when to hush Next | MVP | Marta trusts it, Gordon sees no label, Nils sees no theatre |
| A12 | Next slot | One sentence, 14 words (12 in care), one primary button, Not now holds 7 days, replaces four doors and three cards, rail becomes Next, one live Maybe, then the seven accordions folded | `ui/component.js`, `ui/summary.js`, `ui/railtiles.js`, `engine/loop.js` | the Compass and Ritual pages, `loopRead` internals (A12's engine half) | strings "Day", "of 90", a stage name and any feature name never render; exactly one Next per surface; Summary first viewport 12 choices or fewer; Field loaded 30 or fewer | M | A13, A16 | MVP | Trey, Whitney, Diane get one act |
| A13a | Claim row | Quote, claim in "may" form, Fits, Not me, Why; Not me goes to Set aside and changes what shows next; 10 second Undo in place | `ui/imprints.js` (the imprints panel), one hook in `ui/storyui.js`, `engine/trace.js` calls from A8 | DOM total up; no new store | `functional.js`: Not me changes the next Maybe; the row is under 300 nodes net; one live claim per surface; no claim before a quotable sentence exists | M | A13b, A8 first writer | MVP | Gordon, Derek, Sofia |
| A13b | Why chain | Six closed rows, top three open, plain list, bottom sheet at 390 | `ui/imprints.js`, CSS | canvas (never), hover only (never) | every row leads with its verb; empty row reads "Nothing recorded."; Confirmed fills only after a tap or a meter line | M | Renata's checkable counts | MVP | Nils, Renata |
| A14 | Lock fold and gift end | One lock line per layer group (target 3 or fewer on the first Field screen, about 9 now); gift-end screen says what is kept and what changes, before it happens | `ui/lock.js`, `ui/plans.js` | `engine/plan.js` rules, any care card (no lock, checkout or upsell there, ever) | `tests/locks.js`: lock count per screen; no lock inside the care card; downgrade copy names ground, record, reruns | S | A9 copy | MVP | Nils sees no padlock wall; gift end does not read as a take-away |
| A15 | Data page | Stays, Leaves, Delete in two states, about 40 words, in the profile sheet, "People who can see this record" from grants | `ui/account.js`, `ui/panels.js` | no tenth tab; `engine/privacy.js` (A3 owns the table) | text is generated from the `PRIVACY` table; a missing key fails the build; delete then scan finds nothing | M | A10, A11 shown to people | MVP | Sofia, Camille, Gordon |
| A16 | Loop ring | Four quarters, the four ruled words, each lit from the newest dated act, dim after 14 days of none; art seat draws it | `ui/rings.js` or `ui/avatarui.js`, art seat's asset | any stage, number or day | no digit or stage name in the ring's markup; ring closes, never a list | M | the avatar from dated facts | later (after A12) | Angela, Diane: a circle, not a staircase |

Merged duplicates: creative's slice 1 and technical's A4 and A5 are one safety line (A4 engine, A5 mine). Creative's slice 7 and technical's A13 are my A13a and A13b. Creative's slice 8 and technical's A12 are my A12. The data page is A15 on top of A3, A10, A11.

## 6. The order, and what runs in parallel

1. **Parallel, first:** A0, A1 (storyui), A2 and A3 (engine, privacy table, no UI), R0 to R3 (server repo).
2. **Then series on `ui/storyui.js`:** A1, then A5 (A4 engine can finish in parallel because it touches `engine/` only), then the one hook for A13a. A6 (reading) runs on `engine/` in parallel with these.
3. **Parallel with the storyui series, different files:** A14 (`ui/lock.js`, `ui/plans.js`), A15 (`ui/account.js`, `ui/panels.js`).
4. **After A8 writes real evidence:** A13a, then A13b in series (same file), then A12 (needs `loop.js` and the journey worktree merge), then A16.
5. **The five person test** runs on A5 and A13a before A12 is built. If Continue fails, change the word, not the layout.

Series rule: A1, A5, A13a (hook) share `ui/storyui.js` and `engine/schema.js` is shared by A2 and A9 and must not run at the same time.

## 7. Question for the owner

None. Taken as defaults, he can overrule: Continue stays, pending the five person check; the gift stands as he ruled, with honest end copy; the loop ring is a later slice.

Proof the work moved: 4 of 5 testers name the Next act in 4 seconds, find Not me in 10, point to the sentence a claim came from, and in care say they were not labelled. Instrument: Not now rate per Next sentence; Not me rate per claim; taps from Next to first written sentence; Why opened versus Fits tapped; care card Continue versus Pause; time from card shown to a tap, with no text stored.
