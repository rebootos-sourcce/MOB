/* ============================================================
   THE FIELD VIEW, WITH ZOOM. DB in TASKS.md, 26 September.

   His words: "I'm really not certain what's happening at 390 wide... can I
   zoom in, like I can't zoom in, I think that's the problem."

   WHAT THE SHIPPED FIELD DOES TODAY, measured before building. On a desktop
   it zooms: the scroll wheel, the + and - keys, a drag to pan, F or a double
   click to come back (ui/ui.js, setZoom). On a phone it does not zoom at all.
   There is no pinch handler, and the canvas carries touch-action pan-y on a
   coarse pointer (head.html), which is the one value that also forbids the
   browser's own pinch. So at 390, where the lines sit 2 pixels apart, the
   one gesture a person reaches for is switched off. That is the defect.

   THE PRECEDENT, from the Body page (CK). Tapping Crown or 3rd Eye opens the
   head at full size with the rest dimmed and a "whole body" button to come
   back. The Field gets the same shape: a double tap opens the region under
   the finger, and a "Whole field" button brings it back. Plus the gestures a
   phone already teaches: pinch, and a drag to move once zoomed in.

   ONLY THE FIELD ZOOMS. The rest of the page stays put, the way the shipped
   canvas zooms inside its own box. The zoomed picture is the Field's own
   canvas shot again at 4 device pixels to the pixel on a phone and 3 on a
   desktop (capture-zoom.js), so four times in it is still sharp, and the
   overlay is drawn in vector at whatever zoom is showing.

   THE NUMBERS
     double tap, or the button     380ms on the arriving curve, in log space
                                   so each doubling takes the same time
     rubber band past the limits   the overshoot is paid at a third of the
                                   rate, and settles back in 260ms
     a flick when panning          glides on, decaying with a 325ms time
                                   constant, which is the scroll feel a
                                   phone already has
     limits                        1 to 4 at 390, 1 to 3 at 1600
     double tap lands at           2.5 at 390, 2 at 1600

   Reduced motion: every zoom jumps to its end state. The pinch and the drag
   are direct manipulation and follow the fingers either way, since nothing
   moves that the person is not moving.
   ============================================================ */
(function(){
'use strict';
var X=window.OVL_LIB,E=X.E,clamp=X.clamp;
var ZT=380,SNAP=260,FLICK_TAU=325,DT_MS=320,DT_PX=28;

function FieldView(o){
 this.o=o;this.clock=o.clock;this.who=o.who;this.w=o.w;
 var D=window.OV[o.who];this.D=D;this.G=D.sizes[o.w];
 this.KMAX=o.w===1600?3:4;this.KTAP=o.w===1600?2:2.5;
 this.V={k:1,ox:0,oy:0};this.anim=null;this.glide=null;
 this.ptr={};this.gest=null;this.lastTap=null;this.listeners={};
 this.build();}
FieldView.prototype.on=function(ev,fn){(this.listeners[ev]=this.listeners[ev]||[]).push(fn);};
FieldView.prototype.emit=function(ev,a,b,c){(this.listeners[ev]||[]).forEach(function(f){f(a,b,c);});};
FieldView.prototype.build=function(){
 var o=this.o,G=this.G,tag=o.who.toLowerCase()+'-'+o.w,self=this;
 var pw=o.w,ph=o.w===1600?1000:844;
 var host=o.host;host.innerHTML='';
 var view=document.createElement('div');view.className='fv-view';
 var plate=document.createElement('div');plate.className='fv-plate';
 plate.style.width=pw+'px';plate.style.height=ph+'px';
 var img=document.createElement('img');img.src='plates/'+tag+'-ship.png';img.alt='';img.className='fv-full';
 var win=document.createElement('div');win.className='fv-win';
 win.style.left=G.cv.x+'px';win.style.top=G.cv.y+'px';win.style.width=G.cv.w+'px';win.style.height=G.cv.h+'px';
 var zl=document.createElement('div');zl.className='fv-zl';zl.style.width=G.cv.w+'px';zl.style.height=G.cv.h+'px';
 var zs=document.createElement('img');zs.src='plates/'+tag+'-zship.webp';zs.alt='';
 var zd=document.createElement('img');zd.src='plates/'+tag+'-zdim.webp';zd.alt='';zd.style.opacity='0';
 [zs,zd].forEach(function(i){i.style.width=G.cv.w+'px';i.style.height=G.cv.h+'px';});
 zl.appendChild(zs);zl.appendChild(zd);
 var cv=document.createElement('canvas');cv.className='fv-ov';
 win.appendChild(zl);win.appendChild(cv);
 plate.appendChild(img);plate.appendChild(win);view.appendChild(plate);
 /* the way back, in the page's own coordinates rather than the plate's, so
    it stays a real 44 pixel target however far the plate is scaled */
 var whole=document.createElement('button');whole.type='button';whole.className='fv-whole';
 whole.textContent='Whole field';whole.setAttribute('aria-hidden','true');whole.tabIndex=-1;
 view.appendChild(whole);
 var zk=document.createElement('div');zk.className='fv-zk';view.appendChild(zk);
 host.appendChild(view);
 this.el={view:view,plate:plate,win:win,zl:zl,zs:zs,zd:zd,cv:cv,whole:whole,zk:zk,img:img};
 whole.addEventListener('click',function(ev){ev.stopPropagation();self.zoomTo(1,null,null);});
 this.wire();};
/* the plate's own scale on this screen, and where the window sits */
FieldView.prototype.layout=function(availW,close){
 var G=this.G,pw=this.o.w,ph=this.o.w===1600?1000:844,s,vx=0,vy=0,vw,vh;
 if(close){s=Math.min(availW,this.o.w===1600?760:520)/G.cv.w;vx=G.cv.x;vy=G.cv.y;vw=G.cv.w*s;vh=G.cv.h*s;}
 else{s=Math.min(1,availW/pw);vw=pw*s;vh=ph*s;}
 this.s=s;this.vx=vx;this.vy=vy;
 var v=this.el.view;v.style.width=vw+'px';v.style.height=vh+'px';
 this.el.plate.style.transform='scale('+s+') translate('+(-vx)+'px,'+(-vy)+'px)';
 /* the way back sits at the window's upper right and the readout at its
    upper left, in page px, clear of the Pin button, which takes the bottom
    edge because that is where a thumb already is */
 var wx=(G.cv.x-vx)*s,wy=(G.cv.y-vy)*s,ww=G.cv.w*s,wh=G.cv.h*s;
 this.wbox={x:wx,y:wy,w:ww,h:wh};
 this.el.whole.style.right=Math.max(8,vw-(wx+ww)+8)+'px';this.el.whole.style.top=(wy+8)+'px';
 this.el.zk.style.left=(wx+10)+'px';this.el.zk.style.top=(wy+20)+'px';
 return {vw:vw,vh:vh,s:s};};
/* ---- coordinates. screen, then the window in plate px, then the canvas ---- */
FieldView.prototype.toWin=function(cx,cy){var r=this.el.view.getBoundingClientRect(),G=this.G;
 return [(cx-r.left)/this.s+this.vx-G.cv.x,(cy-r.top)/this.s+this.vy-G.cv.y];};
FieldView.prototype.toCanvas=function(cx,cy){var w=this.toWin(cx,cy),V=this.V;return [w[0]/V.k+V.ox,w[1]/V.k+V.oy];};
FieldView.prototype.toScreen=function(x,y){var r=this.el.view.getBoundingClientRect(),G=this.G,V=this.V;
 var wx=(x-V.ox)*V.k,wy=(y-V.oy)*V.k;return [r.left+(wx+G.cv.x-this.vx)*this.s,r.top+(wy+G.cv.y-this.vy)*this.s];};
/* where a canvas point sits inside the view element, for DOM laid over it */
FieldView.prototype.toView=function(x,y){var G=this.G,V=this.V;
 return [((x-V.ox)*V.k+G.cv.x-this.vx)*this.s,((y-V.oy)*V.k+G.cv.y-this.vy)*this.s];};
FieldView.prototype.inWin=function(cx,cy){var w=this.toWin(cx,cy);return w[0]>=0&&w[1]>=0&&w[0]<=this.G.cv.w&&w[1]<=this.G.cv.h;};
/* ---- the limits, hard and soft ---- */
FieldView.prototype.clampO=function(k,ox,oy,soft){
 var W=this.G.cv.w,H=this.G.cv.h,mx=W-W/k,my=H-H/k;
 function band(v,lo,hi){if(!soft)return clamp(v,lo,hi);
  /* past an edge the pan is paid at a third, the rubber band */
  if(v<lo)return lo-(lo-v)/3;if(v>hi)return hi+(v-hi)/3;return v;}
 return [band(ox,0,Math.max(0,mx)),band(oy,0,Math.max(0,my))];};
FieldView.prototype.softK=function(k){var M=this.KMAX;
 if(k>M)return M*Math.pow(k/M,.3);if(k<1)return Math.pow(k,.3);return k;};
/* set the view with the canvas point c held under the window point w */
FieldView.prototype.hold=function(k,c,w,soft){
 var ox=c[0]-w[0]/k,oy=c[1]-w[1]/k,o=this.clampO(k,ox,oy,soft);
 this.V={k:k,ox:o[0],oy:o[1]};};
FieldView.prototype.apply=function(){
 var V=this.V;this.el.zl.style.transform='scale('+V.k+') translate('+(-V.ox)+'px,'+(-V.oy)+'px)';
 var zoomed=V.k>1.02;
 if(zoomed!==this.zoomed){this.zoomed=zoomed;this.wholeAt=this.clock.now();}
 this.el.whole.classList.toggle('on',zoomed);this.el.whole.tabIndex=zoomed?0:-1;
 this.el.whole.setAttribute('aria-hidden',String(!zoomed));
 this.el.zk.textContent=V.k>1.02?V.k.toFixed(1)+' times':'';
 this.emit('view',V);};
/* ---- the animated moves: the double tap, the button, the settle ---- */
FieldView.prototype.zoomTo=function(k2,cx,cy){
 var now=this.clock.now(),V=this.V,G=this.G;
 k2=clamp(k2,1,this.KMAX);
 /* the anchor: the tapped point, or for the way back the window's centre */
 var w=cx==null?[G.cv.w/2,G.cv.h/2]:this.toWin(cx,cy),c=[w[0]/V.k+V.ox,w[1]/V.k+V.oy];
 /* land with the tapped point at the window's centre when going in, the way
    the head view opens centred on the seat that was tapped */
 var endW=k2>V.k?[G.cv.w/2,G.cv.h/2]:w;
 var o2=this.clampO(k2,c[0]-endW[0]/k2,c[1]-endW[1]/k2,false);
 this.glide=null;
 if(this.o.reduced){this.V={k:k2,ox:o2[0],oy:o2[1]};this.apply();return;}
 this.anim={t0:now,d:ZT,from:{k:V.k,ox:V.ox,oy:V.oy},to:{k:k2,ox:o2[0],oy:o2[1]},curve:E.out};};
FieldView.prototype.settle=function(){
 var V=this.V,k=clamp(V.k,1,this.KMAX),G=this.G;
 var cw=[G.cv.w/2,G.cv.h/2],c=[cw[0]/V.k+V.ox,cw[1]/V.k+V.oy];
 var o=this.clampO(k,c[0]-cw[0]/k,c[1]-cw[1]/k,false);
 if(Math.abs(k-V.k)<1e-3&&Math.abs(o[0]-V.ox)<.05&&Math.abs(o[1]-V.oy)<.05)return;
 if(this.o.reduced){this.V={k:k,ox:o[0],oy:o[1]};this.apply();return;}
 this.anim={t0:this.clock.now(),d:SNAP,from:{k:V.k,ox:V.ox,oy:V.oy},to:{k:k,ox:o[0],oy:o[1]},curve:E.out};};
/* one step of whatever is moving, called by the page's frame */
FieldView.prototype.tick=function(now){
 var a=this.anim;
 if(a){var f=a.curve(clamp((now-a.t0)/a.d,0,1));
  /* scale in log space, and the offset through the point both frames agree
     on, so the picture does not slide sideways while it grows */
  var k=Math.exp(Math.log(a.from.k)+(Math.log(a.to.k)-Math.log(a.from.k))*f);
  var G=this.G,cw=[G.cv.w/2,G.cv.h/2];
  var c0=[cw[0]/a.from.k+a.from.ox,cw[1]/a.from.k+a.from.oy],c1=[cw[0]/a.to.k+a.to.ox,cw[1]/a.to.k+a.to.oy];
  var c=[c0[0]+(c1[0]-c0[0])*f,c0[1]+(c1[1]-c0[1])*f];
  this.V={k:k,ox:c[0]-cw[0]/k,oy:c[1]-cw[1]/k};
  if(now-a.t0>=a.d){this.V={k:a.to.k,ox:a.to.ox,oy:a.to.oy};this.anim=null;}
  this.apply();return true;}
 var gl=this.glide;
 if(gl){var dt=now-gl.t;gl.t=now;var d=Math.exp(-dt/FLICK_TAU);
  gl.vx*=d;gl.vy*=d;var V=this.V,o=this.clampO(V.k,V.ox-gl.vx*dt/V.k,V.oy-gl.vy*dt/V.k,false);
  var hit=o[0]!==V.ox-gl.vx*dt/V.k||o[1]!==V.oy-gl.vy*dt/V.k;
  this.V={k:V.k,ox:o[0],oy:o[1]};
  if(hit||Math.hypot(gl.vx,gl.vy)<.02)this.glide=null;
  this.apply();return true;}
 return false;};
/* ---- the gestures ---- */
FieldView.prototype.wire=function(){
 var self=this,view=this.el.view;
 view.addEventListener('wheel',function(ev){
  if(!self.inWin(ev.clientX,ev.clientY))return;
  ev.preventDefault();self.anim=null;self.glide=null;
  var V=self.V,w=self.toWin(ev.clientX,ev.clientY),c=[w[0]/V.k+V.ox,w[1]/V.k+V.oy];
  var dy=ev.deltaMode===1?ev.deltaY*16:ev.deltaY;
  self.hold(clamp(V.k*Math.exp(-dy*.0022),1,self.KMAX),c,w,false);self.apply();},{passive:false});
 view.addEventListener('pointerdown',function(ev){
  if(ev.target===self.el.whole||!self.inWin(ev.clientX,ev.clientY))return;
  self.anim=null;self.glide=null;
  self.ptr[ev.pointerId]={x:ev.clientX,y:ev.clientY,x0:ev.clientX,y0:ev.clientY,t0:self.clock.now(),type:ev.pointerType,hist:[]};
  try{view.setPointerCapture(ev.pointerId);}catch(e){}
  var ids=Object.keys(self.ptr);
  if(ids.length===2){var a=self.ptr[ids[0]],b=self.ptr[ids[1]],V=self.V;
   var m=[(a.x+b.x)/2,(a.y+b.y)/2],w=self.toWin(m[0],m[1]);
   self.gest={kind:'pinch',d0:Math.hypot(a.x-b.x,a.y-b.y)||1,k0:V.k,c:[w[0]/V.k+V.ox,w[1]/V.k+V.oy]};
   self.lastTap=null;}
  else self.gest={kind:'press',id:ev.pointerId};});
 view.addEventListener('pointermove',function(ev){
  var p=self.ptr[ev.pointerId];
  if(!p){self.emit('move',ev);return;}
  p.x=ev.clientX;p.y=ev.clientY;p.hist.push([self.clock.now(),p.x,p.y]);if(p.hist.length>6)p.hist.shift();
  var g=self.gest;if(!g){self.emit('move',ev);return;}
  if(g.kind==='pinch'){var ids=Object.keys(self.ptr);if(ids.length<2)return;
   var a=self.ptr[ids[0]],b=self.ptr[ids[1]],d=Math.hypot(a.x-b.x,a.y-b.y)||1,m=[(a.x+b.x)/2,(a.y+b.y)/2];
   self.hold(self.softK(g.k0*d/g.d0),g.c,self.toWin(m[0],m[1]),true);self.apply();return;}
  var moved=Math.hypot(p.x-p.x0,p.y-p.y0)>(p.type==='mouse'?4:8);
  if(g.kind==='press'&&moved&&self.V.k>1.02){var V=self.V,w=self.toWin(p.x0,p.y0);
   g.kind='pan';g.c=[w[0]/V.k+V.ox,w[1]/V.k+V.oy];self.emit('pan',true);}
  else if(g.kind==='press'&&moved){g.kind='drift';}
  if(g.kind==='pan'){self.hold(self.V.k,g.c,self.toWin(p.x,p.y),true);self.apply();return;}
  self.emit('move',ev);});
 function up(ev){
  var p=self.ptr[ev.pointerId];if(!p)return;
  delete self.ptr[ev.pointerId];
  var g=self.gest,left=Object.keys(self.ptr).length;
  if(g&&g.kind==='pinch'){if(left===0){self.gest=null;self.settle();}return;}
  self.gest=null;
  if(g&&g.kind==='pan'){self.emit('pan',false);
   /* a flick keeps going, measured over the last 80ms of the drag */
   var h=p.hist,now=self.clock.now(),first=null;
   for(var i=0;i<h.length;i++)if(now-h[i][0]<=80){first=h[i];break;}
   var V=self.V,o=self.clampO(V.k,V.ox,V.oy,false),out=Math.abs(o[0]-V.ox)>.05||Math.abs(o[1]-V.oy)>.05;
   if(out)self.settle();
   else if(first&&!self.o.reduced&&now-first[0]>8){var vx=(p.x-first[1])/(now-first[0])/self.s,vy=(p.y-first[2])/(now-first[0])/self.s;
    if(Math.hypot(vx,vy)>.25)self.glide={vx:vx,vy:vy,t:now};}
   return;}
  if(g&&g.kind==='drift')return;
  /* a tap. two within 320ms and 28px of each other are a double tap */
  var now2=self.clock.now(),lt=self.lastTap;
  var dbl=lt&&now2-lt.t<DT_MS&&Math.hypot(ev.clientX-lt.x,ev.clientY-lt.y)<DT_PX;
  self.lastTap=dbl?null:{t:now2,x:ev.clientX,y:ev.clientY};
  self.emit('tap',ev,!!dbl);}
 view.addEventListener('pointerup',up);
 view.addEventListener('pointercancel',function(ev){delete self.ptr[ev.pointerId];self.gest=null;self.settle();});
 view.addEventListener('pointerleave',function(ev){if(!self.ptr[ev.pointerId])self.emit('leave',ev);});};
/* the way back arrives on the page's clock and not a CSS transition, so a
   recording stepped one frame at a time shows it at its true 180ms. It rises
   6px as it comes, and leaves in 140ms on the leaving curve. */
FieldView.prototype.chrome=function(now){
 var t=now-(this.wholeAt||-1e9),f=this.o.reduced?(this.zoomed?1:0):
  (this.zoomed?E.out(clamp(t/180,0,1)):1-E.in(clamp(t/140,0,1)));
 var b=this.el.whole;b.style.opacity=f.toFixed(3);b.style.transform='translateY('+((1-f)*6).toFixed(2)+'px)';
 b.style.visibility=f>0?'visible':'hidden';};
/* the double tap: into the region under the finger, or back out */
FieldView.prototype.toggleAt=function(cx,cy){
 if(this.V.k>1.3)this.zoomTo(1,null,null);else this.zoomTo(this.KTAP,cx,cy);};
window.OVL_FieldView=FieldView;
})();
