/* ============================================================
   LOOK AT THE PAGES. Reading the builder is not reviewing a screen.

   Renders sim/what-would-help.html and sim/to-ninety.html in a real Chromium at
   1600 by 1000 and 390 by 844 and writes one PNG per screenful, so a long report
   page is reviewed the way it is read rather than as one unreadable strip. It
   also asserts what the pages are supposed to be: no request leaves the file, no
   script tag, no page error, and no em dash.

     NODE_PATH=/opt/node22/lib/node_modules node sim/shot.js [outdir]
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=path.resolve(process.argv[2]||'/tmp/simshots');
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const PAGES=['what-would-help.html','to-ninety.html'];
const MAX=14; /* screenfuls per width, enough for these pages and bounded */

(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:CHROME});
 let bad=0;
 for(const nm of PAGES){
  const f=path.join(__dirname,nm);
  if(!fs.existsSync(f)){console.error('missing sim/'+nm); process.exit(2);}
  const src=fs.readFileSync(f,'utf8');
  /* the voice rule, and it is checked on the built page rather than the builder,
     because the entity and the character render the same and only one of them
     greps. */
  const em=(src.match(/\u2014|&mdash;/g)||[]).length;
  if(em){console.error('  '+nm+': '+em+' em dashes'); bad++;}
  /* DIV BALANCE, which is the check BUILD.sh runs on the product and the check
     that would have caught the first cut of this page: a note opened with a div
     and closed with a p, so the red wash and the left border bled down through
     everything under it. It rendered, it validated, and it was wrong. */
  const opens=(src.match(/<div\b/g)||[]).length, shuts=(src.match(/<\/div>/g)||[]).length;
  if(opens!==shuts){console.error('  '+nm+': '+opens+' div open, '+shuts+' div close'); bad++;}
  for(const [w,h] of [[1600,1000],[390,844]]){
   const page=await b.newPage({viewport:{width:w,height:h}});
   const reqs=[], errs=[];
   page.on('request',r=>{if(!r.url().startsWith('file://'))reqs.push(r.url());});
   page.on('pageerror',e=>errs.push(String(e.message)));
   await page.goto('file://'+f);
   await page.waitForTimeout(500);
   const doc=await page.evaluate(()=>({
    h:document.documentElement.scrollHeight,
    scripts:document.querySelectorAll('script').length,
    ext:document.querySelectorAll('img,iframe,link[rel=stylesheet],script[src]').length,
    /* no horizontal page scroll at either width, which is the floor a report
       page fails first on a phone */
    overflow:document.documentElement.scrollWidth>window.innerWidth+1}));
   const tag=nm.replace('.html','');
   const n=Math.min(MAX,Math.ceil(doc.h/h));
   for(let i=0;i<n;i++){
    await page.evaluate(y=>window.scrollTo(0,y),i*h);
    await page.waitForTimeout(120);
    await page.screenshot({path:OUT+'/'+w+'-'+tag+'-'+String(i+1).padStart(2,'0')+'.png'});}
   const flags=[];
   if(reqs.length){flags.push(reqs.length+' NETWORK REQUESTS'); bad++;}
   if(doc.scripts){flags.push(doc.scripts+' SCRIPT TAGS'); bad++;}
   if(doc.ext){flags.push(doc.ext+' EXTERNAL REFS'); bad++;}
   if(errs.length){flags.push(errs.length+' PAGE ERRORS'); bad++;}
   if(doc.overflow){flags.push('HORIZONTAL PAGE SCROLL'); bad++;}
   console.log('  '+String(w).padStart(4)+'  '+tag.padEnd(17)+' height '
    +String(doc.h).padStart(6)+'  '+n+' screenfuls'
    +(flags.length?'   '+flags.join(', '):'   clean'));
   await page.close();}}
 await b.close();
 console.log(bad?'\n'+bad+' problems. See above.':'\nno requests, no scripts, no external refs, no errors, no em dashes.');
 console.log('shots in '+OUT);
 if(bad)process.exit(1);
})();
