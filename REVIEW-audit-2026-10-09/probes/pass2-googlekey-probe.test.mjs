// Probe + failing-first tests for the store notification receivers (audit pass 2, probe 3). Scratch copy only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { openD1 } from '../src/d1shim.js';
import worker from '../src/index.js';

const MIG = readdirSync(new URL('../migrations/', import.meta.url)).filter(f => f.endsWith('.sql')).sort()
  .map(f => readFileSync(new URL('../migrations/'+f, import.meta.url), 'utf8')).join('\n');
const base = (extra={}) => ({DB: openD1(MIG), ALLOWED_ORIGIN:'https://atuned.world', BASE_PLAN:'0', SESSION_DAYS:'90',
  RECORDS_KEY:'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8', ...extra});
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64');
const rtdn = (token) => ({message:{data: b64({subscriptionNotification:{notificationType:2, purchaseToken: token}})}});
async function post(e, path, body){
  const res = await worker.fetch(new Request('https://api.test'+path, {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body)}), e);
  return {status: res.status, body: await res.json().catch(()=>null)};
}
const events = async (e) => (await e.DB.prepare('SELECT COUNT(*) AS n FROM store_events').first()).n;

test('PROBE: Google receiver with GOOGLE_PUSH_KEY unset, set-and-wrong, set-and-right', async () => {
  const unset = base();
  const r1 = await post(unset, '/v1/store/google', rtdn('tok_a'));
  console.log('PROBE google, secret UNSET, no key in URL ->', r1.status, JSON.stringify(r1.body), 'store_events rows written:', await events(unset));
  for(let i=0;i<50;i++) await post(unset, '/v1/store/google', rtdn('tok_flood_'+i));
  console.log('PROBE google, secret UNSET, 50 more unauthenticated posts -> store_events rows:', await events(unset), '(no 429, no cap)');
  const set = base({GOOGLE_PUSH_KEY:'right-key'});
  const r2 = await post(set, '/v1/store/google?key=wrong', rtdn('tok_b'));
  console.log('PROBE google, secret SET, wrong key ->', r2.status, JSON.stringify(r2.body), 'rows:', await events(set));
  const r3 = await post(set, '/v1/store/google?key=right-key', rtdn('tok_c'));
  console.log('PROBE google, secret SET, right key ->', r3.status, JSON.stringify(r3.body), 'rows:', await events(set));
  const ap = base();
  const jws = 'e30.' + Buffer.from(JSON.stringify({notificationType:'X'.repeat(5000), data:{signedTransactionInfo:'e30.'+Buffer.from(JSON.stringify({originalTransactionId:'o1', transactionId:'t1'})).toString('base64url')+'.sig'}})).toString('base64url') + '.sig';
  const r4 = await post(ap, '/v1/store/apple', {signedPayload: jws});
  const row = await ap.DB.prepare('SELECT length(kind) AS k FROM store_events').first();
  console.log('PROBE apple, no auth, unsigned payload ->', r4.status, JSON.stringify(r4.body), 'stored kind length:', row && row.k);
});

test('FAILING-FIRST: with GOOGLE_PUSH_KEY unset the Google receiver refuses and writes nothing', async () => {
  const e = base();
  const r = await post(e, '/v1/store/google', rtdn('tok_a'));
  assert.ok(r.status === 503 || r.status === 403, 'expected a refusal when the key is not configured, got ' + r.status);
  assert.equal(await events(e), 0, 'a refused notification must not write a store_events row');
});

test('FAILING-FIRST: a wrong key is refused and a right key is accepted (already true today)', async () => {
  const e = base({GOOGLE_PUSH_KEY:'right-key'});
  assert.equal((await post(e, '/v1/store/google?key=wrong', rtdn('t'))).status, 403);
  assert.equal((await post(e, '/v1/store/google?key=right-key', rtdn('t'))).status, 200);
});
