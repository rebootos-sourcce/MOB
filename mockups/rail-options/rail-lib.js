/* Shared pieces for the four left menu options, round OR. Mockup only.
   Everything here reads real figures from rail-data.js, which was read out of the built page.

   ONE INDEX RUNS THROUGH ALL OF IT, and it is the reason the four options can tie Coherence, Decoherence and Flow together
   without inventing anything. The seven seats, root to crown, carry three things each:
     laws    the 21 laws are seated at the seats (SI in engine/data/canon.js: 2, 2, 4, 4, 3, 3, 3), and Coherence is those laws summed
     nodes   the 112 addresses are seated at the seats, SQ is what each one holds, and Decoherence is all of it summed
     pass    Flow is the seven seats multiplied, root to crown, each passing what its own held charge leaves (flSeats in ui/map.js)
   So a seat is where the three meet, and a drawing that lines them up shows why they move together. */
(function(){
'use strict';
var RD=window.RD, BANDS=RD.bands, TAU=Math.PI*2;
var SEAT=['#D6524C','#D8924E','#DABF6A','#5FD5A6','#5EBBDB','#7D93E0','#A77EDB'];
var URL=new URLSearchParams(location.search);
var FREEZE=URL.has('t')?parseFloat(URL.get('t')):null;
var STILL=URL.has('still');
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function lerp(a,b,t){return a+(b-a)*t;}
function f1(v){return (+v).toFixed(1);}
function f2(v){return (+v).toFixed(2);}
var _u=0; function uid(p){return (p||'u')+(++_u);}

/* the product's bar ramp, alarm at the floor, slate at the median, the accent at the crown, lifted a step so a stroke reads on the dark panel */
var TONE=[[0,226,87,76],[20,222,112,92],[35,208,134,120],[50,142,155,181],[65,118,170,205],[80,150,205,230],[100,222,240,248]];
function tone(p){p=clamp(p,0,100);for(var i=1;i<TONE.length;i++){if(p<=TONE[i][0]){var a=TONE[i-1],b=TONE[i],t=(p-a[0])/(b[0]-a[0]);
 return 'rgb('+Math.round(lerp(a[1],b[1],t))+','+Math.round(lerp(a[2],b[2],t))+','+Math.round(lerp(a[3],b[3],t))+')';}}return 'rgb(222,240,248)';}
function mix(h,k,t){ /* hex to a mix with colour k, t of k */
 var c=h.replace('#',''),r=parseInt(c.substr(0,2),16),g=parseInt(c.substr(2,2),16),b=parseInt(c.substr(4,2),16),
  kk=k.replace('#',''),kr=parseInt(kk.substr(0,2),16),kg=parseInt(kk.substr(2,2),16),kb=parseInt(kk.substr(4,2),16);
 return 'rgb('+Math.round(lerp(r,kr,t))+','+Math.round(lerp(g,kg,t))+','+Math.round(lerp(b,kb,t))+')';}

/* OWNER ROUND OT: the colours are the elements. Vitality is energy, yellow. Awareness is indigo. Will is blue. Radiance is the three together. */
var ELEM={vit:'#E8C547',awa:'#6F6FE8',will:'#4A93E6',rad:'#F2E8C8',cq:'#8FC8E6',dq:'#C2534B'};

/* ---------- the clock: one loop, quiet, on the Field's own rate ---------- */
var FN=[], T0=null, RUN=false;
function reg(fn){FN.push(fn); if(!RUN)start(); else fn(cur());}
function cur(){return FREEZE!==null?FREEZE:(T0===null?0:(performance.now()-T0)/1000);}
function start(){RUN=true; T0=performance.now();
 if(STILL){FN.forEach(function(f){f(FREEZE||0);}); return;}
 (function loop(){var t=cur(); for(var i=0;i<FN.length;i++){try{FN[i](t);}catch(e){console.error(e);}} if(FREEZE===null)requestAnimationFrame(loop);})();}
if(STILL)document.documentElement.classList.add('still');
function rate(P){return lerp(RD.pul.LO,RD.pul.HI,clamp(P.DQ/100,0,1));}   /* pulseRate in ui/wheel.js: DQ sets how fast */

/* ---------- people ---------- */
function person(key){var P=RD.people[key]||RD.people.marcus; P.key=key; return P;}
function seatNodes(P,s){return P.nodes.filter(function(n){return n[2]===s;});}
function seatMean(P,s){return P.seatMean[s];}
/* what an address looks like: a held address goes dark and large, a clear one is a small light. The root lifts the low end,
   the same job the doubling does on the seven hashes, and the explainer sheet shows both. */
function U(sq){return clamp(Math.sqrt(sq/10)*1.15,0,1);}
function seatU(P,s){return U(P.seatMean[s]);}
/* how dark a seat is drawn: the absolute weight, spread by where it sits among its own seven, so the darkest and the lightest
   separate even when the whole field is heavy, and a clear person still reads clear because the absolute weight scales it */
function seatDisp(P,s){var m=P.seatMean,mn=Math.min.apply(null,m),mx=Math.max.apply(null,m),rel=mx>mn?(m[s]-mn)/(mx-mn):0; return clamp(U(m[s])*(.5+.5*rel),0,1);}
function darkest(P){var b=0;for(var s=1;s<7;s++)if(P.seatMean[s]>P.seatMean[b])b=s;return b;}
function lightest(P){var b=0;for(var s=1;s<7;s++)if(P.seatMean[s]<P.seatMean[b])b=s;return b;}
/* the breath of a seat, at the phase of its first address, as ui/railtiles.js rlPhase does it */
function seatDelay(P,s){var first=null;for(var i=0;i<P.nodes.length;i++)if(P.nodes[i][2]===s){first=P.nodes[i];break;}
 var ph=(first?first[0]:0)*0.12, peak=(Math.PI/2+ph)*4.2/TAU, c=((( -peak+2.1)%4.2)+4.2)%4.2; return (-c).toFixed(2)+'s';}
function nmDq(P){return Math.round(P.DQ)+'%';}

/* ---------- defs shared by a page ---------- */
var DEFS=null;
function defs(){
 if(DEFS)return DEFS;
 var g='';
 SEAT.forEach(function(c,s){
  g+='<radialGradient id="well'+s+'"><stop offset="0" stop-color="'+c+'" stop-opacity=".62"/><stop offset=".55" stop-color="'+c+'" stop-opacity=".22"/><stop offset="1" stop-color="'+c+'" stop-opacity="0"/></radialGradient>';});
 g+='<radialGradient id="plate"><stop offset="0" stop-color="#3a3f50"/><stop offset=".7" stop-color="#2a2e3b"/><stop offset="1" stop-color="#232733"/></radialGradient>';
 g+='<radialGradient id="umbra"><stop offset="0" stop-color="#030407" stop-opacity="1"/><stop offset=".62" stop-color="#030407" stop-opacity=".92"/><stop offset="1" stop-color="#030407" stop-opacity="0"/></radialGradient>';
 g+='<radialGradient id="halo"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".35" stop-color="#bfe3f3" stop-opacity=".35"/><stop offset="1" stop-color="#bfe3f3" stop-opacity="0"/></radialGradient>';
 DEFS='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'+g+'</defs></svg>';
 return DEFS;}

/* ============================================================
   THE NODES. One address is one dot. Seat clusters lay the dots in a phyllotaxis rosette, so a seat of 21 and a seat of 12
   are the same pattern at different sizes and the count is visible as area. A clear address is a small light in the seat's
   colour. A held address is larger and goes dark, with only a rim left. A seat is a light well behind its dots, and the more
   it holds the more a black core takes the well. Darkest and lightest are read off the dots' density and the well's light.
   ============================================================ */
function dotPos(k,n,R){var r=R*Math.sqrt((k+.5)/n), a=k*2.39996323; return [r*Math.cos(a),r*Math.sin(a)];}
function dot(n,s,x,y,sc,anim){
 var u=U(n[3]), c=SEAT[s], r=(1.5+1.9*u)*sc,
  fill=u<.12?c:mix(c,'#05060a',clamp((u-.1)/.75,0,1)), op=(.98-.25*u).toFixed(2),
  stroke=u<.12?'none':c, sw=(.6+.5*u)*sc;
 return '<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f2(r)+'" fill="'+fill+'" opacity="'+op+'"'+(stroke==='none'?'':' stroke="'+stroke+'" stroke-opacity="'+(.9-.3*u).toFixed(2)+'" stroke-width="'+f2(sw)+'"')
  +(anim&&u>.35?' class="pulse" style="--bd:-'+((n[0]*0.37)%4.2).toFixed(2)+'s"':'')+'/>';}
function cluster(P,s,cx,cy,R,o){
 o=o||{}; var nodes=seatNodes(P,s), n=nodes.length, us=seatDisp(P,s), sc=o.sc||R/20, h='';
 var wellR=R*(o.well||1.7), core=R*1.12;
 h+='<g transform="translate('+f1(cx)+' '+f1(cy)+')">';
 if(o.plate!==false)h+='<circle r="'+f1(R*1.22)+'" fill="url(#plate)" stroke="rgba(255,255,255,.08)" stroke-width="1"/>';
 h+='<circle r="'+f1(wellR)+'" fill="url(#well'+s+')" opacity="'+(.95-.45*us).toFixed(2)+'" class="pulse" style="--bd:'+seatDelay(P,s)+'"/>';
 h+='<circle r="'+f1(core)+'" fill="url(#umbra)" opacity="'+clamp(us*1.08,0,.98).toFixed(2)+'"/>';
 nodes.forEach(function(nd,k){var p=dotPos(k,n,R*.92); h+=dot(nd,s,p[0],p[1],sc,o.anim!==false);});
 h+='</g>'; return h;}

/* ============================================================
   THE FORMS. Each is the reading itself.
   ============================================================ */
/* Coherence: the 21 laws as a ring of arcs, grouped by seat, thick where a law is held and a hairline where it is open */
function lawOrder(){var idx=[];for(var i=0;i<21;i++)idx.push(i);
 idx.sort(function(a,b){return RD.lawSeat[a]-RD.lawSeat[b]||a-b;}); return idx;}
function arcPath(cx,cy,r,a0,a1){var x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1);
 return 'M'+f2(x0)+' '+f2(y0)+'A'+f2(r)+' '+f2(r)+' 0 '+((a1-a0)>Math.PI?1:0)+' 1 '+f2(x1)+' '+f2(y1);}
function lawRing(P,cx,cy,R,o){
 o=o||{}; var ord=lawOrder(), n=21, step=TAU/n, gap=o.gap!==undefined?o.gap:step*.16, tmax=o.tmax||R*.2, tmin=o.tmin||Math.max(.7,R*.03), h='';
 var col=o.seat?null:tone(P.CQ);
 h+='<g transform="translate('+f1(cx)+' '+f1(cy)+')">';
 h+='<circle r="'+f1(R)+'" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="'+f1(tmin)+'"/>';
 var secPos=null;
 if(o.sectors){ /* each seat takes a wedge of 1/7 of the ring, centred on the seat's own angle, and its laws share the wedge */
  secPos={}; var cnt=[0,0,0,0,0,0,0]; ord.forEach(function(li){cnt[RD.lawSeat[li]]++;}); var seen=[0,0,0,0,0,0,0];
  ord.forEach(function(li){var s=RD.lawSeat[li], w=TAU/7/cnt[s], c0=-Math.PI/2+s*TAU/7-TAU/14; secPos[li]=[c0+seen[s]*w, c0+(seen[s]+1)*w]; seen[s]++;});}
 ord.forEach(function(li,k){var v=P.laws[li]/10, a0=-Math.PI/2+k*step+gap/2, a1=-Math.PI/2+(k+1)*step-gap/2;
  if(secPos){a0=secPos[li][0]+gap/2; a1=secPos[li][1]-gap/2;}
  var c=o.seat?SEAT[RD.lawSeat[li]]:col, w=tmin+(tmax-tmin)*v;
  h+='<path d="'+arcPath(0,0,R,a0,a1)+'" fill="none" stroke="'+c+'" stroke-width="'+f2(w)+'" stroke-linecap="butt" opacity="'+(.55+.45*v).toFixed(2)+'"><title>'+RD.lawNames[li]+'</title></path>';});
 
 if(!o.noorbit){var per=(9/rate(P)).toFixed(1);
  h+='<g class="spin" style="--sp:'+per+'s;transform-origin:0 0;transform-box:view-box"><circle r="'+f1(R)+'" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="'+f1(Math.max(1,tmin*1.2))+'" stroke-linecap="round" stroke-dasharray="'+f1(R*.12)+' '+f1(TAU*R)+'"/></g>';}
 h+='</g>'; return h;}

/* Decoherence as an eclipse: a lit disc, and a dark disc over it that covers exactly the share of its area that the percent says */
function lensArea(r,d){if(d>=2*r)return 0; if(d<=0)return Math.PI*r*r; return 2*r*r*Math.acos(d/(2*r))-(d/2)*Math.sqrt(4*r*r-d*d);}
function eclipseOffset(r,f){var lo=0,hi=2*r,target=f*Math.PI*r*r;for(var i=0;i<30;i++){var m=(lo+hi)/2; if(lensArea(r,m)>target)lo=m; else hi=m;}return (lo+hi)/2;}
function eclipse(P,cx,cy,r){
 var f=clamp(P.DQ/100,0,1), d=eclipseOffset(r,f), id=uid('ec'), col=tone(100-P.DQ);
 var h='<g transform="translate('+f1(cx)+' '+f1(cy)+')" data-ec="'+id+'" data-d="'+f2(d)+'" data-r="'+f1(r)+'">';
 h+='<defs><clipPath id="'+id+'c"><circle r="'+f1(r)+'"/></clipPath></defs>';
 h+='<circle r="'+f1(r)+'" fill="'+col+'" opacity=".16"/>';
 h+='<circle r="'+f1(r)+'" fill="none" stroke="'+col+'" stroke-width="1.6"/>';
 h+='<g clip-path="url(#'+id+'c)"><circle id="'+id+'d" cx="'+f2(d)+'" cy="0" r="'+f1(r*1.005)+'" fill="#05060a"/><circle id="'+id+'o" cx="'+f2(d)+'" cy="0" r="'+f1(r)+'" fill="none" stroke="#D4736D" stroke-opacity=".7" stroke-width="1"/></g>';
 h+='</g>';
 reg(function(t){var e=document.getElementById(id+'d'); if(!e)return; var dd=d+Math.sin(t*TAU/4.2*(.7+.6*P.DQ/100))*r*.05*(f>0?1:0);
  e.setAttribute('cx',f2(dd)); var o2=document.getElementById(id+'o'); if(o2)o2.setAttribute('cx',f2(dd));});
 return h;}

/* Vitality: a vessel that holds the share of energy left, with a quiet surface */
function vessel(P,cx,cy,sz){
 var X=clamp(P.X,0,1), id=uid('ve'), col=ELEM.vit, k=sz/40, top=5, bot=33, lvl=bot-(bot-top)*X;
 var bowl='M6 4H34C34 19 28.5 29.5 20 32C11.5 29.5 6 19 6 4Z';
 var h='<g transform="translate('+f1(cx-20*k)+' '+f1(cy-26*k)+') scale('+f2(k)+')">';
 h+='<defs><clipPath id="'+id+'"><path d="'+bowl+'"/></clipPath><linearGradient id="'+id+'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+col+'" stop-opacity=".95"/><stop offset="1" stop-color="'+col+'" stop-opacity=".35"/></linearGradient></defs>';
 h+='<g clip-path="url(#'+id+')"><g id="'+id+'w"><path d="M-20 '+f1(lvl)+' q5 -2.4 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 V40 H-20Z" fill="url(#'+id+'g)" class="slide" style="animation-duration:'+(5/rate(P)).toFixed(1)+'s"/></g></g>';
 h+='<path d="'+bowl+'" fill="none" stroke="'+col+'" stroke-width="1.5" stroke-linejoin="round"/>';
 h+='<path d="M20 32V45M12 45H28" fill="none" stroke="'+col+'" stroke-width="1.5" stroke-linecap="round"/>';
 h+='</g>'; return h;}

/* Awareness: an iris. The wider it is open, the more it sees; a closed pupil is a narrow slit of the ring */
function iris(P,cx,cy,sz){
 var Y=clamp(P.Y,0,1), col=ELEM.awa, r=sz/2, pr=r*(.18+.62*Y), id=uid('ir'), h='';
 h+='<g transform="translate('+f1(cx)+' '+f1(cy)+')">';
 h+='<circle r="'+f1(r)+'" fill="'+col+'" opacity=".14"/>';
 h+='<g class="spin" style="--sp:'+(70/rate(P)).toFixed(0)+'s;transform-origin:0 0;transform-box:view-box">';
 for(var i=0;i<12;i++){var a=i*TAU/12; h+='<path d="M'+f2(Math.cos(a)*(pr+1))+' '+f2(Math.sin(a)*(pr+1))+'L'+f2(Math.cos(a+.18)*(r-1))+' '+f2(Math.sin(a+.18)*(r-1))+'" stroke="'+col+'" stroke-opacity=".55" stroke-width=".9" fill="none"/>';}
 h+='</g>';
 h+='<circle r="'+f1(r)+'" fill="none" stroke="'+col+'" stroke-width="1.6"/>';
 h+='<circle r="'+f1(pr)+'" fill="#05060a" stroke="'+col+'" stroke-width="1.2" class="pulse"/>';
 h+='<circle cx="'+f1(-pr*.35)+'" cy="'+f1(-pr*.35)+'" r="'+f1(Math.max(.9,pr*.16))+'" fill="#fff" opacity=".7"/>';
 h+='</g>'; return h;}

/* Will: an arrow that stays true. Its length is the share of integrity that gets through; its shaft sways in step with what does not */
function arrow(P,cx,cy,sz){
 var Z=clamp(P.Z,0,1), col=ELEM.will, k=sz/40, id=uid('ar'), len=8+34*Z;
 var h='<g transform="translate('+f1(cx-20*k)+' '+f1(cy-26*k)+') scale('+f2(k)+')">';
 h+='<path d="M20 48V4" stroke="'+col+'" stroke-opacity=".22" stroke-dasharray="1.5 3.5" stroke-width="1.4" fill="none"/>';
 h+='<path id="'+id+'s" d="M20 48Q20 '+f1(48-len/2)+' 20 '+f1(48-len)+'" stroke="'+col+'" stroke-width="2" stroke-linecap="round" fill="none"/>';
 h+='<path id="'+id+'h" d="M14.5 '+f1(48-len+6)+'L20 '+f1(48-len)+'L25.5 '+f1(48-len+6)+'" stroke="'+col+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
 h+='<path d="M15 47.5H25" stroke="'+col+'" stroke-width="1.4" stroke-linecap="round" fill="none"/>';
 h+='</g>';
 reg(function(t){var s=document.getElementById(id+'s'); if(!s)return; var sw=Math.sin(t*TAU/4.2*.9)*(1-Z)*8, top=48-len;
  s.setAttribute('d','M20 48Q'+f2(20+sw)+' '+f1(48-len/2)+' '+f2(20+sw*.35)+' '+f1(top));
  var hh=document.getElementById(id+'h'); if(hh){var x=20+sw*.35; hh.setAttribute('d','M'+f2(x-5.5)+' '+f1(top+6)+'L'+f2(x)+' '+f1(top)+'L'+f2(x+5.5)+' '+f1(top+6));}});
 return h;}

/* Radiance: a sun. Its halo and its rays are as large as the figure, and it is the same light that washes the Field */
function sun(P,cx,cy,sz){
 var R=clamp(P.rad,0,1), col=ELEM.rad, r=sz/2, h='', rc=r*.2, ray0=r*.38, ray1=r*(.46+.5*R);
 h+='<g transform="translate('+f1(cx)+' '+f1(cy)+')">';
 h+='<circle r="'+f1(r*(.55+.5*R))+'" fill="url(#halo)" opacity="'+(.18+.6*R).toFixed(2)+'" class="pulse"/>';
 h+='<g class="spin" style="--sp:90s;transform-origin:0 0;transform-box:view-box">';
 for(var i=0;i<12;i++){var a=i*TAU/12, l=(i%2? ray1*.78:ray1); h+='<path d="M'+f2(Math.cos(a)*ray0)+' '+f2(Math.sin(a)*ray0)+'L'+f2(Math.cos(a)*l)+' '+f2(Math.sin(a)*l)+'" stroke="'+[ELEM.vit,ELEM.awa,ELEM.will][i%3]+'" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="'+(.45+.5*R).toFixed(2)+'"/>';}
 h+='</g><circle r="'+f1(rc*1.55)+'" fill="none" stroke="'+col+'" stroke-width="1.6"/><circle r="'+f1(rc*.7)+'" fill="'+col+'" opacity="'+(.35+.6*R).toFixed(2)+'"/>';
 h+='</g>'; return h;}

/* the triad: vitality, awareness and will as three spokes whose lengths are the figures. Radiance is what the three make together, so it
   is the glow where they meet and the area they enclose. Used where the three belong in one picture. */
function triad(P,cx,cy,R,o){
 o=o||{}; var vals=[P.Y,P.Z,P.X], ang=[-90,30,150], names=['Awareness','Will','Vitality'], h='', pts=[], R0=clamp(P.rad,0,1);
 h+='<g transform="translate('+f1(cx)+' '+f1(cy)+')">';
 var full=ang.map(function(a){return [Math.cos(a*Math.PI/180)*R,Math.sin(a*Math.PI/180)*R];});
 h+='<path d="M'+full.map(function(p){return f1(p[0])+' '+f1(p[1]);}).join('L')+'Z" fill="none" stroke="rgba(255,255,255,.13)" stroke-width="1" stroke-dasharray="2 3"/>';
 h+='<circle r="'+f1(R*(.45+.5*R0))+'" fill="url(#halo)" opacity="'+(.22+.7*R0).toFixed(2)+'" class="pulse"/>';
 ang.forEach(function(a,i){var v=clamp(vals[i],0,1), L=Math.max(R*.12,R*v), p=[Math.cos(a*Math.PI/180)*L,Math.sin(a*Math.PI/180)*L]; pts.push(p);});
 h+='<path d="M'+pts.map(function(p){return f1(p[0])+' '+f1(p[1]);}).join('L')+'Z" fill="'+ELEM.rad+'" fill-opacity=".14" stroke="'+ELEM.rad+'" stroke-opacity=".7" stroke-width="1.1" stroke-linejoin="round"/>';
 ang.forEach(function(a,i){var v=clamp(vals[i],0,1), c=[ELEM.awa,ELEM.will,ELEM.vit][i], p=pts[i];
  h+='<path d="M0 0L'+f1(p[0])+' '+f1(p[1])+'" stroke="'+c+'" stroke-width="2.2" stroke-linecap="round"/>';
  if(!o.noTips)h+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="3.4" fill="#12141b" stroke="'+c+'" stroke-width="1.6" class="pulse" style="--bd:-'+(i*1.4).toFixed(1)+'s"/>';});
 h+='<circle r="3" fill="#fff" opacity="'+(.4+.6*R0).toFixed(2)+'"/>';
 h+='</g>'; return h;}

/* ============================================================
   FLOW, THE BAND HE LIKES. A sine across the whole range when every seat passes everything, choppy where a seat holds charge.
   Dynamic now, and every part of it is a reading:
     how far it reaches    the running product of the seats' passes, root to crown: what SQ at each seat leaves (engine: flSeats, flSpeed)
     how rough it is       each seat's holdback, 1 less its pass, again from SQ at that seat
     how bold the line is  the laws at that seat, one stretch of line for each of them, thick and bright where held (this is CQ)
     how fast it runs      Decoherence, through the Field's own pulse rate (pulseRate in ui/wheel.js)
   Only the first two are in the engine's Flow arithmetic. CQ does not enter Flow today, so the third is a drawing choice, said so on the sheet.
   ============================================================ */
/* THE LANE. Round OT: the wave is measured against SQ along the length of CQ. Read here as: CQ is the length and the lane. The wave runs
   root to crown along the 21 laws, and the lane it may use is as tall as CQ, so a person whose laws hold 31 percent has a lane 31 percent
   as tall as the full range, and a person at 97 has all of it. Inside the lane SQ sets the level: how far the wave reaches at each seat is
   the running product of what each seat passes (flSeats, ui/map.js), and how rough it is is what each seat holds back. */
function lane(P){return clamp(Math.max(.2,P.CQ/100),.2,1);}
function wave(P,N,H,t,rt,pad){
 var pass=P.seatPass, cum=[], c=1, i, ln=lane(P);
 for(i=0;i<7;i++){c*=pass[i];cum.push(c);}
 var pts=[], ph=t*rt*1.1;
 for(i=0;i<=N;i++){
  var f=i/N*7, s=Math.min(6,Math.floor(f)), u=f-s, a0=s===0?1:cum[s-1], A=a0+(cum[s]-a0)*u;
  var ld=1-pass[s], ldp=s>0?1-pass[s-1]:ld, ldn=s<6?1-pass[s+1]:ld, L=u<.5?ldp+(ld-ldp)*(u+.5):ld+(ldn-ld)*(u-.5);
  var base=Math.sin(Math.PI*4*i/N-ph),
   chop=L*(.55*Math.sin(Math.PI*2*(7*2.1)*i/N+s*1.9+t*1.6*rt)+.3*Math.sin(Math.PI*2*(7*3.3)*i/N+s*.7-t*2.1*rt));
  var y01=clamp(.5+.5*ln*(A*base+chop),0,1);
  pts.push([i/N,pad+(H-2*pad)*(1-y01)]);}
 return {pts:pts,cum:cum};}
function band(P,W,H,o){
 o=o||{}; var id=uid('fb'), N=84, pad=o.pad||4, rt=rate(P), h='', lw=o.lw||2.6, ln=lane(P), half=(H/2-pad)*ln;
 h+='<svg id="'+id+'" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" preserveAspectRatio="none" role="img" aria-label="Flow, root to crown, inside a lane as tall as CQ. '+(P.flow<.2?'Choppy, and cut off early.':P.flow<.8?'Rough in places.':'Smooth across the whole lane.')+'">';
 for(var s=0;s<7;s++)h+='<rect x="'+f1(s*W/7)+'" y="0" width="'+f1(W/7)+'" height="'+H+'" fill="'+SEAT[s]+'" opacity="'+(o.bgop||.07)+'"/>';
 h+='<rect x="0" y="'+f1(H/2-half)+'" width="'+W+'" height="'+f1(half*2)+'" fill="rgba(143,200,230,.06)"/>';
 h+='<path d="M0 '+f1(H/2-half)+'H'+W+'M0 '+f1(H/2+half)+'H'+W+'" stroke="'+ELEM.cq+'" stroke-opacity=".45" stroke-dasharray="3 4" fill="none"/>';
 h+='<path d="M0 '+H/2+'H'+W+'" stroke="rgba(255,255,255,.12)" fill="none"/>';
 for(s=0;s<7;s++){var hb=1-P.seatPass[s]; if(hb>.2)h+='<path class="dam" d="M'+f1(s*W/7+1)+' '+f1(H/2-hb*half)+'V'+f1(H/2+hb*half)+'" stroke="'+SEAT[s]+'" stroke-width="2" stroke-linecap="round" opacity=".7"/>';}
 for(s=0;s<7;s++)h+='<path class="seg" fill="none" stroke="'+SEAT[s]+'" stroke-width="'+lw+'" stroke-linecap="round" stroke-linejoin="round"/>';
 h+='<circle class="bead" r="3" fill="#fff"/></svg>';
 var holder={html:h,id:id};
 reg(function(t){
  var svg=document.getElementById(id); if(!svg)return;
  var w=wave(P,N,H,t,rt,pad), pts=w.pts, sg=svg.querySelectorAll('path.seg');
  for(var s=0;s<7;s++){var a=Math.round(s*N/7), b=Math.round((s+1)*N/7), d='';
   for(var i=a;i<=b;i++)d+=(i===a?'M':'L')+f1(pts[i][0]*W)+' '+f1(pts[i][1]);
   sg[s].setAttribute('d',d);}
  var u=((t*rt*.09)%1), j=Math.min(N,Math.round(u*N)), bd=svg.querySelector('.bead');
  if(bd){bd.setAttribute('cx',f1(pts[j][0]*W)); bd.setAttribute('cy',f1(pts[j][1])); var sc=Math.min(6,Math.floor(u*7)); bd.setAttribute('opacity',Math.max(.25,w.cum[sc]).toFixed(2));}
 });
 return holder;}

/* ============================================================
   CQ AND DQ ON ONE BAR, round OT. CQ at the left end, DQ at the right, a gradient pulled between them, and a line.
   WHERE THE LINE IS. The one oscillation measure the engine has is cqRange in ui/personas.js, the Compass's own: coherence swings inside
   a band 2.5 + (1 - CQ/100)^2 x 26 points wide, and the Compass drifts its marker across that band on two slow sines. It is a width, not
   a position, so the line is placed by it: the share of that widest swing (28.5 points, at CQ 0) the person's own band reaches, measured
   from the CQ end. A steady person's line sits close to the CQ end, a person who swings wide has it pulled toward DQ. And it moves, on
   the Compass's own drift, over a pill that is the band itself.
   ============================================================ */
function cqRange(cq){cq=clamp(cq,0,100);var sw=1-cq/100,band=2.5+sw*sw*26;return {band:band,lo:Math.max(0,cq-band/2),hi:Math.min(100,cq+band/2)};}
var BAND_MAX=28.5;
function oscPos(P,mode){
 var b=cqRange(P.CQ).band;
 if(mode==='cq')return clamp(1-P.CQ/100,0,1);
 if(mode==='tug')return clamp(P.DQ/Math.max(1,P.CQ+P.DQ),0,1);
 return clamp(b/BAND_MAX,0,1);}
function cqdqBar(P,W,H,o){
 o=o||{}; H=H||48; var id=uid('qd'), pos=oscPos(P,o.mode), b=cqRange(P.CQ).band, pillW=(b/BAND_MAX)*W*.3+12;
 var cL=ELEM.cq, cR=ELEM.dq, pos=.3+.4*pos, x=pos*W;
 var h='<svg id="'+id+'" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" role="img" aria-label="CQ '+Math.round(P.CQ)+' percent at the left, DQ '+Math.round(P.DQ)+' percent at the right. The line shows how far the person oscillates.">';
 h+='<defs><linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+cL+'" stop-opacity="'+(.28+.6*P.CQ/100).toFixed(2)+'"/><stop offset="'+pos.toFixed(3)+'" stop-color="'+mix(cL,cR,.5)+'" stop-opacity=".3"/><stop offset="1" stop-color="'+cR+'" stop-opacity="'+(.22+.7*P.DQ/100).toFixed(2)+'"/></linearGradient>'
  +'<clipPath id="'+id+'c"><rect width="'+W+'" height="'+H+'" rx="9"/></clipPath></defs>';
 h+='<g clip-path="url(#'+id+'c)"><rect width="'+W+'" height="'+H+'" fill="#252833"/><rect width="'+W+'" height="'+H+'" fill="url(#'+id+'g)"/>';
 var gain=o.gain||2, cw=W/7, bh=H-10;
 for(var q=0;q<7;q++){var v=clamp(P.seatMean[q]/10*gain,0,1), bw=cw*.6, bx=q*cw+(cw-bw)/2, hh=Math.max(1.5,v*bh);
  h+='<rect x="'+f1(bx)+'" y="'+f1(H-5-hh)+'" width="'+f1(bw)+'" height="'+f1(hh)+'" rx="3" fill="'+SEAT[q]+'" opacity=".5"/><rect x="'+f1(bx)+'" y="'+f1(H-5-hh)+'" width="'+f1(bw)+'" height="2.2" rx="1.1" fill="'+SEAT[q]+'" opacity=".95"><title>'+BANDS[q]+'</title></rect>';}
 h+='<rect id="'+id+'p" x="'+f1(x-pillW/2)+'" y="'+f1(H*.2)+'" width="'+f1(pillW)+'" height="'+f1(H*.6)+'" rx="'+f1(H*.3)+'" fill="#fff" opacity=".13"/>';
 h+='<path id="'+id+'l" d="M'+f1(x)+' 4V'+(H-4)+'" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></g>';
 h+='<rect width="'+W+'" height="'+H+'" rx="9" fill="none" stroke="rgba(255,255,255,.1)"/>';
 h+='<g transform="translate(24 '+H/2+')">'+lawRing(P,0,0,11.5,{tmax:3.6,tmin:.9,noorbit:true})+'</g>';
 h+='<text x="44" y="'+(H/2-1)+'" font-size="13" font-weight="700" fill="#EFEDE8" class="bt">CQ</text><text x="44" y="'+(H/2+13)+'" font-size="11" fill="#e3e8ec" font-weight="500" class="bt">'+Math.round(P.CQ)+'%</text>';
 h+='<g transform="translate('+(W-24)+' '+H/2+')">'+eclipse(P,0,0,11)+'</g>';
 h+='<text x="'+(W-44)+'" y="'+(H/2-1)+'" text-anchor="end" font-size="13" font-weight="700" fill="#EFEDE8" class="bt">DQ</text><text x="'+(W-44)+'" y="'+(H/2+13)+'" text-anchor="end" font-size="11" fill="#f0dcd8" font-weight="500" class="bt">'+Math.round(P.DQ)+'%</text>';
 h+='</svg>';
 reg(function(t){var l=document.getElementById(id+'l'); if(!l)return;
  var drift=Math.sin(t*.55)*.62+Math.sin(t*.23+1.1)*.38, dx=drift*((b/BAND_MAX)*W*.06+3);
  l.setAttribute('transform','translate('+f2(dx)+' 0)'); var p=document.getElementById(id+'p'); if(p)p.setAttribute('transform','translate('+f2(dx)+' 0)');});
 return h;}


/* the same bar, small, for the closed state and the phone strip: horizontal or standing */
function cqdqMini(P,len,th,vert){
 var id=uid('qm'), pos=oscPos(P), b=cqRange(P.CQ).band, w=vert?th:len, h=vert?len:th, x=pos*len;
 var o='<svg id="'+id+'" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" aria-hidden="true"><defs><linearGradient id="'+id+'g" x1="0" y1="0" x2="'+(vert?0:1)+'" y2="'+(vert?1:0)+'"><stop offset="0" stop-color="'+ELEM.cq+'" stop-opacity="'+(.3+.6*P.CQ/100).toFixed(2)+'"/><stop offset="'+pos.toFixed(3)+'" stop-color="'+mix(ELEM.cq,ELEM.dq,.5)+'" stop-opacity=".3"/><stop offset="1" stop-color="'+ELEM.dq+'" stop-opacity="'+(.25+.7*P.DQ/100).toFixed(2)+'"/></linearGradient></defs>'
  +'<rect width="'+w+'" height="'+h+'" rx="'+th/2+'" fill="#252833"/><rect width="'+w+'" height="'+h+'" rx="'+th/2+'" fill="url(#'+id+'g)"/>'
  +'<path id="'+id+'l" d="'+(vert?'M1 '+f1(x)+'H'+(w-1):'M'+f1(x)+' 1V'+(h-1))+'" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
 reg(function(t){var l=document.getElementById(id+'l'); if(!l)return; var d=(Math.sin(t*.55)*.62+Math.sin(t*.23+1.1)*.38)*((b/BAND_MAX)*len*.06+2);
  l.setAttribute('transform',vert?'translate(0 '+f2(d)+')':'translate('+f2(d)+' 0)');});
 return o;}

/* ============================================================
   ORIENTATION AND BALANCE, the two dials, as built: a bar or an arc. Same data, two drawings.
   ============================================================ */
/* round OT: benign is a HALO, malignant is a PITCHFORK, in the house grammar, ring and line and no fill */
function glyphBen(c){return '<g fill="none" stroke="'+c+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="6" ry="2.4"/><circle cx="12" cy="14.6" r="4.2"/><path d="M5.6 21.4c1-3 3.2-4.4 6.4-4.4s5.4 1.4 6.4 4.4"/></g>';}
function glyphMal(c){return '<g fill="none" stroke="'+c+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.4V9.6M6 9.6h12M6 9.6V4.6M12 9.6V3.2M18 9.6V4.6M9 14.2h6"/></g>';}
function glyphMasc(c){return '<g fill="none" stroke="'+c+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.2" cy="13.8" r="5"/><path d="M13.8 10.2L19 5M14.6 5H19v4.4"/></g>';}
function glyphFem(c){return '<g fill="none" stroke="'+c+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M12 14v7M8.8 18h6.4"/></g>';}
function dialSpec(P,which){
 if(which==='o'){return {L:{nm:'benign',v:P.ben,c:'#5FD5A6',g:glyphBen},R:{nm:'malignant',v:P.mal,c:'#D6524C',g:glyphMal}};}
 var m=Math.round((1+P.lean)/2*100); return {L:{nm:'masculine',v:m,c:'#DABF6A',g:glyphMasc},R:{nm:'feminine',v:100-m,c:'#C98BC0',g:glyphFem}};}
function ic(g,c,sz){return '<svg viewBox="0 0 24 24" width="'+(sz||18)+'" height="'+(sz||18)+'" aria-hidden="true">'+g(c)+'</svg>';}
function dialBar(P,which){
 var d=dialSpec(P,which), heavy=d.L.v>=d.R.v?-1:1, diff=Math.abs(d.L.v-d.R.v), col=heavy<0?d.L.c:d.R.c;
 var fill=heavy<0?'right:50%;width:'+f1(diff/2)+'%':'left:50%;width:'+f1(diff/2)+'%';
 return '<div class="drow" role="img" aria-label="'+d.L.nm+' '+d.L.v+', '+d.R.nm+' '+d.R.v+'"><div class="fill" style="'+fill+';background:'+col+';opacity:.62"></div><div class="mid"></div>'
  +'<div class="e l" style="color:'+d.L.c+'">'+ic(d.L.g,d.L.c,18)+'<i style="color:var(--ink)">'+d.L.v+'</i></div>'
  +'<div class="e r" style="color:'+d.R.c+'"><i style="color:var(--ink)">'+d.R.v+'</i>'+ic(d.R.g,d.R.c,18)+'</div></div>'
  +'<div class="poles"><span'+(heavy<0?' style="color:var(--ink);font-weight:600"':'')+'>'+d.L.nm+'</span><span'+(heavy>0?' style="color:var(--ink);font-weight:600"':'')+'>'+d.R.nm+'</span></div>';}
function dialArc(P,which,W){
 W=W||120; var d=dialSpec(P,which), heavy=d.L.v>=d.R.v?-1:1, diff=Math.abs(d.L.v-d.R.v), col=heavy<0?d.L.c:d.R.c, id=uid('da');
 var cx=60, cy=52, r=40, h='<svg viewBox="0 0 120 74" width="'+W+'" height="'+f1(W*74/120)+'" role="img" aria-label="'+d.L.nm+' '+d.L.v+', '+d.R.nm+' '+d.R.v+'">';
 h+='<path d="M'+(cx-r)+' '+cy+'A'+r+' '+r+' 0 0 1 '+(cx+r)+' '+cy+'" fill="none" stroke="rgba(255,255,255,.11)" stroke-width="6" stroke-linecap="round"/>';
 var ang=heavy*diff/100*90, a0=-Math.PI/2, a1=a0+ang*Math.PI/180, x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
 if(diff>0.5)h+='<path d="M'+cx+' '+(cy-r)+'A'+r+' '+r+' 0 0 '+(heavy>0?1:0)+' '+f1(x1)+' '+f1(y1)+'" fill="none" stroke="'+col+'" stroke-width="6" stroke-linecap="round" opacity=".85"/>';
 h+='<path d="M'+cx+' '+(cy-r-7)+'V'+(cy-r+7)+'" stroke="rgba(255,255,255,.4)" stroke-width="1.4"/>';
 h+='<g id="'+id+'" style="transform-origin:'+cx+'px '+cy+'px;transform:rotate('+f1(ang)+'deg)"><path d="M'+cx+' '+cy+'V'+(cy-r+10)+'" stroke="'+col+'" stroke-width="2" stroke-linecap="round"/><circle cx="'+cx+'" cy="'+cy+'" r="3.4" fill="#12141b" stroke="'+col+'" stroke-width="1.6"/></g>';
 h+='<g transform="translate(2 '+(cy-6)+') scale(.9)">'+d.L.g(d.L.c)+'</g><g transform="translate(97 '+(cy-6)+') scale(.9)">'+d.R.g(d.R.c)+'</g>';
 h+='</svg>';
 reg(function(t){var e=document.getElementById(id); if(!e)return; e.style.transform='rotate('+f2(ang+Math.sin(t*TAU/4.2)*0.9*(diff>0?1:0))+'deg)';});
 return h;}
function dialsBlock(P,style,o){
 o=o||{}; var s=style||'bar';
 var tg='<div class="styl" role="group" aria-label="Style"><button type="button" aria-pressed="'+(s==='bar')+'" aria-label="Bar" title="Bar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3" y="8" width="18" height="8" rx="3"/><path d="M12 8v8"/></svg></button>'
  +'<button type="button" aria-pressed="'+(s==='arc')+'" aria-label="Arc" title="Arc"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 17a8 8 0 0 1 16 0"/><path d="M12 17l3-5"/></svg></button></div>';
 var h='<div class="dials"><h3><span>Orientation and balance</span>'+tg+'</h3>';
 if(s==='arc'){h+='<div style="display:flex;gap:4px;justify-content:space-between">'
   +'<div style="flex:1;padding-right:8px"><div class="lbl" style="font-size:11.5px;color:var(--dim);font-weight:500;padding-left:2px">Orientation</div>'+dialArc(P,'o',o.aw||120)+'<div class="poles" style="padding:0"><span>benign</span><span>malignant</span></div></div>'
   +'<div style="flex:1;padding-left:8px"><div class="lbl" style="font-size:11.5px;color:var(--dim);font-weight:500;padding-left:2px">Balance</div>'+dialArc(P,'b',o.aw||120)+'<div class="poles" style="padding:0"><span>masculine</span><span>feminine</span></div></div></div>';}
 else{h+='<div style="margin-top:2px">'+dialBar(P,'o')+'</div><div style="margin-top:4px">'+dialBar(P,'b')+'</div>';}
 return h+'</div>';}

/* ============================================================
   THE REST OF THE RAIL, UNCHANGED FROM THE BUILD: the header row that folds the Root Energetics section (the celestial map lives
   inside it), and the Energy section with Awareness folded to its two lines. Real picks for the person, real rings.
   ============================================================ */
var CHEV='<svg class="chev" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10l5 5 5-5"/></svg>';
var FOLDI='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M9.5 4.5v15M15.5 9.5l-3 2.5 3 2.5"/></svg>';
function header(){return '<div class="rhead"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="#7EB8D4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.2"/><path d="M12 3.4v4.4M12 16.2v4.4M3.4 12h4.4M16.2 12h4.4"/></svg><b>Root Energetics</b><span class="chev" aria-hidden="true">'+CHEV+'</span><button type="button" class="fold" aria-label="Close the left column" title="Close the left column">'+FOLDI+'</button></div>';}
function awCircle(kind,o,P){
 var v=clamp(o.v||0,0,1), col=o.col;
 return '<span class="awc'+(v>=.18?' hot':'')+'" style="--c:'+col+';--bd:'+(-(Math.random()*0+ (o.d||0))).toFixed(2)+'s"><span class="disc"></span>'
  +'<svg class="arc" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="2.4"/><circle class="val" cx="20" cy="20" r="18" fill="none" stroke="'+col+'" stroke-width="2.4" stroke-linecap="round" pathLength="100" stroke-dasharray="'+f1(v*100)+' 100" transform="rotate(-90 20 20)"/></svg>'
  +'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="'+col+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="position:relative" aria-hidden="true"><path d="'+o.ic+'"/></svg></span>';}
function energy(P){
 var dm=P.doms[0], ar=P.arcs;
 var h='<div class="energy"><h3>Energy</h3>';
 h+='<button type="button" class="lhd" style="width:100%" aria-expanded="false"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="3.6"/></svg><span>Awareness</span>'+CHEV+'</button>';
 h+='<button type="button" class="awr" aria-label="Domain, '+dm.nm+'. Open the grids to change it."><span class="k">Domain</span><span class="cs">'+awCircle('dom',{v:dm.v,col:dm.col,ic:dm.ic,d:1.1},P)+'</span><span class="t">'+dm.nm+'</span></button>';
 h+='<button type="button" class="awr" aria-label="Archetype, '+ar.map(function(a){return a.nm;}).join(' and ')+'. Open the grids to change it."><span class="k">Archetype</span><span class="cs">'+ar.map(function(a,i){return awCircle('arch',{v:a.v,col:a.col,ic:a.ic,d:.4+i*1.3},P);}).join('')+'</span><span class="t">'+ar.map(function(a){return a.nm;}).join(' + ')+'</span></button>';
 return h+'</div>';}

/* the Marker used to say which option a screenshot is; kept off the rail */
function mountFrame(opt){
 var v=URL.get('v')||'1600', st=URL.get('s')||'open', P=person(URL.get('p')||'marcus'), host=document.getElementById('app');
 document.body.insertAdjacentHTML('afterbegin',defs());
 if(v==='390'){document.body.style.width='390px'; host.className='phone';}
 return {v:v,s:st,P:P,host:host};}

window.RL={RD:RD,SEAT:SEAT,BANDS:BANDS,TAU:TAU,clamp:clamp,lerp:lerp,f1:f1,f2:f2,uid:uid,tone:tone,mix:mix,reg:reg,rate:rate,person:person,seatNodes:seatNodes,
 U:U,seatU:seatU,seatDisp:seatDisp,darkest:darkest,lightest:lightest,seatDelay:seatDelay,dotPos:dotPos,dot:dot,cluster:cluster,lawRing:lawRing,lawOrder:lawOrder,eclipse:eclipse,
 vessel:vessel,iris:iris,arrow:arrow,sun:sun,triad:triad,band:band,wave:wave,dialsBlock:dialsBlock,dialBar:dialBar,dialArc:dialArc,header:header,energy:energy,
 mountFrame:mountFrame,lane:lane,cqRange:cqRange,oscPos:oscPos,cqdqBar:cqdqBar,cqdqMini:cqdqMini,ELEM:ELEM,defs:defs,CHEV:CHEV,FOLDI:FOLDI,ic:ic,URL:URL,STILL:STILL,arcPath:arcPath,nmDq:nmDq,dialSpec:dialSpec};
})();
