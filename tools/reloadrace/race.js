/* THE BINDING RACE, ALONE. node race.js N MODE PAGE
   N fresh contexts. In each, PAGE (a file) is opened with an init script that
   either touches localStorage at document start (MODE early, what LCOL_SEED
   did), or touches it only at the page's first own access (MODE lazy, the
   fix), or not at all (MODE none). The page then writes a key; a second
   blank page in the same context, opened after, reads it. A page whose key
   the second page cannot see is a page whose store was never bound: Chromium
   refuses the bind when it arrives before the browser has the commit
   (content/browser/dom_storage/dom_storage_context_wrapper.cc IsRequestValid,
   "For now, we'll just fail to bind.") and says nothing. */
const path=require('path'),fs=require('fs'),os=require('os'),{chromium}=require('playwright');
const [N,MODE,PAGE]=[+process.argv[2]||50,process.argv[3]||'early',process.argv[4]];
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'race-'));
const blank=path.join(dir,'blank.html'); fs.writeFileSync(blank,'<!doctype html><title>b</title>');
const target=PAGE?path.resolve(PAGE):blank;
const EARLY=`try{if(localStorage.getItem('lcol')===null)localStorage.setItem('lcol','open');}catch(e){}`;
const LAZY=require(process.env.SEED_LAZY_FROM||path.join(__dirname,'..','..','tests','seed.js')).LCOL_SEED;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 let dead=0, t0=Date.now(); const bad=[];
 for(let i=0;i<N;i++){
  const cx=await b.newContext();
  if(MODE==='early')await cx.addInitScript(EARLY);
  if(MODE==='lazy')await cx.addInitScript(LAZY);
  const a=await cx.newPage();
  await a.goto('file://'+target+(PAGE?'?dev=1':''),{waitUntil:'load'});
  const v='v'+i+'-'+Date.now();
  await a.evaluate(v=>localStorage.setItem('zz-race',v),v);
  const q=await cx.newPage(); await q.goto('file://'+blank);
  let seen=null; const s0=Date.now();
  while(Date.now()-s0<3000){ seen=await q.evaluate(()=>localStorage.getItem('zz-race')); if(seen===v)break; await q.waitForTimeout(50); }
  if(seen!==v){dead++; bad.push(i);}
  await cx.close();
 }
 console.log(MODE+' '+(PAGE?path.basename(PAGE):'blank')+': '+dead+' of '+N+' pages never reached the browser'+(bad.length?' ('+bad.join(',')+')':'')+', '+Math.round((Date.now()-t0)/1000)+' s');
 await b.close();})();
