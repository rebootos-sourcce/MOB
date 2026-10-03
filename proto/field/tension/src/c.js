/* ============================================================
   C. HEAT.

   Running hot, literally. A hot address shifts its own colour toward white
   as its tension rises and takes the alarm edge at nine, which is where the
   shipped Field already draws it. It glows. And it breathes out or in:

   Expanding, rings leave the address and open outward, the way heat comes
   off a thing. Collapsing, rings arrive from outside and close onto it, a
   sink, so the address reads as pulling the field in. The ring speed is the
   tension; at the turn they slow, stop, and go the other way.

   A run of hot neighbours is drawn as one pressure line round the outside
   of the ring, an isobar, with a heat shimmer in it. That is the "this
   sector is running hot" read at arm's length, before any single address.

   Names: a flashlight. The field outside a 170px circle round the pointer
   falls back by sixty percent, names come up inside on a cosine edge, per
   pixel. The heat is drawn over the dimming, not under it: tension outranks
   focus, so a sector running hot still shows where you are not looking.
   ============================================================ */
window.VARIANT={id:'C',R:170,lensMode:'pixel',falloff:'cos',plateau:0.4,
 wedgeCol:function(n,G){return mixc(n.col,HOTW,clamp(n.Td,0,1)*0.6);},
 shape:function(n,G){
  if(REDUCED||n.Td<0.02)return;
  /* the heat haze, a pixel of wobble at 2.2 a second on the inner edge */
  n.rI+=Math.sin(G.t*14+n.i*1.7)*1.2*n.Td;},
 dim:function(G){
  if(S.lensA<=0.01)return;
  var R=lensR();
  var gr=g.createRadialGradient(S.lx,S.ly,R*0.55,S.lx,S.ly,R*1.35);
  gr.addColorStop(0,'rgba(16,16,16,0)');
  gr.addColorStop(1,'rgba(16,16,16,'+(0.6*S.lensA).toFixed(3)+')');
  g.fillStyle=gr;g.fillRect(0,0,CW,CH);},
 over:function(G){
  var N=W.length, hot=function(n){return n.Td>0.04&&n.ea>=1;};
  /* 1. the isobars. A sector runs hot when hot addresses sit within two
     slots of each other, so a run bridges a gap of one or two cool ones.
     Measured on the first cut: strict neighbours almost never formed a run,
     so the line that was meant to read at arm's length was not there. */
  var hots=[]; for(var i=0;i<N;i++)if(hot(W[i]))hots.push(i);
  if(hots.length){
   var runs=[], cur=[hots[0]];
   for(var h=1;h<hots.length;h++){
    if(hots[h]-hots[h-1]<=3)cur.push(hots[h]); else{runs.push(cur);cur=[hots[h]];}}
   /* the ring closes: the last run joins the first across twelve o'clock */
   if(runs.length&&hots[0]+N-hots[hots.length-1]<=3)runs[0]=cur.concat(runs[0]); else runs.push(cur);
   runs.forEach(function(r){if(r.length>=2)isobar(r.map(function(j){return W[j];}),G);});}
  /* 2. glow and rings per address */
  g.save();g.globalCompositeOperation='lighter';
  for(i=0;i<N;i++){var n=W[i],T=Math.abs(n.Td); if(T<0.02||n.ea<1)continue;
   var col=hotCol(n), mr=(n.rO+n.rI)/2;
   var x=G.cx+Math.cos(n.aa)*mr, y=G.cy+Math.sin(n.aa)*mr;
   var gr=(10+26*T)*G.sk;
   var rg=g.createRadialGradient(x,y,0,x,y,gr);
   rg.addColorStop(0,rgba(col,0.32*T));rg.addColorStop(1,rgba(col,0));
   g.fillStyle=rg;g.beginPath();g.arc(x,y,gr,0,TAU);g.fill();
   /* rings from the ring's own edge. period 1.5s cool to 0.6s hot, signed */
   var P=1.5-0.9*T, s=n.ds;
   if(!REDUCED)n.a1+=G.dt/P*(Math.abs(s)<0.05?0:s>0?(0.3+0.7*s):(-0.3+0.7*s));
   var ox=G.cx+Math.cos(n.aa)*n.rO, oy=G.cy+Math.sin(n.aa)*n.rO, reach=(16+34*T)*G.sk;
   for(var k=0;k<2;k++){
    var p=REDUCED?0.5:frac(n.a1+k*0.5);
    var rr=3+p*reach, al=Math.pow(Math.sin(Math.PI*p),1.2)*0.6*T*(REDUCED?0.8:1);
    g.beginPath();g.arc(ox,oy,rr,0,TAU);g.strokeStyle=rgba(col,al);g.lineWidth=1.3;g.stroke();}}
  g.restore();}};
function isobar(run,G){
 var T=0; run.forEach(function(n){T+=Math.abs(n.Td);}); T/=run.length;
 var a0=run[0].aa-run[0].hw, a1=run[run.length-1].aa+run[run.length-1].hw;
 if(a1<a0)a1+=TAU;
 var col=mixc(run[Math.floor(run.length/2)].col,HOTW,0.35+0.3*T);
 [[6+4*T,1,1.2+2.2*T],[13+9*T,0.5,1]].forEach(function(L,li){
  var base=G.R+L[0]*G.sk, steps=Math.max(6,Math.round((a1-a0)*G.R/4));
  g.beginPath();
  for(var i=0;i<=steps;i++){var a=a0+(a1-a0)*i/steps;
   var r=base+(REDUCED?0:1.3*T*G.sk*Math.sin(a*60+G.t*5+li*2));
   var x=G.cx+Math.cos(a)*r,y=G.cy+Math.sin(a)*r; if(i)g.lineTo(x,y);else g.moveTo(x,y);}
  g.strokeStyle=rgba(col,(0.45+0.5*T)*L[1]);g.lineWidth=L[2];g.lineCap='round';g.stroke();});}
