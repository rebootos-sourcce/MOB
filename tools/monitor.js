/* ============================================================
   THE RENDER MONITOR.

   Asked for by the owner after the centre column read as broken twice and
   both investigations started from a screenshot and a guess. It walks every
   surface of a built file, at both widths, on a blank profile and on a loaded
   one, and writes one stamped block to MONITOR.log. The log is the record: it
   carries the commit, the file's md5 and every surface's size, so "it broke
   again" can be answered by diffing two runs instead of by reasoning.

   It exits non zero when a surface is empty, so BUILD.sh can refuse a build
   that does not render.

   TWO LESSONS ARE BUILT INTO THE CHECK ITSELF, both learned the hard way in
   this project:

   1. innerText DOES NOT SEE SVG. The Body page is one SVG and reports zero
      characters of text while rendering forty seven elements perfectly. A
      check that used innerText alone called it broken, which was the probe
      lying and not the product failing. So a surface passes on markup size,
      and text is recorded beside it rather than deciding anything.

   2. A CSS ANIMATION RUNS WITHOUT SCRIPTS. The boot sheet fades on a keyframe
      with a forwards fill, so a scriptless environment uncovers a complete
      looking shell with nothing in it, which is exactly what a preview pane
      showed the owner. The monitor therefore asserts the noscript notice
      exists, because that is the only thing standing between that state and
      another mayday.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs'), cp=require('child_process');

const FILE=path.resolve(process.argv[2]||'source.html');
const LOG=path.resolve(__dirname,'..','MONITOR.log');
const sh=c=>{try{return cp.execSync(c,{encoding:'utf8'}).trim();}catch(e){return '?';}};

/* EVERY SURFACE, READ OUT OF TABDEF AT RUN TIME. This was a hand written list
   of nine pairs and the product grew past it: Ritual took integer 10 and the
   watch never looked at it, which is the third time a count typed into a gate
   has gone stale because the thing it counts moved. Settings is appended by
   hand because it is deliberately not in TABDEF, having no door in the bar. */
const TABS_JS=`(function(){var a=TABDEF.map(function(t){return [t.nm.toLowerCase(),t.k,t.id];});
 Object.keys(TABEXTRA).forEach(function(k){var t=TABEXTRA[k];
  a.push([t.nm.toLowerCase(),t.k,t.id]);});
 return a;})()`;
const WIDTHS=[[1600,1000,'desktop'],[390,844,'phone']];
/* a surface is empty below this much markup. Chosen against a measured
   floor: the thinnest healthy surface in the build is the compass at about
   1,900 characters, and a host that failed to render sits under 200. */
const FLOOR=400;
/* AND A CANVAS IS COUNTED IN LIT SAMPLES, NOT CHARACTERS, so it needs its own
   floor. Measured on this build: the Field on a blank profile lights 254 of
   the sampled pixels and on a loaded one 1,038, while a canvas that never
   drew lights none at all. Sixty is well clear of both the blank reading and
   of zero, which is the distinction this watch exists to make. */
const FLOOR_CANVAS=60;

(async()=>{
 const md5=sh('md5sum '+FILE).slice(0,8);
 const commit=sh('git -C '+path.dirname(FILE)+' rev-parse --short HEAD');
 const subject=sh('git -C '+path.dirname(FILE)+' log -1 --pretty=%s');
 const dirty=sh('git -C '+path.dirname(FILE)+' status --porcelain')?'DIRTY':'clean';
 const rows=[], fails=[];
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});

 /* the noscript guard, checked first because it is the cheapest and it is the
    one that prevents the failure mode that has already cost a mayday. */
 {const c=await b.newContext({viewport:{width:1200,height:800},javaScriptEnabled:false});
  const p=await c.newPage(); await p.goto('file://'+FILE); await p.waitForTimeout(6200);
  const seen=await p.$eval('body',e=>e.innerText).catch(()=>'');
  const ok=/needs javascript/i.test(seen);
  rows.push(['noscript','-','notice',ok?'ok':'MISSING',0,0]);
  if(!ok)fails.push('no noscript notice: a scriptless viewer sees an empty shell');
  await c.close();}

 for(const [w,h,wn] of WIDTHS){
  const c=await b.newContext({viewport:{width:w,height:h},
    deviceScaleFactor:wn==='phone'?2:1, isMobile:wn==='phone', hasTouch:wn==='phone'});
  const p=await c.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,140)));
  await p.goto('file://'+FILE); await p.waitForTimeout(7000);
  const L=await p.evaluate(()=>PEOPLE.findIndex(x=>x.nm==='Lance'));
  const TABS=await p.evaluate(TABS_JS);
  for(const who of ['blank','loaded']){
   if(who==='loaded')await p.evaluate(i=>loadP(i),L);
   for(const [nm,t,hid] of TABS){
    await p.evaluate(k=>setTab(k),t); await p.waitForTimeout(420);
    /* THE HOST IS LOOKED UP BY ITS ID, never by its position in the stage.
       This read the first visible child of .stage, and the Field's two key
       strips are visible children of .stage on every tab, so from the moment
       they landed the watch measured the same strip nine times and reported
       nine identical numbers under the heading "all surfaces render". A watch
       that cannot see a surface is worse than no watch, and the rule the
       project already carries is that anything needing a tab's entry looks it
       up by identity rather than by where it happens to sit. */
    const r=await p.evaluate(id=>{
     const host=document.getElementById(id); if(!host)return null;
     const s=getComputedStyle(host), b=host.getBoundingClientRect();
     const shown=(s.display!=='none'&&b.width>0&&b.height>0);
     if(!shown)return {host:id+' HIDDEN',markup:0,text:0,visible:0};
     /* A CANVAS HAS NO MARKUP AND NEVER WILL. The Field is a canvas, so
        counting its innerHTML reported zero for a surface that was drawing
        correctly, which is the same class of mistake as reading innerText on
        the Body's SVG. The honest reader for a canvas is its pixels: sample
        the drawn bitmap and count how many are not the page ground. The count
        stands in for markup in the log so one column still means one thing,
        "how much of this surface is actually there". */
     if(host.tagName==='CANVAS'){
      var w=host.width,h=host.height;
      if(!w||!h)return {host:id+' canvas 0x0',markup:0,text:0,visible:1};
      var cx=host.getContext('2d'), d=null;
      try{ d=cx.getImageData(0,0,w,h).data; }catch(e){ d=null; }
      if(!d)return {host:id+' canvas unreadable',markup:0,text:0,visible:1};
      var lit=0;
      for(var i=3;i<d.length;i+=4*97)if(d[i]>8)lit++;
      return {host:id+' '+w+'x'+h,markup:lit,text:0,visible:1};}
     return {host:id,
      markup:host.innerHTML.length,
      text:host.innerText.trim().length,
      visible:1};},hid);
    const bad=!r||r.markup<(/ \d+x\d+$/.test(r.host)?FLOOR_CANVAS:FLOOR);
    rows.push([wn,who,nm,bad?'EMPTY':'ok',r?r.markup:0,r?r.text:0,r?r.host:'-']);
    if(bad)fails.push(wn+'/'+who+'/'+nm+' rendered '+(r?r.markup:0)+' characters');}}
  errs.forEach(e=>{rows.push([wn,'-','pageerror','ERROR',0,0,e]); fails.push(wn+' threw: '+e);});
  await c.close();}
 await b.close();

 const when=new Date().toISOString().replace('T',' ').slice(0,19);
 let out='\n'+'='.repeat(74)+'\n'
  +when+'  commit '+commit+' ('+dirty+')  md5 '+md5+'\n'
  +'  '+subject+'\n'+'-'.repeat(74)+'\n';
 rows.forEach(r=>{out+='  '+String(r[0]).padEnd(8)+String(r[1]).padEnd(7)
  +String(r[2]).padEnd(11)+String(r[3]).padEnd(7)
  +String(r[4]).padStart(7)+' markup '+String(r[5]).padStart(6)+' text  '
  +(r[6]||'')+'\n';});
 out+='-'.repeat(74)+'\n  '+(fails.length?fails.length+' FAILING: '+fails.join(' | '):'all surfaces render')+'\n';
 fs.appendFileSync(LOG,out);
 console.log(out.trim());
 process.exit(fails.length?1:0);
})();
