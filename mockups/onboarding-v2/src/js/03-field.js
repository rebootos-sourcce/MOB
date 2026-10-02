
/* ================================================================ the Field
   112 ticks round the body figure. This is the door's ring, the same ticks, so the door does not end: it becomes the Field.
   Every tick carries ten springs (five wave modes, sag, tight, dim, warm, len). An answer (aim) does not change them all
   at once: it starts a WAVE from the place the input came from, so each tick starts moving when the wave reaches it and
   overshoots on its own spring. That is overlapping action, and it is also how the person can see where the answer landed.
   Under reduced motion every spring is its end value at once and nothing ripples. */
var TAU=Math.PI*2,MODEK=[2,3,5,7,9],OMEGA=[.35,.5,.8,1.1,1.4];
var FD={N:112,K:10,val:new Float32Array(1120),vel:new Float32Array(1120),tgt:new Float32Array(1120),st:new Float32Array(112),
 spd:1,spdT:1,sc:1,scV:0,scT:1,scRel:-1,t:0,ph:[0,1.3,2.6,3.9,5.2],door:1,doorT:1,
 lean:0,leanV:0,leanT:0,fseat:-1,hueF:0,hueFT:0,hueAt:-1,fa:0,
 bt:0,breathA:.3,breathAT:.3,arcAT:1,sig:'',rip:[],motes:[],lit:new Uint8Array(112),litCur:-1,litHue:0,geo:{cx:0,cy:0,rx:1,ry:1},
 mv:{pose:0,wave:0,rip:0,pull:0,bead:0,lean:0},arcA:1};
FD.sig=JSON.stringify(fieldTarget());
function fieldTarget(){
 var st=S.pick!=null&&STARTS[S.pick]?STARTS[S.pick].f:null,fe=S.feel!=null&&S.feel>=0&&FEELS[S.feel]?FEELS[S.feel].f:null,md=S.mood||{};
 var m=(st?st.m:BASE.m).slice(),sag=st&&st.sag||0,tight=st&&st.tight||0,dim=st&&st.dim!=null?st.dim:1,warm=st&&st.warm||0,len=st&&st.len||1,spd=st&&st.spd||1;
 if(fe){var a=fe.amp==null?1:fe.amp;m=m.map(function(v,i){return v*a*((i>=3&&fe.hi)?fe.hi:1);});
  spd*=fe.spd||1;sag+=fe.sag||0;tight+=fe.tight||0;dim*=fe.dim==null?1:fe.dim;warm+=fe.warm||0;len*=fe.len||1;}
 if(md.amp!=null)m=m.map(function(v){return v*md.amp;});
 spd*=md.spd||1;warm+=md.warm||0;dim*=md.dim==null?1:md.dim;
 return {m:m,sag:sag,tight:clamp(tight,-.4,1),dim:clamp(dim,.2,1),warm:clamp(warm,0,1),len:len,spd:spd};}
function tickPos(j,g){var th=Math.PI/2+(j+.5)*TAU/112;return {x:g.cx+g.rx*Math.cos(th),y:g.cy+g.ry*Math.sin(th)};}
(function initField(){
 var tg=fieldTarget(),j,k;
 for(j=0;j<112;j++){var b=j*10;for(k=0;k<5;k++)FD.val[b+k]=FD.tgt[b+k]=tg.m[k];
  FD.val[b+5]=FD.tgt[b+5]=tg.sag;FD.val[b+6]=FD.tgt[b+6]=tg.tight;FD.val[b+7]=FD.tgt[b+7]=tg.dim;FD.val[b+8]=FD.tgt[b+8]=tg.warm;FD.val[b+9]=FD.tgt[b+9]=tg.len;}
 var r=rng(7);for(j=0;j<28;j++)FD.motes.push({a:r()*TAU,rm:1.14+r()*.34,w:(.05+r()*.09)*(r()<.5?-1:1),sz:1+r()*1.1,al:.3+.4*r(),ph:r()*TAU,j:r(),f:r(),g:0});})();

/* The seat the Field is leaning toward, as a screen point. It is read live from the pose, so the lean follows the figure. */
function focusPt(){return FD.fseat<0?null:seatXY(POSE.cur,FD.fseat);}
function focusDir(g){var f=focusPt();if(!f)return null;var dx=f.x-g.cx,dy=f.y-g.cy,m=Math.sqrt(dx*dx+dy*dy);
 if(m<.25*Math.min(g.rx,g.ry))return null;return Math.atan2(dy,dx);}   /* a seat near the middle leans no one side of the ring: the whole ring answers */
function angDiff(a,b){var d=(a-b)%TAU;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;return d;}

/* aim: retarget every tick from the current state. o is the wave's origin in screen px (or null for none).
   delay is the anticipation (the ring pulls in 4.5 percent first), span is how long the wave takes to reach the far tick. */
FD.aim=function(o,opt){
 opt=opt||{};var g=FD.geo,tg=fieldTarget(),j,k,d=[],dmax=1;FD.spdT=tg.spd;FD.sig=JSON.stringify(tg);
 for(j=0;j<112;j++){var p=tickPos(j,g);d[j]=o?Math.sqrt((p.x-o.x)*(p.x-o.x)+(p.y-o.y)*(p.y-o.y)):0;if(d[j]>dmax)dmax=d[j];}
 var snap=STILL||opt.snap,delay=opt.delay==null?.12:opt.delay,span=opt.span||.55;
 for(j=0;j<112;j++){var b=j*10;
  for(k=0;k<5;k++)FD.tgt[b+k]=tg.m[k];
  FD.tgt[b+5]=tg.sag;FD.tgt[b+6]=tg.tight;FD.tgt[b+7]=tg.dim;FD.tgt[b+8]=tg.warm;FD.tgt[b+9]=tg.len;
  FD.st[j]=snap?0:FD.t+delay+(o?span*d[j]/dmax:0);
  if(snap)for(k=0;k<10;k++){FD.val[b+k]=FD.tgt[b+k];FD.vel[b+k]=0;}}
 if(snap)FD.spd=FD.spdT;
 else if(opt.pull!==false){FD.pull(.955,delay);}};
FD.pull=function(amt,delay,kick){if(STILL)return;FD.scT=amt;FD.scRel=FD.t+(delay==null?.12:delay);FD.kk=kick||.8;};
FD.ripple=function(o,amp,delay){if(STILL)return;FD.rip.push({x:o.x,y:o.y,t0:FD.t+(delay==null?.12:delay),amp:amp==null?1:amp});};
/* lean: seat index or -1. The hue and the motes follow 300 ms late, which is the secondary action. */
FD.leanTo=function(seat,snap){
 FD.fseat=seat;FD.leanT=seat>=0?1:0;FD.hueFT=seat>=0?1:0;
 if(snap||STILL){FD.lean=FD.leanT;FD.leanV=0;FD.hueF=FD.hueFT;FD.hueAt=-1;if(seat>=0)FD.pack();}
 else FD.hueAt=FD.t+(seat>=0?.3:0);};
FD.pack=function(){};
FD.light=function(j,cur){if(j>=0&&j<112)FD.lit[j]=cur?0:1;FD.litCur=cur?j:-1;};
FD.resetLit=function(){FD.lit.fill(0);FD.litCur=-1;};
FD.snapAll=function(){FD.aim(null,{snap:true});FD.sc=FD.scT=1;FD.scV=0;FD.scRel=-1;FD.rip.length=0;
 FD.door=FD.doorT;FD.breathA=FD.breathAT;FD.lean=FD.leanT;FD.hueF=FD.hueFT;if(FD.fseat>=0)FD.pack();};

FD.step=function(dt,ambientFrozen){
 dt=Math.min(dt,.05);FD.t+=dt;
 var j,k,mvWave=0,mvLean=0;
 if(FD.scRel>=0&&FD.t>=FD.scRel){FD.scT=1;FD.scV+=(FD.kk||.8);FD.scRel=-1;}
 for(j=0;j<112;j++){
  if(FD.t<FD.st[j]){mvWave=1;continue;}
  var b=j*10;
  for(k=0;k<10;k++){var i=b+k,e=FD.tgt[i]-FD.val[i];
   if(e===0&&FD.vel[i]===0)continue;
   FD.vel[i]+=(90*e-8.5*FD.vel[i])*dt;FD.val[i]+=FD.vel[i]*dt;
   if(Math.abs(e)>.004||Math.abs(FD.vel[i])>.02)mvWave=1;else{FD.val[i]=FD.tgt[i];FD.vel[i]=0;}}}
 var ks=160,cs=12.6,es=FD.scT-FD.sc;FD.scV+=(ks*es-cs*FD.scV)*dt;FD.sc+=FD.scV*dt;
 var pullOn=Math.abs(es)>.002||Math.abs(FD.scV)>.02;
 var el=FD.leanT-FD.lean;FD.leanV+=(70*el-9*FD.leanV)*dt;FD.lean+=FD.leanV*dt;if(Math.abs(el)>.003||Math.abs(FD.leanV)>.02)mvLean=1;
 if(FD.hueAt>=0&&FD.t>=FD.hueAt)FD.hueAt=-1;
 if(FD.hueAt<0)FD.hueF+=(FD.hueFT-FD.hueF)*(1-Math.exp(-dt/.2));
 FD.door+=(FD.doorT-FD.door)*(1-Math.exp(-dt/.22));
 FD.spd+=(FD.spdT-FD.spd)*(1-Math.exp(-dt/.5));
 FD.breathA+=(FD.breathAT-FD.breathA)*(1-Math.exp(-dt/.6));
 FD.arcA+=(FD.arcAT-FD.arcA)*(1-Math.exp(-dt/.4));
 for(var r=FD.rip.length-1;r>=0;r--)if(FD.t-FD.rip[r].t0>1.8)FD.rip.splice(r,1);
 if(!ambientFrozen){
  if(!STILL){for(k=0;k<5;k++)FD.ph[k]+=OMEGA[k]*FD.spd*dt;
  FD.bt+=dt;}
  FD.motes.forEach(function(m){
   m.g=smooth((FD.lean*1.15-m.j*.5)/.5);                     /* about 70 percent of the motes leave the ring and gather round the seat */
   if(!STILL)m.a+=m.w*FD.spd*(1+4*m.g)*dt;});}
 if(STILL){FD.door=FD.doorT;FD.arcA=FD.arcAT;FD.breathA=FD.breathAT;FD.spd=FD.spdT;FD.hueF=FD.hueFT;FD.lean=FD.leanT;FD.sc=1;FD.scV=0;}
 FD.mv={pose:POSE.to?1:0,wave:mvWave,rip:FD.rip.length?1:0,pull:pullOn?1:0,bead:S.bead&&!S.bead.done?1:0,lean:mvLean};};
/* a run of steps with no drawing, so a jump lands on a settled Field with its motes already gathered */
FD.sim=function(sec){var n=Math.round(sec*20);for(var i=0;i<n;i++){stepPose(.05);FD.step(.05,false);}};

function breathShape(){if(STILL)return 0;var ph=(FD.bt%4.2)/4.2;return ph<.4?smooth(ph/.4):1-smooth((ph-.4)/.6);}   /* in 1.7 s, out 2.5 s: the exhale is longer */
var ARCP=[[53,71,0.0,1],[67,89,2.1,-1],[79,59,4.2,1]];

/* Draw the Field. g is the ring's geometry. o.tl overrides the tick length (the door's, during the transit). */
FD.draw=function(c,g,o){
 o=o||{};FD.geo=g;
 var N=112,j,k,tl=o.tl||tickLen(g),amb=STILL?0:Math.sin(TAU*S.ringT/61),ambA=STILL?.9:.9+.1*Math.sin(TAU*S.ringT/47);
 var br=breathShape()*FD.breathA,sc=FD.sc*(1+.012*amb)*(1+.035*br);
 var fd=focusDir(g),leanX=0,leanY=0,fpt=focusPt();
 if(fpt){var dx=fpt.x-g.cx,dy=fpt.y-g.cy,m=Math.sqrt(dx*dx+dy*dy)||1,mm=Math.min(m,.5*Math.min(g.rx,g.ry));leanX=dx/m*mm*.2*FD.lean;leanY=dy/m*mm*.2*FD.lean;}
 var cx=g.cx+leanX,cy=g.cy+leanY,rx=g.rx*sc,ry=g.ry*sc,al=o.a==null?1:o.a;
 /* the three tide arcs: the Field's outer harmonics. 7 segments each, in ink, taking the door's colours while the door
    weight is up and the seat colour on the side the person leans toward. Scale and turn on periods of 53 to 89 s. */
 var aw=FD.arcA*al;
 if(aw>0){
  [1.2,1.44,1.72].forEach(function(mu,ri){
   var P=ARCP[ri],sx=STILL?1:1+.015*Math.sin(TAU*S.ringT/P[0]+P[2]),rot=STILL?0:P[3]*(4+ri*1.5)*Math.PI/180*Math.sin(TAU*S.ringT/P[1]+P[2]);
   c.lineCap='round';c.lineWidth=1.4;
   for(var s=0;s<7;s++){
    var a0=Math.PI/2+s*TAU/7+.038+ri*.05,a1=Math.PI/2+(s+1)*TAU/7-.038+ri*.05,am=(a0+a1)/2;
    var wf=FD.fseat<0?0:FD.hueF*Math.min(1,FD.lean)*(s===FD.fseat?1:.15);
    var wd=FD.door,col,aa;
    var base=[.2,.15,.1][ri],hi=[.38,.29,.2][ri];
    if(wd>=wf){col=mixA(INK,PALRGB[s],wd,lerp(base,hi,wd));aa=1;}
    else{col=mixA(INK,PALRGB[FD.fseat],wf,lerp(base,hi*1.3,wf));aa=1;}
    c.globalAlpha=aw*aa*(.9+.1*ambA);c.strokeStyle=col;c.beginPath();c.ellipse(cx,cy,rx*mu*sx,ry*mu*sx,rot,a0,a1);c.stroke();}});
  c.globalAlpha=1;}
 /* the ticks */
 c.lineCap='round';
 for(j=0;j<N;j++){
  var b=j*10,V=FD.val,th=Math.PI/2+(j+.5)*TAU/N,co=Math.cos(th),si=Math.sin(th);
  var w=0;for(k=0;k<5;k++)w+=V[b+k]*Math.sin(MODEK[k]*th+FD.ph[k]);
  var sag=V[b+5],tight=V[b+6],dim=V[b+7],warm=V[b+8],lenm=V[b+9];
  var kr=1-.16*tight,px=cx+rx*kr*co,py=cy+ry*kr*si+sag*.15*ry*(.5+.5*si);
  var nx=co/g.rx,ny=si/g.ry,nl=Math.sqrt(nx*nx+ny*ny)||1;nx/=nl;ny/=nl;
  var push=tl*1.25*w,rb=0;
  for(var r=0;r<FD.rip.length;r++){var R=FD.rip[r],age=FD.t-R.t0;if(age<0)continue;
   var mr=Math.max(rx,ry),front=age*mr*1.8,d=Math.sqrt((px-R.x)*(px-R.x)+(py-R.y)*(py-R.y)),ww=.16*mr;
   rb+=R.amp*Math.exp(-Math.pow((d-front)/ww,2))*Math.exp(-age*1.4);}
  push+=tl*1.6*rb;
  var x0=px+nx*push,y0=py+ny*push,L=tl*lenm*(1+.45*Math.abs(w)+.6*rb);
  var wd=FD.door,wf=FD.fseat<0?0:FD.hueF*Math.min(1,FD.lean)*(.28+(fd==null?0:.5*Math.exp(-Math.pow(angDiff(th,fd)/.9,2))));
  var lw=2,col,wm=Math.max(wd,wf);
  if(wd>=wf)col=mixA(INK,PALRGB[Math.min(6,Math.floor(j/16))],wd,lerp(.4*dim,.75,wd)*ambA);
  else col=mixA(INK,PALRGB[FD.fseat],wf,lerp(.4*dim,.82,wf)*ambA);
  if(warm>.01&&wm<.5){var wc=lerp(0,.35,warm);col=mixA(INK,AMBER,wc,.4*dim*ambA+.1*warm);}
  if(FD.lit[j]){col=rgba(INK,.85);}
  if(j===FD.litCur){col=PAL[o.litSeat==null?0:o.litSeat];lw=3;L*=1.5;}
  c.globalAlpha=al;c.strokeStyle=col;c.lineWidth=lw;
  c.beginPath();c.moveTo(x0,y0);c.lineTo(x0+nx*L,y0+ny*L);c.stroke();}
 c.globalAlpha=1;
 /* the ripple's own ring, so the wave can be seen between the figure and the ticks. ink at 18 percent, fading as it spreads */
 for(var q=0;q<FD.rip.length;q++){var Q=FD.rip[q],ag=FD.t-Q.t0;if(ag<0)continue;
  var fr=ag*Math.max(rx,ry)*1.8,fa=.18*Math.exp(-ag*1.4)*Q.amp;
  if(fa>.01){c.globalAlpha=fa*al;c.strokeStyle=rgba(INK,1);c.lineWidth=1;c.beginPath();c.arc(Q.x,Q.y,fr,0,TAU);c.stroke();}}
 c.globalAlpha=1;
 /* the motes: 28 points that drift on the tide, and gather on the side the person leans toward. Position is the data. */
 if(o.motes!==false){
  var pf=fpt,hh=POSE.cur.h;
  FD.motes.forEach(function(m){
   var gx=cx+rx*m.rm*Math.cos(m.a),gy=cy+ry*m.rm*Math.sin(m.a),x=gx,y=gy,gs=m.g;
   if(pf&&gs>.001){var rr=(.05+.1*m.f)*hh,ox=pf.x+Math.cos(m.a)*rr,oy=pf.y+Math.sin(m.a)*rr*.8,dx=ox-gx,dy=oy-gy,d=Math.sqrt(dx*dx+dy*dy)||1,bend=.14*d*Math.sin(Math.PI*gs);
    x=lerp(gx,ox,gs)+(-dy/d)*bend;y=lerp(gy,oy,gs)+(dx/d)*bend;}
   var a=(m.al*(.7+.3*Math.sin(m.ph+(STILL?0:S.ringT*.4)))+.3*gs)*al;
   c.globalAlpha=Math.min(.85,a);c.fillStyle=gs>.35?mix(INK,PALRGB[FD.fseat],FD.hueF*.8):rgba(INK,1);
   c.beginPath();c.arc(x,y,m.sz*(1+.4*gs),0,TAU);c.fill();});
  c.globalAlpha=1;}
};
