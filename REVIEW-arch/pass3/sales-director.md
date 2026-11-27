# Pass 3, sales director (Camille Boucher). Round PK, 2 October

## 1. The architecture in three sentences

The engine reads each entry once, keeps what the person said apart from what the instrument guessed, and shows one next step with a trace of why. A safety screen runs first and quiets the whole screen when someone may be in danger, and every stored key sits in a privacy table with a delete that reaches all of them. The server owns who has paid and until when, the browser owns pace and content, and five verbs read off the sight table decide what a tier may do.

The merge bent three things of mine.
- **The gift.** In pass 2 I moved to "gift shows base sight only". The merge keeps the owner's ruling, the whole reading visible while the gift lasts (J8). I accept it. The cost moves to gift end, where the copy must say plainly what rests and what is kept. The owner also reversed "sight is not for sale" on 1 October; `plan.js` SIGHT is the ruling now.
- **Tier four.** Closed until the lead suite exists is right. I want the flag in the same table, `built:false`, as the Kundalini row already uses.
- **The cap.** The merge keeps 120 free banked patterns but not my rule: printed once, flat, on the tiers page, never as a warning in the flow. That rule is the difference between a fact and a timer.

## 2. The ICP room (sales view only)

- **Marta, 02:00, distress.** Sees a quiet card quoting her words. Leaves if any padlock, ladder or "See tiers" prints in that entry. "At that hour I do not want to be offered anything."
- **Nils, skeptic.** Sees a Why chain. Checks the Leaves label before the price. Leaves at a vague lock phrase. "Show me what it kept and what it dropped, then the number."
- **Camille, somatic practitioner.** Reads tier four. A roster that does not exist is found in a day. "Opens with the lead suite" makes her wait. "I will not buy a promise of a consent list."
- **Whitney, phone only.** Screenshots the lock text, pays on the phone. Safari may clear script storage after about seven days (to verify), so she returns to an empty record. "I paid and it forgot me."
- **Renata, operator.** Counts the six trace rows, wants the chain as a number. Buys tier three if the allowance arrives monthly and an upgrade opens the right amount. "Tell me what I paid for in patterns."
- **Gordon, refuses clinical.** No stage, day, countdown or scarcity. A lock that says only what the layer shows passes. He leaves at the first nag. "Ask once, then leave me alone."
- **Sofia, needs the consent list.** Finds Delete and Leaves, and a consent line in the sign up box. Leaves at an efficacy claim. "Say what is kept and who can see it, in one place."
- **Trey, quiz tourist.** Level 4 or 5 in the buyer grid (40 and 30 percent buy; the largest and hardest group). Hits the first lock, goes. He will not convert on day one; do not scare him off. "Cool result. What do I do with it?"

## 3. Unified quality: 70/100

**The moment of value.** The end of a first release run, when a person sees charge move on their own reading and reruns it free. Today the first padlock sits earlier, on the first Field screen (`ui/fieldbar.js` calls `lockApply`), before any release. The lock belongs after the first release, carrying the layer's own sentence.

**The drop off.** "Locked before proof", at grid levels 4 and 5, who need to feel one release work before a price means anything. Level 6 (65 percent) buys once mechanics are clear. Level 7 (85 percent, the primary) buys tier three on sight, so their only damage is a tier four button that sells nothing.

**Tier arithmetic.** Keep `base` on a tier change. Tier one with 400 spent, upgraded to tier two (800), leaves 400, not 800. Today `planFromServer` opens a full 800, so about 1,200 patterns cost $29 where tier three is $59.

**Three biggest gaps.**
1. Nothing is deployed, and sign up has never run on a real D1 (the Worker's database). A person who pays is told nothing.
2. A phone wipe can remove a paid person's ground, journal and history. Tier returns from the server; the record does not.
3. The gift end is a silent take-away until its copy is written and gated.

**Manipulative, comes out.** No timer or false scarcity exists today. Keep out: any "close to your cap" line, and any commerce string in a care entry. "Unlock all sight" on the login screen hides behind `?dev=1` before public launch.

**The questions.** "What did you do right after your first reading?" Before any price: "What would you have expected this to cost?" Last: "What would make you stop?"

## 4. FINAL GRADE

GRADE: 68/100 (pass 1 58, pass 2 63).

Up: the merge adopted my verbs, lease, base kept, cap and closed tier four. Held back: nothing deployed, gift end unwritten, phone wipe unproven.

## 5. My part of the slices

**R0 deploy first.** Goal: Worker live, a timed real sign up, `?billing=` read on return, `BASE_PLAN=0`. Changes: server `wrangler.toml`, `src/index.js`, `ui/auth.js` return address. Not `engine/`. Gate: server tests plus one timed sign up on the deployed Worker. S. MVP. Unlocks all money.

**R1 plan contract test.** Server plan integers match client keys; `server/test/billing.test.mjs`; not `engine/plan.js`; fails on drift. S. MVP.

**R2 billing hygiene.** Goal: refuse a second live subscription, hear `charge.refunded` and `charge.dispute.created`, read four counts (accounts, checkout started, live, cancelled). Changes: `server/src/stripe.js`, `server/src/ops.js`. Must not touch: client files. Gate: `billing.test.mjs`, `ops.test.mjs`, a case per event. S. MVP, after R0. Refunds in the ruled seven days claw back no opened ground.

**A9a entitlement engine.** Goal: `planCan` with five verbs; refuse a record with `plan.granted` above 1,200; `planAllowance` reads the smaller of `granted` and the tier grant; lease of `until` plus 3 days; `base` kept on tier change; free banking `min(weeks x 10, 120)`; `lead` carries `built:false`. Changes: `engine/plan.js`, `engine/schema.js`. Not `ui/`, TAB integers, `SCHEMA_V`. Gate: `tests/engine.js`, one case per forge and tier change. S. MVP, in series after A2 (same file). Unlocks A9b. Gordon feels no pressure.

**A9b lock copy, gift end, tier four closed.** Goal: the lock names what its layer shows and what is kept; gift end says which layers rest and which ground stays; tier four reads "Opens with the lead suite"; the cap printed once on the tiers page; no commerce string in a care entry. Changes: `ui/lock.js`, the tiers page code, `funnel/buy.html`, `tests/funnel.js`. Must not touch: `engine/`, `ui/storyui.js`. Gate: `tests/funnel.js` fails if tier four sells without `built`; a test that no lock or price renders while care is on; the voice gate on buy copy. S. MVP, in series after A9a. The care part waits on A5, so it ships first with a stub that treats everything as ordinary. Shares `buy.html` with the creative truth sweep, so those run in series. Marta never meets a price.

**A10b backup prompt after first release.** Goal: offer the encrypted backup once, after the first release run ends. Changes: A10's backup code and the release completion handler in `ui/`. Not the plain `pExport` format. Gate: A10's restore drill (export, wipe, import, hash equal) passes before this prompt ships. M. MVP, before any tier three or four push. Whitney.

**A3 touch.** Consent line in the sign up box, from the PRIVACY table; `ui/account.js` or `ui/login.js`; A3's gate. S. MVP. Sofia.

## 6. The order

- **Wave 1, parallel:** R0, R1, A2, A1.
- **Wave 2:** R2 after R0 (series on `stripe.js`); A9a after A2 (series on `schema.js`).
- **Wave 3:** A9b after A9a (care part after A5); A10 then A10b. Later: reopen tier four after R5.
- No commerce surface ships before the safety gate holds the quiet register. Hot file `engine/schema.js`: A2, A9a, A12 in series. I touch no `ui/storyui.js`.

## 7. One question for the owner

None. Defaults taken, he can overrule: the gift shows the whole reading as he ruled and its end copy says what rests; tier four stays closed until the lead suite exists; the cap is 120 and printed once; refunds in the ruled window are honoured with no clawback.
