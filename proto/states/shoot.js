/* THE SHOTS. Drives proto/states/states.html with real presses on the real
   controls, at 1600 by 1000 and 390 by 844, and writes every state to
   shots/. Also measures what a reviewer would otherwise have to trust: every
   tile at or over the 44 pixel floor, no caption wider than its tile, no
   request leaving the file, no page error.

     node proto/states/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/states/shoot.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'shots'); fs.mkdirSync(OUT,{recursive:true});
const PAGE='file://'+path.join(__dirname,'states.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const facts=[];
async function open(p,hash){
 await p.goto('about:blank'); await p.goto(PAGE+hash);
 await p.waitForFunction(()=>document.documentElement.getAttribute('data-states-ready')==='1',null,{timeout:25000});
 await p.waitForTimeout(500);}
async function railShot(p,file,w){
 /* the rail and the card, in one frame where they are side by side */
 const sec=await p.$('.lsec[data-sec="spirit"]'); await sec.scrollIntoViewIfNeeded();
 await p.evaluate(()=>document.querySelector('.lsec[data-sec="spirit"]').scrollIntoView({block:'start'}));
 await p.waitForTimeout(250);
 await p.screenshot({path:path.join(OUT,file+'-'+w+'.png')});}
async function cardShot(p,file,w){
 await p.evaluate(()=>{const c=document.getElementById('rdrill');if(c)c.scrollIntoView({block:'start'});});
 await p.waitForTimeout(250);
 await p.screenshot({path:path.join(OUT,file+'-'+w+'.png')});}
/* at 390 the product's own tip rule holds: the first tap on anything with a
   title explains it and the second acts, so a press there is two taps */
async function tap(p,sel,w){
 await p.click(sel); if(w<600){await p.waitForTimeout(120); await p.click(sel);}
 await p.waitForTimeout(200);}
async function measure(p,label,w){
 const m=await p.evaluate(()=>{
  const t=[...document.querySelectorAll('#spirit .ib, #spirit .st-stack')].map(b=>{const r=b.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)];});
  const over=[...document.querySelectorAll('#spirit .st-cell')].filter(c=>{
   const b=c.querySelector('.ib').getBoundingClientRect();
   return [...c.querySelectorAll('.st-v')].some(v=>v.scrollWidth>Math.ceil(b.width)+1);}).length;
  return {tiles:t.length, smallest:t.reduce((a,x)=>Math.min(a,x[0],x[1]),999), captionsWiderThanTile:over,
   railText:(document.getElementById('spirit').innerText||'').replace(/\s+/g,' ').trim()};});
 facts.push(Object.assign({state:label,width:w},m)); return m;}
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 for(const [w,h] of [[1600,1000],[390,844]]){
  const ctx=await b.newContext({viewport:{width:w,height:h}});
  const p=await ctx.newPage(); const errs=[], reqs=[];
  p.on('pageerror',e=>errs.push(String(e))); p.on('request',r=>{if(!/^(file|data|about|blob):/.test(r.url()))reqs.push(r.url());});
  for(const who of ['angela','james','derek']){
   await open(p,'#'+who);
   await measure(p,who,w);
   await railShot(p,'rail-'+who,w);
   await cardShot(p,'stack-'+who,w);}
  /* a press on each of the four, on James, by clicking the tile */
  await open(p,'#james');
  for(const k of ['sun','moon','rising','year']){
   await tap(p,'#spirit [data-st="'+k+'"]',w);
   await cardShot(p,'layer-james-'+k,w);}
  /* the relation row goes to the other layer */
  await tap(p,'#spirit [data-st="sun"]',w);
  await p.click('#rdrill .st-rel[data-go="moon"]'); await p.waitForTimeout(150);
  facts.push({state:'sun card, press the moon row',width:w,
   opened:await p.evaluate(()=>document.querySelector('#rdrill .pm-eye').textContent)});
  /* names hidden, the drawing he is asked about */
  await p.click('#spirit [data-pn="0"]'); await p.waitForTimeout(150);
  await railShot(p,'rail-james-names-hidden',w);
  await p.click('#spirit [data-pn="1"]');
  /* the time removed: the moon James's date cannot settle */
  await p.click('#spirit [data-pt="1"]'); await p.waitForTimeout(150);
  await measure(p,'james, time removed',w);
  await railShot(p,'rail-james-notime',w);
  await tap(p,'#spirit [data-st="moon"]',w);
  await cardShot(p,'layer-james-notime-moon',w);
  await p.click('#spirit [data-pt="0"]');
  /* his two, through the combination box */
  await tap(p,'#spirit [data-st="stack"]',w);
  await p.click('#rdrill [data-pre="Water,Rat"]'); await p.waitForTimeout(150);
  await cardShot(p,'combo-water-rat',w);
  await p.click('#rdrill [data-pre="Fire,Horse"]'); await p.waitForTimeout(150);
  await cardShot(p,'combo-fire-horse',w);
  /* the stranger */
  await open(p,'#blank'); await measure(p,'blank',w); await railShot(p,'rail-blank',w);
  facts.push({state:'errors and requests',width:w,pageErrors:errs,outboundRequests:reqs});
  await ctx.close();}
 await b.close();
 fs.writeFileSync(path.join(OUT,'facts.json'),JSON.stringify(facts,null,1));
 console.log(JSON.stringify(facts.map(f=>{const g=Object.assign({},f);delete g.railText;return g;}),null,0));})();
