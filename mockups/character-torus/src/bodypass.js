/* THE MASK CLOUD. The same dense cloud as Orbit, bent by the load, but now two things decide where it is dense and how bright.
   COHERENCE sets how much light the whole cloud gives, from a dim silhouette at nothing up to full.
   THE STORIES set where: every point of the cloud looks up how much charge the addresses near it carry, in a map of the body made
   from the 112 addresses each frame. A region with heavy addresses is dense and bright, a region with none thins to a quarter. Write
   a story that lands on the Solar seat and the Solar region fills in.
   Engine data that feeds it: the per address charge, NODES[i].sq, which compute() writes from the channel charges (S.charge) and the
   seat's integrity, and which the sniffer writes the channel charges for, out of the entries (sniffStory then applyStory). */
const NHB=16,NLB=6,ALB=[.1,.2,.36,.56,.78,.95],WHB=[0,0,.04,.12,.24,.4],SZB=[.85,.95,1.05,1.15,1.28,1.45];
const RBASE=(()=>{const a=[];for(let h=0;h<NHB;h++)a.push(h<9?mixc([178,186,202],PCOL[h],.4):mixc(EMBER,specAt(h-9),.85));return a;})();
const COLSB=RBASE.map(base=>WHB.map(w=>css(mixc(base,INK,w),1)));
const CMW=26,CMH=46,CMX0=-.65,CMY0=-1.2,CMS=20;   /* the charge map of the body: 26 by 46 cells of 0.05 */
function restXY(A,C,cp,i,o){const c=C[A.cap[i]];
 if(c.disc){const th=A.u[i],rho=A.o[i],lx=Math.cos(th)*rho,ly=Math.sin(th)*rho,ca=Math.cos(c.rot),sa=Math.sin(c.rot);o[0]=c.ax+(lx*ca*c.ra-ly*sa*c.rb);o[1]=c.ay+(lx*sa*c.ra+ly*ca*c.rb);}
 else{const q=cp[A.cap[i]],u=A.u[i],r=c.ra+(c.rb-c.ra)*u;o[0]=c.ax+q.dx*u+q.nx*A.o[i]*r;o[1]=c.ay+q.dy*u+q.ny*A.o[i]*r;}}
function bodyInit(sc){const l=sc.lineup,s=sc.small,N=l?2800:s?4600:9000,A=sc.mem.A=bodySample(N,21);sc.mem.B=new Batch(N,NHB,NLB);
 const F=buildFig(REST),C=F.caps,cp=segFrames(C),o=[0,0];A.rx=new Float32Array(N);A.ry=new Float32Array(N);A.sc7=new Uint8Array(N);
 for(let i=0;i<N;i++){restXY(A,C,cp,i,o);A.rx[i]=o[0];A.ry[i]=o[1];const r=Math.round(A.s0[i]);A.sc7[i]=r<0?0:r>6?6:r;}
 sc.mem.CM=new Float32Array(CMW*CMH);sc.air=new Air();sc.mem.DA=new Batch(120,NBIN,5);worldInit(sc);}
/* the charge map: every somatic address splats a soft bump at its place on the body, as tall as its charge */
function buildCM(sc){const M=sc.mem.CM;M.fill(0);
 for(let j=0;j<112;j++){const a=ADDR[j];if(a.fld)continue;const ch=sc.ach[j];if(ch<.01)continue;
  const sy=a.seat===0?.16:.075,sx=.1,cxn=(a.ax-CMX0)*CMS,cyn=(a.yr-CMY0)*CMS,rx=Math.ceil(2.6*sx*CMS),ry=Math.ceil(2.6*sy*CMS);
  const ix=cxn|0,iy=cyn|0;
  for(let y=iy-ry;y<=iy+ry;y++){if(y<0||y>=CMH)continue;const dy=((y+.5)-cyn)/(sy*CMS);
   for(let x=ix-rx;x<=ix+rx;x++){if(x<0||x>=CMW)continue;const dx=((x+.5)-cxn)/(sx*CMS);M[y*CMW+x]+=ch*Math.exp(-dx*dx-dy*dy);}}}
 for(let i=0;i<M.length;i++){const v=M[i]*.55;M[i]=v>1.25?1.25:v;}}
function cmAt(sc,x,y){const M=sc.mem.CM;let fx=(x-CMX0)*CMS-.5,fy=(y-CMY0)*CMS-.5;if(fx<0)fx=0;if(fy<0)fy=0;if(fx>CMW-1.001)fx=CMW-1.001;if(fy>CMH-1.001)fy=CMH-1.001;
 const ix=fx|0,iy=fy|0,ux=fx-ix,uy=fy-iy,o=iy*CMW+ix;return(M[o]*(1-ux)+M[o+1]*ux)*(1-uy)+(M[o+CMW]*(1-ux)+M[o+CMW+1]*ux)*uy;}
/* the world a mask lives in, coloured from the air */
function airWorld(sc){return{k:.12+.88*Math.pow(sc.c,1.1),col:(role,y,lit,x)=>{const rgb=sc.air.rgbAt(x===undefined?.6:x,y);let col=mixc(EMBER,rgb,.3+.7*sc.c);
  if(role==='mass'||role==='lat')col=mixc(EMBER,col,.4);return lit?mixc(col,INK,lit*.55):col;}};}
function drawBody(sc,ss){const g=sc.g,A=sc.mem.A,B=sc.mem.B,air=sc.air,d=sc.dpr,t=sc.t,F=sc.fig,C=F.caps,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c;
 const cp=segFrames(C),lp=sc.lead,M=MASKS.find(x=>x.nm===sc.mask),beat=.5+.5*Math.sin(Math.PI*2*t/M.per);
 buildCM(sc);
 const lit=[0,1,2,3,4,5,6].map(i=>sstep(.04+.035*i,.55+.04*i,c)),vis=.7+.3*sstep(0,.5,c),kc=lerp(.72,1,sstep(0,.7,c)),intro=t<2.2;
 /* the light of the cloud. at coherence nothing it is a dim silhouette, about thirteen percent, and not black. */
 const gain=(.13+.9*Math.pow(c,.9))*Math.min(1,F.scale**1.6),szB=(sc.lineup?1.25:sc.mobile?1.3:1.5)*(1+.14*sstep(0,.9,c));
 const doAir=MANUAL||!((sc.af=(sc.af|0)+1)&1);if(doAir)air.clear();
 const sel=sc.sel,hov=sc.hov;B.reset();
 for(let i=0;i<A.n;i++){const rk=A.sc7[i];
  const q=cmAt(sc,A.rx[i],A.ry[i]),thr=(.55+.45*sstep(0,.8,q))*vis;if(A.keep[i]>thr)continue;
  const p=A.pat[i],xy=bodyXY(sc,A,C,cp,i,kc,intro),qx=xy[0],qy=xy[1],x=cx+qx*k,y=cy+qy*k,s0=A.s0[i];
  let sf=1;if(sel>=0)sf=rk===sel?1.12:.3;else if(hov>=0)sf=rk===hov?1.15:.85;
  let b=gain*A.lum[i]*(.6+.8*Math.pow(q,.8))*sf*(p===lp?.9+.2*beat:1)*xy[2]*(1+.12*Math.sin(t*(.9+A.ph[i]*1.4)+i)),h=p;
  const rj=Math.round(s0),dk=Math.abs(s0-rj);
  if(rj>=1&&dk<.2){const bl=(1-dk/.2)*lit[rj];if(bl>.08){b+=bl*.45*A.lum[i];if(bl>.3)h=9+rj;}}
  let l=(b*NLB*.95)|0;if(l>=NLB)l=NLB-1;if(l<0)l=0;B.add(x,y,h,l,1);sc.regB(x,y,rk);
  if(doAir&&!(i&3)){const rb=RBASE[h],w=b>1?1:b*1.1;air.splat(qx,qy,rb[0],rb[1],rb[2],w);}}
 B.flush(g,d,COLSB,ALB,SZB,szB);
 if(doAir){air.ambient(c);air.finish(1.6);}
 drawWorld(sc,airWorld(sc));}
