/* ============================================================
   ONE SHARD. Runs people [from, to) of the cohort and writes one JSON line per
   person. Run by main.js, one process per core. A person's random stream comes
   from the run seed and their index, so the split does not change a result.
     node sim/year/shard.js <seed> <from> <to> <out.jsonl> [arm]
   ============================================================ */
'use strict';
const fs = require('fs');
const { runPerson } = require('./person.js');
const { cohort } = require('./cohort.js');
const [seed, from, to, out, arm] = [+process.argv[2], +process.argv[3], +process.argv[4], process.argv[5], process.argv[6] || 'built'];
const ARMS = require('./cohort.js').ARMS;
const opt = Object.assign({ seed }, ARMS[arm]);
const C = cohort();
const fd = fs.openSync(out, 'w');
for (let i = from; i < to; i++) {
 const rec = runPerson(C[i], i, opt);
 rec.arm = arm; rec.seed = seed;
 fs.writeSync(fd, JSON.stringify(rec) + '\n');
}
fs.closeSync(fd);
