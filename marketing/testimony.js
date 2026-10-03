#!/usr/bin/env node
/* ============================================================
   testimony.js

   THE TESTIMONIAL EXERCISE. SIMULATED, AND NEVER A PERSON.

   TASKS.md IN, his words: "Through their lenses, how do they see this
   product? How would they articulate this as a testimonial using real human
   kind of behavioral experience, from a results perspective or a novelty
   perspective. Simulate that till you have a good result. I want to hear
   what worked and what didn't work as well."

   Run from the repo root:

     node marketing/testimony.js          the whole exercise, printed
     node marketing/testimony.js --json   the same, as data

   WHAT IS MEASURED AND WHAT IS WRITTEN, KEPT APART.

     measured   every number a draft may carry. Read off the real engine for
                each of the nine reference fields in field.js, through the
                intake, the person's own story bank (sim/stories.js, written
                before the lexicon was consulted) and one release over the
                three heaviest loaded addresses
     written    the sentences. Mine, in each person's register, taken from
                their says line in engine/data/people.js and their simulated
                reactions in RESEARCH-icp.md. A draft is a slot template and
                the slots are filled from the measurement, never typed
     judged     every draft, by eight named checks below. Two are the gates
                this directory already runs, refuse.js and the voice gate.
                Six are new here, because both gates pass the category's own
                testimonial register word for word, which this file found on
                its first run: "I feel calmer and more like myself. My score
                went up. Life changing, highly recommend." passed all nine
                refusal rules and the voice gate

   THE STANDING RULE THIS SITS UNDER. GUARD.md, rule testimonial: there are no
   users yet, so any user voice is invented. Nothing this file writes may
   leave the building as a testimonial. Every draft carries SIMULATED and the
   name of a reference field, and tests.js asserts it. What the exercise is
   for is learning which angle holds, for which reader, before a real person
   ever says a word, and it says where the lines that hold may go instead.

   THE RELEASE ARITHMETIC IS LIFTED, AND GUARDED AGAINST ITS SOURCE. The charge
   half of a release lives in ui/release.js, which is the half allowed a
   document, so it cannot be required here. It is lifted verbatim, the same
   way proto/restructure/bankvault.js and proto/ninety/arc90.js lift it, and
   this file refuses to run if the source no longer carries the arithmetic it
   copied. The law half is releaseWork, called from the engine itself.

   HOST FREE. No document, no window, no fetch.
   ============================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const F = require(path.resolve(__dirname, 'field.js'));
const M = require(path.resolve(__dirname, 'match.js'));
const R = require(path.resolve(__dirname, 'refuse.js'));
const E = require(path.resolve(ROOT, process.env.ENGINE || 'engine.js'));
const { STORYBANK } = require(path.resolve(ROOT, 'sim', 'stories.js'));

let MEM = {};
E.bindStore(k => MEM[k], (k, v) => { MEM[k] = v; });

/* ------------------------------------------------------------
   THE LIFT, AND THE GUARD ON IT. Same four markers bankvault.js checks.
   ------------------------------------------------------------ */
const RSRC = fs.readFileSync(path.resolve(ROOT, 'atuned_src', 'ui', 'release.js'), 'utf8');
const LIFTOK = {
  take: /w0\*0\.21\+2/.test(RSRC),
  install: /share\*0\.62/.test(RSRC),
  cleared: /cleared:\(m\.w1<=6\)/.test(RSRC),
  work: /releaseWork\(CURP,/.test(RSRC)
};
const CHANM = /var CHAN=(\[[^;]*\]);/.exec(RSRC);
function liftError() {
  if (!CHANM || !Object.values(LIFTOK).every(Boolean)) {
    return 'ui/release.js no longer carries the arithmetic this file lifts: ' + JSON.stringify(LIFTOK);
  }
  return null;
}
const CHANS = CHANM ? Function('return ' + CHANM[1])().map(c => c[0] + c[2]) : [];

/* one release over the given addresses, as relCoolDown runs it. Returns the
   card rows, weights 0 to 100 as the release card prints them. */
function release(p, q) {
  const cap = E.meterBudget(p).cap;
  const plan = (q.length && cap > 0) ? E.meterPlan(p, q.map(n => n.i), CHANS, cap) : [];
  if (!plan.length) return { ran: false, rows: [], lines: 0 };
  const rows = [];
  q.forEach(n => {
    const w0 = n.sq * 10, d = -Math.round(w0 * 0.21 + 2), w1 = Math.max(0, w0 + d);
    const share = Math.abs(d) / 10 / Math.max(1, q.filter(x => x.cf === n.cf).length);
    E.S.charge[n.cf] = E.clamp((E.S.charge[n.cf] || 0) - share, 0, 10);
    E.S.replace[n.cf] = E.clamp((E.S.replace[n.cf] || 0) + share * 0.62, 0, 10);
    rows.push({ i: n.i, address: n.k, nerve: n.n, seat: n.b, w0: Math.round(w0), w1: Math.round(w1) });
  });
  const m = E.meterRun(p, plan);
  E.releaseWork(p, (m && m.fresh) || []);
  return { ran: true, rows, lines: plan.length };
}

const lc = s => String(s || '').toLowerCase();
const seatWord = b => ({ '3rd Eye': 'third eye' })[b] || lc(b);

/* ------------------------------------------------------------
   READ ONE REFERENCE FIELD. Intake, story, release. Every number a draft
   may carry comes out of this and nowhere else.
   ------------------------------------------------------------ */
function readPerson(nm) {
  const src = E.PEOPLE.find(p => p.nm === nm);
  const pin = F.PANEL.find(a => a.nm === nm);
  const p = E.blankProfile('You'); E.loadProfile(p);
  let r = F.readField(src, null);
  const key = F.keyOf(r);
  const reading = { grid: F.gridOf(r.tier), exGrid: F.exGridOf(r), charge: key.charge, seat: key.seat };
  const gate = M.gate(reading);
  const served = M.byField(reading).served;
  const out = {
    nm, age: src.age, role: src.role, says: src.says, weight: pin.w,
    grid: reading.grid, exGrid: reading.exGrid, band: r.tier,
    refused: !!gate, register: served ? (served.register || null) : null,
    hook: served ? served.id : null,
    heaviest: r.heaviest ? { address: r.heaviest.k, nerve: r.heaviest.n, seat: r.heaviest.b } : null
  };
  if (gate) { out.route = 'refused'; out.served = gate.served.hook; return out; }

  /* the story, read and not applied: which sentences the sniffer seats, and
     where. The address names are recorded and never put in a draft; see
     check 6, coordinate. */
  out.story = (STORYBANK[nm] || []).map(x => {
    const ps = E.parseStory(x[1]);
    const ids = [...new Set(ps.imprints.map(i => i.node))];
    const first = ids.length ? E.BY[ids[0]] : null;
    return { text: x[1], seated: ids.length, seat: first ? first.b : null, nerve: first ? first.n : null,
      addresses: ids.slice(0, 4).map(i => E.BY[i].k) };
  });
  out.storySeated = out.story.filter(s => s.seated).length;

  const snap = () => {
    const x = E.compute();
    return { cqRaw: x.CQ, cq: Math.round(x.CQ), ex: Number(x.EX.toFixed(1)), loaded: x.loaded.length,
      top: x.loaded.slice().sort((a, b) => b.sq - a.sq).slice(0, 3) };
  };
  let s0 = snap();
  out.intakeLoaded = s0.loaded;
  out.route = 'intake';
  if (!s0.loaded) {
    (STORYBANK[nm] || []).forEach(x => E.applyStory(x[1]));
    s0 = snap();
    out.route = s0.loaded ? 'story' : 'none';
  }
  out.before = { cq: s0.cq, cqRaw: s0.cqRaw, ex: s0.ex, loaded: s0.loaded };
  if (out.route === 'none') return out;
  const rel = release(p, s0.top);
  const s1 = snap();
  out.after = { cq: s1.cq, cqRaw: s1.cqRaw, ex: s1.ex, loaded: s1.loaded };
  out.rows = rel.rows;
  out.lines = rel.lines;
  return out;
}

/* ------------------------------------------------------------
   THE DRAFTS. Three rounds per angle. Round one is the category's own
   testimonial, deliberately, because it is what a wellness brand would
   write and the exercise has to show why it does not hold here. Round two is
   the readout. Round three is the person.

   Slots: {w0} {w1} {nerve} {seat} the heaviest released row. {L0} {L1}
   loaded before and after. {ex0} {ex1} expression. {cq0} {cq1} CQ as printed.
   {sseat} {snerve} where the chosen story sentence was seated. A draft whose
   slot the person's reading cannot fill is not written, and that absence is
   a finding, not a gap.
   ------------------------------------------------------------ */
const CATEGORY = {
  results: 'I feel calmer and more like myself than I have in years. My score went up after the first week. Life changing, highly recommend.',
  novelty: 'Nothing like anything I have tried. It is like it really knows me. A game changer for my whole wellbeing.'
};
const READOUT = {
  results: '{ADDR}, {NERVE}, {SEAT}: {w0} to {w1}. Loaded {L0} to {L1}. Expression {ex0} to {ex1}.',
  novelty: '{SADDR} at the {snerve}, {sseat} seat, from one sentence.'
};

/* round three, in each person's register. `story` picks the sentence of
   theirs the novelty draft is about, by its index in sim/stories.js, and
   `n` lists the numbers in the draft that come from their own words rather
   than the reading, with where each one is written. */
const VOICE = {
  Diane: {
    results: 'I wanted a number I did not already have. {L0} addresses sat above the line where it starts to cost. After one release, {L1} did.',
    novelty: 'I have taken 4 quizzes in airport lounges. This one read a sentence about my jaw, put it at the {sseat} seat, the {snerve}, and showed me the table.',
    story: 2, n: { 4: 'RESEARCH-icp.md section 1, "four of those in airport lounges"' }
  },
  Derek: {
    results: 'I watched the coherence number go from {cq0} to {cq1}, and the raw move under it was {cqd}, so that is rounding. The load is what moved: {L0} loaded addresses became {L1}.',
    first: { results: 'The coherence number did not move, and I checked. {L0} loaded addresses became {L1}. The heaviest, at the {nerve}, went from {w0} to {w1}.' },
    novelty: 'I wrote that my chest is tight on the warm up. It put that at the {sseat} seat, the {snerve}, and gave me the table instead of a pep talk.',
    story: 2, n: {}
  },
  Marcus: {
    results: 'Nothing sat above the line until I wrote. After my own sentences, {L0} did. One release, and the heaviest, at the {nerve}, went from {w0} to {w1}.',
    novelty: 'I wanted a claim specific enough to be wrong. A sentence about a timeline I lied about went to the {sseat} seat, the {snerve}. The table is open, so I checked it.',
    story: 3, n: {}
  },
  Angela: {
    results: 'After one release my {nerve} went from {w0} to {w1}.',
    novelty: 'Six modalities told me a story about it. This put my sentence about 3 funerals at the {sseat} seat, the {snerve}, and showed me where it lives.',
    story: 0, n: { 3: 'sim/stories.js, "at three funerals"', 6: 'engine/data/people.js role, "seeker, six modalities"' }
  },
  Sofia: {
    results: 'After one release my {nerve} went from {w0} to {w1}.',
    novelty: 'I read my clients in a minute and cannot read myself. I wrote that I was angry with a client. It put it at the {sseat} seat, the {snerve}.',
    story: 3, n: {}
  },
  James: {
    results: 'No ranking, which I asked for, and no opinion about my life. {L0} addresses above the line, {L1} after one release. The heaviest, the {nerve}, {w0} to {w1}.',
    novelty: 'I wrote that my chest is tight in every meeting. It put that at the {sseat} seat, the {snerve}, and said nothing about what kind of man that makes me.',
    story: 3, n: {}
  },
  Ana: {
    results: 'I needed to know it has an end. {L0} addresses above the line, {L1} after one release. The {nerve} went from {w0} to {w1}.',
    novelty: 'I wrote that he died a year ago. It put that at the {sseat} seat, the {snerve}, and did not ask me to be over it.',
    story: 2, n: {}
  },
  Rosa: {
    results: 'After one release my {nerve} went from {w0} to {w1}.',
    novelty: 'It read clear and said nothing here would relieve me of anything. Then it showed me all 112 addresses anyway, none lit.',
    story: null, n: {}
  }
};

/* ------------------------------------------------------------
   THE EIGHT CHECKS. The first two are the gates this directory already
   runs. The other six exist because both gates passed the category round.
   ------------------------------------------------------------ */
const CRITERIA = [
  ['guard', 'refuse.js returns no violation'],
  ['voice', 'the voice gate returns no hard failure'],
  ['grounded', 'every number in the line is one the engine produced for this person, or is quoted from their own words with the source named'],
  ['true', 'no claim the reading cannot make: no feeling it did not measure, and no score that moved when the printed CQ did not'],
  ['specific', 'survives the swap test: names a place the engine seats, and carries no phrase any wellness product could print'],
  ['coordinate', 'names a nerve and a seat, never an address name, which read in the first person is a label on the speaker'],
  ['person', 'somebody is speaking: first person, and not a readout'],
  ['labelled', 'carries SIMULATED and a reference field, so it cannot be mistaken for a user']
];

/* the feeling words the engine never measures, and the score claims */
const UNMEASURED = /\b(calm(er)?|lighter|peace(ful)?|happier|better than ever|healed|cured|fixed|transformed|more like myself|at ease|relaxed|grounded now|energ(y|ised|ized) (is )?back)\b/;
const SCORECLAIM = /\b(score|cq|coherence( number| quotient)?|number) (went up|rose|climbed|improved|jumped)\b/;
const NOMOVE = /\b(score|cq|coherence( number| quotient)?|number) (did not|didn't|never) (move|change|budge)\b|\b(score|cq|coherence( number| quotient)?) (stayed|held) (put|still|the same)\b/;
const TIMECLAIM = /\b(first|a|one|two|three|four|six) (day|week|month|year)s?\b(?! ago)|\bafter (a|the first) (week|month)\b/;
/* what any product on the shelf could print. The swap test, as a list, and
   every entry is a phrase the category actually uses rather than a word
   this product also uses. */
const CATEGORYWORDS = /\b(life[- ]chang\w+|changed my life|game[- ]changer|highly recommend|nothing like anything|really knows me|wellbeing|well-being|self[- ]care|best version|my journey|so grateful)\b/;
const NERVES = [...new Set(E.NODES.map(n => lc(n.n)))];
const SEATS = ['root', 'sacral', 'solar', 'heart', 'throat', 'third eye', 'crown'];
const ADDRNAMES = [...new Set(E.NODES.map(n => n.k))]
  .filter(k => E.CHARGES.indexOf(k) < 0 && k.length > 5).map(lc);

const WORDNUM = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
function numbersIn(text) {
  const t = lc(text).replace(/-/g, ' ');
  const out = (t.match(/\d+(\.\d+)?/g) || []).map(Number);
  const w = t.match(/\b[a-z]+\b/g) || [];
  for (let i = 0; i < w.length; i++) {
    if (WORDNUM[w[i]] === undefined) continue;
    let v = WORDNUM[w[i]];
    if (v >= 20 && WORDNUM[w[i + 1]] !== undefined && WORDNUM[w[i + 1]] < 10) { v += WORDNUM[w[i + 1]]; i++; }
    out.push(v);
  }
  return out;
}

function fill(tpl, P) {
  const top = (P.rows && P.rows[0]) || null;
  const st = (VOICE[P.nm] && VOICE[P.nm].story !== null && P.story) ? P.story[VOICE[P.nm].story] : null;
  const S = {
    w0: top && top.w0, w1: top && top.w1, nerve: top && lc(top.nerve), seat: top && seatWord(top.seat),
    NERVE: top && top.nerve, SEAT: top && top.seat, ADDR: top && top.address,
    /* a count of addresses reads as a word, a reading off the card as the
       figure the card prints */
    L0: P.before && lc(spell(P.before.loaded)), L1: P.after && lc(spell(P.after.loaded)),
    cqd: P.before && P.after && (P.after.cqRaw - P.before.cqRaw).toFixed(2),
    ex0: P.before && P.before.ex.toFixed(1), ex1: P.after && P.after.ex.toFixed(1),
    cq0: P.before && P.before.cq, cq1: P.after && P.after.cq,
    sseat: st && st.seat && seatWord(st.seat), snerve: st && lc(st.nerve), SADDR: st && st.addresses[0]
  };
  let missing = false;
  const text = tpl.replace(/\{(\w+)\}/g, (_, k) => {
    if (S[k] === null || S[k] === undefined) { missing = true; return '?'; }
    return String(S[k]);
  });
  /* a count at the head of a sentence is written as a word, the house way */
  const out = text.replace(/(^|[.?!]\s+)(\d+)\b/g, (m, a, d) => a + spell(Number(d)));
  /* and every sentence opens on a capital, whatever the slot put there */
  return missing ? null : out.replace(/(^|[.?!]\s+)([a-z])/g, (m, a, c) => a + c.toUpperCase());
}
function spell(n) {
  const names = Object.keys(WORDNUM).reduce((o, k) => { o[WORDNUM[k]] = k; return o; }, {});
  if (names[n] !== undefined) return names[n].charAt(0).toUpperCase() + names[n].slice(1);
  const t = Math.floor(n / 10) * 10, u = n % 10;
  if (n < 100 && names[t] && names[u]) { const s = names[t] + ' ' + names[u]; return s.charAt(0).toUpperCase() + s.slice(1); }
  return String(n);
}

function grounding(P) {
  const g = new Map();
  const add = (v, why) => { if (v !== null && v !== undefined && !g.has(Number(v))) g.set(Number(v), why); };
  add(1, 'one release was run');
  add(112, 'the address count stated to users');
  if (P.before) { add(P.before.loaded, 'loaded before'); add(P.before.ex, 'expression before'); add(P.before.cq, 'CQ printed before'); }
  if (P.after) { add(P.after.loaded, 'loaded after'); add(P.after.ex, 'expression after'); add(P.after.cq, 'CQ printed after'); }
  if (P.before && P.after) add(Number((P.after.cqRaw - P.before.cqRaw).toFixed(2)), 'the raw CQ move under the printed one');
  (P.rows || []).forEach(r => { add(r.w0, r.address + ' before'); add(r.w1, r.address + ' after'); });
  const v = VOICE[P.nm];
  if (v) Object.keys(v.n).forEach(k => add(Number(k), v.n[k]));
  return g;
}

function judge(d, P) {
  const t = lc(d.text), res = {};
  res.guard = R.check(d.text).length === 0;
  res.voice = null;                              /* filled by the batch call */
  const g = grounding(P);
  const nums = numbersIn(d.text);
  const loose = nums.filter(x => !g.has(x));
  /* a span of time is a number too. The exercise ran one release, so a line
     that says a week or a month has passed claims time nobody measured. */
  res.grounded = loose.length === 0 && !TIMECLAIM.test(t);
  /* BOTH DIRECTIONS, AND THE SECOND WAS ADDED AFTER IT MISSED ONE. The first
     cut only refused a score that rose when the printed CQ did not. Derek's
     first draft said the opposite, "the coherence number did not move", and
     passed: his raw CQ went 48.48 to 48.53, which prints 48 then 49. A claim
     that the number held is as checkable as a claim that it rose. */
  const printedMoved = !!(P.before && P.after && P.after.cq !== P.before.cq);
  res.true = !UNMEASURED.test(t) && !(SCORECLAIM.test(t) && !printedMoved) && !(NOMOVE.test(t) && printedMoved);
  res.specific = !CATEGORYWORDS.test(t) &&
    (NERVES.some(n => t.indexOf(n) >= 0) || SEATS.some(s => new RegExp('\\b' + s + '\\b').test(t)) || /\b112\b|\btable\b/.test(t));
  res.coordinate = !ADDRNAMES.some(a => t.indexOf(a) >= 0);
  res.person = /\b(i|my|me)\b/.test(t);
  res.labelled = d.simulated === true && !!F.PANEL.find(a => a.nm === d.person);
  d.loose = loose;
  d.checks = res;
  return d;
}

/* the voice gate, once, over every draft. Same file mode tests.js uses, same
   canary, because a gate that finds nothing has to prove it can find
   something. */
function voiceBatch(drafts) {
  const gatePath = path.resolve(ROOT, '.claude', 'skills', 'atuned-voice', 'check.py');
  if (!fs.existsSync(gatePath)) return { ran: false, why: 'skill not present' };
  const { spawnSync } = require('child_process');
  const os = require('os');
  const CANARY = 'Address 31 of 112 is where the charge sits in your body.';
  const lines = drafts.map(d => d.text).concat([CANARY]);
  const lit = t => "'" + t.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "',";
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mkt-testimony-'));
  const tmp = path.join(dir, 'lines.js');
  fs.writeFileSync(tmp, lines.map(lit).join('\n') + '\n');
  const run = spawnSync('python3', [gatePath, tmp], { encoding: 'utf8', cwd: ROOT });
  fs.rmSync(dir, { recursive: true, force: true });
  const out = (run.stdout || '') + (run.stderr || '');
  if (run.status !== 0 && run.status !== 1) return { ran: false, why: 'gate exit ' + run.status };
  const hits = [];
  const re = /\[([^\]]+)\] \S*lines\.js:(\d+)/g;
  let m;
  while ((m = re.exec(out))) hits.push({ rule: m[1], line: Number(m[2]) - 1 });
  const canary = hits.some(h => h.line === lines.length - 1);
  if (!canary) return { ran: false, why: 'the canary was not caught' };
  drafts.forEach((d, i) => {
    const mine = hits.filter(h => h.line === i).map(h => h.rule);
    d.checks.voice = mine.length === 0;
    d.voiceHits = mine;
  });
  return { ran: true };
}

/* ------------------------------------------------------------
   WHO WOULD RECOGNISE A LINE. A testimonial is read by somebody else, so the
   question is not whether the speaker's numbers are real but how many readers
   carry most at the seat the line names. Measured on the panel.
   ------------------------------------------------------------ */
function panelFacts(seed) {
  const panel = F.build(1000, seed);
  const bySeat = {};
  panel.forEach(x => { if (x.seat) bySeat[x.seat] = (bySeat[x.seat] || 0) + 1; });

  /* can this person produce a results testimonial at all on the intake alone.
     Re-read with the same jitter build() used, checked against build() to
     the person, and one release run on anybody with something loaded. */
  const cj = 1.2, lj = 0.9;
  const byArch = {};
  let disagree = 0;
  panel.forEach(x => {
    const src = E.PEOPLE.find(p => p.nm === x.archetype);
    const rc = F.stream(seed, x.ix, 1), rl = F.stream(seed, x.ix, 2);
    const cd = E.CHARGES.map(() => (rc() * 2 - 1) * cj);
    const ld = E.SINAMES.map(() => (rl() * 2 - 1) * lj);
    const p = E.blankProfile('You'); E.loadProfile(p);
    const r = F.readField(src, { charge: i => cd[i], law: i => ld[i] });
    if (Math.abs(r.CQ - x.cq) > 1e-9) disagree++;
    const a = byArch[x.archetype] || (byArch[x.archetype] = { n: 0, gated: 0, canRelease: 0, dLoaded: [], dEx: [], dCq: 0 });
    a.n++;
    if (M.gate(x)) { a.gated++; return; }
    const L0 = r.loaded.length;
    if (!L0) return;
    a.canRelease++;
    const ex0 = r.EX, cq0 = Math.round(r.CQ);
    release(p, r.loaded.slice().sort((u, v) => v.sq - u.sq).slice(0, 3));
    const r1 = E.compute();
    a.dLoaded.push(L0 - r1.loaded.length);
    a.dEx.push(r1.EX - ex0);
    if (Math.round(r1.CQ) !== cq0) a.dCq++;
  });
  const med = xs => { if (!xs.length) return null; const s = xs.slice().sort((u, v) => u - v); return s[Math.floor(s.length / 2)]; };
  Object.keys(byArch).forEach(k => {
    const a = byArch[k];
    a.medLoadedDrop = med(a.dLoaded); a.medExGain = med(a.dEx);
    delete a.dLoaded; delete a.dEx;
  });
  return { n: panel.length, bySeat, byArch, disagree };
}

/* HOW FAR CQ IS FROM MOVING, for the people who can release. Releases of the
   same shape, three addresses by four channels, each on fresh ground in
   descending weight, until the printed number changes. The allowance is not
   modelled: the tier ladder decides how fast this can happen, not this file. */
function runsToMoveCq(nm) {
  const src = E.PEOPLE.find(p => p.nm === nm);
  const p = E.blankProfile('You'); E.loadProfile(p);
  const r = F.readField(src, null);
  const c0 = Math.round(r.CQ);
  const order = E.W.filter(n => n.cf).slice().sort((a, b) => b.sq - a.sq);
  let runs = 0, i = 0;
  while (i < order.length) {
    const q = order.slice(i, i + 3); i += 3; runs++;
    const keys = [];
    q.forEach(n => CHANS.forEach(c => keys.push(n.i + ':' + c + ':0')));
    const w = E.releaseWork(p, keys);
    if (Math.round(w.cq1) !== c0) return { runs, patterns: runs * 12, from: c0, to: Math.round(w.cq1) };
  }
  return { runs: null, patterns: i * 4, from: c0, to: Math.round(E.cqSum()), note: 'every address opened once and the printed CQ did not move' };
}

/* ------------------------------------------------------------
   THE RUN.
   ------------------------------------------------------------ */
function run(opt) {
  opt = opt || {};
  const le = liftError();
  if (le) throw new Error(le);
  const people = F.PANEL.map(a => readPerson(a.nm));
  const drafts = [];
  people.forEach(P => {
    if (P.refused) return;
    ['results', 'novelty'].forEach(angle => {
      const V = VOICE[P.nm] || {};
      [['category', CATEGORY[angle]], ['readout', READOUT[angle]],
        ['first', V.first && V.first[angle]], ['voice', V[angle]]]
        .forEach(([round, tpl]) => {
          if (!tpl) return;
          const text = fill(tpl, P);
          if (text === null) {
            drafts.push({ person: P.nm, angle, round, text: null, simulated: true,
              unwritable: angle === 'results' ? 'nothing to release: ' + P.route : 'no sentence seated' });
            return;
          }
          drafts.push(judge({ person: P.nm, angle, round, text, simulated: true, label: 'SIMULATED. ' + P.nm + ' is a reference field, not a person.' }, P));
        });
    });
  });
  const written = drafts.filter(d => d.text);
  const vb = opt.voice === false ? { ran: false, why: 'skipped' } : voiceBatch(written);
  written.forEach(d => {
    const c = d.checks;
    d.lands = Object.keys(c).every(k => c[k] === true || (k === 'voice' && c[k] === null && !vb.ran));
    const P = people.find(x => x.nm === d.person);
    /* landing on the checks is not the same as being usable. The dosed keys
       stay inside, whatever the words, because the dose only works when the
       reading chose the reader. MARKETING-social.md 3c. */
    d.inside = d.lands && P.register === 'dosed';
  });
  const out = { people, drafts, voice: vb, criteria: CRITERIA };
  if (opt.panel !== false) {
    out.panel = panelFacts(20260920);
    out.cqRuns = people.filter(P => P.route === 'intake').map(P => Object.assign({ nm: P.nm }, runsToMoveCq(P.nm)));
    /* recognition: how many of the thousand carry most at the seat a line
       names. A reader at another seat reads it as somebody else's news. */
    written.forEach(d => {
      const P = people.find(x => x.nm === d.person);
      const st = VOICE[P.nm] && VOICE[P.nm].story !== null && P.story ? P.story[VOICE[P.nm].story] : null;
      const seat = d.angle === 'results' ? (P.rows && P.rows[0] && P.rows[0].seat) : (st && st.seat);
      d.seat = seat || null;
      d.recognise = seat ? (out.panel.bySeat[seat] || 0) : null;
    });
  }
  return out;
}

module.exports = { run, readPerson, judge, fill, grounding, numbersIn, CRITERIA, CATEGORY, READOUT, VOICE, liftError };

if (require.main === module) {
  const o = run();
  if (process.argv.indexOf('--json') >= 0) { console.log(JSON.stringify(o, null, 1)); process.exit(0); }
  const say = s => console.log(s);
  say('testimony.js  SIMULATED. Nine reference fields from field.js, read through the real engine.');
  say('voice gate: ' + (o.voice.ran ? 'ran, canary caught' : 'not run, ' + o.voice.why));
  say('');
  o.people.forEach(P => {
    say('== ' + P.nm + ', ' + P.age + ', ' + P.role + '. level ' + P.grid + ' on CQ, ' + P.exGrid + ' on expression, band ' + P.band
      + (P.hook ? ', served ' + P.hook + ' (' + P.register + ')' : ''));
    if (P.refused) { say('   refused by the band gate. No testimonial is written. Served: ' + P.served); say(''); return; }
    say('   story: ' + P.storySeated + ' of ' + P.story.length + ' of their own sentences seated by the sniffer');
    say('   route: ' + P.route + (P.route === 'story' ? ' (nothing loaded at intake, ' + P.before.loaded + ' after their own sentences)' : ''));
    if (P.after) {
      const t = P.rows[0];
      say('   release: ' + P.lines + ' lines. loaded ' + P.before.loaded + ' to ' + P.after.loaded
        + ', expression ' + P.before.ex.toFixed(1) + ' to ' + P.after.ex.toFixed(1)
        + ', CQ ' + P.before.cqRaw.toFixed(2) + ' to ' + P.after.cqRaw.toFixed(2)
        + ' (printed ' + P.before.cq + ' to ' + P.after.cq + '). heaviest ' + t.address + ' at the ' + t.nerve + ', ' + t.w0 + ' to ' + t.w1);
    }
    o.drafts.filter(d => d.person === P.nm).forEach(d => {
      if (!d.text) { say('   [' + d.angle + '/' + d.round + '] not written: ' + d.unwritable); return; }
      const failed = Object.keys(d.checks).filter(k => d.checks[k] === false);
      say('   [' + d.angle + '/' + d.round + '] ' + (d.lands ? (d.inside ? 'LANDS, INSIDE ONLY' : 'LANDS') : 'fails ' + failed.join(', ')));
      say('      "' + d.text + '"' + (d.recognise !== null && d.recognise !== undefined ? '   [' + d.seat + ': ' + d.recognise + ' of 1000 carry most here]' : ''));
      if (d.loose && d.loose.length) say('      ungrounded numbers: ' + d.loose.join(', '));
      if (d.voiceHits && d.voiceHits.length) say('      voice: ' + d.voiceHits.join(', '));
    });
    say('');
  });
  const landed = o.drafts.filter(d => d.lands);
  say('rounds: ' + ['category', 'readout', 'first', 'voice'].map(rd => rd + ' ' + landed.filter(d => d.round === rd).length
    + ' of ' + o.drafts.filter(d => d.round === rd && d.text).length).join(', '));
  say('angles: ' + ['results', 'novelty'].map(a => a + ' ' + landed.filter(d => d.angle === a && d.round === 'voice').length
    + ' landed in the voice round, ' + o.drafts.filter(d => d.angle === a && !d.text).length + ' unwritable').join('; '));
  if (o.panel) {
    say('');
    say('panel of ' + o.panel.n + ' at seed 20260920' + (o.panel.disagree ? ', RE-READ DISAGREES WITH build() ON ' + o.panel.disagree : ', re-read agrees with build() to the person'));
    say('   heaviest seat: ' + Object.keys(o.panel.bySeat).sort((a, b) => o.panel.bySeat[b] - o.panel.bySeat[a]).map(s => s + ' ' + o.panel.bySeat[s]).join(', '));
    say('   archetype   n   gated   can release at intake   median loaded drop   median expression gain   printed CQ moved');
    F.PANEL.forEach(a => {
      const x = o.panel.byArch[a.nm];
      say('   ' + (a.nm + '         ').slice(0, 10) + ' ' + String(x.n).padStart(4) + ' ' + String(x.gated).padStart(6) + ' '
        + String(x.canRelease).padStart(20) + ' ' + String(x.medLoadedDrop === null ? '-' : x.medLoadedDrop).padStart(18) + ' '
        + String(x.medExGain === null ? '-' : x.medExGain.toFixed(1)).padStart(22) + ' ' + String(x.dCq).padStart(16));
    });
    say('');
    say('releases of twelve lines on fresh ground until the printed CQ moves one point:');
    o.cqRuns.forEach(c => say('   ' + c.nm + ': ' + (c.runs ? c.runs + ' releases, ' + c.patterns + ' lines, ' + c.from + ' to ' + c.to : c.note)));
  }
}
