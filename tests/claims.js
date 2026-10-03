#!/usr/bin/env node
/* ============================================================
   THE CLAIMS GATE.

   WHY THIS FILE EXISTS. marketing/refuse.js was a real claims checker that
   nothing ran. Grepped 2 October: not one file in tests/ required it and
   neither build script called it, so it gated the hook table in marketing/
   and nothing a stranger reads. Run by hand against the shipped landing page
   it passed "Mindset programming is the cause.", "is making us ill" and "the
   leak shows up as mental, physical and spiritual disease" with zero
   violations, and it passed "An AI therapist in your pocket." too. Nothing
   was stopping any of it, which is what reviews/MASTER-BMT-AUDIT.md 3.1
   graded MISSING.

   WHAT IT HOLDS. Every string a person can read on every shipped marketing
   surface, run through the claims rules of refuse.js one sentence at a time:

     the funnel pages     funnel/*.html, read off the directory
     their copy tables    funnel/*.js, except the make-*.js build tools
     the sendable pages   funnel/dist/*.html, which is what actually goes out
     the legal pages      funnel/legal/*.html
     the engine's strings engine.js, because the quiz prints its tables
     the hooks            marketing/hooks.js, every field a person is served

   "A string a person can read" is the page text, the title, the meta
   description (which is what a search result prints), alt, aria-label,
   title, placeholder and data-tip, and every string literal in a page's
   own script, with literals joined across a + so a sentence split over two
   lines of source is read as one sentence. Comments are not read: a comment
   is a note between seats and never reaches a reader. The engine block that
   BUILD-single.sh inlines into the dist quiz is read once, from engine.js,
   rather than twice: it is the same bytes, and a finding in it printed twice
   reads as two defects.

   THE CLAIMS RULES, AND WHY ONLY THEM. refuse.js carries more rules than
   this gate runs. Five are claims about the world, true or false on their
   face: medical, cause, ai, testimonial, scarcity. The others are pressure
   and register (countdown, urgency, lossframe, verdict, reassurance, voice),
   which the voice gate owns, and two of them fire correctly on engine drill
   copy the quiz prints ("Hurry in to help and make it worse" is a law's low
   pole, not urgency). The list is CLAIMS below and the run prints it.

   HELD, AND NOT HIDDEN. Shipped lines that break the cause rule and are the
   owner's own words are held here; the count is read off the run. Three of
   them left with the landing page, round QT, 3 October, when it was rebuilt
   on reviews/ATUNED-Creative-Storyboard-TDD.md at his instruction: that
   document's own claims boundary, section 7, says "ATUNED must not present
   unverified mechanisms as established medical fact", so none of the three
   was carried onto the new page, and their holds were deleted by the rule
   below rather than kept for lines that no longer ship. A seat does not rewrite his words without him, and the
   question is already in front of him (WAITING-ON-YOU.md item 12; the audit
   names it D1). So each is caught first and then held by its exact
   sentence, with whose words it is and where he said them, and every run
   prints every hold. A held line that changes by one word is caught again.
   A held line that stops shipping fails the run until its hold is deleted,
   so the list cannot outlive what it covers. Nothing else may be added to
   it without his ruling: a hold for a line a seat wrote is a gate switched
   off for that line.

   CHECKED AGAINST A KNOWN BAD CASE FIRST, the standing rule. Before any page
   is read, the gate proves three things about itself, and stops if any is
   false, because a gate that cannot fail reports green on everything:

     1  every line in the known bad set is refused, by the rule named beside
        it. The set is the audit's probe table plus section 20 and section 5
        of reviews/ATUNED-Master-BMT-TDD.md, item by item.
     2  every line in the known good set passes. These are the product
        refusing the thing, and a gate that refuses them gets switched off.
     3  the reader finds a planted line in each place a line can hide (meta,
        paragraph, alt, a string split across a +) and does not read one
        planted in a comment or in the inlined engine.
     4  each claims rule, removed alone, lets its own line through, so no
        rule is dead weight carried by another.

   NO COUNT IS TYPED INTO THIS FILE. Files, strings, sentences, rules and
   holds are read off the run and printed.

       node tests/claims.js

   Run from anywhere. Headless, no dependencies. Exits non zero on any
   failure, and every failure names the file, the line, the rule and the
   sentence. BUILD.sh runs it on every build.
   ============================================================ */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = require(path.join(ROOT, 'marketing', 'refuse.js'));

const CLAIMS = ['medical', 'cause', 'ai', 'testimonial', 'scarcity'];

let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) PASS++; else { FAIL++; console.log('  FAIL  ' + m); } };

/* ---------------- HELD. His words, waiting on his ruling. ---------------- */
const WAITS = 'WAITING-ON-YOU.md item 12; reviews/MASTER-BMT-AUDIT.md Step 5, D1';
const HELD = [
  { text: 'When it is low the circuit leaks, and the leak is what promotes mental, physical and spiritual disease.', rules: ['cause'],
    whose: 'His. TASKS.md QZ3: "A low CQ promotes mental, physical and spiritual disease."',
    where: 'funnel/quiz.html, the reading' }
];
HELD.forEach(h => { h.key = R.norm(h.text); h.seen = []; });

/* ---------------- THE READER ---------------- */
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·',
  rsquo: '’', lsquo: '‘', ldquo: '"', rdquo: '"', hellip: '...', ndash: '-', mdash: '-' };
function dec(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    const v = ENT[e.toLowerCase()]; return v == null ? m : v;
  });
}
const flat = s => dec(String(s).replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const WORDY = s => /[a-z]{3,}[\s,]+[a-z]{2,}/i.test(s);

/* every string literal in a script, comments skipped, a regex literal told
   apart from a division by what stands before it, and literals joined across
   a + so "the leak is what promotes mental, '+'physical ... disease" is one
   sentence. Template holes become a space. */
const REGEX_BEFORE = /[(,=:[!&|?{};+\-*%<>~^]$|(^|[^\w$])(return|typeof|case|do|else|in|of|new|delete|void|throw|yield|await)$/;
function jsStrings(src) {
  const lits = []; let i = 0; const n = src.length;
  let last = '';                       /* the last significant source before here */
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { const e = src.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1, s = '';
      while (j < n && src[j] !== c) {
        if (src[j] === '\\') { s += src[j + 1] === 'n' ? ' ' : src[j + 1]; j += 2; continue; }
        if (c === '`' && src[j] === '$' && src[j + 1] === '{') {
          let depth = 1; j += 2;
          while (j < n && depth) { if (src[j] === '{') depth++; else if (src[j] === '}') depth--; j++; }
          s += ' '; continue;
        }
        if (c !== '`' && src[j] === '\n') break;
        s += src[j]; j++;
      }
      lits.push({ s, a: i, b: j + 1 }); i = j + 1; last = 'x'; continue;
    }
    if (c === '/' && REGEX_BEFORE.test(last.trimEnd() || '(')) {
      let j = i + 1, cls = false;
      while (j < n && src[j] !== '\n') {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === '[') cls = true; else if (src[j] === ']') cls = false;
        else if (src[j] === '/' && !cls) break;
        j++;
      }
      i = j + 1; while (i < n && /[a-z]/i.test(src[i])) i++;
      last = 'x'; continue;
    }
    if (!/\s/.test(c)) last = (last + c).slice(-12); else last = last + c;
    i++;
  }
  const joined = [];
  lits.forEach(l => {
    const prev = joined[joined.length - 1];
    if (prev && /^\s*\+\s*$/.test(src.slice(prev.b, l.a))) { prev.s += l.s; prev.b = l.b; }
    else joined.push({ s: l.s, a: l.a, b: l.b });
  });
  return joined.map(j => flat(j.s)).filter(WORDY);
}

const ENGINE_MARK = /^\s*\/\* engine\.js, inlined by BUILD-single\.sh \*\//;
function readHtml(raw, stat) {
  const out = [];
  let h = raw.replace(/<!--[\s\S]*?-->/g, ' ');
  h = h.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (m, js) => {
    if (ENGINE_MARK.test(js)) { stat.engine++; return ' '; }
    jsStrings(js).forEach(s => out.push(s)); return ' ';
  });
  h = h.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
  h.replace(/<[a-z][^>]*>/gi, tag => {
    tag.replace(/\s(content|alt|title|aria-label|placeholder|data-tip)\s*=\s*("([^"]*)"|'([^']*)')/gi,
      (m, a, q, v1, v2) => { const v = flat(v1 != null ? v1 : v2); if (WORDY(v)) out.push(v); return m; });
    return tag;
  });
  const BLOCK = /<\/?(p|div|li|ul|ol|h[1-6]|section|article|aside|header|footer|main|nav|br|hr|tr|td|th|table|label|button|summary|details|figure|figcaption|blockquote|title|head|body|html|form|fieldset|legend|option|select|textarea|dl|dt|dd)\b[^>]*>/gi;
  h.replace(BLOCK, '\n\n').split(/\n\s*\n/).map(flat).filter(WORDY).forEach(s => out.push(s));
  return out;
}
function readFile(file, stat) {
  const raw = fs.readFileSync(file, 'utf8');
  return { raw, units: /\.js$/.test(file) ? jsStrings(raw) : readHtml(raw, stat) };
}

/* where a sentence sits in its file, by its first words, for the report */
function lineOf(raw, sentence) {
  const words = sentence.split(/\s+/).slice(0, 6).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  for (let k = words.length; k >= 2; k--) {
    const m = new RegExp(words.slice(0, k).join("(?:\\s|<[^>]*>|'\\s*\\+\\s*')+")).exec(raw);
    if (m) return raw.slice(0, m.index).split('\n').length;
  }
  return '?';
}

/* one sentence, the claims rules only */
const OFF = R.RULES.map(r => r.id).filter(id => CLAIMS.indexOf(id) < 0);
const claims = (s, extra) => R.check(s, { without: OFF.concat(extra || []) });

/* ============================================================
   0. THE GATE AGAINST ITSELF, BEFORE IT READS A PAGE.
   ============================================================ */
console.log('\nCLAIMS GATE\n');
console.log('  rules run      ' + CLAIMS.join(', ') + '   (of ' + R.RULES.length + ' in refuse.js)');
CLAIMS.forEach(id => ok(R.RULES.some(r => r.id === id), '0. refuse.js has no rule called ' + id));

const BAD = [
  /* the audit's probe table, reviews/MASTER-BMT-AUDIT.md 3.1 */
  ['Most of the strain we have agreed to call normal is making us ill.', 'cause'],
  ['When coherence is low the circuit leaks, and the leak shows up as mental, physical and spiritual disease.', 'cause'],
  ['Mindset programming is the cause.', 'cause'],
  ['An AI therapist in your pocket.', 'ai'],
  ['Your AI clinician, always on.', 'ai'],
  ['AI heals you.', 'ai'],
  ['Atuned predicts illness and measures your energetic frequencies.', 'medical'],
  ['It knows the true cause of your back pain.', 'cause'],
  ['Your chakras are scientifically mapped.', 'medical'],
  ['Get an AI diagnosis tonight.', 'medical'],
  /* section 20, item by item */
  ['This cures anxiety.', 'medical'],
  ['This cures your trauma.', 'medical'],
  ['Atuned treats mental illness.', 'medical'],
  ['Atuned diagnoses disease.', 'medical'],
  ['It finds disease in the body.', 'medical'],
  ['Atuned predicts illness.', 'medical'],
  ['It measures energetic frequencies.', 'medical'],
  ['It scientifically maps your chakras.', 'medical'],
  ['It reprograms the brain.', 'medical'],
  ['Atuned replaces therapy.', 'medical'],
  ['It replaces clinicians.', 'medical'],
  ['It knows the true cause of physical symptoms.', 'cause'],
  /* section 5, the five leads */
  ['Your AI therapist.', 'ai'],
  ['Meet your AI clinician.', 'ai'],
  ['A free AI diagnosis.', 'ai'],
  ['The AI knows what is wrong with you.', 'ai'],
  /* and the two claim rules carried over, so they are proven here too */
  ['Join 40,000 people who already read their field.', 'testimonial'],
  ['Only 12 spots left this month.', 'scarcity']
];
let caught = 0;
BAD.forEach(([line, rule]) => {
  const v = claims(line);
  if (v.some(x => x.rule === rule)) caught++;
  ok(v.some(x => x.rule === rule), '0.1 the known bad line is not refused by ' + rule + ': "' + line + '"');
});
console.log('  known bad      ' + caught + ' of ' + BAD.length + ' refused');

const GOOD = [
  'It reads self report. A clinician reads a person, and those are different jobs.',
  'It is not a therapist and it does not diagnose.',
  'It makes no claim about tissue, no diagnosis and no treatment.',
  'Nothing here is AI, and nothing here is a diagnosis.',
  'This configuration needs a licensed clinician alongside, not instead.',
  'Sound healers gave this seat its note, so nothing in your body is measured to get it.',
  'It reads where the charge sits and what it costs.',
  'The nervous system has kinks all over it.',
  'What changed?'
];
let clean = 0;
GOOD.forEach(line => {
  const v = claims(line);
  if (!v.length) clean++;
  ok(!v.length, '0.2 a line that refuses the thing was refused by ' + v.map(x => x.rule).join(', ') + ': "' + line + '"');
});
console.log('  known good     ' + clean + ' of ' + GOOD.length + ' pass');

/* the reader, on a page planted on purpose */
{
  const st = { engine: 0 };
  const page = [
    '<html><head><title>Atuned</title><meta name="description" content="An AI therapist in your pocket.">',
    '<!-- It replaces clinicians. -->',
    '</head><body><p>Plain copy first. It finds',
    ' disease in the body.</p><img src="x.png" alt="Your AI clinician, always on.">',
    '<script>\n/* engine.js, inlined by BUILD-single.sh */\nvar x="It reprograms the brain and more words";\n</script>',
    '<script>var r=/["\']/g, a=b/2; // Atuned treats mental illness.\n',
    'var h=\'<p>When it is low the leak is what promotes mental, \'',
    ' +\'physical and spiritual disease.</p>\';</script></body></html>'
  ].join('\n');
  const got = readHtml(page, st).map(u => R.sentences(u).map(s => claims(s).map(v => v.rule)).flat()).flat();
  const units = readHtml(page, { engine: 0 }).join(' | ');
  ok(/AI therapist in your pocket/.test(units), '0.3 the reader missed the meta description');
  ok(/finds disease in the body/.test(units), '0.3 the reader missed a sentence broken across a line in a paragraph');
  ok(/AI clinician, always on/.test(units), '0.3 the reader missed an alt');
  ok(/promotes mental, physical and spiritual disease/.test(units), '0.3 the reader did not join a sentence split across a +');
  ok(!/replaces clinicians/.test(units), '0.3 the reader read a comment');
  ok(!/treats mental illness/.test(units), '0.3 the reader read a script comment after a regex literal');
  ok(!/reprograms the brain/.test(units), '0.3 the reader read the inlined engine');
  ok(st.engine === 1, '0.3 the inlined engine block was not recognised');
  ok(got.length >= 4, '0.3 the planted page raised ' + got.length + ' findings, wanted at least 4');
}

/* each claims rule, removed alone, lets its own lines through */
CLAIMS.forEach(id => {
  const mine = BAD.filter(b => b[1] === id);
  ok(mine.length > 0, '0.4 no known bad line is written for ' + id + ', so its removal tests nothing');
  mine.forEach(([line]) => ok(!claims(line, [id]).some(v => v.rule === id), '0.4 ' + id + ' still fired with ' + id + ' removed'));
});

if (FAIL) {
  console.log('\n  The gate failed against itself, so no page was read. A gate that cannot');
  console.log('  fail reports green on everything.\n  ' + PASS + ' passed, ' + FAIL + ' failed\n');
  process.exit(1);
}

/* ============================================================
   1. THE SHIPPED SURFACES.
   ============================================================ */
const F = path.join(ROOT, 'funnel');
const ls = (d, re) => fs.existsSync(d) ? fs.readdirSync(d).filter(f => re.test(f)).sort().map(f => path.join(d, f)) : [];
const FILES = []
  .concat(ls(F, /\.html$/))
  .concat(ls(F, /\.js$/).filter(f => !/^make-/.test(path.basename(f))))
  .concat(ls(path.join(F, 'dist'), /\.html$/))
  .concat(ls(path.join(F, 'legal'), /\.html$/))
  .concat([path.join(ROOT, 'engine.js')].filter(f => fs.existsSync(f)));
ok(FILES.some(f => /funnel[\\/]index\.html$/.test(f)), '1. funnel/index.html was not found, so the landing page went unread');
ok(FILES.some(f => /dist[\\/]atuned-funnel\.html$/.test(f)), '1. funnel/dist/atuned-funnel.html was not found, so the sendable landing page went unread');
ok(fs.existsSync(path.join(ROOT, 'engine.js')), '1. engine.js was not found; run ./atuned_src/BUILD-engine.sh first');

let nStr = 0, nSent = 0, nFind = 0, nHeld = 0;
const stat = { engine: 0 };
const check = (rel, raw, units) => {
  ok(units.length > 0, '1. ' + rel + ' gave the reader no strings, so it was not checked at all');
  units.forEach(u => {
    nStr++;
    R.sentences(u).forEach(s => {
      nSent++;
      const v = claims(s);
      if (!v.length) return;
      const key = R.norm(s), h = HELD.find(x => x.key === key);
      const rules = v.map(x => x.rule).filter((x, i, a) => a.indexOf(x) === i);
      if (h && rules.every(r => h.rules.indexOf(r) >= 0)) {
        nHeld++; h.seen.push(rel + ':' + lineOf(raw, s)); return;
      }
      nFind++;
      ok(false, rel + ':' + lineOf(raw, s) + '  ' + rules.join(', ') + '\n        ' + s
        + '\n        ' + v.map(x => x.pattern).join('  '));
    });
  });
};
FILES.forEach(f => {
  const rel = path.relative(ROOT, f).split(path.sep).join('/');
  const r = readFile(f, stat);
  check(rel, r.raw, r.units);
});

/* the hooks, every field a person is served */
const H = require(path.join(ROOT, 'marketing', 'hooks.js'));
const SERVED = ['hook', 'proof', 'answered'];
const hookUnits = [].concat(H.HOOKS, [H.CLEAR, H.DOOR_OUT], H.DOORS, H.ROLES)
  .filter(Boolean).map(h => SERVED.map(k => typeof h[k] === 'string' ? h[k] : '').filter(WORDY)).flat();
check('marketing/hooks.js', fs.readFileSync(path.join(ROOT, 'marketing', 'hooks.js'), 'utf8'), hookUnits);
ok(stat.engine > 0, '1. no inlined engine block was found in funnel/dist, so the skip rule tested nothing');

/* every hold is still earning its place */
HELD.forEach(h => ok(h.seen.length > 0, '1. held line no longer ships, delete its hold: "' + h.text + '"'));

console.log('  read           ' + (FILES.length + 1) + ' files, ' + nStr + ' strings, ' + nSent + ' sentences');
console.log('  skipped        ' + stat.engine + ' inlined engine block(s) in funnel/dist, read once from engine.js');
console.log('  findings       ' + nFind);
console.log('  held           ' + nHeld + ' occurrence(s) of ' + HELD.length + ' line(s), his words, waiting on ' + WAITS);
HELD.forEach(h => {
  console.log('\n    HELD  ' + h.rules.join(', ') + '  "' + h.text + '"');
  console.log('          ' + h.whose);
  console.log('          ships at ' + h.seen.join(', '));
});
console.log('\n  ' + PASS + ' passed, ' + FAIL + ' failed\n');
process.exit(FAIL ? 1 : 0);
