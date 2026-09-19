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

/* every surface, by the integer that is its identity. Names are for the log. */
const TABS=[['story',0],['summary',1],['field',2],['body',3],['intake',5],
            ['knowledge',6],['games',7],['compass',8],['settings',9]];
const WIDTHS=[[1600,1000,'desktop'],[390,844,'phone']];
/* a surface is empty below this much markup. Chosen against a measured
   floor: the thinnest healthy surface in the build is the compass at about
   1,900 characters, and a host that failed to render sits under 200. */
const FLOOR=400;

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
  for(const who of ['blank','loaded']){
   if(who==='loaded')await p.evaluate(i=>loadP(i),L);
   for(const [nm,t] of TABS){
    await p.evaluate(k=>setTab(k),t); await p.waitForTimeout(420);
    const r=await p.evaluate(()=>{
     const st=document.querySelector('.stage'); if(!st)return null;
     const vis=[...st.children].filter(e=>{const s=getComputedStyle(e);
      const b=e.getBoundingClientRect();
      return s.display!=='none'&&b.width>0&&b.height>0;});
     const host=vis[0]||null;
     return {host:host?(host.id||host.className.toString().slice(0,12)):'NONE',
      markup:host?host.innerHTML.length:0,
      text:host?host.innerText.trim().length:0,
      visible:vis.length};});
    const bad=!r||r.markup<FLOOR;
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
