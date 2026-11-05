/* ============================================================
   THE MODEL. WHO OPENS THE FILE, AND WHEN THEY STOP. THIS IS JUDGEMENT.

   Ported from sim/harness.js, the repository's own ninety day harness, on
   the standing rule "port, do not rebuild". What is carried, what changed and
   why is stated entry by entry, so a reader can check every departure.

   CARRIED UNCHANGED from sim/harness.js:
     SHOWUP (harness.js:230-284), every field, every value. check.js asserts
       it still equals the harness's own export, so the two cannot drift.
     The pull terms, the curiosity decay, the drift rule, the saturating
       hazard with its 0.62 carry and its credit, and the attribution of an
       exit to the heaviest friction of the session it happened on.
     The friction costs and hard multipliers, except where named below.

   CHANGED, each one because the product changed under it (the door survey of
   5 November measured every one; the reasons are its findings):
     The laws. The harness seeded every unanswered law at 6.5 off a
       September measurement; the app now seeds 6, which the engine reads as
       unanswered. The 6.5 manufactured a complete CQ of 65 for a person who
       had answered nothing. Gone: a person's reading is what they answered.
     The intake answers. The harness drew them from a `grid` level that
       six of the nine no longer sit at (the bands moved when CQ became the
       laws alone, 25 September). Drawn here around that ICP's own law table
       in engine/data/people.js (LAWSET), plus a per person spread, so the
       reading a person earns is that ICP's reading with noise on it.
     F2 is half its cost: the address name is no longer printed, only the
       feeling at the seat, marked as read rather than said.
     F3 fires only when nothing has been found in this session or before:
       the release no longer gates on `loaded`, it takes what the story found.
     F4 reads what a screen prints, a whole percent, through pctMove, on
       coherence only once the reading is complete, and on expression.
     F5 is retired: at 390 one control now opens every door.
     F6 reads the measured count of the surface a person lands on (5
       November, blank profile): Summary on the first arrival, Discover after.
     F8 is retired: the allowance is enforced now. Replaced by WALL below.
     F9 is redefined, because the harness dealt random practices and the
       product deals one: ritFor always calls the lightest fitting practice.
     F11 is retired: the done flag is read (engine/ladder.js, 21.J2).
       check.js asserts it, so the retirement is a measurement.
     F13 is retired: the band and the number agree on 10,001 points out of
       10,001. The harness's own test was the false positive.
     F14 now fires on the shadow weight rising, the number a story still
       moves; a story cannot move CQ any more.
     DRIFT. The harness ramp reached its ceiling at day 90 and stays there.
       Nothing past day 90 is added to it: no fatigue term, no anniversary.

   NEW, and MINE, and swept by main.js --sweep:
     WALL. A release a person reaches for is refused because this week's
       patterns are spent, and there is nowhere to pay: PLAN_CHECKOUT_OPEN is
       false in engine/plan.js. Cost 0.10. Half the people who meet it take
       the free rerun the empty card offers (RERUN_TAKE).
     F9. The same single practice dealt for the twentieth time and on. Cost
       0.15 at half weight, which is the harness's own F9 cost.
   ============================================================ */
'use strict';

const SHOWUP = [
 {nm:'Diane', age:46, role:'founder, second company', weight:180, grid:3,
  device:'both', arrive:0.86, base:0.42, shape:'daily, in forty second slices',
  minutes:[0.7,2.5], gap:[0.05,3], work:0.18, patience:1.4, refers:false,
  whys:{delta:1.0, pressure:0.7, status:0.9}, wants:['delta'],
  why:'A number she does not already have, checked between meetings. Rest reads as a moral failure, so a session that asks for fifteen minutes is a session she does not take.',
  whyNot:'Nothing moved since yesterday. She will not pay twice for the same screen.'},
 {nm:'Derek', age:39, role:'high performer, endurance', weight:170, grid:2,
  device:'both', arrive:0.74, base:0.55, shape:'daily while a protocol is live',
  minutes:[4,14], gap:[0.06,5], work:0.72, patience:2.2, refers:false,
  whys:{cost:1.0, streak:0.9, body:0.6}, wants:['cost','delta'],
  why:'Output. He will run a protocol daily for a quarter if it is a protocol. The release is a protocol.',
  whyNot:'Nothing tells him what the holding costs him. Pain is not the hook, the watts are, and there is no watts line.'},
 {nm:'Marcus', age:44, role:'creative director', weight:160, grid:4,
  device:'both', arrive:0.58, base:0.16, shape:'every few days, as an inspection',
  minutes:[2,9], gap:[0.10,6], work:0.12, patience:2.6, refers:true,
  whys:{judge:1.0, craft:0.8}, wants:['craft'],
  why:'The quality judgement. He opens it to see whether it is still good and whether anybody fixed the thing he found.',
  whyNot:'He does not do the work. Level four on the grid buys it, reads half and avoids the practice because clearing the node hurts.'},
 {nm:'Angela', age:36, role:'seeker, six modalities', weight:150, grid:5,
  device:'phone', arrive:0.79, base:0.34, shape:'bursts, then nothing',
  minutes:[3,16], gap:[0.12,9], work:0.34, patience:1.2, refers:true,
  whys:{feel:1.0, seek:0.9, meaning:1.0}, wants:['meaning','named'],
  why:'Something named the thing she has no word for. She arrived from a group chat and she will tell that group chat.',
  whyNot:'Mechanical language, and the word Incoherent. Level five wants magic, not mechanics, and leaves when it turns out to be objective physical work.'},
 {nm:'Sofia', age:41, role:'somatic practitioner', weight:140, grid:6,
  device:'both', arrive:0.81, base:0.30, shape:'weekly, and at eleven at night',
  minutes:[6,22], gap:[0.07,7], work:0.66, patience:3.0, refers:true,
  whys:{night:1.0, client:1.0, craft:0.6}, wants:['named','refer'],
  why:'After the last client, for herself. And in session, on a client phone, which is the highest value use in the roster.',
  whyNot:'She cannot hand it to anybody. Her value is referral and there is no mechanism, so her use does not compound.'},
 {nm:'James', age:57, role:'C-suite, third turnaround', weight:100, grid:2,
  device:'both', arrive:0.42, base:0.07, shape:'once, possibly twice',
  minutes:[1,4], gap:[0.16,12], work:0.08, patience:1.0, refers:false,
  whys:{number:1.0, peer:0.8}, wants:['delta','number'],
  why:'A number a peer mentioned, and he wants his and he wants it higher.',
  whyNot:'Anything that looks like a persona picker or a worksheet. He is not going to be seen doing self help.'},
 {nm:'Ana', age:47, role:'teacher, one year out', weight:50, grid:4,
  device:'phone', arrive:0.72, base:0.46, shape:'irregular, at night',
  minutes:[5,25], gap:[0.09,4], work:0.61, patience:2.4, refers:false,
  whys:{night:1.0, grief:1.0, direction:1.0}, wants:['named','direction'],
  why:'She is inside something and cannot see the far side. She will click anything that offers the shape of it.',
  whyNot:'Being told the shape and not the way out. She is the one person in the roster for whom a wrong answer costs something.'},
 {nm:'Gordon', age:58, role:'managing partner', weight:35, grid:1,
  device:'both', arrive:0.06, base:0.02, shape:'refuses',
  minutes:[0.5,2], gap:[0.30,20], work:0.02, patience:0.4, refers:false,
  whys:{deny:1.0}, wants:['proof'],
  why:'Nothing. He has the most charge in the roster and refuses the frame. Do not chase him.',
  whyNot:'Any screen that opens with his pain is a screen for people who have pain.'},
 {nm:'Rosa', age:61, role:'retired midwife', weight:15, grid:10,
  device:'both', arrive:0.12, base:0.03, shape:'once, out of courtesy',
  minutes:[1,5], gap:[0.25,14], work:0.5, patience:2.0, refers:false,
  whys:{none:1.0}, wants:[],
  why:'Nothing pulls. Things do not sit on her the way they used to.',
  whyNot:'Correctly not the customer, and the product should not pretend otherwise.'}];

/* The frictions still live in the build, with the harness's costs and hard
   multipliers except where the header names a change. */
const FRICTION = {
 DRIFT:{nm:'The absence became permanent', cost:0, hard:{}},
 F1:{nm:'The box reads nothing out of what they wrote', cost:0.16, hard:{Marcus:1.8,Angela:1.7,Sofia:1.5,Ana:1.4}},
 F2:{nm:'The reading names a feeling at a seat the words did not name', cost:0.065, hard:{Angela:1.9,Ana:1.8,Sofia:1.6,Marcus:1.3}},
 F3:{nm:'Nothing found, now or before, so nothing to release', cost:0.20, hard:{Derek:1.8,Ana:1.6,Diane:1.4}},
 F4:{nm:'The printed number does not move', cost:0.17, hard:{Diane:2.0,James:2.0,Derek:1.6,Marcus:1.2}},
 F6:{nm:'More simultaneous choices than a working memory holds', cost:0.06, hard:{Angela:1.5,Ana:1.4,James:1.3}},
 F7:{nm:'The intake is sixty three questions', cost:0.14, hard:{Diane:2.0,James:1.8,Marcus:1.5}},
 F9:{nm:'The same practice, dealt for the twentieth time', cost:0.15, hard:{Marcus:1.7,Angela:1.5,Diane:1.3}},
 F10:{nm:'Nothing asked them to come back', cost:0.07, hard:{Angela:1.6,Derek:1.4,Ana:1.3}},
 F12:{nm:'There is no way to hand it to anybody', cost:0.12, hard:{Sofia:2.2,Marcus:1.5,Angela:1.4}},
 F14:{nm:'The story raised the shadow weight the screen prints', cost:0.19, hard:{Diane:1.8,James:1.7,Derek:1.5,Angela:1.5}},
 WALL:{nm:'The week\'s patterns are spent and there is nowhere to pay', cost:0.10, hard:{Derek:1.4,Diane:1.3,Sofia:1.2}}};

/* measured 5 November, blank profile, controls above the fold */
const LAND = { first: { phone: 12, desk: 26 }, after: { phone: 9, desk: 14 } };
/* the harness's session costs in minutes, unchanged */
const COST = { story: 3.4, ritualPlan: 2.6, intakeBlock: 0.7, release: 1.2 };
const RERUN_TAKE = 0.5;

module.exports = { SHOWUP, FRICTION, LAND, COST, RERUN_TAKE };
