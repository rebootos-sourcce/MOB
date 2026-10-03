/* Picture 3, layered tower. Five discs seen from a low angle, top to bottom: the sky (12 signs, 64 gates, four points),
   the roots (4), the fetters (9, a pillar each as tall as its charge), the domains (19), the addresses (108, a pillar
   each as tall as its SQ). Light runs from each sky point to its root, from a root to its fetters, and from a fetter to
   the addresses that carry it (W[i].cf). Strata, not a mechanism: each disc turns at its own rate, none drives another.
   Reads: sky longitudes, ELEM2ROOT, AFFIN, S.charge, DOMAIN, S.doms, p.aff, W[108]. */
(function(){
const U=MGU,S=U.S,D=U.D,clamp=U.clamp,lerp=U.lerp,ent=U.ent,LAND=U.LAND,OUT=U.OUT,rgba=U.rgba,TAU=U.TAU,BREATH=U.BREATH,C=U.C;
const txt0=U.txt;let GATE=1;const txt=function(){if(GATE>.85)txt0.apply(null,arguments);};
const PI=Math.PI,D2R=PI/180;
const RATE={sky:2.4,asm:-3.2,dom:1.52,adr:-.27},FOL={asm:-.75,dom:.35,adr:-.15};
S.x={d:0,dv:0,drag:null,f:{asm:[0,0],dom:[0,0],adr:[0,0]}};
const GROUPS=[];{let i0=0;U.ROOTS.forEach(rn=>{const n=D.affin[rn].length;GROUPS.push({rn:rn,i0:i0,n:n});i0+=n;});}
const SHORT=['12 signs','4 roots','9 fetters','19 domains','108'];
const LAYERS=[['Sky','12 signs, 64 gates'],['Roots','4, with the fetters'],['Fetters','9 emotions'],['Domains','19 blueprint domains'],['Addresses','108 on the wheel']];
function geo(w,h){const res=44,sm=w<420,K=sm?.27:.25;
 const Rb=Math.min(w*(sm?.36:.27),(h-res)*.42),cx=w/2+(sm?34:70);
 const top=Rb*K+(sm?44:42),bot=Rb*.84*K+(sm?36:14),dy=(h-res-top-bot)/4;
 return {sm:sm,dy:dy,K:K,Rb:Rb,cx:cx,y:i=>top+i*dy,R:[Rb,Rb*.58,Rb*.86,Rb*.98,Rb*.84]};}
function spin(t){return U.REDUCED?0:t-.35*(1-Math.exp(-t/.35));}
function angs(t,S){const x=S.x,sp=spin(t),sunLon=S.p.sky?S.p.sky.sun:0,sunRoot=S.sky.length?S.sky[0].root:'Architect';
 const G=GROUPS.find(g=>g.rn===sunRoot),a0=PI/2-(G.i0+G.n/2)*40*D2R;
 return {sky:PI/2-sunLon*D2R+RATE.sky*D2R*sp+x.d,asm:a0+RATE.asm*D2R*sp+x.f.asm[0],dom:PI/2+RATE.dom*D2R*sp+x.f.dom[0],adr:PI/2+RATE.adr*D2R*sp+x.f.adr[0]};}
/* a point on disc i at radius r and angle a: x, y, and how far to the front it sits (0 back, 1 front) */
function P(G,i,r,a){return [G.cx+Math.cos(a)*r,G.y(i)+Math.sin(a)*r*G.K,(Math.sin(a)+1)/2];}
function arcPath(ctx,G,i,r,a0,a1){const n=Math.max(4,Math.ceil(Math.abs(a1-a0)/.08));ctx.beginPath();
 for(let k=0;k<=n;k++){const q=P(G,i,r,lerp(a0,a1,k/n));k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}}
function glyph(ctx,k,x,y,r,col,al){ctx.strokeStyle=rgba(col,al);ctx.lineWidth=1.3;ctx.beginPath();
 if(k==='Moon'){ctx.arc(x,y,r,-1.2,1.2);ctx.stroke();ctx.beginPath();ctx.arc(x+r*.55,y,r*.8,1.2,TAU-1.2,true);ctx.stroke();return;}
 ctx.arc(x,y,r,0,TAU);ctx.stroke();
 if(k==='Sun'){ctx.beginPath();ctx.arc(x,y,r*.28,0,TAU);ctx.stroke();}
 if(k==='Rising'){ctx.beginPath();ctx.moveTo(x-r*1.5,y);ctx.lineTo(x+r*1.5,y);ctx.stroke();}
 if(k==='Design Sun'){ctx.setLineDash([2,2]);ctx.beginPath();ctx.arc(x,y,r*.55,0,TAU);ctx.stroke();ctx.setLineDash([]);}}
function draw(ctx,w,h,t,S,v){
 const G=geo(w,h),A=angs(t,S),p=S.p,sm=G.sm,breath=Math.sin(TAU*t/BREATH),H=G.dy*.62;
 const eL=i=>ent(t,.04+i*.09,.55,LAND),dpt=q=>.5+.5*q[2];
 /* the stage: faint ellipses and the axis the five turn on */
 ctx.strokeStyle='rgba(255,255,255,.1)';ctx.lineWidth=1;ctx.setLineDash([2,6]);ctx.beginPath();ctx.moveTo(G.cx,G.y(0)-12);ctx.lineTo(G.cx,G.y(4)+12);ctx.stroke();
 for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(G.cx,G.y(i),G.R[i],G.R[i]*G.K,0,0,TAU);ctx.stroke();}ctx.setLineDash([]);
 /* positions we need in more than one place */
 const rootAt={},fetAt=[],eB=ent(t,.6,.5);
 GROUPS.forEach(g=>{rootAt[g.rn]=A.asm+(g.i0+g.n/2)*40*D2R;});
 U.FGROUP.forEach((f,i)=>{fetAt[i]=A.asm+(i+.5)*40*D2R;});
 /* addresses by fetter, for the fan from a fetter to the addresses it carries */
 const adr=[];p.addr.forEach(a=>{const rw=U.FNAME.indexOf(a.cf);if(rw<0)return;adr.push({a:a,rw:rw,ang:A.adr+(a.s+.5)*TAU/108});});
 /* ---- the fan from fetters to addresses: behind everything ---- */
 U.FGROUP.forEach((f,i)=>{if(S.CH[f.rw]<.03)return;const q0=P(G,2,G.R[2]*eL(2),fetAt[i]);
  adr.forEach(ad=>{if(ad.rw!==f.rw)return;const q1=P(G,4,G.R[4]*eL(4),ad.ang);
   ctx.strokeStyle=rgba(U.FCOL[f.rw],(.05+.1*Math.min(1,ad.a.sq/6))*eB);ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q1[0],q1[1]);ctx.stroke();});});
 /* ---- 4 the addresses: a pillar each ---- */
 GATE=eL(4);
 {const e=eL(4),r=G.R[4]*e;ctx.strokeStyle=rgba('#FFFFFF',.14);ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(G.cx,G.y(4),r,r*G.K,0,0,TAU);ctx.stroke();
  adr.slice().sort((a,b)=>Math.sin(a.ang)-Math.sin(b.ang)).forEach(ad=>{const q=P(G,4,r,ad.ang),L=Math.min(1,ad.a.sq/10)*H*.9*e+1.5;
   ctx.strokeStyle=rgba(U.FCOL[ad.rw],(ad.a.sq>.02?.95:.3)*(.4+.6*dpt(q)));ctx.lineWidth=sm?1.4:1.9;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0],q[1]-L);ctx.stroke();});}
 /* ---- 3 the domains ---- */
 GATE=eL(3);
 {const e=eL(3),r=G.R[3]*e;
  for(let c=0;c<19;c++){const a=A.dom+c*TAU/19,on=p.doms.indexOf(c)>=0,col=U.DCOL[c],q=P(G,3,r,a+TAU/38);
   ctx.strokeStyle=rgba(col,(on?1:.5+.3*S.DOM[c])*(.45+.55*dpt(q)));ctx.lineWidth=(on?5:3.5)*(sm?.8:1);ctx.lineCap='butt';arcPath(ctx,G,3,r,a+.02,a+TAU/19-.02);ctx.stroke();
   const L=S.DOM[c]*H*.7*e;ctx.strokeStyle=rgba(col,.55*(.45+.55*dpt(q)));ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(q[0],q[1]-4);ctx.lineTo(q[0],q[1]-4-L);ctx.stroke();
   if(on&&!sm&&q[2]>.35)txt(ctx,U.DOMAINS[c].nm,q[0],q[1]-4-L-9,10.5,U.mix(col,'#EFEDE8',.45),'center',500);}}
 /* ---- the threads from a root down to its fetters ---- */
 GATE=1;
 U.FGROUP.forEach((f,i)=>{const inUse=p.aff.indexOf(f.root)>=0,q0=P(G,1,G.R[1]*eL(1),rootAt[f.root]),q1=P(G,2,G.R[2]*eL(2),fetAt[i]);
  ctx.strokeStyle=rgba(U.ROOTC[f.root],(inUse?.65:.2)*eB);ctx.lineWidth=inUse?1.2+S.CH[f.rw]*1.6:.9;ctx.beginPath();ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q1[0],q1[1]);ctx.stroke();
  if(inUse){const u=((t/BREATH+i*.13)%1+1)%1;for(let z=0;z<4;z++){const uu=Math.max(0,u-z*.04);ctx.fillStyle='rgba(239,237,232,'+(.85*(1-z/4)*eB).toFixed(3)+')';
   ctx.beginPath();ctx.arc(lerp(q0[0],q1[0],uu),lerp(q0[1],q1[1],uu),(sm?1.3:1.9)*(1-z/6),0,TAU);ctx.fill();}}});
 /* ---- 2 the fetters: a pillar each as tall as its charge ---- */
 GATE=eL(2);
 {const e=eL(2),r=G.R[2]*e;ctx.strokeStyle=rgba('#FFFFFF',.1);ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(G.cx,G.y(2),r,r*G.K,0,0,TAU);ctx.stroke();
  const order=U.FGROUP.map((f,i)=>i).sort((a,b)=>Math.sin(fetAt[a])-Math.sin(fetAt[b]));
  order.forEach(i=>{const f=U.FGROUP[i],a=fetAt[i],col=U.FCOL[f.rw],q=P(G,2,r,a),ch=S.CH[f.rw],en=ent(t,.3+i*.06,.45,LAND),dp=.45+.55*dpt(q);
   ctx.strokeStyle=rgba(col,.35*dp);ctx.lineWidth=sm?5:8;ctx.lineCap='butt';arcPath(ctx,G,2,r,a-19*D2R,a+19*D2R);ctx.stroke();
   const L=ch*H*1.15*en;ctx.strokeStyle=rgba(col,.95*dp);ctx.lineWidth=sm?5:8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0],q[1]-Math.max(.5,L));ctx.stroke();
   if(L>2){ctx.strokeStyle=rgba('#EFEDE8',.5*dp);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(q[0]-2,q[1]-L+2);ctx.lineTo(q[0]-2,q[1]-L*.55);ctx.stroke();}
   if(!sm&&q[2]>.3){const cv=p.charge[f.nm]||0;txt(ctx,f.nm+' '+(cv>0?cv.toFixed(1):'-'),q[0],q[1]-L-12,10.5,cv>0?C.ink:C.dim,'center',500);}});}
 /* ---- 1 the roots ---- */
 GATE=eL(1);
 {const e=eL(1),r=G.R[1]*e;
  GROUPS.forEach(g=>{const inUse=p.aff.indexOf(g.rn)>=0,col=U.ROOTC[g.rn],a0=A.asm+g.i0*40*D2R,a1=A.asm+(g.i0+g.n)*40*D2R,q=P(G,1,r,rootAt[g.rn]);
   ctx.strokeStyle=rgba(col,(inUse?.95:.5)*(.45+.55*dpt(q)));ctx.lineWidth=sm?4:6;ctx.lineCap='butt';arcPath(ctx,G,1,r,a0+.03,a1-.03);ctx.stroke();
   if(!sm&&q[2]>.3)txt(ctx,g.rn,q[0],q[1]+16,10.5,U.mix(col,'#EFEDE8',.4),'center',500);});}
 /* ---- the threads from the sky down to the roots ---- */
 GATE=1;
 S.sky.forEach((s,i)=>{const am=A.sky+s.lon*D2R,inUse=p.aff.indexOf(s.root)>=0,q0=P(G,0,G.R[0]*eL(0),am),q1=P(G,1,G.R[1]*eL(1),rootAt[s.root]);
  ctx.setLineDash(inUse?[]:[4,4]);ctx.strokeStyle=rgba(U.ROOTC[s.root],(inUse?.85:.55)*eB);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q1[0],q1[1]);ctx.stroke();ctx.setLineDash([]);
  const u=((t/BREATH+i*.21)%1+1)%1;for(let z=0;z<5;z++){const uu=Math.max(0,u-z*.04);ctx.fillStyle='rgba(239,237,232,'+(.85*(1-z/5)*(inUse?1:.5)*eB).toFixed(3)+')';
   ctx.beginPath();ctx.arc(lerp(q0[0],q1[0],uu),lerp(q0[1],q1[1],uu),(sm?1.4:2)*(1-z/7),0,TAU);ctx.fill();}});
 /* ---- 0 the sky ---- */
 GATE=eL(0);
 {const e=eL(0),r=G.R[0]*e,bw=sm?7:11;
  for(let k=0;k<12;k++){const z=D.zsign[D.zi[k]],a=A.sky+k*30*D2R,rc=U.ROOTC[D.elem2root[z.el]],q=P(G,0,r,a+15*D2R),dp=.4+.6*dpt(q);
   ctx.strokeStyle=rgba(rc,.34*dp+.06);ctx.lineWidth=bw;ctx.lineCap='butt';arcPath(ctx,G,0,r,a+.012,a+30*D2R-.012);ctx.stroke();
   if(!sm&&q[2]>.4){const q2=P(G,0,r+16,a+15*D2R);txt(ctx,z.nm,q2[0],q2[1],10.5,U.mix(rc,'#EFEDE8',.5),'center',500);}}
  const hd=p.sky&&p.sky.sp?p.sky.sp.hd:null,lit={};if(hd&&hd.p)lit[hd.p.gate]=1;if(hd&&hd.d)lit[hd.d.gate]=1;
  for(let k=0;k<64;k++){const on=lit[D.gateWheel[k]];if(!on)continue;const a=A.sky+(k+.5)*5.625*D2R,q0=P(G,0,r-bw*.6,a),q1=P(G,0,r-bw*.6-8,a);
   ctx.strokeStyle=rgba(C.gold,.95);ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q1[0],q1[1]);ctx.stroke();}
  /* aspect chords across the disc */
  S.asp.forEach(sp=>{const qa=P(G,0,r,A.sky+sp.a.lon*D2R),qb=P(G,0,r,A.sky+sp.b.lon*D2R),hard=sp.name==='square'||sp.name==='opposition';
   ctx.strokeStyle=hard?'rgba(216,146,78,.7)':'rgba(126,184,212,.7)';ctx.lineWidth=1.3;ctx.setLineDash(hard?[5,4]:[]);ctx.beginPath();ctx.moveTo(qa[0],qa[1]);ctx.lineTo(qb[0],qb[1]);ctx.stroke();ctx.setLineDash([]);});
  S.sky.forEach((s,i)=>{const q=P(G,0,r,A.sky+s.lon*D2R),mr=(sm?5:7.5)*ent(t,.3+i*.08,.35,LAND);
   ctx.fillStyle='rgba(9,10,14,.9)';ctx.beginPath();ctx.arc(q[0],q[1],mr+1.5,0,TAU);ctx.fill();glyph(ctx,s.k,q[0],q[1],Math.max(.1,mr),s.k==='Design Sun'?'#B4B0A8':U.ROOTC[s.root],1);
   if(!sm&&q[2]>.45&&s.k!=='Design Sun')txt(ctx,s.k+' '+s.nm,q[0],q[1]-17,10.5,C.mid,'center',500);});}
 GATE=1;U.skyLegend(ctx,sm?14:w-14,sm?18:18,sm?'left':'right',sm);
 /* layer names down the left, each with the count that sets its rate */
 LAYERS.forEach((l,i)=>{const y=G.y(i),e=ent(t,.1+i*.07,.35),x=sm?14:28;ctx.globalAlpha=e;
  if(sm){txt(ctx,l[0],x,y-G.dy*.4,11,C.ink,'left',600);txt(ctx,SHORT[i],x,y-G.dy*.4+12,9.5,C.dim,'left');}
  else{ctx.strokeStyle='rgba(239,237,232,.22)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x-4+10,y);ctx.stroke();
   txt(ctx,l[0],x+12,y-8,13,C.ink,'left',600);txt(ctx,l[1],x+12,y+8,10.5,C.dim,'left');}ctx.globalAlpha=1;});
}
function ringAt(G,y){let best=0,bd=1e9;for(let i=0;i<5;i++){const d=Math.abs(y-G.y(i));if(d<bd){bd=d;best=i;}}return best;}
function pointer(x,y,v,S){const G=geo(v.w,v.h),X=S.x;
 if(X.drag){const a=Math.atan2((y-G.y(0))/G.K,x-G.cx);let d=a-X.drag.a0;while(d>PI)d-=TAU;while(d<-PI)d+=TAU;X.d+=d;X.drag.a0=a;X.dv=d*30;return null;}
 const i=ringAt(G,y),p=S.p;
 if(i===0&&S.sky.length)return '<b>Sky</b>: '+S.sky.map(s=>s.k+' in '+s.nm+' reads '+s.root).join('; ')+'.';
 if(i===1)return '<b>Roots</b>: the person runs '+(p.aff.length?p.aff.join(' and '):'no root yet')+'. Each root has its own fetters beneath it.';
 if(i===2){const a=Object.keys(p.charge).map(k=>[k,p.charge[k]]).filter(q=>q[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,3);return '<b>Fetters</b>: '+(a.length?'heaviest '+a.map(q=>q[0]+' '+q[1].toFixed(1)).join(', ')+'.':'none charged.');}
 if(i===3)return '<b>Domains</b>: '+(p.doms.length?p.doms.map(c=>D.domains[c].nm).join(', ')+' chosen.':'none chosen.')+' Pillar height is how far the blueprint reaches.';
 return '<b>Addresses</b>: '+p.addr.filter(a=>a.sq>.02).length+' of 108 carry charge. Pillar height is SQ.';}
function down(x,y,v,S){const G=geo(v.w,v.h);S.x.drag={a0:Math.atan2((y-G.y(0))/G.K,x-G.cx)};S.x.dv=0;}
function up(){S.x.drag=null;}
function step(dt,S){const X=S.x;if(!X.drag){X.d+=X.dv*dt;X.dv*=Math.exp(-dt/.9);if(Math.abs(X.dv)<1e-4)X.dv=0;}
 ['asm','dom','adr'].forEach(k=>{const f=X.f[k],tgt=FOL[k]*X.d,w0=4.5,z=.8;const a=w0*w0*(tgt-f[0])-2*z*w0*f[1];f[1]+=a*dt;f[0]+=f[1]*dt;});}
function idle(S){const p=S.p,n=p.addr.filter(a=>a.sq>.02).length,top=Object.keys(p.charge).map(k=>[k,p.charge[k]]).sort((a,b)=>b[1]-a[1])[0];
 return '<b>'+p.nm+'</b>: '+(top&&top[1]>0?'tallest fetter '+top[0]+' '+top[1].toFixed(1)+', ':'no fetter charged, ')+n+' of 108 addresses carry charge. Hover a layer; drag to turn the sky.';}
MGC.register({draw:draw,pointer:pointer,down:down,up:up,step:step,idle:idle,person:function(S){S.x.d=0;S.x.dv=0;Object.keys(S.x.f).forEach(k=>S.x.f[k]=[0,0]);}});
})();
