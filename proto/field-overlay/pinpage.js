/* THE PAGE AROUND THE PIN. Shared by pin.html and release.html, so the pin,
   the zoom and the pointer rules are one piece of code and cannot drift
   between the two simulations.

   THE POINTER RULES
     mouse   rest on a line and its chain traces and hums. Click it to pin
             the chain, click it again to let it go. Scroll on the Field to
             zoom where the pointer is, drag to move once zoomed in, double
             click an empty spot to open that region or come back out.
     touch   tap a line to hold its chain. Tap it again, or the Pin button
             that appears, to pin it. Pinch to zoom, drag to move once
             zoomed in, double tap to open the region under the finger or
             come back out. Tap an empty spot to let go.
     keys    + and - zoom on the centre, 0 comes back, Escape lets go.

   The Pin button on a phone is there because a tap's second meaning is
   invisible until somebody tells you, and "how do I lock one" was his
   question: the affordance is the answer, printed where the thumb is. */
(function(){
'use strict';
window.PINPAGE=function(cfg){
var X=window.OVL_LIB,E=X.E,clamp=X.clamp;
var WHO=['Sofia','James','Gordon'],WS=[1600,390];
var q=new URLSearchParams(location.search);
var st={who:q.get('who')||'James',w:+(q.get('w')||1600),rm:q.get('rm')==='1'||(!q.get('rm')&&matchMedia('(prefers-reduced-motion:reduce)').matches),
 close:q.get('close')!=null?q.get('close')==='1':!!cfg.close};
var REC=q.get('rec')==='1';
var clock=REC?{t:0,now:function(){return this.t;}}:{now:function(){return performance.now();}};
var $=function(id){return document.getElementById(id);};
var fv=null,ov=null,G=null,lastType='mouse',pendingTap=null,hooks=cfg.hooks||{};
var pill={el:null,want:false,at:-1e9,text:'',kind:'hint',shown:0,warnUntil:-1e9};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function pct(x){return Math.round(x*10)+' percent';}
function group(id,list,lab,key){var g=$(id);if(!g)return;
 list.forEach(function(v){var b=document.createElement('button');b.type='button';b.textContent=lab(v);b.dataset.v=v;
  b.addEventListener('click',function(){st[key]=(typeof st[key]==='number')?+v:v;mount();});g.appendChild(b);});}
function press(){[['g-who','who'],['g-w','w']].forEach(function(x){var g=$(x[0]);if(!g)return;
 g.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.v==String(st[x[1]])));});});}
group('g-who',WHO,function(v){return v;},'who');
group('g-w',WS,function(v){return v+' wide';},'w');
if($('rm')){$('rm').checked=st.rm;$('rm').addEventListener('change',function(){st.rm=this.checked;mount();});}
if($('close')){$('close').checked=st.close;$('close').addEventListener('change',function(){st.close=this.checked;mount();});}
/* ---- names ---- */
function route(l){var P=l.chain.path,N=G.nodes,out=[N[P[0].from].nm];P.forEach(function(x){out.push(N[x.to].nm);});return out;}
function colOf(p){var c=p.path[0].col;return 'rgb('+c.map(Math.round).join(',')+')';}
/* ---- the pointer ---- */
function radius(){return (lastType==='mouse'?9:14)/(fv.s*fv.V.k);}
function pick(ev){var c=fv.toCanvas(ev.clientX,ev.clientY);return ov.hit(c[0],c[1],radius());}
function say(text,kind,ms){pill.text=text;pill.kind=kind;pill.warnUntil=clock.now()+(ms||2400);}
function toggle(l){var now=clock.now(),r=ov.toggle(l,now);
 if(r.op==='full')say('Three are pinned. Let one go to pin another.','warn');
 if(hooks.toggle)hooks.toggle(r,now);renderPins();return r;}
function wire(){
 fv.on('move',function(ev){lastType=ev.pointerType;if(ev.pointerType!=='mouse')return;
  var l=fv.inWin(ev.clientX,ev.clientY)?pick(ev):null;ov.hover(l,clock.now());fv.el.view.classList.toggle('on-line',!!l);});
 fv.on('leave',function(ev){if(ev.pointerType==='mouse'){ov.hover(null,clock.now());fv.el.view.classList.remove('on-line');}});
 fv.on('pan',function(on){fv.el.view.classList.toggle('panning',on);if(on&&lastType==='mouse')ov.hover(null,clock.now());});
 fv.on('tap',function(ev,dbl){lastType=ev.pointerType;var now=clock.now(),l=pick(ev);
  if(ev.pointerType==='mouse'){
   if(l){if(ov.cur!==l)ov.hover(l,now);if(!dbl)toggle(l);}
   else if(dbl)fv.toggleAt(ev.clientX,ev.clientY);
   return;}
  /* touch. A second tap on the held line pins, but waits out the double tap
     window first, so a double tap zooms and does not also pin */
  if(pendingTap){clearTimeout(pendingTap.id);pendingTap=null;}
  if(dbl){fv.toggleAt(ev.clientX,ev.clientY);return;}
  if(l&&l===ov.cur){var held=l;
   if(REC){pendingTap={at:now+320,l:held};}
   else pendingTap={id:setTimeout(function(){pendingTap=null;if(ov.cur===held)toggle(held);},320)};
   return;}
  ov.hover(l||null,now);});
}
/* on a phone there is no leaving, so a tap anywhere off the picture lets go */
document.addEventListener('pointerdown',function(ev){if(ev.pointerType==='mouse'||!fv||fv.el.view.contains(ev.target))return;
 if(hooks.keepHold&&hooks.keepHold(ev))return;ov.hover(null,clock.now());});
addEventListener('keydown',function(ev){
 var t=ev.target&&ev.target.tagName;if(t==='INPUT'||t==='TEXTAREA'||!fv)return;
 var k=ev.key;
 if(k==='+'||k==='='){fv.zoomTo(fv.V.k*1.5,null,null);}
 else if(k==='-'||k==='_'){fv.zoomTo(fv.V.k/1.5,null,null);}
 else if(k==='0'){fv.zoomTo(1,null,null);}
 else if(k==='Escape'){ov.hover(null,clock.now());}});
/* ---- the pill: what pressing does, where the thumb is ---- */
var PINSVG='<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="5.5" cy="8.5" r="3.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.1 5.9 12 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
function makePill(){var p=document.createElement('button');p.type='button';p.className='pill';fv.el.view.appendChild(p);
 p.addEventListener('pointerdown',function(ev){ev.stopPropagation();});
 p.addEventListener('pointerup',function(ev){ev.stopPropagation();});
 p.addEventListener('click',function(ev){ev.stopPropagation();if(ov.cur&&p.classList.contains('btn'))toggle(ov.cur);});
 pill.el=p;}
function paintPill(now){
 var p=pill.el,warn=now<pill.warnUntil,held=ov.cur,heldFor=held?now-(ov.heldAt||now):0;
 var touch=lastType!=='mouse',txt='',kind='hint';
 if(warn){txt=pill.text;kind='warn';}
 else if(held&&(touch||heldFor>300)){var pinned=!!ov.pinFor(held);
  if(touch){txt=pinned?'Let this chain go':'Pin this chain';kind='btn';}
  else txt=pinned?'Click the line to let it go':'Click the line to pin its chain';}
 var want=!!txt;
 if(want!==pill.want){pill.want=want;pill.at=now;}
 if(txt&&(txt!==pill.shown||kind!==pill.kindShown)){p.innerHTML=(kind==='warn'?'':PINSVG)+'<span>'+esc(txt)+'</span>';pill.shown=txt;pill.kindShown=kind;
  p.className='pill'+(kind==='btn'?' btn':'')+(kind==='warn'?' warn':'');}
 var t=now-pill.at,f=st.rm?(want?1:0):(want?E.out(clamp(t/200,0,1)):1-E.in(clamp(t/140,0,1)));
 var wb=fv.wbox;
 /* straddling the window's bottom edge, so it covers as little of the wheel
    as a 44px target can; on a desktop, clear of the edge */
 p.style.top=(wb.y+wb.h-(st.w===390?30:56))+'px';
 p.style.opacity=f.toFixed(3);p.style.visibility=f>0?'visible':'hidden';
 p.style.transform='translateX(-50%) translateY('+((1-f)*8).toFixed(2)+'px)';
 p.style.left=(wb.x+wb.w/2)+'px';
 p.style.pointerEvents=(kind==='btn'&&f>.5)?'auto':'none';}
/* ---- the pinned list ---- */
var pinSig=null;
function renderPins(){var host=$('pins');if(!host||!ov)return;
 var live=ov.live(),sig=live.map(function(p){return p.id+':'+p.label+':'+p.W.toFixed(3);}).join('|');
 if(sig===pinSig)return;pinSig=sig;
 if(hooks.renderPins&&hooks.renderPins(host,live))return;
 if(!live.length){host.innerHTML='<div class="empty">Nothing pinned. '+(lastType==='mouse'?'Rest on a line, then click it.':'Tap a line, then tap Pin.')+'</div>';return;}
 host.innerHTML=live.map(function(p){var r=route(p.line);
  return '<div class="pinrow" data-id="'+p.id+'"><span class="num" style="color:'+colOf(p)+'">'+p.num+'</span>'
   +'<span class="rt">'+esc(r[0])+' to '+esc(r[r.length-1])+'<small>'+esc(r.slice(1,-1).join(', '))+'. Chain weight '+pct(p.W)+'</small></span>'
   +'<button type="button" data-un="'+p.id+'">Unpin</button></div>';}).join('');
 host.querySelectorAll('[data-un]').forEach(function(b){b.addEventListener('click',function(){
  var p=ov.live().filter(function(x){return x.id===+b.dataset.un;})[0];if(p){ov.unpin(p,clock.now());renderPins();}});});
 host.querySelectorAll('.pinrow').forEach(function(row){
  row.addEventListener('mouseenter',function(){var p=ov.live().filter(function(x){return x.id===+row.dataset.id;})[0];if(p)ov.hover(p.line,clock.now());});
  row.addEventListener('mouseleave',function(){ov.hover(null,clock.now());});});}
/* ---- mount ---- */
function availW(){var W=window.innerWidth,side=cfg.sideW||380;
 if(st.w===390)return Math.min(W-32,420);
 return W>=1180?W-32-side-16:W-32;}
function mount(){
 press();var D=window.OV[st.who];G=D.sizes[st.w];
 if($('close-l'))$('close-l').style.display=st.w===1600?'':'none';
 fv=new OVL_FieldView({host:$('host'),who:st.who,w:st.w,clock:clock,reduced:st.rm});
 var lay=fv.layout(availW(),st.close&&st.w===1600);
 var dpr=REC?Math.max(1,lay.s):Math.min(4,Math.max(1,(window.devicePixelRatio||1)*lay.s));
 ov=new OVL_Pin({canvas:fv.el.cv,G:G,reduced:st.rm,dpr:dpr});ov.size(G.cv.w,G.cv.h);
 /* when a chain started being held, for the desktop hint's delay */
 var h0=ov.hover;ov.hover=function(l,now){if(l&&l!==this.cur)this.heldAt=now;return h0.call(this,l,now);};
 fv.on('view',function(V){ov.V=V;});
 if(hooks.mount)hooks.mount(api);
 makePill();wire();pinSig=null;renderPins();
 if($('how'))$('how').textContent=st.w===390?
  'On a phone: tap a line and its whole chain traces and hums. Tap it again, or tap Pin, and the chain stays lit when you let go. Pinch to zoom in, double tap to open the region under your finger, and Whole field to come back.'
  :'Rest the pointer on any line and its whole chain traces, then hums by its charge. Click the line to pin the chain: it goes still and stays lit when you move away. Rest on it again and it traces and hums; click again to let it go. Scroll on the Field to zoom, drag to move, double click an empty spot to open that region.';
 if($('m-who'))$('m-who').textContent=st.who+', '+G.links.length+' connections, build '+D.build.commit;
 if(q.get('title')==='0')document.querySelector('.bar').style.display='none';}
var lastUI=-1e9;
function paint(now){
 if(REC&&pendingTap&&now>=pendingTap.at){var hl=pendingTap.l;pendingTap=null;if(ov.cur===hl)toggle(hl);}
 fv.tick(now);fv.chrome(now);
 var s=ov.frame(now);fv.el.zd.style.opacity=s.dim.toFixed(3);
 paintPill(now);
 if(hooks.frame)hooks.frame(now,s);
 renderPins();
 if(REC||now-lastUI<150)return;lastUI=now;var p=s.probe;
 if($('m-ms'))$('m-ms').textContent=(s.ms||s.last).toFixed(2)+' ms a frame, '+s.lines+(s.lines===1?' line':' lines')+', '+s.pins+' pinned';
 if($('m-z'))$('m-z').textContent=fv.V.k>1.02?fv.V.k.toFixed(2)+' times':'whole field';
 if(!$('m-nm'))return;
 if(!p){['m-ld','m-a','m-ch'].forEach(function(id){$(id).textContent='-';});$('m-nm').textContent='nothing';return;}
 $('m-nm').textContent=p.nm+(p.pinned?', pinned':'');$('m-ld').textContent=pct(p.load);
 $('m-a').textContent=(p.A*fv.V.k*fv.s).toFixed(1)+' px swing on screen, '+p.f.toFixed(1)+' a second';
 $('m-ch').textContent=p.chain+' lines, weight '+pct(p.W);}
var api={st:st,clock:clock,REC:REC,ov:function(){return ov;},fv:function(){return fv;},G:function(){return G;},
 route:route,colOf:colOf,pct:pct,esc:esc,toggle:toggle,mount:mount,say:say,renderPins:function(){pinSig=null;renderPins();}};
mount();
window.__pin=api;
if(REC){
 window.__rec={at:function(ms){clock.t=ms;paint(ms);return ov.stat;},
  set:function(o){for(var k in o)st[k]=o[k];clock.t=0;mount();},
  /* the point along a line furthest from every other line, at the zoom now
     showing, so a pointer set there lands on this line and not a neighbour */
  point:function(i){var l=G.links[i],best=null,bd=-1;
   for(var s=.15;s<=.85;s+=.02){var p=X.at(l.S,s),m=1e9;
    var sc=fv.toScreen(p[0],p[1]),r=fv.el.view.getBoundingClientRect(),wb=fv.wbox;
    if(sc[0]<r.left+wb.x+16||sc[0]>r.left+wb.x+wb.w-16||sc[1]<r.top+wb.y+16||sc[1]>r.top+wb.y+wb.h-16)continue;
    G.links.forEach(function(o){if(o===l)return;var P=o.S.pts;for(var j=1;j<P.length;j++){
     var a=P[j-1],b=P[j],dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L));
     m=Math.min(m,Math.hypot(p[0]-a[0]-dx*t,p[1]-a[1]-dy*t));}});
    if(m>bd){bd=m;best=p;}}
   if(!best)return null;
   var sc2=fv.toScreen(best[0],best[1]);return {x:sc2[0],y:sc2[1],clear:bd*fv.V.k*fv.s,cx:best[0],cy:best[1]};},
  screen:function(x,y){return fv.toScreen(x,y);},
  /* a spot inside the wheel's box at least d canvas px from every line,
     nearest to a wanted share of the box, for a tap that must hit nothing */
  empty:function(fx,fy,d){var best=null,bd=1e9,V=fv.V,W=G.cv.w,H=G.cv.h;
   for(var gx=.08;gx<=.92;gx+=.02)for(var gy=.08;gy<=.92;gy+=.02){
    var x=V.ox+gx*W/V.k,y=V.oy+gy*H/V.k,m=1e9;
    for(var i=0;i<G.links.length&&m>=d;i++){var P=G.links[i].S.pts;for(var j=0;j<P.length;j++){m=Math.min(m,Math.hypot(P[j][0]-x,P[j][1]-y));}}
    if(m<d)continue;var dd=Math.hypot(gx-fx,gy-fy);if(dd<bd){bd=dd;best=[x,y];}}
   if(!best)return null;var sc=fv.toScreen(best[0],best[1]);return {x:sc[0],y:sc[1]};}};
}else{(function loop(){paint(clock.now());requestAnimationFrame(loop);})();}
window.addEventListener('resize',function(){if(!REC)mount();});
return api;};
})();
