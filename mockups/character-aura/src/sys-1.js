/* AURA 1, PRISM. The light is carried by the points themselves and by nothing else: no halo, no field, no ring.
   Coherence fills the figure with light from the root up, the way the seats run. At ten percent the body is a
   tight dark cloud with a few sparks at the feet. At fifty five the lower seats are lit and the head is still dark.
   At a hundred every point is lit and every one carries a hue from across the seven seat colours, so the figure
   reads as a prism, and a band of white light climbs it from root to crown on a slow beat. */
const NH1=29,NL1=6;
const AL1=[.16,.3,.46,.66,.86,1],WH1=[0,0,.02,.07,.17,.34],SZ1=[.85,.95,1.05,1.16,1.3,1.5];
const COLS1=(()=>{const a=[];for(let h=0;h<NH1;h++){a.push([]);const base=h<28?specAt(h*6/27):[150,162,184];for(let l=0;l<NL1;l++)a[h].push(css(mixc(base,INK,WH1[l]),1));}return a;})();
function prismCol(sc,role,y,lit){const s=seatF(y),L=litAt(s,sc.c);let col=mixc(EMBER,specAt(s),.2+.8*L);
 if(role==='mass'||role==='lat')col=mixc(EMBER,col,.35+.3*L);return lit?mixc(col,INK,lit*.6):col;}
const SYS_1={id:'aura-1',name:'Aura 1, Prism',ver:1,N:{d:11000,m:5600,l:3400},
 blurb:'Light carried by the points and nothing else. Coherence fills the figure from the root up, seat by seat. Dark and tight at ten percent, a prism at a hundred. Load bends the shape, not the light.',
 how:'Colour and brightness of each point',
 init(sc){const N=sc.lineup?SYS_1.N.l:sc.small?SYS_1.N.m:SYS_1.N.d;sc.mem.A=bodySample(N,21);sc.mem.B=new Batch(N,NH1,NL1);worldInit(sc);},
 draw(sc){const g=sc.g,A=sc.mem.A,B=sc.mem.B,d=sc.dpr,t=sc.t,C=sc.fig.caps,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c;
  const cp=segFrames(C),lp=sc.lead,beat=.5+.5*Math.sin(Math.PI*2*t/MASKS.find(x=>x.nm===sc.mask).per);
  drawWorld(sc,{k:.5+.5*Math.min(1,c*1.6),col:(role,y,lit)=>prismCol(sc,role,y,lit)});
  const kc=lerp(.7,1,sstep(0,.7,c)),spread=sstep(.25,1,c)*1.7,X=c*8.6-1.0,vis=.58+.42*sstep(0,.5,c);
  const thr=sc.pc.map(q=>(.5+.5*Math.pow(q,.6))*vis);
  const pf=sc.pc.map((q,p)=>sc.pa(p)*(.84+.3*Math.pow(q,.8))*(p===lp?.9+.2*beat:1));
  const sw=((t/5.2)%1.35)*7.4-1.0,swA=.5*c*c;
  const sz=(sc.lineup?1.25:sc.mobile?1.3:1.5)*(1+.28*sstep(0,.9,c));
  const intro=t<2.2;B.reset();
  for(let i=0;i<A.n;i++){const p=A.pat[i];if(A.keep[i]>thr[p])continue;
   const q=bodyXY(sc,A,C,cp,i,kc,intro),x=cx+q[0]*k,y=cy+q[1]*k,s0=A.s0[i];
   let li=litQ(X-s0)*1.35-A.ig[i]*.35;li=li<0?0:li>1?1:li;
   let b=.23+.77*li;const dd=s0-sw;b+=swA*Math.exp(-dd*dd/.3)*(.4+li);
   b*=A.lum[i]*pf[p]*q[2]*(1+.14*Math.sin(t*(.9+A.ph[i]*1.4)+i));
   let l=(b*NL1*.95)|0;if(l>=NL1)l=NL1-1;if(l<0)l=0;
   let h;if(li<.12)h=28;else{const s=s0+A.jit[i]*spread;h=Math.round((s<0?0:s>6?6:s)*(27/6));}
   B.add(x,y,h,l,1);sc.reg(x,y,p);}
  /* the points are laid over the dark and not added to it, so a crowd of them keeps its colours instead of burning to white */
  g.globalCompositeOperation='source-over';B.flush(g,d,COLS1,AL1,SZ1,sz);g.globalCompositeOperation='lighter';},
 bloom(sc){const c=sc.c;return[.55*Math.pow(c,1.2),.5*Math.pow(c,1.5)];},
 glance:{Child:'Folded small under a huge dim mass. Smaller and lower is heavier.',Preteen:'The head turns and a beam sweeps dim watchers. The beam is the checking.',Teen:'A leaning figure thrusts an arm at a big mass and throws sparks.',
  Adult:'Upright and squared, the halves a hair apart at the waist. Tension runs along the seam and a file rises beside it.',Ideological:'A tall rigid figure in a fixed lattice, with a stream going round it and never in.'}};
