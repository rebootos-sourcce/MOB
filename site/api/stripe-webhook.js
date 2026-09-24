// POST /api/stripe-webhook
// The only place a purchase becomes real. Verifies the signature, then
// fulfils. Never trust the browser's word that payment happened.
const Stripe = require('stripe');
const { sign, sendToPrinter } = require('./_fulfil');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Vercel and Netlify both need the raw body for signature verification.
module.exports.config = { api: { bodyParser: false } };

function raw(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  let event;
  try {
    const body = await raw(req);
    event = stripe.webhooks.constructEvent(
      body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error('bad signature', e.message);
    res.status(400).send(`Webhook Error: ${e.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object;
    const volumes = (s.metadata.volumes || '').split(',').filter(Boolean);
    const email = s.customer_details && s.customer_details.email;

    try {
      if (s.metadata.fulfilment === 'print') {
        await sendToPrinter({
          sessionId: s.id, email, volumes,
          address: s.shipping_details && s.shipping_details.address,
        });
      } else {
        const token = sign(s.id, volumes);
        await deliverEmail(email, volumes, token);
      }
    } catch (e) {
      // Return 500 so Stripe retries. Fulfilment must not be lost silently.
      console.error('fulfilment failed', s.id, e);
      res.status(500).send('fulfilment failed');
      return;
    }
  }

  res.status(200).json({ received: true });
};

// Email delivery. Resend by default. Swap the provider here and nowhere else.
async function deliverEmail(email, volumes, token) {
  if (!email) return;
  const site = process.env.SITE_URL || 'https://thelittlebooksof.com';
  const link = `${site}/success.html?t=${token}`;
  const list = volumes.join(', ');
  const text = [
    'Your books are ready.',
    '',
    list,
    '',
    `Download: ${link}`,
    '',
    'Read the left page slowly. Do not perform it. When the body drops, turn',
    'the page and read the right. That is the whole operation.',
    '',
    'The link works on any device for thirty days.',
    '',
    'Lance',
    'thelittlebooksof.com',
  ].join('\n');

  if (!process.env.RESEND_API_KEY) { console.warn('email not configured'); return; }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'Lance <hello@thelittlebooksof.com>',
      to: email,
      subject: `Your books: ${list}`,
      text,
    }),
  });
  if (!r.ok) throw new Error(`email refused: ${r.status} ${await r.text()}`);
}
