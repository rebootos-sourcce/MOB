/* SYSTEM A, AURA. The person is a lit volume of points. A mask bends the body into its own
   posture and sets a symbol round it, in the same material: Child folds small under a looming
   mass, Preteen turns and sweeps a beam across watchers, Teen thrusts at a big mass and throws
   sparks, Ideological goes ramrod straight inside a fixed lattice while a stream goes round it.
   Points carry the pattern colour of the place on the body they sit on. Load is brightness. */
const NB=7,NG=4;
const MOTV=[ /* what a loose point of each pattern does, over one cycle of its own period */
 {per:2.4,v:(x,y)=>[-x*.4,-y*.2]},{per:2.2,v:(x,y,r)=>[Math.sin(r*40)*.1,-.45-.5*r]},{per:5.2,v:(x,y)=>[-x*.15,.4]},
 {per:3.4,v:(x,y)=>[(x<0?-1:1)*.34,.03]},{per:9,v:(x,y)=>[0,.08]},{per:1.6,v:(x,y)=>[x*1.3+.05,(y+.3)*1.1]},
 {per:4.2,v:(x,y,r)=>[0,.5+.4*r]},{per:3,v:(x,y)=>[x*.8,(y+.4)*.5]},{per:3.2,v:(x,y)=>[.26,-.36]}];
const SYS_A={id:'a-aura',name:'Aura',N:{d:11000,m:5200,l:3400},
 blurb:'The person is a lit volume of points, and the mask bends the body into its own posture. Colour is the pattern at that place on the body. Brightness is how loaded it is. At zero load it is a calm, cool figure.',
 init(sc){const N=sc.lineup?SYS_A.N.l:sc.small?SYS_A.N.m:SYS_A.N.d,F=buildFig(REST),rnd=rng(21),C=F.caps;
  const ar=C.map(c=>{if(c.disc)return Math.PI*c.ra*c.rb;const l=Math.hypot(c.bx-c.ax,c.by-c.ay);return l*(c.ra+c.rb)+Math.PI*(c.ra*c.ra+c.rb*c.rb)*.5;});
  const tot=ar.reduce((a,b)=>a+b,0);const A={n:0,cap:new Int16Array(N),u:new Float32Array(N),o:new Float32Array(N),lum:new Float32Array(N),
   pat:new Int8Array(N),keep:new Float32Array(N),del:new Float32Array(N),mv:new Uint8Array(N),dvx:new Float32Array(N),dvy:new Float32Array(N),
   sx:new Float32Array(N),sy:new Float32Array(N),grp:new Uint8Array(N),lvl:new Uint8Array(N),ph:new Float32Array(N)};
  const L3=[-.5,-.6,.62],ln=Math.hypot(L3[0],L3[1],L3[2]);const Ld=L3.map(v=>v/ln);
  let n=0;
  for(let ci=0;ci<C.length;ci++){const c=C[ci];const cnt=ci===C.length-1?N-n:Math.round(N*ar[ci]/tot);
   for(let j=0;j<cnt&&n<N;j++,n++){
    let u,o,x,y,nx=0,ny=0,z;
    const edge=rnd()<.2;
    if(c.disc){const th=rnd()*6.283,rho=edge?.9+.1*rnd():Math.sqrt(rnd())*.95;u=th;o=rho;
     const lx=Math.cos(th)*rho,ly=Math.sin(th)*rho;nx=lx;ny=ly;z=Math.sqrt(Math.max(0,1-rho*rho));
     const ca=Math.cos(c.rot),sa=Math.sin(c.rot);x=c.ax+(lx*ca*c.ra-ly*sa*c.rb);y=c.ay+(lx*sa*c.ra+ly*ca*c.rb);}
    else{u=rnd();o=edge?(rnd()<.5?-1:1)*(.9+.1*rnd()):(rnd()*2-1)*.95;
     const dx=c.bx-c.ax,dy=c.by-c.ay,l=Math.hypot(dx,dy)||1;const rx=-dy/l,ry=dx/l;const r=c.ra+(c.rb-c.ra)*u;
     x=c.ax+dx*u+rx*o*r;y=c.ay+dy*u+ry*o*r;nx=rx*o;ny=ry*o;z=Math.sqrt(Math.max(0,1-o*o));}
    const dot=nx*Ld[0]+ny*Ld[1]+z*Ld[2];
    A.cap[n]=ci;A.u[n]=u;A.o[n]=o;
    A.lum[n]=clamp(.28+.72*clamp(.3+.7*dot,0,1),0,1)*(edge?1.18:1);
    /* the pattern is the one whose place on the body this is, drawn by chance in proportion to its claim */
    const af=affs(x,y);let s=0;const wt=af.map(v=>{const q=v*v+.002;s+=q;return q;});let r=rnd()*s,p=0;for(;p<8;p++){r-=wt[p];if(r<=0)break;}
    A.pat[n]=p;A.keep[n]=rnd();A.del[n]=rnd()*.55;A.grp[n]=(rnd()*NG)|0;A.ph[n]=rnd();
    A.lvl[n]=Math.min(NB-1,Math.floor(A.lum[n]*NB*1.02));
    const mvp=rnd()<.065;A.mv[n]=mvp?1:0;if(mvp){const m=MOTV[p].v(x,y,rnd());A.dvx[n]=m[0]*(.6+rnd()*.7);A.dvy[n]=m[1]*(.6+rnd()*.7);}
    const a=rnd()*6.283,d=.5+rnd()*1.0;A.sx[n]=Math.cos(a)*d*.9;A.sy[n]=Math.sin(a)*d*1.1;}}
  A.n=n;
  /* sort into bins by pattern, level and group so one fill style covers many points */
  const key=i=>(A.pat[i]*NB+A.lvl[i])*NG+A.grp[i];const idx=Array.from({length:n},(_,i)=>i).sort((a,b)=>key(a)-key(b));
  A.order=Int32Array.from(idx);A.bins=[];let s0=0;for(let i=1;i<=n;i++){if(i===n||key(idx[i])!==key(idx[s0])){const k=idx[s0];A.bins.push({s:s0,e:i,p:A.pat[k],l:A.lvl[k],g:A.grp[k]});s0=i;}}
  sc.mem.A=A;
  /* the symbol round the body: fixed marks, drawn once */
  const r2=rng(77);
  sc.mem.mass=Array.from({length:230},()=>{const a=r2()*6.283,d=Math.sqrt(r2());return{a,d,s:r2(),v:r2()};});
  sc.mem.watch=[[-1.05,-.72],[-.82,-.38],[-1.12,-.1],[-.7,-.95],[-.9,.28],[.82,-.4],[1.05,-.75],[.72,-.97],[1.12,-.05],[.92,.3],[.4,-1.1],[-.42,-1.12]];
  sc.mem.lat=[];for(let r=-7;r<=7;r++)for(let c=-4;c<=4;c++){const x=c*.145+(r&1?.0725:0),y=r*.148;if(Math.abs(x)<.62&&Math.abs(y)<1.05)sc.mem.lat.push([x,y]);}
  sc.mem.strm=Array.from({length:60},(_,i)=>({x:(r2()*2-1)*1.35,off:r2(),sp:.09+r2()*.1,wob:r2()*6.28,p:(i%5)+0}));
 },
 draw(sc){const g=sc.g,A=sc.mem.A,d=sc.dpr,t=sc.t,F=sc.fig,C=F.caps,k=sc.k,cx=sc.cx,cy=sc.cy;
  const mm=Math.pow(sc.m,.8)*sc.fade;
  SYS_A.back(sc,mm);
  /* the light that pools in the body, one soft patch per pattern, earned by its charge */
  const lp=sc.lead,beat=.5+.5*Math.sin(Math.PI*2*t/MASKS.find(x=>x.nm===sc.mask).per);
  for(let p=0;p<9;p++){const c=sc.pc[p];if(c<.1)continue;const f=PFIELD[p];const y=f.y>.04?.5:f.y;
   const ox=cx+f.x*k*.8,oy=cy+(p===0?.45:f.y)*k,rr=k*(.34+.22*c);const pulse=p===lp?.75+.5*beat:1;
   sc.glow(ox,oy,rr,PCOL[p],.17*c*sc.pa(p)*pulse*sc.fade);}
  /* the points */
  const cp=C.map(c=>{if(c.disc)return null;const dx=c.bx-c.ax,dy=c.by-c.ay,l=Math.hypot(dx,dy)||1;return{dx,dy,nx:-dy/l,ny:dx/l};});
  const sz=sc.lineup?1.25:Math.max(1.1,(sc.mobile?1.3:1.5));
  const thr=sc.pc.map(q=>.5+.5*Math.pow(q,.6));
  const intro=t<2.2;
  const px=new Float32Array(2);
  for(const b of A.bins){const p=b.p,l=b.l;
   let a=(.18+.82*Math.pow((l+1)/NB,1.1))*sc.bright(p)*sc.pa(p)*sc.fade;
   a*=1+.12*Math.sin(t*1.2+b.g*1.6+l);
   if(p===lp)a*=.85+.3*beat;
   if(a<.012)continue;
   const col=sc.rgb(p,.03+.3*(l/(NB-1))*(l/(NB-1)));g.fillStyle='rgb('+(col[0]|0)+','+(col[1]|0)+','+(col[2]|0)+')';
   const s=sz*(1+.5*l/(NB-1)),tp=thr[p],pcq=sc.pc[p];const mper=MOTV[p].per;
   for(let j=b.s;j<b.e;j++){const i=A.order[j];if(A.keep[i]>tp)continue;
    const c=C[A.cap[i]];let x,y;
    if(c.disc){const th=A.u[i],rho=A.o[i],lx=Math.cos(th)*rho,ly=Math.sin(th)*rho,ca=Math.cos(c.rot),sa=Math.sin(c.rot);
     x=c.ax+(lx*ca*c.ra-ly*sa*c.rb);y=c.ay+(lx*sa*c.ra+ly*ca*c.rb);}
    else{const q=cp[A.cap[i]],u=A.u[i],r=c.ra+(c.rb-c.ra)*u;x=c.ax+q.dx*u+q.nx*A.o[i]*r;y=c.ay+q.dy*u+q.ny*A.o[i]*r;}
    let aa=a;
    if(A.mv[i]){const f=((t/mper)+A.ph[i])%1;const amp=Math.pow(pcq,1.2);x+=A.dvx[i]*f*amp;y+=A.dvy[i]*f*amp;aa*=Math.pow(Math.sin(f*Math.PI),.8)*1.5*Math.min(1,.2+amp*1.2);}
    x+=Math.sin(t*.9+i*.37)*.0035;y+=Math.cos(t*.8+i*.53)*.0035;
    if(sc.lead===0&&pcq>.2){x+=Math.sin(t*37+i*1.7)*.004*pcq;}
    if(intro){const e=sstep(0,1.15,t-A.del[i]);x=A.sx[i]+(x-A.sx[i])*e;y=A.sy[i]+(y-A.sy[i])*e;aa*=.8+.2*e;}
    /* the scan of the ideological mask lights what it crosses, and changes nothing */
    if(sc.mask==='Ideological'&&sc.m>.05){const sy=-1.05+((t/7.2)%1)*2.1;aa*=1+1.6*Math.exp(-Math.pow((y-sy)/.05,2))*sc.m;}
    g.globalAlpha=aa>1?1:aa;const X=cx+x*k,Y=cy+y*k;g.fillRect((X-s/2)*d,(Y-s/2)*d,s*d,s*d);
    sc.reg(X,Y,p);}}
  g.globalAlpha=1;
  SYS_A.front(sc,mm);},
 /* behind the person: the thing the mask is held against */
 back(sc,mm){const g=sc.g,t=sc.t,k=sc.k,cx=sc.cx,cy=sc.cy,d=sc.dpr,nm=sc.mask;if(mm<.02)return;
  const neutral=[198,192,186],M=sc.mem;
  if(nm==='Child'){
   /* the one who decides: a huge dim mass above, slow, and a few lines of points drawn up toward it */
   const ox=cx+Math.sin(t*.07)*.08*k,oy=cy-.72*k+Math.sin(t*.11)*.03*k;
   sc.glow(ox,oy,1.3*k,neutral,.26*mm);
   for(let i=0;i<5;i++){const a=t*.05+i*1.26;sc.glow(ox+Math.cos(a)*.55*k,oy+Math.sin(a)*.2*k-.05*k,.42*k,neutral,.1*mm);}
   M.mass.forEach((q,i)=>{const e=sstep(0,1.2,sc.t-.2-q.s*.5);const rx=.95*q.d*Math.cos(q.a+t*.03*(.5+q.v)),ry=.42*q.d*Math.sin(q.a+t*.03*(.5+q.v));
    sc.dot(ox+rx*k,oy+ry*k,1.6,neutral,.4*mm*e*(.5+.5*q.v));});
   const hd=sc.fig.J.head;
   for(let th=0;th<5;th++){const x0=cx+hd[0]*k+(th-2)*.045*k;for(let j=0;j<9;j++){const u=((t*.16+th*.21+j*.045)%1);
    const y=cy+hd[1]*k-u*(cy+hd[1]*k-(oy+.2*k)),x=x0+Math.sin(u*5+th)*.05*k*u;const col=sc.rgb(th%2?0:2,.2);
    sc.dot(x,y,1.5,col,mm*(1-u)*.5*sc.pa(th%2?0:2)*Math.sin(Math.min(1,u*8)*1.57));}}
  }else if(nm==='Preteen'){
   /* the room: dim watchers, and a beam from the head that sweeps across them at the mask's own tempo */
   const hd=sc.fig.J.head,hx_=cx+hd[0]*k,hy_=cy+hd[1]*k,ph=(t/3)%1;
   const T=[1.1*Math.sin(Math.PI*2*ph)*1.0,-.55+.3*Math.cos(Math.PI*4*ph+.8)];
   const tx=cx+T[0]*k,ty=cy+T[1]*k;
   const ang=Math.atan2(ty-hy_,tx-hx_),len=Math.hypot(tx-hx_,ty-hy_)*1.25,half=.2;
   const col=mixc(sc.rgb(1,.2),sc.rgb(4,.2),.5);
   g.save();g.globalAlpha=.24*mm;const gr=g.createLinearGradient(hx_*d,hy_*d,tx*d,ty*d);gr.addColorStop(0,css(col,.55));gr.addColorStop(1,css(col,0));
   g.fillStyle=gr;g.beginPath();g.moveTo(hx_*d,hy_*d);g.lineTo((hx_+Math.cos(ang-half)*len)*d,(hy_+Math.sin(ang-half)*len)*d);g.lineTo((hx_+Math.cos(ang+half)*len)*d,(hy_+Math.sin(ang+half)*len)*d);g.closePath();g.fill();g.restore();
   for(const sg of[-1,1])for(let j=0;j<26;j++){const u=j/26,r=u*len;sc.dot(hx_+Math.cos(ang+sg*half)*r,hy_+Math.sin(ang+sg*half)*r,1.6,col,mm*.6*(1-u));}
   M.watch.forEach((w,i)=>{const e=sstep(0,1.2,t-.3-hash(i,5)*.6);const wx=cx+(w[0]+Math.sin(t*.21+i)*.015)*k,wy=cy+(w[1]+Math.cos(t*.17+i*2)*.015)*k;
    const dd=Math.hypot(w[0]-T[0],w[1]-T[1]);const lit=Math.exp(-dd*dd/.09);const pi=i%2?1:4;
    const c=sc.rgb(pi,.15+.5*lit);sc.glow(wx,wy,(.07+.08*lit)*k,c,(.3+.6*lit)*mm*e*sc.pa(pi));sc.dot(wx,wy,2.8+2.4*lit,c,(.7+.3*lit)*mm*e*sc.pa(pi));sc.reg(wx,wy,pi);});
  }else if(nm==='Teen'){
   /* the person it pushes at: a big mass that takes the blow, and the problem, small and dim, left alone */
   const th=saw((t/1.8)%1),u=(t/1.8)%1;const kick=u>.18?Math.exp(-(u-.18)*5):0;
   const mxu=-Math.min(1.22,(cx-10)/k-.42);const mx=cx+(mxu+.04*Math.sin(t*.3))*k,my=cy-.08*k;
   sc.glow(mx,my,.85*k,neutral,.18*mm);
   M.mass.forEach((q,i)=>{const e=sstep(0,1.2,sc.t-.2-q.s*.5);const rx=.42*q.d*Math.cos(q.a),ry=.46*q.d*Math.sin(q.a);
    const near=Math.exp(-Math.pow((rx*k-(.34*k))/(.3*k),2));const dx=-kick*.07*near*k;
    sc.dot(mx+rx*k+dx+Math.sin(t*.8+i)*.8,my+ry*k,1.8,neutral,.5*mm*e*(.5+.5*q.v));});
   const hL=sc.fig.J.WL;const fx=cx+(hL[0]-.05)*k,fy=cy+hL[1]*k;
   const col=sc.rgb(4,.35);
   if(u>.16&&u<.8){const tau=(u-.16)*1.8;for(let j=0;j<34;j++){const a=Math.PI*(.55+.9*hash(j,9))+(hash(j,4)-.5)*.3,sp=.25+.7*hash(j,6);
    const sx=fx+Math.cos(a)*sp*tau*k*1.4,sy=fy+Math.sin(a)*sp*tau*k*1.4+tau*tau*.35*k;const al=Math.exp(-tau*2.2);
    sc.dot(sx,sy,1.6+2*hash(j,7),col,al*mm);}
    sc.glow(fx,fy,.14*k,col,Math.exp(-(u-.16)*6)*.5*mm);}
   for(let q=0;q<3;q++)for(let r=0;r<2;r++){const e=sstep(0,1.2,t-.5);sc.dot(cx+(1.0+q*.05)*k,cy+(-.55+r*.05)*k,2,[150,158,174],.28*mm*e);}
  }else if(nm==='Ideological'){
   /* a fixed lattice behind a rigid body, a plumb line and a level, and the moment going round it */
   const col=sc.rgb(5,.1),e=sstep(0,1.3,t-.2);
   M.lat.forEach((q,i)=>{const sy=-1.05+((t/7.2)%1)*2.1;const lit=1+2.2*Math.exp(-Math.pow((q[1]-sy)/.06,2));
    sc.dot(cx+q[0]*k,cy+q[1]*k,2.2,col,.42*mm*e*lit);});
   for(let j=0;j<80;j++){const y=-1.12+j*.0275;sc.dot(cx,cy+y*k,1.2,col,.2*mm*e);}
   for(let j=0;j<48;j++){const x=-.7+j*.0292;sc.dot(cx+x*k,cy-.55*k,1.2,col,.16*mm*e);sc.dot(cx+x*k,cy+.52*k,1.2,col,.16*mm*e);}
   M.strm.forEach((q,i)=>{const u=(q.off+t*q.sp)%1,y=1.2-u*2.4;let x=q.x+Math.sin(t*.6+q.wob)*.02;
    const ax=Math.abs(x);if(ax<.58)x=Math.sign(x||1)*(ax+(.58-ax)*sstep(.0,.58,.58-ax)*1.0+.0);
    const c=sc.rgb((i*3+1)%9,.15);sc.dot(cx+x*k,cy+y*k,1.5,c,.4*mm*e*sc.pa((i*3+1)%9));
    for(let j=1;j<4;j++)sc.dot(cx+x*k,cy+(y+j*.03)*k,1.2,c,.4*mm*e*(1-j/4)*.6);sc.reg(cx+x*k,cy+y*k,(i*3+1)%9);});
  }},
 front(sc,mm){},
 glance:{Child:'A small folded figure under a huge dim mass. Smaller and lower is heavier.',Preteen:'The head turns and a beam sweeps dim watchers. The beam is the checking.',Teen:'A leaning figure thrusts an arm at a big mass and throws sparks. A small dim thing off to the side is ignored.',Ideological:'A tall rigid figure inside a fixed lattice, with a stream going round it and never in.'},
 glyph:{ /* small ring marks, one per mask, drawn in the mask's own gradient */
  Child:'<circle cx="16" cy="9.5" r="6.6" stroke-dasharray="1.6 2.4"/><circle cx="16" cy="22" r="2.6"/><circle cx="12" cy="24.6" r="1.2"/><circle cx="20" cy="24.6" r="1.2"/>',
  Preteen:'<path d="M16 25 L7 8 M16 25 L25 8 M7 8 Q16 3.5 25 8"/><circle cx="16" cy="25.6" r="2"/><circle cx="10.5" cy="10.5" r="1.1"/><circle cx="16" cy="8.5" r="1.1"/><circle cx="21.5" cy="10.5" r="1.1"/>',
  Teen:'<circle cx="9" cy="16" r="6.4" stroke-dasharray="1.6 2.4"/><circle cx="23" cy="16" r="2.4"/><path d="M19.5 16H15.6M18 12.5l-2.2 1.6M18 19.5l-2.2-1.6"/>',
  Ideological:'<path d="M16 4v24M6 16h20"/><circle cx="11" cy="10" r="1.2"/><circle cx="21" cy="10" r="1.2"/><circle cx="11" cy="22" r="1.2"/><circle cx="21" cy="22" r="1.2"/><circle cx="16" cy="16" r="1.6"/>'}};
