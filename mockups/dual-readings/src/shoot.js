/* Screenshots every mockup at 1600 and 390, full page, and fails loudly on a
   page error or a horizontal scroll at 390. NODE_PATH must reach playwright.
   node shoot.js [r1] [tag] */
const {chromium}=require('playwright'), path=require('path'), fs=require('fs');
const D=path.join(__dirname,'..'), OUT=path.join(D,'shots');
const files={r1:'r1-level.html',r2:'r2-instruments.html',r3:'r3-axis.html',r4:'r4-mirror.html'};
(async()=>{
 const only=process.argv[2]&&process.argv[2]!=='all'?process.argv[2]:null, tag=process.argv[3]||'';
 const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [id,f] of Object.entries(files)){
  if(only&&only!==id)continue; if(!fs.existsSync(path.join(D,f)))continue;
  for(const [w,h,who] of [[1600,1000,''],[390,844,'diane'],[390,844,'tomas'],[390,844,'blank']]){
   const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:w<500?2:1});
   const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
   const reqs=[]; p.on('request',r=>{if(!r.url().startsWith('file:')&&!r.url().startsWith('data:'))reqs.push(r.url());});
   await p.goto('file://'+path.join(D,f)+(who?'?who='+who:''));
   await p.waitForTimeout(2200);
   const m=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,
    small:[].filter.call(document.querySelectorAll('body *'),e=>{if(!e.childNodes.length||!e.offsetParent)return false;
     var t=[].some.call(e.childNodes,n=>n.nodeType===3&&n.textContent.trim());return t&&parseFloat(getComputedStyle(e).fontSize)<11;}).length}));
   const name=id+'-'+w+(who&&w<500?'-'+who:'')+(tag?'-'+tag:'')+'.png';
   await p.screenshot({path:path.join(OUT,name),fullPage:true});
   if(w<500){const c=await p.$('.card.on'); if(c)await c.screenshot({path:path.join(OUT,name.replace('.png','-panel.png'))});}
   console.log(name,'scroll',m.sw+'/'+m.cw,m.sw>m.cw?'HORIZONTAL SCROLL':'ok','under11:',m.small,errs.length?'ERRORS '+errs.join(' | '):'',reqs.length?'NET '+reqs.join(' '):'');
   await p.close();}}
 await b.close();})();
