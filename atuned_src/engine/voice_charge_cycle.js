/* Source AI: read-only TULA emotion episode interpreter. v0.2 draft.
 * Lexical ranks are ordinal TULA words, NOT CQ or a physiological reading.
 * Keep subject, self-report, direction and time perspective independent.
 * Do not mutate profile state or initiate conversational questions.
 */
var SRC_TULA_LADDERS={
 Fear:['cautious','uneasy','nervous','worried','scared','afraid','terrified','panicked','horrified'],
 Anger:['annoyed','irritated','upset','angry','mad','furious','livid','outraged','enraged'],
 Sadness:['down','unhappy','sad','sorrowful','mournful','grief-stricken','heartbroken','despondent','desolate'],
 Disgust:['displeased','disapproving','disgusted','offended','repulsed','revolted','appalled','horrified','sickened'],
 Shock:['surprised','stunned','shocked','shaken','disturbed','dismayed','flabbergasted','astonished','thunderstruck'],
 Happiness:['content','pleased','happy','cheerful','joyful','delighted','ecstatic','overjoyed','jubilant'],
 Shame:['embarrassed','regretful','remorseful','ashamed','guilty','disgraced','humiliated','mortified','shamed']
};
var SRC_TULA_PAGE={Fear:3,Anger:4,Sadness:5,Disgust:6,Shock:7,Happiness:8,Shame:9};
/* Idioms are candidates, NOT authored TULA ladder ranks. */
var SRC_TULA_IDIOMS=[
 {phrase:'pissed off',family:'Anger'},{phrase:'pissed me off',family:'Anger'},{phrase:'angrier',family:'Anger'}, {phrase:'frightened',family:'Fear'},
 {phrase:'seething',family:'Anger'},{phrase:'raging',family:'Anger'},
 {phrase:'infuriated',family:'Anger'},{phrase:'fuming',family:'Anger'},
 {phrase:'calmed down',family:null},{phrase:'settled down',family:null}
];
var SRC_TULA_CHANNELS={
 Believe:/\b(?:i\s+(?:believe|assume|trust)|my belief)\b/i,
 Perceive:/\b(?:i\s+(?:see|notice|perceive|observe|imagine|recognize|recognise))\b/i,
 Think:/\b(?:i\s+(?:think|thought|suppose|wonder|know))\b/i,
 Behave:/\b(?:i\s+(?:behave|react|withdraw|avoid))\b/i,
 Act:/\b(?:i\s+(?:did|do|chose|choose|decided|walked|yelled|shouted|paused|stopped))\b/i,
 Say:/\b(?:i\s+(?:said|say|told|spoke|shouted|yelled))\b/i,
 Feel:/\b(?:i\s+(?:feel|felt|was|got|became))\b/i
};
var SRC_TULA_ROLE=/\b(?:my\s+)?(mother|mom|mum|father|dad|sister|brother|aunt|uncle|grandmother|grandfather|grandma|grandpa|parent|parents|he|she|they|him|her)\b/ig;
var SRC_TULA_NEG=/\b(?:not|never|no|wasnt|wasn't|weren't|isn't|isnt|didn't|didnt|don't|dont|was not|did not|am not|ain't)\b/i;
var SRC_TULA_HYP=/\b(?:imagine|hypothetically|suppose|what if|if i|might|could|would|perhaps|maybe|pretend)\b/i;
var SRC_TULA_FUTURE=/\b(?:tomorrow|next week|next month|one day|in the future|i might|what if)\b/i;
var SRC_TULA_CHOICE=/\b(?:i\s+(?:decided|chose|choose|made a choice)|i wanted to\s+\w+(?:\s+\w+)?\s+but|i\s+(?:paused|stopped)\s+myself)\b/i;
var SRC_TULA_AFTER=/\b(?:after|afterwards?|later|then|subsequently|eventually|once)\b/i;
var SRC_TULA_DOWN=/\b(?:calmed? down|settled down|cooled off|felt calmer|let it go|decompress(?:ed|ing)?|relaxed|became calmer|was less angry)\b/i;
var SRC_TULA_UP=/\b(?:even angrier|got angrier|grew angrier|more furious|more upset|escalated|kept building|building up|got worse)\b/i;
var SRC_TULA_CONTINUE=/\b(?:still furious|still angry|remained angry|kept feeling angry|continued to feel angry)\b/i;
var SRC_TULA_STABLE=/\b(?:stayed angry|was angry for hours|remained angry for hours|stayed furious|never changed)\b/i;
var SRC_TULA_RETRACT=/\b(?:no,?\s+i\s+(?:wasn't|wasn’t|was not|never|didn't|did not)|actually,?\s+no\b|i\s+(?:don't|don’t|do not)\s+see\s+(?:those|their)\s+patterns|i\s+(?:wasn't|wasn’t|was not)\s+angry)\b/i;
var SRC_TULA_DECREASE=/\b(?:calmed? down|settled down|cooled off|felt calmer|let it go|relaxed)\b/i;
var SRC_TULA_AFTER_SHAME=/\b(?:embarrassed|ashamed|guilty|humiliated|regretful|remorseful|mortified)\b/i;
function srcTulaWords(){
 var out=[];
 Object.keys(SRC_TULA_LADDERS).forEach(function(f){
  SRC_TULA_LADDERS[f].forEach(function(w,i){out.push({word:w,family:f,tulaRank:i+1,page:SRC_TULA_PAGE[f],matchKind:'EXACT_TULA'});});});
 SRC_TULA_IDIOMS.forEach(function(a){if(a.family)out.push({word:a.phrase,family:a.family,tulaRank:null,page:null,matchKind:'PROVISIONAL_IDIOM'});});
 return out.sort(function(a,b){return b.word.length-a.word.length;});
}
function srcTulaRole(phrase,word,idx){
 var prior=phrase.slice(0,idx), tail=phrase.slice(idx+word.length), lastI=Math.max(prior.lastIndexOf(' i '),prior.lastIndexOf(' i\''),prior.lastIndexOf(' me '));
 var lastOther=null, m;SRC_TULA_ROLE.lastIndex=0;
 while((m=SRC_TULA_ROLE.exec(prior))!==null)lastOther={name:m[1].toLowerCase(),at:m.index};
 if(/\b(?:he|she|they)\s+said\b/i.test(phrase)&&/["“”]/.test(phrase))return 'quoted_other';
 /* Transitive 'I pissed off <someone>' names a caused event, not speaker's anger. */
 if(word==='pissed off'&&/\bi\s+pissed off\s+(?:my|his|her|the|a|an|him|her|them)\b/i.test(phrase))return 'causative_other';
 if(word==='pissed off'&&/\bpissed\s+(?:my|his|her|him|them)\s+off\b/i.test(phrase))return 'causative_other';
 if((word==='pissed off'||word==='pissed me off')&&/\bpissed\s+me\s+off\b/i.test(phrase))return 'self';
 if(lastOther&&lastOther.at>lastI&&(/\b(?:my\s+)?(?:father|mother|mom|dad|sister|brother|aunt|uncle|grandfather|grandmother|grandma|grandpa|parent|parents|he|she|they)\b/i.test(prior))){
  var role=lastOther.name;
  return ['he','him','she','her','they'].indexOf(role)>=0?'third_party':role;
 }
 if(/\b(?:he|she|they)\b/i.test(phrase.slice(0,idx))&&lastI<0)return 'third_party';
 return 'self';
}
function srcTulaClauses(text){
 /* Keep quote punctuation in the evidence, but do not let one clause's negation
    or actor apply to a later sentence. */
 var a=[],last=0, re=/[.!?;]+/g,m;
 while((m=re.exec(text))!==null){if(text.slice(last,m.index).trim())a.push({s:last,e:m.index,text:text.slice(last,m.index)});last=re.lastIndex;}
 if(text.slice(last).trim())a.push({s:last,e:text.length,text:text.slice(last)});
 return a;
}
function srcTulaObservations(text,turn){
 var out=[],low=String(text||'').toLowerCase(), rules=srcTulaWords();
 srcTulaClauses(text).forEach(function(c){
  var chunk=low.slice(c.s,c.e), seen={};
  rules.forEach(function(rule){
   /* A short word cannot steal the tail of an emotion idiom. */
   if(rule.word==='down'&&/\b(?:calmed?|settled|cooled)\s+down\b/i.test(chunk))return;
   var w=rule.word,rg=new RegExp('(^|[^a-z])('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/-/g,'[- ]')+')(?=$|[^a-z])','g'),m;
   while((m=rg.exec(chunk))!==null){
    var start=c.s+m.index+m[1].length,end=start+m[2].length;
    if(Object.keys(seen).some(function(k){return start>=+k&&start<seen[k];}))continue;
    var prefix=chunk.slice(0,start-c.s), around=chunk.slice(Math.max(0,start-c.s-75),start-c.s);
    var neg=SRC_TULA_NEG.test(around.split(/\b(?:but|however|although)\b/).pop().split(',').pop());
    var hyp=SRC_TULA_HYP.test(chunk)||SRC_TULA_FUTURE.test(chunk);
    var role=srcTulaRole(chunk,w,start-c.s);
    out.push({turn:turn,span:[start,end],text:text.slice(start,end),family:rule.family,
     tulaRank:rule.tulaRank,page:rule.page,matchKind:rule.matchKind,subject:role,
     negated:neg,hypothetical:hyp,affirmed:!neg&&!hyp&&role!=='causative_other',
     status:rule.matchKind==='EXACT_TULA'?'SOURCE_WORD':'PROVISIONAL_SYNONYM'});
    seen[start]=end;rg.lastIndex=Math.max(rg.lastIndex,start-c.s+m[2].length);
   }
  });
 });
 return out.sort(function(a,b){return a.turn-b.turn||a.span[0]-b.span[0];});
}
function srcVoiceChargeCycle(turns,opts){
 var o=opts||{}, rows=(Array.isArray(turns)?turns:[turns]).slice(-16)
   .map(function(t){return typeof t==='string'?{text:t,final:true,role:'user'}:t||{};})
   .filter(function(t){return t.final!==false&&t.role!=='assistant'&&typeof t.text==='string';});
 var obs=[],channels=[],texts=rows.map(function(r){return String(r.text||'').slice(0,5000);});
 texts.forEach(function(t,i){
  obs=obs.concat(srcTulaObservations(t,i));
  Object.keys(SRC_TULA_CHANNELS).forEach(function(k){if(SRC_TULA_CHANNELS[k].test(t))channels.push({turn:i,channel:k});});
 });
 var text=texts.join(' '),active=obs.filter(function(x){return x.affirmed&&x.subject!=='causative_other';});
 var self=active.filter(function(x){return x.subject==='self';});
 var now=texts.length?texts[texts.length-1]:'';
 var corrected=SRC_TULA_RETRACT.test(now)&&texts.length>1;
 if(corrected){
  /* A later explicit denial retracts a previous episode candidate; new
     positive emotions in the correction are not silently deleted. */
  var changed=now.toLowerCase();
  if(/\b(?:wasn't|wasn’t|was not|never|not)\s+(?:really\s+)?angry\b/i.test(now))
   self=self.filter(function(x){return x.family!=='Anger';});
 }
 var familyNames=[];self.forEach(function(x){if(familyNames.indexOf(x.family)<0)familyNames.push(x.family);});
 var after=SRC_TULA_AFTER.test(text),down=SRC_TULA_DOWN.test(text),up=SRC_TULA_UP.test(text);
 var continuing=SRC_TULA_CONTINUE.test(text),stable=SRC_TULA_STABLE.test(text);
 var choice=SRC_TULA_CHOICE.test(text),futuristic=SRC_TULA_FUTURE.test(text),shameAfter=after&&SRC_TULA_AFTER_SHAME.test(text);
 var orderedAnger=self.filter(function(x){return x.family==='Anger'&&x.tulaRank!==null});
 var rankedRise=orderedAnger.length>=2&&orderedAnger[orderedAnger.length-1].tulaRank>orderedAnger[0].tulaRank&&after;
 var phase='UNKNOWN', direction='UNKNOWN';
 if(corrected)phase='CORRECTED';
 else if(futuristic&&!self.length)phase='FUTURE_PROJECTION';
 else if(stable){phase='STABLE';direction='STABLE';}
 else if(rankedRise)phase='BUILDING';
 else if(after&&(down||continuing||up||shameAfter||self.length>=2))phase='PAST_REFLECTION';
 else if(choice)phase='PEAK_OR_CHOICE';
 else if(familyNames.length>1)phase='MIXED';
 if(up||rankedRise)direction='INCREASING';
 else if(down&&self.length)direction='DECREASING';
 else if(continuing)direction='CONTINUING';
 if(corrected)direction='UNKNOWN';
 var episodeFamily=null;
 if(familyNames.length===1)episodeFamily=familyNames[0];
 else if(familyNames.length===2&&shameAfter&&familyNames.indexOf('Anger')>=0&&familyNames.indexOf('Shame')>=0)episodeFamily='Anger';
 /* An explicit self report can replace previous observations; do not pretend
    all family members have a shared behavior or that family traits are inherited. */
 var people=active.filter(function(x){return x.subject!=='self'}).map(function(x){return x.subject;});
 var familyToSelf=/\bi\s+(?:recognize|recognise|see|notice)\s+(?:some\s+)?(?:of\s+)?(?:(?:their|those|these)\s+)?patterns\s+in\s+myself\b/i.test(text);
 var familyToSelfDenied=/\bi\s+(?:(?:do\s+not|don't|don’t)\s+)?(?:see|notice|recognize|recognise)\s+(?:those|their|these)\s+patterns\s+in\s+myself\b/i.test(now)&&/\b(?:don't|don’t|do not)\b/i.test(now);
 var subject=episodeFamily?'self':people.length>1?'family':people.length===1?people[0]:'self';
 if(people.length&&!self.length&&people.every(function(x){return x===people[0];})){
  subject=people[0]==='he'||people[0]==='she'?'third_party':people[0];
  if(people.length===1)episodeFamily=active[0].family;
 }
 if(familyToSelf&&!familyToSelfDenied)subject='family_to_self';
 if(familyToSelfDenied)subject='self';
 if(!self.length&&active.length===0&&texts.some(function(x){return SRC_TULA_HYP.test(x);}))subject='hypothetical';
 if(/\b(?:he|she|they)\s+said\b/i.test(text)&&/["“”]/.test(text))subject='quoted_other';
 if(active.length===1&&active[0].subject==='third_party')episodeFamily=active[0].family;
 /* A self-report of a single explicit TULA word has a lexical rank, but
    multiple mentions, contradictory/ambiguous terms or story escalation do not. */
 var rank=null;
 if(episodeFamily&&self.length===1&&self[0].family===episodeFamily&&self[0].tulaRank!=null)rank=self[0].tulaRank;
 if(episodeFamily&&self.length===0&&active.length===1&&active[0].tulaRank!=null)rank=active[0].tulaRank;
 if(/\bhorrified\b/i.test(text)||/\bupset\b/i.test(text)&&familyNames.length===1) { if(episodeFamily==='Fear'||episodeFamily==='Disgust'||episodeFamily==='Anger') {if(!self.some(function(x){return x.text.toLowerCase()!== 'horrified'&&x.text.toLowerCase()!=='upset';}))episodeFamily=null;rank=null;} }
 if(familyNames.length>1&&!shameAfter){episodeFamily=null;rank=null;}
 if(phase==='PAST_REFLECTION')rank=null;
 if(!self.length&&active.length===1&&active[0].subject==='self')episodeFamily=null;
 if(corrected){episodeFamily=null;rank=null;}
 var events=[];
 if(up||rankedRise)events.push({type:'BUILD',evidence:up?'explicit intensification':'ordered ranked terms'});
 if(choice)events.push({type:'CHOICE',evidence:'explicit decision language'});
 if(after||down)events.push({type:'AFTERMATH',evidence:down?'explicit calming language':'temporal narration'});
 return {version:'0.2-draft',status:text.trim()?'READ':'UNREAD',engine:'MOB/srcVoiceChargeCycle',
  source:'TULA pages 3-9 and 15-21; user-reported language only',
  family:episodeFamily,subject:subject,phase:phase,chargeDirection:direction,tulaRank:rank,
  observations:obs.slice(-32),channels:channels.slice(-24),events:events,
  curvePosition:'NOT_MEASURED',chakraElement:'DESIGN_PENDING_CANONICAL_MAPPING',
  graph:'NOT_QUERIED_BY_THIS_READER',ancestry:'NOT_ESTABLISHED',coherence:'NOT_MEASURED',
  automaticQuestions:false,canWriteProfile:false,
  policy:'A spoken adjective does not establish a diagnosis, inherited cause, calibrated intensity, or a fetter.'};
}
if(typeof module!=='undefined'&&module.exports)module.exports={srcVoiceChargeCycle:srcVoiceChargeCycle,SRC_TULA_LADDERS:SRC_TULA_LADDERS};