/* ============================================================
   THE SIX READINGS ON ONE WIRE, round OJ.

   The bars were six unrelated rectangles, and the engine says they are not.
   This file draws the contacts the engine already keeps in compute() and
   draws nothing it does not. It is the structure the bars hang on; the bars
   themselves, their words and their motion are the rest of the menu
   (ui/component.js, rbRow, and ui/railtiles.js).

   THE GUTTER. A wire runs down the dock's left edge, one tap to each bar at
   the bar's own height, so a bar reads as a branch of it. Every segment is a
   formula.
     Decoherence to coherence is the lever. Expression is CQ times what the
     shadow leaves, and the share it takes is drawn on the coherence bar
     itself, as the hatched foot of its fill (rbRow, o.pull). The wire between
     the two rows is the pull's own strength.
     Decoherence to vitality is X. Seventy percent of vitality is what the
     shadow leaves, so the wire from one to the other is DQ over fourteen,
     which is the term in the formula.
     Vitality, awareness and will meet in radiance, the root of their
     squares. The junction under them is that figure, and it is the same
     figure the wash behind the wheel takes its brightness from, so the light
     in the rail and the light on the Field are one number.
   Flow is not on the wire, because nothing feeds it. It is seven seats
   multiplied, root to crown, so its tap stands open and its row draws the
   seven seats as a wave, ui/component.js, rbWave.

   THE PULSES RUN ON THE FIELD'S RATE. pulseRate(r) in ui/wheel.js is the
   shadow layer's own breath. A pulse is a dash of a longer period, as the
   Field's are, so at any moment most of the wire is at rest and a few
   dashes are live. A wire with nothing to carry carries nothing: no shadow
   means no pulse down to vitality, and a record with no lever has a dead
   lever. The speed goes as the root of the strength, which is the Field's
   own law for a wave on a string.

   THE STILL EQUIVALENT. Reduced motion, Quiet and Rm draw no pulse. The wire
   already says it standing still, because its width and brightness are the
   same strength the pulse is driven by.

   RADIANCE moves into its value on the beat the three bars above it do, from
   wherever it had got to, and counts with them.

   WHERE IT STANDS. The gutter and the junction row belong to the column
   beside the stage. Below it the rail stacks under the picture on a phone,
   and the bars are the whole of what is wanted there, so the sheet drops
   both and the bars take the width back.

   COST. The wire is built when a row has moved and never per frame. The
   dashes only ever have a transform and an opacity written, and a write is
   skipped when its value has not changed. Nothing here reads layout in the
   loop: the rectangles are read in rwDress, which render() calls. A throw in
   the frame would end requestAnimationFrame for the session, so each half is
   held, and a failure stops the layer and goes once to the console.
   ============================================================ */
var RW={rad:null,radShown:undefined,radRec:null,geo:null,sig:'',dots:[],clk:0,last:null,on:false,dead:false,seen:false};
var RW_GUT=20;
function rwClamp(v,a,b){return Math.max(a,Math.min(b,v));}
function rwFail(e){RW.dead=true;
 try{console.error('railwire stopped: '+(e&&e.message?e.message:e));}catch(x){}}
/* ---- the radiance figure, and its tween ---- */
function rwRadRow(r){
 var now=performance.now(), rt=r.unread?null:r.radiance, rec=S.who+'|'+(S.rec==null?'':S.rec), q=RW.rad;
 if(!q||rec!==RW.radRec||rt===null||q.b===null){
  var first=!RW.seen&&rt!==null; RW.radRec=rec; RW.seen=RW.seen||rt!==null;
  if(first&&!rbStill()){
   RW.rad={a:0,b:rt,t0:isBooted()?now+4*ENTER_STAGGER:Infinity,dur:ENTER_SPAN,done:false}; RW.radShown=0;
   if(!isBooted())afterBoot(function(){RW.rad.t0=performance.now()+4*ENTER_STAGGER;});}
  else{RW.rad={a:rt,b:rt,t0:now,dur:ENTER_SPAN,done:true}; RW.radShown=rt;}}
 else if(Math.abs(q.b-rt)>0.001){
  RW.rad={a:RW.radShown,b:rt,t0:now,dur:ENTER_SPAN,done:rbStill()}; if(rbStill())RW.radShown=rt;}
 var v=RW.radShown;
 return '<div class="rw-rad" title="Radiance. Vitality, awareness and will combined, the root of their squares. '
  +'It sets how bright the field behind the wheel is."><span>Radiance</span><b>'+(v===null||v===undefined?'–':v.toFixed(2))+'</b></div>';}
function rwRadFrame(){
 var q=RW.rad; if(!q||q.done||q.b===null||q.a===null)return;
 var e=crMoAt(q,performance.now()), v=q.a+(q.b-q.a)*e;
 RW.radShown=v; if(e>=1){q.done=true;RW.radShown=q.b;v=q.b;}
 var b=document.querySelector('#fdock .rw-rad b'); if(b)b.textContent=v.toFixed(2);
 var h=document.querySelector('#fdock .rw-halo'), c=document.querySelector('#fdock .rw-rc');
 if(h)h.style.opacity=(0.12+0.5*v).toFixed(2);
 if(c)c.style.opacity=(0.25+0.75*v).toFixed(2);}
/* ============================================================
   DRESS. Called at the end of render(), after the six rows have been written
   and have taken their motion. The wire lives in the dock and not in either
   strip, so it survives the strips being rewritten; what it rebuilds from is
   the rows' own positions and the readings.
   ============================================================ */
function rwDress(r){
 if(RW.dead)return;
 try{
  var dock=$('fdock'), rows=dock?[].slice.call(dock.querySelectorAll('.rbar')):[];
  var rad=dock&&dock.querySelector('.rw-rad');
  if(rows.length!==6||!rad||!dock.offsetParent){RW.on=false;return;}
  var bus=dock.querySelector('.rw-bus');
  if(!bus){bus=document.createElement('div'); bus.className='rw-bus'; bus.setAttribute('aria-hidden','true');
   dock.insertBefore(bus,dock.firstChild); RW.sig='';}
  if(!bus.offsetWidth){RW.on=false;return;}
  RW.on=true;
  var dr=dock.getBoundingClientRect();
  /* flow is a taller row that holds its wave under its name, so its tap is
     level with the name and not with the middle of the wave */
  var ys=rows.map(function(row,i){var b=row.getBoundingClientRect(); return b.top-dr.top+(i===5?20:b.height/2);});
  var rb=rad.getBoundingClientRect(), yr=rb.top-dr.top+rb.height/2;
  var cols=rows.map(function(row){return row.style.getPropertyValue('--c')||'var(--dim)';});
  var un=!!r.unread, X=r.X, Y=r.Y, Z=r.Z;
  /* strengths, each the term the engine multiplies by */
  var sPull=un?0:rwClamp(Math.sqrt(r.PULL/0.54),0,1), sDrain=un?0:rwClamp(r.DQ/14,0,1),
   sX=un?0:X, sXY=un?0:Math.sqrt((X*X+Y*Y)/2), sR=un?0:r.radiance;
  var sig=[ys.map(Math.round).join(','),Math.round(yr),Math.round(dr.height),
   [sPull,sDrain,sX,sXY,sR].map(function(v){return Math.round(v*20);}).join(','),cols.join('|'),un?1:0].join('/');
  RW.geo={ys:ys,yr:yr,sPull:sPull,sDrain:sDrain,sX:sX,sY:un?0:Y,sZ:un?0:Z};
  if(sig===RW.sig&&bus.firstChild)return;
  RW.sig=sig;
  function seg(y0,y1,s){var o=0.16+0.7*s, w=1.2+1.6*s;
   return '<path class="rw-w" d="M7 '+y0.toFixed(1)+'V'+y1.toFixed(1)+'"/>'
    +'<path class="rw-ws" d="M7 '+y0.toFixed(1)+'V'+y1.toFixed(1)+'" style="opacity:'+o.toFixed(2)
    +';stroke-width:'+w.toFixed(2)+'"/>';}
  var rv=RW.radShown, h='<svg width="'+RW_GUT+'" height="'+dr.height.toFixed(1)+'" viewBox="0 0 '+RW_GUT+' '+dr.height.toFixed(1)+'">'
   +seg(ys[0],ys[1],sPull)+seg(ys[1],ys[2],sDrain)+seg(ys[2],ys[3],sX)+seg(ys[3],ys[4],sXY)+seg(ys[4],yr,sR);
  /* the taps: each a short branch from the wire to the start of its bar */
  rows.forEach(function(row,i){
   h+='<path class="rw-tap" d="M7 '+ys[i].toFixed(1)+'H'+RW_GUT+'"/>'
    +'<circle class="rw-n" cx="7" cy="'+ys[i].toFixed(1)+'" r="3.2" style="stroke:'+cols[i]+'"/>';});
  /* radiance: a larger node whose glow is the figure */
  h+='<circle class="rw-halo" cx="7" cy="'+yr.toFixed(1)+'" r="9" style="opacity:'+(un||rv==null?0:(0.12+0.5*rv).toFixed(2))+'"/>'
   +'<circle class="rw-rn" cx="7" cy="'+yr.toFixed(1)+'" r="4.6"/>'
   +'<circle class="rw-rc" cx="7" cy="'+yr.toFixed(1)+'" r="2" style="opacity:'+(un||rv==null?0:(0.25+0.75*rv).toFixed(2))+'"/></svg>';
  bus.innerHTML=h;
  /* five dashes on the wire, made once per rebuild */
  var spec=[['pull',0],['drain',.35],['x',.1],['y',.45],['z',.8]];
  RW.dots=spec.map(function(s){var d=document.createElement('i'); d.className='rw-p'; bus.appendChild(d);
   return {el:d,k:s[0],ph:s[1],last:''};});
  /* a wire that arrives with the bars and not before them */
  if(!bus.classList.contains('in')){
   var on=function(){requestAnimationFrame(function(){bus.classList.add('in');});};
   if(isBooted())on(); else afterBoot(on);}
 }catch(e){rwFail(e);}}
/* ============================================================
   THE FRAME. Called from the loop on the Field only. It advances the clock at
   the Field's own rate and moves the dashes along their wires. Nothing here
   touches layout.
   ============================================================ */
function rwDot(d,x,y,a,horiz){
 var key=x.toFixed(1)+'|'+y.toFixed(1)+'|'+a.toFixed(2);
 if(d.last===key)return; d.last=key;
 d.el.style.opacity=a?a.toFixed(2):'0';
 d.el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'+(horiz?' rotate(90deg)':'');}
function rwFrame(r){
 if(RW.dead)return;
 try{
  rwRadFrame();
  if(!RW.on||!RW.geo||rbStill())return;
  var t=S.t, step=(RW.last===null||t<RW.last)?0:(t-RW.last); RW.last=t;
  var rate=pulseRate(r); RW.clk+=step*rate;
  var G=RW.geo, ys=G.ys;
  /* each path is a run down or up the one vertical, [from y, to y, strength] */
  var P={pull:[ys[1],ys[0],G.sPull],drain:[ys[1],ys[2],G.sDrain],
   x:[ys[2],G.yr,G.sX],y:[ys[3],G.yr,G.sY],z:[ys[4],G.yr,G.sZ]};
  RW.dots.forEach(function(d){
   var p=P[d.k], s=p[2], len=Math.abs(p[1]-p[0]);
   if(s<=0.02||len<6){rwDot(d,0,0,0,0);return;}
   /* the Field's own law: a wave on a string goes as the square root of its
      tension, so the strength is the tension here and the speed is its root */
   var v=14+60*Math.sqrt(s), per=len*1.7, u=(RW.clk*v+d.ph*per)%per;
   if(u>len){rwDot(d,0,0,0,0);return;}
   var y=p[0]+(p[1]>p[0]?u:-u);
   rwDot(d,7,y,0.3+0.7*s,0);});
 }catch(e){rwFail(e);}}
