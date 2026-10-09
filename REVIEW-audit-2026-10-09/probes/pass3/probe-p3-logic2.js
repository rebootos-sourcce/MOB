/* Pass 3 logic probe 2. COUNTERFACTUAL (window.profiles defined). node probe-p3-logic2.js <source.html> <out.json>
   1 the boot's own first call, before anything is typed: what does it send?
   2 two exports of an unchanged record: how do they differ?
   3 two calls with nothing changed: clean, or pushed?
   4 compact size of the record that would be sent, against the Worker's 200000 character cap on one body */
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
  const reqs = [], remote = {}, result = {};
  const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  await cx.route(WORKER + '/**', async route => {
    const req = route.request(), u = new URL(req.url()), body = req.postData() || '';
    reqs.push({ method: req.method(), path: u.pathname, bytes: body.length });
    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type, x-funnel-credential', 'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS' };
    const send = (st, b) => route.fulfill({ status: st, headers: Object.assign({ 'content-type': 'application/json' }, cors), body: J(b) });
    const m = req.method(), p = u.pathname;
    if (m === 'OPTIONS') return route.fulfill({ status: 204, headers: cors, body: '' });
    if (m === 'GET' && p === '/v1/me') return send(200, { account: ACC, consent: { share: false, at: null, v: 1 }, records: 0, entitlement: null, billing: null });
    if (m === 'GET' && p === '/v1/sync') return send(200, { records: Object.values(remote), at: Date.now(), more: false, cursor: null });
    if (m === 'PUT' && p === '/v1/sync') {
      let b = {}; try { b = JSON.parse(body); } catch (e) {}
      const kept = [], stale = [];
      (b.records || []).forEach(r => { const k = r.kind + '/' + r.id, ex = remote[k];
        if (!ex || r.version > ex.version) { remote[k] = { kind: r.kind, id: r.id, version: r.version, body: r.body, deleted: !!r.deleted, updated_at: Date.now() }; kept.push({ kind: r.kind, id: r.id, version: r.version }); }
        else stale.push({ kind: r.kind, id: r.id, version: ex.version }); });
      return send(200, { kept, stale, at: Date.now() });
    }
    return send(404, { error: 'no such route' });
  });
  await cx.addInitScript(() => {
    try { if (!sessionStorage.getItem('__s')) { sessionStorage.setItem('__s', '1');
      localStorage.setItem('source.session', JSON.stringify({ token: 'tok-probe-1', email: 'probe@example.invalid', accountId: 'acc_probe' })); } } catch (e) {}
    window.profiles = function () { return PROFILES; };
  });
  const pg = await cx.newPage();
  await pg.goto(url, { waitUntil: 'load' }); await booted(pg);
  await pg.waitForTimeout(3000);
  const meta0 = await pg.evaluate(() => localStorage.getItem('source.profile.sync'));
  console.log('1 boot: requests ' + J(reqs.map(r => r.method + ' ' + r.path + (r.bytes ? ' (' + r.bytes + ' bytes)' : ''))) + ' ; meta after the boot call = ' + meta0);
  console.log('1 server holds after boot: ' + J(Object.keys(remote)));
  result.boot = { reqs: reqs.slice(), meta0, serverHolds: Object.keys(remote) };
  await pg.evaluate(() => profileSyncStop());
  // 2 two exports of an unchanged record
  const d = await pg.evaluate(() => {
    const a = JSON.parse(pExport()); const t = Date.now(); while (Date.now() - t < 5) {} const b = JSON.parse(pExport());
    const diff = []; (function walk(x, y, p) { if (x && typeof x === 'object' && y && typeof y === 'object') { Object.keys(x).forEach(k => walk(x[k], y[k], p + '.' + k)); } else if (JSON.stringify(x) !== JSON.stringify(y)) diff.push(p + ': ' + JSON.stringify(x) + ' -> ' + JSON.stringify(y)); })(a, b, '');
    return diff;
  });
  console.log('2 two pExport() calls, nothing changed in between, differ in: ' + J(d));
  result.exportDiff = d;
  // 3 two calls, nothing changed
  const n0 = reqs.length;
  const s1 = await pg.evaluate(() => authProfileSync()); const s2 = await pg.evaluate(() => authProfileSync()); const s3 = await pg.evaluate(() => authProfileSync());
  console.log('3 three calls, nothing changed: ' + J([s1, s2, s3]) + ' ; requests ' + J(reqs.slice(n0).map(r => r.method + ' ' + r.path + (r.bytes ? ' (' + r.bytes + ')' : ''))));
  result.three = { states: [s1, s2, s3], reqs: reqs.slice(n0) };
  // 4 compact size
  const sz = await pg.evaluate(() => {
    const out = []; const long = 'I was furious and ashamed and afraid. '.repeat(12);
    for (let i = 1; i <= 300; i++) {
      const P = parseStory(long); applyStory(long); verpApply(long); leanApply(long);
      CURP.story.entries.push({ t: new Date().toISOString(), text: long, imprints: P.imprints.length, bands: P.bands, lex: LEX_VERSION });
      pSnap();
      if ([1, 10, 50, 100, 150, 200, 250, 300].indexOf(i) >= 0) out.push({ stories: i, prettyChars: pExport().length, compactChars: JSON.stringify(JSON.parse(pExport())).length });
    }
    return out;
  });
  console.log('4 record size by number of stories (each 456 characters, one snapshot each); the Worker refuses one body over 200000 characters (compact JSON):');
  sz.forEach(s => console.log('   ' + String(s.stories).padStart(3) + ' stories: compact ' + s.compactChars + ' chars' + (s.compactChars > 200000 ? '  OVER THE CAP' : '')));
  result.size = sz;
  // what does a push of the over-cap record do, in the client?
  const n1 = reqs.length;
  // use a server stub that refuses over 200000: emulate by asking authCall directly
  console.log('   (the client treats any non-ok PUT as {state:"retry"} with no status line: auth.js profileSyncPush returns r when !r.ok, authProfileSync returns {state:"retry"})');
  fs.writeFileSync(OUT, J(result, null, 1));
  await cx.close(); await browser.close();
})().catch(e => { console.error('PROBE THREW', e); process.exit(1); });
