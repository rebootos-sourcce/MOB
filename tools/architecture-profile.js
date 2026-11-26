/* Read-only architecture baseline: synthetic records, no service traffic.
   Measurements are observations, not release budgets. Run from repository root. */
'use strict';
const fs=require('fs'), path=require('path'), crypto=require('crypto'), os=require('os');
const {execFileSync}=require('child_process');
const {performance}=require('perf_hooks');
const E=require(path.resolve('engine.js'));
const {chromium}=require('playwright');
const assert=require('assert/strict');
const sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const summarize=a=>{
  assert(a.length && a.every(Number.isFinite),'missing/nonfinite samples');
  const s=a.slice().sort((a,b)=>a-b), q=p=>s[Math.ceil(s.length*p)-1];
  return {n:s.length,p50:q(.5),p95:q(.95),max:s.at(-1),samples:a};
};
const phrase='I felt afraid when I spoke. I stopped and withdrew.';
function fixture(n){
  const p=E.blankProfile('Synthetic architecture fixture');
  p.id='p-architecture-synthetic';
  p.created='2026-01-01T00:00:00.000Z';
  p.ui.voice=false;p.ui.sfxoff=true;p.ui.onboarded=true;
  p.story.entries=Array.from({length:n},(_,i)=>({
    t:new Date(Date.UTC(2026,0,1,0,i)).toISOString(),text:phrase,
    imprints:0,bands:{},lex:E.LEX_VERSION
  }));
  const v=E.validateProfile(p);
  assert(v.ok,'synthetic fixture must pass schema: '+JSON.stringify(v.errs));
  return v.profile;
}
function bench(fn,n=12){
  for(let i=0;i<3;i++)fn();
  const samples=[];
  for(let i=0;i<n;i++){const t=performance.now();fn();samples.push(performance.now()-t);}
  return summarize(samples);
}
async function main(){
  const result={schema:'architecture-performance-baseline.v1',sha,node:process.version,
    environment:{platform:process.platform,arch:process.arch,cpus:os.cpus().length,cpu:os.cpus()[0]?.model},
    products:{engine:hash('engine.js'),source:hash('source.html'),packed:hash('atuned-packed.html')},
    engine:[],browser:[],limitations:['CI software rendering is not owner GPU hardware','Synthetic local records only','Wall time is environment-specific','No acceptance budgets inferred']};
  for(const n of [0,10,100,500]){
    const p=fixture(n); E.loadProfile(p);
    const before=JSON.stringify(p), reading=E.compute();
    const graph=E.traceFromRecord(p,[],reading);
    const repeat=E.traceFromRecord(p,[],reading);
    assert.equal(JSON.stringify(graph),JSON.stringify(repeat),'graph derivation changed for identical input');
    const keys=new Set(graph.nodes.map(x=>x.key));
    assert.equal(keys.size,graph.nodes.length,'duplicate graph node keys');
    const calc=bench(()=>E.compute());
    const trace=bench(()=>E.traceFromRecord(p,[],reading));
    const intelligence=bench(()=>E.srcVoiceIntelligence(phrase,p,{}));
    assert.equal(JSON.stringify(p),before,'read-only benchmark mutated record');
    result.engine.push({entries:n,nodes:graph.nodes.length,edges:graph.edges.length,
      refused:graph.refused.length,gaps:graph.gaps.length,computeMs:calc,traceMs:trace,intelligenceMs:intelligence,
      nodeHeapUsedBytes:process.memoryUsage().heapUsed});
  }
  const browser=await chromium.launch({executablePath:process.env.CHROME||chromium.executablePath()});
  try{
    for(const [width,height] of [[1600,1000],[390,844]]){
      for(const count of [0,100]){
        const ctx=await browser.newContext({viewport:{width,height},serviceWorkers:'block',
          deviceScaleFactor:width===390?2:1,isMobile:width===390,hasTouch:width===390});
        try{
          let blocked=0;
          await ctx.route(/^https?:\/\//,r=>{blocked++;return r.abort();});
          await ctx.addInitScript(require('../tests/seed.js').FULL_SIGHT);
          await ctx.addInitScript(()=>{
            window.__architectureLongTasks=[];
            if(PerformanceObserver.supportedEntryTypes.includes('longtask')){
              new PerformanceObserver(l=>{for(const e of l.getEntries())window.__architectureLongTasks.push(e.duration);})
                .observe({type:'longtask',buffered:true});
            }
          });
          const page=await ctx.newPage(), errors=[];
          page.on('pageerror',e=>errors.push(e.name));
          const t=performance.now();
          await page.goto('file://'+path.resolve('source.html')+'?dev=1',{waitUntil:'load'});
          await page.waitForFunction(()=>document.documentElement.getAttribute('data-boot')==='ok',{},{timeout:30000});
          const bootMs=performance.now()-t;
          await page.waitForFunction(()=>document.body.classList.contains('booted'),{},{timeout:30000});
          await page.evaluate(p=>{
            if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();
            if(!pImport(JSON.stringify(p)))throw Error('synthetic browser import refused');
            render();
          },fixture(count));
          const tabs=await page.evaluate(()=>TABDEF.map(x=>({name:x.nm,key:x.k,id:x.id})));
          assert(tabs.length,'no tabs');
          const cdp=await ctx.newCDPSession(page); await cdp.send('Performance.enable');
          const surfaces=[];
          for(const tab of tabs){
            const samples=[];
            for(let i=0;i<3;i++){
              const r=await page.evaluate(async key=>{
                const t=performance.now();setTab(key);const sync=performance.now()-t;
                await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
                return {sync,frames:performance.now()-t};
              },tab.key);
              samples.push(r);
            }
            const m=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
            const shown=await page.evaluate(id=>{
              const e=document.getElementById(id); if(!e)return false;
              const b=e.getBoundingClientRect();return getComputedStyle(e).display!=='none'&&b.width>0&&b.height>0;
            },tab.id);
            surfaces.push({name:tab.name,shown,syncMs:summarize(samples.map(x=>x.sync)),
              twoFrameMs:summarize(samples.map(x=>x.frames)),jsHeapUsedBytes:m.JSHeapUsedSize??null,
              domNodes:m.Nodes??null,layoutSecondsCumulative:m.LayoutDuration??null,
              scriptSecondsCumulative:m.ScriptDuration??null});
          }
          const longTasks=await page.evaluate(()=>window.__architectureLongTasks);
          result.browser.push({width,height,entries:count,bootMs,blockedExternalRequests:blocked,pageErrorCount:errors.length,
            longTaskMs:longTasks.length?summarize(longTasks):null,surfaces});
        }finally{await ctx.close();}
      }
    }
  }finally{await browser.close();}
  const out=process.env.ARCHITECTURE_PROFILE_OUT||'architecture-profile.json';
  fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({sha,engine:result.engine.map(x=>({entries:x.entries,nodes:x.nodes,edges:x.edges,computeP95:x.computeMs.p95,traceP95:x.traceMs.p95,intelligenceP95:x.intelligenceMs.p95})),
    browser:result.browser.map(x=>({width:x.width,entries:x.entries,bootMs:x.bootMs,errors:x.pageErrorCount,surfaces:x.surfaces.length,blocked:x.blockedExternalRequests}))},null,2));
  assert(result.browser.every(x=>x.pageErrorCount===0),'browser page errors; inspect artifact');
}
main().catch(e=>{console.error(e.name+': '+e.message);process.exitCode=1;});
