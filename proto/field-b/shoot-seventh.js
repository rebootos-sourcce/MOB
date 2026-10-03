/* The watch for seventh.html. Both widths, every request logged.
   NODE_PATH=$(npm root -g) node proto/field-b/shoot-seventh.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const DIR=__dirname;
const PAGE='file://'+path.join(DIR,'seventh.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

(async()=>{
 const br=await chromium.launch({executablePath:EXE});
 const log=[];
 for(const [w,h] of [[1600,1000],[390,844]]){
  const ctx=await br.newContext({viewport:{width:w,height:h},deviceScaleFactor:2});
  const pg=await ctx.newPage();
  pg.on('request',r=>log.push(w+'  request  '+r.method()+'  '+r.url()));
  pg.on('requestfailed',r=>log.push(w+'  FAILED   '+r.url()));
  pg.on('console',m=>{if(m.type()==='error')log.push(w+'  console  '+m.text());});
  pg.on('pageerror',e=>log.push(w+'  pageerror  '+e.message));
  await pg.goto(PAGE,{waitUntil:'load'});
  await pg.waitForTimeout(600);
  log.push(w+'  state  '+JSON.stringify(await pg.evaluate(()=>window.__state&&window.__state())));
  await pg.screenshot({path:path.join(DIR,'shot-seventh-'+w+'.png'),fullPage:true,scale:'css'});
  for(const [id,nm] of [['ringA','ringA'],['ringB','ringB'],
                        ['stackA','stackA'],['stackB','stackB'],
                        ['detA','detA'],['detB','detB'],
                        ['anchY','anchY'],['anchN','anchN']]){
   const el=await pg.$('#'+id);
   await el.screenshot({path:path.join(DIR,'shot-7-'+nm+'-'+w+'.png')});}
  /* the columns whole, which is how he will read it */
  const cols=await pg.$$('.two .col');
  for(let i=0;i<cols.length;i++)
   await cols[i].screenshot({path:path.join(DIR,'shot-7-col'+i+'-'+w+'.png')});
  await ctx.close();
 }
 await br.close();
 const net=log.filter(l=>/request /.test(l)&&!/ file:\/\//.test(l));
 fs.writeFileSync(path.join(DIR,'requests-seventh.log'),
  ['THE REQUEST LOG for seventh.html. Written by shoot-seventh.js.',
   'A line that is not file:// is a request off the machine, and there must not be one.',
   '','off machine requests: '+net.length,''].concat(log).join('\n')+'\n');
 console.log(log.join('\n'));
 console.log('\noff machine requests: '+net.length);
})();
