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

   THE FUNNEL, 23 October. funnel/BUILD-single.sh inlines tokens.css,
   engine.js, questions.js and ring.js into one sendable file per funnel page
   under funnel/dist, and those are committed for the same reason. This file
   did not hold them, and on 23 October the committed atuned-quiz.html carried
   engine.js as it stood at a4c2872b, without the codes layer that 6343fd46
   put into the engine.js committed beside it: that commit rebuilt the three
   products named above and not the quiz, and this check passed it. A run that
   day listed every committed file the three builds write, which is the three
   above, funnel/tokens.css and the pages under funnel/dist, and every one of
   them is held now.

   Run in gates-fast after the three builds, which rewrite all of them in the
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
     funnel/tokens.css   byte for byte against the fresh BUILD.sh output, which
                         writes it from the app's own stylesheet.
     funnel/dist/*.html  byte for byte against the fresh BUILD-single.sh output,
                         with nothing normalised, below. The pages are read off
                         both sides, every one git holds there and every one the
                         build wrote there, so a page the build makes and git
                         lacks fails, and so does a page git keeps that the
                         build no longer makes. atuned-quiz.html is required by
                         name, so a list that came back empty cannot pass by
                         checking nothing.

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

   THE FUNNEL HAS NO STAMP, SO NOTHING IN IT IS SET ASIDE. BUILD-single.sh
   writes no data-build and no data-len, and three full builds in three
   different minutes on 23 October wrote the same bytes for every funnel page
   while the stamp on source.html moved each time. A data-build that ever
   appeared in a funnel page would be a difference, not a stamp, so norm() is
   never applied to one.

   THE FRESH SIDE MUST BE FRESH. A check run after BUILD-engine.sh and BUILD.sh
   alone, the two builds this file's fix line named until 23 October, finds
   funnel/dist as the checkout left it and compares the committed quiz with
   itself. So before a funnel page is trusted as a fresh build it must carry
   the tokens.css beside it, and the quiz the engine.js beside it, exactly as
   BUILD-single.sh reads them. Those are the two inputs that come out of the
   other two builds, which is the gap 6343fd46 fell through. The funnel's own
   sources are not guarded this way: a page edited without rerunning
   BUILD-single.sh passes here locally and fails in gates-fast, which runs
   every build first.

     node tools/products.js              check the committed products, exit 1 on drift
     node tools/products.js --self-test  known good and known bad pairs first
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib'), cp = require('child_process');
const { packPage } = require('./pack.js');

const ROOT = path.resolve(__dirname, '..');
const FIX = 'Run ./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh, in that order, since BUILD.sh packs and writes funnel/tokens.css and the quiz inlines engine.js, and commit source.html, engine.js, atuned-packed.html, funnel/tokens.css and funnel/dist in the same change as the source.';

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

/* ---- the funnel: held and built each map a page's path to its text ---- */
const DIST = 'funnel/dist', QUIZ = DIST + '/atuned-quiz.html';
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const pagesOf = (held, built) => Array.from(new Set(Object.keys(held).concat(Object.keys(built)))).sort();
/* how BUILD-single.sh marks what it inlined, and the tag that closes each */
const ENGINE_IN = ['/* engine.js, inlined by BUILD-single.sh */\n', '\n</script>'];
const TOKENS_IN = ['/* tokens.css, inlined by BUILD-single.sh */\n', '</style>'];
function inlined(page, mark) {
  const at = page.indexOf(mark[0]);
  if (at < 0 || page.indexOf(mark[0], at + 1) >= 0) return null;
  const a = at + mark[0].length, b = page.indexOf(mark[1], a);
  return b < 0 ? null : page.slice(a, b);
}
/* a file as BUILD-single.sh reads it: python's read_text turns \r\n and \r into \n */
const asRead = s => s.replace(/\r\n?/g, '\n');

function judgeInlined(built, engine, tokens) {
  const f = [];
  const carry = (p, mark, name, want) => {
    if (built[p] === null || want === null) return;
    const got = inlined(built[p], mark);
    if (got === null) f.push(p + ' has no single block marked "' + mark[0].trim() + '", so what it carries of ' + name + ' cannot be read. The marker in tools/products.js must follow funnel/BUILD-single.sh.');
    else if (got !== asRead(want)) f.push(p + ' in the working tree does not carry the ' + name + ' beside it, so the funnel was not built from it and there is no fresh page to hold the committed one to. ' + FIX);
  };
  for (const p of Object.keys(built).sort()) carry(p, TOKENS_IN, 'funnel/tokens.css', tokens);
  if (has(built, QUIZ)) carry(QUIZ, ENGINE_IN, 'engine.js', engine);
  return f;
}
function judgeFunnel(held, built) {
  if (!Object.keys(built).length) return [DIST + ' holds no page after the build, so there is nothing to hold its committed pages to. ' + FIX];
  const f = [], pages = pagesOf(held, built);
  if (!pages.includes(QUIZ)) f.push(QUIZ + ' is neither committed nor built, so the page the owner named is held by nothing. ' + FIX);
  for (const p of pages) {
    if (!has(held, p)) f.push(p + ' is built and not committed, so the files handed out lack a page the funnel makes. ' + FIX);
    else if (!has(built, p)) f.push(p + ' is committed and the build left no such page in ' + DIST + ', so either the funnel no longer makes it and it has outlived its source, or ./funnel/BUILD-single.sh did not finish.');
    else f.push(...judgeExact(p, held[p], built[p]));
  }
  return f;
}

function committed(rel) {
  try { return cp.execFileSync('git', ['show', 'HEAD:' + rel], { cwd: ROOT, maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'pipe'] }).toString('utf8'); }
  catch (e) { return null; }
}
function fresh(rel) { try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch (e) { return null; } }
/* every .html git holds directly under dir at HEAD, the side committed() reads */
function committedUnder(dir) {
  let out;
  try { out = cp.execFileSync('git', ['ls-tree', '-z', 'HEAD', dir + '/'], { cwd: ROOT, maxBuffer: 1 << 20, stdio: ['ignore', 'pipe', 'pipe'] }).toString('utf8'); }
  catch (e) { return []; }
  return out.split('\0').map(l => l.split('\t')).filter(r => r.length === 2 && r[0].split(' ')[1] === 'blob' && r[1].endsWith('.html')).map(r => r[1]);
}
/* every .html the build left directly under dir in the working tree */
function builtUnder(dir) {
  try { return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).filter(d => d.isFile() && d.name.endsWith('.html')).map(d => dir + '/' + d.name); }
  catch (e) { return []; }
}

function check() {
  const src = committed('source.html'), engine = fresh('engine.js'), tokens = fresh('funnel/tokens.css');
  const held = {}, built = {};
  for (const p of committedUnder(DIST)) held[p] = committed(p);
  for (const p of builtUnder(DIST)) built[p] = fresh(p);
  const fails = [].concat(
    judgeExact('engine.js', committed('engine.js'), engine),
    judgeSource(src, fresh('source.html')),
    judgePacked(committed('atuned-packed.html'), src),
    judgeExact('funnel/tokens.css', committed('funnel/tokens.css'), tokens),
    judgeInlined(built, engine, tokens),
    judgeFunnel(held, built));
  const pages = pagesOf(held, built);
  console.log('  committed source.html is build ' + JSON.stringify(stampOf(src || '') || null));
  console.log('  ' + DIST + ', ' + pages.length + ' page(s), each byte for byte: ' + pages.map(p => path.basename(p)).join(', '));
  for (const f of fails) console.log('FAIL ' + f);
  console.log(fails.length ? '\nproducts: ' + fails.length + ' failing'
    : '\nproducts: engine.js, source.html, atuned-packed.html, funnel/tokens.css and the ' + pages.length + ' pages under ' + DIST + ' match their source');
  return fails.length ? 1 : 0;
}

/* ---- --self-test: known good and known bad pairs, each failing for its own reason ---- */
function selfTest() {
  const shell = st => '<!doctype html><html data-build="' + st + '"><body>x<div id="eof" hidden data-len="000001234"></div></body></html>';
  const S1 = 'v10 abc1234 2026-10-16 07:00', S2 = 'v11 def5678 2026-10-16 08:30';
  const A = shell(S1), B = shell(S2).replace('data-len="000001234"', 'data-len="000001240"');
  const P = packPage(Buffer.from(A)).page;
  const payload = p => (p.match(/var B="([^"]*)";/) || [])[1];
  /* a funnel page as BUILD-single.sh inlines one: tokens always, the engine in the quiz */
  const TOK = ':root{--ink:#111}\n', ENG = 'var codes=1;\n';
  const page = (tok, eng) => '<!doctype html><html><head><style>\n' + TOKENS_IN[0] + tok + TOKENS_IN[1] + '</head><body>'
    + (eng === undefined ? '' : '<script>\n' + ENGINE_IN[0] + eng + ENGINE_IN[1]) + '</body></html>';
  const Q = QUIZ, FAQ = DIST + '/atuned-faq.html', NEW = DIST + '/atuned-new.html';
  const QA = page(TOK, ENG), QB = page(TOK, 'var codes=2;\n'), FA = page(TOK);
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
    ['a funnel whose committed pages are byte for byte their build passes', judgeFunnel({ [Q]: QA, [FAQ]: FA }, { [Q]: QA, [FAQ]: FA }), true],
    ['a committed quiz carrying an older engine than its build fails', judgeFunnel({ [Q]: QB }, { [Q]: QA }), false, 'does not match'],
    ['a quiz that differs only in a data-build stamp fails, since the funnel has none to set aside', judgeFunnel({ [Q]: A }, { [Q]: B }), false, 'does not match'],
    ['a quiz that differs only in its line endings fails', judgeFunnel({ [Q]: 'a\r\nb\r\n' }, { [Q]: 'a\nb\n' }), false, 'does not match'],
    ['a page the build makes and git lacks fails', judgeFunnel({ [Q]: QA }, { [Q]: QA, [NEW]: FA }), false, 'built and not committed'],
    ['a page git keeps that the build no longer makes fails', judgeFunnel({ [Q]: QA, [FAQ]: FA }, { [Q]: QA }), false, 'left no such page'],
    ['a funnel git holds nothing of fails, so a lookup that came back empty cannot pass', judgeFunnel({}, { [Q]: QA }), false, 'built and not committed'],
    ['a funnel with no quiz on either side fails, so a lost list cannot pass by checking nothing', judgeFunnel({ [FAQ]: FA }, { [FAQ]: FA }), false, 'held by nothing'],
    ['a funnel the build left empty fails', judgeFunnel({ [Q]: QA }, {}), false, 'holds no page after the build'],
    ['built pages that carry the engine.js and tokens.css beside them pass', judgeInlined({ [Q]: QA, [FAQ]: FA }, ENG, TOK), true],
    ['a built quiz carrying an older engine than the engine.js beside it fails, the 6343fd46 gap', judgeInlined({ [Q]: QB }, ENG, TOK), false, 'does not carry the engine.js'],
    ['a built quiz whose engine keeps code the engine.js beside it dropped fails, so containment is not enough', judgeInlined({ [Q]: page(TOK, ENG + 'function gone(){}\n') }, ENG, TOK), false, 'does not carry the engine.js'],
    ['a built page carrying other tokens than the tokens.css beside it fails', judgeInlined({ [FAQ]: page(':root{--ink:#222}\n') }, ENG, TOK), false, 'does not carry the funnel/tokens.css'],
    ['a built page with no marked tokens block fails, so a changed marker cannot pass unseen', judgeInlined({ [FAQ]: '<html></html>' }, ENG, TOK), false, 'no single block marked'],
    ['an engine.js with \\r\\n line endings is carried the way python reads it, and passes', judgeInlined({ [Q]: page(TOK, 'var a=1;\nvar b=2;\n') }, 'var a=1;\r\nvar b=2;\r\n', TOK), true],
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
