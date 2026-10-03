/* CAPTURE, FEATHERS. The laws of every reference profile, off the live build,
   so no feather in feathers.html is a length somebody chose.

   Writes data-feathers.js beside this file. The stage itself still stands on
   data-james.js, which capture.js writes; James is read from there by the page
   so the stage and the ladder can never show two different Jameses.

   What is read, per profile, and where it comes from in the engine:
     v     lawNow(nm)   the law as coherence reads it: the answer plus whatever
                        releases at its seat have since closed. compute.js:149
     ans   S.law[nm]    the answer alone
     in    lawIn(nm)    whether the law was answered at all. compute.js:55
     CQ    cqSum()      the 21 laws over 210, times 100. compute.js:151
   plus the tier and its colour, and the range the coherence scale draws.

   One constructed state is added and it is named as one: the blank profile
   taken seven laws into the sixty three questions through the intake's own
   path (iqApply), so the page can show what an unanswered law looks like
   beside answered ones. The answers are fixed below and are not a person.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-rings/capture-feathers.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs'),crypto=require('crypto'),cp=require('child_process');
const DIR=__dirname;
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async()=>{
 const src=path.resolve('source.html');
 const md5=crypto.createHash('md5').update(fs.readFileSync(src)).digest('hex');
 let commit='unknown';
 try{commit=cp.execSync('git rev-parse --short HEAD').toString().trim()+
  (cp.execSync('git status --short').toString().trim()?' (tree dirty)':'');}catch(e){}
 const b=await chromium.launch({executablePath:EXE});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+src);
 await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000});
 await p.waitForTimeout(300);
 const out=await p.evaluate(()=>{
  const r2=x=>Math.round(x*1000)/1000;
  function read(tag){
   const r=compute();
   const cq=Math.max(0,Math.min(100,r.CQ)),sw=1-cq/100,bp=2.5+sw*sw*26;
   return {nm:tag.nm, role:tag.role||'', idx:tag.idx, constructed:!!tag.constructed,
    CQ:r2(r.CQ), cqSum:r2(cqSum()), tier:r.tier||null,
    tierCol:(r.tier&&TIERCOL[r.tier])||null, unread:!!r.unread, complete:!!r.complete,
    range:{lo:r2(Math.max(0,cq-bp/2)),hi:r2(Math.min(100,cq+bp/2))},
    laws:SI.map(l=>({nm:l.nm, b:l.b, v:r2(lawNow(l.nm)), ans:r2(S.law[l.nm]), in:!!lawIn(l.nm)}))};}
  const rows=[];
  PEOPLE.forEach((pp,i)=>{loadP(i);rows.push(read({nm:pp.nm,role:pp.role,idx:i}));});
  /* the constructed state: the blank profile, seven laws answered through the
     intake's own path. Three answers per law, left, right, neutral. */
  let blank=PEOPLE.findIndex(pp=>pp.nm==='You');
  let mid=null;
  if(blank>=0){
   loadP(blank);
   if(CURP){
    CURP.intake=CURP.intake||{answers:{},done:[]};
    CURP.intake.answers=CURP.intake.answers||{};
    const A=[[7,5,6],[3,2,4],[6,6,5],[8,7,7],[4,3,5],[5,4,4],[2,3,2]];
    A.forEach((t,li)=>t.forEach((v,k)=>{CURP.intake.answers[li*3+k]=v;}));
    iqApply(CURP);
    mid=read({nm:'Seven laws in',role:'the blank profile, seven laws into the sixty three questions',idx:blank,constructed:true});
   }
  }
  const seatN={};W.forEach(n=>{seatN[n.b]=(seatN[n.b]||0)+1;});
  return {rows, mid, seatN, liftR:LIFT_R, pal:PAL, siIc:SI.map(l=>({nm:l.nm,ic:l.ic})),
   seatGlyph:SEATGLYPH, names:PEOPLE.map(pp=>pp.nm)};});
 out.build={commit, md5};
 fs.writeFileSync(path.join(DIR,'data-feathers.js'),
  '/* Written by capture-feathers.js off the live build. Do not edit by hand: run it again. */\n'
  +'window.FEATHERS='+JSON.stringify(out)+';\n');
 console.log('build',commit,'md5',md5);
 console.log('names',out.names.join(', '));
 out.rows.concat(out.mid?[out.mid]:[]).forEach(r=>{
  const g=r.laws.reduce((a,l)=>a+(l.in?10-l.v:10),0);
  console.log((r.nm+(r.constructed?' *':'')).padEnd(16),'CQ',String(r.CQ).padEnd(7),'cqSum',String(r.cqSum).padEnd(7),
   (r.tier||'-').padEnd(12),'unread',r.unread,'answered',r.laws.filter(l=>l.in).length,
   'gap',g.toFixed(2),'2.1x(100-CQ)',(2.1*(100-r.cqSum)).toFixed(2));});
 console.log('seats',JSON.stringify(out.seatN),'LIFT_R',out.liftR);
 console.log(errs.length?'JS ERRORS '+errs.join(' | '):'no JS errors');
 await b.close();
})();
