#!/usr/bin/env node
/* ============================================================
   THE CONVERSATION, IN A REAL BROWSER. PLAN.md section C item 4, carried
   forward round of 28 October: the Journal is conversation only now, STV.chat
   is forced true and the Talk button that used to toggle it is gone (his
   words: "this needs to be a two-way conversation between me and the
   source"). What this file held about the toggle itself (Talk off on
   arrival, pressing it to swap the box for the line, pressing it again to
   swap back and keep what was typed) is gone with the button: there is
   nothing left to toggle, so nothing here presses one.
   NODE_PATH=/opt/node22/lib/node_modules node tests/srcchat.js
   SHOTS=dir  also writes the screenshots a person looks at

   What still holds, because none of it was ever about the toggle: that a
   reply really is appended to the one entry, on a line of its own, so the
   reading is the reading a single block of text would give; that the thread
   shows one question and never asks the same why twice; that Move on still
   ends the asking; and that a committed conversation keeps exactly what the
   entry keeps, a kind and a seat per question and never a question's words.

   CHECKED AGAINST TWO KNOWN BAD COPIES FIRST, the standing rule. One page
   whose send joins a reply with a space, where the first turn's "not"
   reaches into the next: the boundary check must fail on it. One whose
   thread prints every earlier question: the one question check must fail on
   it. A gate that passes a broken page is not a gate.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const path = require('path');
const { chromium } = require('playwright');
/* ?dev=1 meets the instrument and not the login sheet, as functional.js does */
const FILE = 'file://' + path.resolve(process.env.ATUNED_FILE || path.join(__dirname, '..', 'source.html')) + '?dev=1';
const SHOTS = process.env.SHOTS || '';

let n = 0; const fails = [];
const ok = (c, m) => { n++; if (!c) fails.push(m); console.log((c ? '  ok    ' : '  FAIL  ') + m); };
/* booted, and the opening sheet closed the way a person closes it, as
   functional.js's own booted does */
const booted = async p => {
  await p.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(600);
  await p.evaluate(() => { if (typeof OB !== 'undefined' && OB.open && typeof obClose === 'function') obClose(); }).catch(() => {});
  await p.waitForTimeout(120); };
const shot = async (p, nm) => { if (SHOTS) { await p.mouse.move(1, 1); await p.waitForTimeout(1800); await p.screenshot({ path: path.join(SHOTS, nm) }); console.log('  shot  ' + nm); } };

/* the thread as a person sees it, and the state behind it. box and pressed
   read for what is no longer there (#sttext, #sttalk): on arrival and
   through the whole run both must read absent, since the plain box and its
   toggle only exist during a crisis now, never in this file's own flow. */
const look = p => p.evaluate(() => {
  const rows = [...document.querySelectorAll('#stsrc .src-tn')];
  return {
    text: ST_TEXT,
    rows: rows.map(li => ({ cls: li.className.replace('src-tn ', ''), say: li.textContent.trim() })),
    now: rows.filter(li => li.classList.contains('src-tn-now')).length,
    pastWords: rows.filter(li => li.classList.contains('src-tn-past')).map(li => li.textContent.trim()).filter(Boolean),
    asks: SRC_CHAT.filter(r => r.key && r.key.indexOf('ask|') === 0).length,
    top: STR.heard && STR.heard.top ? { seat: STR.heard.top.seat, m: STR.heard.top.mentions, n: STR.heard.top.negated, rung: STR.heard.top.rung } : null,
    move: srcTurn(STR.heard, { typed: !!ST_TEXT.trim(), passed: SRC_PASSED }).move,
    pass: !!document.getElementById('srcpass'),
    box: !!document.getElementById('sttext'), line: !!document.getElementById('stcin'),
    toggle: !!document.getElementById('sttalk'),
    ts: [...document.querySelectorAll('#stsrc .src-tw')].map(s => +s.getAttribute('data-t')),
    puls: [...document.querySelectorAll('#stsrc .src-puls')].map(e => ({ an: getComputedStyle(e).animationName, d: e.getAttribute('d') || '', disp: getComputedStyle(e).display })),
    said: (document.getElementById('srcsay') || {}).textContent || ''
  };
});
const say = async (p, t) => { await p.fill('#stcin', t); await p.press('#stcin', 'Enter'); await p.waitForTimeout(250); };

async function open(browser, w, h, opt) {
  const cx = await browser.newContext(Object.assign({ viewport: { width: w, height: h } }, opt || {}));
  const p = await cx.newPage();
  p.errs = []; p.on('pageerror', e => p.errs.push(String(e && e.message || e)));
  await p.goto(FILE, { waitUntil: 'load' }); await booted(p);
  await p.evaluate(() => { setTab(TAB.STORY); render(); });
  await p.waitForTimeout(500);
  p.cx = cx; return p;
}

/* the conversation every check below walks: a negation that must not reach
   across a turn, a seat that comes back across turns until it is asked
   about, and an answer to that ask that must not raise a second one. The
   conversation is the Journal's only state now, so there is no toggle to
   press first; a is the state the moment the page opens. */
async function talk(p, nm) {
  const a = await look(p);
  if (nm) await shot(p, nm);
  await say(p, 'I did not sleep');
  await say(p, 'afraid all night.');
  const b = await look(p);
  await say(p, 'Still afraid when he called.');
  const c = await look(p);
  await say(p, 'I am afraid of what he says next.');
  const d = await look(p);
  return { a, b, c, d };
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
require('./net.js').guardBrowser(browser);

  console.log('\n=== known bad first: a send that joins with a space ===');
  {
    const p = await open(browser, 1600, 1000);
    await p.evaluate(() => {
      srcChatSend = function () {
        const cin = document.getElementById('stcin'), v = cin.value.trim(); if (!v) return false;
        srcChatSync(); const base = ST_TEXT, a = base.length + (base ? 1 : 0);
        ST_TEXT = base + (base ? ' ' : '') + v; SRC_CHAT.push({ w: 'me', a: a, b: ST_TEXT.length, t: v });
        cin.value = ''; ST_PARSED = parseStory(ST_TEXT); stRefresh(); return true; }; });
    /* the line calls srcChatSend by name when Enter lands, so this is the one it reaches */
    await say(p, 'I did not sleep'); await say(p, 'afraid all night.');
    const b = await look(p);
    ok(!(b.top && b.top.m === 1 && b.top.n === 0), 'the boundary check catches a space join: top ' + JSON.stringify(b.top));
    await p.cx.close();
  }

  console.log('\n=== known bad first: a thread that prints every question ===');
  {
    const p = await open(browser, 1600, 1000);
    const r = await talk(p);
    const bad = await p.evaluate(() => {
      /* every Source AI row carrying its words, the defect the rule is for */
      [...document.querySelectorAll('#stsrc .src-tn-past')].forEach((li, i) => {
        const q = SRC_CHAT.filter(x => x.w === 'src')[i]; if (q) li.insertAdjacentHTML('beforeend', '<p class="src-q">' + q.q + '</p>'); });
      return [...document.querySelectorAll('#stsrc .src-tn-past')].map(li => li.textContent.trim()).filter(Boolean).length; });
    ok(bad > 0, 'the one question check catches a thread printing earlier questions, ' + bad + ' found');
    await p.cx.close();
  }

  console.log('\n=== the conversation at 1600 by 1000 ===');
  const p = await open(browser, 1600, 1000);
  const { a, b, c, d } = await talk(p, 'talk-1600-open.png');
  ok(!a.toggle && !a.box && a.line, 'the reply line is there from the start, with no toggle and no write box to press it from');
  const open1 = await p.evaluate(() => srcOpen());
  ok(a.rows.length === 1 && a.now === 1 && a.rows[0].say.indexOf(open1) === 0, 'an empty entry opens on the opener, one row: ' + JSON.stringify(a.rows[0] && a.rows[0].say.slice(0, 60)));
  ok(b.text === 'I did not sleep\nafraid all night.', 'each reply is appended to the one entry on its own line: ' + JSON.stringify(b.text));
  ok(b.top && b.top.seat && b.top.m === 1 && b.top.n === 0, 'the first turn\'s "not" stops at the turn: afraid heard once, not negated, ' + JSON.stringify(b.top));
  const alone = await p.evaluate(() => { const h = srcHear('afraid all night.', null).top; return h && { seat: h.seat, rung: h.rung }; });
  ok(alone && b.top.seat === alone.seat && b.top.rung === alone.rung, 'and it reads what the reply reads alone, ' + JSON.stringify(alone));
  ok(c.move === 'ask' && c.pass && c.top.rung >= 7, 'the seat coming back across turns is asked about, rung ' + (c.top && c.top.rung));
  ok(c.said && c.rows.filter(x => x.cls === 'src-tn-now')[0].say.indexOf(c.said) === 0, 'the screen reader line carries the live turn: ' + JSON.stringify(c.said.slice(0, 70)));
  ok(d.now === 1 && d.pastWords.length === 0, 'one question on screen: every earlier Source AI turn is its ring, ' + d.pastWords.length + ' with words');
  ok(d.asks === 1, 'an answer to the ask does not ask the same why again: ' + d.asks + ' ask rows');
  const me = d.rows.filter(x => x.cls === 'src-tn-me').map(x => x.say);
  ok(me.join('|') === 'I did not sleep|afraid all night.|Still afraid when he called.|I am afraid of what he says next.', 'every reply stands in the thread in the person\'s words');
  ok(d.ts.length === d.rows.length - 1 && d.ts.some(t => t >= 0.7) && d.ts[0] < 0.7, 'a wire under every row but the last, tightening to the rung: ' + d.ts.join(' '));
  ok(d.puls.length && d.puls.every(x => x.an === 'frflow' && /^M12 0Q/.test(x.d)), 'every wire carries a pulse on frflow, laid after the rows: ' + d.puls.length);
  await shot(p, 'talk-1600-ask.png');

  /* move on, and a reply after it */
  await p.click('#srcpass'); await p.waitForTimeout(250);
  const e = await look(p);
  ok(e.move === 'pass' && e.rows.filter(x => x.cls === 'src-tn-now')[0].say.indexOf('Cool.') === 0 && !e.pass, 'Move on says "Cool." and the ask folds to its ring');
  await say(p, 'Afraid, afraid, afraid.');
  const f = await look(p);
  ok(f.move === 'pass' && f.rows.filter(x => x.cls !== 'src-tn-me').length === e.rows.filter(x => x.cls !== 'src-tn-me').length, 'after Move on it says nothing more, however much more it hears');
  await shot(p, 'talk-1600-pass.png');
  if (SHOTS) {
    /* the light lighting, through its own button, the way tools/shots.js takes it */
    await p.evaluate(() => { const b = [...document.querySelectorAll('#themes button')].find(x => /snow/i.test(x.getAttribute('aria-label') || x.textContent)); if (b) b.click(); });
    await shot(p, 'talk-1600-pass-snow.png');
    await p.evaluate(() => { const b = [...document.querySelectorAll('#themes button')].find(x => /dark/i.test(x.getAttribute('aria-label') || x.textContent)); if (b) b.click(); });
  }

  /* commit, with a reply still in the line */
  await p.fill('#stcin', 'Then I left.');
  const parity = await p.evaluate(() => srcAsked(SRC_LOG, (ST_TEXT + '\nThen I left.').length));
  await p.click('#stapply'); await p.waitForTimeout(600);
  const g = await p.evaluate(() => { const es = CURP.story.entries, x = es[es.length - 1];
    return { x, keys: Object.keys(x).sort(), chat: SRC_CHAT.length, text: ST_TEXT, json: JSON.stringify(CURP) }; });
  ok(g.x.text === 'I did not sleep\nafraid all night.\nStill afraid when he called.\nI am afraid of what he says next.\nAfraid, afraid, afraid.\nThen I left.',
    'Commit sends the reply still in the line, and the entry is the whole conversation\'s own words: ' + JSON.stringify(g.x.text.slice(-24)));
  ok(g.keys.join(',') === 'asked,bands,imprints,lex,t,text', 'the entry keeps exactly what a box entry keeps: ' + g.keys.join(','));
  ok(JSON.stringify(g.x.asked) === JSON.stringify(parity) && g.x.asked.every(q => Object.keys(q).sort().join(',') === 'a,k,seat'),
    'what Source AI asked is a kind, a seat and what the person did, and nothing else: ' + JSON.stringify(g.x.asked));
  ok(!/You wrote|It lands|Cool\.|What are we writing|Why there/.test(g.json), 'no line Source AI said is anywhere on the record');
  ok(g.chat === 1 && g.text === '', 'the thread goes with the entry: one row, the opener, on the next');

  /* the same entry written straight into ST_TEXT asks the same thing and
     keeps the same, which is the point of the gate and nothing about the
     toggle: asked is read off the finished text, not off how many turns
     the conversation took to reach it. The plain box only renders during a
     crisis now (crisisTalk, ui/crisis.js), so this reaches it the same way
     a crisis does, STV.chat=false, rather than through the ordinary flow. */
  {
    const q = await open(browser, 1600, 1000);
    await q.evaluate(() => { STV.chat = false; setTab(TAB.STORY); render(); });
    await q.waitForTimeout(200);
    await q.fill('#sttext', g.x.text.split('\nThen I left.')[0].split('\nAfraid, afraid')[0]);
    await q.waitForTimeout(300);
    await q.click('#srcpass'); await q.waitForTimeout(150);
    await q.fill('#sttext', g.x.text); await q.waitForTimeout(300);
    await q.click('#stapply'); await q.waitForTimeout(600);
    const box = await q.evaluate(() => { const es = CURP.story.entries; return es[es.length - 1].asked; });
    ok(JSON.stringify(box) === JSON.stringify(g.x.asked), 'the same words written straight into the entry keep the same asked: ' + JSON.stringify(box));
    ok(!q.errs.length, 'no page errors in that run: ' + q.errs.join(' | '));
    await q.cx.close();
  }

  /* THE TOGGLE ROUND TRIP IS GONE WITH THE TOGGLE, round of 28 October. This
     used to hold that pressing Talk off put the thread's words back in the
     plain box, that text added there became the next turn, and that editing
     an earlier turn in the box restarted the thread from the entry. None of
     that has a door any more: there is one box, the reply line, and it is
     never swapped for another. */
  ok(!p.errs.length, 'no page errors at 1600: ' + p.errs.join(' | '));
  await p.cx.close();

  console.log('\n=== the conversation at 390 by 844, reduced motion ===');
  {
    const q = await open(browser, 390, 844, { reducedMotion: 'reduce' });
    await talk(q);
    const z = await look(q);
    ok(z.puls.length && z.puls.every(x => x.disp === 'none'), 'reduced motion keeps the wires and drops the pulses');
    const fit = await q.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: innerWidth,
      line: (() => { const r = document.getElementById('stcin').getBoundingClientRect(); return { top: r.top, h: r.height, w: r.width }; })(),
      send: (() => { const r = document.getElementById('stcsend').getBoundingClientRect(); return { w: r.width, h: r.height }; })() }));
    ok(fit.sw <= fit.w, 'no sideways scroll at 390: ' + fit.sw + ' of ' + fit.w);
    /* Talk is gone, round of 28 October: Record no longer shares its row
       with a second button, it stands on its own, and is still tap sized */
    const mic = await q.evaluate(() => { const r = document.getElementById('stmic').getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) }; });
    ok(mic.w >= 44 && mic.h >= 44, 'Record is tap sized on its own: ' + JSON.stringify(mic));
    ok(fit.send.w >= 44 && fit.send.h >= 44 && fit.line.h >= 44, 'the send and the line are tap sized: ' + JSON.stringify(fit));
    await q.evaluate(() => { const t = document.querySelector('#stjr'); t.scrollIntoView(); });
    await shot(q, 'talk-390-ask.png');
    ok(!q.errs.length, 'no page errors at 390: ' + q.errs.join(' | '));
    await q.cx.close();
  }

  await browser.close();
  console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed =====');
  if (fails.length) { fails.forEach(f => console.log('  FAIL  ' + f)); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
