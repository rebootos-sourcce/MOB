/* ATUNED Purgatorio — host-free, observational reader.
 * Does not compute or alter CQ. The live engine owns CQ. No automatic terrace
 * assignment: a person may show multiple patterns, or none, at any CQ.
 * Events describe observed actions, not moral identities or diagnoses.
 */
'use strict';
function readPurgatorio(registry, coherence, events) {
  if (!registry || !Array.isArray(registry.records)) throw new TypeError('registry.records is required');
  if (!Number.isFinite(coherence) || coherence < 0 || coherence > 100)
    throw new RangeError('CQ must be a number from 0 to 100 supplied by the existing engine');
  var scope=registry.scope;
  var waist=coherence>=scope.minCQ && coherence<=scope.maxCQ;
  var terraces=registry.records.filter(function(r){return r.kind==='purgatorio_terrace';})
    .sort(function(a,b){return a.position-b.position;});
  var terrById={};
  terraces.forEach(function(t){terrById[t.id]=t;});
  var out={cq:coherence, waist:waist, waistRange:[scope.minCQ,scope.maxCQ],
    region:coherence<scope.minCQ?'below_waist':coherence>scope.maxCQ?'above_waist':'oscillating_waist',
    placement:'not_inferred',
    terraces:terraces.map(function(t){return {id:t.id, vice:t.polarity.viceName,
      capacity:t.polarity.virtueName, viceId:t.polarity.viceId,
      capacityId:t.polarity.virtueId, belief:t.belief, reframe:t.reframe,
      behaviorEvidence:{vice:0, capacity:0}, turns:0, lastPole:null};}),
    ignoredEvents:0, observedEvents:0};
  var byId={}; out.terraces.forEach(function(t){byId[t.id]=t;});
  /* Only events with explicit observer evidence and a dated, valid pole count.
     Unmeasured cases stay unknown, never auto-classified from a CQ number. */
  var seq=Array.isArray(events)?events:[];
  var valid=[];
  seq.forEach(function(e,i){
    var t=e&&terrById[e.terraceId];
    if(!t || !e || (e.poleId!==t.polarity.viceId && e.poleId!==t.polarity.virtueId) ||
       !e.observedAt || !Number.isFinite(Date.parse(e.observedAt)) ||
       !e.evidence || typeof e.evidence!=='string' || !e.evidence.trim()){
      out.ignoredEvents++;return;
    }
    valid.push({e:e,i:i,t:t});
  });
  valid.sort(function(a,b){return Date.parse(a.e.observedAt)-Date.parse(b.e.observedAt)||a.i-b.i;});
  valid.forEach(function(x){
    var t=byId[x.t.id], pole=x.e.poleId===x.t.polarity.viceId?'vice':'capacity';
    if(t.lastPole && t.lastPole!==pole)t.turns++;
    t.lastPole=pole;
    t.behaviorEvidence[pole]++;
    out.observedEvents++;
  });
  return out;
}
function purgatorioTerraceForRecord(registry, recordId){
  if(!registry || !Array.isArray(registry.records))return null;
  var r=registry.records.find(function(x){return x.id===recordId;});
  if(!r)return null;
  if(r.kind==='purgatorio_terrace')return r;
  if(r.terraceId)return registry.records.find(function(x){return x.id===r.terraceId;})||null;
  return null;
}
if(typeof module!=='undefined' && module.exports){module.exports={readPurgatorio,purgatorioTerraceForRecord};}