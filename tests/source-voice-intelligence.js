'use strict';
/* REVIVED 17 NOVEMBER from the closed voice prototype (PR 163, rejected 8
 * November; its last commit is aa449a80 on origin/source-voice-prototype).
 * NOT YET REVIEWED BY HIM. On 17 November he said:
 * "Revive it and put a note next to it for when we review it. I don't quite know
 * what it's doing anymore, the 96 pattern, but let's add it."
 * The open questions for that review are in DECISIONS.md, under "The voice
 * prototype's read only layer, revived, 17 November".
 *
 * WHAT IT DOES. It holds the intelligence contract: the sniffer read, the
 * consent gated record graph, the narrative, the canon lookups and the
 * pattern library, with nothing about the record leaking out and a safety
 * stopped entry read as nothing, against the built engine.js. Run it with
 * node after ./atuned_src/BUILD-engine.sh.
 *
 * WHERE ITS OUTPUT GOES. Its exit code. Passing means the revived layer still
 * reads and still writes nothing, not that he has reviewed what it is for.
 */
/* Source voice, record graph, and intelligence integration contract.
 * This is a new test in the existing engine with the actual canonical data. */
const assert=require('node:assert/strict');
const path=require('node:path');
const E=require(path.resolve(process.env.ENGINE||'engine.js'));
const user=E.blankProfile('DO_NOT_DISCLOSE_NAME');
user.id='DO_NOT_DISCLOSE_ID';
assert.equal(typeof E.srcVoiceGraph,'function');
assert.equal(typeof E.srcVoiceIntelligence,'function');
const none=E.srcVoiceGraph('I felt afraid.',null,{allowProfile:true});
assert.equal(none.graph.status,'NO_RECORD');
const hidden=E.srcVoiceGraph('I felt afraid.',user,{allowProfile:false});
assert.equal(hidden.graph.status,'CONSENT_REQUIRED');
assert.equal(hidden.graph.matched.length,0);
const prior=JSON.stringify(user);
const graph=E.srcVoiceGraph('I felt afraid.',user,{allowProfile:true});
assert.ok(['READ','PARTIAL'].includes(graph.graph.status),'read reports conflict instead of hiding refused canon links');
assert.equal(graph.graph.engine,'MOB/traceFromRecord');
assert.ok(Array.isArray(graph.graph.structures),'graph exposes only anonymized structural coverage');
assert.equal(graph.graph.structures.some(x=>x.type==='pattern'),true);
assert.equal(JSON.stringify(user),prior,'read-only graph must not mutate record');
const first=E.srcVoiceIntelligence('My mother always hid her feelings.',user,{allowProfile:true});
const second=E.srcVoiceIntelligence('My mother always hid her feelings.',user,{allowProfile:true});
assert.deepEqual(first,second,'deterministic for the same record');
assert.equal(first.intelligence.status,'READ');
assert.equal(first.intelligence.coherence,'NOT_MEASURED');
assert.equal(first.intelligence.ancestry,'NOT_ASSESSED');
assert.ok(['READ','PARTIAL'].includes(first.intelligence.graphStatus));
assert.ok(Array.isArray(first.intelligence.evidence));
assert.ok(Array.isArray(first.intelligence.graphMatches));
assert.equal(JSON.stringify(first).includes(user.name),false,'do not leak record name');
assert.equal(JSON.stringify(first).includes(user.id),false,'do not leak record id');
const noCon=E.srcVoiceIntelligence('I feel sad.',user,{allowProfile:false});
assert.equal(noCon.intelligence.graphStatus,'CONSENT_REQUIRED');
assert.equal(noCon.intelligence.coherence,'NOT_MEASURED');
assert.ok(!JSON.stringify(noCon).includes(user.name));
const neg=E.srcVoiceIntelligence('I was not angry.',user,{allowProfile:true});
assert.equal(neg.voice.axes.some(x=>x.axis==='Anger'&&x.shadow>0),false);
const inventory=E.srcVoiceCanon('all','');
assert.equal(inventory.status,'INDEX');
assert.equal(inventory.inventory.find(x=>x.kind==='address').count,E.NODES.length);
assert.equal(inventory.inventory.find(x=>x.kind==='saboteur').count,E.SAB33.length);
/* The registries are named, not counted: a hand typed length is the failure
 * this repository's counts rule names, and it fell over here once already
 * (a ternary that expected 11 or 9). Each kind must be present once. */
const kinds=inventory.inventory.map(x=>x.kind);
['address','saboteur','axis','law','expression','archetype','domain','mask','chakra','pattern','researchanchor']
 .forEach(k=>assert.ok(kinds.includes(k),'registry '+k+' is in the index'));
assert.equal(new Set(kinds).size,kinds.length,'each registry is listed once');
assert.equal(inventory.inventory.find(x=>x.kind==='law').count,E.SI.length);
assert.equal(inventory.inventory.find(x=>x.kind==='expression').count,E.EXPR.length);
assert.equal(inventory.inventory.find(x=>x.kind==='archetype').count,E.ARCH.length);
assert.equal(inventory.inventory.find(x=>x.kind==='mask').count,E.MASKS.length);
assert.equal(inventory.inventory.find(x=>x.kind==='chakra').count,E.BANDS.length);
assert.equal(inventory.inventory.find(x=>x.kind==='pattern').count,E.PATTERN96.length);
assert.equal(inventory.inventory.find(x=>x.kind==='researchanchor').count,E.RESEARCHANCHOR.length);
assert.equal(E.srcVoiceCanon('law','truth').status,'READ');
assert.equal(E.srcVoiceCanon('expression','compassion').status,'UNREAD');
assert.equal(E.srcVoiceCanon('address','fear',3).status,'READ');
assert.equal(E.srcVoiceCanon('saboteur','absolutely-not-a-pattern').status,'UNREAD');

/* the 96-pattern content library, PORTED 2026-11-01: 32 ancestral, 32
 * generational, 32 parental, each with its own alternative explanations
 * and research anchors, never a diagnosis or a measured CQ. The library is a
 * fixed ported package, so its shape is pinned here on purpose, as the check
 * that the port arrived whole. The day the owner replaces it, extends it or
 * folds ancestral into generational (his 8 November ruling), these lines
 * change with it. */
assert.equal(E.PATTERN96.length,96);
assert.equal(E.PATTERN96.filter(p=>p.layer==='ancestral').length,32);
assert.equal(E.PATTERN96.filter(p=>p.layer==='generational').length,32);
assert.equal(E.PATTERN96.filter(p=>p.layer==='parental').length,32);
assert.ok(E.PATTERN96.every(p=>p.scientificStatus==='evidence_informed_design_category_not_validated_diagnostic_construct'),
 'every pattern record states its own non diagnostic status');
const patternHit=E.srcVoiceCanon('pattern','emotional distance');
assert.equal(patternHit.status,'READ');
assert.equal(patternHit.records[0].record.id,'AP-01');
assert.equal(E.srcVoiceCanon('pattern','absolutely-not-a-real-pattern').status,'UNREAD');
assert.equal(typeof E.srcVoicePattern,'function');
const ap01=E.srcVoicePattern('ap-01');
assert.equal(ap01.status,'READ');
assert.equal(ap01.record.name,'Emotional distance');
assert.ok(ap01.anchors.length>0,'every research anchor id on a pattern resolves');
assert.ok(ap01.anchors.every(a=>a.unresolved!==true),'no dangling research anchor id on AP-01');
assert.equal(E.srcVoicePattern('not-a-real-id').status,'UNREAD');
E.PATTERN96.forEach(function(p){
 p.researchAnchorIds.forEach(function(aid){
  assert.ok(E.RESEARCHANCHOR.some(a=>a.id===aid),'dangling research anchor id '+aid+' on '+p.id);
 });
});

const story=E.srcVoiceIntelligence('Now I see their patterns in myself.',user,{allowProfile:false,
  turns:['My sister was indignant, my mother avoidant and my father angry.']});
assert.equal(story.intelligence.narrative.familyToSelf,'FAMILY_TO_SELF_CANDIDATE');
assert.equal(story.intelligence.narrative.ancestralCausation,'NOT_ESTABLISHED');
assert.equal(story.intelligence.graphStatus,'CONSENT_REQUIRED');
assert.ok(story.intelligence.claims.every(x=>Number.isInteger(x.evidenceCount)&&x.evidenceCount>=0));
/* An entry the safety stop holds (engine/safe.js, srcSafe) is heard as nothing
 * everywhere else in the engine, so it is read as nothing here: no sniffer
 * hit, no evidence, no narrative, no cycle, and no packet for the bus to
 * carry. Found on the trial port: before this guard the same entry read as
 * READ and reached nine bus packets, ritual and release targets among them. */
const crisis='I want to kill myself and I am so angry at my mother.';
assert.equal(E.srcSafe(crisis),true,'the probe entry is one the safety stop holds');
const stopped=E.srcVoiceIntelligence(crisis,user,{allowProfile:true,turns:['My mother was avoidant and my father angry.']});
assert.equal(stopped.voice.status,'UNREAD');
assert.equal(stopped.voice.hits.length,0);
assert.equal(stopped.intelligence.status,'UNREAD');
assert.equal(stopped.intelligence.safe,true);
assert.equal(stopped.intelligence.evidence.length,0);
assert.equal(stopped.intelligence.narrative,null);
assert.equal(stopped.intelligence.emotionCycle,null);
const stoppedBus=E.srcVoiceEvidenceBus(stopped,{allowSessionShare:true});
assert.equal(stoppedBus.status,'UNREAD');
assert.equal(stoppedBus.packets.length,0,'a stopped entry reaches no packet');
assert.equal(stoppedBus.evidenceRefs.length,0);
/* and the same words without the stop phrase still read, so the guard is a
 * stop and not a blanket refusal of family talk */
const family=E.srcVoiceIntelligence('I am so angry at my mother.',user,{allowProfile:false});
assert.equal(family.intelligence.status,'READ');
assert.ok(family.intelligence.evidence.length>0);
assert.equal(family.intelligence.safe,undefined);
console.log('Source voice -> Sniffer -> record graph -> intelligence contract PASS');
