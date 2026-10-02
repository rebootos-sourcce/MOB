# Pass 1, game director: mechanics and stickiness (round PJ)

Seat: Ngozi Achebe-Lindgren. Read: BRIEF.md, `ui/onboard.js`, `ui/tutorial.js`, `ui/login.js`, the voice timing file, the shots in `onb-shots/`, DESIGN-progression.md, DESIGN-gamification.md, rounds PB and PD.

## The loop, in one sentence
A person says what happened, the instrument shows where it sits in the body, they release it, and the body shows the change. Today's first session reaches the first clause in part and never the last two.

## GRADE: 36/100 (current onboarding and tutorial)

| Criterion | Score | Evidence |
|---|---|---|
| Loop reached | 3 | Welcome and signal test are a sliver of discover. No release, flow or embody. REVIEW-1-product measured it: no first release inside onboarding or tutorial. |
| First minute | 4 | Figure at rest and "This is you, and it is okay." work. The dimmed Field behind shows nine padlocks (1600-ob-3). |
| First reward | 2 | A paragraph, "A thought moved your body." Nothing on screen changes; the Field still says "not read yet". |
| Agency | 5 | Yes, No or Nothing is a real act, and Nothing is a real answer. But the person decides nothing about themselves, and six paragraphs come before one tap. |
| Reason for day 2 | 1 | No open loop, no mark, no kept place. |
| Endowed progress | 1 | Four dots are navigation. The gift of 100 is never shown. No mark is earned. |
| Honest pacing | 8 | No timers, no streak, Esc leaves, "Not now" is free. Keep all of it. |
| Session shape | 6 | Leave anywhere, but to an empty Field with nothing kept. |
| Button load | 3 | Five presses (Come in, Try one thing, Yes, Next, Go in) to arrive at an empty screen. His complaint, measured. |
| Tutorial as a game | 3 | Writes a real entry, then explains release instead of doing one. A second flow behind two dev switches (`DEV_PLAY_ONBOARDING`, `DEV_PLAY_TUTORIAL`). The tutorial shots show only the Field, no tutorial. |

## THE SOUL
The signal test. A stranger feels their own throat answer and nobody told them what to feel. That is an interesting decision in Sid Meier's sense, a cheap one, and honest. The rest is explanation wrapped around it. Keep the test, cut the explanation.

## WHAT BREAKS
- **No loop closes.** The person ends where they began, at an unread Field. A loop that returns no changed state is a lecture.
- **The reward is words.** Neither avatar nor body moves in the first session.
- **Two first runs.** Onboarding sets `onboarded`, tutorial sets `tutorialSeen`. Neither ends in a release.
- **The tutorial spends real charge on a lesson.** The entry goes through `stCommit`, so a person writes once for the lesson and again for the product. It should be one story.
- **No day 2.** Nothing is left open, kept or waiting.

## What an auto slider does to agency
A person who only watches has invested nothing. So the rule is: **the clock yields to the hand.**

- Slides that tell run on a timer. Slides that ask for an act have no timer. A timer that carries someone past a question decides for them.
- The first investment has three rungs:
  1. **Second ~20, the signal answer.** One tap. A warm up.
  2. **Second ~45, the starting point.** One of twelve. This is the real first investment, because it costs a description of themselves. It is also the one decision the brief allows.
  3. **Second ~75, the stem.** "I am releasing believing, thinking, feeling, behaving and acting that I am ..." finished in their own words. Benchmark from elsewhere: what a person produces they keep (self reference effect, d 0.45, Symons and Johnson 1997, in DESIGN-progression.md).
- If nobody acts, the slider stops on the signal slide and the ring keeps breathing. It never nags and never loops to the start.

## Where the first reward lands
Two rewards, fixed and earned, never random.
1. **Second ~25.** One instant line: "Your body answered. Yes and no felt different." For Nothing: "Nothing stood out. That is a real reading."
2. **End of the first release, after the 120 second settle (`REL_SETTLE_S`).** The released address on the body is changed, the avatar halo takes that seat's colour, and the person's own words sit beside it. Same shape for everyone who finishes.

## Endowed progress, honestly
Nunes and Dreze 2006 (34 percent against 19 percent completion) worked because a head start was given. A head start on a fake bar is a manipulation pattern, so ours is real or absent.
- **The gift is the endowment.** "88 patterns open to you." Never "12 of 100 used". The gift counter is a ruled exception to the no count against a total rule, and DESIGN-progression 2.7 governs: print what is available.
- **The loop ring lights a quarter only for an act done.** Discover on the signal answer, play on the pick, flow and embody on the release and settle. It opens empty, closes after the first release, shows no number.
- **The first mark comes from the release**, never from signing up.
- **The account ask sits here**, as "Keep this" and "Not now", equal weight. Never "save your progress or lose it", which is loss framing.

## Why a person comes back on day 2
No punishment for staying away.
1. **A retest.** Day 2 opens with the released place as the first door: "Read the same place again." A before and an after is a real unfinished measurement.
2. **Shut places in their own story.** "Two more places in what you wrote are still shut."
3. **The avatar, changed, at rest.**
4. **One optional reminder**, offered once after the first release, default off, a time the person sets, one line: "Your place is open when you want it." No streak, no loss wording.

**Retention cost.** Benchmarks from elsewhere (public mobile reports and games I shipped), not promises here: free to play day 1 about 25 to 30 percent, day 7 about 8 to 12, day 30 about 3 to 5. Streak plus loss framed push typically bought a fifth to a third of day 7. This design gives that up. Planning figure: day 1 at 15 to 22 percent, day 7 at 6 to 9, so four to eight points of day 1 against a manipulated build. That is the price of a person who can stop and be glad.

## RECOMMENDATIONS for the new onboarding
1. **Telling time under 25 seconds, then an act.** (S) Three slides, dwell = 2.0 s + 0.35 s per word, clamped 4 to 10 s.
   - About 5 s: "This is you, and it is okay."
   - About 6 s: "Everything that is running you, top to bottom."
   - About 8 s, his somatic line verbatim.
   - The claim "the stress we call normal is making us sick" moves after the signal answer, as the evidence it needs. Moves: skeptic, phone only.
2. **Signal test paced in the telling, free in the answer.** (M) A ring pulses ten times at 1.5 s for yes, then ten for no. A tap on the ring on each pulse is allowed and pauses the clock. Answer buttons have no timer. Six paragraphs become one line per phase. Moves: phone only, acute distress.
3. **The starting point is the advance.** (M) The twelve appear as the last slide and choosing one is the button. Five presses become one decision. Moves: all four mandated ICPs.
4. **One path: slider, signal, pick, stem, release, reading, Field.** (L) The release opens on his recorded voice (49.7 s, not duplicated in the slider), 12 lines, settle. The day one tutorial stops being a flow and stays as a profile replay. One entry, one reading. Moves: practitioner, skeptic.
5. **The Field is the exit, not the entrance.** (M) Arrive with the released address changed and the halo coloured. A new person never meets the unread screen. Moves: all.
6. **Exit anywhere with a keepsake.** (S) After signal: the answer line. After pick: the starting point saved. After release: mark and changed body. Skip always visible, 44 px, bottom at 390, never confirmed with "are you sure". Moves: acute distress, phone only.
7. **Reduced motion and pause.** (S) Reduced motion means 200 ms fades only. A visible pause control always (WCAG 2.2.1 and 2.2.2 for content moving over five seconds). Hold anywhere pauses. Timers stop when the tab is hidden. Moves: acute distress, skeptic.

## Telemetry
Instrument first act, starting point chosen, release completed, day 2 return. The numbers will not say why anyone left, so watch five strangers first.

## Open items
- **Voice phrases are drafts.** The timing file marks every phrase `confirmed: false`. Owner: the owner corrects each word. Until then no voice text is printed on screen.
- **Twelve starting points may be too many** (his PB question). Owner: game director, tested in the first watched session.
