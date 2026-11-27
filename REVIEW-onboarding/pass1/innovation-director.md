# Pass 1: innovation director (Rua Whitmore). Onboarding and tutorial, round PJ

## The ordinary version, named

What ships now is the 2019 wellness onboarding: a centred modal card over a dimmed
app (`1600-ob-0.png`), a headline ("This is you, and it is okay."), a small stock-looking
figure, two buttons, four dots. The signal test (`390-ob-3.png`) is a wall of six
paragraphs and three answer buttons plus Next plus Back, five controls on one phone
screen. The dots tell a stranger nothing except that there is more to press. The tutorial
sheet is a separate second product with its own "Day one" card. Note: `390-tut-0.png`
shows the bare Field with no tutorial, and "not read yet" collides with the zoom buttons.

The obvious "fix" is the same card on a timer: Instagram stories with a gradient. That is the
rerun, and I kill it as an idea. Tap zones, hold to pause and a thin progress line are table
stakes. We ship them and do not call them innovation.

## Prior art, including the failures

- Duolingo (value before account): shipped, worked. Works because the first task costs
  nothing to do. Ours costs a confession, so the escape has to be built in.
- Headspace, Calm, Apple Breathe (a swelling bubble): ordinary, a timer with decoration.
- Super Mario 1-1, Portal room one, Outer Wilds: the tutorial is the game. Nobody
  explains; the first minute is the real thing with the safety off. This is the one I
  trust.
- Spotify Wrapped, 16Personalities: the shareable result card. A rerun, wrong for self report.
- Seismograph, oscilloscope, a 3am ECG: they show the flat line first. You only see a
  deviation if you watched the zero.
- Failed: "sample result" previews in quiz apps. Nobody believes someone else's result is theirs.

## The six ideas

### 1. There is no tutorial. The first release is the onboarding.
- **One sentence:** The intro is not about the instrument, it is the instrument running
  itself once, and the person is inside it by the end.
- **Sees:** One full-bleed sequence on the black stage (release direction A): his voice sets the
  body, the stem "I am releasing believing, thinking, feeling, behaving and acting that I
  am ..." arrives as hero text, then the 12-line mini release plays on the same clock.
  No card, no dimmed app, no dots.
- **Data:** the real release script (`release.js` already builds a run as a script, not
  a ticker), the real engine reading of the one sentence they give.
- **Cost:** L. Needs the mini release run to be callable with no profile and no account
  (account comes after, per ruling).
- **ICPs moved:** all. Most for Whitney (phone only), Renata, Toby.

### 2. His recorded voice is the clock.
- **One sentence:** The slider does not run on a timer, it runs on his 49.7 second
  recording, and the screen is the same timeline when the sound is off.
- **Sees:** Slide changes land on his phrase boundaries (feet 4.88, inside the body
  8.73, breath 16.55, exhale 18.85, release 27.13, the stem 29.89). Silent, the same
  times run as a clock with captions. The seam he ruled, human voice then AI reads the
  list, falls where his recording already hands over at 40.86.
- **Data:** `audio/atuned-opening-timing.json`. The phrase boundaries are measured and
  reliable. The words are an offline draft marked `confirmed:false`, so the screen shows
  no spoken text until he confirms each line. Captions come from his confirmed copy only.
- **Cost:** M. Sound starts on the tap that chose Log in, Create account or Guest, which
  is the gesture a browser needs.
- **ICPs:** Marta (acute, a human voice), Camille (practitioner hears craft), Nils (skeptic
  hears a person, not a model).

### 3. Show the zero first. The reading is a deviation from a line you watched.
- **One sentence:** The first frame is the empty instrument at rest; the last frame is the
  same view with only what the person said changed.
- **Sees:** The Field and standing figure, seven seats dark, a flat trace and the line
  "Nothing read yet." Each release line that lands writes one deposit onto a seat, live.
  The reading is never presented at the end, it has been forming for a minute, and the
  final frame simply holds still. The gift counter ticks down in a corner while it
  happens, as ruled (whole reading visible during the gift).
- **Data:** `parseStory`, per-line charge, `planAllowance` for the counter (check how
  many patterns a single mini line draws; `RUN_MIN` is 4 per run).
- **Cost:** M. The deposits already exist in the engine; the work is pacing them.
- **ICPs:** Nils, Desmond (executive readers): they can see it is computed, not guessed.

### 4. Every cut lands on an exhale.
- **One sentence:** Slides change only on the out breath, so the movement itself is the
  calm.
- **Sees:** One ring swells 4 s and falls 6 s (the pace of his "deep breath, slowly
  exhale"). The picture changes at the bottom of the fall, never at the top. The ring is
  the progress mark. Dots are gone.
- **Data:** none, it is a quantised clock. Argued from the autonomic response: the out
  breath is when the heart slows, so a change of picture there asks for no startle.
- **Cost:** S. Cheap to test: do fewer people stop before the stem.
- **ICPs:** Marta, Ezra (shift supervisor, wound up), Renata.

### 5. The answer is how long you hold, not which button you press.
- **One sentence:** The signal test asks nothing with buttons: you hold the screen during
  the word that felt heavier.
- **Sees:** YES pulses ten beats, NO pulses ten beats (about 3 s a beat), then both words
  replay once, quickly. The person holds anywhere during the one that felt different.
  Held on neither: "Nothing stood out", kept as a real answer. The three buttons stay
  visible but quiet for keyboard, switch and screen reader.
- **Data:** hold duration against a fixed threshold, stored as the same `yes`, `no` or
  `none` the engine already takes (`OB.felt`). Nothing new reaches the axes.
- **Cost:** M. **I would bet a third of my love for this is unusable.** Test the crude
  version on 8 people before it gets near the build. If the hold reads as a game, cut
  it and keep the buttons.
- **ICPs:** Whitney (thumbs, one hand). Risk: Nils may read a duration as theatre.

### 6. The one decision is the stem, with the blank left open.
- **One sentence:** The only choice a stranger makes is how to finish a sentence.
- **Sees:** The stem as the hero text with a patient cursor. The twelve starting points
  sit as quiet one-word completions around it; touching one finishes the sentence for
  them, typing or speaking one finishes it in their own words. No Next button, no form.
  If nothing is done for 20 s the clock does not push: the screen stills and the voice
  says nothing.
- **Data:** the twelve starting points, then `parseStory` on whichever words result.
- **Cost:** S to M.
- **ICPs:** Whitney, Toby, Marta (a way in with no blank page).

## Killed, out loud

- Sample reading or persona demo (a rerun; a worked example is someone else's body).
- Shareable result card (breaks the privacy line).
- Microphone breath detection (the permission prompt costs more trust than it earns).
- Gyro tilt and parallax on the figure (a trend I track, decoration here).
- A generated welcome (needs a model and a network).

## What would have to be true for this to be a bad idea

- A stranger will not write a sentence in the first minute. The test is the share who
  reach the stem and type something.
- Autoplay sound is blocked or unwanted: ideas 2 and 4 must be complete silent. If the
  silent version is thinner than the voiced one, the design is wrong.
- The sniffer detects distress mid sentence and the clock keeps running. It must stop
  the whole sequence. No permanent safety line was ruled, so this is the only guard.
- Fixed pacing hurts slow readers. Hold must pause everything, at 390 wide too.

## Grade of the CURRENT onboarding (innovation)

- Novelty: 2/10 (card, dots, Next).
- Truth to the instrument: 6/10 (real signal test, real figure).
- Teaches by doing: 3/10 (four steps of reading before one act).
- Uses our own assets: 2/10 (the recording is not in it).
- Honest about the person's state: 5/10.
- Phone: 3/10 (five controls; tutorial missing at 390).

GRADE: 36/100.

## THE SOUL

One true sentence, put on your own body by a quiet machine, with no button pressed.

## WHAT BREAKS

A dimmed app behind a card. Six paragraphs before one act. Two products, not one.

## Crude build to put on screen today (grade delta I am held to)

A single HTML in `mockups/` driven by the phrase times above: silent captions, ring on a
4 s and 6 s cycle, the stem arriving at 29.89 s, a text box at the end that runs the real
`parseStory` and fills three seats. Show it to Whitney, Nils and Marta stand ins. Target:
innovation 36 to 78 if ideas 1, 2, 3 and 6 hold; ideas 4 and 5 are optional and cheap to
cut.
