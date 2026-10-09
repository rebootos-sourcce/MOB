// Real Chromium, real cross-origin request, real Worker handler on a real socket.
//   usage: node probe-cors.cjs <path-to-atuned/server>
// Page origin  http://localhost:PAGE   (ALLOWED_ORIGIN is set to this origin, as it is set to https://atuned.world in production)
// API origin   http://127.0.0.1:API    (a different origin, so the browser enforces CORS)
// Prints, for the same three calls the first-visit funnel makes (create, read, checkpoint):
//   - what the browser reported (ok / TypeError "Failed to fetch")
//   - every request the API socket actually received, so the preflight and the missing PATCH are visible
// Then repeats the PATCH with Playwright request interception switched on, to show that interception
// answers the preflight itself and hides the defect.
const http = require('http');
const { pathToFileURL } = require('url');
const path = require('path');
const { readFileSync, readdirSync } = require('fs');
const { chromium } = require('playwright');

(async () => {
  const dir = path.resolve(process.argv[2]);
  const { openD1 } = await import(pathToFileURL(path.join(dir, 'src/d1shim.js')).href);
  const worker = (await import(pathToFileURL(path.join(dir, 'src/index.js')).href)).default;
  const MIG = readdirSync(path.join(dir, 'migrations')).filter(f => f.endsWith('.sql')).sort()
    .map(f => readFileSync(path.join(dir, 'migrations', f), 'utf8')).join('\n');

  // a Supabase stand-in with the same shape the funnel tests use (no network).
  const sessions = new Map(), challenges = new Map();
  const FETCH = async (url, o = {}) => {
    const u = new URL(url);
    if (u.pathname.includes('/rpc/')) {
      const name = u.pathname.split('/').pop(); const b = JSON.parse(o.body || '{}');
      if (name === 'funnel_create_session') {
        const s = {id:b.p_session_id, anonymous_id:b.p_anonymous_id, user_id:null, state:'ARRIVE', status:'active', selected_ground_id:null, starter_gift_id:null, tutorial_completed:false, first_release_id:null, verification_id:null, version:1, created_at:b.p_created_at, updated_at:b.p_created_at};
        sessions.set(s.id, s); challenges.set(s.id, {hash:b.p_credential_hash});
        return new Response(JSON.stringify({id:s.id, anonymousId:s.anonymous_id, userId:null, state:'ARRIVE', status:'active', selectedGroundId:null, starterGiftId:null, tutorialCompleted:false, firstReleaseId:null, verificationId:null, version:1, createdAt:s.created_at, updatedAt:s.updated_at}), {status:200});
      }
      if (name === 'funnel_save_session') {
        const s = sessions.get(b.p_session.id); if (!s || s.version !== b.p_expected_version) return new Response('false', {status:200});
        Object.assign(s, {selected_ground_id:b.p_session.selectedGroundId, tutorial_completed:!!b.p_session.tutorialCompleted, version:b.p_session.version, updated_at:b.p_session.updatedAt});
        return new Response('true', {status:200});
      }
    }
    if (u.pathname.endsWith('/funnel_sessions')) { const id = (u.searchParams.get('id')||'').replace(/^eq\./,''); const s = sessions.get(id); return new Response(JSON.stringify(s?[s]:[]), {status:200}); }
    if (u.pathname.endsWith('/attachment_challenges')) { const sid = (u.searchParams.get('session_id')||'').replace(/^eq\./,''); const c = challenges.get(sid); const ok = c && (u.searchParams.get('credential_hash')||'').replace(/^eq\./,'') === c.hash; return new Response(JSON.stringify(ok?[{id:'c'}]:[]), {status:200}); }
    return new Response('{}', {status:404});
  };

  const seen = [];
  const apiSrv = http.createServer(async (req, res) => {
    const chunks = []; for await (const c of req) chunks.push(c);
    seen.push(req.method + ' ' + req.url + (req.headers['access-control-request-method'] ? '  [preflight asks ' + req.headers['access-control-request-method'] + ' with ' + (req.headers['access-control-request-headers']||'') + ']' : ''));
    const r = await worker.fetch(new Request('http://127.0.0.1:' + apiSrv.address().port + req.url, {method:req.method, headers:req.headers, body:(req.method==='GET'||req.method==='HEAD'||req.method==='OPTIONS')?undefined:Buffer.concat(chunks)}), env);
    res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer()));
  });
  await new Promise(r => apiSrv.listen(0, '127.0.0.1', r));
  const API = 'http://127.0.0.1:' + apiSrv.address().port;
  const pageSrv = http.createServer((q, s) => { s.writeHead(200, {'content-type':'text/html'}); s.end('<!doctype html><title>probe</title><body>probe'); });
  await new Promise(r => pageSrv.listen(0, 'localhost', r));
  const PAGE = 'http://localhost:' + pageSrv.address().port;
  var env = {DB: openD1(MIG), ALLOWED_ORIGIN: PAGE, SESSION_DAYS:'90', BASE_PLAN:'0', RECORDS_KEY:'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8',
    SUPABASE_URL:'https://supabase.test', SUPABASE_SERVICE_ROLE_KEY:'x', FETCH};

  const browser = await chromium.launch();
  const run = async (label, intercept) => {
    seen.length = 0;
    const ctx = await browser.newContext(); const page = await ctx.newPage();
    const consoleErrs = []; page.on('console', m => { if (m.type() === 'error') consoleErrs.push(m.text()); });
    if (intercept) await page.route(API + '/**', route => route.continue());
    await page.goto(PAGE + '/');
    // the exact shapes ui/auth.js authCall sends: JSON content-type, credentials omit, x-funnel-credential for the funnel routes.
    const out = await page.evaluate(async (API) => {
      const o = {};
      const call = async (name, method, p, body, extra) => {
        try {
          const h = {}; if (body) h['Content-Type'] = 'application/json'; Object.assign(h, extra || {});
          const r = await fetch(API + p, {method, headers:h, body: body ? JSON.stringify(body) : undefined, cache:'no-store', credentials:'omit'});
          const t = await r.text(); o[name] = {ok:r.ok, status:r.status, body:t.slice(0, 120)}; return r.ok ? JSON.parse(t) : null;
        } catch (e) { o[name] = {threw:String(e && e.message || e)}; return null; }
      };
      const c = await call('create  POST /v1/funnel/session', 'POST', '/v1/funnel/session', {anonymousId:'probe-' + Date.now()});
      if (!c) return o;
      const id = c.session.id, cred = c.credential;
      await call('read    GET  /v1/funnel/session/:id', 'GET', '/v1/funnel/session/' + id, null, {'x-funnel-credential':cred});
      await call('check   PATCH .../checkpoint', 'PATCH', '/v1/funnel/session/' + id + '/checkpoint', {selectedGroundId:'anxiety'}, {'x-funnel-credential':cred});
      return o;
    }, API);
    console.log('--- ' + label);
    for (const k of Object.keys(out)) console.log('  browser saw  ' + k + '  ->  ' + JSON.stringify(out[k]));
    console.log('  API socket received:'); seen.forEach(s => console.log('     ' + s));
    consoleErrs.slice(0, 3).forEach(e => console.log('  console error: ' + e));
    await ctx.close();
  };
  await run('A. plain Chromium, no interception', false);
  await run('B. same page, but Playwright request interception ON (page.route)', true);
  await browser.close(); apiSrv.close(); pageSrv.close();
})().catch(e => { console.error(e); process.exit(1); });
