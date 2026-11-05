/* ============================================================
   THE SIMULATED CLOCK.

   A year cannot be run in a year, and a handful of engine paths read the host
   clock directly (snapshot's t, meterRun's default moment, planAllowance and
   meterBudget when no moment is passed). If those read the real clock, every
   one of 365 simulated days happens at the same real minute: a streak cannot
   form, a weekly allowance never refills, and a mark that needs thirty days
   is never earned. That would be the harness lying, not the product.

   So Date is replaced before engine.js is required, and every constructor
   with no argument and every Date.now() returns the simulated moment. A Date
   built from an explicit value is untouched. Required first, by every file
   that requires the engine.
   ============================================================ */
const RealDate = Date;
let NOW = RealDate.parse('2027-01-04T15:00:00.000Z'); /* a Monday, mid afternoon UTC */
class SimDate extends RealDate {
 constructor(...a) { if (a.length === 0) super(NOW); else super(...a); }
 static now() { return NOW; }
}
SimDate.parse = RealDate.parse; SimDate.UTC = RealDate.UTC;
global.Date = SimDate;
module.exports = {
 RealDate,
 set(ms) { NOW = ms; },
 get() { return NOW; },
 START: NOW,
 DAY_MS: 86400000,
};
