GRADE: 58/100 (was 68)

Seat: June Okonkwo-Lund, copy and typography. Pass 2. I read all eleven other pass 1 reports and re-checked five claims in source.

## 1. AGREEMENTS

- **Sentence case broken by the stylesheet.** Art, Brand, Creative, Marketing, me. `head.html:1288` capitalises 15 label classes.
- **The avatar is not the centrepiece.** Ten seats. Systems has the sharpest proof: the word avatar appears in none of the files that draw charge.
- **The loop is a row.** All twelve seats. Confirmed.
- **No type scale.** Nine seats. Counts run 26 to 43 because we counted different things: I counted pixel sizes in the sheet (31), Tech counted every size form (43), Art counted rendered text (30). Nobody found a scale.
- **The unread screen prints findings.** Marketing, UX, me. I only flagged the zeros. Marketing found the worse part and I checked it: `ui.js:1369` prints "Heaviest Root 0.0" and "Most shut Truth at the throat" for a person who has entered nothing. Default data dressed as a reading.
- **Locks read as a shop.** Brand, Marketing, UX, Sales, Game. `lock.js:171` makes "Locked on your plan" the first sentence of a surface.
- **390 pill over the zoom buttons.** Eight seats. Layout's job. The words are right.
- **Colour carries too many meanings.** Art, Systems, Creative. My side is in section 4.

## 2. DISAGREEMENTS

- **Case. Sentence case wins.** DECISIONS.md line 351 and near line 1116 record "headers take title case". CLAUDE.md says sentence case. My reasons:
  - `text-transform:capitalize` cannot do title case. It prints "Need To Be Need". Title case keeps "to" and "be" small.
  - It runs on 15 classes. Most are slot labels, not headers.
  - The `.plain` escape exists because it keeps eating names. A tool that needs a hatch is the wrong tool.
  - One rule can be gated. Two cannot.
  - It flips back in one line.
- **Avatar behind a tier lock.** Sales wants a sealed door. Game and Innovation want a plain free figure. I side with Game and Innovation. A promise cannot be the upsell. The detail (registers, masks) stays on the tier.
- **Price in the lock tooltip (Sales).** No. The tooltip says what opens and on which tier. The price lives on the tiers sheet.
- **Teaser count, "3 saboteurs read" (Sales).** No. A person's own reading used as bait is a commercial number in a Reading slot.
- **"Your ceiling is N. You read M." (Brand, Creative).** Right idea, wrong sentence: two numbers is a count against a total. Draw an arc, label it "Headroom", print one number, the gap. Gate on a confident reading.
- **"You are already the most powerful version of yourself" on the first screen (Brand).** No. It is abstract, James reads coaching, and the instrument cannot back it before a first reading. I take Marketing's line: "There is more running you than you can see."
- **"The clock runs" for Games (Brand's rewrite).** Game's hard line bans timers. If the game is untimed, the sentence is false.
- **Ring loop, skin or redesign.** A skin, if the four words stay printed on the ring at 390. Icon only fails Angela.
- **Source OS contrast. Art says flag, Brand says show him.** Fix it. Keep the caps, raise the line to 4.5 to 1 on every lighting. A line nobody can read is not a lockup. I log the measured ratio (1.36 on Dark) as a fact in pass 3.
- **Seat hues keep place, state colours separate.** Agreed with Art and Systems. Copy corollary: a state word takes a state ink, never a seat hue. "Gaining" measures 1.86 to 1 on Snow, so a Value fails.
- **A second numeral face (Innovation).** No. Tech prices it at 60 to 70 KB with a canvas fallback risk. Inter has tabular figures and slashed zero as features. Turn them on, and check the embedded subset kept them.

## 3. WHAT I MISSED

- **Counts against a total are everywhere, not two.** Checked: `ui.js:1383` to `1394` ("integrity 6.2 of 10" and three more), `summary.js:110` and `:114`, `rings.js:1089`, `quiz.html:519` ("of the hundred points"), `:454` and `:459` ("out of ten").
- **Stale facts where money is asked (Sales).** `buy.html:367` says 50 patterns for a referral. Ruled 25. `buy.html:308` says "a tier is a rate of new ground and nothing else", false since 1 October. This outranks every typographic fault.
- **Two readings of one person disagree (Creative, Game).** Field says Gaining at 62. Summary says nothing is held above the line. A Reading must name its line.
- **A person's own quote sits in the rail unlabelled (Brand).**
- **Games talks like a guide (Brand).** "Turn your senses inward", "Notice where reading feels contracted".
- **Landing and app disagree on Play and Flow (UX).** The landing page changes, because the app's doors are what a person presses.
- **"Tier" names three ladders (Art).**
- **Dead ends (Game).** An empty Release panel gives a reading and no door.

## 4. THE SKIN, TOGETHER

**Type scale.** Six steps, `--fs-1` to `--fs-6` (Systems' names):

| Token | px | Used for |
|---|---|---|
| fs-1 | 11 | floor: tick marks and chrome only |
| fs-2 | 13 | menu, label, definition, refusal |
| fs-3 | 16 | reading, instruction, rail value |
| fs-4 | 22 | title, section value |
| fs-5 | 32 | hero value |
| fs-6 | 48, one clamp | the avatar number |

I drop my pass 1 size of 15. UX measured 0 of 73 Field text items at 16, and James is 57.

- **Weights** 400, 500, 600. **Line height** 1.45 reading, 1.2 values. **Letter spacing** 0 except the ruled lockup. **Numerals** tabular, slashed zero.
- **One class per bucket:** `.t-menu`, `.t-label`, `.t-value`, `.t-def`, `.t-do`, `.t-read`, `.t-refuse`. Each fixes size, weight, case.
- **Case:** sentence. Proper names keep capitals.
- **State ink:** `--cq-ink` per lighting at 4.5 to 1 (Art's token). Alarm red is for a measured wrong, never a word.
- **Concept registry (Systems' `things.js`):** one row per spine noun, with a one line definition. I write the missing ones: imprint, pattern, seat, story, ritual, avatar.
- **Names.** The number is "weight". An occupied address is "held". A finished one is "released". A missing one is "not read yet". Coherence levels are "band", paid levels "tier", chain levels "step". The figure is "Avatar". The masks page is named for what it holds, if Systems confirms `TAB.MASKS`.
- **Motion copy (Animation).** One Definition: "The ring breathes when it has a reading and holds still when it has none." Boot skip, an Instruction: "Press any key to skip."

| Old | New | Reason |
|---|---|---|
| Heaviest Root 0.0 / Most shut Truth | a dash each, then "There is more running you than you can see. Write one story. The instrument reads where it is held." | Unread shows no finding. Value, Reading, Instruction. |
| Locked on your plan | Opens on tier three. | A refusal naming no failure becomes a fact. |
| Your integrity is 6.2 against a clean ten. | Integrity 6.2 | Label, Value. Band state beside it. |
| integrity 6.2 of 10 | integrity 6.2 | No total. |
| Answered: N of the hundred points. | N answered. | Same. |
| What are we writing about today? | What happened today? Label: Question | No "we". |
| 0 days | a dash | Zero is a claim. |
| Nothing is held above the line yet, so there is nothing to release. | Nothing is held above the line. Write one more sentence, or hold a statement. | Reading, then one door. |
| unlabelled quote | label: In your words | The product never says I. |
| Sat, how the field behaves | How the field behaves (Sat) | Plain first. |
| you get 50 patterns when they join | you get 25 patterns when they join | Ruled round OI. |

**Agree first:** Systems (classes, registry). Tech (codemod, 17 canvas font strings, gates 4 and 8, `collide.js`). Art (`--cq-ink`). Brand (avatar noun, wordmark). Sales (lock strings). Game and UX (empty states, rail).

## 5. REVISED GRADE: 58/100 (was 68)

Pass 1's table summed to 60 and I graded 68 on the strength of the gate. Generous. The table now reads 55: one word per concept 5 to 4, bucket purity 6 to 5, truth 8 to 6, empty states 7 to 6. I add 3 because the gate holds the hard rules at zero.

## 6. TOP 5

1. **Truth sweep first.** Stale `buy.html` facts, every "of 10", the unread verdicts, the two-readings contradiction. S. James, Derek, S3, S8.
2. **Delete `capitalize`.** S, M with the `.plain` sweep. Derek, James, S3.
3. **Six step scale, three weights, tabular numerals.** M, by codemod (a script that rewrites every size at once). All, most Angela and James on phones.
4. **Unread screen and lock copy.** One promise, one door, "Opens on tier N". S. Angela, S1, S8, S7.
5. **Concept registry with definitions.** One word per concept. M. Derek, Marcus, S4.

## 7. QUESTION FOR THE OWNER

None. Decisions: sentence case wins because the transform cannot deliver title case and one flag flips it back. A plain avatar is free. No price in a lock tooltip. No teaser counts.
