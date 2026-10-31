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
   here: a stand-in SpeechRecognition, the exact shape stMic reads a sentence
   off of. The mic is started once and left listening across every say() in
   a run, the way a real conversation runs one recording through many
   sentences, not a start and stop per word.

   THAT LAST SENTENCE WAS NOT TRUE UNTIL 31 OCTOBER, and the gate never knew.
   The stand-in installed only `if (!window.SpeechRecognition &&
   !window.webkitSpeechRecognition)`, and headless Chromium carries a real
   webkitSpeechRecognition, so the stand-in never installed: the real
   recogniser started, failed in the sandbox, set ST_LISTEN false, and every
   say() pressed Talk again. Every turn was a fresh recording with a fresh
   greeting, so a reply that was never spoken read as spoken, and a person
   talking through one recording, his whole complaint, was never run
   (reviews/source-ai-conversation-diagnosis-2026-10-31.md, "A harness defect
   found first"). It is installed before the page loads now, over both names,
   whatever the browser has.

   AND IT KEEPS A RECORDING'S RESULTS THE WAY CHROME DOES. The old stand-in
   handed every sentence over as result 0 of a list of one. Chrome's
   continuous recognition keeps every result of one recording at its own
   index, and resultIndex points at the first one that changed, which is
   what the page's guard against a resent sentence reads. A start is a new
   recording with an empty list; abort ends it with the error 'aborted' and
   then onend, as Chrome's does. again() is the resend the diagnosis
   measured as a risk: the same finals delivered a second time from index 0,
   with a new one after them. */
const MIC = () => {
  function FakeSR() { FakeSR.made.push(this); this.on = false; this.results = []; this.log = []; }
  FakeSR.made = [];
  FakeSR.prototype.start = function () {
    if (this.on) throw new Error('InvalidStateError: recognition has already started');
    this.on = true; this.results = []; this.log.push('start'); };
  FakeSR.prototype._end = function () { if (!this.on) return; this.on = false; const s = this; setTimeout(() => { if (s.onend) s.onend(); }, 0); };
  FakeSR.prototype.stop = function () { this.log.push('stop'); this._end(); };
  FakeSR.prototype.abort = function () { this.log.push('abort'); if (this.on && this.onerror) this.onerror({ error: 'aborted' }); this._end(); };
  const fire = (r, from) => r.onresult({ resultIndex: from, results: Object.assign({ length: r.results.length }, r.results) });
  const fin = t => ({ 0: { transcript: t }, isFinal: true, length: 1 });
  const cur = () => FakeSR.made[FakeSR.made.length - 1];
  window.__mic = {
    FakeSR,
    live: () => !!(cur() && cur().on),
    say(t) { const r = cur(); if (!r || !r.on) return false; r.results.push(fin(t)); fire(r, r.results.length - 1); return true; },
    again(t) { const r = cur(); if (!r || !r.on) return false; r.results.push(fin(t)); fire(r, 0); return true; }
  };
  window.SpeechRecognition = FakeSR; window.webkitSpeechRecognition = FakeSR;
};
const say = async (p, t) => {
  const r = await p.evaluate(async text => {
    if (!ST_LISTEN) stMic();
    /* while Source AI speaks the recording is held, see stHush in
       ui/storyui.js, so a person waits for the reply to finish, as here */
    for (let i = 0; i < 120 && !__mic.live(); i++) await new Promise(r => setTimeout(r, 25));
    return __mic.say(text);
  }, t);
  await p.waitForTimeout(250);
  return r;
};
/* every line the page asks the voice for, read off the request itself. The
   route is answered by net.js with a short silent sound, so this is the real
   authVoice path, never a stand-in for it. */
const VOICE = /\.workers\.dev\/v1\/voice\/synthesize/;
const listenVoice = p => { p.voice = []; p.on('request', r => {
  if (VOICE.test(r.url()) && r.method() === 'POST') { try { p.voice.push(JSON.parse(r.postData()).text); } catch (e) { p.voice.push('?'); } } }); };

async function open(browser, w, h, opt) {
  const cx = await browser.newContext(Object.assign({ viewport: { width: w, height: h } }, opt || {}));
  await cx.addInitScript(MIC);
  const p = await cx.newPage();
  p.errs = []; p.on('pageerror', e => p.errs.push(String(e && e.message || e)));
  listenVoice(p);
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
  /* 31 October. This read "after Move on it says nothing more, however much
     more it hears", and held the thread to the same number of Source AI
     rows, which was the silence he met: a person who moved on and kept
     talking got no reply at all. The ruling it protected is srcTurn's own,
     engine/sourceai.js: after Move on it "asks nothing more in this entry,
     however much more it hears". Asks, not says. So the turn is answered,
     once, and the answer is not a question. */
  const fNew = f.rows.filter(x => x.cls !== 'src-tn-me').slice(e.rows.filter(x => x.cls !== 'src-tn-me').length);
  ok(f.move === 'pass' && fNew.length === 1 && fNew[0].say.indexOf('?') < 0 && !f.pass,
    'after Move on it asks nothing more, however much more it hears, and the turn is still answered: ' + JSON.stringify(fNew));
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
    /* 31 October. This read the last row as the Space, which held only
       because every turn after the first "Keep writing." carried its key
       and redrew that one bubble: four turns, one reply. Each turn is
       answered now, so the Space is said once the questions have run and
       every turn after it is listened to, never asked, and never with the
       line just said. */
    const sp = rows.indexOf('Keep writing.');
    ok(sp > 0 && rows.slice(sp).every(r => r.indexOf('?') < 0) && rows.every((r, i) => i === 0 || r !== rows[i - 1]),
      'and when every question has been asked it says the document\'s Space, then listens, asking nothing: ' + JSON.stringify(rows.slice(sp)));
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
    /* 31 October. This held every row after the opener to "I'm listening.",
       and passed because only one such row was ever drawn: the two turns
       after it carried the key vent and were the same bubble updated in
       place, silence for each. Every turn is answered now, and the rule
       that matters is the package's: listened to, nothing asked. */
    ok(vn.rows.length === 4 && vn.rows[0] === vn.open && vn.rows[1] === vn.line && vn.rows.slice(1).every(x => x.indexOf('?') < 0),
      'asking to vent is listened to and asked nothing, even when a seat comes back, a turn answered each time: ' + JSON.stringify(vn.rows));
    ok(!q.errs.length, 'no page errors in those runs: ' + q.errs.join(' | '));
    await q.cx.close();
  }

  /* ============================================================
     ONE RECORDING, A WHOLE CONVERSATION, 31 October. His session: "can you
     hear me" twice, and nothing back either time. The diagnosis
     (reviews/source-ai-conversation-diagnosis-2026-10-31.md) reproduced it
     with the stand-in above and found three causes: srcChatNote updated
     the last bubble in place whenever the new reply carried the same key,
     so a second turn of the same kind drew nothing; the voice spoke only
     the greeting; and nothing that was not a feeling word had a reply of
     its own. Each transcript it took is run here, through the one door a
     spoken sentence takes, and held to three things: every turn the person
     says gets exactly one new Source AI turn, no Source AI turn is word for
     word the one before it, and every new one is sent to the voice in its
     own words and nothing else.
     ============================================================ */
  const srcRows = p => p.evaluate(() => SRC_CHAT.filter(r => r.w === 'src').map(r => r.q));
  const shown = p => p.evaluate(() => document.querySelectorAll('#stsrc .src-tn-now, #stsrc .src-tn-past').length);
  /* says each line, and reads after each one what came back, on the record
     the thread keeps and on the screen */
  const run = async (p, lines) => {
    const out = [];
    for (const t of lines) {
      const a = await srcRows(p), sa = await shown(p);
      const heard = await say(p, t);
      const b = await srcRows(p), sb = await shown(p);
      out.push({ t, heard, added: b.length - a.length, onScreen: sb - sa, rows: b.slice(a.length) });
    }
    return out;
  };
  const oneEach = out => out.every(x => x.heard && x.added === 1 && x.onScreen === 1);
  const noRepeat = rows => rows.every((r, i) => i === 0 || r !== rows[i - 1]);
  const brief = out => JSON.stringify(out.map(x => [x.t, x.added, x.rows.map(r => String(r).slice(0, 48))]));
  const TR = {
    hear: ['Can you hear me?', 'Can you hear me?', 'Hello?'],
    hi: ['Hi.', 'How are you?', 'What is this?', 'Are you there?'],
    wife: ['I had a fight with my wife this morning and I felt sick about it all day.', 'She said I never listen and I just shut down.',
      'My chest got tight and I could not breathe properly.', 'I keep replaying it and I feel ashamed.', 'I am still ashamed tonight and I cannot sleep.'],
    yeah: ['I am angry at myself.', 'I am angry, really angry.', 'Yeah.', 'Yeah.'],
    vent: ['I am furious and humiliated, I am so angry.', 'I am still angry.', 'I just want to vent.', 'I am angry again.', 'I am angry again.'],
    shift: ['I am so afraid, I am afraid of losing my job.', 'Can we talk about something else?',
      'My brother has not called me in months and I feel abandoned.', 'I feel so abandoned and alone.'],
    instead: ['I am afraid of losing my job.', 'I am so afraid, my boss keeps cutting my hours.', 'Anyway, I want to talk about my brother instead.',
      'He has not called me in months and I feel abandoned.', 'I feel so abandoned and alone.']
  };

  /* KNOWN BAD FIRST. The page's own srcChatNote as it stood before this
     change, put back: same key as the last bubble, update it in place and
     add nothing. The one row per turn check must fail on it, or it is not
     a check. */
  console.log('\n=== known bad first: a reply with the same key updates the last bubble in place ===');
  {
    const q = await open(browser, 1600, 1000);
    await q.evaluate(() => { srcChatNote = function (cur) {
      var li = -1, after = false;
      SRC_CHAT.forEach(function (r, i) { if (r.w === 'src') { li = i; after = false; } else if (li >= 0) after = true; });
      var L = li >= 0 ? SRC_CHAT[li] : null;
      if (L && L.key === cur.key) { L.q = cur.q; L.mv = cur.mv; L.rg = cur.rg; L.bd = cur.bd; return; }
      if (L && !after && /^(open|q|say)\|/.test(L.key)) { SRC_CHAT[li] = cur; return; }
      SRC_CHAT.push(cur); }; });
    const out = await run(q, TR.hear);
    ok(!oneEach(out), 'the one row per turn check catches the in-place update: ' + brief(out));
    await q.cx.close();
  }

  console.log('\n=== one recording through his own conversation: "can you hear me", twice ===');
  {
    const q = await open(browser, 1600, 1000);
    const out = await run(q, TR.hear);
    const inst = await q.evaluate(() => ({ fake: ST_REC instanceof __mic.FakeSR, made: __mic.FakeSR.made.length, greet: srcOpen() }));
    ok(inst.fake && inst.made === 1, 'the stand-in microphone is the one recording, installed over what headless Chromium carries: ' + JSON.stringify(inst));
    ok(oneEach(out), 'every turn he says gets exactly one new Source AI turn, on the record and on the screen: ' + brief(out));
    const rows = await srcRows(q);
    ok(noRepeat(rows), 'and no Source AI turn is word for word the one before it: ' + JSON.stringify(rows));
    ok(out.every(x => x.rows.every(r => !/Nothing placed yet/.test(r))), 'a check that it can hear him is answered as one, never with the instrument\'s status line: ' + brief(out));
    ok(/hear you/i.test(out[0].rows[0] || '') && /hear you/i.test(out[1].rows[0] || ''), 'and both "can you hear me" turns are told it hears him: ' + JSON.stringify([out[0].rows[0], out[1].rows[0]]));
    await q.waitForTimeout(300);
    const spoke = out.map(x => x.rows[0]);
    ok(q.voice[0] === inst.greet, 'Talk greets out loud with the opener and nothing else: ' + JSON.stringify(q.voice[0]));
    ok(JSON.stringify(q.voice.slice(1)) === JSON.stringify(spoke), 'and every reply after it is spoken, each in its own words, in order: ' + JSON.stringify(q.voice));
    ok(!q.errs.length, 'no page errors in that run: ' + q.errs.join(' | '));
    await q.cx.close();
  }

  console.log('\n=== the diagnosis\'s other transcripts, each through one recording ===');
  for (const k of ['hi', 'wife', 'yeah', 'vent']) {
    const q = await open(browser, 1600, 1000);
    const out = await run(q, TR[k]);
    const rows = await srcRows(q);
    ok(oneEach(out) && noRepeat(rows), k + ': one new Source AI turn a turn, never the one before it again: ' + brief(out));
    await q.waitForTimeout(300);
    ok(JSON.stringify(q.voice.slice(1)) === JSON.stringify(out.map(x => x.rows[0])), k + ': and each one is spoken in its own words: ' + q.voice.length + ' voice lines');
    if (k === 'hi') ok(out.every(x => x.rows.every(r => !/Nothing placed yet/.test(r))), 'hi: a greeting, a question to Source AI and a check are each answered, never with the status line: ' + brief(out));
    if (k === 'vent') ok(out.slice(2).every(x => x.rows.every(r => r.indexOf('?') < 0)), 'vent: once he asks to vent, every turn is listened to and nothing is asked: ' + brief(out));
    ok(!q.errs.length, k + ': no page errors: ' + q.errs.join(' | '));
    await q.cx.close();
  }

  console.log('\n=== a change of subject is followed, not filed as stop ===');
  for (const k of ['shift', 'instead']) {
    const q = await open(browser, 1600, 1000);
    const out = await run(q, TR[k]);
    const at = TR[k].findIndex(t => /something else|instead/.test(t));
    const st = await q.evaluate(() => { const L = srcLedgerNow(), r = SRC_CHAT.filter(x => x.w === 'src').pop();
      const m = {}; Object.keys(L.claims).forEach(k => { m[k] = L.claims[k].mentions; });
      return { passed: SRC_PASSED, thread: L.thread, mentions: m, key: r.key, target: SRC_VET && SRC_VET.cand && SRC_VET.cand.target }; });
    const after = out.slice(at + 1).map(x => x.rows.join(' '));
    ok(oneEach(out), k + ': every turn gets one new Source AI turn, the change of subject and everything after it: ' + brief(out));
    ok(!st.passed, k + ': asking to change the subject is not Move on, asking goes on: ' + JSON.stringify(st));
    ok(after.every(r => !/afraid/i.test(r)), k + ': nothing after it says the old subject back: ' + JSON.stringify(after));
    ok(st.thread && st.thread !== 'root' && !st.mentions.root, k + ': and Source AI is on the new subject, the old seat set down: ' + JSON.stringify(st));
    ok(!/^ask\|root/.test(st.key) && (!st.target || st.target !== 'root'), k + ': it never goes back to asking about the old seat: ' + JSON.stringify(st));
    ok(!q.errs.length, k + ': no page errors: ' + q.errs.join(' | '));
    await q.cx.close();
  }

  console.log('\n=== Move on said in words, then more talking ===');
  {
    const q = await open(browser, 1600, 1000);
    const out = await run(q, ['I was afraid all night.', 'Still afraid.', 'No more questions.', 'Afraid, afraid, afraid.', 'I am still afraid.']);
    const st = await q.evaluate(() => ({ passed: SRC_PASSED, move: srcTurn(STR.heard, { typed: true, passed: SRC_PASSED }).move }));
    ok(oneEach(out) && st.passed && st.move === 'pass', 'after Move on every turn still gets one Source AI turn: ' + brief(out));
    ok(out[2].rows[0] === 'Cool.' && out.slice(3).every(x => x.rows.every(r => r.indexOf('?') < 0 && r !== 'Cool.')),
      'it says "Cool." once, and after that it listens and asks nothing: ' + brief(out));
    await q.cx.close();
    /* a turn that is only talk after Move on, then more story: "Cool." and
       its note are still said once, never a second time after the talk */
    const r = await open(browser, 1600, 1000);
    const o2 = await run(r, ['I was afraid all night.', 'Still afraid.', 'No more questions.', 'Can you hear me?', 'Afraid again.']);
    const notes = await r.evaluate(() => [...document.querySelectorAll('#stsrc .src-note')].map(n => n.textContent).filter(t => /Nothing more asked/.test(t)).length);
    const rows2 = await srcRows(r);
    ok(oneEach(o2) && rows2.filter(x => x === 'Cool.').length === 1 && /hear you/.test(o2[3].rows[0]) && o2[4].rows[0].indexOf('?') < 0,
      'after Move on a check that it hears is answered as one, and "Cool." is never said again: ' + brief(o2) + ', notes ' + notes);
    await r.cx.close();
  }

  console.log('\n=== Source AI\'s own voice is never heard as his next turn ===');
  {
    const q = await open(browser, 1600, 1000);
    /* a voice that plays until the gate says it ended, so the gate can look
       at the recording while Source AI is mid sentence */
    await q.evaluate(() => { window.__aud = []; window.Audio = function (u) {
      const a = { src: u, onended: null, onerror: null, play() { __aud.push(a); return Promise.resolve(); }, pause() {} }; return a; }; });
    const end = () => q.evaluate(() => { const a = __aud[__aud.length - 1]; if (a && a.onended) a.onended(); });
    await q.evaluate(() => stMic()); await q.waitForTimeout(300);
    const g = await q.evaluate(() => ({ live: __mic.live(), listen: ST_LISTEN, playing: __aud.length }));
    await end(); await q.waitForTimeout(150);
    const g2 = await q.evaluate(() => __mic.live());
    ok(g.playing === 1 && !g.live && g.listen && g2, 'while the greeting plays the recording is held, and it runs again when the greeting ends: ' + JSON.stringify([g, g2]));
    await q.evaluate(() => __mic.say('Can you hear me?')); await q.waitForTimeout(300);
    const mid = await q.evaluate(() => { const t0 = ST_TEXT, live = __mic.live();
      /* what a microphone would pick up off the speaker, delivered anyway */
      const r = __mic.FakeSR.made[__mic.FakeSR.made.length - 1];
      if (r.onresult) r.onresult({ resultIndex: 0, results: { 0: { 0: { transcript: 'Yes, I hear you.' }, isFinal: true, length: 1 }, length: 1 } });
      return { live, same: ST_TEXT === t0, text: ST_TEXT, playing: __aud.length }; });
    ok(mid.playing === 2 && !mid.live && mid.same, 'while a reply plays the recording is held, and anything delivered in it is not filed as his turn: ' + JSON.stringify(mid));
    await end(); await q.waitForTimeout(150);
    const back = await q.evaluate(() => ({ live: __mic.live(), heard: __mic.say('Hello?') }));
    await q.waitForTimeout(150);
    const me = await q.evaluate(() => SRC_CHAT.filter(r => r.w === 'me').map(r => r.t));
    ok(back.live && back.heard && JSON.stringify(me) === JSON.stringify(['Can you hear me?', 'Hello?']), 'and when it finishes he is heard again: ' + JSON.stringify(me));
    ok(!q.errs.length, 'no page errors in that run: ' + q.errs.join(' | '));
    await q.cx.close();
  }

  /* the lines written for this, held to what any line Source AI says is held
     to: srcVetSay's three points (the person's own words, no diagnosis, no
     claim the ledger does not hold), and, for a line that asks, the points a
     question has to pass whatever it is about: one question, clear, no why,
     no push. Read in the page, off the page's own tables. */
  console.log('\n=== every line written for a turn that is only talk passes the checks ===');
  {
    const q = await open(browser, 1600, 1000);
    const v = await q.evaluate(() => {
      const L = evLedger('', [], {}), all = [].concat(...Object.values(SRC_ACT_SAY), SRC_HEARD);
      return all.map(line => {
        const s = srcVetSay(line, { text: '', ledger: L }, null).fails.map(f => f.n);
        const a = line.indexOf('?') < 0 ? [] : srcVet({ q: line, family: 'act' }, { text: '', ledger: L }).fails.map(f => f.n).filter(n => [1, 2, 4, 5, 6, 7].indexOf(n) >= 0);
        return { line, fails: s.concat(a) };
      });
    });
    ok(v.length && v.every(x => !x.fails.length), 'every act and listening line passes, ' + v.length + ' lines: ' + JSON.stringify(v.filter(x => x.fails.length)));
    await q.cx.close();
  }

  console.log('\n=== a sentence the browser resends is one turn, not two ===');
  {
    const q = await open(browser, 1600, 1000);
    await say(q, 'Can you hear me?');
    await q.evaluate(() => __mic.again('I said can you hear me?')); await q.waitForTimeout(250);
    const me = await q.evaluate(() => SRC_CHAT.filter(r => r.w === 'me').map(r => r.t));
    ok(JSON.stringify(me) === JSON.stringify(['Can you hear me?', 'I said can you hear me?']), 'a final delivered again from index 0 is not committed a second time: ' + JSON.stringify(me));
    await q.cx.close();
  }

  console.log('\n=== pressing Talk again speaks the newest line, never the thread ===');
  {
    const q = await open(browser, 1600, 1000);
    await run(q, ['I am afraid of losing my job.', 'I am so afraid, my boss keeps cutting my hours.']);
    await q.evaluate(() => stMic()); await q.waitForTimeout(150);
    const n0 = q.voice.length;
    await q.evaluate(() => stMic()); await q.waitForTimeout(300);
    const now = (await srcRows(q)).pop();
    const sent = q.voice.slice(n0);
    ok(sent.length === 1 && sent[0] === now && !/Move on|Answer below|I am afraid/.test(sent[0]), 'the second press greets with the newest Source AI line alone: ' + JSON.stringify(sent));
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
