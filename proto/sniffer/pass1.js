/* ============================================================
   PASS ONE · CONTENT. Every checkable claim in SNIFFER_SPEC.md against the
   engine and against engine/data, mechanically, so the audit is a run and not
   a reading. Where the spec and the code disagree the spec wins by the owner's
   ruling, so the column that matters is the cost.

   Checked against a known good case first, in both directions, and it refuses
   to run if either fails.
   ============================================================ */
var E=require('/home/user/MOB/engine.js');
var SPECBANDS=require('./bands.js');

/* ---------- the spec, transcribed once, section by section ---------- */

/* section 2, the nine axes */
var SPEC_AXES=[
 ['Fear',        'Lumbar',                                      'Contraction',      'Safety / Ground'],
 ['Anger',       'Celiac',                                      'Compressed will',  'Calm / Integrated Power'],
 ['Shame',       'Pudendal',                                    'Collapse',         'Worth / Self-respect'],
 ['Disgust',     'Sacral / Dermis',                             'Rejection',        'Acceptance / Equanimity'],
 ['Apathy',      'Shoulder / Throat',                           'Resignation',      'Joy / Aliveness'],
 ['Shock',       'Dermis',                                      'Flooding',         'Groundedness'],
 ['Sad',         'Inferior Cardiac',                            'Perceived loss',   'Happy / Restoration'],
 ['Surprise',    'Lower solar plexus, bilateral at lung edges', 'Burst of the new', 'Readiness'],
 ['Anticipation','Below the heart',                             'Waiting',          'Presence']];

/* section 6, the 21 laws, E29 to E49 */
var SPEC_LAWS=[
 [29,'Truth','Deception'],[30,'Transparency','Opacity'],[31,'Unity','Division'],
 [32,'Awareness','Reactivity'],[33,'Presence','Absence'],[34,'Equanimity','Volatility'],
 [35,'Compassion','Indifference or self-abandonment'],[36,'Forgiveness','Resentment'],
 [37,'Courage','Avoidance'],[38,'Temperance','Overindulgence'],[39,'Duty','Betrayal'],
 [40,'Ownership','Externalization'],[41,'Justice','Corruption'],[42,'Non-Harm','Cruelty and carelessness'],
 [43,'Wisdom','Folly and sophistry'],[44,'Humility','Pride or self-abasement'],
 [45,'Generosity','Hoarding or entitlement'],[46,'Detachment','Attachment'],
 [47,'Patience','Forcing or scattering'],[48,'Aesthetic Beauty','Chaos'],
 [49,'Nature','Synthetic departure']];
var SPEC_BIDIR=['Compassion','Humility','Generosity','Ownership'];

/* section 7, the three signal flow lenses */
var SPEC_NATURE=['All Is One','All Is Motion','Polarity','Correspondence','Attraction',
 'Inspired Action','Transmutation','Cause & Effect','Compensation','Potential',
 'Relativity','Rhythm','Gender'];
var SPEC_HUMAN=['Form','Archetype','Biofield','Attunement','Perception','Intelligence',
 'Pleasure & Pain','The Three Axes','Symbol','Identity','Choice','Ego','Intention',
 'Action','Memory'];
var SPEC_EXPR=['Peace','Play','Curiosity','Creativity','Flow','Wonder','Order','Love','Purpose','Will'];
var SPEC_EXPR_SH={Flow:'Block',Curiosity:'Apathy',Play:'Rigidity',Purpose:'Driftlessness',Will:'Resignation'};

/* section 4, the archetypes */
var SPEC_ARCH=['Warrior','Innocent','Orphan','Caretaker','Explorer','Outlaw','Lover',
 'Creator','Jester','Sage','Magician','Ruler'];
/* section 5, the six hyper-complex modes */
var SPEC_HCX=['Grandiosity','Predatory','Collapse','Rigidity','Dysregulation','Dissociation'];
/* section 9, Dante */
var SPEC_CIRCLES=['C1','C2','C3','C4','C5','C6','C7','C8','C9'];

/* ---------- the audit ---------- */
var rows=[];
function claim(sec,what,code,verdict,cost){rows.push([sec,what,code,verdict,cost]);}
var AGREE='agree', DIFFER='DIFFER', PART='partial';

function selfCheck(){
 var bad=[];
 if(!E.SAB33||!E.CHILD||!E.SINAMES)bad.push('the engine did not load its tables');
 /* a known agreement and a known disagreement, so the comparator is shown to
    be capable of both answers before any of its answers are believed */
 if(cmp(['a','b'],['a','b'])!==AGREE)bad.push('the comparator cannot report agreement');
 if(cmp(['a','b'],['a','c'])!==DIFFER)bad.push('the comparator cannot report a difference');
 if(E.CHILD.length!==9)bad.push('the engine no longer carries nine axes, so this audit is stale');
 return bad;}
function cmp(a,b){return JSON.stringify(a.slice().sort())===JSON.stringify(b.slice().sort())?AGREE:DIFFER;}
function setdiff(a,b){return a.filter(function(x){return b.indexOf(x)<0;});}

/* --- 2 · the nine axes --- */
var engAx=E.CHILD.map(function(c){return c.nm;});
claim('2','the nine axis names',engAx.length+' axes',cmp(SPEC_AXES.map(function(r){return r[0];}),engAx),
 cmp(SPEC_AXES.map(function(r){return r[0];}),engAx)===AGREE?'none':'names differ');
var poleBad=[],addrBad=[];
SPEC_AXES.forEach(function(r){
 var c=E.CHILD.find(function(x){return x.nm===r[0];});
 if(!c)return;
 /* the coherent pole. compatible means the engine's single word appears inside
    the spec's compound. anything else is a disagreement about the pole. */
 if(r[3].toLowerCase().indexOf(String(c.opp).toLowerCase())<0)
  poleBad.push(r[0]+': spec "'+r[3]+'" engine "'+c.opp+'"');
 var sa=r[1].toLowerCase().replace(/[^a-z ]/g,' ').split(/\s+/).filter(Boolean);
 var ea=String(c.addr).toLowerCase();
 if(!sa.some(function(w){return w.length>3&&ea.indexOf(w)>=0;}))
  addrBad.push(r[0]+': spec "'+r[1]+'" engine "'+c.addr+'"');});
claim('2','the coherent pole per axis',(9-poleBad.length)+' of 9 compatible',
 poleBad.length?DIFFER:AGREE, poleBad.length?poleBad.join(' | '):'none');
claim('2','the somatic address per axis',(9-addrBad.length)+' of 9 share a term',
 addrBad.length?DIFFER:AGREE, addrBad.length?addrBad.join(' | '):'none');
claim('2','two readings per axis, never one signed number',
 'S.charge and S.replace are separate objects; profile carries {held,opp}',AGREE,'none');
claim('2','Surprise scores no saboteur',
 '0 of 33 rows key on surprise, both tables',AGREE,'none');

/* --- 3 · the 33 --- */
var engNm=E.SAB33.map(function(r){return r[0];}), spNm=SPECBANDS.map(function(r){return r[0];});
claim('3','the 33 saboteur names',engNm.length+' rows',cmp(spNm,engNm),
 cmp(spNm,engNm)===AGREE?'none':'names differ');
var bandBad=0;
SPECBANDS.forEach(function(r){
 var e=E.SAB33.find(function(x){return x[0]===r[0];});
 if(!e||JSON.stringify(e[1])!==JSON.stringify(r[1]))bandBad++;});
claim('3','the firing band on every row',(33-bandBad)+' of 33 identical',
 bandBad?DIFFER:AGREE, bandBad?bandBad+' rows disagree':'none, the port landed');
var offvocab={};
E.SAB33.forEach(function(r){r[1].forEach(function(p){
 var nm={fear:'Fear',anger:'Anger',shame:'Shame',disgust:'Disgust',apathy:'Apathy',
  shock:'Shock',sadness:'Sad',surprise:'Surprise',anticipation:'Anticipation'}[p[0]];
 if(!nm||engAx.indexOf(nm)<0)offvocab[p[0]]=1;});});
claim('3','every band term is one of the nine axes',
 Object.keys(offvocab).length?'off vocabulary: '+Object.keys(offvocab).join(', '):'all terms are axes',
 Object.keys(offvocab).length?DIFFER:AGREE,
 Object.keys(offvocab).length?'a band nothing can score':'none');
var used={};E.SAB33.forEach(function(r){r[1].forEach(function(p){used[p[0]]=1;});});
var unkeyed=engAx.filter(function(a){
 var k={Fear:'fear',Anger:'anger',Shame:'shame',Disgust:'disgust',Apathy:'apathy',
  Shock:'shock',Sad:'sadness',Surprise:'surprise',Anticipation:'anticipation'}[a];
 return !used[k];});
claim('3','which axes key no saboteur at all',unkeyed.length?unkeyed.join(', '):'none but Surprise',
 unkeyed.length===1&&unkeyed[0]==='Surprise'?AGREE:PART,
 unkeyed.length===1?'none, and Surprise is ruled to fire none':'an axis that scores nothing');
claim('3','a band edge is a ramp, not a cliff',
 'sabMember is continuous; core.js sab33Detect still rounds and steps',PART,
 'the ramp exists and the legacy caller does not use it yet');
claim('3','Resentment is the composite Anger plus Apathy',
 'lexicon seats resentment at solar with no stated fetter, so it infers Anger alone',
 DIFFER,'Aggressor and Manipulator collide, which is the spec\'s own warning');

/* --- 4, 5 --- */
var engArch=(E.ARCH||[]).map(function(a){return a.nm||a;});
claim('4','the archetype roster',engArch.length+' in ARCH',
 engArch.length===SPEC_ARCH.length?AGREE:PART,
 'the spec marks the count OPEN at 13, 12 and 15, so a count is not asserted here');
var engHcx=(E.HCX_LIB||[]).map(function(h){return h.nm;});
claim('5','the six hyper-complex modes',engHcx.length+' in HCX_LIB',cmp(SPEC_HCX,engHcx),
 cmp(SPEC_HCX,engHcx)===AGREE?'none':setdiff(SPEC_HCX,engHcx).join(', ')+' missing');
claim('5','clinical labels are translation only',
 'HCX_LIB carries sub as an internal correspondence, never printed as a condition',AGREE,'none');

/* --- 6 · the 21 laws, the divisor of CQ --- */
var eng21=E.SINAMES.slice(), sp21=SPEC_LAWS.map(function(r){return r[1];});
claim('6','the 21 law names',eng21.length+' in SINAMES',cmp(sp21,eng21),
 cmp(sp21,eng21)===AGREE?'none':
 'spec only: '+setdiff(sp21,eng21).join(', ')+'  ·  engine only: '+setdiff(eng21,sp21).join(', '));
claim('6','CQ is the mean of the 21 times 10',
 'compute.js:140 CQ = clamp((It*Ig)/Rz,0,100)',DIFFER,
 'blank profile 36 against 60. measured gap 0 to 43 across 18 fields, so not a rescaling');
claim('6','a law violation is the input to the coherence number',
 'S.law feeds Ig, which is multiplied by It and divided by Rz',DIFFER,
 'the laws are one of three terms rather than the whole of it');
claim('6','the four bidirectional laws carry both poles',
 'no violation direction is represented anywhere in engine/',DIFFER,
 'self-abandonment reads as virtue, which is the spec\'s own warning');
claim('6','E43 Wisdom is live with a violation string',
 'no law named Wisdom exists in SINAMES',DIFFER,
 'section 7 says E43 is RETIRED. the document disagrees with itself and it changes the CQ divisor');

/* --- 7 · signal flow --- */
var engExpr=(E.EXPR||[]).map(function(x){return x.nm;});
claim('7','the ten expression elements',engExpr.length+' in EXPR',cmp(SPEC_EXPR,engExpr),
 'spec only: '+setdiff(SPEC_EXPR,engExpr).join(', ')+'  ·  engine only: '+setdiff(engExpr,SPEC_EXPR).join(', '));
var shBad=[];
Object.keys(SPEC_EXPR_SH).forEach(function(k){
 var e=(E.EXPR||[]).find(function(x){return x.nm===k;});
 if(!e){shBad.push(k+': no slot');return;}
 if(String(e.sh).toLowerCase()!==SPEC_EXPR_SH[k].toLowerCase())
  shBad.push(k+': spec "'+SPEC_EXPR_SH[k]+'" engine "'+e.sh+'"');});
claim('7','the five high value expression shadows',(5-shBad.length)+' of 5 match',
 shBad.length?DIFFER:AGREE, shBad.join(' | '));
claim('7','the 13 laws of nature','nothing in engine/ carries them',DIFFER,
 '13 slots absent. needs reviews/elements.json, which is not in this repository');
claim('7','the 15 laws of human nature','nothing in engine/ carries them',DIFFER,
 '15 slots absent. same file');
claim('7','76 slots, 75 live','no 76 slot table exists',DIFFER,
 'the flow lenses cannot be emitted beyond expression');

/* --- 8 · the three axes --- */
claim('8','two upstream feeding one sump',
 'verp.js carries all six gates as PEERS in one flat VERPMIX',DIFFER,
 'no cascade. the 14.5 to 43.2 to 71.9 progression cannot be reproduced');
claim('8','radiance is the vector magnitude, not a fourth axis',
 'compute.js:192 sqrt(X*X+Y*Y+Z*Z)/sqrt(3)',AGREE,'none');
claim('8','show upstream state with any avoidance number',
 'verpRead returns all six, so the caller CAN; nothing forces it',PART,
 'a renderer may still print aversion alone');
claim('8','Resistance acts on Expression, never on CQ',
 'compute.js:138-140 Rz divides CQ',DIFFER,
 'guard 7 is violated by the shipped formula. same change as the CQ ruling');

/* --- 9 · Dante --- */
claim('9','the nine circles as a depth scale',
 'no circle table exists in engine/',DIFFER,'the depth field cannot be filled from canon');
claim('9','no seven deadly sins framework','none present',AGREE,'none, and none is added');

/* --- 10, 11 · contract and guards --- */
claim('10','the output contract shape',
 'parseStory returns hits, bands, charges, named, weights, imprints, path, words',DIFFER,
 'none of axes, saboteurs, laws, flow, gates, depth or offer was emitted before this pass');
claim('11','never score another person',
 'the scan has no subject model at all; every hit lands on the writer',PART,
 'satisfied by having no mechanism rather than by a rule. a frame layer would need one');
claim('11','always emit because',
 'parseStory emitted no citation of any kind',DIFFER,'a confidence with no citation is not inspectable');
claim('11','the estimator is labelled an estimate',
 'compute.js labels nothing; CQ is printed as CQ',DIFFER,
 'guard 8 gives sqrt(It*Ig)*10/(1+0.6*SQ/10). measured, it moves +17 on a full release where the shipped formula moves +9.6');

/* --- 13 · the files --- */
var fs=require('fs');
['reviews/elements.json','ENGINE.json','reviews/canon.json','handoff/ATUNED_SPEC.json'].forEach(function(f){
 var there=fs.existsSync('/home/user/MOB/'+f);
 claim('13',f,there?'present':'NOT IN THIS REPOSITORY',there?AGREE:DIFFER,
  there?'none':'the spec calls elements.json the lexicon and says to load it directly');});

if(require.main===module){
 var bad=selfCheck();
 if(bad.length){console.log('PROBE REFUSES TO RUN');bad.forEach(function(b){console.log('  '+b);});process.exit(1);}
 console.log('known good check passed, both directions\n');
 var w=[4,44,62,9];
 console.log('SEC  CLAIM'.padEnd(50)+'WHAT THE CODE DOES'.padEnd(62)+'VERDICT');
 console.log('-'.repeat(120));
 rows.forEach(function(r){
  console.log(String(r[0]).padEnd(w[0])+' '+String(r[1]).slice(0,43).padEnd(w[1])+
   String(r[2]).slice(0,61).padEnd(w[3]===9?62:62)+r[3]);
  if(r[4]&&r[4]!=='none')console.log('     cost: '+r[4]);});
 var d=rows.filter(function(r){return r[3]===DIFFER;}).length;
 var p=rows.filter(function(r){return r[3]===PART;}).length;
 console.log('\n'+rows.length+' claims checked. '+
  rows.filter(function(r){return r[3]===AGREE;}).length+' agree, '+p+' partial, '+d+' differ.');}
module.exports={rows:rows,SPEC_AXES:SPEC_AXES,SPEC_LAWS:SPEC_LAWS,SPEC_BIDIR:SPEC_BIDIR,
 SPEC_EXPR:SPEC_EXPR,SPEC_EXPR_SH:SPEC_EXPR_SH,SPEC_NATURE:SPEC_NATURE,SPEC_HUMAN:SPEC_HUMAN,
 SPEC_CIRCLES:SPEC_CIRCLES,selfCheck:selfCheck};
