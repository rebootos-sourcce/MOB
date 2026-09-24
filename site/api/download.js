// GET /api/download?session_id=...   (straight after checkout)
// GET /api/download?t=<token>        (from the email, works for 30 days)
//
// Returns { files: [{name, url}] } where each url is a short lived signed
// link to the private bucket. The PDF itself is never public.
const Stripe = require('stripe');
const { sign, verify, objectKey } = require('./_fulfil');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  try {
    const url = new URL(req.url, 'https://x');
    const token = url.searchParams.get('t');
    const sessionId = url.searchParams.get('session_id');

    let volumes = null;

    if (token) {
      const data = verify(token);
      if (!data) { res.status(403).json({ error: 'Link expired.' }); return; }
      volumes = data.v;
    } else if (sessionId) {
      const s = await stripe.checkout.sessions.retrieve(sessionId);
      if (s.payment_status !== 'paid') {
        res.status(402).json({ error: 'Payment not complete.' }); return;
      }
      if (s.metadata.fulfilment !== 'download') {
        res.status(200).json({ files: [], print: true }); return;
      }
      volumes = (s.metadata.volumes || '').split(',').filter(Boolean);
    } else {
      res.status(400).json({ error: 'No session.' }); return;
    }

    const files = await Promise.all(volumes.map(async v => ({
      name: `${v}.pdf`,
      url: await signedObjectUrl(objectKey(v)),
    })));

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ files, token: token || sign(sessionId, volumes) });
  } catch (e) {
    console.error('download', e);
    res.status(500).json({ error: 'Could not issue the link.' });
  }
};

// S3 compatible presign. Works against S3, R2 and Backblaze B2 unchanged.
async function signedObjectUrl(key) {
  const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
  const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
  const client = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_KEY,
      secretAccessKey: process.env.S3_SECRET,
    },
  });
  return getSignedUrl(client,
    new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }),
    { expiresIn: 900 });
}
