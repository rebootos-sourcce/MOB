/* Pass 3 logic probe. node probe-p3-logic.js <source.html> <out.json>
   A: shipped build, profiles undefined: what does the sync's own import do if eligibility is bypassed?
   B: COUNTERFACTUAL, window.profiles defined: drive authProfileSync() by hand, in the order the timer would.
      1 first call, no remote record   2 second call   3 an edit   4 local delete   5 next call
   E: how big does pExport() get, against the Worker's 200000 character cap on one record body? */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const SRC = path.resolve(process.argv[2]), OUT = process.argv[3];
const WORKER = 'https://atuned-api.lance-o-powell.workers.dev';
const ACC = { id: 'acc_probe', research_id: 'rsh_probe', plan: 1, email: 'probe@example.invalid' };
const J = x => JSON.stringify(x);
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const STORY = 'My father shouted at me on the porch at Marrowgate Lane and I was furious and ashamed. Probe marker seven seven three one.';

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const url = 'file://' + SRC + '?dev=1';
  const booted = pg => pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 }).catch(() => null);
  const result = {};

  async function newPage(counter, remote, reqs) {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    await cx.route(WORKER + '/**', async route => {
      const req = route.request(), u = new URL(req.url()), body = req.postData() || '';
      reqs.push({ method: req.method(), path: u.pathname, bytes: body.length, name: body.indexOf('Zephyrine') >= 0, story: body.indexOf('Marrowgate') >= 0 });
      const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type, x-funnel-credential',
        'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS' };
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
    await cx.addInitScript(a => {
      try { if (!sessionStorage.getItem('__s')) { sessionStorage.setItem('__s', '1');
        localStorage.setItem('source.session', JSON.stringify({ token: 'tok-probe-1', email: 'probe@example.invalid', accountId: 'acc_probe' })); } } catch (e) {}
      if (a.counter) window.profiles = function () { return PROFILES; };
    }, { counter });
    const pg = await cx.newPage();
    await pg.goto(url, { waitUntil: 'load' }); await booted(pg);
    // stop the boot's own timer so the by-hand calls are the only calls
    await pg.evaluate(() => { profileSyncStop(); });
    await pg.evaluate(a => {
      CURP.name = 'Zephyrine Quillfeather'; CURP.who.first = 'Zephyrine'; CURP.who.last = 'Quillfeather';
      CURP.who.born.date = '1984-03-02'; CURP.who.born.place = 'Reykjavik'; CURP.ui.onboarded = true; CURP.ui.tutorialSeen = true;
      const P = parseStory(a.S); applyStory(a.S); verpApply(a.S); leanApply(a.S);
      CURP.story.entries.push({ t: new Date().toISOString(), text: a.S, imprints: P.imprints.length, bands: P.bands, lex: LEX_VERSION });
      CURP.updated = new Date().toISOString(); pSave();
    }, { S: STORY });
    return { cx, pg };
  }
  const snap = pg => pg.evaluate(() => ({ profiles: PROFILES.length, ids: PROFILES.map(p => p.id.slice(-6)), curId: CURP && CURP.id.slice(-6),
    curName: CURP && CURP.name, stories: CURP && CURP.story.entries.length, meta: JSON.parse(localStorage.getItem('source.profile.sync') || 'null') }));

  /* A */
  {
    const reqs = [], remote = {};
    const { cx, pg } = await newPage(false, remote, reqs);
    const before = await snap(pg);
    const out = await pg.evaluate(() => { try { const r = profileSyncImport(JSON.parse(pExport()), 1); return { returned: r }; } catch (e) { return { threw: String(e && e.name) + ': ' + String(e && e.message) }; } });
    const after = await snap(pg);
    const eligible = await pg.evaluate(() => profileSyncEligible());
    result.A = { eligible, before, out, after };
    console.log('A (shipped, profiles undefined): profileSyncEligible() =', eligible);
    console.log('A profileSyncImport(own export, 1) ->', J(out));
    console.log('A PROFILES before/after:', before.profiles, '->', after.profiles, ' ids', J(before.ids), '->', J(after.ids));
    await cx.close();
  }

  /* B */
  {
    const reqs = [], remote = {};
    const { cx, pg } = await newPage(true, remote, reqs);
    const step = async (label, fn) => {
      const n0 = reqs.length;
      const r = fn ? await fn() : null;
      const res = await pg.evaluate(() => authProfileSync().then(r => r, e => ({ threw: String(e) })));
      const s = await snap(pg);
      const mine = reqs.slice(n0).map(q => q.method + ' ' + q.path + (q.bytes ? ' (' + q.bytes + ' bytes, name=' + (q.name ? 'Y' : 'n') + ' story=' + (q.story ? 'Y' : 'n') + ')' : ''));
      console.log('B ' + label + ' -> ' + J(res) + '  requests: ' + J(mine) + '  meta: ' + J(s.meta) + '  profiles=' + s.profiles + ' stories=' + s.stories + ' remoteVersion=' + (remote['state/atuned.primary-profile'] ? remote['state/atuned.primary-profile'].version : 'none'));
      return { label, res, mine, s };
    };
    result.B = [];
    result.B.push(await step('1 first call, no remote record', null));
    result.B.push(await step('2 second call, nothing changed', null));
    result.B.push(await step('3 an edit (second story), then call', () => pg.evaluate(() => { CURP.story.entries.push({ t: new Date().toISOString(), text: 'Second entry about the kitchen.', imprints: 0, bands: [], lex: LEX_VERSION }); CURP.updated = new Date(Date.now() + 1000).toISOString(); return pSave(); })));
    const rb = remote['state/atuned.primary-profile'];
    result.B.remoteBody = rb ? { keys: Object.keys(rb.body), name: rb.body.name, who: rb.body.who, storyText: rb.body.story && rb.body.story.entries && rb.body.story.entries.map(e => e.text.slice(0, 40)) } : null;
    console.log('B the remote record holds: name=' + J(result.B.remoteBody && result.B.remoteBody.name) + ' who=' + J(result.B.remoteBody && result.B.remoteBody.who) + ' stories=' + J(result.B.remoteBody && result.B.remoteBody.storyText));
    result.B.push(await step('4 clean again, nothing changed', null));
    result.B.push(await step('5 local delete (accProfDelete), then call', () => pg.evaluate(() => { window.confirm = () => true; const id = CURP.id; const r = accProfDelete(id); return { deleted: r, id: id.slice(-6) }; })));
    const fin = await snap(pg);
    console.log('B after the local delete and the next call: profiles=' + fin.profiles + ' ids=' + J(fin.ids) + ' name=' + J(fin.curName) + ' stories=' + fin.stories);
    result.B.push({ final: fin });
    await cx.close();
  }

  /* B2: the audit's first-sync claim, with the edit made BEFORE the first call so hash differs from nothing */
  {
    const reqs = [], remote = {};
    const { cx, pg } = await newPage(true, remote, reqs);
    const r1 = await pg.evaluate(() => authProfileSync());
    const r2 = await pg.evaluate(() => authProfileSync());
    const meta = await pg.evaluate(() => JSON.parse(localStorage.getItem('source.profile.sync') || 'null'));
    console.log('B2 two calls with a profile already full and an empty server: ' + J([r1, r2]) + ' PUT requests=' + reqs.filter(q => q.method === 'PUT').length + ' server holds=' + J(Object.keys(remote)) + ' local meta says version=' + (meta && meta.version) + ' hash set=' + !!(meta && meta.hash));
    result.B2 = { r1, r2, puts: reqs.filter(q => q.method === 'PUT').length, serverHolds: Object.keys(remote), meta };
    await cx.close();
  }

  /* E: size against the cap */
  {
    const reqs = [], remote = {};
    const { cx, pg } = await newPage(false, remote, reqs);
    const sz = await pg.evaluate(() => {
      const out = { blank: pExport().length, steps: [] };
      const long = 'I was furious and ashamed and afraid. '.repeat(12);   // about 450 characters, a normal entry
      for (let i = 1; i <= 300; i++) {
        const P = parseStory(long); applyStory(long); verpApply(long); leanApply(long);
        CURP.story.entries.push({ t: new Date().toISOString(), text: long, imprints: P.imprints.length, bands: P.bands, lex: LEX_VERSION });
        pSnap();
        if (i === 1 || i === 5 || i === 10 || i === 25 || i === 50 || i === 100 || i === 200 || i === 300) out.steps.push({ stories: i, snapshots: CURP.history.length, exportChars: pExport().length });
      }
      return out;
    });
    console.log('E pExport() size, characters (Worker cap per record body is 200000):'); console.log('  blank profile ' + sz.blank);
    sz.steps.forEach(s => console.log('  ' + s.stories + ' stories, ' + s.snapshots + ' snapshots: ' + s.exportChars));
    result.E = sz;
    await cx.close();
  }
  fs.writeFileSync(OUT, J(result, null, 1));
  await browser.close();
})().catch(e => { console.error('PROBE THREW', e); process.exit(1); });
