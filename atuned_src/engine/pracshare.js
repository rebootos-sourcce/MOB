/* ============================================================
   WHAT A CLIENT'S DEVICE SHARES WITH A PRACTITIONER, AND WHAT IT TAKES BACK.
   Round PS, 26 November: "let's not show the stories. We want to show the
   summary", and "Turn sync back on" as a named exception for this snapshot
   alone (DECISIONS.md). The server is reboot-os atuned/server/src/prac.js.

   THREE LAYERS, BUILT HERE AND NOWHERE ELSE, so what can leave the device is
   one file to read. Summary is the floor of a live connection: the tier word,
   its one sentence, and the addresses at or above the display line, which is
   what the practitioner page's ring has always been drawn from (pracRead,
   ui/practitioner.js). Body is every carrying address, the places charge
   sits. Field is the loop read's counts and pattern names, the practice days
   and the rituals running. Each item is copied field by field into a new
   object, never passed through, because the one way a story could leave is
   on a key nobody looked at: a loop read carries source entries for its
   signal markers (engine/loop.js), and passing a pattern row whole would
   have sent them.

   No name, no story, no note, and no ritual's when or where, which are
   typed by the person and can say anything.

   AND THE OTHER DIRECTION. A practitioner's device reads a snapshot, and a
   client's device reads a proposed ritual, and both crossed a network.
   pracShareCheck and pracPropCheck are the boundary for each, in
   validateProfile's manner (engine/schema.js): a closed key set, a type and a
   range per field, a refusal that names the field, nothing clamped. The
   server holds the same shapes; this is the second check, at the edge where
   the data is drawn, because a screen should never draw what it did not
   check.

   Host free. hostfree.py holds this file to it.
   ============================================================ */
var PRACSHARE_V=1;
/* sq to two places: the server's shape takes a number, and the third place
   on is noise a reader never sees */
function pracShareSq(x){return Math.round((+x||0)*100)/100;}
function pracShareAddr(n){
 var o={k:String(n.k), b:String(n.b), sq:pracShareSq(n.sq)};
 if(n.n)o.n=String(n.n);
 return o;}
/* Summary, from a compute() of the person's own state and the W it wrote. */
function pracShareSum(r){
 var t=(r&&r.complete&&r.tier)?tierOf(r.CQ):null;
 var loaded=W.filter(function(n){return n.sq>=4;})
  .sort(function(a,b){return b.sq-a.sq||a.i-b.i;}).slice(0,112).map(pracShareAddr);
 var hv=(r&&r.heaviest)?{k:String(r.heaviest.k), b:String(r.heaviest.b), sq:pracShareSq(r.heaviest.sq)}:null;
 return {v:PRACSHARE_V, cq:(r&&typeof r.CQ==='number'&&isFinite(r.CQ))?Math.round(r.CQ*100)/100:null,
  tier:(r&&r.complete&&r.tier)?String(r.tier):null, tierDef:t?String(t.def||''):'',
  unread:!!(r&&r.unread), darkB:(r&&r.darkB)?String(r.darkB):null, loaded:loaded, heaviest:hv};}
/* Body: every address carrying anything, heaviest first */
function pracShareBody(){
 return {v:PRACSHARE_V, addrs:W.filter(function(n){return n.sq>0;})
  .sort(function(a,b){return b.sq-a.sq||a.i-b.i;}).slice(0,112).map(pracShareAddr)};}
/* Field: L is a loop read (loopRead), days the practice days (pracexDays),
   plans the person's rituals each with active set by the caller, which owns
   the calendar arithmetic (ui/ritual.js ritActive) */
function pracShareField(L,days,plans){
 L=L||{};
 var pats=(L.patterns||[]).slice(0,200).map(function(x){
  var o={key:String(x.key), name:String(x.name), state:String(x.state)};
  if(x.seat)o.seat=String(x.seat);
  return o;});
 var dec=(L.declined||[]).slice(0,100).map(function(d){
  return {id:String(d.id), patterns:(d.patterns||[]).slice(0,20).map(String)};});
 var miss=(L.misses||[]).slice(0,50).map(function(m){return {run:m.run|0, stage:String(m.stage)};});
 return {v:PRACSHARE_V,
  loop:{confirmed:L.confirmed|0, unanswered:L.unanswered|0,
   practised:(L.practice&&L.practice.events)|0, patterns:pats, declined:dec, misses:miss},
  days:(days||[]).slice(-62).map(function(d){return {day:String(d.day).slice(0,10), status:String(d.status)};}),
  rituals:(plans||[]).slice(0,60).map(function(p){
   return {steps:(p.steps||[]).slice(0,12).map(String), band:String(p.band||''),
    on:p.on?p.on.slice(0,7):null, tm:p.tm?p.tm|0:null, days:p.days|0, active:!!p.active};})};}
/* the snapshot a grant covers, and nothing it does not */
function pracShareBuild(r,sight,L,days,plans){
 var o={sum:pracShareSum(r)};
 if(sight&&sight.body)o.body=pracShareBody();
 if(sight&&sight.field)o.field=pracShareField(L,days,plans);
 return o;}

/* ---------- the boundary, both directions ---------- */
var PRS_STR=function(max){return {t:'str',max:max};};
var PRS_NUM=function(lo,hi){return {t:'num',lo:lo,hi:hi};};
var PRS_INT=function(lo,hi){return {t:'int',lo:lo,hi:hi};};
var PRS_BOOL={t:'bool'};
var PRS_NUL=function(s){var o={}; Object.keys(s).forEach(function(k){o[k]=s[k];}); o.nul=true; return o;};
var PRS_ARR=function(of,max){return {t:'arr',of:of,max:max};};
var PRS_OBJ=function(keys,req){return {t:'obj',keys:keys,req:req||Object.keys(keys)};};
var PRS_ADDR=PRS_OBJ({k:PRS_STR(80),b:PRS_STR(20),n:PRS_NUL(PRS_STR(80)),sq:PRS_NUM(0,1000)},['k','b','sq']);
var PRS_SHAPE={
 sum:PRS_OBJ({v:PRS_INT(1,1),cq:PRS_NUL(PRS_NUM(-1e6,1e6)),tier:PRS_NUL(PRS_STR(40)),tierDef:PRS_STR(400),
  unread:PRS_BOOL,darkB:PRS_NUL(PRS_STR(20)),loaded:PRS_ARR(PRS_ADDR,112),
  heaviest:PRS_NUL(PRS_OBJ({k:PRS_STR(80),b:PRS_STR(20),sq:PRS_NUM(0,1000)}))},['v','unread','loaded']),
 body:PRS_OBJ({v:PRS_INT(1,1),addrs:PRS_ARR(PRS_ADDR,112)}),
 field:PRS_OBJ({v:PRS_INT(1,1),
  loop:PRS_OBJ({confirmed:PRS_INT(0,1e4),unanswered:PRS_INT(0,1e4),practised:PRS_INT(0,1e5),
   patterns:PRS_ARR(PRS_OBJ({key:PRS_STR(80),name:PRS_STR(120),seat:PRS_NUL(PRS_STR(20)),state:PRS_STR(20)},['key','name','state']),200),
   declined:PRS_ARR(PRS_OBJ({id:PRS_STR(80),patterns:PRS_ARR(PRS_STR(120),20)}),100),
   misses:PRS_ARR(PRS_OBJ({run:PRS_INT(0,1e4),stage:PRS_STR(20)}),50)}),
  days:PRS_ARR(PRS_OBJ({day:PRS_STR(10),status:PRS_STR(20)}),62),
  rituals:PRS_ARR(PRS_OBJ({steps:PRS_ARR(PRS_STR(40),12),band:PRS_STR(20),on:PRS_NUL(PRS_ARR(PRS_INT(0,6),7)),
   tm:PRS_NUL(PRS_INT(1,600)),days:PRS_INT(0,3650),active:PRS_BOOL},['steps','active']),60)},['v','loop','days']),
 ritual:PRS_OBJ({steps:PRS_ARR(PRS_STR(40),12),on:PRS_NUL(PRS_ARR(PRS_INT(0,6),7)),tm:PRS_NUL(PRS_INT(1,600)),
  days:PRS_INT(0,365),band:PRS_STR(20),why:PRS_STR(600)},['steps'])};
function pracShapeCheck(spec,v,at,errs){
 if(v===null||v===undefined){if(!spec.nul)errs.push(at+' is required'); return;}
 if(spec.t==='str'){if(typeof v!=='string')errs.push(at+' must be text'); else if(v.length>spec.max)errs.push(at+' is longer than '+spec.max+' characters'); return;}
 if(spec.t==='bool'){if(typeof v!=='boolean')errs.push(at+' must be true or false'); return;}
 if(spec.t==='num'||spec.t==='int'){
  if(typeof v!=='number'||!isFinite(v)||(spec.t==='int'&&Math.floor(v)!==v))errs.push(at+' must be '+(spec.t==='int'?'a whole number':'a number'));
  else if(v<spec.lo||v>spec.hi)errs.push(at+' is outside '+spec.lo+' to '+spec.hi);
  return;}
 if(spec.t==='arr'){
  if(!Array.isArray(v)){errs.push(at+' must be a list'); return;}
  if(v.length>spec.max){errs.push(at+' has more than '+spec.max+' items'); return;}
  v.forEach(function(x,i){pracShapeCheck(spec.of,x,at+'['+i+']',errs);}); return;}
 if(typeof v!=='object'||Array.isArray(v)){errs.push(at+' must be an object'); return;}
 Object.keys(v).forEach(function(k){if(!spec.keys[k])errs.push(at+'.'+k+' is not a field this takes');});
 Object.keys(spec.keys).forEach(function(k){
  if(v[k]===undefined){if(spec.req.indexOf(k)>=0)errs.push(at+'.'+k+' is required');}
  else pracShapeCheck(spec.keys[k],v[k],at+'.'+k,errs);});}
/* a snapshot as the server answers it: sum always, body and field null when
   the grant does not cover them. The list of refusals, empty for a yes. */
function pracShareCheck(s){
 var e=[];
 if(!s||typeof s!=='object'||Array.isArray(s))return ['the snapshot is not an object'];
 pracShapeCheck(PRS_SHAPE.sum,s.sum,'sum',e);
 if(s.body!=null)pracShapeCheck(PRS_SHAPE.body,s.body,'body',e);
 if(s.field!=null)pracShapeCheck(PRS_SHAPE.field,s.field,'field',e);
 return e;}
/* a proposed ritual, checked again on the client's device before it is
   shown, and every step must be a practice this build's library carries:
   a key it does not know would be written onto the record as a step nothing
   can teach */
function pracPropCheck(p){
 var e=[]; pracShapeCheck(PRS_SHAPE.ritual,p,'ritual',e);
 if(!e.length){
  if(!p.steps.length)e.push('ritual.steps needs at least one practice');
  p.steps.forEach(function(k,i){
   if(!PRACTICE.some(function(x){return x.k===k;}))e.push('ritual.steps['+i+'] is no practice in this build: '+k);});
  if(p.band&&BANDS.indexOf(p.band)<0)e.push('ritual.band is no seat: '+p.band);}
 return e;}
