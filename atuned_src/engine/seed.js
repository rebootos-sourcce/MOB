
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
   scale, against a blank field's 3. */
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

/* the axes a type seeds, as absolute charges. base 3, the same floor a
   blank profile carries, so a seeded field and an unseeded one are on
   one scale. */
function seedAxes(type){
 var t=String(type||'').toUpperCase(), out={};
 CHARGES.forEach(function(c){out[c]=3;});
 if(!seedValid(t))return out;
 t.split('').forEach(function(letter){
  var d=SEED16[letter]; if(!d)return;
  Object.keys(d).forEach(function(c){
   if(out[c]!=null)out[c]=Math.max(0,Math.min(10,out[c]+d[c]));});});
 CHARGES.forEach(function(c){out[c]=Math.round(out[c]*10)/10;});
 return out;}

/* write the seed onto a profile. it records what it wrote, so the
   product can say later how much of the field is still the seed and
   how much the person has moved it. seeding twice re-seeds from the
   base rather than compounding. */
function seedApply(p,type){
 if(!p||!seedValid(type))return null;
 var ax=seedAxes(type);
 CHARGES.forEach(function(c){
  p.axes[c]=p.axes[c]||{held:3,opp:0};
  p.axes[c].held=ax[c];});
 p.seed={type:String(type).toUpperCase(), at:new Date().toISOString(), axes:ax};
 return p.seed;}

function seedClear(p){ if(p)p.seed=null; return p; }

/* HOW MUCH IS STILL THE SEED. the distance the axes have travelled from
   where the seed put them, against the distance the seed itself moved
   them from a blank field. 1 means untouched since seeding, 0 means the
   person's own input now accounts for all of it. It is a measurement,
   not a countdown: charge moved back toward the seed raises it again. */
function seedShare(p){
 if(!p||!p.seed||!p.seed.axes)return 0;
 var seeded=0, moved=0;
 CHARGES.forEach(function(c){
  var s=p.seed.axes[c]!=null?p.seed.axes[c]:3;
  var now=(p.axes[c]&&p.axes[c].held!=null)?p.axes[c].held:3;
  seeded+=Math.abs(s-3);
  moved+=Math.abs(now-s);});
 if(seeded+moved<=0)return 0;
 return Math.round(seeded/(seeded+moved)*100)/100;}
