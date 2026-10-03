/* capture.js. Reads the reference profiles off the live build and writes
   data.js, so every mockup in this folder draws engine numbers and nothing
   typed in by hand.

   Run from the repo root, with NODE_PATH at a playwright install:
     node proto/compass-redesign/capture.js

   WHAT IS READ, and from where.
     compute()            CQ, DQ, the tier, integrity, as the Field reads them
     S.law, lawLift()     each of the 21 laws, engine/compute.js
     W, mirrorAt()        the eight mirror positions, the way ui/cone.js
                          places its nodes, engine/data/compass.js
     TIERCOL, PAL         the colours, engine/data/canon.js

   WHAT IS PROJECTED, and it is labelled as a projection everywhere it shows.
   A reference case cannot run a release (ui/release.js refuses it), so the
   later stages are the engine's own release arithmetic applied here, with
   nothing new in it:
     a run            the six heaviest addresses that carry a fetter, crossed
                      with the four channels: 24 patterns, under RUN_MAX 25
                      (engine/plan.js), the shape meterPlan builds
     the charge       relCoolDown's own three lines (ui/release.js): 21
                      percent of the weight plus 2 off the fetter, 62 percent
                      of it installed as the opposite
     the laws         releaseWork's rule (engine/compute.js): every pattern
                      of new ground lifts each law at its address's seat by
                      LIFT_R of the distance left, through the engine's own
                      lawLift. Ground caps at 200 patterns an address, and a
                      rerun of opened ground moves nothing.
   The stages are 0, one run, 1,000 patterns and 15,000 patterns. 15,000 is
   the owner's own figure: "I had about 15,000 patterns for my CQ."

   THE PROBE IS CHECKED AGAINST THE ENGINE FIRST. Stage 0's CQ is computed
   here from lawLift and compared with compute().CQ; a mismatch stops the
   run rather than writing a number the product would not print. */
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const {execSync}=require('child_process');
const WHO=['Abraham','Sofia','Marcus','James'];
const STAGES=[0,24,1000,15000];
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1200,height:800}});
 await p.goto('file://'+path.resolve('source.html'));
 await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}).catch(()=>{});
 const out=await p.evaluate(({WHO,STAGES})=>{
  const tierOf=cq=>{const t=TIERDEF.find(x=>cq>=x.at)||TIERDEF[TIERDEF.length-1];return t.nm;};
  const res={people:[],laws:SI.map(l=>({nm:l.nm,b:l.b,ic:l.ic})),
   mirror:MIRROR.map(m=>({k:m.k,q:m.q,seat:m.seat,up:m.up,dn:m.dn,ic:m.ic,dic:m.dic})),
   seats:BANDS.slice(),seatGlyph:SEATGLYPH,pal:PAL,tiercol:TIERCOL,
   tiers:TIERDEF.map(t=>({nm:t.nm,at:t.at})),liftR:LIFT_R,halo:GL_HALO,fork:GL_FORK};
  /* THE SEAT SECTORS ARE THE FIELD'S OWN BEARINGS. engine/core.js sets each
     address at i/108 of a turn from twelve o'clock, clockwise, in seat order,
     so a seat's stretch of the wheel is read off the addresses that sit in it.
     A compass drawn on these bearings puts every seat where the Field has it. */
  res.sector={};BANDS.forEach(bb=>{const ix=W.map((n,j)=>n.b===bb?j:-1).filter(j=>j>=0);
   const lo=Math.min(...ix),hi=Math.max(...ix);
   if(hi-lo+1!==ix.length)throw new Error('seat '+bb+' is not contiguous on the wheel');
   res.sector[bb]={t0:lo/W.length,t1:(hi+1)/W.length};});
  WHO.forEach(nm=>{
   const i=PEOPLE.findIndex(x=>x.nm===nm); loadP(i);
   const r0=compute();
   const answers={}; SINAMES.forEach(l=>answers[l]=S.law[l]);
   const allIn=SINAMES.every(l=>lawIn(l));
   const ch0=Object.assign({},S.charge), rp0=Object.assign({},S.replace);
   const work={}; SINAMES.forEach(l=>work[l]=0);
   const ground={}; let spent=0;
   const snap=(patterns)=>{
    const r=compute();
    const raw=SI.map(l=>lawLift(answers[l.nm],work[l.nm]));
    const cq=raw.reduce((a,v,j)=>a+(lawIn(SI[j].nm)?v:0),0)/210*100;
    const laws=raw.map(v=>+v.toFixed(4));
    const seatIg={};BANDS.forEach(bb=>{const g=SI.map((l,j)=>l.b===bb?laws[j]:null).filter(v=>v!=null);
      seatIg[bb]=g.length?g.reduce((a,v)=>a+v,0)/g.length:0;});
    const mirror=MIRROR.map(m=>{const grp=W.filter(n=>n.b===m.seat);
      const load=grp.length?grp.reduce((a,n)=>a+n.sq,0)/grp.length:0;
      return {pos:mirrorAt(load,seatIg[m.seat]),load:+load.toFixed(3)};});
    const mean=laws.reduce((a,v)=>a+v,0)/laws.length;
    const sd=Math.sqrt(laws.reduce((a,v)=>a+(v-mean)*(v-mean),0)/laws.length);
    return {patterns,cqRaw:cq,cq:+cq.toFixed(3),tier:tierOf(cq),dq:+(+r.DQ||0).toFixed(2),laws,
     seatIg:Object.fromEntries(Object.entries(seatIg).map(([k,v])=>[k,+v.toFixed(4)])),
     mirror,spread:+sd.toFixed(4),mean:+mean.toFixed(4),held:+(r.EX!=null?r.EX:0).toFixed(3)};};
   const stages=[]; 
   const s0=snap(0);
   if(Math.abs(s0.cqRaw-r0.CQ)>1e-9)throw new Error('probe disagrees with compute() for '+nm+': '+s0.cqRaw+' vs '+r0.CQ);
   delete s0.cqRaw; stages.push(s0);
   let target=1;
   while(target<STAGES.length){
    /* one run: the six heaviest addresses carrying a fetter, ground left */
    const q=W.filter(n=>n.cf&&(ground[n.i]||0)<200).sort((a,c)=>c.sq-a.sq||a.i-c.i).slice(0,6);
    if(!q.length)break;
    q.forEach(n=>{
     const w0=n.sq*10, d=-Math.round(w0*0.21+2);
     const share=Math.abs(d)/10/Math.max(1,q.filter(x=>x.cf===n.cf).length);
     S.charge[n.cf]=clamp((S.charge[n.cf]||0)-share,0,10);
     S.replace[n.cf]=clamp((S.replace[n.cf]||0)+share*0.62,0,10);});
    q.forEach(n=>{const fresh=Math.min(4,200-(ground[n.i]||0));ground[n.i]=(ground[n.i]||0)+fresh;spent+=fresh;
     SI.forEach(l=>{if(l.b===n.b&&lawIn(l.nm))work[l.nm]+=fresh;});});
    compute();
    if(spent>=STAGES[target]){const sn=snap(spent);delete sn.cqRaw;stages.push(sn);target++;}}
   /* put the reference case back exactly as it was */
   Object.assign(S.charge,ch0);Object.assign(S.replace,rp0);loadP(i);
   res.people.push({nm,age:PEOPLE[i].age,role:PEOPLE[i].role,allIn,cq0:r0.CQ,ig:r0.Ig,stages});});
  return res;},{WHO,STAGES});
 let commit='unknown',md5='unknown';
 try{commit=execSync('git rev-parse --short HEAD').toString().trim();}catch(e){}
 try{md5=execSync('md5sum source.html').toString().split(' ')[0];}catch(e){}
 out.from={commit,md5,taken:new Date().toISOString().slice(0,10)};
 fs.writeFileSync(path.join(__dirname,'data.js'),
  '/* written by capture.js from the live build. do not edit by hand. */\nvar CX='+JSON.stringify(out)+';\n');
 out.people.forEach(pp=>console.log(pp.nm,pp.stages.map(s=>s.patterns+': CQ '+s.cq.toFixed(2)+' spread '+s.spread.toFixed(3)+' mirror '+s.mirror.map(m=>m.pos).join('/')).join(' | ')));
 await b.close();})();
