#!/usr/bin/env node
/* ============================================================
   THE VOICE IS ELEVENLABS AND THERE IS NO FALLBACK. P0, 9 October.

   env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=$PW_DIR \
     node tests/voice.js
   VOICE_HTML=file     runs against another build, for checking the checker

   The owner, 9 October: "fix the 11 Labs voice. The audio is still
   defaulting to the Claude default voice, and I want that removed so that
   there's no fallback to it. Add that to your P0. It's a blocker."

   The default voice he heard was the browser's own built in speech, which the
   release used when the studio voice was off, when nobody was signed in, and
   when the studio voice failed. It is gone. This gate holds the three things
   that keep it gone:

     1. the source never names the browser's speech calls, anywhere a person's
        browser could run them (atuned_src, the funnel pages);
     2. a spy stands where the browser's speech object is, and a whole release
        is walked three ways, signed out against a server that answers with
        audio, signed out against a server that refuses, and signed in against
        a server that answers. The spy is touched by none of them, not once;
     3. each way ends in words the person can read, and none of them asks
        for a sign in (the owner, 9 October: "I don't want it to have to sign
        in or anything special"): a signed out person is heard through a
        device code the browser makes and keeps; refused, the screen says the
        run reads on the screen, once, and the server is asked once and not
        once per line; signed in, the request carries the session instead.

   A GATE THAT PASSES BY NEVER RUNNING THE THING IS THE FAILURE THIS FILE
   EXISTS TO NOT REPEAT, so each way also checks that the run really did go to
   its end, and the spy is checked against a known bad case first: it is armed
   in a page that does call the browser's speech and must count it.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const FILE = 'file://' + (process.env.VOICE_HTML ? path.resolve(process.env.VOICE_HTML) : path.join(ROOT, 'source.html'));
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) { PASS++; console.log('  ok    ' + m); } else { FAIL++; console.log('  FAIL  ' + m); } };
const booted = async p => { try { await p.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 15000 }); } catch (e) {} };

/* ---- 1. the source, read as text ---- */
console.log('\n=== the source never reaches for the browser\'s speech ===');
const BAN = /speechSynthesis|SpeechSynthesisUtterance|SpeechSynthesisVoice|\bgetVoices\s*\(/;
function walk(dir, out) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { if (f.name === 'dist' || f.name === 'node_modules') continue; walk(p, out); }
    else if (/\.(js|html|sh)$/.test(f.name)) out.push(p);
  }
  return out;
}
const files = walk(path.join(ROOT, 'atuned_src'), []).concat(
  fs.readdirSync(path.join(ROOT, 'funnel')).filter(f => /\.(html|js)$/.test(f)).map(f => path.join(ROOT, 'funnel', f)));
const hits = [];
for (const f of files) {
  fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => { if (BAN.test(l)) hits.push(path.relative(ROOT, f) + ':' + (i + 1) + ' ' + l.trim().slice(0, 100)); });
}
ok(files.length > 50, 'the scan read ' + files.length + ' source files, so it is not passing on an empty list');
ok(hits.length === 0, 'none of them names the browser\'s speech calls' + (hits.length ? ': ' + hits.slice(0, 4).join(' | ') : ''));

/* a small valid sound, so an audio element can really play and end */
function wav(ms) {
  const rate = 8000, n = Math.floor(rate * ms / 1000), b = Buffer.alloc(44 + n, 128);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24);
  b.writeUInt32LE(rate, 28); b.writeUInt16LE(1, 32); b.writeUInt16LE(8, 34); b.write('data', 36); b.writeUInt32LE(n, 40);
  return b;
}

/* the spy: any read of window.speechSynthesis counts, and so does any call */
const SPY = () => {
  window.__ssTouch = 0;
  const fake = { speak() { window.__ssTouch++; }, cancel() { window.__ssTouch++; }, getVoices() { window.__ssTouch++; return []; },
    addEventListener() { window.__ssTouch++; }, speaking: false, pending: false };
  Object.defineProperty(window, 'speechSynthesis', { get() { window.__ssTouch++; return fake; }, configurable: true });
};

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--autoplay-policy=no-user-gesture-required'] });

  /* ---- 2. the spy, checked against a known bad case ---- */
  console.log('\n=== the spy counts when something does call the browser\'s speech ===');
  {
    const p = await browser.newPage();
    await p.addInitScript(SPY);
    await p.goto('about:blank');
    const n = await p.evaluate(() => { try { speechSynthesis.speak({}); } catch (e) {} return window.__ssTouch; });
    ok(n >= 1, 'a page that calls it is counted, ' + n + ' touches');
    await p.close();
  }

  /* ---- 3. a whole release, three ways ---- */
  async function runWay(name, setup, route) {
    console.log('\n=== a whole release, ' + name + ' ===');
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.addInitScript(SPY);
    const asked = [];
    page.on('request', r => { if (/\/v1\/voice\/synthesize/.test(r.url())) asked.push({ auth: r.headers()['authorization'] || '', body: r.postData() || '' }); });
    if (route) await page.route('https://voice.stub.test/**', route);
    await page.goto(FILE, { waitUntil: 'load' }); await booted(page);
    const r = await page.evaluate(async setup => {
      REL_WORD_S = 0.0004; REL_GAP_S = 0.001; REL_HEAD_S = 0; REL_FRAME_S = 0;
      loadP(0); CHARGES.forEach(c => { S.charge[c] = 7; });
      CURP.ui.voice = true; CURP.ui.tone = false;
      AUTH_API = 'https://voice.stub.test';
      authForget();
      if (setup.signed) authKeep({ token: 'tok_test', email: 'v@x.co' });
      let audios = 0; const A = window.Audio;
      window.Audio = function (u) { audios++; return new A(u); };
      const ids = compute().carrying.slice(0, 1).map(n => n.i);
      relPick(ids);
      const d = document.getElementById('reldose'); d.value = '1'; d.dispatchEvent(new Event('change'));
      const row = relVoiceRow().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      /* typeof guards, so the build from before this ruling fails these checks
         in words and does not die on a missing name */
      const wantedOn = typeof relVoiceWanted === 'function' ? relVoiceWanted() : null,
        canNow = typeof relVoiceCan === 'function' ? relVoiceCan() : null,
        onNow = typeof relVoiceOn === 'function' ? relVoiceOn() : null;
      const go = document.getElementById('relgo');
      if (!go) return { go: false };
      go.click();
      const t0 = Date.now();
      while (!(RUN.phase === 'done' && RUN.cool >= COOLING.length) && Date.now() - t0 < 120000)
        await new Promise(r => setTimeout(r, 50));
      const out = { go: true, done: RUN.phase === 'done' && RUN.cool >= COOLING.length, row, wantedOn, canNow, onNow,
        status: (document.getElementById('status') || {}).textContent || '', lost: RUN.studioLost, audios, ss: window.__ssTouch,
        devStored: (typeof STORE_BOUND !== 'undefined' && STORE_BOUND) ? STORE.get('source.voicedev') : null,
        lines: (RUN.plan || []).length };
      relClose();
      return out;
    }, setup);
    ok(r.go, 'the setup offers Run release on the person\'s own record');
    ok(r.done, 'and the run really went to its end');
    ok(r.ss === 0, 'the browser\'s own speech was touched ' + r.ss + ' times, and it must be none');
    ok(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
    await page.close();
    return { r, asked };
  }

  /* a way sets the stage: who is signed in and what the server answers */
  const ID = /^[A-Za-z0-9_-]{16,64}$/;
  const anonHeard = await runWay('signed out, the server answers with audio', { signed: false }, r =>
    r.fulfill({ status: 200, contentType: 'audio/wav', body: wav(60) }));
  ok(anonHeard.r.wantedOn === true && anonHeard.r.canNow === true && anonHeard.r.onNow === true, 'the switch is on and nothing else is asked of the person: no sign in');
  ok(/ElevenLabs, a voice company/.test(anonHeard.r.row) && !/Sign in/.test(anonHeard.r.row), 'and the switch says who speaks the line and never asks for a sign in: ' + anonHeard.r.row.slice(0, 140));
  ok(anonHeard.asked.length > 1, 'every spoken line asked the server, ' + anonHeard.asked.length + ' requests');
  ok(anonHeard.asked.every(a => a.auth === ''), 'none of them carried a session');
  const bodies = anonHeard.asked.map(a => { try { return JSON.parse(a.body); } catch (e) { return {}; } });
  ok(bodies.every(b => typeof b.text === 'string' && /^(list|frame)$/.test(b.style) && ID.test(b.device || '') && Object.keys(b).length === 3),
    'each sent the line, its style and a device code, and nothing else');
  ok(new Set(bodies.map(b => b.device)).size === 1 && anonHeard.r.devStored === bodies[0].device, 'the same device code every time, and kept in the browser');
  ok(anonHeard.r.audios === anonHeard.asked.length, 'each answer was handed to an audio element, ' + anonHeard.r.audios + ' of ' + anonHeard.asked.length);
  ok(anonHeard.r.lost === false, 'and the run never gave up on the voice: ' + anonHeard.r.status);

  const refused = await runWay('signed out, the server refuses', { signed: false }, r =>
    r.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'the voice is not connected on this server yet: ELEVENLABS_API_KEY is not set' }) }));
  ok(refused.asked.length === 1, 'a refusing server is asked once and not once per line, ' + refused.asked.length + ' requests');
  ok(refused.r.lost === true && /reads on the screen/.test(refused.r.status) && !/ELEVENLABS|API_KEY/.test(refused.r.status),
    'the screen says so in words and never the server setting: ' + refused.r.status);
  ok(refused.r.audios === 0, 'and no audio element was made');

  const signed = await runWay('signed in, the server answers with audio', { signed: true }, r =>
    r.fulfill({ status: 200, contentType: 'audio/wav', body: wav(60) }));
  ok(signed.asked.length > 1 && signed.asked.every(a => a.auth === 'Bearer tok_test'), 'signed in, each request carries the person\'s own session, ' + signed.asked.length + ' requests');
  ok(signed.asked.every(a => { try { const b = JSON.parse(a.body); return Object.keys(b).sort().join() === 'style,text'; } catch (e) { return false; } }),
    'and sends no device code, only the line and its style');

  await browser.close();
  console.log('\n===== ' + PASS + ' passed, ' + FAIL + ' failed =====');
  process.exit(FAIL ? 1 : 0);
})();
