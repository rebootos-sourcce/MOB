/* ============================================================
   PAIN AND PATTERN, ON ONE MAP. The body map prototype, round GV.

   One canvas, four passes a frame:
     1. the still layer, cached: grid, the man, the nerves, the seats. Redrawn
        only when the camera or the dulling moves, never for a pulse.
     2. the heat, over the nerves, as he asked: "the heat map should overlay
        the nerve and chakra map".
     3. what the heat reveals (switch B only): the nerves under the pain, lit.
     4. the live layer: pain lines, saboteur lines, the addresses, labels.

   THE THREE SWITCHES. Going from Pattern to Pain dulls the nerve and seat
   map and raises the heat. How much, where, and in what order is the open
   question, and each switch answers it once:
     A  Fade. Everything under the heat dims evenly, and the heat rises with
        it. The literal reading of his sentence.
     B  Reveal. The map dims everywhere the pain is not. Under the pain the
        nerves stay lit, so the heat shows which nerve carries it. The
        ground steps back first and the heat arrives after it.
     C  Isotherm. The map dims a little and the heat comes in as bands, the
        way a thermal camera draws it, one band at a time from cool to hot.

   THE SABOTEUR LINES, from the Field's own finish (d-fringe.html): each
   saboteur is a cable through the three addresses that built it (SAB_LIB).
   Slack sags, taut runs straight and hums, and the hum is a string pinned at
   its anchors, so the addresses never move. Pulses run toward the heaviest
   address while the load rises and away while it falls. Past five an address
   throws the stress fringes the Field throws, born at the mark and travelling
   out while loading, sinking back while releasing. A pulse arriving kicks the
   mark on the Field's spring, w 14, damping .42, so it has mass.
   ============================================================ */
(function(){
'use strict';
var D=window.__DATA, TAU=Math.PI*2;
var SEAT={Root:'#C4635E',Sacral:'#D19255',Solar:'#D4BC70',Heart:'#6FC5A3',Throat:'#65B8D4','3rd Eye':'#8296DB',Crown:'#A98BCE'};
var FIGSEAT={'Crown seat':'Crown','Third eye seat':'3rd Eye','Throat seat':'Throat','Heart seat':'Heart','Solar seat':'Solar','Sacral seat':'Sacral','Root seat':'Root'};
var C={stage:[15,16,19],man:[22,24,30],edge:[239,237,232],grid:[40,43,52],ink:[230,231,234],dim:[154,156,164],acc:[126,184,212],
 cns:[239,237,232],auto:[126,184,212],som:[194,160,99],prop:[180,176,168],lit:[255,238,222],casing:[12,13,16]};
function hex(h){h=h.replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function rgba(c,a){return 'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+Math.max(0,Math.min(1,a)).toFixed(3)+')';}
function mix(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}
function grey(c,s){var l=0.299*c[0]+0.587*c[1]+0.114*c[2];return mix([l,l,l],c,s);}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function sstep(a,b,x){var t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);}
function eOut(t){return 1-Math.pow(1-t,3);}
function eIO(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
function frac(x){return x-Math.floor(x);}
function hash(n){var x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);}
var SEATC={};Object.keys(SEAT).forEach(function(k){SEATC[k]=hex(SEAT[k]);});

/* ---------- the switches ---------- */
var VAR={
 A:{nm:'Fade',on:{g:[0,400,eIO],h:[0,400,eIO]},
  dull:{nerve:.30,nsat:.15,seat:.30,ssat:.2,grid:.45,addr:.45,sab:.35},heatMax:.86,satLead:1,local:false,iso:false},
 B:{nm:'Reveal',on:{g:[0,260,eOut],h:[140,520,eOut]},
  dull:{nerve:.20,nsat:.25,seat:.50,ssat:.6,grid:.5,addr:.35,sab:.40},heatMax:.74,satLead:.5,local:true,iso:false},
 C:{nm:'Isotherm',on:{g:[0,300,eOut],h:[0,450,null]},
  dull:{nerve:.55,nsat:.40,seat:.60,ssat:.5,grid:.6,addr:.8,sab:.6},heatMax:.70,satLead:1,local:false,iso:true},
 /* D is not a guess. It is built from what the simulation found in A, B and
    C: only B shows which nerve carries the pain, and B pays for it in how
    well the level reads, because full strength nerves sit on the heat. C
    reads the level best and keeps a person oriented. So D takes C's bands,
    B's reveal at about six tenths, and a ground between the two. It was then
    measured on the same instrument as the other three. */
 D:{nm:'Bands and reveal',on:{g:[0,260,eOut],h:[100,400,null]},
  dull:{nerve:.42,nsat:.35,seat:.55,ssat:.55,grid:.55,addr:.45,sab:.45},heatMax:.70,satLead:1,local:true,iso:true,litA:.62}};
var OFF={g:[80,320,eOut],h:[0,220,eOut]};   /* back to Pattern: heat leaves first */

/* ---------- geometry ---------- */
var CM=D.cm, U=5/CM, XA=50-10*U, YA=2, COLS=20, ROWS=36, F=10, FW=COLS*F, FH=ROWS*F;
var OX=74;                            /* the back view sits this far right of the front, in figure units */
function vx(v){return v?OX:0;}
var PHONE=false;
var bodyRaw=new Path2D(D.body.d);
function bodyIn(v){var p=new Path2D();p.addPath(bodyRaw,new DOMMatrix().translate(D.body.tx+vx(v),D.body.ty).scale(D.body.s));return p;}
var BODY=[bodyIn(0),bodyIn(1)];
var probe=document.createElement('canvas').getContext('2d');
function inBody(v,x,y){return probe.isPointInPath(BODY[v],x+vx(v),y);}

/* nerves as Path2D, per view, per layer */
var NERV=[[],[]];
D.nerves.forEach(function(list,v){list.forEach(function(e){
 var p=new Path2D(), m=new DOMMatrix().translate(vx(v),0);
 if(e.t==='path')p.addPath(new Path2D(e.d),m); else p.arc(e.cx+vx(v),e.cy,e.r,0,TAU);
 var col=e.k==='seat'?SEATC[FIGSEAT[e.nm]]||C.dim:e.k==='flow'?hex(e.s):C[e.k]||hex(e.s);
 NERV[v].push({p:p,k:e.k,c:col,w:e.w,o:e.o,f:e.f,da:e.da?e.da.split(/[ ,]+/).map(Number):null,nm:e.nm,d:e.d,t:e.t});});});
/* flow colours to the house seat tokens, matched by the seat they rise from */
var FLOWMAP={'#D8924E':'Sacral','#DABF6A':'Solar','#5FD5A6':'Heart','#5EBBDB':'Throat','#7D93E0':'3rd Eye','#A77EDB':'Crown','#D6524C':'Root'};
NERV.forEach(function(L,v){L.forEach(function(n,i){if(n.k==='flow'){var s=D.nerves[v][i].s;n.c=SEATC[FLOWMAP[s]]||n.c;}});});

/* sample a nerve path into points, for the pain lines to ride */
var svgNS='http://www.w3.org/2000/svg', hid=document.createElementNS(svgNS,'svg');
hid.setAttribute('width','0');hid.setAttribute('height','0');hid.style.position='absolute';document.body.appendChild(hid);
function samplePath(d){var el=document.createElementNS(svgNS,'path');el.setAttribute('d',d);hid.appendChild(el);
 var L=el.getTotalLength(),n=Math.max(4,Math.ceil(L/0.5)),out=[];
 for(var i=0;i<=n;i++){var q=el.getPointAtLength(L*i/n);out.push([q.x,q.y]);}hid.removeChild(el);return out;}

/* ---------- addresses and places ---------- */
var NODE={};D.nodes.forEach(function(n){NODE[n.i]=n;});
var CHILD={};D.child.forEach(function(c){CHILD[c.nm]=c;c.p=new Path2D(c.ic);});
var HCX={};D.hcx.forEach(function(h){HCX[h.nm]=h;h.p=new Path2D(h.ic);});
/* a place drawn on a view: x in that view's own figure units. The back is
   seen from behind, so the person's right is on the viewer's right there. */
var PLACES=D.places.map(function(p,i){return {i:i,x:p.x,y:p.y,ids:p.ids,view:p.view,src:p.src,s:p.s,kick:0,vel:0};});
function placeX(p,v){return v?100-p.x:p.x;}
function solidOn(p,v){if(p.view==='both')return true;if(p.view==='head'||p.view==='front')return v===0;return v===1;}
var BYID={};PLACES.forEach(function(p){p.ids.forEach(function(id){(BYID[id]=BYID[id]||[]).push(p);});});

/* ---------- the 48 regions ---------- */
var REG=[];
['front','back'].forEach(function(vn,v){D.regions[vn].forEach(function(r){var b=r[1];
 REG.push({v:v,nm:r[0],side:r[2]||'',box:b,cx:(b[0]+b[2])/2,cy:(b[1]+b[3])/2,area:(b[2]-b[0])*(b[3]-b[1])});});});
REG.sort(function(a,b){return a.area-b.area;});
function regName(r){return r.nm+(r.side?(r.side==='l'?', left':', right'):'');}
var PAINMAP={'Head':'head','Back of head':'head','Neck':'throat','Back of neck':'throat','Shoulder':'shoulders','Trap':'shoulders',
 'Upper arm':'arms','Forearm':'arms','Chest':'torso','Abdomen':'torso','Upper back':'torso','Mid back':'torso',
 'Hip':'pelvis','Low back':'pelvis','Sacrum':'pelvis','Buttock':'pelvis','Thigh':'legs','Knee':'legs','Shin':'legs','Ankle':'legs',
 'Back of thigh':'legs','Back of knee':'legs','Calf':'legs','Palm':'hands','Back of hand':'hands','Foot':'feet','Heel':'feet'};
var PAINREG={};D.painreg.forEach(function(r){PAINREG[r.k]=r;});
/* the nerve each region's tension line rides to the spine, and the level it
   enters at. Names are matched against the approved figure's own titles. The
   accessory nerve, which is the trap's own, is not drawn in the figure, so
   the trap rides the cervical plexus and the panel says so. */
function lvY(lv){var S=D.spine,m={};S.forEach(function(s){m[s.lv]=s.y;});
 var ord=['C1','C7','T4','T12','L1','L4','S1','Co'], at={C1:1,C7:7,T4:11,T12:19,L1:20,L4:23,S1:25,Co:30};
 var num=function(l){var k=l.charAt(0),n=parseInt(l.slice(1),10);return k==='C'?n:k==='T'?7+n:k==='L'?19+n:k==='S'?24+n:30;};
 var x=num(lv),i=0;while(i<ord.length-2&&x>at[ord[i+1]])i++;var a=ord[i],b=ord[i+1];
 return m[a]+(x-at[a])*(m[b]-m[a])/(at[b]-at[a]);}
var ROUTE={
 front:{'Head':['Brainstem','C1'],'Neck':['Phrenic','C4'],'Chest':['Intercostal','T4'],'Abdomen':['Intercostal','T10'],
  'Shoulder':['Phrenic','C5'],'Upper arm':['Median','C7'],'Forearm':['Median','C7'],'Palm':['Median','C7'],
  'Hip':['Femoral','L3'],'Thigh':['Femoral','L3'],'Knee':['Saphenous','L3'],'Shin':['Deep fibular','L5'],'Ankle':['Deep fibular','L5'],'Foot':['Deep fibular','L5']},
 back:{'Back of head':['Greater occipital','C2'],'Back of neck':['Cervical plexus','C3'],'Upper back':['Spinal nerves','T4'],
  'Mid back':['Spinal nerves','T8'],'Low back':['Spinal nerves','L3'],'Sacrum':['Sacral plexus','S2'],'Trap':['Cervical plexus','C3'],
  'Upper arm':['Axillary','C5'],'Forearm':['Radial','C7'],'Back of hand':['Radial','C7'],'Buttock':['Gluteal','L5'],
  'Back of thigh':['Sciatic','L5'],'Back of knee':['Common fibular','L5'],'Calf':['Tibial','S1'],'Heel':['Tibial','S1']}};
var SAMPLES=[[],[]];
function buildRoutes(){
 NERV.forEach(function(L,v){L.forEach(function(n){if(n.t==='path'&&(n.k==='som'||n.k==='cns'||n.k==='auto'))
  SAMPLES[v].push({nm:n.nm,pts:samplePath(n.d)});});});
 REG.forEach(function(r){
  var rt=ROUTE[r.v?'back':'front'][r.nm]; if(!rt){r.route=null;return;}
  var key=rt[0], sy=lvY(rt[1]), sp=[50,sy], c=[r.cx,r.cy];
  var best=null;
  SAMPLES[r.v].forEach(function(s){if(s.nm.indexOf(key)<0)return;
   s.pts.forEach(function(q,i){var d=Math.hypot(q[0]-c[0],q[1]-c[1]);if(!best||d<best.d)best={d:d,i:i,s:s};});});
  var pts=[c];
  if(best&&best.d<9){
   var P=best.s.pts, a=P[0], z=P[P.length-1];
   var toStart=Math.hypot(a[0]-sp[0],a[1]-sp[1])<Math.hypot(z[0]-sp[0],z[1]-sp[1]);
   var seg=toStart?P.slice(0,best.i+1).reverse():P.slice(best.i);
   pts=pts.concat(seg);}
  var e=pts[pts.length-1], mx=(e[0]+sp[0])/2, my=Math.min(e[1],sp[1])-1.2;
  for(var k=1;k<=12;k++){var t=k/12;pts.push([(1-t)*(1-t)*e[0]+2*(1-t)*t*mx+t*t*sp[0],(1-t)*(1-t)*e[1]+2*(1-t)*t*my+t*t*sp[1]]);}
  r.route=pts.map(function(q){return [q[0]+vx(r.v),q[1]];}); r.routeLen=polyLen(r.route);
  r.nerve=best&&best.d<9?best.s.nm:null; r.level=rt[1];});}
function polyLen(P){var L=0;for(var i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);return L;}

/* ---------- the grid, and the paint on it ---------- */
var CELLIN=[[],[]];
[0,1].forEach(function(v){for(var r=0;r<ROWS;r++)for(var c=0;c<COLS;c++){
 var x0=XA+c*U,y0=YA+r*U,hit=0;[[.5,.5],[.2,.2],[.8,.2],[.2,.8],[.8,.8]].forEach(function(o){if(inBody(v,x0+o[0]*U,y0+o[1]*U))hit++;});
 CELLIN[v][r*COLS+c]=hit>0;}});
var CELLS_IN=[CELLIN[0].filter(Boolean).length,CELLIN[1].filter(Boolean).length];
var PAINT=[new Float32Array(COLS*ROWS),new Float32Array(COLS*ROWS)];
var FIELD=[new Float32Array(FW*FH),new Float32Array(FW*FH)];
var HEATCV=[document.createElement('canvas'),document.createElement('canvas')];
var MASKCV=[document.createElement('canvas'),document.createElement('canvas')];
HEATCV.concat(MASKCV).forEach(function(c){c.width=FW;c.height=FH;});
var fieldVer=0;
/* a painted cell reads its own value across its whole extent, and falls off
   outside it. Neighbours take the max, never the sum: two sixes side by side
   are still a six, and a sum would report pain nobody painted. */
/* Three steps, so the heat is round and still honest. The painted cells as
   flat plateaus; a gaussian blur of a third of a cell, which rounds every
   corner and keeps the inside of any block exactly at its value; then each
   painted cell's own centre pinned back to its value, so a single cell on
   its own still reads what was painted rather than seventy percent of it. */
var TMP=new Float32Array(FW*FH), KER=(function(){var s=0.45*F,R=Math.ceil(s*3),k=[],t=0;for(var i=-R;i<=R;i++){var w=Math.exp(-i*i/(2*s*s));k.push(w);t+=w;}return k.map(function(w){return w/t;});})();
function rebuildField(v){
 var Fd=FIELD[v],P=PAINT[v],R=(KER.length-1)/2,x,y,k,s;TMP.fill(0);Fd.fill(0);
 for(var i=0;i<P.length;i++){var val=P[i];if(!val)continue;var c=i%COLS,r=(i/COLS)|0;
  for(y=r*F;y<r*F+F;y++)for(x=c*F;x<c*F+F;x++)Fd[y*FW+x]=val;}
 for(y=0;y<FH;y++)for(x=0;x<FW;x++){s=0;for(k=-R;k<=R;k++){var xx=x+k;if(xx>=0&&xx<FW)s+=Fd[y*FW+xx]*KER[k+R];}TMP[y*FW+x]=s;}
 for(y=0;y<FH;y++)for(x=0;x<FW;x++){s=0;for(k=-R;k<=R;k++){var yy=y+k;if(yy>=0&&yy<FH)s+=TMP[yy*FW+x]*KER[k+R];}Fd[y*FW+x]=s;}
 for(i=0;i<P.length;i++){val=P[i];if(!val)continue;c=i%COLS;r=(i/COLS)|0;var cx=c*F+F/2,cy=r*F+F/2,rr=F*0.32;
  for(y=Math.floor(cy-rr);y<=Math.ceil(cy+rr);y++)for(x=Math.floor(cx-rr);x<=Math.ceil(cx+rr);x++){if(x<0||y<0||x>=FW||y>=FH)continue;
   var d=Math.hypot(x+.5-cx,y+.5-cy)/rr;if(d<=1){var j=y*FW+x,pin=val*(1-0.25*d*d);if(pin>Fd[j])Fd[j]=pin;}}}
 fieldVer++;}
function fieldAt(v,x,y){var fx=((x-XA)/U)*F,fy=((y-YA)/U)*F;if(fx<0||fy<0||fx>=FW||fy>=FH)return 0;return FIELD[v][(fy|0)*FW+(fx|0)];}

/* the heat ramp. Sacral to Root and no further: pain is held low and hot in
   the body, and the ramp lifts in lightness at the top rather than in
   saturation, the way a filament goes toward white. The alarm red is never
   in it: it is reserved for something being wrong with the instrument. */
var RAMP=[[0,[178,122,84],0],[.14,[186,128,88],.22],[.4,hex('#D19255'),.52],[.7,hex('#C4635E'),.68],[1,[232,158,138],.86]];
function ramp(t){t=clamp(t,0,1);for(var i=1;i<RAMP.length;i++)if(t<=RAMP[i][0]){var a=RAMP[i-1],b=RAMP[i],k=(t-a[0])/(b[0]-a[0]);
 return [mix(a[1],b[1],k),a[2]+(b[2]-a[2])*k];}return [RAMP[4][1],RAMP[4][2]];}
var heatKey='';
function paintHeat(v,gain,sat,maxA,iso,phase){
 var key=v+'|'+fieldVer+'|'+gain.toFixed(3)+'|'+sat.toFixed(3)+'|'+maxA+'|'+iso;
 if(HEATCV[v]._k===key)return; HEATCV[v]._k=key;
 var g=HEATCV[v].getContext('2d'),img=g.createImageData(FW,FH),d=img.data,Fd=FIELD[v];
 function band(j){return Math.min(5,Math.ceil(Fd[j]/2-1e-4));}
 for(var j=0;j<Fd.length;j++){var val=Fd[j],o=j*4;if(val<0.05){d[o+3]=0;continue;}
  var t=val/10, a;
  if(iso){ /* five bands, stepping in one at a time as gain rises */
   var shown=Math.ceil(gain*5-1e-6), bnd=band(j);
   if(bnd>shown||bnd<1){d[o+3]=0;continue;}
   var tb=bnd/5, rr=ramp(tb), col=grey(rr[0],.35+.65*sat);
   /* the isotherm: a pixel whose band differs from the next one over. Read
      off neighbours, so a flat patch never lights up as a whole. */
   var xq=j%FW, line=(xq<FW-1&&band(j+1)!==bnd)||(j+FW<Fd.length&&band(j+FW)!==bnd)||(xq>0&&band(j-1)!==bnd)||(j>=FW&&band(j-FW)!==bnd)?1:0;
   col=line?mix(col,[255,236,220],.45):col;
   a=(rr[1]/.86)*maxA*(line?1:.82);
   d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=a*255;}
  else{var r=ramp(t*gain),c2=grey(r[0],.35+.65*sat);a=(r[1]/.86)*maxA*Math.min(1,gain*1.2);
   d[o]=c2[0];d[o+1]=c2[1];d[o+2]=c2[2];d[o+3]=a*255;}}
 g.putImageData(img,0,0);}
function paintMask(v){if(MASKCV[v]._k===fieldVer)return;MASKCV[v]._k=fieldVer;
 var g=MASKCV[v].getContext('2d'),img=g.createImageData(FW,FH),d=img.data,Fd=FIELD[v];
 for(var j=0;j<Fd.length;j++){var o=j*4;d[o]=d[o+1]=d[o+2]=255;d[o+3]=255*sstep(0.6,2.4,Fd[j]);}g.putImageData(img,0,0);}

/* ---------- the mock person ---------- */
var S={mode:'pattern',variant:'C',brush:6,who:'Derek',reduced:false,amode:'A4',cmode:'C3',face:'front',
 layers:{nerves:true,seats:true,addr:true,sabs:true,grid:true,limb:true,labels:true},
 pg:0,ph:0,tr:null,sel:null,hoverReg:null,hoverSab:null,holdSab:null,hoverPlace:null,traceT0:0,
 cam:{x:0,y:0,z:1},camT:null,camV:{x:0,y:0,z:0},W:0,H:0,dpr:1,z0:1,frameMs:0,dirty:true,t:0};
var CHARGE={};
var PRESET={
 Derek:[['front','Knee','r',7],['front','Shin','r',5],['back','Low back','',4],['back','Calf','l',6],['front','Foot','r',3]],
 Diane:[['back','Trap','l',7],['back','Trap','r',5],['back','Back of neck','',6],['front','Head','',4],['back','Upper back','',3]],
 James:[['front','Chest','',5],['back','Low back','',6],['front','Head','',3]],
 Ana:[['front','Chest','',8],['front','Abdomen','',7],['front','Neck','',6],['back','Low back','',7],['front','Head','',6],['front','Palm','l',4]],
 Sofia:[['back','Trap','r',6],['front','Palm','r',5],['front','Palm','l',5],['back','Sacrum','',4]],
 Rosa:[]};
function setPerson(nm){
 S.who=nm;var P=D.people.find(function(p){return p.nm===nm;});
 /* each address takes its fetter's charge from the person, moved a little
    per address so the lines are not all one weight. Mock: the engine reads
    a story to get this, and this page reads nothing. */
 D.nodes.forEach(function(n){var base=P.c[n.c]||0;CHARGE[n.i]=base<0.3?base:clamp(base+(hash(n.i)-.5)*2.4,0,10);});
 PAINT[0].fill(0);PAINT[1].fill(0);
 (PRESET[nm]||[]).forEach(function(p){paintRegion(p[0]==='back'?1:0,p[1],p[2],p[3]);});
 rebuildField(0);rebuildField(1);buildSabs();S.sel=null;S.holdSab=null;renderAside();S.dirty=true;}
function paintRegion(v,nm,side,val){
 var r=REG.find(function(x){return x.v===v&&x.nm===nm&&x.side===side;});if(!r)return;
 var b=r.box,dmax=Math.hypot(b[2]-b[0],b[3]-b[1])/2;
 for(var i=0;i<COLS*ROWS;i++){if(!CELLIN[v][i])continue;var c=i%COLS,rw=(i/COLS)|0,x=XA+(c+.5)*U,y=YA+(rw+.5)*U;
  if(x<b[0]||x>b[2]||y<b[1]||y>b[3])continue;if(!inBody(v,x,y))continue;
  var d=Math.hypot(x-r.cx,y-r.cy)/dmax, vv=Math.round(val*(1-0.55*d));
  if(vv>PAINT[v][i])PAINT[v][i]=Math.max(1,vv);}}

/* ---------- saboteurs as cables ---------- */
var SABS=[];
function buildSabs(){
 SABS=D.sabs.map(function(s,k){
  var ch=s.nids.map(function(i){return CHARGE[i]||0;}), T=ch.reduce(function(a,b){return a+b;},0)/ch.length;
  var h=HCX[s.hcx], col=SEATC[h?h.b:'Root'];
  return {k:k,nm:s.nm,nids:s.nids.slice(),fam:s.hcx,famD:h?h.d:'',col:col,T:T,ch:ch,
   per:15+11*hash(k+3),ph:hash(k+9)*TAU,pulses:[],q0:hash(k+17),views:[null,null],lane:0,fr:0};}).filter(function(s){return s.T>=5;})
  .sort(function(a,b){return b.T-a.T;});
 SABS.forEach(function(s,i){s.lane=i;
  /* heaviest address last, so "toward the heaviest" is always forward */
  var hi=s.ch.indexOf(Math.max.apply(null,s.ch));
  if(hi===0){s.nids.reverse();s.ch.reverse();}
  var n=1+Math.floor(s.T/3.4);for(var j=0;j<n;j++)s.pulses.push({q:frac(s.q0+j/n),prev:0});
  [0,1].forEach(function(v){s.views[v]=chain(s,v);});});
 touchHeat();}
function chain(s,v){
 var pts=[],prev=null;
 s.nids.forEach(function(id,j){var cand=BYID[id]||[];if(!cand.length)return;
  var opts=[];cand.forEach(function(p){opts.push({x:placeX(p,v),y:p.y,p:p,ghost:!solidOn(p,v),id:id});});
  /* bilateral places have two points; take the side that keeps the cable short */
  var pick=opts[0];
  if(opts.length>1){var ref=prev||(function(){var o=BYID[s.nids[j+1]]||BYID[s.nids[j-1]]||[];return o[0]?{x:placeX(o[0],v),y:o[0].y}:{x:50,y:30};})();
   opts.forEach(function(o){if(Math.hypot(o.x-ref.x,o.y-ref.y)<Math.hypot(pick.x-ref.x,pick.y-ref.y))pick=o;});}
  pts.push(pick);prev=pick;});
 return {pts:pts,samp:null,len:0,nodeQ:[]};}
function touchHeat(){SABS.forEach(function(s){s.hot=[0,1].map(function(v){var c=s.views[v];if(!c)return 0;var m=0;
 c.pts.forEach(function(p){m=Math.max(m,fieldAt(v,p.x,p.y));});
 for(var i=1;i<c.pts.length;i++)for(var t=0;t<=1;t+=.1){var a=c.pts[i-1],b=c.pts[i];m=Math.max(m,fieldAt(v,a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t));}
 return m;});});}
/* the cable's shape this frame: a sag by slackness, a lane bow so cables that
   share an address fan out from it like cables off a pylon, and the hum, a
   standing wave pinned at every address */
function cableSamples(s,v,t){
 var c=s.views[v],P=c.pts,out=[],nodeQ=[0],L=0;if(P.length<2)return null;
 var slack=Math.pow(1-s.T/10,1.3), hover=(S.hoverSab===s||S.holdSab===s);
 var amp=(S.reduced?0:0.10*Math.pow(s.T/10,1.5)*(hover?3.2:1)), w=TAU*(0.9+2.2*Math.sqrt(s.T/10));
 for(var i=1;i<P.length;i++){var a=P[i-1],b=P[i],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
  /* lanes. Cables that share addresses would lie on each other up the
     spine, which reads as one nerve and not as seven patterns. Each takes
     its own arc, alternating sides and widening by lane, so they spread off
     the midline like field lines round a core. An arc says link; a line on
     the spine says nerve, which a saboteur is not. */
  var side=(s.lane%2)?-1:1, sag=len*0.20*slack, bow=side*Math.min(8,len*(0.12+0.06*(s.lane>>1))+0.6);
  var cx=(a.x+b.x)/2+nx*bow, cy=(a.y+b.y)/2+sag+ny*bow;
  var steps=Math.max(10,Math.ceil(len*2.2));
  for(var k=(i===1?0:1);k<=steps;k++){var u=k/steps,x=(1-u)*(1-u)*a.x+2*(1-u)*u*cx+u*u*b.x,y=(1-u)*(1-u)*a.y+2*(1-u)*u*cy+u*u*b.y;
   var hum=amp*Math.sin(Math.PI*u)*Math.sin(w*t+s.ph+i);
   x+=nx*hum;y+=ny*hum;
   if(out.length){var q=out[out.length-1];L+=Math.hypot(x-q[0],y-q[1]);}
   out.push([x,y,L,(a.ghost||b.ghost)?1:0]);}
  nodeQ.push(L);}
 c.samp=out;c.len=L;c.nodeQ=nodeQ.map(function(q){return q/(L||1);});return c;}

/* ---------- camera ---------- */
var cv=document.getElementById('cv'),ctx=cv.getContext('2d'),stage=document.getElementById('stage');
var still=document.createElement('canvas'),sctx=still.getContext('2d');
var litc=document.createElement('canvas'),lctx=litc.getContext('2d'),lit2=document.createElement('canvas'),l2ctx=lit2.getContext('2d'),litKey='';
function worldW(){return PHONE?[24,76]:[24-14,OX+76+14];}
function fitCam(){var w=worldW(),ww=w[1]-w[0],hh=102;
 var z=Math.min(S.W/ww,(S.H-24)/hh);S.z0=z;
 var cx=PHONE?(S.face==='back'?OX+50:50):(w[0]+w[1])/2;return {x:cx,y:50.5,z:z};}
function resize(){var r=stage.getBoundingClientRect();PHONE=r.width<700;S.dpr=Math.min(2,window.devicePixelRatio||1);
 S.W=r.width;S.H=r.height;[cv,still,litc,lit2].forEach(function(c){c.width=Math.round(S.W*S.dpr);c.height=Math.round(S.H*S.dpr);});
 cv.style.width=S.W+'px';cv.style.height=S.H+'px';stage.classList.toggle('phone',PHONE);var f=fitCam();hint();S.cam=f;S.camT=null;S.dirty=true;}
function flyTo(x,y,z){S.camT={x:x,y:y,z:z};if(S.reduced){S.cam={x:x,y:y,z:z};S.camT=null;}S.dirty=true;}
function w2s(x,y){return [(x-S.cam.x)*S.cam.z+S.W/2,(y-S.cam.y)*S.cam.z+S.H/2];}
function s2w(x,y){return [(x-S.W/2)/S.cam.z+S.cam.x,(y-S.H/2)/S.cam.z+S.cam.y];}
function worldTf(g){g.setTransform(S.dpr*S.cam.z,0,0,S.dpr*S.cam.z,S.dpr*(S.W/2-S.cam.x*S.cam.z),S.dpr*(S.H/2-S.cam.y*S.cam.z));}
function views(){return PHONE?[S.face==='back'?1:0]:[0,1];}

/* ---------- the dulling, as a timeline ---------- */
function setMode(m){if(m===S.mode)return;S.mode=m;
 var on=m==='pain',V=VAR[S.variant],T=on?V.on:OFF;
 S.tr={t0:performance.now(),g0:S.pg,h0:S.ph,gt:on?1:0,ht:on?1:0,T:T};
 if(S.reduced){S.pg=S.tr.gt;S.ph=S.tr.ht;S.tr=null;}
 stage.classList.toggle('paint',on);
 [].forEach.call(document.querySelectorAll('#mode button'),function(b){b.setAttribute('aria-pressed',String(b.dataset.k===m));});
 hint();S.dirty=true;}
function stepTr(now){var r=S.tr;if(!r)return;var e=now-r.t0,done=true;
 function run(from,to,spec){var t=clamp((e-spec[0])/spec[1],0,1);if(t<1)done=false;
  if(!spec[2]){ /* the isotherm steps: five bands, one every ninety ms */ return from+(to-from)*Math.min(1,Math.ceil(t*5)/5);}
  return from+(to-from)*spec[2](t);}
 S.pg=run(r.g0,r.gt,r.T.g);S.ph=run(r.h0,r.ht,r.T.h);if(done)S.tr=null;}
/* THE GROUND IN PATTERN IS NOT FULL EITHER. At full strength the back's gold
   nerves were the brightest thing on the page, so the eye landed on the
   anatomy and not on the pattern. Pattern sets the nerves at 62 percent and
   the gold a little greyer; each switch's numbers are where Pain lands. */
var BASE={nerve:.62,nsat:.8,seat:.9,ssat:1,grid:.8,addr:1,sab:1};
function dull(){var d=VAR[S.variant].dull,g=S.pg,o={};
 Object.keys(BASE).forEach(function(k){o[k]=BASE[k]+(d[k]-BASE[k])*g;});return o;}

/* ---------- the still layer ---------- */
var stillKey='';
function drawStill(dl){
 var key=[S.cam.x.toFixed(3),S.cam.y.toFixed(3),S.cam.z.toFixed(3),S.W,S.H,dl.nerve.toFixed(3),dl.nsat.toFixed(3),dl.seat.toFixed(3),dl.grid.toFixed(3),
  S.layers.nerves,S.layers.seats,S.layers.grid,S.mode,PHONE,S.face].join('|');
 if(key===stillKey)return;stillKey=key;
 var g=sctx;g.setTransform(1,0,0,1,0,0);g.fillStyle=rgba(C.stage,1);g.fillRect(0,0,still.width,still.height);
 worldTf(g);var px=1/S.cam.z;
 views().forEach(function(v){var o=vx(v);
  /* the grid is the map of him, so it stops at his outline. Outside him it
     was a cage. */
  if(S.layers.grid){g.save();g.clip(BODY[v]);g.beginPath();for(var r=0;r<=ROWS;r++){g.moveTo(XA+o,YA+r*U);g.lineTo(XA+COLS*U+o,YA+r*U);}
   for(var c=0;c<=COLS;c++){g.moveTo(XA+c*U+o,YA);g.lineTo(XA+c*U+o,YA+ROWS*U);}
   g.strokeStyle=rgba(C.grid,(S.mode==='pain'?1.6:1)*dl.grid);g.lineWidth=px;g.stroke();g.restore();}
  /* the man, solid. The approved figure fills him at 7 percent, which is
     what let the glow read through him (spec 1A, item 6). */
  g.fillStyle=rgba(C.man,1);g.fill(BODY[v]);g.strokeStyle=rgba(C.edge,.20);g.lineWidth=px*1.1;g.stroke(BODY[v]);
  if(S.layers.nerves)drawNerves(g,v,dl.nerve,dl.nsat,false);
  if(S.layers.seats)NERV[v].forEach(function(n){if(n.k!=='seat'&&n.k!=='flow')return;
   var col=grey(n.c,dl.ssat);g.setLineDash(n.da?n.da.map(function(x){return x;}):[]);
   g.strokeStyle=rgba(col,(n.k==='flow'?Math.max(n.o,.12):n.o)*dl.seat);g.lineWidth=n.k==='flow'?Math.max(n.w,2.2*px):Math.max(n.w,1.4*px);g.stroke(n.p);g.setLineDash([]);});});}
function drawNerves(g,v,alpha,sat,lit){var px=1/S.cam.z,base=S.z0/S.cam.z;
 NERV[v].forEach(function(n){if(n.k==='seat'||n.k==='flow')return;
  var col=lit?mix(n.c,[240,196,160],.55):grey(n.c,sat);
  /* nerves keep the width they have on the whole body as the view opens,
     the fix the spec asks for in 1A item 2 */
  var w=clamp(n.w*S.z0,0.7,2.2)*px;
  if(n.f&&n.t==='circle'){g.fillStyle=rgba(col,.10*alpha);g.fill(n.p);}
  g.strokeStyle=rgba(col,n.o*alpha*(lit?1:1));g.lineWidth=lit?w*1.1:w;g.stroke(n.p);});}

/* ---------- the frame ---------- */
var last=performance.now();
function frame(now){
 var dt=Math.min(0.05,(now-last)/1000);last=now;S.t+=S.reduced?0:dt;
 var moving=false;
 if(S.tr){stepTr(now);moving=true;}
 if(S.camT){var k=1-Math.exp(-dt*9);S.cam.x+=(S.camT.x-S.cam.x)*k;S.cam.y+=(S.camT.y-S.cam.y)*k;S.cam.z+=(S.camT.z-S.cam.z)*k;
  if(Math.abs(S.camT.z-S.cam.z)<S.camT.z*0.002&&Math.abs(S.camT.x-S.cam.x)<0.02&&Math.abs(S.camT.y-S.cam.y)<0.02){S.cam={x:S.camT.x,y:S.camT.y,z:S.camT.z};S.camT=null;}moving=true;}
 if(S.reduced&&!moving&&!S.dirty){requestAnimationFrame(frame);return;}
 var t0=performance.now();draw(dt);S.dirty=false;
 var ms=performance.now()-t0;S.frameMs=S.frameMs?S.frameMs*.92+ms*.08:ms;
 requestAnimationFrame(frame);}
function draw(dt){
 var dl=dull(),V=VAR[S.variant];drawStill(dl);
 var g=ctx;g.setTransform(1,0,0,1,0,0);g.drawImage(still,0,0);
 var vs=views(), px=1/S.cam.z;
 /* 2. the heat, clipped to him */
 var gain=S.ph;
 if(gain>0.002)vs.forEach(function(v){
  var sat=V.satLead<1?Math.pow(gain,V.satLead):gain;
  paintHeat(v,V.iso?gain:gain,sat,V.heatMax,V.iso,S.t);
  worldTf(g);g.save();g.clip(BODY[v]);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  g.drawImage(HEATCV[v],XA+vx(v),YA,COLS*U,ROWS*U);g.restore();});
 /* 3. switch B: the nerves under the pain stay lit */
 if(V.local&&S.pg>0.01&&S.layers.nerves){
  /* Cached. The first cut recomposited every nerve through the mask on every
     frame and measured 21ms a frame, over budget, for a layer that changes
     only when the camera moves or the paint does. One view at a time, since
     destination-in on a shared pass wipes the other. */
  var lk=[S.cam.x.toFixed(3),S.cam.y.toFixed(3),S.cam.z.toFixed(3),S.W,S.H,fieldVer,vs.join(','),S.variant].join('|');
  if(lk!==litKey){litKey=lk;lctx.setTransform(1,0,0,1,0,0);lctx.clearRect(0,0,litc.width,litc.height);
   vs.forEach(function(v){l2ctx.setTransform(1,0,0,1,0,0);l2ctx.clearRect(0,0,lit2.width,lit2.height);worldTf(l2ctx);
    drawNerves(l2ctx,v,1,1,true);paintMask(v);
    l2ctx.globalCompositeOperation='destination-in';l2ctx.imageSmoothingEnabled=true;
    l2ctx.drawImage(MASKCV[v],XA+vx(v),YA,COLS*U,ROWS*U);l2ctx.globalCompositeOperation='source-over';
    lctx.drawImage(lit2,0,0);});}
  g.setTransform(1,0,0,1,0,0);g.globalAlpha=S.pg*(V.litA||1);g.drawImage(litc,0,0);g.globalAlpha=1;}
 worldTf(g);
 /* regions: hover and the pressed one, clipped to him */
 vs.forEach(function(v){g.save();g.clip(BODY[v]);
  if(S.mode==='pain'){REG.forEach(function(r){if(r.v!==v)return;var b=r.box;g.strokeStyle=rgba(C.acc,.10);g.lineWidth=px;g.strokeRect(b[0]+vx(v),b[1],b[2]-b[0],b[3]-b[1]);});}
  [S.hoverReg,S.sel].forEach(function(r,i){if(!r||r.v!==v)return;var b=r.box;
   g.fillStyle=rgba(C.acc,i?.10:.06);g.fillRect(b[0]+vx(v),b[1],b[2]-b[0],b[3]-b[1]);
   g.strokeStyle=rgba(C.acc,i?.9:.5);g.lineWidth=px*(i?1.6:1.1);g.strokeRect(b[0]+vx(v),b[1],b[2]-b[0],b[3]-b[1]);});
  if(S.mode==='pain'&&S.hoverCell&&S.hoverCell.v===v){var hc=S.hoverCell;g.strokeStyle=rgba([240,210,184],.85);g.lineWidth=px*1.4;
   g.strokeRect(XA+hc.c*U+vx(v),YA+hc.r*U,U,U);}
  g.restore();});
 /* 4a. pain lines, from the painted region to the spine along its nerve.
    The pulses run inward, the direction a pain signal actually travels. */
 if(gain>0.02)drawPainLines(g,vs,gain);
 /* 4b. limb centres, his list, proposed */
 if(S.layers.limb)drawLimb(g,vs,dl);
 /* 4c. saboteur cables */
 if(S.layers.sabs)drawSabs(g,vs,dl,dt);
 /* 4d. addresses */
 if(S.layers.addr)drawAddr(g,vs,dl,dt);
 if(S.layers.labels&&!PHONE&&S.cam.z<S.z0*1.3)drawLabels(g);
 corner();}

function strokePoly(g,P,from,to,width,style){ /* P: [x,y,L] samples, draw between lengths from..to */
 g.beginPath();var started=false;
 for(var i=0;i<P.length;i++){var p=P[i];if(p[2]<from)continue;if(p[2]>to)break;if(!started){g.moveTo(p[0],p[1]);started=true;}else g.lineTo(p[0],p[1]);}
 if(!started)return;g.lineWidth=width;g.strokeStyle=style;g.stroke();}
function withLen(P){var L=0,o=[];for(var i=0;i<P.length;i++){if(i)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);o.push([P[i][0],P[i][1],L]);}return o;}

function regionValue(r){var b=r.box,m=0;for(var i=0;i<COLS*ROWS;i++){var v=PAINT[r.v][i];if(!v)continue;var c=i%COLS,rw=(i/COLS)|0,x=XA+(c+.5)*U,y=YA+(rw+.5)*U;
 if(x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3]&&v>m)m=v;}return m;}
function drawPainLines(g,vs,gain){var px=1/S.cam.z;
 g.lineCap='round';g.lineJoin='round';
 REG.forEach(function(r){if(vs.indexOf(r.v)<0||!r.route)return;var val=r._val;if(!val)return;
  if(!r._samp)r._samp=withLen(r.route);var P=r._samp,L=r.routeLen,t=val/10,col=ramp(t)[0];
  var a=gain*(0.45+0.5*t);
  strokePoly(g,P,0,L,(3.2+0.3*val)*px,rgba(C.casing,.55*a));
  strokePoly(g,P,0,L,(1.1+0.22*val)*px,rgba(col,a));
  if(!S.reduced){var sp=(0.10+0.035*val),n=1+Math.floor(val/4);
   for(var j=0;j<n;j++){var q=frac(S.t*sp+j/n+hash(r.cx*7+r.cy)),c=q*L,h=L*0.05;
    var env=Math.sin(Math.PI*q);
    strokePoly(g,P,c-h,c+h,(4+0.4*val)*px,rgba(col,.14*gain*env));
    strokePoly(g,P,c-h*.6,c+h*.6,(1.6+0.25*val)*px,rgba(mix(col,[255,240,228],.5),.9*gain*env));}}});}

var LIMB=[['Palm','r'],['Palm','l'],['Knee','r'],['Knee','l'],['Shin','r'],['Shin','l'],['Foot','r'],['Foot','l']];
function drawLimb(g,vs,dl){var px=1/S.cam.z;
 LIMB.forEach(function(l){var r=REG.find(function(x){return x.v===0&&x.nm===l[0]&&x.side===l[1];});if(!r)return;
  var x=r.cx,y=r.cy+(l[0]==='Foot'?1.2:0);
  [0,1].forEach(function(v){if(vs.indexOf(v)<0)return;if(v===1&&S.cmode==='C2')return;var xx=(v?100-x:x)+vx(v),ghost=v===1;
   var s=w2s(xx,y);g.setTransform(S.dpr,0,0,S.dpr,0,0);
   g.setLineDash([2.5,2.5]);g.beginPath();g.arc(s[0],s[1],6.5,0,TAU);g.strokeStyle=rgba(C.prop,(ghost?.28:.75)*dl.addr);g.lineWidth=1.3;g.stroke();g.setLineDash([]);
   g.beginPath();g.arc(s[0],s[1],1.4,0,TAU);g.fillStyle=rgba(C.prop,(ghost?.25:.7)*dl.addr);g.fill();worldTf(g);});});}

function drawSabs(g,vs,dl,dt){
 var hot=S.hoverSab||S.holdSab, now=performance.now();
 SABS.forEach(function(s){
  /* the load drifts on its own slow sine, the way the Field's does */
  var ld=Math.cos(TAU*S.t/s.per+s.ph);s.dir=ld>=0?1:-1;
  vs.forEach(function(v){var c=cableSamples(s,v,S.t);if(!c)return;var P=c.samp,L=c.len;
   worldTf(g);var px=1/S.cam.z;g.lineCap='round';g.lineJoin='round';
   var heatLift=VAR[S.variant].local&&s.hot[v]>1.5?1:0;
   var a=(0.40+0.55*s.T/10)*(dl.sab+(1-dl.sab)*heatLift);
   if(hot&&hot!==s)a*=0.20;
   var w=(1.1+0.30*s.T)*px;
   if(hot===s){a=Math.max(a,.95);w*=1.5;}
   /* the trace, his CU ruling: it draws the whole line, then holds and hums */
   var to=L;if(hot===s&&!S.reduced){var tp=eOut(clamp((now-S.traceT0)/700,0,1));to=L*tp;
    strokePoly(g,P,0,L,w,rgba(s.col,a*.25));}
   /* ghost segments pass through the body to the far surface: dashed, faint */
   var solid=[],ghost=[],run=null,runG=-1,lastP=null;
   for(var pi=0;pi<P.length;pi++){var pp=P[pi];if(pp[2]>to)break;
    if(pp[3]!==runG){run=lastP?[lastP]:[];(pp[3]?ghost:solid).push(run);runG=pp[3];}
    run.push(pp);lastP=pp;}
   solid.forEach(function(seg){if(seg.length<2)return;
    strokePoly(g,seg,-1,1e9,w+2.4*px,rgba(C.casing,.55*a));strokePoly(g,seg,-1,1e9,w,rgba(s.col,a));});
   if(S.cmode==='C3')ghost.forEach(function(seg){if(seg.length<2)return;g.setLineDash([3*px,3.5*px]);
    strokePoly(g,seg,-1,1e9,w*.8,rgba(s.col,a*.45));g.setLineDash([]);});
   /* pulses */
   if(!S.reduced&&(!hot||hot===s)){var sp=(0.07+0.15*Math.sqrt(s.T/10))*s.dir;
    s.pulses.forEach(function(pu){if(v===vs[0]){pu.prev=pu.q;pu.q=frac(pu.q+sp*dt);
      /* a pulse crossing an address kicks its mark */
      c.nodeQ.forEach(function(nq,ni){var a0=pu.prev,a1=pu.q;var crossed=s.dir>0?(a0<nq&&a1>=nq&&a1-a0<.5):(a0>nq&&a1<=nq&&a0-a1<.5);
       if(crossed){var pl=c.pts[ni]&&c.pts[ni].p;if(pl)pl.vel+=1.6*(s.T/10);}});}
     var cc=pu.q*L,h=L*0.045,env=Math.sin(Math.PI*pu.q);if(cc>to)return;
     strokePoly(g,P,cc-h,cc+h,w+4.5*px,rgba(s.col,.13*env*(a/.85)));
     strokePoly(g,P,cc-h*.55,cc+h*.55,w+.9*px,rgba(mix(s.col,[255,255,255],.5),.95*env*Math.min(1,a*1.6)));});}
  });});}

function markR(p){return 3.2+0.55*Math.min(p.ids.length,6);}
function drawAddr(g,vs,dl,dt){
 var zI=S.z0*1.7, ic=S.amode==='A4'?sstep(zI*0.8,zI*1.25,S.cam.z):0;
 var onLine={};SABS.forEach(function(s){s.nids.forEach(function(id){onLine[id]=Math.max(onLine[id]||0,s.T);});});
 g.setTransform(S.dpr,0,0,S.dpr,0,0);
 PLACES.forEach(function(p){
  /* the mark has mass: kicked by a pulse, it swells past and settles */
  if(!S.reduced){var acc=196*(0-p.kick)-2*.42*14*p.vel;p.vel+=acc*dt;p.kick+=p.vel*dt;}else{p.kick=0;p.vel=0;}
  vs.forEach(function(v){
   var ghost=!solidOn(p,v);if(ghost&&S.cmode==='C2')return;
   var x=placeX(p,v)+vx(v),s=w2s(x,p.y);if(s[0]<-40||s[1]<-40||s[0]>S.W+40||s[1]>S.H+40)return;
   var ch=0,seat=null;p.ids.forEach(function(id){if((CHARGE[id]||0)>=ch){ch=CHARGE[id]||0;seat=NODE[id].b;}});
   var col=SEATC[seat]||C.dim, heatLift=VAR[S.variant].local&&fieldAt(v,placeX(p,v),p.y)>1.5?1:0;
   var ln0=p.ids.some(function(id){return onLine[id];});
   var A=(ghost?.30:1)*(dl.addr+(1-dl.addr)*heatLift)*(ln0||!S.layers.sabs?1:.55), held=ch>=0.3;
   var r=markR(p)*(1+0.18*p.kick)*(S.amode==='A1'?.6:1);
   /* A3: the patch. The size is a placeholder, 4 cm, until sizes are sourced */
   if(S.amode==='A3'){g.beginPath();g.arc(s[0],s[1],Math.max(r+2,2*S.cam.z/CM*1.0),0,TAU);g.fillStyle=rgba(col,.10*A);g.fill();}
   /* fringes, from d-fringe: past five, bands born at the mark and travelling
      out while loading, back in while releasing */
   var str=clamp((ch-5)/5,0,1), ln=p.ids.some(function(id){return onLine[id];});
   if(!ghost&&ln&&str>0.02&&S.layers.sabs&&dl.sab>0.3){var dir=1;SABS.forEach(function(sb){if(sb.nids.indexOf(p.ids[0])>=0)dir=sb.dir;});
    p.fr=(p.fr||0)+(S.reduced?0:dt*0.9*dir);var f=S.reduced?.5:frac(p.fr),gap=9-5*str;
    for(var k=0;k<4;k++){var pos=k+f,rr=r+3+pos*gap,al=Math.pow(str,1.3)*Math.sin(Math.PI*pos/4)*.75*A*dl.sab;if(al<.02)continue;
     g.beginPath();g.arc(s[0],s[1],rr,0,TAU);g.strokeStyle=rgba(k%2?col:mix(col,[255,255,255],.5),al);g.lineWidth=k%2?1:1.4;g.stroke();}}
   if(ic>0.01&&!ghost){drawRosette(g,p,s,col,A*ic);}
   var ringA=A*(1-ic*.55);
   /* the ring: a faint track and the charge arc, the product's own reading
      circle (ED): the icon inside it, the percent ring around it */
   g.beginPath();g.arc(s[0],s[1],r,0,TAU);g.strokeStyle=rgba(col,(held?.35:.22)*ringA);g.lineWidth=1.2;g.stroke();
   if(held&&!ghost){g.beginPath();g.arc(s[0],s[1],r,-Math.PI/2,-Math.PI/2+TAU*ch/10);g.strokeStyle=rgba(col,.95*ringA);g.lineWidth=2;g.stroke();}
   if(S.hoverPlace===p&&v===S.hoverView){g.beginPath();g.arc(s[0],s[1],r+4,0,TAU);g.strokeStyle=rgba(C.ink,.8);g.lineWidth=1.2;g.stroke();}
  });});}
function drawRosette(g,p,s,col,A){
 var n=p.ids.length, sz=clamp(0.95*S.cam.z,14,24), R=n>1?sz*(0.55+0.11*n):0;
 p.ids.forEach(function(id,j){var nd=NODE[id],ch=CHILD[nd.c];if(!ch)return;
  var an=-Math.PI/2+j/n*TAU,x=s[0]+Math.cos(an)*R,y=s[1]+Math.sin(an)*R,c2=SEATC[nd.b]||col,q=CHARGE[id]||0;
  g.save();g.translate(x-sz/2,y-sz/2);g.scale(sz/24,sz/24);
  g.strokeStyle=rgba(c2,A*(q>=.3?1:.5));g.lineWidth=1.5*24/sz;g.lineJoin='round';g.lineCap='round';g.stroke(ch.p);g.restore();
  if(n>1){g.beginPath();g.arc(x,y,sz*0.62,0,TAU);g.strokeStyle=rgba(c2,A*.25);g.lineWidth=1;g.stroke();}});}

/* ---------- labels, two columns, relaxed so none collide ---------- */
function drawLabels(g){
 g.setTransform(S.dpr,0,0,S.dpr,0,0);g.font='500 12px Inter,system-ui,sans-serif';g.textBaseline='middle';
 [0,1].forEach(function(v){
  var list=[];var seen={};
  REG.forEach(function(r){if(r.v!==v)return;if(r.side===(v?'l':'l'))return;var k=r.nm;if(seen[k])return;seen[k]=1;list.push(r);});
  var colX=v?(OX+76+1.2):(24-1.2), sx=w2s(colX,0)[0];
  var items=list.map(function(r){return {r:r,y:w2s(0,r.cy)[1]};}).sort(function(a,b){return a.y-b.y;});
  for(var i=1;i<items.length;i++)if(items[i].y-items[i-1].y<15)items[i].y=items[i-1].y+15;
  for(i=items.length-2;i>=0;i--)if(items[i+1].y-items[i].y<15)items[i].y=items[i+1].y-15;
  items.forEach(function(it){var r=it.r,val=r._val||0;
   var lit=S.sel&&S.sel.nm===r.nm&&S.sel.v===v||S.hoverReg&&S.hoverReg.nm===r.nm&&S.hoverReg.v===v;
   var edgeX=v?r.box[2]:r.box[0];
   var ex=w2s(edgeX+vx(v),r.cy);
   g.beginPath();g.moveTo(sx+(v?-4:4),it.y);g.lineTo(ex[0],ex[1]);g.strokeStyle=rgba(C.dim,lit?.5:.14);g.lineWidth=1;g.stroke();
   var txt=r.nm+(val&&S.mode==='pain'?'  '+val:'');
   g.textAlign=v?'left':'right';
   g.fillStyle=lit?rgba(C.ink,1):val&&S.mode==='pain'?rgba(hex('#E3B08F'),.95):rgba(C.dim,.95);
   g.fillText(txt,sx+(v?-2:2),it.y);});
  var hx=w2s(v?OX+50:50,0)[0];g.textAlign='center';g.font='600 13px Inter,system-ui,sans-serif';g.fillStyle=rgba(C.ink,.9);
  g.fillText(v?'Back, seen from behind':'Front',hx,14);g.font='500 12px Inter,system-ui,sans-serif';});}

function corner(){var el=document.getElementById('corner');
 el.textContent='zoom '+(S.cam.z/S.z0).toFixed(2)+(S.amode==='A4'?' · fetter marks from 1.7':'')+' · '+CELLS_IN[0]+' cells front, '+CELLS_IN[1]+' back';}
function hint(){document.getElementById('hint').textContent=PHONE?(S.mode==='pain'?'Tap or drag to paint where it hurts.':'Press a region to open it. Point at a line to trace it.'):S.mode==='pain'
 ?'Tap or drag to paint where it hurts. Tap a painted cell again to clear it. The region opens beside the map.'
 :'Press a region to open it. Double press to zoom into it. Point at a line to trace it. Scroll to zoom, drag to move.';}

/* ---------- picking ---------- */
function pick(sx,sy){var w=s2w(sx,sy),v=null;
 views().forEach(function(vv){if(w[0]>=24+vx(vv)-2&&w[0]<=76+vx(vv)+2)v=vv;});if(v===null)return {w:w};
 var x=w[0]-vx(v),y=w[1],reg=null;
 if(inBody(v,x,y))for(var i=0;i<REG.length;i++){var r=REG[i],b=r.box;if(r.v===v&&x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3]){reg=r;break;}}
 var c=Math.floor((x-XA)/U),rw=Math.floor((y-YA)/U),cell=null;
 if(c>=0&&c<COLS&&rw>=0&&rw<ROWS&&CELLIN[v][rw*COLS+c])cell={v:v,c:c,r:rw,i:rw*COLS+c};
 var place=null,bd=1e9;PLACES.forEach(function(p){if(!solidOn(p,v)&&S.cmode==='C2')return;var s=w2s(placeX(p,v)+vx(v),p.y),d=Math.hypot(s[0]-sx,s[1]-sy);
  if(d<Math.max(10,markR(p)+4)&&d<bd){bd=d;place=p;}});
 var sab=null,sd=8;if(S.layers.sabs)SABS.forEach(function(s){var c2=s.views[v];if(!c2||!c2.samp)return;
  for(var i=0;i<c2.samp.length;i+=2){var q=w2s(c2.samp[i][0],c2.samp[i][1]),d=Math.hypot(q[0]-sx,q[1]-sy);if(d<sd){sd=d;sab=s;}}});
 return {w:w,v:v,x:x,y:y,reg:reg,cell:cell,place:place,sab:sab};}
var tip=document.getElementById('tip');
function showTip(sx,sy,html){if(!html){tip.style.display='none';return;}tip.innerHTML=html;tip.style.display='block';tip.style.left=sx+'px';tip.style.top=sy+'px';}
function placeTip(p){return p.ids.map(function(id){var n=NODE[id];return n.k+' <small>· '+n.c+' · '+n.n+' · '+(CHARGE[id]||0).toFixed(1)+'</small>';}).join('<br>');}

var drag=null;
cv.addEventListener('pointerdown',function(e){cv.setPointerCapture(e.pointerId);var r=cv.getBoundingClientRect(),sx=e.clientX-r.left,sy=e.clientY-r.top,pk=pick(sx,sy);
 drag={x:sx,y:sy,cx:S.cam.x,cy:S.cam.y,moved:false,paint:S.mode==='pain'&&!!pk.cell,first:pk.cell?PAINT[pk.cell.v][pk.cell.i]:0,painted:{}};
 if(drag.paint)paintAt(pk,true);});
cv.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect(),sx=e.clientX-r.left,sy=e.clientY-r.top;
 if(drag){var dx=sx-drag.x,dy=sy-drag.y;if(Math.hypot(dx,dy)>4)drag.moved=true;
  if(drag.paint){var pk=pick(sx,sy);if(pk.cell)paintAt(pk,false);return;}
  if(drag.moved){S.camT=null;S.cam.x=drag.cx-dx/S.cam.z;S.cam.y=drag.cy-dy/S.cam.z;S.dirty=true;}return;}
 var pk=pick(sx,sy);S.hoverReg=pk.reg||null;S.hoverCell=pk.cell||null;
 if(pk.sab!==S.hoverSab&&!pk.place){S.hoverSab=pk.sab;S.traceT0=performance.now();}
 S.hoverPlace=pk.place||null;S.hoverView=pk.v;
 if(pk.place)showTip(sx,sy-8,placeTip(pk.place));else if(pk.sab)showTip(sx,sy-8,pk.sab.nm+' <small>· '+pk.sab.T.toFixed(1)+' · '+(pk.sab.dir>0?'loading':'releasing')+'</small>');
 else if(pk.reg)showTip(sx,sy-8,regName(pk.reg)+(pk.reg._val?' <small>· painted '+pk.reg._val+'</small>':''));else showTip();
 S.dirty=true;});
cv.addEventListener('pointerleave',function(){S.hoverReg=null;S.hoverCell=null;S.hoverSab=null;S.hoverPlace=null;showTip();S.dirty=true;});
cv.addEventListener('pointerup',function(e){var r=cv.getBoundingClientRect(),sx=e.clientX-r.left,sy=e.clientY-r.top;
 if(drag&&!drag.moved&&!drag.paint){var pk=pick(sx,sy);
  if(pk.sab&&!pk.place){S.holdSab=S.holdSab===pk.sab?null:pk.sab;S.traceT0=performance.now();renderAside();}
  else{S.sel=pk.reg||null;renderAside();}}
 if(drag&&drag.paint){var pk2=pick(sx,sy);if(pk2.reg){S.sel=pk2.reg;}renderAside();}
 drag=null;S.dirty=true;});
cv.addEventListener('dblclick',function(e){var r=cv.getBoundingClientRect(),pk=pick(e.clientX-r.left,e.clientY-r.top);if(pk.reg)openRegion(pk.reg);});
cv.addEventListener('wheel',function(e){e.preventDefault();var r=cv.getBoundingClientRect(),sx=e.clientX-r.left,sy=e.clientY-r.top,w=s2w(sx,sy);
 var z=clamp(S.cam.z*Math.pow(1.0015,-e.deltaY),S.z0*0.8,S.z0*8);S.camT=null;S.cam.z=z;S.cam.x=w[0]-(sx-S.W/2)/z;S.cam.y=w[1]-(sy-S.H/2)/z;S.dirty=true;},{passive:false});
function paintAt(pk,first){var c=pk.cell,key=c.v+':'+c.i;if(drag.painted[key])return;drag.painted[key]=1;
 var cur=PAINT[c.v][c.i];
 /* one press: paint at the brush. The same press on a cell already at the
    brush clears it. No second step. */
 PAINT[c.v][c.i]=(first&&cur===S.brush)?0:S.brush;
 rebuildField(c.v);touchHeat();markVals();S.dirty=true;}
function markVals(){REG.forEach(function(r){r._val=regionValue(r);});}
function openRegion(r){var b=r.box,w=(b[2]-b[0])+8,h=(b[3]-b[1])+8,z=Math.min(S.W/w,S.H/h,S.z0*6);flyTo((b[0]+b[2])/2+vx(r.v),(b[1]+b[3])/2,z);S.sel=r;renderAside();}

/* ---------- the aside ---------- */
function svgIc(d,col){return '<svg viewBox="0 0 24 24" style="stroke:'+col+'"><path d="'+d+'"/></svg>';}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function renderAside(){
 markVals();
 var box=document.getElementById('regcard'),r=S.sel;
 if(!r){box.innerHTML='';}else{
  var b=r.box, here=PLACES.filter(function(p){var x=placeX(p,r.v);return solidOn(p,r.v)&&x>=b[0]&&x<=b[2]&&p.y>=b[1]&&p.y<=b[3]&&inBody(r.v,x,p.y);});
  var ids=[];here.forEach(function(p){p.ids.forEach(function(i){if(ids.indexOf(i)<0)ids.push(i);});});
  var charge=ids.length?Math.max.apply(null,ids.map(function(i){return CHARGE[i]||0;})):null;
  var through=SABS.filter(function(s){var c=s.views[r.v];if(!c||!c.samp)return false;return c.samp.some(function(q){var x=q[0]-vx(r.v);return x>=b[0]&&x<=b[2]&&q[1]>=b[1]&&q[1]<=b[3];});});
  var pr=PAINREG[PAINMAP[r.nm]]||null, val=r._val||0;
  var h='<div class="card"><div class="top"><div><h2>'+esc(regName(r))+'</h2><div class="small">'+(r.v?'Back':'Front')+' view · '+esc(r.nerve?'line rides the '+r.nerve.split(',')[0].toLowerCase()+' to '+r.level:'line runs to the spine at '+(r.level||'its level'))+'</div></div>'
   +'<button class="x" type="button" id="rclose" aria-label="Close this region"><svg viewBox="0 0 24 24" width="18" height="18" style="fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'
   +'<div class="nums"><div><b>'+(val?val:'0')+' <small>of 10</small></b><span>Pain you painted here</span></div>'
   +'<div><b>'+(charge===null?'none':charge.toFixed(1)+' <small>of 10</small>')+'</b><span>Charge on the addresses standing here. Mock</span></div></div>';
  if(r.nm==='Trap')h+='<p class="small" style="margin-top:8px">The trap\'s own nerve, the accessory nerve, is not drawn in the approved figure, so its line rides the cervical plexus beside it.</p>';
  h+='<h3>Standing here</h3>';
  if(ids.length){h+='<ul class="rows">'+ids.map(function(i){var n=NODE[i],c=CHILD[n.c];return '<li>'+svgIc(c?c.ic:'',SEAT[n.b])+'<span>'+esc(n.k)+' <em>· '+esc(n.c)+' · '+esc(n.n)+'</em></span><span class="v">'+(CHARGE[i]||0).toFixed(1)+'</span></li>';}).join('')+'</ul>';}
  else h+='<p>No address stands on this place. The arms and legs carry 2 of the 112 today, which is question D in the spec.</p>';
  h+='<h3>Running through here</h3>'+(through.length?'<ul class="rows">'+through.map(function(s){var f=HCX[s.fam];return '<li>'+svgIc(f?f.ic:'',rgba(s.col,1))+'<span>'+esc(s.nm)+' <em>· '+esc(s.famD)+'</em></span><span class="v">'+s.T.toFixed(1)+'</span></li>';}).join('')+'</ul>':'<p>No saboteur line crosses this region.</p>');
  if(pr)h+='<h3>Commonly presents as</h3><p>'+esc(pr.common)+'.</p><h3>The pattern under it</h3><p>'+esc(pr.pattern)+'</p><p class="small">From today\'s '+esc(pr.nm.toLowerCase())+' line in the engine, one of nine. Each of the 48 regions needs its own in the content pass.</p>';
  h+='<h3>What helps</h3><p>Practices tied to this region are content still to write, in the content pass he named.</p>';
  h+='<p><button type="button" class="chip" id="ropen">Zoom into this region</button></p></div>';
  box.innerHTML=h;
  document.getElementById('rclose').onclick=function(){S.sel=null;renderAside();S.dirty=true;};
  document.getElementById('ropen').onclick=function(){openRegion(r);};}
 var ul=document.getElementById('sabs');document.getElementById('sabn').textContent=SABS.length?SABS.length+' of '+D.sabs.length:'nothing held';
 ul.innerHTML=SABS.length?SABS.map(function(s){var f=HCX[s.fam];return '<li role="button" tabindex="0" aria-pressed="'+(S.holdSab===s)+'" data-k="'+s.k+'">'+svgIc(f?f.ic:'',rgba(s.col,1))
  +'<span>'+esc(s.nm)+'</span><span class="v">'+s.T.toFixed(1)+'</span><span class="dir" data-dir="'+s.k+'"></span><span class="bar2"><i style="width:'+(s.T*10)+'%;background:'+rgba(s.col,1)+'"></i></span></li>';}).join('')
  :'<li style="grid-template-columns:1fr"><span class="small">Nothing held. No saboteur is past five for this person, so no line runs.</span></li>';
 [].forEach.call(ul.querySelectorAll('li[data-k]'),function(li){var s=SABS.find(function(x){return String(x.k)===li.dataset.k;});
  li.onmouseenter=function(){S.hoverSab=s;S.traceT0=performance.now();S.dirty=true;};
  li.onmouseleave=function(){S.hoverSab=null;S.dirty=true;};
  li.onclick=function(){S.holdSab=S.holdSab===s?null:s;S.traceT0=performance.now();renderAside();S.dirty=true;};
  li.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();li.onclick();}};});}
setInterval(function(){SABS.forEach(function(s){var el=document.querySelector('[data-dir="'+s.k+'"]');if(el){var d=s.dir>0?'loading':'releasing';el.textContent=d;el.className='dir '+d;}});},400);

/* ---------- controls ---------- */
function seg(id,fn){var el=document.getElementById(id);el.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
 [].forEach.call(el.querySelectorAll('button'),function(x){x.setAttribute('aria-pressed',String(x===b));});fn(b.dataset.k);S.dirty=true;});}
seg('mode',function(k){S.mode=k==='pain'?'pattern':'pain';setMode(k);});
seg('variant',function(k){S.variant=k;stillKey='';litKey='';HEATCV[0]._k=HEATCV[1]._k='';
 /* replay the switch so the difference is seen, not only set */
 if(S.mode==='pain'){S.pg=0;S.ph=0;S.mode='pattern';setMode('pain');}});
seg('amode',function(k){S.amode=k;});
seg('cmode',function(k){S.cmode=k;});
seg('face',function(k){S.face=k;var f=fitCam();flyTo(f.x,f.y,f.z);});
var br=document.getElementById('brush');br.oninput=function(){S.brush=+br.value;document.getElementById('brushv').textContent=br.value;};
document.getElementById('clear').onclick=function(){PAINT[0].fill(0);PAINT[1].fill(0);rebuildField(0);rebuildField(1);touchHeat();renderAside();S.dirty=true;};
var who=document.getElementById('who');
who.innerHTML=D.people.map(function(p){return '<option value="'+p.nm+'"'+(p.nm===S.who?' selected':'')+'>'+p.nm+', '+p.age+', '+esc(p.role)+'</option>';}).join('');
who.onchange=function(){setPerson(who.value);};
var LAY=[['sabs','Saboteur lines'],['addr','Addresses'],['nerves','Nerves'],['seats','Seats'],['grid','Grid'],['limb','Limb centres, proposed'],['labels','Region names']];
var lay=document.getElementById('layers');
LAY.forEach(function(l){var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=l[1];b.setAttribute('aria-pressed',String(S.layers[l[0]]));
 b.onclick=function(){S.layers[l[0]]=!S.layers[l[0]];b.setAttribute('aria-pressed',String(S.layers[l[0]]));stillKey='';S.dirty=true;};lay.appendChild(b);});
var mo=document.getElementById('motion');
function setReduced(on){S.reduced=on;mo.setAttribute('aria-pressed',String(on));mo.textContent='Reduced motion: '+(on?'on':'off');
 if(on&&S.tr){S.pg=S.tr.gt;S.ph=S.tr.ht;S.tr=null;}S.dirty=true;}
mo.onclick=function(){setReduced(!S.reduced);};
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)setReduced(true);
document.getElementById('zin').onclick=function(){flyTo(S.cam.x,S.cam.y,Math.min(S.cam.z*1.5,S.z0*8));};
document.getElementById('zout').onclick=function(){flyTo(S.cam.x,S.cam.y,Math.max(S.cam.z/1.5,S.z0*.8));};
document.getElementById('zfit').onclick=function(){var f=fitCam();flyTo(f.x,f.y,f.z);};
window.addEventListener('resize',function(){resize();});

/* ---------- the measuring hooks the simulation drives ---------- */
function lab(r,g,b){function f(c){c/=255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4);}
 var R=f(r),G=f(g),B=f(b),X=(R*.4124+G*.3576+B*.1805)/.95047,Y=R*.2126+G*.7152+B*.0722,Z=(R*.0193+G*.1192+B*.9505)/1.08883;
 function h(t){return t>.008856?Math.cbrt(t):7.787*t+16/116;}return [116*h(Y)-16,500*(h(X)-h(Y)),200*(h(Y)-h(Z))];}
function lum(r,g,b){function f(c){c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4);}return .2126*f(r)+.7152*f(g)+.0722*f(b);}
function grab(){draw(0);return ctx.getImageData(0,0,cv.width,cv.height);}
window.__proto={S:S,VAR:VAR,SABS:function(){return SABS;},REG:REG,setMode:setMode,setPerson:setPerson,flyTo:flyTo,fitCam:fitCam,
 setVariant:function(k){S.variant=k;stillKey='';litKey='';HEATCV[0]._k=HEATCV[1]._k='';},
 /* the switch's own curve, sampled: when is the heat readable and the ground settled */
 timeline:function(k){var V=VAR[k],out={};function at(spec,t){var e=clamp((t-spec[0])/spec[1],0,1);return spec[2]?spec[2](e):Math.ceil(e*5)/5;}
  for(var t=0;t<=1200;t+=10){if(out.heat90==null&&at(V.on.h,t)>=.9)out.heat90=t;if(out.ground90==null&&at(V.on.g,t)>=.9)out.ground90=t;}
  out.settled=Math.max(V.on.h[0]+V.on.h[1],V.on.g[0]+V.on.g[1]);return out;},
 /* a calibration ladder: five cells on the front torso at 2, 4, 6, 8, 10,
    far enough apart that no two merge */
 ladder:function(){PAINT[0].fill(0);PAINT[1].fill(0);var cells=[];[2,4,6,8,10].forEach(function(val,j){var c=10,r=8+j*2,i=r*COLS+c;PAINT[0][i]=val;cells.push({v:0,c:c,r:r,val:val});});
  rebuildField(0);rebuildField(1);touchHeat();markVals();return cells;},
 measure:function(cells,pattern){
  /* Each element against its own ground. The nerve pixels are found in the
     Pattern frame, where every nerve is drawn, so a nerve dimmed almost to
     nothing in Pain still counts as a nerve, at the contrast it has left.
     The first cut found them in the Pain frame and so dropped exactly the
     nerves a switch had dimmed most, which flattered that switch. Marks,
     cables and labels are off so none of them lands in a sample. */
  var was={r:S.reduced,l:Object.assign({},S.layers),m:S.mode,pg:S.pg,ph:S.ph};setReduced(true);S.tr=null;
  ['sabs','addr','limb','labels'].forEach(function(k){S.layers[k]=false;});
  var f=fitCam();S.cam=f;S.camT=null;
  function state(pain,nerves){S.mode=pain?'pain':'pattern';S.pg=S.ph=pain?1:0;S.layers.nerves=nerves;stillKey='';HEATCV[0]._k=HEATCV[1]._k='';return grab();}
  var R1=state(false,true),R0=state(false,false),A=state(!pattern,true),B=state(!pattern,false);
  var W=cv.width,dpr=S.dpr;
  function px(img,x,y){var i=(Math.round(y*dpr)*W+Math.round(x*dpr))*4;return [img.data[i],img.data[i+1],img.data[i+2]];}
  var steps=cells.map(function(c){var L=[0,0,0],n=0,lums=[];
   for(var a=.3;a<=.701;a+=.05)for(var b=.3;b<=.701;b+=.05){var s=w2s(XA+(c.c+a)*U,YA+(c.r+b)*U),p=px(A,s[0],s[1]),l=lab(p[0],p[1],p[2]);L[0]+=l[0];L[1]+=l[1];L[2]+=l[2];n++;lums.push(l[0]);}
   var m=lums.reduce(function(x,y){return x+y;},0)/lums.length,sd=Math.sqrt(lums.reduce(function(x,y){return x+(y-m)*(y-m);},0)/lums.length);
   return {val:c.val,lab:[L[0]/n,L[1]/n,L[2]/n],sdL:sd};});
  var dE=[];for(var i=1;i<steps.length;i++){var a=steps[i-1].lab,b=steps[i].lab;dE.push(Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]));}
  var inH=[],outH=[],mid=(76+OX+24)/2;
  for(var y=0;y<S.H;y+=2)for(var x=0;x<S.W;x+=2){var r1=px(R1,x,y),r0=px(R0,x,y);
   if(Math.abs(r1[0]-r0[0])+Math.abs(r1[1]-r0[1])+Math.abs(r1[2]-r0[2])<30)continue;
   var w=s2w(x,y),v=w[0]>mid?1:0;if(!inBody(v,w[0]-vx(v),w[1]))continue;var hv=fieldAt(v,w[0]-vx(v),w[1]);
   var pa=px(A,x,y),pb=px(B,x,y),la=lum(pa[0],pa[1],pa[2]),lb=lum(pb[0],pb[1],pb[2]),cr=(Math.max(la,lb)+.05)/(Math.min(la,lb)+.05);
   if(hv>=3)inH.push(cr);else if(hv<0.2)outH.push(cr);}
  function med(a){if(!a.length)return null;a=a.slice().sort(function(x,y){return x-y;});return a[a.length>>1];}
  var man=lab(C.man[0],C.man[1],C.man[2]);
  var res={minStepDE:Math.min.apply(null,dE),stepsDE:dE,clutterSdL:steps.reduce(function(x,s){return x+s.sdL;},0)/steps.length,
   nerveInHeat:med(inH),nerveOutHeat:med(outH),nInHeat:inH.length,nOutHeat:outH.length,
   topVsMan:Math.hypot(steps[4].lab[0]-man[0],steps[4].lab[1]-man[1],steps[4].lab[2]-man[2])};
  S.layers=was.l;S.mode=was.m;S.pg=was.pg;S.ph=was.ph;setReduced(was.r);stillKey='';S.dirty=true;return res;},
 frameMs:function(){return S.frameMs;}};

/* ---------- start ---------- */
buildRoutes();resize();setPerson(S.who);hint();
requestAnimationFrame(frame);
})();
