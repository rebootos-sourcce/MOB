/* One-off: print, for each of the ten curated practitioner clients, exactly
   what the right panel shows once opened. Not a gate, a report tool. */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const booted=async p=>{try{await p.waitForFunction(
 ()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
(async()=>{
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:1600,height:1000}});
await p.goto(FILE,{waitUntil:'load'}); await booted(p); await p.waitForTimeout(500);
await p.evaluate(()=>{pracSwitch(true); setTab(TAB.PRACTITIONER);});
await p.waitForTimeout(150);
const names=await p.evaluate(()=>PRAC_TEN.slice());
for(const nm of names){
 const i=await p.evaluate(n=>PEOPLE.findIndex(x=>x.nm===n),nm);
 await p.evaluate(ix=>document.querySelector('#prac [data-pri="'+ix+'"]').click(),i);
 await p.waitForTimeout(100);
 const d=await p.evaluate(()=>{
  var grps=document.querySelectorAll('#prac .pr-mid .ac-lead');
  var addrs=[].map.call(document.querySelectorAll('#prac .pr-addr'),function(a){
   return a.querySelector('.pr-addr-k').textContent+' ('+a.querySelector('.pr-addr-b').textContent+'): '
    +a.querySelector('.pr-addr-x').textContent;});
  return {sub:grps[0]?grps[0].textContent:'', sentence:grps[1]?grps[1].textContent:'',
   count:addrs.length, addrs:addrs.slice(0,4)};});
 console.log('\n==== '+nm+' ====');
 console.log('  '+d.sub);
 console.log('  '+d.sentence);
 console.log('  held addresses shown: '+d.count+(d.count>4?' (first 4 of '+d.count+')':''));
 d.addrs.forEach(function(a){console.log('   - '+a);});
}
await b.close();
})();
