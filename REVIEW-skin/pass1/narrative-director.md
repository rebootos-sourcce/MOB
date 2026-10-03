GRADE: 68/100

Seat: June Okonkwo-Lund, copy and typography. Evidence: `head.html`, `ui/*.js`, `canon.js`, shots at 1600 and 390, and runs of `check.py` (`--baseline`, `--objections`, `--brief`) and `tools/terms.py`. The baseline scorecard has no copy or type line, so nothing "moved". This is the first grade.

| Criterion | /10 | Evidence |
|---|---|---|
| Voice rules held (no em dash, 112, no bang, no soft lexicon) | 9 | `check.py --baseline`: 0 em dashes, 0 bangs, 0 soft words, 3,694 sentences, median 6 words |
| Case discipline (sentence case) | 3 | `head.html:1288` capitalises 14 label classes. Screens print "Who This Is", "What Drives It", "Need To Win" |
| One word per concept | 5 | `terms.py`: 5 words for charge, 6 for clearing, 5 for held, 3 for empty |
| Bucket purity (one string, one bucket) | 6 | Refusal in a value slot is fixed. `Pace 1 / Patterns 100` and "0 minutes" still sit as values with no state |
| Plain language (ten year old, two readers) | 6 | 18.9% of sentences carry an embalmed noun. Sanskrit headings, "pole", "seat", "assemblage point" |
| Truth and tone of readings | 8 | Compass and tier copy are strong. Two counts against a total survive |
| Type scale discipline | 4 | 31 distinct pixel sizes in the stylesheet, 5 half steps, no size tokens |
| Weight and hierarchy | 6 | Four real weights plus one stray 350. 500 and 600 used 126 and 136 times, nearly the same stroke |
| Empty states and refusals | 7 | Release and imprints empties are right. Compass prints "0 days" and "Nothing on the record yet" together |
| The voice as a system (names, wordmark, personas) | 6 | "Source AI" says "we". Wordmark sub line is near invisible |

The table sums to 60. I grade 68 because the gate holds the hard rules at zero, which is rare. The ceiling is low for the reasons below.

## THE SOUL

This product is a mirror that reads out loud. Its best sentences name a physical event and stop: "Gaining. Forward on most days, and one hard week takes it back." "Take the heaviest seat first." The type should be the same instrument as the words: one family, few sizes, a number and a name always in the same place. Right now the words are 90 percent of the way to a voice and the type is a drawer of 31 sizes. The skin job is to make the screen say what the copy already says: plain, quiet, one thing at a time.

## WHAT BREAKS COHERENCE (ranked)

1. **The stylesheet overrules the writer.** `head.html:1288`: `text-transform:capitalize` on 15 label classes (`.eyebrow`, `.lbl`, `.pm-eye`, `.kb-h`, `.sum-lt` and others). Seen: "Who This Is", "Where It Goes", "What Drives It", "Need To Be Need...". `CLAUDE.md` rules sentence case. `atuned-voice` V13 says title case in headers. Two rulings disagree and the CSS picked one. The `.plain` hatch exists because the transform keeps eating whole sentences, which is the proof it is the wrong tool. Cost: every screen.
2. **The type scale is not a scale.** `head.html`: 498 `font-size` declarations, 31 distinct pixel sizes (8.5 to 48), 5 `clamp()` sizes, 21 letter spacings, 0 size tokens. 90 declarations sit under 12px and 4 sizes under the 11px floor. Five half steps (10.5 to 14.5) are drift, since nobody sees half a pixel. Cost: many voices at slightly different volumes.
3. **Weights do not separate.** 600 (136), 500 (126), 400 (55), 300 (23), 350 (1). 700 is loaded and never used. At 12 to 13px, 500 against 600 is not a hierarchy a tired eye can read.
4. **One concept, several names** (counts from `terms.py`):
   - charge x24, weight x19, depth x7, load x6 for one number. "Weight" on the Field rail, "charge held" at `ui.js:53`, "load" in tier copy.
   - held x31, running x18, carrying x10, loaded x3, firing x1.
   - release x20, close x15, shut x8, empty x3, clear x2, reset x1.
   - empty: none x10, nothing held x7, no story yet x3, nothing is held x1.
   - Each tier carries `nm` and `state` (`canon.js:724+`). Summary shows "Gaining" with "Tuned" under it.
   - "Embodied" is a tier, "Embody" a loop station, and the Embody tab holds only Knowledge.
   - "Energetic Summary" over "Summary" over "Reading", and "Root Energetics" at 390. 76 universal laws and 21 integrity laws share "laws". Save x71, Commit x15, "Keep it" x1.
5. **Jargon with no meaning.** "Sat, how the field behaves", "Chit, how awareness comes into a body" (Knowledge headings), "Installed pole is past the point where it pays" (`summary.js:322`), "Assemblage Point", "Primary, Secondary, Tertiary" with no object, "Karmic debt". `--brief` flags 18 "let go" lines and 7 avoid list terms. V21 is a ruled blocker and this is the stock of it.
6. **A count against a total is alive.** Compass: "Your integrity is 6.2 against a clean ten." That is a mark out of ten (V8). Summary: "leans 100 per cent benign against 0 per cent malignant" reads as a grade.
7. **Zero where a dash belongs.** Compass: "0 days", "0 minutes", "0 rituals", "0 addresses" beside "Nothing on the record yet." The sentence says not read, the figures say zero. `COPY.md`: a value's empty state is a dash.
8. **A persona in a mirror.** The Story column speaks as "Source AI": "What are we writing about today?" The product is not a coach or a friend, and "we" is a coach's pronoun.
9. **The gate is red on three strings.** `map.js:3222` naked number, `tutorial.js:104` "Body response" and `:105` "What it costs" (figure labels of 2 and 3 words).
10. **The wordmark sub line is unreadable.** "SOURCE OS" is `#343434` on `#0C0D12`, about 1.5 to 1, all caps (`head.html:834`). A lockup may keep caps. It may not vanish.
11. **390 first screen:** "not read yet" prints under the zoom buttons (`390-00-first-screen.png`). Right words, wrong place. Hand to the UI seat.

## SKIN RECOMMENDATIONS

The voice as a skin: seven buckets become seven type roles, each with one size, one weight, one case.

| Bucket | Role | Size | Weight | Case |
|---|---|---|---|---|
| Menu | tab | 13 | 500 | sentence |
| Label | slot name | 12 | 500 | sentence, dim |
| Value | the reading | 15, 20 or 28 | 600 | as written |
| Definition | on demand | 13 | 400 | sentence |
| Instruction | next step | 15 | 500 | sentence, accent |
| Reading | what is true | 15 | 400 | sentence |
| Refusal | what failed | 13 | 500 | sentence, alarm tint |

1. **Rule case, delete the transform.** Sentence case, proper names keep capitals, the 15 classes lose it. Effort S once ruled, M with the `.plain` sweep. Moves Angela (warmer) and Derek (reads like an instrument). `CLAUDE.md` already holds the owner's answer.
2. **Seven size tokens:** 11 (floor), 12, 13, 15, 20, 28, one clamp for the avatar number. Collapse 31 sizes by nearest step. Effort L, mechanical, checkable by `tests/design.js`. All three ICPs: fewer voices lowers load, and James reads a calm screen as safe.
3. **Three weights: 400, 500, 600.** Drop 300 and 350 or reserve 300 for the one large figure. Effort S.
4. **One name per concept, ruled once.** Proposal for the owner: the number is "weight", an occupied address is "held", a finished one is "released", a missing one is "not read yet". `state` moves into the drill. Effort M. Moves Derek most.
5. **Retire "Source AI" and "we".** Label it "Question". Write "What happened today?" Effort S.
6. **Kill the count against a total.** "Integrity is 6.2" with the node state beside it per V22, or nothing. Effort S.
7. **Dashes for empties.** Any figure with no record shows a dash and the sentence carries the reason. Effort S.
8. **Give the Sanskrit headings a plain first line.** "How the field behaves" first, "Sat" as the quiet second word. Effort S.
9. **Wordmark.** Raise the sub line to the `--dim` token, keep it small, keep it caps as a lockup. Effort S.

## REDESIGN CANDIDATES

One. **A class per bucket** (`.t-menu`, `.t-label`, `.t-value`, `.t-def`, `.t-do`, `.t-read`, `.t-refuse`), and every renderer picks one. A token swap cannot do this: the 498 declarations are written per component and do not point at tokens. The gain is that a new string cannot be styled off the system.

## RISKS

- Removing `capitalize` exposes every sentence that leaned on it. Run `tests/design.js` and look at both widths.
- Collapsing 31 sizes moves layouts tuned to the half pixel. `tests/collide.js` must stay green.
- Hiding `state` is a display decision. `canon.js` is the owner's.
- Not checked: Settings, Games and Character shots, funnel copy, Light and Punch type contrast. The truth of a reading was checked only on Summary and Compass.
