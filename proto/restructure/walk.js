/* ============================================================
   walk.js. The restructure, walked in real Chromium. Round FY.

   Evidence for RESEARCH-field-summary-restructure.md. Not a gate. Drives the
   unpacked prototype (proto/restructure/restructure.html) in both of its
   layouts and prints what was on the screen, with the SAME counter that
   proto/firstrun/walk.js uses, so its numbers compare with that file's and
   with nothing older:

     a control is a button, link, input, select, textarea or tab stop that has
     a box, is not hidden or disabled, and overlaps the viewport. Anything
     inside the prototype's own strip (data-proto) is not counted.

   "whole" counts the same controls anywhere on the surface, scrolled or not,
   because a rail that scrolls is still a rail full of choices.

   Four parts, all MEASURED:
     1. The count. Controls and words in view, and on the whole surface, for
        every surface both layouts show, per person, at 1600 and 390.
     2. The tasks. Taps and scroll to reach eight things a person comes for,
        performed with real clicks in both layouts.
     3. The words. Every word either layout uses for committed charge and for
        released charge, read off the rendered text.
     4. The entries. Each ICP's own first lines (sim/stories.js) typed into
        the proposed journal, committed, and released where the product lets
        a release run: what the imprints, the bank, the vault and Source AI
        said at each step.

     node proto/restructure/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/restructure/walk.js [OUTDIR]

   What anybody would FEEL about any of it is not here. That is the report's
   judgement, and it says so where it makes it.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs'), cp=require('child_process'), crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..','..');
const F=path.join(__dirname,'restructure.html');
const OUT=process.argv[2]||path.join(__dirname,'measured');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
fs.mkdirSync(OUT,{recursive:true});
const md5=f=>crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex');
const sh=c=>{try{return cp.execSync(c,{cwd:ROOT,stdio:['ignore','pipe','ignore']}).toString().trim();}catch(e){return '';}};
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));

const COUNT=`((whole)=>{const vh=innerHeight,vw=innerWidth;
 const els=[...document.querySelectorAll('a,button,input,select,textarea,[role=button],[role=switch],[tabindex]:not([tabindex="-1"]),summary')]
  .filter(e=>!e.closest('[data-proto]'));
 const shown=e=>{const r=e.getBoundingClientRect(),cs=getComputedStyle(e);
  if(!(r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&+cs.opacity>0.05&&!e.disabled))return false;
  for(let a=e.parentElement;a;a=a.parentElement){const s=getComputedStyle(a);if(s.display==='none'||s.visibility==='hidden'||+s.opacity<=0.05)return false;}
  return true;};
 const inView=e=>{const r=e.getBoundingClientRect();return r.bottom>0&&r.top<vh&&r.right>0&&r.left<vw;};
 const vis=els.filter(e=>shown(e)&&inView(e)), all=els.filter(shown);
 let t='',tw='';const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while((n=w.nextNode())){const el=n.parentElement;if(!el||el.closest('[data-proto]')||el.closest('script,style'))continue;
  const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
  if(!(r.width>0&&cs.visibility!=='hidden'&&+cs.opacity>0.05))continue;
  let hid=false;for(let a=el;a;a=a.parentElement){if(getComputedStyle(a).display==='none'){hid=true;break;}}if(hid)continue;
  tw+=' '+n.textContent; if(r.bottom>0&&r.top<vh)t+=' '+n.textContent;}
 const words=s=>(s.match(/[A-Za-z]{2,}/g)||[]).length;
 /* where the controls in view sit: the bar across the top, the left column,
    the stage, the right column */
 const cols=document.querySelectorAll('.mid>.col'), rc=cols[cols.length-1];
 const reg={top:0,left:0,stage:0,right:0};
 vis.forEach(e=>{if(e.closest('#lcol'))reg.left++;else if(e.closest('#stage'))reg.stage++;else if(rc&&rc.contains(e))reg.right++;else reg.top++;});
 return {controls:vis.length,reg,words:words(t),wholeControls:all.length,wholeWords:words(tw),pageH:document.documentElement.scrollHeight};})()`;

async function boot(b,W,H,hash){
 const p=await b.newPage({viewport:{width:W,height:H}});
 p.errs=[]; p.on('pageerror',e=>p.errs.push(e.message));
 await p.goto('file://'+F+'#'+(hash||'mode=new&who=blank'));
 await p.waitForFunction(()=>document.documentElement.getAttribute('data-rs-ready')==='1',null,{timeout:25000});
 await p.waitForTimeout(900);
 return p;}
const settle=p=>p.waitForTimeout(650);
async function state(p,o){
 await p.evaluate(o=>{
  if(o.mode&&RS.ST.mode!==o.mode){RS.ST.mode=o.mode;RS.apply();}
  if(o.avAt&&RS.ST.avAt!==o.avAt){RS.ST.avAt=o.avAt;RS.apply();}
  if(o.who&&RS.ST.who!==o.who)RS.load(o.who);
  if(o.sec)RS.ST.sumSec=o.sec; if(o.av)RS.ST.avSub=o.av;
  if(o.tab!=null){setTab(o.tab);render();}
  window.scrollTo(0,0); ['sum','lpanel','rpanel','iq','rs-av'].forEach(id=>{const e=document.getElementById(id);if(e)e.scrollTop=0;});},o);
 await settle(p);}

/* the surfaces each layout shows. TAB integers are identity: 0 Story, 1
   Summary, 2 Field, 5 the intake (Energetics today, Avatar proposed). */
const TODAY=[['Field',{tab:2}],['Story',{tab:0}],['Summary',{tab:1}],['Energetics',{tab:5}]];
const NEW=[['Field',{tab:2}],
 ['Summary: Narrative',{tab:1,sec:'narrative'}],['Summary: Energetics',{tab:1,sec:'energetics'}],
 ['Summary: Psyche',{tab:1,sec:'psyche'}],['Summary: Masks',{tab:1,sec:'masks'}],
 ['Summary: Saboteurs',{tab:1,sec:'saboteurs'}],['Summary: Analytics',{tab:1,sec:'analytics'}],
 ['Avatar',{tab:5,av:'avatar'}],['Avatar: Intake',{tab:5,av:'intake'}]];
const PEOPLE=['blank','James','Angela','Derek','Sofia','Diane','Marcus'];

/* ---------- 2. the tasks, done with real clicks ---------- */
/* each step is a selector to press. Before the press the target is found,
   and if it is off the screen the distance to it is recorded and it is
   scrolled to, which is what a person has to do. */
async function press(p,sel,log){
 const info=await p.evaluate(sel=>{const e=document.querySelector(sel); if(!e)return null;
  const r=e.getBoundingClientRect(); const vh=innerHeight;
  const off=r.top<0?-r.top:(r.bottom>vh?r.bottom-vh:0);
  return {off:Math.round(off), shown:r.width>0&&r.height>0};},sel);
 if(!info||!info.shown){log.fail=(log.fail||[]).concat(sel);return false;}
 if(info.off>0){log.scroll+=info.off; await p.evaluate(sel=>document.querySelector(sel).scrollIntoView({block:'center'}),sel); await p.waitForTimeout(250);}
 await p.click(sel,{timeout:5000}).catch(async()=>{await p.evaluate(sel=>document.querySelector(sel).click(),sel);});
 log.taps++; await p.waitForTimeout(500); return true;}
async function reach(p,sel,log){
 const info=await p.evaluate(sel=>{const e=document.querySelector(sel); if(!e)return null;
  const r=e.getBoundingClientRect(); const vh=innerHeight;
  const off=r.top<0?-r.top:(r.top>vh-40?r.top-vh+80:0);
  return {off:Math.round(off), shown:r.width>0&&r.height>0};},sel);
 if(!info||!info.shown){log.fail=(log.fail||[]).concat('reach '+sel);return false;}
 log.scroll+=info.off; return true;}
const TAB_SEL=k=>'.tabtop[data-tabk="'+k+'"]';
const TASKS=[
 {k:'write',who:'blank',nm:'Write an entry and commit it, then see where it landed on the Field',
  today:[['tab',TAB_SEL(0)],['fill','#sttext'],['press','#stapply'],['tab',TAB_SEL(2)]],
  new:[['fill','#rs-ta'],['press','#rs-commit']]},
 {k:'release',nm:'Run a release on the three heaviest, from the Field',
  today:[['tab',TAB_SEL(2)],['press','#bRel']],
  new:[['tab',TAB_SEL(2)],['press','#rs-run']]},
 {k:'analytics',nm:'Reach Analytics',
  today:[['tab',TAB_SEL(1)],['reach','#ana .ab-grid']],
  new:[['tab',TAB_SEL(1)],['press','[data-rs-sec="analytics"]'],['reach','#ana .ab-grid']]},
 {k:'masks',nm:'Reach the masks',
  today:[['tab',TAB_SEL(1)],['reachJs','masks']],
  new:[['tab',TAB_SEL(1)],['press','[data-rs-sec="masks"]'],['reach','#sumbody .s-struct [data-rs="masks"].s-row']]},
 {k:'child',nm:'Move the held slider for the nine child emotions',
  today:[['tab',TAB_SEL(2)],['press','#lpanel .lsec[data-sec="fetters"] .lsec-hd'],['reach','#allCh']],
  new:[['tab',TAB_SEL(1)],['press','[data-rs-sec="psyche"]'],['reach','#allCh']]},
 {k:'numerology',nm:'Read the life path number',
  today:[['tab',TAB_SEL(2)],['press','#lpanel .lsec[data-sec="energetics"] .lsec-hd'],['reach','#spirit']],
  new:[['tab',TAB_SEL(1)],['press','[data-rs-sec="energetics"]'],['reach','#sumbody .s-numer']]},
 {k:'intake',nm:'Start the intake',
  today:[['tab',TAB_SEL(5)],['reach','#iq input[type=text]']],
  new:[['tab',TAB_SEL(5)],['press','[data-rs-av="intake"]'],['reach','#iq input[type=text]']],
  newSum:[['tab',TAB_SEL(1)],['press','[data-rs-sec="avatar"]'],['press','[data-rs-av="intake"]'],['reach','#iq input[type=text]']]},
 {k:'avatar',nm:'See who you said you are becoming, on the avatar',
  today:null,
  new:[['tab',TAB_SEL(5)],['reach','#s4 .r-kick']],
  newSum:[['tab',TAB_SEL(1)],['press','[data-rs-sec="avatar"]'],['reach','#s4 .r-kick']]}];
/* the first mask row in the Summary, found by its heading, in either layout */
const FIND={masks:`(()=>{const st=document.querySelector('#sumbody .s-struct');if(!st)return null;let on=false;
 for(const c of st.children){if(c.classList.contains('pm-eye'))on=/mask/i.test(c.textContent);else if(on)return c;}return null;})()`};
async function reachJs(p,k,log){
 const info=await p.evaluate(src=>{const e=eval(src); if(!e)return null; const r=e.getBoundingClientRect(), vh=innerHeight;
  return {off:Math.round(r.top<0?-r.top:(r.top>vh-40?r.top-vh+80:0)), shown:r.width>0&&r.height>0};},FIND[k]);
 if(!info||!info.shown){log.fail=(log.fail||[]).concat('reach '+k);return false;}
 log.scroll+=info.off; return true;}
async function runTask(p,steps,who){
 const log={taps:0,scroll:0};
 for(const [k,sel] of steps){
  if(k==='tab'){
   const cur=await p.evaluate(sel=>{const b=document.querySelector(sel);return b&&b.getAttribute('aria-pressed')==='true';},sel);
   if(!cur)await press(p,sel,log);}
  else if(k==='press')await press(p,sel,log);
  else if(k==='reach')await reach(p,sel,log);
  else if(k==='reachJs')await reachJs(p,sel,log);
  else if(k==='fill'){
   const line=(STORYBANK.James||[])[2][1];
   /* the box has to be on the screen to be written in, so its distance counts */
   await reach(p,sel,log);
   await p.evaluate(sel=>document.querySelector(sel).scrollIntoView({block:'center'}),sel).catch(()=>{});
   await p.fill(sel,line).catch(()=>{log.fail=(log.fail||[]).concat('fill '+sel);}); await p.waitForTimeout(400);}}
 /* where did it land: the Field shows the change or it does not */
 return log;}

/* ---------- 3. the words ---------- */
const TERMS=['Held','held','Carrying','carrying','Filled in','installed','Installed','cleared','Pending','pending','Imprints',
 'Bank','bank','banked','banking','Vault','vault','released','Released','Commit','Release'];
const WORDS=`(()=>{const T=${JSON.stringify(TERMS)};const txt=document.body.innerText;
 const out={};T.forEach(w=>{const m=txt.match(new RegExp('\\\\b'+w+'\\\\b','g'));if(m)out[w]=m.length;});return out;})()`;

(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const R={prov:{commit:sh('git rev-parse --short HEAD'), proto:md5(F), when:new Date().toISOString(),
  dirtyProto:!!sh('git status --porcelain proto/restructure'),
  build:(fs.readFileSync(F,'utf8').match(/data-build="([^"]+)"/)||[])[1]||'unknown'}, count:[], tasks:[], words:[], entries:[], errors:[]};
 console.log('walk.js  commit '+R.prov.commit+'  restructure.html md5 '+R.prov.proto+'  shipped build inside it '+R.prov.build);

 /* ---------- 1. the count ---------- */
 for(const [W,H] of [[1600,1000],[390,844]]){
  const p=await boot(b,W,H,'mode=new&who=blank');
  for(const who of PEOPLE){
   for(const [mode,list] of [['old',TODAY],['new',NEW]]){
    for(const [nm,o] of list){
     await state(p,Object.assign({mode,who,avAt:'top'},o));
     const c=await p.evaluate(COUNT);
     const row=Object.assign({W,who,mode,surface:nm},c); R.count.push(row);
     console.log(JSON.stringify(row));
     if(['blank','James'].includes(who)&&(nm==='Field'||nm==='Summary'||nm==='Summary: Narrative'||nm==='Summary: Energetics'||nm==='Avatar'||nm==='Story'))await p.screenshot({path:path.join(OUT,`${W}-${mode}-${who}-${nm.replace(/[: ]+/g,'-')}.png`)});}}}
  R.errors.push(...p.errs.map(e=>W+': '+e)); await p.close();}

 /* ---------- 2. the tasks ---------- */
 for(const [W,H] of [[1600,1000],[390,844]]){
  for(const t of TASKS){
   for(const [mode,key,avAt] of [['old','today','top'],['new','new','top'],['new','newSum','summary']]){
    const steps=t[key]; if(steps===undefined&&key==='newSum')continue; if(!steps){R.tasks.push({W,task:t.k,mode:key,na:true});continue;}
    const who=t.who||'James';
    const p=await boot(b,W,H,'mode='+mode+'&who='+who+'&avAt='+avAt+'&tab=2');
    const log=await runTask(p,steps,who);
    /* did the Field show anything for it: the shipped rail's held count, or the bank */
    if(t.k==='write')log.fieldShows=await p.evaluate(()=>({tab:S.tab, held:compute().loaded.length, carrying:compute().carrying.length,
     bankOnScreen:!!document.querySelector('#rs-tick')&&getComputedStyle(document.getElementById('rs-tick')).display!=='none'}));
    const row=Object.assign({W,task:t.k,nm:t.nm,mode:key},log); R.tasks.push(row);
    console.log(JSON.stringify(row));
    R.errors.push(...p.errs.map(e=>'task '+t.k+': '+e)); await p.close();}}}

 /* ---------- 3. the words ---------- */
 {const p=await boot(b,1600,1000,'mode=new&who=James');
  for(const [mode,list] of [['old',[['Field',{tab:2}],['Story',{tab:0}],['Summary',{tab:1}]]],['new',[['Field',{tab:2}],['Summary: Narrative',{tab:1,sec:'narrative'}]]]]){
   for(const [nm,o] of list){await state(p,Object.assign({mode,who:'James'},o));
    const w=await p.evaluate(WORDS); R.words.push({mode,surface:nm,w}); console.log(JSON.stringify({mode,surface:nm,w}));}}
  /* the release card's own last screen, which names the result in the shipped words */
  await state(p,{mode:'new',who:'James',tab:2});
  await p.click('#rs-run'); await p.waitForTimeout(500);
  const go=await p.$('#relgo'); if(go)await go.click();
  await p.waitForFunction(()=>RUN.done===true,null,{timeout:30000}).catch(()=>{});
  await p.waitForTimeout(400);
  const card=await p.evaluate(()=>{const e=document.getElementById('rel');return e?e.innerText.replace(/\s+/g,' ').slice(0,600):'';});
  R.words.push({mode:'new',surface:'release card, done',text:card}); console.log(JSON.stringify({card}));
  await p.close();}

 /* ---------- 4. the entries ---------- */
 /* blank: a stranger, every line of their own bank in order, from a fresh
    record each time. own: their reference field, and the first line of their
    bank the sniffer reads. Both commit where the journal allows it and run
    one release, on the first commit that makes one possible. */
 const ICP=['Sofia','Diane','Marcus','Angela','Derek','James'];
 const snap=()=>({bank:RS.bankList().length,above:compute().loaded.length,dq:Math.round(compute().DQ*10)/10,vault:RS.vaultList().length});
 for(const start of ['blank','own']){
  const p=await boot(b,1600,1000,'mode=new&who=blank');
  for(const nm of ICP){
   await p.evaluate(w=>{RS.load(w);setTab(TAB.FIELD);render();},start==='blank'?'blank':nm); await settle(p);
   let lines=(STORYBANK[nm]||[]).map(x=>x[1]);
   if(start==='own'){const ix=await p.evaluate(L=>L.findIndex(t=>parseStory(t).imprints.length>0),lines); lines=ix>=0?[lines[ix]]:[];}
   let released=false;
   for(let i=0;i<lines.length;i++){
    await p.fill('#rs-ta',lines[i]); await p.waitForTimeout(350);
    const typed=await p.evaluate(()=>({pending:(document.getElementById('rs-impn').hidden?0:+document.getElementById('rs-impn').textContent),
     read:ST_PARSED?ST_PARSED.hits.length:0, canCommit:!document.getElementById('rs-commit').disabled,
     ai:document.getElementById('rs-ai-body').innerText.replace(/\s+/g,' ')}));
    const b0=await p.evaluate(snap);
    let after=null, rel=null;
    if(typed.canCommit){
     await p.click('#rs-commit'); await p.waitForTimeout(700);
     after=await p.evaluate(snap);
     after.canRelease=await p.evaluate(()=>!!document.getElementById('rs-run'));
     after.ai=await p.evaluate(()=>document.getElementById('rs-ai-body').innerText.replace(/\s+/g,' '));
     if(after.canRelease&&!released){released=true;
      await p.click('#rs-run'); await p.waitForTimeout(400);
      const go=await p.$('#relgo'); if(go)await go.click();
      await p.waitForFunction(()=>RUN.done===true,null,{timeout:30000}).catch(()=>{});
      await p.evaluate(()=>relClose()); await p.waitForTimeout(600);
      rel=await p.evaluate(snap);
      rel.ai=await p.evaluate(()=>document.getElementById('rs-ai-body').innerText.replace(/\s+/g,' '));}}
    else await p.fill('#rs-ta','');
    const row={start,who:nm,line:i+1,text:lines[i],typed,before:b0,after,release:rel};
    R.entries.push(row); console.log(JSON.stringify(row));}}
  R.errors.push(...p.errs.map(e=>'entries: '+e)); await p.close();}

 await b.close();
 fs.writeFileSync(path.join(OUT,'walk.json'),JSON.stringify(R,null,1));
 console.log('errors: '+JSON.stringify(R.errors));
 console.log('wrote '+path.join(OUT,'walk.json'));
})();
