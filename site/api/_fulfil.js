// Fulfilment. Digital goes out as signed links. Print is handed to the
// print on demand vendor. Both are idempotent on the Stripe session id.
const crypto = require('crypto');

const SECRET = process.env.DOWNLOAD_SECRET || '';
const TTL_DAYS = 30;

// A download token is a signed statement, not a database row. It survives a
// cold start and needs no store.
function sign(sessionId, volumes) {
  const exp = Date.now() + TTL_DAYS * 86400000;
  const payload = Buffer.from(JSON.stringify({ s: sessionId, v: volumes, e: exp }))
    .toString('base64url');
  const mac = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${mac}`;
}

function verify(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, mac] = token.split('.');
  const want = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  const a = Buffer.from(mac), b = Buffer.from(want);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  if (Date.now() > data.e) return null;
  return data;
}

// Where the PDFs live. Private bucket, never served from the web root.
function objectKey(volume) {
  return `pdf/SOMATIC_${volume}_interior.pdf`;
}

// Hand a print order to the vendor. Lulu and Bookvault both take this shape.
// Left as one call so the engineer swaps the endpoint and nothing else.
async function sendToPrinter(order) {
  const url = process.env.PRINT_API_URL;
  if (!url) { console.warn('print vendor not configured', order.sessionId); return; }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PRINT_API_KEY}`,
    },
    body: JSON.stringify({
      external_id: order.sessionId,
      shipping_address: order.address,
      contact_email: order.email,
      line_items: order.volumes.map(v => ({
        title: `The Somatic Book of Reprogramming: ${v}`,
        quantity: 1,
        pod_package_id: process.env.PRINT_PACKAGE_ID,
        printable_normalization: {
          cover:    { source_url: `${process.env.PRINT_ASSET_BASE}/SOMATIC_${v}_cover.pdf` },
          interior: { source_url: `${process.env.PRINT_ASSET_BASE}/SOMATIC_${v}_interior.pdf` },
        },
      })),
    }),
  });
  if (!res.ok) throw new Error(`printer refused: ${res.status} ${await res.text()}`);
  return res.json();
}

module.exports = { sign, verify, objectKey, sendToPrinter, TTL_DAYS };
