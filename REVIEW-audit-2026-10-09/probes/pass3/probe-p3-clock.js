/* Pass 3 prototype of the proposed gate tests/sends.js: can page.clock fast forward the 30 s sync timer, so the
   gate takes seconds and not 45? Two cases: main as built (must send no /v1/sync) and the known bad case. */
const { chromium } = require('playwright');
const path = require('path');
const SRC = path.resolve(process.argv[2]);
const WORKER = 'https://atuned-api.lance-o-powell.workers.dev';
const ACC = { id: 'acc_probe', research_id: 'rsh_probe', plan: 1, email: 'probe@example.invalid' };
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const bad of [false, true]) {
    const t0 = Date.now();
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const reqs = [];
    await cx.route(WORKER + '/**', async route => {
      const req = route.request(), u = new URL(req.url()), body = req.postData() || '';
      reqs.push({ m: req.method(), p: u.pathname, bytes: body.length, name: /Zephyrine/.test(body), story: /Marrowgate/.test(body) });
      const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type, x-funnel-credential', 'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS' };
      const send = (st, b) => route.fulfill({ status: st, headers: Object.assign({ 'content-type': 'application/json' }, cors), body: JSON.stringify(b) });
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors, body: '' });
      if (u.pathname === '/v1/me') return send(200, { account: ACC, consent: { share: false, at: null, v: 1 }, records: 0, entitlement: null, billing: null });
      if (u.pathname === '/v1/sync' && req.method() === 'GET') return send(200, { records: [], at: Date.now(), more: false, cursor: null });
      if (u.pathname === '/v1/sync') return send(200, { kept: [{ kind: 'state', id: 'atuned.primary-profile', version: 1 }], stale: [], at: Date.now() });
      return send(404, { error: 'no such route' });
    });
    await cx.addInitScript(a => {
      try { if (!sessionStorage.getItem('__s')) { sessionStorage.setItem('__s', '1');
        localStorage.setItem('source.session', JSON.stringify({ token: 'tok-probe-1', email: 'probe@example.invalid', accountId: 'acc_probe' })); } } catch (e) {}
      if (a.bad) window.profiles = function () { return PROFILES; };
    }, { bad });
    const pg = await cx.newPage();
    await pg.clock.install({ time: new Date() });
    await pg.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' });
    await pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 }).catch(() => null);
    await pg.evaluate(() => { CURP.name = 'Zephyrine Quillfeather'; CURP.who.first = 'Zephyrine'; CURP.ui.onboarded = true; CURP.ui.tutorialSeen = true;
      const T = 'My father shouted at me on the porch at Marrowgate Lane and I was furious.'; const P = parseStory(T); applyStory(T);
      CURP.story.entries.push({ t: new Date().toISOString(), text: T, imprints: P.imprints.length, bands: P.bands, lex: LEX_VERSION }); pSave(); });
    const n0 = reqs.length;
    await pg.clock.fastForward(65000);
    await pg.waitForTimeout(400);
    const sync = reqs.slice(n0).filter(r => r.p === '/v1/sync');
    console.log((bad ? 'KNOWN BAD CASE (profiles defined)' : 'main as built') + ': fast forward 65 s took ' + (Date.now() - t0) + ' ms real time; sync requests in that window = ' + JSON.stringify(sync.map(r => r.m + (r.bytes ? ' ' + r.bytes + 'B name=' + r.name + ' story=' + r.story : ''))));
    await cx.close();
  }
  await browser.close();
})().catch(e => { console.error('PROBE THREW', e); process.exit(1); });
