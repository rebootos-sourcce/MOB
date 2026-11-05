/* THE COHORT. The nine ICPs at the RESEARCH-icp.md weights, times ten, so
   10,000 people: Diane 1800, Derek 1700, Marcus 1600, Angela 1500, Sofia 1400,
   James 1000, Ana 500, Gordon 350, Rosa 150. These are the nine DECISIONS.md
   names for simulation (AZ5, "against the real engine and its nine ICPs") and
   the only ICPs with engine data. Interleaved, so every shard carries every ICP.

   THE ARMS. Each is one product condition and nothing else.
     built      the build as it stands: free tier only, because
                PLAN_CHECKOUT_OPEN is false and nobody can pay.
     paid       the same people on tier one (400 patterns a month), written
                each month the way planFromServer writes it. Isolates what the
                allowance wall costs.
     norerun    nobody takes the free rerun at the wall. Bounds RERUN_TAKE.
     cost-     every friction cost times 0.75, and cost+ times 1.25. The
     cost+      sensitivity of the judgement layer, the most important caveat.
     habit      drift scaled by the Lally fragility term from tools/ritualsim.js,
                so a person with kept practice stops drifting away. The harness
                has no habituation term and a year is long enough to need one.
     nofriction every friction cost set to zero. A control, not a product: it
                shows what the drift rule alone does to a year. */
'use strict';
const { SHOWUP } = require('./model.js');
const N = 10000;
function cohort(n) {
 n = n || N;
 const tot = SHOWUP.reduce((a, s) => a + s.weight, 0);
 const counts = SHOWUP.map(s => Math.round(n * s.weight / tot));
 const out = [], left = counts.slice();
 while (out.length < n) for (let k = 0; k < SHOWUP.length && out.length < n; k++)
  if (left[k] > 0) { left[k]--; out.push(SHOWUP[k]); }
 return out;
}
const ARMS = { built: {}, paid: { paid: 'one' }, norerun: { rerunTake: 0 },
 'cost-': { costScale: 0.75 }, 'cost+': { costScale: 1.25 }, habit: { habit: true },
 nofriction: { costScale: 0 }, 'nofriction+habit': { costScale: 0, habit: true },
 /* one friction off at a time, so a cause is ranked by the people it costs and
    not by which friction happened to be heaviest on the day somebody left */
 'off-F1': { off: ['F1'] }, 'off-F4': { off: ['F4'] }, 'off-F7': { off: ['F7'] }, 'off-F12': { off: ['F12'] },
 'off-F14': { off: ['F14'] }, 'off-WALL': { off: ['WALL'] }, 'off-WANT': { off: ['WANT'] } };
module.exports = { cohort, N, ARMS };
