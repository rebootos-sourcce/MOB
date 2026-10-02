GRADE: 55/100 (pass 1 was 48, pass 2 was 44)

Seat: game director, pass 3. Retention figures are from my 1000 person model of 27 September, not re-run, and from games elsewhere. Benchmarks, not promises. Hard line: this product reads a nervous system, so no variable reward, loss framed streak, timer, near miss, social pressure or fear of missing out push. Nothing below crosses it.

## 1. The proposal in three sentences

Tare puts one free, pre-drawn light figure at the hub of the Field, Summary and Avatar page, closes the loop into a four-arc ring, and gives every surface one grammar of colour, type, shape, motion, locks and copy. Light means coherence, bend means load, no number sits on it, and the unread state is its own screen with one hero sentence and four doors. The merge keeps almost all of my pass 2 asks, and it lost or bent four things.

- **Lost: the landing beat.** The merge defines the Land verb but never says what lands. Commit still pays a status line. This is the one beat every first session passes through.
- **Lost: marks and the streak ring.** Marks still wear seat colours (a Practice mark in Root red reads as punishment). The streak ring still opens at zero.
- **Lost: day two.** Nothing says what a person sees on return. My line: the figure as they left it, no push.
- **Bent: the ring lit by "the newest dated act".** Fine while it only lights. If it dims with time it becomes a streak.

## 2. The ICP room (eight people, ten seconds on the Field)

- **Marcus (founder, level 7).** Sees the figure, one light, a plate with his reading, no padlock wall. He taps the figure to see what bends it. Stays: the day 30 reason is free and visible. Leaves if the figure has no cause. "Finally the thing in the middle is me."
- **Whitney (phone only, level 5).** Sees a 64 px figure, four doors, a 44 px ring button, all above the fold. She screenshots it. Stays if the glossary is one tap away. Leaves if the 390 pill still covers the zoom. "It resolves. I want the glossary first."
- **Nils (design skeptic).** Sees one ring grammar, a figure with no number. Stays while nothing sells beside a reading. Leaves at an unearned head start or a decorative glow. "It says what it does not do. Good."
- **Camille (somatic practitioner).** Sees an outline that bends and asks what the bend claims. Stays if bend is labelled as load, solid for measured, dashed for stated. Leaves if a colour judges her client. "Do not tell a body it is wrong."
- **Marta (acute distress).** Sees a pencilled still outline and one sentence. No zeros, no red, no locks. Stays because nothing demands anything. Leaves if anything moves fast or a streak appears. "Please do not ask me for anything."
- **Renata (operator).** Sees the figure, the plate, the next act named. Commits once, sees the settle, closes. Stays if a short visit still pays. Leaves at any gate that spends sixty seconds. "I have nine minutes. Use two."
- **Trey (quiz tourist).** Sees a pretty figure and a shareable shape. Screenshots it, posts it, leaves. Fine. I do not build to keep him. "Cool. What is my type?"
- **Sofia (loves the open tables).** Sees the quiet fifth door to the tables and goes straight there. The 112 addresses are her game. Stays if opened and unopened differ by ring form, no "of 112". Leaves if locks reach into the tables. "Let me open them all. Slowly."

## 3. Unified quality: 58 out of 100

Three biggest gaps left, from the game seat:

- **No return.** It fixes the first ten seconds, not day two or day thirty. A figure that never changes after the first read is a poster. About 12 points.
- **Reward is silent and mis-coloured.** No landing beat, marks in seat hues, streak ring opening at zero. About 15 points.
- **Games has no door.** The owner calls them games and also ruled "hide games for now" (`core.js:237`). I do not argue it, but "Play" holds no play and a skin cannot fix that. About 8 points.

## 4. Final grade

GRADE: 55/100 (pass 1 was 48, pass 2 was 44).

Up eleven from pass 2. Moved by: the free floored figure, the unread screen, one lock per surface, one motion clock, closed loop arcs. Held down by: no landing beat, marks and streak untouched, no day two. If the five items in section 6 are built, I expect about 66. The rest is the figure becoming home, a redesign and the owner's call.

## 5. My part of the build spec

**Order I would build in, with size, file and proving gate.**

1. **Fix the 390 pill, unread screen, empty-state copy. S.** `ui/` Field renderer, `shell/head.html`. Gate: `tests/functional.js` plus `tools/monitor.js` at 390. Copy: "Your field is open. Write one more sentence." Dash where a zero would lie. No "of" against a total.
2. **Marks off the seat hues. S.** `engine/ladder.js` lines 149 to 225 and the marks renderer. Gate: `tests/design.js`, new check: no mark uses a seat token. Tokens, dark lighting: `--mk-1 #7C8494`, `--mk-2 #A3AABA`, `--mk-3 #CDD2DE`. Redefine the three per lighting, same lightness order. Ring 28 px, stroke 1.5, round caps. Family told by glyph and the three steps, never hue. Earned marks only. The next one is named. Never counted.
3. **The figure, three states. M.** Pre-drawn SVG, once per reading change. Gate: `tools/monitor.js` (node count under 60). Values: 96 px at 1600, 64 px at 390. Light token `--fig-light #F3E6CC` per lighting (one warm white, never a seat hue). Unread: dashed 6/4, `--ink` at 40 percent, no light, still. Read: light alpha runs 0.35 (floor) to 1.0 with CQ, never lower. Bend follows load. Breath is CSS opacity .64 to 1 over 4.2 s. It never dims on a missed day. It carries no number.
4. **The Commit landing beat. S.** `ui/storyui.js` `stCommit` (the call after `undoPush('committing the story')`). Gate: `tests/functional.js` and design gate 12. Timeline, same every time, only the four gate 12 durations: 0 to 320 ms imprints settle (Land verb, one overshoot, `--ease-land`); 320 to 740 ms figure takes one breath (420); 740 to 1160 ms the earned mark draws as a ring (420); 1160 ms the line "The day is on the record." appears and stays. Reduced motion shows the end state. No confetti, no random variation. Fixed and earned.
5. **Streak ring and Ritual empty state. S.** `ui/ritual.js`. Gate: `tests/daily.js`. The ring opens dashed, no count. The first act fills the first segment. A missed day changes nothing visible. No head start.
6. **Locks. S.** One sealed double ring per surface. Copy: "Opens on tier three". No countdown, no discount, nothing selling beside a reading. Gate: `tests/locks.js`.
7. **Day two. S.** `ui/` Field. On return, the figure as left, one dated line: "Last read: yesterday." No streak word, no target, no push. Gate: `tests/daily.js` plus a voice check with `check.py --objections`.

**Retention, honest.** Benchmark from elsewhere: mobile games commonly keep roughly 3 to 5 percent at day 30. My model: baseline 9.8 percent, full designed set 20.7. The landing beat alone is 2.8 points of 1000 at day 30. Refusing variable rewards, timers and loss streaks gives up a large part of a free to play stack's lift. I have not re-run the model, so I print no share.

## 6. Ranked recommendations

1. **Landing beat on Commit plus the fixed ritual ending. S. Reskin.** Moves Marta, Renata, Marcus, Whitney, Trey.
2. **Free figure with floor, three states, no number. M. Reskin for the draw, redesign if it becomes home.** Moves Marcus, Whitney, Nils, Sofia, Camille.
3. **Marks in the neutral ramp, streak ring opening dashed. S. Reskin.** Moves Marta, Nils, Renata.
4. **Unread screen and empty states with one door, dashes for zeros. S. Reskin.** Moves Whitney, Marta, Trey.
5. **Day two line on the Field. S. Reskin.** Moves Marcus, Renata, Marta.
6. **Show the full chain, saboteur layer included, at the first release. S. The owner's open item.** Moves Marcus, Camille. Withholding it to sell it back is near my line.

Not a skin, kept out: a sixty second floor ritual (1.8 points of 1000), Held and Moved awards (1.0), a door for Games.

## 7. Question for the owner

None. Decisions taken: the figure is free and floored, marks leave the seat hues, no endowed streak, the Commit beat is fixed and earned. Each stands unless he overrules it.
