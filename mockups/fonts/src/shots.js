const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const list=JSON.parse(fs.readFileSync(path.join(__dirname,'fonts.json')));
const out=path.join(__dirname,'..','png');const url='file://'+path.join(__dirname,'..','specimen.html');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const jobs=[['sheet',''],['monos','?f=monos'],...list.map(f=>[f.slug,'?f='+f.slug])];
 for(const [w,dsf] of [[1600,1],[390,2]]){
  const ctx=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:dsf});
  for(const [n,qs] of jobs){const p=await ctx.newPage();await p.goto(url+qs);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);
   const ov=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(ov)console.log('HORIZONTAL OVERFLOW',n,w);
   await p.screenshot({path:path.join(out,n+'-'+w+'.png'),fullPage:true});await p.close();}
  await ctx.close();}
 await b.close();})();
