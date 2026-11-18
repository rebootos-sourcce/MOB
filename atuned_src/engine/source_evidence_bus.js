/* REVIVED 17 NOVEMBER from the closed voice prototype (PR 163, rejected 8
 * November; its last commit is aa449a80 on origin/source-voice-prototype).
 * NOT YET REVIEWED BY HIM. On 17 November he said:
 * "Revive it and put a note next to it for when we review it. I don't quite know
 * what it's doing anymore, the 96 pattern, but let's add it."
 * The open questions for that review are in DECISIONS.md, under "The voice
 * prototype's read only layer, revived, 17 November".
 *
 * WHAT IT DOES. It takes the srcVoiceIntelligence report and, only when the
 * caller passes allowSessionShare as exactly true, reshapes it into nine
 * labelled packets (source, body map, avatar, compass, story bank, graph
 * editor, laws, ritual builder, release protocol). Every packet says action
 * none and write authority none, and carries status words and a count only:
 * no text, no seat, no pattern id.
 *
 * WHERE ITS OUTPUT GOES. To its caller. No page or consumer reads a packet,
 * so the nine slots are a mailbox with nobody listening. Checking the shape
 * of a report is not authenticating it, which is why a production host has to
 * verify identity and consent itself before this is ever read.
 */
/* Source AI evidence envelope v1.1, audit-hardened staging adapter.
 * In MANIFEST and export.js (round SR, 2 November), read-only and callable;
 * no production host or consumer calls it yet, and every packet it returns
 * still says NOT_EXPORTED_UNTRUSTED_HOST, ACTION NONE, writeAuthority NONE.
 * Source is untrusted input to this function, even if it has canonical labels.
 * No boolean, including hostVerifiedActiveRecord, authenticates a record.
 * This function creates session-only candidate metadata, not authority.
 */
function srcVoiceEvidenceBus(report,opts){
 var o=(opts&&typeof opts==='object'&&!Array.isArray(opts))?opts:{};
 function empty(status){return {
  schema:'atuned.source.evidence-bus.v1.1',status:status,
  source:'MOB/srcVoiceIntelligence',sessionShare:false,profileShare:false,
  evidenceRefs:[],packets:[],writeAuthority:'NONE',
  provenance:'UNVERIFIED_CALLER_REPORT',
  note:'Session-only candidate evidence; no auth, profile access, diagnosis, causal inference, law grade or downstream action.'};}
 if(o.revoked===true)return empty('REVOKED');
 if(o.allowSessionShare!==true)return empty('CONSENT_REQUIRED');
 if(!report||typeof report!=='object'||Array.isArray(report)||
  !report.voice||typeof report.voice!=='object'||Array.isArray(report.voice)||
  !report.intelligence||typeof report.intelligence!=='object'||Array.isArray(report.intelligence))
  return empty('INVALID_REPORT');
 var v=report.voice, intel=report.intelligence;
 /* Shape checking is NOT an authenticity check. A production host must
  * independently verify active session, user consent and record identity. */
 if(v.engine!=='MOB/sniffStory+srcHear'||
  intel.engine!=='MOB/evLedger+srcVoiceGraph'||
  intel.recordScope!=='ACTIVE_RECORD_ONLY'||
  (intel.status!=='READ'&&intel.status!=='UNREAD')||
  (v.status!=='READ'&&v.status!=='UNREAD')||
  intel.coherence!=='NOT_MEASURED'||intel.ancestry!=='NOT_ASSESSED')
  return empty('INVALID_REPORT');
 if(intel.status==='UNREAD')return empty('UNREAD');
 var out=empty('READ');out.sessionShare=true;
 /* Do not grant profileShare from caller supplied booleans or graphStatus.
  * Such authorization belongs ONLY inside a trusted, identity-bound host. */
 var ev=Array.isArray(intel.evidence)?intel.evidence.slice(0,12):[];
 var hits=v.status==='READ'&&Array.isArray(v.hits)?v.hits.slice(0,12):[];
 ev.forEach(function(e,i){
  if(e&&e.source==='current_turn'&&e.status==='USER_REPORTED')
   out.evidenceRefs.push({ref:'turn:ledger:'+i,
    origin:'CURRENT_TURN_CLAIMED_BY_CALLER',type:'LEDGER_CANDIDATE',
    durability:'EPHEMERAL_SESSION_ONLY',verification:'NOT_VERIFIED'});
 });
 hits.forEach(function(h,i){
  if(h&&typeof h.sourceOffset==='number'&&Number.isSafeInteger(h.sourceOffset)&&
   h.sourceOffset>=0&&h.sourceOffset<=5000)
   out.evidenceRefs.push({ref:'turn:voice:'+i,
    origin:'CURRENT_TURN_CLAIMED_BY_CALLER',type:'LEXICAL_CANDIDATE',
    durability:'EPHEMERAL_SESSION_ONLY',verification:'NOT_VERIFIED'});
 });
 var narrative=intel.narrative||{};
 var familyStates=['NOT_REPORTED','FAMILY_TO_SELF_CANDIDATE',
  'REJECTED_BY_SPEAKER','SELF_RESEMBLANCE_UNSPECIFIED'];
 var family=familyStates.indexOf(narrative.familyToSelf)>=0?
  narrative.familyToSelf:'NOT_REPORTED';
 var summary={sourceStatus:v.status==='READ'?'LEXICAL_CANDIDATES':'NO_LEXICAL_MATCH',
  evidenceCount:out.evidenceRefs.length,familyToSelf:family,
  ancestry:'NOT_ASSESSED',ancestralCausation:'NOT_ESTABLISHED',
  cq:'NOT_MEASURED',lawGrades:'NOT_MEASURED',
  emotionCycle:intel.emotionCycle&&intel.emotionCycle.status==='READ'?
   'CANDIDATE_READ_ONLY':'UNASSESSED'};
 var targets=[
  ['SOURCE','SESSION_CONVERSATION'],
  ['BODY_MAP','REGION_MAPPING_UNAPPROVED'],
  ['AVATAR','SHADOW_QUOTIENT_NOT_MEASURED'],
  ['COMPASS','COHERENCE_NOT_MEASURED'],
  ['STORY_BANK','PERSISTENCE_REQUIRES_SEPARATE_CONSENT'],
  ['GRAPH_EDITOR','TRUSTED_HOST_IDENTITY_AND_CONSENT_REQUIRED'],
  ['CQDQ_LAWS','GRADES_NOT_MEASURED'],
  ['RITUAL_BUILDER','CREATION_REQUIRES_SEPARATE_CONFIRMATION'],
  ['RELEASE_PROTOCOL','INITIATION_REQUIRES_SEPARATE_CONFIRMATION']
 ];
 out.packets=targets.map(function(row){
  return {target:row[0],status:'PROVISIONAL_SESSION_ONLY',
   boundary:row[1],action:'NONE',writeAuthority:'NONE',
   sourceRefs:out.evidenceRefs.map(function(x){return x.ref;}),
   referenceDurability:'EPHEMERAL_SESSION_ONLY',
   summary:{sourceStatus:summary.sourceStatus,evidenceCount:summary.evidenceCount,
    familyToSelf:summary.familyToSelf,ancestry:summary.ancestry,
    ancestralCausation:summary.ancestralCausation,cq:summary.cq,
    lawGrades:summary.lawGrades,emotionCycle:summary.emotionCycle},
   graphStatus:'NOT_EXPORTED_UNTRUSTED_HOST',
   dispatch:'NONE'};
 });
 return out;
}
