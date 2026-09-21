#!/usr/bin/env node
/* Shoots the container at every state it has and measures it in the same run,
   because a screenshot taken in a different session from the measurement is
   two claims about two builds. Ported from proto/story4/shots.js.

   NODE_PATH=$(npm root -g) node proto/container/shots.js

   Asserts, and exits non zero on any of them:
     the request log   anything not on file:// is a failure, and the page's own
                       fetch and XHR log is asserted separately.
     page errors       any thrown error, and any console error.
     touch targets     nothing interactive under 44 by 44.
     horizontal scroll at 390.
     redraw            median and worst of the ink draw against 16.7 ms.
*/
const {chromium}=require('playwright');
const path=require('path');
const SEL='button,input,select,textarea,a[href],[role=button]';
const VIEWS=[[1600,1000],[390,844]];
const DIR=__dirname;
const URL='file://'+path.join(DIR,'index.html');

async function measure(pg,label,w){
 return await pg.evaluate(sel=>{
  const vis=e=>{const r=e.getBoundingClientRect();
   return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden';};
  const els=[...document.querySelectorAll(sel)].filter(vis)
   .filter(e=>!e.closest('.pchrome'));
  const fold=window.innerHeight;
  const small=els.map(e=>{const r=e.getBoundingClientRect();
   return (r.width<44||r.height<44)
    ?(e.tagName.toLowerCase()+'.'+(e.className||'')+' '+Math.round(r.width)+'x'+Math.round(r.height))
    :null;}).filter(Boolean);
  const f=(window.FR||[]).slice().sort((a,b)=>a-b);
  return {choices:els.length,
   above:els.filter(e=>e.getBoundingClientRect().top<fold).length,
   small, med:f.length?f[Math.floor(f.length/2)]:null,
   p95:f.length?f[Math.floor(f.length*0.95)]:null, frames:f.length,
   hscroll:document.documentElement.scrollWidth>window.innerWidth
    ?document.documentElement.scrollWidth:0,
   pagereq:(window.__REQ||[]).length};},SEL);
}

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 let bad=0;
 for(const [w,h] of VIEWS){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const pg=await ctx.newPage();
  const reqs=[],errs=[];
  pg.on('request',r=>reqs.push(r.url()));
  pg.on('pageerror',e=>errs.push(String(e)));
  pg.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text());});
  await pg.goto(URL,{waitUntil:'load'});
  await pg.waitForTimeout(320);

  const shot=async n=>{await pg.evaluate(()=>window.scrollTo(0,0));
   await pg.waitForTimeout(140);
   await pg.screenshot({path:path.join(DIR,'shot-'+n+'-'+w+'.png'),fullPage:true});
   if(w<=390)await pg.screenshot({path:path.join(DIR,'shot-'+n+'-screen-390.png'),fullPage:false});};

  const rows=[];
  /* 1. outside. the shelf, with the keyring closed on Plain. */
  await shot('shelf'); rows.push(['shelf',await measure(pg,'shelf',w)]);

  /* 2. the descent keyring, which is one of his three angles as a door. */
  await pg.click('[data-ring="descent"]'); await pg.waitForTimeout(160);
  await shot('keyring'); rows.push(['keyring',await measure(pg,'keyring',w)]);

  /* 3. inside, empty. what a first open looks like. */
  await pg.click('[data-ring="plain"]'); await pg.waitForTimeout(120);
  await pg.click('[data-key="P1"]'); await pg.waitForTimeout(220);
  await shot('open-empty'); rows.push(['open-empty',await measure(pg,'open-empty',w)]);

  /* 4. inside, holding. the sniffer writing in the margin while you write.
        Typed rather than pasted, because the draw this page has to hold to a
        frame is the one that happens on every keystroke, and two samples off
        a paste is not a distribution. */
  await pg.click('#ta');
  await pg.type('#ta','I stayed quiet when he took the credit and my jaw was tight the whole call.',{delay:6});
  await pg.waitForTimeout(200);
  await pg.click('#fill'); await pg.waitForTimeout(320);
  await shot('open-held'); rows.push(['open-held',await measure(pg,'open-held',w)]);

  /* 5. the acknowledgement. */
  await pg.click('#seal'); await pg.waitForTimeout(240);
  await shot('ack'); rows.push(['ack',await measure(pg,'ack',w)]);

  /* claim four, refuse one, lift one, then seal. */
  const acks=await pg.$$('[data-ack][data-v="mine"]');
  for(let i=0;i<acks.length;i++){
   const s='[data-ack][data-v="'+(i===2?'no':'mine')+'"] >> nth='+i;
   if(await pg.$(s)){await pg.click(s);await pg.waitForTimeout(90);}}
  await pg.waitForTimeout(160);
  if(await pg.$('[data-lift]')){await pg.click('[data-lift] >> nth=0');
   await pg.waitForTimeout(160);}
  await shot('ack-done'); rows.push(['ack-done',await measure(pg,'ack-done',w)]);

  /* 6. sealed. the seam, and the sight list. */
  await pg.click('#doseal'); await pg.waitForTimeout(280);
  await shot('sealed'); rows.push(['sealed',await measure(pg,'sealed',w)]);

  /* 7. the grant. */
  await pg.click('#gopen'); await pg.waitForTimeout(200);
  await pg.click("#gwords"); await pg.waitForTimeout(140);
  await shot('grant'); rows.push(['grant',await measure(pg,'grant',w)]);
  await pg.click('#gdo'); await pg.waitForTimeout(240);
  await shot('shared'); rows.push(['shared',await measure(pg,'shared',w)]);

  /* 8. and a container opened shut, which has no share control at all. */
  await pg.click('#toshelf'); await pg.waitForTimeout(200);
  await pg.click('[data-open="4828"]'); await pg.waitForTimeout(240);
  await shot('shut'); rows.push(['shut',await measure(pg,'shut',w)]);

  console.log('=== '+w+' by '+h);
  const outside=reqs.filter(u=>!/^file:\/\//.test(u));
  console.log('  requests: '+reqs.length+'  not on file: '+outside.length
   +(outside.length?'  '+outside.join(' '):''));
  console.log('  the page\'s own fetch and xhr log: '+rows[0][1].pagereq);
  console.log('  page errors: '+errs.length+(errs.length?'  '+errs.join(' | '):''));
  rows.forEach(([n,m])=>{
   console.log('  '+n.padEnd(11)+' choices '+String(m.choices).padStart(3)
    +'  above the fold '+String(m.above).padStart(3)
    +'  under 44 '+m.small.length+(m.small.length?'  '+m.small.join(', '):'')
    +(m.hscroll?'  HSCROLL '+m.hscroll:''));
   if(m.small.length||m.hscroll)bad++;});
  const last=rows[rows.length-1][1];
  console.log('  ink redraw: median '+(last.med==null?'not measured':last.med.toFixed(2)+' ms')
   +'  95th '+(last.p95==null?'':last.p95.toFixed(2)+' ms')+'  over '+last.frames+' frames');
  if(outside.length||errs.length||rows[0][1].pagereq)bad++;
  if(last.p95!=null&&last.p95>16.7)bad++;
  await ctx.close();
 }
 await b.close();
 console.log(bad?'FAILED on '+bad+' case(s)':'every assertion passed');
 process.exit(bad?1:0);
})();
