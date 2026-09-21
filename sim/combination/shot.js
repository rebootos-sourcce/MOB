/* ============================================================
   LOOK AT THE TWO PAGES. Reading the builder is not reviewing a screen.

   Renders this pass's deliverables in a real Chromium at 1600 by 1000 and 390 by
   844, one PNG per screenful, and asserts what they are supposed to be: nothing
   fetched, no script, no external reference, no page error, no horizontal scroll
   at either width, no em dash, and balanced divs. The last one is here because
   the note that opened with a div and closed with a p rendered, validated and
   bled its red wash down through the rest of the page.

     NODE_PATH=/opt/node22/lib/node_modules node sim/combination/shot.js [outdir]
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const REPO=path.resolve(__dirname,'..','..');
const OUT=path.resolve(process.argv[2]||path.join(__dirname,'shots'));
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const PAGES=[path.join(__dirname,'combination.html'),path.join(REPO,'REVIEW-quality.html')];
const MAX=16;
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:CHROME});
 let bad=0;
 for(const f of PAGES){
  const nm=path.basename(f);
  if(!fs.existsSync(f)){console.error('missing '+f); process.exit(2);}
  const src=fs.readFileSync(f,'utf8');
  const em=(src.match(/—|&mdash;/g)||[]).length;
  if(em){console.error('  '+nm+': '+em+' em dashes'); bad++;}
  const opens=(src.match(/<div\b/g)||[]).length, shuts=(src.match(/<\/div>/g)||[]).length;
  if(opens!==shuts){console.error('  '+nm+': '+opens+' div open, '+shuts+' div close'); bad++;}
  /* the count stated to users is 112 and never 108 */
  const c108=(src.match(/\b108\b/g)||[]).length;
  if(c108){console.error('  '+nm+': says 108 '+c108+' times'); bad++;}
  for(const [w,hh] of [[1600,1000],[390,844]]){
   const page=await b.newPage({viewport:{width:w,height:hh}});
   const reqs=[], errs=[];
   page.on('request',r=>{if(!r.url().startsWith('file://'))reqs.push(r.url());});
   page.on('pageerror',ev=>errs.push(String(ev.message)));
   await page.goto('file://'+f);
   await page.waitForTimeout(400);
   const doc=await page.evaluate(()=>({
    h:document.documentElement.scrollHeight,
    scripts:document.querySelectorAll('script').length,
    ext:document.querySelectorAll('img,iframe,link[rel=stylesheet],script[src]').length,
    overflow:document.documentElement.scrollWidth>window.innerWidth+1}));
   const tag=nm.replace('.html','');
   const n=Math.min(MAX,Math.ceil(doc.h/hh));
   for(let i=0;i<n;i++){
    await page.evaluate(y=>window.scrollTo(0,y),i*hh);
    await page.waitForTimeout(110);
    await page.screenshot({path:OUT+'/'+w+'-'+tag+'-'+String(i+1).padStart(2,'0')+'.png'});}
   const flags=[];
   if(reqs.length){flags.push(reqs.length+' network requests'); bad++;}
   if(doc.scripts){flags.push(doc.scripts+' script tags'); bad++;}
   if(doc.ext){flags.push(doc.ext+' external refs'); bad++;}
   if(errs.length){flags.push(errs.length+' page errors: '+errs[0]); bad++;}
   if(doc.overflow){flags.push('horizontal page scroll'); bad++;}
   console.log('  '+String(w).padStart(4)+'  '+tag.padEnd(18)+' height '
    +String(doc.h).padStart(6)+'  '+n+' screenfuls'
    +(flags.length?'   '+flags.join(', '):'   clean'));
   await page.close();}}
 await b.close();
 console.log(bad?'\n'+bad+' problems. See above.'
  :'\nnothing fetched, no script, no external reference, no error, no em dash, no horizontal scroll.');
 console.log('shots in '+OUT);
 if(bad)process.exit(1);
})();
