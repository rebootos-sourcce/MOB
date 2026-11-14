#!/usr/bin/env node
/* ============================================================
   THE PAYWALL AND THE CANCELLATION, PHOTOGRAPHED. The owner, 17 October:
   "There are full screens that I haven't approved yet. Can you show me the
   paywall image? And I also want to see what the cancel process is like."

   This drives the real build in a real Chromium, the way tests/quit.js and
   tests/locks.js do, and photographs every frame of both sequences at 1600 by
   1000 and 390 by 844. It changes nothing in the product. Every word in a
   picture is the build's own; this file only sets up the state a person would
   be in and presses what they would press.

     NODE_PATH=/opt/node22/lib/node_modules \
       node mockups/paywall-storyboard/capture.js [path/to/source.html]

   THE SERVER IS A STUB, in the live Worker's own words. Each answer below is
   copied from Reboot-OS main (atuned/server/src), with the line, so a frame
   shows what atuned.world would say today and not what a test once assumed:

     checkout    503 "paid checkout is not open in this release yet"
                 stripe.js createCheckout, the STRIPE_BILLING_ENABLED switch,
                 which wrangler.toml holds at "0"
     portal      409 "there is no paid plan on this account yet, so there is
                 no billing to manage" for an account that never paid
                 (stripe.js createPortal); a URL for one that did
     delete      the quitAccount shape (index.js): stopped, kept, removed
     forgot      503 "the server cannot send mail yet" (index.js, forgot),
                 because no mail key is set on the server

   The real host is refused at the context and counted, so nothing here can
   reach atuned.world. Writes shots/<frame>-<width>.png and shots/frames.json,
   which carries the exact words each frame said on its status line or in a
   browser dialog, read off the page, for the captions.
   ============================================================ */
const path = require('path'), fs = require('fs'), http = require('http');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..');
const SRC = path.resolve(process.argv[2] || path.join(ROOT, 'source.html'));
const APP = 'file://' + SRC + '?dev=1';
const BUY = 'file://' + path.join(ROOT, 'funnel', 'buy.html');
const TERMS = 'file://' + path.join(ROOT, 'funnel', 'legal', 'terms.html');
const OUT = path.join(__dirname, 'shots');
const WORKER = 'https://atuned-api.lance-o-powell.workers.dev';
fs.mkdirSync(OUT, { recursive: true });

const S1 = '2026-10-01T00:00:00.000Z', U1 = '2026-11-01T00:00:00.000Z';
const ACC = { id: 'acc_board', research_id: 'rsh_board', plan: 1, email: 'sam@example.invalid' };
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type, x-funnel-credential',
  'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS' };
const live = (tier, extra) => Object.assign({ tier, status: 'active', since: S1, until: U1, store: 'stripe', ends: null }, extra || {});
/* what GET /v1/me says the billing is, by session */
const ME = {
  'Bearer t-free': null,
  'Bearer t-one': live('one'), 'Bearer t-two': live('two'), 'Bearer t-three': live('three'),
  'Bearer t-stop': live('one', { ends: U1 }),
  'Bearer t-ended': { tier: 'one', status: 'canceled', since: S1, until: U1, store: 'stripe', ends: U1 },
};
/* index.js quitAccount, for a person Stripe billed, on a server with the first
   visit store configured: the first visit is removed, the activity log and
   Stripe's payment history are kept */
const QUIT = { deleted: true, at: 1, stopped: 1, billedElsewhere: null, kept: ['activity_log', 'payment_history'],
  removed: ['first_visit'], retrying: [], said: [
    'Deleted: your first visit record, which is the topic you picked, when you finished each step, your starter gift and the pass that joined it to the account.',
    'Kept: a dated list of when the account signed up, signed in, paid and was deleted, under a random account id and with no email.',
    'Kept by Stripe, the company that takes the card: its own record of your past payments.'] };
const seen = [];
const stub = http.createServer((req, res) => {
  let raw = ''; req.on('data', d => raw += d); req.on('end', () => {
    const send = (st, b) => { res.writeHead(st, Object.assign({ 'content-type': 'application/json' }, CORS)); res.end(JSON.stringify(b)); };
    if (req.method === 'OPTIONS') { res.writeHead(204, CORS); res.end(); return; }
    const auth = req.headers.authorization || '', u = req.url.split('?')[0], k = req.method + ' ' + u;
    seen.push(k + ' ' + auth);
    if (k === 'GET /v1/me') {
      if (!(auth in ME)) return send(401, { error: 'sign in' });
      return send(200, { account: ACC, consent: { share: false, at: null, v: 1 }, records: 0, entitlement: null, billing: ME[auth] });
    }
    if (k === 'POST /v1/billing/checkout') {
      if (!(auth in ME)) return send(401, { error: 'sign in' });
      return send(503, { error: 'paid checkout is not open in this release yet' });
    }
    if (k === 'POST /v1/billing/portal') {
      if (!(auth in ME)) return send(401, { error: 'sign in' });
      if (!ME[auth]) return send(409, { error: 'there is no paid plan on this account yet, so there is no billing to manage' });
      return send(200, { url: 'about:blank#stripe-portal' });
    }
    if (k === 'DELETE /v1/me') return auth in ME ? send(200, QUIT) : send(401, { error: 'sign in' });
    if (k === 'POST /v1/auth/forgot') return send(503, { error: 'the server cannot send mail yet' });
    if (k === 'POST /v1/auth/signout') return send(200, { ok: true });
    send(404, { error: 'no such route' });
  });
});

const frames = {};
const said = (id, W, key, v) => { frames[id] = frames[id] || {}; frames[id][W] = frames[id][W] || {}; frames[id][W][key] = v; };

(async () => {
  await new Promise(r => stub.listen(0, '127.0.0.1', r));
  const API = 'http://127.0.0.1:' + stub.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const real = [];
  for (const [W, H] of [[1600, 1000], [390, 844]]) {
    const phone = W < 600;
    /* reduced motion so no picture is taken half way through a fade. Nothing
       on these screens changes shape under it, only how fast it arrives. */
    const cx = await browser.newContext({ viewport: { width: W, height: H }, hasTouch: phone, isMobile: phone, reducedMotion: 'reduce' });
    await cx.route(WORKER + '/**', r => { real.push(r.request().url()); r.abort(); });
    await cx.route(/^https:\/\/(?!127\.0\.0\.1)/, r => { real.push(r.request().url()); r.abort(); });
    const pg = await cx.newPage();
    const errs = []; pg.on('pageerror', e => errs.push(e.message));
    let dialog = null;
    pg.on('dialog', d => { dialog = d.message(); d.dismiss(); });
    const shot = async (id, o) => {
      o = o || {};
      /* NO STRAY HOVER OR FOCUS. The pointer is left wherever the last press
         was, and on the phone a tap leaves its row lit, which read as a
         second selected section in the first run of this file. The one frame
         that is about a hover keeps it. */
      if (!o.keep) {
        await pg.mouse.move(0, 0);
        await pg.evaluate(() => { const a = document.activeElement; if (a && a !== document.body && a.blur) a.blur(); });
      }
      await pg.waitForTimeout(o.wait || 350);
      const file = path.join(OUT, id + '-' + W + '.png');
      if (o.full && !phone) {
        /* the whole surface top to bottom. The app is a fixed height shell
           whose panes scroll inside it, so a full page picture at 1600 is
           the same layout on a taller window, measured to fit */
        const need = await pg.evaluate(sel => { const e = document.querySelector(sel); return e ? e.scrollHeight - e.clientHeight : 0; }, o.full);
        await pg.setViewportSize({ width: W, height: H + Math.max(0, need) + 8 });
        await pg.waitForTimeout(300);
        await pg.screenshot({ path: file });
        await pg.setViewportSize({ width: W, height: H });
        await pg.waitForTimeout(200);
      } else await pg.screenshot({ path: file, fullPage: !!o.full });
      const st = await pg.evaluate(() => { const e = document.getElementById('status'); return e ? [e.textContent, e.getAttribute('data-kind') || ''] : ['', '']; });
      said(id, W, 'status', st);
      console.log('  ' + id + '-' + W + (st[0] ? '   status: ' + st[0] : ''));
    };
    const boot = async () => {
      await pg.goto(APP, { waitUntil: 'load' });
      await pg.waitForFunction(() => document.documentElement.getAttribute('data-boot') === 'ok', null, { timeout: 30000 });
      await pg.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 15000 });
      await pg.waitForTimeout(600);
      await pg.evaluate(() => { if (typeof OB !== 'undefined' && OB.open && typeof obClose === 'function') obClose(); });
      await pg.waitForFunction(() => typeof enterOver !== 'function' || enterOver(), null, { timeout: 10000 }).catch(() => null);
      await pg.evaluate(api => {
        AUTH_API = api;
        window.__quiet = () => { status(''); if (typeof msgLogShut === 'function') msgLogShut(); };
        window.__as = (tok) => { if (tok) authKeep({ token: tok, email: 'sam@example.invalid', accountId: 'acc_board' }); else authForget(); };
        window.__billing = () => { ACC_OPEN = 'billing'; setTab(TAB.SETTINGS); renderAccount(); };
        window.__scroll = (sel, block) => { const e = document.querySelector(sel); if (e) e.scrollIntoView({ block: block || 'start' }); };
        /* a plan on the person's own record, written the way the server read
           back writes it (planFromServer) so the record is one a person on
           that plan really holds */
        window.__plan = (b) => { CURP.plan = planFromServer(CURP.plan, b, (CURP.meter && CURP.meter.unique) || []).plan; pSave(); };
      }, API);
    };
    /* the heaviest worked example's reading, on the plan given, which is how
       tests/locks.js puts a chain on screen to lock. loadP gives every worked
       example tier four sight (ui/personas.js), so the plan goes on after it */
    const gordon = async (plan) => {
      await pg.evaluate(plan => {
        const g = PEOPLE.findIndex(x => x.nm === 'Gordon'); loadP(g);
        if (plan) CURP.plan = Object.assign({ granted: 0, carried: 0, base: null, since: null, until: null }, plan);
        S.view = 3; try { LAYSET = null; } catch (e) {}
        setTab(TAB.FIELD); if (typeof fviewSet === 'function') fviewSet('wheel'); render(); __quiet();
      }, plan);
      await pg.waitForTimeout(900);
    };
    /* BACK TO THE TOP OF THE PAGE, after the repaint. The settings pane keeps
       its scroll between frames, so the first run's "Billing, as a new free
       person" opened half way down the ladder, where the frame before it left
       it. */
    const top = async () => {
      await pg.waitForTimeout(300);
      await pg.evaluate(() => { const s = document.getElementById('settings'); if (s) s.scrollTop = 0; window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0; document.body.scrollTop = 0; });
    };
    const own = async () => { await pg.evaluate(() => { loadP(0); setTab(TAB.FIELD); render(); __quiet(); }); await pg.waitForTimeout(500); };

    await boot();

    /* =================== A. THE PAYWALL =================== */
    /* A1. a free person meets a locked layer on the Field */
    await gordon({ tier: 'free', status: '' });
    if (phone) {
      await pg.evaluate(() => fbOpenPanel(true)); await pg.waitForTimeout(400);
      await pg.tap('#fbpanel [data-fb="saboteurs"]', { force: true });
    } else {
      await pg.hover('#fbar .fb-full [data-fb="saboteurs"]');
    }
    await pg.waitForTimeout(900);
    said('a1-field-locked', W, 'tip', await pg.evaluate(() => { const t = document.getElementById('tip'); return t ? t.innerText.replace(/\s+/g, ' ').trim() : ''; }));
    await shot('a1-field-locked', { keep: true });
    await pg.mouse.move(2, H - 2);
    if (phone) await pg.evaluate(() => { if (typeof TIP !== 'undefined' && TIP.hide) TIP.hide(); fbOpenPanel(false); });

    /* A1b. the Character page, which is a whole locked surface */
    await gordon({ tier: 'free', status: '' });
    await pg.evaluate(() => { setTab(TAB.MASKS); render(); __quiet(); });
    await shot('a1b-character-locked', { wait: 900 });

    /* A2. the release panel when the allowance is spent: the person's own
       record, the gift and the week both spent, which is the setup
       tests/functional.js uses for "the release panel quotes a price" */
    await pg.evaluate(async () => {
      loadP(0); CHARGES.forEach(c => { S.charge[c] = 7; });
      CURP.meter = { lines: 110, unique: [], first: null, last: null };
      for (let i = 0; i < 110; i++) CURP.meter.unique.push('seed' + i + ':Rlimit:0');
      CURP.plan = { tier: 'free', status: '', granted: 0, carried: 0, base: 100, since: null, until: null };
      setTab(TAB.FIELD); render(); __quiet();
      relPick(compute().carrying.slice(0, 8).map(n => n.i));
      await new Promise(r => setTimeout(r, 300));
    });
    await shot('a2-release-spent', { wait: 700 });
    said('a2-release-spent', W, 'panel', await pg.evaluate(() => { const h = document.getElementById('rel'); return h ? h.innerText.replace(/\s+/g, ' ').trim() : ''; }));
    /* its one press, See the tiers, lands on Billing at the tiers */
    await pg.click('#relplan');
    await pg.waitForTimeout(800);
    await shot('a2b-see-tiers-lands', { wait: 500 });

    /* A3. Billing and the ladder, as a free person signed in, then on each
       paid rung. The plan comes from the server read back, as it would. */
    await own();
    /* a new person: the gift of a hundred untouched, as A2 left the record spent */
    await pg.evaluate(async () => { CURP.meter = { lines: 0, unique: [], first: null, last: null }; pSave();
      __as('t-free'); await authPlanRead(); __billing(); __quiet(); });
    await top();
    await shot('a3-billing-free');
    await pg.evaluate(() => __scroll('#plantiers'));
    await shot('a3-tiers-free');
    await pg.evaluate(() => __scroll('#plantiers'));
    await shot('a3-tiers-free-full', { full: phone ? true : '#settings' });
    for (const t of ['one', 'two', 'three']) {
      await pg.evaluate(async t => { __as('t-' + t); await authPlanRead(); __billing(); __quiet(); }, t);
      /* the scroll waits for the repaint setTab makes after it returns, the
         same wait planTiersOpen keeps: made at once, it scrolled a node that
         was then replaced, measured at 390 */
      await pg.waitForTimeout(400);
      await pg.evaluate(t => __scroll('#plantiers [data-pt="' + t + '"]', 'center'), t);
      await shot('a3-tiers-' + t, { wait: 500 });
    }

    /* A4. the press. Signed in and free: "Move to tier one" asks the server
       for a checkout, and the server says checkout is closed */
    await pg.evaluate(async () => { __as('t-free'); await authPlanRead(); __billing(); __quiet(); __scroll('#plantiers .pt-list', 'center'); });
    await pg.click('[data-ptier="one"]');
    await pg.waitForFunction(() => /checkout|open/i.test((document.getElementById('status') || {}).textContent || ''), null, { timeout: 6000 }).catch(() => null);
    await shot('a4-press-closed', { wait: 500 });
    /* the same press, signed out */
    await pg.evaluate(() => { __as(null); __billing(); __quiet(); __scroll('#plantiers .pt-list', 'center'); });
    await pg.click('[data-ptier="one"]');
    await pg.waitForTimeout(500);
    await shot('a4b-press-signed-out');
    /* the foot of the ladder, signed out, which says it before the press */
    await pg.evaluate(() => { __quiet(); __scroll('#plantiers .ac-gf', 'end'); });
    await shot('a4c-ladder-foot-signed-out');
    /* Manage billing, signed in and never paid */
    await pg.evaluate(async () => { __as('t-free'); await authPlanRead(); __billing(); __quiet(); __scroll('#planman', 'center'); });
    await pg.click('#planman');
    await pg.waitForFunction(() => /billing/i.test((document.getElementById('status') || {}).textContent || ''), null, { timeout: 6000 }).catch(() => null);
    await shot('a4d-manage-never-paid', { wait: 500 });

    /* A6. before paying: the gift on the release panel, and a worked example
       showing every layer */
    await pg.evaluate(async () => {
      __as(null); loadP(0); CHARGES.forEach(c => { S.charge[c] = 7; });
      CURP.meter = { lines: 0, unique: [], first: null, last: null };
      CURP.plan = { tier: 'free', status: '', granted: 0, carried: 0, base: null, since: null, until: null };
      setTab(TAB.FIELD); render(); __quiet();
      relPick(compute().carrying.slice(0, 2).map(n => n.i));
      await new Promise(r => setTimeout(r, 300));
    });
    await shot('a6-gift-release', { wait: 700 });
    said('a6-gift-release', W, 'numbers', await pg.evaluate(() => ({ left: relLeft(), budget: relBudget(),
      planned: (RUN.plan || []).length, dose: RUN.dose, addresses: RUN.queue.length })));
    said('a6-gift-release', W, 'panel', await pg.evaluate(() => { const h = document.getElementById('rel'); return h ? h.innerText.replace(/\s+/g, ' ').trim() : ''; }));
    await pg.evaluate(() => { if (typeof relClose === 'function') relClose(); else { const x = document.getElementById('relcancel'); if (x) x.click(); } });
    await pg.waitForTimeout(300);
    await gordon(null);
    await shot('a6-example-full-sight', { wait: 700 });

    /* =================== B. THE CANCELLATION =================== */
    await own();
    /* B1. Billing for a person paying for tier one */
    await pg.evaluate(async () => { __as('t-one'); await authPlanRead(); __billing(); __quiet(); });
    await top();
    await shot('b1-billing-paying');
    /* B2. Manage billing: the app asks the server for Stripe's page and the
       browser leaves for it. What is recorded is that it left, and where. */
    const before = seen.length;
    await pg.evaluate(() => { window.__left = null; try { Object.defineProperty(window, '__probe', { value: 1 }); } catch (e) {} });
    await pg.evaluate(() => __scroll('#planman', 'center'));
    await pg.click('#planman');
    await pg.waitForTimeout(800);
    said('b2-manage', W, 'requests', seen.slice(before));
    said('b2-manage', W, 'url', pg.url());
    await boot();
    await own();
    /* B3. back from Stripe after pressing stop there: ?billing=managed, and
       the server now says the day it ends */
    await pg.evaluate(async () => {
      __as('t-stop'); AUTH_PLAN_TRIES = 2; AUTH_PLAN_WAIT_MS = 60;
      __plan({ tier: 'one', status: 'active', since: '2026-10-01T00:00:00.000Z', until: '2026-11-01T00:00:00.000Z', ends: null });
      __billing(); __quiet();
      history.replaceState(null, '', location.pathname + '?dev=1&billing=managed');
      await authCheck();
      await new Promise(r => setTimeout(r, 400));
    });
    await pg.waitForFunction(() => /stops on/.test((document.getElementById('status') || {}).textContent || ''), null, { timeout: 6000 }).catch(() => null);
    await shot('b3-back-stopped', { wait: 300 });
    /* B3b. the account section, where Delete this account is */
    await pg.evaluate(() => { ACC_OPEN = 'account'; renderAccount(); __quiet(); __scroll('#acdelacc', 'center'); });
    await shot('b3b-delete-control');
    /* B3c. its confirm. The browser draws this box itself, outside the page,
       so no screenshot can hold it: the words are read off the real dialog
       and the box is redrawn over the page with exactly those words */
    dialog = null;
    await pg.click('#acdelacc');
    await pg.waitForTimeout(400);
    said('b3c-delete-confirm', W, 'dialog', dialog);
    await pg.evaluate(msg => {
      const d = document.createElement('div'); d.id = '__confirm';
      d.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:flex-start;justify-content:center;z-index:2147483647;padding-top:24px';
      const box = document.createElement('div');
      box.style.cssText = 'background:#2b2b2e;color:#e8e8ea;border:1px solid #4a4a50;border-radius:10px;width:min(448px,calc(100vw - 32px));padding:20px 22px 16px;font:14px/1.5 system-ui,-apple-system,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.6)';
      const hd = document.createElement('div'); hd.textContent = 'This page says'; hd.style.cssText = 'font-weight:600;margin-bottom:10px';
      const tx = document.createElement('div'); tx.textContent = msg; tx.style.cssText = 'white-space:pre-wrap';
      const row = document.createElement('div'); row.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;margin-top:18px';
      for (const [l, p] of [['Cancel', 0], ['OK', 1]]) { const b = document.createElement('span'); b.textContent = l;
        b.style.cssText = 'padding:7px 18px;border-radius:16px;' + (p ? 'background:#8ab4f8;color:#202124' : 'border:1px solid #5f6368;color:#8ab4f8'); row.appendChild(b); }
      const nb = document.createElement('div'); nb.textContent = 'Redrawn for this storyboard. The browser draws this box itself; the words are exact.';
      nb.style.cssText = 'margin-top:14px;font-size:11px;color:#9a9aa0;border-top:1px solid #4a4a50;padding-top:8px';
      box.append(hd, tx, row, nb); d.appendChild(box); document.body.appendChild(d);
    }, dialog || '(no dialog was raised)');
    await shot('b3c-delete-confirm', { wait: 200 });
    await pg.evaluate(() => { const d = document.getElementById('__confirm'); if (d) d.remove(); });
    /* B4. a yes. The dialog is accepted this time, and the receipt is what
       the app prints off the server's answer */
    pg.removeAllListeners('dialog');
    pg.on('dialog', d => { dialog = d.message(); d.accept(); });
    await pg.evaluate(async () => { __as('t-one'); await authPlanRead(); ACC_OPEN = 'account'; renderAccount(); __quiet(); });
    await pg.click('#acdelacc');
    await pg.waitForFunction(() => /deleted/i.test((document.getElementById('status') || {}).textContent || ''), null, { timeout: 8000 }).catch(() => null);
    await pg.evaluate(() => __scroll('#acgone', 'start'));
    await shot('b4-receipt', { wait: 400 });
    said('b4-receipt', W, 'receipt', await pg.evaluate(() => { const g = document.getElementById('acgone'); return g ? g.innerText.trim() : ''; }));
    pg.removeAllListeners('dialog');
    pg.on('dialog', d => { dialog = d.message(); d.dismiss(); });
    await pg.evaluate(() => { __billing(); __quiet(); });
    await top();
    await shot('b4b-billing-after-delete');

    /* B4c. the other ending: the plan simply runs out at the end of the paid
       month. The next read says so, on a held line */
    await pg.evaluate(async () => {
      __as('t-stop'); await authPlanRead(); __quiet();
      __as('t-ended'); await authPlanRead(); __billing();
    });
    await top();
    await shot('b4c-plan-ran-out', { wait: 400 });

    /* B5. the person afterwards, on a free plan again: the Field locks */
    await gordon({ tier: 'one', status: 'canceled', since: S1, until: U1, ends: U1 });
    /* on a phone the layer buttons are in a panel, so it is opened to show
       the padlocks, as A1 does */
    if (phone) { await pg.evaluate(() => fbOpenPanel(true)); await pg.waitForTimeout(400); }
    await shot('b5-after-field', { wait: 600 });
    if (phone) await pg.evaluate(() => fbOpenPanel(false));

    /* B7. a person who cannot sign in: Help, and the forgotten password */
    await own();
    await pg.evaluate(() => { __as(null); ACC_OPEN = 'help'; setTab(TAB.SETTINGS); renderAccount(); __quiet(); });
    await shot('b7-help');
    await pg.evaluate(() => { __quiet(); if (typeof loginOpen === 'function') loginOpen(); });
    await pg.waitForTimeout(500);
    await pg.click('#loginforgot').catch(() => null);
    await pg.waitForTimeout(400);
    await pg.fill('#loginrmail', 'sam@example.invalid').catch(() => null);
    await pg.click('#loginb-send').catch(() => null);
    await pg.waitForFunction(() => /mail/i.test(((document.getElementById('loginmsg') || {}).textContent || '') + ((document.getElementById('status') || {}).textContent || '')), null, { timeout: 6000 }).catch(() => null);
    said('b7-forgot', W, 'login', await pg.evaluate(() => { const m = document.getElementById('loginmsg'); return m ? m.textContent : ''; }));
    await shot('b7-forgot', { wait: 400 });
    await pg.evaluate(() => { if (typeof loginClose === 'function') loginClose(); });

    said('_run', W, 'errors', errs.slice());
    await cx.close();

    /* A5, B6. the two static pages, as a stranger reaches them */
    const sp = await browser.newPage({ viewport: { width: W, height: H }, hasTouch: phone, isMobile: phone, reducedMotion: 'reduce' });
    await sp.route(/^https:\/\//, r => { real.push(r.request().url()); r.abort(); });
    await sp.goto(BUY, { waitUntil: 'load' }); await sp.waitForTimeout(800);
    await sp.screenshot({ path: path.join(OUT, 'a5-buy-' + W + '.png') });
    await sp.screenshot({ path: path.join(OUT, 'a5-buy-full-' + W + '.png'), fullPage: true });
    said('a5-buy', W, 'state', await sp.evaluate(() => { const e = document.querySelector('.state'); return e ? e.innerText.trim() : ''; }));
    await sp.evaluate(() => { const e = document.querySelector('.state'); if (e) e.scrollIntoView({ block: 'center' }); });
    await sp.waitForTimeout(300);
    await sp.screenshot({ path: path.join(OUT, 'a5b-buy-closed-' + W + '.png') });
    console.log('  a5-buy-' + W);
    await sp.goto(TERMS + '#s8', { waitUntil: 'load' }); await sp.waitForTimeout(600);
    await sp.evaluate(() => { const e = document.getElementById('s8'); if (e) e.scrollIntoView({ block: 'start' }); });
    await sp.waitForTimeout(300);
    await sp.screenshot({ path: path.join(OUT, 'b6-refund-terms-' + W + '.png') });
    said('b6-refund-terms', W, 'refund', await sp.evaluate(() => { const h = document.getElementById('s8'); let t = ''; let e = h && h.nextElementSibling; while (e && e.tagName !== 'H2') { t += e.innerText + '\n'; e = e.nextElementSibling; } return t.trim(); }));
    console.log('  b6-refund-terms-' + W);
    await sp.close();
  }
  said('_run', 'all', 'realHostRequests', real);
  fs.writeFileSync(path.join(OUT, 'frames.json'), JSON.stringify(frames, null, 1));
  await browser.close(); stub.close();
  console.log('\nreal host asked: ' + real.length + ' (all refused)');
})().catch(e => { console.log('capture threw: ' + e.stack); process.exit(1); });
