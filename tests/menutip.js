#!/usr/bin/env node
/* ============================================================
   A CONTROL WHOSE MENU IS OPEN HAS NO TOOLTIP. 18 November.

   env CHROME=/path/to/chromium NODE_PATH=$(npm root -g) \
     flock /tmp/atuned-gates.lock node tests/menutip.js
   MENUTIP_HTML=file   runs against another build, for checking the checker

   The owner's card: "Hide the sun button tooltip while its menu is open".
   The sun is the Lighting button in the top bar, and its own panel from the
   one tooltip (ui/tip.js), "Lighting, Dark", stayed up over the menu it had
   just opened, and stayed while the pointer rested on the button. The fix is
   in ui/tip.js: popped(), hold() and unhold(), and the observer on
   aria-expanded at the end of wire().

   WHAT THIS HOLDS, at 1600 unless it says otherwise

     1  the sun, by a real pointer: a panel already up when the menu opens is
        gone in the same frame, with no exit fade; with the pointer resting on
        the button no panel is displayed at once, after 100 ms or after 1.5 s,
        which is past the show delay; and the native title is held, so the
        browser cannot put up its own box in the panel's place
     2  the entries inside the menu keep their panels, by hover and by focus
     3  the keyboard: focus opens the button's panel while the menu is shut,
        Enter opens the menu and the panel goes, focus coming back to the
        button with the menu open shows none, and Escape from an entry puts
        focus on the button with its panel back
     4  every way of closing gives the panel back on hover: Escape, a press
        outside, choosing a lighting (which renames the button, and the new
        name is what comes back), and pressing the button again
     5  the held press on a phone. At 390 the sun is not on the bar (it moves
        into the main menu under 720 wide, and that is asserted, not assumed),
        so the press is held on a phone turned on its side, 844 by 390 with a
        touch screen: held on the shut button it explains (the known good
        case), held with the menu open it shows nothing
     6  every other control that opens a popup and carries a panel, found at
        run time on Discover and on the Field rather than listed here, does
        the same: shown when shut, none on press or rest, back after a close.
        The four that exist today are asserted by name so a discovery that
        finds nothing cannot pass
     7  an open disclosure keeps its panel: the Field bar's fold is expanded
        and controls the bar it sits in, and hovering it still explains

   THE PROBE IS CHECKED BEFORE IT IS BELIEVED: every "no panel" reading is
   preceded in the same state by a "panel shown" reading of a known good
   carrier, so a probe that cannot see the panel fails rather than passes.

   EVERY CHECK HAS ITS OWN MUTANT, proved on scratch copies of the built file
   before this gate was trusted; the ids and what caught each are in the
   commit that added this file. No count is typed into this file. Read the
   counts off the run.
   ============================================================ */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const SRC = process.env.MENUTIP_HTML ? path.resolve(process.env.MENUTIP_HTML) : path.join(ROOT, 'source.html');
const CHROME = process.env.CHROME || chromium.executablePath();

let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) { PASS++; console.log('  ok    ' + m); } else { FAIL++; console.log('  FAIL  ' + m); } };
const booted = pg => pg.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 30000 }).catch(() => {});

/* the panel as a person sees it. on is the class that draws it, read apart
   from aria-hidden on purpose: a show frame that outlived its hide once left
   the panel drawn with aria-hidden true, and a probe that asked aria-hidden
   called that panel gone while it sat over the menu. gone also asks the
   computed visibility, so a panel still fading out is not gone. */
const TIP = pg => pg.evaluate(() => {
  const t = document.getElementById('tip');
  if (!t) return { on: false, vis: 'hidden', text: '' };
  const s = getComputedStyle(t);
  return { on: t.classList.contains('on'), heard: t.getAttribute('aria-hidden') === 'false',
    vis: s.visibility, op: +s.opacity, cls: t.className, tr: s.transition.slice(0, 40), text: t.innerText.replace(/\s+/g, ' ').trim() };
});
const shown = t => t.on && t.vis !== 'hidden';
const gone = t => !t.on && t.vis === 'hidden';
const say = t => (shown(t) ? 'shown "' + t.text.slice(0, 40) + '"' : 'none') + ', visibility ' + t.vis + (process.env.MENUTIP_DEBUG ? ' [' + t.cls + ' | ' + t.tr + ' | ' + t.op + ']' : '');

const centre = (pg, sel) => pg.evaluate(s => { const e = document.querySelector(s); if (!e) return null;
  const r = e.getBoundingClientRect(); if (!r.width) return null; return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel);
/* somewhere to rest the pointer that is no carrier, found and not assumed:
   the first cut rested it at 3,400, which is a carrier on the left column,
   and its panel was up and fading out when the next check read the page */
const away = async pg => {
  const p = await pg.evaluate(() => { for (let y = innerHeight - 30; y > 100; y -= 23) for (let x = innerWidth * 0.45; x < innerWidth * 0.75; x += 31) {
    const e = document.elementFromPoint(x, y);
    if (e && !e.closest('[data-tip],[data-tip-t],[title],[data-tip-held],button,a,input,canvas,[role=button]')) return { x, y }; }
    return { x: innerWidth / 2, y: innerHeight - 30 }; });
  await pg.mouse.move(p.x, p.y); await pg.waitForTimeout(400); };
const hoverOn = async (pg, sel) => { await away(pg); const c = await centre(pg, sel); if (!c) return null;
  await pg.mouse.move(c.x, c.y); await pg.waitForTimeout(1000); return TIP(pg); };
/* a press outside: a point on the bar that is the bar itself, nothing inside it */
const outside = pg => pg.evaluate(() => { const bar = document.querySelector('.top'), r = bar.getBoundingClientRect();
  for (let x = r.left + r.width * 0.35; x < r.right; x += 7) { const e = document.elementFromPoint(x, r.top + r.height / 2);
    if (e === bar) return { x, y: r.top + r.height / 2 }; }
  return { x: innerWidth / 2, y: innerHeight - 140 }; });
const menuOpen = (pg, sel) => pg.evaluate(s => document.querySelector(s).getAttribute('aria-expanded') === 'true', sel);
const titleOf = pg => pg.evaluate(() => { const b = document.getElementById('lightbtn');
  return { title: b.getAttribute('title'), held: b.getAttribute('data-tip-held') }; });

async function open(browser, W, H, ctx) {
  const cx = await browser.newContext(Object.assign({ viewport: { width: W, height: H } }, ctx || {}));
  const pg = await cx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await pg.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' });
  await booted(pg); await pg.waitForTimeout(600);
  return { cx, pg, errs };
}

/* press, then read the panel at once, after 100 ms and after 1.5 s. strict
   means no panel at all; otherwise no panel FOR THIS CONTROL, read off the
   tip-open class showFor puts on its carrier, because the profile menu moves
   focus onto its first row as it opens and that row may explain itself */
async function pressAndRest(pg, sel, name, strict) {
  const read = async () => { const t = await TIP(pg);
    if (!strict && t.on) { const mine = await pg.evaluate(s => document.querySelector(s).classList.contains('tip-open'), sel);
      if (!mine) return { on: false, vis: 'hidden', text: '(a row of the menu: ' + t.text.slice(0, 30) + ')' }; }
    return t; };
  const c = await centre(pg, sel);
  await pg.mouse.move(c.x, c.y); await pg.mouse.down(); await pg.mouse.up();
  const t0 = await read(); await pg.waitForTimeout(100);
  const t1 = await read(); await pg.waitForTimeout(1400);
  const t2 = await read();
  const opened = await menuOpen(pg, sel);
  ok(opened, name + ': the press opened its menu');
  ok(gone(t0), name + ': the moment the menu opens no panel is displayed, ' + say(t0));
  ok(gone(t1), name + ': after 100 ms with the pointer resting on it, ' + say(t1));
  ok(gone(t2), name + ': after 1.5 s with the pointer resting on it, past the show delay, ' + say(t2));
  return opened;
}

(async () => {
  if (!fs.existsSync(SRC)) { console.log(path.relative(ROOT, SRC) + ' is missing: build first'); process.exit(1); }
  const browser = await chromium.launch({ executablePath: CHROME });
  require('./net.js').guardBrowser(browser);

  /* ---------------------------------------------------------------- 1, 2 */
  console.log('\n=== 1 · the sun at 1600: no panel while its menu is open, and none from the browser ===');
  {
    const { cx, pg, errs } = await open(browser, 1600, 1000);
    const known = await hoverOn(pg, '#srchbtn');
    ok(shown(known), 'the probe sees a panel: hovering the search circle shows its own, ' + say(known));
    const before = await hoverOn(pg, '#lightbtn');
    ok(shown(before) && /Lighting/.test(before.text), 'with the menu shut, hovering the sun shows its panel, ' + say(before));
    await pressAndRest(pg, '#lightbtn', 'the sun', true);
    const tt = await titleOf(pg);
    ok(tt.title === null, 'while the menu is open the sun carries no native title for the browser to show: title ' + JSON.stringify(tt.title));
    /* the press inside the hover delay, which left a timer armed */
    await pg.evaluate(() => document.getElementById('lightbtn').click()); await away(pg);
    const c = await centre(pg, '#lightbtn');
    await pg.mouse.move(c.x, c.y); await pg.waitForTimeout(120); await pg.mouse.down(); await pg.mouse.up();
    await pg.waitForTimeout(1200);
    ok(gone(await TIP(pg)) && await menuOpen(pg, '#lightbtn'), 'a press inside the hover delay does not put the panel up after the menu opens, ' + say(await TIP(pg)));

    console.log('\n=== 2 · the entries inside the menu keep their panels ===');
    const n = await pg.evaluate(() => document.querySelectorAll('#themes button').length);
    for (let i = 0; i < n; i++) {
      await pg.mouse.move(c.x, c.y + 60); await pg.waitForTimeout(200);
      const e = await pg.evaluate(i => { const b = document.querySelectorAll('#themes button')[i], r = b.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2, nm: b.getAttribute('title') }; }, i);
      await pg.mouse.move(e.x, e.y); await pg.waitForTimeout(900);
      const t = await TIP(pg);
      ok(shown(t) && t.text.indexOf(e.nm) >= 0, 'hover on the ' + e.nm + ' entry, with the menu open, shows its panel: ' + say(t));
    }
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(100);
    await pg.focus('#themes button'); await pg.waitForTimeout(300);
    const kf = await TIP(pg);
    ok(shown(kf) && await menuOpen(pg, '#lightbtn'), 'keyboard focus on the first entry, with the menu open, shows its panel: ' + say(kf));
    ok(errs.length === 0, 'no page error or console error: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  /* ---------------------------------------------------------------- 3 */
  console.log('\n=== 3 · the keyboard ===');
  {
    const { cx, pg, errs } = await open(browser, 1600, 1000);
    await away(pg);
    await pg.focus('#lightbtn'); await pg.waitForTimeout(300);
    const f0 = await TIP(pg);
    ok(shown(f0) && /Lighting/.test(f0.text), 'focus on the shut sun shows its panel, the known good case: ' + say(f0));
    await pg.keyboard.press('Enter');
    const f1 = await TIP(pg);
    ok(await menuOpen(pg, '#lightbtn') && gone(f1), 'Enter opens the menu and the panel is gone in the same frame: ' + say(f1));
    await pg.keyboard.press('Tab'); await pg.waitForTimeout(300);
    const f2 = await TIP(pg);
    ok(shown(f2) && await pg.evaluate(() => document.activeElement.closest('#themes') !== null), 'Tab moves into the menu and the entry explains itself: ' + say(f2));
    await pg.keyboard.press('Shift+Tab');
    const g0 = await TIP(pg); await pg.waitForTimeout(100); const g1 = await TIP(pg); await pg.waitForTimeout(1400); const g2 = await TIP(pg);
    const onBtn = await pg.evaluate(() => document.activeElement && document.activeElement.id === 'lightbtn');
    ok(onBtn && await menuOpen(pg, '#lightbtn'), 'Shift+Tab puts focus back on the sun with the menu still open');
    /* the entry's own panel leaves with its usual fade as focus leaves it,
       so at once and at 100 ms the panel is not on, and by 1.5 s it is gone */
    ok(!g0.on && !g1.on && gone(g2), 'and focus there shows no panel, at once, at 100 ms and at 1.5 s: ' + [g0, g1, g2].map(say).join('; '));
    await pg.keyboard.press('Tab'); await pg.waitForTimeout(300);
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(100);   /* the entry's panel first */
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(400);   /* then the menu, focus to the sun */
    const h = await TIP(pg);
    const st = await pg.evaluate(() => ({ id: document.activeElement && document.activeElement.id, exp: document.getElementById('lightbtn').getAttribute('aria-expanded') }));
    ok(st.id === 'lightbtn' && st.exp === 'false', 'Escape from an entry shuts the menu and puts focus on the sun: focus ' + st.id + ', expanded ' + st.exp);
    ok(shown(h) && /Lighting/.test(h.text), 'and the sun\'s panel is back on that focus: ' + say(h));
    const tt = await titleOf(pg);
    ok(tt.held === null && (tt.title === null) === shown(h), 'and its title is the panel\'s to restore, never on the element under its own panel: title ' + JSON.stringify(tt.title) + ', held ' + JSON.stringify(tt.held));
    ok(errs.length === 0, 'no page error or console error: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  /* ---------------------------------------------------------------- 4 */
  console.log('\n=== 4 · every way of closing gives the panel back ===');
  {
    const { cx, pg, errs } = await open(browser, 1600, 1000);
    const ways = [
      ['Escape', async () => { await pg.keyboard.press('Escape'); }],
      ['a press outside', async () => { const p = await outside(pg); await pg.mouse.click(p.x, p.y); }],
      ['choosing a lighting', async () => { const e = await pg.evaluate(() => { const b = [...document.querySelectorAll('#themes button')]
          .find(x => x.getAttribute('data-tip-t') === 'Snow') || document.querySelectorAll('#themes button')[1];
        const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
        await pg.mouse.click(e.x, e.y); }],
      ['pressing the sun again', async () => { const c = await centre(pg, '#lightbtn'); await pg.mouse.click(c.x, c.y); }],
    ];
    for (const [nm, shut] of ways) {
      const c = await centre(pg, '#lightbtn');
      await away(pg); await pg.mouse.click(c.x, c.y); await pg.waitForTimeout(300);
      const during = await TIP(pg);
      await shut(); await pg.waitForTimeout(400);
      const shutNow = !(await menuOpen(pg, '#lightbtn'));
      const after = await hoverOn(pg, '#lightbtn');
      const name = await pg.evaluate(() => document.getElementById('lightbtn').getAttribute('aria-label'));
      ok(!during.on && shutNow, nm + ': the menu was open with no panel, and ' + nm + ' shut it');
      ok(shown(after) && after.text.indexOf(name) >= 0, nm + ': then hover shows the sun\'s panel again, naming the lighting that is on, "' + name + '": ' + say(after));
      await away(pg);
      const tt = await titleOf(pg);
      ok(tt.title === name && tt.held === null, nm + ': and the native title is back as the current name: ' + JSON.stringify(tt.title));
    }
    await pg.evaluate(() => setLighting('dark'));
    ok(errs.length === 0, 'no page error or console error: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  /* ---------------------------------------------------------------- 5 */
  console.log('\n=== 5 · the held press on a phone ===');
  {
    const { cx, pg } = await open(browser, 390, 844);
    const w = await pg.evaluate(() => document.getElementById('lightbtn').getBoundingClientRect().width);
    ok(w === 0, 'at 390 the sun is not on the bar, it is in the main menu under 720 wide, so there is no sun to hold here: width ' + w);
    await cx.close();
  }
  {
    const { cx, pg, errs } = await open(browser, 844, 390, { hasTouch: true, isMobile: true });
    const sheet = await pg.evaluate(() => document.body.classList.contains('tip-sheet'));
    ok(sheet, '844 by 390 with a touch screen is the phone shape of the tooltip, the sheet');
    const cdp = await cx.newCDPSession(pg);
    const hold = async (sel, ms) => { const c = await centre(pg, sel);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: c.x, y: c.y }] });
      await pg.waitForTimeout(ms); const t = await TIP(pg);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await pg.waitForTimeout(400);
      return t; };
    const k = await hold('#lightbtn', 1900);
    ok(shown(k) && /Lighting/.test(k.text) && !(await menuOpen(pg, '#lightbtn')), 'held on the shut sun, it explains and does not open the menu, the known good case: ' + say(k));
    await pg.evaluate(() => { TIP.hide(); }); await pg.waitForTimeout(300);
    const c = await centre(pg, '#lightbtn'); await pg.touchscreen.tap(c.x, c.y); await pg.waitForTimeout(500);
    ok(await menuOpen(pg, '#lightbtn'), 'a tap opens the menu');
    const h = await hold('#lightbtn', 1900);
    ok(gone(h), 'held for 1.9 s with the menu open, past the hold of 1.5 s, the sun shows no panel: ' + say(h));
    ok(gone(await TIP(pg)), 'and lifting the finger puts none up: ' + say(await TIP(pg)));
    if (await menuOpen(pg, '#lightbtn')) await pg.evaluate(() => document.getElementById('lightbtn').click());
    await pg.waitForTimeout(300);
    const back = await hold('#lightbtn', 1900);
    ok(shown(back) && /Lighting/.test(back.text), 'with the menu shut again the hold explains again: ' + say(back));
    ok(errs.length === 0, 'no page error or console error: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  /* ---------------------------------------------------------------- 6, 7 */
  console.log('\n=== 6 · every other control that opens a popup and carries a panel ===');
  {
    const { cx, pg, errs } = await open(browser, 1600, 1000);
    /* the same two ways ui/tip.js reads a popup off a control, read here off
       the live page, so a control added later is held the day it lands */
    /* the profile button is named as well: it says aria-expanded and
       aria-haspopup only from its first opening (profMenu, ui/account.js) */
    const FIND = () => [...document.querySelectorAll('[aria-expanded],#profbtn')].filter(k => {
      const r = k.getBoundingClientRect(); if (!r.width || !r.height) return false;
      const carries = k.matches('[data-tip],[data-tip-t],[title]') || k.id === 'profbtn';
      const hp = k.getAttribute('aria-haspopup'), id = k.getAttribute('aria-controls'), m = id && document.getElementById(id);
      const floats = m && !m.contains(k) && /^(fixed|absolute)$/.test(getComputedStyle(m).position);
      return carries && ((hp && hp !== 'false') || floats || k.id === 'profbtn');
    }).map(k => { if (!k.id) k.id = 'mt-' + (k.getAttribute('data-fb') || Math.random().toString(36).slice(2, 7)); return '#' + k.id; });
    const seen = new Set();
    /* the Field's Layers circle exists only when the bar's full row does not
       fit and folds, which measured at 660 and not at 700 or wider, so the
       Field is visited again at 660, still above the 600 where the tooltip
       turns into the sheet */
    for (const [tab, W] of [['STORY', 1600], ['FIELD', 1600], ['FIELD', 660]]) {
      await pg.setViewportSize({ width: W, height: 1000 });
      await pg.evaluate(t => setTab(TAB[t]), tab); await pg.waitForTimeout(900);
      /* the Field's bar can start folded, and folded its circles are not on
         screen to be found, so it is opened by its own fold first */
      await pg.evaluate(() => { const t = document.querySelector('.fb-tog'); if (t && t.getAttribute('aria-expanded') === 'false') t.click(); });
      await pg.waitForTimeout(500);
      const sels = await pg.evaluate(FIND);
      for (const sel of sels) {
        if (sel === '#lightbtn' || seen.has(sel)) continue; seen.add(sel);
        const nm = await pg.evaluate(s => { const e = document.querySelector(s); return (e.getAttribute('aria-label') || e.getAttribute('title') || s); }, sel);
        const b = await hoverOn(pg, sel);
        ok(shown(b), nm + ' (' + sel + ', on ' + tab + ' at ' + W + '): with its popup shut, hover shows its panel, ' + say(b));
        if (!(await pressAndRest(pg, sel, nm + ' (' + sel + ')'))) continue;
        await pg.keyboard.press('Escape'); await pg.waitForTimeout(200);
        if (await menuOpen(pg, sel)) { const c = await centre(pg, sel); await pg.mouse.click(c.x, c.y); await pg.waitForTimeout(300); }
        const a = await hoverOn(pg, sel);
        ok(!(await menuOpen(pg, sel)) && shown(a), nm + ': shut again, hover shows its panel again, ' + say(a));
      }
    }
    const want = ['#profbtn', '#mt-depth', '#mt-fold'];
    ok(want.every(s => seen.has(s)), 'the three found by name besides the sun, the profile button, the Field\'s Depth and its Layers, are among the ' + seen.size + ' held: ' + [...seen].join(', '));

    console.log('\n=== 7 · an open disclosure keeps its panel ===');
    await pg.setViewportSize({ width: 1600, height: 1000 }); await pg.waitForTimeout(600);
    const tog = await pg.evaluate(() => { const t = document.querySelector('.fb-tog'); if (!t) return null; t.id = t.id || 'mt-tog';
      return { exp: t.getAttribute('aria-expanded'), ctl: t.getAttribute('aria-controls') }; });
    ok(tog && tog.exp === 'true' && tog.ctl === 'fbar', 'the Field bar\'s fold is expanded and controls the bar it sits in: ' + JSON.stringify(tog));
    const tt = tog ? await hoverOn(pg, '#mt-tog') : { on: false, vis: 'hidden', text: '' };
    ok(shown(tt), 'and hovering it still shows its panel, so an open disclosure is not treated as a menu: ' + say(tt));
    ok(errs.length === 0, 'no page error or console error: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  await browser.close();
  console.log('\n===== ' + PASS + ' passed, ' + FAIL + ' failed =====');
  process.exit(FAIL ? 1 : 0);
})();
