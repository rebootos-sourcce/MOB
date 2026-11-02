'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const E=require(path.resolve(process.env.ENGINE||'engine.js'));
const N=E.srcVoiceNarrative;
assert.equal(typeof N,'function','manifest and export must include narrative reader');
const story=['I never felt welcome in my family.','My sister is indignant. My mom is avoidant. My dad is angry.','Now I see their patterns in myself.'];
const a=N(story);
assert.equal(a.status,'READ');
assert.equal(a.familyToSelf,'FAMILY_TO_SELF_CANDIDATE');
assert.ok(a.observations.some(x=>x.role==='sister'&&x.term==='indignant'));
assert.ok(a.observations.some(x=>x.role==='mom'&&x.term==='avoidant'));
assert.ok(a.observations.some(x=>x.role==='dad'&&x.term==='angry'));
assert.equal(a.ancestralCausation,'NOT_ESTABLISHED');
assert.equal(a.measuredCQ,'NOT_MEASURED');
assert.equal(a.whichPatternIsInSelf,'UNKNOWN_UNLESS_EXPLICITLY_NAMED');
assert.equal(N(['My mother was avoidant']).familyToSelf,'NOT_REPORTED');
assert.equal(N(['My mother was avoidant','I see their patterns in myself']).familyToSelf,'FAMILY_TO_SELF_CANDIDATE');
assert.equal(N(['My sister is indignant','I do not see those patterns in myself']).familyToSelf,'REJECTED_BY_SPEAKER');
assert.equal(N(['My sister is indignant','I see their patterns in myself','Actually I do not see those patterns in myself']).familyToSelf,'REJECTED_BY_SPEAKER');
assert.equal(N(['My sister is indignant','I do not see those patterns in myself','Actually I see their patterns in myself']).familyToSelf,'FAMILY_TO_SELF_CANDIDATE');
const falseHistory=N(['My mother is angry. My grandfather is avoidant.']);
assert.equal(falseHistory.multiGeneration,'NOT_ESTABLISHED');
const similar=N(['My mother was angry.','My grandfather was angry.']);
assert.equal(similar.multiGeneration,'MULTIGENERATIONAL_SIMILARITY_REPORTED');
assert.equal(similar.ancestralCausation,'NOT_ESTABLISHED');
const neg=N(['My mother is not avoidant. My sister never was indignant.','I see their patterns in myself']);
assert.ok(neg.observations.filter(x=>x.negated).length>=2);
assert.equal(neg.familyToSelf,'SELF_RESEMBLANCE_UNSPECIFIED');
const hyp=N(['Imagine my mom was angry and my sister indignant','I see their patterns in myself']);
assert.equal(hyp.ancestralCausation,'NOT_ESTABLISHED');
assert.equal(JSON.stringify(a).includes('DO_NOT_DISCLOSE'),false);

assert.equal(N(['My mother is angry.','I do not know whether I see their patterns in myself.']).familyToSelf,'NOT_REPORTED');
assert.equal(N(['My mother is angry.','Maybe I see their patterns in myself.']).familyToSelf,'NOT_REPORTED');
assert.equal(N(['Imagine my mother is angry and I see their patterns in myself.']).familyToSelf,'NOT_REPORTED');
assert.equal(N(['Hypothetically my mother was angry','My grandmother was angry']).multiGeneration,'NOT_ESTABLISHED');

// A07: clause and actor attribution must not promote a speaker's description
// to their relative; uncertainty and corrections are scoped to their sentence.
const boundary1=N(['My mother told me I was angry.']);
assert.equal(boundary1.observations.some(x=>x.role==='mother'&&x.term==='angry'),false);
const boundary2=N(['My mother called me, but I was angry.']);
assert.equal(boundary2.observations.some(x=>x.role==='mother'&&x.term==='angry'),false);
assert.equal(N(['My mother was angry, but I felt hurt']).observations.some(
 x=>x.role==='mother'&&x.term==='angry'),true);
const splitHyp=N(['My mother was angry. Maybe my grandmother was angry.']);
assert.equal(splitHyp.observations.some(
 x=>x.role==='mother'&&x.term==='angry'&&!x.hypothetical),true);
assert.equal(splitHyp.observations.some(
 x=>x.role==='grandmother'&&x.term==='angry'&&x.hypothetical),true);
assert.equal(N(['My mother was angry. Maybe my father was angry. I see their patterns in myself'])
 .familyToSelf,'FAMILY_TO_SELF_CANDIDATE');
assert.equal(N(['My mother was angry. Maybe I see their patterns in myself'])
 .familyToSelf,'NOT_REPORTED');
assert.equal(N(['My mother was angry. I see their patterns in myself. I do not see those patterns in myself.'])
 .familyToSelf,'REJECTED_BY_SPEAKER');
assert.equal(N(['My mother was angry. I do not see those patterns in myself. I see their patterns in myself.'])
 .familyToSelf,'FAMILY_TO_SELF_CANDIDATE');


// A07 recurring reversals: final explicit, non-hypothetical statement wins.
assert.equal(N(['My mother was angry. I see their patterns in myself. I do not see those patterns in myself. I see their patterns in myself.']).familyToSelf,'FAMILY_TO_SELF_CANDIDATE');
assert.equal(N(['My mother was angry. I do not see those patterns in myself. I see their patterns in myself. I do not see those patterns in myself.']).familyToSelf,'REJECTED_BY_SPEAKER');
assert.equal(N(['My mother was angry. I see their patterns in myself. Maybe I do not see those patterns in myself.']).familyToSelf,'FAMILY_TO_SELF_CANDIDATE');
assert.equal(N(['My mother was angry. Maybe I see their patterns in myself. I do not see those patterns in myself.']).familyToSelf,'REJECTED_BY_SPEAKER');
assert.equal(N(['My mother was angry. Imagine I see their patterns in myself.']).familyToSelf,'NOT_REPORTED');
assert.equal(N(['My mother was angry. I do not see those patterns in myself.','I see their patterns in myself.']).familyToSelf,'FAMILY_TO_SELF_CANDIDATE');

console.log('SOURCE narrative attribution/ancestral humility contract PASS');
