# Stripe, what is done, what is left, and the steps for him

Written 1 October 2026, round OU. His words: "we still need to wire Stripe. So I
need the steps for those, like I'm nine."

Stripe is the company that takes the card. Atüned never sees a card number: the
app asks our server for a Stripe page, and Stripe asks for the card on its own
page. `STRIPE-SETUP.md` already holds click by click steps. **This file does not
replace it.** It does two new things: it says honestly how much of the Stripe
wiring is real today, read from the server's code and not from a document, and
it gives the order of what is left. Two things in `STRIPE-SETUP.md` are not true
yet and are corrected here (the "Pushing to main deploys" line, and where the
person lands after paying).

**What this was read against.** The server is the separate repository
`reboot-os`, branch `claude/app-migration-decision-yx56cj`, folder
`atuned/server/`: `src/stripe.js`, `src/index.js`, `src/store.js`,
`wrangler.toml`, `README.md`, `migrations/0009_stripe.sql`,
`migrations/0010_stripe_lifecycle.sql`, `test/billing.test.mjs`, and
`.github/workflows/server.yml`. The app side is `atuned_src/ui/auth.js`,
`ui/panels.js`, `ui/plans.js` and `engine/plan.js` here. Nothing in either
repository was changed to write this.

---

# Part 1. The honest status

## 1.1 The most important line

**None of the Stripe code is on the server's live branch.** The branch that
carries it is `claude/app-migration-decision-yx56cj`. The branch named `main`
in `reboot-os` has no `stripe.js` at all (checked: `origin/main` holds
`ee73363`, which is two commits ahead of where the Stripe branch was cut). The
deploy workflow (`.github/workflows/server.yml`) only migrates and deploys when
the push is to `main`, and only when the two Cloudflare secrets are present in
GitHub. So the Stripe routes are not on the running server, and the web address
you would give Stripe for its webhook does not answer yet.

And a second line, because it changes what "done" means: **the portal, the
renewal handling and the "what plan is this person on" read-back exist only as
edited files that have not been committed.** On the branch, at commit
`f1c0913` ("Add Stripe as the fourth way a plan can change, alongside Apple and
Google"), the server hears one Stripe event only. The files that give it the
other four, the billing portal, and the plan read-back are modified in the
working folder but not committed: `src/index.js`, `src/store.js`,
`src/stripe.js`, `test/billing.test.mjs`, `wrangler.toml`, `README.md`, and a
new migration file `0010_stripe_lifecycle.sql` that git does not yet track. They
need committing, and merging into `main`, before anything below can be done in
the real world.

## 1.2 The table

"Tested" below means a test on the server's own computer passes against a pretend
Stripe. **Nothing here has ever talked to the real Stripe.** How I know is in the
right-hand column.

| Piece | Status | How I know |
|---|---|---|
| Checkout route (`POST /v1/billing/checkout`) opens a Stripe payment page for one of the four tiers | **Written and tested, not live** | `createCheckout` in `src/stripe.js`; three tests in `test/billing.test.mjs` (it needs a sign in, a known tier, a key and a price, in that order; it sends the right shape and never a card). Committed on the branch at `f1c0913`, not on `main` |
| Webhook route (`POST /v1/billing/webhook`) hears Stripe, checks its signature | **Written and tested, not live** | `verifyStripeSignature` follows Stripe's published scheme (the signed text is the timestamp, a dot, then the raw body, signed with HMAC-SHA256, compared in constant time). Tests refuse a missing secret, a wrong signature and a bad header |
| Webhook hears all five events: first payment, tier change, plan ended, monthly renewal, card refused | **Written and tested, uncommitted** | `STRIPE_HEARD` in `src/index.js` lists `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`. 26 tests in `billing.test.mjs`, all passing |
| A renewal keeps the plan on (the sweep no longer drops a paying person to Free after month one) | **Written and tested, uncommitted** | Two tests: with the renewal the sweep leaves it alone, without it the sweep drops it, which was the defect |
| Billing portal route (`POST /v1/billing/portal`), Stripe's own page for changing tier, replacing a card, cancelling | **Written and tested, uncommitted** | `createPortal`; tests: needs a sign in, a key and a customer in that order; opens for that customer; the body cannot point it at another account; a Stripe refusal comes back as a 502 in Stripe's words |
| Plan read back: `GET /v1/me` returns `billing` and the app lays it on the record | **Written and tested on both sides, server half uncommitted** | `billingOf` in `src/store.js` and one test; the app half is `authPlanTake`, `authPlanBack`, `authPlanPortal` in `ui/auth.js`, committed in this repository |
| Test run | **26 of 26 pass** | I copied the server folder as it stands today (including the uncommitted edits) to a scratch folder and ran `node --test test/billing.test.mjs`. Result: tests 26, pass 26, fail 0. The repository was not touched |
| Merged to `main` and deployed to Cloudflare | **Not done** | `origin/main` has no `stripe.js`. The workflow deploys only from `main` |
| The four Stripe price ids in `wrangler.toml` | **Not done** | All four still read `REPLACE_WITH_STRIPE_PRICE_ID_FOR_TIER_...`. The server treats that as "not set up" and answers 503 "this tier has no price set up in Stripe yet" (a test proves it never sends the placeholder to Stripe) |
| Products and the four monthly prices (12, 29, 59, 99 US dollars) made in Stripe | **Not done, as far as the repository shows** | The placeholders above. Stripe's own dashboard cannot be read from here, so **check this** |
| `STRIPE_SECRET_KEY` set on the server | **Unknown, check this** | A secret is never in a repository, by design. No document records it as done |
| `STRIPE_WEBHOOK_SECRET` set on the server | **Unknown, check this, and cannot exist yet in a useful form** | Same. Also the secret belongs to a webhook endpoint that cannot be created in a way that works until the route is live |
| Webhook endpoint registered in Stripe | **Not done, cannot work yet** | The route is not on the live server |
| Customer portal switched on in Stripe | **Unknown, check this** | A Stripe dashboard setting. `src/stripe.js` says Stripe refuses the portal until it is saved once |
| Success and cancel return addresses | **Set in code, but they land on the wrong page** | `createCheckout` sends people to `APP_URL + '/?billing=done'` and `'/?billing=cancelled'`; the portal returns to `'/?billing=managed'`. `APP_URL` is `https://atuned.world`. But `.github/workflows/deploy.yml` makes `atuned.world` open on the funnel, and puts the app at `atuned.world/atuned.html`. So the person comes back to the funnel page, where nothing reads `?billing=`. Their plan is still saved and shows the next time the app opens, but "Tier one is on this record now" will not appear. `STRIPE-SETUP.md` step 10 says "You land back in the app". **That is not true as written. Check this** and see question 1 at the end |
| Test mode against live | **All of it is test mode first** | Nothing is live. `STRIPE-SETUP.md` Part A is test mode, Part B is live |
| End to end test purchase with card `4242 4242 4242 4242` | **Not done** | Needs every row above first |
| Going live | **Not started** | Needs Stripe to activate the account (business details, bank account), then the whole of Part A again with test mode off |
| The `BASE_PLAN` setting | **A go-live trap** | `wrangler.toml` has `BASE_PLAN = "1"`: "every account is Growth until payments exist... 0 at launch". The server's own plan number is the highest of that and anything paid, so at 1 a tier one purchase changes nothing there. The app reads the `billing` field instead, so it is not wrong on screen, but the setting must be `0` before real launch. **Check this** |

## 1.3 Two traps in the deploy, in plain words

1. **Merge, do not copy the file.** On the Stripe branch `wrangler.toml` still
   says `database_id = "REPLACE_AFTER_wrangler_d1_create"`, because the branch
   was cut before the real database id was committed to `main` (`ee73363`,
   "Update wrangler.toml"). The deploy workflow has a guard: if that placeholder
   text is in the file, it prints a note and **stops without deploying, with a
   green tick**. A proper git merge keeps the real id. Copying the branch's
   whole `wrangler.toml` over `main`'s would silently stop all deploys.
2. **The migrations run on their own.** `wrangler d1 migrations apply atuned
   --remote` is a step in the same workflow, so migrations `0009` and `0010`
   (which only add columns, nothing is removed) apply when the merge deploys.

## 1.4 Smaller gaps, for the record

- The webhook does not check that Stripe's timestamp is recent (Stripe's own
  libraries refuse anything older than five minutes by default). Low risk here,
  because the server re-reads the subscription from Stripe on every event and
  never trusts the event's own contents, so a replayed message changes nothing,
  but it is a one line hardening.
- `ALLOWED_ORIGIN = "*"` lets any website call the API from a browser. Fine for
  a bearer token API, to be narrowed at launch (the OAuth design, slice OA6).

---

# Part 2. Steps for him, like he is nine

**What you are doing.** Stripe has a practice copy of itself (test mode) where
fake cards work and no money moves. You will set that up, run one pretend
purchase, and only then do the same with real money.

**Four rules.**

1. **Stripe is its own login.** It is not the same account as Cloudflare,
   GitHub, Google or Claude, even if the email is the same. If you have no
   Stripe account, the login page at **dashboard.stripe.com** has a **Sign up**
   button near the **top right**.
2. **Secrets go in one place only:** the terminal commands below. Never paste a
   secret into the chat, an email, a text or a file in GitHub. The Stripe
   **Secret key** (starts `sk_`) and the **Signing secret** (starts `whsec_`)
   are secrets. A **price id** (starts `price_`) is not.
3. **Test mode for everything first.** Real money only after step 11.
4. **If a screen does not match, stop and send a screenshot.** Stripe moves its
   buttons often. These steps were written on 1 October 2026 without being able
   to open Stripe, from Stripe's layout as last known and from
   `STRIPE-SETUP.md`. Where I am not sure, the step says "look for".

## Before you start

- A computer with a web browser, about forty minutes, and a notes file.
- A terminal (a plain text window where you type commands). To open one: on a
  Mac press Cmd and Space together, type `Terminal`, press Enter; on Windows
  press the Windows key, type `PowerShell`, press Enter. You did this for
  `RECORDS_KEY`; the steps are in `HOSTING-SETUP.md`, "Step 4, done in full",
  items 1 to 3. Type `node -v`; a number like `v20.11.0` means it is ready.
- You need to be logged in to Cloudflare in the terminal. Type `npx wrangler
  login`, press Enter, click **Allow** in the window that opens.

**Where the server is, so you know what you are pasting into.** The server is a
small program on Cloudflare named `atuned-api`. Its secrets go to Cloudflare
from your terminal. Its ordinary settings (the four price ids) live in a file
called `wrangler.toml` in the `reboot-os` repository on GitHub, and a push to
`main` there updates the live server by itself.

## Step 0. Wait for us: the Stripe code has to go live first

This one is **ours, not yours.** Stripe cannot send news to a web address that
does not answer yet (section 1.1). We commit the finished server files, merge
them to `main`, and tell you. Do not start step 8 before you hear that.

How you can see it happened: go to **github.com** (your GitHub login, a separate
account), open the **reboot-os** repository, click **Actions** in the row of
tabs near the top, and click the newest run named **server**. When it is done
it shows a green tick, and the steps inside include **migrate and deploy** with a
tick, not a skipped grey line. A skipped grey line means the deploy did not run
(see trap 1 in section 1.3).

Steps 1 to 7 do not need this and can be done now.

## Step 1. Log in to Stripe

1. Open **dashboard.stripe.com** in your browser.
2. Type your Stripe email and password, press **Sign in**. Stripe may text you
   a code. Type it in.
3. You are on Stripe's home page. There is a menu down the **left side**.

## Step 2. Switch to test mode

1. Look at the **top right** of the page for a switch called **Test mode**.
   Turn it on. An orange strip across the top, saying you are in test mode,
   appears.
2. If there is no such switch, click your **account name at the top left**. In
   the list that opens look for **Switch to sandbox** (Stripe's newer word for
   test mode). If it asks you to make a sandbox, say yes and name it `Atuned
   test`.

Everything in steps 3 to 10 is done in test mode. Look for the orange strip each
time. If it is missing you are in the real one: stop.

## Step 3. Make the four products

A product is one thing you sell. We sell four, one per paid tier. Do this four
times, once per row.

| Name to type | Price | How often |
|---|---|---|
| Tier one | 12 US dollars | every month |
| Tier two | 29 US dollars | every month |
| Tier three | 59 US dollars | every month |
| Tier four | 99 US dollars | every month |

Those are your own figures from 1 October ("Tier 1: $12/month. Tier 2: $29/month.
Tier 3: $59/month. Tier 4: $99/month."). Monthly only. Add no yearly price.

1. In the **left menu** click **Product catalog**. (Look for the word
   **Products** if it says that instead.)
2. At the **top right** of that page click **+ Create product** (it may say
   **+ Add product**).
3. A panel opens. In **Name** type the name from the table, for example
   `Tier one`.
4. **Description** may be left empty.
5. Lower down, under pricing, choose **Recurring**, not **One-off**. Recurring
   means it charges again every month by itself.
6. In **Amount** type the number, for example `12`. Next to it is a currency
   box: it must say **USD**.
7. In **Billing period** choose **Monthly**.
8. Click the button at the **bottom right** of the panel: **Add product** (or
   **Save product**).

When all four are done, Product catalog lists Tier one, Tier two, Tier three and
Tier four.

## Step 4. Copy each price id

Each product has a price id. It starts `price_`, for example
`price_1Q2w3E4r5T6y7U8i`. It is not secret. It is how our server says "charge
for this one".

For each of the four:

1. In **Product catalog** click the product's **name**.
2. On its page find the box called **Pricing**. It has one row, for example
   "$12.00 USD / month".
3. At the **right end of that row** look for a **...** button. Click it, then
   click **Copy price ID**. If there is no **...**, click the row itself; the
   price id is near the **top right** of the page that opens with a small copy
   icon beside it.
4. Paste it into your notes next to the tier name.

You should end with:

    Tier one     price_...
    Tier two     price_...
    Tier three   price_...
    Tier four    price_...

## Step 5. Give us the four price ids

The server reads them from `wrangler.toml` as `STRIPE_PRICE_ONE`,
`STRIPE_PRICE_TWO`, `STRIPE_PRICE_THREE` and `STRIPE_PRICE_FOUR`. Two ways.

**The easy way (recommended).** Paste the four lines from step 4 into the chat
with us. They are not secrets. We put them in the file, merge it, and tell you
when the server is updated.

**Doing it yourself, on the GitHub website.**

1. Go to **github.com** and log in. Open the **reboot-os** repository.
2. Click the folder **atuned**, then **server**, then the file **wrangler.toml**.
3. Click the **pencil icon** at the **top right** of the file.
4. Find the four lines starting `STRIPE_PRICE_ONE`, `STRIPE_PRICE_TWO`,
   `STRIPE_PRICE_THREE` and `STRIPE_PRICE_FOUR`. Replace only the text inside
   the quote marks, for example:

       STRIPE_PRICE_ONE = "price_1Q2w3E4r5T6y7U8i"

5. Click the green **Commit changes...** button at the **top right**, then
   **Commit changes** again in the box that opens.

**Check this first:** that the `wrangler.toml` you are editing is on the branch
that has the Stripe code, after we have merged (see trap 1 in section 1.3). If
we have not told you it is merged, use the easy way.

## Step 6. Give the server the Secret key

The Secret key lets our server ask Stripe for payment pages. **It is a real
secret.**

1. On **dashboard.stripe.com**, still in test mode (orange strip), click
   **Developers**. It is near the **bottom of the left menu**, or the **top
   right** of the page, depending on the Stripe version. (In newer versions
   this opens a panel called **Workbench**.)
2. Click the **API keys** tab.
3. Find the row **Secret key**. In test mode it starts `sk_test_`. Click
   **Reveal test key**, then click the key to copy it.
4. **Do not copy the Publishable key** (starts `pk_`). Nothing in Atüned uses it
   and it must not go into the app.
5. Open your terminal. Type this and press Enter:

       npx wrangler secret put STRIPE_SECRET_KEY --name atuned-api

6. It asks for a value. Paste the key and press Enter. Nothing shows while you
   paste. That is normal. It says **Success**.
7. Check the name is on the server. Type `npx wrangler secret list --name
   atuned-api`. It prints names, never values. You should see
   `STRIPE_SECRET_KEY`. **Check this** that your version of the tool has that
   command. If not: **dash.cloudflare.com**, click **Workers & Pages** in the
   left menu, click **atuned-api**, click **Settings**, look for **Variables and
   Secrets**.

## Step 7. Turn on the billing page (the Customer portal)

"Manage billing" in the app opens a Stripe page where a person changes tier,
replaces a card or stops paying. Stripe will not open it until you switch it on
once. If you skip this, pressing Manage billing says Stripe refused it, in
Stripe's words.

1. On **dashboard.stripe.com**, in test mode, click the **gear icon** at the
   **top right**. That is **Settings**.
2. Under the heading **Billing** click **Customer portal**.
3. Set these switches:
   - **Customers can update payment methods:** on.
   - **Customers can cancel subscriptions:** on. If it asks when, choose **At
     the end of the billing period**.
   - **Customers can switch plans:** on. Below it is a box for products. Add
     all four: Tier one, Tier two, Tier three, Tier four.
4. Click **Save** (top right or the bottom of the page; in test mode it may say
   **Save and activate**).
5. **Check this:** Stripe may ask for a link to your terms of service and
   privacy policy before it saves. If it does, send us what it says and we find
   the addresses.

## Step 8. Tell Stripe where to send news about payments (after step 0)

When somebody pays, renews, changes tier, has a card refused or stops, Stripe
sends our server a message. This is called a webhook: a web address on our
server that Stripe knocks on.

1. On **dashboard.stripe.com**, in test mode, click **Developers**, then the
   **Webhooks** tab.
2. Click **+ Add endpoint** at the **top right**. In newer Stripe this button
   may say **+ Add destination**. If so choose **Your account**, then **Webhook
   endpoint**, when it asks.
3. In **Endpoint URL** paste exactly:

       https://atuned-api.lance-o-powell.workers.dev/v1/billing/webhook

   Where that comes from: `atuned-api` is the server's name,
   `lance-o-powell.workers.dev` is the address the app already uses (`AUTH_API`
   in `ui/auth.js`), and `/v1/billing/webhook` is the route in
   `src/index.js`. If we later give the server its own address
   `api.atuned.world`, this one changes and we will tell you.
4. Click **+ Select events**. A list opens with a search box at the top. Tick
   **exactly these five**, by typing each name in the search box and ticking the
   box beside it:

       checkout.session.completed
       customer.subscription.updated
       customer.subscription.deleted
       invoice.paid
       invoice.payment_failed

   Click **Add events**. The list under "Listening to" must show all five.
   Those are the five the server acts on (`STRIPE_HEARD` in `src/index.js`).
   Any other event is accepted and ignored.
5. Click **Add endpoint** (or **Create destination**) at the bottom.

## Step 9. Give the server the webhook's Signing secret

This proves to our server that a message really came from Stripe. **It is a real
secret too.**

1. You are on the page of the endpoint you just made. Find **Signing secret**.
   It is on the **right side** of the page or near the **top**.
2. Click **Reveal**. It starts `whsec_`. Click it to copy.
3. In your terminal type and press Enter:

       npx wrangler secret put STRIPE_WEBHOOK_SECRET --name atuned-api

4. Paste the Signing secret and press Enter.

Without it the server refuses every message from Stripe, by name: "the webhook
secret is not set on this server".

## Step 10. Run one pretend purchase, and what you should see at each point

Use a test account, signed in. Ask us first that the server is live (step 0) and
that the price ids are in (step 5).

1. In the app, open **Settings**, then **Billing**, and press **Move to tier
   one**.
   - **You should see:** the whole window moves to a Stripe page, with an
     orange test strip or the word TEST somewhere on it. The address starts
     `checkout.stripe.com`.
   - **If instead** the status line says "Billing is not connected on this
     server yet", the Secret key is not set (step 6). If it says "This tier has
     no price set up in Stripe yet", the price ids are not in (step 5).
2. On the Stripe page pay with the **test card** `4242 4242 4242 4242`, any
   future date such as `12/34`, any three digits such as `123`, and any
   postcode. The email is filled in already.
3. Stripe sends your browser back. **Check this:** where you land. By the
   server's code it is `https://atuned.world/?billing=done`, which is the
   funnel page and not the app (section 1.1). If you land on the funnel, open
   `atuned.world/atuned.html` yourself and sign in. Within a few seconds a short
   line in the **top bar** under the menu says **Tier one is on this record
   now.** (it fades after two seconds). Then in **Settings**, **Billing**, the
   Tier one row says **You are on this**. If you were sent straight back into
   the app, the line is the same and you may also see "Payment finished.
   Waiting for Stripe to confirm it." for up to a dozen seconds first.
4. Now look at Stripe. On **dashboard.stripe.com**, in test mode, click
   **Developers**, then **Webhooks**, click your endpoint, and look for the list
   of **Event deliveries** (also called **Recent deliveries**). You should see,
   newest first, `checkout.session.completed` and `invoice.paid`, each with
   **200** beside it. Click one, then **Response**: it should read
   `{"received":true,"handled":true}`. `handled:true` means our server found the
   account and wrote the plan. `handled:false` with a 200 means it heard the
   message and could not place it, which is what to tell us.
5. Also look at the **Events** list: in newer Stripe, **Developers**, then
   **Events** (or the **Events** tab inside Workbench). It lists everything that
   happened, including events our server does not listen to
   (`customer.subscription.created`, `payment_intent.succeeded`). Only the five
   we ticked are sent to us. Seeing the extra ones is correct.
6. Back in the app, press **Manage billing**. **You should see:** a Stripe page
   listing the plan, with **Cancel plan** and **Update payment method**. Press
   **Cancel plan** so the test stops. In the app the plan stays on until the
   paid month ends, then reads Free. That is cancelling working as designed: a
   person keeps what they paid for. Stripe will then also show a
   `customer.subscription.updated` delivery with a 200.

The one line check: in the app, Settings, Billing shows **You are on this**
beside Tier one, and Stripe's webhook page shows 200 beside each event.

## If it fails

Copy the exact words the app or Stripe shows and send them to us. Each of these
is a real message the server sends, read from `src/stripe.js` and `src/index.js`.

| What you see | What it means | What to do |
|---|---|---|
| "Billing is not connected on this server yet" (503) | `STRIPE_SECRET_KEY` is not set | Step 6 |
| "This tier has no price set up in Stripe yet" (503) | The price id for that tier is still the placeholder | Step 5, then wait for the deploy |
| "No such price" in Stripe's words (502) | A price id from the wrong mode, or a typo | Test prices go with a test key; check step 4 against step 6 |
| Billing page "Not found" or "No such route" (404) | The Stripe code is not on the live server | Step 0 |
| Stripe webhook page shows **400** "the signature does not match" | The Signing secret on the server is not this endpoint's, or is from the other mode | Step 9 again, with this endpoint's secret |
| **503** "the webhook secret is not set on this server" | `STRIPE_WEBHOOK_SECRET` missing | Step 9 |
| **503** "Stripe could not be asked about that subscription" | The server's Secret key is from a different mode than the webhook (a test message with a live key, or the reverse) | Make the Secret key and the webhook the same mode. Stripe retries by itself |
| **500** with "reference" and a code | A fault in our server | Send us the reference |
| Manage billing says Stripe refused, naming a configuration | The portal was never saved | Step 7 |
| Manage billing says "There is no paid plan on this account yet, so there is no billing to manage" (409) | This account has not finished a checkout | Normal for a new account |
| After paying the app says "Stripe has not confirmed the payment yet" | The webhook did not arrive or did not place the plan | Look at the webhook page deliveries (step 10.4) |
| Paid, but the app still says Free, and deliveries show 200 with `handled:false` | The server could not match the message to an account or one of the four prices | Send us the delivery's Response text and the account email |

Stripe retries a failed webhook delivery by itself for a few days, so a delivery
that failed because the server was not ready often fixes itself. On a delivery
you can also click **Resend**.

## Step 11. Going live, real money

Only after step 10 works. Test and live are two separate copies of your Stripe
account, so **everything made in test mode must be made again** in live mode.

1. **Activate the Stripe account.** Stripe shows a banner or a button such as
   **Activate your account** near the top of the dashboard. It asks for business
   details, a bank account for the money to go to, and proof of who you are.
   Only you can fill that in. It can take a day.
2. **Turn the Test mode switch off** (top right). The orange strip goes away.
   Every page now shows live things.
3. **Make the four products again** (step 3) with the same names and prices,
   and copy their four **new** price ids (step 4). **Check this:** Stripe may
   offer a **Copy to live mode** option on a product in test mode. It is fine to
   use. The price ids will still be new.
4. **Put the four new price ids in** (step 5). Wait for the server to update
   (the green tick on the Actions page).
5. **Replace the Secret key** (step 6) with the live one, starting `sk_live_`.
   Run the same command; it replaces the old value.
6. **Add the webhook again** in live mode (step 8) with the same five events,
   and **replace the Signing secret** (step 9) with the new one.
7. **Switch the Customer portal on again** in live mode (step 7).
8. **Set `BASE_PLAN` to `"0"`** in `wrangler.toml` (section 1.2, last row). Ask
   us to; it is one word.
9. **Do the whole of step 10 once with a real card of your own** on Tier one,
   then press **Manage billing**, **Cancel plan**. In Stripe, in live mode,
   click **Payments** in the left menu, click the payment, click **Refund** at
   the top right, so you do not keep your own 12 dollars.
10. Change steps 4 to 6 in one sitting, not over days: until the live price
    ids, the live key and the live webhook are all in, checkout will fail with
    "No such price". Nobody is using it before launch, so that is harmless.

---

# Part 3. What I could not verify, as questions for him

Each is a "check this" above.

1. **Where should a person land after paying?** Today the server sends them to
   `atuned.world/?billing=done`, which is the funnel page, and the app is at
   `atuned.world/atuned.html`. Either the server's return addresses change to
   the app's page, or the funnel is taught to pass the word on, or the app
   moves to the front of the site. Which does he want? (The same choice applies
   to the password reset link, and to the Google sign in return, in
   `OAUTH-DESIGN-AND-STEPS.md`.)
2. **Is there already a Stripe account, and is it activated for real money?**
   Nothing in the repository says.
3. **Are `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` already set on the
   server?** The command `npx wrangler secret list --name atuned-api` answers.
4. **Are the products already made in Stripe?** Look in test mode, Product
   catalog.
5. **Is the Customer portal already saved in Stripe?** Settings, Billing,
   Customer portal.
6. **Does Stripe ask for terms of service and privacy policy links** when the
   portal is saved? What are the web addresses?
7. **Does the Stripe dashboard on his screen say Test mode or Sandbox,** and is
   the Developers menu a Workbench panel? Send a screenshot of the top of the
   page so the steps can be matched to it.
8. **Is the live server's Stripe code merged?** That is ours to do (step 0),
   and until it is done nothing from step 8 onward can be tested.
9. **Do the committed server files exist anywhere other than that one folder?**
   The edits that add the portal, renewals and the plan read-back are not
   committed. They need committing before anything is lost.
10. **Tier one is "400 a month or 100 a week"** in `DESIGN-billing.md`, and the
    server and `STRIPE-SETUP.md` say 12 dollars a month. His own 1 October
    figures win, and are used here. Say if tier one's allowance should read
    differently on the Stripe product description.
