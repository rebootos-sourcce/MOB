/* THE BODY, SAMPLED. The person is a volume of points: each is a place on one of the figure's twenty segments,
   given once, so a pose moves all of them and a frame never searches. A point keeps the place it had on the rest
   figure (s0, its seat position, 0 at the feet and 6 at the crown) so its colour follows the body part and not
   the posture: a head that is folded down into a Child is still violet. */
const MOTV=[ /* what a loose point of each pattern does, over one cycle of its own period */
 {per:2.4,v:(x,y)=>[-x*.4,-y*.2]},{per:2.2,v:(x,y,r)=>[Math.sin(r*40)*.1,-.45-.5*r]},{per:5.2,v:(x,y)=>[-x*.15,.4]},
 {per:3.4,v:(x,y)=>[(x<0?-1:1)*.34,.03]},{per:9,v:(x,y)=>[0,.08]},{per:1.6,v:(x,y)=>[x*1.3+.05,(y+.3)*1.1]},
 {per:4.2,v:(x,y,r)=>[0,.5+.4*r]},{per:3,v:(x,y)=>[x*.8,(y+.4)*.5]},{per:3.2,v:(x,y)=>[.26,-.36]}];
function bodySample(N,seed){
 const F=buildFig(REST),rnd=rng(seed||21),C=F.caps;
 const ar=C.map(c=>{if(c.disc)return Math.PI*c.ra*c.rb;const l=Math.hypot(c.bx-c.ax,c.by-c.ay);return l*(c.ra+c.rb)+Math.PI*(c.ra*c.ra+c.rb*c.rb)*.5;});
 const tot=ar.reduce((a,b)=>a+b,0);
 const A={n:0,cap:new Int16Array(N),u:new Float32Array(N),o:new Float32Array(N),lum:new Float32Array(N),s0:new Float32Array(N),jit:new Float32Array(N),ig:new Float32Array(N),
  pat:new Int8Array(N),keep:new Float32Array(N),del:new Float32Array(N),mv:new Uint8Array(N),dvx:new Float32Array(N),dvy:new Float32Array(N),
  sx:new Float32Array(N),sy:new Float32Array(N),ph:new Float32Array(N)};
 const L3=[-.5,-.6,.62],ln=Math.hypot(L3[0],L3[1],L3[2]);const Ld=L3.map(v=>v/ln);
 let n=0;
 for(let ci=0;ci<C.length;ci++){const c=C[ci];const cnt=ci===C.length-1?N-n:Math.round(N*ar[ci]/tot);
  for(let j=0;j<cnt&&n<N;j++,n++){
   let u,o,x,y,nx=0,ny=0,z;const edge=rnd()<.2;
   if(c.disc){const th=rnd()*6.283,rho=edge?.9+.1*rnd():Math.sqrt(rnd())*.95;u=th;o=rho;
    const lx=Math.cos(th)*rho,ly=Math.sin(th)*rho;nx=lx;ny=ly;z=Math.sqrt(Math.max(0,1-rho*rho));
    const ca=Math.cos(c.rot),sa=Math.sin(c.rot);x=c.ax+(lx*ca*c.ra-ly*sa*c.rb);y=c.ay+(lx*sa*c.ra+ly*ca*c.rb);}
   else{u=rnd();o=edge?(rnd()<.5?-1:1)*(.9+.1*rnd()):(rnd()*2-1)*.95;
    const dx=c.bx-c.ax,dy=c.by-c.ay,l=Math.hypot(dx,dy)||1;const rx=-dy/l,ry=dx/l;const r=c.ra+(c.rb-c.ra)*u;
    x=c.ax+dx*u+rx*o*r;y=c.ay+dy*u+ry*o*r;nx=rx*o;ny=ry*o;z=Math.sqrt(Math.max(0,1-o*o));}
   const dot=nx*Ld[0]+ny*Ld[1]+z*Ld[2];
   A.cap[n]=ci;A.u[n]=u;A.o[n]=o;
   A.lum[n]=clamp(.28+.72*clamp(.3+.7*dot,0,1),0,1)*(edge?1.18:1);
   A.s0[n]=seatF(y);A.jit[n]=rnd()+rnd()-1;A.ig[n]=rnd();
   /* the pattern is the one whose place on the body this is, drawn by chance in proportion to its claim */
   const af=affs(x,y);let s=0;const wt=af.map(v=>{const q=v*v+.002;s+=q;return q;});let r=rnd()*s,p=0;for(;p<8;p++){r-=wt[p];if(r<=0)break;}
   A.pat[n]=p;A.keep[n]=rnd();A.del[n]=rnd()*.55;A.ph[n]=rnd();
   const mvp=rnd()<.065;A.mv[n]=mvp?1:0;if(mvp){const m=MOTV[p].v(x,y,rnd());A.dvx[n]=m[0]*(.6+rnd()*.7);A.dvy[n]=m[1]*(.6+rnd()*.7);}
   const a=rnd()*6.283,d=.5+rnd()*1.0;A.sx[n]=Math.cos(a)*d*.9;A.sy[n]=Math.sin(a)*d*1.1;}}
 A.n=n;return A;}
/* the per segment frame, once per frame: the direction along it and the normal to it */
function segFrames(C){return C.map(c=>{if(c.disc)return null;const dx=c.bx-c.ax,dy=c.by-c.ay,l=Math.hypot(dx,dy)||1;return{dx,dy,nx:-dy/l,ny:dx/l};});}
/* where point i is now, in figure units. kc pulls it toward its segment's axis: that is what compressed looks like.
   everything a pattern adds (the loose points that drift off, the tremble of Fear) is added here, and the arrival
   scatter, so a page opens as a gathering. */
const _xy=[0,0];
function bodyXY(sc,A,C,cp,i,kc,intro){
 const c=C[A.cap[i]];let x,y;
 if(c.disc){const th=A.u[i],rho=A.o[i]*kc,lx=Math.cos(th)*rho,ly=Math.sin(th)*rho,ca=Math.cos(c.rot),sa=Math.sin(c.rot);
  x=c.ax+(lx*ca*c.ra-ly*sa*c.rb);y=c.ay+(lx*sa*c.ra+ly*ca*c.rb);}
 else{const q=cp[A.cap[i]],u=A.u[i],r=(c.ra+(c.rb-c.ra)*u)*kc;x=c.ax+q.dx*u+q.nx*A.o[i]*r;y=c.ay+q.dy*u+q.ny*A.o[i]*r;}
 const t=sc.t,p=A.pat[i],pcq=sc.pc[p];_xy[2]=1;
 if(A.mv[i]){const per=MOTV[p].per,f=((t/per)+A.ph[i])%1;const amp=Math.pow(pcq,1.2);x+=A.dvx[i]*f*amp;y+=A.dvy[i]*f*amp;
  _xy[2]=Math.pow(Math.sin(f*Math.PI),.8)*1.5*Math.min(1,.2+amp*1.2);}
 x+=Math.sin(t*.9+i*.37)*.0035;y+=Math.cos(t*.8+i*.53)*.0035;
 if(sc.lead===0&&pcq>.2)x+=Math.sin(t*37+i*1.7)*.004*pcq;      /* Fear trembles */
 if(intro){const e=sstep(0,1.15,t-A.del[i]);x=A.sx[i]+(x-A.sx[i])*e;y=A.sy[i]+(y-A.sy[i])*e;_xy[2]*=.8+.2*e;}
 _xy[0]=x;_xy[1]=y;return _xy;}
/* the light table: litAt over a range, so a frame does one lookup per point and not a pow */
const LT=new Float32Array(65);for(let i=0;i<=64;i++){LT[i]=Math.pow(sstep(-.7,.9,-.7+1.6*i/64),1.4);}
const litQ=z=>{const q=(z+.7)*(64/1.6);return LT[q<0?0:q>64?64:(q|0)];};
