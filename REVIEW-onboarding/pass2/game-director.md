# Pass 2, game director (round PJ)

Seat: Ngozi Achebe-Lindgren. I read all eleven other pass 1 reports.

## 1. AGREEMENTS

1. **Black full bleed stage, no card, no dimmed app, no blurred wash.** Art, Creative, Brand, Animation, Technical, UX, Innovation.
2. **The clock yields to the hand.** No timer over a decision or the story box. An unanswered question stores null, never "Nothing". UX, Art, Narrative, Marketing, Sales, Creative, Systems, Technical.
3. **Hold pauses, tap thirds, quiet Skip lands on the starting point, a visible Pause exists** (WCAG 2.2.2: moving content over five seconds must be stoppable). Animation, Creative, Technical, Systems, UX, Art.
4. **The first release is the onboarding.** Today a stranger never reaches one (`DEV_PLAY_TUTORIAL` is false). Systems, Brand, Marketing, UX, Innovation, Narrative.
5. **Sound off by default. His voice goes on the release opening, not the slider.** Animation, Art, Brand, Marketing, UX, Creative.
6. **Distress detection is a ship blocker.** The sniffer (the part that reads a story for danger) must be able to stop the clock. Narrative measured it: "I do not want to be here anymore." reads as nothing. Also Systems, Innovation, Creative, Technical.
7. **The loop is a circle that closes.** Animation, UX, Art, Narrative.
8. **"It is okay" and "making us sick" go** (Brand, Marketing, Narrative). **"Developer options" leaves the public door** (Narrative, Sales, Marketing, Systems). **Keep this and Not now, equal weight** (Sales, UX, Animation).
9. **Known list, confirmed.** "Avatar" appears zero times in the three files (Brand). Nine padlocks and "Heaviest Root 0.0" on the unread Field (Brand, Marketing).

## 2. DISAGREEMENTS

1. **Hold as the answer (Innovation).** Hold is pause everywhere else. One finger cannot stop the clock and answer at once, and a duration is a decision made by accident.
2. **Signal test inside the slider (Narrative, UX, Art, Innovation) or after the release (Marketing, Creative, Sales, Animation).** After. Creative is right: the test and his voice both open with "feet on the floor", so a stranger breathes 130 seconds before typing.
3. **Progress as ring (Art, Creative, Brand) or hairline (Animation, Marketing, UX).** Hairline. A ring here means the loop, lit only by an act done.
4. **Five visible rings (UX, Technical) or thirds only (Art, Brand).** Pause and Skip stay visible. Back, Next, Sound appear while paused.
5. **Guest meets the slider before the door (Marketing).** No, Login A is fixed.
6. **"Nothing here grades you" (Creative, Art, UX).** Cut, with Narrative and Brand. The product prints a coherence number, and denying a grade plants one.
7. **A labelled example reading (Marketing), a wordmark on the stage (Brand).** No to both. Nobody believes someone else's result is theirs, and the stage is figure, one line, nothing.
8. **"Avatar" on slide 3 (UX).** Brand's timing wins: named at the first change.
9. **Seat colours.** Canon, not shipped `PAL` (Art). Saturated red on black reads as alarm, the machinery we refuse to press. One table product wide.

## 3. WHAT I MISSED

- **Sales:** "I keep taking care of everybody else." reads zero hits, and my second reward, a changed address, needs a hit. Also `planSight` ignores the gift, so "everything visible" is false until the engine honours it.
- **Systems:** the first run has no write path, and a release closed halfway leaves no trace, so a keepsake at every exit has nothing to keep yet.
- **Technical:** gate 12 allows only 0.12, 0.22, 0.32 and 0.42 s, so 380 ms fails.
- **Creative:** the soul is the trade, one true sentence in and a body place out. The signal test is a cheap decision, not the heart.

## 4. THE PROPOSAL, TOGETHER

**Loop.** A person says one true thing, the instrument shows where it sits, they release it, the avatar shows the change.
| t | Beat | Clock |
|---|---|---|
| door | Login A. The tap is the sound gesture. Ring scales out, 520 ms | none |
| 0.0 | S1: "Welcome to a neurosomatic experience." Then at +1.4 s: "Awareness and intuition is a tool we use to turn your senses inward." | 6.9 s |
| 6.9 | S2: "This is you. It shows what is running you, top to bottom." Seats rise root to crown | 5.6 s |
| 12.5 | S3: the loop, four stations 1.1 s each, closing. "Discover. Play. Flow. Embody. Then round again." | 6.0 s |
| 18.5 | S4: "You write one true thing. It finds where it sits in your body." | 5.9 s |
| 24.4 | Gate: "Pick your starting point." Twelve points. No timer, no nag | waits |
| pick | Seat lights. "Starting from {point}." Stored as `journey.ground`. Then: "Your first 100 patterns are ready. Everything stays visible while you use them." | 4 s |
| release | His voice if Sound is on, same cue table silent. Stem as hero, the person finishes it, sniffer live. 12 lines at 4 s. Settle 120 s, not shortened | real |
| B1, B2 | Changed address falls, halo takes that seat, their words beside it. Counter reads 88. The whole reading | 3.6 s, 6 s |
| B3 | Keep this or Not now. Box unticked, on Keep this only | waits |
| exit | Figure arcs into the Field hub | 420 ms |

Telling is 24.4 s. Total is about four minutes, and the gate says so: "About four minutes. Stop any time."

**Dwell.** 1.6 s + 0.33 s a word, clamped 3.5 to 8 s. The offered formulas gave 7.4 to 9.8 s for the ruled line, this gives 6.9. Reduced motion multiplies by 1.5.

**Pick.** The release runs on the picked point's addresses first, then the person's words, so a zero-hit sentence still moves the avatar. The reading says which part came from which.

**Leaving.** Skip goes to the pick. After the pick, the pick is kept. Mid release, pick and words are kept and it says "Stopped. Nothing was released." No "are you sure".

**Tokens.** Ground `#06060a`, the login's, so no seam. Ink `#EFEDE8`. Accent `#7EB8D4` on Pause and the one live control only. Hero 40 px at 1600, 28 at 390, weight 300, line 1.2, 26 characters a line. Support 18, label 16, caption 12, sentence case. Text in 420 ms `(.22,1,.36,1)`, 8 px rise. Out 220 ms `(.4,0,1,1)`. Breath 4.2 s, opacity .64 to 1. Nothing per word, nothing flickering at 3 to 30 Hz. Hairline 2 px, one segment a slide, 4 px gaps. Reduced motion: 200 ms fades, Pause visible from frame one. Controls are 44 px rings.

**390 wide.** Twelve points as 3 by 4 tiles, 44 px tall at least, a ring from 600 px up. `100dvh`, safe area insets, whole screen is the hold zone, `user-select:none` for the iOS callout.

**Agree before build.**
- Narrative: final lines, the stop line, distress text signed by a clinician.
- Art, Systems, Animation: type values, the canon palette table, 420 ms so gate 12 needs no edit.
- Technical: one clock in `loop`, pause reasons (hold, hidden, focus, typing, distress), Field paused under the stage.
- Systems: `obAct`, `journey.ground`, a half release that leaves a trace, `planSight` honouring the gift.
- Owner, not blocking: confirm the ten voice phrases. All are `confirmed:false`, so phrase times drive cues and no spoken words print.

**Retention cost.** Benchmarks from elsewhere, not promises: free to play day 1 25 to 30 percent, day 7 8 to 12. Streak plus loss push bought a fifth to a third of day 7, which we give up. Planning here: day 1 15 to 22, day 7 6 to 9, and 25 to 30 percent of arrivals finishing a first release, against none today.

## 5. REVISED GRADE

GRADE: 34/100 (was 36).
- Agency 5 to 4 and button load 3 to 2: UX counted six decisions, over 12 taps, 330 words.
- The reward path is missing, not just unlit (Systems, Sales).

## 6. TOP 5 RECOMMENDATIONS

1. **One path with a write path: slider, pick, stem, release, reading, Field (L).** ICPs: Whitney (phone only), Renata, Camille (practitioner).
2. **Slider engine: one clock, gates, hold, Pause, Skip to the pick (M).** ICPs: Whitney, Derek, Marta (acute distress).
3. **The pick as first act, a guaranteed deposit, and the engine honouring the gift (M).** ICPs: Angela and levels 4 and 5, who stop at a blank page, and Renata.
4. **Distress detection gating the story step and stopping the clock (L, ship blocker).** ICPs: Marta, James.
5. **Reel B and day 2 (M):** the changed address, the account ask, "Read the same place again" as tomorrow's first door, the signal test offered once, one reminder, default off. ICPs: Camille, Nils (skeptic), Derek.

## 7. ONE QUESTION

None. Decision: the signal test leaves the first run. Reason: it repeats the breathing in his voice, adds 80 s before the first act, and the pick is the one decision allowed. It touches his ruling AN7. If he overrules, it returns as a gate slide with chips and no timer.
