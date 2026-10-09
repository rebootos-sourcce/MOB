# Turning on payments and the voice

Written 9 October 2026. This is the one page for the owner's half of the
paywall and the voice. Everything else is built and tested on our side.

What each word means, once:

- **Stripe** is the company that takes the card. Atüned never sees a card
  number. Stripe shows its own payment page, and tells our server when
  somebody has paid.
- **ElevenLabs** is the company that makes the spoken voice in a release.
- **GitHub** is the website that holds our code. Its **secrets** are a locked
  box of settings that our server is given when it starts. A secret can be
  put in, but nobody can read it back out, not even you.
- **Test mode** is a practice copy of your Stripe account. Nothing in it
  charges a real card. You do every step there first.
- **Live mode** is the real one. Real cards, real money.

**Each of these is a separate login.** Stripe, ElevenLabs, GitHub and
Cloudflare each have their own email and password. Logging in to one does not
log you in to another.

**Before you start.** This needs the server update of 9 October to be merged
(branch `claude/paywall-worker` in `reboot-os`). The team merges it. You can
tell it is in: in step 8, the list of steps has one called
**live Stripe setup check**. If that name is not there, it is not merged yet.

**Websites move their buttons.** These steps were checked against what
Stripe, ElevenLabs and GitHub looked like in October 2026. Where a step says
"not sure of the name", the button may be called something close to it. If
a button is not where a step says, take a screenshot and send it. That is a
website renaming something, not you doing it wrong.

About forty minutes for test mode. Twenty for live.

---

## Part A. Practice first, in Stripe's test mode

### Step 1. Open Stripe and switch to test mode

1. Open your web browser and go to **dashboard.stripe.com**.
2. Type your Stripe email and password. Press **Sign in**. If Stripe texts
   you a code, type it in.
3. Look at the **top right** of the page for a switch called **Test mode**.
   Turn it on. The page gets an orange strip across the top.
4. **If there is no Test mode switch:** click your **business name at the
   top left**. In the list that drops down, click **Switch to sandbox**
   (Stripe's newer word for test mode; not sure of the exact name on your
   account). If it asks to make one, say yes and call it `Atuned test`.

Stay in test mode until Part B.

### Step 2. Make the four tiers

A **product** is a thing you sell. A **price** is what it costs and how
often. You make one product per tier, with one monthly price each.

| Name to type | Amount | Billing period |
|---|---|---|
| `Tier one` | `12` | Monthly |
| `Tier two` | `29` | Monthly |
| `Tier three` | `59` | Monthly |
| `Tier four` | `99` | Monthly |

These are your own prices from 1 October. Make all four. Tier four stays
closed to buyers until the lead suite is built: making it now does not sell
it.

Do this four times, once for each row:

1. In the **menu down the left side**, click **Product catalog**.
2. At the **top right**, click **+ Create product** (it may say
   **+ Add product**).
3. A panel slides in. In **Name**, type the name from the table.
4. Under the price, pick **Recurring**, not **One-off**.
5. In **Amount**, type the number from the table. The box beside it must
   say **USD**.
6. In **Billing period**, pick **Monthly**.
7. Click **Add product** at the bottom right of the panel (it may say
   **Save product**).

When you are done, **Product catalog** lists Tier one, Tier two, Tier three
and Tier four.

### Step 3. Copy the four price ids

A **price id** is the name Stripe gives each price. It starts with `price_`.
It is not a secret.

For each tier:

1. In **Product catalog**, click the tier's name.
2. Find the box called **Pricing**. It has one row, like `$12.00 USD / month`.
3. At the **right end** of that row, click **...**, then **Copy price ID**.
   (If there is no **...**, click the row. The id is at the top right of the
   page that opens, with a copy button beside it.)
4. Paste it into a note on your computer, next to the tier's name.

You end with four lines, like:

    Tier one     price_...
    Tier two     price_...
    Tier three   price_...
    Tier four    price_...

### Step 4. Copy the secret key

The **secret key** lets our server ask Stripe for a payment page. **It is a
real secret.** It goes into GitHub in step 8 and nowhere else: not in a chat,
not in an email, not in a file.

1. In Stripe, still in test mode, click **Developers**. It is near the
   **bottom of the left menu**, or at the **top right**, depending on your
   Stripe.
2. Click the **API keys** tab.
3. Find the row called **Secret key**. In test mode it starts with
   `sk_test_`. Click **Reveal test key**, then click the key to copy it.
4. Do not copy the **Publishable key** above it. That one starts with
   `pk_` and is the wrong one. The server check in step 8 says so if it is.

Keep this tab open. You paste the key in step 8.

### Step 5. Tell Stripe where to send news about payments

A **webhook** is Stripe sending our server a message when something happens:
somebody paid, a month renewed, a card was refused, somebody stopped.

1. In Stripe, test mode, click **Developers**, then the **Webhooks** tab.
2. At the **top right**, click **+ Add destination** (older Stripe says
   **+ Add endpoint**).
3. If it asks where the events come from, pick **Your account**.
4. It asks which events. Use the search box at the top of the list. Type
   each of these five, and tick the box beside it:

       checkout.session.completed
       customer.subscription.updated
       customer.subscription.deleted
       invoice.paid
       invoice.payment_failed

   Then click **Continue** (or **Add events**).
5. If it asks for a destination type, pick **Webhook endpoint**, then
   **Continue**.
6. In **Endpoint URL**, paste exactly this. It is our server's public
   address, the same one the app uses, and not a secret:

       https://atuned-api.lance-o-powell.workers.dev/v1/billing/webhook

7. Click **Create destination** (or **Add endpoint**).

### Step 6. Copy the webhook's signing secret

The **signing secret** proves to our server that a message really came from
Stripe. **It is a real secret too.**

1. You are now on the page of the webhook you just made. Find
   **Signing secret**. It is on the **right side** or near the top.
2. Click **Reveal**. It starts with `whsec_`. Click it to copy.

Keep this tab open too.

### Step 7. Turn on Manage billing (Stripe's customer portal)

The **customer portal** is Stripe's page where a person changes tier,
replaces a card, or stops paying. **Manage billing** in the app opens it.
Stripe keeps it shut until you save its settings once.

1. In Stripe, test mode, click the **gear icon** at the **top right**. That
   is **Settings**.
2. Under **Billing**, click **Customer portal**.
3. Set these:
   - **Customers can update payment methods**: on.
   - **Customers can cancel subscriptions**: on. When it asks when, pick
     **At the end of the billing period**. This is what makes a stopped plan
     run to the end of the month the person paid for.
   - **Customers can switch plans**: on. In the **Products** box under it,
     add Tier one, Tier two and Tier three. Leave Tier four out while it is
     closed.
4. Click **Save** (in test mode it may say **Save and activate**).

### Step 8. Put the secrets into GitHub, and run the check

1. Open a new tab and go to **github.com/rebootos-sourcce/reboot-os**. Not
   `MOB`. The other one, `reboot-os`. Sign in to GitHub if it asks.
2. In the row of tabs near the top (Code, Issues, Pull requests, Actions ...),
   click **Settings**. If there is no Settings tab, this GitHub account is not
   an admin on `reboot-os`, and an admin has to do this step.
3. In the **left sidebar**, click **Secrets and variables**, then **Actions**
   under it.
4. Click the green **New repository secret** button. In **Name**, type the
   name exactly, capitals and underscores included. In **Secret**, paste the
   value. Click **Add secret**. Do this once for each row:

| Name | What to paste |
|---|---|
| `STRIPE_SECRET_KEY` | the secret key from step 4, `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | the signing secret from step 6, `whsec_...` |
| `STRIPE_PRICE_ONE` | Tier one's price id from step 3 |
| `STRIPE_PRICE_TWO` | Tier two's price id |
| `STRIPE_PRICE_THREE` | Tier three's price id |
| `STRIPE_PRICE_FOUR` | Tier four's price id |

   If a name is already in the list, click it and use **Update secret**
   instead.

5. Now run the server's deploy, so it picks them up. Click the **Actions**
   tab at the top. In the **left list**, click **server**. On the right,
   click the grey **Run workflow** button, leave the branch on **main**, and
   click the green **Run workflow** in the box that opens.
6. Wait about two minutes. Click the newest run at the top of the list, then
   the job called **server**.

**How to know it worked.** Every step in the job has a green tick, and the
step called **live Stripe setup check** says:

    live Stripe setup check passed, test mode: three prices, the webhook
    with all five events, and the customer portal

If that step is red, its last line says what is wrong in plain words, for
example "STRIPE_PRICE_TWO is wrong: it is 24 dollars, not 29". Fix that one
thing and press **Run workflow** again. The check only reads Stripe. It never
changes anything there.

### Step 9. Buy, stop, and quit, once, with a test card

Use a test account in the app, at atuned.world.

1. Log in. Open **Account** (the person icon, top right), then **Billing**.
   Next to **Tier one**, press **Move to tier one**.
2. Stripe's page opens. Pay with card number `4242 4242 4242 4242`, any
   future date such as `12/34`, any three digits such as `123`, any postcode.
   This card is Stripe's practice card and works only in test mode.
3. You land back in the app. A short line at the bottom says
   **Tier one is on this record now.**, then a welcome card opens. In
   **Billing**, the Tier one row says **You are on this**.
4. Press **Manage billing**. On Stripe's page, press **Cancel plan** (not sure
   of the exact words) and confirm.
5. Back in the app, within a few seconds, a line says
   **Tier one stops on** a date. **It stays on until then.** In **Billing**,
   the **State** row says **ends** and that date.
6. Now quit completely. In **Account**, under **Sign in**, press **Delete**
   beside **Delete this account** and say OK. The page lists what was removed
   and what was kept.
7. In Stripe, test mode, click **Customers** in the left menu, click the
   test account's email, and look at **Subscriptions**: it says
   **Canceled**.

**The one line check:** once you have paid, Billing says **You are on this**
beside Tier one. Once you have deleted the account, Stripe says **Canceled**.

If the app instead says "Stripe has not confirmed the payment yet", wait a
minute and reload. If it still says it, open Stripe, **Developers**,
**Webhooks**, click the webhook, and look at the newest lines: each should
have **200** beside it. Send a screenshot of any that do not.

---

## Part B. Real money

Do this once Part A worked from start to end.

Everything made in test mode stays in test mode. So in live mode you make it
all again, and it all gets new ids.

1. In Stripe, turn **Test mode off** (or leave the sandbox: click your
   business name at the top left and pick your real account).
2. Do **step 2** again: the four products. They get new price ids.
3. Do **step 3** again: copy the four new price ids.
4. Do **step 4** again. The secret key now starts with `sk_live_`. Stripe may
   show a live key only once. Copy it straight into GitHub in step 8 below.
5. Do **step 5** again: the webhook, with the same address and the same five
   events.
6. Do **step 6** again: the new signing secret.
7. Do **step 7** again: the customer portal, the same three switches.
8. Do **step 8** again, but this time click each of the six secrets and use
   **Update secret** to paste the live value over the test one. Then
   **Run workflow**.

**How to know it worked.** The **live Stripe setup check** step now says
**live mode** where it said test mode. If one price is still a test price, it
says so by name: "it is a test price and the key is a live key".

Then do **step 9** once with a real card of your own, on Tier one, and
delete that account at the end. To give yourself the money back: in Stripe,
click **Payments** in the left menu, click the payment, and press
**Refund** at the top right.

---

## Part C. The voice (ElevenLabs)

The app speaks a release in one voice, made by ElevenLabs. Our server asks
ElevenLabs for each line, so the key never goes near the app.

### Step 10. Copy the ElevenLabs key and voice id

1. Go to **elevenlabs.io** and log in (a separate account again).
2. Find **API Keys**. On the current site it is under **Developers** near the
   **bottom of the left menu** (not sure of the exact place on your account;
   older layouts put it under your name at the bottom left). Click
   **Create API Key** (or **+ Create Key**).
3. Give it a name, `Atuned server`. If it asks which parts the key may use,
   turn on **Text to Speech** at least. Click **Create**. Copy the key. It is
   shown once. **The real key starts with `sk_`.** The list on that page also
   shows a shorter "API key ID" for each key. That is only its label, and
   ElevenLabs refuses it with "API key ID used as API key". If what you
   copied does not start with `sk_`, make a new key and copy again.
4. Now the voice. Click **Voices** in the left menu, then **My Voices** (not
   sure of the exact tab name). Find the voice you want for releases. Click
   the **...** beside it, then **Copy voice ID**. A voice id is a short run of
   letters and numbers. It is not a secret.

### Step 11. Put them into GitHub, and run the check

1. Same GitHub page as step 8: **reboot-os**, **Settings**,
   **Secrets and variables**, **Actions**, **New repository secret**.
2. Add these two:

| Name | What to paste |
|---|---|
| `ELEVENLABS_API_KEY` | the key from step 10 |
| `ELEVENLABS_VOICE_ID` | the voice id from step 10 |

3. **Actions** tab, **server** on the left, **Run workflow**, **Run workflow**.

**How to know it worked.** In the newest run, the step called
**live voice smoke** says:

    live voice smoke passed: ... bytes of audio/mpeg from ElevenLabs

That means our live server asked ElevenLabs for one short line, "This is the
voice check.", and got real sound back. It costs about thirty characters of
your ElevenLabs credit each time the server deploys. If it is red, its last
line says why in ElevenLabs' own words.

---

## If something goes wrong

**Somebody paid twice.** This can happen if a person opens two payment pages
in two tabs before either finishes. In Stripe: **Customers**, click their
email, click the newer of the two subscriptions, press **Cancel
subscription**, pick **Cancel immediately**. Then **Payments**, click its
payment, press **Refund**.

**A card was refused.** Nothing to do. Stripe tries the card again over the
next days, the person keeps their tier meanwhile, and the app tells them to
replace the card in Manage billing.

**Somebody asks for their money back.** Seven days is the ruling. In Stripe:
**Payments**, click the payment, **Refund**.

## How to undo

- **Stop taking real money, keep practising:** in step 8, use **Update
  secret** to put the six test values back, and **Run workflow**. The check
  says test mode again.
- **Turn payments off completely:** go to **dash.cloudflare.com** (a separate
  login), click **Workers & Pages**, click **atuned-api**, then **Settings**,
  then **Variables and Secrets** (not sure of the exact name). Delete
  **STRIPE_SECRET_KEY**. Every Move to button then says billing is not
  connected, and nobody can pay. Also delete the GitHub secret of the same
  name, or the next deploy puts it back.
- **Stop Stripe sending news:** Stripe, **Developers**, **Webhooks**, click
  the webhook, **...** at the top right, **Disable** (or **Delete**).
- **Turn the voice off:** delete the GitHub secret **ELEVENLABS_API_KEY**,
  then delete the Cloudflare secret of the same name the same way as above.
  The app then says the voice is not ready.

## What the team could not check from here

The team's computers cannot reach Stripe, ElevenLabs or our live server.
Every part of the server and the app was tested against stand ins that answer
in the same shapes. The two checks in steps 8 and 11 are the first time the
real services are asked, and they run on GitHub, not here. That is why they
exist.
