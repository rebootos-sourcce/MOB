# Stripe and the gift bank: what exists, what is wired, and the questions for the other AI

Read on 15 October 2026 from both repositories and from the live server
itself (Cloudflare read back run 38818222091, the server's own variables by
value). Nothing here is from memory.

## Stripe. The code is done. The keys never arrived.

**Built and on main, both sides:**

- Server (`Reboot-OS`, `atuned/server/src/stripe.js`, `index.js`): checkout
  (`POST /v1/billing/checkout`), the billing portal (`POST /v1/billing/portal`),
  the webhook (`POST /v1/billing/webhook`) hearing five events (checkout
  completed, subscription updated, subscription deleted, invoice paid, invoice
  payment failed), the plan read back, migrations `0009_stripe.sql` and
  `0010_stripe_lifecycle.sql`, tests in `test/billing.test.mjs`.
- App (`MOB`, `ui/plans.js`, `ui/panels.js`, `ui/auth.js`, `funnel/buy.html`):
  the four tiers at 12, 29, 59, 99, the buy page, Manage billing, the plan
  shown in the app.
- Setup tool (`MOB`, `tools/stripe-setup.js`): makes the products and monthly
  prices in Stripe by their lookup keys, safe to run twice, prints the price
  ids. Never run with a real key so far.
- Deploy (`Reboot-OS`, `.github/workflows/server.yml`): puts the Stripe key
  and webhook secret into the Worker, passes the four price ids, then checks
  the live Stripe account after every deploy (prices, webhook, portal).
- Documents (`MOB`): `STRIPE-SETUP.md`, `STRIPE-STEPS-NOW.md`,
  `STRIPE-GO-LIVE.md` (the current one), `STRIPE-API-STEPS.md`,
  `HANDSHAKE-STRIPE.md`.

**What the live server holds right now (read at 22:36 UTC):**

| Setting on the Worker | Value |
|---|---|
| STRIPE_PRICE_ONE | REPLACE_WITH_STRIPE_PRICE_ID_FOR_TIER_ONE |
| STRIPE_PRICE_TWO | REPLACE_WITH_STRIPE_PRICE_ID_FOR_TIER_TWO |
| STRIPE_PRICE_THREE | REPLACE_WITH_STRIPE_PRICE_ID_FOR_TIER_THREE |
| STRIPE_PRICE_FOUR | REPLACE_WITH_STRIPE_PRICE_ID_FOR_TIER_FOUR |
| STRIPE_BILLING_ENABLED | 0 |
| STRIPE_SECRET_KEY (secret) | not present |
| STRIPE_WEBHOOK_SECRET (secret) | not present |

And the last server deploy on main (14 October, run 38511837674) printed:
"The Stripe check was skipped: GitHub secret STRIPE_SECRET_KEY is not set, so
the paywall is not live yet." Its environment showed `STRIPE_SECRET_KEY`,
`STRIPE_PRICE_ONE`, `_TWO` and `_THREE` all empty.

So: the paywall code is complete, and the one thing that was never done is
the paste of the Stripe secret key and webhook secret into the Reboot-OS
GitHub secrets. Until that paste, checkout stays closed by design
(`STRIPE_BILLING_ENABLED=0`), and nobody can pay.

**Questions for the other AI (ChatGPT), so nothing is done twice:**

1. The owner says the Stripe work was already done with you. Which of these
   did you do, and where is the evidence: (a) the four products and prices
   created in the Stripe dashboard or by `tools/stripe-setup.js`; (b) the
   price ids copied; (c) the secret key and webhook secret pasted into
   GitHub secrets, and into which repository (MOB or Reboot-OS); (d) the
   webhook endpoint created in Stripe pointing at
   `https://atuned-api.lance-o-powell.workers.dev/v1/billing/webhook`; (e)
   the customer portal switched on?
2. If the key was pasted into MOB's secrets rather than Reboot-OS's: the
   server deploys from Reboot-OS and reads only Reboot-OS secrets, so MOB's
   copy does nothing. Confirm or deny.
3. If prices were created: in test mode or live mode, and what are the four
   price ids (they are not secrets)?
4. Was `STRIPE_BILLING_ENABLED` ever set to 1 anywhere, and by whom?

## The gift bank. The machinery is done. The content does not exist.

**Built and on main:**

- The starter gift itself: `starter_gifts` and `starter_gift_items` tables,
  100 granted per person, atomic transfer to the account on sign up
  (`Reboot-OS atuned/server/supabase/0007_atomic_starter_gift_transfer.sql`,
  `0015_first_visit_reaches_the_account.sql`), the usage ledger, the funnel
  session that carries it (`src/funnel.js`). The live smoke on every deploy
  walks it: "a gift, attached and read back".
- The app's side: the gift row of 100 in the plan ladder (`MOB
  engine/plan.js`, `GIFT_N`), the funnel system's domain (`MOB
  atuned_funnel_system/`), the buy page naming the gift.
- The validation contract for the content: `Reboot-OS
  atuned/docs/gift-bank-validation-contract-2026-10-14.md`. It requires six
  banks (anxiety, overwhelm, burnout, depression, grief, sadness), exactly 100
  items each with stable ids, source provenance, a hash and an owner approval
  reference, and a six to four mapping onto tracks.

**What does not exist in either repository:**

- Any of the six bank files.
- The two documents the contract cites as its evidence,
  `release-pattern-source-inventory-2026-10-10.md` and
  `release-pattern-candidate-crosswalk-2026-10-10.json`. They are not in any
  branch of Reboot-OS and not in MOB.
- The nature to track mapping.
- The contract's own words: "declares zero owner-approved rows."

So the gift today is a counter of 100 with no patterns behind it
(`pattern_set_hash` is literally "unfrozen").

**Questions for the other AI:**

5. Where are the six bank files, if they were written? Name the file paths or
   the document.
6. Where are the inventory and crosswalk documents the contract cites? They
   are referenced but not committed anywhere we can find.
7. Is the source of the 100 patterns per bank the app's own 112 address
   catalogue, the 150 node crosswalk the contract mentions, or new writing?
8. What is the six to four mapping (which nature goes to which track), and
   was it the owner's decision or yours?
9. Has the owner approved any bank, and where is that approval recorded?
