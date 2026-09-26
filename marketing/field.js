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
   PANEL table carries a grid level per archetype. Those levels were the
   first known answer this file was checked against, and they did their job:
   on 26 September they caught the engine moving underneath this file. They
   are the 20 September arithmetic and are no longer the engine's reading,
   so validate() below now checks against two things instead, both written
   down before the run and neither chosen by this file's own arithmetic. See
   THE KNOWN ANSWERS beside PANEL. Three probes in this repository have
   reported defects that were the probe's own bug, so a probe that has not
   been checked against a known answer is not evidence.

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
   from RESEARCH-icp.md, and they sum to exactly 1000. grid and exGrid are the
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
/* ------------------------------------------------------------
   THE KNOWN ANSWERS, AND WHY THEY MOVED ON 26 SEPTEMBER.

   grid, cq, exGrid and ex are the engine's reading of each archetype with no
   jitter. They are a regression pin: they are typed here so that the next
   time the engine moves, this file fails and somebody decides, which is what
   happened.

   What moved. Commit dd0bf23, 25 September, rebuilt CQ to the fitted model
   on the owner's ruling (DECISIONS.md, "The CQ model, fitted"): CQ is the 21
   laws summed over 210, where it was It*Ig/Rz, which counted the laws twice
   and divided by resistance. TIERDEF did not move; its last change is
   99d10c6, before this file existed. So every archetype rose two to four
   levels on the same band table: Angela read CQ 40.9 and Incoherent under the
   old arithmetic and reads 64.4 and Gaining now. Bisected over every
   committed engine.js since this file was written: the readings are
   identical through fbe941c and change at dd0bf23 and nowhere else.

   The 20 September levels, for the record, were Diane 3, Derek 2, Marcus 4,
   Angela 4, Sofia 6, James 2, Ana 1, Gordon 1, Rosa 10. losssim.js still
   carries them and still reads them for its own harm model.

   What checks the pin without trusting it. validate() recomputes CQ from
   LAWSET alone, as the ruling defines it, without calling compute(), and
   requires compute() to agree. Gordon's pair, CQ 17.5 and expression 7.9, is
   recorded independently in TASKS.md BB5 by the seat that repointed the
   clinician referral.

   exGrid IS THE LEVEL OF EXPRESSION ON THE SAME BAND TABLE, and it is here
   because of the harm gate. Expression is CQ with the shadow's pull taken
   off, so it carries the load CQ no longer sees. Under CQ alone the lowest
   reading in the roster is Gordon at 17.5, nobody reads level 1, and the door
   out would never be served to anybody. The engine hit the same wall first:
   ui/drills.js reads the descent and its clinician referral off expression
   for exactly this reason, and says a safety referral is not a label and does
   not wait on the owner's open question 1. match.js follows the engine. grid
   stays on CQ, because the tier word is on CQ until he rules.

   role and state are NEW here and they are the owner's own two lists from
   TASKS.md FN5, assigned by hand and labelled ASSIGNED above. */
const PANEL = [
  { nm: 'Diane',  w: 180, grid: 6,  cq: 59.0, exGrid: 6,  ex: 56.0, role: 'executive', state: 'burned out' },
  { nm: 'Derek',  w: 170, grid: 5,  cq: 48.5, exGrid: 5,  ex: 42.6, role: 'athlete',   state: 'burned out' },
  { nm: 'Marcus', w: 160, grid: 7,  cq: 62.1, exGrid: 7,  ex: 62.0, role: 'creative',  state: 'overwhelmed' },
  { nm: 'Angela', w: 150, grid: 7,  cq: 64.4, exGrid: 7,  ex: 64.4, role: 'performer', state: 'grief stricken' },
  { nm: 'Sofia',  w: 140, grid: 8,  cq: 72.9, exGrid: 8,  ex: 72.8, role: 'performer', state: 'overwhelmed' },
  { nm: 'James',  w: 100, grid: 5,  cq: 42.3, exGrid: 4,  ex: 37.2, role: 'executive', state: 'anxious' },
  { nm: 'Ana',    w: 50,  grid: 5,  cq: 41.1, exGrid: 3,  ex: 30.7, role: 'creative',  state: 'grief stricken' },
  { nm: 'Gordon', w: 35,  grid: 2,  cq: 17.5, exGrid: 1,  ex: 7.9,  role: 'executive', state: 'anxious' },
  { nm: 'Rosa',   w: 15,  grid: 10, cq: 97.0, exGrid: 10, ex: 97.0, role: 'performer', state: 'burned out' }
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
   failed validation group 1 on the first run. Angela read CQ 40.9 under the
   arithmetic of 20 September. A decile
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
/* the same table, read at expression. See THE KNOWN ANSWERS above. */
function exGridOf(r) {
  if (typeof r.EX !== 'number') throw new Error('engine reports no expression');
  return gridOf(E.tierOf(r.EX).nm);
}
/* the engine's own clinician referral, called rather than restated, so the
   harm gate can be asserted to reach everybody it reaches. */
function referOf(r) {
  return !!E.darkRead(r.malig === null || r.malig === undefined ? null : r.malig / 100, r.EX).refer;
}
/* CQ AS THE RULING DEFINES IT, WITHOUT compute(). The 21 laws summed over
   210, an unanswered law counting 0. Written from DECISIONS.md rather than
   from the engine's code, so a disagreement is a finding about one of them. */
function lawSumCQ(src) {
  const LS = LAWSET[src.nm] || { _: 5.5 };
  let sum = 0;
  SINAMES.forEach(l => { sum += (LS[l] !== undefined) ? LS[l] : (LS._ !== undefined ? LS._ : 5.5); });
  return sum / 210 * 100;
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
      grid: gridOf(k.band), ex: r.EX, exGrid: exGridOf(r), refer: referOf(r),
      unread: !!r.unread
    });
  }
  return out;
}

/* ------------------------------------------------------------
   VALIDATION. The probe is checked against answers it did not choose.

   1. Every archetype, read with no jitter, lands on the pinned CQ, grid,
      expression and exGrid, and compute()'s CQ agrees with the law sum
      recomputed here from LAWSET. When the pin fails and the law sum agrees,
      the engine moved inside the ruling: find the commit, and re-take the
      pin with it named. When the law sum disagrees too, either this file
      feeds the engine wrong or CQ has left the ruling, and nothing is
      re-pinned until somebody knows which.
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
    if (typeof r.EX !== 'number') {
      fail.push('1. ' + a.nm + ': the engine reports no expression, so it predates the fitted CQ model');
      return;
    }
    const g = gridOf(r.tier), xg = exGridOf(r), ls = lawSumCQ(src);
    if (Math.abs(ls - r.CQ) > 0.05) {
      fail.push('1. ' + a.nm + ' compute() reads CQ ' + r.CQ.toFixed(2)
        + ' and the ruled law sum reads ' + ls.toFixed(2)
        + ': either this file feeds the engine wrong or CQ has left the ruling');
    }
    if (g !== a.grid || r.CQ.toFixed(1) !== a.cq.toFixed(1)) {
      fail.push('1. ' + a.nm + ' grid ' + g + ' at CQ ' + r.CQ.toFixed(1)
        + ', pinned grid ' + a.grid + ' at CQ ' + a.cq.toFixed(1));
    }
    if (xg !== a.exGrid || r.EX.toFixed(1) !== a.ex.toFixed(1)) {
      fail.push('1. ' + a.nm + ' exGrid ' + xg + ' at expression ' + r.EX.toFixed(1)
        + ', pinned exGrid ' + a.exGrid + ' at expression ' + a.ex.toFixed(1));
    }
  });
  if (CHARGES.length !== 9) fail.push('2. CHARGES is ' + CHARGES.length + ', not 9');
  /* an engine with no expression cannot be built into a panel at all, and a
     validator that throws on the case it exists to catch says nothing. */
  if (fail.some(f => /predates the fitted CQ model/.test(f))) return fail;

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

module.exports = { PANEL, build, validate, readField, keyOf, gridOf, exGridOf, referOf, lawSumCQ, stream, CHARGES };

if (require.main === module) {
  const fail = validate();
  if (fail.length) { fail.forEach(f => console.log('FAIL ' + f)); process.exit(1); }
  console.log('field.js: 4 validation groups pass.');
  const p = build(1000, 20260920);
  console.log('panel of ' + p.length + ', ' + new Set(p.map(x => x.charge + '/' + x.seat)).size
    + ' distinct charge and seat keys, ' + new Set(p.map(x => x.address)).size
    + ' distinct heaviest addresses.');
}
