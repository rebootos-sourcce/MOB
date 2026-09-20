/* ============================================================
   RITUAL. Release names what is running. The ritual turns it into
   something repeatable. Which practice the state calls for is decided
   by the seat carrying the most, not by preference.
   ============================================================ */
var RIT={open:false, sel:{}, from:null};
var TRACK4BAND={Root:'Body',Sacral:'Somatic',Solar:'Somatic',Heart:'Body',
                Throat:'Mind','3rd Eye':'Mind',Crown:'Energy'};
function ritFor(r){
 var band=r.darkB||'Root', track=TRACK4BAND[band]||'Body';
 var tier=r.DQ>=8?1:(r.DQ>=4?2:3);        /* heavy load starts at entry */
 var fit=PRACTICE.filter(function(p){return p.tier<=tier;});
 var first=fit.filter(function(p){return p.track===track;});
 /* at tier 1 some tracks hold nothing. say so rather than naming a track and
    then calling for a practice from a different one. */
 /* THE LIGHTEST ONE IN THE TRACK, NOT THE FIRST ONE IN THE TABLE. Measured:
    835 of 1000 arrivals were asked for fifteen minutes or more as a first
    practice and 585 of 1000 for twenty, because the table order happened to put
    the long ones first. The track is the diagnosis and stays. Which practice
    inside it is the entry is a question about what a person will actually do
    once, and the answer is the short one. */
 var lightest=function(set){return set.slice().sort(function(a,b){
  return (a.min-b.min)||(a.tier-b.tier);})[0];};
 var called=first.length?lightest(first):lightest(fit);
 return {band:band, track:track, tier:tier, called:called,
  substituted:!first.length, actualTrack:called?called.track:track, all:fit};}
function ritOpen(fromLog){
 RIT.open=true; RIT.from=fromLog||null; RIT.sel={};
 var c=ritFor(compute());
 if(c.called)RIT.sel[c.called.k]=true;
 RIT.all=false; RIT.when=''; RIT.where='';
 ritRender();}
/* THE ONE ALREADY SAVED, newest first. A ritual is a plan and a plan a person
   cannot find again is not a plan. */
function ritLast(){
 var a=(CURP&&CURP.rituals)||[];
 return a.length?a[a.length-1]:null;}
function ritToday(){
 var r=ritLast();
 if(!r||typeof pracDay!=='function')return null;
 return (pracDay(r.t)===pracDay(Date.now()))?r:null;}
/* the steps of a saved ritual, read back out of the keys it stored */
function ritSteps(r){
 return ((r&&r.steps)||[]).map(function(k){
  return PRACTICE.filter(function(p){return p.k===k;})[0];}).filter(Boolean);}
/* Closing means leaving the surface, not emptying it. While Ritual is the tab
   there is nothing behind it to go back to, so a close that blanked the host
   would leave a named tab showing an empty box. */
function ritClose(){
 if(typeof TAB!=='undefined'&&typeof S!=='undefined'&&S.tab===TAB.RITUAL){
  if(typeof setTab==='function'){setTab(TAB.SUMMARY);return;} }
 RIT.open=false;ritRender();}
function ritRender(){
 var h=document.getElementById('rit'); if(!h)return;
 if(!RIT.open){h.style.display='none';h.innerHTML='';return;}
 h.style.display='flex';
 var r=compute(), c=ritFor(r);
 var picked=PRACTICE.filter(function(p){return RIT.sel[p.k];});
 var mins=picked.reduce(function(a,p){return a+p.min;},0);
 var out='<div class="rel-card rit-card">'
  +'<div class="pm-eye">Build a ritual</div>'
  +'<div class="rel-node">'+(c.substituted?c.actualTrack:c.track)+'</div>'
  +'<div class="rel-sub">The '+c.band.toLowerCase()+' is carrying the most, so the '
  +c.track.toLowerCase()+' track is what your state calls for. Tier '+c.tier+' and below.'
  +(c.substituted?' Nothing in that track sits at tier '+c.tier+', so the '
    +c.actualTrack.toLowerCase()+' track carries it.':'')+'</div>';
 /* WHAT IS ALREADY SAVED, READ BACK. A plan the product forgets the moment it
    is written is not a plan, and it was the largest hole in the loop. Today's
    ritual sits at the top of its own surface with its when and its where, and
    the one control that turns a plan into a thing that happened. */
 var td=ritToday(), tdSteps=ritSteps(td);
 if(td)
  out+='<div class="rit-saved'+(td.done?' done':'')+'">'
   +'<div class="pm-eye">Today\'s ritual</div>'
   +'<div class="rit-sv-h">'+tdSteps.map(function(p){return esc(p.nm);}).join(', ')
   +' <b>'+((+td.min)||0)+'m</b></div>'
   +((td.when||td.where)
     ? '<p class="rit-sv-p">When '+esc(td.when||'it is time')+', '
       +esc(td.where?'at '+td.where:'wherever you are')+'.</p>'
     : '<p class="rit-sv-p rel-dim">No time and no place set, so it is an '
       +'intention rather than a plan.</p>')
   +(td.done
     ? '<p class="rit-sv-p rit-sv-ok">Done. It is on the record.</p>'
     : '<button type="button" class="btn pri" id="ritdone">I did it</button>')
   +'</div>';
 if(RIT.from&&RIT.from.length)
  out+='<div class="rit-from">After releasing '+RIT.from.length+': '
   +esc(RIT.from.slice(0,3).map(function(x){return x.name;}).join(', '))
   +(RIT.from.length>3?' and '+(RIT.from.length-3)+' more':'')+'</div>';
 /* ONE PRACTICE ON THE CARD. Nineteen choices sat here against a working
    memory of about four, and every one of them was asked for at once. The one
    the state calls for is the card; the rest are behind a single control, which
    is a choice between two things rather than nineteen. Worth 19 of 1000 at day
    thirty when measured, and the cheapest of the four fixes. */
 var showAll=!!RIT.all;
 out+='<div class="rit-list'+(showAll?'':' one')+'">';
 ['Somatic','Body','Energy','Mind'].forEach(function(tr){
  var set=c.all.filter(function(p){return p.track===tr;});
  if(!showAll)set=set.filter(function(p){return c.called&&p.k===c.called.k;});
  if(!set.length)return;
  out+='<div class="rit-tr" style="--c:'+(PTRACK[tr]||GOLD)+'">'+tr+'</div>';
  set.forEach(function(p){
   var on=!!RIT.sel[p.k], call=(c.called&&c.called.k===p.k);
   out+='<button class="rit-row'+(on?' on':'')+'" data-rit="'+p.k+'">'
    +'<i style="background:'+(PTRACK[tr]||GOLD)+'"></i>'
    +'<span class="rit-nm">'+esc(p.nm)+(call?' <em>called for</em>':'')+'</span>'
    +'<span class="rit-d">'+esc(p.d)+'</span>'
    +'<b>'+p.min+'m</b></button>';});});
 out+='</div>';
 out+='<button type="button" class="rit-more" id="ritall">'
  +(showAll?'Show only what is called for'
   /* NUMWORD capitalises, because everywhere else it starts a heading. Here it
      is mid sentence, so it is lowered rather than a second function written. */
   :'Choose something else, '+NUMWORD(c.all.length).toLowerCase()+' practices')+'</button>';
 if(picked.length){
  out+='<div class="pm-eye" style="margin-top:16px">The ritual, '+mins+' minutes</div>'
   +'<div class="rit-how">';
  picked.forEach(function(p,i){
   out+='<div class="rit-step"><b>'+(i+1)+'. '+esc(p.nm)+'</b><p>'+esc(p.how)+'</p></div>';});
  out+='</div>';
  /* THE IF THEN PLAN. Two fields, and they are the largest single item in the
     whole loop: 72 of 1000 at day thirty, measured. Gollwitzer and Sheeran
     2006, ninety four studies, d 0.65, the largest effect in the research file,
     and the mechanism is exactly this: a plan that names a time and a place is
     acted on and a plan that names an intention is not.

     The record already carried the track, the seat, the steps and the minutes
     and no surface ever asked when or where, so the plan was saved and could
     not be read back. Both are optional, because a person who will not answer
     should still be able to save. */
  out+='<div class="rit-plan"><div class="pm-eye">When, and where</div>'
   +'<label class="rit-f"><span>When</span>'
   +'<input type="text" id="ritwhen" maxlength="40" placeholder="after I put the kettle on" '
   +'value="'+esc(RIT.when||'')+'"></label>'
   +'<label class="rit-f"><span>Where</span>'
   +'<input type="text" id="ritwhere" maxlength="40" placeholder="the chair by the window" '
   +'value="'+esc(RIT.where||'')+'"></label>'
   +'<p class="rit-if">'+(RIT.when||RIT.where
     ? 'When '+esc(RIT.when||'it is time')+', '+esc(RIT.where?'at '+RIT.where:'wherever you are')
       +', you will '+esc(String(picked[0].nm).toLowerCase())+'.'
     : 'A plan with a time and a place gets done. One without them does not.')
   +'</p></div>';}
 out+='<div class="rel-act"><button class="btn" id="ritx">Close</button>'
  +'<button class="btn pri" id="ritsave"'+(picked.length?'':' disabled')+'>Save ritual</button></div>';
 /* THE RECORD, ON THE SURFACE THAT EARNS IT. ladderHtml() draws the streak, the
    ledger and the marks, takes no arguments, is correct, and was called from
    exactly one place: inside the Compass card, which measures 22 percent
    touched. So the accountability half of this product was built, ruled, and
    reachable by roughly one person in five. Worth 40 of 1000 at day thirty when
    measured. Harkin 2016, a hundred and thirty eight studies, d 0.40, larger
    when the thing is physically recorded.

    The same function on both surfaces rather than a second one, because two
    places that can report a streak is two places it can be wrong from. */
 if(typeof ladderHtml==='function')out+='<div class="rit-rec">'+ladderHtml()+'</div>';
 out+='</div>';
 h.innerHTML=out;
 document.querySelectorAll('[data-rit]').forEach(function(el){el.onclick=function(){
  RIT.sel[el.dataset.rit]=!RIT.sel[el.dataset.rit]; ritRender();};});
 var b;
 if((b=document.getElementById('ritx')))b.onclick=ritClose;
 /* the ladder's control opens the builder, and on this surface the builder is
    already open, so it clears the selection back to what is called for rather
    than navigating anywhere. */
 if((b=document.getElementById('ldrit')))b.onclick=function(){
  RIT.sel={}; if(c.called)RIT.sel[c.called.k]=true; RIT.all=false; ritRender();
  var f=document.querySelector('.rit-list'); if(f&&f.scrollIntoView)
   f.scrollIntoView({block:'nearest'});};
 if((b=document.getElementById('ritall')))b.onclick=function(){
  RIT.all=!RIT.all; ritRender();};
 /* the two fields write to state on the way past rather than on render, so the
    sentence under them updates as they are typed and nothing is lost when the
    card redraws. */
 ['when','where'].forEach(function(k){
  var el=document.getElementById('rit'+k); if(!el)return;
  el.oninput=function(){RIT[k]=el.value;};
  el.onchange=function(){RIT[k]=el.value; ritRender();};});
 if((b=document.getElementById('ritdone')))b.onclick=function(){
  var t=ritToday(); if(!t)return;
  t.done=new Date().toISOString();
  /* a write that can fail reports through status(), which is the standing rule */
  try{ pSave(); if(typeof status==='function')status('Marked done.'); }
  catch(e){ if(typeof status==='function')status('Could not save that.'); return; }
  ritRender(); if(typeof render==='function')render();};
 if((b=document.getElementById('ritsave')))b.onclick=function(){
  if(CURP){CURP.rituals=CURP.rituals||[];
   CURP.rituals.push({t:new Date().toISOString(),track:c.track,band:c.band,
    steps:picked.map(function(p){return p.k;}),min:mins,
    /* the plan, and done starts false so a saved ritual is a plan until the
       person says otherwise. An older entry has no done key at all and is read
       as practised, which is why this one is written explicitly. */
    when:(RIT.when||''), where:(RIT.where||''), done:false});
   pSave();}
  b.textContent='Saved';
  /* AND IT STAYS ON THE SURFACE. It used to close seven hundred milliseconds
     later, which threw away the plan the person had just made and the one
     control that puts the day on the record. */
  RIT.sel={}; RIT.when=''; RIT.where=''; RIT.all=false;
  setTimeout(function(){ritRender(); if(typeof render==='function')render();},420);};}
