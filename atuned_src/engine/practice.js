
/* ============================================================
   PRACTICE. The P0 domain of the Practice TDD
   (ATUNED-practice-ritual-accountability-trace-graph-TDD.md, section
   41): Goal, BehaviorObjective, Protocol, ProtocolStep, Ritual,
   PracticeEvent, Evidence and Outcome, their state machines, the event
   log that is their audit trail, versioning, provenance, and the
   persistence of all of it on the record the boundary already guards.

   HOST FREE. Nothing here touches a document, a store or a network. The
   host binds storage and the host draws. Every write goes through one
   pure door, practiceDo, which takes a practice object and returns a new
   one, so a refused write leaves the old object exactly as it was and the
   caller has nothing to put back.

   WHAT IS STORED AND WHAT IS DERIVED, said once. Stored: the eight kinds
   of object and the log. Derived and never stored: whether a protocol
   version is superseded (a higher version exists), the stage after a
   practice event's status (verified, evidence, outcome), the miss run and
   whether it has reached the threshold, the effect and affect reads, and
   the trace intents. A stored derived value is how two truths appear.

   WHAT IS NOT HERE. No UI. No server. No graph: practiceTraceIntents
   returns plain intents and the graph consumes them. No goal
   decomposition and no other P1 intelligence. And no copy of the release
   engine: a release protocol plans through meterPlan and meterRerunPlan
   and verifies against meter.unique, which stay authoritative (TDD
   section 8, rule 8).

   THE OLD RITUAL RECORD IS NOT TOUCHED. p.rituals is the day log the
   Ritual tab, the ladder and the avatar's cycles all read, and the plans
   live beside the record under atuned-ritual-active. practiceFromLegacy
   below states and tests how both map into these objects, and it is NOT
   run on load: running it now would write a second copy of every day
   while the Ritual tab keeps writing the first, which is two truths. The
   cutover is the UI build's, when one writer replaces the other. See
   PRACTICE-AUDIT.md.
   ============================================================ */
var PRACTICE_SCHEMA_V=1;

/* ---------------- the enums, exactly as the TDD writes them ---------------- */
/* section 26. Never collapsed: a value moves only by a named action. */
var PR_SRC=['known','inferred','proposed','user_confirmed','observed'];
/* sections 4 and 5. One list for both, because the TDD writes the same
   four for both and two copies of one list are two lists that drift. */
var PR_LIFE=['active','paused','completed','abandoned'];
var PR_CLASS=['release','behavior','integrity','communication','body','attention',
 'relationship','goal','presence','custom'];
var PR_STEP=['release','reframe','affirmation','behavior','timer','observation',
 'real_world_action','verification'];
var PR_EV_ST=['scheduled','available','started','partial','completed','skipped','missed','interrupted'];
var PR_EVID_SOURCE=['user','system','observation','behavioral_event','outcome'];
var PR_EVID_TYPE=['internal','behavioral','contextual','outcome','negative'];
var PR_OUT_ST=['improved','unchanged','worsened','unclear'];
/* section 24 */
var PR_MISS=['wrong_time','too_long','too_difficult','unclear_purpose','low_relevance',
 'environment','forgot','resistance','goal_changed','protocol_mismatch','unknown'];
var PR_ADAPT=['shorten','reschedule','change_condition','change_protocol','reduce_difficulty',
 'increase_difficulty','pause','replace','investigate_pattern'];
/* section 30, the whole vocabulary, in its order */
var PR_EVENTS=['GOAL_CREATED','GOAL_UPDATED','GOAL_PAUSED','GOAL_COMPLETED','GOAL_ABANDONED',
 'BEHAVIOR_DEFINED','BEHAVIOR_UPDATED',
 'PROTOCOL_GENERATED','PROTOCOL_ACCEPTED','PROTOCOL_REJECTED','PROTOCOL_MODIFIED',
 'PROTOCOL_VERSIONED','PROTOCOL_ADAPTED','PROTOCOL_ADVANCED','PROTOCOL_DEESCALATED',
 'RITUAL_CREATED','RITUAL_STARTED','RITUAL_PAUSED','RITUAL_COMPLETED','RITUAL_SKIPPED',
 'RITUAL_MISSED','RITUAL_RESCHEDULED',
 'PRACTICE_STARTED','PRACTICE_PARTIAL','PRACTICE_COMPLETED','PRACTICE_INTERRUPTED',
 'EVIDENCE_RECORDED','OUTCOME_RECORDED','PATTERN_LINKED','PATTERN_UNLINKED','CONTEXT_TRANSFERRED'];
/* sections 16 and 17, the graph's vocabulary, for the intents */
var PR_NODE=['story','impression','pattern','goal','behavior','protocol','ritual','practice_event',
 'observation','evidence','outcome','context','somatic_state','reframe','release'];
var PR_EDGE=['causes','associated_with','supports','contradicts','obstructs','reinforces','targets',
 'addresses','requires','implements','executes','produces','measures','occurs_in','replaces',
 'precedes','follows','generalizes_to','transfers_to'];

/* ---------------- what the TDD left open, decided here and named ----------------
   PR_PROTO_ST. The TDD gives a protocol GENERATED, ACCEPTED and REJECTED
   events and no status field. A version's status is one of three and is
   set once, from proposed. Superseded is not on the list because it is
   derived: a version is superseded when a higher one exists.
   PR_DIM. Section 13 asks for effect and affect measured separately and
   gives Evidence no field to say which. Every piece of evidence says.
   PR_CADENCE and PR_DAYS. Section 9 writes cadence as a bare string. A
   closed set is the boundary's posture, so it is the shapes the Ritual
   builder can already say plus the two section 25 of the V3 document and
   section 33 here name. */
var PR_PROTO_ST=['proposed','accepted','rejected'];
var PR_DIM=['effect','affect'];
var PR_CADENCE=['daily','selected_days','every_other_day','trigger'];
var PR_DAYS=['mon','tue','wed','thu','fri','sat','sun'];
/* "Practice missed 3 times", section 24's own example. A threshold and not
   a verdict: reaching it opens an investigation, nothing else. */
var PR_MISS_AT=3;
/* WHAT A PRACTICE OBJECT MAY NEVER CARRY, refused by name on every one of
   the eight. user_id is the TDD's own field and it is refused: a practice
   object belongs to the record that holds it, and an account id written on
   it would join the record to the account, which the privacy ruling
   forbids. The rest are the plan's refusals and the top level's, because a
   payment field or a session has no business in a practice. */
var PR_NEVER=['user_id','customer','customer_id','subscription','subscription_id','email',
 'key','secret','token','session','password','card','payment','stripe'];

/* ---------------- the state machines ----------------
   THE PRACTICE EVENT, section 25, as a table and nothing else. available
   is the clock opening a scheduled practice. interrupted goes back to
   started, which is section 37's Continue and Restart, or closes as
   partial. The four end states go nowhere: a record a person can rewrite
   at will is not a record.
   VERIFIED, EVIDENCE, OUTCOME and ADAPTATION are in the diagram and not in
   the status enum, so they are stages read off what is linked to the event
   (practiceStage), never stored as a status. */
var PR_FLOW={scheduled:['available','skipped','missed'],
 available:['started','skipped','missed'],
 started:['interrupted','partial','completed'],
 interrupted:['started','partial'],
 partial:[], completed:[], skipped:[], missed:[]};
/* the event each move emits. Section 30 has no entry for a practice made
   available, so that move emits nothing: it is the clock and not a person
   or the system deciding anything. */
var PR_EV_EMIT={available:null, started:'PRACTICE_STARTED', partial:'PRACTICE_PARTIAL',
 completed:'PRACTICE_COMPLETED', interrupted:'PRACTICE_INTERRUPTED',
 skipped:'RITUAL_SKIPPED', missed:'RITUAL_MISSED'};
/* a goal and a behavior objective. Paused comes back to active; completed
   and abandoned are where it ends. Nothing is deleted: abandoned is the
   TDD's own way out, and a person's history is not ours to remove. */
var PR_LIFE_FLOW={active:['paused','completed','abandoned'],
 paused:['active','completed','abandoned'], completed:[], abandoned:[]};
/* resuming has no event of its own in section 30, so it is an update */
var PR_GOAL_EMIT={active:'GOAL_UPDATED', paused:'GOAL_PAUSED',
 completed:'GOAL_COMPLETED', abandoned:'GOAL_ABANDONED'};
var PR_REVISE_EMIT={modify:'PROTOCOL_MODIFIED', adapt:'PROTOCOL_ADAPTED',
 advance:'PROTOCOL_ADVANCED', deescalate:'PROTOCOL_DEESCALATED'};
/* what each classification of a miss proposes. Every proposal is proposed
   and the person decides (section 24). None of the eleven reads the miss as
   a lack of motivation, and no classification can say so (rule 12). */
var PR_MISS_PROPOSE={
 wrong_time:['reschedule'], too_long:['shorten','reduce_difficulty'],
 too_difficult:['reduce_difficulty','shorten'], unclear_purpose:['investigate_pattern','change_protocol'],
 low_relevance:['change_protocol','replace','investigate_pattern'],
 environment:['change_condition','reschedule'], forgot:['reschedule','change_condition'],
 resistance:['investigate_pattern','reduce_difficulty'], goal_changed:['pause','replace'],
 protocol_mismatch:['change_protocol','replace'], unknown:['investigate_pattern']};
var PR_MOTIVE=['motivation','lazy','laziness','discipline','willpower','weak','weakness','unmotivated'];
/* the metric a system writes when it records only that a practice ran.
   It is evidence the practice happened and never evidence of change. */
var PR_COMPLETION='completion';
/* WHAT CHANGED, ASKED AFTER A RELEASE. The System Congruency TDD, section
   15, and CONGRUENCY-AUDIT.md's next task: after the release has written, the
   person is asked what changed, and the answer is evidence on this list, one
   record per address the run worked, through evidence_record and nothing
   else. There is no second ledger.

   THE FIVE ANSWERS are the TDD's own minimum, in its order, as keys:
   I feel different, I see it differently, something moved, nothing changed,
   not sure. SKIPPED IS A SIXTH STORED VALUE AND NOT A SIXTH ANSWER. A person
   who pressed Skip, or left the card without answering, said something
   different from a person who pressed Not sure, and storing the one as the
   other would be a claim they did not make. So the question offers five and
   the record holds six, and anything else is refused by name at the
   boundary (prCross below), never read as the nearest one.

   A VERIFICATION NEVER BECOMES AN EDGE. practiceTraceIntents turns evidence
   with a pattern_id into "evidence supports pattern", and TRACE_RULE has no
   neutral row. "Nothing changed" written that way would be the graph
   inventing support for a pattern the person just said did not move, which
   the TDD forbids (section 16, and the Sweep's rule 4). So evidence on this
   metric emits no evidence edge in either direction, and loopRead counts it
   off the record directly, as what the person said. A neutral relation in
   the rule table is the larger change and is the owner's.

   Every value is self report about how it felt afterwards, so the dimension
   is affect, never effect: prClaimErr already refuses an outcome claiming
   change on affect alone, which is the TDD's "completion does not equal
   change" held from the other side. */
var RV_METRIC='release_verification';
var RV_ANSWERS=['feel_different','see_differently','something_moved','nothing_changed','not_sure'];
var RV_SKIP='skipped';
var RV_VALUES=RV_ANSWERS.concat([RV_SKIP]);
/* the words each value is shown in, one table, read by the question on the
   release card and by Your patterns, so the two never word one answer twice.
   The five are the TDD's minimum responses; "I'm not sure" is cut to the
   product's own Not sure, the wording onboarding already uses for the same
   tap. Skipped is shown as what it is, no answer. */
var RV_SAY={feel_different:'I feel different', see_differently:'I see it differently',
 something_moved:'Something moved', nothing_changed:'Nothing changed', not_sure:'Not sure',
 skipped:'No answer'};
function prIsVerify(e){return !!(e&&e.metric===RV_METRIC);}

/* ---------------- caps, refused above and never truncated ---------------- */
var PR_CAP={goals:200, behavior_objectives:1000, protocols:2000, protocol_steps:10000,
 rituals:500, practice_events:20000, evidence:20000, outcomes:5000, log:100000};
var PR_STRS_MAX=50, PR_STR_SHORT=120;

/* ============================================================
   THE SHAPES. A small field language so the eight specs read as tables:
   t is the kind, req refuses a missing field, nul allows null, max bounds a
   string or a list. A missing field that is not required is filled from
   its blank. Everything else is refused by name with the path to it.
   ============================================================ */
var PR_ID_RE=/^[A-Za-z0-9_.:-]{1,64}$/;
var PR_S={str:function(max){return {t:'str',max:max};},
 nstr:function(max){return {t:'str',max:max,nul:1};},
 strs:{t:'list',max:PR_STRS_MAX,of:{t:'str',max:PR_STR_SHORT}},
 ndate:{t:'date',nul:1}, date:{t:'date',req:1},
 nnum:function(lo,hi){return {t:'num',lo:lo,hi:hi,nul:1};}};
var PR_QV={t:'obj',keys:{value:PR_S.nnum(-1e9,1e9),unit:PR_S.nstr(40)}};
var PR_COND3={t:'obj',keys:{when:PR_S.strs,where:PR_S.strs,with_whom:PR_S.strs}};
var PR_SN={t:'sn',nul:1};
var PR_META={
 id:{t:'id',req:1},
 src:{t:'enum',of:PR_SRC,req:1},
 schema_version:{t:'num',int:1,lo:1,hi:PRACTICE_SCHEMA_V,req:1},
 generated_by:{t:'obj',keys:{system:PR_S.nstr(80),model_version:PR_S.nstr(80),timestamp:PR_S.ndate}},
 approved_by:{t:'obj',keys:{user:{t:'bool'},at:PR_S.ndate}},
 contract_version:PR_S.nstr(40), algorithm_version:PR_S.nstr(40)};
function prSpec(own){var o={}; Object.keys(PR_META).forEach(function(k){o[k]=PR_META[k];});
 Object.keys(own).forEach(function(k){o[k]=own[k];}); return o;}
var PR_SPEC={
 goals:prSpec({
  title:{t:'str',max:200,min:1,req:1}, description:PR_S.str(2000),
  status:{t:'enum',of:PR_LIFE,req:1},
  desired_outcome:{t:'obj',keys:{description:PR_S.str(2000),measurable:{t:'bool'},
   target_value:PR_S.nnum(-1e9,1e9),target_unit:PR_S.nstr(40)}},
  conditions:{t:'obj',keys:{contexts:PR_S.strs,environments:PR_S.strs,people:PR_S.strs,
   triggers:PR_S.strs,time_windows:PR_S.strs}},
  start_at:PR_S.date, target_at:PR_S.ndate, created_at:PR_S.date, updated_at:PR_S.date}),
 behavior_objectives:prSpec({
  goal_id:{t:'id',req:1}, behavior:{t:'str',max:200,min:1,req:1}, description:PR_S.str(2000),
  frequency:PR_QV, duration:PR_QV, quantity:PR_QV, conditions:PR_COND3,
  quality_dimensions:{t:'obj',keys:{awareness:{t:'bool'},presence:{t:'bool'},
   integrity:{t:'bool'},consistency:{t:'bool'}}},
  priority:{t:'num',lo:0,hi:1e6,req:1}, status:{t:'enum',of:PR_LIFE,req:1},
  created_at:PR_S.date, updated_at:PR_S.date}),
 protocols:prSpec({
  version:{t:'num',int:1,lo:1,hi:10000,req:1}, class:{t:'enum',of:PR_CLASS,req:1},
  status:{t:'enum',of:PR_PROTO_ST,req:1}, objective_id:{t:'id',nul:1},
  target_patterns:{t:'obj',keys:{pattern_ids:{t:'list',max:PR_STRS_MAX,of:{t:'pat'}}}},
  steps:{t:'obj',keys:{step_ids:{t:'list',max:PR_STRS_MAX,of:{t:'id'}}}},
  conditions:PR_COND3,
  schedule:{t:'obj',keys:{cadence:PR_S.nstr(40),duration:PR_S.nstr(40)}},
  progression:{t:'obj',keys:{enabled:{t:'bool'},progression_id:{t:'id',nul:1}}},
  verification:{t:'obj',keys:{required:{t:'bool'},verification_type:PR_S.str(60)}},
  evidence_requirements:{t:'obj',keys:{evidence_types:{t:'list',max:PR_EVID_TYPE.length,uniq:1,
   of:{t:'enum',of:PR_EVID_TYPE}}}},
  adaptation_rules:{t:'obj',keys:{rule_ids:{t:'list',max:PR_STRS_MAX,of:{t:'id'}}}},
  created_at:PR_S.date, updated_at:PR_S.date}),
 /* practice is the one field added to a step: the key of a row in the
    practice library a behavior step asks for, so Box Breathing is the
    library's and is not written out again here. */
 protocol_steps:prSpec({
  protocol_id:{t:'id',req:1}, sequence:{t:'num',int:1,lo:1,hi:1000,req:1},
  type:{t:'enum',of:PR_STEP,req:1}, instruction:PR_S.str(500),
  duration:PR_QV, quantity:PR_QV, condition:PR_S.nstr(500),
  completion_rule:PR_S.nstr(500), evidence_rule:PR_S.nstr(500),
  practice:{t:'prac',nul:1}}),
 /* tags are the seven seats and nothing else: TG4 ruled a closed field
    validated against a table, never free text, and the Ritual tab already
    keeps them that way. The TDD writes string[]; the ruling wins. */
 rituals:prSpec({
  protocol_id:{t:'id',req:1}, title:{t:'str',max:200,min:1,req:1},
  cadence:{t:'obj',keys:{type:{t:'enum',of:PR_CADENCE,req:1}}},
  days:{t:'list',max:7,uniq:1,of:{t:'enum',of:PR_DAYS}},
  start_at:PR_S.ndate, end_at:PR_S.ndate,
  timer:{t:'obj',keys:{enabled:{t:'bool'},duration_seconds:PR_S.nnum(1,86400)}},
  active:{t:'bool',req:1}, order:{t:'num',int:1,lo:0,hi:100000},
  tags:{t:'list',max:7,uniq:1,of:{t:'seat'}},
  created_at:PR_S.date, updated_at:PR_S.date}),
 /* protocol_version is section 27's: the version that ran, kept for ever. */
 practice_events:prSpec({
  ritual_id:{t:'id',req:1}, protocol_id:{t:'id',req:1},
  protocol_version:{t:'num',int:1,lo:1,hi:10000,req:1},
  scheduled_at:PR_S.date, started_at:PR_S.ndate, completed_at:PR_S.ndate,
  status:{t:'enum',of:PR_EV_ST,req:1},
  execution:{t:'obj',keys:{duration_seconds:PR_S.nnum(0,604800),
   steps_completed:{t:'num',int:1,lo:0,hi:1000},steps_expected:{t:'num',int:1,lo:0,hi:1000}}},
  quality:{t:'obj',keys:{awareness:PR_S.nnum(0,10),presence:PR_S.nnum(0,10),
   integrity:PR_S.nnum(0,10),effort:PR_S.nnum(0,10),self_reported_quality:PR_S.nnum(0,10)}},
  evidence_ids:{t:'list',max:500,of:{t:'id'}}, outcome_id:{t:'id',nul:1},
  created_at:PR_S.date, updated_at:PR_S.date}),
 evidence:prSpec({
  source:{t:'enum',of:PR_EVID_SOURCE,req:1}, type:{t:'enum',of:PR_EVID_TYPE,req:1},
  dimension:{t:'enum',of:PR_DIM,req:1}, timestamp:PR_S.date,
  context:PR_S.nstr(500), pattern_id:{t:'pat',nul:1},
  protocol_id:{t:'id',nul:1}, ritual_id:{t:'id',nul:1}, goal_id:{t:'id',nul:1},
  metric:PR_S.nstr(80), value:PR_SN, unit:PR_S.nstr(40),
  before:PR_SN, after:PR_SN, later:PR_SN,
  confidence:PR_S.nnum(0,1), notes:PR_S.nstr(2000),
  /* THE STORY ENTRY IT FOLLOWS, by the entry's own identity, its t. Additive
     and optional: an older record has none and is filled with null, and a
     release with no story behind it (Imprints, a drill, the ritual) has
     none either. A typed field and not a convention inside context, because
     a link written into a free string cannot be checked and is a second
     name for one thing. Not cross checked against story.entries: evidence
     is history and outlives the entry it points at. */
  story_t:PR_S.ndate}),
 outcomes:prSpec({
  goal_id:{t:'id',req:1}, timestamp:PR_S.date, metric:{t:'str',max:80,min:1,req:1},
  before:PR_SN, current:PR_SN, target:PR_SN, status:{t:'enum',of:PR_OUT_ST,req:1},
  evidence_ids:{t:'list',max:500,of:{t:'id'}}, notes:PR_S.nstr(2000)})};
/* the kinds a log entry and an intent may point at. behavior is the
   graph's own word for a BehaviorObjective (section 16). */
var PR_KIND={goal:'goals', behavior:'behavior_objectives', protocol:'protocols',
 ritual:'rituals', practice_event:'practice_events', evidence:'evidence', outcome:'outcomes'};
var PR_LOG_SPEC={seq:{t:'num',int:1,lo:1,hi:1e9,req:1}, type:{t:'enum',of:PR_EVENTS,req:1},
 at:PR_S.date,
 ref:{t:'obj',req:1,keys:{type:{t:'enum',of:Object.keys(PR_KIND).concat(['pattern']),req:1},
  id:{t:'str',max:64,min:1,req:1},version:{t:'num',int:1,lo:1,hi:10000,nul:1}}},
 src:{t:'enum',of:PR_SRC,req:1},
 /* no free text in the log. It feeds the graph, and what a person wrote
    stays in the object it was written on. */
 data:{t:'obj',nul:1,keys:{from:PR_S.nstr(64),to:PR_S.nstr(64),
  classification:{t:'enum',of:PR_MISS,nul:1},adaptation:{t:'enum',of:PR_ADAPT,nul:1},
  version:{t:'num',int:1,lo:1,hi:10000,nul:1}}}};

function practiceBlank(){
 return {v:PRACTICE_SCHEMA_V, goals:[], behavior_objectives:[], protocols:[], protocol_steps:[],
  rituals:[], practice_events:[], evidence:[], outcomes:[], log:[]};}
var PR_LISTS=['goals','behavior_objectives','protocols','protocol_steps','rituals',
 'practice_events','evidence','outcomes'];

/* ---------------- one field ---------------- */
function prBlank(f){
 if(f.nul)return null;
 if(f.t==='str')return '';
 if(f.t==='bool')return false;
 if(f.t==='list')return [];
 if(f.t==='num')return 0;
 if(f.t==='obj'){var o={}; Object.keys(f.keys).forEach(function(k){o[k]=prBlank(f.keys[k]);}); return o;}
 return null;}
/* a pattern is an address in the node table or one of the nine fetters,
   and it is keyed the way meterFirst already keys an address, addr:N */
function practicePatternOk(id){
 if(typeof id!=='string')return false;
 var m=/^addr:(\d{1,4})$/.exec(id);
 if(m)return !!BY[+m[1]];
 m=/^fetter:(.+)$/.exec(id);
 return !!(m&&CHARGES.indexOf(m[1])>=0);}
function prField(errs,path,v,f){
 if(v===undefined){
  if(f.req){errs.push(path+' is missing'); return prBlank(f);}
  return prBlank(f);}
 if(v===null&&f.nul)return null;
 switch(f.t){
  case 'str':{var s=vStr(errs,path,v,f.max); if(s===null)return prBlank(f);
   if(f.min&&s.trim().length<f.min){errs.push(path+' is empty'); return prBlank(f);}
   return s;}
  case 'id':
   if(typeof v!=='string'||!PR_ID_RE.test(v)){errs.push(path+' is not an id: '+JSON.stringify(v)); return null;}
   return v;
  case 'date':{var d=vDate(errs,path,v); return d===null?null:d;}
  case 'num':{
   if(!NUM(v)){errs.push(path+' is not a number'); return prBlank(f);}
   if(v<f.lo||v>f.hi){errs.push(path+' is '+v+', outside '+f.lo+' to '+f.hi); return prBlank(f);}
   if(f.int&&v%1!==0){errs.push(path+' is '+v+', not a whole number'); return prBlank(f);}
   return v;}
  case 'bool':
   if(typeof v!=='boolean'){errs.push(path+' is not true or false'); return false;}
   return v;
  case 'enum':
   if(f.of.indexOf(v)<0){errs.push(path+' is not one of '+f.of.join(', ')+': '+JSON.stringify(v)); return null;}
   return v;
  case 'sn':
   if(typeof v==='string'){var q=vStr(errs,path,v,200); return q===null?null:q;}
   if(!NUM(v)){errs.push(path+' is not a number, a short string or null'); return null;}
   return v;
  case 'pat':
   if(!practicePatternOk(v)){errs.push(path+' names no pattern: '+JSON.stringify(v)); return null;}
   return v;
  case 'prac':
   if(typeof v!=='string'||!RIT_STEP[v]){errs.push(path+' names no practice in the library: '+JSON.stringify(v)); return null;}
   return v;
  case 'seat':
   if(BANDS.indexOf(v)<0){errs.push(path+' is not a seat: '+JSON.stringify(v)); return null;}
   return v;
  case 'list':{
   if(!Array.isArray(v)){errs.push(path+' is not a list'); return [];}
   if(v.length>f.max){errs.push(path+' holds '+v.length+', more than '+f.max); return [];}
   var out=[];
   v.forEach(function(x,i){
    var y=prField(errs,path+'['+i+']',x,f.of);
    if(f.uniq&&out.indexOf(y)>=0){errs.push(path+' names '+JSON.stringify(y)+' twice'); return;}
    out.push(y);});
   return out;}
  case 'obj':
   if(!v||typeof v!=='object'||Array.isArray(v)){errs.push(path+' is not an object'); return prBlank(f);}
   return prObj(errs,path,v,f.keys);}
 errs.push(path+' has no kind'); return null;}
/* a closed key set, with the never list refused by its own name first so
   the reason is the real one */
function prObj(errs,path,x,keys){
 Object.keys(x).forEach(function(k){
  if(PR_NEVER.indexOf(k)>=0)errs.push(path+' may not carry '+k
   +': a practice object belongs to the record that holds it and carries no account, payment or session field');
  else if(!keys.hasOwnProperty(k))errs.push(path+' may not carry '+k);});
 var o={};
 Object.keys(keys).forEach(function(k){o[k]=prField(errs,path+'.'+k,x[k],keys[k]);});
 return o;}

/* ============================================================
   THE BOUNDARY FOR THE PRACTICE OBJECT. Called by validateProfile, so an
   import is atomic with everything else on the record: one error here
   refuses the whole record and nothing moves. Every error is named by its
   path from practice down.
   ============================================================ */
function practiceValidate(errs,o,base){
 var path=base||'practice', P=practiceBlank();
 if(!o||typeof o!=='object'||Array.isArray(o)){errs.push(path+' is not an object'); return P;}
 Object.keys(o).forEach(function(k){
  if(k!=='v'&&k!=='log'&&PR_LISTS.indexOf(k)<0)errs.push(path+' may not carry '+k);});
 /* a newer practice schema than this build knows is refused rather than
    read with a guess. A missing one is the only version there has been. */
 if(o.v!==undefined&&(!NUM(o.v)||o.v<1||o.v>PRACTICE_SCHEMA_V||o.v%1!==0))
  errs.push(path+'.v is '+JSON.stringify(o.v)+', not a practice schema this build reads (1 to '+PRACTICE_SCHEMA_V+')');
 PR_LISTS.forEach(function(L){
  if(o[L]===undefined||o[L]===null)return;
  if(!Array.isArray(o[L])){errs.push(path+'.'+L+' is not a list'); return;}
  if(o[L].length>PR_CAP[L]){errs.push(path+'.'+L+' holds '+o[L].length+', more than '+PR_CAP[L]); return;}
  P[L]=o[L].map(function(x,i){
   var p2=path+'.'+L+'['+i+']';
   if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(p2+' is not an object'); return null;}
   return prObj(errs,p2,x,PR_SPEC[L]);}).filter(Boolean);});
 if(o.log!==undefined&&o.log!==null){
  if(!Array.isArray(o.log))errs.push(path+'.log is not a list');
  else if(o.log.length>PR_CAP.log)errs.push(path+'.log holds '+o.log.length+', more than '+PR_CAP.log);
  else P.log=o.log.map(function(x,i){
   var p2=path+'.log['+i+']';
   if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(p2+' is not an object'); return null;}
   return prObj(errs,p2,x,PR_LOG_SPEC);}).filter(Boolean);}
 prCross(errs,P,path);
 return P;}

/* the indexes the cross checks and the actions both read */
function prIndex(P){
 var ix={}; PR_LISTS.forEach(function(L){ix[L]={};});
 PR_LISTS.forEach(function(L){if(L==='protocols')return;
  P[L].forEach(function(x){if(x&&x.id)ix[L][x.id]=x;});});
 P.protocols.forEach(function(x){
  var e=ix.protocols[x.id]||(ix.protocols[x.id]={v:{},latest:null,accepted:null});
  e.v[x.version]=x;
  if(!e.latest||x.version>e.latest.version)e.latest=x;
  if(x.status==='accepted'&&(!e.accepted||x.version>e.accepted.version))e.accepted=x;});
 return ix;}
/* AN OUTCOME THAT CLAIMS A CHANGE NAMES THE EVIDENCE OF IT. Rule 4 and rule
   5, and section 13: the evidence has to be of effect, not of affect, not a
   record that the practice ran, and not evidence against. Unclear is the one
   status that claims nothing and so needs nothing. Returns the reason it
   fails, or null. */
function prClaimErr(o,ix){
 if(o.status==='unclear')return null;
 var good=(o.evidence_ids||[]).filter(function(id){
  var e=ix.evidence[id];
  return !!(e&&e.dimension==='effect'&&e.metric!==PR_COMPLETION&&e.type!=='negative');});
 if(good.length)return null;
 return 'is '+o.status+' and names no evidence of effect: a practice that ran, '
  +'or felt good, is not evidence of change';}
function prCross(errs,P,path){
 var ix=prIndex(P), seen;
 /* ids unique within each kind, and a protocol is its id and its version */
 PR_LISTS.forEach(function(L){
  seen={};
  P[L].forEach(function(x,i){
   var k=L==='protocols'?x.id+'@'+x.version:x.id;
   if(seen[k])errs.push(path+'.'+L+'['+i+'] repeats the id '+k);
   seen[k]=1;});});
 /* provenance, never collapsed. user_confirmed is a person's yes and must
    say so. A goal is the person's own (rule 10): it is stored only once
    they have said it or confirmed it. Something a system generated is not
    known or observed until a person says yes (rule 9). */
 PR_LISTS.forEach(function(L){
  P[L].forEach(function(x,i){
   var p2=path+'.'+L+'['+i+']';
   if(x.src==='user_confirmed'&&!(x.approved_by&&x.approved_by.user))
    errs.push(p2+'.src is user_confirmed and approved_by.user is not true');
   if(x.generated_by&&x.generated_by.system&&!(x.approved_by&&x.approved_by.user)
    &&(x.src==='known'||x.src==='observed'))
    errs.push(p2+'.src is '+x.src+' on something a system generated and nobody approved');});});
 P.goals.forEach(function(g,i){
  if(g.src!=='known'&&g.src!=='user_confirmed')
   errs.push(path+'.goals['+i+'].src is '+g.src+': a goal is the person\'s own, and is kept only once they have said it or confirmed it');});
 P.behavior_objectives.forEach(function(b,i){
  if(!ix.goals[b.goal_id])errs.push(path+'.behavior_objectives['+i+'].goal_id names no goal: '+b.goal_id);});
 /* protocols: versions run 1 to n with no gap, references resolve, and a
    release protocol has something for the release engine to do */
 Object.keys(ix.protocols).forEach(function(id){
  var e=ix.protocols[id];
  for(var n=1;n<=e.latest.version;n++)
   if(!e.v[n])errs.push(path+'.protocols '+id+' has version '+e.latest.version+' and no version '+n);});
 P.protocols.forEach(function(x,i){
  var p2=path+'.protocols['+i+']';
  if(x.objective_id&&!ix.behavior_objectives[x.objective_id])
   errs.push(p2+'.objective_id names no behavior objective: '+x.objective_id);
  x.steps.step_ids.forEach(function(sid,j){
   var s=ix.protocol_steps[sid];
   if(!s)errs.push(p2+'.steps.step_ids['+j+'] names no step: '+sid);
   else if(s.protocol_id!==x.id)errs.push(p2+'.steps.step_ids['+j+'] is a step of '+s.protocol_id+', not of '+x.id);});
  if(x.status==='accepted'&&!(x.approved_by&&x.approved_by.user))
   errs.push(p2+'.status is accepted and approved_by.user is not true');
  if(x.class==='release'){
   var addr=x.target_patterns.pattern_ids.filter(function(pp){return /^addr:/.test(pp);});
   var rel=x.steps.step_ids.filter(function(sid){var s=ix.protocol_steps[sid]; return s&&s.type==='release';});
   if(!addr.length)errs.push(p2+' is a release protocol and targets no address for the release engine');
   if(!rel.length)errs.push(p2+' is a release protocol and has no release step');}});
 P.protocol_steps.forEach(function(s,i){
  if(!ix.protocols[s.protocol_id])errs.push(path+'.protocol_steps['+i+'].protocol_id names no protocol: '+s.protocol_id);});
 P.rituals.forEach(function(r,i){
  var e=ix.protocols[r.protocol_id], p2=path+'.rituals['+i+']';
  if(!e)errs.push(p2+'.protocol_id names no protocol: '+r.protocol_id);
  else if(!e.accepted)errs.push(p2+' schedules protocol '+r.protocol_id+', which has no accepted version');
  if(r.cadence.type==='selected_days'&&!r.days.length)errs.push(p2+'.days is empty and the cadence is selected days');});
 /* practice events: the version that ran exists, and the status agrees
    with the timestamps and the step counts */
 P.practice_events.forEach(function(x,i){
  var p2=path+'.practice_events['+i+']', r=ix.rituals[x.ritual_id], e=ix.protocols[x.protocol_id];
  if(!r)errs.push(p2+'.ritual_id names no ritual: '+x.ritual_id);
  else if(r.protocol_id!==x.protocol_id)errs.push(p2+'.protocol_id is '+x.protocol_id+' and its ritual runs '+r.protocol_id);
  if(!e||!e.v[x.protocol_version])errs.push(p2+' names protocol '+x.protocol_id+' version '+x.protocol_version+', which does not exist');
  var ex=x.execution, st=x.status;
  if(ex.steps_completed>ex.steps_expected)
   errs.push(p2+'.execution has '+ex.steps_completed+' steps completed of '+ex.steps_expected+' expected');
  if(st==='completed'){
   if(!x.completed_at)errs.push(p2+' is completed with no completed_at');
   if(ex.steps_completed!==ex.steps_expected)
    errs.push(p2+' is completed with '+ex.steps_completed+' of '+ex.steps_expected+' steps, which is partial');}
  else if(x.completed_at)errs.push(p2+' is '+st+' and carries a completed_at');
  if(st==='partial'&&!(ex.steps_completed>0&&ex.steps_completed<ex.steps_expected))
   errs.push(p2+' is partial with '+ex.steps_completed+' of '+ex.steps_expected+' steps');
  if((st==='started'||st==='interrupted'||st==='partial')&&!x.started_at)
   errs.push(p2+' is '+st+' with no started_at');
  if((st==='scheduled'||st==='available'||st==='skipped'||st==='missed')&&x.started_at)
   errs.push(p2+' is '+st+' and carries a started_at');
  x.evidence_ids.forEach(function(id,j){
   if(!ix.evidence[id])errs.push(p2+'.evidence_ids['+j+'] names no evidence: '+id);});
  if(x.outcome_id&&!ix.outcomes[x.outcome_id])errs.push(p2+'.outcome_id names no outcome: '+x.outcome_id);});
 P.evidence.forEach(function(x,i){
  var p2=path+'.evidence['+i+']';
  if(x.protocol_id&&!ix.protocols[x.protocol_id])errs.push(p2+'.protocol_id names no protocol: '+x.protocol_id);
  if(x.ritual_id&&!ix.rituals[x.ritual_id])errs.push(p2+'.ritual_id names no ritual: '+x.ritual_id);
  if(x.goal_id&&!ix.goals[x.goal_id])errs.push(p2+'.goal_id names no goal: '+x.goal_id);
  /* a verification is the person's answer about one address, and it is one
     of the six values, refused by name otherwise */
  if(prIsVerify(x)){
   if(RV_VALUES.indexOf(x.value)<0)
    errs.push(p2+'.value is not a release verification ('+RV_VALUES.join(', ')+'): '+JSON.stringify(x.value));
   if(!(typeof x.pattern_id==='string'&&/^addr:/.test(x.pattern_id)))
    errs.push(p2+' is a release verification and names no address');
   if(x.source!=='user')errs.push(p2+' is a release verification and its source is '+x.source+', not user');
   if(x.dimension!=='affect')errs.push(p2+' is a release verification and its dimension is '+x.dimension+', not affect');}});
 P.outcomes.forEach(function(x,i){
  var p2=path+'.outcomes['+i+']';
  if(!ix.goals[x.goal_id])errs.push(p2+'.goal_id names no goal: '+x.goal_id);
  x.evidence_ids.forEach(function(id,j){
   if(!ix.evidence[id])errs.push(p2+'.evidence_ids['+j+'] names no evidence: '+id);});
  var c=prClaimErr(x,ix); if(c)errs.push(p2+'.status '+c);});
 /* the log is append only: numbered from one with no gap, and every entry
    points at something that is on the record */
 P.log.forEach(function(x,i){
  var p2=path+'.log['+i+']';
  if(x.seq!==i+1)errs.push(p2+'.seq is '+x.seq+', and the log is numbered from 1 with no gap');
  var r=x.ref;
  if(!r||!r.type)return;
  if(r.type==='pattern'){if(!practicePatternOk(r.id))errs.push(p2+'.ref names no pattern: '+r.id); return;}
  if(r.type==='protocol'){var e=ix.protocols[r.id];
   if(!e||(r.version&&!e.v[r.version]))errs.push(p2+'.ref names no protocol '+r.id+(r.version?' version '+r.version:''));
   return;}
  if(!ix[PR_KIND[r.type]][r.id])errs.push(p2+'.ref names no '+r.type+': '+r.id);});}

/* ============================================================
   THE ONE DOOR FOR A WRITE. practiceDo(P, act, args, now) is pure: it
   copies P, applies the action to the copy, appends the events the action
   emits to the copy's log, validates the copy with the same boundary an
   import goes through, and returns it. A refusal returns the reasons by
   name and the P it was given, untouched. So nothing can be written that
   the boundary would refuse on the way back in.
   ============================================================ */
function practiceId(pre){
 return pre+'_'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);}
function prMeta(src,t,a){
 var g=(a&&a.generated_by)||null;
 return {schema_version:PRACTICE_SCHEMA_V, src:src,
  generated_by:{system:g&&g.system||null, model_version:g&&g.model_version||null,
   timestamp:g?(g.timestamp||t):null},
  approved_by:{user:false, at:null},
  contract_version:(a&&a.contract_version)||null, algorithm_version:(a&&a.algorithm_version)||null};}
function prMerge(base,over){
 if(over===undefined)return base;
 if(!over||typeof over!=='object'||Array.isArray(over)||!base||typeof base!=='object'||Array.isArray(base))return over;
 var o={}; Object.keys(base).forEach(function(k){o[k]=base[k];});
 Object.keys(over).forEach(function(k){o[k]=prMerge(base[k],over[k]);});
 return o;}
function prNew(L,fields,src,t,a){
 var o=prMeta(src,t,a); o.id=(a&&a.id)||practiceId({goals:'g',behavior_objectives:'b',protocols:'pr',
  protocol_steps:'ps',rituals:'r',practice_events:'pe',evidence:'ev',outcomes:'oc'}[L]);
 var spec=PR_SPEC[L];
 Object.keys(spec).forEach(function(k){if(PR_META[k])return;
  o[k]=prMerge(prBlank(spec[k]),fields[k]);});
 return o;}
function prEmit(ev,type,ref,src,t,data){
 ev.push({seq:0, type:type, at:t, ref:ref, src:src, data:data||null});}
function prFind(P,L,id){
 for(var i=0;i<P[L].length;i++)if(P[L][i].id===id)return P[L][i];
 return null;}
function prProto(P,id){return prIndex(P).protocols[id]||null;}
function prDay(t){return (typeof pracDay==='function')?pracDay(t):Math.floor(new Date(t).getTime()/86400000);}
function prSrcOf(a,dflt){return (a&&a.src)||dflt;}
/* a generated object is proposed until a person says yes. A person's own is
   known. A caller may say inferred; it may not say user_confirmed on a
   create, because the yes is its own action and leaves its own mark. */
function prCreateSrc(a,errs,what){
 var gen=!!(a&&a.generated_by&&a.generated_by.system);
 var s=(a&&a.src)||(gen?'proposed':'known');
 if(s==='user_confirmed'){errs.push(what+' is not created confirmed: a person confirms it with its own action'); return s;}
 if(gen&&(s==='known'||s==='observed'))errs.push(what+' was generated by '+a.generated_by.system+' and cannot be created as '+s);
 return s;}
/* the steps a protocol is given, made into step objects. Each is new and
   immutable, so a step shared by two versions can be shared safely. */
function prSteps(P,pid,specs,t,src,errs){
 var ids=[];
 (specs||[]).forEach(function(s,i){
  if(!s||typeof s!=='object'){errs.push('steps['+i+'] is not an object'); return;}
  var f={}; Object.keys(s).forEach(function(k){f[k]=s[k];});
  f.protocol_id=pid; f.sequence=i+1;
  var o=prNew('protocol_steps',f,src,t,{id:s.id});
  P.protocol_steps.push(o); ids.push(o.id);});
 return ids;}
function prPatDiff(ev,a0,a1,ref,src,t){
 (a1||[]).forEach(function(p){if((a0||[]).indexOf(p)<0)prEmit(ev,'PATTERN_LINKED',{type:'pattern',id:p,version:null},src,t,{from:null,to:ref.id,classification:null,adaptation:null,version:ref.version});});
 (a0||[]).forEach(function(p){if((a1||[]).indexOf(p)<0)prEmit(ev,'PATTERN_UNLINKED',{type:'pattern',id:p,version:null},src,t,{from:ref.id,to:null,classification:null,adaptation:null,version:ref.version});});}
var PR_GOAL_EDIT=['title','description','desired_outcome','conditions','target_at'];
var PR_BEH_EDIT=['behavior','description','frequency','duration','quantity','conditions','quality_dimensions','priority'];
var PR_RIT_EDIT=['cadence','days','start_at','end_at','timer'];
function prData(from,to,more){
 var d={from:from==null?null:String(from), to:to==null?null:String(to), classification:null, adaptation:null, version:null};
 if(more)Object.keys(more).forEach(function(k){d[k]=more[k];});
 return d;}
var PR_ACT={
 goal_create:function(P,a,t,ev,errs){
  var src=prCreateSrc(a,errs,'a goal');
  if(src!=='known')errs.push('a goal is created as known, the person\'s own words, and not as '+src);
  var g=prNew('goals',{title:a.title, description:a.description, status:'active',
   desired_outcome:a.desired_outcome, conditions:a.conditions,
   start_at:a.start_at||t, target_at:a.target_at==null?null:a.target_at, created_at:t, updated_at:t},src,t,a);
  P.goals.push(g); prEmit(ev,'GOAL_CREATED',{type:'goal',id:g.id,version:null},src,t);
  return g.id;},
 goal_update:function(P,a,t,ev,errs){
  var g=prFind(P,'goals',a.id); if(!g){errs.push('no goal is '+a.id); return null;}
  Object.keys(a.set||{}).forEach(function(k){
   if(PR_GOAL_EDIT.indexOf(k)<0){errs.push('a goal\'s '+k+' is not edited here'); return;}
   g[k]=prMerge(g[k],a.set[k]);});
  g.updated_at=t; prEmit(ev,'GOAL_UPDATED',{type:'goal',id:g.id,version:null},'known',t);
  return g.id;},
 goal_status:function(P,a,t,ev,errs){
  var g=prFind(P,'goals',a.id); if(!g){errs.push('no goal is '+a.id); return null;}
  if((PR_LIFE_FLOW[g.status]||[]).indexOf(a.to)<0){
   errs.push('a goal cannot go from '+g.status+' to '+a.to); return null;}
  var from=g.status; g.status=a.to; g.updated_at=t;
  prEmit(ev,PR_GOAL_EMIT[a.to],{type:'goal',id:g.id,version:null},'known',t,prData(from,a.to));
  return g.id;},
 behavior_define:function(P,a,t,ev,errs){
  if(!prFind(P,'goals',a.goal_id)){errs.push('no goal is '+a.goal_id); return null;}
  var src=prCreateSrc(a,errs,'a behavior objective');
  var f={status:'active', created_at:t, updated_at:t, priority:a.priority==null?0:a.priority};
  ['goal_id','behavior','description','frequency','duration','quantity','conditions','quality_dimensions']
   .forEach(function(k){if(a[k]!==undefined)f[k]=a[k];});
  var b=prNew('behavior_objectives',f,src,t,a);
  P.behavior_objectives.push(b); prEmit(ev,'BEHAVIOR_DEFINED',{type:'behavior',id:b.id,version:null},src,t);
  return b.id;},
 behavior_update:function(P,a,t,ev,errs){
  var b=prFind(P,'behavior_objectives',a.id); if(!b){errs.push('no behavior objective is '+a.id); return null;}
  Object.keys(a.set||{}).forEach(function(k){
   if(PR_BEH_EDIT.indexOf(k)<0){errs.push('a behavior objective\'s '+k+' is not edited here'); return;}
   b[k]=prMerge(b[k],a.set[k]);});
  var from=b.status;
  if(a.to!==undefined){
   if((PR_LIFE_FLOW[b.status]||[]).indexOf(a.to)<0){errs.push('a behavior objective cannot go from '+b.status+' to '+a.to); return null;}
   b.status=a.to;}
  b.updated_at=t;
  prEmit(ev,'BEHAVIOR_UPDATED',{type:'behavior',id:b.id,version:null},'known',t,a.to!==undefined?prData(from,a.to):null);
  return b.id;},
 /* a person's yes on something proposed or inferred. The one way src
    becomes user_confirmed. */
 confirm:function(P,a,t,ev,errs){
  var L=PR_KIND[a.kind];
  if(['behavior_objectives','evidence','outcomes'].indexOf(L)<0){
   errs.push('confirm takes a behavior, a piece of evidence or an outcome; a protocol is accepted'); return null;}
  var x=prFind(P,L,a.id); if(!x){errs.push('no '+a.kind+' is '+a.id); return null;}
  if(x.src!=='proposed'&&x.src!=='inferred'){errs.push('a '+a.kind+' that is '+x.src+' has nothing to confirm'); return null;}
  var from=x.src; x.src='user_confirmed'; x.approved_by={user:true, at:t};
  if(x.updated_at!==undefined)x.updated_at=t;
  prEmit(ev,{behavior_objectives:'BEHAVIOR_UPDATED',evidence:'EVIDENCE_RECORDED',outcomes:'OUTCOME_RECORDED'}[L],
   {type:a.kind,id:x.id,version:null},'user_confirmed',t,prData(from,'user_confirmed'));
  return x.id;},
 /* a protocol, generated (proposed, and waits for a yes) or built by the
    person (known, and accepted as they built it) */
 protocol_add:function(P,a,t,ev,errs){
  var gen=!!(a.generated_by&&a.generated_by.system);
  var src=prCreateSrc(a,errs,'a protocol');
  var id=a.id||practiceId('pr');
  if(prProto(P,id)){errs.push('a protocol '+id+' already exists; a change is a revision'); return null;}
  var stepIds=prSteps(P,id,a.steps,t,src,errs);
  var o=prNew('protocols',{version:1, class:a.class, status:gen?'proposed':'accepted',
   objective_id:a.objective_id==null?null:a.objective_id,
   target_patterns:{pattern_ids:a.target_patterns||[]}, steps:{step_ids:stepIds},
   conditions:a.conditions, schedule:a.schedule, progression:a.progression,
   verification:a.verification, evidence_requirements:a.evidence_requirements,
   adaptation_rules:a.adaptation_rules, created_at:t, updated_at:t},src,t,{id:id,generated_by:a.generated_by,
   contract_version:a.contract_version, algorithm_version:a.algorithm_version});
  if(!gen)o.approved_by={user:true, at:t};
  P.protocols.push(o);
  var ref={type:'protocol',id:id,version:1};
  prEmit(ev,gen?'PROTOCOL_GENERATED':'PROTOCOL_ACCEPTED',ref,src,t);
  prPatDiff(ev,[],o.target_patterns.pattern_ids,ref,src,t);
  return id;},
 protocol_accept:function(P,a,t,ev,errs){
  var e=prProto(P,a.id); if(!e){errs.push('no protocol is '+a.id); return null;}
  var x=e.latest;
  if(x.status!=='proposed'){errs.push('protocol '+a.id+' version '+x.version+' is '+x.status+', not proposed'); return null;}
  x.status='accepted'; x.src='user_confirmed'; x.approved_by={user:true, at:t}; x.updated_at=t;
  prEmit(ev,'PROTOCOL_ACCEPTED',{type:'protocol',id:x.id,version:x.version},'user_confirmed',t,prData('proposed','accepted'));
  return x.id;},
 protocol_reject:function(P,a,t,ev,errs){
  var e=prProto(P,a.id); if(!e){errs.push('no protocol is '+a.id); return null;}
  var x=e.latest;
  if(x.status!=='proposed'){errs.push('protocol '+a.id+' version '+x.version+' is '+x.status+', not proposed'); return null;}
  x.status='rejected'; x.updated_at=t;
  prEmit(ev,'PROTOCOL_REJECTED',{type:'protocol',id:x.id,version:x.version},'known',t,prData('proposed','rejected'));
  return x.id;},
 /* A REVISION IS A NEW VERSION, and the old one is never written to again
    (rule 11, section 27). The new version starts from a copy of the latest
    and takes the changes; steps given are new step objects. Events that ran
    under the old version keep its number. Who revised it decides where it
    stands: the person's revision is accepted as they wrote it, a system's
    is proposed and waits. */
 protocol_revise:function(P,a,t,ev,errs){
  var e=prProto(P,a.id); if(!e){errs.push('no protocol is '+a.id); return null;}
  var why=a.reason||'modify';
  if(!PR_REVISE_EMIT[why]){errs.push('a revision is for '+Object.keys(PR_REVISE_EMIT).join(', ')+', not '+why); return null;}
  var old=e.latest, gen=!!(a.generated_by&&a.generated_by.system);
  var src=prCreateSrc(a,errs,'a revision');
  var nv=JSON.parse(JSON.stringify(old));
  nv.version=old.version+1; nv.created_at=t; nv.updated_at=t;
  var m=prMeta(src,t,a); Object.keys(m).forEach(function(k){nv[k]=m[k];});
  nv.status=gen?'proposed':'accepted'; nv.approved_by=gen?{user:false,at:null}:{user:true,at:t};
  var ch=a.set||{};
  ['class','objective_id','conditions','schedule','progression','verification','evidence_requirements','adaptation_rules']
   .forEach(function(k){if(ch[k]!==undefined)nv[k]=prMerge(nv[k],ch[k]);});
  if(ch.target_patterns!==undefined)nv.target_patterns={pattern_ids:ch.target_patterns};
  if(ch.steps!==undefined)nv.steps={step_ids:prSteps(P,old.id,ch.steps,t,src,errs)};
  P.protocols.push(nv);
  var ref={type:'protocol',id:nv.id,version:nv.version};
  prEmit(ev,'PROTOCOL_VERSIONED',ref,src,t,prData(old.version,nv.version,{version:nv.version}));
  prEmit(ev,PR_REVISE_EMIT[why],ref,src,t,a.adaptation?prData(null,null,{adaptation:a.adaptation,classification:a.classification||null}):null);
  prPatDiff(ev,old.target_patterns.pattern_ids,nv.target_patterns.pattern_ids,ref,src,t);
  return nv.id;},
 ritual_create:function(P,a,t,ev,errs){
  var e=prProto(P,a.protocol_id);
  if(!e){errs.push('no protocol is '+a.protocol_id); return null;}
  if(!e.accepted){errs.push('protocol '+a.protocol_id+' has no accepted version, so there is nothing to schedule'); return null;}
  var src=prCreateSrc(a,errs,'a ritual');
  var r=prNew('rituals',{protocol_id:a.protocol_id, title:a.title, cadence:a.cadence||{type:'daily'},
   days:a.days, start_at:a.start_at==null?t:a.start_at, end_at:a.end_at==null?null:a.end_at,
   timer:a.timer, active:true, order:a.order==null?P.rituals.length:a.order, tags:a.tags,
   created_at:t, updated_at:t},src,t,a);
  P.rituals.push(r); prEmit(ev,'RITUAL_CREATED',{type:'ritual',id:r.id,version:null},src,t);
  return r.id;},
 ritual_pause:function(P,a,t,ev,errs){
  var r=prFind(P,'rituals',a.id); if(!r){errs.push('no ritual is '+a.id); return null;}
  if(!r.active){errs.push('ritual '+a.id+' is already paused'); return null;}
  r.active=false; r.updated_at=t;
  prEmit(ev,'RITUAL_PAUSED',{type:'ritual',id:r.id,version:null},'known',t,prData('active','paused'));
  return r.id;},
 /* section 30 has no resumed event. A paused ritual taking up again is the
    ritual starting, so it is RITUAL_STARTED, said here once. */
 ritual_resume:function(P,a,t,ev,errs){
  var r=prFind(P,'rituals',a.id); if(!r){errs.push('no ritual is '+a.id); return null;}
  if(r.active){errs.push('ritual '+a.id+' is already active'); return null;}
  if(r.end_at&&prDay(r.end_at)<prDay(t)&&!(a.set&&a.set.end_at!==undefined)){
   errs.push('ritual '+a.id+' ended; resuming it needs a new end'); return null;}
  if(a.set&&a.set.end_at!==undefined)r.end_at=a.set.end_at;
  r.active=true; r.updated_at=t;
  prEmit(ev,'RITUAL_STARTED',{type:'ritual',id:r.id,version:null},'known',t,prData('paused','active'));
  return r.id;},
 ritual_reschedule:function(P,a,t,ev,errs){
  var r=prFind(P,'rituals',a.id); if(!r){errs.push('no ritual is '+a.id); return null;}
  Object.keys(a.set||{}).forEach(function(k){
   if(PR_RIT_EDIT.indexOf(k)<0){errs.push('rescheduling does not change a ritual\'s '+k); return;}
   r[k]=prMerge(r[k],a.set[k]);});
  r.updated_at=t; prEmit(ev,'RITUAL_RESCHEDULED',{type:'ritual',id:r.id,version:null},'known',t);
  return r.id;},
 ritual_end:function(P,a,t,ev,errs){
  var r=prFind(P,'rituals',a.id); if(!r){errs.push('no ritual is '+a.id); return null;}
  r.active=false; r.end_at=t; r.updated_at=t;
  prEmit(ev,'RITUAL_COMPLETED',{type:'ritual',id:r.id,version:null},'known',t);
  return r.id;},
 /* one practice, scheduled. It runs the latest accepted version of its
    ritual's protocol, and that number is kept on it for ever. Section 30
    has no event for a practice scheduled; the ritual's creation is the
    decision, and this is its consequence. */
 event_schedule:function(P,a,t,ev,errs){
  var r=prFind(P,'rituals',a.ritual_id); if(!r){errs.push('no ritual is '+a.ritual_id); return null;}
  if(!r.active){errs.push('ritual '+a.ritual_id+' is paused, so nothing is scheduled on it'); return null;}
  var e=prProto(P,r.protocol_id); if(!e||!e.accepted){errs.push('ritual '+r.id+' has no accepted protocol to run'); return null;}
  var x=prNew('practice_events',{ritual_id:r.id, protocol_id:r.protocol_id, protocol_version:e.accepted.version,
   scheduled_at:a.scheduled_at||t, status:'scheduled',
   execution:{duration_seconds:null, steps_completed:0, steps_expected:e.accepted.steps.step_ids.length},
   created_at:t, updated_at:t},prSrcOf(a,'known'),t,a);
  P.practice_events.push(x);
  return x.id;},
 /* THE TRANSITION. The table decides; this applies what it allows and
    refuses what it does not, by name. */
 event_move:function(P,a,t,ev,errs){
  var x=prFind(P,'practice_events',a.id); if(!x){errs.push('no practice event is '+a.id); return null;}
  var tr=practiceTransition(x.status,a.to);
  if(!tr.ok){errs.push(tr.err); return null;}
  /* A MISS IS NOT WRITTEN WHILE THE DAY CAN STILL BE MARKED. The Ritual tab
     lets a person mark today or yesterday done (ritLog), so a practice
     scheduled yesterday is not missed until the day after. */
  if(a.to==='missed'&&prDay(t)-prDay(x.scheduled_at)<2){
   errs.push('a practice scheduled '+x.scheduled_at.slice(0,10)+' can still be marked until the end of the next day, so it is not missed yet'); return null;}
  var ex=x.execution, from=x.status;
  if(a.to==='started'&&!x.started_at)x.started_at=t;
  if(a.steps_completed!==undefined)ex.steps_completed=a.steps_completed;
  if(a.duration_seconds!==undefined)ex.duration_seconds=a.duration_seconds;
  if(a.to==='completed'){
   if(a.steps_completed===undefined)ex.steps_completed=ex.steps_expected;
   x.completed_at=t;}
  if(a.quality)x.quality=prMerge(x.quality,a.quality);
  x.status=a.to; x.updated_at=t;
  if(PR_EV_EMIT[a.to])prEmit(ev,PR_EV_EMIT[a.to],{type:'practice_event',id:x.id,version:null},prSrcOf(a,'known'),t,prData(from,a.to));
  return x.id;},
 evidence_record:function(P,a,t,ev,errs){
  var dflt=a.source==='user'?'known':'observed';
  var src=prCreateSrc({src:a.src||dflt, generated_by:a.generated_by},errs,'evidence');
  var f={timestamp:a.timestamp||t};
  ['source','type','dimension','context','pattern_id','protocol_id','ritual_id','goal_id','metric',
   'value','unit','before','after','later','confidence','notes','story_t'].forEach(function(k){if(a[k]!==undefined)f[k]=a[k];});
  var x=prNew('evidence',f,src,t,a);
  P.evidence.push(x);
  if(a.practice_event_id){
   var pe=prFind(P,'practice_events',a.practice_event_id);
   if(!pe){errs.push('no practice event is '+a.practice_event_id); return null;}
   pe.evidence_ids.push(x.id); pe.updated_at=t;}
  prEmit(ev,'EVIDENCE_RECORDED',{type:'evidence',id:x.id,version:null},src,t);
  return x.id;},
 outcome_record:function(P,a,t,ev,errs){
  var src=prCreateSrc({src:a.src||'known', generated_by:a.generated_by},errs,'an outcome');
  var x=prNew('outcomes',{goal_id:a.goal_id, timestamp:a.timestamp||t, metric:a.metric,
   before:a.before, current:a.current, target:a.target, status:a.status,
   evidence_ids:a.evidence_ids||[], notes:a.notes},src,t,a);
  P.outcomes.push(x);
  if(a.practice_event_id){
   var pe=prFind(P,'practice_events',a.practice_event_id);
   if(!pe){errs.push('no practice event is '+a.practice_event_id); return null;}
   if(pe.outcome_id){errs.push('practice event '+pe.id+' is already measured by outcome '+pe.outcome_id); return null;}
   pe.outcome_id=x.id; pe.updated_at=t;}
  prEmit(ev,'OUTCOME_RECORDED',{type:'outcome',id:x.id,version:null},src,t);
  return x.id;},
 /* THE PERSON'S DECISION ON AN ADAPTATION, section 24's last line. Pause
    is applied here because it is the ritual's own switch. Every other
    adaptation changes the protocol and is a revision, with this decision
    on the log ahead of it. */
 adapt:function(P,a,t,ev,errs){
  var inv=practiceInvestigate(a.classification);
  if(!inv.ok){errs.push(inv.err); return null;}
  if(PR_ADAPT.indexOf(a.adaptation)<0){errs.push('an adaptation is one of '+PR_ADAPT.join(', ')+', not '+a.adaptation); return null;}
  var r=prFind(P,'rituals',a.ritual_id); if(!r){errs.push('no ritual is '+a.ritual_id); return null;}
  var e=prProto(P,r.protocol_id);
  prEmit(ev,'PROTOCOL_ADAPTED',{type:'protocol',id:r.protocol_id,version:e&&e.accepted?e.accepted.version:null},'known',t,
   prData(null,null,{classification:a.classification, adaptation:a.adaptation}));
  if(a.adaptation==='pause'&&r.active){
   r.active=false; r.updated_at=t;
   prEmit(ev,'RITUAL_PAUSED',{type:'ritual',id:r.id,version:null},'known',t,prData('active','paused',{adaptation:'pause'}));}
  return r.id;}};
/* WHAT EACH ACTION TAKES. An argument it does not take is refused by name
   rather than ignored, because an ignored typo on an optional field is a
   write that silently did less than it was asked to. */
var PR_GEN_ARGS=['src','generated_by','contract_version','algorithm_version'];
var PR_ARGS={
 goal_create:['id','title','description','desired_outcome','conditions','start_at','target_at'].concat(PR_GEN_ARGS),
 goal_update:['id','set'], goal_status:['id','to'],
 behavior_define:['id','goal_id','behavior','description','frequency','duration','quantity','conditions',
  'quality_dimensions','priority'].concat(PR_GEN_ARGS),
 behavior_update:['id','set','to'], confirm:['kind','id'],
 protocol_add:['id','class','objective_id','target_patterns','steps','conditions','schedule','progression',
  'verification','evidence_requirements','adaptation_rules'].concat(PR_GEN_ARGS),
 protocol_accept:['id'], protocol_reject:['id'],
 protocol_revise:['id','reason','set','adaptation','classification'].concat(PR_GEN_ARGS),
 ritual_create:['id','protocol_id','title','cadence','days','start_at','end_at','timer','order','tags','src'],
 ritual_pause:['id'], ritual_resume:['id','set'], ritual_reschedule:['id','set'], ritual_end:['id'],
 event_schedule:['id','ritual_id','scheduled_at','src'],
 event_move:['id','to','steps_completed','duration_seconds','quality','src'],
 evidence_record:['id','source','type','dimension','timestamp','context','pattern_id','protocol_id','ritual_id',
  'goal_id','metric','value','unit','before','after','later','confidence','notes','story_t','practice_event_id','src','generated_by'],
 outcome_record:['id','goal_id','timestamp','metric','before','current','target','status','evidence_ids','notes',
  'practice_event_id','src','generated_by'],
 adapt:['ritual_id','classification','adaptation']};
/* and what a step given to a protocol may say. Its protocol and its place
   in the order are the protocol's to set. */
var PR_STEP_ARGS=['id','type','instruction','duration','quantity','condition','completion_rule','evidence_rule','practice'];
function practiceDo(P,act,a,now){
 var t=now||new Date().toISOString(), errs=[], ev=[];
 var base=P||practiceBlank();
 if(!PR_ACT[act])return {ok:false, errs:['no practice action is named '+act], P:base};
 Object.keys(a||{}).forEach(function(k){
  if(PR_ARGS[act].indexOf(k)<0)errs.push(act+' does not take '+k);});
 if(act==='protocol_add'||act==='protocol_revise'){
  var ss=act==='protocol_add'?(a&&a.steps):(a&&a.set&&a.set.steps);
  (Array.isArray(ss)?ss:[]).forEach(function(s,i){
   if(s&&typeof s==='object')Object.keys(s).forEach(function(k){
    if(PR_STEP_ARGS.indexOf(k)<0)errs.push('steps['+i+'] does not take '+k);});});}
 if(errs.length)return {ok:false, errs:errs, P:base};
 var Q=JSON.parse(JSON.stringify(base)), id=null;
 try{ id=PR_ACT[act](Q,a||{},t,ev,errs); }
 catch(e){ errs.push(act+' failed: '+((e&&e.message)||'error')); }
 if(errs.length)return {ok:false, errs:errs, P:base};
 ev.forEach(function(x){x.seq=Q.log.length+1; Q.log.push(x);});
 var V=practiceValidate(errs,Q,'practice');
 if(errs.length)return {ok:false, errs:errs, P:base};
 return {ok:true, P:V, id:id, events:ev.map(function(x){return JSON.parse(JSON.stringify(x));})};}

/* the practice event table, asked directly, refusing by name */
function practiceTransition(from,to){
 if(PR_EV_ST.indexOf(from)<0)return {ok:false, err:'no practice status is '+from};
 if(PR_EV_ST.indexOf(to)<0)return {ok:false, err:'no practice status is '+to};
 if(PR_FLOW[from].indexOf(to)<0)
  return {ok:false, err:'a practice that is '+from+' cannot become '+to
   +(PR_FLOW[from].length?', only '+PR_FLOW[from].join(', '):', it is where that practice ended')};
 return {ok:true, err:null};}

/* ============================================================
   READS. Pure functions of the practice object. Nothing here is stored.
   ============================================================ */
/* THE MISS PATH, section 25. Missed runs back from the newest practice of a
   ritual; a skip is a choice and neither counts nor breaks the run; a
   practice that happened at all, completed or partial, ends it. At the
   threshold the stage is investigate, and after the person has decided an
   adaptation on this ritual's protocol it is adapt. Nothing here reads a
   reason into the run: that is the person's to give. */
function practiceMissRead(P,ritualId){
 var r=prFind(P,'rituals',ritualId); if(!r)return null;
 var evs=P.practice_events.filter(function(x){return x.ritual_id===ritualId;})
  .sort(function(a,b){return Date.parse(b.scheduled_at)-Date.parse(a.scheduled_at);});
 var run=0, last=null;
 for(var i=0;i<evs.length;i++){
  var s=evs[i].status;
  if(s==='missed'){run++; if(!last)last=evs[i].scheduled_at; continue;}
  if(s==='skipped'||s==='scheduled'||s==='available')continue;
  break;}
 var adapted=last&&P.log.some(function(x){return x.type==='PROTOCOL_ADAPTED'&&x.ref.id===r.protocol_id&&Date.parse(x.at)>=Date.parse(last);});
 return {ritual_id:ritualId, run:run, at:PR_MISS_AT,
  stage:!run?null:(adapted?'adapt':(run>=PR_MISS_AT?'investigate':'missed')),
  /* stated so no caller can put it any other way */
  motivation:false};}
/* the person's classification of a miss, and what it proposes */
function practiceInvestigate(cls){
 if(typeof cls==='string'&&PR_MOTIVE.indexOf(cls.toLowerCase())>=0)
  return {ok:false, err:'a miss is not read as a failure of motivation, so '+cls
   +' is not a classification (rule 12); the eleven are '+PR_MISS.join(', ')};
 if(PR_MISS.indexOf(cls)<0)return {ok:false, err:'a miss is classified as one of '+PR_MISS.join(', ')+', not '+cls};
 return {ok:true, classification:cls, decided_by:'user',
  proposals:PR_MISS_PROPOSE[cls].map(function(k){return {adaptation:k, src:'proposed'};})};}
/* EFFECT AND AFFECT, side by side and never summed (section 13, rule 15).
   Affect is also what a practice event's quality carries, which is the
   person's report of how it felt. f filters by goal, protocol, ritual or
   one practice event. */
function practiceEffectAffect(P,f){
 f=f||{};
 var ix=prIndex(P), pick=null;
 if(f.practice_event_id){var pe=ix.practice_events[f.practice_event_id]; pick={}; (pe?pe.evidence_ids:[]).forEach(function(id){pick[id]=1;});}
 var out={effect:{n:0, ids:[]}, affect:{n:0, ids:[], quality:[]}};
 P.evidence.forEach(function(e){
  if(pick&&!pick[e.id])return;
  if(f.goal_id&&e.goal_id!==f.goal_id)return;
  if(f.protocol_id&&e.protocol_id!==f.protocol_id)return;
  if(f.ritual_id&&e.ritual_id!==f.ritual_id)return;
  var b=out[e.dimension]; b.n++; b.ids.push(e.id);});
 P.practice_events.forEach(function(x){
  if(f.practice_event_id&&x.id!==f.practice_event_id)return;
  if(f.ritual_id&&x.ritual_id!==f.ritual_id)return;
  if(f.protocol_id&&x.protocol_id!==f.protocol_id)return;
  if(f.goal_id)return;
  var q=x.quality, any=Object.keys(q).some(function(k){return q[k]!==null;});
  if(any)out.affect.quality.push({practice_event_id:x.id, quality:JSON.parse(JSON.stringify(q))});});
 return out;}
/* WHAT AN OUTCOME COULD HONESTLY SAY OF ONE PRACTICE. Unclear, unless
   there is effect evidence linked to it, and even then this does not say
   improved: the direction of a metric is the person's to read, so the
   answer is that it is theirs. A completed practice with nothing linked to
   it is unclear, which is rule 4 as a function. */
function practiceOutcomeRead(P,peId){
 var ix=prIndex(P), x=ix.practice_events[peId]; if(!x)return null;
 var eff=x.evidence_ids.filter(function(id){var e=ix.evidence[id];
  return e&&e.dimension==='effect'&&e.metric!==PR_COMPLETION;});
 if(!eff.length)return {status:'unclear', evidence:[],
  because:x.status==='completed'?'it was completed and nothing records what changed':'nothing records what changed'};
 return {status:null, evidence:eff, because:'there is evidence of effect, and whether it improved is read by the person'};}
/* the stage after a status, read off what is linked, never stored */
function practiceStage(P,peId){
 var ix=prIndex(P), x=ix.practice_events[peId]; if(!x)return null;
 if(x.outcome_id)return 'outcome';
 if(x.evidence_ids.length){
  var obs=x.evidence_ids.some(function(id){var e=ix.evidence[id]; return e&&e.source!=='user';});
  var real=x.evidence_ids.some(function(id){var e=ix.evidence[id]; return e&&e.metric!==PR_COMPLETION;});
  /* a person's own note that it ran verifies nothing; only an observation
     does, and only evidence that is not a completion is evidence */
  if(real)return 'evidence';
  if(obs)return 'verified';}
 return x.status;}

/* ============================================================
   THE RELEASE PROTOCOL CALLS THE RELEASE ENGINE (section 8, rule 8).
   Nothing about a release is decided here. The plan is meterPlan's, at the
   cap meterBudget allows, or meterRerunPlan's for a rerun, which is free;
   the run is the release card's (relPick and relCoolDown in
   ui/release.js); whether a line was opened is meter.unique's to say. The
   channels are the release card's own list (CHAN in ui/release.js), passed
   in by the host, so that table stays in the one place it lives.
   ============================================================ */
function practiceReleaseAddrs(P,protocolId){
 var e=prProto(P,protocolId); if(!e||!e.accepted)return null;
 if(e.accepted.class!=='release')return null;
 return e.accepted.target_patterns.pattern_ids.filter(function(x){return /^addr:/.test(x);})
  .map(function(x){return +x.slice(5);});}
function practiceReleasePlan(p,protocolId,chans,mode){
 var P=(p&&p.practice)||practiceBlank();
 var ids=practiceReleaseAddrs(P,protocolId);
 if(!ids)return {ok:false, err:'protocol '+protocolId+' is not an accepted release protocol', keys:[]};
 if(mode==='rerun')
  return {ok:true, mode:'rerun', addrs:ids, cap:RUN_MAX, keys:meterRerunPlan(p,ids,chans,RUN_MAX)};
 var cap=meterBudget(p).cap;
 if(cap<=0)return {ok:true, mode:'new', addrs:ids, cap:0, keys:[], because:'nothing is left to open on this plan'};
 return {ok:true, mode:'new', addrs:ids, cap:cap, keys:meterPlan(p,ids,chans,cap)};}
/* which of a plan's lines the meter holds as opened. The verification a
   release step gets is this, observed, and never a person's say so. */
function practiceReleaseVerify(p,keys){
 var have={}; ((p&&p.meter&&p.meter.unique)||[]).forEach(function(k){have[k]=1;});
 var open=[], not=[];
 (keys||[]).forEach(function(k){(have[k]?open:not).push(k);});
 return {open:open, not:not, all:(keys||[]).length>0&&!not.length};}

/* ============================================================
   THE TRACE INTENTS. Every practice object connects to the graph (rule 6)
   and nothing here calls the graph. Each intent is
   {from:{type,id}, to:{type,id}, edge, src}, typed from section 16, edged
   from section 17, sourced from section 26. The graph's traceApply takes
   the list.

   Section 15 names its edges both ways (targets and addressed_by, measures
   and measured_by); section 17 names one direction, so each fact is one
   intent in the direction section 17 has a word for: a ritual executes a
   protocol, a pattern obstructs a goal. One fact, one edge.

   src is the provenance of the object that states the link. A link nobody
   stated, a pattern standing in the way of a goal because a protocol for
   that goal targets it, is inferred, and says so.
   ============================================================ */
function practiceTraceIntents(P){
 P=(P&&P.goals)?P:((P&&P.practice)||practiceBlank());
 var ix=prIndex(P), out=[], seen={};
 var put=function(ft,fi,tt,ti,edge,src){
  var k=ft+':'+fi+'>'+tt+':'+ti+'>'+edge+'>'+src; if(seen[k])return; seen[k]=1;
  out.push({from:{type:ft,id:fi}, to:{type:tt,id:ti}, edge:edge, src:src});};
 P.behavior_objectives.forEach(function(b){put('goal',b.goal_id,'behavior',b.id,'requires',b.src);});
 P.protocols.forEach(function(x){
  if(x.status==='rejected')return;
  x.target_patterns.pattern_ids.forEach(function(pp){put('protocol',x.id,'pattern',pp,'targets',x.src);});
  if(x.objective_id){
   put('protocol',x.id,'behavior',x.objective_id,'implements',x.src);
   var b=ix.behavior_objectives[x.objective_id];
   if(b)x.target_patterns.pattern_ids.forEach(function(pp){put('pattern',pp,'goal',b.goal_id,'obstructs','inferred');});}});
 P.rituals.forEach(function(r){put('ritual',r.id,'protocol',r.protocol_id,'executes',r.src);});
 P.practice_events.forEach(function(x){
  put('ritual',x.ritual_id,'practice_event',x.id,'produces',x.src);
  x.evidence_ids.forEach(function(id){var e=ix.evidence[id];
   if(e&&!prIsVerify(e))put('practice_event',x.id,'evidence',id,'produces',e.src);});
  if(x.outcome_id&&ix.outcomes[x.outcome_id])put('practice_event',x.id,'outcome',x.outcome_id,'produces',ix.outcomes[x.outcome_id].src);});
 /* a release verification is never an edge, see RV_METRIC: no evidence node
    is made for it, so it cannot read as support, and the graph does not
    count it as evidence bearing on nothing either */
 P.evidence.forEach(function(e){
  if(e.pattern_id&&!prIsVerify(e))put('evidence',e.id,'pattern',e.pattern_id,e.type==='negative'?'contradicts':'supports',e.src);});
 P.outcomes.forEach(function(o){
  o.evidence_ids.forEach(function(id){var e=ix.evidence[id];
   if(e&&!prIsVerify(e))put('evidence',id,'outcome',o.id,e.type==='negative'?'contradicts':'supports',e.src);});
  put('outcome',o.id,'goal',o.goal_id,'measures',o.src);});
 return out;}
function practiceIntentOk(i){
 return !!(i&&i.from&&i.to&&PR_NODE.indexOf(i.from.type)>=0&&PR_NODE.indexOf(i.to.type)>=0
  &&typeof i.from.id==='string'&&i.from.id&&typeof i.to.id==='string'&&i.to.id
  &&PR_EDGE.indexOf(i.edge)>=0&&PR_SRC.indexOf(i.src)>=0);}

/* ============================================================
   THE MIGRATION, STATED AND NOT RUN. What the Ritual tab keeps today maps
   into these objects like this, and the gate holds it to it:

     a plan (the side store, ritPlans)   one Protocol v1 and one Ritual.
                                         A plan with rel is a release
                                         protocol on addr:rel, a release
                                         step first; any other is custom,
                                         because no track maps to a class
                                         without a diagnosis nothing made.
                                         Its practices are behavior steps
                                         naming the library row. Both are
                                         user_confirmed: a person pressed
                                         Start on each.
     a day entry (p.rituals)             one PracticeEvent on the plan with
                                         the same steps covering that day.
                                         done stamped or true: completed,
                                         known. done false and the late mark
                                         window shut: missed, observed. done
                                         false and still markable:
                                         scheduled. no done key, written
                                         before done existed: completed,
                                         inferred, which is ledgerRead's
                                         reading and says it is a reading.
     an entry no plan covers             grouped by its steps under a
                                         protocol and ritual of its own,
                                         inferred, inactive. Nothing is
                                         dropped.

   What is lost and said so: a done stamp does not say whether a press or a
   finished release wrote it (ritMarkOn writes both), so a release that
   marked a day reads as known and not as observed. The log starts empty:
   writing events dated in the past would be inventing a history.

   p is never written. The plans are the host's to read and pass in.
   ============================================================ */
function practiceFromLegacy(p,plans,now){
 var t=now||new Date().toISOString(), today=prDay(t), P=practiceBlank(), notes=[];
 /* a plan, and an entry no plan covers, were each started by a press, so
    the protocol and ritual made from them carry the person's yes. A
    practice event carries none: it is what happened, not a thing agreed. */
 var meta=function(src,at,yes){return {schema_version:PRACTICE_SCHEMA_V, src:src,
  generated_by:{system:null,model_version:null,timestamp:null},
  approved_by:{user:!!yes, at:yes?at:null},
  contract_version:null, algorithm_version:null};};
 var put=function(L,o,m){Object.keys(m).forEach(function(k){o[k]=m[k];}); P[L].push(o); return o;};
 var key=function(steps){return (steps||[]).join('+');};
 var prac=function(k){for(var i=0;i<PRACTICE.length;i++)if(PRACTICE[i].k===k)return PRACTICE[i]; return null;};
 var made=function(pid,steps,rel,at,src,title,on,tm,from,end,active,tags,order,cls){
  var sids=[], seq=0;
  if(rel!=null){seq++; sids.push(put('protocol_steps',{id:pid+'_s'+seq, protocol_id:pid, sequence:seq, type:'release',
   instruction:BY[rel]?String(BY[rel].k):'', duration:{value:null,unit:null}, quantity:{value:null,unit:null},
   condition:null, completion_rule:null, evidence_rule:null, practice:null},meta(src,at,true)).id);}
  steps.forEach(function(k){var pr=prac(k); seq++;
   sids.push(put('protocol_steps',{id:pid+'_s'+seq, protocol_id:pid, sequence:seq, type:'behavior',
    instruction:pr?pr.nm:'', duration:{value:pr?pr.min:null,unit:pr?'min':null}, quantity:{value:null,unit:null},
    condition:null, completion_rule:null, evidence_rule:null, practice:pr?k:null},meta(src,at,true)).id);});
  put('protocols',{id:pid, version:1, class:cls, status:'accepted', objective_id:null,
   target_patterns:{pattern_ids:rel!=null&&BY[rel]?['addr:'+rel]:[]}, steps:{step_ids:sids},
   conditions:{when:[],where:[],with_whom:[]}, schedule:{cadence:null,duration:null},
   progression:{enabled:false,progression_id:null}, verification:{required:false,verification_type:''},
   evidence_requirements:{evidence_types:[]}, adaptation_rules:{rule_ids:[]},
   created_at:at, updated_at:at},meta(src,at,true));
  return put('rituals',{id:'r_'+pid, protocol_id:pid, title:title||'A ritual',
   cadence:{type:on?'selected_days':'daily'}, days:on?on.map(function(d){return PR_DAYS[d];}):[],
   start_at:from, end_at:end, timer:{enabled:!!tm, duration_seconds:tm?tm*60:null},
   active:active, order:order, tags:tags||[], created_at:at, updated_at:at},meta(src,at,true));};
 var name=function(steps){return steps.map(function(k){var pr=prac(k); return pr?pr.nm:'';}).filter(Boolean).join(', ');};
 var byPlan=[];
 (plans||[]).forEach(function(pl,i){
  var pid='pr_mig_'+String(pl.id).replace(/[^A-Za-z0-9_.:-]/g,'');
  var s0=prDay(pl.from);
  var end=pl.stop||(pl.days?new Date(Date.parse(pl.from)+pl.days*86400000).toISOString():null);
  var active=!pl.stop&&(pl.days===0||today<s0+pl.days);
  var rel=(pl.rel!=null&&BY[pl.rel])?pl.rel:null;
  if(pl.rel!=null&&rel===null)notes.push('plan '+pl.id+' names address '+pl.rel+', which is not in the node table, so it is custom');
  var r=made(pid,pl.steps,rel,pl.from,'user_confirmed',name(pl.steps),pl.on,pl.tm,pl.from,end,active,
   (pl.tags||[]).filter(function(b){return BANDS.indexOf(b)>=0;}),i,rel!==null?'release':'custom');
  byPlan.push({pl:pl, r:r, k:key(pl.steps), s0:s0, stop:pl.stop?prDay(pl.stop):null});});
 var orphan={}, entryMap=[];
 ((p&&p.rituals)||[]).forEach(function(x,i){
  if(!x||typeof x!=='object'){entryMap.push(null); notes.push('rituals['+i+'] is not an entry and is left'); return;}
  var d=prDay(x.t), k=key(x.steps), hit=null;
  for(var j=0;j<byPlan.length;j++){var b=byPlan[j];
   if(b.k===k&&d>=b.s0&&(b.stop===null||d<b.stop)){hit=b.r; break;}}
  if(!hit)for(var j2=0;j2<byPlan.length;j2++)if(byPlan[j2].k===k){hit=byPlan[j2].r; break;}
  if(!hit){
   if(!orphan[k]){var opid='pr_mig_x'+Object.keys(orphan).length;
    orphan[k]=made(opid,x.steps||[],null,x.t,'inferred',name(x.steps||[]),null,null,x.t,null,false,
     (x.band&&BANDS.indexOf(x.band)>=0)?[x.band]:[],byPlan.length+Object.keys(orphan).length,'custom');}
   hit=orphan[k];}
  var st, src, n=(x.steps||[]).length, at=null;
  if(x.done===undefined){st='completed'; src='inferred'; at=x.t;}
  else if(x.done){st='completed'; src='known'; at=typeof x.done==='string'?x.done:x.t;}
  else if(today-d>=2){st='missed'; src='observed';}
  else {st='scheduled'; src='known';}
  var o=put('practice_events',{id:'pe_mig_'+i, ritual_id:hit.id, protocol_id:hit.protocol_id, protocol_version:1,
   scheduled_at:x.t, started_at:null, completed_at:st==='completed'?at:null, status:st,
   execution:{duration_seconds:null, steps_completed:st==='completed'?n:0, steps_expected:n},
   quality:{awareness:null,presence:null,integrity:null,effort:null,self_reported_quality:null},
   evidence_ids:[], outcome_id:null, created_at:x.t, updated_at:x.t},meta(src,x.t,false));
  entryMap.push(o.id);});
 var errs=[], V=practiceValidate(errs,P,'practice');
 return {ok:!errs.length, errs:errs, P:V, entries:entryMap,
  plans:byPlan.map(function(b){return {plan:b.pl.id, ritual:b.r.id, protocol:b.r.protocol_id};}),
  orphans:Object.keys(orphan).length, notes:notes};}
