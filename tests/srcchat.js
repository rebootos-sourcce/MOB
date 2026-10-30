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
   never asks the same why twice; that Move on still ends the asking; and
   that a committed conversation keeps exactly what the entry keeps, a kind
   and a seat per question and never a question's words.

   THE THREAD PRINTS EVERY TURN NOW, round of 29 October: see the ruling at
   srcThread in ui/storyui.js. The ring design held only the last Source AI
   turn to a question on screen and this file once held a known bad copy
   proving the probe would catch a build that printed every earlier one; a
   text window is read top to bottom like any other, so printing every turn
   is the rule now and that known bad copy is gone with the rule it tested.

   CHECKED AGAINST A KNOWN BAD COPY FIRST, the standing rule. A page whose
   send joins a reply with a space, where the first turn's "not" reaches
   into the next: the boundary check must fail on it. A gate that passes a
   broken page is not a gate.

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
   toggle only exist during a crisis now, never in this file's own flow.
   THE REPLY LINE IS GONE TOO, round of 29 October: #stcin and #stcsend
   stood for typing a reply by hand, and voice is the only door a turn
   comes through now (srcTurnCommit, stMic in ui/storyui.js). mic reads for
   the one door that is left. */
const look = p => p.evaluate(() => {
  const rows = [...document.querySelectorAll('#stsrc .src-tn')];
  return {
    text: ST_TEXT,
    rows: rows.map(li => ({ cls: li.className.replace('src-tn ', ''), say: li.textContent.trim() })),
    now: rows.filter(li => li.classList.contains('src-tn-now')).length,
    pastWords: rows.filter(li => li.classList.contains('src-tn-past')).map(li => li.textContent.trim()).filter(Boolean),
    asks: SRC_CHAT.filter(r => r.key && r.key.indexOf('ask|') === 0).length,
    /* ROUND SK: every ask on the thread and whether it passes the ten
       checks of engine/qcheck.js, read in the page against the page's own
       entry and ledger, so the gate holds what is on screen and not a copy */
    askQs: SRC_CHAT.filter(r => r.key && r.key.indexOf('ask|') === 0).map(r => r.q),
    vet: SRC_VET ? { ok: SRC_VET.ok, q: SRC_VET.q, tried: SRC_VET.tried.length } : null,
    top: STR.heard && STR.heard.top ? { seat: STR.heard.top.seat, m: STR.heard.top.mentions, n: STR.heard.top.negated, rung: STR.heard.top.rung } : null,
    move: srcTurn(STR.heard, { typed: !!ST_TEXT.trim(), passed: SRC_PASSED }).move,
    pass: !!document.getElementById('srcpass'),
    box: !!document.getElementById('sttext'), mic: !!document.getElementById('stmic'),
    toggle: !!document.getElementById('sttalk'),
    /* THE DAISY CHAIN IS GONE, round of 29 October: no node, no wire, no
       pulse, a bubble each side instead (see the ruling at srcThread in
       ui/storyui.js). wires reads for the old markup being truly gone;
       meSide and srcSide read which edge each row's bubble actually sits
       on, geometry and not a guess from a class name. */
    wires: document.querySelectorAll('#stsrc .src-tw, #stsrc .src-nd, #stsrc .src-puls').length,
    meSide: [...document.querySelectorAll('#stsrc .src-tn-me .src-bub')].map(b => {
      const r = b.getBoundingClientRect(), p = b.closest('.src-th').getBoundingClientRect();
      return (p.right - r.right) < (r.left - p.left); }),
    srcSide: [...document.querySelectorAll('#stsrc .src-tn-now .src-bub, #stsrc .src-tn-past .src-bub')].map(b => {
      const r = b.getBoundingClientRect(), p = b.closest('.src-th').getBoundingClientRect();
      return (r.left - p.left) < (p.right - r.right); }),
    said: (document.getElementById('srcsay') || {}).textContent || ''
  };
});
/* A TURN NOW LANDS BY VOICE ONLY, round of 29 October. No real microphone
   here: a stand-in SpeechRecognition fires one finalised result, the exact
   shape stMic reads a sentence off of (see the same stand-in at tests/
   functional.js, "a sentence does not disappear at a pause"). The mic is
   started once and left listening across every say() in a run, the way a
   real conversation runs one recording through many sentences, not a
   start and stop per word. */
const say = async (p, t) => {
  await p.evaluate(text => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      function FakeSR() {}
      FakeSR.prototype.start = function () {};
      FakeSR.prototype.stop = function () { if (this.onend) this.onend(); };
      window.SpeechRecognition = FakeSR;
    }
    if (!ST_LISTEN) stMic();
    ST_REC.onresult({ resultIndex: 0, results: { 0: { 0: { transcript: text }, isFinal: true, length: 1 }, length: 1 } });
  }, t);
  await p.waitForTimeout(250);
};

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
      srcTurnCommit = function (v) {
        v = String(v || '').trim(); if (!v) return false;
        srcChatSync(); const base = ST_TEXT, a = base.length + (base ? 1 : 0);
        ST_TEXT = base + (base ? ' ' : '') + v; SRC_CHAT.push({ w: 'me', a: a, b: ST_TEXT.length, t: v });
        ST_PARSED = parseStory(ST_TEXT); stRefresh(); return true; }; });
    /* a finalised chunk calls srcTurnCommit by name, so this is the one it reaches */
    await say(p, 'I did not sleep'); await say(p, 'afraid all night.');
    const b = await look(p);
    ok(!(b.top && b.top.m === 1 && b.top.n === 0), 'the boundary check catches a space join: top ' + JSON.stringify(b.top));
    await p.cx.close();
  }

  /* KNOWN BAD, round SK: a page whose ask skips the ten checks, srcAsk's own
     line straight to the screen. The checks above must fail on it. */
  console.log('\n=== known bad first: an ask that skips the question check ===');
  {
    const p = await open(browser, 1600, 1000);
    await p.evaluate(() => { srcAskVetted = function (turn, heard) { SRC_VET = null; return srcAsk(turn, heard && heard.top && heard.top.words); }; });
    const { c, d } = await talk(p);
    ok(!(c.vet && c.vet.ok) && d.askQs.some(q => /Why there|takes you back|bottom of it/.test(q)),
      'the check catches an unchecked ask: ' + JSON.stringify(d.askQs));
    await p.cx.close();
  }

  console.log('\n=== the conversation at 1600 by 1000 ===');
  const p = await open(browser, 1600, 1000);
  const { a, b, c, d } = await talk(p, 'talk-1600-open.png');
  ok(!a.toggle && !a.box && a.mic, 'Record is there from the start, with no toggle and no write box to press instead of it');
  const open1 = await p.evaluate(() => srcOpen());
  ok(a.rows.length === 1 && a.now === 1 && a.rows[0].say.indexOf(open1) === 0, 'an empty entry opens on the opener, one row: ' + JSON.stringify(a.rows[0] && a.rows[0].say.slice(0, 60)));
  ok(b.text === 'I did not sleep\nafraid all night.', 'each reply is appended to the one entry on its own line: ' + JSON.stringify(b.text));
  ok(b.top && b.top.seat && b.top.m === 1 && b.top.n === 0, 'the first turn\'s "not" stops at the turn: afraid heard once, not negated, ' + JSON.stringify(b.top));
  const alone = await p.evaluate(() => { const h = srcHear('afraid all night.', null).top; return h && { seat: h.seat, rung: h.rung }; });
  ok(alone && b.top.seat === alone.seat && b.top.rung === alone.rung, 'and it reads what the reply reads alone, ' + JSON.stringify(alone));
  ok(c.move === 'ask' && c.pass && c.top.rung >= 7, 'the seat coming back across turns is asked about, rung ' + (c.top && c.top.rung));
  ok(c.said && c.rows.filter(x => x.cls === 'src-tn-now')[0].say.indexOf(c.said) === 0, 'the screen reader line carries the live turn: ' + JSON.stringify(c.said.slice(0, 70)));
  ok(d.now === 1 && d.pastWords.length > 0 && d.pastWords.every(Boolean), 'a text window, not a ring: every earlier Source AI turn still reads in full, ' + d.pastWords.length + ' with words');
  /* ROUND SK. This read d.asks === 1, "an answer to the ask does not ask
     the same why again", which held while the ask could only ever be the
     same why rewritten in place. Every ask now goes through the ten checks
     (srcAskVetted, ui/storyui.js), and a question the person has replied
     under counts as asked, so the turn after an answer is a new question.
     What the old line protected still holds, harder: no question twice. */
  const qOf = x => x.slice(x.lastIndexOf('. ') + 2);
  ok(d.asks >= 1 && new Set(d.askQs.map(qOf)).size === d.askQs.length, 'an answer to the ask is never followed by the same question again: ' + JSON.stringify(d.askQs));
  const firstAsk = c.rows.filter(x => x.cls === 'src-tn-now')[0].say;
  ok(d.askQs[0] && firstAsk.indexOf(d.askQs[0]) === 0, 'and the question the person answered is not rewritten under their answer: ' + JSON.stringify([firstAsk.slice(0, 50), d.askQs[0] && d.askQs[0].slice(0, 50)]));
  ok(c.vet && c.vet.ok && c.rows.filter(x => x.cls === 'src-tn-now')[0].say.indexOf(c.vet.q) === 0,
    'the ask on screen is the one that passed the ten checks: ' + JSON.stringify(c.vet));
  ok(d.askQs.every(q => !/Why there|takes you back|bottom of it/.test(q)), 'and no ask on the thread is a why: ' + JSON.stringify(d.askQs));
  const fams = await p.evaluate(() => SRC_CHAT.filter(r => r.key && r.key.indexOf('ask|') === 0).map(r => qcFamilyOf(r.q)));
  ok(fams.every((f, i) => i === 0 || f !== fams[i - 1]), 'two asks in a row are never the same family, section 22: ' + JSON.stringify(fams));
  ok(d.askQs.slice(1).every(q => q.indexOf('You wrote') < 0), 'and the mirror is said once a seat, the next ask is the question alone: ' + JSON.stringify(d.askQs));
  const reVet = await p.evaluate(() => SRC_CHAT.filter(r => r.key && r.key.indexOf('ask|') === 0).map(r =>
    srcVet({ q: r.q, family: 'probe', target: STR.heard.top.seat }, { text: ST_TEXT, ledger: srcLedgerNow() }).fails.filter(f => [1, 2, 3, 4, 5, 6, 7].indexOf(f.n) >= 0).map(f => f.n)));
  ok(reVet.every(f => !f.length), 'every ask on the thread still passes points one to seven against the whole entry: ' + JSON.stringify(reVet));
  const me = d.rows.filter(x => x.cls === 'src-tn-me').map(x => x.say);
  ok(me.join('|') === 'I did not sleep|afraid all night.|Still afraid when he called.|I am afraid of what he says next.', 'every reply stands in the thread in the person\'s words');
  ok(d.wires === 0, 'the daisy chain is gone: no node, no wire, no pulse in the markup, ' + d.wires + ' found');
  ok(d.meSide.length && d.meSide.every(Boolean), 'every reply sits on the right, a bubble each: ' + JSON.stringify(d.meSide));
  ok(d.srcSide.length && d.srcSide.every(Boolean), 'every Source AI turn sits on the left, a bubble each: ' + JSON.stringify(d.srcSide));
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

  /* commit, the moment after the last sentence lands. There is no reply
     left sitting unsent any more, round of 29 October: a spoken sentence
     is already a turn in ST_TEXT the instant it finalises (srcTurnCommit),
     so Commit here finishes an entry that already carries every word. */
  await say(p, 'Then I left.');
  const parity = await p.evaluate(() => srcAsked(SRC_LOG, ST_TEXT.length));
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

  /* ROUND SK, REPRODUCED FIRST: one seat talked about long enough runs every
     family question once, and the turn after that drew an empty bubble. It
     says the document's Space, "Keep writing.", and never nothing. */
  console.log('\n=== a long conversation about one seat ===');
  {
    const q = await open(browser, 1600, 1000);
    const said = ['I was afraid all night.', 'Still afraid.', 'afraid of him.', 'afraid again.', 'so afraid.', 'afraid today.', 'afraid now.',
      'afraid still.', 'afraid, afraid.', 'afraid at work.', 'afraid at home.', 'afraid in bed.', 'afraid when he called.', 'afraid all day.'];
    for (const t of said) { await q.evaluate(t => srcTurnCommit(t), t); await q.waitForTimeout(60); }
    const rows = await q.evaluate(() => SRC_CHAT.filter(r => r.w === 'src').map(r => r.q));
    ok(rows.every(r => String(r || '').trim()), 'no Source AI turn is ever empty: ' + JSON.stringify(rows.map(r => String(r).slice(-30))));
    ok(rows[rows.length - 1] === 'Keep writing.', 'and when every question has been asked it says the document\'s Space: ' + JSON.stringify(rows[rows.length - 1]));
    ok(!q.errs.length, 'no page errors in that run: ' + q.errs.join(' | '));
    await q.cx.close();
  }

  /* ROUND SK, the seam package's VENT, MOVE_ON and CORRECT, said and not
     pressed. Its own vectors: "I just want to vent", "I don't want to talk
     about it anymore", "No, that interpretation doesn't fit me". Before
     this, each was read as more story and the next question came. */
  console.log('\n=== the person says what they want from the conversation ===');
  {
    const row = q => q.evaluate(() => { const r = SRC_CHAT.filter(x => x.w === 'src'); return r[r.length - 1]; });
    const asking = async (q) => { for (const t of ['I was afraid all night.', 'Still afraid.']) { await q.evaluate(t => srcTurnCommit(t), t); await q.waitForTimeout(80); } };
    let q = await open(browser, 1600, 1000);
    await asking(q); const was = await row(q);
    await q.evaluate(t => srcTurnCommit(t), "No, that interpretation doesn't fit me"); await q.waitForTimeout(120);
    const st = await q.evaluate(() => ({ v: SRC_VERDICTS, s: srcLedgerNow().claims.root && srcLedgerNow().claims.root.state }));
    await q.evaluate(t => srcTurnCommit(t), 'afraid again'); await q.waitForTimeout(120);
    const after = await row(q);
    ok(/^ask\|/.test(was.key) && st.s === 'rejected', 'a no said in words lands as a no on the seat it was asking about: ' + JSON.stringify(st));
    ok(!/^ask\|root/.test(after.key), 'and that seat is not asked about again, however often it comes back: ' + JSON.stringify(after.q));
    await q.cx.close();
    q = await open(browser, 1600, 1000);
    await asking(q);
    await q.evaluate(t => srcTurnCommit(t), "I don't want to talk about it anymore"); await q.waitForTimeout(120);
    const mv = await q.evaluate(() => ({ passed: SRC_PASSED, last: SRC_CHAT.filter(x => x.w === 'src').pop().q, log: SRC_LOG.map(r => r.moved) }));
    ok(mv.passed && mv.last === 'Cool.' && mv.log.some(Boolean), 'asking to stop in words is Move on: "Cool.", and the entry keeps that the person moved on, ' + JSON.stringify(mv));
    await q.cx.close();
    q = await open(browser, 1600, 1000);
    await q.evaluate(t => srcTurnCommit(t), 'I just want to vent'); await q.waitForTimeout(80);
    await asking(q);
    const vn = await q.evaluate(() => ({ rows: SRC_CHAT.filter(x => x.w === 'src').map(x => x.q), open: srcOpen(), line: SRC_LISTENING }));
    ok(vn.rows.slice(1).length && vn.rows.slice(1).every(x => x === vn.line) && vn.rows[0] === vn.open,
      'asking to vent is listened to and asked nothing, even when a seat comes back: ' + JSON.stringify(vn.rows));
    ok(!q.errs.length, 'no page errors in those runs: ' + q.errs.join(' | '));
    await q.cx.close();
  }

  console.log('\n=== the conversation at 390 by 844, reduced motion ===');
  {
    const q = await open(browser, 390, 844, { reducedMotion: 'reduce' });
    await talk(q);
    const z = await look(q);
    ok(z.wires === 0, 'the daisy chain is gone at 390 too, nothing left for reduced motion to quiet: ' + z.wires + ' found');
    const fit = await q.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: innerWidth }));
    ok(fit.sw <= fit.w, 'no sideways scroll at 390: ' + fit.sw + ' of ' + fit.w);
    /* Talk is gone, round of 28 October, and the reply line and its send are
       gone with the text field, round of 29 October: Record stands on its
       own, the one door, and is still tap sized. */
    const mic = await q.evaluate(() => { const r = document.getElementById('stmic').getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) }; });
    ok(mic.w >= 44 && mic.h >= 44, 'Record is tap sized on its own: ' + JSON.stringify(mic));
    await q.evaluate(() => { const t = document.querySelector('#stjr'); t.scrollIntoView(); });
    await shot(q, 'talk-390-ask.png');
    ok(!q.errs.length, 'no page errors at 390: ' + q.errs.join(' | '));
    await q.cx.close();
  }

  await browser.close();
  console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed =====');
  if (fails.length) { fails.forEach(f => console.log('  FAIL  ' + f)); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
