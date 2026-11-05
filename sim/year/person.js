/* ============================================================
   ONE PERSON, A YEAR. The loop is sim/harness.js runPerson, ported to 365
   days and to the doors in doors.js. Every reading, charge, release, streak,
   mark, allowance and daily summary below is the shipped engine's. What a
   person decides (open today or not, write or not, practise or not, stay or
   not) is model.js, and is judgement.
   ============================================================ */
'use strict';
const D = require('./doors.js');
const { E, clock } = D;
const { SHOWUP, FRICTION, LAND, COST, RERUN_TAKE } = require('./model.js');
const { STORYBANK } = require(require('path').join(D.ROOT, 'sim', 'stories.js'));

const DAYS = 365;
const CHECK = [1, 7, 14, 30, 60, 90, 120, 180, 240, 300, 365];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0;
 let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
 return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
/* a person's own stream, from the run seed and their index, so a result does
   not depend on how the cohort was split across processes */
function seedOf(runSeed, idx) { let h = (runSeed ^ 0x9E3779B9) >>> 0; h = Math.imul(h ^ (idx + 1), 0x85EBCA6B) >>> 0; h ^= h >>> 13; h = Math.imul(h, 0xC2B2AE35) >>> 0; return (h ^ h >>> 16) >>> 0; }

/* intake answers for one law: the ICP's own law table, plus this person's
   offset, plus three answers of noise. LAWSET[_] is the default for a law
   the table does not name, which is how tests/engine.js loads them. */
function lawAnswers(spec, offset, law, rng) {
 const LS = E.LAWSET[spec.nm] || { _: 5.5 };
 const centre = clamp((LS[law] !== undefined ? LS[law] : (LS._ !== undefined ? LS._ : 5.5)) + offset, 0, 10);
 return [0, 1, 2].map(() => clamp(Math.round(centre + (rng() * 2.6 - 1.3)), 0, 10));
}

function runPerson(spec, idx, opt) {
 opt = opt || {};
 const rng = mulberry(seedOf(opt.seed || 20261105, idx));
 const costK = opt.costScale !== undefined ? opt.costScale : 1;
 const rerunTake = opt.rerunTake !== undefined ? opt.rerunTake : RERUN_TAKE;
 clock.set(clock.START);
 const p = D.begin('You');
 D.STV.lastFound = null;
 const bank = (STORYBANK[spec.nm] || STORYBANK.Rosa).map(x => x[1]);
 const lawOffset = (rng() * 2 - 1) * 1.0;   /* MINE: a person sits up to a point either side of their ICP's table */
 const phone = spec.device === 'phone' || (spec.device === 'both' && rng() < 0.5);
 const rec = { nm: spec.nm, idx, phone, arrived: false, quitDay: null, quitOn: null, open: '', sessions: 0, minutes: 0,
  stories: 0, storiesRead: 0, storiesNamed: 0, releases: 0, reruns: 0, walls: 0, ritualsPlanned: 0, ritualsDone: 0,
  intakeBlocks: 0, intakeDone: false, intakeDay: null, sawDelta: 0, sawNamed: 0, marks: 0, loopClosed: 0,
  frozen: 0, silent: 0, hits: {}, cp: {}, paid: opt.paid || null, firstRelease: null, firstWall: null };
 const openDays = new Uint8Array(DAYS + 1);
 let fsurv = 1, worst = null, worstC = 0;
 const hit = (k, w) => { rec.hits[k] = (rec.hits[k] || 0) + 1;
  const hard = (FRICTION[k].hard || {})[spec.nm] || 1;
  const off = opt.off && opt.off.indexOf(k) >= 0;
  const c = off ? 0 : clamp(FRICTION[k].cost * costK * hard * (w === undefined ? 1 : w), 0, 0.95);
  fsurv *= (1 - c); if (c > worstC) { worstC = c; worst = k; } };

 const snapCp = (day, alive) => {
  const now = Date.now(), r = E.compute(), st = E.streakRead(p, now), L = E.ladderRead(p, now), B = E.meterBudget(p, now);
  let act = false; for (let d = Math.max(1, day - 6); d <= day; d++) if (openDays[d]) act = true;
  rec.cp[day] = { alive, active7: act, cq: r.unread ? null : +r.CQ.toFixed(2), complete: !!r.complete, dq: +(r.DQ || 0).toFixed(2), ex: +(r.EX || 0).toFixed(2),
   streak: st.run, live: st.live, marks: L.earned.length, left: B.left, unique: (p.meter && p.meter.unique || []).length,
   releases: rec.releases, stories: rec.stories, rituals: rec.ritualsDone };
 };

 if (rng() > spec.arrive) { rec.quitDay = 0; rec.quitOn = 'NEVER_OPENED'; rec.open = '0'.repeat(DAYS); E.undoClear(); return rec; }
 rec.arrived = true;
 if (opt.paid) D.payMonth(p, opt.paid, Date.now());
 let alive = true, gapLeft = 0, hazard = 0, gapDays = 0, aimSid = null, aimKind = 'unknown', lastPaid = 0;
 const dealt = {};

 for (let day = 1; day <= DAYS; day++) {
  clock.set(clock.START + (day - 1) * clock.DAY_MS);
  if (alive && opt.paid && day - lastPaid >= 30 && day > 1) { D.payMonth(p, opt.paid, Date.now()); lastPaid = day; }
  if (!alive) { if (CHECK.indexOf(day) >= 0) snapCp(day, false); continue; }
  let opened = false;
  (function oneDay() {
   /* the habit arm only: the drift is multiplied by how fragile the practice
      still is, tools/ritualsim.js's Lally 2010 term, max(0, 1 - done/66). There
      it scaled the shock of a broken run; carrying it onto drift is MINE. */
   const frag = opt.habit ? Math.max(0, 1 - rec.ritualsDone / 66) : 1;
   if (gapLeft > 0) { gapLeft--; gapDays++;
    if (rng() < (0.035 + 0.02 * Math.min(6, day / 15)) * frag) { alive = false; rec.quitDay = day; rec.quitOn = 'DRIFT'; }
    return; }
   if (rng() < spec.gap[0]) { gapLeft = 1 + Math.floor(rng() * spec.gap[1]); return; }
   const curiosity = Math.exp(-(day - 1) / 11);
   const st = E.streakRead(p, Date.now());
   const pull = (spec.whys.streak && st.live ? 0.30 * spec.whys.streak : 0)
    + 0.22 * (rec.sawDelta > 0 ? 1 : 0) + 0.18 * (rec.sawNamed > 0 ? 1 : 0) + 0.14 * (rec.marks > 0 ? 1 : 0);
   let pOpen = spec.base * (0.30 + 0.70 * curiosity) + pull - hazard;
   if (day === 1) pOpen = 1;
   if (rng() > clamp(pOpen, 0.01, 0.97)) { gapDays++;
    if (rng() < 0.02 * frag) { alive = false; rec.quitDay = day; rec.quitOn = 'DRIFT'; }
    return; }
   /* ---------------- a session ---------------- */
   opened = true; gapDays = 0; openDays[day] = 1; rec.sessions++;
   /* STV.lastFound is page memory in ui/storyui.js, forgotten on reload, and
      every session after the first is a fresh page. The first cut kept it all
      year, so a story that found nothing released an address found weeks
      before. Caught by the review of 5 November. */
   D.STV.lastFound = null;
   let budget = spec.minutes[0] + rng() * (spec.minutes[1] - spec.minutes[0]);
   rec.minutes += budget;
   fsurv = 1; worst = null; worstC = 0; const delivered = {};
   const rIn = E.compute();
   const land = (rec.sessions === 1 ? LAND.first : LAND.after)[phone ? 'phone' : 'desk'];
   if (land > 12) hit('F6', Math.min(1, land / 60));

   /* the yesterday answer and today's summary, ui/daily.js */
   const sm = D.summary(p, 'Notice where I hold it, once today.', aimSid, aimKind);
   if (sm.sid) aimSid = sm.sid;
   if (sm.result === 'frozen') rec.frozen++; else if (sm.result === 'silent') rec.silent++; else if (sm.result === 'error') rec.dlyErr = (rec.dlyErr || 0) + 1;

   /* the intake, in blocks of three, only if there is time */
   if (!rec.intakeDone && rng() < 0.30) {
    if (budget < 7) hit('F7');
    const blocks = Math.min(21 - rec.intakeBlocks, Math.max(1, Math.floor(budget / COST.intakeBlock)));
    for (let b = rec.intakeBlocks; b < rec.intakeBlocks + blocks; b++)
     D.intakeBlock(p, b, lawAnswers(spec, lawOffset, E.SINAMES[b], rng));
    rec.intakeBlocks += blocks; budget -= blocks * COST.intakeBlock;
    if (rec.intakeBlocks >= 21 && !rec.intakeDone) { rec.intakeDone = true; rec.intakeDay = day; delivered.number = 1; }
   }

   /* a story */
   let kept = null;
   if (budget > COST.story && rng() < (spec.whys.feel || spec.whys.night || spec.whys.grief || 0.45)) {
    const text = bank[Math.floor(rng() * bank.length)];
    const dq0 = E.compute().DQ;
    const sc = D.storyCommit(p, text);
    rec.stories++; budget -= COST.story; kept = sc.kept;
    if (!sc.k) hit('F1');
    else { rec.storiesRead++;
     if (sc.parsed.imprints.every(i => i.inferred)) hit('F2');
     if (sc.parsed.named && sc.parsed.named.length) { rec.sawNamed++; rec.storiesNamed++; delivered.named = 1; } }
    if (!sc.foundNow && !sc.hadBefore && !E.compute().loaded.length) hit('F3');
    const dq1 = E.compute().DQ;
    if (E.pct('dq', dq1) > E.pct('dq', dq0)) hit('F14');
   }

   /* the release, from what the story found or the heaviest loaded */
   if (budget > COST.release) {
    const rr = D.release(p, kept, rng() < rerunTake);
    if (rr.wall) { rec.walls++; if (rec.firstWall === null) rec.firstWall = day; hit('WALL'); }
    if (rr.ran) {
     if (rr.rerun) rec.reruns++; else { rec.releases++; if (rec.firstRelease === null) rec.firstRelease = day; }
     budget -= COST.release; delivered.cost = 1;
    }
   }

   /* the ritual: the card calls one practice, and the person does it or not */
   if (budget > COST.ritualPlan && rng() < 0.55) {
    const did = rng() < spec.work;
    const rt = D.ritual(p, did);
    if (rt && rt.steps) { rec.ritualsPlanned++; if (did) rec.ritualsDone++;
     const k = rt.steps.join('+'); dealt[k] = (dealt[k] || 0) + 1;
     if (dealt[k] >= 20) hit('F9', 0.5); }
    aimKind = did ? 'kept' : 'not';
    budget -= COST.ritualPlan;
   } else aimKind = 'unknown';

   /* did the printed number move */
   const rOut = E.compute();
   let moved = false;
   if (rOut.complete && !rOut.unread && rIn.complete) { const m = E.pctMove('cq', rIn.CQ, rOut.CQ); if (m && m.moved) moved = true; }
   const mx = E.pctMove('expression', rIn.EX || 0, rOut.EX || 0); if (mx && mx.moved) moved = true;
   if (moved) { rec.sawDelta++; delivered.delta = 1; }
   else if (spec.wants.indexOf('delta') >= 0) hit('F4');

   if (rec.stories > 0 && rec.releases > 0 && rec.ritualsDone > 0) rec.loopClosed++;
   /* the harness's 0.96 for a want not delivered. It is a cost like any other
      and scales with costScale; the first cut left it out, so the zero friction
      control still lost 5 percent of its people to it. */
   if (!(opt.off && opt.off.indexOf('WANT') >= 0))
    spec.wants.forEach(w => { if (!delivered[w] && (w === 'delta' || w === 'cost')) fsurv *= 1 - 0.04 * costK; });
   if (spec.refers && rng() < 0.35) hit('F12');
   if (rng() < 0.5) hit('F10', 0.5);
   const L = E.ladderRead(p, Date.now());
   if (L.earned.length > rec.marks) { rec.marks = L.earned.length; fsurv = clamp(fsurv * 1.08, 0, 1); }
   const credit = 0.05 * Object.keys(delivered).length + (rec.sawDelta ? 0.03 : 0);
   const fr = 1 - fsurv;
   hazard = clamp(hazard * 0.62 + Math.max(0, fr / spec.patience - credit), 0, 0.85);
   if (rng() < clamp(hazard, 0, 0.9)) { alive = false; rec.quitDay = day; rec.quitOn = worst || 'NONE'; }
  })();
  if (CHECK.indexOf(day) >= 0) snapCp(day, alive || rec.quitDay === day ? alive : false);
 }
 let s = ''; for (let d = 1; d <= DAYS; d++) s += openDays[d] ? '1' : '0';
 rec.open = s;
 const r = E.compute();
 rec.final = { cq: r.unread ? null : +r.CQ.toFixed(2), dq: +(r.DQ || 0).toFixed(2), ex: +(r.EX || 0).toFixed(2),
  tier: r.tier ? (E.tierOf(r.CQ) || {}).nm || null : null, history: p.history.length, bytes: JSON.stringify(p).length };
 E.undoClear();
 return rec;
}

module.exports = { runPerson, SHOWUP, DAYS, CHECK, seedOf };
