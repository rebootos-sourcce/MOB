// POST /api/create-checkout-session  { sku, volumes: [] }
// Returns { url } for Stripe Checkout. Amounts are server side only.
const Stripe = require('stripe');
const { resolve } = require('./_catalog');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const SITE = process.env.SITE_URL || 'https://thelittlebooksof.com';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only.' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const r = resolve(body);
    if (r.error) { res.status(400).json({ error: r.error }); return; }

    const name = r.volumes.length === 1
      ? `${r.spec.label}: ${r.volumes[0]}`
      : `${r.spec.label} (${r.volumes.join(', ')})`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: r.spec.amount,
          product_data: {
            name,
            description: r.spec.digital
              ? 'Instant PDF download. Thirty two pages per volume.'
              : 'Paperback, printed on demand and shipped from the printer.',
          },
        },
      }],
      // Print needs an address and a shipping quote from the vendor.
      ...(r.spec.shipping ? {
        shipping_address_collection: { allowed_countries: ['US','CA','GB','AU','NZ','IE','DE','FR','NL','SE','NO','DK','ES','IT'] },
        shipping_options: (process.env.STRIPE_SHIPPING_RATE
          ? [{ shipping_rate: process.env.STRIPE_SHIPPING_RATE }] : undefined),
      } : {}),
      customer_creation: 'always',
      allow_promotion_codes: true,
      metadata: {
        sku: r.sku,
        volumes: r.volumes.join(','),
        fulfilment: r.spec.digital ? 'download' : 'print',
        extras: (r.spec.extras || []).join(','),
      },
      success_url: `${SITE}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE}/cancel.html`,
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('checkout', e);
    res.status(500).json({ error: 'Checkout could not be opened.' });
  }
};
