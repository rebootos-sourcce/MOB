GRADE: 51/100

Dani Sorensen, UI UX architect. Pass 1, 1 October 2026, build `65ed759`. Method: I looked at every screenshot in `skin-shots/`, then ran my own count in a real Chromium on `source.html` at 1600 and 390 (script in my scratchpad, read only on the repo). A "simultaneous choice" below means a control that is visible inside the first screen, not covered by anything, and a person could press right now.

| Criterion | /10 | Evidence |
|---|---|---|
| Job of each screen is clear | 6 | Story is one job (`1600-story-loaded`). Avatar, Knowledge and Field each hold three or four. |
| Cognitive load (target under 12) | 3 | Loaded, 1600: Field 49, Knowledge 61, Ritual 47, Avatar 41, Intake 41, Body 38, Story 36, Compass 36, Analytics 29, Summary 27, Settings 23, Character 20, Games 19. None passes. |
| Information architecture | 5 | Doors per section: Discover 5, Play 4, Flow 1, Embody 1 (`engine/core.js` TABDEF). Games has no door at all. |
| First run | 6 | Boot ring is the best three seconds in the product. Login after it is the weakest. |
| Journey to embodied habit | 5 | Day 1 has a path. Day 3 and day 30 have no pull that lives on the person's side of the screen. |
| Pattern consistency across tabs | 6 | Rails, pills and rings repeat well. The right rail repeats too well (see below). |
| Fit across the buyer grid (levels 4 to 10) | 4 | Every screen is written for level 7 or 8. Angela at level 5 has no gentle lane. |
| Honest affordance and feedback | 6 | Locks, "not read yet" and "worked example, nothing saved" are honest. Games and the hidden 390 nav are not. |
| Mobile structure (390) | 5 | Loop hidden behind one dropdown. Field readout collides with the zoom buttons (`390-field-loaded`). |

Touch targets pass: every header control measures 44 tall. Body text fails: on the loaded Field 0 of 73 text items reach 16px, the largest is 20px. 38 distinct font sizes are written in `head.html` and `ui/`.

## What moved since the baseline
`ATUNED-art-ux-icp-review.md` gave UX flow 86 and visual hierarchy 85. It scored the intended sequence from the design papers. I scored the screens. That is most of the 35 point gap, and it is the more honest number. The one hard figure that moved: Field first screen was 103 choices and went to 47 at `1341796` (`STABILITY.md`). I read 49 today. Held, not improved.

## THE SOUL
For my discipline this is an instrument panel that wants to be a companion. The structure is a cockpit: a rail of tools, a rail of readings, a stage. The promise is an avatar that you watch get better. The cockpit is honest and rich. The companion is a sub page two doors deep (Discover, then Avatar). The soul is the avatar and the loop, and the layout currently gives the centre of the screen to a wheel of 112 addresses instead.

## WHAT BREAKS COHERENCE (ranked)
1. **The loop means three different things.** The landing page says Play is "a short ritual and real games" and Flow is "charge named, seated and released". The app has Play as the instruments (Field, Body, Compass, Character), Flow as Ritual only, Embody as Knowledge only. Release lives in Story, under Discover. Costs: one word, three meanings (the standing ruling). A stranger who read the landing page cannot find the thing it promised.
2. **Games is an orphan.** Zero doors in the UI (`TABEXTRA`, `panels.js:279` is the only reference). The landing page lists Games twice. Costs: a broken promise on the landing page, and the "play" in Play has no play in it.
3. **The avatar is not the centre.** The Field home shows a wheel and a ball reading 62. The avatar page (`1600-intake-loaded`, which is really the Avatar tab) has three nested switches: Becoming or Archetypes, Your story or Intake questions, and To release or To embody. Costs: the owner's centrepiece takes four taps and a decision to see.
4. **The right rail is wallpaper.** The same Marcus reading with the same By Weight list sits on Field, Body, Summary, Knowledge and Games (`1600-field`, `body`, `summary`, `knowledge`, `games`). On Summary it repeats the page beside it (62%, Gaining). Costs: 13 controls and about 120 words of constant text that people learn to ignore, so the one time it matters it is invisible.
5. **Single door sections are not navigation.** Flow and Embody show a one tab sub bar (`1600-knowledge-loaded`). A tab with no sibling is a label. The loop also reads as a row with a divider, not the circle he ruled. On 390 all four words collapse into "Play | Field v" and the loop disappears.
6. **Locks form a second interface.** First Field screen has 5 locked chips on the left, 4 locked pills on the right and a locked Character door. Character is a black page with one bar (`1600-character-loaded`). Costs: a person sees roughly 10 things they cannot have before one thing they can.
7. **Counts against totals.** Quiz result footer: "Answered: N of the hundred points" (`funnel/quiz.html:519`), and "scored out of ten" (lines 454, 459). Breaks the standing ruling that a reading is not a score.
8. **Text size.** 45 of 46 text items on the blank Field are under 16px (my floor). Reading surfaces such as Summary prose are fine. Chrome and rail are 11 to 13.5px.

## FRICTION LEDGER (where a person stops and thinks)
| # | Stop | Screenshot | Who |
|---|---|---|---|
| 1 | Login form before any value. Log in, Create account, Guest: three buttons, Guest last and quiet. | `real-7000` (my capture, no `dev=1`) | Angela, James |
| 2 | Blank Field: 12 icon chips, 5 locked, wheel with no label. Four seconds say "dashboard". | `1600-00-first-screen` | Angela, Diane |
| 3 | "Four ways in" is in the right rail at 12px, while the eye is on the wheel. | `1600-00-first-screen` | all strangers |
| 4 | "You" card: Carrying nothing yet, Filled in nothing yet, Heaviest Root 0.0. Zeros read as failure. | `1600-00-first-screen` | Angela |
| 5 | Accuracy plus button and "not read yet" pill, unexplained. | `1600-00-first-screen` | Diane |
| 6 | Story: Sort has 5 options, Imprints has 3 view icons, Release has Pace and Patterns numbers, all before one word is written. | `1600-story-loaded` | Sofia, Angela |
| 7 | Avatar: seven nodes, two toggles, two text boxes, Add to your avatar, Cycles, Rituals. | `1600-intake-loaded` | Derek, Diane |
| 8 | Summary: 5 paragraphs of reading plus rail twin. Where do I look first? | `1600-summary-loaded` | Diane, James |
| 9 | Body: two figures, 8 overlay chips, 4 locked. Which one is mine? | `1600-body-loaded` | Angela |
| 10 | Compass: pyramid with about 40 marks, 8 side labels, rail swaps to "Selection". | `1600-compass-loaded` | all but Derek |
| 11 | Character: tab is in the bar, page is a lock. Dead end. | `1600-character-loaded` | Marcus |
| 12 | Knowledge: 12 category pills (cut off at the edge), 76 rows. No first step. | `1600-knowledge-loaded` | Angela |
| 13 | Games: reached by nothing. | `1600-games-loaded` | everyone |
| 14 | Ritual: streak ring at 0, 31 empty day circles, then a form with 6 groups. | `ritual-1600` (mine) | Angela, Derek |
| 15 | Settings: Account first, with email and password fields, for a person with no account. | `1600-settings-loaded` | Sofia, James |
| 16 | Mobile Field: readout pill sits under the zoom buttons. | `390-field-loaded` | all on phone |
| 17 | Mobile nav: loop and sub tabs inside one dropdown. | `390-story-loaded` | all on phone |

## THE WALK (named people, my placement on the grid, a judgement)
- **Derek, 39, level 7 to 8.** Boot, Skip or login, Field, sees 112 addresses, grins. Presses Compass. Finds Body, Character, ritual streak. He stays. Stops at 11 (a locked tab).
- **Diane, 46, level 6 to 7.** Wants the cost of a pattern in a decision. Gets a wheel. Opens Summary, finds "What drives it" on page two of scroll. Stops at 8: answer is there but is under a heading about Born and Named. She needs "what is it costing me" first.
- **Angela, 36, level 5.** Fear: being told what is wrong with her by a machine. Sees login (1), a dashboard (2), five locks (6). Closes the tab before the first story. The only soft thing is "Write what happened. The day, in your own words." It is the right card at the wrong volume.
- **Sofia, 41, level 8.** Needs vocabulary she can use with clients. Opens Knowledge, delighted. Stops at 12: no way to see how it connects to a person.
- **James, 57, level 6.** Wants evidence and no mysticism. Login first (1) is the blocker, because he does not know who holds the data. The line under the Settings form says stories stay on this device, but it is on Settings, not on the door.
- **Marcus, 44, level 7.** Is the one the build is drawn for. 41 to 49 choices is tolerable to him. He is also the only one who sees the beauty. Stops at 11.

A flow that works for Derek and Marcus and fails for Angela and James does not reach the largest paying band, levels 4 to 6.

## JOURNEY, day 1, 3, 30
- **Day 1.** Boot, login, blank Field, Story. The auto-open flag for the signal test is `false` in `onboard.js`; `login.js` has a separate switch set true. I did not walk past the login, so which one fires is unverified. First useful thing is the first story: 2 taps from Field.
- **Day 3.** The pull is the ritual and its streak. Push is planned, not built. Without a push the only trigger is memory. The streak ring opens at 0, which is a debt, not a gift. Duolingo does the opposite and endows a head start. Copy the endow, not the guilt.
- **Day 30.** The promise is "watch your avatar improve". The place that shows it is the Avatar page, a Discover sub tab. Nothing on the home screen moves when the person improves. No loop closes visibly: embody never hands back to discover on screen. The landing page says it in one caption ("Embody hands back to discover"), the app never does.

## SKIN RECOMMENDATIONS
| Move | Effort | Moves |
|---|---|---|
| Draw the four sections as a ring in the top bar, current station lit, arrow closing back. Phone shows the ring too, not a dropdown. | M | Angela, Derek, Diane |
| Collapse locks into one "Unlocks" chip per surface. Locked tabs leave the bar, show in that chip. | S | Angela, James |
| Type scale of 5 steps: 11 chrome, 14 rail, 16 reading, 20 title, 28 number. Retire the 38 values. | M | Sofia, James, Angela |
| Zero states say the next act, not zero. "Nothing held" becomes "One story fills this." | S | Angela |
| Right rail closed on the first three sessions, then opens by itself once a reading exists. | S | Angela, Diane |
| Streak ring opens with one segment filled as endowment. | S | Angela, Derek |
| Landing words match app words, or the app words change. One decision, owner's. | S | all |
| Quiz footer and "out of ten" lines reworded to readings. | S | Sofia, James |
| Mobile readout moved above the zoom buttons. | S | all on phone |

## REDESIGN CANDIDATES
1. **A home that is the avatar, with the Field one tool inside it.** A skin cannot do it. The skin moves colour and type; this moves what is at the centre and what sits two taps deep. It would cut the first screen to roughly 12 choices and puts the owner's centrepiece where he says it lives.
2. **Embody and Flow regroup.** Ritual, Avatar and Release belong where the loop says they do. That is a re-sort of doors, not new doors. TAB integers stay as they are.
3. **One lane for levels 4 and 5.** A three step first session (write one thing, see where it landed, pick when) that does not show the cockpit until it ends. `DESIGN-firstrun.md` section 0 already drew it. It is not built.

## WHAT TO INSTRUMENT
- Seconds from boot end to first keystroke in Story.
- Share of strangers who press Guest, Create account, Skip, or close, at the login.
- First control pressed on Field, by position.
- Pressed doors in the first session; how many of those were locked.
- Day 2 and day 7 return with and without a saved ritual time.
- Door presses on Flow and Embody versus Discover.
- Test with five people before any rebuild: two at level 5, one at level 4, one at 8, one practitioner.

## RISKS
- The count is mine and uses the first viewport; scrolled content adds more.
- Placements on the grid are judgement, not data.
- Moving words (loop map) touches voice rulings and the landing page together. Needs one owner decision.
- Dropping the right rail early may hide the reading the funnel works hard to earn.
- The `dev=1` shots skip the login, so `00-first-screen` is not what a stranger sees. I captured the real one myself.
