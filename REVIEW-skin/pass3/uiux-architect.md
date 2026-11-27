GRADE: 62/100 (pass 1 was 51, pass 2 was 47)

Dani Sorensen, UI UX architect. Pass 3, 2 October 2026. I re-read `1600-00-first-screen`, `390-00-first-screen`, both loaded Field shots, `startHTML` in `ui/component.js`, the rail code in `ui/ui.js`, `#secbar` in `shell/body.html` and `ui/lock.js`. I own the unread screen, the ring, the lock fold and the right rail order.

## 1. THE PROPOSAL IN THREE SENTENCES

One light figure sits at the centre of Field, Summary and Avatar with no number on it. One ring closes the four loop words in the bar, one grammar of colour, type, shape, motion, lock and word runs under it, and the unread state becomes its own screen. The merge bent two things: "doors stay while unread" never says where the doors sit (today 12px text in the right rail, below the fold at 390), and "locks to three or fewer" never says which three.

## 2. THE ICP ROOM (ten seconds on the Field)

- **Marcus, founder, level 7.** Sees a still pencilled figure, one sentence, four doors. Presses "Write what happened". Stays. "Fine. Where do I see it move?" Leaves only if the loaded Field contradicts Story (Field says Gaining, Story says nothing is held).
- **Whitney, phone only, level 5.** Sees the ring button, the sentence, four doors, no scrolling. Today she sees a pill sitting on the zoom buttons and the doors below the fold. Presses the first door. "It does not sound like it is selling me."
- **Nils, design skeptic.** One figure, one ink, no padlocks, a dash where a zero was. Looks for the trick. Stays a minute longer. "At least it did not fill the screen with dials." Leaves if the figure bends and nothing names why.
- **Camille, somatic practitioner.** Sees the quiet fifth door, "Open the tables", and takes it before the four. "Good. I can use these words with clients." She is the one ICP who skips the four, so the fifth must be free.
- **Marta, acute distress.** One sentence, no verdict. "There is more running you than you can see" can land as a threat in a bad hour. The privacy line must sit one eye jump below it, no fold between. "Is this going to tell me what is wrong with me?"
- **Renata, operator.** Wants the cost. Takes "Read nine sentences" (for someone who cannot think of themselves as the problem). Stays if Summary leads with the cost. "Skip the poetry. What does it cost me?"
- **Trey, quiz tourist.** Arrives with a four letter type and a score. Sees no number anywhere. "Where is my score?" Leaves unless the quiz stops saying scores first.
- **Sofia, loves the open tables.** Opens the fifth door, stays an hour. "Here is the part I would pay for." The tables stay free, one tap.

## 3. UNIFIED QUALITY: 64/100

Three biggest gaps left:
1. **One reading, two answers.** Field says Gaining, Story and Summary say nothing is held. A skin cannot fix an engine fact.
2. **Day 2 has no pull.** The ring lights a quarter by the newest act, but the home screen never asks for tomorrow. Push is planned, not built.
3. **The unread state inherits a layout built for a read person.** Until it is its own layout, the tool strip, rail and zoom buttons each need a special case.

## 4. FINAL GRADE

GRADE: 62/100 (pass 1 was 51, pass 2 was 47). Up 15. The unread screen, ring and lock fold are now specified to the pixel, and the free figure answers the centrepiece complaint without breaking the ruling (it names the masks, not the figure). Not higher: nothing is built, and first screen choices only fall from 49 to about 18 (about 12 of those are chrome that never changes).

## 5. MY PART OF THE BUILD SPEC

**A. Unread Field, M.** Files `ui/ui.js`, `ui/component.js`, `ui/fieldbar.js`, `shell/head.html`. Shown when `r.unread`.
- Order, both widths: figure (pencilled, still; 160px at 390, 320px at 1600), hero, four doors, fifth door, privacy line.
- Hero: "There is more running you than you can see." 28px at 1600, 20px at 390, weight 500, measure 34rem.
- Doors: the existing `STARTD` copy. Title 16px weight 600, second line 16px weight 400 at 70 percent ink (it tells a person which door is theirs, so it keeps the floor). 44 tall minimum. A row of four at 1600, a column at 390.
- Fifth: quiet text button "Open the tables", under it "Every address and definition. Free to read." Never locked.
- Privacy, 13px, directly under the doors: "What you write stays on this device."
- Gone while unread: the tool strip (folded behind one 44px "Tools" button, so nothing is hidden without a way back), Accuracy, the "not read yet" pill, zoom buttons, the "You" card with its zeros, all padlocks in the stage. The rail closes with its toggle visible, labelled "Reading". The sub bar keeps Character with its one sealed mark, because a slot stays.
- Gate: at 390 by 667 the four door bottoms sit at or above 667; zero lock marks in `#cv` while unread; no text node equal to a bare zero. `tools/monitor.js` already walks a blank profile at both widths, so the asserts go there.

**B. Ring, M.** Files `shell/body.html`, `shell/head.html`, `ui/ui.js`.
- 1600: a racetrack outline (a closed pill track, stroke 1.6, round caps, ink at 60 percent) drawn around the four existing buttons, with one arrowhead returning from Embody to Discover along the bottom edge. A separate ring mark beside the words would read as a fifth button, so none is drawn. Buttons stay 44 tall.
- Current section keeps the existing pressed fill. Newest dated act is one 6px ink dot on the track under that word. Two lit things, two forms, never two colours.
- 390: replace the "Play | Field v" row with one 44px button, a 24px four-arc glyph with the current arc filled, then "Play, Field". It opens a sheet of four stations (56 tall; icon, name, the one line already in each button's `title`), the current station open to its tabs. It closes on pick or outside tap.
- Motion: once, 320ms, on a section change (a gate 12 duration; I withdraw my 280).
- Gate: `tests/functional.js` presses all four stations at both widths; `tests/collide.js` extended to any two interactive rectangles, which catches today's 390 pill over the zoom buttons.

**C. Lock fold, S.** Files `ui/lock.js`, `ui/fieldbar.js`, `ui/railtiles.js`.
- One mark: a sealed double ring, ink at 80 percent, never grey, no padlock. One line: "Opens on tier two". One card, the existing tier card, opened by every fold.
- Four locked tool chips fold to one chip at the strip end. Four locked rail chips fold to one rail row. Sub bar keeps one mark on Character. Nine marks become three.
- Gate: count marks in the first viewport of the loaded Field, at most 3, both widths.

**D. Right rail order, S.** Files `ui/ui.js`, `ui/component.js`. One name, "Reading", replacing "Energetic Summary", "Reading" and "Root Energetics". Order for the job "what is running me and what does it cost":
1. Name and the band sentence, 16px.
2. By weight, three rows.
3. By assemblage point, three rows.
4. "In your words" quote, one line, tap to open.
5. The sealed fold row.
Today the quote is third and pushes both lists down about 100px.

**Build order.** (1) 390 collision fix, S. (2) Lock fold, S. (3) Rail order, S. (4) Unread screen, M, after the figure lands. (5) Ring, M, after one-tab sub bars are dropped.

## 6. RANKED RECOMMENDATIONS

1. Unread screen as its own layout. M. Whitney, Marta, Trey, Camille. Redesign of one state, built on the skin.
2. Fix the 390 pill over the zoom buttons. S. Whitney and every phone. Reskin.
3. Lock fold to three marks. S. Marcus, Nils, Renata. Reskin.
4. Rail order and one name. S. Renata, Marcus. Reskin.
5. Ring as racetrack plus the 390 sheet. M. Whitney, Marcus, Nils. Reskin.
6. Make Field and Story say one thing. M. Marcus, Nils. Redesign (engine).
7. Day 2 pull: one home line naming tomorrow's ritual. M. Whitney, Marcus. Redesign.

**Instrument:** seconds from boot end to first door press by door and width; share who press the fifth door first; share who close inside ten seconds; taps on the 390 ring before the first section change; locked marks pressed in session one. Test with five people: two at level 5, one at 4, one at 8, one practitioner.

## 7. ONE QUESTION

None.
