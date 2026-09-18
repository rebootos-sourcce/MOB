const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve('source.html');
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};

(async()=>{
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const page=await browser.newPage({viewport:{width:1600,height:1000}});
const errs=[];
page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
page.on('pageerror',e=>errs.push('PAGEERROR: '+e.message));
await page.goto(FILE,{waitUntil:'load'});
await page.waitForTimeout(900);

console.log('\n=== 1 · load ===');
ok(errs.length===0,'console errors: '+errs.slice(0,5).join(' | '));
console.log('  errors:',errs.length);
const shell=await page.evaluate(()=>({
 tabs:document.querySelectorAll('.tabtop').length,
 depths:document.querySelectorAll('#vbar .vt').length,
 doms:document.querySelectorAll('#doms .ib').length,
 arcs:document.querySelectorAll('#ar1 .ib').length,
 laws:document.querySelectorAll('#laws .nf').length,
 axes:document.querySelectorAll('#chg .nf').length,
 mx:document.querySelectorAll('#mx button').length,
 eshelf:!!document.getElementById('eshelf')}));
ok(shell.tabs===7,'7 tabs, got '+shell.tabs);
ok(shell.depths===4,'4 depths, got '+shell.depths);
ok(shell.doms===19,'19 domains, got '+shell.doms);
ok(shell.arcs===12,'12 archetypes, got '+shell.arcs);
ok(shell.laws===21,'21 law fields, got '+shell.laws);
ok(shell.axes===18,'18 axis fields (9 held + 9 opposite), got '+shell.axes);
ok(shell.mx===171,'171 matrix cells, got '+shell.mx);
ok(shell.eshelf,'#eshelf element exists');
console.log('  shell:',JSON.stringify(shell));

console.log('\n=== 2 · exactly one surface visible per tab ===');
const TABN=['Story','Summary','Field','Energy','Analytics'];
for(let i=0;i<5;i++){
 await page.evaluate(n=>setTab(n),i);
 await page.waitForTimeout(260);
 const vis=await page.evaluate(()=>{
  const ids=['story','sum','cv','emap','ana'];
  return ids.filter(id=>{const e=document.getElementById(id);if(!e)return false;
   const r=e.getBoundingClientRect();
   return getComputedStyle(e).display!=='none'&&r.width>0&&r.height>0;});});
 ok(vis.length===1,TABN[i]+': expected 1 visible surface, got '+vis.length+' ['+vis+']');
 console.log('  '+TABN[i].padEnd(10),'visible:',vis.join(',')||'NONE');}

console.log('\n=== 3 · CSS coverage. every class a renderer emits has a rule. ===');
const cssMiss=await page.evaluate(()=>{
 const defined=new Set();
 for(const sh of document.styleSheets){
  let rules; try{rules=sh.cssRules}catch(e){continue}
  for(const r of rules){
   const walk=rr=>{ if(rr.selectorText)
     (rr.selectorText.match(/\.[A-Za-z][\w-]*/g)||[]).forEach(c=>defined.add(c.slice(1)));
    if(rr.cssRules)for(const k of rr.cssRules)walk(k);};
   walk(r);}}
 const used=new Set();
 document.querySelectorAll('*').forEach(e=>e.classList.forEach(c=>used.add(c)));
 return [...used].filter(c=>!defined.has(c));});
ok(cssMiss.length===0,'classes with no CSS rule: '+cssMiss.join(', '));
console.log('  unstyled classes:',cssMiss.length?cssMiss.join(', '):'none');

console.log('\n=== 4 · type floor. nothing under 11px in CSS pixels. ===');
const small=await page.evaluate(()=>{
 const out={};
 document.querySelectorAll('*').forEach(e=>{
  if(e.closest('svg'))return;                    // svg text scales with viewBox
  const t=(e.textContent||'').trim();
  if(!t||e.children.length)return;
  const fs=parseFloat(getComputedStyle(e).fontSize);
  if(fs<11){const k=e.className+' @'+fs+'px';out[k]=(out[k]||0)+1;}});
 return out;});
ok(Object.keys(small).length===0,'sub-11px text: '+JSON.stringify(small));
console.log('  sub-floor elements:',Object.keys(small).length?JSON.stringify(small):'none');

console.log('\n=== 5 · no all-caps UI copy ===');
const caps=await page.evaluate(()=>{
 const bad=[];
 document.querySelectorAll('*').forEach(e=>{
  if(e.children.length||e.closest('svg'))return;
  const t=(e.textContent||'').trim();
  if(t.length<7)return;
  const st=getComputedStyle(e);
  if(st.textTransform==='uppercase'){bad.push('transform:'+t.slice(0,28));return;}
  const letters=t.replace(/[^A-Za-z]/g,'');
  if(letters.length>6&&letters===letters.toUpperCase())bad.push(t.slice(0,34));});
 return bad;});
ok(caps.length===0,'all-caps strings: '+caps.slice(0,6).join(' | '));
console.log('  all-caps strings:',caps.length?caps.slice(0,6).join(' | '):'none');

await browser.close();
console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})();
