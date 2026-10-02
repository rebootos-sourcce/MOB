/* ============================================================
   THE JOURNEY. What a new person has done on the way in, as facts
   on the record, and what the account is handed when it is made.

   Slices O1 and O3 of ATUNED-onboarding-REVIEW-2-systems.md section
   (f), with the owner's rulings of round OX (1 October): the account
   is created AFTER the first release and everything the person put in
   is passed over at sign up; the gift is a counter of a hundred and
   the counter space can carry other things; the integrity questions
   are part of the starting session and their answers are evidence
   only.

   HOST FREE. No document, no store, no network. The host binds
   storage and draws. Every writer here takes the record and either
   changes it completely or refuses by name and changes nothing, the
   way meterRun and practiceDo do, so a caller never has to put
   anything back.

   WHAT IS STORED AND WHAT IS DERIVED, said once. Stored: the runs, the
   log, the integrity answers, the gift's counter and its extras, and
   the stamp a claim leaves. Derived and never stored: the stage a
   person is at, the counts of runs, the gift as it reads against the
   meter, how many questions are answered, and the whole of the mini
   release's plan. A stored derived value is how two truths appear.

   THE ONE EXCEPTION IS THE GIFT'S USED AND REMAINING, which the owner
   ruled a counter. They are stored as what the counter said when it was
   last written (journeyGiftSync), and the allowance never reads them:
   planAllowance counts meter.unique and GIFT_N, and journeyRead reports
   the counter it derives from the same two, with `drift` naming a
   stored counter that disagrees. So the record can carry the counter
   the owner asked for and still cannot grant itself a single pattern
   by being edited, which is the reason plan.js refuses the same thing
   one level over.

   No SCHEMA_V bump. The journey is additive under v2: absent reads as
   the blank, and v1 and v2 records still load. It has its own version,
   JOURNEY_V, like practice and trace. An older build reading a newer
   record refuses it, keeps the bytes, and never loads it (pStore), which
   is a loss of the view and never of the data.
   ============================================================ */

/* the three shapes a free key may take, so no free text can ride in under a
   known name. An id, a reference into the record (an entry's date, a run's
   index, a question id), and a value in a log line's detail. */
var JY_KEY=/^[a-z][a-z0-9_]{0,31}$/;
var JY_REF=/^[A-Za-z0-9_:.\-]{1,64}$/;
var JY_VAL=/^[a-z0-9_]{1,32}$/;
var JY_DAY=86400000;

function journeyBlank(){
 return {v:JOURNEY_V, gift:null, claimed:null, runs:[],
  integrity:{at0:null, at1:null, answers:{}}, log:[]};}

/* A MOMENT AS THE CALLER GIVES IT, an ISO string or a number of milliseconds or
   nothing. The engine never reads a clock it was not handed except as the
   default for a caller that gave none, so every test can pin one. */
function jyAt(now){
 if(typeof now==='string')return now;
 return new Date(NUM(now)?now:Date.now()).toISOString();}
function jyMs(now){
 var t=typeof now==='string'?new Date(now).getTime():(NUM(now)?now:Date.now());
 return NUM(t)?t:Date.now();}
function jyEnsure(p){
 if(!p.journey||typeof p.journey!=='object'||Array.isArray(p.journey))p.journey=journeyBlank();
 return p.journey;}
/* a whole number in range, refused and never clamped. vRange treats a missing
   value as fine, which is right for an optional field and wrong for a field a
   shape requires, so this one does not. */
function jyInt(errs,path,v,lo,hi){
 if(!NUM(v)||v%1!==0){errs.push(path+' is not a whole number'); return null;}
 if(v<lo||v>hi){errs.push(path+' is '+v+', outside '+lo+' to '+hi); return null;}
 return v;}
/* A DATE THAT PARSES, AND IS NOT FROM THE FUTURE. A day of slack, because a
   phone's clock and a laptop's differ by minutes and a zone is not a fault, and
   no more than that: a stamp a week ahead is a record written by something
   else, and the free weeks and the order of the log are counted from these. */
function jyDate(errs,path,t,nowMs){
 if(vDate(errs,path,t)===null)return null;
 if(new Date(t).getTime()>nowMs+JY_DAY){errs.push(path+' is ahead of the clock'); return null;}
 return t;}
function jyDateOrNull(errs,path,t,nowMs){
 return (t===null||t===undefined)?null:jyDate(errs,path,t,nowMs);}

/* ---------------- one run, and one log line: the shared checks ---------------- */
/* A RUN IS HOW IT ENDED AND WHAT IT MOVED, and nothing about what the person
   said it did. lines is the lines the commit counted, which is what meter.lines
   moved by: meterRun and meterRerun take the whole plan, so a run ended early
   still moved the meter by every line of it, and a record that said fewer would
   disagree with the meter it sits beside. fresh is new ground, never more than
   lines. */
var JY_RUN_KEYS=['t','lines','fresh','rerun','end'];
function jyRun(errs,x,i,nowMs){
 var path='journey.runs['+i+']';
 if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(path+' is not an object'); return null;}
 vKeys(errs,path,x,JY_RUN_KEYS);
 var t=jyDate(errs,path+'.t',x.t,nowMs);
 var lines=jyInt(errs,path+'.lines',x.lines,0,1e6);
 var fresh=jyInt(errs,path+'.fresh',x.fresh,0,1e6);
 if(lines!==null&&fresh!==null&&fresh>lines){errs.push(path+'.fresh is more than lines'); fresh=null;}
 if(typeof x.rerun!=='boolean'){errs.push(path+'.rerun is not true or false');}
 if(JOURNEY_END.indexOf(x.end)<0)errs.push(path+'.end is not completed, ended or closed');
 /* a rerun opens nothing, which is the rule meterRerun keeps; a card closed
    before it finished committed nothing, which is the rule relClose keeps */
 if(x.rerun===true&&fresh!==null&&fresh!==0)errs.push(path+'.fresh is '+fresh+' on a rerun, which opens nothing');
 if(x.end==='closed'&&((lines!==null&&lines!==0)||(fresh!==null&&fresh!==0)))
  errs.push(path+' is closed and holds lines, but a closed run commits nothing');
 if(t===null||lines===null||fresh===null)return null;
 return {t:t, lines:lines, fresh:fresh, rerun:x.rerun===true, end:x.end};}
var JY_LOG_KEYS=['seq','type','at','ref','d'];
function jyLog(errs,x,i,nowMs){
 var path='journey.log['+i+']';
 if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(path+' is not an object'); return null;}
 vKeys(errs,path,x,JY_LOG_KEYS);
 if(x.seq!==i+1)errs.push(path+'.seq is not the next number');
 if(JOURNEY_EVENTS.indexOf(x.type)<0)errs.push(path+'.type is not an event type: '+String(x.type).slice(0,40));
 var at=jyDate(errs,path+'.at',x.at,nowMs);
 /* NO FREE TEXT IN THE LOG. A log that held words would be a second copy of the
    story, and it is the part of the record an analytics seam would be pointed at
    first. A reference is a key into the record and a detail is a small closed
    object of whole numbers, true or false, and short lower case words. */
 var ref=null;
 if(x.ref!==null&&x.ref!==undefined){
  if(NUM(x.ref)&&x.ref%1===0&&x.ref>=0&&x.ref<=1e9)ref=x.ref;
  else if(typeof x.ref==='string'&&JY_REF.test(x.ref))ref=x.ref;
  else errs.push(path+'.ref is not a key into the record');}
 var d={};
 if(x.d!==null&&x.d!==undefined){
  if(typeof x.d!=='object'||Array.isArray(x.d))errs.push(path+'.d is not an object');
  else{
   var ks=Object.keys(x.d);
   if(ks.length>6)errs.push(path+'.d holds '+ks.length+' values, more than 6');
   ks.forEach(function(k){
    var v=x.d[k];
    if(!JY_KEY.test(k)){errs.push(path+'.d may not carry '+k.slice(0,40)); return;}
    if(typeof v==='boolean'||(NUM(v)&&v%1===0&&v>=0&&v<=1e9)||(typeof v==='string'&&JY_VAL.test(v)))d[k]=v;
    else errs.push(path+'.d.'+k+' is free text and not a count or a word');});}}
 if(at===null)return null;
 return {seq:x.seq, type:x.type, at:at, ref:ref, d:d};}

/* ---------------- the gift, as the owner's counter ---------------- */
var JY_GIFT_KEYS=['at','src','granted','used','remaining','extras'];
function jyGift(errs,g,nowMs){
 var path='journey.gift';
 if(g===null||g===undefined)return null;
 if(typeof g!=='object'||Array.isArray(g)){errs.push(path+' is not an object'); return null;}
 vKeys(errs,path,g,JY_GIFT_KEYS);
 var at=jyDate(errs,path+'.at',g.at,nowMs);
 if(JOURNEY_SRC.indexOf(g.src)<0)errs.push(path+'.src is not funnel or app');
 var gr=jyInt(errs,path+'.granted',g.granted,0,1e6);
 var us=jyInt(errs,path+'.used',g.used,0,gr===null?1e6:gr);
 var rm=jyInt(errs,path+'.remaining',g.remaining,0,1e6);
 /* the counter has to add up to itself. It is a record of what was written
    and not a second authority, so the one thing the boundary can hold is that
    the two halves are the whole. */
 if(gr!==null&&us!==null&&rm!==null&&us+rm!==gr)
  errs.push(path+'.remaining is '+rm+' and used is '+us+', which do not make '+gr);
 var ex=[];
 if(g.extras!==undefined&&g.extras!==null){
  if(!Array.isArray(g.extras))errs.push(path+'.extras is not a list');
  else if(g.extras.length>JOURNEY_EXTRAS_MAX)
   errs.push(path+'.extras holds '+g.extras.length+', more than '+JOURNEY_EXTRAS_MAX);
  else{
   var seen={};
   g.extras.forEach(function(e,i){
    var ep=path+'.extras['+i+']';
    if(!e||typeof e!=='object'||Array.isArray(e)){errs.push(ep+' is not an object'); return;}
    vKeys(errs,ep,e,['k','n','at']);
    if(typeof e.k!=='string'||!JY_KEY.test(e.k)){errs.push(ep+'.k is not a counter name'); return;}
    if(seen[e.k]){errs.push(path+'.extras lists '+e.k+' twice'); return;}
    seen[e.k]=1;
    var n=jyInt(errs,ep+'.n',e.n,0,1e6);
    var ea=jyDate(errs,ep+'.at',e.at,nowMs);
    if(n!==null&&ea!==null)ex.push({k:e.k,n:n,at:ea});});}}
 if(at===null||gr===null||us===null||rm===null)return null;
 return {at:at, src:g.src, granted:gr, used:us, remaining:rm, extras:ex};}

/* ---------------- the boundary ---------------- */
/* THE JOURNEY'S OWN BOUNDARY, into the same errs as every other part, so one bad
   field refuses the whole record and pImport stays atomic. It is read after
   the meter, because the meter is what bounds the runs: a run's fresh lines are
   keys in meter.unique, so a record whose runs claim more new ground than the
   meter holds is not an older record, it is a journey nobody walked, and it is
   refused by name rather than clamped. ctx carries the unique count and, for a
   gate that wants one, the clock. */
function journeyValidate(errs,o,path,ctx){
 var P=journeyBlank(), c=ctx||{}, nowMs=jyMs(c.now), base=path||'journey';
 if(o===undefined||o===null)return P;
 if(typeof o!=='object'||Array.isArray(o)){errs.push(base+' is not an object'); return P;}
 vKeys(errs,base,o,['v','gift','claimed','runs','integrity','log']);
 if(o.v!==undefined&&o.v!==JOURNEY_V)
  errs.push(base+'.v is '+JSON.stringify(o.v)+', not a journey version this build reads ('+JOURNEY_V+')');
 P.gift=jyGift(errs,o.gift,nowMs);
 /* WHO ASKED FOR THE RECORD TO BE TAKEN OVER, once. Null until a claim lands. */
 if(o.claimed!==undefined&&o.claimed!==null){
  var cl=o.claimed;
  if(typeof cl!=='object'||Array.isArray(cl))errs.push(base+'.claimed is not an object');
  else{
   vKeys(errs,base+'.claimed',cl,['at','via']);
   var ca=jyDate(errs,base+'.claimed.at',cl.at,nowMs);
   if(JOURNEY_VIA.indexOf(cl.via)<0)errs.push(base+'.claimed.via is not local, record, file or account');
   else if(ca!==null)P.claimed={at:ca,via:cl.via};}}
 if(o.runs!==undefined&&o.runs!==null){
  if(!Array.isArray(o.runs))errs.push(base+'.runs is not a list');
  else if(o.runs.length>JOURNEY_RUNS_MAX)
   errs.push(base+'.runs holds '+o.runs.length+', more than the '+JOURNEY_RUNS_MAX+' a record may carry');
  else{
   P.runs=o.runs.map(function(x,i){return jyRun(errs,x,i,nowMs);}).filter(Boolean);
   var fresh=0; P.runs.forEach(function(r){fresh+=r.fresh;});
   if(NUM(c.unique)&&fresh>c.unique)
    errs.push(base+'.runs holds '+fresh+' new lines, more than the '+c.unique
     +' this record has opened');}}
 if(o.integrity!==undefined&&o.integrity!==null){
  var it=o.integrity, ip=base+'.integrity';
  if(typeof it!=='object'||Array.isArray(it))errs.push(ip+' is not an object');
  else{
   vKeys(errs,ip,it,['at0','at1','answers']);
   var a0=jyDateOrNull(errs,ip+'.at0',it.at0,nowMs), a1=jyDateOrNull(errs,ip+'.at1',it.at1,nowMs);
   var ids=JOURNEY_INTEGRITY.map(function(q){return q.id;}), ans={};
   if(it.answers!==undefined&&it.answers!==null){
    if(typeof it.answers!=='object'||Array.isArray(it.answers))errs.push(ip+'.answers is not an object');
    else Object.keys(it.answers).forEach(function(k){
     if(ids.indexOf(k)<0){errs.push(ip+'.answers names no question: '+k.slice(0,40)); return;}
     var v=jyInt(errs,ip+'.answers.'+k,it.answers[k],0,10);
     if(v!==null)ans[k]=v;});}
   var n=Object.keys(ans).length;
   if(n&&a0===null)errs.push(ip+'.at0 is missing, and answers are held');
   if(a1!==null&&n<ids.length)errs.push(ip+'.at1 says it was finished and '+n+' of '+ids.length+' are answered');
   if(a0!==null&&a1!==null&&new Date(a1).getTime()<new Date(a0).getTime())errs.push(ip+'.at1 is before at0');
   P.integrity={at0:a0, at1:a1, answers:ans};}}
 if(o.log!==undefined&&o.log!==null){
  if(!Array.isArray(o.log))errs.push(base+'.log is not a list');
  else if(o.log.length>JOURNEY_LOG_MAX)
   errs.push(base+'.log is full: '+o.log.length+' entries, and the cap is '+JOURNEY_LOG_MAX);
  else P.log=o.log.map(function(x,i){return jyLog(errs,x,i,nowMs);}).filter(Boolean);}
 return P;}

/* ---------------- the log ---------------- */
/* ONE LINE, REFUSED BY NAME OR WRITTEN WHOLE. The check is the boundary's own,
   so a line that could be written is a line that will load, and a log this
   function made can never be the reason a record is refused at the next boot. */
function journeyLog(p,type,ref,d,now){
 if(!p)return {ok:false, why:'no record'};
 var j=jyEnsure(p);
 if(j.log.length>=JOURNEY_LOG_MAX)
  return {ok:false, why:'journey.log is full: '+j.log.length+' entries, and the cap is '+JOURNEY_LOG_MAX};
 var errs=[], e=jyLog(errs,{seq:j.log.length+1,type:type,at:jyAt(now),ref:ref===undefined?null:ref,d:d||{}},
  j.log.length,Date.now());
 if(errs.length)return {ok:false, why:errs[0]};
 j.log.push(e);
 return {ok:true, entry:e};}

/* ---------------- the gift ---------------- */
/* WHAT THE COUNTER SAYS, AS READ OFF THE METER. granted is the gift row's own
   size and used is the new ground opened, capped at it, because meter.unique is
   what planAllowance counts and a second count is a second answer. A stored
   counter is reported beside it and `drift` says when the two disagree. */
function journeyGiftRead(p){
 var m=(p&&p.meter)||{}, n=Array.isArray(m.unique)?m.unique.length:0;
 var g=(p&&p.journey&&p.journey.gift)||null;
 var used=Math.min(GIFT_N,n);
 return {granted:GIFT_N, used:used, remaining:GIFT_N-used, spent:used>=GIFT_N,
  issued:!!g, at:g?g.at:null, src:g?g.src:null,
  extras:g?g.extras.map(function(e){return {k:e.k,n:e.n,at:e.at};}):[],
  drift:!!g&&(g.used!==used||g.remaining!==GIFT_N-used)};}
/* WRITE THE COUNTER'S USED AND REMAINING from the meter. The one place the
   stored half is written, so it is the one place that can be wrong, and it is
   called from the writer of every fact that moves the meter (journeyRun). */
function journeyGiftSync(p){
 var j=jyEnsure(p);
 if(!j.gift)return null;
 var r=journeyGiftRead(p);
 j.gift.granted=r.granted; j.gift.used=r.used; j.gift.remaining=r.remaining;
 return j.gift;}
/* ISSUE THE GIFT, ONCE. A record has one gift, so a second call changes nothing
   and says so. src is where it was issued: the funnel, or the app. */
function journeyGiftIssue(p,src,now){
 if(!p)return {ok:false, why:'no record'};
 if(JOURNEY_SRC.indexOf(src)<0)return {ok:false, why:'journey.gift.src is not funnel or app'};
 var j=jyEnsure(p);
 if(j.gift)return {ok:true, issued:false, gift:j.gift};
 var r=journeyGiftRead(p);
 j.gift={at:jyAt(now), src:src, granted:r.granted, used:r.used, remaining:r.remaining, extras:[]};
 var lg=journeyLog(p,'starter_gift_issued',null,{granted:r.granted},now);
 return {ok:true, issued:true, gift:j.gift, logged:lg.ok};}
/* THE COUNTER SPACE, ruled: "we can use that counter space for other things".
   A named count beside the gift, set and not added, so a caller says what it
   now is. NOTHING READS THESE INTO THE ALLOWANCE. The referral's twenty five is
   supply and has to be minted by a server and signed (Review 2 a2), and a
   counter a person's own record carries cannot be what grants it, which is the
   reason the plan is written only from the processor's state. The gate holds
   planAllowance unmoved by every value set here. */
function journeyGiftExtra(p,k,n,now){
 if(!p)return {ok:false, why:'no record'};
 var j=jyEnsure(p);
 if(!j.gift)return {ok:false, why:'journey.gift is not issued, so it has no counter space'};
 var errs=[];
 if(typeof k!=='string'||!JY_KEY.test(k))return {ok:false, why:'journey.gift.extras.k is not a counter name'};
 var v=jyInt(errs,'journey.gift.extras.'+k+'.n',n,0,1e6);
 if(v===null)return {ok:false, why:errs[0]};
 var at=jyAt(now);
 /* refused at the ceiling, for a new name only: setting one that is already
    there is not growth */
 var hit=null; j.gift.extras.forEach(function(e){if(e.k===k)hit=e;});
 if(!hit&&j.gift.extras.length>=JOURNEY_EXTRAS_MAX)
  return {ok:false, why:'journey.gift.extras holds '+j.gift.extras.length+', more than '+JOURNEY_EXTRAS_MAX};
 if(hit){hit.n=v; hit.at=at;} else j.gift.extras.push({k:k,n:v,at:at});
 return {ok:true, extra:{k:k,n:v,at:at}};}

/* ---------------- the runs ---------------- */
/* A RUN IS WRITTEN WHEN IT ENDS OR IS CLOSED, by the host, once. relCoolDown
   writes completed or ended (Stop and End come through it with halted set) and
   relClose writes closed for a card shut before it finished. The facts are
   three numbers and a flag and nothing else: lines, fresh, rerun.

   IT REFUSES A RUN THE BOUNDARY WOULD REFUSE. The same checks run here, and the
   sum of new ground against the meter is checked before the push, so a caller
   that got a number wrong is told so and the record is not made unloadable.
   The host calls this AFTER meterRun, because fresh is keys that are now in
   meter.unique.

   And it keeps the two places the first release leaves a trace in step with
   it: the gift's counter is synced from the meter (issued here the first time,
   because the first release is the moment the app knows the gift is being
   spent), and the log takes one line a run, not one per line said. A full log
   never stops a run being recorded: the log is the lesser record. */
function journeyRun(p,end,facts,now){
 if(!p)return {ok:false, why:'no record'};
 var j=jyEnsure(p), f=facts||{};
 if(j.runs.length>=JOURNEY_RUNS_MAX)
  return {ok:false, why:'journey.runs holds '+j.runs.length+', more than the '+JOURNEY_RUNS_MAX+' a record may carry'};
 var errs=[], i=j.runs.length;
 var run=jyRun(errs,{t:jyAt(now),lines:f.lines,fresh:f.fresh,rerun:f.rerun===true,end:end},i,Date.now());
 if(errs.length)return {ok:false, why:errs[0]};
 var before=0; j.runs.forEach(function(r){before+=r.fresh;});
 var held=(p.meter&&Array.isArray(p.meter.unique))?p.meter.unique.length:0;
 if(before+run.fresh>held)
  return {ok:false, why:'journey.runs holds '+(before+run.fresh)+' new lines, more than the '+held
   +' this record has opened'};
 var firstDone=!j.runs.some(function(r){return r.end==='completed';});
 j.runs.push(run);
 var out={ok:true, run:run, index:i, logged:[]};
 if(run.end!=='closed'){
  var g=journeyGiftIssue(p,'app',now);
  if(g.issued&&g.logged)out.logged.push('starter_gift_issued');
  journeyGiftSync(p);
  var ev=[];
  if(run.rerun)ev.push(['pattern_rerun',{lines:run.lines}]);
  else ev.push(['pattern_released',{lines:run.lines,fresh:run.fresh}]);
  if(run.end==='completed'&&firstDone&&!run.rerun)ev.push(['first_release_completed',{lines:run.lines}]);
  ev.forEach(function(e){if(journeyLog(p,e[0],i,e[1],now).ok)out.logged.push(e[0]);});}
 return out;}

/* ---------------- the ten integrity questions ---------------- */
/* AN ANSWER IS EVIDENCE AND NOTHING ELSE. It is written to journey.integrity
   and to nowhere that moves a band: not p.laws, not p.intake, not S, and so not
   CQ. Ruled, round OX, ruling 5. A changed answer replaces the value, because
   the question is what the person says now, and the log keeps that it was
   answered twice. Refused by name when the id is not one of the ten or the
   value is not a whole number from 0 to 10, and a refusal changes nothing. */
function journeyIntegrityAnswer(p,id,v,now){
 if(!p)return {ok:false, why:'no record'};
 var ids=JOURNEY_INTEGRITY.map(function(q){return q.id;});
 if(typeof id!=='string'||ids.indexOf(id)<0)
  return {ok:false, why:'journey.integrity.answers names no question: '+String(id).slice(0,40)};
 var errs=[];
 if(jyInt(errs,'journey.integrity.answers.'+id,v,0,10)===null)return {ok:false, why:errs[0]};
 var j=jyEnsure(p), it=j.integrity, at=jyAt(now), first=!Object.keys(it.answers).length;
 it.answers[id]=v;
 if(!it.at0)it.at0=at;
 var done=Object.keys(it.answers).length===ids.length;
 if(done&&!it.at1)it.at1=at;
 var lg=[];
 if(first&&journeyLog(p,'integrity_assessment_started',null,null,now).ok)lg.push('integrity_assessment_started');
 if(journeyLog(p,'integrity_question_answered',id,null,now).ok)lg.push('integrity_question_answered');
 if(done&&it.at1===at&&journeyLog(p,'integrity_assessment_completed',null,null,now).ok)
  lg.push('integrity_assessment_completed');
 return {ok:true, id:id, value:v, answered:Object.keys(it.answers).length, of:ids.length,
  complete:done, logged:lg};}

/* ---------------- the read ---------------- */
/* WHERE THE PERSON IS, derived off the record and never stored. A record
   written before the journey existed has no runs and is not a first run
   record: any record carrying a first line, a finished intake or a ritual has
   been used, so it reads `continuing` and onboarding does not replay. For
   that record the count of releases is unknown and not nought, because runs
   were never counted, and runs.known says so: it is false while the meter has
   spoken more lines than the runs account for. Review 2 section a8. */
function journeyRead(p,now){
 var j=(p&&p.journey)||journeyBlank();
 var m=(p&&p.meter)||{}, entries=(p&&p.story&&p.story.entries)||[];
 var r={n:j.runs.length, completed:0, ended:0, closed:0, rerun:0, fresh:0, lines:0, last:null};
 j.runs.forEach(function(x){
  r[x.end]++; if(x.rerun&&x.end!=='closed')r.rerun++;
  r.fresh+=x.fresh; r.lines+=x.lines; r.last=x.t;});
 r.known=(+m.lines||0)<=r.lines;
 var released=r.completed+r.ended>0;
 var prior=!!(m.first||(p&&p.intake&&p.intake.completedAt)||(p&&p.rituals&&p.rituals.length));
 var stage=released?'released':(prior?'continuing':(entries.length?'storied':'new'));
 var ids=JOURNEY_INTEGRITY.length, ans=Object.keys(j.integrity.answers).length;
 return {v:JOURNEY_V, stage:stage, first:stage==='new'||stage==='storied',
  runs:r, gift:journeyGiftRead(p),
  integrity:{answered:ans, of:ids, complete:ans===ids, at0:j.integrity.at0, at1:j.integrity.at1},
  claimed:j.claimed, events:j.log.length, logFull:j.log.length>=JOURNEY_LOG_MAX};}

/* ---------------- the mini release's plan ---------------- */
/* THE PLAN FOR A FIRST RELEASE, in whole addresses, and it writes nothing.

   A run is an address across four channels, four lines, and an address is never
   cut in half: half an address is not a release at all (RUN_MIN, plan.js). The
   owner ruled the mini release is twelve lines, three addresses (ONB_MINI_ADDRS).
   Fewer when the allowance leaves fewer, and a whole number of addresses
   whatever it leaves: the cap is the allowance read through meterBudget, and
   an address is only taken if all four of its lines are inside it.

   DETERMINISTIC. The same record and the same signal give the same plan, so a
   plan a person was shown is the plan that runs. No clock but the one handed
   in, and no randomness.

   THE SIGNAL is what the story read: { unread, addrs }, where addrs is a list
   of { node, stated, inferred } in the order the reading weighed them, which
   is parseStory's imprints exactly (a signal may also carry them as
   `imprints`). An unread signal plans nothing, because there is nothing to
   choose from and inventing a plan for a story that read as nothing is the
   Mirror claiming a certainty it does not have. A stated address goes first, an
   address the words did not name but the seat did goes after, and an inferred
   one last: the charge still lands where the body holds it, and the plan says
   how many of its addresses were inferred (`inferred`) so the card can say so.
   New ground only: an address with a line already open down any channel is
   still planned, at its next unopened line, but one with nothing left to open
   is skipped, since a plan that opens nothing is a rerun and not this.

   Returns { ok, addrs, keys, lines, inferred, cap } or { ok:false, why } with
   why one of: 'no record', 'unread', 'no new ground', 'allowance'. */
function onbMiniPlan(p,signal,now){
 if(!p||!p.meter)return {ok:false, why:'no record'};
 var sg=signal||{}, list=sg.addrs||sg.imprints||[];
 var cand=[], seen={};
 list.forEach(function(a,i){
  var id=(a&&typeof a==='object')?a.node:a;
  if(!NUM(id)||seen[id]||!BY[id]||!BY[id].cf)return;
  seen[id]=1;
  var tier=(a&&typeof a==='object')?(a.stated?0:(a.inferred?2:1)):1;
  cand.push({id:id, tier:tier, at:i, inferred:tier===2});});
 if(sg.unread===true||!cand.length)return {ok:false, why:'unread'};
 cand.sort(function(a,b){return a.tier-b.tier||a.at-b.at;});
 var cap=meterBudget(p,now).cap;
 var whole=Math.min(ONB_MINI_ADDRS,Math.floor(cap/RUN_MIN));
 if(whole<1)return {ok:false, why:'allowance', cap:cap};
 var open=cand.filter(function(c){return meterPlan(p,[c.id],ONB_CHANS,RUN_MIN).length===RUN_MIN;});
 if(!open.length)return {ok:false, why:'no new ground'};
 var take=open.slice(0,whole), ids=take.map(function(c){return c.id;});
 var keys=meterPlan(p,ids,ONB_CHANS,ids.length*RUN_MIN);
 return {ok:true, addrs:ids, keys:keys, lines:keys.length,
  inferred:take.filter(function(c){return c.inferred;}).length, cap:cap};}

/* ---------------- the claim ---------------- */
/* WHAT IS PASSED OVER AT SIGN UP. Ruled, round OX, ruling 1: the account is
   created after the first release, and all the data from the person's input is
   passed over. His own word for the route is a device-local handoff claimed at
   sign up, and this is the packet, built as a pure function. It sends nothing:
   the network call is a later slice and the one seam for it is ui/auth.js.

   WHAT CROSSES AND WHAT NEVER DOES, as two tables that must between them name
   every top level key the blank profile has, so a field added to the record
   later cannot cross by default: the gate fails until somebody puts it in one
   list or the other. The analytic and summary data cross (the nine charges, the
   laws, the intake, the history rows, the meter's counts, the daily summaries)
   and so does the story, text included, on the owner's ruling. His reasoning
   for the text is in DECISIONS.md and is not re-argued here.

   BIRTH DATA NEVER CROSSES, and with it the name: `who` holds the name parts, the
   sex and the birth moment, and the three of them are the one identifying thing
   the product has promised never leaves a device. `name` and `id` stay for the
   same reason, `ui` is this browser's own switches, and `plan` is written by
   the processor and never by a record. A claim carrying any of them is refused
   by name at its own boundary.

   It does not touch the record it reads. It reads it through validateProfile,
   which builds a fresh object, so what is returned shares nothing with the live
   profile and a caller that edits the packet cannot move the person's data. */
var JOURNEY_CLAIM_SEND=['soul','axes','laws','seed','intake','work','gates','story',
 'rituals','history','meter','avatar','purpose','practice','trace','summaries','journey'];
var JOURNEY_CLAIM_NEVER=['v','id','name','created','updated','who','ui','plan'];
var JOURNEY_CLAIM_V=1;
function journeyClaim(record,now){
 var v=validateProfile(record);
 if(!v.ok)return {ok:false, errs:v.errs.slice(0,5)};
 var body={};
 JOURNEY_CLAIM_SEND.forEach(function(k){
  if(v.profile[k]!==undefined)body[k]=JSON.parse(JSON.stringify(v.profile[k]));});
 return {ok:true, claim:{kind:'atuned.claim', v:JOURNEY_CLAIM_V, schema:SCHEMA_V,
  at:jyAt(now), body:body}};}
/* THE CLAIM'S BOUNDARY, for whatever receives one: the same posture as
   validateProfile and built on it. A key outside the packet is refused by name,
   and so is every one the claim never carries, and then the body goes through
   the profile boundary itself, so a charge of 9999 or an unknown seat in a
   claim is refused exactly as it is in an import and for the same reason. A
   claim that fails changes nothing, because this reads and returns. */
function journeyClaimCheck(c,now){
 var errs=[], nowMs=jyMs(now);
 if(!c||typeof c!=='object'||Array.isArray(c))return {ok:false, errs:['claim is not an object']};
 vKeys(errs,'claim',c,['kind','v','schema','at','body']);
 if(c.kind!=='atuned.claim')errs.push('claim.kind is not atuned.claim');
 if(c.v!==JOURNEY_CLAIM_V)errs.push('claim.v is '+JSON.stringify(c.v)+', not a claim version this build reads ('+JOURNEY_CLAIM_V+')');
 if(!NUM(c.schema)||c.schema%1!==0||c.schema<1||c.schema>SCHEMA_V)
  errs.push('claim.schema is '+JSON.stringify(c.schema)+', not 1 to '+SCHEMA_V);
 jyDate(errs,'claim.at',c.at,nowMs);
 if(!c.body||typeof c.body!=='object'||Array.isArray(c.body)){
  errs.push('claim.body is not an object');
  return {ok:false, errs:errs};}
 Object.keys(c.body).forEach(function(k){
  if(JOURNEY_CLAIM_NEVER.indexOf(k)>=0)errs.push('claim.body.'+k+' is not carried by a claim');
  else if(JOURNEY_CLAIM_SEND.indexOf(k)<0)errs.push('claim.body may not carry '+k);});
 if(errs.length)return {ok:false, errs:errs};
 var rec=Object.assign({v:c.schema},c.body);
 var v=validateProfile(rec);
 if(!v.ok)return {ok:false, errs:v.errs.map(function(e){return 'claim.body: '+e;})};
 var body={};
 Object.keys(c.body).forEach(function(k){body[k]=v.profile[k];});
 return {ok:true, body:body};}
/* THE STAMP A CLAIM LEAVES, written once by the host after the claim landed.
   Idempotent: a second call changes nothing and says so, so a retry after a
   failed save cannot move the date the account took over the record. An
   account is an event of its own, so via account logs account_created. */
function journeyClaimed(p,via,now){
 if(!p)return {ok:false, why:'no record'};
 if(JOURNEY_VIA.indexOf(via)<0)return {ok:false, why:'journey.claimed.via is not local, record, file or account'};
 var j=jyEnsure(p);
 if(j.claimed)return {ok:true, already:true, claimed:j.claimed};
 j.claimed={at:jyAt(now), via:via};
 if(via==='account')journeyLog(p,'account_created',null,null,now);
 return {ok:true, already:false, claimed:j.claimed};}
