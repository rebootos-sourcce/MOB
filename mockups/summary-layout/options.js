/* The options pictured for the owner's open questions. Every one is the real built
   page with its real data, changed in the document before the picture is taken.
   None of them is built. Text changed for a picture is marked in the picture's
   file name and in the report. node mockups/summary-layout/options.js */
const {chromium}=require('playwright');const path=require('path');
const SRC=process.env.SRC||path.resolve(__dirname,'../../source.html');
const OUT=__dirname;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 await p.goto('file://'+SRC+'?dev=1');
 await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}).catch(()=>{});
 await p.waitForTimeout(400);
 const load=async(who,owner)=>{await p.evaluate(([who,owner])=>{
   loadP(PEOPLE.findIndex(x=>x.nm===who)); var pe=PEOPLE[S.who];
   if(owner){CURP.name='Lance'; CURP.who=Object.assign({},CURP.who,{first:'Lance',middle:"O'Neill",last:'Powell'});}
   if(!CURP.story.entries.length&&pe.says)CURP.story.entries.push({t:Date.now()-86400000,text:pe.says});
   setTab(TAB.SUMMARY); render();},[who,owner]); await p.waitForTimeout(700);};
 const tall=async()=>{const e=await p.evaluate(()=>{const s=document.getElementById('sum');return Math.max(0,s.scrollHeight-s.clientHeight);});
  await p.setViewportSize({width:1600,height:1000+e+40}); await p.waitForTimeout(500);};
 const clip=async(sel,file,pad)=>{const bb=await p.evaluate(sel=>{const e=document.querySelector(sel);const r=e.getBoundingClientRect();
   return {x:r.x,y:r.y,width:r.width,height:r.height};},sel); pad=pad||10;
  await p.screenshot({path:OUT+'/'+file,clip:{x:Math.max(0,bb.x-pad),y:Math.max(0,bb.y-pad),width:bb.width+2*pad,height:bb.height+2*pad}});};

 /* A. the nine, as built, and the same three sentences in the first person */
 await load('Sofia',false); await tall();
 await clip('#sumbody .sg-card[data-grp="cost"]','option-nine-as-built.png');
 await p.evaluate(()=>{const ps=document.querySelectorAll('#sumbody .sg-card[data-grp="cost"] .s-axes .s-p');
  const f=[['The heaviest of the nine is','My heaviest of the nine is'],['which you feel in','which I feel in'],
   ['Under it,','Under it, I carry'],['Standing against them:','Standing against them in me:']];
  ps.forEach(e=>{f.forEach(([a,b])=>{e.innerHTML=e.innerHTML.replace(a,b);});});});
 await clip('#sumbody .sg-card[data-grp="cost"]','option-nine-first-person-text-edited.png');

 /* B. the way out raised to sit under the plate on a desktop */
 await load('Sofia',false); await p.setViewportSize({width:1600,height:1000}); await p.waitForTimeout(300);
 await p.evaluate(()=>{const w=document.querySelector('#sumbody .sum-wrap'),t=w.querySelector('.sg-todo'),l=w.querySelector('.sg-lead');
  w.insertBefore(t,l);});
 await p.waitForTimeout(300);
 await p.screenshot({path:OUT+'/option-do-first-1600.png'});

 /* C. the source of a name meaning printed under it, and not only on hover */
 await load('Derek',true); await p.setViewportSize({width:1600,height:1000}); await p.waitForTimeout(300);
 await p.evaluate(()=>{document.querySelectorAll('#sumbody [data-src="NAME_MEANINGS"]').forEach(r=>{
  const ring=r.querySelector('.sg-c-g'); const tip=ring&&ring.getAttribute('data-tip');
  if(tip){const el=document.createElement('p'); el.className='sg-note'; el.textContent=tip; el.style.margin='2px 0 0';
   r.querySelector('.sg-m-t').appendChild(el);}});});
 await p.waitForTimeout(300);
 await clip('#sumbody .sg-drive','option-source-printed-1600.png');

 /* D. the headings, kept and then softened. Hand edited for the picture. */
 await load('Angela',false); await p.setViewportSize({width:1600,height:1000}); await p.waitForTimeout(300);
 await p.evaluate(()=>{const m={'What drives it':'Where it started','What it costs':'What it holds'};
  document.querySelectorAll('#sumbody .sg-zh span').forEach(s=>{if(m[s.textContent])s.textContent=m[s.textContent];});});
 await p.waitForTimeout(300);
 await p.screenshot({path:OUT+'/option-headings-softened-text-edited-1600.png'});
 await b.close(); console.log('options written');})();
