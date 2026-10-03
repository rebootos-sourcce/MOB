/* The trace graph gate, engine/trace.js. Run from tests/engine.js, which
   hands it its own ok() and group printer, or alone:

     node tests/trace.js

   The vocabularies are read out of the design document itself, sections 16,
   17 and 26, and never typed in here, so the gate and the document cannot
   drift apart the way a count typed into a paragraph does.

   THE SUITE IS RUN TWICE OVER. Once against the real engine, which must
   pass every check: that is the known good case, checked first. Then against
   a set of deliberately broken implementations, each of which must FAIL at
   least one check. A gate that passes a broken build is a tool that lies,
   and the only way to know this one does not is to show it a broken build. */
const path=require('path'), fs=require('fs');

/* THE DOCUMENT'S OWN LISTS. The first fenced text block after a heading. */
function docBlock(md,heading,after){
 const at=md.indexOf(heading); if(at<0)return null;
 let from=at;
 if(after){const a=md.indexOf(after,at); if(a<0)return null; from=a;}
 const s=md.indexOf('```text',from); if(s<0)return null;
 const e=md.indexOf('```',s+7);
 return md.slice(s+7,e).split('\n').map(x=>x.trim()).filter(Boolean);}

/* the worked record. Angela is a roster person (engine/data/people.js),
   and her own sentence is the first entry: it is the one roster story whose
   addresses move with the loaded soul, which is what the determinism checks
   need. The second entry names its fetter. The meter holds lines opened down
   both kinds of channel at two of her addresses and one key that names no
   address. The rituals are one done, one planned and one saved before done
   existed. It goes through the boundary, so it is a record the app could
   hold, not a shape invented for the test. */
function worked(E){
 const A=E.PEOPLE.find(p=>p.nm==='Angela');
 const p=E.blankProfile('Angela');
 p.soul={doms:[A.dom],arcs:[A.a1,A.a2],roots:[]};
 p.story.entries=[
  {t:'2026-09-20T08:00:00.000Z',text:A.says,imprints:4,bands:{},lex:E.LEX_VERSION},
  {t:'2026-09-21T08:00:00.000Z',text:'I feel ashamed and my chest is tight when I speak up at work.',imprints:3,bands:{}}];
 p.meter.unique=['53:Llimit:0','53:Llimit:1','53:Rlimit:0','53:Ltruth:0','54:Llimit:0','999:Llimit:0'];
 p.rituals=[
  {t:'2026-09-22T07:00:00.000Z',track:'Body',band:'Heart',steps:[],min:10,done:'2026-09-22T07:20:00.000Z'},
  {t:'2026-09-23T07:00:00.000Z',track:'Body',band:'Heart',steps:[],min:5,done:false},
  {t:'2026-09-10T07:00:00.000Z',track:'Body',band:'Heart',steps:[],min:5}];
 /* every ritual carries a track and a seat. One without them passes the
    boundary once as track '' and band '', and the same boundary refuses
    those on the next pass, so it could not be re-read: a defect in vRitual,
    engine/schema.js, reported rather than fixed from this seat. */
 const v=E.validateProfile(JSON.parse(JSON.stringify(p)));
 return v.ok?v.profile:null;}
function soulOf(E,nm){
 const Q=E.PEOPLE.find(p=>p.nm===nm), p=E.blankProfile(nm);
 p.soul={doms:[Q.dom],arcs:[Q.a1,Q.a2],roots:[]}; return p;}

/* an id that is valid for each type, two per type for same type rules */
const IDS={pattern:['12','13'],release:['12:Llimit','13:Rlimit'],reframe:['12:Ltruth','13:Rtruth']};
const idOf=(t,i)=>(IDS[t]||[t+'A',t+'B'])[i||0];
const has=(r,frag)=>!!(r&&r.why&&r.why.indexOf(frag)>=0);
const J=x=>JSON.stringify(x);

function suite(T,E,ok,g){
 const doc=fs.readFileSync(path.resolve(__dirname,'..','ATUNED-practice-ritual-accountability-trace-graph-TDD.md'),'utf8');
 const NT=docBlock(doc,'# 16. Graph Node Types'), ET=docBlock(doc,'# 17. Graph Edge Types'),
       ST=docBlock(doc,'# 26. AI Handshake','AI must distinguish');
 const safe=f=>{try{return f();}catch(e){return {threw:e&&e.message};}};

 g('TG1 · the vocabularies are the document\'s, exactly');
 ok(NT&&NT.length&&J(T.TRACE_NODE_TYPES)===J(NT),'node types are section 16, got '+J(T.TRACE_NODE_TYPES)+' against '+J(NT));
 ok(ET&&ET.length&&J(T.TRACE_EDGE_TYPES)===J(ET),'edge types are section 17, got '+J(T.TRACE_EDGE_TYPES)+' against '+J(ET));
 ok(ST&&ST.length===5&&J(T.TRACE_SRC)===J(ST),'provenance is section 26, got '+J(T.TRACE_SRC)+' against '+J(ST));
 ok(T.TRACE_EDGE_TYPES.indexOf('related_to')<0,'there is no generic related_to');
 const R=T.TRACE_RULES;
 ok(R.every(r=>NT.indexOf(r[0])>=0&&NT.indexOf(r[2])>=0&&ET.indexOf(r[1])>=0&&typeof r[3]==='string'&&r[3].length),
  'every rule is two node types, an edge type and a citation');
 const usedT=new Set(), usedE=new Set();
 R.forEach(r=>{usedT.add(r[0]);usedT.add(r[2]);usedE.add(r[1]);});
 NT.forEach(t=>ok(usedT.has(t),'node type '+t+' is reachable by some rule'));
 ET.forEach(e=>ok(usedE.has(e),'edge type '+e+' is used by some rule'));
 const key=r=>r[0]+' '+r[1]+' '+r[2];
 ok(new Set(R.map(key)).size===R.length,'no rule is listed twice');
 const pre=R.filter(r=>r[1]==='precedes').map(r=>r[2]+' follows '+r[0]).sort(),
       fol=R.filter(r=>r[1]==='follows').map(key).sort();
 ok(pre.length>0&&J(pre)===J(fol),'follows is precedes read backwards, rule for rule');
 /* SECTION 15, every relationship it requires, and the triple it is held as */
 const S15=[['goal','desired_outcome','outcome',[['goal','targets','outcome']]],
  ['goal','requires','behavior',[['goal','requires','behavior']]],
  ['goal','obstructed_by','pattern',[['pattern','obstructs','goal']]],
  ['behavior','affected_by','pattern',[['pattern','obstructs','behavior'],['pattern','reinforces','behavior'],['pattern','associated_with','behavior']]],
  ['behavior','produces','outcome',[['behavior','produces','outcome']]],
  ['pattern','supported_by','evidence',[['evidence','supports','pattern']]],
  ['pattern','addressed_by','protocol',[['protocol','addresses','pattern']]],
  ['pattern','occurs_in','context',[['pattern','occurs_in','context']]],
  ['protocol','targets','pattern',[['protocol','targets','pattern']]],
  ['protocol','implements','behavior',[['protocol','implements','behavior']]],
  ['protocol','executed_by','ritual',[['ritual','executes','protocol']]],
  ['ritual','produces','practice_event',[['ritual','produces','practice_event']]],
  ['practice_event','produces','evidence',[['practice_event','produces','evidence']]],
  ['practice_event','produces','outcome',[['practice_event','produces','outcome']]],
  ['evidence','supports','pattern',[['evidence','supports','pattern']]],
  ['evidence','informs','behavior',[['evidence','supports','behavior'],['evidence','contradicts','behavior']]],
  ['evidence','supports','outcome',[['evidence','supports','outcome']]],
  ['outcome','measures','goal',[['outcome','measures','goal']]]];
 const sec15=doc.slice(doc.indexOf('# 15. Trace Graph Integration'),doc.indexOf('# 16. Graph Node Types'));
 S15.forEach(s=>{
  ok(sec15.indexOf(s[1])>=0,'section 15 does name '+s[1]);
  s[3].forEach(t=>ok(!!T.traceRuleOf(t[0],t[1],t[2]),'section 15 '+s.slice(0,3).join(' ')+' is held as '+t.join(' ')));});
 /* ONLY THE NAMED KINDS CAN CYCLE. For every acyclic kind but the four that
    hold same type rules, the rule table's own type graph for that kind has no
    cycle, so no instance graph can. Asserted so a rule added later that
    breaks the claim fails here and not in somebody's record. */
 const free=['precedes','follows','replaces','generalizes_to'];
 ET.filter(e=>T.TRACE_LOOP.indexOf(e)<0&&free.indexOf(e)<0).forEach(e=>{
  const adj={}; R.filter(r=>r[1]===e).forEach(r=>{(adj[r[0]]=adj[r[0]]||[]).push(r[2]);});
  const seen={}, on={}; let cyc=false;
  const dfs=k=>{if(on[k]){cyc=true;return;} if(seen[k])return; seen[k]=on[k]=1; (adj[k]||[]).forEach(dfs); on[k]=0;};
  Object.keys(adj).forEach(dfs);
  ok(!cyc,'the rules for '+e+' cannot form a loop between types');});

 g('TG2 · every allowed triple is accepted, every other one refused by name');
 let acc=0, refusedOk=0, all=0;
 const badAcc=[], badRef=[];
 const rule=new Set(R.map(key));
 NT.forEach(ft=>ET.forEach(e=>NT.forEach(tt=>{
  all++;
  const G=T.traceNew();
  T.traceAddNode(G,ft,idOf(ft,0),T.TRACE_TABLE.indexOf(ft)>=0?'known':'proposed');
  T.traceAddNode(G,tt,idOf(tt,ft===tt?1:0),T.TRACE_TABLE.indexOf(tt)>=0?'known':'proposed');
  const src=e==='causes'?'proposed':'user_confirmed';
  const r=safe(()=>T.traceAddEdge(G,{type:ft,id:idOf(ft,0)},e,{type:tt,id:idOf(tt,ft===tt?1:0)},src));
  if(rule.has(ft+' '+e+' '+tt)){ if(r&&r.ok&&G.edges.length===1)acc++; else badAcc.push(ft+' '+e+' '+tt+': '+(r&&r.why)); }
  else { if(r&&!r.ok&&has(r,'no rule lets')&&G.edges.length===0)refusedOk++; else badRef.push(ft+' '+e+' '+tt); }})));
 ok(acc===R.length,'every rule accepted, '+acc+' of '+R.length+(badAcc.length?', first refused: '+badAcc.slice(0,3).join('; '):''));
 ok(refusedOk===all-R.length,'every triple outside the table refused by name, '+refusedOk+' of '+(all-R.length)
  +(badRef.length?', first let through: '+badRef.slice(0,3).join('; '):''));

 g('TG3 · provenance: five kinds, never collapsed, never downgraded');
 {
  const G=T.traceNew();
  T.traceAddNode(G,'protocol','P1','proposed'); T.traceAddNode(G,'pattern',12,'known');
  T.TRACE_SRC.forEach((s,i)=>{const H=T.traceNew();
   T.traceAddNode(H,'protocol','P1','proposed'); T.traceAddNode(H,'pattern',12,'known');
   const r=T.traceAddEdge(H,'protocol:P1','targets','pattern:12',s);
   ok(r.ok&&H.edges[0].src===s,s+' is held as '+s);});
  ok(has(T.traceAddEdge(G,'protocol:P1','targets','pattern:12','maybe'),'provenance'),'an unknown provenance is refused by name');
  ok(has(T.traceAddNode(G,'goal','G1','sure'),'provenance'),'a node with an unknown provenance is refused');
  ok(has(T.traceAddNode(G,'pattern',13,'proposed'),'known'),'an address is known, never proposed');
  ['inferred','known','observed'].forEach(s=>{const H=T.traceNew();
   T.traceAddNode(H,'pattern',12,'known'); T.traceAddNode(H,'pattern',13,'known');
   ok(has(T.traceAddEdge(H,'pattern:12','causes','pattern:13',s),'registration is not causation'),
    'a cause held as '+s+' is refused: registration is not causation');});
  const r1=T.traceAddEdge(G,'protocol:P1','targets','pattern:12','proposed');
  const r2=T.traceAddEdge(G,'protocol:P1','targets','pattern:12','user_confirmed');
  ok(r1.ok&&r2.ok&&r2.promoted&&G.edges.length===1&&G.edges[0].src==='user_confirmed'&&G.edges[0].was==='proposed',
   'a proposal confirmed becomes user_confirmed and keeps what it was');
  ok(!T.traceAddEdge(G,'protocol:P1','targets','pattern:12','proposed').ok&&G.edges[0].src==='user_confirmed',
   'a confirmed edge is not downgraded back to a proposal');
  const H=T.traceNew(); T.traceAddNode(H,'protocol','P1','proposed'); T.traceAddNode(H,'pattern',12,'known');
  T.traceAddEdge(H,'protocol:P1','targets','pattern:12','inferred');
  ok(!T.traceAddEdge(H,'protocol:P1','targets','pattern:12','known').ok,'an inference does not become known after the fact');
  ok(T.traceAddEdge(H,'protocol:P1','targets','pattern:12','inferred').held===true&&H.edges.length===1,'the same edge twice is held once');
  const N=T.traceNew(); T.traceAddNode(N,'goal','G1','proposed');
  const nr=T.traceAddNode(N,'goal','G1','user_confirmed');
  ok(nr.ok&&N.nodes[0].src==='user_confirmed'&&N.nodes[0].was==='proposed','a proposed goal the person accepts is theirs, and was a proposal');
  ok(!T.traceAddNode(N,'goal','G1','inferred').ok,'and is not demoted to an inference');
 }

 g('TG4 · reference integrity');
 {
  const G=T.traceNew();
  T.traceAddNode(G,'protocol','P1','proposed');
  ok(has(T.traceAddEdge(G,'protocol:P1','targets','pattern:12','proposed'),'names no node'),'an edge to a node not in the graph is refused');
  ok(G.nodes.length===1,'and makes no node');
  ok(has(T.traceAddEdge(G,'goal:nope','requires','protocol:P1','proposed'),'from names no node'),'so is an edge from one');
  ok(has(T.traceAddNode(G,'release','999:Llimit','known'),'112'),'a release at an address that does not exist is refused');
  ok(has(T.traceAddNode(G,'goal','a\u0007b','proposed'),'control character'),'an id carrying a control character is refused');
  const st=T.traceNew(); T.traceAddNode(st,'protocol','P','proposed'); T.traceAddNode(st,'pattern',12,'known');
  const sr=T.traceAddEdge(st,'protocol:P','targets','pattern:12','proposed',{at:'2026-09-30T10:00:00.000Z'});
  ok(sr.ok&&st.edges[0].at==='2026-09-30T10:00:00.000Z','a time handed to traceAddEdge is kept on the edge');
  ok(has(T.traceAddNode(G,'pattern',999,'known'),'112'),'an address that is not one of the 112 is refused');
  ok(has(T.traceAddNode(G,'pattern','abc','known'),'address number'),'a pattern id that is not a number is refused');
  ok(has(T.traceAddNode(G,'release','12:Ltruth','known'),'reframe'),'a truth channel is not a release');
  ok(has(T.traceAddNode(G,'reframe','12:Llimit','known'),'release'),'a limit channel is not a reframe');
  ok(has(T.traceAddNode(G,'release','12','known'),'channel'),'a release names its channel');
  ok(has(T.traceAddNode(G,'goal','x'.repeat(T.TRACE_ID_MAX+1),'proposed'),'cap'),'an id past the cap is refused, not cut');
  ok(has(T.traceAddNode(G,'goal','','proposed'),'empty'),'an empty id is refused');
  ok(has(T.traceAddNode(G,'goal',{},'proposed'),'string'),'an object for an id is refused');
  ok(has(T.traceAddNode(G,'feeling','x','proposed'),'node type'),'a type outside section 16 is refused');
  ok(T.traceAddNode(G,'pattern',12,'known').ok&&G.nodes.some(n=>n.type==='pattern'&&n.id==='12'),'a whole number id reads as its string');
  ok(has(T.traceAddEdge(G,'protocol:P1','related_to','pattern:12','proposed'),'edge type'),'related_to is refused by name');
  ok(has(T.traceAddEdge(G,'pattern:12','reinforces','pattern:12','proposed'),'itself'),'a node related to itself is refused');
 }

 g('TG5 · edge removal and neighbours');
 {
  const G=T.traceNew();
  ['A','B','C'].forEach(x=>T.traceAddNode(G,'practice_event',x,'observed'));
  T.traceAddNode(G,'ritual','R','known');
  T.traceAddEdge(G,'practice_event:A','precedes','practice_event:B','observed');
  T.traceAddEdge(G,'ritual:R','produces','practice_event:A','observed');
  const nb=T.traceNeighbors(G,'practice_event:A');
  ok(nb.length===2&&nb.some(x=>x.key==='practice_event:B'&&x.dir==='out')&&nb.some(x=>x.key==='ritual:R'&&x.dir==='in'),
   'neighbours both ways, got '+J(nb.map(x=>[x.key,x.dir])));
  ok(T.traceNeighbors(G,'practice_event:A','produces').length===1,'neighbours by edge type');
  ok(T.traceNeighbors(G,'practice_event:A').every(x=>x.src==='observed'),'every neighbour carries its provenance');
  ok(T.traceAddEdge(G,'practice_event:B','follows','practice_event:A','observed').held===true,
   'B follows A is A precedes B, already held');
  ok(T.traceRemoveEdge(G,'practice_event:B','follows','practice_event:A').ok&&G.edges.length===1,
   'removing B follows A removes A precedes B');
  ok(!T.traceRemoveEdge(G,'practice_event:A','precedes','practice_event:B').ok,'removing what is not there says so');
  ok(T.traceNeighbors(G,'practice_event:B').length===0,'and B is left with nothing');
  const P=T.traceNew(); T.traceAddNode(P,'pattern',12,'known'); T.traceAddNode(P,'pattern',13,'known');
  T.traceAddEdge(P,'pattern:12','associated_with','pattern:13','proposed');
  ok(T.traceAddEdge(P,'pattern:13','associated_with','pattern:12','proposed').held===true&&P.edges.length===1,
   'association between two patterns has no direction, so the reverse is a repeat');
 }

 g('TG6 · paths, and a proposal never answers for a confirmation');
 {
  const G=T.traceNew();
  T.traceAddNode(G,'goal','G','user_confirmed'); T.traceAddNode(G,'behavior','B','user_confirmed');
  T.traceAddNode(G,'protocol','P','proposed'); T.traceAddNode(G,'pattern',12,'known');
  T.traceAddEdge(G,'goal:G','requires','behavior:B','user_confirmed');
  T.traceAddEdge(G,'protocol:P','implements','behavior:B','proposed');
  T.traceAddEdge(G,'protocol:P','targets','pattern:12','proposed');
  ok(T.tracePath(G,'goal:G','pattern:12')===null,'no directed chain from the goal to the pattern');
  const u=T.tracePath(G,'goal:G','pattern:12',{undirected:true});
  ok(u&&u.length===3&&u[0].edge==='requires'&&u[2].edge==='targets','walked either way there is one, of three edges, got '+J(u));
  ok(T.tracePath(G,'goal:G','pattern:12',{undirected:true,src:['known','user_confirmed','observed']})===null,
   'and none that is confirmed, because two of the three are proposals');
  ok(J(T.tracePath(G,'goal:G','behavior:B'))===J([{from:'goal:G',edge:'requires',to:'behavior:B',src:'user_confirmed',dir:'out'}]),'a one step path');
  ok(T.tracePath(G,'goal:G','goal:nope')===null,'a path to nothing is null');
  ok(J(T.tracePath(G,'goal:G','goal:G'))==='[]','a node is no steps from itself');
 }

 g('TG7 · orphans and gaps are reported, never papered over');
 {
  const G=T.traceNew();
  T.traceAddNode(G,'ritual','R','known'); T.traceAddNode(G,'goal','G','user_confirmed');
  let o=T.traceOrphans(G);
  ok(o.isolated.indexOf('ritual:R')>=0&&o.isolated.indexOf('goal:G')>=0,'a node with no edge is isolated');
  ok(o.missing.some(m=>m.key==='ritual:R'&&m.edges[0]==='executes'),'a ritual that executes no protocol is missing one');
  ok(o.missing.some(m=>m.key==='goal:G'&&m.edges[0]==='requires'),'a goal with no behaviour is missing one');
  T.traceAddNode(G,'protocol','P','proposed');
  T.traceAddEdge(G,'ritual:R','executes','protocol:P','user_confirmed');
  o=T.traceOrphans(G);
  ok(!o.missing.some(m=>m.key==='ritual:R'),'executing a protocol closes the ritual\'s gap');
  ok(o.missing.some(m=>m.key==='protocol:P'),'and opens the protocol\'s: it targets nothing');
  T.traceAddNode(G,'pattern',12,'known'); T.traceAddEdge(G,'protocol:P','targets','pattern:12','proposed');
  o=T.traceOrphans(G);
  ok(!o.missing.some(m=>m.key==='protocol:P'),'a proposed target still counts as a target; its provenance says it is proposed');
  ok(o.isolated.indexOf('ritual:R')<0,'and nothing linked is called isolated');
  G.nodes.push(null); G.edges.push(7);
  o=T.traceOrphans(G);
  ok(o.gaps.some(x=>x.kind==='malformed'&&/2 entries/.test(x.why)),'entries that are not objects are counted as a gap, not skipped in silence');
 }

 g('TG8 · cycles: legal only where the document allows feedback');
 {
  const G=T.traceNew();
  ['A','B','C'].forEach(x=>T.traceAddNode(G,'practice_event',x,'observed'));
  T.traceAddEdge(G,'practice_event:A','precedes','practice_event:B','observed');
  T.traceAddEdge(G,'practice_event:B','precedes','practice_event:C','observed');
  ok(has(T.traceAddEdge(G,'practice_event:C','precedes','practice_event:A','observed'),'does not loop'),'time does not loop');
  ok(has(T.traceAddEdge(G,'practice_event:A','follows','practice_event:C','observed'),'does not loop'),'nor through its reverse');
  ok(G.edges.length===2,'and nothing was added');
  const L=T.traceNew(); [12,13,14].forEach(i=>T.traceAddNode(L,'pattern',i,'known'));
  ok(T.traceAddEdge(L,'pattern:12','reinforces','pattern:13','user_confirmed').ok
   &&T.traceAddEdge(L,'pattern:13','reinforces','pattern:14','user_confirmed').ok
   &&T.traceAddEdge(L,'pattern:14','reinforces','pattern:12','user_confirmed').ok,'a loop of reinforcement is allowed');
  const lc=T.traceCycles(L);
  ok(lc.illegal.length===0&&lc.loops.length===1&&lc.loops[0].edge==='reinforces'&&lc.loops[0].nodes.length===3,
   'and reported as a feedback loop, got '+J(lc));
  const M=T.traceNew(); T.traceAddNode(M,'goal','G','user_confirmed'); T.traceAddNode(M,'outcome','O','user_confirmed');
  ok(T.traceAddEdge(M,'goal:G','targets','outcome:O','user_confirmed').ok&&T.traceAddEdge(M,'outcome:O','measures','goal:G','user_confirmed').ok,
   'a goal targets an outcome that measures it: two kinds, no contradiction');
  ok(T.traceCycles(M).illegal.length===0,'and it is not called illegal');
  /* a graph assembled by hand, past the gate, is still caught by the scan */
  const H={v:1,nodes:['A','B','C'].map(x=>({type:'protocol',id:x,src:'known'})),
   edges:[['A','B'],['B','C'],['C','A']].map(x=>({from:'protocol:'+x[0],to:'protocol:'+x[1],edge:'replaces',src:'known'}))};
  const hc=T.traceCycles(H);
  ok(hc.illegal.length===3&&hc.illegal.every(c=>c.kind==='replaces'&&c.cycle[0]===c.cycle[c.cycle.length-1]&&c.cycle.length===4),
   'a loop of replacement is named edge by edge with its cycle, got '+J(hc.illegal.map(c=>c.cycle)));
 }

 g('TG9 · the boundary: validateTrace');
 {
  const vt=x=>safe(()=>T.validateTrace(x));
  ok(vt(undefined).ok&&J(vt(undefined).trace)===J(T.traceNew()),'missing is an older record, read as empty');
  ok(vt(null).ok,'null is missing too');
  const bad=(x,frag,what)=>{const r=vt(x); ok(r&&!r.ok&&(r.errs||[]).join(' | ').indexOf(frag)>=0,what+' is refused by name: '+J(r&&r.errs).slice(0,120));};
  bad([],'not an object','a list');
  bad('graph','not an object','a string');
  bad({v:1,nodes:[],edges:[],secret:1},'may not carry secret','an undeclared key');
  bad({v:T.TRACE_V+1,nodes:[],edges:[]},'not 1 to','a graph from a newer build');
  ok(vt({nodes:[],edges:[]}).ok,'a graph with no v is filled, not refused');
  bad({nodes:{},edges:[]},'nodes is not a list','nodes that are not a list');
  bad({nodes:[{type:'goal',id:'G',src:'proposed',why:'x'}]},'may not carry why','a node carrying a key nobody declared');
  bad({nodes:[{type:'goal',id:'G',src:'proposed'},{type:'goal',id:'G',src:'proposed'}]},'repeats goal:G','a repeated node');
  bad({nodes:[{type:'pattern',id:'999',src:'known'}]},'112','an address that does not exist');
  bad({nodes:[{type:'pattern',id:'12',src:'proposed'}]},'known, not proposed','an address held as a proposal');
  bad({nodes:[{type:'pattern',id:'addr:12',src:'known'}]},'stored as its number','an address stored in its spoken form');
  const two={nodes:[{type:'protocol',id:'P',src:'proposed'},{type:'pattern',id:'12',src:'known'}]};
  bad({...two,edges:[{from:'protocol:P',to:'pattern:99',edge:'targets',src:'proposed'}]},'names no node','an edge to a node not in the layer');
  bad({...two,edges:[{from:'protocol:P',to:'pattern:12',edge:'targets',src:'proposed'},{from:'protocol:P',to:'pattern:12',edge:'targets',src:'user_confirmed'}]},
   'repeats','one relation stored twice');
  bad({...two,edges:[{from:'pattern:12',to:'protocol:P',edge:'targets',src:'proposed'}]},'no rule lets','a triple outside the table');
  bad({...two,edges:[{from:'protocol:P',to:'pattern:12',edge:'targets',src:'proposed',at:'soon'}]},'not a date','a stamp that is not a date');
  bad({...two,edges:[{from:'protocol:P',to:'pattern:12',edge:'targets',src:'proposed',was:'user_confirmed'}]},'cannot have become','a history that runs backwards');
  bad({nodes:['A','B'].map(x=>({type:'practice_event',id:x,src:'observed'})),
   edges:[{from:'practice_event:A',to:'practice_event:B',edge:'precedes',src:'observed'},{from:'practice_event:A',to:'practice_event:B',edge:'follows',src:'observed'}]},
   'loop of precedes','a stored loop in time');
  bad({nodes:new Array(T.TRACE_MAX+1).fill(null)},'cap is','a layer past the ceiling');
  bad({nodes:[{type:'goal',id:'G',src:'user_confirmed',was:'known'}]},'cannot have become','a node whose history runs backwards');
  const good={v:1,nodes:[{type:'protocol',id:'P',src:'user_confirmed',was:'proposed'},{type:'pattern',id:'12',src:'known'},
    {type:'behavior',id:'B',src:'user_confirmed'}],
   edges:[{from:'protocol:P',to:'pattern:12',edge:'targets',src:'proposed',at:'2026-09-30T10:00:00.000Z'},
    {from:'protocol:P',to:'behavior:B',edge:'implements',src:'user_confirmed',was:'proposed'}]};
  const gv=vt(good);
  ok(gv.ok&&J(gv.trace)===J(good),'a good layer round trips exactly, got '+J(gv.errs));
  /* through the profile boundary */
  const base=E.saveProfile(E.blankProfile('tg'));
  const old=JSON.parse(J(base)); delete old.trace;
  const vo=E.validateProfile(old);
  ok(vo.ok&&J(vo.profile.trace)===J(T.traceNew()),'a profile from before the graph loads with an empty layer');
  const withT=JSON.parse(J(base)); withT.trace=good;
  const vw=E.validateProfile(JSON.parse(J(withT)));
  ok(vw.ok&&J(vw.profile.trace)===J(good),'a profile carrying a layer keeps it exactly');
  ok(vw.ok&&vw.profile.trace.edges[0].src==='proposed','and a proposal is still a proposal on the far side');
  const badT=JSON.parse(J(base)); badT.trace={nodes:[{type:'pattern',id:'999',src:'known'}]};
  const vb=E.validateProfile(badT);
  ok(!vb.ok&&vb.errs.some(e=>/^trace\.nodes\[0\]/.test(e)),'a profile with a bad layer is refused under trace., got '+J(vb.errs));
  const nullT=JSON.parse(J(base)); nullT.trace=null;
  ok(E.validateProfile(nullT).ok,'a profile whose layer is null is an older one');
 }

 g('TG10 · the contract with the practice build: traceApply');
 {
  const G=T.traceNew(), now='2026-10-01T09:00:00.000Z';
  const I=[
   {from:{type:'goal',id:'g1'},to:{type:'behavior',id:'b1'},edge:'requires',src:'user_confirmed'},
   {from:{type:'protocol',id:'pr1'},to:{type:'pattern',id:53},edge:'targets',src:'proposed'},
   {from:{type:'ritual',id:'r1'},to:{type:'protocol',id:'pr1'},edge:'executes',src:'user_confirmed'},
   {from:{type:'goal',id:'g1'},to:{type:'pattern',id:53},edge:'targets',src:'proposed'},
   {from:{type:'goal',id:'g2'},to:{type:'behavior',id:'b2'},edge:'requires',src:'user_confirmed',why:'x'},
   {from:{type:'evidence',id:'e1'},to:{type:'pattern',id:53},edge:'causes',src:'proposed'}];
  const n0=G.nodes.length;
  const r=safe(()=>T.traceApply(G,I,now));
  ok(r&&r.added===3,'three intents add three edges, got '+J(r&&{added:r.added,refused:r.refused&&r.refused.map(x=>x.why)}));
  ok(r&&r.refused&&r.refused.length===3,'three are refused, and returned');
  ok(r&&r.refused.every(x=>x.intent&&typeof x.why==='string'&&x.why.length),'each refusal carries its intent and its reason');
  ok(r&&r.refused.some(x=>has(x,'no rule lets a goal targets a pattern')),'a goal does not target a pattern; it is obstructed by one');
  ok(r&&r.refused.some(x=>has(x,'may not carry why')),'an intent outside the contract shape is refused by name');
  ok(!G.nodes.some(n=>n.id==='g2'||n.id==='e1'),'a refused intent leaves no node behind, got '+J(G.nodes.map(n=>n.type+':'+n.id)));
  ok(G.nodes.length===n0+5,'five nodes were made on demand: g1, b1, pr1, pattern 53, r1');
  const pat=G.nodes.find(n=>n.type==='pattern');
  ok(pat&&pat.id==='53'&&pat.src==='known','an address named by a proposal is still known');
  ok(G.nodes.find(n=>n.id==='pr1').src==='proposed','a protocol made by a proposal is a proposal');
  /* the record's own other spelling of an address, meterFirst's addr:N,
     which is how the practice build names a pattern */
  const al=T.traceApply(G,[{from:{type:'protocol',id:'pr1'},to:{type:'pattern',id:'addr:53'},edge:'addresses',src:'proposed'}],now);
  ok(al.added===1&&G.nodes.filter(n=>n.type==='pattern').length===1&&G.edges.some(e=>e.edge==='addresses'&&e.to==='pattern:53'),
   'addr:53 names address 53 and makes no second node for it, got '+J(al));
  ok(G.edges.every(e=>e.at===now),'every edge is stamped with the time handed in');
  const again=T.traceApply(G,I.slice(0,3),now);
  ok(again.added===0&&again.held===3&&again.refused.length===0,'replaying the same intents holds them and is not a failure');
  const up=T.traceApply(G,[{from:{type:'protocol',id:'pr1'},to:{type:'pattern',id:53},edge:'targets',src:'user_confirmed'}],now);
  ok(up.promoted===1&&G.edges.find(e=>e.from==='protocol:pr1'&&e.edge==='targets').was==='proposed','the person accepting a proposal promotes it and keeps what it was');
  const junk=[null,5,'x',[null],[{from:null}],[{from:{type:'goal',id:'g'},to:{type:'goal',id:'g'},edge:'requires',src:'proposed'}]];
  junk.forEach(j=>{const x=safe(()=>T.traceApply(T.traceNew(),j,now));
   ok(x&&!x.threw&&Array.isArray(x.refused)&&x.refused.length>=1&&x.added===0,'garbage is refused and reported, never thrown: '+J(j));});
  const xe=T.traceApply(T.traceNew(),[{from:{type:'goal',id:'g',title:'t'},to:{type:'behavior',id:'b'},edge:'requires',src:'proposed'}],now);
  ok(xe.refused.length===1&&has(xe.refused[0],'from may not carry title'),'an end carrying more than type and id is refused by name');
  const nog=safe(()=>T.traceApply(null,I,now));
  ok(nog&&nog.refused.length===I.length,'no graph refuses every intent by name');
  const bt=safe(()=>T.traceApply(T.traceNew(),I,'tomorrow'));
  ok(bt&&bt.refused.length===I.length&&bt.added===0,'a time that is not a date refuses the batch');
 }

 g('TG11 · traceFromRecord on a worked record');
 {
  const P=worked(E);
  ok(!!P,'the worked record passes the boundary');
  if(!P)return;
  const G=T.traceFromRecord(P);
  ok(G.refused.length===0,'every derived node and edge passes the rule table, refused '+J(G.refused));
  ok(T.traceCycles(G).illegal.length===0,'the derived graph has no illegal loop');
  ok(G.alg===T.TRACE_ALG&&G.lex===E.LEX_VERSION,'the graph names the derivation and the lexicon that made it');
  /* the reading, checked against the product's own route: load the record,
     then parse, which is what atomIndex does for the person on screen */
  E.loadProfile(JSON.parse(J(P)));
  const sids=T.traceStoryIds(P);
  P.story.entries.forEach((e,i)=>{
   const want=[...new Set(E.parseStory(e.text).imprints.map(x=>'pattern:'+x.node))].sort();
   const got=G.edges.filter(x=>x.from==='story:'+sids[i]&&x.edge==='supports').map(x=>x.to).sort();
   ok(want.length>0&&J(got)===J(want),'entry '+i+' supports the addresses the product shows for it, '+J(got)+' against '+J(want));});
  ok(G.edges.filter(e=>e.from.indexOf('story:')===0).every(e=>e.src==='inferred'&&e.edge==='supports'),
   'a reading is inferred and supports; it never causes');
  ok(G.edges.some(e=>e.from.indexOf('story:')===0&&e.named===true)&&G.edges.some(e=>e.from.indexOf('story:')===0&&e.named===false),
   'whether the words named it is carried beside the provenance, both kinds present');
  ok(G.nodes.filter(n=>n.type==='story').every(n=>n.src==='known'),'an entry on the record is known');
  const rel=G.nodes.find(n=>n.type==='release'&&n.id==='53:Llimit');
  ok(rel&&rel.lines===2,'two lines opened down one channel at one address is one release of two lines');
  ok(G.nodes.some(n=>n.type==='reframe'&&n.id==='53:Ltruth'),'a truth channel is a reframe');
  ok(G.edges.filter(e=>/^(release|reframe):/.test(e.from)).every(e=>e.edge==='addresses'&&e.src==='observed'),
   'a line run is observed, and addresses its pattern');
  ok(G.gaps.some(x=>x.kind==='unreadable_key'&&x.key==='999:Llimit:0'),'a key naming no address is a gap, not dropped');
  const rids=T.traceRitualIds(P);
  const pe=k=>G.nodes.find(n=>n.type==='practice_event'&&n.id===k);
  ok(pe(rids[0])&&pe(rids[0]).src==='observed','a ritual marked done produced an observed practice event');
  ok(!pe(rids[1]),'a ritual planned and not done produced nothing');
  ok(pe(rids[2])&&pe(rids[2]).src==='inferred','a ritual saved before done existed is read as practised, and says it was inferred');
  const o=T.traceOrphans(G);
  ok(rids.every(k=>o.missing.some(m=>m.key==='ritual:'+k&&m.edges[0]==='executes')),
   'every saved ritual is reported executing no protocol, which is the record as it stands (21.J1)');
  ok(o.isolated.indexOf('ritual:'+rids[1])>=0,'the planned ritual is isolated');
  ok(G.restated.length===1&&G.restated[0].story==='story:'+sids[1]&&G.restated[0].lex===null,
   'an entry read before the lexicon stamp is named as re-read under today\'s');
  ok(J(G.unchecked)==='{}','nothing on this record is unchecked');
 }

 g('TG12 · same record, same graph, whatever is loaded');
 {
  const P=worked(E); if(!P)return;
  const A=P.story.entries[0].text;
  /* THE KNOWN BAD CASE FIRST. Read under whatever soul is loaded, Angela's
     own sentence lands somewhere else. If this ever stops being true the
     check below proves nothing, and this says so. */
  E.loadProfile(soulOf(E,'Sofia'));
  const underSofia=E.parseStory(A).imprints.map(x=>x.node).sort().join();
  E.loadProfile(JSON.parse(J(P)));
  const underOwn=E.parseStory(A).imprints.map(x=>x.node).sort().join();
  ok(underSofia!==underOwn,'the hazard is real: the sentence reads '+underOwn+' under her soul and '+underSofia+' under Sofia\'s');
  const W0=J(E.W.map(n=>n.susc)), S0=J([E.S.doms,E.S.arcs,E.S.roots]);
  const g1=J(T.traceFromRecord(P));
  ok(J(E.W.map(n=>n.susc))===W0&&J([E.S.doms,E.S.arcs,E.S.roots])===S0,'deriving leaves the loaded state exactly as it was');
  E.loadProfile(soulOf(E,'Sofia'));
  const g2=J(T.traceFromRecord(P));
  E.loadProfile(soulOf(E,'Marcus'));
  const g3=J(T.traceFromRecord(JSON.parse(J(P))));
  ok(g1===g2&&g2===g3,'the same record gives the same graph with Angela, Sofia or Marcus loaded');
  ok(J(T.traceFromRecord(P))===g3,'and the same graph twice running');
 }

 g('TG13 · the stored layer over the derived one');
 {
  const P=worked(E); if(!P)return;
  const sid='story:'+T.traceStoryIds(P)[0];
  const r=T.traceApply(P.trace,[
   {from:{type:'story',id:T.traceStoryIds(P)[0]},to:{type:'pattern',id:53},edge:'supports',src:'user_confirmed'},
   {from:{type:'protocol',id:'pr1'},to:{type:'pattern',id:53},edge:'targets',src:'proposed'},
   {from:{type:'protocol',id:'pr1'},to:{type:'release',id:'60:Llimit'},edge:'requires',src:'proposed'},
   {from:{type:'story',id:'2020-01-01T00:00:00.000Z'},to:{type:'pattern',id:53},edge:'supports',src:'user_confirmed'}],
   '2026-10-01T09:00:00.000Z');
  ok(r.added===4&&r.refused.length===0,'four stored relations, got '+J(r));
  const v=E.validateProfile(JSON.parse(J(P)));
  ok(v.ok,'the record with its layer passes the boundary, '+J(v.errs));
  const G=T.traceFromRecord(v.profile);
  ok(G.refused.length===0,'nothing refused in the merge, '+J(G.refused));
  const conf=G.edges.find(e=>e.from===sid&&e.to==='pattern:53');
  ok(conf&&conf.src==='user_confirmed'&&conf.was==='inferred'&&conf.derived===true,
   'the person confirming a reading makes it theirs and keeps that it was inferred, got '+J(conf));
  ok(G.edges.find(e=>e.from==='protocol:pr1'&&e.edge==='targets').src==='proposed','a proposal over the record stays a proposal');
  const rel=G.nodes.find(n=>n.type==='release'&&n.id==='60:Llimit');
  ok(rel&&rel.lines===0&&G.edges.some(e=>e.from==='release:60:Llimit'&&e.edge==='targets'&&e.to==='pattern:60'&&e.src==='known')
   &&!G.edges.some(e=>e.from==='release:60:Llimit'&&e.edge==='addresses'),
   'a release nothing has run targets its address and does not address it');
  const o=T.traceOrphans(G);
  ok(o.dangling.some(d=>d.key==='story:2020-01-01T00:00:00.000Z'),'a stored story the record does not hold is dangling, got '+J(o.dangling));
  ok(o.unchecked.protocol===1,'the protocol is counted as unchecked: the record cannot say it exists');
  ok(T.tracePath(G,'protocol:pr1',sid,{undirected:true})!==null,'the protocol reaches the story through the pattern');
  ok(T.tracePath(G,'protocol:pr1',sid,{undirected:true,src:['known','user_confirmed','observed']})===null,
   'but not by a confirmed chain, because its own link is a proposal');
  const before=J(v.profile.trace);
  const R=T.traceFromRecord(v.profile,[{from:{type:'protocol',id:'pr1'},to:{type:'behavior',id:'b1'},edge:'implements',src:'proposed'},
   {from:{type:'pattern',id:53},to:{type:'protocol',id:'pr1'},edge:'targets',src:'proposed'}]);
  ok(R.edges.some(e=>e.from==='protocol:pr1'&&e.edge==='implements'),'an intent handed in at read time is in the graph');
  ok(R.refused.some(x=>x.intent&&has(x,'no rule lets')),'and a bad one is reported on the graph');
  ok(J(v.profile.trace)===before,'and none of it was written to the record');
 }

 g('TG13b · the mirror card\'s Yes is the person confirming the reading');
 {
  /* ob.yes is written by ui/onboard.js and checked by vEntryOb. Before 3
     October nothing read it, so every Yes reached loopRead as unanswered. */
  const P=worked(E); if(!P)return;
  const ids=T.traceStoryIds(P), sid='story:'+ids[1];
  const base=T.traceFromRecord(JSON.parse(J(P)));
  const read=base.edges.filter(e=>e.from===sid&&e.edge==='supports').map(e=>+e.to.split(':')[1]);
  ok(read.length>=2,'the second entry reads at two or more addresses, got '+J(read));
  const far=E.NODES.find(n=>n.cf&&read.indexOf(n.i)<0&&n.b==='Crown').i;
  P.story.entries[1].ob={pick:null,feel:null,place:null,yes:[read[0],far],no:[read[1]]};
  const v=E.validateProfile(JSON.parse(J(P)));
  ok(v.ok,'an entry carrying the mirror\'s answers passes the boundary, '+J(v.errs));
  const G=T.traceFromRecord(v.profile);
  ok(G.refused.length===0,'nothing refused reading the answers, '+J(G.refused));
  const y=G.edges.find(e=>e.from===sid&&e.to==='pattern:'+read[0]);
  ok(y&&y.src==='user_confirmed'&&y.was==='inferred'&&y.yes===true,
   'a Yes on an address the reading made confirms that edge and keeps that it was inferred, got '+J(y));
  const f=G.edges.find(e=>e.from===sid&&e.to==='pattern:'+far);
  ok(f&&f.src==='user_confirmed'&&f.was===undefined,
   'a Yes on an address today\'s reading no longer reaches is still held as the person\'s, with nothing it was before, got '+J(f));
  const n=G.edges.find(e=>e.from===sid&&e.to==='pattern:'+read[1]);
  ok(n&&n.src==='inferred','a Not me changes nothing in the graph: it has no provenance for a refusal, got '+J(n));
  ok(G.alg===2,'and the graph says it was read under the rule that reads the Yes');
  if(typeof E.loopRead==='function'){
   const L=E.loopRead(Object.assign({},v.profile,{practice:null}));
   const row=k=>L.patterns.find(x=>x.key==='pattern:'+k);
   ok(row(read[0])&&row(read[0]).state==='confirmed','the loop read reports the Yes as confirmed');
   ok(row(read[1])&&row(read[1]).state==='unanswered','and the Not me as unanswered, not confirmed');}
 }

 g('TG14 · privacy, and nothing thrown');
 {
  ok(E.OB_KEYS.indexOf('trace')<0,'the outbox has no key a graph could ride out on');
  const fns=['traceAddNode','traceAddEdge','traceRemoveEdge','traceNeighbors','tracePath','traceOrphans','traceCycles','validateTrace','traceApply','traceFromRecord'];
  const junk=[undefined,null,0,'x',[],{},{nodes:5,edges:'e'},{nodes:[null],edges:[null]}];
  fns.forEach(f=>{let threw=null;
   junk.forEach(a=>junk.forEach(b=>{try{T[f](a,b,a,b,a);}catch(e){threw=threw||(f+'('+J(a)+','+J(b)+'): '+e.message);}}));
   ok(!threw,f+' never throws on bad input'+(threw?': '+threw:''));});
 }
}

/* ============================================================
   THE BITES. Each of these is a plausible way to get this file wrong, and
   the suite must fail on every one.
   ============================================================ */
function mutants(E){
 const X=Object.assign({},E);
 const keyOf=r=>typeof r==='string'?r:(r&&r.type+':'+r.id);
 return [
  ['the rule table is skipped', Object.assign({},X,{traceAddEdge:function(g,f,e,t,s,o){
    const r=E.traceAddEdge(g,f,e,t,s,o);
    if(!r.ok&&/no rule/.test(r.why)){g.edges.push({from:keyOf(f),to:keyOf(t),edge:e,src:s}); return {ok:true,added:true};}
    return r;}})],
  ['any provenance is taken', Object.assign({},X,{traceAddEdge:function(g,f,e,t,s,o){
    const r=E.traceAddEdge(g,f,e,t,s,o);
    if(!r.ok&&/provenance|causation/.test(r.why)){g.edges.push({from:keyOf(f),to:keyOf(t),edge:e,src:s}); return {ok:true,added:true};}
    return r;}})],
  ['provenance is collapsed to known', Object.assign({},X,{traceFromRecord:function(p,i){
    const g=E.traceFromRecord(p,i); g.edges.forEach(e=>{e.src='known';}); return g;}})],
  ['a missing node is made silently', Object.assign({},X,{traceAddEdge:function(g,f,e,t,s,o){
    [f,t].forEach(k=>{const kk=keyOf(k); if(kk&&!g.nodes.some(n=>n.type+':'+n.id===kk)){
     const i=kk.indexOf(':'); g.nodes.push({type:kk.slice(0,i),id:kk.slice(i+1),src:s});}});
    return E.traceAddEdge(g,f,e,t,s,o);}})],
  ['gaps are hidden', Object.assign({},X,{traceOrphans:function(){return {isolated:[],missing:[],dangling:[],gaps:[],unchecked:{}};}})],
  ['loops are not checked', Object.assign({},X,{
    traceAddEdge:function(g,f,e,t,s,o){const r=E.traceAddEdge(g,f,e,t,s,o);
     if(!r.ok&&/does not loop/.test(r.why)){g.edges.push({from:keyOf(f),to:keyOf(t),edge:e,src:s}); return {ok:true,added:true};}
     return r;},
    traceCycles:function(){return {illegal:[],loops:[]};}})],
  ['the boundary takes anything', Object.assign({},X,{validateTrace:function(o){
    return {ok:true,errs:[],trace:(o&&typeof o==='object')?o:E.traceNew()};}})],
  ['refused intents are dropped', Object.assign({},X,{traceApply:function(g,i,n){
    const r=E.traceApply(g,i,n); r.refused=[]; return r;}})],
  ['the reading follows whatever is loaded', Object.assign({},X,{traceFromRecord:function(p,i){
    const q=JSON.parse(JSON.stringify(p));
    q.soul={doms:E.S.doms.slice(),arcs:E.S.arcs.slice(),roots:E.S.roots.slice()};
    return E.traceFromRecord(q,i);}})],
  ['the mirror card\'s Yes is ignored', Object.assign({},X,{traceFromRecord:function(p,i){
    const q=JSON.parse(JSON.stringify(p)); ((q.story&&q.story.entries)||[]).forEach(e=>{if(e)delete e.ob;});
    return E.traceFromRecord(q,i);}})],
  ['planned rituals count as done', Object.assign({},X,{traceFromRecord:function(p,i){
    const q=JSON.parse(JSON.stringify(p)); (q.rituals||[]).forEach(r=>{if(r&&r.done===false)r.done=true;});
    return E.traceFromRecord(q,i);}})]];}

function run(E,ok,g){
 /* the known good case first */
 let F0=0;
 const okReal=(c,m)=>{if(!c)F0++; ok(c,m);};
 suite(E,E,okReal,g);
 /* then every broken build, quietly, counting what it fails */
 g('TG15 · the gate bites: each broken build fails it');
 mutants(E).forEach(([nm,M])=>{
  let f=0;
  try{suite(M,E,(c)=>{if(!c)f++;},()=>{});}catch(e){f++;}
  ok(f>0,'a build where '+nm+' fails '+f+' check'+(f===1?'':'s'));});
 /* leave the engine holding nothing of the worked record */
 E.loadProfile(E.blankProfile('after the trace gate'));
 return F0;}

module.exports=run;
if(require.main===module){
 const E=require(path.resolve(process.env.ENGINE||'engine.js'));
 let P=0,F=0;
 const ok=(c,m)=>{if(c)P++; else{F++; console.log('  FAIL  '+m);}};
 run(E,ok,n=>console.log('\n'+n));
 console.log('\n===== '+P+' passed, '+F+' failed =====');
 process.exit(F?1:0);}
