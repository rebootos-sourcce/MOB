
/* ============================================================
   THE SUMMARY PANEL. His own words, round after round, named by him
   as asked for "at least 10 times over the last month or two": select
   a parent and see everything under it, parent to the teacher, all
   the way down, with the impressions underneath and a release wired
   at every rung. Clarified 12 November: dark, slightly darker than
   the app's own panel gray, reading as an element of the design but
   its own unique display area, and it sits where Source AI gives its
   output.

   NOT A NEW WALK. leaves() (component.js:1178) already recurses any
   chain node's .parts all the way to raw addresses; release.js,
   analytics.js, map.js and imprints.js already trust it for exactly
   that. drills.js's "Made of" only ever showed the one rung directly
   below a selection (his own 4 November ruling, drills.js line 238).
   This panel is the first surface to print every rung of that same
   walk at once rather than one click at a time, built on the same
   trusted .parts recursion, not a second one.

   "TEACHER" HAS NO MATCH IN THE CHAIN. Checked before building this:
   engine/trace.js's real cascade is nerve -> address -> fetter ->
   saboteur -> complex -> hyper-complex -> super-complex, and stops
   there. "Teacher" (DESIGN-teachers.md) is a Compass construct, never
   wired to this cascade. This panel goes exactly as far as the real
   data goes: addresses. Connecting an actual teacher record onto the
   end of it is separate, unbuilt, cross-module work, named here so it
   is never silently assumed done by a panel that merely renders deep.

   SELECTION IS THE EXISTING ONE. "Select your parent" is S.pin, set by
   the same .stk-r[data-sk] press that already opens runDrill (ui.js,
   the stack/cascade rail). This panel does not invent a second way to
   pick a node; it answers the same pick a second way, alongside the
   one-rung drill, not instead of it. */
function smpKey(o){return o.kind+':'+o.nm;}
function smpFind(key){
 var rs=computeSeen(), found=null;
 ['sabs','cxs','hys','sups'].forEach(function(k){(rs[k]||[]).forEach(function(x){if(smpKey(x)===key)found=x;});});
 return found;}
function smpTreeRow(o,depth){
 if(!o)return '';
 if(!o.parts)return addrRow(o);
 var kids=(o.parts||[]).map(function(x){return smpTreeRow(x,depth+1);}).join('');
 return '<div class="smp-row" style="--d:'+depth+'">'
  +'<button type="button" class="smp-rel" data-smprel="'+esc(smpKey(o))+'" title="Release everything under '+esc(o.nm)+'">'
  +crPat(o,'xs')+'<span class="smp-nm">'+esc(o.nm)+'</span></button></div>'
  +'<div class="smp-kids">'+kids+'</div>';}
/* IMPRESSIONS UNDERNEATH, filtered to this node's own addresses. Same
   data impRender already draws from (ST_PARSED.imprints), not a
   second imprint source. */
function smpImpressionsHtml(o){
 if(typeof ST_PARSED==='undefined'||!ST_PARSED||!ST_PARSED.imprints)return '<p class="smp-note">No impressions recorded here yet.</p>';
 var ids={}; leaves(o).forEach(function(n){ids[n.i]=1;});
 var rows=ST_PARSED.imprints.filter(function(im){return ids[im.i];});
 if(!rows.length)return '<p class="smp-note">No impressions recorded here yet.</p>';
 return '<div class="smp-imps">'+rows.map(function(im){
  return '<div class="smp-imp">'+esc(im.nm||im.b||'')+'</div>';}).join('')+'</div>';}
function summaryPanelHtml(){
 if(!S.pin)return '';
 var o=S.pin, ids=leaves(o).map(function(n){return n.i;});
 return '<div class="smp" id="smppanel" aria-label="Summary, '+esc(o.nm)+'">'
  +'<div class="smp-hd">'+crPat(o,'sm')+'<span class="smp-hdname">'+esc(o.nm)+'</span>'
  +'<button type="button" class="btn pri smp-relall" id="smprelall">Release all '+ids.length+'</button></div>'
  +'<div class="smp-tree">'+smpTreeRow(o,0)+'</div>'
  +'<div class="smp-imphd">Impressions</div>'
  +smpImpressionsHtml(o)
  +'</div>';}
function summaryPanelWire(h){
 var all=h.querySelector('#smprelall');
 if(all)all.onclick=function(){
  if(!S.pin||typeof relPick!=='function')return;
  relPick(leaves(S.pin).map(function(n){return n.i;}));};
 h.querySelectorAll('[data-smprel]').forEach(function(b){b.onclick=function(){
  var found=smpFind(b.getAttribute('data-smprel'));
  if(found&&typeof relPick==='function')relPick(leaves(found).map(function(n){return n.i;}));};});}
