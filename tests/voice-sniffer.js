'use strict';
/* REVIVED 17 NOVEMBER from the closed voice prototype (PR 163, rejected 8
 * November; its last commit is aa449a80 on origin/source-voice-prototype).
 * NOT YET REVIEWED BY HIM. On 17 November he said:
 * "Revive it and put a note next to it for when we review it. I don't quite know
 * what it's doing anymore, the 96 pattern, but let's add it."
 * The open questions for that review are in DECISIONS.md, under "The voice
 * prototype's read only layer, revived, 17 November".
 *
 * WHAT IT DOES. It holds the sniffer adapter contract: it reads through the
 * engine's own sniffStory and srcHear and keeps negated words out, against
 * the built engine.js. Run it with node after ./atuned_src/BUILD-engine.sh.
 *
 * WHERE ITS OUTPUT GOES. Its exit code. Passing means the revived layer still
 * reads and still writes nothing, not that he has reviewed what it is for.
 */
const assert=require('node:assert/strict');
const path=require('node:path');
const E=require(path.resolve(process.env.ENGINE || 'engine.js'));
assert.equal(typeof E.sniffStory,'function');
assert.equal(typeof E.srcHear,'function');
assert.equal(typeof E.srcVoiceSniff,'function');
const empty=E.srcVoiceSniff('');
assert.equal(empty.status,'UNREAD');
assert.equal(empty.ancestry,undefined);
assert.equal(empty.inquiry.move,'listen');
for(const sentence of [
 'My mother died and I felt sad.',
 'I was not angry.',
 'He was furious but I was calm.',
 'I was angry and exhausted.',
 'My mother and grandmother both hid their feelings.'
]) {
 const a=E.srcVoiceSniff(sentence), b=E.srcVoiceSniff(sentence);
 assert.deepEqual(a,b,'sniff must be deterministic and read-only');
 assert.equal(a.engine,'MOB/sniffStory+srcHear');
 assert.equal(a.inquiry.move,'pass','no automatic question from adapter');
 assert.ok(['READ','UNREAD'].includes(a.status));
 assert.ok(Array.isArray(a.hits) && Array.isArray(a.denied) && Array.isArray(a.others));
 assert.ok(Array.isArray(a.seats) && Array.isArray(a.axes) && Array.isArray(a.laws));
 assert.equal(a.measurement.includes('UNVERIFIED'),true);
 assert.equal(a.ancestry.includes('NOT ASSESSED'),true);
}
const denied=E.srcVoiceSniff('I was not angry');
assert.equal(denied.axes.some(x=>x.axis==='Anger'&&x.shadow>0),false,'negation may not drive Anger shadow');
console.log('Source voice Sniffer adapter: read-only contract PASS');
