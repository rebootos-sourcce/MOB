# Pass 2: collaboration (round PH)

You have already written pass 1. Now read EVERY report in `REVIEW-skin/pass1/`
(eleven or twelve files; the QA measurement report may land while you work, read it
if it is there). Write `REVIEW-skin/pass2/<your-seat>.md`, under 1400 words, plain
short words, no em dashes, each term of art explained in the same sentence.

Do these, in this order:

1. AGREEMENTS. Findings two or more seats made independently. Name the seats. These are
   the strongest signals. Known already, confirm or correct: the avatar is not the
   centrepiece on screen (Character tab locked and empty, Avatar tab has no figure); the
   loop is drawn as a row of four, not a circle; the seven seat hues carry many meanings
   (colour collisions, CQ painted in two colour languages); about 30 to 43 font sizes and
   no type scale; Start Case labels vs the sentence case ruling; locks read as a shop
   (about nine padlocks on the first Field screen); the unread state prints verdicts and
   has no promise; the 390 wide "not read yet" pill overlaps the zoom buttons.
2. DISAGREEMENTS. Where another seat contradicts you or another seat, say who, what, and
   which side you take and why. Examples to settle: should the avatar sit behind a tier
   lock; is the ring-shaped loop nav a skin or a redesign; is the Source OS wordmark
   contrast a defect or an owner ruling; do seat hues keep their place meaning
   (a ruling: "hue is the language and does not move") while state colours separate.
3. WHAT I MISSED. Things you did not see in pass 1 that another seat saw and that
   change your discipline's grade or recommendations.
4. THE PROPOSAL, TOGETHER. Propose your part of ONE unified onboarding proposal, written so it fits with the
   other seats' parts: tokens (type scale, radii, colour roles, motion verbs), symbols,
   copy rules. Be specific: values, not adjectives. Say what must be agreed with which
   other seat before it can be built.
5. REVISED GRADE: `GRADE: NN/100` (was NN). Say what moved it and why.
6. TOP 5 RECOMMENDATIONS for your discipline, ranked, each S/M/L, each naming which
   ICPs (ideal customer profiles, the kinds of person we build for) it moves.
7. ONE QUESTION for the owner only if you are truly blocked. Otherwise write "none" and
   state your decision and your reason. (The owner ruled: seats decide, he is tired of
   questions.)

Facts that are rulings, not arguments: sentence case is the rule in CLAUDE.md. A recorded
ruling at DECISIONS.md around line 353 asked for Start Case on some labels and the CSS
follows it; treat the two as in conflict and RECOMMEND which wins, with the reason.
Write only your own file. Read only otherwise.

## Round PJ specifics (settle these, each seat gives its side and a reason)
Read all pass 1 reports in `REVIEW-onboarding/pass1/` (twelve; the QA report may land
while you work). Agreed already, confirm or correct: a full bleed black stage replaces the
centred card; no dots, a progress ring or hairline; hold to pause, tap thirds, a quiet
Skip that lands on the starting point screen not the app; the clock never advances
through a decision or the story box; the first release is the real onboarding (today a
stranger never reaches one); sound off by default; reduced motion keeps the timer;
"it is okay" and "making us sick" go; distress detection is a ship blocker for the first
story (nothing detects it today).
Settle: (1) total length before the first decision, 22 s vs 28 s vs 70 s, and slide count;
(2) the dwell formula (1.0 + words/2.5, 1.2 + words/3, 2.5 + 0.32 per word, 1.2 + 0.35 per
word); (3) the recorded voice: on the slider, or only on the release opening, and what it
means that every phrase in `audio/atuned-opening-timing.json` is `confirmed:false`;
(4) the signal test: before the first release, after it, or in the tutorial; its hold or
chip mechanic; (5) does the day one tutorial fold into the slider after the release;
(6) the seat palette: the shipped `PAL` in `engine/data/canon.js` vs the quieter canon
colours; (7) the first slide line (`Welcome to a neurosomatic experience.` ruled, vs
"This is you", vs "There is more running you than you can see"); (8) progress mark: ring
of arcs vs hairline segments vs ten ticks; (9) Login A as the first screen; (10) account
fields and the ticked box placement (after the first release); (11) what the person
does at the end of the slider, one decision, the twelve starting points; (12) the 12 line
mini release run length and what the person sees.
Your section 4 is ONE unified onboarding proposal as exact values (timings, sizes, colours
as roles, curves, copy lines) that the build agent can implement.
