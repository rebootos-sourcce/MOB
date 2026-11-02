/* Real MOB engine -> Avatar Graph acceptance. Run only after BUILD-engine.sh.
 * It is an integration gate, not an alternative graph model.
 */
'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const E=require(path.resolve(__dirname,'../engine.js'));
let pass=0;function check(name,fn){fn();pass++;console.log('PASS avatar graph runtime:',name);}
const p=E.blankProfile('Graph acceptance fixture');p.id='avatar-graph-acceptance';
const v=E.validateProfile(JSON.parse(JSON.stringify(p)));
assert.ok(v.ok,'blank record must validate');
const rec=v.profile;
const blankRead=E.read(rec).reading;
const before=JSON.stringify(rec);
const query=(r=blankRead,s={kind:'seat',id:'Root'},z=rec)=>E.avatarGraphProject({
 authorized:true,profile:z,reading:r,selection:s,engine:E,limit:6});
check('bundled canonical graph API is exported',()=>{
 assert.equal(typeof E.avatarGraphProject,'function');
 assert.equal(typeof E.traceFromRecord,'function');
 assert.equal(blankRead.rec,rec.id);
});
check('unanswered blank record has no evidence',()=>{
 const x=query();assert.equal(x.graph.refused,0);
 assert.equal(x.evidence.confirmed,0);assert.equal(x.evidence.storyLinks,0);
 assert.equal(x.nodes.length,0);
 assert.equal(x.status,'no_evidence');
});
check('blank record remains unchanged',()=>{query();assert.equal(JSON.stringify(rec),before);});
check('cross profile stamp is rejected',()=>assert.equal(query({rec:'foreign'}).status,'reading_mismatch'));
check('profile-identifying data never appears',()=>{let x=query();assert.ok(!JSON.stringify(x).includes(rec.id));assert.ok(!JSON.stringify(x).includes(rec.name));});
const worked=E.blankProfile('Avatar graph worked');
worked.id='avatar-graph-worked';
E.CHILD.forEach(c=>worked.axes[c.nm]={held:7,opp:0});
worked.story.entries=[{t:'2026-10-01T00:00:00.000Z',
 text:'I feel ashamed and my chest is tight when I speak up at work.',
 imprints:3,bands:{},lex:E.LEX_VERSION}];
const w=E.validateProfile(JSON.parse(JSON.stringify(worked)));
assert.ok(w.ok,'worked record must validate');
const real=w.profile,rd=E.read(real).reading;
check('real reading is stamped to the record',()=>assert.equal(rd.rec,real.id));
const full=E.traceFromRecord(real,[],rd);
check('real graph validates without structural refusal',()=>assert.ok(!full.refused.some(x=>x.reading)));
const seats=Array.from(new Set(full.nodes.filter(n=>n.type==='pattern'&&n.seat).map(n=>n.seat)));
assert.ok(seats.length,'canonical graph has seated addresses');
const chosen=seats.map(seat=>({seat,view:query(rd,{kind:'seat',id:seat},real)}))
 .filter(x=>x.view.status==='ready'||x.view.status==='partial');
check('at least one real supported seat has evidence',()=>assert.ok(chosen.length>0));
check('real graph projection is bounded and uses canonical types',()=>{
 const x=chosen[0].view;assert.ok(x.nodes.length<=6);
 assert.ok(x.nodes.every(n=>E.TRACE_NODE_TYPES.includes(n.type)));
 assert.ok(x.edges.every(e=>E.TRACE_EDGE_TYPES.includes(e.relationship)&&e.relationship!=='causes'));
});
check('person has not confirmed an inference',()=>assert.equal(chosen[0].view.evidence.confirmed,0));
check('reading projection is deterministic',()=>{
 const y=query(rd,{kind:'seat',id:chosen[0].seat},real);
 assert.deepEqual(chosen[0].view,y);
});
console.log('AVATAR GRAPH REAL ENGINE '+pass+'/'+pass+' passed');
