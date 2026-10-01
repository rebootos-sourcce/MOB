/* ============================================================
   SIGN IN, AGAINST THE REAL SERVER. Round IA, "I need the login page, I need
   it wired in", round JJ, "the login page is tied to the database", and the
   order that put it first, 30 September: "finish the login first."

   THE ONE SEAM. This is the only file in the product that calls fetch, and it
   stays that way so "the app gains network at exactly one seam" (CLAUDE.md) is
   one grep and not an audit. It lives under ui/ because hostfree.py refuses
   fetch anywhere in engine/, and it should: the engine is pure, and a request
   is a thing the host does. ui/login.js and ui/account.js are its two callers
   and neither of them holds a request of its own.

   WHAT IT DOES AND DOES NOT CARRY. Sign up, sign in, the forgotten password
   request and sign out, against the four routes the reboot-os Worker serves.
   It does not sync. Every story, reading and imprint stays in this browser
   exactly as before, and nothing here reads or writes a profile. The session
   is held under its own key beside the profiles and never inside one: Export
   copies a profile to the clipboard, so a token written onto one would leave
   with the first export, and validateProfile now refuses one by name.

   AND EVERY CALL RESOLVES. A promise that rejects is a failure somebody has to
   remember to catch, and a caller that forgets it is a button that stays
   disabled for ever. authCall never rejects: a dropped connection, a refused
   CORS preflight, a blocked host and a server that never answers all come back
   as status 0, and the timer below turns "never answers" into an answer. The
   file runs with no network at all, which is its ordinary state for most
   people who download it, and nothing here may hang or throw because of that.
   ============================================================ */
/* THE ADDRESS IS PUBLIC AND IS NOT A SECRET. It is the Worker's own
   workers.dev name, printed in HOSTING-SETUP.md, and a browser shows it to
   anybody who opens the network tab. What must never be committed is a key,
   and there is none on this side: the only credential is the person's own
   session token, which the server hands back and this file keeps in their own
   browser. A var so a gate can point it at a stub. */
var AUTH_API='https://atuned-api.lance-o-powell.workers.dev';
var AUTH_KEY='source.session';
/* HOW LONG A REQUEST MAY TAKE BEFORE IT IS A FAILURE. A sign in runs a
   deliberately slow hash on the server, so this is generous, and it is still
   a ceiling: a request with none sits on "Checking with the server" for as
   long as a dead connection takes to give up, which in a browser can be
   minutes. */
var AUTH_WAIT_MS=15000;
/* THE SERVER'S OWN BOUNDS, mirrored so a password it will refuse is refused
   here before anything is sent. Read off atuned/server/src/index.js on main,
   30 September: signup requires 8 to MAX_PASSWORD, which is 200, and signin
   refuses over 200. The email shape is the server's validEmail, character for
   character, so this never passes an address the server refuses or refuses
   one it would take. If the server moves either, the server's own refusal
   still arrives and is shown; this only saves a round trip. */
var AUTH_PW_MIN=8, AUTH_PW_MAX=200;
var AUTH_MAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/* The session in memory, and whether the store has been read into it yet.
   Held in memory as well as in the store because a browser that blocks
   storage still deserves a sign in that lasts the visit, and says so. */
var AUTH_S=null, AUTH_READ=false;
/* READ ONCE THE STORE IS BOUND AND NOT BEFORE. ui/ui.js binds localStorage
   near the end of the build, and a read before that meets the engine's no-op
   store, which answers null. Caching that null would sign a person out for the
   whole visit, so the store is only read, and the read only remembered, once
   STORE_BOUND says there is a real one. Only the two fields a sign in needs
   come back out: the token, and the email to print beside "Signed in as". */
function authSession(){
 if(!AUTH_READ&&typeof STORE_BOUND!=='undefined'&&STORE_BOUND){
  AUTH_READ=true;
  try{ var o=JSON.parse(STORE.get(AUTH_KEY)||'null');
   if(o&&typeof o.token==='string'&&o.token&&typeof o.email==='string')
    AUTH_S={token:o.token, email:o.email}; }
  catch(e){ AUTH_S=null; } }
 return AUTH_S;}
/* True when the write landed, read back to prove it, the way storeSetAside in
   engine/schema.js proves its own. A set that did not throw is not a set that
   landed. */
function authKeep(s){
 AUTH_S=s; AUTH_READ=true;
 if(typeof STORE_BOUND==='undefined'||!STORE_BOUND)return false;
 var txt=s?JSON.stringify(s):'';
 try{ STORE.set(AUTH_KEY,txt); return STORE.get(AUTH_KEY)===txt; }catch(e){ return false; }}
function authForget(){ return authKeep(null); }
/* One request. Resolves to {ok, status, body, late}, and never rejects. */
function authCall(method,path,body,token){
 return new Promise(function(done){
  var ctl=null, timer=null, over=false;
  var end=function(r){ if(over)return; over=true; clearTimeout(timer); done(r); };
  if(typeof fetch!=='function'){ end({ok:false, status:0, body:null}); return; }
  try{ ctl=new AbortController(); }catch(e){ ctl=null; }
  timer=setTimeout(function(){
   if(ctl)try{ ctl.abort(); }catch(e){}
   end({ok:false, status:0, body:null, late:true}); },AUTH_WAIT_MS);
  var h={};
  if(body)h['Content-Type']='application/json';
  if(token)h.Authorization='Bearer '+token;
  var req;
  /* credentials omit: the session is the bearer header and nothing else, so no
     cookie of any host's is ever sent along with it. */
  try{ req=fetch(AUTH_API+path,{method:method, headers:h,
   body:body?JSON.stringify(body):undefined, signal:ctl?ctl.signal:undefined,
   cache:'no-store', credentials:'omit'}); }
  catch(e){ end({ok:false, status:0, body:null}); return; }
  /* the body is read as text and parsed here, because a Cloudflare error page
     in front of the Worker is HTML with a real status, and res.json() on it
     would throw away the status along with the page. */
  req.then(function(res){
    return res.text().then(function(t){
     var b=null; try{ b=JSON.parse(t); }catch(e){ b=null; }
     return {ok:res.ok, status:res.status, body:b}; },
    function(){ return {ok:res.ok, status:res.status, body:null}; }); },
   function(){ return {ok:false, status:0, body:null}; })
  .then(end,function(){ end({ok:false, status:0, body:null}); });});}
/* THE SERVER'S OWN WORDS, SET IN SENTENCE CASE. Its errors are lower case
   ("too many attempts. wait fifteen minutes"), and they are the true reason,
   so they are shown rather than rewritten. Rewriting them would also mean
   typing the server's numbers into this file, the fifteen minutes and the
   eight characters, which is the defect CLAUDE.md records a dozen times. */
function authSay(s){
 s=String(s||'').trim(); if(!s)return '';
 s=s.replace(/(^|[.?]\s+)([a-z])/g,function(m,a,b){return a+b.toUpperCase();});
 return /[.?]$/.test(s)?s:s+'.';}
/* What went wrong, as one sentence. Three answers are this file's because
   the server's word for them would mislead here: no connection has no server
   words at all, a refused sign in must not say which of the two fields was
   wrong, and a taken email has a route the server cannot name. */
function authWhy(r,route){
 if(r.late)return 'The server did not answer in time. Try again.';
 if(!r.status)return 'Could not reach the server. Check the connection and try again.';
 if(route==='signin'&&r.status===401)return 'No account matches that email and password.';
 if(route==='signup'&&r.status===409)return 'An account already uses that email. Log in instead.';
 var said=(r.body&&typeof r.body.error==='string')?authSay(r.body.error):'';
 return said||('The server refused that, with code '+r.status+'.');}
/* Refused here, before a request, when the server would refuse it anyway. A
   new account is held to the length; an existing one is not, because an
   account made under an older rule must still be able to sign in. */
function authFieldsWhy(mail,pw,isNew){
 if(!mail)return 'Enter an email address.';
 if(!AUTH_MAIL.test(mail)||mail.length>254)return 'The email address is not complete.';
 if(pw===undefined)return '';
 if(!pw)return 'Enter a password.';
 if(pw.length>AUTH_PW_MAX)return 'A password can be at most '+AUTH_PW_MAX+' characters.';
 if(isNew&&pw.length<AUTH_PW_MIN)return 'A password needs at least '+AUTH_PW_MIN+' characters.';
 return '';}
/* SIGN IN OR SIGN UP. Both routes answer the same shape, a token and the
   account, so one function carries both. Resolves {ok, kept, say}: say is the
   sentence to show, and kept is false when the browser would not hold the
   session, which is still a sign in and is said as one that ends on reload. */
function authEnter(route,mail,pw){
 var bad=authFieldsWhy(mail,pw,route==='signup');
 if(bad)return Promise.resolve({ok:false, say:bad});
 return authCall('POST','/v1/auth/'+route,{email:mail, password:pw}).then(function(r){
  var b=r.body||{}, acc=b.account||{};
  if(!r.ok)return {ok:false, say:authWhy(r,route)};
  if(typeof b.token!=='string'||!b.token)
   return {ok:false, say:'The server answered without a sign in. Nothing changed.'};
  var s={token:b.token, email:typeof acc.email==='string'?acc.email:mail.toLowerCase()};
  var kept=authKeep(s);
  return {ok:true, kept:kept,
   say:(route==='signup'?'Account created. ':'')+'Signed in as '+s.email+'.'
    +(kept?'':' Storage is blocked in this browser, so the sign in ends on reload.')};});}
/* THE FORGOTTEN PASSWORD SAYS WHAT THE SERVER SAYS, AND NO MORE. The server
   answers the same whether or not the address has an account, on purpose, so
   that this form cannot be used to find out who has one. The sentence here is
   one sentence for both cases for the same reason. It names the condition
   rather than promising an email, because for an address with no account no
   email is coming, and a line that promised one would be a lie to exactly the
   person who typed the wrong address. */
function authForgot(mail){
 var bad=authFieldsWhy(mail);
 if(bad)return Promise.resolve({ok:false, say:bad});
 return authCall('POST','/v1/auth/forgot',{email:mail}).then(function(r){
  if(r.ok)return {ok:true,
   say:'If an account uses that email, a link to set a new password is on its way.'};
  return {ok:false, say:authWhy(r,'forgot')};});}
/* SIGN OUT ENDS IT HERE WHATEVER THE SERVER SAYS. A person who pressed Sign
   out on a train has asked for this browser to stop being signed in, and
   refusing that because the server is out of reach would keep a session they
   asked to end. What the sentence then says is where it ended: here always,
   and on the server only when the server confirmed it. A 401 is the server
   saying the session had already ended, which is the same result. */
function authSignOut(){
 var s=authSession();
 if(!s)return Promise.resolve({ok:true, say:'Not signed in.'});
 return authCall('POST','/v1/auth/signout',null,s.token).then(function(r){
  var gone=authForget();
  if(!gone)return {ok:false,
   say:'Signed out for this visit only. Storage would not take the change, so the sign in comes back on reload.'};
  if(r.ok||r.status===401)return {ok:true, say:'Signed out.'};
  return {ok:true, say:'Signed out on this browser. The server could not be reached, '
   +'so its copy of the session runs until it expires.'};});}
/* THE BOOT CHECK. A stored session is asked about once per boot, and only
   when there is one: a person who never signed in makes no request at all,
   which is what tests/design.js gate 7 watches. The answer decides one thing.
   A 401 means the server no longer knows this session, from expiry or a
   password reset elsewhere, and the browser stops claiming it. Anything else
   that is not a yes, including no network, changes nothing and says the check
   did not happen, because being offline is not being signed out. */
function authCheck(){
 var s=authSession();
 if(!s)return Promise.resolve(null);
 return authCall('GET','/v1/me',null,s.token).then(function(r){
  var acc=r.body&&r.body.account;
  var redraw=function(){
   if(typeof S!=='undefined'&&typeof TAB!=='undefined'&&S.tab===TAB.SETTINGS
    &&typeof renderAccount==='function')renderAccount(); };
  if(r.ok&&acc&&typeof acc.email==='string'){
   if(acc.email!==s.email){ authKeep({token:s.token, email:acc.email}); redraw(); }
   return 'ok';}
  if(r.status===401){
   authForget(); redraw();
   status('Signed out. The server has ended the sign in on this browser. Log in again from Account.','fail');
   return 'ended';}
  /* two sentences, because a server that answered with an error was reached,
     and saying it was not would send somebody to check a connection that works */
  status(r.status?'The server could not check this sign in. It stays on this browser.'
   :'The server could not be reached, so this sign in was not checked. It stays on this browser.');
  return 'unchecked';});}
/* THE PAYWALL'S HALF OF THE ONE SEAM, round NW: "build the paywall infrastructure." PLAN_HOST
   in ui/panels.js is bound, in ui/ui.js, to a host function that calls this and never fetch
   itself, so the rule this file's own header already states, that it is the only file in the
   product that calls fetch, stays true of a real checkout and not only of sign in.

   This asks for one thing: a Checkout Session Stripe will host, for one of engine/plan.js's
   own ladder keys ('one', 'two', 'three', 'four'), and hands back the URL to send the browser
   to. Nothing about a card ever reaches this file, because nothing about a card ever reaches
   the server either: the server asks Stripe for a page, and Stripe is the one who asks for the
   card, on a page this product never renders and never even links to directly, only through
   the URL Stripe's own answer carries.

   Signed out answers locally, the same reason authSignOut answers locally when there is
   nothing to sign out of: a request the server would refuse anyway, for lack of a session to
   open one for, is a request this file does not need to send to get the same answer. */
function authPlanCheckout(tier){
 var s=authSession();
 if(!s)return Promise.resolve({ok:false,
  say:'Sign in first. The plan is read from your record, and billing lives behind sign in.'});
 return authCall('POST','/v1/billing/checkout',{tier:tier},s.token).then(function(r){
  if(!r.ok)return {ok:false, say:authWhy(r,'checkout')};
  var url=r.body&&r.body.url;
  if(typeof url!=='string'||!url)
   return {ok:false, say:'The server answered without a checkout page. Nothing has changed.'};
  return {ok:true, url:url};});}
