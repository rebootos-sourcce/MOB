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
 var called=first.length?first[0]:fit[0];
 return {band:band, track:track, tier:tier, called:called,
  substituted:!first.length, actualTrack:called?called.track:track, all:fit};}
function ritOpen(fromLog){
 RIT.open=true; RIT.from=fromLog||null; RIT.sel={};
 var c=ritFor(compute());
 if(c.called)RIT.sel[c.called.k]=true;
 ritRender();}
function ritClose(){RIT.open=false;ritRender();}
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
 if(RIT.from&&RIT.from.length)
  out+='<div class="rit-from">After releasing '+RIT.from.length+': '
   +esc(RIT.from.slice(0,3).map(function(x){return x.name;}).join(', '))
   +(RIT.from.length>3?' and '+(RIT.from.length-3)+' more':'')+'</div>';
 out+='<div class="rit-list">';
 ['Somatic','Body','Energy','Mind'].forEach(function(tr){
  var set=c.all.filter(function(p){return p.track===tr;});
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
 if(picked.length){
  out+='<div class="pm-eye" style="margin-top:16px">The ritual, '+mins+' minutes</div>'
   +'<div class="rit-how">';
  picked.forEach(function(p,i){
   out+='<div class="rit-step"><b>'+(i+1)+'. '+esc(p.nm)+'</b><p>'+esc(p.how)+'</p></div>';});
  out+='</div>';}
 out+='<div class="rel-act"><button class="btn" id="ritx">Close</button>'
  +'<button class="btn pri" id="ritsave"'+(picked.length?'':' disabled')+'>Save ritual</button></div></div>';
 h.innerHTML=out;
 document.querySelectorAll('[data-rit]').forEach(function(el){el.onclick=function(){
  RIT.sel[el.dataset.rit]=!RIT.sel[el.dataset.rit]; ritRender();};});
 var b;
 if((b=document.getElementById('ritx')))b.onclick=ritClose;
 if((b=document.getElementById('ritsave')))b.onclick=function(){
  if(CURP){CURP.rituals=CURP.rituals||[];
   CURP.rituals.push({t:new Date().toISOString(),track:c.track,band:c.band,
    steps:picked.map(function(p){return p.k;}),min:mins});
   pSave();}
  b.textContent='Saved'; setTimeout(ritClose,700);};}
