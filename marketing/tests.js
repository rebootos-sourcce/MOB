#!/usr/bin/env node
/* ============================================================
   tests.js

   THE GATE FOR THIS DIRECTORY. Exits non zero on any failure.

     node marketing/tests.js

   It runs field.js's four validation groups and hooksim.js's five, then adds
   the assertions that belong to the system's design rather than to its
   arithmetic. Those are the ones a future edit is most likely to break,
   because each of them is a rule somebody could reasonably undo without
   noticing it was a rule.

   It does not restate a count. Every number it checks is read off a run.
   ============================================================ */

const path = require('path');
const F = require(path.resolve(__dirname, 'field.js'));
const H = require(path.resolve(__dirname, 'hooks.js'));
const M = require(path.resolve(__dirname, 'match.js'));
const R = require(path.resolve(__dirname, 'refuse.js'));
const SIM = require(path.resolve(__dirname, 'hooksim.js'));

const fail = [];
const ck = (cond, msg) => { if (!cond) fail.push(msg); };
let n = 0;
const T = (cond, msg) => { n++; ck(cond, msg); };

/* the panel, read once and shared. Several assertions below read the
   engine's own routing off it rather than restating a table. */
const panel = F.build(1000, 20260920);

/* ---- groups 1 to 9, borrowed whole from the two tools ---- */
F.validate().forEach(f => fail.push('field.js ' + f));
SIM.validate().forEach(f => fail.push('hooksim.js ' + f));
n += 9;

/* ---- 10. A ROLE DOOR NEVER NAMES A CHARGE.

   The measurement says role predicts the charge for well under half the
   panel, so a role line that asserts one is wrong more often than it is
   right. This is the assertion that stops somebody strengthening a role line
   by putting a charge in it. */
const CHARGEWORDS = F.CHARGES.map(c => c.toLowerCase())
  .concat(['sadness', 'anxious', 'anxiety', 'ashamed', 'angry', 'disgusted', 'apathetic']);
H.ROLES.forEach(r => {
  const t = R.norm(r.hook);
  const hit = CHARGEWORDS.filter(w => new RegExp('\\b' + w + '\\b').test(t));
  T(hit.length === 0, '10. role door ' + r.id + ' names a charge: ' + hit.join(', '));
});

/* ---- 11. NO HOOK HAS A FLOOR OF 1.

   BUYERS.md level 1 is nought percent and actively repelled. A hook with a
   floor of 1 is a hook aimed at somebody the grid says would be harmed by
   one, and it would be a one character edit. */
H.HOOKS.concat([H.CLEAR]).forEach(h => {
  T(h.floor > 1, '11. ' + h.id + ' has floor ' + h.floor + ', which aims a hook at level 1');
});

/* ---- 12. LEVEL 1 IS SERVED THE DOOR OUT AND NOTHING ELSE, EVERY TIME.

   Level 1 on CQ or on expression. Since the fitted CQ of 25 September nobody
   in the panel reads level 1 on CQ, and this assertion reported that it
   tested nothing. See match.js gate for why expression, and field.js THE
   KNOWN ANSWERS for what moved. */
const lvl1 = panel.filter(p => p.grid === 1 || p.exGrid === 1);
T(lvl1.length > 0, '12. no level 1 people in the panel, so this assertion tested nothing');
const wrong = lvl1.filter(p => M.byField(p).served !== H.DOOR_OUT);
T(wrong.length === 0, '12. ' + wrong.length + ' people at level 1 were served a hook');

/* ---- 12b. THE GATE REACHES EVERYBODY THE ENGINE'S OWN REFERRAL REACHES.

   The engine puts a licensed clinician on the surface through darkRead, and
   field.js calls it rather than restating it. A person the engine refers and
   this system markets to would be the worst line in the directory. The first
   half proves the check is live: with nobody referred it tests nothing. */
const referred = panel.filter(p => p.refer);
T(referred.length > 0, '12b. nobody in the panel is referred by the engine, so this tested nothing');
const sold = referred.filter(p => M.byField(p).served !== H.DOOR_OUT);
T(sold.length === 0, '12b. ' + sold.length + ' people the engine refers to a clinician were served a hook');

/* ---- 13. THE DOOR OUT IS NOT A HOOK.

   It carries no what if question, because a refusal that asks one is a hook
   wearing a refusal's coat, and this is the one line in the system whose job
   is to send somebody away. */
T(!/what if /i.test(H.DOOR_OUT.hook), '13. the door out asks a what if question');
T(H.DOOR_OUT.isHook === false, '13. the door out is not marked as a non hook');

/* ---- 14. THE DOOR OUT IS THE ENGINE'S OWN WORDS.

   It is TIERDEF's direction for the Collapsed band, carried verbatim. If the
   engine's wording changes, this fails and somebody decides, rather than the
   marketing copy quietly becoming a second voice. */
const E = require(path.resolve(__dirname, '..', process.env.ENGINE || 'engine.js'));
const collapsed = E.TIERDEF[E.TIERDEF.length - 1];
T(collapsed.nm === 'Collapsed', '14. the last TIERDEF entry is ' + collapsed.nm + ', not Collapsed');
T(H.DOOR_OUT.hook === collapsed.toward,
  '14. the door out no longer matches TIERDEF Collapsed toward. engine says: ' + collapsed.toward);

/* ---- 15. EVERY HOOK'S ADDRESS, NERVE AND DISTORTION MATCH THE ENGINE ROW.

   A hook naming a nerve the engine does not seat that address at is a false
   proof point, and it is the most damaging kind because it is checkable by
   the reader. */
H.HOOKS.forEach(h => {
  const nd = E.NODES.find(x => x.k === h.address);
  if (!nd) { T(false, '15. ' + h.id + ' names address ' + h.address + ', not in NODES'); return; }
  T(nd.b === h.seat, '15. ' + h.id + ' seats ' + h.address + ' at ' + h.seat + ', engine says ' + nd.b);
  T(nd.n === h.nerve, '15. ' + h.id + ' nerve ' + h.nerve + ', engine says ' + nd.n);
  T(nd.d === h.distortion, '15. ' + h.id + ' distortion ' + h.distortion + ', engine says ' + nd.d);

  /* THE NODE'S OWN CHARGE LABEL IS NOT THE CHARGE THE READING USES, AND THE
     FIRST CUT OF THIS ASSERTION GOT THAT WRONG ON SIX HOOKS OF SEVENTEEN.

     NODES carries c, which is one of eight labels including Resentment and
     Joy, neither of which is one of the nine axes. canon.js REROUTE maps
     those eight onto the nine, and three keyword patterns override it by
     address name: Hypervigilance and Expectation route to Anticipation
     although their c is Fear, and Envy routes to Anger from Resentment.

     So the charge is asserted against what the engine actually computes for
     that address in the panel, not against the raw label. Reimplementing
     REROUTE and the three patterns here would be a second copy of engine
     logic, and a second copy is the thing that drifts. */
  const carriers = panel.filter(p => p.address === h.address);
  T(carriers.length > 0, '15. nobody in the panel carries ' + h.address);
  const mismatched = carriers.filter(p => p.charge !== h.charge);
  T(mismatched.length === 0, '15. ' + h.id + ' claims charge ' + h.charge + ' at ' + h.address
    + ', the engine routes ' + mismatched.length + ' of ' + carriers.length
    + ' panel readings there to ' + (mismatched[0] ? mismatched[0].charge : ''));
});

/* ---- 16. EVERY ART DIRECTION INK IS A TOKEN THE APP DEFINES.

   The funnel wears the app's aesthetic, and the way that stays true is that
   no colour is written as a literal anywhere. A hex value in an art field
   fails here. */
const fs = require('fs');
const tok = fs.readFileSync(path.resolve(__dirname, '..', 'funnel', 'tokens.css'), 'utf8');
H.HOOKS.concat([H.CLEAR]).forEach(h => {
  const ink = h.art && h.art.ink;
  T(!!ink, '16. ' + h.id + ' has no art ink');
  if (!ink) return;
  T(/^--/.test(ink), '16. ' + h.id + ' ink ' + ink + ' is not a token');
  T(tok.indexOf(ink + ':') >= 0, '16. ' + h.id + ' ink ' + ink + ' is not in funnel/tokens.css');
  const hex = JSON.stringify(h.art).match(/#[0-9a-fA-F]{3,8}/g);
  T(!hex, '16. ' + h.id + ' art direction carries a literal colour: ' + (hex || []).join(' '));
});

/* ---- 17. THE SEAT DECIDES THE INK. Not taste.

   The whole claim of this system is that the address decides the treatment,
   so a hook at the Heart in a Root colour would be the claim quietly
   abandoned. The engine's own seat names map to the token names in
   tokens.css with one rename, 3rd Eye to --eye, which is named here rather
   than inferred. */
const SEATINK = { Root: '--root', Sacral: '--sacral', Solar: '--solar', Heart: '--heart',
  Throat: '--throat', '3rd Eye': '--eye', Crown: '--crown' };
H.HOOKS.forEach(h => {
  T(h.art.ink === SEATINK[h.seat],
    '17. ' + h.id + ' at seat ' + h.seat + ' is inked ' + h.art.ink
    + ', the seat says ' + SEATINK[h.seat]);
});

/* ---- 18. EVERY ROW SAYS WHERE IT CAME FROM, OR SAYS IT IS UNSOURCED.

   The brief's own rule. A row with no src at all is the failure; a row that
   says unsourced passes, because saying so is the requirement. */
H.HOOKS.concat([H.CLEAR, H.DOOR_OUT]).concat(H.DOORS).concat(H.ROLES).forEach(h => {
  T(!!h.src && String(h.src).trim().length > 0, '18. ' + h.id + ' carries no src');
});

/* ---- 19. THE VOICE GATE IS CLEAN ON EVERY COPY FIELD.

   Shelling out to the house gate rather than reimplementing it, because a
   second copy of a rule set is the thing that drifts. If the skill is not
   present this reports and does not fail: another seat owns that file.

   IT SAID "GATE ERRORED" FOR FIVE DAYS AND WAS HIDING THIRTY FAILURES.

   The first cut joined every line into one --line call and read the result
   through execFileSync. check.py exits 1 when it finds a hard failure, which
   is its documented contract and what its other callers rely on, and
   execFileSync throws on any exit that is not 0. The catch below it printed
   "gate errored" and failed nothing. Two of his own objection rules, added on
   21 September, a day after this file was written, fired on sixteen proof
   lines of the form "Address 31 of 112". Joining the lines also hid the
   count: an objection fires once per call, so one call reported 2 where the
   lines held 30, and named no line.

   So the shown copy is written one literal per line into a scratch .js file
   and the gate reads it in file mode, which is one run of the same rules
   with a line number on every finding, mapped back to the hook and field.
   One call per line gives the same thirty and costs thirty seconds, because
   the gate measures the house baseline on every call. A canary line that
   breaks both rules rides at the end, so a gate that finds nothing has
   proved it can find something. Exit 0 is clean, exit 1 with findings is a
   failure, and anything else is a gate that did not run, which fails too. */
const { spawnSync } = require('child_process');
const os = require('os');
const gatePath = path.resolve(__dirname, '..', '.claude', 'skills', 'atuned-voice', 'check.py');
let voice = 'not run';
if (fs.existsSync(gatePath)) {
  const fields = ['pain', 'hook', 'proof', 'objection', 'answered'];
  const lines = [];
  H.HOOKS.concat([H.CLEAR]).forEach(h => fields.forEach(k => { if (h[k]) lines.push({ id: h.id + '.' + k, text: h[k] }); }));
  H.DOORS.concat(H.ROLES).forEach(d => lines.push({ id: d.id + '.hook', text: d.hook }));
  lines.push({ id: H.DOOR_OUT.id + '.hook', text: H.DOOR_OUT.hook });
  const CANARY = { id: 'canary', text: 'Address 31 of 112 is where the charge sits in your body.' };
  lines.push(CANARY);
  const lit = t => "'" + t.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "',";
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mkt-voice-'));
  const tmp = path.join(dir, 'lines.js');
  fs.writeFileSync(tmp, lines.map(l => lit(l.text)).join('\n') + '\n');
  const run = spawnSync('python3', [gatePath, tmp], { encoding: 'utf8', cwd: path.resolve(__dirname, '..') });
  fs.rmSync(dir, { recursive: true, force: true });
  const out = (run.stdout || '') + (run.stderr || '');
  const hits = [];
  const re = /\[([^\]]+)\] \S*lines\.js:(\d+)/g;
  let m;
  while ((m = re.exec(out))) hits.push({ rule: m[1], line: lines[Number(m[2]) - 1] });
  const canaryHit = hits.filter(h => h.line === CANARY).map(h => h.rule);
  const real = hits.filter(h => h.line !== CANARY);
  n++;
  if (run.status !== 0 && run.status !== 1) {
    voice = 'gate did not run, exit ' + run.status + ': ' + out.split('\n').filter(Boolean).slice(-1)[0];
    fail.push('19. ' + voice);
  } else if (canaryHit.indexOf('count-against-total') < 0 || canaryHit.indexOf('serial-to-a-person') < 0) {
    voice = 'the canary line was not caught, so a clean run proves nothing';
    fail.push('19. ' + voice);
  } else if (real.length) {
    voice = real.length + ' hard failures';
    real.forEach(h => fail.push('19. voice gate: ' + h.line.id + ' fails ' + h.rule));
  } else {
    voice = 'no hard failures on ' + (lines.length - 1) + ' lines, and the canary caught';
  }
} else {
  voice = 'skill not present, skipped';
}

/* ---- 20. THE PANEL IS NOT SILENTLY SHORT.

   A tool that reports out of 1000 and hands back 998 is the defect this
   repository names seven times. */
T(panel.length === 1000, '20. the panel is ' + panel.length + ', not 1000');

/* ---- 21. THE TESTIMONIAL EXERCISE STAYS SIMULATED, GROUNDED AND GATED.

   testimony.js writes first person lines in the voice of the reference
   fields. GUARD.md's testimonial rule says there are no users to quote, so
   the first thing asserted is that nothing it writes can be mistaken for a
   user. Then that the checks it adds can find something: the category's own
   testimonial never lands, and Derek's first draft, which claimed the
   coherence number did not move when the printed CQ went 48 to 49, is caught
   by the truth check that was widened because of it. */
const TY = require(path.resolve(__dirname, 'testimony.js'));
T(TY.liftError() === null, '21. testimony.js: ' + TY.liftError());
const ty = TY.run({ panel: false });
const tyWritten = ty.drafts.filter(d => d.text);
T(ty.voice.ran, '21. testimony.js voice gate did not run: ' + ty.voice.why);
ty.drafts.forEach(d => {
  T(d.simulated === true && !!F.PANEL.find(a => a.nm === d.person),
    '21. a testimony draft is not marked simulated against a reference field: ' + d.person);
});
ty.people.filter(P => P.refused).forEach(P => {
  T(!ty.drafts.some(d => d.person === P.nm), '21. ' + P.nm + ' is refused by the band gate and was written a testimonial');
});
tyWritten.filter(d => d.round === 'category').forEach(d => {
  T(!d.lands, '21. the category testimonial landed for ' + d.person + ', so the checks cannot tell the shelf from the instrument');
});
const derekFirst = ty.drafts.find(d => d.person === 'Derek' && d.round === 'first');
T(!!derekFirst && derekFirst.checks.true === false,
  '21. Derek\'s first draft says the coherence number did not move and the truth check let it through');
tyWritten.filter(d => d.lands).forEach(d => {
  const P = ty.people.find(x => x.nm === d.person);
  const g = TY.grounding(P);
  const loose = TY.numbersIn(d.text).filter(x => !g.has(x));
  T(loose.length === 0, '21. landed testimony for ' + d.person + ' carries ungrounded numbers ' + loose.join(', '));
  T(R.check(d.text).length === 0, '21. landed testimony for ' + d.person + ' is refused by refuse.js');
  T(P.register !== 'dosed' || d.inside, '21. ' + d.person + ' sits on a dosed key and a landed line is not held inside');
});

/* ---- 22. THE NEGATION GUARD STOPS AT A SENTENCE.

   It did not. norm() strips the full stop the guard's window was written to
   stop at, so a negator in one sentence excused a breach in the next. Both
   lines here passed the gate before 27 September. */
T(R.check('Nothing is hidden. Act now.').some(v => v.rule === 'urgency'),
  '22. "Nothing is hidden. Act now." passes: the negation guard crosses a sentence end');
T(R.check('No fluff. Only 3 spots left.').some(v => v.rule === 'scarcity'),
  '22. "No fluff. Only 3 spots left." passes: the negation guard crosses a sentence end');
T(R.check('It makes no claim about tissue, no diagnosis and no treatment.').length === 0,
  '22. the guard no longer excuses the product refusing a thing, which is what it is for');

/* ---- 23. THE TESTIMONIAL RULE READS THE REGISTER, NOT ONLY THE COUNT. */
T(R.check(TY.CATEGORY.results).some(v => v.rule === 'testimonial'),
  '23. the category testimonial passes the testimonial rule');

/* ------------------------------------------------------------ */
console.log('marketing/tests.js');
console.log('  assertions run   ' + n);
console.log('  voice gate       ' + voice);
console.log('  egress           blocked for direct fetch in this environment. '
  + 'Literature reached through the search index and cited by URL in MAP.md.');
if (fail.length) {
  console.log('  FAILURES         ' + fail.length);
  fail.forEach(f => console.log('    FAIL ' + f));
  process.exit(1);
}
console.log('  failures         0');
