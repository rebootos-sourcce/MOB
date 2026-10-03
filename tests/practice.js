/* Practice gate. engine/practice.js, the P0 domain of
   ATUNED-practice-ritual-accountability-trace-graph-TDD.md.

   Run from tests/engine.js by one line, with that file's own ok() and g(),
   or on its own: node tests/practice.js. Headless, from the repo root.

   EVERY SUITE IS A FUNCTION OF AN ENGINE, so the same assertions run twice:
   against the real engine, where every one must pass, and against copies of
   engine.js with one rule deliberately broken, where the suite that guards
   that rule must fail. A gate that cannot fail is not a gate. The copy is
   loaded through the same vm loader as an unbroken copy first, which is
   the known good case for the loader itself.

   THE ENUMS ARE READ OFF THE TDD, not typed here. A list typed twice is two
   lists that drift, and the document is the specification. The extractor
   is checked against a case it must find before anything is compared. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const ROOT=process.cwd();
const TDD_FILE=path.resolve(ROOT,'ATUNED-practice-ritual-accountability-trace-graph-TDD.md');
const ENGINE_FILE=path.resolve(ROOT,process.env.ENGINE||'engine.js');
const T0='2026-10-01T09:00:00.000Z';
const DAY=86400000;
const at=(d)=>new Date(Date.parse(T0)+d*DAY).toISOString();
const J=(x)=>JSON.stringify(x);
const clone=(x)=>JSON.parse(JSON.stringify(x));

/* ---------------- the TDD, read ---------------- */
const TDD=fs.existsSync(TDD_FILE)?fs.readFileSync(TDD_FILE,'utf8'):'';
function sec(n){
 const m=new RegExp('^# '+n+'\\. .*$','m').exec(TDD); if(!m)return '';
 const rest=TDD.slice(m.index+m[0].length), nx=/^# \d+\. /m.exec(rest);
 return nx?rest.slice(0,nx.index):rest;}
function enumOf(n,field){
 const m=new RegExp('^\\s*'+field+':\\s*\\n\\s*type: enum\\s*\\n\\s*values:\\s*\\n((?:[ \\t]*- .*\\n)+)','m').exec(sec(n));
 return m?m[1].split('\n').map(l=>l.trim().replace(/^- /,'')).filter(Boolean):null;}
function blocks(n){
 const out=[], re=/```text\n([\s\S]*?)```/g, s=sec(n); let m;
 while((m=re.exec(s)))out.push(m[1].split('\n').map(l=>l.trim()).filter(Boolean));
 return out;}

/* ---------------- a world to test in ----------------
   TDD section 18's own worked example, conscious communication, built
   through the one door. Every id is fixed so the intents can be compared
   exactly. */
function door(E,ok){
 let P=E.practiceBlank();
 const go=(act,a,t,want)=>{
  const r=E.practiceDo(P,act,a,t||T0);
  if(want===false){ok(!r.ok,act+' is refused: '+J(a).slice(0,80)); return r;}
  ok(r.ok,act+' is accepted'+(r.ok?'':': '+(r.errs||[]).slice(0,3).join(' | ')));
  if(r.ok)P=r.P; return r;};
 return {go:go, get P(){return P;}, set P(x){P=x;}};}
function pat(E){return 'addr:'+E.NODES.find(n=>n.cf).i;}
function world(E,ok){
 const d=door(E,ok), A=pat(E);
 d.go('goal_create',{id:'g1',title:'Communicate more consciously',
  desired_outcome:{description:'Say what I mean without over explaining',measurable:false}});
 d.go('behavior_define',{id:'b1',goal_id:'g1',behavior:'Speak less, listen more',priority:1,
  quality_dimensions:{awareness:true,presence:true,integrity:false,consistency:true}});
 d.go('protocol_add',{id:'p1',class:'release',objective_id:'b1',target_patterns:[A],
  steps:[{type:'release',instruction:'Release the need to fill silence'},
   {type:'reframe',instruction:'I know I can speak clearly without over explaining.'},
   {type:'behavior',instruction:'Speak 50% of normal words.',duration:{value:2,unit:'hours'}}],
  generated_by:{system:'practice-test',model_version:'0'}});
 d.go('protocol_accept',{id:'p1'});
 d.go('ritual_create',{id:'r1',protocol_id:'p1',title:'Conscious communication',tags:['Throat']});
 d.go('event_schedule',{id:'pe1',ritual_id:'r1',scheduled_at:T0});
 d.go('event_move',{id:'pe1',to:'available'});
 d.go('event_move',{id:'pe1',to:'started'});
 d.go('event_move',{id:'pe1',to:'completed',duration_seconds:7200,quality:{presence:7,effort:8}});
 d.go('evidence_record',{id:'e1',source:'user',type:'behavioral',dimension:'effect',metric:'words spoken',
  before:100,after:55,unit:'percent',pattern_id:A,practice_event_id:'pe1'});
 d.go('outcome_record',{id:'o1',goal_id:'g1',metric:'communication awareness',status:'improved',
  evidence_ids:['e1'],practice_event_id:'pe1'});
 return d;}

/* ============================================================
   THE SUITES
   ============================================================ */
const SUITES={};

SUITES.schema=function(E,ok){
 /* the extractor, checked on a case it must find, before it is trusted */
 const g4=enumOf(4,'status');
 ok(Array.isArray(g4)&&g4.length===4,'the TDD extractor finds section 4\'s four goal statuses, got '+J(g4));
 const same=(a,b,what)=>ok(Array.isArray(b)&&b.length>0&&J(a)===J(b),what+' is exactly the TDD\'s list: '+J(a)+' vs '+J(b));
 same(E.PR_LIFE,g4,'goal status');
 same(E.PR_LIFE,enumOf(5,'status'),'behavior objective status');
 same(E.PR_CLASS,enumOf(6,'class'),'protocol class');
 same(E.PR_CLASS,(blocks(6)[0]||[]),'protocol class, section 6\'s own list');
 same(E.PR_STEP,enumOf(7,'type'),'protocol step type');
 same(E.PR_EV_ST,enumOf(10,'status'),'practice event status');
 same(E.PR_EVID_SOURCE,enumOf(12,'source'),'evidence source');
 same(E.PR_EVID_TYPE,enumOf(12,'type'),'evidence type');
 same(E.PR_OUT_ST,enumOf(14,'status'),'outcome status');
 same(E.PR_NODE,(blocks(16)[0]||[]),'graph node types');
 same(E.PR_EDGE,(blocks(17)[0]||[]),'graph edge types');
 same(E.PR_MISS,(blocks(24)[1]||[]),'miss classifications');
 same(E.PR_ADAPT,(blocks(24)[2]||[]),'adaptations');
 same(E.PR_SRC,(blocks(26)[0]||[]),'provenance');
 same(E.PR_EVENTS,(blocks(30)[0]||[]),'the event vocabulary');

 /* a blank, and an older record */
 const b=E.blankProfile('x');
 ok(b.practice&&b.practice.v===E.PRACTICE_SCHEMA_V&&['goals','behavior_objectives','protocols','protocol_steps',
  'rituals','practice_events','evidence','outcomes','log'].every(k=>Array.isArray(b.practice[k])&&!b.practice[k].length),
  'a new profile carries an empty practice object at the practice schema version');
 const old=clone(E.saveProfile(E.blankProfile('old'))); delete old.practice; old.v=1;
 const vo=E.validateProfile(old);
 ok(vo.ok&&J(vo.profile.practice)===J(E.practiceBlank()),'a v1 record with no practice loads with the blank filled in');
 const on=clone(old); on.practice=null;
 ok(E.validateProfile(on).ok,'a record with practice null is an older record, not an error');

 /* every required field, removed one at a time, is refused by name */
 const W=world(E,()=>{}).P;
 const kinds={goals:'goals',behavior_objectives:'behavior_objectives',protocols:'protocols',
  protocol_steps:'protocol_steps',rituals:'rituals',practice_events:'practice_events',evidence:'evidence',outcomes:'outcomes'};
 Object.keys(kinds).forEach(L=>{
  const spec=E.PR_SPEC[L]; const req=Object.keys(spec).filter(k=>spec[k].req);
  ok(req.length>0,L+' has required fields');
  req.forEach(k=>{
   const Q=clone(W); delete Q[L][0][k];
   const errs=[]; E.practiceValidate(errs,Q,'practice');
   ok(errs.some(e=>e.indexOf('practice.'+L+'[0].'+k+' is missing')===0),
    L+'.'+k+' missing is refused by name, got '+J(errs.slice(0,2)));});});
 /* enums */
 const bad=(mut,frag,what)=>{const Q=clone(W); mut(Q); const errs=[]; E.practiceValidate(errs,Q,'practice');
  ok(errs.join(' | ').indexOf(frag)>=0,what+' is refused by name: '+J(errs.slice(0,2)));};
 bad(Q=>{Q.goals[0].status='done';},'practice.goals[0].status is not one of','a goal status that is not one of four');
 bad(Q=>{Q.protocols[0].class='therapy';},'practice.protocols[0].class is not one of','a protocol class not on the list');
 bad(Q=>{Q.protocol_steps[0].type='prayer';},'practice.protocol_steps[0].type is not one of','a step type not on the list');
 bad(Q=>{Q.practice_events[0].status='verified';},'practice.practice_events[0].status is not one of','verified, which is a stage and not a status');
 bad(Q=>{Q.evidence[0].dimension='mood';},'practice.evidence[0].dimension is not one of','a dimension that is not effect or affect');
 bad(Q=>{Q.rituals[0].tags=['Spleen'];},'practice.rituals[0].tags[0] is not a seat','a free text tag (TG4)');
 bad(Q=>{Q.rituals[0].days=['mon','mon'];},'names "mon" twice','a weekday twice');
 /* references */
 bad(Q=>{Q.behavior_objectives[0].goal_id='g9';},'goal_id names no goal: g9','a behavior on no goal');
 bad(Q=>{Q.rituals[0].protocol_id='p9';},'protocol_id names no protocol: p9','a ritual on no protocol');
 bad(Q=>{Q.practice_events[0].protocol_version=9;},'version 9, which does not exist','an event on a version that never existed');
 bad(Q=>{Q.outcomes[0].evidence_ids=['e9'];},'names no evidence: e9','an outcome citing no evidence');
 bad(Q=>{Q.protocol_steps[0].protocol_id='p9';},'protocol_id names no protocol: p9','a step of no protocol');
 bad(Q=>{Q.protocols[0].target_patterns.pattern_ids=['addr:99999'];},'names no pattern','an address not in the node table');
 bad(Q=>{Q.protocol_steps[2].practice='levitation';},'names no practice in the library','a step naming no practice');
 bad(Q=>{Q.log[0].ref.id='g9';},'ref names no goal: g9','a log entry about nothing');
 /* malformed */
 bad(Q=>{Q.goals[0].title='x'.repeat(201);},'is 201 characters and the cap is 200','a title over its cap, refused and not cut');
 bad(Q=>{Q.goals[0].mood='calm';},'practice.goals[0] may not carry mood','a key nobody declared');
 bad(Q=>{Q.v=2;},'not a practice schema this build reads','a newer practice schema');
 bad(Q=>{Q.goals[0].schema_version=2;},'schema_version is 2, outside 1 to 1','an object at a newer schema version');
 bad(Q=>{Q.goals='g1';},'practice.goals is not a list','a list that is not a list');
 bad(Q=>{Q.goals=Array(E.PR_CAP.goals+1).fill(null);},'more than '+E.PR_CAP.goals,'a list over its cap');
 bad(Q=>{Q.practice_events[0].execution.steps_completed=2;},'is completed with 2 of 3 steps, which is partial','completed with steps missing');
 /* every cross check and every field kind, each driven to its refusal.
    Coverage found these branches unexecuted, and an unexecuted refusal is
    a boundary nobody has seen hold. */
 [[Q=>{Q.goals.push(clone(Q.goals[0]));},'repeats the id g1','a goal id twice'],
  [Q=>{Q.protocols[0].version=2;},'has version 2 and no version 1','a version with no version before it'],
  [Q=>{Q.log[1].seq=5;},'.seq is 5, and the log is numbered from 1 with no gap','a gap in the log'],
  [Q=>{Q.practice_events[0].completed_at=null;},'is completed with no completed_at','completed with no moment'],
  [Q=>{const e=Q.practice_events[0]; e.status='partial'; e.completed_at=null;},'is partial with 3 of 3 steps','partial with every step'],
  [Q=>{const e=Q.practice_events[0]; e.status='started'; e.completed_at=null; e.started_at=null;},'is started with no started_at','started with no start'],
  [Q=>{const e=Q.practice_events[0]; e.status='missed'; e.completed_at=null;},'is missed and carries a started_at','missed and yet started'],
  [Q=>{Q.practice_events[0].status='skipped';},'is skipped and carries a completed_at','skipped and yet completed'],
  [Q=>{Q.practice_events[0].execution.steps_completed=4;},'has 4 steps completed of 3 expected','more steps done than there are'],
  [Q=>{Q.rituals[0].cadence.type='selected_days';},'days is empty and the cadence is selected days','selected days and no day'],
  [Q=>{Q.practice_events[0].ritual_id='r9';},'ritual_id names no ritual: r9','an event on no ritual'],
  [Q=>{Q.practice_events[0].protocol_id='p9';},'protocol_id is p9 and its ritual runs p1','an event on another protocol than its ritual\'s'],
  [Q=>{Q.practice_events[0].outcome_id='o9';},'outcome_id names no outcome: o9','an event measured by nothing'],
  [Q=>{Q.practice_events[0].evidence_ids=['e9'];},'evidence_ids[0] names no evidence: e9','an event citing no evidence'],
  [Q=>{Q.evidence[0].protocol_id='p9';},'evidence[0].protocol_id names no protocol: p9','evidence on no protocol'],
  [Q=>{Q.evidence[0].ritual_id='r9';},'evidence[0].ritual_id names no ritual: r9','evidence on no ritual'],
  [Q=>{Q.evidence[0].goal_id='g9';},'evidence[0].goal_id names no goal: g9','evidence on no goal'],
  [Q=>{Q.outcomes[0].goal_id='g9';},'outcomes[0].goal_id names no goal: g9','an outcome of no goal'],
  [Q=>{Q.protocols[0].objective_id='b9';},'objective_id names no behavior objective: b9','a protocol for no behavior'],
  [Q=>{Q.protocols[0].steps.step_ids.push('ps9');},'names no step: ps9','a protocol naming no step'],
  [Q=>{Q.log[3].ref={type:'pattern',id:'addr:99999',version:null};},'ref names no pattern','a log entry about no pattern'],
  [Q=>{Q.log[2].ref.version=9;},'ref names no protocol p1 version 9','a log entry about no version'],
  [Q=>{Q.goals[0].id='has space';},'is not an id','an id with a space in it'],
  [Q=>{Q.behavior_objectives[0].priority='high';},'priority is not a number','a priority that is a word'],
  [Q=>{Q.behavior_objectives[0].priority=-1;},'priority is -1, outside 0 to','a negative priority, refused and not clamped'],
  [Q=>{Q.protocols[0].version=1.5;},'is 1.5, not a whole number','a version that is a fraction'],
  [Q=>{Q.rituals[0].active='yes';},'active is not true or false','a switch that is a word'],
  [Q=>{Q.evidence[0].value={};},'is not a number, a short string or null','a value that is an object'],
  [Q=>{Q.evidence[0].value='x'.repeat(201);},'is 201 characters and the cap is 200','a value string over its cap'],
  [Q=>{Q.goals[0].conditions.people='Sam';},'people is not a list','a list that is a name'],
  [Q=>{Q.goals[0].conditions.people=Array(51).fill('Sam');},'holds 51, more than 50','a list over its cap'],
  [Q=>{Q.goals[0].desired_outcome='more';},'desired_outcome is not an object','an object that is a word'],
  [Q=>{Q.goals[0].title='   ';},'title is empty','a title of spaces'],
  [Q=>{Q.goals[0].start_at='soon';},'start_at is not a date','a date that is a word'],
  [Q=>{Q.log='x';},'practice.log is not a list','a log that is not a list'],
  [Q=>{Q.log=Array(E.PR_CAP.log+1).fill(null);},'practice.log holds','a log over its cap'],
  [Q=>{Q.log[0]=null;},'practice.log[0] is not an object','a log entry that is nothing'],
  [Q=>{Q.goals[0]=7;},'practice.goals[0] is not an object','a goal that is a number'],
  [Q=>{Q.extra=[];},'practice may not carry extra','a list nobody declared']
 ].forEach(c=>bad(c[0],c[1],c[2]));
 ok(E.practicePatternOk('fetter:Fear')&&!E.practicePatternOk('fetter:Joy')&&!E.practicePatternOk(7),
  'a pattern is an address or one of the nine fetters, and Joy is neither');
 const errsNot=[]; E.practiceValidate(errsNot,[],'practice');
 ok(errsNot[0]==='practice is not an object','a practice that is a list is refused');
 /* never a payment, account or session field, on any of the eight, by name */
 Object.keys(kinds).forEach(L=>{
  E.PR_NEVER.forEach(k=>{
   const Q=clone(W); Q[L][0][k]='x';
   const errs=[]; E.practiceValidate(errs,Q,'practice');
   ok(errs.some(e=>e.indexOf('practice.'+L+'[0] may not carry '+k+': ')===0),L+' refuses '+k+' by name');});});
 ok(E.PR_NEVER.indexOf('user_id')>=0,'user_id, the TDD\'s own field, is refused (the privacy ruling)');
 /* the outbox's deny list meets every practice key set at one name only,
    type, which the TDD itself uses for a step and for evidence */
 const allKeys={}; Object.keys(E.PR_SPEC).forEach(L=>Object.keys(E.PR_SPEC[L]).forEach(k=>{allKeys[k]=1;}));
 const meet=E.OB_NEVER.filter(k=>allKeys[k]);
 ok(J(meet)===J(['type']),'the outbox deny list meets the practice keys only at type, got '+J(meet));
 E.OB_NEVER.filter(k=>k!=='type').forEach(k=>{
  const Q=clone(W); Q.goals[0][k]='x'; const errs=[]; E.practiceValidate(errs,Q,'practice');
  ok(errs.some(e=>e.indexOf('may not carry '+k)>=0),'a goal refuses the outbox\'s '+k);});
 /* the door refuses an argument it does not take, rather than ignoring it */
 const r=E.practiceDo(E.practiceBlank(),'goal_create',{title:'x',titel:'y'},T0);
 ok(!r.ok&&r.errs[0]==='goal_create does not take titel','a misspelt argument is refused by name');
 const r2=E.practiceDo(E.practiceBlank(),'goal_create',{title:'x',user_id:'u1'},T0);
 ok(!r2.ok,'an account id is not taken as an argument either');
};

SUITES.state=function(E,ok){
 /* section 25, read as the table it draws, plus the moves this build
    decided where the diagram is silent, named */
 const diagram=[['scheduled','available'],['available','started'],['started','interrupted'],
  ['started','partial'],['started','completed'],['scheduled','missed']];
 const decided=[['scheduled','skipped'],['available','skipped'],['available','missed'],
  ['interrupted','started'],['interrupted','partial']];
 const legal={}; diagram.concat(decided).forEach(p=>{legal[p[0]+'>'+p[1]]=1;});
 let nLegal=0,nIllegal=0;
 E.PR_EV_ST.forEach(a=>E.PR_EV_ST.forEach(b=>{
  const r=E.practiceTransition(a,b);
  if(legal[a+'>'+b]){nLegal++; ok(r.ok,a+' to '+b+' is legal');}
  else {nIllegal++; ok(!r.ok&&r.err.indexOf(a)>=0&&r.err.indexOf(b)>=0,a+' to '+b+' is refused by name: '+r.err);}}));
 ok(nLegal===diagram.length+decided.length,'every legal move is one the diagram draws or this build named, '+nLegal);
 ok(['partial','completed','skipped','missed'].every(s=>!E.PR_FLOW[s].length),'the four end states go nowhere');
 ok(!E.practiceTransition('done','started').ok,'a status that does not exist is refused');

 /* through the door, section 39's state list: create, start, pause,
    resume, complete, skip, miss, adapt, complete, abandon */
 const d=world(E,ok);
 const logBefore=clone(d.P.log);
 d.go('event_schedule',{id:'pe2',ritual_id:'r1',scheduled_at:at(1)});
 d.go('event_move',{id:'pe2',to:'started'},T0,false);                 /* not available yet */
 d.go('event_move',{id:'pe2',to:'available'},at(1));
 d.go('event_move',{id:'pe2',to:'started'},at(1));
 const st=d.P.practice_events.find(x=>x.id==='pe2').started_at;
 d.go('event_move',{id:'pe2',to:'interrupted'},at(1));               /* pause */
 d.go('event_move',{id:'pe2',to:'started'},at(1.1));                 /* resume */
 ok(d.P.practice_events.find(x=>x.id==='pe2').started_at===st,'a resumed practice keeps the moment it first started');
 d.go('event_move',{id:'pe2',to:'completed',steps_completed:1},at(1.2),false);
 d.go('event_move',{id:'pe2',to:'partial',steps_completed:1},at(1.2));
 ok(d.P.practice_events.find(x=>x.id==='pe2').completed_at===null,'a partial practice carries no completed_at');
 d.go('event_move',{id:'pe2',to:'started'},at(1.3),false);            /* partial is an end */
 d.go('event_schedule',{id:'pe3',ritual_id:'r1',scheduled_at:at(2)});
 d.go('event_move',{id:'pe3',to:'skipped'},at(2));                     /* skip */
 d.go('event_schedule',{id:'pe4',ritual_id:'r1',scheduled_at:at(3)});
 d.go('event_move',{id:'pe4',to:'missed'},at(4),false);               /* still markable */
 d.go('event_move',{id:'pe4',to:'missed'},at(5));                      /* miss */
 d.go('event_move',{id:'pe4',to:'completed'},at(5),false);            /* the record is not rewritten */
 d.go('event_move',{id:'pe9',to:'started'},at(5),false);              /* nothing */
 d.go('adapt',{ritual_id:'r1',classification:'wrong_time',adaptation:'reschedule'},at(5));
 d.go('ritual_reschedule',{id:'r1',set:{cadence:{type:'selected_days'},days:['mon','wed','fri']}},at(5));
 d.go('ritual_pause',{id:'r1'},at(5));
 d.go('event_schedule',{id:'pe5',ritual_id:'r1',scheduled_at:at(6)},at(6),false);
 d.go('ritual_resume',{id:'r1'},at(6));
 d.go('event_schedule',{id:'pe5',ritual_id:'r1',scheduled_at:at(6)},at(6));
 d.go('event_move',{id:'pe5',to:'available'},at(6));
 d.go('event_move',{id:'pe5',to:'started'},at(6));
 d.go('event_move',{id:'pe5',to:'completed'},at(6));                   /* complete */
 d.go('goal_status',{id:'g1',to:'paused'},at(7));
 d.go('goal_status',{id:'g1',to:'active'},at(8));
 d.go('goal_status',{id:'g1',to:'abandoned'},at(9));                   /* abandon */
 d.go('goal_status',{id:'g1',to:'active'},at(10),false);
 d.go('behavior_update',{id:'b1',to:'completed'},at(9));
 d.go('behavior_update',{id:'b1',to:'paused'},at(10),false);
 d.go('ritual_end',{id:'r1'},at(10));
 const types=d.P.log.slice(logBefore.length).map(x=>x.type);
 ok(J(types)===J(['PRACTICE_STARTED','PRACTICE_INTERRUPTED','PRACTICE_STARTED','PRACTICE_PARTIAL','RITUAL_SKIPPED',
  'RITUAL_MISSED','PROTOCOL_ADAPTED','RITUAL_RESCHEDULED','RITUAL_PAUSED','RITUAL_STARTED','PRACTICE_STARTED',
  'PRACTICE_COMPLETED','GOAL_PAUSED','GOAL_UPDATED','GOAL_ABANDONED','BEHAVIOR_UPDATED','RITUAL_COMPLETED']),
  'every move emits its own event from section 30 and a refused move emits none, got '+J(types));
 ok(d.P.log.every((x,i)=>x.seq===i+1),'the log is numbered from 1 with no gap');
 ok(J(d.P.log.slice(0,logBefore.length))===J(logBefore),'the log only grows: what was on it is still on it, unchanged');
 ok(d.P.log.every(x=>E.PR_EVENTS.indexOf(x.type)>=0),'every event is in the vocabulary');
 ok(d.P.log.every(x=>x.data===null||Object.keys(x.data).every(k=>['from','to','classification','adaptation','version'].indexOf(k)>=0)),
  'no free text rides on the log');
 const r=E.practiceDo(d.P,'event_move',{id:'pe5',to:'available'},at(11));
 ok(!r.ok&&r.P===d.P,'a refused move hands back the object it was given, untouched');
 /* the edits, and every action asked about something that is not there */
 const e=world(E,ok);
 e.go('goal_update',{id:'g1',set:{title:'Speak plainly',conditions:{people:['my manager']}}});
 ok(e.P.goals[0].title==='Speak plainly'&&J(e.P.goals[0].conditions.people)===J(['my manager'])
  &&J(e.P.goals[0].conditions.contexts)===J([]),'a goal edit changes what it names and keeps the rest');
 ok(e.P.log[e.P.log.length-1].type==='GOAL_UPDATED','and is logged as an update');
 e.go('goal_update',{id:'g1',set:{status:'completed'}},T0,false);
 e.go('behavior_update',{id:'b1',set:{priority:3,behavior:'Speak less'}});
 e.go('behavior_update',{id:'b1',set:{goal_id:'g9'}},T0,false);
 e.go('ritual_reschedule',{id:'r1',set:{protocol_id:'p9'}},T0,false);
 e.go('ritual_reschedule',{id:'r1',set:{timer:{enabled:true,duration_seconds:600}}});
 e.go('ritual_pause',{id:'r1'}); e.go('ritual_pause',{id:'r1'},T0,false);
 e.go('ritual_resume',{id:'r1'}); e.go('ritual_resume',{id:'r1'},T0,false);
 e.go('ritual_end',{id:'r1'},at(1));
 e.go('ritual_resume',{id:'r1'},at(3),false);
 e.go('ritual_resume',{id:'r1',set:{end_at:at(30)}},at(3));
 e.go('protocol_add',{id:'p1',class:'body',steps:[{type:'timer',instruction:'x'}]},T0,false);
 e.go('protocol_add',{id:'pX',class:'body',steps:['not a step']},T0,false);
 e.go('protocol_accept',{id:'p1'},T0,false);
 e.go('nonsense',{},T0,false);
 [['goal_update',{id:'g9',set:{}}],['goal_status',{id:'g9',to:'paused'}],['behavior_define',{goal_id:'g9',behavior:'x',priority:0}],
  ['behavior_update',{id:'b9'}],['confirm',{kind:'evidence',id:'e9'}],['protocol_accept',{id:'p9'}],
  ['protocol_reject',{id:'p9'}],['protocol_revise',{id:'p9'}],['ritual_create',{protocol_id:'p9',title:'x'}],
  ['ritual_pause',{id:'r9'}],['ritual_resume',{id:'r9'}],['ritual_reschedule',{id:'r9'}],['ritual_end',{id:'r9'}],
  ['event_schedule',{ritual_id:'r9'}],['event_move',{id:'pe9',to:'started'}],
  ['evidence_record',{source:'user',type:'internal',dimension:'affect',practice_event_id:'pe9'}],
  ['outcome_record',{goal_id:'g1',metric:'x',status:'unclear',practice_event_id:'pe9'}],
  ['adapt',{ritual_id:'r9',classification:'forgot',adaptation:'reschedule'}]].forEach(c=>{
  const r2=E.practiceDo(e.P,c[0],c[1],T0);
  ok(!r2.ok&&/(no |names no)/.test(r2.errs.join(' ')),c[0]+' on something that is not there is refused by name: '+(r2.errs||[]).join(' | ').slice(0,80));});
};

SUITES.miss=function(E,ok){
 const d=world(E,ok);
 [2,3,4].forEach((k,i)=>{
  d.go('event_schedule',{id:'m'+k,ritual_id:'r1',scheduled_at:at(k)});
  d.go('event_move',{id:'m'+k,to:'missed'},at(k+2));
  const m=E.practiceMissRead(d.P,'r1');
  ok(m.run===i+1,'the miss run is '+(i+1)+' after '+(i+1)+' misses, got '+m.run);
  ok(m.stage===(i+1>=E.PR_MISS_AT?'investigate':'missed'),'the stage at '+(i+1)+' is '+m.stage);
  ok(m.motivation===false,'a miss run is never read as motivation');});
 ok(E.PR_MISS_AT===3,'the threshold is section 24\'s three');
 d.go('event_schedule',{id:'s5',ritual_id:'r1',scheduled_at:at(5)});
 d.go('event_move',{id:'s5',to:'skipped'},at(5));
 ok(E.practiceMissRead(d.P,'r1').run===3,'a skip neither counts as a miss nor breaks the run');
 d.go('adapt',{ritual_id:'r1',classification:'motivation',adaptation:'pause'},at(6),false);
 d.go('adapt',{ritual_id:'r1',classification:'too_long',adaptation:'dance'},at(6),false);
 d.go('adapt',{ritual_id:'r1',classification:'too_long',adaptation:'pause'},at(6));
 ok(d.P.rituals.find(x=>x.id==='r1').active===false,'pausing, the person\'s choice, pauses the ritual');
 ok(E.practiceMissRead(d.P,'r1').stage==='adapt','after the person decides, the stage is adapt');
 const ad=d.P.log.filter(x=>x.type==='PROTOCOL_ADAPTED').pop();
 ok(ad&&ad.data.classification==='too_long'&&ad.data.adaptation==='pause'&&ad.src==='known',
  'the decision is on the log with the person\'s classification and choice');
 const v0=d.P.protocols.length;
 d.go('ritual_resume',{id:'r1'},at(6));
 d.go('adapt',{ritual_id:'r1',classification:'too_long',adaptation:'shorten'},at(6));
 ok(d.P.protocols.length===v0,'a decision to shorten records the decision and changes no protocol by itself');
 /* investigation */
 ['motivation','Lazy','willpower'].forEach(w=>{const r=E.practiceInvestigate(w);
  ok(!r.ok&&r.err.indexOf('motivation')>=0&&r.err.indexOf('rule 12')>=0,w+' is refused as a reading of a miss: '+r.err);});
 ok(!E.practiceInvestigate('bored').ok,'a word not on the list is refused');
 ok(E.PR_MISS.every(c=>!/motiv|lazy|will/i.test(c)),'no classification is a motivation reading');
 E.PR_MISS.forEach(c=>{const r=E.practiceInvestigate(c);
  ok(r.ok&&r.decided_by==='user'&&r.proposals.length>0&&r.proposals.every(p=>p.src==='proposed'&&E.PR_ADAPT.indexOf(p.adaptation)>=0),
   c+' proposes, and every proposal is proposed and the person decides');});
 const m2=world(E,ok);
 m2.go('event_schedule',{id:'x1',ritual_id:'r1',scheduled_at:at(1)});
 m2.go('event_move',{id:'x1',to:'missed'},at(3));
 m2.go('event_schedule',{id:'x2',ritual_id:'r1',scheduled_at:at(4)});
 m2.go('event_move',{id:'x2',to:'available'},at(4)); m2.go('event_move',{id:'x2',to:'started'},at(4));
 m2.go('event_move',{id:'x2',to:'completed'},at(4));
 ok(E.practiceMissRead(m2.P,'r1').run===0&&E.practiceMissRead(m2.P,'r1').stage===null,'a practice that happened ends the run');
};

SUITES.protocol=function(E,ok){
 const d=world(E,ok), A=pat(E);
 const p1v1=clone(d.P.protocols.find(x=>x.id==='p1'&&x.version===1));
 ok(p1v1.status==='accepted'&&p1v1.src==='user_confirmed'&&p1v1.approved_by.user===true,
  'a generated protocol, once accepted, is user_confirmed with the person\'s approval on it');
 ok(d.P.log[2].type==='PROTOCOL_GENERATED'&&d.P.log[2].src==='proposed','generating it was logged as proposed');
 /* reject */
 d.go('protocol_add',{id:'p2',class:'attention',target_patterns:[],steps:[{type:'timer',instruction:'Sit',duration:{value:5,unit:'min'}}],
  generated_by:{system:'practice-test',model_version:'0'}});
 d.go('protocol_reject',{id:'p2'});
 d.go('protocol_accept',{id:'p2'},T0,false);
 d.go('ritual_create',{id:'r2',protocol_id:'p2',title:'Sit'},T0,false);
 /* a person's edit is a new version, and the old one never moves */
 const keepEvent=clone(d.P.practice_events.find(x=>x.id==='pe1'));
 d.go('protocol_revise',{id:'p1',reason:'modify',set:{steps:[{type:'release',instruction:'Release the need to fill silence'},
  {type:'behavior',instruction:'Speak 25% of normal words.'}]}},at(1));
 const v2=d.P.protocols.find(x=>x.id==='p1'&&x.version===2);
 ok(v2&&v2.status==='accepted'&&v2.src==='known','a person\'s edit is version 2, accepted, known');
 ok(J(d.P.protocols.find(x=>x.id==='p1'&&x.version===1))===J(p1v1),'version 1 is exactly what it was');
 ok(J(d.P.practice_events.find(x=>x.id==='pe1'))===J(keepEvent)&&keepEvent.protocol_version===1,
  'the practice that ran under version 1 still says version 1');
 d.go('event_schedule',{id:'pe2',ritual_id:'r1',scheduled_at:at(1)},at(1));
 ok(d.P.practice_events.find(x=>x.id==='pe2').protocol_version===2,'a practice scheduled after the edit runs version 2');
 ok(d.P.practice_events.find(x=>x.id==='pe2').execution.steps_expected===2,'and expects version 2\'s two steps');
 /* progress, which a system proposes and the person accepts */
 d.go('protocol_revise',{id:'p1',reason:'advance',generated_by:{system:'practice-test',model_version:'0'},
  set:{steps:[{type:'release',instruction:'Release'},{type:'behavior',instruction:'Listen without preparing a response.'}]}},at(2));
 const v3=d.P.protocols.find(x=>x.id==='p1'&&x.version===3);
 ok(v3&&v3.status==='proposed'&&v3.src==='proposed','a system\'s progression is version 3, proposed');
 d.go('event_schedule',{id:'pe3',ritual_id:'r1',scheduled_at:at(2)},at(2));
 ok(d.P.practice_events.find(x=>x.id==='pe3').protocol_version===2,'until it is accepted, the ritual keeps running version 2');
 d.go('protocol_accept',{id:'p1'},at(3));
 d.go('event_schedule',{id:'pe4',ritual_id:'r1',scheduled_at:at(3)},at(3));
 ok(d.P.practice_events.find(x=>x.id==='pe4').protocol_version===3,'accepted, it runs');
 /* regress */
 d.go('protocol_revise',{id:'p1',reason:'deescalate',set:{steps:[{type:'release',instruction:'Release'},
  {type:'behavior',instruction:'Speak 50% of normal words.'}]}},at(4));
 d.go('protocol_revise',{id:'p1',reason:'retire'},at(4),false);
 const evs=d.P.log.map(x=>x.type);
 ['PROTOCOL_GENERATED','PROTOCOL_ACCEPTED','PROTOCOL_REJECTED','PROTOCOL_MODIFIED','PROTOCOL_VERSIONED',
  'PROTOCOL_ADVANCED','PROTOCOL_DEESCALATED','PATTERN_LINKED'].forEach(t=>ok(evs.indexOf(t)>=0,t+' was emitted'));
 ok(J(d.P.protocols.find(x=>x.id==='p1'&&x.version===1))===J(p1v1),'after four revisions version 1 is still exactly what it was');
 /* every older version is untouched by every action, checked action by action */
 const d2=world(E,ok); let held=null, moved=0;
 const snapOld=()=>d2.P.protocols.filter(x=>{const L=Math.max.apply(null,d2.P.protocols.filter(y=>y.id===x.id).map(y=>y.version));return x.version<L;}).map(J).sort().join('\n');
 [['protocol_revise',{id:'p1',reason:'modify',set:{conditions:{when:['in meetings']}}}],
  ['protocol_revise',{id:'p1',reason:'adapt',adaptation:'shorten',classification:'too_long',generated_by:{system:'t',model_version:'0'},set:{schedule:{duration:'1 hour'}}}],
  ['protocol_accept',{id:'p1'}],['event_schedule',{id:'q1',ritual_id:'r1'}],
  ['protocol_revise',{id:'p1',reason:'modify',set:{target_patterns:[]}},false]].forEach(s=>{
  const before=snapOld(); const r=d2.go(s[0],s[1],at(1),s[2]);
  if(held!==null&&before.indexOf(held)!==0)moved++;
  held=snapOld();});
 ok(moved===0,'no action rewrote an older version');
 ok(d2.P.protocols.filter(x=>x.id==='p1').length===3,'three versions of p1, 1 to 3');
 /* the release protocol is the release engine's, called and not copied */
 d.go('protocol_add',{id:'p3',class:'release',target_patterns:[A],steps:[{type:'behavior',instruction:'x'}]},T0,false);
 d.go('protocol_add',{id:'p4',class:'release',target_patterns:[],steps:[{type:'release',instruction:'x'}]},T0,false);
 d.go('protocol_add',{id:'p5',class:'body',target_patterns:[],steps:[{type:'behavior',practice:'box'},{type:'behavior',practice:'nope'}]},T0,false);
 d.go('protocol_add',{id:'p6',class:'body',steps:[{type:'behavior',practice:'box',protocol_id:'p1'}]},T0,false);
 d.go('protocol_add',{id:'p7',class:'body',steps:[{type:'behavior',practice:'box'}]});
 const p=E.blankProfile('rel'); p.practice=d.P;
 const chans=['Llimit','Rlimit','Ltruth','Rtruth'];
 const ids=[+A.slice(5)];
 const rp=E.practiceReleasePlan(p,'p1',chans,'new');
 ok(rp.ok&&rp.keys.length>0&&J(rp.keys)===J(E.meterPlan(p,ids,chans,E.meterBudget(p).cap)),
  'a release protocol plans exactly what meterPlan plans at meterBudget\'s cap: '+J(rp.keys).slice(0,60));
 ok(!E.practiceReleasePlan(p,'p7',chans,'new').ok,'a protocol that is not a release protocol has no release plan');
 const run=E.meterRun(p,rp.keys);
 ok(run.added===rp.keys.length,'the release engine opens what was planned');
 const vf=E.practiceReleaseVerify(p,rp.keys);
 ok(vf.all&&vf.open.length===rp.keys.length,'and the meter verifies it, observed');
 ok(!E.practiceReleaseVerify(E.blankProfile('z'),rp.keys).all,'a meter that never ran verifies nothing');
 const rr=E.practiceReleasePlan(p,'p1',chans,'rerun');
 ok(rr.ok&&J(rr.keys)===J(E.meterRerunPlan(p,ids,chans,E.RUN_MAX)),'a rerun plans exactly what meterRerunPlan plans');
};

SUITES.evidence=function(E,ok){
 const d=door(E,ok), A=pat(E);
 d.go('goal_create',{id:'g1',title:'Drink eight glasses of water a day'});
 d.go('protocol_add',{id:'p1',class:'body',steps:[{type:'behavior',instruction:'A glass on waking'}]});
 d.go('ritual_create',{id:'r1',protocol_id:'p1',title:'Water'});
 d.go('event_schedule',{id:'pe1',ritual_id:'r1',scheduled_at:T0});
 ['available','started','completed'].forEach(s=>d.go('event_move',{id:'pe1',to:s}));
 /* rule 4: completion is not evidence of change */
 const o=E.practiceOutcomeRead(d.P,'pe1');
 ok(o.status==='unclear','a completed practice with nothing recorded reads unclear, got '+o.status);
 d.go('outcome_record',{id:'o1',goal_id:'g1',metric:'glasses',status:'improved',practice_event_id:'pe1'},T0,false);
 d.go('evidence_record',{id:'c1',source:'system',type:'behavioral',dimension:'effect',metric:'completion',value:1,practice_event_id:'pe1'});
 ok(E.practiceStage(d.P,'pe1')==='verified','a system record that it ran is the verified stage');
 d.go('outcome_record',{id:'o1',goal_id:'g1',metric:'glasses',status:'improved',evidence_ids:['c1']},T0,false);
 ok(E.practiceOutcomeRead(d.P,'pe1').status==='unclear','a record that it ran is still not a change');
 /* rule 15: affect is not effect */
 d.go('evidence_record',{id:'a1',source:'user',type:'internal',dimension:'affect',metric:'ease',value:9,practice_event_id:'pe1'});
 d.go('outcome_record',{id:'o1',goal_id:'g1',metric:'glasses',status:'improved',evidence_ids:['a1']},T0,false);
 d.go('outcome_record',{id:'o1',goal_id:'g1',metric:'glasses',status:'worsened',evidence_ids:['a1']},T0,false);
 d.go('evidence_record',{id:'n1',source:'user',type:'negative',dimension:'effect',metric:'glasses',before:3,after:3,pattern_id:A});
 d.go('outcome_record',{id:'o1',goal_id:'g1',metric:'glasses',status:'improved',evidence_ids:['n1']},T0,false);
 d.go('outcome_record',{id:'o0',goal_id:'g1',metric:'glasses',status:'unclear'});
 /* evidence of effect, before, after and later */
 d.go('evidence_record',{id:'f1',source:'user',type:'behavioral',dimension:'effect',metric:'glasses',
  before:3,after:6,later:7,unit:'glasses a day',confidence:0.8,goal_id:'g1',practice_event_id:'pe1'});
 ok(E.practiceStage(d.P,'pe1')==='evidence','with evidence of effect it is the evidence stage');
 const or=E.practiceOutcomeRead(d.P,'pe1');
 ok(or.status===null&&J(or.evidence)===J(['f1']),'with evidence of effect the read names it and leaves the verdict to the person');
 d.go('outcome_record',{id:'o1',goal_id:'g1',metric:'glasses',before:3,current:7,target:8,status:'improved',
  evidence_ids:['a1','f1'],practice_event_id:'pe1'});
 ok(E.practiceStage(d.P,'pe1')==='outcome','measured, it is the outcome stage');
 d.go('outcome_record',{id:'o2',goal_id:'g1',metric:'glasses',status:'unclear',practice_event_id:'pe1'},T0,false);
 const f1=d.P.evidence.find(x=>x.id==='f1');
 ok(f1.before===3&&f1.after===6&&f1.later===7,'before, after and later are each kept');
 /* side by side, never summed */
 const ea=E.practiceEffectAffect(d.P,{practice_event_id:'pe1'});
 ok(ea.effect.n===2&&ea.affect.n===1&&J(Object.keys(ea).sort())===J(['affect','effect']),
  'effect and affect are read apart, two and one, and nothing adds them: '+J({e:ea.effect.n,a:ea.affect.n}));
 ok(ea.affect.quality.length===0,'nobody reported how this practice felt, so there is no quality');
 d.go('event_schedule',{id:'pe2',ritual_id:'r1',scheduled_at:at(1)},at(1));
 ['available','started'].forEach(s=>d.go('event_move',{id:'pe2',to:s},at(1)));
 d.go('event_move',{id:'pe2',to:'completed',quality:{effort:3,self_reported_quality:9}},at(1));
 ok(E.practiceEffectAffect(d.P,{ritual_id:'r1'}).affect.quality.length===1,'how it felt is affect, from the practice\'s own quality');
 ok(E.practiceOutcomeRead(d.P,'pe2').status==='unclear','and a practice that felt good, with nothing recorded, is still unclear');
 /* negative evidence argues against its pattern */
 const ti=E.practiceTraceIntents(d.P).filter(i=>i.from.id==='n1');
 ok(ti.length===1&&ti[0].edge==='contradicts'&&ti[0].to.id===A,'negative evidence contradicts its pattern in the intents');
};

SUITES.provenance=function(E,ok){
 const W=world(E,()=>{}).P;
 const bad=(mut,frag,what)=>{const Q=clone(W); mut(Q); const errs=[]; E.practiceValidate(errs,Q,'practice');
  ok(errs.join(' | ').indexOf(frag)>=0,what+': '+J(errs.slice(0,2)));};
 bad(Q=>{Q.goals[0].src='proposed';},'a goal is the person\'s own','a proposed goal is refused at the boundary (rule 10)');
 bad(Q=>{Q.goals[0].src='inferred';},'goals[0].src is inferred','an inferred goal is refused');
 bad(Q=>{Q.behavior_objectives[0].src='user_confirmed';},'src is user_confirmed and approved_by.user is not true',
  'a confirmation nobody gave is refused');
 bad(Q=>{Q.protocols[0].src='known'; Q.protocols[0].approved_by.user=false; Q.protocols[0].status='proposed';},
  'on something a system generated and nobody approved','a generated protocol claiming to be known is refused (rule 9)');
 bad(Q=>{Q.evidence[0].src='likely';},'src is not one of','a sixth provenance is refused');
 bad(Q=>{Q.protocols[0].approved_by.user=false;},'status is accepted and approved_by.user is not true','acceptance without the person');
 const d=door(E,ok);
 d.go('goal_create',{title:'x',generated_by:{system:'model',model_version:'1'}},T0,false);
 d.go('goal_create',{title:'x',src:'user_confirmed'},T0,false);
 d.go('goal_create',{title:'x',src:'proposed'},T0,false);
 d.go('goal_create',{id:'g1',title:'My own words'});
 d.go('behavior_define',{id:'b1',goal_id:'g1',behavior:'x',priority:0,generated_by:{system:'model',model_version:'1'}});
 ok(d.P.behavior_objectives[0].src==='proposed','a generated behavior starts proposed');
 d.go('behavior_define',{goal_id:'g1',behavior:'x',priority:0,src:'known',generated_by:{system:'model',model_version:'1'}},T0,false);
 d.go('confirm',{kind:'behavior',id:'b1'});
 const b=d.P.behavior_objectives[0];
 ok(b.src==='user_confirmed'&&b.approved_by.user===true&&b.generated_by.system==='model',
  'confirmed, it is user_confirmed and still says what generated it');
 d.go('confirm',{kind:'behavior',id:'b1'},T0,false);
 d.go('confirm',{kind:'goal',id:'g1'},T0,false);
 d.go('protocol_add',{id:'p1',class:'body',steps:[{type:'timer',instruction:'x'}],generated_by:{system:'model',model_version:'1'}});
 d.go('confirm',{kind:'protocol',id:'p1'},T0,false);
 d.go('evidence_record',{id:'e1',source:'system',type:'behavioral',dimension:'effect',metric:'steps',value:4000,src:'inferred'});
 d.go('confirm',{kind:'evidence',id:'e1'});
 d.go('evidence_record',{source:'system',type:'behavioral',dimension:'effect',src:'user_confirmed'},T0,false);
 d.go('evidence_record',{id:'e2',source:'observation',type:'behavioral',dimension:'effect',metric:'x'});
 ok(d.P.evidence.find(x=>x.id==='e2').src==='observed','an observation is observed by default');
 const srcs={}; d.P.log.forEach(x=>{srcs[x.src]=1;});
 ok(srcs.proposed&&srcs.user_confirmed&&srcs.known&&srcs.observed,'the log keeps the provenances apart: '+J(Object.keys(srcs)));
};

SUITES.persistence=function(E,ok,say){
 const mem={}; E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=v;});
 const data=J([E.PRACTICE,E.CHARGES,E.BANDS,E.NODES.length,E.TEACHER_PRACTICE]);
 const W=world(E,ok).P;
 const me=E.pNew('Practice gate');
 me.practice=clone(W);
 ok(E.pSave()===true,'a record carrying practice saves');
 const txt=E.pExport(), n0=E.profiles().length;
 const back=E.pImport(txt);
 ok(!!back&&J(back.practice)===J(W),'export and import compose: the practice object comes back exactly');
 ok(E.profiles().length===n0+1,'the import is pushed once');
 /* atomic refusal */
 const cur=E.current(), list=E.profiles().slice(), disk=mem[E.PKEY];
 const badRec=JSON.parse(txt); badRec.practice.outcomes[0].evidence_ids=[];
 const r=E.pImport(J(badRec));
 const why=(E.importError()||[]).join(' | ');
 ok(r===null&&why.indexOf('practice.outcomes[0].status is improved and names no evidence')>=0,
  'a record claiming a change with no evidence is refused, by path: '+why.slice(0,120));
 ok(E.current()===cur&&E.profiles().length===list.length&&mem[E.PKEY]===disk,
  'and nothing moved: the current record, the list and the disk are as they were');
 const pay=JSON.parse(txt); pay.practice.goals[0].customer_id='cus_1';
 ok(E.pImport(J(pay))===null&&(E.importError()||[]).join(' ').indexOf('may not carry customer_id')>=0,
  'a practice object carrying a payment id is refused by name');
 const pv=JSON.parse(txt); pv.practice.v=7;
 ok(E.pImport(J(pv))===null,'a practice schema from the future is refused');
 /* an older record, and one that bypassed the boundary */
 const old=JSON.parse(txt); delete old.practice; old.v=1;
 const ob=E.pImport(J(old));
 ok(!!ob&&J(ob.practice)===J(E.practiceBlank()),'an older record imports with the blank practice');
 const raw=E.blankProfile('raw'); delete raw.practice; E.loadProfile(raw);
 ok(J(raw.practice)===J(E.practiceBlank()),'loadProfile fills the blank on a record with none');
 /* nothing personal was written into the shared tables */
 ok(J([E.PRACTICE,E.CHARGES,E.BANDS,E.NODES.length,E.TEACHER_PRACTICE])===data,
  'the practice library and the canon tables are exactly as they were: no personal practice data in them');
 if(say){
  const ev=W.practice_events[0], logs=W.log.filter(x=>x.ref.id===ev.id);
  say('  bytes: one practice event '+J(ev).length+', with its log entries '+(J(ev).length+logs.reduce((a,x)=>a+J(x).length,0))
   +', the whole worked example '+J(W).length);}
};

SUITES.migration=function(E,ok){
 const now='2026-10-10T12:00:00.000Z';
 const p=E.blankProfile('legacy');
 const rel=E.NODES.find(n=>n.cf).i;
 const plans=[
  {id:'rA',steps:['box','slow'],when:'after coffee',where:'kitchen',days:0,from:'2026-10-01T08:00:00.000Z',stop:null,
   band:'Root',track:'Body',rel:null,tc:null,tags:['Root','Heart'],on:[0,2,4],tm:12},
  {id:'rB',steps:['box'],when:'',where:'',days:14,from:'2026-10-02T08:00:00.000Z',stop:null,
   band:'Root',track:'Body',rel:rel,tc:null,tags:[],on:null,tm:null},
  {id:'rC',steps:['noting'],when:'',where:'',days:7,from:'2026-09-01T08:00:00.000Z',stop:'2026-09-03T08:00:00.000Z',
   band:'',track:'Mind',rel:null,tc:null,tags:[],on:null,tm:null}];
 p.rituals=[
  {t:'2026-10-01T08:00:00.000Z',steps:['box','slow'],min:15,when:'',where:'',done:'2026-10-01T09:00:00.000Z'},
  {t:'2026-10-03T08:00:00.000Z',steps:['box','slow'],min:15,when:'',where:'',done:false},
  {t:'2026-10-09T08:00:00.000Z',steps:['box','slow'],min:15,when:'',where:'',done:false},
  {t:'2026-10-02T08:00:00.000Z',steps:['box'],min:5,when:'',where:'',done:true},
  {t:'2026-09-02T08:00:00.000Z',steps:['noting'],min:15,when:'',where:''},
  {t:'2026-08-01T08:00:00.000Z',steps:['listen'],min:10,when:'',where:'',band:'Throat',done:true}];
 const before=J(p.rituals), planBefore=J(plans);
 const m=E.practiceFromLegacy(p,plans,now);
 ok(m.ok,'the legacy record migrates into objects the boundary accepts'+(m.ok?'':': '+m.errs.slice(0,3).join(' | ')));
 ok(J(p.rituals)===before&&J(plans)===planBefore,'and the day log and the plans are not touched');
 ok(m.entries.length===p.rituals.length&&m.entries.every(Boolean)&&new Set(m.entries).size===m.entries.length,
  'every day entry is exactly one practice event, none dropped');
 const ev=i=>m.P.practice_events.find(x=>x.id===m.entries[i]);
 ok(ev(0).status==='completed'&&ev(0).src==='known'&&ev(0).completed_at==='2026-10-01T09:00:00.000Z','a stamped day is completed, known, at its stamp');
 ok(ev(1).status==='missed'&&ev(1).src==='observed','a day set and not done, past the late mark, is missed, observed');
 ok(ev(2).status==='scheduled','a day set yesterday and not done can still be marked, so it is scheduled');
 ok(ev(3).status==='completed'&&ev(3).src==='known','done true is completed');
 ok(ev(4).status==='completed'&&ev(4).src==='inferred','an entry from before done existed is completed and says it is inferred');
 const rA=m.P.rituals.find(r=>r.id==='r_pr_mig_rA');
 ok(rA&&rA.cadence.type==='selected_days'&&J(rA.days)===J(['mon','wed','fri'])&&rA.timer.duration_seconds===720
  &&J(rA.tags)===J(['Root','Heart'])&&rA.active===true,'a plan\'s weekdays, timer and seats carry across');
 const pB=m.P.protocols.find(x=>x.id==='pr_mig_rB');
 ok(pB&&pB.class==='release'&&J(pB.target_patterns.pattern_ids)===J(['addr:'+rel]),'a release schedule is a release protocol on its address');
 ok(m.P.protocol_steps.find(s=>s.id===pB.steps.step_ids[0]).type==='release','with the release step first');
 ok(m.P.rituals.find(r=>r.id==='r_pr_mig_rC').active===false,'a stopped plan is an inactive ritual');
 ok(ev(5).ritual_id!==rA.id&&m.orphans===1,'an entry no plan covers gets a ritual of its own');
 const orp=m.P.protocols.find(x=>x.id===ev(5).protocol_id);
 ok(orp&&orp.src==='inferred'&&m.P.rituals.find(r=>r.id===ev(5).ritual_id).active===false,'which is inferred and inactive');
 ok(m.P.protocols.filter(x=>x.src==='user_confirmed').length===3,'the three plans the person started are user_confirmed');
 ok(m.P.log.length===0,'the log starts empty: no history is invented');
 const q=E.blankProfile('legacy2'); q.practice=m.P;
 ok(E.validateProfile(clone(q)).ok,'the migrated record passes the whole profile boundary');
};

SUITES.trace=function(E,ok){
 const W=world(E,ok).P, A=pat(E);
 const got=E.practiceTraceIntents(W);
 ok(got.length>0&&got.every(E.practiceIntentOk),'every intent is typed, edged and sourced from the TDD\'s lists');
 const s=i=>i.from.type+':'+i.from.id+' '+i.edge+' '+i.to.type+':'+i.to.id+' '+i.src;
 const want=['goal:g1 requires behavior:b1 known',
  'protocol:p1 targets pattern:'+A+' user_confirmed',
  'protocol:p1 implements behavior:b1 user_confirmed',
  'pattern:'+A+' obstructs goal:g1 inferred',
  'ritual:r1 executes protocol:p1 known',
  'ritual:r1 produces practice_event:pe1 known',
  'practice_event:pe1 produces evidence:e1 known',
  'practice_event:pe1 produces outcome:o1 known',
  'evidence:e1 supports pattern:'+A+' known',
  'evidence:e1 supports outcome:o1 known',
  'outcome:o1 measures goal:g1 known'];
 ok(J(got.map(s).sort())===J(want.slice().sort()),'section 18\'s worked example gives exactly these intents: '+J(got.map(s)));
 /* section 15, the relationships the task names, each present */
 [['goal','requires','behavior'],['pattern','obstructs','goal'],['protocol','targets','pattern'],
  ['protocol','implements','behavior'],['ritual','executes','protocol'],['ritual','produces','practice_event'],
  ['practice_event','produces','evidence'],['practice_event','produces','outcome'],
  ['evidence','supports','pattern'],['outcome','measures','goal']].forEach(r=>{
  ok(got.some(i=>i.from.type===r[0]&&i.edge===r[1]&&i.to.type===r[2]),r.join(' ')+' is present');});
 /* every id an intent names is on the record, or is a pattern that exists */
 const ix={}; ['goals','behavior_objectives','protocols','rituals','practice_events','evidence','outcomes'].forEach(L=>W[L].forEach(x=>{ix[x.id]=1;}));
 ok(got.every(i=>[i.from,i.to].every(n=>n.type==='pattern'?E.practicePatternOk(n.id):ix[n.id])),'no intent points at nothing');
 ok(got.filter(i=>i.edge==='obstructs').every(i=>i.src==='inferred'),'a link nobody stated says it is inferred');
 const d=door(E,ok); d.P=clone(W);
 d.go('protocol_add',{id:'p2',class:'attention',target_patterns:[A],steps:[{type:'timer',instruction:'x'}],generated_by:{system:'t',model_version:'0'}});
 d.go('protocol_reject',{id:'p2'});
 ok(!E.practiceTraceIntents(d.P).some(i=>i.from.id==='p2'),'a rejected protocol connects nothing');
 ok(J(E.practiceTraceIntents({practice:W}))===J(got),'a whole record and its practice object give the same intents');
 ok(J(E.practiceTraceIntents(W))===J(got),'reading the intents writes nothing and gives the same answer twice');
};

/* ============================================================
   THE BITES. One rule broken per copy of engine.js, and the suite that
   guards it must fail on that copy. The text replaced is asserted present
   first, so a mutation that silently did not apply cannot pass as a bite.
   ============================================================ */
const MUTANTS=[
 {suite:'state', what:'a missed practice can be rewritten as completed',
  from:"partial:[], completed:[], skipped:[], missed:[]};", to:"partial:[], completed:[], skipped:[], missed:['completed']};"},
 {suite:'state', what:'a miss written while the day can still be marked',
  from:"prDay(t)-prDay(x.scheduled_at)<2", to:"false"},
 {suite:'state', what:'the log rewritten rather than appended',
  from:"x.seq=Q.log.length+1; Q.log.push(x);", to:"x.seq=1; Q.log=[x];"},
 {suite:'evidence', what:'a claim of change with no evidence accepted',
  from:"if(o.status==='unclear')return null;", to:"return null;"},
 {suite:'evidence', what:'affect counted as evidence of effect',
  from:"e.dimension==='effect'&&e.metric!==PR_COMPLETION&&e.type!=='negative'", to:"e.metric!==PR_COMPLETION&&e.type!=='negative'"},
 {suite:'protocol', what:'a revision that writes over the version it revises',
  from:"var nv=JSON.parse(JSON.stringify(old));", to:"var nv=old;"},
 {suite:'provenance', what:'a goal nobody stated accepted',
  from:"if(g.src!=='known'&&g.src!=='user_confirmed')", to:"if(false)"},
 {suite:'miss', what:'motivation as a classification of a miss',
  from:"'goal_changed','protocol_mismatch','unknown'];", to:"'goal_changed','protocol_mismatch','unknown','motivation'];"},
 {suite:'persistence', what:'the practice object skipping the profile boundary',
  from:"if(o.practice!==undefined&&o.practice!==null)p.practice=practiceValidate(errs,o.practice,'practice');", to:""},
 {suite:'trace', what:'a ritual implementing a protocol instead of executing it',
  from:"'ritual',r.id,'protocol',r.protocol_id,'executes'", to:"'ritual',r.id,'protocol',r.protocol_id,'implements'"},
 {suite:'migration', what:'a day set and never done migrated as completed',
  from:"else if(today-d>=2){st='missed'; src='observed';}", to:"else if(today-d>=2){st='completed'; src='known'; at=x.t;}"},
 {suite:'schema', what:'an account id let onto a practice object',
  from:"var PR_NEVER=['user_id',", to:"var PR_NEVER=["}];
function load(src){
 const ctx={module:{exports:{}}, console:console};
 vm.createContext(ctx); vm.runInContext(src,ctx,{filename:'engine-copy.js'});
 return ctx.module.exports;}
function count(suite,E){
 let f=0; const fails=[];
 try{ SUITES[suite](E,(c,m)=>{if(!c){f++; if(fails.length<2)fails.push(m);}}); }
 catch(e){ f++; fails.push('threw: '+((e&&e.message)||e)); }
 return {f:f, fails:fails};}

function run(E,ok,g,say){
 Object.keys(SUITES).forEach(n=>{
  g('PR · practice, '+n);
  try{ SUITES[n](E,ok,say); }catch(e){ ok(false,'the '+n+' suite threw: '+((e&&e.stack)||e)); }});
 g('PR · practice, the gate bites');
 const src=fs.readFileSync(ENGINE_FILE,'utf8');
 /* the loader, on an unbroken copy, before it is trusted with a broken one */
 const clean=load(src), base={};
 Object.keys(SUITES).forEach(n=>{base[n]=count(n,clean).f;});
 ok(Object.keys(base).every(n=>base[n]===0),'an unbroken copy loaded the same way passes every suite: '+J(base));
 MUTANTS.forEach(m=>{
  const hits=src.split(m.from).length-1;
  ok(hits===1,'the text to break is in the engine exactly once ('+m.what+'), found '+hits);
  if(hits!==1)return;
  const r=count(m.suite,load(src.replace(m.from,m.to)));
  ok(r.f>0,'the '+m.suite+' suite fails when '+m.what+' ('+r.f+' failures, first: '+(r.fails[0]||'none')+')');});}
module.exports=run;
module.exports.SUITES=SUITES;

if(require.main===module){
 const E=require(ENGINE_FILE);
 let P=0,F=0;
 const ok=(c,m)=>{if(c){P++}else{F++;console.log('  FAIL  '+m)}};
 const g=n=>console.log('\n'+n);
 run(E,ok,g,console.log);
 console.log('\n===== '+P+' passed, '+F+' failed =====');
 process.exit(F?1:0);}
