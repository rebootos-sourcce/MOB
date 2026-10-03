/* ============================================================
   VALUE FELT AFTER SESSION ONE, THE HOST HALF. engine/valuefelt.js says
   what is asked, when, and how it is kept. This file only asks.

   WHY IT IS ASKED ON THE NEXT OPEN AND NOT ON THE RELEASE CARD. The document
   wants it "immediately after the first meaningful experience" (section 72).
   The release card is ui/release.js, and that file is being rebuilt on its
   own branch while this lands (round QM, the release carousel). Hooking the
   card from here would put two builds in one function. So this reads only the
   person's own record, never the release code: when the app next opens and
   the record says a release has run and nothing has been answered, inside
   the window engine/valuefelt.js sets, the sheet asks. When the release card
   settles, the question can move onto it, through valueFeltRecord, which
   stays the one writer either way.

   IT WAITS ITS TURN. The login door, onboarding and the tutorial are dialogs
   of their own. The sheet is the shared one, so this opens only when the
   boot sheet has lifted (afterBoot), no dialog is standing, and the shared
   sheet is free, and it waits for that to hold for a moment, so a door that
   closes and another that opens straight after do not let it in between.
   Once per open of the app, at most.

   Skip writes nothing and says so in the release card's own words. Keep
   writes through the boundary and says so only once the save has said yes.
   ============================================================ */
var VF_ANS={value:null, again:null}, VF_SHOWN=false;
var VF_MONTHS=['January','February','March','April','May','June','July','August',
 'September','October','November','December'];
function vfDay(iso){var d=new Date(iso); if(isNaN(d.getTime()))return '';
 return d.getDate()+' '+VF_MONTHS[d.getMonth()];}
function vfRow(k,list,q){
 return '<div class="ob-q"><div class="ob-qt" id="vfq-'+k+'">'+esc(q)+'</div>'
  +'<div class="ob-as" role="group" aria-labelledby="vfq-'+k+'">'+list.map(function(a){
   var on=VF_ANS[k]===a;
   return '<button type="button" class="ob-a'+(on?' on':'')+'" aria-pressed="'+on+'" '
    +'data-vfk="'+k+'" data-vfv="'+a+'">'+esc(VF_SAY[a])+'</button>';}).join('')
  +'</div></div>';}
function vfSheet(since){
 var day=vfDay(since);
 return '<div class="pm-eye">Your first release</div>'
  +'<p class="sh-h plain">'+(day?'You ran your first release on '+esc(day)+'.':'You ran your first release.')+'</p>'
  /* SAID BEFORE THEY ANSWER, not after */
  +'<p class="sh-p">Your answers stay on your record, in this browser. Nothing is sent.</p>'
  +'<div class="ob-qs">'+vfRow('value',VF_VALUE,VF_Q.value)+'</div>'
  +'<div class="ob-f"><label for="vfwhy">'+esc(VF_Q.reason)+'</label>'
  +'<textarea id="vfwhy" maxlength="'+VF_REASON_MAX+'" rows="3"></textarea></div>'
  +'<div class="ob-qs">'+vfRow('again',VF_AGAIN,VF_Q.again)+'</div>'
  +'<div class="sh-act"><button class="btn pri" id="vfkeep" type="button"'
  +(VF_ANS.value?'':' disabled aria-disabled="true"')+'>Keep</button>'
  +'<button class="btn" id="vfskip" type="button">Skip</button></div>';}
function vfWire(since){
 document.querySelectorAll('[data-vfk]').forEach(function(b){
  b.onclick=function(){
   var t=document.getElementById('vfwhy'), why=t?t.value:'';
   VF_ANS[b.getAttribute('data-vfk')]=b.getAttribute('data-vfv');
   sheetOpen(vfSheet(since)); vfWire(since);
   var t2=document.getElementById('vfwhy'); if(t2)t2.value=why;
   var again=document.querySelector('[data-vfk="'+b.getAttribute('data-vfk')+'"].on');
   if(again)again.focus();};});
 var k=document.getElementById('vfkeep'); if(k)k.onclick=function(){vfKeep();};
 var s=document.getElementById('vfskip'); if(s)s.onclick=function(){vfSkip();};}
/* the one writer from the host. Refuses by name, saves, and says so only
   when the save has answered. Returns whether it was kept. */
function vfKeep(){
 if(!CURP||!VF_ANS.value)return false;
 var t=document.getElementById('vfwhy');
 var r=valueFeltRecord(CURP.practice||null,{value:VF_ANS.value, again:VF_ANS.again,
  reason:t?t.value:null});
 if(!r.ok){ status('Your answers were not kept. '+(r.errs[0]||''),'fail'); return false; }
 CURP.practice=r.P;
 sheetShut();
 if(!pSave()){ status('This browser would not save, so your answers are not kept yet.','fail'); return false; }
 status('Kept on your record.','ok');
 return true;}
/* Skip: writes nothing, and says so in the release card's own words */
function vfSkip(){ sheetShut(); status('Skipped. Nothing was recorded.'); }
/* a dialog is standing when one is in the document and drawn */
function vfBlocked(){
 var s=document.getElementById('sheet'); if(!s||!s.hidden)return true;
 var ds=document.querySelectorAll('[aria-modal="true"]');
 for(var i=0;i<ds.length;i++){var r=ds[i].getBoundingClientRect(); if(r.width||r.height)return true;}
 return false;}
var VF_QUIET_MS=1500, VF_POLL_MS=500, VF_GIVE_UP_MS=15*60*1000;
function vfOpen(){
 if(VF_SHOWN||typeof CURP==='undefined'||!CURP)return false;
 var d=valueFeltDue(CURP);
 if(!d.due)return false;
 VF_SHOWN=true; VF_ANS={value:null, again:null};
 sheetOpen(vfSheet(d.since)); vfWire(d.since);
 return true;}
function vfWatch(){
 var quiet=0, waited=0;
 (function tick(){
  if(VF_SHOWN||waited>VF_GIVE_UP_MS)return;
  if(typeof CURP==='undefined'||!CURP||!valueFeltDue(CURP).due)return;
  quiet=vfBlocked()?0:quiet+VF_POLL_MS;
  if(quiet>=VF_QUIET_MS){ vfOpen(); return; }
  waited+=VF_POLL_MS; setTimeout(tick,VF_POLL_MS);})();}
if(typeof afterBoot==='function')afterBoot(function(){ try{ vfWatch(); }catch(e){} });
