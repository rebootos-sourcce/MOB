/* ---------- the scene: one canvas, one person, one system ----------
   Everything a system draws is a pure function of time, the eased pose and the eased charges,
   so a frame strip is the same on every run and a still frame can be asked for at any second. */
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const Q=new URLSearchParams(location.search);
const MANUAL=Q.has('manual');              /* ?manual=1: no clock, the harness sets the time, for frame strips */
const sat=(a,b,v)=>clamp((v-a)/(b-a),0,1);
const saw=u=>u<.2?sstep(0,.2,u):1-sstep(.2,1,u);   /* a quick lunge and a slow return */
class Scene{
 constructor(host,sys,o){o=o||{};this.host=host;this.sys=sys;this.o=o;
  this.cv=document.createElement('canvas');this.cv.className='cv';host.insertBefore(this.cv,host.firstChild);this.g=this.cv.getContext('2d');
  this.dpr=Math.min(2,devicePixelRatio||1);this.t=0;this.small=o.small!==undefined?o.small:innerWidth<700;
  this.mask=o.mask||'Preteen';this.profKey=o.prof||'anger';this.carry=!!o.carry;this.kT=o.load!==undefined?o.load:1;
  /* coherence, 0 to 1. The light. It opens from nothing on arrival, so the page lights up as it lands. */
  this.cT=o.coh!==undefined?o.coh:1;this.c=Math.min(this.cT,.22);this.bc=null;
  this.sel=-1;this.hov=-1;this.ts=0;this.tsT=0;this.anchor=null;this.fade=.6;
  this.pc=new Array(9).fill(0);this.pv=Object.assign({},REST);this.m=0;this.L=0;
  this.hx=[];this.hy=[];this.hp=[];this.regN=0;this.sprites={};this.mem={};
  this.ready=false;this.lineup=!!o.lineup;this.W=0;this.H=0;
  this.setTarget();if(o.snap)this.snap();
  if(sys.init)sys.init(this);}
 get prof(){return PROFILES[this.profKey];}
 /* the weights this scene draws: the profile's own, scaled by the load */
 weights(){const w={};const p=this.prof.w;AX.forEach(a=>w[a.nm]=p[a.nm]*this.kT);
  /* carry: show the mask as if it were the one carrying the load, its own seats lifted to near the leader */
  if(this.carry){const M=MASKS.find(x=>x.nm===this.mask);let mx=0;AX.forEach(a=>mx=Math.max(mx,w[a.nm]));
   AX.forEach(a=>{if(M.b.indexOf(a.seat)>=0)w[a.nm]=Math.max(w[a.nm],.85*mx);});}
  return w;}
 setTarget(){const M=MASKS.find(x=>x.nm===this.mask);const w=this.weights();
  const r=mixPose(this.mask,w,this.sys.noMaskPose?{noMask:true}:{});this.tp=r.p;this.tm=r.m;this.tL=r.L;
  /* charges, seen through the mask: a seat the mask does not wear is held back to a third */
  this.tpc=AX.map(a=>Math.min(1,w[a.nm]/9)*(M.b.indexOf(a.seat)>=0?1:.34));
  this.lead=leadPat(w);this.per=M.per;this.col2=maskCols(M);}
 snap(){this.pv=Object.assign({},this.tp);this.m=this.tm;this.L=this.tL;this.pc=this.tpc.slice();this.fade=1;this.ready=true;this.c=this.cT;}
 set(o){if(o.coh!==undefined)this.cT=o.coh;if(o.carry!==undefined)this.carry=o.carry;if(o.mask!==undefined)this.mask=o.mask;if(o.prof!==undefined)this.profKey=o.prof;if(o.load!==undefined)this.kT=o.load;
  this.setTarget();if(this.sys.reset)this.sys.reset(this);}
 resize(){const r=this.host.getBoundingClientRect();const d=this.dpr,w=Math.round(r.width*d),h=Math.round(r.height*d);
  if(this.cv.width!==w||this.cv.height!==h){this.cv.width=w;this.cv.height=h;}this.W=w;this.H=h;this.w=r.width;this.h=r.height;this.mobile=r.width<700;}
 /* where the figure stands on the stage. the figure is two units tall, centre at its middle */
 layout(){const w=this.w,h=this.h;let cx,cy,k;
  if(this.lineup){k=(h-14)/2.1*(this.sys.lineK||1);return{cx:w/2,cy:h/2+(this.sys.lineY||0)*h,k};}
  if(!this.mobile){k=(h-120)/2.1;cx=w*(.5-.13*this.ts);cy=h*.5+4;}
  else{const top=80,bot=this.sel>=0?70:176;k=Math.min((h-top-bot)/2.1,w/2.9);cx=w/2;cy=top+(h-top-bot)/2;}
  return{cx,cy,k};}
 toFig(px,py){const L=this.Lo||this.layout();return[(px-L.cx)/L.k,(py-L.cy)/L.k];}
 ease(dt){const q=1-Math.exp(-dt*(this.ready?3.2:2.4));
  for(const k in this.tp)this.pv[k]+=(this.tp[k]-this.pv[k])*q;
  this.m+=(this.tm-this.m)*q;this.L+=(this.tL-this.L)*q;
  for(let i=0;i<9;i++)this.pc[i]+=(this.tpc[i]-this.pc[i])*q;
  this.fade=Math.min(1,this.fade+dt*1.5);
  /* the light comes up slower than the shape bends, and a beat later: the body gathers, then it is lit.
     going down is quicker than going up, a held breath is shorter than an exhale. */
  const lateT=Math.max(0,this.t-.25);const cq=1-Math.exp(-dt*(this.cT>this.c?1.5:2.2)*Math.min(1,lateT*3));
  this.c+=(this.cT-this.c)*cq;
  this.ts+=(this.tsT-this.ts)*(1-Math.exp(-dt*6));if(Math.abs(this.tsT-this.ts)<.002)this.ts=this.tsT;}
 update(dt){
  /* a person who asked the system for less motion gets the settled picture, held still */
  if(REDUCED){if(!this._r){this._r=1;this.snap();this.t=3.2;}return;}
  this.ease(dt);this.t+=dt;this.ready=true;}
 /* the idle motion each mask owns, at its own tempo. the person at rest only breathes. */
 posed(){const p=Object.assign({},this.pv),t=this.t,m=this.m,ph=this.ph=(t/this.per)%1,s=Math.sin(Math.PI*2*ph);
  const br=Math.sin(Math.PI*2*t/4.2);
  /* the plain person: a slow breath, a small sway */
  p.shL+=.025*br;p.shR+=.025*br;p.lean+=.006*Math.sin(Math.PI*2*t/9)*(1-m);p.headTilt+=.01*Math.sin(Math.PI*2*t/7.3)*(1-m);
  const a=Math.max(.2,m);
  if(this.sys.noMaskPose){/* this system draws the mask as a symbol, not as a posture */}
  else if(this.mask==='Child'){p.curl+=.05*s*a;p.headDrop+=.14*s*a;p.scale-=.01*s*a;}
  else if(this.mask==='Preteen'){p.headTurn+=.5*s*a;p.headTilt+=.05*s*a;p.shR+=.1*Math.sin(Math.PI*2*ph+1)*a;}
  else if(this.mask==='Teen'){const th=saw(ph);p.a1L+=.16*th*a;p.a2L+=.16*th*a;p.lean-=.035*th*a;p.shW+=.03*th*a;}
  else if(this.mask==='Adult'){/* steady. only the seam works: a slow tension, the halves leaning on each other */p.shear+=.03*s*a;p.headDrop+=.025*Math.sin(Math.PI*2*ph+1.2)*a;p.a1R+=.04*s*a;}
  else if(this.mask==='Ideological'){/* rigid: it does not move. the light moves across it. */}
  /* what the leading pattern adds, as small continuing motion */
  const l=this.lead,lw=this.pc[l];
  if(l===0)p.shL+=.012*Math.sin(t*31)*lw,p.shR+=.012*Math.sin(t*29)*lw;     /* Fear trembles */
  if(l===4)p.headDrop+=.01*Math.sin(t*.7)*lw;                                /* Apathy barely moves */
  if(l===1)p.shL+=.03*(.5+.5*Math.sin(Math.PI*2*t/2.2))*lw,p.shR+=.03*(.5+.5*Math.sin(Math.PI*2*t/2.2))*lw;
  return p;}
 /* the intro: every mark has its own late start so the page opens as a gathering */
 e(i,t0){const tt=this.t-(t0||0)-.04-hash(i,3)*.55;return sstep(0,1.15,tt);}
 /* the factor a pattern's marks take when one is selected or hovered */
 pa(p){if(this.sel>=0)return p===this.sel?1.18:(this.sys.dimTo||.26);if(this.hov>=0)return p===this.hov?1.12:.72;return 1;}
 /* brightness a pattern carries: charge, with a floor so a quiet one is still seen */
 bright(p){return .3+.7*Math.pow(Math.max(0,this.pc[p]),.8);}
 rgb(p,l){let c=PCOL[p];const q=this.pc[p];c=mixc([150,158,174],c,.5+.5*Math.min(1,q*1.15));return l?mixc(c,INK,l):c;}
 /* the colour of a place on the body, blended across the patterns that own it */
 rgbAt(x,y,l){const a=affs(x,y);let s=0,r=0,g=0,b=0;for(let i=0;i<9;i++){const w=a[i]*(.1+this.pc[i]);s+=w;const c=this.rgb(i,0);r+=c[0]*w;g+=c[1]*w;b+=c[2]*w;}
  const c=s?[r/s,g/s,b/s]:[150,158,174];return l?mixc(c,INK,l):c;}
 patAt(x,y){const a=affs(x,y);let b=0,bw=-1;for(let i=0;i<9;i++){const w=a[i]*(.1+this.pc[i]);if(w>bw){bw=w;b=i;}}return b;}
 /* mark registration, so a press finds the pattern that owns what it touched */
 reg(x,y,p){if((this.regN++&3)||this.hx.length>1800)return;this.hx.push(x);this.hy.push(y);this.hp.push(p);}
 near(px,py,max){let b=-1,bd=max*max;for(let i=0;i<this.hx.length;i++){const dx=this.hx[i]-px,dy=this.hy[i]-py,d=dx*dx+dy*dy;if(d<bd){bd=d;b=this.hp[i];}}return b;}
 originOf(p){let sx=0,sy=0,n=0;for(let i=0;i<this.hx.length;i++)if(this.hp[i]===p){sx+=this.hx[i];sy+=this.hy[i];n++;}
  if(!n)return null;sx/=n;sy/=n;let b=null,bd=1e18;for(let i=0;i<this.hx.length;i++)if(this.hp[i]===p){const d=(this.hx[i]-sx)**2+(this.hy[i]-sy)**2;if(d<bd){bd=d;b=[this.hx[i],this.hy[i]];}}return b;}
 /* a soft light, from a cached sprite */
 glow(x,y,r,rgb,a){const key=((rgb[0]/16)|0)+','+((rgb[1]/16)|0)+','+((rgb[2]/16)|0);let s=this.sprites[key];
  if(!s){s=document.createElement('canvas');s.width=s.height=64;const c=s.getContext('2d'),gr=c.createRadialGradient(32,32,0,32,32,32);
   const q=[(rgb[0]/16|0)*16+8,(rgb[1]/16|0)*16+8,(rgb[2]/16|0)*16+8];
   gr.addColorStop(0,css(q,1));gr.addColorStop(.35,css(q,.38));gr.addColorStop(1,css(q,0));c.fillStyle=gr;c.fillRect(0,0,64,64);this.sprites[key]=s;}
  const g=this.g,d=this.dpr;g.globalAlpha=clamp(a,0,1);g.drawImage(s,(x-r)*d,(y-r)*d,r*2*d,r*2*d);}
 dot(x,y,s,rgb,a){const g=this.g,d=this.dpr;g.globalAlpha=clamp(a,0,1);g.fillStyle='rgb('+(rgb[0]|0)+','+(rgb[1]|0)+','+(rgb[2]|0)+')';g.fillRect((x-s/2)*d,(y-s/2)*d,s*d,s*d);}
 render(){if(!this.W)this.resize();const g=this.g,d=this.dpr;
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;g.clearRect(0,0,this.W,this.H);
  if(this.sys.bg){g.fillStyle=this.sys.bg;g.fillRect(0,0,this.W,this.H);}
  const L=this.Lo=this.layout();this.hx.length=0;this.hy.length=0;this.hp.length=0;this.regN=0;
  const P=this.posed();this.fig=buildFig(P);this.P=P;
  this.k=L.k;this.cx=L.cx;this.cy=L.cy;
  g.globalCompositeOperation='lighter';
  this.sys.draw(this);
  g.globalAlpha=1;
  /* the glow: the picture blurred twice and laid back over itself, so lit points bleed light into each other.
     it is made by halving the canvas four times and drawing the small copies back up, which is a blur that costs
     almost nothing, and the amount is set by the system from the coherence. */
  if(this.sys.bloom){const b=this.sys.bloom(this);if(b&&(b[0]>.004||b[1]>.004))this.bloom(b[0],b[1]);}
  if(this.sel>=0&&this.anchor)this.thread();
  g.globalCompositeOperation='source-over';g.globalAlpha=1;}
 bloom(a1,a2){const W=this.W,H=this.H,g=this.g;
  if(!this.bc||this.bc.W!==W||this.bc.H!==H){const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(2,w|0);c.height=Math.max(2,h|0);
    const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';return{c,x,w:c.width,h:c.height};};
   this.bc={W,H,l:[mk(W/4,H/4),mk(W/16,H/16)]};}
  const L=this.bc.l;let src=this.cv;
  this.bf=(this.bf|0)+1;if(MANUAL||this.bf&1){for(let i=0;i<2;i++){const q=L[i];q.x.globalCompositeOperation="copy";q.x.drawImage(src,0,0,q.w,q.h);src=q.c;}}
  g.save();g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='lighter';g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  g.globalAlpha=Math.min(1,a1);g.drawImage(L[0].c,0,0,W,H);g.globalAlpha=Math.min(1,a2);g.drawImage(L[1].c,0,0,W,H);g.restore();}
 /* figure units to css px */
 X(x){return this.cx+x*this.k;}
 Y(y){return this.cy+y*this.k;}
 thread(){const g=this.g,d=this.dpr;const o=this.originOf(this.sel);if(!o)return;const A=this.anchor,t=this.t;
  const col=PCOL[this.sel];const x0=o[0]*d,y0=o[1]*d,x1=A[0]*d,y1=A[1]*d;
  const bend=this.mobile?[x0,y0+(y1-y0)*.55,x1,y1-(y1-y0)*.25]:[x0+(x1-x0)*.35,y0-(y0-y1)*.05-40*d,x0+(x1-x0)*.6,y1];
  const pt=u=>{const v=1-u;return[v*v*v*x0+3*v*v*u*bend[0]+3*v*u*u*bend[2]+u*u*u*x1,v*v*v*y0+3*v*v*u*bend[1]+3*v*u*u*bend[3]+u*u*u*y1];};
  let len=0,prev=pt(0);for(let i=1;i<=40;i++){const q=pt(i/40);len+=Math.hypot(q[0]-prev[0],q[1]-prev[1]);prev=q;}
  const step=5.2*d,m=Math.max(8,Math.floor(len/step));const pulse=(t*.22)%1;
  g.globalCompositeOperation='lighter';const hot=mixc(col,INK,.55);
  for(let i=0;i<=m;i++){const u=i/m,q=pt(u);const near=Math.exp(-Math.pow((u-pulse)/.05,2));
   const a=.38+.25*Math.sin(u*Math.PI)+near*.6,s=(1.5+near*2.2)*d;
   g.globalAlpha=Math.min(1,a);g.fillStyle=css(mixc(col,hot,near));g.fillRect(q[0]-s/2,q[1]-s/2,s,s);
   if(i%2===0){const nx=Math.sin(i*12.9)*3*d,ny=Math.cos(i*7.1)*3*d;g.globalAlpha=.28;g.fillStyle=css(col);g.fillRect(q[0]+nx,q[1]+ny,1.3*d,1.3*d);}}
  g.globalAlpha=.9;g.lineWidth=1.4*d;g.strokeStyle=css(hot);g.beginPath();g.arc(x0,y0,11*d,0,Math.PI*2);g.stroke();
  g.globalAlpha=.35;g.strokeStyle=css(col);g.beginPath();g.arc(x0,y0,19*d,0,Math.PI*2);g.stroke();
  g.globalAlpha=.9;g.strokeStyle=css(hot);g.beginPath();g.arc(x1,y1,5*d,0,Math.PI*2);g.stroke();g.globalAlpha=1;}}
