/* The body map specification's own numbers and plates, derived, not typed.

   Run from the repo root:
     node proto/body-map-spec/gen.js
   Writes, next to this file:
     metrics.json     every count BODY-MAP-SPEC.md quotes, read off the data
     plate.svg        front, back, and the head twice (front and cut), at the
                      resolution the spec proposes
     questions.svg    each intent question drawn with its answers side by side
   Then, if playwright is on NODE_PATH, render.js turns both into PNGs.

   SOURCES, all read at run time so a change to them changes the numbers:
     atuned_src/engine/data/nodes.js    the 112 addresses and their seats
     atuned_src/engine/data/figure.js   ANAT, ANATHEAD, ANATSPINE, BODYPATH
     atuned_src/engine/data/practice.js PMBANDS, PAINREG
     proto/fw/pages/fetters.html        PROP, the 28 proposed on 27 September
   One table is typed here and says so: HEADY, the front to back coordinate
   of each head place, which the atlas pass (BQ) measured and then dropped.
   Those are approximate and marked approximate everywhere they appear.
   Nothing here touches atuned_src or source.html. */
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..'), HERE=__dirname;
const rd=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const G={};
function load(src){ /* top level var/const/function into G, without a DOM */
 src=src.replace(/^\s*(var|const|let)\s+/gm,'G.__v=0;var ');
 new Function('G','PAL',src+';for(const k of '+JSON.stringify(['NODES','ANAT','ANATHEAD','ANATSPINE','BODYPATH','PMS','PMTX','PMTY','PMBANDS','PAINREG'])+'){try{G[k]=eval(k)}catch(e){}}')(G,new Proxy({},{get:()=>'#888'}));}
load(rd('atuned_src/engine/data/nodes.js'));
load(rd('atuned_src/engine/data/figure.js'));
load(rd('atuned_src/engine/data/practice.js'));
const fwsrc=rd('proto/fw/pages/fetters.html');
const PROP=eval(fwsrc.match(/var PROP=(\[[\s\S]*?\]);\s*var DOTR/)[1]);

/* ---------- the figure's own rulers ---------- */
const STATURE_UNITS=93.674, CM=175/STATURE_UNITS;       /* measure.js, out/after.json figure.stature */
const H=G.ANATHEAD, MMU=(H.topZ-H.earZ)/(H.year-H.ytop); /* head millimetres per figure unit */
function spine(lv){const R=G.ANATSPINE;let i=0;while(i<R.length-2&&lv>R[i+1][0])i++;
 const a=R[i],b=R[i+1];return a[1]+(lv-a[0])*(b[1]-a[1])/(b[0]-a[0]);}

/* ---------- measured on the committed build, 1c89ff4, by probe (see spec §2) ---------- */
const SCREEN={w1600:{pxu:8.31,stage:[920,831],headpxu:32.79},w390:{pxu:3.74,stage:[374,470],headpxu:15.58}};
const TOUCH=44;

/* ---------- which surface each address belongs on ----------
   head   inside the skull, 3rd Eye and Crown. Needs the cut, see HEADY.
   back   a structure reached from behind: the back chart's own points
          (Brihati, Parshvasandhi, Kukundara, Katikataruna), the tailbone, and
          the spinal roots, cord and lumbar plexus, which lie against or
          inside the spine.
   both   the top of the shoulder, which both views show.
   front  everything else. */
const BACK=new Set([50,59,38,39,43,45,17,28,4,13,14,9,6,1,8,16,27]);
const BOTH=new Set([69,73]);
const viewOf=n=>(n.b==='Crown'||n.b==='3rd Eye')?'head':BACK.has(n.i)?'back':BOTH.has(n.i)?'both':'front';

/* ---------- HEADY. Approximate, typed, not measured. ----------
   MNI y in millimetres, + toward the face, for each head place, keyed by the
   first address of its ANAT row. From standard atlas centroids as commonly
   published (Harvard-Oxford, the MNI origin at the anterior commissure), to
   about 10 mm. The BQ pass computed three coordinates and ANAT keeps two; the
   fix is to rerun that pass and keep y, not to trust these. */
const HEADY={79:2,83:-24,82:-80,85:-50,87:-18,80:-30,84:-112,107:-20,91:-52,95:-40,97:20,88:-8,
 94:-18,99:-20,102:-18,104:-24,103:-6,90:-18,98:-17,92:-26,96:-30};

/* ---------- every place: measured (ANAT) and proposed (PROP) ---------- */
const byId={};G.NODES.forEach(n=>byId[n.i]=n);
const places=[];   /* {ids, pts:[{x,y}], src:'atlas'|'spine'|'chart'|'proposed'|'seat', view, head?:[{x,z,y}]} */
G.ANAT.forEach(r=>{
 let pts,src,head=null;
 if(r.h){src='atlas';pts=r.h.map(p=>({x:50-p[0]/MMU,y:H.ytop+(H.topZ-p[1])/MMU}));
  const yy=HEADY[r.ids[0]];head=r.h.map(p=>({x:p[0],z:p[1],y:yy}));}
 else if(r.v){src='spine';pts=r.v.map(p=>({x:50+p[1],y:spine(p[0])}));}
 else if(r.f){src='chart';pts=r.f.map(p=>({x:p[0],y:p[1]}));}
 else{src='seat';const b=G.PMBANDS.find(b=>b.k===r.at);pts=[{x:50,y:b.yp}];}
 places.push({s:r.s,ids:r.ids,pts,src,head,view:viewOf(byId[r.ids[0]])});});
PROP.forEach(r=>places.push({s:r.s,ids:r.ids,pts:r.pts.map(p=>({x:p[0],y:p[1]})),src:'proposed',
 view:viewOf(byId[r.ids[0]]),fwview:r.v}));

/* ---------- regions ---------- */
function regionOf(p){
 if(p.y<19.07)return 'head';               /* the neck's base, measure.js landmark S */
 if(Math.abs(p.x-50)>9.5&&p.y<60)return p.x<50?'arm, person\'s right':'arm, person\'s left';
 if(p.y>56.76)return p.x<50?'leg, person\'s right':'leg, person\'s left';  /* crotch, landmark C */
 if(p.y<45)return 'torso';
 return 'pelvis';}

/* ---------- metrics ---------- */
const M={stamp:{read:new Date().toISOString(),statureUnits:STATURE_UNITS,cmPerUnit:+CM.toFixed(3),headMmPerUnit:+MMU.toFixed(2)}};
const som=G.NODES.filter(n=>n.b!=='Field-Above'&&n.b!=='Field-Below');
M.addresses={all:G.NODES.length,somatic:som.length,field:G.NODES.length-som.length};
const placedIds=new Set(),propIds=new Set();
places.forEach(p=>p.ids.forEach(i=>(p.src==='proposed'?propIds:placedIds).add(i)));
M.placement={measuredInEngine:placedIds.size,proposedFW:propIds.size,
 neither:som.filter(n=>!placedIds.has(n.i)&&!propIds.has(n.i)).map(n=>n.i),
 bySource:places.reduce((o,p)=>{o[p.src]=(o[p.src]||0)+p.ids.length;return o;},{})};
M.views={};som.forEach(n=>{const v=viewOf(n);M.views[v]=(M.views[v]||0)+1;});
M.backDrawnOnFrontToday=places.filter(p=>p.view==='back'&&p.src!=='proposed').reduce((a,p)=>a.concat(p.ids),[]);
M.nervesShared=Object.entries(som.reduce((o,n)=>{o[n.n]=(o[n.n]||[]).concat(n.i);return o;},{})).filter(e=>e[1].length>1);

/* a place is one drawn point. bilateral rows give two. */
const pts=[];places.forEach(p=>p.pts.forEach((q,k)=>pts.push({x:q.x,y:q.y,ids:p.ids,view:p.view,src:p.src,region:regionOf(q),s:p.s})));
M.points={total:pts.length,bilateralPlaces:places.filter(p=>p.pts.length===2).length,
 multiAddressPlaces:places.filter(p=>p.ids.length>1).length,
 maxAddressesOnOnePlace:Math.max(...places.map(p=>p.ids.length))};
/* addresses per region (an address counts once, at its first point) */
const regA={};places.forEach(p=>{const r=regionOf(p.pts[0]);regA[r]=(regA[r]||0)+p.ids.length;});
M.addressesByRegion=regA;

/* nearest neighbour between distinct points, same view, in cm */
function nn(list){return list.map((a,i)=>{let d=1e9;list.forEach((b,j)=>{if(i!==j){const e=Math.hypot(a.x-b.x,a.y-b.y);if(e<d)d=e;}});return d*CM;});}
const med=a=>{const s=a.slice().sort((x,y)=>x-y);return s.length?+(s[Math.floor(s.length/2)]).toFixed(1):null;};
/* occupied cells of a cm grid, anchored on the midline and the vertex: how
   many places a person can tell apart at that resolution. Single linkage was
   tried first and chained the whole head into one group, which is false. */
function cells(list,cm){const u=cm/CM;return new Set(list.map(p=>Math.floor((p.x-50)/u+0.5)+':'+Math.floor((p.y-4.2)/u))).size;}
function zoomPxu(list,stage){
 let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;list.forEach(p=>{x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y);});
 const w=Math.max(x1-x0,8)*1.3,h=Math.max(y1-y0,8)*1.3;return Math.min(stage[0]/w,stage[1]/h);}
M.resolution={touchFloorPx:TOUCH,
 wholeBody:{w1600_cm:+(TOUCH/SCREEN.w1600.pxu*CM).toFixed(1),w390_cm:+(TOUCH/SCREEN.w390.pxu*CM).toFixed(1)},
 headOpened:{w1600_cm:+(TOUCH/SCREEN.w1600.headpxu*CM).toFixed(1),w390_cm:+(TOUCH/SCREEN.w390.headpxu*CM).toFixed(1)},
 byRegion:{}};
['head','torso','pelvis'].forEach(r=>{
 ['front','back'].concat(r==='head'?['head']:[]).forEach(v=>{
  const L=pts.filter(p=>p.region===r&&(p.view===v||(v!=='head'&&p.view==='both')));
  if(L.length<2)return;
  const d=nn(L);
  /* the head opens to the product's own measured head box, not a guess */
  const z16=v==='head'?SCREEN.w1600.headpxu:zoomPxu(L,SCREEN.w1600.stage),z39=v==='head'?SCREEN.w390.headpxu:zoomPxu(L,SCREEN.w390.stage);
  const f16=TOUCH/z16*CM,f39=TOUCH/z39*CM;
  M.resolution.byRegion[r+'/'+v]={points:L.length,nnMedianCm:med(d),nnMinCm:+Math.min(...d).toFixed(1),
   zoomedTouchCm:{w1600:+f16.toFixed(1),w390:+f39.toFixed(1)},
   cells5cm:cells(L,5),cells3cm:cells(L,3),cells2cm:cells(L,2),
   pointsCloserThanTouch:{whole390:d.filter(x=>x<M.resolution.wholeBody.w390_cm).length,
    zoom390:d.filter(x=>x<f39).length,zoom1600:d.filter(x=>x<f16).length}};});});

/* the head, both ways. front projection (x,z) against the cut (y,z), mm */
const hp=[];places.filter(p=>p.head).forEach(p=>p.head.forEach(q=>hp.push({ids:p.ids,s:p.s,...q})));
const midline=hp.filter(q=>Math.abs(q.x)<3);
function pairs(list,f){const o=[];for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++)o.push({a:list[i],b:list[j],d:f(list[i],list[j])});return o;}
const fr=pairs(midline,(a,b)=>Math.hypot(a.x-b.x,a.z-b.z)), cut=pairs(midline,(a,b)=>Math.hypot(a.y-b.y,a.z-b.z));
M.head={places:hp.length,addresses:places.filter(p=>p.head).reduce((a,p)=>a+p.ids.length,0),
 midlinePlaces:midline.length,midlineAddresses:midline.reduce((a,q)=>a+q.ids.length,0),
 frontNearestMedianMm:med(midline.map(a=>Math.min(...midline.filter(b=>b!==a).map(b=>Math.hypot(a.x-b.x,a.z-b.z))))),
 cutNearestMedianMm:med(midline.map(a=>Math.min(...midline.filter(b=>b!==a).map(b=>Math.hypot(a.y-b.y,a.z-b.z))))),
 pairsUnder10mmFront:fr.filter(p=>p.d<10).length,pairsUnder10mmCut:cut.filter(p=>p.d<10).length,
 worstFront:fr.sort((p,q)=>p.d-q.d).slice(0,4).map(p=>({a:p.a.s.split(',')[0],b:p.b.s.split(',')[0],frontMm:+p.d.toFixed(1),
  cutMm:+Math.hypot(p.a.y-p.b.y,p.a.z-p.b.z).toFixed(1)})),
 touchAtPhoneOpenedMm:+(TOUCH/SCREEN.w390.headpxu*MMU).toFixed(0),
 touchAt1600OpenedMm:+(TOUCH/SCREEN.w1600.headpxu*MMU).toFixed(0)};

/* the spine ruler against the 112 chart's own T4 to T5 label */
M.spineRuler={ourT4T5y:spine(11.5),chart112T4T5y:25.284,gapCm:+((spine(11.5)-25.284)*CM).toFixed(1),
 note:'the ruler is anchored on the seats\' drawn heights; see spec §3.4'};

/* marma against addresses, by the classical regions */
M.marmaVsAddresses={marma:{limbs:44,chestAbdomen:12,back:14,aboveCollarbones:37},
 addresses:(()=>{const o={limbs:0,chestAbdomen:0,back:0,aboveCollarbones:0,unplaced:0};
  som.forEach(n=>{const p=places.find(q=>q.ids.includes(n.i));if(!p){o.unplaced++;return;}
   const r=regionOf(p.pts[0]),v=viewOf(n);
   if(r.startsWith('arm')||r.startsWith('leg'))o.limbs++;else if(r==='head'||v==='head')o.aboveCollarbones++;
   else if(v==='back')o.back++;else o.chestAbdomen++;});return o;})()};
/* the background grid: 5 cm cells whose centre falls inside the outline, one
   view. The back uses the same outline, so the count is the same. */
M.grid=(()=>{const v=G.BODYPATH.match(/-?\d+(\.\d+)?/g).map(Number),P=[[v[0],v[1]]];
 for(let i=2;i+5<v.length;i+=6)P.push([v[i+4],v[i+5]]);
 const Q=P.map(p=>[G.PMTX+p[0]*G.PMS,G.PMTY+p[1]*G.PMS]);
 const inside=(x,y)=>{let c=false;for(let a=0,b=Q.length-1;a<Q.length;b=a++){const A=Q[a],B=Q[b];
  if((A[1]>y)!==(B[1]>y)&&x<A[0]+(y-A[1])*(B[0]-A[0])/(B[1]-A[1]))c=!c;}return c;};
 const o={};[5,3,2].forEach(cm=>{const u=cm/CM;let n=0;
  for(let y=2+u/2;y<98;y+=u)for(let x=50-u*12+u/2;x<50+u*12;x+=u)if(inside(x,y))n++;o['cells'+cm+'cm']=n;});
 return o;})();
/* a region pressed: today every address in the region's seats (PAINREG
   bands), against the addresses whose place stands inside the region */
M.regionExamples=[
 {nm:'Trap, back view',today:'shoulders',view:['back','both'],box:[40,18.5,60,24.5]},
 {nm:'Low back, back view',today:'pelvis',view:['back'],box:[43,39,57,49]},
 {nm:'Chest, front view',today:'torso',view:['front','both'],box:[41,22,59,34]}].map(e=>{
 const reg=G.PAINREG.find(r=>r.k===e.today);
 const byBand=som.filter(n=>reg.bands.includes(n.b));
 const ids=new Set();places.forEach(p=>{if(!e.view.includes(p.view))return;
  p.pts.forEach(q=>{if(q.x>=e.box[0]&&q.x<=e.box[2]&&q.y>=e.box[1]&&q.y<=e.box[3])p.ids.forEach(i=>ids.add(i));});});
 return {nm:e.nm,todayRegion:reg.nm,todayBands:reg.bands,todayAddresses:byBand.length,
  placedAddresses:ids.size,placed:[...ids].sort((a,b)=>a-b).map(i=>byId[i].k)};});
M.marmaSizes={src:'Sushruta, pramana bheda, by search result (see spec)',halfAngula:56,one:12,two:6,three:4,palm:29,cmPerAngula:2};
M.pain={regions:G.PAINREG.length,views:'front only',names:G.PAINREG.map(r=>r.k)};
fs.writeFileSync(path.join(HERE,'metrics.json'),JSON.stringify(M,null,1));

/* =================================================================
   PLATES. Muted, ring icons, sentence case, the house look.
   ================================================================= */
const C={bg:'#101217',ink:'#d9dbe1',dim:'#8a8f9c',faint:'#2a2e38',line:'#3a3f4b',
 meas:'#9cc3b0',prop:'#d8b27a',back:'#9aa9d6',head:'#c3a0d0',warn:'#d08a7a',grid:'#1c2029'};
const f=(n,d=2)=>(+n).toFixed(d);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
function txt(x,y,s,o={}){return `<text x="${f(x)}" y="${f(y)}" fill="${o.c||C.ink}" font-size="${o.fs||13}" ${o.a?`text-anchor="${o.a}"`:''} ${o.w?`font-weight="${o.w}"`:''} font-family="Inter,Helvetica,Arial,sans-serif">${esc(s)}</text>`;}
/* the body outline, product's own path, in figure units */
const bodyG=(mirror)=>`<g ${mirror?'transform="translate(100,0) scale(-1,1)"':''}><path d="${G.BODYPATH}" transform="translate(${G.PMTX},${G.PMTY}) scale(${G.PMS})" fill="#171a21" stroke="${C.line}" stroke-width="${f(1/G.PMS*0.18,3)}"/></g>`;
/* landmarks, figure units. y from measure.js's figure (V E N S C F) and the seats */
const LM_FRONT=[[4.2,'vertex'],[10.57,'brow line'],[16.6,'neck, narrowest'],[19.07,'suprasternal notch'],
 [30.51,'nipple line, Heart seat'],[36.0,'xiphoid (proposed)'],[43.07,'navel'],[47.7,'above the pubic bone'],[56.76,'crotch'],[97.87,'sole']];
const LM_BACK=[[12.8,'inion (proposed)'],[20.2,'C7, vertebra prominens (proposed)'],[24.0,'scapular spine, T3 (proposed)'],
 [30.0,'inferior angle, T7 (proposed)'],[45.5,'iliac crest, L4 (proposed)'],[49.33,'sacral dimples, S2'],[53.55,'tailbone'],[60.5,'gluteal fold (proposed)']];
function bodyPanel(ox,oy,s,view,title){
 const mirror=view==='back';
 let g=`<g transform="translate(${ox},${oy})">`+txt(50*s-25*s+0,-14,title,{fs:17,w:600})+`<g transform="scale(${s}) translate(-25,0)">`;
 /* the 5 cm grid, the proposed resolution cell */
 const cell=5/CM;
 for(let y=2;y<=98;y+=cell)g+=`<line x1="27" x2="73" y1="${f(y)}" y2="${f(y)}" stroke="${C.grid}" stroke-width="0.08"/>`;
 for(let x=50-cell*4;x<=50+cell*4+0.01;x+=cell)g+=`<line x1="${f(x)}" x2="${f(x)}" y1="2" y2="98" stroke="${C.grid}" stroke-width="0.08"/>`;
 g+=bodyG(mirror);
 /* region bands */
 const bands=[[2,19.07,'head and neck'],[19.07,45,'torso'],[45,56.76,'pelvis']];
 bands.forEach(([a,b,n])=>{g+=`<line x1="27" x2="73" y1="${b}" y2="${b}" stroke="${C.dim}" stroke-width="0.12" stroke-dasharray="0.6 0.6"/>`;});
 /* landmarks as ticks on the outer edge */
 (view==='front'?LM_FRONT:LM_BACK).forEach(([y,n])=>{
  g+=`<line x1="${mirror?73:25.8}" x2="${mirror?74.2:27}" y1="${y}" y2="${y}" stroke="${C.dim}" stroke-width="0.15"/>`;});
 /* points */
 pts.filter(p=>p.view===view||p.view==='both').forEach(p=>{
  const x=mirror?100-p.x:p.x;
  const col=p.src==='proposed'?C.prop:(view==='back'?C.back:C.meas);
  const r=0.42+0.13*Math.min(p.ids.length,6);
  g+=`<circle cx="${f(x)}" cy="${f(p.y)}" r="${f(r)}" fill="${p.src==='proposed'?'none':col}" stroke="${col}" stroke-width="0.16"/>`;
  if(p.ids.length>1)g+=`<text x="${f(x+r+0.25)}" y="${f(p.y+0.45)}" font-size="1.15" fill="${C.dim}" font-family="Inter,Arial">${p.ids.length}</text>`;});
 /* the head's points, drawn faint so the front shows where they collapse */
 if(view==='front')pts.filter(p=>p.view==='head').forEach(p=>{g+=`<circle cx="${f(p.x)}" cy="${f(p.y)}" r="0.32" fill="${C.head}" opacity=".75"/>`;});
 /* the fingertip at phone width, whole body, and opened region */
 if(view==='front'){
  const r390=M.resolution.wholeBody.w390_cm/CM/2, rz=M.resolution.byRegion['torso/front'].zoomedTouchCm.w390/CM/2;
  g+=`<circle cx="66" cy="78" r="${f(r390)}" fill="none" stroke="${C.warn}" stroke-width="0.18" stroke-dasharray="0.7 0.5"/>`;
  g+=`<circle cx="66" cy="${f(78-r390-rz-1.2)}" r="${f(rz)}" fill="none" stroke="${C.warn}" stroke-width="0.18"/>`;}
 g+='</g>';
 if(view==='front'){g+=txt((66-25)*s,(78+M.resolution.wholeBody.w390_cm/CM/2+2.2)*s,'one fingertip, phone, whole body',{fs:10.5,c:C.warn,a:'middle'});
  g+=txt((66-25+2.2)*s,(78-M.resolution.wholeBody.w390_cm/CM/2-1.6)*s,'torso opened',{fs:10.5,c:C.warn});}
 /* landmark labels at plate scale, outside the figure */
 (view==='front'?LM_FRONT:LM_BACK).forEach(([y,n])=>{
  const lx=mirror?(74.6-25)*s:(25.4-25)*s;
  g+=txt(lx,y*s+4,n,{fs:10.5,c:C.dim,a:mirror?'start':'end'});});
 if(!mirror)bands.forEach(([a,b,n])=>{g+=txt((74-25)*s,((a+b)/2)*s,n,{fs:11,c:C.dim});});
 return g+'</g>';}

/* head panels in MNI millimetres, 2 px per mm */
function headPanel(ox,oy,mode,title,sub){
 const S=1.9;let g=`<g transform="translate(${ox},${oy})">`+txt(0,-30,title,{fs:17,w:600})+txt(0,-12,sub,{fs:11.5,c:C.dim});
 const X=v=>mode==='cut'?(v+125)*S:(v+95)*S, Z=v=>(110-v)*S;
 const W=mode==='cut'?225*S:190*S, Hh=245*S;
 g+=`<rect x="0" y="0" width="${f(W)}" height="${f(Hh)}" fill="none" stroke="${C.faint}"/>`;
 for(let v=-120;v<=100;v+=20)g+=`<line x1="${f(X(v))}" x2="${f(X(v))}" y1="0" y2="${f(Hh)}" stroke="${C.grid}"/>`;
 for(let v=-130;v<=110;v+=20)g+=`<line x1="0" x2="${f(W)}" y1="${f(Z(v))}" y2="${f(Z(v))}" stroke="${C.grid}"/>`;
 if(mode==='cut'){
  /* schematic skull, face to the right, not traced from anything */
  g+=`<path d="M${X(-112)} ${Z(-23)} C${X(-120)} ${Z(40)} ${X(-80)} ${Z(98)} ${X(-15)} ${Z(101)} C${X(45)} ${Z(103)} ${X(80)} ${Z(60)} ${X(82)} ${Z(0)}
   L${X(84)} ${Z(-20)} L${X(92)} ${Z(-42)} L${X(86)} ${Z(-50)} L${X(88)} ${Z(-70)} L${X(80)} ${Z(-78)} L${X(84)} ${Z(-90)} L${X(70)} ${Z(-104)} L${X(45)} ${Z(-100)}
   L${X(20)} ${Z(-80)} L${X(10)} ${Z(-120)} M${X(-60)} ${Z(-120)} L${X(-62)} ${Z(-70)} C${X(-90)} ${Z(-60)} ${X(-108)} ${Z(-45)} ${X(-112)} ${Z(-23)}"
   fill="#171a21" stroke="${C.line}" stroke-width="1.4"/>`;
  g+=`<ellipse cx="${X(-17)}" cy="${Z(12)}" rx="${86*S}" ry="${64*S}" fill="none" stroke="${C.faint}" stroke-width="1" stroke-dasharray="4 3"/>`;
  g+=txt(X(84),Z(-30)+4,'face',{fs:10,c:C.dim});g+=txt(X(-118),Z(-40),'back',{fs:10,c:C.dim,a:'end'});
 }else{
  g+=`<path d="M${X(-72)} ${Z(20)} C${X(-74)} ${Z(80)} ${X(-40)} ${Z(102)} ${X(0)} ${Z(102)} C${X(40)} ${Z(102)} ${X(74)} ${Z(80)} ${X(72)} ${Z(20)}
   C${X(72)} ${Z(-30)} ${X(66)} ${Z(-60)} ${X(52)} ${Z(-82)} C${X(36)} ${Z(-104)} ${X(14)} ${Z(-112)} ${X(0)} ${Z(-112)} C${X(-14)} ${Z(-112)} ${X(-36)} ${Z(-104)} ${X(-52)} ${Z(-82)}
   C${X(-66)} ${Z(-60)} ${X(-72)} ${Z(-30)} ${X(-72)} ${Z(20)}Z" fill="#171a21" stroke="${C.line}" stroke-width="1.4"/>`;
  g+=`<line x1="${X(0)}" x2="${X(0)}" y1="${Z(102)}" y2="${Z(-112)}" stroke="${C.faint}" stroke-dasharray="3 3"/>`;
  g+=txt(X(-92),Z(-122),'person\'s right on the left, as on every front view',{fs:10,c:C.dim});
 }
 hp.forEach(q=>{const u=mode==='cut'?q.y:-q.x;const r=2.6+1.1*Math.min(q.ids.length,4);
  const mid=Math.abs(q.x)<3;
  g+=`<circle cx="${f(X(u))}" cy="${f(Z(q.z))}" r="${f(r)}" fill="${mid?C.head:'none'}" stroke="${C.head}" stroke-width="1.3" opacity="${mid?0.9:0.8}"/>`;});
 /* label the midline ones on the cut, where they separate */
 if(mode==='cut'){
  const lab={79:['chiasm',9,12],80:['pineal',-9,4,'end'],103:['hypothalamus',9,0],92:['midbrain',-9,10,'end'],96:['brainstem',9,4],
   97:['ant. cingulate',9,4],95:['post. cingulate',-9,4,'end'],88:['corpus callosum',9,10],107:['sinus',9,4],84:['inion',9,4],90:['axis',9,-6]};
  hp.filter(q=>Math.abs(q.x)<3&&lab[q.ids[0]]).forEach(q=>{const L=lab[q.ids[0]];g+=txt(X(q.y)+L[1],Z(q.z)+L[2],L[0],{fs:10,c:C.ink,a:L[3]});});
  g+=txt(0,Hh+18,'The same places spread out. Front to back values approximate, about 10 mm.',{fs:11,c:C.ink});
 }else{
  g+=txt(0,Hh+18,`The ${M.head.midlinePlaces} filled dots on the centre line hold ${M.head.midlineAddresses} addresses, stacked in one column.`,{fs:11,c:C.ink});
 }
 /* one fingertip, phone, head opened */
 const tr=M.head.touchAtPhoneOpenedMm/2*S;
 g+=`<circle cx="${f(W-tr-8)}" cy="${f(Hh-tr-8)}" r="${f(tr)}" fill="none" stroke="${C.warn}" stroke-width="1.3"/>`;
 g+=txt(W-2*tr-14,Hh-tr-4,'one fingertip',{fs:10,c:C.warn,a:'end'});g+=txt(W-2*tr-14,Hh-tr+9,'phone, head opened',{fs:10,c:C.warn,a:'end'});
 return g+'</g>';}

const PW=2360,PH=1180;
let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}" viewBox="0 0 ${PW} ${PH}"><rect width="${PW}" height="${PH}" fill="${C.bg}"/>`;
svg+=txt(40,44,'The body map, at the resolution the team needs',{fs:26,w:600});
svg+=txt(40,70,`Front and back at 5 cm cells, the head twice. ${pts.length} drawn places for every address inside the body, all 112 but the 4 outside it. Proposed, not built. Generated by proto/body-map-spec/gen.js.`,{fs:13.5,c:C.dim});
const BS=9.9;
svg+=bodyPanel(160,120,BS,'front','Front');
svg+=bodyPanel(820,120,BS,'back','Back, seen from behind');
svg+=headPanel(1520,150,'front','Head, front (what the engine stores)','side to side and height only');
svg+=headPanel(1520+190*1.9+40,150,'cut','Head, cut down the middle (proposed)','front to back and height: the one side view needed');
/* legend */
const lx=1520,ly=700;let L='';
const leg=[[C.meas,1,'measured and in the engine today (atlas, spine or his charts)'],[C.back,1,'measured, belongs on the back, drawn on the front today'],
 [C.prop,0,'proposed on 27 September (FW), not in the engine'],[C.head,1,'inside the skull, placed from the brain atlas']];
leg.forEach(([c,fill,s],i)=>{L+=`<circle cx="${lx+8}" cy="${ly+i*24}" r="6" fill="${fill?c:'none'}" stroke="${c}" stroke-width="1.5"/>`+txt(lx+24,ly+i*24+4.5,s,{fs:13});});
L+=txt(lx+2,ly+4*24+4.5,'A number beside a dot: that many addresses stand on one place. A bigger dot holds more.',{fs:13,c:C.dim});
L+=`<rect x="${lx}" y="${ly+5*24-8}" width="16" height="16" fill="none" stroke="${C.grid}" stroke-width="2"/>`+txt(lx+24,ly+5*24+4.5,'Grid cell: 5 cm on a 175 cm person, the resolution this spec proposes',{fs:13});
L+=`<circle cx="${lx+8}" cy="${ly+6*24}" r="7" fill="none" stroke="${C.warn}" stroke-width="1.5" stroke-dasharray="3 2"/>`+txt(lx+24,ly+6*24+4.5,`Dashed ring on the front figure: one 44 pixel fingertip on a phone, whole body. ${M.resolution.wholeBody.w390_cm} cm of body.`,{fs:13});
L+=`<circle cx="${lx+8}" cy="${ly+7*24}" r="7" fill="none" stroke="${C.warn}" stroke-width="1.5"/>`+txt(lx+24,ly+7*24+4.5,`Solid ring: the same fingertip with the torso opened on a phone. ${M.resolution.byRegion['torso/front'].zoomedTouchCm.w390} cm.`,{fs:13});
const nums=[
 `Head: on the front the ${M.head.midlinePlaces} midline places sit a median ${M.head.frontNearestMedianMm} mm from their nearest neighbour. Cut down the middle, ${M.head.cutNearestMedianMm} mm.`,
 `The cut's front to back values are approximate (about 10 mm), typed from atlas centroids.`,`The atlas pass (BQ) measured them and the engine kept only two of the three coordinates.`,
 `${M.backDrawnOnFrontToday.length} measured addresses belong on the back and are drawn on the front today. The pain map is front only.`,
 `Arms and legs hold ${M.marmaVsAddresses.addresses.limbs} addresses. The marma chart puts 44 of its 107 points there.`];
nums.forEach((s,i)=>{L+=txt(lx,ly+8*24+20+i*22,s,{fs:13,c:(i===1||i===2)?C.dim:C.ink});});
svg+=L+'</svg>';
fs.writeFileSync(path.join(HERE,'plate.svg'),svg);

/* =================================================================
   QUESTIONS. Each drawn with both answers, the ruling of 21 September.
   ================================================================= */
function miniBody(ox,oy,s,inner,mirror){return `<g transform="translate(${ox},${oy}) scale(${s}) translate(-25,0)">${bodyG(mirror)}${inner}</g>`;}
const QW=1100,QH=1330;let q=`<svg xmlns="http://www.w3.org/2000/svg" width="${QW}" height="${QH}" viewBox="0 0 ${QW} ${QH}"><rect width="${QW}" height="${QH}" fill="${C.bg}"/>`;
q+=txt(40,44,'Questions about intent, each with its answers drawn',{fs:26,w:600});
q+=txt(40,70,'Same figure, same scale in every cell. Letters match the questions in BODY-MAP-SPEC.md.',{fs:13.5,c:C.dim});
const cellW=330,cellH=330;
function row(y,qid,title,opts){
 let g=txt(40,y,qid+'. '+title,{fs:17,w:600});
 opts.forEach((o,i)=>{const x=40+i*(cellW+20);
  g+=`<rect x="${x}" y="${y+14}" width="${cellW}" height="${cellH}" fill="none" stroke="${C.faint}"/>`;
  g+=txt(x+14,y+38,o.t,{fs:14,w:600});
  (o.sub||'').split('|').forEach((l,k)=>{g+=txt(x+14,y+56+k*16,l,{fs:11.5,c:C.dim});});
  g+=o.draw(x,y+96);});
 return g;}
/* helpers in figure units */
const dot=(x,y,r,c,fl=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fl?c:'none'}" stroke="${c}" stroke-width="0.2"/>`;
const crop=(inner,y0,y1,half)=>(ox,oy)=>{const xw=34,avail=half?150:300;const sc=Math.min((cellH-130)/(y1-y0),avail/xw);
 const cx=ox+(half?(half<0?cellW/4+4:3*cellW/4-4):cellW/2);const id='c'+Math.round(cx)+'_'+Math.round(oy);
 return `<g transform="translate(${f(cx)},${oy}) scale(${f(sc,3)}) translate(-50,${-y0})"><clipPath id="${id}"><rect x="${50-xw/2}" y="${y0}" width="${xw}" height="${y1-y0}"/></clipPath><g clip-path="url(#${id})"><path d="${G.BODYPATH}" transform="translate(${G.PMTX},${G.PMTY}) scale(${G.PMS})" fill="#171a21" stroke="${C.line}" stroke-width="${f(1/G.PMS*0.12,3)}"/>${inner}</g></g>`;};
let Y=100;
/* A. point or region */
const hridaya=G.ANAT.find(r=>r.ids.includes(53)).f[0], nabhi=[50,43.07], basti=[50,47.7];
q+=row(Y,'A','Is an address a point, or a patch of the body with a size?',[
 {t:'A1. A point',sub:'Every address is a dot. Today.|Precise to look at, but claims a|precision nobody measured.',draw:crop(dot(hridaya[0],hridaya[1],0.5,C.meas)+dot(nabhi[0],nabhi[1],0.5,C.meas)+dot(basti[0],basti[1],0.5,C.meas),22,52)},
 {t:'A2. A sized patch',sub:'Each place drawn at its classical size:|palm size for Hridaya, Nabhi, Basti.|Sushruta sizes 29 of 107 this way.',draw:crop(dot(hridaya[0],hridaya[1],8/CM/2,C.meas,0).replace('fill="none"','fill="#9cc3b033"')+dot(nabhi[0],nabhi[1],8/CM/2,C.meas,0).replace('fill="none"','fill="#9cc3b033"')+dot(basti[0],basti[1],8/CM/2,C.meas,0).replace('fill="none"','fill="#9cc3b033"'),22,52)},
 {t:'A3. A point inside a patch',sub:'A dot for where, a faint patch for|how far it reaches. Both honest,|one more layer to draw.',draw:crop([hridaya,nabhi,basti].map(p=>dot(p[0],p[1],8/CM/2,C.meas,0).replace('fill="none"','fill="#9cc3b022"')+dot(p[0],p[1],0.5,C.meas)).join(''),22,52)}]);
Y+=cellH+60;
/* B. bilateral */
const hip=G.ANAT.find(r=>r.ids.includes(104)), kak=G.ANAT.find(r=>r.ids.includes(75)).f;
q+=row(Y,'B','A structure with a left and a right copy: one mark, or two?',[
 {t:'B1. One mark, side picked',sub:'Today. The engine hands each address|one side, chosen to spread the marks,|not for anatomy (CG Q3, still open).',draw:crop(dot(kak[0][0],kak[0][1],0.7,C.meas),14,40)},
 {t:'B2. Both sides, one address',sub:`Mirrored, as his "symmetrical on both|sides" (CS) reads. ${M.points.bilateralPlaces} places|get both dots. Tap either, same address.`,draw:crop(dot(kak[0][0],kak[0][1],0.7,C.meas)+dot(kak[1][0],kak[1][1],0.7,C.meas)+`<line x1="${kak[0][0]}" y1="${kak[0][1]}" x2="${kak[1][0]}" y2="${kak[1][1]}" stroke="${C.dim}" stroke-width="0.12" stroke-dasharray="0.5 0.5"/>`,14,40)},
 {t:'B3. Both sides, a side each',sub:'The left and right copy carry their|own charge. A real model change:|more addresses than 112.',draw:crop(dot(kak[0][0],kak[0][1],0.7,C.meas)+dot(kak[1][0],kak[1][1],0.7,C.prop),14,40)}]);
Y+=cellH+60;
/* C. deep structures */
const cel=[50,spine(19.5)];
q+=row(Y,'C','A deep structure, like the celiac plexus: which surface shows it?',[
 {t:'C1. Always the front',sub:'Today\'s convention. One figure is|enough, but the kidneys and the|sacrum read as if on the belly.',draw:(ox,oy)=>crop(dot(cel[0],cel[1],0.8,C.meas)+dot(45,42.5,0.7,C.back)+dot(55,42.5,0.7,C.back),28,56)(ox,oy)+txt(ox+cellW/2,oy+214,'front',{fs:11,c:C.dim,a:'middle'})},
 {t:'C2. The nearer surface',sub:'Kidneys, sacrum, spinal roots move|to the back view. The celiac plexus|stays front: before the aorta, mid depth.',draw:(ox,oy)=>crop(dot(cel[0],cel[1],0.8,C.meas),28,56,-1)(ox,oy)+crop(dot(45,42.5,0.7,C.back)+dot(55,42.5,0.7,C.back),28,56,1)(ox,oy)+txt(ox+cellW/4+4,oy+140,'front',{fs:11,c:C.dim,a:'middle'})+txt(ox+3*cellW/4-4,oy+140,'back',{fs:11,c:C.dim,a:'middle'})},
 {t:'C3. Both, ghosted on the far one',sub:'Every deep structure on both views,|solid on its nearer surface and faint|on the other. Most honest, busiest.',draw:(ox,oy)=>crop(dot(cel[0],cel[1],0.8,C.meas)+dot(45,42.5,0.7,C.back).replace('<circle','<circle opacity=".3"')+dot(55,42.5,0.7,C.back).replace('<circle','<circle opacity=".3"'),28,56,-1)(ox,oy)+crop(dot(cel[0],cel[1],0.8,C.meas).replace('<circle','<circle opacity=".3"')+dot(45,42.5,0.7,C.back)+dot(55,42.5,0.7,C.back),28,56,1)(ox,oy)+txt(ox+cellW/4+4,oy+140,'front',{fs:11,c:C.dim,a:'middle'})+txt(ox+3*cellW/4-4,oy+140,'back',{fs:11,c:C.dim,a:'middle'})}]);
Y+=cellH+60;
q+=txt(40,Y-10,'D, E and F are about intent, not geometry, and are asked in the document without a drawing.',{fs:13,c:C.dim});
q+='</svg>';
fs.writeFileSync(path.join(HERE,'questions.svg'),q);
if(require.main===module)console.log(JSON.stringify(M,null,1));
module.exports={G,M,places,pts,CM,byId,viewOf};
