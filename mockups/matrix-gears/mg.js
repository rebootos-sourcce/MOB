/* mg.js. The shared floor of the six mockups: data access, palette, easing, one clock,
   a deterministic seek for frame strips, a cost meter, pointer readout, reduced motion.
   Nothing here reads the network. Real numbers come from data.js (engine output).
   URL switches:  ?p=Tomas  person   ?seek=1.0  freeze at 1.0 s   ?still=1  reduced motion end state */
(function(){
'use strict';
const D=window.MG, Q=new URLSearchParams(location.search);
const REDUCED=Q.get('still')==='1'||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const TAU=Math.PI*2, clamp=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,k)=>a+(b-a)*k;
/* the product's three curves, solved exactly */
function bez(a,b,c,d){const cx=3*a,bx=3*(c-a)-cx,ax=1-cx-bx,cy=3*b,by=3*(d-b)-cy,ay=1-cy-by;
 const X=t=>((ax*t+bx)*t+cx)*t,Y=t=>((ay*t+by)*t+cy)*t,dX=t=>(3*ax*t+2*bx)*t+cx;
 return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<8;i++){const e=X(t)-x;if(Math.abs(e)<1e-5)break;const dd=dX(t);if(Math.abs(dd)<1e-6)break;t-=e/dd;}return Y(t);};}
const OUT=bez(.22,1,.36,1), IN=bez(.4,0,1,1), LAND=bez(.34,1.56,.64,1);
/* entrance progress: 0 before delay, eased to 1 over dur. Reduced motion is the end state. */
const ent=(t,delay,dur,ease)=>REDUCED?1:(ease||OUT)(clamp((t-delay)/dur,0,1));
const BREATH=4.2;   /* the Field's own wave, seconds */
const hex2=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const rgba=(h,a)=>{const c=hex2(h);return 'rgba('+c[0]+','+c[1]+','+c[2]+','+(+a).toFixed(3)+')';};
const mix=(h1,h2,k)=>{const a=hex2(h1),b=hex2(h2);return 'rgb('+Math.round(lerp(a[0],b[0],k))+','+Math.round(lerp(a[1],b[1],k))+','+Math.round(lerp(a[2],b[2],k))+')';};
const ROOTS=['Architect','Engine','Weaver','Witness'];
const ROOTC={Architect:'#7D93E0',Engine:'#D8924E',Weaver:'#5FD5A6',Witness:'#A77EDB'};
const SEATC={Root:'#D6524C',Sacral:'#D8924E',Solar:'#DABF6A',Heart:'#5FD5A6',Throat:'#5EBBDB','3rd Eye':'#7D93E0'};
const C={bg:'#090A0E',ink:'#EFEDE8',mid:'#B4B0A8',dim:'#94908A',gold:'#DFCC7E',acc:'#7EB8D4'};
const FONT='Inter,system-ui,-apple-system,"Segoe UI",sans-serif';
/* fetters in the matrix's own row order, and grouped under their root, which is how AFFIN lists them */
const CHILD=D.child, DOMAINS=D.domains, AFFIN=D.affin;
const FNAME=CHILD.map(c=>c.nm), FCOL=CHILD.map(c=>SEATC[c.seat]);
const FGROUP=[];ROOTS.forEach(r=>AFFIN[r].forEach(n=>FGROUP.push({nm:n,root:r,rw:FNAME.indexOf(n)})));
const DROOT=DOMAINS.map(d=>d.r), DCOL=DROOT.map(r=>ROOTC[r]);
const isAff=(rw,c)=>AFFIN[DROOT[c]].indexOf(FNAME[rw])>=0;
const G=v=>Math.pow(clamp(v,0,1),.62);   /* a low charge still has to read; the numbers shown stay raw */
/* the sky, from astro.js: the Sun, the Moon, the Ascendant and the design Sun, as longitudes */
function signOf(lon){const i=Math.floor(((lon%360)+360)%360/30)%12;const z=D.zsign[D.zi[i]];return {i,nm:z.nm,el:z.el,mode:z.mode,root:D.elem2root[z.el]};}
function skyOf(p){if(!p||!p.sky)return [];const s=p.sky,o=[];
 o.push(Object.assign({k:'Sun',ab:'Su',lon:s.sun},signOf(s.sun)));
 o.push(Object.assign({k:'Moon',ab:'Mo',lon:s.moon},signOf(s.moon)));
 if(s.asc!=null)o.push(Object.assign({k:'Rising',ab:'As',lon:s.asc},signOf(s.asc)));
 o.push(Object.assign({k:'Design Sun',ab:'De',lon:s.des},signOf(s.des)));
 return o;}
const ASP=[['conjunction',0,8],['sextile',60,4],['square',90,6],['trine',120,8],['opposition',180,8]];
function aspectsOf(sky){const o=[];
 for(let i=0;i<sky.length;i++)for(let j=i+1;j<sky.length;j++){
  if(sky[i].k==='Sun'&&sky[j].k==='Design Sun')continue;   /* 88 degrees of solar arc by construction */
  let d=Math.abs(sky[i].lon-sky[j].lon)%360;if(d>180)d=360-d;
  for(const a of ASP){const off=Math.abs(d-a[1]);if(off<=a[2]){o.push({a:sky[i],b:sky[j],name:a[0],deg:a[1],off:off});break;}}}
 return o;}
/* ---------- state ---------- */
const S={p:null,who:Q.get('p')||'Marcus',D:[],CH:[],DOM:[],hover:null,t:0,views:[],spec:null,x:{}};
function mean(a){return a.length?a.reduce((x,y)=>x+y,0)/a.length:0;}
function meanSq(p){return mean(p.addr.map(a=>a.sq));}
function targets(p){const T={D:[],CH:[],DOM:[]};
 for(let r=0;r<9;r++){T.D.push([]);for(let c=0;c<19;c++)T.D[r].push(G(p.sq9[r][c]/10));T.CH.push(clamp((p.charge[FNAME[r]]||0)/10,0,1));}
 for(let c=0;c<19;c++)T.DOM.push(p.domain[c]);return T;}
function person(n){return D.people.find(p=>p.nm===n)||D.people[0];}
function setPerson(n,instant){const p=person(n),T=targets(p);S.p=p;S.who=p.nm;S.sky=skyOf(p);S.asp=aspectsOf(S.sky);S.T=T;
 if(instant||!S.D.length){S.D=T.D.map(r=>r.slice());S.CH=T.CH.slice();S.DOM=T.DOM.slice();}
 document.querySelectorAll('.who button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.n===p.nm?'true':'false'));
 if(S.spec&&S.spec.person)S.spec.person(S,instant);}
function stepAll(dt){const k=1-Math.pow(.86,dt*60);   /* n.disp eases at .14 a frame; same here */
 for(let r=0;r<9;r++){for(let c=0;c<19;c++)S.D[r][c]+=(S.T.D[r][c]-S.D[r][c])*k;S.CH[r]+=(S.T.CH[r]-S.CH[r])*k;}
 for(let c=0;c<19;c++)S.DOM[c]+=(S.T.DOM[c]-S.DOM[c])*k;
 if(S.spec.step)S.spec.step(dt,S);}
/* ---------- canvas views ---------- */
function fit(v){const r=v.el.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
 const w=Math.max(60,Math.round(r.width)),h=Math.max(60,Math.round(r.height));
 if(v.w!==w||v.h!==h||v.dpr!==dpr){v.w=w;v.h=h;v.dpr=dpr;v.el.width=Math.round(w*dpr);v.el.height=Math.round(h*dpr);}
 v.ctx=v.el.getContext('2d');v.ctx.setTransform(v.dpr,0,0,v.dpr,0,0);}
let cost=[],lastNow=null,frameGap=[];
function drawAll(t){const t0=performance.now();
 S.t=t;
 S.views.forEach(v=>{fit(v);v.ctx.clearRect(0,0,v.w,v.h);S.spec.draw(v.ctx,v.w,v.h,t,S,v);});
 const ms=performance.now()-t0;cost.push(ms);if(cost.length>180)cost.shift();}
let simT=0,raf=0,seeking=false;
function loop(now){raf=requestAnimationFrame(loop);
 if(lastNow!=null)frameGap.push(now-lastNow);if(frameGap.length>180)frameGap.shift();
 const dt=lastNow==null?0:Math.min(.05,(now-lastNow)/1000);lastNow=now;
 stepAll(dt);simT+=dt;drawAll(simT);}
function seek(t){cancelAnimationFrame(raf);seeking=true;S.hover=null;simT=0;setPerson(S.who,true);
 let tt=0;while(tt<t-1e-9){const dt=Math.min(1/60,t-tt);stepAll(dt);tt+=dt;}simT=t;drawAll(t);}
function redraw(){if(REDUCED||seeking)drawAll(REDUCED?10:simT);}
/* ---------- page ---------- */
function build(){const P=window.MGPAGE;document.title=P.title+' | Matrix and gears mockups';
 const b=document.body;
 b.innerHTML='<header class="top"><div class="ey">'+P.eyebrow+'</div><h1>'+P.title+'</h1><p class="lede">'+P.lede+'</p></header>'
 +'<div class="who" id="who"><span class="l">Person</span></div>'
 +'<div class="wrap"><section class="stage'+(P.tall?' tall':'')+'" id="stage" aria-label="'+P.title+'"><canvas id="cv"></canvas><div class="ro" id="ro"></div></section>'
 +'<aside class="side">'+(P.rail?'<div class="railbox"><div class="lbl">'+P.rail+'</div><div class="rc"><canvas id="cv2"></canvas></div></div>':'')
 +'<p class="cap" id="cap">'+P.cap+'</p><p class="fine">'+P.fine+'</p></aside></div>';
 const who=document.getElementById('who');
 [['Marcus','Marcus'],['Tomas','Tomas, heavy'],['Sofia','Sofia'],['Wren','Wren, sparse'],['Rosa','Rosa, at rest']].forEach(a=>{
  const btn=document.createElement('button');btn.type='button';btn.dataset.n=a[0];btn.textContent=a[1];btn.setAttribute('aria-pressed','false');
  btn.onclick=()=>{setPerson(a[0],false);say(null);redraw();};who.appendChild(btn);});}
function say(h){const ro=document.getElementById('ro');if(!ro)return;
 if(h==null){const p=S.p;h=S.spec.idle?S.spec.idle(S):'<b>'+p.nm+'</b>';}
 ro.innerHTML=h;}
function pointers(v){const el=v.el;
 const at=e=>{const r=el.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};};
 const mv=e=>{const q=at(e);S.hover={x:q.x,y:q.y,view:v};const h=S.spec.pointer?S.spec.pointer(q.x,q.y,v,S):null;say(h);redraw();};
 el.addEventListener('pointermove',mv);
 el.addEventListener('pointerdown',e=>{const q=at(e);if(S.spec.down){S.spec.down(q.x,q.y,v,S);try{el.setPointerCapture(e.pointerId);}catch(x){}}mv(e);});
 const up=e=>{if(S.spec.up){const q=at(e);S.spec.up(q.x,q.y,v,S);}};
 el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
 el.addEventListener('pointerleave',e=>{if(e.buttons)return;S.hover=null;say(null);redraw();});}
window.MGC={
 register(spec){S.spec=spec;
  build();
  S.views=[{el:document.getElementById('cv'),main:true}];
  const c2=document.getElementById('cv2');if(c2)S.views.push({el:c2,main:false,rail:true});
  S.views.forEach(pointers);
  setPerson(S.who,true);say(null);
  window.addEventListener('resize',()=>{redraw();});
  if(Q.get('seek')!=null){seek(+Q.get('seek'));return;}
  if(REDUCED){simT=10;drawAll(10);return;}
  requestAnimationFrame(loop);},
 /* hooks for the shot harness */
 seek:seek, who:function(n){setPerson(n,true);say(null);redraw();},
 hover:function(x,y){const v=S.views[0];S.hover={x:x,y:y,view:v};say(S.spec.pointer?S.spec.pointer(x,y,v,S):null);redraw();},
 cost:function(){const a=cost.slice(),m=mean(a),g=frameGap.slice();return {scriptMs:+m.toFixed(2),worstMs:+Math.max.apply(null,a.concat([0])).toFixed(2),frameGapMs:+mean(g).toFixed(1),n:a.length};},
 resetCost:function(){cost=[];frameGap=[];},
 reduced:REDUCED
};
function glyph(ctx,k,x,y,r,col,al){ctx.strokeStyle=rgba(col,al);ctx.lineWidth=1.3;ctx.beginPath();
 if(k==='Moon'){ctx.arc(x,y,r,-1.2,1.2);ctx.stroke();ctx.beginPath();ctx.arc(x+r*.55,y,r*.8,1.2,TAU-1.2,true);ctx.stroke();return;}
 ctx.arc(x,y,r,0,TAU);ctx.stroke();
 if(k==='Sun'){ctx.beginPath();ctx.arc(x,y,r*.28,0,TAU);ctx.stroke();}
 if(k==='Rising'){ctx.beginPath();ctx.moveTo(x-r*1.5,y);ctx.lineTo(x+r*1.5,y);ctx.stroke();}
 if(k==='Design Sun'){ctx.setLineDash([2,2]);ctx.beginPath();ctx.arc(x,y,r*.55,0,TAU);ctx.stroke();ctx.setLineDash([]);}}
/* the four sky points, as the glyphs the gears use. one legend so no picture has to label them in the drawing */
function skyLegend(ctx,x,y,align,small){const items=['Sun','Moon','Rising','Design Sun'],fs=small?9.5:11;ctx.font='500 '+fs+'px '+FONT;
 const wd=items.map(n=>ctx.measureText(n).width+22),tot=wd.reduce((a,b)=>a+b,0);let cx=align==='right'?x-tot:x;
 items.forEach((n,i)=>{glyph(ctx,n,cx+6,y,4.2,'#B4B0A8',1);ctx.font='500 '+fs+'px '+FONT;ctx.fillStyle='#B4B0A8';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(n,cx+15,y);cx+=wd[i];});}
window.MGU={glyph:glyph,skyLegend:skyLegend,D:D,S:S,TAU:TAU,clamp:clamp,lerp:lerp,OUT:OUT,IN:IN,LAND:LAND,ent:ent,BREATH:BREATH,rgba:rgba,mix:mix,ROOTS:ROOTS,ROOTC:ROOTC,SEATC:SEATC,C:C,FONT:FONT,
 CHILD:CHILD,DOMAINS:DOMAINS,AFFIN:AFFIN,FNAME:FNAME,FCOL:FCOL,FGROUP:FGROUP,DROOT:DROOT,DCOL:DCOL,isAff:isAff,G:G,signOf:signOf,skyOf:skyOf,aspectsOf:aspectsOf,REDUCED:REDUCED,mean:mean,meanSq:meanSq,say:say,
 txt:function(ctx,s,x,y,size,col,align,weight){ctx.font=(weight||400)+' '+size+'px '+FONT;ctx.fillStyle=col;ctx.textAlign=align||'left';ctx.textBaseline='middle';ctx.fillText(s,x,y);},
 ringArc:function(ctx,x,y,r,frac,col,lw,trackA){ctx.lineWidth=lw;ctx.lineCap='round';ctx.strokeStyle=rgba('#FFFFFF',trackA==null?.1:trackA);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();
  if(frac>0.004){ctx.strokeStyle=col;ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+TAU*clamp(frac,0,1));ctx.stroke();}}
};
})();
