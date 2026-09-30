/* ============================================================
   LOGIN. Round MH and MI. His words: "I need to be able to create a
   login. So the login would be on the main tuned animation screen.
   And when I hit enter, it completes the zoom animation. And then
   takes me to onboarding." Corrected the same round: "the landing
   page needs to be the funnel, where they create their account,"
   which makes this screen the return door and not the front door;
   the funnel is. And then, keeping it simple while the real flow is
   designed: "let's keep it locally."

   So this is local and it is honest about being local: the fields are
   real, nothing typed is sent anywhere or checked against anything,
   and pressing the one button is what a signed in state would look
   like once there is a real one. account.js already carries this same
   honesty for its own sign in shell, "nothing typed here is sent or
   kept," and this is the same rule at the door instead of in Settings.

   THE SEQUENCE IS THE DEFAULT NOW, reversing OB_AUTO's own September
   ruling, "let's turn off onboarding for now," for this one path
   only: onboard.js's own automatic-open check stays exactly as
   written, in case anything else ever reaches it, but the boot's own
   step below no longer reads it. What reads it now is DEV_SKIP, and
   the default is to show the door, his own words this round: "if
   it's not pressed, then it goes to the sequence." */
var LOGIN={open:false};
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
   asking the URL. */
var DEV_SKIP=false;
(function(){
 try{ DEV_SKIP=/(?:^|[?&])dev=1(?:&|$)/.test(location.search||''); }catch(e){}
})();
function loginCard(){
 return '<div class="ob-card" role="dialog" aria-modal="true" aria-label="Log in">'
  +'<span class="pm-eye">Welcome back</span>'
  +'<h2 class="ob-h">Log in</h2>'
  +'<p class="ob-p">This is a local build. Nothing typed here is sent anywhere '
  +'or checked against anything.</p>'
  +'<form id="loginform" novalidate>'
  +'<div class="login-row"><label class="login-l" for="loginmail">Email</label>'
  +'<input type="email" id="loginmail" autocomplete="email" spellcheck="false"></div>'
  +'<div class="login-row"><label class="login-l" for="loginpass">Password</label>'
  +'<input type="password" id="loginpass" autocomplete="current-password"></div>'
  +'</form>'
  +'<div class="ob-acts"><button type="button" class="btn pri" id="loginb-go">Log in</button></div>'
  +'</div>';}
function loginOpen(){
 var h=document.getElementById('login'); if(!h)return;
 LOGIN.open=true; h.style.display='flex'; h.innerHTML=loginCard();
 var f=h.querySelector('input'); if(f)f.focus();
 var go=document.getElementById('loginb-go'); if(go)go.onclick=loginGo;
 var form=document.getElementById('loginform');
 if(form)form.onsubmit=function(e){e.preventDefault(); loginGo();};}
function loginClose(){
 var h=document.getElementById('login'); if(!h)return;
 LOGIN.open=false; h.style.display='none'; h.innerHTML='';}
/* THE FAKE SIGN IN. Anything counts, including nothing: there is no
   account to fail against yet, and a control that refused an empty
   field here would be enforcing a rule this build does not keep. */
function loginGo(){
 loginClose();
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
