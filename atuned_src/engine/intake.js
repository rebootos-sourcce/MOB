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
 Expression:'say what is actually there', Unity:'act as if the other is not separate',
 Awareness:'notice what you are doing while you do it', Nature:'let things be what they are',
 Presence:'stay in the room with what is happening', Discernment:'tell the real from the plausible',
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
   q:t.q.replace('STEM',(IQ_STEM[l.nm]||l.nm.toLowerCase()))});});});
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

