/* Pass 3 probe: what does the built page send to the Worker?
   node probe-p3.js <source.html> <mode> <seconds> <out.json>
   modes:
     shipped     main as built. A held session, a profile with a name and a story.
     signin      main as built. No session held; the page signs in through authEnter, as the Log in card does.
     counter     COUNTERFACTUAL. Same as shipped but window.profiles is defined, which is the one thing
                 profileSyncEligible lacks. Shows what the dead sync would do if it were woken.
     counter-remote  COUNTERFACTUAL with a remote record already on the server.
   Every request to the Worker is answered by a stub that keeps records the way PUT /v1/sync does. */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const SRC = path.resolve(process.argv[2]);
const MODE = process.argv[3];
const SECS = Number(process.argv[4] || 45);
const OUT = process.argv[5];
const WORKER = 'https://atuned-api.lance-o-powell.workers.dev';
const NAME = { display: 'Zephyrine Quillfeather', first: 'Zephyrine', middle: 'Marguerite', last: 'Quillfeather',
  place: 'Reykjavik', date: '1984-03-02', time: '04:15' };
const STORY = 'My father shouted at me on the porch at Marrowgate Lane and I was furious and ashamed. Probe marker seven seven three one.';
const STORY2 = 'Second entry added later: the kitchen at Marrowgate Lane, I felt afraid and tight in my chest.';
const ACC = { id: 'acc_probe', research_id: 'rsh_probe', plan: 1, email: 'probe@example.invalid' };
const J = x => JSON.stringify(x);
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const url = 'file://' + SRC + '?dev=1';
  const booted = pg => pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 }).catch(() => null);

  /* 1. seed: build a profile with a name, birth details and a story, read it back out of storage */
  let profilesText = '';
  {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    await cx.route(WORKER + '/**', r => r.abort());
    const pg = await cx.newPage();
    await pg.goto(url, { waitUntil: 'load' }); await booted(pg);
    const info = await pg.evaluate(a => {
      CURP.name = a.N.display;
      CURP.who.first = a.N.first; CURP.who.middle = a.N.middle; CURP.who.last = a.N.last; CURP.who.sex = 'f';
      CURP.who.born.date = a.N.date; CURP.who.born.time = a.N.time; CURP.who.born.place = a.N.place; CURP.who.born.zone = 'Atlantic/Reykjavik';
      CURP.ui.onboarded = true; CURP.ui.tutorialSeen = true;
      const P = parseStory(a.S); applyStory(a.S); verpApply(a.S); leanApply(a.S);
      CURP.story.entries.push({ t: new Date().toISOString(), text: a.S, imprints: P.imprints.length, bands: P.bands, lex: LEX_VERSION });
      const ok = pSave();
      const exp = pExport();
      return { ok, profiles: PROFILES.length, exportBytes: exp.length, topKeys: Object.keys(JSON.parse(exp)),
        whoKeys: Object.keys(JSON.parse(exp).who), bornKeys: Object.keys(JSON.parse(exp).who.born),
        store: localStorage.getItem('source.profiles'), typeofProfiles: typeof profiles, typeofPROFILES: typeof PROFILES };
    }, { N: NAME, S: STORY });
    console.log('seed', J({ ok: info.ok, profiles: info.profiles, exportBytes: info.exportBytes, typeofProfiles: info.typeofProfiles, typeofPROFILES: info.typeofPROFILES }));
    console.log('pExport top keys', J(info.topKeys)); console.log('who keys', J(info.whoKeys), 'born keys', J(info.bornKeys));
    profilesText = info.store;
    await cx.close();
  }

  /* 2. the run */
  const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const remote = {};   // kind/id -> record, as the Worker keeps them
  if (MODE === 'counter-remote') {
    const p = JSON.parse(profilesText)[0];
    const body = JSON.parse(JSON.stringify(p)); body.updated = '2000-01-01T00:00:00.000Z';
    remote['state/atuned.primary-profile'] = { kind: 'state', id: 'atuned.primary-profile', version: 3, body, deleted: false, updated_at: 1 };
  }
  const log = [], other = [], errs = [], t0 = Date.now();
  const at = () => +(((Date.now() - t0) / 1000).toFixed(1));
  const hit = (body, s) => body.indexOf(s) >= 0;
  await cx.route(WORKER + '/**', async route => {
    const req = route.request(), u = new URL(req.url()), body = req.postData() || '';
    let keys = null; try { keys = Object.keys(JSON.parse(body)); } catch (e) {}
    log.push({ t: at(), method: req.method(), path: u.pathname + u.search, bytes: body.length, bodyKeys: keys,
      name_full: hit(body, NAME.display), first: hit(body, NAME.first), middle: hit(body, NAME.middle), last: hit(body, NAME.last),
      birthDate: hit(body, NAME.date), birthTime: hit(body, NAME.time), birthPlace: hit(body, NAME.place),
      storyText: hit(body, 'Marrowgate'), storyMarker: hit(body, 'seven seven three one'), auth: !!req.headers()['authorization'] });
    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type, x-funnel-credential',
      'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS' };
    const send = (st, b) => route.fulfill({ status: st, headers: Object.assign({ 'content-type': 'application/json' }, cors), body: J(b) });
    const m = req.method(), p = u.pathname;
    if (m === 'OPTIONS') return route.fulfill({ status: 204, headers: cors, body: '' });
    if (m === 'GET' && p === '/v1/me') return send(200, { account: ACC, consent: { share: false, at: null, v: 1 }, records: Object.keys(remote).length, entitlement: null, billing: null });
    if (m === 'GET' && p === '/v1/sync') return send(200, { records: Object.values(remote), at: Date.now(), more: false, cursor: null });
    if (m === 'PUT' && p === '/v1/sync') {
      let b = {}; try { b = JSON.parse(body); } catch (e) {}
      const kept = [], stale = [];
      (b.records || []).forEach(r => { const k = r.kind + '/' + r.id, ex = remote[k];
        if (!ex || r.version > ex.version) { remote[k] = { kind: r.kind, id: r.id, version: r.version, body: r.body, deleted: !!r.deleted, updated_at: Date.now() }; kept.push({ kind: r.kind, id: r.id, version: r.version }); }
        else stale.push({ kind: r.kind, id: r.id, version: ex.version }); });
      return send(200, { kept, stale, at: Date.now() });
    }
    if (m === 'POST' && p === '/v1/auth/signin') return send(200, { token: 'tok-probe-signin', account: ACC });
    if (m === 'POST' && p === '/v1/funnel/session') return send(201, { session: { id: 'fs_probe', anonymousId: 'anon_probe', version: 1 }, credential: 'cred-probe' });
    if (p.indexOf('/v1/funnel/session/') === 0) return send(200, { session: { id: 'fs_probe', anonymousId: 'anon_probe', version: 2, userId: ACC.id } });
    return send(404, { error: 'no such route' });
  });
  cx.on('request', r => { const u = r.url(); if (!/^(file|data|blob|about):/.test(u) && u.indexOf(WORKER) !== 0) other.push({ t: at(), method: r.method(), url: u.slice(0, 120) }); });
  await cx.addInitScript(a => {
    try {
      if (!sessionStorage.getItem('__seeded')) {
        sessionStorage.setItem('__seeded', '1');
        localStorage.setItem('source.profiles', a.profiles);
        if (a.session) localStorage.setItem('source.session', JSON.stringify({ token: 'tok-probe-1', email: 'probe@example.invalid', accountId: 'acc_probe' }));
      }
    } catch (e) {}
    if (a.counter) window.profiles = function () { return PROFILES; };
  }, { profiles: profilesText, session: MODE !== 'signin', counter: /^counter/.test(MODE) });

  const pg = await cx.newPage();
  pg.on('pageerror', e => errs.push({ t: at(), e: String(e && e.message || e).slice(0, 200) }));
  await pg.goto(url, { waitUntil: 'load' }); await booted(pg);
  const probe0 = await pg.evaluate(() => ({ typeofProfiles: typeof profiles, session: localStorage.getItem('source.session') ? 'held' : 'none',
    curpName: CURP && CURP.name, stories: CURP && CURP.story.entries.length, eligible: typeof profileSyncEligible === 'function' ? profileSyncEligible() : 'nofn',
    timer: typeof PROFILE_SYNC_TIMER !== 'undefined' ? !!PROFILE_SYNC_TIMER : 'novar' }));
  console.log('after boot t=' + at(), J(probe0));
  if (MODE === 'signin') {
    const r = await pg.evaluate(() => authEnter('signin', 'probe@example.invalid', 'a-long-password-1'));
    console.log('authEnter ->', J(r), 't=' + at());
  }
  const samples = [];
  const sample = async tag => {
    const s = await pg.evaluate(() => ({ meta: localStorage.getItem('source.profile.sync'), timer: !!PROFILE_SYNC_TIMER, busy: PROFILE_SYNC_BUSY,
      stories: CURP && CURP.story.entries.length, eligible: profileSyncEligible() }));
    samples.push(Object.assign({ t: at(), tag }, s));
  };
  await sample('boot');
  let edited = false;
  const end = Date.now() + SECS * 1000;
  while (Date.now() < end) {
    await pg.waitForTimeout(5000);
    if (!edited && at() >= 34) {
      edited = true;
      const r = await pg.evaluate(a => { CURP.story.entries.push({ t: new Date().toISOString(), text: a, imprints: 0, bands: [], lex: LEX_VERSION }); CURP.updated = new Date().toISOString(); return pSave(); }, STORY2);
      console.log('edit at t=' + at() + ' (a second entry saved, pSave=' + r + ')');
    }
    await sample('tick');
  }
  // a direct call, to see what the function itself says
  const direct = await pg.evaluate(() => authProfileSync().then(r => r, e => ({ threw: String(e) })));
  console.log('direct authProfileSync() at t=' + at() + ' ->', J(direct));
  await sample('end');
  const res = { mode: MODE, secs: SECS, file: SRC, probe0, requests: log, otherNetwork: other, pageErrors: errs, samples, remoteKept: Object.keys(remote), direct };
  fs.writeFileSync(OUT, J(res, null, 1));
  console.log('\n=== REQUEST LOG, mode ' + MODE + ' ===');
  console.log('t(s)  method path  | body bytes | name/first/middle/last | born date/time/place | story text/marker');
  log.forEach(r => console.log(String(r.t).padStart(5) + ' ' + r.method.padEnd(6) + r.path.padEnd(32) + ' | ' + String(r.bytes).padStart(6) + ' | '
    + [r.name_full, r.first, r.middle, r.last].map(b => b ? 'Y' : '-').join('') + ' | ' + [r.birthDate, r.birthTime, r.birthPlace].map(b => b ? 'Y' : '-').join('') + ' | '
    + [r.storyText, r.storyMarker].map(b => b ? 'Y' : '-').join('') + (r.bodyKeys ? ' keys=' + r.bodyKeys.join(',') : '')));
  console.log('non-Worker network:', J(other));
  console.log('page errors:', J(errs));
  console.log('meta samples:'); samples.forEach(s => console.log('  t=' + s.t + ' ' + s.tag + ' timer=' + s.timer + ' eligible=' + s.eligible + ' stories=' + s.stories + ' meta=' + s.meta));
  await browser.close();
})().catch(e => { console.error('PROBE THREW', e); process.exit(1); });
