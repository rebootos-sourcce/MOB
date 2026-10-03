/* ============================================================
   CONCEPT 1. INK. Fluid, with an isoline trace.

   THE MEDIUM. Where fallen matter crowds past a threshold it stops being
   points and becomes one body of liquid, the classic metaball: the density
   field is read bilinearly at every pixel and cut at one level, so two knots
   that come close fuse along a smooth neck, and a clump that leaves one
   necks off it. The surface is lit as a height field: its slope gives a
   normal, the normal gives a soft diffuse, a tight highlight and a rim. It
   is dark, the seat's own fallen colour, because fallen matter is dark in
   the shipped view and stands in front of the light.

   The caught share falls in clumps here, three a cycle per address, so the
   liquid drips: a drop gathers on the shell, lets go, accelerates and is
   taken back into the pool. A drop's size is how many points that address
   has caught, which is its pull. Light that crowds, the ball of light at the
   centre, becomes liquid light by the same rule, added rather than laid over.

   Sparse matter stays as points. That is the reading: a lone point is a
   lone point, and only where points crowd does the cloud turn to liquid.

   THE TRACE. Four isolines of the same density, a pressure map of the fall:
   the outermost dotted, where matter begins to gather, the innermost where
   it is thickest. Each line takes the seat colour of the matter it bounds.
   One accent line bounds the ball of light. The two heaviest knots are
   named.
   ============================================================ */
const C1={
 mediumName:'Fluid', mediumKey:'F',
 layerHint:'Fluid turns crowded points into liquid. Trace draws four isolines of the fallen matter.',
 cfg:{drops:true,blurR:1,blurN:3,mR:2,mN:1},
 T:4.5, E:1.1, TL:15, LEV:[2,4.5,11,22],
 init(){this.actD=null;},
 dissolve(){const n=CL.n,VIS=CL.VIS,LD=CL.LD,DK=CL.dk,T=this.T,TL=this.TL;
  for(let i=0;i<n;i++)VIS[i]=DK[i]?1-sstep(T-1.6,T+.4,LD[i]):1-.85*sstep(TL-4,TL+2,LD[i]);},
 medium(dpr){
  const Fd=DG.Fm,Fl=DG.Fl,T=this.T,E=this.E,TL=this.TL,DC=F.DC,LC=F.LC,hot=F.hot,n=Fd.length;
  if(!this.actD||this.actD.length!==n){this.actD=new Uint8Array(n);this.actL=new Uint8Array(n);}
  activeMask(Fd,T-E,this.actD,0);activeMask(Fl,TL-2,this.actL,0);
  /* light from the upper left and in front, the viewer straight on */
  const Lx=-.45,Ly=-.62,Lz=.64,Hn=Math.hypot(Lx,Ly,Lz+1),Hx=Lx/Hn,Hy=Ly/Hn,Hz=(Lz+1)/Hn;
  /* LIQUID LIGHT, added under the ink: a pearl with a bright meniscus,
     brighter toward its middle */
  if(F.CQ>.05)eachActive(this.actL,dpr,(o,x,y)=>{const fl=sampleG(Fl,x,y);if(fl<=TL-2)return;
   const al=sstep(TL-2,TL+1,fl);
   const lx=(sampleG(Fl,x+1.5,y)-sampleG(Fl,x-1.5,y))/3,ly=(sampleG(Fl,x,y+1.5)-sampleG(Fl,x,y-1.5))/3;
   const rim=clamp(Math.hypot(lx,ly)*.12,0,1)*(1-sstep(TL+1,TL+5,fl));
   addPx(o,hot[0],hot[1],hot[2],(al*(.07+.24*sstep(TL,TL*2.6,fl))+.3*rim)*F.CQ);});
  /* THE INK, laid over */
  eachActive(this.actD,dpr,(o,x,y)=>{const f=sampleG(Fd,x,y);if(f<=T-E)return;
   const al=sstep(T-E,T+E,f);
   const dx=(sampleG(Fd,x+1.5,y)-sampleG(Fd,x-1.5,y))/3,dy=(sampleG(Fd,x,y+1.5)-sampleG(Fd,x,y-1.5))/3;
   /* the surface as a height field, flattened as it deepens so a pool reads
      as a pool and not as a cone */
   const hs=.5/(1+f*.04);let nx=-dx*hs,ny=-dy*hs,nz=1;const nl=Math.hypot(nx,ny,nz);nx/=nl;ny/=nl;nz/=nl;
   const dif=Math.max(0,nx*Lx+ny*Ly+nz*Lz),sp=Math.pow(Math.max(0,nx*Hx+ny*Hy+nz*Hz),46);
   /* the meniscus: a line of the seat's light only in the outermost pixel
      or two, where the field crosses the cut */
   const men=1-clamp(Math.abs(f-T)/.9,0,1);
   const k=nearestSeat(colAt(x,y)),dc=DC[k],lc=LC[k];
   const sh=.35+.45*dif;
   overPx(o,dc[0]*sh+lc[0]*men*.75+INK[0]*sp*.6,dc[1]*sh+lc[1]*men*.75+INK[1]*sp*.6,dc[2]*sh+lc[2]*men*.75+INK[2]*sp*.6,al*.96);});},
 /* marching squares over a grid, one level, segments handed back in CSS px */
 iso(a,lev,emit,mask){const gw=DG.gw,gh=DG.gh;
  for(let y=0;y<gh-1;y++)for(let x=0;x<gw-1;x++){const o=y*gw+x;if(mask&&!mask[o])continue;
   const v0=a[o],v1=a[o+1],v2=a[o+gw+1],v3=a[o+gw];
   const id=(v0>lev?8:0)|(v1>lev?4:0)|(v2>lev?2:0)|(v3>lev?1:0);if(id===0||id===15)continue;
   const X=DG.ox+(x-1)*GC,Y=DG.oy+(y-1)*GC;
   const T=()=>[X+(lev-v0)/(v1-v0)*GC,Y], R=()=>[X+GC,Y+(lev-v1)/(v2-v1)*GC],
         Bm=()=>[X+(lev-v3)/(v2-v3)*GC,Y+GC], L=()=>[X,Y+(lev-v0)/(v3-v0)*GC];
   switch(id){case 1:case 14:emit(L(),Bm());break;case 2:case 13:emit(Bm(),R());break;
    case 3:case 12:emit(L(),R());break;case 4:case 11:emit(T(),R());break;
    case 6:case 9:emit(T(),Bm());break;case 7:case 8:emit(L(),T());break;
    case 5:emit(L(),T());emit(Bm(),R());break;case 10:emit(T(),R());emit(L(),Bm());break;}}},
 trace(ctx){const Fd=DG.Fd,LEV=this.LEV;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  /* only the squares that reach the outermost level can carry any line */
  if(!this.actT||this.actT.length!==Fd.length)this.actT=new Uint8Array(Fd.length);activeMask(Fd,LEV[0],this.actT,0);
  LEV.forEach((lev,li)=>{const P=BANDS.map(()=>[]);
   this.iso(Fd,lev,(p,q)=>{P[nearestSeat(colAt((p[0]+q[0])/2,(p[1]+q[1])/2))].push(p[0],p[1],q[0],q[1]);},this.actT);
   ctx.lineWidth=[1,1,1.25,1.5][li];ctx.setLineDash(li===0?[1.5,3.5]:[]);
   P.forEach((seg,k)=>{if(!seg.length)return;ctx.strokeStyle=rgba(mixc(SEATC[k],INK,.3+.12*li),[.5,.62,.78,.92][li]);
    ctx.beginPath();for(let i=0;i<seg.length;i+=4){ctx.moveTo(seg[i],seg[i+1]);ctx.lineTo(seg[i+2],seg[i+3]);}ctx.stroke();});});
  ctx.setLineDash([]);
  /* the ball of light's own outline, in the accent */
  if(F.CQ>.2){ctx.strokeStyle=rgba(ACC,.35+.4*F.CQ);ctx.lineWidth=1;ctx.beginPath();
   this.iso(DG.Fl,this.TL,(p,q)=>{ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);});ctx.stroke();}
  ctx.restore();
  const K=knots(),top=CL.ad.map((a,i)=>({a,k:K[i]})).filter(o=>o.a.p>=.5&&o.k.n>4).sort((x,y)=>y.a.sq-x.a.sq).slice(0,2);
  plates(ctx,top.map(o=>({x:o.k.x,y:o.k.y,r:Math.max(6,(o.k.x1-o.k.x0)/2),t:addrName(o.a.nm),s:o.a.b+', charge '+o.a.sq.toFixed(1),c:SEATC[o.a.si]})));},
 caption(){const c=document.getElementById('cap'),s=(LAYERS.medium?'Fluid':'')+(LAYERS.medium&&LAYERS.trace?' and ':'')+(LAYERS.trace?'four isolines':'');
  const t=s?'<b>'+s.charAt(0).toUpperCase()+s.slice(1)+'</b> over the cloud':'<b>The cloud</b> as it ships';if(c._t!==t){c._t=t;c.innerHTML=t;}}};
boot(C1);
