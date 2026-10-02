/* ============================================================
   THE LOOP READ. P18a in the pass 3 funnel spec, row F23: "loopRead
   (confirmed patterns, practice history, misses, declines)". The trace
   graph (engine/trace.js) was built whole and had no screen; this is the
   one read a screen asks, so no renderer walks the graph itself and no two
   renderers can walk it differently.

   WHAT QUESTION IT ANSWERS, in one sentence: for each pattern the record
   touches, has the person said yes to it, and what on the record connects
   it to what they did about it.

   IT HOLDS NO READING OF ITS OWN. Every fact below is read off
   traceFromRecord, which reads the record, plus practiceTraceIntents for
   the practice objects, which is the same pair dlyGraph in engine/daily.js
   hands the graph. Same record, same answer, whatever profile the engine
   has loaded, because traceFromRecord already reads under the record's own
   soul and puts S back.

   TWO STATES, NOT THREE, AND WHY. A pattern is confirmed when any edge that
   touches it is held as user_confirmed, which is the graph's own word for
   "the person said so" (TDD section 26), and unanswered otherwise. There is
   no third state for a pattern the person turned down, because nothing on
   the record can say that yet: the "not me" answer is F16, unbuilt, and
   p.trace refuses any key but v, nodes and edges (validateTrace), so the
   spec's p.trace.declined does not exist. Inventing it here would be a
   schema change, and the schema is the owner's. What a person CAN decline
   today is a proposed practice (protocol_reject in engine/practice.js), so
   that is what declined lists, with the reason when one was recorded, and
   protocol_reject records none, so the reason is null and said to be null.

   OPENING LINES IS NOT CONFIRMING. A release run at an address is observed
   practice, and it is reported as practice. It does not move a pattern to
   confirmed: a person can run a release on an address they would answer no
   to, and the graph keeps those apart (TRACE_PROMOTE moves inferred to
   user_confirmed only by being confirmed). Collapsing them here would be
   the exact leak the graph was written to stop.

   PLACED BY THE WORDS, OR BY THE SEAT. traceFromRecord marks each story
   edge named or not: named when a word the person wrote named the fetter,
   not when the sniffer read the seat and the fallback chose the address.
   Both are inferred. The difference is how much of the claim came from the
   person's own words, and a false address in a somatic reading costs more
   than a missed one, so the order below puts every pattern the words named
   ahead of every pattern the fallback chose, before weight is consulted.

   HOST FREE. No document, no store, no clock. Pure over p.
   ============================================================ */

/* how many patterns a surface lists before it says how many more. Four, the
   working memory figure the UX floor carries, plus the one Next. */
var LOOP_SHOW=4;

/* the practice event statuses that mean it happened. partial is practice:
   PR_FLOW lets a partial run end a miss run in practiceMissRead too. */
var LOOP_RAN=['completed','partial'];

function loopNum(x){return typeof x==='number'&&isFinite(x)?x:0;}

/* the latest version of each protocol, by id, and every rejected version */
function loopProtocols(P){
 var by={}, rejected=[];
 ((P&&Array.isArray(P.protocols))?P.protocols:[]).forEach(function(x){
  if(!x||typeof x!=='object'||typeof x.id!=='string')return;
  if(!by[x.id]||loopNum(x.version)>loopNum(by[x.id].version))by[x.id]=x;
  if(x.status==='rejected')rejected.push(x);});
 return {latest:by, rejected:rejected};}

function loopRead(p){
 var out={entries:0, patterns:[], confirmed:0, unanswered:0, more:0,
  declined:[], practice:{done:0, older:0, events:0}, misses:[],
  restated:0, gaps:0, next:null, empty:true};
 if(!p||typeof p!=='object')return out;
 var P=(p.practice&&typeof p.practice==='object')?p.practice:null;
 var g=null;
 try{g=traceFromRecord(p,P?practiceTraceIntents(P):[]);}catch(e){g=null;}
 if(!g)return out;
 out.entries=((p.story&&Array.isArray(p.story.entries))?p.story.entries:[]).length;
 out.restated=(g.restated||[]).length;
 out.gaps=(g.gaps||[]).length;

 var node={}; g.nodes.forEach(function(n){node[traceKey(n.type,n.id)]=n;});
 var into={}, from={};
 g.edges.forEach(function(e){
  (into[e.to]=into[e.to]||[]).push(e);
  (from[e.from]=from[e.from]||[]).push(e);});
 var typeOf=function(k){return traceSplit(k).type;};

 /* PRACTICE HISTORY. A practice event is a node whether or not it happened:
    the practice build hands the graph every event it holds, scheduled and
    missed among them, because the edge says which ritual it belongs to and
    not that it ran. So what counts as practised is read off the event's own
    status, completed or partial, and a scheduled event is never practice.
    An event read off the older ritual list is only a node when it was done
    (traceFromRecord skips done false), observed when it was marked and
    inferred when it was saved before done existed. */
 var pev={};
 ((P&&Array.isArray(P.practice_events))?P.practice_events:[]).forEach(function(x){
  if(x&&typeof x.id==='string')pev[x.id]=x;});
 var ran=function(k){var id=traceSplit(k).id, x=pev[id], n=node[k];
  if(x)return LOOP_RAN.indexOf(x.status)>=0;
  return !!(n&&n.derived);};
 g.nodes.forEach(function(n){
  if(n.type!=='practice_event')return;
  var k=traceKey(n.type,n.id);
  if(!ran(k))return;
  out.practice.events++;
  if(n.src==='inferred')out.practice.older++; else out.practice.done++;});

 /* THE PATTERNS */
 g.nodes.forEach(function(n){
  if(n.type!=='pattern')return;
  var k=traceKey(n.type,n.id), ins=into[k]||[], outs=from[k]||[];
  /* A PATTERN ONLY A PRACTICE NAMES CARRIES NO NAME ON ITS NODE. The node
     is made from the intent, which says addr:31 and nothing else, so this
     read printed the pattern as "31". The address table names it, the same
     lookup the story edges are made with. Found by the practitioner page,
     round QB, whose examples reach their patterns through practice first. */
  var at=(!n.name&&typeof tracePatternAttrs==='function')?tracePatternAttrs(n.id):{};
  var row={key:k, id:n.id, name:n.name||at.name||n.id, seat:n.seat||at.seat||null, fetter:n.fetter||at.fetter||null,
   nerve:n.nerve||at.nerve||null, address:/^[0-9]+$/.test(n.id)?+n.id:null,
   state:'unanswered', named:false, stories:0, weight:0, lines:0, truths:0,
   protocols:[], rituals:0, practised:0, evFor:0, evAgainst:0, by:null,
   /* WHAT THE PERSON SAID CHANGED after each release here, read off the
      evidence directly, because a verification is never an edge (RV_METRIC,
      engine/practice.js). Counted by answer, with the newest, and never added
      to evFor or evAgainst: an answer is what was said, not support. */
   said:{n:0, by:{}, last:null}};
  if(row.address!==null&&typeof releaseVerifyAt==='function')
   releaseVerifyAt(P,row.address).forEach(function(v){
    row.said.n++; row.said.by[v.value]=(row.said.by[v.value]||0)+1; row.said.last=v.value;});
  var confirmedBy=null;
  ins.concat(outs).forEach(function(e){
   if(e.src==='user_confirmed'&&!confirmedBy)confirmedBy=typeOf(e.from===k?e.to:e.from);});
  ins.forEach(function(e){
   var t=typeOf(e.from), src=node[e.from];
   if(t==='story'&&e.edge==='supports'){row.stories++; row.weight+=loopNum(e.w); if(e.named)row.named=true;}
   else if(t==='release'&&e.edge==='addresses')row.lines+=loopNum(src&&src.lines);
   else if(t==='reframe'&&e.edge==='addresses')row.truths+=loopNum(src&&src.lines);
   else if(t==='evidence')(e.edge==='contradicts'?row.evAgainst++:row.evFor++);
   else if(t==='protocol'&&(e.edge==='targets'||e.edge==='addresses')){
    var pid=traceSplit(e.from).id;
    if(row.protocols.indexOf(pid)<0)row.protocols.push(pid);
    /* the rituals that execute it, and the practice they produced */
    (into[e.from]||[]).forEach(function(x){
     if(typeOf(x.from)!=='ritual'||x.edge!=='executes')return;
     row.rituals++;
     (from[x.from]||[]).forEach(function(y){
      if(typeOf(y.to)==='practice_event'&&y.edge==='produces'&&ran(y.to))row.practised++;});});}});
  row.weight=Math.round(row.weight*10)/10;
  if(confirmedBy){row.state='confirmed'; row.by=confirmedBy;}
  /* a pattern that only a stored release key names, with nothing read and
     nothing run, is a key and not yet anything about the person */
  if(!row.stories&&!row.lines&&!row.truths&&!row.protocols.length&&!row.evFor&&!row.evAgainst&&!row.said.n&&!confirmedBy)return;
  out.patterns.push(row);});

 /* THE ORDER, and every step of it is a reason. Confirmed first: the person
    said so. Then what the words named, then what the fallback placed.
    Then the heavier read, then what has been worked on, then the key, so one
    record is one order. */
 out.patterns.sort(function(a,b){
  var s=(a.state==='confirmed'?0:1)-(b.state==='confirmed'?0:1); if(s)return s;
  s=(a.named?0:1)-(b.named?0:1); if(s)return s;
  s=b.weight-a.weight; if(s)return s;
  s=(b.lines+b.truths)-(a.lines+a.truths); if(s)return s;
  return a.key<b.key?-1:a.key>b.key?1:0;});
 out.patterns.forEach(function(x){if(x.state==='confirmed')out.confirmed++; else out.unanswered++;});
 out.more=Math.max(0,out.patterns.length-LOOP_SHOW);

 /* DECLINED. A proposed practice the person turned down. */
 var pr=loopProtocols(P);
 pr.rejected.forEach(function(x){
  var ids=(x.target_patterns&&Array.isArray(x.target_patterns.pattern_ids))?x.target_patterns.pattern_ids:[];
  out.declined.push({id:x.id, version:loopNum(x.version)||1, cls:x['class']||null,
   at:typeof x.updated_at==='string'?x.updated_at:null,
   patterns:ids.map(function(id){var a=traceInId('pattern',id); return tracePatternAttrs(a).name||String(id);}),
   why:null});});

 /* MISSES. practiceMissRead's run per ritual, only where there is one. The
    stage is its word, and motivation is false, which it states itself. */
 if(P&&Array.isArray(P.rituals)&&typeof practiceMissRead==='function')
  P.rituals.forEach(function(r){
   if(!r||typeof r.id!=='string')return;
   var m=null; try{m=practiceMissRead(P,r.id);}catch(e){m=null;}
   if(m&&m.run>0)out.misses.push({ritual:r.id, protocol:r.protocol_id||null, run:m.run, stage:m.stage});});

 /* THE ONE NEXT, P18b. The first pattern in the order above that the words
    named, sits at an address, and has had no line opened: a release there is
    the one step the record can point at. Nothing named and unworked, no
    Next, and the surface says nothing rather than invent one. */
 for(var i=0;i<out.patterns.length;i++){var x=out.patterns[i];
  if(x.named&&x.address!==null&&!x.lines&&!x.truths){out.next={kind:'release', key:x.key, address:x.address, name:x.name}; break;}}

 out.empty=!out.patterns.length&&!out.declined.length&&!out.practice.events&&!out.misses.length;
 return out;}
