/* ============================================================
   RAIL, LINES. Round PC. Mockup only. Nothing here is wired into atuned_src.

   The owner rejected rail-simple: free-standing glyphs, dials, a spine. This
   goes back to the grammar the rail already has, a bar that is the row, the
   mark inside the bar, and changes only what he asked to change.

   ONE LINE PER READING. Same bar the rail draws now: a tinted track, a fill,
   the mark inside the line and not beside it, the figure at the right in small
   type, and the words painted twice so a letter changes ink at the edge of the
   fill (ui/component.js rbRow). The only words on screen are CQ and DQ. Every
   other name lives in the tooltip.

   THE PAIR. CQ and DQ are two systems pulling on each other, so they are one
   solid bar of two opposing colours and the line where they meet is the
   termination point. Its x is CQ's share of the bar and it OSCILLATES by the
   oscillation range, which is cqRange in ui/personas.js, 2.5 + (1 - CQ/100)^2
   x 26 points wide, on the drift renderPol2 writes. The bar is 100 points
   wide, so the range in points is the range in per cent of the bar, and
   nothing here converts it to pixels: every position is a percentage.

     hard   the edge is a hard line. A faint trail behind it is the last three
            seconds of where it was, drawn in the colour it left behind, so a
            wide swing leaves a wide smear and a settled person leaves none.
     soft   the two colours blend across a zone as wide as the range, centred
            on the edge, so how sharp the edge is says how settled the person
            is. Narrow range, crisp edge. Wide range, a wash.

   Two clocks. Live it runs on requestAnimationFrame. Frozen, RL.clock holds a
   number of seconds and inst.draw() paints that instant, which is how the
   frame strips are made without a screen recorder.
   ============================================================ */
(function(root){
'use strict';
var TAU=Math.PI*2, UID=0;
var RL={clock:null};
root.RL=RL;
RL.now=function(){return RL.clock!==null?RL.clock:performance.now()/1000;};
function clamp(v,a,b){return v<a?a:(v>b?b:v);}
function f2(v){return (+v).toFixed(2);}
function f1(v){return (+v).toFixed(1);}

/* the Compass's range, lifted as written from ui/personas.js cqRange */
function cqRange(cq){cq=clamp(cq,0,100);var sw=1-cq/100, band=2.5+sw*sw*26;
 return {cq:cq,band:band,lo:Math.max(0,cq-band/2),hi:Math.min(100,cq+band/2)};}
/* and its drift, as renderPol2 writes it */
function drift(t){return Math.sin(t*0.55)*0.62+Math.sin(t*0.23+1.1)*0.38;}
/* where the termination point stands at time t, in per cent of the bar */
function edgeAt(cq,band,t){return clamp(cq+drift(t)*(band/2),0,100);}

RL.cqRange=cqRange; RL.edgeAt=edgeAt; RL.drift=drift;
/* ---- the marks. Ring, not fill, one family, 24 grid, 1.7 stroke ---- */
var IC={
 cq:'<path d="M3 9c3-3.5 6 3.5 9 0s6 3.5 9 0M3 15c3-3.5 6 3.5 9 0s6 3.5 9 0"/>',
 dq:'<path d="M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17M4.2 14.2h15.6"/>',
 vitality:'<path d="M12 21v-8M12 13c0-3.4 2.4-6 5.6-6.4C17.2 10 15 12.6 12 13M12 13c0-2.8-2-5-4.7-5.4C7.7 10.4 9.6 12.4 12 13M9 21h6"/>',
 awareness:'<path d="M12 3.5a8.5 8.5 0 110 17 8.5 8.5 0 010-17M12 3.5L17.8 9.3M20.5 12h-8.2M17.8 14.7L12 20.5M6.2 14.7L12 8.9M3.5 12h8.2M6.2 9.3L12 15.1"/>',
 will:'<path d="M12 21V4M12 4l-4 4M12 4l4 4M5 13.5h3.2M15.8 13.5H19"/>',
 radiance:'<circle cx="12" cy="12" r="3.6"/><path d="M12 3.2v2.6M12 18.2v2.6M3.2 12h2.6M18.2 12h2.6M5.8 5.8l1.8 1.8M16.4 16.4l1.8 1.8M18.2 5.8l-1.8 1.8M7.6 16.4l-1.8 1.8"/>',
 flow:'<path d="M6 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M12 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M18 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8"/>',
 /* the halo and the pitchfork are the Compass's own two ends (ui/personas.js
    renderPol2), redrawn on the 24 grid with the same ring terminals */
 halo:'<ellipse cx="12" cy="7.2" rx="7.4" ry="2.9"/><path d="M5.4 19.6Q12 11.6 18.6 19.6"/>',
 fork:'<path d="M12 21V10.5M5 10.5h14M5.6 10.5V4M12 10.5V3M18.4 10.5V4"/>',
 male:'<circle cx="10" cy="14" r="6"/><path d="M14.5 9.5L20 4M15.5 4H20v4.5"/>',
 female:'<circle cx="12" cy="9" r="6"/><path d="M12 15v7M8.5 19h7"/>'};
function svgi(k,cls){return '<svg class="'+(cls||'lr-li')+'" viewBox="0 0 24 24" aria-hidden="true">'+IC[k]+'</svg>';}

/* ---- the wave, one picture of the chain, root to crown. The base is a clean
   sine, two cycles, full range; each seat keeps the share it passes and adds
   chop in proportion to what it holds back. Same construction as rbWavePts in
   ui/component.js, with a time term so it travels. ---- */
function wavePts(pass,t,N,W0,H0,pad,rate){
 var cum=[],c=1,i,pts=[];
 for(i=0;i<7;i++){c*=pass[i];cum.push(c);}
 var ph=t*rate;
 for(i=0;i<=N;i++){var u=i/N,f=u*7,s=Math.min(6,Math.floor(f)),q=f-s;
  var a0=s===0?1:cum[s-1],A=a0+(cum[s]-a0)*q;
  var ld=(1-pass[s]),ldp=s>0?(1-pass[s-1]):ld,ldn=s<6?(1-pass[s+1]):ld,
   L=q<.5?ldp+(ld-ldp)*(q+.5):ld+(ldn-ld)*(q-.5);
  var base=Math.sin(TAU*2*u-ph),
   chop=L*(.55*Math.sin(TAU*14.7*u+s*1.9-ph*1.7)+.3*Math.sin(TAU*23.1*u+s*.7-ph*2.3));
  var y01=clamp(.5+.5*(A*base+chop),0,1);
  pts.push([u*W0,pad+(H0-2*pad)*(1-y01)]);}
 return pts;}

/* ---- one mount. d is a record out of data.json ---- */
RL.mount=function(host,variant,d,o){
 o=o||{}; var id='rl'+(++UID), mini=!!o.mini, soft=variant==='soft';
 var un=!!d.unread, rg=cqRange(d.cq), band=rg.band;
 var seat=d.seatCols||['#C4635E','#D19255','#D4BC70','#6FC5A3','#65B8D4','#8296DB','#A98BCE'];
 var cl=function(v){return clamp(+v||0,0,1);};
 var tipCQ='Coherence '+(un?'not read yet':Math.round(d.cq)+' of 100')+'. The share of the bar that is coherence, and the edge moves by how far coherence wanders, '+f1(band)+' points here.';
 var tipDQ='Decoherence '+(un?'not read yet':Math.round(d.dq)+' of 100')+'. The seven marks are the seats, root to crown, each as high as the charge on its own addresses.';
 var benign=100-(d.malig||0), masc=clamp(50+50*d.lean,0,100);

 /* the pair ---------------------------------------------------------------- */
 function txt(){ /* the same words twice: this is one copy, drawn in two inks */
  return '<span class="lr-tl">'+svgi('cq')+'<b>CQ</b><i>'+(un?'–':Math.round(d.cq))+'</i></span>'
        +'<span class="lr-tr"><i>'+(un?'–':Math.round(d.dq))+'</i><b>DQ</b>'+svgi('dq')+'</span>';}
 var marks='';
 if(!un){for(var i=0;i<7;i++){var v=clamp(cl(d.seatShadow[i])*2,0,1);
  marks+='<s style="--k:'+seat[i]+';--q:'+i+'"><b style="transform:scaleY('+f2(Math.max(.07,v))+')"><u></u></b></s>';}}
 var trail=''; if(!soft&&!un&&!mini){for(i=0;i<36;i++)trail+='<rect class="lr-r'+i+'" y="0" height="100" width="0"/>';}
 var pairH=
  '<div class="lr-ln lr-pair'+(un?' lr-off':'')+(soft?' lr-soft':'')+'" data-k="pair" title="'+tipCQ+' '+tipDQ+'">'
  +'<div class="lr-cqL"></div>'
  +(trail?'<svg class="lr-trl" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'+trail+'</svg>':'')
  +(mini?'':'<div class="lr-mk" aria-hidden="true">'+marks+'</div>')
  +(mini?'':'<div class="lr-tx lr-base" aria-hidden="true">'+txt()+'</div><div class="lr-tx lr-over">'+txt()+'</div>')
  +'</div>';

 /* a plain reading: icon inside the line, figure at the right ------------------ */
 function line(k,ic,val,col,fig,tip){
  var w=un?0:clamp(val,0,1)*100;
  var fg=mini?'':'<span class="lr-fg">'+(un?'–':fig)+'</span>';
  var tx=function(){return '<span class="lr-tl">'+svgi(ic)+'</span>'+fg.replace('class="lr-fg"','class="lr-tr"');};
  return '<div class="lr-ln'+(un?' lr-off':'')+'" data-k="'+k+'" style="--c:'+col+';--w:'+w.toFixed(2)+'%" title="'+tip+'">'
   +'<div class="lr-fill"></div>'
   +'<div class="lr-tx lr-base" aria-hidden="true">'+tx()+'</div><div class="lr-tx lr-over">'+tx()+'</div></div>';}

 /* two-way split: two colours, a static hard edge, an icon at each end ----------- */
 function split(k,pct,cA,cB,icA,icB,nA,nB,tip){
  var uu=un;
  var tx=function(){return '<span class="lr-tl">'+svgi(icA)+(mini?'':'<i>'+(uu?'–':Math.round(nA))+'</i>')+'</span>'
                         +'<span class="lr-tr">'+(mini?'':'<i>'+(uu?'–':Math.round(nB))+'</i>')+svgi(icB)+'</span>';};
  return '<div class="lr-ln lr-split'+(uu?' lr-off':'')+'" data-k="'+k+'" style="--cA:'+cA+';--cB:'+cB+';--e:'+(uu?50:pct).toFixed(2)+'%" title="'+tip+'">'
   +'<div class="lr-cqL"></div>'
   +'<div class="lr-tx lr-base" aria-hidden="true">'+tx()+'</div><div class="lr-tx lr-over">'+tx()+'</div></div>';}

 var wave=''; var WN=84, sqp=clamp((d.sq||0)/100,0,1);
 var flowH='<div class="lr-ln lr-flow'+(un?' lr-off':'')+'" data-k="flow" title="Flow '+(un?'not read yet':f2(d.flow)+' of 1')
   +'. How much gets from the base of your spine to the top of your head, each seat passing on part of what it gets. The dotted lines are the room the shadow leaves.">'
   +'<span class="lr-tl">'+svgi('flow')+'</span>'
   +'<svg class="lr-wv" viewBox="0 0 216 28" preserveAspectRatio="none" aria-hidden="true">'
   +'<g class="lr-wb">'+seat.map(function(c,i){return '<rect x="'+(i*216/7).toFixed(1)+'" y="0" width="'+(216/7+.3).toFixed(1)+'" height="28" style="fill:'+c+'"/>';}).join('')+'</g>'
   +'<path class="lr-wm" d="M0 14H216"/>'
   +(un?'':'<path class="lr-sq" d="M0 '+(3+22*sqp/2).toFixed(1)+'H216M0 '+(25-22*sqp/2).toFixed(1)+'H216"/>')
   +(un?'':seat.map(function(c,i){return '<path class="lr-wvp" data-i="'+i+'" style="stroke:'+c+'"/>';}).join(''))
   +'</svg>'
   +(mini?'':'<span class="lr-tr lr-fg">'+(un?'–':f2(d.flow))+'</span>')+'</div>';

 var vit=line('vit','vitality',d.x,'var(--c-vit)',f2(d.x),'Vitality '+(un?'not read yet':f2(d.x)+' of 1')+'. How much energy is left once apathy and the decoherence are taken off.');
 var awr=line('aw','awareness',d.y,'var(--c-aw)',f2(d.y),'Awareness '+(un?'not read yet':f2(d.y)+' of 1')+'. How strong what you mean is, and how little of it gets bent on the way out.');
 var wil=line('wi','will',d.z,'var(--c-wi)',f2(d.z),'Will '+(un?'not read yet':f2(d.z)+' of 1')+'. How much of your integrity gets through the charge you are carrying.');
 var rad=line('rad','radiance',d.rad,'var(--c-rad)',f2(d.rad),'Radiance '+(un?'not read yet':f2(d.rad)+' of 1')+'. Vitality, awareness and will combined. It sets how bright the field behind the wheel is.');
 var ori=split('ori',benign,'var(--c-ben)','var(--c-mal)','halo','fork',benign,d.malig||0,
   'Orientation. '+(un?'Not read yet.':'Benign '+benign+', malignant '+(d.malig||0)+'. A halo on the benign side, a pitchfork on the malignant side.'));
 var bal=split('bal',masc,'var(--c-m)','var(--c-f)','male','female',masc,100-masc,
   'Balance. '+(un?'Not read yet.':'Masculine '+Math.round(masc)+' against feminine '+Math.round(100-masc)+'. Not men and women: the codex is explicit about that.'));

 host.innerHTML='<div class="lr'+(mini?' lr-mini':'')+'" id="'+id+'">'+pairH+'<div class="lr-gap"></div>'+vit+awr+wil+rad+'<div class="lr-gap"></div>'+flowH+'<div class="lr-gap"></div>'+ori+bal+'</div>';
 var R=host.firstChild, P=R.querySelector('.lr-pair');
 /* the lines read the lighting from the ground they sit on */
 (function(){var bg=getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g)||[10,10,10];
  var L=(.2126*bg[0]+.7152*bg[1]+.0722*bg[2])/255; R.classList.toggle('lr-lite',L>.55);})();
 var cqL=P.querySelector('.lr-cqL'), base=P.querySelector('.lr-tx.lr-base'), over=P.querySelector('.lr-tx.lr-over'),
     mk=P.querySelector('.lr-mk'), rects=[].slice.call(P.querySelectorAll('.lr-trl rect'));
 var wpaths=[].slice.call(R.querySelectorAll('.lr-wvp'));
 var inst={el:R,t0:null,raf:0,dead:false,last:{}};
 var T=3.0, NT=rects.length||1;

 inst.draw=function(){
  var t=RL.now(), reduced=!!o.still;
  var tt=reduced?0:t;
  if(!un){
   var e=edgeAt(rg.cq,band,tt);                     /* per cent of the bar */
   var R_=(100-e).toFixed(3), L_=e.toFixed(3);
   if(soft){var s=Math.max(3.2,band)/2;
    var m='linear-gradient(90deg,#000 '+(e-s).toFixed(3)+'%,transparent '+(e+s).toFixed(3)+'%)';
    cqL.style.webkitMaskImage=m; cqL.style.maskImage=m;}
   else{cqL.style.clipPath='inset(0 '+R_+'% 0 0)';}
   if(base){base.style.clipPath='inset(0 0 0 '+L_+'%)'; over.style.clipPath='inset(0 '+R_+'% 0 0)';}
   if(mk)mk.style.clipPath='inset(0 0 0 '+L_+'%)';
   /* the trail: where the edge has been, in the colour it left behind */
   for(var i=0;i<rects.length;i++){
    var xi=edgeAt(rg.cq,band,tt-(i+1)/NT*T), xj=edgeAt(rg.cq,band,tt-i/NT*T);
    var lo=Math.min(xi,xj), w=Math.max(Math.abs(xj-xi),.14), r=rects[i];
    r.setAttribute('x',lo.toFixed(3)); r.setAttribute('width',w.toFixed(3));
    r.style.fill=(lo+w/2)<e?'var(--c-dq)':'var(--c-cq)';
    r.style.opacity=(.30*Math.pow(1-(i/NT),2)).toFixed(3);}
  }
  /* split lines: static edge, nothing to draw. wave: travels. */
  if(wpaths.length){
   var pass=d.pass.map(cl), pts=wavePts(pass,tt,WN,216,28,3,reduced?0:1.5);
   for(var s2=0;s2<7;s2++){var a0=Math.round(s2*WN/7), b0=Math.round((s2+1)*WN/7), q='';
    for(var k=a0;k<=b0;k++)q+=(k===a0?'M':'L')+pts[k][0].toFixed(1)+' '+pts[k][1].toFixed(1);
    wpaths[s2].setAttribute('d',q);}}
 };
 inst.start=function(){
  if(o.manual)return;
  var tick=function(){if(inst.dead)return; inst.draw(); inst.raf=requestAnimationFrame(tick);};
  tick();};
 inst.destroy=function(){inst.dead=true; if(inst.raf)cancelAnimationFrame(inst.raf);};
 /* breathing amplitude for the seven marks, the Field's own rule */
 R.style.setProperty('--amp',(clamp((d.dq||0)/100,0,1)*0.35).toFixed(3));
 R.style.setProperty('--rate',(0.6+clamp((d.dq||0)/100,0,1)*0.8).toFixed(3));
 inst.draw(); inst.start();
 return inst;};
})(typeof window!=='undefined'?window:this);
