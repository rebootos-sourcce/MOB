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
  await p.evaluate
(async()=>{ const browser = guardBrowser(await chromium.launch({ executablePath: process.env.CHROME }));
 const q = await open(browser, 1600, 1000);
 await q.evaluate(() => stMic());
 await q.waitForFunction(() => __mic.live() && !ST_HUSH, null, { timeout: 8000 }).catch(() => {});
 await q.waitForTimeout(300);
 const pre = await q.evaluate(()=>({live:__mic.live(), hush:ST_HUSH, said:SRC_VOICE.said, end:SRC_VOICE.endAt, now:performance.now(), safe:srcSafe('I want to kill myself.'), door:srcMicDoor('I want to kill myself.'), noise:stMicNoise('I want to kill myself.')}));
 console.log('pre', JSON.stringify(pre));
 const r = await q.evaluate(() => __mic.say('I want to kill myself.')); await q.waitForTimeout(500);
 console.log('said', r, JSON.stringify(await q.evaluate(()=>({t:ST_TEXT, safe:stSafe(), hush:ST_HUSH, chat:SRC_CHAT.map(x=>x.w+':'+x.t)}))), q.errs);
 await browser.close(); })();
