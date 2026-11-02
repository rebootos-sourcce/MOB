/* ============================================================
   V3, FIELD. Built on the character cloud look (mockups/character-cloud):
   the person is a calm, cool volume of points, the product's own
   outline round it. Around the figure is a soft field, and every pattern
   released is one point of cooled light in it, near the place it left
   from. Three releases is three stars. Eighteen thousand is a nebula.
   The figure's own points do not shine; only a release gives off light.
   The ledger is folded under the field.
   ============================================================ */
let FIELD=null;
function fieldLayout(Wd,Ht){
 const mob=narrow();let h,cx,cy,r,fy;
 if(!mob){h=Math.min(640,Ht);r=h*.5+34;cx=Wd/2;cy=r+40;fy=cy-h/2;}
 else{r=Math.min(Wd/2-24,172);h=Math.min((r-6)/.41,Ht);cx=Wd/2;fy=r+14-.43*h;cy=fy+.43*h;}
 return {mob,h,cx,cy,r,fy,k:h/100,x0:cx-h*.25,S:mob?Math.max(cy+r+16,fy+h+8):cy+r+40,Wd};}
/* figure units to pixels on this stage */
const FX=(L,u)=>L.x0+(u-25)*L.k,FY=(L,v)=>L.fy+v*L.k;
function buildField(L){
 const B=DATA.body,path=new Path2D(B.d),ctx=document.createElement('canvas').getContext('2d');
 const m=new DOMMatrix().translate(B.tx,B.ty).scale(B.s);const inv=m.inverse();
 const inBody=(u,v)=>{const q=inv.transformPoint(new DOMPoint(u,v));return ctx.isPointInPath(path,q.x,q.y);};
 /* the figure: points inside the outline, lit from the upper left like every figure in the product */
 const fig=[];let i=0,n=L.mob?2600:4200;
 while(fig.length<n&&i<n*8){i++;const u=28+hash(i,1)*44,v=2+hash(i,2)*96;if(!inBody(u,v))continue;
  const lit=Math.max(0,1-Math.hypot(u-38,v-8)/95);fig.push([u,v,.18+.5*lit*lit+.12*hash(i,5),hash(i,6)]);}
 /* the field: each released pattern is one point, spread from its place outward, never on the body */
 const places=P.opened.filter(r=>placed(r[0])),pts=[];
 const per=Math.max(1,Math.floor(P.released/Math.max(1,places.length)));
 const cap=L.mob?9000:18000;const total=Math.min(P.released,cap);
 places.forEach((r,pi)=>{const [px,py]=DATA.place[r[0]];const cnt=pi<places.length-1?Math.min(per,total-pts.length):total-pts.length;
  for(let j=0;j<cnt;j++){const s=r[0]*7919+j;
   let side=px<49?-1:px>51?1:(hash(s,3)<.5?-1:1);
   const a=(hash(s,4)-.5)*2.2,d=3+30*Math.pow(hash(s,5),1.6);
   let u=px+side*Math.cos(a)*d,v=py+Math.sin(a)*d*.9;
   let tries=0;while(inBody(u,v)&&tries<6){u+=side*2.2;tries++;}
   /* the field is round: keep it inside the turn ring */
   const dx=FX(L,u)-L.cx,dy=FY(L,v)-L.cy,dd=Math.hypot(dx,dy),lim=L.r-10;
   if(dd>lim){u=25+(L.cx+dx*lim/dd-L.x0)/L.k;v=(L.cy+dy*lim/dd-L.fy)/L.k;}
   pts.push([u,v,r[0],hash(s,6)]);}});
 return {L,fig,pts,dense:pts.length>2000};}
function paintField(t){
 /* t: milliseconds into the release moment, or null for the end state */
 const F=FIELD;if(!F)return;const cv=$('#fcv');if(!cv)return;const L=F.L,dpr=Math.min(2,devicePixelRatio||1);
 if(cv.width!==Math.round(L.Wd*dpr)){cv.width=Math.round(L.Wd*dpr);cv.height=Math.round(L.S*dpr);cv.style.width=L.Wd+'px';cv.style.height=L.S+'px';}
 const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,L.Wd,L.S);
 /* the soft field: a cool haze inside the turn ring, darker than the light it carries */
 const hz=g.createRadialGradient(L.cx,L.cy+L.h*.08,L.r*.1,L.cx,L.cy,L.r);
 hz.addColorStop(0,'rgba(82,170,156,.05)');hz.addColorStop(.7,'rgba(126,184,212,.025)');hz.addColorStop(1,'rgba(126,184,212,0)');
 g.fillStyle=hz;g.beginPath();g.arc(L.cx,L.cy,L.r,0,7);g.fill();
 /* the figure, not lit from within */
 F.fig.forEach(p=>{g.globalAlpha=p[2];g.fillStyle=p[3]<.5?'#B4B0A8':'#9FB3C2';const s=L.mob?1.2:1.4;g.fillRect(FX(L,p[0])-s/2,FY(L,p[1])-s/2,s,s);});
 /* the released patterns, the only light here */
 g.globalCompositeOperation='lighter';
 const e=t==null?1:Math.max(0,Math.min(1,(t-500)/700)),eo=1-Math.pow(1-e,3);
 const glowS=spr();
 F.pts.forEach(p=>{let a=F.dense?.32:.9;if(p[2]===P.last)a*=eo;if(a<=0)return;
  const x=FX(L,p[0]),y=FY(L,p[1]);
  if(!F.dense){g.globalAlpha=a*.6;g.drawImage(glowS,x-9,y-9,18,18);}
  g.globalAlpha=a;g.fillStyle=p[3]<.15?'#BFE3DC':'#52AA9C';const s=F.dense?1.1:2.2;g.fillRect(x-s/2,y-s/2,s,s);});
 g.globalCompositeOperation='source-over';g.globalAlpha=1;}
let SPR;function spr(){if(SPR)return SPR;SPR=document.createElement('canvas');SPR.width=SPR.height=36;const c=SPR.getContext('2d'),gr=c.createRadialGradient(18,18,0,18,18,18);
 gr.addColorStop(0,'rgba(82,170,156,.9)');gr.addColorStop(.35,'rgba(82,170,156,.3)');gr.addColorStop(1,'rgba(82,170,156,0)');c.fillStyle=gr;c.fillRect(0,0,36,36);return SPR;}
/* the release moment adds its points to the field as the ring draws in */
const fieldReplay=()=>{if(REDUCED)return;const t0=performance.now();const step=()=>{const t=performance.now()-t0;paintField(t);if(t<1300&&!fieldReplay.held)requestAnimationFrame(step);else if(!fieldReplay.held)paintField(null);};fieldReplay.held=false;requestAnimationFrame(step);};
fieldReplay.hold=t=>{fieldReplay.held=true;paintField(t);};
HOOKS.replay.push(fieldReplay);
function render(){
 const m=$('#main'),mob=narrow();const E=estimate(P);
 m.innerHTML='<div class="v3"><div class="v3g"><div class="v3l"><div class="v3h"><h1>Achievements</h1><p class="lede">An achievement is a dated fact about something you did. It stays.</p></div>'
  +'<div class="hz1">'+horizonText()+arcSays('The outer arc is what you have released, against the estimate for your age.')+'</div></div>'
  +'<div class="fstage" id="fs"></div>'
  +'<div class="v3r"><p class="small">Each point of light is one pattern you let go, near the place it left from. A thin ring sits on each place.</p>'
  +'<div class="turnk">'+turnKey(P.turn)+'<p class="small">'+TURN_SAYS+'</p></div></div></div>'
  +'<details class="fold" id="fold"'+(Q.has('open')?' open':'')+'><summary><span>What you have done</span><span class="small">newest first</span></summary>'
  +'<section class="ledger" aria-label="What you have done, newest first">'+ledgerHtml()+'</section></details></div>';
 const fs=$('#fs');const L=fieldLayout(mob?fs.clientWidth:Math.min(fs.clientWidth,820),innerHeight-fs.getBoundingClientRect().top-90);
 const body=bodySvg({h:L.h,ringPx:mob?3.4:4,vx:[25,50]});
 fs.innerHTML='<canvas id="fcv" aria-hidden="true"></canvas><svg class="stagesvg" data-hit width="'+L.Wd+'" height="'+L.S.toFixed(0)+'" viewBox="0 0 '+L.Wd+' '+L.S.toFixed(0)+'">'
  +horizonRing(L.cx,L.cy,L.r+(mob?8:11),{w:2,bw:mob?6:8})
  +turnRing(L.cx,L.cy,L.r,P.turn,{w:2,iconR:mob?L.r-18:L.r+32,iconS:mob?15:18})
  +body.replace('<svg class="bodysvg"','<svg class="bodysvg" x="'+L.x0.toFixed(1)+'" y="'+L.fy.toFixed(1)+'"')+'</svg>';
 FIELD=buildField(L);paintField(null);}
start();
