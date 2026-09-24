# thelittlebooksof.com · SETUP

Hand this to whoever deploys. Nothing here needs a decision from Lance
except the two marked **L**.

---

## 1 · What this is

A static site built by `build_site.py`, four serverless functions, Stripe
Checkout, and signed links to a private PDF bucket. No database, no CMS, no
login. A purchase is a Stripe session. A download right is a signed token.

```
site/
  build_site.py        builds public/ from generator/volumes/*.json
  pricing.json         the price table, scrubbed from canon
  copy.json            every sentence on the site
  public/              the built site, do not hand edit
  api/
    _catalog.js        what is sellable, and the only place amounts live
    _fulfil.js         token signing, bucket keys, print vendor call
    create-checkout-session.js
    stripe-webhook.js  the only place a purchase becomes real
    download.js        issues 15 minute signed links
```

Rebuild after any book change: `npm run build`. Preview: `npm run dev`.

---

## 2 · Deploy

Vercel, root directory `site/`. `vercel.json` is already correct.
Netlify works with the same functions, moved to `netlify/functions/`.

Point `thelittlebooksof.com` and `www` at the deploy. Force HTTPS.

---

## 3 · Environment

Copy `.env.example`. Every key is required except the print block.

| Key | Where it comes from |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe, live mode |
| `STRIPE_WEBHOOK_SECRET` | created in step 4 |
| `DOWNLOAD_SECRET` | `openssl rand -hex 32`. Changing it invalidates every issued link. |
| `SITE_URL` | `https://thelittlebooksof.com` |
| `S3_*` | Cloudflare R2 is cheapest. Bucket **private**. |
| `RESEND_API_KEY`, `MAIL_FROM` | Resend, domain verified |
| `PRINT_*` | see step 6 |

---

## 4 · Stripe

1. Live mode. No products or prices need creating. Amounts are set server
   side from `pricing.json` and passed as `price_data`, so a price change is
   a rebuild, not a Stripe edit.
2. Add an endpoint at `https://thelittlebooksof.com/api/stripe-webhook`.
   Event: `checkout.session.completed`. Copy the signing secret into
   `STRIPE_WEBHOOK_SECRET`.
3. Turn on Stripe Tax if selling into the EU or UK. Digital goods are taxed
   at the buyer's rate and this is not optional there.
4. Statement descriptor: `LITTLEBOOKSOF`.

**The webhook is the only place fulfilment happens.** The success page shows
the link, but the email is the record. If the webhook returns 500, Stripe
retries, which is the intended behaviour.

---

## 5 · The PDFs

Upload the built interiors to the private bucket as:

```
pdf/SOMATIC_ANXIETY_interior.pdf
pdf/SOMATIC_SHAME_interior.pdf
...
```

`generator/out/` already holds all eleven, plus covers. Covers are for the
printer, not for download.

The practitioner pack expects two more objects, `pdf/NODE_TABLE.pdf` and
`pdf/PROTOCOL.pdf`. **Do not enable the practitioner button until those two
exist.** Comment the row out of `build_site.py` if it ships first.

---

## 6 · Print on demand

`_fulfil.js` posts one order per purchase. The payload shape matches Lulu's
print job API and Bookvault's is close enough to swap in place.

**L · Choose the vendor.** Lulu is cheaper and the API is public. Bookvault
has better UK and EU shipping. Amazon KDP has no API and would mean manual
orders, so it is out for automated fulfilment.

Then set `PRINT_PACKAGE_ID` to the vendor's code for the trim. The new series
is **306 x 492 pt**, which is 4.25 x 6.83 in. The nearest stock package is
A6 or Pocketbook depending on vendor. Order one proof before going live.

`PRINT_ASSET_BASE` must be a public URL the printer can fetch cover and
interior from. Use a separate public bucket, never the private one.

---

## 7 · Before going live, in order

1. Stripe test mode end to end. Buy a single, a cluster and a print.
2. Confirm the email arrives and the link in it still works in a private
   window.
3. Confirm a tampered token returns 403.
4. Confirm the bucket is not publicly listable.
5. Order one print proof and look at it.
6. Switch to live keys.

---

## 8 · Open, and who owns it

| | Owner |
|---|---|
| Print vendor choice | **L** |
| Paperback price. `pricing.json` carries $29 as **PROPOSED**, no canon number exists | **L** |
| Node table and release protocol PDFs, for the practitioner pack | **L + C** |
| Everything else above | engineer |
