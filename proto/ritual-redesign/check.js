/* check.js. Every write on the ritual page, driven in a real browser against
   the build, with the record and the store read back after each one.

   Run from the repo root:
     NODE_PATH=<playwright> node proto/ritual-redesign/check.js [source.html]

   Screenshots say what a page looks like. They do not say that Stop leaves the
   days done on the record, that a deletion comes back where it was, or that a
   save which failed put everything back. This does, and it exits non zero on
   the first thing that is not so. It was written after a screenshot caught a
   merge that ended a five week ritual, which no gate here would have seen. */
const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve(process.argv[2]||process.env.ATUNED_FILE||'source.html');
(async()=>{
 const b=await chromium.launch({executablePath:process.env.PW_CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(FILE);
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}
 const res=await p.evaluate(()=>{
  const out=[]; const ok=(c,m)=>out.push([!!c,m]);
  const D=86400000, iso=d=>new Date(Date.now()-d*D).toISOString(), today=pracDay(Date.now());
  const act=()=>ritPlans().filter(x=>ritActive(x,today));
  const press=(sel)=>{const e=document.querySelector(sel); if(e)e.click(); return !!e;};
  setTab(TAB.RITUAL); ritRender();
  ok(S.who===0&&ritOwn(),'the page opens on the person\'s own record');
  ok(!!document.getElementById('ritwhen')&&document.getElementById('ritwhen').maxLength===RIT_PLAN_MAX,
   'nothing active, so the builder is open and when carries the boundary\'s cap');

  /* start */
  const called=ritFor(compute()).called.k;
  ok(ritDraft().join()===called,'the builder holds the called practice and nothing else, got '+ritDraft().join());
  RIT.when='after coffee'; RIT.days=7; press('#ritsave');
  let A=act()[0];
  ok(act().length===1&&A.steps.join()===called&&A.days===7&&A.when==='after coffee','Start writes one active ritual with its plan');
  let e=ritEntryFor(A,today);
  ok(e&&e.x.done===false,'and today goes on the record as set, not done, as Save ritual wrote before');
  ok(validateProfile(JSON.parse(JSON.stringify(saveProfile(CURP)))).ok,'the record still passes the boundary');

  /* log, take off */
  press('[data-act=log][data-id="'+A.id+'"]');
  e=ritEntryFor(A,today); ok(e&&typeof e.x.done==='string','the ring marks today done with a stamp');
  press('[data-act=log][data-id="'+A.id+'"]');
  e=ritEntryFor(A,today); ok(e&&e.x.done===false,'the same press takes it off, and the day it started keeps its entry as set');

  /* yesterday, and nothing older. Backdate the start so the plan covers both. */
  const all=JSON.parse(STORE.get(RIT_KEY)); all[CURP.id][0].from=iso(5); STORE.set(RIT_KEY,JSON.stringify(all));
  A=act()[0]; const n0=CURP.rituals.length;
  ritLog(A.id,today-1); e=ritEntryFor(A,today-1);
  ok(e&&typeof e.x.done==='string'&&pracDay(e.x.t)===today-1,'yesterday can be marked done and lands on yesterday');
  ritLog(A.id,today-1);
  ok(!ritEntryFor(A,today-1)&&CURP.rituals.length===n0,'taking yesterday off removes the entry, so the streak cannot count it');
  ritLog(A.id,today-3);
  ok(!ritEntryFor(A,today-3),'three days back cannot be marked, the record is not rewritable at will');

  /* a second ritual, move up, stop */
  RIT.add=true; RIT.sel={}; RIT.order=[]; ritPick('slow'); RIT.days=0; ritStart(ritFor(compute()));
  let L=act(); ok(L.length===2&&L[1].steps[0]==='slow'&&L[1].days===0,'a second ritual with no end joins the list at the bottom');
  ritMove(L[1].id); L=act(); ok(L[0].steps[0]==='slow','Move up puts it first');
  ritLog(L[0].id); ritStop(L[0].id);
  ok(act().length===1&&ritPlans().some(x=>x.stop&&x.steps[0]==='slow'),'Stop takes it off Active and keeps it as ended');
  ok(ritEntries(today).some(x=>x.x.steps[0]==='slow'&&typeof x.x.done==='string'),'and the day it was done stays on the record');

  /* delete an entry, put it back */
  const k=CURP.rituals.length, i=CURP.rituals.findIndex(x=>x.steps[0]==='slow');
  const was=JSON.stringify(CURP.rituals[i]);
  ritDelEntry(i); ok(CURP.rituals.length===k-1&&RIT.gone&&RIT.gone.kind==='entry','Delete removes the entry and holds it');
  ok(!!document.querySelector('[data-act=putback]'),'and offers it back on the page');
  press('[data-act=putback]');
  ok(CURP.rituals.length===k&&JSON.stringify(CURP.rituals[i])===was&&!RIT.gone,'Put back restores it where it was');

  /* delete a plan, put it back */
  const ended=ritPlans().filter(x=>x.stop)[0], np=ritPlans().length;
  ritDelPlan(ended.id); ok(ritPlans().length===np-1,'an ended ritual can be deleted');
  ritPutBack(); ok(ritPlans().length===np&&ritPlans().some(x=>x.id===ended.id),'and put back');

  /* edit: a span chosen now runs from today and never ends an old ritual */
  A=act()[0]; ritEditOpen(A.id); RIT.days=7; RIT.where='the chair'; ritSaveEdit(); A=act()[0];
  ok(A&&A.where==='the chair'&&ritActive(A,today)&&ritStart0(A)+A.days-today===7,
   'Edit to a week on a ritual five days old runs a week from today, got '+(A&&(ritStart0(A)+A.days-today)));

  /* the release schedule merges into a matching ritual and only lengthens it */
  CURP.avatar={built:true,at:iso(3),reviewedAt:null,pairs:[{be:'I speak to the room',notbe:'Someone who is scared of being judged when he speaks'}]};
  const bc=ritBecoming();
  ok(bc===null||(bc.n&&bc.n.sq>=4&&bc.n.b===bc.seat),'the becoming names a held place at its own seat, or nothing');
  const all2=JSON.parse(STORE.get(RIT_KEY)); all2[CURP.id].push({id:'rOld',steps:['box'],when:'',where:'',days:0,from:iso(36),stop:null,band:'Root',track:'Body'});
  STORE.set(RIT_KEY,JSON.stringify(all2));
  const fake={be:'x',seat:'Root',n:{i:12,k:'Compulsion'}};
  const before=act().length; ritStartFor(fake,7);
  const old=ritPlans().filter(x=>x.id==='rOld')[0]||ritPlans().filter(x=>x.steps.join()==='box')[0];
  ok(act().length>=before&&old&&ritActive(old,today),'a week set on a ritual with no end does not end it');
  const old7={id:'rOld7',steps:['heartpt'],when:'',where:'',days:40,from:iso(36),stop:null,band:'Heart',track:'Energy'};
  const all3=JSON.parse(STORE.get(RIT_KEY)); all3[CURP.id].push(old7); STORE.set(RIT_KEY,JSON.stringify(all3));
  ritStartPlan({steps:['heartpt'],band:'Heart',days:7});
  const o7=ritPlans().filter(x=>x.id==='rOld7')[0];
  ok(o7&&ritActive(o7,today)&&ritStart0(o7)+o7.days-today>=7,'and a week set on one with four days left runs a week from today');
  ok(ritPlans().every(ritPlanOk),'every stored plan still passes the store\'s own check');
  const vEnd=validateProfile(JSON.parse(JSON.stringify(saveProfile(CURP))));
  ok(vEnd.ok,'after every write above, the record still passes the boundary'
   +(vEnd.ok?'':': '+JSON.stringify(vEnd.errors||vEnd.errs||vEnd).slice(0,200)));

  /* a save that fails puts everything back and says so */
  const snapR=JSON.stringify(CURP.rituals), snapP=STORE.get(RIT_KEY), real=pSave;
  pSave=function(){return false;};
  const r=ritWrite(function(plans){CURP.rituals.push({t:new Date().toISOString(),steps:['box'],min:5,done:false,band:'',track:'Body',when:'',where:''}); plans.pop(); return plans;},'x');
  pSave=real;
  ok(r===false&&JSON.stringify(CURP.rituals)===snapR&&STORE.get(RIT_KEY)===snapP,'a failed save changes nothing, record or store');
  ok(/Could not save/.test((document.getElementById('status')||{}).textContent||''),'and says it could not save');

  /* a worked example is read only */
  const nR=JSON.stringify(CURP&&CURP.rituals);
  loadP(5); setTab(TAB.RITUAL); ritOpen(null);
  ok(!ritOwn(),'a worked example is not the person\'s record');
  ok(/worked example/.test(document.querySelector('.rv-note')?document.querySelector('.rv-note').textContent:''),'and the page says nothing here is saved');
  const cx=CURP, cr=JSON.stringify(cx.rituals||[]);
  press('#ritsave');
  ok(JSON.stringify(cx.rituals||[])===cr,'Start on a worked example writes nothing to it');
  ok(/worked example/.test((document.getElementById('status')||{}).textContent||''),'and the status says why');
  return out;});
 let bad=0;
 res.forEach(([g,m])=>{if(!g)bad++; console.log((g?'  ok   ':'  FAIL ')+m);});
 if(errs.length){bad++; console.log('  FAIL page errors: '+errs.join(' | '));}
 console.log('\n'+(res.length-bad+(errs.length?0:0))+' passed, '+bad+' failed');
 await b.close(); process.exit(bad?1:0);})();
