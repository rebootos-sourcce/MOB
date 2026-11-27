/* ============================================================
   A WORKED EXAMPLE'S HISTORY, for the practitioner page. Round QB, the
   owner's words: "The practitioner page, when I select somebody within my
   cohort, it gives me their analytics."

   WHY THIS EXISTS. A worked example (engine/data/people.js) is a measurement
   table: nine charges, a law table, a soul and one line the example says. It
   has no days. So the trace graph read (engine/loop.js) of a worked example
   is empty, and a practitioner opening one sees no confirmed pattern, no
   practice and nothing over time, which is no analytics at all. This file
   gives each of the ten examples the practitioner page lists a short history
   of practice, written in PRACEX_HIST below, and builds it into a record
   THROUGH THE REAL ENGINE: every protocol, ritual and practice event goes in
   by practiceDo, so the boundary refuses a history the product could not
   produce for a real person, and every figure the page shows is loopRead's
   answer and not a figure typed here.

   WHAT IS AUTHORED AND WHAT IS READ. Authored, per example: how many of the
   system's proposed practices the example said yes to, left unanswered and
   turned down, and one character per day for the last PRACEX_DAYS days.
   Read: which addresses the practices aim at, which are the example's own
   heaviest held addresses, handed in by the caller off compute(); the one
   story line, which is the example's own `says`; and everything loopRead
   derives from the result. The history is an example's and is labelled so
   on the page. It is never a client's and never a measurement.

   NEVER STORED. The record is built in memory per call, never validated into
   PROFILES, never saved and never handed to pPersist. The page that asks for
   it caches it per day and lets it go with the page.

   HOST FREE. No document, no store, no clock: the moment is passed in.
   ============================================================ */
var PRACEX_DAYS=21;

/* ONE CHARACTER A DAY, OLDEST FIRST, the last one yesterday.
     .  nothing was scheduled
     c  completed       p  partial      s  skipped, a choice
     m  missed. Only three or more days back: the engine refuses a miss
        while the day can still be marked (event_move), and its day is the
        local date, so a day of slack keeps every time zone inside the rule.
     -  scheduled and not marked yet, which yesterday can still be
   The strip runs on the first accepted practice's ritual. A second accepted
   practice is chosen and not scheduled, which is a real state and the page
   says so. accept, leave and reject count the system's proposals, heaviest
   address first. The shapes span what a practitioner meets, and each is
   read off the example's own table, not assigned at random: Derek and
   Abraham do it every day, Diane works hard and then stops, Ana stops and
   starts, James and Gordon say yes to nothing. */
var PRACEX_HIST={
 Sofia:  {accept:1, leave:1, reject:0, strip:'......cpcpccpcpccpcpc'},
 Diane:  {accept:2, leave:0, reject:1, strip:'.....cccccccccccmmm--'},
 Marcus: {accept:1, leave:0, reject:1, strip:'..............ccpcccc'},
 Angela: {accept:2, leave:1, reject:0, strip:'..cmcscmccmscmcmcsmcc'},
 Derek:  {accept:1, leave:0, reject:0, strip:'ccccccccccccccccccccc'},
 James:  {accept:0, leave:0, reject:2, strip:'.....................'},
 Ana:    {accept:1, leave:2, reject:0, strip:'....ccmmmcpcpmmcpcccp'},
 Wren:   {accept:1, leave:0, reject:0, strip:'ccscccscccscccscccscc'},
 Gordon: {accept:0, leave:2, reject:1, strip:'.....................'},
 Abraham:{accept:2, leave:0, reject:0, strip:'cccccccpccccccpcccccc'}};

/* nine in the morning, UTC, back days before the moment's own UTC date */
function pracexDay(now,back){
 var d=new Date(now), base=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate());
 return new Date(base-back*DAY_MS+9*3600000).toISOString();}
function pracexLater(iso,h){return new Date(Date.parse(iso)+h*3600000).toISOString();}

/* the example's history, through practiceDo, or a thrown error naming the
   step the engine refused. A history the boundary refuses is a defect in the
   table above, and it is loud: tests/practitioner-ex.js runs every row. */
function pracexPractice(nm,addrs,now){
 var h=PRACEX_HIST[nm]; if(!h)return null;
 var P=practiceBlank(), N=PRACEX_DAYS, strip=h.strip;
 var go=function(act,a,t){
  var r=practiceDo(P,act,a,t);
  if(!r.ok)throw new Error('pracex '+nm+' '+act+': '+r.errs.join('; '));
  P=r.P; return r.id;};
 var first=strip.search(/[^.]/), firstBack=first<0?N-2:N-first;
 var proposedAt=pracexDay(now,firstBack+1), acceptAt=pracexDay(now,firstBack);
 var want=h.accept+h.leave+h.reject, ids=[];
 (addrs||[]).slice(0,want).forEach(function(a,j){
  var id='ex_pr'+(j+1);
  go('protocol_add',{id:id, class:'release', target_patterns:['addr:'+a],
   steps:[{type:'release', instruction:'Run a release at '+BY[a].k+'.'},
    {type:'observation', instruction:'Notice which place in the body answers.'}],
   generated_by:{system:'example', model_version:null, timestamp:proposedAt}},proposedAt);
  ids.push(id);});
 ids.forEach(function(id,j){
  if(j<h.accept)go('protocol_accept',{id:id},acceptAt);
  else if(j>=h.accept+h.leave)go('protocol_reject',{id:id},acceptAt);});
 if(!h.accept||first<0)return P;
 go('ritual_create',{id:'ex_rt1', protocol_id:'ex_pr1', title:'Release at '+BY[addrs[0]].k,
  cadence:{type:'daily'}, start_at:acceptAt},acceptAt);
 for(var i=0;i<N;i++){
  var c=strip.charAt(i); if(c==='.')continue;
  var at=pracexDay(now,N-i), ev='ex_ev'+(i+1);
  go('event_schedule',{id:ev, ritual_id:'ex_rt1', scheduled_at:at},at);
  if(c==='c'||c==='p'){
   go('event_move',{id:ev,to:'available'},at);
   go('event_move',{id:ev,to:'started'},pracexLater(at,1));
   go('event_move',c==='c'?{id:ev,to:'completed',duration_seconds:720}
    :{id:ev,to:'partial',duration_seconds:300,steps_completed:1},pracexLater(at,1.2));}
  else if(c==='s')go('event_move',{id:ev,to:'skipped'},pracexLater(at,2));
  else if(c==='m')go('event_move',{id:ev,to:'missed'},now);}
 return P;}

/* THE RECORD. A blank, the example's soul so the story reads under its own
   seats, the example's own line as its one story entry, and the history. */
function pracexRecord(p,addrs,now){
 if(!p||!PRACEX_HIST[p.nm])return null;
 var r=blankProfile(p.nm);
 r.id='ex_'+p.nm; r.created=pracexDay(now,PRACEX_DAYS+2);
 r.soul={doms:(p.doms||[p.dom]).slice(), arcs:(p.arcs||[p.a1,p.a2]).slice(), roots:(p.roots||[]).slice()};
 r.story.entries=p.says?[{t:pracexDay(now,PRACEX_DAYS+1), text:p.says, lex:LEX_VERSION}]:[];
 r.practice=pracexPractice(p.nm,addrs,now);
 return r;}

/* THE DAYS, oldest first, one per day of the window, each with what was
   scheduled and what became of it. A day nothing was scheduled on reads
   none. This is the telemetry strip, and it is read off the practice events
   and not off the table above, so it is the same answer for a real record. */
function pracexDays(rec,now){
 var P=rec&&rec.practice, evs=(P&&Array.isArray(P.practice_events))?P.practice_events:[];
 var byDay={};
 evs.forEach(function(x){byDay[String(x.scheduled_at).slice(0,10)]=x;});
 var out=[];
 for(var back=PRACEX_DAYS;back>=1;back--){
  var iso=pracexDay(now,back), k=iso.slice(0,10), x=byDay[k]||null;
  out.push({day:k, status:x?x.status:'none', ritual:x?x.ritual_id:null, protocol:x?x.protocol_id:null,
   seconds:x&&x.execution?x.execution.duration_seconds:null});}
 return out;}

/* THE ONE READ the page asks: the record, the loop read and the days. */
function pracexRead(p,addrs,now){
 var rec=pracexRecord(p,addrs,now); if(!rec)return null;
 return {rec:rec, loop:loopRead(rec), days:pracexDays(rec,now)};}
