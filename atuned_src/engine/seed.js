
/* ============================================================
   THE SEED. A four letter type is the ego's own account of
   itself. It is not a reading, so this module never claims to
   have detected one: the person states it, and it is used to
   put charge on the nine axes so a new field is not empty.

   It is built from four additive terms, not sixteen written
   patterns. Sixteen patterns would be sixteen assertions about
   people, each unarguable. Four terms are four assertions, each
   of which can be argued, and the sixteen results follow.

   Every term moves charge only. It never touches a law, a gate
   or a domain, because those are measured: the laws by the 63
   questions, the gates by what a person actually writes. A seed
   that wrote those would be putting words in their mouth.
   ============================================================ */

/* the four axes of the type, and what each pole does to the body.
   each entry is a child fetter and the charge added, on the 0 to 10
   scale, to the seed's base of SEED_BASE below. */
const SEED16={
 /* outward against inward discharge. the one term the engine measures
    directly, through balance(), so it is the term to trust most. */
 E:{Anger:0.8, Anticipation:0.8, Surprise:0.5, Fear:-0.5, Sad:-0.5},
 I:{Anger:-0.5, Anticipation:-0.4, Surprise:-0.4, Fear:0.6, Sad:0.5},
 /* where attention sits. forward and pattern seeking against present
    and concrete. anticipation is the forward lean, shock is what a
    surprise costs someone who was not looking ahead. */
 N:{Anticipation:0.8, Surprise:0.6, Apathy:-0.3, Shock:-0.3},
 S:{Anticipation:-0.6, Shock:0.4, Disgust:0.3, Surprise:-0.3},
 /* what a decision is made of. a governed read carries less affect and
    more standard. an affective read carries more worth and more grief. */
 T:{Shame:-0.8, Sad:-0.6, Disgust:0.5},
 F:{Shame:0.6, Sad:0.6, Disgust:-0.4},
 /* whether the thing is closed or left open. a closed stance holds a
    standard and stops anticipating. an open one keeps the loop running. */
 J:{Disgust:0.6, Anticipation:-0.5, Fear:-0.3},
 P:{Anticipation:0.6, Fear:0.3, Disgust:-0.4, Apathy:0.2}};

const TYPE16=['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
 'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];

function seedValid(t){return TYPE16.indexOf(String(t||'').toUpperCase())>=0;}

/* the axes a type seeds, as absolute charges, from a base of 3 on every
   axis. That base was chosen as the same floor a blank profile carried, and
   a blank carries AXIS_BLANK (engine/schema.js) now, which is 0. The base is
   what a stated type writes, so it stays 3 and is named for what it is: the
   seed's own charge, which seedShare counts as seed. Whether a seed should
   write it at all is the open decay and overwrite question, not this. */
const SEED_BASE=3;
function seedAxes(type){
 var t=String(type||'').toUpperCase(), out={};
 CHARGES.forEach(function(c){out[c]=SEED_BASE;});
 if(!seedValid(t))return out;
 t.split('').forEach(function(letter){
  var d=SEED16[letter]; if(!d)return;
  Object.keys(d).forEach(function(c){
   if(out[c]!=null)out[c]=Math.max(0,Math.min(10,out[c]+d[c]));});});
 CHARGES.forEach(function(c){out[c]=Math.round(out[c]*10)/10;});
 return out;}

/* WHETHER A SEED MAY WRITE, P0-5 of the inference audit, 23 October. The
   header above says a type is used "so a new field is not empty", and the
   code wrote it over a full one: four entries put fear at 10, choosing INFJ
   on the Intake page set it to 3.3 and put anger, shame and disgust where
   nothing was written, the card said "Nothing has moved it yet", and "not
   said" put nothing back. A seed now writes only onto an empty field: every
   axis at the blank, or every axis still exactly where the current seed put
   it, which is a type changed before anything moved. All or nothing, so a
   release that brought one axis back to the blank is still the person's. */
function seedEmpty(p){
 if(!p)return false;
 var held=function(c){return (p.axes&&p.axes[c]&&p.axes[c].held!=null)?p.axes[c].held:AXIS_BLANK;};
 var cur=p.seed&&p.seed.axes;
 return CHARGES.every(function(c){return Math.abs(held(c)-AXIS_BLANK)<1e-9;})
  ||(!!cur&&CHARGES.every(function(c){return cur[c]!=null&&Math.abs(held(c)-cur[c])<1e-9;}));}
/* write the seed onto a profile. it records what it wrote, so the
   product can say later how much of the field is still the seed and
   how much the person has moved it. seeding twice re-seeds from the
   base rather than compounding, and only while nothing has moved it. */
function seedApply(p,type){
 if(!p||!seedValid(type))return null;
 /* show only on a worked example, engine/showonly.js */
 if(showRefuse('intake',p))return null;
 if(!seedEmpty(p))return null;
 var ax=seedAxes(type);
 CHARGES.forEach(function(c){
  p.axes[c]=p.axes[c]||{held:AXIS_BLANK,opp:0};
  p.axes[c].held=ax[c];});
 p.seed={type:String(type).toUpperCase(), at:new Date().toISOString(), axes:ax};
 return p.seed;}

/* "not said" puts back what was there. A seed only ever lands on an empty
   field, so what was there is the blank, and it goes back only while the
   field is still exactly the seed: once a story or a slider has moved it,
   the field is the person's and stays, and only the type comes off. A
   worked example is show only and is not written. */
function seedClear(p){
 if(!p||(typeof showOnly==='function'&&showOnly(p)))return p;
 if(p.seed&&p.seed.axes&&seedEmpty(p))CHARGES.forEach(function(c){
  p.axes[c]=p.axes[c]||{held:AXIS_BLANK,opp:0}; p.axes[c].held=AXIS_BLANK;});
 p.seed=null; return p;}

/* HOW MUCH IS STILL THE SEED. the distance the axes have travelled from
   where the seed put them, against the distance the seed itself moved
   them from a blank field. 1 means untouched since seeding, 0 means the
   person's own input now accounts for all of it. It is a measurement,
   not a countdown: charge moved back toward the seed raises it again.
   THE BLANK IS AXIS_BLANK, NOT 3. This measured the seed from a blank of 3
   after the blank profile had moved to 0, so the base of 3 the seed puts on
   all nine axes was never counted as seed. Measured at e9ca1ae (probe p2 A):
   an ESTJ seed wrote 26.80 units, one story brought the field to 37.07, and
   the line under the type said 36% was still the seed, where the seed's
   share of what the axes carried was about 72%. */
function seedShare(p){
 if(!p||!p.seed||!p.seed.axes)return 0;
 var seeded=0, moved=0;
 CHARGES.forEach(function(c){
  var s=p.seed.axes[c]!=null?p.seed.axes[c]:AXIS_BLANK;
  var now=(p.axes[c]&&p.axes[c].held!=null)?p.axes[c].held:AXIS_BLANK;
  seeded+=Math.abs(s-AXIS_BLANK);
  moved+=Math.abs(now-s);});
 if(seeded+moved<=0)return 0;
 return Math.round(seeded/(seeded+moved)*100)/100;}
