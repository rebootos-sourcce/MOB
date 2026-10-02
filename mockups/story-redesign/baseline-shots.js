/* baseline-shots.js. Photographs today's Story page, plus the Intake and the
   Field it is to match. Read only: it opens source.html and changes nothing.
   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/story-redesign/baseline-shots.js
   Writes into mockups/story-redesign/baseline/. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=path.join(__dirname,'baseline');
const SRC=path.resolve('source.html');
const ENTRY="I had a really rough day today. I had a confrontation with my boss. I was really irritated by him. He showed no remorse.";
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const log={};
 for(const [W,H] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:W,height:H}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
  await p.goto('file://'+SRC+'?dev=1'); await p.waitForTimeout(6500);
  const shot=async n=>{await p.screenshot({path:`${OUT}/${n}-${W}.png`});};
  const go=async(tab,setup)=>{await p.evaluate(`(function(){${setup||''};setTab(TAB.${tab});})()`); await p.waitForTimeout(1200);};
  const type=async t=>{await p.evaluate(t=>{var e=document.getElementById('sttext');e.focus();e.value=t;e.dispatchEvent(new Event('input',{bubbles:true}));},t); await p.waitForTimeout(1500);};
  /* the blank profile */
  await go('STORY'); await shot('story-blank-empty');
  await type(ENTRY); await shot('story-blank-typed');
  /* the loaded profile */
  await go('STORY',"loadP(PEOPLE.findIndex(x=>x.nm==='Tomas'))"); await shot('story-loaded-empty');
  await type(ENTRY); await shot('story-loaded-typed');
  await p.evaluate("var l=document.getElementById('stlist'); if(l)l.click()"); await p.waitForTimeout(900); await shot('story-loaded-imprints-list');
  await p.evaluate("var l=document.getElementById('stbank'); if(l)l.click()"); await p.waitForTimeout(900); await shot('story-loaded-bank');
  /* the pages to match */
  await go('QUESTIONS',"loadP(PEOPLE.findIndex(x=>x.nm==='Tomas'))"); await shot('intake-loaded');
  await go('FIELD'); await shot('field-loaded');
  log[W]=errs;
  await p.close();}
 console.log(JSON.stringify(log)); await b.close();})();
