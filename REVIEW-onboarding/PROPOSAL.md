# The unified onboarding proposal (lead's merge of pass 2, round PJ)

Twelve pass 2 reports converged. This is the proposal pass 3 simulates, grades and turns
into a build spec. Where seats split, the lead ruled and gave the reason. Pass 3 may argue
a ruling only with evidence from its discipline.

## The shape
One room, one figure, one clock. The boot's end frame (the standing figure) is the first
frame and it is the avatar. A silent timed film plays, then ONE decision waits, then the
person writes one true sentence, it is read back, a 12 line release runs, and the
person lands on the Field. No card, no dimmed app, no dots, no Next button.

## Sequence
0. Login A first (ruled): Log in, Create account, Guest. "There is more running you than
   you can see." lives here. Developer options hidden from strangers: behind `?dev=1`, and
   still reachable on the owner's copy (build agent decides the mechanism, he must keep
   them lower right).
1. Transit from login (fields fade 180 ms, ring zooms and fades 520 ms; fit to gate 12
   durations 120/220/320/420 ms or name a gate edit).
2. REEL A, five silent slides on one clock, about 26 s: slide 1 is the ruled
   "Welcome to a neurosomatic experience." (whitelist that string for the V1 voice rule);
   slide 2 the ruled "Awareness and intuition is a tool we use to turn your senses
   inward."; then the mirror line, the proof row (one real engine row, "112 addresses"),
   and the loop closing as a circle. Max 12 words a slide. Dwell = max(3.0, 1.0 + words/2.5)
   rounded up to 0.5 s, cap 7.0 s. Narrative's script table is the starting text.
3. THE GATE: "Pick your starting point." Twelve starting points as ring chips (3 by 4 at 390,
   a ring around the figure at 1600). No timer, no Next. Choosing one is the advance and
   lights that seat on the figure. The clock NEVER advances through a decision or the story
   box. Skip and Esc land here, never in the app.
4. THE STORY: the ruled stem is the hero ("I am releasing believing, thinking, feeling,
   behaving and acting that I am ..."), feeling chips beneath, finish it in your own
   words. The READING IS NEVER EMPTY: the starting point seeds the sentence; an empty read
   says "Nothing in that matched a pattern. Name how it felt." A first Mirror line shows
   within a few seconds of commit, no digits.
5. THE RELEASE: the first release is the real onboarding. 12 line mini release (4 s a line,
   about 48 s) then the 120 s settle with a quiet Skip from second zero. His recorded voice
   opens THIS screen only (sound off by default, one "Hear it" ring). Until he confirms the
   ten phrases, no draft word prints; captions are the shipped REL_WELCOME lines. Gift
   counter is the engine's number (100 falling toward 88), never typed.
6. REEL B, the aftercare, after the reading: reading shown; the loop as a closed circle and
   the word "avatar" said once (first change); optional signal test as an offered door
   (three ring chips, unanswered stores empty, never "Nothing"); then "Keep this" and "Not
   now" at equal weight with one line saying what leaves the device; the ticked agreement
   box and username or email fields appear here only (never for Guest). Then the figure
   arcs into the real Field hub.
7. The five card tutorial dies as a first-run flow and survives as a profile replay.

## Controls
Hold (over 180 ms) pauses; tap right two thirds to go on, left third to go back (a second
tap within 1.5 s goes back a slide); a visible 44 px ring Pause; a quiet Skip (16 px, not
smaller) top right; sound is off by default; reduced motion keeps the timer, end states,
200 ms fade, dwell times up 1.5 times, Pause shown from frame one. Progress: a 2 px
hairline at the top with one segment per slide (ruled over the ring: a ring already means
the loop and the twelve starting points, and a third ring meaning breaks one word per
concept). Only keyboard focus (focus-visible on the Pause ring) pauses the clock, not mouse
focus. A distress hook pauses the whole sequence and replaces it with the plain stop frame:
everything still, no colour, audio fades in 300 ms, no auto advance.

## Look
Stage `#06060a` in every lighting, opaque; the Field draw loop and the app's keyframes are
stopped while it is up (`visibility:hidden` on the app root); no glass, no blur wash, one
radial light at 12 percent. Shipped seat colours (`PAL` in `engine/data/canon.js`, owner
ruled it punched up ten percent) stay; seat hue only on small marks (12 px or less) or a
glow of 12 percent or less; an unlit seat is ink at 40 percent, never its own hue faded.
Type: 11, 13, 16, 20, 28, 44 (the skin round scale); hero 44 over 1600 and 28 at 390,
weight 300 on the 44. Radii 10 and 999. Motion verbs: still (unread) then breathe (from the
first reading), travel, land; the figure is Still until the first reading. Text in 420 ms,
out 220 ms; no visual modulates between 3 and 30 Hz (his audio has a 6 Hz beat).

## Words that go
"it is okay", "Nothing here grades you", "Two minutes", "making us sick", "Nothing to fill
in", "Not now" as a pill on the first card, "Developer options" on the public door.

## Engine facts the build depends on (separate blocks in the plan)
J0 distress detection (ship blocker), J8 the gift honoured in `planSight`, a never empty
read, `obAct(profile)` deriving position from stored facts (no step stored), additive
`journey:{start,handedAt}`, the clock as one tick in the existing `loop`, `pSave()` results
checked in `stCommit` and `relCoolDown`.

## Open, settled by lead, revisable
Length 26 s (range seen 18 to 31); hairline over ring; shipped PAL over the quieter canon;
signal test after the first reading; voice on the release only; tutorial folded into Reel B.
