/* ============================================================
   ONE SHARD OF THE RUN. A separate OS process so the engine's own
   module-scoped state (S, W, PROFILES, CURP -- all real, all confirmed by
   direct read of atuned_src/engine/*.js) never crosses between profiles
   run in parallel. Each process requires its own copy of engine.js (the
   real build, 24447 lines, the one tests/daily.js itself requires by
   default) and regenerates the full 1000-profile cohort deterministically
   (same seed every shard), then only RUNS the slice assigned to it
   (globalIndex % shardCount === shardIndex). Regenerating is cheap
   (~12-13s for 1000, measured) next to running 120 days of a profile
   (~1s), so this is simpler and more honest than serializing live engine
   objects across a process boundary, and it keeps every shard's RNG
   stream identical to a single-process run of the same seed.

   Writes two JSONL files per shard into outDir:
     shard-<i>-profiles.jsonl   one summary row per person simulated
     shard-<i>-gaps.jsonl       one row per gap logged, who/when/what/why
   and prints progress to stderr every 25 people. */

const fs = require('fs');
const path = require('path');

const [, , shardIdxArg, shardCountArg, nArg, seedArg, daysArg, outDirArg] = process.argv;
const shardIdx = parseInt(shardIdxArg, 10);
const shardCount = parseInt(shardCountArg, 10);
const N = parseInt(nArg, 10);
const SEED = parseInt(seedArg, 10);
const DAYS = parseInt(daysArg, 10);
const OUT = outDirArg;

const ENGINE_PATH = path.resolve(__dirname, '../../../engine.js');
const E = require(ENGINE_PATH);
const store = {};
E.bindStore((k) => (k in store ? store[k] : null), (k, v) => { store[k] = v; return true; });

const { generateAll } = require('./generate.js');
const { runOne } = require('./run-one.js');
const { ICPS } = require('./icps.js');
const icpById = {}; ICPS.forEach((i) => { icpById[i.id] = i; });

const t0 = Date.now();
const { profiles } = generateAll(E, N, SEED);

const profOut = fs.createWriteStream(path.join(OUT, 'shard-' + shardIdx + '-profiles.jsonl'));
const gapOut = fs.createWriteStream(path.join(OUT, 'shard-' + shardIdx + '-gaps.jsonl'));

let mine = 0, done = 0;
for (let i = 0; i < profiles.length; i++) {
 if (i % shardCount !== shardIdx) continue;
 mine++;
 const rec = profiles[i];
 if (!rec.valid) {
  profOut.write(JSON.stringify({ name: rec.name, icp: rec.icp, valid: false, errs: rec.errs }) + '\n');
  done++;
  continue;
 }
 const icp = icpById[rec.icp];
 const res = runOne(E, Object.assign({}, rec, { keyNeed: icp.keyNeed, kill: icp.kill, currentPct: icp.currentPct, targetPct: icp.targetPct }), DAYS, { journal: icp.journal });
 const { gaps, ...summary } = res;
 summary.currentPct = icp.currentPct;
 summary.targetPct = icp.targetPct;
 profOut.write(JSON.stringify(summary) + '\n');
 gaps.forEach((g) => gapOut.write(JSON.stringify(g) + '\n'));
 done++;
 if (done % 25 === 0) {
  process.stderr.write('[shard ' + shardIdx + '] ' + done + '/' + mine + ' done, ' +
   Math.round((Date.now() - t0) / 1000) + 's elapsed\n');
 }
}
profOut.end();
gapOut.end();
process.stderr.write('[shard ' + shardIdx + '] COMPLETE: ' + done + ' people, ' +
 Math.round((Date.now() - t0) / 1000) + 's total\n');
