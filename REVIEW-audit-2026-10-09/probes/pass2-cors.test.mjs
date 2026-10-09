// Failing-first CORS preflight tests (audit pass 2, probe 1).
// A browser sends this OPTIONS request before a cross-origin PATCH with a JSON body and a custom header.
// The Worker handler is called directly, so this proves what the browser would be told.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { openD1 } from '../src/d1shim.js';
import worker from '../src/index.js';

const MIG = readdirSync(new URL('../migrations/', import.meta.url)).filter(f => f.endsWith('.sql')).sort()
  .map(f => readFileSync(new URL('../migrations/'+f, import.meta.url), 'utf8')).join('\n');
const env = () => ({DB: openD1(MIG), ALLOWED_ORIGIN:'https://atuned.world', BASE_PLAN:'0', SESSION_DAYS:'90',
  RECORDS_KEY:'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8'});

// the list a browser compares against: a header-value token list, split on commas, trimmed.
const list = (v) => String(v||'').split(',').map(s => s.trim()).filter(Boolean);

async function preflight(path, method, headers){
  const res = await worker.fetch(new Request('https://api.test'+path, {method:'OPTIONS', headers:{
    origin:'https://atuned.world',
    'access-control-request-method': method,
    'access-control-request-headers': headers,
  }}), env());
  return res;
}

test('preflight for the funnel checkpoint (PATCH + content-type + x-funnel-credential) is allowed from atuned.world', async () => {
  const res = await preflight('/v1/funnel/session/s1/checkpoint', 'PATCH', 'content-type,x-funnel-credential');
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('access-control-allow-origin'), 'https://atuned.world');
  // PATCH is not a CORS-safelisted method and is not byte-case-normalised by the Fetch standard,
  // so the browser needs the exact token PATCH in this header or it blocks the real request.
  assert.ok(list(res.headers.get('access-control-allow-methods')).includes('PATCH'),
    'Access-Control-Allow-Methods must list PATCH, got: ' + res.headers.get('access-control-allow-methods'));
  const allowedHeaders = list(res.headers.get('access-control-allow-headers')).map(s => s.toLowerCase());
  for(const h of ['content-type','x-funnel-credential'])
    assert.ok(allowedHeaders.includes(h), h + ' must be allowed, got: ' + res.headers.get('access-control-allow-headers'));
});

test('preflight for the signed-in checkpoint also allows authorization', async () => {
  const res = await preflight('/v1/funnel/session/s1/checkpoint', 'PATCH', 'authorization,content-type,x-funnel-credential');
  const allowedHeaders = list(res.headers.get('access-control-allow-headers')).map(s => s.toLowerCase());
  assert.ok(allowedHeaders.includes('authorization'));
  assert.ok(list(res.headers.get('access-control-allow-methods')).includes('PATCH'));
});

test('every method the Worker routes can be preflighted (no route is unreachable from a browser)', async () => {
  const methods = new Set(Object.keys(worker.__routes || {}).map(k => k.split(' ')[0]));
  // routes is exported separately from index.js
  const { routes } = await import('../src/index.js');
  for(const k of Object.keys(routes)) methods.add(k.split(' ')[0]);
  const res = await preflight('/v1/me', 'GET', 'authorization');
  const allowed = new Set(list(res.headers.get('access-control-allow-methods')));
  for(const m of methods) assert.ok(allowed.has(m), 'route method ' + m + ' is served but not in Access-Control-Allow-Methods: ' + [...allowed].join(', '));
});

test('a denied origin is not echoed', async () => {
  const res = await worker.fetch(new Request('https://api.test/v1/funnel/session', {method:'OPTIONS', headers:{
    origin:'https://evil.example', 'access-control-request-method':'POST', 'access-control-request-headers':'content-type'}}), env());
  assert.notEqual(res.headers.get('access-control-allow-origin'), 'https://evil.example');
  assert.notEqual(res.headers.get('access-control-allow-origin'), '*');
});
