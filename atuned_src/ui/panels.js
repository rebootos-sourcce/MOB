
/* ============================================================
   CONTROLS
   ============================================================ */
const $=function(id){return document.getElementById(id);};
const svgI=function(p){return '<svg viewBox="0 0 24 24">'+p+'</svg>';};
function numField(host,name,band,store,key){
 const d=document.createElement('div');d.className='nf';
 const col=band?seatCol(band):'var(--gold)';
 d.innerHTML='<i style="background:'+col+'"></i><label>'+name+'</label>'
  +'<span class="tr" role="slider" tabindex="0" aria-label="'+name+'" aria-valuemin="0" '
  +'aria-valuemax="10" aria-valuenow="'+store[key]+'"><b style="background:'+col+'"></b></span>'
  +'<input type="number" min="0" max="10" step="0.5" value="'+store[key]+'" aria-label="'+name+'">';
 host.appendChild(d);
 const inp=d.querySelector('input'),trk=d.querySelector('.tr'),tr=d.querySelector('.tr b');
 tr.style.width=(store[key]*10)+'%';
 const set=function(v){toYou();store[key]=clamp(v,0,10);
  tr.style.width=(store[key]*10)+'%';inp.value=store[key].toFixed(1);
  trk.setAttribute('aria-valuenow',store[key].toFixed(1));saveYou();render();};
 inp.addEventListener('input',function(){set(+inp.value||0);});
 let dragging=false;
 const fromX=function(e){const b=trk.getBoundingClientRect();
  return ((e.clientX-b.left)/b.width)*10;};
 trk.addEventListener('pointerdown',function(e){dragging=true;trk.setPointerCapture(e.pointerId);set(fromX(e));});
 trk.addEventListener('pointermove',function(e){if(dragging)set(fromX(e));});
 trk.addEventListener('pointerup',function(){dragging=false;});
 trk.addEventListener('pointercancel',function(){dragging=false;});
 trk.addEventListener('keydown',function(e){
  if(e.key==='ArrowUp'||e.key==='ArrowRight'){e.preventDefault();set(store[key]+.5);}
  if(e.key==='ArrowDown'||e.key==='ArrowLeft'){e.preventDefault();set(store[key]-.5);}});
 trk.addEventListener('wheel',function(e){e.preventDefault();set(store[key]+(e.deltaY<0?.5:-.5));},{passive:false});
 inp.addEventListener('wheel',function(e){e.preventDefault();set(store[key]+(e.deltaY<0?.5:-.5));},{passive:false});
 return {inp,tr,trk};}
const CHF={},RPF={},LWF={};
CHILD.forEach(function(cf){
 CHF[cf.nm]=numField($('chg'),cf.nm,cf.seat,S.charge,cf.nm);
 RPF[cf.nm]=numField($('chg'),'toward '+cf.opp,'Heart',S.replace,cf.nm);
 RPF[cf.nm].inp.parentElement.classList.add('oppf');});
SI.forEach(function(l){LWF[l.nm]=numField($('laws'),l.nm,l.b,S.law,l.nm);});
function syncCh(){CHILD.forEach(function(cf){
 const f=CHF[cf.nm],v=+S.charge[cf.nm]||0;S.charge[cf.nm]=v;
 f.inp.value=v.toFixed(1);f.tr.style.width=(v*10)+'%';f.trk.setAttribute('aria-valuenow',v.toFixed(1));
 const o=RPF[cf.nm],w=+S.replace[cf.nm]||0;S.replace[cf.nm]=w;
 o.inp.value=w.toFixed(1);o.tr.style.width=(w*10)+'%';o.trk.setAttribute('aria-valuenow',w.toFixed(1));});}
function syncLw(){SI.forEach(function(l){
 const f=LWF[l.nm],v=+S.law[l.nm]||0;S.law[l.nm]=v;
 f.inp.value=v.toFixed(1);f.tr.style.width=(v*10)+'%';f.trk.setAttribute('aria-valuenow',v.toFixed(1));});}
$('allCh').addEventListener('input',function(e){toYou();
 CHARGES.forEach(function(c){S.charge[c]=+e.target.value;});syncCh();saveYou();render();});
$('allRep').addEventListener('input',function(e){toYou();
 CHARGES.forEach(function(c){S.replace[c]=+e.target.value;});syncCh();saveYou();render();});
$('allLaw').addEventListener('input',function(e){toYou();
 SINAMES.forEach(function(l){S.law[l]=+e.target.value;});syncLw();saveYou();render();});

/* ---- tabs and depths ---- */
function setTab(i){
 S.tab=i; S.pin=null;
 var cvE=$('cv'), vb=$('vbar');
 TABDEF.forEach(function(T){
  var e=$(T.id); if(!e||T.id==='cv')return;
  e.classList.toggle('on',T.k===i);
  e.style.display=(T.k===i)?'flex':'none';});
 if(cvE) cvE.style.display=(i===TAB.FIELD)?'block':'none';
 if(vb) vb.style.display=(i===TAB.FIELD)?'flex':'none';
 TABDEF.forEach(function(T){document.body.classList.remove(T.cls);});
 document.body.classList.add(TABDEF[i].cls);
 document.body.classList.toggle('hassub',i===TAB.FIELD);
 ['probe','howto','key','tier','pol'].forEach(function(id){
  var e=$(id); if(e)e.style.display=(i===TAB.FIELD)?'':'none';});
 document.querySelectorAll('.tabtop').forEach(function(x,j){x.setAttribute('aria-pressed',j===i);});
 if(i===TAB.STORY)stRender();
 if(i===TAB.SUMMARY)sumRender();
 if(i===TAB.ANALYTICS)anaRender();
 render(); paintSections();}
TABDEF.forEach(function(T,i){
 var b=document.createElement('button');b.className='vt tabtop';b.type='button';
 b.setAttribute('aria-pressed',i===S.tab);
 b.innerHTML='<span class="n">'+T.nm+'</span>';
 b.addEventListener('click',function(){setTab(T.k);});
 $('tabbar').appendChild(b);});
const VICON=[
 '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.6"/>',
 '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 5.2v2.6M7.2 15.4l2.2-1.3M16.8 15.4l-2.2-1.3"/>',
 '<circle cx="12" cy="12" r="9.4"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2.4"/>',
 '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6.4"/><circle cx="12" cy="12" r="2.2"/><path d="M12 2v3.6M12 18.4V22M2 12h3.6M18.4 12H22"/>'];
VIEWS.forEach(function(v,i){
 var b=document.createElement('button');b.className='vt';b.type='button';
 b.setAttribute('aria-pressed',i===S.view);b.title=v.layers;
 b.innerHTML=svgI(VICON[i])+'<span class="n">'+v.nm+'</span>';
 b.addEventListener('click',function(){S.view=i;S.pin=null;
  $('vbar').querySelectorAll('.vt').forEach(function(x,j){x.setAttribute('aria-pressed',j===i);});
  render();});
 $('vbar').appendChild(b);});
[['dark','Dark'],['snow','Snow']].forEach(function(t,i){
 var b=document.createElement('button');b.type='button';
 b.setAttribute('aria-pressed',i===0);b.textContent=t[1];
 b.addEventListener('click',function(){S.theme=t[0];
  document.body.classList.toggle('snow',t[0]==='snow');
  $('themes').querySelectorAll('button').forEach(function(x,j){x.setAttribute('aria-pressed',j===i);});
  rebuildSwatches();render();});
 $('themes').appendChild(b);});
$('legible').addEventListener('click',function(){
 S.legible=!S.legible; document.body.classList.toggle('legible',S.legible);
 this.setAttribute('aria-pressed',S.legible?'true':'false');});

/* ---- the icon grids. the icon carries the colour, selection is a ring. ---- */
DOMAINS.forEach(function(d,i){
 var b=document.createElement('button');b.className='ib';b.type='button';
 b.style.setProperty('--c',ROOTCOL[d.r]);
 b.title=d.nm+', '+d.r+'. '+d.d+'. Shift-click to add.';
 b.setAttribute('aria-label',d.nm+', '+d.r+' cluster');
 b.innerHTML=svgI('<path d="'+d.ic+'"/>')
  +'<span class="rt" style="background:'+ROOTCOL[d.r]+'"></span>';
 b.addEventListener('mouseenter',function(){
  $('capD').innerHTML='<b style="color:'+ROOTCOL[d.r]+'">'+d.r+'</b>, '+d.nm+'. '+d.d;});
 b.addEventListener('mouseleave',capD);
 b.addEventListener('click',function(e){toYou();
  if(e.shiftKey||!S.doms.length){var k=S.doms.indexOf(i);
   if(k>=0){if(S.doms.length>1)S.doms.splice(k,1);}else S.doms.push(i);}
  else S.doms=[i];
  buildSoul();S.pin=null;syncSoul();saveYou();render();});
 $('doms').appendChild(b);});
ROOTD.forEach(function(rn){
 var b=document.createElement('button');b.type='button';b.dataset.r=rn;
 b.className='rootb';b.textContent=rn;b.setAttribute('aria-pressed',false);
 b.style.cssText='flex:1 1 auto;background:transparent;border:1.5px solid var(--edge);'
  +'border-radius:var(--r-xs);padding:8px 6px;font-family:var(--sans);font-size:13px;'
  +'cursor:pointer;color:'+ROOTCOL[rn]+';transition:.18s';
 b.title=rn+'. Holds '+DOMAINS.filter(function(D){return D.r===rn;}).map(function(D){return D.nm;}).join(', ')
  +'. Affinity 1.3 on '+(AFFIN[rn]||[]).join(', ')+'.';
 b.addEventListener('mouseenter',function(){
  $('capD').innerHTML='<b style="color:'+ROOTCOL[rn]+'">'+rn+'</b> root domain. Holds '
   +DOMAINS.filter(function(D){return D.r===rn;}).map(function(D){return D.nm;}).join(', ')+'.';});
 b.addEventListener('mouseleave',capD);
 b.addEventListener('click',function(){toYou();var k=S.roots.indexOf(rn);
  if(k>=0)S.roots.splice(k,1);else S.roots.push(rn);
  b.setAttribute('aria-pressed',k<0);
  b.style.borderColor=k<0?ROOTCOL[rn]:'var(--edge)';
  b.style.boxShadow=k<0?('0 0 0 2px '+ROOTCOL[rn]+'44'):'none';
  buildSoul();S.pin=null;syncSoul();saveYou();render();});
 $('roots').appendChild(b);});
function capD(){
 $('capD').innerHTML=S.doms.map(function(i){
  return '<b style="color:'+ROOTCOL[DOMAINS[i].r]+'">'+DOMAINS[i].nm+'</b>';}).join(' + ')
  +(S.roots.length?'<br>plus all of '+S.roots.join(', '):'');}
[['ar1','a1'],['ar2','a2']].forEach(function(pair){
 ARCH.forEach(function(a,i){
  var b=document.createElement('button');b.className='ib';b.type='button';
  b.style.setProperty('--c','var(--gold)');
  b.title=a.nm+'. '+a.v+'. Shift-click to add.';b.setAttribute('aria-label',a.nm);
  b.innerHTML=svgI('<path d="'+a.ic+'"/>');
  b.addEventListener('mouseenter',function(){$('capA').innerHTML='<b>'+a.nm+'</b>, '+a.v;});
  b.addEventListener('mouseleave',capA);
  b.addEventListener('click',function(e){toYou();
   var k=S.arcs.indexOf(i);
   if(e.shiftKey){if(k>=0){if(S.arcs.length>1)S.arcs.splice(k,1);}else S.arcs.push(i);}
   else if(pair[1]==='a1'){S.arcs=[i].concat(S.arcs.filter(function(x){return x!==i;}).slice(0,3));}
   else {S.arcs=[S.arcs[0]].concat([i]).concat(S.arcs.slice(1).filter(function(x){return x!==i;}).slice(0,2));}
   buildSoul();S.pin=null;syncSoul();saveYou();render();});
  $(pair[0]).appendChild(b);});});
function capA(){$('capA').innerHTML=S.arcs.map(function(i){
 return '<b>'+ARCH[i].nm+'</b>';}).join(' + ');}
function syncSoul(){
 $('doms').querySelectorAll('.ib').forEach(function(x,j){
  x.setAttribute('aria-pressed',j===S.doms[0]);
  if(S.doms.indexOf(j)>0)x.dataset.r='2';else delete x.dataset.r;});
 $('ar1').querySelectorAll('.ib').forEach(function(b,i){
  b.setAttribute('aria-pressed',i===S.arcs[0]);
  if(S.arcs.indexOf(i)>0)b.dataset.r='2';else delete b.dataset.r;});
 $('ar2').querySelectorAll('.ib').forEach(function(b,i){
  b.setAttribute('aria-pressed',false);
  if(S.arcs.indexOf(i)>=1)b.dataset.r='2';else delete b.dataset.r;});
 $('roots').querySelectorAll('button').forEach(function(b){
  var on=S.roots.indexOf(b.dataset.r)>=0;
  b.setAttribute('aria-pressed',on);
  b.style.borderColor=on?ROOTCOL[b.dataset.r]:'var(--edge)';
  b.style.boxShadow=on?('0 0 0 2px '+ROOTCOL[b.dataset.r]+'44'):'none';});
 capD();capA();}
function rebuildSwatches(){
 $('doms').querySelectorAll('.ib').forEach(function(b,i){b.style.setProperty('--c',ROOTCOL[DOMAINS[i].r]);});
 CHILD.forEach(function(cf){
  var i=CHF[cf.nm].inp.parentElement.querySelector('i');if(i)i.style.background=seatCol(cf.seat);});
 SI.forEach(function(l){
  var i=LWF[l.nm].inp.parentElement.querySelector('i');if(i)i.style.background=seatCol(l.b);});
 syncMx();}
