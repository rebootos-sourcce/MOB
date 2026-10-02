# Pass 3, sales director (Camille Boucher). Round PK, 2 October

Read: PASS3-INSTRUCTIONS, PROPOSAL, my pass 2, technical and creative pass 2, `engine/plan.js`, `funnel/buy.html`, DECISIONS (sight and gift rulings), PANEL-10k personas, BUYERS grid.

## 1. The architecture in three sentences

The engine reads one entry once, keeps what the person said apart from what the instrument guessed, and shows one next step plus a trace of why. A safety screen runs first and turns the whole screen quiet when a person may be in danger, and every stored key is listed in a privacy table with a delete that reaches all of them. The server owns who is paid and until when, the browser owns pace and content, and five verbs read off the sight table decide what a tier may do.

Did the merge lose or bend anything of mine? Three things.
- **The gift.** I moved in pass 2 to "gift shows base sight only". The merge keeps the owner's ruling (the whole reading visible while the gift lasts, block J8). I accept that: it is his, and the demo is the strongest thing we have. The cost moves to gift end, where the copy must say plainly what rests and what is kept. A rule I held in pass 1 ("sight is not for sale") was reversed by him on 1 October, and the table in `plan.js` is the ruling now. I take that line out of my own working notes.
- **Tier four.** The merge says "closed to purchase until the lead suite exists". Good. It does not say the `lead` flag lives in the same table as everything else. I want it there, one word, `built:false`, as the Kundalini row already does.
- **The banking cap.** The merge keeps 120 but not my rule that it is printed once, flat, on the tiers page and never as a warning inside the flow. That rule is the difference between a fact and a timer.

## 2. The ICP room (from the sales seat only)

**Marta, 02:00, acute distress.** Sees a quiet screen and a card with her own words. Does Call, Text or Continue. Leaves if anything printed a padlock, a ladder or "See tiers" in that entry. Trusts if nothing sells to her. In her voice: "At that hour I do not want to be offered anything."

**Nils, the skeptic.** Sees one Maybe, a quote and a Why chain. Looks for the catch in the price and finds the plain "Leaves" label. Leaves if the lock hides behind a vague phrase. Pays only after the chain survives his checking. "Show me what it kept and what it dropped, then I'll look at the number."

**Camille, the somatic practitioner.** Sees the tiers page and the tier four row. Wants the consent list. If tier four sells a roster that does not exist she finds out in a day and tells twenty clients. With "Opens with the lead suite" she waits. "I will not buy a promise of a consent list."

**Whitney, phone only.** Sees the quiz result, reads the glossary before the home page, screenshots the lock text. Pays on a phone. Her risk is Safari clearing her storage after about seven days (to verify), so she comes back to an empty record. "I paid and it forgot me."

**Renata, the operator.** Wants the chain as a number. Sees six rows and counts, no score. Buys tier three if the allowance arrives monthly and the grant arithmetic holds on a tier change. Leaves if an upgrade quietly opens the wrong amount. "Tell me what I paid for in patterns."

**Gordon, refuses anything clinical.** Sees no stage, no day, no countdown, no scarcity. A lock that says what the layer shows, and nothing else, is acceptable to him. He leaves at the first nag. "Ask once. Then leave me alone."

**Sofia, needs the consent list.** Finds Delete, Stays and Leaves, and a sign up box with a consent line. She trusts the page if the copy "nobody reads what you write" is gone. She leaves if the sales page makes an efficacy claim. "Say what is kept and who can see it, in one place."

**Trey, the quiz tourist.** Sees a result with a name, screenshots it, posts it. He is level 4 or 5 in the grid (40 and 30 percent buy, the largest and hardest group) and the first lock is where he goes. He does not convert on day one under any design; the honest job is not to scare him off. "Cool result. What do I do with it?"

## 3. Unified quality: 70/100

Voice, rulings and the quiet register hold together. Commerce is the part that still reads as a separate surface.

**The moment of value, named.** The end of a first release run, when a person watches the charge on their own reading move and then reruns it free. Today the first padlock sits earlier: on the first Field screen (`ui/fieldbar.js` calls `lockApply`), before any release. The merge fixes some of that (fewer padlocks on first screen, uiux). The lock belongs after the first release, with the layer's own sentence on it.

**The drop off, named.** "Locked before proof", at grid levels 4 and 5, who need to feel one release work before any price makes sense. Level 6 (65 percent) buys when the mechanics are clear. Level 7 (85 percent, the primary) buys tier three on sight of the dashboard, so for them the only damage is a tier four button that sells nothing.

**Tier arithmetic, one change.** Keep `base` on a tier change. Tier one with 400 spent, upgraded to tier two (800), leaves 400, not a fresh 800. Today `planFromServer` opens a full 800, so about 1,200 patterns cost $29 where tier three is $59.

**Three biggest gaps.**
1. Nothing is deployed. A person who pays today is told nothing, and sign up has never run on a real D1 (the Worker's database).
2. A phone wipe can remove a paid person's ground, journal and history. Tier comes back from the server; the record does not.
3. The gift end is a silent take-away unless its copy is written and gated.

**Manipulative, and it comes out.** Today: nothing in the flow is a timer or false scarcity. Two items to keep out: any "you are close to your cap" line, and any commerce surface in a care entry. "Unlock all sight" on the login screen is the owner's developer option and hides behind `?dev=1` before public launch (J8b).

**The question to ask, never "would you pay".** Three, in this order: "What did you do right after your first reading?" Then, before any price: "What would you have expected this to cost?" Then, after: "What would make you stop?" Price shown last.

## 4. FINAL GRADE

GRADE: 68/100 (pass 1 58, pass 2 63).

Up: the merge adopted my verbs, lease, base kept, one live subscription, cap, refund events, and closed tier four. Held back: nothing is deployed, the gift end is unwritten, the phone wipe is unproven.

## 5. My part of the slices

IDs follow the technical director's A and R tables. A9 is split in two because it touches two different hot areas.

**R0, deploy first.** Goal: the Worker is live with a timed real sign up and `?billing=` read on return. Changes: server `wrangler.toml`, `src/index.js`, price ids and secrets, `BASE_PLAN=0`, the return address in `ui/auth.js`. Must not touch: `engine/`, `ui/storyui.js`. Gate: the existing server tests plus one timed sign up on the deployed Worker, within the CPU limit. Size S. MVP. Unlocks all money. ICPs feel: Whitney and Renata are told they paid.

**R1, plan contract test.** Goal: server plan integers match the client keys. Changes: `server/test/billing.test.mjs`. Must not touch: `engine/plan.js`. Gate: the test fails on drift. S. MVP. Unlocks safe changes to tiers. ICPs feel nothing, which is the point.

**R2, billing hygiene.** Goal: refuse a second live subscription, hear `charge.refunded` and `charge.dispute.created`, and read four counts (accounts, checkout started, live, cancelled) so the funnel has numbers without behaviour leaving the device. Changes: `server/src/stripe.js`, `server/src/ops.js`. Must not touch: any client file. Gate: `billing.test.mjs` and `ops.test.mjs`, one case per event. S. MVP. After R0. ICPs: Renata is never double billed.

**R3 (shared).** Deletion across every table is the technical director's. I touch only the rule that a refund honours no clawback of opened ground. S, MVP.

**A9a, entitlement engine.** Goal: five verbs through `planCan`, refuse a record whose `plan.granted` exceeds 1,200, `planAllowance` reads the smaller of `granted` and the tier grant, lease on `until` plus 3 days, `base` kept on tier change, free banking `min(weeks x 10, 120)`, `lead` carries `built:false`. Changes: `engine/plan.js`, `engine/schema.js`. Must not touch: `ui/`, TAB integers, `SCHEMA_V`. Gate: `tests/engine.js`, one case per forge and per tier change; downgrade keeps opened ground. S. MVP. Series after A2 (same file, `schema.js`). Unlocks A9b and tier four reopening. ICPs: Nkem is never wrongly blocked, Gordon sees no pressure.

**A9b, lock copy, gift end, tier four closed.** Goal: the lock names what the layer shows and what is kept; the gift end says plainly which layers rest and which ground stays; tier four checkout reads "Opens with the lead suite"; the cap is printed once on the tiers page; no commerce string renders when `care` is not ordinary. Changes: `ui/lock.js`, the tiers page code, `funnel/buy.html`, `tests/funnel.js`. Must not touch: `engine/`, `ui/storyui.js`. Gate: `tests/funnel.js` reads buy page against SIGHT and fails if tier four sells without `built`; a test that no lock, "See tiers" or price string exists while care is on; the voice gate on buy copy. S. MVP. Series after A9a; the care part waits on A5's care argument, so ship with a stub that treats everything as ordinary and switch it when A5 lands. Shares `buy.html` with the creative truth sweep (legal name Tula Unified LLC): run in series. ICPs: Marta never sees a price; Camille waits instead of being sold.

**A10b, backup prompt after first release.** Goal: offer the encrypted backup once, after the first release run ends, with the restore drill proven first. Changes: the backup code from A10 and the release completion handler in `ui/` (to be located by name, not by line). Must not touch: `pExport` plain format. Gate: A10's restore drill (export, wipe, import, hash equal) must pass before this prompt ships. M. MVP, before any tier three or four push. Unlocks paid retention on phones. ICPs: Whitney.

**A3 touch, consent line at sign up.** One consent line in the sign up box, generated from the PRIVACY table. Files: `ui/account.js` or `ui/login.js`. Must not touch: strings outside that box. Gate: A3's table gate. S. MVP. Sofia feels trusted.

**Q1, the three questions.** A one page script and the four server counts, no code in the app. Gate: none; a person asks. S. MVP.

## 6. The order

- **Wave 1, parallel:** R0, R1, A2, A1 (different files).
- **Wave 2:** R2 and R3 after R0 (server, series on `stripe.js`); A9a after A2 (series on `schema.js`); A3 and A4 are others'.
- **Wave 3:** A9b after A9a, care part after A5; A10 then A10b.
- **Later:** reopen tier four after R5 ships the grants table and the visible list.
- No commerce surface ships before the safety gate holds the quiet register. Hot files: `engine/schema.js` (A2, A9a, A12 in series), `ui/storyui.js` (I touch none).

## 7. One question for the owner

None. Taken as defaults, he can overrule: the gift shows the whole reading as he ruled and its end copy says what rests; tier four stays closed until the lead suite exists; the cap is 120 and printed once; refunds in the ruled seven days are honoured with no clawback.
