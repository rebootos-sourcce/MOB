/* ============================================================
   CONCEPT 2. BRANCH. Fractal, with a hull trace per pattern.

   THE MEDIUM, FOR FALLEN MATTER. Every address that has fallen past a
   third of its pull grows a branching skeleton, from its own patch on the
   shell down into its own fallen points, by space colonisation: the
   algorithm used for leaf veins, tree crowns and coral (Runions, 2007).
   Each fallen point is an attractor. The tree grows a step at a time
   toward the attractors near each tip and a tip that reaches one consumes
   it. So the branches fill exactly the volume the data occupies, and the
   branching is the data's own: more points, more forks and finer ones, so
   the thicker the matter the more fractal it reads. Nothing is drawn where
   there is no matter.

   It is grown once, in the cloud's own space, when an address's pull
   moves, one tree a frame, and only projected after that, so it turns with
   the figure and costs nothing at rest. A tree that is new grows in from
   its trunk over half a second on the arrival curve. A charge runs down
   every tree on the Field's own 4.2 second breath, a narrow band of light
   from patch to tips, on an ease in and out: the matter is still draining.

   Each segment's width is how much of the tree hangs below it, the pipe
   model, so the trunk out of the shell is the heaviest line and the tips
   the finest.

   THE MEDIUM, FOR LIGHT. The ball of light gets a fractal coastline by
   domain warping (Inigo Quilez's write up): the density is read a short way
   off, pushed by four octaves of noise, scaled by a finer one and cut at
   one level, with filaments inside where it is thickest. It drifts at
   about a pixel a second.

   THE TRACE. Not the whole cloud, each pattern. Every address that has
   started to fall is drawn as the convex hull of its settled fallen
   matter, the volume that one pattern occupies, with a dashed spine from
   its patch to its knot, the direction it fell. The three heaviest are
   named and carry survey rings on the hull's corners.
   ============================================================ */
const C2={
 mediumName:'Fractal', mediumKey:'R',
 layerHint:'Fractal grows a branching skeleton through each pattern’s fallen matter and a coastline on the light. Trace outlines each falling pattern.',
 cfg:{drops:false,blurR:1,blurN:3},
 TL:13,
 /* space colonisation, in outer shell radii: a step, the distance a tip
    consumes an attractor at, and how far an attractor can see a tip */
 SC:{D:.0065,KILL:.011,SEE:.045,MAXA:170,MAXN:700,MIN:.33},
 init(){this.actL=null;this.trees=[];this.q=0;
  /* the noise: tileable value noise, 128 texels, lattice every 8, quintic */
  const N=128,P=16,r=rng(9001),L=new Float32Array(P*P);for(let i=0;i<L.length;i++)L[i]=r();
  const B=new Float32Array(N*N),q=t=>t*t*t*(t*(t*6-15)+10);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const gx=x/8,gy=y/8,x0=gx|0,y0=gy|0,fx=q(gx-x0),fy=q(gy-y0);
   const a=L[(y0%P)*P+x0%P],b=L[(y0%P)*P+(x0+1)%P],c=L[((y0+1)%P)*P+x0%P],d=L[((y0+1)%P)*P+(x0+1)%P];
   B[y*N+x]=(a*(1-fx)+b*fx)*(1-fy)+(c*(1-fx)+d*fx)*fy;}
  this.B=B;},
 nz(u,v){const B=this.B,xf=Math.floor(u),yf=Math.floor(v),fx=u-xf,fy=v-yf,x0=xf&127,y0=yf&127,x1=(x0+1)&127,y1=(y0+1)&127;
  return (B[(y0<<7)+x0]*(1-fx)+B[(y0<<7)+x1]*fx)*(1-fy)+(B[(y1<<7)+x0]*(1-fx)+B[(y1<<7)+x1]*fx)*fy;},
 fbm(u,v){return (this.nz(u,v)+.5*this.nz(u*2+17.1,v*2+3.7)+.25*this.nz(u*4+41.3,v*4+29.9)+.125*this.nz(u*8+7.7,v*8+61.1))/1.875;},
 fbm5(u,v){return (this.nz(u,v)+.5*this.nz(u*2+17.1,v*2+3.7)+.25*this.nz(u*4+41.3,v*4+29.9)+.125*this.nz(u*8+7.7,v*8+61.1)+.0625*this.nz(u*16+93.3,v*16+11.9))/1.9375;},
 /* fallen points stay as a dim dust under the skeleton, so the branches
    read as the structure of the dust and not as a drawing beside it */
 dissolve(){const n=CL.n,VIS=CL.VIS,LD=CL.LD,DK=CL.dk,AI=CL.ai,SI=CL.si,TL=this.TL,ad=CL.ad;
  for(let i=0;i<n;i++){if(DK[i]){const t=this.trees[AI[i]];VIS[i]=t&&t.n>1?.38:1;}
   else VIS[i]=1-.8*sstep(TL-4,TL+3,LD[i]);}},
 /* ONE TREE, grown in the cloud's own space from the address's patch */
 grow(ai){const a=CL.ad[ai],SC=this.SC,R=CL.R[a.si],p=a.p;
  const A=[];for(let i=a.o;i<a.o+a.per;i++){if(!CL.dk[i]||CL.fm[i]>=0)continue;
   const rf=1-.22*p;A.push(CL.ux[i]*R*rf,CL.uy[i]*R*rf-.5*p*CL.jr[i]*R,CL.uz[i]*R*rf);}
  let na=A.length/3;
  /* a fixed share, the same every time, when there are more than enough */
  if(na>SC.MAXA){const k=[],step=na/SC.MAXA;for(let j=0;j<SC.MAXA;j++){const s=Math.floor(j*step)*3;k.push(A[s],A[s+1],A[s+2]);}A.length=0;A.push(...k);na=SC.MAXA;}
  if(na<4)return null;
  const X=[a.c[0]*R],Y=[a.c[1]*R],Z=[a.c[2]*R],P=[-1],alive=new Uint8Array(na).fill(1);let live=na;
  const D=SC.D,K2=SC.KILL*SC.KILL,S2=SC.SEE*SC.SEE;
  for(let it=0;it<400&&live>0&&X.length<SC.MAXN;it++){
   const n=X.length,ax=new Float32Array(n),ay=new Float32Array(n),az=new Float32Array(n),cn=new Uint16Array(n);let any=0;
   for(let j=0;j<na;j++){if(!alive[j])continue;const px=A[3*j],py=A[3*j+1],pz=A[3*j+2];let bk=-1,bd=1e9;
    for(let k=0;k<n;k++){const dx=px-X[k],dy=py-Y[k],dz=pz-Z[k],d=dx*dx+dy*dy+dz*dz;if(d<bd){bd=d;bk=k;}}
    if(bd<K2){alive[j]=0;live--;continue;}
    if(bd<S2){const d=Math.sqrt(bd);ax[bk]+=(px-X[bk])/d;ay[bk]+=(py-Y[bk])/d;az[bk]+=(pz-Z[bk])/d;cn[bk]++;any=1;}}
   if(!any){
    /* nothing in sight yet: the trunk steps toward what is left */
    let cx=0,cy=0,cz=0;for(let j=0;j<na;j++)if(alive[j]){cx+=A[3*j];cy+=A[3*j+1];cz+=A[3*j+2];}
    cx/=live;cy/=live;cz/=live;const k=n-1,dx=cx-X[k],dy=cy-Y[k],dz=cz-Z[k],d=Math.hypot(dx,dy,dz)||1;
    X.push(X[k]+dx/d*D);Y.push(Y[k]+dy/d*D);Z.push(Z[k]+dz/d*D);P.push(k);continue;}
   for(let k=0;k<n;k++){if(!cn[k])continue;const l=Math.hypot(ax[k],ay[k],az[k]);if(l<1e-6)continue;
    X.push(X[k]+ax[k]/l*D);Y.push(Y[k]+ay[k]/l*D);Z.push(Z[k]+az[k]/l*D);P.push(k);}}
  const n=X.length,desc=new Float32Array(n),dep=new Uint16Array(n);
  for(let k=1;k<n;k++)dep[k]=dep[P[k]]+1;
  for(let k=n-1;k>0;k--)desc[P[k]]+=desc[k]+1;
  let md=1;for(let k=0;k<n;k++)if(dep[k]>md)md=dep[k];
  return {X:new Float32Array(X),Y:new Float32Array(Y),Z:new Float32Array(Z),P:Int16Array.from(P),desc,dep,md,n,p,born:performance.now(),grow:true};},
 /* one tree a frame, the one most out of date */
 tend(){const ad=CL.ad,SC=this.SC;if(this.dens!==CL.dens){this.dens=CL.dens;this.trees=[];}
  let best=-1,bd=0;
  ad.forEach((a,i)=>{const t=this.trees[i],want=a.p>=SC.MIN;
   if(!want){if(t)this.trees[i]=null;return;}
   const d=t?Math.abs(t.p-a.p):1;if(d>.03&&d>bd){bd=d;best=i;}});
  this.pending=best>=0;if(best<0)return;const old=this.trees[best],t=this.grow(best);
  /* a tree that replaces one of its own size is swapped, not regrown: a
     slider being dragged must not set every tree growing again */
  if(t&&old&&old.n>t.n*.5)t.grow=false;
  this.trees[best]=t;},
 busy(){return !!this.pending;},
 medium(dpr){
  this.tend();
  /* THE CORONA, light added */
  const Fl=DG.Fl,TL=this.TL,hot=F.hot,n=Fl.length,AMP=40,S=1/7.5,gw=DG.gw,gh=DG.gh;
  if(F.CQ<=.05)return;
  if(!this.actL||this.actL.length!==n){this.actL=new Uint8Array(n);this.WX=new Float32Array(n);this.WY=new Float32Array(n);}
  const AL=activeMask(Fl,TL*.6,this.actL,Math.ceil(AMP*.36/GC)),WX=this.WX,WY=this.WY,dr=REDUCED?0:F.t*.16;
  for(let y=1;y<gh;y++)for(let x=1;x<gw;x++){const o=y*gw+x;if(!(AL[o]||AL[o-1]||AL[o-gw]||AL[o-gw-1]))continue;
   const u=(DG.ox+(x-1)*GC)*S,v=(DG.oy+(y-1)*GC)*S;WX[o]=this.fbm(u+dr,v)-.5;WY[o]=this.fbm(u+31.7,v+17.3-dr)-.5;}
  eachActive(AL,dpr,(o,x,y)=>{const wx=sampleG(WX,x,y),wy=sampleG(WY,x,y);
   const f0=sampleG(Fl,x,y),amp=AMP*(.35+.65*sstep(0,TL*2,f0));
   const f=sampleG(Fl,x+amp*wx,y+amp*wy);if(f<TL*.4)return;
   const d2=this.fbm5(x*S*2.3+wx*3+dr*.5,y*S*2.3+wy*3),fv=f*(.4+1.2*d2);if(fv<=TL-1)return;
   const al=sstep(TL-1,TL+1,fv),rim=1-clamp(Math.abs(fv-TL)/1.2,0,1);
   const vein=(1-sstep(0,.03,Math.abs(d2-.5)))*sstep(TL,TL*2.2,fv);
   addPx(o,hot[0],hot[1],hot[2],(al*(.05+.14*sstep(TL,TL*3,fv))+rim*.32+vein*.3)*F.CQ);});},
 /* THE SKELETONS are strokes, so they are drawn after the one put */
 post(ctx){if(!LAYERS.medium)return;
  const G=F.G,yaw=REDUCED?0:.45*Math.sin(F.t*.21),cy_=Math.cos(yaw),sy_=Math.sin(yaw),cp=Math.cos(PITCH),spn=Math.sin(PITCH);
  const now=performance.now(),ph=REDUCED?-1:sstep(0,1,(F.t/4.2)%1);
  ctx.save();ctx.lineCap='round';
  /* three widths, seven seats: twenty one strokes for every tree there is */
  const BK=[];for(let s=0;s<7;s++)BK.push([[],[],[],[]]);const PU=[[],[],[],[],[],[],[]];
  this.trees.forEach((t,ai)=>{if(!t)return;const a=CL.ad[ai];if(!F.seatOn[a.si])return;
   /* growing in: the depth reached runs out on the arrival curve, 520ms */
   let reach=t.md+1;if(t.grow&&!REDUCED){const k=clamp((now-t.born)/520,0,1),e=1-Math.pow(1-k,3);reach=e*(t.md+1);}
   const sx=new Float32Array(t.n),sy=new Float32Array(t.n),sc=G.s0;
   for(let k=0;k<t.n;k++){const x=t.X[k],y=t.Y[k],z=t.Z[k],x1=x*cy_+z*sy_,z1=-x*sy_+z*cy_,y2=y*cp-z1*spn,z2=y*spn+z1*cp,kk=DIST/(DIST-z2);
    sx[k]=G.cx+x1*kk*sc;sy[k]=G.cy-y2*kk*sc;}
   const root=t.desc[0]||1;
   for(let k=1;k<t.n;k++){if(t.dep[k]>reach)continue;const q=t.P[k],sh=(t.desc[k]+1)/root,w=Math.sqrt(sh);
    /* THE TRUNK IS THE FALL, and the trace's spine already draws the fall.
       Drawn at the pipe model's weight it was the loudest line on the
       figure and the branching under it the quietest, the opposite of the
       ask. So a segment carrying nearly the whole tree is a hairline, and
       the weight starts where the tree first forks. */
    const b=sh>.9?3:(w>.5?2:(w>.16?1:0));BK[a.si][b].push(sx[q],sy[q],sx[k],sy[k]);
    if(ph>=0&&Math.abs(t.dep[k]/t.md-ph)<.06)PU[a.si].push(sx[q],sy[q],sx[k],sy[k]);}});
  const WD=[.55,.95,1.5,.6];
  BK.forEach((bs,s)=>bs.forEach((seg,b)=>{if(!seg.length)return;
   ctx.strokeStyle=rgba(mixc(F.LC[s],INK,.15),[.55,.72,.88,.22][b]);ctx.lineWidth=WD[b];ctx.beginPath();
   for(let i=0;i<seg.length;i+=4){ctx.moveTo(seg[i],seg[i+1]);ctx.lineTo(seg[i+2],seg[i+3]);}ctx.stroke();}));
  /* the charge running down, a third brighter, on the breath */
  PU.forEach((seg,s)=>{if(!seg.length)return;ctx.strokeStyle=rgba(mixc(F.LC[s],INK,.55),.55);ctx.lineWidth=1.3;ctx.beginPath();
   for(let i=0;i<seg.length;i+=4){ctx.moveTo(seg[i],seg[i+1]);ctx.lineTo(seg[i+2],seg[i+3]);}ctx.stroke();});
  ctx.restore();},
 /* Andrew's monotone chain */
 hull(P){if(P.length<6)return null;const n=P.length/2,ix=[];for(let i=0;i<n;i++)ix.push(i);
  ix.sort((a,b)=>P[2*a]-P[2*b]||P[2*a+1]-P[2*b+1]);
  const cr=(o,a,b)=>(P[2*a]-P[2*o])*(P[2*b+1]-P[2*o+1])-(P[2*a+1]-P[2*o+1])*(P[2*b]-P[2*o]);
  const lo=[],up=[];
  for(const i of ix){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],i)<=0)lo.pop();lo.push(i);}
  for(let j=ix.length-1;j>=0;j--){const i=ix[j];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],i)<=0)up.pop();up.push(i);}
  up.pop();lo.pop();return lo.concat(up).map(i=>[P[2*i],P[2*i+1]]);},
 trace(ctx){
  const ad=CL.ad,pts=ad.map(()=>[]),OR=CL.ord,AI=CL.ai,SI=CL.si,DK=CL.dk,FM=CL.fm,X=CL.X,Y=CL.Y;
  /* the fallen matter only, and only what has settled: the hull is the
     volume the pattern has fallen into, and it holds still while drops run */
  for(let q=0;q<F.live;q++){const i=OR[q];if(SI[i]===7||!DK[i]||FM[i]>=0)continue;const a=ad[AI[i]];if(a.p<.2)continue;
   pts[AI[i]].push(X[i],Y[i]);}
  const K=knots();ctx.save();ctx.lineJoin='round';
  /* the three heaviest that have fallen are named, and only they carry the
     survey marks: on every hull the marks were a second texture */
  const named=new Set(ad.map((a,i)=>i).filter(i=>ad[i].p>=.5&&K[i].n>4).sort((x,y)=>ad[y].sq-ad[x].sq).slice(0,3));
  /* lightest first, so the heavy hulls are drawn over the light ones */
  const order=ad.map((a,i)=>i).filter(i=>ad[i].p>=.2).sort((x,y)=>ad[x].p-ad[y].p);
  const G=F.G,yaw=REDUCED?0:.45*Math.sin(F.t*.21),cy_=Math.cos(yaw),sy_=Math.sin(yaw);
  order.forEach(i=>{const a=ad[i],h=this.hull(pts[i]);if(!h||h.length<3)return;const p=a.p,c=mixc(SEATC[a.si],INK,.25);
   ctx.beginPath();h.forEach((v,j)=>j?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();
   ctx.strokeStyle=rgba(c,p<.5?.16+.3*p:.3+.5*p);ctx.lineWidth=p<.5?.75:.85+.6*p;ctx.stroke();
   if(named.has(i)){ctx.strokeStyle=rgba(c,.55+.35*p);ctx.lineWidth=1;
    h.forEach(v=>{ctx.beginPath();ctx.arc(v[0],v[1],1.9,0,TAU);ctx.stroke();});}
   if(p>=.5){
    /* the spine: from where the patch sits on its shell to the knot */
    const k=K[i];if(k.n>4){const R=CL.R[a.si];
     const x=a.c[0]*R,y=a.c[1]*R,z=a.c[2]*R,x1=x*cy_+z*sy_,z1=-x*sy_+z*cy_,y2=y*Math.cos(PITCH)-z1*Math.sin(PITCH),z2=y*Math.sin(PITCH)+z1*Math.cos(PITCH);
     const kk=DIST/(DIST-z2),sx=G.cx+x1*kk*G.s0,sy=G.cy-y2*kk*G.s0;
     /* with the trees on, a tree's own trunk already draws the fall, so
        only the named three keep a spine */
     if(named.has(i)||!LAYERS.medium){ctx.setLineDash([2,3]);ctx.strokeStyle=rgba(c,named.has(i)?.7:.2+.12*p);ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(k.x,k.y);ctx.stroke();ctx.setLineDash([]);}
     if(named.has(i)){ctx.beginPath();ctx.arc(k.x,k.y,2.6,0,TAU);ctx.stroke();}}}});
  ctx.restore();
  const top=[...named].map(i=>({a:ad[i],k:K[i]}));
  plates(ctx,top.map(o=>({x:o.k.x,y:o.k.y,r:Math.max(6,(o.k.x1-o.k.x0)/2),t:addrName(o.a.nm),s:o.a.b+', charge '+o.a.sq.toFixed(1),c:SEATC[o.a.si]})));},
 caption(){const c=document.getElementById('cap'),s=(LAYERS.medium?'Fractal':'')+(LAYERS.medium&&LAYERS.trace?' and ':'')+(LAYERS.trace?'a hull per pattern':'');
  const t=s?'<b>'+s.charAt(0).toUpperCase()+s.slice(1)+'</b> over the cloud':'<b>The cloud</b> as it ships';if(c._t!==t){c._t=t;c.innerHTML=t;}}};
boot(C2);
