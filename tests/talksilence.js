#!/usr/bin/env node
/* ============================================================
   TALK, WITH NOTHING SAID. 18 November, five things he saw on the Dashboard,
   one screenshot, his words: "When I click on talk and I haven't said
   anything, source is already activating and animating. That's a bug. This
   text in the lower left that says listening, there should be no text on
   that screen. That's a bug. At the very bottom, it says listening, press
   again to stop. There should be no text there. That's a bug. And then this
   tooltip isn't working. Let's turn that off for now. And one thing to look
   into, the commit button keeps jumping to the upper left-hand corner every
   like 10 seconds, briefly."

   NODE_PATH=/opt/node22/lib/node_modules CHROME=/opt/pw-browsers/chromium node tests/talksilence.js
   ATUNED_FILE=path  runs a different build, which is how each check here was
                     shown to fail on the build from before the fix
   SHOTS=dir         also writes the pictures a person looks at
   TS_ONLY=l1,blank,jump  runs only those groups (all three by default)

   1  The circle stays at rest. Pressing Talk spoke the greeting through the
      face's own voice handler, which sets a latch that wakes the circle for
      the rest of the session (beat, saboteur trace, lit rings). Measured on
      the lit pixels of the real canvas, against its own rest, and on the
      face's own state. And a recogniser result with no word in it (empty,
      spaces, a lone filler sound) is not a turn, while yes, no, "I don't
      know", sad and the safety door's own words all still are.
   2  No word under the circle at rest. The italic Listening is gone and the
      person's own interim words still show there, and the circle does not
      move when they arrive.
   3  No bar. Listening. Press again to stop. is not drawn and not logged,
      a hidden polite region tells a screen reader the microphone opened and
      closed, and a real failure still reaches the dock.
   4  No hover card on the circle, at the middle of it and over the empty
      corners of its box, and none on a tap at 390. The key text is still in
      the data and the canvas still has its label. Talk's own hover is the
      positive control, so a quiet circle is not a tooltip that is off for
      everyone.
   5  Commit does not move. It was sliding in from the corner of the Journal
      pane on every placement, about every eight seconds because a recogniser
      that hears nothing ends itself and the page renders on the restart.
      The rectangle of the button is sampled every 50 milliseconds for forty
      seconds, Talk on at 1600 and 390 and Talk off, with a recogniser that
      goes quiet and ends the way Chrome's does, and the browser's own
      transitionstart events on left and top are counted beside it.

   CHECKED AGAINST A KNOWN BAD CASE FIRST, the standing rule. The jump
   detector is run on a page that injects a jump to the upper left every ten
   seconds and must flag it; the pixel probe is run on a real sentence, which
   must read well above rest; the hover probe is run on Talk, which must show
   its card. A gate that cannot see the thing it is looking for is not one.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const path = require('path');
const { chromium } = require('playwright');
const { FULL_SIGHT, LCOL_SEED } = require('./seed.js');
const { guardBrowser } = require('./net.js');
const FILE = 'file://' + path.resolve(process.env.ATUNED_FILE || path.join(__dirname, '..', 'source.html')) + '?dev=1';
const SHOTS = process.env.SHOTS || '';
const ONLY = (process.env.TS_ONLY || 'l1,blank,jump').split(',');
const SOAK = +(process.env.TS_SOAK || 40);

let n = 0; const fails = [];
const ok = (c, m) => { n++; if (!c) fails.push(m); console.log((c ? '  ok    ' : '  FAIL  ') + m); };
const wait = ms => new Promise(r => setTimeout(r, ms));
/* a picture is for a person to look at, never a check: one that cannot be written (a full disk) is said and does not stop the run */
const snap = async (p, nm) => { try { await p.screenshot({ path: path.join(SHOTS, nm) }); console.log('  shot  ' + nm); } catch (e) { console.log('  noshot ' + nm + ': ' + String(e.message).split('\n')[0]); } };
const shot = async (p, nm) => { if (SHOTS) { await p.mouse.move(2, 2); await p.waitForTimeout(500); await snap(p, nm); } };

/* the voice line is answered with a silent sound of a real length. The gates'
   own stub is thirty milliseconds, which flashes by: a greeting that plays for
   three seconds is what the owner has, and is long enough to be measured */
const wav = sec => { const rate = 8000, len = Math.round(rate * sec), b = Buffer.alloc(44 + len, 128);
  b.write('RIFF', 0); b.writeUInt32LE(36 + len, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24);
  b.writeUInt32LE(rate, 28); b.writeUInt16LE(1, 32); b.writeUInt16LE(8, 34); b.write('data', 36); b.writeUInt32LE(len, 40); return b; };
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type', 'access-control-allow-methods': 'POST, OPTIONS' };
const VOICE = /\.workers\.dev\/v1\/voice\/synthesize/;

/* THE STAND-IN RECOGNISER, srcchat.js's, with the three things this file
   needs. interim() is a hypothesis that has not finalised, as Chrome sends
   while a sentence is forming. silenceMs makes a recording that hears nothing
   end itself, an error of no-speech and then the end, which is what Chrome's
   continuous recognition does and what restarts the page's recogniser. err()
   is a real failure from the browser. It is installed over both names before
   the page loads, whatever the browser has. */
const MIC = () => {
  window.__micCfg = { silenceMs: 0, starts: 0 };
  function FakeSR() { FakeSR.made.push(this); this.on = false; this.results = []; this.log = []; }
  FakeSR.made = [];
  FakeSR.prototype.start = function () {
    if (this.on) throw new Error('InvalidStateError: recognition has already started');
    this.on = true; this.results = []; this.log.push('start'); window.__micCfg.starts++;
    const s = this, ms = window.__micCfg.silenceMs;
    clearTimeout(this._t);
    if (ms) this._t = setTimeout(() => { if (s.on && !s.results.length) { if (s.onerror) s.onerror({ error: 'no-speech' }); s._end(); } }, ms); };
  FakeSR.prototype._end = function () { if (!this.on) return; this.on = false; clearTimeout(this._t); const s = this; setTimeout(() => { if (s.onend) s.onend(); }, 0); };
  FakeSR.prototype.stop = function () { this.log.push('stop'); this._end(); };
  FakeSR.prototype.abort = function () { this.log.push('abort'); if (this.on && this.onerror) this.onerror({ error: 'aborted' }); this._end(); };
  const fire = (r, from) => r.onresult({ resultIndex: from, results: Object.assign({ length: r.results.length }, r.results) });
  const fin = t => ({ 0: { transcript: t }, isFinal: true, length: 1 });
  const hyp = t => ({ 0: { transcript: t }, isFinal: false, length: 1 });
  const cur = () => FakeSR.made[FakeSR.made.length - 1];
  window.__mic = {
    FakeSR,
    live: () => !!(cur() && cur().on),
    say(t) { const r = cur(); if (!r || !r.on) return false; r.results.push(fin(t)); fire(r, r.results.length - 1); return true; },
    interim(t) { const r = cur(); if (!r || !r.on) return false; r.results.push(hyp(t)); fire(r, r.results.length - 1); r.results.pop(); return true; },
    err(code) { const r = cur(); if (!r || !r.onerror) return false; r.onerror({ error: code }); return true; }
  };
  window.SpeechRecognition = FakeSR; window.webkitSpeechRecognition = FakeSR;
  /* every audio element that really starts playing, heard on the element
     itself: the page's own Audio is never put in the document, so its events
     reach nothing above it. A quiet circle is then never a greeting that did
     not sound. */
  window.__played = [];
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () { this.addEventListener('playing', () => { window.__played.push(Math.round(performance.now())); }, { once: true }); return play.apply(this, arguments); };
};

const booted = async p => {
  await p.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(600);
  await p.evaluate(() => { if (typeof OB !== 'undefined' && OB.open && typeof obClose === 'function') obClose(); }).catch(() => {});
  await p.waitForTimeout(120); };

async function open(browser, w, h, o) {
  o = o || {};
  const cx = await browser.newContext({ viewport: { width: w, height: h } });
  const voice = [], hold = { sec: o.wavSec || 0.03 };
  await cx.route(VOICE, route => {
    const rq = route.request();
    if (rq.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    try { voice.push(JSON.parse(rq.postData()).text); } catch (e) { voice.push('?'); }
    return route.fulfill({ status: 200, headers: Object.assign({ 'content-type': 'audio/wav' }, CORS), body: wav(hold.sec) });
  });
  await cx.addInitScript(MIC); await cx.addInitScript(LCOL_SEED); await cx.addInitScript(FULL_SIGHT);
  const p = await cx.newPage();
  p.errs = []; p.on('pageerror', e => p.errs.push(String(e && e.message || e))); p.voice = voice; p.cx = cx; p.hold = hold;
  await p.goto(FILE, { waitUntil: 'load' }); await booted(p);
  await p.evaluate(() => { setTab(TAB.STORY); render(); });
  await p.waitForTimeout(500);
  return p;
}
/* THE OWNER'S SCREEN, which is not a blank profile. A blank one parks the
   circle until the first words land, and a worked example has no Talk button,
   so neither shows the bug. A real own record: say one story, Commit it,
   reload so the circle starts at rest, and wait for the boot hand over to
   finish. */
async function openLoaded(browser, w, h, o) {
  const p = await open(browser, w, h, Object.assign({}, o, { wavSec: 0.03 }));
  await p.evaluate(async () => { if (!ST_LISTEN) stMic();
    for (let i = 0; i < 120 && !__mic.live(); i++) await new Promise(r => setTimeout(r, 25));
    __mic.say('I was afraid and angry all day. My chest is tight and I could not sleep.'); });
  await p.waitForFunction(() => document.getElementById('stapply') && getComputedStyle(document.getElementById('stapply')).display !== 'none', null, { timeout: 10000 }).catch(() => {});
  await p.waitForTimeout(800);
  await p.click('#stapply').catch(() => {});
  await p.waitForFunction(() => CURP && CURP.story && CURP.story.entries && CURP.story.entries.length > 0, null, { timeout: 10000 }).catch(() => {});
  await p.waitForTimeout(600);
  p.voice.length = 0;
  await p.reload({ waitUntil: 'load' }); await booted(p);
  await p.evaluate(() => { setTab(TAB.STORY); render(); });
  await p.waitForFunction(() => window.SrcFace && window.SrcFace.state().intro === null && document.getElementById('srcface') && !document.getElementById('srcface').hidden, null, { timeout: 40000 }).catch(() => {});
  await p.waitForTimeout(1500);
  /* the page's own render count, read by the checks that say a render did not happen */
  await p.evaluate(() => { window.__renders = 0; const f = window.stRender; window.stRender = function () { window.__renders++; return f.apply(this, arguments); }; });
  if (o && o.silenceMs) await p.evaluate(ms => { window.__micCfg.silenceMs = ms; }, o.silenceMs);
  return p;
}

/* lit pixels of the real reading circle, a channel above 110. innerText does
   not see a canvas and the monitor's alpha count reads a constant on this one,
   so this is the measure; it is read against the same canvas at rest */
const BRIGHT = () => { window.__bright = () => { const c = document.getElementById('srcface'); if (!c || c.hidden) return -1;
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let k = 0;
  for (let i = 0; i < d.length; i += 4) if (d[i] > 110 || d[i + 1] > 110 || d[i + 2] > 110) k++; return k; }; };
const sample = async (p, ms, step) => { const out = []; const t0 = Date.now();
  while (Date.now() - t0 < ms) { out.push(await p.evaluate(() => window.__bright())); await p.waitForTimeout(step); } return out; };
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);
const face = p => p.evaluate(() => { const s = SrcFace.state(); return { engaged: s.engaged, word: s.word, reading: s.reading, speaking: s.speaking, trace: !!s.trace }; });
/* every visible word of Source AI's own that the owner named: the caption's
   placeholder and the bar's line. Hidden regions, an element nobody can see,
   and the Talk button's own label (an attribute, not text) are not counted */
const SEEN = () => { const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let nd;
  while ((nd = w.nextNode())) { const t = nd.nodeValue.trim(); if (!/listening|press again to stop/i.test(t)) continue;
    let e = nd.parentElement, hid = !e;
    for (let a = e; a && !hid; a = a.parentElement) { if (a.matches && a.matches('.src-say,[hidden],script,style,noscript')) hid = true;
      const cs = getComputedStyle(a); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) hid = true; }
    if (!hid) { const r = e.getBoundingClientRect(); if (r.width < 3 || r.height < 3) hid = true; }
    if (!hid) out.push(t.slice(0, 60)); }
  return out; };
const circleOf = p => p.evaluate(() => { const c = document.getElementById('srcface'); const r = c.getBoundingClientRect(); const R = Math.max(12, Math.min(r.width, r.height) / 2 - 2);
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, R, box: [r.left, r.top, r.width, r.height], top: Math.round(r.top) }; });
const tipOn = p => p.evaluate(() => { const t = document.getElementById('tip'); return !!(t && t.classList.contains('on')); });
const hover = async (p, x, y, ms) => { await p.mouse.move(x - 40, y - 40); await p.mouse.move(x, y, { steps: 4 }); await p.waitForTimeout(ms || 1000); const on = await tipOn(p); return on; };

/* THE JUMP DETECTOR. Every 50 milliseconds the rectangle of the round button.
   Steady is the place it most often sat; an excursion is a sample more than 4
   pixels from it. transitionstart on left or top is the browser saying the
   button is gliding, counted at the document before anything is pressed. */
const WATCH = () => { window.__tr = 0; window.__rects = []; window.__t0 = performance.now();
  document.addEventListener('transitionstart', e => { if (e.target && e.target.id === 'stapply' && /^(left|top)$/.test(e.propertyName)) window.__tr++; }, true);
  window.__iv = setInterval(() => { const e = document.getElementById('stapply'); const r = e ? e.getBoundingClientRect() : null;
    window.__rects.push([Math.round(performance.now() - window.__t0), r ? Math.round(r.left) : 0, r ? Math.round(r.top) : 0, r ? Math.round(r.width) : 0]); }, 50); };
const readWatch = p => p.evaluate(() => { clearInterval(window.__iv); return { tr: window.__tr, rects: window.__rects }; });
const analyse = w => {
  const vis = w.rects.filter(r => r[3] > 0), tally = {};
  vis.forEach(r => { const k = r[1] + ',' + r[2]; tally[k] = (tally[k] || 0) + 1; });
  const mode = Object.keys(tally).sort((a, b) => tally[b] - tally[a])[0] || '0,0', [mx, my] = mode.split(',').map(Number);
  const out = vis.filter(r => Math.max(Math.abs(r[1] - mx), Math.abs(r[2] - my)) > 4);
  return { samples: w.rects.length, shown: vis.length, steady: [mx, my], excursions: out.length, first: out.slice(0, 4), tr: w.tr }; };

async function pressTalk(p) { await p.click('#stmic'); }

(async () => {
  const browser = guardBrowser(await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }));

  /* ---------- the group on the owner's own screen, 1600 by 1000 ---------- */
  if (ONLY.includes('l1')) {
    console.log('\n=== the circle on a real own record, 1600 by 1000: hover at rest, Talk, silence, words ===');
    const p = await openLoaded(browser, 1600, 1000, { wavSec: 3 });
    await p.evaluate(BRIGHT);
    const pre = await p.evaluate(() => ({ face: !!document.getElementById('srcface') && !document.getElementById('srcface').hidden, mic: !!document.getElementById('stmic'), listen: ST_LISTEN, log: MSG_LOG.length }));
    ok(pre.face && pre.mic && !pre.listen, 'the owner\'s screen: a mounted circle, a Talk button, the microphone off: ' + JSON.stringify(pre));
    /* the voice answers at three seconds from here on, as the real greeting does */
    p.hold.sec = 3;

    /* 4. the hover, at rest, over the circle and over the empty corner of its box */
    const c0 = await circleOf(p);
    const k = await p.evaluate(() => { const c = document.getElementById('srcface'); const key = typeof SrcFace.key === 'function' ? SrcFace.key() : (c.getAttribute('title') || '');
      return { title: c.hasAttribute('title'), tip: c.hasAttribute('data-tip') || c.hasAttribute('data-tip-t'), aria: (c.getAttribute('aria-label') || '').length > 40,
        up: !!c.closest('[title],[data-tip],[data-tip-t]'), key: /^Source's reading circle\nDots:/.test(key) && /Gold arc/.test(key) && key.split('\n').length >= 6 }; });
    ok(!k.title && !k.tip && !k.up, 'the canvas carries no title and no data-tip, and nothing above it does: ' + JSON.stringify(k));
    ok(k.aria && k.key, 'the label stays on the canvas and the key text stays in the data, SrcFace.key(): ' + JSON.stringify({ aria: k.aria, key: k.key }));
    const h1 = await hover(p, c0.cx, c0.cy, 1100);
    ok(!h1, 'no hover card at the middle of the circle after a second');
    const h2 = await hover(p, c0.box[0] + 24, c0.cy, 1100);
    ok(!h2, 'and none over the empty corner of its box, where the card used to open');
    const mc = await p.evaluate(() => { const r = document.getElementById('stmic').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
    const h3 = await hover(p, mc[0], mc[1], 1100);
    ok(h3, 'the probe can see a card: Talk\'s own hover still opens one, so a quiet circle is not a tooltip that is off for everyone');
    await p.mouse.move(2, 2); await p.waitForTimeout(500);

    /* 1. the circle at rest, measured against itself */
    const rest = await sample(p, 2000, 250); const restMean = mean(rest), restMax = Math.max.apply(null, rest);
    const f0 = await face(p);
    ok(restMean > 300 && !f0.engaged && f0.word === '' && !f0.reading, 'at rest the circle is lit by its own dots and engaged is false: ' + JSON.stringify({ restMean: Math.round(restMean), f0 }));
    const log0 = await p.evaluate(() => MSG_LOG.length);

    await pressTalk(p);
    const t0 = Date.now();
    await p.waitForFunction(() => window.__played.length > 0, null, { timeout: 8000 }).catch(() => {});
    const played = await p.evaluate(() => window.__played.length);
    ok(played >= 1 && p.voice.length === 1, 'the greeting is still requested and still plays, once: ' + JSON.stringify({ played, asked: p.voice }));
    ok(await p.evaluate(() => ST_LISTEN && __mic.live() === true || ST_HUSH === true), 'the microphone is on (or held only while the greeting sounds)');
    await p.waitForTimeout(300);

    /* 3. the bar, early, while it used to be up */
    const bar1 = await p.evaluate(() => ({ on: document.getElementById('msgdock').classList.contains('on'), text: document.getElementById('status').textContent, log: MSG_LOG.length }));
    ok(!bar1.on && bar1.text === '' && bar1.log === log0, 'no bar a moment after Talk: the dock is shut, #status is empty and nothing is logged: ' + JSON.stringify(bar1));
    const say1 = await p.evaluate(() => { const e = document.getElementById('micsay'); const r = e ? e.getBoundingClientRect() : { width: 999, height: 999 };
      return { text: e ? e.textContent : null, live: e ? e.getAttribute('aria-live') : null, role: e ? e.getAttribute('role') : null, w: Math.round(r.width), h: Math.round(r.height) }; });
    ok(say1.text === 'Microphone open.' && say1.live === 'polite' && say1.w <= 2 && say1.h <= 2, 'a hidden polite region tells a screen reader the microphone is open: ' + JSON.stringify(say1));
    if (SHOTS) await snap(p, 'talk-pressed-early-1600.png');

    /* 1 and 2, silence, sampled for nine seconds from the press */
    const silent = []; let engagedEver = false, wordEver = '';
    while (Date.now() - t0 < 9500) {
      silent.push(await p.evaluate(() => window.__bright()));
      const f = await face(p); if (f.engaged || f.reading || f.speaking) engagedEver = true; if (f.word) wordEver = f.word;
      await p.waitForTimeout(250); }
    const over = silent.filter(x => x > restMax * 1.5).length;
    ok(!engagedEver && wordEver === '', 'Talk on and nothing said: the face never reports engaged, reading, speaking or a word, for nine seconds: ' + JSON.stringify({ engagedEver, wordEver }));
    ok(mean(silent) < restMean * 1.4 && over <= 1, 'and the lit pixels stay at rest: mean ' + Math.round(mean(silent)) + ' against rest ' + Math.round(restMean) + ', ' + over + ' of ' + silent.length + ' samples above one and a half times the rest maximum ' + restMax);
    await shot(p, 'talk-silent-1600.png');

    /* 2 and 3, late, when the bar would have gone and the caption would still be up */
    const late = await p.evaluate(() => ({ cap: (document.getElementById('stlivecap') || {}).textContent, has: !!document.getElementById('stlivecap'), on: document.getElementById('msgdock').classList.contains('on'), text: document.getElementById('status').textContent, log: MSG_LOG.length }));
    ok(late.has && late.cap === '', 'the caption holds its place and has nothing in it: ' + JSON.stringify(late));
    ok(!late.on && late.text === '' && late.log === log0, 'the dock never opened and nothing was logged in nine seconds');
    ok((await p.evaluate(SEEN)).length === 0, 'no visible word Listening or Press again to stop anywhere on the page: ' + JSON.stringify(await p.evaluate(SEEN)));
    const cTop0 = (await circleOf(p)).top;

    /* the hover again, now that the circle has moved up under a pointer that was left on Talk */
    const c1 = await circleOf(p);
    const h4 = await hover(p, c1.cx, c1.cy, 1100);
    ok(!h4, 'no hover card on the circle while the microphone is open either');
    /* the picture is taken with the pointer still on the circle, where the owner's card was */
    if (SHOTS) await snap(p, 'talk-silent-hover-1600.png');
    await p.mouse.move(2, 2); await p.waitForTimeout(400);

    /* 2. the person's own words still show, and the circle does not move for them */
    await p.evaluate(() => __mic.interim('the words I am saying right now')); await p.waitForTimeout(200);
    const w1 = await p.evaluate(() => (document.getElementById('stlivecap') || {}).textContent);
    const cTop1 = (await circleOf(p)).top;
    ok(w1 === 'the words I am saying right now', 'the person\'s own interim words show in the caption while they speak: ' + JSON.stringify(w1));
    await shot(p, 'talk-interim-1600.png');
    ok(Math.abs(cTop1 - cTop0) <= 1, 'and the circle does not move when words arrive or leave: ' + cTop0 + ' then ' + cTop1);
    await p.evaluate(() => __mic.interim('')); await p.waitForTimeout(200);
    ok((await p.evaluate(() => document.getElementById('stlivecap').textContent)) === '', 'the caption empties again when the words go');

    /* a silent restart says nothing: the recogniser ends itself, the page restarts it, the announcement stays as it was */
    const st0 = await p.evaluate(() => window.__micCfg.starts);
    await p.evaluate(() => { window.__mm = 0; const e = document.getElementById('micsay'); if (e) new MutationObserver(m => { window.__mm += m.length; }).observe(e, { childList: true, characterData: true, subtree: true });
      window.__micCfg.silenceMs = 1500; const r = __mic.FakeSR.made[__mic.FakeSR.made.length - 1]; r.onerror({ error: 'no-speech' }); r.stop(); });
    await p.waitForTimeout(4200);
    const rs = await p.evaluate(() => ({ mm: window.__mm, text: (document.getElementById('micsay') || {}).textContent, starts: window.__micCfg.starts, listen: ST_LISTEN }));
    rs.starts -= st0;
    ok(rs.starts >= 2 && rs.listen && rs.mm === 0 && rs.text === 'Microphone open.', 'a recogniser that ends itself in silence is restarted without a word to a screen reader: ' + JSON.stringify(rs));
    /* a silence timer already running ends its recording once more after this, so the page is given time to restart it before anyone speaks */
    await p.evaluate(() => { window.__micCfg.silenceMs = 0; });
    await p.waitForTimeout(2200);

    /* the known good case: a real sentence wakes the circle, and the probe sees it */
    await p.waitForFunction(() => !ST_HUSH && __mic.live(), null, { timeout: 8000 }).catch(() => {});
    await p.evaluate(() => __mic.say('I was afraid and angry all day. My chest is tight and I could not sleep.'));
    const talkSamples = await sample(p, 7000, 250);
    const f1 = await face(p);
    ok(f1.engaged, 'a real sentence still wakes the circle: ' + JSON.stringify(f1));
    ok(Math.max.apply(null, talkSamples) > restMean * 2, 'and the probe sees it: lit pixels reach ' + Math.max.apply(null, talkSamples) + ' against a rest of ' + Math.round(restMean));
    await shot(p, 'talk-sentence-1600.png');
    ok(p.voice.length >= 2, 'and Source AI still answers it out loud: ' + JSON.stringify(p.voice));

    /* Talk again closes the microphone and the region says so */
    await pressTalk(p); await p.waitForTimeout(500);
    const cl = await p.evaluate(() => ({ text: (document.getElementById('micsay') || {}).textContent, listen: ST_LISTEN, on: document.getElementById('msgdock').classList.contains('on') }));
    ok(cl.text === 'Microphone closed.' && !cl.listen && !cl.on, 'pressing Talk again closes it and the hidden region says so, still with no bar: ' + JSON.stringify(cl));
    ok(!p.errs.length, 'no page errors: ' + p.errs.join(' | '));
    await p.cx.close();
  }

  /* ---------- the guard against a result with nothing in it, and the failure that must still show ---------- */
  if (ONLY.includes('blank')) {
    console.log('\n=== a result with no word in it is not a turn, and a real answer still is ===');
    const p = await open(browser, 1600, 1000);
    await p.evaluate(() => { window.__renders = 0; const f = window.stRender; window.stRender = function () { window.__renders++; return f.apply(this, arguments); }; });
    await p.click('#stmic', { timeout: 6000 });
    await p.waitForFunction(() => __mic.live() && !ST_HUSH, null, { timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(400);
    const b0 = await p.evaluate(() => ({ text: ST_TEXT, chat: SRC_CHAT.length, renders: window.__renders, face: SrcFace.state().engaged, spoken: 0 }));
    const v0 = p.voice.length;
    ok(v0 === 1 && !b0.face, 'on a blank page Talk has greeted once and the circle has not been woken by it: ' + JSON.stringify({ voice: p.voice, face: b0.face }));
    await p.evaluate(async () => { for (const t of ['', '   ', 'uh', 'Hmm.', 'the', 'Um, uh', '...', '?!']) { __mic.say(t); await new Promise(r => setTimeout(r, 40)); }
      __mic.interim(''); await new Promise(r => setTimeout(r, 40)); __mic.interim(''); await new Promise(r => setTimeout(r, 40)); });
    await p.waitForTimeout(500);
    const b1 = await p.evaluate(() => ({ text: ST_TEXT, chat: SRC_CHAT.length, renders: window.__renders, face: SrcFace.state() }));
    ok(b1.text === b0.text && b1.chat === b0.chat, 'empty finals, spaces, lone filler sounds and bare punctuation are not turns: the entry reads ' + JSON.stringify(b1.text) + ' and the thread holds ' + b1.chat);
    ok(!b1.face.engaged && !b1.face.reading && b1.face.word === '', 'none of them started a reading on the face: ' + JSON.stringify({ engaged: b1.face.engaged, reading: b1.face.reading, word: b1.face.word }));
    ok(p.voice.length === v0, 'and none of them was answered out loud: ' + JSON.stringify(p.voice));
    ok(b1.renders === b0.renders, 'an interim result that says what the caption already says paints nothing: ' + (b1.renders - b0.renders) + ' renders for ten empty results');
    for (const t of ['yes', 'no', 'I don\'t know', 'sad']) {
      await p.waitForFunction(() => !ST_HUSH && __mic.live(), null, { timeout: 8000 }).catch(() => {});
      await p.evaluate(t => __mic.say(t), t); await p.waitForTimeout(350); }
    const b2 = await p.evaluate(() => ST_TEXT);
    ok(b2 === 'yes\nno\nI don\'t know\nsad', 'a real short answer is never swallowed, yes, no, I don\'t know and sad all land as turns: ' + JSON.stringify(b2));
    ok(!p.errs.length, 'no page errors: ' + p.errs.join(' | '));
    await p.cx.close();

    console.log('\n=== the safety door is never gated by that guard ===');
    const q = await open(browser, 1600, 1000);
    await q.evaluate(() => stMic());
    await q.waitForFunction(() => __mic.live() && !ST_HUSH, null, { timeout: 8000 }).catch(() => {});
    await q.waitForTimeout(300);
    await q.evaluate(() => __mic.say('I want to kill myself.')); await q.waitForTimeout(500);
    const sf = await q.evaluate(() => ({ text: ST_TEXT, safe: stSafe(), ...(typeof stMicNoise === 'function' ? { noise: stMicNoise('I want to kill myself.'), noiseUh: stMicNoise('uh'), noiseYes: stMicNoise('yes'), noiseSad: stMicNoise('sad'), noiseDk: stMicNoise('I don\'t know'), noiseAcc: stMicNoise('é'), noiseCjk: stMicNoise('你好') } : { noise: null, noiseUh: null }) }));
    ok(sf.text === 'I want to kill myself.' && sf.safe && !sf.noise, 'crisis words always pass the guard and the door stands: ' + JSON.stringify({ text: sf.text, safe: sf.safe, noise: sf.noise }));
    ok(sf.noiseUh === true && sf.noiseYes === false && sf.noiseSad === false && sf.noiseDk === false && sf.noiseAcc === false && sf.noiseCjk === false, 'the guard names sounds and never words, and reads other scripts as speech: ' + JSON.stringify(sf));
    await q.cx.close();

    console.log('\n=== a real failure still reaches the dock ===');
    const r = await open(browser, 1600, 1000);
    await r.evaluate(() => stMic());
    await r.waitForFunction(() => __mic.live() && !ST_HUSH, null, { timeout: 8000 }).catch(() => {});
    await r.waitForTimeout(300);
    const d0 = await r.evaluate(() => ({ on: document.getElementById('msgdock').classList.contains('on'), log: MSG_LOG.length }));
    ok(!d0.on, 'Talk alone opens no dock: ' + JSON.stringify(d0));
    await r.evaluate(() => __mic.err('audio-capture')); await r.waitForTimeout(400);
    const d1 = await r.evaluate(() => ({ on: document.getElementById('msgdock').classList.contains('on'), text: document.getElementById('status').textContent, kind: document.getElementById('status').getAttribute('data-kind'),
      keep: !!document.getElementById('msgkeep'), last: MSG_LOG[MSG_LOG.length - 1] }));
    ok(d1.on && /No microphone was found/.test(d1.text) && d1.kind === 'fail' && d1.last && d1.last.kind === 'fail', 'a microphone that is not there is still said, in the dock, as a failure, and logged: ' + JSON.stringify({ on: d1.on, text: d1.text, kind: d1.kind }));
    ok((await r.evaluate(() => (document.getElementById('micsay') || {}).textContent)) === 'Microphone closed.', 'and the hidden region says the microphone closed');
    await r.cx.close();
  }

  /* ---------- Commit does not move ---------- */
  if (ONLY.includes('jump')) {
    console.log('\n=== the round button holds still, sampled every 50 milliseconds for ' + SOAK + ' seconds ===');
    const open1 = o => openLoaded(browser, o.w, o.h, { silenceMs: o.silence || 0 });
    const [A, B, C, D] = await Promise.all([open1({ w: 1600, h: 1000, silence: 6000 }), open1({ w: 1600, h: 1000 }), open1({ w: 390, h: 844, silence: 6000 }), open(browser, 1600, 1000)]);
    for (const p of [A, B, C, D]) await p.evaluate(WATCH);
    /* the known bad case, on a blank page: a jump to the upper left every ten seconds, for 150 milliseconds */
    await D.evaluate(() => stMic()); await D.waitForFunction(() => document.getElementById('stapply') && document.getElementById('stapply').getBoundingClientRect().width > 0, null, { timeout: 8000 }).catch(() => {});
    await D.evaluate(() => { window.__inj = 0; setInterval(() => { const e = document.getElementById('stapply'); if (!e) return; window.__inj++; const was = e.style.transform;
      e.style.transform = 'translate(-1200px,-900px)'; setTimeout(() => { e.style.transform = was; }, 150); }, 10000); });
    /* Talk on in the two loaded pages that go quiet, Talk left off in the third */
    await Promise.all([pressTalk(A), pressTalk(C)]);
    await A.waitForTimeout(1500);
    if (SHOTS) await snap(C, 'talk-pressed-early-390.png');
    await wait(SOAK * 1000 - 1500);
    const [wa, wb, wc, wd] = await Promise.all([A, B, C, D].map(readWatch));
    const [ra, rb, rc, rd] = [wa, wb, wc, wd].map(analyse);
    const made = await Promise.all([A, C].map(p => p.evaluate(() => ({ starts: window.__micCfg.starts, renders: window.__renders }))));
    ok(ra.shown > 500 && ra.samples > 500, 'Talk on at 1600: the button was sampled ' + ra.samples + ' times and was on screen for ' + ra.shown);
    ok(made[0].starts >= 5 && made[0].renders >= 4, 'and the recogniser went quiet and was restarted ' + (made[0].starts - 1) + ' times, rendering the page ' + made[0].renders + ' times, as Chrome\'s does about every ten seconds');
    ok(ra.excursions === 0 && ra.tr === 0, 'Talk on at 1600: it never left its place, ' + ra.excursions + ' samples away from ' + ra.steady + ', and the browser started ' + ra.tr + ' glides on left or top: ' + JSON.stringify(ra.first));
    ok(rc.shown > 500 && rc.excursions === 0 && rc.tr === 0 && made[1].starts >= 5, 'Talk on at 390: the same, ' + rc.shown + ' samples on screen, ' + rc.excursions + ' away from ' + rc.steady + ', ' + rc.tr + ' glides, ' + (made[1].starts - 1) + ' restarts: ' + JSON.stringify(rc.first));
    ok(rb.samples > 500 && rb.excursions === 0 && rb.tr === 0, 'Talk off at 1600: nothing moves, ' + rb.samples + ' samples, ' + rb.excursions + ' excursions, ' + rb.tr + ' glides');
    ok(rd.shown > 300 && rd.excursions >= 2, 'known bad first: a jump injected every ten seconds is caught, ' + rd.excursions + ' samples away in ' + rd.shown + ', ' + (await D.evaluate(() => window.__inj)) + ' injected: ' + JSON.stringify(rd.first));
    await shot(A, 'talk-silent-after-soak-1600.png');
    await shot(C, 'talk-silent-after-soak-390.png');

    /* the same pages are the 390 hover check: the structure, and a tap on the circle that opens nothing */
    const k390 = await C.evaluate(() => { const c = document.getElementById('srcface'); return { title: c.hasAttribute('title'), up: !!c.closest('[title],[data-tip],[data-tip-t]'), aria: !!c.getAttribute('aria-label') }; });
    ok(!k390.title && !k390.up && k390.aria, 'at 390 the canvas carries no title and no data-tip and keeps its label: ' + JSON.stringify(k390));
    const c390 = await circleOf(C);
    await C.mouse.click(c390.cx, c390.cy); await C.waitForTimeout(900);
    ok(!(await tipOn(C)), 'and a tap on the circle at 390 opens no card');
    const seen390 = await C.evaluate(SEEN);
    ok(seen390.length === 0, 'and at 390 there is no visible word Listening or Press again to stop: ' + JSON.stringify(seen390));
    await shot(C, 'talk-silent-tap-390.png');
    const errs = [A, B, C, D].map(p => p.errs.join(' | ')).filter(Boolean);
    ok(!errs.length, 'no page errors in any of the four pages: ' + errs.join(' || '));
    for (const p of [A, B, C, D]) await p.cx.close();
  }

  await browser.close();
  console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed =====');
  if (fails.length) { fails.forEach(f => console.log('  FAIL  ' + f)); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
