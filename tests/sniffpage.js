#!/usr/bin/env node
/* ============================================================
   THE SNIFFER ON THE PAGE, IN A REAL BROWSER.
   NODE_PATH=/opt/node22/lib/node_modules node tests/sniffpage.js

   REVIEW-sniffer-audit-2026-10-09.md, packages S1 to S5. tests/engine.js
   holds the reader headless. This holds what only a page can show: that the
   Story page and the quiz draw, count and say exactly what the engine
   counted, and say nothing the engine did not.

     S1  a word said with a no. The struck mark on the Story page is the
         engine's denied list, the counter's numbers are the engine's, the
         list never claims a seat was charged by a denied word alone, and
         the quiz never says it counted one.

   Checked against a known bad case first, the standing rule: every check
   here was run against main's own build before the change and failed there
   on a printed line, and the commit that adds it says so.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
/* ?dev=1 meets the instrument and not the login sheet, as functional.js does */
const FILE = 'file://' + path.resolve(process.env.ATUNED_FILE || path.join(ROOT, 'source.html')) + '?dev=1';
const QUIZ = 'file://' + path.join(ROOT, 'funnel', 'quiz.html');

let n = 0; const fails = [];
const ok = (c, m) => { n++; if (!c) fails.push(m); console.log((c ? '  ok    ' : '  FAIL  ') + m); };
const booted = async p => {
  await p.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(600);
  await p.evaluate(() => { if (typeof OB !== 'undefined' && OB.open && typeof obClose === 'function') obClose(); }).catch(() => {});
  await p.waitForTimeout(120); };

async function open(browser, w, h) {
  const cx = await browser.newContext({ viewport: { width: w, height: h } });
  const p = await cx.newPage();
  p.errs = []; p.on('pageerror', e => p.errs.push(String(e && e.message || e)));
  await p.goto(FILE, { waitUntil: 'load' }); await booted(p);
  await p.evaluate(() => { setTab(TAB.STORY); render(); });
  await p.waitForTimeout(400);
  p.cx = cx; return p;
}
const type = async (p, t) => { await p.fill('#sttext', t); await p.waitForTimeout(300); };

/* the page as a person sees it, and the engine's own lists beside it. The
   engine's quotes are cut from the letters typed through normMap's own map,
   from the negator when there is one, so they are what the struck mark must
   cover. Missing lists come back null, which is what main's build gives. */
const story = p => p.evaluate(() => {
  const t = ST_TEXT, P = ST_PARSED, nm = normMap(t);
  const quote = list => {
    if (!list) return null;
    const seen = {}, out = [];
    list.forEach(h => {
      const a = nm.map[(h.negAt != null ? h.negAt : h.at) + 1], b = nm.map[h.at + String(h.t).length] + 1;
      if (seen[a]) return; seen[a] = 1; out.push(t.slice(a, b)); });
    return out; };
  return {
    text: t,
    marks: [...document.querySelectorAll('#sthl mark')].map(m => ({ t: m.textContent, neg: m.classList.contains('neg') })),
    denied: quote(P && P.denied),
    ctr: (document.getElementById('stctrt') || {}).textContent || '',
    list: (document.getElementById('stimps') || {}).textContent || '',
    commit: (document.getElementById('stapply') || {}).textContent || ''
  };
});

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

  console.log('\n=== S1 · the Story page draws, counts and lists what the engine counted ===');
  {
    const p = await open(browser, 1600, 1000);
    await type(p, 'I was not angry. I was scared.');
    const s = await story(p);
    const struck = s.marks.filter(m => m.neg).map(m => m.t);
    ok(!!s.denied && s.denied.join('|') === 'not angry', 'the engine lists the denied word on the parse: ' + JSON.stringify(s.denied));
    ok(!!s.denied && struck.join('|') === s.denied.join('|'), 'the struck marks are exactly the engine\'s denied words: ' + JSON.stringify(struck));
    const kept = s.marks.filter(m => !m.neg).length, k = struck.length;
    const mk = s.ctr.match(/(\d+) kept/), mn = s.ctr.match(/(\d+) set aside after a no/);
    ok(!!mk && +mk[1] === kept, 'the counter\'s kept is the marks that count, ' + kept + ': ' + JSON.stringify(s.ctr));
    ok(!!mn && +mn[1] === k, 'and its set aside is the engine\'s denied count, ' + k + ', said in plain words: ' + JSON.stringify(s.ctr));
    ok(!/negated/.test(s.ctr), 'the counter carries no word a ten year old would ask about: ' + JSON.stringify(s.ctr));

    await type(p, 'I was not angry.');
    const d = await story(p);
    ok(d.commit === 'Commit', 'a denial alone gives the Commit button nothing to count: ' + JSON.stringify(d.commit));
    ok(!/only from/.test(d.list), 'and the list never says a seat was charged by a denied word alone: ' + JSON.stringify(d.list.slice(0, 90)));

    await type(p, 'I was not angry. My chest went tight and I was scared.');
    const e = await story(p);
    ok(!/only from/.test(e.list) && e.marks.some(m => m.neg) && e.marks.some(m => !m.neg),
      'with a denial beside real charge, the list shows the charge and no lane note claims the denial: ' + JSON.stringify(e.list.slice(0, 90)));
    ok(!p.errs.length, 'no page errors on the Story page: ' + p.errs.join(' | '));
    await p.cx.close();
  }

  console.log('\n=== S1 · the quiz never says it counted a word said with a no ===');
  {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const q = await cx.newPage(); const errs = [];
    q.on('pageerror', e => errs.push(String(e && e.message || e)));
    await q.goto(QUIZ, { waitUntil: 'load' });
    const r = await q.evaluate(() => {
      const t = 'I was not scared to call my mother. My chest went tight and I felt ashamed.';
      const ps = parseStory(t), h = storyLit(ps, t, read(scored().p).reading);
      const box = document.createElement('div'); box.innerHTML = h;
      return { html: h, text: box.textContent,
        words: [...box.querySelectorAll('.sab .sl')].map(e => e.textContent).filter(x => /^Your words:/.test(x)) };
    });
    ok(r.words.length > 0 && r.words.every(w => !/scared/.test(w)), 'no card quotes the denied word as one of the words it read: ' + JSON.stringify(r.words));
    ok(!/counts a word that comes after a no/.test(r.text), 'and no sentence says the reader counted it anyway');
    ok(/“not scared”/.test(r.text), 'the denied words are still shown back, in the person\'s own letters');
    ok(!errs.length, 'no page errors on the quiz: ' + errs.join(' | '));
    await cx.close();
  }

  await browser.close();
  console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed =====');
  if (fails.length) { fails.forEach(f => console.log('  FAIL  ' + f)); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
