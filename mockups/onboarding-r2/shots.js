/* shots.js. Screenshots every frame in frames.js at 1600x1000 and 390x844 into
   png/. Run from the repo root after build.js:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/onboarding-r2/shots.js [substring]
   It also measures every control (44 px floor) and prints the ones under it,
   and it writes measure.json for the contact sheet. Nothing is fetched. */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const FR=require('./frames.js');
const root=__dirname;
const only=process.argv[2]||'';
const SIZES=[[1600,1000],[390,844]];
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const out={};try{Object.assign(out,JSON.parse(fs.readFileSync(path.join(root,'measure.json'),'utf8')));}catch(e){}
 const reqs=[];
 for(const fr of FR.list){
  if(only&&fr.png.indexOf(only)<0)continue;
  for(const [w,h] of SIZES){
   const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:fr.motion?'no-preference':'reduce'});
   const p=await ctx.newPage();
   const errs=[];p.on('pageerror',e=>errs.push(String(e.message)));
   p.on('request',r=>{if(!r.url().startsWith('file:')&&!r.url().startsWith('data:'))reqs.push(r.url());});
   await p.goto('file://'+path.join(root,fr.page)+'#'+fr.hash);
   await p.waitForTimeout(fr.wait||350);
   if(fr.act)await p.evaluate(fr.act,[w,h]);
   if(fr.actM&&w<=700)await p.evaluate(fr.actM);
   await p.waitForTimeout(250);
   const name=fr.png+'-'+w+'.png';
   await p.screenshot({path:path.join(root,'png',name),fullPage:fr.page==='strips.html'});
   if(fr.scroll&&w<=700){
    const did=await p.evaluate(sel=>{const e=document.querySelector(sel);if(!e)return false;e.scrollTop=e.scrollHeight;return e.scrollHeight>e.clientHeight;},fr.scroll);
    await p.waitForTimeout(200);
    await p.screenshot({path:path.join(root,'png',fr.png+'-scrolled-'+w+'.png')});
   }
   // tap targets: every visible button, link, input, label with a control
   const small=await p.evaluate(()=>{
    const r=[];document.querySelectorAll('button,a,input:not([type=checkbox]),label.ck,[role=button],.pick,.tile,.chip,.ab').forEach(e=>{
     const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none'||cs.opacity==='0')return;
     const b=e.getBoundingClientRect();if(b.width<2||b.height<2)return;
     if(b.right<0||b.bottom<0||b.left>innerWidth||b.top>innerHeight)return;
     if(b.width<44||b.height<44)r.push((e.className&&e.className.baseVal===undefined?e.className:'')+' '+(e.textContent||'').trim().slice(0,28)+' '+Math.round(b.width)+'x'+Math.round(b.height));});
    return r;});
   out[fr.png+'-'+w]={small:small,errs:errs};
   if(errs.length)console.log('PAGE ERROR',fr.png,w,errs);
   if(small.length)console.log('UNDER 44',fr.png,w,small.join(' | '));
   await ctx.close();
  }
  console.log('shot',fr.png);
 }
 fs.writeFileSync(path.join(root,'measure.json'),JSON.stringify(out,null,1));
 if(reqs.length)console.log('NETWORK REQUESTS (should be none):',reqs);
 await b.close();
})();
