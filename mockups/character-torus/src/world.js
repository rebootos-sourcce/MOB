/* THE WORLD A MASK LIVES IN. Each mask is a posture and a thing it is held against, and both are drawn in
   points. Child: a huge dim mass above and threads drawn up to it. Preteen: dim watchers and a beam sweeping
   them. Teen: a big mass that takes the blow and sparks. Adult: a seam where the halves join and a file of
   ledger lines rising beside it. Ideological: a fixed lattice, a plumb line, and the moment going round.
   The drawing is shared by the three treatments. What differs is the light, which each one supplies:
     o.col(role, yFig, lit) returns the rgb a thing of that role takes at that height
     o.k scales how bright the world is                                                                */
function worldInit(sc){const r2=rng(77),M=sc.mem;
 M.mass=Array.from({length:230},()=>{const a=r2()*6.283,d=Math.sqrt(r2());return{a,d,s:r2(),v:r2()};});
 M.watch=[[-1.05,-.72],[-.82,-.38],[-1.12,-.1],[-.7,-.95],[-.9,.28],[.82,-.4],[1.05,-.75],[.72,-.97],[1.12,-.05],[.92,.3],[.4,-1.1],[-.42,-1.12]];
 M.lat=[];for(let r=-7;r<=7;r++)for(let c=-4;c<=4;c++){const x=c*.145+(r&1?.0725:0),y=r*.148;if(Math.abs(x)<.62&&Math.abs(y)<1.05)M.lat.push([x,y]);}
 M.strm=Array.from({length:60},(_,i)=>({x:(r2()*2-1)*1.35,off:r2(),sp:.09+r2()*.1,wob:r2()*6.28,p:(i%5)+0}));
 /* the file: seven ledger lines, each a different length, so the stack reads as a record and not a ladder */
 M.file=Array.from({length:8},(_,i)=>({w:.1+.1*hash(i,11),n:7+((hash(i,12)*6)|0)}));}
function drawWorld(sc,o){const g=sc.g,t=sc.t,k=sc.k,cx=sc.cx,cy=sc.cy,d=sc.dpr,nm=sc.mask,M=sc.mem;
 const mm=Math.pow(sc.m,.8)*sc.fade*(o.k===undefined?1:o.k);if(mm<.02)return;
 const yF=py=>(py-cy)/k;
 if(nm==='Child'){
  /* the one who decides: a huge dim mass above, slow, and a few lines of points drawn up toward it */
  const ox=cx+Math.sin(t*.07)*.08*k,oy=cy-.72*k+Math.sin(t*.11)*.03*k,nc=o.col('mass',-.72,0,(ox-cx)/k);
  sc.glow(ox,oy,1.3*k,nc,.26*mm);
  for(let i=0;i<5;i++){const a=t*.05+i*1.26;sc.glow(ox+Math.cos(a)*.55*k,oy+Math.sin(a)*.2*k-.05*k,.42*k,nc,.1*mm);}
  M.mass.forEach((q,i)=>{const e=sstep(0,1.2,sc.t-.2-q.s*.5);const rx=.95*q.d*Math.cos(q.a+t*.03*(.5+q.v)),ry=.42*q.d*Math.sin(q.a+t*.03*(.5+q.v));
   sc.dot(ox+rx*k,oy+ry*k,1.6,nc,.4*mm*e*(.5+.5*q.v));});
  const hd=sc.fig.J.head;
  for(let th=0;th<5;th++){const x0=cx+hd[0]*k+(th-2)*.045*k;for(let j=0;j<9;j++){const u=((t*.16+th*.21+j*.045)%1);
   const y=cy+hd[1]*k-u*(cy+hd[1]*k-(oy+.2*k)),x=x0+Math.sin(u*5+th)*.05*k*u;const col=o.col('thread',yF(y),.2);
   sc.dot(x,y,1.5,col,mm*(1-u)*.5*sc.pa(th%2?0:2)*Math.sin(Math.min(1,u*8)*1.57));}}
 }else if(nm==='Preteen'){
  /* the room: dim watchers, and a beam from the head that sweeps across them at the mask's own tempo */
  const hd=sc.fig.J.head,hx_=cx+hd[0]*k,hy_=cy+hd[1]*k,ph=(t/3.3)%1;
  const T=[1.1*Math.sin(Math.PI*2*ph),-.55+.3*Math.cos(Math.PI*4*ph+.8)];
  const tx=cx+T[0]*k,ty=cy+T[1]*k;
  const ang=Math.atan2(ty-hy_,tx-hx_),len=Math.hypot(tx-hx_,ty-hy_)*1.25,half=.2;
  const col=o.col('beam',hd[1],.2,hd[0]+.3);
  g.save();g.globalAlpha=.24*mm;const gr=g.createLinearGradient(hx_*d,hy_*d,tx*d,ty*d);gr.addColorStop(0,css(col,.55));gr.addColorStop(1,css(col,0));
  g.fillStyle=gr;g.beginPath();g.moveTo(hx_*d,hy_*d);g.lineTo((hx_+Math.cos(ang-half)*len)*d,(hy_+Math.sin(ang-half)*len)*d);g.lineTo((hx_+Math.cos(ang+half)*len)*d,(hy_+Math.sin(ang+half)*len)*d);g.closePath();g.fill();g.restore();
  for(const sg of[-1,1])for(let j=0;j<26;j++){const u=j/26,r=u*len;sc.dot(hx_+Math.cos(ang+sg*half)*r,hy_+Math.sin(ang+sg*half)*r,1.6,col,mm*.6*(1-u));}
  M.watch.forEach((w,i)=>{const e=sstep(0,1.2,t-.3-hash(i,5)*.6);const wx=cx+(w[0]+Math.sin(t*.21+i)*.015)*k,wy=cy+(w[1]+Math.cos(t*.17+i*2)*.015)*k;
   const dd=Math.hypot(w[0]-T[0],w[1]-T[1]);const lit=Math.exp(-dd*dd/.09);const pi=i%2?1:4;
   const c=o.col('watch',w[1],lit,w[0]);sc.glow(wx,wy,(.07+.08*lit)*k,c,(.3+.6*lit)*mm*e*sc.pa(pi));sc.dot(wx,wy,2.8+2.4*lit,c,(.7+.3*lit)*mm*e*sc.pa(pi));sc.reg(wx,wy,pi);});
 }else if(nm==='Teen'){
  /* the person it pushes at: a big mass that takes the blow, and the problem, small and dim, left alone */
  const u=(t/1.8)%1;const kick=u>.18?Math.exp(-(u-.18)*5):0;
  const mxu=-Math.min(1.22,(cx-10)/k-.42);const mx=cx+(mxu+.04*Math.sin(t*.3))*k,my=cy-.08*k;const nc=o.col('mass',-.08,0,mxu);
  sc.glow(mx,my,.85*k,nc,.18*mm);
  M.mass.forEach((q,i)=>{const e=sstep(0,1.2,sc.t-.2-q.s*.5);const rx=.42*q.d*Math.cos(q.a),ry=.46*q.d*Math.sin(q.a);
   const near=Math.exp(-Math.pow((rx*k-(.34*k))/(.3*k),2));const dx=-kick*.07*near*k;
   sc.dot(mx+rx*k+dx+Math.sin(t*.8+i)*.8,my+ry*k,1.8,nc,.5*mm*e*(.5+.5*q.v));});
  const hL=sc.fig.J.WL;const fx=cx+(hL[0]-.05)*k,fy=cy+hL[1]*k;
  const col=o.col('spark',hL[1],.35);
  if(u>.16&&u<.8){const tau=(u-.16)*1.8;for(let j=0;j<34;j++){const a=Math.PI*(.55+.9*hash(j,9))+(hash(j,4)-.5)*.3,sp=.25+.7*hash(j,6);
   const sx=fx+Math.cos(a)*sp*tau*k*1.4,sy=fy+Math.sin(a)*sp*tau*k*1.4+tau*tau*.35*k;const al=Math.exp(-tau*2.2);
   sc.dot(sx,sy,1.6+2*hash(j,7),o.col('spark',yF(sy),.35),al*mm);}
   sc.glow(fx,fy,.14*k,col,Math.exp(-(u-.16)*6)*.5*mm);}
  for(let q=0;q<3;q++)for(let r=0;r<2;r++){const e=sstep(0,1.2,t-.5);sc.dot(cx+(1.0+q*.05)*k,cy+(-.55+r*.05)*k,2,EMBER,.28*mm*e);}
 }else if(nm==='Adult'){
  /* the seam, and the file. The two halves of the body are joined and the join shows: a line of points across
     the waist at the height the body actually parts, a slow pulse of tension going along it on the mask's own
     4.2 second beat. Beside it, the cost of having handled it is filed: ledger lines rise one at a time. */
  const J=sc.fig.J,sy=cy+J.m2[1]*k,sx=cx+J.m2[0]*k,e=sstep(0,1.3,t-.2),ph=(t/4.2)%1;
  const sh=sc.P.shear||0;
  for(let j=0;j<=64;j++){const u=j/64,x=(u*2-1)*.66;const pulse=Math.exp(-Math.pow((u-ph)/.07,2));
   const yy=J.m2[1]+(x>0?-.012:.012)*(.5+Math.min(1,Math.abs(sh)*4));   /* the two halves sit a hair apart */
   const col=o.col('seam',yy,.1+.5*pulse);
   sc.dot(cx+(J.m2[0]+x)*k,cy+yy*k,1.5+2.2*pulse,col,(.3+.7*pulse)*mm*e*(1-.5*Math.abs(u*2-1)));}
  sc.glow(sx+(ph*2-1)*.66*k,sy,.1*k,o.col('seam',J.m2[1],.5),.5*mm*e*sc.pa(2));
  const fx=cx+(J.m2[0]+.8)*k,fy0=J.m2[1]+.2;const nl=Math.max(2,Math.round(2+5*sc.m));
  for(let j=0;j<nl+1;j++){const f=(j+ph)/ (nl+.01);const yy=fy0-j*.085-ph*.085;const fade=(j===0?ph:1)*(j>=nl?1-ph:1)*Math.min(1,e);
   const L=M.file[j%M.file.length];const col=o.col('file',yy,.15+.4*(1-f));
   for(let q=0;q<L.n;q++){const u=q/(L.n-1);sc.dot(fx+(u-.5)*L.w*k*1.8,cy+yy*k,1.6,col,.55*mm*fade*(.6+.4*(1-f)));}}
  sc.reg(fx,cy+fy0*k,2);sc.reg(sx,sy,2);
 }else if(nm==='Ideological'){
  /* a fixed lattice behind a rigid body, a plumb line and a level, and the moment going round it */
  const e=sstep(0,1.3,t-.2);
  M.lat.forEach((q,i)=>{const sy=-1.05+((t/7.2)%1)*2.1;const lit=1+2.2*Math.exp(-Math.pow((q[1]-sy)/.06,2));
   sc.dot(cx+q[0]*k,cy+q[1]*k,2.2,o.col('lat',q[1],.1),.42*mm*e*lit);});
  for(let j=0;j<80;j++){const y=-1.12+j*.0275;sc.dot(cx,cy+y*k,1.2,o.col('lat',y,.1),.2*mm*e);}
  for(let j=0;j<48;j++){const x=-.7+j*.0292;sc.dot(cx+x*k,cy-.55*k,1.2,o.col('lat',-.55,.1),.16*mm*e);sc.dot(cx+x*k,cy+.52*k,1.2,o.col('lat',.52,.1),.16*mm*e);}
  M.strm.forEach((q,i)=>{const u=(q.off+t*q.sp)%1,y=1.2-u*2.4;let x=q.x+Math.sin(t*.6+q.wob)*.02;
   const ax=Math.abs(x);if(ax<.58)x=Math.sign(x||1)*(ax+(.58-ax)*sstep(.0,.58,.58-ax));
   const c=o.col('stream',y,.15);sc.dot(cx+x*k,cy+y*k,1.5,c,.4*mm*e*sc.pa((i*3+1)%9));
   for(let j=1;j<4;j++)sc.dot(cx+x*k,cy+(y+j*.03)*k,1.2,c,.4*mm*e*(1-j/4)*.6);sc.reg(cx+x*k,cy+y*k,(i*3+1)%9);});
 }}
