# PASS 1, sales director (Camille Boucher). Area 6: commerce and identity

GRADE: 58/100 as proposed. The chain is mostly built and tested on both sides. Two parts of the proposal cannot be built under the fixed rulings (a server owned meter, and "advanced practice" as a verb), and nothing is deployed.

| Criterion | /10 | Evidence |
|---|---|---|
| Fit to existing code | 8 | Sign in, plan read back, checkout, portal, five Stripe events all exist: `ui/auth.js` 82-370, `engine/plan.js` 306 (`planFromServer`), reboot-os `store.js` 165 (`billingOf`), `stripe.js` (`syncSubscription`) |
| Fit to rulings | 5 | Verbs assume "sight is not for sale", reversed 1 Oct (`plan.js` 21-56). "Advanced practice" is unruled: every tool is on every tier (171) |
| Server owns what crosses the wire | 6 | Billing yes. No practitioner grant table or roster route anywhere in reboot-os `index.js` |
| Meter authority feasible | 3 | The meter is a list of keys inside the record, local only. All content ships in the file, so a server cannot withhold a line |
| Honest when stale or offline | 5 | `planOf` (272) reads status and never reads `until`. A cached paid record never expires offline |
| Cost of cheating vs cost of a wrong block | 6 | A forged record costs nothing real. An honest person wrongly blocked is the expensive failure |
| No manipulation | 9 | No countdown anywhere; `funnel/buy.html` 470 says so. Founding seats are the one risk (see Risks) |
| Deployable today | 3 | Stripe code is not on reboot-os `main`, price ids are placeholders, `BASE_PLAN="1"` in `wrangler.toml` 17 (`STRIPE-STEPS-NOW.md` 1.1, 1.2) |

## AREA 6, chain mapped onto what exists

| Link | Exists today | Gap |
|---|---|---|
| Identity | Sign up, in, forgot, out, boot check, token in `source.session`. Server: PBKDF2, rate limits, 90 day sessions, delete, export | Recovery proof and age 18 box not in the flow. Account comes after the first release (LEGAL-IA 135) |
| Subscription | Stripe Checkout and Portal. Server re-reads the subscription on every event, never trusts the payload | Not on `main`. No refund or dispute event heard. Checkout never refuses a second live subscription, so a stale screen can bill twice |
| Entitlement | `billingOf` sends tier, status, since, until. `planOf`, `planSight`, `planAllowance` derive everything | `until` unused on the client. `granted` accepted up to 1,000,000 (`schema.js` 988) |
| Meter | `meterRun` pushes keys into `meter.unique`. Spend is never stored (`planAllowance` 400) | Local only. Each device counts alone |
| Experience | `lock.js` greys a layer, names the tier, "See tiers". Paid welcome after checkout | Stripe returns to the funnel page, which does not read `?billing=` (STEPS 1.2). The welcome never shows |

## The five verbs, reconciled to the 1 October table

The proposal's verbs mix two axes. Re-cut them on the owner's two axes, ground (velocity) and sight.

- SEE EXISTING GROUND splits. Base sight (112 addresses, domains, archetypes, laws, gates, shadow, pain map, tools, journal) is every tier and never revocable. Layer sight is one key per `SIGHT` row: `sab`, `cx`, `hy`, `sup`, `reg`, `mask` (`kund` waits on `built:false`). Tier decides it.
- RERUN EXISTING GROUND: every tier, free, never revocable (`PLAN_ALWAYS`). Keep as its own verb.
- OPEN NEW GROUND: the only metered verb. Gift 100 once, free 10 a week banking, 400, 800, 1200, 1200 a month.
- ADVANCED PRACTICE: DROP. The owner ruled tools on all four. Reserve the key, assign no tier, sell nothing until ruled.
- LEAD OTHERS: keep. It is `lead:true`, tier four only, and the only verb about other people's data.

The proposal's one sound point survives, in words that fit the table. A downgrade or lapse never removes ground opened (`meter.unique`, reruns, journal, history, points), never deletes the record, and never ends a rerun. What a lapse does take is layer sight, because the owner made that a property of the tier. The lock says what is kept. No snapshot of old layers for MVP.

One conflict is real and it is the commercial hinge. The gift says "everything visible", then reverts. Showing saboteurs for 100 patterns and then greying them is the takeaway the proposal warns about. It is also the strongest moment of value in the product. DECISIONS 2668 left it open. Default taken: the gift shows through the character layer, and at gift end the lock copy says "your reading is kept, tier one shows it". Record as taken, he can overrule.

## What the server must own, what the browser may cache

SERVER, because it crosses a boundary or involves money:
- Who the account is, credentials, sessions, deletion, export.
- Subscription truth. Stripe is the record. The server mirrors it by re-reading, which is already right.
- Tier, status, period (`billingOf`). The server must also ignore any plan the client sends (it does: no route accepts one).
- Lead grants: practitioner licence (tier four) AND the person's consent, per person, listed, revocable. Every roster read checks both. Not built.
- Any real scarcity (founding seats). A browser cannot hold a shared count.

BROWSER MAY CACHE: tier, status, since, until, as a lease; the meter; the base for the period. It paces. It does not prove.

The proposal says the browser must never decide how many patterns remain. Under one file and no server content, it must. A server that never sees keys cannot tell unique from repeat. One that sees keys learns which addresses a person opens, which is intimate; `OB_NEVER` in `outbox.js` keeps `meter` off the wire. The server can own tier and period. It cannot own pace without owning content. Do not build a meter service.

## What a stale or forged local record can do

STALE, the honest failures (these cost you customers):
- Cancelled on a phone, desktop offline: keeps tier and sight until its next online boot check.
- Renewed elsewhere, desktop offline: the period does not roll, so a paying person reads "nothing left". Worst case.
- Mid month upgrade: `planFromServer` 316 opens a full new grant on any tier change. Tier one, spend 400, go to tier two: 800 more, so 1,200 for about $29.

FORGED (a person editing their own file or pasting a record):
- `tier:'four', status:'active', granted:1000000` passes `validateProfile` and reads as a million patterns. Gets: layers drawn, registers, masks. Tier four's lead suite shows an empty roster, because the data is not on the device.
- Clock forward, or `giftAt` back: free banking is `weeks x 10` and uncapped. 40 weeks is 400, a tier one month, free. An honest year away does the same.
- Clear `unique` or `giftAt`: re-opens ground and a new gift.
- Cannot do: read anyone else's data, move Stripe, change a bill.

Forging costs nothing real (content is templates). Rule: never wrongly block an honest person, never give a forger more than a patient free user gets.

## Cheapest correct MVP (nothing here needs a meter service)

1. Deploy what exists: commit the uncommitted server files, merge to `main`, set the four price ids and secrets, `BASE_PLAN=0`, fix the return address so `?billing=` is read. Size S, owner steps. Unlocks everything.
2. Clamp `granted` to the tier's own grant in `validateProfile` and `planAllowance`. S.
3. Give the cached plan a lease: live only while `until` plus the server's 3 day grace is ahead, or a boot check confirmed it. After that it reads free for new ground and layers lock; ground opened is untouched. And on a refused run while signed in, re-read `/v1/me` before saying no. S.
4. Mid period tier change keeps `base`, sets the new grant, spend this period still counts. Upgrade adds the difference. S.
5. Checkout refuses a second live subscription and says "Manage billing". S.
6. Cap free banking (default 12 weeks, 120 patterns, about five runs), recorded as taken. S.
7. Hear `charge.refunded` and `charge.dispute.created`; a seven day refund is ruled. S.
LATER: a signed lease (the server signs the plan, the file verifies it) so the offline plan is tamper evident; lead grant table and roster routes (L); founding seats (M).

## Funnel read (my deliverables)

- MOMENT OF VALUE: the first tap on a locked layer after a first release, when the person has just felt the release and wants to know what is running that address. It sits today as a lock tooltip and a profile section. The account step should come at "keep this" before it, never at the checkout.
- DROP OFF: levels 4 and 5 (40 and 30 percent, `BUYERS.md`) leave at the work, not the price. Levels 6 and 7 leave when Stripe returns them to a page that does not know they paid.
- QUESTION TO ASK: "What did you do right after your first reading?" Then "What would you have expected to pay?" before showing 12, 29, 59, 99. Then "What would make you stop?"

## Risks

- Cancelling must not read as withdrawal of care. No lock, no checkout, no upsell inside any distress response (area 4 must hold the gate before any commerce surface).
- Founding seats: scarcity is allowed only if real, atomic and server held. No timer, ever.
- Billing writes five fields only. A ledger or journey state must never ride the billing record: story and record stay unjoined.
- Two devices, two meters: a fresh allowance per device until sync exists. Accept for MVP, say so.

## Recommended order

1. Deploy and return address. 2. Items 2 to 5 as one slice, a test per forge above. 3. Lease and refusal re-read. 4. Refund events, banking cap. 5. Verbs as keys in `plan.js`, read off `SIGHT`, no second table. 6. Later: lead grant, signed lease, seats.
