#!/usr/bin/env node
/* ============================================================
   THE FAVICON, WRITTEN INTO THE FOUR HEADS.

   Ruled: "for the favicon, let's do like the old ring. Seven colours in a
   band." There was no favicon in this product at all, on any funnel page or
   in the dist build, which is a blank sheet of paper in the tab on every
   screen a stranger opens. That is the cheapest thing on this list to read as
   placeholder and it was the last one left.

   The drawing is ring.js, at every band full, which is the mark. Nothing here
   redraws it. The seven hexes are read out of tokens.css, which is itself
   generated from the app's own stylesheet, so the tab and the product cannot
   drift apart. A browser renders a favicon outside the document and gives it
   no custom properties, so this is the one place the hexes are written out,
   and they are written by a tool rather than by hand.

       node funnel/make-ring.js

   It rewrites the link in place and prints what changed. Run it after any
   change to tokens.css or to ring.js.
   ============================================================ */
const fs = require('fs'), path = require('path');
const here = __dirname;
const RING = require(path.join(here, 'ring.js'));

/* the seven, off the generated tokens. A missing one is refused by name
   rather than filled with a grey, because a grey seat is a lie about a seat. */
const css = fs.readFileSync(path.join(here, 'tokens.css'), 'utf8');
const cols = RING.SEATS.map(function (s) {
  const m = css.match(new RegExp('\\' + s[1] + '\\s*:\\s*(#[0-9A-Fa-f]{3,8})'));
  if (!m) { console.error('tokens.css carries no ' + s[1]); process.exit(1); }
  return m[1];
});

/* every band at ten, so no track is drawn: at full load the track and the
   band are the same shape and carrying both would double the bytes in every
   head for nothing. */
const body = RING.svg({ loads: [10,10,10,10,10,10,10], frame:false, track:false, flat:cols });
/* fill:none belongs on the svg element rather than on every path, and the
   caps are butt so the arcs meet without a lens of overlap at the seam. */
const mark = body
  .replace('<svg class="ring"', '<svg fill="none" stroke-linecap="butt"')
  .replace(/ class="ring-[bt]"| data-seat="\d"/g, '');

const uri = 'data:image/svg+xml,' + encodeURIComponent(mark)
  .replace(/'/g, '%27').replace(/"/g, '%22');
const link = '<link rel="icon" href="' + uri + '">';

const PAGES = ['index.html', 'quiz.html', 'about.html', 'buy.html'];
let changed = 0;
PAGES.forEach(function (p) {
  const f = path.join(here, p);
  let h = fs.readFileSync(f, 'utf8');
  const before = h;
  if (/<link rel="icon"[^>]*>/.test(h)) h = h.replace(/<link rel="icon"[^>]*>/, link);
  else h = h.replace('<link rel="stylesheet" href="tokens.css">',
    link + '\n<link rel="stylesheet" href="tokens.css">');
  if (h === before) { console.log('  ' + p + ' unchanged'); return; }
  fs.writeFileSync(f, h, 'utf8');
  changed++;
  console.log('  ' + p + ' written');
});
console.log('  ' + cols.join(' ') + ', ' + uri.length + ' characters, ' + changed + ' pages');
