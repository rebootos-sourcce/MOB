import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { openD1 } from '../src/d1shim.js';
import worker from '../src/index.js';
const MIG = readdirSync(new URL('../migrations/', import.meta.url)).filter(f => f.endsWith('.sql')).sort().map(f => readFileSync(new URL('../migrations/'+f, import.meta.url), 'utf8')).join('\n');
test('PROBE: a refused funnel request (401, no credential) is written to server_errors', async () => {
  const FETCH = async () => new Response('[]', {status:200});
  const e = {DB: openD1(MIG), ALLOWED_ORIGIN:'*', RECORDS_KEY:'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8', SUPABASE_URL:'https://s.test', SUPABASE_SERVICE_ROLE_KEY:'k', FETCH};
  let statuses = new Set();
  for(let i=0;i<30;i++){ const r = await worker.fetch(new Request('https://api.test/v1/funnel/session/abc', {method:'GET'}), e); statuses.add(r.status); }
  const n = (await e.DB.prepare('SELECT COUNT(*) AS n FROM server_errors').first()).n;
  const sample = await e.DB.prepare('SELECT route, message, length(stack) AS stack FROM server_errors LIMIT 1').first();
  console.log('PROBE 30 unauthenticated bad requests -> statuses', [...statuses].join(','), '; server_errors rows:', n, '; sample:', JSON.stringify(sample));
  const h = await worker.fetch(new Request('https://api.test/v1/health'), {...e, DB:{...e.DB, prepare:(q)=> q.includes('sqlite_master') ? {first: async()=>{throw new Error('db down');}} : e.DB.prepare(q)}});
  console.log('PROBE health with the database failing -> HTTP', h.status, JSON.stringify(await h.json()));
});
