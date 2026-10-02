const {chromium}=require('playwright');
const path=require('path');
/* the target is overridable, so the delivery build can be put through the
   same gates as the source build rather than being trusted. */
/* ?dev=1: the same flag the boot sheet's own developer button sets, so this
   gate meets the instrument at once rather than meeting the new login
   screen ui/login.js puts in front of it on every boot. */
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
/* THE BOOT IS A THREE SECOND SHEET, so every page these gates open has to be
   allowed to finish booting before anything is measured or clicked. Without
   it the gates race the boot: they wait under a second, the sheet is still
   up, and a run fails intermittently on whichever surface it happened to
   reach first. Measured once as four failures in one run of four that would
   not reproduce, which is exactly the shape of this kind of race. */
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:12000});}
 catch(e){/* reduced motion clears it synchronously; a miss is not a failure */}
 /* AND THE OPENING IS DISMISSED, because every page here goes on to test the
    instrument and a first visit meets the onboarding sheet over it. That is
    real behaviour and the gate proved it by failing four Field checks the
    moment onboarding landed, so the sheet is closed the way a person closes
    it rather than hidden. The onboarding has a block of its own below, so
    getting past it here is not the same as not testing it. */
 try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}
 /* AND THE FIELD'S ENTRANCE IS LET FINISH. It assembles on arrival, so for
    its first second the parts are on their way to where they belong and a
    measurement taken then measures the animation. Waited out rather than
    turned off, because it is real and a person sees it. */
 try{ await p.waitForFunction(
   ()=>typeof enterOver!=='function'||enterOver(),null,{timeout:4000}); }catch(e){}};
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
(async()=>{
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
/* BY NAME, NEVER BY POSITION. Seven checks in this file said loadP(8) and
   meant Gordon, the heaviest case in the roster. The roster grew to fifteen
   and 8 became Ana, so every one of them had been measuring the wrong person
   and three rows about the safety referral were failing for that reason. It
   is the rule this repository already carries about the tab integers, and it
   holds for every table a thing is looked up in. Defined on the context so
   every page and every navigation has it. */
/* AND IT IS EVERY PERSON IN THE ROSTER, NOT ONLY THE HEAVY ONE. GORDON() was
   added after seven checks said loadP(8) and meant Gordon, and the same defect
   was still sitting in this file seventeen times as loadP(6): six is James in
   the browser, because ui/personas.js unshifts the custom persona, so every
   index here is one past the engine's own table and one comment in this file
   said Gordon over a call that loads James. Counted off the file: 34 calls
   carried a literal index and 23 of them named somebody other than the person
   themselves, and those 23 are by name now. PERSON throws rather than returning
   a wrong row, so a roster change fails the gate instead of quietly measuring
   the wrong person.
   loadP(0) stays a literal: zero is the custom persona, which is the person's
   own identity and is what saveYou and toYou both mean by it. */
const GORDON_FN=`window.PERSON=function(nm){
 for(var i=0;i<PEOPLE.length;i++)if(PEOPLE[i].nm===nm)return i;
 throw new Error(nm+' is not in the roster any more');};
window.GORDON=function(){return window.PERSON('Gordon');};`;
/* THE LEFT COLUMN STARTS SHUT ON A DESKTOP NOW, GO in TASKS.md: "the field left
   panel starts closed." Every check in this file that reads or presses the
   column was written when it always arrived open, and against a shut column
   they measured a dial of height 0 and a CQ that swept to NaN, which is the
   check measuring nothing rather than the product failing. So a fresh store is
   seeded as a person who has opened the column once, exactly what the product
   remembers after that press, and only a store with nothing in it: a check
   that shuts it and reloads still finds it shut. A page opened on #landing is
   not seeded, so the landing state itself is measured on a real first visit,
   in the GO block below. The product never reads the hash. */
/* THE TIER RULING OF 1 OCTOBER put the chain, the Registers and the Character
   masks behind a plan, and every persona this file loads is a free record. The
   checks below were written against the full reading, so each page and context
   is seeded as a person who can see all of it (tests/seed.js), and the lock's
   own group near the foot of this file sets it back to nothing to measure the
   lock. Sight alone reads the seed: Billing and the tiers page still read the
   record, so those checks are unchanged. */
const {FULL_SIGHT}=require('./seed.js');
const LCOL_SEED=`try{if(!/landing/.test(location.hash)&&localStorage.getItem('lcol')===null)
 localStorage.setItem('lcol','open');}catch(e){}`;
browser.newPage=(orig=>async function(...a){
 const pg=await orig.apply(this,a);
 await pg.addInitScript(GORDON_FN);
 await pg.addInitScript(LCOL_SEED);
 await pg.addInitScript(FULL_SIGHT);
 return pg;})(browser.newPage);
browser.newContext=(orig=>async function(...a){
 const cx=await orig.apply(this,a);
 await cx.addInitScript(GORDON_FN);
 await cx.addInitScript(LCOL_SEED);
 await cx.addInitScript(FULL_SIGHT);
 return cx;})(browser.newContext);
const page=await browser.newPage({viewport:{width:1600,height:1000}});
const real=[];
page.on('pageerror',e=>real.push('PAGEERROR: '+e.message));
page.on('console',m=>{if(m.type()==='error'){const t=m.text();
 if(!/ERR_CERT_AUTHORITY_INVALID|ERR_FILE_NOT_FOUND|fonts\.googleapis/.test(t))real.push(t);}});
await page.goto(FILE,{waitUntil:'load'}); await booted(page); await page.waitForTimeout(800);
console.log('\n=== sign in, against a stub of the real server, and keeps nothing on the record ===');
/* Round IA was a shell that said accounts were not live. On 30 September the
   reboot-os Worker went live and sign in goes to it, through ui/auth.js. This
   gate never touches that server: it holds real account data and a sign in
   limit per address, and a gate that ran against it would lock out whoever
   shares the address. It stands up a stub instead, on this machine, that
   answers the Worker's own routes with the Worker's own CORS headers, read off
   atuned/server/src/index.js on main. So what runs is the real fetch, the real
   preflight a downloaded file sends, from origin null with an Authorization
   header, and the real timer. The stub only replaces the database.

   What is held: every failure says what failed on the status line and holds
   there, and in the login card as well, since that card covers the status
   line; a refusal the server would give is given before anything is sent; a
   sign in lands the session under its own key and never on the profile, so an
   export cannot carry it; the boot check signs a person out on a 401 and not
   on a dropped connection; and sign out ends it here even when the server is
   out of reach. */
{
 const http=require('http');
 const CORS={'access-control-allow-origin':'*','access-control-allow-headers':'authorization, content-type',
  'access-control-allow-methods':'GET, POST, PUT, DELETE, OPTIONS'};
 const seen=[];
 const ACC={id:'acc_probe',research_id:'rsh_probe',plan:1,email:'probe@example.invalid'};
 const stub=http.createServer((req,res)=>{
  let raw=''; req.on('data',d=>raw+=d); req.on('end',()=>{
   const send=(st,b)=>{res.writeHead(st,Object.assign({'content-type':'application/json'},CORS)); res.end(JSON.stringify(b));};
   if(req.method==='OPTIONS'){res.writeHead(204,CORS); res.end(); return;}
   let b={}; try{b=JSON.parse(raw||'{}');}catch(e){}
   const auth=req.headers.authorization||'';
   seen.push({m:req.method,u:req.url,email:b.email||'',auth:auth,origin:req.headers.origin||'',body:b});
   const k=req.method+' '+req.url;
   /* USERNAMES, ROUND OT. The server reads none of this today: it keys on the
      email, so a body with only a username gets the answer it gets now, a 400
      about the email, which is what the door must show and never turn into a
      success. 'mika_salas' is the account a LATER slice would hold, and the
      shape it answers with, an account carrying a username and no email, is
      this stub's guess at that slice and not the server's word: the server
      owns the field names, and this changes when it ships them. */
   if(b.username!==undefined&&b.email===undefined&&k==='POST /v1/auth/signin'){
    if(b.username==='mika_salas'&&b.password==='right-password-1')
     return send(200,{token:'t-user',account:{id:'acc_user',username:'mika_salas'}});
    if(b.username==='nobody_here')return send(401,{error:'no account matches'});
    return send(400,{error:'email is required'});}
   if(b.username!==undefined&&k==='POST /v1/auth/signup')
    return send(201,{token:'t-user2',account:{id:'acc_user2',username:b.username,email:b.email||''}});
   if(b.username!==undefined&&k==='POST /v1/auth/forgot')return send(200,{ok:true});
   if(k==='POST /v1/auth/signin'){
    if(b.email==='slow@example.invalid')return;                 /* never answers */
    if(b.email==='many@example.invalid')return send(429,{error:'too many attempts. wait fifteen minutes'});
    if(b.email===ACC.email&&b.password==='right-password-1')return send(200,{token:'t-probe',account:ACC});
    return send(401,{error:'no account matches'});}
   if(k==='POST /v1/auth/signup'){
    if(b.email==='taken@example.invalid')return send(409,{error:'an account with this email exists'});
    return send(201,{token:'t-new',account:Object.assign({},ACC,{email:b.email})});}
   if(k==='POST /v1/auth/forgot')return send(200,{ok:true});
   if(k==='POST /v1/auth/signout')return auth==='Bearer t-probe'?send(200,{ok:true}):send(401,{error:'sign in'});
   /* the plan read back: each of these sessions is an account whose billing
      says one thing, in the shape reboot-os store.js billingOf sends. t-probe
      sends no billing key at all, which is a server from before that field */
   const SPAN={since:'2026-10-01T00:00:00.000Z',until:'2026-11-01T00:00:00.000Z'};
   const BILL={'Bearer t-paid':Object.assign({tier:'one',status:'active'},SPAN),
    'Bearer t-late':Object.assign({tier:'one',status:'past_due'},SPAN),
    'Bearer t-ended':Object.assign({tier:'one',status:'canceled'},SPAN),
    'Bearer t-odd':Object.assign({tier:'five',status:'active'},SPAN),
    'Bearer t-none':null};
   if(k==='GET /v1/me'&&Object.prototype.hasOwnProperty.call(BILL,auth))
    return send(200,{account:ACC,consent:{share:false,at:null,v:1},records:0,entitlement:null,billing:BILL[auth]});
   if(k==='GET /v1/me'&&auth==='Bearer t-user')return send(200,{account:{id:'acc_user',username:'mika_salas'},consent:{share:false,at:null,v:1},records:0,entitlement:null});
   if(k==='GET /v1/me')return auth==='Bearer t-probe'?send(200,{account:ACC,consent:{share:false,at:null,v:1},records:0,entitlement:null})
    :send(401,{error:'sign in'});
   /* Manage billing, in the Worker's own words: t-probe has never finished a
      checkout, so it gets the 409; t-paid has a customer and gets a page */
   if(k==='POST /v1/billing/portal'){
    if(auth==='Bearer t-paid')return send(200,{url:'https://billing.stripe.test/1'});
    if(auth==='Bearer t-probe')return send(409,{error:'there is no paid plan on this account yet, so there is no billing to manage'});
    return send(401,{error:'sign in'});}
   send(404,{error:'no such route'});});});
 await new Promise(r=>stub.listen(0,'127.0.0.1',r));
 const API='http://127.0.0.1:'+stub.address().port;
 const sp=await browser.newPage({viewport:{width:1600,height:1000}});
 const spErr=[]; sp.on('pageerror',e=>spErr.push(e.message));
 await sp.goto(FILE,{waitUntil:'load'}); await booted(sp);
 const o=await sp.evaluate(async(API)=>{
  const o={}, wait=ms=>new Promise(r=>setTimeout(r,ms));
  /* the boot's own login step fires at 5.6 seconds and runs the session check,
     so everything below starts after it, or it would race a stored session */
  while(performance.now()<6200)await wait(50);
  const said=()=>{const s=document.getElementById('status');return [s.textContent,s.getAttribute('data-kind')];};
  const idle=async()=>{for(let i=0;i<400&&(ACC_BUSY||LOGIN.busy);i++)await wait(25);};
  const held=()=>{try{return localStorage.getItem('source.session')||'';}catch(e){return 'unreadable';}};
  const openAcc=()=>{ACC_OPEN='account'; setTab(TAB.SETTINGS); render();};
  const press=async(mail,pw,id)=>{openAcc();
   document.getElementById('acmail').value=mail; document.getElementById('acpass').value=pw;
   if(id)document.getElementById(id).click(); else document.getElementById('acgo').click();
   await idle(); return said();};
  loadP(0);
  const recBefore=JSON.stringify(CURP);
  openAcc();
  o.form=!!(document.getElementById('acsignin')&&document.getElementById('acnew'));
  o.noUser=!document.getElementById('loginuser');
  /* no network at all: a port nothing listens on refuses the connection */
  AUTH_API='http://127.0.0.1:1';
  o.off=await press('probe@example.invalid','right-password-1');
  o.offAgain=!document.getElementById('acgo').disabled;
  o.offTyped=document.getElementById('acmail').value==='probe@example.invalid';
  AUTH_API=API;
  o.wrong=await press('probe@example.invalid','wrong-password');
  o.many=await press('many@example.invalid','whatever-1');
  const waitWas=AUTH_WAIT_MS; AUTH_WAIT_MS=400;
  o.slow=await press('slow@example.invalid','whatever-1');
  AUTH_WAIT_MS=waitWas;
  o.badMail=await press('probe@example','right-password-1');
  o.shortNew=await press('new@example.invalid','short','acnew');
  o.taken=await press('taken@example.invalid','long-enough-1','acnew');
  o.noSessionYet=held()==='';
  o.good=await press('probe@example.invalid','right-password-1');
  o.heldAfter=held();
  o.recordSame=JSON.stringify(CURP)===recBefore;
  o.exportClean=pExport().indexOf('t-probe')<0;
  o.diskClean=(localStorage.getItem('source.profiles')||'').indexOf('t-probe')<0;
  let leak=false;
  for(let i=0;i<localStorage.length;i++){const v=localStorage.getItem(localStorage.key(i))||'';
   if(v.indexOf('right-password-1')>=0||v.indexOf('wrong-password')>=0)leak=true;}
  o.pwLeak=leak;
  openAcc();
  o.signedRow=document.getElementById('settings').innerText.indexOf('probe@example.invalid')>=0
   &&!!document.getElementById('acout');
  ACC_OPEN='security'; render(); renderAccount();
  o.secMethod=document.getElementById('settings').innerText.indexOf('email and password')>=0;
  o.check=await authCheck();
  /* sign out while the server is out of reach still ends it here */
  AUTH_API='http://127.0.0.1:1';
  openAcc(); document.getElementById('acout').click(); await idle();
  o.outOff=said(); o.outOffHeld=held();
  AUTH_API=API;
  /* and signed in again, a sign out the server confirms */
  await press('probe@example.invalid','right-password-1');
  openAcc(); document.getElementById('acout').click(); await idle();
  o.out=said(); o.outHeld=held();
  /* the boot check: a session the server does not know is ended; a dropped
     connection leaves a session held */
  authKeep({token:'t-stale',email:'probe@example.invalid'});
  o.stale=await authCheck(); o.staleSaid=said(); o.staleHeld=held();
  authKeep({token:'t-probe',email:'probe@example.invalid'});
  AUTH_API='http://127.0.0.1:1';
  o.offCheck=await authCheck(); o.offCheckHeld=held().indexOf('t-probe')>=0;
  AUTH_API=API; authForget();
  /* THE LOGIN CARD. Same routes, and the card carries every result itself. */
  const card=()=>document.getElementById('login');
  /* the line in the view that is showing: the reset view has its own, since
     two elements may not share an id */
  const msg=()=>{const m=document.getElementById(LOGIN.reset?'loginrmsg':'loginmsg');return m?[m.textContent,m.getAttribute('data-kind')]:null;};
  loginOpen();
  o.cardFields=!!(document.getElementById('loginid')&&document.getElementById('loginpass')
   &&document.getElementById('loginb-go')&&document.getElementById('loginb-new')
   &&document.getElementById('loginb-skip'))&&!document.getElementById('loginuser')
   &&!document.getElementById('loginmail');
  AUTH_API='http://127.0.0.1:1';
  document.getElementById('loginid').value='probe@example.invalid';
  document.getElementById('loginpass').value='right-password-1';
  document.getElementById('loginb-go').click(); await idle();
  o.cardOff=msg(); o.cardStillOpen=LOGIN.open&&card().style.display!=='none';
  AUTH_API=API;
  document.getElementById('loginforgot').click();
  o.resetCarried=(document.getElementById('loginrid')||{}).value;
  document.getElementById('loginb-send').click(); await idle();
  o.forgot=msg();
  document.getElementById('loginb-back').click();
  o.backCarried=(document.getElementById('loginid')||{}).value;
  document.getElementById('loginpass').value='wrong-password';
  document.getElementById('loginb-go').click(); await idle();
  o.cardWrong=msg();
  document.getElementById('loginpass').value='right-password-1';
  document.getElementById('loginb-go').click(); await idle();
  /* a yes closes the ring and the door fades for half a second, so the door is
     read once the fade has had its time */
  o.cardIn=!LOGIN.open; await wait(LOGIN_FADE_MS+200);
  o.cardIn=o.cardIn&&card().style.display==='none'; o.cardInSaid=said(); o.cardHeld=held();
  /* held, the boot does not show the door */
  DEV_SKIP=false; loginBoot(); o.bootSkipped=!LOGIN.open; DEV_SKIP=true;
  await idle(); await wait(200);
  authForget();
  loginOpen(); document.getElementById('loginb-skip').click();
  o.skip=!LOGIN.open&&held()==='';
  /* MANAGE BILLING, through the seam checkout already uses. Pressed on the
     real button for both refusals, because the press goes PLAN_HOST, then
     authPlanPortal, then status. The yes is read off authPlanPortal itself,
     because pressing it would navigate this page to the URL. */
  const pressMan=async()=>{
   const was=said()[0]; profileSheet(); document.getElementById('planman').click();
   for(let i=0;i<160&&said()[0]===was;i++)await wait(25);
   const s=said(); sheetShut(); return s;};
  authForget(); status('probe, before Manage billing signed out');
  o.manOut=await pressMan();
  authKeep({token:'t-probe',email:'probe@example.invalid'}); status('probe, before Manage billing with no plan');
  o.manNone=await pressMan();
  authKeep({token:'t-paid',email:'probe@example.invalid'});
  o.manPaid=await authPlanPortal();
  AUTH_API='http://127.0.0.1:1';
  o.manOff=await authPlanPortal();
  AUTH_API=API; authForget();
  /* THE PLAN READ BACK. Nothing wrote CURP.plan from the server, so a person
     who paid read Free. Each session below is an account whose billing says
     one thing; authPlanRead lays it onto the open record. */
  const pl=()=>JSON.parse(JSON.stringify(CURP.plan||null));
  const onDisk=()=>{const r=JSON.parse(localStorage.getItem('source.profiles')||'[]').find(p=>p.id===CURP.id);return r?r.plan:null;};
  const keptPlan=pl();
  o.own=PROFILES.indexOf(CURP)>=0;
  CURP.plan={tier:'free',status:'',granted:0,carried:0,base:null,since:null,until:null}; pSave();
  const as=async tok=>{authKeep({token:tok,email:'probe@example.invalid'}); status('probe, before the plan read');
   const x=await authPlanRead(); return {took:x.took, said:said(), plan:pl(), free:planOf(CURP.plan).k};};
  o.rbPaid=await as('t-paid'); o.rbDisk=onDisk();
  o.rbAgain=await as('t-paid');
  o.rbLate=await as('t-late');
  o.rbEnded=await as('t-ended');
  await as('t-paid'); o.rbNone=await as('t-none');
  await as('t-paid'); o.rbOdd=await as('t-odd');
  o.rbOld=await as('t-probe');
  const real=CURP; CURP=Object.assign({},real); o.rbExample=(await as('t-ended')).took; CURP=real;
  /* the return from Stripe: read once off the address, taken off it, and
     every other parameter kept */
  const back=async(q,tok)=>{CURP.plan={tier:'free',status:'',granted:0,carried:0,base:null,since:null,until:null};
   if(tok)authKeep({token:tok,email:'probe@example.invalid'}); else authForget();
   history.replaceState(null,'',location.pathname+q); status('probe, before the return');
   await authCheck(); return {said:said(), search:location.search, tier:planOf(CURP.plan).k};};
  o.backDone=await back('?dev=1&billing=done','t-paid');
  o.backOut=await back('?billing=done&dev=1',null);
  o.backCancel=await back('?dev=1&billing=cancelled','t-probe');
  /* planWaitWas, not waitWas: this block already holds a waitWas for AUTH_WAIT_MS */
  const triesWas=AUTH_PLAN_TRIES, planWaitWas=AUTH_PLAN_WAIT_MS; AUTH_PLAN_TRIES=1; AUTH_PLAN_WAIT_MS=40;
  o.backWait=await back('?dev=1&billing=done','t-none');
  await wait(400); o.backWaitEnd=said();
  AUTH_PLAN_TRIES=triesWas; AUTH_PLAN_WAIT_MS=planWaitWas;
  history.replaceState(null,'',location.pathname+'?dev=1');
  CURP.plan=keptPlan||{tier:'free',status:'',granted:0,carried:0,base:null,since:null,until:null}; pSave();
  authForget();
  return o;},API);
 /* ============================================================
    THE DOOR, ROUND OT. Login A, the ring. What is held:

    one identifier field takes a username or an email and the kind is decided
    by an at sign; an email goes out exactly as it always did and a username
    goes as {username} on the same route, folded to lower case; the card's own
    refusals are made before anything is sent, and a refusal that came from the
    server is shown and never turned into a success; creating an account is two
    presses and wants the box ticked by the person; a username cannot be
    created until the server holds one; the ring carries the state; three
    buttons sit in one row with one Log in among them; every way out of the
    door takes html.door off; and developer options is small, lower right.

    The server here is a stub that answers what the Worker answers today for an
    email, and for a username what a LATER slice would, which is a guess and is
    marked as one in the stub. What is asserted about a username is therefore
    what this app SENDS and SAYS, not what the server does.
    ============================================================ */
 const D=await sp.evaluate(async(API)=>{
  const d={}, wait=ms=>new Promise(r=>setTimeout(r,ms));
  const $=id=>document.getElementById(id);
  const idle=async()=>{for(let i=0;i<400&&LOGIN.busy;i++)await wait(25);};
  const held=()=>{try{return localStorage.getItem('source.session')||'';}catch(e){return 'unreadable';}};
  const said=()=>{const s=$('status');return [s.textContent,s.getAttribute('data-kind')];};
  const msg=()=>{const m=$(LOGIN.reset?'loginrmsg':'loginmsg');return m?[m.textContent,m.getAttribute('data-kind')]:null;};
  const type=(id,v)=>{const e=$(id); e.value=v; e.dispatchEvent(new Event('input',{bubbles:true}));};
  const attr=a=>$('login').getAttribute(a);
  const calls=[]; const f0=window.fetch;
  window.fetch=function(u,o){ let b=null; try{b=JSON.parse((o&&o.body)||'null');}catch(e){}
   calls.push({u:String(u).replace(API,''),b:b}); return f0.apply(this,arguments); };
  const posts=()=>calls.filter(c=>/\/v1\/auth\//.test(c.u));
  const fresh=()=>{authForget(); loginOpen(); calls.length=0;};
  const fade=()=>wait(LOGIN_FADE_MS+200);
  AUTH_API=API; authForget(); DEV_SKIP=true;
  /* the card as it opens: one row, one Log in, nothing ticked, no mode but log in */
  loginOpen();
  const ids=['loginb-go','loginb-new','loginb-skip'], rs=ids.map(i=>$(i).getBoundingClientRect());
  d.row={tops:rs.map(r=>Math.round(r.top)), lefts:rs.map(r=>Math.round(r.left)),
   labels:ids.map(i=>$(i).textContent.trim()), pri:ids.map(i=>$(i).classList.contains('pri'))};
  d.logIns=[...$('login').querySelectorAll('button')].filter(b=>b.offsetParent!==null&&/^log in$/i.test(b.textContent.trim())).length;
  d.agree0={checked:$('loginagree').checked, attr:$('loginagree').hasAttribute('checked'),
   shown:getComputedStyle($('loginagree').closest('label')).display!=='none'};
  d.mode0=attr('data-mode'); d.state0=attr('data-state');
  d.wm=getComputedStyle(document.querySelector('.lg-wmk')).color;
  const dv=document.querySelector('.login-dev').getBoundingClientRect();
  d.dev={l:dv.left/innerWidth, t:dv.top/innerHeight, w:dv.width, h:dv.height};
  d.consent=$('loginconsent').textContent.trim();
  d.links=[...document.querySelectorAll('#login a')].map(a=>[a.getAttribute('href'),a.target,/noopener/.test(a.rel)]);
  d.h1=document.querySelector('#login h1').textContent; d.rule=usernameRule();
  /* the ring carries state */
  type('loginid','mika'); d.idOn=attr('data-id');
  type('loginpass','0123456789'); d.pwOn=[attr('data-pw'),$('login').style.getPropertyValue('--p')];
  /* refused before anything is sent, and the ring is left as it was */
  const r1=[];
  const tryGo=(id,pw)=>{ type('loginid',id); type('loginpass',pw); $('loginb-go').click(); return msg(); };
  r1.push(tryGo('',''));
  r1.push(tryGo('ab','right-password-1'));
  r1.push(tryGo('has space','right-password-1'));
  r1.push(tryGo('probe@example','right-password-1'));
  r1.push(tryGo('mika_salas',''));
  d.refused=r1; d.refusedSent=posts().length; d.refusedState=attr('data-state');
  /* a username signs in: folded to lower case, sent as {username} and nothing
     else, held under the name, and the boot check accepts an account with no email */
  fresh();
  type('loginid','  Mika_Salas '); type('loginpass','right-password-1');
  $('loginb-go').click(); await idle(); await fade();
  d.user={calls:posts().slice(), said:said(), held:held(), open:LOGIN.open, door:$('login').style.display};
  d.userCheck=await authCheck(); d.userHeldAfter=held();
  /* the server's refusal, as it is today for a name it has never heard of and
     for one it cannot read at all. Both shown, neither a success. */
  fresh();
  type('loginid','early_bird'); type('loginpass','right-password-1');
  $('loginb-go').click(); await idle();
  d.today={msg:msg(), open:LOGIN.open, held:held(), state:attr('data-state'), p:+$('login').style.getPropertyValue('--p')};
  type('loginid','nobody_here'); $('loginb-go').click(); await idle();
  d.unknown=msg();
  type('loginid','nobody_her'); d.cleared={state:attr('data-state'), msg:msg()};
  /* an email goes where it always went, with the body it always had */
  fresh();
  type('loginid','probe@example.invalid'); type('loginpass','right-password-1');
  $('loginb-go').click(); await idle(); await fade();
  d.email={calls:posts().slice(), said:said()};
  /* CREATING: two presses, and the second wants the box ticked by the person */
  fresh();
  d.cr0=posts().length;
  $('loginb-new').click(); await wait(700);
  d.cr1={mode:attr('data-mode'), sent:posts().length, newPri:$('loginb-new').classList.contains('pri'),
   goPri:$('loginb-go').classList.contains('pri'), ac:$('loginpass').getAttribute('autocomplete'),
   boxShown:getComputedStyle($('loginagree').closest('label')).display!=='none',
   boxTicked:$('loginagree').checked, forgotShown:getComputedStyle($('loginforgot')).display!=='none',
   sugShown:getComputedStyle($('loginsug')).display!=='none',
   hint:$('loginidhint').textContent, ring:getComputedStyle(document.querySelector('.lg-ring')).transform};
  /* a username cannot be created yet, and the line says so; nothing is sent */
  type('loginid','mika_new'); type('loginpass','long-enough-1'); $('loginagree').click();
  d.recUser=$('loginrecrow').hidden;
  $('loginb-new').click(); d.crUser=msg(); d.crUserSent=posts().length;
  /* an email address makes the recovery email redundant, and it goes */
  type('loginid','new@example.invalid'); d.recEmail=$('loginrecrow').hidden;
  /* the box is the person's: unticked, nothing is sent */
  $('loginagree').click(); d.unticked=!$('loginagree').checked;
  $('loginb-new').click(); d.crBox=msg(); d.crBoxSent=posts().length;
  $('loginagree').click();
  $('loginb-new').click(); await idle(); await fade();
  d.crOk={calls:posts().slice(), said:said(), held:held()};
  /* Log in, pressed on the card that is showing the terms, goes back and sends nothing */
  fresh();
  $('loginb-new').click(); $('loginb-go').click();
  d.back={mode:attr('data-mode'), sent:posts().length, goPri:$('loginb-go').classList.contains('pri')};
  /* the day the server holds usernames: one word in ui/auth.js, and the body is
     {username, email (the recovery), password} */
  fresh(); AUTH_USERNAMES=true;
  $('loginb-new').click();
  d.hintOpen=$('loginidhint').textContent;
  type('loginid','mika_new'); type('loginpass','long-enough-1'); type('loginrec','not an email'); $('loginagree').click();
  $('loginb-new').click(); d.recBad=msg(); d.recBadSent=posts().length;
  type('loginrec','me@example.invalid'); $('loginb-new').click(); await idle(); await fade();
  d.crUserOk={calls:posts().slice(), said:said(), held:held()};
  AUTH_USERNAMES=false;
  /* the forgotten passphrase, by username */
  fresh();
  type('loginid','mika_salas'); $('loginforgot').click();
  d.fCarried=$('loginrid').value; d.fView=attr('data-view');
  $('loginb-send').click(); await idle();
  d.fUser={calls:posts().slice(), msg:msg()};
  $('loginb-back').click(); d.fBack=attr('data-view');
  /* every way out takes html.door off, and while it is on the app is not painted */
  fresh();
  const root=document.documentElement;
  root.classList.add('door'); loginOpen();
  d.doorOn={app:getComputedStyle($('tabbar')).visibility, door:getComputedStyle($('login')).visibility};
  $('loginb-skip').click(); d.guestLift=!root.classList.contains('door');
  d.guestOpen=LOGIN.open;
  root.classList.add('door'); loginOpen(); loginClose(); d.closeLift=!root.classList.contains('door');
  authKeep({token:'t-probe',email:'probe@example.invalid'});
  root.classList.add('door'); DEV_SKIP=false; loginBoot(); d.heldLift=!root.classList.contains('door')&&!LOGIN.open; DEV_SKIP=true;
  await idle(); await wait(150);
  authForget(); root.classList.add('door'); DEV_SKIP=true; loginBoot(); d.devLift=!root.classList.contains('door');
  /* the passphrase is not left in a field of a door that is gone */
  loginOpen(); type('loginpass','a secret'); loginClose(); d.wiped=$('loginpass').value==='';
  window.fetch=f0; authForget();
  return d;},API);
 await sp.close();
 await new Promise(r=>stub.close(r));
 const reach='Could not reach the server. Check the connection and try again.';
 ok(o.form&&o.noUser,'the Account section carries the sign in form and Create account, and there is no username field');
 ok(o.off[0]===reach&&o.off[1]==='fail','no network says so and holds, got '+JSON.stringify(o.off));
 ok(o.offAgain&&o.offTyped,'and the form comes back usable, with what was typed still in it');
 ok(o.wrong[0]==='No account matches that email and password.'&&o.wrong[1]==='fail',
  'a wrong password is refused without saying which field was wrong, got '+JSON.stringify(o.wrong));
 ok(o.many[0]==='Too many attempts. Wait fifteen minutes.','the rate limit says the server\'s own words, got '+JSON.stringify(o.many));
 ok(o.slow[0]==='The server did not answer in time. Try again.','a server that never answers is a failure and not a hang, got '+JSON.stringify(o.slow));
 ok(o.badMail[0]==='The email address is not complete.','an address the server would refuse is refused first, got '+JSON.stringify(o.badMail));
 ok(o.shortNew[0]==='A password needs at least 8 characters.','a new password under the server\'s floor is refused first, got '+JSON.stringify(o.shortNew));
 ok(!seen.some(s=>s.email==='probe@example'||s.email==='new@example.invalid'),'and neither of those two was sent');
 ok(o.taken[0]==='An account already uses that email. Log in instead.','a taken email names the way out, got '+JSON.stringify(o.taken));
 ok(o.noSessionYet,'nothing is held after seven refusals');
 ok(o.good[0]==='Signed in as probe@example.invalid.'&&o.good[1]==='ok','a sign in says who, got '+JSON.stringify(o.good));
 ok(/"token":"t-probe"/.test(o.heldAfter)&&/probe@example.invalid/.test(o.heldAfter),'the session is held under its own key, got '+o.heldAfter);
 ok(o.recordSame&&o.exportClean&&o.diskClean,'and never on the record: the profile, its export and the profile store carry no token');
 ok(!o.pwLeak,'no password typed in any attempt reaches storage');
 ok(o.signedRow&&o.secMethod,'signed in, Account shows the email and Sign out, and Security names the method');
 ok(o.check==='ok','the boot check accepts a session the server knows');
 const bearer=seen.filter(s=>s.u==='/v1/me'&&s.auth==='Bearer t-probe');
 ok(bearer.length>0&&bearer[0].origin==='null','the check carries the bearer header, from the origin a downloaded file sends, and the preflight let it through');
 ok(/^Signed out on this browser\./.test(o.outOff[0])&&o.outOffHeld==='','sign out with no network still ends it here, and says the server did not hear, got '+JSON.stringify(o.outOff));
 ok(o.out[0]==='Signed out.'&&o.out[1]==='ok'&&o.outHeld==='','sign out the server confirms, got '+JSON.stringify(o.out));
 ok(seen.some(s=>s.u==='/v1/auth/signout'&&s.auth==='Bearer t-probe'),'and it told the server, with the session');
 ok(o.stale==='ended'&&o.staleHeld===''&&/^Signed out\./.test(o.staleSaid[0])&&o.staleSaid[1]==='fail',
  'a session the server does not know is ended at boot and says so, got '+JSON.stringify(o.staleSaid));
 ok(o.offCheck==='unchecked'&&o.offCheckHeld,'a boot with no network keeps the session, because offline is not signed out');
 ok(o.cardFields,'the login card carries one identifier field, a passphrase, Log in, Create account and Guest, and neither the old email field nor a second username one');
 ok(o.cardOff&&o.cardOff[0]===reach&&o.cardOff[1]==='fail'&&o.cardStillOpen,
  'the card shows the failure itself, since it covers the status line, and stays open, got '+JSON.stringify(o.cardOff));
 ok(o.resetCarried==='probe@example.invalid'&&o.backCarried==='probe@example.invalid','the identifier is carried to the reset view and back');
 ok(o.forgot&&o.forgot[0]==='If an account uses that email, a link to set a new passphrase is on its way.',
  'the forgotten password says the server\'s one answer for both cases, got '+JSON.stringify(o.forgot));
 ok(seen.some(x=>x.u==='/v1/auth/forgot'&&x.email==='probe@example.invalid'),'and the request reached the server');
 ok(o.cardWrong&&o.cardWrong[0]==='No account matches that email and passphrase.','the card shows a refusal in its own word for the secret, got '+JSON.stringify(o.cardWrong));
 ok(o.cardIn&&o.cardInSaid[0]==='Signed in as probe@example.invalid.'&&/t-probe/.test(o.cardHeld),'a yes closes the card, says who, and holds the session');
 ok(o.bootSkipped,'a person already signed in is not shown the door');
 ok(o.skip,'Guest goes through and holds nothing');
 /* Manage billing used to answer "not built yet. Email support" on every
    press. It goes to /v1/billing/portal now, through ui/auth.js. */
 ok(/^Sign in first\./.test(o.manOut[0])&&o.manOut[1]==='fail'
  &&!seen.some(s=>s.u==='/v1/billing/portal'&&!s.auth),
  'Manage billing signed out answers here, and sends nothing, got '+JSON.stringify(o.manOut));
 ok(o.manNone[0]==='There is no paid plan on this account yet, so there is no billing to manage.'&&o.manNone[1]==='fail',
  'with nothing bought it says the server\'s own reason, got '+JSON.stringify(o.manNone));
 ok(!/not built|email support/i.test(o.manOut[0]+o.manNone[0]),'and neither answer says Manage billing is unbuilt');
 ok(seen.some(s=>s.m==='POST'&&s.u==='/v1/billing/portal'&&s.auth==='Bearer t-probe'),
  'the request carries the session and nothing else names the account');
 ok(o.manPaid&&o.manPaid.ok&&o.manPaid.url==='https://billing.stripe.test/1',
  'with a customer on the account it hands back Stripe\'s page to go to, got '+JSON.stringify(o.manPaid));
 ok(o.manOff&&!o.manOff.ok&&o.manOff.say===reach,'and with no network it says so rather than hanging, got '+JSON.stringify(o.manOff));
 /* the plan read back off the account, through ui/auth.js authPlanTake */
 ok(o.own,'the plan walk runs on a real record, one PROFILES holds');
 ok(o.rbPaid.took==='live'&&o.rbPaid.free==='one'&&o.rbPaid.plan.status==='active'&&o.rbPaid.plan.until==='2026-11-01T00:00:00.000Z'
  &&o.rbPaid.said[0]==='Tier one is on this record now.',
  'a paid account lands its tier on the open record and says so after, got '+JSON.stringify(o.rbPaid));
 ok(o.rbDisk&&o.rbDisk.tier==='one'&&o.rbDisk.status==='active','and the record on the disk carries it, got '+JSON.stringify(o.rbDisk));
 ok(o.rbAgain.took==='same'&&o.rbAgain.said[0]==='probe, before the plan read','read again, nothing moves and nothing is said');
 ok(o.rbLate.took==='live'&&o.rbLate.free==='one'&&/did not go through/.test(o.rbLate.said[0])&&o.rbLate.said[1]==='fail',
  'past due keeps the tier and holds a line about the card, got '+JSON.stringify(o.rbLate.said));
 ok(o.rbEnded.free==='free'&&o.rbEnded.plan.tier==='one'&&o.rbEnded.plan.status==='canceled'
  &&o.rbEnded.said[0]==='Tier one has ended, so this record reads Free now.'&&o.rbEnded.said[1]==='fail',
  'a cancelled plan reads free, keeps which tier ended, and says so on a held line, got '+JSON.stringify(o.rbEnded.said));
 ok(o.rbNone.free==='free'&&o.rbNone.said[0]==='The account signed in has no paid plan, so this record reads Free now.',
  'an account with no paid plan never overwrites a paid record without saying so, got '+JSON.stringify(o.rbNone.said));
 ok(o.rbOdd.took==='refused'&&o.rbOdd.free==='one'&&/does not know, five/.test(o.rbOdd.said[0]),
  'a tier this build does not know is refused and nothing moves, got '+JSON.stringify(o.rbOdd));
 ok(o.rbOld.took==='silent'&&o.rbOld.free==='one','a server that sends no billing at all changes nothing');
 ok(o.rbExample==='not a record','a worked example is never written');
 ok(o.backDone.tier==='one'&&o.backDone.said[0]==='Tier one is on this record now.'&&o.backDone.search==='?dev=1',
  'back from Stripe the plan lands and ?billing= comes off the address, keeping ?dev=1, got '+JSON.stringify(o.backDone));
 ok(/^Payment finished\. Log in from Account/.test(o.backOut.said[0])&&o.backOut.search==='?dev=1',
  'back from Stripe with no session held says where the plan is, got '+JSON.stringify(o.backOut));
 ok(o.backCancel.said[0]==='Checkout was closed before paying, so nothing was charged.','a closed checkout says nothing was charged');
 ok(o.backWait.said[0]==='Payment finished. Waiting for Stripe to confirm it.'
  &&/^Stripe has not confirmed the payment yet\./.test(o.backWaitEnd[0])&&o.backWaitEnd[1]==='fail',
  'a payment Stripe has not confirmed yet is waited on, and the end of the wait is said, got '+JSON.stringify([o.backWait.said,o.backWaitEnd]));
 const usedUserName=c=>c.b&&c.b.username!==undefined;
 ok(D.row.tops[0]===D.row.tops[1]&&D.row.tops[1]===D.row.tops[2]&&D.row.lefts[0]<D.row.lefts[1]&&D.row.lefts[1]<D.row.lefts[2],
  'Log in, Create account and Guest sit in one row, in that order, got '+JSON.stringify(D.row));
 ok(D.row.labels.join('|')==='Log in|Create account|Guest'&&D.row.pri.join()==='true,false,false','the three are labelled as ruled and Log in is the primary');
 ok(D.logIns===1,'there is exactly one Log in on the screen, got '+D.logIns);
 ok(D.mode0==='login'&&D.state0==='idle','the door opens on log in, idle');
 ok(!D.agree0.checked&&!D.agree0.attr&&!D.agree0.shown,'the agreement box starts unticked, is not preticked in the markup, and is not on the log in card');
 ok(D.wm==='rgb(126, 184, 212)','the wordmark is the blue, got '+D.wm);
 ok(D.dev.l>.7&&D.dev.t>.9&&D.dev.w<260&&D.dev.h<60,'developer options is small and in the lower right, got '+JSON.stringify(D.dev));
 ok(D.consent==='By continuing you agree to the Terms and the Privacy policy.','the consent line reads as ruled, got '+JSON.stringify(D.consent));
 ok(D.links.length===4&&D.links.every(l=>l[1]==='_blank'&&l[2])&&D.links.filter(l=>l[0]==='https://atuned.world/terms').length===2
  &&D.links.filter(l=>l[0]==='https://atuned.world/privacy').length===2,
  'Terms and Privacy policy link to atuned.world in a new tab, in the line and beside the box, got '+JSON.stringify(D.links));
 ok(D.h1==='There is more running you than you can see.','the headline is the approved one');
 ok(D.idOn==='1'&&D.pwOn[0]==='1'&&Math.abs(+D.pwOn[1]-.5)<.001,'a name lights the top node, and ten characters of twenty draw half the ring, got '+JSON.stringify([D.idOn,D.pwOn]));
 ok(D.refused[0][0]==='Enter your username or email.','an empty field is asked for, got '+JSON.stringify(D.refused[0]));
 ok(D.refused[1][0]===D.rule&&D.refused[2][0]===D.rule,'a username that is too short or has a space is refused with the whole rule, got '+JSON.stringify(D.refused.slice(1,3)));
 ok(D.refused[3][0]==='The email address is not complete.','an incomplete email keeps its own sentence, got '+JSON.stringify(D.refused[3]));
 ok(D.refused[4][0]==='Enter a passphrase.','and the secret is called a passphrase on this door, got '+JSON.stringify(D.refused[4]));
 ok(D.refusedSent===0&&D.refusedState==='idle','none of those five sent anything, and none drew the crossed ring');
 ok(D.user.calls.length===1&&D.user.calls[0].u==='/v1/auth/signin'
  &&JSON.stringify(Object.keys(D.user.calls[0].b).sort())==='["password","username"]'&&D.user.calls[0].b.username==='mika_salas',
  'a username goes as {username} on the sign in route, folded to lower case, with no email key, got '+JSON.stringify(D.user.calls));
 ok(D.user.said[0]==='Signed in as mika_salas.'&&D.user.said[1]==='ok'&&/"email":"mika_salas"/.test(D.user.held)&&!D.user.open&&D.user.door==='none',
  'and it signs in under the name, holds it, and closes the door, got '+JSON.stringify([D.user.said,D.user.held,D.user.open,D.user.door]));
 ok(D.userCheck==='ok'&&/t-user/.test(D.userHeldAfter),'the boot check accepts an account that comes back with a username and no email');
 ok(D.today.msg&&D.today.msg[0]==='Email is required.'&&D.today.msg[1]==='fail'&&D.today.open&&D.today.held==='',
  'a username the server cannot read is refused in the server\'s own words, held nowhere, with the door still open, got '+JSON.stringify(D.today));
 ok(D.today.state==='error'&&D.today.p<=.6,'and the ring draws the refusal and stops where it was, got '+JSON.stringify([D.today.state,D.today.p]));
 ok(D.unknown&&D.unknown[0]==='No account matches that username and passphrase.','a name nobody holds says so, in the door\'s own words, got '+JSON.stringify(D.unknown));
 ok(D.cleared.state==='idle'&&D.cleared.msg[0]==='','correcting the field takes the refusal and the crossed ring away');
 ok(D.email.calls.length===1&&D.email.calls[0].u==='/v1/auth/signin'&&JSON.stringify(Object.keys(D.email.calls[0].b).sort())==='["email","password"]'
  &&D.email.calls[0].b.email==='probe@example.invalid'&&!D.email.calls.some(usedUserName),
  'an email goes exactly where it always went, with the body it always had, got '+JSON.stringify(D.email.calls));
 ok(D.cr0===0&&D.cr1.mode==='create'&&D.cr1.sent===0,'the first press of Create account opens the new account card and sends nothing');
 ok(D.cr1.newPri&&!D.cr1.goPri&&D.cr1.ac==='new-password','and the primary moves to it, and the secret is offered as a new one');
 ok(D.cr1.boxShown&&!D.cr1.boxTicked&&!D.cr1.forgotShown&&D.cr1.sugShown,'the box is there and unticked, Suggest is there, and the forgotten passphrase is not');
 ok(D.cr1.hint==='Usernames are not open yet. Use an email address.','the card says before anything is typed that a username cannot be made yet, got '+JSON.stringify(D.cr1.hint));
 ok(/^matrix\(1\.25, /.test(D.cr1.ring),'on a wide screen the ring opens by a quarter to hold the taller card, got '+D.cr1.ring);
 ok(D.recUser===false&&D.recEmail===true,'the recovery email shows beside a username and goes when an email is typed');
 ok(D.crUser&&D.crUser[0]==='Usernames are not open yet. Create the account with an email address, or press Guest.'&&D.crUser[1]==='fail'&&D.crUserSent===0,
  'creating by username is refused with a plain line and nothing is sent, got '+JSON.stringify([D.crUser,D.crUserSent]));
 ok(D.unticked&&D.crBox&&D.crBox[0]==='Tick the box to agree to the Terms and the Privacy policy.'&&D.crBoxSent===0,
  'an unticked box refuses the new account and nothing is sent, got '+JSON.stringify([D.crBox,D.crBoxSent]));
 ok(D.crOk.calls.length===1&&D.crOk.calls[0].u==='/v1/auth/signup'&&JSON.stringify(Object.keys(D.crOk.calls[0].b).sort())==='["email","password"]'
  &&D.crOk.said[0]==='Account created. Signed in as new@example.invalid.'&&D.crOk.said[1]==='ok'&&/t-new/.test(D.crOk.held),
  'ticked, an email account is created on the route it always used, got '+JSON.stringify(D.crOk));
 ok(D.back.mode==='login'&&D.back.sent===0&&D.back.goPri,'Log in pressed on the new account card goes back to log in and sends nothing');
 ok(D.hintOpen.indexOf(D.rule)===0,'once usernames are open the hint is the rule, got '+JSON.stringify(D.hintOpen));
 ok(D.recBad&&D.recBad[0]==='The recovery email is not complete.'&&D.recBadSent===0,'a recovery email that is not one is refused before it is sent');
 ok(D.crUserOk.calls.length===1&&D.crUserOk.calls[0].u==='/v1/auth/signup'
  &&JSON.stringify(Object.keys(D.crUserOk.calls[0].b).sort())==='["email","password","username"]'
  &&D.crUserOk.calls[0].b.username==='mika_new'&&D.crUserOk.calls[0].b.email==='me@example.invalid'
  &&D.crUserOk.said[0]==='Account created. Signed in as mika_new.',
  'with usernames open, a new account sends the username, the recovery email and the passphrase, got '+JSON.stringify(D.crUserOk));
 ok(D.fCarried==='mika_salas'&&D.fView==='reset'&&D.fBack==='in','the forgotten passphrase view carries the name and returns');
 ok(D.fUser.calls.length===1&&D.fUser.calls[0].u==='/v1/auth/forgot'&&JSON.stringify(D.fUser.calls[0].b)==='{"username":"mika_salas"}'
  &&/^If an account uses that username/.test(D.fUser.msg[0]),'a forgotten passphrase by username is sent as {username}, got '+JSON.stringify(D.fUser));
 ok(D.doorOn.app==='hidden'&&D.doorOn.door==='visible','under html.door the app is not painted and the door is, got '+JSON.stringify(D.doorOn));
 ok(D.guestLift&&!D.guestOpen&&D.closeLift&&D.heldLift&&D.devLift,'Guest, a close, a held session and the developer skip each take html.door off');
 ok(D.wiped,'a passphrase is not left in a field of a door that has closed');
 ok(spErr.length===0,'no page errors across the whole walk: '+spErr.join(' | '));}

console.log('\n=== the door is the first paint, and no frame of the app comes before it (round OT) ===');
/* His words: "One frame before login starts, I can see the dashboard or the
   field. It should start with the login." The door is static markup in the
   first bytes of the file and the head sets html.door before anything is
   painted, so what is held here is read two ways. The static way: the file is
   cut off where its first script begins, so no instrument has run at all, and
   the door is still there, still painted, with the app under it hidden. And the
   live way: the real build is opened with a frame by frame watch that runs from
   the first frame on and records every frame in which any part of the app is
   painted while the door is not yet closed. It must be none. Checked against
   the build as it was before this round: that build opened the door from
   script, so the same watch reads the app painted for as long as the file took
   to parse. */
{
 const fs=require('fs'), {execFileSync}=require('child_process'), http=require('http');
 const E=require(path.resolve('engine.js'));
 const html=fs.readFileSync(path.resolve(process.env.ATUNED_FILE||'source.html'),'utf8');
 const mark=html.indexOf('THE BOOT GUARD, IN A SCRIPT BLOCK OF ITS OWN.');
 const cutAt=html.lastIndexOf('<!--',mark);
 const bare=html.slice(0,cutAt)+'</body></html>';
 const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html; charset=utf-8'}); r.end(bare);});
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));
 const URL0='http://127.0.0.1:'+srv.address().port+'/';
 let geo='ok'; try{ execFileSync('node',['tools/bootgeo.js','--check'],{stdio:'pipe'}); }catch(e){ geo=String(e.stdout||e.message); }
 ok(geo==='ok','the door\'s ring is current against the engine: '+geo.trim());
 const read=async(url,js)=>{ const ctx=await browser.newContext({viewport:{width:1600,height:1000},javaScriptEnabled:js});
  const p=await ctx.newPage();
  await p.goto(url,{waitUntil:'load'});
  const r=await p.evaluate(()=>{
   const $=id=>document.getElementById(id), cs=e=>getComputedStyle(e);
   const root=document.documentElement;
   const ticks=[...document.querySelectorAll('#login .lg-t')];
   const st=document.createElement('style'); st.textContent='#boot{display:none!important}'; document.head.appendChild(st);
   const top=document.elementFromPoint(innerWidth/2,innerHeight/2);
   const nojs=document.querySelector('.nojs');
   return {door:root.classList.contains('door'), login:cs($('login')).display, loginVis:cs($('login')).visibility,
    app:cs($('tabbar')).visibility, scripted:typeof loginOpen!=='undefined',
    fields:!!($('loginid')&&$('loginpass')&&$('loginb-go')&&$('loginb-new')&&$('loginb-skip')),
    paintedAt:top?(top.closest('#login')?'login':(top.tagName+'#'+top.id)):'nothing',
    ticks:ticks.map(t=>[+t.getAttribute('data-s'),t.style.getPropertyValue('--c').trim()]),
    nojs:!!nojs&&cs(nojs).display!=='none'}; });
  await ctx.close(); return r; };
 const live=await read(URL0,true), dev=await read(URL0+'?dev=1',true), none=await read(URL0,false);
 ok(live.door&&live.login==='flex'&&live.loginVis==='visible'&&live.fields&&!live.scripted,
  'cut off before any script runs, the door is already standing, visible and complete, got '+JSON.stringify([live.door,live.login,live.fields,live.scripted]));
 ok(live.app==='hidden','and the app under it is not painted, got '+live.app);
 ok(live.paintedAt==='login','what is painted at the centre of the screen is the door, got '+live.paintedAt);
 ok(!dev.door&&dev.login==='none'&&dev.app==='visible','with ?dev=1 there is no door and the app is painted, as the gates need');
 ok(!none.door&&none.login==='none'&&none.nojs,'with scripts off there is no door and the notice is what is read');
 const N=E.W.length, seen=new Set(live.ticks.map(t=>t[0]));
 ok(live.ticks.length===N&&seen.size===N,'the ring has one tick for each address on the loop, '+live.ticks.length+' of '+N);
 ok(live.ticks.every(t=>t[1].toLowerCase()===E.PAL[E.W[t[0]].b].toLowerCase()),'and every tick is in its own seat\'s colour');
 await new Promise(r=>srv.close(r));
 /* the real build, boot and all, with the frame watch running from the start */
 const pg=await browser.newPage({viewport:{width:1600,height:1000}});
 await pg.addInitScript(()=>{
  window.__paint={frames:0,appFrames:0,first:null,doorFirst:null};
  const tick=()=>{ const P=window.__paint; P.frames++;
   const tb=document.getElementById('tabbar'), lg=document.getElementById('login');
   const closed=!!lg&&lg.style.display==='none';
   if(tb&&getComputedStyle(tb).visibility==='visible'&&!closed){ P.appFrames++; if(P.first===null)P.first=performance.now(); }
   if(lg&&P.doorFirst===null&&getComputedStyle(lg).display!=='none')P.doorFirst=performance.now();
   requestAnimationFrame(tick); };
  requestAnimationFrame(tick); });
 const perr=[]; pg.on('pageerror',e=>perr.push(e.message));
 await pg.goto('file://'+path.resolve(process.env.ATUNED_FILE||'source.html'),{waitUntil:'load'});
 await booted(pg);
 const L=await pg.evaluate(()=>{ const $=id=>document.getElementById(id), P=window.__paint;
  const top=document.elementFromPoint(innerWidth/2,innerHeight/2);
  return {P:P, open:LOGIN.open, door:document.documentElement.classList.contains('door'),
   app:getComputedStyle($('tabbar')).visibility, at:top?(top.closest('#login')?'login':top.tagName+'#'+top.id):'nothing',
   booted:document.body.classList.contains('booted')}; });
 ok(L.P.frames>20&&L.P.doorFirst!==null,'the frame watch ran from the first frame and saw the door, over '+L.P.frames+' frames');
 ok(L.P.appFrames===0,'in no frame of the whole boot was any part of the app painted while the door was not closed, got '+L.P.appFrames+' frames');
 ok(L.open&&L.door&&L.app==='hidden'&&L.at==='login','when the boot sheet lifts, the door is what is under it and the app is still not painted, got '+JSON.stringify([L.open,L.door,L.app,L.at]));
 await pg.click('#loginb-skip'); await pg.waitForTimeout(200);
 const G=await pg.evaluate(()=>({open:LOGIN.open, door:document.documentElement.classList.contains('door'),
  app:getComputedStyle(document.getElementById('tabbar')).visibility}));
 ok(!G.open&&!G.door&&G.app==='visible','Guest takes the door away and the app is there, got '+JSON.stringify(G));
 ok(perr.length===0,'no page errors through the boot and the door: '+perr.join(' | '));
 await pg.close();
 /* the narrow screen, where the row of three has the least room */
 const nb=await browser.newPage({viewport:{width:390,height:844}});
 const nerr=[]; nb.on('pageerror',e=>nerr.push(e.message));
 await nb.goto(FILE,{waitUntil:'load'}); await booted(nb);
 const M=await nb.evaluate(()=>{ loginOpen(); const $=id=>document.getElementById(id);
  const r=['loginb-go','loginb-new','loginb-skip'].map(i=>$(i).getBoundingClientRect());
  const f=['loginid','loginpass'].map(i=>$(i).getBoundingClientRect());
  const h1=document.querySelector('#login h1').getBoundingClientRect();
  return {tops:r.map(x=>Math.round(x.top)), rights:r.map(x=>Math.round(x.right)), lefts:r.map(x=>Math.round(x.left)),
   min:Math.min.apply(null,r.map(x=>Math.min(x.width,x.height)).concat(f.map(x=>Math.min(x.width,x.height)))),
   wide:document.getElementById('login').scrollWidth, over:document.documentElement.scrollWidth,
   h1:Math.round(h1.top), bottom:Math.round(r[0].bottom)}; });
 ok(M.tops[0]===M.tops[1]&&M.tops[1]===M.tops[2]&&M.lefts[0]>=0&&M.rights[2]<=390,'at 390 the three buttons are one row and inside the screen, got '+JSON.stringify(M));
 ok(M.min>=44,'every button and field is at least 44 pixels both ways, the smallest is '+M.min);
 ok(M.wide<=390&&M.over<=390,'and nothing scrolls sideways, got '+M.wide+' and '+M.over);
 ok(M.bottom<=844,'the log in card fits above the fold at 390 by 844, its buttons end at '+M.bottom);
 ok(nerr.length===0,'no page errors at 390: '+nerr.join(' | '));
 await nb.close();}

console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})();
