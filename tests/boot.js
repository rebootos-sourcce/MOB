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
 '/cut60.html':raw.subarray(0,Math.floor(raw.length*0.6))};

/* SERVED IN CHUNKS, AND THIS IS THE LOAD BEARING LINE OF THE GATE. The first
   cut sent each file in one write and passed the unfixed guard: with the
   whole file in hand the parser runs the guard and the main script with no
   turn of the event loop between them, so no extension error can land in the
   gap. His browser reads a two and a half megabyte file from disk or a
   preview pane in pieces, and the gap is where the false alarm lived. 64KB
   every 10ms makes that gap certain rather than lucky. */
const server=http.createServer((q,r)=>{const b=PAGES[q.url.split('?')[0]];
 if(!b){r.writeHead(404);r.end();return;}
 r.writeHead(200,{'content-type':'text/html; charset=utf-8'});
 let i=0; const step=()=>{ if(i>=b.length){r.end();return;}
  r.write(b.subarray(i,i+65536)); i+=65536; setTimeout(step,10); }; step();});

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
 }catch(e){ fail++; console.log('  FAIL the gate itself threw: '+(e&&e.message)); }
 finally{ server.close(); cleanup(); }
 console.log('\n===== '+pass+' passed, '+fail+' failed =====');
 process.exit(fail?1:0);
})();
