"use strict";
/* Character, round ON to OQ mockups. Three systems, one person.
   The tables below are copied out of the shipping canon (atuned_src/engine/data/canon.js)
   on the day the mockups were made: the seat palette, the nine axes with their ring icons
   and the masks a reading is taken on. Nothing here reads a profile. The two example
   profiles are toy numbers. The page is one calm human figure that every mask bends into
   its own symbol, by how heavy the load is, and every pattern bends differently. Zero load
   is the plain person. There is no ring round anything: the nine pattern colours live in
   the marks themselves. */
const PAL={Root:'#D6524C',Sacral:'#D8924E',Solar:'#DABF6A',Heart:'#5FD5A6',Throat:'#5EBBDB','3rd Eye':'#7D93E0',Crown:'#A77EDB'};
const AX=[
 {nm:'Fear',seat:'Root',ic:'M12 3l8 14H4z',loc:'lower back, gut',addr:'Lumbar plexus'},
 {nm:'Anger',seat:'Solar',ic:'M13 2L4 14h6l-1 8 9-12h-6z',loc:'upper abdomen',addr:'Celiac plexus'},
 {nm:'Shame',seat:'Sacral',ic:'M5 20V9a7 7 0 0114 0v11M9 20v-6h6v6',loc:'pelvic floor',addr:'Pudendal plexus'},
 {nm:'Disgust',seat:'Sacral',ic:'M4 8c4 4 12 4 16 0M6 16c3-3 9-3 12 0',loc:'lower abdomen, skin',addr:'Sacral and dermis'},
 {nm:'Apathy',seat:'Throat',ic:'M4 12h16M4 7h16M4 17h16',loc:'base of neck',addr:'Shoulder girdle and throat'},
 {nm:'Shock',seat:'3rd Eye',ic:'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M12 12m-4.5 0a4.5 4.5 0 109 0 4.5 4.5 0 10-9 0',loc:'forehead, skin',addr:'Prefrontal and dermis'},
 {nm:'Sad',seat:'Heart',ic:'M12 20s-8-5-8-11a4 4 0 018-2 4 4 0 018 2c0 6-8 11-8 11z',loc:'centre chest',addr:'Cardiac plexus'},
 {nm:'Surprise',seat:'Heart',ic:'M12 3v18M7 7c-3 2-3 9 0 11M17 7c3 2 3 9 0 11',loc:'upper torso',addr:'Upper chest and back'},
 {nm:'Anticipation',seat:'Solar',ic:'M12 4v11M8 11l4 4 4-4M6 20h12',loc:'lower sternum',addr:'Below the heart'}];
/* the four masks the owner named, in the canon's own order. Professional is not drawn
   (round OO withdrew it). Adult is in the canon's MASKS_READ and is left out here because
   the round OO list does not name it, which is asked at the foot of the report. */
const MASKS=[
 {nm:'Child',b:['Root','Sacral'],v:'gets small so somebody else decides',per:4.2,row:'Vitality'},
 {nm:'Preteen',b:['Solar','Throat'],v:'checks the room before it says the thing',per:3.0,row:'Awareness'},
 {nm:'Teen',b:['Throat'],v:'pushes back on the person, not the problem',per:1.8,row:'Will'},
 {nm:'Ideological',b:['3rd Eye'],v:'answers from the position instead of the moment',per:7.2,row:'Flow'}];
const PROFILES={
 anger:{key:'anger',label:'Anger leads',
  w:{Fear:2.5,Anger:7.8,Shame:5.5,Disgust:4,Apathy:5.2,Shock:1.2,Sad:1.6,Surprise:1.4,Anticipation:2.2}},
 apathy:{key:'apathy',label:'Apathy leads',
  w:{Fear:1,Anger:1.8,Shame:4.6,Disgust:1.5,Apathy:6.4,Shock:1.2,Sad:3,Surprise:.8,Anticipation:2}}};
/* what the leading pattern is doing, in a word, for the badge */
const VERB=['tightening','rising','sinking','recoiling','flat','bursting','falling','widening','leaning'];
/* invented but plausible trace lines. A story supports a pattern, it never causes it. */
const TRACES={
 anger:{
  Anger:{date:'14 Sep',q:'He rewrote my section and sent it on without asking. I said fine. Jaw tight for an hour.',prov:'inferred',rel:2,last:'22 Sep'},
  Shame:{date:'2 Sep',q:'They asked about the missed deadline. I said it was handled. It was not handled.',prov:'inferred',rel:1,last:'9 Sep'},
  Apathy:{date:'29 Aug',q:'Closed the laptop. Watched the wall for forty minutes. Shoulders did not drop.',prov:'inferred',rel:0,last:''},
  Disgust:{date:'21 Aug',q:'Smiled through the whole dinner. Felt it in the skin of my forearms.',prov:'proposed',rel:0,last:''}},
 apathy:{
  Apathy:{date:'30 Sep',q:'Sat in the car outside the house for twenty minutes. Did not go in.',prov:'inferred',rel:3,last:'27 Sep'},
  Shame:{date:'22 Sep',q:'They asked what I wanted. I said I did not mind. I did mind.',prov:'inferred',rel:1,last:'25 Sep'},
  Sad:{date:'11 Sep',q:'The song came on in the shop. Chest went flat. Paid and left.',prov:'inferred',rel:0,last:''},
  Anticipation:{date:'4 Sep',q:'Lay awake rehearsing the call. Stomach held until it was over.',prov:'proposed',rel:0,last:''}}};

/* ---------- helpers ---------- */
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,k)=>a+(b-a)*k;
const sstep=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
const hx=c=>{const n=parseInt(c.slice(1),16);return[n>>16&255,n>>8&255,n&255];};
const mixc=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
const INK=[239,237,232];
const cap1=s=>s.charAt(0).toUpperCase()+s.slice(1);
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
/* a stable hash of an integer and a salt, 0 to 1 */
function hash(i,k){let h=(i*374761393+(k||0)*668265263)|0;h=(h^(h>>>13))*1274126177|0;h^=h>>>16;return (h>>>0)/4294967296;}
function hsl2rgb(h,s,l){h=((h%360)+360)%360/360;const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;
 const f=t=>{t=(t+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p;};return[f(h+1/3)*255,f(h)*255,f(h-1/3)*255];}
function rgb2hsl(c){const r=c[0]/255,g=c[1]/255,b=c[2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0;const l=(mx+mn)/2;
 if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return[h,s,l];}
const css=(c,a)=>'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+(a===undefined?1:a)+')';
const hex=c=>'#'+c.map(v=>('0'+Math.round(v).toString(16)).slice(-2)).join('');

/* ---------- the nine pattern colours ----------
   Seven seats, nine patterns: Sacral, Solar and Heart each carry two. The seven seat colours are the
   canon's own. The second pattern in a seat takes a sibling of its seat colour, searched (src/pcol2.js)
   so that no two of the nine sit closer than 22 in CIELAB and each stays as near its seat as that
   allows: Disgust is the darker earth of Sacral, Anticipation the paler sand of Solar, Surprise the
   cooler aqua of Heart. */
const SIBLING={Disgust:'#AD613B',Anticipation:'#DAC99D',Surprise:'#74D5CB'};
const PCOL=AX.map(a=>hx(SIBLING[a.nm]||PAL[a.seat]));
/* the seats run down the body where the body map seats them, crown at the head, root at the
   pelvis. A pair of patterns in one seat takes the body's left and its right. Legs carry Root. */
const SEATY={Crown:-1.0,'3rd Eye':-.9,Throat:-.72,Heart:-.5,Solar:-.3,Sacral:-.12,Root:.06};
const PFIELD=AX.map(a=>{const pair=AX.filter(b=>b.seat===a.seat),idx=pair.indexOf(a);
 return{y:SEATY[a.seat],x:pair.length>1?(idx?.17:-.17):0,sx:pair.length>1?.26:.6,sy:.12};});
function affs(x,y){const out=PFIELD.map(f=>Math.exp(-Math.pow((x-f.x)/f.sx,2)-Math.pow((y-f.y)/f.sy,2)));
 /* below the pelvis everything is Root: the legs hold the ground */
 if(y>.06){const r=Math.min(1,(y-.06)/.2);out[0]=Math.max(out[0],r*1.1);}
 return out;}
function leadPat(w){let b=0;AX.forEach((a,i)=>{if(w[a.nm]>w[AX[b].nm])b=i;});return b;}
function maskLoad(m,w){return m.b.reduce((s,seat)=>s+AX.filter(a=>a.seat===seat).reduce((x,a)=>Math.max(x,w[a.nm]),0),0)/m.b.length;}
function leadMask(w){let b=null;MASKS.forEach(m=>{const s=maskLoad(m,w);if(!b||s>b.s+1e-9)b={m,s};});return b.m;}
function maskTop(m,w){let b=-1;AX.forEach((a,i)=>{if(m.b.indexOf(a.seat)<0)return;if(b<0||w[a.nm]>w[AX[b].nm])b=i;});return b;}
function maskCols(m){const a=m.b.map(s=>PAL[s]);return[a[0],a[a.length-1]];}

/* ---------- the person ----------
   One base figure and a pose vector. The vector is the whole feasibility story: nine
   pattern weights each push the vector along their own direction, the mask pulls it toward
   its own symbol by how loaded the mask is, and at zero load every term is zero and the
   vector is REST, a plain calm person. The cost is nine multiply-adds per pose key, then
   one forward kinematics pass of about twenty segments. */
const REST={scale:1,ox:0,oy:0,lean:.012,curl:0,shL:0,shR:0,roll:0,shW:1,headDrop:0,headTurn:0,headTilt:.02,
 a1L:.13,a2L:.09,a1R:.15,a2R:.1,b1L:.05,b2L:.03,b1R:.045,b2R:.02,legShort:0,hipSep:1,neckExt:0,rigid:0};
const KEYS=Object.keys(REST);
/* each mask's own symbol, as a pose. Child folds and shrinks, Preteen turns and checks,
   Teen thrusts, Ideological goes rigid and tall. */
const MASKPOSE={
 Child:{scale:.64,curl:.95,roll:.6,shW:.92,headDrop:.9,headTilt:.0,lean:0,a1L:.22,a2L:-2.05,a1R:.22,a2R:-2.05,b1L:.1,b2L:-.06,b1R:.1,b2R:-.06,legShort:.34,hipSep:.82},
 Preteen:{lean:.07,shL:.1,shR:-.35,headTurn:1,headTilt:.22,headDrop:.12,roll:.2,a1L:.3,a2L:.15,a1R:1,a2R:-2.5,b1L:-.03,hipSep:.95},
 Teen:{lean:-.17,shW:1.16,shL:.1,headDrop:-.55,headTilt:-.12,a1L:1.5,a2L:1.52,a1R:.75,a2R:.3,b1L:.2,b2L:.1,b1R:.14,b2R:-.08,hipSep:1.15,legShort:.08},
 Ideological:{lean:0,curl:-.4,shW:1.2,roll:-.4,shL:.25,shR:.25,headDrop:-.4,headTilt:0,neckExt:.05,a1L:.0,a2L:.0,a1R:.0,a2R:.0,b1L:0,b2L:0,b1R:0,b2R:0,hipSep:.7,rigid:1}};
/* what each pattern does to a body, as a push on the same vector */
const PATD=[
 /* Fear */ {roll:.35,shL:.5,shR:.5,headDrop:.3,scale:-.05,a1L:-.08,a1R:-.08,legShort:.05},
 /* Anger */ {shW:.16,shL:.7,shR:.7,headDrop:-.6,a1L:.25,a1R:.25,a2L:.2,a2R:.2,lean:-.03},
 /* Shame */ {curl:.4,headDrop:.8,roll:.35,shL:.2,shR:.2,scale:-.04},
 /* Disgust */ {lean:.07,headTurn:-.8,a1R:.6,a2R:-.7,headTilt:-.12},
 /* Apathy */ {curl:.2,shL:-.7,shR:-.7,headDrop:.45,headTilt:.1,a1L:-.06,a2L:-.08,a1R:-.06,a2R:-.08,legShort:.02},
 /* Shock */ {a1L:1,a1R:1,a2L:.9,a2R:.9,b1L:.1,b1R:.1,headDrop:-.5,hipSep:.15},
 /* Sad */ {headDrop:.9,curl:.3,shL:-.4,shR:-.4},
 /* Surprise */ {a1L:.6,a1R:.6,headDrop:-.7,shL:.3,shR:.3},
 /* Anticipation */ {lean:-.07,a1L:.2,a1R:.2,b1L:-.04,b1R:.07,headDrop:-.15}];
/* weights to a target pose. w is the nine weights already scaled by the load. */
function mixPose(maskNm,w,opt){opt=opt||{};
 const M=MASKS.find(x=>x.nm===maskNm);const ws=AX.map(a=>w[a.nm]);
 const mxw=Math.max.apply(null,ws),L=clamp(mxw/9,0,1);
 const m=clamp(maskLoad(M,w)/6.5,0,1);
 let ss=0;ws.forEach(v=>ss+=v*v);
 const p={};KEYS.forEach(k=>{p[k]=REST[k];});
 const T=MASKPOSE[maskNm];
 if(!opt.noMask)for(const k in T)p[k]+=m*(T[k]-REST[k]);
 if(ss>0)ws.forEach((v,i)=>{const sh=v*v/ss*L*1.7;if(sh<=0)return;const d=PATD[i];for(const k in d)p[k]+=sh*d[k];});
 return {p,m,L};}

/* the forward kinematics. figure units: y down, head top about -0.99, feet about 0.97 */
function buildFig(p){
 const sl=p.lean,u=[Math.sin(sl),-Math.cos(sl)],v=[Math.cos(sl),Math.sin(sl)];
 const P=[0,0],Ls=.64*(1-.32*p.curl);
 const nb=[P[0]+u[0]*Ls,P[1]+u[1]*Ls];
 const S0=[nb[0]-u[0]*.04,nb[1]-u[1]*.04+p.curl*.02];
 const nl=.07+p.neckExt-.04*p.curl;
 const nt=[nb[0]+u[0]*nl,nb[1]+u[1]*nl];
 const th=p.headTilt+sl;
 const Hc=[nt[0]+Math.sin(th)*.12+p.headTurn*.06,nt[1]-Math.cos(th)*.12+p.headDrop*.095];
 const hw=.205*p.shW*(1-.4*p.roll);
 const SL=[S0[0]-v[0]*hw,S0[1]-v[1]*hw-p.shL*.085],SR=[S0[0]+v[0]*hw,S0[1]+v[1]*hw-p.shR*.085];
 const arm=(S,s,a1,a2)=>{const E=[S[0]+s*Math.sin(a1)*.27,S[1]+Math.cos(a1)*.27];const W=[E[0]+s*Math.sin(a2)*.25,E[1]+Math.cos(a2)*.25];return[E,W];};
 const [EL,WL]=arm(SL,-1,p.a1L,p.a2L),[ER,WR]=arm(SR,1,p.a1R,p.a2R);
 const HL=[P[0]-v[0]*.085*p.hipSep,P[1]-v[1]*.085*p.hipSep],HR=[P[0]+v[0]*.085*p.hipSep,P[1]+v[1]*.085*p.hipSep];
 const lt=.47*(1-.35*p.legShort),ls=.45*(1-.3*p.legShort);
 const leg=(H,s,b1,b2)=>{const K=[H[0]+s*Math.sin(b1)*lt,H[1]+Math.cos(b1)*lt];const A=[K[0]+s*Math.sin(b2)*ls,K[1]+Math.cos(b2)*ls];return[K,A];};
 const [KL,AL]=leg(HL,-1,p.b1L,p.b2L),[KR,AR]=leg(HR,1,p.b1R,p.b2R);
 const mid1=[P[0]+u[0]*Ls*.5,P[1]+u[1]*Ls*.5],mid2=[P[0]+u[0]*Ls*.16,P[1]+u[1]*Ls*.16];
 const hd=a=>{const L=Math.hypot(a[0]-S0[0],a[1]-S0[1])||1;return L;};
 const C=[];
 const cap=(a,b,ra,rb,id)=>C.push({ax:a[0],ay:a[1],bx:b[0],by:b[1],ra,rb,id});
 const disc=(c,rx,ry,rot,id)=>C.push({ax:c[0],ay:c[1],bx:c[0],by:c[1],ra:rx,rb:ry,rot:rot||0,disc:1,id});
 disc(Hc,.104,.126,th,'head');
 cap(nb,nt,.044,.039,'neck');
 cap(S0,mid1,.205*Math.min(1.1,p.shW)*(1-.1*p.roll),.165,'chest');
 cap(mid1,mid2,.165,.146,'belly');
 cap(mid2,P,.146,.158,'pelvis');
 cap(S0,SL,.075,.058,'shL');cap(S0,SR,.075,.058,'shR');
 cap(SL,EL,.056,.047,'uaL');cap(EL,WL,.047,.036,'faL');
 cap(SR,ER,.056,.047,'uaR');cap(ER,WR,.047,.036,'faR');
 const hl=[WL[0]+(WL[0]-EL[0])*.16,WL[1]+(WL[1]-EL[1])*.16],hr=[WR[0]+(WR[0]-ER[0])*.16,WR[1]+(WR[1]-ER[1])*.16];
 disc(hl,.038,.044,0,'hL');disc(hr,.038,.044,0,'hR');
 cap(HL,KL,.094,.066,'thL');cap(KL,AL,.064,.042,'shnL');
 cap(HR,KR,.094,.066,'thR');cap(KR,AR,.064,.042,'shnR');
 cap([AL[0]-.03,AL[1]+.018],[AL[0]-.07,AL[1]+.018],.03,.03,'ftL');cap([AR[0]+.03,AR[1]+.018],[AR[0]+.07,AR[1]+.018],.03,.03,'ftR');
 /* ground the figure, scale it about the feet, move it */
 const gy=.955-Math.max(AL[1],AR[1])-.02;
 const Qx=0,Qy=.955,s=p.scale;
 C.forEach(c=>{c.ax=Qx+(c.ax-Qx)*s+p.ox;c.ay=Qy+(c.ay+gy-Qy)*s+p.oy;c.bx=Qx+(c.bx-Qx)*s+p.ox;c.by=Qy+(c.by+gy-Qy)*s+p.oy;
  c.ra*=s;c.rb*=s;});
 const J=n=>[Qx+(n[0]-Qx)*s+p.ox,Qy+(n[1]+gy-Qy)*s+p.oy];
 return {caps:C,J:{head:J(Hc),SL:J(SL),SR:J(SR),EL:J(EL),ER:J(ER),WL:J(WL),WR:J(WR),P:J(P),S0:J(S0),KL:J(KL),KR:J(KR),AL:J(AL),AR:J(AR)},scale:s};}

/* signed distance to a capsule or disc, negative inside */
function capD(c,x,y){
 if(c.disc){const ca=Math.cos(c.rot),sa=Math.sin(c.rot),dx=x-c.ax,dy=y-c.ay;
  const lx=(dx*ca+dy*sa)/c.ra,ly=(-dx*sa+dy*ca)/c.rb;return (Math.hypot(lx,ly)-1)*Math.min(c.ra,c.rb);}
 const bx=c.bx-c.ax,by=c.by-c.ay,l2=bx*bx+by*by;let t=l2?((x-c.ax)*bx+(y-c.ay)*by)/l2:0;t=t<0?0:t>1?1:t;
 const px=c.ax+bx*t-x,py=c.ay+by*t-y;return Math.sqrt(px*px+py*py)-(c.ra+(c.rb-c.ra)*t);}
/* the smooth union of the whole figure. a box round each part is made once per figure, so a point
   far from any part costs a handful of comparisons and not twenty distance tests */
function figBoxes(F){if(F.bb)return F.bb;const pad=.05;let X0=9,X1=-9,Y0=9,Y1=-9;
 F.bb=F.caps.map(c=>{const r=Math.max(c.ra,c.rb)+pad,rr=c.disc?Math.max(c.ra,c.rb)+pad:r;
  const b=[Math.min(c.ax,c.bx)-rr,Math.max(c.ax,c.bx)+rr,Math.min(c.ay,c.by)-rr,Math.max(c.ay,c.by)+rr];
  X0=Math.min(X0,b[0]);X1=Math.max(X1,b[1]);Y0=Math.min(Y0,b[2]);Y1=Math.max(Y1,b[3]);return b;});
 F.box=[X0,X1,Y0,Y1];return F.bb;}
function figD(F,x,y,k){k=k||.035;const bb=figBoxes(F),B=F.box;if(x<B[0]-.06||x>B[1]+.06||y<B[2]-.06||y>B[3]+.06)return .3;
 let d=9;const C=F.caps;
 for(let i=0;i<C.length;i++){const b=bb[i];if(x<b[0]||x>b[1]||y<b[2]||y>b[3])continue;
  const e=capD(C[i],x,y);const h=Math.max(k-Math.abs(d-e),0)/k;d=Math.min(d,e)-h*h*k*.25;}
 return d>8?.3:d;}

/* distance fields, and the pattern shares the symbols bend by */
function sdEll(x,y,cx,cy,rx,ry){const dx=(x-cx)/rx,dy=(y-cy)/ry;return (Math.hypot(dx,dy)-1)*Math.min(rx,ry);}
function sdBox(x,y,cx,cy,hx,hy){const dx=Math.abs(x-cx)-hx,dy=Math.abs(y-cy)-hy;return Math.min(Math.max(dx,dy),0)+Math.hypot(Math.max(dx,0),Math.max(dy,0));}
function sdStar(x,y,cx,cy,n,ro,ri,rot){const dx=x-cx,dy=y-cy,r=Math.hypot(dx,dy),a=Math.atan2(dy,dx)-rot;const u=((a*n/(2*Math.PI))%1+1)%1;
 const tri=1-Math.abs(u*2-1);const R=ri+(ro-ri)*Math.pow(tri,1.15);return (r-R)*.62;}
/* a pattern share, from the eased charges: how much of the push each pattern owns */
function shares(sc){let s=0;const q=sc.pc.map(v=>{const w=v*v;s+=w;return w;});return q.map(v=>s?v/s:0);}
