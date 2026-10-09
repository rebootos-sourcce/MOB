/* Pass 3 UI probe. node probe-p3-ui.js <source.html> <out.json>
   K: does a signed in person get the "only copy" warning a signed out person gets? (ui/keep.js)
   D: the Account page's own words, the delete press, what it asks, what it sends, what it leaves behind.
   S: sign out: what it sends and what it leaves behind. */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const SRC = path.resolve(process.argv[2]), OUT = process.argv[3];
const WORKER = 'https://atuned-api.lance-o-powell.workers.dev';
const ACC = { id: 'acc_probe', research_id: 'rsh_probe', plan: 1, email: 'probe@example.invalid' };
const J = x => JSON.stringify(x);
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const url = 'file://' + SRC + '?dev=1';
  const booted = pg => pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 }).catch(() => null);
  const result = {};

  async function open(signed, reqs, funnel) {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    await cx.route(WORKER + '/**', async route => {
      const req = route.request(), u = new URL(req.url());
      reqs.push({ method: req.method(), path: u.pathname, bytes: (req.postData() || '').length });
      const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type, x-funnel-credential',
        'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS' };
      const send = (st, b) => route.fulfill({ status: st, headers: Object.assign({ 'content-type': 'application/json' }, cors), body: J(b) });
      const m = req.method(), p = u.pathname;
      if (m === 'OPTIONS') return route.fulfill({ status: 204, headers: cors, body: '' });
      if (m === 'GET' && p === '/v1/me') return send(200, { account: ACC, consent: { share: false, at: null, v: 1 }, records: 0, entitlement: null, billing: null });
      if (m === 'POST' && p === '/v1/auth/signout') return send(200, { ok: true });
      if (p.indexOf('/v1/funnel/session/') === 0) return send(200, { session: { id: 'fs_probe', anonymousId: 'anon_probe', version: 2, userId: ACC.id } });
      return send(404, { error: 'no such route' });
    });
    await cx.addInitScript(a => {
      try { if (!sessionStorage.getItem('__s')) { sessionStorage.setItem('__s', '1');
        if (a.signed) localStorage.setItem('source.session', JSON.stringify({ token: 'tok-probe-1', email: 'probe@example.invalid', accountId: 'acc_probe' }));
        if (a.funnel) localStorage.setItem('funnel.session', JSON.stringify({ session: { id: 'fs_probe' }, id: 'fs_probe', anonymousId: 'anon_probe', credential: 'cred-probe' })); } } catch (e) {}
      // a browser that will not promise to keep the record: the case the warning exists for
      try { Object.defineProperty(navigator, 'storage', { value: { persist: () => Promise.resolve(false), persisted: () => Promise.resolve(false) }, configurable: true }); } catch (e) {}
    }, { signed, funnel });
    const pg = await cx.newPage();
    await pg.goto(url, { waitUntil: 'load' }); await booted(pg);
    await pg.waitForTimeout(800);
    return { cx, pg };
  }
  const addStory = pg => pg.evaluate(() => {
    const T = 'My father shouted at me on the porch and I was furious and ashamed.';
    const P = parseStory(T); applyStory(T); verpApply(T); leanApply(T);
    CURP.story.entries.push({ t: new Date().toISOString(), text: T, imprints: P.imprints.length, bands: P.bands, lex: LEX_VERSION });
    const ok = pSave(); pSnap();
    return ok;
  });

  /* K */
  result.K = {};
  for (const signed of [false, true]) {
    const reqs = [];
    const { cx, pg } = await open(signed, reqs, false);
    const saved = await addStory(pg);
    await pg.waitForTimeout(500);
    const k = await pg.evaluate(() => ({ persist: KEEP.persist, armed: KEEP.armed, n: KEEP.n, rose: KEEP.rose, line: KEEP.line ? 'set' : null,
      marker: localStorage.getItem(KEEP_KEY), said: localStorage.getItem('source.dev') && /keepSaid/.test(localStorage.getItem('source.dev')),
      onScreen: /kept only in this browser/.test(document.body.innerText), signedIn: keepSignedIn(), atRisk: keepAtRisk() }));
    console.log('K signed ' + (signed ? 'IN ' : 'OUT') + ': saved=' + saved + ' ' + J(k));
    result.K[signed ? 'in' : 'out'] = k;
    await cx.close();
  }

  /* D and S */
  {
    const reqs = [];
    const { cx, pg } = await open(true, reqs, true);
    await addStory(pg);
    reqs.length = 0;
    const text = await pg.evaluate(() => { ACC_OPEN = 'privacy'; setTab(TAB.SETTINGS); render(); const el = document.getElementById('settings'); return el.innerText; });
    const idx = text.indexOf('Export and delete');
    console.log('D Account, Privacy section, the Export and delete group:\n   ' + text.slice(idx, idx + 520).replace(/\n+/g, ' | '));
    const si = await pg.evaluate(() => { ACC_OPEN = 'account'; setTab(TAB.SETTINGS); render(); const el = document.getElementById('settings'); const t = el.innerText; const i = t.indexOf('Signed in as'); return t.slice(i, i + 260); });
    console.log('D Account, signed in, the Sign in group:\n   ' + si.replace(/\n+/g, ' | '));
    let dialog = null;
    pg.on('dialog', async d => { dialog = { type: d.type(), message: d.message() }; await d.accept(); });
    const before = await pg.evaluate(() => ({ profiles: PROFILES.length, session: !!localStorage.getItem('source.session'), funnel: !!localStorage.getItem('funnel.session') }));
    await pg.evaluate(() => { ACC_OPEN = 'privacy'; setTab(TAB.SETTINGS); render(); accDelete(); });
    await pg.waitForTimeout(600);
    const after = await pg.evaluate(() => ({ profiles: PROFILES.length, name: CURP && CURP.name, stories: CURP && CURP.story.entries.length, session: !!localStorage.getItem('source.session'),
      funnel: !!localStorage.getItem('funnel.session'), status: document.getElementById('status').textContent }));
    console.log('D delete press: confirm dialog = ' + J(dialog));
    console.log('D before ' + J(before) + ' after ' + J(after));
    console.log('D Worker requests during the delete: ' + J(reqs));
    result.D = { text: text.slice(idx, idx + 520), signInGroup: si, dialog, before, after, requests: reqs.slice() };
    reqs.length = 0;
    await pg.evaluate(() => accSignOut());
    await pg.waitForTimeout(800);
    const so = await pg.evaluate(() => ({ session: !!localStorage.getItem('source.session'), funnel: !!localStorage.getItem('funnel.session'), profiles: PROFILES.length,
      syncMeta: localStorage.getItem('source.profile.sync'), timer: !!PROFILE_SYNC_TIMER, status: document.getElementById('status').textContent }));
    console.log('S sign out: requests ' + J(reqs) + ' left behind ' + J(so));
    result.S = { requests: reqs.slice(), left: so };
    await cx.close();
  }
  fs.writeFileSync(OUT, J(result, null, 1));
  await browser.close();
})().catch(e => { console.error('PROBE THREW', e); process.exit(1); });
