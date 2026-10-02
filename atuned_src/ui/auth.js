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
   exactly as before. One field of a profile is written from here and nothing
   else is: the plan, read back off the account by authPlanTake at the foot of
   this file, because only the server knows what was paid for. The session
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
/* WHETHER THE SERVER HOLDS A USERNAME YET. It does not: it keys an account on
   the email and reads no other identifier, and the owner's round OT ruling
   ("we want them to log in by their username") needs a server slice that has
   not shipped. One flag says so, so the day it ships is one word here and a
   server answer, and not a hunt through the card.

   A SIGN IN BY USERNAME IS SENT REGARDLESS, as {username} on the same route,
   and the server's own refusal is what the person reads. That is true
   whatever the server does, and a check here that refused it first would be
   this file claiming to know what the server will say.

   CREATING IS THE ONE PRESS THIS GATES, AND ONLY HALF OF IT. A username with
   no email behind it is an account the server cannot key at all, so while this
   is false that press is refused here with a plain line and nothing is sent.
   A username WITH a recovery email goes out as it is, {username, email,
   password}, and the server keys the account on the email as it always has.
   What it must not do is let the person think they now have a username that
   works. The answer is read for that: an account that comes back without the
   username is said to have come back without it, in the line that reports
   the creation (authEnter), so the success claimed is the one that happened. */
var AUTH_USERNAMES=false;
/* THE ONE ADAPTER BETWEEN WHAT A PERSON TYPES AND WHAT THE SERVER IS SENT.
   Anything with an at sign is an email and goes as {email}, exactly the body
   every route took before this existed, so the existing sign in is not
   touched. Anything else is a username and goes as {username}, folded to
   lower case. The kind is read by engine/identity.js, so the card's checks and
   this body cannot disagree about which one was typed. Nothing else in the
   product builds an identifier by hand. */
function authIdent(s){
 var v=identNorm(s);
 return identKind(v)==='username'?{username:v}:{email:v};}
/* THE NAME TO PRINT BESIDE "Signed in as", AND THE ONE THE SESSION IS HELD
   UNDER. An account that has a username is known by it, because that is the
   name its owner logs in by and the one they chose. An account with none is
   known by its email, which is every account the server holds today, so for
   them nothing here changes. An account the server knows by username may
   answer with no email at all, and "no email" must not read as "not signed
   in": authCheck once asked for a string email on the answer and would have
   said the server could not check a sign in it had just made. */
function authHandle(acc,fallback){
 if(acc&&typeof acc.username==='string'&&acc.username)return acc.username;
 if(acc&&typeof acc.email==='string'&&acc.email)return acc.email;
 return fallback||'';}
/* What went wrong, as one sentence. Three answers are this file's because
   the server's word for them would mislead here: no connection has no server
   words at all, a refused sign in must not say which of the two fields was
   wrong, and a taken name has a route the server cannot name.

   o is the login card's own wording and is absent for the Account section,
   which says email and password and always has: o.kind is what was typed, and
   o.noun is the word the screen uses for the secret, passphrase on the door
   and password inside, one word per screen and each screen keeping its own. */
function authWhy(r,route,o){
 var noun=(o&&o.noun)||'password', name=(o&&o.kind==='username')?'username':'email';
 if(r.late)return 'The server did not answer in time. Try again.';
 if(!r.status)return 'Could not reach the server. Check the connection and try again.';
 if(route==='signin'&&r.status===401)return 'No account matches that '+name+' and '+noun+'.';
 if(route==='signup'&&r.status===409)
  return name==='username'?'That username is taken. Choose another.'
   :'An account already uses that email. Log in instead.';
 var said=(r.body&&typeof r.body.error==='string')?authSay(r.body.error):'';
 return said||('The server refused that, with code '+r.status+'.');}
/* Refused here, before a request, when the server would refuse it anyway. A
   new account is held to the length; an existing one is not, because an
   account made under an older rule must still be able to sign in.

   o.names turns on the door's second kind of identifier. Without it this is
   the email-only check it always was, word for word, so the Account section
   keeps its behaviour: a field there that is not an email is still "not
   complete", and never quietly becomes a username it has no way to take. */
function authFieldsWhy(mail,pw,isNew,o){
 var names=!!(o&&o.names), noun=(o&&o.noun)||'password';
 if(names){
  var kind=identKind(mail);
  if(!kind)return 'Enter your username or email.';
  if(kind==='username'){
   var bad=usernameWhy(mail); if(bad)return bad;
   /* a recovery email that is typed is checked whatever else is true of it */
   if(isNew&&o.recovery&&(!AUTH_MAIL.test(o.recovery)||o.recovery.length>254))
    return 'The recovery email is not complete.';
   /* and a username with nothing behind it cannot be created until the server
      can key an account on it, and not at all when used to log in: see
      AUTH_USERNAMES above */
   if(isNew&&!AUTH_USERNAMES&&!o.recovery)
    return 'Add a recovery email to create an account with a username.';}
  else if(!AUTH_MAIL.test(mail)||mail.length>254)return 'The email address is not complete.';}
 else{
  if(!mail)return 'Enter an email address.';
  if(!AUTH_MAIL.test(mail)||mail.length>254)return 'The email address is not complete.';}
 if(pw===undefined)return '';
 if(!pw)return 'Enter a '+noun+'.';
 if(pw.length>AUTH_PW_MAX)return 'A '+noun+' can be at most '+AUTH_PW_MAX+' characters.';
 if(isNew&&pw.length<AUTH_PW_MIN)return 'A '+noun+' needs at least '+AUTH_PW_MIN+' characters.';
 return '';}
/* SIGN IN OR SIGN UP. Both routes answer the same shape, a token and the
   account, so one function carries both. Resolves {ok, kept, say}: say is the
   sentence to show, and kept is false when the browser would not hold the
   session, which is still a sign in and is said as one that ends on reload.

   o is {names, noun, recovery}, and only the login card passes it: names lets
   the identifier be a username, noun is the card's word for the secret, and
   recovery is the optional email beside a username on a new account. */
function authEnter(route,mail,pw,o){
 var isNew=route==='signup';
 var bad=authFieldsWhy(mail,pw,isNew,o);
 if(bad)return Promise.resolve({ok:false, say:bad});
 var body=(o&&o.names)?authIdent(mail):{email:mail}, kind=body.username?'username':'email';
 body.password=pw;
 /* the recovery email rides only with a username, where it is the one way
    back in. With an email as the identifier it would be the same address
    twice. Its key is a guess at the server slice that does not exist yet:
    email, the field the server already reads for contact. */
 if(isNew&&kind==='username'&&o&&o.recovery)body.email=o.recovery;
 var why={kind:kind, noun:o&&o.noun};
 return authCall('POST','/v1/auth/'+route,body).then(function(r){
  var b=r.body||{}, acc=b.account||{};
  if(!r.ok)return {ok:false, say:authWhy(r,route,why)};
  if(typeof b.token!=='string'||!b.token)
   return {ok:false, say:'The server answered without a sign in. Nothing changed.'};
  var s={token:b.token, email:authHandle(acc,kind==='username'?body.username:mail.toLowerCase())};
  var kept=authKeep(s);
  /* A USERNAME THE SERVER DID NOT KEEP IS SAID, NOT HIDDEN. The account that
     came back has no username, so it is the email account the server has
     always made, and the person is told which name to log in with. Reading it
     off the answer, never off the flag, so a server that keeps usernames and
     one that does not are both told the truth about what they did. */
  var dropped=isNew&&kind==='username'&&!(typeof acc.username==='string'&&acc.username);
  /* the plan is read after the sign in is held, and not waited on: the
     caller says "Signed in as" now, and the plan speaks after it only if the
     record changed. A second device is exactly this path. */
  authPlanRead();
  return {ok:true, kept:kept,
   say:(route==='signup'?'Account created. ':'')
    +(dropped?'The server does not hold usernames yet, so log in with '+s.email+'. ':'')
    +'Signed in as '+s.email+'.'
    +(kept?'':' Storage is blocked in this browser, so the sign in ends on reload.')};});}
/* THE FORGOTTEN PASSWORD SAYS WHAT THE SERVER SAYS, AND NO MORE. The server
   answers the same whether or not the address has an account, on purpose, so
   that this form cannot be used to find out who has one. The sentence here is
   one sentence for both cases for the same reason. It names the condition
   rather than promising an email, because for an address with no account no
   email is coming, and a line that promised one would be a lie to exactly the
   person who typed the wrong address. */
function authForgot(mail,o){
 var bad=authFieldsWhy(mail,undefined,false,o);
 if(bad)return Promise.resolve({ok:false, say:bad});
 var body=(o&&o.names)?authIdent(mail):{email:mail};
 return authCall('POST','/v1/auth/forgot',body).then(function(r){
  if(r.ok)return {ok:true,
   say:(o&&o.names&&body.username)
    ?'If an account uses that username, a link to set a new passphrase is on its way to its recovery email.'
    :'If an account uses that email, a link to set a new '+((o&&o.noun)||'password')+' is on its way.'};
  return {ok:false, say:authWhy(r,'forgot',{kind:body.username?'username':'email',noun:o&&o.noun})};});}
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
 /* the return from Stripe is read and taken off the address first, whatever
    else happens, so a reload never replays it */
 var back=authBillingBack();
 var s=authSession();
 if(!s){
  /* a browser that would not hold the session has lost it across the trip to
     Stripe, and the payment still happened, so it says where the plan is */
  if(back==='done')status('Payment finished. Log in from Account to bring the plan onto this record.','fail');
  return Promise.resolve(null);}
 return authCall('GET','/v1/me',null,s.token).then(function(r){
  var acc=r.body&&r.body.account, who=authHandle(acc,'');
  var redraw=function(){
   if(typeof S!=='undefined'&&typeof TAB!=='undefined'&&S.tab===TAB.SETTINGS
    &&typeof renderAccount==='function')renderAccount(); };
  if(r.ok&&acc&&who){
   if(who!==s.email){ authKeep({token:s.token, email:who}); redraw(); }
   /* the same answer carries the plan, so the boot check reads it without a
      second request */
   authPlanBack(back,r.body.billing);
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
/* MANAGE BILLING, the second half of the same seam. The server asks Stripe for a Customer
   Portal session for this account's own customer and hands back its URL, and that page is
   where a plan is moved, a card replaced or a plan stopped. Nothing is sent but the session:
   which customer to open is read off the sign in on the server, because a customer id sent
   from here would let one account ask for another's billing.

   Before this, the 'portal' case in ui/ui.js said "Managing billing from here is not built
   yet" and sent a person to email support, because the server had no route to call.

   Two refusals are worth their own sentence here. Signed out answers locally, as checkout
   does. And a 409 is the server saying this account has never finished a checkout, so there
   is no plan to manage: the server's own words say that, and authWhy shows them as they are,
   so this file types none of them. */
function authPlanPortal(){
 var s=authSession();
 if(!s)return Promise.resolve({ok:false,
  say:'Sign in first. Billing is held on your account, so there is nothing to manage while signed out.'});
 return authCall('POST','/v1/billing/portal',null,s.token).then(function(r){
  if(!r.ok)return {ok:false, say:authWhy(r,'portal')};
  var url=r.body&&r.body.url;
  if(typeof url!=='string'||!url)
   return {ok:false, say:'The server answered without a billing page. Nothing has changed.'};
  return {ok:true, url:url};});}
/* ============================================================
   THE PLAN, READ BACK FROM THE SERVER. Nothing wrote CURP.plan
   from the server, so a person who paid came back to a Billing
   section reading Free. This is the one writer: it reads the
   account's billing off /v1/me, lays it onto the open record
   with planFromServer (engine/plan.js, pure, gated headless),
   puts the result through validateProfile, the same boundary a
   pasted record goes through, saves, and only then says what
   changed.

   WHEN IT READS. After a sign in, which is also the second device
   case. At the boot check, off the same /v1/me answer, so it costs
   no extra request. And on the way back from Stripe, where
   ?billing=done, managed or cancelled is read once and taken off
   the address so a reload does not replay it.

   WHAT IT DECIDED, written down because each one could go another
   way:

   A server too old to send billing has said nothing, and nothing
   is written. undefined is not null: null is an account that never
   paid, and it reads free.

   Free from the server overwrites a paid record, and says so on a
   held line. The server is the one that knows: Stripe ended it, or
   the account signed in is not the one that paid. Either way the
   person is told, by name of the tier, and signing in to the right
   account puts it back. A quiet overwrite is what the ruling
   forbids, and keeping a tier the server says has ended would
   charge nobody for a plan.

   A cancelled plan arrives as its tier with Stripe's word for it,
   so the record keeps which tier ended and planOf reads it free.

   Sign out leaves the record as it is. Signing out says nothing
   about billing, and a person signing out on a train has not
   stopped paying. The next sign in or boot check corrects it.

   It writes the open record only, and only a real one. A worked
   example is not the person's record, so nothing is written while
   one is open. Other profiles on this device take the plan the
   next time they are open at a sign in or a boot.

   Only a change a person can see is said. A renewal moves the
   period and is written, and is not announced.
   ============================================================ */
var AUTH_PLAN_TRIES=5, AUTH_PLAN_WAIT_MS=2500;
function authPlanLive(){
 return typeof CURP!=='undefined'&&!!CURP&&typeof planState==='function'&&planState(CURP.plan)==='live';}
/* Lays b onto the open record. Answers what happened, as one word, for the
   callers below and for the gate. */
function authPlanTake(b){
 if(b===undefined)return 'silent';
 if(typeof CURP==='undefined'||!CURP||typeof PROFILES==='undefined'||PROFILES.indexOf(CURP)<0)
  return 'not a record';
 var r=planFromServer(CURP.plan,b,(CURP.meter&&CURP.meter.unique)||[]);
 if(r.refused){
  status('The server named a plan this build does not know, '+r.refused
   +', so this record was not changed.','fail');
  return 'refused';}
 if(r.same)return 'same';
 var v=validateProfile({v:SCHEMA_V, plan:r.plan});
 if(!v.ok){
  status('The plan the server sent could not be read, so this record was not changed. '
   +authSay(v.errs[0]),'fail');
  return 'refused';}
 CURP.plan=v.profile.plan;
 var saved=pSave();
 if(typeof S!=='undefined'&&typeof TAB!=='undefined'&&S.tab===TAB.SETTINGS
  &&typeof renderAccount==='function')renderAccount();
 var nm=PLAN_BY[r.now].nm, wasNm=PLAN_BY[r.was].nm, say='', kind='ok';
 if(r.nowLive&&(r.now!==r.was||!r.wasLive))say=nm+' is on this record now.';
 else if(r.nowLive&&r.status==='past_due'&&r.wasStatus!=='past_due'){
  say='The last card payment for '+nm+' did not go through. The plan stays on while Stripe '
   +'tries the card again, and Manage billing replaces the card.'; kind='fail';}
 /* held, because it takes something away, and a line that clears in two
    seconds is a change nobody was told about */
 else if(!r.nowLive&&r.wasLive){
  say=(b?wasNm+' has ended':'The account signed in has no paid plan')
   +', so this record reads Free now.'; kind='fail';}
 if(!saved){
  say=(say?say+' ':'')+'Storage would not take the change, so it holds for this visit '
   +'and is read again at the next sign in.'; kind='fail';}
 if(say)status(say,kind);
 return r.nowLive?'live':'free';}
/* One read of /v1/me and one take. Resolves, never rejects, like everything
   that goes through authCall. */
function authPlanRead(){
 var s=authSession();
 if(!s)return Promise.resolve({ok:false, took:'signed out'});
 return authCall('GET','/v1/me',null,s.token).then(function(r){
  if(!r.ok||!r.body)return {ok:false, took:'unread', status:r.status};
  return {ok:true, took:authPlanTake(r.body.billing)};});}
/* ?billing= is what the server sends Stripe back to (createCheckout and
   createPortal in reboot-os). Read once and removed, keeping every other
   parameter, so ?dev=1 and a hash survive. */
function authBillingBack(){
 var v=null;
 try{
  var q=new URLSearchParams(location.search||''); v=q.get('billing');
  if(v!==null){ q.delete('billing'); var rest=q.toString();
   history.replaceState(history.state,'',location.pathname+(rest?'?'+rest:'')+location.hash); } }
 catch(e){}
 return (v==='done'||v==='managed'||v==='cancelled')?v:null;}
/* THE WELCOME AFTER PAYING, round OX, his words: "after a person's done paying,
   there should be a pop-up screen welcoming them to the software. It should
   tell them to do the loop, go to the journal, input stories, and get used to
   using the software ten minutes a day until you no longer need it." Shown
   once per profile, only when the plan is live after a checkout return, and
   never for a managed or cancelled return. It rides the tutorial's own sheet
   host, which is idle at that moment. The flag is a ui fact, so it survives a
   load. */
function paidWelcomeOpen(){
 var h=document.getElementById('tutorial'); if(!h)return false;
 if(CURP&&CURP.ui&&CURP.ui.paidWelcomed)return false;
 if(typeof TUT!=='undefined'&&TUT.open)return false;
 h.classList.remove('ob-leaving');
 h.innerHTML='<div class="ob-card" role="dialog" aria-modal="true" aria-label="You are in">'
  +'<div class="ob-wash" aria-hidden="true"></div><div class="ob-scroll">'
  +'<span class="pm-eye">Paid</span>'
  +'<h2 class="ob-h">You are in.</h2>'
  +'<p class="ob-p">Do the loop: discover, play, flow, embody. Then do it again.</p>'
  +'<p class="ob-p">Go to the journal. Put your stories in.</p>'
  +'<p class="ob-p">Use it ten minutes a day, until you no longer need it.</p>'
  +'<div class="ob-acts"><button type="button" class="btn pri" id="pwgo">Go to the journal</button>'
  +'<button type="button" class="btn" id="pwlater">Later</button></div>'
  +'</div></div>';
 h.style.display='flex';
 var shut=function(){ h.classList.add('ob-leaving');
  setTimeout(function(){ h.style.display='none'; h.classList.remove('ob-leaving'); h.innerHTML=''; },520); };
 document.getElementById('pwgo').onclick=function(){ shut(); if(typeof setTab==='function')setTab(TAB.STORY); };
 document.getElementById('pwlater').onclick=shut;
 var g=document.getElementById('pwgo'); if(g)g.focus();
 if(typeof uiSet==='function')uiSet('paidWelcomed',true);
 return true;}
/* THE RETURN FROM STRIPE. Stripe sends the browser back the moment the card
   is taken, and its webhook to the server can land a few seconds later, so
   "done" with no live plan yet is waited on, a few reads apart, rather than
   read once as no plan. The wait is said, and so is its end. */
function authPlanBack(back,b){
 var took=authPlanTake(b);
 if(back==='cancelled'){ status('Checkout was closed before paying, so nothing was charged.'); return took; }
 if(back!=='done')return took;
 if(took==='not a record'){
  status('Payment finished. Open your own profile to see the plan on it.','fail'); return took;}
 if(authPlanLive()){
  if(took==='same')status(PLAN_BY[planOf(CURP.plan).k].nm+' is on this record.');
  paidWelcomeOpen();
  return took;}
 status('Payment finished. Waiting for Stripe to confirm it.');
 authPlanWait(AUTH_PLAN_TRIES);
 return took;}
function authPlanWait(n){
 setTimeout(function(){
  authPlanRead().then(function(){
   if(authPlanLive()){ paidWelcomeOpen(); return; }
   if(n>1){ authPlanWait(n-1); return; }
   status('Stripe has not confirmed the payment yet. The plan shows here once it does, '
    +'so reload this page in a minute.','fail');});},AUTH_PLAN_WAIT_MS);}
