#!/usr/bin/env node
/* ============================================================
   SOURCE AI AS A CONVERSATION, IN A REAL BROWSER. Round of 18 November, the
   owner, with a screenshot of the Discover tab: "Source AI animation appears
   broken when I load up the dashboard without saying anything or profile.
   Animations are automatically playing. There's a tooltip that looks like
   it's a paragraph long that needs to go. There's text still that says I'm
   listening that needs to go. There's text that says 0 words hidden... Source
   AI, it needs its logic reviewed. Right now, there's a lot of bugs with it.
   And right now, there's something with Source AI where it's not having a
   natural conversation with me. It keeps repeating, what are we talking about
   today? So it's acting more like an algorithm."

   NODE_PATH=/opt/node22/lib/node_modules CHROME=/path/to/chromium node tests/srcconvo.js
   ATUNED_FILE=path  runs it against another build, which is how it is
   checked against a known bad one first, the standing rule: every section
   below is run against the build from before this round (c2bf52a2) and must
   fail on it, by name, before it is believed on this one.

   WHAT IT HOLDS, and the reproduction each came from, read off the page
     1  the microphone's door. A result with no words in it (silence, a lone
        uh, the, um, you) is not a turn: no row, no reading, no reply, no
        saved draft. A short answer that means something (yes, no, I don't
        know, okay, afraid, mhm, hmm) is a turn, hmm included: the spoken-yes
        ruling in ui/storyui.js (fix/talk-silence, 19 November) already
        settled hmm as a turn and not a hesitation, reconciled here rather
        than re-litigated, since the two shared one door before this round
        and must still agree now. The door to help is never refused. Source
        AI's own words coming back are not a turn.
     2  the hold outlasts the line. The recording starts SRC_TAIL_MS after the
        audio ended and a result delivered inside it is dropped.
     3  a person mid sentence when a reply arrives is not talked over, and
        their sentence is not lost.
     4  a late end from a recording that was stopped does not turn the new
        one off.
     5  the opener is said once a conversation. Not on a second press, not as
        the answer to hello or can you hear me, and no act line describes a
        screen that is not there.
     6  fourteen turns of silence, noise, echo, greetings, complaints and
        stories: no line twice running, no line twice at all, the opener at
        most once, what was said reflected, and the acts answered.
     7  the face is at rest until a sentence with a seat in it is read, and
        goes back to rest after it. It draws no word at its centre.
     8  no "Listening" on the screen, no "0 words hidden", the hover is one
        line, interim words still show as they are said.
     9  the logic: a long story is not a request to vent or to stop; an
        emptied box is a new entry; the same guess is not said twice; a no is
        answered and lands on the seat it was about.

   ONLY=1,1b,7 runs those sections and no others, which is how a check is held
   against a deliberately broken copy of the page without waiting for all of
   them.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const path = require('path');
const { chromium } = require('playwright');
const FILE = 'file://' + path.resolve(process.env.ATUNED_FILE || path.join(__dirname, '..', 'source.html')) + '?dev=1';

/* ONLY=1,1b,7 runs those sections and no others: how a check is held against a deliberately broken
   copy of the page without waiting for the whole file */
const ONLY = (process.env.ONLY || '').split(',').map(x => x.trim()).filter(Boolean);
const sel = k => !ONLY.length || ONLY.includes(String(k));
let n = 0; const fails = [];
const ok = (c, m) => { n++; if (!c) fails.push(m); console.log((c ? '  ok    ' : '  FAIL  ') + m); };
const booted = async p => {
  await p.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(600);
  await p.evaluate(() => { if (typeof OB !== 'undefined' && OB.open && typeof obClose === 'function') obClose(); }).catch(() => {});
  await p.waitForTimeout(120); };

/* A STAND-IN MICROPHONE THAT KEEPS A RECORDING THE WAY CHROME DOES (see
   tests/srcchat.js), and adds the three things this file needs: an interim
   result that is not yet a sentence, a recording that ends late after a stop
   (window.__endLag, the way Chrome lags), and the calls it received.
   AND A STAND-IN VOICE, because the line's length is what the hold and the
   tail are measured against: authVoice answers after window.__lat ms, and
   the Audio it is played on ends by itself after window.__autoEnd ms, or
   never, until the check ends it (__end). It fires 'playing' and 'ended' the
   way an element does, which the circle follows. */
const STAND = () => {
  function FakeSR() { FakeSR.made.push(this); this.on = false; this.results = []; this.log = []; }
  FakeSR.made = [];
  FakeSR.prototype.start = function () {
    if (this.on) throw new Error('InvalidStateError: recognition has already started');
    this.on = true; this.results = []; this.log.push('start'); };
  FakeSR.prototype._end = function () { if (!this.on) return; this.on = false; const s = this; setTimeout(() => { if (s.onend) s.onend(); }, window.__endLag || 0); };
  FakeSR.prototype.stop = function () { this.log.push('stop'); this._end(); };
  FakeSR.prototype.abort = function () { this.log.push('abort'); if (this.on && this.onerror) this.onerror({ error: 'aborted' }); this._end(); };
  const fire = (r, from) => r.onresult({ resultIndex: from, results: Object.assign({ length: r.results.length }, r.results) });
  const res = (t, f) => ({ 0: { transcript: t, confidence: 0.9 }, isFinal: f, length: 1 });
  const cur = () => FakeSR.made[FakeSR.made.length - 1];
  window.__mic = {
    FakeSR, cur,
    live: () => !!(cur() && cur().on),
    /* a result the browser has finished with. If an interim one stood at the
       end, this is its final, the same index, as Chrome does. */
    say(t) { const r = cur(); if (!r || !r.on) return false;
      if (r.pend) { r.results[r.results.length - 1] = res(t, true); r.pend = false; } else r.results.push(res(t, true));
      fire(r, r.results.length - 1); return true; },
    interim(t) { const r = cur(); if (!r || !r.on) return false;
      if (r.pend) r.results[r.results.length - 1] = res(t, false); else { r.results.push(res(t, false)); r.pend = true; }
      fire(r, r.results.length - 1); return true; },
    /* delivered whether or not the page asked for it: what a microphone
       picks up off a speaker, handed over anyway */
    force(t) { const r = cur(); if (!r || !r.onresult) return false; r.results.push(res(t, true)); fire(r, r.results.length - 1); return true; }
  };
  window.SpeechRecognition = FakeSR; window.webkitSpeechRecognition = FakeSR;
  window.__aud = []; window.__said = []; window.__lat = 20; window.__autoEnd = 60;
  window.__end = a => { a = a || window.__aud[window.__aud.length - 1]; if (!a || a.ended) return; a.ended = true;
    (a._l.ended || []).forEach(f => f()); if (a.onended) a.onended(); };
  window.Audio = function (u) {
    const a = { src: u, onended: null, onerror: null, ended: false, _l: {},
      addEventListener(ev, fn) { (a._l[ev] = a._l[ev] || []).push(fn); },
      removeEventListener(ev, fn) { if (a._l[ev]) a._l[ev] = a._l[ev].filter(f => f !== fn); },
      play() { window.__aud.push(a); (a._l.playing || []).forEach(f => f());
        if (window.__autoEnd != null) setTimeout(() => window.__end(a), window.__autoEnd); return Promise.resolve(); },
      pause() { (a._l.pause || []).forEach(f => f()); } };
    return a; };
  /* the voice route, in the page: the line it was asked for is recorded here
     and answered after __lat, so a check can put a person's sentence in
     between the request and the sound */
  window.__voiceStub = () => { window.authVoice = function (text) {
    window.__said.push(text);
    return new Promise(res => setTimeout(() => res({ ok: true, blob: new Blob(['x'], { type: 'audio/wav' }) }), window.__lat)); }; };
};

async function open(browser, w, h, opt) {
  const cx = await browser.newContext(Object.assign({ viewport: { width: w, height: h } }, opt || {}));
  await cx.addInitScript(STAND);
  const p = await cx.newPage();
  p.errs = []; p.on('pageerror', e => p.errs.push(String(e && e.message || e)));
  await p.goto(FILE, { waitUntil: 'load' }); await booted(p);
  await p.evaluate(() => { __voiceStub(); setTab(TAB.STORY); render(); });
  await p.waitForTimeout(400);
  p.cx = cx; return p;
}
/* the microphone, pressed the way a person presses it, and waited for until
   the recording is live again (a line is spoken first, and holds it) */
const talk = async p => { await p.evaluate(() => stMic()); await p.waitForFunction(() => __mic.live(), null, { timeout: 8000 }).catch(() => {}); await p.waitForTimeout(80); };
const live = p => p.waitForFunction(() => __mic.live(), null, { timeout: 8000 }).catch(() => {});
/* one thing said, by voice, and the page given the time to answer it */
const say = async (p, t, wait) => { await live(p); const r = await p.evaluate(t => __mic.say(t), t); await p.waitForTimeout(wait == null ? 330 : wait); return r; };
const rows = p => p.evaluate(() => ({ me: SRC_CHAT.filter(r => r.w === 'me').map(r => r.t), src: SRC_CHAT.filter(r => r.w === 'src').map(r => ({ k: r.key, q: r.q })), text: ST_TEXT }));
const fast = p => p.evaluate(() => { SRC_TAIL_MS = 90; });

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  require('./net.js').guardBrowser(browser);

  /* ---------------------------------------------------------------- 1 */
  if (sel('1')) console.log('\n=== 1. the microphone\'s door: no words is not a turn, a short answer is, the door to help is never shut ===');
  if (!sel('1')) {} else {
    const p = await open(browser, 1600, 1000); await fast(p);
    await talk(p);
    const said0 = await p.evaluate(() => __said.length);
    for (const t of ['', '   ', 'uh', 'the', 'um', 'a', 'you', 'oh so', 'er']) await say(p, t, 160);
    const a = await rows(p), g = await p.evaluate(() => ({ said: __said.length, reading: SrcFace.state().reading, engaged: SrcFace.state().engaged,
      draft: (CURP.story && CURP.story.draft) || '', hasFace: !!document.querySelector('#srcface:not([hidden])') }));
    ok(a.me.length === 0 && a.text === '', 'silence, empty and whitespace results, and uh, the, um, a, you, oh so, er, are no turn: no row, no entry text, ' + JSON.stringify(a.me));
    ok(g.said === said0, 'and nothing is said back to them: ' + (g.said - said0) + ' lines asked of the voice after the greeting');
    ok(!g.reading && !g.engaged, 'and the circle reads nothing for them: reading ' + g.reading + ', engaged ' + g.engaged);
    ok(!g.draft, 'and nothing is saved as a draft, so a reload does not show a face over a profile nobody wrote in: ' + JSON.stringify(g.draft));
    for (const t of ['Yes.', 'No.', "I don't know.", 'Okay.', 'Afraid.', 'Mhm.']) await say(p, t, 330);
    const b = await rows(p);
    ok(b.me.join('|') === 'Yes.|No.|I don\'t know.|Okay.|Afraid.|Mhm.', 'a short answer that means something is a turn, every one of them: ' + JSON.stringify(b.me));
    /* the door to help */
    const c0 = (await rows(p)).me.length;
    await say(p, 'I want to die', 330);
    const c = await rows(p), st = await p.evaluate(() => stSafe());
    ok(c.me.length === c0 + 1 && st, 'and the safety door is never refused, a result that trips it is a turn whatever else it is: ' + JSON.stringify(c.me.slice(-1)));
    /* and the shortest of them, one or two words, which is the length a noise filter is written for. Each
       is delivered with the safe state cleared first so it is the phrase and not the one before that is read */
    const shorts = ['Suicide.', 'Kill myself.', 'Self harm.', 'Suicidal.'];
    let landed = 0;
    for (const t of shorts) { const m0 = (await rows(p)).me.length; await say(p, t, 330); if ((await rows(p)).me.length === m0 + 1) landed++; }
    ok(landed === shorts.length, 'a one or two word phrase from the safety table is a turn, every one of the ' + shorts.length + ': ' + landed + ' landed');
    /* a person who did not catch a line says what, and that is a question and not a sound */
    const w0 = (await rows(p)).me.length; await say(p, 'What?', 330);
    ok((await rows(p)).me.length === w0 + 1, 'and "what?" is a turn');
    ok(!p.errs.length, 'no page errors: ' + p.errs.join(' | '));
    await p.cx.close();
  }

  /* ---------------------------------------------------------------- 1b */
  if (sel('1b')) console.log('\n=== 1b. its own voice coming back is not a turn ===');
  if (!sel('1b')) {} else {
    const p = await open(browser, 1600, 1000); await fast(p);
    await talk(p);
    const greet = await p.evaluate(() => __said[0]);
    await say(p, greet, 250);
    await say(p, 'what are we', 250);
    await say(p, 'we talking about', 250);
    await say(p, 'talking about today', 250);
    const a = await rows(p);
    ok(a.me.length === 0, 'its greeting said back whole, as its first words, as its middle and as its end, is nothing, and the line before it stays the one it is held against: ' + JSON.stringify(a.me));
    await say(p, 'my boss called me in again', 330);
    const b = await rows(p);
    ok(b.me.length === 1 && b.me[0] === 'my boss called me in again', 'and what a person says next is a turn: ' + JSON.stringify(b.me));
    /* a word of it said much later is the person's: the window is closed. The line held against is put back
       to the greeting, because the reply to the turn above is now the last thing it said and these words
       are not an echo of that one for a second reason, which would let a window that never closes through */
    await p.evaluate(g => { SRC_VOICE.said = g; SRC_VOICE.endAt = performance.now() - (typeof SRC_ECHO_MS === 'number' ? SRC_ECHO_MS : 6000) - 500; }, greet);
    await say(p, 'what are we talking about', 330);
    const c = await rows(p);
    ok(c.me.length === 2, 'and past the echo window the same words are theirs: ' + JSON.stringify(c.me));
    await p.cx.close();
  }

  /* ---------------------------------------------------------------- 2 */
  if (sel('2')) console.log('\n=== 2. the hold outlasts the line, and nothing is heard in it ===');
  if (!sel('2')) {} else {
    const p = await open(browser, 1600, 1000);
    await p.evaluate(() => { window.__autoEnd = null; });
    await p.evaluate(() => stMic());
    await p.waitForFunction(() => __aud.length >= 1, null, { timeout: 8000 }).catch(() => {});
    const tail = await p.evaluate(() => typeof SRC_TAIL_MS === 'number' ? SRC_TAIL_MS : 0);
    const during = await p.evaluate(() => ({ live: __mic.live(), hush: ST_HUSH }));
    await p.evaluate(() => __end());
    await p.waitForTimeout(150);
    /* a result a late echo hands in, in the tail */
    const mid = await p.evaluate(() => { const was = SRC_CHAT.length; __mic.force('my boss called me in again today'); return { hush: ST_HUSH, live: __mic.live(), rows: SRC_CHAT.length - was }; });
    ok(tail >= 300 && tail <= 1000, 'the tail is a stated number of milliseconds, read off the page: ' + tail);
    ok(during.hush && !during.live, 'while the greeting plays the recording is held: ' + JSON.stringify(during));
    ok(mid.hush && !mid.live && mid.rows === 0, '150 ms after it ended the recording is still off, and a result handed in then is dropped: ' + JSON.stringify(mid));
    await p.waitForTimeout(tail + 300);
    const back = await p.evaluate(() => ({ live: __mic.live(), hush: ST_HUSH, rows: SRC_CHAT.filter(r => r.w === 'me').length }));
    ok(back.live && !back.hush && back.rows === 0, 'and once the tail is out it is heard again, and the dropped result never came back: ' + JSON.stringify(back));
    await p.cx.close();
  }

  /* ---------------------------------------------------------------- 3 */
  if (sel('3')) console.log('\n=== 3. a person mid sentence when a line arrives is not talked over, and the sentence is kept ===');
  if (!sel('3')) {} else {
    const p = await open(browser, 1600, 1000); await fast(p);
    await p.evaluate(() => { window.__lat = 1000; });
    await p.evaluate(() => stMic());
    await p.waitForFunction(() => __mic.live(), null, { timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(250);
    await p.evaluate(() => __mic.interim('I was thinking about what happened with my'));
    await p.waitForTimeout(1200);
    const mid = await p.evaluate(() => ({ played: __aud.length, live: __mic.live(), log: __mic.cur().log.join(','), liveText: ST_LIVE }));
    await p.evaluate(() => __mic.say('I was thinking about what happened with my boss'));
    await p.waitForTimeout(330);
    const a = await rows(p);
    ok(mid.played === 0 && mid.live && mid.log.indexOf('abort') < 0, 'the line that arrived over their sentence was not played, and the recording was not aborted: ' + JSON.stringify(mid));
    ok(a.me.length === 1 && a.me[0] === 'I was thinking about what happened with my boss', 'and the sentence they were saying landed whole as their turn: ' + JSON.stringify(a.me));
    await p.cx.close();
  }

  /* ---------------------------------------------------------------- 4 */
  if (sel('4')) console.log('\n=== 4. a recording that ends late after a stop does not turn the new one off ===');
  if (!sel('4')) {} else {
    const p = await open(browser, 1600, 1000); await fast(p);
    await p.evaluate(() => { window.__endLag = 400; });
    await talk(p);
    await p.evaluate(() => stMic());            /* off */
    await p.waitForTimeout(150);
    await p.evaluate(() => stMic());            /* and on again */
    await p.waitForFunction(() => __mic.live(), null, { timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(800);                /* the old recording's end lands in here */
    const a = await p.evaluate(() => ({ listen: ST_LISTEN, want: ST_WANT_LISTEN, live: __mic.live(), on: /\bon\b/.test((document.getElementById('stmic') || {}).className || ''), made: __mic.FakeSR.made.length }));
    ok(a.made >= 2 && a.listen && a.want && a.live, 'the new recording is live and the page still knows it: ' + JSON.stringify(a));
    ok(a.on, 'and the button still says it is on');
    await say(p, 'my boss called me in again', 330);
    const b = await rows(p);
    ok(b.me.length === 1, 'and what is said into it lands: ' + JSON.stringify(b.me));
    await p.cx.close();
  }

  /* ---------------------------------------------------------------- 5 */
  if (sel('5')) console.log('\n=== 5. the opener is said once a conversation ===');
  if (!sel('5')) {} else {
    const p = await open(browser, 1600, 1000); await fast(p);
    const opener = await p.evaluate(() => SRC_OPEN);
    await talk(p);
    for (let i = 0; i < 3; i++) { await p.evaluate(() => stMic()); await p.waitForTimeout(120); await talk(p); }
    const a = await p.evaluate(() => __said.slice());
    ok(a.length === 4 && a.filter(x => x.indexOf(opener) >= 0).length === 1, 'four presses of Talk, the opener once: ' + JSON.stringify(a));
    ok(a.slice(1).every(x => x.indexOf('?') < 0 && x !== a[0]), 'and the presses after the first say a short line that is not a question: ' + JSON.stringify(a.slice(1)));
    ok(a.slice(2).every((x, i) => x !== a[i + 1]), 'and not the same one twice running: ' + JSON.stringify(a.slice(1)));
    await say(p, 'Hello?', 400); await say(p, 'Can you hear me?', 400); await say(p, 'Can you hear me again?', 400); await say(p, 'Hi there', 400);
    const b = await p.evaluate(() => __said.slice(4));
    ok(b.length === 4 && b.every(x => x.indexOf(opener) < 0), 'hello and can you hear me, four times, are answered and never with the opener: ' + JSON.stringify(b));
    const act = await p.evaluate(() => [].concat(...Object.values(SRC_ACT_SAY), SRC_HEARD).filter(x => /on the right|talking about today/i.test(x)));
    ok(act.length === 0, 'and no line it can say describes a thread on the right of the screen, or asks the opener: ' + JSON.stringify(act));
    /* a press with the person's words already in the entry */
    const n0 = await p.evaluate(() => __said.length);
    await p.evaluate(() => stMic()); await p.waitForTimeout(120); await talk(p);
    const c = await p.evaluate(n0 => __said.slice(n0), n0);
    ok(c.length === 1 && c[0].indexOf(opener) < 0, 'a press in the middle of a conversation says no opener: ' + JSON.stringify(c));
    /* Commit is a new conversation, and it is greeted once more */
    await p.evaluate(() => { stCommit(); });
    await p.waitForTimeout(500);
    const n1 = await p.evaluate(() => __said.length);
    await p.evaluate(() => { if (ST_LISTEN) stMic(); }); await p.waitForTimeout(120); await talk(p);
    const d = await p.evaluate(n1 => __said.slice(n1), n1);
    ok(d.length >= 1 && d[d.length - 1].indexOf(opener) >= 0, 'after Commit the next press greets, once: ' + JSON.stringify(d));
    await p.cx.close();
  }

  /* ---------------------------------------------------------------- 6 */
  if (sel('6')) console.log('\n=== 6. fourteen turns of silence, noise, echo, greetings, complaints and stories ===');
  if (!sel('6')) {} else {
    const p = await open(browser, 1600, 1000); await fast(p);
    const opener = await p.evaluate(() => SRC_OPEN);
    await talk(p);
    const greet = await p.evaluate(() => __said[0]);
    const SCRIPT = [
      ['', 'silence'], ['uh', 'noise'], [greet, 'echo'], ['Hello?', 'greet'], ['Can you hear me?', 'check'],
      ['My boss gave my idea to someone else.', 'story'], ['I left the room.', 'story'], ['um', 'noise'],
      ['Yeah so it was a weird day.', 'story'], ['You keep repeating yourself.', 'complain'],
      ['Okay.', 'brief'], ['Thanks.', 'thanks'], ['My sister called last night.', 'story'], ['Bye.', 'bye']];
    const asked = [];
    for (const [t, kind] of SCRIPT) {
      const before = await p.evaluate(() => __said.length);
      await say(p, t, 420);
      const after = await p.evaluate(b => __said.slice(b), before);
      asked.push({ t, kind, said: after });
    }
    const all = await p.evaluate(() => __said.slice()), r = await rows(p);
    const real = SCRIPT.filter(x => !['silence', 'noise', 'echo'].includes(x[1])).length;
    ok(r.me.length === real, 'the ' + (SCRIPT.length - real) + ' that are silence, noise or its own voice are no turn, the other ' + real + ' are: ' + r.me.length);
    ok(asked.filter(a => ['silence', 'noise', 'echo'].includes(a.kind)).every(a => a.said.length === 0), 'and the ones that are no turn are not answered');
    ok(asked.filter(a => !['silence', 'noise', 'echo'].includes(a.kind)).every(a => a.said.length === 1), 'every turn that is one is answered once, aloud: ' + JSON.stringify(asked.map(a => a.said.length)));
    ok(all.filter(x => x.indexOf(opener) >= 0).length <= 1, 'the opener was said at most once in the whole conversation: ' + all.filter(x => x.indexOf(opener) >= 0).length);
    ok(all.every((x, i) => i === 0 || x !== all[i - 1]), 'no line twice running');
    ok(new Set(all).size === all.length, 'and no line twice at all in fourteen turns: ' + JSON.stringify(all.filter((x, i) => all.indexOf(x) !== i)));
    ok(!all.some(x => /I.m listening/.test(x)), 'and "I\'m listening" is not what it says to a turn with nothing in it: ' + JSON.stringify(all.filter(x => /listening/i.test(x))));
    const by = k => (asked.find(a => a.kind === k) || { said: [''] }).said[0];
    ok(/“my boss”/i.test(asked[5].said[0]) && /“I left”/.test(asked[6].said[0]), 'what it can say back of what was said, it does, in the person\'s own words: ' + JSON.stringify([asked[5].said[0], asked[6].said[0]]));
    ok(r.src.some(x => x.k === 'act|complain') && r.src.some(x => x.k === 'act|thanks') && r.src.some(x => x.k === 'act|bye') && r.src.some(x => x.k === 'act|check') && r.src.some(x => x.k === 'act|greet'),
      'a complaint that it repeats, a thanks, a goodbye, a check and a greeting are each answered as what they are: ' + JSON.stringify(r.src.map(x => x.k)));
    ok(/repeat|already|again|that one/i.test(by('complain')), 'the complaint is taken and not argued with: ' + JSON.stringify(by('complain')));
    ok(r.src.slice(-1)[0].k === 'act|bye' || r.src.some(x => x.k === 'act|bye'), 'and the conversation ends on its goodbye');
    ok(!p.errs.length, 'no page errors: ' + p.errs.join(' | '));
    await p.cx.close();
  }

  /* ---------------------------------------------------------------- 7 */
  if (sel('7')) console.log('\n=== 7. the circle is at rest until a sentence with a seat in it is read, and goes back to rest ===');
  if (sel('7')) for (const rec of ['blank', 'loaded']) {
    const p = await open(browser, 1600, 1000); await fast(p);
    if (rec === 'loaded') { await p.evaluate(() => { loadP(0); setTab(TAB.STORY); render(); }); await p.waitForTimeout(600); }
    const at0 = await p.evaluate(() => { const s = SrcFace.state(); return { engaged: s.engaged, reading: s.reading, addrs: s.addrs }; });
    await talk(p);
    await p.waitForTimeout(2800);                  /* the greeting plays and ends, and the hold with it */
    const a = await p.evaluate(() => { const s = SrcFace.state(); return { engaged: s.engaged, reading: s.reading, speaking: s.speaking, word: s.word, said: __said.length, aud: __aud.length }; });
    ok(at0.addrs > 0 && !at0.engaged && !at0.reading, rec + ': at load the face holds its addresses and is at rest: ' + JSON.stringify(at0));
    ok(a.aud >= 1 && !a.speaking && !a.engaged && !a.reading && a.word === '', rec + ': Talk pressed, the greeting spoken and over, nothing said, the microphone silent: it is still at rest, ' + JSON.stringify(a));
    await say(p, 'um', 300); await say(p, 'the', 300);
    const b = await p.evaluate(() => { const s = SrcFace.state(); return { engaged: s.engaged, reading: s.reading }; });
    ok(!b.engaged && !b.reading, rec + ': noise that is refused starts no reading: ' + JSON.stringify(b));
    await say(p, 'Yes.', 300);
    const c = await p.evaluate(() => { const s = SrcFace.state(); return { engaged: s.engaged, reading: s.reading }; });
    ok(!c.engaged && !c.reading, rec + ': a yes is a turn and is answered, and the circle reads nothing for it: ' + JSON.stringify(c));
    if (rec === 'blank') {
      await say(p, 'I was afraid all night.', 330);
      const d = await p.evaluate(() => { const s = SrcFace.state(); return { engaged: s.engaged, reading: s.reading, held: s.held }; });
      ok(d.engaged && d.reading, 'a sentence with a seat in it is read: ' + JSON.stringify(d));
      const t0 = Date.now();
      const back = await p.waitForFunction(() => { const s = SrcFace.state(); return !s.engaged && !s.reading; }, null, { timeout: 26000 }).then(() => true, () => false);
      const e = await p.evaluate(() => { const s = SrcFace.state(); return { engaged: s.engaged, reading: s.reading, word: s.word }; });
      ok(back && !e.engaged, 'and when the reading has been let go the circle is at rest again, after ' + Math.round((Date.now() - t0) / 100) / 10 + ' s: ' + JSON.stringify(e));
    }
    await p.cx.close();
  }
  if (!sel('7')) {} else {
    /* the circle draws no word of its own at its centre, and still draws the
       seat labels, so this is not a check on a canvas that draws nothing */
    const p = await open(browser, 1600, 1000); await fast(p);
    await p.evaluate(() => { window.__ft = []; const o = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (t) { if (this.canvas && this.canvas.id === 'srcface') window.__ft.push(String(t)); return o.apply(this, arguments); }; });
    // The desktop Story hero may mount the face at zero width. Test the
    // actual visible Dashboard canvas, not an unpaintable host.
    await p.evaluate(() => { STV.dash = true; stRender(); });
    const mounted = await p.waitForFunction(() => {
      const cv = document.getElementById('srcface'), state = SrcFace.state();
      return cv && !cv.hidden && cv.getBoundingClientRect().width > 100
        && cv.getBoundingClientRect().height > 100 && state.running;
    }, null, { timeout: 8000 }).then(() => true, () => false);
    await talk(p);
    await say(p, 'I was afraid all night. I felt so guilty about it.', 330);
    // Keep observing through the original 3.5s window, and wait for the
    // actual seat-label positive control within a bounded paint budget.
    await p.waitForTimeout(3500);
    const drewSeat = await p.waitForFunction(() => window.__ft.some(t =>
      BANDS.some(b => t === b || t.startsWith(b + ', '))), null,
      { timeout: 8000 }).then(() => true, () => false);
    const ft = await p.evaluate(() => window.__ft.slice());
    const words = ft.filter(t => /^(Listening|Weighing|Found|Holding|Answering|Waiting)$/.test(t));
    const diag = await p.evaluate(() => {
      const cv = document.getElementById('srcface'), st = SrcFace.state();
      return { w: cv?.clientWidth, h: cv?.clientHeight, running: st.running, reading: st.reading };
    });
    ok(mounted && drewSeat, 'the visible circle drew canonical seat labels: ' + JSON.stringify([...new Set(ft)].slice(0, 6)) + ' canvas ' + JSON.stringify(diag));
    ok(words.length === 0, 'and none of it is a state word at the centre: ' + JSON.stringify([...new Set(words)]));
    await p.cx.close();
  }

  if (!sel('7')) {} else {
    /* "ANIMATING" IS A NUMBER. The owner: "Animations are automatically playing." The state flag above says
       the circle is at rest, and this says it LOOKS at rest: pixels read off the canvas, the way
       tools/monitor.js counts lit pixels. A returning person's page (a record with a reading, the face on
       screen, nothing said this visit), on the Dashboard where the pattern trace shows most, measured at
       rest, then with Talk pressed, the greeting spoken and over, and a silent microphone. Measured on
       c2bf52a2, the build before the round, on that day: changed pixels per 700 ms from 3.7 to 7.5 percent and the
       gold trace from 10 to 47 pixels, engaged for the rest of the page's life. The limits are the rest reading itself plus a
       margin for the ambient breath, both read off the same page in the same run: a fifth over it in pixels
       changed, ten pixels over it in gold. */
    const p = await open(browser, 1600, 1000); await fast(p);
    await p.evaluate(async () => { ST_TEXT = 'I was afraid all night. I felt so ashamed when he called.'; ST_PARSED = parseStory(ST_TEXT); stRefresh(); stCommit();
      await new Promise(r => setTimeout(r, 400)); SrcFace.clear(); setTab(TAB.STORY); STV.dash = true; render(); stRender(); });
    await p.waitForTimeout(1500);
    const probe = () => p.evaluate(async () => {
      const cv = document.getElementById('srcface'); if (!cv || cv.getBoundingClientRect().width < 100) return { on: false };
      const grab = () => cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
      const a = grab(); await new Promise(r => setTimeout(r, 700)); const b = grab();
      let diff = 0, gold = 0; const n = a.length / 4;
      for (let i = 0; i < a.length; i += 4) {
        if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 24) diff++;
        if (b[i] > 200 && b[i + 1] > 170 && b[i + 2] < 150 && b[i + 3] > 200) gold++; }
      return { on: true, pct: 100 * diff / n, gold, engaged: SrcFace.state().engaged }; });
    const mean = xs => xs.reduce((a, x) => a + x, 0) / xs.length;
    const rest = []; for (let i = 0; i < 3; i++) { rest.push(await probe()); await p.waitForTimeout(500); }
    await talk(p); await p.waitForTimeout(1800);
    const quiet = []; for (let i = 0; i < 5; i++) { quiet.push(await probe()); await p.waitForTimeout(400); }
    const rp = mean(rest.map(x => x.pct)), qp = mean(quiet.map(x => x.pct)), rg = Math.max(...rest.map(x => x.gold)), qg = mean(quiet.map(x => x.gold));
    ok(rest.every(x => x.on) && quiet.every(x => x.on), 'the circle is on screen to be measured, on a record with a reading');
    ok(quiet.every(x => !x.engaged), 'Talk pressed, the greeting over, nothing said: the circle is not engaged in any of the ' + quiet.length + ' samples');
    ok(qp <= rp * 1.2 + 0.3, 'and it moves no more than it did at rest: ' + qp.toFixed(2) + ' percent of its pixels change in 700 ms, at rest ' + rp.toFixed(2));
    ok(qg <= rg + 10, 'and the gold trace is not drawn: ' + Math.round(qg) + ' gold pixels against ' + rg + ' at rest');
    await p.cx.close();
  }

  /* ---------------------------------------------------------------- 8 */
  if (sel('8')) console.log('\n=== 8. what he struck: no Listening, no 0 words hidden, a hover of one line ===');
  if (sel('8')) for (const [w, h] of [[1600, 1000], [390, 844]]) {
    const p = await open(browser, w, h); await fast(p);
    await talk(p);
    await p.waitForTimeout(600);
    /* every piece of text a person can see that says Listening: an element
       that has a box bigger than a pixel, and is not clipped to nothing */
    const seen = () => p.evaluate(() => {
      const out = [];
      document.querySelectorAll('body *').forEach(e => {
        const own = [...e.childNodes].filter(c => c.nodeType === 3).map(c => c.textContent).join('');
        if (!/listening/i.test(own)) return;
        const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
        if (r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05 && cs.clipPath === 'none') out.push((e.id || e.className || e.tagName) + ': ' + own.trim().slice(0, 40));
      });
      const st = document.getElementById('status'), sv = st && st.offsetParent !== null && /listening/i.test(st.textContent) ? st.textContent.trim().slice(0, 50) : '';
      return { out, status: sv };
    });
    const a = await seen();
    ok(a.out.length === 0 && !a.status, w + ': Talk on and nothing said, the word Listening is nowhere a person can see it: ' + JSON.stringify(a));
    const cap = await p.evaluate(() => { const e = document.getElementById('micsay'); if (!e) return null; const r = e.getBoundingClientRect();
      return { live: e.getAttribute('aria-live'), text: e.textContent, w: Math.round(r.width), h: Math.round(r.height) }; });
    ok(cap && cap.live === 'polite' && /microphone/i.test(cap.text) && cap.w <= 2 && cap.h <= 2, w + ': a screen reader is still told the microphone is on, by a line nobody else sees: ' + JSON.stringify(cap));
    await p.evaluate(() => __mic.interim('my boss called me'));
    await p.waitForTimeout(150);
    const iv = await p.evaluate(() => { const e = document.getElementById('stlivecap'); const r = e.getBoundingClientRect(); return { text: e.textContent, w: Math.round(r.width), h: Math.round(r.height) }; });
    ok(iv.text === 'my boss called me' && iv.w > 20 && iv.h > 8, w + ': and the person\'s own words are shown as they say them: ' + JSON.stringify(iv));
    /* the hover. His later ruling the same day, on the silence round: "this
       tooltip isn't working. Let's turn that off for now." So the canvas
       carries no title at all. The one line this round wrote is not kept:
       on the integration of 18 November his ruling was that no one line
       tooltip survives from this round, so the key kept for when the hover
       is turned back on is the silence round's, and tests/talksilence.js
       holds its words. This gate holds only that no hover is hung. */
    const tip = await p.evaluate(() => { const c = document.getElementById('srcface') || {}; return { title: c.title || '', tipAttr: c.getAttribute ? (c.getAttribute('data-tip') || '') : '', key: (window.SrcFace && typeof SrcFace.key === 'function') ? SrcFace.key() : '' }; });
    ok(!tip.title && !tip.tipAttr, w + ': the circle carries no hover at all, the 18 November ruling: ' + JSON.stringify(tip));
    await p.cx.close();
  }
  if (sel('8')) for (const [w, h, view] of [[1600, 1000, 'hero'], [1600, 1000, 'dash'], [390, 844, 'hero'], [390, 844, 'dash']]) {
    const p = await open(browser, w, h);
    if (view === 'dash') await p.evaluate(() => { STV.dash = true; stRender(); });
    await p.waitForTimeout(300);
    const none = await p.evaluate(() => { const e = document.getElementById('stmask'); const r = e ? e.getBoundingClientRect() : null;
      return { text: /\b0 words? hidden/i.test(document.body.innerText), shown: !!(r && r.width > 0 && r.height > 0) }; });
    ok(!none.text && !none.shown, w + ' ' + view + ': with nothing hidden there is no chip and no "0 words hidden": ' + JSON.stringify(none));
    await p.evaluate(() => { srcTurnCommit('I was so f***ing angry at him.'); });
    await p.waitForTimeout(400);
    const one = await p.evaluate(() => { const e = document.getElementById('stmask'); const r = e ? e.getBoundingClientRect() : null;
      return { shown: !!(r && r.width > 0 && r.height > 0), label: !!document.getElementById('stmaskn') && document.getElementById('stmaskn').offsetParent !== null,
        text: /words? hidden/i.test(document.body.innerText), tip: (e && (e.getAttribute('data-tip') || e.getAttribute('aria-label')) || '').length > 20 }; });
    /* the Dashboard's talking view never draws the chip at all (dashTB in
       stRender, 16 November: no text in the face's field), so there it is
       absent and not a count; every view that does draw it draws the star */
    ok(view === 'dash' ? (!one.shown && !one.text) : (one.shown && !one.label && !one.text && one.tip), w + ' ' + view + ': with a word really hidden it is the star alone, and what it means is in its hover (the Dashboard\'s talking view draws none): ' + JSON.stringify(one));
    await p.cx.close();
  }

  /* ---------------------------------------------------------------- 9 */
  if (sel('9')) console.log('\n=== 9. the logic ===');
  if (!sel('9')) {} else {
    const p = await open(browser, 1600, 1000);
    /* a long turn is a story and not a request */
    const v = await p.evaluate(() => {
      const out = {};
      for (const t of ['I wish my mother would just listen to me.', 'I just want to talk about my day.', 'My dad told me to stop talking at dinner.',
        'I told her I need to vent about work, my boss yelled at me for an hour and I could not say anything back.']) {
        SRC_VENT = false; SRC_PASSED = false; srcIntentLand(t); out[t.slice(0, 24)] = { vent: SRC_VENT, passed: SRC_PASSED }; }
      SRC_VENT = false; SRC_PASSED = false; srcIntentLand('Never mind.'); out.nevermind = { vent: SRC_VENT, passed: SRC_PASSED };
      SRC_VENT = false; SRC_PASSED = false; srcIntentLand("Let's move on."); out.moveon = { vent: SRC_VENT, passed: SRC_PASSED };
      SRC_VENT = false; SRC_PASSED = false; srcIntentLand('I just want to vent.'); out.vent = { vent: SRC_VENT, passed: SRC_PASSED };
      SRC_VENT = false; SRC_PASSED = false; return out; });
    const longs = Object.keys(v).filter(k => !/nevermind|moveon|^vent$/.test(k));
    ok(longs.every(k => !v[k].vent && !v[k].passed), 'a long turn that holds a phrase is a story, it sets neither vent nor Move on: ' + JSON.stringify(v));
    ok(v.nevermind.passed && v.moveon.passed && v.vent.vent, 'while "never mind", "let\'s move on" and "I just want to vent" still do');
    await p.cx.close();
  }
  if (!sel('9')) {} else {
    const p = await open(browser, 1600, 1000);
    /* an emptied box is a new entry */
    await p.evaluate(() => { for (const t of ['I was afraid at work.', 'Still afraid this morning.', 'That is not me.', 'I just want to vent.']) srcTurnCommit(t); stType(); });
    await p.waitForTimeout(300);
    const a = await p.evaluate(() => ({ vent: SRC_VENT, verd: SRC_VERDICTS.length, log: SRC_LOG.length, rows: SRC_CHAT.filter(r => r.w === 'me').length, box: !!document.getElementById('sttext') }));
    await p.fill('#sttext', ''); await p.waitForTimeout(250);
    const b = await p.evaluate(() => ({ vent: SRC_VENT, verd: SRC_VERDICTS.length, log: SRC_LOG.length, rows: SRC_CHAT.filter(r => r.w === 'me').length, passed: SRC_PASSED, text: ST_TEXT }));
    ok(a.box && a.rows === 4 && (a.vent || a.verd), 'before: the box is open and the entry carries a vent and a no: ' + JSON.stringify(a));
    ok(b.text === '' && !b.vent && !b.verd && !b.log && !b.rows && !b.passed, 'select all and delete is a new entry: nothing of the last one is still in force: ' + JSON.stringify(b));
    await p.cx.close();
  }
  if (!sel('9')) {} else {
    const p = await open(browser, 1600, 1000);
    /* the same guess is not said twice running */
    await p.evaluate(() => { srcTurnCommit('I was afraid he would fire me.'); });
    await p.waitForTimeout(150);
    await p.evaluate(() => { srcTurnCommit('Still afraid when he called again.'); });
    await p.waitForTimeout(150);
    const r = await rows(p), guess = r.src.filter(x => /My guess is it sits/.test(x.q));
    ok(r.src.length >= 2 && guess.length <= 1, 'a guess about a seat is said once, not in two replies running: ' + JSON.stringify(r.src.map(x => x.q)));
    await p.cx.close();
  }
  if (!sel('9')) {} else {
    const p = await open(browser, 1600, 1000);
    /* a no is answered, and is about the seat it was said about */
    await p.evaluate(() => { for (const t of ['I was afraid at work.', 'Still afraid this morning.', 'Can we talk about something else?', 'My jaw is so tight.']) srcTurnCommit(t); });
    await p.waitForTimeout(200);
    const before = await p.evaluate(() => { const l = SRC_CHAT.filter(r => r.w === 'src').pop(); return { key: l.key, q: l.q }; });
    await p.evaluate(() => srcTurnCommit('That is not me.'));
    await p.waitForTimeout(200);
    const after = await p.evaluate(() => ({ verd: SRC_VERDICTS.map(v => v.seat + ':' + v.v), last: (() => { const l = SRC_CHAT.filter(r => r.w === 'src').pop(); return { key: l.key, q: l.q }; })() }));
    const seat = (/^(?:ask|say)\|([^|]+)/.exec(before.key) || [])[1];
    ok(seat && after.verd.length === 1 && after.verd[0] === seat + ':no', 'the no lands on the seat Source AI had just said, ' + JSON.stringify([before.key, after.verd]));
    ok(after.last.key === 'act|reject' && !/following you|Keep going|Still here/.test(after.last.q), 'and it is answered as a no and not as more talk: ' + JSON.stringify(after.last));
    await p.cx.close();
  }

  await browser.close();
  console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed =====');
  if (fails.length) { fails.forEach(f => console.log('  FAIL  ' + f)); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
