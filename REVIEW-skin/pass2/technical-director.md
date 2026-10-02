GRADE: 60/100 (was 56)

Seat: Anders Kjeld, technical director. Pass 2. I read all eleven other pass 1 reports and ran experiments on copies of `source.html` in my scratchpad. The repo is untouched. Headless Chromium, no GPU: milliseconds rank things, they are not device figures.

## What I measured since pass 1
- **Type scale by codemod** (a script that rewrites many places at once). One regex moved 275 of 660 `font-size` declarations onto seven steps: 11, 12, 13, 14, 16, 20, 28. `design.js` 186 of 186, `collide.js` 351 of 351. Text sizes actually drawn on a loaded profile, all tabs, 1600 wide: 17 before, 10 after (the rest are display sizes). Page height moved 0.5 percent and no text wrapped that did not before. A five step scale (11, 14, 16, 20, 28) also passes both, but moves height 2.2 percent and wraps five more strings.
- **Sentence case.** Deleting the one `capitalize` rule breaks only gate 17, which crashes at its first assert. With it skipped, 179 of 179 pass. Cost: one rule, one named gate edit.
- **The Aura prism figure** (best mockup, `mockups/character-aura/aura-1.html`). 29 to 35 ms a frame at 1600 wide, 10 to 11 ms at 390. Cost is flat from 1,500 to 11,000 points, so the price is canvas area and the blur chain, not points. The Field uses 4.2 ms a frame in the same box.
- **Garbage in the Field loop.** The Field makes new objects every frame. Sampled, 2.7 MB a second; a coarser poll of heap size read up to 16.7 MB a second. The two disagree on size, not on rank. The worst makers are `rgba()` and `mixc()` in `ui/component.js:809`, which build a string or array on every call, then `nodeCol`. Story makes none. That explains the 3 to 5 ms p95 in pass 1. My rule is zero per frame.
- **Compass on a fast screen.** `coneTick` in `ui/cone.js` adds a fixed step per frame. At 120 Hz it spins and draws twice as often. At 7.3 ms a frame it cannot hold 120 Hz (estimate).

## 1. Agreements (two or more seats, independent)
- **Avatar is not on screen.** Brand, Creative, Game, Innovation, UIUX, Systems, Marketing, Sales. Systems adds the key fact: the word avatar appears zero times in the Field, Body and Compass renderers. So the figure needs a shared data path, not only a drawing.
- **The loop is a row.** Art, Brand, Creative, Game, Innovation, UIUX, Marketing. Confirmed in `shell/body.html`: four buttons plus a divider.
- **Colour has two owners.** Art, Systems and I. CSS and `canon.js` both hold the seven seats. Nothing checks they agree.
- **No type scale.** Eight seats. Declared sizes run 26 to 43 depending on who counted. Drawn sizes are 17.
- **Start Case against sentence case.** Brand, Creative, Copy, Art, Marketing.
- **Locks read as a shop.** Brand, Marketing, UIUX, Game, Sales. One seam, `ui/lock.js`, draws them all.
- **390 overlap.** Seven seats. I checked the shot: the "not read yet" pill sits under the zoom buttons in one row.
- **The unread card prints verdicts.** Marketing, UIUX. Confirmed on `1600-00-first-screen.png`: "Heaviest Root 0.0", "Most shut Truth".

## 2. Disagreements, and my side
- **Avatar behind a lock (Sales says keep it, Game, Innovation, Brand say open it).** I take: free sees a fixed pre drawn figure, tiers keep the detail. A pre drawn figure costs the same to free and paid, so cost is not a reason to lock it.
- **Ring loop: skin or redesign (Creative says redesign, Art, Brand, Game say skin).** Skin, if the four `.secb` buttons stay and a closed ring with a return arrow is drawn behind them. That keeps tap size (gate 8). Moving the buttons onto arcs is the redesign, and it fails gate 8 at header height.
- **Source OS contrast (Brand, Copy, Art).** I side with the ruling. The owner gave `#343434` three times (`head.html`, round LK), and a logotype is exempt from contrast rules. Gate 4 already exempts class `bs`. Leave it.
- **Hue is place, state separates.** I agree with Art and Systems. Do it in tokens first, S. In `canon.js` it is M.
- **Start Case or sentence case.** Sentence case wins. The recorded ruling (`DECISIONS.md:353`) says a capital on every word. `capitalize` cannot do that well: it prints "Of The" and "To". The `.plain` hatch and gate 17 exist only to repair it. `CLAUDE.md` says sentence case. Keep the switch as one token so the owner can flip it back in one line.
- **Type scale values.** Art wants 12.5, UIUX five steps, Copy 15. I reject half pixels (the drift), five steps (measured) and 15 (it goes to 14 or 16 per class).
- **Animation wants a "press to skip" line.** No. The owner removed it on 21 September, and gate 14 asserts none exists. The gesture stays.
- **UIUX wants the streak ring to open with one segment filled.** No. It is a measured record. Filling it is a false reading.
- **Systems wants the three palettes deleted from `canon.js`.** No. The engine cannot read CSS (`hostfree.py`). Keep them as defaults, let the UI override them.

## 3. What I missed
- Art: alarm red has five jobs and Throat sits 0.029 from the accent, so my token skin must separate roles, not only swap a palette. `--gold` is already an alias of `--accent`: the rename is find and replace.
- Animation: the Compass frame rate bug and 23 `transition:all`.
- Marketing: an unread person pays 4.2 ms a frame for a dead dial.
- Sales: one seam draws every lock.

## 4. The skin, together (my part)
- **Type:** `--fs-1..7` = 11, 12, 13, 14, 16, 20, 28. Display clamp 40 to 48 for the avatar number. Weights 400, 500, 600. Inter is one variable file, so dropping weights saves no bytes. `button{font:inherit}` fixes the Arial in Summary. Copy's seven roles map onto these.
- **Radius:** 4, 10, 16, pill, circle. Spacing `--sp-1..8` = 4, 8, 12, 16, 20, 24, 32, 48, used in new code only.
- **Colour roles:** `--accent` is control only. `--good`, `--bad`, tiers move to lightness steps. `--cq-ink` and `--stage` per lighting. Seven seat tokens on all seven lightings (Glass white has none). Canvases read them once per lighting change into a preallocated object. Alarm stays `#FF2E1F` for measured wrong and the record dot.
- **Motion:** keep the four durations 0.12, 0.22, 0.32, 0.42 s and three eases. Land, tab travel and selection use 0.32. One new named step for the one second dial, with a gate 12 edit. Elapsed time, `dt` clamped at 0.1 s, everywhere.
- **Icons:** one CSS rule, round cap, round join, stroke 1.5 (Art measured 1.0 to 1.5). Punch keeps its fills.
- **Cost ceiling for any skin part:** 0.5 ms a frame of script, 60 static SVG nodes a surface, no backdrop, no blur over a large area, `shadowBlur` under 20 a frame.
- **Agree first:** type roles with Copy and Art. Colour roles with Art and Systems. Motion verbs with Animation. Ring and figure with Creative, Brand, UIUX. Lock grammar with Sales and Game. Unread screen with Marketing and UIUX.

## 5. Revised grade: 60 (was 56)
- Up: type scale 3 to 7 (proved cheap and safe). Gate resilience 6 to 7 (every clash is now named, below).
- Down: frame budget 7 to 6 (garbage in the Field loop).

## 6. Top five
1. **Canvases read tokens, and `rgba` stops allocating.** M. One fix removes the two colour owners and the Field's garbage. Moves S7 on old phones, Marcus, S3.
2. **Seven step type scale by codemod, plus `button{font:inherit}`.** S to M. Moves S3, Marcus, S16, Angela on phones.
3. **A pre drawn avatar figure** on the Field hub, Avatar tab and Summary header. Drawn once per reading change, breath by CSS opacity. M for the drawing, M more for the data path. Moves S6, Derek, Diane.
4. **Stillness while unread, fix the 390 overlap, cap Compass to elapsed time.** S. The wheel draws once while unread (the reduced motion path already does this). Moves S7, S8, S13.
5. **Sentence case.** S. One rule, one named edit to gate 17. Moves S3, Marcus, Angela.

## 7. Question for the owner
None. Decision: sentence case wins, with a one line revert.

---

# Appendix: every other seat's recommendation, costed

S is under a day and one or two files. M is two to four days or one codemod. L is a week or touches engine data or a schema. "Fits" means design, collide, locks and functional gates pass, with named edits where shown.

**Cannot fit the gates as written**
1. Animation, "press to skip" line. Gate 14 asserts zero `.boot-skip`. Also an owner ruling.
2. Animation, dial `transition` of 1000 ms. Gate 12 allows 0.12, 0.22, 0.32, 0.42 s. Fits as an animation or with a named fifth step.
3. Animation, boot trim and boot personalisation. Gate 11 pins boot timing (booted near 5.4 s). Personalisation also reverses "no flag is stored" and reads the profile before boot.
4. Brand, locks with no padlock. `tests/locks.js` asserts the padlock mark. Marketing and UIUX, one "Unlocks" chip per surface and locked tabs leaving the bar, hit the same test plus tab counts.
5. Copy, Brand, Creative, delete `capitalize`. Gate 17 crashes. Named edit.
6. Art, delete `TIERCOL`. Gate 15 reads `TIERCOL[tier]`. Changing values to lightness steps fits.
7. Systems, delete palettes in `canon.js`. Engine is host free. Fits as defaults.
8. Innovation R1 and Game 1 as a live figure. 29 to 35 ms a frame beside the Field's 4.2 ms. Fails my 8 ms budget and the gate 13 frame backstop of 30 fps once stacked on the wheel. Fits pre drawn.
9. Aura mockup panels use `backdrop-filter`. Gate 13 forbids it over the Field.
Not gates but not buildable: UIUX home is the avatar (reverses the 19 September ruling), UIUX streak pre fill (false record), Systems chain join keys (Schema v2, the owner's).

**Art:** seat hues for place only M. Chain tiers one hue S. One CQ colour M (engine data acknowledged by `equiv.py`). Throat shift S. Alarm roles S. Stage tokens M. Type scale M. `--gold` rename S, keep the alias for `funnel/`. Rail CTA S. Loop ring M. One seat sheet L. Figure L.
**Brand:** one avatar word S, the figure L. Loop ring M. Source OS S, leave. Ceiling line on the Field S. Sentence case S. "In your words" S. One mark hue S. Game copy S. Fewer gradients S. Embody as person M.
**Creative:** ceiling arc M (one stroke, under 0.05 ms). Seal figure M to L. Scale M. Neutral loop ring S to M. Name the threshold S. Games card and rail follows surface M. Hide Pace and Patterns S.
**Game:** lit figure M pre drawn, L live. Commit landing beat S to M (CSS transform). Marks tray S to M. Empty states S. Closed loop M. Kind ending S. One lock grammar M. 390 fix S. Awards, daily page, sixty second ritual L, engine.
**Innovation:** set hand dial M. Pencil to ink M (hoist the dash arrays, dashed strokes cost more to paint). Sonar waterfall M drawn once per data change, L if interactive. Transcluded reading L. Goniometer M (silent by default, so few see it). Cross bearing M. Lamp test S to M, after `booted`. Numeral face M, about 10 KB. Figure as field L. Loop as dial L.
**Animation:** release as a field M. Compass on `dt` S. Selection floor S. Lock periods S. Asymmetric ease S, two `exp` a frame. Tab indicator S to M. `transition:all` x23 S to M. Stillness switch S (`REDUCED` is a mutable `var`, 78 uses). One clock M. Breath purity M.
**Marketing:** promise sentence S. Unread panel S. Locks one per surface M (named edits). Measurement note up S. Privacy line S. Sentence case and clipped tab strip S. 390 first screen S to M. Unread as own stage M, and it saves frames.
**Copy:** case S, plus `.plain` sweep M. Seven sizes M. Three weights S. One word per concept M (`canon.js` is engine data). Retire "Source AI" S. Counts against totals S. Dashes S. Plain first lines S. Class per bucket L. Role tokens plus classes M.
**Sales:** sealed lock S (opacity under 1 still passes `locks.js`). Ghost silhouette M, pre blurred small layer. Tooltip price S. One tier card M. Sign in after pick L (the one network seam). Paywall scale S. Buy page column S. Gift recap S. Tier four door S.
**Systems:** type ramp S. Spacing tokens S, adopting them L. Hue split M. One seat source M. z, ease, alpha tokens S. Buttons and panels L. Icon stroke rule S, registry L. Avatar mark M. `tools/coherence.js` gate S to M. Concept registry L. Join keys L.
**UIUX:** ring M, on phone M more. Locks chip M. Five step scale M, not preferred. Zero states S. Rail closed while unread S, open when a reading exists, with no counter stored. Streak pre fill, no. Landing words S. Quiz footer S. Mobile readout S. Avatar home L, ruling. Embody regroup M. Level 4 and 5 lane L.
