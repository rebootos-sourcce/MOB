/* ============================================================
   LOGIN. Round MH and MI. His words: "I need to be able to create a
   login. So the login would be on the main tuned animation screen.
   And when I hit enter, it completes the zoom animation. And then
   takes me to onboarding." Corrected the same round: "the landing
   page needs to be the funnel, where they create their account,"
   which makes this screen the return door and not the front door;
   the funnel is. And then, keeping it simple while the real flow is
   designed: "let's keep it locally."

   ROUND MP REDESIGNED THE FIELDS AND KEPT THE HONESTY. Email,
   password, a suggested strong password and a forgot password link
   are real controls, "the login needs the typical login stuff." Two
   factor and OAuth are named in the same round and are not here:
   each needs a real provider and a decision only he can make about
   which ones, and two factor is his systems engineer's by round EZ,
   so they are queued rather than built silently under cover of
   "typical login stuff."

   AND ON 30 SEPTEMBER IT SIGNS IN FOR REAL. This paragraph used to
   say the reboot-os Worker had never deployed and so there was
   nothing to sign in to. It deployed that night, and he ordered this
   finished first: "finish the login first." Log in, Create account
   and the forgotten password now go to it through ui/auth.js, the
   one file that makes a request. Three things moved with that.

   The username field is gone. The server keys an account on the
   email and takes no username anywhere, so a field it ignores was a
   question asked for nothing and an answer thrown away in silence.
   (It is back, one round later, and the same reasoning is why it is
   back only as far as the server can honour it. See ROUND OT below.)

   Log in no longer lets anything through. A door that now checks
   needs a way past it that does not, or a person with no network or
   no account is locked out of an instrument that runs entirely on
   their own device: Continue without an account is that way, and it
   is exactly what pressing Log in used to do.

   And a session that is already held skips the door, loginBoot
   below. A login screen shown to somebody who is signed in asks for
   a password the browser is already holding.

   Nothing here syncs. A sign in names an account; every story and
   reading stays in this browser, as before.

   THE ONE SENTENCE THAT SAID SO OUT LOUD IS GONE, his own ruling:
   "get rid of the text that says this is a local build, nothing
   typed here is sent anywhere or checked against anything." The
   honesty moved into the forgot password panel, which said there was
   no account behind it yet, and that panel is real now as well. What
   is left to be honest about is said by the result of each press, in
   the card and on the status line, never before it.

   THE SEQUENCE IS THE DEFAULT NOW, reversing OB_AUTO's own September
   ruling, "let's turn off onboarding for now," for this one path
   only: onboard.js's own automatic-open check stays exactly as
   written, in case anything else ever reaches it, but the boot's own
   step below no longer reads it. What reads it now is DEV_SKIP, and
   the default is to show the door, his own words this round: "if
   it's not pressed, then it goes to the sequence." */
/* ============================================================
   ROUND OT REBUILT THE DOOR, LOGIN A, THE RING. His words: "One frame before
   login starts, I can see the dashboard or the field. It should start with
   the login. The login. Screen. Is not aesthetically pleasing. Make this page
   inviting and not so dry. We don't want people to log in by email. We want
   them to log in by their username. So when they create their account, they
   can set up by username. Move developer options to the lower right. Change
   the text continue with an account to just guest."

   WHAT CHANGED, AND WHAT DID NOT.

   The markup moved out of this file. The door is static in shell/body.html,
   painted from the first byte, and this file finds it, wires it and moves it
   between its modes by data attributes, so there is one copy of it. It used
   to be a string built here, which is the reason the first frame of the app
   was visible before it: a door made by script cannot be on screen before the
   script has run. html.door, set by a line in the head, is what keeps the app
   from painting in that gap, and every way out of the door takes it off.

   One field takes a username or an email. The kind is decided by an at sign
   (engine/identity.js), and ui/auth.js's authIdent is the only place that
   turns it into a request, so an email goes exactly where it always went and a
   username goes as {username} on the same routes. The server does not read
   usernames yet. A sign in by one is therefore sent and the server's own
   refusal is what the person reads, in the card, never a success this file
   made up. Creating one with no recovery email is refused here instead, with
   a plain line, and one with a recovery email is sent and reported for what
   came back, for the reason written at AUTH_USERNAMES.

   Three buttons in one row: Log in, Create account, Guest. There is one Log in
   on the screen. Create account is two presses by design. The first opens the
   fields a new account needs, the recovery email and the box that agrees to
   the Terms and the Privacy policy, and the second sends it. Log in, pressed
   while those are open, closes them and sends nothing: a sign in is never sent
   from a screen that is showing the terms of a new account.

   The ring behind the card carries state and nothing else. A name typed
   lights the node at the top. The passphrase draws the ring shut as it grows.
   A request out makes the two halves pulse. A refusal draws a crossed ring where
   the path stopped. A yes closes the ring and lights every address, and the
   door fades. None of it is decoration a gate could not read: each is a data
   attribute on the host, which is what the gate reads.
   ============================================================ */
var LOGIN={open:false,reset:false,busy:false,mode:'login'};
/* HOW LONG A PASSPHRASE DRAWS THE RING. Twenty characters closes it and more
   changes nothing. It is a picture's scale and not a rule: nothing refuses a
   passphrase for being short or long here, and the server's own bounds are
   AUTH_PW_MIN and AUTH_PW_MAX in ui/auth.js. */
var LOGIN_RING_FULL=20;
/* HOW LONG THE DOOR TAKES TO FADE OFF, which is the same half second the
   stylesheet gives #login. A timer and not an animationend, because a door
   that never gets to finish fading, on a machine that skipped the transition,
   must still end up hidden. */
var LOGIN_FADE_MS=520;
/* THE DEVELOPER SKIP. His words: "have a switch for that loading
   screen to turn onboarding tutorial off, so I can just bypass
   straight to the dashboard, just put it as a developer button, on
   the upper right hand corner. And if it's pressed, it's just skips."

   Two doors to the same flag, so a person testing this by hand and a
   gate testing it by script use the one switch: the button in the
   boot sheet's own corner, and ?dev=1 on the file's own URL, which is
   how the gate suite reaches the instrument without meeting the door
   first, the same way a developer's own press would. Read once, at
   load, because the boot sheet the button lives on is gone within a
   second of the page settling and nothing after that should still be
   asking the URL. This flag alone still means "skip the door and the
   sequence entirely," unchanged, and every browser gate still reaches
   the instrument through it. */
var DEV_SKIP=false;
(function(){
 try{ DEV_SKIP=/(?:^|[?&])dev=1(?:&|$)/.test(location.search||''); }catch(e){}
})();
/* THE TWO SWITCHES BEHIND THE DOOR, ROUND MP. His words: "the login
   screen should give me the options, I want onboarding and tutorial,
   if they're both off then it skips straight to dashboard, if one is
   on it plays one versus the other." These only matter once DEV_SKIP
   above has already let the login screen show; DEV_SKIP itself still
   bypasses both of these along with the door.

   THE TUTORIAL IS REAL NOW, ROUND NF. ui/tutorial.js wires tutorialOpen
   in, so the switch is enabled rather than disabled and pretending to
   work. Its own default stays off: onboarding is still the established
   first-run flow and nothing this round changes which of the two meets
   a stranger by default, only that the switch to see the other one for
   testing is no longer a dead control. Which of the two a real person
   meets on a genuine first run, and whether the tutorial should follow
   onboarding rather than only substitute for it, is still open and is
   named as open rather than decided here. */
var DEV_PLAY_ONBOARDING=true;
var DEV_PLAY_TUTORIAL=false;
/* A PASSWORD SUGGESTION IS A LOCAL ONE. Sixteen characters, one from
   each of four sets, the rest filled from all four combined and
   shuffled, so every suggestion actually contains a lower case letter,
   an upper case letter, a digit and a symbol rather than relying on
   chance to include one. crypto.getRandomValues, not Math.random: a
   suggested password is exactly the kind of value worth a real source
   of randomness. */
function loginSuggestPassword(){
 var sets=['abcdefghijkmnpqrstuvwxyz','ABCDEFGHJKLMNPQRSTUVWXYZ','23456789','!@#$%^&*-_?'];
 var all=sets.join(''), n=16, out=[];
 var rnd=function(max){
  try{ var a=new Uint32Array(1); crypto.getRandomValues(a); return a[0]%max; }
  catch(e){ return Math.floor(Math.random()*max); } };
 sets.forEach(function(s){ out.push(s[rnd(s.length)]); });
 while(out.length<n) out.push(all[rnd(all.length)]);
 for(var i=out.length-1;i>0;i--){ var j=rnd(i+1); var t=out[i]; out[i]=out[j]; out[j]=t; }
 return out.join('');}
/* THE DOOR IS FOUND, NEVER BUILT. shell/body.html carries it as static markup,
   so every one of these reads an element that is already there, and each is
   written to say nothing when it is not: a gate that stands up a page without
   the shell must not have the login throw into it. */
function loginHost(){ return document.getElementById('login'); }
function loginEl(id){ return document.getElementById(id); }
/* html.door is the head's first paint guard. It is taken off on every way out:
   a yes, Guest, a held session, the developer skip, and the guard when the
   build did not start. Never put back by this file: a door that closes and
   reopens for a sign out is an overlay and is opaque on its own. */
function loginDoor(on){
 try{ document.documentElement.classList[on?'add':'remove']('door'); }catch(e){}}
/* THE CARD SAYS IT, AND SO DOES STATUS. status() is the one writer every
   result goes through, and it is the live region a screen reader hears; but
   the status line sits in the top bar, under this door, which covers the
   whole screen. A refusal written only there is a refusal nobody sighted can
   see. So the door carries the same sentence on its own line, and the status
   line is told too, which is also what is still on screen when the door
   closes. A line that is only progress is the door's alone: nothing was
   written, so there is nothing for the status line to report.

   The line is the one in the view that is showing: the reset view has its own,
   because two elements may not share an id and a sentence about a reset belongs
   under the reset. */
function loginMsgEl(){ return loginEl(LOGIN.reset?'loginrmsg':'loginmsg'); }
function loginSay(msg,kind,own){
 var m=loginMsgEl();
 if(m){ m.textContent=msg||''; if(kind)m.setAttribute('data-kind',kind); else m.removeAttribute('data-kind'); }
 if(!own&&typeof status==='function')status(msg,kind);}
/* THE RING'S STATE, which is the door's one animation and is read off two
   data attributes and one custom property on the host, so a gate can read it
   without reading a frame. data-state is idle, busy, error or ok. data-id is
   whether a name has been typed. data-pw is whether the passphrase has a first
   character. --p is how much of the ring the passphrase has drawn, and it is
   pinned while a refusal or a yes is showing: a refusal stops the path where
   it was, and a yes closes it. */
function loginRing(){
 var h=loginHost(); if(!h)return;
 var pw=loginEl('loginpass'), id=loginEl('loginid');
 var n=pw?String(pw.value||'').length:0, st=h.getAttribute('data-state');
 var p=Math.min(n,LOGIN_RING_FULL)/LOGIN_RING_FULL;
 if(st==='ok')p=1; else if(st==='error')p=Math.min(p,.6);
 h.style.setProperty('--p',String(p));
 h.setAttribute('data-pw',n?'1':'0');
 h.setAttribute('data-id',id&&String(id.value||'').trim()?'1':'0');}
function loginState(st){
 var h=loginHost(); if(!h)return;
 h.setAttribute('data-state',st); loginRing();}
/* Every press in the door waits while a request is out, so a second press
   never sends a second request under the first one's answer. */
function loginBusy(on){
 var h=loginHost(); if(!h)return;
 h.querySelectorAll('.lg-acts .btn').forEach(function(b){ b.disabled=!!on; });
 if(on)loginState('busy'); else if(h.getAttribute('data-state')==='busy')loginState('idle');}
/* UNLOCK ALL SIGHT, A TESTING SWITCH, round OT, his words: "unlock all these
   for me." It reads the top tier for the lock (ui/lock.js lockPlan) and is kept
   in the browser's own store, so it holds across a reload and never travels on
   the profile or to a server. It is a product boundary, as the lock is, and
   not an entitlement: nothing about billing changes. */
var DEV_SIGHT=null;
function devSight(){
 if(DEV_SIGHT===null){ try{ DEV_SIGHT=STORE.get('devsight')==='on'; }catch(e){ DEV_SIGHT=false; } }
 return DEV_SIGHT;}
function devSightSet(on){
 DEV_SIGHT=!!on;
 try{ STORE.set('devsight',on?'on':'off'); }catch(e){}
 if(typeof render==='function')render();}
/* WHAT THE DOOR TELLS ui/auth.js, in one place so the three requests it makes
   cannot disagree: the identifier may be a username, and the secret is called
   a passphrase here and a password in the Account section, one word per
   screen. extra is the recovery email on a new account. */
function loginAuthOpt(extra){
 var o={names:true, noun:'passphrase'};
 if(extra)for(var k in extra)o[k]=extra[k];
 return o;}
/* THE HINT UNDER THE IDENTIFIER, AND WHETHER THE RECOVERY EMAIL SHOWS. Both
   depend on what is typed, so both are read again on every keystroke and on
   every change of mode.

   The hint is only there on a new account, and it says the true thing: while
   the server cannot hold a username (AUTH_USERNAMES), the line says what a
   username needs before a person has typed one, rather than letting them
   choose a name and be refused for it after. And the recovery email is the way back in for a
   username and for nothing else. Beside an email address it would be the same
   address asked for twice, so it is gone the moment an at sign is typed. */
function loginIdHint(){
 var h=loginEl('loginidhint'), id=loginEl('loginid'), row=loginEl('loginrecrow');
 var create=LOGIN.mode==='create', kind=identKind(id?id.value:'');
 if(h){
  var t=(create&&kind!=='email')
   ?(AUTH_USERNAMES?usernameRule()+' An email works too.'
    :'For now a username needs a recovery email.'):'';
  h.textContent=t; h.hidden=!t; }
 if(row)row.hidden=!(create&&kind!=='email');}
/* a keystroke in any field. A refusal was about what was there a moment ago,
   so it goes the moment the person starts correcting it, and the crossed ring
   with it. */
function loginTyped(){
 var h=loginHost();
 if(h&&h.getAttribute('data-state')==='error'){ loginSay('','',true); h.setAttribute('data-state','idle'); }
 loginIdHint(); loginRing();}
/* LOG IN OR CREATE, ON ONE CARD. The mode is a data attribute on the host and
   the stylesheet shows and hides what belongs to each, so there is one set of
   fields and nothing to rebuild or lose. The primary button follows the mode,
   because the one filled button is the one thing the screen is asking for.
   The secret's autocomplete follows it too: current-password on a card that
   checks one, so a password manager fills the saved one, and new-password on a
   card that is making one, so it offers a fresh one instead. */
function loginMode(m){
 var h=loginHost(); if(!h)return;
 LOGIN.mode=m; h.setAttribute('data-mode',m);
 var go=loginEl('loginb-go'), nw=loginEl('loginb-new'), pw=loginEl('loginpass'), pwh=loginEl('loginpwhint');
 if(go)go.classList.toggle('pri',m==='login');
 if(nw)nw.classList.toggle('pri',m==='create');
 if(pw)pw.setAttribute('autocomplete',m==='create'?'new-password':'current-password');
 if(pwh){
  pwh.textContent=m==='create'?'At least '+AUTH_PW_MIN+' characters. A few words work well.':'';
  pwh.hidden=m!=='create'; }
 loginIdHint(); loginSay('','',true); loginState('idle');}
/* the reset view and back. The identifier is carried across both ways, so
   going to the forgotten passphrase and back does not make anybody type it a
   second time. */
function loginReset(on){
 var h=loginHost(); if(!h)return;
 var id=loginEl('loginid'), rid=loginEl('loginrid');
 LOGIN.reset=!!on; h.setAttribute('data-view',on?'reset':'in');
 if(on){ if(id&&rid)rid.value=id.value.trim(); loginSay('','',true); if(rid)rid.focus(); }
 else{ if(id&&rid&&rid.value.trim())id.value=rid.value.trim(); loginIdHint(); loginRing(); if(id)id.focus(); }}
/* ENTER SENDS, which a form with two text fields and no submit button does not
   do on its own, so it is said here. What it sends is whatever the primary
   button is. */
function loginKey(e){
 if(e.key!=='Enter'||e.isComposing)return;
 var t=e.target; if(!t||t.tagName!=='INPUT'||t.type==='checkbox')return;
 e.preventDefault();
 if(LOGIN.reset)loginForgot(); else if(LOGIN.mode==='create')loginSubmit('signup'); else loginGo();}
function loginOpen(){
 var h=loginHost(); if(!h)return;
 LOGIN.open=true; LOGIN.reset=false; LOGIN.busy=false;
 h.classList.remove('lg-out'); h.style.display='flex';
 h.setAttribute('data-view','in');
 loginWire(h); loginMode('login');
 var f=loginEl('loginid'); if(f)f.focus();}
function loginWire(h){
 var go=loginEl('loginb-go');
 if(go)go.onclick=function(){
  /* Log in, pressed on a card showing the terms of a new account, goes back
     to the plain card and sends nothing */
  if(LOGIN.mode==='create'){ loginMode('login'); var f=loginEl('loginid'); if(f)f.focus(); }
  else loginGo(); };
 var nw=loginEl('loginb-new');
 if(nw)nw.onclick=function(){
  if(LOGIN.mode==='login'){
   loginMode('create');
   loginSay('Agree to the terms, then press Create account again.','',true); }
  else loginSubmit('signup'); };
 var sk=loginEl('loginb-skip');
 if(sk)sk.onclick=function(){ loginClose(); loginEnter(); };
 ['loginform','loginresetf'].forEach(function(id){
  var f=loginEl(id); if(f)f.onsubmit=function(e){ e.preventDefault(); }; });
 h.onkeydown=loginKey;
 ['loginid','loginpass','loginrec'].forEach(function(id){
  var f=loginEl(id); if(f)f.oninput=loginTyped; });
 var show=loginEl('loginshow');
 if(show)show.onclick=function(){
  var p=loginEl('loginpass'); if(!p)return;
  var on=p.type==='password'; p.type=on?'text':'password'; show.textContent=on?'Hide':'Show'; };
 var sug=loginEl('loginsug');
 if(sug)sug.onclick=function(){
  var p=loginEl('loginpass'), hint=loginEl('loginpwhint');
  if(!p)return; var pw=loginSuggestPassword();
  p.value=pw; p.type='text';
  var s2=loginEl('loginshow'); if(s2)s2.textContent='Hide';
  if(hint){ hint.hidden=false; hint.textContent='Suggested: '+pw; }
  loginRing(); };
 var forgot=loginEl('loginforgot');
 if(forgot)forgot.onclick=function(){ loginReset(true); };
 var back=loginEl('loginb-back');
 if(back)back.onclick=function(){ loginReset(false); };
 var send=loginEl('loginb-send');
 if(send)send.onclick=function(){ loginForgot(); };
 /* THE THREE TESTING SWITCHES are static markup too, so what they show is set
    here from what they hold, not from what the markup guessed */
 var devob=loginEl('devob');
 if(devob){ devob.checked=!!DEV_PLAY_ONBOARDING; devob.onchange=function(){ DEV_PLAY_ONBOARDING=!!devob.checked; }; }
 var devtut=loginEl('devtut');
 if(devtut){ devtut.checked=!!DEV_PLAY_TUTORIAL; devtut.onchange=function(){ DEV_PLAY_TUTORIAL=!!devtut.checked; }; }
 var devs=loginEl('devsight');
 if(devs){ devs.checked=!!devSight(); devs.onchange=function(){ devSightSet(!!devs.checked); }; }}
/* CLOSING THE DOOR, every way out of it. The class that held the app back is
   taken off first and always, so the app is never left hidden behind a door
   that has gone. soft is a yes: the ring has just closed, and the door fades
   for half a second instead of cutting, so the person sees the ring finish.
   Everything else cuts, because Guest and the developer skip are a person
   asking to be past it.

   And the passphrase does not stay behind in a hidden field. A secret typed
   into a door that is no longer showing has no reason to be in the document. */
function loginClose(soft){
 var h=loginHost(); if(!h)return;
 LOGIN.open=false; LOGIN.reset=false;
 loginDoor(false);
 ['loginpass','loginrec','loginrid'].forEach(function(id){ var f=loginEl(id); if(f)f.value=''; });
 var ag=loginEl('loginagree'); if(ag)ag.checked=false;
 if(soft){
  h.classList.add('lg-out');
  setTimeout(function(){
   /* a door that was opened again inside the fade is not hidden under its owner */
   if(LOGIN.open)return;
   h.style.display='none'; h.classList.remove('lg-out'); },LOGIN_FADE_MS);
  return; }
 h.style.display='none'; h.classList.remove('lg-out');}
/* THE REAL SIGN IN. This was the fake one, "anything counts, including
   nothing: there is no account to fail against yet," and there is one now.
   The card stays open until the server has answered, and closes only on a
   yes: a card that closed first and then reported a refusal would have
   claimed a sign in it did not have, which is the one thing CLAUDE.md says a
   control may never do. On a no, the card keeps what was typed, so the fix is
   one field and not two.

   A REFUSAL BEFORE ANYTHING IS SENT IS NOT A REFUSAL BY THE SERVER, and the
   ring says which it was. An empty field or a username with a capital letter
   in the wrong place is the card's own sentence and leaves the ring as it was.
   Only an answer that came back no, or never came, draws the crossed ring. */
function loginGo(){ loginSubmit('signin'); }
function loginSubmit(route){
 if(LOGIN.busy)return;
 var id=loginEl('loginid'), pw=loginEl('loginpass'), rec=loginEl('loginrec'), ag=loginEl('loginagree');
 var ident=id?id.value.trim():'', pass=pw?pw.value:'', isNew=route==='signup';
 var opt=loginAuthOpt(isNew?{recovery:rec?rec.value.trim():''}:null);
 var bad=authFieldsWhy(ident,pass,isNew,opt);
 /* the box is the person's own tick and nothing else ticks it. It is checked
    after the fields, so the first thing said is the first thing on the card. */
 if(!bad&&isNew&&!(ag&&ag.checked))bad='Tick the box to agree to the Terms and the Privacy policy.';
 if(bad){ loginSay(bad,'fail'); return; }
 LOGIN.busy=true; loginBusy(true);
 loginSay(isNew?'Creating the account.':'Checking with the server.','',true);
 authEnter(route,ident,pass,opt).then(function(r){
  LOGIN.busy=false; loginBusy(false);
  if(!r.ok){ loginState('error'); loginSay(r.say,'fail'); return; }
  loginState('ok'); loginSay('Opening your field.','',true);
  loginClose(true); status(r.say,r.kept?'ok':'fail'); loginEnter(); });}
/* The forgotten passphrase, with the one sentence authForgot returns for an
   address with an account and for one without. 'ok', not 'fail', on the
   status line: the request landed, which is all this press can know. */
function loginForgot(){
 if(LOGIN.busy)return;
 var m=loginEl('loginrid');
 LOGIN.busy=true; loginBusy(true);
 loginSay('Sending the request.','',true);
 authForgot(m?m.value.trim():'',loginAuthOpt()).then(function(r){
  LOGIN.busy=false; loginBusy(false);
  loginSay(r.say,r.ok?'ok':'fail'); });}
/* A HELD SESSION SKIPS THE DOOR, and the boot asks the server whether it is
   still good (authCheck, ui/auth.js) whatever DEV_SKIP says, because the
   check is about the account and not about the door. It makes no request
   when nothing is held, so the gates, which never sign in, make none. */
function loginBoot(){
 if(typeof authCheck==='function')authCheck();
 /* the two ways past the door that never open it still take the class off, or
    the app would be painted nowhere: the head set it before any of this ran */
 if(DEV_SKIP){ loginDoor(false); return; }
 if(typeof authSession==='function'&&authSession()){ loginDoor(false); loginEnter(); return; }
 loginOpen();}
/* WHAT HAPPENS BEHIND THE DOOR, whichever way through it a person came:
   a sign in, a new account, or continuing without one. */
function loginEnter(){
 /* ROUND NF: ui/tutorial.js wires tutorialOpen in for real, so this branch
    now runs. The switch defaults off, so a genuine first run still meets
    onboarding unless the developer option is turned on to test the other
    one; this is a testing fork, not yet the sequencing a real person
    gets by default. */
 if(DEV_PLAY_TUTORIAL&&typeof tutorialOpen==='function'){ tutorialOpen(); return; }
 if(!DEV_PLAY_ONBOARDING)return;
 if(typeof obOpen!=='function')return;
 /* onboarding is still met once, never on a return visit: the login
    above is the door met every time, this is the tutorial behind it. */
 var seen=false;
 /* the flag lives with the other ui facts: a field outside them was dropped
    at the profile boundary on the next load, so the first run replayed on
    every launch */
 try{ seen=!!(CURP&&CURP.ui&&CURP.ui.onboarded); }catch(e){}
 if(seen)return;
 obOpen(false);}
/* THE BUTTON ITSELF ONLY NEEDS TO EXIST. ui/panels.js's own skip listener
   sits on document with {capture:true} and stops every pointerdown from
   ever reaching a listener registered on the button, on purpose, so a
   press that skips the sheet can never also act on the tab strip under
   it; a pointerdown handler wired here would never fire. What sets the
   flag is that same listener in panels.js, reading e.target.id==='devskip'
   for both a pointer press and a keyboard one, since it is the one place
   already answering both. */
