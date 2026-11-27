/* Pass 4 micro probes on a scratch build of origin/main. Read only.
   (1) crisis wording on the three doors, (2) Story page draft across a reload,
   (3) Skip on the What changed question, then reload. */
const {chromium}=require('playwright');
const path=require('path');
const FILE0=path.resolve(process.argv[2]||'source.html');
const SHRINK=`REL_WORD_S=0.0004;REL_GAP_S=0.001;REL_HEAD_S=0;REL_FRAME_S=0;`;
const CRISIS='I want to die. I keep thinking about killing myself and everyone would be better off without me.';
const STORY2='I was humiliated in the meeting and I said nothing. I felt small and ashamed and my stomach was in a knot.';
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}};
const J=x=>JSON.stringify(x);
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 /* (1a) onboarding door */
 {
  const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
  const page=await ctx.newPage();
  const click=async sel=>{try{await page.click(sel,{timeout:4000});await page.waitForTimeout(90);return true;}catch(e){return page.evaluate(s=>{const b=document.querySelector(s);if(b){b.click();return true;}return false;},sel);}};
  await page.goto('file://'+FILE0,{waitUntil:'load'}); await booted(page);
  const g=await page.$('#loginb-skip'); if(g){await click('#loginb-skip'); await page.waitForTimeout(350);}
  await click('[data-ob="next"]'); await click('[data-obpick="0"]'); await click('[data-ob="next"]');
  await click('[data-obfeel="1"]'); await click('[data-obplace="3"]');
  await page.fill('#obtext',CRISIS); await page.dispatchEvent('#obtext','input'); await click('#obdone');
  await page.evaluate(()=>{let b;while((b=document.querySelector('[data-obmore]')))b.click();document.querySelectorAll('[data-obans="yes"][aria-pressed="false"]').forEach(x=>x.click());});
  const mid=await page.evaluate(()=>({step:OB.step,text:document.body.innerText}));
  await click('[data-ob="mirrorcommit"]');
  const post=await page.evaluate(()=>({step:OB.step,entries:CURP.story.entries.length,imprints:CURP.story.entries.slice(-1)[0].imprints,
    text:document.body.innerText}));
  console.log('(1a) onboarding door, crisis wording: reached mirror step',mid.step,'; after Commit step',post.step,'entries',post.entries,'imprints charged',post.imprints);
  console.log('     page mentions 988:',/988/.test(mid.text+post.text),' 741741:',/741741/.test(mid.text+post.text),' "crisis":',/crisis/i.test(mid.text+post.text));
  await ctx.close();
 }
 /* (1b) Story page, (2) draft across reload, (3) skip */
 {
  const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
  const page=await ctx.newPage();
  await page.goto('file://'+FILE0+'?dev=1',{waitUntil:'load'}); await booted(page);
  await page.evaluate(()=>{setTab(TAB.STORY);}); await page.waitForTimeout(400);
  await page.evaluate(t=>{const ta=document.getElementById('sttext');ta.value=t;ta.dispatchEvent(new Event('input',{bubbles:true}));},CRISIS);
  await page.waitForTimeout(300);
  const t1=await page.evaluate(()=>document.body.innerText);
  await page.evaluate(()=>{const b=document.getElementById('stapply');if(b&&!b.disabled)b.click();}); await page.waitForTimeout(300);
  const c=await page.evaluate(()=>({entries:CURP.story.entries.length,imprints:CURP.story.entries.slice(-1)[0].imprints,text:document.body.innerText,status:(document.getElementById('status')||{}).innerText||''}));
  console.log('(1b) Story page, crisis wording: committed entries',c.entries,'imprints',c.imprints,'; mentions 988:',/988/.test(t1+c.text),' 741741:',/741741/.test(t1+c.text),'; Source AI line while typing:',J((await page.evaluate(()=>{const e=document.querySelector('.src-q,#srcq,.src-live');return e?e.innerText.slice(0,160):null;}))));
  /* (2) draft */
  await page.evaluate(t=>{const ta=document.getElementById('sttext');ta.value=t;ta.dispatchEvent(new Event('input',{bubbles:true}));},STORY2);
  await page.waitForTimeout(500);
  await page.reload({waitUntil:'load'}); await booted(page);
  await page.evaluate(()=>{setTab(TAB.STORY);}); await page.waitForTimeout(500);
  const d=await page.evaluate(()=>({box:(document.getElementById('sttext')||{}).value||'',ST:ST_TEXT}));
  console.log('(2) Story page draft after reload: box holds',J(d.box.slice(0,40)),'length',d.box.length,'(typed',STORY2.length,')');
  /* (3) skip */
  await page.evaluate(t=>{const ta=document.getElementById('sttext');ta.value=t;ta.dispatchEvent(new Event('input',{bubbles:true}));},STORY2);
  await page.waitForTimeout(300);
  await page.evaluate(()=>{const b=document.getElementById('stapply');if(b&&!b.disabled)b.click();}); await page.waitForTimeout(300);
  await page.evaluate(SHRINK);
  await page.evaluate(()=>{const g=document.getElementById('strun');if(g&&!g.disabled)g.click();}); await page.waitForTimeout(300);
  await page.evaluate(()=>{const d=document.getElementById('reldose');if(d){d.value='1';d.dispatchEvent(new Event('change'));}});
  await page.waitForFunction(()=>typeof RUN!=='undefined'&&RUN.phase==='done'&&RUN.cool>=COOLING.length,null,{timeout:90000}).catch(()=>{});
  await page.evaluate(()=>{const r=document.getElementById('relrest');if(r)r.click();}); await page.waitForTimeout(150);
  await page.evaluate(()=>{const b=document.querySelector('[data-relskip]');if(b)b.click();}); await page.waitForTimeout(250);
  const sk=await page.evaluate(()=>({said:(document.getElementById('relsaid')||{}).innerText||'',ev:(CURP.practice.evidence||[]).length,lines:CURP.meter.lines,unique:CURP.meter.unique.length}));
  await page.evaluate(()=>{const c=document.getElementById('relclose');if(c)c.click();}); await page.waitForTimeout(300);
  await page.reload({waitUntil:'load'}); await booted(page);
  const after=await page.evaluate(()=>({ev:(CURP.practice.evidence||[]).length,lines:CURP.meter.lines,L:(function(){const L=loopRead(CURP);return L.patterns.map(x=>x.name+':'+x.lines+'/'+x.said.n);})(),ask:RUN.ask}));
  console.log('(3) Skip: card says',J(sk.said),'; evidence rows',sk.ev,'meter lines',sk.lines,'unique',sk.unique,'| after reload evidence rows',after.ev,'lines',after.lines,'patterns (lines/answers)',J(after.L),'RUN.ask',after.ask);
  await ctx.close();
 }
 await browser.close();
})().catch(e=>{console.error('PROBE5 FAILED',e&&e.stack||e);process.exit(1);});
