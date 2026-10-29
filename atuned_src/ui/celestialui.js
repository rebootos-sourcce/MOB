/* ============================================================
   CELESTIAL INTO AVATAR — read-only, profile-derived overlay.
   No API calls, no profile save, no CQ/DQ/SQ, no Trace Graph mutations.
   Sources generated from Reboot-OS canonical record fields.
   MOB retains ownership of avatar, birth and story calculations.
   ============================================================ */
var AVCE={open:false,who:null,mounted:null};
function avCelEscape(t){
 return String(t==null?'':t).replace(/[&<>"']/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c];});}
function avCelProfile(){
 var r;
 try{
  /* sumBirth is MOB's existing single resolver. It already handles roster
     examples and the current person's born.date/time/place/zone. */
  r=(typeof sumBirth==='function')?sumBirth():null;
 }catch(err){return {ready:false,why:'Birth information could not be resolved.'};}
 var sp=r&&r.sp;
 if(!sp)return {ready:false,why:'Add birth information to see a personal Celestial lens.'};
 var west=(typeof sp.sun==='string')?sp.sun.toLowerCase():null;
 var east=(typeof sp.chinese==='string')?sp.chinese.toLowerCase():null;
 var n=(r.N&&r.N.lifePath!=null)?r.N.lifePath:sp.lp;
 var value=String(n==null?'':n);
 if(!west||!east||!value||!/(^1$|^2$|^3$|^4$|^5$|^6$|^7$|^8$|^9$|^11$|^22$|^33$)/.test(value))
  return {ready:false,why:'The Celestial lenses are incomplete; unresolved birth details are not guessed.'};
 return {ready:true,selected_ids:['western:sign:'+west,'eastern:animal:'+east,
  'numerology:pythagorean:number:'+value],hd:sp.hd||null};
}
function avCelKnownMasks(){
 /* These are Reboot-OS Influence Layer UI lens labels, not new personal
    mask diagnoses. A selection chooses a way to ASK, not who the person is. */
 return [
  ['Child','The self that formed before you could name what was happening.'],
  ['Preteen','The self that learned what got you accepted.'],
  ['Teen','The self that fought for a position.'],
  ['Adult','The self that had to prove it could hold its own.'],
  ['Professional','The self that competence was built on.'],
  ['Ideological','The self that took on a borrowed order and stopped checking it.']
 ].map(function(p){return {id:'mask:'+p[0],label:p[0],description:p[1],
  source_path:'Reboot-OS/atuned/src/39_the-influence-layer.js#ILMASKD'};});
}
function avCelTrace(){
 if(typeof traceFromRecord!=='function'||!CURP)return null;
 try{
  var reading=(typeof compute==='function')?compute():null;
  return traceFromRecord(CURP,null,reading);
 }catch(err){return null;}
}
function avCelCloseMounted(){
 if(AVCE.mounted&&typeof AVCE.mounted.destroy==='function'){
  try{AVCE.mounted.destroy();}catch(e){} }
 AVCE.mounted=null;
}
function avCelestialAttach(host){
 if(!host||typeof host.querySelector!=='function')return;
 var entry=host.querySelector('[data-avcelestial]');
 if(!entry)return;
 var person=String(S.who)+'|'+String(CURP&&CURP.id);
 if(AVCE.who!==person){avCelCloseMounted();AVCE.open=false;AVCE.who=person;}
 /* The source reading is not in the default Avatar DOM. Opening it is an
    intentional person action, so their context is not displayed to others
    just because the tab was visited. */
 entry.innerHTML='<button type="button" class="btn" data-avcel-toggle aria-expanded="'+
  (AVCE.open?'true':'false')+'">Celestial lens '+(AVCE.open?'−':'+')+'</button>'+
  '<div data-avcel-body></div>';
 var btn=entry.querySelector('[data-avcel-toggle]'),body=entry.querySelector('[data-avcel-body]');
 btn.onclick=function(){AVCE.open=!AVCE.open;avCelCloseMounted();avCelestialAttach(host);};
 if(!AVCE.open)return;
 if(typeof AT_CELESTIAL==='undefined'||typeof AT_CELESTIAL_SNAPSHOT==='undefined'){
  body.textContent='Celestial record projection is not included in this build.';
  return;
 }
 var p=avCelProfile();
 if(!p.ready){body.textContent=p.why;return;}
 var args={selected_ids:p.selected_ids,hd:p.hd,trace_graph:avCelTrace(),
  avatar:CURP&&CURP.avatar||null,mask_registry:avCelKnownMasks(),
  focused_layer:'celestial',selected_mask_id:null,
  avatar_pair_id:null,evidence:[]};
 try{
  AVCE.mounted=AT_CELESTIAL.mount(body,args);
 }catch(err){
  body.textContent='Celestial lens is unavailable for these inputs; no data was changed.';
  AVCE.mounted=null;
 }
}
