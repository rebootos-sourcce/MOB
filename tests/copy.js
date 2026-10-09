/* ============================================================
   THE COPY GATE. WP2a-4, open item M62 and gap B1: the privacy words.

   A person deciding whether to write about their worst day reads these
   sentences first, and on 8 October several of them were false. The first
   onboarding card said "Nothing you write leaves this device" while the same
   card had just sent the server a random code and was about to send the topic
   the person picked. The Privacy page said "Held in this browser and nowhere
   else" over a table whose last row, the plan, is read off the server. The
   delete screen said "There is no store yet". The quiz said "There is no
   account and no server". And a switch called "Improve the Models" was drawn
   that nothing reads.

   WHAT IS TRUE, read off the code on 9 October at 8a2d77f, and every sentence
   this gate requires is held to it:
     the opening walk through opens   a random code for this browser
                                      (ui/auth.js authFunnelStart)
     the person picks a topic         that topic's key, one of twelve
                                      (ui/onboard.js, authFunnelCheckpoint)
     the walk through is finished     that it was finished
     the first release ends           a random code for that release
     an answer to What changed        a random code for the answer, not the answer
     sign in                          the email, the password, and the first
                                      visit's credential, which joins the marks
                                      above to the account
   The record itself is never sent: the profile sync in ui/auth.js needs a
   profiles() that is defined nowhere, so it skips on every call.

   WHAT THIS DOES. Opens the built page in a real Chromium at 1600 and 390 and
   reads every tab TABDEF and TABEXTRA name at run time, every Settings section
   ACC_SECS names, every onboarding card, the profile sheet, the feedback sheet
   and the delete confirm, on a blank profile and a loaded one. Then every
   page in funnel/dist, and every state the quiz's own render() names. It reads
   innerText, SVG text and the tooltip a carrier holds, because innerText does
   not see SVG and a tooltip is read like any other line. It prints
   FAIL <surface> <phrase> for every banned denial it finds, and
   FAIL <surface> missing <what> for every required sentence that is absent.

   AND IT WATCHES WHAT IS SENT. The funnel routes are answered by a stub, so
   the walk's own presses really send, and every body key that leaves is held
   against SENDS below. A send the table does not name fails, because a new
   field leaving the device is the moment the words above stop being true.

   CHECKED AGAINST A KNOWN BAD CASE FIRST, in node, before the browser opens:
   the old first card line must be called banned, and the new privacy lines
   must pass, or nothing after it is trusted.

   Run from the repo root, after the three builds:
     NODE_PATH=/opt/node22/lib/node_modules node tests/copy.js
   ATUNED_FILE=other.html and FUNNEL_DIST=other/dir run another build.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path');
const fs=require('fs');

/* THE BANNED DENIALS. [where, pattern, what is true instead]. One table, and
   the only place a banned phrase is written. "app" is the built page, "all" is
   the app and every funnel page. A denial can be true on one and false on the
   other: the quiz really sends nothing, so "Nothing you answer leaves this
   browser" is true there and is not banned there. */
const BANNED=[
 ['all', /improve the models/i, 'no model is trained on a story, and nothing reads that switch'],
 ['all', /refine the reading/i, 'the same dead switch, by its row label'],
 ['all', /\bno store\b/i, 'our server keeps a sign in and what a first visit sent'],
 ['all', /\bthere is no account\b/i, 'there are accounts'],
 ['all', /\bno server\b/i, 'there is a server'],
 ['all', /no request of any kind while you use it/i, 'the app sends a first visit code, a topic and marks'],
 ['all', /\bonly on your device\b/i, 'a first visit sends to our server'],
 ['all', /some things leave, and only when you choose/i, 'a first visit sends without a choice'],
 ['app', /nothing (?:that )?you (?:write|answer|type|enter)\b[^.]{0,24}\b(?:leaves|left) this (?:device|browser)/i,
  'the walk through sends a random code, the topic picked and how far a person gets'],
 ['app', /\bnothing has left this device\b/i, 'a first visit has already sent a random code'],
 ['app', /\beverything\b[^.]{0,20}\b(?:held|kept|stays?|stored)\b[^.]{0,12}\b(?:this|your) (?:device|browser)\b/i,
  'the plan is read off the server and the first visit marks are held there'],
 ['app', /\b(?:held|kept|stored|stays?)\b[^.]{0,40}\bnowhere else\b/i, 'the plan and the first visit marks are also on the server'],
 ['app', /\bnothing about who you are travels\b/i, 'feedback carries the coherence band, the day, the version and the screen']];

/* THE REQUIRED SENTENCES. [surface, [patterns that must all sit in one
   sentence], what it must say]. Held by sentence, so two halves on two
   different lines of the page do not add up to one true sentence. */
const REQUIRED=[
 ['privacy', [/\bfirst visit\b/i, /\bsends?\b/i, /\bserver\b/i, /\brandom code\b/i, /\btopic\b/i],
  'one plain sentence naming what a first visit sends'],
 ['privacy', [/\bname\b/i, /\bnever leaves this device\b/i],
  'one sentence naming that the name never leaves the device'],
 ['delete', [/\bour server\b/i, /\bfirst visit\b/i],
  'the delete screen says what our server still keeps']];

/* WHAT MAY LEAVE DURING THE WALK. [method, path, the body keys it may carry],
   read off ui/auth.js. The walk never signs in, so these are the only routes
   it can reach. */
const SENDS=[
 ['POST', /\/v1\/funnel\/session$/, ['anonymousId']],
 ['PATCH', /\/v1\/funnel\/session\/[^/]+\/checkpoint$/, ['selectedGroundId','tutorialCompleted','firstReleaseId','verificationId']],
 ['POST', /\/v1\/funnel\/session\/[^/]+\/attach$/, ['credential']]];

const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const DIST=path.resolve(process.env.FUNNEL_DIST||'funnel/dist');
let PASS=0,FAIL=0;
const fail=(surface,what)=>{FAIL++;console.log('FAIL '+surface+' '+what);};
const sentences=t=>String(t||'').replace(/\s+/g,' ').split(/(?<=[.?!])\s+/);

/* the scan, one surface's text against the tables */
function banned(scope,text){
 const t=String(text||'').replace(/\s+/g,' '), out=[];
 BANNED.forEach(([where,re])=>{
  if(where==='app'&&scope!=='app')return;
  const m=re.exec(t); if(m)out.push(m[0]);});
 return out;}
function missing(name,text){
 const ss=sentences(text);
 return REQUIRED.filter(r=>r[0]===name&&!ss.some(s=>r[1].every(re=>re.test(s)))).map(r=>r[2]);}
function hold(scope,surface,text,need){
 /* an empty surface passes every banned phrase, which is how a sheet that
    rendered the word undefined once read as clean, so empty is a failure */
 if(text==null||String(text).replace(/\s+/g,'').length<20){fail(surface,'missing its text');return;}
 const hits=banned(scope,text);
 hits.forEach(h=>fail(surface,JSON.stringify(h)));
 if(!hits.length)PASS++;
 (need?missing(need,text):[]).forEach(w=>fail(surface,'missing '+w));
 if(need&&!missing(need,text).length)PASS++;}

/* THE CHECKER, against a known bad case and a known good one, before it is
   trusted on anything real. */
{const before=FAIL;
 const bad=banned('app','Nothing you write leaves this device.');
 const good=banned('app','Held in this browser. Your stories are not sent to us, and the name you enter never leaves this device.');
 const quiz=banned('funnel','Nothing you answer leaves this browser. This page makes no request of any kind.');
 if(bad.length!==1)fail('self','the old first card line is not called banned: '+JSON.stringify(bad));
 if(good.length)fail('self','a true privacy line is called banned: '+JSON.stringify(good));
 if(quiz.length)fail('self','the quiz line, true on the quiz, is called banned: '+JSON.stringify(quiz));
 if(!missing('privacy','Held in this browser and nowhere else.').length)fail('self','an empty privacy footer is not called incomplete');
 if(missing('privacy','A first visit sends our server a random code, the topic you pick and whether you finish. The name you enter never leaves this device.').length)
  fail('self','a complete privacy footer is called incomplete');
 if(FAIL>before){console.log('the checker failed its own known cases, so nothing below is trusted');process.exit(1);}
 PASS++;}

/* THE PAGE SIDE. Visible text, SVG text and tooltips under one root. */
function harvest(sel){
 var root=sel?document.querySelector(sel):document.body; if(!root)return null;
 var on=function(e){return e.getClientRects().length>0;};
 var parts=[root.innerText||''];
 root.querySelectorAll('svg text').forEach(function(t){if(on(t))parts.push(t.textContent);});
 root.querySelectorAll('[data-tip],[title]').forEach(function(e){if(on(e))
  parts.push(e.getAttribute('data-tip')||e.getAttribute('title')||'');});
 return parts.join('\n');}

(async()=>{
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const sent=[];
/* the stub. The funnel routes answer as the Worker does, so a pick is really
   sent and its keys can be read; anything else off the file is refused. */
const route=async r=>{
 const q=r.request(), u=q.url();
 if(/^(file|data|blob):/.test(u))return r.continue();
 let body=null; try{body=JSON.parse(q.postData()||'null');}catch(e){body=null;}
 sent.push({m:q.method(),u:u,keys:body&&typeof body==='object'?Object.keys(body):[]});
 if(/\/v1\/funnel\/session/.test(u))return r.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({session:{id:'copygate',anonymousId:'copygate-anon'},credential:'copygate-cred'})});
 return r.abort();};

for(const [w,h,wn] of [[1600,1000,'1600'],[390,844,'390']]){
 for(const who of ['blank','loaded']){
  const c=await b.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
  await c.route('**/*',route);
  const p=await c.newPage();
  await p.addInitScript(require('./seed.js').FULL_SIGHT);
  const dialogs=[]; p.on('dialog',d=>{dialogs.push(d.message());d.dismiss().catch(()=>{});});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(FILE);
  try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}
  catch(e){fail('app/'+wn+'/'+who,'missing a booted page');await c.close();continue;}
  await p.waitForTimeout(700);
  if(who==='loaded'){
   const at=await p.evaluate(()=>{var i=PEOPLE.findIndex(function(x){return x.nm==='Derek';});
    if(i>=0)loadP(i); return i;});
   if(at<0){fail('app/'+wn+'/loaded','missing the worked example named Derek');await c.close();continue;}
   await p.waitForTimeout(500);}
  const at=s=>'app/'+wn+'/'+who+'/'+s;

  /* every tab, read off TABDEF and TABEXTRA, by integer and never by place */
  const tabs=await p.evaluate(()=>TABDEF.map(function(t){return [t.k,t.nm];})
   .concat(Object.keys(TABEXTRA).map(function(k){return [TABEXTRA[k].k,TABEXTRA[k].nm];})));
  for(const [k,nm] of tabs){
   await p.evaluate(k=>setTab(k),k); await p.waitForTimeout(400);
   hold('app',at('tab:'+nm),await p.evaluate(harvest,null));}

  /* every Settings section, read off ACC_SECS */
  const secs=await p.evaluate(()=>{setTab(TAB.SETTINGS);return ACC_SECS.map(function(s){return s.k;});});
  for(const k of secs){
   await p.evaluate(k=>{ACC_OPEN=k;renderAccount();},k); await p.waitForTimeout(250);
   hold('app',at('settings:'+k),await p.evaluate(harvest,'#settings'),k==='privacy'?'privacy':null);}

  /* the delete screen: the group that holds Delete, and the confirm it asks */
  await p.evaluate(()=>{ACC_OPEN='privacy';renderAccount();}); await p.waitForTimeout(250);
  const del=await p.evaluate(()=>{var d=document.getElementById('acdel');
   var g=d&&d.closest('.ac-grp'); return g?g.innerText:null;});
  if(del==null)fail(at('delete'),'missing the group that holds Delete');
  else hold('app',at('delete'),del,'delete');
  if(await p.$('#acdel')){await p.click('#acdel').catch(()=>{}); await p.waitForTimeout(300);}
  dialogs.forEach(m=>hold('app',at('delete:confirm'),m));
  if(!dialogs.length)console.log('  note '+at('delete:confirm')+' no confirm was asked, so its words were not read here');

  /* the profile sheet, which nothing opens today, opened here so its words
     are still held; and the feedback sheet, where a person decides to send */
  const ps=await p.evaluate(()=>{if(typeof profileSheet!=='function')return null;
   profileSheet(); return true;});
  if(ps){await p.waitForTimeout(250); hold('app',at('sheet:profile'),await p.evaluate(harvest,'#sheet-card'));
   await p.evaluate(()=>sheetShut());}
  const fb=await p.evaluate(()=>{if(typeof obCompose!=='function')return null; obCompose('comment'); return true;});
  if(fb){await p.waitForTimeout(250); hold('app',at('sheet:feedback'),await p.evaluate(harvest,'#sheet-card'));
   await p.evaluate(()=>sheetShut());}

  /* every onboarding card, counted off its own dots. The topic is picked by
     a real press, so the pick is really sent through the stub. */
  if(who==='blank'){
   const n=await p.evaluate(()=>{obOpen(true);OB.step=0;obRender();return document.querySelectorAll('#ob .ob-dot').length;});
   if(!n)fail(at('onboarding'),'missing its step dots, so its cards cannot be counted');
   for(let s=0;s<n;s++){
    const r=await p.evaluate(s=>{try{OB.step=s;obRender();return 'ok';}catch(e){return e.message;}},s);
    await p.waitForTimeout(120);
    if(r!=='ok'){console.log('  note '+at('onboarding:'+s)+' does not render without the cards before it ('+r+')');continue;}
    hold('app',at('onboarding:'+s),await p.evaluate(harvest,'#ob'));
    if(s===1&&await p.$('#ob [data-obpick]')){await p.click('#ob [data-obpick]').catch(()=>{}); await p.waitForTimeout(400);}}
   await p.evaluate(()=>{try{obClose();}catch(e){}});}
  if(errs.length)console.log('  note '+at('')+' page errors: '+errs.slice(0,3).join(' | '));
  await c.close();}}

/* every page in funnel/dist, read off the directory, and every state the
   quiz's own render() names */
const pages=fs.readdirSync(DIST).filter(f=>/\.html$/.test(f)).sort();
if(!pages.length)fail('funnel','missing every page in '+DIST);
for(const [w,h,wn] of [[1600,1000,'1600'],[390,844,'390']]){
 const c=await b.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
 await c.route('**/*',r=>/^(file|data|blob):/.test(r.request().url())?r.continue():r.abort());
 for(const f of pages){
  const p=await c.newPage();
  await p.goto('file://'+path.join(DIST,f),{waitUntil:'load'}); await p.waitForTimeout(500);
  hold('funnel','funnel/'+wn+'/'+f,await p.evaluate(harvest,null));
  const states=await p.evaluate(()=>{if(typeof render!=='function'||typeof STATE==='undefined')return [];
   var s=[], re=/STATE==='(\w+)'/g, m; while((m=re.exec(String(render))))s.push(m[1]);
   s.push('read'); return s.filter(function(x,i){return s.indexOf(x)===i;});});
  if(states.length){
   await p.evaluate(()=>{A={};QQ.forEach(function(q,i){A[i]=2;});save();});
   for(const st of states){
    const r=await p.evaluate(st=>{try{STATE=st;render();return 'ok';}catch(e){return e.message;}},st);
    await p.waitForTimeout(150);
    if(r!=='ok'){fail('funnel/'+wn+'/'+f+':'+st,'missing a render ('+r+')');continue;}
    hold('funnel','funnel/'+wn+'/'+f+':'+st,await p.evaluate(harvest,null));}}
  await p.close();}
 await c.close();}

/* what the walk sent, against SENDS */
if(!sent.length)fail('send','missing any send at all, so the stub saw nothing and SENDS was not tested');
sent.forEach(x=>{
 const pth=x.u.replace(/^https?:\/\/[^/]+/,'').replace(/\?.*$/,'');
 const row=SENDS.find(s=>s[0]===x.m&&s[1].test(pth));
 if(!row){fail('send',x.m+' '+pth+' is not a route SENDS names');return;}
 const extra=x.keys.filter(k=>row[2].indexOf(k)<0);
 if(extra.length)fail('send',x.m+' '+pth+' carried '+extra.join(', ')+', which SENDS does not name');
 else PASS++;});
const kinds=[...new Set(sent.map(x=>x.m+' '+x.u.replace(/^https?:\/\/[^/]+/,'').replace(/\/session\/[^/]+/,'/session/:id')))];
console.log('\nsent during the walk: '+(kinds.join(', ')||'nothing'));

await b.close();
console.log('\ncopy: '+PASS+' passed, '+FAIL+' failed');
process.exit(FAIL?1:0);
})().catch(e=>{console.log('FAIL copy gate crashed: '+(e&&e.stack||e));process.exit(1);});
