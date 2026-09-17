
/* ---- DQ. the wash. the area of effect, behind everything. ----
   Five full canvas radial gradients on a 1600x1000 surface is eight million
   pixel operations. Painting that every frame cost 82ms of the 103ms a Field
   frame took, and under prefers-reduced-motion the output was byte identical
   every time and still repainted.

   The wash is a slow drift behind everything, so it does not need 60fps. Its
   clock is quantised to 12 steps a second and the whole paint is skipped when
   the inputs have not moved. Reduced motion pins the clock, so it paints once
   and never again. */
var AURA_SIG=null;
function drawAura(r){
 const w=bg.width,h=bg.height;
 const reach=lerp(.20,.58,r.CQ/100), dens=clamp(r.DQ/7,0,1);
 const t=REDUCED?0:Math.round(S.t*.09*12)/12;
 const op=((LIGHT()?.16:.15)+r.radiance*.24).toFixed(2);
 const sig=[w,h,op,reach.toFixed(3),dens.toFixed(3),r.benign?1:0,r.darkB,
            r.radiance.toFixed(3),LIGHT()?1:0,t].join('|');
 if(sig===AURA_SIG) return;
 AURA_SIG=sig;
 bgx.clearRect(0,0,w,h);
 bg.style.opacity=op;
 const warm=hx(r.benign?PAL.Heart:PAL.Root), lead=hx(PAL[r.darkB]);
 const gc=GOLDC();
 const gr0=bgx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.max(w,h)*reach);
 gr0.addColorStop(0,rgba(gc,.42*r.radiance));
 gr0.addColorStop(.34,rgba(gc,.12*r.radiance));
 gr0.addColorStop(1,rgba(gc,0));
 bgx.fillStyle=gr0;bgx.fillRect(0,0,w,h);
 [[.13+Math.sin(t)*.05,.19+Math.cos(t*.8)*.05],[.87+Math.cos(t*.7)*.05,.25+Math.sin(t)*.05],
  [.09,.83+Math.sin(t*.6)*.05],[.91,.79+Math.cos(t*.9)*.05]].forEach(function(xy,i){
  const c=i%2?warm:lead;
  const gr=bgx.createRadialGradient(xy[0]*w,xy[1]*h,0,xy[0]*w,xy[1]*h,Math.max(w,h)*(.28+dens*.36));
  gr.addColorStop(0,rgba(c,.40*dens));gr.addColorStop(1,rgba(c,0));
  bgx.fillStyle=gr;bgx.fillRect(0,0,w,h);});}

/* ---- CQ. the core. saturation and size are coherence. ---- */
function cqRamp(cq){
 var t=Math.max(0,Math.min(100,cq))/100;
 var ST=[[0.00,[46,20,20]],[0.25,[176,52,44]],[0.50,[226,150,52]],
         [0.75,[242,205,110]],[1.00,[255,248,214]]];
 for(var i=1;i<ST.length;i++){
  if(t<=ST[i][0]){var a=ST[i-1],b=ST[i],f=(t-a[0])/(b[0]-a[0]);
   return [Math.round(a[1][0]+(b[1][0]-a[1][0])*f),
           Math.round(a[1][1]+(b[1][1]-a[1][1])*f),
           Math.round(a[1][2]+(b[1][2]-a[1][2])*f)];}}
 return ST[ST.length-1][1];}
function solCore(r,base){
 const coh=r.CQ/100, breathe=REDUCED?0:Math.sin(S.t*1.4)*.05;
 /* below the median the soul shrinks. above it, it grows. 50 is neutral. */
 var sz = coh<0.5 ? lerp(0.34,0.72,coh/0.5) : lerp(0.72,1.06,(coh-0.5)/0.5);
 const cr0=base*sz*(1+breathe);
 var gc=cqRamp(r.CQ);
 /* the glow is earned. nothing below the median, then it opens out. */
 var glow = coh<=0.5 ? 0 : (coh-0.5)/0.5;
 const halo=g.createRadialGradient(CX,CY,cr0*.90,CX,CY,cr0*(1.18+glow*1.5));
 halo.addColorStop(0,rgba(mixc(gc,[255,255,255],.35),glow*0.92));
 halo.addColorStop(.14,rgba(gc,glow*0.6));
 halo.addColorStop(.42,rgba(mixc(gc,[0,0,0],.4),glow*0.18));
 halo.addColorStop(1,rgba(gc,0));
 g.fillStyle=halo;g.beginPath();g.arc(CX,CY,cr0*(1.18+glow*1.5),0,TAU);g.fill();
 g.beginPath();g.arc(CX,CY,cr0,0,TAU);g.fillStyle=rgba(gc,1);g.fill();
 g.lineWidth=Math.max(1.2,cr0*.05);g.strokeStyle=rgba(mixc(gc,[0,0,0],.45),.9);g.stroke();
 var sh=g.createRadialGradient(CX-cr0*.3,CY-cr0*.42,cr0*.04,CX-cr0*.1,CY-cr0*.15,cr0*.95);
 sh.addColorStop(0,rgba(mixc(gc,[255,255,255],.4),.45));
 sh.addColorStop(.55,rgba(gc,0));
 g.fillStyle=sh;g.beginPath();g.arc(CX,CY,cr0,0,TAU);g.fill();
 g.beginPath();g.arc(CX-cr0*.3,CY-cr0*.36,cr0*.24,0,TAU);
 g.fillStyle='rgba(255,255,252,'+lerp(.28,.85,coh).toFixed(2)+')';g.fill();
 g.beginPath();g.arc(CX,CY,cr0,0,TAU);
 g.strokeStyle=rgba(mixc(gc,[255,255,255],.5),lerp(.4,.95,coh));g.lineWidth=1.4;g.stroke();
 txt(String(Math.round(r.CQ)),CX,CY+cr0*.02,Math.max(13,Math.round(cr0*.58)),
  [26,20,8],lerp(.55,.95,coh),500);
 HIT.push({k:'core',x:CX,y:CY,rad:cr0*1.5});
 return cr0;}

/* SIX ARROWS at the core. three higher gates up, three lower gates down.
   Each begins outside the halo and runs toward the laws, its length the
   share of the story that ran through that gate, and it carries its word
   and its percent at the tip. They were short, faint and unlabelled, and
   the halo drew over their roots, so nobody could see them. */
function verpArrows(cr0){
 var V=verpRead(), evid=V.some(function(v){return v.pct>0;});
 if(!evid) V=V.map(function(v){return {k:v.k,nm:v.nm,side:v.side,mult:v.mult,pct:17,n:0};});
 var hi=V.filter(function(v){return v.side==='higher';});
 var lo=V.filter(function(v){return v.side==='lower';});
 var ink=INK();
 var lawR0=[U*.44,U*.40,U*.33,U*.255][S.view], Lmax=lawR0-U*.045, Lmin=cr0*1.45;
 function arrow(v,i,n,up){
  var a=(up?-Math.PI/2:Math.PI/2)+(i-(n-1)/2)*0.66;
  var L=Math.max(Lmin,Math.min(Lmax,Lmin+(Lmax-Lmin)*(0.42+0.58*v.pct/100)));
  var x1=CX+Math.cos(a)*cr0*1.22, y1=CY+Math.sin(a)*cr0*1.22;
  var x2=CX+Math.cos(a)*L,        y2=CY+Math.sin(a)*L;
  var c=up?hx(PAL.Heart):hx(PAL.Root);
  var al=evid?(.55+v.pct/100*.45):.38;
  g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);
  g.strokeStyle=rgba(c,al);g.lineWidth=1.6+v.pct/100*2.4;g.lineCap='round';g.stroke();g.lineCap='butt';
  var hd=4.5+v.pct/100*4;
  g.beginPath();g.moveTo(x2,y2);
  g.lineTo(x2-Math.cos(a-0.42)*hd, y2-Math.sin(a-0.42)*hd);
  g.lineTo(x2-Math.cos(a+0.42)*hd, y2-Math.sin(a+0.42)*hd);
  g.closePath();g.fillStyle=rgba(c,al);g.fill();
  /* the word, and the percent when there is a story to count */
  var lx=CX+Math.cos(a)*(L+9), ly=CY+Math.sin(a)*(L+9), cs=Math.cos(a);
  g.save();g.font='500 11px Lexend, system-ui, sans-serif';
  g.textAlign=Math.abs(cs)<.25?'center':(cs>0?'left':'right');g.textBaseline='middle';
  g.fillStyle=rgba(ink,evid?.85:.5);
  g.fillText(v.nm+(evid?' '+v.pct+'%':''),lx,ly+(up?-4:4));g.restore();
  HIT.push({k:'gate',v:v,x:(x1+x2)/2,y:(y1+y2)/2,rad:Math.max(14,(L-cr0*1.22)/2)});
  HIT.push({k:'gate',v:v,x:lx+(cs>0?28:cs<0?-28:0),y:ly,rad:30});}
 hi.forEach(function(v,i){arrow(v,i,hi.length,true);});
 lo.forEach(function(v,i){arrow(v,i,lo.length,false);});
 if(evid){
  var top=V.slice().sort(function(a,b){return b.pct-a.pct;})[0];
  if(top.pct>=34){
   txt('defaults to '+top.nm.toLowerCase(),CX,CY+cr0*3.2+22,13,
    top.side==='higher'?hx(PAL.Heart):hx(PAL.Root),.95,600);
   txt('costs \u00d7'+top.mult.toFixed(2)+' on everything held',CX,CY+cr0*3.2+38,11,INK(),.5,400);}}}

/* ============================================================
   THE WHEEL, four depths. A complexity ladder, not four skins.
   Each step adds exactly one named layer. D is the maximum.
   The three quotients own three elements at every depth:
     CQ  the core, and how far the light reaches
     DQ  the wash, area of effect
     SQ  depth of any single segment
   ============================================================ */
const VIEWS=[
 {k:'A',nm:'Field',      layers:'core · 108 addresses · wash'},
 {k:'B',nm:'Firing',     layers:'A + band names + saboteurs'},
 {k:'C',nm:'Compounding',layers:'B + complexes, hyper, character, archetypes'},
 {k:'D',nm:'Everything', layers:'C + 19 domains + 6 masks + 21 laws'}];
function nzAng(a){while(a<-Math.PI)a+=TAU;while(a>Math.PI)a-=TAU;return a;}
function drawWheel(r,L){
 const ink=INK(),p=S.pin,gc=GOLDC();
 const shellR=[U*.62,U*.68,U*.74,U*.78][L];
 const R={shell:shellR,arch:U*.60,sab:[0,U*.56,U*.545,U*.50][L],cx:U*.425,hy:U*.335,
  sup:U*.255,dom:U*.93,mask:U*.685};
 const coreBase=[U*.30,U*.26,U*.20,U*.155][L];

 /* --- chain chords, C and D --- */
 if(L>=2){
  const lit=o=>{if(!p||p===o)return 1;const has=x=>x===o||(x.parts||[]).some(has);return has(p)?1:.08;};
  const quad=(a0,r0,a1,r1,pull,st,w,dash)=>{const am=meanAng([a0,a1]),rm=(r0+r1)/2*pull;
   g.beginPath();g.moveTo(CX+Math.cos(a0)*r0,CY+Math.sin(a0)*r0);
   g.quadraticCurveTo(CX+Math.cos(am)*rm,CY+Math.sin(am)*rm,CX+Math.cos(a1)*r1,CY+Math.sin(a1)*r1);
   if(dash)g.setLineDash(dash);g.strokeStyle=st;g.lineWidth=w;g.stroke();g.setLineDash([]);};
  r.sabs.forEach(s=>s.parts.forEach(n=>quad(n.ang,R.shell*.92,s.ang,R.sab,.42,
   rgba(bc(n.b),.46*lit(s)),1.6,s.unnamed?[3,3]:null)));
  r.cxs.forEach(c=>c.parts.forEach(s=>quad(s.ang,R.sab,c.ang,R.cx,.44,rgba(bc('Solar'),.62*lit(c)),2.4)));
  r.hys.forEach(h=>h.parts.forEach(c=>quad(c.ang,R.cx,h.ang,R.hy,.46,rgba(bc('Sacral'),.74*lit(h)),3.2)));
  r.sups.forEach(u=>u.parts.forEach(h=>quad(h.ang,R.hy,u.ang,R.sup,.48,rgba(bc('Root'),.9*lit(u)),4)));
 }else if(L===1){
  r.sabs.forEach(s=>s.parts.forEach(n=>{
   g.beginPath();g.moveTo(CX+Math.cos(n.ang)*R.shell*.92,CY+Math.sin(n.ang)*R.shell*.92);
   g.lineTo(CX+Math.cos(s.ang)*R.sab,CY+Math.sin(s.ang)*R.sab);
   g.strokeStyle=rgba(bc(n.b),.24);g.lineWidth=1;g.stroke();}));}

 const cr0=solCore(r,coreBase);
 verpArrows(cr0);

 /* --- the 21 laws. present at every depth: they are the numerator of CQ. --- */
 SI.forEach((l,i)=>{const a=i/21*TAU-Math.PI/2,v=S.law[l.nm]/10,c=bc(l.b);
  const r0=[U*.44,U*.40,U*.33,U*.255][L],r1=r0+[U*.13,U*.12,U*.10,U*.085][L]*v;
  g.beginPath();g.moveTo(CX+Math.cos(a)*r0,CY+Math.sin(a)*r0);
  g.lineTo(CX+Math.cos(a)*r1,CY+Math.sin(a)*r1);
  g.strokeStyle=rgba(c,.16+v*.82);g.lineWidth=[4.6,4.2,3.6,3.2][L];
  g.lineCap='round';g.stroke();g.lineCap='butt';
  HIT.push({k:'law',j:i,cx:CX,cy:CY,a0:a-.075,a1:a+.075,r0:r0*.88,r1:r1+U*.03});});
 const lr=[U*.44,U*.40,U*.33,U*.255][L];
 g.beginPath();g.arc(CX,CY,lr,0,TAU);g.strokeStyle=rgba(ink,.12);g.lineWidth=1;g.stroke();
 pill('21 laws · integrity '+r.Ig.toFixed(1),lr-U*.035);
 if(L===0){txt('CQ',CX,CY+cr0*1.75,13,gc,.9,600);txt(r.tier,CX,CY+cr0*2.3,12.5,ink,.62,400);}

 /* --- archetypes, C and D --- */
 if(L>=2){for(let j=0;j<12;j++){
  const a0=j*30/360*TAU-Math.PI/2,a1=a0+30/360*TAU,v=r.aff[j],am=(a0+a1)/2;
  const lead=j===r.pi,sec=j===r.si;
  arcP(R.arch-U*.016,R.arch,a0+.012,a1-.012);
  g.fillStyle=rgba(gc,lead?.55+v*.4:sec?.28+v*.28:.05+v*.1);g.fill();
  radialTxt(ARCH[j].nm,am,R.arch-U*.048,lead?13:11.5,lead?gc:ink,lead?1:sec?.78:.32,lead?600:400);
  HIT.push({k:'arch',j,cx:CX,cy:CY,a0,a1,r0:R.arch-U*.07,r1:R.arch+4});}
  pill('12 archetypes',R.arch+13);}

 /* --- masks, D only --- */
 if(L===3){r.maskRing.forEach((m,i)=>{
  const a0=i/6*TAU-Math.PI/2,a1=a0+TAU/6,v=clamp(m.w/10,0,1),am=(a0+a1)/2;
  arcP(R.mask-U*.019,R.mask,a0+.01,a1-.01);
  g.fillStyle=rgba(LIGHT()?[110,96,64]:[224,214,186],.06+v*.5);g.fill();
  radialTxt(m.nm,am,R.mask-U*.05,11.5,ink,.24+v*.56,400);
  HIT.push({k:'mk',o:m,cx:CX,cy:CY,a0,a1,r0:R.mask-U*.056,r1:R.mask+3});});
  pill('6 masks',R.mask+13);}

 /* --- THE SHELL. 108 addresses. SQ. present at every depth. --- */
 W.forEach(n=>{const a=n.ang,hw=TAU/108*.43,ld=clamp(n.disp/10,0,1);
  const d=U*.016+ld*U*.088,c=nodeCol(n),r0=R.shell-d;
  arcP(r0,R.shell,a-hw,a+hw);
  const gr=g.createRadialGradient(CX,CY,r0,CX,CY,R.shell);
  gr.addColorStop(0,rgba(mixc(c,[0,0,0],LIGHT()?.05:.36),n.disp>=4?.34+ld*.6:.08));
  gr.addColorStop(1,rgba(mixc(c,[255,255,255],.44),n.disp>=4?.7:.15));
  g.fillStyle=gr;g.fill();
  if(n.disp>=6.5){g.shadowColor=rgba(c,.9);g.shadowBlur=16;g.fill();g.shadowBlur=0;}
  if(n.disp>=9){g.strokeStyle=rgba(hx('#FF2E1F'),.85);g.lineWidth=1.4;g.stroke();}
  if(S.hover===n||S.pin===n){g.strokeStyle=rgba(gc,1);g.lineWidth=2;g.stroke();}
  HIT.push({k:'node',n,cx:CX,cy:CY,a0:a-hw,a1:a+hw,r0:R.shell*.85,r1:R.shell*1.02});});
 pill('112 addresses · SQ · '+r.loaded.length+' loaded',R.shell+14);
 if(L>=1)BANDS.forEach(b=>{const seg=W.filter(n=>n.b===b);
  radialTxt(b,meanAng(seg.map(n=>n.ang)),R.shell*1.058,12,bc(b),.9,600);});

 /* --- domains, D only --- */
 if(L===3){for(let d=0;d<19;d++){
  const a0=d*(TAU/19)-Math.PI/2,a1=a0+TAU/19,am=a0+TAU/38;
  const c=hx(ROOTCOL[DOMAINS[d].r]),sel=S.doms.indexOf(d)>=0,v=DOMAIN[d];
  arcP(R.dom-U*.012,R.dom,a0+.008,a1-.008);g.fillStyle=rgba(c,sel?.95:.08+v*.45);g.fill();
  radialTxt(DOMAINS[d].nm,am,R.dom-U*.032,sel?12.5:11,sel?c:ink,sel?1:.3+v*.45,sel?600:400);
  HIT.push({k:'dom',j:d,cx:CX,cy:CY,a0,a1,r0:R.dom-U*.055,r1:R.dom+4});}
  pill('19 domains · '+DOMAINS[S.dom].r,R.dom+14);}

 /* --- beads. B shows saboteurs. C and D show the whole chain. --- */
 function bead(o,rad,size,c){const x=CX+Math.cos(o.ang)*rad,y=CY+Math.sin(o.ang)*rad;
  const on=S.hover===o||S.pin===o,s=size*(on?1.45:1);
  if(on){const gr=g.createRadialGradient(x,y,0,x,y,s*3.4);
   gr.addColorStop(0,rgba(c,.5));gr.addColorStop(1,rgba(c,0));g.fillStyle=gr;
   g.beginPath();g.arc(x,y,s*3.4,0,TAU);g.fill();}
  const b2=g.createRadialGradient(x-s*.35,y-s*.4,s*.06,x,y,s);
  b2.addColorStop(0,rgba(mixc(c,[255,255,255],.72),1));b2.addColorStop(.5,rgba(c,1));
  b2.addColorStop(1,rgba(mixc(c,[0,0,0],.45),1));
  g.fillStyle=b2;g.beginPath();g.arc(x,y,s,0,TAU);g.fill();
  g.beginPath();g.arc(x-s*.32,y-s*.36,s*.24,0,TAU);g.fillStyle='rgba(255,255,255,.7)';g.fill();
  if(on)radialTxt(o.nm,o.ang,rad+s+16,12.5,ink,.95,600);
  HIT.push({k:o.kind,o,x,y,rad:s+10});}
 /* NAMEPLATES. Two patterns at nearly the same angle wrote over each other.
    A plate reserves an angular slot at its own radius. A newcomer gets two
    chances to clear by moving outward, and if it still collides it goes
    unlabelled: the bead still draws, and the name is in the right-hand list
    either way. plateHit is the single predicate the collision gate also uses. */
 const PLATES=[];
 /* the free radius: inside the archetype ring once it exists, else the stage. */
 const CEIL=(L>=2)?R.arch-U*0.05:U*1.02;
 /* A radial label runs OUTWARD from its anchor, so it occupies a radial
    interval [out, out + textLength], not a point. Comparing radii against a
    font-size was the error: two labels 20px apart on the same bearing still
    overlap when each is 100px long. Angular width is half a font-height at the
    label's own radius, and the radial extent is the measured text length. */
 window.plateLen=function(p){return p.fs*0.58*p.len;};
 window.plateHit=function(p,q){
  var da=Math.abs(nzAng(p.ang-q.ang));
  var angW=(p.fs*0.72)/Math.max(1,Math.min(p.out,q.out));   /* one line tall */
  if(da>=angW)return false;                                  /* different bearings */
  var p0=p.out,p1=p.out+window.plateLen(p);
  var q0=q.out,q1=q.out+window.plateLen(q);
  return p0<q1+4 && q0<p1+4;};
 /* horizontal plate for the inner rings. keeps its own occupied boxes so two
    inner names cannot sit on top of each other either. */
 const FLATS=[];
 const flatplate=(o,rad,c,size)=>{
  const fs=Math.max(12.5,size*1.25);
  const x=CX+Math.cos(o.ang)*rad, y=CY+Math.sin(o.ang)*rad;
  const right=Math.cos(o.ang)>=0;
  g.save();g.font='600 '+fs+'px Lexend, system-ui, sans-serif';
  const w=g.measureText(o.nm).width;g.restore();
  let lx=x+(right?1:-1)*(size+10), ly=y;
  for(let step=0;step<6;step++){
   const box={x0:right?lx:lx-w,x1:right?lx+w:lx,y0:ly-fs*0.7,y1:ly+fs*0.7};
   if(!FLATS.some(q=>box.x0<q.x1&&q.x0<box.x1&&box.y0<q.y1&&q.y0<box.y1)){
    FLATS.push(box);
    g.beginPath();g.moveTo(x+(right?1:-1)*size,y);g.lineTo(lx,ly);
    g.strokeStyle=rgba(c,.6);g.lineWidth=1;g.stroke();
    g.save();g.font='600 '+fs+'px Lexend, system-ui, sans-serif';
    g.textAlign=right?'left':'right';g.textBaseline='middle';
    g.fillStyle=rgba(c,.99);g.fillText(o.nm,lx,ly);g.restore();
    return;}
   ly += fs*1.45;}};
 const nameplate=(o,rad,c,size)=>{
  const fs=Math.max(12,size*1.5);
  let plate=null, out0=rad+size+9;
  for(let step=0;step<4;step++){
   const cand={ang:o.ang,out:out0,len:o.nm.length,fs:fs};
   if(!PLATES.some(q=>window.plateHit(cand,q))){plate=cand;break;}
   /* step past the far end of whatever is in the way */
   let far=out0;
   PLATES.forEach(q=>{if(window.plateHit(cand,q))far=Math.max(far,q.out+window.plateLen(q)+6);});
   out0=far;}
  if(!plate)return;                       /* no legible slot. the list carries it. */
  if(plate.out+window.plateLen(plate) > CEIL) return;   /* would run into the ring above */
  PLATES.push(plate);
  const x=CX+Math.cos(o.ang)*rad, y=CY+Math.sin(o.ang)*rad;
  const lx=CX+Math.cos(o.ang)*plate.out, ly=CY+Math.sin(o.ang)*plate.out;
  g.beginPath();g.moveTo(x+Math.cos(o.ang)*size,y+Math.sin(o.ang)*size);
  g.lineTo(lx,ly);g.strokeStyle=rgba(c,.55);g.lineWidth=1;g.stroke();
  radialTxt(o.nm,o.ang,plate.out+4,fs,c,.98,600);};
 window.__PLATES=PLATES;
 if(L>=1){r.sabs.forEach(s=>bead(s,R.sab,5.4,bc(s.parts[0].b)));
  /* B names the saboteurs, because they are the layer. C and D name only the
     heaviest things: the wheel is showing structure by then, and the right rail
     carries every name in full. */
  if(L===1)r.sabs.slice(0,6).forEach(s=>nameplate(s,R.sab,bc(s.parts[0].b),6.2));
  pill('saboteurs · '+r.sabs.length,R.sab+13);}
 if(L>=2){r.cxs.forEach(c=>bead(c,R.cx,7.2,bc('Solar')));
  r.hys.forEach(h=>bead(h,R.hy,10,bc('Sacral')));
  r.sups.forEach(u=>bead(u,R.sup,13,bc('Root')));
  /* the inner rings hold the heaviest, longest names. Radial text has no room
     between the hyper ring and the archetypes, so these set horizontally beside
     the bead, where there is space. */
  r.hys.slice(0,3).forEach(h=>flatplate(h,R.hy,bc('Sacral'),10));
  r.sups.slice(0,2).forEach(u=>flatplate(u,R.sup,bc('Root'),13));
  pill('complexes · '+r.cxs.length,R.cx+13);
  pill('hyper · '+r.hys.length,R.hy+13);
  if(r.sups.length)pill('character · '+r.sups.length,R.sup+13);}
}
/* Under prefers-reduced-motion the clock is frozen and disp snaps straight to
   sq, so after the first frame the wheel is provably identical until someone
   changes depth, hover, pin, theme or profile. It repainted a 922x913 surface
   of 112 gradient beads anyway, which is why reduced motion measured SLOWER
   than motion. Honouring the preference means not drawing, not drawing the
   same thing more cheaply. With motion on, the breathing is the point and
   every frame is drawn as before. */
var DRAW_SIG=null;
function drawSig(r){
 if(!REDUCED) return null;                 /* animating, always draw */
 var d=0; for(var i=0;i<W.length;i++)d+=W[i].sq;
 return [S.view,S.tab,S.who,S.hover&&S.hover.k,S.pin&&(S.pin.nm||S.pin.k),
         LIGHT()?1:0,S.legible?1:0,d.toFixed(3),r.CQ.toFixed(3)].join('|');}
function draw(r){
 W.forEach(n=>{n.disp=(n.disp===undefined?n.sq:(REDUCED?n.sq:n.disp+(n.sq-n.disp)*.14));});
 var sig=drawSig(r);
 if(sig!==null&&sig===DRAW_SIG) return;    /* nothing moved and nothing will */
 DRAW_SIG=sig;
 g.clearRect(0,0,CW,CH);HIT=[];
 drawWheel(r,S.view);}
