# Pass 1, game director: mechanics and stickiness (round PJ)

Seat: Ngozi Achebe-Lindgren. Read: BRIEF.md, `ui/onboard.js`, `ui/tutorial.js`, `ui/login.js`, the release timing file, the shots in `onb-shots/`, DESIGN-progression.md, DESIGN-gamification.md, round PB and PD in TASKS.md.

## The loop, in one sentence
A person says what happened, the instrument shows where it sits in the body, they release it, and the body shows the change.

Every screen is measured against that. Today's first session does the first clause only in part and never reaches the last two.

## GRADE: 36/100 (current onboarding and tutorial)

| Criterion | Score | Evidence |
|---|---|---|
| Loop reached (discover, play, flow, embody) | 3 | Welcome and signal test are a sliver of discover. No release, no flow, no embody. REVIEW-1-product measured it: the first release does not happen inside onboarding or the tutorial. |
| First minute | 4 | Figure at rest and "This is you, and it is okay." are good. But the dimmed Field behind it shows nine padlocks (shot 1600-ob-3). |
| First reward, and where it lands | 2 | It is a paragraph: "A thought moved your body." Nothing on screen changes. The Field behind still says "not read yet". |
| Agency and first investment | 5 | Yes, No or Nothing is a real act, and Nothing is a real answer. But the person never decides anything about themselves, and the signal screen is six paragraphs before one tap. |
| Reason to return on day 2 | 1 | None. No open loop, no mark, no kept place. |
| Endowed progress | 1 | Four dots are navigation, not progress. The gift of 100 is never shown. No mark is earned. |
| Honesty of pacing | 8 | No timers, no streak, Esc leaves, "Not now" costs nothing. Keep all of it. |
| Session shape and exit | 6 | A person can leave anywhere, but they leave to an empty Field with nothing kept. |
| Button load | 3 | Five presses (Come in, Try one thing, Yes, Next, Go in) to arrive at an empty screen. This is his complaint, measured. |
| Tutorial as a game | 3 | It writes a real entry, then explains release instead of doing one. It is a second flow beside onboarding behind two dev switches (`DEV_PLAY_ONBOARDING`, `DEV_PLAY_TUTORIAL`). The tutorial shots (1600-tut-0, 390-tut-0) show no tutorial at all, only the Field. |

## THE SOUL
The signal test is the best thing in the product's first minute. A stranger feels their own throat answer, and nobody told them what to feel. That is a real interesting decision in Sid Meier's sense, a cheap one, and it is honest. The rest of the flow is an explanation wrapped around it. Keep the test. Cut the explanation.

## WHAT BREAKS
- **No loop closes.** The person ends where they began, at an unread Field with four doors and nine locks. A loop that does not return a changed state is a lecture.
- **The reward is words.** The only changing thing in the first week should be the avatar and the body. Neither moves in the first session.
- **Two competing first runs.** Onboarding sets `onboarded`, tutorial sets `tutorialSeen`. A stranger meets one by default and the other by developer switch. Neither finishes with a release.
- **The tutorial spends real charge on a rehearsal.** The entry is real (`stCommit`), so a person writes for the lesson and then writes again for the product. Two stories, one reading. They should be the same story.
- **No day 2.** Nothing is left open, kept or waiting.

## What an auto slider does to agency
A person who only watches has invested nothing, and a title sequence is exactly that. So the rule is: **the clock yields to the hand.**

- Slides that tell run on a timer. Slides that ask for an act have no timer at all. A timer that carries someone past a question is deciding for them.
- The first investment is three rungs, each bigger than the last:
  1. **Second ~20, the signal answer.** One tap, near zero cost. A warm up.
  2. **Second ~45, the starting point.** One of twelve. This is the real first investment, because it costs the person a description of themselves. It is also the one decision the brief allows.
  3. **Second ~75, the stem.** "I am releasing believing, thinking, feeling, behaving and acting that I am ..." finished in their own words or from the second answer that becomes the Mirror cause. This is the generation effect: what a person produces they keep (benchmark from elsewhere: Symons and Johnson 1997, self reference effect, d 0.45, cited in DESIGN-progression.md).
- If nobody acts, the slider stops on the signal slide and the ring keeps breathing. It never nags and never loops back to the start.

## Where the first reward lands
Two rewards, both fixed and earned, neither random.

1. **Second ~25, after the signal answer.** One line, instant: "Your body answered. Yes and no felt different." For Nothing: "Nothing stood out. That is a real reading." Everyone who acts gets one.
2. **End of the first release, after the 120 second settle** (`REL_SETTLE_S`). The body shows the address that was released, changed. The avatar's halo takes the colour of the seat released. The person's own words are held beside it. Same shape for everyone who finishes.

No variable ratio, no near miss, no surprise box. The cost is quoted below.

## Endowed progress, done honestly
Nunes and Dreze 2006 (34 percent against 19 percent completion, in DESIGN-gamification.md) worked because the head start was given. A free head start on a fake bar is a manipulation pattern, so ours is real or it does not exist:

- **The gift is the endowment.** Show it as what is open: "88 patterns open to you." Never "12 of 100 used". The gift counter is a ruled exception to the no count against a total rule, and DESIGN-progression 2.7 rule 1 governs: print what is available.
- **The loop ring lights a quarter only for an act done.** Discover lights on the signal answer. Play on the starting point. Flow and embody light on the release and the settle. It opens empty, closes at the end of the first release, and carries no number.
- **The first earned mark comes from the release itself**, from the ladder's sixteen, never from signing up or opening the app.
- **The account ask comes here**, as "Keep this" and "Not now", equal weight. Never "save your progress or lose it". That is loss framing.

## Why a person comes back on day 2
Four honest reasons, none of them a punishment for staying away.
1. **A retest.** The settle ends by naming the place released. Day 2 opens with it as the first door: "Read the same place again." A measurement with a before and an after is a real unfinished thing.
2. **Shut places in their own story.** "Two more places in what you wrote are still shut." A count of things in their own words, not a total.
3. **A changed avatar at rest.** The same figure they met on the first frame, now different.
4. **One optional reminder**, offered once at the end of the first release, default off, a time the person sets, one fixed line: "Your place is open when you want it." No streak and no loss wording.

**Retention cost, stated.** Benchmarks from elsewhere, public mobile industry reports and games I shipped, not promises here: free to play day 1 retention runs about 25 to 30 percent of installs, day 7 about 8 to 12, day 30 about 3 to 5. Streak plus loss framed push typically bought a fifth to a third of day 7. This design gives that up. Planning figure here: day 1 at 15 to 22 percent of installs, day 7 at 6 to 9. Roughly four to eight points of day 1 against a manipulated build. It is the price of a person who can stop and be glad. I will not hide it.

## RECOMMENDATIONS for the new onboarding

1. **Telling time under 25 seconds, then an act.** (S) Three slides, dwell = 2.0 s + 0.35 s per word, clamped 4 to 10 s.
   - Slide 1, about 5 s: "This is you, and it is okay."
   - Slide 2, about 6 s: "Everything that is running you, top to bottom."
   - Slide 3, about 8 s, his somatic line verbatim: "Welcome to a neurosomatic experience. Awareness and intuition is a tool we use to turn your senses inward."
   - The claim ("the stress we call normal is making us sick") moves after the signal answer, as the evidence it needs. Moves: skeptic, phone only.
2. **The signal test becomes paced and timed in its telling, free in its answer.** (M) A ring pulses ten times at 1.5 s for yes (15 s), then ten for no (15 s). The person may tap the ring on each pulse, and any tap pauses the clock. Answer buttons carry no timer. Cut the six paragraphs to one line per phase. Moves: phone only, acute distress (shorter, no wall of text).
3. **The starting point is the advance.** (M) The twelve starting points appear as the last slide. Choosing one is the button. No Next button, so the five presses of today become one. Moves: all four mandated ICPs.
4. **Merge onboarding, tutorial and first release into one path.** (L) Slider, signal, pick, stem, release on his recorded voice (49.7 s, not duplicated in the slider), 12 lines, settle, reading, Field. The day one tutorial stops being a flow and stays only as a replay in the profile. One entry, one reading. Moves: practitioner, skeptic.
5. **The Field is the exit, not the entrance.** (M) Arrive at a Field with the released address changed and the avatar halo coloured. Until then, the unread screen is never shown to a new person. Moves: all.
6. **Fixed reward and ring.** (M) Build the two rewards and the opening empty loop ring above. Quarter lights only on an act. Moves: skeptic, practitioner.
7. **Exit anywhere, with a keepsake at each stopping point.** (S) After the signal: the answer line. After the pick: the starting point saved. After the release: the mark and the changed body. Skip is always visible, 44 px, bottom of the screen at 390, never confirmed with "are you sure". Moves: acute distress, phone only.
8. **Reduced motion and pause.** (S) Reduced motion means 200 ms fades only. A visible pause control always, because auto advancing content over five seconds needs one (WCAG 2.2.1 and 2.2.2). Hold anywhere pauses. Timers stop when the tab is hidden. Moves: acute distress, skeptic.

## Telemetry, and what it cannot see
Instrument four points: first act reached, starting point chosen, release completed, return on day 2. The number will not say why anyone left. Watch five strangers do it before the numbers are trusted, one of them on a phone with the sound off.

## Open items, with owners
- **Voice phrases are drafts.** The timing file is marked `draft: true`, `confirmed: false` on every phrase. Owner: the owner corrects each word. Until then the screen shows no voice text.
- **Whether the starting point list is too many at twelve** (his own PB question). Owner: game director, test in the first watched session.
