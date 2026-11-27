/* The Summary's test-relevant structure, read off the built page. This repeats the
   assertions tests/functional.js and tests/design.js make about #sumbody so the
   rebuild can be checked without running those gates. node mockups/summary-layout/contract.js */
const {chromium}=require('playwright');const path=require('path');
const SRC=process.env.SRC||path.resolve(__dirname,'../../source.html');
let bad=0; const ok=(c,m)=>{console.log((c?'  ok   ':'  FAIL ')+m); if(!c)bad++;};
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [W,H] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:W,height:H}});
  const errs=[];p.on('pageerror',e=>errs.push(String(e.message)));
  await p.goto('file://'+SRC+'?dev=1');
  await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}).catch(()=>{});
  console.log('\n== loaded, James, '+W);
  const j=await p.evaluate(()=>{
   loadP(PEOPLE.findIndex(x=>x.nm==='James')); setTab(TAB.SUMMARY);
   const q=s=>document.querySelectorAll(s).length, body=document.getElementById('sumbody');
   const rings=[...document.querySelectorAll('#sumbody .cr')];
   const out={glance:q('#sumbody .s-gl'),storyP:q('#sumbody .s-story .s-p'),rows:q('#sumbody .s-row'),
    doms:q('#sumbody .s-dom'),chips:q('#sumbody .s-chip'),
    chipBox:[...document.querySelectorAll('#sumbody .s-chip')].filter(c=>getComputedStyle(c).borderTopWidth!=='0px').length,
    numRows:q('#sumbody .s-nrow'),numParts:q('#sumbody .s-npart'),rings:rings.length,
    badRing:rings.filter(c=>!c.querySelector('svg.arc')||!c.querySelector('.gl svg')).length,
    emptyPill:rings.filter(c=>{const v=c.querySelector('.v');return v&&!v.textContent.trim()&&getComputedStyle(v).display!=='none';}).length,
    over:[...body.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflowX==='visible'&&!e.closest('svg')).length,
    text:(body.textContent||'').replace(/\s+/g,' '),
    host:!!document.querySelector('#sumbody .sum-wrap'), pband:!!document.querySelector('.s-pband b'),
    pbandColour:getComputedStyle(document.querySelector('.s-pband b')).color, tierCol:TIERCOL[compute().tier],
    slot:!!document.getElementById('sumday'), slotEmpty:document.getElementById('sumday')&&document.getElementById('sumday').children.length===0&&document.getElementById('sumday').textContent==='',
    slotOrder:(()=>{const a=document.querySelector('#sumbody .sg-story'),s=document.getElementById('sumday'),o=document.querySelector('#sumbody .s-outrow');
     return a&&s&&o&&(a.compareDocumentPosition(s)&4)&&(s.compareDocumentPosition(o)&4);})()};
   return out;});
  ok(j.glance>=5,'glance rings '+j.glance); ok(j.storyP===3,'story is three paragraphs, '+j.storyP);
  ok(j.rows>5,'structure rows '+j.rows); ok(j.doms>0,'blueprint domains '+j.doms);
  ok(j.chips>=5,'spiritual chips '+j.chips); ok(j.chipBox===0,'no box on any chip, '+j.chipBox);
  ok(j.numRows>=5,'numerology rows '+j.numRows); ok(j.numParts===3,'name parts '+j.numParts);
  ok(j.rings>8&&j.badRing===0,j.rings+' rings, bad '+j.badRing); ok(j.emptyPill===0,'empty pills '+j.emptyPill);
  ok(j.over===0,'overflowing boxes '+j.over);
  ok(/blueprint you were born on|no birth data/.test(j.text),'story opens on the spiritual layer');
  ok(/the field leans/i.test(j.text)&&/benign|malignant/i.test(j.text),'closes on the lean');
  ok(!/undefined|NaN|\[object/.test(j.text),'no placeholder leaked');
  ok(j.text.indexOf('James Edward Cavanaugh')>=0,'full name on the page');
  ok(/Life path/.test(j.text),'life path on the page'); ok(/\bcomparisons?\b/.test(j.text),'comparisons named');
  ok(j.host&&j.pband,'.sum-wrap host and .s-pband present');
  ok(j.slot&&j.slotEmpty&&j.slotOrder,'day slot present, empty, under the story and above the output row');
  console.log('  tier colour',j.pbandColour,j.tierCol);
  const open=await p.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='James')); setTab(TAB.SUMMARY);
   const out={}; for(const s of ['[data-sp]','[data-num]','[data-dom]','[data-seat]','[data-arch]','[data-gl]','[data-mask]']){
    rdClose(); const e=document.querySelector('#sumbody '+s); if(!e){out[s]='absent';continue;}
    e.click(); out[s]=(document.getElementById('rdrill').textContent||'').trim().length;}
   rdClose(); return out;});
  for(const k in open)ok(open[k]==='absent'||open[k]>60,'control '+k+' opens a reading, '+open[k]);
  /* every route a control on the page takes, with folds shut */
  const tog=await p.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='James')); setTab(TAB.SUMMARY);
   const d=document.querySelector('#sumbody details[data-fold]'); d.open=true; d.dispatchEvent(new Event('toggle'));
   const key=d.getAttribute('data-fold'); render(); const again=document.querySelector('#sumbody details[data-fold="'+key+'"]');
   return {key,stillOpen:!!(again&&again.open)};});
  ok(tog.stillOpen,'a fold opened by the person stays open through a repaint ('+tog.key+')');
  console.log('== blank, '+W);
  const bl=await p.evaluate(()=>{loadP(0); setTab(TAB.SUMMARY);
   const t=document.getElementById('sumbody').innerText;
   return {doors:document.querySelectorAll('#sumbody [data-start]').length,hasYou:/\bYou\b/.test(t.replace(/Say who you are becoming/,'')),
    groups:document.querySelectorAll('#sumbody .sg-z,#sumbody .sg-card').length,text:t.slice(0,120).replace(/\n/g,' | ')};});
  ok(bl.doors===4,'four doors, '+bl.doors); ok(!bl.hasYou&&bl.groups===0,'silent, no default name, no cards. '+bl.text);
  console.log('== owner name, '+W);
  const ow=await p.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='Derek')); CURP.name='Lance';
   CURP.who=Object.assign({},CURP.who,{first:'Lance',middle:"O'Neill",last:'Powell'}); setTab(TAB.SUMMARY); render();
   return [...document.querySelectorAll('#sumbody [data-src="NAME_MEANINGS"]')].map(e=>e.textContent.replace(/\s+/g,' ').trim());});
  ok(ow.length===3&&/To pierce/.test(ow[0])&&/Champion/.test(ow[1])&&/Exalted/.test(ow[2]),'his three parts read: '+JSON.stringify(ow));
  const nm=await p.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='Sofia')); setTab(TAB.SUMMARY);
   return {rows:document.querySelectorAll('#sumbody [data-src="NAME_MEANINGS"]').length,
    note:/No root meaning on file for Sofia, Beatriz or Alarcon\./.test(document.getElementById('sumbody').textContent)};});
  ok(nm.rows===0&&nm.note,'a name with no entry says so and prints no guess');
  ok(errs.length===0,'no page errors '+errs.join(' | '));
  await p.close();}
 await b.close(); console.log(bad?('\n'+bad+' FAILED'):'\nall held'); process.exit(bad?1:0);})();
