
/* ============================================================
   THE SABOTEUR SELF REPORT. Ruled 11 November, his words, verbatim, asked
   directly whether the new quiz's 20 self-report saboteur questions
   should write into the existing 33-saboteur table the rest of the app
   already reads from: "Let's lay the saboteurs in for now. What they do
   is they give us anchors. All of it gives us anchors. It just depends
   on which way we choose to come at it from. The saboteurs are more
   recognizable by people... People can admit when they're people-
   pleasing but they just need to be shown it." Confirmed alpha-scoped,
   his to revisit: "I may have to change that after the alpha. So just
   for now, this is for the [alpha]." (DECISIONS.md, "The 20 self-
   reported saboteurs feed the real SAB33 detection, same shape as the
   archetypes.")

   SAB33 DETECTION IS A LIVE READ, NOT A STORED ONE. sab33Detect()
   (core.js:615) takes no argument and keeps no memory between calls: it
   reads S.charge fresh every time, through sabLevels() (core.js:597),
   and names whichever of the 33 SAB33 rows the current charge's bands
   match. There is no second per-saboteur state anywhere for a self-
   report to seed -- the charge IS the state, and detection is just the
   table read against it. So "the same shape as the archetype ruling"
   (DECISIONS.md, directly above this one) means the same thing here it
   means there: this file writes no second table and adds no field
   sab33Detect() has to learn to read. It writes the one thing
   sab33Detect() already reads, S.charge, in the amounts the person's own
   20 self-reported answers say to -- the exact mechanism engine/seed.js
   already uses for a stated four-letter type, restricted here to the 20
   verified names and keyed to each row's own SAB33 band instead of a
   hand-written delta table.

   RESTRICTED TO THE 20 VERIFIED NAMES. DECISIONS.md: "every one of the
   new quiz's 20 self-report saboteur names ... is an exact, verbatim
   name match to one of the 33 rows in SAB33 ... The other 13 of the 33
   stay story-inferred only, same as today." SAB_SELFNAMES below is that
   list, checked against SAB33 by identity at load time, never assumed --
   the same discipline the ruling itself was built on.

   NINE SHARED AXES, UP TO TWENTY SELECTED ROWS: A SELECTED SABOTEUR
   PULLS, IT DOES NOT SET. Two selected rows can name the same axis with
   different bands (Micromanager wants fear 7-10, Negotiator wants fear
   4-6), the same way SEED16's own E/I/N/S/T/F/J/P terms already share
   axes between letters (seed.js). sabSeedAxes resolves this exactly as
   seedAxes resolves a type: every selected row proposes the midpoint of
   its own band, weighted by how strongly the person said it fits (0 to
   1), and an axis more than one row touches takes the weighted mean of
   what each proposed -- never the max, never one row's answer silently
   overwriting another's. An axis nothing selected touches stays at
   AXIS_BLANK, so five reported saboteurs do not buy a guessed opinion on
   the other fifteen's axes for free.

   RE-WEIGHED BY STORY INPUT OVER TIME NEEDS NOTHING NEW HERE. Once this
   file has written S.charge, every ordinary mechanism that already moves
   charge from a story (compute.js's own charge accumulation) moves it,
   and sab33Detect() reads whatever is live at call time -- the exact
   "re-weighed the same way sab33Detect() already re-weighs from a story"
   the ruling asks for, with no second formula to invent. */

/* the 20 names, in the quiz's own presentation order: Shirzad Chamine's
   ten (the Judge and its nine accomplices) followed by the ten Lance
   named directly ("Negotiator, and mix in a few of our more high-
   performing saboteur types"). Spelling matches SAB33's own rows
   (canon.js) exactly -- checked below, not assumed. */
const SAB_SELFNAMES=['Judge','Avoider','Micromanager','Hyper-Achiever','Hyper-Rational',
 'Hyper-Vigilant','Pleaser','Restless','Stickler','Victim',
 'Negotiator','Control Freak','Imposter','Overthinker','Perfectionist',
 'Aggressor','Worrywart','Martyr','Cynic','Deflector'];

/* checked against SAB33 by identity, the same discipline DECISIONS.md
   names ("confirmed directly against the real table rather than
   assumed"). A name here SAB33 does not carry is a build error, never a
   quiz answer anybody could have given right, so this throws at load --
   the same place SI.length!==21 and VERP.length!==6 throw elsewhere. */
(function(){
 var missing=SAB_SELFNAMES.filter(function(nm){return !SAB33_BY[KB_KEY(nm)];});
 if(missing.length)throw new Error('SAB_SELFNAMES names '+JSON.stringify(missing)+' SAB33 does not carry');
})();

/* SAB33's rows key on the engine's own lowercase charge vocabulary
   (canon.js's own header: "sadness" for Sad, and "anxiety" as the
   shipped alias core.js's sabLevels() folds onto Anticipation). This is
   the one reverse map from that vocabulary back onto the CHARGES names
   S.charge and p.axes actually use -- written once here because nothing
   upstream of this file ever needed to go in this direction before. */
const SAB_AXIS_FROM_KEY={fear:'Fear', anger:'Anger', shame:'Shame', disgust:'Disgust',
 apathy:'Apathy', shock:'Shock', sadness:'Sad', surprise:'Surprise',
 anticipation:'Anticipation', anxiety:'Anticipation'};

/* sel is a map of name -> strength, 0 (not me) to 1 (this is exactly
   me); a name absent from sel, or at 0, is a saboteur the person did
   not report and this file never touches its axes for. */
function sabSelfValid(sel){
 if(!sel||typeof sel!=='object')return false;
 return Object.keys(sel).every(function(nm){
  return SAB_SELFNAMES.indexOf(nm)>=0
   &&typeof sel[nm]==='number'&&isFinite(sel[nm])&&sel[nm]>=0&&sel[nm]<=1;});}

/* the blended axes a self-report would write, as a plain object keyed
   by CHARGES name -- exposed on its own (not only inside sabSeedApply)
   so a results screen can show what the self-report implies before any
   profile exists to write it onto, the same way seedAxes (seed.js) is
   called on its own by screens that preview a type before seeding it. */
function sabSeedAxes(sel){
 var out={}, wsum={};
 CHARGES.forEach(function(c){out[c]=AXIS_BLANK; wsum[c]=0;});
 if(!sabSelfValid(sel))return out;
 Object.keys(sel).forEach(function(nm){
  var w=sel[nm]; if(!(w>0))return;
  var row=SAB33_BY[KB_KEY(nm)]; if(!row)return;
  row[1].forEach(function(part){
   var c=SAB_AXIS_FROM_KEY[part[0]]; if(!c||out[c]==null)return;
   var mid=(part[1]+part[2])/2;
   out[c]=(out[c]*wsum[c]+mid*w)/(wsum[c]+w);
   wsum[c]+=w;});});
 CHARGES.forEach(function(c){out[c]=Math.round(Math.max(0,Math.min(10,out[c]))*10)/10;});
 return out;}

/* the same "untouched since written" test seedEmpty (seed.js) runs on
   the four-letter type's charge, run here on the same nine axes: every
   one still at the blank, or every one still exactly where this file's
   own earlier seed put it. A self-report and a four-letter type both
   write onto these same nine axes and the rule is the same for either:
   only the one that reaches an untouched field first may write it, so
   this never overwrites a seed.js seedApply that landed first, or a
   story that has since moved any of the nine. */
function sabSeedEmpty(p){
 if(!p)return false;
 var held=function(c){return (p.axes&&p.axes[c]&&p.axes[c].held!=null)?p.axes[c].held:AXIS_BLANK;};
 var cur=p.sabSeed&&p.sabSeed.axes;
 return CHARGES.every(function(c){return Math.abs(held(c)-AXIS_BLANK)<1e-9;})
  ||(!!cur&&CHARGES.every(function(c){return cur[c]!=null&&Math.abs(held(c)-cur[c])<1e-9;}));}

/* writes the self-report's charge onto a profile, the same shape
   seedApply (seed.js) writes a four-letter type's. Re-seeding from the
   same still-untouched field re-seeds rather than compounds, so
   retaking the quiz works; a story or a slider that has since moved
   any of the nine freezes it out, the same "all or nothing" rule
   seedApply already carries. */
function sabSeedApply(p,sel){
 if(!p||!sabSelfValid(sel))return null;
 /* show only on a worked example, engine/showonly.js */
 if(showRefuse('intake',p))return null;
 if(!sabSeedEmpty(p))return null;
 var ax=sabSeedAxes(sel);
 CHARGES.forEach(function(c){
  p.axes[c]=p.axes[c]||{held:AXIS_BLANK,opp:0};
  p.axes[c].held=ax[c];});
 p.sabSeed={at:new Date().toISOString(),
  names:Object.keys(sel).filter(function(nm){return sel[nm]>0;}), axes:ax};
 return p.sabSeed;}

/* "not said" puts the nine axes back to the blank, the same shape
   seedClear (seed.js) uses, and only while the field is still exactly
   this seed. A worked example is show only and is not written. */
function sabSeedClear(p){
 if(!p||(typeof showOnly==='function'&&showOnly(p)))return p;
 if(p.sabSeed&&p.sabSeed.axes&&sabSeedEmpty(p))CHARGES.forEach(function(c){
  p.axes[c]=p.axes[c]||{held:AXIS_BLANK,opp:0}; p.axes[c].held=AXIS_BLANK;});
 p.sabSeed=null; return p;}

/* HOW MUCH OF THE CHARGE FIELD IS STILL THE SELF REPORT. The exact
   formula seedShare (seed.js) uses, read against p.sabSeed instead of
   p.seed: 1 means untouched since the self-report seeded it, 0 means
   the person's own story now accounts for all of it. A measurement,
   not a countdown -- charge moved back toward the seed raises it again,
   the same note seedShare's own header carries. */
function sabSeedShare(p){
 if(!p||!p.sabSeed||!p.sabSeed.axes)return 0;
 var seeded=0, moved=0;
 CHARGES.forEach(function(c){
  var s=p.sabSeed.axes[c]!=null?p.sabSeed.axes[c]:AXIS_BLANK;
  var now=(p.axes[c]&&p.axes[c].held!=null)?p.axes[c].held:AXIS_BLANK;
  seeded+=Math.abs(s-AXIS_BLANK);
  moved+=Math.abs(now-s);});
 if(seeded+moved<=0)return 0;
 return Math.round(seeded/(seeded+moved)*100)/100;}

if(typeof module!=='undefined'&&module.exports){
 /* SAB33_BY and KB_KEY are core.js's and kb.js's own (core.js:592, kb.js:15);
    export.js's own list (engine/export.js) carries KB_KEY but not SAB33_BY,
    so this file re-states it rather than ask every caller to rebuild it. */
 Object.assign(module.exports,{SAB_SELFNAMES:SAB_SELFNAMES, sabSelfValid:sabSelfValid,
  sabSeedAxes:sabSeedAxes, sabSeedEmpty:sabSeedEmpty, sabSeedApply:sabSeedApply,
  sabSeedClear:sabSeedClear, sabSeedShare:sabSeedShare, SAB33_BY:SAB33_BY});}
