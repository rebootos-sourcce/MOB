const {chromium}=require('playwright');
const PG=['compass','board','tape'], WHO=process.argv[2]||'Marcus';
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const p of PG){
  for(const [w,h,tag] of [[1600,1000,'wide'],[390,844,'narrow']]){
   const pg=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
   const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
   pg.on('request',r=>{if(!/^(file|data|blob):/.test(r.url()))errs.push('NETWORK '+r.url());});
   await pg.goto('file://'+__dirname+'/'+p+'.html');
   await pg.waitForTimeout(350);
   await pg.evaluate(n=>{const s=document.getElementById('who');
    if(s&&[...s.options].some(o=>o.value===n)){s.value=n;s.onchange();}},WHO);
   await pg.waitForTimeout(250);
   await pg.screenshot({path:__dirname+'/shot-'+p+'-'+WHO+'-'+tag+'.png',fullPage:true});
   if(errs.length)console.log('!! '+p+' '+tag+': '+errs.join(' | '));
   await pg.close();}}
 await b.close(); console.log('shots done for '+WHO);
})();
