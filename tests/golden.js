#!/usr/bin/env node
/* ============================================================
   THE GOLDEN JOURNEY, ONE WALK, END TO END. Block G0 of
   REVIEW-audit-2026-10-09/pass4.md, on the owner's own list of
   9 October: "Anything that's stopping the user's story or journey
   from creating an account, from entering the funnel, having the data
   pass from the funnel to their summary or to their account, for them
   to run the software. Run the release, have their CQ math calculated
   appropriately. If they want to quit the software, that the
   cancellation."

   TWO DOORS, BECAUSE A STRANGER ARRIVES BY TWO. The funnel's quiz hands
   its reading to the app in the link, and pImport marks a record that
   arrives that way as past the first run (engine/schema.js), so that
   person never meets onboarding. Somebody who opens the app without the
   quiz meets onboarding, and onboarding is what makes the first visit's
   session on the server. Each door is walked in its own browser context
   with its own fake server, in the order a person meets it, and every
   station asserts what the person SEES and what is SAVED after a reload.

     Q  THE QUIZ DOOR
     1  the funnel's landing page, its quiz answered by pressing its own
        buttons, to its door
     2  the record in the link (#r=), loaded through pImport
     3  Create account, at the door
     4  the reading on Summary and on the account
     5  the first release, from the Story page
     6  CQ, the coherence figure: the engine's number against an
        independent recomputation from the saved record, before and after,
        and the same number on every surface that prints it
     7  pay: checkout opens, and the return from Stripe reads the plan back
     8  quit: Manage billing opens the portal, a cancelled plan reads back
        as ended, sign out, and Delete says what it did

     O  THE ONBOARDING DOOR
     9  a blank arrival reads the same in the app and out of the engine
        (the older finding NN8: 42.25 in the app, 36.00 from the engine)
     10 Create account at the door, and the first visit's server session
        joins the account
     11 the first release through onboarding, with the studio voice, and
        the marks the server keeps of it
     12 the same join, under the other way the server may issue the gift

     F  THE FILE THE OWNER IS SENT
     13 Create account from a downloaded copy, against the Worker's one
        allowed origin

   THE SERVER IS A FAKE, AND NOTHING LEAVES THE MACHINE. The site is
   served on 127.0.0.1 the way atuned.world serves it, so the Worker's
   CORS rule (ALLOWED_ORIGIN, one origin) is modelled against a real
   origin and not a file page's null one. AUTH_API is pinned to a stub
   host before the first line of the app runs, and that host is answered
   in this process by a fake Worker built from the real routes
   (Reboot-OS atuned/server/src/index.js and funnel.js on main, read
   9 October): sign up, sign in, sign out, /v1/me with billing, the
   funnel session's create, read, checkpoint and attach, checkout,
   portal, voice. It records every request. Every other host is cut and
   counted, so a gate never reaches the real Worker: one route over each
   whole context, the guard every browser gate carries.

   EXPECTED RED. An edge that is not wired yet is an xf: it is named,
   printed on every run with what the person sees because of it, and is
   never counted as a pass. An xf that goes green FAILS the run, so a fix
   that lands cannot leave its marker behind. The summary line is the one
   tools/floors.js reads:
     ===== N passed, M failed, R expected red =====

   Run from the repository root, after the three builds:

     mkdir -p /tmp/atuned-g0 && flock -o -w 900 /tmp/atuned-browser.lock \
       env NODE_PATH=/opt/node22/lib/node_modules \
       PLAYWRIGHT_BROWSERS_PATH=$PW_DIR TMPDIR=/tmp/atuned-g0 \
       node tests/golden.js

   PW_DIR is the Playwright browser folder HANDOFF-2026-10-09/HANDSHAKE.md
   section 4 names. It is not written out here, because tests/chrome-path.js
   holds every file under tests/ to one spelling of the browser's path.

   ATUNED_FILE points it at another build of the app (the mutants in
   tools/golden-mutants.sh), ATUNED_FUNNEL and ATUNED_QUIZ at other
   funnel pages. W and H set the viewport, 1600 by 1000 by default;
   W=390 H=844 is the phone.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http'), zlib = require('zlib');
const ROOT = path.resolve(__dirname, '..');
const APP = path.resolve(process.env.ATUNED_FILE || path.join(ROOT, 'source.html'));
const LAND = path.resolve(process.env.ATUNED_FUNNEL || path.join(ROOT, 'funnel', 'dist', 'atuned-funnel.html'));
const QUIZ = path.resolve(process.env.ATUNED_QUIZ || path.join(ROOT, 'funnel', 'dist', 'atuned-quiz.html'));
const E = require(path.resolve(process.env.ENGINE || path.join(ROOT, 'engine.js')));
const W = +process.env.W || 1600, H = +process.env.H || 1000;
const API = 'https://worker.golden.test';
const PAY = 'https://checkout.golden.test', PORTAL = 'https://portal.golden.test';
const PW = 'a long enough password 7';
/* a story every door reads at more than three places (tests/journey2.js and
   tests/onboarding2.js use the same sentence) */
const STORY = 'I felt tight in my chest when my boss yelled at me and I could not breathe.';
/* the release clock, shrunk the way tests/journey2.js shrinks it */
const SHRINK = 'REL_WORD_S=0.0004;REL_GAP_S=0.001;REL_HEAD_S=0;REL_FRAME_S=0;';
const J = x => JSON.stringify(x);
const T0 = Date.now();

/* ---------------- the ledger ---------------- */
let P = 0, F = 0, R = 0;
const ST = []; let cur = null;
const station = (n, name) => { cur = { n, name, pass: 0, fail: 0, red: 0, sees: [] }; ST.push(cur);
  console.log('\n=== ' + n + '. ' + name + ' ===   (' + Math.round((Date.now() - T0) / 1000) + 's)'); };
const ok = (c, m, sees) => {
  if (c) { P++; cur.pass++; console.log('  ok    ' + m); }
  else { F++; cur.fail++; if (sees) cur.sees.push(sees); console.log('  FAIL  ' + m + (sees ? '. The person sees: ' + sees : '')); }
  return !!c; };
const XF = [];
/* c is what will be true once the edge is wired */
const xf = (c, edge, m, sees) => {
  if (c) { F++; cur.fail++; console.log('  FAIL  expected red went green, turn ' + edge + ' into an ok: ' + m); return; }
  R++; cur.red++; cur.sees.push(sees); XF.push({ st: cur.n, edge, m, sees });
  console.log('  XF    ' + edge + ': ' + m + '. The person sees: ' + sees); };

/* ---------------- the fake Worker ---------------- */
/* A real silent WAV, a twentieth of a second, so the studio voice has a
   sound the browser can play to its end. */
function silentWav() {
  const rate = 8000, n = rate / 20, data = n * 2, b = Buffer.alloc(44 + data);
  b.write('RIFF', 0); b.writeUInt32LE(36 + data, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24);
  b.writeUInt32LE(rate * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36);
  b.writeUInt32LE(data, 40); return b;
}
/* THE STARTER GIFT. The current Worker permits a first-visit session to
   attach before a starting ground exists. The gift is issued on session
   creation or at the selected-ground checkpoint, depending on this test mode.
   Keep this fake aligned with that contract rather than an obsolete 409 path. */
function fakeWorker(origin, giftAt) {
  const st = { acc: {}, byMail: {}, tok: {}, fun: {}, ent: {}, reqs: [], deleted: [] };
  let seq = 0; const mint = p => p + '_' + (++seq).toString(36) + Math.random().toString(36).slice(2, 10);
  const cors = { 'access-control-allow-origin': origin, 'access-control-allow-headers': 'authorization, content-type, x-funnel-credential',
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS' };
  const json = (status, body) => ({ status, headers: Object.assign({ 'content-type': 'application/json', 'cache-control': 'no-store' }, cors), body: JSON.stringify(body) });
  const err = (status, m) => json(status, { error: m });
  const now = () => new Date().toISOString();
  const pub = s => ({ id: s.id, anonymousId: s.anonymousId, userId: s.userId || null, state: 'open', status: 'active',
    selectedGroundId: s.selectedGroundId || null, starterGiftId: null, tutorialCompleted: !!s.tutorialCompleted,
    firstReleaseId: s.firstReleaseId || null, verificationId: s.verificationId || null, version: s.version,
    createdAt: s.createdAt, updatedAt: s.updatedAt });
  const billing = a => { const e = st.ent[a.id]; return e ? { tier: e.tier, status: e.status, since: e.since, until: e.until, store: 'stripe' } : null; };
  function handle(method, url, headers, raw) {
    const res = route(method, url, headers, raw);
    st.reqs[st.reqs.length - 1].status = res.status;
    return res;
  }
  function route(method, url, headers, raw) {
    const u = new URL(url), p = u.pathname;
    let body = null; try { body = raw ? JSON.parse(raw) : null; } catch (e) { body = null; }
    const m = /^Bearer\s+(.+)$/i.exec(headers.authorization || '');
    const me = m && st.tok[m[1]] ? st.acc[st.tok[m[1]]] : null;
    const rec = { method, path: p, auth: !!m, me: me ? me.id : null, cred: headers['x-funnel-credential'] || null,
      origin: headers.origin || null, body, raw: raw ? String(raw) : '' };
    st.reqs.push(rec);
    if (method === 'OPTIONS') return { status: 204, headers: cors, body: '' };
    if (method === 'POST' && p === '/v1/auth/signup') {
      if (!body || typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return err(400, 'a valid email is required');
      if (typeof body.password !== 'string' || body.password.length < 8 || body.password.length > 200) return err(400, 'a password of 8 to 200 characters is required');
      const email = body.email.toLowerCase();
      if (st.byMail[email]) return err(409, 'an account with this email exists');
      const a = { id: mint('acc'), research_id: mint('rsh'), email, plan: 0, pw: body.password };
      st.acc[a.id] = a; st.byMail[email] = a.id;
      const token = mint('tok'); st.tok[token] = a.id;
      return json(201, { token, account: { id: a.id, research_id: a.research_id, plan: a.plan, email } });
    }
    if (method === 'POST' && p === '/v1/auth/signin') {
      const a = body && st.acc[st.byMail[String(body.email || '').toLowerCase()]];
      if (!a || a.pw !== body.password) return err(401, 'no account matches');
      const token = mint('tok'); st.tok[token] = a.id;
      return json(200, { token, account: { id: a.id, research_id: a.research_id, plan: a.plan, email: a.email } });
    }
    if (method === 'POST' && p === '/v1/funnel/session') {
      const id = body && body.anonymousId;
      if (typeof id !== 'string' || id.length < 8 || id.length > 200 || !/^[A-Za-z0-9._:-]+$/.test(id)) return err(400, 'a valid anonymous session id is required');
      const s = { id: mint('fs'), anonymousId: id, credential: mint('c').padEnd(64, '0'), version: 1, createdAt: now(), updatedAt: now(),
        gift: giftAt === 'create' ? mint('gift') : null };
      st.fun[s.id] = s;
      return json(201, { session: pub(s), credential: s.credential });
    }
    const fm = /^\/v1\/funnel\/session\/([^/]+)(\/attach|\/checkpoint)?$/.exec(p);
    if (fm) {
      const s = st.fun[decodeURIComponent(fm[1])];
      if (!s) return err(404, 'funnel session not found');
      const credOk = rec.cred && rec.cred === s.credential;
      if (method === 'GET' && !fm[2]) {
        if (me) return s.userId === me.id ? json(200, { session: pub(s) }) : err(403, 'this funnel session is not yours');
        return credOk && !s.ended ? json(200, { session: pub(s) }) : err(401, 'a valid funnel credential is required');
      }
      if (method === 'POST' && fm[2] === '/attach') {
        if (!me) return err(401, 'sign in first');
        if (!body || body.credential !== s.credential) return err(401, 'the funnel credential is invalid, expired, or already used');
        if (s.userId && s.userId !== me.id) return err(403, 'this funnel session is owned by another account');
        s.userId = me.id; s.version++; s.updatedAt = now();
        return json(200, { session: pub(s) });
      }
      if (method === 'PATCH' && fm[2] === '/checkpoint') {
        const owner = me && s.userId === me.id;
        if (!owner && !credOk) return err(me ? 403 : 401, 'a valid funnel credential is required');
        const allowed = ['selectedGroundId', 'tutorialCompleted', 'firstReleaseId', 'verificationId'];
        if (!body || typeof body !== 'object' || !Object.keys(body).length || Object.keys(body).some(k => allowed.indexOf(k) < 0)) return err(400, 'unknown funnel checkpoint field');
        for (const k of ['selectedGroundId', 'firstReleaseId', 'verificationId'])
          if (k in body && s[k] && s[k] !== body[k]) return err(409, 'the ' + k + ' is already recorded');
        allowed.forEach(k => { if (k in body) s[k] = body[k]; });
        if (giftAt === 'pick' && body.selectedGroundId && !s.gift) s.gift = mint('gift');
        s.version++; s.updatedAt = now();
        return json(200, { session: pub(s) });
      }
    }
    if (!me && /^\/v1\/(me|billing|auth\/signout|voice)/.test(p)) return err(401, 'sign in first');
    if (method === 'GET' && p === '/v1/me') {
      return json(200, { account: { id: me.id, research_id: me.research_id, plan: me.plan, email: me.email },
        consent: { share: false, at: null, v: 1 }, records: 0, entitlement: null, billing: billing(me) });
    }
    if (method === 'POST' && p === '/v1/auth/signout') {
      const pass = body && body.funnel, visit = pass && st.fun[pass.id];
      const ended = !!(visit && typeof pass.credential === 'string' && pass.credential === visit.credential && !visit.ended);
      if (ended) visit.ended = true;
      delete st.tok[m[1]];
      return json(200, Object.assign({ ok: true }, pass ? { funnel: { ended: ended } } : {}));
    }
    if (method === 'POST' && p === '/v1/billing/checkout') {
      const tier = String(body && body.tier || '');
      if (['one', 'two', 'three'].indexOf(tier) < 0) return err(400, 'that tier cannot be bought');
      const id = mint('cs'); st.checkout = { id, account: me.id, tier };
      return json(200, { url: PAY + '/c/' + id });
    }
    if (method === 'POST' && p === '/v1/billing/portal') {
      if (!st.ent[me.id]) return err(409, 'this account has no plan to manage yet');
      const id = mint('bps'); st.portal = { id, account: me.id };
      return json(200, { url: PORTAL + '/p/' + id });
    }
    if (method === 'POST' && p === '/v1/voice/synthesize') {
      if (!body || typeof body.text !== 'string' || !body.text.trim()) return err(400, 'a line is required');
      return { status: 200, headers: Object.assign({ 'content-type': 'audio/wav' }, cors), body: silentWav() };
    }
    if (method === 'DELETE' && p === '/v1/me') {
      st.deleted.push(me.id);
      delete st.tok[m[1]];
      delete st.byMail[me.email];
      delete st.acc[me.id];
      delete st.ent[me.id];
      return json(200, { deleted: true, at: now(), stopped: 0, billedElsewhere: null, kept: ['first_visit', 'activity_log'] });
    }
    return err(404, 'not found');
  }
  /* what Stripe's webhook would have told the Worker */
  const paid = () => { const c = st.checkout; if (!c) return false;
    st.ent[c.account] = { tier: c.tier, status: 'active', since: now(), until: new Date(Date.now() + 30 * 864e5).toISOString() }; return true; };
  const cancelled = () => { const c = st.portal; if (!c || !st.ent[c.account]) return false;
    st.ent[c.account].status = 'canceled'; return true; };
  const reqs = (meth, re) => st.reqs.filter(q => q.method === meth && re.test(q.path));
  return { st, handle, paid, cancelled, reqs };
}

/* ---------------- the site, served the way atuned.world serves it ---------------- */
function serve(dir) {
  const strays = [];
  const srv = http.createServer((q, s) => {
    const f = path.join(dir, path.basename(decodeURIComponent(new URL(q.url, 'http://x').pathname)));
    if (/\.html$/.test(f) && fs.existsSync(f)) { s.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); s.end(fs.readFileSync(f)); return; }
    strays.push(q.url); s.writeHead(404); s.end('not here');
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r({ srv, strays, origin: 'http://127.0.0.1:' + srv.address().port })));
}

/* THE INDEPENDENT RECOMPUTATION. CQ is the 21 laws over 210, each law as it
   reads after the releases at its seat since it was answered (the ruled
   formula in engine/compute.js, with LIFT_R read off the engine and not
   typed), and an unanswered law counts nought. Read off the SAVED record,
   never off the page's S. */
function cqOf(rec) {
  const laws = rec && rec.laws || {}, work = rec && rec.work || {};
  let sum = 0;
  E.SINAMES.forEach(nm => {
    const v = laws[nm]; if (v == null) return;
    const w = work[nm], n = (w && w.on === v && w.n > 0) ? w.n : 0;
    sum += n > 0 ? 10 - (10 - v) * Math.pow(1 - E.LIFT_R, n) : v;
  });
  return sum / 210 * 100;
}
const num = s => { const m = /-?\d+(?:\.\d+)?/.exec(String(s || '')); return m ? +m[0] : null; };

/* ---------------- one browser context, one fake Worker, the guard ---------------- */
async function door(browser, SITE, cut, giftAt) {
  const worker = fakeWorker(SITE, giftAt || 'pick');
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  const stubPage = (title, btn) => '<!doctype html><meta charset="utf-8"><title>' + title + '</title><body><h1>' + title
    + '</h1><button id="go">' + btn + '</button></body>';
  /* THE GUARD. One route over the whole context: the site and the three stub
     hosts are answered, and everything else is cut and counted, so nothing
     this walk does can reach the real Worker or any other server. */
  await ctx.route('**/*', async r => {
    const q = r.request(), u = q.url();
    if (u.indexOf(SITE + '/') === 0) return r.continue();
    if (u.indexOf(API + '/') === 0) return r.fulfill(worker.handle(q.method(), u, q.headers(), q.postDataBuffer()));
    if (u.indexOf(PAY + '/') === 0) return r.fulfill({ status: 200, contentType: 'text/html', body: stubPage('Stripe checkout, a stub', 'Pay') });
    if (u.indexOf(PORTAL + '/') === 0) return r.fulfill({ status: 200, contentType: 'text/html', body: stubPage('Stripe billing portal, a stub', 'Cancel plan') });
    cut.push(q.method() + ' ' + u.slice(0, 120));
    return r.abort('blockedbyclient');
  });
  /* AUTH_API IS THE STUB FROM THE FIRST LINE. The app declares it with var,
     and a var over an accessor already on window keeps the accessor, so the
     boot's own requests (authCheck at load) go to the stub as well. */
  await ctx.addInitScript(api => {
    Object.defineProperty(window, 'AUTH_API', { get() { return api; }, set() {}, configurable: false });
  }, API);
  const page = await ctx.newPage();
  const errs = [], cerrs = [];
  page.on('pageerror', e => errs.push(String(e && e.message || e)));
  page.on('console', m => { if (m.type() === 'error') { const t = m.text();
    if (/Failed to load resource|net::ERR_/i.test(t)) return; cerrs.push(t); } });
  page.on('dialog', d => d.accept().catch(() => {}));
  const D = { ctx, page, worker, errs, cerrs };
  D.booted = async () => { await page.waitForFunction(() => document.body && document.body.classList.contains('booted')
    && typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 }).catch(() => {}); };
  /* a press, read as a press: a control that is not there is a no, said by
     the assertion after it, and never a thirty second wait */
  D.click = async sel => { const h = await page.$(sel); if (!h) return false;
    try { await h.click({ timeout: 3000 }); }
    catch (e) { const r = await page.evaluate(s => { const b = document.querySelector(s); if (b && !b.disabled) { b.click(); return true; } return false; }, sel); if (!r) return false; }
    await page.waitForTimeout(150); return true; };
  D.said = () => page.evaluate(() => (typeof MSG_LOG !== 'undefined' ? MSG_LOG.map(m => (m.kind || '') + '|' + m.msg) : []));
  D.waitSaid = async (re, ms) => { const t0 = Date.now(); while (Date.now() - t0 < (ms || 6000)) {
    const l = (await D.said().catch(() => [])).filter(x => re.test(x)).pop(); if (l) return l; await page.waitForTimeout(150); } return null; };
  /* the saved record of the profile that is open, read the way a reload reads it */
  D.saved = () => page.evaluate(() => {
    let list = null, open = null;
    try { list = JSON.parse(localStorage.getItem(PKEY) || 'null'); } catch (e) { list = null; }
    try { open = (JSON.parse(localStorage.getItem(DEVKEY) || '{}') || {}).open || null; } catch (e) { open = null; }
    const rec = Array.isArray(list) ? (list.filter(p => p && p.id === open)[0] || list[0] || null) : null;
    return { list, open, rec };
  });
  D.live = () => page.evaluate(() => { const r = compute();
    return { CQ: r.CQ, unread: !!r.unread, name: CURP && CURP.name, id: CURP && CURP.id }; });
  D.reload = async () => { await page.waitForTimeout(500); await page.reload({ waitUntil: 'load' }); await D.booted(); };
  D.tab = async k => { await page.evaluate(k => { const b = document.querySelector('[data-tabk="' + k + '"]'); if (b) b.click(); }, k); await page.waitForTimeout(250); };
  /* A FIGURE IS READ ONCE IT HAS STOPPED MOVING. The rings count up into
     their values, so a read in the middle of the sweep printed 48 for a 50:
     the probe's error, caught on the first run. Read until three reads agree. */
  D.settled = async sel => { let last = null, same = 0; const t0 = Date.now();
    while (Date.now() - t0 < 6000) { const v = await page.evaluate(s => { const e = document.querySelector(s); return e ? e.textContent : null; }, sel);
      if (v !== null && v === last) { if (++same >= 3) return v; } else { same = 0; last = v; } await page.waitForTimeout(200); }
    return last; };
  /* the release, run to its end at the shrunk clock */
  D.runDone = () => page.waitForFunction(() => typeof RUN !== 'undefined' && RUN.phase === 'done' && RUN.cool >= COOLING.length,
    null, { timeout: 90000 }).then(() => true, () => false);
  return D;
}

(async () => {
  for (const f of [APP, LAND, QUIZ]) if (!fs.existsSync(f)) {
    console.log('FAIL ' + path.relative(ROOT, f) + ' is missing: run ./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh');
    console.log('\n===== 0 passed, 1 failed, 0 expected red ====='); process.exit(1); }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'golden-'));
  /* the files the owner ships, side by side, under the names the funnel's own links use */
  fs.copyFileSync(LAND, path.join(tmp, 'atuned-funnel.html'));
  fs.copyFileSync(QUIZ, path.join(tmp, 'atuned-quiz.html'));
  fs.copyFileSync(APP, path.join(tmp, 'atuned.html'));
  const site = await serve(tmp);
  const SITE = site.origin, cut = [];
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--autoplay-policy=no-user-gesture-required'] });

  /* =================================================================
     Q. THE QUIZ DOOR
     ================================================================= */
  const Q = await door(browser, SITE, cut);
  const page = Q.page, wq = Q.worker;
  const MAILQ = 'quiz.door@example.com';

  station(1, 'Q: the funnel, its quiz answered to its door');
  await page.goto(SITE + '/atuned-funnel.html', { waitUntil: 'load' });
  const toQuiz = await page.$('a[href="atuned-quiz.html"]');
  ok(!!toQuiz, 'the landing page has a door to the quiz', 'no way into the quiz');
  if (toQuiz) { await toQuiz.click(); await page.waitForURL(/atuned-quiz\.html/, { timeout: 10000 }).catch(() => {}); }
  const total = await page.evaluate(() => (typeof QQ !== 'undefined' ? QQ.length : 0));
  ok(total > 0, 'the quiz opens with its questions, ' + total);
  await Q.click('#go');
  /* the signal before the questions never blocks: its own skip */
  await Q.click('#sigskip');
  let pressed = 0;
  for (let i = 0; i < total + 5; i++) {
    if (await page.evaluate(() => STATE) !== 'q') break;
    try { await page.click('.opt[data-v="' + ((pressed * 7 + 3) % 5) + '"]', { timeout: 3000 }); pressed++; }
    catch (e) { break; }
  }
  const qa = await page.evaluate(() => ({ answered: answered(), state: STATE }));
  ok(qa.answered === total && pressed === total, 'every question is answered by pressing its own button: ' + qa.answered + ' of ' + total + ', ' + pressed + ' presses');
  ok(qa.state === 'read', 'the last answer opens the reading, state ' + qa.state);
  const quizCQ = await page.evaluate(() => { const b = document.querySelector('.cq b'); return b ? b.textContent : null; });
  ok(num(quizCQ) != null, 'the reading prints a coherence figure, ' + J(quizCQ));
  await Q.click('#readall');
  await Q.click('#todoor');
  const ready = await page.waitForSelector('#tolink[data-ready="1"]', { timeout: 10000 }).then(() => true, () => false);
  ok(ready, 'its door packs the record into Open the app with my record');
  const link = await page.evaluate(() => { const a = document.getElementById('tolink'); return a ? a.href : ''; });
  const quizSent = wq.st.reqs.length + cut.length;
  ok(quizSent === 0, 'and the funnel sent nothing to any server on the way: ' + quizSent);
  let carried = null;
  try { carried = JSON.parse(zlib.gunzipSync(Buffer.from(E.linkUnwrap(link.split('#r=')[1]))).toString('utf8')); } catch (e) { carried = null; }
  ok(!!carried && !!carried.laws, 'the link carries a whole record with its laws: ' + (carried ? Object.keys(carried.laws || {}).length + ' laws' : 'unreadable'));

  station(2, 'Q: the record goes from the quiz to the app');
  await Q.click('#tolink');
  await page.waitForURL(/atuned\.html/, { timeout: 15000 }).catch(() => {});
  await Q.booted();
  const landed = await page.evaluate(() => (typeof RECORD_LINK !== 'undefined' && RECORD_LINK)
    ? RECORD_LINK.then(p => p ? p.name : null) : 'no step');
  const doorLine = await page.waitForFunction(() => { const l = document.getElementById('loginmsg');
    return l && /from the link/.test(l.textContent) ? l.textContent : null; }, null, { timeout: 12000 }).then(h => h.jsonValue(), () => null);
  ok(!!landed && landed !== 'no step', 'the app opens on the link and loads the record, ' + J(landed), 'the app opens empty');
  ok(/^Loaded .+ from the link\./.test(doorLine || ''), 'the door says so where the person is looking, ' + J(doorLine), 'no word that the reading arrived');
  const funnelStart = await page.evaluate(() => {
    if (typeof RECORD_FUNNEL === 'undefined' || !RECORD_FUNNEL) return null;
    return RECORD_FUNNEL.then(r => ({ ok: !!r.ok, readBack: !!r.readBack, readStatus: r.readStatus, skipped: !!r.skipped }));
  });
  ok(!!funnelStart && funnelStart.ok && funnelStart.readBack && funnelStart.readStatus === 200,
    'the quiz door creates and reads back its metadata-only session before account creation');
  let L = await Q.live(), sv = await Q.saved();
  ok(!!sv.rec && sv.rec.id === L.id && sv.rec.name === landed, 'it is saved as its own record, and is the one open: ' + J(sv.rec && sv.rec.name));
  ok(await page.evaluate(() => location.hash === ''), 'and the record is off the address bar');
  ok(!!carried && J(sv.rec && sv.rec.laws) === J(carried.laws), 'the laws saved are the laws the quiz scored');
  const cqArrive = L.CQ;
  ok(Math.round(cqArrive) === num(quizCQ), 'the app reads the coherence the quiz printed: app ' + Math.round(cqArrive) + ', quiz ' + num(quizCQ),
    'one coherence figure in the quiz and another in the app');
  await Q.reload();
  L = await Q.live(); sv = await Q.saved();
  ok(L.name === landed && sv.open === L.id, 'after a reload the same record is open, ' + J(L.name), 'their own blank profile instead of the reading');
  ok(await page.evaluate(() => !!(typeof LOGIN !== 'undefined' && LOGIN.open)), 'and the door is still standing, so the link is not a way round it');

  station(3, 'Q: Create account, at the door');
  await page.fill('#loginmail', MAILQ).catch(() => {});
  await page.fill('#loginpass', PW).catch(() => {});
  await Q.click('#loginb-new');
  await page.waitForFunction(() => typeof LOGIN !== 'undefined' && !LOGIN.open, null, { timeout: 15000 }).catch(() => {});
  const made = await Q.waitSaid(/Account created\. Signed in as /, 6000);
  ok(!!made, 'the press says the account is made and who is signed in, ' + J(made), 'no sign that an account exists');
  const signups = wq.reqs('POST', /^\/v1\/auth\/signup$/);
  ok(signups.length === 1 && signups[0].body && signups[0].body.email === MAILQ, 'one sign up went to the server, with the email typed');
  ok(signups.length === 1 && signups[0].origin === SITE, 'from the site\'s own origin, the one the Worker allows, ' + J(signups[0] && signups[0].origin));
  const held = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch (e) { return null; } });
  ok(!!held && typeof held.token === 'string' && held.email === MAILQ, 'the sign in is held in this browser under its own key');
  sv = await Q.saved();
  ok(!!held && !!sv.list && J(sv.list).indexOf(held.token) < 0, 'and never inside a profile, so an export cannot carry it');
  const obQ = await page.evaluate(() => !!(typeof OB !== 'undefined' && OB.open));
  ok(!obQ, 'the record from the quiz is past the first run, so no onboarding asks what the quiz already asked');
  await Q.reload();
  ok(await page.evaluate(() => !(typeof LOGIN !== 'undefined' && LOGIN.open)), 'after a reload the sign in holds and the door does not stand');
  ok(wq.reqs('GET', /^\/v1\/me$/).some(q => q.auth && q.me), 'and the boot asked the server about it, with the sign in');

  station(4, 'Q: the reading reaches Summary and the account');
  await Q.tab(1);
  const sumCQ = await Q.settled('#sum .cr[title^="Coherence"] .v');
  ok(num(sumCQ) === Math.round(cqArrive), 'Summary prints the quiz\'s coherence, ' + J(sumCQ) + ' against ' + Math.round(cqArrive),
    'Summary does not show the reading they brought from the quiz');
  await Q.click('#profbtn'); await Q.click('[data-pms="account"]');
  await page.waitForTimeout(250);
  const accHd = await page.evaluate(() => { const h = document.querySelector('#settings .ac-hd'); return h ? h.innerText : ''; });
  ok(accHd.toLowerCase().indexOf(String(landed).toLowerCase()) >= 0 && accHd.indexOf(MAILQ) >= 0,
    'the account page names the reading open and the account it is signed in under, ' + J(accHd.replace(/\s+/g, ' ')));
  /* THE SERVER'S SIDE. The quiz record skips onboarding, so this door must
     create its metadata-only first-visit session itself and then join it to the
     account. The profile remains on this device under the standing privacy rule. */
  const quizSessions = Object.values(wq.st.fun);
  const quizAccount = Object.values(wq.st.acc).find(a => a.email === MAILQ);
  ok(quizSessions.length === 1, 'the quiz-import door creates exactly one first-visit session: ' + quizSessions.length);
  ok(!!quizAccount && quizSessions[0].userId === quizAccount.id,
    'the session opened from the quiz is attached to the account that signed in');
  const quizReads = wq.reqs('GET', /^\/v1\/funnel\/session\/[^/]+$/);
  ok(quizReads.some(q => q.status === 200 && !!q.cred),
    'the app reads its first visit back with the issued credential after creation');
  ok(wq.reqs('PUT', /^\/v1\/sync$/).length === 0,
    'profile sync remains off; the server session contains no profile copy');

  station(5, 'Q: the first release, from the Story page');
  await Q.tab(0);
  const cq0 = (await Q.live()).CQ;
  await page.fill('#sttext', STORY).catch(() => {});
  await page.dispatchEvent('#sttext', 'input').catch(() => {});
  await page.waitForTimeout(500);
  ok(await Q.click('#stapply'), 'the story is written and Commit is there to press', 'no way to keep a story');
  const kept = await Q.waitSaid(/^\|Committed\. \d+ imprints? written to the field\./, 5000);
  ok(!!kept, 'Commit says it kept the story, ' + J(kept));
  await page.evaluate(SHRINK);
  await page.evaluate(() => { const d = document.getElementById('strdose'); if (d) { d.value = '1'; d.dispatchEvent(new Event('change')); } });
  const sel = await page.evaluate(() => document.querySelectorAll('#strel [data-rq][aria-pressed="true"]').length);
  ok(sel > 0, 'the release panel offers the places the story reached, ' + sel);
  ok(await Q.click('#strun'), 'Run release is there to press', 'no way to start a release');
  const doneQ = await Q.runDone();
  const runQ = await page.evaluate(() => ({ phase: typeof RUN !== 'undefined' ? RUN.phase : null, id: typeof RUN !== 'undefined' ? RUN.id : null }));
  ok(doneQ, 'the release runs to its end, phase ' + runQ.phase, 'a release that never finishes');
  /* the results are drawn when the two minutes end, or are skipped */
  ok(await Q.click('#relrest'), 'Skip the two minutes is there to press, and opens the results');
  await page.waitForSelector('#relrscq', { timeout: 5000 }).catch(() => {});
  const relCQ = await page.evaluate(() => { const b = document.querySelector('#relrscq .rel-fig b'); return b ? b.textContent : null; });
  const relUp = await page.evaluate(() => { const b = document.querySelectorAll('#relrscq .rel-fig b')[1]; return b ? b.textContent : null; });
  ok(await Q.click('[data-relsaid="something_moved"]'), 'What changed is asked, and answered');
  await page.waitForTimeout(300);
  await Q.click('#relclose');
  await Q.reload();
  sv = await Q.saved();
  const recQ = sv.rec || {};
  const keysQ = (recQ.meter && recQ.meter.unique) || [];
  ok(keysQ.length > 0, 'after a reload the record holds the new ground the release opened: ' + keysQ.length + ' lines', 'the release is gone after a reload');
  const evQ = (recQ.practice && recQ.practice.evidence) || [];
  ok(evQ.length > 0 && evQ.every(e => e.value === 'something_moved'), 'and the answer to What changed, ' + evQ.length + ' rows');
  const entQ = (recQ.story && recQ.story.entries) || [];
  ok(entQ.some(e => e && e.text === STORY), 'and the story, word for word, ' + entQ.length + ' entry');

  station(6, 'Q: CQ, calculated and shown the same everywhere');
  const arrival = cqOf(carried);
  ok(Math.abs(arrival - cqArrive) < 1e-9, 'on arrival the engine\'s CQ equals an independent sum of the quiz\'s laws: engine ' + cqArrive.toFixed(6) + ', sum ' + arrival.toFixed(6));
  ok(Math.abs(cq0 - cqArrive) < 1e-9, 'and nothing between the door and the release moved it: ' + cq0.toFixed(6));
  const L1 = await Q.live();
  const indep = cqOf(recQ);
  ok(Math.abs(L1.CQ - indep) < 1e-9, 'after the release and a reload the engine\'s CQ equals the independent sum off the saved record: engine '
    + L1.CQ.toFixed(6) + ', sum ' + indep.toFixed(6), 'a coherence number the record does not support');
  ok(L1.CQ > cq0, 'the release lifted it, as ruled on 25 September, by ' + (L1.CQ - cq0).toFixed(4), 'a release that never moves their coherence');
  /* the lift is what the meter says it should be: every answered law at a
     released seat counts every new pattern opened at that seat */
  const bySeat = {};
  keysQ.forEach(k => { const n = E.BY[+String(k).split(':')[0]]; if (n && n.b) bySeat[n.b] = (bySeat[n.b] || 0) + 1; });
  const off = E.SI.filter(l => { const w = recQ.work && recQ.work[l.nm]; const want = bySeat[l.b] || 0;
    return want ? !(w && w.n === want && w.on === recQ.laws[l.nm]) : !!(w && w.n); }).map(l => l.nm);
  ok(Object.keys(bySeat).length > 0 && off.length === 0, 'the saved lift counts equal the new lines at each law\'s seat, recounted from the meter: '
    + J(bySeat) + ', off at ' + J(off));
  ok(num(relCQ) != null && Math.abs(num(relCQ) - +L1.CQ.toFixed(2)) < 1e-9, 'the release result printed the same CQ, ' + J(relCQ) + ' against ' + L1.CQ.toFixed(2),
    'one coherence figure on the release and another on the record');
  ok(num(relUp) != null && Math.abs(num(relUp) - +(L1.CQ - cq0).toFixed(2)) < 1e-9, 'and the same lift, ' + J(relUp) + ' against ' + (L1.CQ - cq0).toFixed(2));
  await Q.tab(2);
  const top = await Q.settled('#railtop .cr .v');
  const key = await Q.settled('#key [data-pair="cqdq"] .rb2-p.l .rb2-v');
  await Q.tab(1);
  const sum1 = await Q.settled('#sum .cr[title^="Coherence"] .v');
  const round = Math.round(L1.CQ);
  ok(num(top) === round, 'the Field\'s top bar prints it, ' + J(top) + ' against ' + round);
  ok(num(key) === round, 'the Field\'s left key prints it, ' + J(key) + ' against ' + round);
  ok(num(sum1) === round, 'Summary prints it, ' + J(sum1) + ' against ' + round);

  station(7, 'Q: pay, and the return from Stripe reads the plan back');
  const accQ = Object.values(wq.st.acc)[0] || {};
  await Q.click('#profbtn'); await Q.click('[data-pms="billing"]');
  await page.waitForTimeout(300);
  ok(!!await page.$('[data-ptier="one"]'), 'Billing offers a move to tier one', 'no way to pay');
  await Q.click('[data-ptier="one"]');
  await page.waitForURL(u => String(u).indexOf(PAY + '/') === 0, { timeout: 10000 }).catch(() => {});
  const co = wq.reqs('POST', /^\/v1\/billing\/checkout$/);
  ok(co.length === 1 && co[0].me === accQ.id && co[0].body && co[0].body.tier === 'one', 'the press asks the server for a checkout for tier one, signed in');
  ok(page.url().indexOf(PAY + '/') === 0, 'and the browser goes to the checkout page the server named, ' + page.url().slice(0, 60), 'the button does nothing');
  /* Stripe takes the card, its webhook tells the Worker, and it sends the
     browser to the success address the Worker gave it (stripe.js success_url) */
  wq.paid();
  await page.goto(SITE + '/atuned.html?billing=done', { waitUntil: 'load' });
  await Q.booted();
  const back = await Q.waitSaid(/Tier one is on this record/, 8000);
  ok(!!back, 'back from Stripe, the app says the plan is on the record, ' + J(back), 'paid, and the app still reads Free');
  const welcome = await page.waitForFunction(() => { const h = document.getElementById('tutorial');
    return h && h.style.display !== 'none' && /You are in/.test(h.innerText) ? true : null; }, null, { timeout: 6000 }).then(() => true, () => false);
  ok(welcome, 'and the welcome after paying opens');
  ok(await page.evaluate(() => location.search.indexOf('billing=') < 0), 'and the return is off the address, so a reload never replays it');
  await Q.click('#pwlater');
  await Q.reload();
  sv = await Q.saved();
  ok(!!(sv.rec && sv.rec.plan && sv.rec.plan.tier === 'one' && E.planState(sv.rec.plan) === 'live'), 'after a reload the saved record carries tier one, live: '
    + J(sv.rec && sv.rec.plan && { t: sv.rec.plan.tier, s: sv.rec.plan.status }));
  ok(!!sv.rec && E.planOf(sv.rec.plan).k === 'one', 'and the plan in force reads tier one');
  ok(await page.evaluate(() => !(document.getElementById('tutorial') && /You are in/.test(document.getElementById('tutorial').innerText))), 'and the welcome never opens twice');

  station(8, 'Q: quit: cancel the plan, sign out, delete the record');
  await Q.click('#profbtn'); await Q.click('[data-pms="billing"]');
  await page.waitForTimeout(300);
  const onLine = await page.evaluate(() => { const r = [...document.querySelectorAll('#settings .sh-row')].filter(x => /^On/.test(x.innerText))[0]; return r ? r.innerText : null; });
  ok(/Tier one/.test(onLine || ''), 'Billing says the plan in force, ' + J(onLine));
  ok(await Q.click('#planman'), 'Manage billing is there to press');
  await page.waitForURL(u => String(u).indexOf(PORTAL + '/') === 0, { timeout: 10000 }).catch(() => {});
  const po = wq.reqs('POST', /^\/v1\/billing\/portal$/);
  ok(po.length === 1 && po[0].me === accQ.id, 'it asks the server for the billing portal, signed in');
  ok(page.url().indexOf(PORTAL + '/') === 0, 'and the browser goes to the portal page the server named', 'Manage billing does nothing');
  wq.cancelled();
  await page.goto(SITE + '/atuned.html?billing=managed', { waitUntil: 'load' });
  await Q.booted();
  const ended = await Q.waitSaid(/Tier one has ended, so this record reads Free now\./, 8000);
  ok(!!ended && /^fail\|/.test(ended), 'back from the portal, the app says the plan has ended, on a held line: ' + J(ended), 'cancelled, and the app still reads tier one');
  await Q.reload();
  sv = await Q.saved();
  ok(!!(sv.rec && sv.rec.plan && E.planState(sv.rec.plan) === 'ended' && E.planOf(sv.rec.plan).k === 'free'),
    'after a reload the saved record reads ended, and free is in force: ' + J(sv.rec && sv.rec.plan && { t: sv.rec.plan.tier, s: sv.rec.plan.status }));
  ok(!!sv.rec && (sv.rec.meter && sv.rec.meter.unique || []).length === keysQ.length && ((sv.rec.story && sv.rec.story.entries) || []).length === entQ.length && entQ.length > 0,
    'and stopping deleted nothing: the story and the ground opened are all still there, as the tiers page promises');
  await Q.click('#profbtn'); await Q.click('[data-pms="billing"]');
  await page.waitForTimeout(300);
  const stLine = await page.evaluate(() => { const r = [...document.querySelectorAll('#settings .sh-row')].filter(x => /^State/.test(x.innerText))[0]; return r ? r.innerText : null; });
  ok(/ended/.test(stLine || ''), 'and Billing says it, ' + J(stLine));
  await page.evaluate(() => { const b = document.querySelector('[data-acs="account"]'); if (b) b.click(); });
  await page.waitForTimeout(250);
  ok(await Q.click('#acout'), 'Sign out is there to press');
  const out = await Q.waitSaid(/^ok\|Signed out\.$/, 6000);
  ok(!!out, 'and it says it signed out, ' + J(out));
  ok(wq.reqs('POST', /^\/v1\/auth\/signout$/).length === 1, 'and the server was told');
  await Q.reload();
  ok(await page.evaluate(() => !!(typeof LOGIN !== 'undefined' && LOGIN.open)), 'after a reload the door stands again: nobody is signed in here');
  /* E20, now a positive end-to-end assertion. Sign back into the same account,
     open its real Account section, and take the server-delete path. The fake
     Worker removes the account and session like the route contract; first-visit
     and dated audit facts remain by design and are named in the receipt. */
  await page.fill('#loginmail', accQ.email);
  await page.fill('#loginpass', PW);
  ok(await Q.click('#loginb-go'), 'after sign out, the account door offers Log in');
  const signedBack = await page.waitForFunction(email =>
    typeof LOGIN !== 'undefined' && !LOGIN.open && typeof authSession === 'function'
      && !!authSession() && authSession().email === email,
    accQ.email, { timeout: 8000 }).then(() => true, () => false);
  /* Read the actual record after the log-in submit rather than trusting the click. */
  const nowSignedIn = await page.evaluate(() => {
    const s = typeof authSession === 'function' ? authSession() : null;
    return { email: s && s.email, id: s && s.accountId };
  });
  ok(signedBack && nowSignedIn.email === accQ.email && nowSignedIn.id === accQ.id,
    'the same account is signed back in before deletion, ' + J(nowSignedIn));
  await Q.click('#profbtn'); await Q.click('[data-pms="account"]');
  await page.waitForTimeout(250);
  ok(!!await page.$('#acdelacc'), 'the signed-in Account section exposes Delete this account');
  const deleteCountBefore = wq.reqs('DELETE', /^\/v1\/me$/).length;
  ok(await Q.click('#acdelacc'), 'Delete this account is there to press');
  const gone = await Q.waitSaid(/^ok\|The account is deleted\./, 6000);
  const deleteRequests = wq.reqs('DELETE', /^\/v1\/me$/);
  const deleteReq = deleteRequests[deleteRequests.length - 1];
  ok(!!gone, 'the status confirms the server account delete, ' + J(gone));
  ok(deleteRequests.length === deleteCountBefore + 1 && deleteReq.me === accQ.id
      && deleteReq.auth && deleteReq.raw === '',
    'the browser sent one authenticated DELETE /v1/me with no request body for the right account');
  ok(wq.st.deleted.includes(accQ.id) && !wq.st.acc[accQ.id] && !wq.st.byMail[accQ.email]
      && !Object.values(wq.st.tok).includes(accQ.id),
    'the server mock removed the account, email lookup and sign-in token');
  const deleteLocal = await page.evaluate(() => ({
    session: localStorage.getItem('source.session') || '',
    funnel: localStorage.getItem('funnel.session') || '',
    signedIn: !!(typeof authSession === 'function' && authSession()),
    rec: typeof CURP !== 'undefined' && CURP ? CURP.id : null,
    receipt: (document.getElementById('acgone') || {}).innerText || ''
  }));
  ok(!deleteLocal.session && !deleteLocal.funnel && !deleteLocal.signedIn,
    'account deletion clears this browser sign-in and first-visit credential');
  ok(/first-visit record, linked by a random account ID/i.test(deleteLocal.receipt)
      && /dated list of when the account signed in and paid/i.test(deleteLocal.receipt)
      && /linked by that random account ID and with no email/i.test(deleteLocal.receipt),
    'the receipt names the first-visit record, its random account-ID link, and the dated audit data retained on the server');
  ok(/This record is still on this device/i.test(deleteLocal.receipt) && deleteLocal.rec,
    'the receipt is clear that the local record stays and remains available to delete separately');
  sv = await Q.saved();
  const goneName = sv.rec && sv.rec.name, goneId = sv.rec && sv.rec.id;
  await Q.click('#profbtn'); await Q.click('[data-pms="privacy"]');
  await page.waitForTimeout(300);
  ok(await Q.click('#acdel'), 'Delete this record is there to press');
  const del = await Q.waitSaid(/is deleted from this browser, the only place it was held\./, 6000);
  ok(!!del && del.indexOf(goneName) >= 0, 'and it says what it deleted and where, ' + J(del), 'no word of what went');
  await Q.reload();
  sv = await Q.saved();
  ok(!!sv.list && !sv.list.some(p => p && p.id === goneId), 'after a reload the record is gone from this browser');
  const bodiesQ = wq.st.reqs.map(q => q.raw + ' ' + q.path).join('\n');
  ok(bodiesQ.indexOf('tight in my chest') < 0 && bodiesQ.indexOf(goneName || 'Web reading') < 0,
    'and on the whole walk no request carried a word of the story or the record\'s name');
  ok(wq.reqs('GET', /^\/v1\/sync$/).length === 0 && wq.reqs('PUT', /^\/v1\/sync$/).length === 0,
    'profile sync is outside alpha, so sign-in neither reads nor sends the profile');
  ok(Q.errs.length === 0 && Q.cerrs.length === 0, 'no script or console error on this door: ' + Q.errs.concat(Q.cerrs).slice(0, 3).join(' | '));
  await Q.ctx.close();

  /* =================================================================
     O. THE ONBOARDING DOOR
     ================================================================= */
  const O = await door(browser, SITE, cut);
  const po2 = O.page, wo = O.worker;
  const MAILO = 'onboarding.door@example.com';

  station(9, 'O: a blank arrival, read the same in the app and out of the engine');
  await po2.goto(SITE + '/atuned.html', { waitUntil: 'load' });
  await O.booted();
  const b0 = await po2.evaluate(() => { const r = compute(); let list = null;
    try { list = JSON.parse(localStorage.getItem(PKEY) || 'null'); } catch (e) {}
    return { CQ: r.CQ, unread: !!r.unread, list, door: !!(typeof LOGIN !== 'undefined' && LOGIN.open) }; });
  ok(b0.door, 'the door stands for somebody who has never been here');
  const blank = Array.isArray(b0.list) ? b0.list[0] : null;
  let eng = null;
  if (blank) { E.loadProfile(JSON.parse(JSON.stringify(blank))); const r = E.compute(); eng = { CQ: r.CQ, unread: !!r.unread }; }
  ok(!!eng && Math.abs(eng.CQ - b0.CQ) < 1e-9 && eng.unread === b0.unread, 'a blank arrival reads the same in the app and out of the engine: app '
    + (b0.CQ != null ? b0.CQ.toFixed(2) : 'none') + ', engine ' + (eng ? eng.CQ.toFixed(2) : 'none') + ' (NN8 said 42.25 and 36.00)');
  ok(b0.unread && b0.CQ === 0 && !!blank && cqOf(blank) === 0, 'and it is not read yet: CQ ' + b0.CQ + ', unread ' + b0.unread);
  const topB = await O.settled('#railtop .cr .v');
  ok(topB === '–', 'and the Field prints a dash, never a number nobody entered, ' + J(topB));

  station(10, 'O: Create account at the door, and the first visit joins the account');
  await po2.fill('#loginmail', MAILO).catch(() => {});
  await po2.fill('#loginpass', PW).catch(() => {});
  await O.click('#loginb-new');
  await po2.waitForFunction(() => typeof LOGIN !== 'undefined' && !LOGIN.open, null, { timeout: 15000 }).catch(() => {});
  ok(!!await O.waitSaid(/Account created\. Signed in as /, 6000), 'the press says the account is made and who is signed in');
  const obOn = await po2.waitForFunction(() => typeof OB !== 'undefined' && OB.open, null, { timeout: 8000 }).then(() => true, () => false);
  ok(obOn, 'behind the door the first run opens');
  await po2.waitForTimeout(800);
  const accO = Object.values(wo.st.acc)[0] || {};
  const fsO = Object.values(wo.st.fun);
  ok(fsO.length === 1, 'the first run made one first visit session on the server, ' + fsO.length);
  const attaches = wo.reqs('POST', /^\/v1\/funnel\/session\/[^/]+\/attach$/);
  ok(attaches.length >= 1 && attaches.every(q => q.me === accO.id), 'the app asked the server to join it to the account, with the sign in, '
    + attaches.length + ' asks, answered ' + J(attaches.map(q => q.status)), 'their first visit stays anonymous on the server, so nothing they do in it reaches the account they just made');
  const firstVisitReads = wo.reqs('GET', /^\/v1\/funnel\/session\/[^/]+$/);
  ok(firstVisitReads.some(q => q.status === 200 && q.auth && !!q.cred),
    'the account door reads the saved first visit back with its session credential');

  station(11, 'O: the first release through onboarding, with the studio voice');
  const ob = () => po2.evaluate(() => ({ open: !!(typeof OB !== 'undefined' && OB.open), step: typeof OB !== 'undefined' ? OB.step : null,
    card: (document.querySelector('#ob .ob-card') || {}).innerText || '' }));
  let o = await ob(), joinedAtPick = null;
  for (let guard = 0; guard < 14 && o.open && o.step < 7; guard++) {
    if (o.step === 0 || o.step === 2) await O.click('[data-ob="next"]');
    else if (o.step === 1) {
      await O.click('[data-obpick="0"]');
      /* the pick is the first mark, and here it is what lets the server join
         the session, so the join is read now: a person who stops after the
         pick must not be left anonymous until some later screen asks again */
      const t0 = Date.now();
      while (Date.now() - t0 < 4000 && !(Object.values(wo.st.fun)[0] || {}).userId) await po2.waitForTimeout(150);
      joinedAtPick = (Object.values(wo.st.fun)[0] || {}).userId || null; }
    else if (o.step === 3) await O.click('[data-obfeel="1"]');
    else if (o.step === 4) await O.click('[data-obplace="3"]');
    else if (o.step === 5) { await po2.fill('#obtext', STORY); await po2.dispatchEvent('#obtext', 'input'); await O.click('#obdone'); }
    else if (o.step === 6) {
      await po2.evaluate(() => { let b; while ((b = document.querySelector('[data-obmore]'))) b.click();
        document.querySelectorAll('[data-obans="yes"][aria-pressed="false"]').forEach(x => x.click()); });
      await O.click('[data-ob="mirrorcommit"]'); }
    o = await ob();
  }
  ok(o.open && o.step === 7, 'the first run walks to the card that offers the release, step ' + o.step);
  const plan = await po2.evaluate(() => (typeof OB !== 'undefined' && OB.plan) ? JSON.parse(JSON.stringify(OB.plan)) : null);
  ok(!!(plan && plan.ok && plan.lines > 0), 'it plans a release from the yes rows: ' + J(plan && { lines: plan.lines, addrs: plan.addrs }));
  await O.click('[data-ob="release"]');
  await po2.waitForFunction(() => typeof RUN !== 'undefined' && RUN.open, null, { timeout: 8000 }).catch(() => {});
  ok(await po2.evaluate(() => !!document.getElementById('relvoice')), 'signed in, the release card offers the one Voice switch', 'no voice switch');
  ok(await po2.evaluate(() => typeof relVoiceOn === 'function' && relVoiceOn() === true), 'and it is on without a press, so a release is spoken by the studio voice and by nothing else');
  await po2.evaluate(SHRINK);
  await po2.evaluate(() => { const d = document.getElementById('reldose'); if (d) { d.value = '1'; d.dispatchEvent(new Event('change')); } });
  await O.click('#relgo');
  const doneO = await O.runDone();
  const run = await po2.evaluate(() => ({ phase: RUN.phase, id: RUN.id, lost: !!RUN.studioLost }));
  ok(doneO, 'the release runs to its end, phase ' + run.phase, 'a release that never finishes');
  const voice = wo.reqs('POST', /^\/v1\/voice\/synthesize$/);
  ok(voice.length > 0 && voice.every(q => q.me === accO.id && q.body && (q.body.style === 'list' || q.body.style === 'frame')),
    'the studio voice asked the server for its lines, signed in, by style: ' + voice.length + ' lines');
  ok(!run.lost, 'and every line it asked for played, so the run never fell back to the browser voice', 'the studio voice drops out mid release');
  await po2.evaluate(() => { const r = document.getElementById('relrest'); if (r) r.click(); });
  await po2.waitForTimeout(150);
  ok(await O.click('[data-relsaid="something_moved"]'), 'What changed is asked, and answered');
  await po2.waitForTimeout(300);
  await O.click('#relclose');
  await po2.waitForTimeout(700);
  o = await ob();
  const END = await po2.evaluate(() => typeof OB_END === 'number' ? OB_END : -1);
  ok(o.open && o.step === END && /Here is what you made/.test(o.card), 'Done brings the person to the end card, which says what they made');
  await O.click('[data-ob="endin"]');
  await po2.waitForTimeout(800);
  ok(!(await ob()).open, 'Go in closes the first run');
  await O.reload();
  const so = await O.saved(), recO = so.rec || {};
  const keysO = (recO.meter && recO.meter.unique) || [];
  ok(!!plan && keysO.length === plan.lines, 'after a reload the record holds the new ground the release opened: ' + keysO.length + ' lines',
    'the release is gone after a reload');
  const evO = (recO.practice && recO.practice.evidence) || [];
  ok(evO.length > 0 && evO.every(e => e.value === 'something_moved'), 'and the answer to What changed, ' + evO.length + ' rows');
  ok(!!(recO.ui && recO.ui.onboarded) && !(await ob()).open, 'and the first run is finished, so it never opens again');
  const LO = await O.live();
  ok(LO.CQ === 0 && cqOf(recO) === 0 && !Object.keys(recO.work || {}).some(k => recO.work[k] && recO.work[k].n),
    'with no law answered CQ is 0 before and after, in the app and in the recount, and no lift was counted: ' + LO.CQ);
  const fso = Object.values(wo.st.fun)[0] || {};
  ok(!!fso.selectedGroundId, 'the server holds the starting point picked, ' + J(fso.selectedGroundId));
  ok(!!fso.firstReleaseId && fso.firstReleaseId === run.id, 'and the first release, by its id, ' + J(fso.firstReleaseId),
    'the account cannot tell that the first release happened');
  ok(!!fso.verificationId && evO.some(e => String(e.id) === String(fso.verificationId)), 'and the answer to What changed, by id and never by value, ' + J(fso.verificationId));
  ok(fso.tutorialCompleted === true, 'and that the first run was finished', 'the server reads the first run as never finished, for everybody who finishes it');
  ok(!!accO.id && joinedAtPick === accO.id, 'from the first mark on, the server holds the first visit on the account they made at the door, userId '
    + J(joinedAtPick), 'somebody who stops after picking a starting point stays anonymous on the server');
  ok(!!accO.id && fso.userId === accO.id, 'and still does at the end of the first run, userId ' + J(fso.userId),
    'their first visit stays anonymous on the server, so nothing they did in it reaches the account they made');
  const joins = wo.reqs('POST', /^\/v1\/funnel\/session\/[^/]+\/attach$/), yes = joins.findIndex(q => q.status === 200);
  ok(yes >= 0 && yes === joins.length - 1, 'and the app stopped asking once it was joined: ' + joins.length + ' asks, answered ' + J(joins.map(q => q.status)));
  const marks = wo.reqs('PATCH', /\/checkpoint$/);
  ok(marks.length > 0 && marks.every(q => q.me === accO.id), 'every mark carried the sign in: ' + marks.length + ' marks');
  ok(Object.values(wo.st.fun).length === 1, 'and the walk made one first visit session, not one per reload');
  const bodiesO = wo.st.reqs.map(q => q.raw + ' ' + q.path).join('\n');
  ok(bodiesO.indexOf('tight in my chest') < 0, 'no request on this door carried a word of the story, the studio voice\'s lines aside');
  ok(wo.reqs('GET', /^\/v1\/sync$/).length === 0 && wo.reqs('PUT', /^\/v1\/sync$/).length === 0,
    'the onboarding door does not read or send the profile while sync is outside alpha');
  ok(O.errs.length === 0 && O.cerrs.length === 0, 'no script or console error on this door: ' + O.errs.concat(O.cerrs).slice(0, 3).join(' | '));
  await O.ctx.close();

  /* THE OTHER W3 OPTION: the server issues the gift with the session, so the
     join can happen at once. Only the join is walked here. */
  station(12, 'O: the same join, if the server issues the gift with the session');
  {
    const O2 = await door(browser, SITE, cut, 'create');
    const w2 = O2.worker;
    await O2.page.goto(SITE + '/atuned.html', { waitUntil: 'load' });
    await O2.booted();
    await O2.page.fill('#loginmail', 'gift.at.create@example.com').catch(() => {});
    await O2.page.fill('#loginpass', PW).catch(() => {});
    await O2.click('#loginb-new');
    await O2.page.waitForFunction(() => typeof OB !== 'undefined' && OB.open, null, { timeout: 15000 }).catch(() => {});
    await O2.page.waitForTimeout(800);
    const a2 = Object.values(w2.st.acc)[0] || {}, f2 = Object.values(w2.st.fun);
    ok(f2.length === 1 && !!a2.id && f2[0].userId === a2.id, 'before the first press the first visit is on the account, userId ' + J(f2[0] && f2[0].userId),
      'their first visit stays anonymous on the server');
    ok(w2.reqs('GET', /^\/v1\/sync$/).length === 0 && w2.reqs('PUT', /^\/v1\/sync$/).length === 0,
      'account creation does not read or send the profile while sync is outside alpha');
    ok(O2.errs.length === 0, 'no script error: ' + O2.errs.slice(0, 2).join(' | '));
    const receipt = await O2.page.evaluate(() => authGone({
      stopped:0, retentionUntil:'2028-10-10T00:00:00.000Z', retentionMarked:true,
      kept:['first_visit','activity_log']
    }));
    ok(receipt.lines.some(line => /first-visit record/.test(line) && /removal on 2028-10-10/.test(line)),
      'the deletion receipt states the first-visit record removal date: ' + J(receipt.lines));
    ok(receipt.lines.some(line => /dated list/.test(line) && /removal on 2028-10-10/.test(line)),
      'the deletion receipt states the activity-log removal date: ' + J(receipt.lines));
    const pendingReceipt = await O2.page.evaluate(() => authGone({
      stopped:0, retentionUntil:'2028-10-10T00:00:00.000Z', retentionMarked:false, retentionPending:true,
      kept:['first_visit']
    }));
    ok(pendingReceipt.lines.some(line => /cleanup in the first-visit store is still pending/.test(line)),
      'the deletion receipt does not claim remote retention is confirmed when marking is pending');
    await O2.ctx.close();
  }

  /* THE FILE THE OWNER IS SENT. CLAUDE.md: every build goes to the owner as a
     download, so it runs from a file, whose origin is null. The Worker's CORS
     allows one origin, ALLOWED_ORIGIN = "https://atuned.world" in wrangler.toml
     on Reboot-OS main, read 9 October, so a file copy cannot make an account.
     The live host is routed to a fake that answers with that one origin, and
     never reaches the real Worker. Green when the copy either makes the account
     or says the true reason; today it blames the person's connection. */
  station(13, 'F: Create account in the file the owner is sent');
  {
    const wf = fakeWorker('https://atuned.world', 'pick');
    const cf = await browser.newContext({ viewport: { width: W, height: H } });
    await cf.route('**/*', r => { const q = r.request(), u = q.url();
      if (u.indexOf('file:') === 0) return r.continue();
      if (/^https:\/\/[^/]*workers\.dev\//.test(u)) return r.fulfill(wf.handle(q.method(), u.replace(/^https:\/\/[^/]+/, API), q.headers(), q.postDataBuffer()));
      cut.push(q.method() + ' ' + u.slice(0, 120)); return r.abort('blockedbyclient'); });
    const pf = await cf.newPage();
    const ferrs = []; pf.on('pageerror', e => ferrs.push(String(e && e.message || e)));
    await pf.goto('file://' + path.join(tmp, 'atuned.html'), { waitUntil: 'load' });
    await pf.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 30000 }).catch(() => {});
    await pf.fill('#loginmail', 'file.copy@example.com').catch(() => {});
    await pf.fill('#loginpass', PW).catch(() => {});
    await pf.click('#loginb-new', { timeout: 3000 }).catch(() => {});
    await pf.waitForFunction(() => { const m = document.getElementById('loginmsg');
      return !(typeof LOGIN !== 'undefined' && LOGIN.open) || (m && m.textContent && !/^Creating/.test(m.textContent)); }, null, { timeout: 20000 }).catch(() => {});
    const f = await pf.evaluate(() => ({ open: !!(typeof LOGIN !== 'undefined' && LOGIN.open), msg: (document.getElementById('loginmsg') || {}).textContent || '',
      held: !!(typeof authSession === 'function' && authSession()) }));
    ok(!wf.st.reqs.some(q => q.path === '/v1/auth/signup' && q.origin === 'null'),
      'a downloaded copy does not send signup from an unsupported origin');
    ok(!f.held && /downloaded copy|runs offline|no account request was sent/i.test(f.msg),
      'the account door explains why sign in is unavailable in the downloaded copy: ' + J(f.msg));
    ok(ferrs.length === 0, 'no script error: ' + ferrs.slice(0, 2).join(' | '));
    await cf.close();
  }

  station(14, 'every door: nothing else was reached');
  ok(cut.length === 0, 'nothing tried to reach any server but the stubs: ' + J(cut.slice(0, 3)));
  ok(site.strays.length === 0, 'and the pages asked their own site for nothing it does not ship: ' + J(site.strays.slice(0, 3)));

  await browser.close();
  site.srv.close();
  fs.rmSync(tmp, { recursive: true, force: true });

  /* ---------------- the table ---------------- */
  console.log('\n=== the stations, at ' + W + ' by ' + H + ', ' + Math.round((Date.now() - T0) / 1000) + 's ===');
  ST.forEach(s => console.log('  ' + String(s.n).padEnd(3) + (s.fail || s.red ? 'CUT ' : 'PASS') + '  ' + s.name
    + '  (' + s.pass + ' ok' + (s.fail ? ', ' + s.fail + ' failed' : '') + (s.red ? ', ' + s.red + ' expected red' : '') + ')'
    + (s.sees.length ? '\n        the person sees: ' + s.sees.join('; ') : '')));
  console.log('\n=== expected red, not wired yet ===');
  if (!XF.length) console.log('  none');
  XF.forEach(x => console.log('  ' + x.edge + ' (station ' + x.st + '): ' + x.m + '\n        the person sees: ' + x.sees));
  console.log('\n===== ' + P + ' passed, ' + F + ' failed, ' + R + ' expected red =====');
  process.exit(F ? 1 : 0);
})().catch(e => { console.log('  FAIL the walk threw: ' + ((e && e.stack) || e)); console.log('\n===== ' + P + ' passed, ' + (F + 1) + ' failed, ' + R + ' expected red ====='); process.exit(1); });
