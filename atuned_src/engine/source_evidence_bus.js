/* Source AI V11 follow-on: bounded, read-only downstream evidence envelope.
 * STAGED SOURCE ONLY: not in MANIFEST, not wired to the voice host.
 * This adapter never reads a profile, infers a body region, grades CQ, or writes.
 * Caller must supply srcVoiceIntelligence's already-redacted result.
 */
function srcVoiceEvidenceBus(report,opts){
 var o=opts||{};
 var out={schema:'atuned.source.evidence-bus.v1',status:'UNREAD',
  source:'MOB/srcVoiceIntelligence',sessionShare:false,profileShare:false,
  evidenceRefs:[],packets:[],writeAuthority:'NONE',
  note:'Evidence relay only. No interpretation is a verified cause or score.'};
 if(o.revoked===true){out.status='REVOKED';return out;}
 if(o.allowSessionShare!==true){out.status='CONSENT_REQUIRED';return out;}
 if(!report||typeof report!=='object'||!report.voice||!report.intelligence){
  out.status='INVALID_REPORT';return out;}
 var v=report.voice, intel=report.intelligence;
 out.status='READ';out.sessionShare=true;
 /* Host verification is a contract, not something this pure function
  * can independently authenticate. Production host MUST bind active record. */
 out.profileShare=o.allowProfileShare===true&&o.userConsent===true&&
  o.hostVerifiedActiveRecord===true&&
  (intel.graphStatus==='READ'||intel.graphStatus==='PARTIAL');
 var ev=Array.isArray(intel.evidence)?intel.evidence.slice(0,12):[];
 var hits=Array.isArray(v.hits)?v.hits.slice(0,12):[];
 ev.forEach(function(e,i){
  if(e&&e.source==='current_turn')out.evidenceRefs.push({
   ref:'ledger:'+i,origin:'CURRENT_USER_TURN',type:'LEDGER_OBSERVATION'});
 });
 hits.forEach(function(h,i){
  if(h&&Number.isInteger(h.sourceOffset)&&h.sourceOffset>=0){
   out.evidenceRefs.push({ref:'voice:'+i,origin:'CURRENT_USER_TURN',
    type:'LEXICAL_CANDIDATE',offset:Math.min(5000,h.sourceOffset)});
  }
 });
 var narrative=intel.narrative||{};
 var familyStates=['NOT_REPORTED','FAMILY_TO_SELF_CANDIDATE',
  'REJECTED_BY_SPEAKER','SELF_RESEMBLANCE_UNSPECIFIED'];
 var family=familyStates.indexOf(narrative.familyToSelf)>=0?
  narrative.familyToSelf:'NOT_REPORTED';
 var summary={sourceStatus:v.status==='READ'?'READ':'UNREAD',
  evidenceCount:out.evidenceRefs.length,
  familyToSelf:family,ancestralCausation:'NOT_ESTABLISHED',
  cq:'NOT_MEASURED',lawGrades:'NOT_MEASURED',
  emotionCycle:intel.emotionCycle?'CANDIDATE_READ_ONLY':'UNASSESSED'};
 var targets=[
  ['SOURCE','SESSION_CONVERSATION','NONE'],
  ['BODY_MAP','REGION_MAPPING_UNAPPROVED','NONE'],
  ['AVATAR','SHADOW_QUOTIENT_NOT_MEASURED','NONE'],
  ['COMPASS','COHERENCE_NOT_MEASURED','NONE'],
  ['STORY_BANK','PERSISTENCE_REQUIRES_SEPARATE_CONSENT','NONE'],
  ['GRAPH_EDITOR','EXISTING_GRAPH_OWNER_ONLY','NONE'],
  ['CQDQ_LAWS','GRADES_NOT_MEASURED','NONE'],
  ['RITUAL_BUILDER','CREATION_REQUIRES_SEPARATE_CONFIRMATION','NONE'],
  ['RELEASE_PROTOCOL','INITIATION_REQUIRES_SEPARATE_CONFIRMATION','NONE']
 ];
 out.packets=targets.map(function(row){
  return {target:row[0],status:'PROVISIONAL_READ_ONLY',boundary:row[1],
   action:row[2],sourceRefs:out.evidenceRefs.map(function(x){return x.ref;}),
   summary:{sourceStatus:summary.sourceStatus,evidenceCount:summary.evidenceCount,
    familyToSelf:summary.familyToSelf,ancestralCausation:summary.ancestralCausation,
    cq:summary.cq,lawGrades:summary.lawGrades,emotionCycle:summary.emotionCycle},
   graphStatus:row[0]==='GRAPH_EDITOR'?
    (out.profileShare?intel.graphStatus:'CONSENT_REQUIRED'):'NOT_REQUESTED'};
 });
 return out;
}
