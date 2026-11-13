/* ============================================================
   RELEASE HIT FEEDBACK. Which patterns a person said a release actually
   landed on, kept as an append only log of their own decisions.

   THE DEFECT THIS EXISTS FOR. The finished release card listed every
   saboteur, complex and hyper complex the run's addresses reached, built by
   relHits in ui/release.js, and the field each row carried was called hit.
   Nothing asked the person anything: a pattern was a "hit" because the run
   happened to pass through one of its addresses. The 31 October status
   review recorded it as criterion 7, not met: "relHits counts the addresses
   a run reached, which is not a hit the person confirmed." The owner's 21
   October clarification (docs/ATUNED_CQ_DQ_SQ_RELEASE_HIT_FEEDBACK_ADDENDUM
   _v1.md, section 4) rules the other way: "Executing a release does not
   prove that the candidate was a hit", and "Accumulate only explicit
   user-confirmed hits".

   SO EXECUTION AND JUDGMENT ARE TWO DIFFERENT THINGS ON THE LOG.
     execute   one per release session, written in the same save as the
               release itself, naming the patterns the card then presents.
               It is the session's fact, never a judgment of any pattern.
     decide    one per press, naming the session, the pattern, the command,
               the state before and the state after.
   An item's judgment is one of RELHIT_STATES and starts at shown, which is
   what a pattern presented by an executed session is until the person says
   something. hold, hit and reject move it to held, confirmed and rejected.
   Only confirmed is ever counted, and the count is read off the log every
   time and never stored, because a stored total and the log it totals are
   two answers to one question and they drift.

   A DUPLICATE IS A NO OP, NEVER A SECOND COUNT. Three separate guards, so a
   replay cannot get past by any one route:
     1. every event carries its own id, and an id already on the log is
        answered as a duplicate and writes nothing. A press delivered twice,
        or a retry after a save the caller could not confirm, is that case.
     2. a command that would leave the item where it already is writes
        nothing, so a second Hit press with a fresh id is not a second hit.
     3. the count is of items whose current state is confirmed, one per
        session and pattern, so even a log that held two hit events in a row
        for one item would read as one.
   A page refresh replays nothing at all: the log is read, never re-run.

   REMOVAL KEEPS THE EVIDENCE. Not a hit moves the item off the active list
   and is itself an event, so the presentation, any earlier hit and the
   rejection all stay on the log. A judgment may be changed afterwards and
   the change is another event; nothing is ever rewritten or deleted.

   A HIT MOVES NO NUMBER. Nothing here touches the charge, the laws, CQ, DQ,
   SQ, the meter or the work. The addendum rules that a hit feedback event
   must not "silently alter CQ/DQ/SQ/stored charge", and the gate holds it.

   VOICE IS NOT HERE YET, on purpose. The addendum's voice commands are the
   next item and depend on this one. The event already carries modality, raw
   command and confidence so that item adds a modality and its floor rather
   than a new shape; today the only modality is a visible control, whose raw
   command is its own key and whose confidence is null.

   HOST FREE. No document, no store, no clock it was not handed except as
   the default. Every writer takes the record and either changes it whole or
   refuses by name and changes nothing, the way journeyLog does.

   NO SCHEMA_V BUMP. Additive, like the journey: a record that never ran a
   release carries no relhit and gains none, and v1 and v2 records still
   load. It has its own version, RELHIT_V.
   ============================================================ */

const RELHIT_V=1;
/* the judgment an item can hold. shown is never written: it is what an item
   presented by an executed session reads as before any decision. */
const RELHIT_STATES=['shown','held','confirmed','rejected'];
/* the three commands the addendum names, HOLD, RELEASE/HIT and DELETE/NOT A
   HIT, under one word each, and where each one leaves the item. "release" is
   deliberately not a command word here: the addendum warns that "release
   this pattern" as a session action and "this was a hit" as feedback must
   not be confusable, and the session action is the run itself. */
const RELHIT_CMDS={hold:'held', hit:'confirmed', reject:'rejected'};
/* visible controls only, until the voice item lands */
const RELHIT_MODES=['control'];
const RELHIT_KINDS=['execute','decide'];
/* the families a pattern can come from, the three relHits presents */
const RELHIT_FAM=['sab','cx','hy'];
/* a busy person runs a release a day and judges a handful of patterns on
   each; this is years of that, and full is refused by name and never
   truncated, which is the journey log's rule */
const RELHIT_LOG_MAX=6000;
const RELHIT_PATS_MAX=128;

var RH_EV=/^[A-Za-z0-9_\-]{8,80}$/;
var RH_SID=/^[A-Za-z0-9_\-]{8,80}$/;
var RH_PAT=/^(sab|cx|hy):[a-z0-9_]{1,64}$/;
/* a pattern's name as the engine's own tables spell it: "Control Freak",
   "Micromanager + Hyper-Achiever". Closed to those characters so no free text
   can ride in under it. */
var RH_NM=/^[A-Za-z][A-Za-z0-9 ,'+\/\-]{0,79}$/;

function relHitBlank(){return {v:RELHIT_V, log:[]};}

/* ONE ID PER PATTERN, from its family and its name. The name alone is not
   unique across families in principle, and a display name with spaces is not
   a key, so the id is the family and the name folded to lower case words. */
function relHitPat(fam,nm){
 if(RELHIT_FAM.indexOf(fam)<0||typeof nm!=='string')return null;
 var s=nm.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,64);
 return s?fam+':'+s:null;}

/* ---------------- one log line, the boundary's own check ---------------- */
var RH_KEYS={execute:['seq','ev','kind','at','sid','pats'],
 decide:['seq','ev','kind','at','sid','pat','cmd','mode','raw','conf','from','to']};
function rhLine(errs,x,i,nowMs){
 var path='relhit.log['+i+']';
 if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(path+' is not an object'); return null;}
 if(RELHIT_KINDS.indexOf(x.kind)<0){errs.push(path+'.kind is not execute or decide'); return null;}
 var n=errs.length;
 vKeys(errs,path,x,RH_KEYS[x.kind]);
 /* worded apart from jyLog's line on purpose: tests/journey.js breaks that
    one by its exact text, and two copies made its mutant ambiguous */
 if(x.seq!==i+1)errs.push(path+'.seq is not the next number on the hit log');
 if(typeof x.ev!=='string'||!RH_EV.test(x.ev))errs.push(path+'.ev is not an event id');
 if(typeof x.sid!=='string'||!RH_SID.test(x.sid))errs.push(path+'.sid is not a release session id');
 jyDate(errs,path+'.at',x.at,nowMs);
 if(x.kind==='execute'){
  if(!Array.isArray(x.pats))errs.push(path+'.pats is not a list');
  else if(x.pats.length>RELHIT_PATS_MAX)errs.push(path+'.pats holds '+x.pats.length+', more than '+RELHIT_PATS_MAX);
  else x.pats.forEach(function(q,j){
   var pp=path+'.pats['+j+']';
   if(!q||typeof q!=='object'||Array.isArray(q)){errs.push(pp+' is not an object'); return;}
   vKeys(errs,pp,q,['id','nm']);
   if(typeof q.id!=='string'||!RH_PAT.test(q.id))errs.push(pp+'.id is not a pattern id');
   if(typeof q.nm!=='string'||!RH_NM.test(q.nm))errs.push(pp+'.nm is not a pattern name');});
  if(errs.length>n)return null;
  return {seq:x.seq, ev:x.ev, kind:'execute', at:x.at, sid:x.sid,
   pats:x.pats.map(function(q){return {id:q.id, nm:q.nm};})};}
 if(typeof x.pat!=='string'||!RH_PAT.test(x.pat))errs.push(path+'.pat is not a pattern id');
 if(!Object.prototype.hasOwnProperty.call(RELHIT_CMDS,x.cmd))errs.push(path+'.cmd is not hold, hit or reject');
 if(RELHIT_MODES.indexOf(x.mode)<0)errs.push(path+'.mode is not a modality this build records');
 /* a control's raw command is its own key, so a control line can never carry
    words; the voice item will widen this for its own modality only */
 if(x.mode==='control'&&x.raw!==x.cmd)errs.push(path+'.raw is not the control\'s own command');
 if(x.conf!==null&&!(NUM(x.conf)&&x.conf>=0&&x.conf<=1))errs.push(path+'.conf is not null or 0 to 1');
 if(RELHIT_STATES.indexOf(x.from)<0)errs.push(path+'.from is not a state');
 if(RELHIT_CMDS[x.cmd]!==x.to)errs.push(path+'.to is not where '+String(x.cmd).slice(0,20)+' leaves an item');
 if(errs.length>n)return null;
 return {seq:x.seq, ev:x.ev, kind:'decide', at:x.at, sid:x.sid, pat:x.pat, cmd:x.cmd,
  mode:x.mode, raw:x.raw, conf:x.conf, from:x.from, to:x.to};}

/* THE LOG REPLAYED, the one reader every other function goes through. It is
   also the consistency check: a decide line must name a session executed
   earlier on the log and a pattern that session presented, and its from must
   be the state the replay has the item in. A log that fails any of these was
   not written by this file, and the boundary refuses it by name rather than
   counting a hit nobody can account for. */
function rhReplay(log,errs){
 var ses={}, seen={}, order=[];
 (log||[]).forEach(function(e,i){
  if(!e)return;
  var path='relhit.log['+i+']';
  if(seen[e.ev]){if(errs)errs.push(path+'.ev repeats an event id already on the log'); return;}
  seen[e.ev]=1;
  if(e.kind==='execute'){
   if(ses[e.sid]){if(errs)errs.push(path+' executes release '+e.sid+' a second time'); return;}
   var it={}, ids=[];
   e.pats.forEach(function(q){if(!it[q.id]){it[q.id]={id:q.id, nm:q.nm, state:'shown', events:0}; ids.push(q.id);}});
   ses[e.sid]={sid:e.sid, at:e.at, items:it, ids:ids}; order.push(e.sid); return;}
  var s=ses[e.sid];
  if(!s){if(errs)errs.push(path+' decides on release '+e.sid+', which is not executed earlier on the log'); return;}
  var x=s.items[e.pat];
  if(!x){if(errs)errs.push(path+' decides on '+e.pat+', which release '+e.sid+' did not present'); return;}
  if(x.state!==e.from){if(errs)errs.push(path+'.from is '+e.from+' and the item was '+x.state); return;}
  x.state=e.to; x.events++;});
 return {ses:ses, order:order, seen:seen};}

/* THE BOUNDARY. Missing or null is an older record, or one that never ran a
   release since this landed, and reads as the blank. A nowMs of null is the
   boot read of this device's own store, where a date is checked but not the
   clock, for the reason journeyValidate gives. */
function relHitValidate(errs,o,path,ctx){
 var P=relHitBlank(), c=ctx||{}, base=path||'relhit', nowMs=(c.stored===true)?null:jyMs(c.now);
 if(o===undefined||o===null)return P;
 if(typeof o!=='object'||Array.isArray(o)){errs.push(base+' is not an object'); return P;}
 vKeys(errs,base,o,['v','log']);
 if(o.v!==undefined&&o.v!==RELHIT_V)
  errs.push(base+'.v is '+JSON.stringify(o.v)+', not a release hit version this build reads ('+RELHIT_V+')');
 if(o.log!==undefined&&o.log!==null){
  if(!Array.isArray(o.log))errs.push(base+'.log is not a list');
  else if(o.log.length>RELHIT_LOG_MAX)
   errs.push(base+'.log is full: '+o.log.length+' entries, and the cap is '+RELHIT_LOG_MAX);
  else{
   var n=errs.length;
   P.log=o.log.map(function(x,i){return rhLine(errs,x,i,nowMs);}).filter(Boolean);
   if(errs.length===n)rhReplay(P.log,errs);}}
 return P;}

function rhOf(p){
 return (p&&p.relhit&&typeof p.relhit==='object'&&Array.isArray(p.relhit.log))?p.relhit:null;}
function rhEnsure(p){
 if(!rhOf(p))p.relhit=relHitBlank();
 return p.relhit;}
/* WRITE ONE LINE WHOLE OR NOTHING. The line goes through the boundary's own
   check and the whole log through the replay with it, so a line this function
   writes is a line the next boot will load. */
function rhAppend(p,x,now){
 var R=rhEnsure(p);
 if(R.log.length>=RELHIT_LOG_MAX)
  return {ok:false, why:'relhit.log is full: '+R.log.length+' entries, and the cap is '+RELHIT_LOG_MAX};
 var errs=[], e=rhLine(errs,Object.assign({seq:R.log.length+1, at:jyAt(now)},x),R.log.length,Date.now());
 if(!errs.length)rhReplay(R.log.concat([e]),errs);
 if(errs.length)return {ok:false, why:errs[0]};
 R.log.push(e);
 return {ok:true, event:e};}

/* ---------------- the writers ---------------- */
/* THE RELEASE RAN, AND THESE ARE THE PATTERNS ITS CARD WILL PRESENT. Called
   by the host in the same save as the release, so a release the store refused
   leaves no execute line and nothing can be judged against it. Once per
   session: a second call for the same session is answered as a duplicate and
   writes nothing, so the run's own retry path cannot present twice.
   pats is [{fam, nm}], straight off relHits. */
function relHitExecute(p,sid,pats,now){
 if(!p)return {ok:false, why:'no record'};
 if(typeof sid!=='string'||!RH_SID.test(sid))return {ok:false, why:'a release session id is needed'};
 var R=rhOf(p);
 if(R&&R.log.some(function(e){return e.kind==='execute'&&e.sid===sid;}))return {ok:true, dup:true};
 var seen={}, out=[];
 (pats||[]).forEach(function(q){
  var id=q&&relHitPat(q.fam,q.nm);
  if(id&&!seen[id]){seen[id]=1; out.push({id:id, nm:q.nm});}});
 return rhAppend(p,{ev:'x_'+sid, kind:'execute', sid:sid, pats:out},now);}

/* ONE DECISION. a = {ev, sid, pat, cmd, mode, raw, conf}. Returns
     {ok:true, dup:true}               this event id is already on the log
     {ok:true, noop:true, state}       the item is already where cmd leaves it
     {ok:true, event, state}           written
     {ok:false, why}                   refused by name, nothing changed
   A refusal is never a silent no op: a session the record does not hold, a
   pattern the session did not present, or a command that is not one of the
   three is said, so a stale card cannot pretend a press landed. */
function relHitDecide(p,a,now){
 if(!p)return {ok:false, why:'no record'};
 a=a||{};
 if(!Object.prototype.hasOwnProperty.call(RELHIT_CMDS,a.cmd))
  return {ok:false, why:'a decision is hold, hit or reject, not '+JSON.stringify(a.cmd)};
 var R=rhOf(p), log=R?R.log:[];
 if(typeof a.ev==='string'&&log.some(function(e){return e.ev===a.ev;}))return {ok:true, dup:true};
 var rp=rhReplay(log,null), s=rp.ses[a.sid];
 if(!s)return {ok:false, why:'release '+String(a.sid).slice(0,80)+' is not on this record'};
 var x=s.items[a.pat];
 if(!x)return {ok:false, why:String(a.pat).slice(0,80)+' was not presented by this release'};
 var to=RELHIT_CMDS[a.cmd];
 if(x.state===to)return {ok:true, noop:true, state:to};
 var mode=a.mode||'control';
 var r=rhAppend(p,{ev:a.ev, kind:'decide', sid:a.sid, pat:a.pat, cmd:a.cmd, mode:mode,
  raw:a.raw===undefined?a.cmd:a.raw, conf:a.conf===undefined?null:a.conf, from:x.state, to:to},now);
 if(!r.ok)return r;
 return {ok:true, event:r.event, state:to};}

/* ---------------- the readers ---------------- */
/* ONE SESSION AS ITS CARD SHOWS IT, or null when the record never executed
   it. items are in the order the card presented them. */
function relHitSession(p,sid){
 var R=rhOf(p); if(!R)return null;
 var s=rhReplay(R.log,null).ses[sid]; if(!s)return null;
 return {sid:s.sid, at:s.at, executed:true,
  items:s.ids.map(function(id){var x=s.items[id]; return {id:id, nm:x.nm, state:x.state};})};}
function relHitState(p,sid,pat){
 var s=relHitSession(p,sid); if(!s)return null;
 for(var i=0;i<s.items.length;i++)if(s.items[i].id===pat)return s.items[i].state;
 return null;}
/* THE COUNT, the only one. hits is how many presented items, one per session
   and pattern, the person has marked a hit and not since changed; patterns is
   how many different patterns that covers; by is per pattern. A release that
   ran and was never judged adds a session and no hit. */
function relHitCount(p){
 var R=rhOf(p), out={hits:0, patterns:0, sessions:0, held:0, rejected:0, by:{}};
 if(!R)return out;
 var rp=rhReplay(R.log,null);
 rp.order.forEach(function(sid){
  var s=rp.ses[sid]; out.sessions++;
  s.ids.forEach(function(id){
   var st=s.items[id].state;
   if(st==='confirmed'){out.hits++; out.by[id]=(out.by[id]||0)+1;}
   else if(st==='held')out.held++;
   else if(st==='rejected')out.rejected++;});});
 out.patterns=Object.keys(out.by).length;
 return out;}
