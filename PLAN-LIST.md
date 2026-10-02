# The plan as a list, 2 October

## Built and pushed
- Login A, Guest, developer options lower right, welcome pop-up after paying
- Release screens with the End button on the opening, your recorded voice saved
- Tiers: sight by tier, lock marks, buy page at 12, 29, 59, 99, checkout, plan changes, cancel, plan read back into the app (all run against a stub, not real Stripe)
- Practice, Ritual, Trace graph, sound engine (but see below, it is silent for you)
- Intake page restored, Compass fold, teacher drill
- Three big reviews written: the skin, the onboarding, the six-area architecture (scores and rankings in REVIEW-RESULTS.md)
- Onboarding mockup you watched: the auto slider

## Built, merged on my side, not yet pushed (waiting for one test run)
- Teacher click on the Compass: the behaviours to release, the behaviours to install, 2 or 3 starter rituals each, Add to my ritual. Marked first draft. No percent anywhere.
- Example profiles fixed: found a real bug that made people read a whole band higher than their data. Re-measured everyone. 30 new example people added, 3 for each of the 10 bands, Collapsed to Mastery.

## Being built right now
- Copy walk: every screen, tooltip and info line checked, no percent or zero verdicts, the Field rail block ("Carrying / Heaviest / Most shut") fixed or cut
- Sound is silent, sound-off message bug, messages move to a bottom log (3 seconds, hold to keep), X on protocols and End on the run
- The cover: white dots on the u, rings moving subtly behind, symmetry measured, "show stop frame" removed
- Font choice: real candidates tested on your own words
- The gap to MVP, measured, including the Practitioner layer

## Remaining, in order
1. Onboarding build, behind the mockup you pick
2. Profile menu by tier and it opens on the profile you left on, Custom new
3. Field page: summary first, then By weight and By assemblage point as collapsible sections
4. Masks by tier (one: child and preteen; two adds ideological and professional; three adds teen and adult)
5. Flow menu becomes mini routines
6. Distress detection in the first story (ship blocker for strangers)
7. Fix: an imported file can give itself tier four (self-grant)
8. Fix: the first reading is empty for 11 of 16 plain sentences
9. Gift honoured in code, Unlock all sight hidden before public release
10. The skin build (one figure, one ring, one grammar), then the coherence gate
11. The architecture slices P01 to P23 (about 18 to 32 working days with four builders)
12. Tiers five to nine on the paid ladder and in Stripe

## Backlog (not started, not in the order above)
- Practitioner page and the grant model (needs accounts)
- Points and achievements engine, Avatar page pivot, Daily Summary screens
- Name meanings, body place words, Knowledge correlations
- Layer observatory as a fourth Field view, Compass layout B
- Login by username on the server, Google sign in
- Funnel concern selection and the personalised gift (waits on your storyboard)
- Experience metrics X1 to X8, referral grant (25 or 50 patterns)
- Update the TDD set to match the sniffer, sound and login work

## Stripe, your question
Yes, I can create the products and prices for you through the Stripe API. Two things stop me today:
- This cloud box is blocked from api.stripe.com (it answers 403). You allow that host: the cloud environment menu in the session title bar, then Edit, then Network access, add api.stripe.com.
- I need a key. Do not paste it in chat. In the same Edit screen add it as an environment variable named STRIPE_SECRET_KEY. Make it a restricted key (Stripe dashboard, Developers, API keys, Create restricted key, allow Products and Prices write only). Your screenshot is Live mode; start in Test mode and flip to Live later.
- Prices for tiers five to nine: I need your numbers. Draft for you to change: five 149, six 249, seven 399, eight 699, nine 999 per month (after 12, 29, 59, 99). Nothing is created in Stripe until you say.
