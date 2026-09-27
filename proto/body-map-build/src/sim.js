/* Simulates the three switches, measured, then runs them past the panel.
   NODE_PATH=<playwright> node proto/body-map-build/src/sim.js
   Reads the built body-map.html, writes src/sim.json. Rebuild after, so the
   page carries the result.

   WHAT IS MEASURED, off the pixels on screen at 1600 by 1000, heat fully up:
     minStepDE     the smallest colour step between two neighbouring painted
                   levels on a ladder of 2, 4, 6, 8, 10 (CIE Lab distance).
                   About 2.3 is the least a person can see; 10 reads at a
                   glance.
     clutterSdL    lightness noise inside a painted cell: the nerves drawn
                   over the heat. The more of it, the harder the level reads.
     nerveInHeat   a nerve against its own ground under the pain, contrast
                   ratio. Does the heat show which nerve carries it.
     nerveOutHeat  the same away from the pain. Can a person still find
                   their way round the body.
     heat90        ms until the heat is 90 percent up, off the switch's curve.
     settled       ms until the switch has finished.
     frame         median ms of main thread per frame, running.

   THE TOOL IS CHECKED FIRST, on a case whose answer is known: a control
   switch that dims nothing. Its nerve contrast away from the pain must match
   the Pattern frame's own, and every ladder step must be above zero. If
   either fails, nothing below it is written.

   THE PANEL. The six ICPs in PRODUCT.md, at their stated weights of 1,000.
   Each is scored on the four measures, weighted by what their own words in
   the roster say they come for. That is the team's model of them, and the
   weights are printed beside the result so they can be argued with. */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const FILE=path.join(__dirname,'..','body-map.html');
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
(async()=>{
 const b=await chromium.launch();
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));
 await p.goto('file://'+FILE);await p.waitForTimeout(1200);
 const run=async k=>p.evaluate(k=>{const P=__proto;P.setVariant(k);const cells=P.ladder();const m=P.measure(cells);m.tl=P.timeline(k==='Z'?'A':k);return m;},k);
 /* the known case */
 const base=await p.evaluate(()=>{const P=__proto,V=P.VAR;V.Z=Object.assign({},V.A,{dull:{nerve:.62,nsat:.8,seat:.9,ssat:1,grid:.8,addr:1,sab:1}});return true;});
 const Z=await run('Z');
 const patt=await p.evaluate(()=>{const P=__proto;P.setVariant('Z');P.ladder();
  /* Pattern: no heat, no dulling. Measured the same way. */
  const S=P.S;const m=P.measure([{c:10,r:8,val:2},{c:10,r:10,val:4},{c:10,r:12,val:6},{c:10,r:14,val:8},{c:10,r:16,val:10}],true);return m;});
 const ok=Z.stepsDE.every(x=>x>0)&&Z.nerveOutHeat&&Math.abs(Z.nerveOutHeat-patt.nerveOutHeat)<0.05;
 console.log('  control: nerve away from pain, no dimming '+Z.nerveOutHeat.toFixed(3)+' against pattern '+patt.nerveOutHeat.toFixed(3)+'; ladder steps '+Z.stepsDE.map(x=>x.toFixed(1)).join(' ')+(ok?'  PASS':'  FAIL'));
 if(!ok){console.error('  the measuring tool failed its known case; nothing written');process.exit(1);}
 const out={when:'Measured '+new Date().toISOString().slice(0,10),w:1600,h:1000,v:{},control:{nerveOutHeat:Z.nerveOutHeat,pattern:patt.nerveOutHeat}};
 for(const k of ['A','B','C','D']){
  const m=await run(k);
  /* frame cost, running with motion on the heaviest mock person */
  const fr=await p.evaluate(async k=>{const P=__proto;P.setPerson('Ana');P.setVariant(k);P.S.mode='pattern';P.setMode('pain');
   const t=[];let last=performance.now();await new Promise(r=>{let n=0;function f(){const now=performance.now();t.push(now-last);last=now;if(++n<120)requestAnimationFrame(f);else r();}requestAnimationFrame(f);});
   return P.frameMs();},k);
  out.v[k]={minStepDE:m.minStepDE,stepsDE:m.stepsDE,clutterSdL:m.clutterSdL,nerveInHeat:m.nerveInHeat,nerveOutHeat:m.nerveOutHeat,
   nIn:m.nInHeat,nOut:m.nOutHeat,topVsMan:m.topVsMan,heat90:m.tl.heat90,settled:m.tl.settled,frame:fr};
  console.log('  '+k+' '+JSON.stringify(out.v[k],(kk,v)=>typeof v==='number'?+v.toFixed(3):v));}
 out.metricsInfo={
  minStepDE:{nm:'Smallest step between painted levels',dp:1,why:'colour distance between neighbouring levels, 2 to 10. About 2.3 is the least a person sees; 10 reads at a glance'},
  clutterSdL:{nm:'Nerve noise inside a painted cell',dp:1,why:'lightness spread inside one level. Lower means the level reads clean'},
  nerveInHeat:{nm:'Nerve under the pain, against its ground',dp:2,why:'contrast ratio. Higher shows which nerve carries the pain'},
  nerveOutHeat:{nm:'Nerve away from the pain, against its ground',dp:2,why:'contrast ratio. Enough to stay oriented; Pattern itself reads '+patt.nerveOutHeat.toFixed(2)},
  heat90:{nm:'Heat 90 percent up, ms',dp:0,why:'off the switch\'s own curve'},
  settled:{nm:'Switch finished, ms',dp:0,why:'the ground and the heat both landed'},
  frame:{nm:'Frame cost, ms',dp:2,why:'main thread, running, heaviest mock person. Headless and without a GPU, so pessimistic'}};
 /* the panel */
 const PANEL=[
  {nm:'Diane',age:46,role:'founder, second company',pw:180,says:'Rest feels like a moral failure',w:{level:.35,route:.15,orient:.15,speed:.35}},
  {nm:'Derek',age:39,role:'high performer, endurance',pw:170,says:'Pain is information',w:{level:.40,route:.30,orient:.10,speed:.20}},
  {nm:'Marcus',age:44,role:'creative director',pw:160,says:'I can see what is wrong with anything in four seconds',w:{level:.45,route:.15,orient:.15,speed:.25}},
  {nm:'Angela',age:36,role:'seeker, six modalities',pw:150,says:'Everything happens for a reason',w:{level:.15,route:.45,orient:.25,speed:.15}},
  {nm:'Sofia',age:41,role:'somatic practitioner',pw:140,says:'I hold the room for everyone',w:{level:.20,route:.35,orient:.35,speed:.10}},
  {nm:'James',age:57,role:'C-suite, third turnaround',pw:100,says:'I make the call',w:{level:.40,route:.10,orient:.10,speed:.40}}];
 const norm=k=>{const m=out.v[k];return {
  level:clamp(m.minStepDE/10,0,1)*.7+clamp(1-m.clutterSdL/12,0,1)*.3,
  route:clamp((m.nerveInHeat-1)/2,0,1),
  orient:clamp((m.nerveOutHeat-1)/(patt.nerveOutHeat-1),0,1),
  speed:clamp(1-(m.heat90-200)/800,0,1)};};
 const N={A:norm('A'),B:norm('B'),C:norm('C'),D:norm('D')};out.norm=N;
 out.panel=PANEL.map(pp=>{const s={};['A','B','C','D'].forEach(k=>{s[k]=Object.keys(pp.w).reduce((a,c)=>a+pp.w[c]*N[k][c],0);});
  const pick=Object.keys(s).sort((a,b)=>s[b]-s[a])[0];return Object.assign({},pp,{s,pick});});
 const tw=PANEL.reduce((a,x)=>a+x.pw,0);
 out.total={};['A','B','C','D'].forEach(k=>{out.total[k]=out.panel.reduce((a,x)=>a+x.pw*x.s[k],0)/tw;});
 const order=['A','B','C','D'].sort((a,b)=>out.total[b]-out.total[a]);out.total.pick=order[0];
 const picks=out.panel.reduce((o,x)=>{o[x.pick]=(o[x.pick]||0)+x.pw;return o;},{});
 const nm={A:'A, Fade',B:'B, Reveal',C:'C, Isotherm',D:'D, Bands and reveal'};
 const V=out.v;
 out.verdict='The panel, weighted, lands on '+nm[order[0]]+' at '+out.total[order[0]].toFixed(3)+', then '+nm[order[1]]+' at '+out.total[order[1]].toFixed(3)+', '+nm[order[2]]+' at '+out.total[order[2]].toFixed(3)+' and '+nm[order[3]]+' at '+out.total[order[3]].toFixed(3)+'. '
  +Object.keys(picks).map(k=>nm[k]+' is the first pick of '+picks[k]+' of the '+tw+' weight').join('; ')+'. '
  +'Under the pain, a nerve reads at '+V.A.nerveInHeat.toFixed(2)+' to 1 on A, '+V.B.nerveInHeat.toFixed(2)+' on B, '+V.C.nerveInHeat.toFixed(2)+' on C and '+V.D.nerveInHeat.toFixed(2)+' on D. '
  +'Away from it, '+V.A.nerveOutHeat.toFixed(2)+', '+V.B.nerveOutHeat.toFixed(2)+', '+V.C.nerveOutHeat.toFixed(2)+' and '+V.D.nerveOutHeat.toFixed(2)+', against '+patt.nerveOutHeat.toFixed(2)+' in Pattern. '
  +'The smallest step between painted levels is '+V.A.minStepDE.toFixed(1)+', '+V.B.minStepDE.toFixed(1)+', '+V.C.minStepDE.toFixed(1)+' and '+V.D.minStepDE.toFixed(1)+'.';
 fs.writeFileSync(path.join(__dirname,'sim.json'),JSON.stringify(out,null,1));
 console.log('  '+out.verdict);console.log('  errors '+errs.length);
 await b.close();})();
