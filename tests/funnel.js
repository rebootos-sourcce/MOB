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
        and the reading carries the sections it promises, unfolding one layer
        at a time with a way past every one of them.
     7  the seven band ring fills as the answers land, and the band it calls
        heaviest is the band the reading's own bars call heaviest. One
        arithmetic or it is two products.

   And the landing's one beat that is a timeline rather than a state:

     8  the cascade, funnel beat 04, runs and repeats, quickens, ends with
        nothing coming in, holds still under reduced motion and reads with no
        script, measured in the canvas's own pixels under a paused clock.

   And the landing's one beat a person answers:

     9  the signal test, his slide 03, sits after recognition and before
        the mirror, asks his questions in his order, says back what was
        picked or typed exactly as given, stores nothing, draws a point on
        the body only for a place picked from the list, and reads in full
        with no script.
    10  reframe, his slide 17, sits after release and before verify, mirrors
        whatever is typed exactly, never as markup, lets it be changed, and
        refuses an empty answer by name rather than accepting it as one.
    11  verify, his slide 19, sits right after reframe and before the loop,
        tells the truth about having no baseline when the signal test was
        never taken or found nothing, shows the signal test's own reading
        when it was, and answers "Nothing changed" the same as the other
        four: a real result, never a failure. Neither frame writes to
        storage.

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
    { executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

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

    /* THE SIGNAL, before the questions. A person starting is asked where they
       notice something and what happens there, then is told back what they
       picked, and nothing about it is scored, stored or put in the record.
       The places and the words are read off the page's own tables, never
       typed here. 1600 walks the picks and 390 walks typed words with markup
       in them, so both routes are held and esc() is held with them. */
    const sig = await page.evaluate(() => ({
      state: STATE, at: SIG_AT, where: SIG_WHERE.slice(), what: SIG_WHAT.map(p => p.slice()),
      places: document.querySelectorAll('[data-where]').length,
      skip: !!document.getElementById('sigskip'), own: !!document.getElementById('sigtx')
    }));
    ok(sig.state === 'notice' && sig.at === 'where',
      '@' + w + ': Start opens on ' + sig.state + '/' + sig.at + ', not on the signal');
    ok(sig.places === sig.where.length + 1,
      '@' + w + ': the signal offers ' + sig.places + ' places for ' + sig.where.length + ' and a way out');
    ok(sig.skip && sig.own, '@' + w + ': the signal has no skip or no box for own words');
    let expect, given;
    if (w > 400) {
      const pi = 1, si = 0;
      await page.click('[data-where="' + sig.where[pi] + '"]');
      ok(await page.locator('[data-what]').count() === sig.what.length + 1,
        '@' + w + ': the second step does not offer every word and a way out');
      await page.click('[data-what="' + si + '"]');
      given = sig.what[si][1];
      expect = 'You noticed ' + sig.what[si][1] + ' in your ' + sig.where[pi].toLowerCase() + '.';
    } else {
      const P = 'my <i>neck</i>', S = 'like a <b>fist</b>';
      await page.fill('#sigtx', P); await page.press('#sigtx', 'Enter');
      await page.fill('#sigtx', S); await page.click('#sigown');
      given = 'fist';
      expect = 'You noticed “' + S + '” in “' + P + '”.';
      ok(await page.locator('.sigseen i, .sigseen b').count() === 0,
        '@' + w + ': typed markup became markup on the signal');
    }
    const said = (await page.locator('.sigseen .said').innerText()).trim();
    ok(said === expect, '@' + w + ': the signal said back "' + said + '", expected "' + expect + '"');
    await page.click('#sigstart');
    ok(await page.evaluate(() => STATE === 'q' && answered() === 0),
      '@' + w + ': Start the questions did not land on an unanswered question');
    console.log('  signal: said back "' + said + '"');

    const t0 = Date.now();
    for (let i = 0; i < shape.laws; i++) {
      const n = await page.locator('.opt').count();
      ok(n === shape.scale, '@' + w + ': question ' + (i + 1) + ' offers ' + n
        + ' options against a scale of ' + shape.scale);
      if (n !== shape.scale) break;
      await page.locator('.opt').nth((i * 3) % shape.scale).click();
    }
    const tSweep = Date.now() - t0;

    /* checked after the sweep and not before it: the page saves on an answer,
       so before the first answer nothing has been written and this could not
       fail. Checked against a copy that saves the signal, which it caught. */
    const kept = await page.evaluate(() => JSON.stringify(localStorage) + recordJSON());
    ok(kept.indexOf(given) < 0,
      '@' + w + ': what was noticed, "' + given + '", reached storage or the record');

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

    /* THE READING UNFOLDS, punch list item 6, the audit's section 20: "Do not
       show everything at once." It opens on its first layer alone; Keep
       reading adds exactly the next one, in order, and nothing past it; each
       layer arrives carrying its own data and the layers after it carry none
       of theirs; the page lands on the layer it opened, with focus on it; the
       door waits for the last layer; and Show the whole reading opens every
       layer left in one press from any of them. The number of layers is read
       off the page's own markup as it grows, never typed here, and what each
       layer must carry is read off the engine: the five thinnest laws off
       scored(), the seats off BANDS, and the release order off relQueueOf,
       the queue the app's own Release button takes.
       Checked against three broken copies first: one that opened on every
       layer at once, one whose second layer dropped the laws, and one whose
       last layer named the heaviest address in place of the release order.
       The gate caught all three. */
    const layerState = () => page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const secs = [...document.querySelectorAll('.read section[data-layer]')];
      const last = secs[secs.length - 1];
      const lr = last ? last.getBoundingClientRect() : { top: -1 };
      return {
        layers: secs.map(s => +s.getAttribute('data-layer')),
        heads: secs.map(s => (s.querySelector('h1,h2') || {}).textContent || ''),
        cq: !!document.querySelector('section[data-layer] .cq b'),
        laws: document.querySelectorAll('.laws li').length,
        sabs: document.querySelectorAll('.read .sab').length,
        sabNone: secs.some(s => /No saboteur is firing/.test(s.textContent)),
        seats: document.querySelectorAll('.seats li').length,
        bigring: document.querySelectorAll('.bigring .ring-b').length,
        order: [...document.querySelectorAll('.order li b')].map(b => b.textContent),
        orderNone: secs.some(s => /a release has no address to start on/.test(s.textContent)),
        more: !!document.getElementById('more'), all: !!document.getElementById('readall'),
        door: !!document.getElementById('tostory'),
        next: ((document.querySelector('.unfold p') || {}).textContent || '').trim(),
        focus: document.activeElement ? document.activeElement.id : '',
        lastTop: Math.round(lr.top), vh: innerHeight,
        atEnd: scrollY + innerHeight >= document.documentElement.scrollHeight - 2,
        choices: [...document.querySelectorAll('button,input,select,textarea,a[href],[role=button]')]
          .filter(vis).length
      };
    });
    const want = await page.evaluate(() => {
      read(scored().p);
      return { laws: Math.min(5, scored().laws.length), seats: BANDS.length,
        order: relQueueOf(8).map(n => n.k) };
    });
    /* what layer n must carry, and what a later layer's data looks like when
       it has leaked in early */
    const CARRY = [
      [st => st.cq, st => st.cq],
      [st => st.laws === want.laws, st => st.laws > 0],
      [st => st.sabs > 0 || st.sabNone, st => st.sabs > 0 || st.sabNone],
      [st => st.seats === want.seats && st.bigring === want.seats, st => st.seats > 0 || st.bigring > 0],
      [st => want.order.length ? st.order.join('|') === want.order.join('|') : st.orderNone,
       st => st.order.length > 0 || st.orderNone]];
    const has = (st, n) => !!CARRY[n - 1] && CARRY[n - 1][0](st);
    const early = (st, n) => CARRY[n - 1][1](st);

    let st = await layerState();
    ok(st.layers.join(',') === '1', '@' + w + ': the reading opens on layers ' + st.layers.join(',') + ', not on the first alone');
    ok(st.more && st.all, '@' + w + ': the first layer offers no Keep reading or no way to the whole reading');
    ok(!st.door, '@' + w + ': the door to the story is on the page before the reading has unfolded');
    const walk = [];
    let n = 1;
    for (;;) {
      ok(has(st, n), '@' + w + ': layer ' + n + ' arrived without its own data: ' + JSON.stringify(st));
      for (let k = n + 1; k <= CARRY.length; k++)
        ok(!early(st, k), '@' + w + ': layer ' + k + '\'s data is on the page at layer ' + n);
      ok(st.choices < 12, '@' + w + ': layer ' + n + ' opens on ' + st.choices + ' choices, over the house target of under 12');
      walk.push(n + ' "' + st.heads[n - 1] + '" ' + st.choices + ' choices' + (st.next ? ', then "' + st.next + '"' : ''));
      if (!st.more) break;
      await page.click('#more');
      const st2 = await layerState();
      ok(st2.layers.length === st.layers.length + 1 && st2.layers.every((v, i) => v === i + 1),
        '@' + w + ': Keep reading went from layers ' + st.layers + ' to ' + st2.layers);
      ok(st2.focus === 'layer' + st2.layers.length,
        '@' + w + ': Keep reading left focus on "' + st2.focus + '", not on the layer it opened');
      /* at the top of the screen, or as near it as the page can scroll: a
         short layer at the foot of the page cannot climb past the end */
      ok(st2.lastTop >= 0 && (st2.lastTop < st2.vh / 2 || (st2.atEnd && st2.lastTop < st2.vh - 120)),
        '@' + w + ': the layer Keep reading opened sits at ' + st2.lastTop + ' in a ' + st2.vh + ' screen');
      st = st2; n = st.layers.length;
      if (n > 12) break;                       /* a runaway, not a reading */
    }
    ok(st.door && !st.all, '@' + w + ': after the last layer the door is ' + (st.door ? 'there' : 'missing')
      + ' and the skip is ' + (st.all ? 'still there' : 'gone'));
    const N = n;
    ok(N === CARRY.length, '@' + w + ': the reading unfolds in ' + N + ' layers and the gate knows what '
      + CARRY.length + ' of them carry');
    console.log('  unfolds in ' + N + ' layers:');
    walk.forEach(l => console.log('    ' + l));

    /* the way past, from the first layer and from a middle one. Reset to one
       layer through the page's own state, which is what a new visit holds. */
    for (const from of [1, 3]) {
      await page.evaluate(k => { READ_AT = k; render(); scrollTo(0, 0); }, from);
      await page.click('#readall');
      const sa = await layerState();
      ok(sa.layers.length === N && sa.door && !sa.more,
        '@' + w + ': Show the whole reading from layer ' + from + ' opened ' + sa.layers.length + ' of the layers, door '
        + (sa.door ? 'there' : 'missing'));
      ok(sa.focus === 'layer' + (from + 1),
        '@' + w + ': Show the whole reading from layer ' + from + ' left focus on "' + sa.focus + '"');
      for (let k = 1; k <= N; k++) ok(has(sa, k), '@' + w + ': the whole reading is missing layer ' + k + '\'s data');
    }

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

    /* YES AND NOT ME ON THE STORY'S ADDRESSES, punch list item 5. Every
       address a card names asks Yes or Not me, in the app's own two words; the
       heaviest shows and the rest sit behind a button that says how many; a
       press is held, said back, and taken back by a second press; a Not me
       leaves the card's last line; and nothing marked reaches storage or the
       record. The story is read in the real reader, so the cards and their
       addresses come off the engine and no count of them is typed here.
       Checked against two broken copies first, one that wrote the marks into
       the record as an entry and one that kept comparing the answers with a
       refused address. The gate caught both. */
    await page.locator('#stop').click();
    const rec0 = await page.evaluate(() => recordJSON());
    await page.click('#tostory');
    const ST = 'I was scared to call my mother. My chest went tight and I felt ashamed that I still flinch.';
    await page.fill('#storytx', ST);
    await page.click('#readit');
    const cardsOf = () => page.evaluate(() => [...document.querySelectorAll('.sab[data-card]')].map(c => {
      const runs = [...c.querySelectorAll('.sl')].map(n => n.textContent)
        .filter(t => /^It runs on:/.test(t))[0] || '';
      const m = runs.match(/^It runs on: (One|\d+) address/);
      return { fet: c.getAttribute('data-card'),
        n: m ? (m[1] === 'One' ? 1 : +m[1]) : 0,
        rows: [...c.querySelectorAll('.addr')].map(r => r.getAttribute('data-addr')),
        yes: [...c.querySelectorAll('[data-ans="yes"]')].map(b => b.textContent),
        no: [...c.querySelectorAll('[data-ans="no"]')].map(b => b.textContent),
        more: (c.querySelector('[data-more]') || {}).textContent || '',
        last: ([...c.querySelectorAll('.sl')].pop() || {}).textContent || '' };
    }));
    const c0 = await cardsOf();
    const asking = c0.filter(c => c.n > 0);
    ok(asking.length > 0, '@' + w + ': the story read no card with an address, so nothing asks Yes or Not me');
    asking.forEach(c => {
      ok(c.rows.length === 1, '@' + w + ': the ' + c.fet + ' card opens on ' + c.rows.length + ' addresses, not its heaviest one');
      ok(c.yes.every(t => t === 'Yes') && c.no.every(t => t === 'Not me') && c.yes.length === c.rows.length
        && c.no.length === c.rows.length,
        '@' + w + ': the ' + c.fet + ' card does not ask Yes and Not me on every address it shows: '
        + c.yes.concat(c.no).join('/'));
      const rest = c.n - c.rows.length;
      ok(rest === 0 ? !c.more : (c.more.indexOf(String(rest)) === 0),
        '@' + w + ': the ' + c.fet + ' card holds ' + c.n + ' addresses and its button says "' + c.more + '"');
    });
    /* the load and the floor, on the page as it opens with the rows on it */
    const choices = await page.evaluate(() => [...document.querySelectorAll(
      'button,input,select,textarea,a[href],[role=button]')].filter(e => {
      const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).length);
    ok(choices < 12, '@' + w + ': the story page opens on ' + choices + ' choices, over the house target of under 12');
    const spr = await page.evaluate(PROBE);
    const sunder = spr.ctrl.filter(c => c.w < 44 || c.h < 44);
    ok(sunder.length === 0, '@' + w + ': ' + sunder.length + ' story control(s) under 44 by 44: '
      + sunder.slice(0, 4).map(c => '"' + c.t + '" ' + c.w + 'x' + c.h).join(', '));

    /* a press is held, said back, keeps focus, and a second press takes it back */
    const first = asking[0], ai = first.rows[0];
    const rowState = () => page.evaluate(i => {
      const r = document.querySelector('.addr[data-addr="' + i + '"]');
      const a = document.activeElement;
      return { yes: r.querySelector('[data-ans="yes"]').getAttribute('aria-pressed'),
        no: r.querySelector('[data-ans="no"]').getAttribute('aria-pressed'),
        said: ((r.querySelector('.addrst') || {}).textContent || ''),
        focus: a ? (a.getAttribute('data-ans') || '') + ':' + (a.getAttribute('data-ai') || '') : '' };
    }, ai);
    await page.click('.addr[data-addr="' + ai + '"] [data-ans="no"]');
    let rs = await rowState();
    ok(rs.no === 'true' && rs.yes === 'false' && /^Marked not you\./.test(rs.said),
      '@' + w + ': Not me was not held and said back: ' + JSON.stringify(rs));
    ok(rs.focus === 'no:' + ai, '@' + w + ': focus left Not me after the redraw, it is on "' + rs.focus + '"');
    await page.click('.addr[data-addr="' + ai + '"] [data-ans="yes"]');
    rs = await rowState();
    ok(rs.yes === 'true' && rs.no === 'false' && rs.said === 'Marked yours.',
      '@' + w + ': Yes did not replace Not me: ' + JSON.stringify(rs));
    await page.click('.addr[data-addr="' + ai + '"] [data-ans="yes"]');
    rs = await rowState();
    ok(rs.yes === 'false' && rs.no === 'false' && rs.said === '',
      '@' + w + ': a second press on Yes did not take it back: ' + JSON.stringify(rs));

    /* the rest of the card opens, and focus lands on the first it revealed */
    if (first.n > 1) {
      await page.click('.sab[data-card="' + first.fet + '"] [data-more]');
      const c1 = (await cardsOf()).filter(c => c.fet === first.fet)[0];
      ok(c1.rows.length === first.n && !c1.more,
        '@' + w + ': the ' + first.fet + ' card opened ' + c1.rows.length + ' of ' + first.n + ' addresses');
      const fa = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-ai'));
      ok(fa === c1.rows[1], '@' + w + ': opening the card left focus on ' + fa + ', not the first address it revealed');
    }

    /* a Not me on every address the card names takes the answers' comparison
       off every one of them, so its last line no longer talks about addresses */
    const before = (await cardsOf()).filter(c => c.fet === first.fet)[0];
    for (const id of before.rows) await page.click('.addr[data-addr="' + id + '"] [data-ans="no"]');
    const after = (await cardsOf()).filter(c => c.fet === first.fet)[0];
    ok(!/address/.test(after.last),
      '@' + w + ': every address on the ' + first.fet + ' card is Not me and its last line still reads "' + after.last + '"');
    console.log('  story: ' + c0.length + ' cards, ' + asking.map(c => c.fet + ' ' + c.n).join(', ')
      + ' addresses, ' + choices + ' choices as it opens');
    console.log('  last line before Not me: "' + before.last + '"');
    console.log('  last line after Not me:  "' + after.last + '"');

    /* nothing marked reaches the record or storage. The record is compared
       whole, less the three fields every call stamps fresh. */
    const strip = j => { const o = JSON.parse(j); delete o.id; delete o.created; delete o.updated; return o; };
    const rec1 = await page.evaluate(() => recordJSON());
    ok(JSON.stringify(strip(rec1)) === JSON.stringify(strip(rec0)),
      '@' + w + ': marking Yes and Not me changed the record');
    const r1 = JSON.parse(rec1);
    ok(r1.story && r1.story.entries && r1.story.entries.length === 0,
      '@' + w + ': the record carries ' + (r1.story && r1.story.entries ? r1.story.entries.length : '?') + ' story entries');
    const stored = await page.evaluate(() => {
      const out = {}; for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i); out[k] = localStorage.getItem(k); } return out; });
    const keys = Object.keys(stored).map(k => k + ':' + Object.keys(JSON.parse(stored[k]) || {}).join(','));
    ok(keys.length === 1 && keys[0] === 'atuned.quiz.v2:a',
      '@' + w + ': storage holds more than the answers: ' + keys.join(' '));
    ok(JSON.stringify(stored).indexOf('mother') < 0, '@' + w + ': the story reached storage');

    /* and the door says what was marked is not in the record */
    await page.click('#todoor');
    const doorSay = await page.locator('.door').first().innerText();
    ok(/what you marked Yes or Not me are not in it/.test(doorSay),
      '@' + w + ': the door does not say what was marked is not in the record');

    ok(errs.length === 0, '@' + w + ': the quiz threw: ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  /* ---------- what the tiers page promises about sight ----------
     The owner ruled sight by tier on 1 October, reversing "sight is not for
     sale". The buy page is static and the table that decides is code
     (engine/plan.js SIGHT), so the page is read against the table here and not
     against a sentence typed into this gate: a tier moved in the table that
     leaves a customer a wrong promise on this page fails here. It reads the
     built engine, engine.js, which BUILD-engine.sh writes at the repository
     root. The page is read from the source html and not from dist, because dist
     is a build product and is only as fresh as its last build. */
  console.log('\n--- the buy page, against SIGHT ---');
  {
    const ENG = path.resolve(DIR, '..', 'engine.js');
    if (!fs.existsSync(ENG)) {
      console.log('  no engine.js, not checked: run atuned_src/BUILD-engine.sh first');
      ok(false, 'engine.js is missing, so the buy page cannot be read against SIGHT');
    } else {
      const E = require(ENG);
      const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
      const page = await ctx.newPage();
      await page.goto('file://' + path.join(DIR, 'buy.html'), { waitUntil: 'load' });
      const buy = await page.evaluate(() => ({
        meta: (document.querySelector('meta[name=description]') || {}).content || '',
        text: document.body.innerText,
        lead: (document.querySelector('.lead') || {}).innerText || '',
        rungs: Object.fromEntries([...document.querySelectorAll('#sees li[data-rung]')]
          .map(li => [li.getAttribute('data-rung'), li.innerText.toLowerCase()]))
      }));
      /* the reversed ruling is not on the page in any wording */
      ok(!/whole reading/i.test(buy.meta + ' ' + buy.text),
        'buy: still says the whole reading, which is not on every tier any more');
      ok(!/sight is not for sale|every rung sees|only thing that moves is volume|with everything visible/i
          .test(buy.meta + ' ' + buy.text),
        'buy: still carries a line from the ruling that was reversed');
      ok(/your own reading/i.test(buy.lead) && /how far up the chain/i.test(buy.lead),
        'buy: the lead does not say your own reading is on every tier and a tier changes how far you see');
      const keys = Object.keys(buy.rungs);
      ok(keys.join() === 'free,one,two,three,four',
        'buy: the sight list has the rungs ' + keys.join() + ', not free, one, two, three, four');
      const TIERS = ['free', 'one', 'two', 'three', 'four'];
      /* a row of SIGHT with no surface is not promised, so it must not be on the
         page: the Kundalini is ruled and unbuilt, and selling it is the lie */
      for (const g of E.SIGHT) {
        const nm = g.nm.replace(/^the /, '').toLowerCase();
        if (g.built === false) {
          ok(!new RegExp('\\b' + nm.replace(/^the /, '') + '\\b', 'i').test(buy.text),
            'buy: names ' + g.nm + ', which has no surface in the product yet');
          continue;
        }
        const at = TIERS.indexOf(g.need);
        ok(buy.rungs[g.need] && buy.rungs[g.need].indexOf(nm) >= 0,
          'buy: the ' + g.need + ' rung does not name ' + nm + ', which SIGHT says it unlocks');
        for (const lower of TIERS.slice(0, at))
          ok(buy.rungs[lower] && buy.rungs[lower].indexOf(nm) < 0,
            'buy: the ' + lower + ' rung names ' + nm + ', which SIGHT says needs ' + g.need);
      }
      ok(/what tier three shows/.test(buy.rungs.four || ''),
        'buy: tier four does not say it shows what tier three shows');
      ok(E.planAdds('four').length === 0,
        'SIGHT now adds something at tier four, and the buy page says tier four adds only the lead suite');
      /* TIER FOUR IS CLOSED UNTIL BUILT, round PK, and for a round the page sold
         it anyway. While the row in engine/plan.js says built:false the page
         must say, on the rung and in the ladder, that it is not open, and must
         not describe the consent list as a thing that exists today. */
      if (E.PLAN_BY.four.built === false) {
        ok(!E.planBuyable('four'), 'engine: a tier marked built:false must not be buyable');
        ok(/not open yet/.test(buy.rungs.four || ''),
          'buy: tier four is closed until built, and its rung does not say it is not open yet');
        ok(/opens with the lead suite/i.test(buy.text),
          'buy: tier four is closed, and the page does not say "Opens with the lead suite"');
        ok(!/sits on their own record|one press takes the yes back|what it adds is the cohort lead suite/i.test(buy.text),
          'buy: describes the lead suite or its consent list in the present tense, and neither is built');
      }
      /* THE REFERRAL IS RULED AND NOT BUILT, round RB. The page promised 25
         patterns an invitation and nothing in the product sends one or grants
         one. This holds the promise off the page until a mechanism exists; when
         it does, this line moves with it. */
      ok(!/invite somebody|invitations? a month|when they join|refer a friend/i.test(buy.text),
        'buy: promises a referral, and nothing in the product invites anybody or grants patterns for it');
      await ctx.close();
    }
  }

  /* ---------- the landing's cascade, funnel beat 04 ----------
     The TDD, section 12: a disturbance enters, the answer travels through the
     system, the system repeats, the answer becomes conditioned, and "the
     original event can eventually become unnecessary for the response to
     appear." Every one of those is held here against the page as it runs,
     under Playwright's clock so a moment is the same moment every run:

       it sits where the TDD puts it, after the mirror and before the network
       it runs its steps in order and comes round again, so it repeats
       a spark enters on the first pass, and none on the last
       the spark's flight is shorter on each pass that has one: it quickens
       it says, in print, that the picture is a model
       reduced motion gets the end state, drawn, and nothing travels
       with no script it reads in full, key included
       and nothing leaves the machine while it runs

     The spark is the only mark drawn outside the ring, so it is found in
     pixels beyond the ring's reach: the radius, its glow and the landing ring
     at most. That reach is the page's own layout rule, R from the stage's
     short side and SK from R, read here off the canvas rather than out of a
     table. If the rule changes the ring's glow lands past the line and the
     last pass reports a spark, which is a loud failure and not a quiet one.

     No pass count, cycle length or duration is typed here. The run samples
     until the lit step has come round to the first one again, under a cap. */
  /* Playwright's installed clock keeps flowing in real time between runFor
     calls, so a slow pixel read would add time nobody asked for and the
     passes would arrive early. It is paused before the page loads, and moves
     only when told. Paused then and not later, because pausing a running
     clock "a little ahead" is a race a loaded machine loses. The frame is
     entered the way a reader enters it, by scrolling, and the run waits for
     the frame to take the stage rather than assuming it has. */
  const PAUSED = async (pg) => { await pg.clock.install({ time: 0 }); await pg.clock.pauseAt(1000); };
  const INTO = async (pg) => {
    await pg.evaluate(() => document.fonts.ready);
    await pg.evaluate(() => {
      const el = document.getElementById('cascade'), r = el.getBoundingClientRect();
      const sh = innerWidth >= 900 ? 0 : document.getElementById('stage').getBoundingClientRect().height;
      window.scrollTo({ top: scrollY + r.top - sh, behavior: 'instant' });
    });
    for (let i = 0; i < 100; i++) {
      await pg.clock.runFor(20);
      if (await pg.evaluate(() => !!document.querySelector('#csteps li.on'))) return true;
    }
    return false;
  };
  for (const [w, hgt] of WIDTHS) {
    console.log('\n--- the landing cascade @' + w + ' ---');
    const ctx = await browser.newContext({ viewport: { width: w, height: hgt } });
    const page = await ctx.newPage();
    const reqs = [], errs = [];
    page.on('request', r => { const u = r.url(); if (!/^(file:|data:|blob:|about:)/.test(u)) reqs.push(u); });
    page.on('pageerror', e => errs.push(String(e && e.message || e)));
    await PAUSED(page);
    await page.goto('file://' + path.join(DIR, 'index.html'), { waitUntil: 'load' });
    await page.clock.runFor(200);

    const shape = await page.evaluate(() => {
      const c = document.getElementById('cascade'), mi = document.getElementById('mirror'),
        nw = document.getElementById('connect');
      if (!c) return null;
      const after = (a, b) => !!(a && b && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING));
      return { frame: c.getAttribute('data-frame'),
        afterMirror: after(mi, c), beforeNetwork: after(c, nw),
        steps: [...c.querySelectorAll('#csteps li')].map(l => l.getAttribute('data-step')),
        labels: [...c.querySelectorAll('#csteps li b')].map(b => b.textContent.trim()),
        head: (c.querySelector('h2') || {}).textContent || '',
        text: c.textContent.replace(/\s+/g, ' '),
        key: !!c.querySelector('.cap-t[aria-controls="cap-cascade"]') && !!document.getElementById('cap-cascade') };
    });
    ok(!!shape, '@' + w + ': the landing has no cascade frame');
    if (!shape) { await ctx.close(); continue; }
    ok(shape.frame === 'cascade', '@' + w + ': the cascade frame is called ' + shape.frame);
    ok(shape.afterMirror && shape.beforeNetwork,
      '@' + w + ': the cascade is not between the mirror (beat 03) and the network (beat 05)');
    ok(shape.steps.join() === 'once,again,own', '@' + w + ': the steps read ' + shape.steps.join());
    ok(/pattern/i.test(shape.head), '@' + w + ': the headline does not say a response becomes a pattern');
    ok(/our own model/i.test(shape.text), '@' + w + ': the frame never says the picture is a model');
    ok(shape.key, '@' + w + ': the cascade has no key, so its marks go unexplained');

    /* into the frame, the way a reader arrives: under the band on a phone */
    ok(await INTO(page), '@' + w + ': scrolled to the cascade and the stage never took it up');
    const SAMPLE = () => {
      const cv = document.getElementById('fld'), g = cv.getContext('2d');
      const W = cv.width, H = cv.height, dpr = W / cv.clientWidth;
      const cw = cv.clientWidth, ch = cv.clientHeight;
      const R = Math.min(cw, ch) * (cw < 520 ? 0.40 : 0.38), SK = Math.min(1.35, Math.max(0.55, R / 300));
      const reach = (R + 22 * SK + 3) * dpr, cx = W / 2, cy = H / 2;
      const d = g.getImageData(0, 0, W, H).data;
      let out = 0, lit = 0, sum = 0;
      for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
        const i = (y * W + x) * 4, a = d[i + 3];
        if (a < 60) continue;
        lit++; sum = (sum + (d[i] + 3 * d[i + 1] + 7 * d[i + 2]) * (x + 1) * (y + 3)) % 1000000007;
        const dx = x - cx, dy = y - cy;
        if (dx * dx + dy * dy > reach * reach) out++;
      }
      const on = [...document.querySelectorAll('#csteps li.on')].map(l => l.getAttribute('data-step'));
      return { on: on.join('+'), out, lit, sum };
    };
    const STEP = 40, CAP = 30000;
    const S = [];
    let t = 0, seenOwn = false, back = false;
    while (t < CAP) {
      await page.clock.runFor(STEP); t += STEP;
      const s = await page.evaluate(SAMPLE); s.t = t; S.push(s);
      if (s.on === 'own') seenOwn = true;
      if (seenOwn && s.on === 'once') { back = true; if (S.filter(x => x.on === 'once' && x.t > t - 1500).length > 30) break; }
    }
    const seq = [];
    S.forEach(s => { if (s.on && seq[seq.length - 1] !== s.on) seq.push(s.on); });
    console.log('  steps lit, in order: ' + seq.join(' > ') + '   sampled ' + S.length + ' times over ' + (t / 1000) + ' s');
    ok(seq.slice(0, 3).join() === 'once,again,own', '@' + w + ': the steps lit ' + seq.join(' > '));
    ok(back, '@' + w + ': it never came round to the first pass again, so it does not repeat');
    ok(new Set(S.map(s => s.sum)).size > S.length / 2, '@' + w + ': the stage barely changes, so it is not running');
    ok(S.some(s => s.on === 'once' && s.out > 0), '@' + w + ': nothing enters from outside on the first pass');
    const ownOut = S.filter(s => s.on === 'own' && s.out > 0);
    ok(ownOut.length === 0, '@' + w + ': something enters on the last pass, ' + ownOut.length + ' samples, so the answer is not shown running on its own');
    /* the flights, as runs of samples with a spark out past the ring, in the
       first time round only */
    const firstOwn = S.findIndex(s => s.on === 'own');
    const runs = []; let cur = 0;
    S.slice(0, firstOwn < 0 ? S.length : firstOwn).forEach(s => {
      if (s.out > 0) cur++; else if (cur) { runs.push(cur); cur = 0; } });
    if (cur) runs.push(cur);
    console.log('  spark in flight past the ring, samples per pass: ' + runs.join(', ') + ' (' + STEP + ' ms each)');
    ok(runs.length >= 2, '@' + w + ': a spark enters on ' + runs.length + ' pass(es) before the last, so it does not repeat');
    /* quicker means clearly quicker. Sampling lands a flight one sample
       either way, and the third spark is drawn fainter so its tail leaves the
       count early, so passes at one pace can still read 12, 11, 10. Each
       flight must take at most 85 per cent of the one before it. */
    ok(runs.every((r, i) => i === 0 || r <= runs[i - 1] * 0.85),
      '@' + w + ': the spark does not arrive clearly quicker each pass: ' + runs.join(', '));
    const own = S.filter(s => s.on === 'own').map(s => s.lit).sort((a, b) => a - b);
    const ownLit = own.length ? own[own.length >> 1] : 0;
    ok(reqs.length === 0, '@' + w + ': the cascade made ' + reqs.length + ' outbound request(s)');
    ok(errs.length === 0, '@' + w + ': ' + errs.length + ' error(s) while it ran: ' + errs.slice(0, 2).join(' | '));
    await ctx.close();

    /* reduced motion: the end of the last pass, drawn once, and still */
    const rctx = await browser.newContext({ viewport: { width: w, height: hgt }, reducedMotion: 'reduce' });
    const rp = await rctx.newPage();
    await PAUSED(rp);
    await rp.goto('file://' + path.join(DIR, 'index.html'), { waitUntil: 'load' });
    ok(await INTO(rp), '@' + w + ': reduced motion, scrolled to the cascade and the stage never took it up');
    await rp.clock.runFor(300);
    const r0 = await rp.evaluate(SAMPLE);
    await rp.clock.runFor(3000);
    const r1 = await rp.evaluate(SAMPLE);
    console.log('  reduced: steps ' + r1.on + '  lit ' + r1.lit + ' against ' + ownLit
      + ' at the middle of the moving last pass  past the ring ' + r1.out);
    ok(r1.on === 'once+again+own', '@' + w + ': reduced motion lights ' + (r1.on || 'nothing') + ', not every step');
    ok(r0.sum === r1.sum, '@' + w + ': reduced motion still moves the stage');
    ok(r1.out === 0, '@' + w + ': reduced motion draws a spark');
    /* the end state is the last pass drawn and held: the taut path, the
       seat it lands in and the core, all at once. So it lights at least as
       much of the stage as the moving last pass does at its middle, and on
       the day this was written it lit well over that at both widths. A page
       that skipped the end state, checked against a copy broken that way,
       draws only the ring and the core at rest and lit well under two thirds
       of it at both widths. The line sits between the two. */
    ok(r1.lit >= ownLit * 0.9, '@' + w + ': reduced motion lights ' + r1.lit
      + ' against ' + ownLit + ' in the moving last pass, so it does not hold the end state');
    await rctx.close();

    /* no script: every word of it, in order, and the key printed */
    const nctx = await browser.newContext({ viewport: { width: w, height: hgt }, javaScriptEnabled: false });
    const np = await nctx.newPage();
    await np.goto('file://' + path.join(DIR, 'index.html'), { waitUntil: 'load' });
    const ns = await np.evaluate(() => {
      const c = document.getElementById('cascade'), k = document.getElementById('cap-cascade');
      return { text: c ? c.innerText : '', key: k ? k.innerText.trim().length : 0,
        labels: c ? [...c.querySelectorAll('#csteps li b')].map(b => b.innerText.trim()) : [] };
    });
    ok(/pattern/i.test(ns.text) && /our own model/i.test(ns.text), '@' + w + ': with no script the cascade does not read');
    ok(ns.key > 0, '@' + w + ': with no script the cascade key is not printed');
    ok(shape.labels.length > 0 && ns.labels.join('|') === shape.labels.join('|'),
      '@' + w + ': with no script the steps read ' + ns.labels.join(', ') + ', not ' + shape.labels.join(', '));
    await nctx.close();
  }


  /* ---------- the landing's signal test, his slide 03 ----------
     ATUNED-Funnel-Signal-Story-Pattern-Release-Reframe-TDD-v1.md sections 8
     and 9. Held against the page as a person walks it:

       it sits after recognition (his slide 02) and before the mirror
       his questions arrive one at a time, in his order, word for word in
         the house's case
       a typed answer comes back in quotation marks exactly as typed, markup
         and all, and is never run as markup
       nothing is written to any storage
       a place picked from the list lights pixels on the body, and nothing
         is drawn there before one is picked
       nothing noticed for both words says so, in his own line
       the card names no diagnosis
       with no script the whole exercise prints in order

     His questions are copied out of his document below, with YES and NO in
     lower case and colour spelled the house's way, which are the two moves
     the frame itself makes and names. They are a list, not a count. */
  const SIG_YES = ['Where do you feel yes?', 'Does the sensation feel dense or flowing?',
    'Is there a temperature?', 'Is there a colour?', 'Does the charge change?'];
  const SIG_NO = ['Where does no land in your body?', 'Does no have a different quality from yes?',
    'Is the temperature different?', 'Is the colour different?', 'Is the charge different?',
    'How does the sensation make you feel?'];
  const SIG_HIS = ['Think the word yes ten times.', 'Now think the word no ten times.',
    'A word is lighter than air, yet the experience of a word can have a direct effect on what you notice in your body.',
    'Words carry meaning, tone, memory, and association.',
    'When you identify with a word, the word can become connected to a lived experience.',
    'This will take about two minutes.', 'Find a quiet and calm space if you can.',
    'When you are ready, move your awareness into your body.'];
  /* lit pixels on the signal overlay, the canvas's own, never the page's */
  const SIGLIT = () => {
    const c = document.getElementById('sigc'); if (!c || !c.width) return -1;
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 40) n++;
    return n;
  };
  for (const [w, hgt] of WIDTHS) {
    for (const reduce of [false, true]) {
      const tag = 'signal @' + w + (reduce ? ' reduced' : '');
      console.log('\n--- the landing signal test @' + w + (reduce ? ', reduced motion' : '') + ' ---');
      const sctx = await browser.newContext({ viewport: { width: w, height: hgt },
        reducedMotion: reduce ? 'reduce' : 'no-preference' });
      const sp = await sctx.newPage();
      const serr = [], sreq = [];
      sp.on('pageerror', e => serr.push(String(e && e.message || e)));
      sp.on('request', r => { if (!/^(file:|data:|blob:|about:)/.test(r.url())) sreq.push(r.url()); });
      await sp.goto('file://' + path.join(DIR, 'index.html'), { waitUntil: 'load' });
      await sp.evaluate(() => document.fonts.ready);
      const order = await sp.evaluate(() => [...document.querySelectorAll('.fr')].map(f => f.id));
      const si = order.indexOf('signal');
      ok(si > 0, tag + ': the landing has no signal frame');
      ok(si === order.indexOf('recognize') + 1 && order.indexOf('mirror') === si + 1,
        tag + ': the signal test is not between recognition and the mirror: ' + order.join(','));
      await sp.evaluate(() => {
        const el = document.getElementById('signal'), r = el.getBoundingClientRect();
        const sh = innerWidth >= 900 ? 0 : document.getElementById('stage').getBoundingClientRect().height;
        window.scrollTo({ top: scrollY + r.top - sh, behavior: 'instant' });
      });
      /* the frame is entered by scrolling, and the run waits for the stage to
         take it rather than assuming it has */
      let took = false;
      for (let i = 0; i < 40 && !took; i++) {
        took = await sp.evaluate(() => document.getElementById('stage').getAttribute('data-sig') === 'on');
        if (!took) await sp.waitForTimeout(100);
      }
      ok(took, tag + ': scrolled to the signal test and the stage never took it up');
      ok(await sp.evaluate(() => document.getElementById('stage').getAttribute('data-show')) === 'body',
        tag + ': the signal test does not stand on the body');
      const head = () => sp.evaluate(() => {
        const h = document.querySelector('#sg h3, #sg .aha'); return h ? h.innerText.trim() : ''; });
      const tap = async (sel) => { await sp.click('#sg ' + sel); await sp.waitForTimeout(60); };
      ok(/Sit down/.test(await head()), tag + ': the card does not open on the instruction to sit');
      await tap('[data-sg="go"]');
      ok(await head() === SIG_HIS[0], tag + ': the yes step reads "' + await head() + '"');
      await tap('[data-sg="go"]');
      const lit0 = await sp.evaluate(SIGLIT);
      const seen = [];
      seen.push(await head()); await tap('[data-sg="pick"][data-v="Chest"]');
      await sp.waitForTimeout(reduce ? 50 : 900);
      const lit1 = await sp.evaluate(SIGLIT);
      ok(lit1 > lit0 + 40, tag + ': picking a place lit nothing on the body (' + lit0 + ' then ' + lit1 + ' pixels)');
      for (const v of ['Dense', 'Warm']) { seen.push(await head()); await tap('[data-sg="pick"][data-v="' + v + '"]'); }
      seen.push(await head());
      const typed = 'a dull <b>gold</b>';
      await sp.fill('#sgtx', typed); await tap('[data-sg="own"]');
      seen.push(await head()); await tap('[data-sg="pick"][data-v="It gets heavier"]');
      ok(await head() === SIG_HIS[1], tag + ': the no step reads "' + await head() + '"');
      await tap('[data-sg="go"]');
      for (const v of ['Throat', 'Flowing', 'Cool', 'No colour', 'It gets lighter', 'Calm']) {
        seen.push(await head()); await tap('[data-sg="pick"][data-v="' + v + '"]'); }
      ok(JSON.stringify(seen) === JSON.stringify(SIG_YES.concat(SIG_NO)),
        tag + ': the questions are not his, in his order: ' + JSON.stringify(seen));
      const aha = await sp.evaluate(() => ({
        head: (document.querySelector('#sg .aha') || {}).innerText || '',
        cells: [...document.querySelectorAll('#sg .sg-rep [role=cell]')].map(c => c.textContent),
        bold: document.querySelectorAll('#sg .sg-rep b').length,
        text: document.getElementById('signal').innerText,
        store: localStorage.length + sessionStorage.length }));
      ok(/mind-body connection/.test(aha.head), tag + ': a noticed signal does not land the aha, it reads "' + aha.head + '"');
      ok(aha.cells.indexOf('“' + typed + '”') >= 0 && aha.bold === 0,
        tag + ': the typed colour is not said back exactly as typed, or was run as markup');
      ok(aha.cells.indexOf('chest') >= 0 && aha.cells.indexOf('throat') >= 0,
        tag + ': the places picked are not said back: ' + JSON.stringify(aha.cells));
      for (const l of SIG_HIS.slice(2, 5))
        ok(aha.text.indexOf(l) >= 0, tag + ': the aha is missing his line "' + l + '"');
      ok(aha.store === 0, tag + ': the signal test wrote ' + aha.store + ' item(s) to storage');
      ok(!/diagnos|disorder|symptom|cure|treatment/i.test(aha.text),
        tag + ': the signal test names a diagnosis or a treatment');
      /* again, noticing nothing for either word */
      await tap('[data-sg="again"]'); await tap('[data-sg="go"]'); await tap('[data-sg="go"]');
      await tap('[data-sg="pick"][data-v="Nothing I can notice"]');
      ok(/^Now think the word no/.test(await head()),
        tag + ': nothing noticed for yes still asks what yes felt like: "' + await head() + '"');
      await tap('[data-sg="go"]'); await tap('[data-sg="pick"][data-v="Nothing I can notice"]');
      const none = await sp.evaluate(() => document.getElementById('sg').innerText);
      ok(/Nothing showed this time\./.test(none) && /No sensation is also information\./.test(none),
        tag + ': nothing noticed is not said as a result, in his line');
      /* the way past, from the first step */
      await tap('[data-sg="again"]');
      await tap('[data-sg="skip"]'); await sp.waitForTimeout(reduce ? 100 : 1200);
      const past = await sp.evaluate(() => {
        const m = document.getElementById('mirror').getBoundingClientRect();
        return m.top < innerHeight * .6; });
      ok(past, tag + ': the skip does not take a person past the signal test');
      ok(serr.length === 0, tag + ': ' + serr.length + ' error(s): ' + serr.slice(0, 2).join(' | '));
      ok(sreq.length === 0, tag + ': ' + sreq.length + ' outbound request(s)');
      console.log('  ' + seen.length + ' questions in his order, overlay pixels ' + lit0 + ' before a place and '
        + lit1 + ' after, storage ' + aha.store + ', errors ' + serr.length);
      await sctx.close();
    }
    /* no script: the whole exercise, in order, as text */
    const nctx = await browser.newContext({ viewport: { width: w, height: hgt }, javaScriptEnabled: false });
    const np = await nctx.newPage();
    await np.goto('file://' + path.join(DIR, 'index.html'), { waitUntil: 'load' });
    const nt = await np.evaluate(() => (document.getElementById('signal') || {}).innerText || '');
    let at = -1, inOrder = true;
    for (const l of SIG_YES.concat(SIG_NO)) { const i = nt.indexOf(l); if (i <= at) inOrder = false; at = i; }
    ok(inOrder, 'signal @' + w + ': with no script the questions do not print in his order');
    for (const l of SIG_HIS)
      ok(nt.indexOf(l) >= 0, 'signal @' + w + ': with no script his line is missing: "' + l + '"');
    await nctx.close();
  }

  /* ---------- the landing's reframe and verify, his slides 17 and 19 ----------
     Held against the page as a person walks it, same method the signal test
     above uses: a real page, real clicks, nothing assumed from the markup. */
  for (const [w, hgt] of WIDTHS) {
    const tag = 'reframe/verify @' + w;
    const rctx = await browser.newContext({ viewport: { width: w, height: hgt } });
    const rp = await rctx.newPage();
    const rerr = [];
    rp.on('pageerror', e => rerr.push(String(e && e.message || e)));
    await rp.goto('file://' + path.join(DIR, 'index.html'), { waitUntil: 'load' });
    await rp.evaluate(() => document.fonts.ready);
    const order = await rp.evaluate(() => [...document.querySelectorAll('.fr')].map(f => f.id));
    const ri = order.indexOf('reframe'), vi = order.indexOf('verify');
    ok(ri > 0 && ri === order.indexOf('release') + 1 && vi === ri + 1 && order.indexOf('loop') === vi + 1,
      tag + ': the order is not release, reframe, verify, loop: ' + order.join(','));

    /* reframe mirrors exactly what was typed, markup and all kept as text */
    const typed = 'I can say <b>yes</b> & mean it, without the old weight';
    await rp.fill('#rftx', typed);
    await rp.click('#rf [data-rf="keep"]');
    const said = await rp.evaluate(() => document.getElementById('rftext').textContent);
    ok(said === typed, tag + ': the reframe is not mirrored exactly, it reads "' + said + '"');
    const saidHtml = await rp.evaluate(() => document.getElementById('rftext').innerHTML);
    ok(!/<b>/.test(saidHtml), tag + ': the typed reframe was run as markup, not said back as text');
    await rp.click('#rf [data-rf="edit"]');
    const back = await rp.evaluate(() => document.getElementById('rftx').value);
    ok(back === typed, tag + ': changing it loses the words, the box now reads "' + back + '"');
    await rp.fill('#rftx', '  ');
    await rp.click('#rf [data-rf="keep"]');
    const note = await rp.evaluate(() => document.getElementById('rfnote').textContent);
    ok(/Write a few words first/.test(note), tag + ': an empty reframe is kept with nothing said: "' + note + '"');

    /* verify, with no signal test taken on this page: honest about it */
    const vfHonest = await rp.evaluate(() => document.getElementById('vf').innerText);
    ok(/nothing to compare|skipped/i.test(vfHonest) && !/landed in the/i.test(vfHonest),
      tag + ': verify invents a baseline with no signal test taken: "' + vfHonest + '"');
    const store0 = await rp.evaluate(() => localStorage.length + sessionStorage.length);
    await rp.click('#vfans [data-v="Nothing changed."]');
    const say = await rp.evaluate(() => document.getElementById('vfsay').textContent);
    ok(/answer too/i.test(say) && !/fail|wrong|incomplete|no result/i.test(say),
      tag + ': "Nothing changed" does not read as a real result: "' + say + '"');
    const store1 = await rp.evaluate(() => localStorage.length + sessionStorage.length);
    ok(store0 === 0 && store1 === 0, tag + ': reframe or verify wrote ' + store1 + ' item(s) to storage');
    ok(rerr.length === 0, tag + ': ' + rerr.length + ' error(s): ' + rerr.slice(0, 2).join(' | '));
    console.log('  ' + tag + ': order held, reframe mirrored exactly, empty reframe refused, '
      + 'verify honest with no baseline, "Nothing changed" answered as a result, storage ' + store1);
    await rctx.close();
  }
  /* verify shows the signal test's own baseline when one exists, never a
     second one invented for this frame */
  {
    const tag = 'reframe/verify, signal test taken first';
    const bctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const bp = await bctx.newPage();
    await bp.goto('file://' + path.join(DIR, 'index.html'), { waitUntil: 'load' });
    const tap = async (sel) => { await bp.click('#sg ' + sel); await bp.waitForTimeout(30); };
    await tap('[data-sg="go"]'); await tap('[data-sg="go"]');
    await tap('[data-sg="pick"][data-v="Chest"]'); await tap('[data-sg="pick"][data-v="Dense"]');
    await tap('[data-sg="pick"][data-v="Warm"]'); await tap('[data-sg="pick"][data-v="Red"]');
    await tap('[data-sg="pick"][data-v="It stays the same"]');
    await bp.evaluate(() => {
      const el = document.getElementById('verify'), r = el.getBoundingClientRect();
      window.scrollTo({ top: scrollY + r.top, behavior: 'instant' });
    });
    let shown = '';
    for (let i = 0; i < 40; i++) {
      shown = await bp.evaluate(() => (document.getElementById('vf') || {}).innerText || '');
      if (/chest/i.test(shown)) break;
      await bp.waitForTimeout(60);
    }
    ok(/yes/i.test(shown) && /chest/i.test(shown) && /dense/i.test(shown),
      tag + ': verify does not carry the signal test\'s own reading forward: "' + shown + '"');
    await bctx.close();
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
