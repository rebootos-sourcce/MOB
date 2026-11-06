/* ============================================================
   THE SYNTHETIC PROFILE GENERATOR.

   Produces N profiles (default 1000), split across the 7 real ICPs from
   icps.js. Distribution: even split, ~143 each (1000/7 = 142.86 -- six
   ICPs get 143, one gets 142, chosen deterministically by index so a given
   N always splits the same way). Nothing in the Drive ICP doc suggests any
   other weighting (no stated market-size or priority ordering among the
   7), so even split is the plain, defensible default, stated here rather
   than assumed silently.

   EVERY PROFILE GOES THROUGH THE REAL CONTRACT. blankProfile() builds the
   shell, seedApply() writes the MBTI charge bias (seed.js, SEED16, a real
   engine mechanism), iqAnswer()/iqApply() write 63 real intake answers that
   produce the 21 real law scores (intake.js), and validateProfile() is run
   on every profile before it is accepted into the run -- a profile that
   fails validation is a generator defect, not a shrug.

   WHAT VARIES, PER PROFILE, WITHIN ITS ICP:
     - MBTI type: drawn from the ICP's own 4-type pool (icps.js), not fixed.
     - 63 intake answers: each of the 21 laws' left/right/neutral triad is
       drawn around the ICP's Current% (07_PREPRO_ROADMAP) as a 0-10 mean,
       nudged for the ICP's own bias laws (its Kill condition's laws, down;
       its Trigger's laws, up where named), with real per-triad spread so
       the engine's own reliable/unreliable read (iqScore) varies person to
       person, not just law to law.
     - sex at birth: alternated so the cohort is not single-sex.
     - who.first/last: a small deterministic name pool per ICP so people are
       distinguishable in the gap log, not meaningfully modeled demography. */

const path = require('path');
const { ICPS, MBTI_ALL } = require('./icps');

const FIRST_POOL = ['Alex','Jordan','Casey','Morgan','Taylor','Jamie','Riley','Sam',
 'Avery','Quinn','Drew','Reese','Rowan','Skyler','Dakota','Hayden','Elliot','Finley',
 'Sage','Wren','Harper','Kai','Noa','Remy','Tatum','Shay','Marlowe','Blair'];
const LAST_POOL = ['Rivera','Chen','Okafor','Novak','Patel','Rossi','Kim','Haddad',
 'Larsen','Mbeki','Flores','Tanaka','Weiss','Castro','Dubois','Ibarra','Sato','Nowak',
 'Romero','Hale','Fischer','Osei','Delgado','Varga','Ekstrom','Mora','Lindqvist','Santos'];

/* mulberry32 PRNG, seeded, so a run is reproducible for debugging without
   needing crypto-grade randomness for synthetic trait variation. */
function makeRng(seed) {
 let a = seed >>> 0;
 return function () {
  a |= 0; a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
 };
}
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length) % arr.length]; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function round1(v) { return Math.round(v * 10) / 10; }

/* assign 1000 across 7 ICPs, even split, remainder to the first ICPs by
   index so the split is deterministic and stated, not silent */
function icpCounts(n, icps) {
 const base = Math.floor(n / icps.length);
 const rem = n - base * icps.length;
 return icps.map((icp, i) => ({ icp, count: base + (i < rem ? 1 : 0) }));
}

/* one profile's 63 intake answers (0-62), biased by the ICP and jittered
   per profile, then applied through the real iqAnswer/iqApply door. */
function applyIntake(E, p, icp, rng) {
 const SI = E.SINAMES; // 21 law names, in the real engine's own order
 const baseMean = icp.currentPct / 10; // 0-10 scale, Current% from Drive
 for (let li = 0; li < SI.length; li++) {
  const law = SI[li];
  let mean = baseMean + (rng() - 0.5) * 2.0; // +/-1.0 person-level jitter
  if (icp.lawBiasDown.indexOf(law) >= 0) mean -= 1.8 + rng() * 1.2; // 1.8-3.0 down
  if (icp.lawBiasUp.indexOf(law) >= 0) mean += 1.2 + rng() * 1.0; // 1.2-2.2 up
  mean = clamp(mean, 0.5, 9.5);
  const spread = 1.5 + rng() * 3.5; // 1.5-5.0, so some laws read reliable, some don't
  const left = clamp(round1(mean + (rng() - 0.5) * spread), 0, 10);
  const right = clamp(round1(mean + (rng() - 0.5) * spread), 0, 10);
  const neutral = clamp(round1(mean), 0, 10);
  const base = li * 3;
  E.iqAnswer(p, base, left);
  E.iqAnswer(p, base + 1, right);
  E.iqAnswer(p, base + 2, neutral);
 }
 return E.iqApply(p);
}

/* one full profile, built and validated. Returns {profile, meta, errs}. */
function buildOne(E, icp, idx, rng) {
 const first = pick(rng, FIRST_POOL), last = pick(rng, LAST_POOL);
 const name = first + ' ' + last + ' (' + icp.name + ' #' + idx + ')';
 const mbti = pick(rng, icp.mbtiPool);
 const sex = (idx % 2 === 0) ? 'female' : 'male';

 /* pNew(), not blankProfile(): dlyDayOpen refuses a profile that is not in
    the engine's own module-scoped PROFILES list ("NotARecord", schema.js),
    and pNew is the real door that both creates the blank profile AND
    pushes it there -- the same door profCreate and the live app use. */
 const p = E.pNew(name);
 p.who.first = first; p.who.last = last; p.who.sex = sex;

 /* seed.js: the real MBTI-to-axis-charge mechanism. Writes p.axes directly
    (seedApply only writes onto an empty field, which a fresh blankProfile
    always is). */
 E.seedApply(p, mbti);

 /* the 63 real intake answers -> the 21 real law scores, biased per ICP */
 applyIntake(E, p, icp, rng);

 /* THE SEVERITY DRAW. icp.axisBias names the 1-2 real child-fetter charges
    (seed.js CHARGES) this ICP's Kill condition loads hardest (icps.js
    header explains the mapping). A log-shaped severity draw -- most of the
    cohort mild, a real minority severe -- so the simulation produces an
    actual distribution of how often a person's charge crosses the
    engine's own complex/hyper-complex thresholds, not a single uniform
    bump that either never crosses them or always does. Written directly
    onto p.axes[c].held (0-10, additive over the seed, clamped), which is
    the same field seedApply itself writes and validateProfile accepts. */
 if (icp.axisBias && icp.axisBias.length) {
  const severity = Math.pow(rng(), 2.2) * 6.5; // skewed toward low, tail up to ~6.5
  icp.axisBias.forEach((c) => {
   const cur = (p.axes[c] && p.axes[c].held) || 0;
   const bump = severity * (0.6 + rng() * 0.8);
   p.axes[c].held = clamp(round1(cur + bump), 0, 10);
  });
 }

 /* the boundary. A profile that does not pass this is a generator defect. */
 const v = E.validateProfile(JSON.parse(JSON.stringify(p)));
 return {
  profile: p,
  icp: icp.id, icpName: icp.name, mbti, sex, name,
  valid: !!v.ok, errs: v.ok ? [] : (v.errs || [])
 };
}

/* generate n profiles across the 7 ICPs. Deterministic given seed. */
function generateAll(E, n, seed) {
 const rng = makeRng(seed || 20261030);
 const counts = icpCounts(n, ICPS);
 const out = [];
 let globalIdx = 0;
 counts.forEach(({ icp, count }) => {
  for (let i = 0; i < count; i++) {
   out.push(buildOne(E, icp, i + 1, rng));
   globalIdx++;
  }
 });
 return { profiles: out, counts: counts.map(c => ({ icp: c.icp.id, count: c.count })) };
}

module.exports = { generateAll, icpCounts, makeRng };
