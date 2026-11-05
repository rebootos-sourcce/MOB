#!/usr/bin/env node
/* ============================================================
   THE YEAR. 10,000 people, 365 days, through the shipped engine.

     node sim/year/main.js                    every arm, five seeds
     node sim/year/main.js built 20261105     one arm, one seed

   Each (arm, seed) is split into one shard per core and the shards run as
   separate processes, in parallel. Output under sim/year/out/:
     <arm>-<seed>.jsonl   one line per person, the whole record
   aggregate.js reads them. check.js must pass first, and this refuses to run
   when it does not.
   ============================================================ */
'use strict';
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const { N, ARMS } = require('./cohort.js');
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const SEEDS = [20261105, 20261106, 20261107, 20261108, 20261109];
const arms = process.argv[2] ? [process.argv[2]] : Object.keys(ARMS);
const seeds = process.argv[3] ? [+process.argv[3]] : SEEDS.slice(0, +(process.env.SEEDS || 5));
const CORES = Math.max(1, os.cpus().length);
const ENV = Object.assign({}, process.env, { TZ: 'America/New_York' });
try { execFileSync(process.execPath, [path.join(__dirname, 'check.js')], { stdio: 'inherit', env: ENV }); }
catch (e) { console.error('check.js failed. The year is not run on a harness that fails its own checks.'); process.exit(2); }
function runOne(arm, seed) {
 const per = Math.ceil(N / CORES), kids = [];
 for (let c = 0; c < CORES; c++) {
  const from = c * per, to = Math.min(N, from + per); if (from >= to) continue;
  const f = path.join(OUT, `${arm}-${seed}.part${c}`);
  kids.push(new Promise((res, rej) => {
   const k = spawn(process.execPath, [path.join(__dirname, 'shard.js'), seed, from, to, f, arm], { stdio: 'inherit', env: ENV });
   k.on('exit', code => code === 0 ? res(f) : rej(new Error(`shard ${c} of ${arm}-${seed} exited ${code}`)));
  }));
 }
 return Promise.all(kids).then(files => {
  const dst = path.join(OUT, `${arm}-${seed}.jsonl`);
  fs.writeFileSync(dst, files.map(f => fs.readFileSync(f, 'utf8')).join(''));
  files.forEach(f => fs.unlinkSync(f));
  const n = fs.readFileSync(dst, 'utf8').trim().split('\n').length;
  if (n !== N) throw new Error(`${dst} holds ${n} people, not ${N}`);
  return dst;
 });
}
(async () => {
 for (const arm of arms) for (const seed of seeds) {
  const t = Date.now(); const f = await runOne(arm, seed);
  console.log(`${arm} ${seed}: ${N} people in ${((Date.now() - t) / 1000).toFixed(1)} s -> ${path.relative(process.cwd(), f)}`);
 }
})().catch(e => { console.error(e.message); process.exit(1); });
