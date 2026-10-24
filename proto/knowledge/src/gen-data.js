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
T.CHILD.forEach((c,i)=>{const ax=T.AXCARD.filter(a=>a.ax===c.nm)[0]||{};
 add({id:'axis:'+c.nm, kind:'axis', nm:c.nm, seat:c.seat, fam:c.seat+' seat',
  def:c.nm+', one of the nine child emotions, seated in the '+c.seat+' seat.',
  card:'Felt in the '+c.loc+'. Emptied, it fills with '+c.opp+'.',
  where:'Held at: '+c.addr.toLowerCase()+'. Felt in the '+c.loc+'.', says:clean(ax.track), out:clean(T.AXLINE[i]),
  inst:clean(ax.inst), opp:c.opp, ic:c.ic});});

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
  theme:clean(n.a), distort:clean(n.d), axis:n.c||null, ic:(ax&&ax.ic)||null,
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
 add({id:'sab:'+s.nm, kind:'sab', nm:s.nm, seat:(fam&&fam.b)||'Heart',
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
T.DESCENT.forEach(d=>{
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
  oppositeId:'descent:'+d.nm,
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
 add({id,kind:'hypercomplex',nm:m.name,seat:null,fam:'hyper-complex mode',cluster:m.cluster,
  def:m.definition,body:m.definition,behavior:m.behavior,triggerMechanism:m.triggerMechanism,
  livedExample:m.livedExample,impact:m.impact,practice:m.practice,
  inferred:false,inferenceBasis:m.basis,confidence:m.confidence,
  reviewStatus:'research-populated working record; canon/owner review required; not diagnosis',
  oppositeId,oppositeDefinition:m.inverseDefinition,
  oppositeStatus:'inferred-working-counterpart; not canonical; review required',
  narrativeSource:'SNIFFER_SPEC.md section 5 plus adjacent research; see researchSources',
  researchSources:m.sources,clusterOrder:i+1,links:[oppositeId]});
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
  cluster:m.cluster,links:[id]});
});

/* masks, archetypes, domains */
T.MASKS.forEach(m=>add({id:'mask:'+m.nm, kind:'mask', nm:m.nm, seat:(m.b&&m.b[0])||'Heart',
 fam:(m.b||[]).join(' and '), def:'The '+m.nm.toLowerCase()+' mask '+clean(m.v)+'.', ic:m.ic}));
T.ARCH.forEach((a,i)=>add({id:'arch:'+a.nm, kind:'arch', nm:a.nm, seat:a.b||'Heart', idx:i,
 fam:(a.b||'Heart')+' seat', def:'The '+a.nm.toLowerCase()+' '+clean(a.v)+'.', ic:a.ic}));
T.DOMAINS.forEach((d,i)=>{const x=T.DOMDEF[T.KB_KEY(d.nm)];
 add({id:'dom:'+d.nm, kind:'dom', nm:d.nm, seat:'Heart', idx:i, fam:d.r+' root',
  def:d.nm+', '+clean(d.d)+'.', clear:x?clean(x.c):'', dist:x?clean(x.x):'', ic:d.ic||null});});

/* the glossary, which answers a search first */
T.GLOSS.forEach(g=>add({id:'term:'+g.t, kind:'term', nm:g.t, seat:null, fam:'term',
 def:clean(g.d)}));

/* links, computed from the tables and never typed: an axis links to its
   addresses and its opposite's entry where one exists; an address links to
   its axis, its seat and the saboteurs that sit on it; a saboteur links to
   its addresses and its architecture. */
const by={}; E.forEach(e=>by[e.id]=e);
E.forEach(e=>{e.links=[];});
/* Hyper-complex mode ↔ inferred counterpart is an explicit reciprocal pair. Grandiosity maps to the source-defined Cluster I / Narcissism association; other direct parent mappings remain unresolved. */
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
 h.routeBasis='provisional axis-mediated ecosystem route; shared node IDs connect this mode to Saboteurs and the existing complex layer; not canonical parentage or clinical equivalence';
 h.links.push(...linkedSaboteurs.map(s=>s.id));
 linkedSaboteurs.forEach(s=>s.links.push(h.id));
 const linkedComplexes=E.filter(e=>e.kind==='complex'&&linkedSaboteurs.some(s=>(s.links||[]).includes(e.id)));
 h.complexRouteIds=linkedComplexes.map(c=>c.id);
 h.links.push(...h.complexRouteIds);
 linkedComplexes.forEach(c=>c.links.push(h.id));
 if(!linkedComplexes.length) h.parentLinkBasis='no populated complex reachable on declared provisional axis route; review required';
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
 hypercomplex:{id:'TPL-HYPERCOMPLEX', fields:['nm','fam','cluster','def','body','behavior','triggerMechanism','livedExample','impact','practice','inferred','inferenceBasis','confidence','reviewStatus','oppositeId','oppositeDefinition','oppositeStatus','narrativeSource','researchSources','links']},
 nerve:{id:'TPL-NERVE-BRANCH', fields:['nm','seat','fam','def','branchIndex','sourceSeat','pointCount','mappingBasis','mappedNodeIds','narrativeSource','links']},
 seat:{id:'TPL-SEAT', fields:['nm','fam','def','body','links']},
 axis:{id:'TPL-FETTER-AXIS', fields:['nm','seat','fam','def','card','where','says','inst','opp','links']},
 node:{id:'TPL-FETTER-NODE', fields:['nm','seat','fam','def','where','card','theme','distort','axis','body','trigger','says','out','inst','opp','nextMove','narrativeSource','links']},
 sab:{id:'TPL-SABOTEUR', fields:['nm','seat','fam','def','body','trigger','says','out','livedBehavior','availableState','nextMove','nids','arch','links']},
 hcx:{id:'TPL-HYPERCOMPLEX', fields:['nm','seat','fam','def','sub','links']},
 complex:{id:'TPL-COMPLEX-UNIFIED', fields:['nm','fam','def','body','inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','narrativeSource','researchSources','links']},
 inferred:{id:'TPL-COMPLEX-UNIFIED', fields:['nm','fam','def','body','inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','narrativeSource','researchSources','links']},
 supercomplex:{id:'TPL-SUPERCOMPLEX', fields:['nm','fam','def','body','inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','refer','narrativeSource','researchSources','researchPasses','links']},
 mask:{id:'TPL-MASK', fields:['nm','seat','fam','def','links']},
 arch:{id:'TPL-ARCHETYPE', fields:['nm','seat','fam','def','links']},
 dom:{id:'TPL-DOMAIN', fields:['nm','seat','fam','def','clear','dist','links']},
 term:{id:'TPL-GLOSSARY-TERM', fields:['nm','fam','def','links']}
};
E.forEach(e=>{
 const schema=TEMPLATE_SCHEMAS[e.kind];
 if(!schema) throw new Error('No template schema for entry kind '+e.kind+' ('+e.id+')');
 e.templateId=schema.id;
 const descentDetailFields=['inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','researchSources','researchPasses'];
 const assignedFields=(e.kind==='hcx'&&String(e.narrativeSource||'').includes('compass.js DESCENT'))?schema.fields.concat(descentDetailFields):schema.fields;
 e.template=Object.fromEntries(assignedFields.map(k=>[k,Object.prototype.hasOwnProperty.call(e,k)?e[k]:null]));
 const missingFields=assignedFields.filter(k=>{
  if(!Object.prototype.hasOwnProperty.call(e,k)||e[k]==null||e[k]==='') return true;
  /* Empty arrays are valid for relationship collections: a leaf may have no
     outgoing links. Do not report [] as missing content. */
  return false;
});
 e.templateValidation={schemaDefined:true, sourceBacked:true,
  contentStatus:missingFields.length===0?'complete':'incomplete',
  missingFields};
});

const psychRegistry=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json'),'utf8'));
const psychCatalog=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_TEMPLATE_CATALOG_v1.json'),'utf8'));
const superRegistry=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_SUPERCOMPLEX_CANDIDATE_REGISTRY_v1.json'),'utf8'));
const adaptedPsych=require('./psychological-runtime-adapter')(psychRegistry,psychCatalog,{namespace:'psych'});
const adaptedSuper=require('./psychological-runtime-adapter')(superRegistry,psychCatalog,{namespace:'super'});
if(adaptedPsych.errors.length||adaptedSuper.errors.length)throw new Error('Registry adapter errors: '+JSON.stringify({deep:adaptedPsych.errors,supercomplex:adaptedSuper.errors}));
E.push(...adaptedPsych.entries,...adaptedSuper.entries);
const sourceToRuntimeId=new Map([
 ...(psychRegistry.records||[]).map(r=>[r.id,'psych:'+r.id]),
 ...(superRegistry.records||[]).map(r=>[r.id,'super:'+r.id])
]);
const relationshipEdges=[...adaptedPsych.relationshipEdges,...adaptedSuper.relationshipEdges].map(edge=>{
 if(edge.toId&&sourceToRuntimeId.has(edge.toId))return {...edge,toId:sourceToRuntimeId.get(edge.toId),targetRegistry:'combined_runtime',validationStatus:'cross_registry_target_resolved'};
 return edge;
});
const allById=new Map(E.map(e=>[e.id,e]));
for(const edge of relationshipEdges){
 if(edge.toId&&edge.reciprocalRequired&&allById.has(edge.fromId)&&allById.has(edge.toId)){
  const from=allById.get(edge.fromId),to=allById.get(edge.toId);
  if(!from.links.includes(edge.toId))from.links.push(edge.toId);
  if(!to.links.includes(edge.fromId))to.links.push(edge.fromId);
 }
}
const icp=JSON.parse(fs.readFileSync(path.join(__dirname,'icp.json'),'utf8'));
const out={entries:E, pal:T.PAL, glyph:T.SEATGLYPH, bands:T.BANDS, icp:icp,
 relationshipEdges,
 sourceRegistries:[adaptedPsych.sourceRegistry,adaptedSuper.sourceRegistry],
 stamp:'engine tables and ICP figures read from commit b434f1a; Deep Psyche registry v'+psychRegistry.version+' and Super-Complex candidate registry v'+superRegistry.version+' imported'};
const txt='/* generated by gen-data.js. Do not edit. */\nvar KBD='+JSON.stringify(out)+';\n';
if(/\u2014/.test(txt)){console.error('em dash in generated data');process.exit(1);}
fs.writeFileSync(path.join(__dirname,'data.js'),txt);
const k={}; E.forEach(e=>k[e.kind]=(k[e.kind]||0)+1);
console.log('  data.js '+txt.length+' bytes, entries by kind '+JSON.stringify(k)+', typed edges '+relationshipEdges.length);
