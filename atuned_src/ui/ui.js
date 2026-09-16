
/* ============================================================
   POINTER. Drag a segment to load or clear it, click to drill.
   ============================================================ */
const HOWTO=[
 'A · Field. Three things only.\nThe core is CQ. The ring is your 112 addresses, SQ.\nThe wash behind everything is DQ.\nDrag any segment to load or clear it.',
 'B · Firing. A plus the seats and the saboteurs.\nEach bead is a saboteur. The threads show which\naddresses built it. Hover a bead to name it.',
 'C · Compounding. B plus the rest of the chain.\nSaboteur to complex to hyper to character, inward.\nThe named ring is your twelve archetypes.\nClick one to change how the soul expresses.',
 'D · Everything. C plus domains, masks, laws.\nThe outer ring is nineteen domains, five per root cluster.\nThe faint ring inside is the six masks.\nThe short spokes at the centre are the twenty-one laws.'];
function describe(h,r){
 if(h.k==='core')return '<u>CQ '+Math.round(r.CQ)+'</u> <b>the core</b><hr>'
  +'intention <b>'+r.It.toFixed(1)+'</b> times integrity <b>'+r.Ig.toFixed(1)+'</b><br>'
  +'over resistance <b>'+r.Rz.toFixed(2)+'</b><hr>'
  +'Size and saturation are coherence.<br><b>Click for the breakdown.</b>';
 if(h.k==='node'){var n=h.n;
  return '<u>'+String(n.i).padStart(3,'0')+'</u> <b>'+esc(n.k)+'</b><hr>'+n.b+' seat, '+(n.n||'field')
   +'<hr>axis <b>'+(n.cf||'unrouted')+'</b><br>susceptibility <b>'+n.susc.toFixed(2)+'</b>'
   +((AFFIN[r.root]||[]).indexOf(n.cf)>=0?'<br><b>1.3×</b> '+r.root+' affinity':'')
   +'<br>held <b>'+n.held.toFixed(1)+'</b>, opposite <b>'+n.rep.toFixed(1)+'</b>'
   +'<br><b>SQ '+n.sq.toFixed(1)+'</b><hr><b>Drag to change, click for detail.</b>';}
 if(h.k==='law'){var l=SI[h.j];
  return '<u>law</u> <b>'+l.nm+'</b><hr>seated at the '+l.b.toLowerCase()
   +'<br>reads <b>'+S.law[l.nm].toFixed(1)+'</b><hr><b>Click for detail.</b>';}
 if(h.k==='arch')return '<u>archetype</u> <b>'+ARCH[h.j].nm+'</b><hr>'+ARCH[h.j].v
  +'<br>affinity <b>'+(r.aff[h.j]*100).toFixed(0)+'%</b><hr><b>Click to set as primary.</b>';
 if(h.k==='dom'){var d=DOMAINS[h.j];
  return '<u>'+d.r+'</u> <b>'+d.nm+'</b><hr>'+d.d+'<br>weight <b>'+(DOMAIN[h.j]||0).toFixed(2)
   +'</b><hr><b>Click to select, shift-click to add.</b>';}
 if(h.k==='mk')return '<u>mask</u> <b>'+h.o.nm+'</b><hr>speaks from '+(h.o.bands||[]).join(' + ')
  +'<br>load <b>'+h.o.w.toFixed(1)+'</b>';
 var o=h.o; if(!o)return '';
 var f=leaves(o);
 var nm={sab:'saboteur',cx:'complex',hy:'hyper-complex',sup:'character layer'}[h.k];
 if(!nm)return '';
 return '<u>'+nm+'</u> <b>'+esc(o.nm)+'</b>'+(o.unnamed?' <em>derived</em>':'')+'<hr>'
  +(o.auth?esc(o.auth)+'<br>':'')+(o.sub?esc(o.sub)+'<br>':'')
  +'weight <b>'+o.w.toFixed(1)+'</b><hr><b>from '+f.length+' addresses</b><br>'
  +f.slice(0,5).map(function(n){return String(n.i).padStart(3,'0')+' '+esc(n.k)
   +' <b>'+n.sq.toFixed(1)+'</b>';}).join('<br>')
  +(f.length>5?'<br>and '+(f.length-5)+' more':'');}
function hitTest(px,py){
 for(var i=HIT.length-1;i>=0;i--){var h=HIT[i];
  if(h.x!==undefined){if(Math.hypot(px-h.x,py-h.y)<=h.rad)return h;continue;}
  var d=Math.hypot(px-h.cx,py-h.cy);if(d<h.r0||d>h.r1)continue;
  var nz=function(x){while(x<-Math.PI)x+=TAU;while(x>Math.PI)x-=TAU;return x;};
  var a=Math.atan2(py-h.cy,px-h.cx);
  if(nz(a-h.a0)>=0&&nz(h.a1-a)>=0)return h;}
 return null;}
const loc=function(e){var b=cv.getBoundingClientRect();return [e.clientX-b.left,e.clientY-b.top];};
let DRAG=null;
cv.addEventListener('pointerdown',function(e){
 var L=loc(e),x=L[0],y=L[1],h=hitTest(x,y);
 if(!h)return;
 if(h.k==='node'&&h.n.cf){DRAG={mode:'cf',cf:h.n.cf,y:y,s:S.charge[h.n.cf],node:h.n,moved:false};
  cv.setPointerCapture(e.pointerId);return;}
 if(h.k==='dom'){toYou();
  if(e.shiftKey){var k=S.doms.indexOf(h.j);
   if(k>=0){if(S.doms.length>1)S.doms.splice(k,1);}else S.doms.push(h.j);}
  else S.doms=[h.j];
  buildSoul();S.pin=null;syncSoul();saveYou();render();return;}
 if(h.k==='arch'){toYou();
  if(e.shiftKey){var k2=S.arcs.indexOf(h.j);
   if(k2>=0){if(S.arcs.length>1)S.arcs.splice(k2,1);}else S.arcs.push(h.j);}
  else S.arcs=[h.j].concat(S.arcs.filter(function(z){return z!==h.j;}).slice(0,3));
  buildSoul();S.pin=null;syncSoul();saveYou();render();return;}
 if(h.k==='law'){S.pin=null;runLawDrill(SI[h.j]);render();return;}
 if(h.k==='core'){S.pin=null;runCoreDrill();render();return;}
 if(h.k==='mk'){S.pin=null;render();return;}
 var o=h.o||null;
 var same=o&&S.pin&&S.pin.nm===o.nm&&S.pin.kind===o.kind;
 S.pin=same?null:o; runDrill(S.pin); render();});
cv.addEventListener('pointerup',function(){
 if(DRAG&&!DRAG.moved&&DRAG.node){var n=DRAG.node;DRAG=null;S.pin=null;runNodeDrill(n);render();return;}
 DRAG=null;});
cv.addEventListener('pointermove',function(e){
 var L=loc(e),x=L[0],y=L[1];
 if(DRAG){var d=(DRAG.y-y)/22;
  if(Math.abs(DRAG.y-y)>3)DRAG.moved=true;
  toYou();S.charge[DRAG.cf]=clamp(DRAG.s+d,0,10);
  syncCh();saveYou();render();return;}
 var h=hitTest(x,y),pr=$('probe');
 S.hover=h?(h.n||h.o||null):null;
 if(!h){pr.classList.remove('on');cv.style.cursor='crosshair';return;}
 var t=describe(h,compute());
 if(!t){pr.classList.remove('on');return;}
 cv.style.cursor=(h.k==='node')?'ns-resize':'pointer';
 pr.innerHTML=t;
 pr.style.left=Math.min(CW-312,x+18)+'px';
 pr.style.top=Math.min(CH-200,y+18)+'px';
 pr.classList.add('on');});
cv.addEventListener('pointerleave',function(){S.hover=null;DRAG=null;$('probe').classList.remove('on');});

/* ---- collapsible sections ---- */
var OPENSEC='soul';
function wireSections(){
 document.querySelectorAll('.lsec').forEach(function(sec){
  var hd=sec.querySelector('.lsec-hd'); if(!hd||hd._w)return; hd._w=1;
  hd.onclick=function(){OPENSEC=(OPENSEC===sec.dataset.sec)?'':sec.dataset.sec;paintSections();};});
 paintSections();}
function paintSections(){
 document.querySelectorAll('.lsec').forEach(function(sec){
  var on=OPENSEC===sec.dataset.sec;
  sec.classList.toggle('open',on);
  var hd=sec.querySelector('.lsec-hd');if(hd)hd.setAttribute('aria-expanded',on?'true':'false');});}

/* ============================================================
   RENDER. One truth, five windows. Nothing here holds its own copy
   of a derived value.
   ============================================================ */
function render(){
 const r=compute(), p=PEOPLE[S.who];
 $('tier').textContent=r.tier;
 /* benign against malignant, as percentages of one field */
 (function(){
  var mal=Math.max(0,Math.min(100,r.malig||0)), ben=100-mal;
  $('pol').innerHTML='<div class="bmrow"><span class="bmk">Benign</span>'
   +'<span class="bmbar"><i style="width:'+ben.toFixed(0)+'%;background:'+PAL.Heart+'"></i></span>'
   +'<span class="bmv" style="color:'+PAL.Heart+'">'+ben.toFixed(0)+'%</span></div>'
   +'<div class="bmrow"><span class="bmk">Malignant</span>'
   +'<span class="bmbar"><i style="width:'+mal.toFixed(0)+'%;background:'+PAL.Root+'"></i></span>'
   +'<span class="bmv" style="color:'+PAL.Root+'">'+mal.toFixed(0)+'%</span></div>'
   +'<div class="bmnote">'+(ben>=mal?'building more than it costs':'costing more than it builds')+'</div>';})();
 $('howto').textContent=HOWTO[S.view];
 /* the lean. the story moves it. */
 (function(){
  var pb=$('polbar'); if(!pb)return;
  var L=leanRead(r);
  pb.innerHTML='<div class="fill" style="width:'+L.ben.toFixed(0)+'%;background:linear-gradient(90deg,'
   +PAL.Heart+' 0%,'+PAL.Throat+' 100%);opacity:.55"></div><div class="mid"></div>'
   +'<div class="lb l">benign '+L.ben.toFixed(0)+'%</div>'
   +'<div class="lb r">'+L.mal.toFixed(0)+'% malignant</div>';
  pb.title='benign '+L.ben.toFixed(0)+', malignant '+L.mal.toFixed(0)+', read from '+L.src;
  $('polnote').textContent=L.cues
   ? 'The story leans '+(L.mal>50?'malignant':'benign')+'. '+L.cues+' cue'+(L.cues===1?'':'s')+' so far.'
   : 'No story yet. This is the field alone.';})();
 /* the key. three quotients, three elements. */
 $('key').innerHTML='<h4>What you are looking at</h4>'
  +'<div class="kr">'+cr('Crown',r.CQ,{size:'sm',label:'CQ'})
  +'<span class="tx"><b>CQ</b> the core<em>and how far the light reaches</em></span></div>'
  +'<div class="kr">'+cr('Root',clamp(r.DQ/14,0,1)*100,{size:'sm',raw:r.DQ.toFixed(1)})
  +'<span class="tx"><b>DQ</b> shadow weight, summed<em>total load, pressing in from the edges</em></span></div>'
  +'<div class="kr">'+cr(r.darkB,r.SQm*10,{size:'sm',raw:r.SQm.toFixed(1)})
  +'<span class="tx"><b>SQ</b> depth of one segment<em>weight held at a single address</em></span></div>'
  +'<div class="kr">'+cr('Heart',r.poleMean*100,{size:'sm',raw:r.poleMean.toFixed(2)})
  +'<span class="tx"><b>Pole</b> coherent opposite in<em>release empties, replace fills</em></span></div>';
 /* who. proportions, not one label. */
 (function(){
  var aff=(r.aff||[]).map(function(v,i){return {nm:(ARCH[i]||{}).nm||'',v:v};})
   .filter(function(x){return x.nm;}).sort(function(a,b){return b.v-a.v;});
  var tot=aff.reduce(function(a,x){return a+x.v;},0)||1;
  var T=['First','Second','Third'];
  function row(k,n,pc){return '<div class="tierow"><span class="tk">'+k+'</span>'
   +'<span class="tn">'+n+'</span><span class="tp">'+pc+'</span></div>';}
  var ah=aff.slice(0,3).map(function(x,i){return row(T[i],x.nm,Math.round(x.v/tot*100)+'%');}).join('');
  var dsh=S.doms.map(function(di,i){var d=DOMAINS[di];
   return d?row(T[i]||'Also',d.nm,Math.round(100/(S.doms.length||1))+'%'):'';}).join('');
  var held=W.filter(function(n){return n.sq>=4;}).length;
  var inst=W.filter(function(n){return n.pole>=4;}).length;
  $('person').innerHTML='<h3>'+(p.you?'You':p.nm)+'</h3>'
   +(p.you?'':'<div class="prole">'+p.age+', '+esc(String(p.role).replace(' · ICP',''))+'</div>')
   +(p.says?'<p class="psay">'+esc(p.says)+'</p>':'')
   +'<div class="pm-eye" style="margin-top:14px">Archetypes</div>'+ah
   +'<div class="pm-eye" style="margin-top:12px">Domains</div>'+dsh
   +'<div class="pm-eye" style="margin-top:12px">Field</div>'
   +row('Held',held+' of '+NODES.length,(held?Math.round(held/NODES.length*100):0)+'%')
   +row('Installed',inst+' addresses',(inst?Math.round(inst/NODES.length*100):0)+'%')
   +row('Darkest',r.darkB,r.darkV.toFixed(1))
   +row('Law shut',r.weakL.nm,'at the '+r.weakL.b.toLowerCase());})();
 $('rows').innerHTML='<span class="k">Stack</span><br>addresses <b>'+r.loaded.length+'</b> of '+NODES.length
  +'<br>saboteurs <b>'+r.sabs.length+'</b><br>complexes <b>'+r.cxs.length+'</b>'
  +'<br>hyper <b>'+r.hys.length+'</b> of 12<br>character <b>'+r.sups.length+'</b>'
  +'<br><br><span class="k">Instruments</span><br>'
  +'integrity <b>'+r.Ig.toFixed(1)+'</b><br>intention <b>'+r.It.toFixed(1)+'</b><br>'
  +'pole in <b>'+r.poleMean.toFixed(2)+'</b><br>jouissance <b>'+r.JQ.toFixed(2)+'</b>'
  +(r.excess.length?', '+r.excess.length+' overshot':'')+'<br>'
  +'distortion <b>'+r.dist.toFixed(1)+'</b>';
 /* what is running */
 const rows=[].concat(r.sups,r.hys,r.cxs,r.sabs);
 const TIERNM={sup:'Character',hy:'Hyper-complex',cx:'Complex',sab:'Saboteur'};
 const TIERC={sup:PAL.Root,hy:PAL.Sacral,cx:PAL.Solar,sab:PAL.Throat};
 const NOTE={sup:'you cannot see it as separate from you',hy:'others see it, you do not',
  cx:'two saboteurs compounded',sab:'a cluster of addresses co-firing'};
 $('run').innerHTML=rows.length
  ? rows.slice(0,4).map(function(o,i){
     return '<div class="rcard" data-i="'+i+'">'
      +'<div class="bar" style="background:'+TIERC[o.kind]+';width:'+(o.w*10).toFixed(0)+'%"></div>'
      +'<div class="tier" style="color:'+(o.over?'var(--alarm)':TIERC[o.kind])+'">'+TIERNM[o.kind]
      +(o.over?', overshot':', collapsed')+'</div>'
      +'<div class="nm">'+esc(o.nm)+'</div>'
      +'<p class="sub">'+(o.over?'jouissance. done past the point where it serves, and not able to stop.'
        :esc(o.auth||o.sub||NOTE[o.kind]))+'</p>'
      +'<div class="w">'+crPat(o,'md')+'</div></div>';}).join('')
    +(rows.length>4?'<div class="rnone">and '+(rows.length-4)+' more below</div>':'')
  : '<div class="rnone">Nothing is running.</div>';
 $('run').querySelectorAll('.rcard').forEach(function(el){el.addEventListener('click',function(){
  var o=rows[+el.dataset.i];
  var same=S.pin&&S.pin.nm===o.nm&&S.pin.kind===o.kind;
  S.pin=same?null:o; runDrill(S.pin); render();});});
 renderAcc(r); renderSpirit(); renderPol2(r); syncMx();
 $('fire').innerHTML=rows.length
  ? '<div class="pm-eye" style="color:var(--gold);margin-bottom:8px">Running now</div>'
    +rows.slice(0,8).map(function(o,i){
     return '<div class="it'+(S.pin===o?' pin':'')+'" data-i="'+i+'">'
      +'<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(o.nm)
      +'</span><b>'+o.w.toFixed(1)+'</b></div>';}).join('')
    +(rows.length>8?'<div class="it"><span>and '+(rows.length-8)+' more</span></div>':'')
  : '<div class="pm-eye" style="color:var(--gold)">Nothing running</div>';
 $('fire').querySelectorAll('.it[data-i]').forEach(function(el){el.addEventListener('click',function(){
  var o=rows[+el.dataset.i];S.pin=(S.pin===o)?null:o;runDrill(S.pin);render();});});
 if(S.tab===TAB.ENERGY)renderMap(r);
 else if(S.tab===TAB.SUMMARY)sumRender();
 else if(S.tab===TAB.ANALYTICS)anaRender();}

/* ---- the loop ---- */
let last=0;
function loop(ts){
 if(!REDUCED)S.t+=(last?Math.min(.05,(ts-last)/1e3):0);
 last=ts; stepRel(ts);
 var r=compute();
 if(S.tab===TAB.FIELD){draw(r);drawAura(r);renderPol2(r);}
 else if(S.tab===TAB.ENERGY){drawAura(r);}
 requestAnimationFrame(loop);}

/* ---- init ---- */
layout(); mxKey(); wireSections(); loadP(0); setTab(TAB.FIELD);
requestAnimationFrame(loop);
