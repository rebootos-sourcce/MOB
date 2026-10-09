/* ============================================================
   THE JOURNEY. What a new person has done on the way in, where they
   are on it, what their first release is, and what is handed over
   when the record goes to an account.

   PORTED FROM 3869d96 (worktree-agent-ad7f4b5294abbc82c). F5 brought
   the read half across (onbMiniPlan, journeyRead). This is F13, the
   record itself, rebuilt over today's schema rather than merged: the
   log, the gift's counter, the claim packet and its boundary, and one
   part that file did not have, the walk, which is where a person is in
   the first run so a reload puts them back there. Three parts of that
   file did not come across and the reason for each is said where it
   would have been: the per run list (journeyRun needed three hook lines
   in ui/release.js, which is the first release package's file), the
   ten integrity answers (they need their own screens and an open ruling),
   and the claim stamp (it is written when a claim lands at an account,
   and nothing in this build sends one).

   HOST FREE. No document, no store, no network. Every writer here takes
   the record and either changes it completely or refuses by name and
   changes nothing, the way meterRun and practiceDo do, so a caller never
   has to put anything back. The host binds storage and saves.

   WHAT IS STORED AND WHAT IS DERIVED, said once. Stored: the walk, the
   log, and the gift's counter. Derived and never stored: the stage, where
   a reload resumes, whether the first release has landed, what it made,
   and the whole of the mini release's plan.

   THE ONE STORED DERIVED VALUE IS THE GIFT'S USED AND REMAINING, because
   the owner ruled the gift a counter (round OX, ruling 3). They are what
   the counter said when the record was last saved: saveProfile calls
   journeyGiftSync on every save, so the counter moves in the same write as
   the meter that moved it. The allowance never reads them: planAllowance
   counts meter.unique and GIFT_N, and journeyGiftRead reports the counter
   it derives from the same two, with `drift` naming a stored counter that
   disagrees. So the record carries the counter the owner asked for and
   still cannot grant itself a pattern by being edited.

   NO SCHEMA_V BUMP. The journey is additive: a record without one has
   walked nothing, and v1 and v2 records still load. It has its own
   version, JOURNEY_V, like practice and trace. It is not in the blank
   profile: a record carries a journey from the first write onto it, so
   every record that never meets the first run is byte for byte what it
   was. releaseVerify below stores its answer as practice evidence, which
   the boundary already guards.
   ============================================================ */

/* the three shapes a free key may take, so no free text can ride in under a
   known name: an id, a reference into the record (an entry's date, a starting
   point's key), and a value in a log line's detail. */
var JY_KEY=/^[a-z][a-z0-9_]{0,31}$/;
var JY_REF=/^[A-Za-z0-9_:.\-]{1,64}$/;
var JY_VAL=/^[a-z0-9_]{1,32}$/;
var JY_DAY=86400000;

function journeyBlank(){
 return {v:JOURNEY_V, walk:null, gift:null, log:[]};}

/* A MOMENT AS THE CALLER GIVES IT, an ISO string or a number of milliseconds or
   nothing. The engine reads no clock it was not handed except as the default
   for a caller that gave none, so every test can pin one. */
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
   no more than that: a stamp a week ahead was written by something else. */
function jyDate(errs,path,t,nowMs){
 if(vDate(errs,path,t)===null)return null;
 if(new Date(t).getTime()>nowMs+JY_DAY){errs.push(path+' is ahead of the clock'); return null;}
 return t;}

/* ---------------- one log line ---------------- */
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
var JY_GIFT_KEYS=['at','src','granted','used','remaining'];
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
 if(at===null||gr===null||us===null||rm===null)return null;
 return {at:at, src:g.src, granted:gr, used:us, remaining:rm};}

/* ---------------- the walk: where the first run stands ---------------- */
/* WHAT A RELOAD NEEDS TO PUT A PERSON BACK WHERE THEY WERE, and nothing else.
   The station; the three taps, as positions in the onboarding sheet's own
   lists, under the same rule vEntryOb holds them to on a committed entry; the
   mirror's answers by node id; the words typed but not yet committed, which
   are cleared the moment they are committed or the person leaves; the entry
   the mirror committed, by its date; and, from the hand off on, what the
   meter held at that moment, which is how the record knows the first release
   has landed without a hook in the release card.

   THE DRAFT IS THE ONE FREE TEXT HERE, AND IT IS THE PERSON'S OWN, held only
   until Commit. It is kept so a reload does not throw away a story that was
   half written (TDD section 47: "No user input should be silently
   discarded"). It sits on the person's own record, where the entry it becomes
   will sit, so deleting the record deletes it too, which a side key would not.
   No ceiling is invented for it, for the reason vEntry gives for the text. */
var JY_WALK_KEYS=['step','door','pick','feel','place','ans','text','fixes','t','base','at'];
function jyWalk(errs,w,nowMs){
 var path='journey.walk';
 if(w===null||w===undefined)return null;
 if(typeof w!=='object'||Array.isArray(w)){errs.push(path+' is not an object'); return null;}
 var bad=errs.length;
 vKeys(errs,path,w,JY_WALK_KEYS);
 if(JOURNEY_WALK.indexOf(w.step)<0)errs.push(path+'.step is not a station of the first run: '+String(w.step).slice(0,40));
 var door=(w.door===undefined||w.door===null)?'onboarding':w.door;
 if(JOURNEY_DOORS.indexOf(door)<0)errs.push(path+'.door is not onboarding or tutorial');
 var q={step:w.step, door:door, pick:null, feel:null, place:null, ans:{}, text:null, fixes:[], t:null, base:null, at:null};
 [['pick',OB_STARTS,false],['feel',OB_FEELS,true],['place',OB_PLACES,true]].forEach(function(f){
  var v=w[f[0]];
  if(v===undefined||v===null)return;
  if(typeof v!=='number'||v!==Math.floor(v)||(v<0&&!(f[2]&&v===-1))||v>=f[1].length){
   errs.push(path+'.'+f[0]+' is not a position in its list of '+f[1].length
    +(f[2]?' or -1 for Not sure':'')+': '+v);
   return;}
  q[f[0]]=v;});
 if(w.ans!==undefined&&w.ans!==null){
  if(typeof w.ans!=='object'||Array.isArray(w.ans))errs.push(path+'.ans is not an object');
  else Object.keys(w.ans).forEach(function(k){
   var n=+k, v=w.ans[k];
   if(String(n)!==k||!BY[n]){errs.push(path+'.ans names no node: '+k.slice(0,40)); return;}
   if(v!=='yes'&&v!=='no'){errs.push(path+'.ans.'+k+' is not yes or no'); return;}
   q.ans[k]=v;});}
 if(w.text!==undefined&&w.text!==null)q.text=vStr(errs,path+'.text',w.text);
 if(w.fixes!==undefined&&w.fixes!==null){
  if(!Array.isArray(w.fixes))errs.push(path+'.fixes is not a list');
  else w.fixes.forEach(function(s,j){
   var v=vStr(errs,path+'.fixes['+j+']',s);
   if(v!==null)q.fixes.push(v);});}
 if(w.t!==undefined&&w.t!==null)q.t=jyDate(errs,path+'.t',w.t,nowMs);
 if(w.base!==undefined&&w.base!==null){
  var b=w.base, bp=path+'.base';
  if(typeof b!=='object'||Array.isArray(b))errs.push(bp+' is not an object');
  else{
   vKeys(errs,bp,b,['lines','unique']);
   var bl=jyInt(errs,bp+'.lines',b.lines,0,1e9), bu=jyInt(errs,bp+'.unique',b.unique,0,1e9);
   if(bl!==null&&bu!==null)q.base={lines:bl, unique:bu};}}
 /* a hand off with nothing to measure the release against is not a hand off */
 if((w.step==='release'||w.step==='end')&&!q.base&&errs.length===bad)
  errs.push(path+'.base is missing at '+w.step+', so the release cannot be read against it');
 q.at=jyDate(errs,path+'.at',w.at,nowMs);
 return errs.length>bad?null:q;}

/* ---------------- the boundary ---------------- */
/* THE JOURNEY'S OWN BOUNDARY, into the same errs as every other part, so one bad
   field refuses the whole record and pImport stays atomic. ctx may carry the
   clock a gate wants the dates read against. */
function journeyValidate(errs,o,path,ctx){
 var P=journeyBlank(), c=ctx||{}, nowMs=jyMs(c.now), base=path||'journey';
 if(o===undefined||o===null)return P;
 if(typeof o!=='object'||Array.isArray(o)){errs.push(base+' is not an object'); return P;}
 vKeys(errs,base,o,['v','walk','gift','log']);
 if(o.v!==undefined&&o.v!==JOURNEY_V)
  errs.push(base+'.v is '+JSON.stringify(o.v)+', not a journey version this build reads ('+JOURNEY_V+')');
 P.walk=jyWalk(errs,o.walk,nowMs);
 P.gift=jyGift(errs,o.gift,nowMs);
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
/* whether a kind of line is already on the log, for a writer that logs once */
function journeyLogged(p,type){
 var lg=(p&&p.journey&&Array.isArray(p.journey.log))?p.journey.log:[];
 return lg.some(function(e){return e&&e.type===type;});}

/* ---------------- the walk ---------------- */
/* WRITE WHERE THE FIRST RUN STANDS, whole, through the boundary's own check, or
   refuse by name and change nothing. w is the rest of the walk; a field it does
   not name is empty, so a caller always says the whole of what it knows. */
function journeyWalk(p,step,w,now){
 if(!p)return {ok:false, why:'no record'};
 var errs=[], x=Object.assign({},w||{},{step:step, at:jyAt(now)});
 var q=jyWalk(errs,x,Date.now());
 if(errs.length)return {ok:false, why:errs[0]};
 jyEnsure(p).walk=q;
 return {ok:true, walk:q};}

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
  drift:!!g&&(g.used!==used||g.remaining!==GIFT_N-used)};}
/* WRITE THE COUNTER'S USED AND REMAINING from the meter. The one place the
   stored half is written, so it is the one place that can be wrong, and
   saveProfile calls it on every save, so it lands in the same write as the
   meter it reads. A gift never issued is not issued here. */
function journeyGiftSync(p){
 if(!p||!p.journey||!p.journey.gift)return null;
 var r=journeyGiftRead(p), g=p.journey.gift;
 g.granted=r.granted; g.used=r.used; g.remaining=r.remaining;
 return g;}
/* ISSUE THE GIFT, ONCE. A record has one gift, so a second call changes nothing
   and says so. src is where it was issued: the funnel, or the app. */
function journeyGiftIssue(p,src,now){
 if(!p)return {ok:false, why:'no record'};
 if(JOURNEY_SRC.indexOf(src)<0)return {ok:false, why:'journey.gift.src is not funnel or app'};
 var j=jyEnsure(p);
 if(j.gift)return {ok:true, issued:false, gift:j.gift};
 var r=journeyGiftRead(p);
 j.gift={at:jyAt(now), src:src, granted:r.granted, used:r.used, remaining:r.remaining};
 var lg=journeyLog(p,'starter_gift_issued',null,{granted:r.granted},now);
 return {ok:true, issued:true, gift:j.gift, logged:lg.ok};}
/* THE COUNTER SPACE, ruled "we can use that counter space for other things",
   is not built: no other thing has been named to count, and a writer nothing
   calls is a control with no button. 3869d96 carried one (journeyGiftExtra). */

/* ---------------- the read ---------------- */
/* WHERE THE PERSON IS, derived off the record and never stored.

   A record that has used the product, a first line spoken, a finished intake
   or a ritual on the log, reads `continuing`, and onboarding does not treat it
   as a first run. A record with a story and none of those reads `storied`, and
   a record with nothing reads `new`. Both of the last two are a first run.

   `released` is the fourth stage, back with the walk (F13). It is a record
   whose first run handed off to a release and whose meter has moved since the
   hand off: the release landed. It is read off the walk's base and the meter,
   so nothing in the release card has to report it. A record that was in use
   before the walk existed has no base and still reads `continuing`.

   WHERE A RELOAD RESUMES, `at`, is the walk's station, with the one station
   that depends on what happened after it read through: a hand off whose
   release landed resumes at the end card, and one whose release never ran
   resumes at the card that offers it again. No walk is no resume.

   The count of releases is still unknown for a record with lines spoken, and
   `runs.known` says so rather than reporting a nought nobody counted: the per
   run list needs the release card to report each run, and that card is
   another package's (3869d96 carried it as journeyRun and three hook lines). */
function journeyRead(p){
 var m=(p&&p.meter)||{}, entries=(p&&p.story&&Array.isArray(p.story.entries))?p.story.entries:[];
 var j=(p&&p.journey&&typeof p.journey==='object')?p.journey:null, w=(j&&j.walk)||null;
 var landed=!!(w&&w.base&&(+m.lines||0)>w.base.lines);
 var prior=!!(m.first||(p&&p.intake&&p.intake.completedAt)
  ||(p&&Array.isArray(p.rituals)&&p.rituals.length));
 var stage=landed?'released':(prior?'continuing':(entries.length?'storied':'new'));
 var at=w?w.step:null;
 if(at==='release'||at==='end')at=landed?'end':'next';
 var log=(j&&Array.isArray(j.log))?j.log:[];
 return {stage:stage, first:stage==='new'||stage==='storied',
  runs:{n:0, known:(+m.lines||0)===0},
  at:at, door:w?w.door:null, landed:landed, gift:journeyGiftRead(p),
  events:log.length, logFull:log.length>=JOURNEY_LOG_MAX};}

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

   WHAT THE READING FOUND, BESIDE WHAT WAS TAKEN. Added in the port, for the
   card (F5): `found` is how many distinct addresses the reading carried,
   `foundInferred` how many of those the words did not name, and `rest` how
   many were found and not taken, so a first release of three out of eight says
   five more were read rather than hiding them. Counts only. They are derived
   from the signal on every call and nothing stores them.

   Returns { ok, addrs, keys, lines, inferred, cap, found, foundInferred, rest }
   or { ok:false, why } with why one of: 'no record', 'unread', 'no new ground',
   'allowance', and the found counts beside it whenever there is a signal. */
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
 var found=cand.length, foundInf=cand.filter(function(c){return c.inferred;}).length;
 if(sg.unread===true||!cand.length)return {ok:false, why:'unread', found:found, foundInferred:foundInf};
 cand.sort(function(a,b){return a.tier-b.tier||a.at-b.at;});
 var cap=meterBudget(p,now).cap;
 var whole=Math.min(ONB_MINI_ADDRS,Math.floor(cap/RUN_MIN));
 if(whole<1)return {ok:false, why:'allowance', cap:cap, found:found, foundInferred:foundInf};
 var open=cand.filter(function(c){return meterPlan(p,[c.id],ONB_CHANS,RUN_MIN).length===RUN_MIN;});
 if(!open.length)return {ok:false, why:'no new ground', found:found, foundInferred:foundInf};
 var take=open.slice(0,whole), ids=take.map(function(c){return c.id;});
 var keys=meterPlan(p,ids,ONB_CHANS,ids.length*RUN_MIN);
 return {ok:true, addrs:ids, keys:keys, lines:keys.length,
  inferred:take.filter(function(c){return c.inferred;}).length, cap:cap,
  found:found, foundInferred:foundInf, rest:found-ids.length};}

/* ---------------- what the first release made ---------------- */
/* THE FIRST RUN'S RESULT, READ OFF THE RECORD AND NEVER STORED. Everything the
   end card says is here, so a reload on that card says exactly what it said
   before the reload, and the gate can hold it without a browser.

   The release is read against the walk's base, the meter as it stood at the
   hand off: lines is how far meter.lines moved since, fresh how much new
   ground was opened, and addrs the places that ground is at, read off the keys
   meterRun appended after the base, in the order they were opened, with per
   the new lines at each (so a release ended early is counted as it ran). So the
   card names the places the release actually opened, which is the plan unless
   the person ran something else first, and then it is that. entry is the
   story the mirror committed, with what the reading found and how many places
   the person said yes and no to. said is the answer to What changed, read off
   the practice evidence the release card wrote for that entry, or null when
   nothing was answered (a skip records nothing, see RV_METRIC). gift is the
   counter.

   p may be a profile or a claim's body: both carry the same parts. */
function journeyMade(p){
 var w=(p&&p.journey&&p.journey.walk)||null;
 if(!w||!w.base)return {ok:false, why:'no hand off'};
 var m=(p&&p.meter)||{}, uq=Array.isArray(m.unique)?m.unique:[];
 var lines=(+m.lines||0)-w.base.lines;
 if(!(lines>0))return {ok:false, why:'not landed'};
 var fresh=Math.max(0,uq.length-w.base.unique), addrs=[], per={};
 uq.slice(w.base.unique).forEach(function(k){
  var i=+String(k).split(':')[0];
  if(!NUM(i)||!BY[i])return;
  if(addrs.indexOf(i)<0)addrs.push(i);
  per[i]=(per[i]||0)+1;});
 var ents=(p.story&&Array.isArray(p.story.entries))?p.story.entries:[], e=null;
 ents.forEach(function(x){if(x&&w.t&&x.t===w.t)e=x;});
 var ob=(e&&e.ob)||null;
 var entry=e?{t:e.t, text:String(e.text||''), read:+e.imprints||0,
  yes:(ob&&Array.isArray(ob.yes))?ob.yes.length:0, no:(ob&&Array.isArray(ob.no))?ob.no.length:0}:null;
 var said=null;
 addrs.forEach(function(a){
  if(said)return;
  var got=releaseVerifyAt(p.practice||null,a).filter(function(x){return !w.t||x.story_t===w.t;});
  if(got.length)said=got[got.length-1].value;});
 return {ok:true, entry:entry, lines:lines, fresh:fresh, addrs:addrs, per:per, said:said, gift:journeyGiftRead(p)};}

/* ---------------- the claim ---------------- */
/* WHAT IS PASSED OVER AT SIGN UP. Ruled, round OX, ruling 1: the account is
   created after the first release, and all the data from the person's input is
   passed over. This is the packet, built as a pure function. It sends nothing:
   the network call is the sign in seam's, ui/auth.js, and this build's sign up
   does not call it yet. The first run's end card is drawn from it, so what a
   person is shown as theirs is exactly what would cross.

   WHAT CROSSES AND WHAT NEVER DOES, as two tables that must between them name
   every top level key the blank profile has, so a field added to the record
   later cannot cross by default: the gate fails until somebody puts it in one
   list or the other. The analytic and summary data cross, and so does the
   story, text included, on round OX's words ("all the data from their input
   gets passed over").

   BIRTH DATA NEVER CROSSES, and with it the name: `who` holds the name parts,
   the sex and the birth moment, and DECISIONS.md rules the name never leaves
   the device. `name` and `id` stay for the same reason, `ui` is this browser's
   own switches, and `plan` is written by the processor and never by a record.
   A claim carrying any of them is refused by name at its own boundary.

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
 /* the counter in the packet is the meter's, on the packet's own copy, so a
    record read between a release and its save still hands over a true count */
 journeyGiftSync(v.profile);
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

/* ---------------- what changed, after a release ---------------- */
/* THE ANSWER TO "WHAT CHANGED?", written as evidence, one record per address
   the run worked. System Congruency TDD section 15; CONGRUENCY-AUDIT.md's
   next task, item 2. The vocabulary and its boundary are the evidence
   domain's own (RV_METRIC, RV_ANSWERS and prCross in engine/practice.js);
   this is the one host free door that builds the records, so the gate can
   hold it without a browser.

   PURE, AND ALL OR NOTHING. It takes the practice object and returns a new
   one, every record through practiceDo, so each one passes the same boundary
   an import does. If any address is refused, none is written and the object
   handed in comes back untouched: half a run's answer on the record would
   read as the person having answered about some addresses and not others.

   answer   one of RV_ANSWERS, the five offered answers. A skip is not
            an answer and is never written, see RV_METRIC
   addrs    the node ids the run worked, the queue after End cut it
   opt      { story_t }: the entry the run was planned from, or nothing
   now      the time, one for every record, so one answer reads as one moment

   Returns { ok, P, ids } or { ok:false, P, errs } with every reason named. */
function releaseVerify(P,answer,addrs,opt,now){
 var base=P||practiceBlank(), errs=[];
 if(RV_ANSWERS.indexOf(answer)<0)
  errs.push('a release verification is one of '+RV_ANSWERS.join(', ')+', not '+JSON.stringify(answer));
 var ids=[];
 if(!Array.isArray(addrs)||!addrs.length)errs.push('a release verification names the addresses the release worked, and none were given');
 else addrs.forEach(function(a){
  if(!NUM(a)||!BY[a])errs.push('no address is '+JSON.stringify(a));
  else if(ids.indexOf(a)<0)ids.push(a);});
 if(errs.length)return {ok:false, P:base, errs:errs};
 var t=now||new Date().toISOString(), st=(opt&&opt.story_t)||null, Q=base, out=[];
 for(var i=0;i<ids.length;i++){
  var r=practiceDo(Q,'evidence_record',{source:'user', type:'internal', dimension:'affect',
   pattern_id:'addr:'+ids[i], metric:RV_METRIC, value:answer, story_t:st, timestamp:t},t);
  if(!r.ok)return {ok:false, P:base, errs:r.errs};
  Q=r.P; out.push(r.id);}
 return {ok:true, P:Q, ids:out};}
/* WHAT THE RECORD SAYS WAS ANSWERED AT ONE ADDRESS, newest last. Read off the
   evidence and never stored. A run's answer is one record per address at one
   timestamp, so at a single address every record is one release's answer. */
function releaseVerifyAt(P,addr){
 var id='addr:'+addr, ev=(P&&Array.isArray(P.evidence))?P.evidence:[];
 return ev.filter(function(e){return e&&e.metric===RV_METRIC&&e.pattern_id===id;})
  .map(function(e){return {value:e.value, at:e.timestamp, story_t:e.story_t||null};})
  .sort(function(a,b){return String(a.at)<String(b.at)?-1:String(a.at)>String(b.at)?1:0;});}
