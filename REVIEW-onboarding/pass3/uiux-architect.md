# Pass 3: UI and UX architect (Dani Sorensen), round PJ

## 1. The proposal as I understand it

A stranger opens on one black stage with one figure, watches a silent film of about 26 seconds that advances itself, makes one choice (a starting point), writes one true sentence, and goes through a first release that is the onboarding. Then the reading shows, one ask ("Keep this") is made, and the figure enters the Field. The clock never runs through a choice or the writing box.

The merge kept my main points. It lost four things I care about: the honest time line at the gate (the true length is about five minutes), the Guest definition line, a way out of the gate (Skip lands there, so nothing is left to leave by), and the phone's Back gesture, which will close the whole app mid-film. It also misreads one thing: Reel B packs five jobs (reading, loop, signal door, ask, form) into one grammar. It should be three screens.

## 2. The ICP room

**Marcus (founder, level 7).** Sees a title sequence, not a dialog. Taps Guest, then taps right to speed up, which works. Stays: no sign up before value. "Good, nobody asked for my email."

**Whitney (phone only, esoteric native, level 5).** Sees the ring and "There is more running you than you can see" and leans in. At the story box the keyboard covers half of a 28 px stem. Her thumb swipes Back and the app closes. "It's beautiful. Wait, where did it go?"

**Nils (design skeptic, level 4).** Taps Skip at 5 s and lands on twelve tiles, not the app. Finds Leave, takes it. Stays only if the Field shows something real. "You moved the button. Fine, I'll look at the app."

**Camille (somatic practitioner, level 6).** Sees the ruled line and nods. Cannot tell if a starting point is a feeling or a place in the body. Stays. "Slow down. Oh, I can hold it."

**Marta (acute distress, 02:00).** She cannot take in five slides and uses Skip. If she writes the hard sentence, only the unbuilt distress hook protects her. Until it exists, this proposal is unsafe for her. "I can't read this much right now."

**Renata (operator, level 7, main target).** Taps through in 8 s, picks a tile, writes and reads the Mirror line. Asks "how long is the release?" and finds no answer. Skips the settle from second zero. "Give me the time, then the reading."

**Trey (quiz tourist).** Taps Guest, taps right four times, picks the top left tile, types four words. "Read it" waits for five. Leaves at the box. "I just wanted my result."

**Sofia (loves the open tables).** Sees the "112 addresses" row and is delighted but cannot open it, a row on a timer. Takes Leave. Stays only if the Field still offers the starting point. "You showed me one row and took it away."

## 3. Unified quality

**70/100 as written.**

Three biggest gaps:
1. **Distress is a hook, not a path.** The stop frame's words and exit are unwritten, and nothing detects before the story commit.
2. **The cost is hidden and the win is late.** Release is 50 s voice, 48 s lines, 120 s settle. Nothing at the gate says so.
3. **Reel B overloads.** The reading is the person's own data. A timer on it is the old card problem again.

## 4. Final grade

**GRADE: 76/100** (pass 1 was 42, pass 2 was 39). This grades the proposal plus section 5, unbuilt. Passes 1 and 2 graded the current build. Up: no card, one clock, never empty read, Skip landing on the choice, derived position. Held back: the three gaps and the 14 control gate.

## 5. My part of the build spec

**Dwell.** `max(3.0, 1.0 + words / 2.5)`, rounded up to 0.5 s, cap 7.0, as ruled. Exceptions:
- Slide 1 is 4.0 s. The figure needs 0.9 s to arrive and 5 words read in 2 s. Lead says 3.0, I say 4.0.
- Slide 2 has 13 words, over the 12 word gate. Mark it `ruled:true` and exempt it. Dwell 6.5.
- A drawn slide (loop, 4 stations at 900 ms) takes `max(text dwell, draw time + 1.0)`.
- Sum is about 26 s, under the 30 s gate.
- Reduced motion: lead says 1.5 times, I say 1.0. Timing is reading, not motion, and 1.5 times breaks the 30 s gate. Pause shown from frame one meets WCAG 2.2.2 (moving content over 5 s needs a pause).

**Loop, one object in two states.** Reel A: draws closed once, ink at 40 percent, nothing lit, no word "avatar". Reel B: the stations the person did light, "avatar" said once.

**Hairline.** 2 px, one segment per slide, 4 px gaps, top offset `max(env(safe-area-inset-top), 12px) + 4px`. Track ink at 40 percent measures 3.35 to 1 on `#06060a`, which clears 3 to 1. Fill ink at 85 percent.

**Controls.**
- Pause ring 44 px lower left above the bottom safe area. Skip text 16 px top right, 44 by 44 target.
- Skip means move past timed content. Leave means exit to the app. At the gate Skip is absent and Leave sits bottom centre, 16 px, 44 target, beside Back. "Not now" belongs to Keep this only.
- `pushState` once per slide and per act, so the phone Back gesture steps back one slide and never leaves.
- Only `:focus-visible` pauses (keyboard focus, not mouse).

**Gate.** Title "Pick your starting point." Under it, 16 px: "One word. You can change it." Then the time line, computed from the cue table, never typed: "About five minutes. Stop any time." The chosen tile holds its ring fill 600 ms, and Back stays live. Count at 390 is 14 (12 tiles, Back, Leave). Accepted: recognised, not weighed.

**Story at 390 with the keyboard.** Read `visualViewport`. Under 460 px high: stem drops from 28 to 20, chips become one 44 px row of three, box is 2 lines, "Read it" is a 44 px ring above the keyboard. Seven controls.

**Reel B, three screens.**
1. Reading: kind `act`, no clock. A "Go on" ring appears after 3 s. 16 px or more, 62 characters wide.
2. Loop and avatar: 5 s, with Pause and Skip.
3. Keep this. For Guest instead: one ring "Open the Field" and "This stays on this device." Keep this and Not now are both ink rings, 48 px high, full width at 390, 8 px gap, no accent on either. Tick box 44 px, label 16 px.
- I differ from the lead on the signal test: it is a door on the Field, not in Reel B. The ask belongs at the emotional peak, before a second body exercise. If it stays in Reel B, it goes after Keep this.

**Log in never plays the reel.** It is for Guest and Create account.

**Focus and speech.** On each act change focus the stage heading (`tabindex=-1`) and speak the slide once through one polite live region. Esc is Skip on slides and Leave at the gate.

**Distress stop frame (structure only, Narrative owns words).** `#06060a`, one 20 px line, one 16 px line, two rings: back to the stage, and Leave. No hue, motion, counter or timer. The draft is kept.

**Instrument** (dated flags on the record, nothing sent): per slide dwell, pauses, backs, Skip; ms from gate shown to first tile, and which; first keystroke delay; abandon under 5 words; empty read fallback count; Keep this against Not now. Five strangers at 390, watched, asked "What is this, and what did you do first?"

## 6. Ranked recommendations

1. **Distress hook, detector before the story commit, plain stop frame (L, redesign, ship blocker).** Marta, Whitney, James.
2. **Gate: time line, Leave, Back, "You can change it" (S, redesign of one screen).** Renata, Nils, Marta, Sofia, Trey.
3. **Reading as an act, Reel B in three, signal test to the Field (M, redesign).** Renata, Camille, Marcus.
4. **History based Back and the keyboard safe story screen (S, redesign).** Whitney, Trey.
5. **Slide 1 at 4.0 s, ruled line exemption, loop in two states (S, reskin).** Marcus, Whitney, Camille.
6. **Log in skips the reel; Guest line "Guest keeps everything on this device." on the login (S, reskin).** Renata, Nils, Sofia.

## 7. Question for the owner

None.
