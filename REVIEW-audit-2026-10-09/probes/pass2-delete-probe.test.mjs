// Probe + failing-first tests for account deletion (audit pass 2, probe 2). Scratch copy only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { openD1 } from '../src/d1shim.js';
import worker from '../src/index.js';

const MIG = readdirSync(new URL('../migrations/', import.meta.url)).filter(f => f.endsWith('.sql')).sort()
  .map(f => readFileSync(new URL('../migrations/'+f, import.meta.url), 'utf8')).join('\n');

function env(){
  const calls = [];
  const FETCH = async (url, o = {}) => {
    calls.push((o.method||'GET') + ' ' + String(url).replace(/^https?:\/\//,'').slice(0,90));
    if(String(url).includes('api.stripe.com/v1/subscriptions/')) return new Response(JSON.stringify({id:'sub_1', status:'active', customer:'cus_1', current_period_end: Math.floor(Date.now()/1000)+86400*20, items:{data:[{price:{id:'price_one'}}]}, metadata:{account_id:'x'}}), {status:200});
    return new Response('[]', {status:200});
  };
  return {DB: openD1(MIG), ALLOWED_ORIGIN:'https://atuned.world', BASE_PLAN:'0', SESSION_DAYS:'90',
    RECORDS_KEY:'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8',
    SUPABASE_URL:'https://supabase.test', SUPABASE_SERVICE_ROLE_KEY:'k',
    STRIPE_SECRET_KEY:'sk_test_x', STRIPE_WEBHOOK_SECRET:'whsec_x', STRIPE_PRICE_ONE:'price_one',
    ADMIN_KEY:'admin-secret', FETCH, _calls: calls};
}
async function call(e, method, path, body, token, extra={}){
  const h = {'content-type':'application/json', ...extra}; if(token) h.authorization = 'Bearer '+token;
  const res = await worker.fetch(new Request('https://api.test'+path, {method, headers:h, body: body?JSON.stringify(body):undefined}), e);
  return {status:res.status, body: await res.json().catch(()=>null)};
}

async function seed(e){
  const up = await call(e,'POST','/v1/auth/signup',{email:'del@example.com',password:'eight chars!'});
  const me = up.body.account;
  // a live Stripe subscription row and a customer id, as a finished checkout leaves them
  await e.DB.prepare('UPDATE accounts SET stripe_customer_id=? WHERE id=?').bind('cus_1', me.id).run();
  await e.DB.prepare('INSERT INTO entitlements(ref,account_id,store,product,plan,expires_at,status,raw,created_at,updated_at,period_start,processor_status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)')
    .bind('stripe:sub_1', me.id, 'stripe', 'atuned.one', 1, Date.now()+86400000*20, 'active', '{}', Date.now(), Date.now(), Date.now(), 'active').run();
  await call(e,'PUT','/v1/sync',{records:[{kind:'state',id:'atuned.primary-profile',version:1,body:{name:'Sofia'}}]}, up.body.token);
  await call(e,'POST','/v1/crash',{version:'0.29',platform:'web',message:'x'}, up.body.token);
  e._calls.length = 0;
  return {token: up.body.token, me};
}

test('PROBE: what DELETE /v1/me touches, and what it leaves', async () => {
  const e = env(); const {token, me} = await seed(e);
  const del = await call(e,'DELETE','/v1/me',null,token);
  console.log('PROBE delete status', del.status, JSON.stringify(del.body));
  console.log('PROBE outbound provider calls during delete:', JSON.stringify(e._calls));
  // every table, every text column: does any surviving row still name this account, its research id or its email
  const tables = (await e.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'canon_%' AND name NOT LIKE 'sqlite_%'").all()).results.map(r => r.name);
  const needles = [me.id, me.research_id, 'del@example.com', 'cus_1', 'sub_1'];
  for(const t of tables){
    const rows = (await e.DB.prepare('SELECT * FROM "'+t+'"').all()).results;
    const hit = rows.filter(r => needles.some(n => JSON.stringify(r).includes(n)));
    if(rows.length) console.log('PROBE table', t.padEnd(18), 'rows', String(rows.length).padEnd(3), 'naming the deleted person:', hit.length, hit.length ? JSON.stringify(hit[0]).slice(0,140) : '');
  }
  const again = await call(e,'DELETE','/v1/me',null,token);
  console.log('PROBE second delete with the same token ->', again.status, JSON.stringify(again.body));
  const adm = await call(e,'POST','/v1/admin/delete',{id: me.id}, 'admin-secret');
  console.log('PROBE admin delete of the already deleted id ->', adm.status, JSON.stringify(adm.body));
});

test('FAILING-FIRST: deleting an account must cancel the Stripe subscription and erase the Supabase funnel rows', async () => {
  const e = env(); const {token} = await seed(e);
  const del = await call(e,'DELETE','/v1/me',null,token);
  assert.equal(del.status, 200);
  const stripeCancel = e._calls.filter(c => /^DELETE api\.stripe\.com\/v1\/subscriptions\/sub_1/.test(c));
  assert.equal(stripeCancel.length, 1, 'the live Stripe subscription sub_1 must be cancelled before the D1 link to it is deleted; calls were: ' + JSON.stringify(e._calls));
  const supa = e._calls.filter(c => /supabase\.test\/rest\/v1\/rpc\/funnel_delete_account/.test(c));
  assert.equal(supa.length, 1, 'the Supabase funnel rows (sessions, challenges, gifts, ledger) must be erased through one RPC; calls were: ' + JSON.stringify(e._calls));
});
