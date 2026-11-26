/* ============================================================
   WHAT A CLIENT'S DEVICE SHARES, GATED. node tests/pracshare.js

   engine/pracshare.js builds the snapshot a client publishes to a
   practitioner (round PS, 26 November) and checks what crosses back. The
   ruling it holds: Summary only unless the client switched Body or Field
   on, no story and no name, ever. Headless, on the built engine.js.

   Checked against a known bad case at the foot: a field layer built by
   passing the loop read's rows through whole, which is the one way a story
   could leave, is refused by the same check that passes the real one.
   ============================================================ */
const E=require(require('path').resolve(process.env.ENGINE||'engine.js'));
const {S,CHARGES,SINAMES,W,PEOPLE,PRACTICE,compute,buildSoul}=E;
let P=0,F=0; const ok=(c,m)=>{if(c)P++;else{F++;console.log('  FAIL  '+m);}};
const keysDeep=(o,out=new Set())=>{if(o&&typeof o==='object'){for(const k of Object.keys(o)){out.add(k);keysDeep(o[k],out);}}return out;};

console.log('the snapshot a grant covers, and nothing it does not');
S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
CHARGES.forEach((c,i)=>{S.charge[c]=i%3?6:0;S.replace[c]=0;});
SINAMES.forEach(l=>{S.law[l]=6;E.LAW_UNSET[l]=false;});
const r=compute();
const sumOnly=E.pracShareBuild(r,{body:false,field:false},null,[],[]);
ok(Object.keys(sumOnly).join()==='sum','Summary alone when neither switch is on: '+Object.keys(sumOnly));
ok(E.pracShareCheck(sumOnly).length===0,'the Summary the engine builds passes its own boundary: '+E.pracShareCheck(sumOnly).join('; '));
ok(sumOnly.sum.loaded.every(a=>a.sq>=4),'Summary carries the addresses at or above the display line only');
ok(sumOnly.sum.loaded.length===W.filter(n=>n.sq>=4).length,'and every one of them');
const withBody=E.pracShareBuild(r,{body:true,field:false},null,[],[]);
ok(withBody.body&&withBody.body.addrs.length===Math.min(112,W.filter(n=>n.sq>0).length),'Body is every carrying address');
ok(!withBody.field,'Field stays out while its switch is off');
ok(E.pracShareCheck(withBody).length===0,'Body passes the boundary: '+E.pracShareCheck(withBody).join('; '));

console.log('the field layer, off a real loop read, copies named fields only');
const ex=PEOPLE.find(p=>p.nm==='Wren')||PEOPLE[0];
const R=E.pracexRead(ex,W.filter(n=>n.sq>0).slice(0,6).map(n=>n.i),new Date().toISOString());
ok(!!R&&!!R.loop,'a worked example builds a loop read to test against');
/* a loop row with extra keys, the shape a signal marker carries */
const L=JSON.parse(JSON.stringify(R.loop));
if(L.patterns[0])Object.assign(L.patterns[0],{source:{text:'what my father said'},chain:[1,2]});
L.entries=4; L.next={say:'a sentence'};
const f=E.pracShareField(L,R.days,[{steps:['box'],band:'Heart',on:null,tm:4,days:0,active:true,when:'before work',where:'the kitchen'}]);
const fk=keysDeep(f);
ok(!fk.has('source')&&!fk.has('chain')&&!fk.has('entries')&&!fk.has('next'),'a key the layer does not name never leaves: '+[...fk].join(','));
ok(!fk.has('when')&&!fk.has('where'),'a ritual\'s own when and where, typed by the person, stay on the device');
ok(!JSON.stringify(f).includes('father'),'no story words in the field layer');
ok(E.pracShareCheck({sum:sumOnly.sum,field:f}).length===0,'the real field layer passes: '+E.pracShareCheck({sum:sumOnly.sum,field:f}).join('; '));
ok(f.loop.confirmed===(R.loop.confirmed|0)&&f.days.length===R.days.length,'and carries the loop read\'s own counts and days');

console.log('the boundary refuses by name and never clamps');
const story=E.pracShareCheck({sum:Object.assign({},sumOnly.sum,{story:'x'})});
ok(story.some(e=>/sum\.story is not a field this takes/.test(e)),'an unknown key is refused by name: '+story);
const big=E.pracShareCheck({sum:Object.assign({},sumOnly.sum,{cq:1e9})});
ok(big.some(e=>/sum\.cq is outside/.test(e)),'out of range is refused, not clamped: '+big);
ok(E.pracShareCheck(null).length===1,'nothing at all is refused');

console.log('a proposed ritual, checked on the client before it is shown');
ok(E.pracPropCheck({steps:[PRACTICE[0].k],on:[0,2],tm:10,days:0,band:'Heart',why:'for the mornings'}).length===0,'a ritual of a real practice passes');
ok(E.pracPropCheck({steps:['nosuch']}).some(e=>/no practice in this build: nosuch/.test(e)),'a practice this build does not carry is refused by name');
ok(E.pracPropCheck({steps:[]}).some(e=>/at least one/.test(e)),'an empty ritual is refused');
ok(E.pracPropCheck({steps:[PRACTICE[0].k],band:'Elbow'}).some(e=>/no seat/.test(e)),'a seat that is not one of the seven is refused');
ok(E.pracPropCheck({steps:[PRACTICE[0].k],run:'now'}).some(e=>/ritual\.run is not a field/.test(e)),'an extra instruction is refused');

console.log('known bad: a field layer passed through whole is caught');
const whole={v:1,loop:L,days:R.days};
ok(E.pracShareCheck({sum:sumOnly.sum,field:whole}).length>0,'the boundary refuses the rows passed through, which is the failure the copy prevents');

console.log('\n'+P+' passed, '+F+' failed');
process.exit(F?1:0);
