/* ============================================================
   THE DAY-ADVANCE HARNESS. One synthetic person, 120 simulated days, through
   the real engine's real doors, the same shape tests/daily.js's SUITES.size
   already proves works (loadProfile -> compute() -> dlyDayOpen loop).

   HOST FREE DOORS EXERCISED, PER DAY (or on the cadence noted):
     loadProfile, compute()            every day, before anything else
     snapshot(p) -> p.history           every day (a "reading taken")
     E.parseStory + p.story.entries     every day (a journal entry)
     p.rituals.push                     every 3rd day
     dlyDayOpen (-> dlyCompose/In,
       dlyGround/In, dlyValidate
       internally)                      every day
     dlyAimSet / dlyAimAnswer           every 5th day
     dlyRespond                         on frozen days with statements
     dlyWhy                            every 10th day, on a frozen statement
     practiceDo (goal/behavior/
       protocol/ritual/event/evidence)  day 3 setup, then weekly cadence

   A GAP is logged with who (profile name/id), when (simulated ISO day,
   day index), what (the door and the raw error/result), and why (the real
   underlying cause: file/function/record), never a vague description. */

const CANON = require('../../../vendor/reboot-os/canon.json');

const DAY_MS = 86400000;
const START = '2026-01-05T15:00:00.000Z'; // a Monday, arbitrary but fixed

function isoDay(i) { return new Date(Date.parse(START) + i * DAY_MS).toISOString(); }

/* canon.registers.complexes / hyper_complexes: ["Name","glyph",[saboteurs],"code","one sentence"].
   Every row is exactly 5 fields -- confirmed by direct read, vendor/reboot-os/canon.json.
   There is no deeper content field on any row, so ANY complex/hyper-complex a
   simulated reading names is, by construction, a bare-shell record: this is
   not a defect some rows have and others don't, it is the current state of
   all 23 complexes and all 9 hyper-complexes in the shipped canon. */
const COMPLEX_NAMES = new Set((CANON.registers.complexes || []).map(r => r[0]));
const HYPER_NAMES = new Set((CANON.registers.hyper_complexes || []).map(r => r[0]));

function runOne(E, rec, days, opt) {
 opt = opt || {};
 const p = rec.profile;
 const gaps = [];
 const errors = [];
 let framesOk = 0, framesTotal = 0;
 let firstComplexDay = null, firstHyperDay = null, firstSupDay = null;
 let maxCQ = -1, minCQ = 999, cqAtStart = null, cqAtEnd = null;
 let daysFrozen = 0, daysSilent = 0, daysThin = 0, daysError = 0;
 let statementsShown = 0, statementsRefused = 0;
 let practiceSetup = false, practiceObj = null, protocolId = null, ritualId = null, goalId = null;

 function logGap(day, where, why, extra) {
  gaps.push(Object.assign({
   who: rec.name, icp: rec.icp, mbti: rec.mbti, day: day, iso: isoDay(day),
   where: where, why: why
  }, extra || {}));
 }

 const journalPool = (opt.journal || []);

 for (let i = 0; i < days; i++) {
  framesTotal++;
  const iso = isoDay(i);
  try {
   E.loadProfile(p);
   const r = E.compute();

   if (i === 0) cqAtStart = r.CQ;
   cqAtEnd = r.CQ;
   if (r.CQ > maxCQ) maxCQ = r.CQ;
   if (r.CQ < minCQ) minCQ = r.CQ;

   /* the trace chain's real ceiling: a named complex / hyper-complex /
      super-complex is a bare shell in canon.json by construction (see
      header). Log the first day each rung is actually reached, which is
      the real-world moment this cohort's journey hits that content gap. */
   if (firstComplexDay === null && r.cxs && r.cxs.length) {
    firstComplexDay = i;
    const hit = r.cxs.filter(c => COMPLEX_NAMES.has(c.nm.replace(/ overshot$/, '')) || true)[0];
    logGap(i, 'canon.complexes', 'a complex ("' + (hit ? hit.nm : r.cxs[0].nm) +
     '") was named by compute() (atuned_src/engine/compute.js); every row in ' +
     'vendor/reboot-os/canon.json registers.complexes is a 5-field shell ' +
     '(name, glyph, saboteurs, code, one-sentence) with no deeper content', { kind: 'bare_shell_complex' });
   }
   if (firstHyperDay === null && r.hys && r.hys.length) {
    firstHyperDay = i;
    logGap(i, 'canon.hyper_complexes', 'a hyper-complex ("' + r.hys[0].nm +
     '") was named by compute(); registers.hyper_complexes rows are the same ' +
     '5-field shell shape, no deeper content wired', { kind: 'bare_shell_hyper' });
   }
   if (firstSupDay === null && r.sups && r.sups.length) {
    firstSupDay = i;
    logGap(i, 'trace.TRACE_CHAIN', 'a super-complex ("' + r.sups[0].nm +
     '") was reached; atuned_src/engine/trace.js TRACE_CHAIN is fixed at ' +
     "['saboteur','complex','hyper_complex','super_complex'] -- there is no " +
     'graph edge above this rung to a mask, an archetype/domain or a ' +
     'Character node, confirmed directly in trace.js', { kind: 'chain_ceiling' });
   }

   /* the day's inputs: a reading snapshot, a journal entry, and (every 3rd
      day) a ritual day, all written onto the real record fields dlyCompose
      reads (p.history, p.story.entries, p.rituals). */
   const snap = E.snapshot(p);
   snap.t = iso;
   p.history.push(snap);

   if (journalPool.length) {
    const text = journalPool[i % journalPool.length];
    const parsed = E.parseStory(text);
    p.story.entries.push({
     t: iso, text: text, imprints: parsed.imprints.length,
     bands: parsed.bands, lex: E.LEX_VERSION
    });
   }
   if (i % 3 === 0) {
    p.rituals.push({ t: iso, track: 'Body', band: r.darkB || 'Heart', steps: [], min: 5, done: (i % 6 !== 0) ? iso : false });
   }

   /* the practice lifecycle, real doors: goal -> behavior -> protocol ->
      accept -> ritual, set up once, then a weekly schedule/move/evidence
      cadence, exercising practiceDo for real. */
   if (!practiceSetup && i >= 3) {
    practiceSetup = true;
    practiceObj = p.practice;
    let step = E.practiceDo(practiceObj, 'goal_create', {
     title: 'Reduce ' + (rec.kill || 'the kill condition'), description: 'synthetic goal for ' + rec.name,
     desired_outcome: { description: 'fewer days hitting the kill condition', measurable: false }, src: 'known'
    }, iso);
    if (!step.ok) { logGap(i, 'practiceDo:goal_create', JSON.stringify(step.errs), { kind: 'practice_refused' }); }
    else { practiceObj = step.P; goalId = step.id; }

    if (goalId) {
     step = E.practiceDo(practiceObj, 'behavior_define', {
      goal_id: goalId, behavior: 'daily check-in', description: 'open the day and respond to one statement',
      frequency: { value: 1, unit: 'day' }, src: 'known'
     }, iso);
     let behaviorId = null;
     if (!step.ok) { logGap(i, 'practiceDo:behavior_define', JSON.stringify(step.errs), { kind: 'practice_refused' }); }
     else { practiceObj = step.P; behaviorId = step.id; }

     step = behaviorId ? E.practiceDo(practiceObj, 'protocol_add', {
      class: 'behavior', objective_id: behaviorId,
      steps: [{ type: 'observation', instruction: 'notice ' + (rec.keyNeed || 'the key need') }],
      src: 'known'
     }, iso) : { ok: false, errs: ['no behavior objective id to attach a protocol to'] };
     if (!step.ok) { logGap(i, 'practiceDo:protocol_add', JSON.stringify(step.errs), { kind: 'practice_refused' }); }
     else {
      /* a protocol created with src:'known' (the person's own) lands
         already accepted (practice.js PR_ACT.protocol_add), unlike a
         generated one, which lands proposed and needs protocol_accept.
         So this door is skipped here, not called wrongly: a synthetic
         person writing their own protocol never calls protocol_accept on
         it, the same as a real one wouldn't. */
      practiceObj = step.P; protocolId = step.id;
      step = E.practiceDo(practiceObj, 'ritual_create', {
       protocol_id: protocolId, title: 'Daily check-in', cadence: { type: 'daily' },
       days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], src: 'known'
      }, iso);
      if (!step.ok) { logGap(i, 'practiceDo:ritual_create', JSON.stringify(step.errs), { kind: 'practice_refused' }); }
      else { practiceObj = step.P; ritualId = step.id; }
     }
    }
    p.practice = practiceObj;
   } else if (practiceSetup && ritualId && i % 7 === 0) {
    let step = E.practiceDo(p.practice, 'event_schedule', { ritual_id: ritualId, scheduled_at: iso, src: 'known' }, iso);
    if (!step.ok) { logGap(i, 'practiceDo:event_schedule', JSON.stringify(step.errs), { kind: 'practice_refused' }); }
    else {
     p.practice = step.P;
     const evId = step.id;
     const outcome = (i % 21 === 0) ? 'missed' : 'completed';
     /* the real state machine (PR_FLOW, practice.js): scheduled can go
        straight to missed, but completed is only reachable scheduled ->
        available -> started -> completed. Walking it stepwise is the real
        door sequence a live app's clock + person would produce, not a
        shortcut past practiceTransition's own rule. */
     const chain = (outcome === 'missed') ? ['missed'] : ['available', 'started', 'completed'];
     /* a scheduled practice is refused as "missed" until the end of the
        next day (practiceTransition's real rule, PR_FLOW + its own
        message), so the missed move is asked for 2 days after it was
        scheduled -- the first moment the engine itself will say yes --
        and not at the same instant it was scheduled. */
     const moveNow = (outcome === 'missed') ? isoDay(i + 2) : iso;
     let moveOk = true;
     chain.forEach(function (to) {
      if (!moveOk) return;
      const mv = E.practiceDo(p.practice, 'event_move', { id: evId, to: to, src: 'known' }, moveNow);
      if (!mv.ok) { logGap(i, 'practiceDo:event_move:' + to, JSON.stringify(mv.errs), { kind: 'practice_refused' }); moveOk = false; }
      else { p.practice = mv.P; }
     });
     if (moveOk) {
      if (outcome === 'completed') {
       step = E.practiceDo(p.practice, 'evidence_record', {
        source: 'user', type: 'internal', dimension: 'effect', timestamp: iso,
        practice_event_id: evId, confidence: 0.6, notes: 'synthetic evidence', src: 'known'
       }, iso);
       if (!step.ok) { logGap(i, 'practiceDo:evidence_record', JSON.stringify(step.errs), { kind: 'practice_refused' }); }
       else { p.practice = step.P; }
      }
     }
    }
   }

   /* THE DAY ITSELF: compose and freeze, through the real door. */
   const saveFn = () => true;
   const o = E.dlyDayOpen(p, iso, saveFn, {});
   if (o.result === 'error') {
    daysError++;
    logGap(i, 'dlyDayOpen', o.why, { kind: 'engine_error' });
    errors.push({ day: i, why: o.why });
   } else {
    framesOk++;
    if (o.result === 'frozen') {
     daysFrozen++;
     statementsShown += (o.day && o.day.st) ? o.day.st.length : 0;
     statementsRefused += (o.refused || []).length;
     if (o.day && o.day.st && o.day.st.length) {
      const r2 = E.dlyRespond(p, o.day.id, 0, 'accurate', '', iso);
      if (!r2.ok && r2.result === 'error') logGap(i, 'dlyRespond', JSON.stringify(r2), { kind: 'engine_error' });
      else if (r2.ok) p.summaries = r2.S;
     }
     if (i % 10 === 0 && o.day && o.day.st && o.day.st.length) {
      const why = E.dlyWhy(p, o.day.id, 0, {});
      if (!why.ok) logGap(i, 'dlyWhy', why.why, { kind: 'drawer_dead_end' });
     }
    } else if (o.result === 'silent') {
     daysSilent++;
     if (o.silent === 'thin') daysThin++;
    }
   }

   if (i % 5 === 0) {
    const r3 = E.dlyAimSet(p, iso, 'Notice ' + (rec.keyNeed || 'the key need') + ' once today', r.darkB || null);
    if (r3.ok) { p.summaries = r3.S; } else if (r3.result === 'error') { logGap(i, 'dlyAimSet', JSON.stringify(r3), { kind: 'engine_error' }); }
    const today = E.dlyToday(p, iso);
    if (today) {
     const mark = (i % 15 === 0) ? 'not' : (i % 10 === 0 ? 'partly' : 'kept');
     const r4 = E.dlyAimAnswer(p, today.id, mark, iso);
     if (r4.ok) { p.summaries = r4.S; } else if (r4.result === 'error') { logGap(i, 'dlyAimAnswer', JSON.stringify(r4), { kind: 'engine_error' }); }
    }
   }
  } catch (e) {
   daysError++;
   logGap(i, 'exception', (e && e.stack) ? e.stack.split('\n').slice(0, 3).join(' | ') : String(e), { kind: 'exception' });
   errors.push({ day: i, why: (e && e.message) || String(e) });
  }
 }

 /* final accuracy / coverage reads, real engine functions, for the
    percent-complete estimate */
 let finalAcc = null, finalCov = null;
 try {
  E.loadProfile(p);
  const rf = E.compute();
  finalAcc = E.accuracy(rf, p);
  finalCov = E.accCover(rf, p);
 } catch (e) { /* leave null; a failure here is itself logged as a gap below */
  logGap(days - 1, 'accuracy/accCover', (e && e.message) || String(e), { kind: 'exception' });
 }

 return {
  name: rec.name, icp: rec.icp, mbti: rec.mbti,
  days, framesOk, framesTotal,
  daysFrozen, daysSilent, daysThin, daysError,
  statementsShown, statementsRefused,
  cqAtStart, cqAtEnd, maxCQ, minCQ,
  firstComplexDay, firstHyperDay, firstSupDay,
  finalAccPct: finalAcc ? finalAcc.pct : null,
  finalAccCov: finalAcc ? finalAcc.cov : null,
  finalCovPct: finalCov ? finalCov.pct : null,
  finalCovComplete: finalCov ? finalCov.complete : null,
  gaps, errors
 };
}

module.exports = { runOne, isoDay, START, DAY_MS, COMPLEX_NAMES, HYPER_NAMES };
