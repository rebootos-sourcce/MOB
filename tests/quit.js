#!/usr/bin/env node
/* ============================================================
   QUITTING, IN A REAL BROWSER. The owner, 9 October: "The paywall has to be
   complete. ... If they want to quit the software, that the cancellation."
   NODE_PATH=/opt/node22/lib/node_modules node tests/quit.js
   ATUNED_FILE=path  runs against another build, which is how this gate is
                     checked against a known bad copy
   SHOTS=dir         also writes the screenshots a person looks at

   Two ways out, and each has to read back as what it did.

   STOPPING THE PLAN happens on Stripe's own page (Manage billing). Stopping
   keeps the plan active to the end of the paid month, so the status did not
   move and the app said nothing: a person came back from pressing stop to a
   Billing page that read as if nothing had been pressed. The Worker now sends
   billing.ends, the day it stops (reboot-os store.js billingOf), and Stripe's
   webhook can land after the browser is back, so the return is read again a
   few times. What is held: the return from the payment page says the day the
   plan stops, the Billing page carries it on the State row, the plan stays on
   until then, and turning it back on says it renews.

   DELETING THE ACCOUNT had no control at all: no file in the app called
   DELETE /v1/me (REVIEW-audit-2026-10-09 pass3.md, section 3). What is held:
   the control exists only while signed in, says before the press what goes
   and what stays, sends one DELETE with the session and no body, and a
   cancelled confirm sends nothing; a yes ends the sign in here, drops the
   first visit's session and the sync marker, drops a paid plan on the open
   record to free, keeps the record itself, and lists what the server said it
   stopped and kept, in words; a refusal says nothing was deleted and keeps
   the sign in, so the same press is the retry; an App Store plan is named as
   still charging; a server too old to say what it stopped is said to be one;
   a sign in the server has ended is dropped here; and no network keeps
   everything.

   THE STUB answers the Worker's routes in the Worker's own shapes, read off
   reboot-os test/billing.test.mjs on branch claude/paywall-worker. The real
   host is refused and counted at the context, so this gate never reaches the
   live server. If tests/net.js is present it wraps the browser as every gate
   does; this gate refuses the whole host on its own either way.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const path = require('path'), http = require('http');
const { chromium } = require('playwright');
const FILE = 'file://' + path.resolve(process.env.ATUNED_FILE || path.join(__dirname, '..', 'source.html')) + '?dev=1';
const WORKER = 'https://atuned-api.lance-o-powell.workers.dev';
let guard = b => b; try { guard = require('./net.js').guardBrowser; } catch (e) { /* not on this line yet */ }

const SHOTS = process.env.SHOTS || '';
let n = 0; const fails = [];
const ok = (c, m) => { n++; if (!c) fails.push(m); console.log((c ? '  ok    ' : '  FAIL  ') + m); };

const S1 = '2026-10-01T00:00:00.000Z', U1 = '2026-11-01T00:00:00.000Z';
const ACC = { id: 'acc_quit', research_id: 'rsh_quit', plan: 1, email: 'quit@example.invalid' };
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type, x-funnel-credential',
  'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS' };
const seen = []; const reads = {};
const live = (ends) => ({ tier: 'one', status: 'active', since: S1, until: U1, store: 'stripe', ends });
/* what DELETE /v1/me answers per session, in the Worker's own shapes */
const KEPT = ['first_visit', 'activity_log', 'payment_history'];
const DEL = {
  'Bearer t-quit': [200, { deleted: true, at: 1, stopped: 1, billedElsewhere: null, kept: KEPT }],
  'Bearer t-free': [200, { deleted: true, at: 1, stopped: 0, billedElsewhere: null, kept: ['first_visit', 'activity_log'] }],
  'Bearer t-apple': [200, { deleted: true, at: 1, stopped: 0, billedElsewhere: 'apple', kept: ['first_visit', 'activity_log'] }],
  'Bearer t-old': [200, { deleted: true, at: 1 }],
  'Bearer t-stuck': [502, { deleted: false, pending: ['stripe'], error: 'Stripe would not stop the plan, so nothing was deleted. Try again' }],
};
const stub = http.createServer((req, res) => {
  let raw = ''; req.on('data', d => raw += d); req.on('end', () => {
    const send = (st, b) => { res.writeHead(st, Object.assign({ 'content-type': 'application/json' }, CORS)); res.end(JSON.stringify(b)); };
    if (req.method === 'OPTIONS') { res.writeHead(204, CORS); res.end(); return; }
    const auth = req.headers.authorization || '';
    const u = req.url.split('?')[0], k = req.method + ' ' + u;
    seen.push({ m: req.method, u, auth, raw });
    if (k === 'GET /v1/me') {
      reads[auth] = (reads[auth] || 0) + 1;
      const me = b => send(200, { account: ACC, consent: { share: false, at: null, v: 1 }, records: 0, entitlement: null, billing: b });
      if (auth === 'Bearer t-renew') return me(live(null));
      /* the webhook lands after the browser is back: the first read is the
         plan as it was, every read after it carries the end day */
      if (auth === 'Bearer t-stop') return me(live(reads[auth] > 1 ? U1 : null));
      if (auth === 'Bearer t-quit' || auth === 'Bearer t-stuck') return me(live(null));
      return send(401, { error: 'sign in' });
    }
    if (k === 'POST /v1/auth/signout') {
      if (auth !== 'Bearer t-signout') return send(401, { error: 'sign in' });
      let body = null; try { body = JSON.parse(raw); } catch (e) {}
      if (!body || !body.funnel) return send(200, { ok: true });
      const ended = body.funnel.id !== 'fs_signout_fail';
      return send(200, { ok: true, funnel: { ended, why: ended ? undefined : 'the database has not taken update 0015 yet' } });
    }
    if (k === 'DELETE /v1/me') {
      const d = DEL[auth];
      return d ? send(d[0], d[1]) : send(401, { error: 'sign in' });
    }
    send(404, { error: 'no such route' });
  });
});

(async () => {
  await new Promise(r => stub.listen(0, '127.0.0.1', r));
  const API = 'http://127.0.0.1:' + stub.address().port;
  const browser = guard(await chromium.launch({ executablePath: process.env.CHROME }));
  const real = [];
  for (const [W, H] of [[1600, 1000], [390, 844]]) {
    const tag = '@' + W + ': ', phone = W < 600;
    const cx = await browser.newContext({ viewport: { width: W, height: H }, hasTouch: phone, isMobile: phone });
    await cx.route(WORKER + '/**', r => { real.push(r.request().url()); r.abort(); });
    const pg = await cx.newPage();
    const errs = []; pg.on('pageerror', e => errs.push(e.message));
    let dialog = null, answer = true;
    const press = async () => { if (await pg.$('#acdelacc')) await pg.click('#acdelacc'); };
    pg.on('dialog', d => { dialog = d.message(); answer ? d.accept() : d.dismiss(); });
    await pg.goto(FILE, { waitUntil: 'load' });
    await pg.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 30000 }).catch(() => null);
    await pg.evaluate(() => { if (typeof OB !== 'undefined' && OB.open && typeof obClose === 'function') obClose(); });
    await pg.waitForTimeout(400);
    await pg.evaluate(api => {
      AUTH_API = api;
      window.__said = () => { const e = document.getElementById('status'); return [e ? e.textContent : '', e ? e.getAttribute('data-kind') || '' : '']; };
      window.__log = () => (typeof MSG_LOG !== 'undefined' ? MSG_LOG.map(m => m.msg) : []);
      window.__pane = () => { const h = document.getElementById('settings'); return h ? h.innerText.replace(/\s+/g, ' ') : ''; };
      window.__billing = () => { ACC_OPEN = 'billing'; setTab(TAB.SETTINGS); renderAccount(); return __pane(); };
    }, API);

    /* ---- 1 · A PLAN STOPPED ON THE PAYMENT PAGE READS BACK ---- */
    const stopped = await pg.evaluate(async () => {
      const o = {};
      o.own = PROFILES.indexOf(CURP) >= 0;
      CURP.plan = { tier: 'free', status: '', granted: 0, carried: 0, base: null, since: null, until: null }; pSave();
      authKeep({ token: 't-renew', email: 'quit@example.invalid', accountId: 'acc_quit' });
      await authPlanRead();
      o.before = __billing();
      AUTH_PLAN_TRIES = 3; AUTH_PLAN_WAIT_MS = 60;
      authKeep({ token: 't-stop', email: 'quit@example.invalid', accountId: 'acc_quit' });
      history.replaceState(null, '', location.pathname + '?dev=1&billing=managed');
      const was = MSG_LOG.length;
      await authCheck();
      for (let i = 0; i < 60 && !CURP.plan.ends; i++) await new Promise(r => setTimeout(r, 50));
      await new Promise(r => setTimeout(r, 150));
      o.said = MSG_LOG.slice(was).map(m => m.msg);
      o.search = location.search;
      o.plan = JSON.parse(JSON.stringify(CURP.plan));
      o.k = planOf(CURP.plan).k; o.st = planState(CURP.plan);
      o.disk = (JSON.parse(localStorage.getItem('source.profiles') || '[]').find(p => p.id === CURP.id) || {}).plan || null;
      o.after = __billing(); document.getElementById('settings').scrollIntoView();
      authKeep({ token: 't-renew', email: 'quit@example.invalid', accountId: 'acc_quit' });
      const was2 = MSG_LOG.length;
      await authPlanRead();
      o.resumed = MSG_LOG.slice(was2).map(m => m.msg);
      o.resumedPane = __billing(); o.resumedEnds = CURP.plan.ends;
      return o;
    });
    if (SHOTS) {
      /* the stopped state again, for the picture: the evaluate above ends on the resume */
      await pg.evaluate(async () => { authKeep({ token: 't-stop', email: 'quit@example.invalid', accountId: 'acc_quit' });
        await authPlanRead(); __billing(); status(''); });
      await pg.screenshot({ path: path.join(SHOTS, 'quit-billing-ends-' + W + '.png') });
      await pg.evaluate(async () => { authKeep({ token: 't-renew', email: 'quit@example.invalid', accountId: 'acc_quit' }); await authPlanRead(); status(''); });
    }
    ok(stopped.own, tag + 'the open record is the person\'s own, so the plan is written to it');
    ok(!/\bends\b/.test(stopped.before), tag + 'a plan that renews shows no end day on Billing');
    ok(reads['Bearer t-stop'] > 1, tag + 'the return from the payment page is read again while the webhook lands, ' + reads['Bearer t-stop'] + ' reads');
    ok(stopped.said.some(s => /^Tier one stops on \d{1,2} \w{3} 2026\. It stays on until then,/.test(s)),
      tag + 'the return says the day the plan stops and that it is on until then, got ' + JSON.stringify(stopped.said));
    ok(stopped.search === '?dev=1', tag + 'and ?billing= comes off the address, keeping ?dev=1, got ' + stopped.search);
    ok(stopped.plan.ends === U1 && stopped.k === 'one' && stopped.st === 'live', tag + 'the record carries the end day and is still tier one, in force, ' + JSON.stringify(stopped.plan));
    ok(stopped.disk && stopped.disk.ends === U1, tag + 'and it is saved, not only held in memory');
    ok(/State ends \d{1,2} \w{3} 2026/.test(stopped.after), tag + 'Billing says on its State row the day it ends, got ' + (stopped.after.match(/On .{0,80}/) || [''])[0]);
    ok(stopped.resumed.some(s => /^Tier one renews on /.test(s)) && stopped.resumedEnds === null && !/State ends/.test(stopped.resumedPane),
      tag + 'turning it back on says it renews and the end day goes, got ' + JSON.stringify(stopped.resumed));

    /* ---- 2 · THE DELETE CONTROL, SIGNED OUT AND SIGNED IN ---- */
    const ctl = await pg.evaluate(() => {
      authForget(); ACC_OPEN = 'account'; renderAccount();
      const out = !!document.getElementById('acdelacc');
      authKeep({ token: 't-quit', email: 'quit@example.invalid', accountId: 'acc_quit' }); renderAccount();
      const b = document.getElementById('acdelacc'), r = b ? b.getBoundingClientRect() : null;
      return { out, has: !!b, w: r ? r.width : 0, h: r ? r.height : 0, text: b ? b.textContent.trim() : '',
        row: b ? b.closest('.ac-row').textContent.replace(/\s+/g, ' ').trim() : '', scroll: document.documentElement.scrollWidth - window.innerWidth };
    });
    ok(!ctl.out, tag + 'signed out there is no account to delete, and no control for it');
    ok(ctl.has && ctl.text === 'Delete' && /Delete this account/.test(ctl.row), tag + 'signed in, the Sign in group carries Delete this account, got ' + ctl.row);
    ok(ctl.w >= 44 && ctl.h >= 44, tag + 'and its button is 44 pixels each way, ' + Math.round(ctl.w) + ' by ' + Math.round(ctl.h));
    ok(ctl.scroll <= 0, tag + 'nothing scrolls sideways, ' + ctl.scroll);

    if (SHOTS) { await pg.evaluate(() => document.getElementById('acdelacc').scrollIntoView({ block: 'center' }));
      await pg.screenshot({ path: path.join(SHOTS, 'quit-control-' + W + '.png') }); }
    /* a cancelled confirm sends nothing */
    answer = false; dialog = null;
    const sentBefore = seen.filter(s => s.m === 'DELETE').length;
    await press(); await pg.waitForTimeout(300);
    ok(dialog && /quit@example\.invalid/.test(dialog) && /paid plan/i.test(dialog) && /stays on this device/.test(dialog) && /cannot be undone/.test(dialog),
      tag + 'the confirm names the account, what happens to a paid plan, that the record stays, and that it cannot be undone, got ' + JSON.stringify(dialog));
    ok(seen.filter(s => s.m === 'DELETE').length === sentBefore, tag + 'and saying no to it sends nothing');
    answer = true;

    /* ---- 3 · A YES ---- */
    const yes = async (tok, plan) => {
      await pg.evaluate(([tok, plan]) => {
        authKeep({ token: tok, email: 'quit@example.invalid', accountId: 'acc_quit' });
        funnelKeep({ id: 'fs_quit', anonymousId: 'anon_quit', credential: 'cred_quit' });
        STORE.set('source.profile.sync', JSON.stringify({ id: 'atuned.primary-profile', version: 2, hash: 'h' }));
        CURP.plan = plan ? { tier: 'one', status: 'active', granted: 0, carried: 0, base: 120, since: '2026-10-01T00:00:00.000Z', until: '2026-11-01T00:00:00.000Z', ends: null }
          : { tier: 'free', status: '', granted: 0, carried: 0, base: null, since: null, until: null, ends: null };
        pSave(); window.__id = CURP.id; window.__n = PROFILES.length;
        ACC_OPEN = 'account'; setTab(TAB.SETTINGS); renderAccount(); status('probe, before delete');
      }, [tok, plan]);
      const was = seen.length;
      await press();
      await pg.waitForFunction(() => __said()[0] !== 'probe, before delete' && !/^Deleting/.test(__said()[0]), null, { timeout: 8000 }).catch(() => null);
      await pg.waitForTimeout(150);
      const o = await pg.evaluate(() => ({
        said: __said(), ses: authSession(), store: localStorage.getItem('source.session') || '',
        funnel: localStorage.getItem('funnel.session') || '', sync: localStorage.getItem('source.profile.sync') || '',
        kept: PROFILES.length === __n && CURP.id === __id && PROFILES.indexOf(CURP) >= 0,
        plan: planOf(CURP.plan).k, rec: CURP.plan.tier,
        gone: (() => { const g = document.getElementById('acgone'); return g ? g.innerText.replace(/\s+/g, ' ') : ''; })(),
        form: !!document.getElementById('acsignin'), scroll: document.documentElement.scrollWidth - window.innerWidth }));
      o.sent = seen.slice(was).filter(s => s.m === 'DELETE');
      return o;
    };
    const q = await yes('t-quit', true);
    if (SHOTS) { await pg.evaluate(() => { const g = document.getElementById('acgone'); if (g) g.scrollIntoView(); });
      await pg.screenshot({ path: path.join(SHOTS, 'quit-receipt-' + W + '.png') }); }
    ok(q.sent.length === 1 && q.sent[0].u === '/v1/me' && q.sent[0].auth === 'Bearer t-quit' && q.sent[0].raw === '',
      tag + 'one press sends one DELETE /v1/me with the session and no body, got ' + JSON.stringify(q.sent.map(s => [s.m, s.u, s.auth, s.raw])));
    ok(/^The account is deleted\./.test(q.said[0]), tag + 'and the status line says the account is deleted, got ' + JSON.stringify(q.said));
    ok(!q.ses && q.store === '' && q.form, tag + 'the sign in ends here and the page offers Log in again');
    ok(q.funnel === '' && q.sync === '', tag + 'the first visit\'s session and the sync marker go with it, got ' + JSON.stringify([q.funnel, q.sync]));
    ok(q.kept, tag + 'and the record itself stays on this device, the same profile, still open');
    ok(q.plan === 'free' && q.rec === 'free', tag + 'the paid plan on the record drops to free, because the account that paid is gone, got ' + q.rec);
    ok(/paid plan is cancelled/i.test(q.gone), tag + 'the receipt says the paid plan is cancelled, got ' + q.gone.slice(0, 200));
    ok(/first-visit record/.test(q.gone) && /linked by a random account ID/.test(q.gone), tag + 'it says the first-visit record remains linked to a random account ID');
    ok(/no email/.test(q.gone), tag + 'it says the dated log is kept, under no email');
    ok(/Stripe/.test(q.gone) && /past payments/.test(q.gone), tag + 'it says Stripe keeps its record of past payments, and who Stripe is');
    ok(/still on this device/.test(q.gone) && /Profiles/.test(q.gone), tag + 'and that the record is still on this device, with where to delete it');
    ok(q.scroll <= 0, tag + 'the receipt does not scroll sideways, ' + q.scroll);

    const f = await yes('t-free', false);
    ok(f.gone && !/paid plan/i.test(f.gone) && !/past payments/.test(f.gone), tag + 'an account that never paid is told nothing about payments, got ' + f.gone.slice(0, 160));

    const a = await yes('t-apple', true);
    ok(/App Store/.test(a.gone) && /cancel it there/.test(a.gone), tag + 'an App Store plan is named as still charging, with where to stop it, got ' + a.gone.slice(0, 200));

    const old = await yes('t-old', true);
    ok(/did not say whether a paid plan was stopped/.test(old.gone) && !/paid plan is cancelled/i.test(old.gone),
      tag + 'a server too old to say what it stopped is said to be one, and no stop is claimed, got ' + old.gone.slice(0, 200));

    /* ---- 4 · A NO ---- */
    const no = async (tok, api) => {
      await pg.evaluate(([tok, api]) => {
        if (api) AUTH_API = api;
        authKeep({ token: tok, email: 'quit@example.invalid', accountId: 'acc_quit' });
        ACC_OPEN = 'account'; renderAccount(); status('probe, before delete');
      }, [tok, api]);
      await press();
      await pg.waitForFunction(() => __said()[0] !== 'probe, before delete' && !/^Deleting/.test(__said()[0]), null, { timeout: 20000 }).catch(() => null);
      return pg.evaluate(api => { const o = { said: __said(), ses: authSession(), gone: !!document.getElementById('acgone'),
        btn: !!document.getElementById('acdelacc') && !document.getElementById('acdelacc').disabled }; AUTH_API = api; return o; }, API);
    };
    const stuck = await no('t-stuck');
    ok(/nothing was deleted/.test(stuck.said[0]) && stuck.said[1] === 'fail', tag + 'a refusal says nothing was deleted, and holds, got ' + JSON.stringify(stuck.said));
    ok(stuck.ses && stuck.ses.token === 't-stuck' && !stuck.gone && stuck.btn, tag + 'and the sign in stays, with Delete ready to press again');
    const ended = await no('t-unknown');
    ok(!ended.ses && /log in again/i.test(ended.said[0]), tag + 'a sign in the server has ended is dropped here, and says to log in again, got ' + JSON.stringify(ended.said));
    const off = await no('t-quit', 'http://127.0.0.1:1');
    ok(off.ses && off.ses.token === 't-quit' && /Could not reach the server/.test(off.said[0]) && /nothing was deleted/i.test(off.said[0]),
      tag + 'no network keeps the sign in and says nothing was deleted, got ' + JSON.stringify(off.said));

    /* ---- 5 · SIGNING OUT ENDS THE FIRST VISIT'S PASS, HERE AND ON THE SERVER ----
       The Worker keeps a first visit's pass for seven days so a person who comes back that week still
       joins their visit to their account, and ends it early when sign out names it (reboot-os
       funnel.js endPass), so a longer pass is not left behind for the next person on a shared
       computer. Nothing in the app named it, so the pass outlived the sign out. */
    const CRED = 'cred_signout_' + 'x'.repeat(32);
    const so = async (withVisit, api, passId) => {
      const before = seen.length;
      const o = await pg.evaluate(async ([withVisit, api, cred, passId]) => {
        if (api) AUTH_API = api;
        authKeep({ token: 't-signout', email: 'quit@example.invalid', accountId: 'acc_quit' });
        if (withVisit) funnelKeep({ id: passId || 'fs_signout', anonymousId: 'anon_signout', credential: cred, userId: 'acc_quit' }); else funnelKeep(null);
        const r = await authSignOut();
        return { r, ses: authSession(), kept: localStorage.getItem('funnel.session') || '' };
      }, [withVisit, api, CRED, passId]);
      const call = seen.slice(before).find(x => x.u === '/v1/auth/signout');
      let body = null; try { body = call && call.raw ? JSON.parse(call.raw) : null; } catch (e) { body = 'unparseable'; }
      await pg.evaluate(a => { AUTH_API = a; }, API);
      return Object.assign(o, { call, body });
    };
    const so1 = await so(true);
    ok(so1.call && so1.call.auth === 'Bearer t-signout', tag + 'signing out told the server, with the session');
    ok(so1.body && so1.body.funnel && so1.body.funnel.id === 'fs_signout' && so1.body.funnel.credential === CRED,
      tag + 'and named the first visit\'s pass so the server can end it, got ' + JSON.stringify(so1.body && so1.body.funnel ? { id: so1.body.funnel.id, hasCredential: !!so1.body.funnel.credential } : so1.body));
    ok(!so1.ses && so1.kept === '', tag + 'the sign in and the first visit\'s session are both gone from this browser, got ' + JSON.stringify([!!so1.ses, so1.kept.slice(0, 40)]));
    ok(so1.r && /Signed out\./.test(so1.r.say) && !/could not confirm/i.test(so1.r.say), tag + 'a confirmed server pass end is reported as signed out, got ' + JSON.stringify(so1.r && so1.r.say));
    const so2 = await so(false);
    ok(so2.call && (so2.body === null || !so2.body.funnel), tag + 'with no first visit on this device nothing about one is sent, got ' + JSON.stringify(so2.body));
    ok(!so2.ses && so2.r && so2.r.ok, tag + 'and the sign out still ends the sign in');
    const so3 = await so(true, 'http://127.0.0.1:1');
    ok(!so3.ses && so3.kept === '', tag + 'with no network the sign in and the first visit still end here, got ' + JSON.stringify([!!so3.ses, so3.kept.slice(0, 40)]));
    const so4 = await so(true, undefined, 'fs_signout_fail');
    ok(!so4.ses && so4.kept === '' && /could not confirm that the first visit pass ended/i.test(so4.r.say), tag + 'a 200 with ended:false clears local state and says the server pass may remain, got ' + JSON.stringify([!!so4.ses, so4.kept.slice(0, 40), so4.r && so4.r.say]));

    ok(errs.length === 0, tag + 'no page errors, ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }
  ok(real.length === 0, 'the real server was never asked, ' + real.length + ' requests refused');
  await browser.close(); stub.close();
  console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed =====');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate threw: ' + e.stack); process.exit(1); });
