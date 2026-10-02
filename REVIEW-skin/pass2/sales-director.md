GRADE: 55/100 (was 58)

Seat: Camille Boucher, sales director. Pass 2. I read all eleven other pass 1 reports and re-checked `engine/plan.js` (PLANS, SIGHT) and `ui/lock.js`. The QA measurement report had not landed.

## 1. AGREEMENTS (two or more seats, independent)

- **The lock is a shop, not an instrument.** Brand, marketing, UIUX, game, creative, art and I all said it. Count: about nine or ten padlocks on the first Field screen (5 on the chip row, 4 on the right rail, 1 on Character). Confirmed. I add what the others did not say: none of them is a price, so it is clutter with no sales value.
- **The avatar is not the centrepiece.** Confirmed by brand, creative, game, innovation, UIUX, systems, art, marketing. The Character page is a black stage with one dashed box and the Avatar tab is a form with no figure.
- **The loop is a row, not a circle.** Brand, creative, game, innovation, UIUX, animation, art, marketing. Confirmed. For my funnel it matters because Embody is the stage where a person decides to stay, and it opens to a library.
- **Start Case labels fight sentence case.** Narrative, brand, creative, art, marketing. Confirmed.
- **No type scale.** 26 to 43 sizes by whose count. Mine: 18 on `funnel/buy.html`, 8 in the in-app paywall.
- **The unread screen prints verdicts and has no promise.** Marketing, UIUX, game. Confirmed. It is also a pricing problem (section 3).
- **The 390 wide "not read yet" pill overlaps the zoom buttons.** Eight seats. Confirmed.
- **Honest reward design.** Game and I both grade honesty at 9. No countdown, no streak loss, no variable reward. That is a sales asset, not just a rule.

## 2. DISAGREEMENTS, and which side I take

- **Brand and marketing: "lock as a dim state, no icon" and "cap locks at one".** Cap at one tray per surface, yes. Dim with no icon, no. A dim chip with no mark is how "off" and "empty" already look (my pass 1 finding). A door needs a mark that says sealed. Sealed layers keep their own seat colour at about 80 percent, ring lit, one small lock mark in ink, never grey.
- **Marketing: "padlocks are scarcity".** Not quite. Scarcity is a count, a clock or a rival. A padlock is honest. What hurts is how many there are and where they sit (before any value). Fewer, better, only where the person's own eye already went.
- **Game: "a small free figure may weaken the tier three sell. Test it."** I take the other side. The figure is the demand. The masks are the buy. A free figure that shows what is free (the 112 addresses, the seats, CQ, the coherence light) makes the tier three masks a want. A black page with a lock makes a want of nothing. The owner's 1 October ruling keeps masks and registers on tier three, so a free figure that draws only free data breaks no ruling.
- **Art and systems vs my pass 1 recommendation 7** ("colour the table's rungs with the Field's tier colours"). I was wrong. `TIERCOL` is the coherence ladder and wears seat hues, and the word "tier" now names three ladders (art, systems). Paid tiers wear no hue. I withdraw rec 7 as written.
- **Innovation: dashed and pencilled lines mean "stated, not measured".** My dashed outer ring means "not drawn on this plan". Two meanings for one stroke is the exact fault systems and art flag. I take: dashed means absent (not read yet, or sealed). Confidence uses opacity on a solid line. Innovation to confirm.
- **Brand: the Source OS wordmark contrast.** The hex is the owner's, asked three times, so the hex stays. Defect still: the line is the category claim and no one can read it (1.36 to 1 by art, 1.5 by narrative and brand). Show him the number beside his hex, at a size that passes. I am not blocking on it. It touches sales little.
- **Ring loop nav: skin or redesign?** A skin, if it keeps the four doors and TABDEF `sec:` data and only redraws the bar. Redesign only if Flow and Embody move. I side with creative and art: S to M.

## 3. WHAT I MISSED

- **Art: the padlock disc and glyph in Snow are 1.0 to 1.1 to 1** (`lock.js:252`, paper tokens on a black stage). In Snow the door is invisible. I graded the lock 6. Lowered.
- **Art and systems: "tier" names three ladders** (paid, chain, coherence). A person sees "Tier three" and "Tuned" and the word "Embodied" as a tier (narrative). At the point of payment that is a trust leak.
- **Art: 8,288 of 10,000 simulated people read below CQ 50, and the hero is red-brown below that.** The typical first reading is a low, red number. Any price within the same view is selling to someone in pain. New rule below: no price on a reading surface.
- **Marketing: the demo reads 62, the simulated S1 median is 34.** My funnel sales tests run on a best case.
- **Technical: Body and Compass are already over the SVG node ceiling** (1,500; they hold 1,589 and 1,890). My ghost silhouette idea cannot add nodes there. Character is light (20 controls), so the ghost goes on Character only. On Compass and Body the lock stays a chip.
- **Animation: the release screen is silent and the dial changes with no transition.** That is my moment of value. I named it and did not see it was the weakest motion in the product.
- **Game: no day 2 return trigger.** Tier one buys a monthly allowance. A paid person with no reason to open the app on day 2 churns at month two. Churn is a design problem, and this is the design.
- **UIUX: a person must sign in before value.** Confirms my four taps and a sign in finding.

## 4. THE SKIN, TOGETHER: my part (sales surfaces)

**Tokens (values, drawn from what others proposed)**
- Type roles on paywall surfaces, using narrative's buckets: lock "what" line 14 / 400; tier line 12 / 500 dim; price 28 / 600; "a month" 12 / 500; button 16 / 500. Scale agreed so far across seats: 11 floor, 12, 14, 16, 20, 28. Narrative wants 13 and 15, UIUX 16 for reading. I use only the six.
- Radius: tier card and button 10, chip 999. One radius family (creative's 4, 10, 16, 999).
- Colour roles: sealed layer keeps its seat hue at 80 percent; the lock mark is ink (`--ink`), never accent, never alarm. Tier cards use ink and a text name only. If a mark is wanted: n small pips in a row, ink. It must not be the loop's four arcs.
- Contrast: lock mark at least 3 to 1 on its own ground in all seven lightings, and a Snow stage token (art's `--stage`).
- Motion: sealed is still (no breath, no pulse, no shake, no badge bounce). A tap is one "land" (260 to 340 ms), then the sheet rises at 320 ms. Nothing on a tier surface moves unless the person tapped it.

**Symbols**
- One lock mark, ring style, same everywhere. One tray per surface, labelled by the next rung only (`planNextSees`, `plan.js:495`): "Layers on tier one".
- The free figure is the same object at every tier. A tier adds detail to it, never the figure: free, seat light and coherence; tier one, saboteurs marked; tier three, masks and registers. Decision, no question.

**Copy rules**
- Order: the thing, the tier, the price. "Saboteurs. Tier one, 12 dollars a month." Never "locked", "unlock", "upgrade", "premium". Sentence case. No count against a total (the 0 of 112 defect). A figure with no record is a dash.
- One word per concept: **tier is paid only.** The coherence ladder is **band** (marketing already says "band names"). The chain steps keep their own names and are never "tier".
- Sentence case wins over the Start Case ruling (`DECISIONS.md` line 353). Reason: tier names and prices sit in running lines ("Move to tier one"), and Start Case on a price button is how a pricing page reads, which is the wrong register at the moment of payment. CLAUDE.md is the project rule. I recommend recording a new ruling so the old one is retired, not ignored.
- No price, tier name or lock on a reading surface (Field, Summary, Body) while a first reading is open. Prices appear only after a tap the person made on a sealed chip, in the spent-gift panel, or in Billing.
- Spent-gift panel recap: runs finished, addresses opened, days practised, in their own numbers, then the next tier. Behaviour, not a threat.

**Must agree before building**
- Type and art (narrative, art): the scale, and the lock ink contrast per lighting.
- Systems: the word "tier", and removing `TIERCOL` hues from anything paid.
- Animation: stillness rule for sealed things.
- Game and innovation: the free figure's data (free sight only) and dashed vs opacity.
- Technical: ghost on Character by CSS only; gates 8, 9 and 12 pin literals, so each is a named edit.

## 5. REVISED GRADE: 55/100 (was 58)

- Down: the lock is unreadable in Snow (new). The word "tier" collides (new). The dead Character page is the pricing surface and it is worse than I graded. The first reading, for most people, is a low number in red with locks around it.
- Held: honesty at 9. Ladder arithmetic.
- Arithmetic I should have shown. Free after the gift is 10 patterns a week, about 40 a month. Tier one at $12 is 400, ten times the ground, plus saboteurs. That is the strongest rung. Tier two adds $17 for 400 more patterns (4.25 cents each) plus complexes (the Kundalini has no surface). Tier three adds $30 for 400 more (7.5 cents each) plus hyper complexes, character, registers and masks. Tier four adds $40 for the same 1,200 and the lead suite. Tier two is the weak rung. I do not change a price on a guess. I instrument it (section 6, rec 4).

## 6. TOP 5 RECOMMENDATIONS

1. **Fix the three false promises on the buy page.** "50 patterns when they join" (ruled 25), "a tier is a rate of new ground and nothing else", and the stale `shot-buy-1600.png`. Add the sight column to the ladder. S. Moves S1, S3, S6, every referred arrival. A wrong promise on the page that asks for money is the cheapest, worst defect.
2. **Sealed door, one tray per surface.** Coloured ring at 80 percent, ink lock mark legible in all seven lightings, text "Layers on tier one", no padlock on each chip. S to M. Moves S1, S6, S3, Marcus, Diane.
3. **A free figure on the Field centre and the Avatar tab, masks on tier three.** Same object at every tier, no number on it, never dims. M. Moves Marcus, Diane, Sofia, Angela, S6, S7. Needs game, innovation, art. Redesign scale if it replaces the hub, so ship it as a small mark first.
4. **One-card tier sheet as the lock's destination, with sign in after the pick.** The sheet shows the layer's ghost, the price, one button. Measure three taps: tap a lock, reach the card, reach Stripe. M. Moves S1, S6, S2, S9, and practitioners via tier four.
5. **The unread promise and the first release as the lane for levels 4 and 5.** One hero line on the unread Field, no verdicts ("Most shut" becomes a dash), no tier anywhere near it, and the spent-gift recap. S. Moves Angela, James, S7, S8, S13. Do not chase them with a paywall.

Also in a later pass: the paid person's day 2 (the monthly arrival of the allowance stated as a plain dated fact, never a clock). Boot plays in full every load and costs a daily payer about 3.8 minutes over forty uses (animation). Owner's ruling stands, trim only.

## 7. ONE QUESTION FOR THE OWNER

None. My decisions and reasons:

- Build around the 1 October sight reversal as ruled. I still advise a test arm where the gift's hundred shows the whole chain, since onboarding ruling 2 said so and the reversal admits "a new person sees no saboteurs until they pay". That is a measurement, not a question: of gift users who finish a release, how many open the saboteur chip, and how many reach tier one.
- Sentence case wins, because the project rule says so and a price reads wrong in Start Case.
- A free figure ships, because it draws only free sight and every other seat needs it.
- Source OS: keep his hex, raise it to a passing size, show him the contrast number. No block on the skin.
