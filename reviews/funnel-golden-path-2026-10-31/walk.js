#!/usr/bin/env node
/* The golden path by hand, 31 October. Not a gate. A walk of the deployed
   layout (deploy.yml lines 654-663) served on 127.0.0.1, a person's presses,
   a fake Worker written here from the contract (independent of tests/golden.js
   so the two cannot share a bug), every other host cut and counted.
   usage: node walk.js W H OUTDIR [REPO] */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), http = require('http'), zlib = require('zlib');
const W = +process.argv[2] || 1600, H = +process.argv[3] || 1000;
const OUT = path.resolve(process.argv[4] || 'out-' + W);
const REPO = path.resolve(process.argv[5] || '.');
const MOBILE = W < 600;
fs.mkdirSync(OUT, { recursive: true });
const E = require(path.join(REPO, 'engine.js'));
const API = 'https://worker.walk.test';
const MAIL = 'walk.' + W + '@example.com', PW = 'a long enough password 7';
const STORY = 'My sister called on Sunday and told me I never show up for the family. My chest went tight and my jaw locked and I said nothing. After the call I felt heavy in my stomach for the rest of the night.';

const log = [], fails = [], notes = [];
const say = m => { log.push(m); console.log(m); };
const check = (c, m, detail) => { say((c ? '  PASS  ' : '  FAIL  ') + m + (detail !== undefined ? '  ' + JSON.stringify(detail) : '')); if (!c) fails.push(m); return !!c; };
const note = m => { notes.push(m); say('  NOTE  ' + m); };
const BAD = /\bundefined\b|\bNaN\b|\[object |\bnull\b|Infinity/;

/* ---------- the site, laid out as deploy.yml lays it out ---------- */
function site() {
  const dir = fs.mkdtempSync(path.join(OUT, 'deploy-'));
  const d = path.join(REPO, 'funnel', 'dist');
  for (const f of ['atuned-funnel.html', 'atuned-quiz.html', 'atuned-about.html', 'atuned-buy.html', 'atuned-faq.html',
    'privacy.html', 'terms.html', 'consumer-health-data.html']) fs.copyFileSync(path.join(d, f), path.join(dir, f));
  fs.copyFileSync(path.join(REPO, 'source.html'), path.join(dir, 'atuned.html'));
  fs.copyFileSync(path.join(d, 'atuned-funnel.html'), path.join(dir, 'index.html'));
  const misses = [];
  const srv = http.createServer((q, s) => {
    let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p === '/') p = '/index.html';
    const f = path.join(dir, path.basename(p));
    if (fs.existsSync(f)) { s.writeHead(200, { 'content-type': /\.html$/.test(f) ? 'text/html; charset=utf-8' : 'application/octet-stream' }); s.end(fs.readFileSync(f)); return; }
    misses.push(q.url); s.writeHead(404); s.end('not here');
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r({ srv, dir, misses, origin: 'http://127.0.0.1:' + srv.address().port })));
}

/* ---------- a fake Worker, from the contract in ui/auth.js ---------- */
function worker(origin) {
  const st = { acc: {}, tok: {}, fun: {}, reqs: [] };
  let n = 0; const id = p => p + '_' + (++n) + Math.random().toString(36).slice(2, 8);
  const cors = { 'access-control-allow-origin': origin, 'access-control-allow-headers': 'authorization, content-type, x-funnel-credential',
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS' };
  const j = (status, body) => ({ status, headers: Object.assign({ 'content-type': 'application/json' }, cors), body: JSON.stringify(body) });
  function handle(method, url, headers, raw) {
    const p = new URL(url).pathname; let b = null; try { b = raw ? JSON.parse(raw) : null; } catch (e) {}
    const m = /^Bearer\s+(.+)$/i.exec(headers.authorization || ''); const me = m && st.tok[m[1]] ? st.acc[st.tok[m[1]]] : null;
    const rec = { method, p, body: b, origin: headers.origin || null }; st.reqs.push(rec);
    const r = (() => {
      if (method === 'OPTIONS') return { status: 204, headers: cors, body: '' };
      if (method === 'POST' && p === '/v1/auth/signup') {
        if (!b || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email || '') || String(b.password || '').length < 8) return j(400, { error: 'bad' });
        if (Object.values(st.acc).some(a => a.email === b.email.toLowerCase())) return j(409, { error: 'exists' });
        const a = { id: id('acc'), email: b.email.toLowerCase(), pw: b.password, plan: 0 }; st.acc[a.id] = a;
        const t = id('tok'); st.tok[t] = a.id; return j(201, { token: t, account: { id: a.id, plan: 0, email: a.email } });
      }
      if (method === 'POST' && p === '/v1/funnel/session') {
        const s = { id: id('fs'), anonymousId: b && b.anonymousId, credential: id('c').padEnd(64, '0'), version: 1, gift: true };
        st.fun[s.id] = s; return j(201, { session: { id: s.id, anonymousId: s.anonymousId, version: 1 }, credential: s.credential });
      }
      const fm = /^\/v1\/funnel\/session\/([^/]+)(\/attach|\/checkpoint)?$/.exec(p);
      if (fm) { const s = st.fun[decodeURIComponent(fm[1])]; if (!s) return j(404, { error: 'no session' });
        if (fm[2] === '/attach') { if (!me) return j(401, { error: 'sign in' }); if (!b || b.credential !== s.credential) return j(401, { error: 'cred' });
          s.userId = me.id; return j(200, { session: { id: s.id, userId: me.id } }); }
        if (fm[2] === '/checkpoint') { Object.assign(s, b || {}); return j(200, { session: { id: s.id } }); }
        return j(200, { session: { id: s.id, userId: s.userId || null } }); }
      if (!me && /^\/v1\/(me|billing|auth\/signout|voice)/.test(p)) return j(401, { error: 'sign in first' });
      if (method === 'GET' && p === '/v1/me') return j(200, { account: { id: me.id, plan: 0, email: me.email }, consent: { share: false, at: null, v: 1 }, records: 0, entitlement: null, billing: null });
      if (method === 'POST' && p === '/v1/auth/signout') return j(200, { ok: true });
      return j(404, { error: 'not found' });
    })();
    rec.status = r.status; return r;
  }
  return { st, handle };
}

/* ---------- helpers ---------- */
async function shot(page, name, full) { const f = path.join(OUT, name + '-' + W + '.png'); await page.screenshot({ path: f, fullPage: !!full }); return f; }
async function brokenImages(page) {
  return page.evaluate(() => Array.from(document.images).filter(i => i.getBoundingClientRect().width > 0 && (!i.complete || i.naturalWidth === 0)).map(i => (i.src || '').slice(0, 80)));
}
async function sideScroll(page) { return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); }
async function visText(page, sel) { return page.evaluate(s => { const e = document.querySelector(s); return e ? e.innerText : null; }, sel); }

/* THE DEAD CONTROL PROBE. A press is live if it changes the document (markup
   with style attributes and canvases set aside, so animation is not counted),
   the address, the scroll, or focus. Natural drift is measured first with no
   press, so a page that moves on its own is named rather than read as live.
   Checked against a known dead and a known live button before it is used. */
async function sig(page) {
  return page.evaluate(() => {
    const c = document.body.cloneNode(true); c.querySelectorAll('canvas').forEach(x => x.remove());
    c.querySelectorAll('[style]').forEach(x => x.removeAttribute('style'));
    const h = c.innerHTML; let k = 0; for (let i = 0; i < h.length; i++) k = (k * 31 + h.charCodeAt(i)) | 0;
    return [k, location.href, Math.round(scrollY), document.activeElement && document.activeElement.outerHTML.slice(0, 60)].join('|');
  });
}
async function pressDiff(page, handleFn) {
  const a = await sig(page); await page.waitForTimeout(500); const a2 = await sig(page);
  const drift = a !== a2;
  const h = await handleFn(); if (!h) return { missing: true };
  /* focus alone is not a change a person sees; compare without it */
  const strip = s => s.split('|').slice(0, 3).join('|');
  await h.scrollIntoViewIfNeeded().catch(() => {});
  /* SECOND CUT, after the first lied: the page snaps between frames on its
     own scroll, so a press read while the scroll was still settling counted
     the snap as the press. The scroll is let settle first, and only markup
     and address count; a scroll alone is recorded beside it. */
  let y = -1, same = 0; for (let k = 0; k < 30 && same < 3; k++) { const y2 = await page.evaluate(() => scrollY); same = y2 === y ? same + 1 : 0; y = y2; await page.waitForTimeout(120); }
  const mk = s => s.split('|').slice(0, 2).join('|');
  const b0 = await sig(page);
  try { await h.click({ timeout: 3000 }); } catch (e) { return { err: String(e.message).slice(0, 80) }; }
  await page.waitForTimeout(450);
  const b1 = await sig(page);
  return { live: mk(b0) !== mk(b1), scrolled: strip(b0) !== strip(b1) && mk(b0) === mk(b1), drift };
}

(async () => {
  const S = await site();
  const wk = worker(S.origin);
  const cut = [], pageErrs = [], conErrs = [], failedReq = [];
  const browser = await chromium.launch({ executablePath: process.env.CHROME || path.join(process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers', 'chromium-1194/chrome-linux/chrome') });
  const ctx = await browser.newContext(Object.assign({ viewport: { width: W, height: H } }, MOBILE ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}));
  await ctx.route('**/*', async r => { const q = r.request(), u = q.url();
    if (u.startsWith(S.origin + '/')) return r.continue();
    if (u.startsWith(API + '/')) return r.fulfill(wk.handle(q.method(), u, q.headers(), q.postData()));
    if (/^(data|blob):/.test(u)) return r.continue();
    cut.push(q.method() + ' ' + u.slice(0, 100)); return r.abort('blockedbyclient'); });
  await ctx.addInitScript(api => { Object.defineProperty(window, 'AUTH_API', { get() { return api; }, set() {}, configurable: false }); }, API);
  const page = await ctx.newPage();
  page.on('pageerror', e => pageErrs.push(page.url().split('/').pop().split('#')[0] + ': ' + String(e.message || e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error') conErrs.push(page.url().split('/').pop().split('#')[0] + ': ' + m.text().slice(0, 200)); });
  page.on('requestfailed', q => { const u = q.url(); if (u.startsWith(S.origin)) failedReq.push(u); });
  page.on('dialog', d => d.dismiss().catch(() => {}));

  /* ================= 0. THE PROBE, AGAINST KNOWN CASES ================= */
  say('\n== 0. the dead control probe, against a known dead and a known live button');
  await page.goto(S.origin + '/', { waitUntil: 'load' }); await page.waitForTimeout(800);
  /* at the top of the page, and again mid page inside a scroll-snapped
     frame, which is the condition the first cut of this probe lied under */
  await page.evaluate(() => { const mkp = (at, sfx) => { const d = document.createElement('div');
    d.innerHTML = '<button id="__dead' + sfx + '">dead</button><button id="__live' + sfx + '" onclick="this.textContent=\'pressed\'">live</button>';
    at === 'top' ? document.body.prepend(d) : document.getElementById('name').appendChild(d); }; mkp('top', 'T'); mkp('name', 'M'); });
  const pd = await pressDiff(page, () => page.$('#__deadT')), pl = await pressDiff(page, () => page.$('#__liveT'));
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
  const pdm = await pressDiff(page, () => page.$('#__deadM'));
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
  const plm = await pressDiff(page, () => page.$('#__liveM'));
  check(pd.live === false && pl.live === true && pdm.live === false && plm.live === true, 'the probe reads a dead button as dead and a live one as live, at the top and mid page', { pd, pl, pdm, plm });

  /* ================= 1. THE LANDING ================= */
  say('\n== 1. the funnel landing, ' + W + ' wide');
  await page.goto(S.origin + '/', { waitUntil: 'load' }); await page.waitForTimeout(1500);
  await shot(page, '01-landing');
  await shot(page, '01-landing-full', true);
  check((await sideScroll(page)) <= 0, 'the landing does not scroll sideways', await sideScroll(page));
  check((await brokenImages(page)).length === 0, 'no broken image on the landing', await brokenImages(page));
  const landTxt = await visText(page, 'body');
  check(!BAD.test(landTxt), 'no undefined, NaN, null or [object on the landing', (landTxt.match(BAD) || [])[0]);
  /* every link resolves */
  const links = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')));
  const badLinks = links.filter(h => { if (/^(https?:|mailto:|tel:|sms:)/.test(h)) return false;
    if (h[0] === '#') return h.length > 1 && false; return !fs.existsSync(path.join(S.dir, h.split('#')[0])); });
  const hashMiss = await page.evaluate(() => Array.from(document.querySelectorAll('a[href^="#"]')).map(a => a.getAttribute('href')).filter(h => h.length > 1 && !document.getElementById(h.slice(1))));
  check(badLinks.length === 0 && hashMiss.length === 0, 'every link on the landing points at a file or an anchor that exists', { badLinks, hashMiss });
  const ext = links.filter(h => /^https?:/.test(h)); if (ext.length) note('landing links off site: ' + JSON.stringify(ext));
  /* every visible button, pressed on a fresh load */
  const btns = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map((b, i) => { const r = b.getBoundingClientRect(), cs = getComputedStyle(b);
    return { i, t: (b.innerText || b.getAttribute('aria-label') || '').trim().slice(0, 40), vis: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' }; }).filter(b => b.vis));
  say('  ' + btns.length + ' visible buttons on the landing at load');
  const dead = [], drifting = [];
  for (const b of btns) {
    await page.goto(S.origin + '/', { waitUntil: 'load' }); await page.waitForTimeout(600);
    const r = await pressDiff(page, () => page.evaluateHandle(i => document.querySelectorAll('button')[i], b.i).then(h => h.asElement()));
    if (r.drift) drifting.push(b.t);
    if (!r.live) dead.push(b.t + (r.err ? ' (' + r.err + ')' : r.scrolled ? ' (scroll only)' : ''));
  }
  check(dead.length === 0, 'every visible button on the landing does something when pressed', dead);
  if (drifting.length) note('the landing moves by itself under ' + drifting.length + ' buttons (animation), the probe compared press against press-time only');

  /* ================= 2. THE QUIZ ================= */
  say('\n== 2. the quiz, from the landing\'s own door');
  await page.goto(S.origin + '/', { waitUntil: 'load' }); await page.waitForTimeout(600);
  const door = await page.$('a.go[href="atuned-quiz.html"]') || await page.$('a[href="atuned-quiz.html"]');
  check(!!door, 'the landing has a Take quiz door');
  await door.click(); await page.waitForURL(/atuned-quiz/, { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(500);
  check(/atuned-quiz\.html/.test(page.url()), 'the door opens the quiz', page.url());
  await shot(page, '02-quiz-open');
  check((await sideScroll(page)) <= 0, 'the quiz opening does not scroll sideways', await sideScroll(page));
  const total = await page.evaluate(() => QQ.length);
  await page.click('#go');
  /* the signal, answered as a person would, not skipped */
  await page.click('.sigopts .opt[data-where="Chest"]'); await page.waitForTimeout(150);
  await page.click('.sigopts .opt[data-what="0"]'); await page.waitForTimeout(150);
  const seen = await visText(page, '.sigseen');
  check(!!seen && /There it is/.test(seen), 'the signal says back what was noticed', (seen || '').split('\n').slice(0, 2).join(' / '));
  await shot(page, '02-quiz-signal-seen');
  await page.click('#sigstart');
  /* a hundred answers, weighted to the middle the way a real week is */
  let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const pick = () => { const x = rnd(); return x < .1 ? 0 : x < .3 ? 1 : x < .65 ? 2 : x < .9 ? 3 : 4; };
  let presses = 0, stuck = null;
  for (let i = 0; i < total + 3; i++) {
    if (await page.evaluate(() => STATE) !== 'q') break;
    if (i === 40) await shot(page, '02-quiz-question-41');
    const v = pick();
    try { await page.click('.opt[data-v="' + v + '"]', { timeout: 3000 }); presses++; } catch (e) { stuck = i; break; }
  }
  const qs = await page.evaluate(() => ({ answered: answered(), state: STATE }));
  check(qs.answered === total && qs.state === 'read' && stuck === null, 'every question answered by its own buttons, and the last opens the reading', { presses, total, qs, stuck });

  /* ================= 3. THE QUIZ'S OWN READING ================= */
  say('\n== 3. the reading, layer by layer');
  await shot(page, '03-reading-layer1');
  let layers = 1, guard = 0;
  while (await page.$('#more') && guard++ < 10) { await page.click('#more'); await page.waitForTimeout(300); layers++; await shot(page, '03-reading-layer' + layers); }
  check(layers === 5, 'Keep reading opens five layers, one at a time', layers);
  await shot(page, '03-reading-full', true);
  const read = await page.evaluate(() => {
    const sec = Array.from(document.querySelectorAll('section.layer')).map(s => ({ n: s.dataset.layer, head: (s.querySelector('h1,h2') || {}).innerText, len: s.innerText.trim().length }));
    const cq = document.querySelector('.cq b'), tier = document.querySelector('.cq span');
    const lawsEm = Array.from(document.querySelectorAll('ul.laws em')).map(e => e.textContent);
    const seatsEm = Array.from(document.querySelectorAll('ul.seats em')).map(e => e.textContent);
    return { sec, cq: cq && cq.textContent, tier: tier && tier.textContent, lawsEm, seatsEm, txt: document.querySelector('.read').innerText };
  });
  check(read.sec.every(s => s.len > 80), 'each layer carries real text, not an empty box', read.sec.map(s => s.n + ':' + s.len));
  check(!BAD.test(read.txt), 'the reading prints no undefined, NaN, null or [object', (read.txt.match(BAD) || [])[0]);
  check(/^\d+$/.test(read.cq || '') && !!read.tier, 'the reading prints a coherence figure and its tier word', { cq: read.cq, tier: read.tier });
  check(/That is your coherence\. One hundred is/.test(read.txt), 'the figure is explained beside it (what it is, what 100 means)');
  const engineCQ = await page.evaluate(() => read(scored().p).reading.CQ);
  check(Math.round(engineCQ) === +read.cq, 'the figure printed is the engine\'s own CQ', { printed: read.cq, engine: engineCQ });
  /* the percent rule, PERCENT-FRAMEWORK-2026-10-16.md rule 6 and phase 2 slice 6 */
  const pctOK = /%$/.test(read.cq || '');
  check(pctOK, 'house percent rule: CQ prints as N% (PERCENT-FRAMEWORK rule 6)', { printed: read.cq, fmtPct: await page.evaluate(c => typeof fmtPct === 'function' ? fmtPct('cq', c) : 'no fmtPct', engineCQ) });
  check(read.lawsEm.every(x => /%$/.test(x)) && read.seatsEm.every(x => /%$/.test(x)), 'house percent rule: law and seat scores print as percent, not 0.0 out of ten (rule 1, the "6.2" example)', { laws: read.lawsEm, seats: read.seatsEm });
  check((await sideScroll(page)) <= 0, 'the reading does not scroll sideways', await sideScroll(page));
  check((await brokenImages(page)).length === 0, 'no broken image in the quiz', await brokenImages(page));

  /* the story, as a person would write one, then the door */
  say('\n== 3b. a story in the quiz, then the door');
  await page.click('#tostory'); await page.waitForTimeout(250);
  await page.fill('#storytx', STORY); await page.click('#readit'); await page.waitForTimeout(500);
  const lit = await visText(page, '#lit');
  check(!!lit && lit.length > 40 && !BAD.test(lit), 'the story is read and says what it lit', (lit || '').split('\n').slice(0, 3).join(' / '));
  await shot(page, '03b-story-lit', true);
  await page.click('#todoor'); await page.waitForTimeout(300);
  const armed = await page.waitForSelector('#tolink[data-ready="1"]', { timeout: 10000 }).then(() => true, () => false);
  check(armed, 'Open the app with my record is armed with the record');
  await shot(page, '03c-door', true);
  const link = await page.evaluate(() => document.getElementById('tolink').href);
  let carried = null; try { carried = JSON.parse(zlib.gunzipSync(Buffer.from(E.linkUnwrap(link.split('#r=')[1]))).toString('utf8')); } catch (e) {}
  check(!!carried && carried.laws && Object.keys(carried.laws).length === 21, 'the link carries a whole record with its 21 laws', carried ? Object.keys(carried.laws || {}).length : 'unreadable');
  check(wk.st.reqs.length === 0 && cut.length === 0, 'the funnel sent nothing to any server on the way', { worker: wk.st.reqs.length, cut });
  /* the other door on the page, for the record */
  const toapp = await page.evaluate(() => { const a = document.getElementById('toapp'); return a && a.getAttribute('href'); });
  check(toapp === 'atuned.html', 'the plain Open the app door points at the deployed app name', toapp);

  /* ================= 4. ACCOUNT, AT THE APP'S DOOR ================= */
  say('\n== 4. the app opened from the link, and Create account');
  await page.click('#tolink');
  await page.waitForURL(/atuned\.html/, { timeout: 15000 }).catch(() => {});
  await page.waitForFunction(() => document.body.classList.contains('booted') && typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 }).catch(() => {});
  const msg = await page.waitForFunction(() => { const l = document.getElementById('loginmsg'); return l && /from the link/.test(l.textContent) ? l.textContent : null; }, null, { timeout: 12000 }).then(h => h.jsonValue(), () => null);
  await page.waitForTimeout(600);
  await shot(page, '04-app-door');
  check(!!msg, 'the app opens with its door standing and says the record arrived', msg);
  const atDoor = await page.evaluate(() => ({ login: !!(typeof LOGIN !== 'undefined' && LOGIN.open), hash: location.hash, name: CURP && CURP.name,
    btns: Array.from(document.querySelectorAll('#loginb-go,#loginb-new,#loginb-skip')).map(b => b.innerText) }));
  check(atDoor.login && atDoor.hash === '', 'the door is up and the record is off the address bar', atDoor);
  await page.fill('#loginmail', MAIL); await page.fill('#loginpass', PW);
  await shot(page, '04-app-door-filled');
  await page.click('#loginb-new');
  await page.waitForFunction(() => typeof LOGIN !== 'undefined' && !LOGIN.open, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1200);
  const made = await page.evaluate(() => (typeof MSG_LOG !== 'undefined' ? MSG_LOG.map(m => m.msg) : []).filter(m => /Account created/.test(m)));
  const signups = wk.st.reqs.filter(q => q.p === '/v1/auth/signup' && q.method === 'POST');
  check(signups.length === 1 && signups[0].status === 201 && signups[0].body.email === MAIL, 'one sign up reached the server with the typed email and was made', signups.map(s => s.status));
  check(made.length > 0, 'the app says the account was made', made);
  const after = await page.evaluate(() => {
    const R = compute(); const vis = id => { const e = document.getElementById(id); return !!(e && e.offsetParent !== null && e.getBoundingClientRect().height > 0); };
    const held = (() => { try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch (e) { return null; } })();
    return { login: !!(typeof LOGIN !== 'undefined' && LOGIN.open), ob: !!(typeof OB !== 'undefined' && OB.open), tab: S.tab, SUM: TAB.SUMMARY, sumVis: vis('sum'),
      unread: !!R.unread, CQ: R.CQ, laws: CURP && CURP.laws, name: CURP && CURP.name, held: !!(held && held.token), email: held && held.email };
  });
  check(!after.login && !after.ob, 'the door closes and no onboarding asks again what the quiz asked', { login: after.login, ob: after.ob });
  check(after.held && after.email === MAIL, 'the sign in is held in this browser', after.email);
  check(after.tab === after.SUM && after.sumVis, 'first arrival from the funnel lands on Summary (9 October ruling)', { tab: after.tab, SUMMARY: after.SUM, sumVisible: after.sumVis });
  check(!after.unread, 'Summary has a reading, not the empty four doors', { unread: after.unread });
  check(JSON.stringify(after.laws) === JSON.stringify(carried && carried.laws), 'the 21 laws in the app are the laws the quiz scored');
  check(Math.round(after.CQ) === +read.cq, 'the app\'s coherence is the quiz\'s', { app: after.CQ, quiz: read.cq });
  await page.waitForTimeout(1500);
  await shot(page, '05-summary');
  await shot(page, '05-summary-full', true);
  const sumTxt = await visText(page, '#sum');
  check(!!sumTxt && sumTxt.trim().length > 200, 'Summary carries real text', (sumTxt || '').length);
  check(!BAD.test(sumTxt || ''), 'Summary prints no undefined, NaN, null or [object', ((sumTxt || '').match(BAD) || [])[0]);
  fs.writeFileSync(path.join(OUT, 'summary-text-' + W + '.txt'), sumTxt || '');
  fs.writeFileSync(path.join(OUT, 'reading-text-' + W + '.txt'), read.txt || '');
  const plate = await page.evaluate(() => { const v = document.querySelector('#sum .cr[title^="Coherence"] .v'); const R = compute(), c = accCover(R);
    return { v: v && v.textContent, complete: !!c.complete, want: fmtPct('cq', R.CQ) }; });
  check(plate.complete ? plate.v === plate.want : /^(early|partial)$/.test(plate.v || ''), 'the Summary coherence plate prints a percent once all laws are answered, a word before', plate);
  const storyInApp = await page.evaluate(s => JSON.stringify(CURP).indexOf(s.slice(0, 30)) >= 0, STORY);
  note('the quiz story is ' + (storyInApp ? '' : 'not ') + 'in the app record (the quiz door says "Your story is not in it", by design)');
  check((await sideScroll(page)) <= 0, 'Summary does not scroll sideways', await sideScroll(page));
  check((await brokenImages(page)).length === 0, 'no broken image in the app', await brokenImages(page));

  /* ================= 5. AFTER: RELOAD, AND "ONCE" ================= */
  say('\n== 5. reload, and the first landing happens once');
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => document.body.classList.contains('booted') && isBooted(), null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1200);
  const r1 = await page.evaluate(() => ({ login: !!LOGIN.open, tab: S.tab, name: CURP && CURP.name, laws: CURP && CURP.laws }));
  check(!r1.login && r1.name === after.name && JSON.stringify(r1.laws) === JSON.stringify(after.laws), 'after a reload: still signed in, same record, same laws', { login: r1.login, name: r1.name });
  check(r1.tab === after.SUM, 'and still on Summary, where they left off', r1.tab);
  await page.evaluate(() => { const b = document.querySelector('[data-tabk="' + TAB.STORY + '"]'); if (b) b.click(); });
  await page.waitForTimeout(500);
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => document.body.classList.contains('booted') && isBooted(), null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1200);
  const r2 = await page.evaluate(() => ({ tab: S.tab, STORY: TAB.STORY }));
  check(r2.tab === r2.STORY, 'left on Discover, a reload opens Discover, not Summary again (once only)', r2);
  await shot(page, '06-reload-discover');

  /* ================= 6. WHAT ELSE HAPPENED ================= */
  say('\n== 6. errors and the network');
  const fun = wk.st.reqs.filter(q => /funnel\/session/.test(q.p)).map(q => q.method + ' ' + q.p.replace(/fs_[^/]+/, 'ID') + ' ' + q.status);
  say('  first visit calls: ' + JSON.stringify(fun));
  say('  all worker calls: ' + JSON.stringify(wk.st.reqs.map(q => q.method + ' ' + q.p.replace(/fs_[^/]+/, 'ID') + ' ' + q.status)));
  check(pageErrs.length === 0, 'no page error anywhere on the walk', pageErrs);
  check(conErrs.filter(t => !/Failed to load resource|ERR_BLOCKED/.test(t)).length === 0, 'no console error anywhere on the walk', conErrs);
  check(failedReq.length === 0 && S.misses.length === 0, 'no request to the site failed and nothing asked for a file that is not deployed', { failedReq, misses: S.misses });
  check(cut.length === 0, 'nothing reached for any other host', cut);

  say('\n===== ' + W + 'x' + H + ': ' + (log.filter(l => /PASS/.test(l)).length) + ' passed, ' + fails.length + ' failed =====');
  fs.writeFileSync(path.join(OUT, 'walk-' + W + '.json'), JSON.stringify({ W, H, fails, notes, log }, null, 1));
  await browser.close(); S.srv.close();
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.log('CRASH ' + (e && e.stack || e)); process.exit(2); });
