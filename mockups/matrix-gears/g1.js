/* Picture 1, meshing gears. Sky (12) meshes root (4) meshes fetter (9): the product's own counts.
   The 12 to 4 mesh is exact. Signs are the gaps between the sky's teeth; a pinion tooth sits in a sign;
   four signs turn the pinion once, and the zodiac repeats its element every fourth sign, so the same
   root tooth is always in a fire sign. Reads: sky (sunLon, moonLon, ascendant, design sun, gates), ELEM2ROOT,
   AFFIN, S.charge, S.doms and S.roots (p.aff). Rotation is a picture of register, not a force. */
(function(){
const U=MGU,S=U.S,clamp=U.clamp,lerp=U.lerp,ent=U.ent,LAND=U.LAND,OUT=U.OUT,rgba=U.rgba,TAU=U.TAU,BREATH=U.BREATH,txt=U.txt,C=U.C;
const D=U.D,PI=Math.PI,D2R=PI/180;
const PIN=['Engine','Weaver','Witness','Architect'];   /* tooth j sits in the signs of element (-j mod 4): the pinion turns against the sky, so its teeth run water, air, earth after fire. checked by a 60,000 phase test */
const ELN=['fire','earth','air','water'];
S.x={off:0,vel:0,drag:null,last:null};
/* The three gears sit as a triangle with the root pinion at the apex, so neither big gear crowds it: 120 degrees at
   the pinion keeps the two big gears 0.6 of a module apart. Wide screens run it sideways, phones run it downward. */
function geo(w,h){const vert=w<h*.85,res=44,padx=vert?44:60,pty=vert?58:64,pby=vert?92:64;
 const f12=(vert?60:30)*D2R,f23=(vert?120:-30)*D2R;
 const unit=(N,d)=>({N:N,r:N/2});
 const P0=[0,0],P1=[8*Math.cos(f12),8*Math.sin(f12)],P2=[P1[0]+6.5*Math.cos(f23),P1[1]+6.5*Math.sin(f23)];
 const tip=[6.7,2.7,5.2],bb=[P0,P1,P2].map((q,i)=>[q[0]-tip[i],q[0]+tip[i],q[1]-tip[i],q[1]+tip[i]]);
 const x0=Math.min(...bb.map(q=>q[0])),x1=Math.max(...bb.map(q=>q[1])),y0=Math.min(...bb.map(q=>q[2])),y1=Math.max(...bb.map(q=>q[3]));
 const m=Math.min((w-padx*2-60)/(x1-x0),(h-res-pty-pby)/(y1-y0)),cx=w/2,cy=pty+(h-res-pty-pby)/2;
 const ox=cx-(x0+x1)/2*m,oy=cy-(y0+y1)/2*m;
 const G=(N,q)=>({N:N,m:m,c:[ox+q[0]*m,oy+q[1]*m],r:m*N/2,add:.7*m,ded:.8*m,p:PI*m});
 return {vert:vert,m:m,f12:f12,f23:f23,sky:G(12,P0),root:G(4,P1),fet:G(9,P2),cx:cx,cy:cy};}
/* the angles: gear 2 from gear 1 by the meshing condition N1(phi-t1)+N2(phi+pi-t2)=pi */
function angles(Gm,t){const phi=Gm.f12,phi2=Gm.f23,x=S.x,sunLon=S.p.sky?S.p.sky.sun:0;
 const spin=t-.35*(1-Math.exp(-t/.35)),ant=t<.22?-.07*Math.sin(PI*t/.22):0;   /* a back swing, then the spin-up */
 const om=1.5*D2R*(U.REDUCED?0:1);   /* 1.5 degrees a second: one sign in 20 s. the sky is slow */
 const t1=phi-sunLon*D2R+ant+om*spin+x.off;
 const t2=(12*(phi-t1)+4*(phi+PI)-PI)/4,t3=(4*(phi2-t2)+9*(phi2+PI)-PI)/9;
 return [t1,t2,t3];}
/* a tooth is a tapered block in length, not in angle: .66 of a module half-wide at the pitch circle, narrowing
   .2 per unit toward the tip. Length based so a gear of four teeth is a cross and a gear of twelve is a cog,
   and the three still mesh. Measured against the neighbours' gaps at the depth each tooth reaches. */
function toothPts(g,th,k){const P=TAU/g.N,a=th+k*P,rr=g.r-g.ded,rt=g.r+g.add,m=g.m,hr=(.66+.2*g.ded/m)*m,ht=(.66-.2*g.add/m)*m;
 const pol=(ro,hw)=>[Math.hypot(ro,hw),Math.atan2(hw,ro)];
 const rl=pol(rr,-hr),tl=pol(rt,-ht),tr=pol(rt,ht),rg=pol(rr,hr);
 return {a:a,P:P,pts:[[rl[0],a+rl[1]],[tl[0],a+tl[1]],[tr[0],a+tr[1]],[rg[0],a+rg[1]]]};}
function gearPath(g,th){const path=new Path2D(),cx=g.c[0],cy=g.c[1];
 for(let k=0;k<g.N;k++){const T=toothPts(g,th,k),q=T.pts.map(z=>[cx+Math.cos(z[1])*z[0],cy+Math.sin(z[1])*z[0]]);
  if(k===0)path.moveTo(q[0][0],q[0][1]);else path.lineTo(q[0][0],q[0][1]);
  path.lineTo(q[1][0],q[1][1]);path.lineTo(q[2][0],q[2][1]);path.lineTo(q[3][0],q[3][1]);
  let a1=toothPts(g,th,k+1).pts[0][1];if(k===g.N-1)a1+=TAU;path.arc(cx,cy,T.pts[3][0],T.pts[3][1],a1);}
 path.closePath();return path;}
function toothPath(g,th,k){const T=toothPts(g,th,k),path=new Path2D(),cx=g.c[0],cy=g.c[1];
 T.pts.forEach((z,i)=>{const x=cx+Math.cos(z[1])*z[0],y=cy+Math.sin(z[1])*z[0];i?path.lineTo(x,y):path.moveTo(x,y);});path.closePath();return path;}
const polar=(g,a,ro)=>[g.c[0]+Math.cos(a)*ro,g.c[1]+Math.sin(a)*ro];
/* small glyphs, ring not fill */
function glyph(ctx,k,x,y,r,col,al){ctx.strokeStyle=rgba(col,al);ctx.lineWidth=1.3;ctx.beginPath();
 if(k==='Moon'){ctx.arc(x,y,r,-1.2,1.2+0);ctx.stroke();ctx.beginPath();ctx.arc(x+r*.55,y,r*.8,1.2,TAU-1.2,true);ctx.stroke();return;}
 ctx.arc(x,y,r,0,TAU);ctx.stroke();
 if(k==='Sun'){ctx.beginPath();ctx.arc(x,y,r*.28,0,TAU);ctx.stroke();}
 if(k==='Rising'){ctx.beginPath();ctx.moveTo(x-r*1.5,y);ctx.lineTo(x+r*1.5,y);ctx.stroke();}
 if(k==='Design Sun'){ctx.setLineDash([2,2]);ctx.beginPath();ctx.arc(x,y,r*.55,0,TAU);ctx.stroke();ctx.setLineDash([]);}}
function curve(ctx,a,b,bow){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;
 const cx=mx-dy/L*L*bow,cy=my+dx/L*L*bow;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo(cx,cy,b[0],b[1]);return [cx,cy];}
function qpt(a,c,b,u){const v=1-u;return [v*v*a[0]+2*v*u*c[0]+u*u*b[0],v*v*a[1]+2*v*u*c[1]+u*u*b[1]];}
function draw(ctx,w,h,t,S,v){
 const Gm=geo(w,h),th=angles(Gm,t),p=S.p,small=Gm.m<24,breath=Math.sin(TAU*t/BREATH),sk=S.sky;
 const gs=Gm.sky,gr=Gm.root,gf=Gm.fet,m=Gm.m;
 const e0=U.REDUCED?1:.3+.7*ent(t,0,.5);
 ctx.save();ctx.globalAlpha=e0;
 /* the axis the three share */
 ctx.setLineDash([2,6]);ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gs.c[0],gs.c[1]);ctx.lineTo(gr.c[0],gr.c[1]);ctx.lineTo(gf.c[0],gf.c[1]);ctx.stroke();ctx.setLineDash([]);
 /* ---- the sky: 12 teeth, the signs are the gaps between them ---- */
 const bodyS=gearPath(gs,th[0]);ctx.fillStyle='#0D1118';ctx.fill(bodyS);ctx.strokeStyle='rgba(126,184,212,.8)';ctx.lineWidth=1.5;ctx.stroke(bodyS);
 ctx.strokeStyle='rgba(126,184,212,.22)';ctx.lineWidth=1;
 for(let k=0;k<12;k++){const a=th[0]+k*TAU/12,p0=polar(gs,a,gs.r-gs.ded),p1=polar(gs,a,2.3*m);ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.stroke();}
 [4.1,2.3,1.5].forEach(k=>{ctx.beginPath();ctx.arc(gs.c[0],gs.c[1],k*m,0,TAU);ctx.stroke();});
 /* 64 gates around the inner rim, the personality and design gates lit */
 const hd=p.sky&&p.sky.sp?p.sky.sp.hd:null,lit={};if(hd&&hd.p)lit[hd.p.gate]='Sun';if(hd&&hd.d)lit[hd.d.gate]='Design Sun';
 for(let g=0;g<64;g++){const a=th[0]+(g+.5)*5.625*D2R,gate=D.gateWheel[g],on=lit[gate];
  const p0=polar(gs,a,4.1*m),p1=polar(gs,a,(on?4.55:4.3)*m);ctx.strokeStyle=on?rgba(C.gold,.95):'rgba(126,184,212,.28)';ctx.lineWidth=on?1.8:1;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.stroke();}
 /* sign names, upright, in the gaps */
 for(let k=0;k<12;k++){const a=th[0]+(k+.5)*TAU/12,q=polar(gs,a,3.2*m),z=D.zsign[D.zi[k]],rc=U.ROOTC[D.elem2root[z.el]];
  txt(ctx,small?z.nm.slice(0,3):z.nm,q[0],q[1],small?8:11.5,U.mix(rc,'#EFEDE8',.55),'center',500);}
 txt(ctx,'Sky',gs.c[0],gs.c[1]-(small?0:8),small?10:13,C.ink,'center',600);if(!small)txt(ctx,'12 signs, 64 gates',gs.c[0],gs.c[1]+9,9.5,C.dim,'center');
 /* ---- the roots: 4 teeth, one per element, coloured ---- */
 const bodyR=gearPath(gr,th[1]);ctx.fillStyle='#10121A';ctx.fill(bodyR);ctx.strokeStyle='rgba(239,237,232,.35)';ctx.lineWidth=1.2;ctx.stroke(bodyR);
 const armTip=[];
 for(let j=0;j<4;j++){const rn=PIN[j],col=U.ROOTC[rn],inUse=p.aff.indexOf(rn)>=0,tp=toothPath(gr,th[1],j),a=th[1]+j*TAU/4;
  ctx.fillStyle=rgba(col,inUse?.26+.1*breath:.07);ctx.fill(tp);ctx.strokeStyle=rgba(col,inUse?.95:.6);ctx.lineWidth=1.5;ctx.stroke(tp);
  armTip[j]=polar(gr,a,gr.r+gr.add*.55);glyph(ctx,'x',armTip[j][0],armTip[j][1],small?3:4.5,col,inUse?1:.7);
  if(!small){const lq=polar(gr,a,gr.r+gr.add+16);ctx.font='500 11px '+U.FONT;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=4;ctx.lineJoin='round';ctx.strokeStyle='#090A0E';ctx.strokeText(rn,lq[0],lq[1]);ctx.fillStyle=U.mix(col,'#EFEDE8',.35);ctx.fillText(rn,lq[0],lq[1]);}}
 ctx.beginPath();ctx.arc(gr.c[0],gr.c[1],gr.r-gr.ded-4,0,TAU);ctx.strokeStyle='rgba(239,237,232,.18)';ctx.lineWidth=1;ctx.stroke();
 /* ---- the fetters: 9 teeth, grouped under their root, a charge bar on each ---- */
 const bodyF=gearPath(gf,th[2]);ctx.fillStyle='#0F1118';ctx.fill(bodyF);ctx.strokeStyle='rgba(239,237,232,.35)';ctx.lineWidth=1.2;ctx.stroke(bodyF);
 /* the 108 addresses, a ring of ticks at their real slot angles, lit by SQ and coloured by the fetter each one belongs to */
 ctx.strokeStyle='rgba(239,237,232,.14)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(gf.c[0],gf.c[1],2.35*m,0,TAU);ctx.stroke();
 for(let i=0;i<p.addr.length;i++){const a=p.addr[i],rw=U.FNAME.indexOf(a.cf);if(rw<0)continue;
  const ang=th[2]+(a.s+.5)*TAU/108,L=(.12+Math.min(1,a.sq/10)*.9)*m*(.4+.6*ent(t,.3+rw*.05,.5)),p0=polar(gf,ang,2.4*m),p1=polar(gf,ang,2.4*m+L);
  ctx.strokeStyle=rgba(U.FCOL[rw],a.sq>.02?.9:.25);ctx.lineWidth=small?1:1.3;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.stroke();}
 const fTip=[];
 FG:for(let i=0;i<9;i++){const f=U.FGROUP[i],rw=f.rw,ch=S.CH[rw],col=U.FCOL[rw],a=th[2]+i*TAU/9,en=ent(t,.25+i*.06,.4,LAND),tp=toothPath(gf,th[2],i);
  ctx.fillStyle=rgba(col,.05+.3*ch);ctx.fill(tp);ctx.strokeStyle=rgba(col,.85);ctx.lineWidth=1.5;ctx.stroke(tp);
  const b0=polar(gf,a,gf.r-gf.ded+6),L=(gf.ded+gf.add-14)*ch*en,b1=polar(gf,a,gf.r-gf.ded+6+Math.max(0,L)),bt=polar(gf,a,gf.r+gf.add-8);
  ctx.lineCap='round';ctx.lineWidth=small?3:5;ctx.strokeStyle=rgba(col,.14);ctx.beginPath();ctx.moveTo(b0[0],b0[1]);ctx.lineTo(bt[0],bt[1]);ctx.stroke();
  if(L>.5){ctx.strokeStyle=rgba(col,.95);ctx.beginPath();ctx.moveTo(b0[0],b0[1]);ctx.lineTo(b1[0],b1[1]);ctx.stroke();}
  fTip[i]=polar(gf,a,gf.r+gf.add*.6);
  const lp=polar(gf,a,gf.r+gf.add+(small?16:24)),chv=p.charge[f.nm]||0;
  txt(ctx,f.nm,lp[0],lp[1]-(small?0:6),small?9:11.5,chv>0?C.ink:C.dim,'center',500);
  txt(ctx,chv>0?chv.toFixed(1):'-',lp[0],lp[1]+(small?9:8),small?8.5:10.5,chv>0?U.mix(col,'#EFEDE8',.35):C.dim,'center',500);}
 txt(ctx,'Fetters',gf.c[0],gf.c[1]-(small?0:7),small?9:12,C.ink,'center',600);if(!small)txt(ctx,'9 emotions, 108 addresses',gf.c[0],gf.c[1]+9,9.5,C.dim,'center');
 /* the three root groups, bracketed outside the fetter teeth */
 {let i0=0;U.ROOTS.forEach(rn=>{const n=D.affin[rn].length,a0=th[2]+(i0-.5)*TAU/9+.03,a1=th[2]+(i0+n-.5)*TAU/9-.03,rr=gf.r+gf.add+(small?6:9);
  ctx.strokeStyle=rgba(U.ROOTC[rn],p.aff.indexOf(rn)>=0?.9:.45);ctx.lineWidth=2;ctx.lineCap='butt';ctx.beginPath();ctx.arc(gf.c[0],gf.c[1],rr,a0,a1);ctx.stroke();i0+=n;});}
 /* ---- the claim: element to root, root to its affine fetters ---- */
 const eB=ent(t,.55,.5);
 const lines=[];
 /* root arm to the fetters its root pairs with (AFFIN), drawn first so the sky's threads sit on top */
 U.FGROUP.forEach((f,i)=>{const j=PIN.indexOf(f.root),inUse=p.aff.indexOf(f.root)>=0,col=U.ROOTC[f.root];
  lines.push({a:armTip[j],b:fTip[i],col:col,on:inUse,w:inUse?1.1+S.CH[f.rw]*1.8:.8,dash:false,bow:(i%2?.12:-.12),k:i});});
 sk.forEach((s,i)=>{const j=PIN.indexOf(s.root),inUse=p.aff.indexOf(s.root)>=0,ma=th[0]+s.lon*D2R,mp=polar(gs,ma,5.5*m);
  lines.push({a:mp,b:armTip[j],col:U.ROOTC[s.root],on:inUse,w:1.4,dash:!inUse,bow:.1,k:20+i,sky:true,mp:mp,s:s,ma:ma});});
 lines.forEach(L=>{const ctrl=curve(ctx,L.a,L.b,L.bow);
  ctx.setLineDash(L.dash?[4,4]:[]);ctx.strokeStyle=rgba(L.col,(L.on?(L.sky?.8:.6):(L.sky?.4:.12))*eB);ctx.lineWidth=L.w;ctx.lineCap='round';
  /* a thread draws in from its start */
  ctx.stroke();ctx.setLineDash([]);
  if(L.on||L.sky){const u=((t/BREATH+L.k*.173)%1+1)%1,q=qpt(L.a,ctrl,L.b,u);
   for(let z=0;z<4;z++){const q2=qpt(L.a,ctrl,L.b,Math.max(0,u-z*.025));ctx.fillStyle=rgba('#EFEDE8',(.8*(1-z/4)*(L.on?1:.5)*eB));ctx.beginPath();ctx.arc(q2[0],q2[1],(small?1.4:2)*(1-z/6),0,TAU);ctx.fill();}}});
 /* the markers sit in their signs, on top of the threads */
 sk.forEach((s,i)=>{const ma=th[0]+s.lon*D2R,mp=polar(gs,ma,5.5*m),en=ent(t,.3+i*.08,.35,LAND),r=(small?4.4:7)*en;
  ctx.fillStyle='rgba(9,10,14,.85)';ctx.beginPath();ctx.arc(mp[0],mp[1],Math.max(.1,r+1.5),0,TAU);ctx.fill();
  glyph(ctx,s.k,mp[0],mp[1],Math.max(.1,r),s.k==='Design Sun'?'#B4B0A8':U.ROOTC[s.root],1);
  const dm=Math.abs(((ma-Gm.f12+PI)%TAU+TAU)%TAU-PI);if(!small&&dm>.7){const lp=polar(gs,ma,gs.r+gs.add+28+(i%2)*26);txt(ctx,s.k+' '+s.nm,lp[0],lp[1]-7,10.5,C.mid,'center',500);txt(ctx,Math.floor(s.lon%30)+'° '+s.el,lp[0],lp[1]+6,9.5,C.dim,'center');}});
 /* what is at the mesh right now: a true statement about the 12 to 4 gear */
 {const lam=(((Gm.f12-th[0])/D2R)%360+360)%360,si=Math.floor(lam/30),z=D.zsign[D.zi[si]],rn=D.elem2root[z.el],col=U.mix(U.ROOTC[rn],'#EFEDE8',.35);
  const cp=[gs.c[0]+Math.cos(Gm.f12)*gs.r,gs.c[1]+Math.sin(Gm.f12)*gs.r];
  const pos=Gm.vert?[14,h-44-48]:[gr.c[0],gr.c[1]+gr.r+gr.add+(small?30:46)],al=Gm.vert?'left':'center';
  ctx.setLineDash([2,4]);ctx.strokeStyle=rgba(U.ROOTC[rn],.5);ctx.lineWidth=1;ctx.beginPath();
  if(Gm.vert){ctx.moveTo(pos[0]+110,pos[1]-12);ctx.lineTo(cp[0],cp[1]);}else{ctx.moveTo(pos[0],pos[1]-14);ctx.lineTo(cp[0],cp[1]);}ctx.stroke();ctx.setLineDash([]);
  txt(ctx,z.nm+' ('+z.el+') meets '+rn,pos[0],pos[1],small?10:12.5,col,al,500);
  txt(ctx,Gm.vert?'the tooth in the mesh':'the tooth in the mesh: one root to every fourth sign',pos[0],pos[1]+15,9.5,C.dim,al);}
 ctx.restore();
 /* legend: the four roots */
 U.skyLegend(ctx,Gm.vert?14:w-14,Gm.vert?36:18,Gm.vert?'left':'right',small);
 U.ROOTS.forEach((rn,i)=>{const x=14+i*(small?84:104),y=18;glyph(ctx,'x',x+4,y,4,U.ROOTC[rn],1);txt(ctx,rn,x+12,y,small?9.5:11,C.mid,'left',500);});
}
function pointer(x,y,v,S){const Gm=geo(v.w,v.h),X=S.x;
 if(X.drag){const a=Math.atan2(y-Gm.sky.c[1],x-Gm.sky.c[0]);let d=a-X.drag.a0;while(d>PI)d-=TAU;while(d<-PI)d+=TAU;
  const n=performance.now();if(X.last){X.vel=lerp(X.vel,(a-X.last.a)/Math.max(.008,(n-X.last.t)/1000),.4);}X.last={a:a,t:n};X.drag.a0=a;X.off+=d;}
 return null;}
function down(x,y,v,S){const Gm=geo(v.w,v.h);S.x.drag={a0:Math.atan2(y-Gm.sky.c[1],x-Gm.sky.c[0])};S.x.vel=0;S.x.last=null;}
function up(){S.x.drag=null;S.x.last=null;}
function step(dt,S){const X=S.x;if(!X.drag){X.off+=X.vel*dt;X.vel*=Math.exp(-dt/.9);if(Math.abs(X.vel)<1e-4)X.vel=0;}}
function idle(S){const p=S.p,sp=p.sky&&p.sky.sp;if(!sp)return '<b>'+p.nm+'</b>: no birth data.';
 const read=sp.root,run=p.aff;const same=run.indexOf(read)>=0;
 return '<b>'+p.nm+'</b>: Sun in '+sp.sun+' ('+sp.sunEl+') reads '+read+'. '+(run.length?('Their domains run '+run.join(' and ')+(same?', so the two agree.':'. The two differ, and the product says so.')):'No domain is chosen yet, so nothing is run.')+' Drag to turn the sky.';}
MGC.register({draw:draw,pointer:pointer,down:down,up:up,step:step,idle:idle,person:function(S,instant){S.x.off=0;S.x.vel=0;}});
})();
