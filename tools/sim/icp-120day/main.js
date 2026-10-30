/* ============================================================
   THE ORCHESTRATOR. Spawns one worker process per CPU (measured on this
   machine: 4), each running its own real engine.js and a slice of the
   1000-profile x 120-day run (worker.js), then aggregates their JSONL
   output into one real, measured result: tools/sim/icp-120day/out/aggregate.json.

   Usage: node main.js [n] [days] [shards] [seed]
   Defaults: n=1000 days=120 shards=<cpu count> seed=20261030 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const N = parseInt(process.argv[2] || '1000', 10);
const DAYS = parseInt(process.argv[3] || '120', 10);
const SHARDS = parseInt(process.argv[4] || String(os.cpus().length), 10);
const SEED = parseInt(process.argv[5] || '20261030', 10);

const OUT = path.resolve(__dirname, 'out');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
// clear any previous run's shard files so aggregation never mixes runs
fs.readdirSync(OUT).forEach((f) => { if (/^shard-\d+-/.test(f)) fs.unlinkSync(path.join(OUT, f)); });

console.log('ICP 120-day simulation: N=' + N + ' days=' + DAYS + ' shards=' + SHARDS + ' seed=' + SEED);
console.log('output dir: ' + OUT);

const t0 = Date.now();
let remaining = SHARDS;
const exitCodes = [];

for (let s = 0; s < SHARDS; s++) {
 const args = [path.join(__dirname, 'worker.js'), String(s), String(SHARDS), String(N), String(SEED), String(DAYS), OUT];
 const child = spawn(process.execPath, args, { stdio: ['ignore', 'inherit', 'inherit'] });
 child.on('exit', (code) => {
  exitCodes.push({ shard: s, code });
  remaining--;
  if (remaining === 0) finish();
 });
}

function finish() {
 const totalMs = Date.now() - t0;
 console.log('\nAll shards finished in ' + Math.round(totalMs / 1000) + 's. Exit codes: ' + JSON.stringify(exitCodes));
 const bad = exitCodes.filter((e) => e.code !== 0);
 if (bad.length) {
  console.error('ONE OR MORE SHARDS FAILED: ' + JSON.stringify(bad) + '. Not aggregating a partial/broken run as if it were complete.');
  process.exit(1);
 }
 require('./aggregate.js').run(OUT, { n: N, days: DAYS, shards: SHARDS, seed: SEED, totalMs });
}
