#!/usr/bin/env node
/* ============================================================
   THE RECORD ON THE ACCOUNT, IN A REAL BROWSER. 21 November, the day the
   owner approved the temporary consent words and sync went on: "let's
   approve the privacy copy for now. We'll have a lawyer review that later."
   NODE_PATH=/opt/node22/lib/node_modules node tests/sync.js
   ATUNED_FILE=path  runs against another build, which is how this gate is
                     checked against a known bad copy (origin/main before the
                     switch: it fails on the first check, because no yes can
                     be given and nothing is ever sent)

   Nothing drove authProfileSync against a server before this file, and it
   could not have worked: it asked for a profiles() that never existed. So
   every claim the consent words make is held here, in the order a person
   meets them.

   1. Signed in without the yes, nothing goes to /v1/sync at all.
   2. The yes is a press on the switch, beside the words, and the first pass
      sends the record without the name (DECISIONS.md, "The name never
      leaves"), and the Account group says it synced.
   3. A second device, blank, signs in, says yes, and the story comes over
      with this device's own name on it; after a reload there is one record
      under that id, not two.
   4. Two devices that each wrote a story the other lacks: the newer copy is
      not pulled over the older one's story. Nothing is replaced, nothing is
      sent, and the person is told what would have gone, by count.
   5. A server that refuses says so in its own words, and the record stays.
   6. Off removes the account copy: a removal one version above the highest
      the server holds, and the yes is gone from the device.

   THE STUB keeps the Worker's own rule for PUT /v1/sync, read off reboot-os
   atuned/server/src/index.js on 21 November: a record is written only when
   its version is higher than the one held, kept lists what was written, and
   a removed row keeps its version. The real host is refused and counted.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const path = require('path'), http = require('http');
const { chromium } = require('playwright');
const FILE = 'file://' + path.resolve(process.env.ATUNED_FILE || path.join(__dirname, '..', 'source.html')) + '?dev=1';
const WORKER = 'https://atuned-api.lance-o-powell.workers.dev';
let guard = b => b; try { guard = require('./net.js').guardBrowser; } catch (e) { /* not on this line yet */ }

let n = 0; const fails = [];
const ok = (c, m) => { n++; if (!c) fails.push(m); console.log((c ? '  ok    ' : '  FAIL  ') + m); };
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type, x-funnel-credential',
  'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS' };
const ACC = { id: 'acc_sync', research_id: 'rsh_sync', plan: 0, email: 'sync@example.invalid' };

/* the server's one row for this account, and every request it saw */
const DB = new Map(); const seen = []; let refuse = null;
const stub = http.createServer((req, res) => {
  let raw = ''; req.on('data', d => raw += d); req.on('end', () => {
    const send = (st, b) => { res.writeHead(st, Object.assign({ 'content-type': 'application/json' }, CORS)); res.end(JSON.stringify(b)); };
    if (req.method === 'OPTIONS') { res.writeHead(204, CORS); res.end(); return; }
    const u = req.url.split('?')[0], k = req.method + ' ' + u;
    let body = null; try { body = JSON.parse(raw); } catch (e) {}
    seen.push({ k, body });
    if (k === 'GET /v1/me') return send(200, { account: ACC, consent: { share: false, at: null, v: 1 }, records: DB.size, entitlement: null, billing: null });
    if (k === 'GET /v1/sync') {
      if (refuse) return send(refuse[0], { error: refuse[1] });
      return send(200, { records: [...DB.entries()].map(([id, r]) => ({ kind: 'state', id, version: r.version, body: r.body, deleted: r.deleted, updated_at: 1 })), at: 1, more: false, cursor: null });
    }
    if (k === 'PUT /v1/sync') {
      if (refuse) return send(refuse[0], { error: refuse[1] });
      const kept = [], stale = [];
      (body && body.records || []).forEach(r => {
        const had = DB.get(r.id);
        if (!had || r.version > had.version) { DB.set(r.id, { version: r.version, body: r.body === undefined ? null : r.body, deleted: !!r.deleted }); kept.push({ kind: r.kind, id: r.id, version: r.version }); }
        else stale.push({ kind: r.kind, id: r.id, version: had.version });
      });
      return send(200, { kept, stale, at: 1 });
    }
    send(404, { error: 'no such route' });
  });
});
const syncs = () => seen.filter(s => /\/v1\/sync$/.test(s.k));
const puts = () => seen.filter(s => s.k === 'PUT /v1/sync');

(async () => {
  await new Promise(r => stub.listen(0, '127.0.0.1', r));
  const API = 'http://127.0.0.1:' + stub.address().port;
  const browser = guard(await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }));
  const real = [];
  const open = async () => {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    await cx.route(WORKER + '/**', r => { real.push(r.request().url()); r.abort(); });
    /* the stub's address before any script runs, so a boot check on a held
       session never reaches the real host either */
    await cx.addInitScript(api => { window.__API = api; }, API);
    const pg = await cx.newPage();
    const errs = []; pg.on('pageerror', e => errs.push(e.message));
    const boot = async () => {
      await pg.goto(FILE, { waitUntil: 'load' });
      await pg.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 30000 }).catch(() => null);
      await pg.evaluate(() => {
        AUTH_API = window.__API;
        if (typeof OB !== 'undefined' && OB.open && typeof obClose === 'function') obClose();
        window.__said = () => { const e = document.getElementById('status'); return e ? e.textContent : ''; };
        window.__pane = () => { ACC_OPEN = 'account'; setTab(TAB.SETTINGS); renderAccount(); const h = document.getElementById('settings'); return h ? h.innerText.replace(/\s+/g, ' ') : ''; };
        window.__in = () => authHold({ token: 't-sync', account: { id: 'acc_sync', email: 'sync@example.invalid' } }, 'sync@example.invalid');
        window.__pass = () => authProfileSync().then(profileSyncSay);
        window.__story = (t, x) => { CURP.story.entries.push({ t, text: x, imprints: 0, bands: {} }); pSave(); };
        window.__name = (nm, first) => { CURP.name = nm; CURP.who.first = first; pSave(); };
        window.__settle = async () => { for (let i = 0; i < 100 && PROFILE_SYNC_BUSY; i++) await new Promise(r => setTimeout(r, 30)); };
      });
      await pg.waitForTimeout(300);
    };
    await boot();
    return { cx, pg, errs, boot };
  };

  /* ---- 1 · SIGNED IN, NO YES, NOTHING SENT ---- */
  const A = await open();
  await A.pg.evaluate(() => { __name('Lance', 'Lance'); __story('2026-11-20T10:00:00.000Z', 'the lift at work'); });
  const was1 = syncs().length;
  await A.pg.evaluate(async () => { __in(); await new Promise(r => setTimeout(r, 600)); });
  ok(syncs().length === was1, '1. signed in without the yes, nothing is asked of or sent to /v1/sync, ' + (syncs().length - was1) + ' requests');
  const pane0 = await A.pg.evaluate(() => __pane());
  ok(/Keep my record on my account/.test(pane0) && /never holds the name you enter/i.test(pane0) && /sealed with a key/i.test(pane0),
    '1. the switch is on the Account page beside the words, name and seal included');
  ok(await A.pg.evaluate(() => { const b = document.getElementById('acsync'); return !!b && b.getAttribute('aria-checked') === 'false'; }),
    '1. and it is drawn off, so nothing is copied by default');
  ok(/Signing in does not copy them anywhere/.test(pane0), '1. and the sign in footer still says nothing is copied, which is true here');

  /* ---- 2 · THE YES, AND THE FIRST PUSH ---- */
  await A.pg.click('#acsync');
  await A.pg.evaluate(() => __settle());
  await A.pg.waitForTimeout(300);
  const p1 = puts();
  const sent = p1.length ? p1[p1.length - 1].body.records[0] : null;
  ok(!!sent && sent.kind === 'state' && sent.version >= 1 && !sent.deleted, '2. the yes sends one state record, ' + JSON.stringify(sent && { v: sent.version, d: sent.deleted }));
  ok(!!sent && sent.body && sent.body.story.entries.some(e => e.text === 'the lift at work'), '2. and it carries the story');
  ok(!!sent && sent.body && !('name' in sent.body) && sent.body.who.first === '' && JSON.stringify(sent.body).indexOf('Lance') < 0,
    '2. and never the name: no profile name, no first name, the word Lance nowhere in it');
  const st2 = await A.pg.evaluate(() => ({ c: syncConsented(), k: !!localStorage.getItem('source.sync.consent'), pane: __pane(),
    on: document.getElementById('acsync').getAttribute('aria-checked') }));
  ok(st2.c && st2.k && st2.on === 'true', '2. the yes is held on this device, under its own key, and the switch reads on');
  ok(/Last sync Synced/.test(st2.pane), '2. and the group says it synced, got ' + (st2.pane.match(/Last sync.{0,60}/) || [''])[0]);
  ok(/kept on your account too/.test(st2.pane) && !/does not copy them anywhere/.test(st2.pane), '2. and the sign in footer stops saying nothing is copied');
  const clean = await A.pg.evaluate(() => authProfileSync());
  ok(clean.state === 'clean', '2. a second pass with nothing new sends nothing, state ' + clean.state);

  /* ---- 3 · A BLANK SECOND DEVICE ---- */
  const B = await open();
  await B.pg.evaluate(() => __name('Lance on the phone', 'L'));
  const bid0 = await B.pg.evaluate(() => CURP.id);
  await B.pg.evaluate(() => { __in(); __pane(); });
  await B.pg.click('#acsync');
  await B.pg.evaluate(() => __settle());
  await B.pg.waitForTimeout(300);
  const got = await B.pg.evaluate(() => ({ stories: CURP.story.entries.map(e => e.text), name: CURP.name, first: CURP.who.first,
    id: CURP.id, n: PROFILES.length, said: __said(), meta: profileSyncMeta() }));
  ok(got.stories.indexOf('the lift at work') >= 0, '3. the story comes over to a blank device, ' + JSON.stringify(got.stories));
  ok(got.name === 'Lance on the phone' && got.first === 'L', '3. with this device\'s own name on it, never one from the server, got ' + got.name + '/' + got.first);
  ok(/Brought your record over/.test(got.said), '3. and the person is told, got ' + JSON.stringify(got.said));
  ok(got.id !== bid0 && /kept under Profiles/.test(got.said), '3. the blank record already here is kept beside it and said to be');
  /* the session is dropped before the reload so the boot check, which runs
     before the stub's address is set, has nothing to ask the real host */
  await B.pg.evaluate(() => { profileSyncStop(); authForget(); });
  await B.boot();
  const after = await B.pg.evaluate(() => { const all = JSON.parse(localStorage.getItem('source.profiles') || '[]'); return { ids: all.map(p => p.id) }; });
  ok(after.ids.filter(i => i === got.id).length === 1, '3. after a reload there is one record under that id, not two, ' + JSON.stringify(after.ids));

  /* ---- 4 · TWO STORIES THAT DISAGREE ---- */
  /* the phone writes one story and syncs; the laptop has written its own
     since, offline, and the phone's copy is newer */
  await A.pg.evaluate(() => { profileSyncStop(); __story('2026-11-21T08:00:00.000Z', 'written on the laptop'); });
  await B.pg.evaluate(async () => { __in(); await __settle(); __story('2026-11-21T09:00:00.000Z', 'written on the phone'); await __pass(); });
  const phoneV = DB.get('atuned.primary-profile').version;
  await A.pg.evaluate(() => { const p = CURP; p.updated = '2026-11-21T08:00:00.000Z'; pPersist(); });
  const putsBefore = puts().length;
  const held = await A.pg.evaluate(async () => { const r = await __pass(); return { r, stories: CURP.story.entries.map(e => e.text), said: __said(), pane: __pane() }; });
  ok(held.r.state === 'held', '4. the newer copy is not pulled over a story it does not have, state ' + held.r.state);
  ok(held.stories.indexOf('written on the laptop') >= 0 && held.stories.indexOf('written on the phone') < 0, '4. this device keeps its own story, and nothing was replaced');
  ok(puts().length === putsBefore && DB.get('atuned.primary-profile').version === phoneV, '4. and nothing was sent, so the account copy is as the phone left it');
  ok(/^Not synced\. This device has 1 story the account copy does not\..*Nothing was replaced or sent/.test(held.said),
    '4. the person is told what would have gone, by count, got ' + JSON.stringify(held.said));
  ok(/Last sync Not synced\./.test(held.pane), '4. and the Account group carries it, so it is not only a line that fades');
  /* and the other way: the phone, whose copy the server holds, would erase
     nothing; but if the laptop had pushed first the phone's story would go,
     so a push over a copy another device wrote is held too */
  const pushHeld = await A.pg.evaluate(async () => {
    const p = CURP; p.updated = '2026-11-22T08:00:00.000Z'; pPersist(); const r = await __pass(); return r; });
  ok(pushHeld.state === 'held' && pushHeld.theirs && pushHeld.theirs.stories >= 1 && puts().length === putsBefore,
    '4. a push over a copy another device wrote, holding a story this one lacks, is held and sends nothing, ' + JSON.stringify(pushHeld.theirs));

  /* ---- 5 · A SERVER THAT REFUSES ---- */
  refuse = [503, 'the records key is not set on this server, so nothing can be read'];
  const r5 = await B.pg.evaluate(async () => { await __pass(); return { said: __said(), stories: CURP.story.entries.length }; });
  ok(/^Not synced\. The records key is not set on this server/.test(r5.said) && /safe on this device/.test(r5.said),
    '5. a refusal is said in the server\'s own words and says the record is safe, got ' + JSON.stringify(r5.said));
  refuse = null;

  /* ---- 6 · OFF REMOVES THE COPY ---- */
  await B.pg.evaluate(() => { __pane(); });
  const top = DB.get('atuned.primary-profile').version;
  await B.pg.click('#acsync');
  await B.pg.waitForTimeout(600);
  const off = await B.pg.evaluate(() => ({ c: syncConsented(), said: __said(), n: CURP.story.entries.length, t: PROFILE_SYNC_TIMER }));
  const row = DB.get('atuned.primary-profile');
  ok(row.deleted === true && row.body === null && row.version === top + 1, '6. off sends a removal one above the highest version held, ' + JSON.stringify({ v: row.version, top, d: row.deleted }));
  ok(!off.c && off.t === null && /copy on our server is removed/.test(off.said), '6. the yes is gone, the timer is stopped, and it says the copy is removed, got ' + JSON.stringify(off.said));
  ok(off.n > 0, '6. and the record on this device stays');
  /* on again after off must still be able to write, past the removed row */
  await B.pg.evaluate(() => { __pane(); });
  await B.pg.click('#acsync');
  await B.pg.evaluate(() => __settle()); await B.pg.waitForTimeout(300);
  const again = DB.get('atuned.primary-profile');
  ok(again.deleted === false && again.version > row.version, '6. and on again writes past the removed row, version ' + again.version);

  ok(!A.errs.length && !B.errs.length, 'no page errors, ' + JSON.stringify(A.errs.concat(B.errs)));
  ok(!real.length, 'the real server was never reached, ' + real.length + ' requests refused');
  await browser.close(); stub.close();
  console.log('\n' + (n - fails.length) + ' passed, ' + fails.length + ' failed');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
