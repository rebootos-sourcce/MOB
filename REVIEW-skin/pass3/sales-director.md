GRADE: 63/100 (pass 1 was 58, pass 2 was 55)

Seat: Camille Boucher, sales director. Pass 3. Re-checked `engine/plan.js` (PLAN_PRICE 0, 12, 29, 59, 99), `ui/lock.js` and `funnel/buy.html` at HEAD c4523f8.

## 1. THE PROPOSAL IN THREE SENTENCES

Tare puts one free figure, one ring and one grammar of colour, shape, motion and word on every surface, so the product reads as one instrument. The figure is free with no number, masks and registers stay on tier three, and a lock shrinks to one sealed mark per surface named by the next rung. The merge bent my sealed door into "one chip, never grey", which is right, but it dropped the price (a chip naming a rung and no cost is still a dead end), dropped the buy page lies (still live today at `funnel/buy.html` lines 308 and 367), and dropped the tap-to-Stripe measure, so nobody can say whether the skin sold anything.

## 2. THE ICP ROOM (the Field, ten seconds, funnel eyes only)

- **Marcus, founder, level 7 (85 percent, the primary).** Sees a calm figure and four doors. Finishes a release, wants the saboteur layer that explains it, meets one sealed chip. The sale closes only if the chip says what it shows and what it costs. "Show me the short in the circuit."
- **Whitney, phone only, level 5.** Sees a 44 px ring button and a figure to screenshot. Leaves at any clinic word. A share, not a buyer. "Cute. What do I tap."
- **Nils, design skeptic.** Sees one ink ring, one slate ramp, sentence case. Finds no tricks in the chip. Leaves on a count, a clock or a grey button. "It says what it does not do."
- **Camille, somatic practitioner.** Sees the figure and the privacy line. Asks who sees her clients. Stays only if tier four is findable and consent sits on top. Today it does not. "Where do I put twenty two people."
- **Marta, acute distress.** Sees the unread screen: one sentence, no verdict, no price, no lock. Writes one line and stops. Any padlock here is the product failing. "Please do not give me a number."
- **Renata, operator.** Sees four doors. Reads "Opens on tier one, 12 dollars a month" and decides in one glance. "Twelve a month. What do I get Monday."
- **Trey, quiz tourist (level 4).** Pokes the figure, sees a dash, leaves in a minute. Keep the paywall away from the first reading. "Cool. Now what is it for."
- **Sofia, loves the open tables.** Walks the quiet fifth door, stays for months on ten patterns a week. Word of mouth. Never lock a table. "I just want the tables."

## 3. UNIFIED QUALITY: 62/100

Three biggest gaps left:

1. **No sale path from the lock.** The chip opens the full five-row page, three taps deep, with sign in in the middle. One card, one price, one button is missing. A redesign of a destination, not a skin.
2. **The gift hides what it earns.** A person finishes a release and the layer that explains it is sealed. Tier one sells itself only to someone who has seen what the layer does. The owner's open item.
3. **The words of the sale are not skinned.** The buy page has 18 font sizes and two false promises, the price button is Start Case, and "tier" still names three ladders.

## 4. FINAL GRADE: 63/100 (pass 1 was 58, pass 2 was 55)

Up 8. Moved it: the free figure is ruled, so the demand exists; sealed door, one tray, sentence case and "tier means paid only" are in. Held back: no price on the chip, a false buy page, no measure, and tier two is still the weak rung.

Arithmetic, so no price moves on a guess. Free is 10 patterns a week, about 40 a month. Tier one, 12 dollars, 400 patterns, 3.0 cents each, plus saboteurs: the strongest rung. Tier two, 29, 800, 3.6 cents each; the extra 17 dollars buys 400 more (4.25 cents each) plus complexes. Tier three, 59, 1,200, 4.9 cents each; the extra 30 buys 400 more (7.5 cents each) plus hyper complexes, character, registers and masks. Tier four, 99, buys the lead suite on the same 1,200. Price per pattern rises with volume, and a hostile reader will compute it. The answer holds only if the sight on each rung is visibly worth it. Tier two is not. I move no price until the counts below exist.

## 5. MY PART OF THE BUILD SPEC

**Values**
- **Sealed chip, one per surface.** Ring lock mark 13 px, stroke 1.6, round caps, ink colour (never accent, never alarm), at least 3 to 1 on its ground in all seven lightings. Radius 999, 44 px tall on touch. The sealed thing keeps its seat hue at 80 percent, ring lit. No grey: replace `.lk{opacity:.55;filter:grayscale(1)}` at `ui/lock.js:245`.
- **Type, from the shared 11, 13, 16, 20, 28, 44.** Chip line 13 / 500. Tier name 13 / 500 at ink 70 percent. Price 28 / 600, tabular figures. Button 16 / 500. Radius 10 for card and button.
- **Motion.** Sealed things are still. A tap is one "land" at 320 ms, then the card rises at 320 ms. No breath, pulse, shake, countdown or bounce on any commercial surface.
- **Count.** Three or fewer sealed marks on the first Field screen, none on a tab, none while a first reading is open.

**Copy**
- Chip: `Saboteurs. Opens on tier one, 12 dollars a month.`
- Next rung, from `planNextSees` (`plan.js` near 495): `Layers on tier one.`
- Card: button `Move to tier one`, under it `Cancel any time. Nothing you read is removed.`
- Spent gift: `You finished {n} releases, opened {n} addresses, practised {n} days. Tier one adds 400 patterns a month and shows your saboteurs.`
- Banned: unlock, locked, upgrade, premium, popular, last chance, any count against a total, any clock.
- Buy page: delete "50 patterns when they join" (ruled 25), rewrite "a tier is a rate of new ground and nothing else", add a sight column to the ladder, retire `funnel/shot-buy-1600.png`.
- "Tier" is paid only. The coherence ladder is "band".

**Gates**
- `tests/funnel.js`: chip text holds a tier name and a price and none of the banned words; no padlock renders while `r.unread` is true; lock to card to Stripe link in three taps.
- `tests/locks.js`: 3 to 1 mark contrast in all seven lightings; at most three sealed marks on the first Field screen at 1600 and 390.
- `tests/design.js`: a named edit to gate 17 (case) and to gates 8, 9, 12 (scale). The buy page holds four sizes.
- A device-only count: lock tapped, card reached, Stripe reached.

**Build order**
1. Buy page lies and sight column. S. `funnel/buy.html`. Proof: `tests/funnel.js` text asserts.
2. Chip with price, one tray, all lightings. S to M. `ui/lock.js`. Proof: `tests/locks.js`, `tests/design.js`.
3. Spent-gift recap. S. `ui/release.js` (relplan). Proof: `tests/funnel.js`.
4. One-card tier sheet, sign in after the pick. M. `ui/plans.js` and the account seam. Proof: the three-tap test.
5. Tier four door, consent on top. S. `ui/plans.js`.
6. Paywall type collapse (8 sizes to 4, buy page 18 to 4). S. Proof: `tests/design.js`.

## 6. RANKED RECOMMENDATIONS

1. **Buy page: remove the false claims, add the sight column.** S. Marcus, Renata, Nils, every referred arrival. Reskin.
2. **Chip with price, one per surface, legible in all lightings.** S to M. Marcus, Renata, Nils. Reskin.
3. **Unread screen carries no price, no lock, no verdict.** S. Marta, Trey, Whitney. Reskin.
4. **One-card tier sheet, sign in after the pick.** M. Marcus, Renata, level 8. Redesign of a destination, not of the app.
5. **Spent-gift panel in the person's own numbers.** S. Marcus, Renata. Reskin.
6. **One test arm where the gift shows the whole chain.** M. Marcus, Renata, Trey. Measure: of gift users who finish a release, how many open the saboteur chip and how many reach tier one. Redesign of a rule, owner's to make, not blocking.
7. **Tier four door, consent on top.** S. Camille. Reskin.
8. **Funnel counts on device.** S. All. Needed before any price move.
9. **Source OS: keep his hex, show him 1.36 to 1 beside it.** S. Nils.

## 7. ONE QUESTION FOR THE OWNER

None. Decided: free figure ships, sentence case wins, tier means paid only. Questions for real people, in the form that gets behaviour: "What did you do immediately after your first reading." Before any price is shown: "What would you have expected to pay for this." Then: "What would make you stop."
