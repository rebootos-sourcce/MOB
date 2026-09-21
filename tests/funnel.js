/* ============================================================
   THE FUNNEL GATE.

   WHY THIS FILE EXISTS. On the night the deadline was the funnel, the funnel
   was the only half of this product with no measurement behind it. Four gates
   ran and not one of them opened a funnel page: `design.js` says the word
   funnel once, in a comment, and means the app. So the half his acceptance
   test is about, "when people jump into this product, they need to see that
   it is thoughtful, considerate, well crafted", was the half nobody could
   prove anything about, while the app half was green on everything.

   WHAT IT HOLDS. Every funnel page, at 1600 and at 390:

     1  it renders, rather than merely loading. A surface is counted in
        markup with its text recorded beside it, because the landing and the
        quiz both carry SVG and innerText does not see SVG.
     2  nothing leaves the machine. The product's whole claim is one file and
        no network, and the funnel says so in print on every page.
     3  no control is under 44 by 44. A link inside a paragraph is prose and
        is measured at 24, which is the pointer floor, and every one of them
        is printed rather than hidden, so an exemption cannot quietly grow.
     4  no page scrolls sideways, and no page is empty.
     5  every internal link points at a file that exists. A funnel with a
        broken route is a funnel with a hole in it.

   And the quiz, which is the only surface here with state:

     6  it answers from the first question to a reading without a dead end,
        and the reading carries the sections it promises.
     7  the seven band ring fills as the answers land, and the band it calls
        heaviest is the band the reading's own bars call heaviest. One
        arithmetic or it is two products.

   NO COUNT IS TYPED INTO THIS FILE. Not the number of pages, not the number
   of questions, not the number of controls, not the number of seats. Every
   one of them is read off the run and printed. This repository has been
   bitten nine times by a number typed into a gate or a document that the
   product then grew past, and CLAUDE.md records each one. The pages come off
   the directory, the questions come off QQ, the seats come off the engine's
   BANDS, and the ring's own seat list is compared against them rather than
   assumed to match.

       NODE_PATH=$(npm root -g) node tests/funnel.js

   Run from the repository root. Exits non zero on any failure, and every
   failure names the page, the width and the check.
   ============================================================ */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');

const DIR = path.resolve(__dirname, '..', 'funnel');
/* the pages come off the directory rather than out of a list here, so a page
   added to the funnel is gated the moment it lands. dist is a build product
   and is gated by its own check at the end. */
const PAGES = fs.readdirSync(DIR).filter(f => /\.html$/.test(f)).sort();
const WIDTHS = [[1600, 1000], [390, 844]];

let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) PASS++; else { FAIL++; console.log('  FAIL  ' + m); } };

/* every interactive thing on the page, with what it measures and whether it
   sits inside a paragraph. A link in a sentence is prose: sizing it to 44
   would break the line box it lives in, so it is held to the 24 pointer floor
   and printed by name. Everything else is a control and meets 44. */
const PROBE = () => {
  const out = { ctrl: [], prose: [], links: [] };
  document.querySelectorAll('a[href],button,input,select,textarea,[role="button"]')
    .forEach(n => {
      const r = n.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;              /* not shown */
      const t = (n.textContent || '').trim().slice(0, 36);
      const rec = { t: t, w: Math.round(r.width), h: Math.round(r.height),
        tag: n.tagName.toLowerCase() };
      (n.closest('p') ? out.prose : out.ctrl).push(rec);
    });
  document.querySelectorAll('a[href]').forEach(n => {
    const h = n.getAttribute('href');
    if (h && !/^(https?:|mailto:|#|data:)/.test(h)) out.links.push(h.split('#')[0]);
  });
  return out;
};

(async () => {
  const browser = await chromium.launch(
    { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

  console.log('\n=== funnel gate ===');
  console.log('  pages found: ' + PAGES.length + ' (' + PAGES.join(', ') + ')');
  ok(PAGES.length > 0, 'the funnel directory holds no html at all');

  let proseSeen = 0, ctrlSeen = 0, reqSeen = 0;

  for (const [w, hgt] of WIDTHS) {
    console.log('\n--- ' + w + ' ---');
    for (const p of PAGES) {
      const ctx = await browser.newContext({ viewport: { width: w, height: hgt } });
      const page = await ctx.newPage();
      const reqs = [], errs = [];
      page.on('request', r => {
        const u = r.url();
        if (!/^(file:|data:|blob:|about:)/.test(u)) reqs.push(u);
      });
      page.on('pageerror', e => errs.push(String(e && e.message || e)));
      page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });

      await page.goto('file://' + path.join(DIR, p), { waitUntil: 'load' });
      await page.waitForTimeout(120);

      const m = await page.evaluate(() => ({
        markup: document.body.innerHTML.length,
        text: document.body.innerText.trim().length,
        svg: document.querySelectorAll('svg').length,
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
        icon: !!document.querySelector('link[rel="icon"]'),
        title: (document.title || '').trim()
      }));
      const pr = await page.evaluate(PROBE);

      const tag = p + ' @' + w;
      /* 2. nothing leaves the machine */
      reqSeen += reqs.length;
      ok(reqs.length === 0, tag + ': ' + reqs.length + ' outbound request(s): '
        + reqs.slice(0, 3).join(' '));
      ok(errs.length === 0, tag + ': ' + errs.length + ' error(s): ' + errs.slice(0, 2).join(' | '));
      /* 1. it renders */
      ok(m.markup > 0, tag + ': the body is empty');
      ok(m.text > 0 || m.svg > 0, tag + ': no text and no svg, nothing rendered');
      ok(!!m.title, tag + ': no title, so the tab says the file name');
      ok(m.icon, tag + ': no favicon, so the tab carries a blank sheet');
      /* 4. no sideways scroll */
      ok(m.sw <= m.cw + 1, tag + ': scrolls sideways, ' + m.sw + ' in ' + m.cw);
      /* 3. the floor */
      const under = pr.ctrl.filter(c => c.w < 44 || c.h < 44);
      ctrlSeen += pr.ctrl.length; proseSeen += pr.prose.length;
      ok(under.length === 0, tag + ': ' + under.length + ' control(s) under 44 by 44: '
        + under.slice(0, 4).map(c => '"' + c.t + '" ' + c.w + 'x' + c.h).join(', '));
      const tiny = pr.prose.filter(c => c.w < 24 || c.h < 24);
      ok(tiny.length === 0, tag + ': ' + tiny.length + ' prose link(s) under 24: '
        + tiny.slice(0, 4).map(c => '"' + c.t + '" ' + c.w + 'x' + c.h).join(', '));
      /* 5. every route lands */
      const dead = [...new Set(pr.links)].filter(u => u && !fs.existsSync(path.join(DIR, u)));
      ok(dead.length === 0, tag + ': ' + dead.length + ' route(s) go nowhere: ' + dead.join(' '));

      console.log('  ' + p.padEnd(12) + ' markup ' + String(m.markup).padStart(6)
        + '  text ' + String(m.text).padStart(5) + '  svg ' + String(m.svg).padStart(2)
        + '  controls ' + String(pr.ctrl.length).padStart(2)
        + '  prose links ' + String(pr.prose.length).padStart(2)
        + '  routes ' + [...new Set(pr.links)].length
        + '  requests ' + reqs.length);
      if (pr.prose.length) {
        console.log('       prose, held at 24: '
          + pr.prose.map(c => '"' + c.t + '" ' + c.w + 'x' + c.h).join(', '));
      }
      await ctx.close();
    }
  }

  /* ---------- the quiz, which is the only surface with state ---------- */
  for (const [w, hgt] of WIDTHS) {
    console.log('\n--- the quiz, answered, @' + w + ' ---');
    const ctx = await browser.newContext({ viewport: { width: w, height: hgt } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e && e.message || e)));
    await page.goto('file://' + path.join(DIR, 'quiz.html'), { waitUntil: 'load' });

    /* the shape of the thing, read off the page rather than written here */
    const shape = await page.evaluate(() => ({
      questions: QQ.length, laws: SINAMES.length, seats: BANDS.slice(),
      ringSeats: RING.SEATS.map(s => s[0]), scale: QSCALE.length,
      mismatch: SEATMISMATCH
    }));
    console.log('  questions ' + shape.questions + '  laws ' + shape.laws
      + '  scale ' + shape.scale + '  seats ' + shape.seats.length);
    ok(!shape.mismatch, '@' + w + ': the ring seats are not the engine bands');
    ok(shape.ringSeats.join('|') === shape.seats.join('|'),
      '@' + w + ': ring seats ' + shape.ringSeats + ' against bands ' + shape.seats);

    /* 7. the ring exists and starts unread */
    const bands0 = await page.$$eval('#ringtop .ring-b', n => n.map(x => +x.style.strokeWidth));
    ok(bands0.length === shape.seats.length,
      '@' + w + ': the ring draws ' + bands0.length + ' bands for ' + shape.seats.length + ' seats');
    const flat0 = bands0.every(v => v === bands0[0]);
    ok(flat0, '@' + w + ': the ring is not flat before anything is answered');

    /* 6. answer the first sweep. One tap is the answer and the step forward,
       so the number of taps is the number of answers. The sweep length is the
       law count, because the serve order touches every law before it
       repeats, and that is what makes a reading available to somebody who
       stops early. */
    await page.click('#go');
    const t0 = Date.now();
    for (let i = 0; i < shape.laws; i++) {
      const n = await page.locator('.opt').count();
      ok(n === shape.scale, '@' + w + ': question ' + (i + 1) + ' offers ' + n
        + ' options against a scale of ' + shape.scale);
      if (n !== shape.scale) break;
      await page.locator('.opt').nth((i * 3) % shape.scale).click();
    }
    const tSweep = Date.now() - t0;

    const bands1 = await page.$$eval('#ringtop .ring-b', n => n.map(x => +x.style.strokeWidth));
    const moved = bands1.filter((v, i) => Math.abs(v - bands0[i]) > 0.01).length;
    ok(moved === shape.seats.length,
      '@' + w + ': ' + moved + ' of ' + shape.seats.length + ' bands moved on the first sweep');
    console.log('  first sweep: ' + shape.laws + ' taps in ' + tSweep + 'ms, '
      + (tSweep / shape.laws).toFixed(1) + 'ms a tap, ' + moved + ' bands moved');

    /* the ring's verdict and the reading's bars are one number or they are two
       products. Read both and compare the name, not the drawing. */
    const label = (await page.locator('#rlab').innerText()).trim();
    ok(/Carrying most/.test(label), '@' + w + ': the ring says "' + label + '" after a full sweep');

    /* 6. a reading is reachable early and it is not empty */
    const stop = page.locator('#stop');
    ok(await stop.count() === 1, '@' + w + ': no way to read it from here after a full sweep');
    await stop.click();
    const rd = await page.evaluate(() => ({
      sections: document.querySelectorAll('.read section').length,
      seats: [...document.querySelectorAll('.seats li')].map(li => ({
        nm: li.querySelector('b').textContent.trim(),
        v: parseFloat(li.querySelector('em').textContent) })),
      bigring: document.querySelectorAll('.bigring .ring-b').length,
      acts: document.querySelectorAll('.acts button').length,
      text: document.body.innerText.trim().length,
      cq: (document.querySelector('.cq b') || {}).textContent
    }));
    ok(rd.sections > 0, '@' + w + ': the reading has no sections');
    ok(rd.seats.length === shape.seats.length,
      '@' + w + ': the reading prints ' + rd.seats.length + ' seats for ' + shape.seats.length);
    ok(rd.bigring === shape.seats.length,
      '@' + w + ': the reading draws ' + rd.bigring + ' bands for ' + shape.seats.length);
    ok(rd.acts > 0, '@' + w + ': the reading offers nothing to do next');
    ok(rd.text > 0, '@' + w + ': the reading is empty');
    ok(/^\d+$/.test(String(rd.cq || '')), '@' + w + ': the reading prints no coherence figure');

    /* 7. one arithmetic. The heaviest band the ring named has to be the
       heaviest row the bars print. */
    const heaviestBar = rd.seats.slice().sort((a, b) => b.v - a.v)[0];
    ok(label.indexOf(heaviestBar.nm) >= 0,
      '@' + w + ': the ring says "' + label + '" and the bars say ' + heaviestBar.nm);
    console.log('  reading: ' + rd.sections + ' sections, coherence ' + rd.cq
      + ', heaviest ' + heaviestBar.nm + ' at ' + heaviestBar.v
      + ', ' + rd.acts + ' things to do next');

    /* no dead end: every control on the reading still responds */
    await page.locator('#again').click();
    ok(await page.locator('.opt').count() === shape.scale,
      '@' + w + ': "Change an answer" does not return to a question');

    ok(errs.length === 0, '@' + w + ': the quiz threw: ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  /* ---------- the sendable build, if it has been made ---------- */
  console.log('\n--- dist ---');
  const DIST = path.join(DIR, 'dist');
  if (!fs.existsSync(DIST)) {
    console.log('  no dist, not built this run');
  } else {
    const built = fs.readdirSync(DIST).filter(f => /\.html$/.test(f)).sort();
    console.log('  built files: ' + built.length + ' (' + built.join(', ') + ')');
    ok(built.length === PAGES.length,
      'dist holds ' + built.length + ' pages against ' + PAGES.length + ' in the source');
    for (const f of built) {
      const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
      const page = await ctx.newPage();
      const reqs = [];
      page.on('request', r => {
        const u = r.url();
        if (!/^(file:|data:|blob:|about:)/.test(u)) reqs.push(u);
      });
      /* a sendable file opens alone. It is copied out of dist on its own so a
         sibling left beside it cannot make a broken one look whole. */
      const solo = fs.mkdtempSync(path.join(require('os').tmpdir(), 'funnel-solo-'));
      fs.copyFileSync(path.join(DIST, f), path.join(solo, f));
      const errs = [];
      page.on('pageerror', e => errs.push(String(e && e.message || e)));
      page.on('console', mm => { if (mm.type() === 'error') errs.push('console: ' + mm.text()); });
      await page.goto('file://' + path.join(solo, f), { waitUntil: 'load' });
      await page.waitForTimeout(120);
      const mk = await page.evaluate(() => ({
        markup: document.body.innerHTML.length,
        text: document.body.innerText.trim().length,
        svg: document.querySelectorAll('svg').length,
        refusal: /did not load completely/.test(document.body.innerText)
      }));
      ok(mk.markup > 0 && (mk.text > 0 || mk.svg > 0), 'dist/' + f + ': renders nothing on its own');
      ok(!mk.refusal, 'dist/' + f + ': opens on its own and says it did not load completely');
      ok(reqs.length === 0, 'dist/' + f + ': ' + reqs.length + ' outbound request(s)');
      ok(errs.length === 0, 'dist/' + f + ': ' + errs.length + ' error(s): ' + errs.slice(0, 2).join(' | '));
      console.log('  ' + f.padEnd(24) + ' markup ' + String(mk.markup).padStart(7)
        + '  text ' + String(mk.text).padStart(5) + '  svg ' + String(mk.svg).padStart(2)
        + '  requests ' + reqs.length);
      fs.rmSync(solo, { recursive: true, force: true });
      await ctx.close();
    }
  }

  await browser.close();
  console.log('\n  controls measured ' + ctrlSeen + ', prose links ' + proseSeen
    + ', outbound requests ' + reqSeen);
  console.log('  ' + PASS + ' passed, ' + FAIL + ' failed\n');
  process.exit(FAIL ? 1 : 0);
})();
