/* AURA 3, ORBIT. Two layers that move on their own clocks. The mask layer is a dense cloud, the body, bent by the
   load and breathing with the mask's own tempo. The radiance layer is sparse and large: seven rings of light, one
   at each seat, going round the body at the height the seat sits, each carrying its seat colour. Coherence is
   alignment. At ten percent the rings are small, dim and tilted every way, going round in different directions at
   different speeds. As it rises they open out, level, and fall into step. At a hundred all seven are wide and flat,
   turning together, the comets on them lined up in a column, and every ring carries the whole spectrum round it.
   The rings throw light back onto the body in bands at the seats. */
const NH3=28,NL3=5;
const AL3=[.2,.36,.58,.8,1],WH3=[0,.02,.1,.22,.4],SZ3=[.8,.95,1.12,1.3,1.5];
const COLS3=(()=>{const a=[];for(let h=0;h<NH3;h++){a.push([]);const base=specAt(h*6/27);for(let l=0;l<NL3;l++)a[h].push(css(mixc(base,INK,WH3[l]),1));}return a;})();
/* the dense mask layer: nine pattern hues, then the seven seat hues for the bands the rings throw on it */
const NHB3=16,NLB3=6,ALB3=[.1,.2,.36,.56,.78,.95],WHB3=[0,0,.04,.12,.24,.4],SZB3=[.85,.95,1.05,1.15,1.28,1.45];
const COLSB3=(()=>{const a=[];for(let h=0;h<NHB3;h++){a.push([]);const base=h<9?mixc([178,186,202],PCOL[h],.4):mixc(EMBER,specAt(h-9),.85);for(let l=0;l<NLB3;l++)a[h].push(css(mixc(base,INK,WHB3[l]),1));}return a;})();
const RB3=[.25,.2,.23,.27,.12,.15,.11];           /* the half width of the body at each seat, rest figure, in figure units */
const SYS_3={id:'aura-3',name:'Aura 3, Orbit',ver:3,lineK:.88,lineY:.03,N:{d:9000,m:4600,l:2800},R:{d:140,m:96,l:60},
 blurb:'Two layers on two clocks. A dense mask, bent by the load. A sparse radiance of seven rings, one per seat. Coherence is alignment: small, dim and tilted at ten percent, wide, level and turning in step at a hundred.',
 how:'Seven orbiting rings, one per seat',
 init(sc){const l=sc.lineup,s=sc.small;const N=l?SYS_3.N.l:s?SYS_3.N.m:SYS_3.N.d;sc.mem.A=bodySample(N,21);sc.mem.B=new Batch(N,NHB3,NLB3);
  sc.mem.RP=l?SYS_3.R.l:s?SYS_3.R.m:SYS_3.R.d;const nr=sc.mem.RP*7+(l?120:s?200:320)+7*2*9;sc.mem.BR=new Batch(nr,NH3,NL3);
  const r=rng(9);sc.mem.dust=Array.from({length:l?120:s?200:320},()=>({x:(r()+r()+r()-1.5)*.9,y:r()*2.4-1.25,sp:.03+r()*.07,ph:r()*6.28,z:r()}));worldInit(sc);},
 draw(sc){const g=sc.g,A=sc.mem.A,B=sc.mem.B,BR=sc.mem.BR,d=sc.dpr,t=sc.t,F=sc.fig,C=F.caps,J=F.J,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c;
  const cp=segFrames(C),lp=sc.lead,M=MASKS.find(x=>x.nm===sc.mask),beat=.5+.5*Math.sin(Math.PI*2*t/M.per);
  const seats=M.b.map(n=>SEATN.indexOf(n));
  drawWorld(sc,{k:.45+.5*c,col:(role,y,lit)=>{const s=lerp(seats[0],seats[seats.length-1],.5+.5*Math.sin(t*.35+y*3));
   let col=mixc(EMBER,specAt(s),.25+.75*sstep(.05,.6,c));if(role==='mass'||role==='lat')col=mixc(EMBER,col,.4);return lit?mixc(col,INK,lit*.55):col;}});
  const ca=sstep(.12,.95,c),open=sstep(.03,.97,c),kc=lerp(.72,1,sstep(0,.7,c)),intro=t<2.2;
  /* the seats, on the bent spine */
  const P=J.P,H=J.head,ux=H[0]-P[0],uy=H[1]-P[1],ul=Math.hypot(ux,uy)||1,upx=ux/ul,upy=uy/ul,s=F.scale;
  const CEN=[P,J.m2,J.m1,[lerp(J.m1[0],J.S0[0],.55),lerp(J.m1[1],J.S0[1],.55)],J.nt,H,[H[0]+upx*.15*s,H[1]+upy*.15*s]];
  const lit=[0,1,2,3,4,5,6].map(i=>sstep(.04+.035*i,.55+.04*i,c));
  /* the mask layer */
  const vis=.6+.4*sstep(0,.5,c),thr=sc.pc.map(q=>(.5+.5*Math.pow(q,.6))*vis);
  const pf=sc.pc.map((q,p)=>sc.pa(p)*(.84+.3*Math.pow(q,.8))*(p===lp?.9+.2*beat:1));
  const gain=(.48+.45*sstep(0,.9,c))*Math.min(1,F.scale**1.6),szB=(sc.lineup?1.25:sc.mobile?1.3:1.5)*(1+.14*sstep(0,.9,c));B.reset();
  for(let i=0;i<A.n;i++){const p=A.pat[i];if(A.keep[i]>thr[p])continue;
   const q=bodyXY(sc,A,C,cp,i,kc,intro),x=cx+q[0]*k,y=cy+q[1]*k,s0=A.s0[i];
   let b=gain*A.lum[i]*pf[p]*q[2]*(1+.12*Math.sin(t*(.9+A.ph[i]*1.4)+i)),h=p;
   const rk=Math.round(s0),dk=Math.abs(s0-rk);
   if(rk>=1&&dk<.2){const bl=(1-dk/.2)*lit[rk];if(bl>.08){b+=bl*.55*A.lum[i];if(bl>.3)h=9+rk;}}
   let l=(b*NLB3*.95)|0;if(l>=NLB3)l=NLB3-1;if(l<0)l=0;B.add(x,y,h,l,1);sc.reg(x,y,p);}
  B.flush(g,d,COLSB3,ALB3,SZB3,szB);
  /* the radiance layer */
  BR.reset();const RP=sc.mem.RP,szR=(sc.lineup?1.7:sc.mobile?1.9:2.2),spread=sstep(.35,1,c)*3.4;
  const comets=[];
  for(let kk=0;kk<7;kk++){const L=lit[kk];if(L<.02)continue;
   const dir0=hash(kk,31)>.5?1:-1,om=.5*lerp(dir0*(.6+.8*hash(kk,34)),1,ca),ph0=(1-ca)*hash(kk,33)*6.283;
   const roll=(1-ca)*(.9+.5*hash(kk,35))*(kk%2?1:-1)*(1+.3*Math.sin(t*.35+kk)),elev=.3+(1-ca)*(hash(kk,32)*.8-.15),sE=Math.sin(elev);
   const R=RB3[kk]*s*(.92+.95*Math.pow(open,.9))*(kk===6?1.15:1),cr=Math.cos(roll),sr=Math.sin(roll),cen=CEN[kk];
   /* a faint continuous thread under the beads, so a ring reads as a ring at a glance */
   g.save();g.globalAlpha=.1*L;g.strokeStyle=css(SEATC[kk]);g.lineWidth=(sc.lineup?3:6)*d;g.beginPath();
   g.ellipse((cx+cen[0]*k)*d,(cy+cen[1]*k)*d,R*k*d,Math.max(1,R*sE*k*d),roll,0,6.2832);g.stroke();g.restore();
   for(let j=0;j<RP;j++){const th=6.2832*(j+.5*hash(j,kk))/RP+ph0+om*t,cs=Math.cos(th),sn=Math.sin(th);
    const rj=R*(1+.05*(hash(j,kk+40)-.5)),lx=rj*cs,ly=rj*sn*sE+(hash(j,kk+50)-.5)*.02*s,x=cen[0]+lx*cr-ly*sr,y=cen[1]+lx*sr+ly*cr;
    const fr=.5+.5*sn;let b=L*(.45+.55*fr)*(.8+.2*Math.sin(t*1.7+j+kk));
    let l=(b*NL3*1.05)|0;if(l>=NL3)l=NL3-1;if(l<0)l=0;
    const sp=kk+((((th/6.2832)%1)+1)%1-.5)*spread,hb=Math.round((sp<0?0:sp>6?6:sp)*(27/6));
    BR.add(cx+x*k,cy+y*k,hb,l,.75+.7*fr);}
   for(let m=0;m<2;m++){const th=om*t*1.9+ph0+m*Math.PI+kk*.2*(1-ca),cs=Math.cos(th),sn=Math.sin(th),fr=.5+.5*sn;
    comets.push([kk,th,om,R,sE,cr,sr,cen,L,fr]);}}
  /* the dust: sparse points rising through the whole column, coloured by the seat they pass */
  for(const q of sc.mem.dust){const y=((q.y-t*q.sp*(.5+open)+1.25)%2.4+2.4)%2.4-1.25,x=q.x*(.7+.5*open)+Math.sin(t*.3+q.ph)*.03;
   const sk=seatF(y),Lq=litAt(sk,c)*.7*(.4+.6*q.z);if(Lq<.03)continue;let l=(Lq*NL3*1.1)|0;if(l>=NL3)l=NL3-1;
   BR.add(cx+x*k,cy+y*k,Math.round(clamp(sk,0,6)*(27/6)),l,.6+.6*q.z);}
  BR.flush(g,d,COLS3,AL3,SZ3,szR);
  /* the comets: a lamp and a short trail going round each ring, the lamps in step when coherent */
  for(const q of comets){const[kk,th,om,R,sE,cr,sr,cen,L,fr]=q;const dirn=om>=0?-1:1;
   for(let m=9;m>=0;m--){const tt=th+dirn*m*.1,sn=Math.sin(tt),cs=Math.cos(tt),lx=R*cs,ly=R*sn*sE,x=cen[0]+lx*cr-ly*sr,y=cen[1]+lx*sr+ly*cr;
    const sp=kk+(((tt/6.2832)%1+1)%1-.5)*spread,col=specAt(clamp(sp,0,6)),f2=.5+.5*sn;
    const px=cx+x*k,py=cy+y*k,a=L*(1-m/10)*(.5+.5*f2);
    if(m===0){sc.glow(px,py,(sc.lineup?9:sc.mobile?11:15)*(.7+.5*f2),col,.5*a);sc.dot(px,py,3.2,mixc(col,INK,.5),.95*a);}
    else sc.dot(px,py,2.4-m*.12,col,.7*a);}}},
 bloom(sc){const c=sc.c;return[.5*Math.pow(c,1.1),.55*Math.pow(c,1.3)];},
 glance:{Child:'Folded small under a huge dim mass. The rings crowd down onto the small body.',Preteen:'The head turns and a beam sweeps dim watchers. The rings sit level above the turning head.',Teen:'A leaning figure thrusts an arm at a big mass and throws sparks. The rings lean with the body.',
  Adult:'Upright and squared, the halves a hair apart at the waist. The sacral and solar rings sit either side of the seam.',Ideological:'A tall rigid figure in a fixed lattice. The rings stack up the spine like a column of discs.'}};
