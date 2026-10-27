#!/usr/bin/env node
/* ============================================================
   CANON PORT. The merge from reboot-os, made repeatable. 24 October.

   canon.json is the owner's register file, SOURCE OS CANON, kept in reboot-os
   at atuned/data/canon.json. This repository holds the copy it was last merged
   against at vendor/reboot-os/canon.json, and the seven registers it had no
   table for are ported row for row into atuned_src/engine/data/registers.js.
   When reboot-os issues another canon.json, this is the whole merge:

     node tools/canon-port.js check [file]
         every ported register against the file, row by row, through the
         engine's own regDiff. Exit 1 on any difference, each one named.
     node tools/canon-port.js emit [register] [file]
         the rows in registers.js's own shape, every code kept: a row the
         table already holds keeps its code, a new row takes the next one.
         Paste over the table it names. With no register, all seven.
     node tools/canon-port.js map [file]
         every register and section of the file, where this repository holds
         it (REG_MAP in engine/registers.js), and which of the file's own open
         rulings block it. A register the map does not place is printed first.
     node tools/canon-port.js report [file]
         the measured disagreements behind CANON-MERGE-PLAN.md, read off the
         file and the engine on this run, so a figure in the plan is checked
         by running this rather than by trusting the plan.

   [file] defaults to the vendored copy. Every mode reads engine.js, the
   built product, so build first (atuned_src/BUILD-engine.sh). When the new
   file is right, it replaces the vendored copy and its md5 replaces the one
   CODE_SOURCES cites, in one commit, and tests/engine.js holds the two
   together from then on.

   Nothing here writes a file. A merge that rewrote the tables by itself would
   be a merge nobody read.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const VENDORED = path.join(ROOT, 'vendor', 'reboot-os', 'canon.json');
const ENGINE = path.join(ROOT, 'engine.js');

/* the seven registers this repository ported, each with the table that holds
   it, the code prefix of its rows (or none), and the field its rows are keyed
   by when the codes are kept */
const PORTED = [
  ['ladders', 'CHARGE_LADDER', 'LD', 'ch'],
  ['amplifiers', 'AMPLIFIER', 'AM', 'nm'],
  ['quadrants', 'BODY_QUADRANT', 'BQ', 'nm'],
  ['organs', 'ORGAN', 'OG', 'nm'],
  ['charge_routing', 'CHARGE_QUADRANT', null, null],
  ['derived_measures', 'DERIVED_MEASURE', 'DM', 'nm'],
  ['astrology_overlay', 'ASTRO_OVERLAY', null, null]];

function readCanon(file) {
  const raw = fs.readFileSync(file);
  return { canon: JSON.parse(raw.toString('utf8')), md5: crypto.createHash('md5').update(raw).digest('hex'), file };
}

/* the engine as one plain script, so a table it does not export can still be
   read, which the report needs and the engine has no reason to offer */
function engineRealm(file) {
  const ctx = vm.createContext({ console, Date, Math, JSON });
  vm.runInContext(fs.readFileSync(file || ENGINE, 'utf8'), ctx, { filename: 'engine.js' });
  return expr => vm.runInContext(expr, ctx);
}

/* ---------------------------------------------------------------- emit */

const q = JSON.stringify;
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
/* a list of items joined to lines no wider than w, each line led by pad */
function wrap(items, pad, w) {
  const lines = []; let line = '';
  items.forEach((it, i) => {
    const s = it + (i < items.length - 1 ? ',' : '');
    if (line && (pad + line + s).length > w) { lines.push(pad + line); line = ''; }
    line += s;
  });
  if (line) lines.push(pad + line);
  return lines.join('\n');
}
/* a row whose fields fit on one line is one line, and a longer one breaks
   after its code and name, then one field to a line */
function row(fields) {
  const one = ' {' + fields.join(',') + '}';
  if (one.length <= 100) return one;
  return ' {' + fields.slice(0, 2).join(',') + ',\n' + fields.slice(2).map(f => '  ' + f).join(',\n') + '}';
}
function table(name, rows) { return 'const ' + name + '=[\n' + rows.join(',\n') + '];'; }

/* the codes the table already holds, by its key field, and the next free one */
function coder(have, pre, key) {
  const by = {}; let top = 0;
  (Array.isArray(have) ? have : []).forEach(r => {
    by[r[key]] = r.c;
    const m = new RegExp('^' + pre + '(\\d+)$').exec(r.c); if (m) top = Math.max(top, +m[1]);
  });
  return k => by[k] || (pre + String(++top).padStart(2, '0'));
}
/* canon.json's description of a derived measure cites a law of HARM as
   "Element 32". The row keeps the citation as HARM's own code. */
function elementOf(d) { const m = /\bElement (\d+)\b/.exec(String(d || '')); return m ? 'E' + m[1].padStart(2, '0') : null; }

const EMIT = {
  ladders: (reg, have) => {
    const code = coder(have, 'LD', 'ch');
    return table('CHARGE_LADDER', Object.keys(reg).map(ch => ' {c:' + q(code(ch)) + ',ch:' + q(ch) + ',w:' + q(reg[ch]) + '}'));
  },
  amplifiers: (reg, have) => {
    const code = coder(have, 'AM', 'nm');
    return table('AMPLIFIER', reg.map(r => row(['c:' + q(code(r[0])), 'nm:' + q(r[0]), 'i:' + r[1], 'tag:' + q(r[3])])));
  },
  quadrants: (reg, have) => {
    const code = coder(have, 'BQ', 'nm');
    return table('BODY_QUADRANT', reg.map(r => row(['c:' + q(code(r[0])), 'nm:' + q(r[0]), 'layer:' + q(r[1]), 'theme:' + q(r[2]),
      'regions:' + q(r[3]), 'symptoms:' + q(r[4]), 'patterns:' + q(r[5]), 'side:' + q(r[6]), 'face:' + q(r[7])])));
  },
  organs: (reg, have) => {
    const code = coder(have, 'OG', 'nm');
    return table('ORGAN', reg.map(r => row(['c:' + q(code(r[0])), 'nm:' + q(r[0]), 'side:' + q(r[1]), 'issue:' + q(r[2]), 'voice:' + q(r[3])])));
  },
  charge_routing: reg => 'const CHARGE_QUADRANT={\n' + wrap(Object.keys(reg).map(k => k + ':' + q(reg[k])), ' ', 100) + '};',
  derived_measures: (reg, have) => {
    const code = coder(have, 'DM', 'nm');
    return table('DERIVED_MEASURE', reg.map(r => row(['c:' + q(code(r[0])), 'nm:' + q(r[0]), 'ch:' + q(r[2]), 'el:' + q(elementOf(r[1]))])));
  },
  astrology_overlay: reg => {
    const vec = o => '{\n' + wrap(Object.keys(o).map(k => k + ':' + q(o[k])), '  ', 100) + '}';
    return 'const ASTRO_OVERLAY={\n'
      + ' west:' + vec(reg.west) + ',\n'
      + ' east:' + vec(reg.east) + ',\n'
      + ' archetype_vectors:' + vec(reg.archetype_vectors) + ',\n'
      + ' load_map:{\n' + wrap(Object.keys(reg.load_map).map(k => k + ':' + q(reg.load_map[k])), '  ', 100) + '},\n'
      + ' dims:' + q(reg.dims) + '};';
  }};

/* one register, or every ported one, in the table's own shape. have is the
   table as the engine holds it now, or nothing on a first port. */
function emit(canon, which, tables) {
  return PORTED.filter(p => !which || p[0] === which).map(p => {
    if (!canon.registers || canon.registers[p[0]] === undefined) return '/* this canon.json has no register ' + p[0] + ' */';
    return EMIT[p[0]](canon.registers[p[0]], tables ? tables[p[1]] : null);
  }).join('\n\n');
}

/* ---------------------------------------------------------------- map */

function map(canon, E) {
  const out = [], M = E.REG_MAP, known = {};
  M.forEach(r => { known[r[0]] = r; });
  const paths = Object.keys(canon).filter(k => k !== 'registers').concat(Object.keys(canon.registers || {}).map(k => 'registers.' + k));
  const unplaced = paths.filter(p => !known[p]);
  unplaced.forEach(p => out.push('NOT PLACED  ' + p + '  this file has it and REG_MAP does not say where it lives here'));
  M.filter(r => paths.indexOf(r[0]) < 0).forEach(r => out.push('GONE        ' + r[0] + '  REG_MAP places it and this file does not have it'));
  /* a ruling that blocks formula.operational blocks a part of formula, so it
     is shown there; one that blocks nothing in the file is shown at the end */
  const rulings = canon.open_rulings || [], under = p => b => b === p || b.indexOf(p + '.') === 0;
  M.forEach(r => {
    const ids = rulings.filter(o => (o.blocks || []).some(under(r[0]))).map(o => o.id);
    const open = ids.length ? '  open ruling ' + ids.join(', ') : '';
    out.push(r[1].padEnd(7) + ' ' + r[0].padEnd(29) + ' ' + (r[2].length ? r[2].join(', ') : 'nothing here') + open + '\n        ' + r[3]);
  });
  rulings.forEach(o => (o.blocks || []).filter(b => !M.some(r => under(r[0])(b)))
    .forEach(b => out.push('open ruling ' + o.id + ' blocks ' + b + ', which is no part of the file: ' + o.item)));
  return { lines: out, unplaced: unplaced.length };
}

/* ---------------------------------------------------------------- report */

/* Each measurement the plan cites, read off the file and the engine now.
   Short on purpose: a line says what was compared and what was found. */
function report(canon, E, get) {
  const R = canon.registers, out = [], say = s => out.push(s);
  const KB = E.KB_KEY, codeOf = E.codeOf, BY = E.BY;
  /* 1 the field nodes */
  const field = R.nodes.filter(r => r[0] > 108);
  const moved = field.filter(r => KB(BY[r[0]].k).replace(/^sol /, 'soul ') !== KB(r[1]));
  say('field nodes: canon.json names 109 to 112 ' + field.map(r => r[0] + ' ' + r[1]).join(', ') + '; here '
    + field.map(r => r[0] + ' ' + BY[r[0]].k).join(', ') + '. ' + moved.length + ' of ' + field.length + ' sit at another number.');
  /* 2 the child emotion at each body address, canon.json's charge through this repository's one rule */
  const REROUTE = get('REROUTE'), ANT = get('ANTKEY'), SURP = get('SURPKEY'), HEART = get('HEARTKEY');
  const W = { fear: 'Fear', shame: 'Shame', anger: 'Anger', sadness: 'Sadness', anxiety: 'Anxiety', shock: 'Shock', joy: 'Joy', disgust: 'Disgust', resent: 'Resentment', love: 'Love' };
  const rule = (n, label) => ANT.test(n.k) ? 'Anticipation' : SURP.test(n.k) ? 'Surprise' : HEART.test(n.k) ? 'Sad' : (REROUTE[label] || null);
  const self = E.NODES.filter(n => !/^Field/.test(n.b) && rule(n, n.c) !== n.cf).length;
  const body = R.nodes.filter(r => r[0] <= 108), off = body.filter(r => rule(BY[r[0]], W[r[4]] || r[4]) !== BY[r[0]].cf);
  say('child emotion: canon.json\'s charge, run through this repository\'s rule, gives another child emotion at ' + off.length + ' of '
    + body.length + ' body addresses, for example ' + off.slice(0, 3).map(r => r[0] + ' ' + BY[r[0]].k + ' (' + r[4] + ' there, ' + BY[r[0]].cf + ' here)').join(', ')
    + '. The rule reproduces this repository\'s own answer at every address but ' + self + '.');
  /* 3 saboteur bands, matched by code */
  const mob = {}; E.SAB33.forEach(r => { const d = E.SABDEF[KB(r[0])]; if (d) mob[d.c] = r; });
  const fold = s => ({ joy: 'apathy', resent: 'anger' }[s] || s);
  let same = 0, word = 0, diff = 0; const diffs = [];
  R.saboteurs.forEach(r => {
    const c = codeOf(r[0], { source: 'canon', kind: 'saboteur' }), m = c.ok ? mob[c.code] : null;
    if (!m) { diff++; diffs.push(r[0] + ' has no row here'); return; }
    const a = q(r[1]), b = q(m[1]), a2 = q(r[1].map(x => [fold(x[0]), x[1], x[2]]));
    if (a === b) same++; else if (a2 === b) word++; else { diff++; diffs.push(r[0]); }
  });
  say('saboteur bands: of ' + R.saboteurs.length + ' rows matched by code, ' + same + ' are the same, ' + word + ' differ only by spelling joy or resent where this repository says apathy or anger, and '
    + diff + ' differ in a number or a charge: ' + diffs.join(', ') + '.');
  /* 4 and 5 complexes and hyper-complexes against the families */
  const LIB = E.SAB_LIB;
  const famOf = nm => { const r = codeOf(nm, { source: 'canon', kind: 'saboteur' }); if (!r.ok) return null;
    const key = Object.keys(E.SABDEF).find(k => E.SABDEF[k].c === r.code), lib = LIB.find(s => KB(s.nm) === key); return lib ? lib.hcx : null; };
  const split = R.complexes.filter(c => new Set(c[2].map(famOf)).size > 1);
  say('complexes: ' + split.length + ' of ' + R.complexes.length + ' put their saboteurs in two or three families here, and compute() only pairs two of one family: '
    + split.map(c => c[0] + (c[3] === 'R' ? ' (ruled)' : '')).join(', ') + '.');
  const cxBy = {}; R.complexes.forEach(c => { cxBy[c[0]] = c; });
  const span = R.hyper_complexes.map(h => { const f = new Set(); h[2].forEach(n => (cxBy[n] ? cxBy[n][2] : []).forEach(s => f.add(famOf(s)))); return [h[0], f.size]; });
  say('hyper-complexes: by the family arithmetic here, ' + span.filter(x => x[1] === 1).length + ' of ' + span.length + ' is one family, a hyper complex; '
    + span.filter(x => x[1] === 2).length + ' are two, a super complex; ' + span.filter(x => x[1] > 2).length + ' span three or more and fit no rung.');
  /* 6 archetype pairings */
  const a18 = {}; E.ARCH18.forEach(r => { a18[r[0]] = r; });
  const seatKey = s => KB(s).replace(/^3rd /, '');
  let pairs = 0, pairOff = [], seatOff = [];
  R.archetypes.forEach(r => {
    const m = a18[r[0]] || a18[{ Caretaker: 'Caregiver' }[r[0]]]; if (!m) return; pairs++;
    if ([r[1], r[2]].map(x => codeOf(x, { source: 'canon', kind: 'saboteur' }).code).indexOf(codeOf(m[1], { kind: 'saboteur' }).code) < 0) pairOff.push(r[0]);
    if ([r[3], r[4]].map(seatKey).indexOf(seatKey(m[2])) < 0) seatOff.push(r[0]);
  });
  say('archetype pairings: of the ' + pairs + ' archetypes both tables carry, ARCH18\'s one saboteur is neither of canon.json\'s two for '
    + pairOff.length + ' (' + pairOff.join(', ') + '), and its one seat is neither of canon.json\'s two for ' + seatOff.length + '.');
  /* 7 the jungian twelve against ARCH */
  const jungNo = R.jungian.filter(r => !codeOf(r[0], { source: 'canon', kind: 'archetype' }).ok).map(r => r[0]);
  const archOut = E.ARCH.filter(a => !R.jungian.some(r => { const c = codeOf(r[0], { source: 'canon', kind: 'archetype' }); return c.ok && c.code === codeOf(a.nm, { kind: 'archetype' }).code; })).map(a => a.nm);
  say('jungian: canon.json\'s twelve carry ' + jungNo.join(', ') + ', which have no archetype code here, and leave out ' + archOut.join(', ') + ', which ARCH carries.');
  /* 8 masks */
  const mm = {}; E.MASKS.forEach(m => { mm[KB(m.nm)] = m; });
  const mk = R.masks.map(r => { const k = KB(r[0].replace(/ Mask$/, '')); const m = mm[k]; return [r[0], m ? (m.b || m.seats || m.seat) : null, r[1]]; });
  say('masks: canon.json\'s ' + mk.map(x => x[0]).join(', ') + '; here ' + E.MASKS.map(m => m.nm).join(', ') + '. '
    + mk.filter(x => x[1]).length + ' of ' + mk.length + ' share a name.');
  /* 9 domains */
  const cd = [].concat.apply([], Object.keys(R.domains).map(k => R.domains[k]));
  const dn = E.DOMAINS.map(d => d.nm || d), none = l => l.length ? l.join(', ') : 'none';
  const ren = E.KB_RENAME;
  say('domains: canon.json has ' + cd.length + ' in ' + Object.keys(R.domains).length + ' families, DOMAINS has ' + dn.length + '. Only in canon.json: '
    + none(cd.filter(n => dn.indexOf(n) < 0)) + '. Only in DOMAINS: ' + none(dn.filter(n => cd.indexOf(n) < 0)) + '. DOMDEF, the knowledge page\'s table, names '
    + Object.keys(ren).length + ' of them otherwise, and KB_RENAME bridges the two: ' + Object.keys(ren).map(k => cap(k) + ' is ' + ren[k]).join(', ') + '.');
  /* 10 laws, number for number against HARM's element codes */
  const cl = [].concat.apply([], Object.keys(R.laws).map(k => R.laws[k]));
  const H = {}; E.HARM.forEach(h => { H[+h.c.slice(1)] = h.t; });
  const si = E.SINAMES, lawOff = cl.filter(r => H[r[0]] !== r[1]);
  say('laws: canon.json numbers ' + cl.length + ' in ' + Object.keys(R.laws).length + ' groups, HARM carries ' + E.HARM.length + ' and the instrument measures ' + si.length
    + '. Number for number, canon.json and HARM name ' + (cl.length - lawOff.length) + ' alike and ' + lawOff.length + ' otherwise: '
    + lawOff.map(r => r[0] + ' is ' + r[1] + ' there and ' + (H[r[0]] || 'nothing') + ' here').join('; ') + '. Of the ' + si.length + ' measured, canon.json has no law named '
    + none(si.filter(n => !cl.some(r => r[1] === n))) + '.');
  /* 11 the ladders against this repository's own words */
  const C3 = E.C3_LADDER.map(w => w.toLowerCase()), LEX = E.LEX, CL = E.CHARGE_LADDER || [];
  const places = {}; CL.forEach(l => l.w.forEach((w, i) => { (places[w] = places[w] || []).push(l.ch + ' ' + (i + 1)); }));
  const twice = Object.keys(places).filter(w => places[w].length > 1);
  let inC3 = 0, c3Off = 0, inLex = 0, lexOff = [];
  CL.forEach(l => {
    const at = l.w.map(w => C3.indexOf(w.toLowerCase())), sh = at.filter(x => x >= 0); inC3 += sh.length;
    for (let i = 1; i < sh.length; i++) if (sh[i] < sh[i - 1]) c3Off++;
    const lx = l.w.map(w => LEX[w.toLowerCase()]).map((x, i) => x ? [l.w[i], x[1]] : null).filter(Boolean); inLex += lx.length;
    for (let i = 1; i < lx.length; i++) if (lx[i][1] < lx[i - 1][1]) lexOff.push(l.ch + ': ' + lx[i - 1][0] + ' ' + lx[i - 1][1] + ' then ' + lx[i][0] + ' ' + lx[i][1]);
  });
  say('ladders: ' + CL.reduce((a, l) => a + l.w.length, 0) + ' words, ' + Object.keys(places).length + ' different; on two ladders: '
    + twice.map(w => w + ' (' + places[w].join(', ') + ')').join(', ') + '. ' + inC3 + ' are in C3_LADDER, ' + c3Off + ' of them in another order. '
    + inLex + ' are in the lexicon, and its amount falls as the step rises ' + lexOff.length + ' time' + (lexOff.length === 1 ? '' : 's') + (lexOff.length ? ': ' + lexOff.join('; ') : '') + '.');
  /* 12 amplifiers against NODES */
  const amp = R.amplifiers.map(r => [r[0], r[1], BY[r[1]] ? BY[r[1]].k : null, BY[r[1]] && BY[r[1]].n === r[2]]);
  say('amplifiers: ' + amp.filter(a => a[3]).length + ' of ' + amp.length + ' name the nerve NODES holds at their address. Named as the address here: '
    + amp.filter(a => KB(a[0]) === KB(a[2] || '')).length + '; the others: ' + amp.filter(a => KB(a[0]) !== KB(a[2] || '')).map(a => a[0] + ' at ' + a[1] + ', ' + a[2] + ' here').join('; ') + '.');
  /* 13 derived measures against HARM */
  say('derived measures: ' + R.derived_measures.map(r => { const e = elementOf(r[1]); const h = e ? E.HARM.find(x => x.c === e) : null;
    return r[0] + (e ? ' cites ' + e + ', which HARM names ' + (h ? h.t : 'nothing') : ' cites no law'); }).join('; ') + '.');
  return out;
}

/* ---------------------------------------------------------------- main */

function main(args) {
  const mode = args[0];
  const fileArg = mode === 'emit' && args[1] && !/\.json$/.test(args[1]) ? args[2] : args[1];
  const which = mode === 'emit' && args[1] && !/\.json$/.test(args[1]) ? args[1] : null;
  const usage = 'usage: node tools/canon-port.js check|emit [register]|map|report [canon.json]';
  if (['check', 'emit', 'map', 'report'].indexOf(mode) < 0) { console.log(usage); process.exit(2); }
  if (!fs.existsSync(ENGINE)) { console.log('engine.js was not found; run ./atuned_src/BUILD-engine.sh first'); process.exit(2); }
  const C = readCanon(fileArg ? path.resolve(fileArg) : VENDORED);
  const E = require(ENGINE);
  if (which && !PORTED.some(p => p[0] === which)) { console.log('the ported registers are ' + PORTED.map(p => p[0]).join(', ')); process.exit(2); }
  if (mode === 'emit') { console.log(emit(C.canon, which, E)); return; }
  console.log(path.relative(process.cwd(), C.file) + '  md5 ' + C.md5 + '  version ' + ((C.canon.meta || {}).version || 'none'));
  if (mode === 'check') {
    const d = E.regDiff(C.canon);
    d.forEach(x => console.log('  ' + x));
    console.log(d.length ? '\n' + d.length + ' difference' + (d.length === 1 ? '' : 's') + ' between the ported registers and this file' : '\nthe ported registers match this file row for row');
    process.exit(d.length ? 1 : 0);
  }
  if (mode === 'map') { const m = map(C.canon, E); m.lines.forEach(l => console.log(l)); process.exit(m.unplaced ? 1 : 0); }
  if (mode === 'report') report(C.canon, E, engineRealm()).forEach(l => console.log('\n' + l));
}

module.exports = { PORTED, EMIT, emit, map, report, readCanon, engineRealm, elementOf, VENDORED };
if (require.main === module) main(process.argv.slice(2));
