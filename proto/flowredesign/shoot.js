/* ============================================================
   THE FLOW SECTION, MEASURED. For each of the six reference ICPs, with
   their own story bank committed, and each of the five options (the shipped
   section and the four), at 1600 by 1000 and 390 by 844:

     controls    every control inside the Flow section
     words       the words it prints, and how many bare figures among them
     height      how tall the section is, which is how far a person scrolls
     stop        whether the seat where flow closes is named
     holding     how many of the patterns on show sit at a held seat, which
                 is the question he asked: are these impairing flow
     press       the first pattern pressed: did its card open, and where
     floors      controls under 44 pixels, sideways overflow, errors,
                 requests leaving the file

     node proto/flowredesign/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/flowredesign/shoot.js
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'shots'); fs.mkdirSync(OUT,{recursive:true});
const PAGE='file://'+path.join(__dirname,'flow.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ICPS=['sofia','diane','marcus','angela','derek','james'];
const SHOT=['james','derek','angela'];
const OPTS=['0','1','2','3','4'];
const wait=(p,ms)=>p.waitForTimeout(ms);
async function open(p,hash){
 await p.goto('about:blank'); await p.goto(PAGE+'#'+hash+'-clean');
 await p.waitForFunction(()=>document.documentElement.getAttribute('data-fr-ready')==='1',null,{timeout:25000});
 await wait(p,500);}
const MEASURE=`(function(){
 var el=document.getElementById('eshelf'), sec=document.querySelector('.lsec[data-sec="flow"]');
 var ctl=[].slice.call(el.querySelectorAll('button')).filter(function(b){return !b.closest('[data-proto]')&&b.getBoundingClientRect().height>0;});
 var small=ctl.filter(function(b){var r=b.getBoundingClientRect();return r.height<43.5||r.width<43.5;})
  .map(function(b){var r=b.getBoundingClientRect();return (b.className||'')+' '+Math.round(r.width)+'x'+Math.round(r.height);});
 var clone=el.cloneNode(true); var pr=clone.querySelector('[data-proto]'); if(pr)pr.remove();
 var t=(el.innerText||''); var pt=el.querySelector('[data-proto]'); if(pt)t=t.replace(pt.innerText,'');
 var words=(t.match(/\\S+/g)||[]), figs=words.filter(function(w){return /^[\\d.]+%?$/.test(w);});
 var r=el.getBoundingClientRect(), pad=pt?pt.getBoundingClientRect().height+12:0;
 var over=[].slice.call(el.querySelectorAll('*')).filter(function(e){var q=e.getBoundingClientRect();return q.width>0&&q.right>r.right+2;}).length;
 var rr=compute(), seats=flSeats(), held=seats.filter(function(s){return s.held;}).map(function(s){return K2B[s.p.k];});
 var stop=null; seats.slice().reverse().forEach(function(s){if(!stop&&s.held)stop=s;});
 return {controls:ctl.length, words:words.length, figures:figs.length, height:Math.round(r.height-pad),
  stopNamed:stop?new RegExp(stop.p.n,'i').test(t):null, stopSeat:stop?stop.p.n:null, heldSeats:held,
  clinical:/bipolar|ADHD|schizoid|BPD|antisocial|OCPD|paranoia|depression|machiavellian/i.test(t),
  small:small, overflowing:over, layer:PMLAYER,
  shown:(t.match(/\\n/g)||[]).length};})()`;
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const facts={};
 for(const [W,H] of [[1600,1000],[390,844]]){
  const phone=W<600;
  const ctx=await b.newContext({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone,deviceScaleFactor:1});
  const p=await ctx.newPage(); const errs=[], reqs=[];
  p.on('pageerror',e=>errs.push(String(e))); p.on('request',r=>{if(!/^(file|data|about|blob):/.test(r.url()))reqs.push(r.url());});
  for(const v of OPTS){
   for(const who of ICPS){
    await open(p,v+'-'+who);
    const m=await p.evaluate(MEASURE);
    /* how many of the patterns the section puts forward sit where flow is held */
    m.patterns=await p.evaluate(()=>{var seats=flSeats(), held={}; seats.forEach(function(s){if(s.held)held[K2B[s.p.k]]=1;});
     var r=compute(), all=[]; var keep=PMLAYER; ['sab','cx','hyper'].forEach(function(L){PMLAYER=L;all=all.concat(pmMarks(r));}); PMLAYER=keep;
     all=all.filter(function(x){return x.kind==='bead';});
     var at=function(x){return (x.links||[]).some(function(n){return held[n.b];});};
     return {all:all.length, atHeld:all.filter(at).length};});
    const sec=await p.$('.lsec[data-sec="flow"]'); await sec.scrollIntoViewIfNeeded();
    await p.evaluate(()=>document.querySelector('.lsec[data-sec="flow"]').scrollIntoView({block:'start'}));
    await wait(p,250);
    if(SHOT.includes(who)){
     if(phone)await p.screenshot({path:path.join(OUT,v+'-'+who+'-'+W+'.jpg'),type:'jpeg',quality:80});
     else{const e=await p.$('#eshelf'); await e.screenshot({path:path.join(OUT,v+'-'+who+'-'+W+'.jpg'),type:'jpeg',quality:82});}}
    /* press the first pattern the option offers */
    const sel=await p.evaluate(()=>{var e=document.querySelector('#eshelf [data-it],#eshelf [data-pat]');
     if(!e)return null; e.setAttribute('data-fr-press','1'); return e.textContent.trim().slice(0,60)||e.getAttribute('aria-label');});
    if(sel){
     const el=await p.$('[data-fr-press]'); await el.scrollIntoViewIfNeeded();
     let taps=0, got=null;
     for(let t=0;t<2&&!got;t++){await (await p.$('[data-fr-press]')||el).click();taps++;await wait(p,350);
      got=await p.evaluate(()=>{var d=document.getElementById('rdrill');if(!d||d.style.display==='none'||d.getBoundingClientRect().height<5)return null;
       var r=d.getBoundingClientRect();return {inView:r.bottom>0&&r.top<innerHeight,top:Math.round(r.top),
        title:((d.querySelector('.pm-eye')||{}).textContent||'')+' / '+((d.querySelector('.ad-nm,.pm-dn,h3')||{}).textContent||'')};});}
     m.press={pressed:sel,taps,opened:!!got,inView:got?got.inView:false,title:got?got.title:null};
     if(SHOT.includes(who)&&who==='james')await p.screenshot({path:path.join(OUT,v+'-'+who+'-press-'+W+'.jpg'),type:'jpeg',quality:80});
    }else m.press=null;
    facts[v+'-'+who+'-'+W]=m;
    console.log(W,v,who.padEnd(6),'ctl',m.controls,'words',m.words,'figs',m.figures,'h',m.height,'stop',m.stopNamed,
     'clinical',m.clinical,'small',m.small.length,'over',m.overflowing,'press',m.press&&m.press.opened,m.press&&m.press.inView);}}
  facts['floors-'+W]={pageErrors:errs,outboundRequests:reqs};
  await ctx.close();}
 await b.close();
 fs.writeFileSync(path.join(OUT,'facts.json'),JSON.stringify(facts,null,1));
 console.log('floors',JSON.stringify([facts['floors-1600'],facts['floors-390']]));})().catch(e=>{console.error(e);process.exit(1);});
