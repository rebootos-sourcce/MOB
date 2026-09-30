/* ============================================================
   LOGIN. Round MH and MI. His words: "I need to be able to create a
   login. So the login would be on the main tuned animation screen.
   And when I hit enter, it completes the zoom animation. And then
   takes me to onboarding." Corrected the same round: "the landing
   page needs to be the funnel, where they create their account,"
   which makes this screen the return door and not the front door;
   the funnel is. And then, keeping it simple while the real flow is
   designed: "let's keep it locally."

   ROUND MP REDESIGNED THE FIELDS AND KEPT THE HONESTY. Username,
   email, password, a suggested strong password and a forgot
   password link are all real controls now, "the login needs the
   typical login stuff." Two factor and OAuth are named in the same
   round and are not here: each needs a real provider and a decision
   only he can make about which ones, so they are queued rather than
   guessed at, not built silently under cover of "typical login
   stuff." Checked directly against the real server this round,
   `reboot-os`'s own `atuned-api` Worker: its wrangler.toml still
   carries a placeholder database id and its own deploy has never
   once succeeded, so there is no live, reachable server to sign
   into yet. This stays local for that reason as much as for his
   own "let's keep it locally," and pressing Log in is still what a
   signed in state will look like once a real one exists, the same
   honesty account.js already carries for its own sign in shell.

   THE ONE SENTENCE THAT SAID SO OUT LOUD IS GONE, his own ruling:
   "get rid of the text that says this is a local build, nothing
   typed here is sent anywhere or checked against anything." The
   honesty moves into the forgot password panel instead, the one
   place here that would otherwise look broken rather than unbuilt,
   and into this comment, where a person reading the code still
   finds it.

   THE SEQUENCE IS THE DEFAULT NOW, reversing OB_AUTO's own September
   ruling, "let's turn off onboarding for now," for this one path
   only: onboard.js's own automatic-open check stays exactly as
   written, in case anything else ever reaches it, but the boot's own
   step below no longer reads it. What reads it now is DEV_SKIP, and
   the default is to show the door, his own words this round: "if
   it's not pressed, then it goes to the sequence." */
var LOGIN={open:false,reset:false};
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
   bypasses both of these along with the door. The tutorial has no
   flow behind it yet, "the tutorial's not even wired in," so its own
   switch is disabled rather than pretending to work: a control that
   takes a press and does nothing is the exact dead button account.js
   was already written against. */
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
function loginCard(){
 return '<div class="ob-card login-card" role="dialog" aria-modal="true" aria-label="Log in">'
  +'<div class="ob-wash" aria-hidden="true"></div>'
  +'<div class="ob-scroll">'
  +'<span class="pm-eye">Welcome</span>'
  +'<h2 class="ob-h">Log in</h2>'
  +'<form id="loginform" novalidate>'
  +'<div class="login-row"><label class="login-l" for="loginuser">Username</label>'
  +'<input type="text" id="loginuser" autocomplete="username" spellcheck="false"></div>'
  +'<div class="login-row"><label class="login-l" for="loginmail">Email</label>'
  +'<input type="email" id="loginmail" autocomplete="email" spellcheck="false"></div>'
  +'<div class="login-row"><label class="login-l" for="loginpass">Password</label>'
  +'<div class="login-pw"><input type="password" id="loginpass" autocomplete="new-password">'
  +'<button type="button" class="login-pwsug" id="loginsug">Suggest</button></div>'
  +'<span class="login-hint" id="loginpwhint" hidden></span></div>'
  +'<button type="button" class="login-forgot" id="loginforgot">Forgot your password?</button>'
  +'</form>'
  +'<div class="ob-acts"><button type="button" class="btn pri" id="loginb-go">Log in</button></div>'
  +loginDevOptions()
  +'</div></div>';}
function loginResetCard(){
 return '<div class="ob-card login-card" role="dialog" aria-modal="true" aria-label="Reset your password">'
  +'<div class="ob-wash" aria-hidden="true"></div>'
  +'<div class="ob-scroll">'
  +'<span class="pm-eye">Password reset</span>'
  +'<h2 class="ob-h">Reset your password</h2>'
  +'<p class="ob-p">This is a local build. There is no account behind it yet, '
  +'so there is nothing to send a reset link to. This will work once a real '
  +'sign in does.</p>'
  +'<div class="ob-acts"><button type="button" class="btn" id="loginb-back">Back to log in</button></div>'
  +'</div></div>';}
/* DEVELOPER OPTIONS, DISCLOSED RATHER THAN ALWAYS VISIBLE: this is a
   testing control, not a thing a stranger meeting the funnel needs to
   see open by default. */
function loginDevOptions(){
 return '<details class="login-dev">'
  +'<summary>Developer options</summary>'
  +'<label class="login-sw"><input type="checkbox" id="devob"'
  +(DEV_PLAY_ONBOARDING?' checked':'')+'> Onboarding</label>'
  +'<label class="login-sw login-sw-off"><input type="checkbox" id="devtut" disabled>'
  +' Tutorial <span class="login-dim">not built yet</span></label>'
  +'</details>';}
function loginOpen(){
 var h=document.getElementById('login'); if(!h)return;
 LOGIN.open=true; LOGIN.reset=false; h.style.display='flex'; h.innerHTML=loginCard();
 loginWire(h);}
function loginWire(h){
 var f=h.querySelector('input'); if(f)f.focus();
 var go=document.getElementById('loginb-go'); if(go)go.onclick=loginGo;
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
  LOGIN.reset=true; h.innerHTML=loginResetCard();
  var back=document.getElementById('loginb-back');
  if(back)back.onclick=function(){ LOGIN.reset=false; h.innerHTML=loginCard(); loginWire(h); };
  var f2=h.querySelector('button'); if(f2)f2.focus(); };
 var devob=document.getElementById('devob');
 if(devob)devob.onchange=function(){ DEV_PLAY_ONBOARDING=!!devob.checked; };}
function loginClose(){
 var h=document.getElementById('login'); if(!h)return;
 LOGIN.open=false; h.style.display='none'; h.innerHTML='';}
/* THE FAKE SIGN IN. Anything counts, including nothing: there is no
   account to fail against yet, and a control that refused an empty
   field here would be enforcing a rule this build does not keep. */
function loginGo(){
 loginClose();
 /* the tutorial has no flow behind it yet; its own switch is disabled in
    the UI, so this branch only ever runs once something real wires
    tutorialOpen in. */
 if(DEV_PLAY_TUTORIAL&&typeof tutorialOpen==='function'){ tutorialOpen(); return; }
 if(!DEV_PLAY_ONBOARDING)return;
 if(typeof obOpen!=='function')return;
 /* onboarding is still met once, never on a return visit: the login
    above is the door met every time, this is the tutorial behind it. */
 var seen=false;
 try{ seen=!!(CURP&&CURP.onboarded); }catch(e){}
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
