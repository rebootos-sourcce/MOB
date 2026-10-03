"use strict";
/* ============================================================
   THE SHARED CORE for the two point cloud mockups, round NY.

   WHAT "THE POINT CLOUD" IS. His own word for the Registers view on the
   Compass, rounds KR, KS and LE, built in atuned_src/ui/cone.js as
   coneRegisters. It is the only surface in the product drawn as a cloud of
   points. The Field's wheel is wedges and beads and has no point cloud.

   WHAT IS PORTED, NOT INVENTED. Seven shells, one per seat, each at its
   seat's wavelength (396 Hz over its own tone, so Root is outermost and
   Crown sits at 0.41). Every address is a patch on its seat's shell on the
   same fibonacci lattice, with the same front wedge cut away. Its pull is
   the engine's own leverPull on its charge, copied below to the digit. That
   share of the patch's points falls in and down and goes dark, gathered
   tighter as the pull grows. A share of 0.28 of the fallen matter is caught
   on the way down and falls again, shell to knot, over and over. The ball of
   light at the centre is CQ squared. Colours are the seat tokens with his
   thirty per cent of saturation, as shipped.

   WHAT IS TOY. The charge on every address. Each seat has one load, the
   slider, and each address carries a fixed seeded share of it. CQ is a toy
   formula on the mean pull, not compute(). Nothing here reads a profile.
   ============================================================ */
const BANDS=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
const PAL={Root:'#D6524C',Sacral:'#D8924E',Solar:'#DABF6A',Heart:'#5FD5A6',Throat:'#5EBBDB','3rd Eye':'#7D93E0',Crown:'#A77EDB'};
const HZ={Root:396,Sacral:417,Solar:528,Heart:639,Throat:741,'3rd Eye':852,Crown:963};
/* the addresses, by seat, in the order the wheel carries them, read out of
   engine.js on 1 October. Names only. */
const ADDR={
 Root:["Fear","Shame","Guilt","Control","Insecurity","Victimhood","Scarcity","Root_08_Unnamed","Possession","Lethargy","Resistance","Compulsion","Disconnection","Escapism","Panic","Collapse"],
 Sacral:["Addiction","Lust","Envy","Jealousy","Co-Dependency","Shame Of Desire","Hypersexuality","Avoidance Of Pleasure","Manipulation Through Emotion","Oversensitivity","Fantasy","Infatuation","Obsession","Guilt Of Pleasure","Need For Approval","Excess Emotion"],
 Solar:["Pride","Arrogance","Competition","Anger","Judgment","Entitlement","Rebellion","Perfectionism","Force","Rigidity","Resentment (Solar)","Unworthiness","Anxiety","Self-Judgment (Solar)","Need To Win","Superiority"],
 Heart:["Hatred","Resentment (Heart)","Self-Judgment (Heart)","Betrayal","Separation","Martyrdom","Longing","Closed Heart","Manipulative Kindness","Expectation","Blame","False Love","Rejection","Avoidance Of Grief","Need To Be Needed"],
 Throat:["Deceit","Self-Silencing","People Pleasing","Lying","Interrupting","Comparison","Excuse","Stage Performing","Speaking To Be Right","Manic Expression","Talking To Avoid Feeling","Spiritual Language To Manipulate"],
 '3rd Eye':["Delusion","Cynicism","Distrust","Hypervigilance","Dogma","Overanalysis","Projection","Paranoia","Distortion","Doubt","Idealism","Lack Of Discernment"],
 Crown:["Doubt Of God","Hubris","Spiritual Pride","Nihilism","Spiritual Escapism","False Humility","Seeking Validation","Savior Complex","Condemnation","Need To Be Special","Unworthy Of God","Knowing Better Than God","Denial Of Truth","Rejection Of Spirit","Fear Of God","Anger At God","Forgetfulness","Denial Of Light","Rejection Of Unity","Self-Exclusion","Endless Seeking"]};
function addrName(k){return /_Unnamed$/.test(k)?'No name yet':k;}

/* THE PULL, the engine's own curve, engine/compute.js, copied to the digit:
   0.008 at 2, 0.21 at 4, 0.50 at 5, 0.79 at 6, 0.95 at 7. */
const LEVER_MU=5, LEVER_SD=1.25;
function leverPhi(z){
 const t=1/(1+0.3275911*Math.abs(z/Math.SQRT2)), x=z/Math.SQRT2;
 const y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x);
 return 0.5*(1+(x>=0?y:-y));}
const LEVER_TOP=leverPhi((10-LEVER_MU)/LEVER_SD);
function leverPull(w){return leverPhi((w-LEVER_MU)/LEVER_SD)/LEVER_TOP;}

const TAU=Math.PI*2;
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
function hx(c){const n=parseInt(c.slice(1),16);return [n>>16&255,n>>8&255,n&255];}
function mixc(a,b,k){return [a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];}
function rgba(c,a){return 'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+Math.max(0,Math.min(1,a)).toFixed(3)+')';}
function clamp(v,a,b){return v<a?a:(v>b?b:v);}
function sstep(a,b,v){const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);}
const INK=[239,237,232], ACC=hx('#7EB8D4');
const SEATC=BANDS.map(b=>hx(PAL[b]));
/* saturation times k in HSL, the shipped rgsSat */
function satK(c,k){
 const r=c[0]/255,g=c[1]/255,b=c[2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b);
 const l=(mx+mn)/2,d=mx-mn;if(d<1e-6)return [c[0],c[1],c[2]];
 let s=l>.5?d/(2-mx-mn):d/(mx+mn),h;
 if(mx===r)h=(g-b)/d+(g<b?6:0);else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;
 h/=6;s=Math.min(1,s*k);
 const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;
 const f=t=>{t-=Math.floor(t);return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p;};
 return [Math.round(f(h+1/3)*255),Math.round(f(h)*255),Math.round(f(h-1/3)*255)];}
/* a seeded random, so a cloud is the same picture every load */
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);
 t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function gauss(r){const u=r()||1e-9,v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*v);}

/* ---- the addresses, and each one's fixed share of its seat's load ---- */
/* THE SHARES ARE TOY AND SO IS ONE ASSUMPTION IN THEM: in every seat, three
   addresses that sit side by side on the shell carry the most. That is what
   makes a loaded seat drop one dense, fused cluster beside lighter knots and
   sparse ones, so density has something to show. The engine says nothing
   about neighbours carrying together; where an address sits on its shell is
   laid out, not measured, in the shipped view too. The lattice below is the
   shipped one, computed early so the neighbours can be found. */
function lattice(si,j,N){const c0=Math.PI/2-1.75/2,yy=1-2*(j+.5)/N,rr=Math.sqrt(1-yy*yy);
 const fr=(j*0.618034+si*0.37)%1,th=c0+1.75+.12+fr*(TAU-1.75-.24);return [Math.cos(th)*rr,yy,Math.sin(th)*rr];}
const A=[];
(function(){const r=rng(4021);BANDS.forEach((b,si)=>{const N=ADDR[b].length;
 const C=ADDR[b].map((nm,j)=>lattice(si,j,N));
 /* THE GROUP IS THE THREE WHOSE FALLEN KNOTS LAND CLOSEST ON SCREEN, AND
    STAY CLOSE AS THE FIGURE SWAYS. Side by side on the shell was the first
    cut and it fused nothing: a fully pulled knot gathers to a needle a few
    pixels wide, and neighbours on a shell of sixteen land forty pixels
    apart. Closest at rest was the second, and the sway, 0.45 radians each
    way, carried them apart again. So each address's knot at full pull is
    put through the view's own projection at five points of the sway, and
    the named triple whose worst spread is smallest wins. Measured: only
    Crown, the smallest shell with the most addresses, keeps a triple
    within a fifteenth of the outer radius. */
 const R=396/HZ[b],cp=Math.cos(.3),spn=Math.sin(.3),YW=[-.45,-.2,0,.2,.45];
 const K=C.map(c=>YW.map(yw=>{const x=c[0]*R*.78,z=c[2]*R*.78,y=c[1]*R*.78-.5*R,x1=x*Math.cos(yw)+z*Math.sin(yw),z1=-x*Math.sin(yw)+z*Math.cos(yw);
  const y2=y*cp-z1*spn,z2=y*spn+z1*cp,k=4.2/(4.2-z2);return [x1*k,y2*k];}));
 let near=[0,1,2],bs=1e9;const ok=j=>!/_Unnamed$/.test(ADDR[b][j]);
 for(let p=0;p<N;p++)for(let q=p+1;q<N;q++)for(let s=q+1;s<N;s++){if(!ok(p)||!ok(q)||!ok(s))continue;let w=0;
  for(let y=0;y<YW.length;y++){const mx=(K[p][y][0]+K[q][y][0]+K[s][y][0])/3,my=(K[p][y][1]+K[q][y][1]+K[s][y][1])/3;
   for(const j of [p,q,s])w=Math.max(w,Math.hypot(K[j][y][0]-mx,(K[j][y][1]-my)*.5));}
  if(w<bs){bs=w;near=[p,q,s];}}
 ADDR[b].forEach((nm,j)=>{const g=near.indexOf(j);
  const prof=g>=0?[1.24,1.17,1.1][g]:.3+.45*r();
  A.push({nm,b,si,j,N,prof,grp:g>=0,sq:0,pt:0,p:0,pb:-1});});});})();

/* FOUR TOY STATES, seat loads Root to Crown. One seat puts nearly all the
   charge on Root, so its heaviest three drop dense knots, the rest of Root
   drops part of its matter, and every other seat stays on its shell: three
   densities on one screen. Spread
   is shaped like a heavy demo profile, four seats near five. Clear is a
   person carrying almost nothing: the ball of light and no fallen matter.
   Collapse is everything past six. */
const PRESETS=[
 {nm:'One seat',k:'seat',L:[7.4,2.0,1.6,2.2,1.8,1.4,1.6]},
 {nm:'Spread',k:'spread',L:[6.4,6.1,3.6,5.9,6.4,3.4,3.2]},
 {nm:'Clear',k:'clear',L:[1.1,1.4,.9,1.6,1.2,.8,1.0]},
 {nm:'Collapse',k:'collapse',L:[9.2,8.9,8.6,9.1,8.8,8.5,9.0]}];
const SL=BANDS.map(()=>0), ST=BANDS.map(()=>0);
let preset=0, cycling=false, cycT=null;
function setPreset(i,instant){preset=i;BANDS.forEach((b,s)=>{ST[s]=PRESETS[i].L[s];if(instant)SL[s]=ST[s];});
 document.querySelectorAll('.chip[data-p]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.p===i?'true':'false'));}

/* ---- the cloud. rgsBuild, ported ---- */
const CUT=1.75, PTS=3400, AT=270, CORE=2200, DIST=4.2, BIN=32, PITCH=0.30;
const CL={dens:0,n:0,tot:0,ad:null,R:null,T:null};
function build(dens,cfg){
 const r=rng(1234);
 CL.R=BANDS.map(b=>396/HZ[b]);
 CL.T=CL.R.map(R=>4.2*R);
 const c0=Math.PI/2-CUT/2; let tot=0; const ad=[];
 BANDS.forEach((b,si)=>{const mine=A.filter(a=>a.si===si),N=mine.length;
  const R=CL.R[si], per=Math.max(6,Math.round(PTS*dens*R*R/N));
  const capR=Math.sqrt(4*(1-CUT/TAU)/N)*.9;
  mine.forEach((a,j)=>{
   const yy=1-2*(j+.5)/N, rr=Math.sqrt(1-yy*yy);
   const fr=(j*0.618034+si*0.37)%1, th=c0+CUT+.12+fr*(TAU-CUT-.24);
   const c=[Math.cos(th)*rr,yy,Math.sin(th)*rr];
   const up=Math.abs(c[1])>.9?[1,0,0]:[0,1,0];
   let t1=[c[1]*up[2]-c[2]*up[1],c[2]*up[0]-c[0]*up[2],c[0]*up[1]-c[1]*up[0]];
   const l1=Math.hypot(t1[0],t1[1],t1[2]);t1=[t1[0]/l1,t1[1]/l1,t1[2]/l1];
   const t2=[c[1]*t1[2]-c[2]*t1[1],c[2]*t1[0]-c[0]*t1[2],c[0]*t1[1]-c[1]*t1[0]];
   a.c=c;a.t1=t1;a.t2=t2;a.capR=capR;a.o=tot;a.per=per;a.pb=-1;ad.push(a);tot+=per;});});
 const nc=Math.round(CORE*dens), N2=tot+nc, F=()=>new Float32Array(N2);
 Object.assign(CL,{lx:F(),ly:F(),lz:F(),da:F(),dc:F(),ds:F(),jr:F(),fm:F(),rk:F(),ux:F(),uy:F(),uz:F(),
  X:F(),Y:F(),Z:F(),K:F(),WG:F(),VIS:F(),LD:F(),
  si:new Uint8Array(N2),ai:new Uint16Array(N2),dk:new Uint8Array(N2),bin:new Uint8Array(N2),
  ord:new Uint32Array(N2),cnt:new Uint32Array(BIN+1)});
 ad.forEach((a,ai)=>{const c=a.c,t1=a.t1,t2=a.t2;
  for(let k=0;k<a.per;k++){const i=a.o+k;
   CL.si[i]=a.si;CL.ai[i]=ai;CL.rk[i]=(k+.5)/a.per;
   const aa=a.capR*Math.sqrt(r()),bb=r()*TAU,ca=Math.cos(aa),sa=Math.sin(aa),cb=Math.cos(bb),sb=Math.sin(bb),jt=1+gauss(r)*.008;
   CL.lx[i]=(c[0]*ca+(t1[0]*cb+t2[0]*sb)*sa)*jt;
   CL.ly[i]=(c[1]*ca+(t1[1]*cb+t2[1]*sb)*sa)*jt;
   CL.lz[i]=(c[2]*ca+(t1[2]*cb+t2[2]*sb)*sa)*jt;
   const b2=r()*TAU;CL.da[i]=Math.sqrt(r());CL.dc[i]=Math.cos(b2);CL.ds[i]=Math.sin(b2);
   const caught=r()<.28, ph=r(), jr=.8+.4*r();
   /* the concept may ask for the caught matter to fall in clumps, as drops,
      rather than one point at a time: two phases per address and a tight
      fall length, so a clump stays a clump on the way down. Three a cycle
      read as a leaking ceiling by the fortieth look at a heavy profile; two
      is one drop every 1.8 seconds per address. */
   if(caught&&cfg.drops){CL.fm[i]=Math.floor(ph*2)/2+(r()-.5)*.035;CL.jr[i]=1+(r()-.5)*.05;}
   else {CL.fm[i]=caught?ph:-1;CL.jr[i]=jr;}}});
 for(let i=tot;i<N2;i++){let u,v,w;
  do{u=gauss(r)*.12;v=gauss(r)*.12;w=gauss(r)*.12;}while(Math.hypot(u,v,w)>.36);
  CL.lx[i]=CL.ux[i]=u;CL.ly[i]=CL.uy[i]=v;CL.lz[i]=CL.uz[i]=w;
  CL.si[i]=7;CL.ai[i]=65535;CL.rk[i]=(i-tot+.5)/nc;CL.fm[i]=-1;CL.jr[i]=1;}
 CL.ad=ad;CL.tot=tot;CL.n=N2;CL.dens=dens;}
/* rgsDirs, ported: the share under the pull falls, gathered tighter as it grows */
function dirs(a){
 const p=a.p,ks=a.capR*(1-.8*p)*.55,c=a.c,t1=a.t1,t2=a.t2;
 for(let i=a.o;i<a.o+a.per;i++){
  if(CL.rk[i]<p){const an=ks*CL.da[i],ca=Math.cos(an),sa=Math.sin(an),cb=CL.dc[i],sb=CL.ds[i];
   CL.ux[i]=c[0]*ca+(t1[0]*cb+t2[0]*sb)*sa;CL.uy[i]=c[1]*ca+(t1[1]*cb+t2[1]*sb)*sa;
   CL.uz[i]=c[2]*ca+(t1[2]*cb+t2[2]*sb)*sa;CL.dk[i]=1;}
  else {CL.ux[i]=CL.lx[i];CL.uy[i]=CL.ly[i];CL.uz[i]=CL.lz[i];CL.dk[i]=0;}}
 a.pb=p;}

/* ---- the frame ---- */
const F={};   /* everything a concept reads, rebuilt each frame */
function geo(W,H){
 const side=W>=700?28:16;
 const s0=Math.max(40,Math.min((W-2*side)/2/1.15,(H-40)/2/1.38));
 return {s0,cx:W/2,cy:H/2-.06*s0};}
function project(t,dt,W,H,cfg){
 const G=geo(W,H);
 const dens=Math.round(clamp(Math.pow(G.s0/AT,2),.35,1.6)*20)/20;
 if(dens!==CL.dens||!CL.n)build(dens,cfg);
 /* the seat loads ease toward the slider, the pulls toward their charge */
 const k=REDUCED?1:1-Math.exp(-dt/.32), kp=REDUCED?1:1-Math.exp(-dt/.2);
 BANDS.forEach((b,s)=>{SL[s]+=(ST[s]-SL[s])*k;if(Math.abs(ST[s]-SL[s])<.002)SL[s]=ST[s];});
 const sp=[0,0,0,0,0,0,0],sn=[0,0,0,0,0,0,0];let mp=0;
 CL.ad.forEach(a=>{a.sq=clamp(SL[a.si]*a.prof,0,10);a.pt=leverPull(a.sq);
  a.p+=(a.pt-a.p)*kp;if(Math.abs(a.pt-a.p)<.0005)a.p=a.pt;
  if(a.pb<0||Math.abs(a.p-a.pb)>.004)dirs(a);sp[a.si]+=a.p;sn[a.si]++;mp+=a.p;});
 mp/=CL.ad.length;
 /* TOY CQ. Not compute(): one minus the mean pull, bent so a heavy profile
    lands low. Clear reads in the nineties and Collapse under five. */
 const CQ=clamp(Math.pow(1-mp,2.2),0,1);
 const Rt=CL.R.map((R,s)=>REDUCED||!sn[s]?R:R*(1+.03*(1-sp[s]/sn[s])*Math.sin(TAU*t/CL.T[s])));Rt.push(1);
 const yaw=REDUCED?0:.45*Math.sin(t*.21), cy_=Math.cos(yaw),sy_=Math.sin(yaw),cp=Math.cos(PITCH),spn=Math.sin(PITCH);
 const nCore=Math.round((CL.n-CL.tot)*CQ*CQ);
 /* THE FALL. The shipped view drops the caught matter on a straight line in
    time, (phase + t) mod 1, which is the one curve nothing falls on. Here it
    is the square of it: slow to leave the shell, fast into the knot, which is
    gravity, and it gives the drop its gather before it lets go for free. */
 const tf=REDUCED?0:t/3.6;
 const X=CL.X,Y=CL.Y,Z=CL.Z,K=CL.K,BN=CL.bin,CN=CL.cnt,WG=CL.WG;
 const UX=CL.ux,UY=CL.uy,UZ=CL.uz,SI=CL.si,AI=CL.ai,DK=CL.dk,FM=CL.fm,JR=CL.jr,ad=CL.ad,on=F.seatOn||[1,1,1,1,1,1,1];
 CN.fill(0);let live=0;const sc=G.s0;
 for(let i=0;i<CL.n;i++){const s=SI[i];
  if((s<7&&!on[s])||(s===7&&i-CL.tot>=nCore)){BN[i]=255;continue;}
  const R=Rt[s];let x=UX[i]*R,y=UY[i]*R,z=UZ[i]*R,w=1;
  if(DK[i]){const p=ad[AI[i]].p;let f=1;
   /* REDUCED MOTION GETS THE END STATE: everything caught has landed. The
      shipped view freezes it mid fall instead, which is a paused animation,
      not an end state. */
   if(FM[i]>=0&&!REDUCED){const ph=((FM[i]+tf)%1+1)%1;f=ph*ph;
    /* a caught point comes in over the first tenth of its fall, so a drop
       swells on the shell rather than appearing there */
    w=sstep(0,.1,ph);}
   const rf=1-.22*p*f;x*=rf;z*=rf;y=y*rf-.5*p*f*JR[i]*R;}
  const x1=x*cy_+z*sy_,z1=-x*sy_+z*cy_,y2=y*cp-z1*spn,z2=y*spn+z1*cp;
  const kk=DIST/(DIST-z2);
  X[i]=G.cx+x1*kk*sc;Y[i]=G.cy-y2*kk*sc;Z[i]=z2;K[i]=kk;WG[i]=w;
  let bq=Math.floor((z2+1.4)/2.8*BIN);bq=bq<0?0:(bq>=BIN?BIN-1:bq);
  BN[i]=bq;CN[bq+1]++;live++;}
 for(let q=1;q<=BIN;q++)CN[q]+=CN[q-1];
 const OR=CL.ord;for(let i=0;i<CL.n;i++)if(BN[i]!==255)OR[CN[BN[i]]++]=i;
 /* the palette, shipped: lit toward the ink by CQ, fallen a quarter of the
    token, both at his thirty per cent */
 const hot=mixc(INK,ACC,.18),LC=[],DC=[];
 for(let q=0;q<7;q++){const col=SEATC[q];
  LC.push(satK(mixc(col,INK,.06+.26*CQ),1.3));
  DC.push(satK([Math.round(col[0]*.26),Math.round(col[1]*.22),Math.round(col[2]*.22)],1.3));}
 LC.push(satK(hot,1.3));DC.push(LC[7]);
 Object.assign(F,{W,H,t,G,CQ,mp,live,LC,DC,hot,br:REDUCED?1:.86+.14*Math.sin(TAU*t/4.2)});}

/* ---- density. Every live point is splatted into a grid of GC pixel cells,
   fallen matter and light in separate channels, the fallen one carrying its
   seat's colour, then blurred. Units: points per hundred square pixels, so a
   threshold means the same at a desk and on a phone. ---- */
const GC=3;
/* THE GRID COVERS THE FIGURE, NOT THE STAGE. At a desk the stage is half
   again as wide as the figure, and every channel is blurred every frame, so
   the empty sides were most of the cost. ox, oy is where it starts. */
const DG={gw:0,gh:0,ox:0,oy:0};
function gridAlloc(){const G=F.G,s=G.s0;
 const ox=Math.max(0,Math.floor(G.cx-1.3*s)),oy=Math.max(0,Math.floor(G.cy-1.25*s));
 const x1=Math.min(F.W,Math.ceil(G.cx+1.3*s)),y1=Math.min(F.H,Math.ceil(G.cy+1.55*s));
 const gw=Math.ceil((x1-ox)/GC)+3,gh=Math.ceil((y1-oy)/GC)+3;DG.ox=ox;DG.oy=oy;
 if(gw===DG.gw&&gh===DG.gh)return;const n=gw*gh,f=()=>new Float32Array(n);
 Object.assign(DG,{gw,gh,Fd:f(),Fl:f(),Fm:f(),Cr:f(),Cg:f(),Cb:f(),Cw:f(),tmp:f()});}
function blur(a,rad,passes){const gw=DG.gw,gh=DG.gh,t=DG.tmp,inv=1/(2*rad+1),gw1=gw-1,gh1=gh-1;
 for(let p=0;p<passes;p++){
  for(let y=0;y<gh;y++){const o=y*gw;let s=a[o]*rad;
   for(let x=0;x<=rad;x++)s+=a[o+(x<gw1?x:gw1)];
   for(let x=0;x<gw;x++){t[o+x]=s*inv;const xa=x+rad+1,xr=x-rad;s+=a[o+(xa<gw1?xa:gw1)]-a[o+(xr>0?xr:0)];}}
  for(let x=0;x<gw;x++){let s=t[x]*rad;
   for(let y=0;y<=rad;y++)s+=t[(y<gh1?y:gh1)*gw+x];
   for(let y=0;y<gh;y++){a[y*gw+x]=s*inv;const ya=y+rad+1,yr=y-rad;s+=t[(ya<gh1?ya:gh1)*gw+x]-t[(yr>0?yr:0)*gw+x];}}}}
function density(cfg){
 gridAlloc();const gw=DG.gw,gh=DG.gh,Fd=DG.Fd,Fl=DG.Fl,Cr=DG.Cr,Cg=DG.Cg,Cb=DG.Cb,ox=DG.ox,oy=DG.oy;
 Fd.fill(0);Fl.fill(0);Cr.fill(0);Cg.fill(0);Cb.fill(0);
 const X=CL.X,Y=CL.Y,DK=CL.dk,SI=CL.si,WG=CL.WG,OR=CL.ord,u=100/(GC*GC);
 for(let q=0;q<F.live;q++){const i=OR[q];
  const gx=(X[i]-ox)/GC+1,gy=(Y[i]-oy)/GC+1,x0=gx|0,y0=gy|0;if(x0<0||y0<0||x0>=gw-1||y0>=gh-1)continue;
  const fx=gx-x0,fy=gy-y0,w=WG[i]*u,o=y0*gw+x0;
  const w00=(1-fx)*(1-fy)*w,w10=fx*(1-fy)*w,w01=(1-fx)*fy*w,w11=fx*fy*w;
  if(DK[i]){Fd[o]+=w00;Fd[o+1]+=w10;Fd[o+gw]+=w01;Fd[o+gw+1]+=w11;
   const c=SEATC[SI[i]];
   Cr[o]+=c[0]*w00;Cr[o+1]+=c[0]*w10;Cr[o+gw]+=c[0]*w01;Cr[o+gw+1]+=c[0]*w11;
   Cg[o]+=c[1]*w00;Cg[o+1]+=c[1]*w10;Cg[o+gw]+=c[1]*w01;Cg[o+gw+1]+=c[1]*w11;
   Cb[o]+=c[2]*w00;Cb[o+1]+=c[2]*w10;Cb[o+gw]+=c[2]*w01;Cb[o+gw+1]+=c[2]*w11;}
  else {Fl[o]+=w00;Fl[o+1]+=w10;Fl[o+gw]+=w01;Fl[o+gw+1]+=w11;}}
 /* colour is only ever asked which seat, so it is blurred once and wide,
    against its own weight */
 DG.Cw.set(Fd);[Cr,Cg,Cb,DG.Cw].forEach(a=>blur(a,3,1));
 blur(Fd,cfg.blurR,cfg.blurN);
 /* light is spread thinner and evenly, so its crowd is read wider: the
    ball of light is a ball and not the noise of the points in it */
 blur(Fl,2,2);blur(Fl,3,2);
 /* THE MEDIUM'S OWN FIELD. The trace reads Fd, the matter where it is. The
    liquid or the coral reads Fm, the same matter spread a little wider, so
    a medium can reach across a gap the points themselves leave: surface
    tension in one, the coastline's reach in the other. */
 DG.Fm.set(Fd);if(cfg.mR)blur(DG.Fm,cfg.mR,cfg.mN);
 /* each point's own neighbourhood, read back, so a concept can dissolve a
    point where it is crowded and leave it a point where it is alone */
 let mx=0;for(let i=0;i<Fd.length;i++)if(Fd[i]>mx)mx=Fd[i];F.dmax=mx;
 const LD=CL.LD,Fm=DG.Fm;
 for(let q=0;q<F.live;q++){const i=OR[q];LD[i]=sampleG(DK[i]?Fm:Fl,X[i],Y[i]);}}
/* bilinear read of a grid at a CSS pixel */
function sampleG(a,x,y){const gw=DG.gw,gx=(x-DG.ox)/GC+1,gy=(y-DG.oy)/GC+1;let x0=gx|0,y0=gy|0;
 if(x0<0||y0<0||x0>=gw-1||y0>=DG.gh-1)return 0;const fx=gx-x0,fy=gy-y0,o=y0*gw+x0;
 return (a[o]*(1-fx)+a[o+1]*fx)*(1-fy)+(a[o+gw]*(1-fx)+a[o+gw+1]*fx)*fy;}
/* the seat colour of the fallen matter at a pixel */
function colAt(x,y){const w=sampleG(DG.Cw,x,y)||1e-6;
 return [sampleG(DG.Cr,x,y)/w,sampleG(DG.Cg,x,y)/w,sampleG(DG.Cb,x,y)/w];}

/* ---- the points, coneRegisters' own writer: one ImageData, light added,
   dark laid over, back to front. VIS is the concept's say over each point. */
const PX={img:null};
function drawPoints(ctx,dpr){
 const BW=ctx.canvas.width,BH=ctx.canvas.height;
 if(!PX.img||PX.img.width!==BW||PX.img.height!==BH)PX.img=ctx.createImageData(BW,BH);
 const D=PX.img.data;D.fill(0);PX.BW=BW;PX.BH=BH;PX.D=D;
 const OR=CL.ord,SI=CL.si,DK=CL.dk,X=CL.X,Y=CL.Y,Z=CL.Z,K=CL.K,VIS=CL.VIS,WG=CL.WG,ad=CL.ad,LC=F.LC,DC=F.DC,CQ=F.CQ;
 const cqA=.26+.60*CQ, on=F.seatOn;
 for(let q=0;q<F.live;q++){const i=OR[q],s2=SI[i],dark=DK[i]===1;let al,sz,cc;
  const v=VIS[i]*WG[i];if(v<.01)continue;
  if(s2===7){cc=LC[7];al=(.30*CQ+.05)*F.br;sz=1.2;}
  else if(dark){cc=DC[s2];al=.72;sz=2.1;}
  else {const dA=.55+.45*clamp((Z[i]+1.2)/2.4,0,1);cc=LC[s2];al=cqA*(1-.55*ad[CL.ai[i]].p)*dA;sz=1.35;}
  al*=v;sz*=(.75+.35*K[i])*dpr;
  let w=Math.ceil(sz*Math.sqrt(al)-.001);w=w<1?1:(w>3?3:w);
  let aa=al*sz*sz/(w*w);if(aa>1)aa=1;if(aa<.004)continue;
  let x0=Math.round(X[i]*dpr-w/2),y0=Math.round(Y[i]*dpr-w/2),x2=x0+w,y3=y0+w;
  if(x0<0)x0=0;if(y0<0)y0=0;if(x2>BW)x2=BW;if(y3>BH)y3=BH;if(x0>=x2||y0>=y3)continue;
  const cr=cc[0],cg=cc[1],cb=cc[2],a255=aa*255;
  for(let yy=y0;yy<y3;yy++)for(let xx=x0;xx<x2;xx++){const o=(yy*BW+xx)*4,A0=D[o+3];
   if(A0===0){D[o]=cr;D[o+1]=cg;D[o+2]=cb;D[o+3]=a255;continue;}
   const Af=A0/255;let na,k1;
   if(dark){na=Af+aa-Af*aa;k1=Af*(1-aa);}else {na=Af+aa;if(na>1)na=1;k1=Af;}
   const iv=1/na;
   D[o]=(D[o]*k1+cr*aa)*iv;D[o+1]=(D[o+1]*k1+cg*aa)*iv;D[o+2]=(D[o+2]*k1+cb*aa)*iv;D[o+3]=na*255;}}}
/* the medium is written into the same buffer, so it lands at the backing
   store's own resolution and the frame is still one put */
function overPx(o,r,g,b,A){const D=PX.D,Af=D[o+3]/255;if(A>1)A=1;if(A<.002)return;
 const na=A+Af*(1-A),k=Af*(1-A),iv=1/na;
 D[o]=(r*A+D[o]*k)*iv;D[o+1]=(g*A+D[o+1]*k)*iv;D[o+2]=(b*A+D[o+2]*k)*iv;D[o+3]=na*255;}
function addPx(o,r,g,b,A){const D=PX.D,Af=D[o+3]/255;if(A<.002)return;
 let na=Af+A;if(na>1)na=1;const iv=1/na;
 D[o]=Math.min(255,(D[o]*Af+r*A)*iv);D[o+1]=Math.min(255,(D[o+1]*Af+g*A)*iv);D[o+2]=Math.min(255,(D[o+2]*Af+b*A)*iv);D[o+3]=na*255;}
/* every backing pixel inside a grid square the concept marked active. The
   medium is only ever paid for where there is matter. */
function eachActive(act,dpr,fn){const gw=DG.gw,gh=DG.gh,BW=PX.BW,BH=PX.BH;
 for(let gy=0;gy<gh-1;gy++)for(let gx=0;gx<gw-1;gx++){if(!act[gy*gw+gx])continue;
  const X0=DG.ox+(gx-1)*GC,Y0=DG.oy+(gy-1)*GC;
  const px0=Math.max(0,Math.ceil(X0*dpr-.5)),px1=Math.min(BW,Math.ceil((X0+GC)*dpr-.5));
  const py0=Math.max(0,Math.ceil(Y0*dpr-.5)),py1=Math.min(BH,Math.ceil((Y0+GC)*dpr-.5));
  for(let py=py0;py<py1;py++)for(let px=px0;px<px1;px++)fn((py*BW+px)*4,(px+.5)/dpr,(py+.5)/dpr);}}
/* a square is active when any corner of it is over a level, then grown by
   rad squares for a concept whose medium reaches past its own matter */
function activeMask(a,lev,out,rad){const gw=DG.gw,gh=DG.gh;
 for(let y=0;y<gh;y++)for(let x=0;x<gw;x++){const o=y*gw+x;
  out[o]=(x<gw-1&&y<gh-1&&(a[o]>lev||a[o+1]>lev||a[o+gw]>lev||a[o+gw+1]>lev))?1:0;}
 if(!rad)return out;const t=new Uint8Array(out.length);
 for(let y=0;y<gh;y++)for(let x=0;x<gw;x++){let m=0;for(let k=-rad;k<=rad&&!m;k++){const xx=x+k;if(xx>=0&&xx<gw&&out[y*gw+xx])m=1;}t[y*gw+x]=m;}
 for(let y=0;y<gh;y++)for(let x=0;x<gw;x++){let m=0;for(let k=-rad;k<=rad&&!m;k++){const yy=y+k;if(yy>=0&&yy<gh&&t[yy*gw+x])m=1;}out[y*gw+x]=m;}
 return out;}
function nearestSeat(c){let k=0,kd=1e9;for(let s=0;s<7;s++){const S=SEATC[s],d=Math.abs(S[0]-c[0])+Math.abs(S[1]-c[1])+Math.abs(S[2]-c[2]);if(d<kd){kd=d;k=s;}}return k;}
function putPoints(ctx){ctx.putImageData(PX.img,0,0);}

/* the ball of light's glow, the needle's own: the accent as the canvas's
   background, repainted only when it changes */
let GLOWSIG='';
function glow(cv){const G=F.G,CQ=F.CQ,sc=G.s0;
 const gR1=Math.round(sc*(.35+.9*CQ)),gR2=Math.round(sc*.28),ga1=.30*CQ*CQ,ga2=.55*CQ*CQ;
 const sig=[Math.round(G.cx),Math.round(G.cy),gR1,gR2,ga1.toFixed(3)].join('|');if(sig===GLOWSIG)return;GLOWSIG=sig;
 const at=' at '+Math.round(G.cx)+'px '+Math.round(G.cy)+'px,';
 cv.style.backgroundImage=ga1<.004?'none':'radial-gradient(circle '+gR2+'px'+at+rgba(F.hot,ga2)+','+rgba(F.hot,ga2*.35)+' 35%,'+rgba(F.hot,0)+' 100%),'
  +'radial-gradient(circle '+gR1+'px'+at+rgba(ACC,ga1)+','+rgba(ACC,ga1*.35)+' 35%,'+rgba(ACC,0)+' 100%)';}

/* ---- per address, where its fallen matter sits on screen: the settled
   points only, so the figure does not swim with the drops ---- */
function knots(){const out=CL.ad.map(()=>({x:0,y:0,n:0,x0:1e9,y0:1e9,x1:-1e9,y1:-1e9}));
 const OR=CL.ord,DK=CL.dk,AI=CL.ai,FM=CL.fm,X=CL.X,Y=CL.Y,SI=CL.si;
 for(let q=0;q<F.live;q++){const i=OR[q];if(SI[i]===7||!DK[i]||FM[i]>=0)continue;const k=out[AI[i]];
  k.x+=X[i];k.y+=Y[i];k.n++;if(X[i]<k.x0)k.x0=X[i];if(X[i]>k.x1)k.x1=X[i];if(Y[i]<k.y0)k.y0=Y[i];if(Y[i]>k.y1)k.y1=Y[i];}
 out.forEach(k=>{if(k.n){k.x/=k.n;k.y/=k.n;}});return out;}

/* ---- a label set beside a point, with a one pixel leader, kept clear of
   the ones already set ---- */
function plates(ctx,list){const boxes=[];ctx.save();
 /* a phone figure is a third the size, so it carries one name, not three */
 if(F.W<520)list=list.slice(0,1);
 list.forEach(L=>{const fs=12.5,fs2=11.5;
  ctx.font='600 '+fs+'px Inter,system-ui,sans-serif';const w1=ctx.measureText(L.t).width;
  ctx.font='400 '+fs2+'px Inter,system-ui,sans-serif';const w2=ctx.measureText(L.s).width;
  const w=Math.max(w1,w2),h=fs+fs2+6;
  for(const side of (L.x<F.G.cx?[-1,1]:[1,-1])){let lx=L.x+side*(L.r+26),ly=L.y-h/2;
   for(let step=0;step<8;step++){const b={x0:side>0?lx:lx-w,x1:side>0?lx+w:lx,y0:ly,y1:ly+h};
    if(b.x0>4&&b.x1<F.W-4&&b.y0>4&&b.y1<F.H-34&&!boxes.some(o=>b.x0<o.x1+6&&o.x0<b.x1+6&&b.y0<o.y1+4&&o.y0<b.y1+4)){
     boxes.push(b);
     ctx.strokeStyle=rgba(L.c,.7);ctx.lineWidth=1;ctx.beginPath();
     ctx.moveTo(L.x+side*L.r,L.y);ctx.lineTo(lx-side*4,ly+fs*.6);ctx.stroke();
     ctx.textAlign=side>0?'left':'right';ctx.textBaseline='top';
     ctx.lineJoin='round';ctx.strokeStyle='rgba(9,10,14,.85)';ctx.lineWidth=3;
     ctx.font='600 '+fs+'px Inter,system-ui,sans-serif';ctx.strokeText(L.t,lx,ly);ctx.fillStyle=rgba(mixc(L.c,INK,.35),1);ctx.fillText(L.t,lx,ly);
     ctx.font='400 '+fs2+'px Inter,system-ui,sans-serif';ctx.strokeText(L.s,lx,ly+fs+4);ctx.fillStyle='rgba(180,176,168,.95)';ctx.fillText(L.s,lx,ly+fs+4);
     ctx.restore();ctx.save();return;}
    ly+=(step%2?-1:1)*(step+1)*(h+4);}}});
 ctx.restore();}

/* ---- the rail ---- */
const LAYERS={points:1,medium:1,trace:1};
F.seatOn=[1,1,1,1,1,1,1];
function ring(c,on){return '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><circle cx="6" cy="6" r="4.4" fill="none" stroke="'+c+'" stroke-width="1.6"'+(on?'':' stroke-dasharray="1.6 1.8"')+'/></svg>';}
function buildRail(C){
 const r=document.getElementById('rail');
 r.innerHTML='<section class="read" aria-live="polite">'
  +'<div class="lab">Coherence, toy</div><div class="big"><b id="cq"></b><span class="sub" id="cqw"></span></div>'
  +'<div class="blk"><div class="lab">Heaviest pattern</div><div class="val" id="hv"></div><div class="sub" id="hvs"></div></div>'
  +'<div class="blk"><div class="lab">Densest matter</div><div class="val" id="dn"></div><div class="sub" id="dns"></div></div></section>'
  +'<section class="sec"><div class="lab">Layers</div><div class="chips">'
  +'<button class="chip lay" data-l="points">Points</button>'
  +'<button class="chip lay" data-l="medium">'+C.mediumName+'</button>'
  +'<button class="chip lay" data-l="trace">Trace</button></div>'
  +'<p class="hint">'+C.layerHint+' Keys <kbd>P</kbd>, <kbd>'+C.mediumKey+'</kbd> and <kbd>T</kbd>.</p></section>'
  +'<section class="sec"><div class="lab">Examples</div><div class="chips">'
  +PRESETS.map((p,i)=>'<button class="chip" data-p="'+i+'">'+p.nm+'</button>').join('')
  +'<button class="chip" id="cyc" aria-pressed="false">Cycle</button></div>'
  +'<p class="hint">Keys <kbd>1</kbd> to <kbd>4</kbd> pick an example. <kbd>C</kbd> cycles them every six seconds.</p></section>'
  +'<section class="sec"><div class="lab">Charge by seat</div><div class="axes">'
  +BANDS.map((b,i)=>'<div class="ax" data-i="'+i+'" role="slider" tabindex="0" aria-label="'+b+' charge" aria-valuemin="0" aria-valuemax="10">'
   +'<button class="eye" data-s="'+i+'" aria-pressed="true" title="Hide the '+b+' shell">'+ring(PAL[b],1)+'</button><span class="n">'+b+'</span>'
   +'<span class="tr"><i style="background:'+PAL[b]+'"></i><u style="border-color:'+PAL[b]+'"></u></span><span class="f"></span></div>').join('')
  +'</div><p class="hint">Drag a row to load a seat. Its addresses share the load unevenly, so a loaded seat drops several knots of different weight. The ring hides that shell.</p></section>';
 r.querySelectorAll('.chip.lay').forEach(b=>{b.onclick=()=>{LAYERS[b.dataset.l]=LAYERS[b.dataset.l]?0:1;syncLayers();};});
 r.querySelectorAll('.chip[data-p]').forEach(b=>b.onclick=()=>{stopCycle();setPreset(+b.dataset.p);});
 document.getElementById('cyc').onclick=()=>cycling?stopCycle():startCycle();
 r.querySelectorAll('.eye').forEach(b=>{b.addEventListener('pointerdown',e=>e.stopPropagation());
  b.onclick=e=>{e.stopPropagation();const s=+b.dataset.s;F.seatOn[s]=F.seatOn[s]?0:1;
  b.setAttribute('aria-pressed',F.seatOn[s]?'true':'false');b.innerHTML=ring(PAL[BANDS[s]],F.seatOn[s]);
  b.title=(F.seatOn[s]?'Hide':'Show')+' the '+BANDS[s]+' shell';};});
 r.querySelectorAll('.ax').forEach(row=>{
  const i=+row.dataset.i,tr=row.querySelector('.tr');
  const set=e=>{const b=tr.getBoundingClientRect();ST[i]=Math.round(clamp((e.clientX-b.left)/b.width,0,1)*100)/10;
   document.querySelectorAll('.chip[data-p]').forEach(c=>c.setAttribute('aria-pressed','false'));};
  row.addEventListener('pointerdown',e=>{stopCycle();row.setPointerCapture(e.pointerId);set(e);row._d=1;});
  row.addEventListener('pointermove',e=>{if(row._d)set(e);});
  row.addEventListener('pointerup',()=>row._d=0);
  row.addEventListener('keydown',e=>{const s=e.key==='ArrowRight'||e.key==='ArrowUp'?.5:e.key==='ArrowLeft'||e.key==='ArrowDown'?-.5:0;
   if(s){e.preventDefault();stopCycle();ST[i]=clamp(ST[i]+s,0,10);}});});
 document.addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('.ax'))return;
  const k=e.key.toLowerCase();
  if(k>='1'&&k<='4'){stopCycle();setPreset(+k-1);}
  else if(k==='c')cycling?stopCycle():startCycle();
  else if(k==='p'){LAYERS.points^=1;syncLayers();}
  else if(k==='t'){LAYERS.trace^=1;syncLayers();}
  else if(k===C.mediumKey.toLowerCase()){LAYERS.medium^=1;syncLayers();}});
 syncLayers();}
function syncLayers(){document.querySelectorAll('.chip.lay').forEach(b=>b.setAttribute('aria-pressed',LAYERS[b.dataset.l]?'true':'false'));}
function startCycle(){cycling=true;document.getElementById('cyc').setAttribute('aria-pressed','true');
 setPreset((preset+1)%PRESETS.length);cycT=setInterval(()=>setPreset((preset+1)%PRESETS.length),6000);}
function stopCycle(){cycling=false;clearInterval(cycT);const c=document.getElementById('cyc');if(c)c.setAttribute('aria-pressed','false');}
let RAILSIG='';
function syncRail(){
 document.querySelectorAll('.ax').forEach((row,i)=>{const v=SL[i];row.querySelector('.tr i').style.width=(v*10)+'%';
  row.querySelector('.tr u').style.left=(v*10)+'%';row.querySelector('.f').textContent=v.toFixed(1);row.setAttribute('aria-valuenow',v.toFixed(1));});
 let h=null;CL.ad.forEach(a=>{if(!h||a.sq>h.sq)h=a;});
 /* the densest fallen matter: which seat the heaviest grid cell is carrying */
 let mi=0,mv=0;const Fd=DG.Fd;for(let i=0;i<Fd.length;i++)if(Fd[i]>mv){mv=Fd[i];mi=i;}
 let ds='';if(mv>.5){const cw=DG.Cw[mi]||1e-6,c=[DG.Cr[mi]/cw,DG.Cg[mi]/cw,DG.Cb[mi]/cw];let bd=1e9;
  SEATC.forEach((s,k)=>{const d=Math.hypot(s[0]-c[0],s[1]-c[1],s[2]-c[2]);if(d<bd){bd=d;ds=BANDS[k];}});}
 const falling=CL.ad.filter(a=>a.p>=.5).length;
 const cq=Math.round(F.CQ*100);
 const sig=[cq,h.nm,h.sq.toFixed(1),ds,Math.round(mv),falling].join('|');if(sig===RAILSIG)return;RAILSIG=sig;
 document.getElementById('cq').textContent=cq;
 document.getElementById('cqw').textContent=cq>=80?'Mostly light. Little has fallen.':cq>=40?'Some seats are dropping matter.':'Most of the field has fallen.';
 document.getElementById('hv').textContent=h.sq<.5?'Nothing held':addrName(h.nm);
 document.getElementById('hvs').textContent=h.sq<.5?'':h.b+', charge '+h.sq.toFixed(1)+', pull '+Math.round(leverPull(h.sq)*100)+' per cent';
 document.getElementById('dn').textContent=ds?ds:'Nothing has fallen';
 document.getElementById('dns').textContent=ds?(falling===1?'One address':(falling+' addresses'))+' past half their pull. Peak '+mv.toFixed(0)+' points per hundred square pixels.':'Every address is still on its shell.';}

/* ---- the loop ---- */
function fitCanvas(cv){const r=cv.parentNode.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);
 const w=Math.round(r.width*d),h=Math.round(r.height*d);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}return {w:r.width,h:r.height,d};}
function boot(C){
 buildRail(C);setPreset(0,true);
 const st=document.getElementById('stage'),cv=document.createElement('canvas');
 cv.setAttribute('aria-hidden','true');st.insertBefore(cv,st.firstChild);
 const ctx=cv.getContext('2d');C.init&&C.init();
 let last=performance.now(),t0=last,frames=0,cost=0;const PH=[0,0,0,0,0];
 window.__setPreset=i=>{stopCycle();setPreset(i,true);};
 window.__layers=(p,m,t)=>{LAYERS.points=p;LAYERS.medium=m;LAYERS.trace=t;syncLayers();};
 window.__cost=()=>cost/Math.max(1,frames);window.__frames=()=>frames;
 /* per phase, ms a frame: cloud, density, points, medium, trace */
 window.__phases=()=>PH.map(v=>(v/Math.max(1,frames)).toFixed(1)).join(' ');
 window.__resetCost=()=>{frames=0;cost=0;PH.fill(0);};
 /* UNDER REDUCED MOTION A STILL PICTURE IS NOT REDRAWN, the shipped view's
    own rule (DRAW_SIG in wheel.js): the clock is frozen, so once the loads,
    the layers and the size stop changing, every frame is the one before.
    A concept still working, trees not yet grown, says so through busy(). */
 let SIG='',still=0;
 function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;
  const t=REDUCED?0:(now-t0)/1000, S=fitCanvas(cv), a=performance.now();
  if(REDUCED){const sig=[ST.join(),SL.join(),LAYERS.points,LAYERS.medium,LAYERS.trace,F.seatOn.join(),S.w,S.h,S.d].join('|');
   if(sig===SIG&&!(C.busy&&C.busy())){if(++still>3){requestAnimationFrame(frame);return;}}else{SIG=sig;still=0;}}
  project(t,dt,S.w,S.h,C.cfg);const a1=performance.now();density(C.cfg);const a2=performance.now();
  const VIS=CL.VIS;
  if(!LAYERS.points)VIS.fill(0);
  else if(LAYERS.medium&&C.dissolve)C.dissolve();
  else VIS.fill(1);
  ctx.setTransform(1,0,0,1,0,0);drawPoints(ctx,S.d);const a3=performance.now();
  if(LAYERS.medium)C.medium(S.d);
  putPoints(ctx);glow(cv);const a4=performance.now();
  ctx.setTransform(S.d,0,0,S.d,0,0);
  if(C.post)C.post(ctx);
  if(LAYERS.trace)C.trace(ctx,S.d);
  const a5=performance.now();PH[0]+=a1-a;PH[1]+=a2-a1;PH[2]+=a3-a2;PH[3]+=a4-a3;PH[4]+=a5-a4;
  frames++;cost+=a5-a;
  syncRail();C.caption&&C.caption();
  requestAnimationFrame(frame);}
 requestAnimationFrame(frame);}
