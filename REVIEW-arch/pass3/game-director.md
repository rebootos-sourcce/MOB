# Pass 3, game director (Ngozi Achebe-Lindgren). Round PK, 2 October 2026

Hard line, stated because the merge brushes it twice: this product reads somebody's nervous system, so no manipulation pattern. A gate that holds ground back until a behaviour is shown is a resource drip. A stage that can fall is a loss frame. A gift that is shown and then taken is a scarcity trick. Model numbers below come from `tools/loopsim.js`. They are benchmarks from elsewhere, not promises here.

## 1. The architecture in three sentences

One reading library parses each entry once, a derived trace shows the chain from what the person said to what they confirmed, and a safety screen sits in front of both and can quiet the whole product for one entry. Over that, `loopRead` is a pure, never stored read of what the person last did in each quarter of the circle, and it orders one suggestion, the Next slot. Tier, set by the server, is the only key to ground and sight; behaviour opens nothing.

Did the merge bend anything I care about? Two things. First, the gift. The merge keeps the owner's ruling that the whole reading is visible while the gift lasts. I proposed base sight only, because showing saboteurs and then greying them is a take-away. The owner ruled, so I yield on the build and keep one demand: the gift-end copy says what is kept and what rests, in one plain line, with no countdown and no "ending soon" anywhere before it. Second, "Not now for 7 days" is in the merge, good, but the merge does not say that Not now and Not me must both change what shows next. I make that a gate.

## 2. The ICP room (eight people, judged from the loop, the session and the week)

**Marta, acute distress, 02:00.** She sees the care card, quote, three buttons. Next is gone for this entry, the ring is gone, no streak line. She taps Call or Continue. Care is derived for three days and never stored, so on day two she meets a quiet screen, not a nag. She trusts it because nothing counts her. She leaves if a suggestion arrives inside the care window. Gate it. "I wrote it and nothing tried to sell me the next thing."

**Nils, the skeptic.** He sees one sentence, one button, and "You wrote, the instrument heard" under it. He presses Not now to test it. If Next is unchanged tomorrow he leaves for good. If it moved, he reads on. "Fine. It took no for an answer."

**Camille, somatic practitioner.** She sees a circle lit by what the person did, with dates, not a rank. She trusts a thing that says "touched" and not "stage 4". She leaves if a rank appears. "Do not tell me where my client is. Tell me what they did."

**Whitney, phone only.** Sixty seconds on a bus. Next at its floor: one line, one tap, done, and the visit ends kindly. She leaves if the first screen is the old four doors and three cards, which is a wall on a small glass. "Give me one thing to do and let me go."

**Renata, the operator who wants the chain as a number.** She sees six rows of words and a ring, no score. She will ask for a percent. The answer is no, a reading is not a score, and the circle count is a thing she can check. She may leave. I accept that cost. "Where is my number?" She gets turns closed, a count she can verify.

**Gordon, refuses anything clinical.** He sees "Maybe", Fits, Not me. No stage word, no diagnosis, nothing to be graded on. Not me puts a claim in a visible Set aside list. He stays because he can say no. "It let me say it was wrong."

**Sofia, needs the consent list.** My part of her trust is small: nothing in the loop reads a grant, and no loop surface says who can see. She goes to the privacy page, not the Field. The risk is the Next slot suggesting a practitioner share. It never does. "Show me who can see this, then I will write."

**Trey, quiz tourist.** He arrives with a four letter result and nothing entered. Next says "Write what happened." He either writes or he does not. No push, no email nag, no reward for returning. Honest cost: a tourist who is not nagged mostly does not return. Free to play benchmark day 1 sits near 25 to 30 percent elsewhere; mine will sit below it. "That was quick. Maybe later."

## 3. Unified quality: 72 out of 100

The loop is now one sentence a person could say back: write, read, release, practise, then read again. The Next slot makes the session shape real at 60 seconds and at 20 minutes. Held back by:

1. **Nothing writes the first evidence.** No surface calls `practiceDo`, so the rungs read nothing. The loop has a brain and no hands until the first writer lands (G3).
2. **The avatar, the centre of the product, arrives at slice 11.** A person watches nothing improve through the MVP. The ring lit by `touched` is a stand in, and it is thin.
3. **Next is untested on a stranger.** I have a simulation and no person. One watched playtest of the first ninety seconds, with someone who has never seen it, is a gate I have not yet seen written.

## 4. Final grade

GRADE: 72/100 (pass 1 50, pass 2 70). Up two because the merge adopted derive-not-store, no stage, one Next, `declined` that changes the next suggestion, and a care window that is derived. Held down by the three gaps above and the gift take-away, which I do not like and cannot price (no gift arm in `loopsim.js`).

## 5. My part of the slices

Ids follow the technical director's A1 to A13 and R0 to R5 and the creative director's thirteen. Duplicates merged: creative 5 is A6 plus A7; creative 6 is A8; creative 7 is A13; creative 8 is A12; creative 12 is G5.

| Id | Name | Goal | Files it changes | Must not touch | Gate | Size | Unlocks | MVP | ICPs feel |
|---|---|---|---|---|---|---|---|---|---|
| G1 (A12 engine half) | `loopRead` and rule table | Pure read: `touched`, `turns`, `ground`, `standing`, `care`, `next`. One rule table keyed on the open quarter. | new `engine/loop.js` (after `trace.js` in MANIFEST); `tools/loopsim.js` reads it | `ui/*`, `engine/schema.js`, any stored field | `tests/engine.js` table test: every quarter state gives one act; strings "Day", "of 90", "stage", "level" never appear in output; same input gives same output; `hostfree.py` | M | G2, G6 | MVP | Gordon no stage word; Camille dates not ranks |
| G2 (A12 UI half) | Next slot | Replace four doors and three cards with one sentence (14 words max, 12 in care), one button, Not now. Doors stay behind a visible fold. | `ui/component.js`, the rail renderer, CSS | `ui/storyui.js` | `functional.js`: one Next per surface, none in care; `design.js`; `monitor.js` at 1600 and 390; DOM total net down | M | the first ninety seconds | MVP | Whitney, Trey, Marta |
| G3 (A8 share) | First writers and `addrs` | Give evidence its first writer: release and story cards call `practiceDo`. Add `addrs` to `journey.runs`. | `engine/trace.js`, `ui/storyui.js` card handlers, `engine/journey.js` after merge | `p.rituals` cutover; `SCHEMA_V` | `p.practice` non empty after a scripted real run; runs read, not the capped log | M | rungs, ground | MVP | Nils sees a real because line |
| G3b | `declined` list | Not now writes `{act, quarter, at}`. Seven day window. Capped, closed kinds. | `engine/trace.js` | `engine/schema.js` beyond A2's carry | Not now, reload, Next differs; list capped | S | G2 honest | MVP | Nils |
| G4 (A13 effect) | Not me changes Next | Not me puts a claim in Set aside and feeds the same `declined`. | `ui/storyui.js` imprints panel only | engine | `functional.js`: Not me then Next differs | S, after A13 | Gordon's trust | MVP | Gordon |
| G5 (creative 12) | Confirmed tap | After a ritual is done, one optional tap writes `reported`. Pays nothing, opens nothing, no gate reads it alone. | `ui/` ritual card; `engine/trace.js` | points, tier, any gate | test: no gate, point or tier changes when `reported` changes | S | evidence's second writer | Later | Camille, Sofia |
| G6 (creative 11 part) | The ring from `touched` | Ring arcs lit by newest dated act per quarter, dim after 14 days of nothing. Never a rank. | `ui/` ring renderer, CSS | stage names, tab integers | `design.js`; no stage string; screenshots at both widths, and I look | M, after G1 | the avatar slice | After G2 | Camille |
| G7 | Price it | Add arms: Next slot, `declined`, gift shown then rested, care window. Quote the cost of every no. | `tools/loopsim.js` | product code | the sim's own validations pass; every new weight sourced or marked mine and swept | S | numbers for the owner | MVP | none directly |
| G8 | Playtest the first ninety seconds | One watched stranger, minute by minute, recorded in `FEEDBACK-log.md`. | docs only | code | the note exists; Next survived or was cut | S | G2 sign off | MVP | all |

Slices I touch but do not own:
- **A1 typing floor.** `loopRead` runs on commit and Field open, never per keystroke. Fold cost is 0.12 ms at 2,000 events (model measurement).
- **A4 and A5 safety and care.** `care` in `loopRead` comes from `safetyScreen` on the newest entry, 40 microseconds (technical estimate). The care window is three days or until a newer ordinary entry. Never stored; a stored crisis bit is health data.
- **A9 entitlements.** Gift copy at its end. The banking cap of 120 patterns is never mentioned in copy, because a cap you are warned about is a scarcity timer. Points never open sight.
- **A2 record safety.** Must land before `declined` and `addrs`, because an older build silently deletes unknown keys.

## 6. The order, and what runs in parallel

1. Parallel, no shared files: A1 (`storyui.js`), A2 (`schema.js`), A3 (privacy), R0 to R3 (server), G7 (loopsim).
2. A4 then A5 (safety, care). Both edit `ui/storyui.js`, so series.
3. A6 and A7 (`engine/reading.js`) can run beside A4 only if A4 stays out of the engine. G1 can run here too: new file `engine/loop.js`, no overlap.
4. G3 and G3b after A2. `engine/trace.js` is shared with A8; one agent holds both.
5. G2 after G1 and G3b. Touches `ui/component.js`, which does not collide with `storyui.js`.
6. A13 then G4 (same file, storyui). G8 playtest after G2.
7. G5 and G6 after G2. A12 waits on the journey worktree merge for `journey.runs`.
8. A9, A10, A11 and R4, R5 are not mine; entitlement copy needs my gift-end line before A9 ships.

## 7. One question for the owner

None. I have yielded the gift to his ruling and stated the one line I need at its end. If he wants the gift priced before launch, G7 does it.
