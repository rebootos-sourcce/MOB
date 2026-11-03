#!/usr/bin/env node
/* ============================================================
   THE ALLOWANCE, 17 October. Five seats (game director, UI and UX, sales,
   the AI director, and Emmy) read what the pattern allowance does today and
   agreed on the fixes this holds. The ruling is DECISIONS.md, "The allowance,
   five seats". A pattern is one unit of the allowance: one line at one
   address down one channel, counted the first time it is opened.

     env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=$PW_DIR \
       node tests/allowance.js
     ENGINE=file        the headless half against another engine.js
     ALLOWANCE_HTML=file the browser half against another build
     ALLOWANCE_SHOTS=dir also save the three screens at both widths, to look at

   HEADLESS, on engine.js, like tests/engine.js:
     1  a run opens whole addresses only (meterPlanWhole): never one channel
        of an address without the other three, heaviest first when the room is
        short, nothing at all on a cap of nought
     2  a paid tier at nought is never told it is banking, and says the day
        new ones arrive; free still banks and says so
     3  leaving a paid tier restarts free from that day: 1,500 opened while
        paying is not charged against the free weeks, and a second read keeps
        the restart

   IN A REAL CHROMIUM, at 1600 by 1000 and 390 by 844:
     4  the free release: eight picked against three left released all eight
        on main for the three patterns one address was charged. Here an address
        the plan did not reach is never released, whatever the route
     5  one line before Run when the run is shorter than what was picked: how
        many it opens and why. And no cost line otherwise, which he ruled off
        this card at round IG and the review would have put back
     6  the empty card: Rerun these first, filled, at the tap floor, and it
        runs on the one press and spends nothing; Close; See the tiers last and
        small; the day new ones arrive; the crisis door; the story kept
     7  the plan sheet's line for a paid tier at nought
     8  one word per concept: the release card counts lines, not patterns

   CHECKED AGAINST THE BUILD FROM BEFORE THIS CHANGE FIRST, the standing rule
   (ENGINE and ALLOWANCE_HTML pointing at main's b29ddf21 products): it fails
   on 1, 2, 3, 4, 5, 6, 7 and 8.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const E = require(path.resolve(process.env.ENGINE || path.join(ROOT, 'engine.js')));
const SRC = path.resolve(process.env.ALLOWANCE_HTML || path.join(ROOT, 'source.html'));
const SHOTS = process.env.ALLOWANCE_SHOTS ? path.resolve(process.env.ALLOWANCE_SHOTS) : null;
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) { PASS++; console.log('  ok    ' + m); } else { FAIL++; console.log('  FAIL  ' + m); } };
const J = JSON.stringify;
const CH = ['Llimit', 'Rlimit', 'Ltruth', 'Rtruth'];
const addrOf = k => String(k).split(':')[0];
/* every address in a plan, with how many channels it covers */
const cover = keys => { const by = {}; keys.forEach(k => { by[addrOf(k)] = (by[addrOf(k)] || 0) + 1; }); return by; };
const many = n => Array.from({ length: n }, (_, i) => 'x' + i + ':Rlimit:0');

console.log('\n=== 1. a run opens whole addresses only ===');
{
  const W = E.meterPlanWhole;
  ok(typeof W === 'function', 'meterPlanWhole is reachable from the contract');
  if (typeof W !== 'function') ok(false, 'so nothing below it can be measured');
  else {
    const p = E.blankProfile('whole');
    const wide = W(p, [1, 2, 3, 4, 5, 6, 7, 8], CH, E.RUN_MAX);
    const wc = cover(wide);
    ok(wide.length <= E.RUN_MAX, 'eight picked inside the run ceiling: ' + wide.length + ' keys, at most ' + E.RUN_MAX);
    ok(Object.values(wc).every(n => n === CH.length), 'and every address in it carries all ' + CH.length + ' channels: ' + J(wc));
    ok(Object.keys(wc).length === Math.floor(E.RUN_MAX / CH.length), 'which is as many whole addresses as the ceiling holds, ' + Object.keys(wc).length);
    const old = E.meterPlan(p, [1, 2, 3, 4, 5, 6, 7, 8], CH, E.RUN_MAX);
    console.log('        meterPlan on the same pick covers ' + J(cover(old)) + ', which is the cut this replaces');
    ok(J(W(p, [1, 2, 3], CH, 3)) === '[]', 'three left plans nothing, never three of one address\'s four channels');
    ok(J(W(p, [1, 2, 3], CH, 0)) === '[]', 'a cap of nought plans nothing, where meterPlan reads nought as no cap');
    const ten = W(p, [1, 2, 3], CH, 10), tc = cover(ten);
    ok(ten.length === 2 * CH.length && Object.values(tc).every(n => n === CH.length), 'ten left and three picked opens two whole addresses: ' + J(tc));
    const hv = W(p, [1, 2, 3], CH, 2 * CH.length, [1, 9, 5]);
    ok(J(Object.keys(cover(hv))) === J(['2', '3']) && addrOf(hv[0]) === '2',
      'when the room is short the heaviest go in, written in the order picked: ' + J(hv.map(addrOf)));
    ok(J(W(p, [1, 2, 3], CH, E.RUN_MAX)) === J(E.meterPlan(p, [1, 2, 3], CH, E.RUN_MAX)),
      'when everything fits it plans exactly what meterPlan plans');
    ok(J(W(p, [4, 4, 5], CH, E.RUN_MAX)) === J(W(p, [4, 5], CH, E.RUN_MAX)), 'an address picked twice is planned once');
    /* a channel fully open at an address leaves three to open there, and three fit three */
    const q = E.blankProfile('part');
    q.meter = { lines: 0, unique: [], first: null, last: null, giftAt: null };
    for (let i = 0; i < E.LINES_PER_CH; i++) q.meter.unique.push(E.meterKey(9, 'Rtruth', i));
    const part = W(q, [9], CH, 3);
    ok(part.length === 3 && part.every(k => !/Rtruth/.test(k)), 'an address with a channel fully open is whole at three: ' + J(part));
    /* the spend is the plan */
    const r = E.blankProfile('spend'); const pl = W(r, [1, 2, 3, 4, 5, 6, 7, 8], CH, E.RUN_MAX);
    const m = E.meterRun(r, pl);
    ok(m && m.added === pl.length, 'the run spends exactly the plan it was shown, ' + (m && m.added) + ' of ' + pl.length);
  }
}

console.log('\n=== 2. only free banks, and a paid tier says the day ===');
{
  const until = '2026-11-03T00:00:00Z';
  const paid = { tier: 'one', status: 'active', granted: 0, carried: 0, base: 1100, since: '2026-10-03T00:00:00Z', until, ends: null };
  const z = E.planAllowance(paid, 1500, null, '2026-10-20T00:00:00Z');
  ok(z.left === 0 && !/bank/.test(z.say), 'tier one at nought says nothing about a bank: "' + z.say + '"');
  ok(z.renews === until, 'and carries the day new ones arrive, the paid period\'s end: ' + z.renews);
  const three = E.planAllowance(paid, 1497, null, '2026-10-20T00:00:00Z');
  ok(three.left === 3 && !/bank/.test(three.say), 'nor at three, under one run: "' + three.say + '"');
  const fr = E.planAllowance({ tier: 'free', status: '', granted: 0, carried: 0, base: null, since: null, until: null, ends: null },
    107, '2026-10-17T00:00:00Z', '2026-10-17T06:00:00Z');
  ok(fr.left === 3 && /banking/.test(fr.say), 'free at three still banks, which is ruled, and says so: "' + fr.say + '"');
  ok(fr.renews === '2026-10-24T00:00:00.000Z', 'and its next week starts seven days on from the gift running out: ' + fr.renews);
  const gift = E.planAllowance(null, 40);
  ok(gift.inGift && gift.renews === null, 'the gift is given once and names no day: ' + gift.renews);
}

console.log('\n=== 3. leaving a paid tier restarts free from that day ===');
{
  const paid = { tier: 'one', status: 'active', granted: 0, carried: 0, base: 1100, since: '2026-09-17T00:00:00Z', until: '2026-10-17T00:00:00Z', ends: null };
  const gone = E.planFromServer(paid, null, many(1500), '2026-10-10T00:00:00Z');
  ok(gone.plan.tier === 'free' && !gone.same, 'no paid plan on the account reads free, and the host is told: ' + J(gone.plan));
  const a = E.planAllowance(gone.plan, 1500, '2026-05-01T00:00:00Z', '2026-10-10T01:00:00Z');
  ok(a.left === 10, '1,500 opened while paying is not charged against free: ' + a.left + ' left, "' + a.say + '"');
  const b = E.planAllowance(gone.plan, 1500, '2026-05-01T00:00:00Z', '2026-10-25T01:00:00Z');
  ok(b.left === 30, 'and free banks from the day it restarted, three weeks on: ' + b.left);
  const again = E.planFromServer(gone.plan, null, many(1504), '2026-10-20T00:00:00Z');
  ok(again.same && again.plan.base === gone.plan.base && again.plan.since === gone.plan.since,
    'read again, the restart is kept, so a reload does not undo it: ' + J(again.plan));
  const stop = E.planFromServer(paid, { tier: 'one', status: 'canceled', since: paid.since, until: paid.until }, many(1500), '2026-10-12T00:00:00Z');
  const s = E.planAllowance(stop.plan, 1500, null, '2026-10-20T00:00:00Z');
  ok(stop.plan.base === 1500 && s.source === 'free' && s.left === 10,
    'a plan read back stopped in place restarts the same way: base ' + stop.plan.base + ', ' + s.left + ' left');
  const never = E.planFromServer(E.blankProfile('n').plan, null, [], '2026-10-12T00:00:00Z');
  ok(never.same && never.plan.base === null && never.plan.since === null, 'a record that never paid is untouched: ' + J(never.plan));
}

/* ============================================================
   THE BROWSER HALF
   ============================================================ */
const STORY = 'I am afraid and angry and ashamed. I panic about money, I feel guilt and grief, my chest is tight, '
  + 'my stomach knots, I am jealous and I hate myself and I feel worthless and alone.';
const booted = async p => {
  try { await p.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 20000 }); } catch (e) { }
  try { await p.waitForTimeout(500); await p.evaluate(() => { if (typeof OB !== 'undefined' && OB.open && typeof obClose === 'function') obClose(); }); } catch (e) { }
};
/* a read that throws on a build missing what it reads reports as a failed
   check rather than ending the run, so a known bad build names every miss */
const ev = async (page, fn, arg) => { try { return await page.evaluate(fn, arg); } catch (e) { return { err: String(e.message).split('\n')[0] }; } };
/* the person's own record with a story committed, and the meter set so that
   `left` patterns are left this free week. pad is dummy keys at no address,
   so nothing real is opened unless the test opens it. */
const setUp = (page, left, opened) => ev(page, ([t, left, opened]) => {
  loadP(0);
  CURP.meter.unique = []; CURP.meter.giftAt = null;
  CURP.plan = { tier: 'free', status: '', granted: 0, carried: 0, base: null, since: null, until: null, ends: null };
  ST_TEXT = t; ST_PARSED = parseStory(t); stCommit(); compute();
  var real = [];
  if (opened) {
    /* a real release first, inside the gift, so some addresses are open */
    relPick(relQueueOf(3).map(function (n) { return n.i; }));
    RUN.dose = 1; RUN.phase = 'run'; RUN.idx = RUN.plan.length; relCoolDown(); relClose();
    real = CURP.meter.unique.slice();}
  /* the gift's hundred and this week's ten, less what is to be left */
  var pad = [], need = 110 - left - real.length;
  for (var i = 0; i < need; i++) pad.push('x' + i + ':Rlimit:0');
  CURP.meter.unique = real.concat(pad);
  CURP.meter.giftAt = new Date().toISOString();
  CURP.plan = { tier: 'free', status: '', granted: 0, carried: 0, base: null, since: null, until: null, ends: null };
  compute();
  return { left: relLeft(), real: real.length, entries: (CURP.story && CURP.story.entries || []).length };
}, [STORY, left, !!opened]);

async function shot(page, name, W) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: path.join(SHOTS, name + '-' + W + '.png') });
}

(async () => {
  if (!fs.existsSync(SRC)) { console.log(path.relative(ROOT, SRC) + ' is missing: build first'); process.exit(1); }
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { ok(false, 'playwright is not installed, so the browser half did not run'); return done(); }
  const browser = await chromium.launch({ executablePath: CHROME });
  require('./net.js').guardBrowser(browser);
  for (const [W, H] of [[1600, 1000], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' }); await booted(page);
    await ev(page, () => { var d = document.getElementById('msgdock'); if (d) d.style.visibility = 'hidden'; });

    console.log('\n=== 4. no address is released that was not charged, at ' + W + ' ===');
    {
      const s = await setUp(page, 3, false);
      const r = await ev(page, () => {
        var q = relQueueOf(8), before = {};
        q.forEach(function (n) { before[n.i] = n.sq; });
        relPick(q.map(function (n) { return n.i; }));
        var plan = RUN.plan.slice(), u0 = CURP.meter.unique.length;
        RUN.phase = 'run'; RUN.idx = plan.length; relCoolDown();
        var moved = q.filter(function (n) { compute(); return BY[n.i].sq !== before[n.i]; }).map(function (n) { return n.i; });
        var out = { picked: q.length, plan: plan, logged: RUN.log.map(function (x) { return x.node; }), moved: moved,
          spent: CURP.meter.unique.length - u0 };
        relClose(); return out;
      });
      ok(s.left === 3 && r.picked >= 4, 'eight picked, three left: ' + s.left + ' left, ' + r.picked + ' picked');
      ok(Array.isArray(r.plan) && r.plan.length === 0, 'three is not a whole address, so the plan is empty: ' + J(r.plan));
      ok(Array.isArray(r.logged) && r.logged.length === 0 && r.spent === 0,
        'and nothing is released and nothing spent: released ' + J(r.logged) + ', spent ' + r.spent);
      ok(Array.isArray(r.moved) && r.moved.length === 0, 'no picked address lost charge: ' + J(r.moved));

      await setUp(page, 10, false);
      const t = await ev(page, () => {
        var q = relQueueOf(8);
        relPick(q.map(function (n) { return n.i; }));
        var plan = RUN.plan.slice(), by = {};
        plan.forEach(function (k) { var a = k.split(':')[0]; by[a] = (by[a] || 0) + 1; });
        RUN.phase = 'run'; RUN.idx = plan.length; relCoolDown();
        var out = { by: by, queue: Object.keys(by).length, logged: RUN.log.map(function (x) { return String(x.node); }) };
        relClose(); return out;
      });
      ok(t.by && Object.values(t.by).every(n => n === 4) && t.queue === 2, 'ten left opens two whole addresses, four channels each: ' + J(t.by));
      ok(t.logged && J(t.logged.slice().sort()) === J(Object.keys(t.by).sort()), 'and releases exactly those two: ' + J(t.logged));

      /* THE GUARD ITSELF, for a route that hands relCoolDown a queue wider than
         its plan: the queue is cut to what the plan reached */
      await setUp(page, 10, false);
      const g = await ev(page, () => {
        var q = relQueueOf(8);
        relPick(q.map(function (n) { return n.i; }));
        RUN.queue = q.slice();
        var inPlan = {}; RUN.plan.forEach(function (k) { inPlan[k.split(':')[0]] = 1; });
        RUN.phase = 'run'; RUN.idx = RUN.plan.length; relCoolDown();
        var out = { wide: q.length, logged: RUN.log.map(function (x) { return x.node; }), stray: RUN.log.filter(function (x) { return !inPlan[x.node]; }).length };
        relClose(); return out;
      });
      ok(g.stray === 0 && g.logged && g.logged.length > 0 && g.logged.length < g.wide,
        'a queue of ' + g.wide + ' against a plan of fewer releases only what the plan reached: ' + J(g.logged));
    }

    console.log('\n=== 5. one line under Run, before it, at ' + W + ' ===');
    {
      await setUp(page, 10, false);
      const sh = await ev(page, () => {
        relPick(relQueueOf(3).map(function (n) { return n.i; }));
        var c = document.getElementById('relcost'), go = document.getElementById('relgo');
        var r = c && c.getBoundingClientRect(), ft = document.getElementById('relfoot'), fr = ft && ft.getBoundingClientRect();
        return { text: c && c.textContent, before: !!(c && go && (c.compareDocumentPosition(go) & Node.DOCUMENT_POSITION_FOLLOWING)),
          /* on the first screen, above the foot, with no scrolling: a line
             under the fold is a line nobody reads before pressing Run */
          seen: !!(r && fr && r.height > 0 && r.top >= 0 && r.bottom <= fr.top), at: r && [Math.round(r.top), Math.round(r.bottom), fr && Math.round(fr.top)] };
      });
      ok(sh.text === 'This run opens 2 new addresses. This week has room for 2, and you picked 3.',
        'a short run says so before Run: "' + sh.text + '"');
      ok(sh.before && sh.seen, 'on the card\'s first screen, above Run release: ' + J(sh.at));
      await shot(page, 'allowance-short', W);
      await ev(page, () => relClose());

      const nm = await ev(page, () => {
        loadP(0); compute();
        CURP.meter.unique = Array.from({ length: 112 }, function (_, i) { return 'x' + i + ':Rlimit:0'; });
        CURP.plan = { tier: 'one', status: 'active', granted: 0, carried: 0, base: 100, since: new Date(Date.now() - 86400000).toISOString(),
          until: new Date(Date.now() + 20 * 86400000).toISOString(), ends: null };
        relPick(relQueueOf(3).map(function (n) { return n.i; }));
        var c = document.getElementById('relcost'), card = document.querySelector('#rel .rel-card');
        var go = document.getElementById('relgo'), gr = go && go.getBoundingClientRect();
        var top = gr ? document.elementFromPoint(gr.left + gr.width / 2, gr.top + gr.height / 2) : null;
        var out = { cost: !!c, plan: RUN.plan.length, left: relLeft(), go: !!go, open: !!(top && go && (top === go || go.contains(top))),
          price: /\d+ left this|\bof the \d+/.test(card ? card.innerText : '') }; relClose(); return out;
      });
      /* round IG, 27 September, his words: "Cost runs left, that goes away. And
         this, just, run release button." The review asked for "Opens 12 new.
         388 left this month." here; it stays off until he rules it back. */
      ok(nm.go && nm.plan > 0 && !nm.cost && !nm.price,
        'a run that covers what was picked carries no cost line, as ruled at IG: ' + J(nm));
      ok(nm.open, 'and Run release is not under the storage line');
    }

    console.log('\n=== 6. the empty card, at ' + W + ' ===');
    {
      const s = await setUp(page, 0, true);
      const e = await ev(page, () => {
        var held = CURP.meter.unique.filter(function (k) { return k.charAt(0) !== 'x'; }), at = {};
        held.forEach(function (k) { at[k.split(':')[0]] = 1; });
        relPick(Object.keys(at).map(Number));
        var f = document.getElementById('relfoot'), kids = f ? [].slice.call(f.querySelectorAll('button')) : [];
        var rr = document.getElementById('relrerun'), r = rr && rr.getBoundingClientRect();
        /* nothing sits over it: the storage line (ui/keep.js) stood above the card's foot */
        var top = r ? document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) : null;
        var note = document.getElementById('relempty'), crx = document.querySelector('#rel [data-crisis="open"]');
        return { ids: kids.map(function (b) { return b.id; }), words: kids.map(function (b) { return b.textContent; }),
          pri: !!(rr && rr.classList.contains('pri')), w: r && r.width, h: r && r.height,
          open: !!(top && rr && (top === rr || rr.contains(top))), over: top ? (top.id || top.className) : null,
          go: !!document.getElementById('relgo'), note: note && note.textContent,
          renews: (meterBudget(CURP).allow || {}).renews, day: typeof planDay === 'function' ? planDay((meterBudget(CURP).allow || {}).renews) : '',
          crx: !!crx, crxH: crx ? crx.getBoundingClientRect().height : 0,
          tiersFont: parseFloat(getComputedStyle(document.getElementById('relplan') || document.body).fontSize),
          riFont: rr ? parseFloat(getComputedStyle(rr).fontSize) : 0, u: CURP.meter.unique.length };
      });
      ok(s.left === 0 && s.real > 0 && s.entries > 0, 'nothing left, ' + s.real + ' patterns really open, and the story kept: ' + s.entries + ' entries');
      ok(e.ids && e.ids[0] === 'relrerun' && e.words[0] === 'Rerun these' && e.pri, 'Rerun these is the first press, and filled: ' + J(e.words));
      ok(e.h >= 44 && e.w >= 44, 'at the tap floor, ' + Math.round(e.w) + ' by ' + Math.round(e.h));
      ok(e.open, 'and nothing covers it, the top element at its centre is ' + J(e.over));
      ok(e.ids && e.ids[1] === 'relcancel' && e.words[1] === 'Close', 'then Close');
      ok(e.ids && e.ids[e.ids.length - 1] === 'relplan' && e.words[e.words.length - 1] === 'See the tiers' && e.tiersFont < e.riFont,
        'and See the tiers last and smaller, ' + e.tiersFont + 'px against ' + e.riFont + 'px');
      ok(e.go === false, 'there is no Run release to press for a run that cannot open anything');
      ok(e.note === 'This week\'s new patterns are all opened. Everything you have opened still runs, free, as often as you like. New ones arrive on ' + e.day + '.'
        && !!e.day, 'it says what still runs, and the day new ones arrive: "' + e.note + '"');
      ok(e.crx && e.crxH >= 44, 'the crisis door is on the card, ' + Math.round(e.crxH) + 'px');
      await shot(page, 'allowance-empty', W);
      const run = await ev(page, () => {
        var u0 = CURP.meter.unique.length;
        document.getElementById('relrerun').click();
        var started = RUN.phase !== 'idle' && RUN.rerun === true, plan = RUN.plan.slice(), inPlan = {};
        plan.forEach(function (k) { inPlan[k.split(':')[0]] = 1; });
        RUN.phase = 'run'; RUN.idx = plan.length; relCoolDown();
        var out = { started: started, plan: plan.length, spent: CURP.meter.unique.length - u0,
          stray: RUN.log.filter(function (x) { return !inPlan[x.node]; }).length, logged: RUN.log.length };
        relClose(); return out;
      });
      ok(run.started && run.plan > 0, 'one press and the rerun is running, ' + run.plan + ' lines planned');
      ok(run.spent === 0 && run.stray === 0 && run.logged > 0, 'it spends nothing and releases only what it said: spent ' + run.spent + ', released ' + run.logged);

      const fb = await ev(page, () => {
        var held = {}; CURP.meter.unique.forEach(function (k) { held[k.split(':')[0]] = 1; });
        var fresh = W.filter(function (n) { return n.cf && !held[n.i]; }).slice(0, 3).map(function (n) { return n.i; });
        relPick(fresh);
        var rr = document.getElementById('relrerun');
        var out = { word: rr && rr.textContent };
        if (rr) { rr.click(); out.queue = RUN.queue.map(function (n) { return n.i; }); out.heldAll = out.queue.every(function (i) { return held[i]; }); out.rerun = RUN.rerun; }
        relClose(); return out;
      });
      ok(fb.word === 'Rerun your heaviest' && fb.rerun && fb.heldAll && fb.queue.length > 0,
        'picked addresses never opened still get a live first press, on what is open: ' + J(fb));
    }

    console.log('\n=== 7. the plan sheet, at ' + W + ' ===');
    {
      const ps = await ev(page, () => {
        loadP(0);
        CURP.meter.unique = Array.from({ length: 500 }, function (_, i) { return 'x' + i + ':Rlimit:0'; });
        CURP.plan = { tier: 'one', status: 'active', granted: 0, carried: 0, base: 100, since: new Date(Date.now() - 86400000).toISOString(),
          until: new Date(Date.now() + 20 * 86400000).toISOString(), ends: null };
        profileSheet();
        var row = [].slice.call(document.querySelectorAll('#sheet .sh-row')).filter(function (r) { return /New ground/.test(r.textContent); })[0];
        var b = row && row.querySelector('b');
        if (b) b.scrollIntoView({ block: 'center' });
        return { text: b && b.textContent, day: planDay(CURP.plan.until) };
      });
      ok(ps.text === '0 left this month. New ones arrive on ' + ps.day, 'a paid tier at nought reads the day, not a bank: "' + ps.text + '"');
      ok(ps.text && !/bank/.test(ps.text), 'and the word banking is not on it');
      await shot(page, 'allowance-plansheet', W);
      await ev(page, () => { if (typeof sheetClose === 'function') sheetClose(); });
    }

    console.log('\n=== 8. the release card counts lines, at ' + W + ' ===');
    {
      const w8 = await ev(page, () => {
        loadP(0); compute();
        CURP.meter.unique = []; CURP.plan = { tier: 'free', status: '', granted: 0, carried: 0, base: null, since: null, until: null, ends: null };
        relPick(relQueueOf(1).map(function (n) { return n.i; }));
        var card = document.querySelector('#rel .rel-card');
        var t = card ? card.innerText : '', lbl = document.getElementById('reldose');
        var out = { groups: [].slice.call(document.querySelectorAll('#rel .rel-gi-c')).map(function (x) { return x.textContent; }),
          sum: (document.querySelector('#rel .rel-gsum') || {}).textContent, dose: lbl && lbl.parentNode.querySelector('span').textContent,
          closing: (relClosing({ said: 200 }, false) || [])[0] };
        relClose(); return out;
      });
      ok(w8.groups && w8.groups.length && w8.groups.every(g => /lines?$/.test(g) && !/pattern/.test(g)), 'each group counts lines said: ' + J(w8.groups));
      ok(w8.sum && /lines\. Each is one release line, said once\.$/.test(w8.sum) && !/pattern/.test(w8.sum), 'and so does the summary: "' + w8.sum + '"');
      /* PATTERNS, not Times said, round of 29 October, overriding 17
         October's own rename this check used to hold the opposite way;
         see the ruling at the matching field in ui/storyui.js. */
      ok(w8.dose === 'Patterns', 'the dose field reads Patterns again: ' + w8.dose);
      ok(w8.closing === 'Congratulations. You finished your release: 200 lines.', 'the closing counts lines: "' + w8.closing + '"');
    }

    ok(errs.length === 0, 'no page error at ' + W + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
    await page.close();
  }
  await browser.close();
  done();
})().catch(e => { ok(false, 'the run threw: ' + (e && e.stack || e)); done(); });

function done() {
  console.log('\n===== ' + PASS + ' passed, ' + FAIL + ' failed =====');
  process.exit(FAIL ? 1 : 0);
}
