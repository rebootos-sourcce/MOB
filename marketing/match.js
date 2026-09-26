/* ============================================================
   match.js

   THE LOOKUP. A field goes in, a line comes out.

   This is the idea the whole system is built on and it is worth stating in
   one sentence: the product already measures which address a person is
   carrying, so the language that reaches them is not a guess about a
   demographic, it is a lookup against their own reading.

   Three keys, in descending precision, and which one is available depends
   entirely on whether a reading exists yet.

     field   charge and seat off the heaviest address. Exact. Only exists
             after the intake
     state   one of the owner's four states. Names the right charge for 530
             of the 965 eligible on the headline seed, 26 September
     role    one of the owner's four roles. 456 of 965, and hooksim.js takes
             the gap between state and role apart by archetype: it is the
             hand assignment of labels, not a better key

   Measured in hooksim.js. The field leads both in 15 of 15 sweep runs. State
   led role in 5 of 15 on 20 September and leads in 15 of 15 since the gate
   let the crisis archetype's people through, which is the same labels
   counted over a different pool. Neither pre reading label is a key, and a
   door built on one names a situation and never a charge.

   That is the commercial argument for the intake existing: the funnel's only
   real job is to turn a label into a reading.

   HOST FREE. No document, no window, no fetch.
   ============================================================ */

const path = require('path');
const { HOOKS, CLEAR, DOOR_OUT, DOORS, ROLES } = require(path.resolve(__dirname, 'hooks.js'));

/* the band gate, and it runs before the lookup rather than after.

   BUYERS.md level 1 is nought percent and actively repelled, because buying
   this means dismantling an identity the person is using to survive. So the
   gate is not a filter on who converts, it is a refusal to aim a hook at
   somebody the grid says would be harmed by one. They get DOOR_OUT, which is
   the engine's own direction for that band.

   Levels 2 and 3 are a separate case and a weaker one. Nothing says a hook
   harms them. The grid says it will not work: no bandwidth at 2, and a
   demand for peer reviewed argument rather than personal practice at 3. So
   they are served the hook and counted apart, because a system that folds
   them into a coverage total is overstating its own reach. Reported, never
   hidden.

   LEVEL 1 IS READ ON EXPRESSION AS WELL AS ON CQ, since 26 September. Since
   the fitted CQ model of 25 September, CQ is the laws alone and cannot see
   load, and the lowest CQ in the roster is Gordon at 17.5, so on CQ alone
   nobody reads level 1 and this gate refused nobody. The engine met the same
   wall with its clinician referral and moved that to expression, which is
   CQ with the shadow's pull taken off and reads 7.9 for Gordon (ui/drills.js,
   TASKS.md BB5). This gate follows the engine. It is wider than the engine's
   referral, which also needs a malignant shape: a refusal here costs a
   sale, and a hook served to somebody in collapse costs the person, so the
   miss is the error that is priced. tests.js asserts this gate reaches
   everybody the engine's own referral reaches. */
function gate(reading) {
  if (reading.grid === 1 || reading.exGrid === 1) {
    return { served: DOOR_OUT, reason: 'level 1, refused on harm grounds' };
  }
  return null;
}

/* the field lookup. exact on charge and seat, and it does not fall back to a
   charge only match.

   A fallback would raise coverage and would be the wrong answer: the seat is
   where the line's physical metaphor comes from, so Shame at the sacral and
   Shame at the crown are two different lines and serving one for the other
   is the mis-addressing this whole exercise exists to measure. A key with no
   hook is reported as a hole. */
function byField(reading) {
  const g = gate(reading);
  if (g) return g;
  if (!reading.charge) {
    return reading.grid >= CLEAR.floor
      ? { served: CLEAR, reason: 'nothing held' }
      : { served: null, reason: 'nothing held, below the clear floor' };
  }
  const h = HOOKS.find(x => x.charge === reading.charge && x.seat === reading.seat);
  if (!h) return { served: null, reason: 'no hook at key ' + reading.charge + ' @ ' + reading.seat };
  if (reading.grid < h.floor) {
    return { served: h, reason: 'below floor ' + h.floor + ', served and counted apart' , belowFloor: true };
  }
  return { served: h, reason: 'field match' };
}

/* the state door. one of four, and it is what a person gets before a
   reading. No band gate, because there is no band yet: nothing has been
   measured, so there is nothing to gate on. That is not an oversight, it is
   the reason the doors are written to sort rather than to assert. */
function byState(state) {
  const d = DOORS.find(x => x.state === state);
  return d ? { served: d, reason: 'state door' } : { served: null, reason: 'no door for state ' + state };
}

function byRole(role) {
  const r = ROLES.find(x => x.role === role);
  return r ? { served: r, reason: 'role door' } : { served: null, reason: 'no door for role ' + role };
}

/* what charge does a scheme's line actually name for this person.

   For the field scheme the answer is the person's own charge, by
   construction. For a state or a role door the answer is the modal charge of
   that door in the panel, which is the best a door can do without a reading.
   Naming precision is then whether that modal charge is the person's, and
   that is a statement about accuracy of naming and nothing at all about
   whether anybody buys. */
function namedCharge(scheme, reading, modalByState, modalByRole) {
  if (scheme === 'field') {
    const m = byField(reading);
    if (!m.served || m.served.isHook === false) return null;
    return m.served.charge === undefined ? null : m.served.charge;
  }
  if (scheme === 'state') return modalByState[reading.state] || null;
  if (scheme === 'role') return modalByRole[reading.role] || null;
  return null;
}

module.exports = { gate, byField, byState, byRole, namedCharge, HOOKS, CLEAR, DOOR_OUT, DOORS, ROLES };
