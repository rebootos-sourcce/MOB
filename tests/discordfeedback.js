/* ============================================================
   DISCORD FEEDBACK, GATED. node tests/discordfeedback.js

   3 October, the owner: "Put Discord feedback in the profile. And when a
   person selects it, it takes them to the feedback page, that dumps the data
   into the customer service support on Discord. And they can join the
   Discord channel."

   THE FUNCTION, headless. functions/feedback.js is imported as the module
   Cloudflare runs, its envelope lists are held equal to the engine's, and
   every way a request can be wrong is sent at it. Discord is a stub: the
   real webhook address is a Pages variable this repository never sees, and
   this sandbox cannot reach discord.com in any case, so the live relay is
   verified only after the owner sets the variable and the site deploys.
   Then the same suite runs on copies of the Function with each rule broken,
   and must fail on every one. A gate that cannot fail is not a gate.

   THE APP AGAINST THE FUNCTION, in Chromium, over real http. tests/feedback.js
   runs from a file, where a relative address has no host, so it points
   FEEDBACK_URL at a stub. This one serves the built page from a local server
   whose POST /feedback is the real Function's own handler, so what is tested
   is the relative address, the Function's real answers and the sentences the
   app makes of them. The profile menu's Discord feedback row opens Help with
   the comment sheet over it, an unset variable is said as held and never
   sent, a Discord yes is the only thing said as sent, and the join row is
   absent until COMMUNITY_INVITE holds a real invite. At 1600 and at 390.

   SHOTS=dir writes the screenshots there.
   ============================================================ */
const fs=require('fs'), path=require('path'), vm=require('vm'), http=require('http');
const ROOT=process.cwd();
const FN_FILE=path.resolve(ROOT,'functions/feedback.js');
const ENGINE_FILE=path.resolve(ROOT,process.env.ENGINE||'engine.js');
const J=x=>JSON.stringify(x);
/* shaped like a Discord webhook so the Function's shape check passes, and not
   one: fetch is stubbed for every test that carries it, so it is never called */
const FAKE_HOOK='https://discord.com/api/webhooks/123456789012345678/gate-token-not-a-real-one';
const fnImport=src=>import('data:text/javascript;charset=utf-8,'+encodeURIComponent(src));

function engineLists(){
 const ctx={module:{exports:{}}, console:console};
 vm.createContext(ctx); vm.runInContext(fs.readFileSync(ENGINE_FILE,'utf8'),ctx,{filename:'engine-copy.js'});
 return {keys:ctx.module.exports.OB_KEYS||ctx.OB_KEYS, kinds:ctx.module.exports.OB_KINDS||ctx.OB_KINDS};}

/* one request at the handler, with Discord answering as told */
async function hit(F,o){
 const heard=[], logs=[];
 const realFetch=globalThis.fetch, realErr=console.error;
 globalThis.fetch=async(url,init)=>{ heard.push({url:String(url), body:JSON.parse(init.body)});
  if(o.discord==='throw')throw new TypeError('fetch failed');
  return new Response(null,{status:o.discord||204}); };
 console.error=(...a)=>logs.push(a.join(' '));
 try{
  const h={}; if(o.type!==null)h['content-type']=o.type||'application/json';
  const req=new Request('https://atuned.world/feedback',{method:o.method||'POST', headers:h,
   body:(o.method&&o.method!=='POST')?undefined:(typeof o.body==='string'?o.body:J(o.body))});
  const res=await F.onRequest({request:req, env:o.env||{}});
  const text=await res.text(); let b=null; try{ b=JSON.parse(text); }catch(e){}
  return {status:res.status, body:b, text, heard, logs, cache:res.headers.get('cache-control')};}
 finally{ globalThis.fetch=realFetch; console.error=realErr; }}

const good=()=>({kind:'comment',at:'2026-10-03',body:'the release timer reads wrong on the phone',
 answers:{},band:'median',build:'abc1234 2026-10-03 09:00',platform:'phone',viewport:'narrow'});

async function fnSuite(F,ok,lists){
 if(lists){
  ok(J(F.FB_KEYS)===J(lists.keys),'the Function takes exactly the envelope keys the engine sends, '+J(F.FB_KEYS));
  ok(J(F.FB_KINDS)===J(lists.kinds),'and exactly the engine\'s kinds, '+J(F.FB_KINDS));}
 let r=await hit(F,{method:'GET'});
 ok(r.status===405&&r.body&&r.body.ok===false,'a GET is refused with 405, '+r.text);
 r=await hit(F,{type:'text/plain',body:'hello'});
 ok(r.status===415,'a body that is not JSON by its type is refused with 415, '+r.status);
 r=await hit(F,{body:'{not json'});
 ok(r.status===400&&/not json/.test(r.body.error),'malformed JSON is refused by name, '+r.text);
 r=await hit(F,{body:Object.assign(good(),{email:'a@b.c'})});
 ok(r.status===400&&/email/.test(r.body.error)&&!r.heard.length,'an unknown key is refused by name and nothing reaches Discord, '+r.text);
 r=await hit(F,{body:Object.assign(good(),{kind:'newsletter'})});
 ok(r.status===400&&/kind/.test(r.body.error),'an unknown kind is refused, '+r.text);
 r=await hit(F,{body:Object.assign(good(),{body:'   '})});
 ok(r.status===400&&/nothing/.test(r.body.error),'an empty body with no answers is refused, '+r.text);
 r=await hit(F,{body:''});
 ok(r.status===400,'an empty request is refused, '+r.status);
 r=await hit(F,{body:Object.assign(good(),{body:'a'.repeat(F.FB_BODY_MAX+1)})});
 ok(r.status===400&&/limit/.test(r.body.error),'a body past the ceiling is refused with the ceiling named, '+r.text);
 r=await hit(F,{body:J(Object.assign(good(),{body:'a'.repeat(3000)}))+' '.repeat(F.FB_BYTES_MAX)});
 ok(r.status===413,'a request past the byte ceiling is refused with 413, '+r.status);
 r=await hit(F,{body:Object.assign(good(),{answers:{state:'Sharp'}})});
 ok(r.status===400,'an answer that is not a position is refused, '+r.status);

 /* the variable */
 r=await hit(F,{body:good(), env:{}});
 ok(r.status===503&&/not switched on/.test(r.body.error)&&!r.heard.length,
  'with DISCORD_FEEDBACK_WEBHOOK unset it answers 503 in words and posts nothing, '+r.text);
 r=await hit(F,{body:good(), env:{DISCORD_FEEDBACK_WEBHOOK:'https://discord.gg/an-invite-in-the-wrong-box'}});
 ok(r.status===503&&/set up wrong/.test(r.body.error)&&!r.heard.length
  &&r.logs.length===1&&r.logs.join().indexOf('wrong-box')<0,
  'a variable that is not a webhook is refused, logged by fault and never by value, '+J({s:r.status,logs:r.logs}));

 /* a yes */
 const env={DISCORD_FEEDBACK_WEBHOOK:FAKE_HOOK};
 const evil=Object.assign(good(),{body:'@everyone look ``` [click](https://evil.example) <@&123>'});
 r=await hit(F,{body:evil, env});
 const m=r.heard[0]&&r.heard[0].body, card=m&&m.embeds&&m.embeds[0];
 ok(r.status===200&&r.body.ok===true&&r.heard.length===1&&r.heard[0].url===FAKE_HOOK,
  'a good request is relayed once to the variable\'s address and answers ok, '+r.text);
 ok(r.text.indexOf('webhooks')<0&&r.text.indexOf('gate-token')<0,'the answer never carries the webhook address');
 ok(r.cache==='no-store','and is never cacheable, '+r.cache);
 ok(m&&m.allowed_mentions&&J(m.allowed_mentions.parse)==='[]','no mention in the text can ping anybody, '+J(m&&m.allowed_mentions));
 ok(card&&card.title==='Comment'&&/^```\n/.test(card.description)&&/\n```$/.test(card.description)
  &&(card.description.match(/```/g)||[]).length===2&&card.description.indexOf('@everyone')>0,
  'the words are fenced, a fence typed inside them cannot close it, and they arrive as typed, '+J(card&&card.description));
 ok(card&&J(card.fields.map(f=>f.name))===J(['Coherence band','Screen','Build','Day']),
  'the card carries the band, the screen, the build and the day and nothing else, '+J(card&&card.fields.map(f=>f.name)));
 r=await hit(F,{body:{kind:'rating',answers:{state:3,again:2},band:'high'}, env});
 ok(r.status===200&&/state 3, again 2/.test(J(r.heard[0].body)),'a rating with no text is relayed with its answers, '+r.status);

 /* Discord says no */
 r=await hit(F,{body:good(), env, discord:429});
 ok(r.status===503&&/busy/.test(r.body.error),'Discord\'s own rate limit is said as busy, '+r.text);
 r=await hit(F,{body:good(), env, discord:404});
 ok(r.status===502&&/refused/.test(r.body.error)&&r.logs.join().indexOf('gate-token')<0,
  'a Discord refusal is a 502 in words, logged by status only, '+r.text);
 r=await hit(F,{body:good(), env, discord:'throw'});
 ok(r.status===502&&/could not reach/.test(r.body.error),'Discord unreachable is a 502 in words, '+r.text);}

const MUTANTS=[
 {what:'a missing variable is not checked',
  from:"if (!hook) return no(503, 'feedback is not switched on here yet');", to:""},
 {what:'the key set is open',
  from:"for (const k of Object.keys(e)) if (FB_KEYS.indexOf(k) < 0) return 'feedback may not carry ' + k;", to:""},
 {what:'mentions can ping',
  from:"allowed_mentions: { parse: [] }, ", to:""},
 {what:'any content type is taken',
  from:"if (!/^application\\/json\\b/.test(type)) return no(415, 'feedback must be sent as json');", to:""},
 {what:'a Discord refusal is said as sent',
  from:"if (res.ok) return say(200, { ok: true });", to:"return say(200, { ok: true });"}];

async function fnGate(ok,say){
 const src=fs.readFileSync(FN_FILE,'utf8');
 console.log('\n=== DF · the Function refuses what it should and relays what it should ===');
 await fnSuite(await fnImport(src),ok,engineLists());
 console.log('\n=== DF · the gate bites ===');
 for(const m of MUTANTS){
  const hits=src.split(m.from).length-1;
  ok(hits===1,'the text to break is in the Function exactly once ('+m.what+'), found '+hits);
  if(hits!==1)continue;
  let f=0; const fails=[];
  try{ await fnSuite(await fnImport(src.replace(m.from,m.to)),(c,msg)=>{ if(!c){f++; if(fails.length<1)fails.push(msg);} },null); }
  catch(e){ f++; fails.push('threw: '+e.message); }
  ok(f>0,'the suite fails when '+m.what+' ('+f+' failures, first: '+(fails[0]||'none').slice(0,90)+')');
  say&&say('  BITE '+m.what+': '+f);}}

/* ---------------- the app against the Function ---------------- */
async function appGate(ok){
 const {chromium}=require('playwright');
 const F=await fnImport(fs.readFileSync(FN_FILE,'utf8'));
 const PAGE=path.resolve(process.env.ATUNED_FILE||'source.html');
 const SHOTS=process.env.SHOTS||'';
 /* the stand in for Cloudflare: the page, and the Function at /feedback */
 let ENV={}, DISCORD=204; const hits=[], posts=[];
 const srv=http.createServer((req,res)=>{
  const bufs=[]; req.on('data',d=>bufs.push(d)); req.on('end',async()=>{
   const u=new URL(req.url,'http://x');
   if(u.pathname==='/feedback'){
    const body=Buffer.concat(bufs);
    hits.push({method:req.method, auth:req.headers.authorization||null, body:body.toString()});
    const realFetch=globalThis.fetch;
    globalThis.fetch=async(url,init)=>{ posts.push(JSON.parse(init.body)); return new Response(null,{status:DISCORD}); };
    try{
     const h={}; for(const k of ['content-type','content-length','authorization'])if(req.headers[k])h[k]=req.headers[k];
     const r=await F.onRequest({request:new Request('http://127.0.0.1/feedback',{method:req.method,headers:h,
      body:req.method==='POST'?body:undefined}), env:ENV});
     res.writeHead(r.status,Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer()));}
    finally{ globalThis.fetch=realFetch; }
    return;}
   if(u.pathname==='/atuned.html'){ res.writeHead(200,{'content-type':'text/html; charset=utf-8'}); res.end(fs.readFileSync(PAGE)); return;}
   res.writeHead(404); res.end();});});
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));
 const BASE='http://127.0.0.1:'+srv.address().port;
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
  try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(150);}catch(e){}};
 const said=pg=>pg.evaluate(()=>{const L=(typeof MSG_LOG!=='undefined'&&MSG_LOG.length)?MSG_LOG[MSG_LOG.length-1]:null;
  return L?{msg:L.msg,kind:L.kind}:{msg:(document.getElementById('status')||{}).textContent||'',kind:null};});
 const queued=pg=>pg.evaluate(()=>JSON.parse(localStorage.getItem('source.outbox')||'[]').length);
 try{
 for(const [w,h] of [[1600,1000],[390,844]]){
  const at=' at '+w;
  const ctx=await browser.newContext({viewport:{width:w,height:h}});
  const pg=await ctx.newPage(); const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(BASE+'/atuned.html?dev=1',{waitUntil:'load'}); await booted(pg);
  await pg.evaluate(()=>{ try{localStorage.setItem('source.outbox','[]');}catch(e){} loadP(0); setTab(TAB.FIELD); render(); });
  ENV={}; DISCORD=204; hits.length=0; posts.length=0;

  /* the menu row */
  const a=await pg.evaluate(async()=>{
   const wait=ms=>new Promise(r=>setTimeout(r,ms)), o={};
   document.getElementById('profbtn').click(); await wait(250);
   const m=document.getElementById('profmenu');
   o.items=[...m.querySelectorAll('[role=menuitem]')].map(e=>e.textContent.trim());
   const fb=m.querySelector('[data-pmfb]');
   o.fbH=fb?Math.round(fb.getBoundingClientRect().height):0;
   o.fbIn=fb?fb.getBoundingClientRect().bottom<=innerHeight:false;
   o.join=!!m.querySelector('[data-pmjoin]');
   return o;});
  ok(a.items.indexOf('Discord feedback')>=0&&a.fbH>=44&&a.fbIn,
   'the profile menu carries Discord feedback at the 44px floor, on screen'+at+', '+J({h:a.fbH,items:a.items}));
  /* COMMUNITY_INVITE now ships with the real, owner-confirmed invite
     (https://discord.gg/VRP8NApj2d), so the shipped menu carries the join
     row by default; the override just below still proves the mechanism
     generically with a different link, independent of what ships today */
  ok(a.join&&a.items.indexOf('Join our Discord')>=0,'with the shipped invite link the join row is in the menu'+at);
  if(SHOTS)await pg.screenshot({path:path.join(SHOTS,'menu-'+w+'.png')});

  /* the press */
  const b=await pg.evaluate(async()=>{
   const wait=ms=>new Promise(r=>setTimeout(r,ms)), o={};
   document.querySelector('#profmenu [data-pmfb]').click(); await wait(300);
   o.menuShut=document.getElementById('profmenu').hidden;
   o.tab=S.tab===TAB.SETTINGS; o.sec=ACC_OPEN;
   o.sheet=!document.getElementById('sheet').hidden;
   o.title=(document.querySelector('#sheet .sh-h')||{}).textContent||'';
   o.disclose=(document.querySelector('#sheet .sh-p.dim')||{}).textContent||'';
   o.overflow=document.documentElement.scrollWidth>innerWidth+1;
   document.getElementById('obtext').value='the release timer reads wrong on the phone';
   return o;});
  ok(b.menuShut&&b.tab&&b.sec==='help'&&b.sheet&&b.title==='Leave a comment',
   'Discord feedback shuts the menu and opens Help with the comment sheet over it'+at+', '+J(b));
  ok(/Discord server/.test(b.disclose)&&/Anyone who can read that channel/.test(b.disclose),
   'the sheet says it goes to the team\'s Discord and who can read it there, before anything is sent'+at);
  ok(!b.overflow,'no sideways scroll with the sheet open'+at);
  if(SHOTS)await pg.screenshot({path:path.join(SHOTS,'sheet-'+w+'.png')});

  /* the variable is not set: held, in the Function's words */
  await pg.evaluate(()=>document.getElementById('obsend').click());
  await pg.waitForTimeout(700);
  const s1=await said(pg), n1=await queued(pg);
  const h1=hits[hits.length-1]||{};
  ok(hits.length===1&&h1.method==='POST'&&h1.auth===null&&JSON.parse(h1.body).kind==='comment',
   'Send posts the comment to the site\'s own /feedback, with no token'+at+', '+J({n:hits.length,m:h1.method}));
  ok(/Held on this device/.test(s1.msg)&&/Feedback is not switched on here yet/.test(s1.msg)&&s1.kind==='fail'&&n1===1&&!posts.length,
   'with the variable unset it says held, in the Function\'s words, never sent, and keeps it'+at+', '+J(s1));
  if(SHOTS)await pg.screenshot({path:path.join(SHOTS,'held-'+w+'.png')});

  /* Discord refuses */
  ENV={DISCORD_FEEDBACK_WEBHOOK:FAKE_HOOK}; DISCORD=500;
  await pg.evaluate(()=>document.getElementById('acobsend').click());
  await pg.waitForTimeout(700);
  const s2=await said(pg), n2=await queued(pg);
  ok(/Discord refused it/.test(s2.msg)&&/Held on this device/.test(s2.msg)&&n2===1,
   'a Discord refusal is said in words and the entry stays'+at+', '+J(s2));

  /* Discord takes it */
  DISCORD=204; posts.length=0;
  await pg.evaluate(()=>document.getElementById('acobsend').click());
  await pg.waitForTimeout(700);
  const s3=await said(pg), n3=await queued(pg);
  const card=posts[0]&&posts[0].embeds&&posts[0].embeds[0];
  ok(s3.msg==='Sent. Thank you.'&&s3.kind==='ok'&&n3===0,
   'only when Discord takes it does it say sent, and the outbox empties'+at+', '+J(s3));
  ok(posts.length===1&&card&&/the release timer reads wrong on the phone/.test(card.description||''),
   'and what reached Discord is what was typed'+at);
  if(SHOTS)await pg.screenshot({path:path.join(SHOTS,'sent-'+w+'.png')});

  /* the join row, once there is an invite */
  const j=await pg.evaluate(async()=>{
   const wait=ms=>new Promise(r=>setTimeout(r,ms)), o={};
   COMMUNITY_INVITE='https://discord.gg/atunedGate';
   document.getElementById('profbtn').click(); await wait(250);
   const e=document.querySelector('#profmenu [data-pmjoin]');
   o.j=e?{tag:e.tagName,href:e.getAttribute('href'),target:e.target,rel:e.rel,h:Math.round(e.getBoundingClientRect().height),
    deco:getComputedStyle(e).textDecorationLine,txt:e.textContent.trim()}:null;
   return o;});
  ok(j.j&&j.j.tag==='A'&&j.j.href==='https://discord.gg/atunedGate'&&j.j.target==='_blank'&&/noopener/.test(j.j.rel)
   &&j.j.h>=44&&j.j.deco==='none'&&j.j.txt==='Join our Discord',
   'with a real invite the menu carries Join our Discord, a link in a new tab, at the 44px floor, not underlined'+at+', '+J(j.j));
  if(SHOTS)await pg.screenshot({path:path.join(SHOTS,'menu-join-'+w+'.png')});
  await pg.evaluate(()=>{COMMUNITY_INVITE=''; profMenuShut();});
  ok(err.length===0,'no page errors'+at+', '+err.join(' | '));
  await ctx.close();}

 /* a file has no host for a relative address, and says so instead of trying */
 {const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
  const pg=await ctx.newPage(); const reqs=[];
  pg.on('request',r=>{ if(/feedback/.test(r.url()))reqs.push(r.url()); });
  await pg.goto('file://'+PAGE+'?dev=1',{waitUntil:'load'}); await booted(pg);
  await pg.evaluate(async()=>{ const wait=ms=>new Promise(r=>setTimeout(r,ms));
   try{localStorage.setItem('source.outbox','[]');}catch(e){}
   loadP(0); obCompose('comment'); await wait(100);
   document.getElementById('obtext').value='sent from a downloaded copy';
   document.getElementById('obsend').click();});
  await pg.waitForTimeout(500);
  const s=await said(pg), n=await queued(pg);
  ok(/opened from a file/.test(s.msg)&&/Held on this device/.test(s.msg)&&n===1&&!reqs.length,
   'opened from a file it says why it cannot send, holds the entry, and makes no request, '+J({s,reqs}));
  await ctx.close();}
 } finally { await browser.close(); srv.close(); }}

module.exports={fnGate, fnSuite, appGate};

if(require.main===module){
 let PASS=0,FAIL=0;
 const ok=(c,m)=>{ if(c){PASS++; console.log('  ok   '+m);} else {FAIL++; console.log('  FAIL '+m);} };
 (async()=>{
  try{ await fnGate(ok,console.log); }catch(e){ FAIL++; console.log('  FAIL the Function gate threw: '+e.stack); }
  if(!process.env.DF_NO_BROWSER){
   console.log('\n=== DF · the app against the Function, over http ===');
   try{ await appGate(ok); }catch(e){ FAIL++; console.log('  FAIL the app gate threw: '+e.stack); }}
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
