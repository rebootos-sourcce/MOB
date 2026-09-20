#!/usr/bin/env node
/* Inlines engine.js, rise.js and sheet.js into one file with no siblings, so
   the page runs from wherever it lands and cannot reach for anything.

   The three sources are READ, never copied into this folder. Two prototypes in
   this repository carried a byte identical engine and both were fixed for the
   same reason: a copy goes stale in silence and the prototype then measures a
   build nobody ships. rise.js is read out of proto/avatar/ for that reason too,
   because the sheet and the dashboard have to agree about a seat.

   Same gates as proto/avatar/build-dash.js, plus one this file adds: the count
   stated to a person is 112 and the lower figure the codex counts may not
   appear in the page. */
var fs=require('fs'), path=require('path'), d=__dirname;
var src=fs.readFileSync(path.join(d,'sheet.src.html'),'utf8');
var eng=fs.readFileSync(path.join(d,'..','..','engine.js'),'utf8');
var rise=fs.readFileSync(path.join(d,'..','avatar','rise.js'),'utf8');
var own=fs.readFileSync(path.join(d,'sheet.js'),'utf8');
var out=src
 .replace('<script src="../../engine.js"></script>','<script>\n'+eng+'\n</script>')
 .replace('<script src="../avatar/rise.js"></script>','<script>\n'+rise+'\n</script>')
 .replace('<script src="sheet.js"></script>','<script>\n'+own+'\n</script>');
if(/src="(\.\.\/)*[^"]+\.js"/.test(out))
 throw new Error('a script tag survived the inline and the page would have a sibling');
if(/<(script|link|img)[^>]+(src|href)=["']?(?!#)(https?:|\/\/)/i.test(out))
 throw new Error('an outbound reference survived');
if(out.indexOf('—')>=0)throw new Error('an em dash is in the page');
/* the count. engine.js legitimately carries the lower figure in its own
   arithmetic, so this reads the page's own markup and scripts rather than the
   inlined engine. */
var mine=src+own;
if(/\b108\b/.test(mine))throw new Error('the count stated to a person is 112');
fs.writeFileSync(path.join(d,'sheet.html'),out);
console.log('proto/sheet/sheet.html  '+(out.length/1024).toFixed(0)+' KB, no siblings');
