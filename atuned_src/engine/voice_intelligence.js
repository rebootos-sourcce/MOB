/* SOURCE VOICE INTELLIGENCE READ SEAM.
 * Stage 2: the canonical Sniffer's already-read seat signals may query the
 * actual record-derived trace graph. Stage 3: Source receives a bounded,
 * evidence-only intelligence report. No writes, no independent CQ scores.
 */
function srcVoiceGraph(text,record,opts){
 var o=opts||{}, voice=srcVoiceSniff(text,o.prior,o.active);
 var base={status:'UNREAD',engine:'MOB/traceFromRecord',scope:'ACTIVE_RECORD_ONLY',
  matched:[], graphNodes:0, graphEdges:0, structures:[], gaps:0, refused:0};
 if(!String(text||'').trim())return {voice:voice,graph:base};
 if(o.allowProfile!==true){base.status='CONSENT_REQUIRED';return {voice:voice,graph:base};}
 if(!record||typeof record!=='object'||Array.isArray(record)){
  base.status='NO_RECORD';return {voice:voice,graph:base};}
 /* Do not silently fall back to CURP, all profiles, a remote graph, or a
  * record with another identity. The caller must pass its active record. */
 /* A profile's canonical compute result is included only when the record
  * is currently held by the engine; readHeld refuses mismatched identities.
  * Never load a different record to make a chain appear. */
 var reading=o.reading!==undefined?o.reading:
  (typeof readHeld==='function'?readHeld(record):null);
 var g=traceFromRecord(record,null,reading);
 base.status=(g.refused||[]).length?'PARTIAL':'READ';
 base.graphNodes=g.nodes.length;base.graphEdges=g.edges.length;
 var typeCounts={};
 (g.nodes||[]).forEach(function(n){typeCounts[n.type]=(typeCounts[n.type]||0)+1;});
 base.structures=Object.keys(typeCounts).sort().map(function(k){
  return {type:k,count:typeCounts[k],source:'derived canonical record trace'};});
 base.gaps=(g.gaps||[]).length;base.refused=(g.refused||[]).length;
 var seats={};(voice.seats||[]).forEach(function(s){seats[s.seat]=s;});
 var nodes={};(g.nodes||[]).forEach(function(n){nodes[n.type+':'+n.id]=n;});
 var by={};
 (g.edges||[]).forEach(function(e){
  /* Known membership between 112 canonical nodes is not evidence that
   * any pattern is embodied. Only a story's specific supports edge is. */
  if(e.edge!=='supports'||String(e.from).indexOf('story:')!==0||
   String(e.to).indexOf('pattern:')!==0)return;
  if(e.src!=='user_confirmed'&&e.src!=='inferred')return;
  var p=nodes[e.to];
  if(!p||!p.seat)return;
  var k=B2K[p.seat];
  if(!k||!seats[k])return;
  var here=by[k]=by[k]||{seat:k,mentions:seats[k].mentions,
   recordInferences:0,userConfirmed:0,status:'CANDIDATE'};
  if(e.src==='user_confirmed')here.userConfirmed++;
  else here.recordInferences++;
  if(here.userConfirmed)here.status='USER_CONFIRMED_RECORD_HISTORY';
 });
 base.matched=Object.keys(by).sort().map(function(k){return by[k];});
 return {voice:voice,graph:base};
}
/* Stage 3: actual Source intelligence is a constrained READ of Source's
 * evidence ledger and record graph. The model can decide how to speak but
 * may never promote a read to an independently measured CQ or a diagnosis. */
function srcVoiceIntelligence(text,record,opts){
 var o=opts||{}, t=String(text||'');
 var v=srcVoiceGraph(t,record,o);
 var out={status:t.trim()?'READ':'UNREAD',engine:'MOB/evLedger+srcVoiceGraph',
  graphStatus:v.graph.status,recordScope:'ACTIVE_RECORD_ONLY',
  coherence:'NOT_MEASURED',ancestry:'NOT_ASSESSED',
  userLead:true,automaticQuestions:false,evidence:[],
  graphMatches:v.graph.matched,claims:[], narrative:null,emotionCycle:null,
  gaps:['ancestral lineage relationships not independently measured',
   'CQDQ law grades and full knowledge graph traversal not connected to voice'],
  instruction:'Respond to actual words. An inference is not an identity or a cause. Never auto-prompt.'};
 if(!t.trim())return {voice:v.voice,intelligence:out};
 /* Read user-attributed narrative over a bounded explicit session window.
  * No historic raw journal or user identifiers leave this function. */
 var userTurns=Array.isArray(o.turns)?o.turns.slice(-11).filter(function(x){return typeof x==='string';}):[];
 if(userTurns[userTurns.length-1]!==t)userTurns.push(t);
 out.narrative=srcVoiceNarrative(userTurns);
 /* The TULA episode reader is a pure report of explicit user turns. A rank
  * refers to the exact source adjective, never to CQ, profile or curve height. */
 out.emotionCycle=srcVoiceChargeCycle(userTurns);
 /* A tool consumer must not get any historical raw journal text or profile
  * identifiers. The ledger is computed locally; only this turn's words and
  * the non-identifying claim state leave this seam. */
 var entries=(o.allowProfile===true&&record&&record.story&&
  Array.isArray(record.story.entries))?record.story.entries:[];
 var ledger=evLedger(t,entries,{active:o.active||null});
 out.evidence=(ledger.ev||[]).filter(function(e){return e.src!=='earlier';})
  .slice(0,12).map(function(e){return {
   source:'current_turn',text:typeof e.text==='string'?e.text.slice(0,80):null,
   kind:e.kind||null,said:e.said||'unknown',status:'USER_REPORTED'};});
 out.claims=(ledger.order||[]).slice(0,7).map(function(k){
  var c=ledger.claims[k]||{};
  return {state:c.state||'unknown',evidenceCount:Array.isArray(c.ev)?c.ev.length:0,
   reportedSeat:c.state==='confirmed'||c.state==='corrected'?k:null,
   status:'not a diagnosis or identity'};});
 if(v.graph.status!=='READ')out.gaps.push('record graph access not available: '+v.graph.status);
 return {voice:v.voice,intelligence:out};
}

/* Actual canon registry retrieval for explicit questions, not user profiling.
 * The source records are the ones already loaded into the engine. An empty
 * query returns counts; other queries return small sourced name matches.
 * Never claim a matching word proves that somebody carries that pattern. */
function srcVoiceCanon(kind,query,limit){
 var k=String(kind||'all').toLowerCase(), q=String(query||'').toLowerCase().trim();
 var cap=Math.max(1,Math.min(12,Math.floor(+limit||6)));
 var registries=[
  {kind:'address',source:'NODES',rows:NODES.map(function(n){
   return {id:n.i,name:n.k,seat:n.b,category:n.c||null};})},
  {kind:'saboteur',source:'SAB33',rows:SAB33.map(function(r){
   return {name:r[0],axisBands:r[1].map(function(b){return b[0];})};})},
  {kind:'axis',source:'CHARGES',rows:CHARGES.map(function(c){return {name:c};})},
  {kind:'law',source:'SI',rows:SI.map(function(x){return {name:x.nm,seat:x.b};})},
  {kind:'expression',source:'EXPR',rows:EXPR.map(function(x){return {name:x.nm,seat:x.b};})},
  {kind:'archetype',source:'ARCH',rows:ARCH.map(function(x){return {name:x.nm,seat:x.b};})},
  {kind:'domain',source:'DOMAINS',rows:DOMAINS.map(function(x){return {name:x.nm,root:x.r};})},
  {kind:'mask',source:'MASKS',rows:MASKS.map(function(x){return {name:x.nm};})},
  {kind:'chakra',source:'BANDS',rows:BANDS.map(function(x){return {name:x};})}
 ];
 var inventory=registries.map(function(r){return {kind:r.kind,source:r.source,count:r.rows.length};});
 if(!q)return {status:'INDEX',source:'MOB canonical loaded tables',
  inventory:inventory,records:[],otherRegistries:'NOT_INDEXED_BY_VOICE'};
 var matches=[];
 registries.forEach(function(r){
  if(k!=='all'&&k!==r.kind)return;
  r.rows.forEach(function(x){
   if(String(x.name||'').toLowerCase().indexOf(q)>=0)matches.push({
    kind:r.kind,source:r.source,record:x});});});
 return {status:matches.length?'READ':'UNREAD',
  source:'MOB canonical loaded tables',inventory:inventory,
  records:matches.slice(0,cap),
  more:matches.length>cap,
  note:'A name match is a catalog entry, not an observation about a person.'};
}
