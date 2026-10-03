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
var LOGIN={open:false,reset:false,busy:false};
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
/* The email a person typed is carried between the two cards, so going to the
   forgotten password and back does not make them type it a second time. */
function loginCard(mail){
 return '<div class="ob-card login-card" role="dialog" aria-modal="true" aria-label="Log in">'
  +'<div class="ob-wash" aria-hidden="true"></div>'
  +'<div class="ob-scroll">'
  +'<span class="pm-eye">Welcome</span>'
  +'<h2 class="ob-h">Log in</h2>'
  +'<form id="loginform" novalidate>'
  +'<div class="login-row"><label class="login-l" for="loginmail">Email</label>'
  +'<input type="email" id="loginmail" autocomplete="email" spellcheck="false" value="'+esc(mail||'')+'"></div>'
  /* current-password, because the person pressing Log in has one: new-password
     told a password manager to offer a fresh one instead of filling the saved
     one, which was right for a card nothing checked and wrong for one that does.
     Suggest still fills the field for somebody about to press Create account. */
  +'<div class="login-row"><label class="login-l" for="loginpass">Password</label>'
  +'<div class="login-pw"><input type="password" id="loginpass" autocomplete="current-password">'
  +'<button type="button" class="login-pwsug" id="loginsug">Suggest</button></div>'
  +'<span class="login-hint" id="loginpwhint" hidden></span></div>'
  +'<button type="button" class="login-forgot" id="loginforgot">Forgot your password?</button>'
  +'</form>'
  +'<p class="login-msg" id="loginmsg"></p>'
  +'<div class="ob-acts"><button type="button" class="btn pri" id="loginb-go">Log in</button>'
  +'<button type="button" class="btn" id="loginb-new">Create account</button>'
  +'<button type="button" class="btn" id="loginb-skip">Guest</button></div>'
  +loginDevOptions()
  +'</div></div>';}
function loginResetCard(mail){
 return '<div class="ob-card login-card" role="dialog" aria-modal="true" aria-label="Reset your password">'
  +'<div class="ob-wash" aria-hidden="true"></div>'
  +'<div class="ob-scroll">'
  +'<span class="pm-eye">Password reset</span>'
  +'<h2 class="ob-h">Reset your password</h2>'
  +'<p class="ob-p">Enter the email the account uses. A link to set a new password goes there.</p>'
  +'<form id="loginresetf" novalidate>'
  +'<div class="login-row"><label class="login-l" for="loginrmail">Email</label>'
  +'<input type="email" id="loginrmail" autocomplete="email" spellcheck="false" value="'+esc(mail||'')+'"></div>'
  +'</form>'
  +'<p class="login-msg" id="loginmsg"></p>'
  +'<div class="ob-acts"><button type="button" class="btn pri" id="loginb-send">Send the link</button>'
  +'<button type="button" class="btn" id="loginb-back">Back to log in</button></div>'
  +'</div></div>';}
/* THE CARD SAYS IT, AND SO DOES STATUS. status() is the one writer every
   result goes through, and it is the live region a screen reader hears; but
   the status line sits in the top bar, under this card, which covers the
   whole screen. A refusal written only there is a refusal nobody sighted can
   see. So the card carries the same sentence on its own line, and the status
   line is told too, which is also what is still on screen when the card
   closes. A line that is only progress is the card's alone: nothing was
   written, so there is nothing for the status line to report. */
function loginSay(msg,kind,own){
 var m=document.getElementById('loginmsg');
 if(m){ m.textContent=msg||''; if(kind)m.setAttribute('data-kind',kind); else m.removeAttribute('data-kind'); }
 if(!own&&typeof status==='function')status(msg,kind);}
/* Every press in the card waits while a request is out, so a second press
   never sends a second request under the first one's answer. */
function loginBusy(on){
 var h=document.getElementById('login'); if(!h)return;
 h.querySelectorAll('.ob-acts .btn').forEach(function(b){ b.disabled=!!on; });}
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
/* DEVELOPER OPTIONS, GATED BEHIND A FLAG NO SHIPPED CONTROL CAN SET, ROUND
   RA. The comment here used to say "disclosed rather than always visible,"
   and the disclosure was real: the block was a collapsed <details>, closed
   by default. But collapsed is not gated. Every visitor to the login card
   got the same markup, open to a click, and one of its three switches is
   "Unlock all sight," which lockPlan() (ui/lock.js) turns into a real tier
   four grant, stored in the browser so it survives a reload. A stranger
   meeting the funnel never needed to see this to use the product, and the
   label "Developer options" is itself an invitation to try the switch
   under it. Reviewed round RA, paywall seat: "the one thing that matters
   most... taking money behind a lock the product unlocks itself."

   The fix keeps the control, because the team still needs it, and removes
   it from anyone who has not already turned it on from a console: devtoolsOn()
   reads a second flag, never written by any rendered control, so turning
   the panel on at all takes the same console access self-editing a record
   already does (the privacy note above this function already treats that
   as the person's own device, not an attack). */
function devtoolsOn(){
 try{ return STORE.get('devtools')==='on'; }catch(e){ return false; }}
function loginDevOptions(){
 if(!devtoolsOn())return '';
 return '<details class="login-dev">'
  +'<summary>Developer options</summary>'
  +'<label class="login-sw"><input type="checkbox" id="devob"'
  +(DEV_PLAY_ONBOARDING?' checked':'')+'> Onboarding</label>'
  +'<label class="login-sw"><input type="checkbox" id="devtut"'
  +(DEV_PLAY_TUTORIAL?' checked':'')+'> Tutorial</label>'
  +'<label class="login-sw"><input type="checkbox" id="devsight"'
  +(devSight()?' checked':'')+'> Unlock all sight</label>'
  +'</details>';}
function loginOpen(){
 var h=document.getElementById('login'); if(!h)return;
 LOGIN.open=true; LOGIN.reset=false; h.style.display='flex'; h.innerHTML=loginCard();
 loginWire(h);}
function loginWire(h){
 var f=h.querySelector('input'); if(f)f.focus();
 var go=document.getElementById('loginb-go'); if(go)go.onclick=loginGo;
 var nw=document.getElementById('loginb-new'); if(nw)nw.onclick=function(){ loginSubmit('signup'); };
 var sk=document.getElementById('loginb-skip');
 if(sk)sk.onclick=function(){ loginClose(); loginEnter(); };
 var form=document.getElementById('loginform');
 if(form)form.onsubmit=function(e){e.preventDefault(); loginGo();};
 var sug=document.getElementById('loginsug');
 if(sug)sug.onclick=function(){
  var p=document.getElementById('loginpass'), hint=document.getElementById('loginpwhint');
  if(!p)return; var pw=loginSuggestPassword();
  p.value=pw; p.type='text';
  if(hint){ hint.hidden=false; hint.textContent='Suggested: '+pw; } };
 var forgot=document.getElementById('loginforgot');
 if(forgot)forgot.onclick=function(){
  var m=document.getElementById('loginmail');
  LOGIN.reset=true; h.innerHTML=loginResetCard(m?m.value.trim():'');
  var rm=document.getElementById('loginrmail');
  var back=document.getElementById('loginb-back');
  if(back)back.onclick=function(){ LOGIN.reset=false;
   h.innerHTML=loginCard(rm?rm.value.trim():''); loginWire(h); };
  var send=document.getElementById('loginb-send');
  if(send)send.onclick=function(){ loginForgot(); };
  var rf=document.getElementById('loginresetf');
  if(rf)rf.onsubmit=function(e){ e.preventDefault(); loginForgot(); };
  if(rm)rm.focus(); };
 var devob=document.getElementById('devob');
 if(devob)devob.onchange=function(){ DEV_PLAY_ONBOARDING=!!devob.checked; };
 var devtut=document.getElementById('devtut');
 if(devtut)devtut.onchange=function(){ DEV_PLAY_TUTORIAL=!!devtut.checked; };
 var devs=document.getElementById('devsight');
 if(devs)devs.onchange=function(){ devSightSet(!!devs.checked); };}
function loginClose(){
 var h=document.getElementById('login'); if(!h)return;
 LOGIN.open=false; h.style.display='none'; h.innerHTML='';}
/* THE REAL SIGN IN. This was the fake one, "anything counts, including
   nothing: there is no account to fail against yet," and there is one now.
   The card stays open until the server has answered, and closes only on a
   yes: a card that closed first and then reported a refusal would have
   claimed a sign in it did not have, which is the one thing CLAUDE.md says a
   control may never do. On a no, the card keeps what was typed, so the fix is
   one field and not two. */
function loginGo(){ loginSubmit('signin'); }
function loginSubmit(route){
 if(LOGIN.busy)return;
 var m=document.getElementById('loginmail'), p=document.getElementById('loginpass');
 LOGIN.busy=true; loginBusy(true);
 loginSay(route==='signup'?'Creating the account.':'Checking with the server.','',true);
 authEnter(route,m?m.value.trim():'',p?p.value:'').then(function(r){
  LOGIN.busy=false; loginBusy(false);
  if(!r.ok){ loginSay(r.say,'fail'); return; }
  loginClose(); status(r.say,r.kept?'ok':'fail'); loginEnter(); });}
/* The forgotten password, with the one sentence authForgot returns for an
   address with an account and for one without. 'ok', not 'fail', on the
   status line: the request landed, which is all this press can know. */
function loginForgot(){
 if(LOGIN.busy)return;
 var m=document.getElementById('loginrmail');
 LOGIN.busy=true; loginBusy(true);
 loginSay('Sending the request.','',true);
 authForgot(m?m.value.trim():'').then(function(r){
  LOGIN.busy=false; loginBusy(false);
  loginSay(r.say,r.ok?'ok':'fail'); });}
/* A HELD SESSION SKIPS THE DOOR, and the boot asks the server whether it is
   still good (authCheck, ui/auth.js) whatever DEV_SKIP says, because the
   check is about the account and not about the door. It makes no request
   when nothing is held, so the gates, which never sign in, make none. */
function loginBoot(){
 if(typeof authCheck==='function')authCheck();
 if(DEV_SKIP)return;
 if(typeof authSession==='function'&&authSession()){ loginEnter(); return; }
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
