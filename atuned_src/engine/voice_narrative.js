/* SOURCE narrative role and lineage observations.
 * Read-only, host-free, source-text-grounded. No diagnosis, CQ grading,
 * ancestry causation, character label, automatic question or profile write.
 */
function srcVoiceNarrative(turns){
 var input=Array.isArray(turns)?turns:[turns], latest=input.length-1;
 var descriptions=[], selfReports=[], corrections=[], familyByTerm={};
 var kin=/\b(?:my|our)\s+(sister|brother|mother|mom|mum|father|dad|parents|grandmother|grandfather|grandparents|grandma|grandpa|aunt|uncle|child|son|daughter)\b/ig;
 var descriptors=/\b(indignant|indignation|avoidant|avoiding|angry|anger|resentful|resentment|dismissive|critical|judgmental|judgemental|withdrawn|distant|disrespectful|hurt|rejected|rejecting|unloved|fearful|defensive|ashamed|controlling)\b/ig;
 var selfYes=/\b(?:i\s+(?:can\s+)?(?:also\s+)?(?:see|notice|recognize|recognise|find)\s+(?:some\s+of\s+)?(?:their|those|these|the|my\s+family'?s)\s+(?:patterns?|traits?|behavio[u]?rs?|habits?|things?)\s+(?:in|within)\s+(?:myself|me)|i\s+(?:can\s+)?(?:see|recognize|recognise|notice)\s+(?:them|it)\s+(?:in|within)\s+(?:myself|me)|i\s+have\s+(?:those|the\s+same|similar)\s+patterns?|i\s+(?:am|'m)\s+(?:just\s+)?like\s+(?:them|my\s+(?:mother|father|parents)))\b/i;
 var uncertainSelf=/\b(?:i\s+(?:do\s+not|don't)\s+know\s+(?:if|whether)|i\s+(?:am\s+not|ain't|amn't)\s+sure\s+(?:if|whether)|maybe|perhaps|hypothetically|imagine|suppose|what\s+if)\b/i;
 var hypothetical=/\b(?:hypothetically|imagine|suppose|what\s+if|let's\s+pretend|let us pretend)\b/i;
 var selfNo=/\b(?:i\s+(?:do\s+not|don't|never|cannot|can't)\s+(?:see|notice|recognize|recognise|have)\s+(?:(?:their|those|the|these)\s+)?(?:patterns?|traits?|behavio[u]?rs?|habits?)\s+(?:in|within)\s+(?:myself|me)|i\s+(?:am\s+not|'m\s+not|am\s+different\s+from|am\s+nothing\s+like)\s+(?:like\s+)?(?:them|my\s+(?:mother|father|parents))|those\s+patterns?\s+(?:are\s+not|aren't)\s+(?:in|within)\s+me)\b/i;
 function addTerm(row){descriptions.push(row);var k=row.term;
  if(!row.negated&&!row.hypothetical){(familyByTerm[k]||(familyByTerm[k]=[])).push(row.role);}}
 input.forEach(function(raw,turn){
  var text=String(raw||'').slice(0,5000), list=[], m;
  /* Attribute speculation per clause, not per entire turn. */
  kin.lastIndex=0;
  while((m=kin.exec(text))!==null){list.push({role:m[1].toLowerCase(),start:m.index,end:kin.lastIndex});}
  list.forEach(function(person,i){
   var stop=i+1<list.length?list[i+1].start:text.length;
   var nextSelf=text.slice(person.end).search(/\b(?:i\s+(?:can\s+)?(?:see|notice|recognize|recognise)|i\s+have\s+(?:those|the same))\b/i);
   /* Do not assign the speaker's first-person descriptor to their relative. */
   var firstPerson=text.slice(person.end,stop).search(/\b(?:I|we)\s+(?:am|was|were|feel|felt|have|had|became|become|got|can|will|do|did|think|said|say)\b/i);
   if(firstPerson>=0)stop=Math.min(stop,person.end+firstPerson);
   if(nextSelf>=0)stop=Math.min(stop,person.end+nextSelf);
   var clause=text.slice(person.end,Math.min(stop,person.end+130)).split(/[.!?;]/)[0];
   var prefix=text.slice(0,person.start).split(/[.!?;]/).pop();
   var hypotheticalClause=hypothetical.test(prefix)||hypothetical.test(clause)||/\b(?:maybe|perhaps)\b/i.test(prefix);
   descriptors.lastIndex=0;
   var hit;while((hit=descriptors.exec(clause))!==null){
    var pre=clause.slice(Math.max(0,hit.index-45),hit.index).toLowerCase();
    var negated=/\b(?:not|never|no|isn't|wasn't|doesn't|didn't|is not|was not|no longer)\s+(?:\w+\s+){0,2}$/.test(pre);
    addTerm({turn:turn,role:person.role,term:hit[1].toLowerCase(),negated:negated, hypothetical:hypotheticalClause,
     status:'USER_REPORTED_THIRD_PARTY_DESCRIPTION',sourceOffset:person.end+hit.index});
   }
  });
  /* Self reports and uncertainty are scoped to their own sentence;
   * latest explicit correction wins within a turn as well as across turns. */
  /* Process all assertions chronologically, including repeated reversals. */
  var events=[], match, yesRx=new RegExp(selfYes.source,'gi'),
      noRx=new RegExp(selfNo.source,'gi');
  while((match=yesRx.exec(text))!==null){
   events.push({offset:match.index,end:yesRx.lastIndex,positive:true});
   if(!match[0].length)yesRx.lastIndex++;
  }
  while((match=noRx.exec(text))!==null){
   events.push({offset:match.index,end:noRx.lastIndex,positive:false});
   if(!match[0].length)noRx.lastIndex++;
  }
  events.sort(function(a,b){return a.offset-b.offset || a.end-b.end;});
  events.forEach(function(event){
   var clause=text.slice(0,event.end).split(/[.!?;]/).pop();
   if(hypothetical.test(clause)||uncertainSelf.test(clause))return;
   if(event.positive)
    selfReports.push({turn:turn,offset:event.offset,state:'CANDIDATE_RESEMBLANCE_REPORTED'});
   else
    corrections.push({turn:turn,offset:event.offset,state:'SELF_RESEMBLANCE_DENIED'});
  });
 });
 var lastYes=selfReports.length?selfReports[selfReports.length-1]:null;
 var lastNo=corrections.length?corrections[corrections.length-1]:null;
 var denialWins=lastNo&&(!lastYes||lastNo.turn>lastYes.turn||
  (lastNo.turn===lastYes.turn&&lastNo.offset>=lastYes.offset));
 var state=denialWins?'REJECTED_BY_SPEAKER':
  lastYes&&descriptions.some(function(d){return !d.negated&&!d.hypothetical;})?'FAMILY_TO_SELF_CANDIDATE':
  lastYes?'SELF_RESEMBLANCE_UNSPECIFIED':'NOT_REPORTED';
 var parentTerms={},elderTerms={};
 descriptions.filter(function(d){return !d.negated&&!d.hypothetical;}).forEach(function(d){
  if(/^(mother|mom|mum|father|dad|parents)$/.test(d.role))parentTerms[d.term]=true;
  if(/^(grandmother|grandfather|grandparents|grandma|grandpa)$/.test(d.role))elderTerms[d.term]=true;});
 var shared=Object.keys(parentTerms).filter(function(t){return elderTerms[t];});
 var causal='NOT_ESTABLISHED';
 // Two generations describing the same term are only a reported similarity;
 // never declare inheritance, epigenetic transmission or spiritual mechanism.
 return {status:'READ',source:'MOB voice turn text, without verification',
  observations:descriptions.slice(-16),selfReports:selfReports.slice(-5),
  corrections:corrections.slice(-5),familyToSelf:state,
  sharedParentGrandparentDescriptors:shared,
  multiGeneration:shared.length?'MULTIGENERATIONAL_SIMILARITY_REPORTED':'NOT_ESTABLISHED',
  whichPatternIsInSelf:'UNKNOWN_UNLESS_EXPLICITLY_NAMED',
  ancestralCausation:causal,measuredCQ:'NOT_MEASURED',
  lastTurn:latest,needMoreEvidence:state==='FAMILY_TO_SELF_CANDIDATE',
  rule:'Quoted family descriptions are attributed user reports, not verified identities or causes. Only the speaker may confirm.'};
}
