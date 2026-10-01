/* ============================================================
   THE TRACE GRAPH. Typed relationships between the objects this
   product already holds, and the few it cannot derive.

   WHY IT EXISTS NOW. PRIORITY.md rows 20.H8 and 20.H9 and section 19
   recorded that the engine had no graph and chose not to build one,
   because V3's graph as specified was a second model beside the real
   engine. The owner reversed that call on 1 October: the graph "should
   have been part of our documentation". What did not change is the
   reason the first call was made, so this is not V3's graph. It holds
   no reading of its own. It READS the objects that exist, story entries,
   the 112 address table, the meter's opened lines and the saved
   rituals, and adds only the relationships nothing else holds.

   DERIVE, DON'T STORE. meterNext in engine/schema.js says it plainly: a
   stored cursor and a stored list are two answers to one question and
   they drift. So the graph is a pure function of the record plus one
   small stored set, p.trace, and the split is decided per item:

     story          derived   one node per story entry, keyed by its date
     pattern        derived   one node per address any story, line or
                              stored edge touches, read off NODES
     story supports pattern   derived, inferred. parseStory's imprints,
                              re-read under the record's own soul (below)
     release, reframe         derived, observed. meter.unique grouped by
                              address and channel, the key meterKey makes
                              with no line. A truth channel is a reframe,
                              the split relCounts already makes.
     release addresses pattern  derived, observed
     ritual         derived   one node per saved ritual
     practice_event derived   one per ritual marked done, observed; one
                              per ritual saved before done existed,
                              inferred, because ledgerRead counts those as
                              practised and nothing ever recorded it
     everything else          STORED in p.trace: the practice objects'
                              stubs and every edge a person confirmed, a
                              proposal they have not yet answered, and a
                              link somebody observed. None of those can be
                              re-derived from anything on the record.

   PROVENANCE IS NEVER COLLAPSED (TDD section 26). Every node and every
   edge carries exactly one of known, inferred, proposed, user_confirmed,
   observed. A reading the sniffer made is inferred whether or not the
   words named the fetter, because a lexicon match is still an inference
   about a person; whether they named it is carried beside it as named.
   An inferred or proposed edge becomes user_confirmed only by being
   confirmed, and when it does the edge keeps what it was in was.

   REGISTRATION IS NOT CAUSATION (PRIORITY.md S3). A story placing charge
   at an address is a registration, so the derived edge is supports and
   never causes, and causes may only be held as proposed or as the
   person's own user_confirmed claim. Nothing in this engine observes a
   cause.

   THE ENGINE MAY NOT TOUCH THE HOST, and this file does not. The graph is
   plain data: arrays of plain objects, safe to JSON round trip. Functions
   that add to a graph mutate the graph they are handed and nothing else,
   and never throw on bad input: they return {ok, why}.
   ============================================================ */
var TRACE_V=1;
/* WHICH DERIVATION MADE A DERIVED GRAPH, TDD section 27's algorithm
   version. A graph read under one rule compared with one read under
   another is a change of rule, not a change in the person. */
var TRACE_ALG=1;

/* TDD section 16, exactly. */
var TRACE_NODE_TYPES=['story','impression','pattern','goal','behavior','protocol',
 'ritual','practice_event','observation','evidence','outcome','context',
 'somatic_state','reframe','release'];
/* TDD section 17, exactly. There is no related_to. */
var TRACE_EDGE_TYPES=['causes','associated_with','supports','contradicts','obstructs',
 'reinforces','targets','addresses','requires','implements','executes','produces',
 'measures','occurs_in','replaces','precedes','follows','generalizes_to','transfers_to'];
/* TDD section 26, exactly, and in that order. */
var TRACE_SRC=['known','inferred','proposed','user_confirmed','observed'];

/* ============================================================
   THE RULE TABLE. (from type, edge, to type, and where it comes from.)
   An edge outside it is refused by name.

   SECTION 15 IS WRITTEN IN TWO VOICES AND THE VOCABULARY IN ONE. Section
   15 names eight relationships that are not in section 17's vocabulary:
   desired_outcome, obstructed_by, affected_by, supported_by,
   addressed_by, executed_by, informs and, in section 18, measured_by. Six
   of them are a section 17 edge read backwards, and holding both readings
   of one fact is two answers to one question again. So each is held once,
   in the active direction, and the passive name is what a reader says
   walking it the other way:

     GOAL obstructed_by PATTERN      pattern obstructs goal
     PATTERN supported_by EVIDENCE   evidence supports pattern
     PATTERN addressed_by PROTOCOL   protocol addresses pattern
     PROTOCOL executed_by RITUAL     ritual executes protocol
     GOAL measured_by OUTCOME        outcome measures goal

   The other three are not a reversal and are mapped by meaning:

     GOAL desired_outcome OUTCOME    goal targets outcome. The goal aims
                                     at it; measures is the other half.
     BEHAVIOR affected_by PATTERN    pattern obstructs, reinforces or is
                                     associated_with behavior. Affected
                                     names no sign, and associated_with is
                                     the honest edge when the sign is not
                                     known, which is what it is for.
     EVIDENCE informs BEHAVIOR       evidence supports or contradicts
                                     behavior. Negative evidence is a
                                     type of its own in section 12.

   TARGETS AND ADDRESSES ARE TOLD APART. Section 15 lists both for one
   pair, protocol to pattern. Here targets is the aim and addresses is the
   act: a release key with lines opened under it addresses its pattern,
   observed; one nothing has run yet only targets it.
   ============================================================ */
var TRACE_RULES=[
 /* section 15, read as above */
 ['goal','targets','outcome','15, desired_outcome'],
 ['goal','requires','behavior','15'],
 ['pattern','obstructs','goal','15, obstructed_by'],
 ['pattern','obstructs','behavior','15, affected_by, the sign that hinders'],
 ['pattern','reinforces','behavior','15, affected_by, the sign that holds a behaviour in place'],
 ['pattern','associated_with','behavior','15, affected_by, sign not known'],
 ['behavior','produces','outcome','15'],
 ['evidence','supports','pattern','15, supported_by'],
 ['evidence','contradicts','pattern','12, negative evidence'],
 ['protocol','addresses','pattern','15, addressed_by'],
 ['protocol','targets','pattern','15'],
 ['pattern','occurs_in','context','15'],
 ['protocol','implements','behavior','15'],
 ['ritual','executes','protocol','15, executed_by'],
 ['ritual','produces','practice_event','15'],
 ['practice_event','produces','evidence','15'],
 ['practice_event','produces','outcome','15'],
 ['evidence','supports','behavior','15, informs'],
 ['evidence','contradicts','behavior','15, informs, negative'],
 ['evidence','supports','outcome','15'],
 ['evidence','contradicts','outcome','12, negative evidence'],
 ['outcome','measures','goal','15 and 18, measured_by'],
 /* section 18: the protocol carries a release and a reframe */
 ['protocol','requires','release','18, and 8: a release step calls the release engine'],
 ['protocol','requires','reframe','18'],
 /* section 8 and the meter: a line run at an address */
 ['release','addresses','pattern','8, lines opened at that address, the meter'],
 ['release','targets','pattern','8, the address a release key names'],
 ['reframe','addresses','pattern','8, truth lines installed at that address'],
 ['reframe','targets','pattern','8, the address a reframe key names'],
 ['reframe','replaces','pattern','8, pattern replacement'],
 /* the story system, the one relationship the engine already computes */
 ['story','supports','pattern','2, the story system: parseStory imprints'],
 ['story','produces','impression','16, and PRIORITY 20.H8: the reading of an entry'],
 ['impression','supports','pattern','16, and PRIORITY 20.H8'],
 ['story','occurs_in','context','36'],
 /* section 12 and 13: observation and the somatic state */
 ['practice_event','produces','observation','12, source observation'],
 ['observation','supports','evidence','12, source observation'],
 ['observation','measures','somatic_state','13, affect'],
 ['observation','occurs_in','context','36'],
 ['somatic_state','associated_with','pattern','PRIORITY S3: registration, not causation'],
 /* section 36, context transfer */
 ['behavior','occurs_in','context','36'],
 ['behavior','transfers_to','context','36'],
 ['evidence','occurs_in','context','12, evidence.context'],
 ['practice_event','occurs_in','context','36'],
 ['behavior','generalizes_to','behavior','36: works beyond its first context'],
 ['pattern','generalizes_to','pattern','17'],
 /* feedback. These are the only edges allowed to close a loop. */
 ['pattern','reinforces','pattern','17 and 1: the loop'],
 ['behavior','reinforces','pattern','17 and 1: avoidance feeding the thing avoided'],
 ['pattern','associated_with','pattern','17'],
 ['pattern','causes','pattern','17, a claim, never derived (S3)'],
 ['pattern','causes','behavior','17, a claim, never derived (S3)'],
 ['context','causes','pattern','4, conditions and triggers, a claim (S3)'],
 /* succession and order, section 27 and 23 */
 ['protocol','replaces','protocol','27: v2 replaces v1, and v1 is never mutated'],
 ['behavior','replaces','behavior','23'],
 ['protocol','precedes','protocol','23, progression'],
 ['ritual','precedes','ritual','23'],
 ['practice_event','precedes','practice_event','10'],
 ['story','precedes','story','2'],
 ['outcome','precedes','outcome','35, 30 60 90']];
/* follows is precedes read backwards (TRACE_INVERSE), so every precedes
   rule is a follows rule with the ends swapped. Generated rather than typed,
   so the two can never disagree. */
var TRACE_INVERSE={follows:'precedes'};
TRACE_RULES.filter(function(r){return r[1]==='precedes';}).forEach(function(r){
 TRACE_RULES.push([r[2],'follows',r[0],r[3]+', read backwards']);});
var TRACE_RULE={};
TRACE_RULES.forEach(function(r){TRACE_RULE[r[0]+' '+r[1]+' '+r[2]]=r[3];});
function traceRuleOf(ft,e,tt){ return TRACE_RULE[ft+' '+e+' '+tt]||null; }

/* THE ONLY EDGES THAT MAY CLOSE A LOOP ON THEMSELVES. A pattern that
   reinforces a pattern that reinforces the first is the feedback the
   document's own loop draws, and a person describing one is describing
   something real. Every other edge type is held acyclic WITHIN ITS OWN
   KIND: time does not loop (precedes, and follows as its reverse), a
   succession does not (replaces), a hierarchy does not (generalizes_to),
   and a requirement that requires itself is a deadlock. A cycle through
   several kinds, an outcome that measures a goal that targets that
   outcome, is the document's section 1 loop and is not a contradiction,
   so it is neither refused nor reported. */
var TRACE_LOOP=['reinforces','causes','associated_with'];
/* associated_with has no direction between two things of one type, so
   A with B and B with A are one fact and the second is a repeat. */
var TRACE_SYMMETRIC=['associated_with'];
/* S3. A cause is a claim somebody makes, never a reading the engine
   makes, so it is held only as a proposal or as the person's own. */
var TRACE_CAUSE_SRC=['proposed','user_confirmed'];
/* WHAT A PROVENANCE MAY BECOME. A proposal or an inference can be
   confirmed by the person, or borne out by something observed. Nothing
   moves the other way, and nothing becomes known after the fact: known is
   what the record or a table holds from the start. */
var TRACE_PROMOTE={proposed:['user_confirmed','observed'], inferred:['user_confirmed','observed']};
/* THE TYPES WHOSE IDS RESOLVE AGAINST A FIXED TABLE, the 112 addresses.
   Their existence is a fact about the table and never a claim about a
   person, so such a node is always known; what is claimed of it is
   carried on its edges. */
var TRACE_TABLE=['pattern','release','reframe'];
/* THE TYPES THE RECORD CAN ANSWER FOR. Anything else stored in p.trace
   belongs to the practice objects, whose schema is not this file's, and
   is counted as unchecked rather than claimed to resolve. */
var TRACE_RESOLVED=['story','pattern','release','reframe'];
/* A truth channel is a reframe. The same test relCounts makes in
   ui/release.js over the channel part of a meter key. */
var TRACE_TRUTH=/truth$/;
/* the ceilings at the boundary. An id is somebody's key, never prose, and
   120 characters is twice the longest key the meter can write. The stored
   layer holds only what cannot be derived, so a hundred thousand relations
   is far past any record a person writes by hand and exists to stop a
   pasted file, not to shape one. Refused above it, never truncated. */
var TRACE_ID_MAX=120, TRACE_MAX=100000;

/* WHAT A GAP IS. A node of these types that lacks one of these links is
   missing something the document says it must have, and traceOrphans
   names it. Required, not merely expected: a ritual that has never been
   done is not a gap, a ritual that executes nothing is. */
var TRACE_NEEDS={
 ritual:[{dir:'out',edges:['executes'],types:['protocol'],
  why:'a ritual is the scheduled execution of a protocol (TDD 1), and this one executes none'}],
 protocol:[{dir:'out',edges:['targets','addresses'],types:['pattern'],
  why:'a protocol targets a pattern (TDD 15), and this one names none'}],
 practice_event:[{dir:'in',edges:['produces'],types:['ritual'],
  why:'a practice event is produced by a ritual (TDD 15), and nothing produced this one'}],
 evidence:[{dir:'out',edges:['supports','contradicts'],types:['pattern','behavior','outcome'],
  why:'evidence is about something (TDD 12), and this bears on nothing'}],
 outcome:[{dir:'out',edges:['measures'],types:['goal'],
  why:'an outcome measures progress against a goal (TDD 14), and this measures none'}],
 goal:[{dir:'out',edges:['requires'],types:['behavior'],
  why:'a goal decomposes into observable behaviour (TDD 19), and this one has none'}],
 impression:[{dir:'in',edges:['produces'],types:['story'],
  why:'an impression is the reading of a story (PRIORITY 20.H8), and no story produced this one'}],
 release:[{dir:'out',edges:['targets','addresses'],types:['pattern'],
  why:'a release works at an address'}],
 reframe:[{dir:'out',edges:['targets','addresses'],types:['pattern'],
  why:'a reframe works at an address'}]};

/* ---------- keys ---------- */
/* A key is type and id. A type never holds a colon, so the first colon
   splits it, and an id may hold as many as it likes: a release id is a
   meter key and a story id is a time. */
function traceKey(type,id){ return String(type)+':'+String(id); }
function traceSplit(key){
 var s=String(key), i=s.indexOf(':');
 return i<0?{type:s,id:''}:{type:s.slice(0,i),id:s.slice(i+1)};}
function traceNew(){ return {v:TRACE_V, nodes:[], edges:[]}; }

/* an id is a string, or a whole number, which is read as its string. The
   address table keys by number and the practice build should not have to
   know which. Anything else is refused. */
function traceId(id){
 if(typeof id==='number'&&isFinite(id)&&id>=0&&id%1===0)return String(id);
 if(typeof id==='string')return id;
 return null;}
/* AN ADDRESS HAS ONE ID. The record already writes an address as addr:12
   (meter.firsts, through meterFirst in ui/release.js), and the practice
   build names patterns that way, so on the way IN an id of that form is
   read as the address it names. Two spellings of one address would be two
   nodes for one place in the body. What is stored is only ever the bare
   number, and the boundary refuses the other spelling rather than quietly
   rewriting a stored record. */
var TRACE_ADDR_ALIAS=/^addr:([0-9]+)$/;
function traceInId(type,id){
 var s=traceId(id);
 if(s!==null&&type==='pattern'){var m=TRACE_ADDR_ALIAS.exec(s); if(m)return m[1];}
 return s;}
function traceAddrWhy(id){
 if(TRACE_ADDR_ALIAS.test(id))return id+' is the spoken form; an address is stored as its number';
 if(!/^[0-9]+$/.test(id))return id+' is not an address number';
 return BY[+id]?null:id+' is not one of the 112 addresses';}
/* why an id cannot be one of this type, or null */
function traceIdWhy(type,id){
 if(id===null)return 'id is not a string or a whole number';
 if(!id.length)return 'id is empty';
 if(id.length>TRACE_ID_MAX)return 'id is '+id.length+' characters and the cap is '+TRACE_ID_MAX;
 if(/[\u0000-\u001f]/.test(id))return 'id carries a control character';
 if(type==='pattern')return traceAddrWhy(id);
 if(type==='release'||type==='reframe'){
  var parts=id.split(':');
  if(parts.length!==2||!parts[1])return id+' is not an address and a channel';
  var aw=traceAddrWhy(parts[0]); if(aw)return aw;
  var truth=TRACE_TRUTH.test(parts[1]);
  if(type==='release'&&truth)return parts[1]+' is a truth channel, so this is a reframe';
  if(type==='reframe'&&!truth)return parts[1]+' is not a truth channel, so this is a release';}
 return null;}
function traceNodeWhy(type,id,src){
 if(TRACE_NODE_TYPES.indexOf(type)<0)return 'is not a node type: '+type;
 if(TRACE_SRC.indexOf(src)<0)return 'carries no provenance this graph knows: '+src;
 var w=traceIdWhy(type,id); if(w)return w;
 if(TRACE_TABLE.indexOf(type)>=0&&src!=='known')
  return traceKey(type,id)+' is a row of the address table, so it is known, not '+src;
 return null;}

/* ---------- the index ----------
   Never stored on the graph. A cache on the object is one more copy that
   can disagree with the arrays, so the public functions build one per
   call, and the bulk builders build one and keep it in step themselves. */
/* an edge read as an arc: follows is precedes reversed, so both land in
   one family and a cycle through either is one cycle in time */
function traceArc(e){
 var inv=TRACE_INVERSE[e.edge];
 return inv?{a:e.to,b:e.from,t:inv,e:e}:{a:e.from,b:e.to,t:e.edge,e:e};}
function traceCanon(arc){
 var a=arc.a, b=arc.b;
 if(TRACE_SYMMETRIC.indexOf(arc.t)>=0&&traceSplit(a).type===traceSplit(b).type&&b<a){var x=a;a=b;b=x;}
 return a+'|'+arc.t+'|'+b;}
/* the entries of a list that are objects at all. A graph assembled by
   hand, or read past the boundary, can hold anything, and reading it must
   not throw; traceOrphans counts what was passed over. */
function traceLive(list){
 return (Array.isArray(list)?list:[]).filter(function(x){return x&&typeof x==='object'&&!Array.isArray(x);});}
function traceIx(g){
 var ix={node:{}, edge:{}, out:{}, inn:{}};
 traceLive(g.nodes).forEach(function(n){ix.node[traceKey(n.type,n.id)]=n;});
 traceLive(g.edges).forEach(function(e){traceIxEdge(ix,e);});
 return ix;}
function traceIxEdge(ix,e){
 var arc=traceArc(e);
 ix.edge[traceCanon(arc)]=e;
 (ix.out[arc.a]=ix.out[arc.a]||[]).push(arc);
 (ix.inn[arc.b]=ix.inn[arc.b]||[]).push(arc);}
function traceIsGraph(g){
 return !!(g&&typeof g==='object'&&Array.isArray(g.nodes)&&Array.isArray(g.edges));}
/* a node named as 'type:id' or as {type,id} */
function traceRef(r){
 if(typeof r==='string'){var s=traceSplit(r), a=traceInId(s.type,s.id); return traceKey(s.type,a);}
 if(r&&typeof r==='object'){var id=traceInId(r.type,r.id); if(id!==null)return traceKey(r.type,id);}
 return null;}

/* ---------- adding ---------- */
function traceNodeAdd(g,ix,type,id,src,attrs,was){
 var sid=traceId(id), why=traceNodeWhy(type,sid,src);
 if(why)return {ok:false, why:why};
 var key=traceKey(type,sid), have=ix.node[key];
 if(have){
  if(have.src===src)return {ok:true, key:key, held:true};
  if((TRACE_PROMOTE[have.src]||[]).indexOf(src)>=0){
   have.was=have.src; have.src=src; return {ok:true, key:key, promoted:true};}
  return {ok:false, why:key+' is held as '+have.src+' and may not become '+src};}
 var n={type:type, id:sid, src:src};
 if(was!==undefined){
  if((TRACE_PROMOTE[was]||[]).indexOf(src)<0)
   return {ok:false, why:'was '+was+' cannot have become '+src};
  n.was=was;}
 if(attrs)Object.keys(attrs).forEach(function(k){if(n[k]===undefined)n[k]=attrs[k];});
 g.nodes.push(n); ix.node[key]=n;
 return {ok:true, key:key, added:true};}

/* does b reach a inside one family, over arcs of type t only */
function traceReach(ix,from,to,t){
 var seen={}, q=[from]; seen[from]=1;
 while(q.length){var k=q.shift(); if(k===to)return true;
  (ix.out[k]||[]).forEach(function(arc){
   if(arc.t===t&&!seen[arc.b]){seen[arc.b]=1; q.push(arc.b);}});}
 return false;}

/* o: {at, was, attrs, strict, nocycle}. strict refuses a repeat even when
   it could promote, which is the boundary's reading: a stored layer holding
   one relation twice is corruption, not a confirmation. */
function traceEdgeAdd(g,ix,from,edge,to,src,o){
 o=o||{};
 if(TRACE_EDGE_TYPES.indexOf(edge)<0)return {ok:false, why:'is not an edge type: '+edge};
 if(TRACE_SRC.indexOf(src)<0)return {ok:false, why:'carries no provenance this graph knows: '+src};
 if(typeof from!=='string'||!ix.node[from])return {ok:false, why:'from names no node in the graph: '+from};
 if(typeof to!=='string'||!ix.node[to])return {ok:false, why:'to names no node in the graph: '+to};
 if(from===to)return {ok:false, why:from+' '+edge+' itself: a relationship of a thing to itself says nothing the node does not'};
 var ft=ix.node[from].type, tt=ix.node[to].type;
 if(!TRACE_RULE[ft+' '+edge+' '+tt])
  return {ok:false, why:'no rule lets a '+ft+' '+edge+' a '+tt};
 if(edge==='causes'&&TRACE_CAUSE_SRC.indexOf(src)<0)
  return {ok:false, why:'a cause is a claim and is held only as '+TRACE_CAUSE_SRC.join(' or ')
   +', never as '+src+': registration is not causation'};
 var e={from:from, to:to, edge:edge, src:src};
 if(o.at!==undefined){
  if(typeof o.at!=='string'||isNaN(new Date(o.at).getTime()))return {ok:false, why:'at is not a date'};
  e.at=o.at;}
 if(o.was!==undefined){
  if((TRACE_PROMOTE[o.was]||[]).indexOf(src)<0)return {ok:false, why:'was '+o.was+' cannot have become '+src};
  e.was=o.was;}
 var arc=traceArc(e), have=ix.edge[traceCanon(arc)];
 if(have){
  var said=have.from+' '+have.edge+' '+have.to;
  if(o.strict)return {ok:false, why:'repeats '+said};
  if(have.src===src)return {ok:true, held:true, edge:have};
  if((TRACE_PROMOTE[have.src]||[]).indexOf(src)>=0){
   have.was=have.src; have.src=src; if(e.at)have.at=e.at;
   return {ok:true, promoted:true, edge:have};}
  return {ok:false, why:said+' is held as '+have.src+' and may not become '+src};}
 /* a cycle within an acyclic kind. The new arc closes one exactly when its
    head already reaches its tail through arcs of its own kind. */
 if(!o.nocycle&&TRACE_LOOP.indexOf(arc.t)<0&&traceReach(ix,arc.b,arc.a,arc.t))
  return {ok:false, why:from+' '+edge+' '+to+' would close a loop of '+arc.t
   +', and '+arc.t+' does not loop'};
 if(o.attrs)Object.keys(o.attrs).forEach(function(k){if(e[k]===undefined)e[k]=o.attrs[k];});
 g.edges.push(e); traceIxEdge(ix,e);
 return {ok:true, added:true, edge:e};}

/* THE PUBLIC FOUR. Each builds its own index, so a graph is only ever its
   two arrays. */
function traceAddNode(g,type,id,src){
 if(!traceIsGraph(g))return {ok:false, why:'there is no graph to add to'};
 return traceNodeAdd(g,traceIx(g),type,traceInId(type,id),src);}
function traceAddEdge(g,from,edge,to,src,opt){
 if(!traceIsGraph(g))return {ok:false, why:'there is no graph to add to'};
 var o=opt&&typeof opt==='object'?{at:opt.at, was:opt.was}:{};
 if(o.at===undefined)delete o.at; if(o.was===undefined)delete o.was;
 return traceEdgeAdd(g,traceIx(g),traceRef(from),edge,traceRef(to),src,o);}
function traceRemoveEdge(g,from,edge,to){
 if(!traceIsGraph(g))return {ok:false, why:'there is no graph to remove from'};
 var f=traceRef(from), t=traceRef(to);
 if(TRACE_EDGE_TYPES.indexOf(edge)<0)return {ok:false, why:'is not an edge type: '+edge};
 var ix=traceIx(g), have=ix.edge[traceCanon(traceArc({from:f,to:t,edge:edge}))];
 if(!have)return {ok:false, why:'no such edge: '+f+' '+edge+' '+t};
 g.edges.splice(g.edges.indexOf(have),1);
 return {ok:true, removed:have};}

/* ---------- reading ---------- */
/* every edge touching a node, both ways, each carrying its own provenance.
   A proposed edge comes back proposed. */
function traceNeighbors(g,node,edgeType){
 if(!traceIsGraph(g))return [];
 var k=traceRef(node), out=[];
 if(k===null)return [];
 traceLive(g.edges).forEach(function(e){
  if(edgeType&&e.edge!==edgeType)return;
  if(e.from===k)out.push({key:e.to, edge:e.edge, dir:'out', src:e.src, e:e});
  else if(e.to===k)out.push({key:e.from, edge:e.edge, dir:'in', src:e.src, e:e});});
 return out.sort(function(a,b){
  return a.key<b.key?-1:a.key>b.key?1:(a.edge<b.edge?-1:a.edge>b.edge?1:(a.dir<b.dir?-1:a.dir>b.dir?1:0));});}

/* THE SHORTEST CHAIN from one node to another, as the edges walked, or
   null. o.undirected walks edges either way, which the document's own
   example needs: a goal requires a behaviour that a protocol implements.
   o.src keeps only the provenances named, so "is there a confirmed chain"
   is asked by naming the confirmed ones and a proposal never answers it.
   o.edges keeps only the edge types named. */
function tracePath(g,from,to,o){
 if(!traceIsGraph(g))return null;
 o=o||{};
 var a=traceRef(from), b=traceRef(to);
 if(a===null||b===null)return null;
 var ix=traceIx(g); if(!ix.node[a]||!ix.node[b])return null;
 if(a===b)return [];
 var okE=function(e){
  return (!o.src||o.src.indexOf(e.src)>=0)&&(!o.edges||o.edges.indexOf(e.edge)>=0);};
 var adj={};
 traceLive(g.edges).forEach(function(e){if(!okE(e))return;
  (adj[e.from]=adj[e.from]||[]).push({k:e.to, e:e, dir:'out'});
  if(o.undirected)(adj[e.to]=adj[e.to]||[]).push({k:e.from, e:e, dir:'in'});});
 Object.keys(adj).forEach(function(k){adj[k].sort(function(x,y){return x.k<y.k?-1:x.k>y.k?1:0;});});
 var prev={}, q=[a]; prev[a]=null;
 while(q.length){var k=q.shift(); if(k===b)break;
  (adj[k]||[]).forEach(function(s){if(prev[s.k]===undefined){prev[s.k]={k:k,s:s}; q.push(s.k);}});}
 if(prev[b]===undefined)return null;
 var path=[], c=b;
 while(prev[c]){var p=prev[c];
  path.unshift({from:p.s.e.from, edge:p.s.e.edge, to:p.s.e.to, src:p.s.e.src, dir:p.s.dir}); c=p.k;}
 return path;}

/* ============================================================
   CYCLES. Strongly connected components, one kind of edge at a time.

   Every arc inside a component of its own kind lies on a cycle of that
   kind, so a component in an acyclic kind is a contradiction and every
   arc in it is named, with one cycle through it as the witness. A
   component in a loop kind is a feedback loop and is reported as one.
   Iterative, so a long chain of practice events cannot run out of stack.
   ============================================================ */
function traceScc(keys,adj){
 var idx=0, index={}, low={}, on={}, stack=[], out=[];
 keys.forEach(function(root){
  if(index[root]!==undefined)return;
  var work=[{k:root,i:0}]; index[root]=low[root]=idx++; stack.push(root); on[root]=1;
  while(work.length){
   var f=work[work.length-1], nb=adj[f.k]||[];
   if(f.i<nb.length){var w=nb[f.i++];
    if(index[w]===undefined){index[w]=low[w]=idx++; stack.push(w); on[w]=1; work.push({k:w,i:0});}
    else if(on[w])low[f.k]=Math.min(low[f.k],index[w]);}
   else{
    work.pop();
    if(work.length){var up=work[work.length-1].k; low[up]=Math.min(low[up],low[f.k]);}
    if(low[f.k]===index[f.k]){var comp=[],x;
     do{x=stack.pop(); on[x]=0; comp.push(x);}while(x!==f.k);
     if(comp.length>1)out.push(comp.sort());}}}});
 return out;}
function traceCycles(g){
 var res={illegal:[], loops:[]};
 if(!traceIsGraph(g))return res;
 var by={};
 traceLive(g.edges).forEach(function(e){var arc=traceArc(e); (by[arc.t]=by[arc.t]||[]).push(arc);});
 Object.keys(by).sort().forEach(function(t){
  var arcs=by[t], adj={}, keys={};
  arcs.forEach(function(a){(adj[a.a]=adj[a.a]||[]).push(a.b); keys[a.a]=1; keys[a.b]=1;});
  Object.keys(adj).forEach(function(k){adj[k].sort();});
  traceScc(Object.keys(keys).sort(),adj).forEach(function(comp){
   if(TRACE_LOOP.indexOf(t)>=0){res.loops.push({edge:t, nodes:comp}); return;}
   var inC={}; comp.forEach(function(k){inC[k]=1;});
   arcs.forEach(function(a){
    if(!inC[a.a]||!inC[a.b])return;
    /* the witness: the way back from the head to the tail, in kind */
    var prev={}, q=[a.b]; prev[a.b]=null;
    while(q.length){var k=q.shift(); if(k===a.a)break;
     (adj[k]||[]).forEach(function(w){if(inC[w]&&prev[w]===undefined){prev[w]=k; q.push(w);}});}
    var cyc=[a.a], c=a.a;
    while(c!==null&&c!==a.b){c=prev[c]; if(c===undefined)break; cyc.unshift(c);}
    cyc.unshift(a.a);
    res.illegal.push({edge:a.e, kind:t, cycle:cyc});});});});
 return res;}

/* ============================================================
   THE GAPS. Never papered over.

   isolated  a node with no edge at all
   missing   a node without a link TRACE_NEEDS says its type must have
   dangling  a stored node naming a record object that is not there, a
             story entry deleted after something linked to it
   gaps      what the derivation could not place, carried on a derived
             graph: an imprint the sniffer seated at no address, a meter
             key that names no address, an entry with no date to key by
   unchecked the stored nodes of types this record cannot answer for,
             counted by type, so nobody reads a clean report as proof
             that a goal or a protocol named here exists
   ============================================================ */
function traceOrphans(g){
 var res={isolated:[], missing:[], dangling:[], gaps:[], unchecked:{}};
 if(!traceIsGraph(g))return res;
 var ix=traceIx(g), live=traceLive(g.edges), nodes=traceLive(g.nodes), by={out:{},in:{}};
 live.forEach(function(e){
  (by.out[e.from]=by.out[e.from]||[]).push({e:e,other:e.to});
  (by['in'][e.to]=by['in'][e.to]||[]).push({e:e,other:e.from});});
 nodes.slice().sort(function(a,b){
  var x=traceKey(a.type,a.id), y=traceKey(b.type,b.id); return x<y?-1:x>y?1:0;})
 .forEach(function(n){
  var k=traceKey(n.type,n.id);
  if(!by.out[k]&&!by['in'][k])res.isolated.push(k);
  if(n.dangling)res.dangling.push({key:k, why:n.why||'names nothing on the record'});
  (TRACE_NEEDS[n.type]||[]).forEach(function(need){
   var met=(by[need.dir][k]||[]).some(function(x){
    return need.edges.indexOf(x.e.edge)>=0&&ix.node[x.other]&&need.types.indexOf(ix.node[x.other].type)>=0;});
   if(!met)res.missing.push({key:k, type:n.type, dir:need.dir, edges:need.edges.slice(),
    types:need.types.slice(), why:need.why});});});
 var junk=(g.nodes.length-nodes.length)+(g.edges.length-live.length);
 if(junk)res.gaps.push({kind:'malformed', why:junk+' entr'+(junk===1?'y is':'ies are')+' not an object and could not be read'});
 if(Array.isArray(g.gaps))res.gaps=res.gaps.concat(g.gaps);
 if(g.unchecked&&typeof g.unchecked==='object')Object.keys(g.unchecked).forEach(function(t){res.unchecked[t]=g.unchecked[t];});
 return res;}

/* ============================================================
   THE BOUNDARY. validateProfile hands p.trace here.

   Missing is an older profile and reads as an empty stored layer. A
   wrong type, a key nobody declared, a node or edge the rules refuse, a
   reference to a node that is not in the layer, a repeat, or a loop in an
   acyclic kind is refused by name and never dropped, because a relation
   quietly removed is one a person thinks they confirmed. Every check is
   the same function the live graph uses, so there is one rule table and
   not a second copy of it here.
   ============================================================ */
var TRACE_KEYS=['v','nodes','edges'], TRACE_NODE_KEYS=['type','id','src','was'],
    TRACE_EDGE_KEYS=['from','to','edge','src','at','was'];
function validateTrace(o){
 if(o===undefined||o===null)return {ok:true, errs:[], trace:traceNew()};
 if(typeof o!=='object'||Array.isArray(o))return {ok:false, errs:['is not an object']};
 var errs=[], g=traceNew(), ix=traceIx(g);
 Object.keys(o).forEach(function(k){if(TRACE_KEYS.indexOf(k)<0)errs.push('may not carry '+k);});
 if(o.v!==undefined&&!(typeof o.v==='number'&&o.v%1===0&&o.v>=1&&o.v<=TRACE_V))
  errs.push('v is '+o.v+', not 1 to '+TRACE_V);
 var list=function(f){
  if(o[f]===undefined)return [];
  if(!Array.isArray(o[f])){errs.push(f+' is not a list'); return [];}
  if(o[f].length>TRACE_MAX){errs.push(f+' holds '+o[f].length+' and the cap is '+TRACE_MAX); return [];}
  return o[f];};
 list('nodes').forEach(function(n,i){
  var path='nodes['+i+']';
  if(!n||typeof n!=='object'||Array.isArray(n)){errs.push(path+' is not an object'); return;}
  var bad=0;
  Object.keys(n).forEach(function(k){if(TRACE_NODE_KEYS.indexOf(k)<0){errs.push(path+' may not carry '+k); bad++;}});
  if(bad)return;
  var sid=traceId(n.id);
  if(sid!==null&&ix.node[traceKey(n.type,sid)]){errs.push(path+' repeats '+traceKey(n.type,sid)); return;}
  var r=traceNodeAdd(g,ix,n.type,n.id,n.src,null,n.was);
  if(!r.ok)errs.push(path+' '+r.why);});
 list('edges').forEach(function(e,i){
  var path='edges['+i+']';
  if(!e||typeof e!=='object'||Array.isArray(e)){errs.push(path+' is not an object'); return;}
  var bad=0;
  Object.keys(e).forEach(function(k){if(TRACE_EDGE_KEYS.indexOf(k)<0){errs.push(path+' may not carry '+k); bad++;}});
  if(bad)return;
  var r=traceEdgeAdd(g,ix,e.from,e.edge,e.to,e.src,{at:e.at, was:e.was, strict:true, nocycle:true});
  if(!r.ok)errs.push(path+' '+r.why);});
 /* the loops, once, over the whole layer rather than per edge */
 traceCycles(g).illegal.forEach(function(c){
  errs.push('edges close a loop of '+c.kind+', which does not loop: '+c.cycle.join(' then '));});
 return errs.length?{ok:false, errs:errs}:{ok:true, errs:[], trace:g};}

/* ============================================================
   THE CONTRACT WITH THE PRACTICE BUILD. Fixed; they code against it
   without this file present.

     intent = {from:{type,id}, to:{type,id}, edge, src}

   Nodes are made on demand. A node made for an intent takes the intent's
   provenance, except a row of the address table, which is known whoever
   names it, because an AI proposing a protocol for address 12 has not
   made address 12 a proposal. A node already present is left exactly as
   it is: confirming an edge confirms the edge, not the things at its ends.

   Each intent is all or nothing. One refused leaves no node behind that
   was made for it. Every refusal is returned with its reason and the
   intent it refused; nothing is dropped. An intent already held is
   counted as held and is not a refusal, so a build that replays its
   intents on every save is not told it failed. now stamps the edges, and
   is the only clock this file reads: pass it and the call is pure.
   ============================================================ */
var TRACE_INTENT_KEYS=['from','to','edge','src'], TRACE_END_KEYS=['type','id'];
function traceIntentWhy(it){
 if(!it||typeof it!=='object'||Array.isArray(it))return 'an intent is not an object';
 var ks=Object.keys(it).filter(function(k){return TRACE_INTENT_KEYS.indexOf(k)<0;});
 if(ks.length)return 'an intent may not carry '+ks.join(', ');
 var ends=['from','to'];
 for(var i=0;i<2;i++){var x=it[ends[i]];
  if(!x||typeof x!=='object'||Array.isArray(x))return ends[i]+' is not {type, id}';
  var ek=Object.keys(x).filter(function(k){return TRACE_END_KEYS.indexOf(k)<0;});
  if(ek.length)return ends[i]+' may not carry '+ek.join(', ');}
 return null;}
function traceApplyIx(g,ix,intents,at,res){
 intents.forEach(function(it){
  var why=traceIntentWhy(it);
  if(why){res.refused.push({intent:it, why:why}); return;}
  var made=[], keys=[];
  for(var i=0;i<2;i++){var end=i?it.to:it.from;
   var src=TRACE_TABLE.indexOf(end.type)>=0?'known':it.src;
   var sid=traceInId(end.type,end.id), k=sid===null?null:traceKey(end.type,sid);
   if(k!==null&&ix.node[k]){keys.push(k); continue;}
   var r=traceNodeAdd(g,ix,end.type,sid===null?end.id:sid,src);
   if(!r.ok){
    made.forEach(function(m){g.nodes.splice(g.nodes.indexOf(ix.node[m]),1); delete ix.node[m];});
    res.refused.push({intent:it, why:(i?'to ':'from ')+r.why}); return;}
   made.push(r.key); keys.push(r.key);}
  var e=traceEdgeAdd(g,ix,keys[0],it.edge,keys[1],it.src,at===undefined?{}:{at:at});
  if(!e.ok){
   made.forEach(function(m){g.nodes.splice(g.nodes.indexOf(ix.node[m]),1); delete ix.node[m];});
   res.refused.push({intent:it, why:e.why}); return;}
  if(e.promoted)res.promoted++; else if(e.held)res.held++; else res.added++;});
 return res;}
function traceApply(g,intents,now){
 var res={added:0, promoted:0, held:0, refused:[]};
 var all=Array.isArray(intents)?intents:[intents];
 if(!traceIsGraph(g)){
  all.forEach(function(it){res.refused.push({intent:it, why:'there is no graph to apply to'});});
  return res;}
 if(!Array.isArray(intents)){res.refused.push({intent:intents, why:'intents is not a list'}); return res;}
 var at=now===undefined?new Date().toISOString():now;
 if(typeof at!=='string'||isNaN(new Date(at).getTime())){
  all.forEach(function(it){res.refused.push({intent:it, why:'now is not a date'});});
  return res;}
 return traceApplyIx(g,traceIx(g),intents,at,res);}

/* ============================================================
   WHAT THE RECORD ALREADY SAYS.
   ============================================================ */
/* AN ENTRY IS KEYED BY ITS TIME, not by its place in the list (19.B7).
   Two entries stamped the same instant are told apart by order among
   themselves only, as #1, #2. An entry with no readable time has no
   identity of its own, is keyed by position as entry#i, and is reported
   as a gap, because a position key moves when anything before it is
   deleted. */
function traceTimeIds(list){
 var seen={};
 return (list||[]).map(function(x,i){
  var t=x&&x.t;
  if(typeof t!=='string'||isNaN(new Date(t).getTime()))return 'entry#'+i;
  seen[t]=(seen[t]||0)+1;
  return seen[t]>1?t+'#'+(seen[t]-1):t;});}
function traceStoryIds(p){ return traceTimeIds(p&&p.story&&p.story.entries); }
function traceRitualIds(p){ return traceTimeIds(p&&p.rituals); }

/* ============================================================
   THE READING BELONGS TO THE RECORD IT IS A READING OF.

   parseStory chooses which addresses a fallback reading lands on by
   susceptibility, and susceptibility is set from whichever soul S holds.
   compute.js already records what that cost once: 944 of 1560 profile
   pairs read differently by order. Measured here before this was written,
   over the fourteen roster stories: 2 of 14 land on different addresses
   depending on which roster soul is loaded. Angela's own sentence lands
   on 53, 54, 55 and 56 under her soul and on 61, 62, 53 and 54 under
   Sofia's.

   So the read is made under the record's own soul, and everything it
   moved is put back after, including when the read throws. Nothing here
   moves a charge or a law; S is borrowed for the length of one parse and
   returned as it was. The soul is read the way the boundary fills it: an
   empty list of domains is the first domain, never whichever domain the
   last profile left in S.dom.
   ============================================================ */
function traceWithSoul(p,fn){
 var soul=(p&&p.soul&&typeof p.soul==='object')?p.soul:{};
 var keep={doms:S.doms, arcs:S.arcs, roots:S.roots, dom:S.dom, a1:S.a1, a2:S.a2,
  D:DOMAIN, susc:W.map(function(n){return n.susc;})};
 try{
  S.doms=(Array.isArray(soul.doms)&&soul.doms.length?soul.doms:[0]).slice();
  S.arcs=(Array.isArray(soul.arcs)&&soul.arcs.length?soul.arcs:[0,1]).slice();
  S.roots=(Array.isArray(soul.roots)?soul.roots:[]).slice();
  buildSoul(); suscAll();
  return fn();}
 finally{
  S.doms=keep.doms; S.arcs=keep.arcs; S.roots=keep.roots;
  S.dom=keep.dom; S.a1=keep.a1; S.a2=keep.a2; DOMAIN=keep.D;
  W.forEach(function(n,i){n.susc=keep.susc[i];});}}

function tracePatternAttrs(i){
 var n=BY[+i]; return n?{name:n.k, seat:n.b, nerve:n.n||null, fetter:n.cf||null}:{};}

/* ============================================================
   traceFromRecord(p, intents)

   The whole graph for one record: what the record says, then the stored
   layer p.trace over it, then any intents handed in at read time. Same
   record, same graph, byte for byte, whatever profile the engine happens
   to have loaded.

   intents here are for relationships a practice object's own fields
   already state, a protocol's own list of patterns, say. Those should be
   handed in on every read and never stored, for the same reason nothing
   else derivable is stored. Only what has no other home goes into
   p.trace through traceApply.

   Every derived node and edge goes through the same rule table as a
   stored one. A derived edge the table refused would be a defect in this
   file, so it is reported in refused rather than kept, and the gate holds
   refused empty on the worked record.
   ============================================================ */
function traceFromRecord(p,intents){
 var g=traceNew(); g.alg=TRACE_ALG; g.lex=LEX_VERSION;
 g.gaps=[]; g.refused=[]; g.restated=[]; g.unchecked={};
 var ix=traceIx(g);
 if(!p||typeof p!=='object'){g.gaps.push({kind:'no_record', why:'there is no record to read'}); return g;}
 var node=function(type,id,src,attrs){
  var r=traceNodeAdd(g,ix,type,id,src,attrs);
  if(!r.ok)g.refused.push({derived:true, node:traceKey(type,id), why:r.why});
  return r.ok?r.key:null;};
 var edge=function(from,e,to,src,attrs){
  var r=traceEdgeAdd(g,ix,from,e,to,src,{attrs:attrs, nocycle:true});
  if(!r.ok)g.refused.push({derived:true, edge:from+' '+e+' '+to, why:r.why});};

 /* THE STORIES, read under the record's own soul */
 var ents=(p.story&&Array.isArray(p.story.entries))?p.story.entries:[];
 var sids=traceStoryIds(p);
 var reads=traceWithSoul(p,function(){
  return ents.map(function(e){
   if(!e||typeof e.text!=='string')return null;
   try{return parseStory(e.text).imprints;}catch(err){return {err:(err&&err.message)||'error'};}});});
 ents.forEach(function(e,i){
  var id=sids[i];
  if(/^entry#/.test(id))g.gaps.push({kind:'undated', story:traceKey('story',id),
   why:'entry '+i+' has no readable time, so it is keyed by its position, which moves'});
  var sk=node('story',id,'known',{t:(e&&e.t)||null, lex:(e&&e.lex)||null,
   imprints:(e&&typeof e.imprints==='number')?e.imprints:null});
  if(!sk)return;
  /* THE READING IS TODAY'S. An entry read under another lexicon, or before
     the stamp existed, is re-read under this one, so its edges are what
     the sniffer says now and not what the person was shown then. Named,
     never hidden. */
  if(!e||e.lex!==LEX_VERSION)g.restated.push({story:sk, lex:(e&&e.lex)||null, now:LEX_VERSION});
  var im=reads[i];
  if(im===null){g.gaps.push({kind:'no_text', story:sk, why:'the entry carries no text to read'}); return;}
  if(im.err){g.gaps.push({kind:'unread', story:sk, why:'the sniffer could not read it: '+im.err}); return;}
  var by={}, order=[];
  im.forEach(function(x){
   if(x.node===null||x.node===undefined||!BY[x.node]){
    g.gaps.push({kind:'unplaced', story:sk, seat:x.band||null, fetter:x.fetter||null,
     why:'the reading seated charge at the '+(x.band||'unknown seat')+' and named no address'});
    return;}
   var k=String(x.node);
   if(!by[k]){by[k]={amt:0, named:false}; order.push(k);}
   by[k].amt+=x.amt||0; if(!x.inferred)by[k].named=true;
   by[k].fetter=x.fetter||null;});
  order.forEach(function(k){
   var pk=node('pattern',k,'known',tracePatternAttrs(k));
   if(!pk)return;
   var b=by[k];
   edge(sk,'supports',pk,'inferred',{derived:true, w:Math.round(b.amt*10)/10, named:b.named,
    why:b.named?'the words named '+b.fetter+' and the sniffer placed it here'
     :'the seat was read and the address was chosen by the fallback, not by the words'});});});

 /* THE LINES OPENED. One node per address and channel, which is
    meterKey's own form with no line. */
 var groups={}, gorder=[];
 ((p.meter&&Array.isArray(p.meter.unique))?p.meter.unique:[]).forEach(function(mk){
  var parts=String(mk).split(':');
  if(parts.length<2||!/^[0-9]+$/.test(parts[0])||!BY[+parts[0]]||!parts[1]){
   g.gaps.push({kind:'unreadable_key', key:String(mk), why:'the key names no address and channel'}); return;}
  var gk=meterKey(+parts[0],parts[1]);
  if(!groups[gk]){groups[gk]={node:parts[0], chan:parts[1], lines:0}; gorder.push(gk);}
  groups[gk].lines++;});
 gorder.forEach(function(gk){
  var gr=groups[gk], type=TRACE_TRUTH.test(gr.chan)?'reframe':'release';
  var rk=node(type,gk,'known',{address:+gr.node, chan:gr.chan, lines:gr.lines});
  var pk=node('pattern',gr.node,'known',tracePatternAttrs(gr.node));
  if(rk&&pk)edge(rk,'addresses',pk,'observed',{derived:true, w:gr.lines,
   why:gr.lines+' line'+(gr.lines===1?'':'s')+' opened at this address down this channel'});});

 /* THE SAVED RITUALS. Planned is not done, and done is not change. */
 var rits=Array.isArray(p.rituals)?p.rituals:[];
 var rids=traceRitualIds(p);
 rits.forEach(function(x,i){
  if(!x||typeof x!=='object')return;
  var id=rids[i];
  if(/^entry#/.test(id))g.gaps.push({kind:'undated', ritual:traceKey('ritual',id),
   why:'ritual '+i+' has no readable time, so it is keyed by its position, which moves'});
  var rk=node('ritual',id,'known',{t:x.t||null, band:x.band||'', track:x.track||'',
   steps:Array.isArray(x.steps)?x.steps.slice():[], min:typeof x.min==='number'?x.min:0});
  if(!rk||x.done===false)return;
  var older=x.done===undefined;
  var src=older?'inferred':'observed';
  var ek=node('practice_event',id,src,{at:typeof x.done==='string'?x.done:null});
  if(ek)edge(rk,'produces',ek,src,{derived:true,
   why:older?'saved before planned and practised were split; ledgerRead counts it practised and nothing recorded it'
    :'marked done'});});
 /* every derived node so far is the record's own */
 g.nodes.forEach(function(n){n.derived=true;});

 /* THE STORED LAYER over it. A stored node the record already derived
    keeps the derived one. A stored story the record no longer holds is
    kept and marked dangling. A stored release nothing has run yet targets
    its address, known from its own key, and does not address it. */
 var s=p.trace;
 if(s!==undefined&&s!==null){
  if(!traceIsGraph(s))g.refused.push({stored:true, why:'p.trace is not a graph'});
  else{
   s.nodes.forEach(function(n){
    if(!n||typeof n!=='object'){g.refused.push({stored:true, why:'a stored node is not an object'}); return;}
    var sid=traceId(n.id), k=sid===null?null:traceKey(n.type,sid);
    if(k!==null&&ix.node[k])return;
    var attrs=n.type==='pattern'?tracePatternAttrs(sid):{};
    if(n.type==='story')attrs={dangling:true, why:'no entry on this record is keyed '+sid};
    if(n.type==='release'||n.type==='reframe')attrs={lines:0};
    var r=traceNodeAdd(g,ix,n.type,n.id,n.src,attrs,n.was);
    if(!r.ok){g.refused.push({stored:true, node:k, why:r.why}); return;}
    if(n.type==='release'||n.type==='reframe'){
     var ak=traceKey('pattern',sid.split(':')[0]);
     if(!ix.node[ak])traceNodeAdd(g,ix,'pattern',sid.split(':')[0],'known',tracePatternAttrs(sid.split(':')[0]));
     edge(r.key,'targets',ak,'known',{derived:true, why:'the key names this address; no line has run here'});}});
   s.edges.forEach(function(e){
    if(!e||typeof e!=='object'){g.refused.push({stored:true, why:'a stored edge is not an object'}); return;}
    var r=traceEdgeAdd(g,ix,e.from,e.edge,e.to,e.src,{at:e.at, was:e.was});
    if(!r.ok)g.refused.push({stored:true, edge:e.from+' '+e.edge+' '+e.to, why:r.why});});}}

 /* THE READ TIME INTENTS */
 if(intents!==undefined&&intents!==null){
  var res={added:0, promoted:0, held:0, refused:[]};
  if(!Array.isArray(intents))g.refused.push({intent:intents, why:'intents is not a list'});
  else traceApplyIx(g,ix,intents,undefined,res);
  res.refused.forEach(function(r){g.refused.push(r);});}

 /* WHAT THE RECORD CANNOT ANSWER FOR, counted */
 g.nodes.forEach(function(n){
  if(n.derived||TRACE_RESOLVED.indexOf(n.type)>=0)return;
  g.unchecked[n.type]=(g.unchecked[n.type]||0)+1;});

 /* one order, so one record is one graph */
 g.nodes.sort(function(a,b){
  var x=traceKey(a.type,a.id), y=traceKey(b.type,b.id); return x<y?-1:x>y?1:0;});
 g.edges.sort(function(a,b){
  var x=a.from+'|'+a.edge+'|'+a.to+'|'+a.src, y=b.from+'|'+b.edge+'|'+b.to+'|'+b.src;
  return x<y?-1:x>y?1:0;});
 return g;}
