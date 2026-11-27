/* THE 112 ADDRESSES, AND WHAT THE POINTS ROUND THE BODY MEAN.
   Answer to "what do the points around the body represent?": each outer point is one of the product's 112 addresses.
   NODES112 is copied by the build out of atuned_src/engine/data/nodes.js (read only): the address number, its name, its seat, its
   plexus or nerve and its charge channel. 108 are somatic, seated at a plexus. 4 are field anchors, two above the head and two
   below the feet. Each point sits round the body at the height of its seat, orbiting the spine. Brightness and size are its charge.
   The charge model below is the engine's own, written out for the mock (compute.js, compute()):
       held = channel charge * susceptibility * (1 - relief * 0.42)       relief is the seat's integrity, here the coherence
       sq   = held minus what the installed opposite has replaced          nothing replaced in the mock, so sq is held
   and the four anchors take the mean sq of the seat they extend: the two above the Crown's, the two below the Root's, which is the
   engine's ruling of 25 September ("his torus"). The mock builds the channel charges from the profile's nine weights and from any
   story entries written on the page. The real engine gets them from the sniffer. */
const SEATI={Root:0,Sacral:1,Solar:2,Heart:3,Throat:4,'3rd Eye':5,Crown:6};
const SEATBAND=[[.06,.95],[-.2,-.04],[-.38,-.22],[-.6,-.4],[-.8,-.66],[-.97,-.84],[-1.17,-.98]];
const PROPER={God:1,Sol:1,Star:1,Gaia:1,Earth:1,Stellar:1,Gateway:1};
function sent(s){if(/^Root_08/.test(s))return'Unnamed, Root 08';const w=s.replace(/_/g,' ').split(' ');
 return w.map((x,i)=>i===0?x.charAt(0).toUpperCase()+x.slice(1).toLowerCase():(PROPER[x]?x:x.toLowerCase())).join(' ');}
const ADDR=NODES112.map(r=>{const i=r[0],b=r[2],fld=b.indexOf('Field')===0,above=b==='Field-Above',seat=fld?(above?6:0):SEATI[b];
 const bd=SEATBAND[seat];
 return{i,k:fld?r[1]:sent(r[1]),b:fld?(above?'Above the head':'Below the feet'):b,plex:r[3]?sent(r[3]):'',c:r[4],seat,fld,above,
  susc:.55+.9*hash(i,61),base:.3*hash(i,70),a0:hash(i,63)*6.2832,rr:hash(i,64),
  yr:fld?0:bd[0]+(bd[1]-bd[0])*hash(i,62),ax:(hash(i,65)*2-1)*.17};});
const BYSEAT=[0,1,2,3,4,5,6].map(k=>ADDR.map((a,j)=>a.seat===k&&!a.fld?j:-1).filter(j=>j>=0));
const FIELDI=ADDR.map((a,j)=>a.fld?j:-1).filter(j=>j>=0);
/* the entries a person writes. each is what the sniffer would read out of it: a charge on one or more channels. */
const STORIES=[
 {id:'a',date:'3 Oct',text:'He rewrote my section and sent it on without asking. I said fine. Jaw tight for an hour.',add:{Anger:6.5,Resentment:2.5},seat:2,short:'Rewrote my section'},
 {id:'b',date:'3 Oct',text:'Sat in the car outside the house for twenty minutes. Did not go in.',add:{Sadness:6,Fear:2.5},seat:3,short:'Sat in the car'},
 {id:'c',date:'3 Oct',text:'Lay awake rehearsing the call. Stomach held until it was over.',add:{Fear:6.5},seat:0,short:'Rehearsing the call'}];
function addrCharges(sc){const w=sc.weights(),CH={Fear:w.Fear,Anger:w.Anger,Shame:w.Shame,Disgust:w.Disgust,Shock:w.Shock,Sadness:w.Sad,Joy:.5*(w.Surprise+w.Anticipation),Resentment:.25*w.Anger+.2*w.Apathy};
 (sc.stories||[]).forEach(st=>{for(const k in st.add)CH[k]=(CH[k]||0)+st.add[k];});
 const out=new Float32Array(112),relief=.42*sc.cT,kT=sc.kT;let sC=0,nC=0,sR=0,nR=0;
 ADDR.forEach((a,j)=>{if(a.fld)return;let v=a.c?CH[a.c]*a.susc*(1-relief):0;v+=a.base*kT;v=clamp(v,0,10)/10;out[j]=v;if(a.seat===6){sC+=v;nC++;}if(a.seat===0){sR+=v;nR++;}});
 ADDR.forEach((a,j)=>{if(a.fld)out[j]=a.above?sC/nC:sR/nR;});
 return out;}
/* the heaviest address of a seat, preferring one whose channel the given story wrote to */
function topAddr(sc,seat,chan){let b=-1,bv=-1;BYSEAT[seat].forEach(j=>{const v=sc.achT[j]+(chan&&ADDR[j].c===chan?.5:0);if(v>bv){bv=v;b=j;}});return b;}
/* the body's own spine, as a polyline from the feet to the head, in the current pose and in the rest pose, so a seat height on the
   rest figure can be carried to wherever that seat is now. */
const RJ=buildFig(REST).J,RESTRY=[(RJ.AL[1]+RJ.AR[1])/2,RJ.P[1],RJ.m2[1],RJ.m1[1],RJ.S0[1],RJ.nt[1],RJ.head[1]];
function spineNow(sc){const J=sc.fig.J,sp=sc.sp||(sc.sp={x:new Float32Array(7),y:new Float32Array(7),ry:RESTRY});
 const n=[[(J.AL[0]+J.AR[0])/2,(J.AL[1]+J.AR[1])/2],J.P,J.m2,J.m1,J.S0,J.nt,J.head];for(let i=0;i<7;i++){sp.x[i]=n[i][0];sp.y[i]=n[i][1];}return sp;}
const _sp=[0,0,0,0];
function spineAt(sp,yr,o){const ry=sp.ry;let i=0;while(i<5&&yr<ry[i+1])i++;const f=(yr-ry[i])/(ry[i+1]-ry[i]);
 const dx=sp.x[i+1]-sp.x[i],dy=sp.y[i+1]-sp.y[i],l=Math.hypot(dx,dy)||1;o[0]=sp.x[i]+dx*f;o[1]=sp.y[i]+dy*f;o[2]=dx/l;o[3]=dy/l;}
const RBW=[[-1.2,.0],[-1.0,.1],[-.88,.11],[-.8,.06],[-.74,.17],[-.6,.28],[-.4,.25],[-.2,.21],[0,.23],[.2,.22],[.9,.2],[1.0,.12]];
function halfW(y){if(y<=RBW[0][0])return RBW[0][1];for(let i=0;i<RBW.length-1;i++){const a=RBW[i],b=RBW[i+1];if(y<=b[0])return a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0]);}return .12;}
/* where address j is now, in figure units: x, y and z (toward the viewer is positive) */
const _ap=[0,0,0];
function addrXY(sc,a,orb,o){const F=sc.fig;
 if(a.fld){const hd=F.J.head,fy=(F.J.AL[1]+F.J.AR[1])/2,idx=a.i-109;/* 109 Sol Star, 110 Stellar Gateway, 111 Earth Star, 112 Gaia Gateway */
  const ys=[-1.2,-1.35,1.08,1.25];o[0]=(idx<2?hd[0]:0)*.6+.01*Math.sin(sc.t*.5+idx);o[1]=ys[idx];o[2]=0;return o;}
 spineAt(sc.sp,a.yr,_sp);const tx=_sp[2],ty=_sp[3],nx=-ty,ny=tx;
 const r=halfW(a.yr)*F.scale+.1+.3*a.rr,ang=a.a0+orb;
 o[0]=_sp[0]+nx*r*Math.cos(ang);o[1]=_sp[1]+ny*r*Math.cos(ang)+r*.16*Math.sin(ang);o[2]=Math.sin(ang);return o;}
/* draw the 112. the colour of each is sampled from the air at the place it sits. */
const SZ_A=[.82,.95,1.08,1.25,1.45];
function drawAddrs(sc,ss){const g=sc.g,d=sc.dpr,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c,air=sc.air,DB=sc.mem.DA;DB.reset();
 const light=.1+.9*Math.pow(c,1.1),size=(sc.lineup?1.7:sc.mobile?2:2.3);
 const orb=[];for(let s=0;s<7;s++)orb.push(sc.acc('orb'+s,(.05+.2*sc.c)*(1-.55*ss.sh[s])));
 const rings=[];
 for(let j=0;j<112;j++){const a=ADDR[j],ch=sc.ach[j];addrXY(sc,a,orb[a.seat],_ap);const x=_ap[0],y=_ap[1],z=_ap[2];
  const f=.6+.4*(z+1)/2;let b=(.14+.86*Math.pow(ch,.8))*light*f;
  if(sc.sel>=0)b*=a.seat===sc.sel?1.3:.3;
  const px=cx+x*k,py=cy+y*k;sc.AP.push([px,py,j]);
  const lv=Math.min(4,(b*5.2)|0);if(b<.03)continue;
  DB.add(px,py,air.binAt(x,y),lv,(.8+.2*f)*(.75+1.6*Math.pow(ch,.8)));
  if(ch>.42&&b>.12){const rgb=air.rgbAt(x,y);sc.glow(px,py,(6+14*ch)*(sc.lineup?.7:1),rgb,.34*b*ch);}
  if(a.fld||ch>.68){rings.push([px,py,x,y,ch,b,a.fld]);}}
 DB.flush(g,d,COLQ,AQ,SQ5,size);
 g.lineWidth=1.1*d;
 for(const q of rings){const rgb=air.rgbAt(q[2],q[3]);g.globalAlpha=Math.min(1,.55*q[5]+.1);g.strokeStyle=css(mixc(rgb,INK,.25));g.beginPath();
  g.arc(q[0]*d,q[1]*d,(q[6]?6+7*q[4]:3.5+size*.5+3*q[4])*d,0,6.2832);g.stroke();}
 g.globalAlpha=1;}
