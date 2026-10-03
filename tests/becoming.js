/* Round RB in a real Chromium: the Becoming slices S1 to S3 on the Avatar
   page, the Knowledge page laid out by the seven seats with both columns
   shut, and Summary's lead row.

   What this holds is what the person sees and what the record keeps:

     S1  the ratings, the starting weights and the tags written before this
         round are read across from the old key once, land on the record
         against the pair's id, travel through an export, and the old key is
         left where it was
     S2  the identity row writes a name, a title and a sentence; the monthly
         look, once due, moves the version only when the person says it
         changed; a new pair carries an id
     S3  the Purpose subtab writes six values and a side's lines, the
         readings come out derived, the figure lights a mark per line, and a
         worked example offers no field that saves
     Knowledge  seven tiles crown to root, one seat open, both columns shut
         on arrival on its own keys, and the Field's right column unmoved
     Summary  what to do stands beside the story, and on a phone it follows
         the story and comes before the drivers

   CHECKED AGAINST A KNOWN BAD CASE FIRST. The read across is run once on a
   record that already says it was done, and must move nothing, before the
   move on the real one is trusted.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node tests/becoming.js */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
 await p.goto(FILE); await booted(p); await wait(300);

 console.log('\n=== S1: the avatar\'s own data moves onto the record, once ===');
 const s1=await p.evaluate(async()=>{
  loadP(0); setTab(TAB.INTAKE); AV.sub='becoming';
  const o={own:avOwn()};
  const pair={be:'Someone who stays close when it gets hard.',notbe:'My chest aches and I feel lonely when my partner goes quiet.',seat:'Heart'};
  /* the known bad case: a record that already says it moved reads nothing */
  /* written the way a build before this round wrote it: no status, no id */
  CURP.avatar={built:true,at:new Date().toISOString(),reviewedAt:null,pairs:[Object.assign({},pair)],movedAt:'2026-10-01T00:00:00.000Z'};
  avatarFill(CURP.avatar);
  avatarEnsureIds(CURP.avatar);
  const side={}; side[CURP.id]={arch:{Warrior:4},load0:{},rule:{},tags:{Heart:{add:['Betrayal'],off:[]}}};
  side[CURP.id].load0[avKey(pair)]=3.5;
  STORE.set(AV_KEY,JSON.stringify(side));
  renderAvatar();
  o.badMoved=Object.keys(CURP.avatar.arch).length+Object.keys(CURP.avatar.load0).length;
  /* the real case */
  CURP.avatar.movedAt=null; CURP.avatar.arch={}; CURP.avatar.load0={}; CURP.avatar.tags={};
  AV.sig=''; renderAvatar();
  const id=CURP.avatar.pairs[0].id;
  o.arch=CURP.avatar.arch.Warrior; o.load0=CURP.avatar.load0[id]; o.tag=(CURP.avatar.tags.Heart||{add:[]}).add[0];
  o.moved=!!CURP.avatar.movedAt; o.sideKept=!!JSON.parse(STORE.get(AV_KEY))[CURP.id];
  o.side=avSide(); o.sideArch=o.side.arch.Warrior; o.sideLoad=o.side.load0[id];
  /* an export, read back through the boundary */
  const v=validateProfile(JSON.parse(JSON.stringify(saveProfile(CURP))));
  o.trip=v.ok&&v.profile.avatar.arch.Warrior===4&&v.profile.avatar.load0[id]===3.5&&v.profile.avatar.tags.Heart.add[0]==='Betrayal';
  /* a rating written now goes to the record and not the old key */
  AV.sub='arch'; AV.arch='Sage'; renderAvatar(); avRate(5);
  o.rate=CURP.avatar.arch.Sage; o.rateSide=(JSON.parse(STORE.get(AV_KEY))[CURP.id].arch||{}).Sage;
  delete o.side; return o;});
 ok(s1.own,'the blank profile is the person\'s own, so it can be written');
 ok(s1.badMoved===0,'a record that says it moved reads nothing across, got '+s1.badMoved);
 ok(s1.arch===4&&s1.load0===3.5&&s1.tag==='Betrayal','the rating, the weight and the tag land on the record, '+JSON.stringify(s1));
 ok(s1.moved&&s1.sideKept,'the move is dated and the old key is left for an older build');
 ok(s1.sideArch===4&&s1.sideLoad===3.5,'and the page reads them off the record');
 ok(s1.trip,'and they travel through an export and back');
 ok(s1.rate===5&&s1.rateSide===undefined,'a new rating is written to the record, not the old key');

 console.log('\n=== S2: who the avatar is, the monthly look, the pair id ===');
 const s2=await p.evaluate(async()=>{
  AV.sub='becoming'; AV.sig=''; renderAvatar();
  const host=document.getElementById('avbody'), o={};
  o.pen=!!host.querySelector('[data-avidedit]');
  host.querySelector('[data-avidedit]').click();
  const set=(k,v)=>{const f=host.querySelector('[data-avid="'+k+'"]'); f.value=v;};
  o.cap=+host.querySelector('[data-avid="name"]').maxLength===AV_CAP.name;
  set('name','Steady'); set('title','A founder who rests'); set('description','Someone who builds without burning down.');
  host.querySelector('[data-avidsave]').click();
  o.name=CURP.avatar.name; o.title=CURP.avatar.title; o.desc=CURP.avatar.description;
  o.shown=(host.querySelector('.avi-n b')||{}).textContent;
  /* the monthly look: not due, no buttons; due, two; changed moves the version */
  o.notDue=!host.querySelector('[data-avrev]')&&/Next monthly look/.test(host.textContent);
  CURP.avatar.at=CURP.avatar.reviewedAt=new Date(Date.now()-40*864e5).toISOString(); AV.sig=''; renderAvatar();
  o.due=host.querySelectorAll('[data-avrev]').length;
  const v0=CURP.avatar.version;
  host.querySelector('[data-avrev="same"]').click();
  o.same=CURP.avatar.version===v0&&Date.now()-Date.parse(CURP.avatar.reviewedAt)<6e4;
  CURP.avatar.reviewedAt=new Date(Date.now()-40*864e5).toISOString(); AV.sig=''; renderAvatar();
  host.querySelector('[data-avrev="changed"]').click();
  o.changed=CURP.avatar.version===v0+1;
  o.ids=CURP.avatar.pairs.every(x=>AV_ID.test(x.id||''));
  o.status=CURP.avatar.status;
  return o;});
 ok(s2.pen&&s2.cap,'the identity row opens on the person\'s own profile, its fields capped where the boundary caps them');
 ok(s2.name==='Steady'&&s2.title==='A founder who rests'&&/burning/.test(s2.desc)&&s2.shown==='Steady',
  'a name, a title and a sentence are kept and shown, '+JSON.stringify(s2));
 ok(s2.notDue,'a look that is not due says when the next one is and offers nothing to press');
 ok(s2.due===2,'a due one offers still true and I changed it');
 ok(s2.same,'still true moves the date and not the version');
 ok(s2.changed,'I changed it moves the version');
 ok(s2.ids&&s2.status==='active','every pair carries an id and a built avatar is active');

 console.log('\n=== S3: the purpose map written on the page ===');
 const s3=await p.evaluate(async()=>{
  AV.sub='purpose'; AV.sig=''; renderAvatar();
  const host=document.getElementById('avbody'), o={};
  const put=(sel,v)=>{const f=host.querySelector(sel); f.value=v; f.dispatchEvent(new Event('change'));};
  o.capV=+host.querySelector('[data-avpv="soul"]').maxLength===PUR_VAL_MAX-1;
  ['freedom','wisdom','truth'].forEach((v,i)=>put('[data-avpv="soul"][data-i="'+i+'"]',v));
  ['health','family'].forEach((v,i)=>put('[data-avpv="ego"][data-i="'+i+'"]',v));
  await new Promise(r=>setTimeout(r,50));
  o.notYet=!host.querySelector('.avp-read');
  put('[data-avpv="ego"][data-i="2"]','stability');
  await new Promise(r=>setTimeout(r,50));
  o.soul=CURP.purpose.soul.join(','); o.ego=CURP.purpose.ego.join(',');
  o.read=(host.querySelector('.avp-read')||{}).textContent||'';
  o.ready=purposeReady(CURP.purpose);
  host.querySelector('.avp-sb[data-avside="partner"]').click();
  put('[data-avpl="partner"][data-i="0"]','I say when I need rest');
  await new Promise(r=>setTimeout(r,50));
  put('[data-avpl="partner"][data-i="2"]','I ask before I assume');
  await new Promise(r=>setTimeout(r,50));
  o.lines=JSON.stringify(CURP.purpose.sides.partner);
  o.lit=document.querySelectorAll('#avbody .avp-side[data-avside="partner"] .avp-tk.lit').length;
  o.count=/\b\d+ of (5|30)\b/.test(host.textContent);
  o.saved=JSON.parse(STORE.get(PKEY)||'[]');
  o.persisted=Array.isArray(o.saved)?o.saved.some(x=>x&&x.purpose&&x.purpose.soul&&x.purpose.soul[0]==='freedom'):null;
  delete o.saved;
  /* a worked example: what it carries, and nothing that saves */
  loadP(PEOPLE.findIndex(x=>x.nm==='Diane')); setTab(TAB.INTAKE); AV.sub='purpose'; AV.sig=''; renderAvatar();
  o.exDisabled=[...document.querySelectorAll('#avbody .avp-in')].every(f=>f.disabled);
  o.exPen=!!document.querySelector('#avbody [data-avidedit]');
  AV.sub='becoming';
  return o;});
 ok(s3.capV,'a value field stops where the boundary would refuse');
 ok(s3.notYet,'five values are not a reading, so none is shown');
 ok(s3.soul==='freedom,wisdom,truth'&&s3.ego==='health,family,stability'&&s3.ready,'six values are kept, '+s3.soul+' / '+s3.ego);
 ok(/freedom, wisdom, truth/.test(s3.read)&&/how you make money/.test(s3.read),'and the readings come out derived, never typed');
 ok(s3.lines==='["I say when I need rest","I ask before I assume"]','a side keeps only the lines written, closed up, '+s3.lines);
 ok(s3.lit===2,'the figure lights a mark for each line on that side, got '+s3.lit);
 ok(!s3.count,'and no count against five or thirty is printed');
 ok(s3.persisted!==false,'the record that is saved carries the values');
 ok(s3.exDisabled&&!s3.exPen,'a worked example offers no field that saves');

 console.log('\n=== Knowledge: the seven seats, both columns shut ===');
 const k=await p.evaluate(async()=>{
  ['lcolk','rcolk'].forEach(x=>{try{STORE.set(x,'');}catch(e){}});
  setTab(TAB.FIELD); render(); const fieldR=document.body.classList.contains('rshut');
  setTab(TAB.KNOW); kbRender(); await new Promise(r=>setTimeout(r,50));
  const o={fieldR};
  o.l=document.body.classList.contains('lshut'); o.r=document.body.classList.contains('rshut');
  o.tiles=[...document.querySelectorAll('#knowbody [data-kbseat]')].map(x=>x.dataset.kbseat).join(',');
  o.order=IQ_SEATS.join(',');
  o.open=[...document.querySelectorAll('#knowbody [data-kbpn]')].map(x=>x.dataset.kbpn).join(',');
  document.querySelector('#knowbody [data-kbseat="Heart"]').click();
  o.heart=[...document.querySelectorAll('#knowbody [data-kbpn]')].map(x=>x.dataset.kbpn).join(',');
  o.heartRows=document.querySelectorAll('#knowbody [data-kbpn="Heart"] .kb-row').length;
  o.pressed=document.querySelector('#knowbody [data-kbseat="Heart"]').getAttribute('aria-pressed');
  KB_SEC='addr'; kbRender();
  o.addr=document.querySelectorAll('#knowbody .kb-row').length;
  o.addrSeats=[...document.querySelectorAll('#knowbody [data-kbpn]')].map(x=>x.dataset.kbpn).join(',');
  KB_SEC='all'; KB_SEAT='Crown'; kbRender();
  /* opened here, it stays open here, and the Field is not moved by it */
  document.getElementById('rfold').click();
  setTab(TAB.FIELD); render(); o.fieldAfter=document.body.classList.contains('rshut');
  setTab(TAB.KNOW); kbRender(); o.knowAfter=document.body.classList.contains('rshut');
  return o;});
 ok(!k.fieldR,'the Field\'s right column is open, as it always was');
 ok(k.l&&k.r,'Knowledge arrives with both columns shut');
 ok(k.tiles===k.order,'seven tiles in the Intake page\'s order, '+k.tiles);
 ok(k.open==='Crown','one seat open on arrival, the crown, '+k.open);
 ok(k.heart==='Heart'&&k.heartRows>10&&k.pressed==='true','a tile opens its seat, '+k.heartRows+' rows at the heart');
 ok(k.addr===112&&k.addrSeats.split(',').length===7,'a kind shows across all seven seats, all 112 addresses, '+k.addrSeats);
 ok(!k.fieldAfter&&!k.knowAfter,'opened on Knowledge it stays open there, and the Field is untouched');

 console.log('\n=== Summary: what to do beside the story ===');
 const sm=await p.evaluate(async()=>{
  loadP(PEOPLE.findIndex(x=>x.nm==='Diane'));
  CURP.story.entries=[{t:new Date().toISOString(),text:'My chest aches and I feel lonely when my partner goes quiet.',imprints:1,bands:{}}];
  setTab(TAB.SUMMARY); render(); await new Promise(r=>setTimeout(r,100));
  const lead=document.querySelector('#sumbody .sg-lead2'), o={};
  o.side=!!(lead&&lead.querySelector('.sg-side>.sg-todo+.sg-drive'));
  const todo=document.querySelector('#sumbody .sg-todo').getBoundingClientRect();
  o.todoTop=Math.round(todo.top);
  o.loopAfter=!!(lead&&lead.nextElementSibling&&lead.nextElementSibling.id==='sumloop');
  return o;});
 ok(sm.side,'the right half of the lead row is what to do, then the drivers');
 ok(sm.todoTop<1000,'what to do is on the first screen at 1600 by 1000, at '+sm.todoTop);
 ok(sm.loopAfter,'and the patterns follow the lead row');
 await p.setViewportSize({width:390,height:844}); await wait(400);
 const ph=await p.evaluate(()=>{
  const r=s=>document.querySelector(s).getBoundingClientRect();
  return {story:r('#sumbody .sg-story').bottom, todo:r('#sumbody .sg-todo').top, drive:r('#sumbody .sg-drive').top,
   loop:document.getElementById('sumloop')?r('#sumloop').top:null, who:r('#sumbody .sg-who').bottom};});
 ok(ph.todo>=ph.story&&ph.todo<ph.drive,'on a phone what to do follows the story and comes before the drivers, '+JSON.stringify(ph));
 ok(ph.loop===null||ph.loop>ph.story,'and the patterns no longer jump above the story');

 ok(errs.length===0,'no page errors, '+errs.join(' | '));
 await b.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);
})();
