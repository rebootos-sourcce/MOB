/* ============================================================
   RAIL, SIMPLE. Three wordless instruments for the left column's readings.
   Mockup only. Nothing here is wired into atuned_src. Round OX.

   One reading, one symbol, and the symbol's colour and form carry it.

     CQ and DQ      one scale. Coherence is the light that fills it from the
                    origin, decoherence is the ground it stands on, and the
                    seam between them is the oscillation range: the width the
                    Compass drifts CQ across, cqRange in ui/personas.js,
                    2.5 + (1 - CQ/100)^2 x 26 points, drawn as a soft blend
                    whose midpoint swings inside it on the Compass's own drift.
     seven marks    the seven seats, root to crown, in their own colours,
                    standing in the decoherence ground as high as the charge on
                    their seat (gain two, as ui/component.js rbSeatShadow).
     vitality       yellow, the Solar seat. a vessel.
     awareness      indigo, the 3rd Eye seat. an iris.
     will           blue, the Throat seat. an arrow.
     radiance       all three at once: the quadratic mean of the three.
     flow           a live sine. smooth and full range when every seat passes
                    everything, choppy where a seat holds charge back (the
                    seven passes of flSeats, the same figure rbWavePts draws).
     orientation    a halo or a pitchfork, whichever the field is on.
     balance        a beam, tilted to the side that is carrying more.

   Two clocks. Live, it runs on requestAnimationFrame. Frozen, RS.clock holds a
   number of seconds and inst.draw() paints that instant, which is how the
   frame strips are made without a screen recorder.
   ============================================================ */
(function(root){
'use strict';
var TAU=Math.PI*2, UID=0;
var RS={clock:null, reduced:false};
root.RS=RS;
RS.now=function(){return RS.clock!==null?RS.clock:performance.now()/1000;};

function clamp(v,a,b){return v<a?a:(v>b?b:v);}
function smooth(t){t=clamp(t,0,1);return t*t*(3-2*t);}
function ease(t){t=clamp(t,0,1);return 1-Math.pow(1-t,3);}
function hex(h){h=h.replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function mix(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}
function css(c){return 'rgb('+Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2])+')';}
function rgba(c,a){if(typeof c==='string')c=hex(c);return 'rgba('+Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2])+','+(+a).toFixed(3)+')';}
function f1(v){return (+v).toFixed(1);}
function f2(v){return (+v).toFixed(2);}

/* the Compass's range, lifted as written from ui/personas.js cqRange */
function cqRange(cq){cq=clamp(cq,0,100);var sw=1-cq/100, band=2.5+sw*sw*26;
 return {cq:cq,band:band,lo:Math.max(0,cq-band/2),hi:Math.min(100,cq+band/2)};}
/* and its drift, as renderPol2 writes it */
function drift(t){return Math.sin(t*0.55)*0.62+Math.sin(t*0.23+1.1)*0.38;}

var PAL={
 seat:['#C4635E','#D19255','#D4BC70','#6FC5A3','#65B8D4','#8296DB','#A98BCE'],
 vit:'#D4BC70', aw:'#8296DB', wi:'#65B8D4',
 cq0:'#B9D8E8', cq1:'#6AA6C4', gnd:'#2D2327',
 halo:'#7EB8D4', fork:'#C4635E',
 blend:'screen'};
function pal(d){var p={},k;for(k in PAL)p[k]=PAL[k];if(d.pal)for(k in d.pal)p[k]=d.pal[k];return p;}

/* ---------- the wave, one picture of the chain, root to crown ----------
   rbWavePts in ui/component.js, with a phase added so it travels. */
function waveY(pass,cum,u,t,speed){
 var f=u*7, s=Math.min(6,Math.floor(f)), v=f-s;
 var a0=s===0?1:cum[s-1], A=a0+(cum[s]-a0)*v;
 var ld=1-pass[s], ldp=s>0?1-pass[s-1]:ld, ldn=s<6?1-pass[s+1]:ld,
  L=v<.5?ldp+(ld-ldp)*(v+.5):ld+(ldn-ld)*(v-.5);
 var ph=t*speed;
 var base=Math.sin(Math.PI*4*u-ph),
  chop=L*(.55*Math.sin(TAU*(7*2.1)*u+s*1.9+ph*1.7)+.3*Math.sin(TAU*(7*3.3)*u+s*.7-ph*2.3));
 return clamp(.5+.5*(A*base+chop),0,1);}
function cumOf(pass){var c=1,o=[];for(var i=0;i<7;i++){c*=pass[i];o.push(c);}return o;}

/* ---------- the seam, as gradient stops ---------- */
function seam(q,band,dr,c0,c1,g){
 var lo=clamp(q-band/2,0,100), hi=clamp(q+band/2,0,100);
 var live=clamp(q+dr*band/2,lo,hi), m=hi>lo?clamp((live-lo)/(hi-lo),.1,.9):.5;
 var gam=Math.log(.5)/Math.log(m), st=[[0,c0],[lo/100,c1]], n=6, i;
 for(i=1;i<n;i++){var f=i/n; st.push([(lo+(hi-lo)*f)/100,mix(c1,g,smooth(Math.pow(f,gam)))]);}
 st.push([hi/100,g]); st.push([1,g]);
 return {st:st,lo:lo,hi:hi,live:live};}

/* ---------- glyph silhouettes, 40 x 40 ---------- */
var GL={
 vessel:{clip:'M9 5H31C31 15 27 21 20 23C13 21 9 15 9 5Z', ink:'M9 5H31C31 15 27 21 20 23C13 21 9 15 9 5ZM20 23V32M13 35H27', top:5, bot:23},
 iris:{clip:'M20 5a15 15 0 100 30a15 15 0 100-30Z', ink:'M20 5a15 15 0 100 30a15 15 0 100-30ZM20 15.5a4.5 4.5 0 100 9a4.5 4.5 0 100-9Z', top:5, bot:35},
 arrow:{clip:'M20 4L33 19H25V34H15V19H7Z', ink:'M20 4L33 19H25V34H15V19H7Z', top:4, bot:34},
 disc:{clip:'M20 11.5a8.5 8.5 0 100 17a8.5 8.5 0 100-17Z', ink:'M20 11.5a8.5 8.5 0 100 17a8.5 8.5 0 100-17Z', top:11.5, bot:28.5}};
function haloSvg(c,a){return '<g opacity="'+a+'" fill="none" stroke="'+c+'" stroke-width="1.5" stroke-linecap="round">'
 +'<ellipse cx="0" cy="-3.2" rx="7.2" ry="2.8"/><path d="M-6.4 4.2Q0 -1.6 6.4 4.2" opacity=".6"/></g>';}
function forkSvg(c,a){return '<g opacity="'+a+'" fill="none" stroke="'+c+'" stroke-width="1.5" stroke-linecap="round">'
 +'<path d="M0 7.5V0M-5.5 0V-6M0 0V-7.5M5.5 0V-6M-6 0H6"/></g>';}
function beamSvg(){return '<path class="bm-post" d="M0 -9V9M-7 9H7"/><g class="bm-beam"><path d="M-12 -9H12"/>'
 +'<g class="bm-l"><path d="M-12 -9L-14.5 -2M-12 -9L-9.5 -2"/><path d="M-15 -2Q-12 2.5 -9 -2Z"/></g>'
 +'<g class="bm-r"><path d="M12 -9L9.5 -2M12 -9L14.5 -2"/><path d="M9 -2Q12 2.5 15 -2Z"/></g></g>';}

/* ---------- a liquid layer for a silhouette ---------- */
function liquidPath(ys,amp,ph,w){
 var d='M-2 '+f1(ys+amp*Math.sin(-2*.32+ph)), x;
 for(x=2;x<=42;x+=4)d+='L'+x+' '+f1(ys+amp*Math.sin(x*.32+ph));
 return d+'L42 44L-2 44Z';}
function surfacePath(ys,amp,ph){
 var d='M-2 '+f1(ys+amp*Math.sin(-2*.32+ph)), x;
 for(x=2;x<=42;x+=4)d+='L'+x+' '+f1(ys+amp*Math.sin(x*.32+ph));
 return d;}

/* the tooltips are the only place the names live */
function say(d){
 if(d.unread)return 'Nothing read yet.';
 return 'Coherence '+Math.round(d.cq)+'. Decoherence '+Math.round(d.dq)+'. Vitality '+f2(d.x)+'. Awareness '+f2(d.y)
  +'. Will '+f2(d.z)+'. Radiance '+f2(d.rad)+'. Flow '+f2(d.flow)+'. '+(d.benign?'Benign, a halo.':'Malignant, a pitchfork.');}


/* ---------- one liquid gauge, shared by the wide build and the closed one ---------- */
function gInner(id,j,kn,col,P,title){
 var g=GL[kn];
 return '<title>'+title+'</title>'+(kn==='disc'?'<g class="rays"></g>':'')
  +'<g clip-path="url(#'+id+'k'+j+')"><path class="lq1" fill="'+(col?rgba(col,.30):'url(#'+id+'t)')+'" opacity="'+(col?1:.34)+'"/><path class="lq2" fill="'+(col?rgba(col,.55):'url(#'+id+'t)')+'" opacity="'+(col?1:.7)+'"/>'
  +'<path class="sf" fill="none" stroke-width="1.6" stroke="'+(col||'#fff')+'" opacity=".95"/></g>'
  +'<path class="ik" d="'+g.ink+'" fill="none" stroke="'+(col||'var(--ink,#EFEDE8)')+'" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>';}
function gRefs(g){return {lq1:g.querySelector('.lq1'),lq2:g.querySelector('.lq2'),sf:g.querySelector('.sf'),ik:g.querySelector('.ik'),rays:g.querySelector('.rays')};}
function gUpd(r,kn,L,t,j,un,rad,ar,P){
 var gl=GL[kn];
 if(!RS.reduced&&!un)L*=1+.012*Math.sin(t*1.3+j);
 var ys=gl.bot-(gl.bot-gl.top)*L, amp=RS.reduced?0:(L>.02&&L<.98?.9:0), ph=t*2.3+j*1.7;
 r.lq1.setAttribute('d',liquidPath(ys,amp,ph+1.6)); r.lq2.setAttribute('d',liquidPath(ys,amp*.8,ph));
 r.sf.setAttribute('d',L>.02?surfacePath(ys,amp*.8,ph):''); r.sf.setAttribute('opacity',L>.02&&L<.985?.9:0);
 r.ik.setAttribute('opacity',un?.38:1);
 if(r.rays){var R='',ni=9, len=2+7*(un?0:rad)*ar, al=un?.25:(.35+.65*rad), cols=[P.vit,P.aw,P.wi];
  for(var n=0;n<ni;n++){var an=n/ni*TAU+(RS.reduced?0:t*.12), c=Math.cos(an), s=Math.sin(an);
   R+='<path d="M'+f1(20+c*13)+' '+f1(20+s*13)+'L'+f1(20+c*(13+len))+' '+f1(20+s*(13+len))+'" stroke="'+cols[n%3]+'" stroke-width="1.8" stroke-linecap="round" opacity="'+f2(al)+'"/>';}
  r.rays.innerHTML=R;}}
function gDefs(id,P){var h='<linearGradient id="'+id+'t" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="'+P.vit+'"/><stop offset=".5" stop-color="'+P.aw+'"/><stop offset="1" stop-color="'+P.wi+'"/></linearGradient>';
 ['vessel','iris','arrow','disc'].forEach(function(k,j){h+='<clipPath id="'+id+'k'+j+'"><path d="'+GL[k].clip+'"/></clipPath>';});return h;}
function tiltBeam(el,un,lean,ar){var bb=el.querySelector('.bm-beam'); bb.setAttribute('transform','translate(0 -9) rotate('+f1(un?0:-clamp(lean,-1,1)*20*ar)+') translate(0 9)');}

var BUILD={};

/* ============================================================
   A. ONE BAR, FOUR GAUGES, ONE WAVE.
   ============================================================ */
BUILD.a=function(inst,W,o){
 var d=inst.d, P=pal(d), H=138, id='a'+inst.id, un=!!d.unread;
 var bx=26, bw=W-52, by=2, bh=30;
 var cp=cumOf(d.pass), rg=cqRange(d.cq);
 var slot=bw/5, gy=56, gs=38;
 var kinds=[['vessel',P.vit,'x','Vitality'],['iris',P.aw,'y','Awareness'],['arrow',P.wi,'z','Will'],['disc',null,'rad','Radiance']];
 var h='<svg class="rs-svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+say(d)+'"><title>'+say(d)+'</title><defs>'
  +'<clipPath id="'+id+'b"><rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="'+(bh/2)+'"/></clipPath>'
  +'<linearGradient id="'+id+'g" gradientUnits="userSpaceOnUse" x1="'+bx+'" y1="0" x2="'+(bx+bw)+'" y2="0">';
 for(var i=0;i<9;i++)h+='<stop class="sg" offset="0" stop-color="#000"/>';
 h+='</linearGradient><linearGradient id="'+id+'w" gradientUnits="userSpaceOnUse" x1="'+bx+'" y1="0" x2="'+(bx+bw)+'" y2="0">';
 for(i=0;i<7;i++)h+='<stop offset="'+((i+.5)/7).toFixed(3)+'" stop-color="'+P.seat[i]+'"/>';
 h+='</linearGradient>'
  +'<linearGradient id="'+id+'s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>'
  +'<radialGradient id="'+id+'c"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'
  +'<linearGradient id="'+id+'t" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="'+P.vit+'"/><stop offset=".5" stop-color="'+P.aw+'"/><stop offset="1" stop-color="'+P.wi+'"/></linearGradient>';
 kinds.forEach(function(k,j){h+='<clipPath id="'+id+'k'+j+'"><path d="'+GL[k[0]].clip+'"/></clipPath>';});
 h+='</defs>';
 /* the bar */
 h+='<g clip-path="url(#'+id+'b)"><rect class="bar" x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" fill="url(#'+id+'g)"/>'
  +'<g class="mk">';
 for(i=0;i<7;i++)h+='<rect x="0" y="0" width="2" height="2" rx="1" fill="'+P.seat[i]+'"/>';
 h+='</g><rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" fill="url(#'+id+'s)"/>'
  +'<ellipse class="glint" cx="0" cy="'+(by+bh/2)+'" rx="9" ry="'+(bh/2)+'" fill="url(#'+id+'c)"/></g>'
  +'<rect x="'+(bx+.5)+'" y="'+(by+.5)+'" width="'+(bw-1)+'" height="'+(bh-1)+'" rx="'+(bh/2-.5)+'" fill="none" stroke="var(--edge-2,rgba(255,255,255,.14))"/>';
 /* orientation caps */
 h+='<g class="hal" transform="translate(13 '+(by+bh/2)+')">'+haloSvg(P.halo,1)+'</g>'
  +'<g class="frk" transform="translate('+(W-13)+' '+(by+bh/2+1)+')">'+forkSvg(P.fork,1)+'</g>';
 /* the two names, the only words */
 h+='<text class="lb" x="'+bx+'" y="48">CQ</text><text class="nm cqn" x="'+(bx+20)+'" y="48">'+(un?'–':Math.round(d.cq))+'</text>'
  +'<text class="nm dqn" x="'+(bx+bw-20)+'" y="48" text-anchor="end">'+(un?'–':Math.round(d.dq))+'</text><text class="lb" x="'+(bx+bw)+'" y="48" text-anchor="end">DQ</text>';
 /* the gauges */
 kinds.forEach(function(k,j){var cx=bx+slot*(j+.5);
  h+='<g class="gz" transform="translate('+(cx-gs/2)+' '+gy+') scale('+(gs/40)+')">'+gInner(id,j,k[0],k[1],P,k[3]+' '+(un?'not read':f2(d[k[2]])))+'</g>';});
 h+='<g class="bal" transform="translate('+(bx+slot*4.5)+' '+(gy+19)+')"><title>Balance '+(un?'not read':(d.lean>0.02?'outward':(d.lean<-0.02?'inward':'level')))+'</title>'+beamSvg()+'</g>';
 /* the wave, with the whole range drawn as two hairlines behind it */
 var wy=104, wh=28;
 h+='<path d="M'+bx+' '+(wy+1)+'H'+(bx+bw)+'M'+bx+' '+(wy+wh-1)+'H'+(bx+bw)+'" stroke="var(--edge,rgba(255,255,255,.09))" stroke-width="1" stroke-dasharray="1 3" fill="none"/>'
  +'<path class="wv" fill="none" stroke="url(#'+id+'w)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/></svg>';
 inst.host.innerHTML=h;
 var q=function(s){return inst.host.querySelector(s);}, qa=function(s){return [].slice.call(inst.host.querySelectorAll(s));};
 var stops=qa('.sg'), mk=qa('.mk rect'), glint=q('.glint'), bar=q('.bar'), wv=q('.wv');
 var gz=qa('.gz'), halo=q('.hal'), frk=q('.frk'), bam=q('.bal');
 var ik=gz.map(gRefs);
 var N=120, g0=hex(P.gnd), c0=hex(P.cq0), c1=hex(P.cq1);
 if(un){bar.setAttribute('fill',rgba(P.gnd,.55));}
 return function(t,age){
  var ar=RS.reduced?1:ease(age/1.1), dr=RS.reduced?0:drift(t);
  /* the bar */
  if(!un){
   var qq=d.cq*ar, bd=rg.band*ar, S=seam(qq,bd,dr,c0,c1,g0);
   for(var i=0;i<9;i++){var s=S.st[i]||S.st[S.st.length-1]; stops[i].setAttribute('offset',s[0].toFixed(4)); stops[i].setAttribute('stop-color',css(s[1]));}
   var xa=bx+bw*(S.hi/100)+3, xb=bx+bw-4, pitch=(xb-xa)/7;
   for(i=0;i<7;i++){var r=mk[i], sh=clamp(d.seatShadow[i]*2,0,1)*ar, br=RS.reduced?1:(1+.07*Math.sin(t*1.5+i*.9)),
     hh=pitch<1?0:Math.max(2.2,sh*br*(bh-7)), mw=Math.max(1.1,Math.min(7,pitch*.44));
    if(pitch<1.6){r.setAttribute('height',0);continue;}
    r.setAttribute('x',f1(xa+(i+.5)*pitch-mw/2)); r.setAttribute('width',f1(mw));
    r.setAttribute('y',f1(by+bh-hh-1)); r.setAttribute('height',f1(hh)); r.setAttribute('opacity',(.55+.45*sh).toFixed(2));}
   glint.setAttribute('cx',f1(bx+bw*S.live/100)); glint.setAttribute('opacity',(.55*ar).toFixed(2));
  }else{
   for(i=0;i<7;i++){var rr=mk[i],pp=(bw-12)/7;rr.setAttribute('x',f1(bx+6+(i+.5)*pp-1.2));rr.setAttribute('width',2.4);rr.setAttribute('y',by+bh-5);rr.setAttribute('height',3);rr.setAttribute('opacity',.35);}
   var gx=bx+((t*18)%(bw+60))-30; glint.setAttribute('cx',f1(gx)); glint.setAttribute('opacity',.18);
  }
  halo.setAttribute('opacity',un?.22:(d.benign?1:.28)); frk.setAttribute('opacity',un?.22:(d.benign?.28:1));
  /* the gauges */
  var vals=[d.x,d.y,d.z,d.rad];
  gz.forEach(function(g,j){gUpd(ik[j],kinds[j][0],un?0:clamp(vals[j],0,1)*ease(age/1.0-j*.08),t,j,un,d.rad,ar,P);});
  /* balance */
  var tilt=un?0:-clamp(d.lean,-1,1)*20*ar;
  var bb=bam.querySelector('.bm-beam'); bb.setAttribute('transform','translate(0 -9) rotate('+f1(tilt)+') translate(0 9)');
  /* the beam's pans hang from the beam, so they counter-rotate to stay under it */
  /* the wave */
  var A=un?0:1, dd='';
  for(i=0;i<=N;i++){var u=i/N, y01=un?.5+.04*Math.sin(TAU*3*u-t*1.4):waveY(d.pass,cp,u,t,1.5);
   if(!un&&ar<1)y01=.5+(y01-.5)*ar;
   dd+=(i?'L':'M')+f1(bx+bw*u)+' '+f1(wy+2+(wh-4)*(1-y01));}
  wv.setAttribute('d',dd); wv.setAttribute('opacity',un?.35:1);
 };};

/* ============================================================
   B. ONE RING.
   ============================================================ */
BUILD.b=function(inst,W,o){
 var d=inst.d, P=pal(d), H=146, id='b'+inst.id, un=!!d.unread;
 var cx=W/2, cy=73, RI=48, RO=60, RW=66, SW0=210, SWEEP=300;
 var cp=cumOf(d.pass), rg=cqRange(d.cq);
 var lamp=[['iris',P.aw,'y',0,-20],['vessel',P.vit,'x',-18,11],['arrow',P.wi,'z',18,11]];
 var h='<div class="rs-ring" style="position:relative;width:'+W+'px;height:'+H+'px">'
  +'<div class="cone" style="position:absolute;left:'+(cx-RO)+'px;top:'+(cy-RO)+'px;width:'+(RO*2)+'px;height:'+(RO*2)+'px;border-radius:50%;'
  +'-webkit-mask:radial-gradient(circle at 50% 50%,transparent 0 '+(RI-.6)+'px,#000 '+(RI+.4)+'px '+(RO-.9)+'px,transparent '+(RO-.1)+'px);'
  +'mask:radial-gradient(circle at 50% 50%,transparent 0 '+(RI-.6)+'px,#000 '+(RI+.4)+'px '+(RO-.9)+'px,transparent '+(RO-.1)+'px)"></div>'
  +'<svg class="rs-svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+say(d)+'" style="position:absolute;left:0;top:0"><title>'+say(d)+'</title><defs>';
 lamp.forEach(function(l,j){h+='<radialGradient id="'+id+'l'+j+'"><stop offset="0" stop-color="'+l[1]+'" stop-opacity=".62"/><stop offset=".55" stop-color="'+l[1]+'" stop-opacity=".22"/><stop offset="1" stop-color="'+l[1]+'" stop-opacity="0"/></radialGradient>';});
 h+='<radialGradient id="'+id+'r"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".4" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'
  +'<clipPath id="'+id+'in"><circle cx="'+cx+'" cy="'+cy+'" r="'+(RI-2)+'"/></clipPath></defs>';
 /* the inner ring's hairline, so the track has an edge on the ground */
 h+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(RO-.5)+'" fill="none" stroke="var(--edge,rgba(255,255,255,.09))" stroke-dasharray="0"/>'
  +'<g class="mk">';
 for(var i=0;i<7;i++)h+='<line stroke="'+P.seat[i]+'" stroke-linecap="round"/>';
 h+='</g>';
 /* the wave is the ring's edge: seven sectors, one per seat, in the seat's colour */
 for(i=0;i<7;i++)h+='<path class="ws" fill="none" stroke="'+P.seat[i]+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>';
 /* the three lamps, light adding to light, and where they meet is radiance */
 h+='<g clip-path="url(#'+id+'in)"><g style="isolation:isolate">';
 lamp.forEach(function(l,j){h+='<circle class="lp" cx="'+f1(cx+l[3])+'" cy="'+f1(cy+l[4])+'" r="10" fill="url(#'+id+'l'+j+')" style="mix-blend-mode:'+P.blend+'"/>';});
 h+='<circle class="rd" cx="'+cx+'" cy="'+(cy+2.5)+'" r="10" fill="url(#'+id+'r)" style="mix-blend-mode:'+P.blend+'"/></g></g>';
 lamp.forEach(function(l,j){var g=GL[l[0]];
  h+='<g class="gl" transform="translate('+f1(cx+l[3]-9)+' '+f1(cy+l[4]-9)+') scale('+(18/40)+')"><title>'+['Awareness','Vitality','Will'][j]+' '+(un?'not read':f2(d[l[2]]))+'</title>'
   +'<path class="ik" d="'+g.ink+'" fill="none" stroke="'+l[1]+'" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/></g>';});
 /* radiance: a small sun at the meeting point, all three colours */
 h+='<g class="sun" transform="translate('+cx+' '+(cy+2.5)+')"><title>Radiance '+(un?'not read':f2(d.rad))+'</title><circle r="2.8" fill="none" stroke="var(--ink,#EFEDE8)" stroke-width="1.1"/><g class="rys"></g></g>';
 /* orientation and the two names */
 h+='<g class="hal" transform="translate(21 '+(cy-22)+')">'+haloSvg(P.halo,1)+'</g><g class="frk" transform="translate('+(W-21)+' '+(cy-21)+')">'+forkSvg(P.fork,1)+'</g>'
  +'<text class="lb" x="20" y="'+(cy+2)+'" text-anchor="middle">CQ</text><text class="nm cqn big" x="20" y="'+(cy+20)+'" text-anchor="middle">'+(un?'–':Math.round(d.cq))+'</text>'
  +'<text class="lb" x="'+(W-20)+'" y="'+(cy+2)+'" text-anchor="middle">DQ</text><text class="nm dqn big" x="'+(W-20)+'" y="'+(cy+20)+'" text-anchor="middle">'+(un?'–':Math.round(d.dq))+'</text>';
 h+='<g class="bal" transform="translate('+cx+' '+(cy+RO+6)+') scale(.9)"><title>Balance '+(un?'not read':(d.lean>0.02?'outward':(d.lean<-0.02?'inward':'level')))+'</title>'+beamSvg()+'</g></svg></div>';
 inst.host.innerHTML=h;
 var q=function(s){return inst.host.querySelector(s);}, qa=function(s){return [].slice.call(inst.host.querySelectorAll(s));};
 var cone=q('.cone'), mk=qa('.mk line'), ws=qa('.ws'), lp=qa('.lp'), rd=q('.rd'), gl=qa('.gl'), rys=q('.rys'), hal=q('.hal'), frk=q('.frk'), bam=q('.bal');
 var g0=hex(P.gnd), c0=hex(P.cq0), c1=hex(P.cq1);
 function ang(v){return (SW0+SWEEP*v/100)*Math.PI/180;}      // clockwise from 12 o'clock, in radians
 function pt(a,r){return [cx+r*Math.sin(a), cy-r*Math.cos(a)];}
 return function(t,age){
  var ar=RS.reduced?1:ease(age/1.2), dr=RS.reduced?0:drift(t);
  if(!un){
   var qq=d.cq*ar, bd=rg.band*ar, S=seam(qq,bd,dr,c0,c1,g0), bg='conic-gradient(from '+SW0+'deg,';
   S.st.forEach(function(s,i){bg+=(i?',':'')+css(s[1])+' '+f2(s[0]*SWEEP)+'deg';});
   bg+=',transparent '+SWEEP+'deg)'; cone.style.background=bg;
   var a0=S.hi+2.2, a1=98.6, pitch=(a1-a0)/7;
   for(var i=0;i<7;i++){var l=mk[i];
    if(pitch<.9){l.setAttribute('opacity',0);continue;}
    var sh=clamp(d.seatShadow[i]*2,0,1)*ar, br=RS.reduced?1:(1+.07*Math.sin(t*1.5+i*.9)), len=Math.max(2,sh*br*(RO-RI-3)),
     a=ang(a0+(i+.5)*pitch), p0=pt(a,RI+1.2), p1=pt(a,RI+1.2+len);
    l.setAttribute('x1',f1(p0[0]));l.setAttribute('y1',f1(p0[1]));l.setAttribute('x2',f1(p1[0]));l.setAttribute('y2',f1(p1[1]));
    l.setAttribute('stroke-width',f1(Math.max(1.2,Math.min(3.2,pitch*SWEEP/100*Math.PI/180*(RI+3)*.5)))); l.setAttribute('opacity',(.55+.45*sh).toFixed(2));}
  }else{
   cone.style.background='conic-gradient(from '+SW0+'deg,'+rgba(P.gnd,.5)+' 0deg,'+rgba(P.gnd,.5)+' '+SWEEP+'deg,transparent '+SWEEP+'deg)';
   for(i=0;i<7;i++){var l2=mk[i],a2=ang(6+(i+.5)*88/7),pa=pt(a2,RI+1.2),pb=pt(a2,RI+3.6);
    l2.setAttribute('x1',f1(pa[0]));l2.setAttribute('y1',f1(pa[1]));l2.setAttribute('x2',f1(pb[0]));l2.setAttribute('y2',f1(pb[1]));l2.setAttribute('stroke-width',2.2);l2.setAttribute('opacity',.35);}
  }
  hal.setAttribute('opacity',un?.22:(d.benign?1:.28)); frk.setAttribute('opacity',un?.22:(d.benign?.28:1));
  /* the wave: the ring's edge. seven sectors, root at the start of the sweep. */
  var N=168, per=N/7;
  for(i=0;i<7;i++){var dd='';
   for(var k=Math.round(i*per);k<=Math.round((i+1)*per);k++){var u=k/N, y01=un?.5+.05*Math.sin(TAU*3*u-t*1.4):waveY(d.pass,cp,u,t,1.5);
    if(!un&&ar<1)y01=.5+(y01-.5)*ar;
    var pp=pt(ang(u*100),RW+(y01-.5)*2*4.6);
    dd+=(k===Math.round(i*per)?'M':'L')+f1(pp[0])+' '+f1(pp[1]);}
   ws[i].setAttribute('d',dd); ws[i].setAttribute('opacity',un?.35:1);}
  /* the lamps */
  var vals=[d.y,d.x,d.z];
  lp.forEach(function(c,j){var v=un?0:clamp(vals[j],0,1)*ease(age/1.1-j*.08), br=RS.reduced?0:.05*Math.sin(t*1.1+j*2.1);
   c.setAttribute('r',f1(8+(v+br)*30)); c.setAttribute('opacity',un?0:.45+.55*v);});
  gl.forEach(function(g,j){g.querySelector('.ik').setAttribute('opacity',un?.38:(.72+.28*clamp(vals[j],0,1)));});
  /* the sun: its rays are the radiance */
  var rad=un?0:d.rad*ar;
  rd.setAttribute('r',f1(5+rad*13)); rd.setAttribute('opacity',un?0:(.25+.75*rad));
  var R='', cols=[P.vit,P.aw,P.wi], ni=9, len=1.2+3.2*rad;
  for(var n=0;n<ni;n++){var an=n/ni*TAU+(RS.reduced?0:t*.12), c=Math.cos(an), s=Math.sin(an);
   R+='<path d="M'+f1(c*4.8)+' '+f1(s*4.8)+'L'+f1(c*(4.8+len))+' '+f1(s*(4.8+len))+'" stroke="'+(un?'var(--dim,#94908A)':cols[n%3])+'" stroke-width="1.5" stroke-linecap="round" opacity="'+(un?.35:f2(.4+.6*rad))+'"/>';}
  rys.innerHTML=R;
  var bb=bam.querySelector('.bm-beam'); bb.setAttribute('transform','translate(0 -9) rotate('+f1(un?0:-clamp(d.lean,-1,1)*20*ar)+') translate(0 9)');
 };};

/* ============================================================
   C. ONE SPINE.
   ============================================================ */
BUILD.c=function(inst,W,o){
 var d=inst.d, P=pal(d), H=150, id='c'+inst.id, un=!!d.unread;
 var sl=!!o.slim, sx=sl?5:44, sw=sl?14:20, sy=26, sh=98;                 // the tube
 var wx0=sl?24:70, wx1=sl?44:124;                            // the wave's box, same height as the tube
 var tx=[150,180,210], ty0=40, ty1=112;           // the three thin tubes
 var cp=cumOf(d.pass), rg=cqRange(d.cq);
 var els=[['vessel',P.vit,'x','Vitality'],['iris',P.aw,'y','Awareness'],['arrow',P.wi,'z','Will']];
 var h='<svg class="rs-svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+say(d)+'"><title>'+say(d)+'</title><defs>'
  +'<clipPath id="'+id+'t"><rect x="'+sx+'" y="'+sy+'" width="'+sw+'" height="'+sh+'" rx="'+(sw/2)+'"/></clipPath>'
  +'<linearGradient id="'+id+'g" gradientUnits="userSpaceOnUse" x1="0" y1="'+(sy+sh)+'" x2="0" y2="'+sy+'">';
 for(var i=0;i<9;i++)h+='<stop class="sg" offset="0" stop-color="#000"/>';
 h+='</linearGradient><linearGradient id="'+id+'w" gradientUnits="userSpaceOnUse" x1="0" y1="'+(sy+sh)+'" x2="0" y2="'+sy+'">';
 for(i=0;i<7;i++)h+='<stop offset="'+((i+.5)/7).toFixed(3)+'" stop-color="'+P.seat[i]+'"/>';
 h+='</linearGradient>'
  +'<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>'
  +'<radialGradient id="'+id+'c"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>';
 els.forEach(function(e,j){h+='<clipPath id="'+id+'u'+j+'"><rect x="'+(tx[j]-3.5)+'" y="'+ty0+'" width="7" height="'+(ty1-ty0)+'" rx="3.5"/></clipPath>'
  +'<clipPath id="'+id+'k'+j+'"><path d="'+GL[e[0]].clip+'"/></clipPath>';});
 h+='<clipPath id="'+id+'d"><path d="'+GL.disc.clip+'"/></clipPath>'
  +'<linearGradient id="'+id+'x" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="'+P.vit+'"/><stop offset=".5" stop-color="'+P.aw+'"/><stop offset="1" stop-color="'+P.wi+'"/></linearGradient></defs><g transform="translate('+(sl?0:Math.max(0,(W-262)/2))+' 0)">';
 /* the spine */
 h+='<g clip-path="url(#'+id+'t)"><rect class="bar" x="'+sx+'" y="'+sy+'" width="'+sw+'" height="'+sh+'" fill="url(#'+id+'g)"/><g class="mk">';
 for(i=0;i<7;i++)h+='<rect rx="1" fill="'+P.seat[i]+'"/>';
 h+='</g><rect x="'+sx+'" y="'+sy+'" width="'+sw+'" height="'+sh+'" fill="url(#'+id+'s)"/>'
  +'<ellipse class="glint" cx="'+(sx+sw/2)+'" cy="0" rx="'+(sw/2)+'" ry="9" fill="url(#'+id+'c)"/></g>'
  +'<rect x="'+(sx+.5)+'" y="'+(sy+.5)+'" width="'+(sw-1)+'" height="'+(sh-1)+'" rx="'+(sw/2-.5)+'" fill="none" stroke="var(--edge-2,rgba(255,255,255,.14))"/>'
  +'<g class="hal" transform="translate('+(sx+sw/2)+' 13)">'+haloSvg(P.halo,1)+'</g><g class="frk" transform="translate('+(sx+sw/2)+' '+(sy+sh+17)+')">'+forkSvg(P.fork,1)+'</g>';
 /* the names ride the spine's left edge: CQ at the seam, DQ at the head of the ground */
 h+='<text class="lb cql" x="'+(sx-6)+'" y="0" text-anchor="end">CQ</text><text class="nm cqn" x="'+(sx-6)+'" y="0" text-anchor="end">'+(un?'–':Math.round(d.cq))+'</text>'
  +'<text class="lb dql" x="'+(sx-6)+'" y="'+(sy+8)+'" text-anchor="end">DQ</text><text class="nm dqn" x="'+(sx-6)+'" y="'+(sy+22)+'" text-anchor="end">'+(un?'–':Math.round(d.dq))+'</text>';
 /* the wave, vertical, root at the foot, crown at the head, the spine's own seven seats */
 h+='<path d="M'+(wx0+1)+' '+sy+'V'+(sy+sh)+'M'+(wx1-1)+' '+sy+'V'+(sy+sh)+'" stroke="var(--edge,rgba(255,255,255,.09))" stroke-width="1" stroke-dasharray="1 3" fill="none"/>'
  +'<path class="wv" fill="none" stroke="url(#'+id+'w)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>';
 /* three thin tubes, each ending in its own bulb */
 els.forEach(function(e,j){var g=GL[e[0]];
  h+='<g class="tb"><title>'+e[3]+' '+(un?'not read':f2(d[e[2]]))+'</title>'
   +'<rect x="'+(tx[j]-3.5)+'" y="'+ty0+'" width="7" height="'+(ty1-ty0)+'" rx="3.5" fill="'+rgba(e[1],.10)+'"/>'
   +'<g clip-path="url(#'+id+'u'+j+')"><rect class="fl" x="'+(tx[j]-4)+'" width="8" fill="'+rgba(e[1],.85)+'"/></g>'
   +'<rect x="'+(tx[j]-3)+'" y="'+(ty0+.5)+'" width="6" height="'+(ty1-ty0-1)+'" rx="3" fill="none" stroke="'+rgba(e[1],.55)+'"/></g>'
   +'<g class="bu" transform="translate('+(tx[j]-12)+' '+(ty1-1)+') scale('+(24/40)+')"><g clip-path="url(#'+id+'k'+j+')"><rect class="bf" x="0" y="0" width="40" height="40" fill="'+rgba(e[1],.45)+'"/></g>'
   +'<path d="'+g.ink+'" fill="none" stroke="'+e[1]+'" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/></g>';});
 /* the sun over the three */
 h+='<g class="sun" transform="translate('+tx[1]+' 16)"><title>Radiance '+(un?'not read':f2(d.rad))+'</title><g class="rays"></g>'
  +'<circle r="7" fill="none" stroke="var(--ink,#EFEDE8)" stroke-width="1.3"/>'
  +'<clipPath id="'+id+'dc"><circle r="6.2"/></clipPath><g clip-path="url(#'+id+'dc)"><rect class="sl" x="-8" width="16" fill="url(#'+id+'x)"/></g></g>';
 h+='<g class="bal" transform="translate(238 '+(sy+sh/2)+')"><title>Balance '+(un?'not read':(d.lean>0.02?'outward':(d.lean<-0.02?'inward':'level')))+'</title>'+beamSvg()+'</g></g></svg>';
 inst.host.innerHTML=h;
 var q=function(s){return inst.host.querySelector(s);}, qa=function(s){return [].slice.call(inst.host.querySelectorAll(s));};
 var stops=qa('.sg'), mk=qa('.mk rect'), glint=q('.glint'), bar=q('.bar'), wv=q('.wv'), fl=qa('.fl'), bf=qa('.bf'), hal=q('.hal'), frk=q('.frk'),
  rays=q('.sun .rays'), sl=q('.sl'), bam=q('.bal'), cql=q('.cql'), cqn=q('.cqn');
 var g0=hex(P.gnd), c0=hex(P.cq0), c1=hex(P.cq1);
 if(un)bar.setAttribute('fill',rgba(P.gnd,.55));
 return function(t,age){
  var ar=RS.reduced?1:ease(age/1.2), dr=RS.reduced?0:drift(t), i;
  if(!un){
   var qq=d.cq*ar, bd=rg.band*ar, S=seam(qq,bd,dr,c0,c1,g0);
   for(i=0;i<9;i++){var s=S.st[i]||S.st[S.st.length-1]; stops[i].setAttribute('offset',s[0].toFixed(4)); stops[i].setAttribute('stop-color',css(s[1]));}
   var ya=sy+sh*(1-S.hi/100)-2.5, yb=sy+3, pitch=(ya-yb)/7;
   for(i=0;i<7;i++){var r=mk[i];
    if(pitch<2){r.setAttribute('height',0);continue;}
    var sv=clamp(d.seatShadow[i]*2,0,1)*ar, br=RS.reduced?1:(1+.07*Math.sin(t*1.5+i*.9)), ww=Math.max(2.2,sv*br*(sw-5)), hh=Math.max(1.2,Math.min(3.2,pitch*.5));
    var yc=ya-(i+.5)*pitch;
    r.setAttribute('x',f1(sx+sw-ww-1.5)); r.setAttribute('width',f1(ww)); r.setAttribute('y',f1(yc-hh/2)); r.setAttribute('height',f1(hh)); r.setAttribute('opacity',(.55+.45*sv).toFixed(2));}
   var yl=sy+sh*(1-S.live/100); glint.setAttribute('cy',f1(yl)); glint.setAttribute('opacity',(.55*ar).toFixed(2));
   var ycq=clamp(sy+sh*(1-qq/100),sy+46,sy+sh); cql.setAttribute('y',f1(ycq-1)); cqn.setAttribute('y',f1(ycq+12));
  }else{
   for(i=0;i<7;i++){var rr=mk[i];rr.setAttribute('x',sx+sw-6);rr.setAttribute('width',4);rr.setAttribute('height',2.4);rr.setAttribute('y',f1(sy+sh-8-(i)*12));rr.setAttribute('opacity',.35);}
   glint.setAttribute('cy',f1(sy+sh-((t*14)%(sh+30))+10)); glint.setAttribute('opacity',.18);
   cql.setAttribute('y',sy+sh-14); cqn.setAttribute('y',sy+sh-1);
  }
  hal.setAttribute('opacity',un?.22:(d.benign?1:.28)); frk.setAttribute('opacity',un?.22:(d.benign?.28:1));
  /* the wave, vertical, travelling up the body */
  var N=130, dd='';
  for(i=0;i<=N;i++){var u=i/N, y01=un?.5+.04*Math.sin(TAU*3*u-t*1.4):waveY(d.pass,cp,u,t,1.5);
   if(!un&&ar<1)y01=.5+(y01-.5)*ar;
   dd+=(i?'L':'M')+f1(wx0+2+(wx1-wx0-4)*y01)+' '+f1(sy+sh-sh*u);}
  wv.setAttribute('d',dd); wv.setAttribute('opacity',un?.35:1);
  /* the tubes */
  var vals=[d.x,d.y,d.z];
  fl.forEach(function(f,j){var L=un?0:clamp(vals[j],0,1)*ease(age/1.0-j*.08), hh=(ty1-ty0)*L; f.setAttribute('y',f1(ty1-hh)); f.setAttribute('height',f1(hh));
   bf[j].setAttribute('y',f1(L>.02?0:40)); bf[j].setAttribute('height',40); bf[j].setAttribute('opacity',un?0:(L>.02?1:0));});
  /* the sun */
  var rad=un?0:d.rad*ar, R='', cols=[P.vit,P.aw,P.wi];
  for(var n=0;n<9;n++){var an=n/9*TAU+(RS.reduced?0:t*.12), c=Math.cos(an), s2=Math.sin(an), len=1.5+5*rad;
   R+='<path d="M'+f1(c*9.6)+' '+f1(s2*9.6)+'L'+f1(c*(9.6+len))+' '+f1(s2*(9.6+len))+'" stroke="'+cols[n%3]+'" stroke-width="1.7" stroke-linecap="round" opacity="'+(un?.25:f2(.35+.65*rad))+'"/>';}
  rays.innerHTML=R;
  var Ls=un?0:rad, ysl=6.2-12.4*Ls; sl.setAttribute('y',f1(ysl)); sl.setAttribute('height',f1(14-ysl)); sl.setAttribute('opacity',Ls>.02?.9:0);
  var bb=bam.querySelector('.bm-beam'); bb.setAttribute('transform','translate(0 -9) rotate('+f1(un?0:-clamp(d.lean,-1,1)*20*ar)+') translate(0 9)');
 };};

/* ---------- the closed forms, 46 wide ----------
   The closed column is 58 wide with 6 of padding a side. Each option keeps the
   same objects there and gives up only what needs width: the names. */

/* A, closed. The bar stands up with coherence at the head, the four gauges stack under it. */
BUILD.minia=function(inst,W,o){
 var d=inst.d, P=pal(d), id='ma'+inst.id, un=!!d.unread, H=304, cxm=23;
 var bx=17, bw=12, by=24, bh=100, cp=cumOf(d.pass), rg=cqRange(d.cq);
 var kinds=[['vessel',P.vit,'x','Vitality'],['iris',P.aw,'y','Awareness'],['arrow',P.wi,'z','Will'],['disc',null,'rad','Radiance']];
 var h='<svg class="rs-svg" width="46" height="'+H+'" viewBox="0 0 46 '+H+'" role="img" aria-label="'+say(d)+'"><title>'+say(d)+'</title><defs>'
  +'<clipPath id="'+id+'b"><rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="'+(bw/2)+'"/></clipPath>'
  +'<linearGradient id="'+id+'g" gradientUnits="userSpaceOnUse" x1="0" y1="'+by+'" x2="0" y2="'+(by+bh)+'">';
 for(var i=0;i<9;i++)h+='<stop class="sg" offset="0" stop-color="#000"/>';
 h+='</linearGradient>'+gDefs(id,P)+'</defs>'
  +'<g clip-path="url(#'+id+'b)"><rect class="bar" x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" fill="url(#'+id+'g)"/><g class="mk">';
 for(i=0;i<7;i++)h+='<rect rx=".8" fill="'+P.seat[i]+'"/>';
 h+='</g></g><rect x="'+(bx+.5)+'" y="'+(by+.5)+'" width="'+(bw-1)+'" height="'+(bh-1)+'" rx="'+(bw/2-.5)+'" fill="none" stroke="var(--edge-2,rgba(255,255,255,.14))"/>'
  +'<g class="hal" transform="translate('+cxm+' 12)">'+haloSvg(P.halo,1)+'</g><g class="frk" transform="translate('+cxm+' '+(by+bh+13)+')">'+forkSvg(P.fork,1)+'</g>';
 kinds.forEach(function(k,j){h+='<g class="gz" transform="translate('+(cxm-15)+' '+(150+j*33)+') scale(.75)">'+gInner(id,j,k[0],k[1],P,k[3]+' '+(un?'not read':f2(d[k[2]])))+'</g>';});
 h+='<g class="bal" transform="translate('+cxm+' 296) scale(.9)">'+beamSvg()+'</g></svg>';
 inst.host.innerHTML=h;
 var qa=function(x){return [].slice.call(inst.host.querySelectorAll(x));};
 var stops=qa('.sg'), mk=qa('.mk rect'), bar=inst.host.querySelector('.bar'), hal=inst.host.querySelector('.hal'), frk=inst.host.querySelector('.frk'), gz=qa('.gz'), ik=gz.map(gRefs), bam=inst.host.querySelector('.bal');
 var g0=hex(P.gnd), c0=hex(P.cq0), c1=hex(P.cq1);
 if(un)bar.setAttribute('fill',rgba(P.gnd,.55));
 return function(t,age){
  var ar=RS.reduced?1:ease(age/1.1), dr=RS.reduced?0:drift(t), vals=[d.x,d.y,d.z,d.rad], i;
  if(!un){var S=seam(d.cq*ar,rg.band*ar,dr,c0,c1,g0);
   for(i=0;i<9;i++){var q=S.st[i]||S.st[S.st.length-1]; stops[i].setAttribute('offset',q[0].toFixed(4)); stops[i].setAttribute('stop-color',css(q[1]));}
   var ya=by+bh*(S.hi/100)+3, yb=by+bh-3, pitch=(yb-ya)/7;
   for(i=0;i<7;i++){var r=mk[i]; if(pitch<2.2){r.setAttribute('height',0);continue;}
    var sv=clamp(d.seatShadow[i]*2,0,1)*ar, br=RS.reduced?1:(1+.07*Math.sin(t*1.5+i*.9)), ww=Math.max(2.2,sv*br*(bw-3)), hh=Math.max(1.2,Math.min(3,pitch*.46));
    r.setAttribute('x',f1(bx+bw-ww-1.5)); r.setAttribute('width',f1(ww)); r.setAttribute('y',f1(ya+(i+.5)*pitch-hh/2)); r.setAttribute('height',f1(hh)); r.setAttribute('opacity',(.5+.4*sv).toFixed(2));}
  }else{for(i=0;i<7;i++){var rr=mk[i];rr.setAttribute('x',bx+bw-6);rr.setAttribute('width',4);rr.setAttribute('height',2.2);rr.setAttribute('y',f1(by+bh-8-i*12));rr.setAttribute('opacity',.35);}}
  hal.setAttribute('opacity',un?.22:(d.benign?1:.28)); frk.setAttribute('opacity',un?.22:(d.benign?.28:1));
  gz.forEach(function(g,j){gUpd(ik[j],kinds[j][0],un?0:clamp(vals[j],0,1)*ease(age/1.0-j*.08),t,j,un,d.rad,ar,P);});
  tiltBeam(bam,un,d.lean,ar);
 };};

/* B, closed. The ring and what is inside it, and nothing else. */
BUILD.minib=function(inst,W,o){
 var host=inst.host, inner=document.createElement('div'); host.innerHTML=''; host.appendChild(inner); host.classList.add('rs-ringonly');
 var sub={host:inner,d:inst.d,id:inst.id+'m',t0:inst.t0}, draw=BUILD.b(sub,146,o);
 inner.style.cssText='width:146px;height:146px;transform-origin:0 0;transform:scale(.315)';
 host.style.width='46px'; host.style.height='46px'; host.style.overflow='hidden';
 return draw;};

/* C, closed. The spine and the wave beside it, the same seven seats up the same height. */
BUILD.minic=function(inst,W,o){
 var host=inst.host, inner=document.createElement('div'); host.innerHTML=''; host.appendChild(inner); host.classList.add('rs-slim');
 var sub={host:inner,d:inst.d,id:inst.id+'m',t0:inst.t0}, draw=BUILD.c(sub,46,{slim:true});
 host.style.width='46px'; host.style.height='150px';
 return draw;};

/* ---------- mount ---------- */
RS.mount=function(host,kind,d,o){
 o=o||{}; var inst={host:host,kind:kind,d:d,id:++UID,t0:RS.now()-(o.age!==undefined?o.age:(RS.clock!==null?10:0)),raf:0,dead:false};
 var W=o.W||clamp(host.clientWidth||262,236,380);
 host.classList.add('rs');
 var draw=(o.mini?BUILD['mini'+kind]:BUILD[kind])(inst,W,o);
 inst.draw=function(){var T=RS.now(); draw(T,T-inst.t0);};
 inst.restart=function(age){inst.t0=RS.now()-(age||0);};
 inst.draw();
 if(!o.manual&&RS.clock===null&&!RS.reduced){var loop=function(){if(inst.dead)return; inst.draw(); inst.raf=requestAnimationFrame(loop);}; inst.raf=requestAnimationFrame(loop);}
 inst.destroy=function(){inst.dead=true;cancelAnimationFrame(inst.raf);host.innerHTML='';};
 return inst;};

})(typeof window!=='undefined'?window:this);
