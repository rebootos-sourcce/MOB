# Review brief: the onboarding and tutorial, visual and behaviour (round PJ, 2 October)

Standing framework: `REVIEW-FRAMEWORK/README.md` (three passes, ICP simulation, tally).
Subject: the whole first experience, from the first frame to the first completed
release: boot, login, the welcome card, the signal test, the day one tutorial, the first
release, the first reading, and the way out into the app.

The owner's words (verbatim, round PJ): "I don't like the onboarding design aesthetic.
Visual at all. Team to do what they did with their last round bounce it amongst
themselves simulate it amongst themselves in the ICPs etc same framework as before ...
I don't like that I have to keep pressing buttons. So I want this to be an automatic
slider." And: "I want you to move onboarding and tutorial up. I can review that while
you're still building."

## What he wants, read plainly
1. A new visual aesthetic for onboarding and tutorial. He rejects the current look
   entirely (a centred modal card over the dimmed app, small dots, two buttons).
2. An AUTOMATIC SLIDER: the experience advances by itself on a timer, the way a story or
   a title sequence does. A person should not have to press a button to move on. Think
   through: pace per slide, pause when touched or held, tap to hold, back, a quiet skip,
   reduced motion, sound off by default but a voice track possible (his recorded opening
   voice exists: `audio/atuned-opening.wav`, 49.7 s, phrase timing in
   `audio/atuned-opening-timing.json`), how the slider hands over to the one real action
   (choosing a starting point, writing the first story) without a button wall, and what
   happens at 390 wide.
3. It must still do its job: get a stranger to a first release with one decision, no
   paywall before value, advanced things hidden.

## Screens to look at (open with the Read tool and LOOK)
- REAL BUILD, what ships now: `/tmp/claude-0/-home-user-MOB/e909b21c-7092-5fcd-af76-1092a869307f/scratchpad/onb-shots/`
  (`1600-ob-N.png`, `390-ob-N.png` the welcome and signal test steps; `1600-tut-0.png`,
  `390-tut-0.png` the day one tutorial).
- The first real screen is the LOGIN (boot ring, then Login: Log in, Create account,
  Guest). Earlier skin review shots used `dev=1` and skipped it. See `ui/login.js`.
- Mockups already made: `mockups/onboarding/` (`png/login-a-*`, `onboarding.html`,
  `tutorial.html`, `strips.html`, `index.html`), `mockups/release-redesign/`.
- Source: `atuned_src/ui/onboard.js`, `ui/tutorial.js`, `ui/login.js`, `ui/release.js`,
  `shell/head.html` (`.ob-*` classes).
- Docs: `ATUNED-onboarding-first-experience-TDD.md` and `-REVIEW-1-product`, `-REVIEW-2-systems`,
  `-REVIEW-3-narrative`, `DESIGN-onboard.md`, `DESIGN-firstrun.md`,
  `DESIGN-onboarding-narrative.md`, `DESIGN-funnel-welcome.md`, `FEELINGS-WHEEL.md`,
  `REVIEW-skin/` (the last round: `TALLY` ideas, pass 2 and the shared type, colour,
  motion tokens), `TASKS.md` rounds OT, OX, PA, PB, PD (his rulings, quoted).

## Fixed rulings (do not argue; design around them)
Login A (ring) with ONE row Log in, Create account, Guest; blue logo; username or email;
optional recovery email; a ticked agreement box; the account is created AFTER the first
release and the story and data pass over (birth data excluded). The gift is a counter of
100 and the whole reading is visible during the gift. The Mirror cause is the person's own
second answer. Ten integrity laws (Truth, Transparency, Unity, Humility, Compassion, Duty,
Accountability, Patience, Temperance, Forgiveness) in the starting session; answers are
evidence only. Twelve starting points (Pain in, Fatigue out). Mini release is 12 lines.
First run stem: "I am releasing believing, thinking, feeling, behaving and acting that I
am ...". Somatic line: "Welcome to a neurosomatic experience. Awareness and intuition is
a tool we use to turn your senses inward." NO permanent safety line: the sniffer must
detect distress and respond. The loop is discover, play, flow, embody, a circle never a
list. The avatar is the centrepiece. The release screen is direction A: black stage, the
prompt as the large hero text, a small address ring upper left, stats upper right, no
scroll, opens on his recorded voice. No em dashes, sentence case, no wellness language,
muted palette argued from autonomic response, icons are rings not fills. One HTML file,
no dependencies, no network.

## Report format and the passes
As in the standing framework. `GRADE: NN/100` for the CURRENT onboarding in your
discipline, six to ten criteria out of ten with evidence, THE SOUL, WHAT BREAKS, then
RECOMMENDATIONS for the NEW onboarding: specific values (timings per slide, type sizes,
colours as roles, motion curves, exact lines of copy), S, M or L, ICPs moved. Plain short
words, terms explained in the same sentence, no em dashes, under 1500 words, write only
your own file. Pass 2 and pass 3 as `PASS2-INSTRUCTIONS.md` and
`REVIEW-FRAMEWORK/PASS3.template.md` (pass 3 must include the ICP simulation of the NEW
proposal and end with a build spec for the auto slider the build agent can implement).
