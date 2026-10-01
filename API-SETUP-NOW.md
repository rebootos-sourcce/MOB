# API setup, one page

Everything below is for you to do on other people's websites. None of it is in
the app. The long versions are `STRIPE-STEPS-NOW.md` (steps 4 to 9) and
`OAUTH-DESIGN-AND-STEPS.md` (part B1). This page says what you need, where each
thing comes from and where it goes.

## Which is which

- **Google Workspace** is the Google account your company already has (your
  Atüned email login). It is the login you use. It is not an API.
- **Google OAuth** is a key pair you create inside Google's developer site,
  signed in with that Workspace account. It lets people press "Sign in with
  Google" in the app.
- **Stripe** is the payment company. Its API key lets our server make payment
  pages.

So you need two things from outside: a Stripe key set, and a Google OAuth key
pair. Both end up in the same place: the server's secret list on Cloudflare.

## What you collect, and where each goes

| What | Where you get it | What it looks like | Where it goes |
|---|---|---|---|
| Stripe Secret key | dashboard.stripe.com, Developers, API keys, Secret key (test mode first) | starts `sk_test_` | `npx wrangler secret put STRIPE_SECRET_KEY --name atuned-api` |
| Stripe four price ids | dashboard.stripe.com, Product catalogue, each price | start `price_` | the four `STRIPE_PRICE_...` lines in the server's `wrangler.toml` (Stripe steps, step 5) |
| Stripe Signing secret | dashboard.stripe.com, Developers, Webhooks, your endpoint, Signing secret | starts `whsec_` | `npx wrangler secret put STRIPE_WEBHOOK_SECRET --name atuned-api` |
| Google Client ID | console.cloud.google.com, APIs and services, Credentials, Create credentials, OAuth client ID, Web application | ends `.apps.googleusercontent.com` | `npx wrangler secret put GOOGLE_OAUTH_CLIENT_ID --name atuned-api` |
| Google Client secret | the same screen, shown once | starts `GOCSPX-` | `npx wrangler secret put GOOGLE_OAUTH_CLIENT_SECRET --name atuned-api` |

Never paste any of these into the app, a chat, or a file in the repository. The
Publishable key on Stripe's page (starts `pk_`) is not used. Leave it.

## The order, as if you are ten

1. Open **dashboard.stripe.com** and log in. This is a Stripe login, separate
   from Google and Cloudflare. Check the orange "test mode" strip is showing at
   the top.
2. Do Stripe steps 4, 5, 6, 7, 8 and 9 in `STRIPE-STEPS-NOW.md`: create the four
   prices ($12, $29, $59, $99 a month), copy the Secret key, switch on the
   Customer portal, add the webhook, copy the Signing secret.
3. Open **console.cloud.google.com** and log in with your Atüned Google
   Workspace address. This is the Google login, separate from Stripe.
4. Do part B1 in `OAUTH-DESIGN-AND-STEPS.md`: make a project, fill in the
   consent screen (it asks for your privacy and terms addresses: they are
   `https://atuned.world/privacy` and `https://atuned.world/terms`), then make
   the OAuth client and copy the Client ID and Client secret.
5. Open your terminal on the computer that has the server code and run the five
   `wrangler secret put` lines from the table, pasting each value when asked.
6. Tell me "keys are in". I run the test purchase and the test sign-in.

Two things I cannot do for you: log in to Stripe or Google, and read a secret
you paste into a terminal. Everything else on the list is mine.
