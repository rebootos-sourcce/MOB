# Pass 3, game director (Ngozi Achebe-Lindgren). Round PK, 2 October 2026

Hard line, stated because the merge brushes it: this product reads somebody's nervous system, so no manipulation pattern. A gate that holds ground back until a behaviour is shown is a resource drip. A stage that can fall is a loss frame. Numbers marked "model" come from `tools/loopsim.js` and are benchmarks, not promises.

## 1. The architecture in three sentences

One reading library parses each entry once, a derived trace shows the chain from what the person said to what they confirmed, and a safety screen sits in front and can quiet the whole product for one entry. Over that, `loopRead` is a pure read, never stored, of what the person last did in each quarter of the circle, and it orders one suggestion, the Next slot. The server sets tier, tier is the only key to ground and sight, and behaviour opens nothing.

Did the merge bend anything? Two things. The gift: the owner ruled the whole reading is visible while it lasts. I wanted base sight only, since showing saboteurs and then greying them is a take-away. I yield to the ruling and keep one demand: the gift-end line says what is kept and what rests, with no countdown before it. And the merge says Not now lasts 7 days but not that Not now and Not me must both change what shows next. I make that a gate.

## 2. The ICP room

- **Marta, acute, 02:00.** Sees the care card. Next, ring and streak line are gone for this entry. Taps Call or Continue. Care is derived for three days, never stored, so tomorrow is quiet, not a nag. "I wrote it and nothing tried to sell me the next thing."
- **Nils, skeptic.** Sees one sentence, one button, "You wrote" beneath. Presses Not now to test it. Unchanged tomorrow, he is gone. "Fine. It took no for an answer."
- **Camille, somatic practitioner.** Sees a circle lit by dated acts, no rank. Leaves at "stage 4". "Tell me what they did, not where they are."
- **Whitney, phone only.** Sixty seconds on a bus. One line, one tap, the visit ends kindly. Leaves if the first screen is the old four doors and three cards. "Give me one thing and let me go."
- **Renata, wants the chain as a number.** Sees six rows of words and a ring. Asks for a percent. The answer is no, a reading is not a score. She may leave. I accept that cost. "Where is my number?"
- **Gordon, refuses anything clinical.** Sees Maybe, Fits, Not me. No stage word, nothing to be graded on. Not me goes to a visible Set aside list. He stays. "It let me say it was wrong."
- **Sofia, needs the consent list.** The loop reads no grant and says nothing about who can see. Next never suggests sharing with a practitioner. "Show me who can see this, then I will write."
- **Trey, quiz tourist.** Arrives with a four letter result and nothing entered. Next says "Write what happened." No push, no email, no reward for returning. Honest cost: a tourist who is not nagged mostly does not return, so day 1 retention will sit below the free to play benchmark of 25 to 30 percent elsewhere. "That was quick. Maybe later."

## 3. Unified quality: 72 out of 100

The loop fits in one sentence a person can say back: write, read, release, practise, read again. Three gaps:

1. **Nothing writes the first evidence.** No surface calls `practiceDo`, so the rungs read nothing. The loop has a brain and no hands until G3 lands.
2. **The avatar, the centre of the product, arrives late.** A person watches nothing improve through the MVP. The ring lit by `touched` is a thin stand in.
3. **Next is untested on a stranger.** I have a simulation and no person. One watched playtest of the first ninety seconds is the gate (G8).

## 4. Final grade

GRADE: 72/100 (pass 1 50, pass 2 70). Up for derive-not-store, no stage, one Next and a derived care window. Held down by the three gaps and the gift take-away, which I cannot price (no gift arm in `loopsim.js`).

## 5. My part of the slices

Ids follow the technical director's A1 to A13 and R0 to R5. Creative 8 is A12, creative 12 is G5, creative 11 is G6.

**G1 (A12, engine half). `loopRead` and the rule table.** Goal: pure read returning `touched`, `turns`, `ground`, `standing`, `care`, `next`, one rule keyed on the open quarter. Changes: new `engine/loop.js` after `trace.js` in MANIFEST. Must not touch: `ui/`, `engine/schema.js`, any stored field. Gate: `tests/engine.js` table test (every quarter state gives one act; same input, same output; "Day", "of 90", "stage" never in output) and `hostfree.py`. M. Unlocks G2, G6. MVP. ICPs: Gordon, Camille.

**G2 (A12, UI half). Next slot.** Goal: replace four doors and three cards with one sentence (14 words max, 12 in care), one button, Not now. Doors stay behind a visible fold. Changes: `ui/component.js`, the rail renderer, CSS. Must not touch: `ui/storyui.js`. Gate: `functional.js` (one Next per surface, none in care), `design.js`, `monitor.js` at 1600 and 390, DOM total falls. M. MVP. ICPs: Whitney, Trey, Marta.

**G3 (A8 share). First writers and `addrs`.** Goal: release and story cards call `practiceDo`; `journey.runs` rows gain `addrs`. Changes: `engine/trace.js`, card handlers in `ui/storyui.js`, `engine/journey.js` after merge. Must not touch: the `p.rituals` cutover, `SCHEMA_V`. Gate: `p.practice` non empty after a scripted real run; gates read runs, never the capped log. M, after A2. Unlocks the rungs and `ground`. MVP. ICPs: Nils sees a real because line.

**G3b. `declined` list.** Goal: Not now writes `{act, quarter, at}`, seven day window, capped, closed kinds. Changes: `engine/trace.js`. Must not touch: `schema.js` beyond A2's carry. Gate: Not now, reload, Next differs. S. Unlocks G2 honest. MVP. ICPs: Nils.

**G4 (A13 effect). Not me changes Next.** Goal: Not me writes to the same `declined`. Changes: imprints panel in `ui/storyui.js` only. Must not touch: engine. Gate: `functional.js`, Not me then Next differs. S, after A13. MVP. ICPs: Gordon.

**G5 (creative 12). Confirmed tap.** Goal: after a ritual is done, one optional tap writes `reported`. It pays nothing and opens nothing, and no gate reads it alone. Changes: ritual card, `engine/trace.js`. Must not touch: points, tier, gates. Gate: change `reported`, and no gate, point or tier moves. S. Later. ICPs: Camille, Sofia.

**G6 (creative 11). Ring from `touched`.** Goal: arcs lit by newest dated act per quarter, dim after 14 days of nothing, never a rank. Changes: ring renderer, CSS. Must not touch: stage names, TAB integers. Gate: `design.js`, no stage string, screenshots at both widths, and I look at them. M, after G1 and G2. MVP if G2 lands. ICPs: Camille.

**G7. Price it.** Goal: add arms to the sim for Next, `declined`, gift shown then rested, and the care window; quote the cost of every no. Changes: `tools/loopsim.js`. Must not touch: product code. Gate: the sim's own validations pass; each new weight is sourced or marked mine and swept. S. MVP.

**G8. Playtest the first ninety seconds.** One watched stranger, minute by minute, written into `FEEDBACK-log.md`. S. Signs off G2. MVP. ICPs: all.

Slices I touch but do not own:
- **A1.** `loopRead` runs on commit and Field open, never per keystroke.
- **A4, A5.** `care` comes from `safetyScreen` on the newest entry, about 40 microseconds (technical estimate), for three days or until a newer ordinary entry. Never stored: a crisis bit is health data.
- **A9.** The gift-end line is mine to approve. The 120 pattern banking cap is never named in copy: a cap you are warned about is a scarcity timer. Points never open sight.
- **A2.** Must land before G3 and G3b, since an older build silently deletes unknown keys.

## 6. The order

1. Parallel, no shared files: A1 (`storyui.js`), A2 (`schema.js`), A3, R0 to R3, G7.
2. A4 then A5, in series, both on `storyui.js`.
3. Beside them: A6 and A7 (`engine/reading.js`) and G1 (`engine/loop.js`), new files, no overlap.
4. G3 and G3b after A2. One agent holds them with A8, all on `engine/trace.js`.
5. G2 after G1 and G3b. `ui/component.js` does not collide with `storyui.js`.
6. A13 then G4, same file, series. G8 after G2.
7. G5 and G6 after G2. A12 waits on the journey merge.

## 7. One question for the owner

None.
