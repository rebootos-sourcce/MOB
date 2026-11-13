#!/usr/bin/env node
/* ============================================================
   THE RELEASE CHAIN, 17 October. The owner: "Last I saw, the 'I am'
   statements were all broken ... find out where in the logic chain the
   release mechanism is failing." Walked end to end on main through the real
   controls, a story in the journal, the sniffer's picks, the setup, the run,
   the carousel, the voice, the closing, the meter and a reload, for six
   stories (grief, fear, shame, anger, money, a back in pain) at 1600 and 390.
   Four links broke, and this holds each one:

     env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=$PW_DIR \
       node tests/releasechain.js
     ENGINE=file          the headless half against another engine.js
     RELCHAIN_HTML=file   the browser half against another build

   HEADLESS, on engine.js:
     1  no line reads an address name straight after "that I am". The three
        Surprise addresses carry no card, and the strict syntax said "that I
        am betrayal." on every pass of every block at them

   IN A REAL CHROMIUM, at 1600 by 1000 and 390 by 844:
     2  a story's Run release runs what its words named. Grief and shame ran
        Addiction, Lust and Shame of Desire, addresses the sniffer filled a
        seat with (inferred), and said "that I am in apathy" over a death
     3  the voice asks the server once per line it has not rendered. A block is
        one head and the same pass again for every time said, and each repeat
        was a new render against the device's daily characters
     4  every line the voice is handed is the line on the screen as it is said
     5  the Story's own Run release sets times said in the card's word and to
        the card's ceiling: it said Patterns and capped at fifty under a
        default of a hundred
     6  the run screen states the session in the setup's count: the setup said
        150 lines and the run said 300 lines this session
     7  what the run opened is on the record after a reload

   CHECKED AGAINST THE BUILD FROM BEFORE THIS CHANGE FIRST, the standing rule
   (ENGINE and RELCHAIN_HTML pointing at origin/main aeab54e2's products): it
   fails on 1, 2, 3, 5 and 6. 4 and 7 held on main and are kept so they stay
   held.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const E = require(path.resolve(process.env.ENGINE || path.join(ROOT, 'engine.js')));
const SRC = path.resolve(process.env.RELCHAIN_HTML || path.join(ROOT, 'source.html'));
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) { PASS++; console.log('  ok    ' + m); } else { FAIL++; console.log('  FAIL  ' + m); } };
const J = JSON.stringify;

/* the six stories of the walk, each in plain first person */
const STORIES = {
  grief: 'My father died in March. I cannot stop crying at night and the house feels empty. My chest is heavy and I feel completely alone.',
  fear: 'I am terrified of losing my job. I wake at three in the morning with my heart racing and I cannot breathe.',
  shame: 'I feel ashamed of who I am. I hide from people and I think I am not good enough. My face burns when someone looks at me.',
  anger: 'I am furious at my brother. He lied to me again and I want to scream. My jaw is clenched all day.',
  money: 'I am scared about money. Rent is due and I have nothing saved. I keep checking my bank account and my stomach knots.',
  pain: 'My lower back has hurt for six months. The pain shoots down my leg and I cannot sit at work. I am exhausted by it.'
};

console.log('\n=== 1. no line reads an address name after "that I am" ===');
{
  const { C3_STEM, C3_TRUTH, relLine, LINES_PER_CH } = E;
  const ADDR = Object.values(E.BY).filter(n => n && n.cf);
  const bare = [], junk = [];
  let lines = 0;
  ADDR.forEach(n => ['Llimit', 'Rlimit', 'Ltruth', 'Rtruth'].forEach(ch => {
    for (let i = 0; i < LINES_PER_CH; i++) {
      const L = relLine(n, ch, i); lines++;
      const t = L && L.text, nm = String(n.k).toLowerCase();
      if (!t || /undefined|null|NaN|\[object/.test(t)) junk.push(n.i + ':' + ch + ':' + i);
      else if (t === C3_STEM + nm + '.' || t === C3_TRUTH + 'not ' + nm + '.') bare.push(n.k + ' ' + ch + ': ' + t.slice(C3_STEM.length - 10));
    }
  }));
  ok(lines > 0, 'every key at every address with a feeling was built, ' + lines + ' lines over ' + ADDR.length + ' addresses');
  ok(junk.length === 0, 'none is empty or carries a template word: ' + J(junk.slice(0, 3)));
  ok(bare.length === 0, 'and none says "I am" straight onto an address name: ' + J(bare.filter((x, i, a) => a.indexOf(x) === i).slice(0, 4)));
  const sur = ADDR.find(n => n.cf === 'Surprise');
  if (sur) {
    const t = relLine(sur, 'Llimit', 0).text;
    ok(t === C3_STEM + 'in ' + String(sur.k).toLowerCase() + '.', 'an address no card covers takes his "in", as the axes cards put a noun after the stem: ' + t.slice(C3_STEM.length - 10));
  }
}

const booted = async p => {
  try { await p.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 20000 }); } catch (e) { }
  try { await p.waitForTimeout(500); await p.evaluate(() => { if (typeof OB !== 'undefined' && OB.open && typeof obClose === 'function') obClose(); }); } catch (e) { }
};
/* a read that throws on a build missing what it reads reports as a failed
   check rather than ending the run, so a known bad build names every miss */
const ev = async (page, fn, arg) => { try { return await page.evaluate(fn, arg); } catch (e) { return { err: String(e.message).split('\n')[0] }; } };

(async () => {
  if (!fs.existsSync(SRC)) { console.log(path.relative(ROOT, SRC) + ' is missing: build first'); process.exit(1); }
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { ok(false, 'playwright is not installed, so the browser half did not run'); return done(); }
  const browser = await chromium.launch({ executablePath: CHROME });
  require('./net.js').guardBrowser(browser);
  const { WAV } = require('./net.js');
  for (const [W, H] of [[1600, 1000], [390, 844]]) {
    const open = async () => {
      const ctx = await browser.newContext({ viewport: { width: W, height: H } });
      const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
      await page.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' }); await booted(page);
      await ev(page, () => { var d = document.getElementById('msgdock'); if (d) d.style.visibility = 'hidden'; });
      return { ctx, page, errs };
    };
    /* the journal, through its own Commit. Voice only now, round of
       29 October, so the words reach ST_TEXT through srcTurnCommit, the
       one door a turn lands through whether it is typed or spoken. */
    const commit = async (page, text) => {
      await ev(page, () => { setTab(TAB.STORY); });
      await page.waitForTimeout(200);
      await ev(page, t => { srcTurnCommit(t); }, text);
      await page.waitForTimeout(200);
      await page.click('#stapply'); await page.waitForTimeout(400);
    };

    console.log('\n=== 2. a story\'s Run release runs what its words named, at ' + W + ' ===');
    for (const [k, text] of Object.entries(STORIES)) {
      const { ctx, page, errs } = await open();
      const named = await ev(page, t => { var p = parseStory(t), out = [];
        p.imprints.forEach(function (im) { var n = BY[im.node]; if (!im.inferred && n && n.cf && out.indexOf(n.i) < 0) out.push(n.i); });
        return out; }, text);
      await commit(page, text);
      const r = await ev(page, () => { var M = stRelModel(); return M.sel.map(function (n) { return n.i + ' ' + n.k + ' (' + n.cf + ')'; }); });
      const ids = Array.isArray(r) ? r.map(s => +s.split(' ')[0]) : [];
      /* only what the words named runs, when they named anything at all */
      const want = named.length ? ids.every(i => named.indexOf(i) >= 0) : true;
      ok(ids.length > 0 && want, k + ': runs ' + J(r) + ', and the words named ' + J(named));
      ok(errs.length === 0, k + ': no page error' + (errs.length ? ': ' + errs[0] : ''));
      await ctx.close();
    }

    console.log('\n=== 3 to 7. the grief story\'s run, start to finish, at ' + W + ' ===');
    {
      const { ctx, page, errs } = await open();
      /* the server, answered here and counted here, so what is counted is
         what left the page */
      const asked = [];
      await page.route(/\/v1\/voice\/synthesize/, route => {
        const q = route.request();
        if (q.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type', 'access-control-allow-methods': 'POST, OPTIONS' } });
        try { asked.push(JSON.parse(q.postData() || '{}')); } catch (e) { asked.push({}); }
        return route.fulfill({ status: 200, headers: { 'content-type': 'audio/wav', 'access-control-allow-origin': '*' }, body: WAV });
      });
      await commit(page, STORIES.grief);
      const f5 = await ev(page, () => { var f = document.getElementById('strdose'), l = f && f.closest('label');
        return { label: l ? (l.querySelector('span') || {}).textContent : null, max: f ? +f.max : null, value: f ? +f.value : null, dose: RUN.dose,
          card: typeof REL_DOSES !== 'undefined' ? REL_DOSES[REL_DOSES.length - 1] : null }; });
      /* PATTERNS, not Times said, round of 29 October, overriding 17
         October's own rename this check used to hold the opposite way;
         the Story's field and the card's own are kept in step either way. */
      ok(f5.label === 'Patterns', '5. the Story\'s field says Patterns, the card\'s word: ' + J(f5.label));
      ok(f5.max === f5.card && f5.value <= f5.max, '5. and its ceiling is the card\'s own, so the default it shows is one it allows: ' + J(f5));
      /* the press the Story's Run release makes, with the setup drawn first,
         and a short dose so the walk covers every block */
      const s6 = await ev(page, () => {
        REL_WORD_S = 0.0004; REL_GAP_S = 0.001; REL_HEAD_S = 0; REL_FRAME_S = 0;
        CURP.ui.voice = true; CURP.ui.tone = false;
        var M = stRelModel(); relPick(M.sel.map(function (n) { return n.i; }), M.fromLast && STV.lastT ? { story_t: STV.lastT } : null);
        var d = document.getElementById('reldose'); d.value = '3'; d.dispatchEvent(new Event('change'));
        var g = document.querySelector('#rel .rel-gsum'), b = g ? g.querySelectorAll('b') : [];
        window.__shown = []; var o = window.relStep;
        window.relStep = function () { var r = o.apply(this, arguments); var st = relCur();
          var ln = document.querySelector('#rel .rel-line'); if (st && (st.kind === 'head' || st.kind === 'pass')) window.__shown.push({ st: st.text, dom: ln ? ln.textContent : null }); return r; };
        return { setup: b[1] ? +b[1].textContent : null, plan: RUN.plan.length, u0: CURP.meter.unique.length };
      });
      await page.click('#relgo');
      await page.waitForFunction(() => RUN.phase === 'run', null, { timeout: 20000 }).catch(() => { });
      await page.waitForTimeout(100);
      const plate = await ev(page, () => { var t = (document.querySelector('#relhd .rel-ct') || {}).textContent || ''; var m = t.match(/(\d+) (release )?lines? this session/); return { t: t, n: m ? +m[1] : null }; });
      ok(s6.setup != null && plate.n === s6.setup, '6. the run states the session in the setup\'s count: setup ' + s6.setup + ', run ' + J(plate.t));
      await page.waitForFunction(() => RUN.phase === 'done' && RUN.cool >= COOLING.length, null, { timeout: 180000 }).catch(() => { });
      const r = await ev(page, () => ({ done: RUN.phase === 'done' && RUN.cool >= COOLING.length, lost: RUN.studioLost, shown: window.__shown,
        unique: CURP.meter.unique.slice(), vault: relVaultN(), fresh: (RUN.meter && RUN.meter.added) || 0 }));
      ok(r.done && !r.lost, 'the run went to its end and the voice never gave up: ' + J({ done: r.done, lost: r.lost }));
      const said = asked.map(b => (b.style || '') + '\n' + (b.text || ''));
      const distinct = new Set(said).size;
      const chars = asked.reduce((s, b) => s + String(b.text || '').length, 0);
      ok(asked.length > 0 && asked.length === distinct, '3. the server was asked once per line it had not rendered: ' + asked.length + ' requests for ' + distinct
        + ' distinct lines, ' + chars + ' characters, over ' + r.shown.length + ' lines said');
      const onScreen = new Set(r.shown.map(x => x.dom));
      const listAsked = asked.filter(b => b.style === 'list');
      ok(r.shown.length > 0 && r.shown.every(x => x.st === x.dom), '4. every line said is the line on the screen as it is said, ' + r.shown.length + ' lines: '
        + J(r.shown.filter(x => x.st !== x.dom).slice(0, 2)));
      ok(listAsked.length > 0 && listAsked.every(b => onScreen.has(b.text)), '4. and every list line the voice was handed was one of them, ' + listAsked.length + ' handed');
      ok(r.fresh === s6.plan && r.unique.length - s6.u0 === s6.plan, '7. the run opened its whole plan on the record: ' + J({ plan: s6.plan, added: r.fresh }));
      await ev(page, () => { var b = document.getElementById('relrest'); if (b) b.click(); var c = document.getElementById('relclose'); if (c) c.click(); });
      await page.reload({ waitUntil: 'load' }); await booted(page);
      const back = await ev(page, () => ({ unique: CURP.meter.unique.slice(), vault: relVaultN() }));
      ok(J(back.unique) === J(r.unique) && back.vault === r.vault, '7. and it is still there after a reload: ' + J({ before: [r.unique.length, r.vault], after: [back.unique.length, back.vault] }));
      ok(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
      await ctx.close();
    }

    /* 8. ONLY A PRESS OF HIT IS A HIT, 13 November. The owner's 21 October
       clarification, docs/ATUNED_CQ_DQ_SQ_RELEASE_HIT_FEEDBACK_ADDENDUM_v1.md
       section 4: "Executing a release does not prove that the candidate was a
       hit", "Retries and replay are idempotent". Before this the results
       listed every pattern the run reached and nothing asked the person, so
       on the build from before it there are no controls to press and every
       check below that presses one fails. engine/relhit.js holds the rules
       headless (tests/relhit.js); this holds them through the real card. */
    console.log('\n=== 8. only a press of Hit is a hit, and a replay counts nothing twice, at ' + W + ' ===');
    {
      const { ctx, page, errs } = await open();
      /* A FIELD WITH PATTERNS RUNNING. The grief story alone on a blank record
         runs no saboteur, complex or hyper complex, measured: the card then
         says so and presents nothing to mark, which is correct and holds
         nothing here. So the nine axes are charged and saved first, and the
         run is picked by hand on the first saboteur's own addresses. */
      const pick = await ev(page, () => {
        REL_WORD_S = 0.0004; REL_GAP_S = 0.001; REL_HEAD_S = 0; REL_FRAME_S = 0;
        CURP.ui.voice = false; CURP.ui.tone = false;
        CHARGES.forEach(function (c) { S.charge[c] = 7; }); pSave();
        var sab = (compute().sabs || []).filter(function (o) { return !o.over; })[0];
        var ids = sab ? leaves(sab).map(function (n) { return n.i; }).slice(0, 3) : [];
        relPick(ids, null);
        var d = document.getElementById('reldose'); if (d) { d.value = '1'; d.dispatchEvent(new Event('change')); }
        return { sab: sab ? sab.nm : null, ids: ids };
      });
      ok(pick && pick.sab && pick.ids.length > 0, '8. a charged field has a saboteur to run on: ' + J(pick));
      await page.click('#relgo');
      await page.waitForFunction(() => RUN.phase === 'done', null, { timeout: 180000 }).catch(() => { });
      await ev(page, () => { var b = document.getElementById('relrest'); if (b) b.click(); });
      await page.waitForFunction(() => document.querySelector('#rel [data-relhit]'), null, { timeout: 20000 }).catch(() => { });
      const s0 = await ev(page, () => {
        var s = relHitSession(CURP, RUN.id), r = compute();
        return { saved: RUN.saved, items: s ? s.items.length : -1, states: s ? s.items.map(function (x) { return x.state; }) : [],
          hits: relHitCount(CURP).hits, btn: document.querySelectorAll('#rel [data-relhit]').length,
          pressed: document.querySelectorAll('#rel [data-relhit][aria-pressed="true"]').length,
          n: (document.getElementById('relhitn') || {}).textContent || null, cq: r.CQ, dq: r.DQ, log: CURP.relhit ? CURP.relhit.log.length : 0 };
      });
      ok(s0.saved && s0.items > 0 && s0.states.every(x => x === 'shown'), '8. a release that ran presents its patterns as shown, none as a hit: ' + J({ items: s0.items, states: s0.states.slice(0, 4) }));
      ok(s0.hits === 0 && s0.log === 1, '8. and the record counts no hit for the run itself, one execute line: ' + J({ hits: s0.hits, log: s0.log }));
      ok(s0.btn === s0.items * 3 && s0.pressed === 0, '8. each presented pattern has Hit, Hold and Not a hit, none pressed: ' + J({ btn: s0.btn, items: s0.items }));
      ok(/^No hits marked/.test(s0.n || ''), '8. the card says no hits are marked: ' + J(s0.n));
      /* the first pattern's Hit, through the real control, twice */
      const first = await ev(page, () => { var b = document.querySelector('#rel [data-relhit][data-relcmd="hit"]'); return b ? b.getAttribute('data-relhit') : null; });
      if (typeof first !== 'string') { ok(false, '8. there is a Hit control to press: ' + J(first)); await ctx.close(); continue; }
      await page.click('#rel [data-relhit="' + first + '"][data-relcmd="hit"]');
      const s1 = await ev(page, p => ({ hits: relHitCount(CURP).hits, st: relHitState(CURP, RUN.id, p), log: CURP.relhit.log.length,
        pressed: (document.querySelector('#rel [data-relhit="' + p + '"][data-relcmd="hit"]') || {}).getAttribute('aria-pressed'),
        n: (document.getElementById('relhitn') || {}).textContent || null }), first);
      ok(s1.hits === 1 && s1.st === 'confirmed' && s1.pressed === 'true', '8. a press of Hit is one confirmed hit, shown pressed: ' + J(s1));
      ok(/^1 hit marked on your record/.test(s1.n || ''), '8. and the card\'s count reads the record: ' + J(s1.n));
      await page.click('#rel [data-relhit="' + first + '"][data-relcmd="hit"]');
      const s2 = await ev(page, () => ({ hits: relHitCount(CURP).hits, log: CURP.relhit.log.length }));
      ok(s2.hits === 1 && s2.log === s1.log, '8. a second press of Hit writes nothing and counts nothing: ' + J({ before: s1.log, after: s2.log }));
      /* the same event delivered twice, the retry case */
      const s3 = await ev(page, p => { var n0 = CURP.relhit.log.length;
        var a = relHitPress(p, 'hold', 'rh_gate_replay_0001'), n1 = CURP.relhit.log.length;
        var b = relHitPress(p, 'hold', 'rh_gate_replay_0001'), n2 = CURP.relhit.log.length;
        relHitPress(p, 'hit', 'rh_gate_replay_0002');
        return { a: a, b: b, n0: n0, n1: n1, n2: n2, hits: relHitCount(CURP).hits }; }, first);
      ok(s3.a && s3.b && s3.n1 === s3.n0 + 1 && s3.n2 === s3.n1 && s3.hits === 1, '8. one event id delivered twice is written once: ' + J(s3));
      /* Not a hit on another pattern sets it aside and counts nothing */
      const second = await ev(page, p => { var b = [].slice.call(document.querySelectorAll('#rel [data-relhit][data-relcmd="reject"]')).filter(function (x) { return x.getAttribute('data-relhit') !== p; })[0];
        return b ? b.getAttribute('data-relhit') : null; }, first);
      if (second) {
        await page.click('#rel [data-relhit="' + second + '"][data-relcmd="reject"]');
        const s4 = await ev(page, p => ({ hits: relHitCount(CURP).hits, st: relHitState(CURP, RUN.id, p),
          off: !!document.querySelector('#rel [data-relrow="' + p + '"].rel-rh-off') }), second);
        ok(s4.hits === 1 && s4.st === 'rejected' && s4.off, '8. Not a hit sets the pattern aside and counts nothing: ' + J(s4));
      }
      const s5 = await ev(page, () => { var r = compute(); return { cq: r.CQ, dq: r.DQ, log: CURP.relhit.log.slice() }; });
      ok(s5.cq === s0.cq && s5.dq === s0.dq, '8. no mark moves CQ or DQ: ' + J({ cq: [s0.cq, s5.cq], dq: [s0.dq, s5.dq] }));
      await ev(page, () => { var c = document.getElementById('relclose'); if (c) c.click(); });
      await page.reload({ waitUntil: 'load' }); await booted(page);
      const back = await ev(page, () => ({ hits: relHitCount(CURP).hits, log: CURP.relhit ? CURP.relhit.log : null }));
      ok(back.hits === 1 && J(back.log) === J(s5.log), '8. a reload reads the same one hit and the same log: ' + J({ hits: back.hits, log: back.log && back.log.length, was: s5.log.length }));
      ok(errs.length === 0, '8. no page error' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
      await ctx.close();
    }
  }
  await browser.close();
  done();
})().catch(e => { ok(false, 'the run threw: ' + (e && e.stack || e)); done(); });

function done() {
  console.log('\n===== ' + PASS + ' passed, ' + FAIL + ' failed =====');
  process.exit(FAIL ? 1 : 0);
}
