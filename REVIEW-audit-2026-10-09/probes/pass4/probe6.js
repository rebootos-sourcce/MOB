/* Pass 4 probe 6: failed storage at the three writes of the chain (commit, release, answer),
   and a double tap on Commit. Read only, scratch build of origin/main. */
const {chromium}=require('playwright');
const path=require('path');
const FILE0=path.resolve(process.argv[2]||'source.html');
const SHRINK=`REL_WORD_S=0.0004;REL_GAP_S=0.001;REL_HEAD_S=0;REL_FRAME_S=0;`;
const STORY2='I was humiliated in the meeting and I said nothing. I felt small and ashamed and my stomach was in a knot.';
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}};
const J=x=>JSON.stringify(x);
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
 const page=await ctx.newPage(); const errs=[];
 page.on('pageerror',e=>errs.push(e.message));
 await page.goto('file://'+FILE0+'?dev=1',{waitUntil:'load'}); await booted(page);
 await page.evaluate(()=>{setTab(TAB.STORY);}); await page.waitForTimeout(400);
 /* the store now refuses every write of the profiles */
 await page.evaluate(()=>{const o=STORE.set; window.__fail=true; STORE.set=function(k,v){ if(window.__fail&&k===PKEY)throw new Error('QuotaExceededError'); return o(k,v); }; MSG_LOG.length=0;});
 await page.evaluate(t=>{const ta=document.getElementById('sttext');ta.value=t;ta.dispatchEvent(new Event('input',{bubbles:true}));},STORY2);
 await page.waitForTimeout(300);
 /* double tap on Commit */
 await page.evaluate(()=>{const b=document.getElementById('stapply');if(b&&!b.disabled){b.click();b.click();}}); await page.waitForTimeout(300);
 const c=await page.evaluate(()=>({entries:CURP.story.entries.length,save:saveState(),log:MSG_LOG.map(m=>m.kind+': '+m.msg)}));
 console.log('(a) commit with a refusing store, double tap: entries in memory',c.entries,'saveState',J(c.save),'messages',J(c.log));
 await page.evaluate(SHRINK);
 await page.evaluate(()=>{MSG_LOG.length=0;});
 await page.evaluate(()=>{const g=document.getElementById('strun');if(g&&!g.disabled)g.click();}); await page.waitForTimeout(300);
 await page.evaluate(()=>{const d=document.getElementById('reldose');if(d){d.value='1';d.dispatchEvent(new Event('change'));}});
 await page.waitForFunction(()=>typeof RUN!=='undefined'&&RUN.phase==='done'&&RUN.cool>=COOLING.length,null,{timeout:90000}).catch(()=>{});
 const r=await page.evaluate(()=>({lines:CURP.meter.lines,unique:CURP.meter.unique.length,save:saveState(),log:MSG_LOG.map(m=>m.kind+': '+m.msg),
   bannerText:(document.getElementById('status')||{}).textContent||''}));
 console.log('(b) release finished with a refusing store: meter in memory lines',r.lines,'unique',r.unique,'saveState',J(r.save),'messages',J(r.log),'status line now',J(r.bannerText));
 await page.evaluate(()=>{const x=document.getElementById('relrest');if(x)x.click();}); await page.waitForTimeout(150);
 await page.evaluate(()=>{MSG_LOG.length=0;});
 await page.evaluate(()=>{const b=document.querySelector('[data-relsaid="not_sure"]');if(b)b.click();}); await page.waitForTimeout(250);
 const a=await page.evaluate(()=>({ev:(CURP.practice.evidence||[]).length,log:MSG_LOG.map(m=>m.kind+': '+m.msg),said:RUN.said}));
 console.log('(c) answer with a refusing store: evidence in memory',a.ev,'RUN.said',a.said,'messages',J(a.log));
 /* now let the store work and reload: what survived? */
 await page.evaluate(()=>{window.__fail=false;});
 await page.reload({waitUntil:'load'}); await booted(page);
 const s=await page.evaluate(()=>({entries:CURP.story.entries.length,lines:CURP.meter.lines,ev:(CURP.practice.evidence||[]).length}));
 console.log('(d) after the store recovers and the page reloads: entries',s.entries,'meter lines',s.lines,'evidence',s.ev,'(all three lost if zero)');
 console.log('page errors',errs.length,errs.slice(0,2));
 await browser.close();
})().catch(e=>{console.error('PROBE6 FAILED',e&&e.stack||e);process.exit(1);});
