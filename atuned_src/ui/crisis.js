/* ============================================================
   IS THIS A CRISIS. 16 October, his words: "Maybe [the crisis check] belongs
   in the pop-up, the welcome. Maybe it's an option. Is this a crisis? Hit
   that button. Tell me about it. Do you need immediate emergency contact, or
   would you like to talk it through? It's always a story."

   WHAT IT IS: a button the person chooses to press, and the one small panel
   it opens. It reads nothing anybody writes. The automatic check he deferred
   on 9 October is a different thing and is still J0 in ui/onboard.js; this
   does not close it and does not pretend to, and tests/onboarding2.js still
   asserts that no detector exists.

   WHERE THE BUTTON IS, every place, so a person never has to hunt for it:
     the login door      the first card a stranger meets, under its actions
                         (loginCard, ui/login.js)
     the first run       the stage's own top bar, on every one of its steps,
                         beside Not now (obStage, ui/onboard.js)
     after the first run the profile menu, one row (profMenu, ui/account.js)
     the funnel's quiz   its sticky top, with its own copy of this panel over
                         the same words (funnel/quiz.html)

   THE PANEL IS ITS OWN LAYER AND NOT #sheet. The sheet sits at z-index 70,
   under the login door and the first run's stage at 95, so a panel opened
   from either would open behind the card it was pressed on. And the sheet's
   Escape, the stage's Escape and the profile menu's Escape all listen on the
   way up: one key would have shut the panel and the whole first run with it.
   So this listens on the way down and stops the key there, and it is the
   only thing Escape closes while it is open.

   NEVER A LOCK. Close, Escape and the backdrop each shut it, and nothing
   behind it moves: the card it was opened from is exactly where it was and
   focus goes back to the button that opened it. Talk it through is the one
   choice that moves the person, and it moves them to the Story box.
   ============================================================ */
var CRISIS={open:false, view:'ask', back:null};
/* the button, for every surface that carries it. cls is the surface's own
   placement; the words are CRISIS_SAY's, so every door says the same thing. */
function crisisBtn(cls){
 return '<button type="button" class="crx-open'+(cls?' '+cls:'')+'" data-crisis="open" '
  +'aria-haspopup="dialog">'+esc(CRISIS_SAY.open)+'</button>';}
/* ONE SCREEN, TWO VIEWS. ask is his two lines and the two choices; reach is
   the three numbers, each with its sentence, and the line that says they are
   US numbers. Talk it through and Close are on both, so whichever a person
   is looking at, the way on and the way out are on it. */
function crisisCard(){
 var reach=CRISIS.view==='reach';
 return '<div class="crx-card" role="dialog" aria-modal="true" aria-labelledby="crxh">'
  +'<h2 class="crx-h" id="crxh" tabindex="-1">'+esc(reach?CRISIS_SAY.reach:CRISIS_SAY.h)+'</h2>'
  +(reach
   ?'<ul class="crx-ls">'+CRISIS_LINES.map(function(l){
     return '<li data-crisisline="'+esc(l.k)+'"><p class="crx-p">'+esc(l.say)+'</p>'
      +'<div class="crx-go">'+l.go.map(function(g){
        return '<a class="btn crx-tel" href="'+esc(g[1])+'">'+esc(g[0])+'</a>';}).join('')
      +'</div></li>';}).join('')+'</ul>'
    +'<p class="crx-p crx-dim">'+esc(CRISIS_SAY.where)+'</p>'
   :'<p class="crx-p">'+esc(CRISIS_SAY.q)+'</p>')
  +'<div class="crx-acts">'
  +(reach?'':'<button type="button" class="btn pri" data-crisis="reach">'+esc(CRISIS_SAY.reach)+'</button>')
  +'<button type="button" class="btn" data-crisis="talk">'+esc(CRISIS_SAY.talk)+'</button>'
  +'<button type="button" class="btn" data-crisis="close">'+esc(CRISIS_SAY.close)+'</button>'
  +'</div></div>';}
/* the host is made on first use, so no shell markup carries an empty layer */
function crisisHost(){
 var h=document.getElementById('crisis');
 if(!h){ h=document.createElement('div'); h.id='crisis'; h.className='crx'; h.hidden=true;
  document.body.appendChild(h); }
 return h;}
function crisisPaint(){
 var h=crisisHost(); h.innerHTML=crisisCard();
 var f=h.querySelector('#crxh'); if(f)f.focus({preventScroll:true});}
function crisisOpen(){
 CRISIS.back=document.activeElement||null;
 CRISIS.open=true; CRISIS.view='ask';
 var h=crisisHost(); h.hidden=false; crisisPaint();}
/* keep says the person is going on somewhere and focus goes with them: the
   button that opened the panel is on a card that is about to leave */
function crisisShut(keep){
 var h=document.getElementById('crisis');
 CRISIS.open=false; CRISIS.view='ask';
 if(h){ h.hidden=true; h.innerHTML=''; }
 var b=CRISIS.back; CRISIS.back=null;
 if(!keep&&b&&b.focus&&document.contains(b))b.focus({preventScroll:true});}
/* TALK IT THROUGH, "it's always a story". The panel shuts, whatever card it
   was opened over steps aside, and the person lands in the Story tab with
   the box itself, not the reply line, open and focused and one line above it
   saying what to do. The door and the first run are left the way their own
   ways out leave them: the login door as Guest leaves it, the first run as
   Open Avatar leaves it (obClose, then the tab), so neither has a second
   path out that skips what its own close writes. */
function crisisTalk(){
 crisisShut(true);
 if(typeof LOGIN!=='undefined'&&LOGIN.open&&typeof loginClose==='function')loginClose();
 if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();
 if(typeof STV!=='undefined'){ STV.chat=false; STV.focus='write'; STV.crisis=true; }
 if(typeof setTab==='function')setTab(TAB.STORY);
 if(typeof render==='function')render();
 var ta=document.getElementById('sttext'); if(ta)ta.focus();}
addEventListener('click',function(e){
 var t=e.target&&e.target.closest?e.target:null; if(!t)return;
 var h=document.getElementById('crisis');
 /* the backdrop is a way out, the card is not */
 if(CRISIS.open&&h&&t===h){ crisisShut(); return; }
 var b=t.closest('[data-crisis]'); if(!b)return;
 var k=b.getAttribute('data-crisis');
 if(k==='open'){ e.preventDefault(); crisisOpen(); return; }
 if(!CRISIS.open)return;
 if(k==='reach'){ CRISIS.view='reach'; crisisPaint(); return; }
 if(k==='talk'){ crisisTalk(); return; }
 if(k==='close'){ crisisShut(); return; }});
/* ON THE WAY DOWN, see the header: the panel takes Escape before the stage,
   the sheet or the menu can, and keeps Tab inside itself, because a modal a
   keyboard can tab out of leaves a person typing into a card they cannot
   see. */
addEventListener('keydown',function(e){
 if(!CRISIS.open)return;
 if(e.key==='Escape'){ e.preventDefault(); e.stopPropagation(); crisisShut(); return; }
 if(e.key!=='Tab')return;
 var h=document.getElementById('crisis'); if(!h)return;
 var f=[].slice.call(h.querySelectorAll('a[href],button'));
 if(!f.length)return;
 var i=f.indexOf(document.activeElement);
 if(e.shiftKey&&(i<=0)){ e.preventDefault(); f[f.length-1].focus(); }
 else if(!e.shiftKey&&(i<0||i===f.length-1)){ e.preventDefault(); f[0].focus(); }},true);
