#!/usr/bin/env node
/* ============================================================
   THE SNIFFER ON THE PAGE, IN A REAL BROWSER.
   NODE_PATH=/opt/node22/lib/node_modules node tests/sniffpage.js

   REVIEW-sniffer-audit-2026-10-09.md, packages S1 to S5. tests/engine.js
   holds the reader headless. This holds what only a page can show: that the
   Story page draws, counts and says exactly what the engine counted, and
   says nothing the engine did not. (The quiz was held here too, until the
   11 November quiz took its story box away; the note above S2 says what
   went.)

     S1  a word said with a no. The struck mark on the Story page is the
         engine's denied list, the counter's numbers are the engine's, and
         the list never claims a seat was charged by a denied word alone.
     S2  a charge word about someone else. The page draws exactly the
         engine's others as set aside and not struck, and the counter names
         them.
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
  /* THIS FILE READS THE WRITE BOX'S OWN LAYER, round of 28 October: the
     Journal is conversation only now, so #sthl and #sttext only render in a
     crisis (STV.crisis, ui/crisis.js). What this file holds, the struck
     marks over denied and other-person words, is still real there, so it
     is reached the way crisis reaches it rather than measured on a box
     that is gone from the ordinary flow. */
  await p.evaluate(() => { STV.chat = false; setTab(TAB.STORY); render(); });
  await p.waitForTimeout(400);
  p.cx = cx; return p;
}
const type = async (p, t) => { await p.evaluate(t => {
 ST_TEXT = t; ST_PARSED = ST_TEXT.trim() ? parseStory(ST_TEXT) : null; stRefresh(); }, t);
 await p.waitForTimeout(300); };

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
  /* THE CAPTION IS GONE, round of 29 October: see the ruling at stCtrPaint's
     old site in ui/storyui.js. It used to print "N words read, M kept,
     ..." for a person to read; this reads the same three counts straight
     off STR.marks and STR.toks, the engine's own flags, the way the
     caption itself used to, rather than off a sentence built to be read. */
  const ng = STR.marks.filter(m => m.neg).length, no = STR.marks.filter(m => m.oth).length;
  return {
    text: t,
    marks: [...document.querySelectorAll('#sthl mark')].map(m => ({ t: m.textContent, neg: m.classList.contains('neg'), oth: m.classList.contains('oth') })),
    denied: quote(P && P.denied, 'negAt'),
    others: quote(P && P.others, 'whoAt'),
    counts: { words: STR.toks.length, kept: STR.marks.length - ng - no, negated: ng, other: no },
    list: (document.getElementById('stimps') || {}).textContent || '',
    commit: (document.getElementById('stapply') || {}).textContent || ''
  };
});

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
require('./net.js').guardBrowser(browser);

  console.log('\n=== S1 · the Story page draws, counts and lists what the engine counted ===');
  {
    const p = await open(browser, 1600, 1000);
    await type(p, 'I was not angry. I was scared.');
    const s = await story(p);
    const struck = s.marks.filter(m => m.neg).map(m => m.t);
    ok(!!s.denied && s.denied.join('|') === 'not angry', 'the engine lists the denied word on the parse: ' + JSON.stringify(s.denied));
    ok(!!s.denied && struck.join('|') === s.denied.join('|'), 'the struck marks are exactly the engine\'s denied words: ' + JSON.stringify(struck));
    const kept = s.marks.filter(m => !m.neg && !m.oth).length, k = struck.length;
    ok(s.counts.kept === kept, 'the engine\'s own kept count is the marks that count, ' + kept + ': ' + JSON.stringify(s.counts));
    ok(s.counts.negated === k, 'and its set aside is the engine\'s denied count, ' + k + ': ' + JSON.stringify(s.counts));

    /* P3-1 of the inference audit, 24 October: a calm word said with a no is
       set aside like any other word, denied on the parse, struck on the page
       and counted as set aside, where it used to subtract a calm the person
       said they did not have */
    await type(p, 'I am not grateful. I was scared.');
    const c = await story(p);
    const cs = c.marks.filter(m => m.neg).map(m => m.t);
    ok(!!c.denied && c.denied.join('|') === 'not grateful' && cs.join('|') === 'not grateful',
      'a calm word after a no is denied on the parse and struck on the page: ' + JSON.stringify({ denied: c.denied, struck: cs }));
    ok(c.counts.negated === 1, 'and the engine sets it aside: ' + JSON.stringify(c.counts));

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

  /* THE QUIZ'S STORY BOX IS GONE, 12 November. S1, S2 and S4 each read the
     quiz page too, through its own storyLit() cards (the old quiz took a
     story and drew sniffer cards under it). The 11 November quiz is 59
     scale questions with no story input and no cards, and funnel/quiz.html
     defines none of parseStory, storyLit, read or scored, so those three
     quiz halves (four checks here, three in S2, one per story in S4) read
     nothing and went, the same way the Day One tutorial's checks went on
     23 October below. The Story page halves, where the reader still draws
     on a screen, stay. */

  console.log('\n=== S2 · someone else\'s charge is set aside on the page, and said so ===');
  {
    const p = await open(browser, 1600, 1000);
    await type(p, 'He is furious. I was scared.');
    const s = await story(p);
    const set = s.marks.filter(m => m.oth).map(m => m.t);
    ok(!!s.others && s.others.join('|') === 'He is furious', 'the engine lists the word about someone else on the parse: ' + JSON.stringify(s.others));
    ok(!!s.others && set.join('|') === s.others.join('|') && !s.marks.some(m => m.oth && m.neg),
      'the page draws exactly those as set aside, from the person to the word, and not struck: ' + JSON.stringify(s.marks));
    const kept = s.marks.filter(m => !m.neg && !m.oth).length;
    ok(s.counts.other === set.length && s.counts.kept === kept,
      'the engine keeps ' + kept + ' and sets ' + set.length + ' aside as about someone else: ' + JSON.stringify(s.counts));
    await type(p, 'He is furious.');
    const d = await story(p);
    ok(d.commit === 'Commit', 'someone else\'s charge alone gives Commit nothing to count: ' + JSON.stringify(d.commit));
    ok(!p.errs.length, 'no page errors on the Story page: ' + p.errs.join(' | '));
    await p.cx.close();
    /* the quiz half of S2 went 12 November, see the note above S2 */
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
       Four surfaces print an address read from a story: the Story page's
       pending list, the quiz's story cards, the onboarding mirror's rows and
       the Imprints page's pending pills. Each is driven through its own
       renderer with the same stories. */
    const STORIES = ['I was furious.', 'I am exhausted.', 'My father died last year.',
      'I was scared and my chest went tight.', 'I am exhausted and furious.',
      /* the grief named, which is when the pill printed Martyrdom: the bare
         sentence above names no feeling and was always folded */
      'My father died last year and I still cannot stop crying.'];
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
    /* THE CLAIM, NOT ONLY THE WORDING, P0-3 of the inference audit, 23
       October. The rule above fails a surface only when it says "you said",
       "you named" or quotes the address. Summary's first card made the same
       claim with none of those words, "Release this first: Victimhood" after
       three entries about a father's death, and the journal's pill printed
       Martyrdom with its only disclosure in a hover title. So the surfaces
       that print an address as what a person holds are held to the claim
       itself: no address name the story's letters do not contain, whatever
       sentence it sits in. Fear, Shame and Anger are address names and also
       the true word for the feeling, so the nine feelings are not counted.
       The onboarding mirror and the quiz's story cards print an address as a
       question, with Yes and Not me beside it, and stay under the rule above. */
    const foreignIn = (story, label) => {
      const low = ' ' + String(story).toLowerCase().replace(/[^a-z]+/g, ' ') + ' ';
      const lab = ' ' + String(label).toLowerCase().replace(/[^a-z]+/g, ' ') + ' ';
      return ADDR.filter(a => { const w = ' ' + a.toLowerCase().replace(/[^a-z]+/g, ' ').trim() + ' ';
        return AXES.indexOf(a.toLowerCase()) < 0 && low.indexOf(w) < 0 && lab.indexOf(w) >= 0; }); };
    ok(foreignIn('My father died last year.', 'Release this first Victimhood').join() === 'Victimhood',
      'the claim check catches a known bad card, Victimhood for a father\'s death');
    ok(foreignIn('My father died last year.', 'Release this first Sadness').length === 0
      && foreignIn('I was afraid.', 'Fear +2.1').length === 0 && foreignIn('I felt pride.', 'Pride +1.5').length === 0,
      'and passes the feeling the words named, and an address name the person wrote');
    for (const t of STORIES) {
      await type(p, t);
      const story = await p.evaluate(() => ({
        list: (document.getElementById('stimps') || {}).textContent || '',
        pills: [...document.querySelectorAll('#stimps .st-pill')].map(e => ({ text: e.textContent, title: e.getAttribute('title') || '' })) }));
      const a = judge(ADDR, t, story.list, story.pills);
      ok(a.length === 0, 'Story page list, ' + JSON.stringify(t) + ': ' + (a.join('; ') || 'clean'));
      const pc = foreignIn(t, story.pills.map(x => x.text).join(' | '));
      ok(pc.length === 0 && story.pills.length > 0, 'Story page pills print the feeling and no address the story does not hold, '
        + JSON.stringify(t) + ': ' + (pc.join(', ') || story.pills.map(x => x.text).join(' | ')));
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
    const ic = foreignIn('I was furious.', ip.map(x => x.text).join(' | '));
    ok(ic.length === 0 && ip.length > 0, 'Imprints page pending pills print the feeling and no address: '
      + (ic.join(', ') || ip.map(x => x.text).join(' | ')));
    await p.cx.close();

    /* Analytics and Summary, after real commits on a fresh profile. One grief
       entry leaves nothing above the line, which is when Analytics names the
       heaviest address; three put it above, which is when Summary's first
       card names it. */
    {
      const ps = await open(browser, 1600, 1000);
      const GRIEF = 'My father died last year and I still cannot stop crying.';
      const commit = () => ps.evaluate(tt => { ST_TEXT = tt; ST_PARSED = parseStory(tt); const c = stCommit(); return !!(c && c.ok); }, GRIEF);
      ok(await commit(), 'a grief entry commits on a fresh profile');
      const ana = await ps.evaluate(() => { setTab(TAB.ANALYTICS); render(); return (document.getElementById('ana') || {}).textContent || ''; });
      const al = (ana.match(/The heaviest[^.]*\./) || [''])[0];
      const ac = foreignIn(GRIEF, al);
      ok(!!al && ac.length === 0, 'Analytics names the feeling the heaviest address carries and no address: ' + JSON.stringify(al) + (ac.length ? ' ' + ac.join(', ') : ''));
      ok(await commit() && await commit(), 'two more grief entries commit');
      /* THE "RELEASE THIS FIRST" CARD THIS BLOCK USED TO CHECK IS GONE
         OUTRIGHT, ruled 3 November (summary.js:1258 carries the owner's own
         words): the whole "What to do" column (Release this first, the
         Protocol, Next marker) came off Summary's surface that day, replaced
         by nothing on this screen; sumOutput() that built it still exists in
         the file, unreachable, kept for tests/record.js and a future
         release-focused surface, not this one. So Summary has no second
         place that names the heaviest address's feeling any more; the
         Analytics assertion above is this test's real coverage of that
         behaviour now. Checked directly against the real DOM before cutting
         this: three grief commits render zero `.s-out` elements on Summary,
         confirmed, not assumed. */
      const sumErrs = await ps.evaluate(() => { setTab(TAB.SUMMARY); render(); return true; });
      ok(sumErrs, 'Summary renders after three grief entries with no thrown error');
      ok(!ps.errs.length, 'no page errors through the commits, Analytics and Summary: ' + ps.errs.join(' | '));
      await ps.cx.close();
    }

    /* THE DAY ONE TUTORIAL'S TWO CARDS were driven here too, its first card
       through the rule above and its second card's chain through a check of
       its own, until that sequence was removed on 23 October. Both cards
       went with it, and so did the chain check, which read nothing else. */

    /* the quiz's story cards were judged here too, one check per story in
       STORIES, until the quiz lost its story box on 11 November (the note
       above S2); nothing on the quiz prints an address read from a story
       any more, so there is nothing for this rule to read there */
  }

  console.log('\n=== S5 · what was read and not counted is said on the Story page, with its meaning beside it ===');
  for (const [w, h] of [[1600, 1000], [390, 844]]) {
    const p = await open(browser, w, h);
    /* THE NOTE MOVED TO THE EXPANDED VIEW, 10 November, his words on a real
       screenshot of the mini view's own copy of this box, scribbled out
       entirely: "remove that text field or hide that text field from the
       mini dashboard. It only belongs in the expanded one." #stsrc is
       display:none there now, no exception, so this check follows the
       requirement to where it actually lives, the Full Dashboard
       (STV.dash), rather than stand as a stale assertion against a view
       that no longer carries the feature. */
    await p.evaluate(() => { STV.dash = true; stRender(); });
    const T = 'I was not angry. He is furious. You feel so alone. I was scared.';
    await type(p, T);
    const look = () => p.evaluate(() => {
      const e = document.getElementById('staside'), r = e ? e.getBoundingClientRect() : null;
      /* THE SENTENCE MOVED INTO #stsrc'S OWN BOX, 10 November: his words,
         "delete the text field directly under Uni... move its properties
         where it's detecting the patterns into the text field beneath
         that one." #staside itself stays in the DOM (stAsideSay/
         stAsidePaint still run it every refresh) but is display:none now,
         always, by design; .src-aside, inside #stsrc, prints the same
         engine sentence instead, in the one merged box. The note still
         has to be drawn somewhere real, just not there any more. */
      const a = document.querySelector('.src-aside'), ar = a ? a.getBoundingClientRect() : null;
      return { text: e ? e.textContent : null, hidden: e ? e.hidden : null, w: r ? r.width : 0, h: r ? r.height : 0,
        role: e ? e.getAttribute('role') : null, engine: asideSay(asideOf(ST_TEXT, ST_PARSED)),
        asideText: a ? a.textContent : null, asideW: ar ? ar.width : 0, asideH: ar ? ar.height : 0,
        sw: document.documentElement.scrollWidth, vw: innerWidth };
    });
    const s = await look();
    ok(s.text !== null && s.role === 'note' && s.asideText !== null && s.asideW > 0 && s.asideH > 0,
      '@' + w + ': the note is on the Story page, drawn, in the merged box under Uni: ' + JSON.stringify({ asideW: s.asideW, asideH: s.asideH, role: s.role }));
    ok(s.text === s.engine && s.engine.length > 0, '@' + w + ': it is the engine\'s own sentence, one copy for every surface');
    ok(s.asideText === s.engine, '@' + w + ': the merged box under Uni carries the exact same sentence, not a second copy of its own');
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
    ok(q.asideText === null, '@' + w + ': and the merged box drops it too, not an empty line left standing');
    ok(!p.errs.length, '@' + w + ': no page errors: ' + p.errs.join(' | '));
    await p.cx.close();
  }

  await browser.close();
  console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed =====');
  if (fails.length) { fails.forEach(f => console.log('  FAIL  ' + f)); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
