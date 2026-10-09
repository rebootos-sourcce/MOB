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
     S2  a charge word about someone else. The page draws exactly the
         engine's others as set aside and not struck, the counter names
         them, and the quiz makes no card of them and shows them back.
     S4  no surface that prints an address read from a story says the
         person said or named it, or quotes it as their word, unless the
         story holds it.
     S5  what was read and not counted reaches the person on the Story
         page, under the box, in the engine's one sentence, each with what
         it means beside it, at both widths, and is gone when nothing is.

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
  const quote = (list, from) => {
    if (!list) return null;
    const seen = {}, out = [];
    list.forEach(h => {
      const a = nm.map[(h[from] != null ? h[from] : h.at) + 1], b = nm.map[h.at + String(h.t).length] + 1;
      if (seen[a]) return; seen[a] = 1; out.push(t.slice(a, b)); });
    return out; };
  return {
    text: t,
    marks: [...document.querySelectorAll('#sthl mark')].map(m => ({ t: m.textContent, neg: m.classList.contains('neg'), oth: m.classList.contains('oth') })),
    denied: quote(P && P.denied, 'negAt'),
    others: quote(P && P.others, 'whoAt'),
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
    const kept = s.marks.filter(m => !m.neg && !m.oth).length, k = struck.length;
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

  console.log('\n=== S2 · someone else\'s charge is set aside on the page, and said so ===');
  {
    const p = await open(browser, 1600, 1000);
    await type(p, 'He is furious. I was scared.');
    const s = await story(p);
    const set = s.marks.filter(m => m.oth).map(m => m.t);
    ok(!!s.others && s.others.join('|') === 'He is furious', 'the engine lists the word about someone else on the parse: ' + JSON.stringify(s.others));
    ok(!!s.others && set.join('|') === s.others.join('|') && !s.marks.some(m => m.oth && m.neg),
      'the page draws exactly those as set aside, from the person to the word, and not struck: ' + JSON.stringify(s.marks));
    const kept = s.marks.filter(m => !m.neg && !m.oth).length, mo = s.ctr.match(/(\d+) about someone else/), mk = s.ctr.match(/(\d+) kept/);
    ok(!!mo && +mo[1] === set.length && !!mk && +mk[1] === kept,
      'the counter keeps ' + kept + ' and sets ' + set.length + ' aside as about someone else: ' + JSON.stringify(s.ctr));
    await type(p, 'He is furious.');
    const d = await story(p);
    ok(d.commit === 'Commit', 'someone else\'s charge alone gives Commit nothing to count: ' + JSON.stringify(d.commit));
    ok(!p.errs.length, 'no page errors on the Story page: ' + p.errs.join(' | '));
    await p.cx.close();

    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const q = await cx.newPage(); const errs = [];
    q.on('pageerror', e => errs.push(String(e && e.message || e)));
    await q.goto(QUIZ, { waitUntil: 'load' });
    const r = await q.evaluate(() => {
      const t = 'He was furious with me. I felt ashamed.';
      const ps = parseStory(t), h = storyLit(ps, t, read(scored().p).reading);
      const box = document.createElement('div'); box.innerHTML = h;
      return { text: box.textContent, cards: [...box.querySelectorAll('.sab[data-card]')].map(c => c.getAttribute('data-card')),
        words: [...box.querySelectorAll('.sab .sl')].map(e => e.textContent).filter(x => /^Your words:/.test(x)) };
    });
    ok(r.cards.indexOf('Anger') < 0 && r.words.every(w => !/furious/.test(w)), 'the quiz makes no card of his anger and quotes it on none: ' + JSON.stringify(r));
    ok(/“He was furious”/.test(r.text), 'and it shows his words back, in the person\'s own letters, as not counted');
    ok(!errs.length, 'no page errors on the quiz: ' + errs.join(' | '));
    await cx.close();
  }

  console.log('\n=== S4 · no screen says the person said or named an address they did not ===');
  {
    /* THE RULE, made mechanical. An address is a name in the 112 table,
       NODES[].k, read off the page and never typed here. A surface fails
       when, for an address the story's own letters do not contain, it
         quotes it as the person's word        “Pride”
         says the person or the words named it  you named Pride, your words
                                                named Pride, you said Pride
         titles its pill as named by the words  title "Named by the words."
                                                on a pill reading Pride
       Ruling 5 of the review: an explicit axis is not an explicit address.
       Five surfaces print an address read from a story: the Story page's
       pending list, the Day One tutorial's first card, the quiz's story
       cards, the onboarding mirror's rows and the Imprints page's pending
       pills. Each is driven through its own renderer with the same stories. */
    const STORIES = ['I was furious.', 'I am exhausted.', 'My father died last year.',
      'I was scared and my chest went tight.', 'I am exhausted and furious.'];
    const CLAIM = /(you named|you said|your words named|named by (the|your) words)\s+(.{0,60})/ig;
    /* AXES is the nine axis names. Three of them, Fear, Shame and Anger, are
       also address names, and "your words named anger" is a true sentence
       about the axis, so a named-claim never counts those three as an
       address. A quote still does: a quoted word must be the person's own. */
    let AXES = [];
    const judge = (ADDR, story, text, pills) => {
      const low = story.toLowerCase(), bad = [];
      const foreign = a => low.indexOf(a.toLowerCase()) < 0;
      const named = ADDR.filter(a => AXES.indexOf(a.toLowerCase()) < 0);
      (text.match(/[“"]([^”"]{2,60})[”"]/g) || []).forEach(q => {
        const w = q.slice(1, -1).trim();
        if (ADDR.some(a => a.toLowerCase() === w.toLowerCase() && foreign(a))) bad.push('quotes ' + q + ' as the person\'s word'); });
      let m; CLAIM.lastIndex = 0;
      while ((m = CLAIM.exec(text))) { const after = m[3];
        named.forEach(a => { if (foreign(a) && after.toLowerCase().indexOf(a.toLowerCase()) === 0) bad.push('says "' + m[1] + ' ' + a + '"'); }); }
      /* a pill's title names its object or it names the pill: "Named by the
         words." claims the label, "Your words named anger" claims anger */
      (pills || []).forEach(pl => {
        if (/named by (the|your) words\s*\.?\s*$/i.test(pl.title)
          && ADDR.some(a => foreign(a) && pl.text.toLowerCase().indexOf(a.toLowerCase()) >= 0))
          bad.push('pill "' + pl.text + '" titled "' + pl.title + '"');
        let k; CLAIM.lastIndex = 0;
        while ((k = CLAIM.exec(pl.title))) { const after = k[3];
          named.forEach(a => { if (foreign(a) && after.toLowerCase().indexOf(a.toLowerCase()) === 0) bad.push('pill title says "' + k[1] + ' ' + a + '"'); }); } });
      return bad; };

    const p = await open(browser, 1600, 1000);
    const ADDR = await p.evaluate(() => NODES.filter(n => n.k).map(n => n.k));
    AXES = await p.evaluate(() => CHARGES.map(c => c.toLowerCase()));
    ok(ADDR.length > 0, 'the address names are read off the page\'s own table, ' + ADDR.length);
    /* checked on a known bad case first: a pill titled the way main titles it */
    const known = judge(ADDR, 'I was furious.', '', [{ text: 'Pride +1.5', title: 'Named by the words.' }]);
    ok(known.length === 1, 'the check catches a known bad pill: ' + JSON.stringify(known));
    ok(judge(ADDR, 'I felt pride.', 'You wrote “pride”.', []).length === 0, 'and passes a word the person did write');
    ok(judge(ADDR, 'I was furious.', '', [{ text: 'Pride +1.5', title: 'Your words named anger. The engine picked this address for it.' }]).length === 0,
      'and passes a title that names what the words named, not the address');
    ok(judge(ADDR, 'I was furious.', 'around the word “Pride”', []).length === 1, 'and catches an address quoted as the person\'s word');
    ok(judge(ADDR, 'I was furious.', 'You named Pride.', []).length === 1, 'and catches "you named" an address the story does not hold');
    for (const t of STORIES) {
      await type(p, t);
      const story = await p.evaluate(() => ({
        list: (document.getElementById('stimps') || {}).textContent || '',
        pills: [...document.querySelectorAll('#stimps .st-pill')].map(e => ({ text: e.textContent, title: e.getAttribute('title') || '' })) }));
      const a = judge(ADDR, t, story.list, story.pills);
      ok(a.length === 0, 'Story page list, ' + JSON.stringify(t) + ': ' + (a.join('; ') || 'clean'));
      const other = await p.evaluate(tt => {
        const ps = parseStory(tt);
        const ob = (typeof obReadOf === 'function') ? obReadOf(ps, 'story', {}).map(obGroup).join('') : '';
        const box = document.createElement('div'); box.innerHTML = ob;
        ST_TEXT = tt; ST_PARSED = ps;
        const ghosts = (typeof impGhosts === 'function') ? impGhosts() : [];
        return { ob: box.textContent, ghosts: ghosts.length };
      }, t);
      const b = judge(ADDR, t, other.ob, []);
      ok(b.length === 0, 'onboarding mirror rows, ' + JSON.stringify(t) + ': ' + (b.join('; ') || 'clean'));
    }
    /* the Imprints page's pending pills, through its own renderer */
    await type(p, 'I was furious.');
    await p.evaluate(() => { const e = document.getElementById('stbank'); if (e) e.click(); });
    await p.waitForTimeout(300);
    const ip = await p.evaluate(() => [...document.querySelectorAll('.ip.ghost')].map(e => ({ text: e.textContent, title: e.getAttribute('title') || '' })));
    const c = judge(ADDR, 'I was furious.', ip.map(x => x.title).join(' '), ip);
    ok(c.length === 0, 'Imprints page pending pills: ' + (c.join('; ') || 'clean, ' + ip.length + ' pills'));
    await p.cx.close();

    /* the Day One tutorial, through its real commit, one fresh page a story */
    for (const t of STORIES) {
      const q = await open(browser, 1600, 1000);
      await q.evaluate(() => tutorialOpen(true)); await q.waitForTimeout(400);
      await q.fill('#tuttext', t); await q.click('[data-tut="commit"]'); await q.waitForTimeout(400);
      const card = await q.evaluate(() => (document.getElementById('tutorial') || {}).textContent || '');
      const d = judge(ADDR, t, card, []);
      ok(d.length === 0 && card.length > 0, 'Day One tutorial first card, ' + JSON.stringify(t) + ': ' + (d.join('; ') || 'clean'));
      ok(!q.errs.length, 'no page errors in the tutorial: ' + q.errs.join(' | '));
      await q.cx.close();
    }

    /* the quiz's story cards */
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const qz = await cx.newPage(); await qz.goto(QUIZ, { waitUntil: 'load' });
    for (const t of STORIES) {
      const txt = await qz.evaluate(tt => { const ps = parseStory(tt), h = storyLit(ps, tt, read(scored().p).reading);
        const box = document.createElement('div'); box.innerHTML = h; return box.textContent; }, t);
      const e = judge(ADDR, t, txt, []);
      ok(e.length === 0, 'quiz story cards, ' + JSON.stringify(t) + ': ' + (e.join('; ') || 'clean'));
    }
    await cx.close();
  }

  console.log('\n=== S5 · what was read and not counted is said on the Story page, with its meaning beside it ===');
  for (const [w, h] of [[1600, 1000], [390, 844]]) {
    const p = await open(browser, w, h);
    const T = 'I was not angry. He is furious. You feel so alone. I was scared.';
    await type(p, T);
    const look = () => p.evaluate(() => {
      const e = document.getElementById('staside'), r = e ? e.getBoundingClientRect() : null;
      return { text: e ? e.textContent : null, hidden: e ? e.hidden : null, w: r ? r.width : 0, h: r ? r.height : 0,
        role: e ? e.getAttribute('role') : null, engine: asideSay(asideOf(ST_TEXT, ST_PARSED)),
        sw: document.documentElement.scrollWidth, vw: innerWidth };
    });
    const s = await look();
    ok(s.text !== null && !s.hidden && s.w > 0 && s.h > 0 && s.role === 'note',
      '@' + w + ': the note is on the Story page, drawn, as a note: ' + JSON.stringify({ hidden: s.hidden, w: s.w, h: s.h, role: s.role }));
    ok(s.text === s.engine && s.engine.length > 0, '@' + w + ': it is the engine\'s own sentence, one copy for every surface');
    ok(/“not angry” is not counted, because you said no to it\./.test(s.text),
      '@' + w + ': the word said with a no, in the person\'s letters, with what not counted means beside it');
    ok(/“He is furious” is not counted, because it is about someone else\. Write how it landed on you/.test(s.text),
      '@' + w + ': the word about someone else, with why and what to write instead');
    ok(/“You feel so alone” is not counted, because it may not be about you\. Write it with I if it is yours\./.test(s.text),
      '@' + w + ': the unclear one, said as unclear, never as someone else\'s');
    ok(!/scared/.test(s.text), '@' + w + ': a word that counts is not in it');
    ok(s.sw <= s.vw, '@' + w + ': no sideways scroll, ' + s.sw + ' of ' + s.vw);
    await type(p, 'I was scared.');
    const q = await look();
    ok(q.hidden === true && q.text === '', '@' + w + ': with nothing set aside the note is gone, not an empty box');
    ok(!p.errs.length, '@' + w + ': no page errors: ' + p.errs.join(' | '));
    await p.cx.close();
  }

  await browser.close();
  console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed =====');
  if (fails.length) { fails.forEach(f => console.log('  FAIL  ' + f)); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
