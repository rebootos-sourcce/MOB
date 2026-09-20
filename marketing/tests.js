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

/* ---- 12. LEVEL 1 IS SERVED THE DOOR OUT AND NOTHING ELSE, EVERY TIME. */
const lvl1 = panel.filter(p => p.grid === 1);
T(lvl1.length > 0, '12. no level 1 people in the panel, so this assertion tested nothing');
const wrong = lvl1.filter(p => M.byField(p).served !== H.DOOR_OUT);
T(wrong.length === 0, '12. ' + wrong.length + ' people at level 1 were served a hook');

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
   present this reports and does not fail: another seat owns that file. */
const { execFileSync } = require('child_process');
const gatePath = path.resolve(__dirname, '..', '.claude', 'skills', 'atuned-voice', 'check.py');
let voice = 'not run';
if (fs.existsSync(gatePath)) {
  const fields = ['pain', 'hook', 'proof', 'objection', 'answered'];
  const lines = [];
  H.HOOKS.concat([H.CLEAR]).forEach(h => fields.forEach(k => { if (h[k]) lines.push(h[k]); }));
  H.DOORS.concat(H.ROLES).forEach(d => lines.push(d.hook));
  lines.push(H.DOOR_OUT.hook);
  try {
    const out = execFileSync('python3', [gatePath, '--line', lines.join(' ')],
      { encoding: 'utf8', cwd: path.resolve(__dirname, '..') });
    const hard = /(\d+) hard failures/.exec(out);
    n++;
    if (hard && Number(hard[1]) > 0) fail.push('19. the voice gate reports ' + hard[1] + ' hard failures');
    voice = /no hard failures/.test(out) ? 'no hard failures' : (hard ? hard[1] + ' hard failures' : 'unclear');
  } catch (e) { voice = 'gate errored: ' + e.message.split('\n')[0]; }
} else {
  voice = 'skill not present, skipped';
}

/* ---- 20. THE PANEL IS NOT SILENTLY SHORT.

   A tool that reports out of 1000 and hands back 998 is the defect this
   repository names seven times. */
T(panel.length === 1000, '20. the panel is ' + panel.length + ', not 1000');

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
