#!/usr/bin/env node
/* ============================================================
   THE PASSWORD RESET LINK, IN A REAL BROWSER. Open item M3.
   NODE_PATH=/opt/node22/lib/node_modules node tests/reset.js
   SHOTS=dir         also writes the screenshots a person looks at
   ATUNED_FILE=path  runs against another build, which is how this gate is
                     checked against a known bad copy

   The Worker (reboot-os atuned/server/src/index.js, POST /v1/auth/forgot)
   mails a link of the form <APP_URL>/?reset=<token>, and POST /v1/auth/reset
   takes {token, password} and answers a fresh session, or 400 for a token
   that is unknown, used, or past its hour. Before this the app never read
   ?reset=, so the link opened the plain Log in card, and a person who had
   forgotten their password was locked out of their own record with the one
   link that was meant to let them back in.

   What is held, against a stub that answers the Worker's routes in the
   Worker's own shapes and words, read off its test/auth.test.mjs:
     the link opens Set a new password, focus is on the first field, and both
     fields carry a real label;
     the token is off the address before the first request leaves, read off
     that request's own Referer, so it cannot reach history, a referrer or a
     picture of the address bar;
     two fields that differ, and a password under the Worker's floor, are
     refused here and nothing is sent;
     one press of Save sends one request, never two, carrying the token and
     the new password and nothing else;
     a refused token, no network and a rate limit each say so in plain words
     on the card and on the status line, and the card keeps what was typed;
     a yes signs the person in, says so, and shows the one next step;
     the token is in no storage, no status line and no markup at any point;
     every control is 44 pixels each way at 390 and at 1600, and nothing
     scrolls sideways at 390;
     the forgotten password card says one sentence whether or not the address
     has an account, and the request goes to the server.

   SERVED OVER HTTP FROM THE STUB'S OWN ORIGIN, with AUTH_API pointed at that
   origin, because a same origin request carries the whole page address as its
   Referer, and that header is the one place a token left on the address by a
   late replaceState would show. A file:// page sends no Referer at all, so a
   gate run only from disk could not see the leak it exists to catch. One
   file:// open is kept, because that is how a handover build opens.

   A session is held before the link is opened, so that the boot's own sign
   in check sends a real request while the link is being read. Without one the
   boot sends nothing, and "no request carried the token" would be true of a
   build that never took it off the address.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const fs = require('fs'), path = require('path'), http = require('http'), crypto = require('crypto');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(process.env.ATUNED_FILE || path.join(ROOT, 'source.html'));
const SHOTS = process.env.SHOTS || '';
/* the address ui/auth.js carries. Every request to it is refused and counted:
   this gate never touches the real server, which holds real accounts and a
   sign in limit per address */
const WORKER = 'https://atuned-api.lance-o-powell.workers.dev';
const AUTH_LINE = "var AUTH_API='" + WORKER + "';";

let n = 0; const fails = [];
const ok = (c, m) => { n++; if (!c) fails.push(m); console.log((c ? '  ok    ' : '  FAIL  ') + m); };
const booted = pg => pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 }).catch(() => null);
const shot = async (pg, nm) => { if (SHOTS) { await pg.screenshot({ path: path.join(SHOTS, nm) }); console.log('  shot  ' + nm); } };
/* a token in the Worker's own shape, b64u of random bytes, 43 characters, so
   no build carries it by chance and a scan for it means something */
const tok = () => 'abc' + crypto.randomBytes(30).toString('base64url');
const J = x => JSON.stringify(x);

/* THE STUB. The Worker's routes, its status codes and its own lower case
   words, and its own floor: a password of 8 to 200 characters, or 400. mode
   picks what the reset route answers next, so one page can meet every case
   on one token. */
const ACC = { id: 'acc_probe', research_id: 'rsh_probe', plan: 1, email: 'probe@example.invalid' };
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type, x-funnel-credential',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS' };
const seen = []; let mode = 'good'; let served = '';
const stub = http.createServer((req, res) => {
  let raw = ''; req.on('data', d => raw += d); req.on('end', () => {
    const send = (st, b) => { res.writeHead(st, Object.assign({ 'content-type': 'application/json' }, CORS)); res.end(J(b)); };
    if (req.method === 'OPTIONS') { res.writeHead(204, CORS); res.end(); return; }
    const u = req.url.split('?')[0];
    if (req.method === 'GET' && u === '/atuned.html') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); res.end(served); return; }
    let b = {}; try { b = JSON.parse(raw || '{}'); } catch (e) {}
    const auth = req.headers.authorization || '';
    seen.push({ m: req.method, u: req.url, ref: req.headers.referer || '', auth, raw, b });
    const k = req.method + ' ' + u;
    if (k === 'POST /v1/auth/reset') {
      if (typeof b.token !== 'string' || typeof b.password !== 'string' || b.password.length < 8 || b.password.length > 200)
        return send(400, { error: 'a token and a password of 8 to 200 characters are required' });
      if (mode === 'dead') return send(400, { error: 'this link has expired. ask for a new one' });
      if (mode === 'many') return send(429, { error: 'too many attempts. wait fifteen minutes' });
      /* a yes with no session in it, which the Worker does not send today:
         the password changed, and nothing may claim a sign in */
      if (mode === 'bare') return send(200, { ok: true, account: { email: ACC.email } });
      return send(200, { token: 't-reset', account: ACC });
    }
    if (k === 'POST /v1/auth/forgot') return send(200, { ok: true });
    if (k === 'GET /v1/me') return (auth === 'Bearer t-old' || auth === 'Bearer t-reset')
      ? send(200, { account: ACC, consent: { share: false, at: null, v: 1 }, records: 0, entitlement: null })
      : send(401, { error: 'sign in' });
    send(404, { error: 'no such route' });
  });
});

/* WHAT THE PAGE SHOWS, read the way a person meets it: controls found by the
   words on them and fields by their type, never by an id the build might
   rename, so the gate holds the screen and not the markup. */
function helpers() {
  const host = () => document.getElementById('login');
  const btns = () => { const h = host(); return h ? [...h.querySelectorAll('button')] : []; };
  window.__btn = t => btns().find(b => b.textContent.trim() === t) || null;
  window.__card = needle => {
    const h = host(), s = document.getElementById('status'), m = document.getElementById('loginmsg');
    const open = !!h && getComputedStyle(h).display !== 'none' && h.innerHTML !== '';
    const head = h && h.querySelector('.ob-h');
    const pw = h ? [...h.querySelectorAll('input[type=password]')] : [];
    const lab = i => { const l = i.id && document.querySelector('label[for="' + i.id + '"]'); return l ? l.textContent.trim() : ''; };
    const a = document.activeElement;
    let store = [];
    for (const st of [localStorage, sessionStorage]) for (let i = 0; i < st.length; i++) {
      const k = st.key(i), v = st.getItem(k) || ''; if (needle && (k + v).indexOf(needle) >= 0) store.push(k); }
    const log = typeof MSG_LOG !== 'undefined' ? MSG_LOG.map(x => x.msg).join(' | ') : '';
    const save = window.__btn('Save');
    return { open, head: head ? head.textContent.trim() : '', href: location.href, search: location.search, hash: location.hash,
      pw: pw.map(i => ({ id: i.id, val: i.value, label: lab(i), auto: i.getAttribute('autocomplete') })),
      msg: m ? m.textContent : null, msgKind: m ? m.getAttribute('data-kind') : null,
      status: s ? s.textContent : '', statusKind: s ? s.getAttribute('data-kind') : null,
      focus: a ? a.id : '', focusText: a ? a.textContent.trim() : '', focusTag: a ? a.tagName : '',
      text: h ? h.innerText : '',
      saveOn: !!save && !save.disabled, buttons: btns().map(b => b.textContent.trim()),
      store, inLog: !!needle && log.indexOf(needle) >= 0,
      inDom: !!needle && document.documentElement.outerHTML.indexOf(needle) >= 0,
      session: (() => { try { return localStorage.getItem('source.session') || ''; } catch (e) { return 'unreadable'; } })() };
  };
  /* type into the two fields, press the control named t, and wait until the
     card is no longer busy, so the next read sees the answer and not the wait */
  window.__press = async (t, a, b) => {
    const h = host(), pw = h ? [...h.querySelectorAll('input[type=password]')] : [];
    if (a !== undefined && pw[0]) pw[0].value = a;
    if (b !== undefined && pw[1]) pw[1].value = b;
    const btn = window.__btn(t); if (!btn) return false;
    btn.click();
    const wait = ms => new Promise(r => setTimeout(r, ms));
    await wait(30);
    for (let i = 0; i < 600 && typeof LOGIN !== 'undefined' && LOGIN.busy; i++) await wait(25);
    await wait(80);
    return true;
  };
  /* every control in the card, measured where it is drawn */
  window.__taps = () => { const h = host(); if (!h) return [];
    return [...h.querySelectorAll('.ob-card button, .ob-card input')].filter(e => e.getClientRects().length)
      .map(e => { const r = e.getBoundingClientRect(); return { t: e.textContent.trim() || e.type, w: Math.round(r.width), h: Math.round(r.height), right: r.right }; }); };
}

(async () => {
  if (!fs.existsSync(SRC)) { console.log('  FAIL  no build at ' + SRC + '. Run ./atuned_src/BUILD.sh first.'); process.exit(1); }
  const raw = fs.readFileSync(SRC, 'utf8');
  const hits = raw.split(AUTH_LINE).length - 1;
  await new Promise(r => stub.listen(0, '127.0.0.1', r));
  const BASE = 'http://127.0.0.1:' + stub.address().port;
  served = raw.split(AUTH_LINE).join("var AUTH_API='" + BASE + "';");
  /* if the line moves, the served build would talk to the real server, so the
     gate stops on it rather than walking a page it cannot trust */
  ok(hits === 1, 'the build carries AUTH_API once, so the served copy talks to the stub, found ' + hits);
  if (hits !== 1) { stub.close(); console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed ====='); process.exit(1); }

  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const worker = [];
  const ctx = async (w, h) => {
    const cx = await browser.newContext({ viewport: { width: w, height: h } });
    await cx.route(WORKER + '/**', r => { worker.push(r.request().url()); r.abort(); });
    await cx.addInitScript(helpers);
    return cx;
  };
  const posts = () => seen.filter(s => s.m === 'POST' && s.u === '/v1/auth/reset');
  const errs = [];

  console.log('\n=== the link opens the screen, and the token leaves the address first, 1600 ===');
  {
    const cx = await ctx(1600, 1000), pg = await cx.newPage();
    pg.on('pageerror', e => errs.push(String(e && e.message || e)));
    await pg.goto(BASE + '/atuned.html?dev=1', { waitUntil: 'load' }); await booted(pg);
    await pg.evaluate(() => localStorage.setItem('source.session', JSON.stringify({ token: 't-old', email: 'probe@example.invalid' })));
    const T = tok();
    seen.length = 0;
    await pg.goto('about:blank');
    await pg.goto(BASE + '/atuned.html?reset=' + T, { waitUntil: 'load' }); await booted(pg);
    await pg.waitForTimeout(700);
    let c = await pg.evaluate(t => __card(t), T);
    ok(c.open && c.head === 'Set a new password', 'the reset link opens Set a new password and not the log in card, got ' + J(c.head));
    ok(c.href.indexOf(T) < 0 && c.search === '', 'the token is off the address bar, got ' + c.href);
    const boot = seen.filter(s => s.u.indexOf('/v1/') === 0);
    ok(boot.some(s => s.u === '/v1/me' && s.ref.indexOf(BASE + '/atuned.html') === 0),
      'the held session is checked at boot, with a Referer, so the next line has a request to read: ' + J(boot.map(s => s.u + ' ' + s.ref.slice(0, 60))));
    ok(boot.every(s => (s.u + s.ref + s.raw).indexOf(T) < 0), 'no request at boot carries the token, in its address, its body or its Referer');
    ok(c.pw.length === 2 && c.pw.every(p => p.label), 'two password fields, each with a real label, got ' + J(c.pw.map(p => p.label)));
    ok(c.pw.length === 2 && c.pw.every(p => p.auto === 'new-password'), 'both ask a password manager for a new password, got ' + J(c.pw.map(p => p.auto)));
    ok(c.pw.length > 0 && c.focus === c.pw[0].id && c.focusTag === 'INPUT', 'focus is on the first field, got ' + J([c.focus, c.focusTag]));
    ok(!!(await pg.evaluate(() => __btn('Save'))) && !!(await pg.evaluate(() => __btn('Back to log in'))),
      'the screen carries Save and a way back to log in, got ' + J(c.buttons));
    ok(!c.inDom && !c.store.length && !c.inLog, 'the token is in no markup, no storage and no status line, got ' + J([c.inDom, c.store, c.inLog]));
    const taps = await pg.evaluate(() => __taps());
    ok(c.open && taps.length > 0 && taps.every(t => t.w >= 44 && t.h >= 44), 'every control is at least 44 pixels each way at 1600, got ' + J(taps));
    await shot(pg, 'reset-open-1600.png');

    let before = posts().length;
    await pg.evaluate(() => __press('Save', 'new-password-1', 'new-password-2'));
    c = await pg.evaluate(t => __card(t), T);
    ok(c.msg === 'The two passwords do not match. Type the same one in both.' && c.msgKind === 'fail'
      && c.status === c.msg && c.statusKind === 'fail', 'two different passwords are refused here, on the card and the status line, got ' + J([c.msg, c.status]));
    ok(posts().length === before, 'and nothing is sent for them');
    await shot(pg, 'reset-mismatch-1600.png');
    await pg.evaluate(() => __press('Save', 'short', 'short'));
    c = await pg.evaluate(t => __card(t), T);
    ok(c.msg === 'A password needs at least 8 characters.' && c.status === c.msg && c.statusKind === 'fail',
      'a password under the server\'s floor is refused here, got ' + J(c.msg));
    ok(posts().length === before, 'and nothing is sent for it either');

    mode = 'dead'; before = posts().length;
    await pg.evaluate(() => __press('Save', 'new-password-1', 'new-password-1'));
    c = await pg.evaluate(t => __card(t), T);
    ok(posts().length === before + 1, 'one press of Save sends one request, got ' + (posts().length - before));
    const p = posts()[posts().length - 1];
    ok(!!p && p.b.token === T && p.b.password === 'new-password-1' && Object.keys(p.b).sort().join() === 'password,token',
      'to the confirm route, carrying the token and the new password and nothing else, got ' + (p ? J(Object.keys(p.b)) : 'no request'));
    ok(c.open && c.head === 'Set a new password' && c.msg === 'This link has expired. Ask for a new one.' && c.msgKind === 'fail'
      && c.status === c.msg && c.statusKind === 'fail', 'a refused token says so in plain words and the screen stays, got ' + J([c.head, c.msg, c.status]));
    ok(c.pw.length === 2 && c.pw[0].val === 'new-password-1' && c.pw[1].val === 'new-password-1' && c.saveOn,
      'with what was typed still in both fields, and Save ready again');
    await shot(pg, 'reset-refused-1600.png');

    await pg.evaluate(() => { window.__api = AUTH_API; AUTH_API = 'http://127.0.0.1:1'; });
    before = posts().length;
    await pg.evaluate(() => __press('Save'));
    c = await pg.evaluate(t => __card(t), T);
    await pg.evaluate(() => { AUTH_API = window.__api; });
    ok(c.open && c.msg === 'Could not reach the server. Check the connection and try again.' && c.status === c.msg && c.statusKind === 'fail'
      && c.pw.length === 2 && c.pw[0].val === 'new-password-1', 'no network says so, holds, and keeps what was typed, got ' + J(c.msg));

    mode = 'many'; before = posts().length;
    await pg.evaluate(() => __press('Save'));
    c = await pg.evaluate(t => __card(t), T);
    ok(posts().length === before + 1 && c.open && c.msg === 'Too many attempts. Wait fifteen minutes.' && c.status === c.msg && c.statusKind === 'fail',
      'a rate limit says the server\'s own words and the screen stays, got ' + J(c.msg));

    mode = 'good'; before = posts().length;
    await pg.evaluate(() => __press('Save'));
    c = await pg.evaluate(t => __card(t), T);
    ok(posts().length === before + 1, 'the press that succeeds sends one request too, got ' + (posts().length - before));
    ok(c.open && c.head === 'New password saved' && c.status === 'New password saved. Signed in as probe@example.invalid.'
      && c.statusKind === 'ok' && c.text.indexOf('Signed in as probe@example.invalid.') >= 0,
      'a yes says so in plain words, on the card and the status line, got ' + J([c.head, c.status]));
    ok(/"token":"t-reset"/.test(c.session) && c.session.indexOf('t-old') < 0, 'and signs the person in with the session the server sent, got ' + c.session.slice(0, 80));
    ok(c.buttons.join() === 'Continue' && c.focusText === 'Continue', 'the card shows the one next step, with focus on it, got ' + J([c.buttons, c.focusText]));
    ok(!c.inDom && !c.store.length && !c.inLog, 'and the token is still in no markup, no storage and no status line, got ' + J([c.inDom, c.store, c.inLog]));
    const pwStored = await pg.evaluate(() => { let h = false; for (let i = 0; i < localStorage.length; i++) {
      if ((localStorage.getItem(localStorage.key(i)) || '').indexOf('new-password-1') >= 0) h = true; } return h; });
    ok(!pwStored, 'the new password reaches no storage');
    await shot(pg, 'reset-saved-1600.png');
    /* the press has to have found the control: a card that never opened is
       also a card that is not open, and read alone that passed at base */
    const went = await pg.evaluate(() => __press('Continue'));
    c = await pg.evaluate(t => __card(t), T);
    ok(went && !c.open, 'Continue closes the card and goes on into the instrument');
    await cx.close();
  }

  console.log('\n=== the same screen at 390, the way back, and the forgotten password ===');
  {
    const cx = await ctx(390, 844), pg = await cx.newPage();
    pg.on('pageerror', e => errs.push(String(e && e.message || e)));
    const T = tok();
    await pg.goto(BASE + '/atuned.html?reset=' + T, { waitUntil: 'load' }); await booted(pg);
    await pg.waitForTimeout(400);
    let c = await pg.evaluate(t => __card(t), T);
    ok(c.open && c.head === 'Set a new password' && c.href.indexOf(T) < 0, 'at 390 the link opens the screen and the address is clean, got ' + J(c.head));
    const taps = await pg.evaluate(() => __taps());
    const wide = await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    ok(c.open && taps.length > 0 && taps.every(t => t.w >= 44 && t.h >= 44 && t.right <= 390), 'every control is at least 44 pixels each way and inside the screen at 390, got ' + J(taps));
    ok(wide, 'and nothing scrolls sideways at 390');
    await shot(pg, 'reset-open-390.png');
    const back = await pg.evaluate(() => __press('Back to log in'));
    c = await pg.evaluate(t => __card(t), T);
    ok(back && c.open && c.head === 'Log in', 'Back to log in opens the log in card, got ' + J(c.head));
    /* the forgotten password, through the log in card the way a person reaches
       it, for an address with an account and one without */
    const forgot = async mail => pg.evaluate(async m => {
      if (!__btn('Forgot your password?') && !__btn('Back to log in')) return null;
      if (__btn('Forgot your password?')) __btn('Forgot your password?').click();
      const f = document.querySelector('#login input[type=email]'); if (!f) return null; f.value = m;
      await __press('Send the link');
      const g = document.getElementById('loginmsg'); return g ? g.textContent : null; }, mail);
    const before = seen.length;
    const one = await forgot('probe@example.invalid');
    const two = await forgot('nobody@example.invalid');
    const sent = seen.slice(before).filter(s => s.m === 'POST' && s.u === '/v1/auth/forgot').map(s => s.b.email);
    ok(one === 'If an account uses that email, a link to set a new password is on its way.' && two === one,
      'the forgotten password says one sentence whether or not an account uses the address, got ' + J([one, two]));
    ok(sent.join() === 'probe@example.invalid,nobody@example.invalid', 'and each request reached the server, once, got ' + J(sent));
    await cx.close();
  }

  console.log('\n=== the token in the hash, and a copy opened from disk ===');
  {
    const cx = await ctx(1600, 1000), pg = await cx.newPage();
    pg.on('pageerror', e => errs.push(String(e && e.message || e)));
    const T = tok();
    await pg.goto(BASE + '/atuned.html#reset=' + T, { waitUntil: 'load' }); await booted(pg);
    let c = await pg.evaluate(t => __card(t), T);
    ok(c.open && c.head === 'Set a new password' && c.href.indexOf(T) < 0 && c.hash === '', 'a token after # opens the screen and leaves the address too, got ' + J([c.head, c.hash]));
    mode = 'bare';
    await pg.evaluate(() => __press('Save', 'new-password-3', 'new-password-3'));
    c = await pg.evaluate(t => __card(t), T);
    const mail = await pg.evaluate(() => (document.querySelector('#login input[type=email]') || {}).value || '');
    ok(c.open && c.head === 'Log in' && c.msg === 'New password saved. Log in with it.' && mail === 'probe@example.invalid' && c.session === '',
      'a yes that carries no session is not said as a sign in: it sends the person to log in with the email filled, got ' + J([c.head, c.msg, mail, c.session]));
    mode = 'good';
    const D = tok();
    await pg.goto('about:blank');
    await pg.goto('file://' + SRC + '?reset=' + D, { waitUntil: 'load' }); await booted(pg);
    c = await pg.evaluate(t => __card(t), D);
    ok(c.open && c.head === 'Set a new password' && c.href.indexOf(D) < 0, 'a copy opened from disk opens the screen and cleans the address, got ' + J([c.head, c.href.slice(-60)]));
    await cx.close();
  }

  ok(worker.length === 0, 'nothing reached the real server, got ' + J(worker));
  ok(errs.length === 0, 'no page errors across the walk: ' + errs.join(' | '));
  await browser.close();
  await new Promise(r => stub.close(r));
  console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed =====');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); console.log('  FAIL  the gate itself threw, which is not a pass'); process.exit(1); });
