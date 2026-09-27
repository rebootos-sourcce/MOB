/* ============================================================
   B. TAUT WIRE.

   Every hot address is held to the core by a wire, and the wire is under
   the load. It reads the way a plucked string reads to the eye: a bright
   centre line and a soft envelope either side, widest in the middle and
   pinned at both ends. The envelope is the tension. A string pulled harder
   buzzes faster, as the square root, which is the same law the shipped
   pulse threads already use (wheel.js, "THE TENSION RUNS").

   Expanding, the address is pushed outward along its radius, the wire
   thins as it stretches and its pulses run out from the core. Collapsing,
   the address is pulled in, the wire thickens and the pulses run home.

   Names: a loupe. Wider, 220px, a gaussian with no flat top, so the name
   under the pointer is the brightest and slightly the largest, and every
   address inside it carries its figure, hot or not. A soft ground under the
   words keeps them off the wires.
   ============================================================ */
window.VARIANT={id:'B',R:220,lensMode:'word',falloff:'gauss',plateau:0,allValues:true,scaleWords:0.12,
 shape:function(n,G){
  var push=n.Td*n.ds*G.U*0.018;
  n.rO+=push; n.rI+=push;},
 under:function(G){
  g.save();g.lineCap='round';
  for(var i=0;i<W.length;i++){var n=W[i],T=Math.abs(n.Td);
   if(T<0.02||n.ea<1)continue;
   var s=n.ds, col=hotCol(n);
   var ca=Math.cos(n.aa),sa=Math.sin(n.aa),nx=-sa,ny=ca;
   /* the wire runs up to the name and stops, so a named address wears its
      name like a tag on the end of the cable. The first cut ran the wire
      straight through the word, because both sit on the same radius. */
   var r0=G.coreR*1.12, na=smooth((n.nameA||0)*2.5);
   /* and it stops short of the figure too, which every hot address carries */
   var ra=n.ra||(n.rI-6), r1=ra-30;
   if(na>0)r1=r1+((ra-(n.tw||60))-r1)*na;
   if(r1<=r0+4)continue;
   var x0=G.cx+ca*r0,y0=G.cy+sa*r0,x1=G.cx+ca*r1,y1=G.cy+sa*r1;
   /* the envelope. its shimmer is 1.7 a second, slow enough to see, and it
      is the only part of the wire that moves under reduced motion: not at all */
   var A=(1.2+4.5*T)*G.sk*0.8*(REDUCED?1:(0.82+0.18*Math.sin(TAU*1.7*G.t+n.i)));
   g.beginPath();
   for(var k=0;k<=14;k++){var f=k/14,w=A*Math.sin(Math.PI*f);
    var px=x0+(x1-x0)*f+nx*w,py=y0+(y1-y0)*f+ny*w; if(k)g.lineTo(px,py);else g.moveTo(px,py);}
   for(k=14;k>=0;k--){f=k/14;w=A*Math.sin(Math.PI*f);
    g.lineTo(x0+(x1-x0)*f-nx*w,y0+(y1-y0)*f-ny*w);}
   g.closePath();g.fillStyle=rgba(col,0.08+0.16*T);g.fill();
   /* the string, caught at an instant. 6 to 14 buzzes a second on the
      square root of tension, under the 30 a 60Hz screen can show */
   var hz=6+8*Math.sqrt(T), ph=REDUCED?0:Math.sin(TAU*hz*G.t+n.i*1.3);
   var wd=clamp(1.1-0.5*T*s,0.6,2.6);
   g.beginPath();
   for(k=0;k<=14;k++){f=k/14;w=A*0.75*Math.sin(Math.PI*f)*ph;
    var qx=x0+(x1-x0)*f+nx*w,qy=y0+(y1-y0)*f+ny*w; if(k)g.lineTo(qx,qy);else g.moveTo(qx,qy);}
   g.strokeStyle=rgba(mixc(col,[255,255,255],.2),0.35+0.5*T);g.lineWidth=wd;g.stroke();
   /* the pulses, along the rest line. signed phase, so a reversal runs them
      back rather than restarting them */
   if(!REDUCED){
    var per=(56-24*T)*G.sk*0.8, sp=(20+60*Math.sqrt(T))*G.sk;
    n.a1+=G.dt*sp*s;
    g.setLineDash([5,per-5]);g.lineDashOffset=-n.a1;
    g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);
    g.strokeStyle=rgba([255,255,255],(0.25+0.6*T)*Math.min(1,Math.abs(s)*1.5));
    g.lineWidth=wd+0.8;g.stroke();g.setLineDash([]);}}
  g.restore();},
 dim:function(G){
  if(S.lensA<=0.01)return;
  var gr=g.createRadialGradient(S.lx,S.ly,0,S.lx,S.ly,lensR()*1.1);
  gr.addColorStop(0,'rgba(16,16,16,'+(0.42*S.lensA).toFixed(3)+')');
  gr.addColorStop(0.6,'rgba(16,16,16,'+(0.22*S.lensA).toFixed(3)+')');
  gr.addColorStop(1,'rgba(16,16,16,0)');
  g.fillStyle=gr;g.beginPath();g.arc(S.lx,S.ly,lensR()*1.1,0,TAU);g.fill();},
 lensMark:function(G){
  if(S.lensA<=0.01)return;
  g.beginPath();g.arc(S.lx,S.ly,lensR(),0,TAU);
  g.strokeStyle=rgba(INK,0.08*S.lensA);g.lineWidth=1;g.stroke();}};
