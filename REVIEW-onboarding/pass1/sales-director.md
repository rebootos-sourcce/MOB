# Pass 1, sales director (Camille Boucher). Onboarding and tutorial, round PJ

Read off the build, the source, `DECISIONS.md`, `TASKS.md` and a run of the real engine. One correction: my brief said "sight is not for sale". That was reversed on 1 October (`DECISIONS.md`, "Sight by tier, round OK"). Free sees fetters only (a fetter is one of the 112 body addresses), tier one adds saboteurs, tier two complexes, tier three hyper complexes and character. I work from the reversal.

## GRADE: 39/100 for the current onboarding, sales and conversion

| Criterion | /10 | Evidence |
|---|---|---|
| Value visible before any ask | 3 | Default path is Welcome, What this is, Signal test, What just happened, then the Field reading "Nothing has been read yet" (`ui/onboard.js`). A reading first appears in the tutorial, which is off by default (`DEV_PLAY_TUTORIAL=false`). |
| No ask before value | 5 | No paywall. But frame one is credentials. Guest softens it. |
| Gift counter, seen | 2 | 100 appears nowhere in onboarding, only in the plan panel (`ui/plans.js:152`). |
| Gift, honoured | 1 | Ruled: the whole reading is visible while the gift lasts. `planSight` reads tier only. Measured: `planSees(null,'sab')` is false, so a new person sees no saboteurs. |
| Account after first release | 3 | Ruled, not built. The mockup handoff has the seed, "Keep this: choose a username", as a weak ghost button. |
| Ticked agreement box | 4 | Absent from the build. Placement is the risk. |
| Guest path | 6 | One tap. Says nothing about what Guest loses and never asks a Guest to keep their work. |
| Refuses manipulation | 9 | No countdown, no scarcity. Two small exceptions below. |
| One decision | 4 | Signal test has a disabled Next, "Pick one to go on": a forced press, the button wall he hates. |
| Measurability | 2 | No network before an account, so a Guest's drop off is invisible. |

## THE SOUL
The yes and no at the throat is the one place a stranger gets proof: they feel something and are told what it was. Keep it. "This is you, and it is okay" is earned. Everything else is explanation before evidence.

## WHAT BREAKS
Grid from `BUYERS.md`: level 7 buys at 85 percent (primary), level 6 at 65 (volume), levels 4 and 5 are the biggest crowd and hardest sell.

1. **The empty dashboard, level 7.** They want the short in the circuit. They get a breath script and text slides, then an empty Field. At 390 wide the signal test is six paragraphs plus five buttons. They leave at the second text slide.
2. **The soft open, level 6.** "Exhausted by gurus and talk therapy." A breath script sounds like what they left. The cure is a mechanism line early, not a colder voice.
3. **The blank box, levels 4 and 5.** The tutorial opens on an empty text area. Level 4 avoids the work because "clearing the node hurts"; a blank box is the work with no help starting.
4. **The zero read.** Measured in the real engine: "I keep taking care of everybody else." returns 0 hits, and so does "My boss asked me to present the work and I immediately wanted to avoid it." "I feel anxious and ashamed" returns 4 hits and names Shame. The moment of value fails on the owner's own example.
5. **The gift cliff, all levels.** Once the gift is honoured, a heavy user lives with the full chain for about 24 days (simulated walk, `TASKS.md` JE), then saboteurs and up lock. That is the true moment of decision. It is not in session one, so session one asks for no money.
6. **The self-service unlock.** `loginDevOptions()` puts "Unlock all sight" on the real login screen. Any stranger grants themselves tier four on frame one. It is a boundary not security, but it makes the lock look decorative.

## RECOMMENDATIONS FOR THE NEW ONBOARDING

**R1. Moment of value, named.** A named saboteur or imprint from the person's own words, plus what it links to (his Mirror), on screen by 90 seconds from frame one, after two inputs: one starting point, one typed sentence. M. Levels 7, 6, 4.

**R2. The feeling word cannot be missing.** Pick the starting point first. Its feeling chip (`FEELINGS-WHEEL.md`) is added to the sentence before the read. Pre-fill the stem, "I keep taking care of everybody else, and I feel ...", so the person finishes a sentence. If the read is empty, say "Not quite. Which part?" and never show an empty Mirror. M. Levels 4, 5, 6.

**R3. What the slider says about price: nothing.** No tier, price, "free", "trial", "limited" or clock. The gift is said once, as a quantity:
- Exact line: "Your first 100 patterns are ready. Everything stays visible while you use them."
- A ring with 100 in neutral role colour, held 4 s, after the starting point is chosen. No red or amber at any count.
- After the 12 line mini release it reads 88.
- If a run cannot be afforded, once: "This run needs 12. You have 8. A shorter run costs 4."
S. All levels.

**R4. Pace.** Auto beats, hold on touch, tap to hold, quiet Skip:
- Slide 1, 7 s: "Welcome to a neurosomatic experience. Awareness and intuition is a tool we use to turn your senses inward." 22 words, about 6.6 s to read.
- Slide 2, 6 s: "There is more running you than you can see. You write one thing. It finds where it sits in your body."
- Slide 3, 5 s: the gift line.
- Then it stops. A screen that needs a decision has no timer, because a timer on a choice is pressure. About 18 s hands off in total.
S. Levels 6, 7.

**R5. Order for the doubters.** Move the signal test after the first Mirror: proof by the reading first, proof by the body second. Un-disable Next; "Nothing" stays a real answer. S. Levels 6, 7.

**R6. Account after the first release.** Handoff shows the Mirror, then one decision, two buttons of equal weight: **Keep this** and **Not now**. Username 3 to 20 characters, optional recovery email, birth data stays behind (ruled). M. Levels 7, 6, 4.

**R7. The ticked box.** On Keep this only. Never on Guest, never on frame one. Unticked by default. One row: "I am 18 or older. I agree to the Terms and the Privacy policy." No second box (research sharing is off). The 7 day no-refund box stays on the paid step, so nobody accepts refund terms by saving a username. S.

**R8. Guest, honest.** "Try it on this device. Clearing the browser clears it." Offer Keep this once after the first release, once when the counter passes 50, then only as a quiet profile item. Never a block. S. Levels 4, 5.

**R9. Honour the gift in code.** While `planAllowance` returns `inGift`, `planSight` sees everything. At 12 left: "One run left in the gift. After it, saboteurs show on tier one." That names the lock and does not sell. M, an engine change. The ruling is already given, so I call it a defect. Levels 7, 6.

**R10. Tiers, no change.** $12, $29, $59, $99 for 400, 800, 1200, 1200 patterns is 3, 3.6, 4.9 and 8.3 cents a pattern. Free is 10 a week, about 43 a month, so tier one is about nine times the ground for $12. Tier four's extra $40 buys the lead suite, not patterns. The work is in the moment, not the price. Never publish cents per pattern (ruled).

**R11. Remove.** Developer options off the production login (`?dev=1` only). Replace "Two minutes" with a time measured on a clock run of the real flow; the breath script alone is ten breaths and twenty thoughts. S.

## THE QUESTIONS (behaviour, not opinion)
1. Record locally what a person does first after the first release and after how many seconds. In interviews: "Show me what you did right after your first reading." Five people per level, 4 to 7, screen shared.
2. Once, before the tiers page, at 12 left: "What would you have expected a month of this to cost?" Then show the prices.
3. On the cancel screen, optional, never blocking: "What would make you stop?"

A Guest leaves no trace, so Guest drop off is read only through interviews and the funnel quiz (`funnel/quiz.html`).

## What is manipulative now
Nothing dark ships. Fix the disabled Next and the unmeasured "Two minutes". Remove the Unlock all sight toggle from frame one.
