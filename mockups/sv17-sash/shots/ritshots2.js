/* SV17 sheet, overflow and fold shots of Flow > Ritual, from the real build,
   and a click-through that asserts what it shows. Diane is a worked example,
   so her plans are held in memory (RIT_EX) and never in the store; two are
   added for the run: a release schedule aimed at the heaviest place she holds,
   which is the one ritual that has a real second pole, and a plain breath, so
   today carries four rituals and the +N sash is drawn.
   node ritshots2.js <source.html> <outdir> */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const SRC=path.resolve(process.argv[2]), OUT=process.argv[3];
fs.mkdirSync(OUT,{recursive:true});
const fails=[]; const ok=(c,m)=>{console.log((c?'  ok   ':'  FAIL ')+m); if(!c)fails.push(m);};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const errs=[];
 for(const [W,H] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:W,height:H}});
  p.on('pageerror',e=>errs.push(W+': '+e.message));
  await p.goto('file://'+SRC+'?dev=1');
  await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}).catch(()=>{});
  const seed=await p.evaluate(()=>{
   loadP(PEOPLE.findIndex(x=>x.nm==='Diane')); setTab(TAB.RITUAL);
   const n=ritHeld().filter(h=>h.cf).sort((a,c)=>c.sq-a.sq)[0];
   const DAY=86400000, off=new Date().getTimezoneOffset()*60000, today=Math.floor((Date.now()-off)/DAY);
   const iso=d=>new Date(d*DAY+off+12*3600000).toISOString();
   const base=ritPlans();
   const mk=(id,k,rel,band)=>({id,steps:[k],when:'',where:'',days:7,from:iso(today-2),stop:null,band:band||'',track:'',rel,tc:null,tags:band?[band]:[],on:null,tm:null});
   RIT_EX[CURP.id]=base.concat([mk('sv17rel','box',n.i,n.b),mk('sv17slow','slow',null,'Heart')]);
   ritRender();
   return {cf:n.cf, b:n.b, k:n.k, plans:ritPlans().length};});
  ok(seed.plans>=4,W+': Diane carries her plans and the two added for the run, '+JSON.stringify(seed));
  await p.waitForTimeout(1200);
  const fold=await p.evaluate(()=>{const w=document.querySelector('#rit .rv-week').getBoundingClientRect();
   const cells=[...document.querySelectorAll('#rit .rv-wd1')].map(c=>Math.round(c.getBoundingClientRect().height));
   const sash=[...document.querySelectorAll('#rit .rv-week button.rv-wch')].map(x=>{const r=x.getBoundingClientRect(); return [Math.round(r.width),Math.round(r.height)];});
   return {bottom:Math.round(w.bottom), top:Math.round(w.top), vh:innerHeight, cells, small:sash.filter(s=>s[0]<44||s[1]<44),
    now:document.querySelector('#rit .rv-wd1.rv-now .rv-wdl').children.length,
    more:(document.querySelector('#rit .rv-wd1.rv-now .rv-wmore')||{}).textContent||'',
    text:[...document.querySelectorAll('#rit .rv-week button.rv-wch:not(.rv-wmore)')].every(x=>x.textContent.trim()==='')};});
  ok(fold.bottom<=fold.vh,W+': the whole week, key included, is on the first screen with no scroll, bottom '+fold.bottom+' of '+fold.vh);
  ok(new Set(fold.cells).size===1,W+': every day cell is the same height, '+JSON.stringify(fold.cells));
  ok(fold.small.length===0,W+': every sash is at least 44 by 44, '+JSON.stringify(fold.small));
  ok(fold.now===3&&fold.more==='+2',W+': today carries four rituals and draws two sashes and a +2, '+JSON.stringify([fold.now,fold.more]));
  ok(fold.text,W+': no sash prints a word');
  await p.screenshot({path:`${OUT}/after-Diane-${W}-overflow.png`});
  /* the +N opens the day's list, and a row opens that ritual */
  await p.click('#rit .rv-wd1.rv-now .rv-wmore'); await p.waitForTimeout(400);
  const day=await p.evaluate(()=>({open:!document.getElementById('sheet').hidden,
   rows:[...document.querySelectorAll('#sheet-card .rv-shr .rv-shrn')].map(x=>x.textContent)}));
  ok(day.open&&day.rows.length===4,W+': +2 opens today\'s whole list in the sheet, '+JSON.stringify(day));
  await p.screenshot({path:`${OUT}/after-Diane-${W}-day-list.png`});
  const relNm=await p.evaluate(()=>ritName(ritPlans().find(x=>x.id==='sv17rel').steps));
  await p.evaluate(nm=>{[...document.querySelectorAll('#sheet-card .rv-shr')].find(r=>r.querySelector('.rv-shrn').textContent===nm).click();},relNm);
  await p.waitForTimeout(500);
  const rel=await p.evaluate(()=>{const c=document.getElementById('sheet-card');
   return {nm:(c.querySelector('.rv-sht .sh-h')||{}).textContent, bar:c.querySelectorAll('.rb2').length,
    poles:[...c.querySelectorAll('.rb2-n')].map(x=>x.textContent), kept:(c.querySelector('.rv-shk')||{}).textContent||'',
    done:!!c.querySelector('[data-sh="log"]'), edit:!!c.querySelector('[data-sh="edit"]'), del:!!c.querySelector('[data-sh="del-plan"]'),
    d:(c.querySelector('.rv-shd')||{}).textContent||'', barH:c.querySelector('.rb2')?Math.round(c.querySelector('.rb2').getBoundingClientRect().height):0};});
  const want=await p.evaluate(cf=>{const c=CHILD.find(x=>x.nm===cf); return [c.nm,c.opp];},seed.cf);
  ok(rel.nm===relNm&&rel.bar===1&&JSON.stringify(rel.poles)===JSON.stringify(want),
   W+': the release schedule\'s sheet carries one two pole bar, '+want.join(' against ')+', the pattern its address holds, '+JSON.stringify(rel));
  ok(rel.barH>=44,W+': the bar row is at the 44 pixel floor, '+rel.barH);
  ok(/^Kept \d+ days?(\d+ days left|Last day)$/.test(rel.kept)&&!/ of \d/.test(rel.kept)&&rel.done&&rel.edit&&rel.del&&rel.d.length>20,
   W+': the sheet carries the days kept and the days left, never kept of set, what the practice is, and Done, Edit and Delete, '+JSON.stringify(rel));
  await p.screenshot({path:`${OUT}/after-Diane-${W}-sheet-bar.png`});
  /* a ritual started from the builder has no opposite, so no bar */
  await p.evaluate(()=>sheetShut());
  const plain=await p.evaluate(()=>{const st=ritRead(), d=st.today, segs=ritWeekDay(d,st);
   const i=segs.findIndex(s=>{const q=ritSashPlan(s,d,st); return q&&q.rel==null;}); ritSashOpen(d,i);
   const c=document.getElementById('sheet-card'); return {i, nm:(c.querySelector('.rv-sht .sh-h')||{}).textContent, bar:c.querySelectorAll('.rb2').length};});
  ok(plain.i>=0&&plain.bar===0,W+': a ritual with no target pattern gets no bar at all, '+JSON.stringify(plain));
  await p.screenshot({path:`${OUT}/after-Diane-${W}-sheet-plain.png`});
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  ok(await p.evaluate(()=>document.getElementById('sheet').hidden),W+': Escape closes the sheet');
  /* a past day's sash opens that day's ritual, and offers no Done ring for a day ritLog refuses */
  const past=await p.evaluate(()=>{const st=ritRead(), mon=st.today-ritWd(st.today);
   for(let d=mon;d<st.today-1;d++){const segs=ritWeekDay(d,st); if(!segs.length)continue;
    const btn=document.querySelector('#rit .rv-week button.rv-wch[data-d="'+d+'"][data-i="0"]'); btn.click();
    const c=document.getElementById('sheet-card');
    return {d, want:segs[0].nm, got:(c.querySelector('.rv-sht .sh-h')||{}).textContent, done:!!c.querySelector('[data-sh="log"]')};}
   return null;});
  ok(past&&past.want===past.got&&!past.done,W+': an older day\'s sash opens that ritual, with no Done ring on a day the record will not take, '+JSON.stringify(past));
  await p.evaluate(()=>sheetShut());
  /* an empty day is still the dash. The two plans added above cover every
     day of this week, so the weekend two weeks on is read, where only the
     weekday ritual runs */
  const empty=await p.evaluate(()=>{RIT.wk=2; ritRender();
   const out=[...document.querySelectorAll('#rit .rv-wd1')].filter(c=>!c.querySelector('.rv-wch')).map(c=>(c.querySelector('.rv-wd0')||{}).textContent);
   return out;});
  await p.screenshot({path:`${OUT}/after-Diane-${W}-empty-days.png`});
  await p.evaluate(()=>{RIT.wk=0; ritRender();});
  ok(empty.length>0&&empty.every(t=>t==='–'),W+': an empty day is the house dash and nothing else, '+JSON.stringify(empty));
  await p.close();}
 await b.close();
 console.log(errs.length?'PAGE ERRORS\n'+errs.join('\n'):'no page errors');
 console.log(fails.length?fails.length+' failed':'all passed');
 process.exit(fails.length||errs.length?1:0);
})();
