/* ============================================================
   field.js

   THE PANEL, AS FIELDS RATHER THAN AS PERSONAS.

   One thousand people, each one a charge vector and a law set put through
   the real engine, so every person in the panel carries a measured CQ, a
   measured band, and a measured heaviest address with a seat and a child
   fetter on it. That triple is the addressing key the whole marketing
   system reads. Nothing here invents a field.

   WHY THIS FILE EXISTS RATHER THAN A COPY OF THE LOSS PANEL.

   proto/ritual/losssim.js already runs a thousand person panel and its
   PANEL table already carries a grid level per archetype. That grid level
   is the thing this file has to reproduce before it is trusted, because it
   was derived from the engine by somebody else, for another purpose, and it
   is therefore a case whose answer is known in advance. validate() below
   asserts all nine. Three probes in this repository have reported defects
   that were the probe's own bug, so a probe that has not been checked
   against a known answer is not evidence.

   What this adds: the loss panel needed nine archetypes and a weight. A
   marketing system needs a thousand distinct fields, because the question
   is whether one line reaches people whose roles differ and whose fields
   agree, and nine rows cannot answer that. So each person is drawn from an
   archetype and then jittered, and the jitter is the modelled part and is
   labelled as such wherever a number comes off it.

   HOST FREE. No document, no window, no fetch. Same rule as engine/.
   ============================================================ */

const path = require('path');
const E = require(path.resolve(__dirname, '..', process.env.ENGINE || 'engine.js'));
const { S, CHARGES, SINAMES, PEOPLE, LAWSET, buildSoul, compute } = E;

/* ------------------------------------------------------------
   THE ARCHETYPES AND THEIR WEIGHTS.

   Weights are lifted verbatim from proto/ritual/losssim.js, which took them
   from RESEARCH-icp.md, and they sum to exactly 1000. grid is what that file
   records as the engine's own reading of each archetype, and it is the
   validation target, not an input.

   role and state are NEW here and they are the owner's own two lists from
   TASKS.md FN5: the executive, the athlete, the creative, the performer as
   roles, and the anxious, the burned out, the overwhelmed, the grief
   stricken as states. Assigning each archetype to one of each is a judgement
   made off its role string and its says line in engine/data/people.js, and
   it is labelled ASSIGNED because it is not measured. The whole point of the
   exercise is to test those two labels against the field, so they have to be
   written down before the field is read, and they are.
   ------------------------------------------------------------ */
const PANEL = [
  { nm: 'Diane',  w: 180, grid: 3,  role: 'executive', state: 'burned out' },
  { nm: 'Derek',  w: 170, grid: 2,  role: 'athlete',   state: 'burned out' },
  { nm: 'Marcus', w: 160, grid: 4,  role: 'creative',  state: 'overwhelmed' },
  { nm: 'Angela', w: 150, grid: 4,  role: 'performer', state: 'grief stricken' },
  { nm: 'Sofia',  w: 140, grid: 6,  role: 'performer', state: 'overwhelmed' },
  { nm: 'James',  w: 100, grid: 2,  role: 'executive', state: 'anxious' },
  { nm: 'Ana',    w: 50,  grid: 1,  role: 'creative',  state: 'grief stricken' },
  { nm: 'Gordon', w: 35,  grid: 1,  role: 'executive', state: 'anxious' },
  { nm: 'Rosa',   w: 15,  grid: 10, role: 'performer', state: 'burned out' }
];

/* ------------------------------------------------------------
   THE SEEDED STREAM. Ported from proto/ritual/losssim.js, comment and all,
   because its comment records a real defect and the fix is load bearing:
   mulberry32's first output off a structured seed is not independent of the
   seed. Scramble, then discard four. Ported, not rebuilt.
   ------------------------------------------------------------ */
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function stream(seed, ix, purpose) {
  let h = (seed >>> 0) ^ Math.imul(ix + 1, 0x9E3779B1) ^ Math.imul(purpose + 1, 0x85EBCA77);
  h = Math.imul(h ^ (h >>> 16), 0x21F0AAAD);
  h = Math.imul(h ^ (h >>> 15), 0x735A2D97);
  h = (h ^ (h >>> 15)) >>> 0;
  const r = mulberry32(h);
  r(); r(); r(); r();
  return r;
}

/* ------------------------------------------------------------
   READ ONE FIELD. compute() reads shared state, so this runs one person at a
   time and that is not a choice. CLAUDE.md names the impure core and defers
   purifying it; this file lives with it rather than working around it.
   ------------------------------------------------------------ */
function readField(src, jitter) {
  S.dom = src.dom; S.a1 = src.a1; S.a2 = src.a2;
  S.doms = [src.dom]; S.arcs = [src.a1, src.a2]; S.roots = [];
  buildSoul();
  /* THE JITTER IS PER AXIS, AND THE FIRST CUT WAS NOT.

     One draw applied to all nine charges moves the whole vector up or down
     and never changes which charge is largest, so the heaviest address does
     not move either. Measured: 1000 people, 8 distinct heaviest addresses.
     Nine archetypes reduced to eight keys is not a panel of a thousand
     fields, it is nine fields with a CQ wobble, and every finding about
     within role variance would have been an artefact of that.

     One draw per axis per person. The vector's shape moves, so which charge
     sits heaviest moves with it. Same width, and it is swept. */
  CHARGES.forEach((c, ci) => {
    const base = (src.c && src.c[c] !== undefined) ? src.c[c] : 0;
    const j = jitter ? jitter.charge(ci) : 0;
    S.charge[c] = Math.max(0, Math.min(10, base + j));
    S.replace[c] = (src.rep && src.rep[c]) || 0;
  });
  const LS = LAWSET[src.nm] || { _: 5.5 };
  SINAMES.forEach((l, li) => {
    const base = (LS[l] !== undefined) ? LS[l] : (LS._ !== undefined ? LS._ : 5.5);
    const j = jitter ? jitter.law(li) : 0;
    S.law[l] = Math.max(0, Math.min(10, base + j));
  });
  return compute();
}

/* the addressing key. three fields, all measured, none invented.

   charge is the child fetter sitting on the heaviest address. seat is where
   that address sits in the body. band is the CQ band from TIERDEF. A person
   with nothing held has no heaviest address at all, which is a fourth state
   and is not a hole: it is the reading Rosa gets, and a hook written at a
   charge she is not carrying would be a lie about her. */
function keyOf(r) {
  const h = r.heaviest;
  return {
    charge: h ? h.cf : null,
    seat: h ? h.b : null,
    address: h ? h.k : null,
    addressId: h ? h.i : null,
    held: h ? h.held : 0,
    band: r.tier,
    cq: r.CQ,
    carrying: (r.carrying || []).length
  };
}

/* THE GRID LEVEL, AND A DEFECT THIS FILE'S OWN VALIDATION CAUGHT.

   First cut read the level off CQ as a decile: floor(cq / 10) + 1. It looks
   right, BUYERS.md level 1 is 0 to 10 and level 10 is 91 to 100, and it
   failed validation group 1 on the first run. Angela reads CQ 40.9. A decile
   puts her at level 5. The engine's own band table puts her at Incoherent,
   because TIERDEF's Oscillating entry opens at 41 and 40.9 is below it, and
   Incoherent is BUYERS.md level 4, which is what proto/ritual/losssim.js
   records for her.

   The two rules disagree on every fractional CQ in the top of a band, which
   is nine tenths of a point in ten across the whole scale. One archetype of
   nine landed in that gap, so eight rows passed, which is exactly how this
   class of defect ships.

   So the level is not arithmetic on CQ. It is the engine's band, and the
   level is that band's position in TIERDEF. TIERDEF is written descending
   from Mastery, so the last entry is level 1 and the first is level 10, and
   the mapping is derived from the table rather than typed beside it. Nothing
   here restates a boundary the engine already owns. */
const BANDLEVEL = {};
E.TIERDEF.forEach(function (t, i) { BANDLEVEL[t.nm] = E.TIERDEF.length - i; });
function gridOf(band) {
  const g = BANDLEVEL[band];
  if (!g) throw new Error('band not in TIERDEF: ' + band);
  return g;
}

/* ------------------------------------------------------------
   BUILD THE PANEL. n people, drawn by weight, each one jittered.

   The jitter is MINE and it is the only modelled thing in this file. Charge
   moves plus or minus 1.2 of 10 and the law scale plus or minus 0.9 of 10,
   both uniform. Both are swept in hooksim.js and the report carries the
   sweep, because a finding that only exists at one jitter width is a finding
   about the jitter.
   ------------------------------------------------------------ */
function build(n, seed, opt) {
  opt = opt || {};
  const cj = opt.chargeJitter === undefined ? 1.2 : opt.chargeJitter;
  const lj = opt.lawJitter === undefined ? 0.9 : opt.lawJitter;
  const roster = [];
  PANEL.forEach(a => {
    const share = Math.round(n * a.w / 1000);
    for (let i = 0; i < share; i++) roster.push(a);
  });
  /* rounding can leave the roster a person short or long of n. Top up or
     trim from the heaviest archetype, and say so rather than silently
     returning a panel of 999 under a heading that says 1000. */
  while (roster.length < n) roster.push(PANEL[0]);
  while (roster.length > n) roster.pop();

  const out = [];
  for (let ix = 0; ix < roster.length; ix++) {
    const a = roster[ix];
    const src = PEOPLE.find(p => p.nm === a.nm);
    if (!src) throw new Error('archetype not in PEOPLE: ' + a.nm);
    const rc = stream(seed, ix, 1), rl = stream(seed, ix, 2);
    const cd = CHARGES.map(() => (rc() * 2 - 1) * cj);
    const ld = SINAMES.map(() => (rl() * 2 - 1) * lj);
    const r = readField(src, { charge: i => cd[i], law: i => ld[i] });
    const k = keyOf(r);
    out.push({
      ix, archetype: a.nm, role: a.role, state: a.state,
      charge: k.charge, seat: k.seat, address: k.address, addressId: k.addressId,
      held: k.held, band: k.band, cq: k.cq, carrying: k.carrying,
      grid: gridOf(k.band), unread: !!r.unread
    });
  }
  return out;
}

/* ------------------------------------------------------------
   VALIDATION. The probe is checked against answers it did not choose.

   1. Every archetype, read with no jitter, lands on the grid level
      proto/ritual/losssim.js records for it. Nine rows, nine answers,
      written by another tool for another purpose.
   2. The nine charges are the nine in the engine and no others.
   3. build(1000) returns exactly 1000 people and the archetype counts match
      the published weights exactly.
   4. Two people built at the same seed and index are identical, and at
      different seeds are not. A simulator whose panel drifts between runs
      cannot be diffed.
   ------------------------------------------------------------ */
function validate() {
  const fail = [];
  PANEL.forEach(a => {
    const src = PEOPLE.find(p => p.nm === a.nm);
    const r = readField(src, null);
    const g = gridOf(r.tier);
    if (g !== a.grid) {
      fail.push('1. ' + a.nm + ' grid ' + g + ' at CQ ' + r.CQ.toFixed(1)
        + ', losssim.js records ' + a.grid);
    }
  });
  if (CHARGES.length !== 9) fail.push('2. CHARGES is ' + CHARGES.length + ', not 9');

  const p = build(1000, 20260920);
  if (p.length !== 1000) fail.push('3. build(1000) returned ' + p.length);
  PANEL.forEach(a => {
    const got = p.filter(x => x.archetype === a.nm).length;
    if (got !== a.w) fail.push('3. ' + a.nm + ' is ' + got + ' of 1000, weight says ' + a.w);
  });

  const q = build(1000, 20260920), z = build(1000, 20260921);
  const same = JSON.stringify(p) === JSON.stringify(q);
  if (!same) fail.push('4. two builds at one seed differ');
  if (JSON.stringify(p) === JSON.stringify(z)) fail.push('4. two builds at different seeds agree');

  return fail;
}

module.exports = { PANEL, build, validate, readField, keyOf, gridOf, stream, CHARGES };

if (require.main === module) {
  const fail = validate();
  if (fail.length) { fail.forEach(f => console.log('FAIL ' + f)); process.exit(1); }
  console.log('field.js: 4 validation groups pass.');
  const p = build(1000, 20260920);
  console.log('panel of ' + p.length + ', ' + new Set(p.map(x => x.charge + '/' + x.seat)).size
    + ' distinct charge and seat keys, ' + new Set(p.map(x => x.address)).size
    + ' distinct heaviest addresses.');
}
