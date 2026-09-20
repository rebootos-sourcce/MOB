#!/usr/bin/env node
/* Inlines engine.js and rise.js into one file with no siblings, so the page
   runs from wherever it lands and cannot reach for anything. */
var fs=require('fs'), path=require('path'), d=__dirname;
var src=fs.readFileSync(path.join(d,'dash.src.html'),'utf8');
var eng=fs.readFileSync(path.join(d,'..','..','engine.js'),'utf8');
var rise=fs.readFileSync(path.join(d,'rise.js'),'utf8');
var out=src
 .replace('<script src="engine.js"></script>','<script>\n'+eng+'\n</script>')
 .replace('<script src="rise.js"></script>','<script>\n'+rise+'\n</script>');
if(out.indexOf('src="engine.js"')>=0||out.indexOf('src="rise.js"')>=0)
 throw new Error('a script tag survived the inline and the page would have a sibling');
if(/<(script|link|img)[^>]+(src|href)=["\']?(?!#)(https?:|\/\/)/i.test(out))
 throw new Error('an outbound reference survived');
if(out.indexOf('—')>=0)throw new Error('an em dash is in the page');
fs.writeFileSync(path.join(d,'dash.html'),out);
console.log('proto/avatar/dash.html  '+(out.length/1024).toFixed(0)+' KB, no siblings');
