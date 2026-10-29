/* GENERATED READ-ONLY CELESTIAL BROWSER BRIDGE, sourced from Reboot-OS feature branch.
 * Source SHA provenance source-ai-record-resolver.cjs:e2ae732a2052925cfdc736705fa628205c916d7f source-ai-behavioral-synthesis.cjs:dfc78ca42b243d62ea24a7f3041320d2281bc89e source-ai-reading-pipeline.cjs:ef34c80739296e5281a99839e41c7b4103e05558 human-design-peer-seam.cjs:b5d320652d4203b016f33e47a841a798db6742af celestial-avatar-cascade.cjs:fadb8b649abce5cf3ffc4ab3e8a751548f84cc36 celestial-avatar-cascade-view.cjs:8fe1f5195b76b6f8b48248a6a9248f519f58d9bd */
var AT_CELESTIAL=(function(){'use strict';
var mods={}; function unit(k,fn){var m={exports:{}};fn(m,function(dep){if(dep==='./celestial-parent-projection.cjs')return {buildCelestialParentProjection:function(){throw Error('Parent projection not loaded in this browser')}};if(!mods[dep])throw Error('Missing dependency '+dep);return mods[dep]});mods[k]=m.exports;}
unit("./source-ai-record-resolver.cjs",function(module,require){
'use strict';
// Source AI record-backed comparison resolver, v1. Dynamic overlap is NOT a canonical edge.
// Pure function: no user state, profile mutation, scoring, or runtime Graph Editor writes.
const SYSTEMS = Object.freeze({
  western_astrology: 'western:sign:',
  eastern_astrology: 'eastern:animal:',
  modern_western_pythagorean: 'numerology:pythagorean:number:'
});
function requireTrue(condition, message) {
  if (!condition) throw new Error('Source AI resolver: ' + message);
}
function selectedFields(record) {
  const interpretation = record.interpretation || {};
  const readable = (v) => typeof v === 'string' ? v : null;
  const array = (v) => Array.isArray(v) ? v.filter(x => typeof x === 'string') : [];
  return {
    id: record.id,
    name: readable(record.canonical_name) || readable(record.label) || record.id,
    essence: readable(record.essence) || readable(record.behavior_energy_v1 && record.behavior_energy_v1.symbolic_definition),
    constructive: array(record.gifts).length ? array(record.gifts) : array(interpretation.gifts),
    costly: array(record.shadows).length ? array(record.shadows) : array(interpretation.shadows),
    inversion: readable(interpretation.healthy_inversion),
    counterevidence: readable(interpretation.counterevidence),
    alternative_explanations: array(interpretation.alternative_explanations),
    provenance: {
      record_id: record.id,
      essence_field: readable(record.essence) ? 'essence' : 'behavior_energy_v1.symbolic_definition',
      constructive_field: Array.isArray(record.gifts) ? 'gifts' : 'interpretation.gifts',
      costly_field: Array.isArray(record.shadows) ? 'shadows' : 'interpretation.shadows'
    }
  };
}
function resolveSourceAIRecords({ selected_ids, records, crosswalk }) {
  requireTrue(Array.isArray(selected_ids) && selected_ids.length === 3,
    'exactly one selection per system required');
  requireTrue(Array.isArray(records) && crosswalk && Array.isArray(crosswalk.crosswalks),
    'missing source records or authored crosswalk');
  const registry = new Map(records.map(r => [r.id, r]));
  requireTrue(new Set(selected_ids).size === 3, 'duplicate selection');
  const inputs = [];
  for (const [system, prefix] of Object.entries(SYSTEMS)) {
    const matches = selected_ids.filter(id => typeof id === 'string' && id.startsWith(prefix));
    requireTrue(matches.length === 1, 'expected one ' + system + ' ID');
    const rec = registry.get(matches[0]);
    requireTrue(rec && (rec.essence || (rec.behavior_energy_v1 && rec.behavior_energy_v1.symbolic_definition)), 'unknown or incomplete record ' + matches[0]);
    requireTrue(rec.score_permission !== true && rec.may_affect_coherence !== true,
      'source cannot authorize score writes');
    inputs.push({ system, ...selectedFields(rec) });
  }
  const selected = new Set(selected_ids);
  const authoredMatches = crosswalk.crosswalks.filter(g => {
    const participants = (g.participants || []).map(p => p.id);
    return participants.length === 3 && selected.size === participants.length &&
      participants.every(id => selected.has(id));
  });
  for (const group of authoredMatches) {
    requireTrue(group.score_permission === false && group.may_affect_coherence === false &&
      group.computational_effect === 'none', 'authored group score firewall');
  }
  // Partially overlapping authored groups are source context only, not the user's triad.
  const contextualGroups = crosswalk.crosswalks.filter(g =>
    !authoredMatches.includes(g) &&
    (g.participants || []).some(p => selected.has(p.id))
  ).map(g => ({ id: g.id, included_record_ids:
    (g.participants || []).filter(p => selected.has(p.id)).map(p => p.id)
  }));
  return {
    schema: 'atuned.celestial.source_ai_record_resolution.v1',
    id: 'celestial:reading:' + inputs.map(x => x.id).join('|'),
    selected_source_record_ids: inputs.map(x => x.id),
    source_material: inputs,
    authored_exact_group_ids: authoredMatches.map(g => g.id),
    authored_overlap: authoredMatches.map(g => ({
      id: g.id,
      shared_theme: g.shared_theme,
      operational_definition: g.operational_definition,
      behavioral_hinge: g.behavioral_hinge,
      counterexamples: g.counterexamples || [],
      other_causes: g.other_causes || [],
      uncertainty: g.uncertainty
    })),
    contextual_groups_not_authority: contextualGroups,
    dynamic_comparison: authoredMatches.length === 0,
    behavioral_synthesis: authoredMatches.length
      ? { status: 'AUTHORED_CANDIDATE_NOT_PERSONALLY_VERIFIED' }
      : { status: 'DYNAMIC_INFERENCE_PENDING', proposed_theme: null },
    narration_contract: {
      purpose: 'Translate record text into a grounded, considerate personal interpretation.',
      required: ['behavioral_overlap', 'constructive_expression', 'costly_expression',
        'difference_or_alternative', 'considered_choice', 'source_fidelity'],
      forbidden: ['unverified_personal_fact', 'predictive_claim', 'mystical_mechanism',
        'clinical_diagnosis', 'unapproved_graph_edge', 'coherence_score_write'],
      voice: 'warm, specific, plain-language; no generic flattery; distinguish interpretation from observation'
    },
    score_permission: false,
    may_affect_coherence: false,
    computational_effect: 'none',
    downstream_target_id: null,
    graph_effect: 'none'
  };
}
module.exports = { resolveSourceAIRecords, selectedFields, SYSTEMS };

});
unit("./source-ai-behavioral-synthesis.cjs",function(module,require){
'use strict';
// Source OS: deterministic behavioral overlap + reader-quality narrative from resolved Celestial records.
// This emits interpretive prose and field-level evidence ONLY. It never writes to a user record or graph.
const DIMENSIONS = [
 {id:'response_to_change', label:'responding to uncertainty', mechanism:'responding when circumstances are unsettled',
  re:/\b(uncertain\w*|chang\w*|adapt\w*|resourceful\w*|flexib\w*|shift\w*|unexpected|contingenc\w*)\b/i,
  question:'When conditions change, what would help you decide whether to act or gather more information?'},
 {id:'responsible_action',label:'taking responsible action',mechanism:'turning a considered intention into action',
  re:/\b(initiat\w*|act\w*|courage\w*|lead\w*|decis\w*|responsib\w*|protect\w*|ownership|first step)\b/i,
  question:'When you feel ready to move, whose needs and what evidence should shape that next step?'},
 {id:'interpretation',label:'making sense of what is noticed',mechanism:'recognizing a possible meaning before treating it as certain',
  re:/\b(insight\w*|intuition|intuitive|pattern\w*|recogniz\w*|notic\w*|sensitiv\w*|percept\w*|observ\w*)\b/i,
  question:'What evidence supports your interpretation, and what might explain it differently?'},
 {id:'care',label:'care with responsibility',mechanism:'choosing how to support people without taking over',
  re:/\b(care\w*|compassion\w*|nurtur\w*|support\w*|protect\w*|responsib\w*|empath\w*|kindness)\b/i,
  question:'How can you offer support while preserving the other person’s choice?'},
 {id:'cooperation',label:'coordinating with others',mechanism:'acting through communication and collaboration',
  re:/\b(collaborat\w*|cooperat\w*|communicat\w*|listen\w*|connect\w*|relation\w*|partner\w*|dialogue)\b/i,
  question:'Where would listening or agreement improve the next decision?'},
 {id:'verification',label:'checking an impression against evidence',mechanism:'testing impressions before committing to them',
  re:/\b(verif\w*|test\w*|evidence|check\w*|validat\w*|discern\w*|fact\w*|proof)\b/i,
  question:'What observation would confirm or challenge the first impression?'},
 {id:'creation',label:'exploring new possibilities',mechanism:'imagining alternatives and trying a constructive path',
  re:/\b(creativ\w*|imagin\w*|explor\w*|curios\w*|possibilit\w*|invent\w*|innov\w*|express\w*)\b/i,
  question:'What small experiment would test this possibility without requiring certainty?'},
 {id:'durability',label:'building what lasts',mechanism:'sustaining a choice through patience and structure',
  re:/\b(disciplin\w*|durab\w*|patien\w*|stead\w*|consisten\w*|structur\w*|persever\w*|reliab\w*)\b/i,
  question:'What would make the next step sustainable rather than simply immediate?'},
 {id:'boundaries',label:'balancing openness and boundaries',mechanism:'staying receptive without losing a clear boundary',
  re:/\b(boundar\w*|limit\w*|consent|autonom\w*|accept\w*|independen\w*)\b/i,
  question:'Where does your choice end and another person’s choice begin?'},
 {id:'planning',label:'planning without losing flexibility',mechanism:'thinking ahead while adapting to the situation',
  re:/\b(strateg\w*|plan\w*|organis\w*|organiz\w*|anticipat\w*|system\w*|order\w*|prepare\w*)\b/i,
  question:'What is useful to plan now, and what can stay open to new information?'}
];
function assert(v, m) { if(!v) throw new Error('Source AI synthesis: '+m); }
function evidenceFor(material, dim) {
  const result = [];
  for (const r of material) {
    const samples = [{field:'essence',value:r.essence,weight:3}]
      .concat((r.constructive||[]).map(v=>({field:r.provenance.constructive_field,value:v,weight:1})));
    for (const s of samples) {
      if(typeof s.value==='string' && dim.re.test(s.value)){
        result.push({record_id:r.id,field:s.field,verbatim:s.value,weight:s.weight});
        break;
      }
    }
  }
  return result;
}
function synthesizeSourceAI(resolution) {
  assert(resolution && resolution.score_permission===false &&
    resolution.may_affect_coherence===false && resolution.computational_effect==='none',
    'resolver scoring firewall');
  assert(Array.isArray(resolution.source_material) && resolution.source_material.length===3,
    'three records required');
  const material=resolution.source_material;
  assert(new Set(material.map(r=>r.id)).size===3, 'duplicate source');
  for (const r of material) {
    assert(typeof r.id==='string' && typeof r.essence==='string' &&
      r.provenance && r.provenance.record_id===r.id, 'missing source provenance');
    assert(Array.isArray(r.constructive) && Array.isArray(r.costly), 'missing contrasts');
  }
  const aligned = DIMENSIONS.map(d=>({...d,evidence:evidenceFor(material,d)}))
    .filter(d=>new Set(d.evidence.map(e=>e.record_id)).size>=2);
  aligned.sort((a,b)=> {
    const weight=x=>x.evidence.reduce((acc,e)=>acc+e.weight,0)+
      (x.evidence.length===3?2:0);
    return weight(b)-weight(a) || DIMENSIONS.findIndex(x=>x.id===a.id)-
      DIMENSIONS.findIndex(x=>x.id===b.id);
  });
  const authored=Array.isArray(resolution.authored_overlap)?resolution.authored_overlap:[];
  let main=aligned.length?aligned[0]:null;
  const sourceEvidence=main?main.evidence:[];
  const exact=authored.length>0;
  const overlap=exact ? {
    label:authored[0].shared_theme,
    operational_behavior:authored[0].operational_definition,
    evidence:material.map(r=>({record_id:r.id,field:'essence',verbatim:r.essence})),
    kind:'authored_group_unapproved',
    authored_group_id:authored[0].id
  } : main ? {
    label:main.label, operational_behavior:main.mechanism,
    evidence:sourceEvidence,kind:'dynamic_field_based_candidate',
    authored_group_id:null
  } : null;
  const contrasts = material.map(r=>({
    record_id:r.id,constructive:r.constructive[0]||null,
    costly:r.costly[0]||null,
    constructive_field:r.provenance.constructive_field,
    costly_field:r.provenance.costly_field
  }));
  const out={
    schema:'atuned.celestial.source_ai_behavioral_synthesis.v1',
    selected_source_record_ids:resolution.selected_source_record_ids.slice(),
    status:overlap?'INTERPRETIVE_CANDIDATE':'NO_CLEAR_OVERLAP',
    authored_group_ids:resolution.authored_exact_group_ids.slice(),
    overlap, contrasts, alternatives:authored.length?(authored[0].other_causes||[]):[],
    uncertainty:'An interpretation of symbolic source records, not a measurement of this person.',
    personally_observed:false,source_approval:false,target_id:null,
    score_permission:false,may_affect_coherence:false,computational_effect:'none',
    graph_effect:'none'
  };
  out.narrative=narrateSourceAI(out,material,main);
  return out;
}
function lowerStart(s){return s ? s.charAt(0).toLowerCase()+s.slice(1) : '';}
function narrateSourceAI(result,materials,dimension) {
  const names=materials.map(r=>r.name);
  const exact=result.overlap && result.overlap.kind==='authored_group_unapproved';
  let text;
  if(!result.overlap) {
    text='These records emphasize different tendencies rather than one clearly supported shared behavior. '+
      names.map((nm,i)=>nm+' centers on '+lowerStart(materials[i].essence)).join('; ')+
      '. It would be misleading to force them into a single personality story. '+
      'A better place to begin is a real situation where one of these descriptions seems useful, '+
      'and to see what actually happened.';
  } else {
    const label=result.overlap.label;
    text='One possible thread across these records is '+label+'. '+
      names[0]+' describes '+lowerStart(materials[0].essence)+', while '+
      names[1]+' emphasizes '+lowerStart(materials[1].essence)+'. '+
      names[2]+' adds '+lowerStart(materials[2].essence)+'. '+
      'Taken together, the useful question is how those tendencies interact in an actual decision. '+
      'The constructive possibilities include '+materials.map(r=>r.constructive[0]).filter(Boolean).join(', ')+
      '; the possible costs include '+materials.map(r=>r.costly[0]).filter(Boolean).join(', ')+'. '+
      (exact && materials.length===3
        ? 'The records share an authored comparison, but its meaning has not been verified for you. '
        : 'This combination is a fresh interpretation of the individual records, not an established comparison. ')+
      (dimension?dimension.question:'What would your real choices tell us about this pattern?');
  }
  return text+' These are ideas to examine against lived experience, not conclusions about who you are.';
}
module.exports={synthesizeSourceAI,narrateSourceAI,DIMENSIONS};
});
unit("./source-ai-reading-pipeline.cjs",function(module,require){
'use strict';
// Source OS Celestial framework adapter. Pure derived overlay: never imports into MOB Trace Graph.
// Does not claim numerology/astrology empirically predicts personality.
const {resolveSourceAIRecords}=require('./source-ai-record-resolver.cjs');
const {synthesizeSourceAI}=require('./source-ai-behavioral-synthesis.cjs');

const SITUATIONS={
  response_to_change:{
    opening:'What stands out is a way of meeting uncertainty: deciding what can be done before every detail is known.',
    choice:'whether a decision is based on what is known, or on the discomfort of not knowing.'
  },
  responsible_action:{
    opening:'A central question in these records is what happens between noticing that something needs to be done and taking responsibility for the response.',
    choice:'when action helps, and when it begins to override information or other people.'
  },
  interpretation:{
    opening:'A central theme is the movement from noticing a possibility to deciding what it actually means.',
    choice:'whether an impression is a useful starting question or a conclusion made too early.'
  },
  care:{
    opening:'The shared theme is a practical one: how to care for someone without taking ownership of their choices.',
    choice:'whether the help leaves the other person more capable or more dependent.'
  },
  cooperation:{
    opening:'These records return to what happens when your own intention has to meet someone else’s needs.',
    choice:'how to collaborate without abandoning a necessary boundary.'
  },
  verification:{
    opening:'What these records share is the value of checking an impression before it becomes a decision.',
    choice:'whether a strong feeling has been tested against a fact.'
  },
  creation:{
    opening:'There is a theme of making room for possibility while still putting an idea to work.',
    choice:'which promising idea deserves a small test rather than a large commitment.'
  },
  durability:{
    opening:'A shared theme is the difference between doing something once and building something that can last.',
    choice:'where persistence is useful and where new evidence calls for adjustment.'
  },
  boundaries:{
    opening:'The question these records raise is how to remain open while keeping your own limits clear.',
    choice:'what can be offered freely without becoming an obligation.'
  },
  planning:{
    opening:'A recurring theme is the balance between thinking ahead and staying responsive to what is really happening.',
    choice:'which risk needs a plan and which worry can be allowed to pass.'
  }
};
const norm=s=>typeof s==='string'?s.trim():null;
const strip=s=>(norm(s)||'').replace(/[.!?]+$/,'');
const lower=s=>s?s[0].toLowerCase()+s.slice(1):'';
function cue(full,source){
 const arc=full.behavioral_arc||{}, energy=full.behavior_energy_v1||{};
 const value=(opts)=>opts.map(([field,v])=>norm(v)?{field,value:v}:null).find(Boolean)||null;
 return {
   id:source.id, name:source.name, essence:source.essence,
   essence_provenance:{record_id:source.id,field:source.provenance.essence_field},
   constructive:source.constructive[0]||null,
   costly:source.costly[0]||null,
   action:value([['behavioral_arc.gift',arc.gift],['behavior_energy_v1.gift_expression',energy.gift_expression],['behavior_energy_v1.gift',energy.gift]]),
   tension:value([['behavioral_arc.hinge',arc.hinge],['behavior_energy_v1.meaning_distinction',energy.meaning_distinction],['behavior_energy_v1.shadow_expression',energy.shadow_expression]]),
   trigger:value([['behavioral_arc.stress_trigger',arc.stress_trigger],['behavior_energy_v1.activation_context',energy.activation_context],['behavior_energy_v1.trigger',energy.trigger]]),
   next_step:value([['behavioral_arc.inversion',arc.inversion],['behavior_energy_v1.healthy_inversion',energy.healthy_inversion],['behavior_energy_v1.inversion',energy.inversion]]),
   contrast_provenance:{record_id:source.id,constructive_field:source.provenance.constructive_field,costly_field:source.provenance.costly_field}
 };
}
function composeReading(synthesis,cues){
 if(!synthesis.overlap){
  return 'These records do not describe one clearly shared behavior. Each has its own emphasis, and forcing them into a single story would obscure those differences. We can begin instead with a decision you remember clearly, then ask which descriptions, if any, help explain what you actually did.';
 }
 const o=synthesis.overlap;
 const support=new Set(o.evidence.map(e=>e.record_id));
 const aligned=cues.filter(c=>support.has(c.id));
 const others=cues.filter(c=>!support.has(c.id));
 const a=aligned[0]||cues[0],b=aligned[1]||cues[1],third=others[0]||aligned[2]||cues[2];
 const frame=SITUATIONS[o.kind==='dynamic_field_based_candidate' && synthesis.overlap.evidence.length
  ? synthesis.overlap.dimension_id : '']||null;
 const opening=frame?frame.opening:'One recurring theme across these records is '+lower(o.label)+'.';
 const first='One description emphasizes '+lower(strip(a.essence))+'; another emphasizes '+lower(strip(b.essence))+'.';
 const thirdLine=third&&third.id!==a.id&&third.id!==b.id
   ? ' A third angle is '+lower(strip(third.essence))+' — a consideration that can reinforce or complicate the first two.'
   : '';
 const positives=cues.map(c=>c.constructive).filter(Boolean).slice(0,3);
 const negatives=cues.map(c=>c.costly).filter(Boolean).slice(0,3);
 const balance='At its most useful, this combination could involve '+positives.join(', ')+'.';
 const pressure='Under pressure, related tendencies could show up as '+negatives.join(', ')+'.';
 const decision=frame?frame.choice:
  'whether the response is matched to the actual situation instead of a first impulse';
 const test='The meaningful distinction is '+decision.charAt(0).toLowerCase()+decision.slice(1).replace(/[.!?]+$/,'')+'.';
 return [opening,first+thirdLine,balance,pressure,test].join(' ');
}
function buildSourceOSReading({selected_ids,records,crosswalk}){
 const resolution=resolveSourceAIRecords({selected_ids,records,crosswalk});
 const synthesis=synthesizeSourceAI(resolution);
 const sourceMap=new Map(records.map(r=>[r.id,r]));
 const cues=resolution.source_material.map(s=>cue(sourceMap.get(s.id),s));
 // Carry the already-computed dimension rather than guessing from an authored group.
 if(synthesis.overlap && synthesis.overlap.kind==='dynamic_field_based_candidate'){
  const {DIMENSIONS}=require('./source-ai-behavioral-synthesis.cjs');
  const dimension=DIMENSIONS.find(d=>d.label===synthesis.overlap.label);
  if(dimension)synthesis.overlap.dimension_id=dimension.id;
 }
 const narrative=composeReading(synthesis,cues);
 return {
  schema:'atuned.celestial.source_os_reading_packet.v1',
  selected_source_record_ids:resolution.selected_source_record_ids,
  authored_group_ids:resolution.authored_exact_group_ids,
  synthesis_status:synthesis.status,
  overlap:synthesis.overlap, record_cues:cues,
  narrative,
  relationship_scope:'CELESTIAL_READ_ONLY_OVERLAY_NOT_MOB_TRACE_EDGE',
  evidence_rule:'A narrative is a hypothesis about the source motifs. A personal claim needs voluntary observed behavior.',
  ambiguity_rule:'Contradictions, unrepresented third record, and lack of overlap must not be masked.',
  target_type:null,target_id:null,graph_import_allowed:false,
  score_permission:false,may_affect_coherence:false,computational_effect:'none',
  app_runtime_wired:false
 };
}
module.exports={buildSourceOSReading,composeReading,cue,SITUATIONS};
});
unit("./human-design-peer-seam.cjs",function(module,require){
'use strict';
// Human Design is a *fourth peer lens*, not a child of Western/Eastern/numerology.
// This adapter consumes MOB spiritualOf(birth).hd as GIVEN by its existing engine.
// Partial gates/profiles are valid context; missing bodygraph, Type and Authority remain unresolved.
// No invented behavioral meaning, no Graph Editor save, no score or trait inference.
const {buildCelestialParentProjection}=require('./celestial-parent-projection.cjs');
const {buildSourceOSReading}=require('./source-ai-reading-pipeline.cjs');
const ROOT='celestial:layer', SYSTEM='celestial:system:human_design';
const SOURCE_HD='MOB/atuned_src/engine/birth.js#hdOf';
const SOURCE_ASTRO='MOB/atuned_src/engine/astro.js#gateOf';
function check(v,msg){if(!v)throw new Error('Human Design peer seam: '+msg)}
function flagFree(o){return o&&o.score_permission===false&&o.may_affect_coherence===false&&o.computational_effect==='none'}
function nullish(v){return v===null||v===undefined}
function gates(g){
 if(nullish(g))return null;
 check(g&&typeof g==='object'&&Number.isInteger(g.gate)&&g.gate>=1&&g.gate<=64,'gate 1..64 required');
 check(Number.isInteger(g.line)&&g.line>=1&&g.line<=6,'line 1..6 required');
 return {gate:g.gate,line:g.line,gate_id:'human_design:gate:'+g.gate,reference_only:true,
   semantic_meaning_record_id:null};
}
function humanDesignContext({hd=null,provenance=SOURCE_HD,calculation_policy='MOB_HD_SOLAR_GATE_V1_UNREVIEWED'}={}){
 check(typeof provenance==='string'&&provenance===SOURCE_HD,'only confirmed existing MOB HD source accepted in v1');
 let p=null,d=null,profile=null, unresolved='No Human Design birth derivation supplied';
 if(hd!==null){
  check(hd&&typeof hd==='object'&&!Array.isArray(hd),'hd must be object or null');
  check(nullish(hd.type)&&nullish(hd.authority),'MOB has no bodygraph; never invent Type or Authority');
  p=gates(hd.personality);
  d=gates(hd.design);
  check((p===null)===(d===null),'personality/design gates must be jointly resolved');
  if(p){
   profile=p.line+'/'+d.line;
   check(hd.profile===profile,'profile must agree with both computed lines');
  }else{
   check(nullish(hd.profile),'unresolved gates cannot yield a known profile');
  }
  unresolved=typeof hd.unresolved==='string'&&hd.unresolved.trim()?hd.unresolved:
    'Full bodygraph, Type and Authority are unavailable';
 }
 return {
  schema:'atuned.celestial.human_design_peer_context.v1',
  system_id:SYSTEM,peer_of:['celestial:system:western_astrology',
    'celestial:system:eastern_astrology','celestial:system:modern_western_pythagorean'],
  status:p?'PARTIAL_SOLAR_GATES_ONLY':'UNRESOLVED_NO_SOLAR_GATES',
  chart_source:provenance,astronomy_source:SOURCE_ASTRO,
  calculation_policy,
  personality:p,design:d,profile,
  type:null,authority:null,strategy:null,definition:null,centers:null,channels:null,
  incarnation_cross:null,
  unresolved,
  record_meaning_status:'NO_HUMAN_DESIGN_MEANING_RECORDS_VERIFIED',
  behavioral_overlap_approved:false,
  cross_system_corroboration:false,
  personal_behavior_evidence:false,
  score_permission:false,may_affect_coherence:false,computational_effect:'none',
  graph_import_allowed:false
 };
}
function fourPeerProjection({records,crosswalk,targetRegistry=[],approvedMappings=[]}){
 const base=buildCelestialParentProjection({records,crosswalk,targetRegistry,approvedMappings});
 check(base.nodes.some(x=>x.id===ROOT)&&!base.nodes.some(x=>x.id===SYSTEM),'base graph incompatible');
 check(base.edges.every(flagFree),'base graph score firewall');
 check(base.metrics.approved_downstream_edges===0,'downstream links not authorized in v2 HD peer projection');
 const peerNode={id:SYSTEM,type:'celestial_peer_system',label:'Human Design',
   parent_layer_id:ROOT,record_status:'PARTIAL_ENGINE_NO_CANONICAL_GATE_MEANING_RECORDS',
   interpretive_only:true,scoring_effect:'none'};
 const peerEdge={id:'celestial:contains:'+SYSTEM,from:ROOT,to:SYSTEM,
   relation:'contains_peer_system',read_only:true,score_permission:false,
   may_affect_coherence:false,computational_effect:'none'};
 const result={...base,
  schema:'atuned.celestial.parent_graph_projection.v2.human_design_peer',
  status:'FOUR_PEER_FRAMEWORK_HD_INCOMPLETE_NO_DOWNSTREAM_MAPPING',
  peer_systems:[...base.peer_systems,'human_design'],
  nodes:[...base.nodes,peerNode],edges:[...base.edges,peerEdge],
  metrics:{...base.metrics,peer_systems:4,source_records:36,
    human_design_canonical_records:0,full_human_design_bodygraphs:0,
    parent_edges:base.metrics.parent_edges+1},
  human_design_contract:'atuned/data/celestial/human_design/HUMAN_DESIGN_FRAMEWORK_TEMPLATE_V1.json'};
 check(result.nodes.length===56&&result.edges.length===127,'expected additive 4-peer graph 56 nodes/127 edges');
 const ids=new Set(result.nodes.map(x=>x.id));
 check(ids.size===result.nodes.length&&result.edges.every(x=>ids.has(x.from)&&ids.has(x.to)),'graph endpoints or duplicate nodes');
 return result;
}
function fourPeerReading({selected_ids,records,crosswalk,hd=null}){
 const base=buildSourceOSReading({selected_ids,records,crosswalk});
 check(flagFree(base)&&base.graph_import_allowed===false,'legacy tri-system packet contract violated');
 const human_design=humanDesignContext({hd});
 return {
  ...base,
  schema:'atuned.celestial.source_os_four_peer_reading.v1',
  peer_systems:['western_astrology','eastern_astrology','modern_western_pythagorean','human_design'],
  human_design,
  four_peer_overlap_status:'HUMAN_DESIGN_MEANING_UNVERIFIED_DO_NOT_INCLUDE_IN_OVERLAP',
  narrative:base.narrative, // HD gate numbers alone do not supply behavioral claims
  score_permission:false,may_affect_coherence:false,computational_effect:'none',
  graph_import_allowed:false,target_id:null,app_runtime_wired:false
 };
}
module.exports={humanDesignContext,fourPeerProjection,fourPeerReading,SYSTEM};

});
unit("./celestial-avatar-cascade.cjs",function(module,require){
'use strict';
// Source OS V10: readonly behavior->coherent/shadow->avatar lens and reversible psyche navigation.
// Inputs from established canonical sources. This is NOT a new score, graph, profile or causal chain.
// MOB engine/avatar.js owns be/notbe; MOB engine/trace.js owns stored/derived trace edges.
const {buildSourceOSReading}=require('./source-ai-reading-pipeline.cjs');
const {fourPeerReading}=require('./human-design-peer-seam.cjs');
const LAYERS=Object.freeze([
 'celestial','character','superego','domain','blueprint','archetype','mask',
 'super_complex','hyper_complex','complex','saboteur','fetter','pattern',
 'nerve_address','story','impression','reframe','release','observation','evidence','behavior',
 'outcome','ritual','practice_event','context'
]);
const PROVENANCE=Object.freeze(['known','inferred','proposed','user_confirmed','observed']);
function invariant(ok,why){if(!ok)throw new Error('Celestial Avatar Cascade: '+why);}
function name(v){return typeof v==='string'&&v.trim()?v.trim():null;}
function quoteRef(r) {return {record_id:r.id,field:r.field,verbatim:r.verbatim};}
function graphKey(n){
 if(!n||typeof n!=='object')return null;
 if(name(n.key))return n.key;
 return name(n.type)&&name(n.id)?n.type+':'+n.id:null;
}
function readTrace(graph){
 if(graph==null)return {nodes:[],edges:[],byKey:new Map(),links:new Map()};
 invariant(graph&&Array.isArray(graph.nodes)&&Array.isArray(graph.edges),'trace graph must have nodes and edges');
 const byKey=new Map(),links=new Map();
 for(const n of graph.nodes){
  const key=graphKey(n);
  invariant(key&&!byKey.has(key),'duplicate/bad trace node key');
  byKey.set(key,{key,type:n.type,id:n.id||key.slice(n.type.length+1),
    label:name(n.label)||name(n.id)||key,src:PROVENANCE.includes(n.src)?n.src:'unknown'});
  links.set(key,[]);
 }
 for(const e of graph.edges){
  invariant(e&&name(e.from)&&name(e.to)&&name(e.edge),'invalid trace edge');
  invariant(byKey.has(e.from)&&byKey.has(e.to),'trace edge references missing node');
  invariant(PROVENANCE.includes(e.src),'trace edge has no valid provenance');
  const edge={from:e.from,to:e.to,relation:e.edge,provenance:e.src,
    approved_for_trace_graph:true};
  links.get(e.from).push({...edge,neighbor:e.to,direction:'downstream_in_source_edge_direction'});
  links.get(e.to).push({...edge,neighbor:e.from,direction:'upstream_against_source_edge_direction'});
 }
 return {nodes:[...byKey.values()],edges:graph.edges,byKey,links};
}
function route(graph,start,maxDepth=7){
 if(!start||!graph.byKey.has(start))return {focus_found:false,neighbors:[],paths:[]};
 invariant(Number.isInteger(maxDepth)&&maxDepth>=0&&maxDepth<=20,'invalid maximum depth');
 const q=[{key:start,path:[],depth:0}], seen=new Set([start]),neighbors=[],paths=[];
 while(q.length){
  const v=q.shift();
  if(v.depth>=maxDepth)continue;
  const arr=(graph.links.get(v.key)||[]).slice().sort((a,b)=>a.neighbor.localeCompare(b.neighbor)||a.relation.localeCompare(b.relation));
  for(const e of arr){
   if(seen.has(e.neighbor))continue;
   seen.add(e.neighbor);
   const step={from:e.from,to:e.to,relation:e.relation,provenance:e.provenance,
     approved_for_trace_graph:true,travel_direction:e.direction};
   const path=[...v.path,step];
   neighbors.push({key:e.neighbor,type:graph.byKey.get(e.neighbor).type,
     label:graph.byKey.get(e.neighbor).label,depth:v.depth+1,
     relationship:e.relation,provenance:e.provenance});
   paths.push({target_key:e.neighbor,steps:path});
   q.push({key:e.neighbor,path,depth:v.depth+1});
  }
 }
 return {focus_found:true,neighbors,paths};
}
function sourceMotion(cues){
 return cues.map(c=>({
  record_id:c.id,label:c.name,
  context_trigger:c.trigger?{field:c.trigger.field,verbatim:c.trigger.value}:null,
  operational_action:c.action?{field:c.action.field,verbatim:c.action.value}:null,
  coherent_expression:{record_id:c.id,field:c.action?.field||c.contrast_provenance.constructive_field,
    verbatim:c.action?.value||c.constructive},
  shadow_expression:{record_id:c.id,field:c.tension?.field||c.contrast_provenance.costly_field,
    verbatim:c.tension?.value||c.costly},
  behavioral_hinge:c.tension?{field:c.tension.field,verbatim:c.tension.value}:null,
  inspired_alternative:c.next_step?{field:c.next_step.field,verbatim:c.next_step.value}:null
 }));
}
function avatarPair(avatar,pairId){
 if(!pairId)return null;
 invariant(avatar&&Array.isArray(avatar.pairs),'avatar pairs required for selected pair ID');
 const matches=avatar.pairs.filter(p=>p&&p.id===pairId);
 invariant(matches.length===1&&name(matches[0].be)&&name(matches[0].notbe),'avatar pair absent or malformed');
 return {id:pairId,be:matches[0].be,notbe:matches[0].notbe,
  source:'MOB/atuned_src/engine/avatar.js',owner:'user_authored',
  current_progress:null,may_advance_from_celestial:false};
}
function selectedMask(masks,maskId){
 if(!maskId)return null;
 invariant(Array.isArray(masks),'mask registry required');
 const m=masks.filter(x=>x&&x.id===maskId);
 invariant(m.length===1&&name(m[0].label)&&name(m[0].source_path),
   'selected mask needs exact registered ID and source path');
 return {id:m[0].id,label:m[0].label,description:name(m[0].description),
  source_path:m[0].source_path,kind:'expression_modulator_not_graph_ancestry',
  activated_by_evidence:false};
}
function evidenceRefs(evidence,graph){
 invariant(Array.isArray(evidence),'evidence references must be an array');
 return evidence.map(e=>{
  invariant(e&&name(e.id)&&name(e.kind),'evidence ID and kind required');
  invariant(['story','historical_behavior','limiting_belief','inspired_truth','reframe',
    'somatic_report','practice','counterexample'].includes(e.kind),'unknown evidence kind');
  const key=name(e.trace_key);
  invariant(!key||graph.byKey.has(key),'evidence points to missing trace node');
  invariant(!e.confirmed_as_cause,'causal claim cannot be established by this overlay');
  return {id:e.id,kind:e.kind,trace_key:key,source_path:name(e.source_path),
    user_confirmed:e.user_confirmed===true,observed:e.observed===true,
    supports_motif:e.supports_motif===true,counterexample:e.kind==='counterexample'};
 });
}
function buildCelestialAvatarCascade({
 selected_ids,records,crosswalk,hd=null,
 trace_graph=null,focused_layer='celestial',focused_record_id=null,
 selected_mask_id=null,mask_registry=[],avatar=null,avatar_pair_id=null,
 evidence=[],max_depth=7
}){
 invariant(LAYERS.includes(focused_layer),'unsupported focus layer');
 const base=buildSourceOSReading({selected_ids,records,crosswalk});
 const four=fourPeerReading({selected_ids,records,crosswalk,hd});
 invariant(base.score_permission===false&&four.score_permission===false&&four.graph_import_allowed===false,
  'source firewall violated');
 const graph=readTrace(trace_graph);
 const focus=focused_record_id?name(focused_record_id):null;
 if(focus)invariant(focused_layer!== 'celestial','celestial context has no MOB graph record');
 const explored=route(graph,focus,max_depth);
 const mask=selectedMask(mask_registry,selected_mask_id);
 const pair=avatarPair(avatar,avatar_pair_id);
 const refs=evidenceRefs(evidence,graph);
 const motion=sourceMotion(base.record_cues);
 const supporting=refs.filter(e=>e.supports_motif);
 const counterexamples=refs.filter(e=>e.counterexample);
 return {
  schema:'atuned.celestial.avatar_cascade_view.v1',
  status:focus&&!explored.focus_found?'FOCUSED_CANONICAL_ID_UNRESOLVED':'VIEW_ONLY_CANDIDATE',
  lens:{systems:four.peer_systems,source_record_refs:base.selected_source_record_ids,
    authored_group_ids:base.authored_group_ids,
    candidate_overlap:base.overlap?{
      label:base.overlap.label,operational_behavior:base.overlap.operational_behavior,
      provenance:base.overlap.evidence.map(quoteRef),kind:base.overlap.kind
    }:null,
    human_design:four.human_design},
  psyche:{focus:{layer:focused_layer,record_id:focus,
    verified_in_trace:!!(focus&&explored.focus_found)},
    selected_mask:mask,
    mask_effect:'INTERPRETIVE_DISPLAY_MODIFIER_ONLY',
    mask_modulation:mask?{
      source_path:mask.source_path,
      context:mask.description||mask.label,
      coherent_prompt:'How might the coherent possibility be expressed while the '+mask.label+
        ' mask is present, without treating that mask as the whole person?',
      shadow_prompt:'When the '+mask.label+' mask is active, could the limiting expression emerge, and what real event would confirm or challenge that reading?',
      actual_mask_activation_confirmed:false,
      personal_causality_claimed:false
    }:null,
    observed_ancestor_descendant_paths:explored.paths,
    reachable_trace_nodes:explored.neighbors,
    unknown_route:focus&&!explored.focus_found?'NO_APPROVED_PATH_TO_FOCUS':'CELESTIAL_TO_PSYCH_NOT_AUTHORIZED',
    celestial_to_nerve_path_established:false},
  behavior:{record_motion:motion,
    coherent_possibilities:motion.map(x=>x.coherent_expression),
    shadow_possibilities:motion.map(x=>x.shadow_expression),
    hinges:motion.map(x=>x.behavioral_hinge).filter(Boolean),
    inspired_alternatives:motion.map(x=>x.inspired_alternative).filter(Boolean),
    supporting_evidence_refs:supporting,counterevidence_refs:counterexamples,
    personally_verified:supporting.some(e=>e.user_confirmed||e.observed),
    personal_causality_verified:false,
    default_reading:base.narrative},
  avatar:{selected_pair:pair,coherent_self_preview:pair?pair.be:null,
    limiting_self_preview:pair?pair.notbe:null,
    projection:'USER_OWNED_POSSIBILITY_ONLY',
    current_progress:null,board_position:null,visual_evolution_committed:false},
  evidence:refs,
  guardrails:{score_permission:false,may_affect_coherence:false,computational_effect:'none',
    trace_write_allowed:false,avatar_write_allowed:false,nerve_inference_allowed:false,
    app_runtime_wired:false}
 };
}
module.exports={buildCelestialAvatarCascade,readTrace,route,sourceMotion,LAYERS,PROVENANCE};

});
unit("./celestial-avatar-cascade-view.cjs",function(module,require){
'use strict';
// V10 framework UI component: safe static markup + optional DOM-selectable read-only preview.
// NOT installed into the production App/Graph Editor. Host must own lifecycle and data permissions.
const {buildCelestialAvatarCascade,readTrace}=require('./celestial-avatar-cascade.cjs');
const esc=x=>String(x==null?'':x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=x=>x?esc(x):'Not established';
function list(items,render,empty='No supporting records available'){
 return items&&items.length?'<ul>'+items.map(x=>'<li>'+render(x)+'</li>').join('')+'</ul>':
 '<p class="cal-muted">'+esc(empty)+'</p>';
}
function renderCelestialAvatarCascade(view,choices={}){
 if(!view||view.schema!=='atuned.celestial.avatar_cascade_view.v1')
  throw new Error('Cascade view renderer requires a V10 view model');
 const opts=(items,selected,fmt)=>items.map(x=>{
   const id=x.id;return '<option value="'+esc(id)+'"'+(selected===id?' selected':'')+'>'+esc(fmt(x))+'</option>';
 }).join('');
 const masks=Array.isArray(choices.masks)?choices.masks:[],
   pairs=Array.isArray(choices.avatar_pairs)?choices.avatar_pairs:[],
   focusNodes=Array.isArray(choices.trace_nodes)?choices.trace_nodes:[];
 const maskOptions='<option value="">No mask selected</option>'+opts(masks,view.psyche.selected_mask?.id,
  x=>x.label);
 const avatarOptions='<option value="">No avatar pair selected</option>'+opts(pairs,view.avatar.selected_pair?.id,
  x=>x.be+' / '+x.notbe);
 const focusOptions='<option value="">Celestial context</option>'+opts(focusNodes,view.psyche.focus.record_id,
  x=>x.label||x.key);
 const motion=view.behavior.record_motion;
 const sourceMotion=motion.map(x=>'<article class="cal-source"><h4>'+esc(x.label)+'</h4>'+
  '<p>'+esc(x.context_trigger?.verbatim||'Context not specified')+'</p>'+
  '<p><b>Constructive:</b> '+label(x.coherent_expression?.verbatim)+'</p>'+
  '<p><b>Costly:</b> '+label(x.shadow_expression?.verbatim)+'</p>'+
  '<p><b>Hinge:</b> '+label(x.behavioral_hinge?.verbatim)+'</p></article>').join('');
 const pathText=view.psyche.observed_ancestor_descendant_paths.slice(0,50).map(p=>
  '<li><strong>'+esc(p.target_key)+'</strong> — '+p.steps.map(s=>
   esc(s.from+' '+s.relation+' '+s.to+' ['+s.provenance+']')).join(' / ')+'</li>').join('');
 const hd=view.lens.human_design;
 return '<section class="cal-root" data-celestial-avatar-cascade="v1" aria-label="Celestial behavioral avatar lens">'+
 '<h2>Behavior and the avatar</h2><p class="cal-muted">A source-guided interpretation, not a fixed personality definition or a measurement.</p>'+
 '<div class="cal-controls">'+
 '<label>Selected mask <select data-cal-mask>'+maskOptions+'</select></label>'+
 '<label>Avatar aspiration <select data-cal-pair>'+avatarOptions+'</select></label>'+
 '<label>Trace focus <select data-cal-focus>'+focusOptions+'</select></label>'+
 '</div><section><h3>Shared behavioral lens</h3>'+
 '<p>'+label(view.lens.candidate_overlap?.label)+'</p>'+
 '<p>'+label(view.lens.candidate_overlap?.operational_behavior)+'</p>'+
 '<p class="cal-muted">Human Design: '+esc(hd.status.replace(/_/g,' ').toLowerCase())+
  (hd.profile?' · profile '+esc(hd.profile):'')+'. Type and authority unverified.</p></section>'+
 '<section><h3>How the same tendency can express itself</h3><div class="cal-expressions">'+sourceMotion+'</div></section>'+
 '<section><h3>Mask expression context</h3>'+
 (view.psyche.mask_modulation?'<p><b>'+esc(view.psyche.selected_mask.label)+'</b>: '+
  esc(view.psyche.mask_modulation.context)+'</p><p><b>Coherent question:</b> '+
  esc(view.psyche.mask_modulation.coherent_prompt)+'</p><p><b>Shadow question:</b> '+
  esc(view.psyche.mask_modulation.shadow_prompt)+'</p>':
  '<p class="cal-muted">Select a known mask to inspect how it might change the expression.</p>')+'</section>'+
 '<section><h3>Chosen self and shadow</h3>'+
 '<p><b>Coherent possibility:</b> '+label(view.avatar.coherent_self_preview)+'</p>'+
 '<p><b>Limiting expression:</b> '+label(view.avatar.limiting_self_preview)+'</p>'+
 '<p class="cal-muted">Only a self-authored avatar pair can populate these. No avatar score changes.</p></section>'+
 '<section><h3>Evidence and corrections</h3>'+
 '<p>'+view.behavior.supporting_evidence_refs.length+' supporting references; '+
 view.behavior.counterevidence_refs.length+' counterexamples. Interpretations remain revisable.</p>'+
 list(view.behavior.supporting_evidence_refs,x=>esc(x.kind+': '+x.id),'No personal observations connected')+
 list(view.behavior.counterevidence_refs,x=>esc('Counterexample: '+x.id),'No counterexamples supplied')+
 '</section>'+
 '<section><h3>Known trace paths</h3>'+
 '<p class="cal-muted">Focus: '+label(view.psyche.focus.record_id||'Celestial layer')+'. '+
 (view.psyche.focus.verified_in_trace?'Matched in supplied Trace Graph':'No canonical trace focus established')+'. '+
 'Celestial is an external lens, not a Trace Graph node.</p>'+
 (pathText?'<ol>'+pathText+'</ol>':'<p class="cal-muted">No verified downstream traversal for this focus.</p>')+
 '</section>'+
 '<p class="cal-muted">Read-only · No CQ/DQ/SQ, profile, fetter, nerve or avatar state is modified.</p>'+
 '</section>';
}
function mountCelestialAvatarCascade(container,inputs){
 if(!container||typeof container.querySelector!=='function')throw new Error('DOM container required');
 const options={mask_registry:inputs.mask_registry||[],avatar:inputs.avatar||null,
  trace_graph:inputs.trace_graph||null};
 const nodes=readTrace(options.trace_graph).nodes;
 let settings={selected_mask_id:inputs.selected_mask_id||null,
  avatar_pair_id:inputs.avatar_pair_id||null,
  focused_record_id:inputs.focused_record_id||null,focused_layer:inputs.focused_layer||'celestial'};
 const focusEntries=nodes.map(x=>({id:x.key,key:x.key,label:x.label+' ('+x.type+')',type:x.type}));
 let destroyed=false;
 function paint(){
  if(destroyed)throw new Error('Cascade view already destroyed');
  const view=buildCelestialAvatarCascade({...inputs,...settings});
  container.innerHTML=renderCelestialAvatarCascade(view,{
   masks:options.mask_registry,
   avatar_pairs:options.avatar?.pairs||[],trace_nodes:focusEntries});
  const mask=container.querySelector('[data-cal-mask]'),
   pair=container.querySelector('[data-cal-pair]'), focus=container.querySelector('[data-cal-focus]');
  if(mask)mask.addEventListener('change',()=>{settings.selected_mask_id=mask.value||null;paint()});
  if(pair)pair.addEventListener('change',()=>{settings.avatar_pair_id=pair.value||null;paint()});
  if(focus)focus.addEventListener('change',()=>{
    settings.focused_record_id=focus.value||null;
    settings.focused_layer=focus.value?nodes.find(x=>x.key===focus.value)?.type||'story':'celestial';
    paint();
  });
  return view;
 }
 const first=paint();
 return {view:first, update(next){settings={...settings,...next};return paint()},
  destroy(){destroyed=true;container.innerHTML='';}};
}
module.exports={renderCelestialAvatarCascade,mountCelestialAvatarCascade,esc};

});
function src(){if(typeof AT_CELESTIAL_SNAPSHOT==='undefined')throw Error('Celestial snapshot missing');return AT_CELESTIAL_SNAPSHOT;}
return {snapshot:src,build:function(args){var d=src();return mods['./celestial-avatar-cascade.cjs'].buildCelestialAvatarCascade(Object.assign({records:d.records,crosswalk:d.crosswalk},args||{}));},render:mods['./celestial-avatar-cascade-view.cjs'].renderCelestialAvatarCascade,mount:function(container,args){var d=src();return mods['./celestial-avatar-cascade-view.cjs'].mountCelestialAvatarCascade(container,Object.assign({records:d.records,crosswalk:d.crosswalk},args||{}));}};
})();
