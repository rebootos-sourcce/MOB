# Setting up Stripe, step by step

> **Replaced on 9 October 2026 by `STRIPE-GO-LIVE.md`.** The secrets and price ids
> now go into GitHub secrets, not a terminal and not `wrangler.toml`, and the server
> checks them against Stripe after every deploy. Follow that page. This one is kept
> for the record.

Stripe is the company that takes the card. Atüned never sees a card number:
when somebody presses "Move to tier one", the app asks our server for a
Stripe page, and Stripe asks for the card there.

For that to work, Stripe needs to know four things exist (the four paid
tiers), and our server needs three secrets from Stripe. These steps do both.

**Do every step in test mode first.** Test mode is a practice copy of your
Stripe account. Nothing in it charges a real card. Part A is test mode. Part B
repeats the same steps for real money, and it waits until Part A works.

**Stripe moves its buttons around.** These steps were written on 1 October
2026. If a button or a word on your screen is not where a step says, stop
and tell us what you see instead, with a screenshot if you can. That is not
you doing it wrong. It is Stripe renaming something.

## What you need before you start

- A computer with a web browser.
- Your Stripe login. **Stripe is a separate account** from Cloudflare, from
  GitHub, from Claude, and from any Atüned account. It has its own email and
  password. If you do not have one, the website below has a "Sign up" button
  at the top right of its login page.
- About thirty minutes.
- For steps 6 and 8, a terminal (the plain text window from the hosting
  steps). How to open one is in `HOSTING-SETUP.md`, under "Step 4, done in
  full", items 1 to 3. You already did that once for `RECORDS_KEY`, so it
  will be familiar.

## The four tiers you are about to make

| Name in Stripe | Price | How often |
|---|---|---|
| Tier one | 12 US dollars | every month |
| Tier two | 29 US dollars | every month |
| Tier three | 59 US dollars | every month |
| Tier four | 99 US dollars | every month |

These are your own prices, from 1 October: "Tier 1: $12/month. Tier 2:
$29/month. Tier 3: $59/month. Tier 4: $99/month." Monthly only. Do not add a
yearly price; no yearly price has been decided.

---

## Part A. Test mode

### Step 1. Log in to Stripe

1. Open your browser and go to **dashboard.stripe.com**.
2. Type your Stripe email and password and press "Sign in". Stripe may send a
   code to your phone; type it in when it asks.
3. You are now on Stripe's home page. There is a menu down the **left side**
   of the screen.

### Step 2. Switch to test mode

Look at the **top right** of the page for a switch labelled **"Test mode"**,
and turn it on. The page turns a different colour, usually with an orange
strip across the top saying you are in test mode.

If there is no such switch: click your **account name at the top left**, and
in the list that drops down choose **"Switch to sandbox"** (Stripe's newer
name for test mode). If it asks you to create a sandbox, say yes and give it
any name, for example "Atuned test".

Stay in test mode for every step of Part A.

### Step 3. Make the four products

Do this four times, once for each row in the table above.

1. In the **left menu**, click **"Product catalog"**.
2. At the **top right** of that page, click **"+ Create product"** (it may
   say "+ Add product").
3. A panel opens. In **"Name"**, type the name from the table, for example
   `Tier one`.
4. Leave "Description" empty, or type `400 patterns a month` if you like. It
   is optional.
5. Lower down, under pricing, make sure **"Recurring"** is chosen, not
   "One-off".
6. In **"Amount"**, type the price, for example `12`. Next to it is a
   currency box. Make sure it says **USD**.
7. In **"Billing period"**, choose **"Monthly"**.
8. Click **"Add product"** (bottom right of the panel). It may say "Save
   product".

When all four are made, the Product catalog page lists Tier one, Tier two,
Tier three and Tier four.

### Step 4. Copy each price id

Each product has a **price id**. It always starts with `price_` and looks like
`price_1Q2w3E4r5T6y7U8i`. It is not a secret; it only names the product and
its price.

For each of the four products:

1. On the Product catalog page, click the product's **name**.
2. On the product's page, find the box called **"Pricing"**. It has one row,
   showing the price, for example "$12.00 USD / month".
3. At the **right end** of that row there is a **"..."** button. Click it,
   then click **"Copy price ID"**. (If there is no "...", click the row
   itself; the price id is shown at the **top right** of the page that
   opens, with a small copy button beside it.)
4. Paste it somewhere safe, like a note, next to the tier's name.

You should end with four lines like:

    Tier one     price_...
    Tier two     price_...
    Tier three   price_...
    Tier four    price_...

### Step 5. Put the four price ids into the server's settings

The server reads them from one file, `atuned/server/wrangler.toml`, in the
`reboot-os` repository on GitHub. Two ways to do this. Pick one.

**The easy way.** Send the four lines from step 4 to us in the chat. They are
not secret. We put them in the file and tell you when it is done.

**Doing it yourself, on the GitHub website.** GitHub is another separate
account; you used it before to put the database id into this same file.

1. Go to **github.com**, sign in, and open the **reboot-os** repository.
2. Click the folder **atuned**, then **server**, then the file
   **wrangler.toml**.
3. Click the **pencil icon** at the top right of the file to edit it.
4. Find the four lines that start with `STRIPE_PRICE_ONE`,
   `STRIPE_PRICE_TWO`, `STRIPE_PRICE_THREE` and `STRIPE_PRICE_FOUR`. Each one
   currently ends in `"REPLACE_WITH_STRIPE_PRICE_ID_FOR_TIER_..."`.
5. Replace only the text **inside the quote marks** with the matching price
   id. For example:

       STRIPE_PRICE_ONE = "price_1Q2w3E4r5T6y7U8i"

6. Click the green **"Commit changes..."** button at the top right, then
   **"Commit changes"** again in the box that opens.

Pushing to `main` deploys the server automatically, the same way the
database id did. That is the "deploy" step; there is nothing else to press.

### Step 6. Give the server the Secret key

The Secret key lets our server ask Stripe for pages. **It is a real secret.**
Never paste it into the chat, an email, or any file. It only goes into the
terminal command below.

1. Back on **dashboard.stripe.com**, still in test mode, click
   **"Developers"**. It is near the **bottom of the left menu**, or at the
   **top right** of the page, depending on your Stripe version.
2. Click the **"API keys"** tab.
3. Find the row called **"Secret key"**. It starts with `sk_test_` in test
   mode. Click **"Reveal test key"** on that row, then click the key to copy
   it.
4. Open your terminal.
5. Type this and press Enter:

       npx wrangler secret put STRIPE_SECRET_KEY --name atuned-api

   If it asks you to log in, it opens a browser window for **Cloudflare**
   (another separate account, the one that runs the server). Click "Allow",
   then run the command again.
6. It asks for a value. Paste the key and press Enter. Nothing shows while you
   paste; that is normal. It says "Success" when done.

### Step 7. Tell Stripe where to send news about payments

When somebody pays, renews each month, changes tier, has a card refused, or
stops, Stripe tells our server. This step sets that up.

1. On **dashboard.stripe.com**, in test mode, click **"Developers"** again,
   then the **"Webhooks"** tab.
2. Click **"+ Add endpoint"** at the **top right** of the Webhooks page. (In
   newer Stripe this button says **"+ Add destination"**. If so, choose
   **"Your account"**, then the events below, then **"Webhook endpoint"**.)
3. In **"Endpoint URL"**, paste exactly:

       https://atuned-api.lance-o-powell.workers.dev/v1/billing/webhook

4. Click **"+ Select events"**. A list opens with a search box at the top.
   Tick these **five**, one at a time: type each name into the search box,
   then tick the box next to it.

       checkout.session.completed
       customer.subscription.updated
       customer.subscription.deleted
       invoice.paid
       invoice.payment_failed

   Then click **"Add events"**. The list under "Listening to" should show all
   five. If you already made this endpoint with only the first one, open it,
   click **"..."** or **"Update details"** at the **top right**, and add the
   other four.
5. Click **"Add endpoint"** (or "Create destination") at the bottom.

### Step 8. Give the server the webhook's signing secret

This proves to our server that a message really came from Stripe. **It is a
real secret too.** Terminal only.

1. You are now on the page for the endpoint you just made. Find
   **"Signing secret"**. It is on the **right side** of the page, or near the
   top, depending on your Stripe version.
2. Click **"Reveal"**. It starts with `whsec_`. Click it to copy.
3. In your terminal, type this and press Enter:

       npx wrangler secret put STRIPE_WEBHOOK_SECRET --name atuned-api

4. Paste the signing secret when it asks, and press Enter.

### Step 9. Turn on the billing page (the Customer portal)

"Manage billing" in the app opens a Stripe page where a person changes tier,
replaces their card or stops paying. Stripe will not open that page until you
switch it on once.

1. On **dashboard.stripe.com**, in test mode, click the **gear icon** at the
   **top right**. That is **Settings**.
2. Under the heading **"Billing"**, click **"Customer portal"**.
3. Set these switches:
   - **Customers can update payment methods**: on.
   - **Customers can cancel subscriptions**: on. If it asks when, choose
     **"At the end of the billing period"**.
   - **Customers can switch plans**: on. Below that switch is a box for
     **products**. Add all four: Tier one, Tier two, Tier three and Tier
     four. That is the list a person picks from when they change tier.
4. Click **"Save"** (top right or bottom of the page; in test mode it may say
   **"Save and activate"**).

### Step 10. Test it, in five lines

Use a test account in the app, signed in. Ask us first whether the server
changes are live; they go live when we merge them.

1. In the app, open **Settings**, then **Billing**, and press **"Move to tier
   one"**.
2. Stripe's page opens. Pay with card `4242 4242 4242 4242`, any future date
   such as `12/34`, any three digits such as `123`, and any postcode.
3. You land back in the app. Within a few seconds a short line of text in the
   **top bar**, under the menu, says **"Tier one is on this record now."**
   (it fades after two seconds). Then in **Settings**,
   **Billing**, the Tier one row says **"You are on this"**.
4. On **dashboard.stripe.com** (test mode), **Developers**, **Webhooks**,
   click your endpoint: the newest lines say `checkout.session.completed` and
   `invoice.paid`, each with **200** beside it.
5. Back in the app, press **"Manage billing"**, then **"Cancel plan"** on
   Stripe's page, so the test stops.

**The one-line check after paying:** in the app, Settings, Billing shows "You
are on this" beside Tier one, and Stripe's Webhooks page shows 200 beside each
event.

If the app instead says "Stripe has not confirmed the payment yet", or a line
in step 4 shows a number other than 200, copy the exact words and send them to
us.

After step 5, the plan stays on until the paid month ends, then the app reads
Free. That is cancelling working as designed: a person keeps what they paid
for.

---

## Part B. Real money

Do this part once the five line test in Part A passes. The two fixes this
part used to wait for are built: the server now hears the monthly renewal,
tier changes and stops, and the app now shows the tier the server holds.

Part B is steps 2 to 9 again with **test mode switched off**. Everything made
in test mode stays in test mode, so in live mode:

- The four products are made again, and they get **new** price ids. Those go
  into `wrangler.toml` in place of the test ones (step 5).
- The Secret key starts with `sk_live_` instead of `sk_test_`. Run step 6
  again with it; it replaces the test key.
- The webhook is added again, with the same five events, and its signing
  secret is new. Run step 8 again with it.
- The Customer portal is switched on again, the same way (step 9).

Then run the five line test once more with a real card of your own, on Tier
one, and cancel it straight after in Manage billing.
