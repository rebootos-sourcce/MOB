/* ============================================================
   THE COPY EDITOR'S NUMBER SWEEP.

   His instruction, given directly and not as a task in a list:
   "You read 13, what does that mean. A number without its scale
   is my job to stop, not his to catch. Make sure that's copy
   editor. This is your job to make sure it's no longer
   happening."

   So this walks every surface at both widths, on a loaded
   profile, and lists every number a person can see together with
   the words around it, sorted so the ones with no scale anywhere
   near them come first.

   IT DOES NOT FAIL. It is a report, not a gate, because "has a
   scale" is a judgement about a sentence and a regular
   expression that tried to make it would be a tool that lies.
   What it does is make the list short enough to read, which is
   the part a person cannot do by scrolling nine surfaces.

   node tools/scales.js            every surface, worst first
   node tools/scales.js 8          one tab
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(__dirname,'..','source.html');
const ONLY=process.argv[2]!==undefined?+process.argv[2]:null;

/* a number is excused when one of these sits within the span either side of
   it. Each one is a scale, a unit, or a name for what the number counts. */
const SCALED=/(out of|\bof\s+\d|per cent|percent|%|\bof 10\b|\bof 100\b|days?|minutes?|hours?|weeks?|months?|years?|patterns?|addresses|to 1\b|\bph\b|degrees?|px\b|kb\b|mb\b)/i;
const SPAN=42;                 /* characters either side that count as near */

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const rows=[];
 for(const [w,h,wn] of [[1600,1000,'desktop'],[390,844,'phone']]){
  const p=await b.newPage({viewport:{width:w,height:h}});
  await p.goto(FILE); await p.waitForTimeout(7400);
  const L=await p.evaluate(()=>PEOPLE.findIndex(x=>x.nm==='Lance'));
  await p.evaluate(i=>loadP(i),L);
  const tabs=await p.evaluate(()=>TABDEF.map(t=>[t.nm,t.k])
   .concat(Object.keys(TABEXTRA).map(k=>[TABEXTRA[k].nm,TABEXTRA[k].k])));
  for(const [nm,t] of tabs){
   if(ONLY!==null&&t!==ONLY)continue;
   await p.evaluate(k=>setTab(k),t); await p.waitForTimeout(380);
   const found=await p.evaluate(({SPAN})=>{
    const txt=(document.body.innerText||'').replace(/\s+/g,' ');
    const out=[]; const RE=/\b\d+(?:\.\d+)?\b/g; let m;
    while((m=RE.exec(txt))){
     const a=Math.max(0,m.index-SPAN), z=Math.min(txt.length,m.index+m[0].length+SPAN);
     out.push({n:m[0], ctx:txt.slice(a,z)});}
    return out;},{SPAN});
   for(const f of found)
    rows.push({where:wn+'/'+nm, n:f.n, ctx:f.ctx, ok:SCALED.test(f.ctx)});}
  await p.close();}
 await b.close();

 const bare=rows.filter(r=>!r.ok);
 const seen={}, uniq=[];
 for(const r of bare){
  const k=r.where+'|'+r.ctx.trim();
  if(seen[k])continue; seen[k]=1; uniq.push(r);}
 console.log('');
 console.log('numbers a person can see:      '+rows.length);
 console.log('with a scale or a unit near:   '+(rows.length-bare.length));
 console.log('with nothing near them:        '+bare.length
  +'  ('+uniq.length+' distinct)');
 console.log('-'.repeat(74));
 const by={};
 for(const r of uniq)(by[r.where]=by[r.where]||[]).push(r);
 for(const k of Object.keys(by).sort((a,b)=>by[b].length-by[a].length)){
  console.log('\n'+k+'   '+by[k].length);
  for(const r of by[k].slice(0,14))
   console.log('   '+r.n.padStart(6)+'   ...'+r.ctx.trim()+'...');
  if(by[k].length>14)console.log('   and '+(by[k].length-14)+' more');}
 console.log('');
})();
