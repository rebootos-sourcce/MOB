/* ============================================================
   THE REMINDER GATE, ui/remind.js and remindDue in engine/ladder.js.
   accounts-push, 19 November: an in-app pop-up, never a phone push, shown
   after a missed day (the default, not a ruling: see remindDue).

   WHAT IT HOLDS, at 1600 and at 390:
     1  under ?dev=1, the flag every browser gate enters through, a record
        with a missed day meets no reminder, so no other gate can trip on it
     2  with the flag off, a missed day shows the card: symbol, header, the
        day last marked done in the Ritual page's own words, two buttons
     3  the card sits inside the viewport with the 16px gutter, makes no
        horizontal scroll, every button is at least the tap floor, and it
        does not overlap the message dock when a save message lands
     4  it speaks once a day: a second look the same day shows nothing
     5  Open Ritual goes to the Ritual tab and closes the card
     6  a ritual done yesterday is not a missed day, and an open modal
        keeps it quiet
   Known bad first: the same checks run against a record with a missed day
   and the flag on must find no card, and with the flag off must find one,
   so a check that always passes would fail one of the two.

   Screenshots go to $SHOTS when it is set.

       NODE_PATH=$(npm root -g) node tests/remind.js

   Run from the repository root. Exits non zero on any failure.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const SHOTS=process.env.SHOTS||'';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}};

/* a missed day: rituals marked done three and four days ago, none since */
const seed=(page,ago)=>page.evaluate(ago=>{
 const D=86400000, now=Date.now();
 CURP.rituals=ago.map(n=>({t:new Date(now-n*D).toISOString(),min:10,steps:[],done:true}));
 try{STORE.set('source.remind','');}catch(e){}
 const h=document.getElementById('remind'); if(h)h.remove();},ago);

async function run(w,h){
 const browser=await chromium.launch(process.env.CHROME?{executablePath:process.env.CHROME}:{});
 const page=await browser.newPage({viewport:{width:w,height:h}});
 const errs=[]; page.on('pageerror',e=>errs.push(String(e)));
 await page.goto(FILE); await booted(page);
 await page.waitForTimeout(400);
 const tag=' at '+w;

 /* 1, and the known bad half: the flag on, a missed day, no card */
 await seed(page,[3,4]);
 const quiet=await page.evaluate(()=>{const r=remindCheck(); return {r:r, el:!!document.getElementById('remind')};});
 ok(quiet.r===null&&!quiet.el,'under ?dev=1 a missed day shows no reminder'+tag);

 /* 2 */
 await page.evaluate(()=>{DEV_SKIP=false;});
 await seed(page,[3,4]);
 const shown=await page.evaluate(()=>{
  const due=remindCheck(), el=document.getElementById('remind');
  const want=due?ritDayName(due.last,due.today):null;
  return {due:due, el:!!el, h:el&&el.querySelector('.rmd-h').textContent,
   b:el&&el.querySelector('.rmd-b').textContent, want:want,
   sym:el&&!!el.querySelector('.rmd-sym svg circle')&&el.querySelector('.rmd-sym').getAttribute('data-tip'),
   btns:el?[...el.querySelectorAll('button')].map(b=>b.textContent):[],
   role:el&&el.getAttribute('role'), modal:el&&el.getAttribute('aria-modal'),
   focus:el?el.contains(document.activeElement):null};});
 ok(shown.el&&shown.due&&shown.due.gap===3,'with the flag off a missed day shows the card'+tag+', '+JSON.stringify(shown.due));
 ok(shown.h==='Ritual reminder','the header names it, got '+shown.h);
 ok(shown.b==='Last marked done: '+shown.want+'.','the line names the day as the Ritual page does, got '+shown.b);
 ok(typeof shown.sym==='string'&&/once a day/.test(shown.sym),'the ring symbol carries its meaning on hover and tap, got '+shown.sym);
 ok(JSON.stringify(shown.btns)==='["Open Ritual","Not today"]','two buttons, got '+JSON.stringify(shown.btns));
 ok(shown.role==='dialog'&&shown.modal==='false'&&shown.focus===false,'not modal and focus is not taken'+tag);

 /* 3 */
 const geo=await page.evaluate(()=>{
  status('Saved.','ok');
  const r=document.getElementById('remind').getBoundingClientRect();
  const d=document.getElementById('msgdock').getBoundingClientRect();
  const over=!(r.right<=d.left||d.right<=r.left||r.bottom<=d.top||d.bottom<=r.top);
  const bs=[...document.querySelectorAll('#remind button')].map(b=>{const q=b.getBoundingClientRect(); return [q.width,q.height];});
  return {l:r.left, r:innerWidth-r.right, b:innerHeight-r.bottom, top:r.top,
   scroll:document.documentElement.scrollWidth>innerWidth, over:over, dockH:d.height, bs:bs};});
 ok(geo.l>=16&&geo.r>=16&&geo.top>=0&&geo.b>=16,'inside the viewport with the 16px gutter'+tag+', '+JSON.stringify(geo));
 ok(!geo.scroll,'no horizontal scroll'+tag);
 ok(geo.dockH>0&&!geo.over,'the card and the message dock do not overlap'+tag+', '+JSON.stringify(geo));
 ok(geo.bs.every(x=>x[0]>=44&&x[1]>=44),'every button meets the tap floor'+tag+', '+JSON.stringify(geo.bs));
 if(SHOTS){fs.mkdirSync(SHOTS,{recursive:true});
  await page.evaluate(()=>{status('');});
  await page.waitForTimeout(400);
  await page.screenshot({path:path.join(SHOTS,'remind-'+w+'.png')});}

 /* 4 */
 const again=await page.evaluate(()=>{document.getElementById('remind').remove(); return remindCheck();});
 ok(again===null,'it speaks once a day, a second look shows nothing'+tag);

 /* 5 */
 await seed(page,[3]);
 const went=await page.evaluate(()=>{
  setTab(TAB.STORY); remindCheck();
  document.querySelector('#remind [data-rmd="go"]').click();
  return {tab:S.tab, want:TAB.RITUAL, gone:!document.getElementById('remind')};});
 ok(went.tab===went.want&&went.gone,'Open Ritual goes to the Ritual tab and closes the card, '+JSON.stringify(went));

 /* 6 */
 await seed(page,[1,2]);
 ok(await page.evaluate(()=>remindCheck())===null,'a ritual done yesterday is not a missed day'+tag);
 await seed(page,[3]);
 const modal=await page.evaluate(()=>{
  const m=document.createElement('div'); m.setAttribute('aria-modal','true'); document.body.appendChild(m);
  const r=remindCheck(); m.remove(); return r;});
 ok(modal===null,'an open modal keeps it quiet'+tag);

 ok(errs.length===0,'no page errors'+tag+', '+JSON.stringify(errs.slice(0,2)));
 await browser.close();}

(async()=>{
 await run(1600,1000);
 await run(390,844);
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);})();
