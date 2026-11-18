/* ============================================================
   THE ANATOMY GATE. The Body page's table, held by a test.

   Until this file nothing read ANAT, BMPROP or a nerve name. A coordinate
   could move outside the body, a pair could stop mirroring, an address could
   fall out of every table, and each would have stood until somebody looked at
   the picture. And proto/anatomy-ref/measure.js, which figure.js and the
   anatomy skill both say re-derives the chart rows and "fails the build" when
   one has drifted, was run by no build, no gate and no workflow.

   Node only, no browser, a few hundred milliseconds. Run from the repo root
   after ./atuned_src/BUILD-engine.sh:   node tests/anatomy.js

   WHERE IT READS
     engine.js        the build product, as tests/engine.js reads it. ANAT,
                      ANATHEAD, ANATSPINE, BODYPATH and the outline numbers,
                      NODES, PMBANDS, and the "was" comment nodes.js leaves
                      beside each corrected name. engine.js does not export
                      ANAT, so the file is run in a vm and the names read out.
                      No change to export.js, and nothing in the product moved.
     ui/map.js        BMPROP and BMSPINE, the two tables that live with the
                      renderer. Read as source text and evaluated alone. If
                      either is renamed or moved the gate stops with a message,
                      it does not go blind.
     proto/           charts.js and match.js (the two reference charts as
                      numbers), derive.js (the geometry measure.js uses, moved
                      out of it so there is one copy), and research.js (the
                      three anatomy passes as data: NOSTRUCT, SAME, INSIDE).
   Every count it prints is read off those files on this run. None is typed.
   ENGINE and ANATOMY_MAP override the two paths, which is how the known bad
   case below is run against a damaged copy.

   WHAT IT HOLDS
     1  shape       every row has exactly one source and a sentence of its own
     2  coverage    every somatic address is placed once, by a derived
                    coordinate, by BMPROP, or explicitly filed with none
                    (108), and a filed one is an address research.js says
                    names no structure. None in no table, none in two
     3  outline     every placed point is inside the body outline the page
                    clips to (BODYPATH, the same polygon pmInBody builds)
     4  mirror      a place carrying two points mirrors across the midline.
                    A single point off the midline is one the table names as
                    one sided (the liver, the spleen, the aorta), or it fails
     5  identical   two addresses never land on one point unless the table
                    says they share a structure (one row, or research.js SAME
                    and INSIDE)
     6  names       every somatic address has a nerve name, the four anchors
                    have none, an identical name on two addresses is one
                    research.js SAME says is one structure, and the corrected
                    names are pinned so a change to one is a named diff.
                    The addresses that still name no real structure are
                    read from NOSTRUCT, less the ones nodes.js records as
                    corrected, and printed
     7  rulers      the spine ruler rises, runs through the seats, agrees
                    with research.js, no placed row asks it to extrapolate,
                    and the head ruler agrees with the research's own
     8  chart rows  every ANAT row that stands on a reference chart still
                    re-derives from it, within the drift measure.js allows

   AND ONE FINDING HELD OPEN, NAMED. The two spine rulers on the Body page,
   ANATSPINE (which places addresses) and BMSPINE (which the pain lines enter
   the spine by), give different heights for the same vertebra. It is not a
   mis-typed number, it is two rulers built two ways, and which one is right
   is not this file's call. It is listed as an expected red below, the way
   tests/engine.js lists its own, so the gate is green and honest and the day
   the two agree it says so and the item comes off. The ceiling is in
   tests/floors.json (expected_red_max).

   EVERY CHECK IS HELD AGAINST A KNOWN BAD CASE, on every run. The last group
   below damages a copy of the real tables one way at a time (an address moved
   out of the body, a mirror deleted, an address dropped from every table, a
   name nulled, a chart row moved half a unit, and so on) and asserts that the
   audit names the address it damaged. A check that cannot fail is not a check.
   ============================================================ */
'use strict';
const fs=require('fs'), path=require('path'), vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const ENGINE=path.resolve(process.env.ENGINE||path.join(ROOT,'engine.js'));
const MAPJS=path.resolve(process.env.ANATOMY_MAP||path.join(ROOT,'atuned_src','ui','map.js'));
const DER=require(path.join(ROOT,'proto','anatomy-ref','derive.js'));
const CH=require(path.join(ROOT,'proto','anatomy-ref','charts.js'));
const MA=require(path.join(ROOT,'proto','anatomy-ref','match.js'));
const RS=require(path.join(ROOT,'proto','anatomy-check','research.js'));

let P=0,F=0,XF=0,GRP='';
const g=n=>{GRP=n;console.log('\n'+n);};
const ok=(c,m)=>{if(c){P++}else{F++;console.log('  FAIL  '+m)}};
/* expected red: true is a FAIL, so a fix that lands cannot go unnoticed */
const xf=(c,m)=>{if(c){F++;console.log('  FAIL  expected red went green, remove the xf: '+m)}else{P++;XF++}};
const say=m=>console.log('  '+m);

/* ---------- tolerances, each with its reason ---------- */
/* a figure unit in centimetres is read off map.js's own BMCM on every run (D.CMUNIT) */
const MID=0.5;                 /* on the midline: derive.js's own rule for one mark or two */
const MIRROR_TOL=DER.DRIFT_MAX;/* places are stored to two decimals, so two halves differ by a rounding step */
const IDENT=0.001;             /* one point, to a thousandth of a unit */
const HALF=1;                  /* two atlas halves differ by a few millimetres, and a unit is under two centimetres */
const RULER_GAP=1;             /* two rulers for one vertebra agree within 1 unit, under two centimetres */
const ROUND_TRIP=1e-9;         /* measure.js's own bound for its landmark round trip */
/* The one sided structures the table places off the midline on purpose. A
   place of two points mirrors; a single point off the midline must be on this
   list, with the side the person has it on (their left is the viewer's right).
   Each is a fact of anatomy, and each row's own sentence says so or names the
   organ: the aorta and the splenic artery run left of centre, the pancreatic
   body lies left of centre, the liver is on the right. */
const ONESIDE={35:'left', 41:'left', 42:'left', 47:'right', 48:'right', 52:'left'};
/* The names corrected on 12 and 13 November, each from a page of the atlas the
   owner sent (nodes.js says which). Pinned so a change to one is a named diff
   in this file and not a silent edit to a data table. */
const PINNED={16:'Conus Medullaris', 28:'Lumbosacral Trunk',
 46:'Anterior Cutaneous Branches of Thoraco-abdominal Nerves',
 56:'Lateral Cutaneous Branches of Intercostal Nerves', 85:'Optic Radiation'};
/* vertebrae counted C1 as 1 through the tailbone as 30, which is how figure.js
   counts them and how map.js bmLvY reads a level name */
function lvIndex(lv){const k=lv.charAt(0), n=parseInt(lv.slice(1),10);
 return k==='C'&&lv!=='Co'?n:k==='T'?7+n:k==='L'?19+n:k==='S'?24+n:30;}

/* ---------- reading the two tables out of map.js ---------- */
function scanLiteral(text,name,from){
 const m=new RegExp('^var\\s+'+name+'\\s*=\\s*\\[','m').exec(text);
 if(!m)throw new Error('tests/anatomy.js cannot find "var '+name+'=[" in '+from+'. If the table moved, point the gate at it. It must not go blind.');
 const start=m.index+m[0].length-1; let depth=0;
 for(let i=start;i<text.length;i++){
  const c=text[i];
  if(c==='"'||c==="'"){for(i++;i<text.length&&text[i]!==c;i++)if(text[i]==='\\')i++;continue;}
  if(c==='/'&&text[i+1]==='*'){i=text.indexOf('*/',i+2)+1;continue;}
  if(c==='/'&&text[i+1]==='/'){i=text.indexOf('\n',i);continue;}
  if(c==='[')depth++;
  else if(c===']'&&--depth===0)return vm.runInNewContext('('+text.slice(start,i+1)+')');}
 throw new Error('tests/anatomy.js: "'+name+'" in '+from+' never closes.');}

/* ---------- reading the engine ---------- */
function load(){
 const text=fs.readFileSync(ENGINE,'utf8');
 const ctx={module:{exports:{}}}; vm.createContext(ctx);
 const raw=vm.runInContext(text+'\n;({ANAT:ANAT,ANATHEAD:ANATHEAD,ANATSPINE:ANATSPINE,BODYPATH:BODYPATH,'
  +'PMS:PMS,PMTX:PMTX,PMTY:PMTY,NODES:NODES,PMBANDS:PMBANDS})',ctx,{filename:path.basename(ENGINE)});
 /* a plain copy, so the audit can clone it and a vm prototype cannot leak in */
 const D=JSON.parse(JSON.stringify(raw));
 /* nodes.js leaves a comment that opens with the word was and the old name in
    quotes, straight after the row it corrected */
 D.fixed=[]; const rx=/\{"i":(\d+),[^{}]*\}\s*\/\*\s*was\s+"([^"]*)"/g; let m;
 while((m=rx.exec(text)))D.fixed.push({i:+m[1],was:m[2]});
 const map=fs.readFileSync(MAPJS,'utf8'), from=path.relative(ROOT,MAPJS);
 D.BMPROP=JSON.parse(JSON.stringify(scanLiteral(map,'BMPROP',from)));
 D.BMSPINE=JSON.parse(JSON.stringify(scanLiteral(map,'BMSPINE',from)));
 /* BMCM is "stature in centimetres over the figure's height in units", so a
    unit is a number of centimetres. Read, not typed, and the gate stops if it moved. */
 const mc=/^var\s+BMCM\s*=\s*([\d.]+)\s*\/\s*([\d.]+)/m.exec(map);
 if(!mc)throw new Error('tests/anatomy.js cannot find "var BMCM=stature/height" in '+from+'. If it moved, point the gate at it. It must not go blind.');
 D.STATURE=+mc[1]; D.CMUNIT=+mc[1]/+mc[2];
 D.R=JSON.parse(JSON.stringify({NOSTRUCT:RS.NOSTRUCT,SAME:RS.SAME,INSIDE:RS.INSIDE,HEADMAP:RS.HEADMAP,RULER:RS.RULER}));
 D.CH=JSON.parse(JSON.stringify({FIGS:CH.FIGS,PTS:CH.PTS,MATCH:MA.MATCH}));
 return D;}

/* ---------- the places, in figure units, the way map.js derives them ---------- */
/* pmAnat and bmPlaces (map.js) are the product's own derivation. This is the
   same arithmetic: a head point in millimetres through the head ruler, a
   vertebral level through the spine ruler, a chart place as it stands. It was
   checked against the product's bmPlaces on the build it was written against:
   the same points for the same addresses in the same order, the worst
   difference 0. */
function spineY(R,lv){let i=0;while(i<R.length-2&&lv>R[i+1][0])i++;
 const a=R[i],b=R[i+1];return a[1]+(lv-a[0])*(b[1]-a[1])/(b[0]-a[0]);}
const isPair=p=>Array.isArray(p)&&p.length===2&&typeof p[0]==='number'&&typeof p[1]==='number'&&isFinite(p[0])&&isFinite(p[1]);
function places(D){
 const H=D.ANATHEAD, mm=(H.topZ-H.earZ)/(H.year-H.ytop), seat={};
 D.PMBANDS.forEach(b=>{seat[b.k]=b.yp;});
 const pts=[], filed=[], shape=[];
 const rowIds=(r,label)=>{
  if(!Array.isArray(r.ids)||!r.ids.length||!r.ids.every(Number.isInteger)){shape.push(label+' has no list of whole number ids');return false;}
  if(typeof r.s!=='string'||!r.s.trim()){shape.push(label+' (ids '+r.ids.join(',')+') has no sentence saying what it stands on');}
  return true;};
 D.ANAT.forEach((r,ri)=>{
  const label='ANAT row '+ri;
  if(!rowIds(r,label))return;
  const kinds=['h','v','f','at'].filter(k=>r[k]!==undefined);
  if(kinds.length!==1){shape.push(label+' (ids '+r.ids.join(',')+') carries '+(kinds.length?kinds.join(' and '):'no source')+', and must carry exactly one of h, v, f or at');return;}
  const k=kinds[0], row='A'+ri;
  if(k==='at'){
   if(typeof r.at!=='string'||seat[r.at]===undefined)shape.push(label+' (ids '+r.ids.join(',')+') is filed at "'+r.at+'", which is no seat in PMBANDS');
   filed.push({row,ids:r.ids,s:r.s,at:r.at});return;}
  if(!Array.isArray(r[k])||!r[k].length||!r[k].every(isPair)){shape.push(label+' (ids '+r.ids.join(',')+') has a '+k+' that is not a list of [number, number]');return;}
  if(k==='f'&&!(Array.isArray(r.c)&&r.c.length))shape.push(label+' (ids '+r.ids.join(',')+') is a chart place with no c naming the chart points it stands on');
  if(k!=='f'&&r.c!==undefined)shape.push(label+' (ids '+r.ids.join(',')+') names chart points in c but has no f');
  r[k].forEach(p=>{
   const q=k==='h'?{x:50-p[0]/mm,y:H.ytop+(H.topZ-p[1])/mm}
    :k==='v'?{x:50+p[1],y:spineY(D.ANATSPINE,p[0])}:{x:p[0],y:p[1]};
   pts.push({row,table:'ANAT',kind:k,ids:r.ids,x:q.x,y:q.y,lv:k==='v'?p[0]:null});});});
 D.BMPROP.forEach((r,ri)=>{
  const label='BMPROP row '+ri;
  if(!rowIds(r,label))return;
  if(!Array.isArray(r.pts)||!r.pts.length||!r.pts.every(isPair)){shape.push(label+' (ids '+r.ids.join(',')+') has pts that are not a list of [x, y]');return;}
  r.pts.forEach(p=>pts.push({row:'B'+ri,table:'BMPROP',kind:'b',ids:r.ids,x:p[0],y:p[1],lv:null}));});
 return {pts,filed,shape};}

/* the body outline, and a point's distance from it, for the tightest margin */
function outlineOf(D){
 const us=DER.ourFigure({BODYPATH:D.BODYPATH,PMS:D.PMS,PMTX:D.PMTX,PMTY:D.PMTY,V:D.ANATHEAD.ytop,E:D.ANATHEAD.year});
 const inBody=DER.inBodyOf(us), P=us.poly;
 const margin=(x,y)=>{let m=1e9;
  for(let a=0,b=P.length-1;a<P.length;b=a++){
   const dx=P[a][0]-P[b][0], dy=P[a][1]-P[b][1], t=Math.max(0,Math.min(1,((x-P[b][0])*dx+(y-P[b][1])*dy)/(dx*dx+dy*dy||1)));
   m=Math.min(m,Math.hypot(x-(P[b][0]+t*dx),y-(P[b][1]+t*dy)));}
  return m;};
 return {us,inBody,margin};}

/* the pairs research.js says share a structure, or one lies inside the other */
function related(D){
 const set=new Set(), add=(a,b)=>{set.add(a+'|'+b);set.add(b+'|'+a);};
 D.R.SAME.forEach(s=>s.ids.forEach(a=>s.ids.forEach(b=>add(a,b))));
 D.R.INSIDE.forEach(g=>g.rows.forEach(r=>add(r[0],r[2])));
 return (a,b)=>a===b||set.has(a+'|'+b);}

/* ============================================================
   THE AUDIT. One function over one plain data object, so the real tables and
   a damaged copy go through exactly the same checks.
   ============================================================ */
function audit(D){
 const out={shape:[],coverage:[],outside:[],mirror:[],identical:[],names:[],ruler:[],chart:[],rulerGap:[]};
 const info={};
 const pl=places(D); out.shape.push(...pl.shape);
 const seats=new Set(D.PMBANDS.map(b=>b.b));
 const somatic=D.NODES.filter(n=>seats.has(n.b)), anchors=D.NODES.filter(n=>!seats.has(n.b));
 info.somatic=somatic.length; info.anchors=anchors.length;
 const rel=related(D);
 const nostruct=new Map(D.R.NOSTRUCT.map(r=>[r.i,r]));

 /* 2 coverage */
 const ids=somatic.map(n=>n.i).sort((a,b)=>a-b);
 /* an id that appears twice in NODES is named by its number, and so is one that is missing */
 const seen={}; ids.forEach(id=>{seen[id]=(seen[id]||0)+1;});
 Object.keys(seen).map(Number).filter(id=>seen[id]>1).forEach(id=>out.coverage.push('address '+id+' appears '+seen[id]+' times in NODES, and an address is one row'));
 const uniq=Object.keys(seen).map(Number).sort((a,b)=>a-b);
 for(let n=1;n<=uniq[uniq.length-1];n++)if(!seen[n])out.coverage.push('address '+n+' is missing from NODES, which must number the somatic addresses 1 to '+uniq[uniq.length-1]+' without a gap');
 const placed={}, note=(id,w)=>{(placed[id]=placed[id]||[]).push(w);};
 D.ANAT.forEach((r,ri)=>(Array.isArray(r.ids)?r.ids:[]).forEach(id=>note(id,r.at!==undefined?'filed with none (ANAT row '+ri+')':'ANAT row '+ri)));
 D.BMPROP.forEach((r,ri)=>(Array.isArray(r.ids)?r.ids:[]).forEach(id=>note(id,'BMPROP row '+ri)));
 const have=new Set(ids);
 ids.forEach(id=>{
  if(!placed[id])out.coverage.push('address '+id+' is in no table: not ANAT, not BMPROP, not filed with none');
  else if(placed[id].length>1)out.coverage.push('address '+id+' is placed '+placed[id].length+' times: '+placed[id].join(', '));});
 Object.keys(placed).map(Number).filter(id=>!have.has(id)).forEach(id=>out.coverage.push('a table places address '+id+', which is no somatic address ('+placed[id].join(', ')+')'));
 pl.filed.forEach(f=>{
  if(!/^No structure/.test(f.s||''))out.coverage.push('filed with none but not said so: address '+f.ids.join(',')+' (its sentence must begin "No structure")');
  f.ids.forEach(id=>{if(!nostruct.has(id))out.coverage.push('address '+id+' is filed with no anatomy, but research.js NOSTRUCT does not say it names no structure');});});
 const addrBy={h:new Set(),v:new Set(),f:new Set(),b:new Set()};
 pl.pts.forEach(p=>p.ids.forEach(id=>addrBy[p.kind].add(id)));
 info.byKind={atlas:addrBy.h.size, spine:addrBy.v.size, chart:addrBy.f.size, proposed:addrBy.b.size,
  filed:pl.filed.reduce((a,f)=>a+f.ids.length,0)};
 info.points=pl.pts.length;

 /* 3 outline */
 const ol=outlineOf(D); let tight=null;
 pl.pts.forEach(p=>{
  if(!ol.inBody(p.x,p.y))out.outside.push('address '+p.ids.join(',')+' at ('+p.x.toFixed(2)+', '+p.y.toFixed(2)+') in '+p.table+' '+p.row+' is outside the body outline');
  else{const m=ol.margin(p.x,p.y);if(!tight||m<tight.m)tight={m,ids:p.ids,row:p.row};}});
 info.tight=tight;

 /* 4 mirror */
 const rows={}; pl.pts.forEach(p=>{(rows[p.row]=rows[p.row]||[]).push(p);});
 const oneSided=new Set(); info.pairedPlaces=0; info.pairedAddresses=0; info.midlineAddresses=0; info.oneSidedAddresses=0;
 let worstX=0,worstY=0;
 Object.keys(rows).forEach(row=>{
  const ps=rows[row], who='address '+ps[0].ids.join(',')+' ('+ps[0].table+' '+row+')', k=ps[0].kind;
  if(ps.length>2){out.mirror.push(who+' has '+ps.length+' points, and a place is one or two');return;}
  if(ps.length===2){
   const a=ps[0], b=ps[1], dx=Math.abs(a.x+b.x-100), dy=Math.abs(a.y-b.y);
   info.pairedPlaces++; info.pairedAddresses+=a.ids.length;
   if(k==='h'){
    /* an atlas centroid per half: the halves are measured, so not equal, but they sit either side */
    if(!((a.x-50)*(b.x-50)<0))out.mirror.push(who+' has both halves on the same side of the midline');
    if(dx>HALF||dy>HALF)out.mirror.push(who+' halves differ by '+dx.toFixed(2)+' across and '+dy.toFixed(2)+' down, more than the '+HALF+' unit two atlas halves may');
    worstX=Math.max(worstX,dx);worstY=Math.max(worstY,dy);}
   else{
    if(dx>MIRROR_TOL||dy>MIRROR_TOL)out.mirror.push(who+' does not mirror: its halves are '+dx.toFixed(3)+' off across and '+dy.toFixed(3)+' off down');
    if(k==='f'&&!(a.x<b.x))out.mirror.push(who+' lists the viewer\'s right side first, and a chart place lists the person\'s right first');}}
  else{
   const p=ps[0];
   if(Math.abs(p.x-50)<=MID){info.midlineAddresses+=p.ids.length;return;}
   if(k==='h'){info.midlineAddresses+=p.ids.length;return;}   /* an atlas centroid is measured, where it falls */
   const side=p.x>50?'left':'right';
   p.ids.forEach(id=>{
    oneSided.add(id); info.oneSidedAddresses++;
    if(!ONESIDE[id])out.mirror.push('address '+id+' ('+p.table+' '+row+') stands alone '+Math.abs(p.x-50).toFixed(2)+' off the midline and the table does not say it is one sided. A pair that lost a half looks like this');
    else if(ONESIDE[id]!==side)out.mirror.push('address '+id+' is one sided on the person\'s '+ONESIDE[id]+' and is placed on their '+side);});}});
 Object.keys(ONESIDE).map(Number).forEach(id=>{
  if(!oneSided.has(id))out.mirror.push('address '+id+' is listed one sided in this gate and is not placed as a single point off the midline');});
 info.worstHalf=[worstX,worstY];

 /* 5 identical */
 const dup=[];
 for(let a=0;a<pl.pts.length;a++)for(let b=a+1;b<pl.pts.length;b++){
  const A=pl.pts[a],B=pl.pts[b];
  if(A.row===B.row||Math.hypot(A.x-B.x,A.y-B.y)>=IDENT)continue;
  const ok2=A.ids.every(x=>B.ids.some(y=>rel(x,y)));
  if(!ok2)dup.push('address '+A.ids.join(',')+' ('+A.table+' '+A.row+') and address '+B.ids.join(',')+' ('+B.table+' '+B.row+') land on one point and research.js does not say they share a structure');}
 out.identical.push(...dup);
 let near=null;
 for(let a=0;a<pl.pts.length;a++)for(let b=a+1;b<pl.pts.length;b++){
  const A=pl.pts[a],B=pl.pts[b]; if(A.row===B.row)continue;
  const d=Math.hypot(A.x-B.x,A.y-B.y); if(!near||d<near.d)near={d,a:A.ids,b:B.ids};}
 info.nearest=near;

 /* 6 names */
 somatic.forEach(n=>{
  if(typeof n.n!=='string'||!n.n.trim())out.names.push('address '+n.i+' has no nerve name (n is '+JSON.stringify(n.n)+')');
  else if(n.n!==n.n.trim()||/\s{2,}/.test(n.n))out.names.push('address '+n.i+' has stray spaces in its name: '+JSON.stringify(n.n));});
 anchors.forEach(n=>{if(n.n!==null)out.names.push('field anchor '+n.i+' is outside the body and carries no nerve, and its n is '+JSON.stringify(n.n));});
 const byName={}; somatic.forEach(n=>{if(typeof n.n==='string')(byName[n.n]=byName[n.n]||[]).push(n.i);});
 Object.keys(byName).forEach(nm=>{const l=byName[nm];
  for(let a=0;a<l.length;a++)for(let b=a+1;b<l.length;b++)
   if(!rel(l[a],l[b]))out.names.push('addresses '+l[a]+' and '+l[b]+' are both named "'+nm+'" and research.js does not say they are one structure');});
 const fixed=D.fixed.map(f=>f.i).sort((a,b)=>a-b), pinned=Object.keys(PINNED).map(Number).sort((a,b)=>a-b);
 fixed.filter(i=>pinned.indexOf(i)<0).forEach(i=>out.names.push('nodes.js records a correction beside address '+i+' and this gate pins no name for it. Add it to PINNED'));
 pinned.filter(i=>fixed.indexOf(i)<0).forEach(i=>out.names.push('this gate pins a corrected name for address '+i+' and nodes.js records no correction beside it'));
 pinned.forEach(i=>{const n=D.NODES.find(t=>t.i===i);
  if(n&&n.n!==PINNED[i])out.names.push('address '+i+' reads "'+n.n+'" and the corrected name pinned here is "'+PINNED[i]+'"');});
 fixed.filter(i=>!nostruct.has(i)).forEach(i=>out.names.push('nodes.js records a correction beside address '+i+', which research.js NOSTRUCT never listed as naming no structure'));
 D.R.NOSTRUCT.filter(r=>!have.has(r.i)).forEach(r=>out.names.push('NOSTRUCT lists address '+r.i+', which is no somatic address'));
 info.nostruct=D.R.NOSTRUCT.map(r=>r.i); info.corrected=fixed;
 info.open=info.nostruct.filter(i=>fixed.indexOf(i)<0);

 /* 7 rulers */
 const R=D.ANATSPINE, Hd=D.ANATHEAD;
 for(let i=1;i<R.length;i++)if(!(R[i][0]>R[i-1][0]&&R[i][1]>R[i-1][1]))out.ruler.push('the spine ruler does not rise strictly at knot '+i+' ('+JSON.stringify(R[i-1])+' then '+JSON.stringify(R[i])+')');
 R.forEach(k=>{if(!D.PMBANDS.some(b=>Math.abs(b.yp-k[1])<0.005))out.ruler.push('the spine ruler knot at level '+k[0]+' stands at '+k[1]+', which is no seat\'s height in PMBANDS, and the ruler is the one through the seats');});
 if(JSON.stringify(R)!==JSON.stringify(D.R.RULER.map(r=>[r[0],r[1]])))out.ruler.push('ANATSPINE and research.js RULER disagree: '+JSON.stringify(R)+' against '+JSON.stringify(D.R.RULER.map(r=>[r[0],r[1]])));
 const HM=D.R.HEADMAP;
 [['ytop',Hd.ytop,HM.ytop],['year',Hd.year,HM.year],['topZ',Hd.topZ,HM.vertexZ],['earZ',Hd.earZ,HM.earZ]].forEach(t=>{
  if(t[1]!==t[2])out.ruler.push('ANATHEAD '+t[0]+' is '+t[1]+' and research.js HEADMAP says '+t[2]);});
 const mm=(Hd.topZ-Hd.earZ)/(Hd.year-Hd.ytop), brow=Hd.ytop+(Hd.topZ-HM.browZ)/mm, eye=D.PMBANDS.find(b=>b.k==='eye');
 if(!eye||Math.abs(brow-eye.yp)>0.01)out.ruler.push('the head ruler puts the brow at '+brow.toFixed(3)+' and the Third Eye seat sits at '+(eye&&eye.yp));
 const lv=[]; pl.pts.forEach(p=>{if(p.lv!==null)lv.push(p.lv);});
 info.levels=lv.length?[Math.min(...lv),Math.max(...lv)]:null;
 pl.pts.filter(p=>p.lv!==null&&(p.lv<R[0][0]||p.lv>R[R.length-1][0])).forEach(p=>out.ruler.push('address '+p.ids.join(',')+' sits at spine level '+p.lv+', outside the ruler\'s '+R[0][0]+' to '+R[R.length-1][0]+', so its height is extrapolated and not measured'));
 /* the held finding: the other ruler, level by level */
 info.rulerGaps=[];
 D.BMSPINE.forEach(s=>{const lvl=lvIndex(s.lv), mine=spineY(R,lvl);
  info.rulerGaps.push({lv:s.lv,bm:s.y,anat:+mine.toFixed(2),gap:+Math.abs(mine-s.y).toFixed(2)});
  if(Math.abs(mine-s.y)>RULER_GAP)out.rulerGap.push(s.lv+': BMSPINE '+s.y+', ANATSPINE '+mine.toFixed(2));});

 /* 8 chart rows, re-derived from the charts */
 const us=ol.us, CHD=D.CH;
 const {W,onUs}=DER.chartOnUs(us,CHD.FIGS,CHD.PTS);
 const rt=Math.max(...DER.landmarkRoundTrip(us,CHD.FIGS,W));
 if(!(rt<=ROUND_TRIP))out.chart.push('the landmark round trip is off by '+rt+' units, so the re-derivation below cannot be trusted');
 const targets=DER.chartTargets(us,onUs,CHD.PTS,CHD.MATCH,()=>[]);
 const chartRows=D.ANAT.filter(r=>r.c).map(r=>({ids:r.ids,c:r.c,f:r.f}));
 DER.chartDrift(chartRows,targets).forEach(d=>out.chart.push('chart row for address '+d.ids.join(',')+' ('+d.c.join(' + ')+'): '+d.problem));
 info.chartRows=chartRows.length; info.chartAddresses=chartRows.reduce((a,r)=>a+r.ids.length,0); info.roundTrip=rt;
 return {out,info};}

/* ============================================================ */
let D;
try{D=load();}catch(e){console.log('FAIL  '+e.message);console.log('\n===== 0 passed, 1 failed, 0 expected red =====');process.exit(1);}
const REAL=audit(D);
const O=REAL.out, I=REAL.info;

g('1 · shape: every row has one source and a sentence of its own');
say(D.ANAT.length+' ANAT rows (engine.js), '+D.BMPROP.length+' BMPROP rows ('+path.relative(ROOT,MAPJS)+'), '+I.points+' placed points');
ok(O.shape.length===0,'table shape: '+O.shape.join('; '));

g('2 · coverage: every somatic address is placed once');
say(I.somatic+' somatic addresses and '+I.anchors+' field anchors, read from NODES');
say('placed by an atlas centroid '+I.byKind.atlas+', by a vertebral level '+I.byKind.spine+', from a reference chart '+I.byKind.chart
 +', by BMPROP '+I.byKind.proposed+', filed with no anatomy '+I.byKind.filed);
say((I.byKind.proposed+I.byKind.filed)+' addresses have no derived coordinate. '+I.byKind.proposed+' are placed by hand in BMPROP, ESTIMATED from standard anatomy (map.js calls them "the addresses nobody has measured") and not measured from an atlas or a chart, and '+I.byKind.filed+' is filed with no anatomy at all.');
say('so the '+I.byKind.proposed+' are held below to the outline, the mirror and to being placed once, and never to a measurement, because there is none. The filed one is held to research.js saying it names no structure.');
ok(O.coverage.length===0,'coverage: '+O.coverage.join('; '));
ok(I.byKind.atlas+I.byKind.spine+I.byKind.chart+I.byKind.proposed+I.byKind.filed===I.somatic,
 'the five ways of being placed add up to '+(I.byKind.atlas+I.byKind.spine+I.byKind.chart+I.byKind.proposed+I.byKind.filed)+', and there are '+I.somatic+' somatic addresses');

g('3 · outline: every placed point is inside the body');
if(I.tight)say('tightest margin '+I.tight.m.toFixed(2)+' units from the edge, address '+I.tight.ids.join(',')+' ('+I.tight.row+'). A unit is '+D.CMUNIT.toFixed(2)+' cm on a '+D.STATURE+' cm person');
ok(O.outside.length===0,'outline: '+O.outside.join('; '));

g('4 · mirror: two points mirror, one point is named one sided');
say(I.pairedPlaces+' places carry two points ('+I.pairedAddresses+' addresses standing on a pair), '+I.midlineAddresses+' addresses on the midline, '
 +I.oneSidedAddresses+' on one side by anatomy: '+Object.keys(ONESIDE).map(k=>k+' '+ONESIDE[k]).join(', '));
say('widest atlas half difference: '+I.worstHalf[0].toFixed(2)+' across, '+I.worstHalf[1].toFixed(2)+' down, against the '+HALF+' unit this gate allows');
say('the table does not give an address a side, so "54 on each side" is a statement about the book and not something this table can be held to');
ok(O.mirror.length===0,'mirror: '+O.mirror.join('; '));

g('5 · identical: no two addresses on one point unless the table says they share');
if(I.nearest)say('closest two places in different rows: addresses '+I.nearest.a.join(',')+' and '+I.nearest.b.join(',')+', '+I.nearest.d.toFixed(2)+' units apart');
ok(O.identical.length===0,'identical points: '+O.identical.join('; '));

g('6 · names: a nerve name on every somatic address, and the open ones counted');
say('research.js NOSTRUCT lists '+I.nostruct.length+' addresses that name no real structure: '+I.nostruct.join(', '));
say('nodes.js records a correction beside '+I.corrected.length+' of them: '+I.corrected.join(', '));
say(I.open.length+' still name no real structure, read as the first list less the second: '+I.open.join(', '));
ok(O.names.length===0,'names: '+O.names.join('; '));

g('7 · rulers: the spine and the head');
say('spine knots '+JSON.stringify(D.ANATSPINE)+', levels asked for '+(I.levels?I.levels[0]+' to '+I.levels[1]:'none'));
ok(O.ruler.length===0,'rulers: '+O.ruler.join('; '));

g('8 · chart rows: re-derived from the two reference charts');
say(I.chartRows+' ANAT rows stand on a chart, carrying '+I.chartAddresses+' addresses. Landmark round trip worst '+I.roundTrip+' units (measure.js\'s bound is '+ROUND_TRIP+')');
ok(O.chart.length===0,'chart rows: '+O.chart.join('; '));

g('9 · held open, named: the two spine rulers disagree');
say('same vertebra, two heights, figure units (a unit is '+D.CMUNIT.toFixed(2)+' cm). BMSPINE is what the pain lines enter the spine by, ANATSPINE what places addresses:');
I.rulerGaps.forEach(r=>say('  '+r.lv.padEnd(3)+' BMSPINE '+String(r.bm).padStart(5)+'   ANATSPINE '+String(r.anat).padStart(6)+'   apart '+r.gap));
/* EXPECTED RED, counted. Not a mis-typed number: ANATSPINE is built through the
   four seats whose own text names a level, BMSPINE through the labels on the
   back figure, and they place T4 at 29.9 and at 24.2. Which is right is the
   owner's and the anatomy's to say, and moving either moves the cardiac,
   celiac, lumbar and coccygeal rows on screen. The gate holds the gap open and
   turns green-to-red the day the two agree, so the item comes off by hand. */
xf(O.rulerGap.length===0,'ANATSPINE and BMSPINE give a different height for the same vertebra at '+O.rulerGap.length+' of '+D.BMSPINE.length+' levels: '+O.rulerGap.join('; '));

/* ============================================================
   10 · EVERY CHECK, HELD AGAINST A KNOWN BAD CASE.
   Each case damages a copy of the real tables one way, and the audit must name
   the address it damaged in the group that owns that check. A case is built
   from the real data, so it always has something to damage.
   ============================================================ */
g('10 · the known bad cases: each check must fail on a damaged copy and name the address');
const clone=()=>JSON.parse(JSON.stringify(D));
const firstOf=(arr,f)=>arr.findIndex(f);
const bmPair=firstOf(D.BMPROP,r=>r.pts.length===2), bmPair2=D.BMPROP.findIndex((r,i)=>i>bmPair&&r.pts.length===2);
const bmSingle=firstOf(D.BMPROP,r=>r.pts.length===1&&Math.abs(r.pts[0][0]-50)<=MID);
const anPairF=firstOf(D.ANAT,r=>r.f&&r.f.length===2), anPairH=firstOf(D.ANAT,r=>r.h&&r.h.length===2);
const anF1=firstOf(D.ANAT,r=>r.f&&r.f.length===1&&r.c);
const anRowF=firstOf(D.ANAT,r=>r.f&&r.c);
/* two addresses the research does not relate, one in BMPROP row 0 and one in ANAT row 0 */
const relD=related(D); let unrelated=null;
D.BMPROP.forEach((br,bi)=>D.ANAT.forEach((ar,ai)=>{
 if(unrelated||ar.at!==undefined||!ar.ids.length)return;
 if(br.ids.every(x=>ar.ids.every(y=>!relD(x,y))))unrelated={bi,ai};}));
const BAD=[
 ['an address moved outside the body','outside',d=>{d.BMPROP[0].pts[0]=[5,5];},D.BMPROP[0].ids],
 ['a mirror deleted (one half of a pair gone)','mirror',d=>{d.BMPROP[bmPair].pts.splice(1,1);},D.BMPROP[bmPair].ids],
 ['a mirror that does not mirror (one half nudged)','mirror',d=>{d.BMPROP[bmPair2].pts[1][0]+=0.7;},D.BMPROP[bmPair2].ids],
 ['a chart pair listed the wrong way round','mirror',d=>{d.ANAT[anPairF].f.reverse();},D.ANAT[anPairF].ids],
 ['both atlas halves on one side of the midline','mirror',d=>{d.ANAT[anPairH].h[1][0]=d.ANAT[anPairH].h[0][0];},D.ANAT[anPairH].ids],
 ['a one sided organ moved to the other side','mirror',d=>{const r=d.BMPROP.find(t=>t.ids.indexOf(47)>=0);r.pts[0][0]=100-r.pts[0][0];},[47]],
 ['an atlas address moved outside the body','outside',d=>{d.ANAT[anPairH].h[0]=[-4000,0];},D.ANAT[anPairH].ids],
 ['a chart address moved outside the body','outside',d=>{d.ANAT[anF1].f[0]=[5,5];},D.ANAT[anF1].ids],
 ['an address in no table','coverage',d=>{d.BMPROP.splice(bmSingle,1);},D.BMPROP[bmSingle].ids],
 ['a chart address dropped from ANAT, so in no table','coverage',d=>{d.ANAT.splice(anF1,1);},D.ANAT[anF1].ids],
 ['an address id duplicated in the node list','coverage',d=>{d.NODES.push(Object.assign({},d.NODES.find(t=>t.i===40)));},[40]],
 ['an address listed twice in one table','coverage',d=>{d.BMPROP[1].ids.push(D.BMPROP[0].ids[0]);},[D.BMPROP[0].ids[0]]],
 ['an address in two tables','coverage',d=>{d.BMPROP[0].ids.push(D.ANAT[anF1].ids[0]);},[D.ANAT[anF1].ids[0]]],
 ['a table placing an address that does not exist','coverage',d=>{d.ANAT[0].ids.push(999);},[999]],
 ['a row with two sources','shape',d=>{d.ANAT[anF1].h=[[0,0]];},D.ANAT[anF1].ids],
 ['two unrelated addresses on one point','identical',d=>{const p=places(d).pts.find(t=>t.row==='A'+unrelated.ai);d.BMPROP[unrelated.bi].pts[0]=[p.x,p.y];},D.BMPROP[unrelated.bi].ids],
 ['a nerve name nulled','names',d=>{d.NODES[4].n=null;},[D.NODES[4].i]],
 ['one name on two addresses research does not relate','names',d=>{d.NODES[0].n=d.NODES[1].n;},[D.NODES[0].i,D.NODES[1].i]],
 ['a corrected name changed','names',d=>{d.NODES.find(t=>t.i===16).n='Spinal Cord Base';},[16]],
 ['a correction with no record of it','names',d=>{d.fixed=d.fixed.filter(f=>f.i!==56);},[56]],
 ['the filed with none address no longer called a non structure','coverage',d=>{d.R.NOSTRUCT=d.R.NOSTRUCT.filter(r=>r.i!==D.ANAT.find(t=>t.at!==undefined).ids[0]);},D.ANAT.find(t=>t.at!==undefined).ids],
 ['a spine ruler that does not rise','ruler',d=>{d.ANATSPINE[1][1]=d.ANATSPINE[0][1];},[]],
 ['a neck address asking the ruler to extrapolate','ruler',d=>{d.ANAT.push({s:'a neck row',ids:[D.NODES[0].i],v:[[3,0]]});},[D.NODES[0].i]],
 ['a head ruler that left the research','ruler',d=>{d.ANATHEAD.topZ+=1;},[]],
 ['a chart row moved half a unit','chart',d=>{d.ANAT[anRowF].f[0][0]+=0.5;},D.ANAT[anRowF].ids]];
/* The addresses a finding names are the numbers that follow the word address,
   addresses or ids, so a coordinate such as 7.80 in a message can never stand
   in for address 7 or 8. */
function namedIds(m){const set=new Set(), rx=/(?:address(?:es)?|ids)\s+(\d+(?:(?:,|\s+and\s+)\d+)*)/g; let x;
 while((x=rx.exec(m)))x[1].match(/\d+/g).forEach(v=>set.add(+v));
 return set;}
let caseN=0;
BAD.forEach(([name,group,mut,ids])=>{
 const d=clone(); let res;
 try{mut(d);res=audit(d).out[group];}catch(e){res=null;console.log('  FAIL  the known bad case "'+name+'" threw: '+e.message);}
 const named=res&&res.length>0&&ids.every(id=>res.some(m=>namedIds(m).has(id)));
 ok(named,'the known bad case "'+name+'" was not named in '+group+'. Found: '+JSON.stringify(res)+' wanted ids '+JSON.stringify(ids));
 if(process.env.ANATOMY_VERBOSE)say('  '+(named?'named':'MISSED')+'  '+name+'  ->  '+group+': '+(res&&res[0]));
 caseN++;});
ok(BAD.length>=1&&caseN===BAD.length,'every known bad case ran');
/* and the cases above are built on a copy, so the copy must give the very
   findings the real tables give, or a case proves nothing about them. The
   known good case, a gate that fails on everything is not one that works, is
   groups 1 to 8 above: on the real tree every one of them is clean. */
ok(JSON.stringify(audit(clone()).out)===JSON.stringify(O),'an untouched copy of the tables must give the same findings as the tables themselves');

console.log('\n===== '+P+' passed, '+F+' failed, '+XF+' expected red =====');
process.exit(F?1:0);
