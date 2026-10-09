#!/usr/bin/env node
/* ============================================================
   THE RECORD IN A LINK, IN A REAL BROWSER, round QZ.
   NODE_PATH=/opt/node22/lib/node_modules node tests/recordlink.js
   SHOTS=dir  also writes the screenshots a person looks at

   The quiz can open the app with the reading packed into the address after
   #r=, and the app loads it through pImport, the same boundary the paste box
   uses. tests/engine.js group 15f holds the wire format headless. This holds
   what only a browser can, end to end, with nothing stubbed:

     the quiz builds the link from a real set of answers, off the same anchor
     as its door to the app, and the link carries the record recordJSON gives;
     the app opened on that link loads the record, says so through status(),
     and takes the record off the address so a reload does not load it twice;
     a link that is cut, damaged, from a later format, not JSON, or a record
     the boundary refuses, is refused by name through importError, and the
     profile list, the open profile and the stored bytes do not move;
     the built quiz in funnel/dist reaches atuned.html beside it, and the
     packed build, which rewrites its own document, still sees the address.

   CHECKED AGAINST TWO KNOWN BAD COPIES FIRST, the standing rule. One app
   whose boot step never reads the link: the load check must fail on it. One
   whose link importer skips the boundary and pushes whatever it unpacks: the
   refusal check must fail on it. A gate that passes a broken build is not a
   gate.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const fs = require('fs'), path = require('path'), os = require('os'), zlib = require('zlib');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'source.html');
const QUIZ = path.join(ROOT, 'funnel', 'quiz.html');
const DISTQ = path.join(ROOT, 'funnel', 'dist', 'atuned-quiz.html');
const E = require(path.join(ROOT, 'engine.js'));
const SHOTS = process.env.SHOTS || '';

let n = 0; const fails = [];
const ok = (c, m) => { n++; if (!c) fails.push(m); console.log((c ? '  ok    ' : '  FAIL  ') + m); };
const booted = pg => pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 });
const shot = async (pg, nm) => { if (SHOTS) { await pg.screenshot({ path: path.join(SHOTS, nm) }); console.log('  shot  ' + nm); } };

/* a real set of answers: every question answered, spread across the scale */
async function quizLink(browser, file, w, h, nm) {
  const cx = await browser.newContext({ viewport: { width: w, height: h } });
  const pg = await cx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e && e.message || e)));
  await pg.goto('file://' + file, { waitUntil: 'load' });
  await pg.evaluate(() => { A = {}; QQ.forEach((q, i) => { A[i] = (i * 7 + 3) % 5; }); save(); STATE = 'door'; render(); });
  await pg.waitForSelector('#tolink[data-ready="1"]', { timeout: 10000 });
  const o = await pg.evaluate(() => ({
    href: document.getElementById('tolink').href,
    door: document.getElementById('toapp').href,
    json: recordJSON(),
    say: (document.getElementById('linksay') || {}).textContent || '',
    tag: document.getElementById('tolink').tagName
  }));
  if (nm) {
    /* the door from its heading, under the sticky bar, so the shot shows the
       control with the words that explain it */
    await pg.evaluate(() => { const d = document.querySelector('.door'); scrollTo(0, d.getBoundingClientRect().top + scrollY - 120); });
    await shot(pg, nm);
  }
  o.errs = errs;
  await cx.close();
  return o;
}

/* the app's own state, read the way the boundary sees it */
const appState = pg => pg.evaluate(() => ({
  names: PROFILES.map(p => p.name), curp: CURP && CURP.id, curName: CURP && CURP.name,
  stored: localStorage.getItem(PKEY), hash: location.hash, href: location.href,
  status: (document.getElementById('status') || {}).textContent || '',
  kind: (document.getElementById('status') || { getAttribute() { return null; } }).getAttribute('data-kind'),
  err: importError(), log: (typeof MSG_LOG !== 'undefined' ? MSG_LOG.map(m => m.msg) : [])
}));

/* WHAT A PERSON SEES SAID. The line waits for the boot sheet to lift and then
   shows for three seconds, so it is read the moment it lands in the message
   log, off the screen, and not after a fixed sleep that may straddle the fade.
   Null when nothing about the link was said within the limit. */
const said = (pg, ms) => pg.waitForFunction(() => {
  const m = (typeof MSG_LOG !== 'undefined' ? MSG_LOG : []).filter(x => / from the link[.:]/.test(x.msg)).pop();
  if (!m) return null;
  const s = document.getElementById('status'), l = document.getElementById('loginmsg');
  return { msg: m.msg, kind: m.kind, shown: s ? s.textContent : '', shownKind: s ? s.getAttribute('data-kind') : null,
    card: l ? l.textContent : null, lifted: isBooted() };
}, null, { timeout: ms || 12000 }).then(h => h.jsonValue(), () => null);

/* open a link on a fresh boot in this context. about:blank between, because a
   change of fragment alone is not a page load and would never reach the boot. */
async function openLink(pg, url) {
  await pg.goto('about:blank');
  await pg.goto(url, { waitUntil: 'load' });
  await booted(pg);
  const name = await pg.evaluate(() => RECORD_LINK ? RECORD_LINK.then(p => p ? p.name : null) : 'no step');
  const line = await said(pg);
  return { name, line, st: await appState(pg) };
}

/* a link with the given payload after r= */
const withPayload = (file, payload, dev) => 'file://' + file + (dev ? '?dev=1' : '') + '#r=' + payload;
const gz = txt => E.linkWrap(new Uint8Array(zlib.gzipSync(Buffer.from(txt, 'utf8'))));

/* the success case against an app file. Returns what a check needs. */
async function loadCase(browser, file, payload, w, h, nm) {
  const cx = await browser.newContext({ viewport: { width: w, height: h } });
  const pg = await cx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e && e.message || e)));
  await pg.goto('file://' + file + '?dev=1', { waitUntil: 'load' });
  await booted(pg);
  const before = await appState(pg);
  const r = await openLink(pg, withPayload(file, payload, true));
  /* the reading, computed by the app off the record it now holds */
  r.cq = await pg.evaluate(() => Math.round(compute().CQ));
  r.rec = await pg.evaluate(() => JSON.stringify({ laws: CURP.laws, axes: CURP.axes }));
  if (nm) { await pg.waitForTimeout(600); await shot(pg, nm); }
  /* and a reload does not load it a second time */
  await pg.reload({ waitUntil: 'load' }); await booted(pg);
  r.reload = await appState(pg);
  r.before = before; r.errs = errs;
  await cx.close();
  return r;
}

/* a refusal case: boots clean, records the state, opens the bad link, and
   reports whether anything moved */
async function refuseCase(browser, file, payload) {
  const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const pg = await cx.newPage();
  await pg.goto('file://' + file + '?dev=1', { waitUntil: 'load' });
  await booted(pg);
  /* the first boot wrote the person's own blank record to the store, so a
     refusal has real stored bytes to leave alone */
  const before = await appState(pg);
  const r = await openLink(pg, withPayload(file, payload, true));
  r.before = before;
  r.moved = before.stored !== r.st.stored || before.curp !== r.st.curp
    || before.names.join('|') !== r.st.names.join('|');
  await cx.close();
  return r;
}

(async () => {
  for (const f of [SRC, QUIZ, DISTQ]) if (!fs.existsSync(f)) {
    console.log(path.relative(ROOT, f) + ' is missing: run ./atuned_src/BUILD.sh, BUILD-engine.sh and funnel/BUILD-single.sh');
    process.exit(1); }
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'reclink-'));
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const html = fs.readFileSync(SRC, 'utf8');

  console.log('\n=== the quiz builds the link ===');
  const q = await quizLink(browser, QUIZ, 1600, 1000, 'quiz-link-1600.png');
  const q390 = await quizLink(browser, QUIZ, 390, 844, 'quiz-link-390.png');
  ok(q.tag === 'A', 'the control is a link, an a, so it can be opened in a new tab and shows where it goes');
  ok(q.href.indexOf(q.door.split('#')[0] + '#r=' + E.LINK_V + '.') === 0,
    'the link is the door\'s own address with the record after #r=, ' + q.href.slice(0, 60) + '...');
  const payload = q.href.split('#r=')[1];
  const back = E.linkUnwrap(payload);
  const text = back ? zlib.gunzipSync(Buffer.from(back)).toString('utf8') : '';
  /* recordJSON mints a new id and time on each call, so the file a person
     saves and the link differ there and must agree everywhere else */
  const bare = t => { try { const o = JSON.parse(t); ['id', 'created', 'updated'].forEach(k => delete o[k]); return JSON.stringify(o); } catch (e) { return 'unreadable'; } };
  ok(text.length > 500 && bare(text) === bare(q.json),
    'and it carries the record recordJSON gives the file, ' + text.length + ' bytes, apart from its own id and time');
  console.log('  record ' + q.json.length + ' bytes as JSON, link ' + q.href.length
    + ' characters, of which ' + payload.length + ' are the record');
  ok(q.href.length < 4000, 'the whole link stays short enough for any browser and any messenger, '
    + q.href.length + ' characters');
  ok(/# mark/.test(q.say) && /never sends/.test(q.say) && /clears it/.test(q.say),
    'the line beside it says, in plain words, where the record travels and that it is cleared');
  /* not the same bytes: every record is minted with its own id and time, so
     two packings of one set of answers differ there and nowhere else */
  {
    const unpack = h => JSON.parse(zlib.gunzipSync(Buffer.from(E.linkUnwrap(h.split('#r=')[1]))).toString('utf8'));
    const a = unpack(q.href), b = unpack(q390.href);
    ['id', 'created', 'updated'].forEach(k => { delete a[k]; delete b[k]; });
    ok(JSON.stringify(a) === JSON.stringify(b), 'the same answers make the same record at 390, apart from its own id and time');
  }
  ok(q.errs.length === 0 && q390.errs.length === 0, 'the quiz threw nothing: ' + q.errs.concat(q390.errs).slice(0, 2).join(' | '));

  console.log('\n=== known bad copies first: the checks below can fail ===');
  {
    const tag = 'RECORD_LINK=recordLinkBoot();';
    const noStep = path.join(tmp, 'nostep.html');
    ok(html.indexOf(tag) >= 0, 'the boot step line is in source.html, so its broken copy tests something');
    fs.writeFileSync(noStep, html.replace(tag, 'RECORD_LINK=null;'));
    const r = await loadCase(browser, noStep, payload, 1600, 1000);
    ok(r.st.curName !== 'Web reading', 'on a copy that never reads the link, no record loads, so the load check can fail: open is '
      + JSON.stringify(r.st.curName));

    const strict = 'return pImport(txt);';
    const loose = path.join(tmp, 'loose.html');
    ok(html.indexOf(strict) >= 0, 'the link importer\'s pImport call is in source.html, so its loose copy tests something');
    fs.writeFileSync(loose, html.replace(strict,
      'var o=JSON.parse(txt);PROFILES.push(o);CURP=o;pPersist();return o;'));
    const b = await refuseCase(browser, loose, gz('{"v":2,"name":"broken","avatar":"not an object"}'));
    ok(b.moved, 'on a copy whose link skips the boundary, a refused record lands, so the refusal check can fail: open is '
      + JSON.stringify(b.st.curName));
  }

  console.log('\n=== the app opens with the record in it ===');
  for (const [w, h] of [[1600, 1000], [390, 844]]) {
    const r = await loadCase(browser, SRC, payload, w, h, 'app-loaded-' + w + '.png');
    ok(r.name === 'Web reading' && r.st.curName === 'Web reading',
      '@' + w + ': the record loaded and is the open profile, ' + JSON.stringify(r.st.curName));
    ok(r.st.names.length === r.before.names.length + 1,
      '@' + w + ': as one new record, ' + r.before.names.length + ' before, ' + r.st.names.length + ' after');
    const want = JSON.parse(q.json);
    ok(r.rec === JSON.stringify({ laws: want.laws, axes: want.axes }),
      '@' + w + ': the laws and charges the app holds are the ones the quiz scored');
    const ln = r.line || {};
    ok(/^Loaded Web reading from the link\. Nothing else was touched\.$/.test(ln.shown || '') && ln.lifted && !ln.shownKind,
      '@' + w + ': status() says so on screen once the boot sheet has lifted, showed ' + JSON.stringify(ln.shown));
    ok(r.st.hash === '' && r.st.href.indexOf('#r=') < 0 && r.st.href.indexOf('?dev=1') > 0,
      '@' + w + ': the record is off the address and the rest of it is kept, ' + r.st.href.split('/').pop());
    ok(JSON.parse(r.st.stored).some(p => p.name === 'Web reading'), '@' + w + ': and it is in the stored record list');
    ok(r.reload.names.length === r.st.names.length,
      '@' + w + ': a reload does not load it twice, ' + r.reload.names.length + ' records after the reload');
    ok(r.errs.length === 0, '@' + w + ': the app threw nothing: ' + r.errs.slice(0, 2).join(' | '));
    if (w === 1600) console.log('  coherence in the app ' + r.cq + '   open after a reload: '
      + JSON.stringify(r.reload.curName) + ', which no route persists, see the report');
  }

  console.log('\n=== through the login door, without the developer skip ===');
  {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const pg = await cx.newPage();
    await pg.goto('file://' + SRC + '#r=' + payload, { waitUntil: 'load' });
    await booted(pg);
    const nm = await pg.evaluate(() => RECORD_LINK ? RECORD_LINK.then(p => p ? p.name : null) : 'no step');
    const line = await said(pg) || {};
    const st = await appState(pg);
    const door = await pg.waitForSelector('#loginb-skip', { state: 'visible', timeout: 15000 }).then(() => true, () => false);
    ok(nm === 'Web reading' && st.curName === 'Web reading', 'the record loads under the door, ' + JSON.stringify(st.curName));
    ok(door, 'and the door still stands, so the link is not a way round it');
    ok(/^Loaded Web reading from the link/.test(line.card || ''),
      'and the door\'s own message line carries it, because the door covers the status line, showed ' + JSON.stringify(line.card));
    ok(st.log.some(m => /^Loaded Web reading from the link/.test(m)), 'and the message log holds it too');
    await shot(pg, 'app-door-1600.png');
    await cx.close();
  }

  console.log('\n=== refused by name, and nothing moves ===');
  const cut = payload.slice(0, payload.length - 8);           /* a whole group short: the gzip ends early */
  const body = payload.slice(E.LINK_V.length + 1);
  const mid = Math.floor(payload.length / 2);
  const flip = payload.slice(0, mid) + (payload[mid] === 'A' ? 'B' : 'A') + payload.slice(mid + 1);
  const cases = [
    ['cut short, the end of the gzip missing', cut, /could not be unpacked|cut short/],
    ['cut mid group', E.LINK_V + '.' + body.slice(0, body.length - ((body.length - 1) % 4) - 4), /cut short/],
    ['damaged in the middle', flip, /damaged|could not be unpacked|not valid JSON/],
    ['from a later format', '9.' + payload.slice(2), /format 9/],
    ['carrying characters a link never has', E.LINK_V + '.' + payload.slice(2, 40) + '!!' + payload.slice(40), /damaged/],
    ['not JSON once unpacked', gz('this is not a record'), /not valid JSON/],
    ['a record the boundary refuses', gz('{"v":2,"name":"broken","avatar":"not an object"}'), /avatar/],
    ['a record with a charge of 9999', gz((() => { const p = JSON.parse(q.json); p.axes.Fear.held = 9999; return JSON.stringify(p); })()), /9999/]];
  for (const [nm, pl, want] of cases) {
    const r = await refuseCase(browser, SRC, pl);
    ok(r.name === null && !r.moved,
      nm + ': not loaded, and the list, the open profile and the stored bytes did not move');
    const ln = r.line || {};
    ok(/^Not loaded from the link: /.test(ln.shown || '') && ln.shownKind === 'fail' && want.test(String(r.st.err))
      && ln.shown.indexOf(String(r.st.err).slice(0, 20)) > 0,
      '  and it says why by name, the importError reason on screen, ' + JSON.stringify((ln.shown || '').slice(0, 110)));
    ok(r.st.hash === '', '  and the bad link is off the address too');
  }

  console.log('\n=== a browser without the streams says so, on both pages ===');
  {
    /* the quiz: no CompressionStream, so no link. The control must go, not
       sit there promising the record, and the note must say what to do. */
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    await cx.addInitScript(() => { delete window.CompressionStream; });
    const pg = await cx.newPage();
    await pg.goto('file://' + QUIZ, { waitUntil: 'load' });
    await pg.evaluate(() => { A = {}; QQ.forEach((q, i) => { A[i] = 2; }); save(); STATE = 'door'; render(); });
    await pg.waitForFunction(() => /cannot pack/.test((document.getElementById('dlnote') || {}).textContent || ''), null, { timeout: 8000 }).catch(() => {});
    const o = await pg.evaluate(() => ({
      shown: !!document.getElementById('tolink').getClientRects().length,
      say: !!document.getElementById('linksay').getClientRects().length,
      note: document.getElementById('dlnote').textContent, save: !!document.getElementById('dl').getClientRects().length }));
    ok(!o.shown && !o.say && o.save && /Save it instead/.test(o.note),
      'the quiz hides the link and its line and points at Save, said ' + JSON.stringify(o.note));
    await cx.close();
    /* the app: no DecompressionStream, so a good link cannot be unpacked */
    const cx2 = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    await cx2.addInitScript(() => { delete window.DecompressionStream; });
    const pg2 = await cx2.newPage();
    await pg2.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' }); await booted(pg2);
    const before = await appState(pg2);
    const r = await openLink(pg2, withPayload(SRC, payload, true));
    const ln = r.line || {};
    ok(r.name === null && before.stored === r.st.stored && before.curp === r.st.curp
      && /cannot unpack a record link/.test(ln.shown || '') && ln.shownKind === 'fail',
      'the app refuses by name and moves nothing, showed ' + JSON.stringify((ln.shown || '').slice(0, 90)));
    await cx2.close();
  }

  console.log('\n=== the built pages: dist quiz to atuned.html, and the packed app ===');
  {
    const dir = path.join(tmp, 'sent'); fs.mkdirSync(dir);
    fs.copyFileSync(DISTQ, path.join(dir, 'atuned-quiz.html'));
    fs.copyFileSync(SRC, path.join(dir, 'atuned.html'));
    const d = await quizLink(browser, path.join(dir, 'atuned-quiz.html'), 1600, 1000);
    ok(/\/atuned\.html#r=/.test(d.href), 'the built quiz links atuned.html beside it, ' + d.href.split('/').pop().slice(0, 30) + '...');
    const r = await loadCase(browser, path.join(dir, 'atuned.html'), d.href.split('#r=')[1], 1600, 1000);
    ok(r.st.curName === 'Web reading', 'and the app saved beside it loads the record, ' + JSON.stringify(r.st.curName));

    /* the packed file inflates itself and writes the document again. The
       address has to survive that or the delivery build silently drops it. */
    const slim = path.join(ROOT, 'atuned-slim.html');
    if (fs.existsSync(slim)) {
      const packed = path.join(tmp, 'packed.html');
      execFileSync('node', [path.join(ROOT, 'tools', 'pack.js'), path.relative(ROOT, slim), path.relative(ROOT, packed)], { stdio: 'ignore' });
      const pr = await loadCase(browser, packed, payload, 1600, 1000);
      ok(pr.st.curName === 'Web reading' && pr.st.hash === '',
        'the packed build loads it too and clears the address, ' + JSON.stringify(pr.st.curName));
    } else ok(false, 'atuned-slim.html is missing, so the packed build was not checked: run ./atuned_src/BUILD.sh');
  }

  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed =====');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
