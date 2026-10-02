GRADE: 58/100 (was 68)

Seat: June Okonkwo-Lund, copy and typography. Pass 2. I read all eleven other pass 1 reports and re-checked five of their claims in source.

## 1. AGREEMENTS (two or more seats, independent)

- **Sentence case is broken by the stylesheet.** Art, Brand, Creative, Marketing and me. `head.html:1288` capitalises 15 label classes.
- **The avatar is not the centrepiece.** Brand, Creative, Game, Innovation, UX, Systems, Art, Marketing, Sales, me. Systems has the sharpest proof: the word avatar appears in none of the files that draw charge.
- **The loop is a row.** All twelve seats. Confirmed.
- **No type scale.** Art, Brand, Creative, Innovation, Systems, Tech, UX, Sales, me. The counts run 26 to 43 because we counted different things. I counted pixel sizes in the sheet (31). Tech counted every size form, clamp and em included (43). Art measured rendered text (30). Nobody found a scale. Settled.
- **The unread screen prints findings.** Marketing, UX, me. I only flagged the zeros. Marketing found the worse part, and I checked it: `ui.js:1369` prints "Heaviest Root 0.0" and "Most shut Truth at the throat" for a person who has entered nothing. That is default data dressed as a reading.
- **Locks read as a shop.** Brand, Marketing, UX, Sales, Game. About nine to ten padlocks on the first Field screen. `lock.js:171` makes "Locked on your plan" the first sentence of a surface.
- **The 390 pill collides with the zoom buttons.** Eight of twelve seats. Layout seat's job. Copy only says the words are right.
- **Colour carries too many meanings.** Art, Systems, Creative. Copy side of it below, in section 4.

## 2. DISAGREEMENTS

- **Case. I take sentence case, and I name the conflict honestly.** DECISIONS.md at line 351 and again near line 1116 records "headers take title case, the stylesheet was right". CLAUDE.md says sentence case. My reasons:
  - `text-transform:capitalize` cannot do title case. It prints "Need To Be Need", "Who This Is". Title case leaves "to", "be", "of" small. The transform is not the ruling's own tool.
  - It runs on 15 classes. Most are slot labels, not headers. The ruling named headers.
  - The `.plain` escape exists because it keeps eating names. A tool that needs a hatch is the wrong tool.
  - One rule can be checked by a gate. Two cannot.
  - It is one line to flip back. If the owner wants title case on true page headers, it is written by hand into those strings and the gate holds it.
- **Avatar behind a tier lock. Sides: Sales (sealed door with a ghost behind it), Game and Innovation (free tier sees a small fixed figure), Brand (the centre cannot be sold).** I take Game and Innovation. A promise cannot be the upsell. The plain figure is free. The detail, the registers and masks, stay on the tier. This is a product ruling, so it goes to pass 3 as my position, not as a question.
- **Price in the lock tooltip (Sales rec 3). I say no.** The tooltip says what the surface shows and which tier opens it. The price lives on the tiers sheet. A price beside every padlock turns the instrument into a shop.
- **A teaser count, "3 saboteurs read" (Sales). No.** A count of a person's own reading used as bait is a commercial number in a Reading slot.
- **Printing the ceiling as "Your ceiling is N. You read M." (Brand, Creative).** The idea is right and the sentence is wrong. Two numbers in one line is a count against a total. Draw the ceiling as an arc (Creative's move). Label it "Headroom". Print one number, the gap. Gate it on a confident reading.
- **"You are already the most powerful version of yourself" as a first-screen line (Brand).** No. "Most powerful version" is abstract, James at level 3 reads it as coaching, and the instrument cannot back it before a first reading. Marketing's line is true of anyone and physical: "There is more running you than you can see." I take Marketing's.
- **Brand's Games rewrite "The clock runs."** Game director's hard line forbids timers. If the game is not timed, the sentence is false. Write only what the game does.
- **Ring loop: skin or redesign?** I call it a skin if the four words stay printed on the ring at 390. Icon-only fails Angela. Innovation's doubt about 30 to 55 year olds is the reason the words stay.
- **Source OS contrast. Art says flag, Brand says show him the number.** I say fix it. Keep the caps (ruled lockup), keep the hex on Dark if he insists, and raise the line to 4.5 to 1 on every lighting. A line nobody can read is not a lockup. I log the measured ratio (1.36 to 1 on Dark, about 1.5 on the panel) as a fact in pass 3.
- **Seat hues keep place meaning, state colours separate. Agree with Art and Systems.** Copy corollary: a state word (Gaining, Shut) takes a state ink, never a seat hue. Art measured "Gaining" at 1.86 to 1 on Snow. A Value nobody can read fails.
- **A second numeral face (Innovation).** No. Tech prices it at 60 to 70 KB and a canvas fallback risk. Inter has tabular figures and a slashed zero as font features. Turn them on. Check that the embedded latin subset kept them.

## 3. WHAT I MISSED

- **Counts against a total are everywhere, not two.** Checked: `ui.js:1383` to `1394` ("integrity 6.2 of 10", intention, pole, overshoot), `summary.js:110` and `:114` ("of 10"), `rings.js:1089` ("Most shut law. 6.2 of 10"), `quiz.html:519` ("of the hundred points"), `:454` and `:459` ("out of ten"). My truth score was too kind.
- **Stale facts on the page that asks for money (Sales).** `buy.html:367` says 50 patterns for a referral. Ruled 25. `buy.html:308` says "a tier is a rate of new ground and nothing else", false since 1 October. A wrong promise beside a price outranks every typographic fault I found.
- **Two readings of one person disagree (Creative, Game).** Field says Gaining at 62. Summary says nothing is held above the line. A Reading must name its line, or it reads as a bug.
- **A person's own quote in the rail with no label (Brand).** A first-person machine. Label it.
- **The Games card talks like a guide (Brand).** "Turn your senses inward", "Notice where reading feels contracted". Not our register.
- **Landing words and app words disagree about Play and Flow (UX).** The doors a person presses are the app's, so the landing page changes. If Brand's move (Embody opens to the avatar) lands, both change again, once.
- **"Tier" names three ladders (Art).** Paid, chain, coherence.
- **Dead ends (Game).** An empty Release panel gives a reading and no door.

## 4. THE SKIN, TOGETHER (my part)

**Type scale, values.** Six steps, named `--fs-1` to `--fs-6` (Systems' names):

| Token | px | Used for |
|---|---|---|
| fs-1 | 11 | floor. Tick marks and chrome only |
| fs-2 | 13 | menu, label, definition, refusal |
| fs-3 | 16 | reading, instruction, rail value |
| fs-4 | 22 | title, section value |
| fs-5 | 32 | hero value |
| fs-6 | 48, one clamp | the avatar number |

I give up my pass 1 size of 15. UX measured 0 of 73 Field text items reaching 16 px, and James is 57.

- **Weights:** 400, 500, 600. Drop 300 and 350.
- **Line height:** 1.45 for reading, 1.2 for values. **Letter spacing:** 0, except the ruled lockup.
- **Numerals:** tabular figures and slashed zero on every readout.
- **One class per bucket:** `.t-menu`, `.t-label`, `.t-value`, `.t-def`, `.t-do`, `.t-read`, `.t-refuse`. Each picks one size, one weight, one case. Systems' component classes (button, panel) sit under these, not beside them.
- **Case:** sentence case. Proper names keep capitals. Wordmark caps stay as ruled.
- **State ink:** each lighting gets `--cq-ink`, lifted to 4.5 to 1 (Art's token). Alarm red is for a measured wrong, never for a word.
- **Concept registry:** I agree with Systems. One row per spine noun: word, glyph, colour token, one-line definition. I write the ten definitions: imprint, pattern, seat, story, ritual, avatar and the four missing nouns.
- **Naming.** Number is "weight". An occupied address is "held". A finished one is "released". A missing one is "not read yet". Coherence levels are "band". Paid levels are "tier". Chain levels are "step". The avatar noun is "Avatar". The masks page is named for what it holds, if Systems confirms `TAB.MASKS`.
- **Motion copy (Animation).** Motion never says what text does not. One Definition on demand: "The ring breathes when it has a reading and holds still when it has none." Boot skip, an Instruction: "Press any key to skip." A ragged low-coherence breath needs one line at first sight.

**Strings, old and new:**

| Old | New | Reason |
|---|---|---|
| Heaviest Root 0.0 / Most shut Truth | a dash for each, plus: "There is more running you than you can see. Write one story. The instrument reads where it is held." | Unread shows no finding. Three lines, three buckets: dash is Value, first is Reading, second is Instruction. |
| Locked on your plan | Opens on tier three. | A refusal that names no failure becomes a plain fact. |
| Your integrity is 6.2 against a clean ten. | Integrity 6.2 | Label and Value. The band state sits beside it. |
| integrity 6.2 of 10 | integrity 6.2 | No total. |
| Answered: N of the hundred points. | N answered. | Same. |
| What are we writing about today? (Source AI) | What happened today? Label: Question | No "we". |
| 0 days | a dash | Zero is a claim. A dash is not. |
| Nothing is held above the line yet, so there is nothing to release. | Nothing is held above the line. Write one more sentence, or hold a statement. | A Reading, then one door. |
| (unlabelled quote) | label: In your words | The product never says I. |
| Sat, how the field behaves | How the field behaves (Sat) | Plain first, the Sanskrit second. |
| you get 50 patterns when they join | you get 25 patterns when they join | Ruled round OI. |

**Must agree first:** Systems (class names, registry, `things.js`). Tech (codemod, 17 canvas font strings, gates 4, 8 and `collide.js`). Art (`--cq-ink`, state ink values). Brand (avatar noun, wordmark). Sales (lock strings). Game (empty states, kind ending). UX (zero states, rail).

## 5. REVISED GRADE: 58/100 (was 68)

Pass 1's table summed to 60 and I graded 68 on the strength of the gate. That was generous. Now the table reads 55: one word per concept 5 to 4, bucket purity 6 to 5, truth 8 to 6, empty states 7 to 6. I add 3 because the gate holds the hard rules at zero. The drop is the count-against-total spread and the unread verdicts.

## 6. TOP 5

1. **Truth sweep first.** Stale `buy.html` facts, every "of 10" and "of the hundred", the unread verdicts, the two-readings contradiction. S. Moves James, Derek, S3, S8.
2. **Delete `capitalize`; sentence case everywhere.** S, M with the `.plain` sweep. Derek, James, S3.
3. **Six-step type scale, three weights, tabular numerals.** M with a codemod, a script that rewrites every size at once. All, most Angela and James on phones.
4. **Unread screen and lock copy.** One promise, one door, "Opens on tier N". S. Angela, S1, S8, S7.
5. **Concept registry with ten definitions.** One word per concept. M. Derek, Marcus, S4.

## 7. QUESTION FOR THE OWNER

None. Decisions: sentence case wins, because the transform cannot deliver the title case ruling and one flag flips it back. Free tier sees a plain avatar. No price in a lock tooltip. No teaser counts.
