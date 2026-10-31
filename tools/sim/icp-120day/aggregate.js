/* ============================================================
   AGGREGATION. Reads every shard's JSONL output and produces the two
   percent-complete numbers and the ranked gap list the task asks for, from
   nothing but the rows the real run actually wrote. No number here is
   computed except by counting or averaging these rows. */

const fs = require('fs');
const path = require('path');

function readJsonl(file) {
 if (!fs.existsSync(file)) return [];
 return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

function mean(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null; }
function pct(n, d) { return d ? Math.round((n / d) * 1000) / 10 : null; }

function run(outDir, meta) {
 const files = fs.readdirSync(outDir);
 const profileFiles = files.filter((f) => /^shard-\d+-profiles\.jsonl$/.test(f));
 const gapFiles = files.filter((f) => /^shard-\d+-gaps\.jsonl$/.test(f));

 let profiles = [];
 profileFiles.forEach((f) => { profiles = profiles.concat(readJsonl(path.join(outDir, f))); });
 let gaps = [];
 gapFiles.forEach((f) => { gaps = gaps.concat(readJsonl(path.join(outDir, f))); });

 const valid = profiles.filter((p) => p.valid !== false);
 const invalid = profiles.filter((p) => p.valid === false);

 const totalDayAdvances = valid.reduce((a, p) => a + (p.framesTotal || 0), 0);
 const okDayAdvances = valid.reduce((a, p) => a + (p.framesOk || 0), 0);
 const errorDays = valid.reduce((a, p) => a + (p.daysError || 0), 0);

 /* per-ICP real stats, straight off the rows */
 const byIcp = {};
 valid.forEach((p) => {
  const b = byIcp[p.icp] = byIcp[p.icp] || {
   icp: p.icp, n: 0, currentPct: p.currentPct, targetPct: p.targetPct,
   cqStart: [], cqEnd: [], finalAcc: [], finalCov: [],
   peopleWithError: 0, peopleWithComplex: 0, peopleWithHyper: 0, peopleWithSup: 0,
   totalDays: 0, okDays: 0, errorDays: 0
  };
  b.n++;
  b.cqStart.push(p.cqAtStart); b.cqEnd.push(p.cqAtEnd);
  if (p.finalAccPct != null) b.finalAcc.push(p.finalAccPct);
  if (p.finalCovPct != null) b.finalCov.push(p.finalCovPct);
  if (p.daysError > 0) b.peopleWithError++;
  if (p.firstComplexDay != null) b.peopleWithComplex++;
  if (p.firstHyperDay != null) b.peopleWithHyper++;
  if (p.firstSupDay != null) b.peopleWithSup++;
  b.totalDays += p.framesTotal || 0;
  b.okDays += p.framesOk || 0;
  b.errorDays += p.daysError || 0;
 });

 const icpSummary = Object.keys(byIcp).sort().map((k) => {
  const b = byIcp[k];
  /* METHOD (a): a simulation-informed PROXY for Lance's own Current%
     rubric, NOT a claim to reproduce it. Built from three real measured
     reads on this ICP's cohort: the mean final accCover() coverage (how
     much of the real intake+story instrument is actually answered -- a
     completeness read), the mean final accuracy().pct (how trustworthy
     the reading is, the engine's own fitted confidence number), and the
     technical reliability of this cohort's 120 day-advances (1 - error
     rate). Weighted 40/30/30. This is explicitly an estimate derived from
     what the simulation measured for this cohort, stated as such; it is
     not, and does not claim to be, Lance's own 07_PREPRO_ROADMAP number. */
  const covMean = mean(b.finalCov);
  const accMean = mean(b.finalAcc);
  const relMean = pct(b.okDays, b.totalDays);
  const simEstimate = (covMean != null && accMean != null && relMean != null)
   ? Math.round((covMean * 0.4 + accMean * 0.3 + relMean * 0.3) * 10) / 10 : null;
  return {
   icp: k, n: b.n,
   roadmapCurrentPct: b.currentPct, roadmapTargetPct: b.targetPct,
   meanCqStart: Math.round(mean(b.cqStart) * 10) / 10,
   meanCqEnd: Math.round(mean(b.cqEnd) * 10) / 10,
   meanFinalAccuracyPct: accMean != null ? Math.round(accMean * 10) / 10 : null,
   meanFinalCoveragePct: covMean != null ? Math.round(covMean * 10) / 10 : null,
   dayAdvanceReliabilityPct: relMean,
   peoplePctWithErrorDay: pct(b.peopleWithError, b.n),
   peoplePctReachingComplex: pct(b.peopleWithComplex, b.n),
   peoplePctReachingHyperComplex: pct(b.peopleWithHyper, b.n),
   peoplePctReachingSuperComplex: pct(b.peopleWithSup, b.n),
   simEstimatePct: simEstimate
  };
 });

 /* THE RANKED GAP LIST. Grouped by (where, kind) -- the real door/record
    and the real cause -- and ranked by how many DISTINCT people hit it,
    per the task's own instruction (a gap 900 people hit in week one
    matters more than one 3 people hit on day 118). */
 const gapGroups = {};
 gaps.forEach((g) => {
  const key = g.where + '|' + g.kind;
  const grp = gapGroups[key] = gapGroups[key] || {
   where: g.where, kind: g.kind, people: new Set(), occurrences: 0,
   minDay: g.day, maxDay: g.day, sample: g
  };
  grp.people.add(g.who);
  grp.occurrences++;
  if (g.day < grp.minDay) grp.minDay = g.day;
  if (g.day > grp.maxDay) grp.maxDay = g.day;
 });
 const rankedGaps = Object.values(gapGroups).map((g) => ({
  where: g.where, kind: g.kind,
  peopleHit: g.people.size, peoplePct: pct(g.people.size, valid.length),
  occurrences: g.occurrences, firstDay: g.minDay, lastDay: g.maxDay,
  why: g.sample.why
 })).sort((a, b) => b.peopleHit - a.peopleHit);

 /* METHOD (b): THE SIMULATION-NATIVE COVERAGE NUMBER. The real, measured
    share of the 120,000 (or whatever N x days actually ran) day-advances
    that completed through the real dlyDayOpen door with no engine error
    or thrown exception. This is a clean technical-reliability read,
    computed only from counting okDayAdvances over totalDayAdvances --
    nothing modeled, nothing estimated. */
 const simNativeCoveragePct = pct(okDayAdvances, totalDayAdvances);

 /* a separate, unambiguous fact, not blended into (b): how much of the
    reached canon complex/hyper-complex content was non-shell. Every row in
    canon.json registers.complexes/hyper_complexes is a 5-field shell
    (confirmed directly, run-one.js header), so this is 0% by construction
    whenever the rung is reached at all; what the simulation adds is HOW
    OFTEN it is reached, carried in icpSummary/rankedGaps above. */
 const peopleReachingAnyComplexContent = valid.filter((p) => p.firstComplexDay != null || p.firstHyperDay != null || p.firstSupDay != null).length;

 const result = {
  meta,
  totals: {
   peopleGenerated: profiles.length, peopleValid: valid.length, peopleInvalid: invalid.length,
   totalDayAdvances, okDayAdvances, errorDays,
   simNativeCoveragePct,
   peopleReachingAnyComplexContentPct: pct(peopleReachingAnyComplexContent, valid.length),
   canonComplexContentShellPct: 100.0
  },
  icpSummary,
  rankedGaps,
  invalidProfiles: invalid
 };

 fs.writeFileSync(path.join(outDir, 'aggregate.json'), JSON.stringify(result, null, 1));
 console.log('\n===== AGGREGATE RESULT =====');
 console.log('people: ' + valid.length + ' valid, ' + invalid.length + ' invalid, of ' + profiles.length + ' generated');
 console.log('day-advances: ' + okDayAdvances + ' / ' + totalDayAdvances + ' OK (' + simNativeCoveragePct + '%)');
 console.log('wall time: ' + Math.round(meta.totalMs / 1000) + 's for shards=' + meta.shards);
 console.log('\nper-ICP:');
 icpSummary.forEach((r) => console.log(' ', JSON.stringify(r)));
 console.log('\nranked gaps (top 15):');
 rankedGaps.slice(0, 15).forEach((g) => console.log(' ', g.peopleHit + ' people (' + g.peoplePct + '%) ', g.where, g.kind, '| first day', g.firstDay));
 console.log('\nwritten to: ' + path.join(outDir, 'aggregate.json'));
 return result;
}

module.exports = { run };

if (require.main === module) {
 const outDir = process.argv[2] || path.join(__dirname, 'out');
 run(outDir, { n: null, days: null, shards: null, seed: null, totalMs: 0 });
}
