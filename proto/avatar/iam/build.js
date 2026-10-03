#!/usr/bin/env node
/* ============================================================
   node proto/avatar/iam/build.js  ->  proto/avatar/iam/iam.html

   One file, nothing beside it, no request. Three things are inlined and
   none of them is copied into the source:

     data.json      written by gen.js out of engine.js
     the typeface   the product's own @font-face, read out of
                    atuned_src/shell/head.html, so the comp sets in the
                    face the product carries and not a fallback
     crops/*.jpg    the pieces of field note 11, written by crops.py

   Run gen.js and crops.py first. This file refuses to build from a stale
   or missing input rather than shipping a page with a hole in it.
   ============================================================ */
'use strict';
var fs = require('fs'), path = require('path');
var HERE = __dirname, ROOT = path.resolve(HERE, '../../..');
function need(p) { if (!fs.existsSync(p)) { console.error('missing ' + p); process.exit(1); } return p; }

var src = fs.readFileSync(need(path.join(HERE, 'iam.src.html')), 'utf8');
var data = fs.readFileSync(need(path.join(HERE, 'data.json')), 'utf8');
JSON.parse(data);                                   /* refuse a broken table */

var head = fs.readFileSync(need(path.join(ROOT, 'atuned_src/shell/head.html')), 'utf8');
var font = head.match(/@font-face\{[^}]*\}/);
if (!font) { console.error('no @font-face in head.html'); process.exit(1); }

var dir = need(path.join(HERE, 'crops')), crops = {};
fs.readdirSync(dir).filter(function (f) { return /\.jpg$/.test(f); }).sort().forEach(function (f) {
  crops[f.replace(/\.jpg$/, '')] = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, f)).toString('base64');
});
if (Object.keys(crops).length < 16) { console.error('expected 16 crops, found ' + Object.keys(crops).length); process.exit(1); }

var slots = ['/*@@FONT@@*/', '/*@@DATA@@*/null', '/*@@CROPS@@*/{}'];
slots.forEach(function (k) { if (src.split(k).length !== 2) { console.error('slot ' + k + ' is not present exactly once'); process.exit(1); } });
var out = src.replace('/*@@FONT@@*/', function () { return font[0]; })
             .replace('/*@@DATA@@*/null', function () { return data; })
             .replace('/*@@CROPS@@*/{}', function () { return JSON.stringify(crops); });
if (/—/.test(out)) { console.error('an em dash reached the page'); process.exit(1); }
fs.writeFileSync(path.join(HERE, 'iam.html'), out);
console.log('iam.html ' + Math.round(out.length / 1024) + ' KB: page ' + Math.round(src.length / 1024) +
  ', data ' + Math.round(data.length / 1024) + ', typeface ' + Math.round(font[0].length / 1024) +
  ', crops ' + Math.round(JSON.stringify(crops).length / 1024));
