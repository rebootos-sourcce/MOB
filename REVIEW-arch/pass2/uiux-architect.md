# Pass 2, UI UX architect (Dani Sorensen). Round PK, 2 October

Read: BRIEF, OWNER-INPUT, all eight pass 1 files, and the four pass 2 files already written (creative, technical, game, systems). No QA report had landed. Counts are my 1 October measurements (build `65ed759`) or budgets I set. A budget is a target, not a forecast. "Choices" means things a person can press or decide on one screen at once.

## 1. Agreements

- **The chain reads existing stores; no new ledger.** AI, systems, creative, game, technical, me.
- **No days, stage name or "of 90" on screen.** Game, creative, narrative, me. A count against a total is a score.
- **Nothing screens text for distress.** AI measured "I feel suicidal" reading as an empty entry. Narrative, creative, technical, systems, me.
- **Never store a safety result.** AI, systems, narrative, creative. The care screen is entry scoped and leaves no trace.
- **No confidence number on screen.** AI, systems, creative. A rung (once, repeated, apart) is a count a person can check.
- **One Next slot.** Game, creative, me. Three authors print four labels today.
- **Every new item replaces an old one.** Creative confirms my risk 1.
- **No surface writes evidence yet.** Systems, game, technical.

## 2. Disagreements, and my side

1. **My "Where you are" tile, against game and creative.** I concede. Ten stage names on a ring is a staircase drawn round, and my "Back at pattern recognition" is loss language in a soft voice. A ring has no back. Tile and stage sentence withdrawn.
2. **The gift. Sales and creative: show saboteurs through the character layer. Game: base sight only.** I side with game. "Your reading is kept, tier one shows it" says kept, then hides it, which fails the honest affordance rule (say what a control or a loss is). Showing a saboteur for a hundred patterns and then a padlock reads as a take away. Cost: the best demo moment. The lock names what is kept: ground, record, reruns.
3. **Layer latch.** Nobody latches layer sight. I agree. This corrects my pass 1 risk 6: with no latch a downgrade adds padlocks, so the count falls only if locks fold (section 4).
4. **Care card length.** Narrative's urgent card has five lines, under 45 words. My cap for Ana was 12. Split: first view is the quote, one number line and three buttons (Call, Text, Keep writing), under 25 words. "Outside the United States" and "no release is offered" sit one tap down under a visible More. "Nobody is watching as you write" lives in the Help sheet.
5. **"Continue" (narrative) against "Keep writing" (me).** One word per concept. "Keep writing" wins: it is the owner's instruction and says what continues.
6. **Quiet lasts one entry (me); game's `care` lasts three days.** Both stand. Quiet (no motion, streak, locks or ladder) is entry scoped. For three days Next shrinks to one act, with no label. Nothing is hidden: the doors stay under a visible fold.

## 3. What I missed

- **No writer, no chain.** My Why chain would show "Not yet" in every row on every real record. The claim row is the fix: Fits calls `confirm`, Not me writes the `declined` list. That makes the claim row the first writer, so it ships before the chain, not after.
- **Typing is over budget** (technical: 79 ms median at 1000 words, 4x throttle). A card appearing while someone types in distress must not lag the box. The screen runs on a sentence end and paints in one frame.
- **DOM weight.** 3,998 nodes against 3,000. The chain is a plain list under 300 nodes, never a canvas.
- **Silence reads as clearance.** The reader hit 5 of 18 unseen phrases (narrative). No card may say the product watches.
- **The abuse card promises Delete; entry delete does not exist.** I drop that button until it does.
- **My counts are a day old.** Slice 0 re-measures.

## 4. The architecture, together: screen grammar

**Slots.** Fixed labels, value carries the state: Next, Maybe, Why, Set aside, and on the data page Stays, Leaves, Delete. An empty slot reads "Not yet".

**Next.** One sentence, 14 words at most (12 in care), an act in the person's words. One primary button, one text button, Not now. Not now writes `declined` and holds seven days (game's figure). Summary: top, under the plate. Field and Story: first item in the right rail. Not on Ritual or Compass. It replaces four doors and three cards.

**Claim row.** Quote first (16 px, 12 words at most), then the claim in "may" form (20 words at most), then **Fits**, **Not me**, **Why**, each 44 by 44 minimum, 8 px apart. After Not me, visible one level down: Partly, It depends, In my words (the six `DLY_RESP` names as plain words). Not me is final: no confirm box, 10 second Undo in place, the claim moves to Set aside (listed, never counted) and must change what shows next. One live claim per surface; the rest fold under one text button. Seat hue is a 4 px left edge only, never a button fill. No claim before the person has written a sentence it can quote.

**Why chain.** Opens in place under the claim; a bottom sheet on a phone. Six rows, fixed order, closed keys: Said, Heard, Maybe, Felt, Changed, Confirmed, led by narrative's verbs (You wrote, The instrument read, The instrument infers, You marked, You reported, You confirmed). Top three open, the rest unfold. Rows quote the person's raw words, dates as relative words. Confirmed fills only after the person's own tap or a meter line.

**Care register.** Three outcomes, state names never printed. Ordinary: nothing. Strong: one line in the Source AI lane quoting the person, one pace line, the release stays open. Needs a person now: the card in disagreement 4. Layout stays. Motion 0 ms. No red, no modal, no siren icon, neutral surface. Body 18 px, buttons 48 px high. "Quiet is on for this entry. Turn it off." is always present. Choices fall below the prior page. One dismissal holds for the entry.

**Loop ring (art seat draws it).** Four quarters, the four ruled words. A quarter lights from the newest dated act in it and dims after 14 days of none (my judgement; art may move it). No stage, number or day.

**Lock rule.** One lock line per layer group, not one padlock per item. The first Field screen has about nine; target 3 or fewer. No lock, checkout or upsell inside any care card.

**Right rail.** Next, one live Maybe, then the seven accordions folded with the chevron kept. Out: four doors, three cards, six open accordions.

**Data page.** In the profile sheet, no tenth tab. Three labels, two states (device only, signed in), about 40 words, narrative's fixed words. "People who can see this record" is read from grants, never a constant.

**Budgets** (slice 0 re-measures). Field loaded 30 or fewer (was 49). Summary first viewport 12 or fewer. Claim 4. Care card 3 to 5. DOM net down.

**Agree first.** Voice seat: Maybe, Fits, Not me, Confirmed, Quiet, the verbs. Art seat: ring, neutral care surface, hue edge. AI seat: the safety output returns the person's raw span. Game: Next rule table, `declined` window. Systems: `declined` shape. Technical: frame callback, DOM budget.

## 5. Revised grade

**GRADE: 64/100 (was 58).** Up: the stage tile is gone, so more is replaced than added; the claim row doubles as the first writer; care outcomes settled at three. Down: no writer yet, typing over budget, counts a day old, care card untested with a real person. Built as new panels beside the old: about 45.

## 6. Top 5, ranked

1. **Care register with the safety screen (M).** Ana and Nkem most. Sofia and Derek if a false alarm stays cheap. Gordon if there is no label and no modal.
2. **Claim row on Story imprints, as the first writer (M).** Gordon (a No that works), Derek (a chain he can check), Sofia (In my words).
3. **Next slot replacing doors and cards, rail folded (M).** Angela, the phone only arrival, Diane.
4. **Why chain as a plain list or sheet (M), after 2.** Derek, James.
5. **Lock fold and the gift decision (S).** Derek, Nkem.

## 7. Question for the owner

None. Decisions taken: stage tile cut; gift shows base sight only; urgent card shows three buttons and under 25 words first; "Keep writing" beats "Continue". Reasons are above. He can overrule any.

Proof: 4 of 5 testers name the Next act in 4 seconds, find Not me in 10, and point to the sentence a claim came from.
