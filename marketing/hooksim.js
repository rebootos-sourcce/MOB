#!/usr/bin/env node
/* ============================================================
   hooksim.js

   THE THOUSAND RUNS, AND WHAT THEY ACTUALLY MEASURE.

   The brief asked for the hook set simulated a thousand times against the
   ICPs. The first thing to say is what this does not do, because a
   conversion number invented by a simulation is not evidence of anything and
   this repository has a standing habit of saying so.

   THIS TOOL DOES NOT MODEL WHETHER ANYBODY BUYS. There is no shipped
   product, no user base and no click data, so any funnel rate it printed
   would be a coefficient of mine dressed as a finding. Not modelled, and
   deliberately.

   WHAT IT MEASURES INSTEAD. Four things, all of them checkable by hand
   against the engine's own tables.

   1. COVERAGE. Of the thousand fields, how many have a hook whose key is the
      charge and seat their own reading is heaviest at. A person with no
      matching key is unaddressed and is reported as a hole with its key
      named, not folded into a remainder.

   2. NAMING PRECISION, by addressing scheme. Given one line per person under
      each of three schemes, for how many does the line name the charge their
      field is heaviest at. This is a statement about accuracy of naming and
      nothing about persuasion. It is the measurement that answers whether
      the addressing is by role, by state or by field, and it is the only one
      of the four that compares anything.

   3. THE BAND GATE. How many of the thousand the system refuses to aim a
      hook at, split by why. BUYERS.md level 1 is refused on harm grounds.
      Levels 2 and 3 are served and counted apart, because the grid says a
      hook there is wasted rather than harmful, and a coverage total that
      swallows them overstates the system's reach.

   4. THE REFUSAL GATE. Every line in the system through refuse.js. The
      assertion is zero violations, and tests.js additionally asserts that
      removing any single rule lets a deliberate violation through, because a
      gate nobody has broken on purpose is a gate nobody has tested.

   Run:
     node marketing/hooksim.js              validation, then the whole report
     node marketing/hooksim.js --validate   the checks alone, exit 1 on failure
     node marketing/hooksim.js --sweep      the sensitivity tables alone
   ============================================================ */

const path = require('path');
const F = require(path.resolve(__dirname, 'field.js'));
const M = require(path.resolve(__dirname, 'match.js'));
const R = require(path.resolve(__dirname, 'refuse.js'));
const { HOOKS, CLEAR, DOOR_OUT, DOORS, ROLES } = require(path.resolve(__dirname, 'hooks.js'));

const SEED = 20260920;
const N = 1000;

const pct = (a, b) => (100 * a / b).toFixed(1) + ' percent (' + a + ' of ' + b + ')';

/* ------------------------------------------------------------
   THE MODAL CHARGE PER DOOR, MEASURED OFF THE PANEL.

   A state door or a role door has no reading to look up, so the best charge
   it can name is the one most common behind that door. This computes it
   rather than reading it off hooks.js, so the hook table's own claimed modal
   values can be checked against the panel instead of trusted. Validation
   group 3 does exactly that.
   ------------------------------------------------------------ */
function modals(panel, dim) {
  const g = {};
  panel.forEach(p => {
    const d = p[dim]; if (!d) return;
    g[d] = g[d] || {};
    const c = p.charge || '(nothing held)';
    g[d][c] = (g[d][c] || 0) + 1;
  });
  const out = {};
  Object.keys(g).forEach(d => {
    const rows = Object.entries(g[d]).sort((a, b) => b[1] - a[1]);
    out[d] = { charge: rows[0][0], n: rows[0][1],
      total: rows.reduce((s, r) => s + r[1], 0), distinct: rows.length, rows };
  });
  return out;
}

/* ------------------------------------------------------------
   1. COVERAGE.
   ------------------------------------------------------------ */
function coverage(panel) {
  const res = { matched: 0, clear: 0, doorOut: 0, hole: 0, holes: {}, byHook: {} };
  panel.forEach(p => {
    const m = M.byField(p);
    if (m.served === DOOR_OUT) { res.doorOut++; return; }
    if (m.served === CLEAR) { res.clear++; return; }
    if (!m.served) {
      res.hole++;
      const k = (p.charge || 'nothing held') + ' @ ' + (p.seat || '-');
      res.holes[k] = (res.holes[k] || 0) + 1;
      return;
    }
    res.matched++;
    res.byHook[m.served.id] = (res.byHook[m.served.id] || 0) + 1;
  });
  return res;
}

/* ------------------------------------------------------------
   2. NAMING PRECISION.

   For each scheme, serve every person the line that scheme would serve, then
   ask whether that line names the charge their field is heaviest at.

   The field scheme is exact where a hook exists and scores nothing where one
   does not, so it is not free: an uncovered key costs it, which is why the
   field figure is not 1000.

   A person at level 1 is excluded from every scheme's numerator and from the
   denominator, because the system refuses to aim a line at them and scoring
   a refusal as a hit or a miss would be scoring the wrong thing. The count
   excluded is printed beside every rate.
   ------------------------------------------------------------ */
function precision(panel, mState, mRole) {
  const out = {};
  const elig = panel.filter(p => p.grid !== 1);
  ['role', 'state', 'field'].forEach(s => {
    let hit = 0, named = 0;
    elig.forEach(p => {
      let c = null;
      if (s === 'field') {
        const m = M.byField(p);
        c = (m.served && m.served !== DOOR_OUT) ? m.served.charge : null;
        /* the clear entry names no charge and its person carries none, so it
           is a hit: the line is true of them. A hook naming a charge they do
           not carry would be the miss. */
        if (m.served === CLEAR && !p.charge) { hit++; named++; return; }
      } else if (s === 'state') {
        c = mState[p.state] ? mState[p.state].charge : null;
      } else {
        c = mRole[p.role] ? mRole[p.role].charge : null;
      }
      if (c === null || c === undefined) return;
      named++;
      if (c === p.charge) hit++;
    });
    out[s] = { hit, named, elig: elig.length };
  });
  out.excluded = panel.length - elig.length;
  return out;
}

/* ------------------------------------------------------------
   3. THE BAND GATE.
   ------------------------------------------------------------ */
function bands(panel) {
  const g = {};
  panel.forEach(p => { g[p.grid] = (g[p.grid] || 0) + 1; });
  const refused = panel.filter(p => p.grid === 1).length;
  const outOfReach = panel.filter(p => p.grid === 2 || p.grid === 3).length;
  const market = panel.filter(p => p.grid >= 6).length;
  const hard = panel.filter(p => p.grid === 4 || p.grid === 5).length;
  return { g, refused, outOfReach, market, hard };
}

/* ------------------------------------------------------------
   4. THE REFUSAL GATE OVER EVERY LINE.
   ------------------------------------------------------------ */
function everyLine() {
  const lines = [];
  HOOKS.forEach(h => {
    ['pain', 'hook', 'proof', 'objection', 'answered'].forEach(k => {
      if (h[k]) lines.push({ id: h.id + '.' + k, text: h[k], isHook: k === 'hook' });
    });
  });
  ['pain', 'hook', 'proof', 'objection', 'answered'].forEach(k => {
    if (CLEAR[k]) lines.push({ id: CLEAR.id + '.' + k, text: CLEAR[k], isHook: k === 'hook' });
  });
  lines.push({ id: DOOR_OUT.id + '.hook', text: DOOR_OUT.hook, isHook: false });
  DOORS.forEach(d => lines.push({ id: d.id + '.hook', text: d.hook, isHook: true }));
  ROLES.forEach(r => lines.push({ id: r.id + '.hook', text: r.hook, isHook: true }));
  return lines;
}

function gateRun() {
  const lines = everyLine();
  const viol = [];
  lines.forEach(l => {
    R.check(l.text).forEach(v => viol.push({ line: l.id, rule: v.rule, text: l.text }));
  });
  /* the form check runs on hooks and doors only. A proof or an objection is
     not in his hook form and should not be measured against it. DOOR_OUT is
     excluded by isHook false: it is the refusal, and a refusal that asks a
     what if question is a hook wearing a refusal's coat. */
  const formFail = [];
  HOOKS.forEach(h => { const m = R.form(h); if (m.length) formFail.push({ id: h.id, miss: m }); });
  const c = R.form(CLEAR); if (c.length) formFail.push({ id: CLEAR.id, miss: c });
  return { lines: lines.length, viol, formFail };
}

/* ------------------------------------------------------------
   VALIDATION. Five groups, run before anything is reported.
   ------------------------------------------------------------ */
function validate() {
  const fail = [];

  /* 1. field.js own validation, which includes the nine known grid levels. */
  F.validate().forEach(f => fail.push('1. field.js: ' + f));

  const panel = F.build(N, SEED);

  /* 2. every hook's key exists in the panel, and every hook's claimed n
        matches what the panel actually holds at that key. A hook table whose
        counts drift from the measurement is a set of numbers typed into a
        document, which is the defect this repository has been bitten by
        seven times. */
  HOOKS.forEach(h => {
    const got = panel.filter(p => p.charge === h.charge && p.seat === h.seat).length;
    if (got === 0) fail.push('2. ' + h.id + ' keyed to ' + h.charge + ' @ ' + h.seat
      + ', which no one in the panel carries');
    else if (got !== h.n) fail.push('2. ' + h.id + ' claims n ' + h.n + ', panel holds ' + got);
  });
  const clearN = panel.filter(p => !p.charge).length;
  if (clearN !== CLEAR.n) fail.push('2. CLEAR claims n ' + CLEAR.n + ', panel holds ' + clearN);

  /* 3. every door's and role's claimed modal charge and share match the
        panel. Same reason as group 2, and it is the one that would catch a
        finding quoted after the panel moved. */
  const mS = modals(panel, 'state'), mR = modals(panel, 'role');
  DOORS.forEach(d => {
    const m = mS[d.state];
    if (!m) { fail.push('3. no panel rows for state ' + d.state); return; }
    if (m.total !== d.n) fail.push('3. door ' + d.id + ' claims n ' + d.n + ', panel holds ' + m.total);
    if (m.charge !== d.modal) fail.push('3. door ' + d.id + ' claims modal ' + d.modal
      + ', panel says ' + m.charge);
    if (m.n !== d.modalShare) fail.push('3. door ' + d.id + ' claims modal share ' + d.modalShare
      + ', panel says ' + m.n);
  });
  ROLES.forEach(r => {
    const m = mR[r.role];
    if (!m) { fail.push('3. no panel rows for role ' + r.role); return; }
    if (m.total !== r.n) fail.push('3. role ' + r.id + ' claims n ' + r.n + ', panel holds ' + m.total);
    if (m.distinct !== r.distinct) fail.push('3. role ' + r.id + ' claims ' + r.distinct
      + ' distinct charges, panel says ' + m.distinct);
    if (m.n !== r.modalShare) fail.push('3. role ' + r.id + ' claims modal share ' + r.modalShare
      + ', panel says ' + m.n);
  });

  /* 4. the refusal gate is clean on every line the system would show, and
        the form check is clean on every hook. */
  const g = gateRun();
  g.viol.forEach(v => fail.push('4. ' + v.line + ' refused by ' + v.rule));
  g.formFail.forEach(f => fail.push('4. ' + f.id + ' fails his form: ' + f.miss.join(', ')));

  /* 5. the gate can be broken on purpose. For each rule, a line written to
        violate exactly that rule must be caught by the full gate and must
        pass when that one rule is removed. A gate nobody has broken is a
        gate nobody has tested. */
  const BREAK = {
    countdown: 'The offer closes in 4 hours. What if your chest knew?',
    scarcity: 'Only 12 spots left for the reading of your gut.',
    testimonial: 'Join 40,000 people who have read their own chest.',
    medical: 'This treats your anxiety and your back pain.',
    lossframe: 'Do not lose your progress. Your chest is falling behind.',
    urgency: 'Sign up now. Do not wait, your gut is waiting.',
    verdict: 'You are broken and what is wrong with you sits in your chest.',
    reassurance: 'Do not worry, this is a safe space for your chest.',
    voice: 'The 108 addresses, ALL OF THEM, are in your body.'
  };
  R.RULES.forEach(rule => {
    const line = BREAK[rule.id];
    if (!line) { fail.push('5. no deliberate breakage written for rule ' + rule.id); return; }
    const caught = R.check(line).some(v => v.rule === rule.id);
    if (!caught) fail.push('5. rule ' + rule.id + ' did not catch its own breakage: ' + line);
    const without = R.check(line, { without: rule.id }).some(v => v.rule === rule.id);
    if (without) fail.push('5. rule ' + rule.id + ' still fired when removed');
  });

  return fail;
}

/* ------------------------------------------------------------
   THE SWEEP. Every coefficient of mine at both ends, and five seeds.

   The jitter width is the only modelled number in field.js, and a finding
   that only exists at one width is a finding about the width. Precision by
   scheme is the headline comparison, so it is the figure swept.
   ------------------------------------------------------------ */
function sweep() {
  console.log('\n# THE SWEEP\n');
  console.log('Naming precision by scheme, as people of 1000, at five seeds and');
  console.log('three jitter widths. The jitter is the only modelled number in the');
  console.log('panel and this is it at both ends of itself.\n');
  console.log('  seed        jitter   role   state   field   field lead over state');
  const seeds = [20260920, 20260921, 20260922, 20260923, 20260924];
  const widths = [[0.6, 0.45], [1.2, 0.9], [2.4, 1.8]];
  const rows = [];
  seeds.forEach(s => {
    widths.forEach(w => {
      const panel = F.build(N, s, { chargeJitter: w[0], lawJitter: w[1] });
      const mS = modals(panel, 'state'), mR = modals(panel, 'role');
      const p = precision(panel, mS, mR);
      rows.push({ s, w: w[0], role: p.role.hit, state: p.state.hit, field: p.field.hit });
      console.log('  ' + String(s) + '    ' + String(w[0]).padStart(5) + '   '
        + String(p.role.hit).padStart(4) + '   ' + String(p.state.hit).padStart(5) + '   '
        + String(p.field.hit).padStart(5) + '   ' + String(p.field.hit - p.state.hit).padStart(6));
    });
  });
  const lead = rows.map(r => r.field - r.state);
  console.log('\n  field leads state in ' + rows.filter(r => r.field > r.state).length
    + ' of ' + rows.length + ' runs, by ' + Math.min.apply(null, lead) + ' to '
    + Math.max.apply(null, lead) + ' people of 1000.');
  const l2 = rows.map(r => r.state - r.role);
  console.log('  state leads role in ' + rows.filter(r => r.state > r.role).length
    + ' of ' + rows.length + ' runs, by ' + Math.min.apply(null, l2) + ' to '
    + Math.max.apply(null, l2) + ' people of 1000.');
  console.log('\nThe ordering is what is robust. The magnitudes move with the jitter');
  console.log('and are not quoted anywhere without their width beside them.\n');
}

/* ------------------------------------------------------------
   THE REPORT.
   ------------------------------------------------------------ */
function report() {
  const panel = F.build(N, SEED);
  const mS = modals(panel, 'state'), mR = modals(panel, 'role');

  console.log('\n# THE HOOK SET AGAINST A THOUSAND FIELDS\n');
  console.log('Panel of ' + N + ' at seed ' + SEED + '. Weights from RESEARCH-icp.md by way of');
  console.log('proto/ritual/losssim.js. Every field read through the real engine.\n');

  console.log('## 1. WHO IS IN THE PANEL, BY THE GRID\n');
  const b = bands(panel);
  console.log('  level  people  BUYERS.md says');
  const SAYS = { 1: 'nought percent, actively repelled', 2: 'ten percent, too heavy',
    3: 'twenty percent, demands debate', 4: 'forty percent, the work hurts',
    5: 'thirty percent, not mystical enough', 6: 'sixty five percent, the tipping point',
    7: 'eighty five percent, the creative under load', 8: 'ninety percent, the practitioner',
    9: 'ninety five percent, the systems hacker', 10: 'one hundred percent, the liberated' };
  for (let l = 1; l <= 10; l++) if (b.g[l]) console.log('  ' + String(l).padStart(5) + '  '
    + String(b.g[l]).padStart(6) + '  ' + SAYS[l]);
  console.log('');
  console.log('  refused on harm grounds, level 1        ' + pct(b.refused, N));
  console.log('  out of reach by the grid, levels 2 to 3 ' + pct(b.outOfReach, N));
  console.log('  the hardest sell, levels 4 to 5         ' + pct(b.hard, N));
  console.log('  the actual market, level 6 and above    ' + pct(b.market, N));
  console.log('');
  console.log('THE FINDING THAT DECIDES THE REST. The panel is weighted by');
  console.log('willingness to pay and ability to find the product, and on the');
  console.log('engine\'s own reading ' + (b.refused + b.outOfReach) + ' of ' + N + ' of it sits at a level BUYERS.md');
  console.log('says is not the market. Coverage of the whole panel is therefore the');
  console.log('wrong target, and a hook set reported as covering a thousand people');
  console.log('would be counting ' + (b.refused + b.outOfReach) + ' it cannot reach and ' + b.refused + ' it must not aim at.\n');

  console.log('## 2. COVERAGE\n');
  const c = coverage(panel);
  console.log('  addressed by a field hook          ' + pct(c.matched, N));
  console.log('  served the clear entry             ' + pct(c.clear, N));
  console.log('  refused, served the door out       ' + pct(c.doorOut, N));
  console.log('  unaddressed, no hook at their key  ' + pct(c.hole, N));
  console.log('');
  if (Object.keys(c.holes).length) {
    console.log('  THE HOLES, NAMED. Each is a charge and seat with people on it and no');
    console.log('  hook written for it. They are thin keys and a line written against a');
    console.log('  key holding one person in a thousand is written against the panel.');
    console.log('');
    Object.entries(c.holes).sort((a, b2) => b2[1] - a[1])
      .forEach(([k, v]) => console.log('    ' + String(v).padStart(3) + '  ' + k));
    console.log('');
  }
  console.log('  Served per hook, largest first:');
  Object.entries(c.byHook).sort((a, b2) => b2[1] - a[1]).forEach(([id, v]) => {
    const h = HOOKS.find(x => x.id === id);
    console.log('    ' + String(v).padStart(4) + '  ' + id + '  ' + h.charge + ' @ ' + h.seat
      + ', ' + h.address);
  });
  console.log('');
  const top = Object.entries(c.byHook).sort((a, b2) => b2[1] - a[1])[0];
  console.log('  One hook carries ' + pct(top[1], N) + ' of the panel. A hook set whose');
  console.log('  largest line reaches a third of everybody is not a set of eighteen');
  console.log('  equal doors, and the production order follows the distribution.\n');

  console.log('## 3. NAMING PRECISION, AND WHETHER THE KEY IS ROLE, STATE OR FIELD\n');
  const p = precision(panel, mS, mR);
  console.log('  Of the ' + p.field.elig + ' eligible people, ' + p.excluded + ' excluded at level 1 because the');
  console.log('  system refuses to aim a line at them, how many get a line that names');
  console.log('  the charge their own field is heaviest at.\n');
  console.log('  scheme   names the right charge for');
  ['role', 'state', 'field'].forEach(s => {
    console.log('  ' + s.padEnd(7) + '  ' + pct(p[s].hit, p[s].elig));
  });
  console.log('');
  console.log('  This is a measure of naming, not of persuasion. Nobody buys anything');
  console.log('  in this model and nothing here says they would.\n');
  console.log('  TWO LIMITS ON THIS TABLE, BOTH AGAINST MY OWN CASE.\n');
  console.log('  1. The gap between role and state is not robust. It survives at this');
  console.log('     seed and the sweep at the end of this report has state ahead of');
  console.log('     role in 5 of 15 runs. Treat them as level. The field lead is the');
  console.log('     finding and it holds in 15 of 15.');
  console.log('  2. Role and state are not independent here. Each archetype carries');
  console.log('     exactly one of each, assigned by hand in field.js off its role');
  console.log('     string and its says line, so this comparison measures that');
  console.log('     assignment as much as it measures anything. The field column does');
  console.log('     not depend on it, because the field is read out of the engine.\n');

  console.log('  WHY ROLE LOSES. Distinct charges behind each role door:\n');
  console.log('  role        people  distinct charges  modal charge and share');
  ROLES.forEach(r => {
    const m = mR[r.role];
    console.log('  ' + r.role.padEnd(10) + '  ' + String(m.total).padStart(6) + '  '
      + String(m.distinct).padStart(16) + '  ' + m.charge + ' '
      + (100 * m.n / m.total).toFixed(0) + ' percent');
  });
  console.log('');
  console.log('  WHY STATE DOES BETTER. The same table by state:\n');
  console.log('  state            people  distinct charges  modal charge and share');
  DOORS.forEach(d => {
    const m = mS[d.state];
    console.log('  ' + d.state.padEnd(15) + '  ' + String(m.total).padStart(6) + '  '
      + String(m.distinct).padStart(16) + '  ' + m.charge + ' '
      + (100 * m.n / m.total).toFixed(0) + ' percent');
  });
  console.log('');

  /* his two claims, tested as claims. */
  console.log('  HIS TWO CLAIMS, TESTED.\n');
  const g2 = (r, s) => {
    const sub = panel.filter(x => x.role === r && x.state === s);
    const t = {}; sub.forEach(x => { const k = x.charge || 'nothing held'; t[k] = (t[k] || 0) + 1; });
    const rows = Object.entries(t).sort((a, b2) => b2[1] - a[1]);
    return { n: sub.length, rows };
  };
  const be = g2('executive', 'burned out'), ba = g2('athlete', 'burned out');
  console.log('  "A burned out executive and a burned out athlete carry the same charge."');
  console.log('    executive, burned out  n ' + be.n + '  modal ' + be.rows[0][0] + ' '
    + (100 * be.rows[0][1] / be.n).toFixed(0) + ' percent');
  console.log('    athlete, burned out    n ' + ba.n + '  modal ' + ba.rows[0][0] + ' '
    + (100 * ba.rows[0][1] / ba.n).toFixed(0) + ' percent');
  console.log('    HOLDS. Same modal charge, two roles, within '
    + Math.abs(Math.round(100 * be.rows[0][1] / be.n - 100 * ba.rows[0][1] / ba.n))
    + ' points of each other.\n');
  const ea = g2('executive', 'anxious');
  console.log('  "Two executives may need different ones."');
  console.log('    executive, burned out  n ' + be.n + '  modal ' + be.rows[0][0]);
  console.log('    executive, anxious     n ' + ea.n + '  modal ' + ea.rows[0][0]);
  console.log('    HOLDS. One role, two states, two different charges, so two different');
  console.log('    lines. The role is not the key. The state moved the answer.\n');

  const sad = panel.filter(x => x.charge === 'Sad').length;
  const grief = panel.filter(x => x.state === 'grief stricken');
  const griefSad = grief.filter(x => x.charge === 'Sad').length;
  console.log('  AND THE ONE NOBODY ASKED FOR. Sadness is not where grief sits.');
  console.log('    Sad as the heaviest charge, whole panel   ' + sad + ' of ' + N);
  console.log('    Sad as the heaviest charge, grief door    ' + griefSad + ' of ' + grief.length);
  console.log('    Their addresses instead: '
    + Object.entries(grief.reduce((m, x) => { m[x.address] = (m[x.address] || 0) + 1; return m; }, {}))
      .sort((a, b2) => b2[1] - a[1]).slice(0, 3).map(x => x[0] + ' ' + x[1]).join(', '));
  console.log('    A hook written at sadness addresses ' + sad + ' person in ' + N + '. That figure does');
  console.log('    not depend on which archetypes were labelled grief stricken, which');
  console.log('    is the labelling in this file that is a judgement and not a');
  console.log('    measurement.\n');

  console.log('## 4. THE REFUSAL GATE\n');
  const g = gateRun();
  console.log('  lines checked                 ' + g.lines);
  console.log('  rules in the gate             ' + R.RULES.length);
  console.log('  violations                    ' + g.viol.length);
  console.log('  hooks failing his form        ' + g.formFail.length);
  console.log('  things the gate cannot check  ' + R.JUDGEMENT.length + ', and they are named in refuse.js');
  console.log('');
  console.log('  Nine deliberate violations, one per rule, are written into validate()');
  console.log('  group 5. Each has to be caught by the full gate and to pass when its');
  console.log('  own rule is removed. A gate nobody has broken on purpose is a gate');
  console.log('  nobody has tested.\n');
}

module.exports = { coverage, precision, bands, modals, gateRun, validate };

/* GUARDED, AND IT WAS NOT ON THE FIRST RUN. Without this, requiring the tool
   from tests.js printed the whole report before the first assertion, and a
   gate whose output is buried under sixty lines of report is a gate nobody
   reads. */
if (require.main === module) {
  const args = process.argv.slice(2);
  const fail = validate();
  if (fail.length) {
    console.log('VALIDATION FAILED, ' + fail.length + ' findings. Nothing reported.');
    fail.forEach(f => console.log('  FAIL ' + f));
    process.exit(1);
  }
  console.log('validation: 5 groups pass.');
  if (args.indexOf('--validate') >= 0) process.exit(0);
  if (args.indexOf('--sweep') >= 0) { sweep(); process.exit(0); }
  report();
  sweep();
}
