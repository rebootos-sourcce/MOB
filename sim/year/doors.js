/* ============================================================
   THE DOORS. One day of a person's use, through the calls the shipped UI
   makes, as a node script can make them.

   Ported 5 November from the round's door survey, every door with the ui
   line it copies. Nothing here decides what a person does or whether they
   stay: that is model.js, and it is judgement. This file only does what the
   product does when a person presses the control.

   Four things the UI does that the engine contract does not export, and
   which are therefore ported here rather than called:
     ritFor             ui/ritual.js, which practice the card calls today
     CHAN               ui/release.js, the four channels a release says
     stFound / STV      ui/storyui.js, which addresses a commit found
     the ritual plan    ui/ritual.js ritStartPlan, kept in the side store
   They were read against the ui source on 5 November and matched it. Nothing
   re-reads the ui automatically, so a change to ui/ritual.js, ui/release.js or
   ui/storyui.js has to be carried here by hand.

   Two known gaps, measured by the review of 5 November and left as they are:
     the ritual plan's rel is always null, so a finished release never marks
       the day's ritual done through ritRelDone; on 2,500 people that is 129
       days done missed and a mean streak at day 30 of 0.92 against 1.05.
     the summary door runs every session, where the product writes a day only
       when the Summary tab is the one showing.

   dlyRespond is NOT called. It has no caller in ui/ (checked 5 November), so
   calling it would simulate a door no person can open.
   ============================================================ */
'use strict';
const clock = require('./clock.js');
const path = require('path');
const ROOT = process.env.SIM_ROOT ? path.resolve(process.env.SIM_ROOT) : path.resolve(__dirname, '..', '..');
const E = require(path.join(ROOT, 'engine.js'));

/* the host store, a bag that goes away. remove is bound because pPersist rolls
   back through it on a refused write. */
const MEM = {};
E.bindStore(k => (k in MEM ? MEM[k] : null), (k, v) => { MEM[k] = String(v); }, k => { delete MEM[k]; });

const CHAN = [['L', 'Left', 'limit'], ['R', 'Right', 'limit'], ['L', 'Left', 'truth'], ['R', 'Right', 'truth']]; /* ui/release.js:36 */
const CHANS = CHAN.map(c => c[0] + c[2]);
const DOSE = 100;                             /* RUN.dose default, ui/release.js */
const RIT_KEY = 'atuned-ritual-active';       /* ui/ritual.js:210 */
const TRACK4BAND = { Root: 'Body', Sacral: 'Somatic', Solar: 'Somatic', Heart: 'Body', Throat: 'Mind', '3rd Eye': 'Mind', Crown: 'Energy' };

/* ritFor, ui/ritual.js:109, body ported */
function ritFor(r) {
 const band = r.darkB || 'Root', track = TRACK4BAND[band] || 'Body';
 const tier = r.DQ >= 70 ? 1 : (r.DQ >= 40 ? 2 : 3);
 const fit = E.PRACTICE.filter(p => p.tier <= tier && !p.tc);
 const first = fit.filter(p => p.track === track);
 const lightest = set => set.slice().sort((a, b) => (a.min - b.min) || (a.tier - b.tier))[0];
 const called = first.length ? lightest(first) : lightest(fit);
 return { band, track, tier, called };
}
const ritMin = steps => steps.reduce((a, k) => { const p = E.PRACTICE.find(x => x.k === k); return a + (p ? p.min : 0); }, 0);
function ritEntryOf(o) { /* ui/ritual.js:368 */
 const x = { t: o.t, steps: o.steps.slice(), min: ritMin(o.steps), when: o.when || '', where: o.where || '', done: o.done };
 if (o.track) x.track = o.track; if (o.band && E.BANDS.indexOf(o.band) >= 0) x.band = o.band; return x;
}

/* ---- a person begins: profCreate is the door that pushes the record and
   makes it current. One record at a time, deleted after, because pPersist
   writes the whole list on every save. ---- */
let PREV = null;
function begin(name) {
 if (PREV) { E.profDelete(PREV.id); PREV = null; }
 for (const k of Object.keys(MEM)) delete MEM[k];
 const p = E.profCreate(name);
 if (!p) throw new Error('profCreate refused: ' + E.profErr());
 E.undoClear();
 PREV = p;
 return p;
}

/* the intake, a block of three at a time, engine/intake.js iqAnswer + iqApply */
function intakeBlock(p, block, answers) {
 for (let q = 0; q < 3; q++) E.iqAnswer(p, block * 3 + q, answers[q]);
 E.iqApply(p);
 return E.pSave();
}

/* (1) the story commit, ui/storyui.js:665 stCommit */
const STV = { lastFound: null };
function storyCommit(p, text) {
 const parsed = E.parseStory(text);
 const safe = E.srcSafe(text);
 let found = [], named = 0;
 if (!safe) [false, true].forEach(inf => {
  parsed.imprints.forEach(im => {
   const n = E.BY[im.node];
   if (!!im.inferred === inf && n && n.cf && found.indexOf(n) < 0) found.push(n);
  });
  if (!inf) named = found.length;
 });
 found.named = named;
 const kept = safe ? [] : (found.length ? found : STV.lastFound);
 const k = parsed.imprints.length;
 if (k) {
  E.undoPush('committing the story');
  E.applyStory(text); E.applyStoryAddr(text); E.verpApply(text); E.leanApply(text);
 }
 p.story = p.story || { entries: [] };
 p.story.entries.push({ t: new Date().toISOString(), text, imprints: k, bands: parsed.bands, lex: E.LEX_VERSION });
 const saved = E.pSave(); if (saved) E.pSnap();
 const hadBefore = !!(STV.lastFound && STV.lastFound.length);
 STV.lastFound = kept;
 return { k, saved, kept, safe, parsed, foundNow: found.length, hadBefore };
}

/* (2) the release, relPick + relPlan + relCoolDown, ui/release.js:490,302,1289.
   rerun is the empty card's free route (relRerunPick, relMode(true)). */
function release(p, kept, allowRerun) {
 const r = E.compute(), bySq = (a, b) => b.sq - a.sq;
 const cut = (kept && kept.named) || 0;
 const take = (kept && kept.length) ? (cut ? kept.slice(0, cut) : kept.slice()).sort(bySq).slice(0, 3)
  : r.loaded.filter(n => n.cf).sort(bySq).slice(0, 3);
 const pick = take.map(n => E.BY[n.i]).filter(n => n && n.cf);
 if (!pick.length) return { ran: false, why: 'nothing' };
 const B = E.meterBudget(p, Date.now());
 const plan = B.cap > 0 ? E.meterPlanWhole(p, pick.map(n => n.i), CHANS, B.cap, pick.map(n => n.sq)) : [];
 let rerun = false, wall = false;
 if (!plan.length) {
  wall = true;
  if (!allowRerun) return { ran: false, why: 'wall', wall, left: B.left };
  let rp = pick.filter(n => E.meterRerunOrder(p, [n.i], CHANS, E.RUN_MAX).length);
  if (!rp.length) {
   const have = {}; rp = [];
   (p.meter.unique || []).forEach(k => { const i = k.split(':')[0]; if (!have[i]) { have[i] = 1; const n = E.BY[+i]; if (n && n.cf) rp.push(n); } });
   rp = rp.sort(bySq).filter(n => E.meterRerunOrder(p, [n.i], CHANS, E.RUN_MAX).length).slice(0, 3);
  }
  plan.push(...E.meterRerunOrder(p, rp.map(n => n.i), CHANS, E.RUN_MAX));
  pick.length = 0; pick.push(...rp); rerun = true;
  if (!plan.length) return { ran: false, why: 'wall', wall, left: B.left };
 }
 const on = {}; plan.forEach(k => { on[k.split(':')[0]] = 1; });
 const queue = pick.filter(n => on[n.i]);
 let said = 0, put = 0; plan.forEach(k => { if (/truth$/.test(k.split(':')[1])) put += DOSE; else said += DOSE; });
 const pre = E.compute();
 E.undoPush((rerun ? 'the rerun at ' : 'the release at ') + queue.length + ' addresses');
 let freed = 0; queue.forEach(n => { const m = E.relWrite(queue, n, n.sq * 10); freed += Math.abs(m.d); });
 const meter = rerun ? E.meterRerun(p, plan) : E.meterRun(p, plan);
 p.meter.relLines = (p.meter.relLines || 0) + said; p.meter.truthLines = (p.meter.truthLines || 0) + put;
 const lift = E.releaseWork(p, (meter && meter.fresh) || []);
 queue.forEach(n => E.meterFirst(p, 'addr:' + n.i, n.k + ', ' + n.b));
 const seats = {}; queue.forEach(n => { seats[n.b] = 1; });
 Object.keys(seats).forEach(b => E.meterFirst(p, 'seat:' + b, 'first release at the ' + b.toLowerCase()));
 const saved = E.pSaveSnap();
 const post = E.compute();
 return { ran: true, rerun, wall, keys: plan.length, addrs: queue.length, freed, fresh: (meter && meter.fresh || []).length,
  cq0: pre.CQ, cq1: post.CQ, ex0: pre.EX || 0, ex1: post.EX || 0, saved };
}

/* (3) the ritual, ritStartPlan + ritLog/ritMarkOn, ui/ritual.js:397,679,701 */
function ritPlansAll() { try { return JSON.parse(MEM[RIT_KEY] || '{}'); } catch (e) { return {}; } }
function ritual(p, doIt) {
 const today = E.pracDay(Date.now());
 const all = ritPlansAll(); const plans = all[p.id] || [];
 let plan = plans.find(x => !x.stop && (x.days === 0 || today < E.pracDay(x.from) + x.days));
 const was = JSON.stringify(p.rituals || []); p.rituals = p.rituals || [];
 if (!plan) {
  const r = E.compute(); const c = ritFor(r); if (!c.called) return { none: true };
  const now = new Date().toISOString();
  plan = { id: 'r' + Date.now().toString(36), steps: [c.called.k], when: '', where: '', days: 7, from: now, stop: null,
   band: r.unread ? '' : c.band, track: c.called.track, rel: null, tc: null, tags: null, on: null, tm: null };
  plans.push(plan);
  if (!p.rituals.some(x => E.pracDay(x.t) === today && x.steps.join('+') === plan.steps.join('+')))
   p.rituals.push(ritEntryOf({ t: now, track: plan.track, band: plan.band, steps: plan.steps, done: false }));
 }
 if (doIt) {
  const key = plan.steps.join('+');
  const e = p.rituals.find(x => E.pracDay(x.t) === today && x.steps.join('+') === key);
  if (e) { if (e.done === false) e.done = new Date().toISOString(); }
  else p.rituals.push(ritEntryOf({ t: new Date().toISOString(), track: plan.track, band: plan.band, steps: plan.steps, done: new Date().toISOString() }));
 }
 all[p.id] = plans; MEM[RIT_KEY] = JSON.stringify(all);
 const ok = E.pSave(); if (!ok) p.rituals = JSON.parse(was);
 return { ok, steps: plan.steps, min: ritMin(plan.steps) };
}

/* (4) the daily summary, ui/daily.js:189 sumDayOpen + dlyCommit */
function summary(p, aimText, yesterdaySid, yesterdayKind) {
 const now = Date.now(), r = E.compute();
 let ans = false;
 const commit = res => { if (!res || !res.ok) return false; const old = p.summaries; p.summaries = res.S; if (!E.pSave()) { p.summaries = old; return false; } return true; };
 if (yesterdaySid) ans = commit(E.dlyAimAnswer(p, yesterdaySid, yesterdayKind, now));
 if (r.unread || E.dlyToday(p, now)) return { result: 'skip', ans };
 const o = E.dlyDayOpen(p, now, E.pSave, { r });
 let aim = false;
 if (o.day) aim = commit(E.dlyAimSet(p, now, aimText, null));
 return { result: o.result, silent: o.silent, sid: o.day && o.day.id, st: o.day && o.day.st ? o.day.st.length : 0, aim, ans };
}

/* a paid month, the write planFromServer makes when the server says active */
function payMonth(p, tier, sinceMs) {
 const since = new Date(sinceMs).toISOString(), until = new Date(sinceMs + 30 * clock.DAY_MS).toISOString();
 const res = E.planFromServer(p.plan, { tier, status: 'active', since, until }, (p.meter && p.meter.unique) || [], since);
 if (res && res.plan) { p.plan = res.plan; E.pSave(); }
 return res;
}

module.exports = { E, MEM, clock, ROOT, CHANS, ritFor, begin, intakeBlock, storyCommit, release, ritual, summary, payMonth, STV };
