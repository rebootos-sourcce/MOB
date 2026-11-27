/* ============================================================
   A. STRAIN MARKS.

   Tension drawn the way an animator draws it on a character under load:
   short marks off the body, the emanata. Off the address, past the ring.
   Rising load, the marks run outward and taper to a point away from the
   ring. Falling load, they run inward and taper toward it, converging.
   With the motion stopped the taper alone still says which.

   ON TWOS. The marks step at twelve a second while everything else runs at
   sixty. A hot address is the one thing on the ring drawn at a different
   frame rate, which is the Spider-Verse trick: the rate is the signal, and
   the eye finds the odd one out without being told.

   The address itself squashes and stretches. Expanding, it lengthens and
   thins; collapsing, it shortens and widens. Area held, so it has mass.

   Names: a lens round the pointer, 160px, full to 45 percent of the radius
   and smoothstepped to nothing at the edge, per pixel. A long name crossing
   the edge dissolves along its length.
   ============================================================ */
window.VARIANT={id:'A',R:160,lensMode:'pixel',falloff:'smooth',plateau:0.45,
 shape:function(n,G){
  var s=n.Td*n.ds;
  if(Math.abs(s)<0.001)return;
  var d=(n.rO-n.rI)*(1+0.28*s);
  n.rI=n.rO-d; n.hw*=(1-0.14*s);},
 over:function(G){
  var tick=REDUCED?0:Math.floor(G.t*12);
  var fresh=tick!==S.tick; S.tick=tick;
  for(var i=0;i<W.length;i++){var n=W[i],T=n.Td;
   /* the phase runs signed by direction, so a reversal runs the marks back
      the way they came instead of jumping */
   if(!REDUCED)n.a1+=G.dt*(0.9+1.8*Math.abs(T))*n.ds;
   if(fresh)n.a2=n.a1;                         /* held between ticks: on twos */
   if(Math.abs(T)<0.02||n.ea<1)continue;
   /* EXAGGERATED ON PURPOSE. At true scale the first cut read as nothing at
      zoom 1: ten pixel hairs at a third strength. A mark that has to say
      "running hot" from arm's length gets a floor. */
   var mag=(0.45+0.55*Math.abs(T))*(0.35+0.65*Math.abs(n.ds));
   var dir=(n.ds*(T<0?-1:1))>=0?1:-1;          /* the backswing flips it */
   var cnt=3+Math.round(Math.abs(T)*3);
   var span=(12+30*Math.abs(T))*G.sk, len=(8+20*Math.abs(T))*G.sk;
   var col=hotCol(n);
   for(var k=0;k<cnt;k++){
    var p=REDUCED?(k+0.5)/cnt:frac(n.a2+k*0.618);
    var fan=((k+0.5)/cnt-0.5)*n.hw*2.8*(1+0.5*Math.abs(T));
    /* the boil: a hair of jitter per tick, seeded, so the hand is visible
       but the mark does not crawl */
    var j=REDUCED?0:(frac(Math.sin((tick+k*7.1+n.i*3.3))*43758.5)-0.5)*0.006;
    var a=n.aa+fan+j;
    /* one formula both ways: the phase already runs backward when the load
       falls, so the same marks travel inward */
    var r0=n.rO+3+p*span, r1=r0+len;
    var al=Math.sin(Math.PI*clamp(p,0,1))*mag*0.95;
    if(REDUCED)al=mag*0.8;
    var ca=Math.cos(a),sa=Math.sin(a),nx=-sa,ny=ca,wb=(1.2+3.2*Math.abs(T))*Math.min(1.6,G.sk);
    /* a thin wedge, wide at its root and a point at its tip */
    var rb=dir>0?Math.min(r0,r1):Math.max(r0,r1), rt=dir>0?Math.max(r0,r1):Math.min(r0,r1);
    g.beginPath();
    g.moveTo(G.cx+ca*rb+nx*wb/2,G.cy+sa*rb+ny*wb/2);
    g.lineTo(G.cx+ca*rt,G.cy+sa*rt);
    g.lineTo(G.cx+ca*rb-nx*wb/2,G.cy+sa*rb-ny*wb/2);
    g.closePath();g.fillStyle=rgba(col,al);g.fill();}}}};
