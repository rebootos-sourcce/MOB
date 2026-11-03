#!/usr/bin/env node
/* ============================================================
   THE SAFETY WORDS ON THE PAGE, IN A REAL BROWSER. 17 October.
   NODE_PATH=/opt/node22/lib/node_modules node tests/safepage.js

   tests/engine.js holds srcSafe headless (engine/safe.js): which words trip,
   which a no, another person, a quotation or an idiom sets aside, and that
   the reader then reads nothing. This holds what only the Story page can
   show, the ruling of 17 October (Emmy's, taken by the team; the automatic
   check the owner deferred on 9 October stays deferred):

     1  the entry is kept exactly as written, and moves nothing
     2  no release is offered and no question is asked: no why, no Move on,
        no question buttons, no lit word, no count on Commit, the release
        column not lit, no nudge to write where it was felt
     3  in their place, one line in Emmy's words and one door, Reach someone
        now, which opens the panel straight on the numbers; on the first
        screen at 1600 and at 390, in the quiet row the page already has,
        with no red, no capitals and no "we noticed"
     4  no sound at Commit, and the line stays until the next entry starts
     5  nothing about the match is kept: the export, the outbox and the
        whole browser store are the same, key for key, as for an entry that
        read nothing, and no request leaves the page
     6  the line never says "It is saved" when the browser refused the write
     7  a no, someone else's words and an idiom draw nothing new, and the one
        table's on switch turns the whole behaviour off
     8  danger now ("I never feel safe at home") is held the same way
     9  the tutorial's commit through the same path keeps nothing to offer

   Checked against a known bad case first: run on main's build at 054ca583,
   before engine/safe.js, its first section fails on printed lines, which is
   the defect QA measured (Commit 8, two words lit as feelings, a why and the
   question buttons, the release column lit, no line and no door), and the
   run then stops where it presses a door main does not have.

   BROUGHT CURRENT 3 NOVEMBER, on the merge with main at b6f86211. The
   Journal became a conversation on 28 October and voice its only door on 29
   October, so #sttext, the box every leg below typed into, only renders in a
   crisis now (crisisTalk, ui/crisis.js, sets STV.chat false). The legs that
   type reach it the way crisisTalk does, and section 10 holds the door a
   person actually uses: a turn spoken through a stand-in recogniser, the
   shape tests/srcchat.js drives, at 1600 and at 390, and the Full view's
   Energy rail (ui/stdash.js, PR 169) beside it. Checked against a known bad
   case first: on the merge's first cut, which drew the safe row in place of
   the whole thread, section 10 fails on the person's own rows (2 before, 0
   after), the defect it was written for.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const FILE = 'file://' + path.resolve(process.env.ATUNED_FILE || path.join(ROOT, 'source.html')) + '?dev=1';

let n = 0; const fails = [];
const ok = (c, m) => { n++; if (!c) fails.push(m); console.log((c ? '  ok    ' : '  FAIL  ') + m); };
const booted = async p => {
  await p.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(600);
  await p.evaluate(() => { if (typeof OB !== 'undefined' && OB.open && typeof obClose === 'function') obClose(); }).catch(() => {});
  await p.waitForTimeout(120); };
/* a stand-in recogniser, the same shape tests/srcchat.js installs before
   the page loads, over both names, so the page's own stMic reads a sentence
   off it the way it reads Chrome's */
const MIC = () => {
  function FakeSR() { FakeSR.made.push(this); this.on = false; this.results = []; }
  FakeSR.made = [];
  FakeSR.prototype.start = function () { if (this.on) throw new Error('InvalidStateError'); this.on = true; this.results = []; };
  FakeSR.prototype._end = function () { if (!this.on) return; this.on = false; const s = this; setTimeout(() => { if (s.onend) s.onend(); }, 0); };
  FakeSR.prototype.stop = function () { this._end(); };
  FakeSR.prototype.abort = function () { if (this.on && this.onerror) this.onerror({ error: 'aborted' }); this._end(); };
  const cur = () => FakeSR.made[FakeSR.made.length - 1];
  window.__mic = { live: () => !!(cur() && cur().on),
    say(t) { const r = cur(); if (!r || !r.on) return false; r.results.push({ 0: { transcript: t }, isFinal: true, length: 1 });
      r.onresult({ resultIndex: r.results.length - 1, results: Object.assign({ length: r.results.length }, r.results) }); return true; } };
  window.SpeechRecognition = FakeSR; window.webkitSpeechRecognition = FakeSR;
};
const VOICE = /\.workers\.dev\/v1\/voice\/synthesize/;
async function open(browser, w, h) {
  const cx = await browser.newContext({ viewport: { width: w, height: h } });
  await cx.addInitScript(MIC);
  const p = await cx.newPage();
  p.errs = []; p.on('pageerror', e => p.errs.push(String(e && e.message || e)));
  p.net = []; p.on('request', r => { const u = r.url(); if (!/^(file|data|blob):/.test(u)) p.net.push(u); });
  p.voice = []; p.on('request', r => { if (VOICE.test(r.url()) && r.method() === 'POST') { try { p.voice.push(JSON.parse(r.postData()).text); } catch (e) { p.voice.push('?'); } } });
  await p.goto(FILE, { waitUntil: 'load' }); await booted(p);
  await p.evaluate(() => { setTab(TAB.STORY); render(); });
  await p.waitForTimeout(400);
  p.cx = cx; return p;
}
/* the box, reached the way crisisTalk reaches it, since it renders nowhere else */
const type = async (p, t) => {
  await p.evaluate(() => { if (!document.getElementById('sttext')) { STV.chat = false; stRender(); } });
  await p.fill('#sttext', t); await p.waitForTimeout(350); };
/* a turn spoken through the Journal's own door, as tests/srcchat.js says one */
const say = async (p, t) => {
  const r = await p.evaluate(async text => {
    if (!ST_LISTEN) stMic();
    for (let i = 0; i < 120 && !__mic.live(); i++) await new Promise(r => setTimeout(r, 25));
    return __mic.say(text); }, t);
  await p.waitForTimeout(350); return r; };
const T = 'I keep thinking about killing myself. I have been hurting myself again.';
const Q = 'I walked to the shop on Tuesday and bought some bread.';
/* the page as a person sees it */
const look = p => p.evaluate(() => {
  const s = document.getElementById('stsafe'), src = document.getElementById('stsrc');
  const line = s && s.querySelector('p'), door = s && s.querySelector('[data-crisis]');
  const r = door && door.getBoundingClientRect();
  const rel = document.getElementById('strel');
  return {
    line: line ? line.textContent : null,
    door: door ? { k: door.getAttribute('data-crisis'), t: door.textContent, inView: r.top >= 0 && r.bottom <= innerHeight, h: r.height } : null,
    reach: document.querySelectorAll('[data-crisis="reachnow"]').length,
    ink: line ? getComputedStyle(line).color : null,
    srcText: src ? src.innerText : '',
    why: !!document.getElementById('srcwhy'), pass: !!document.getElementById('srcpass'),
    qbtn: !!document.getElementById('srcnew') || !!document.getElementById('srcdyn'),
    ask: !!(src && src.querySelector('.src-q')),
    marks: document.querySelectorAll('#sthl mark').length,
    commit: (document.getElementById('stapply') || {}).textContent || '',
    glow: rel ? rel.style.getPropertyValue('--glow') : null,
    /* textContent: at 390 the pending column is folded away and innerText cannot see it */
    pend: [...document.querySelectorAll('.st-none')].map(e => e.textContent).join(' | '),
    page: document.body.innerText,
    said: (document.getElementById('srcsay') || {}).textContent || '' };
});

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  require('./net.js').guardBrowser(browser);
  const SAY = await (async () => { const p = await open(browser, 800, 600);
    const s = await p.evaluate(() => ({ entry: CRISIS_SAY.entry, now: CRISIS_SAY.entryNow, reach: CRISIS_SAY.reach }));
    await p.cx.close(); return s; })();

  for (const [w, h] of [[1600, 1000], [390, 844]]) {
    const at = ' @' + w;
    console.log('\n=== 2, 3 · nothing offered, nothing asked, one line and one door' + at + ' ===');
    const p = await open(browser, w, h);
    await type(p, T);
    const s = await look(p);
    ok(s.line === SAY.entry, 'the line is Emmy\'s, word for word' + at + ': ' + JSON.stringify(s.line));
    ok(!!s.door && s.door.k === 'reachnow' && s.door.t === SAY.reach && s.reach === 1,
      'one door, ' + JSON.stringify(SAY.reach) + ', and no second one on the page' + at + ': ' + JSON.stringify(s.door) + ', ' + s.reach + ' on the page');
    ok(!!s.door && s.door.inView && s.door.h >= 44, 'the door is on the first screen and at the 44 pixel floor' + at + ': ' + JSON.stringify(s.door));
    ok(!s.why && !s.pass && !s.qbtn && !s.ask, 'no why, no Move on, no question and no question buttons' + at + ': ' + JSON.stringify({ why: s.why, pass: s.pass, qbtn: s.qbtn, ask: s.ask }));
    ok(!/Why there|Both land|lands at/.test(s.page), 'no "why there" anywhere on the page' + at);
    ok(s.marks === 0, 'no word in the entry is lit as a feeling' + at + ', ' + s.marks + ' lit');
    ok(s.commit === 'Commit', 'Commit carries no count' + at + ': ' + JSON.stringify(s.commit));
    ok(s.glow === 'var(--accent)', 'the release column is not lit by these words' + at + ': ' + JSON.stringify(s.glow));
    ok(!/write where you felt it|Keep writing/.test(s.page), 'and nothing asks where it was felt' + at);
    const m = s.ink && s.ink.match(/\d+/g).map(Number);
    ok(!!m && !(m[0] > 150 && m[0] > m[1] * 1.6 && m[0] > m[2] * 1.6), 'the line is not drawn red' + at + ': ' + s.ink);
    ok(!!s.line && s.line === s.line.replace(/\b[A-Z]{2,}\b/g, '') && !/notic|detect|warning|alert|risk|we /i.test(s.line),
      'no capitals, and no "we noticed", "detected", "warning" or "risk"' + at);
    ok(s.said === SAY.entry, 'a screen reader hears the same line, once, through the polite live region' + at);
    await p.click('#stsafe [data-crisis="reachnow"]'); await p.waitForTimeout(250);
    const pan = await p.evaluate(() => { const c = document.getElementById('crisis');
      return { open: !!c && !c.hidden, view: CRISIS.view, lines: c ? c.querySelectorAll('[data-crisisline]').length : 0 }; });
    ok(pan.open && pan.view === 'reach' && pan.lines === 3, 'the door opens the panel straight on the three numbers' + at + ': ' + JSON.stringify(pan));
    await p.keyboard.press('Escape'); await p.waitForTimeout(150);
    await p.screenshot({ path: path.join(process.env.SHOTS || '/tmp', 'safe-typing-' + w + '.png') }).catch(() => {});

    console.log('\n=== 1, 4 · Commit keeps the words, moves nothing, makes no sound' + at + ' ===');
    const before = await p.evaluate(() => JSON.stringify({ c: S.charge, l: S.law, v: VERPMIX, m: LEANMIX }));
    await p.evaluate(() => { window.__sfx = []; const f = window.sfx; window.sfx = function (k) { window.__sfx.push(k); return f && f.apply(this, arguments); }; });
    p.net.length = 0;
    await p.click('#stapply'); await p.waitForTimeout(600);
    const c = await p.evaluate(() => { const es = CURP.story.entries, e = es[es.length - 1];
      return { e, n: es.length, field: JSON.stringify({ c: S.charge, l: S.law, v: VERPMIX, m: LEANMIX }), sfx: window.__sfx.slice(), focus: STV.focus,
        line: (document.querySelector('#stsafe p') || {}).textContent || null, status: (document.getElementById('status') || {}).textContent || '' }; });
    ok(c.n === 1 && c.e.text === T, 'the entry is on the record exactly as written' + at);
    ok(c.e.imprints === 0 && JSON.stringify(c.e.bands) === '{}', 'with nothing read off it' + at + ': ' + c.e.imprints + ' imprints, bands ' + JSON.stringify(c.e.bands));
    ok(c.field === before, 'and the field, the laws and the leans did not move' + at);
    ok(c.sfx.length === 0, 'no sound' + at + ': ' + JSON.stringify(c.sfx));
    ok(c.focus === 'write', 'the page does not walk the person to the release' + at + ': ' + c.focus);
    ok(c.line === SAY.entry, 'the line stays beside the empty box after Commit' + at);
    ok(p.net.length === 0, 'no request left the page on Commit' + at + ': ' + JSON.stringify(p.net));
    const after = await look(p);
    /* the pending column's empty sentence was cut on main, round of 29
       October, so what is held now is that nothing false or asking stands */
    ok(!/You have not written anything yet|write where you felt it|Keep writing/.test(after.pend),
      'the pending column says neither that nothing was written nor where it was felt' + at + ': ' + JSON.stringify(after.pend));
    await p.screenshot({ path: path.join(process.env.SHOTS || '/tmp', 'safe-committed-' + w + '.png') }).catch(() => {});
    await type(p, 'I was scared and my chest went tight.');
    const nx = await look(p);
    ok(nx.line === null && nx.reach === 0 && nx.commit !== 'Commit', 'the next entry starts and the line goes, and that entry reads as it always did' + at + ': ' + JSON.stringify(nx.commit));
    ok(!p.errs.length, 'no page errors' + at + ': ' + p.errs.join(' | '));
    await p.cx.close();
  }

  console.log('\n=== 2 · said twice, with earlier entries at the same seats, still no question ===');
  {
    const p = await open(browser, 1600, 1000);
    await p.evaluate(() => { CURP.story.entries.push({ t: '2026-10-01T00:00:00.000Z', text: 'x', imprints: 2, bands: { heart: 30, eye: 30 } },
      { t: '2026-10-02T00:00:00.000Z', text: 'x', imprints: 2, bands: { heart: 30, eye: 30 } }); });
    await type(p, T + ' ' + T);
    const s = await look(p);
    ok(!s.ask && !s.pass && s.line === SAY.entry, 'with heart and eye already on the record, nothing is asked and the line stands');
    await p.cx.close();
  }

  console.log('\n=== 5 · nothing about the match is kept: export, outbox and store, with and without ===');
  {
    const dump = async t => {
      const p = await open(browser, 1600, 1000);
      await type(p, t); await p.click('#stapply'); await p.waitForTimeout(700);
      const d = await p.evaluate(t => {
        /* the profile's own id is random per browser, so it is set aside by
           value; everything else must match as it stands */
        const norm = s => String(s == null ? '' : s).split(t).join('<TEXT>').split(CURP.id).join('<ID>').replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g, '<T>').replace(/\b1[6-9]\d{11}\b/g, '<MS>');
        const store = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); store[k] = norm(localStorage.getItem(k)); }
        return { exp: norm(pExport()), out: norm(localStorage.getItem('source.outbox')), store, keys: Object.keys(store).sort() };
      }, t);
      d.net = p.net.slice(); d.errs = p.errs.slice(); await p.cx.close(); return d; };
    const a = await dump(T), b = await dump(Q);
    ok(a.exp.length > 100 && a.exp === b.exp, 'pExport, the record a person saves as a file, is the same with and without the match, ' + a.exp.length + ' characters');
    ok(a.out === b.out, 'the outbox is the same: ' + JSON.stringify(a.out).slice(0, 60));
    ok(JSON.stringify(a.keys) === JSON.stringify(b.keys), 'the browser store has the same keys: ' + a.keys.length);
    const diff = a.keys.filter(k => a.store[k] !== b.store[k]);
    ok(diff.length === 0, 'and the same values under every key: ' + JSON.stringify(diff));
    ok(!/safe|crisis|srcsafe/i.test(a.exp), 'the record carries no word that names the match');
    ok(a.net.length === 0 && b.net.length === 0, 'no request left either page: ' + JSON.stringify(a.net.concat(b.net)));
    ok(!a.errs.length && !b.errs.length, 'no page errors: ' + a.errs.concat(b.errs).join(' | '));
  }

  console.log('\n=== 6 · never "It is saved" when the browser refused it ===');
  {
    const p = await open(browser, 1600, 1000);
    await p.evaluate(() => { window.pSave = function () { return false; }; });
    await type(p, T); await p.waitForTimeout(700);
    await type(p, T + ' '); await p.waitForTimeout(200);
    const s = await look(p);
    ok(s.line === SAY.now && !/saved/i.test(s.line), 'with the store refusing, the line drops its first sentence: ' + JSON.stringify(s.line));
    await p.click('#stapply'); await p.waitForTimeout(500);
    const c = await look(p);
    ok(c.line === SAY.now, 'and after a refused Commit it still does not claim the save: ' + JSON.stringify(c.line));
    await p.cx.close();
  }

  console.log('\n=== 7 · a no, someone else\'s words and an idiom draw nothing new; the switch turns it off ===');
  {
    const p = await open(browser, 1600, 1000);
    for (const t of ['I was not going to kill myself.', 'He threatened to kill himself.', 'She said "I want to die" when her phone broke.',
      'I could kill for a coffee.', 'This deadline is killing me.', 'I want to die laughing.']) {
      await type(p, t); const s = await look(p);
      ok(s.line === null && s.reach === 0, 'no line and no door on ' + JSON.stringify(t));
    }
    await p.evaluate(() => SAFE_WORDS.forEach(r => { r.on = false; }));
    await type(p, T); const off = await look(p);
    ok(off.line === null && /Commit \d/.test(off.commit), 'with on false on the table\'s rows the entry reads as it did on main: ' + JSON.stringify(off.commit));
    await p.evaluate(() => SAFE_WORDS.forEach(r => { r.on = true; }));
    await type(p, T + ' '); const on = await look(p);
    ok(on.line === SAY.entry, 'and back on, the line returns');
    ok(!p.errs.length, 'no page errors: ' + p.errs.join(' | '));
    await p.cx.close();
  }

  console.log('\n=== 8 · danger now is held the same way ===');
  {
    const p = await open(browser, 390, 844);
    await type(p, 'I never feel safe at home. He threatened to kill me.');
    const s = await look(p);
    ok(s.line === SAY.entry && s.reach === 1 && !s.ask && s.marks === 0 && s.commit === 'Commit',
      '"I never feel safe at home" gets the line and the door, and no release or question: ' + JSON.stringify({ line: !!s.line, commit: s.commit }));
    await p.cx.close();
  }

  console.log('\n=== 2 · after Talk it through there is still one door ===');
  {
    const p = await open(browser, 1600, 1000);
    await p.evaluate(() => { STV.chat = false; STV.crisis = true; stRender(); });
    await p.waitForTimeout(200);
    const was = (await look(p)).reach;
    await type(p, T);
    const s = await look(p);
    ok(s.line === SAY.entry && !s.door && s.reach === was && was > 0,
      'the line comes alone and adds no door: the box\'s own Reach someone now is it, ' + was + ' before and ' + s.reach + ' after');
    await p.cx.close();
  }

  console.log('\n=== 9 · the tutorial\'s commit keeps nothing to offer ===');
  {
    const p = await open(browser, 1600, 1000);
    const r = await p.evaluate(t => { ST_TEXT = t; ST_PARSED = parseStory(t); const c = stCommit();
      const deep = sniffStory(c.text); return { ok: c.ok, k: c.k, kept: c.kept.length, saved: c.saved, offer: (deep.offer || []).length }; }, T);
    ok(r.ok && r.saved && r.k === 0 && r.kept === 0,
      'stCommit, the path the tutorial writes through, keeps the words and finds nothing, so its release card (off and kept) has nothing to offer: ' + JSON.stringify(r));
    await p.cx.close();
  }

  console.log('\n=== 10 · the door a person uses: a turn spoken in the conversation ===');
  for (const [w, h] of [[1600, 1000], [390, 844]]) {
    const at = ' @' + w;
    const p = await open(browser, w, h);
    const first = 'I had a long day.';
    ok(await say(p, first), 'the first turn lands through the recogniser' + at);
    const v0 = p.voice.length;
    ok(await say(p, 'I keep thinking about killing myself.'), 'and the second' + at);
    await p.waitForTimeout(400);
    const s = await p.evaluate(() => ({
      chat: STV.chat,
      line: (document.querySelector('#stsrc #stsafe p') || {}).textContent || null,
      reach: document.querySelectorAll('[data-crisis="reachnow"]').length,
      me: [...document.querySelectorAll('#stsrc .src-bub-me')].map(e => e.textContent),
      live: document.querySelectorAll('#stsrc .src-tn-now .src-q, #stsrc .src-tn-now .src-open').length,
      pass: !!document.getElementById('srcpass'), why: !!document.getElementById('srcwhy'),
      marks: document.querySelectorAll('#stsrc mark').length,
      asks: SRC_CHAT.filter(r => r.key && r.key.indexOf('ask|') === 0).length,
      said: (document.getElementById('srcsay') || {}).textContent || '' }));
    ok(s.chat && s.line === SAY.entry && s.reach === 1, 'in the conversation, the line in Emmy\'s words and one door' + at + ': ' + JSON.stringify({ line: s.line, reach: s.reach }));
    ok(JSON.stringify(s.me) === JSON.stringify([first, 'I keep thinking about killing myself.']),
      'and the person\'s own words stay on the page, both turns' + at + ': ' + JSON.stringify(s.me));
    ok(s.live === 0 && !s.pass && !s.why && s.asks === 0 && s.marks === 0, 'no reply, no question, no Move on, no why, no lit word' + at + ': ' + JSON.stringify(s));
    ok(p.voice.length === v0, 'and nothing is spoken back after it' + at + ': ' + JSON.stringify(p.voice.slice(v0)));
    ok(s.said === SAY.entry, 'a screen reader hears the line' + at);
    await p.screenshot({ path: path.join(process.env.SHOTS || '/tmp', 'safe-spoken-' + w + '.png') }).catch(() => {});
    /* the Full view's left rail reads the story being written (ui/stdash.js) */
    await p.evaluate(() => { STV.dash = true; stRender(); }); await p.waitForTimeout(300);
    const en = await p.evaluate(() => ({ host: !!document.getElementById('st-energy'),
      lit: [...document.querySelectorAll('#st-energy-ls li')].filter(li => !/nothing from this story/.test(li.innerHTML)).length,
      rows: document.querySelectorAll('#st-energy-ls li').length, line: (document.querySelector('#stsafe p') || {}).textContent || null }));
    ok(en.host && en.lit === 0, 'in the Full view the Energy rail puts nothing at any seat from these words' + at + ': ' + JSON.stringify(en));
    ok(en.line === SAY.entry, 'and the line stands there too' + at);
    p.net.length = 0;
    await p.click('#stapply'); await p.waitForTimeout(600);
    const c = await p.evaluate(() => { const es = CURP.story.entries, e = es[es.length - 1];
      return { n: es.length, text: e && e.text, imprints: e && e.imprints, asked: e && e.asked || null,
        line: (document.querySelector('#stsafe p') || {}).textContent || null }; });
    ok(c.n === 1 && c.text === first + '\nI keep thinking about killing myself.' && c.imprints === 0 && !c.asked,
      'Commit keeps the spoken words exactly, with nothing read and nothing asked' + at + ': ' + JSON.stringify(c));
    ok(c.line === SAY.entry && p.net.length === 0, 'the line stays and no request left the page' + at + ': ' + JSON.stringify(p.net));
    await p.evaluate(() => { STV.dash = false; stRender(); }); await p.waitForTimeout(200);
    await say(p, 'I was scared and my chest went tight.'); await p.waitForTimeout(300);
    const nx = await p.evaluate(() => ({ line: (document.querySelector('#stsafe p') || {}).textContent || null,
      me: document.querySelectorAll('#stsrc .src-bub-me').length }));
    ok(nx.line === null && nx.me === 1, 'the next entry starts and the line goes' + at + ': ' + JSON.stringify(nx));
    ok(!p.errs.length, 'no page errors' + at + ': ' + p.errs.join(' | '));
    await p.cx.close();
  }

  await browser.close();
  console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed =====');
  if (fails.length) { fails.forEach(f => console.log('  FAIL  ' + f)); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
