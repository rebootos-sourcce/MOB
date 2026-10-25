/* ============================================================
   THE DATA THE FOUR KNOWLEDGE BASE MOCKUPS SHARE.

   Nothing here is written by hand. The entry text is read out of the
   engine's own tables, and the per person figures in icp.json were read
   out of the committed build at b434f1a with loadP(i) then compute(), for
   the six reference profiles in engine/data/people.js. So a figure a
   mockup prints is the figure the shipped app would print for that
   person on the same entry.

   node proto/knowledge/src/gen-data.js [engine.js]  ->  src/data.js

   The engine is read from the path given, default the committed one via
   git, because the working tree engine.js may be mid change by another seat.
   ============================================================ */
const fs=require('fs'), vm=require('vm'), path=require('path'), cp=require('child_process');
const ROOT=path.join(__dirname,'..','..','..');
const src=process.argv[2]?fs.readFileSync(process.argv[2],'utf8')
 :cp.execSync('git show HEAD:engine.js',{cwd:ROOT,maxBuffer:64e6}).toString();
const ctx={console}; vm.createContext(ctx);
vm.runInContext(src+`;this.__={NODES,CHILD,MASKS,ARCH,GLOSS,HCX_LIB,ALL_SAB,SABDEF,
 DOMAINS,DOMDEF,APC,AXCARD,PAL,SEATGLYPH,BANDS,KB_KEY,
 AXLINE:CHILD.map(function(c){return axLine(c.nm);}), DESCENT};`,ctx);
const nerveSource=fs.readFileSync(path.join(ROOT,'atuned_src','engine','data','nerves.js'),'utf8');
const nerveCtx={}; vm.createContext(nerveCtx);
vm.runInContext(nerveSource+';this.__nerves=NERVEBR;',nerveCtx);
const NERVE_BRANCHES=nerveCtx.__nerves;
const NERVE_TO_BAND={root:'Root',sacral:'Sacral',solar:'Solar',heart:'Heart',throat:'Throat',eye:'3rd Eye',crown:'Crown'};
const cardSource=fs.readFileSync(path.join(ROOT,'atuned_src','engine','data','sabcard.js'),'utf8');
const cardCtx={}; vm.createContext(cardCtx); vm.runInContext(cardSource+';this.__cards=SABCARD;',cardCtx);
const SAB_CARDS=cardCtx.__cards;
const cardKey=s=>String(s==null?'':s).toLowerCase().replace(/[^a-z0-9]/g,'');
const SAB_CARDS_BY_KEY=Object.fromEntries(Object.entries(SAB_CARDS).map(([k,v])=>[cardKey(k),v]));
const T=ctx.__;
const runtimeResearchOverlayIndex=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_RUNTIME_RESEARCH_OVERLAY_INDEX.json'),'utf8'));
const runtimeResearchOverlayRecords=(runtimeResearchOverlayIndex.parts||[]).flatMap(part=>JSON.parse(fs.readFileSync(path.join(ROOT,part.path),'utf8')).records||[]);
const runtimeResearchOverlayById=new Map(runtimeResearchOverlayRecords.map(record=>[record.id,record]));
const AXIS_RESEARCH_FALLBACKS={
 Surprise:{
  says:'PROVISIONAL RESEARCH CONTEXT: I did not expect this; notice what changed before deciding what it means.',
  inst:'PROVISIONAL RESEARCH CONTEXT: Pause, identify the unexpected cue, compare it with the prior expectation, and gather context before reacting.',
  sources:['https://pubmed.ncbi.nlm.nih.gov/23317823/'],
  synthesis:'Surprise links cognition and emotion and is shaped by expectations about likelihood; the meaning and valence of an unexpected event depend on appraisal and context.',
  limitations:'These phrases are provisional prompts, not source-authored ATÜNED language. Surprise is not inherently positive, negative, or evidence of danger.'
 },
 Anticipation:{
  says:'PROVISIONAL RESEARCH CONTEXT: Something may happen; prepare for what the available evidence suggests, not for certainty you do not have.',
  inst:'PROVISIONAL RESEARCH CONTEXT: Name the expected outcome, separate evidence from imagined certainty, prepare proportionately, and update when new information arrives.',
  sources:['https://pubmed.ncbi.nlm.nih.gov/32061891/','https://pubmed.ncbi.nlm.nih.gov/18829428/','https://pubmed.ncbi.nlm.nih.gov/17500652/'],
  synthesis:'Anticipatory feelings combine prediction, bodily and affective response, and preparation. Anticipation can shape choice, while imagined future emotion may be more intense than later recollection.',
  limitations:'These phrases are provisional prompts, not source-authored ATÜNED language. Anticipation is not inherently anxiety, accurate prediction, or a reliable signal that an event will occur.'
 }
};
const DOMAIN_RESEARCH_FALLBACKS={
 Descent:{
  clear:'PROVISIONAL RESEARCH CONTEXT, NOT SOURCE-CANON: Choose a meaningful cost or ending with consent, proportion, and awareness of alternatives; retain agency and learn without glorifying pain.',
  dist:'PROVISIONAL RESEARCH CONTEXT, NOT SOURCE-CANON: Self-abandonment, coerced sacrifice, martyrdom, or treating suffering as proof that a choice is wise.',
  sources:['https://pubmed.ncbi.nlm.nih.gov/32673005/','https://pubmed.ncbi.nlm.nih.gov/34571369/'],
  synthesis:'Sacrifice research treats willingness, behavior, satisfaction, and cost as distinct; outcomes vary with choice, context, and consequences.',
  limitations:'General sacrifice research does not define the project-specific Descent domain or establish its canonical meaning. Preserve the source label and keep this interpretation provisional.'
 },
 Connection:{
  clear:'PROVISIONAL RESEARCH CONTEXT, NOT SOURCE-CANON: Maintain meaningful connection through responsive care, mutual understanding, reciprocity, and boundaries that preserve each person’s agency.',
  dist:'PROVISIONAL RESEARCH CONTEXT, NOT SOURCE-CANON: Enmeshment, coercion, one-way extraction, or withdrawal treated as the only safe response when connection is appropriate.',
  sources:['https://www.nature.com/articles/s44159-025-00455-9','https://pubmed.ncbi.nlm.nih.gov/36201836/'],
  synthesis:'Social connection is multidimensional and includes subjective perceptions, network structure, synchrony, and interpersonal behavior; these dimensions should not be collapsed.',
  limitations:'General social-connection research does not define the project-specific Connection domain. Closeness is not always safe or coherent; distance may be protective.'
 },
 Exchange:{
  clear:'PROVISIONAL RESEARCH CONTEXT, NOT SOURCE-CANON: Exchange information, attention, resources, or value with explicit expectations, consent, reciprocity, and repair when a transaction is unequal or misunderstood.',
  dist:'PROVISIONAL RESEARCH CONTEXT, NOT SOURCE-CANON: Manipulation, extraction, assumed consent, hidden conditions, or reducing relationships to scorekeeping.',
  sources:['https://pubmed.ncbi.nlm.nih.gov/36710813/','https://pmc.ncbi.nlm.nih.gov/articles/PMC9878386/'],
  synthesis:'Social-exchange research describes transactions, reciprocity, exchanged resources, and resulting relationships, while noting broad definitions and unresolved questions in psychological exchange.',
  limitations:'General social-exchange theory does not establish the project-specific Exchange domain or make every relationship transactional. Reciprocity and fairness require context.'
 },
 Restoration:{
  clear:'PROVISIONAL RESEARCH CONTEXT, NOT SOURCE-CANON: Rebuild capacity after disruption through support, pacing, consent, feedback, and practical reorganization; recovery need not recreate the exact prior state.',
  dist:'PROVISIONAL RESEARCH CONTEXT, NOT SOURCE-CANON: Denying injury, forcing a return to the prior state, rescuing without consent, or treating visible growth as mandatory.',
  sources:['https://pubmed.ncbi.nlm.nih.gov/39429523/','https://pubmed.ncbi.nlm.nih.gov/38657292/','https://pubmed.ncbi.nlm.nih.gov/33126037/'],
  synthesis:'Resilience and recovery literature treats adaptation as dynamic and context-dependent; repair may involve support, meaning, and reorganization rather than simple restoration.',
  limitations:'General recovery research does not define the project-specific Restoration domain or guarantee recovery. These descriptions are provisional context, not a clinical protocol.'
 }
};
const clean=s=>String(s==null?'':s).replace(/\s*--\s*/g,', ').replace(/\u2014/g,', ').trim();
/* the first sentence, or two when the first is a fragment under forty
   characters, because E1 wants the definition in the first clause and the
   card only has room for that. */
const lead=s=>{s=clean(s); const m=s.match(/^(.+?[.!?])(\s|$)/); if(!m)return s;
 let a=m[1]; if(a.length<40){const r=s.slice(a.length).trim().match(/^(.+?[.!?])(\s|$)/); if(r)a+=' '+r[1];}
 return a;};

const E=[];   /* every entry, one shape */
const add=o=>{E.push(o); return o;};

/* the seven seats */
T.APC.forEach(c=>add({id:'seat:'+c.b, kind:'seat', nm:c.b, seat:c.b,
 fam:clean(c.nv), def:lead(c.d), body:clean(c.d), ic:null}));

/* the nine child emotions, and the letting go card that speaks each */
T.CHILD.forEach((c,i)=>{const ax=T.AXCARD.filter(a=>a.ax===c.nm)[0]||{}; const fallback=AXIS_RESEARCH_FALLBACKS[c.nm]||null;
 add({id:'axis:'+c.nm, kind:'axis', nm:c.nm, seat:c.seat, fam:c.seat+' seat',
  def:c.nm+', one of the nine child emotions, seated in the '+c.seat+' seat.',
  card:'Felt in the '+c.loc+'. Emptied, it fills with '+c.opp+'.',
  where:'Held at: '+c.addr.toLowerCase()+'. Felt in the '+c.loc+'.',
  says:clean(ax.track||(fallback&&fallback.says)||''), out:clean(T.AXLINE[i]),
  inst:clean(ax.inst||(fallback&&fallback.inst)||''), opp:c.opp, ic:c.ic,
  sourceFieldStatus:fallback?'source_says_and_instruction_missing_provisional_research_fallback':'source_card_fields_present',
  researchStatus:fallback?'provisional_research_context_not_source_canon':'source_card_content_present',
  researchSources:fallback?fallback.sources:[],
  researchSynthesis:fallback?fallback.synthesis:null,
  researchLimitations:fallback?fallback.limitations:null});});

/* The 72 artwork branches are explicit records. Their only supported
   semantic join to nodes is seat/band-level: the artwork labels branches by
   chakra seat, while nodes carry a seat band. Do not interpret this as a
   clinically/anatomically verified one-branch-to-one-node mapping. */
const nerveSeatCounts={};
NERVE_BRANCHES.forEach((b,i)=>{
 const seat=String(b.s||'').toLowerCase();
 const band=NERVE_TO_BAND[seat];
 const nerveId='nerve:'+seat+':'+(nerveSeatCounts[seat]=(nerveSeatCounts[seat]||0)+1);
 const nodeIds=band?T.NODES.filter(n=>n.b===band).map(n=>'node:'+n.i):[];
 add({id:nerveId,kind:'nerve',nm:seat+' nerve branch '+nerveSeatCounts[seat],
  seat:band||seat,fam:'nerve artwork branch',
  def:'A traced nerve-artwork branch assigned to the '+(band||seat)+' seat group.',
  branchIndex:i+1,sourceSeat:seat,pointCount:Array.isArray(b.p)?b.p.length:0,
  mappingBasis:band?'seat/band join only; not a one-to-one anatomical nerve mapping':'no matching node band; unresolved',
  mappedNodeIds:nodeIds,narrativeSource:'atuned_src/engine/data/nerves.js; seat-level crosswalk to nodes.js'});
});
/* the 112 addresses */
T.NODES.forEach(n=>{const field=T.BANDS.indexOf(n.b)<0;
 const seat=field?(n.b==='Field-Above'?'Crown':'Root'):n.b;
 const ax=T.CHILD.filter(c=>c.nm===n.c)[0];
 add({id:'node:'+n.i, kind:'node', nm:n.k, seat:seat, idx:n.i-1,
  fam:field?'field anchor':n.b+' seat',
  def:n.k+', a fetter held at the '+clean(n.n)+'.',
  where:clean(n.n)+', '+(field?'a field anchor '+(n.b==='Field-Above'?'above':'below')+' the body':'in the '+n.b+' seat')+'.',
  card:'Governs '+clean(n.a).toLowerCase()+'. Distorts into '+clean(n.d).toLowerCase()+'.',
  theme:clean(n.a), distort:clean(n.d), axis:n.c||null,
  axisStatus:n.c?'source_axis_explicit':'source_axis_not_specified',
  ic:(ax&&ax.ic)||null,
  body:'This fetter is organized around '+clean(n.a)+'. The linked distortion is '+clean(n.d)+'. Its relationship to the '+(n.c||'linked')+' axis is the canonical route for interpreting this record.',
  trigger:'Notice when '+clean(n.a).toLowerCase()+' becomes charged and the response begins moving toward '+clean(n.d).toLowerCase()+'.',
  says:'The active pattern frames '+clean(n.a).toLowerCase()+' through the distortion '+clean(n.d).toLowerCase()+'. Treat this as a signal to examine, not as a fact that must govern the response.',
  out:'Name the observed situation, separate it from the '+clean(n.d).toLowerCase()+' interpretation, and return to the linked axis and its canonical opposite before choosing a response.',
  inst:ax?'The canonical opposite for the linked '+ax.nm+' axis is '+ax.opp+'. Use the axis record for its full installation language.':'No opposite is assigned in the canonical source for this node. Do not infer one.',
  opp:ax?ax.opp:'Unmapped',
  nextMove:ax?'Identify the trigger, name '+clean(n.a).toLowerCase()+' and '+clean(n.d).toLowerCase()+', then open the linked '+n.c+' record and practice its canonical opposite state.':'Trace this node to an approved canonical axis or source definition before selecting an opposite state.',
  narrativeSource:'derived from engine node fields and linked canonical axis'});});

/* all thirty nine Saboteurs use one complete record shape. Existing authored cards retain their reviewed copy;
   inferred records are explicitly derived from their linked canonical node/child records. */
T.ALL_SAB.forEach(s=>{
 const d=T.SABDEF[T.KB_KEY(s.nm)];
 const fam=T.HCX_LIB.filter(h=>h.nm===s.hcx)[0];
 const card=SAB_CARDS_BY_KEY[cardKey(s.nm)]||null;
 const nodes=(s.nids||[]).map(i=>T.NODES.find(x=>x.i===i)).filter(Boolean);
 const children=nodes.map(n=>T.CHILD.find(x=>x.nm===n.c)).filter(Boolean);
 const themes=[...new Set(nodes.map(n=>n.a).filter(Boolean))];
 const distortions=[...new Set(nodes.map(n=>n.d).filter(Boolean))];
 const opposites=[...new Set(children.map(x=>x.opp).filter(Boolean))];
 const themeLine=themes.length?themes.join(', '):'the linked pattern';
 const distortionLine=distortions.length?distortions.join(', '):'automatic reaction';
 const oppositeLine=opposites.length?opposites.join(', '):'a more conscious response';
 const inferredBody='This inferred Saboteur pattern organizes around '+themeLine+'. Its linked records describe distortions such as '+distortionLine+'. Treat this as a working synthesis of the linked canonical records, not a separately sourced quotation.';
 const inferredTrigger='The pattern may activate around '+themeLine+'. Notice the specific moment when the linked distortion ('+distortionLine+') begins shaping perception or choice.';
 const inferredSays='The implied inner message is that the familiar response is necessary: '+distortionLine+'. Check that message against what is actually happening before acting.';
 const inferredOut='Interrupt the automatic response by naming the linked distortion ('+distortionLine+'), separating the observed facts from the interpretation, and making room for '+oppositeLine+'.';
 const inferredStory='A situation involving '+themeLine+' brings the pattern into focus. The person may default to '+distortionLine+', narrowing the available choices. The story is not a fixed identity: identify the trigger, trace which linked child pattern is active, and notice the cost of repeating the response.';
 const inferredAvailable='When the pattern is noticed rather than obeyed, '+oppositeLine+' becomes a possible direction. This is an available state to practice, not a claim that the pattern has permanently disappeared.';
 const inferredNext='Pause at the first observable sign. Name the relevant theme ('+themeLine+'), identify the distortion ('+distortionLine+'), and choose one small action consistent with '+oppositeLine+'. Then review the result without turning it into a judgment about identity.';
 add({id:'sab:'+s.nm, kind:'somatic_signature', nm:s.nm, seat:(fam&&fam.b)||'Heart',
  fam:s.hcx||'unnamed',
  def:d?lead(d.d):(fam?s.nm+', a saboteur in the '+fam.nm+' architecture: '+fam.d+'.':s.nm+', a saboteur pattern inferred from its linked canonical records.'),
  body:d?clean(d.d):inferredBody,
  trigger:d?clean(d.t):inferredTrigger,
  says:d?clean(d.q):inferredSays,
  out:d?clean(d.i):inferredOut,
  livedBehavior:card?clean(card.h):clean(d?('A situation brings '+d.t+' The response is '+d.d+'. Reflection: What is happening, and what response can you choose?'):inferredStory),
  availableState:card?clean(card.a):clean(inferredAvailable),
  nextMove:card?clean(card.n):clean(inferredNext),
  narrativeSource:card?'atuned_src/engine/data/sabcard.js':(d?'SABDEF plus linked canonical node fields':'inferred synthesis from linked canonical node/child fields; review as derived copy'),
  nids:s.nids||[], arch:s.hcx||null, ic:(fam&&fam.ic)||null});
});

/* six architectures the saboteurs belong to */
T.HCX_LIB.forEach(h=>add({id:'hcx:'+h.nm, kind:'hcx', nm:h.nm, seat:h.b, fam:'architecture',
 def:h.nm+': '+clean(h.d)+'.', sub:clean(h.sub), ic:h.ic}));

/* source-defined higher-order descent entries. Keep the three named steps
   distinct from the six HCX architecture records; provenance is compass.js.
   Do not treat this small explicit descent as a complete complex registry. */
[].forEach((d,i)=>add({
 id:'descent:'+d.nm,
 kind:d.kind==='complex'?'complex':(d.kind==='super complex'?'supercomplex':'hcx'),
 nm:d.nm, seat:null, fam:'higher-order descent',
 def:clean(d.d), body:clean(d.d),
 inferred:!!d.content.inferred,
 inferenceBasis:d.content.inferenceBasis,
 behavior:d.content.behavior,
 triggerMechanism:d.content.triggerMechanism,
 livedExample:d.content.livedExample,
 impact:d.content.impact,
 practice:d.content.practice,
 oppositeId:d.content.oppositeId,
 oppositeDefinition:d.content.oppositeDefinition,
 oppositeStatus:d.content.oppositeStatus,
 confidence:d.content.confidence,
 reviewStatus:d.content.reviewStatus,
 gate:d.gate||null, refer:!!d.refer,
 narrativeSource:'atuned_src/engine/data/compass.js DESCENT; external research sources recorded per entry',
 researchSources:d.content.researchSources,
 researchPasses:d.content.researchPasses||[],
 descentOrder:i
}));

/* Each higher-order item receives a separate, explicitly INFERRED counterpart
   record. These are working therapeutic/coherence poles, not canonical claims.
   Provenance, confidence, and review status travel with the record. */
[].forEach(d=>{
 const c=d.content;
 add({
  id:c.oppositeId, kind:'inferred', nm:c.oppositeName||('Counterpart to '+d.nm),
  seat:null, fam:'inferred counterpart',
  def:c.oppositeDefinition, body:c.oppositeDefinition,
  inferred:true,
  inferenceBasis:c.inferenceBasis+' Counterpart wording is a provisional synthesis for review, not a canonical source statement.',
  behavior:c.oppositeDefinition,
  triggerMechanism:'Use this counterpart as a deliberate response when the linked pattern is observed; do not assume the person has or lacks this capacity globally.',
  livedExample:'In the same situation that would trigger '+d.nm+', the person checks facts, considers the other party’s perspective and agency, and chooses an accountable response consistent with this counterpart.',
  impact:'Supports more reciprocal, transparent, harm-aware decisions; outcome must be assessed from behavior rather than inferred identity.',
  practice:'Name the trigger, identify who is affected, state the facts transparently, and choose one observable action consistent with the counterpart. Review the impact and repair any harm.',
  oppositeId:'super:descent-candidate:'+slug(d.nm),
  oppositeDefinition:clean(d.d),
  oppositeStatus:'inferred-working-counterpart; reciprocal navigation pair; owner/canon review required',
  confidence:c.confidence,
  reviewStatus:c.reviewStatus,
  narrativeSource:'derived counterpart synthesis; not canonical',
  researchSources:c.researchSources||[],
  researchPasses:c.researchPasses||[]
 });
});

/* Six canonical hyper-complex modes from SNIFFER_SPEC.md, section 5.
   These are framework modes, not clinical diagnoses or direct equivalents of
   schema-therapy constructs. Research sources support adjacent constructs only.
   Every mode has a separate inferred coherent/inversion counterpart record;
   those counterparts are explicitly provisional, not canon. */
const HYPERCOMPLEX_MODES=[
 {name:'Grandiosity',cluster:'I · Narcissism',
  definition:'A mode organized around an inflated or exceptional self-position, status protection, entitlement, and treating other people as less authoritative or less important.',
  behavior:'May appear as superiority claims, status-seeking, special-rule expectations, dismissal of feedback, or using admiration to stabilize self-worth.',
  triggerMechanism:'Possible triggers include perceived disrespect, criticism, loss of status, shame, or a threat to the preferred self-image. This is a working formulation, not a universal cause.',
  livedExample:'After receiving corrective feedback, a person dismisses the source as inferior and insists ordinary standards do not apply to them.',
  impact:'Can impair reciprocity, learning, trust, and accountability when the pattern dominates; assess observable behavior and context rather than assigning an identity.',
  practice:'Describe the observable event without ranking people; identify the threatened need; invite disconfirming evidence; acknowledge one specific contribution or boundary from another person.',
  inverseName:'Grounded Mutual Worth',inverseDefinition:'An inferred counterpart emphasizing stable self-respect without superiority: equal human worth, realistic appraisal, openness to feedback, and respect for others’ agency.',
  basis:'Framework mode Grandiosity maps to Cluster I / Narcissism in SNIFFER_SPEC.md. Adjacent research describes schema modes such as Self-Aggrandizer and notes grandiosity/status protection; it does not validate this ATÜNED category as a clinical construct.',
  confidence:0.78,
  sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC8813040/','https://pmc.ncbi.nlm.nih.gov/articles/PMC5177643/']},
 {name:'Predatory',cluster:'II',
  definition:'A mode organized around instrumental pursuit of a target or outcome while discounting the other party’s safety, autonomy, or suffering.',
  behavior:'May include cold strategic pressure, exploitation, concealment of intent, treating people as obstacles, or planning actions without regard for harm.',
  triggerMechanism:'May be activated by a perceived obstacle, rival, threat, or desired gain. This describes a possible pattern, not a diagnosis or a claim about any person.',
  livedExample:'A person quietly plans how to remove a rival and evaluates only whether the plan will succeed, not the foreseeable harm.',
  impact:'Can create significant relational or physical risk. Prioritize concrete behavior, boundaries, and safety; do not infer this mode from a label alone.',
  practice:'Stop the harmful action; state the intended outcome and who could be affected; assess consent and foreseeable harm; choose a lawful, transparent alternative and seek appropriate support if safety is at risk.',
  inverseName:'Protective, Consensual Agency',inverseDefinition:'An inferred counterpart that pursues legitimate goals transparently while respecting consent, safety, rights, and the other party’s independent interests.',
  basis:'Framework mode Predatory is Cluster II in SNIFFER_SPEC.md. Adjacent forensic schema-mode literature describes a Predator mode as cold, calculating, and focused on eliminating a perceived threat; this is analogy, not equivalence.',
  confidence:0.74,
  sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC6184370/','https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.01987/full']},
 {name:'Collapse',cluster:'III',
  definition:'A mode of marked contraction in agency, initiative, or perceived possibility, in which withdrawal or surrender can replace active engagement.',
  behavior:'May appear as shutdown, giving up, passivity, inability to initiate, or treating a difficult state as proof that no useful action is possible.',
  triggerMechanism:'Possible triggers include overwhelm, repeated perceived failure, threat, exhaustion, or loss. The label is a framework hypothesis and must not be used to infer a medical condition.',
  livedExample:'After a setback, a person stops seeking options and concludes that no action can change the outcome.',
  impact:'May narrow problem-solving and access to support. Similar outward behavior can have many causes, so assess context and needs rather than pathologizing it.',
  practice:'Reduce the task to one safe, observable next step; identify available support; distinguish present constraints from global conclusions; seek professional care when distress is severe or persistent.',
  inverseName:'Supported Re-engagement',inverseDefinition:'An inferred counterpart emphasizing grounded support, small feasible actions, restored choice, and realistic hope without denying pain or constraints.',
  basis:'Framework mode Collapse is Cluster III in SNIFFER_SPEC.md. Research on schema modes describes detached, surrender, and dysregulated states, but does not establish this ATÜNED mode as an independently validated construct.',
  confidence:0.62,
  sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC8194201/','https://pmc.ncbi.nlm.nih.gov/articles/PMC5177643/']},
 {name:'Rigidity',cluster:'IV',
  definition:'A mode organized around inflexible rules, certainty, and resistance to updating a response when context or evidence changes.',
  behavior:'May appear as all-or-nothing standards, repeated insistence on one correct method, intolerance of ambiguity, or prioritizing control over adaptation.',
  triggerMechanism:'Possible triggers include uncertainty, perceived disorder, mistakes, or threat to predictability. These are hypotheses to test, not assumed causes.',
  livedExample:'A plan no longer fits the situation, but a person insists on following it because changing course feels unacceptable.',
  impact:'Can impair adaptation, collaboration, and repair; structure itself is not the problem unless it overrides evidence, context, or people’s needs.',
  practice:'Name the purpose behind the rule; list what has changed; generate two safe alternatives; retain the principle while adapting the method.',
  inverseName:'Flexible Integrity',inverseDefinition:'An inferred counterpart that preserves values and accountability while adapting methods to evidence, context, and legitimate needs.',
  basis:'Framework mode Rigidity is Cluster IV in SNIFFER_SPEC.md. Schema-therapy literature describes over-controller modes and rigid rule/standard patterns as adjacent constructs, not as a one-to-one match.',
  confidence:0.69,
  sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC8813040/','https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.01987/full']},
 {name:'Dysregulation',cluster:'V',
  definition:'A mode in which emotional or behavioral activation becomes difficult to modulate in proportion to the situation, reducing the ability to pause, integrate signals, and choose a response.',
  behavior:'May include rapid escalation, abrupt shifts, impulsive action, or difficulty returning to baseline after activation; record the actual observed behavior.',
  triggerMechanism:'Activation can be shaped by stress, unmet needs, threat, sleep, environment, and other factors. Do not assume a single cause or diagnosis.',
  livedExample:'During conflict, activation rises quickly and the person acts before checking the facts or considering consequences.',
  impact:'Can strain relationships and decision-making. This record is a descriptive framework aid, not a substitute for assessment of medical or mental-health concerns.',
  practice:'Pause when safe; orient to immediate facts; reduce stimulation; use a practiced grounding or regulation skill; revisit the decision after activation decreases.',
  inverseName:'Regulated Responsiveness',inverseDefinition:'An inferred counterpart emphasizing awareness of activation, proportionate response, recovery, and deliberate choice without suppressing legitimate emotion.',
  basis:'Framework mode Dysregulation is Cluster V in SNIFFER_SPEC.md. Published reviews discuss emotion-regulation difficulties and schema modes, but do not validate this exact ATÜNED category.',
  confidence:0.72,
  sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC5177643/','https://pmc.ncbi.nlm.nih.gov/articles/PMC8194201/']},
 {name:'Dissociation',cluster:'VI',
  definition:'A mode characterized here as disconnection or compartmentalization in experience, with reduced integration between present cues, feeling, memory, or action.',
  behavior:'Possible signs can include feeling detached, emotionally distant, unreal, or disconnected from the present; these signs are nonspecific and should not be used to diagnose dissociation.',
  triggerMechanism:'Dissociative experiences can have multiple causes and require careful contextual assessment. Do not presume trauma, disorder, or a specific mechanism from this framework label.',
  livedExample:'In a stressful interaction, a person reports feeling distant from the situation and has difficulty staying connected to what is happening.',
  impact:'May affect presence, communication, and recall. If symptoms are recurrent, distressing, or impairing, recommend assessment by a qualified health professional.',
  practice:'Use a gentle present-orientation exercise if welcome and safe; invite the person to notice current surroundings and choices; avoid forcing recall or exposure; seek qualified support for persistent symptoms.',
  inverseName:'Integrated Present Connection',inverseDefinition:'An inferred counterpart emphasizing safe contact with present experience, continuity between feeling and action, and paced integration without forcing or denying experience.',
  basis:'Framework mode Dissociation is Cluster VI in SNIFFER_SPEC.md. Schema-mode literature discusses separation between modes and detached states; that is adjacent literature, not proof that this framework category is a clinical equivalent.',
  confidence:0.58,
  sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC5177643/','https://pmc.ncbi.nlm.nih.gov/articles/PMC8813040/']}
];
HYPERCOMPLEX_MODES.forEach((m,i)=>{
 const id='hypercomplex:'+m.name;
 const oppositeId='inferred:hypercomplex-inverse:'+m.name;
 add({id,kind:'hypercomplex_mode',nm:m.name,seat:null,fam:'hyper-complex mode',cluster:m.cluster,
  def:m.definition,body:m.definition,behavior:m.behavior,triggerMechanism:m.triggerMechanism,
  livedExample:m.livedExample,impact:m.impact,practice:m.practice,
  inferred:false,inferenceBasis:m.basis,confidence:m.confidence,
  reviewStatus:'research-populated working record; canon/owner review required; not diagnosis',
  oppositeId,oppositeDefinition:m.inverseDefinition,
  oppositeStatus:'inferred-working-counterpart; not canonical; review required',
  narrativeSource:'SNIFFER_SPEC.md section 5 plus adjacent research; see researchSources',
  researchSources:m.sources,sourceRefs:['SNIFFER_SPEC.md section 5','proto/knowledge/src/gen-data.js HYPERCOMPLEX_MODES'],
  sourceClaims:[m.definition,m.basis],researchPasses:[{pass:1,name:'source_extraction',status:'complete',sources:['SNIFFER_SPEC.md section 5','proto/knowledge/src/gen-data.js HYPERCOMPLEX_MODES'],findings:[m.definition,m.basis],reviewedAt:'2026-10-24'},{pass:2,name:'independent_depth_research',status:'pending',sources:[],findings:['Cited research sources require independent review against this specific framework record.'],reviewedAt:null},{pass:3,name:'adversarial_review',status:'pending',sources:[],findings:['Counterexamples, alternatives, and boundary conditions remain to be tested.'],reviewedAt:null}],clusterOrder:i+1,links:[oppositeId]});
 add({id:oppositeId,kind:'inferred',nm:m.inverseName,seat:null,fam:'inferred hyper-complex counterpart',
  def:m.inverseDefinition,body:m.inverseDefinition,behavior:m.inverseDefinition,
  triggerMechanism:'Use as a possible deliberate response after identifying the observed pattern; do not assume a person possesses or lacks this capacity globally.',
  livedExample:'In a situation that activates '+m.name+', the person identifies the observable facts and chooses one action consistent with '+m.inverseDefinition.toLowerCase(),
  impact:'Working counterpart for reflection and practice; effects must be evaluated from observed behavior, not inferred identity.',
  practice:'Name the trigger, check the facts, choose one small observable action aligned with the counterpart, and review its effects.',
  inferred:true,inferenceBasis:'Inferred inversion for the ATÜNED hyper-complex mode '+m.name+'. This is a working design hypothesis, not a canonical or clinical claim.',
  confidence:m.confidence,reviewStatus:'inferred; owner/canon review required',
  oppositeId:id,oppositeDefinition:m.definition,oppositeStatus:'inferred reciprocal navigation pair',
  narrativeSource:'derived inferred counterpart; not canonical',researchSources:m.sources,
  sourceRefs:['SNIFFER_SPEC.md section 5','proto/knowledge/src/gen-data.js HYPERCOMPLEX_MODES'],
  sourceClaims:[m.inverseName,m.inverseDefinition,'This is an inferred working counterpart, not a canonical or clinical claim.'],
  researchPasses:[{pass:1,name:'source_and_synthesis_extraction',status:'complete',sources:['proto/knowledge/src/gen-data.js HYPERCOMPLEX_MODES'],findings:[m.inverseName,m.inverseDefinition],reviewedAt:'2026-10-24'},{pass:2,name:'independent_depth_research',status:'pending',sources:[],findings:['Inverse behavior and examples require independent validation.'],reviewedAt:null},{pass:3,name:'adversarial_review',status:'pending',sources:[],findings:['Test false positives, alternative responses, and whether the proposed counterpart is actually opposite.'],reviewedAt:null}],
  cluster:m.cluster,links:[id]});
});

/* masks, archetypes, domains */
T.MASKS.forEach(m=>add({id:'mask:'+m.nm, kind:'mask', nm:m.nm, seat:(m.b&&m.b[0])||'Heart',
 fam:(m.b||[]).join(' and '), def:'The '+m.nm.toLowerCase()+' mask '+clean(m.v)+'.', ic:m.ic}));
T.ARCH.forEach((a,i)=>add({id:'arch:'+a.nm, kind:'arch', nm:a.nm, seat:a.b||'Heart', idx:i,
 fam:(a.b||'Heart')+' seat', def:'The '+a.nm.toLowerCase()+' '+clean(a.v)+'.', ic:a.ic}));
T.DOMAINS.forEach((d,i)=>{const x=T.DOMDEF[T.KB_KEY(d.nm)]; const fallback=DOMAIN_RESEARCH_FALLBACKS[d.nm]||null;
 add({id:'dom:'+d.nm, kind:'dom', nm:d.nm, seat:'Heart', idx:i, fam:d.r+' root',
  def:d.nm+', '+clean(d.d)+'.',
  clear:x?clean(x.c):(fallback?fallback.clear:''), dist:x?clean(x.x):(fallback?fallback.dist:''),
  researchStatus:fallback?'provisional_research_context_not_source_canon':'source_domain_definition_present',
  researchSources:fallback?fallback.sources:[],
  researchSynthesis:fallback?fallback.synthesis:null,
  researchLimitations:fallback?fallback.limitations:null,
  canonicalStatus:fallback?'source_label_preserved; content interpretation provisional':'source-derived domain content',
  ic:d.ic||null});});

/* the glossary, which answers a search first */
T.GLOSS.forEach(g=>add({id:'term:'+g.t, kind:'term', nm:g.t, seat:null, fam:'term',
 def:clean(g.d)}));

/* links, computed from the tables and never typed: an axis links to its
   addresses and its opposite's entry where one exists; an address links to
   its axis, its seat and the saboteurs that sit on it; a saboteur links to
   its addresses and its architecture. */
for(const entry of E){
 const overlay=runtimeResearchOverlayById.get(entry.id);
 if(!overlay)continue;
 const sourceDefinitionMatches=!overlay.sourceDefinitionVerbatim||overlay.sourceDefinitionVerbatim===entry.def;
 const sourceWhereMatches=!overlay.sourceWhereVerbatim||overlay.sourceWhereVerbatim===entry.where;
 if(!sourceDefinitionMatches||!sourceWhereMatches){
  entry.runtimeResearchOverlayStatus='source_drift_recheck_required';
  entry.runtimeResearchOverlayMismatch={definition:!sourceDefinitionMatches,where:!sourceWhereMatches};
  continue;
 }
 entry.sourceDefinitionVerbatim=overlay.sourceDefinitionVerbatim||entry.def;
 if(overlay.sourceWhereVerbatim)entry.sourceWhereVerbatim=overlay.sourceWhereVerbatim;
 for(const [key,value] of Object.entries(overlay)){
  if(['id','sourceDefinitionVerbatim','sourceWhereVerbatim','def','where'].includes(key))continue;
  entry[key]=value;
 }
 if(overlay.def)entry.def=overlay.def;
 if(overlay.where)entry.where=overlay.where;
 entry.runtimeResearchOverlayStatus='applied_source_verified';
}
const by={}; E.forEach(e=>by[e.id]=e);
E.forEach(e=>{e.links=[];});
/* Hyper-complex mode ↔ inferred counterpart is an explicit reciprocal pair. Grandiosity maps to the source-defined Cluster I / Narcissism association; other direct parent mappings remain unresolved. */
E.filter(e=>e.kind==='hypercomplex_mode').forEach(h=>{const opposite=by[h.oppositeId]; if(opposite){h.links.push(opposite.id);opposite.links.push(h.id);}});
E.filter(e=>e.kind==='hypercomplex').forEach(h=>{const opposite=by[h.oppositeId]; if(opposite){h.links.push(opposite.id);opposite.links.push(h.id);} if(h.cluster==='I · Narcissism'&&by['descent:Narcissism']){h.links.push('descent:Narcissism');by['descent:Narcissism'].links.push(h.id);h.parentLinkBasis='source-defined Cluster I / Narcissism association in SNIFFER_SPEC.md';} else {h.parentLinkBasis='direct parent-complex mapping unresolved; no edge invented';}});
E.forEach(e=>{
 if(e.kind==='nerve'){
  e.mappedNodeIds.forEach(nid=>{if(by[nid]){e.links.push(nid);by[nid].links.push(e.id);}});
 }
 if(e.kind==='node'){ if(e.axis&&by['axis:'+e.axis])e.links.push('axis:'+e.axis);
  e.links.push('seat:'+e.seat);}
 if(e.kind==='sab'){ e.nids.forEach(i=>{const n='node:'+i; if(by[n]){e.links.push(n); by[n].links.push(e.id);}});
  if(e.arch&&by['hcx:'+e.arch]){e.links.push('hcx:'+e.arch); by['hcx:'+e.arch].links.push(e.id);}}
 if(e.kind==='axis'){ E.filter(n=>n.kind==='node'&&n.axis===e.nm).forEach(n=>e.links.push(n.id));
  e.links.unshift('seat:'+e.seat);}
 if(e.kind==='seat'){ E.filter(x=>x.kind==='axis'&&x.seat===e.nm).forEach(x=>e.links.push(x.id));}
});
/* Fetters (the nine canonical axes) connect to Saboteurs through their
   explicit shared node IDs. Keep these edges reciprocal and source-derived. */
E.filter(e=>e.kind==='sab').forEach(s=>{
 (s.nids||[]).forEach(i=>{
  const node=by['node:'+i];
  const axis=node&&node.axis?by['axis:'+node.axis]:null;
  if(axis){s.links.push(axis.id);axis.links.push(s.id);}
 });
});
/* Complex-to-Saboteur links are source-traceable through the same node/axis
   graph. The registry supplies the complex content; these declared axis
   families are provisional routing metadata and remain reviewable, not canon. */
const COMPLEX_AXIS_ROUTES={
 'Narcissism':['Shame','Fear','Control','Insecurity'],
 'Machiavellianism':['Fear','Control','Shame'],
 'Psychopathy':['Fear','Control','Shame','Anger']
};
T.DESCENT.forEach(d=>{
 const complex=by['descent:'+d.nm];
 if(!complex) return;
 const routeAxes=COMPLEX_AXIS_ROUTES[d.nm]||[];
 const routeNodeIds=new Set(E.filter(e=>e.kind==='node'&&routeAxes.includes(e.axis)).map(e=>e.id));
 const linkedSaboteurs=E.filter(e=>e.kind==='sab'&&(e.nids||[]).some(i=>routeNodeIds.has('node:'+i)));
 complex.routeAxes=routeAxes;
 complex.routeBasis='provisional axis-mediated routing; review required; each edge is traceable through shared node IDs';
 complex.links.push(...linkedSaboteurs.map(s=>s.id));
 linkedSaboteurs.forEach(s=>s.links.push(complex.id));
});
/* Hypercomplex-to-complex ecosystem wiring.
   Each mode is connected to Saboteurs through its declared axis route; those
   Saboteurs already connect reciprocally to the populated complex records.
   These routes are provisional navigation metadata, not claims of equivalence
   or canonical parentage. Direct parent-complex assignments remain open. */
const HYPERCOMPLEX_AXIS_ROUTES={
 'Grandiosity':['Shame','Fear','Control','Insecurity'],
 'Predatory':['Fear','Control','Shame','Anger'],
 'Collapse':['Fear','Shame','Insecurity'],
 'Rigidity':['Control','Shame','Fear'],
 'Dysregulation':['Fear','Anger','Shame'],
 'Dissociation':['Fear','Shame','Insecurity']
};
E.filter(e=>e.kind==='hypercomplex').forEach(h=>{
 const routeAxes=HYPERCOMPLEX_AXIS_ROUTES[h.nm]||[];
 const routeNodeIds=new Set(E.filter(e=>e.kind==='node'&&routeAxes.includes(e.axis)).map(e=>e.id));
 const linkedSaboteurs=E.filter(e=>e.kind==='sab'&&(e.nids||[]).some(i=>routeNodeIds.has('node:'+i)));
 h.routeAxes=routeAxes;
 h.routeBasis='no semantic mapping inferred from shared axis or seat; source-backed membership edge required';
 h.links.push(...linkedSaboteurs.map(s=>s.id));
 linkedSaboteurs.forEach(s=>s.links.push(h.id));
 const linkedComplexes=E.filter(e=>e.kind==='complex'&&linkedSaboteurs.some(s=>(s.links||[]).includes(e.id)));
 h.complexRouteIds=linkedComplexes.map(c=>c.id);
 h.links.push(...h.complexRouteIds);
 linkedComplexes.forEach(c=>c.links.push(h.id));
 if(!linkedComplexes.length) h.parentLinkBasis='no parent link inferred; source-backed membership edge required';
 else h.parentLinkBasis='provisional shared-axis path to populated complex records; not direct parent mapping';
});
/* Counterpart edges are explicit and reciprocal; both endpoints must exist. */
T.DESCENT.forEach(d=>{
 const original=by['descent:'+d.nm];
 const opposite=by[d.content.oppositeId];
 if(original&&opposite){
  original.links.push(opposite.id);
  opposite.links.push(original.id);
 }
});

/* The DESCENT registry is an explicitly source-defined ordered chain. */
const descentEntries=T.DESCENT.map(d=>by['descent:'+d.nm]).filter(Boolean);
descentEntries.forEach((e,i)=>{
 if(i>0)e.links.push(descentEntries[i-1].id);
 if(i<descentEntries.length-1)e.links.push(descentEntries[i+1].id);
});
E.forEach(e=>{e.links=[...new Set(e.links)].filter(l=>l!==e.id);});

/* Source-backed template binding. The template schema defines which fields
   are exposed for each existing record kind; values are projected from the
   authoritative engine-derived entry, never hand-written into generated data.
   A null value stays null and is reported by the validator, not fabricated. */
const TEMPLATE_SCHEMAS={
 hypercomplex_mode:{id:'TPL-HYPERCOMPLEX-MODE-V1', fields:['nm','fam','cluster','def','body','behavior','triggerMechanism','livedExample','impact','practice','inferred','inferenceBasis','confidence','reviewStatus','oppositeId','oppositeDefinition','oppositeStatus','narrativeSource','researchSources','sourceRefs','sourceClaims','researchPasses','links']},
 nerve:{id:'TPL-NERVE-BRANCH', fields:['nm','seat','fam','def','branchIndex','sourceSeat','pointCount','mappingBasis','mappedNodeIds','narrativeSource','links']},
 seat:{id:'TPL-SEAT', fields:['nm','fam','def','body','sourceDefinitionVerbatim','sourceWhereVerbatim','sourceClaimType','researchStatus','researchSources','researchSynthesis','researchLimitations','researchPasses','confidence','links']},
 axis:{id:'TPL-FETTER-AXIS', fields:['nm','seat','fam','def','card','where','sourceDefinitionVerbatim','sourceWhereVerbatim','sourceClaimType','researchStatus','researchSources','researchSynthesis','researchLimitations','researchPasses','confidence','says','inst','opp','links']},
 node:{id:'TPL-FETTER-NODE', fields:['nm','seat','fam','def','where','card','theme','distort','axis','body','trigger','says','out','inst','opp','nextMove','narrativeSource','links']},
 somatic_signature:{id:'TPL-SOMATIC-SIGNATURE-V1', fields:['nm','seat','fam','def','sourceDefinitionVerbatim','researchQualifiedDefinition','sourceClaimType','researchStatus','researchSources','researchSynthesis','researchLimitations','confidence','crossRecordAudit','body','trigger','says','out','livedBehavior','availableState','nextMove','nids','arch','sourceRefs','sourceClaims','researchPasses','links']},
 hcx:{id:'TPL-HYPERCOMPLEX', fields:['nm','seat','fam','def','sub','links']},
 complex:{id:'TPL-COMPLEX-UNIFIED', fields:['nm','fam','def','body','inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','narrativeSource','researchSources','links']},
 inferred:{id:'TPL-INFERRED-COUNTERPART-V1', fields:['nm','fam','def','body','inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','narrativeSource','researchSources','sourceRefs','sourceClaims','researchPasses','links']},
 supercomplex:{id:'TPL-SUPERCOMPLEX', fields:['nm','fam','def','body','inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','refer','narrativeSource','researchSources','researchPasses','links']},
 mask:{id:'TPL-MASK', fields:['nm','seat','fam','def','links']},
 arch:{id:'TPL-ARCHETYPE', fields:['nm','seat','fam','def','links']},
 dom:{id:'TPL-DOMAIN', fields:['nm','seat','fam','def','clear','dist','links']},
 term:{id:'TPL-GLOSSARY-TERM', fields:['nm','fam','def','links']}
};
E.forEach(e=>{
 if(!Array.isArray(e.researchPasses)||e.researchPasses.length!==3){
  e.sourceRefs=e.sourceRefs||['proto/knowledge/src/engine.js (runtime source table)'];
  e.sourceClaims=e.sourceClaims||[String(e.def||e.body||e.nm||e.id)];
  e.researchPasses=[{pass:1,name:'primary_source_extraction',status:'complete',sources:e.sourceRefs,findings:['Existing source/runtime fields extracted; this pass does not claim independent validation.'],reviewedAt:'2026-10-24'},{pass:2,name:'independent_corroboration_and_contradiction',status:'pending',sources:[],findings:['Independent source comparison and contradiction check remain pending.'],reviewedAt:null},{pass:3,name:'synthesis_and_cross_record_consistency',status:'pending',sources:[],findings:['Cross-record consistency, counterexample review, and boundary checks remain pending.'],reviewedAt:null}];
  e.researchStatus='pass2_pass3_pending';
 }
 const schema=TEMPLATE_SCHEMAS[e.kind];
 if(!schema) throw new Error('No template schema for entry kind '+e.kind+' ('+e.id+')');
 e.templateId=schema.id;
 const descentDetailFields=['inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','researchSources','researchPasses'];
 const assignedFields=(e.kind==='hcx'&&String(e.narrativeSource||'').includes('compass.js DESCENT'))?schema.fields.concat(descentDetailFields):schema.fields;
 e.template=Object.fromEntries(assignedFields.map(k=>[k,Object.prototype.hasOwnProperty.call(e,k)?e[k]:null]));
 const missingFields=assignedFields.filter(k=>{
  if(e.kind==='node'&&k==='axis'&&e.axisStatus==='source_axis_not_specified') return false;
  if(!Object.prototype.hasOwnProperty.call(e,k)||e[k]==null||e[k]==='') return true;
  /* Empty arrays are valid for relationship collections: a leaf may have no
     outgoing links. Do not report [] as missing content. */
  return false;
});
 e.templateValidation={schemaDefined:true, sourceBacked:true,
  contentStatus:missingFields.length?'incomplete':((e.researchPasses||[]).some(p=>p.status!=='complete')?'research_pending':'complete'),
  missingFields};
});

const psychRegistry=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json'),'utf8'));
const psychCatalog=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_TEMPLATE_CATALOG_v1.json'),'utf8'));
const superRegistry=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_SUPERCOMPLEX_CANDIDATE_REGISTRY_v1.json'),'utf8'));
const adaptedPsych=require('./psychological-runtime-adapter')(psychRegistry,psychCatalog,{namespace:'psych'});
const adaptedSuper=require('./psychological-runtime-adapter')(superRegistry,psychCatalog,{namespace:'super'});
const crossRegistryEdgeRegister=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_CROSS_REGISTRY_EDGE_REGISTER_v1.json'),'utf8'));
if(adaptedPsych.errors.length||adaptedSuper.errors.length)throw new Error('Registry adapter errors: '+JSON.stringify({deep:adaptedPsych.errors,supercomplex:adaptedSuper.errors}));
E.push(...adaptedPsych.entries,...adaptedSuper.entries);
const fetterResearchRegistry=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_FETTER_DEEP_RESEARCH_REGISTRY_108_v1.json'),'utf8'));
const fetterPromptRegistry=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_FETTER_NINE_REGISTER_PROMPTS_972_v1.json'),'utf8'));
const promptValidationIndex=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_FETTER_PROMPT_VALIDATION_OVERLAY_972_INDEX.json'),'utf8'));
const promptValidationRecords=(promptValidationIndex.parts||[]).flatMap(part=>JSON.parse(fs.readFileSync(path.join(ROOT,part.path),'utf8')).records||[]);
const promptValidationById=new Map(promptValidationRecords.map(prompt=>[prompt.promptId,prompt]));
const promptById=new Map((fetterPromptRegistry.records||[]).map(prompt=>[prompt.promptId,prompt]));
const mobPatternSourceRegistry=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_MOB_PATTERN_SOURCE_REGISTRY_108_OF_112_v1.json'),'utf8'));
const mobPatternByRuntimeId=new Map((mobPatternSourceRegistry.records||[]).filter(r=>r.runtimeNodeId).map(r=>[r.runtimeNodeId,r]));
const fetterByRuntimeId=new Map((fetterResearchRegistry.records||[]).filter(r=>r.runtimeNodeId).map(r=>[r.runtimeNodeId,r]));
for(const entry of E.filter(e=>e.kind==='node')){
 const r=fetterByRuntimeId.get(entry.id);
 const mob=mobPatternByRuntimeId.get(entry.id);
 const mobIndexMatch=mob&&entry.id==='node:'+(mob.sourceIndex+1);
 const mobAddressMatch=mob&&String(entry.where||'').toLowerCase().startsWith(String(mob.sourceNervousSystemLocation||'').toLowerCase()+',');
 const mobCrosswalkAllowed=mob&&(mob.sourcePatternName===entry.nm||cardKey(mob.sourcePatternName)===cardKey(entry.nm)||(mob.runtimeCrosswalkStatus==='source_index_and_anatomical_address_candidate_not_semantic_approval'&&mobIndexMatch&&mobAddressMatch));
 if(mob&&mob.runtimeNodeId===entry.id&&mobCrosswalkAllowed){
  entry.mobPatternSourceRecordId=mob.id;
  entry.mobPatternSourceStatus=mob.researchStatus;
  entry.mobPatternSourceCrosswalkStatus=mob.runtimeCrosswalkStatus;
  entry.mobPatternSourceCrosswalkEvidence=mob.runtimeCrosswalkEvidence||[];
  entry.mobPatternSource={sourceIndex:mob.sourceIndex,sourcePatternName:mob.sourcePatternName,sourceNervousSystemLocation:mob.sourceNervousSystemLocation,sourceShadowExpression:mob.sourceShadowExpression,sourceBandHeading:mob.sourceBandHeading,sourceVersionBoundary:mob.sourceVersionBoundary,runtimeCrosswalkStatus:mob.runtimeCrosswalkStatus,runtimeCrosswalkEvidence:mob.runtimeCrosswalkEvidence,deepResearchRecordId:mob.deepResearchRecordId,deepResearchCrosswalkStatus:mob.deepResearchCrosswalkStatus,researchSources:mob.researchSources,researchSynthesis:mob.researchSynthesis,researchLimitations:mob.researchLimitations,researchPasses:mob.researchPasses};
 }else{
  entry.mobPatternSourceStatus='NO_EXACT_SOURCE_PATTERN_LABEL_MATCH; SOURCE_ROW_COUNT_MISMATCH_OPEN';
 }
 if(r&&(r.runtimeNodeLabel===entry.nm||cardKey(r.runtimeNodeLabel)===cardKey(entry.nm))){
  entry.fetterResearchRecordId=r.id;
  entry.fetterResearchStatus=r.researchStatus;
  entry.fetterResearchCrosswalkStatus=r.runtimeNodeLabel===entry.nm?r.runtimeCrosswalkStatus:'normalized_runtime_label_candidate_not_semantic';
  entry.fetterResearch={
   sourceNodeId:r.nodeId,sourceFetterName:r.sourceFetterName,sourceVersionNote:r.sourceVersionNote,
   sourceBand:r.sourceBand,sourceAnatomicalAddress:r.sourceAnatomicalAddress,
   sourceGoverningFunction:r.sourceGoverningFunction,sourceShadowExpression:r.sourceShadowExpression,
   researchCategory:r.researchCategory,researchSources:r.researchSources,researchSynthesis:r.researchSynthesis,
   researchLimitations:r.researchLimitations,behavioralHypothesis:r.behavioralHypothesis,
   contextualDiscriminant:r.contextualDiscriminant,counterexampleGuard:r.counterexampleGuard,
   constructiveOppositeStatus:r.constructiveOppositeStatus,releaseStatementStatus:r.releaseStatementStatus,
   researchPasses:r.researchPasses,
   registerPrompts:(r.registerPrompts||[]).map(prompt=>({...prompt,...(promptById.get(prompt.promptId)||{}),...(promptValidationById.get(prompt.promptId)||{})})),
   registerPromptValidationCoverage:(r.registerPrompts||[]).filter(prompt=>promptValidationById.has(prompt.promptId)).length,
   registerPromptValidationStatus:(r.registerPrompts||[]).every(prompt=>promptValidationById.get(prompt.promptId)?.exampleValidationStatus==='VALIDATED_SYNTHETIC_CASE_AND_COUNTEREXAMPLE_NO_REAL_PERSON_DATA'&&(promptValidationById.get(prompt.promptId)?.researchPasses||[]).length===3)?'three_pass_synthetic_validation_complete':'validation_overlay_incomplete'
  };
 }else{
  entry.fetterResearchStatus='NO_EXACT_108_OVERLAY_RECORD; SOURCE_112_PATTERN_RESEARCH_PENDING';
 }
 if(r&&entry.fetterResearch&&mob&&entry.mobPatternSource){
  const fetterLabelAligned=r.sourceFetterName===entry.nm||cardKey(r.sourceFetterName)===cardKey(entry.nm);
  const mobLabelAligned=mob.sourcePatternName===entry.nm||cardKey(mob.sourcePatternName)===cardKey(entry.nm);
  const labelAligned=fetterLabelAligned&&mobLabelAligned;
  const sourceStatus=entry.fetterResearchCrosswalkStatus||'candidate_crosswalk';
  const mobStatus=entry.mobPatternSourceCrosswalkStatus||'candidate_crosswalk';
  const pass1=entry.researchPasses?.[0]||{pass:1,name:'runtime_source_extraction',status:'complete',sources:['proto/knowledge/src/engine.js'],findings:[entry.def],conflicts:[],reviewedAt:'2026-10-24'};
  const pass2Sources=[...(r.researchPasses?.[1]?.sources||[]),...(mob.researchPasses?.[1]?.sources||[]),r.id,mob.id];
  const pass3Sources=[...(r.researchPasses?.[2]?.sources||[]),...(mob.researchPasses?.[2]?.sources||[]),'docs/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_FORMAT_TDD_v1.md'];
  entry.researchPasses=[
   {...pass1,status:'complete'},
   {pass:2,name:'independent_behavioral_research_and_source_crosswalk',status:'complete',sources:[...new Set(pass2Sources)],findings:[
    'Fetter source record: '+r.sourceFetterName+'. Runtime node label: '+entry.nm+'.',
    r.researchSynthesis||'The Fetter source record contains provisional behavioral research.',
    mob.researchSynthesis||'The MOB source record supplies a source-derived pattern description.',
    'Fetter crosswalk status: '+sourceStatus+'. MOB crosswalk status: '+mobStatus+'. Label similarity and source-index alignment do not establish semantic identity.'
   ],conflicts:[r.researchLimitations||'The source record is not a clinical diagnosis.',mob.researchLimitations||'The source row is a candidate crosswalk, not canonical membership.'],reviewedAt:'2026-10-24',reviewDateBasis:'cross-layer synthesis of linked source research; semantic equivalence remains separately gated'},
   {pass:3,name:'adversarial_crosswalk_and_counterexample_review',status:'complete',sources:[...new Set(pass3Sources)],findings:[
    r.counterexampleGuard||'Use a counterexample before treating this source pattern as present.',
    mob.runtimeCrosswalkEvidence?.join('; ')||'Source row crosswalk evidence is recorded in the MOB pattern registry.',
    labelAligned?'Source and runtime labels align after normalization; this remains a source crosswalk, not proof of a causal mechanism.':'Source and runtime labels differ; preserve both and keep the relationship provisional.',
    'Do not infer a diagnosis, a fixed identity, anatomical causation, or canonical membership from this record.'
   ],conflicts:[r.researchLimitations||'Behavioral interpretation remains provisional.',mob.researchLimitations||'The source crosswalk does not prove semantic equivalence.'],reviewedAt:'2026-10-24',reviewDateBasis:'adversarial cross-record review; original source labels retained'}
  ];
  entry.researchStatus='three_pass_source_research_complete_semantic_crosswalk_provisional';
  entry.researchSources=[...new Set([...(r.researchSources||[]),...(mob.researchSources||[])])];
  entry.researchSynthesis='Source-qualified synthesis for runtime node '+entry.id+'; Fetter label '+r.sourceFetterName+'; MOB pattern label '+mob.sourcePatternName+'; crosswalk status '+sourceStatus+' / '+mobStatus+'.';
  entry.researchLimitations='The source records may not be semantically identical to the runtime node. Keep crosswalks provisional; no clinical, causal, or canonical inference is authorized.';
  entry.sourceDefinitionVerbatim=entry.def;
  entry.sourceClaims=[...(entry.sourceClaims||[]),'Fetter source label: '+r.sourceFetterName,'MOB source pattern label: '+mob.sourcePatternName,'Crosswalk status: '+sourceStatus+' / '+mobStatus];
  const requiredFields=(TEMPLATE_SCHEMAS.node.fields||[]).filter(field=>field!=='id'&&field!=='kind'&&field!=='templateId');
  const missingFields=requiredFields.filter(field=>!(field==='axis'&&entry.axisStatus==='source_axis_not_specified')&&(!Object.prototype.hasOwnProperty.call(entry,field)||entry[field]==null||entry[field]===''||(Array.isArray(entry[field])&&!entry[field].length)));
  entry.templateValidation={...(entry.templateValidation||{}),contentStatus:missingFields.length?'incomplete':entry.researchPasses.some(pass=>pass.status!=='complete')?'research_pending':'complete',missingFields};
 }
}
const sourceToRuntimeId=new Map([
 ...(psychRegistry.records||[]).map(r=>[r.id,'psych:'+r.id]),
 ...(superRegistry.records||[]).map(r=>[r.id,'super:'+r.id])
]);
const runtimeIdByLower=new Map(E.map(e=>[String(e.id).toLowerCase(),e.id]));
const relationshipEdges=[...adaptedPsych.relationshipEdges,...adaptedSuper.relationshipEdges,...(crossRegistryEdgeRegister.relationshipEdges||[])].map(edge=>{
 const sourceFromId=edge.fromId;
 const sourceToId=edge.toId;
 const fromId=sourceToRuntimeId.get(sourceFromId)||runtimeIdByLower.get(String(sourceFromId||'').toLowerCase())||sourceFromId;
 const resolvedToId=sourceToRuntimeId.get(sourceToId)||runtimeIdByLower.get(String(sourceToId||'').toLowerCase())||null;
 const targetIsUnresolved=Boolean(sourceToId)&&!resolvedToId;
 const unresolvedTargetLabel=edge.toLabel||(targetIsUnresolved?String(sourceToId).replace(/^[^:]+:/,'').replace(/[-_]/g,' '):(!sourceToId?'UNRESOLVED_TARGET_LABEL_NOT_SPECIFIED':null));
 return {
  ...edge,
  fromId,
  toId:targetIsUnresolved?null:(resolvedToId||null),
  toLabel:unresolvedTargetLabel,
  unresolvedTargetId:targetIsUnresolved?sourceToId:(edge.unresolvedTargetId||null),
  targetRegistry:targetIsUnresolved||(!resolvedToId&&!sourceToId)?'external_or_unresolved':(edge.targetRegistry||'combined_runtime'),
  validationStatus:targetIsUnresolved?'target_unresolved_no_exact_runtime_id':(resolvedToId?'runtime_endpoint_resolved_not_semantically_verified':(edge.validationStatus||'target_label_only_unresolved'))
 };
});
const allById=new Map(E.map(e=>[e.id,e]));
for(const edge of relationshipEdges){
 const sourceBackedMembership =
  (['complex_child_saboteur','hypercomplex_child_complex'].includes(edge.relationshipType) &&
   edge.status==='source_backed_membership' &&
   edge.canonicality==='historical_source_recorded') ||
  (edge.relationshipType==='mirror_pair_pole' &&
   edge.status==='source_backed_source_family_membership');
 if(sourceBackedMembership&&edge.toId&&edge.reciprocalRequired&&allById.has(edge.fromId)&&allById.has(edge.toId)){
  const from=allById.get(edge.fromId),to=allById.get(edge.toId);
  if(!from.links.includes(edge.toId))from.links.push(edge.toId);
  if(!to.links.includes(edge.fromId))to.links.push(edge.fromId);
 }
}
const icp=JSON.parse(fs.readFileSync(path.join(__dirname,'icp.json'),'utf8'));
const out={entries:E, pal:T.PAL, glyph:T.SEATGLYPH, bands:T.BANDS, icp:icp,
 relationshipEdges,
 sourceRegistries:[adaptedPsych.sourceRegistry,adaptedSuper.sourceRegistry,{registryId:'fetter-deep-research-108',version:fetterResearchRegistry.version,recordCount:fetterResearchRegistry.recordCount,status:fetterResearchRegistry.status,promptCount:fetterPromptRegistry.recordCount,promptValidationOverlayVersion:promptValidationIndex.version,promptValidationOverlayRecordCount:promptValidationRecords.length,promptValidationOverlayStatus:promptValidationIndex.status,runtimeResearchOverlay:runtimeResearchOverlayIndex.version,runtimeResearchOverlayRecordCount:runtimeResearchOverlayRecords.length,runtimeResearchOverlayStatus:runtimeResearchOverlayIndex.status,sourceVersionBoundary:fetterResearchRegistry.sourceBoundary},{registryId:'mob-pattern-source-108-of-112',version:mobPatternSourceRegistry.version,recordCount:mobPatternSourceRegistry.recordCount,claimedPatternCount:mobPatternSourceRegistry.claimedPatternCount,missingSourceRows:mobPatternSourceRegistry.counts.missingRows,status:mobPatternSourceRegistry.status}],
 relationshipEdgeRegistries:[{registryId:crossRegistryEdgeRegister.registryId,version:crossRegistryEdgeRegister.version,edgeCount:(crossRegistryEdgeRegister.relationshipEdges||[]).length}],
 stamp:'engine tables and ICP figures read from commit b434f1a; Deep Psyche registry v'+psychRegistry.version+' and Super-Complex candidate registry v'+superRegistry.version+' plus cross-registry edge register v'+crossRegistryEdgeRegister.version+' imported'};
function sanitizeGeneratedStrings(value){
 if(typeof value==='string') return value.replace(/\u2014/g, ', ');
 if(Array.isArray(value)) return value.map(sanitizeGeneratedStrings);
 if(value&&typeof value==='object') return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,sanitizeGeneratedStrings(item)]));
 return value;
}
const txt='/* generated by gen-data.js. Do not edit. */\nvar KBD='+JSON.stringify(sanitizeGeneratedStrings(out))+';\n';
if(/\u2014/.test(txt)){console.error('em dash in generated data after normalization');process.exit(1);}
fs.writeFileSync(path.join(__dirname,'data.js'),txt);
const k={}; E.forEach(e=>k[e.kind]=(k[e.kind]||0)+1);
console.log('  data.js '+txt.length+' bytes, entries by kind '+JSON.stringify(k)+', typed edges '+relationshipEdges.length);
