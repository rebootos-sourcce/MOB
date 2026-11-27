/* ============================================================
   CAN THE HEAVIEST THING BE PRESSED. The shelf's whole model is "press
   anything and the shelf opens on it", so it is only as good as what a press
   can reach. For each of the six ICPs, with their own stories committed,
   this samples a 17 by 17 grid over each of their four heaviest addresses'
   own drawn segment on the Wheel and asks the product's own hitTest what a
   press there would open. The share that answers as that address is the
   share of it a person can actually press. Everything else answers as
   whatever is drawn on top of it: a saboteur bead, or the seat band.

   Checked against a known good case first, as the house rule asks: at 1600
   an address with nothing drawn over it (Addiction, on James) reads 71%, and
   the 29% it loses is the seat band every segment shares. So 71% is the
   ceiling, not 100, and every number below reads against it.

     NODE_PATH=/opt/node22/lib/node_modules node proto/icp-review/reach.js
   ============================================================ */
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const ROOT=path.resolve(__dirname,'..','..');
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const ICPS=['Sofia','Diane','Marcus','Angela','Derek','James'];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const out={};
 for(const [Wd,H] of [[1600,1000],[390,844]]){
  const ctx=await b.newContext({viewport:{width:Wd,height:H},hasTouch:Wd<600,isMobile:Wd<600});const p=await ctx.newPage();
  await p.goto('file://'+path.join(ROOT,'proto','shelf','shelf.html#blank'));
  await p.waitForFunction(()=>document.documentElement.getAttribute('data-shelf-ready')==='1',null,{timeout:25000});
  for(const who of ICPS){
   const lines=STORYBANK[who].map(x=>x[1]);
   const r=await p.evaluate(({who,lines})=>{const i=PEOPLE.findIndex(q=>q.nm===who);loadP(i);
    lines.forEach(t=>{applyStory(t);verpApply(t);if(typeof leanApply==='function')leanApply(t);});
    fviewSet('wheel');setTab(TAB.FIELD);render();
    return new Promise(res=>setTimeout(()=>{
     const held=W.filter(n=>n.sq>0).sort((a,b)=>b.sq-a.sq).slice(0,4);
     res(held.map(n=>{const h=HIT.filter(h=>h.k==='node'&&h.n&&h.n.i===n.i).pop();
      if(!h||h.x!==undefined)return {k:n.k,sq:+n.sq.toFixed(1),note:'no segment'};
      let a1=h.a1;if(a1<h.a0)a1+=Math.PI*2;let ok=0,tot=0,over={};
      for(let fr=0.02;fr<1;fr+=0.06)for(let fa=0.02;fa<1;fa+=0.06){tot++;
       const rr=h.r0+(h.r1-h.r0)*fr,a=h.a0+(a1-h.a0)*fa,x=h.cx+rr*Math.cos(a),y=h.cy+rr*Math.sin(a),t=hitTest(x,y);
       if(t&&t.k==='node'&&t.n&&t.n.i===n.i)ok++;
       else{const k=t?(t.k+(t.o&&t.o.nm?' '+t.o.nm:'')):'nothing';over[k]=(over[k]||0)+1;}}
      return {k:n.k,sq:+n.sq.toFixed(1),seat:n.b,depthPx:+(h.r1-h.r0).toFixed(1),pressable:Math.round(ok/tot*100),over};}));},700));},{who,lines});
   out[who+'-'+Wd]=r;
   console.log(Wd,who.padEnd(7),r.map(x=>x.k+' '+x.pressable+'%').join('   '));}
  await ctx.close();}
 fs.writeFileSync(path.join(__dirname,'shots','reach.json'),JSON.stringify(out,null,1));
 await b.close();})().catch(e=>{console.error(e);process.exit(1);});
