/* ============================================================
   INTAKE · 21 laws x 3, triangulated left / right / neutral.
   Blocked into 21 units of three. Resumable. Live partial CQ.
   Every completed law is its own finding.
   ============================================================ */
var Q3=[
 {k:'left',   q:'When it costs you something, how often do you STEM?'},
 {k:'right',  q:'When nobody would know, how often do you STEM?'},
 {k:'neutral',q:'On an ordinary day, how often do you STEM without deciding to?'}];
var IQ_STEM={
 Truth:'say the true thing', Transparency:'let yourself be seen as you are',
 /* JUSTICE AND HUMILITY WERE RENAMED AND THIS TABLE WAS MISSED, so six of the
    sixty three questions asked a person "how often do you justice?" and "how
    often do you humility?" and shipped that way. The rename was carried into
    SI, into HARM and into the migration table at schema.js, and stopped here.
    The `||` fallback below is what hid it: without it the intake would have
    printed undefined and this would have been found the day it landed. The
    fallback is gone now, so the next missed rename throws instead of reading
    like a broken sentence to somebody answering questions about themselves.

    The two phrases are written to the same pattern as the other nineteen: a
    verb the person can picture doing, no abstraction, nothing they are scored
    against that they cannot recognise. They are mine rather than his, so they
    are the first thing to overrule. */
 Justice:'give the other what is actually theirs',
 Humility:'let the world be more right than you',
 Unity:'act as if the other is not separate',
 Awareness:'notice what you are doing while you do it', Nature:'let things be what they are',
 Presence:'stay in the room with what is happening',
 Equanimity:'stay level when it moves', Compassion:'feel it without fixing it',
 Forgiveness:'put it down', Generosity:'give without a ledger',
 'Aesthetic Beauty':'make the thing well', Courage:'move toward what you are avoiding',
 Duty:'do what is yours to do', Responsibility:'own your part',
 Accountability:'name it out loud to someone', Temperance:'stop at enough',
 Detachment:'let the outcome be the outcome', 'Non-Harm':'take the option that costs others least',
 Patience:'wait without leaking'};
function iqList(){ var out=[];
 SI.forEach(function(l,li){ Q3.forEach(function(t,ti){
  out.push({law:l.nm, band:l.b, side:t.k, i:li*3+ti, block:li,
   /* NO FALLBACK. See the note on the table above: the fallback substituted the
      law's own name as a verb, which reads as a sentence and therefore hid a
      missed rename for as long as it existed. A missing phrase is a defect and
      has to look like one. */
   q:t.q.replace('STEM',IQ_STEM[l.nm])});});});
 return out;}
function iqScore(p){
 if(!p||!p.intake||!p.intake.answers)return {};
 /* three answers per law -> one 0-10 score. the neutral is the baseline,
    left and right are the pull. the spread is the signal strength. */
 var out={};
 SI.forEach(function(l,li){
  var a=p.intake.answers, v=[a[li*3],a[li*3+1],a[li*3+2]];
  if(v.some(function(x){return x==null;})) return;
  var mean=(v[0]+v[1]+v[2])/3;
  var spread=Math.max.apply(null,v)-Math.min.apply(null,v);
  /* a spread under 3 is inside self-report noise. do not name a lean the
     instrument cannot actually see. */
  out[l.nm]={score:Math.round(mean*10)/10, spread:Math.round(spread*10)/10,
   reliable: spread>=3,
   lean: spread<3 ? 'even, within measurement noise'
       : v[0]>v[1] ? 'holds when it costs, slips when unseen'
       : 'holds when unseen, slips when it costs'};});
 return out;}
function iqApply(p){
 if(!p||!p.intake)return {};
 var sc=iqScore(p);
 Object.keys(sc).forEach(function(nm){ p.laws[nm]=sc[nm].score; S.law[nm]=sc[nm].score; });
 p.intake.done=Object.keys(sc);
 if(p.intake.done.length===21 && !p.intake.completedAt) p.intake.completedAt=new Date().toISOString();
 return sc;}

