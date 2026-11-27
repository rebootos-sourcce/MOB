/* TORUS 3, SHELL. The torus as a layered shell of points, three tubes one inside another, with flow streaks: short bright strokes that
   run along the Bezier loops, bottom to top on the outside. The shell is dense and soft where the flow is whole and goes to air
   where a seat is closed, so the gaps are holes in a surface and not breaks in a line. */
function drawShell(sc,T,fr,o){const H=sc.HT,S=sc.mem.S,air=sc.air,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c,LB=o.LB,DB=o.DB,t=sc.t,dirn=sc.flow,NV=fr.NV,top=fr.top,Tv=fr.Tv,psi=fr.psi,f=T.fc,desync=Math.pow(1-c,.8);
 for(let m=0;m<T.M;m++){const phi=6.2832*(m+.5*hash(m,T.id+40))/T.M+T.id*.9;evalM(sc,T,fr,phi,m,S);const off=hash(m,T.id*7+3)*desync;
  for(let v=0;v<NV;v++){const v2=v+1===NV?0:v+1,oy=(S.OY[v]+S.OY[v2])*.5,q=hi(oy);
   const n=vnoise(v/NV*2.6+m*.83+T.id*5.1,t*.06+m*1.31),pm=sstep(n-.12,n+.12,f-.55*H.sh[q]);if(pm<.03)continue;
   const tv=Tv[v]+H.cl[q]*(hash(m*13+v,5)-.5)*.14;let I=0;for(let p=0;p<2;p++){const hp=dirn>0?frac(psi+p*.5+off):1-frac(psi+p*.5+off),e=pulse(tv,hp,dirn);if(e>I)I=e;}
   let b=(H.op[q]+.05*H.lit[q])*pm*depthF(S.Z[v])*(.5+.5*I)*o.gain;if(v>top)b*=.3;if(H.cl[q]>.3&&hash(m*31+(v>>1),(t*5+m)|0)<.5*H.cl[q])b*=.35;if(b<.04)continue;
   const x=S.X[v]+(hash(m*97+v,1)-.5)*.016,y=S.Y[v]+(hash(m*97+v,2)-.5)*.016;DB.add(cx+x*k,cy+y*k,air.binAt(x,y),lvl(b),.7+.6*I);
   /* a hairline under the grain, so the surface keeps the shape of the loops */
   if(b>.12)LB.add(cx+S.X[v]*k,cy+S.Y[v]*k,cx+S.X[v2]*k,cy+S.Y[v2]*k,air.binAt(S.X[v],S.Y[v]),0);}
  /* the streaks that ride this loop */
  for(const st of o.streaks){if(st.m!==m)continue;const hp0=frac(psi*st.sp+st.p),hp=dirn>0?hp0:1-hp0;headVertex(fr,hp,_hv);const i0=_hv[0];
   for(let j=0;j<9;j++){const i=((i0-dirn*j)%NV+NV)%NV,i2=((i0-dirn*(j+1))%NV+NV)%NV,q=hi(S.OY[i]),nn=vnoise(i/NV*2.6+m*.83+T.id*5.1,t*.06+m*1.31),pm=sstep(nn-.12,nn+.12,f-.55*H.sh[q]);
    const b=(H.op[q]+.05*H.lit[q])*pm*depthF(S.Z[i])*(1-j/9)*o.gain*1.7*(i>top?.3:1);if(b<.05)continue;
    LB.add(cx+S.X[i]*k,cy+S.Y[i]*k,cx+S.X[i2]*k,cy+S.Y[i2]*k,air.binAt(S.X[i],S.Y[i]),lvl(b));
    if(j===0)DB.add(cx+S.X[i]*k,cy+S.Y[i]*k,air.binAt(S.X[i],S.Y[i]),lvl(b*1.2),1.7);}}}}
const SYS_T3={id:'torus-3',name:'Torus 3, Shell',ver:3,torus:true,lineK:1,lineY:.004,
 blurb:'The torus as a layered shell of points, three tubes one inside another, with short bright streaks running up the outside along the Bezier loops. A closed seat is a hole in the surface.',
 how:'A layered point shell with flow streaks',
 init(sc){torusInit(sc);sc.mem.T=[mkT(0,1.12,1.32,32,0),mkT(1,.94,1.17,26,0),mkT(2,.78,1.03,20,0)];
  sc.mem.ST=sc.mem.T.map((T,i)=>Array.from({length:i?7:9},(_,s)=>({m:Math.floor(hash(s,i*5+2)*T.M),p:hash(s,i*5+3),sp:.85+.3*hash(s,i*5+4)})));},
 draw(sc){prepFrame(sc);const ss=sc.ss;drawBody(sc,ss);PF(sc,'body');const g=sc.g,d=sc.dpr,M=sc.mem,LB=M.LB,DB=M.DB;LB.reset();DB.reset();
  M.T.forEach((T,i)=>{tEff(sc,T);const fr=loopFrame(sc,T);drawShell(sc,T,fr,{gain:[.85,.95,1.05][i],LB,DB,streaks:M.ST[i]});});
  drawLeaks(sc,M.T[0],DB);PF(sc,'build');LB.flush(g,d,COLQ,AQ,LWQ,1.05);DB.flush(g,d,COLQ,AQ,SQ5,dotBase(sc)*.9);PF(sc,'flush');drawAddrs(sc,ss);PF(sc,'addr');},
 overlay:overlayTorus,bloom(sc){const c=sc.c;return[.26*c,.2*c];},glance:GLANCE};
