GRADE: 66/100 (pass 1 was 56, pass 2 was 58)

Seat: brand-director, Noa Ferreira-Blake. Pass 3. I read the template, the lead's merge in `PROPOSAL.md`, my pass 2, the creative director's pass 2, and the older review.

## 1. The proposal in three sentences

1. Every surface shows the load and the person under it, so one free light figure sits at the centre of the Field, Summary and Avatar page, and it bends with load and lights with coherence.
2. The loop is drawn once as a closed four-arc ring in neutral ink, and one grammar of colour, type, shape, motion, locks and copy stops the same colour meaning five things.
3. A person who has entered nothing sees one honest sentence and four doors, not verdicts and padlocks.

**Lost or bent by the merge.**
- **Lost:** my rule that the paid layer stays off the figure. "Masks" still sits beside the centre. Keep the figure free and the lock off it.
- **Bent:** Source OS. I asked for `#7A7A7A`. The merge keeps the owner's `#343434` and shows him the 1.36 to 1 number. I accept that. It is his ruling, and I amend `BRAND.md` section 8, which is wrong against it.
- **Lost:** nothing in the build order retires "Source AI", which says "we".
- **Bent:** type steps. I said 15, the merge says 16. Fine.
- **Missing:** the one sentence is not in the proposal at all. A skin with no sentence has no test.

## 2. The ICP room (ten seconds on the Field)

- **Marcus (founder, level 7).** Sees the figure, lit and bent, with the reading on a plate below. Taps the ring to move around, goes to Masks to see what level 7 bought. Leaves if the plate shows 62 while his real read is lower. "It shows me what is running me. Good. Now show me the working."
- **Whitney (phone only, level 5).** Sees one 44 px ring button and a figure at 390. Taps it, picks a section from the sheet. Stays if the pill stops covering the zoom buttons. "I can reach it with one thumb. Fine."
- **Nils (design skeptic).** Sees an instrument: ink, rings, no gradient, no lotus. Stays because there is no number on the figure. Leaves at the first Start Case label. "Finally nothing is trying to relax me."
- **Camille (somatic practitioner).** Sees a figure and a seat name. Leaves if the avatar renames a seat Ground in one place and Pleasure in another. "A body location needs one name, or I cannot send a client here."
- **Marta (acute distress).** Sees one sentence, four doors, and "your stories stay on this device". The figure is still and pencilled. Stays because nothing is scored. Leaves at a zero or red. "Please do not grade me tonight."
- **Renata (operator).** Sees a bar, a ring and a tab list. Stays because the ring says where she is in the loop. Leaves if the loop is a row at 390. "Where am I, and what is the next move?"
- **Trey (quiz tourist).** Sees the hero sentence and a worked example labelled as one. Leaves on a buy page that says 50 patterns when 25 is ruled. "Cool picture. What do I get free?"
- **Sofia (loves the open tables).** Sees the quiet fifth door to the tables. Stays because transparency is shown, not claimed. "Everything here can be checked. That is the product."

## 3. Unified quality: 64 out of 100

Scored on one voice, one grammar, first screen to habit. The grammar is right. It is not one thing yet, because no seat owns the sentence.

**Three biggest gaps left**
1. **The promise outruns the product.** The demo reads 62 where a real first median is 34. The avatar word appears zero times in the files that draw charge. A brand ahead of its product is a debt. The skin can only stop adding to it.
2. **No sentence, no not-list.** Nothing a team can hold a screen up to. See my spec.
3. **The skin is waiting on the engine.** J4, J5, P11 and P18b come first. Until they land, the Field still opens with a number.

## 4. Final grade

**GRADE: 66/100** (pass 1 was 56, pass 2 was 58).

Up eight: the merge took my calls on the free figure, neutral loop, sentence case, one noun and the unread screen. Held down by the three gaps. Avatar and loop stay at 3 out of 10 until something ships.

## 5. My part of the build spec

**The one sentence.** "Every part of this reading can be opened and checked." The fuller form for the hero is the proposal's own: "There is more running you than you can see." Kept today? Half. The tables keep it. The Field opens on a number, and the demo number is not a real one.

**What we are not.** A coach, a guide, a friend, a journey, a practice app, a meditation timer, a personality test. Drift test: if a line could sit on one of those, cut it.

**Wordmark and lockup.**
- Wordmark: sky blue, weight 400, drawn umlaut, letters given room. Never 600.
- Sky hue: one value about 200 degrees on Dark, Snow and Punch. Flat's teal joins it, unless the owner ruled otherwise. Accent chroma lowered so it sits at least 0.08 (OKLab distance, a measure of how different two colours look) from Throat.
- Source OS: caps, one token `--mark-sub`, value `#343434` as ruled. Show him the 1.36 to 1 number once, with `#7A7A7A` beside it. No more asks.
- The accent is a control colour, never inside a data mark.
- The 16 px mark is the line figure with arms up, in ink.

**Name rules.** Avatar is the figure. Masks is the paid layer. Charge is the number's word. Band is the coherence ladder, tier is paid only. "Character" and "Source AI" retire.

**Voice range.** Mechanical, short, physical metaphors. No "I", "we", praise or "journey". A quote is labelled "In your words". The example is labelled "worked example". Unread text is fixed: the hero sentence, four doors, "Your stories and readings stay on this device".

**Lock copy.** One sealed mark per surface, named by the next rung ("Opens on tier three"). Never on the avatar. Never beside a reading.

**Order I would build it in**

| Step | What | Size | File | Gate that proves it |
|---|---|---|---|---|
| 1 | The sentence and the not-list into `BRAND.md`; amend section 8 | S | `BRAND.md` | voice gate `check.py --objections` |
| 2 | Retire "Source AI" and "Character" in strings | S | `ui/imprints.js`, `ui/storyui.js`, `engine/sourceai.js` | `tests/engine.js` plus voice gate |
| 3 | `--mark-sub` token, sky hue per lighting, accent chroma | S | `shell/head.html` | `tests/design.js` (edit the contrast floor by name) |
| 4 | Unread screen text | S | `ui/` Field renderer | `tools/monitor.js` (it now reads the sentence) |
| 5 | Lock copy by rung, three or fewer on the first screen | M | `ui/panels.js` | `tests/functional.js` count assertion |
| 6 | Buy page told true (25, not 50) | S | `funnel/buy.html` | `tests/funnel.js` |
| 7 | Free figure behind a flag | L | new `ui/` figure | `tests/design.js`, `tools/monitor.js` |

Steps 1 to 6 can ship ahead of the engine slices. Step 7 waits on them.

## 6. Ranked recommendations

1. **Put the sentence and the not-list in the repo and gate on them.** S. Reskin. Nils, Camille, Sofia, Marta.
2. **The unread screen that keeps its promise.** S. Reskin. Marta, Trey, Whitney, Renata.
3. **Make the demo reading honest.** Label it or use a real median. S. Reskin. Trey, Nils, Marcus.
4. **The free figure, answering to the person's own load.** L (M for a crude version). Redesign inside a skin. Marcus, Camille, Sofia.
5. **One name per body location.** One seat sheet in `canon.js`. M. Reskin. Camille, Sofia.
6. **Fix the buy page and the 50 versus 25 promise.** S. Reskin. Trey, Sofia.
7. **Lock copy and count.** M. Reskin. Whitney, Marcus, Trey.
8. **Source OS token and the contrast note.** S. Reskin. Nils.
9. **Loop ring, neutral ink, 44 px sheet at 390.** M. Reskin. Renata, Whitney.

## 7. One question

None. I decided: `#343434` stays, the figure is free, sentence case wins, and the sight reversal is his call. My advice stands: show the whole reading on the first release.
