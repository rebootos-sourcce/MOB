/* THE WATCH FOR THIS ROUND. Renders index.html at both widths, presses every
   band, measures the paint cost off the page's own harness, and writes every
   request the page made to requests.log beside it.

   NODE_PATH=$(npm root -g) node proto/field-b/shoot.js
*/
/* THE FULL PAGE SHOTS GO AT CSS SCALE. At device scale two a full page came
   out 3200 by 11280 and the directory ran to twenty nine megabytes, which is
   a review nobody downloads. The section shots keep the device scale, because
   those are the ones a band is actually looked at in. */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const DIR=__dirname;
const PAGE='file://'+path.join(DIR,'index.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

(async()=>{
 const br=await chromium.launch({executablePath:EXE});
 const log=[];const out={};
 for(const [w,h] of [[1600,1000],[390,844]]){
  const ctx=await br.newContext({viewport:{width:w,height:h},deviceScaleFactor:2});
  const pg=await ctx.newPage();
  pg.on('request',r=>log.push(w+'  request  '+r.method()+'  '+r.url()));
  pg.on('requestfailed',r=>log.push(w+'  FAILED   '+r.url()+'  '+(r.failure()||{}).errorText));
  pg.on('console',m=>{if(m.type()==='error')log.push(w+'  console  '+m.text());});
  pg.on('pageerror',e=>log.push(w+'  pageerror  '+e.message));
  await pg.goto(PAGE,{waitUntil:'load'});
  await pg.waitForTimeout(700);
  const st=await pg.evaluate(()=>window.__state&&window.__state());
  log.push(w+'  state  '+JSON.stringify(st));
  /* shut, then measure, then open a band on all four */
  const shut=await pg.evaluate(()=>window.__frames());
  out['shut-'+w]=shut;
  await pg.screenshot({path:path.join(DIR,'shot-shut-'+w+'.png'),fullPage:true,scale:'css'});
  /* open the heart band, index 3, on all four and shoot it */
  await pg.evaluate(()=>window.__open(3));
  await pg.waitForTimeout(250);
  await pg.screenshot({path:path.join(DIR,'shot-open-heart-'+w+'.png'),fullPage:true,scale:'css'});
  await pg.evaluate(()=>window.__open(6));
  await pg.waitForTimeout(250);
  await pg.screenshot({path:path.join(DIR,'shot-open-crown-'+w+'.png'),fullPage:true,scale:'css'});
  const opened=await pg.evaluate(()=>window.__frames());
  out['open-'+w]=opened;
  /* one section on its own, tight, so a band can actually be looked at. The
     control strip is sticky and sat on top of every one of these, so it is
     unstuck for the duration and put back after. */
  await pg.evaluate(()=>{document.querySelector('.bar').style.position='static';});
  for(const id of ['shell','kerf','strata','unroll']){
   const el=await pg.$('#sec-'+id);
   await el.screenshot({path:path.join(DIR,'shot-'+id+'-'+w+'.png')});}
  await pg.evaluate(()=>{document.querySelector('.bar').style.position='';});
  /* and a second profile, because one field is not a test */
  await pg.selectOption('#who','Gordon');
  await pg.waitForTimeout(250);
  await pg.evaluate(()=>window.__open(0));
  await pg.waitForTimeout(250);
  await pg.screenshot({path:path.join(DIR,'shot-gordon-root-'+w+'.png'),fullPage:true,scale:'css'});
  /* the heaviest field in the roster, which is the case that has to hold */
  await pg.evaluate(()=>window.__open(null));
  await pg.waitForTimeout(150);
  out['gordon-'+w]=await pg.evaluate(()=>window.__frames());
  await pg.selectOption('#who','Marcus');
  await pg.waitForTimeout(200);
  await pg.evaluate(()=>window.__open(1));
  await pg.waitForTimeout(250);
  await pg.screenshot({path:path.join(DIR,'shot-marcus-sacral-'+w+'.png'),fullPage:true,scale:'css'});
  await ctx.close();
 }
 await br.close();
 const net=log.filter(l=>/request /.test(l)&&!/ file:\/\//.test(l));
 const head=['THE REQUEST LOG. Written by proto/field-b/shoot.js.',
  'Every request the page made at both widths. A line that is not file:// is a',
  'request off the machine, and there must not be one.','',
  'off machine requests: '+net.length,''];
 fs.writeFileSync(path.join(DIR,'requests.log'),head.concat(log).join('\n')+'\n');
 fs.writeFileSync(path.join(DIR,'cost.json'),JSON.stringify(out,null,1)+'\n');
 console.log(log.join('\n'));
 console.log('\noff machine requests: '+net.length);
 console.log(JSON.stringify(out,null,1));
})();
