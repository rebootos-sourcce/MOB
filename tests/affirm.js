#!/usr/bin/env node
/* ============================================================
   THE AFFIRMATION SHEET, IN A REAL PAGE. 18 November.

   env NODE_PATH=$(npm root -g) CHROME=/opt/pw-browsers/chromium node tests/affirm.js
   AFFIRM_HTML=file   runs against another build, for checking the checker

   His words: "This is a small affirmation engine utility that I want added
   to the ritual builder. We'll use this to generate high quality
   affirmations." The engine and its table are held by tests/engine.js, group
   AE. This file holds what only a page can show, at 1600 and at 390:

     the ritual builder carries one door, Affirm, and it opens the sheet;
     a typed theme composes on Enter and never while a word is still being
     composed through an input method;
     the seven rows are the engine's own lines, as plain text, one per point
     Root to Crown, with the Source AI treatment on each and markup typed
     into the box drawn as the characters typed;
     All that is is a real switch: Enter and Space turn it, aria-checked
     follows, and the rows re-render live from the set already composed;
     a theme about hurting oneself composes nothing, says the 988 line word
     for word, and Add and Copy write nothing even when forced;
     Copy puts his format on the clipboard and its label never changes;
     Add keeps the set, the Ritual page's Today affirmations say it with the
     Source AI mark on every line, and it is still there after a reload;
     nothing scrolls sideways, every target is at least 44 pixels, no two
     rows overlap, and every symbol carries its meaning on hover and tap.

   Each check was shown to fail on a known bad build first, the standing
   rule; the mutants and what caught each are in the notes beside this
   branch. No count is typed into this file. Read the counts off the run.
   ============================================================ */
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const SRC = process.env.AFFIRM_HTML ? path.resolve(process.env.AFFIRM_HTML) : path.join(ROOT, 'source.html');
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium';

let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) { PASS++; console.log('  ok    ' + m); } else { FAIL++; console.log('  FAIL  ' + m); } };
const booted = pg => pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 });
/* a press inside about a second and a half of boot can be dropped, measured
   23 October (tests/landing.js); that race is not what this file holds */
const settle = pg => pg.waitForTimeout(1500);

async function width(browser, W, H) {
  console.log('\n' + W + ' by ' + H);
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + SRC); await booted(pg); await settle(pg);
  /* a person of their own, so Add is theirs to press. The blank profile the
     device opens with is that person; a worked example is the other case. */
  const own = await pg.evaluate(() => { setTab(TAB.RITUAL); return typeof ritOwn === 'function' && ritOwn(); });
  await pg.waitForTimeout(300);
  ok(own, 'the device opens on a profile of its own, so Add can be pressed');

  /* THE DOOR */
  const door = await pg.evaluate(() => {
    const d = document.querySelector('[data-affopen="ritual"]'); if (!d) return null;
    const r = d.getBoundingClientRect();
    return { w: r.width, h: r.height, vis: r.width > 0 && r.height > 0, txt: d.textContent.trim(), tip: d.getAttribute('data-tip') || '' };
  });
  ok(door && door.vis && door.txt === 'Affirm', 'the ritual builder carries one door, Affirm, ' + JSON.stringify(door && door.txt));
  ok(door && door.h >= 44 && door.w >= 44, 'and it is at least 44 pixels, ' + (door && door.w + ' by ' + door.h));
  ok(door && door.tip.length > 20, 'and its meaning is on hover and tap');
  await pg.click('[data-affopen="ritual"]'); await pg.waitForTimeout(250);
  const open = await pg.evaluate(() => ({ sheet: !document.getElementById('sheet').hidden, aff: !!document.querySelector('#sheet-card .aff'),
    focus: document.activeElement && document.activeElement.id, rows: document.querySelectorAll('.aff-row').length,
    src: (document.getElementById('affsrc') || {}).value }));
  ok(open.sheet && open.aff, 'the door opens the Affirmations sheet');
  ok(open.rows === 0 && open.src === 'typed' && open.focus === 'afft', 'an empty record opens on My own words, the box focused, and no default set, ' + JSON.stringify(open));

  /* ENTER, AND NOT WHILE A WORD IS BEING COMPOSED */
  await pg.fill('#afft', 'clear');
  await pg.evaluate(() => { const i = document.getElementById('afft');
    i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true })); });
  ok(await pg.evaluate(() => document.querySelectorAll('.aff-row').length) === 0, 'Enter while a word is still being composed composes nothing');
  await pg.fill('#afft', 'calm'); await pg.press('#afft', 'Enter'); await pg.waitForTimeout(150);
  const rows = await pg.evaluate(() => {
    const want = affCompose('calm').lines.map(l => l.plain);
    const got = [...document.querySelectorAll('.aff-row .aff-tx')].map(e => e.textContent);
    return { want, got, ai: [...document.querySelectorAll('.aff-row .aff-tx')].every(e => e.classList.contains('src-ai')),
      pts: [...document.querySelectorAll('.aff-row')].map(e => e.getAttribute('aria-label').split(' point')[0]),
      pressed: [...document.querySelectorAll('.aff-row')].every(e => e.getAttribute('aria-pressed') === 'true'),
      mark: !!document.querySelector('.aff-hd .src-mk[data-tip]'), live: (document.getElementById('affrows') || {}).getAttribute && document.getElementById('affrows').getAttribute('aria-live') };
  });
  ok(rows.got.length === 7 && JSON.stringify(rows.got) === JSON.stringify(rows.want), 'Enter composes the engine\'s own seven lines as plain text, ' + JSON.stringify(rows.got.slice(0, 2)));
  ok(rows.got.every(t => !/[*#`]|\bchakra\b|\bseat\b|\d/.test(t)), 'no asterisk, markdown, number, chakra or seat in a line a person reads');
  ok(JSON.stringify(rows.pts) === JSON.stringify(['Root', 'Sacral', 'Solar', 'Heart', 'Throat', '3rd Eye', 'Crown']), 'one line per point, Root to Crown, ' + rows.pts.join(','));
  ok(rows.ai && rows.mark, 'every line wears the Source AI treatment and the head carries the one mark');
  ok(rows.pressed && rows.live === 'polite', 'every row is pressed to keep by default, and the list is announced politely');

  /* THE SWITCH */
  const before = await pg.evaluate(() => { window.__affRes = AFF.res; return document.getElementById('affsw').getAttribute('aria-checked'); });
  await pg.focus('#affsw'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(100);
  const on = await pg.evaluate(() => ({ chk: document.getElementById('affsw').getAttribute('aria-checked'), role: document.getElementById('affsw').getAttribute('role'),
    same: window.__affRes === AFF.res, got: [...document.querySelectorAll('.aff-row .aff-tx')].map(e => e.textContent),
    want: affCompose('calm').lines.map(l => l.wrapped), fix: document.querySelectorAll('.aff-row .aff-fix').length,
    tip: (document.getElementById('affsw').getAttribute('data-tip') || ''), sw: document.getElementById('affsw').getBoundingClientRect() }));
  ok(before === 'false' && on.chk === 'true' && on.role === 'switch', 'All that is is off at open, a role switch, and Enter turns it on');
  ok(JSON.stringify(on.got) === JSON.stringify(on.want), 'the rows re-render live in his words, capital I kept, ' + JSON.stringify(on.got[1]));
  ok(on.same, 'and nothing was composed again to do it');
  ok(on.fix === 14, 'his fixed words sit in the muted ink on every row, prefix and suffix');
  ok(/creator of all that is/.test(on.tip) && on.sw.width >= 44 && on.sw.height >= 44, 'the switch carries his full words on hover and tap, and is 44 by 44');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(100);
  ok(await pg.evaluate(() => document.getElementById('affsw').getAttribute('aria-checked')) === 'false', 'Space turns it off again');

  /* COPY */
  await pg.click('#affcopy'); await pg.waitForTimeout(300);
  const cp = await pg.evaluate(async () => {
    let clip = null; try { clip = await navigator.clipboard.readText(); } catch (e) {}
    return { clip, want: affPlain(affCompose('calm').lines, false), label: document.getElementById('affcopy').textContent,
      said: (document.getElementById('status') || {}).textContent };
  });
  ok(cp.clip === cp.want, 'Copy puts his format on the clipboard, "* Point: line.", ' + JSON.stringify((cp.clip || '').split('\n')[0]));
  ok(cp.label === 'Copy' && /Copied/.test(cp.said || ''), 'Copy says so through the status line and its label never changes, ' + JSON.stringify(cp.said));
  /* a row pressed off is left out of Copy and Add */
  await pg.click('.aff-row[data-affrow="1"]'); await pg.waitForTimeout(100);
  ok(await pg.evaluate(() => document.querySelector('.aff-row[data-affrow="1"]').getAttribute('aria-pressed')) === 'false', 'a row pressed is left out, and says so');

  /* MARKUP TYPED IS DRAWN AS TYPED */
  await pg.selectOption('#affsrc', 'typed').catch(() => {});
  await pg.fill('#afft', '<b>bold</b>'); await pg.press('#afft', 'Enter'); await pg.waitForTimeout(100);
  ok(await pg.evaluate(() => !document.querySelector('#sheet-card b, #sheet-card img')), 'markup typed into the box never becomes markup on the sheet');

  /* THE SAFETY DOOR */
  const keptBefore = await pg.evaluate(() => STORE.get('atuned-affirm-kept'));
  await pg.fill('#afft', 'I want to hurt myself'); await pg.press('#afft', 'Enter'); await pg.waitForTimeout(150);
  const sf = await pg.evaluate(() => ({ rows: document.querySelectorAll('.aff-row').length, st: document.getElementById('affst').textContent,
    want: CRISIS_SAY.entryNow, add: document.getElementById('affadd').disabled, copy: document.getElementById('affcopy').disabled }));
  ok(sf.rows === 0 && sf.st === sf.want, 'a theme about hurting oneself composes nothing and says the 988 line word for word, ' + JSON.stringify(sf.st));
  ok(sf.add && sf.copy, 'and Add and Copy are disabled');
  await pg.evaluate(async () => { try { await navigator.clipboard.writeText('untouched'); } catch (e) {} });
  await pg.evaluate(() => { ['affadd', 'affcopy'].forEach(id => { const b = document.getElementById(id); b.disabled = false; b.click(); }); });
  await pg.waitForTimeout(200);
  const forced = await pg.evaluate(async () => { let c = null; try { c = await navigator.clipboard.readText(); } catch (e) {}
    return { kept: STORE.get('atuned-affirm-kept'), clip: c }; });
  ok(forced.kept === keptBefore && forced.clip === 'untouched', 'and a forced press on either writes nothing and copies nothing');

  /* SIDEWAYS, TARGETS, OVERLAP. An unbroken eighty characters is the worst a
     box with maxlength 80 can hold. */
  await pg.fill('#afft', 'x'.repeat(90)); await pg.press('#afft', 'Enter'); await pg.waitForTimeout(100);
  const ln = await pg.evaluate(() => document.getElementById('afft').value.length);
  ok(ln === 80, 'the box holds eighty characters and no more, ' + ln);
  await pg.fill('#afft', 'Someone who keeps his word'); await pg.press('#afft', 'Enter'); await pg.waitForTimeout(100);
  await pg.click('#affsw'); await pg.waitForTimeout(100);
  const lay = await pg.evaluate(() => {
    const card = document.getElementById('sheet-card');
    const t = [...card.querySelectorAll('button,select,input')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
    const small = t.filter(e => { const r = e.getBoundingClientRect(); return r.height < 44 || r.width < 44; }).map(e => (e.id || e.className) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
    const rs = [...card.querySelectorAll('.aff-row')].map(e => e.getBoundingClientRect());
    let over = 0; for (let i = 1; i < rs.length; i++) if (rs[i].top < rs[i - 1].bottom - 0.5) over++;
    const tipless = [...card.querySelectorAll('svg')].map(s => s.closest('[data-tip],[aria-label],button')).filter(x => !x).length;
    const pts = [...card.querySelectorAll('.aff-pt')].every(e => (e.getAttribute('data-tip') || '').length > 10);
    return { targets: t.length, small, over, sx: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      cx: card.scrollWidth - card.clientWidth, tipless, pts, rows: rs.length };
  });
  ok(lay.rows === 7 && lay.targets === 14, 'with My own words open the face carries fourteen targets, twelve and the box with its Affirm, read off the page: ' + lay.targets);
  ok(lay.small.length === 0, 'every target is at least 44 pixels, under: ' + JSON.stringify(lay.small));
  ok(lay.over === 0, 'no two rows overlap, wrapped in his words');
  ok(lay.sx <= 0 && lay.cx <= 1, 'nothing scrolls sideways, page ' + lay.sx + ', sheet ' + lay.cx);
  ok(lay.pts && lay.tipless === 0, 'every point ring and every symbol carries its meaning on hover and tap');

  /* ADD, AND A RELOAD */
  await pg.click('#affadd'); await pg.waitForTimeout(400);
  const add = await pg.evaluate(() => {
    const k = JSON.parse(STORE.get('atuned-affirm-kept') || '{}')[CURP.id];
    const lines = [...document.querySelectorAll('.rv-aff .rv-afq')];
    return { rows: k && k.rows.length, creator: k && k.creator, tab: S.tab === TAB.RITUAL, shut: document.getElementById('sheet').hidden,
      shown: lines.map(e => e.textContent), marked: lines.length > 0 && lines.every(e => e.querySelector('.src-mk') && e.classList.contains('src-ai')),
      story: JSON.stringify(k || {}).indexOf('keeps his word') >= 0 && JSON.stringify(k || {}).indexOf('Someone who') >= 0 };
  });
  ok(add.rows === 7 && add.creator === true && add.shut && add.tab, 'Add keeps the seven pressed lines with the switch as set, shuts the sheet and lands on the Ritual page');
  ok(add.shown.length === 7 && add.shown[0].indexOf('I am the creator of all that is, I am built to keep my word') === 0, 'the Today affirmations say the kept set, ' + JSON.stringify(add.shown[0]));
  ok(add.marked, 'with the Source AI mark on every kept line');
  ok(!add.story, 'and the words the line came from are not stored, only the line and a source key');
  await pg.reload(); await booted(pg); await settle(pg);
  const back = await pg.evaluate(() => { setTab(TAB.RITUAL); return [...document.querySelectorAll('.rv-aff .rv-afq')].map(e => e.textContent); });
  ok(back.length === 7 && back[6].indexOf('I empower myself to keep my word') >= 0, 'and it is still there after a reload, ' + JSON.stringify(back[6]));
  ok(errs.length === 0, 'no page error, ' + JSON.stringify(errs.slice(0, 2)));
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  try { await width(browser, 1600, 1000); await width(browser, 390, 844); }
  finally { await browser.close(); }
  console.log('\n===== affirm: ' + PASS + ' passed, ' + FAIL + ' failed =====');
  process.exit(FAIL ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
