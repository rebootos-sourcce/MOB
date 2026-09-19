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
var OB_LIMIT={question:600, bug:600, rating:300, feedback:600};
var OB_KINDS=['question','bug','rating','feedback'];

/* WHAT AN ENVELOPE MAY CARRY. This list is the spec, not a summary of one.
   Anything not on it is refused by name, including by whoever adds a helpful
   field six months from now, because the gate asserts the key set exactly. */
var OB_KEYS=['kind','at','body','answers','band','build','platform','viewport'];
/* WHAT IT REFUSES, BY NAME. Read this before adding anything. */
var OB_NEVER=['name','first','middle','last','email','address','key','rk','rid',
 'customer','subscription','stripe','token','code','cookie','story','stories',
 'journal','imprints','born','birth','date','dob','cq','dq','sq','seed','type',
 'axes','laws','answers63','gates','device','ua','ip','geo','timezone','locale',
 'practitioner','roster','avatar','purpose','history','meter'];

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
 var c=r.CQ;
 return c<50?'low':(c<70?'median':'high');}

/* THE BOUNDARY. validateProfile's posture, applied to what leaves rather than
   what arrives: refuse by name, never clamp, never strip in silence. */
function obValidate(e){
 var errs=[];
 if(!e||typeof e!=='object') return {ok:false,errs:['no envelope']};
 if(OB_KINDS.indexOf(e.kind)<0) errs.push('kind '+e.kind+' is not one of the four');
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
