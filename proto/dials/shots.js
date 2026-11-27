/* Shots and the request log for proto/dials/index.html.
   NODE_PATH=$(npm root -g) node proto/dials/shots.js
   It logs every request the page makes, asserts no http or https request, and
   asserts no horizontal scroll at 390. */
const {chromium}=require('playwright');
const fs=require('fs'), path=require('path');
const DIR=__dirname;
const URL='file://'+path.join(DIR,'index.html');

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const log=[], fails=[];
 for(const [w,h] of [[1600,1000],[390,844]]){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const pg=await ctx.newPage();
  pg.on('request',r=>log.push(w+'  '+r.method()+'  '+r.url()));
  pg.on('requestfailed',r=>log.push(w+'  FAILED  '+r.url()));
  pg.on('console',m=>{if(m.type()==='error')fails.push(w+' console: '+m.text());});
  pg.on('pageerror',e=>fails.push(w+' pageerror: '+e.message));
  await pg.goto(URL,{waitUntil:'load'});
  await pg.waitForTimeout(400);
  const m=await pg.evaluate(()=>({
   sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth,
   dials:document.querySelectorAll('.dial').length,
   figs:[...document.querySelectorAll('.d-n')].map(e=>e.textContent),
   words:[...document.querySelectorAll('.d-pill')].map(e=>e.textContent),
   says:[...document.querySelectorAll('.d-say')].map(e=>e.textContent),
   caps:document.body.innerText.match(/\b[A-Z]{3,}\b/g)||[],
   em:(document.body.innerText.match(/—/g)||[]).length,
   tap:[...document.querySelectorAll('button,select')].map(e=>{
    const r=e.getBoundingClientRect();
    return e.className+' '+Math.round(r.width)+'x'+Math.round(r.height);}),
   fail:[...document.querySelectorAll('.fail')].map(e=>e.parentElement.textContent.trim())
  }));
  console.log('--- '+w+'x'+h+' ---');
  console.log('scrollWidth '+m.sw+' clientWidth '+m.cw+(m.sw>m.cw?'  HORIZONTAL SCROLL':'  no horizontal scroll'));
  if(m.sw>m.cw)fails.push(w+' horizontal scroll: '+m.sw+' > '+m.cw);
  console.log('dials '+m.dials);
  console.log('figures '+JSON.stringify(m.figs));
  console.log('words '+JSON.stringify(m.words));
  m.says.forEach(s=>console.log('  say: '+s));
  console.log('all caps runs '+JSON.stringify([...new Set(m.caps)]));
  console.log('em dashes '+m.em);
  if(m.em)fails.push(w+' em dash in body text');
  console.log('below floor '+JSON.stringify(m.fail));
  m.tap.forEach(t=>{const d=t.split(' ').pop().split('x');
   if(+d[0]<44||+d[1]<44)fails.push(w+' tap target under 44: '+t);});
  await pg.screenshot({path:path.join(DIR,'shot-'+w+'.png'),fullPage:true});
  await ctx.close();
 }
 await b.close();
 const out=log.filter(l=>/https?:\/\//.test(l));
 fs.writeFileSync(path.join(DIR,'REQUESTS.log'),
  'proto/dials/index.html, every request both widths.\n'
  +'run '+new Date().toISOString()+'\n\n'+log.join('\n')
  +'\n\noutbound http or https requests: '+out.length+'\n'
  +(out.length?out.join('\n')+'\n':''));
 console.log('\nrequests '+log.length+', outbound '+out.length);
 if(out.length)fails.push('outbound request: '+out.join(', '));
 if(fails.length){console.log('\nFAIL');fails.forEach(f=>console.log('  '+f));process.exit(1);}
 console.log('clean');
})();
