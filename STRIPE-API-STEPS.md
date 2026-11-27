# Let me set up Stripe for you. Steps for a nine year old.

> **Replaced on 9 October 2026 by `STRIPE-GO-LIVE.md`.** The secrets and price ids
> now go into GitHub secrets, not a terminal and not `wrangler.toml`, and the server
> checks them against Stripe after every deploy. Follow that page. This one is kept
> for the record.

**What this does.** Stripe is the company that takes the card. Instead of you clicking
to make four products, I make them by talking to Stripe's computer. You do five small
things once. Then I do the rest.

**Why I cannot do it yet.** Two doors are shut:
- This cloud computer is not allowed to talk to Stripe (it gets a "403", which means "not allowed").
- I do not have a key. A key is a long password that lets me act as you inside Stripe.

You open both doors below. Do not paste the key into this chat. Ever. Not here, not in email.

---

## Step 1. Open Stripe, in practice mode
1. Open a new browser tab. Go to **dashboard.stripe.com**.
2. Log in. This is a separate login from Claude, GitHub and Google. You are already logged in if you see "Tula Unified LLC" at the top left.
3. Look at the top right of the page. Find the switch that says **Test mode** (it may be a toggle, or it is under a menu called **Sandboxes** or **Test mode**). Turn it ON. The page gets an orange bar. Practice mode means no real money moves.
   Your picture showed "Live mode". That is real money. Do this first part in test mode.

## Step 2. Make a key that can only do one small job
1. In Stripe, click **Developers** (bottom left of the page, or the search box at the top: type "API keys" and press enter).
2. Click **API keys**.
3. Click **Create restricted key** (a button on the right of the page).
4. Name it: `atuned setup`.
5. A list of boxes appears. Find **Products** and pick **Write**. Find **Prices** and pick **Write**. Leave every other line on **None**.
6. Click **Create key**. Stripe shows the key ONCE. It starts with `rk_test_`. Keep this tab open. Do not close it yet.

## Step 3. Let this computer talk to Stripe
1. Go to **claude.ai/code**. At the top of the page you see the name of this session and a small cloud menu.
2. Click the cloud menu, then **Edit** (this edits the environment, the "room" I work in).
3. Find **Network access**. Add this address to the allowed list: `api.stripe.com`. Click **Save**.

## Step 4. Give me the key, the safe way
1. Same **Edit** screen. Find **Environment variables** (or **API credentials** if that is what you see).
2. Add one variable. Name: `STRIPE_SECRET_KEY`. Value: paste the key from Step 2 (the one starting `rk_test_`).
3. Click **Save**.
4. **Start a new session** from the same environment. A new session reads the new key. This one will not.

## Step 5. Tell me one thing
Type in the new session: **make the Stripe prices**. That is all.
What I do: run `node tools/stripe-setup.js --go`. It makes four products and four monthly prices (12, 29, 59, 99 US dollars), checks it did not make any twice, and prints four ids that start with `price_`. Those ids are not secrets.

## Step 6. Live mode, later
Only after one pretend purchase works. You make a second restricted key in Live mode (same Step 2, with Live mode on), I run the same command with `--live`. The command refuses a live key unless I add that word, so it cannot happen by accident.

---

## What is still not on me
- The server that listens to Stripe lives in a different repository (`reboot-os`). Its Stripe code is on a side branch and not on the live one. Someone has to merge it. The full list is in `STRIPE-STEPS-NOW.md`, Part 1. I can prepare the merge, but that repository is not one I can push to from here.
- Tiers five to nine: tell me the prices and I add them to the table and they get made the same way. My draft: 149, 249, 399, 699, 999 a month.

## If something goes wrong
- "Stripe said 401": the key was pasted wrong. Make a new one in Step 2.
- "Stripe said 403 ... not allowed to access": a box in Step 2 was left on None. Make a new key with Products and Prices on Write.
- "403 CONNECT tunnel failed": Step 3 was not saved, or you are still in the old session. Start a new one.
