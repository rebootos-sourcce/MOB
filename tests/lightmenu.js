#!/usr/bin/env node
/* ============================================================
   THE BAR'S MENUS ARE ON TOP OF EVERYTHING THEY OPEN OVER. 18 November.

   env CHROME=/opt/pw-browsers/chromium NODE_PATH=$(npm root -g) node tests/lightmenu.js
   LIGHTMENU_HTML=file   runs against another build, for checking the checker

   The owner: "Fix lighting menu hidden behind the Dashboard panels". It was
   one lighting's doing. Glass white gives every .glass a backdrop-filter, the
   bar is class="glass top", and a backdrop-filter makes the bar its own
   stacking context, so the menu's z-index 60 ranked it inside the bar and
   nowhere else. #stage and #rpanel come later in the document and tie the
   bar at auto, so they painted over every option on every tab but the Field
   (whose own rule strips the filter). In Glass the same menu sat in the bar's
   flow instead and pushed the page down while it was open. The fix is at
   .top in shell/head.html.

   So, for every lighting the picker lists (read off LIGHTINGS at run time,
   never typed here, so a lighting added later is held the day it lands), on
   every surface TABDEF and TABEXTRA name (read the same way tools/monitor.js
   reads them, with Discover's journal page and its Dashboard as two states),
   this opens the bar's menu with a real press and holds:

     at 1600, the lighting menu lists one button per lighting, and the centre
     of every one is the topmost thing there (elementFromPoint), and opening
     it leaves the bar's own height where it was;
     at 390, where the sun menu leaves the bar for the main menu, the same of
     the main menu's lighting row, and of the profile loader's list, which is
     the bar's other menu and was covered the same way.

   A loaded profile is measured too at 1600, because the Dashboard's panels
   are fuller there. Which reference case does not matter to the defect, so it
   is the first one, and that is the only reason it is index 1.

   The hover tip is hidden while measuring. It is root level and above the
   menu by design, and the button's own tip sitting over the top right of the
   open row is a separate, transient finding filed on its own; counting it here
   would make this gate fail on the pointer and not on the layer.

   THE PROBE IS CHECKED BEFORE IT IS BELIEVED, the standing rule: a fixed layer
   is laid over the open menu and the probe must call every option covered,
   and it is removed again before any real cell is read.

   CHECKED AGAINST A KNOWN BAD BUILD FIRST: the live build of c2bf52a2 and a
   copy of this build with the bar's rule taken out both fail it, by name, on
   Glass white (covered) and on Glass (the bar grows).

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const seed = require('./seed.js');
const ROOT = path.resolve(__dirname, '..');
const SRC = process.env.LIGHTMENU_HTML ? path.resolve(process.env.LIGHTMENU_HTML) : path.join(ROOT, 'source.html');
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) PASS++; else { FAIL++; console.log('  FAIL  ' + m); } };
const booted = pg => pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 });

const TABS_JS = `(function(){var a=TABDEF.map(function(t){return [t.nm,t.k];});
 Object.keys(TABEXTRA).forEach(function(k){var t=TABEXTRA[k]; a.push([t.nm,t.k]);});
 return a;})()`;

/* Every option in the list is probed at its centre. A row an internally
   scrolling list has scrolled out of its own box is not covered, it is
   scrolled, so it is skipped and counted apart; the loader's list scrolls. */
const PROBE = `(function(optSel,menuSel){
 function desc(el){if(!el)return 'nothing';var s=el.tagName.toLowerCase();if(el.id)s+='#'+el.id;
  var c=el.className;if(c&&c.baseVal!==undefined)c=c.baseVal;
  if(typeof c==='string'&&c.trim())s+='.'+c.trim().split(/\\s+/).slice(0,2).join('.');return s;}
 var menu=document.querySelector(menuSel), mr=menu?menu.getBoundingClientRect():null;
 var scrolls=menu&&menu.scrollHeight>menu.clientHeight+2;
 var out={n:0,scrolled:0,rows:[]};
 [].forEach.call(document.querySelectorAll(optSel),function(o){
  var r=o.getBoundingClientRect(), nm=(o.getAttribute('aria-label')||o.title||o.textContent||'').trim().slice(0,24);
  if(scrolls&&(r.top<mr.top-1||r.bottom>mr.bottom+1)){out.scrolled++;return;}
  out.n++;
  var x=r.left+r.width/2, y=r.top+r.height/2, h=document.elementFromPoint(x,y);
  out.rows.push({nm:nm,ok:!!(r.width&&r.height&&h&&(h===o||o.contains(h))),by:desc(h),at:[Math.round(x),Math.round(y)]});});
 return out;})`;

const SPEC = {
  light: { btn: '#lightbtn', menu: '#lightmenu', opts: '#themes button', name: 'the lighting menu', list: true, bar: true },
  nav: { btn: '#navtog', menu: '#navlight', opts: '#navthemes button', name: "the main menu's lighting row", list: true, bar: false },
  pload: { btn: '#ploadbtn', menu: '#pload', opts: '#pload button', name: "the profile loader's list", list: false, bar: true },
};

async function shut(pg) {
  await pg.keyboard.press('Escape').catch(() => {});
  await pg.evaluate(() => {
    ['lightmenu', 'pload'].forEach(id => { const m = document.getElementById(id); if (m && !m.hidden) m.hidden = true; });
    const t = document.querySelector('.top'); if (t) t.classList.remove('navopen');
  });
}

async function cell(pg, W, spec, where, nLights) {
  const s = SPEC[spec];
  const barShut = await pg.evaluate(() => document.querySelector('.top').getBoundingClientRect().height);
  await pg.click(s.btn, { timeout: 4000 });
  await pg.mouse.move(6, W.h - 6); await pg.waitForTimeout(150);
  const barOpen = await pg.evaluate(() => document.querySelector('.top').getBoundingClientRect().height);
  const r = await pg.evaluate(a => eval(a[0])(a[1], a[2]), [PROBE, s.opts, s.menu]);
  if (s.list) ok(r.n + r.scrolled === nLights, where + ', ' + s.name + ' lists one button per lighting, ' + (r.n + r.scrolled) + ' for ' + nLights);
  else ok(r.n > 0, where + ', ' + s.name + ' opened with rows to press, ' + r.n);
  r.rows.forEach(o => ok(o.ok, where + ', ' + s.name + ': "' + o.nm + '" is under ' + o.by + ' at ' + o.at.join(',')));
  if (s.bar) ok(Math.abs(barOpen - barShut) < 1, where + ', opening ' + s.name + ' leaves the bar ' + Math.round(barShut) + 'px high, got ' + Math.round(barOpen));
  await shut(pg);
  return r.rows.filter(o => !o.ok).length;
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  console.log('build ' + SRC);
  const PLAN = [{ w: 1600, h: 1000, profs: ['blank', 'loaded'], specs: ['light'] },
                { w: 390, h: 844, profs: ['blank'], specs: ['nav', 'pload'] }];
  for (const W of PLAN) {
    const phone = W.w <= 720;
    const cx = await browser.newContext({ viewport: { width: W.w, height: W.h }, isMobile: phone, hasTouch: phone });
    const pg = await cx.newPage(); const errs = [];
    pg.on('pageerror', e => errs.push(e.message));
    await pg.addInitScript(seed.FULL_SIGHT); await pg.addInitScript(seed.LCOL_SEED);
    await pg.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' }); await booted(pg);
    await pg.waitForTimeout(1500);
    await pg.addStyleTag({ content: '#tip{display:none!important}' });
    const lights = await pg.evaluate(() => LIGHTINGS.map(t => t[0]));
    const story = await pg.evaluate(() => TAB.STORY);
    const tabs = await pg.evaluate(TABS_JS);
    const states = [];
    tabs.forEach(([nm, k]) => {
      if (k === story) { states.push({ nm: nm + ' journal', k, dash: false }); states.push({ nm: nm + ' Dashboard', k, dash: true }); }
      else states.push({ nm, k, dash: null });
    });
    console.log('\n=== ' + W.w + 'x' + W.h + ': ' + lights.length + ' lightings, ' + states.length + ' surfaces ===');

    /* the probe against a known covered menu, before any real cell */
    {
      await pg.evaluate(k => { setLighting('dark'); setTab(k); }, story); await pg.waitForTimeout(200);
      const s = SPEC[W.specs[0]];
      await pg.click(s.btn, { timeout: 4000 }); await pg.waitForTimeout(150);
      await pg.evaluate(() => { const d = document.createElement('div'); d.id = '__cover';
        d.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:transparent'; document.body.appendChild(d); });
      const r = await pg.evaluate(a => eval(a[0])(a[1], a[2]), [PROBE, s.opts, s.menu]);
      ok(r.n > 0 && r.rows.every(o => !o.ok && o.by === 'div#__cover'), 'the probe calls every option covered under a layer laid over it, ' + r.rows.filter(o => o.by === 'div#__cover').length + ' of ' + r.n);
      await pg.evaluate(() => document.getElementById('__cover').remove());
      await shut(pg);
    }

    for (const prof of W.profs) {
      if (prof === 'loaded') { await pg.evaluate(() => loadP(1)); await pg.waitForTimeout(400); }
      for (const light of lights) {
        await pg.evaluate(k => setLighting(k), light); await pg.waitForTimeout(120);
        let bad = 0;
        for (const st of states) {
          await pg.evaluate(k => setTab(k), st.k); await pg.waitForTimeout(150);
          if (st.dash !== null) { await pg.evaluate(d => { STV.dash = d; stRender(); }, st.dash); await pg.waitForTimeout(200); }
          for (const spec of W.specs) bad += await cell(pg, W, spec, W.w + ' ' + prof + ' ' + light + ' ' + st.nm, lights.length);
        }
        console.log('  ' + prof + ' ' + light + ': ' + (bad ? bad + ' options covered' : 'every option on top') + ' across ' + states.length + ' surfaces');
      }
    }
    ok(errs.length === 0, W.w + ', no page error' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
    await cx.close();
  }
  await browser.close();
  console.log('\n===== ' + PASS + ' passed, ' + FAIL + ' failed =====');
  process.exit(FAIL ? 1 : 0);
})().catch(e => { console.log('  FAIL  the gate threw: ' + (e && e.stack || e)); console.log('\n===== ' + PASS + ' passed, ' + (FAIL + 1) + ' failed ====='); process.exit(1); });
