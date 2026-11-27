/* ============================================================
   D. STRESS FRINGES, AND THE TWO REASONS FOR A NAME.

   The ring is a membrane and the load deforms it. Expanding, the shell
   bulges out at that address; collapsing, it dents in. The deformation
   spreads to the neighbours on a gaussian and settles on an underdamped
   spring, so it arrives past its mark and comes back, which is follow
   through: the ring has mass.

   Outside the ring, stress fringes, the bands a photoelastic model shows
   under load. They tighten where the stress is highest, and they are born
   at the ring and travel out while the load rises, then sink back into it
   while it falls, which is what the real material does as you load and
   unload it. With the labels off the fringes alone say where and which way.

   THE OPEN QUESTION, ON A SWITCH. A name can appear for two reasons: its
   charge, which is how the Field works today (wheel.js:821, a name at a
   load of six once zoom passes 2.05), and where the pointer is, which is
   what he asked for. This mockup keeps both and puts the rule for who wins
   on four buttons. It does not pick one; that is his call.
   ============================================================ */
var POLICIES=[
 {k:'shipped',nm:'By charge, as today'},
 {k:'pointer',nm:'By pointer only'},
 {k:'add',nm:'Charge, plus pointer'},
 {k:'lead',nm:'Pointer leads, charge dims'}];
window.VARIANT={id:'D',R:190,lensMode:'word',falloff:'smooth',plateau:0.35,policy:'add',
 nameAlpha:function(n,fn){
  var ch=(n.v>=6?fn:0), ln=n.lab;
  switch(S.policy){
   case 'shipped': return ch;
   case 'pointer': return ln;
   case 'lead': return Math.max(ln,ch*0.35*(1-ln));
   default: return Math.max(ln,ch);}},
 step:function(dt){
  var N=W.length, u=U();
  for(var i=0;i<N;i++){var def=0,str=0;
   for(var j=-7;j<=7;j++){var m=W[(i+j+N)%N],k=Math.exp(-(j*j)/(2*2.2*2.2));
    def+=k*m.Td*m.ds; str+=k*Math.abs(m.Td);}
   var n=W[i]; n.def=clamp(def,-1.4,1.4); n.str=clamp(str/1.6,0,1);
   var tgt=n.def*u*0.06;
   if(REDUCED){n.a2=tgt;n.a3=0;}
   else{
    /* w 14, damping .42: about a fifth past the mark, back in half a second */
    var sub=Math.max(1,Math.ceil(dt/(1/120))), sd=dt/sub;
    for(var s=0;s<sub;s++){var acc=196*(tgt-n.a2)-2*0.42*14*n.a3;n.a3+=acc*sd;n.a2+=n.a3*sd;}
    n.a1+=dt*0.9*n.def;}}},
 shape:function(n,G){var d=(n.a2||0)*(n.ea);n.rO+=d;n.rI+=d;},
 over:function(G){
  var N=W.length;
  /* No membrane line. A polyline through the outer edges read as a stray
     chord at zoom 2.9 on the first look. The caps of the addresses already
     draw the bent ring, and the faint rest circle shows where it would sit
     unloaded, so bulge and dent read against it. */
  var i,n;
  /* the fringes. five bands, each a short arc per address so its strength
     can follow the stress along the ring */
  g.save();g.lineCap='butt';
  for(i=0;i<N;i++){n=W[i]; if(n.str<0.03||n.ea<1)continue;
   var gap=(10-6*n.str)*G.sk, f=REDUCED?0.5:frac(n.a1);
   var half=TAU/N/2+0.002;
   for(var k=0;k<5;k++){
    var pos=k+f, rr=n.rO+4+pos*gap;
    var al=Math.pow(n.str,1.3)*Math.sin(Math.PI*pos/5)*0.9;
    if(al<0.02)continue;
    var col=(k%2)?n.c:mixc(n.c,[255,255,255],0.55);
    g.beginPath();g.arc(G.cx,G.cy,rr,n.aa-half,n.aa+half);
    g.strokeStyle=rgba(col,al);g.lineWidth=(k%2?1.1:1.6)*(0.8+0.4*n.str);g.stroke();}}
  g.restore();}};
/* the switch for the open question */
(function(){var box=document.getElementById('policy'); if(!box)return;
 box.hidden=false;
 box.innerHTML='<span class="lbl">When should a name show?</span>'+POLICIES.map(function(p){
  return '<button type="button" data-k="'+p.k+'" aria-pressed="'+(p.k==='add')+'">'+p.nm+'</button>';}).join('');
 box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  S.policy=b.getAttribute('data-k');S.dirty=true;
  [].forEach.call(box.querySelectorAll('button'),function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});});})();
