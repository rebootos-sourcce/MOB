/* ============================================================
   THE RITUAL REMINDER, accounts-push, 19 November. A pop-up inside the app,
   never a phone push: that was his ruling before this was built, and a push
   reaching a closed app would need a service worker and a server that knows
   the device, which is a second file and a second network seam.

   WHAT IT READS. remindDue (engine/ladder.js) off CURP, the record on this
   device, through the same day list the streak counts, so the reminder and
   the streak cannot disagree about what a missed day is. What triggers it,
   a missed day and not a set time, is a default and not a ruling, and that
   function says why. Nothing new goes on the record: the day it last spoke
   is source.remind in the browser's own store, the pattern tabLandFirst
   uses for source.landed (ui/panels.js), because having been reminded today
   is about this screen and not about the person. A store that is blocked
   cannot remember, so it stays quiet rather than speak on every check,
   which is srcIntroDue's answer to the same case.

   WHEN IT LOOKS. At the end of the boot, when the page comes back into view,
   and once a minute while it is open, so an app left open past midnight
   into a missed day still says so. Each look is one function of a profile
   and a day key, so a minute's tick costs nothing. It never stacks on the
   door or on any other sheet: while a modal is open, or the login is, the
   look is skipped and the next one tries again. Never under DEV_SKIP, the
   flag every browser gate enters through, which is the srcIntro precedent:
   a gate fixture with old rituals would otherwise meet a card it did not
   ask for at a corner it measures.

   NOT MODAL, AND FOCUS IS NOT TAKEN. It is a reminder and not a question, so
   the page under it stays usable, and a person typing a story is not pulled
   out of the sentence by a card arriving. Escape closes it while focus is in
   it. Open Ritual goes to the ritual tab through setTab, the one route every
   caller takes. Both buttons record today, so a dismissal holds for the day.
   ============================================================ */
var REMIND_KEY='source.remind';
var REMIND_TICK=60000;
var REMIND_T=null;
function remindShown(){
 try{
  if(typeof STORE_BOUND==='undefined'||!STORE_BOUND)return undefined;
  var v=STORE.get(REMIND_KEY); return v==null?null:+v;
 }catch(e){ return undefined; }}
function remindQuiet(){
 if(typeof DEV_SKIP!=='undefined'&&DEV_SKIP)return true;
 if(typeof LOGIN!=='undefined'&&LOGIN&&LOGIN.open)return true;
 /* a roster person or a worked example is not this person's own record,
    the same test profileSyncEligible reads (ui/auth.js) */
 if(typeof S!=='undefined'&&S.who&&S.who!==0)return true;
 if(document.querySelector('[aria-modal="true"]'))return true;
 return false;}
/* the day a ritual was last marked done, as the Ritual page names a day
   (ritDayName, ui/ritual.js), so the two read the same */
function remindDayWord(d,today){
 if(typeof ritDayName==='function')return ritDayName(d,today);
 var off=new Date().getTimezoneOffset()*60000;
 return new Date(d*DAY_MS+off+12*3600000).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});}
var REMIND_MEANS='Shown once a day, after a full day with no ritual marked done. '
 +'Read from this device only. Nothing is sent.';
function remindHtml(due){
 return '<div class="rmd-sym" tabindex="0" data-tip="'+esc(REMIND_MEANS)+'" aria-label="'+esc(REMIND_MEANS)+'">'
  +'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" '
  +'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
  +'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg></div>'
  +'<div class="rmd-txt"><h2 class="rmd-h" id="rmdh">Ritual reminder</h2>'
  +'<p class="rmd-b">Last marked done: '+esc(remindDayWord(due.last,due.today))+'.</p></div>'
  +'<div class="rmd-go"><button type="button" class="btn pri" data-rmd="go">Open Ritual</button>'
  +'<button type="button" class="btn" data-rmd="no">Not today</button></div>';}
function remindKeep(today){
 try{ STORE.set(REMIND_KEY,String(today)); return true; }catch(e){ return false; }}
function remindClose(){
 var h=document.getElementById('remind'); if(h&&h.parentNode)h.parentNode.removeChild(h);}
function remindCheck(now){
 if(document.getElementById('remind')||remindQuiet())return null;
 if(typeof CURP==='undefined'||!CURP||typeof remindDue!=='function')return null;
 var shown=remindShown(); if(shown===undefined)return null;
 var due=remindDue(CURP,now||Date.now(),shown); if(!due)return null;
 /* recorded as it shows, so a reload does not show it twice in a day; a
    store that refuses the write is a store that cannot remember, and it
    stays quiet for the reason given above */
 if(!remindKeep(due.today))return null;
 var h=document.createElement('div');
 h.id='remind'; h.className='rmd';
 h.setAttribute('role','dialog'); h.setAttribute('aria-modal','false');
 h.setAttribute('aria-labelledby','rmdh');
 h.innerHTML=remindHtml(due);
 h.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('[data-rmd]'); if(!b)return;
  remindClose();
  if(b.getAttribute('data-rmd')==='go'&&typeof setTab==='function')setTab(TAB.RITUAL);});
 h.addEventListener('keydown',function(e){ if(e.key==='Escape'){ e.stopPropagation(); remindClose(); } });
 document.body.appendChild(h);
 return due;}
function remindBoot(){
 if(REMIND_T)return;
 var look=function(){ try{ remindCheck(); }catch(e){} };
 REMIND_T=setInterval(look,REMIND_TICK);
 document.addEventListener('visibilitychange',function(){ if(document.visibilityState==='visible')look(); });
 /* after the boot sheet has lifted, the way the login step waits on it */
 setTimeout(look,6000);}
