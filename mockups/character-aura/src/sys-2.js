/* AURA 2, CORONA. Two clouds with two jobs. The body cloud is the mask: neutral, cool, the shape and nothing else,
   bent by the load. Round it a second cloud of drifting points is the radiance, the field the body stands in.
   The field is seven shells, each a contour a fixed distance off the skin, so it wraps whatever shape the load has
   made. Coherence opens them outward and lights them in the order a prism sorts light: red against the body, then
   orange, yellow, green, cyan, blue, and violet at the outer edge. At ten percent it is a thin dim rim hugging the
   skin. At fifty five the warm shells and the green one are lit. At a hundred the whole spectrum stands round the
   figure, every shell flowing up the limbs on its own beat, and a few of its points are lamps that light the air. */
const NH2=28,NL2=5,NSH=7;
const AL2=[.2,.36,.58,.8,1],WH2=[0,0,.05,.14,.3],SZ2=[.85,1,1.12,1.3,1.5];
const COLS2=(()=>{const a=[];for(let h=0;h<NH2;h++){a.push([]);const base=specAt(h*6/27);for(let l=0;l<NL2;l++)a[h].push(css(mixc(base,INK,WH2[l]),1));}return a;})();
/* the mask: a cool ink, a little of the pattern's colour in it so the leading pattern can still be found by eye */
const NP2=9,NLB=6,ALB=[.1,.2,.36,.56,.78,.95],WHB=[0,0,.04,.12,.24,.4],SZB=[.85,.95,1.05,1.15,1.28,1.45];
const COLSB=(()=>{const a=[];for(let p=0;p<NP2;p++){a.push([]);const base=mixc([186,194,208],PCOL[p],.3);for(let l=0;l<NLB;l++)a[p].push(css(mixc(base,INK,WHB[l]),1));}return a;})();
function coronaSample(N,seed){const F=buildFig(REST),C=F.caps,rnd=rng(seed||5);
 const w=C.map(c=>c.disc?Math.PI*(c.ra+c.rb)*1.1:Math.hypot(c.bx-c.ax,c.by-c.ay)*2+(c.ra+c.rb)*1.4);const tot=w.reduce((a,b)=>a+b,0);
 const Z={n:N,cap:new Int16Array(N),u:new Float32Array(N),sg:new Float32Array(N),m:new Uint8Array(N),jr:new Float32Array(N),ph:new Float32Array(N),sp:new Float32Array(N),hj:new Float32Array(N),lamp:new Uint8Array(N)};
 let n=0;for(let ci=0;ci<C.length;ci++){const cnt=ci===C.length-1?N-n:Math.round(N*w[ci]/tot);
  for(let j=0;j<cnt&&n<N;j++,n++){Z.cap[n]=ci;Z.u[n]=rnd();Z.sg[n]=rnd()<.5?-1:1;Z.m[n]=(n*7919)%NSH;Z.jr[n]=rnd()-.5;Z.ph[n]=rnd();Z.sp[n]=.6+rnd()*.8;Z.hj[n]=rnd()+rnd()-1;Z.lamp[n]=(n%110===7)?1:0;}}
 return Z;}
/* the distance from the skin, on a coarse grid, once a frame. A shell is then every place a fixed distance out,
   whatever the load has done to the body. Cheap: about eight thousand cells against twenty segments. */
const GR={nx:0,ny:0,x0:0,y0:0,cell:.05,G:new Float32Array(180*180)};
function fieldGrid(F,pad){figBoxes(F);const B=F.box,cell=GR.cell,C=F.caps;const x0=B[0]-pad,y0=B[2]-pad,nx=Math.min(180,Math.ceil((B[1]-B[0]+2*pad)/cell)+1),ny=Math.min(180,Math.ceil((B[3]-B[2]+2*pad)/cell)+1);
 GR.nx=nx;GR.ny=ny;GR.x0=x0;GR.y0=y0;const G=GR.G;const bb=F.bb,PB=bb.map(b=>[b[0]-pad,b[1]+pad,b[2]-pad,b[3]+pad]);
 for(let j=0;j<ny;j++){const y=y0+j*cell;for(let i=0;i<nx;i++){const x=x0+i*cell;let d=9;
  for(let q=0;q<C.length;q++){const b=PB[q];if(x<b[0]||x>b[1]||y<b[2]||y>b[3])continue;const e=capD(C[q],x,y);if(e<d)d=e;}G[j*nx+i]=d>8?pad+.3:d;}}}
function gridD(x,y){const u=(x-GR.x0)/GR.cell,v=(y-GR.y0)/GR.cell,i=Math.floor(u),j=Math.floor(v),nx=GR.nx;
 if(i<1||j<1||i>=nx-2||j>=GR.ny-2)return null;const fx=u-i,fy=v-j,G=GR.G,o=j*nx+i;
 const d=(G[o]*(1-fx)+G[o+1]*fx)*(1-fy)+(G[o+nx]*(1-fx)+G[o+nx+1]*fx)*fy;
 let gx=G[o+1]-G[o-1],gy=G[o+nx]-G[o-nx];const gl=Math.hypot(gx,gy)||1;_g[0]=d;_g[1]=gx/gl;_g[2]=gy/gl;return _g;}
const _g=[0,0,0];
/* the field as light: the same distance grid, turned into a small picture where each cell takes the spectrum colour for
   its distance from the skin, and laid under the points scaled up smooth. This is what makes the corona glow instead
   of read as dust. Seven shells of hue, soft between them, and the same progressive lighting the points use. */
const SPECT=Array.from({length:65},(_,i)=>specAt(i*6/64));
/* the hue of the field at a place: a slow iridescent wave drifting up the figure, folded so every hue of the spectrum
   turns up as often as every other. It is not a function of distance alone, so the halo is light and not a heat map.
   Coherence decides how much of the spectrum the wave is allowed to show, from red alone to all seven. */
function tri1(u){u=((u%2)+2)%2;return u<1?u:2-u;}
function hueField(x,y,tt,t){return 6*tri1(y*1.35+x*.8+tt*1.5-t*.1);}
function drawField(sc,H0,X,c){const nx=GR.nx,ny=GR.ny,G=GR.G,M=sc.mem,g=sc.g,d=sc.dpr,k=sc.k,t=sc.t;
 if(!M.fc||M.fc.width!==nx||M.fc.height!==ny){M.fc=document.createElement('canvas');M.fc.width=nx;M.fc.height=ny;M.fx=M.fc.getContext('2d');M.fim=M.fx.createImageData(nx,ny);}
 const D=M.fim.data,A0=.44*(.3+.7*sstep(0,.5,c));
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const o=(j*nx+i)*4,dd=G[j*nx+i];
  if(dd<-.05){D[o+3]=0;continue;}
  const tt=dd<0?0:dd/H0;if(tt>=1){D[o+3]=0;continue;}
  const s=hueField(GR.x0+i*GR.cell,GR.y0+j*GR.cell,tt,t),lit=litQ(X-s),col=SPECT[(s*(64/6))|0];
  const a=A0*lit*Math.pow(1-tt,1.35)*(dd<0?1+dd*18:1);
  D[o]=col[0];D[o+1]=col[1];D[o+2]=col[2];D[o+3]=a*255;}
 M.fx.putImageData(M.fim,0,0);
 g.save();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.globalAlpha=1;
 g.drawImage(M.fc,(sc.cx+(GR.x0-GR.cell/2)*k)*d,(sc.cy+(GR.y0-GR.cell/2)*k)*d,nx*GR.cell*k*d,ny*GR.cell*k*d);g.restore();}
function coronaWorldCol(sc,role,y,lit){const base=mixc(EMBER,[196,204,220],.55);return lit?mixc(base,INK,lit*.55):base;}
const SYS_2={id:'aura-2',name:'Aura 2, Corona',ver:2,lineK:.84,N:{d:7000,m:3600,l:2200},NZ:{d:8400,m:4200,l:2600},
 blurb:'Two clouds. The body is the mask, neutral and bent by the load. Round it, seven shells of drifting points are the radiance, red at the skin to violet at the edge. Coherence opens them outward.',
 how:'Seven drifting shells round the body',
 init(sc){const l=sc.lineup,s=sc.small;const N=l?SYS_2.N.l:s?SYS_2.N.m:SYS_2.N.d,NZ=l?SYS_2.NZ.l:s?SYS_2.NZ.m:SYS_2.NZ.d;
  sc.mem.A=bodySample(N,21);sc.mem.Z=coronaSample(NZ,5);sc.mem.B=new Batch(N,NP2,NLB);sc.mem.BZ=new Batch(NZ,NH2,NL2);worldInit(sc);},
 draw(sc){const g=sc.g,A=sc.mem.A,Z=sc.mem.Z,B=sc.mem.B,BZ=sc.mem.BZ,d=sc.dpr,t=sc.t,F=sc.fig,C=F.caps,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c;
  const cp=segFrames(C),lp=sc.lead,beat=.5+.5*Math.sin(Math.PI*2*t/MASKS.find(x=>x.nm===sc.mask).per);
  drawWorld(sc,{k:.55+.4*c,col:(role,y,lit)=>coronaWorldCol(sc,role,y,lit)});
  const kc=lerp(.7,1,sstep(0,.7,c)),open=sstep(.03,.97,c),H0=(.02+.27*Math.pow(open,1.1))*F.scale**.4,X=c*8.6-1.0,intro=t<2.2;
  /* the mask */
  const vis=.6+.4*sstep(0,.5,c),thr=sc.pc.map(q=>(.5+.5*Math.pow(q,.6))*vis);
  const pf=sc.pc.map((q,p)=>sc.pa(p)*(.84+.3*Math.pow(q,.8))*(p===lp?.9+.2*beat:1));
  const gain=(.5+.45*sstep(0,.85,c))*Math.min(1,F.scale**1.6),szB=(sc.lineup?1.25:sc.mobile?1.3:1.5)*(1+.12*sstep(0,.9,c));B.reset();
  for(let i=0;i<A.n;i++){const p=A.pat[i];if(A.keep[i]>thr[p])continue;
   const q=bodyXY(sc,A,C,cp,i,kc,intro),x=cx+q[0]*k,y=cy+q[1]*k;
   let b=gain*A.lum[i]*pf[p]*q[2]*(1+.12*Math.sin(t*(.9+A.ph[i]*1.4)+i));
   let l=(b*NLB*.95)|0;if(l>=NLB)l=NLB-1;if(l<0)l=0;B.add(x,y,p,l,1);sc.reg(x,y,p);}
  B.flush(g,d,COLSB,ALB,SZB,szB);
  /* the radiance. Each point starts where the segment it belongs to puts a shell, then is moved onto the true
     contour of the whole body, and is dropped if that place is inside another part of the body. */
  fieldGrid(F,H0+.1);if(c>.02)drawField(sc,H0,X,c);BZ.reset();const flow=.05+.22*c,rim=.4*(.3+.7*sstep(0,.3,c)),szZ=(sc.lineup?1.2:sc.mobile?1.3:1.5)*(1+.2*open);
  const lampR=(sc.lineup?7:sc.mobile?9:12)*(.6+.8*open);
  for(let j=0;j<Z.n;j++){const ci=Z.cap[j],cc=C[ci],m=Z.m[j];
   const dt=H0*(m+.5+.55*Z.jr[j])/NSH*(1+.1*Math.sin(t*.55+Z.ph[j]*6.28)*open);let x,y,ae=1;const R0=dt+.012;
   if(cc.disc){const th=Z.u[j]*6.283+t*(.05+.1*c)*Z.sg[j],ca=Math.cos(cc.rot),sa=Math.sin(cc.rot),lx=Math.cos(th)*(cc.ra+R0),ly=Math.sin(th)*(cc.rb+R0);
    x=cc.ax+lx*ca-ly*sa;y=cc.ay+lx*sa+ly*ca;}
   else{const q=cp[ci],dir=cc.by<cc.ay?1:-1;let u=Z.u[j]+dir*t*Z.sp[j]*flow*(1+.12*m);u-=Math.floor(u);const r=(cc.ra+(cc.rb-cc.ra)*u);
    x=cc.ax+q.dx*u+q.nx*Z.sg[j]*(r+R0);y=cc.ay+q.dy*u+q.ny*Z.sg[j]*(r+R0);ae=Math.pow(Math.sin(Math.PI*u),.5);}
   const gq=gridD(x,y);if(!gq)continue;const err=dt-gq[0];if(err>.1||err<-.1)continue;x+=gq[1]*err;y+=gq[2]*err;
   const px=cx+x*k,py=cy+y*k,tn=dt/H0;
   let s=hueField(x,y,tn,t)+Z.hj[j]*.5*open;s=s<0?0:s>6?6:s;
   let li=litQ(X-s);const rm=m===0?rim:0;if(rm>li)li=rm;if(li<.03)continue;
   let b=li*(1-.4*tn)*ae*(.75+.25*Math.sin(t*(.7+Z.ph[j]*1.6)+j));
   let l=(b*NL2*1.1)|0;if(l>=NL2)l=NL2-1;if(l<0)l=0;
   const h=Math.round(s*(27/6));
   BZ.add(px,py,h,l,1);
   if(Z.lamp[j]&&b>.25){sc.glow(px,py,lampR,specAt(s<0?0:s>6?6:s),.2*Math.min(1,b*1.4)*(.6+.4*Math.sin(t*1.3+j)));}}
  BZ.flush(g,d,COLS2,AL2,SZ2,szZ);},
 bloom(sc){const c=sc.c;return[.5*Math.pow(c,1.1),.62*Math.pow(c,1.3)];},
 glance:{Child:'Folded small under a huge dim mass. The shells close in tight round a small body.',Preteen:'The head turns and a beam sweeps dim watchers. The shells follow the turn.',Teen:'A leaning figure thrusts an arm at a big mass and throws sparks. The shells are dragged out along the arm.',
  Adult:'Upright and squared, the halves a hair apart at the waist. A seam of tension and a file rising beside it, inside even shells.',Ideological:'A tall rigid figure in a fixed lattice. The shells stand round it like a casing and do not move in.'}};
