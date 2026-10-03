#!/usr/bin/env node
/* ============================================================
   VALUE FELT AFTER SESSION ONE, GATED. node tests/valuefelt.js

   The engine half of reviews/ATUNED-Creative-Storyboard-TDD.md section 49
   and section 72: engine/valuefelt.js. Headless, on private copies of the
   built engine.js, so nothing here moves the engine tests/engine.js holds.

   WHAT IT HOLDS.
     1  when it is asked: never without a release, never once answered, never
        after the window, and asked inside it. Each branch by its own reason.
     2  the writer: the measure is required, the reason and the again answer
        are optional and an answer not given is not written, every record is
        the person's own report about how it felt (source user, dimension
        affect, never effect), it names no pattern, and the result passes the
        practice boundary and the profile boundary on a round trip.
     3  refusals by name, all or nothing: a bad answer or an over long reason
        is refused, nothing is cut to fit, and the object handed in comes back
        untouched.
     4  a value report is never a graph edge: practiceTraceIntents emits
        nothing for it.

   CHECKED AGAINST KNOWN BAD COPIES FIRST, the standing rule. The same suite
   runs on copies of the engine with one rule broken each, and must fail on
   every one: the answered check removed, the window removed, the reason
   clamped instead of refused, the dimension written as effect, and the
   writer that keeps a partial write. A gate that cannot fail is not a gate.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const SRC = fs.readFileSync(path.resolve(ROOT, process.env.ENGINE || 'engine.js'), 'utf8');

function load(src) {
  const ctx = { module: { exports: {} }, console: console };
  vm.createContext(ctx);
  vm.runInContext(src, ctx, { filename: 'engine-copy.js' });
  return ctx;
}

const DAY = 864e5;
function suite(E) {
  const fails = [];
  let n = 0;
  const ok = (c, m) => { n++; if (!c) fails.push(m); };
  const T0 = '2026-10-01T09:00:00.000Z';
  const at = d => new Date(new Date(T0).getTime() + d * DAY).toISOString();
  const prof = (rel, first, practice) => ({ meter: { relLines: rel, first: first }, practice: practice || null });

  /* 1. when */
  ok(E.valueFeltDue(null).why === 'no record', 'no record is not due');
  ok(E.valueFeltDue(prof(0, T0), at(0.1)).why === 'no release yet', 'no release is not due');
  ok(E.valueFeltDue(prof(12, null), at(0.1)).why === 'no time for the first release', 'no first time is not due');
  const d1 = E.valueFeltDue(prof(12, T0), at(0.1));
  ok(d1.due === true && d1.since === T0, 'a release inside the window is due, and says since when');
  ok(E.valueFeltDue(prof(12, T0), at(E.VF_WINDOW_DAYS + 0.5)).why === 'window closed', 'after the window it is not due');
  /* a run of reframe lines alone adds to truthLines and not relLines, and it
     is still a release the person ran */
  ok(E.valueFeltDue({ meter: { relLines: 0, truthLines: 4, first: T0 }, practice: null }, at(0.1)).due === true,
    'a release of reframe lines alone is due');

  /* 2. the writer */
  const P0 = E.practiceBlank();
  const r = E.valueFeltRecord(P0, { value: 'somewhat', reason: '  It named the jaw.  ', again: 'yes' }, at(0.2));
  ok(r.ok === true, 'a full answer is kept: ' + JSON.stringify(r.errs || ''));
  if (r.ok) {
    const ev = r.P.evidence.filter(e => e.metric === E.VF_METRIC || e.metric === E.VF_AGAIN_METRIC);
    ok(ev.length === 2, 'a full answer writes the value and the again answer, ' + ev.length);
    ev.forEach(e => {
      ok(e.source === 'user' && e.dimension === 'affect', 'every record is the person reporting how it felt');
      ok(e.pattern_id === null || e.pattern_id === undefined, 'no record names a pattern');
      ok(e.context === E.VF_CONTEXT, 'every record says it follows the first release');
    });
    const v = ev.find(e => e.metric === E.VF_METRIC);
    ok(v && v.value === 'somewhat' && v.notes === 'It named the jaw.', 'the reason is kept with the value, trimmed and never cut');
    const perrs = []; E.practiceValidate(perrs, JSON.parse(JSON.stringify(r.P)));
    ok(perrs.length === 0, 'the practice boundary accepts it: ' + JSON.stringify(perrs));
    const p = E.blankProfile('Vf');
    p.practice = r.P; p.meter.relLines = 12; p.meter.first = T0;
    const rt = E.validateProfile(JSON.parse(JSON.stringify(p)));
    ok(rt.ok === true, 'the profile boundary accepts it on a round trip: ' + JSON.stringify(rt.errs || ''));
    ok(E.valueFeltDue(p, at(0.3)).why === 'answered', 'once answered it is not asked again');
    ok(E.valueFeltRead(r.P).length === 2, 'the record reads back what was answered');
    /* 4. never an edge */
    const intents = E.practiceTraceIntents(r.P) || [];
    const ids = ev.map(e => e.id);
    ok(!JSON.stringify(intents).split('"').some(s => ids.indexOf(s) >= 0), 'a value report is never a graph edge');
  }
  const r2 = E.valueFeltRecord(P0, { value: 'not_sure' }, at(0.2));
  ok(r2.ok && r2.P.evidence.filter(e => e.metric === E.VF_AGAIN_METRIC).length === 0,
    'an again answer not given is not written');
  ok(r2.ok && r2.P.evidence.find(e => e.metric === E.VF_METRIC).notes == null, 'no reason is kept as none');

  /* 3. refusals, all or nothing */
  const bad = [
    [{ value: 'great' }, 'a value outside the list'],
    [{}, 'no value'],
    [{ value: 'very', again: 'maybe' }, 'an again answer outside the list'],
    [{ value: 'very', reason: 'x'.repeat(E.VF_REASON_MAX + 1) }, 'a reason over the limit'],
    [{ value: 'very', reason: 7 }, 'a reason that is not words'],
  ];
  bad.forEach(([a, what]) => {
    const x = E.valueFeltRecord(P0, a, at(0.2));
    ok(x.ok === false && x.errs.length > 0, what + ' is refused by name');
    ok(x.P === P0 && P0.evidence.length === 0, what + ': the object handed in comes back untouched');
  });
  return { n, fails };
}

/* the copies, one rule broken each. Each replace must find its text, or the
   mutation tested nothing and the gate says so. */
const MUTANTS = [
  ['the answered check removed', "if(valueFeltRead(p.practice).length)return {due:false, why:'answered'};", ''],
  ['a release counted by its release lines only', "+(typeof m.truthLines==='number'?m.truthLines:0)", ''],
  ['the window removed', "if(t-first>VF_WINDOW_DAYS*864e5)", 'if(false)'],
  ['the reason clamped instead of refused', "if(why&&why.length>VF_REASON_MAX)\n    errs.push(", "if(why&&why.length>VF_REASON_MAX)\n    why=why.slice(0,VF_REASON_MAX); if(0)errs.push("],
  ['the dimension written as effect', "type:'internal', dimension:'affect',\n   pattern_id:null", "type:'internal', dimension:'effect',\n   pattern_id:null"],
  ['the value made optional', "if(VF_VALUE.indexOf(a.value)<0)", "if(a.value!=null&&VF_VALUE.indexOf(a.value)<0)"],
];

let PASS = 0, FAIL = 0;
const real = suite(load(SRC).valueFeltDue ? load(SRC) : (() => { throw new Error('valueFeltDue is not in the engine: is engine/valuefelt.js in MANIFEST and engine.js rebuilt?'); })());
console.log('VALUE FELT, the real engine: ' + (real.n - real.fails.length) + ' of ' + real.n);
real.fails.forEach(f => console.log('  FAIL  ' + f));
if (real.fails.length) FAIL++; else PASS++;

console.log('\nKNOWN BAD COPIES, each must fail');
MUTANTS.forEach(([name, from, to]) => {
  if (SRC.indexOf(from) < 0) { FAIL++; console.log('  FAIL  ' + name + ': the text to break was not found, so this copy tests nothing'); return; }
  let res;
  try { res = suite(load(SRC.replace(from, to))); }
  catch (e) { res = { n: 0, fails: ['threw: ' + e.message] }; }
  if (res.fails.length) { PASS++; console.log('  bites  ' + name + ', ' + res.fails.length + ' check(s) failed, first: ' + res.fails[0]); }
  else { FAIL++; console.log('  FAIL  ' + name + ': the suite passed on a broken engine'); }
});
console.log('\n' + PASS + ' passed, ' + FAIL + ' failed');
process.exit(FAIL ? 1 : 0);
