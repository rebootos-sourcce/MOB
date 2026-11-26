#!/usr/bin/env node
/* ============================================================
   GLASS BLUE, THE EIGHTH LIGHTING. 18 November.

   env NODE_PATH=$(npm root -g) CHROME=<path to a chromium> \
     flock /tmp/atuned-gates.lock node tests/glassblue.js
   GLASSBLUE_HTML=file      runs against another build, for checking the checker
   GLASSBLUE_BASELINE=file  also compares Glass white, element by element,
                            against a build from before this lighting was added
   GLASSBLUE_PRINT=1        prints the measured table and stops asserting on it
   GLASSBLUE_ONLY=1,2       runs only those sections (3 to 5 run together), for
                            checking one check against its mutant quickly

   The owner, 18 November, choosing from the palette board: "Let's go with B.
   For the palette. And let's add that as a new light mode." B was Glass white
   with its neutral greys moved from warm cream toward blue. It was added as a
   lighting of its own, glassblue, whose body carries BOTH classes, glasswhite
   and glassblue, so every Glass white rule and every canvas check keeps
   working on it and the new class only overrides the neutral colours.

   WHAT THIS HOLDS

     1  the picker: every lighting LIGHTINGS names reaches the bar and the
        phone menu, each as a ring mark with its name for a header and one
        short sentence for a body, through the one tooltip, on hover at 1600
        and on a held press at 390, with the entries clear of each other
     2  the state: choosing it puts both classes on the body and no other
        lighting's, the choice survives a tab change, a profile load and a
        render, the Settings list says it, and a reload never leaves a half
        state (see 2c: the lighting is not stored today, and this says so)
     3  the colour: the surfaces the 14 November picture showed, measured in a
        real render, against the colours read out of that picture, within two
        levels each
     4  Glass white did not move: its tokens and the same measured surfaces are
        the baseline's exactly, and with GLASSBLUE_BASELINE every element's
        painted colours are the baseline build's too
     5  the text still reads: ink and mid hold the 4.5 to 1 text floor that
        tests/design.js holds, on every main surface, and dim and the accent
        give up less than five percent of what Glass white reads
     6  the canvases follow: the Field, the Compass and the seat colours take
        the light ladder, and no warm cream is left in what they paint
     7  nothing warm is left behind: every cream literal a Glass white rule or a
        canvas carries has its blue twin, read out of the stylesheet and the
        script, so a cream added later fails here and not on a screenshot
     8  the home screen: Discover, where the app opens, is a cool light surface
        in Glass blue and not a patch of the old warm one, read out of the
        pixels of the whole stage, blank and loaded, at 1600 and 390
     9  Settings, Lighting: every lighting whole, inside its tray and the
        screen, at every width from 320 up, an even grid at phone width
    10  the bar's lighting menu opens on top, in every lighting LIGHTINGS names,
        on Discover, the Dashboard and the Field, read by what the browser
        puts at the centre of each entry

   THE TARGETS ARE THE OWNER'S PICTURE, not this build. The exact settings
   behind variant B were lost, so its colours were read back out of the image
   (palette board, "Real app, palette variant B (more blue)", 1600 by 1000,
   drawn on the 14 November Dashboard) surface against the same surface in a
   Glass white render. The table is in SURF below, each target with the
   surface it was read from. Two surfaces in the picture could not be matched
   and are left out on purpose: the left rail's cards and the stage's
   vignette, because the 14 November layout stacked different panes there, so
   the same pixel is a different surface.

   EVERY CHECK HAS ITS OWN MUTANT. Each assertion below was proved on a scratch
   copy of the real build with the one defect it exists for, and fails there
   and passes here. The mutant ids are in DECISIONS.md under the 18 November
   ruling. No count is typed into this file. Read the counts off the run.
   ============================================================ */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const SRC = process.env.GLASSBLUE_HTML ? path.resolve(process.env.GLASSBLUE_HTML) : path.join(ROOT, 'source.html');
const BASE = process.env.GLASSBLUE_BASELINE ? path.resolve(process.env.GLASSBLUE_BASELINE) : null;
const PRINT = !!process.env.GLASSBLUE_PRINT;
const ONLY = process.env.GLASSBLUE_ONLY ? process.env.GLASSBLUE_ONLY.split(',').map(x => x.trim()) : null;
const want = n => !ONLY || ONLY.includes(String(n));
const CHROME = process.env.CHROME || chromium.executablePath();

let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) { PASS++; console.log('  ok    ' + m); } else { FAIL++; console.log('  FAIL  ' + m); } };
const booted = pg => pg.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 30000 }).catch(() => {});

/* THE SEVEN THAT EXISTED BEFORE THIS ONE, by id. They are identities and not a
   count: the picker must still carry every one of them, and Glass blue. */
const BEFORE = ['dark', 'snow', 'punch', 'glass', 'glasswhite', 'flat', 'lumen'];

/* THE SURFACES, each by the element that is it, never by where it sits.
   target is the colour read out of the picture (red, green, blue), and gw is
   what Glass white paints on that surface at c2bf52a2, read by this same
   method on that build before the lighting was added. */
const SURF = [
  /* name,        how it is found,                target in B,        Glass white at c2bf52a2 */
  ['top bar',      { rect: '.glass.top' },         [238, 243, 249],    [246, 246, 244]],
  ['middle panel', { rect: '#stls' },              [224, 229, 235],    [234, 232, 226]],
  ['Release panel', { rect: '#strel' },            [224, 229, 235],    [234, 232, 226]],
  ['card, Boundary', { rect: '#stboundary' },      [224, 229, 235],    [234, 232, 226]],
  ['card, Path',   { rect: '#stcompass' },         [224, 229, 235],    [234, 232, 226]],
  ['card, Avatar', { rect: '#stavatar' },          [224, 229, 235],    [234, 232, 226]],
  ['sort row',     { rect: '.st-lsico' },          [221, 226, 232],    [231, 229, 223]],
  ['stage between cards', { gap: ['#stcompass', '#stboundary'] }, [233, 238, 243], [242, 241, 236]],
  ['page, top left', { page: 'top' },              [225, 230, 235],    [230, 229, 224]],
  ['page, left edge', { page: 'mid' },             [214, 219, 224],    [219, 218, 213]],
  ['status dock',  { dock: true },                 [238, 242, 247],    [247, 246, 244]],
];
/* the tokens Glass white declares, at c2bf52a2, to the character */
const GW_TOKENS = {
  '--bg': '#E8E7E2', '--panel': 'rgba(255,255,255,.62)', '--panel-2': 'rgba(255,255,255,.76)',
  '--sunk': 'rgba(228,226,220,.60)', '--edge': 'rgba(20,22,28,.10)', '--edge-2': 'rgba(20,22,28,.18)',
  '--ink': '#14161C', '--mid': '#4A4843', '--dim': '#6E6B65', '--accent': '#2F6E92', '--tip-bg': '#F6F6F4',
};
/* the greys Glass blue states, read off the darkest pixel of a label in the
   picture: mid 69,75,82 and dim 101,107,114, and ink 19,24,31 off a heading */
const B_GREYS = { '--ink': [19, 24, 31], '--mid': [69, 75, 82], '--dim': [101, 107, 114] };
const TOL = 2;

const rgbOf = s => { const v = (String(s).match(/[\d.]+/g) || []).map(Number); return v.slice(0, 3); };
const hex = h => { const n = parseInt(h.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const lum = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a, b) => { const A = lum(a), B = lum(b); return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05); };
const within = (a, b, t) => a.every((v, i) => Math.abs(v - b[i]) <= t);

/* open the page, optionally on a worked profile, in the Dashboard state the
   picture was drawn in (the Journal's full view, the door #stdash) */
async function open(browser, W, H, opts) {
  const cx = await browser.newContext(Object.assign({ viewport: { width: W, height: H } }, (opts && opts.ctx) || {}));
  const pg = await cx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await pg.goto('file://' + ((opts && opts.file) || SRC) + '?dev=1', { waitUntil: 'load' });
  await booted(pg); await pg.waitForTimeout(500);
  return { cx, pg, errs };
}

/* read the colours of the named surfaces out of a real screenshot. A surface
   is read as the most common colour inside its box, which is its fill and not
   the text or the marks on it; the gap and the page are single pixels, found
   from the elements that bound them. */
async function readSurfaces(pg) {
  const geo = await pg.evaluate(() => {
    const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height }; };
    return { vw: innerWidth, vh: innerHeight, top: r('.glass.top'), stls: r('#stls'), strel: r('#strel'),
      boundary: r('#stboundary'), compass: r('#stcompass'), avatar: r('#stavatar'), sort: r('.st-lsico'),
      dock: r('#msgdock') };
  });
  const buf = await pg.screenshot();
  const out = await pg.evaluate(async ([b64, geo, SURF]) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const at = (x, y) => { const d = g.getImageData(Math.round(x), Math.round(y), 1, 1).data; return [d[0], d[1], d[2]]; };
    const mode = box => { const x0 = Math.max(0, Math.round(box.x + 8)), y0 = Math.max(0, Math.round(box.y + 8));
      const w = Math.max(1, Math.min(c.width - x0, Math.round(box.w - 16))), h = Math.max(1, Math.min(c.height - y0, Math.round(box.h - 16)));
      const d = g.getImageData(x0, y0, w, h).data, m = new Map(); let best = null, n = 0;
      for (let i = 0; i < d.length; i += 4) { const k = d[i] + ',' + d[i + 1] + ',' + d[i + 2]; const v = (m.get(k) || 0) + 1; m.set(k, v); if (v > n) { n = v; best = k; } }
      return best.split(',').map(Number); };
    const res = {};
    for (const [name, how] of SURF) {
      if (how.rect) { const key = { '.glass.top': 'top', '#stls': 'stls', '#strel': 'strel', '#stboundary': 'boundary', '#stcompass': 'compass', '#stavatar': 'avatar', '.st-lsico': 'sort' }[how.rect];
        res[name] = geo[key] ? mode(geo[key]) : null; }
      else if (how.gap) { const a = geo.compass, b = geo.boundary; res[name] = a && b ? at((a.x + a.w + b.x) / 2, a.y + a.h / 2) : null; }
      else if (how.page) { const t = geo.top; res[name] = t ? at(t.x / 2, how.page === 'top' ? 5 : geo.vh / 2) : null; }
      else if (how.dock) { res[name] = geo.dock && geo.dock.w > 0 ? mode(geo.dock) : null; }
    }
    return res;
  }, [buf.toString('base64'), geo, SURF]);
  return out;
}

/* A SWITCH OF LIGHTING IS A TRANSITION, and in a Chromium with no GPU a frame
   can take hundreds of milliseconds, so a fixed wait reads a surface half way
   between two lightings (measured: the stage at 226,231,236 on its way to
   233,238,243 at 1.7 seconds). Wait for the page's own transitions to end,
   which is the fact a fixed wait stands in for, then read. */
const settled = async pg => {
  for (let i = 0; i < 60; i++) {
    const n = await pg.evaluate(() => document.getAnimations().filter(a => a instanceof CSSTransition && a.playState === 'running').length);
    if (!n) break; await pg.waitForTimeout(100);
  }
  await pg.waitForTimeout(150);
};
/* the Dashboard, with a settled lighting and the status dock up, the state the
   picture was drawn in */
async function dashboard(pg, lighting) {
  await pg.evaluate(l => { setLighting(l); }, lighting);
  await pg.waitForTimeout(500);
  await pg.evaluate(() => { if (!document.body.classList.contains('st-full')) { const d = document.getElementById('stdash'); if (d) d.click(); } });
  await pg.waitForTimeout(1200); await settled(pg);
  await pg.evaluate(() => { status('Committed. 4 imprints written to the field.', 'ok'); });
  await pg.waitForTimeout(500);
}

(async () => {
  if (!fs.existsSync(SRC)) { console.log(path.relative(ROOT, SRC) + ' is missing: build first'); process.exit(1); }
  const browser = await chromium.launch({ executablePath: CHROME });
  require('./net.js').guardBrowser(browser);

  /* a build with no Glass blue fails the checks that name it and skips the ones
     that need it to be there, rather than crashing on the first of them */
  const HAVE_GB = await (async () => { const cx = await browser.newContext(); const pg = await cx.newPage();
    await pg.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' }); await booted(pg);
    const h = await pg.evaluate(() => typeof LIGHTINGS !== 'undefined' && LIGHTINGS.some(t => t[0] === 'glassblue')); await cx.close(); return h; })();
  /* ---------------------------------------------------------------- 1 */
  console.log('\n=== 1 · the picker: every lighting is a ring mark, a name and one sentence ===');
  if (want(1)) {
    const { cx, pg, errs } = await open(browser, 1600, 1000);
    await pg.evaluate(() => setTab(TAB.FIELD)); await pg.waitForTimeout(700);
    const L = await pg.evaluate(() => ({ list: LIGHTINGS.map(t => ({ id: t[0], nm: t[1], say: t[2] })), n: LIGHTINGS.length }));
    const ids = L.list.map(t => t.id);
    ok(BEFORE.every(i => ids.includes(i)) && ids.includes('glassblue'),
      'the seven lightings that were there are still there, and Glass blue is one of them: ' + ids.join(', '));
    ok(HAVE_GB && L.list.find(t => t.id === 'glassblue').nm === 'Glass blue', 'and it is named Glass blue, sentence case');
    ok(new Set(ids).size === ids.length, 'every id is its own, ' + L.n + ' of them, no repeat');
    const bar = await pg.evaluate(() => [...document.querySelectorAll('#themes button')].map(b => ({
      label: b.getAttribute('aria-label'), tipT: b.getAttribute('data-tip-t'), tip: b.getAttribute('data-tip'),
      d: (b.querySelector('path') || { getAttribute: () => '' }).getAttribute('d'),
      fill: b.querySelector('path') ? getComputedStyle(b.querySelector('path')).fill : '', noicon: b.hasAttribute('data-noicon') })));
    const nav = await pg.evaluate(() => [...document.querySelectorAll('#navthemes button')].map(b => ({
      tipT: b.getAttribute('data-tip-t'), tip: b.getAttribute('data-tip'), d: (b.querySelector('path') || { getAttribute: () => '' }).getAttribute('d') })));
    ok(bar.length === L.n, 'the bar menu shows one entry for every lighting LIGHTINGS names: ' + bar.length + ' of ' + L.n);
    ok(nav.length === L.n, 'and the phone menu shows the same: ' + nav.length + ' of ' + L.n);
    L.list.forEach((t, i) => {
      const b = bar[i], n = nav[i];
      ok(b && b.label === t.nm + ' theme' && b.tipT === t.nm, t.nm + ': the mark says its name, in its label and as the tooltip header');
      const one = s => typeof s === 'string' && s.length > 0 && s.length <= 80 && /^[A-Z]/.test(s) && /\.$/.test(s)
        && (s.match(/\./g) || []).length === 1 && !/\u2014|\u2013/.test(s) && !/[A-Z]{3,}/.test(s);
      ok(b && one(b.tip) && n && n.tip === b.tip && n.tipT === t.nm, t.nm + ': it says what it is in one short sentence, in both menus: "' + (b && b.tip) + '"');
      ok(b && /^M[\d. a-zA-Z\-]+$/.test(b.d || '') && !/undefined/.test(b.d) && !b.noicon, t.nm + ': it has a mark of its own');
    });
    ok(new Set(bar.map(b => b.d)).size === bar.length, 'no two lightings share a mark');
    ok(new Set(bar.map(b => b.tip)).size === bar.length, 'and no two share a sentence');
    const gb = bar[ids.indexOf('glassblue')];
    ok(gb && gb.fill === 'none', 'Glass blue\'s mark is a ring and not a fill: its path paints fill ' + (gb && gb.fill));
    ok(gb && /blue/i.test(gb.tip), 'and its sentence says what sets it apart: ' + (gb && gb.tip));

    /* the real tooltip, by a real hover, on every entry */
    await pg.click('#lightbtn'); await pg.waitForTimeout(500);
    const seen = [];
    for (let i = 0; i < L.n; i++) {
      await pg.mouse.move(2, 2); await pg.waitForTimeout(250);
      const box = await pg.evaluate(i => { const b = document.querySelectorAll('#themes button')[i].getBoundingClientRect();
        return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, i);
      await pg.mouse.move(box.x, box.y); await pg.waitForTimeout(900);
      seen.push(await pg.evaluate(() => { const t = document.getElementById('tip');
        return t ? { on: t.classList.contains('on'), text: t.innerText.replace(/\s+/g, ' ').trim() } : { on: false, text: '' }; }));
    }
    L.list.forEach((t, i) => ok(seen[i].on && seen[i].text.indexOf(t.nm) >= 0 && seen[i].text.indexOf(t.say) >= 0,
      t.nm + ': hover opens the tooltip with its name and its sentence: "' + seen[i].text.slice(0, 80) + '"'));
    ok(errs.length === 0, 'no page error or console error: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }
  if (want(1)) {
    const { cx, pg, errs } = await open(browser, 390, 844);
    await pg.evaluate(() => setTab(TAB.FIELD)); await pg.waitForTimeout(700);
    await pg.click('#navtog'); await pg.waitForTimeout(600);
    const geo = await pg.evaluate(() => {
      const bs = [...document.querySelectorAll('#navthemes button')]; const r = bs.map(b => { const k = b.getBoundingClientRect(); return { x: k.x, y: k.y, w: k.width, h: k.height }; });
      let hit = 0; for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) { const a = r[i], b = r[j];
        if (a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5) hit++; }
      return { n: bs.length, want: LIGHTINGS.length, hit, minH: Math.min.apply(null, r.map(k => k.h)), maxR: Math.max.apply(null, r.map(k => k.x + k.w)),
        sw: document.documentElement.scrollWidth, vw: innerWidth, label: bs.map(b => b.textContent.trim()) };
    });
    ok(geo.n === geo.want, 'at 390 the phone menu lists every lighting, ' + geo.n + ' of ' + geo.want + ': ' + geo.label.join(', '));
    ok(geo.hit === 0, 'and no two entries overlap, ' + geo.hit + ' overlaps');
    ok(geo.minH >= 44, 'and each is at least 44 tall, the shortest is ' + Math.round(geo.minH));
    ok(geo.maxR <= geo.vw && geo.sw <= geo.vw, 'and nothing runs past the right edge: widest ' + Math.round(geo.maxR) + ' of ' + geo.vw + ', page ' + geo.sw);
    /* a held press explains, and does not choose; a tap chooses (ui/tip.js, control()) */
    const idx = await pg.evaluate(() => LIGHTINGS.findIndex(t => t[0] === 'glassblue'));
    if (idx < 0) ok(false, 'at 390 Glass blue is not in the phone menu, so its held press and its tap cannot be tried');
    else {
    const where = () => pg.evaluate(i => { const e = document.querySelectorAll('#navthemes button')[i]; e.scrollIntoView({ block: 'center' });
      const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, idx);
    let c = await where(); await pg.waitForTimeout(300); c = await where();
    const was = await pg.evaluate(() => S.theme);
    await pg.mouse.move(c.x, c.y); await pg.mouse.down(); await pg.waitForTimeout(1900);
    const tip = await pg.evaluate(() => { const t = document.getElementById('tip'); return t ? { on: t.classList.contains('on'), text: t.innerText.replace(/\s+/g, ' ').trim() } : { on: false, text: '' }; });
    await pg.mouse.up(); await pg.waitForTimeout(300);
    const after = await pg.evaluate(() => S.theme);
    ok(tip.on && /Glass blue/.test(tip.text) && /cool blue tint/.test(tip.text), 'at 390 a held press on Glass blue opens its meaning: "' + tip.text.slice(0, 80) + '"');
    ok(after === was, 'and the hold did not choose it: ' + was + ' stays ' + after);
    await pg.evaluate(() => { if (typeof TIP !== 'undefined') TIP.hide(); });
    if (!(await pg.evaluate(() => document.querySelector('.top').classList.contains('navopen')))) await pg.click('#navtog');
    await pg.waitForTimeout(400);
    c = await where(); await pg.waitForTimeout(300); c = await where();
    await pg.mouse.click(c.x, c.y); await pg.waitForTimeout(500);
    ok(await pg.evaluate(() => S.theme) === 'glassblue', 'and a tap on it chooses it');
    }
    ok(errs.length === 0, 'no page error or console error at 390: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  /* ---------------------------------------------------------------- 2 */
  console.log('\n=== 2 · the state: both classes, kept across the app, and a reload leaves no half state ===');
  if (!want(2)) { /* not asked for */ }
  else if (!HAVE_GB) ok(false, 'there is no Glass blue to choose, so its state cannot be held');
  else {
    const { cx, pg, errs } = await open(browser, 1600, 1000);
    const cls = () => pg.evaluate(() => ({ theme: S.theme, c: ['snow', 'punch', 'glass', 'glasswhite', 'glassblue', 'flat', 'lumen'].filter(k => document.body.classList.contains(k)),
      pressed: [...document.querySelectorAll('#themes button')].map(b => b.getAttribute('aria-pressed') === 'true'),
      navPressed: [...document.querySelectorAll('#navthemes button')].map(b => b.getAttribute('aria-pressed') === 'true'),
      btn: document.getElementById('lightbtn').getAttribute('aria-label') }));
    await pg.evaluate(() => setTab(TAB.FIELD)); await pg.waitForTimeout(500);
    await pg.click('#lightbtn'); await pg.waitForTimeout(300);
    await pg.click('#themes button[aria-label="Glass blue theme"]'); await pg.waitForTimeout(600);
    let s = await cls();
    ok(s.theme === 'glassblue', 'pressing Glass blue in the bar chooses it, S.theme is ' + s.theme);
    ok(s.c.length === 2 && s.c.includes('glasswhite') && s.c.includes('glassblue'), 'the body carries both classes and no other lighting\'s: ' + s.c.join(' '));
    ok(s.pressed.filter(Boolean).length === 1 && s.navPressed.filter(Boolean).length === 1, 'exactly one entry is pressed in each menu');
    ok(s.btn === 'Lighting, Glass blue', 'and the bar\'s button says which is on: ' + s.btn);
    for (const t of ['summary', 'story', 'compass', 'field']) {
      await pg.evaluate(t => setTab(TAB[t.toUpperCase()]), t); await pg.waitForTimeout(350);
    }
    await pg.evaluate(() => { loadP(3); render(); }); await pg.waitForTimeout(500);
    s = await cls();
    ok(s.theme === 'glassblue' && s.c.includes('glassblue') && s.c.includes('glasswhite'), 'it survives four tab changes, a profile load and a render');
    await pg.evaluate(() => { ACC_OPEN = 'display'; setTab(TAB.SETTINGS); renderAccount(); }); await pg.waitForTimeout(600);
    const st = await pg.evaluate(() => [...document.querySelectorAll('#acthemes button')].map(b => ({ id: b.getAttribute('data-act'), on: b.getAttribute('aria-pressed') === 'true', text: b.textContent.trim() })));
    ok(st.length === (await pg.evaluate(() => LIGHTINGS.length)) && st.filter(x => x.on).map(x => x.id).join() === 'glassblue',
      'Settings lists every lighting and shows Glass blue as the one that is on: ' + st.map(x => x.text + (x.on ? '*' : '')).join(', '));
    await pg.evaluate(() => setLighting('glasswhite')); await pg.waitForTimeout(300);
    s = await cls();
    ok(s.c.join() === 'glasswhite', 'and going back to Glass white leaves glasswhite alone on the body: ' + s.c.join(' '));
    await pg.evaluate(() => setLighting('dark')); await pg.waitForTimeout(300);
    s = await cls();
    ok(s.c.length === 0, 'and Dark leaves none: ' + (s.c.join(' ') || 'none'));

    ok(errs.length === 0, 'no page error or console error through the whole walk: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }
  if (HAVE_GB && want(2)) {
    /* 2c. THE LIGHTING IS NOT STORED TODAY, for any of the eight, and this says
       so rather than pretending. S.theme starts as 'dark' (engine/core.js) and
       setLighting writes no storage. What can be held is that a reload never
       lands on a half state, a theme that says glassblue over a body without
       its classes or the reverse, and that choosing it again after a reload
       paints the same pixels as choosing it the first time. Both runs are the
       same sequence on a page that has no profile loaded, so the only thing
       that differs is the reload between them. */
    const { cx, pg, errs } = await open(browser, 1600, 1000);
    const pick = async () => {
      await pg.evaluate(() => setLighting('glassblue')); await pg.waitForTimeout(500);
      await pg.evaluate(() => setTab(TAB.STORY)); await pg.waitForTimeout(500);
      await pg.evaluate(() => { if (!document.body.classList.contains('st-full')) { const d = document.getElementById('stdash'); if (d) d.click(); } });
      await pg.waitForTimeout(1200); await settled(pg);
      return readSurfaces(pg);
    };
    const before = await pick();
    await pg.reload({ waitUntil: 'load' }); await booted(pg); await pg.waitForTimeout(600);
    const s = await pg.evaluate(() => ({ theme: S.theme, c: ['glasswhite', 'glassblue'].filter(k => document.body.classList.contains(k)) }));
    const agree = (s.theme === 'glassblue') === s.c.includes('glassblue') && (s.theme === 'glassblue' || s.theme === 'glasswhite') === s.c.includes('glasswhite');
    ok(agree, 'after a reload the theme and the body agree, no half state: theme ' + s.theme + ', classes ' + (s.c.join(' ') || 'none'));
    console.log('  info  after a reload the app opens on ' + s.theme + (s.theme === 'dark' ? ': the lighting is not stored today, for any lighting' : ': the lighting was restored'));
    const afterR = await pick();
    const moved = Object.keys(before).filter(k => k !== 'status dock' && !(before[k] && afterR[k] && within(before[k], afterR[k], 0)));
    ok(moved.length === 0, 'and choosing it again after the reload paints the same surfaces as before it' + (moved.length ? ', moved: ' + moved.map(k => k + ' ' + (before[k] || []).join(',') + ' to ' + (afterR[k] || []).join(',')).join(' | ') : ''));
    ok(errs.length === 0, 'no page error or console error through the whole walk: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  /* ---------------------------------------------------------------- 3, 4 */
  console.log('\n=== 3 · the colour: each surface, in a real render, against the colour read out of the picture ===');
  let GWREAD = null, GBREAD = null;
  if (want(3) || want(4) || want(5)) {
    const { cx, pg, errs } = await open(browser, 1600, 1000);
    await dashboard(pg, 'glasswhite'); GWREAD = await readSurfaces(pg);
    const gwTok = await pg.evaluate(() => { const cs = getComputedStyle(document.body); const o = {};
      ['--bg', '--panel', '--panel-2', '--sunk', '--edge', '--edge-2', '--ink', '--mid', '--dim', '--accent', '--tip-bg'].forEach(k => o[k] = cs.getPropertyValue(k).trim()); return o; });
    const gwStage = await pg.evaluate(() => getComputedStyle(document.getElementById('stage')).backgroundColor);
    const gwOther = await pg.evaluate(() => ({ L: LIGHT(), sl: stageLight(), seat: ['Crown', 'Root', 'Heart', 'Solar'].map(b => seatCol(b)), ink: INK(), gold: GOLDC() }));
    if (!HAVE_GB) { ok(false, 'there is no Glass blue to measure'); console.log('  glass white at this build:'); SURF.forEach(([n]) => console.log('    ' + n.padEnd(24) + (GWREAD[n] || []).join(','))); await cx.close(); GBREAD = null; }
    else {
    await dashboard(pg, 'glassblue'); GBREAD = await readSurfaces(pg);
    const gbTok = await pg.evaluate(() => { const cs = getComputedStyle(document.body); const o = {};
      ['--bg', '--panel', '--panel-2', '--sunk', '--edge', '--edge-2', '--ink', '--mid', '--dim', '--accent', '--tip-bg'].forEach(k => o[k] = cs.getPropertyValue(k).trim()); return o; });
    const gbStage = await pg.evaluate(() => getComputedStyle(document.getElementById('stage')).backgroundColor);
    const gbOther = await pg.evaluate(() => ({ L: LIGHT(), sl: stageLight(), seat: ['Crown', 'Root', 'Heart', 'Solar'].map(b => seatCol(b)), ink: INK(), gold: GOLDC() }));

    console.log('  surface                  glass white      glass blue       the picture      off by');
    SURF.forEach(([name, how, target, gw]) => {
      const r = GBREAD[name], w = GWREAD[name];
      const off = r ? r.map((v, i) => v - target[i]) : null;
      console.log('  ' + name.padEnd(24) + (w ? w.join(',') : '-').padEnd(17) + (r ? r.join(',') : '-').padEnd(17) + target.join(',').padEnd(17) + (off ? off.join(',') : '-'));
    });
    if (!PRINT) SURF.forEach(([name, how, target]) => {
      const r = GBREAD[name];
      ok(!!r && within(r, target, TOL), name + ' reads ' + (r ? r.join(',') : 'nothing') + ', the picture ' + target.join(',') + ', within ' + TOL);
    });
    ok(SURF.filter(s => GBREAD[s[0]]).length === SURF.length, 'every surface was found by its own element');
    /* the greys the picture's labels carry */
    Object.keys(B_GREYS).forEach(k => {
      const got = hex(gbTok[k]);
      ok(within(got, B_GREYS[k], TOL), k + ' is ' + gbTok[k] + ' = ' + got.join(',') + ', the picture\'s label ' + B_GREYS[k].join(',') + ', within ' + TOL);
    });
    ok(gbTok['--accent'] === gwTok['--accent'], 'the accent is Glass white\'s own, ' + gbTok['--accent']);
    ok(within(rgbOf(gbStage), [233, 238, 243], 0), 'the stage ground is #E9EEF3, ' + gbStage);
    ok(gbTok['--bg'] !== gwTok['--bg'] && gbTok['--panel'] !== gwTok['--panel'] && gbTok['--sunk'] !== gwTok['--sunk'], 'and it states its own ground, glass and sunk pane, none inherited from Glass white');
    ok(hex(gbTok['--bg'])[2] > hex(gbTok['--bg'])[0], 'the page ground leans blue, blue above red: ' + gbTok['--bg']);
    ok(rgbOf(gbTok['--sunk'])[2] > rgbOf(gbTok['--sunk'])[0] && rgbOf(gbStage)[2] > rgbOf(gbStage)[0], 'and so do the sunk pane and the stage');
    ok(JSON.stringify(gbOther) === JSON.stringify(gwOther), 'the light ladder answers as it does on Glass white: LIGHT(), stageLight(), the seat colours, the ink and the accent');
    ok(gbOther.L === true && gbOther.sl === true, 'Glass blue is light, by name and by the ground it paints: LIGHT() ' + gbOther.L + ', stageLight() ' + gbOther.sl);

    console.log('\n=== 4 · Glass white did not move ===');
    Object.keys(GW_TOKENS).forEach(k => ok(gwTok[k] === GW_TOKENS[k], 'Glass white ' + k + ' is still ' + GW_TOKENS[k] + (gwTok[k] === GW_TOKENS[k] ? '' : ', now ' + gwTok[k])));
    ok(within(rgbOf(gwStage), [242, 241, 236], 0), 'Glass white\'s stage is still #F2F1EC, ' + gwStage);
    if (!PRINT) SURF.forEach(([name, how, target, gw]) => { if (!gw) return;
      ok(GWREAD[name] && within(GWREAD[name], gw, 0), 'Glass white ' + name + ' reads ' + (GWREAD[name] || []).join(',') + ', exactly the ' + gw.join(',') + ' it read before Glass blue existed'); });
    const gwcls = await pg.evaluate(() => { setLighting('glasswhite'); return document.body.className.split(' ').filter(c => /^(snow|punch|glass|glasswhite|glassblue|flat|lumen)$/.test(c)).join(' '); });
    ok(gwcls === 'glasswhite', 'and choosing it still puts glasswhite alone on the body: ' + gwcls);
    ok(errs.length === 0, 'no page error or console error: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
    }
  }
  if (BASE && want(4)) {
    /* every element's painted colours, on every surface, Glass white here and
       in the build from before, compared whole. Only when a baseline is given. */
    const walk = async file => {
      const { cx, pg } = await open(browser, 1600, 1000, { file });
      await pg.evaluate(() => { setLighting('glasswhite'); loadP(3); render(); }); await pg.waitForTimeout(500);
      const tabs = await pg.evaluate(() => { const a = TABDEF.map(t => t.k); Object.keys(TABEXTRA).forEach(k => a.push(TABEXTRA[k].k)); return a; });
      const out = {};
      for (const k of tabs) {
        await pg.evaluate(k => { setTab(k); render(); }, k); await pg.waitForTimeout(650);
        out[k] = await pg.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getClientRects().length).map(e => { const c = getComputedStyle(e);
          return [e.tagName, e.id, c.backgroundColor, c.color, c.borderTopColor, c.boxShadow, c.backgroundImage.slice(0, 80)].join('|'); }).join('\n'));
      }
      await cx.close(); return out;
    };
    const A = await walk(BASE), B = await walk(SRC);
    let diffs = 0, first = '';
    Object.keys(A).forEach(k => { if (A[k] !== B[k]) { diffs++; if (!first) { const a = A[k].split('\n'), b = B[k].split('\n'); const i = a.findIndex((x, j) => x !== b[j]); first = 'tab ' + k + ' line ' + i + ': ' + a[i] + '  =>  ' + b[i]; } } });
    ok(diffs === 0, 'Glass white paints every element the same colours as the build from before, on every tab' + (diffs ? ', ' + diffs + ' tabs differ, first ' + first : ''));
  }

  /* ---------------------------------------------------------------- 5 */
  console.log('\n=== 5 · the text still reads ===');
  if (want(5) && GBREAD && GWREAD) {
    const { cx, pg } = await open(browser, 1600, 1000);
    const tok = async l => { await pg.evaluate(l => setLighting(l), l); await pg.waitForTimeout(300);
      return pg.evaluate(() => { const cs = getComputedStyle(document.body); const g = k => cs.getPropertyValue(k).trim(); return { '--ink': g('--ink'), '--mid': g('--mid'), '--dim': g('--dim'), '--accent': g('--accent') }; }); };
    const tw = await tok('glasswhite'), tb = await tok('glassblue'); await cx.close();
    const rows = [['top bar', 'top bar'], ['middle panel', 'middle panel'], ['sort row', 'sort row'], ['stage between cards', 'stage'], ['page, top left', 'page']];
    console.log('  text on surface              ink      mid      dim      accent   (glass blue, with glass white beside)');
    rows.forEach(([name, label]) => {
      const sg = GWREAD[name], sb = GBREAD[name]; if (!sg || !sb) { ok(false, name + ' was not read'); return; }
      const line = []; ['--ink', '--mid', '--dim', '--accent'].forEach(k => {
        const rb = ratio(hex(tb[k]), sb), rw = ratio(hex(tw[k]), sg);
        line.push(rb.toFixed(2) + '/' + rw.toFixed(2));
        if (k === '--ink' || k === '--mid') ok(rb >= 4.5, label + ': ' + k.slice(2) + ' holds the 4.5 to 1 text floor, ' + rb.toFixed(2));
        else ok(rb >= rw * 0.95, label + ': ' + k.slice(2) + ' gives up under five percent of Glass white\'s ' + rw.toFixed(2) + ', reads ' + rb.toFixed(2));
      });
      console.log('  ' + label.padEnd(26) + line.map(x => x.padEnd(9)).join(''));
    });
  }

  /* ---------------------------------------------------------------- 6 */
  console.log('\n=== 6 · the canvases follow ===');
  if (!want(6)) { /* not asked for */ }
  else if (!HAVE_GB) ok(false, 'there is no Glass blue, so the canvases have nothing to follow');
  else {
    const { cx, pg, errs } = await open(browser, 1600, 1000, { ctx: { reducedMotion: 'reduce' } });
    /* the Compass well reads its ground off the canvas the way the pane does */
    await pg.evaluate(() => { loadP(3); setLighting('glassblue'); setTab(TAB.COMPASS); render(); }); await pg.waitForTimeout(1500);
    const well = await pg.evaluate(() => ({ well: ndlWell().slice(0, 3), bg: getComputedStyle(CONE.cv).backgroundColor, lt: coneLt() }));
    ok(within(well.well, rgbOf(well.bg), 0) && well.well[2] > well.well[0], 'the Compass well reads its ground off its own canvas, and that ground leans blue: ' + well.well.join(',') + ' of ' + well.bg);
    ok(well.lt === true, 'and the Compass reads that ground as light');
    /* the Field repaints on the switch even when motion is reduced and the
       cache would otherwise hold the last frame, and what it paints is not
       cream: count the light, near neutral, warm leaning pixels in it */
    const warm = async l => {
      /* setLighting alone, with no setTab and no render of mine: a person
         switching the lighting from the bar stays on the Field, and a setTab
         clears the redraw cache and would hide a stale one */
      await pg.evaluate(l => { setLighting(l); }, l); await pg.waitForTimeout(1400);
      return pg.evaluate(() => { let n = 0, lit = 0;
        document.querySelectorAll('canvas').forEach(c => { if (!c.width || !c.height || c.getBoundingClientRect().width < 200) return;
          let d; try { d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; } catch (e) { return; }
          for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 128) continue; const R = d[i], G = d[i + 1], B = d[i + 2];
            if (Math.min(R, G, B) >= 215 && Math.max(R, G, B) - Math.min(R, G, B) <= 12) { lit++; if (R - B >= 3 && G >= B) n++; } } });
        return { warm: n, lit }; });
    };
    await pg.evaluate(() => { setTab(TAB.FIELD); render(); }); await pg.waitForTimeout(800);
    const gwc = await warm('glasswhite'), gbc = await warm('glassblue');
    console.log('  info  the Field canvas, near neutral light pixels leaning warm: Glass white ' + gwc.warm + ' of ' + gwc.lit + ', Glass blue ' + gbc.warm + ' of ' + gbc.lit);
    ok(gwc.warm > 200, 'the probe sees the cream Glass white paints in the Field at all, ' + gwc.warm + ' pixels, so what is left below means something');
    ok(gbc.warm * 50 < gwc.warm, 'switched from Glass white to Glass blue under reduced motion, the Field repaints with under two percent of that cream left, ' + gbc.warm + ' of ' + gwc.warm + ' pixels');
    ok(errs.length === 0, 'no page error or console error: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }
  if (HAVE_GB && want(6)) {
    /* every tab renders under it and logs nothing */
    const { cx, pg, errs } = await open(browser, 1600, 1000);
    await pg.evaluate(() => { loadP(3); setLighting('glassblue'); render(); }); await pg.waitForTimeout(500);
    const tabs = await pg.evaluate(() => { const a = TABDEF.map(t => [t.nm, t.k]); Object.keys(TABEXTRA).forEach(k => a.push([TABEXTRA[k].nm, TABEXTRA[k].k])); return a; });
    const bad = [];
    for (const [nm, k] of tabs) {
      await pg.evaluate(k => { setTab(k); render(); }, k); await pg.waitForTimeout(500);
      const m = await pg.evaluate(() => { const st = document.getElementById('stage'); return { cls: document.body.classList.contains('glassblue') && document.body.classList.contains('glasswhite'),
        host: (document.querySelector('.stage')||{}).innerHTML ? 1 : 0 }; });
      if (!m.cls) bad.push(nm);
    }
    ok(bad.length === 0, 'every surface TABDEF and TABEXTRA name (' + tabs.length + ') renders with both classes still on the body' + (bad.length ? ', lost on ' + bad.join(', ') : ''));
    ok(errs.length === 0, 'and logs nothing: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  /* ---------------------------------------------------------------- 7 */
  console.log('\n=== 7 · nothing warm is left behind, read out of the build ===');
  if (want(7)) {
    const html = fs.readFileSync(SRC, 'utf8');
    const styles = (html.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []).map(s => s.replace(/<\/?style[^>]*>/g, '')).join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
    const rules = []; let m; const re = /([^{}@][^{}]*)\{([^{}]*)\}/g;
    while ((m = re.exec(styles))) rules.push({ sel: m[1].trim(), decl: m[2].split(';').map(d => d.trim()).filter(Boolean).map(d => { const i = d.indexOf(':'); return [d.slice(0, i).trim(), d.slice(i + 1).trim()]; }), at: m.index });
    const WARM = /#F2F1EC|#E8E7E2|#F6F6F4|#F7F6F1|rgba?\(\s*228\s*,\s*226\s*,\s*220/i;
    const gw = rules.filter(r => /body\.glasswhite/.test(r.sel) && !/glassblue/.test(r.sel));
    const gb = rules.filter(r => /body\.glassblue/.test(r.sel));
    ok(gb.length > 0, 'the stylesheet has Glass blue rules, ' + gb.length);
    const orphan = [];
    gw.forEach(r => r.decl.forEach(([p, v]) => { if (!WARM.test(v)) return;
      const twin = gb.some(t => t.at > r.at && t.decl.some(([tp, tv]) => tp === p && !WARM.test(tv)));
      if (!twin) orphan.push(r.sel.slice(0, 60) + ' { ' + p + ': ' + v.slice(0, 30) + ' }'); }));
    ok(orphan.length === 0, 'every Glass white rule that sets a cream has a later Glass blue rule setting the same property to something else' + (orphan.length ? ', without one: ' + orphan.join(' ; ') : ''));
    /* the canvases: each cream literal in the script sits in a line that asks COOL() */
    const lines = html.split('\n');
    const CREAM = /\[242,\s*241,\s*236\]|\[238,\s*236,\s*230\]|\[250,\s*249,\s*245\]|\[248,\s*247,\s*243\]|rgba\(250,250,247/;
    const bare = lines.filter(l => CREAM.test(l) && !/COOL\(\)/.test(l) && !/^\s*(\/\*|\*)/.test(l) && !/^\s*[^;]*\/\*[^*]*\*\/\s*$/.test(l));
    ok(bare.length === 0, 'every cream the canvases paint with is behind COOL() in the script' + (bare.length ? ', without it: ' + bare.slice(0, 2).map(l => l.trim().slice(0, 90)).join(' ; ') : ''));
    ok(/const COOL=\(\)=>S\.theme==='glassblue'/.test(html) && /GLASSWHITE_KIN=\['glasswhite','glassblue'\]/.test(html), 'and the two helpers are there, COOL and GLASSWHITE_KIN');
    ok(/drawSig[\s\S]{0,900}LIGHT\(\)\?1:0,S\.theme/.test(html), 'and the Field\'s redraw cache is keyed on the lighting\'s name, so a switch between the two light lightings repaints');
    /* the home screen's wash is the one gradient that mixes the ambient core
       into the page ground, and an oklch mix of a warm core into a cool ground
       carries the HUE round the wrong way, to pink. Glass blue must say that
       mix in srgb, in a rule of its own, that sits after the rule it overrides */
    const wash = rules.filter(r => /body\.glassblue\.tab-story[^,]*#stage::before/.test(r.sel));
    const washBg = wash.map(r => r.decl.filter(d => d[0] === 'background').map(d => d[1]).join(' ')).join(' ');
    const base = rules.find(r => /^body\.tab-story:not\(\.st-full\) #stage::before$/.test(r.sel) && r.decl.some(d => d[0] === 'background'));
    ok(wash.length > 0 && base && wash.every(r => r.at > base.at), 'the home screen\'s wash has a Glass blue rule of its own, after the rule it overrides');
    ok(/--uni-amb-core/.test(washBg) && /--uni-amb-edge/.test(washBg) && !/inoklch,rgb\(var\(--uni-amb/.test(washBg.replace(/\s+/g, '')),
      'and it mixes the ambient core and edge into the ground without an oklch hue: ' + washBg.replace(/\s+/g, ' ').slice(0, 70));
  }

  /* ---------------------------------------------------------------- 8 */
  console.log('\n=== 8 · the home screen: Discover is cool in Glass blue, blank and loaded, wide and narrow ===');
  if (!want(8)) { /* not asked for */ }
  else if (!HAVE_GB) ok(false, 'there is no Glass blue, so its home screen cannot be read');
  else {
    /* Discover is where the app opens (TABHOME), so it is the first surface a
       person sees in any lighting. Its wash is a gradient, which the per
       surface table in section 3 cannot read, and every check above clicks the
       Dashboard open first, so the hero was never looked at: it shipped a dusty
       mauve inside a cool bar. Read here by what is in the pixels. Over the
       whole stage panel, every pixel that is a light surface (no channel under
       190) is counted, and the ones leaning warm (red above blue by 3 or more)
       are the share that read as cream or pink. The probe has to be able to
       see it, so the same screen in Glass white is read first and must lean
       warm in most of its light pixels. */
    const scan = (pg, geo) => pg.screenshot().then(buf => pg.evaluate(async ([b64, g]) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const cx = c.getContext('2d'); cx.drawImage(img, 0, 0);
      const x0 = Math.round(g.x + 12), y0 = Math.round(g.y + 12), w = Math.max(1, Math.round(g.w - 24)), h = Math.max(1, Math.round(g.h - 24));
      const d = cx.getImageData(x0, y0, w, h).data; let lit = 0, warm = 0; const m = new Map(); let best = null, n = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (Math.min(d[i], d[i + 1], d[i + 2]) < 190) continue; lit++;
        if (d[i] - d[i + 2] >= 3) warm++;
        const k = d[i] + ',' + d[i + 1] + ',' + d[i + 2]; const v = (m.get(k) || 0) + 1; m.set(k, v); if (v > n) { n = v; best = k; }
      }
      return { area: w * h, lit, warm, mode: best ? best.split(',').map(Number) : null };
    }, [buf.toString('base64'), geo]));
    const read = async (pg, lt, loaded) => {
      await pg.evaluate(([lt, loaded]) => { if (loaded) loadP(3); setLighting(lt); setTab(TAB.STORY); render(); }, [lt, loaded]);
      await pg.waitForTimeout(1800); await settled(pg);
      const geo = await pg.evaluate(() => { const b = document.getElementById('stage').getBoundingClientRect();
        return { x: b.x, y: b.y, w: b.width, h: b.height, home: S.tab === TAB.STORY && !document.body.classList.contains('st-full') }; });
      return Object.assign({ home: geo.home }, await scan(pg, geo));
    };
    for (const [W, H] of [[1600, 1000], [390, 844]]) for (const loaded of [false, true]) {
      const tag = W + (loaded ? ' loaded' : ' blank');
      const { cx, pg, errs } = await open(browser, W, H);
      const gw = await read(pg, 'glasswhite', loaded), gb = await read(pg, 'glassblue', loaded);
      const pct = r => (100 * r.warm / Math.max(1, r.lit)).toFixed(1) + '%';
      console.log('  info  ' + tag + ': light pixels leaning warm, Glass white ' + pct(gw) + ', Glass blue ' + pct(gb) + '; the Glass blue ground is ' + (gb.mode || []).join(','));
      ok(gw.home && gb.home, tag + ': the screen read is the home screen, Discover with the Dashboard closed');
      ok(gw.lit > gw.area * 0.2 && gw.warm > gw.lit * 0.5, tag + ': the probe sees the cream in Glass white\'s home screen, ' + pct(gw) + ' of its light pixels lean warm, so what is left below means something');
      ok(gb.lit > gb.area * 0.2, tag + ': Glass blue\'s home screen is a light surface, ' + gb.lit + ' of ' + gb.area + ' pixels');
      ok(gb.warm < gb.lit * 0.05, tag + ': and under five percent of it leans warm, ' + pct(gb));
      ok(gb.mode && gb.mode[2] - gb.mode[0] >= 3, tag + ': the commonest light colour in it leans blue, blue above red by 3 or more: ' + (gb.mode || []).join(','));
      ok(errs.length === 0, tag + ': no page error or console error: ' + errs.slice(0, 2).join(' | '));
      await cx.close();
    }
  }

  /* ---------------------------------------------------------------- 9 */
  console.log('\n=== 9 · Settings, Lighting: every lighting whole and reachable at every width ===');
  if (!want(9)) { /* not asked for */ }
  else if (!HAVE_GB) ok(false, 'there is no Glass blue, so the Settings row has nothing new to hold');
  else {
    /* the Settings row lists every lighting by name. With eight it ran 510px in
       a tray that is the screen less 52, so at 390 the selected Glass blue was
       cut to "Gla" and Flat and Lumen were off the screen. Every button must be
       inside the tray and inside the screen, none clipped, none under another,
       the page must not scroll sideways, and where the row becomes a grid the
       cells are one width and the last row is as full as the first. */
    for (const W of [320, 360, 390, 430, 520, 600, 768, 1001, 1600]) {
      const { cx, pg, errs } = await open(browser, W, 900);
      await pg.evaluate(() => { setLighting('glassblue'); ACC_OPEN = 'display'; setTab(TAB.SETTINGS); renderAccount(); });
      await pg.waitForTimeout(700);
      const g = await pg.evaluate(() => { const t = document.getElementById('acthemes'); if (!t) return null;
        const tr = t.getBoundingClientRect(); const bs = [...t.querySelectorAll('button')]; const r = bs.map(b => b.getBoundingClientRect());
        let hit = 0; for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) { const a = r[i], b = r[j];
          if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) hit++; }
        const tops = r.map(k => Math.round(k.top)), first = Math.min.apply(null, tops), last = Math.max.apply(null, tops);
        const sel = t.querySelector('button[aria-pressed=true]');
        return { n: bs.length, want: LIGHTINGS.length, vw: innerWidth, sw: document.documentElement.scrollWidth, tray: Math.round(tr.width),
          outTray: r.filter(k => k.left < tr.left - 1 || k.right > tr.right + 1).length, outScreen: r.filter(k => k.left < 0 || k.right > innerWidth).length,
          clipped: bs.filter(b => b.scrollWidth > b.clientWidth + 1).length, hit, minH: Math.min.apply(null, r.map(k => k.height)),
          widths: Math.max.apply(null, r.map(k => k.width)) - Math.min.apply(null, r.map(k => k.width)),
          rows: new Set(tops).size, firstRow: tops.filter(v => v === first).length, lastRow: tops.filter(v => v === last).length,
          selText: sel ? sel.textContent.trim() : '', selW: sel ? Math.round(sel.getBoundingClientRect().width) : 0 }; });
      if (!g) { ok(false, W + ': the Settings lighting row is not there'); await cx.close(); continue; }
      ok(g.n === g.want, W + ': the row lists every lighting, ' + g.n + ' of ' + g.want);
      ok(g.outTray === 0 && g.outScreen === 0, W + ': every button is inside its tray (' + g.tray + ' wide) and inside the screen: ' + g.outTray + ' out of the tray, ' + g.outScreen + ' off the screen');
      ok(g.clipped === 0, W + ': none is cut, the selected one reads "' + g.selText + '" at ' + g.selW + ' wide, ' + g.clipped + ' clipped');
      ok(g.hit === 0 && g.minH >= 44, W + ': none sits under another and none is under 44 tall, ' + g.hit + ' overlaps, shortest ' + Math.round(g.minH));
      ok(g.sw <= g.vw, W + ': the page does not scroll sideways, ' + g.sw + ' of ' + g.vw);
      if (W <= 600) ok(g.widths <= 1 && g.rows > 1 && g.firstRow === g.lastRow, W + ': at phone width it is an even grid, one width within a pixel (' + g.widths.toFixed(1) + ' apart), ' + g.rows + ' rows, ' + g.firstRow + ' in the first and ' + g.lastRow + ' in the last');
      ok(errs.length === 0, W + ': no page error or console error: ' + errs.slice(0, 2).join(' | '));
      await cx.close();
    }
  }

  /* ---------------------------------------------------------------- 10 */
  console.log('\n=== 10 · the bar\'s lighting menu opens on top, in every lighting, on every screen ===');
  if (!want(10)) { /* not asked for */ }
  else {
    /* the bar's menu is the only way to meet a lighting from the home screen.
       It hangs below a bar that is a stacking context in every glass lighting
       (backdrop-filter), and the stage after it in the page is a positioned
       stacking context too, so the stage painted over the menu on Discover and
       on the Dashboard and the entries could not be pressed: the real test of
       "on top" is what the browser puts at the middle of each entry. Read by
       elementFromPoint, for every lighting LIGHTINGS names, on the three
       screens the menu has been lost on or kept on. */
    const views = [['Discover', () => { setTab(TAB.STORY); }], ['the Dashboard', () => { setTab(TAB.STORY);
      const d = document.getElementById('stdash'); if (d && !document.body.classList.contains('st-full')) d.click(); }], ['the Field', () => { setTab(TAB.FIELD); }]];
    for (const [W, H] of [[1600, 1000], [1100, 800]]) for (const [vn, go] of views) {
      const { cx, pg, errs } = await open(browser, W, H);
      const ids = await pg.evaluate(() => LIGHTINGS.map(t => t[0]));
      const bad = [], lifted = []; let tried = 0;
      for (const id of ids) {
        await pg.evaluate(id => { setLighting(id); }, id);
        await pg.evaluate(go);
        await pg.waitForTimeout(1100); await settled(pg);
        /* shut, the bar is painted as it always was: lifting it always would
           move its shadow over the stage in every glass lighting */
        const zShut = await pg.evaluate(() => ({ shut: document.getElementById('lightmenu').hidden, z: getComputedStyle(document.querySelector('.top')).zIndex }));
        if (!zShut.shut || zShut.z !== 'auto') lifted.push(id + ' ' + (zShut.shut ? 'z-index ' + zShut.z : 'menu open'));
        await pg.evaluate(() => { const m = document.getElementById('lightmenu'); if (m.hidden) document.getElementById('lightbtn').click(); });
        await pg.waitForTimeout(350);
        const r = await pg.evaluate(() => { const bs = [...document.querySelectorAll('#themes button')]; let ok = 0;
          bs.forEach(b => { const k = b.getBoundingClientRect(); const e = document.elementFromPoint(k.x + k.width / 2, k.y + k.height / 2); if (e && (e === b || b.contains(e))) ok++; });
          return { ok, n: bs.length, open: !document.getElementById('lightmenu').hidden }; });
        tried++; if (!r.open || r.ok !== r.n) bad.push(id + ' ' + r.ok + '/' + r.n + (r.open ? '' : ' shut'));
        await pg.evaluate(() => { const m = document.getElementById('lightmenu'); if (!m.hidden) document.getElementById('lightbtn').click(); });
      }
      ok(tried === ids.length && bad.length === 0, W + ', ' + vn + ': in all ' + tried + ' lightings every entry of the bar menu is what the browser puts at its centre' + (bad.length ? ', covered or shut in ' + bad.join(', ') : ''));
      ok(lifted.length === 0, W + ', ' + vn + ': with the menu shut the bar is not lifted, its z-index is auto in every lighting' + (lifted.length ? ', lifted in ' + lifted.join(', ') : ''));
      ok(errs.length === 0, W + ', ' + vn + ': no page error or console error: ' + errs.slice(0, 2).join(' | '));
      await cx.close();
    }
  }

  await browser.close();
  console.log('\n===== ' + PASS + ' passed, ' + FAIL + ' failed =====');
  process.exit(FAIL ? 1 : 0);
})();
