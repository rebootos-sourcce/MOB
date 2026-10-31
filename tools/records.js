#!/usr/bin/env node
/* ============================================================
   RECORDS. How many records reach the four depth template, read off the run.

   On 31 October the owner asked for every record to be held to the four
   depth template (reboot-os atuned/data/celestial/DEPTH_RESEARCH_STANDARD_V2.md
   and its exemplar, WATER_RAT_FOUR_DEPTH_PASSES.md). The audit that answered
   him (reviews/records-template-audit-2026-10-31.md) found 0 of 379 pass, and
   it found that with three scripts left in a session scratchpad, two of whose
   three passes were typed constants rather than measurements: `ctr:0`, `dis:0`
   and `rp4:0` were written into the scorer by hand for most categories. Re-run
   on main that night it printed the same file byte for byte, which proves the
   inventory had not moved and proves nothing about whether a counterexample
   had been written, because nothing in it could see one. A finding that can
   only ever print the number it was born with is the same defect CLAUDE.md
   records twelve times over for counts typed into documents.

   So this reads the count off the engine every time:

   1. INVENTORY. Every record the audit counted, enumerated from the engine's
      own tables at run time, so a record added or removed moves the total.
      Each is keyed by identity, never by display name: a named saboteur by its
      SABDEF code, a generated one by its cluster code from codeIndex(), an
      address by its integer. Root Flincher vanished once under a generated
      name when SAB_LIB was filled on 22 October, and a registry keyed by name
      would have quietly dropped its row.

   2. CANON. The fourteen components of the audit's rubric, D1 def prov, D2
      joins poles, D3 trig beh cons scene inv ctr, D4 rq dis evc rp4, scored
      from the fields the engine carries today. This is the audit's pass A,
      the schema pass, ported cell for cell: it is the only one of the three
      that a machine can do. A zero here means no field exists to hold the
      component, which is a fact about the data and flips the day one does.
      Prose quality, the audit's pass B, needs a reader and is not claimed.

   3. DEPTH RECORDS. The shape the audit's plan proposes (section 5), additive
      beside the display tables: d1 {definition, provenance[]}, d2 {opposite},
      d3 {trigger, move, payoff, cost, scene, inversion, counterexamples[],
      neighbours[]}, d4 {recognition[], disconfirmers[], evidenceClass,
      researchPasses[4]}, reviewState, ownerApproved. Read from RECDEPTH in
      the engine when it exists (it does not yet), or from --drafts FILE. Each
      component is checked mechanically and strictly, because T1 says in its
      first paragraph that four nonempty fields are not four passes: four
      passes must be four, numbered p1 to p4 once each, each substantial and
      sourced, and no two may share most of their words. joins is never read
      from a depth record: addresses, seat and family already live in SAB_LIB,
      NODES and HCX_LIB, and a copy would be a second truth.

   4. TWO NUMBERS, NEVER ONE. Structurally complete is not approved. The
      celestial library is 148 of 181 structurally complete and 0 of 181
      approved, and a registry that printed only the first would let a draft
      read as canon. ownerApproved true needs reviewState "owner-approved" and
      a name and date, or the record is refused.

     node tools/records.js                    category table and headline
     node tools/records.js --missing          every record, what it lacks
     node tools/records.js --record sab:S06   one record, every component, why
     node tools/records.js --drafts FILE      overlay draft depth records
     node tools/records.js --json OUT         the whole registry as JSON
     node tools/records.js --gate             self test, then the ledger

   --gate holds the run against tests/records-coverage.json in both
   directions. Below it is a regression. Above it is progress nobody wrote
   down, and it fails too, naming the number to write, because a ledger left
   behind by the product is the stale count this file exists to retire. It
   never reads drafts: a draft is not canon.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = path.join(__dirname, '..');
const LEDGER = path.join(ROOT, 'tests', 'records-coverage.json');
const D = { D1: ['def', 'prov'], D2: ['joins', 'poles'], D3: ['trig', 'beh', 'cons', 'scene', 'inv', 'ctr'], D4: ['rq', 'dis', 'evc', 'rp4'] };
const COMP = [].concat(...Object.values(D));
// T1's own four labels, "Mark source-originated facts, practitioner
// interpretations, new editorial psychological hypotheses, unverified
// empirical claims", as the only words an evidence class may use.
const EVC = ['source-originated', 'practitioner-interpretation', 'editorial-hypothesis', 'unverified-empirical'];
const REVIEW = ['draft', 'editorial-readback', 'owner-approved'];
// The knowledge prototype's generated filler is in this list by name: under
// TPL-SABOTEUR every generated saboteur passes on it, which is the audit's
// tenth disagreement and the reason field presence is not depth.
const PLACEHOLDER = /\b(TBD|TODO|FIXME|lorem|placeholder|to be written|coming soon)\b|This inferred Saboteur pattern organizes around/i;

/* ---------- the engine, read the way the audit read it ---------- */
// CHALLENGE, FAM_POLE, HD_RUNS and codeIndex are not on engine.js's export
// list. The engine is run in a context of its own and the names are read off
// it, rather than widening the export list for a tool.
function loadEngine(file) {
  const src = fs.readFileSync(file, 'utf8');
  const ctx = { console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx);
  vm.runInContext(src, ctx, { filename: file });
  const get = n => vm.runInContext('typeof ' + n + '==="undefined"?undefined:' + n, ctx);
  const T = {};
  ['SAB_LIB', 'HCX_LIB', 'SABDEF', 'SABCARD', 'SAB33', 'CHILD', 'AXCARD', 'MASKS', 'ARCH', 'DOMAINS', 'DOMDEF', 'MIRROR',
    'PATHS', 'HOME_POLES', 'CIRCLES', 'CASCADE', 'BLUEPRINT', 'DESCENT', 'TEACHER_RECIPES', 'GOVERN', 'NODES', 'ALL_SAB',
    'CHALLENGE', 'ARCH18', 'SAB_PI', 'VERP', 'FAM_POLE', 'SIGN_RUNS', 'CH_RUNS', 'CE_RUNS', 'LP_RUNS', 'HD_RUNS',
    'HD_LINE_RUNS', 'ROOT_SAYS', 'NUM_DEBT_SAYS', 'RECDEPTH'].forEach(n => { T[n] = get(n); });
  T.cluster = get('codeIndex') ? vm.runInContext('codeIndex().cluster', ctx) : {};
  T.codeKey = get('codeKey');
  return T;
}

const prose = (s, n) => typeof s === 'string' && s.trim().length >= (n || 25) && s.trim().split(/\s+/).length > 3;
const sentences = s => (String(s).match(/[.!?](\s|$)/g) || []).length;
const key = s => String(s || '').replace(/^[Tt]he\s+/, '').toLowerCase().replace(/-/g, ' ');

/* ---------- 1 and 2: inventory, and the canon as the engine carries it ---------- */
// Each cell is the audit's pass A for that category, the same field and the
// same test, so the two agree on the day this was written and any later
// difference is the data moving. 1 present, 0.5 partial, 0 absent, 'n' not
// applicable.
function inventory(T) {
  const R = [];
  const add = (cat, id, nm, c) => R.push({ cat, id, nm, canon: c });
  const PI = new Set(T.SAB_PI || []);
  Object.keys(T.SABDEF).forEach(k => {
    const d = T.SABDEF[k], c = (T.SABCARD || {})[k] || {};
    const lib = T.SAB_LIB.find(s => key(s.nm) === k), nm = (T.SAB33.find(r => key(r[0]) === k) || [k])[0], pi = PI.has(nm);
    add('Saboteur, named', 'sab:' + d.c, nm, { def: +prose(d.d), prov: pi ? 1 : 0, joins: lib ? 1 : 0.5, poles: 0, trig: +prose(d.t),
      beh: +prose(c.h), cons: 0, scene: +prose(c.h), inv: +(prose(c.a) || prose(d.i)), ctr: 0, rq: 0, dis: 0, evc: pi ? 0.5 : 0, rp4: 0 });
  });
  const code = s => T.cluster[T.codeKey ? T.codeKey(s.nm) : key(s.nm)];
  T.ALL_SAB.filter(s => s.unnamed).forEach(s => add('Saboteur, generated', 'sab:' + (code(s) || '?' + s.nm), s.nm,
    { def: 0, prov: 0, joins: 1, poles: 0, trig: 0, beh: 0, cons: 0, scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: 1, rp4: 0 }));
  T.ALL_SAB.forEach(s => {
    const base = s.unnamed ? (code(s) || '?' + s.nm) : ((T.SABDEF[key(s.nm)] || {}).c || '?' + s.nm);
    add('Saboteur, overshot', 'over:' + base, s.nm + ' overshot',
      { def: 0, prov: 0, joins: 1, poles: 0.5, trig: 0, beh: 0, cons: 0, scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: s.unnamed ? 1 : 0, rp4: 0 });
  });
  T.HCX_LIB.forEach(h => add('Hyper complex, family', 'hcx:' + h.nm, h.nm,
    { def: +prose(h.d), prov: 0, joins: 1, poles: 0.5, trig: 0, beh: 0, cons: 0, scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: 0, rp4: 0 }));
  Object.keys(T.FAM_POLE || {}).forEach(f => add('Hyper complex, overshoot', 'hcxo:' + f, T.FAM_POLE[f],
    { def: 0, prov: 0, joins: 1, poles: 0.5, trig: 0, beh: 0, cons: 0, scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: 0, rp4: 0 }));
  T.DESCENT.forEach(d => {
    const c = d.content || {}, rp = (c.researchPasses || []).length;
    add('Descent (' + d.kind + ')', 'descent:' + d.nm, d.nm, { def: +prose(d.d), prov: +prose(c.inferenceBasis), joins: (d.fam || d.pair) ? 1 : 0.5,
      poles: +prose(c.oppositeDefinition), trig: +prose(c.triggerMechanism), beh: +prose(c.behavior), cons: +prose(c.impact),
      scene: +prose(c.livedExample), inv: +prose(c.practice), ctr: 0, rq: 0, dis: 0, evc: +prose(c.oppositeStatus), rp4: rp >= 4 ? 1 : rp > 0 ? 0.5 : 0 });
  });
  T.CHILD.forEach(c => {
    const ax = T.AXCARD.find(a => a.ax === c.nm) || {}, ch = (T.CHALLENGE || {})[c.nm] || {};
    add('Axis (child emotion)', 'axis:' + c.nm, c.nm, { def: 0, prov: 0, joins: 1, poles: 1, trig: +prose(ch.when), beh: 0, cons: 0,
      scene: 0, inv: +(prose(ax.inst) || prose(ch.act)), ctr: 0, rq: 0, dis: 0, evc: 0, rp4: 0 });
  });
  T.NODES.forEach(n => {
    if (String(n.b).startsWith('Field')) return add('Field anchor', 'node:' + n.i, n.k, { def: 0.5, prov: 0, joins: 0.5, poles: 'n', trig: 'n',
      beh: 'n', cons: 'n', scene: 'n', inv: 'n', ctr: 'n', rq: 'n', dis: 'n', evc: 0, rp4: 0 });
    add('Fetter address', 'node:' + n.i, n.i + ' ' + n.k, { def: 0, prov: 0, joins: n.c ? 1 : 0.5, poles: n.c ? 0.5 : 0, trig: 0, beh: 0,
      cons: 0, scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: 0, rp4: 0 });
  });
  T.MASKS.forEach(m => add('Mask', 'mask:' + m.nm, m.nm, { def: +prose(m.v), prov: 0, joins: 1, poles: 0, trig: 0, beh: +prose(m.v), cons: 0,
    scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: 0, rp4: 0 }));
  T.ARCH.forEach(a => {
    const sab = (T.ARCH18.find(r => r[0] === a.nm) || [])[1];
    add('Archetype', 'arch:' + a.nm, a.nm, { def: +prose(a.d), prov: 0.5, joins: 1, poles: sab ? 0.5 : 0, trig: 0, beh: +prose(a.d), cons: 0,
      scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: 0, rp4: 0 });
  });
  T.DOMAINS.forEach(d => {
    const x = T.DOMDEF[key(d.nm)];
    add('Domain', 'dom:' + d.nm, d.nm, { def: +prose(x && x.c), prov: 0.5, joins: 1, poles: x ? 1 : 0, trig: 0, beh: x ? 0.5 : 0, cons: 0,
      scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: 0, rp4: 0 });
  });
  T.VERP.forEach(v => add('Law of action (gate)', 'gate:' + v.nm, v.nm, { def: +prose(v.d), prov: 0, joins: 0.5, poles: 1, trig: 0,
    beh: +prose(v.d), cons: 0, scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: 0, rp4: 0 }));
  const REC = {}; T.TEACHER_RECIPES.forEach(r => { REC[r.k] = r; });
  const has = s => typeof s === 'string' ? s.trim().length > 0 : Array.isArray(s) ? s.length > 0 : s != null;
  [].concat(T.MIRROR.map(m => ({ k: m.k, nm: m.up + ' / ' + m.dn, upd: m.upd, dnd: m.dnd, ask: m.ask, codex: true })),
    T.PATHS.filter(p => !T.MIRROR.some(m => m.up === p.up && m.upd === p.upd)).map(p => ({ k: p.k, nm: p.up + ' / ' + p.dn, upd: p.upd, dnd: p.dnd, ask: null })),
    T.HOME_POLES.map(p => ({ k: p.k, nm: p.up + ' / ' + p.dn, upd: null, dnd: null, ask: null })))
    .forEach(p => {
      const r = REC[p.k] || {};
      add('Compass pole and recipe', 'pole:' + p.k, p.nm, { def: +prose(p.upd), prov: 1, joins: p.codex ? 1 : 0.5, poles: +prose(p.dnd), trig: 0,
        beh: +has(r.release), cons: 0, scene: 0, inv: +has(r.install), ctr: 0, rq: +prose(p.ask), dis: 0, evc: 1, rp4: 0 });
    });
  T.CIRCLES.forEach(c => add('Circle of the descent', 'circle:' + c.c, c.c + ' ' + c.nm, { def: +prose(c.p), prov: 0.5, joins: 1, poles: 0,
    trig: 0, beh: +prose(c.p), cons: 0, scene: 0, inv: 0, ctr: 0, rq: +prose(c.see), dis: 0, evc: 0, rp4: 0 }));
  T.GOVERN.forEach(g => add('Governor corner', 'gov:' + g.nm, g.nm, { def: +prose(g.d), prov: 0, joins: 1, poles: 0.5, trig: 0, beh: +prose(g.d),
    cons: 0, scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: 0, rp4: 0 }));
  T.BLUEPRINT.forEach(b => add('Blueprint inversion', 'bp:' + b.nm, b.nm, { def: +prose(b.d), prov: 0.5, joins: 0, poles: 0.5, trig: 0,
    beh: +prose(b.d), cons: 0, scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: 0, rp4: 0 }));
  T.CASCADE.forEach(c => add('Cascade state', 'cascade:' + c.nm, c.nm, { def: +prose(c.d), prov: 0, joins: 0, poles: 0, trig: 0, beh: +prose(c.d),
    cons: 0, scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: 0, rp4: 0 }));
  ['SIGN_RUNS', 'CH_RUNS', 'CE_RUNS', 'LP_RUNS', 'HD_RUNS', 'HD_LINE_RUNS', 'ROOT_SAYS', 'NUM_DEBT_SAYS'].forEach(t =>
    Object.entries(T[t] || {}).forEach(([k, v]) => add('Blueprint line', 'line:' + t + ':' + k, t + ' ' + k, { def: +prose(v), prov: 0,
      joins: 0.5, poles: 0, trig: 0, beh: +prose(v), cons: /cost/.test(v) ? 0.5 : 0, scene: 0, inv: 0, ctr: 0, rq: 0, dis: 0, evc: 0, rp4: 0 })));
  return R;
}

/* ---------- 3: a depth record, checked strictly ---------- */
function judgeDepth(x) {
  const o = {}, why = {}, errors = [];
  const set = (k, v, w) => { o[k] = v; why[k] = w; };
  if (!x || typeof x !== 'object') return { o, why, errors: ['not an object'] };
  const all = JSON.stringify(x);
  if (PLACEHOLDER.test(all)) errors.push('carries placeholder text (' + all.match(PLACEHOLDER)[0] + '), which is a field filled, not a component written');
  if (x.joins !== undefined || (x.d2 && x.d2.joins !== undefined)) errors.push('stores joins, which are derived from the engine and never stored, or there are two truths');
  if (!REVIEW.includes(x.reviewState)) errors.push('reviewState ' + JSON.stringify(x.reviewState) + ' is not one of ' + REVIEW.join(', '));
  if (x.ownerApproved !== true && x.ownerApproved !== false) errors.push('ownerApproved must be true or false, never left out');
  if (x.ownerApproved === true && !(x.reviewState === 'owner-approved' && x.approvedBy && x.approvedOn))
    errors.push('ownerApproved is true without reviewState owner-approved, approvedBy and approvedOn: approval is never inferred');
  const d1 = x.d1 || {}, d2 = x.d2 || {}, d3 = x.d3 || {}, d4 = x.d4 || {};
  set('def', prose(d1.definition, 100) && sentences(d1.definition) >= 2 ? 1 : prose(d1.definition) ? 0.5 : 0,
    'definition of at least 100 characters and two sentences, distinct from the name');
  const pv = Array.isArray(d1.provenance) ? d1.provenance : [];
  const pvOk = pv.filter(p => p && typeof p.source === 'string' && p.source.trim().length >= 8 && EVC.includes(p.class));
  set('prov', pv.length && pvOk.length === pv.length ? 1 : pvOk.length ? 0.5 : 0, 'provenance[] of {source, class}, class one of T1\'s four');
  set('poles', prose(d2.opposite, 40) ? 1 : 0, 'its own opposite, at least 40 characters');
  set('trig', prose(d3.trigger, 60) ? 1 : prose(d3.trigger) ? 0.5 : 0, 'trigger, at least 60 characters');
  set('beh', prose(d3.move, 60) ? 1 : prose(d3.move) ? 0.5 : 0, 'the move a person makes, at least 60 characters');
  set('cons', (prose(d3.payoff, 40) ? 0.5 : 0) + (prose(d3.cost, 40) ? 0.5 : 0), 'payoff and cost, each at least 40 characters');
  set('scene', prose(d3.scene, 120) ? 1 : prose(d3.scene) ? 0.5 : 0, 'a lived scene, at least 120 characters');
  set('inv', prose(d3.inversion, 60) ? 1 : prose(d3.inversion) ? 0.5 : 0, 'the healthy inversion as behaviour, at least 60 characters');
  // The rubric's counterexample is two things: the same behaviour when it is
  // healthy, and the same behaviour with another cause. One alone is half.
  const ce = Array.isArray(d3.counterexamples) ? d3.counterexamples.filter(c => c && prose(c.text, 60)) : [];
  const kinds = new Set(ce.map(c => c.kind));
  set('ctr', kinds.has('healthy') && kinds.has('other-cause') ? 1 : ce.length ? 0.5 : 0,
    'counterexamples[] with both kinds, healthy and other-cause, each at least 60 characters');
  const rq = Array.isArray(d4.recognition) ? d4.recognition : [];
  set('rq', rq.length && rq.every(q => prose(q) && /\?\s*$/.test(q)) ? 1 : rq.length ? 0.5 : 0, 'recognition[] of real questions');
  const ds = Array.isArray(d4.disconfirmers) ? d4.disconfirmers.filter(s => prose(s, 60)) : [];
  set('dis', ds.length >= 2 ? 1 : ds.length ? 0.5 : 0, 'at least two concrete disconfirmers, each at least 60 characters');
  const ec = d4.evidenceClass && typeof d4.evidenceClass === 'object' ? d4.evidenceClass : {};
  const ecOk = Object.values(ec).length && Object.values(ec).every(v => EVC.includes(v));
  set('evc', ecOk && ['d1', 'd3', 'd4'].every(k => ec[k]) ? 1 : ecOk ? 0.5 : 0, 'evidenceClass labelling d1, d3 and d4 in T1\'s four words');
  set('rp4', ...passes(d4.researchPasses));
  return { o, why, errors };
}

// Four passes are four: p1 to p4 once each, each finding at least 300
// characters with a source and an evidence label, at least three distinct
// sources across them, and no two sharing half their words. The last is the
// mechanical stand in for "not four paraphrases": it catches a pass copied
// into four slots and it cannot judge whether a pass is good, which is the
// owner's reading and is said so.
function passes(rp) {
  const W = 'four passes p1 to p4 once each, 300 characters, sourced, labelled, at least three distinct sources, no two alike';
  if (!Array.isArray(rp) || !rp.length) return [0, W + '; none'];
  const ok = rp.filter(p => p && /^p[1-4]$/.test(p.pass) && prose(p.finding, 300) && Array.isArray(p.sources) && p.sources.length
    && p.sources.every(s => typeof s === 'string' && s.trim().length >= 8) && EVC.includes(p.evidence));
  const ids = new Set(ok.map(p => p.pass));
  // Digits count as word characters. The first cut matched letters only, and
  // the self test's copied passes, written in tokens like p1w0, read as
  // sharing no words at all, so four copies of one pass scored as four
  // passes. A pass of figures and codes would have done the same.
  const words = p => new Set(String(p.finding).toLowerCase().match(/[a-z0-9]{4,}/g) || []);
  let alike = null;
  for (let i = 0; i < ok.length; i++) for (let j = i + 1; j < ok.length; j++) {
    const a = words(ok[i]), b = words(ok[j]); const inter = [...a].filter(w => b.has(w)).length;
    if (inter / (a.size + b.size - inter || 1) >= 0.5) alike = ok[i].pass + ' and ' + ok[j].pass;
  }
  const srcs = new Set([].concat(...ok.map(p => p.sources)));
  if (rp.length === 4 && ids.size === 4 && ok.length === 4 && !alike && srcs.size >= 3) return [1, W];
  return [ok.length ? 0.5 : 0, W + '; ' + [rp.length !== 4 ? rp.length + ' passes' : '', ok.length < rp.length ? (rp.length - ok.length) + ' short, unsourced or unlabelled' : '',
    ids.size < ok.length ? 'a pass number repeated' : '', alike ? alike + ' share half their words' : '', srcs.size < 3 ? srcs.size + ' distinct sources' : ''].filter(Boolean).join(', ')];
}

/* ---------- the registry: canon, overlaid by depth records ---------- */
function grade(c) {
  const g = {};
  for (const d in D) {
    const v = D[d].map(k => c[k]);
    if (v.every(x => x === 'n')) { g[d] = 'N'; continue; }
    const live = v.filter(x => x !== 'n'), y = live.filter(x => x === 1).length, h = live.filter(x => x > 0 && x < 1).length;
    g[d] = y === live.length ? 'P' : (y + h ? 'H' : 'F');
  }
  return g;
}

function registry(T, drafts) {
  const R = inventory(T), depth = Object.assign({}, T.RECDEPTH || {}), source = {};
  Object.keys(depth).forEach(k => { source[k] = 'engine'; });
  Object.keys(drafts || {}).forEach(k => { depth[k] = drafts[k]; source[k] = 'draft'; });
  const ids = new Set(R.map(r => r.id)), orphanDepth = Object.keys(depth).filter(k => !ids.has(k));
  R.forEach(r => {
    const c = Object.assign({}, r.canon);
    r.why = {};
    if (depth[r.id]) {
      const j = judgeDepth(depth[r.id]);
      r.depthFrom = source[r.id]; r.errors = j.errors; r.why = j.why;
      // a refused record contributes nothing: it is not half a record
      if (!j.errors.length) COMP.forEach(k => { if (k !== 'joins' && c[k] !== 'n' && j.o[k] > c[k]) c[k] = j.o[k]; });
      r.ownerApproved = !j.errors.length && depth[r.id].ownerApproved === true;
    }
    r.c = c; r.g = grade(c);
    r.pass = Object.values(r.g).every(v => v === 'P' || v === 'N');
    r.missing = COMP.filter(k => c[k] !== 'n' && c[k] < 1).map(k => c[k] > 0 ? k + '~' : k);
  });
  return { R, orphanDepth };
}

function measure(R) {
  const m = { records: R.length, pass_all: R.filter(r => r.pass).length, owner_approved: R.filter(r => r.pass && r.ownerApproved).length,
    pass_depth: {}, components_full: {} };
  Object.keys(D).forEach(d => { m.pass_depth[d] = R.filter(r => r.g[d] === 'P').length; });
  COMP.forEach(k => { m.components_full[k] = R.filter(r => r.c[k] === 1).length; });
  return m;
}

function headline(m) {
  return 'records: ' + m.pass_all + ' of ' + m.records + ' pass all four depths, ' + m.owner_approved + ' owner approved; depth by depth D1 '
    + m.pass_depth.D1 + ', D2 ' + m.pass_depth.D2 + ', D3 ' + m.pass_depth.D3 + ', D4 ' + m.pass_depth.D4;
}

function table(R) {
  const cell = (a, k) => {
    const v = a.map(r => r.c[k]); if (v.every(x => x === 'n')) return 'n';
    const y = v.filter(x => x === 1).length, h = v.filter(x => x > 0 && x < 1).length;
    return y === v.length ? 'Y' : (!y && !h ? '-' : (h === v.length ? '~' : (y ? 'y' + y : '~' + h)));
  };
  const out = ['Y every record, - none, ~ partial in every record, yN N records full, ~N N records partial, n not applicable', '',
    'category'.padEnd(26) + '   n pass  ' + COMP.map(k => k.padEnd(6)).join('')];
  [...new Set(R.map(r => r.cat))].forEach(c => {
    const a = R.filter(r => r.cat === c);
    out.push(c.padEnd(26).slice(0, 26) + String(a.length).padStart(4) + String(a.filter(r => r.pass).length).padStart(5) + '  ' + COMP.map(k => cell(a, k).padEnd(6)).join(''));
  });
  return out.join('\n');
}

/* ---------- --gate: the checker against known cases, then the ledger ---------- */
// The fixture holds the checker's arithmetic and nothing else. Its prose is
// built from distinct tokens so the four passes cannot share words by
// accident; a fixture written as real content would be a record, and records
// live in the engine or in a draft file the owner reads.
function fixture() {
  const t = (tag, n) => Array.from({ length: n }, (_, i) => tag + 'w' + i).join(' ') + '.';
  const pass = n => ({ pass: 'p' + n, title: 'pass ' + n, finding: t('p' + n, 60), sources: ['fixture source ' + n], evidence: 'editorial-hypothesis' });
  return {
    reviewState: 'draft', ownerApproved: false,
    d1: { definition: t('def', 12) + ' ' + t('defb', 12), provenance: [{ source: 'fixture source 0', class: 'source-originated' }] },
    d2: { opposite: t('opp', 10) },
    d3: { trigger: t('trig', 14), move: t('move', 14), payoff: t('pay', 10), cost: t('cost', 10), scene: t('scene', 25), inversion: t('inv', 14),
      counterexamples: [{ kind: 'healthy', text: t('ceh', 14) }, { kind: 'other-cause', text: t('ceo', 14) }], neighbours: [] },
    d4: { recognition: ['fixture recognition question for this record?'], disconfirmers: [t('dis', 14), t('disb', 14)],
      evidenceClass: { d1: 'source-originated', d3: 'editorial-hypothesis', d4: 'editorial-hypothesis' }, researchPasses: [1, 2, 3, 4].map(pass) },
  };
}

function selfTest(T) {
  const lines = []; let P = 0, F = 0;
  const ok = (cond, msg) => { lines.push((cond ? '  ok   ' : 'FAIL ') + msg); cond ? P++ : F++; };
  const full = j => COMP.filter(k => k !== 'joins').every(k => j.o[k] === 1) && !j.errors.length;
  const clone = () => JSON.parse(JSON.stringify(fixture()));
  ok(full(judgeDepth(fixture())), 'the known good fixture scores every component full, so the checker can pass a record at all');
  // Each component removed alone must fail that component and no other: a
  // case that fails for another reason is not a pass.
  const drop = {
    def: x => { x.d1.definition = 'Short.'; }, prov: x => { x.d1.provenance = []; }, poles: x => { delete x.d2.opposite; },
    trig: x => { delete x.d3.trigger; }, beh: x => { delete x.d3.move; }, cons: x => { delete x.d3.cost; }, scene: x => { delete x.d3.scene; },
    inv: x => { delete x.d3.inversion; }, ctr: x => { x.d3.counterexamples = x.d3.counterexamples.slice(0, 1); },
    rq: x => { x.d4.recognition = ['a statement and not a question at all.']; }, dis: x => { x.d4.disconfirmers = []; },
    evc: x => { x.d4.evidenceClass = { d1: 'fact' }; }, rp4: x => { x.d4.researchPasses.pop(); },
  };
  Object.keys(drop).forEach(k => {
    const x = clone(); drop[k](x); const j = judgeDepth(x);
    const others = COMP.filter(c => c !== k && c !== 'joins' && j.o[c] !== 1);
    ok(j.o[k] < 1 && !others.length, k + ' taken out alone fails ' + k + (others.length ? ', and also ' + others.join(' ') : ' and nothing else'));
  });
  const shallow = clone(); shallow.d4.researchPasses = [1, 2, 3, 4].map(n => ({ pass: 'p' + n, finding: 'A short field about the record.', sources: ['some source'], evidence: 'editorial-hypothesis' }));
  ok(judgeDepth(shallow).o.rp4 < 1, 'four nonempty short fields are not four passes (T1, first paragraph)');
  const para = clone(); para.d4.researchPasses = para.d4.researchPasses.map(p => Object.assign({}, p, { finding: para.d4.researchPasses[0].finding }));
  ok(judgeDepth(para).o.rp4 < 1, 'one pass copied into four slots fails as paraphrase');
  const dup = clone(); dup.d4.researchPasses[3].pass = 'p1';
  ok(judgeDepth(dup).o.rp4 < 1, 'a pass number repeated fails, so p1 to p4 are each present once');
  const unsrc = clone(); unsrc.d4.researchPasses[2].sources = [];
  ok(judgeDepth(unsrc).o.rp4 < 1, 'an unsourced pass fails');
  const tbd = clone(); tbd.d3.scene = 'TBD, the scene will be written after the rest of the record is done.';
  ok(judgeDepth(tbd).errors.length > 0, 'placeholder text refuses the record');
  const filler = clone(); filler.d1.definition = 'This inferred Saboteur pattern organizes around the seat. It is generated.';
  ok(judgeDepth(filler).errors.length > 0, 'the knowledge prototype\'s generated filler refuses the record');
  const self = clone(); self.ownerApproved = true;
  ok(judgeDepth(self).errors.length > 0, 'ownerApproved true without the owner-approved state, a name and a date is refused');
  const appr = clone(); Object.assign(appr, { ownerApproved: true, reviewState: 'owner-approved', approvedBy: 'owner', approvedOn: '2026-11-01' });
  ok(!judgeDepth(appr).errors.length, 'a record approved with state, name and date is accepted');
  const joins = clone(); joins.d2.joins = [1, 2, 3];
  ok(judgeDepth(joins).errors.length > 0, 'a depth record that stores joins is refused');
  // the registry itself, against the engine in hand
  const { R } = registry(T, {});
  const ids = R.map(r => r.id), dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);
  ok(!dupIds.length, 'every record has its own identity key' + (dupIds.length ? '; repeated: ' + [...new Set(dupIds)].join(', ') : ''));
  const unkeyed = R.filter(r => /:\?/.test(r.id));
  ok(!unkeyed.length, 'every generated saboteur resolves to a cluster code' + (unkeyed.length ? '; not: ' + unkeyed.map(r => r.nm).join(', ') : ''));
  const cats = [...new Set(R.map(r => r.cat))];
  ok(cats.every(c => R.some(r => r.cat === c)) && cats.length === 21, cats.length + ' categories enumerated, the audit\'s 21');
  // the overlay moves the count, so the gate below can see progress at all
  const first = R.find(r => r.cat === 'Saboteur, named'), over = registry(T, { [first.id]: fixture() }).R.find(r => r.id === first.id);
  ok(over.g.D3 === 'P' && over.g.D4 === 'P' && !over.ownerApproved, 'a complete draft lifts D3 and D4 on its record and is not counted approved');
  const refused = registry(T, { [first.id]: tbd }).R.find(r => r.id === first.id);
  ok(refused.g.D4 === first.g.D4 || refused.g.D4 !== 'P', 'a refused draft adds nothing to its record');
  return { lines, P, F };
}

function gate(T) {
  const st = selfTest(T);
  const lines = st.lines.slice(); let P = st.P, F = st.F;
  const ok = (cond, msg) => { lines.push((cond ? '  ok   ' : 'FAIL ') + msg); cond ? P++ : F++; };
  const { R, orphanDepth } = registry(T, {});
  ok(!orphanDepth.length, 'every engine depth record names a record that exists' + (orphanDepth.length ? '; not: ' + orphanDepth.join(', ') : ''));
  const m = measure(R);
  let L = null;
  try { L = JSON.parse(fs.readFileSync(LEDGER, 'utf8')); } catch (e) { ok(false, 'tests/records-coverage.json cannot be read: ' + e.message); }
  if (L) {
    const at = (o, p) => p.split('.').reduce((a, k) => a == null ? a : a[k], o);
    const paths = ['records', 'pass_all', 'owner_approved'].concat(Object.keys(D).map(d => 'pass_depth.' + d), COMP.map(k => 'components_full.' + k));
    paths.forEach(p => {
      const want = at(L, p), got = at(m, p);
      ok(want === got, p + ' reads ' + got + (want === got ? ', as the ledger says' : want === undefined ? ', and the ledger has no value: write ' + got
        : got < want ? ', below the ledger\'s ' + want + '. Coverage went backwards' : ', above the ledger\'s ' + want + '. Write ' + got + ' in tests/records-coverage.json, in this change, read off this run'));
    });
  }
  lines.forEach(l => console.log(l));
  console.log('\n' + headline(m));
  console.log('\n===== ' + P + ' passed, ' + F + ' failed =====');
  return F ? 1 : 0;
}

function main(argv) {
  let engine = path.resolve(process.env.ENGINE || path.join(ROOT, 'engine.js')), drafts = null, json = null, rec = null, mode = 'table';
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--engine') engine = path.resolve(argv[++i]);
    else if (a === '--drafts') drafts = argv[++i];
    else if (a === '--json') json = argv[++i];
    else if (a === '--record') { rec = argv[++i]; mode = 'record'; }
    else if (a === '--missing') mode = 'missing';
    else if (a === '--gate') mode = 'gate';
    else { console.log('FAIL unknown option ' + a); return 1; }
  }
  const T = loadEngine(engine);
  if (mode === 'gate') return gate(T);
  let D0 = {};
  if (drafts) {
    try { D0 = JSON.parse(fs.readFileSync(drafts, 'utf8')).records || {}; } catch (e) { console.log('FAIL ' + drafts + ': ' + e.message); return 1; }
  }
  const { R, orphanDepth } = registry(T, D0);
  if (json) fs.writeFileSync(json, JSON.stringify(R.map(r => ({ id: r.id, cat: r.cat, nm: r.nm, depth: r.g, pass: r.pass, ownerApproved: !!r.ownerApproved,
    depthFrom: r.depthFrom || null, missing: r.missing, components: r.c, errors: r.errors || [] })), null, 1));
  if (mode === 'record') {
    const r = R.find(x => x.id === rec);
    if (!r) { console.log('FAIL no record ' + rec + '. Keys look like sab:S06, sab:S.sacral.Anger, node:40, hcx:Collapse.'); return 1; }
    console.log(r.id + '  ' + r.nm + '  (' + r.cat + ')' + (r.depthFrom ? '  depth record from ' + r.depthFrom : '  no depth record'));
    (r.errors || []).forEach(e => console.log('  REFUSED ' + e));
    Object.keys(D).forEach(d => console.log('  ' + d + ' ' + r.g[d] + '  ' + D[d].map(k => k + '=' + (r.c[k] === 'n' ? 'n/a' : r.c[k] === 1 ? 'full' : r.c[k] > 0 ? 'partial' : 'absent')
      + (r.why[k] && r.c[k] !== 1 ? ' (wants ' + r.why[k] + ')' : '')).join(', ')));
    console.log('  ' + (r.pass ? 'passes' : 'does not pass') + ', ' + (r.ownerApproved ? 'owner approved' : 'not owner approved'));
    return 0;
  }
  if (mode === 'missing') R.forEach(r => console.log(r.id.padEnd(34) + (r.pass ? 'pass' : r.missing.join(' ')) + (r.depthFrom ? '  [' + r.depthFrom + ']' : '')));
  else console.log(table(R));
  orphanDepth.forEach(k => console.log('FAIL depth record ' + k + ' names no record'));
  if (drafts) console.log('\nwith ' + Object.keys(D0).length + ' draft depth records from ' + drafts + ' laid over the canon. Drafts are not canon.');
  console.log('\n' + headline(measure(R)));
  return orphanDepth.length ? 1 : 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
module.exports = { loadEngine, inventory, judgeDepth, registry, measure };
