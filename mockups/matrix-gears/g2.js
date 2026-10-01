/* Picture 2, nested rings. Outside in: the sky (12 signs, 64 gates, four points at their longitudes), the roots
   (4) riding the fetters (9) as one rigid piece, the domains (19), the 108 addresses, and CQ at the centre.
   Rates follow the counts, w proportional to 1/N with the sign alternating, the way a gear train would run.
   Reads: sky longitudes (astro.js), ELEM2ROOT, AFFIN, S.charge, DOMAIN, S.doms, p.aff, W[108], CQ.
   The lag when the outer ring is dragged is animation: a spring on each inner ring, not a claim. */
(function(){
const U=MGU,S=U.S,D=U.D,clamp=U.clamp,lerp=U.lerp,ent=U.ent,LAND=U.LAND,OUT=U.OUT,rgba=U.rgba,TAU=U.TAU,BREATH=U.BREATH,C=U.C;
const txt0=U.txt;let GATE=1;const txt=function(){if(GATE>.85)txt0.apply(null,arguments);};
const PI=Math.PI,D2R=PI/180;
const RATE={sky:2.4,asm:-3.2,dom:1.52,adr:-.27};   /* degrees a second: 2.4 * 12/N, alternating */
S.x={d:0,dv:0,drag:null,f:{asm:[0,0],dom:[0,0],adr:[0,0]}};
const FOL={asm:-.75,dom:.35,adr:-.15};
/* the root groups in fetter order, with where each starts in teeth */
const GROUPS=[];{let i0=0;U.ROOTS.forEach(rn=>{const n=D.affin[rn].length;GROUPS.push({rn:rn,i0:i0,n:n});i0+=n;});}
function geo(w,h){const res=44,Rm=Math.min(w/2,(h-res)/2)-(w<420?16:50);return {cx:w/2+(w>900?80:0),cy:(h-res)/2,Rm:Rm,small:w<420};}
function spin(t){return U.REDUCED?0:t-.35*(1-Math.exp(-t/.35));}
function angs(t,S){const x=S.x,sp=spin(t),sunLon=S.p.sky?S.p.sky.sun:0,sunRoot=S.sky.length?S.sky[0].root:'Architect';
 const G=GROUPS.find(g=>g.rn===sunRoot),a0=-PI/2-(G.i0+G.n/2)*40*D2R;
 return {sky:-PI/2-sunLon*D2R+RATE.sky*D2R*sp+x.d,
  asm:a0+RATE.asm*D2R*sp+x.f.asm[0],dom:-PI/2+RATE.dom*D2R*sp+x.f.dom[0],adr:-PI/2+RATE.adr*D2R*sp+x.f.adr[0]};}
const pt=(g,r,a)=>[g.cx+Math.cos(a)*r,g.cy+Math.sin(a)*r];
function glyph(ctx,k,x,y,r,col,al){ctx.strokeStyle=rgba(col,al);ctx.lineWidth=1.3;ctx.beginPath();
 if(k==='Moon'){ctx.arc(x,y,r,-1.2,1.2);ctx.stroke();ctx.beginPath();ctx.arc(x+r*.55,y,r*.8,1.2,TAU-1.2,true);ctx.stroke();return;}
 ctx.arc(x,y,r,0,TAU);ctx.stroke();
 if(k==='Sun'){ctx.beginPath();ctx.arc(x,y,r*.28,0,TAU);ctx.stroke();}
 if(k==='Rising'){ctx.beginPath();ctx.moveTo(x-r*1.5,y);ctx.lineTo(x+r*1.5,y);ctx.stroke();}
 if(k==='Design Sun'){ctx.setLineDash([2,2]);ctx.beginPath();ctx.arc(x,y,r*.55,0,TAU);ctx.stroke();ctx.setLineDash([]);}}
function arc(ctx,g,r,a0,a1){ctx.beginPath();ctx.arc(g.cx,g.cy,Math.max(.1,r),a0,a1);}
function draw(ctx,w,h,t,S,v){
 const g=geo(w,h),Rm=g.Rm,sm=g.small,A=angs(t,S),p=S.p,breath=Math.sin(TAU*t/BREATH);
 const eR=i=>ent(t,.04+i*.09,.55,LAND),sc=i=>lerp(.55,1,eR(i)),al=i=>Math.min(1,eR(i)*1.6);
 /* ring guides: the geometry stands before the data arrives */
 [.935,.74,.6,.4,.27,.17].forEach(f=>{ctx.strokeStyle='rgba(255,255,255,.1)';ctx.lineWidth=1;ctx.setLineDash([2,6]);arc(ctx,g,Rm*f,0,TAU);ctx.stroke();ctx.setLineDash([]);});
 /* ---- 0 sky ---- */
 GATE=eR(0);const S0=sc(0),a0=al(0),bandR=Rm*S0*.935,bw=Rm*.12*S0;
 ctx.globalAlpha=a0;
 for(let k=0;k<12;k++){const z=D.zsign[D.zi[k]],a=A.sky+k*30*D2R,rc=U.ROOTC[D.elem2root[z.el]];
  ctx.strokeStyle=rgba(rc,.22);ctx.lineWidth=bw;ctx.lineCap='butt';arc(ctx,g,bandR,a+.012,a+30*D2R-.012);ctx.stroke();
  if(!sm){const q=pt(g,Rm*S0+16,a+15*D2R);txt(ctx,z.nm,q[0],q[1],10.5,U.mix(rc,'#EFEDE8',.5),'center',500);}}
 const hd=p.sky&&p.sky.sp?p.sky.sp.hd:null,lit={};if(hd&&hd.p)lit[hd.p.gate]=1;if(hd&&hd.d)lit[hd.d.gate]=1;
 for(let k=0;k<64;k++){const a=A.sky+(k+.5)*5.625*D2R,on=lit[D.gateWheel[k]],r0=Rm*S0*.87,p0=pt(g,r0,a),p1=pt(g,r0-(on?.028:.014)*Rm,a);
  ctx.strokeStyle=on?rgba(C.gold,.95):'rgba(126,184,212,.3)';ctx.lineWidth=on?1.8:1;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.stroke();}
 ctx.globalAlpha=1;
 /* aspect chords inside the sky ring: real angles between the sky points */
 S.asp.forEach(sp=>{const pa=pt(g,Rm*S0*.855,A.sky+sp.a.lon*D2R),pb=pt(g,Rm*S0*.855,A.sky+sp.b.lon*D2R),hard=sp.name==='square'||sp.name==='opposition';
  ctx.strokeStyle=hard?'rgba(216,146,78,.7)':'rgba(126,184,212,.7)';ctx.lineWidth=1.3;ctx.setLineDash(hard?[5,4]:[]);ctx.beginPath();ctx.moveTo(pa[0],pa[1]);ctx.lineTo(pb[0],pb[1]);ctx.stroke();ctx.setLineDash([]);});
 /* ---- 1 the roots and the fetters, one piece ---- */
 GATE=eR(1);
 const S1=sc(1),a1=al(1),rootR=Rm*S1*.74,fetR=Rm*S1*.6;
 const rc={};
 GROUPS.forEach(G=>{const aa=A.asm+G.i0*40*D2R,ab=A.asm+(G.i0+G.n)*40*D2R,inUse=p.aff.indexOf(G.rn)>=0,col=U.ROOTC[G.rn];
  rc[G.rn]=A.asm+(G.i0+G.n/2)*40*D2R;
  ctx.globalAlpha=a1;ctx.strokeStyle=rgba(col,inUse?.95:.5);ctx.lineWidth=Math.max(2,Rm*.03*S1);ctx.lineCap='butt';arc(ctx,g,rootR,aa+.02,ab-.02);ctx.stroke();
  if(!sm){const q=pt(g,rootR+Rm*.055,rc[G.rn]);txt(ctx,G.rn,q[0],q[1],10.5,U.mix(col,'#EFEDE8',.4),'center',500);}ctx.globalAlpha=1;});
 U.FGROUP.forEach((f,i)=>{const a=A.asm+(i+.5)*40*D2R,ch=S.CH[f.rw],col=U.FCOL[f.rw],inUse=p.aff.indexOf(f.root)>=0,en=ent(t,.3+i*.06,.45,LAND);
  ctx.globalAlpha=a1;ctx.strokeStyle=rgba('#FFFFFF',.07);ctx.lineWidth=Rm*.1*S1;arc(ctx,g,fetR,a-19*D2R,a+19*D2R);ctx.stroke();
  const th=(2+ch*Rm*.1*S1*.95)*en;ctx.strokeStyle=rgba(col,.92);ctx.lineWidth=Math.max(1,th);ctx.lineCap='butt';arc(ctx,g,fetR,a-19*D2R,a+19*D2R);ctx.stroke();
  /* the tie from a root to each of its fetters */
  const p0=pt(g,rootR-Rm*.018,a),p1=pt(g,fetR+Rm*.055*S1,a);ctx.strokeStyle=rgba(U.ROOTC[f.root],inUse?.7:.22);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.stroke();
  ctx.globalAlpha=1;
  if(!sm){const q=pt(g,fetR-Rm*.095*S1,a),cv=p.charge[f.nm]||0;txt(ctx,f.nm,q[0],q[1]-6,10.5,cv>0?C.ink:C.dim,'center',500);txt(ctx,cv>0?cv.toFixed(1):'-',q[0],q[1]+7,10,cv>0?U.mix(col,'#EFEDE8',.35):C.dim,'center',500);}});
 /* ---- 2 the domains ---- */
 GATE=eR(2);
 const S2=sc(2),a2=al(2),domR=Rm*S2*.4,dc=[];
 for(let c=0;c<19;c++){const a=A.dom+c*TAU/19,on=p.doms.indexOf(c)>=0,col=U.DCOL[c];dc[c]=a+TAU/38;
  ctx.globalAlpha=a2;ctx.strokeStyle=rgba(col,on?1:.5+.3*S.DOM[c]);ctx.lineWidth=(2+S.DOM[c]*Rm*.07)*S2*(on?1.15:1);ctx.lineCap='butt';arc(ctx,g,domR,a+.02,a+TAU/19-.02);ctx.stroke();ctx.globalAlpha=1;}
 /* the chosen domain ties to its root: the one link the person made themselves */
 p.doms.forEach(c=>{const rn=U.DROOT[c],pa=pt(g,domR+Rm*.045,dc[c]),pb=pt(g,fetR-Rm*.13,rc[rn]);
  ctx.setLineDash([3,4]);ctx.strokeStyle=rgba(U.DCOL[c],.65);ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(pa[0],pa[1]);
  const m1=pt(g,Rm*.47,dc[c]),m2=pt(g,Rm*.47,rc[rn]);ctx.bezierCurveTo(m1[0],m1[1],m2[0],m2[1],pb[0],pb[1]);ctx.stroke();ctx.setLineDash([]);
  if(!sm){const q=pt(g,domR-Rm*.06,dc[c]);txt(ctx,U.DOMAINS[c].nm,q[0],q[1],10,U.mix(U.DCOL[c],'#EFEDE8',.4),'center',500);}});
 /* ---- 3 the addresses ---- */
 GATE=1;
 const S3=sc(3),a3=al(3);
 for(let i=0;i<p.addr.length;i++){const a=p.addr[i],rw=U.FNAME.indexOf(a.cf);if(rw<0)continue;const ang=A.adr+(a.s+.5)*TAU/108,r0=Rm*S3*.27,L=Rm*S3*(.012+Math.min(1,a.sq/10)*.05),p0=pt(g,r0,ang),p1=pt(g,r0+L,ang);
  ctx.globalAlpha=a3;ctx.strokeStyle=rgba(U.FCOL[rw],a.sq>.02?.9:.22);ctx.lineWidth=sm?1:1.3;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.stroke();ctx.globalAlpha=1;}
 /* ---- the threads from the sky down to the roots: they hug the gap between the rings, so a thread never cuts
    across the fetters ---- */
 const eB=ent(t,.6,.5);
 S.sky.forEach((s,i)=>{const am=A.sky+s.lon*D2R,tgt=rc[s.root],inUse=p.aff.indexOf(s.root)>=0;
  const G=GROUPS.find(q=>q.rn===s.root),half=G.n*20*D2R;let df=((tgt-am+PI)%TAU+TAU)%TAU-PI;const aligned=Math.abs(df)<half;
  const rg=Rm*(.825-.012*i),pts=[],N=72;
  for(let k=0;k<=N;k++){const u=k/N;let r,a;
   if(u<.18){const q=u/.18;r=lerp(Rm*S0*.935,rg,OUT(q));a=am;}
   else if(u<.84){const q=(u-.18)/.66;r=rg;a=am+df*(q*q*(3-2*q));}
   else{const q=(u-.84)/.16;r=lerp(rg,rootR+Rm*.02,OUT(q));a=am+df;}
   pts.push(pt(g,r,a));}
  ctx.setLineDash(inUse?[]:[4,4]);ctx.strokeStyle=rgba(U.ROOTC[s.root],(inUse?.85:.55)*eB+(aligned?.12:0));ctx.lineWidth=aligned?1.9:1.4;ctx.lineJoin='round';
  ctx.beginPath();pts.forEach((q,k)=>k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.setLineDash([]);
  /* a bead runs down the thread at the Field's rate */
  const u=((t/BREATH+i*.21)%1+1)%1;for(let z=0;z<5;z++){const k=Math.max(0,Math.floor((u-z*.025)*N)),q=pts[k];
   ctx.fillStyle='rgba(239,237,232,'+(.85*(1-z/5)*(inUse?1:.5)*eB).toFixed(3)+')';ctx.beginPath();ctx.arc(q[0],q[1],(sm?1.4:2)*(1-z/7),0,TAU);ctx.fill();}
  /* alignment: the geometry of the lens, not a stronger claim. a soft ring on the root while the point sits over it */
  if(aligned&&!U.REDUCED){ctx.strokeStyle=rgba(U.ROOTC[s.root],.18+.12*breath);ctx.lineWidth=Rm*.045;arc(ctx,g,rootR,tgt-half,tgt+half);ctx.stroke();}
  const P0=pts[0],mr=clamp(Rm*.03,4.5,9)*ent(t,.3+i*.08,.35,LAND);
  ctx.fillStyle='rgba(9,10,14,.9)';ctx.beginPath();ctx.arc(P0[0],P0[1],mr+1.5,0,TAU);ctx.fill();glyph(ctx,s.k,P0[0],P0[1],Math.max(.1,mr),s.k==='Design Sun'?'#B4B0A8':U.ROOTC[s.root],1);});
 /* the key, where the page has the room: what each ring is, its count, and the rate its count gives it */
 if(!sm&&w>900){const rows=[['Sky','12 signs, 64 gates',RATE.sky],['Roots','4, rigid with the fetters',0],['Fetters','9 emotions',RATE.asm],['Domains','19 blueprint domains',RATE.dom],['Addresses','108 on the wheel',RATE.adr]];
  rows.forEach((r,i)=>{const y=62+i*44,e=ent(t,.1+i*.07,.35);ctx.globalAlpha=e;
   ctx.strokeStyle=rgba('#EFEDE8',.5);ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(34,y,8-i*1.2,0,TAU);ctx.stroke();
   txt(ctx,r[0],54,y-7,12.5,C.ink,'left',600);txt(ctx,r[1]+(r[2]?', '+(r[2]>0?'turns ':'counter ')+Math.abs(r[2]).toFixed(2)+' deg/s':''),54,y+8,10.5,C.dim,'left');ctx.globalAlpha=1;});
  txt(ctx,'Rate is 2.4 times 12 over the count, alternating direction.',20,62+5*44-8,10,C.dim,'left');}
 U.skyLegend(ctx,sm?14:w-14,sm?18:18,sm?'left':'right',sm);
 /* ---- the centre ---- */
 const Rc=Rm*.12,ec=ent(t,.3,.5,LAND);
 U.ringArc(ctx,g.cx,g.cy,Rc,p.cq/100*ec,C.acc,sm?2:3);
 if(Rc>20)U.ringArc(ctx,g.cx,g.cy,Rc-(sm?5:7),p.dq/100*ec,'#D6524C',sm?1.4:2);
 txt(ctx,String(Math.round(p.cq)),g.cx,g.cy-1,sm?13:19,C.ink,'center',500);if(!sm)txt(ctx,'CQ',g.cx,g.cy+13,9.5,C.dim,'center');
}
function ringAt(Gm,x,y){const d=Math.hypot(x-Gm.cx,y-Gm.cy)/Gm.Rm;return d>.87?'sky':d>.67?'root':d>.5?'fet':d>.33?'dom':d>.2?'adr':'core';}
function pointer(x,y,v,S){const Gm=geo(v.w,v.h),X=S.x;
 if(X.drag){const a=Math.atan2(y-Gm.cy,x-Gm.cx);let d=a-X.drag.a0;while(d>PI)d-=TAU;while(d<-PI)d+=TAU;X.d+=d;X.drag.a0=a;X.dv=d*30;return null;}
 const rg=ringAt(Gm,x,y),A=angs(S.t,S),a=Math.atan2(y-Gm.cy,x-Gm.cx),p=S.p;
 const nz=(an,a0)=>(((an-a0)%TAU)+TAU)%TAU;
 if(rg==='sky'){const lon=nz(a,A.sky)/D2R,z=D.zsign[D.zi[Math.floor(lon/30)]];return '<b>'+z.nm+'</b> ('+z.el+') reads <b>'+D.elem2root[z.el]+'</b>, '+Math.floor(lon%30)+' degrees in.';}
 if(rg==='root'||rg==='fet'){const i=Math.floor(nz(a,A.asm)/(40*D2R))%9,f=U.FGROUP[i],cv=p.charge[f.nm]||0;return '<b>'+f.nm+'</b> sits under <b>'+f.root+'</b>: charge <b>'+cv.toFixed(1)+'</b>'+(p.aff.indexOf(f.root)>=0?', and this person runs '+f.root+', so it weighs 1.3 times.':'.');}
 if(rg==='dom'){const c=Math.floor(nz(a,A.dom)/(TAU/19))%19;return '<b>'+D.domains[c].nm+'</b> ('+D.domains[c].r+'): the blueprint reaches it at <b>'+(S.DOM[c]*100).toFixed(0)+'</b> of 100.';}
 if(rg==='adr')return 'The 108 addresses, one tick each, lit by SQ.';return null;}
function down(x,y,v,S){const Gm=geo(v.w,v.h);if(ringAt(Gm,x,y)==='sky'||true){S.x.drag={a0:Math.atan2(y-Gm.cy,x-Gm.cx)};S.x.dv=0;}}
function up(){S.x.drag=null;}
function step(dt,S){const X=S.x;
 if(!X.drag){X.d+=X.dv*dt;X.dv*=Math.exp(-dt/.9);if(Math.abs(X.dv)<1e-4)X.dv=0;}
 /* each inner ring is on a spring toward a fraction of the outer ring's turn: friction, as animation */
 ['asm','dom','adr'].forEach(k=>{const f=X.f[k],tgt=FOL[k]*X.d,w0=4.5,z=.8;const a=w0*w0*(tgt-f[0])-2*z*w0*f[1];f[1]+=a*dt;f[0]+=f[1]*dt;});}
function idle(S){const p=S.p,sk=S.sky;if(!sk.length)return '<b>'+p.nm+'</b>';
 const as=S.asp.length?S.asp.map(a=>a.a.k+' '+a.name+' '+a.b.k+', '+a.off.toFixed(0)+' degrees off').join('; '):'no aspect between the sky points';
 const s=sk[0];return '<b>'+p.nm+'</b>: Sun '+s.nm+', Moon '+sk[1].nm+(sk.length>3?', Rising '+sk[2].nm:'')+'. '+as[0].toUpperCase()+as.slice(1)+'. Drag the outer ring.';}
MGC.register({draw:draw,pointer:pointer,down:down,up:up,step:step,idle:idle,person:function(S){S.x.d=0;S.x.dv=0;Object.keys(S.x.f).forEach(k=>S.x.f[k]=[0,0]);}});
})();
