/* ============================================================
   THE OUTBOX. One seam, and an honest failure.

   CLAUDE.md is strict: source.html stays one file with no dependencies, and
   the app gains network at exactly one seam. A support question and a feedback
   submission both need network, and neither is that seam.

   The resolution is the pattern bindPlan and bindStore already use. This file
   never calls fetch and never knows what is on the other side. It builds an
   envelope, validates it at the boundary, queues it durably, and reports one
   of four states. A host binds a send function or it does not.

   NEVER SENT OFF A LOCAL ENQUEUE. A control that says "sent" when the thing is
   sitting in a queue on the person's own machine has lied about the only fact
   that mattered to them. Queued says queued.
   ============================================================ */
var OBKEY='source.outbox';
var OB_MAX=20, OB_BYTES=65536;
/* the free text ceilings, per kind. A ceiling is refused at the boundary and
   never silently truncated, because a silently cut sentence reads back to the
   person as something they never said. */
var OB_LIMIT={question:600, bug:600, rating:300, feedback:600, comment:600};
/* COMMENT IS ITS OWN KIND, 2 October. The owner named three: "comments,
   questions, bugs". A remark that is neither a question nor a fault had only
   feedback to go to, and feedback is the eleven question survey, so a comment
   filed there would read on the other side as a survey with every answer
   blank. The relay sorts on kind, so the kind has to be the true one. */
var OB_KINDS=['question','bug','rating','feedback','comment'];

/* WHAT AN ENVELOPE MAY CARRY. This list is the spec, not a summary of one.
   Anything not on it is refused by name, including by whoever adds a helpful
   field six months from now, because the gate asserts the key set exactly. */
var OB_KEYS=['kind','at','body','answers','band','build','platform','viewport'];
/* WHAT IT REFUSES, BY NAME. Read this before adding anything. */
var OB_NEVER=['name','first','middle','last','email','address','key','rk','rid',
 'customer','subscription','stripe','token','code','cookie','story','stories',
 'journal','imprints','born','birth','date','dob','cq','dq','sq','seed','type',
 'axes','laws','answers63','gates','device','ua','ip','geo','timezone','locale',
 'practitioner','roster','avatar','purpose','history','meter',
 /* the bank of frozen days is built from the story and carries the person's own
    aim, so it takes the story's class: on the device and never in an envelope.
    Named here because a name left off this list is a silent hole (audit probe
    X7). aim is the stored word for the daily intention, engine/daily.js. */
 'summaries','summary','mirror','aim','aims'];

function obStore(){ try{ return JSON.parse(STORE.get(OBKEY)||'[]'); }catch(e){ return []; } }
function obWrite(q){
 if(!STORE_BOUND) return false;
 try{ STORE.set(OBKEY,JSON.stringify(q)); return true; }catch(e){ return false; } }
function obCount(){ return obStore().length; }

/* THE BAND, BUCKETED. Two passes disagreed here and both were half right. A
   feedback row is worthless without knowing where on the curve it came from,
   because a three from a high reading and a three from a low one are opposite
   findings. But a fine grained band beside a platform and a theme is a cell of
   one in a panel of thirty. Three buckets keep the analysis and kill the cell.
   The raw reading never travels. */
function obBand(r){
 if(!r||r.unread) return 'unread';
 /* a CQ still filling is where somebody is in the intake, not on the curve,
    and bucketing it would file everybody mid intake as low */
 if(r.complete===false) return 'filling';
 var c=r.CQ;
 return c<50?'low':(c<70?'median':'high');}

/* THE BOUNDARY. validateProfile's posture, applied to what leaves rather than
   what arrives: refuse by name, never clamp, never strip in silence. */
function obValidate(e){
 var errs=[];
 if(!e||typeof e!=='object') return {ok:false,errs:['no envelope']};
 /* the kinds are named off the list and never counted in the sentence: this
    said "not one of the four" and was wrong the day comment made five */
 if(OB_KINDS.indexOf(e.kind)<0) errs.push('kind '+e.kind+' is not one of '+OB_KINDS.join(', '));
 Object.keys(e).forEach(function(k){
  if(OB_KEYS.indexOf(k)<0) errs.push('the envelope may not carry '+k);});
 var lim=OB_LIMIT[e.kind]||600;
 if(typeof e.body==='string'&&e.body.length>lim)
  errs.push('that is '+e.body.length+' characters and the limit is '+lim);
 /* WHAT THE PERSON TYPED IS CHECKED AND NEVER EDITED. A mail shaped string or
    a long run of digits is refused with the reason, so the person decides what
    to do about it. This will not catch a first name in a sentence and nothing
    anywhere may claim that it does. */
 var t=String(e.body||'');
 if(/[^\s@]+@[^\s@]+\.[^\s@]+/.test(t)) errs.push('that looks like an email address, '
  +'and nothing that identifies you can go in here');
 if(/\d[\d\s().-]{6,}\d/.test(t)) errs.push('that looks like a phone number or an '
  +'account number, and nothing that identifies you can go in here');
 return {ok:!errs.length, errs:errs};}

/* ONE QUEUE ENTRY. Over the cap is refused by name rather than evicting the
   oldest, because a queue that quietly discards a person's words has lost
   them, which is the failure this whole file exists to prevent. */
function obQueue(e){
 var v=obValidate(e);
 if(!v.ok) return {ok:false, why:v.errs[0], errs:v.errs};
 if(!STORE_BOUND) return {ok:false, why:'storage is blocked in this browser, so '
  +'there is nowhere to hold this. Copy it somewhere before you leave the page.'};
 var q=obStore();
 if(q.length>=OB_MAX) return {ok:false, why:'there are already '+OB_MAX
  +' waiting to send and nowhere to send them, so this one was not taken.'};
 var next=q.concat([e]);
 if(JSON.stringify(next).length>OB_BYTES) return {ok:false,
  why:'the outbox is full. Nothing was taken and nothing was thrown away.'};
 if(!obWrite(next)) return {ok:false, why:'could not write to storage. Nothing was taken.'};
 return {ok:true, queued:next.length};}

/* THE SEAM. Bound by the host exactly as storage and billing are. */
var SEND_HOST=null;
function bindSend(fn){ SEND_HOST=(typeof fn==='function')?fn:null; return !!SEND_HOST; }
/* THE FOUR STATES, and none of them is a guess. */
function obDrain(){
 var q=obStore();
 if(!q.length) return {state:'empty', n:0};
 if(typeof SEND_HOST!=='function') return {state:'nohost', n:q.length};
 /* THE BOUNDARY IS ON THE WAY OUT, NOT ONLY ON THE WAY IN.

    obValidate ran on queue and not on drain, so anything already sitting in
    the key went to the host unread: measured with a bound sender, name, email
    and story all crossed the wire, and every one of them is on OB_NEVER. The
    queue is on a disk a person, another build or another tab can write, so
    what comes off it is exactly as untrusted as what goes on.

    A refused entry is dropped rather than retried forever, and it is reported,
    because an envelope that can never be sent is not a queue item, it is a
    thing to tell somebody about. */
 var left=[], sent=0, err=null, bad=[];
 for(var i=0;i<q.length;i++){
  var v=obValidate(q[i]);
  if(!v.ok){ bad.push({i:i,errs:v.errs.slice(0,2)}); continue; }
  var r;
  try{ r=SEND_HOST(q[i]); }catch(ex){ r=false; err=String(ex&&ex.message||ex); }
  if(r===true) sent++; else { left.push(q[i]); if(!err)err='the send was refused'; }}
 obWrite(left);
 if(bad.length&&!left.length&&!sent)
  return {state:'refused', n:bad.length, bad:bad};
 if(!left.length) return {state:'sent', n:sent, refused:bad.length||undefined};
 return {state:'retry', n:left.length, sent:sent, why:err, refused:bad.length||undefined};}

/* THE SAME DRAIN FOR A HOST THAT ANSWERS LATER. 2 October, the owner: "the
   data gets dumped to Discord". A send over the network is a promise, and
   obDrain reads SEND_HOST's return as true or not, so a promise handed to it
   reads as a refusal every time and nothing would ever leave. This is obDrain
   with the wait in it, and the boundary on the way out is the same call.

   TWO THINGS A WAIT BREAKS THAT A LOOP DOES NOT, and each was a way to lose
   what somebody wrote.

   AN ENTRY QUEUED DURING THE WAIT. obDrain writes back the list it read, which
   is safe when nothing can run between the read and the write. Here a person
   can press Send again while the first request is out, and writing back the
   list read before the wait would erase the second entry. The queue only ever
   grows at its end (obQueue concats) and only a drain shortens it, so what
   arrived during the wait is everything past the length that was read, and it
   is kept after whatever was not sent.

   TWO DRAINS AT ONCE. Both would send the same entries and both would write.
   The second one is told it is busy and touches nothing.

   AND IT STOPS AT THE FIRST NO. A server that is down answers every entry the
   same way, and twenty requests each waiting out a timeout is minutes of a
   person watching nothing, and twenty knocks on a route that limits per
   address. What was not tried stays in the queue untouched, in order. */
var OB_DRAINING=false;
function obDrainAsync(){
 if(OB_DRAINING) return Promise.resolve({state:'busy', n:obCount()});
 var q=obStore();
 if(!q.length) return Promise.resolve({state:'empty', n:0});
 if(typeof SEND_HOST!=='function') return Promise.resolve({state:'nohost', n:q.length});
 OB_DRAINING=true;
 var left=[], sent=0, err=null, bad=[], stopped=false;
 function step(i){
  if(i>=q.length) return Promise.resolve();
  if(stopped){ left.push(q[i]); return step(i+1); }
  var v=obValidate(q[i]);
  if(!v.ok){ bad.push({i:i,errs:v.errs.slice(0,2)}); return step(i+1); }
  var p;
  try{ p=Promise.resolve(SEND_HOST(q[i])); }catch(ex){ p=Promise.reject(ex); }
  return p.then(function(r){
    if(r===true){ sent++; return; }
    left.push(q[i]); stopped=true; if(!err)err='the send was refused'; },
   function(ex){ left.push(q[i]); stopped=true; err=String(ex&&ex.message||ex); })
   .then(function(){ return step(i+1); });}
 return step(0).then(function(){
  var tail=obStore().slice(q.length);
  OB_DRAINING=false;
  left=left.concat(tail);
  /* A WRITE THAT DID NOT LAND IS SAID. The entries that went are still on the
     disk and will go again, which is a duplicate on the other side and never
     a loss on this one, and the person is told rather than shown "sent". */
  if(!obWrite(left)) return {state:'retry', n:q.length+tail.length, sent:sent,
   why:'sent, but could not clear them from storage, so they may send again'};
  if(bad.length&&!left.length&&!sent) return {state:'refused', n:bad.length, bad:bad};
  if(!left.length) return {state:'sent', n:sent, refused:bad.length||undefined};
  return {state:'retry', n:left.length, sent:sent, why:err, refused:bad.length||undefined};},
 function(ex){ OB_DRAINING=false; return {state:'retry', n:obCount(), sent:0,
  why:String(ex&&ex.message||ex)}; });}
