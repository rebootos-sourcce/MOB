#!/usr/bin/env node
/* ============================================================
   NODE_PATH=/opt/node22/lib/node_modules node proto/avatar/iam/shots.js

   Shoots the comp and measures it in the same run, because reading CSS is
   not reviewing a screen. Exits non zero on any hard failure.

     outbound requests   anything that is not the file itself or a data: URI
     page errors         any thrown error or console error
     overflow            the page scrolling sideways at either width
     tap targets         any button under 44 by 44
     all caps            any visible text set in capitals, by transform or typed
     contrast            every text element against its OWN ground: the first
                         opaque background up its ancestors, with translucent
                         layers composited, never against the page
     collisions          two seat rows, a row and a flank, a flank and the foot
     alignment           each row's centre against its ring's centre, in pixels
     marks               in question 6, the seat name under every mark, with
                         the mark known by its own path and never by position
   ============================================================ */
'use strict';
var path = require('path'), fs = require('fs');
var { chromium } = require('playwright');
var HERE = __dirname, OUT = path.join(HERE, 'shots');
fs.mkdirSync(OUT, { recursive: true });
var URL0 = 'file://' + path.join(HERE, 'iam.html');

var RUNS = [
  ['marcus-dark', 1600, 1000, 'view'], ['marcus6-dark', 1600, 1000, 'view'], ['gordon-dark', 1600, 1000, 'view'],
  ['first-dark', 1600, 1000, 'view'], ['marcus-snow', 1600, 1000, 'view'], ['marcus-punch', 1600, 1000, 'view'],
  ['marcus-glass', 1600, 1000, 'view'],
  ['marcus-dark', 390, 844, 'surface'], ['first-dark', 390, 844, 'surface'], ['marcus-snow', 390, 844, 'surface'],
  ['marcus-dark', 1600, 1000, 'doc'], ['marcus-dark', 390, 844, 'doc']
];

function measure() {
  /* color-mix resolves to color(srgb r g b / a), not rgb(), and the first cut
     of this reader skipped it and measured Punch against the wrong ground. */
  function rgba(s) { var m = s.match(/rgba?\(([^)]+)\)/);
    if (m) { var p = m[1].split(',').map(function (x) { return parseFloat(x); }); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
    var c = s.match(/color\(srgb\s+([\d.e-]+)\s+([\d.e-]+)\s+([\d.e-]+)(?:\s*\/\s*([\d.e-]+))?\)/);
    if (c) return [c[1] * 255, c[2] * 255, c[3] * 255, c[4] != null ? +c[4] : 1];
    return null; }
  function over(top, bot) { var a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; }
  function lum(c) { var f = function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
    return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); }
  function ground(el) {
    var stack = [], e = el;
    while (e && e.nodeType === 1) { var b = rgba(getComputedStyle(e).backgroundColor); if (b && b[3] > 0) stack.push(b); if (b && b[3] >= 1) break; e = e.parentElement; }
    var base = rgba(getComputedStyle(document.documentElement).backgroundColor) || [0, 0, 0, 1];
    if (base[3] < 1) base = [12, 13, 18, 1];
    var g = base; for (var i = stack.length - 1; i >= 0; i--) g = over(stack[i], g); return g; }
  var out = { errors: [], contrast: [], taps: [], caps: [], collisions: [], align: [], overflow: 0, marks: null, marksOff: [] };
  out.overflow = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
  /* contrast: every element that owns visible text of its own */
  var seen = {};
  document.querySelectorAll('body *').forEach(function (el) {
    if (el.closest('svg')) return;
    var own = Array.prototype.some.call(el.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim().length > 1; });
    if (!own) return;
    var cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) return;
    var r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
    if (el.closest('.vh')) return;
    var fg = rgba(cs.color), bg = ground(el); if (!fg) return;
    var op = 1, e2 = el; while (e2) { op *= parseFloat(getComputedStyle(e2).opacity || 1); e2 = e2.parentElement; }
    fg = over([fg[0], fg[1], fg[2], fg[3] * op], bg);
    var L1 = lum(fg), L2 = lum(bg), ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
    var size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 600;
    var need = (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5;
    var key = (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : el.tagName.toLowerCase()) + ' ' + size + 'px';
    if (!seen[key] || seen[key].ratio > ratio) seen[key] = { key: key, ratio: +ratio.toFixed(2), need: need, text: el.textContent.trim().slice(0, 40) };
    if (/[A-Z]{3,}/.test(el.textContent) && el.textContent.trim() === el.textContent.trim().toUpperCase() && /[A-Z]/.test(el.textContent)) {
      var t = el.textContent.trim(); if (t.length > 3 && !/^[A-Z0-9 .,:%-]{1,4}$/.test(t)) out.caps.push(t.slice(0, 40)); }
    if (cs.textTransform === 'uppercase') out.caps.push('transform: ' + el.textContent.trim().slice(0, 40));
  });
  out.contrast = Object.keys(seen).map(function (k) { return seen[k]; }).sort(function (a, b) { return a.ratio - b.ratio; });
  /* THE EMPTY BOX IS A GRAPHIC THE READING DEPENDS ON: every slot drawn before
     anything is read is the ceiling. Non text contrast, 3 to 1, measured as the
     outline composited over the ground it actually sits on, the spine's. */
  var probe = document.createElement('div'); probe.style.cssText = 'position:absolute;width:1px;height:1px;background:var(--box)';
  var host = document.querySelector('.spine') || document.body; host.appendChild(probe);
  var bx = rgba(getComputedStyle(probe).backgroundColor); host.removeChild(probe);
  var gnd = ground(host);
  if (bx) { var cmp = over(bx, gnd), l1 = lum(cmp), l2 = lum(gnd);
    out.boxRatio = +((Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05)).toFixed(2); }
  document.querySelectorAll('button').forEach(function (b) { var r = b.getBoundingClientRect();
    if (r.width && (r.width < 44 || r.height < 44)) out.taps.push((b.textContent.trim() || b.className).slice(0, 30) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); });
  /* collisions, on the wide layout where rows are pinned */
  var rows = Array.prototype.slice.call(document.querySelectorAll('.spine .row'));
  var box = function (e) { return e.getBoundingClientRect(); };
  var hit = function (a, b) { return a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1; };
  var pinned = rows.length && getComputedStyle(rows[0]).position === 'absolute';
  if (pinned) {
    for (var i = 0; i < rows.length; i++) for (var j = i + 1; j < rows.length; j++) {
      var A = rows[i].querySelectorAll('.verb,.boxes,.pct'), B = rows[j].querySelectorAll('.verb,.boxes,.pct');
      A.forEach(function (a) { B.forEach(function (b) { if (hit(box(a), box(b))) out.collisions.push('row ' + i + ' with row ' + j); }); }); }
    document.querySelectorAll('.spine .flank').forEach(function (f) {
      rows.forEach(function (r, i) { r.querySelectorAll('.verb,.boxes,.pct').forEach(function (a) { if (hit(box(a), box(f))) out.collisions.push('flank with row ' + i); }); });
      var foot = document.querySelector('.foothead'); if (foot && box(f).bottom > box(foot).top + 1) out.collisions.push('flank runs into the foot by ' + Math.round(box(f).bottom - box(foot).top) + 'px'); });
    rows.forEach(function (r) { r.querySelectorAll('.verb,.boxes').forEach(function (a) {
      r.querySelectorAll('.boxes,.pct').forEach(function (b) { if (a !== b && hit(box(a), box(b))) out.collisions.push('inside a row: ' + (r.getAttribute('title') || '').slice(0, 24)); }); }); });
    /* alignment: the row's centre against its ring. rings are the seat groups
       in the main figure, crown first on the page. */
    var rings = Array.prototype.slice.call(document.querySelectorAll('.fig svg .seat')).reverse();
    rows.forEach(function (r, i) { if (!rings[i]) return;
      var rr = rings[i].getBoundingClientRect(), bx = r.querySelector('.r .boxes') || r;
      var cr = (rr.top + rr.bottom) / 2, cb = (bx.getBoundingClientRect().top + bx.getBoundingClientRect().bottom) / 2;
      out.align.push(+(cb - cr).toFixed(1)); });
  }
  /* THE MARKS GRID PAIRS A MARK WITH ITS NAME BY COLUMN AND BY NOTHING ELSE.
     The names are a row of their own under three rows of marks, so one cell
     too many ahead of them moves every name and no mark. Under 1440 the corner
     spacer did exactly that: Third eye sat under the throat's clock, Throat
     under a heart, Heart under the starburst, and the owner read it as the
     marks being off by one. This file shot it at 390 and printed clean, because
     nothing here asked which name sat under which mark. So a mark is known by
     its own path in the page's GL table, and paired with the nearest name. */
  var grid = document.querySelector('#q6 .marks');
  if (grid) {
    var seatOf = {}; Object.keys(GL).forEach(function (set) { Object.keys(GL[set]).forEach(function (b) { seatOf[GL[set][b]] = b; }); });
    var names = Array.prototype.map.call(grid.querySelectorAll('.x'), function (e) {
      var r = e.getBoundingClientRect(), t = e.textContent.trim();
      return { b: Object.keys(SEATNM).filter(function (k) { return SEATNM[k] === t; })[0], cx: (r.left + r.right) / 2 }; });
    out.marks = 0;
    grid.querySelectorAll('svg').forEach(function (s) {
      var r = s.getBoundingClientRect(), cx = (r.left + r.right) / 2, b = seatOf[s.querySelector('path').getAttribute('d')];
      var near = names.slice().sort(function (p, q) { return Math.abs(p.cx - cx) - Math.abs(q.cx - cx); })[0];
      if (near && near.b === b) out.marks++; else out.marksOff.push(SEATNM[b] + ' mark under ' + (near ? SEATNM[near.b] : 'no name')); });
  }
  return out;
}

(async function () {
  var browser = await chromium.launch();
  var hard = 0, report = [];
  for (var k = 0; k < RUNS.length; k++) {
    var R = RUNS[k], ctx = await browser.newContext({ viewport: { width: R[1], height: R[2] }, deviceScaleFactor: 1 });
    var page = await ctx.newPage(), reqs = [], errs = [];
    page.on('request', function (q) { var u = q.url(); if (!/^file:|^data:/.test(u)) reqs.push(u); });
    page.on('pageerror', function (e) { errs.push(String(e)); });
    page.on('console', function (m) { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(URL0 + '#' + R[0]);
    await page.evaluate(function () { return document.fonts.ready; });
    await page.waitForTimeout(250);
    var nm = R[0] + '-' + R[1] + '-' + R[3] + '.png';
    if (R[3] === 'view') await page.screenshot({ path: path.join(OUT, nm) });
    if (R[3] === 'surface') { var el = await page.$('.surface'); await el.screenshot({ path: path.join(OUT, nm) }); }
    if (R[3] === 'doc') { await page.screenshot({ path: path.join(OUT, nm), fullPage: true }); }
    var m = await page.evaluate(measure);
    var fam = await page.evaluate(function () { var s = []; document.fonts.forEach(function (f) { if (f.status === 'loaded') s.push(f.family); }); return s; });
    var fails = [];
    if (reqs.length) fails.push('outbound ' + reqs.length + ': ' + reqs.slice(0, 2).join(' '));
    if (errs.length) fails.push('errors: ' + errs.slice(0, 2).join(' | '));
    if (m.overflow) fails.push('scrolls sideways by ' + m.overflow + 'px');
    if (m.taps.length) fails.push('under 44: ' + m.taps.slice(0, 4).join(', '));
    if (m.caps.length) fails.push('caps: ' + m.caps.slice(0, 3).join(' | '));
    if (m.collisions.length) fails.push('collisions: ' + m.collisions.slice(0, 4).join(', '));
    if (m.marksOff.length) fails.push('marks under the wrong name, ' + m.marksOff.length + ': ' + m.marksOff.slice(0, 3).join(', '));
    var low = m.contrast.filter(function (c) { return c.ratio < c.need; });
    if (m.boxRatio != null && m.boxRatio < 3) fails.push('empty box outline ' + m.boxRatio + ' to 1, under 3');
    if (low.length) fails.push('contrast under floor: ' + low.slice(0, 4).map(function (c) { return c.key + ' ' + c.ratio + ' "' + c.text + '"'; }).join('; '));
    hard += fails.length;
    report.push(nm + '\n    fonts ' + JSON.stringify(fam) + '  lowest contrast ' + (m.contrast[0] ? m.contrast[0].ratio + ' at ' + m.contrast[0].key : '-') +
      ('  empty box ' + m.boxRatio) + (m.align.length ? '  row to ring ' + JSON.stringify(m.align) : '') +
      (m.marks != null ? '  marks ' + m.marks + ' of ' + (m.marks + m.marksOff.length) + ' over their own name' : '') + (fails.length ? '\n    FAIL ' + fails.join('\n    FAIL ') : '\n    clean'));
    await ctx.close();
  }
  await browser.close();
  console.log(report.join('\n'));
  console.log('\n' + (hard ? hard + ' hard failures' : 'no hard failures') + ', shots in ' + OUT);
  process.exit(hard ? 1 : 0);
})();
