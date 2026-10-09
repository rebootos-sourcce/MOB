/* Pass 4 probe. Read only against a scratch build of origin/main. Prints what the saved
   profile holds after: (A) the onboarding route, (B) the ordinary Story route.
   NODE_PATH=/opt/node22/lib/node_modules node probe4.js <path to source.html> */
const {chromium}=require('playwright');
const path=require('path');
const FILE0=path.resolve(process.argv[2]||'source.html');
const SHRINK=`REL_WORD_S=0.0004;REL_GAP_S=0.001;REL_HEAD_S=0;REL_FRAME_S=0;`;
const STORY='I felt tight in my chest when my boss yelled at me and I could not breathe.';
const STORY2='I was humiliated in the meeting and I said nothing. I felt small and ashamed and my stomach was in a knot.';
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}};
const J=x=>JSON.stringify(x);
const shape=()=>{
  const p=CURP, ev=(p.practice&&p.practice.evidence)||[];
  const m=p.meter||{};
  const text=JSON.stringify(p);
  return {
   keys:Object.keys(p),
   entries:(p.story&&p.story.entries||[]).map(e=>({t:e.t,len:(e.text||'').length,imprints:e.imprints,bands:e.bands&&Object.keys(e.bands).length,lex:e.lex,asked:e.asked||null,ob:e.ob||null})),
   meter:{lines:m.lines,unique:(m.unique||[]).length,relLines:m.relLines,truthLines:m.truthLines,first:!!m.first,last:!!m.last,keys:Object.keys(m),sample:(m.unique||[]).slice(0,6)},
   heavy:(m.heavy&&Object.keys(m.heavy).length)||0,
   journey:p.journey?{v:p.journey.v,walk:p.journey.walk&&{step:p.journey.walk.step,t:p.journey.walk.t,base:p.journey.walk.base},gift:p.journey.gift,log:(p.journey.log||[]).map(e=>e.type)}:null,
   practiceKeys:p.practice?Object.keys(p.practice).filter(k=>Array.isArray(p.practice[k])).map(k=>k+':'+p.practice[k].length):null,
   evidence:ev.map(e=>({id:e.id,metric:e.metric,value:e.value,pattern_id:e.pattern_id,story_t:e.story_t,ts:e.timestamp,source:e.source,dim:e.dimension,ctx:e.context})),
   trace:p.trace||null,
   history:(p.history||[]).length,
   releaseIdOnRecord:/release_[0-9a-f]{8}-/.test(text)||/"release_id"/.test(text),
   cq:(typeof compute==='function')?+compute().CQ.toFixed(3):null
  };
};
const loop=()=>{
  const L=loopRead(CURP);
  return {entries:L.entries,confirmed:L.confirmed,unanswered:L.unanswered,declined:L.declined.length,practiceEvents:L.practice.events,next:L.next,
    patterns:L.patterns.map(x=>({name:x.name,addr:x.address,state:x.state,by:x.by,named:x.named,stories:x.stories,lines:x.lines,truths:x.truths,said:x.said}))};
};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});

 /* ---------------- A. the onboarding route, through the real door ---------------- */
 if(!process.env.SKIP_A){
  const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
  const page=await ctx.newPage(); const errs=[];
  page.on('pageerror',e=>errs.push(e.message));
  const click=async sel=>{try{await page.click(sel,{timeout:4000});await page.waitForTimeout(90);return true;}catch(e){return page.evaluate(s=>{const b=document.querySelector(s);if(b){b.click();return true;}return false;},sel);}};
  const door=async()=>{await booted(page);const g=await page.$('#loginb-skip');if(g){await click('#loginb-skip');await page.waitForTimeout(350);}};
  await page.goto('file://'+FILE0,{waitUntil:'load'}); await door();
  await click('[data-ob="next"]'); await click('[data-obpick="0"]'); await click('[data-ob="next"]');
  await click('[data-obfeel="1"]'); await click('[data-obplace="3"]');
  await page.fill('#obtext',STORY); await page.dispatchEvent('#obtext','input'); await click('#obdone');
  const cq0=await page.evaluate(()=>+compute().CQ.toFixed(3));
  await page.evaluate(()=>{let b;while((b=document.querySelector('[data-obmore]')))b.click();});
  const rows=await page.evaluate(()=>[...document.querySelectorAll('[data-obrow]')].map(r=>+r.getAttribute('data-obrow')));
  /* yes on all but the last, Not me on the last */
  for(let i=0;i<rows.length;i++){const v=i===rows.length-1?'no':'yes';
   await page.evaluate(([n,v])=>{const b=document.querySelector('[data-obans="'+v+'"][data-obi="'+n+'"]');if(b)b.click();},[rows[i],v]);}
  const before=await page.evaluate(()=>({unique:(CURP.meter.unique||[]).length,entries:CURP.story.entries.length}));
  const sysSeen={};
  await click('[data-ob="mirrorcommit"]'); await page.waitForTimeout(200);
  const afterCommit=await page.evaluate(()=>({entries:CURP.story.entries.length,ob:CURP.story.entries.slice(-1)[0].ob,cq:+compute().CQ.toFixed(3)}));
  const plan=await page.evaluate(()=>OB.plan&&OB.plan.ok?{addrs:OB.plan.addrs,lines:OB.plan.lines}:null);
  const sqA=await page.evaluate(rs=>rs.map(n=>n+':'+BY[n].sq.toFixed(2)),rows);
  console.log('field weight (sq) per mirror row right after Commit',J(sqA),'(row 7 got Not me)');
  await click('[data-ob="release"]'); await page.waitForTimeout(200);
  await page.evaluate(SHRINK);
  await page.evaluate(()=>{const d=document.getElementById('reldose');if(d){d.value='1';d.dispatchEvent(new Event('change'));}});
  const runId=await page.evaluate(()=>RUN.id);
  await click('#relgo');
  await page.waitForFunction(()=>typeof RUN!=='undefined'&&RUN.phase==='done'&&RUN.cool>=COOLING.length,null,{timeout:90000}).catch(()=>{});
  await page.evaluate(()=>{const r=document.getElementById('relrest');if(r)r.click();}); await page.waitForTimeout(150);
  const queue=await page.evaluate(()=>RUN.queue.map(n=>n.i));
  await page.evaluate(()=>{const b=document.querySelector('[data-relsaid="nothing_changed"]');if(b)b.click();});
  await page.waitForTimeout(250);
  const cq1=await page.evaluate(()=>+compute().CQ.toFixed(3));
  const sqA2=await page.evaluate(rs=>rs.map(n=>n+':'+BY[n].sq.toFixed(2)),rows);
  console.log('field weight (sq) per row after the release',J(sqA2));
  const runMem=await page.evaluate(()=>({id:RUN.id,said:RUN.said,logN:RUN.log.length,planN:RUN.planN}));
  const preReload=await page.evaluate(`(${shape.toString()})()`);
  console.log('\n=== A. onboarding route ===');
  console.log('rows shown at the mirror',rows.length,'plan',J(plan),'queue addrs of the run',J(queue));
  console.log('CQ before commit',cq0,'after commit',afterCommit.cq,'after release+answer',cq1);
  console.log('ob on entry after commit',J(afterCommit.ob));
  console.log('RUN in memory',J(runMem),'runId given',runId);
  console.log('SAVED PROFILE before reload',J(preReload,null,0));
  await click('#relclose'); await page.waitForTimeout(500);
  /* reload and read back */
  await page.waitForTimeout(300); await page.reload({waitUntil:'load'}); await door();
  const post=await page.evaluate(`(${shape.toString()})()`);
  const lp=await page.evaluate(`(${loop.toString()})()`);
  const asked=await page.evaluate(()=>({runOpen:RUN.open,ask:RUN.ask,said:RUN.said,ob:OB.open,obStep:OB.step}));
  console.log('AFTER RELOAD',J(asked));
  console.log('evidence after reload',J(post.evidence));
  console.log('meter after reload',J(post.meter),'history',post.history,'releaseIdOnRecord',post.releaseIdOnRecord,'trace',J(post.trace));
  console.log('journey after reload',J(post.journey));
  console.log('practice arrays',J(post.practiceKeys));
  console.log('loopRead after reload',J(lp));
  console.log('page errors',errs.length,errs.slice(0,2));
  await ctx.close();
 }

 /* ---------------- B. the ordinary Story route (?dev=1) ---------------- */
 {
  const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
  const page=await ctx.newPage(); const errs=[];
  page.on('pageerror',e=>errs.push(e.message));
  await page.goto('file://'+FILE0+'?dev=1',{waitUntil:'load'}); await booted(page);
  await page.evaluate(()=>{setTab(TAB.STORY);}); await page.waitForTimeout(400);
  await page.evaluate(t=>{const ta=document.getElementById('sttext');ta.value=t;ta.dispatchEvent(new Event('input',{bubbles:true}));},STORY2);
  await page.waitForTimeout(300);
  const ui=await page.evaluate(()=>{
    const btns=[...document.querySelectorAll('button')].map(b=>b.textContent.trim());
    return {yesNotMe:btns.filter(t=>/^(Yes|Not me|That is me|Not quite)$/i.test(t)).length,
      obans:document.querySelectorAll('[data-obans]').length,
      parsed:ST_PARSED?{n:ST_PARSED.imprints.length,inferred:ST_PARSED.imprints.filter(i=>i.inferred).length,stated:ST_PARSED.imprints.filter(i=>!i.inferred).length}:null,
      relModel:(function(){const M=stRelModel();return {take:M.take.map(n=>n.i+':'+n.k),added:M.added,bank:M.bank};})()};});
  const cq0=await page.evaluate(()=>+compute().CQ.toFixed(3));
  console.log('Story page text length', STORY2.length);
  await page.evaluate(()=>{const b=document.getElementById('stapply');if(b&&!b.disabled)b.click();}); await page.waitForTimeout(300);
  const afterCommit=await page.evaluate(()=>({entries:CURP.story.entries.length,e:CURP.story.entries.slice(-1)[0],cq:+compute().CQ.toFixed(3),
     rel:(function(){const M=stRelModel();return {take:M.take.map(n=>n.i+':'+n.k),fromLast:M.fromLast};})(),lastT:STV.lastT}));
  console.log('\n=== B. ordinary Story route ===');
  console.log('before commit',J(ui),'CQ',cq0);
  console.log('after commit entry',J({imprints:afterCommit.e.imprints,ob:afterCommit.e.ob||null,asked:afterCommit.e.asked||null}),'CQ',afterCommit.cq,'release panel offers',J(afterCommit.rel),'lastT',!!afterCommit.lastT);
  await page.evaluate(SHRINK);
  await page.evaluate(()=>{const g=document.getElementById('strun');if(g&&!g.disabled)g.click();}); await page.waitForTimeout(300);
  await page.evaluate(()=>{const d=document.getElementById('reldose');if(d){d.value='1';d.dispatchEvent(new Event('change'));}});
  await page.waitForFunction(()=>typeof RUN!=='undefined'&&RUN.phase==='done'&&RUN.cool>=COOLING.length,null,{timeout:90000}).catch(()=>{});
  await page.evaluate(()=>{const r=document.getElementById('relrest');if(r)r.click();}); await page.waitForTimeout(150);
  const run=await page.evaluate(()=>({phase:RUN.phase,queue:RUN.queue.map(n=>n.i),storyT:RUN.storyT,id:RUN.id,first:RUN.first,ask:RUN.ask}));
  /* answer once for a run of several addresses */
  await page.evaluate(()=>{const b=document.querySelector('[data-relsaid="see_differently"]');if(b)b.click();});
  await page.waitForTimeout(250);
  const cq1=await page.evaluate(()=>+compute().CQ.toFixed(3));
  const pre=await page.evaluate(`(${shape.toString()})()`);
  const sqB=await page.evaluate(q=>q.map(n=>n+':'+BY[n].sq.toFixed(2)),run.queue);
  console.log('run',J(run),'CQ after release + answer',cq1,'sq of run addresses after',J(sqB));
  console.log('SAVED PROFILE before reload: evidence',J(pre.evidence));
  console.log('meter',J(pre.meter),'history',pre.history,'releaseIdOnRecord',pre.releaseIdOnRecord,'journey',J(pre.journey&&{walk:pre.journey.walk,gift:pre.journey.gift,log:pre.journey.log}));
  await page.evaluate(()=>{const c=document.getElementById('relclose');if(c)c.click();}); await page.waitForTimeout(400);
  await page.reload({waitUntil:'load'}); await booted(page);
  const post=await page.evaluate(`(${shape.toString()})()`);
  const lp=await page.evaluate(`(${loop.toString()})()`);
  await page.evaluate(()=>{setTab(TAB.FIELD);}); await page.waitForTimeout(600);
  const side=await page.evaluate(()=>{const e=document.getElementById('loopside');return e?e.innerText.replace(/\s+/g,' ').slice(0,700):null;});
  console.log('AFTER RELOAD evidence',J(post.evidence));
  console.log('loopRead after reload',J(lp));
  console.log('Your patterns block on the Field:',J(side));
  console.log('trace on record',J(post.trace),'practice arrays',J(post.practiceKeys));
  console.log('page errors',errs.length,errs.slice(0,2));
  await ctx.close();
 }
 await browser.close();
})().catch(e=>{console.error('PROBE FAILED',e&&e.stack||e);process.exit(1);});
