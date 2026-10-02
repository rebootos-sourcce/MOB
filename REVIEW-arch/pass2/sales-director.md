# Pass 2, sales director (Camille Boucher). Round PK, 2 October

Read: all eight pass 1 files, and the pass 2 files from creative, technical, systems and game. Checked `engine/plan.js` (lines 21 to 130, 256 to 330) and `funnel/buy.html` against what they say. ICPs used: Ana and Nkem (distress), Gordon (refuses a frame), Derek (checks the number), Sofia (practitioner), the phone only arrival.

## 1. Agreements

- **Do not build a meter service.** Creative, systems, game, technical (he withdrew his endpoint). All content ships in one file, and a server told which addresses a person opens learns something intimate. The server owns tier and period. The browser owns pace.
- **Layer sight follows the tier. Opened ground is kept.** Creative, game, systems, technical, me. No snapshot of old layers.
- **No days, no stage, no confidence number on screen.** Game, creative, uiux, systems. Beside a price, a score is pressure.
- **A stored safety result is health data.** AI, systems, narrative, creative. Commerce reads the care level only as a runtime argument.
- **Deploy first.** Technical R0, game, creative. Nothing works while Stripe code is off `main`.
- **My list is adopted:** lease, `base` kept on tier change, one live subscription, refund and dispute events, banking cap (creative slice 10, technical A9 and R2).

## 2. Disagreements, and where I land

- **The gift shows through the character layer (mine) vs base sight only (game).** I change sides. Reason one: the status quo is already base sight only. `DECISIONS.md` says "a new person sees no saboteurs until they pay", so my default was a change, not a hold. Reason two: game is right that showing the layer for 100 patterns and then greying it is a take-away. A person who reads their own saboteurs and then loses them feels a loss. The clean moment is the first tap on a lock after a first release: the lock names what the layer shows ("Which saboteurs are running on your charge") and the person decides. That is curiosity, not loss. Cost: no demo of the layer on their own data. I accept it. Creative should move to match.
- **Clamp `granted` (me, technical) vs refuse by name (systems).** Systems wins. A clamp on the stored number hides a forged one. Refuse a record whose `plan.granted` is above the largest grant in the table (1,200), and have `planAllowance` read the smaller of `granted` and the tier's own grant. An honest record can never trip it.
- **Banking cap never mentioned (game) vs stated once (me).** I keep mine. The cap is 120 patterns (12 weeks at 10). A rule found by hitting it is a surprise. Printed once, flat, on the tiers page, it is not a timer. I ban the warning inside the flow ("you are close to your cap"), which meets game's concern.
- **Creative: tier four is sold as written.** Nobody else raised this, see section 3.

## 3. What I missed

- **Tier four sells something not built.** `plan.js` 126: tier four is tier three plus the lead suite, and `funnel/buy.html` 402 to 429 promises "only a lead that person has said yes to, by name". Technical confirms there is no grants table (R5). So $99 buys the same 1,200 patterns and the same sight as $59, plus an empty roster. This is the same defect the owner already ruled on for the Kundalini: `built:false`, "nothing sells it until it is built". I missed it in pass 1. Decision: tier four checkout reads "Opens with the lead suite" until R5 ships, and `lead` gets a `built` flag in the same table. Level 7 buyers (85 percent, the primary) buy tier three meanwhile. That costs revenue for a while; taking $99 for a consent list we cannot show costs more, and Sofia would find it first.
- **Sign up can fail on the Worker itself** (technical): 10 ms CPU on a free plan against a 100,000 round password hash, never run on a real D1. R0's gate must include one timed sign up on the deployed Worker.
- **Safari may clear a phone's storage after about seven days** (technical, from memory, to verify). A paying phone only person could return to an empty record. Tier and plan come back from the server. Ground opened, journal and history do not. Prompt for the encrypted backup after the first release, with a restore drill (export, wipe, import, same hash) proven before any tier three or four push.
- **Copy that is false at the account step** (narrative): "Nobody reads what you write here" is false once a locked copy sits on our server. The sign up box needs the separate consent line.
- **Efficacy claims on a sales page** (narrative). `funnel/buy.html` must pass the same sensation rule gate as the app, and "Tool of Unified LLC" must read Tula Unified LLC.
- **Refunds cost almost nothing.** Content is templates. Honour a refund in the ruled seven days, hear `charge.refunded`, build no clawback of opened ground.

## 4. The architecture, my part

**Verbs, read off `SIGHT`, no second table.** One function `planCan(pl, verb, arg)` with five verbs: `see_base` (every tier, never revoked), `rerun` (every tier, free, never revoked, `PLAN_ALWAYS`), `open_new` (the only metered verb), `see_layer(k)` (k is a `SIGHT` key: `sab`, `cx`, `hy`, `sup`, `reg`, `mask`), `lead` (tier four, and only when `built`). "Advanced practice" is dropped; every tool is on every tier.

**The lease.** A cached paid plan is live while `now <= until + 3 days` (the server's own grace), or a boot check confirmed it this session. Past that, new ground reads free (10 a week) and layers lock. Opened ground, reruns, journal and history stay. A refused run while signed in re-reads `/v1/me` once before saying no. This fixes the worst stale case: renewed on a phone, desktop offline, reads "nothing left".

**Tier change arithmetic.** Keep `base`. Spend this period still counts. Upgrade: new grant minus spend. Tier one (400) with 400 spent, up to tier two (800), leaves 400, not 800. Today `planFromServer` 317 to 323 opens a full 800, so 1,200 patterns cost about $29 where tier three is $59. Downgrade takes effect at period end, set in the Stripe portal, so no client rule.

**Free banking.** `min(weeks x 10, 120)`. Stated once on the tiers page. Never shown as a countdown.

**Commerce in care.** The lock, "See tiers", the ladder and any checkout render nothing while the runtime `care` argument is not ordinary (creative and uiux quiet register). No upsell push, ever. Push and email from billing are receipts and failed card notices only. The `care` value is passed in, never read from the record.

**Funnel measurement.** Nothing about behaviour leaves the device (`OB_NEVER`). The server already knows four counts: accounts made, checkout started, subscription live, cancelled. Reasons are asked by a person, with the three questions in my pass 1, price shown last.

**Agree before building.** Narrative: lock copy ("Your reading is kept. Tier one shows it.") and "Opens with the lead suite". Uiux: the quiet register, and fewer padlocks on the first Field screen. Systems: the refuse rule and `RECORD_NEVER`. Technical: A9 and R0 to R3 share my files. Game: the banking line.

## 5. Revised grade

GRADE: 63/100 (was 58). Up: seats converged on my cuts, the gift is settled on the safer side, systems gave a better `granted` rule. Down: tier four sells an unbuilt suite, sign up on the real Worker is unproven, a phone wipe threatens paid retention.

## 6. Top 5

1. **R0 deploy with a timed real sign up, `?billing=` read on return, `BASE_PLAN=0` (S).** Phone only arrival, Derek. Without it a person who paid is told nothing.
2. **Entitlement slice (S).** Refuse `granted` above 1,200, lease, `base` kept on tier change, one live subscription, banking cap, refund and dispute events, a test per forge. Derek, Gordon (no pressure), Nkem (never wrongly blocked).
3. **Close tier four until the lead suite is built (S).** Sofia, Derek. Protects trust at the one price where it is most expensive to lose.
4. **Lock copy and care suppression (S).** The lock names what the layer shows and what is kept; nothing prints in a care state. Ana, Nkem, Gordon.
5. **Backup prompt after the first release, with the restore drill, and the account step at "keep this" with its consent line (M).** Phone only arrival, Derek, Sofia.

## 7. Question for the owner

None. Decisions taken, each overrulable: the gift shows base sight only; tier four stays closed to purchase until the lead suite exists; the banking cap is 120 and is printed once on the tiers page; refunds in the ruled window are honoured with no clawback.

Order: R0 and R1 in the first wave. A9 with the safety screen. Lock copy waits on the care argument. Tier four reopens after R5. No commerce surface ships before the safety gate holds the quiet register.
