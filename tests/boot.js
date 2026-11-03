/* ============================================================
   THE BOOT GUARD, GATED. node tests/boot.js

   Nothing asserted anything about the guard in atuned_src/shell/guard.html,
   and that is how a false alarm reached the owner for weeks: "This build
   stopped while it was starting up." over an app that had started. It was
   reproduced 27 September with a real browser extension, the thing every
   real machine has and a clean headless browser never does. An extension's
   script threw while the raw file was still being read in chunks, the guard
   held the error, and painted it over a finished start up. Its own text gave
   it away: "stopped after ui/ui.js", the last module, and a filename
   beginning chrome-extension://.

   So this gate loads the build the way his browser does, with an extension
   that throws every 20ms, and asserts both halves of the guard's job:
   quiet when the instrument started, whoever threw; loud, with our own error
   first, when it did not. The known bad cases are made from the built file
   at test time, so they cannot drift from it.

   Checked against a known bad guard first, the standing rule for any tool
   here: on the guard as it was before the fix, the first assertion below
   fails under this extension. A gate that passes the bug is not a gate.

   Content scripts from an unpacked extension do not run on file:// by
   default, so the files are served over a local server, from memory.
   Every browser profile made here is removed on the way out, because the
   shared disk has filled before.

   AND THE SHEET THAT IS UP WHILE THE GUARD WATCHES MUST NOT EAT A PRESS,
   section 4, 23 October, the fourth lesson. The owner: "Find why presses
   right after boot are dropped." The sheet's own CSS clock and the script
   that decided its press disagreed at both ends, so a press made in the
   overture before the main script had arrived reached a frame with nothing
   listening, and a press as the app came into view was eaten as a skip. Every gate here waited the
   boot out before pressing, so none of them could see it. Section 4 presses
   during the boot on purpose, on the page's own clock, including through a
   held arrival that keeps the instrument from starting while the sheet is
   up, and it holds the old ruling beside the fix: a press while the overture
   stands is the skip and does not also press the app.
   ============================================================ */
const fs=require('fs'), path=require('path'), os=require('os'), http=require('http');
const {execFileSync}=require('child_process');
const {chromium}=require('playwright');
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ROOT=process.cwd();
const FILE=path.resolve(process.env.ATUNED_FILE||'source.html');

let pass=0, fail=0;
function ok(c,msg){ if(c){pass++;console.log('  ok   '+msg);} else {fail++;console.log('  FAIL '+msg);} }

const TMP=fs.mkdtempSync(path.join(os.tmpdir(),'atuned-boot-'));
const cleanup=()=>{ try{fs.rmSync(TMP,{recursive:true,force:true});}catch(e){} };

/* the extension: a main world script at document start that throws on a
   timer, which is what wallets, password managers and translators do on a
   page they do not understand */
const EXT=path.join(TMP,'ext');
fs.mkdirSync(EXT);
fs.writeFileSync(path.join(EXT,'manifest.json'),JSON.stringify({manifest_version:3,
 name:'boot gate probe',version:'1',content_scripts:[{matches:['<all_urls>'],js:['inpage.js'],
 run_at:'document_start',world:'MAIN',all_frames:true}]}));
fs.writeFileSync(path.join(EXT,'inpage.js'),
 'var n=0,t=setInterval(function(){ if(++n>150)clearInterval(t); null.probeExtension; },20);');

/* the builds: raw, packed by the real packer, and the known bad cases */
const raw=fs.readFileSync(FILE);
const packOut=path.join(TMP,'packed.html');
execFileSync('node',[path.join(ROOT,'tools','pack.js'),path.relative(ROOT,FILE),path.relative(ROOT,packOut)],
 {cwd:ROOT,stdio:'pipe'});
const packed=fs.readFileSync(packOut);
const CHECK="try{window.__at&&window.__at('engine/read.js');}catch(e){}";
const src=raw.toString('utf8');
if(src.indexOf(CHECK)<0){console.log('  FAIL the engine/read.js checkpoint is not in the build, so the known bad case cannot be made');process.exit(1);}
const ownFatal=Buffer.from(src.replace(CHECK,CHECK+'\nnull.probeOwnFatal;'),'utf8');
const ownFatalOut=path.join(TMP,'own-fatal.html');
fs.writeFileSync(ownFatalOut,ownFatal);
execFileSync('node',[path.join(ROOT,'tools','pack.js'),path.relative(ROOT,ownFatalOut),path.relative(ROOT,path.join(TMP,'own-fatal-packed.html'))],
 {cwd:ROOT,stdio:'pipe'});
const PAGES={
 '/raw.html':raw, '/packed.html':packed, '/own-fatal.html':ownFatal,
 '/own-fatal-packed.html':fs.readFileSync(path.join(TMP,'own-fatal-packed.html')),
 '/cut60.html':raw.subarray(0,Math.floor(raw.length*0.6)),
 '/raw-held.html':raw, '/raw-held-long.html':raw};
/* THE HELD ARRIVAL, for section 4. Everything up to the end of the guard's own
   block is sent as usual, so the sheet is painted and the guard is listening,
   and then nothing for HELD_MS, so nothing of the instrument has run: what a
   slow connection does to the live file, made exact rather than lucky. Then
   the rest goes in one write, so the start up follows as soon as it can. Found
   by its own text, never by an offset, and a build without it fails by name.
   The long one is held until the test lets it go, past the sheet's own fade,
   which is the slow phone or the slow connection whose start up outlasts the
   overture; let go by the test, not a timer, so the start up lands as early
   as the measurement allows and well clear of the guard's own watchdog. */
const HELD_MS=1200;
const gEnd=(()=>{const m=/window\.__bootOk\s*=\s*function/.exec(src); if(!m)return -1;
 const i=src.indexOf('</script>',m.index); return i<0?-1:Buffer.byteLength(src.slice(0,i+9),'utf8');})();
if(gEnd<0){console.log('  FAIL the end of the guard\'s block is not in the build, so the held arrival cannot be made');process.exit(1);}
let releaseLong=()=>{};
const HELD={'/raw-held.html':{at:gEnd,go:()=>new Promise(r=>setTimeout(r,HELD_MS))},
 '/raw-held-long.html':{at:gEnd,go:()=>new Promise(r=>{releaseLong=r;})}};

/* SERVED IN CHUNKS, AND THIS IS THE LOAD BEARING LINE OF THE GATE. The first
   cut sent each file in one write and passed the unfixed guard: with the
   whole file in hand the parser runs the guard and the main script with no
   turn of the event loop between them, so no extension error can land in the
   gap. His browser reads a two and a half megabyte file from disk or a
   preview pane in pieces, and the gap is where the false alarm lived. 64KB
   every 10ms makes that gap certain rather than lucky. */
const server=http.createServer((q,r)=>{const u=q.url.split('?')[0], b=PAGES[u];
 if(!b){r.writeHead(404);r.end();return;}
 r.writeHead(200,{'content-type':'text/html; charset=utf-8'});
 let i=0, hold=HELD[u]||null;
 const step=()=>{ if(i>=b.length){r.end();return;}
  if(hold&&i===hold.at){const h=hold; hold=null; h.go().then(()=>{r.write(b.subarray(i)); i=b.length; r.end();}); return;}
  const n=hold&&hold.at>i?Math.min(65536,hold.at-i):65536;
  r.write(b.subarray(i,i+n)); i+=n; setTimeout(step,10); }; step();});

async function withExtension(page,fn){
 const ud=fs.mkdtempSync(path.join(TMP,'ud-'));
 const ctx=await chromium.launchPersistentContext(ud,{headless:false,executablePath:CHROME,
  viewport:{width:1600,height:1000},
  args:['--headless=new','--disable-extensions-except='+EXT,'--load-extension='+EXT]});
 try{ const p=ctx.pages()[0]||await ctx.newPage();
  await p.goto(BASE+page); await p.waitForTimeout(9000); return await fn(p); }
 finally{ await ctx.close(); fs.rmSync(ud,{recursive:true,force:true}); }}
const read=p=>p.evaluate(()=>{const a=document.querySelector('[role=alert]');
 return {alert:!!a,pre:a&&a.querySelector('pre')?a.querySelector('pre').textContent:'',
  tabs:document.querySelectorAll('#tabbar [data-tabk]').length,
  def:typeof TABDEF!=='undefined'?TABDEF.length:-1};});

/* SECTION 4's TOOLS. The sheet's fade is read off its own bootOut animation,
   never typed here, and every press is placed and judged on the page's own
   clock: a window listener records each press's timeStamp, the moment the
   person pressed, which is the only time that says what was on screen. It is
   registered after the page's own, so it sees a press the boot stopped. */
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
/* page side: when the sheet's own fade is due, null until the overture is on
   the clock. Read off the fade's own start while it has one; while the
   instrument starts the fix holds the fade paused, and a paused animation
   has no start time, so then the overture's own zero is read off the
   sheet's opening beat, bootIn on .boot::before, which starts on the same
   frame and is never held. Section 4 checks the two agree. */
const FADE=()=>{const e=document.getElementById('boot'); if(!e)return null;
 const all=e.getAnimations({subtree:true});
 const a=all.find(x=>x.animationName==='bootOut'), b=all.find(x=>x.animationName==='bootIn');
 const s=a&&a.startTime!=null?a.startTime:b&&b.startTime!=null?b.startTime:null;
 if(!a||s==null)return null;
 const t=a.effect.getComputedTiming();
 return {begin:s+t.delay,end:s+t.endTime,own:a.startTime!=null,beat:b&&b.startTime!=null?b.startTime:null,
  fade:a.startTime};};
async function pressPage(b,pg,o){o=o||{};
 const ctx=await b.newContext({viewport:{width:o.w||1600,height:o.h||1000},hasTouch:!!o.touch,isMobile:!!o.touch});
 const p=await ctx.newPage();
 await p.goto(BASE+pg,{waitUntil:'commit'});
 return {ctx,p};}
/* the sheet up with its fade on the clock, the target found, the recorder in
   place. After the build is in the document, because the packed file's
   document.open erases every listener put there before it. */
/* EVERY WAIT SAYS WHAT IT WAITED FOR, AND NO WAIT IS FOR A THING THAT MAY
   NEVER COME. Measured 23 October with the machine at a load of eleven to
   thirteen on four cores: a wait for the fade to be readable, on a page
   whose sheet had already gone, could only time out, and it took every
   check after it down with it as "the gate itself threw", naming nothing.
   So arm waits for the fade to be readable or the sheet to be gone, says
   which, and each block below runs on its own, so one that throws costs one
   named failure and the rest still run. */
async function waitFor(p,fn,ms,what){
 try{await p.waitForFunction(fn,null,{timeout:ms});}
 catch(e){throw new Error('waiting for '+what+': '+String(e&&e.message||e).split('\n')[0]);}}
const booted=p=>waitFor(p,()=>document.documentElement.getAttribute('data-boot')==='ok',30000,'the start up to say it finished');
async function block(name,fn){try{await fn();}
 catch(e){ok(false,name+': the check itself threw, '+String(e&&e.message||e).split('\n')[0]);}}
/* GONE MEANS IT WAS THERE AND LEFT, which only the start up can do. Before
   the start up has finished, a sheet missing from the document is one that
   has not arrived yet. The first cut of this read "no sheet" as gone, and
   on every held arrival it resolved before the body had been parsed and
   failed the fixed build three times over, which is how it was found. */
const FADE_OR_GONE='(('+FADE+')()!==null||(document.documentElement.getAttribute("data-boot")==="ok"&&!document.getElementById("boot")))';
async function arm(p,sel){
 await waitFor(p,FADE_OR_GONE,30000,'the sheet to have its overture on the clock, or to have gone');
 const fade=await p.evaluate(FADE);
 return p.evaluate(([fade,sel])=>{
  window.__press=null; addEventListener('pointerdown',e=>{if(window.__press==null)window.__press=e.timeStamp;},true);
  /* TAB is the navigation a person reaches for: the first tab in the bar
     that is on screen and is not the open one, or, when the open section
     shows only its own tab, the first section door on screen that is not
     pressed, whose press opens what secGo opens. The first cut knew only the
     tab strip, and when the app came to open on Discover, a section of one
     tab, there was nothing left in it to press (23 October). */
  const vis=x=>{const b=x.getBoundingClientRect();return b.width>0&&b.height>0;};
  let t=null,k=null,what=null;
  if(sel==='TAB'){
   t=[...document.querySelectorAll('#tabbar [data-tabk]')].find(x=>+x.getAttribute('data-tabk')!==S.tab&&vis(x))||null;
   if(t){k=+t.getAttribute('data-tabk'); what='the tab for '+k;}
   else{t=[...document.querySelectorAll('#secbar .secb[aria-pressed="false"]')].find(vis)||null;
    if(t){const sec=t.getAttribute('data-sec'), last=typeof SEC_LAST!=='undefined'?SEC_LAST[sec]:undefined;
     const f=TABDEF.filter(T=>T.sec===sec)[0]; k=last!==undefined?last:f?f.k:null;
     what='the section door for '+sec+', which opens '+k;}}}
  else t=sel&&document.querySelector(sel);
  const r=t&&t.getBoundingClientRect();
  return {fade,now:performance.now(),x:r?r.x+r.width/2:null,y:r?r.y+r.height/2:null,k,what};},[fade,sel]);}
/* press at a time on the page's clock. A timer is never early, so a press
   can only land late, and each check below says where it actually landed. */
async function pressAt(p,a,pageMs,touch){
 const off=Date.now()-a.now;
 await sleep(Math.max(0,pageMs+off-Date.now()));
 if(touch)await p.touchscreen.tap(a.x,a.y); else await p.mouse.click(a.x,a.y,{delay:60});}
const settled=async p=>{try{await p.waitForFunction(()=>!document.getElementById('boot'),null,{timeout:15000});}catch(e){}
 await sleep(400);
 return p.evaluate(()=>({press:window.__press,gone:!document.getElementById('boot'),
  door:typeof LOGIN!=='undefined'?LOGIN.open:null,tab:typeof S!=='undefined'&&S?S.tab:null}));};

let BASE='';
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 BASE='http://127.0.0.1:'+server.address().port;
 try{
  console.log('\n=== quiet when the instrument started, whoever threw ===');
  for(const pg of ['/raw.html','/packed.html']){
   const r=await withExtension(pg,read);
   ok(!r.alert,pg+' under a throwing extension: no full screen message'
    +(r.alert?', it said: '+r.pre.split('\n').slice(0,5).join(' | '):''));
   ok(r.def>0&&r.tabs===r.def,pg+' and every tab is there, '+r.tabs+' of '+r.def);}

  console.log('\n=== loud, and our own error first, when it did not ===');
  for(const pg of ['/own-fatal.html','/own-fatal-packed.html']){
   const r=await withExtension(pg,read);
   ok(r.alert,pg+' a module that throws at the top level stops the build, and the guard says so');
   const own=r.pre.indexOf('probeOwnFatal'), ext=r.pre.indexOf('chrome-extension://');
   ok(own>=0&&(ext<0||own<ext),pg+' our error is named before any extension line'
    +' (at '+own+', extension at '+ext+')');
   ok(/stopped after engine\/read\.js/.test(r.pre),pg+' and it names the module it stopped after');}
  {const r=await withExtension('/cut60.html',read);
   ok(r.alert&&/The file is short\. The end of it never arrived\./.test(r.pre),'a file cut to 60 percent says the file is short');}

  console.log('\n=== one press copies the lines ===');
  {const b=await chromium.launch({executablePath:CHROME});
   try{const c=await b.newContext({permissions:['clipboard-read','clipboard-write']});
    const p=await c.newPage(); await p.goto(BASE+'/own-fatal.html'); await p.waitForTimeout(3000);
    const btn=p.locator('[role=alert] button');
    if(!(await btn.count()))throw new Error('there is no copy button on the message');
    const box=await btn.boundingBox();
    ok(!!box&&box.height>=44,'the copy button is there, at the touch floor, '+(box?box.height:0)+'px');
    await btn.click(); await p.waitForTimeout(300);
    const got=await p.evaluate(async()=>({clip:await navigator.clipboard.readText(),
     pre:document.querySelector('[role=alert] pre').textContent}));
    ok(got.clip.length>0&&got.clip===got.pre,'and the clipboard holds exactly the lines shown, '+got.clip.length+' characters');}
   finally{await b.close();}}

  /* ============================================================
     4. A PRESS IS NEVER LOST TO THE BOOT SHEET. 23 October.

     The owner: "Find why presses right after boot are dropped." The sheet
     takes no pointer and fades on its own CSS clock from its first painted
     frame; the press it owns was decided by a listener that did not exist
     until the whole start up had run, and let go only when the script heard
     the fade end. Swept with one real press per load on the live file served
     in pieces: until the main script began to run, 824ms in on this machine
     and as long as the file takes to arrive on a slow connection, a press
     reached a frame with nothing listening and was lost (one made while the
     start up runs waits behind it instead); every press late in the fade,
     and one 6ms after
     the sheet was invisible, was eaten as a skip. shell/body.html decides the
     press now, ahead of the sheet, by the press's own time against the
     fade's own start.

     Each check states its own precondition, so none of them can pass for
     the wrong reason, and the last pair holds the ruling the fix must not
     break: a press while the overture stands is the skip, and only that.
     Checked against the build from before the fix first, a4c2872b, three
     runs: every check of a lost press, and of the sheet lifting over a frame
     with nothing in it, failed each time, while every precondition and the
     ruling's pair passed; the fix passed every check on every run. The
     counts are in tests/floors.json, where a count is dated on purpose.
     ============================================================ */
  console.log('\n=== a press is never lost to the boot sheet ===');
  {const b=await chromium.launch({executablePath:CHROME});
   try{
    /* BEFORE THE START UP HAS RUN. The held arrival puts the sheet on screen,
       its overture running, with nothing of the instrument loaded, which is
       what a slow connection does to the live file. A press then must not
       vanish: it is the skip, kept until the instrument can act on it. */
    await block('raw, held arrival',async()=>{const {ctx,p}=await pressPage(b,'/raw-held.html');
     try{const a=await arm(p,null);
      if(!a.fade){ok(false,'raw, held arrival: the sheet never put its overture on the clock');return;}
      const pre=await p.evaluate(()=>{window.__okAt=null;
       new MutationObserver(()=>{if(window.__okAt==null&&document.documentElement.getAttribute('data-boot')==='ok')
        window.__okAt=performance.now();}).observe(document.documentElement,{attributes:true});
       return {guard:typeof window.__bootOk==='function',started:typeof TABDEF!=='undefined',
        ok:document.documentElement.getAttribute('data-boot')};});
      ok(pre.guard&&!pre.started&&pre.ok!=='ok','raw, held arrival: the sheet is up with its overture on the clock, the guard is listening, and nothing of the instrument has run');
      await p.mouse.click(800,500,{delay:60});
      await booted(p);
      await sleep(700);
      const r=await p.evaluate(()=>({press:window.__press,okAt:window.__okAt,gone:!document.getElementById('boot'),
       now:performance.now(),door:typeof LOGIN!=='undefined'?LOGIN.open:null}));
      ok(r.press!=null&&r.okAt!=null&&r.press<r.okAt&&r.gone&&r.now<a.fade.begin,
       'raw, held arrival: a press made before the start up had run is kept and acted on as the skip, not lost:'
       +' pressed at '+Math.round(r.press)+'ms, start up done at '+Math.round(r.okAt)+'ms, sheet '
       +(r.gone?'gone':'STILL UP')+' at '+Math.round(r.now)+'ms, its own fade not due until '+Math.round(a.fade.begin)+'ms');
      ok(r.door===true,'and that skip did not also press the app: the door is standing');}
     finally{await ctx.close();}});

    /* WHEN THE START UP OUTLASTS THE OVERTURE. Held past the sheet's own fade,
       so its CSS clock runs out while nothing of the instrument has run. The
       sheet must not lift over that empty frame, a press then must be taken
       by the sheet and not fall onto a frame with nothing listening, and the
       sheet may begin to leave only once the start up has finished. */
    await block('raw, long arrival',async()=>{const {ctx,p}=await pressPage(b,'/raw-held-long.html');
     try{const a=await arm(p,null), off=Date.now()-a.now, until=ms=>sleep(Math.max(0,ms+off-Date.now()));
      if(!a.fade){ok(false,'raw, long arrival: the sheet never put its overture on the clock');return;}
      await p.evaluate(()=>{window.__okAt=null; window.__fadeAt=null; window.__fell=false;
       new MutationObserver(()=>{if(window.__okAt==null&&document.documentElement.getAttribute('data-boot')==='ok')
        window.__okAt=performance.now();}).observe(document.documentElement,{attributes:true});
       document.getElementById('boot').addEventListener('animationstart',e=>{
        if(e.animationName==='bootOut'&&window.__fadeAt==null)window.__fadeAt=performance.now();});
       /* a press that gets past the window reached the frame under the sheet */
       document.addEventListener('pointerdown',()=>{window.__fell=true;},true);});
      /* AND THE PAGE BUSY AS THE FADE FALLS DUE, the way a slow phone's
         parser chews a large piece of the file as it arrives. A hold put in
         place just before the fade cannot land through that, and one put in
         place seconds earlier does not care, so this is what tells a hold
         that cannot race from one that usually wins. Without it the first
         hold passed here on a quiet machine and failed under load. */
      await until(a.fade.begin-200);
      await p.evaluate(()=>{const s=performance.now();while(performance.now()-s<500){}});
      await until(a.fade.end+300);
      const mid=await p.evaluate(()=>{const e=document.getElementById('boot');
       return {started:typeof TABDEF!=='undefined',ok:document.documentElement.getAttribute('data-boot'),
        op:e?+getComputedStyle(e).opacity:null,now:performance.now()};});
      ok(!mid.started&&mid.ok!=='ok'&&mid.now>a.fade.end,'raw, long arrival: the sheet\'s own fade was due to end at '
       +Math.round(a.fade.end)+'ms, it is '+Math.round(mid.now)+'ms, and nothing of the instrument has run');
      ok(mid.op===1,'and the sheet is still standing, opacity '+mid.op+', with the page busy as its fade fell due, not lifted over a frame with nothing in it');
      await p.mouse.click(800,500,{delay:60});
      const fell=await p.evaluate(()=>window.__fell);
      ok(!fell,'and a press then is taken by the sheet as the skip, not dropped onto the frame under it'
       +(fell?': it fell through to a frame with nothing listening':''));
      releaseLong();
      await booted(p);
      try{await p.waitForFunction(()=>!document.getElementById('boot'),null,{timeout:5000});}catch(e){}
      const r=await p.evaluate(()=>({okAt:window.__okAt,fadeAt:window.__fadeAt,gone:!document.getElementById('boot')}));
      ok(r.okAt!=null&&r.gone&&(r.fadeAt==null||r.fadeAt>=r.okAt-1),'and it began to leave only once the instrument could take a press: start up done at '
       +(r.okAt==null?'never':Math.round(r.okAt)+'ms')+', its fade began '+(r.fadeAt==null?'never, the skip took it':'at '+Math.round(r.fadeAt)+'ms')
       +', sheet '+(r.gone?'gone':'STILL UP'));}
     finally{releaseLong(); await ctx.close();}});
    /* and with no press at all, the held sheet still goes, whole and on its
       own curve, once there is an instrument behind it */
    await block('raw, long arrival with no press',async()=>{const {ctx,p}=await pressPage(b,'/raw-held-long.html');
     try{const a=await arm(p,null), off=Date.now()-a.now, until=ms=>sleep(Math.max(0,ms+off-Date.now()));
      if(!a.fade){ok(false,'raw, long arrival with no press: the sheet never put its overture on the clock');return;}
      await p.evaluate(()=>{const L=window.__L={ok:null,start:null,end:null,gone:null};
       const e=document.getElementById('boot');
       e.addEventListener('animationstart',ev=>{if(ev.target===e&&ev.animationName==='bootOut'&&L.start==null)L.start=performance.now();});
       e.addEventListener('animationend',ev=>{if(ev.target===e&&ev.animationName==='bootOut'&&L.end==null)L.end=performance.now();});
       new MutationObserver(()=>{if(L.ok==null&&document.documentElement.getAttribute('data-boot')==='ok')L.ok=performance.now();
        if(L.gone==null&&!document.getElementById('boot'))L.gone=performance.now();})
        .observe(document,{attributes:true,childList:true,subtree:true});});
      await until(a.fade.end+300);
      releaseLong();
      try{await p.waitForFunction(()=>window.__L.gone!=null,null,{timeout:20000});}catch(e){}
      const L=await p.evaluate(()=>window.__L);
      /* by order, not by length: animationstart and animationend each land on
         a frame, and the first frames after a long start up are long, so the
         gap between them is not the fade's length. animationend only fires
         for a fade that ran to its own end, which is the claim. */
      const at=v=>v==null?'never':Math.round(v)+'ms';
      const held=L.ok!=null&&L.start!=null&&L.start>=L.ok&&L.end!=null&&L.end>L.start&&L.gone!=null&&L.gone>=L.end-1;
      ok(held,'raw, long arrival with no press: the sheet stands until the start up finishes, then its own fade runs to its end:'
       +' start up done at '+at(L.ok)+', fade '+at(L.start)+' to '+at(L.end)+', sheet left at '+at(L.gone)
       +(held?'':(L.start!=null&&L.ok!=null&&L.start<L.ok?', and it did not: it faded while nothing of the instrument had run':', and it did not'))); }
     finally{releaseLong(); await ctx.close();}});

    /* AS THE APP COMES INTO VIEW. Once the sheet has begun its own fade there
       is nothing left to skip, so a press then is the person reaching for what
       is appearing and must land there. Placed at the middle of the fade, on
       the page's clock; a late timer can only push it further in. */
    const release=(pg,label,sel,o,landed)=>block(label,async()=>{
     const {ctx,p}=await pressPage(b,pg,o);
     try{await booted(p);
      const a=await arm(p,sel);
      if(!a.fade){ok(false,label+': the start up finished after the sheet had already gone, so no press can be placed in its fade');return;}
      if(a.x==null){ok(false,label+': there is no '+sel+' on the page to press');return;}
      if(a.now>=a.fade.begin){ok(false,label+': the start up finished after the fade began, so no press can be placed in it');return;}
      await pressAt(p,a,a.fade.begin+(a.fade.end-a.fade.begin)/2,o&&o.touch);
      const r=await settled(p);
      ok(r.press!=null&&r.press>=a.fade.begin&&landed(r,a),label+(a.what?', '+a.what:'')+': a press '+Math.round(r.press-a.fade.begin)
       +'ms into the sheet\'s '+Math.round(a.fade.end-a.fade.begin)+'ms fade reaches the app'
       +(landed(r,a)?'':', and it did not: it was eaten as a skip with nothing left to skip'));}
     finally{await ctx.close();}});
    await release('/raw.html','raw, the door at 1600, Guest','#loginb-skip',null,r=>r.door===false);
    await release('/packed.html','packed, the door at 1600, Guest','#loginb-skip',null,r=>r.door===false);
    await release('/raw.html?dev=1','raw, the navigation at 1600','TAB',null,(r,a)=>r.tab===a.k);
    await release('/raw.html','raw, the door at 390 by touch, Guest','#loginb-skip',{w:390,h:844,touch:true},r=>r.door===false);

    /* AND JUST AFTER IT HAS GONE FROM VIEW, WITH THE PAGE BUSY. The fade's
       frames are the heaviest of the session, because the Field's entrance
       starts with them: tests/design.js gate 11 measured animationend 150ms
       late under load. Held busy from just before the fade's end, the way
       those frames hold it, a press made after the sheet is invisible waits
       for the page and is handed out before the frame that would remove the
       sheet. Measured ten times out of ten, so this is not a race: it is
       always the case the old capture got wrong. */
    await block('raw, busy page',async()=>{const {ctx,p}=await pressPage(b,'/raw.html');
     try{await booted(p);
      const a=await arm(p,'#loginb-skip');
      if(!a.fade){ok(false,'raw, busy page: the start up finished after the sheet had already gone, so the press cannot be placed');return;}
      if(a.now>=a.fade.begin){ok(false,'raw, busy page: the start up finished after the fade began, so the press cannot be placed');}
      else{const off=Date.now()-a.now;
       await sleep(Math.max(0,a.fade.end-60+off-Date.now()));
       const busy=p.evaluate(()=>{const s=performance.now();while(performance.now()-s<300){}}).catch(()=>{});
       await sleep(Math.max(0,a.fade.end+45+off-Date.now()));
       await p.mouse.click(a.x,a.y,{delay:60});
       await busy;
       const r=await settled(p);
       ok(r.press!=null&&r.press>=a.fade.end&&r.door===false,'raw, the door at 1600, Guest, with the page busy: a press '
        +Math.round(r.press-a.fade.end)+'ms after the sheet was invisible reaches the app'
        +(r.door===false?'':', and it did not: it was eaten as a skip over an app in view'));}}
     finally{await ctx.close();}});

    /* AND THE RULING STANDS. A press while the overture is still standing is
       the skip and only the skip: it does not also press what is under it.
       Guest is under this press; the door must still be there after it. */
    await block('raw, the overture',async()=>{const {ctx,p}=await pressPage(b,'/raw.html');
     try{await booted(p);
      const a=await arm(p,'#loginb-skip');
      if(!a.fade){ok(false,'raw, the overture: the start up finished after the sheet had already gone, so nothing can be pressed inside it');return;}
      /* THE TOOL FIRST. While the instrument starts, the fade's own start
         time is held back, and FADE reads the overture's zero off the
         opening beat instead. That is only true if the two start on one
         frame, so it is checked here, once the fade is back on its clock. */
      ok(a.fade.own&&a.fade.beat!=null&&Math.abs(a.fade.fade-a.fade.beat)<1,'the overture\'s own clock: the sheet\'s fade and its opening beat'
       +' start on one frame, '+Math.round(a.fade.fade)+'ms and '+(a.fade.beat==null?'none':Math.round(a.fade.beat)+'ms'));
      if(a.now+300>a.fade.begin-1000){ok(false,'raw, the overture: the start up finished too late to press inside the overture');}
      else{await pressAt(p,a,a.now+300,false); await sleep(700);
       const r=await p.evaluate(()=>({press:window.__press,gone:!document.getElementById('boot'),
        now:performance.now(),door:typeof LOGIN!=='undefined'?LOGIN.open:null}));
       ok(r.press!=null&&r.press<a.fade.begin&&r.gone&&r.now<a.fade.begin,'raw, the overture: a press '
        +Math.round(a.fade.begin-r.press)+'ms before the fade was due is the skip, and the sheet left at once');
       ok(r.door===true,'and it did not also press the app: Guest was under it and the door is still standing');}}
     finally{await ctx.close();}});
   }finally{await b.close();}}
 }catch(e){ fail++; console.log('  FAIL the gate itself threw: '+(e&&e.message)); }
 finally{ server.close(); cleanup(); }
 console.log('\n===== '+pass+' passed, '+fail+' failed =====');
 process.exit(fail?1:0);
})();
