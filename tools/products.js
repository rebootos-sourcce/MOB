#!/usr/bin/env node
/* ============================================================
   PRODUCTS. A committed build product that its source would not build.

   source.html, engine.js and atuned-packed.html are build products that are
   committed, because the owner is handed them as files and the raw address of
   atuned-packed.html is his ruled second route (DECISIONS.md: "Every file
   handed to him is packed"). On 16 October the committed packed file inflated
   to a build stamped v2028 018bb70 while source.html was v2046 e9ca1ae, so
   the file he would save lacked AUTH_API_LIVE and a copy opened from disk
   could start a first visit. CLAUDE.md had recorded the same drift on 27
   September as a sentence. This is the check that sentence never was.

   Run in gates-fast after the build, which rewrites all three in the
   working tree. The committed copies are read from git (HEAD), so the build
   overwriting the checkout does not matter.

     engine.js           byte for byte against the fresh BUILD-engine.sh output.
     source.html         byte for byte against the fresh BUILD.sh output, after
                         one normalisation, below.
     atuned-packed.html  its payload must be whole (the length it states), must
                         inflate, and must carry the SAME stamp as the committed
                         source.html, so the two came out of one build run. Its
                         outer page must be exactly what tools/pack.js wraps
                         around that payload today, gzip bytes aside.

   THE STAMP, DETERMINISTICALLY. BUILD.sh writes `vN <short sha> <date time>`
   into data-build and the byte length, zero padded to nine, into data-len.
   Both change on every build and neither is source, so each side has the
   value of those two attributes replaced by a fixed word before the compare,
   and nothing else is touched. The stamp is not ignored: the packed payload
   is held to the committed source.html's stamp exactly.

   WHY THE PAYLOAD IS HELD BY STAMP AND NOT BY BYTES. The payload is the
   comment stripped build, and tools/slim.py strips with tsc, whose output is
   the version installed on whichever machine built it. CI installs
   typescript unpinned, so a byte compare would fail a correct file the day
   either side upgraded. Gzip bytes likewise depend on the zlib in the node
   that packed. The stamp is the build run's own name for itself, so "same
   stamp as a source.html that matches its source" is the same claim without
   either dependency.

     node tools/products.js              check the committed products, exit 1 on drift
     node tools/products.js --self-test  known good and known bad pairs first
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib'), cp = require('child_process');
const { packPage } = require('./pack.js');

const ROOT = path.resolve(__dirname, '..');
const FIX = 'Run ./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh, which now packs too, and commit source.html, engine.js and atuned-packed.html in the same change as the source.';

const stampOf = s => (String(s).match(/data-build="([^"]*)"/) || [])[1];
/* the two attributes the build writes per run, and nothing else */
const norm = s => String(s).replace(/data-build="[^"]*"/g, 'data-build="STAMP"').replace(/data-len="\d{9}"/g, 'data-len="LEN"');

function firstDiff(a, b) {
  const n = Math.min(a.length, b.length);
  let i = 0; while (i < n && a[i] === b[i]) i++;
  const line = a.slice(0, i).split('\n').length;
  return 'first difference at line ' + line + ': committed ' + JSON.stringify(a.slice(i, i + 60)) + ', fresh ' + JSON.stringify(b.slice(i, i + 60));
}

/* the parts of a packed page: its outer stamp, the length it states, the payload */
function unpack(page) {
  const len = (page.match(/var LEN=(\d+);/) || [])[1];
  const b = (page.match(/var B="([A-Za-z0-9+\/=]*)";/) || [])[1];
  if (len === undefined || b === undefined) return { err: 'it has no LEN or no payload, so it is not a page tools/pack.js wrote' };
  if (b.length !== +len) return { err: 'its payload is ' + b.length + ' characters and it states ' + len + ', so it is cut' };
  let html;
  try { html = zlib.gunzipSync(Buffer.from(b, 'base64')); } catch (e) { return { err: 'its payload does not inflate: ' + e.message }; }
  return { outer: stampOf(page), html: html };
}
const blank = page => page.replace(/var LEN=\d+;/, 'var LEN=0;').replace(/var B="[A-Za-z0-9+\/=]*";/, 'var B="";');

/* each returns a list of failures, empty when the product matches */
function judgeExact(name, committed, fresh) {
  if (committed === null) return [name + ' is not committed.'];
  if (fresh === null) return [name + ' was not built, so there is nothing to compare it with. The build step must run first.'];
  return committed === fresh ? [] : [name + ' does not match a fresh build of its source, ' + firstDiff(committed, fresh) + '. ' + FIX];
}
function judgeSource(committed, fresh) {
  if (committed === null || fresh === null) return judgeExact('source.html', committed, fresh);
  const f = [];
  if (!stampOf(committed)) f.push('source.html carries no data-build stamp.');
  if (norm(committed) !== norm(fresh)) f.push('source.html does not match a fresh build of its source, stamp aside, ' + firstDiff(norm(committed), norm(fresh)) + '. ' + FIX);
  return f;
}
function judgePacked(packed, source) {
  if (packed === null) return ['atuned-packed.html is not committed.'];
  const u = unpack(packed);
  if (u.err) return ['atuned-packed.html: ' + u.err + '. ' + FIX];
  const f = [], inner = stampOf(u.html.toString('utf8')), want = stampOf(source || '');
  if (!inner) f.push('atuned-packed.html inflates to a page with no data-build stamp.');
  else if (inner !== want) f.push('atuned-packed.html inflates to build "' + inner + '" and the committed source.html is "' + want + '", so the file handed to the owner is not this build. ' + FIX);
  if (u.outer !== inner) f.push('atuned-packed.html says "' + u.outer + '" on its outer page and "' + inner + '" inside.');
  const again = packPage(u.html).page;
  if (blank(again) !== blank(packed)) f.push('atuned-packed.html is not the page tools/pack.js wraps around its own payload today, ' + firstDiff(blank(packed), blank(again)) + '. ' + FIX);
  return f;
}

function committed(rel) {
  try { return cp.execFileSync('git', ['show', 'HEAD:' + rel], { cwd: ROOT, maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'pipe'] }).toString('utf8'); }
  catch (e) { return null; }
}
function fresh(rel) { try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch (e) { return null; } }

function check() {
  const src = committed('source.html');
  const fails = [].concat(
    judgeExact('engine.js', committed('engine.js'), fresh('engine.js')),
    judgeSource(src, fresh('source.html')),
    judgePacked(committed('atuned-packed.html'), src));
  console.log('  committed source.html is build ' + JSON.stringify(stampOf(src || '') || null));
  for (const f of fails) console.log('FAIL ' + f);
  console.log(fails.length ? '\nproducts: ' + fails.length + ' failing' : '\nproducts: engine.js, source.html and atuned-packed.html match their source');
  return fails.length ? 1 : 0;
}

/* ---- --self-test: known good and known bad pairs, each failing for its own reason ---- */
function selfTest() {
  const shell = st => '<!doctype html><html data-build="' + st + '"><body>x<div id="eof" hidden data-len="000001234"></div></body></html>';
  const S1 = 'v10 abc1234 2026-10-16 07:00', S2 = 'v11 def5678 2026-10-16 08:30';
  const A = shell(S1), B = shell(S2).replace('data-len="000001234"', 'data-len="000001240"');
  const P = packPage(Buffer.from(A)).page;
  const payload = p => (p.match(/var B="([^"]*)";/) || [])[1];
  const CASES = [
    // [name, failures, should pass, words the failure must carry]
    ['an engine byte for byte equal passes', judgeExact('engine.js', 'var a=1;\n', 'var a=1;\n'), true],
    ['an engine one byte off fails', judgeExact('engine.js', 'var a=1;\n', 'var a=2;\n'), false, 'does not match'],
    ['an engine that was not built fails', judgeExact('engine.js', 'x', null), false, 'was not built'],
    ['a source that differs only in its stamp and length passes', judgeSource(A, B), true],
    ['a source that differs anywhere else fails', judgeSource(A, B.replace('>x<', '>y<')), false, 'stamp aside'],
    ['a source with no stamp at all fails', judgeSource(A.replace(/ data-build="[^"]*"/, ''), A.replace(/ data-build="[^"]*"/, '')), false, 'no data-build'],
    ['a packed file from the same build passes', judgePacked(P, A), true],
    ['a packed file from an older build fails, by both stamps', judgePacked(P, B), false, 'is not this build'],
    ['a packed file cut short fails', judgePacked(P.replace(payload(P), payload(P).slice(0, -8)), A), false, 'so it is cut'],
    ['a packed payload that does not inflate fails', judgePacked(P.replace(payload(P), 'A'.repeat(payload(P).length)), A), false, 'does not inflate'],
    ['a packed outer page whose stamp is not its payload\'s fails', judgePacked(P.replace('<html lang="en" data-build="' + S1 + '">', '<html lang="en" data-build="' + S2 + '">'), A), false, 'on its outer page'],
    ['a packed wrapper an older pack.js wrote fails', judgePacked(P.replace('Opening the instrument.', 'Opening.'), A), false, 'wraps around its own payload'],
    ['a page with no payload fails', judgePacked('<html></html>', A), false, 'not a page tools/pack.js wrote'],
  ];
  let bad = 0;
  for (const [name, fails, want, says] of CASES) {
    const ok = !fails.length, said = !says || fails.some(f => f.includes(says)), right = ok === want && said;
    if (!right) bad++;
    console.log((right ? '  ok   ' : 'FAIL ') + name + ': ' + (ok ? 'passes' : 'fails, ' + fails[0].slice(0, 160))
      + (ok === want ? '' : ', expected it to ' + (want ? 'pass' : 'fail')) + (said ? '' : ', for another reason than "' + says + '"'));
  }
  console.log('\n===== ' + (CASES.length - bad) + ' passed, ' + bad + ' failed =====');
  return bad ? 1 : 0;
}

process.exit(process.argv.includes('--self-test') ? selfTest() : check());
