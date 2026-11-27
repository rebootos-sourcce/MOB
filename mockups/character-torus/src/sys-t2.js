/* TORUS 2, SLICES. One tube, and the seven seat rings are the slices of it: a ring at the height of each seat, bold, in the seat's
   colour taken half from the air, so each ring is a seat and each seat bends its own ring. The flow is thin loops through the rings.
   Where a seat is closed its ring is narrow, broken, dim and its beads stutter; where it is open and whole it swells. */
function drawSeatRings(sc,T,fr,o){const H=sc.HT,ss=sc.ss,S=sc.mem.S2,air=sc.air,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c,DB=o.DB,t=sc.t,dirn=sc.flow,psi=fr.psi,desync=Math.pow(1-c,.8),f=T.fc;
 for(let kk=0;kk<7;kk++){const Y=SEATGY[kk],R=fr.ring.find(r=>r&&r.Y===Y);if(!R)continue;const sh=ss.sh[kk],op=ss.open[kk];
  const rate=(.1+.28*c)*(1-.65*sh)*(dirn>0?1:-1),ph=frac(sc.acc('rb'+kk,rate)),off=hash(kk,4)*desync;
  let I=0;for(let p=0;p<3;p++){const hp=dirn>0?frac(psi+p/3+off):1-frac(psi+p/3+off),e=pulse(R.o,hp,dirn);if(e>I)I=e;}
  [1,-1].forEach(side=>{const nv=evalRing(sc,T,Y,side,S,12);if(!nv)return;const big=side>0;
   for(let v=0;v<nv;v++){const v2=v+1===nv?0:v+1,n=vnoise(v/nv*3+kk*1.7+side*4,t*.05+kk*.9),pm=sstep(n-.1,n+.1,f-.6*sh);if(pm<.03)continue;
    const mx=(S.X[v]+S.X[v2])*.5,my=(S.Y[v]+S.Y[v2])*.5,rgb=air.rgbAt(mx,my),mc=mixc(rgb,SEATC[kk],.5),mk=Math.max(mc[0],mc[1],mc[2])||1,bin=binOf(mc[0]*236/mk,mc[1]*236/mk,mc[2]*236/mk);
    /* a bead going round the ring, one lamp */
    const ang=v/nv,dd=frac(ph-ang),bead=Math.exp(-dd*7);
    let b=(.12+.88*op)*pm*depthF((S.Z[v]+S.Z[v2])*.5)*(.42+.4*I+.4*bead)*(big?1:.4)*o.gain;
    if(sh>.35&&hash(kk*17+(v>>2),(t*5+kk)|0)<.5*ss.stut[kk])b*=.35;if(b<.04)continue;
    o.LB2.add(cx+S.X[v]*k,cy+S.Y[v]*k,cx+S.X[v2]*k,cy+S.Y[v2]*k,bin,lvl(b));
    if(big&&!(v&1))DB.add(cx+S.X[v]*k,cy+S.Y[v]*k,bin,lvl(b*1.2),.6+.7*bead);}});}}
const SYS_T2={id:'torus-2',name:'Torus 2, Slices',ver:3,torus:true,lineK:1,lineY:.004,
 blurb:'One tube, and the seven seat rings are slices cut through it. Each ring is a seat in its own colour and each seat bends its own ring: a closed one narrows, breaks and stutters, an open one swells.',
 how:'The seven seat rings as slices of the field',
 init(sc){torusInit(sc);sc.mem.T=[mkT(0,1.12,1.32,14,3)];},
 draw(sc){prepFrame(sc);const ss=sc.ss;drawBody(sc,ss);PF(sc,'body');const g=sc.g,d=sc.dpr,M=sc.mem,LB=M.LB,LB2=M.LB2,DB=M.DB;LB.reset();LB2.reset();DB.reset();
  const T=M.T[0];tEff(sc,T);const fr=loopFrame(sc,T);
  drawMeridians(sc,T,fr,{M:T.M,P:3,gain:.62,inner:.4,LB,DB,nodes:false,jit:true});drawRays(sc,T,fr,{gain:.8,LB,DB,NR:40});
  drawSeatRings(sc,T,fr,{LB2,DB,gain:1.05});drawLeaks(sc,T,DB);
  PF(sc,'build');LB.flush(g,d,COLQ,AQ,LWQ,.9);LB2.flush(g,d,COLQ,AQ,LWQ,1.5);DB.flush(g,d,COLQ,AQ,SQ5,dotBase(sc));PF(sc,'flush');drawAddrs(sc,ss);PF(sc,'addr');},
 overlay:overlayTorus,bloom(sc){const c=sc.c;return[.2*c,.15*c];},glance:GLANCE};
