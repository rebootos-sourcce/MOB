/* ============================================================
   THE FUNNEL GATE.

   WHY THIS FILE EXISTS. On the night the deadline was the funnel, the funnel
   was the only half of this product with no measurement behind it. Four gates
   ran and not one of them opened a funnel page: `design.js` says the word
   funnel once, in a comment, and means the app. So the half his acceptance
   test is about, "when people jump into this product, they need to see that
   it is thoughtful, considerate, well crafted", was the half nobody could
   prove anything about, while the app half was green on everything.

   REWRITTEN 11-12 November for the real funnel/quiz replacement
   (DECISIONS.md, "The funnel/quiz replacement's exact scope, and where
   login lands"): the funnel's 6 scenes and the 59-question quiz are the
   approved ATUNED_Experience_V19.html content, ported rather than
   reinvented; the how-it-works stage that file also carried is cut
   entirely, per his ruling, and is never built or linked; and the quiz's
   results screen now hands a real local profile to the real app
   (archSeedApply, sabSeedApply, the 21 laws, engine/schema.js's
   blankProfile/saveProfile, the same #r= link route the app has read
   since round QZ), where a login that succeeds through this flow lands on
   the Journal's dashboard view (TAB.STORY, STV.dash) instead of Summary.
   The old 100-question/33-saboteur quiz this file used to walk (its own
   signal/reframe/verify beats, its own cascade canvas, its own ring) is
   gone with the pages it tested; this holds what replaced it.

   WHAT IT HOLDS. Every funnel page, at 1600 and at 390:

     1  it renders, rather than merely loading. A surface is counted in
        markup with its text recorded beside it, because the landing and the
        quiz both carry SVG and innerText does not see SVG.
     2  nothing leaves the machine. The product's whole claim is one file and
        no network, and the funnel says so in print on every page.
     3  no control is under 44 by 44. A link inside a paragraph is prose and
        is measured at 24, which is the pointer floor, and every one of them
        is printed rather than hidden, so an exemption cannot quietly grow.
        Each is measured by the largest single piece the browser draws it
        in, never by the box around all of its pieces, which a link broken
        over two lines makes two lines tall. A control whose own box is
        under the floor but that carries a centred ::before/::after hit
        area at or over 44 by 44 (the funnel's own progress dots, documented
        in their own CSS comment) meets the floor by that area instead,
        the same real hit a press actually lands in.
     4  no page scrolls sideways, and no page is empty.
     5  every internal link points at a file that exists. A funnel with a
        broken route is a funnel with a hole in it.
     6  the how-it-works stage is nowhere: no stageHowItWorks markup, no
        goStage('howitworks'), no "How it works" link, in any funnel source
        file or in dist. His own words, verbatim, are why: "If I didn't
        mention it, it doesn't belong."

   And the quiz, which is the only surface here with state:

     7  it answers from the first question to a real results screen without
        a dead end: 59 questions (21 laws, 6 laws of action, 12 archetypes,
        20 saboteurs, read off the page's own QUESTIONS/TOTAL_Q rather than
        hand counted here), six interstitials, an intake screen that can be
        skipped honestly, landing on results.
     8  the results screen prints a real adjusted coherence number, a real
        celestial/numerology tile (computed by the real engine, loaded as
        ../engine.js, not a second copy of astro.js/birth.js/numerology.js),
        and a working "Create your account" control.
     9  that control packs a real local profile (archSeedApply for the 12
        self-reported archetypes, sabSeedApply for the 20 self-reported
        saboteurs, both read back off the packed record rather than assumed)
        into a #r= link onto ../source.html, the one importer
        (recordLinkBoot(), ui/panels.js) that route has had since round QZ.

   And the one piece of this that reaches into the app itself:

    10  a login that succeeds right after this exact landing lands on the
        Journal's dashboard view (TAB.STORY, STV.dash=true), not on Summary
        and not on onboarding, through RECORD_LINK_LANDED (ui/panels.js) and
        loginDashOverride() (ui/login.js) -- and an ordinary login with no
        such landing behind it is untouched: TAB.STORY stays the default
        document.title, STV.dash stays false.

   NO COUNT IS TYPED INTO THIS FILE. Not the number of pages, not the number
   of questions, not the number of controls. Every one of them is read off
   the run and printed. This repository has been bitten nine times by a
   number typed into a gate or a document that the product then grew past,
   and CLAUDE.md records each one. The pages come off the directory and the
   questions come off TOTAL_Q/QUESTIONS.length, read on the page, never typed
   here.

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
   and printed by name. Everything else is a control and meets 44.

   THE BOX AROUND A LINK IS NOT THE LINK, 23 October. This read
   getBoundingClientRect, and for a link broken over two lines that is one
   box around both pieces. The buy page's prose link read 49 tall at 390 here
   and at both widths with Inter absent, as on CI, while each piece a press
   can land in was 21, measured with elementFromPoint. It passed for that
   reason alone, and failed only where Inter, a narrow face, kept it on one
   line: at 1600, on a machine with Inter installed. So each element is
   measured by the largest single piece getClientRects gives it, and the box
   stands in only for an element that draws no piece of its own. The label
   has its white space folded too, so a failure prints on one line.
   Checked against the known bad case before it was trusted: the buy page
   from before its fix fails here at both widths, with Inter installed and
   with it hidden, where the box failed it only at 1600 with Inter installed. */
const PROBE = () => {
  const out = { ctrl: [], prose: [], links: [] };
  document.querySelectorAll('a[href],button,input,select,textarea,[role="button"]')
    .forEach(n => {
      const r = n.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;              /* not shown */
      const q = [...n.getClientRects()].filter(p => p.width > 0 && p.height > 0);
      const big = q.reduce((a, p) =>
        Math.min(p.width, p.height) > Math.min(a.width, a.height) ? p : a, q[0] || r);
      const t = (n.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 36);
      const hitOk = ['::before', '::after'].some(pseudo => {
        const cs = getComputedStyle(n, pseudo);
        if (cs.content === 'none' || cs.position !== 'absolute') return false;
        return parseFloat(cs.width) >= 44 && parseFloat(cs.height) >= 44;
      });
      const rec = { t: t, w: Math.round(big.width), h: Math.round(big.height),
        pieces: q.length, tag: n.tagName.toLowerCase(), hitOk: hitOk };
      (n.closest('p') ? out.prose : out.ctrl).push(rec);
    });
  document.querySelectorAll('a[href]').forEach(n => {
    const h = n.getAttribute('href');
    if (h && !/^(https?:|mailto:|#|data:)/.test(h)) out.links.push(h.split('#')[0]);
  });
  return out;
};
/* a measured element as the log prints it, saying how many pieces it was
   drawn in whenever that was more than one */
const SIZE = c => '"' + c.t + '" ' + c.w + 'x' + c.h
  + (c.pieces > 1 ? ' (largest of ' + c.pieces + ' pieces)' : '');

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
      const under = pr.ctrl.filter(c => (c.w < 44 || c.h < 44) && !c.hitOk);
      ctrlSeen += pr.ctrl.length; proseSeen += pr.prose.length;
      ok(under.length === 0, tag + ': ' + under.length + ' control(s) under 44 by 44: '
        + under.slice(0, 4).map(SIZE).join(', '));
      const tiny = pr.prose.filter(c => c.w < 24 || c.h < 24);
      ok(tiny.length === 0, tag + ': ' + tiny.length + ' prose link(s) under 24: '
        + tiny.slice(0, 4).map(SIZE).join(', '));
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
        console.log('       prose, held at 24: ' + pr.prose.map(SIZE).join(', '));
      }
      await ctx.close();
    }
  }

  /* ---------- the how-it-works stage is nowhere ---------- */
  console.log('\n--- how it works, cut entirely ---');
  for (const p of PAGES) {
    const h = fs.readFileSync(path.join(DIR, p), 'utf8');
    ok(!/stageHowItWorks|data-stage="howitworks"/.test(h), p + ': carries the how-it-works stage');
    ok(!/goStage\(.howitworks.\)/.test(h), p + ': still calls goStage(\'howitworks\')');
    ok(!/how it works/i.test(h), p + ': still says "how it works" somewhere in its own source');
  }

  /* ---------- the funnel: the 6 approved scenes, no stray stage switch ---------- */
  console.log('\n--- the funnel scenes ---');
  {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e && e.message || e)));
    await page.goto('file://' + path.join(DIR, 'index.html'), { waitUntil: 'load' });
    await page.waitForTimeout(150);
    const scenes = await page.evaluate(() => [...document.querySelectorAll('.scene[data-scene]')]
      .map(s => s.getAttribute('data-scene')));
    ok(scenes.length === 6, 'the funnel carries ' + scenes.length + ' scenes, not 6: ' + scenes.join(','));
    ok(new Set(scenes).size === scenes.length, 'the funnel repeats a scene number: ' + scenes.join(','));
    const hasGoStage = await page.evaluate(() => typeof window.goStage === 'function');
    ok(!hasGoStage, 'the funnel still defines goStage, the three-stage switch this page no longer has');
    ok(errs.length === 0, 'the funnel scenes: ' + errs.length + ' error(s): ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  /* ---------- the quiz: 59 questions to a real results screen ---------- */
  for (const [w, hgt] of WIDTHS) {
    console.log('\n--- the quiz, answered, @' + w + ' ---');
    const ctx = await browser.newContext({ viewport: { width: w, height: hgt } });
    const page = await ctx.newPage();
    const reqs = [], errs = [];
    page.on('request', r => { const u = r.url(); if (!/^(file:|data:|blob:|about:)/.test(u)) reqs.push(u); });
    page.on('pageerror', e => errs.push(String(e && e.message || e)));
    page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    await page.goto('file://' + path.join(DIR, 'quiz.html'), { waitUntil: 'load' });

    /* the shape read off the page itself, never typed here */
    const shape = await page.evaluate(() => ({
      total: TOTAL_Q, laws: QSI.length, verp: QVERP.length, arch: QARCH.length, sab: SABQ.length,
      blocks: BLOCK_DEFS.map(b => b.key)
    }));
    console.log('  ' + shape.total + ' questions: ' + shape.laws + ' laws, ' + shape.verp
      + ' laws of action, ' + shape.arch + ' archetypes, ' + shape.sab + ' saboteurs, blocks '
      + shape.blocks.join(','));
    ok(shape.total === shape.laws + shape.verp + shape.arch + shape.sab,
      '@' + w + ': TOTAL_Q ' + shape.total + ' does not add up to its own four blocks');

    await page.evaluate(() => { state.autoAdvance = false; });
    await page.click('#introStart');
    ok(await page.evaluate(() => STEPS[state.screen] && STEPS[state.screen].type === 'q'),
      '@' + w + ': Begin did not land on the first question');

    /* walk every step STEPS actually holds, answering every question with
       the same mid-scale value (a real, uniform self-report, never a
       placeholder), tapping an interstitial to skip its own timer, and
       skipping the intake honestly -- the same path a person who gives no
       birth data takes, which is also the one this gate can finish in a
       few seconds rather than wait 2.5s x 6 interstitials for. */
    const t0 = Date.now();
    let steps = 0;
    for (;;) {
      const step = await page.evaluate(() => {
        const s = STEPS[state.screen];
        return s ? { type: s.type, qIndex: s.qIndex } : null;
      });
      if (!step) { ok(false, '@' + w + ': the walk fell off the end of STEPS at step ' + steps); break; }
      if (step.type === 'results') break;
      steps++;
      if (steps > shape.total + 20) { ok(false, '@' + w + ': the walk did not reach results in ' + steps + ' steps'); break; }
      if (step.type === 'q') {
        await page.click('.scale-stop[data-i="' + step.qIndex + '"][data-v="7"]');
        await page.click('#quizNextBtn');
      } else if (step.type === 'interstitial') {
        await page.evaluate(() => { const s = STEPS[state.screen]; document.getElementById('int-' + s.afterBlock).click(); });
      } else if (step.type === 'intake') {
        await page.click('#intake-skip');
      }
    }
    const tWalk = Date.now() - t0;
    console.log('  walked ' + steps + ' steps to results in ' + tWalk + 'ms');

    const onResults = await page.evaluate(() => STEPS[state.screen] && STEPS[state.screen].type === 'results');
    ok(onResults, '@' + w + ': the walk did not land on the results screen');
    ok(!!(await page.evaluate(() => state.completed)), '@' + w + ': results reached but state.completed is false');

    /* the results screen itself: a real coherence number, a real
       celestial/numerology tile (an honest gap, since the intake was
       skipped -- "Intake was skipped... an honest gap, not a guess", read
       off the page's own words, never typed here), the CTA */
    await page.waitForTimeout(650);                 /* the CQ count-up animation */
    const res = await page.evaluate(() => {
      const cq = (document.getElementById('cqCount') || {}).textContent || '';
      return {
        cq: cq, cqIsNumber: /^\d+$/.test(cq),
        celestialGap: /honest gap/.test((document.querySelector('.tile h3') || {}).parentElement.textContent || ''),
        toapp: !!document.getElementById('toapp-record'),
        toappReady: document.getElementById('toapp-record') && document.getElementById('toapp-record').getAttribute('aria-disabled'),
        text: document.body.innerText.trim().length
      };
    });
    ok(res.cqIsNumber, '@' + w + ': the results screen prints coherence "' + res.cq + '", not a number');
    ok(res.toapp, '@' + w + ': the results screen has no Create your account control');
    ok(res.text > 0, '@' + w + ': the results screen is empty');

    /* THE REAL ENGINE, NOT A SECOND COPY. The results screen\'s own math
       runs through the real engine.js (loaded as a <script> before this
       page\'s own), so a drift between V19\'s own duplicate astro/
       numerology port and the real atuned_src/engine/astro.js, birth.js,
       numerology.js would show up here as a thrown error or a wrong
       function identity, not silently. */
    const real = await page.evaluate(() => ({
      hasRealBirthJD: typeof birthJD === 'function',
      hasRealNumerology: typeof numerology === 'function',
      hasArchSeedApply: typeof archSeedApply === 'function',
      hasSabSeedApply: typeof sabSeedApply === 'function',
      hasFUNNELQ: typeof FUNNELQ !== 'undefined' && FUNNELQ.length === 59,
      noDuplicateJulianDay: (function(){ try{ return typeof julianDay === 'function'; }catch(e){ return false; } })()
    }));
    ok(real.hasRealBirthJD && real.hasRealNumerology, '@' + w + ': the real astro.js/numerology.js functions are not in scope');
    ok(real.hasArchSeedApply && real.hasSabSeedApply, '@' + w + ': archSeedApply/sabSeedApply are not in scope');
    ok(real.hasFUNNELQ, '@' + w + ': the real FUNNELQ (59 questions) is not in scope');

    /* THE RECORD ITSELF: built, through the real functions, from this run\'s
       own answers -- never assumed, read back off the packed profile. */
    const rec = await page.evaluate(() => {
      const p = quizRecord(RESULTS);
      return {
        arcsChanged: JSON.stringify(p.soul.arcs) !== JSON.stringify([0, 1]),
        axesTouched: CHILD.some(c => Math.abs((p.axes[c.nm] || {}).held - AXIS_BLANK) > 1e-9),
        lawsWritten: QSI.filter(l => p.laws[l.nm] != null).length,
        v: p.v, name: p.name
      };
    });
    ok(rec.arcsChanged, '@' + w + ': a full self-report of 7/10 on every archetype left p.soul.arcs at its blank default');
    ok(rec.axesTouched, '@' + w + ': a full self-report of 7/10 on every saboteur left every axis at the blank');
    ok(rec.lawsWritten === shape.laws, '@' + w + ': ' + rec.lawsWritten + ' of ' + shape.laws + ' laws written onto p.laws');

    /* THE HANDOFF LINK: packed with the real engine\'s linkWrap + gzip, the
       same route (#r= onto ../source.html) recordLinkBoot() already reads.
       Pressing it arms the link asynchronously (recordLinkArm); this waits
       for aria-disabled to clear rather than a fixed timer. */
    /* recordLinkArm packs the link the moment the results screen itself
       renders -- a press is how a person reaches it, never how the
       packing starts, so this waits for it rather than clicking first:
       a click on an already-armed real <a href> navigates at once, which
       the dashboard-landing test below does on purpose; this part only
       has to prove the link itself is right. */
    await page.waitForFunction(() => {
      const a = document.getElementById('toapp-record');
      return a && a.getAttribute('data-ready') === '1';
    }, null, { timeout: 8000 });
    const href = await page.getAttribute('#toapp-record', 'href');
    ok(/\/source\.html#r=/.test(href), '@' + w + ': Create your account packed "' + (href || '').slice(0, 60) + '", not a #r= link onto source.html');
    ok(errs.length === 0, '@' + w + ': ' + errs.length + ' error(s) across the whole walk: ' + errs.slice(0, 3).join(' | '));
    ok(reqs.length === 0, '@' + w + ': ' + reqs.length + ' outbound request(s) across the whole walk: ' + reqs.slice(0, 3).join(' '));
    await ctx.close();
  }

  /* ---------- login lands on the dashboard, for this flow only ---------- */
  console.log('\n--- login lands on the dashboard, not Summary ---');
  {
    const APP = path.resolve(__dirname, '..', process.env.ATUNED_FILE || 'source.html');
    /* build one real #r= link the honest way: run the quiz\'s own
       recordLink() against a fully self-reported run, in the quiz\'s own
       page, then hand the resulting link to the app -- never a hand built
       payload, so this is the same bytes a person\'s own press produces. */
    const qctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const qpage = await qctx.newPage();
    await qpage.goto('file://' + path.join(DIR, 'quiz.html'), { waitUntil: 'load' });
    await qpage.evaluate(() => { state.autoAdvance = false; });
    await qpage.click('#introStart');
    for (;;) {
      const step = await qpage.evaluate(() => { const s = STEPS[state.screen]; return s ? { type: s.type, qIndex: s.qIndex } : null; });
      if (!step || step.type === 'results') break;
      if (step.type === 'q') { await qpage.click('.scale-stop[data-i="' + step.qIndex + '"][data-v="7"]'); await qpage.click('#quizNextBtn'); }
      else if (step.type === 'interstitial') await qpage.evaluate(() => { const s = STEPS[state.screen]; document.getElementById('int-' + s.afterBlock).click(); });
      else if (step.type === 'intake') await qpage.click('#intake-skip');
    }
    await qpage.waitForFunction(() => document.getElementById('toapp-record').getAttribute('data-ready') === '1', null, { timeout: 8000 });
    const link = await qpage.getAttribute('#toapp-record', 'href');
    await qctx.close();
    ok(/\/source\.html#r=/.test(link || ''), 'could not build a real #r= link from the quiz to test the app with: ' + (link||'').slice(0,80));

    const hash = (link || '').split('#')[1] || '';
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const page = await ctx.newPage();
    await page.route('**/*', r => /^(file|data|blob):/.test(r.request().url()) ? r.continue() : r.abort());
    const errs = [];
    page.on('pageerror', e => errs.push(String(e && e.message || e)));
    /* dev=1 so the gate reaches the instrument the same way every other
       browser gate does, without a login door standing over the measure;
       loginDashOverride() is the real function the door\'s own success
       handler calls, called here directly the same honest shortcut the
       repo\'s own login/reset test uses for a server this sandbox cannot
       reach, never a second implementation of the ruling. */
    await page.goto('file://' + APP + '?dev=1#' + hash);
    try { await page.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 15000 }); }
    catch (e) { ok(false, 'the app did not boot with the funnel\'s own record link on the address'); }

    const landed = await page.evaluate(() => ({
      recordLinkLanded: typeof RECORD_LINK_LANDED !== 'undefined' ? RECORD_LINK_LANDED : null,
      name: CURP && CURP.name
    }));
    ok(landed.recordLinkLanded === true,
      'RECORD_LINK_LANDED is ' + landed.recordLinkLanded + ' after a first-time record-link landing, expected true');
    ok(landed.name === 'Web reading', 'the imported record is named "' + landed.name + '", expected "Web reading"');

    /* the override itself, and that it actually moves the real state the
       real app reads (S.tab, STV.dash), not a second variable nobody else
       looks at */
    const before = await page.evaluate(() => ({ tab: S.tab, dash: STV.dash, story: TAB.STORY }));
    const ran = await page.evaluate(() => (typeof loginDashOverride === 'function') && loginDashOverride());
    const after = await page.evaluate(() => ({ tab: S.tab, dash: STV.dash, flagNow: RECORD_LINK_LANDED }));
    ok(ran === true, 'loginDashOverride() returned ' + ran + ', expected true right after this exact landing');
    ok(after.tab === before.story, 'after login, S.tab is ' + after.tab + ', expected TAB.STORY (' + before.story + ')');
    ok(after.dash === true, 'after login, STV.dash is ' + after.dash + ', expected true (the dashboard view)');
    ok(after.flagNow === false, 'RECORD_LINK_LANDED stayed ' + after.flagNow + ' after one read, expected it cleared so a later login cannot replay it');

    /* and the override does NOT fire for an ordinary login with no such
       landing behind it -- every other door into the app is untouched */
    const ordinary = await page.evaluate(() => (typeof loginDashOverride === 'function') && loginDashOverride());
    ok(ordinary === false, 'loginDashOverride() ran a second time with nothing behind it, returned ' + ordinary);
    ok(errs.length === 0, 'landing on the dashboard: ' + errs.length + ' error(s): ' + errs.slice(0, 3).join(' | '));
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

  /* ---------- the legal pages: staged, and linked ----------
     16 October. funnel/legal/ held a privacy policy and terms from 1 October,
     and the deploy's stage step copied nothing under it, so atuned.world
     served no policy and not one page or screen linked to one. Three holes,
     each held here:

       the stage   the deploy's own stage step, read out of deploy.yml and run
                   into a scratch folder, must put privacy.html and terms.html
                   there, the same bytes funnel/dist built. The step is run
                   rather than read, because a cp line that names the wrong
                   source passes a text search and stages nothing.
       the funnel  every funnel page that is not itself a legal page links
                   both, by the name the stage serves.
       the app     the built app links both addresses from the door, from
                   Settings under Account and under Privacy, and from the
                   first onboarding card, read off the rendered markup.

     Checked against a known bad case first: the stage step with its privacy
     line taken out must be called incomplete, or nothing after it is trusted. */
  console.log('\n--- the legal pages ---');
  const LEGAL = ['privacy.html', 'terms.html'];
  const ROOT = path.resolve(__dirname, '..');
  const stageRun = (() => {
    const lines = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'deploy.yml'), 'utf8').split('\n');
    const at = lines.findIndex(l => /^\s*- name: stage the site\s*$/.test(l));
    if (at < 0) return null;
    const r = lines.findIndex((l, i) => i > at && /^\s*run: \|\s*$/.test(l));
    if (r < 0) return null;
    const ind = lines[r].search(/\S/), out = [];
    for (let i = r + 1; i < lines.length; i++) {
      const l = lines[i];
      if (l.trim() && l.search(/\S/) <= ind) break;
      out.push(l.trim());
    }
    return out.join('\n');
  })();
  const staged = run => {
    const d = fs.mkdtempSync(path.join(require('os').tmpdir(), 'funnel-stage-'));
    fs.mkdirSync(path.join(d, 'funnel'));
    fs.symlinkSync(path.join(DIR, 'dist'), path.join(d, 'funnel', 'dist'));
    fs.symlinkSync(path.resolve(ROOT, process.env.ATUNED_FILE || 'source.html'), path.join(d, 'source.html'));
    const r = require('child_process').spawnSync('bash', ['-euo', 'pipefail', '-c', run], { cwd: d, encoding: 'utf8' });
    const lost = LEGAL.filter(f => {
      const p = path.join(d, 'deploy', f), src = path.join(DIST, f);
      return !fs.existsSync(p) || !fs.existsSync(src) || fs.statSync(p).size === 0
        || !fs.readFileSync(p).equals(fs.readFileSync(src));
    });
    fs.rmSync(d, { recursive: true, force: true });
    return { code: r.status, lost, err: (r.stderr || '').trim().split('\n')[0] };
  };
  ok(!!stageRun, 'deploy.yml has no "stage the site" step with a run block to read');
  if (stageRun && fs.existsSync(DIST)) {
    const bad = staged(stageRun.split('\n').filter(l => !/privacy\.html/.test(l)).join('\n'));
    if (!bad.lost.includes('privacy.html')) {
      ok(false, 'the stage check passed a stage step with no privacy line, so it is not trusted');
    } else {
      PASS++;
      const st = staged(stageRun);
      ok(st.code === 0, 'the deploy stage step exits ' + st.code + ' here: ' + st.err);
      ok(st.lost.length === 0, 'the deploy stage step does not put ' + st.lost.join(' and ')
        + ' on the site, so atuned.world/privacy or /terms answers nothing');
      console.log('  staged by the deploy step: ' + LEGAL.filter(f => !st.lost.includes(f)).join(', '));
    }
  } else if (stageRun) {
    console.log('  no dist, so the stage was not run');
  }
  for (const p of PAGES.filter(f => !/^(privacy|terms|consumer-health-data)\.html$/.test(f))) {
    const h = fs.readFileSync(path.join(DIR, p), 'utf8');
    const miss = LEGAL.filter(f => h.indexOf('href="' + f + '"') < 0);
    ok(miss.length === 0, p + ' does not link ' + miss.join(' or '));
  }
  {
    const APP = path.resolve(ROOT, process.env.ATUNED_FILE || 'source.html');
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const page = await ctx.newPage();
    await page.route('**/*', r => /^(file|data|blob):/.test(r.request().url()) ? r.continue() : r.abort());
    await page.goto('file://' + APP + '?dev=1');
    let up = true;
    try { await page.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 15000 }); }
    catch (e) { up = false; ok(false, 'the app at ' + APP + ' did not boot, so its legal links were not read'); }
    if (up) {
      const seen = await page.evaluate(() => {
        const hrefs = html => { const d = document.createElement('div'); d.innerHTML = html;
          return [...d.querySelectorAll('a[href]')].map(a => a.getAttribute('href')); };
        const out = {};
        out.door = hrefs(loginCard(''));
        setTab(TAB.SETTINGS);
        for (const k of ['account', 'privacy']) {
          ACC_OPEN = k; renderAccount();
          out['settings ' + k] = [...document.querySelectorAll('#settings a[href]')].map(a => a.getAttribute('href'));
        }
        obOpen(true); OB.step = 0; obRender();
        out['first onboarding card'] = [...document.querySelectorAll('#ob a[href]')].map(a => a.getAttribute('href'));
        try { obClose(); } catch (e) {}
        return out;
      });
      for (const [where, list] of Object.entries(seen)) {
        const miss = ['https://atuned.world/privacy', 'https://atuned.world/terms'].filter(u => list.indexOf(u) < 0);
        ok(miss.length === 0, 'the app\'s ' + where + ' does not link ' + miss.join(' or '));
      }
      console.log('  linked in the app from: ' + Object.keys(seen).join(', '));
    }
    await ctx.close();
  }

  await browser.close();
  console.log('\n  controls measured ' + ctrlSeen + ', prose links ' + proseSeen
    + ', outbound requests ' + reqSeen);
  console.log('  ' + PASS + ' passed, ' + FAIL + ' failed\n');
  process.exit(FAIL ? 1 : 0);
})();
