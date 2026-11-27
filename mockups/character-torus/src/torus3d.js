/* THE TORUS, AS GEOMETRY. Cubic Bezier paths in three dimensions, projected with perspective and a slow turn about the body's axis.
   The shape. A torus here is a tube swept round the body's vertical axis. Cut it by a plane through the axis and you see two ellipses,
   one each side, which a flow runs round: one side climbs, over the top, and the other falls, under the feet. R is the radius of the
   tube's centre ring, a and b are its horizontal and vertical half sizes, and the hole is held at 0.1 so the flow runs inside the body.
   MERIDIANS are loops of constant azimuth, each a closed run of cubic Beziers. Their anchors sit at the heights of the seats (and a few
   fillers, so the poles round off), and the Bezier handles are the Catmull-Rom ones, a sixth of the chord between the neighbours.
   RINGS are the parallels: a circle at one height, four cubic Beziers, kappa 0.5523.
   THE SEATS BEND IT. Each of the seven seats owns a height and a reach (a gaussian, SEATSG). At that height the anchors of every loop are
   moved by what the seat is, so the handles, which are made from the moved anchors, follow:
       charge   mean sq of the seat's addresses over ten, 0..1; a seat is open below 0.08 and closed at 0.42 (mean sq 4.2), smoothly between
       integrity the seat's own coherence, litAt(seat, CQ), root up
       pinch    0.30 * charge^1.1                    the radius is pulled in toward the body, a waist
       bulge    0.13 * (1 - charge)^1.4 * integrity  an open, whole seat swells outward
       pull     4 * charge * (1 - charge) * 0.12     a half loaded seat drags the loop sideways, in its own fixed direction
   Closed seats also do not animate well: the flow there runs slower (1 - 0.72 charge^1.1, and the slowdown is a real bottleneck: it
   lengthens the whole loop), flickers in held steps, falls out of step with its neighbours, breaks into gaps, and radiates short dim rays.
   CQ sets the global pattern: size, flow speed, brightness, and how straight and in step it all is.            */
const TY0=-1.7,TY1=1.7,TN=136,TSC=(TN-1)/(TY1-TY0);
const SEATGY=[.42,-.12,-.30,-.50,-.72,-.90,-1.10],SEATSG=[.30,.12,.12,.13,.13,.12,.14];
const YSET=[-1.22,-1.10,-.90,-.72,-.50,-.30,-.12,.14,.42,.70,.98];
const PW=.8,FLAT=Q.has('flat'),SEATLO=.08,SEATFULL=.42,TILT=.30,PD=5.2,RHOMIN=.1,SUB=4,KAP=.5523;
const hi=y=>{const q=((y-TY0)*TSC+.5)|0;return q<0?0:q>=TN?TN-1:q;};
const frac=x=>x-Math.floor(x);
const sgn=x=>x<0?-1:1;
/* the profile of a loop, in (rho, y): a D. The outer side is a full arc from the top pole to the bottom pole, both poles sit on the axis, and the
   inner side is a narrow channel that hugs the axis the whole way down. Spun round the axis it is an apple torus, the shape the biofield is drawn as.
   rho = RHOMIN + A * cos(theta)^PW on the outer side and RHOMIN + wch * |cos(theta)|^PW on the inner, y = cy - b sin(theta). */
const profS=v0=>Math.pow(Math.sqrt(Math.max(0,1-v0*v0)),PW);
function vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
 const a=hash(xi&255,(yi&255)+3),b=hash((xi+1)&255,(yi&255)+3),c=hash(xi&255,((yi+1)&255)+3),d=hash((xi+1)&255,((yi+1)&255)+3);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
/* the state of each seat this frame, from the eased charges and the light */
function seatState(sc,tgt){const A=tgt?sc.achT:sc.ach,ss=sc.ss||(sc.ss={sh:new Float32Array(7),lit:new Float32Array(7),open:new Float32Array(7),pinch:new Float32Array(7),bulge:new Float32Array(7),pull:new Float32Array(7),
  psi:new Float32Array(7),slow:new Float32Array(7),stut:new Float32Array(7),ray:new Float32Array(7),mean:new Float32Array(7),lk:new Float32Array(7),dq:0,leaks:[]}),c=sc.c;
 let tot=0;for(let j=0;j<112;j++)tot+=A[j];ss.dq=tot/112*100;
 for(let k=0;k<7;k++){const L=BYSEAT[k];let s=0;for(let i=0;i<L.length;i++)s+=A[L[i]];const mean=s/L.length;ss.mean[k]=mean;
  const sh=sstep(SEATLO,SEATFULL,mean),lit=litAt(k,c);ss.sh[k]=sh;ss.lit[k]=lit;ss.open[k]=lit*(1-.85*sh);ss.pinch[k]=.3*Math.pow(sh,1.1);ss.bulge[k]=.13*Math.pow(1-sh,1.4)*lit;
  ss.pull[k]=4*sh*(1-sh)*.12;ss.psi[k]=hash(k,90)*6.2832;ss.slow[k]=1-.72*Math.pow(sh,1.1);ss.stut[k]=sstep(.35,.85,sh);ss.ray[k]=.03+.14*ss.open[k];
  ss.lk[k]=sh*(.55+.45*(1-c));}
 /* the leaks: the three seats losing the most, in order */
 const o=[0,1,2,3,4,5,6].filter(k=>ss.lk[k]>.12).sort((a,b)=>ss.lk[b]-ss.lk[a]).slice(0,3);ss.leaks=o;return ss;}
/* the same state as a table over height, so a vertex does one lookup and not seven gaussians */
function buildH(sc){const ss=sc.ss,H=sc.HT||(sc.HT={m:new Float32Array(TN),px:new Float32Array(TN),pz:new Float32Array(TN),lit:new Float32Array(TN),sh:new Float32Array(TN),op:new Float32Array(TN),
  v:new Float32Array(TN),cl:new Float32Array(TN),ray:new Float32Array(TN)}),c=sc.c;
 /* seats in order of height, crown at the top: linear between them, so a height between two seats is between their states */
 const ord=[6,5,4,3,2,1,0];
 for(let q=0;q<TN;q++){const y=TY0+q/TSC;let rad=0,px=0,pz=0;
  for(let k=0;k<7;k++){const d=(y-SEATGY[k])/SEATSG[k],w=Math.exp(-d*d);if(w<.01)continue;rad+=w*(ss.bulge[k]-ss.pinch[k]);px+=w*ss.pull[k]*Math.cos(ss.psi[k]);pz+=w*ss.pull[k]*Math.sin(ss.psi[k]);}
  if(FLAT){rad=0;px=0;pz=0;}H.m[q]=clamp(1+rad,.3,1.34);H.px[q]=px;H.pz[q]=pz;
  let sh,ray;if(y<=SEATGY[6]){sh=ss.sh[6];}else if(y>=SEATGY[0]){sh=ss.sh[0];}else{let i=0;while(i<5&&y>SEATGY[ord[i+1]])i++;const a=ord[i],b=ord[i+1],f=(y-SEATGY[a])/(SEATGY[b]-SEATGY[a]);sh=ss.sh[a]+(ss.sh[b]-ss.sh[a])*f;}
  const lit=.3+.7*litAt(seatF(y),c);H.lit[q]=lit;H.sh[q]=sh;H.op[q]=lit*(1-.85*sh);H.v[q]=1-.72*Math.pow(sh,1.1);H.cl[q]=sstep(.35,.85,sh);H.ray[q]=.03+.14*H.op[q];}}
function viewState(sc){const Phi=sc.acc('rot',.07*(1-sc.ts)),V=sc.V||(sc.V={});V.Phi=Phi;V.cp=Math.cos(Phi);V.sp=Math.sin(Phi);V.ct=Math.cos(TILT);V.st=Math.sin(TILT);V.y0=-.02;return V;}
const _pr=[0,0,0,0];
function proj(V,X,Y,Z,S,v){const x1=X*V.cp+Z*V.sp,z1=-X*V.sp+Z*V.cp,yy=Y-V.y0,y2=yy*V.ct+z1*V.st,z2=z1*V.ct-yy*V.st,pf=PD/(PD-z2);S.X[v]=x1*pf;S.Y[v]=V.y0+y2*pf;S.Z[v]=z2;S.OY[v]=Y;}
function newS(n){return{X:new Float32Array(n),Y:new Float32Array(n),Z:new Float32Array(n),OY:new Float32Array(n)};}
/* a torus, at its present size. CQ sets the size, the sag and the roughness. */
function mkT(id,Rmax,b0,M,P){return{id,Rmax,b0,cy0:-.02,M,P};}
function tEff(sc,T){const c=sc.c,cw=sstep(0,.95,c);T.Rm=T.Rmax*(.55+.45*cw);T.b=T.b0*(.6+.4*cw);T.cy=T.cy0+(1-cw)*.18;T.A=T.Rm-RHOMIN;T.wch=.1*T.Rm/1.12;
 T.jit=.1*Math.pow(1-c,1.6);T.fc=.12+.88*sstep(.02,.9,c);T.omega=.035+.2*Math.pow(c,1.25);}
/* the anchors of a loop and the clock it runs on. The clock is the time a pulse takes to reach each vertex, longer where the flow is
   slow, so a pulse bunches and hurries through a closed seat the way traffic does. */
function loopFrame(sc,T){const th=[-Math.PI/2,Math.PI/2],H=sc.HT;
 for(const Y of YSET){const v=(T.cy-Y)/T.b;if(Math.abs(v)<.95){const a=Math.asin(v);th.push(a,Math.PI-a);}}th.sort((x,y)=>x-y);
 const n=th.length,NV=n*SUB,fr=T.fr||(T.fr={});fr.th=th;fr.n=n;fr.NV=NV;
 const ra=fr.ra=new Float32Array(n),ya=fr.ya=new Float32Array(n);let top=0;
 for(let j=0;j<n;j++){const cc=Math.cos(th[j]);ra[j]=RHOMIN+(cc>=0?T.A:T.wch)*Math.pow(Math.abs(cc),PW);ya[j]=T.cy-T.b*Math.sin(th[j]);if(Math.abs(th[j]-Math.PI/2)<1e-6)top=j*SUB;}
 fr.top=top;fr.ax=fr.ax||new Float32Array(40);fr.ay=fr.ay||new Float32Array(40);fr.az=fr.az||new Float32Array(40);
 /* the profile of the loop, (rho, y), through the same Bezier, to get a clock */
 const rv=new Float32Array(NV),yv=new Float32Array(NV);let vv=0;
 for(let j=0;j<n;j++){const j0=(j+n-1)%n,j2=(j+1)%n,j3=(j+2)%n;const r1=ra[j],y1=ya[j],r2=ra[j2],y2=ya[j2];
  const d12=Math.hypot(r2-r1,y2-y1)/3,ta=Math.hypot(r2-ra[j0],y2-ya[j0])||1,tb=Math.hypot(ra[j3]-r1,ya[j3]-y1)||1;
  const c1r=r1+(r2-ra[j0])/ta*d12,c1y=y1+(y2-ya[j0])/ta*d12,c2r=r2-(ra[j3]-r1)/tb*d12,c2y=y2-(ya[j3]-y1)/tb*d12;
  for(let s=0;s<SUB;s++){const u=s/SUB,w=1-u,b0=w*w*w,b1=3*w*w*u,b2=3*w*u*u,b3=u*u*u;rv[vv]=b0*r1+b1*c1r+b2*c2r+b3*r2;yv[vv]=b0*y1+b1*c1y+b2*c2y+b3*y2;vv++;}}
 const Tv=fr.Tv=new Float32Array(NV+1);let cum=0,arc=0;Tv[0]=0;
 for(let v=0;v<NV;v++){const v2=(v+1)%NV,ds=Math.hypot(rv[v2]-rv[v],yv[v2]-yv[v]),sp=H.v[hi((yv[v]+yv[v2])/2)];cum+=ds/sp;arc+=ds;Tv[v+1]=cum;}
 for(let v=0;v<=NV;v++)Tv[v]/=cum;fr.slowf=cum/arc;fr.rv=rv;fr.yv=yv;
 /* the clock position of each ring: the anchor at that height on the outer side and on the inner side */
 fr.ring=YSET.map(Y=>{const v=(T.cy-Y)/T.b;if(Math.abs(v)>=.95)return null;const a=Math.asin(v),o=th.findIndex(x=>Math.abs(x-a)<1e-6),i=th.findIndex(x=>Math.abs(x-(Math.PI-a))<1e-6);return{Y,o:Tv[o*SUB],i:Tv[i*SUB],s:profS(v)};});
 fr.psi=sc.acc('flow'+T.id,T.omega/fr.slowf);return fr;}
/* one meridian, evaluated: its vertices in figure units after the turn and the perspective */
function evalM(sc,T,fr,phi,mi,S){const th=fr.th,n=fr.n,H=sc.HT,V=sc.V,jt=T.jit,AX=fr.ax,AY=fr.ay,AZ=fr.az,cph=Math.cos(phi),sph=Math.sin(phi),tt=sc.t;
 for(let j=0;j<n;j++){const y=fr.ya[j],q=hi(y);let rho=fr.ra[j]*H.m[q];if(rho<.07)rho=.07;let X=rho*cph+H.px[q],Z=rho*sph+H.pz[q],Y=y;
  if(jt>.001){X+=jt*Math.sin(tt*1.1+mi*2.3+j*1.9);Z+=jt*Math.sin(tt*.9+mi*1.7+j*2.7);Y+=jt*.5*Math.sin(tt*1.3+mi*.9+j*3.1);}AX[j]=X;AY[j]=Y;AZ[j]=Z;}
 let v=0;
 for(let j=0;j<n;j++){const j0=(j+n-1)%n,j2=(j+1)%n,j3=(j+2)%n,x1=AX[j],y1=AY[j],z1=AZ[j],x2=AX[j2],y2=AY[j2],z2=AZ[j2];
  const d12=Math.hypot(x2-x1,y2-y1,z2-z1)/3,ta=Math.hypot(x2-AX[j0],y2-AY[j0],z2-AZ[j0])||1,tb=Math.hypot(AX[j3]-x1,AY[j3]-y1,AZ[j3]-z1)||1;
  const c1x=x1+(x2-AX[j0])/ta*d12,c1y=y1+(y2-AY[j0])/ta*d12,c1z=z1+(z2-AZ[j0])/ta*d12,c2x=x2-(AX[j3]-x1)/tb*d12,c2y=y2-(AY[j3]-y1)/tb*d12,c2z=z2-(AZ[j3]-z1)/tb*d12;
  for(let s=0;s<SUB;s++){const u=s/SUB,w=1-u,b0=w*w*w,b1=3*w*w*u,b2=3*w*u*u,b3=u*u*u;
   proj(V,b0*x1+b1*c1x+b2*c2x+b3*x2,b0*y1+b1*c1y+b2*c2y+b3*y2,b0*z1+b1*c1z+b2*c2z+b3*z2,S,v);v++;}}
 return v;}
/* a ring at height y on one side of the tube, four cubic Beziers, SUBR steps each, into S. returns the vertex count */
function evalRing(sc,T,y,side,S,SUBR){const H=sc.HT,V=sc.V,q=hi(y),v0=(T.cy-y)/T.b;if(Math.abs(v0)>=.95)return 0;const s=profS(v0);
 let rho=(RHOMIN+(side>0?T.A:T.wch)*s)*H.m[q];if(rho<.06)rho=.06;const px=H.px[q],pz=H.pz[q];let v=0;
 for(let qd=0;qd<4;qd++){const a0=qd*Math.PI/2,a3=a0+Math.PI/2,c0=Math.cos(a0),s0=Math.sin(a0),c3=Math.cos(a3),s3=Math.sin(a3);
  const p1x=c0,p1y=s0,c1x=c0-KAP*s0,c1y=s0+KAP*c0,c2x=c3+KAP*s3,c2y=s3-KAP*c3,p2x=c3,p2y=s3;
  for(let i=0;i<SUBR;i++){const u=i/SUBR,w=1-u,b0=w*w*w,b1=3*w*w*u,b2=3*w*u*u,b3=u*u*u;
   proj(V,px+rho*(b0*p1x+b1*c1x+b2*c2x+b3*p2x),y,pz+rho*(b0*p1y+b1*c1y+b2*c2y+b3*p2y),S,v);v++;}}
 return v;}
/* how bright a pulse is at clock position tv: heads are at hp, the tail runs behind them against the direction of travel */
function pulse(tv,hp,dirn){const d=dirn>0?frac(hp-tv):frac(tv-hp);return Math.exp(-d*6);}
/* the clock position of a head, and the vertex it is at */
function headVertex(fr,Tpos,o){const Tv=fr.Tv,NV=fr.NV;let i=0;while(i<NV-1&&Tv[i+1]<=Tpos)i++;const f=(Tpos-Tv[i])/((Tv[i+1]-Tv[i])||1);o[0]=i;o[1]=f<0?0:f>1?1:f;}
const _hv=[0,0];
const depthF=z=>.40+.60*clamp((z+1.2)/2.4,0,1);
const lvl=b=>{const l=(b*6.5)|0;return l>4?4:l;};
/* the seat the torus is leaking at, as a place on the outer wall of the outermost tube: object azimuth, then turned to the world */
function leakPoint(sc,T,k,rank,out){const ss=sc.ss,H=sc.HT,V=sc.V,y=SEATGY[k],q=hi(y),v0=(T.cy-y)/T.b;const s=profS(v0);
 let rho=(RHOMIN+T.A*s)*H.m[q];const objAz=hash(k,95)*6.2832,wa=Math.PI-(.28+.12*rank);let dd=((wa+V.Phi-objAz)%6.2832+9.4248)%6.2832-3.1416;const az=objAz+dd*sc.ts;
 const X=H.px[q]+rho*Math.cos(az),Z=H.pz[q]+rho*Math.sin(az);const S=sc.mem.S1;proj(V,X,y,Z,S,0);out[0]=S.X[0];out[1]=S.Y[0];out[2]=S.Z[0];out[3]=az;out[4]=rho;out[5]=y;out[6]=H.px[q];out[7]=H.pz[q];return out;}
/* the spray of points leaving at a leak: out through the wall, then dropping. a closed seat loses more. */
const _lk=[0,0,0,0,0,0,0,0];
function drawLeaks(sc,T,DB){const ss=sc.ss,V=sc.V,H=sc.HT,air=sc.air,k0=sc.k,cx=sc.cx,cy=sc.cy,S=sc.mem.S1,c=sc.c,t=sc.t;sc.leakPos={};
 if(c<.03)return;
 const lk=ss.leaks;
 for(let r=0;r<lk.length;r++){const k=lk[r],L=ss.lk[k];leakPoint(sc,T,k,r,_lk);const px=cx+_lk[0]*k0,py=cy+_lk[1]*k0;sc.leakPos[k]=[px,py];
  const tr=sc.sel>=0,foc=tr?(sc.sel===k?1.6:.4):1,np=Math.round((5+18*L)*(tr&&sc.sel===k?1.5:1)),az=_lk[3],rho=_lk[4],y=_lk[5];
  for(let i=0;i<np;i++){const ph=hash(i,k+20),u=frac(t*(.28+.3*hash(i,k+21))+ph),e=u*u;
   const out=(.02+.6*u*(.45+L)),ya=y+e*.5+(hash(i,k+22)-.5)*.1,azz=az+(hash(i,k+23)-.5)*.32;
   proj(V,H.px[hi(y)]+(rho+out)*Math.cos(azz),ya,H.pz[hi(y)]+(rho+out)*Math.sin(azz),S,0);
   const x=S.X[0],yy=S.Y[0],b=L*Math.pow(1-u,1.1)*(.35+.65*depthF(S.Z[0]))*foc*(.3+.7*c);if(b<.04)continue;
   DB.add(cx+x*k0,cy+yy*k0,air.binAt(x,yy),lvl(b*1.25),.6+.9*(1-u));}}}
/* the markers, drawn over everything, crisp. rings, not fills. */
function overlayTorus(sc){const g=sc.g,d=sc.dpr,t=sc.t;g.globalCompositeOperation='source-over';
 if(sc.sel>=0&&sc.leakPos){const ss=sc.ss;for(let r=0;r<ss.leaks.length;r++){const k=ss.leaks[r],p=sc.leakPos[k];if(!p)continue;const on=k===sc.sel,col=SEATC[k],pl=.5+.5*Math.sin(t*3.2);
   g.lineWidth=(on?2:1.3)*d;g.strokeStyle=css(col,on?1:.6);g.beginPath();g.arc(p[0]*d,p[1]*d,(on?10:7.5)*d,0,6.2832);g.stroke();
   if(on){g.strokeStyle=css(col,.35+.3*pl);g.beginPath();g.arc(p[0]*d,p[1]*d,(17+4*pl)*d,0,6.2832);g.stroke();}
   if(on)sc.threadFrom=[p[0],p[1]];}}
 const mark=(j,col)=>{const a=ADDR[j];for(const q of sc.AP)if(q[2]===j){g.lineWidth=1.5*d;g.strokeStyle=css(col);g.beginPath();g.arc(q[0]*d,q[1]*d,(9+3*sc.ach[j])*d,0,6.2832);g.stroke();return;}};
 if(sc.selAddr>=0)mark(sc.selAddr,mixc(INK,SEATC[ADDR[sc.selAddr].seat],.35));
 if(sc.hovAddr>=0&&sc.hovAddr!==sc.selAddr)mark(sc.hovAddr,INK);
 g.globalCompositeOperation='lighter';}
/* the work every version does first */
const PF=(sc,k)=>{const n=performance.now(),p=sc.pf||(sc.pf={_t:n});p[k]=(p[k]||0)*.9+.1*(n-p._t);p._t=n;};
function prepFrame(sc){const p=sc.pf||(sc.pf={});p._t=performance.now();spineNow(sc);seatState(sc);buildH(sc);viewState(sc);}
/* the meridians of one torus, as strokes and points. o: {M,P,gain,inner,LB,DB,nodes} */
function drawMeridians(sc,T,fr,o){const H=sc.HT,S=sc.mem.S,air=sc.air,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c,LB=o.LB,DB=o.DB,t=sc.t,dirn=sc.flow,NV=fr.NV,top=fr.top,P=o.P,Tv=fr.Tv;
 const psi=fr.psi,desync=Math.pow(1-c,.8),f=T.fc;
 for(let m=0;m<o.M;m++){const phi=6.2832*(m+(o.jit?.5*hash(m,T.id+40):0))/o.M+T.id*.37;evalM(sc,T,fr,phi,m,S);const off=hash(m,T.id*7+3)*desync;
  for(let v=0;v<NV;v++){const v2=v+1===NV?0:v+1,oy=(S.OY[v]+S.OY[v2])*.5,q=hi(oy);
   const n=vnoise(v/NV*2.6+m*.83+T.id*5.1,t*.06+m*1.31),pm=sstep(n-.1,n+.1,f-.5*H.sh[q]);if(pm<.03)continue;
   let tv=Tv[v]+H.cl[q]*(hash(m*13+v,5)-.5)*.14,I=0;for(let p=0;p<P;p++){const hp=dirn>0?frac(psi+p/P+off):1-frac(psi+p/P+off),e=pulse(tv,hp,dirn);if(e>I)I=e;}
   let b=(H.op[q]+.06*H.lit[q])*pm*depthF((S.Z[v]+S.Z[v2])*.5)*(.26+.74*I)*o.gain;if(v>top)b*=o.inner*.75;
   if(H.cl[q]>.3&&hash(m*31+(v>>1),(t*5+m)|0)<.5*H.cl[q])b*=.35;
   if(b<.04)continue;const mx=(S.X[v]+S.X[v2])*.5,my=(S.Y[v]+S.Y[v2])*.5;
   LB.add(cx+S.X[v]*k,cy+S.Y[v]*k,cx+S.X[v2]*k,cy+S.Y[v2]*k,air.binAt(mx,my),lvl(b));
   if(o.nodes&&!(v%SUB)){DB.add(cx+S.X[v]*k,cy+S.Y[v]*k,air.binAt(S.X[v],S.Y[v]),lvl(b*1.1),.55+.5*I);}}
  /* the heads, lamps with a short tail, climbing */
  for(let p=0;p<P;p++){const hp0=frac(psi+p/P+off),hp=dirn>0?hp0:1-hp0;headVertex(fr,hp,_hv);const i=_hv[0],u=_hv[1],i2=i+1===NV?0:i+1;
   const x=S.X[i]+(S.X[i2]-S.X[i])*u,y=S.Y[i]+(S.Y[i2]-S.Y[i])*u,z=S.Z[i],q=hi(S.OY[i]);
   const n=vnoise(i/NV*2.6+m*.83+T.id*5.1,t*.06+m*1.31),pm=sstep(n-.1,n+.1,f-.5*H.sh[q]);let b=(H.op[q]+.06*H.lit[q])*pm*depthF(z)*o.gain*1.15;if(v0inner(i,top))b*=o.inner;
   if(b<.05)continue;DB.add(cx+x*k,cy+y*k,air.binAt(x,y),lvl(b*1.4),1.5+.8*b);}}}
const v0inner=(i,top)=>i>top;
/* the rings of one torus: parallels at the heights of the anchors */
function drawRings(sc,T,fr,o){const H=sc.HT,S=sc.mem.S2,air=sc.air,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c,LB=o.LB,t=sc.t,dirn=sc.flow,P=o.P,psi=fr.psi,desync=Math.pow(1-c,.8),f=T.fc;
 fr.ring.forEach((R,ri)=>{if(!R)return;[1,-1].forEach(side=>{if(side<0&&!o.inner)return;
  const nv=evalRing(sc,T,R.Y,side,S,6);if(!nv)return;const q=hi(R.Y),Tr=side>0?R.o:R.i,off=hash(ri,T.id*11+4)*desync;
  let I=0;for(let p=0;p<P;p++){const hp=dirn>0?frac(psi+p/P+off):1-frac(psi+p/P+off),e=pulse(Tr+H.cl[q]*(hash(ri,6)-.5)*.1,hp,dirn);if(e>I)I=e;}
  for(let v=0;v<nv;v++){const v2=v+1===nv?0:v+1,n=vnoise(v/nv*3+ri*1.7+side*4,t*.05+ri*.9),pm=sstep(n-.1,n+.1,f-.5*H.sh[q]);if(pm<.03)continue;
   let b=(H.op[q]+.06*H.lit[q])*pm*depthF((S.Z[v]+S.Z[v2])*.5)*(.3+.7*I)*o.gain*(side>0?1:o.inner);
   if(H.cl[q]>.3&&hash(ri*17+(v>>2),(t*5+ri)|0)<.5*H.cl[q])b*=.35;if(b<.04)continue;
   LB.add(cx+S.X[v]*k,cy+S.Y[v]*k,cx+S.X[v2]*k,cy+S.Y[v2]*k,air.binAt((S.X[v]+S.X[v2])*.5,(S.Y[v]+S.Y[v2])*.5),lvl(b));}});});}
/* short rays off the outer wall. a closed seat gives short, dim ones. */
function drawRays(sc,T,fr,o){const H=sc.HT,S=sc.mem.S2,V=sc.V,air=sc.air,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c,LB=o.LB,DB=o.DB,t=sc.t,dirn=sc.flow,psi=fr.psi,f=T.fc;
 for(let r=0;r<o.NR;r++){const Y=YSET[(r*3)%YSET.length]+(hash(r,80)-.5)*.14,v0=(T.cy-Y)/T.b;if(Math.abs(v0)>=.93)continue;const q=hi(Y),s=profS(v0);
  const rho=(RHOMIN+T.A*s)*H.m[q],phi=hash(r,81)*6.2832,L=H.ray[q]*(.5+.9*hash(r,82))*(.4+.6*f);
  const n=vnoise(r*.7,t*.08+r),pm=sstep(n-.1,n+.1,f-.4*H.sh[q]);if(pm<.03)continue;
  proj(V,H.px[q]+rho*Math.cos(phi),Y,H.pz[q]+rho*Math.sin(phi),S,0);proj(V,H.px[q]+(rho+L)*Math.cos(phi),Y-L*.3,H.pz[q]+(rho+L)*Math.sin(phi),S,1);
  const Tr=fr.ring.reduce((a,R)=>R&&Math.abs(R.Y-Y)<Math.abs(a.d)?{d:R.Y-Y,T:R.o}:a,{d:9,T:0}).T;
  const I=pulse(Tr,dirn>0?frac(psi):1-frac(psi),dirn);const b=(H.op[q]+.06*H.lit[q])*pm*depthF(S.Z[0])*(.45+.55*I)*o.gain;if(b<.05)continue;
  LB.add(cx+S.X[0]*k,cy+S.Y[0]*k,cx+S.X[1]*k,cy+S.Y[1]*k,air.binAt(S.X[1],S.Y[1]),lvl(b));DB.add(cx+S.X[1]*k,cy+S.Y[1]*k,air.binAt(S.X[1],S.Y[1]),lvl(b),.7);}}
