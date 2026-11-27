GRADE: 58/100

Seat: Camille Boucher, sales director. Discipline: the funnel and the moment someone decides to pay. Read-only review. Checked at HEAD 65ed759, 1 October.

One flag first. My own brief says "sight is not for sale". The repo says that was REVERSED on 1 October, round OK (DECISIONS.md lines 2569 and 2632, `engine/plan.js` SIGHT). I grade the product as ruled now: free sees the 112 addresses, domains, archetypes, laws, action, shadow. Tier one adds saboteurs, tier two complexes, tier three hyper complexes, character, the registers (point cloud) and masks. I give my honest view of the reversal under RISKS.

| Criterion | Score | Evidence |
|---|---|---|
| Value visible before the ask | 5 | Summary is rich and free ("Who this is", 1600-summary-loaded.png). But the layer the ruling sells, saboteurs, shows nothing of itself to free. |
| Lock reads as a door | 6 | Tooltip names what, which tier, one "See tiers" button (`ui/lock.js` lockSay, LOCK_GO). Orb padlock is 17px on a greyed orb. |
| Lock never a wall | 6 | Character page is a black field with one dashed box (1600-character-loaded.png). Nothing behind the door is shown. |
| Tier ladder as a reading of intent | 6 | 12/29/59/99 maps to the grid. Price per pattern rises with volume: 3.0, 3.6, 4.9 cents (12/400, 29/800, 59/1200). Sight carries tiers two and three, not volume. |
| Buy page and paywall page | 5 | Buy page has no action. Billing tiers page is three taps deep and needs sign in first. |
| Moment of decision placed right | 6 | Spent-gift panel routes to tiers (`release.js` relplan). Good. Lock taps route to tiers. Good. Neither shows a price. |
| Honesty, no dark patterns | 9 | No countdown, no strikethrough, no popular badge, no preselect (`plans.js` header). Cancel deletes nothing. Best part of the funnel. |
| Consistency of paywall language | 5 | 18 distinct font sizes on `funnel/buy.html`, 8 on the in-app paywall (12 to 20). Stale facts below. |
| Gift, founding offer, referral clarity | 5 | Founding offers are design only (DESIGN-founding-offers.md, "nothing here is built"). Buy page says 50 patterns for a referral; ruled 25. |

THE SOUL (for my eye). A decision instrument sold to people who already do the work. The honest pitch is "the short in your circuit has a name, and tier one shows it". The visual language is calm and instrument-like, so a lock should look like a sealed panel on a gauge you will want to open, not a grey disabled button.

THE MOMENT OF VALUE, named. The release landing: charge drops, then the next reading shows what was running it. Today it sits in the flow in two places. The first release (account is created after it, ruled in TASKS, onboarding ruling 1). And the spent-gift panel, after about four runs of 25. The saboteur layer is the payoff of that moment, and it is behind tier one. A new person completes a release and the one layer that explains it is a greyed orb. DECISIONS 2672 admits it: "a new person sees no saboteurs until they pay". Onboarding ruling 2 said the whole reading shows while the gift lasts. The later ruling left that open. It is the owner's, and it is the biggest lever in this report.

THE DROP OFFS, named, by grid level (BUYERS.md).
- "Grey orb" drop, levels 6 and 7 (65 and 85 percent). They want the diagnostic. They meet a greyed icon, not a diagnosis. They are the buyers and the lock gives them nothing to want.
- "Four taps and a sign in" drop, level 6 and 7. Lock, tooltip, See tiers, Settings Billing, then Go to Account if signed out, then Move to tier, then Stripe. Sign in sits in the middle of the purchase.
- "Pain before payment" drop, levels 4 and 5 (40 and 30 percent). Level 4 avoids work that hurts, level 5 wants magic. A lock reading "Which saboteurs are running on your charge" speaks to a troubleshooter, not to them. They never reach it. Do not chase them with the paywall. Chase them with the first release feeling like relief.
- "No page to land on" drop, any level arriving from the web. `funnel/buy.html` has a price table and no button. It says "Checkout is not open yet" (check whether that is still true, since auth and checkout landed per the page's own comment).
- Level 8 practitioner. Tier four is a section far down the buy page. Per practitioner or per client is still open (DESIGN-billing.md). It is the clearest thing to charge for and the least visible.

WHAT BREAKS COHERENCE, ranked.
1. `funnel/buy.html` line 367: "you get 50 patterns when they join". Ruled 25 (DECISIONS round OI). A wrong promise on the page that asks for money.
2. `funnel/buy.html` section 1: "So a tier is a rate of new ground and nothing else". False since 1 October. The lead and ladder heading above it say the opposite.
3. `funnel/shot-buy-1600.png` still shows "Sight is not for sale". If that shot is used for review or marketing it shows a withdrawn promise.
4. The ladder table on the buy page has no sight column, so price and what it buys sit two sections apart. The old reason to drop the column ("same on every row") no longer holds.
5. Tier two is sold on complexes plus the Kundalini, which has no surface (`built:false`). Correctly left off the page. But tier two then buys one visible thing, for $17 more than tier one.
6. Orb lock: opacity .55, grayscale(1), cursor help (`lock.js` lockCss). That is the same look as "off" or "empty". It does not say "sealed".

SKIN RECOMMENDATIONS (reskin, no dark patterns).
1. Lock as a sealed door, not a dimmed button. Keep the orb in colour and ring-lit at about 80 percent, draw a ring padlock plus a thin dashed outer ring (the product's "not yet drawn" language, already used in the compass side panels). Keep 44px size and aria-disabled. Effort S. Moves S levels 6, 7.
2. Show the shape of what is behind. On the Character page and Registers, draw a ghost silhouette of the surface at 12 percent with the dashed panel over it, so the door has a room behind it. Use the person's own data as a silhouette only, no names (consistent with "lock is on what is drawn, never on what is read"). Effort M. Levels 6, 7, 8.
3. One honest number in the lock tooltip: the tier price and one line of the person's own state. "Saboteurs. Tier one, 12 dollars a month." Never a count against a total (CLAUDE.md, the 0 of 112 defect). Effort S. Levels 6, 7.
4. Put the tier button where the lock is. The tooltip button should open a one-card sheet for that single tier (what it shows, price, Move to), not the full five-row page. Keep the full ladder one tap beyond. Effort M. Cuts the four-tap drop off.
5. Move sign in to after the pick. Let Move to tier one start with the choice and ask for the account on the next step, with the plan shown beside the form so nothing is lost. Effort M, needs the account seam. Levels 6, 7.
6. Paywall type scale: collapse the paywall surfaces to four sizes (12, 14, 16, 20) and one radius. Today: in-app 8 sizes, buy page 18, two radii (9px button, `--r-s`). Effort S. Reads as one instrument, which is the trust signal at the point of payment.
7. Buy page: add the sight column to the ladder, add a "Move to" row per tier that links into the app's tiers page (or sign in), colour the "adds" per rung with the same tier colours the Field uses so the table and the locks share a language. Effort S to M.
8. Spent-gift panel: say the three facts the person has earned, in their own words: runs finished, addresses opened, days practised, then the next tier. A recap of behaviour, not a threat. Effort S.
9. Tier four page: a dedicated "for people you lead" door from the buy page and from Settings, with the consent box lifted to the top. Effort S. Level 8.

QUESTION TO ASK, in the form that gets behaviour. Not "would you pay". Ask: "What did you do right after your first reading?" Then, before any price is shown: "What would you have expected to pay for this?" Then: "What would make you stop?" For the lock, add one behavioural measure, not a question: of people who tap a lock, how many reach the tier card, how many reach Stripe. That is the funnel with names.

GRADE PER ICP TIER (conversion readiness, skin as is).
- Free to tier one, levels 6 and 7: 6/10. Right price for a diagnostic, wrong door (grey orb, four taps).
- Tier two, levels 7 to 8: 4/10. One unlocked thing visible, Kundalini absent.
- Tier three, levels 8 and 9: 6/10. Registers and masks are visual and strong. Compass is the best sales surface in the product (1600-compass-loaded.png) and its lock is a 12px icon in a corner.
- Tier four, level 8 practitioner: 4/10. Not findable.
- Levels 4 and 5: 3/10, by design. Do not sell to them with the lock. Sell to them with the first release.

REDESIGN CANDIDATE. One: a single "Tiers" sheet that is also the lock's destination, with a card per tier (what it shows, one ghost preview, price, one button). The skin cannot do this because today the tiers page is a Settings subsection with no way in from the buy page and no single-tier view. Gain: one surface, one language, fewer taps.

RISKS.
- The reversal. Selling the saboteur layer withholds a person's own diagnosis at the moment it lands. That is exactly the "withhold a reading to sell it back" mechanic the earlier ruling removed (DECISIONS 895 to 899). The buy page's own line, "nothing is hidden and then sold back in a different place", is now close to the test. I would at least show the gift's hundred with the chain visible (onboarding ruling 2), so a person learns what they would be buying by having had it. His call.
- Showing "3 saboteurs read" as a teaser. A count of the person's own reading may clash with the rule that a reading never carries a commercial number. Needs the voice and ethics seat before building.
- Founding offer: a real cap is not fake scarcity only while nobody is shown a count or position (DESIGN-founding-offers.md section 5). Keep it invisible.
- Never put buyer level (BUYERS.md) anywhere a renderer can reach it. Nothing above does.
- Price per pattern rises with volume. A hostile reader computes it. The answer is that tiers two and three sell sight. That answer is only true if the locks are visibly worth it, so recommendations 1 to 3 are not decoration, they are the pricing argument.

Files: /home/user/MOB/atuned_src/ui/lock.js, /home/user/MOB/atuned_src/ui/plans.js, /home/user/MOB/atuned_src/engine/plan.js, /home/user/MOB/funnel/buy.html, /home/user/MOB/mockups/tier-locks/.
