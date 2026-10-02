# Pass 1: UI and UX architect (Dani Sorensen), onboarding and tutorial, round PJ

Read off the code and the `onb-shots/` screenshots. I did not walk it in a browser, so taps after the first story are counted from code and marked "est".

GRADE: 42/100

## The job

A stranger hires this to answer one question in four seconds: "is this safe, and is it for me?" Then to feel one thing move, then run one release. In their words: "Show me it is real without homework."

## The count

- **Taps to the first finished release, guest path:** 12 or more. Guest 1, Come in 1, Try one thing 1, yes/no/nothing 1, Next 1, Go in 1, Write door 1, text box 1, Commit 1, then est. 3 to 5 (pick address, open release, Run release).
- **Real decisions before it:** 6 or more. The TDD (the written first-experience plan, section 23) rules one.
- **Words before the first act:** about 330 across four cards. Card 2 alone is about 113 words, roughly 95 seconds of reading before anything is felt.
- **Simultaneous controls:** login 8. Welcome 2. "What this is" 2 real plus 4 bordered rows that look like buttons and are not, so 6 perceived. Signal test 5 plus one disabled. Last card 1. The Field behind the card at 390: about 27. The release panel before Run release: about 12 (speed, patterns, three dose picks, New and Rerun, Cancel, Run, voice, tone, buzz).
- **Type under my 16px floor:** body 15px, quiet text 13.5px, grid sub text 12.5px.

## Where they stop

- **Marcus (44, creative director, level 7): the first frame.** A centred card over a dimmed app, two buttons, four tiny dots. It reads as a cookie dialog. This is the owner's own reaction.
- **Angela (36, seeker, level 5): "What this is".** She taps a bordered row, nothing happens. Then she lands on a Field of 27 controls with no door in view. The shot `390-tut-0` is that bare Field: the tutorial does not appear by default.
- **James (57, C suite, level 3): the signal test.** "Put both feet on the floor" is a boardroom exit. Esc or Not now sets `onboarded=true` for good (`onboard.js` line 115), so he never sees it again.
- **Derek (39, high performer, level 7): the signal test, for time.** Ten yes, ten no, no clock. He does three each and reads "Nothing moved this time" as his failure.
- **Diane (46, founder, level 6 by my read): "Two minutes".** Untimed, and untrue (below).
- **Sofia (41, practitioner, level 8): pace.** She wants Skip in four seconds. Not now drops her on the busy Field.

## Defects in the code

- **Focus is lost on every step.** `obRender` rewrites the sheet, the focused button is destroyed, nothing refocuses or announces.
- **A dead button with no word.** Tutorial Continue on an empty box does nothing (`tutorial.js` line 180). It is the trap he named on the signal test, in a new coat.
- **Two and a half first-input surfaces:** tutorial step 0, the Field door "Write what happened", the Story tab.
- **A faint watermark figure** overlaps the welcome paragraph at 390.
- **The true length is hidden.** 12 lines at four seconds is about 48 s. Add his 50 s opening and the 120 s settle and it is near four minutes (est, from code comments).

## Criteria, current

1. First four seconds: 5. Right sentence, wrong object.
2. Taps: 4.
3. Decisions: 3. Six against a ruling of one.
4. Load per screen: 6. Cards are light, the ground behind is not.
5. Words before the act: 3.
6. Pacing and feedback: 4. No clock on a timed exercise, one dead button.
7. Escape and honest controls: 5. Esc is permanent; Not now lands on the wrong screen.
8. Accessibility: 3. Focus lost, no live region, text under floor.
9. Flow as one object: 4. Welcome, tutorial and door disagree on the first input.
10. Fit across levels 3 to 8: 5.

## The soul

"This is you, and it is okay," and the figure of seven seats standing still. Keep both. Change the object around them.

## What breaks

A person reads a lot and presses a lot before anything is felt. His scripted exercise (ten yes, ten no) is already a timeline and is printed as paragraphs.

## Recommendations for the NEW onboarding

**1. The automatic slider (L). Moves Angela, Marcus, Diane, Derek.**
Black stage, no card, no dimmed app. Same stage as the release (direction A).
- **Dwell rule:** 2.5 s plus 0.32 s per word, clamped 3.5 to 9 s.
  - 1: figure assembles, 0.07 s a dot. "This is you, and it is okay." then at +1.6 s "No judgment. Nothing here grades you." 6.5 s.
  - 2: "Welcome to a neurosomatic experience. Awareness and intuition is a tool we use to turn your senses inward." (his line, verbatim) 8 s.
  - 3: the loop as a ring, four arcs lit 1.1 s each, avatar at the centre. "Discover. Play. Flow. Embody." Then "Your avatar sits in the middle. It changes when you release." 7 s. It closes, never a list.
  - 4: breath ring grows 4 s, shrinks 4 s, twice (16 s). "Think yes." pulsed ten times at 1 s. "Think no." ten pulses. His own "ten times", kept, now paced by the screen. 36 s.
  - 5: "Did they feel different?" Yes, No, Nothing, 10 s window. A timeout records null, never "Nothing", because Nothing is a real answer.
  - Total about 70 s, against 330 words and an untimed two minutes.
- **Controls, 390 wide, 16px gutter, safe area kept.** Top: display only progress segments (3px, the fill is the clock) and a quiet Skip, 44 by 44. Bottom thumb row: Back (ring, 44), Pause (ring, 56), Next (ring, 44), Sound (ring, 44). No filled button while it plays.
- **Touch.** Finger down freezes the clock. Release under 250 ms latches the pause (tap to hold). Release after a hold resumes after 300 ms. Pause keeps its label and `aria-pressed` carries the state. Back returns to the previous beat and restarts it; at beat 1 it stays, dimmed but present. Tap zones are only shortcuts. The visible rings are the contract.
- **Skip lands on the starting point screen**, never the Field. A quiet "Not now, take me to the app" sits under the tiles; Esc does the same. Neither sets `onboarded` until a first release is done.
- **Type and colour.** Hero 30px at 390, 40px at 1600, weight 300, line 1.25. Sub 18px. Labels 16px. Roles: stage black, hero ink, sub mid, one accent for playhead and pause, seat hues only on the figure.
- **Motion.** Beat change: 400 ms crossfade, 8 px rise, `cubic-bezier(.22,1,.36,1)`. Breath: `cubic-bezier(.37,0,.63,1)`.
- **Reduced motion.** Figure static, no drift, no rise, 150 ms fade. The clock still runs and the pause rule holds.
- **Keyboard and screen reader.** Pause first in tab order. The clock stops while any control has focus. One polite live region speaks each beat once. Sound is off and never plays before a press.

**2. Voice goes in the release, once (S). Moves Angela, Sofia.**
His 49.7 s opening is the release's welcome (a standing ruling). If the slider played it too, a person hears it twice in two minutes. So the slider is silent and the release opens on the voice, with beats at the phrase starts in the timing file (1.85, 4.88, 8.73, 14.9, 18.85, 22.58, 27.13, 29.89, 40.86 s). Show only confirmed words. The webm is 143 KB, about 191 KB as base64, under 10 percent of the build. The Sound ring starts it inside the press, which phones require.

**3. The one decision is the starting point (M). Moves Angela, James, Derek.**
Auto stops here. "What brought you here?" 12 tiles, three across and four down, each 112 by 64, 8px gap, 16px labels, Pain in and Fatigue out as ruled. With Back and Not now that is 14 controls, over my 12 target. It is one pick of recognisable words, so I accept it and flag it. A tap fills the ring for 600 ms, then the release starts. Under the tiles: "About four minutes. Stop any time."

**4. Skip the release panel on a first run (S). Moves all.** 12 lines, speed 1, default dose, voice per the Sound ring. The 12 control panel waits for run two.

**5. The tutorial folds into the aftercare (M). Moves Sofia, Marcus, Derek.**
Delete the five card tutorial and its Next presses. After the release, the same slider grammar (5 s a beat) plays "what just happened" from the person's own data. The last beat is the journal: "Now say what is on you, in your own words." This moves his round NE ruling (journal first) to after the release, because levels 4 and 5 stop at a blank page. He can overrule.

**6. Account after the release (S, ruled).** "Keep this": username or email, optional recovery email, the ticked agreement box.

## What to instrument

Held on the record as dated flags, nothing sent:
- Dwell, pauses and backs per beat (many pauses means too fast or too strong), and skip by beat.
- Reached the starting point, tile chosen, release started, release finished.
- Seconds and taps from first paint to a finished release.
- Sound on rate, and whether the compare chips were answered.
- Five real strangers at 390, watched.

## Grade delta

Current 42. Predicted 78 for this proposal, unbuilt: taps 12 to about 4, decisions 6 to 1, words before the act 330 to about 60, focus and type floors fixed. Capped by the 14 control tile screen and the honest four minute length.
