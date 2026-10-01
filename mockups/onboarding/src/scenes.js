/* scenes.js. Pure drawing for the two animated scenes and the body column.
   Each scene is a function of a parameter object, so a still frame in a strip
   and a frame in a live animation are the same code. */
function lerp(a,b,t){return a+(b-a)*t;}
function mixParams(A,B,t){
 if(typeof A==='number')return lerp(A,B,t);
 if(Array.isArray(A))return A.map(function(x,i){return mixParams(x,B[i],t);});
 if(A&&typeof A==='object'){var o={};for(var k in A)o[k]=(typeof A[k]==='string')?(t<.5?A[k]:B[k]):mixParams(A[k],B[k],t);return o;}
 return A;}
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
/* tween a parameter object between two frames and call draw each frame */
function tween(A,B,ms,draw,done){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){draw(B);done&&done();return;}
 var t0=null;function step(ts){if(t0===null)t0=ts;var t=Math.min(1,(ts-t0)/ms);draw(mixParams(A,B,ease(t)));if(t<1)requestAnimationFrame(step);else done&&done();}
 requestAnimationFrame(step);}

/* ---------- THE BODY COLUMN. Seven seats on a spine, as the boot draws it.
   Every mark is a seat, so this is a measured figure and not an illustration. */
var SEAT_Y=[350,300,250,200,150,100,50];
function bodySVG(o){
 o=o||{};var hi=o.hi==null?-1:o.hi,lab=o.labels!==false,labHi=(o.labels==='hi'),pulse=o.pulse||0,sel=o.sel||[];
 var out='<svg viewBox="0 0 190 380" class="body" role="img" aria-label="Seven seats on a spine">';
 out+='<ellipse cx="60" cy="18" rx="17" ry="5" fill="none" stroke="#C2A063" stroke-width="1.4" opacity=".8"/>';
 out+='<line x1="60" y1="50" x2="60" y2="350" stroke="rgba(255,255,255,.2)" stroke-width="1.6"/>';
 for(var i=0;i<7;i++){var y=SEAT_Y[i],on=(i===hi),c=SEATS[i].c;
  if(on){
   out+='<circle cx="60" cy="'+y+'" r="'+(22+pulse*10)+'" fill="none" stroke="'+c+'" stroke-width="1.4" opacity="'+(.55-pulse*.4)+'"/>';
   out+='<circle cx="60" cy="'+y+'" r="'+(15-pulse*2)+'" fill="#0C0D12" stroke="'+c+'" stroke-width="2.6"/><circle cx="60" cy="'+y+'" r="4.4" fill="'+c+'"/>';
  }else out+='<circle cx="60" cy="'+y+'" r="9" fill="#0C0D12" stroke="'+c+'" stroke-width="1.8" opacity=".6"/>';
  if(sel.indexOf(i)>-1)out+='<circle cx="60" cy="'+y+'" r="19" fill="none" stroke="'+c+'" stroke-width="1.6" stroke-dasharray="3 4"/>';
  if(lab&&(!labHi||on))out+='<text x="88" y="'+(y+4)+'" font-size="12" font-weight="'+(on?600:500)+'" fill="'+(on?c:'#94908A')+'" font-family="Inter,sans-serif">'+SEATS[i].n+'</text>';
 }
 return out+'</svg>';}

/* ---------- MIRROR FORMING. Six stages, one per grammar word. ---------- */
var FORM_N=[ // id, label, scatter xy, gather xy, seat colour
 {l:'taking care',s:[58,76],g:[120,150],c:2},
 {l:'everybody else',s:[238,48],g:[176,142],c:2},
 {l:'overwhelmed',s:[36,236],g:[128,206],c:5},
 {l:'afraid',s:[222,300],g:[170,204],c:0},
 {l:'fall apart',s:[110,324],g:[148,236],c:0}];
var FORM_E=[[0,1],[1,3],[3,4],[4,2],[2,0],[0,3],[1,2]];
var FORM_NAMES=['Signal','Notice','Connect','Pattern','Body','Mirror'];
var FORM_GRAM=['A node appears','A node brightens','A line forms','Repetition gathers','It sits somewhere','The system gathers what it saw'];
function formParams(st){
 var gat=st>=3,scatter=!gat;
 return {
  n:FORM_N.map(function(n,i){var p=gat?n.g:n.s;
   var show=(st===0)?(i<3?.4:.0):1; return {x:p[0],y:p[1],r:st===0?4:(st>=3?8:6),op:show,lab:st>=1?(st>=5?.55:1):0};}),
  link:st>=2?(st>=5?.5:.85):0,
  core:st>=3?(st>=5?1:.6):0,
  body:st>=4?1:0.0,
  path:st>=4?1:0,
  tag:st>=5?1:0};}
function formSVG(P,o){
 o=o||{};var fs=o.fs||1;
 var out='<svg viewBox="-24 0 464 360" class="formsvg" role="img" aria-label="Signals gathering into a pattern, then placed on the body">';
 // quiet ring behind
 out+='<circle cx="150" cy="180" r="150" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1"/>';
 // body spine on the right
 var bo=.25+P.body*.75;
 out+='<g opacity="'+bo+'" transform="translate(268,0)">'+bodySVG({hi:P.body>.5?2:-1,labels:P.body>.5?(fs>1?'hi':true):false,pulse:o.pulse||0}).replace('<svg viewBox="0 0 190 380" class="body" role="img" aria-label="Seven seats on a spine">','<svg x="0" y="0" width="160" height="360" viewBox="0 0 190 380">')+'</g>';
 // links
 FORM_E.forEach(function(e){var a=P.n[e[0]],b=P.n[e[1]];
  out+='<line x1="'+f(a.x)+'" y1="'+f(a.y)+'" x2="'+f(b.x)+'" y2="'+f(b.y)+'" stroke="'+ACC+'" stroke-width="1.5" opacity="'+P.link*Math.min(a.op,b.op)+'"/>';});
 // core ring
 if(P.core>0){
  out+='<circle cx="150" cy="190" r="'+f(30+(1-P.core)*8)+'" fill="none" stroke="#DABF6A" stroke-width="2" opacity="'+P.core+'"/>';}
 // path from the core to the solar seat
 if(P.path>0){var sx=318.5, sy=230.5;
  out+='<path d="M180 192 C 240 190, 270 '+f(sy-6)+', '+f(sx-14)+' '+f(sy)+'" fill="none" stroke="#DABF6A" stroke-width="1.8" stroke-dasharray="'+(P.path<1?'4 4':'none')+'" opacity="'+(.9*P.path)+'"/>';}
 // nodes
 P.n.forEach(function(n,i){var c=SEATS[FORM_N[i].c].c;
  out+='<circle cx="'+f(n.x)+'" cy="'+f(n.y)+'" r="'+f(n.r+2)+'" fill="#0C0D12" stroke="'+c+'" stroke-width="2" opacity="'+n.op+'"/>';
  if(n.r>5)out+='<circle cx="'+f(n.x)+'" cy="'+f(n.y)+'" r="'+f(n.r-3.5)+'" fill="'+c+'" opacity="'+n.op+'"/>';
  if(n.lab>0){var left=(n.x>150&&P.n[i].x>0&&FORM_N[i].g[0]>150)||false;
   var lx=n.x+(P.core>0.1?(n.x<150?-14:14):12), anchor=(P.core>0.1&&n.x<150)?'end':'start';
   if(P.core<=.1){lx=n.x+12;anchor='start';if(n.x>200){lx=n.x-12;anchor='end';}}
   out+='<text x="'+f(lx)+'" y="'+f(n.y+4)+'" font-size="'+f((o.big?14:13)*fs)+'" fill="'+INK+'" text-anchor="'+anchor+'" opacity="'+n.lab+'" font-family="Inter,sans-serif">'+FORM_N[i].l+'</text>';}});
 if(P.tag>0)out+='<text x="150" y="286" font-size="'+f(15*fs)+'" font-weight="600" fill="#EFEDE8" text-anchor="middle" opacity="'+P.tag+'" font-family="Inter,sans-serif">Over-responsibility</text>';
 return out+'</svg>';}

/* ---------- RELEASE STATES. One cluster, six states, one colour. ---------- */
var REL_STATES=['Held','Contracted','Releasing','Opening','Settling','Observing'];
var REL_SAY=['The pattern sits where it sits.','It tightens. Notice where.','The lines let go, one at a time.','Space opens where it was tight.','It finds a new resting place.','Nothing to do. Notice what is here.'];
var REL_GRAM=['Structure fixed','Structure compressed','Structure loosens','State reorganizes','State stabilizes','Before and after separate'];
var REL_P=[
 {k:1,bend:0,spoke:.9,ringE:.55,gap:0,sw:2,nr:6,ghost:0,tin:0,tout:0,dot:0,thin:0},
 {k:.64,bend:0,spoke:1,ringE:.8,gap:0,sw:3.2,nr:7.5,ghost:0,tin:1,tout:0,dot:0,thin:0},
 {k:.9,bend:.28,spoke:.5,ringE:.6,gap:14,sw:2,nr:6,ghost:0,tin:0,tout:0,dot:0,thin:0},
 {k:1.55,bend:.42,spoke:.12,ringE:.55,gap:26,sw:1.6,nr:5,ghost:0,tin:0,tout:1,dot:0,thin:0},
 {k:1.28,bend:.16,spoke:0,ringE:.5,gap:0,sw:1.6,nr:5.5,ghost:0,tin:0,tout:0,dot:1,thin:0},
 {k:1.28,bend:.1,spoke:0,ringE:.35,gap:0,sw:1.4,nr:5,ghost:.7,tin:0,tout:0,dot:0,thin:1}];
var REL_A=[15,60,105,150,195,240,285,330], REL_RF=[1,.8,1,.9,1,.75,1,.85];
function relSVG(P,o){
 o=o||{};var R=88,cx=200,cy=200,c='#DABF6A',out='<svg viewBox="0 0 400 400" class="relsvg" role="img" aria-label="The pattern, drawn as a cluster of nodes">';
 var pos=REL_A.map(function(a,i){return polar(cx,cy,REL_RF[i]*R*P.k,a);});
 var posH=REL_A.map(function(a,i){return polar(cx,cy,REL_RF[i]*R*1,a);});
 // ghost of the held state: where it was
 if(P.ghost>0){
  posH.forEach(function(p,i){var q=posH[(i+1)%8];
   out+='<line x1="'+f(p[0])+'" y1="'+f(p[1])+'" x2="'+f(q[0])+'" y2="'+f(q[1])+'" stroke="'+MID+'" stroke-width="1" stroke-dasharray="2 5" opacity="'+P.ghost*.7+'"/>';
   out+='<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="5" fill="none" stroke="'+MID+'" stroke-width="1" stroke-dasharray="2 3" opacity="'+P.ghost+'"/>';});}
 // the ring: solid, broken into arcs, or dotted
 var Rr=R*P.k*1.24;
 if(P.gap<1){
  out+='<circle cx="'+cx+'" cy="'+cy+'" r="'+f(Rr)+'" fill="none" stroke="'+c+'" stroke-width="'+(P.thin>.5?1.2:P.sw)+'" opacity="'+(P.dot>.5?.0:(P.thin>.5?.55:.85))+'"/>';
  if(P.dot>.5)out+='<circle cx="'+cx+'" cy="'+cy+'" r="'+f(Rr)+'" fill="none" stroke="'+c+'" stroke-width="2" stroke-dasharray="1.5 7" stroke-linecap="round" opacity=".9"/>';
 }else{
  for(var i=0;i<8;i++){var a0=i*45+P.gap/2,a1=(i+1)*45-P.gap/2;
   out+='<path d="'+arcPath(cx,cy,Rr,a0,a1)+'" fill="none" stroke="'+c+'" stroke-width="'+P.sw+'" stroke-linecap="round" opacity=".85"/>';}}
 // ticks in (pressure) or out (space)
 for(var j=0;j<8;j++){var ang=22.5+j*45;
  if(P.tin>.01){var p0=polar(cx,cy,Rr+22,ang),p1=polar(cx,cy,Rr+8,ang);
   out+='<line x1="'+f(p0[0])+'" y1="'+f(p0[1])+'" x2="'+f(p1[0])+'" y2="'+f(p1[1])+'" stroke="'+MID+'" stroke-width="1.8" stroke-linecap="round" opacity="'+P.tin+'"/>';}
  if(P.tout>.01){var q0=polar(cx,cy,Rr+8,ang),q1=polar(cx,cy,Rr+22,ang);
   out+='<line x1="'+f(q0[0])+'" y1="'+f(q0[1])+'" x2="'+f(q1[0])+'" y2="'+f(q1[1])+'" stroke="'+MID+'" stroke-width="1.8" stroke-linecap="round" opacity="'+P.tout+'"/>';}}
 // spokes
 pos.forEach(function(p){out+='<line x1="'+cx+'" y1="'+cy+'" x2="'+f(p[0])+'" y2="'+f(p[1])+'" stroke="'+c+'" stroke-width="'+f(P.sw*.6)+'" opacity="'+P.spoke*.8+'"/>';});
 // ring edges, straight or bent
 pos.forEach(function(p,i){var q=pos[(i+1)%8];
  var mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,dx=q[0]-p[0],dy=q[1]-p[1],nx=-dy,ny=dx,sgn=(i%2?1:-1);
  out+='<path d="M'+f(p[0])+' '+f(p[1])+' Q'+f(mx+nx*P.bend*sgn)+' '+f(my+ny*P.bend*sgn)+' '+f(q[0])+' '+f(q[1])+'" fill="none" stroke="'+c+'" stroke-width="'+f(P.sw*.75)+'" opacity="'+P.ringE+'"/>';});
 // nodes: rings with a hollow centre
 pos.forEach(function(p){out+='<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="'+f(P.nr+2)+'" fill="#0C0D12" stroke="'+c+'" stroke-width="'+f(P.sw)+'"/><circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="'+f(P.nr-3)+'" fill="'+c+'"/>';});
 out+='<circle cx="'+cx+'" cy="'+cy+'" r="'+f(10+P.sw)+'" fill="#0C0D12" stroke="'+c+'" stroke-width="'+f(P.sw+.6)+'"/><circle cx="'+cx+'" cy="'+cy+'" r="4.6" fill="'+c+'"/>';
 return out+'</svg>';}

/* six stops on one path: the node states. A path, never a ring: the ring is the loop's. */
function statesTrack(i,names,w,nolab){
 names=names||REL_STATES;w=w||520;var n=names.length,gap=w/(n-1),out='<svg viewBox="0 0 '+(w+80)+' 64" class="track" role="img" aria-label="State '+(i+1)+' of '+n+': '+names[i]+'">';
 out+='<line x1="40" y1="14" x2="'+(40+w)+'" y2="14" stroke="rgba(255,255,255,.18)" stroke-width="1.6"/>';
 out+='<line x1="40" y1="14" x2="'+(40+i*gap)+'" y2="14" stroke="'+ACC+'" stroke-width="2"/>';
 names.forEach(function(nm,k){var x=40+k*gap,on=k===i,done=k<i;
  out+='<circle cx="'+x+'" cy="14" r="'+(on?8:5.5)+'" fill="'+(done||on?ACC:'#0C0D12')+'" stroke="'+(done||on?ACC:'rgba(255,255,255,.32)')+'" stroke-width="1.8"/>';
  if(on)out+='<circle cx="'+x+'" cy="14" r="3" fill="#0C0D12"/>';
  if(!nolab)out+='<text x="'+x+'" y="48" text-anchor="middle" font-size="'+(on?13:12)+'" font-weight="'+(on?600:500)+'" fill="'+(on?INK:'#94908A')+'" font-family="Inter,sans-serif">'+nm+'</text>';});
 return out+'</svg>';}
