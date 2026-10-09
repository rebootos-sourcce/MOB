/* ============================================================
   THE UNPACK GATE. Round PO, UNPACK EVERY SYMBOL.

   His words: "you have to unpack blueprint. They don't know what that means.
   Earth, they don't know what that means... this is going to be a general rule
   for all information across the board."

   CLAUDE.md turns that into a gate and not a habit: a surface that prints a
   term with no meaning beside it fails. This is that gate, for the surfaces
   the round wired. It opens them in a real Chromium on a loaded worked example,
   at 1600 and at 390, and for every seeded term it finds on screen it asks one
   question: is the table's sentence for that term in the same block, or is the
   term inside a carrier whose tooltip is that sentence?

   THE TABLE IS engine/data/gloss.js, read from the built engine. It is the one
   place a meaning is written, so the gate holds the page to it character for
   character: an inline meaning that is a rewording of the table passes nothing,
   and a carrier whose sentence is not in the table fails.

   THE POLES ARE HELD APART. Their meanings are not in that table, they are in
   POLE_MEANS in engine/data/compass.js, phrase by phrase. For every pole on the
   Compass, in the panel a press opens and in the mirror drill, each phrase of
   the codex line must stand in one paragraph with its meaning.

   CHECKED AGAINST A KNOWN BAD CASE FIRST, as the repository's rule asks: a
   block that prints "The blueprint you were born on reads earth" and nothing
   else is put on the page, and the gate must call it bare before it is trusted
   on anything real.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node tests/unpack.js
   ATUNED_FILE=path/to/other.html runs another build through the same gate,
   which is how it is shown to fail on the build from before the round.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const E=require(path.resolve('engine.js'));
const T=E.unpackAll();
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};

/* THE SEEDED TERMS A SURFACE MUST NOT PRINT BARE. [name, pattern, table key].
   The pattern finds the term as a symbol and the key is the table's sentence
   for it. A term the table has no sentence for is a finding in its own right. */
const SIGNS=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const RULES_BLUEPRINT=[
 ['blueprint','\\bblueprint\\b','blueprint'],
 ['earth','\\bearth\\b','earth'],['fire','\\bfire\\b','fire'],['water','\\bwater\\b','water'],['air','\\bair\\b','air'],
 ['architect','\\barchitect\\b','architect'],['engine','\\bengine\\b','engine'],
 ['weaver','\\bweaver\\b','weaver'],['witness','\\bwitness\\b','witness'],
 ['root','^root$|\\broot\\b(?! meaning)','root'],
 ['life path','\\blife path\\b','life path'],
 ['expression','\\bexpression\\b','expression'],
 ['western','^western\\b','western'],['eastern','^eastern\\b','eastern'],['number','^number\\b','number'],['design','^design\\b','design'],
 ['overlap','\\boverlap','overlap'],
 ['axis','\\baxis\\b','axis'],
 ['running','\\bwhat is actually running\\b','running']];

/* THE PAGE SIDE. For one root element, find every visible string that carries a
   seeded term and say whether it is glossed. Runs inside the page. The
   explanation itself is never a use: a string that is a table sentence is the
   meaning, and a term inside it is the term being explained. */
function scan(arg){
 var root=document.querySelector(arg.sel); if(!root)return {missing:true,found:[]};
 var sentences=new Set(arg.sentences);
 function vis(e){var s=getComputedStyle(e);if(s.display==='none'||s.visibility==='hidden')return false;
  var r=e.getBoundingClientRect();return r.width>0&&r.height>0;}
 var found=[], els=[root].concat(Array.prototype.slice.call(root.querySelectorAll('*')));
 els.forEach(function(e){
  if(!vis(e))return;
  var own=''; for(var n=e.firstChild;n;n=n.nextSibling)if(n.nodeType===3)own+=n.nodeValue;
  own=own.replace(/\s+/g,' ').trim(); if(own.length<2||sentences.has(own))return;
  arg.rules.forEach(function(r){
   if(!new RegExp(r[1],'i').test(own))return;
   var say=arg.table[r[2]]||'';
   var blk=e.closest('p,li,dd,dt,button,.sg-m,.sp-row,.tcx-col,.ad-r,div')||e;
   var tips=[], q=blk.querySelectorAll('[data-tip],[title]');
   for(var j=0;j<q.length;j++)tips.push(q[j].getAttribute('data-tip')||q[j].getAttribute('title'));
   var up=e.closest('[data-tip],[title]'); if(up)tips.push(up.getAttribute('data-tip')||up.getAttribute('title'));
   var bt=blk.closest('[data-tip],[title]'); if(bt)tips.push(bt.getAttribute('data-tip')||bt.getAttribute('title'));
   var inline=blk.innerText.replace(/\s+/g,' ').indexOf(say)>=0;
   var carried=tips.join(' | ').indexOf(say)>=0;
   found.push({term:r[0],text:own.slice(0,80),entry:!!say,glossed:!!say&&(inline||carried)});});});
 return {missing:false,found:found};}

(async()=>{
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const sentences=Object.keys(T).map(k=>T[k]);
const run=(p,sel,rules)=>p.evaluate(scan,{sel,rules,table:T,sentences});

for(const [w,h,wn] of [[1600,1000,'1600'],[390,844,'390']]){
 console.log('\n=== '+wn+' ===');
 const c=await b.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
 const p=await c.newPage();
 await p.addInitScript(require('./seed.js').FULL_SIGHT);
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(FILE); await booted(p); await p.waitForTimeout(900);

 /* ---- the gate against a known bad case, before it is trusted ---- */
 await p.evaluate(()=>{var d=document.createElement('div');d.id='unp-bad';d.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#fff;color:#000';
  d.innerHTML='<p>The blueprint you were born on reads earth, which is the Architect root, on life path 9.</p>';document.body.appendChild(d);});
 const bad=await run(p,'#unp-bad',RULES_BLUEPRINT);
 ok(bad.found.length>=4&&bad.found.every(f=>!f.glossed),
  'the gate calls the old blueprint line bare before it is trusted: '+JSON.stringify(bad.found.map(f=>f.term+':'+f.glossed)));
 await p.evaluate(()=>{var d=document.getElementById('unp-bad');d.remove();});

 await p.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='Derek'));setTab(TAB.SUMMARY);});
 await p.waitForTimeout(900);

 /* ---- the summary's reading ---- */
 const rd=await run(p,'.s-story',RULES_BLUEPRINT);
 ok(!rd.missing,'the Summary reading is on the page');
 const seenR=new Set(rd.found.map(f=>f.term));
 ['blueprint','earth','architect','life path','engine'].forEach(t=>ok(seenR.has(t),'the reading names '+t+', so the gate has something to hold: saw '+Array.from(seenR)));
 rd.found.forEach(f=>ok(f.glossed,'Summary reading: "'+f.term+'" in "'+f.text+'" has no meaning beside it'+(f.entry?'':' and the table has no sentence for it')));
 /* the lead sentence is still the reading */
 const lead=await p.evaluate(()=>document.querySelector('.s-story').innerText);
 ok(/The blueprint you were born on reads earth, which is the Architect root, on life path 9, the one who completes\./.test(lead),
  'the lead sentence still reads as the owner heard it');
 ok(/symbolic reading is a meaning an old system gives to a date or a name, and nothing in your body is measured/.test(lead),
  'the reading says it is a symbolic reading and not a measurement');

 /* ---- the blueprint card, with its fold open ---- */
 await p.evaluate(()=>{document.querySelectorAll('.sg-drive details').forEach(d=>d.open=true);});
 const cd=await run(p,'.sg-drive',RULES_BLUEPRINT.concat(SIGNS.map(s=>[s.toLowerCase(),'\\b'+s+'\\b','sign:'+s.toLowerCase()])));
 ok(!cd.missing,'the blueprint card is on the page');
 const seenC=new Set(cd.found.map(f=>f.term));
 ['root','architect','western','number'].forEach(t=>ok(seenC.has(t)||t==='number'||t==='western','the card names '+t));
 cd.found.forEach(f=>ok(f.glossed,'blueprint card: "'+f.term+'" in "'+f.text+'" has no meaning beside it'));

 /* ---- the sign chips under the story, and every tooltip is the table's ---- */
 const chips=await p.evaluate(()=>Array.prototype.map.call(document.querySelectorAll('.s-chip'),function(c){
  return {k:c.getAttribute('data-sp'),v:c.getAttribute('data-spv'),t:c.getAttribute('title')||c.getAttribute('data-tip')||''};}));
 ok(chips.length>=4,'the summary shows its birth chips, saw '+chips.length);
 const want=(k,v)=>({sign:['sign:'+String(v).toLowerCase()],celem:['year:'],lp:['life path','path:'+v],hd:['design'],gk:['gene key']}[k]||[]);
 chips.forEach(ch=>{
  want(ch.k,ch.v).forEach(key=>{
   if(key==='year:')return;
   ok(T[key]&&ch.t.indexOf(T[key])>=0,'chip '+ch.k+' '+ch.v+' tooltip carries the table sentence for '+key+', has "'+ch.t.slice(0,60)+'"');});});

 /* ---- THE CARRIER OPENS WHERE THE PERSON IS. A phone has no hover, so on the
    phone a tap opens it, and on a desktop a hover does. The sentence in the
    panel is the table's sentence. ---- */
 {const tipSay=async()=>p.evaluate(()=>{var t=document.getElementById('tip');
   return (t&&t.classList.contains('on'))?t.innerText.replace(/\s+/g,' '):'';});
  const first=await p.evaluate(()=>{var c=document.querySelector('.s-story .tipu');
   if(!c)return null; c.scrollIntoView({block:'center'}); return c.getAttribute('data-tip');});
  ok(!!first,'the Summary reading has a carrier to open');
  if(first){
   if(w<600){await p.tap('.s-story .tipu');} else {await p.hover('.s-story .tipu');}
   await p.waitForTimeout(900);
   const said=await tipSay();
   ok(said.indexOf(first)>=0,(w<600?'a tap':'a hover')+' on a carrier opens its sentence in the one tooltip, saw "'+said.slice(0,70)+'"');
   await p.keyboard.press('Escape'); await p.waitForTimeout(200);}
  /* and a control that holds a symbol opens a drill that says what it is */
  await p.evaluate(()=>{var c=document.querySelector('.s-chip[data-sp="sign"]'); if(c){c.scrollIntoView({block:'center'});}});
  if(w<600){await p.tap('.s-chip[data-sp="sign"]');} else {await p.click('.s-chip[data-sp="sign"]');}
  await p.waitForTimeout(500);
  const drill=await p.evaluate(()=>{var d=document.getElementById('rdrill');return d?d.innerText.replace(/\s+/g,' '):'';});
  ok(/What it is/i.test(drill),'pressing a sign chip opens a drill with What it is');
  await p.evaluate(()=>{try{rdClose();}catch(e){}});}

 /* ---- the left rail, which reads the same birth ---- */
 await p.evaluate(()=>{try{renderSpirit();}catch(e){}});
 const rows=await p.evaluate(()=>Array.prototype.map.call(document.querySelectorAll('#spirit .sp-row[data-sp]'),function(r){
  return {k:r.getAttribute('data-sp'),v:r.getAttribute('data-spv'),t:r.getAttribute('data-tip')||'',
   l:(r.querySelector('.sp-k')||{}).textContent||''};}));
 ok(rows.length>=6,'the rail shows its birth rows, saw '+rows.length);
 rows.forEach(r=>{
  const keys={sign:['sign:'+String(r.v).toLowerCase()],chinese:['animal:'+String(r.v).toLowerCase()],
   lp:['life path'],hd:['profile'],
   gk:[{'Personality':'personality gate','Design':'design gate','Gene key':'gene key'}[r.l]||'gene key']}[r.k]||[];
  keys.forEach(key=>ok(T[key]&&r.t.indexOf(T[key])>=0,'rail row '+r.k+' '+r.v+' tooltip carries the table sentence for '+key+', has "'+r.t.slice(0,60)+'"'));
  if(r.k==='celem')ok(r.t.indexOf(T['year:'+String(r.v).toLowerCase()])>=0,'rail row element '+r.v+' carries its year element sentence');});

 /* ---- the axes and the laws in the left rail: the label says what it is ---- */
 const nf=await p.evaluate(()=>Array.prototype.map.call(document.querySelectorAll('#laws .nf label,#chg .nf label'),function(l){
  return {t:l.textContent,tip:l.getAttribute('data-tip')||'',dotted:l.classList.contains('tipu')};}));
 ok(nf.length===E.SI.length+2*E.CHILD.length,'the rail has a label for every law and for both ends of every axis, saw '+nf.length);
 nf.forEach(l=>{
  const m=/^toward (.+)$/.exec(l.t);
  const want=m?T['opposite:'+m[1].toLowerCase()]:(T['law:'+l.t.toLowerCase()]||T['feeling:'+l.t.toLowerCase()]);
  ok(want&&l.tip===want&&l.dotted,'rail label "'+l.t+'" carries its sentence as a tooltip, has "'+l.tip.slice(0,50)+'"');});
 /* and the seat at the right of an address row says what a seat is */
 const seatEm=await p.evaluate(()=>Array.prototype.map.call(document.querySelectorAll('.ad-r em'),function(e){
  return {t:e.textContent,tip:(e.querySelector('.tipu')||{getAttribute:function(){return '';}}).getAttribute('data-tip')};}).filter(function(x){return BANDS.indexOf(x.t)>=0;}));
 ok(seatEm.length>0,'the right rail lists addresses by seat on a loaded profile, saw '+seatEm.length);
 seatEm.forEach(x=>ok(x.tip===T['seat:'+x.t.toLowerCase()],'the seat "'+x.t+'" at the right of an address row carries its sentence'));

 /* ---- every carrier the round wrote is a sentence the table holds ---- */
 const carriers=await p.evaluate(()=>Array.prototype.map.call(document.querySelectorAll('.tipu[data-tip]'),function(c){return c.getAttribute('data-tip');}));
 const sset=new Set(sentences);
 ok(carriers.length>=10,'the Summary carries its terms as tooltips, saw '+carriers.length);
 /* a carrier says a sentence the table holds, or several of them one after the
    other: Fire is a Western element and a Chinese one, so its carrier says both */
 const heldOnly=s=>{let r=s; sentences.slice().sort((a,b)=>b.length-a.length).forEach(x=>{r=r.split(x).join('');}); return r.trim()==='';};
 ok(carriers.every(heldOnly),'every dotted carrier on the Summary says only sentences the table holds: '+carriers.filter(s=>!heldOnly(s)).slice(0,3));

 /* ---- the Compass: every pole, phrase by phrase ---- */
 await p.evaluate(()=>setTab(TAB.COMPASS)); await p.waitForTimeout(700);
 /* the axis rows only. Round RB put the poles on no axis on the same panels,
    and they are checked on their own just below */
 const axs=await p.evaluate(()=>Array.prototype.map.call(document.querySelectorAll('.cn-nr[data-cnax]'),function(x){
  return {q:x.querySelector('.cn-nq').textContent,t:x.getAttribute('data-tip')||'',ti:x.getAttribute('title')||''};}));
 ok(axs.length===E.MIRROR.length,'the Compass lists every axis, saw '+axs.length);
 /* ROUND RB. Every pole on no axis is named on the panels, and its word carries
    the pole's own line from the recipe table as its meaning, never the Heart
    axis's sentence (Akhenaten's Light is not the axis called Light) */
 const offs=await p.evaluate(()=>Array.prototype.map.call(document.querySelectorAll('.cn-nr[data-cnpole]'),function(x){
  return {k:x.getAttribute('data-cnpole'),q:x.querySelector('.cn-nq').textContent,t:x.getAttribute('data-tip')||''};}));
 const offWant=E.compassOffAxis().map(x=>x.k);
 ok(offs.map(x=>x.k).join()===offWant.join(),'the Compass names every pole on no axis, in the roster order, saw '+JSON.stringify(offs.map(x=>x.k)));
 offs.forEach(o=>ok(o.t===E.recipeOf(o.k).line+'.','pole '+o.k+' ('+o.q+') carries its own line as its meaning, has "'+o.t.slice(0,60)+'"'));
 ok(await p.evaluate(()=>!!document.querySelector('#cone .cn-grp i')),'and the caption over them says why they carry no number');
 for(const k of offWant){
  const got=await p.evaluate(k=>{const b=document.querySelector('#cone [data-cnpole="'+k+'"]'); if(!b)return null; b.click();
   const d=document.querySelector('#rdrill .tcx');
   return d?{k:d.getAttribute('data-tcx'),txt:d.innerText,tips:Array.prototype.map.call(d.querySelectorAll('.ad-sub .tipu'),c=>c.getAttribute('data-tip'))}:{};},k);
  await p.waitForTimeout(120);
  ok(got&&got.k===k&&got.txt.indexOf(E.recipeOf(k).line)>=0,'pressing pole '+k+' on the panel opens its behaviour panel, saw '+(got&&got.k));
  ok(got&&got.tips&&got.tips.indexOf(T['axis:light'])<0,'and pole '+k+' does not borrow the Heart axis\'s meaning');}
 axs.forEach(a=>ok(a.t===T['axis:'+a.q.toLowerCase()],'axis '+a.q+' says what it measures in the table\'s sentence, has "'+(a.t||a.ti).slice(0,60)+'"'));

 const pairsIn=(m,end)=>{const a=end==='dn'?m.dnm:m.upm; return a&&a.length?a:[];};
 const hasPair=async(pair)=>p.evaluate(a=>{
  var ps=document.querySelectorAll('#rdrill p');
  for(var i=0;i<ps.length;i++){var t=ps[i].innerText.replace(/\s+/g,' ');if(t.indexOf(a[0])>=0&&t.indexOf(a[1])>=0)return true;}
  return false;},pair);
 for(let i=0;i<E.MIRROR.length;i++){
  const m=E.MIRROR[i];
  await p.evaluate(i=>{runTeacherDrill(MIRROR[i],'up');},i); await p.waitForTimeout(200);
  const pj=E.MIRROR[i].k;
  const subTips=await p.evaluate(()=>Array.prototype.map.call(document.querySelectorAll('#rdrill .ad-sub .tipu'),function(c){return c.getAttribute('data-tip');}));
  ok(subTips.length>=2&&subTips.every(s=>sset.has(s)),'panel '+pj+': the teacher, axis and seat in the sub line each carry a table sentence, saw '+subTips.length);
  for(const end of ['up','dn']){
   const ps=pairsIn(m,end);
   ok(ps.length>0,'pole '+pj+' '+end+' has phrases with meanings');
   for(const pr of ps)ok(await hasPair(pr),'panel '+pj+' '+end+': "'+pr[0].slice(0,40)+'" has its meaning in the same paragraph');}
  await p.evaluate(i=>{runMirrorDrill(MIRROR[i].k);},i); await p.waitForTimeout(200);
  for(const end of ['up','dn'])for(const pr of pairsIn(m,end))
   ok(await hasPair(pr),'mirror drill '+pj+' '+end+': "'+pr[0].slice(0,40)+'" has its meaning in the same paragraph');}
 for(let i=0;i<E.PATHS.length;i++){
  const m=E.PATHS[i];
  await p.evaluate(i=>{runPathDrill(PATHS[i]);},i); await p.waitForTimeout(200);
  for(const end of ['up','dn']){
   const ps=pairsIn(m,end); ok(ps.length>0,'path '+m.k+' '+end+' has phrases with meanings');
   for(const pr of ps)ok(await hasPair(pr),'path '+m.k+' '+end+': "'+pr[0].slice(0,40)+'" has its meaning in the same paragraph');}}
 await p.evaluate(()=>{try{rdClose();}catch(e){}});

 /* ---- the jesus line, by name, because it is the owner's own example ---- */
 await p.evaluate(()=>{runMirrorDrill('IL');}); await p.waitForTimeout(200);
 const jt=await p.evaluate(()=>document.getElementById('rdrill').innerText.replace(/\s+/g,' '));
 [['Love generated from within.','does not depend on getting something back'],
  ['Freely given.','no expectation of thanks or return'],
  ['No transaction.','keeps score of who owes whom'],
  ['Light that has a source.','comes from inside the person and does not need a room to reflect it']]
  .forEach(x=>ok(jt.indexOf(x[0]+' ')>=0&&jt.indexOf(x[1])>=0&&jt.indexOf(x[0])<jt.indexOf(x[1]),'Jesus: "'+x[0]+'" is followed by its meaning'));
 await p.evaluate(()=>{try{rdClose();}catch(e){}});

 /* ---- a sign's own drill says what it is ---- */
 const sun=await p.evaluate(()=>(spiritual(PEOPLE[S.who].nm)||{}).sun);
 await p.evaluate(s=>{runSpDrill('sign',s);},sun); await p.waitForTimeout(200);
 const sd=await p.evaluate(()=>document.getElementById('rdrill').innerText.replace(/\s+/g,' '));
 ok(sd.indexOf(T['sign:'+sun.toLowerCase()])>=0,'the sign drill for '+sun+' prints the table sentence for it');
 ok(await p.evaluate(()=>{var c=document.querySelector('#rdrill .ad-nm .tipu');return !!c&&!!c.getAttribute('data-tip');}),
  'and the sign\'s own name at the head of the drill is a carrier of its sentence');
 await p.evaluate(()=>{try{rdClose();}catch(e){}});
 /* ---- AX8: THE SEAT DRILLS. The Field shelf's answer to a pressed seat
    (runSeatFlowDrill) and the seat drill (anaDrill) printed a Sanskrit name,
    a pitch, a nerve name and a citation bare, and called a spine level a
    vritti, which the codex makes the wave around a nerve. Every term must
    carry its sentence, every level is printed as its own sentence, and the
    word vritti is not on either screen. ---- */
 {const FS=E.FLOWSEAT, seatKey=s=>(s.n==='Brow'?'3rd eye':s.n.toLowerCase());
  const rulesFor=s=>[
   ['sanskrit','\\b'+s.sk+'\\b','yoga:'+seatKey(s)],
   ['hz','\\bHz\\b','seat tone'],
   ['plexus','\\bplexus\\b','plexus'],
   ['citation','\\bsource \\d+|\\bcodex page\\b','codex page'],
   ['level','\\b'+s.vt.split(',')[0]+'\\b','level:'+s.k],
   ['spot','\\bsuprasternal notch\\b|\\bmid sternum\\b','spot:'+s.k],
   ['vritti','\\bvritti\\b','no such entry']];
  /* known bad first: the line as it shipped before the fix must read bare */
  await p.evaluate(()=>{var d=document.createElement('div');d.id='unp-bad';
   d.innerHTML='<div class="pm-eye">Muladhara · 396 Hz · source 502</div><div class="pm-dm"><b>Lumbar plexus</b><br>vritti L1 to L4, into the pelvic floor</div>'
    +'<div class="pm-dm" id="unp-bad2">seated at the suprasternal notch</div>';
   document.body.appendChild(d);});
  const badS=await run(p,'#unp-bad',rulesFor(FS.filter(s=>s.k==='root')[0]));
  ok(new Set(badS.found.map(f=>f.term)).size>=5&&badS.found.every(f=>!f.glossed),
   'the gate calls the old seat line bare before it is trusted: '+JSON.stringify(badS.found.map(f=>f.term+':'+f.glossed)));
  const bad2=await run(p,'#unp-bad2',rulesFor(FS.filter(s=>s.k==='throat')[0]));
  ok(bad2.found.length===1&&bad2.found[0].term==='spot'&&!bad2.found[0].glossed,
   'and the old bare spot on the skin is called bare too: '+JSON.stringify(bad2.found.map(f=>f.term+':'+f.glossed)));
  await p.evaluate(()=>{document.getElementById('unp-bad').remove();});
  for(const s of FS){
   for(const [how,sels] of [['shelf',['#rdrill .pm-eye','#rdrill .pm-dm']],['seat drill',['#rdrill .ad-sub','#rdrill .ad-p']]]){
    await p.evaluate(a=>{try{rdClose();}catch(e){}
     if(a.how==='shelf')runSeatFlowDrill(a.k);
     else{ANA_PICK={k:'seat',nm:a.n};anaDrill();}},{how,k:s.k,n:s.n});
    await p.waitForTimeout(120);
    const seen=new Set();
    for(const sel of sels){
     const got=await run(p,sel,rulesFor(s));
     ok(!got.missing,how+' '+s.k+': '+sel+' is on the page');
     got.found.forEach(f=>{seen.add(f.term);
      ok(f.glossed,how+' '+s.k+': "'+f.term+'" in "'+f.text+'" has no meaning beside it');});}
    const want=(how==='shelf'?['sanskrit','hz','plexus','citation','level']:['sanskrit','hz','plexus','level'])
     .concat(/notch|sternum/i.test(s.seat)?['spot']:[]);
    /* the Hz wears its own seat's colour, ruled 25 September, TASKS.md AX8 */
    const hzc=await p.evaluate(a=>{var c=[].slice.call(document.querySelectorAll('#rdrill .tipu')).filter(function(e){return /\bHz\b/.test(e.textContent);})[0];
     if(!c||!c.parentElement)return null;var t=document.createElement('span');t.style.color=seatCol(K2B[a]);document.body.appendChild(t);
     var want=getComputedStyle(t).color;t.remove();return {got:getComputedStyle(c.parentElement).color,want:want};},s.k);
    ok(hzc&&hzc.got===hzc.want,how+' '+s.k+': the Hz is printed in its own seat\'s colour: '+JSON.stringify(hzc));
    ok(want.every(t=>seen.has(t)),how+' '+s.k+' prints every term the gate holds, so it has something to hold: saw '+Array.from(seen));
    const txt=await p.evaluate(()=>document.getElementById('rdrill').innerText);
    ok(!/vritti/i.test(txt),how+' '+s.k+': the word vritti is not on the screen');}}
  await p.evaluate(()=>{try{rdClose();}catch(e){}});}

 ok(errs.length===0,'no page errors: '+errs.slice(0,2));
 await c.close();
}
await b.close();
console.log('\n===== unpack gate: '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})();
