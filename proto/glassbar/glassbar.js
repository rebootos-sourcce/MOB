/* ============================================================
   THE GLASS BAR. DK in TASKS.md, ask one. A prototype over the shipped
   build, not part of it.

   His words: "it's glass, like Apple glass, it floats over the design and
   it has all of the iconography for the field and it can turn everything
   on and off, and this would be consistent across all the tools,
   saboteurs, complexes, hyper complexes, turn them all on and off." And:
   "I don't want that secondary navigation."

   WHAT IT REPLACES. The four depth words under the main menu (VIEWS in
   ui/wheel.js), the renditions' ten layer row (FLAYS in ui/rings.js), and
   the Wheel, Frames, Dial switch in the stage's left lane. One bar, over
   the picture, on all three renditions.

   WHAT IT DOES NOT TOUCH. compute() and everything under engine/. Every
   saboteur, complex and domain is still computed on every frame exactly as
   shipped. The bar decides what is DRAWN, never what is READ. The depth
   ladder survives in two places: as the geometry the ring makes room with,
   and as four one press presets behind the last button.

   HOW IT REACHES THE WHEEL WITHOUT EDITING IT. drawWheel is read as text,
   each layer's block is given one guard, PV('<layer>'), and it is evaluated
   back into the page. Every patch asserts its anchor, so a build that has
   moved underneath this throws with the anchor's name rather than drawing
   a picture with one layer quietly stuck on.
   ============================================================ */
window.GB=(function(){
'use strict';

/* ---- the layers, one word each, in the order the rings sit ----
   Icons are the product's own wherever the product already has one: the
   renditions' row for eight of them, the right rail's stack tabs for the
   four chain tiers. One concept, one mark, on every surface. */
function flay(k){var f=FLAYS.filter(function(x){return x.k===k;})[0];return f?f.d:'';}
/* the four tiers, as ui.js draws them on the rail's stack tabs */
var IC_SAB='M8.6 4.8a3.4 3.4 0 013.4 3.4v3.4a3.4 3.4 0 01-6.8 0V8.2a3.4 3.4 0 013.4-3.4'
 +'M15.4 12.4a3.4 3.4 0 013.4 3.4a3.4 3.4 0 01-6.8 0a3.4 3.4 0 013.4-3.4';
var IC_CX='M9 6.6a3 3 0 110 6 3 3 0 010-6M15 6.6a3 3 0 110 6 3 3 0 010-6M12 12.8a3 3 0 110 6 3 3 0 010-6';
var IC_HY='M12 3.2l7.6 4.4v8.8L12 20.8 4.4 16.4V7.6zM12 3.2v17.6M4.4 7.6l15.2 8.8M19.6 7.6L4.4 16.4';
var IC_SUP='M12 3.4a8.6 8.6 0 100 17.2 8.6 8.6 0 000-17.2M12 7.6a4.4 4.4 0 110 8.8 4.4 4.4 0 010-8.8';
/* the one mark the product did not have: the seven seats, up the body */
var IC_SEAT='M12 7.1v2.8M12 14.1v2.8'+frCirc(12,4.9,2.2)+frCirc(12,12,2.2)+frCirc(12,19.1,2.2);
/* ADDRESSES GETS A NEW MARK, and it is the one change to the product's own
   icons. Its renditions' mark, a hub with eight ticks, sat beside the Wheel's
   hub with eight spokes and the Laws' hub with seven, so three of the first
   nine icons in one row read as the same sun. The shell as the Field draws
   it is a ring cut into short segments, so that is the mark: twelve of them,
   against the Domains' five long ones. */
var IC_ADDR=frSegRing(12,8.2,13)+frCirc(12,12,1.6);
var IC_ZIN='M10.5 4.5a6 6 0 110 12 6 6 0 010-12M15 15l5 5M10.5 8v5M8 10.5h5';
var IC_ZOUT='M10.5 4.5a6 6 0 110 12 6 6 0 010-12M15 15l5 5M8 10.5h5';
var IC_ZFIT='M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5M9.5 12a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0';
var IC_LAYERS='M12 3.6l8.4 4.2-8.4 4.2-8.4-4.2zM3.6 12l8.4 4.2 8.4-4.2M3.6 16.2l8.4 4.2 8.4-4.2';
var IC_DEPTH='M4 19.5h4.4v-4M8.4 15.5h4.2v-4M12.6 11.5h4.2v-4M16.8 7.5H21';

var LAYERS=[
 {k:'addresses',g:'carry',nm:'Addresses',ic:IC_ADDR,fr:'addresses',
  tip:'Your 112 addresses. Each mark is the charge held at one place.'},
 {k:'seats',g:'carry',nm:'Seats',ic:IC_SEAT,fr:null,
  tip:'The seven seats, Root to Crown, named round their own run of the ring.'},
 {k:'laws',g:'carry',nm:'Laws',ic:flay('laws'),fr:'laws',
  tip:'The twenty one laws, set by seat. Their sum is the number at the centre.'},
 {k:'gates',g:'carry',nm:'Gates',ic:flay('gates'),fr:'gates',
  tip:'The six gates round the core. Each higher gate sits across from the lower one it stands against.'},
 {k:'shadow',g:'carry',nm:'Shadow',ic:flay('shadow'),fr:'shadow',
  tip:'The weight on all 112 addresses, as a wash behind everything.'},
 {k:'stories',g:'carry',nm:'Stories',ic:flay('stories'),fr:'stories',
  tip:'One line for each story that put charge on an address.'},
 {k:'saboteurs',g:'run',nm:'Saboteurs',ic:IC_SAB,fr:'patterns',tier:'sab',
  tip:'The saboteurs running on the charge, threaded to the addresses that built them.'},
 {k:'complexes',g:'run',nm:'Complexes',ic:IC_CX,fr:null,tier:'cx',
  tip:'Where saboteurs join. Each complex is built from the saboteurs outside it.'},
 {k:'hyper',g:'run',nm:'Hyper complexes',ic:IC_HY,fr:null,tier:'hy',
  tip:'Where complexes join, one ring further in.'},
 {k:'character',g:'run',nm:'Character',ic:IC_SUP,fr:null,tier:'sup',
  tip:'The innermost layer. What the whole chain compounds into.'},
 {k:'archetypes',g:'run',nm:'Archetypes',ic:flay('archetypes'),fr:'archetypes',
  tip:'The twelve, each set in the seat it runs through.'},
 {k:'domains',g:'before',nm:'Domains',ic:flay('domains'),fr:'domains',
  tip:'The nineteen blueprint domains, what was there before any of it.'},
 {k:'masks',g:'before',nm:'Masks',ic:flay('masks'),fr:'masks',
  tip:'The six masks, each at its weight.'}];
var BYK={}; LAYERS.forEach(function(l){BYK[l.k]=l;});
/* three clusters, like the reference's separate pills. The names are for
   the folded panel and for a screen reader; the full row shows no words. */
var GROUPS=[{k:'carry',nm:'What you carry'},{k:'run',nm:'What runs on it'},{k:'before',nm:'What was there before'}];

/* ---- the ladder, kept as presets and as geometry ----
   Each depth is the one before plus what it adds, read straight off the
   shipped VIEWS so the four words keep the four definitions they have. */
var ADDS=[['addresses','laws','gates','shadow','stories'],['seats','saboteurs'],
 ['complexes','hyper','character','archetypes'],['domains','masks']];
function preset(i){var s={};for(var j=0;j<=i;j++)ADDS[j].forEach(function(k){s[k]=1;});return s;}
/* the depth a set needs room for. Saboteurs sit on a ring that does not
   exist at Charge (radius zero), archetypes and masks sit inside a shell
   that has to grow out of their way, and the domain ring lies outside it. */
function needs(set){for(var i=3;i>0;i--)if(ADDS[i].some(function(k){return set[k];}))return i;return 0;}

var ON=preset(S.view|0);
var OPT={room:true,zoomAdds:false,fold:null};   /* fold null means fitted to the width */

/* what zoom has reached. Only under the "zoom adds" option: the next depth's
   layers draw while zoomed in, and the icon says they came from the
   gesture. Nothing the person switched on is ever taken off by it. */
function zoomExtra(){var z=S.zoom||1,e=0;for(var i=1;i<ZOOM_STEP.length;i++)if(z>=ZOOM_STEP[i])e=i;return e;}
function reached(){var out={};if(!OPT.zoomAdds)return out;
 var top=Math.min(3,needs(ON)+zoomExtra());
 for(var i=0;i<=top;i++)ADDS[i].forEach(function(k){if(!ON[k])out[k]=1;});
 return out;}
function PV(k){return !!(ON[k]||reached()[k]);}
function visible(){var s={};LAYERS.forEach(function(l){if(PV(l.k))s[l.k]=1;});return s;}
function geomDepth(){return OPT.room?needs(visible()):3;}
function sig(){return LAYERS.map(function(l){return PV(l.k)?1:0;}).join('')+(OPT.room?'r':'h');}

/* ============================================================
   THE WHEEL. One guard per layer block, nothing else changed.
   ============================================================ */
var PATCH=[
 /* saboteurs as chords, and each chain tier as its own */
 /* A THREAD IS DRAWN WHEN BOTH ITS ENDS ARE. Complexes alone with their
    threads running out to saboteurs that are not there read as string cut
    loose, measured on the first pass. The bead is the layer; the thread is
    the relation between two layers, so it needs both. */
 ['s.parts.forEach(n=>quad(n.ang,R.shell*.92','(PV(\'addresses\')?s.parts:[]).forEach(n=>quad(n.ang,R.shell*.92'],
 ['c.parts.forEach(s=>quad(s.ang,R.sab','(PV(\'saboteurs\')?c.parts:[]).forEach(s=>quad(s.ang,R.sab'],
 ['h.parts.forEach(c=>quad(c.ang,R.cx','(PV(\'complexes\')?h.parts:[]).forEach(c=>quad(c.ang,R.cx'],
 ['u.parts.forEach(h=>quad(h.ang,R.hy','(PV(\'hyper\')?u.parts:[]).forEach(h=>quad(h.ang,R.hy'],
 ['r.sabs.forEach(s=>s.parts.forEach(n=>{','r.sabs.forEach(s=>(PV(\'addresses\')?s.parts:[]).forEach(n=>{'],
 ['r.sabs.forEach(s=>{const k=w01(s);','(PV(\'saboteurs\')?r.sabs:[]).forEach(s=>{const k=w01(s);'],
 ['r.cxs.forEach(c=>{const k=w01(c);','(PV(\'complexes\')?r.cxs:[]).forEach(c=>{const k=w01(c);'],
 ['r.hys.forEach(h=>{const k=w01(h);','(PV(\'hyper\')?r.hys:[]).forEach(h=>{const k=w01(h);'],
 ['r.sups.forEach(u=>{const k=w01(u);','(PV(\'character\')?r.sups:[]).forEach(u=>{const k=w01(u);'],
 /* saboteurs as straight threads, at the Patterns geometry */
 ['}else if(L===1){','}else if(L===1&&PV(\'saboteurs\')){'],
 ['verpArrows(cr0);','if(PV(\'gates\'))verpArrows(cr0);'],
 ['SI.forEach((l,i)=>{const a=i/21*TAU','if(PV(\'laws\'))SI.forEach((l,i)=>{const a=i/21*TAU'],
 ['g.beginPath();g.arc(CX,CY,lr,0,TAU);g.strokeStyle=rgba(ink,.12);g.lineWidth=1;g.stroke();',
  'if(PV(\'laws\')){g.beginPath();g.arc(CX,CY,lr,0,TAU);g.strokeStyle=rgba(ink,.12);g.lineWidth=1;g.stroke();}'],
 ['if(L>=2){for(let j=0;j<12;j++){','if(PV(\'archetypes\')){for(let j=0;j<12;j++){'],
 ['if(L===3){r.maskRing.forEach(','if(PV(\'masks\')){r.maskRing.forEach('],
 ['const fg=fetA(0), fn=fetA(1);\n W.forEach(n=>{','const fg=fetA(0), fn=fetA(1);\n (PV(\'addresses\')?W:[]).forEach(n=>{'],
 ['if(aa2>0)W.forEach(','if(aa2>0&&PV(\'stories\'))W.forEach('],
 ['if(L>=1)BANDS.forEach(b=>{const seg=','if(PV(\'seats\'))BANDS.forEach(b=>{const seg='],
 ['if(L===3){for(let d=0;d<19;d++){','if(PV(\'domains\')){for(let d=0;d<19;d++){'],
 ['if(L>=1){r.sabs.forEach(s=>bead(','if(L>=1&&PV(\'saboteurs\')){r.sabs.forEach(s=>bead('],
 ['if(L>=2){r.cxs.forEach(c=>bead(c,R.cx,7.2,bc(\'Solar\')));\n  r.hys.forEach(h=>bead(h,R.hy,10,bc(\'Sacral\')));\n  r.sups.forEach(u=>bead(u,R.sup,13,bc(\'Root\')));',
  'if(L>=2){if(PV(\'complexes\'))r.cxs.forEach(c=>bead(c,R.cx,7.2,bc(\'Solar\')));\n  if(PV(\'hyper\'))r.hys.forEach(h=>bead(h,R.hy,10,bc(\'Sacral\')));\n  if(PV(\'character\'))r.sups.forEach(u=>bead(u,R.sup,13,bc(\'Root\')));'],
 ['r.hys.slice(0,3).forEach(h=>flatplate(','if(PV(\'hyper\'))r.hys.slice(0,3).forEach(h=>flatplate('],
 ['r.sups.slice(0,2).forEach(u=>flatplate(','if(PV(\'character\'))r.sups.slice(0,2).forEach(u=>flatplate(']];
function patchFn(fn,pairs,name){
 var s=fn.toString();
 pairs.forEach(function(p){
  if(s.indexOf(p[0])<0)throw new Error('glass bar: '+name+' has moved, anchor not found: '+p[0].slice(0,48));
  s=s.replace(p[0],p[1]);});
 return s;}
function patchWheel(){(0,eval)(patchFn(drawWheel,PATCH,'drawWheel'));}
/* the renditions. The three chain tiers were one group; each takes its tier
   as a class. The seat marks drew unclassed; they take one so Seats can
   answer. Proto only: the design gate would want the class named in a rule,
   and the rule is in glassbar.css. */
/* THE FRAME GOES FLUSH. His words: "I like the frame, but I don't like the
   beveled edges because I want the entire thing flush to the rectangle of
   the area." The frame was drawn eight pixels in from its box, and every
   ring was a superellipse at an exponent of twelve, which rounds a corner by
   about a tenth of its side. The outer ring now sits on the box's own edge
   at an exponent of four hundred, measured square to the pixel at the corner, and the rings
   inside ease back toward the old shape as they go in, so the picture keeps
   its nested read and only the outside becomes the rectangle. */
/* FLUSH WHEN THE OUTER BAND IS OFF, TOO. The domains are the outermost band
   of the frame, and with them off the frame was flush to a band nobody could
   see: measured, the first visible line sat 33 pixels in from the box at
   1600. So Frames makes room the way the Wheel does: with Domains off, every
   ring moves out by the domain band's depth and the addresses become the
   edge. Under "holds still" it keeps its place. */
window.GB_ROOMFR=function(D){return (OPT.room&&!PV('domains'))?D.dom1:0;};
/* on window, because the patched frFrames is evaluated in the page's own scope */
var GB_NS=window.GB_NS=function(d,w){var t=Math.min(1,d/(Math.min(w.a,w.b)*.35));return 12+388*Math.pow(1-t,3);};
function patchRings(){
 /* THE RING HAS TO SURVIVE A SQUARE CORNER. frRing raised the pixel ratio
    to the exponent directly, (1/300) to the 400th, which underflows to zero,
    and the whole Frames picture drew as NaN: measured on the first cut, every
    path "MZ" and every mark at NaN, logged loudly by the browser and by
    nothing else. Same arithmetic, scaled by the larger term first, so the
    powers stay between nought and one at any exponent. */
 (0,eval)(patchFn(frRing,[['return Math.pow(Math.pow(Math.abs(c/a),n)+Math.pow(Math.abs(s/b),n),-1/n);};',
  'var u=Math.abs(c/a),v=Math.abs(s/b),m=Math.max(u,v)||1e-12;return 1/(m*Math.pow(Math.pow(u/m,n)+Math.pow(v/m,n),1/n));};']],'frRing'));
 FR_RINGS={};
 (0,eval)(patchFn(frMount,[['var pad=8,w={x0:pad','var pad=(FVIEW===\'frames\'?0:8),w={x0:pad']],'frMount'));
 (0,eval)(patchFn(frFrames,[
  ['var ring=function(d){return frRingC(cx,cy,w.a-d,w.b-d,NS);};',
   'var ring=function(d){d=Math.max(0,d-GB_ROOMFR(D));return frRingC(cx,cy,w.a-d,w.b-d,GB_NS(d,w));};']],'frFrames'));
 (0,eval)(patchFn(frCore,[
  ['var F1=Math.max(22,38*inner/45)','var F1=Math.max(26,50*inner/45)'],
  ['H=fits([{h:f1*.727,w:W_(FC,f1,300),g:g1},{h:lc,w:W_(\'CQ\',lab,500),g:g2},{h:f2*.727,w:W_(FD,f2,500)+4+W_(\'DQ\',lab,500)}]);',
   'H=fits([{h:f1*.727,w:W_(FC,f1,400),g:g1},{h:lc,w:W_(\'CQ\',lab,500),g:g2},{h:f2*.727,w:W_(FD,f2,500),g:g1*.8},{h:lc,w:W_(\'DQ\',lab,500)}]);'],
  ['   s+=t(y0+f1*.727,frRgb(col),f1,300,cq,\' letter-spacing="-0.02em"\')',
   '   /* one figure over one label, twice, on one centre line: the pair reads as a pair */\n'
   +'   var yq=y0+f1*.727,yql=yq+g1+lc,yd=yql+g2+f2*.727,ydl=yd+g1*.8+lc;ry=yql+g2/2+.5;\n'
   +'   s+=t(yq,frRgb(col),f1,400,cq,\' letter-spacing="-0.03em"\')+t(yql,frRgb(M.dim),lab,500,\'CQ\',\' letter-spacing="0.08em"\')\n'
   +'    +\'<line x1="\'+(cx-12).toFixed(1)+\'" y1="\'+ry.toFixed(1)+\'" x2="\'+(cx+12).toFixed(1)+\'" y2="\'+ry.toFixed(1)+\'" stroke="\'+rgba(M.ink,.16)+\'" stroke-width="1"/>\'\n'
   +'    +t(yd,frRgb(M.dq),f2,500,dq)+t(ydl,frRgb(M.dim),lab,500,\'DQ\',\' letter-spacing="0.08em"\');\n'
   +'   M.L.core.push(s+\'</g>\');return;\n'
   +'   s+=t(y0+f1*.727,frRgb(col),f1,300,cq,\' letter-spacing="-0.02em"\')']],'frCore'));
 (0,eval)(patchFn(frChains,[
  ['if(frames)Cn.push(\'<path d="\'','if(frames)Cn.push(\'<path class="T-\'+key+\'" d="\''],
  ['Cn.push(\'<path d="\'+frBowD','Cn.push(\'<path class="T-\'+key+\' F-\'+T[7]+\'" d="\'+frBowD'],
  ['Cn.push(\'<circle data-h="\'','Cn.push(\'<circle class="T-\'+key+\'" data-h="\'']],'frChains'));
 ['frFrames','frDial'].forEach(function(nm){
  (0,eval)(patchFn(window[nm],[['P.push(\'<path d="\'+frBowD(q,p,cx,cy,frSag(n,','P.push(\'<path class="F-addr" d="\'+frBowD(q,p,cx,cy,frSag(n,']],nm));});
 (0,eval)(patchFn(frSvg,[
  ['(k in FR_CLS)?\'<g>\'','(k in FR_CLS)?\'<g class="P-\'+k+\'">\'']],'frSvg'));}

/* ============================================================
   THE BAR. Revised 26 September on his ruling, DR in TASKS.md.

   "I'm not a fan of the pills as much as I used to be, they take up a lot
   of real estate. I want ... a circle and the icon inside of it, and the
   percent complete ring around it are the primary features, and then
   there's a pill to the lower right hand side with the percent or whatever
   the value is."

   So every layer is one object: a glass circle, the layer's mark inside,
   a ring round the rim carrying a real number off this person's reading,
   and that number in a small pill riding the lower right. The group
   capsules are gone; the clusters are kept apart by space alone.

   A LAYER THAT IS OFF IS STILL READ. Its ring and its number stay, dimmed,
   because switching a layer off hides it from the picture, not from the
   person. What changes is the disc, the mark and the ring's colour.
   ============================================================ */
/* ON A PHONE THE FIRST TAP WOULD EXPLAIN AND THE SECOND WOULD ACT. That is the
   product's tooltip rule for every data-tip carrier on a coarse pointer, and
   it is right for a row that navigates. It is wrong for a toggle: the press
   is cheap, it undoes itself, and what it does is visible at once. So on a
   phone the bar carries no tooltip, every icon in the folded panel wears its
   name, and the panel's own line says what the last press did and what the
   layer is. */
var COARSE=false;try{COARSE=matchMedia('(pointer: coarse)').matches;}catch(e){}
function setTip(b,t){if(COARSE)b.removeAttribute('data-tip');else b.setAttribute('data-tip',t);}
function svg(ic){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+glyphPath(ic)+'</svg>';}
var BAR=null, PANEL=null, MENU=null, FOLDBTN=null, RREND=null, END=null;

/* ---- what each ring carries. Real numbers, read off compute() ----
   Where the product already prints a number for the thing, the ring prints
   the same number, so one concept keeps one figure across the Field: SQ,
   CQ and DQ are the strip's own, Heaviest and the first archetype are the
   rail's, and the four chain tiers carry the rail's own running counts.
   Where the product had no number, the one chosen is said in the tooltip,
   and every one of them is an open question in the report. */
var VALS={}, LASTR=null;
function reach(list,carry){
 if(!carry.length)return 0;
 var s={}; list.forEach(function(o){leaves(o).forEach(function(x){s[x.i]=1;});});
 return carry.filter(function(n){return s[n.i];}).length/carry.length*100;}
function readVals(r){
 var V={}, dash='\u2013', carry=W.filter(function(n){return n.sq>=4;});
 var f1=function(x){return (+x||0).toFixed(1);}, pc=function(x){return Math.round(+x||0)+'%';};
 V.addresses={p:r.SQm*10,v:f1(r.SQm),c:seatCol(r.darkB),
  m:'Ring and number: segment depth, SQ, '+f1(r.SQm)+' of 10. How deep the held charge sits.'};
 V.seats={p:(r.darkV||0)*10,v:f1(r.darkV),c:seatCol(r.darkB),
  m:'Ring and number: the heaviest seat, '+r.darkB+', at '+f1(r.darkV)+' of 10.'};
 V.laws={p:r.CQ,v:pc(r.CQ),c:seatCol('Crown'),
  m:'Ring and number: coherence, CQ, which is the laws summed.'};
 var G=verpRead(), hi=G.filter(function(g){return g.side==='higher';}).reduce(function(a,g){return a+g.pct;},0),
  anyG=G.some(function(g){return g.pct>0;});
 V.gates={p:anyG?hi:0,v:anyG?pc(hi):dash,c:seatCol('Heart'),
  m:anyG?'Ring and number: how much of what you wrote ran through the three higher gates.'
   :'No story has run through a gate yet.'};
 V.shadow={p:r.DQ,v:pc(r.DQ),c:seatCol('Root'),
  m:'Ring and number: shadow weight, DQ, the weight on all 112 addresses.'};
 var ai=atomIndex()||{}, traced=carry.length?carry.filter(function(n){return (ai[n.i]||[]).length;}).length/carry.length*100:0;
 V.stories={p:traced,v:carry.length?pc(traced):dash,c:'var(--accent)',
  m:carry.length?'Ring and number: the share of your carrying addresses a story you wrote reached.'
   :'Nothing is carrying charge yet.'};
 [['saboteurs',r.sabs,r.sabs[0]&&r.sabs[0].parts[0]?r.sabs[0].parts[0].b:r.darkB],
  ['complexes',r.cxs,'Solar'],['hyper',r.hys,'Sacral'],['character',r.sups,'Root']].forEach(function(t){
  var p=reach(t[1],carry);
  V[t[0]]={p:p,v:String(t[1].length),c:seatCol(t[2]),
   m:'Number: how many are running, as the rail counts them. Ring: the share of your carrying addresses they are built on, '+pc(p)+'.'};});
 var aff=(r.aff||[]).map(function(v,i){return {i:i,v:v};}).sort(function(a,b){return b.v-a.v;});
 var tot=aff.reduce(function(a,x){return a+x.v;},0)||1, top=aff[0]||{i:0,v:0}, A=ARCH[top.i]||{};
 V.archetypes={p:top.v/tot*100,v:pc(top.v/tot*100),c:seatCol(A.b||'Heart'),
  m:'Ring and number: '+(A.nm||'the first archetype')+', the first archetype, as its share of how the blueprint expresses.'};
 var dm=DOMAIN.reduce(function(a,v){return a+v;},0)/DOMAIN.length*100, d0=DOMAINS[S.doms[0]];
 V.domains={p:dm,v:pc(dm),c:d0?ROOTCOL[d0.r]:'var(--gold)',
  m:'Ring and number: how far across the nineteen domains your blueprint reaches.'};
 var mk=(r.maskRing||[]).slice().sort(function(a,b){return b.w-a.w;})[0];
 V.masks={p:mk?mk.w*10:0,v:mk?f1(mk.w):dash,c:'var(--gold)',
  m:mk?'Ring and number: the heaviest mask, '+mk.nm+', at '+f1(mk.w)+' of 10.':'No mask carries weight yet.'};
 /* nothing read, nothing printed. The rail's own rule: the ring draws empty
    and the tail carries a dash, because a figure beside "not read yet" is
    the contradiction the words exist to prevent. */
 if(r.unread)Object.keys(V).forEach(function(k){V[k]={p:0,v:dash,c:V[k].c,m:'Nothing read yet.'};});
 Object.keys(V).forEach(function(k){V[k].p=Math.max(0,Math.min(100,+V[k].p||0));});
 return V;}
var VQ=false;
function queueVals(){if(VQ)return;VQ=true;setTimeout(function(){VQ=false;
 if(!LASTR)return; try{VALS=readVals(LASTR);}catch(e){VALS={};} paint();},0);}

/* one object: glass disc, mark, ring, corner pill */
function orb(o){
 var b=document.createElement('button'); b.type='button'; b.className='gb-b';
 if(o.k)b.setAttribute('data-gb',o.k);
 b.setAttribute('aria-label',o.nm);
 if(!COARSE)b.setAttribute('data-tip-t',o.nm); setTip(b,o.tip||'');
 b.innerHTML='<span class="gb-orb"><svg class="gb-arc" viewBox="0 0 40 40" aria-hidden="true">'
  +'<circle class="trk" cx="20" cy="20" r="18"/>'
  +'<circle class="val" cx="20" cy="20" r="18" pathLength="100" stroke-dasharray="0 100"/></svg>'
  +'<span class="gb-gl">'+svg(o.ic)+'</span>'
  +(o.val?'<span class="gb-v"></span>':'')+'</span>'
  +(o.label?'<span class="gb-nm">'+o.nm+'</span>':'');
 return b;}
function toggle(k){
 if(ON[k])delete ON[k]; else ON[k]=1;
 unpinHidden(); apply(); say(k);}
var SAY=null;
function say(k){if(!SAY)return;var l=BYK[k],v=VALS[k];
 var wait=ON[k]&&k==='stories'&&FVIEW==='wheel'&&atomA()<=0;
 SAY.innerHTML='<b>'+l.nm+(ON[k]?' on.':' off.')+'</b> '+esc(l.tip)
  +(wait?' They draw once you pinch in on the ring.':'')+(v?' '+esc(v.m):'');}
/* a pinned thing whose layer has gone off is let go, or the rest of the web
   would stay dimmed around something no longer drawn */
var PINK={node:'addresses',seat:'seats',law:'laws',gate:'gates',atom:'stories',sab:'saboteurs',
 cx:'complexes',hy:'hyper',sup:'character',arch:'archetypes',dom:'domains',mk:'masks'};
function unpinHidden(){var p=S.pin;if(!p)return;
 var k=PINK[p.kind]||(p.sq!==undefined&&p.b?'addresses':null);
 if(k&&!PV(k))S.pin=null;}

function cluster(g,label){
 var c=document.createElement('div'); c.className='gb-grp';
 c.setAttribute('role','group'); c.setAttribute('aria-label',g.nm);
 LAYERS.filter(function(l){return l.g===g.k;}).forEach(function(l){
  var b=orb({k:l.k,nm:l.nm,ic:l.ic,tip:l.tip,label:label,val:true});
  b.addEventListener('click',function(){toggle(l.k);});
  c.appendChild(b);});
 return c;}

/* ---- Wheel, Frames, Dial. In the right rail, icon only ----
   Ruled in two steps. First: "it's taking up too much real estate being on
   the centre pane ... I don't need the text, just make it the icon." Then,
   settling where: "move that to the secondary nav on the right hand side,
   and let's just keep those three options there and let people play around
   with it to see which ones they like better." Secondary nav is his word for
   the right rail now. They sit directly under its top line. */
function buildRend(){
 RREND=document.createElement('div'); RREND.id='gb-rend'; RREND.className='gb-rend';
 RREND.setAttribute('role','radiogroup'); RREND.setAttribute('aria-label','How the Field is drawn');
 FVIEWS.forEach(function(f){
  var b=orb({k:'fv-'+f.k,nm:f.nm,ic:f.ic,
   tip:f.tip.replace('The bar above adds a layer at a time and scrolling on the ring adds more.','Scrolling on the ring brings it closer.')});
  b.setAttribute('role','radio');
  b.addEventListener('click',function(){fviewSet(f.k);});
  RREND.appendChild(b);});}
function placeRend(){
 var top=document.getElementById('railtop');
 if(top&&top.parentNode)top.parentNode.insertBefore(RREND,top.nextSibling);}

function build(){
 var stage=document.querySelector('.stage');
 BAR=document.createElement('div'); BAR.id='gb'; BAR.setAttribute('role','toolbar');
 BAR.setAttribute('aria-label','Field layers');
 /* the layers, three clusters, the full row */
 var full=document.createElement('div'); full.className='gb-full';
 GROUPS.forEach(function(g){var c=cluster(g,false);c.setAttribute('data-grp',g.k);full.appendChild(c);});
 BAR.appendChild(full);
 /* the folded form: one button that opens the same three clusters as a panel */
 var fold=document.createElement('div'); fold.className='gb-grp gb-foldp';
 FOLDBTN=orb({k:'fold',nm:'Layers',ic:IC_LAYERS,tip:'Every layer on the Field, each one on or off.'});
 FOLDBTN.setAttribute('aria-expanded','false'); FOLDBTN.setAttribute('aria-controls','gb-panel');
 FOLDBTN.addEventListener('click',function(e){e.stopPropagation();openPanel(!PANEL.classList.contains('open'));});
 fold.appendChild(FOLDBTN); BAR.appendChild(fold);
 /* the ladder, as four presets behind one button */
 var dp=document.createElement('div'); dp.className='gb-grp';
 var db=orb({k:'depth',nm:'Depth',ic:IC_DEPTH,tip:'Four starting sets, each one the last plus a layer: Charge, Patterns, Chains, Blueprint.'});
 db.setAttribute('aria-haspopup','menu'); db.setAttribute('aria-expanded','false');
 db.addEventListener('click',function(e){e.stopPropagation();openMenu(!MENU.classList.contains('open'));});
 dp.appendChild(db); BAR.appendChild(dp);
 /* ZOOM, ON EVERY RENDITION. His words, for Frames: "I want to be able to
    zoom in and out, and then hit the F key and have it reframe." The Wheel
    already zoomed by scroll and already reframed on F, with no control you
    could see; the same three now sit at the end of the bar for all three
    pictures, and F works on all three. The reframe circle's ring and pill
    carry how far in you are. */
 END=document.createElement('div'); END.className='gb-grp gb-zoom'; END.setAttribute('role','group');
 END.setAttribute('aria-label','Zoom');
 [['zout','Zoom out',IC_ZOUT,'Move out. Or press minus.',function(){zoomBy(1/1.25);}],
  ['zin','Zoom in',IC_ZIN,'Move in. Or press plus. Scrolling on the picture does the same, and drag moves it.',function(){zoomBy(1.25);}],
  ['zfit','Reframe',IC_ZFIT,'Back to the whole picture. Or press F.',function(){reframeNow();}]].forEach(function(z){
  var b=orb({k:z[0],nm:z[1],ic:z[2],tip:z[3],val:z[0]==='zfit'});
  b.addEventListener('click',function(e){e.stopPropagation();z[4]();});
  END.appendChild(b);});
 BAR.appendChild(END);
 stage.appendChild(BAR);
 buildRend();

 PANEL=document.createElement('div'); PANEL.id='gb-panel'; PANEL.className='gb-float';
 GROUPS.forEach(function(g){
  var h=document.createElement('div'); h.className='gb-ph'; h.textContent=g.nm; PANEL.appendChild(h);
  PANEL.appendChild(cluster(g,true));});
 SAY=document.createElement('p'); SAY.className='gb-say'; SAY.setAttribute('role','status');
 SAY.setAttribute('aria-live','polite');
 SAY.textContent='Each one on or off. What is off is still read, only not drawn.';
 PANEL.appendChild(SAY);
 PANEL.addEventListener('click',function(e){e.stopPropagation();});
 var done=document.createElement('button'); done.type='button'; done.className='gb-done'; done.textContent='Done';
 done.addEventListener('click',function(){openPanel(false);});
 PANEL.appendChild(done);
 document.body.appendChild(PANEL);

 MENU=document.createElement('div'); MENU.id='gb-menu'; MENU.className='gb-float'; MENU.setAttribute('role','menu');
 VIEWS.forEach(function(v,i){
  var m=document.createElement('button'); m.type='button'; m.className='gb-mi'; m.setAttribute('role','menuitemradio');
  m.setAttribute('data-preset',i);
  m.innerHTML='<span class="gb-ic">'+svg(VICON[i])+'</span><span class="gb-mt"><b>'+v.nm+'</b><span>'+esc(v.tip)+'</span></span>';
  m.addEventListener('click',function(e){e.stopPropagation();ON=preset(i);S.view=i;S.pin=null;openMenu(false);apply();});
  MENU.appendChild(m);});
 document.body.appendChild(MENU);
 document.addEventListener('click',function(){openPanel(false);openMenu(false);});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'){openPanel(false);openMenu(false);}});
 addEventListener('scroll',function(){if(MENU.classList.contains('open'))openMenu(false);
  if(PANEL.classList.contains('open')&&!PANEL.classList.contains('sheet'))openPanel(false);},true);
 /* arrow keys walk the bar, the way a toolbar should */
 BAR.addEventListener('keydown',function(e){
  if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
  var all=[].slice.call(BAR.querySelectorAll('.gb-b')).filter(function(b){return b.offsetParent;});
  var i=all.indexOf(document.activeElement); if(i<0)return;
  all[(i+(e.key==='ArrowRight'?1:all.length-1))%all.length].focus(); e.preventDefault();});}
/* THE FLOATS HANG OFF THE WINDOW, not the stage. The stage clips what it
   holds, and under the Glass theme it carries a backdrop filter, which makes
   it the box a fixed child is placed in. Anchored under their button,
   inside the stage's own width. */
function phone(){return innerWidth<=720;}
function place(el,anchor){
 var st=document.querySelector('.stage').getBoundingClientRect(), a=anchor.getBoundingClientRect();
 el.style.top=(a.bottom+10)+'px'; el.style.left='0px'; el.style.maxWidth=(st.width-24)+'px';
 var w=el.offsetWidth, left=Math.max(st.left+12,Math.min(a.left,st.right-w-12));
 el.style.left=left+'px';}
/* ON A PHONE THE PANEL IS A SHEET ALONG THE FOOT, AND THE RING IS BROUGHT UP
   ABOVE IT. Dropped under its button it covered the whole ring at 390, so a
   press changed a picture nobody could see, which is a dead control with
   extra steps. */
function ringUp(){var pic=document.getElementById(FVIEW==='wheel'?'cv':'frend');if(!pic)return;
 var r=pic.getBoundingClientRect(), room=innerHeight-PANEL.offsetHeight-16;
 if(r.top>=8&&r.bottom<=room)return;
 var by=r.top-Math.max(8,(room-r.height)/2);
 var sc=document.scrollingElement, b=document.body;
 if(b.scrollHeight>b.clientHeight+2&&/(auto|scroll)/.test(getComputedStyle(b).overflowY))b.scrollBy(0,by);
 else sc.scrollBy(0,by);}
function openPanel(on){if(!PANEL)return;
 if(on)openMenu(false);
 PANEL.classList.toggle('open',on); PANEL.classList.toggle('sheet',on&&phone());
 FOLDBTN.setAttribute('aria-expanded',String(on));
 if(on){if(phone()){PANEL.style.top='';PANEL.style.left='';PANEL.style.maxWidth='';ringUp();}else place(PANEL,FOLDBTN);}}
function openMenu(on){if(!MENU)return;
 if(on)openPanel(false);
 MENU.classList.toggle('open',on);
 var db=BAR.querySelector('[data-gb=depth]'); db.setAttribute('aria-expanded',String(on));
 if(on)place(MENU,db);}

/* ---- the full row or the folded one ----
   The full row folds when it does not fit rather than scrolling sideways
   with its end cut off, which is the shipped depth row's defect at 390:
   Blueprint sits past the edge with nothing saying it is there. */
function fitFold(){
 if(!BAR)return;
 var st=document.querySelector('.stage'); var avail=st.clientWidth-28;
 BAR.classList.remove('folded');
 var fold=OPT.fold===null?(BAR.scrollWidth>avail):OPT.fold;
 BAR.classList.toggle('folded',fold);
 if(!fold)openPanel(false);}

/* ---- paint every object from the state, one writer ---- */
function paint(){
 if(!BAR)return;
 var rc=reached(), wheel=FVIEW==='wheel', atomsOut=atomA()<=0;
 [BAR,PANEL,RREND].forEach(function(host){if(!host)return;
  host.querySelectorAll('[data-gb]').forEach(function(b){
  var k=b.getAttribute('data-gb');
  if(k.indexOf('fv-')===0){var on=k.slice(3)===FVIEW;b.setAttribute('aria-checked',String(on));b.classList.toggle('on',on);
   /* a rendition has no reading, so its ring is whole when it is the one up */
   var a=b.querySelector('.val'); if(a)a.setAttribute('stroke-dasharray',(on?100:0)+' 100');return;}
  var l=BYK[k]; if(!l)return;
  var on=!!ON[k], z=!on&&!!rc[k], V=VALS[k];
  b.setAttribute('aria-pressed',String(on));
  b.classList.toggle('on',on); b.classList.toggle('zoomed',z);
  if(V){var o=b.querySelector('.gb-orb'); o.style.setProperty('--c',V.c);
   b.querySelector('.val').setAttribute('stroke-dasharray',V.p.toFixed(1)+' 100');
   var pv=b.querySelector('.gb-v'); if(pv)pv.textContent=V.v;}
  /* Stories on the wheel are drawn out along each address, past the ring,
     and the ring's edge rule only lets them out once it has been brought
     close. On, and waiting for that, is said on the button, not hidden. */
  var wait=on&&k==='stories'&&wheel&&atomsOut;
  b.classList.toggle('wait',wait);
  setTip(b,l.tip+(V?' '+V.m:'')+(wait?' On. They draw once you scroll in on the ring.':'')
   +(z?' Brought in by zoom. Zoom out and it goes again.':''));});});
 var zf=BAR.querySelector('[data-gb=zfit]');
 if(zf){var zn=fzNow(),zp=(zn.s-1)/(zn.max-1)*100;
  zf.querySelector('.val').setAttribute('stroke-dasharray',Math.max(0,Math.min(100,zp)).toFixed(1)+' 100');
  zf.querySelector('.gb-v').textContent=zn.s.toFixed(1)+'\u00d7';
  zf.classList.toggle('on',zn.s>1.001);
  zf.querySelector('.gb-orb').style.setProperty('--c','var(--accent)');}
 var cur=-1;for(var i=0;i<4;i++){var p=preset(i);
  if(LAYERS.every(function(l){return !!p[l.k]===!!ON[l.k];}))cur=i;}
 if(MENU)MENU.querySelectorAll('[data-preset]').forEach(function(m){
  m.setAttribute('aria-checked',String(+m.getAttribute('data-preset')===cur));});
 var db=BAR.querySelector('[data-gb=depth]');
 db.classList.toggle('on',cur>=0);
 db.querySelector('.val').setAttribute('stroke-dasharray',(cur>=0?100:0)+' 100');
 setTip(db,'Four starting sets, each one the last plus a layer. '
  +(cur>=0?'This is '+VIEWS[cur].nm+'.':'What is on now is your own set.'));}

/* ---- the renditions and the ground answer to the same state ---- */
function applyRend(){
 var fr=document.getElementById('frend');
 if(fr){
  LAYERS.forEach(function(l){
   if(l.fr)fr.classList.toggle('off-'+l.fr,!PV(l.k));
   if(l.tier)fr.classList.toggle('gb-off-'+l.tier,!PV(l.k));});
  fr.classList.toggle('gb-off-seats',!PV('seats'));
  fr.classList.toggle('gb-off-addr',!PV('addresses'));
  /* the dial's one chain callout names the character layer */
  fr.classList.toggle('gb-off-call',!PV('character'));}
 document.body.classList.toggle('gb-off-shadow',!PV('shadow'));}
function apply(){applyRend(); paint();
 /* Frames draws its geometry off the visible set now, so a toggle rebuilds it */
 if(FVIEW==='frames')FR_SIG=null;
 if(typeof render==='function')render();}

/* ---- the prototype's own questions, pressable ---- */
function opts(){
 var box=document.createElement('div'); box.id='gb-opts';
 box.innerHTML='<button type="button" class="gb-ob" aria-expanded="false">Prototype questions</button>'
  +'<div class="gb-oc" hidden>'
  +'<p class="gb-oq">When a layer comes on, does the ring make room for it, or hold still?</p>'
  +'<div class="gb-seg" data-o="room"><button data-v="1">Makes room</button><button data-v="0">Holds still</button></div>'
  +'<p class="gb-oq">Scrolling in on the Wheel used to add the next depth. Now?</p>'
  +'<div class="gb-seg" data-o="zoomAdds"><button data-v="0">Only closer</button><button data-v="1">Also adds the next layer</button></div>'
  +'<p class="gb-oq">On a wide screen, every icon in a row, or folded behind one button?</p>'
  +'<div class="gb-seg" data-o="fold"><button data-v="auto">Row when it fits</button><button data-v="1">Always folded</button></div>'
  +'<p class="gb-on">Not part of the product. Each is an open question in the report.</p></div>';
 document.body.appendChild(box);
 var ob=box.querySelector('.gb-ob'), oc=box.querySelector('.gb-oc');
 ob.addEventListener('click',function(e){e.stopPropagation();var o=oc.hidden;oc.hidden=!o;ob.setAttribute('aria-expanded',String(o));});
 oc.addEventListener('click',function(e){e.stopPropagation();});
 function sync(){box.querySelectorAll('.gb-seg').forEach(function(sg){var o=sg.getAttribute('data-o');
  var v=o==='fold'?(OPT.fold?'1':'auto'):(OPT[o]?'1':'0');
  sg.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-v')===v));});});}
 box.querySelectorAll('.gb-seg button').forEach(function(b){b.type='button';
  b.addEventListener('click',function(){var o=b.parentNode.getAttribute('data-o'),v=b.getAttribute('data-v');
   if(o==='fold')OPT.fold=v==='1'?true:null; else OPT[o]=v==='1';
   sync(); fitFold(); unpinHidden(); apply();});});
 sync();}

/* THE GLASS TAKES THE TONE OF WHAT IT LIES ON, NOT OF THE THEME'S NAME.
   Measured on the lighting sweep: under Snow the panels are light and the
   stage keeps the ruled #101010, so glass made of the panel colour was a
   grey slab on a black field. The ground is read off the stage itself, the
   way rings.js reads it, and the bar and its floats take a dark or a light
   glass to match. */
/* ============================================================
   ZOOM ON FRAMES AND DIAL. The picture is one SVG, so it is moved as one
   thing: a scale and a shift on the element, which keeps every mark's own
   hit target under the pointer at any zoom. It is re-applied whenever the
   picture is rebuilt, because the rebuild writes a new SVG.

   Zoom only ever brings it closer: at 1x the picture is whole and cannot be
   pushed off its own box, and at any zoom the edge of the picture stops at
   the edge of the box, so the frame's flush edge is never pulled inward.
   ============================================================ */
var FZ={s:1,x:0,y:0}, FZ_MAX=6, FZDRAG=null, FZMOVED=false;
function fzOn(){return FVIEW!=='wheel';}
function fzNow(){return fzOn()?{s:FZ.s,max:FZ_MAX}:{s:S.zoom||1,max:7};}
function fzHost(){return document.getElementById('frend');}
function fvClass(){document.body.classList.toggle('gb-fv-frames',FVIEW==='frames');}
function fzApply(){var h=fzHost(),sv=h&&h.querySelector('.frsvg');if(!sv)return;
 sv.style.transformOrigin='0 0';
 sv.style.transform=(FZ.s===1&&!FZ.x&&!FZ.y)?'':'translate('+FZ.x.toFixed(1)+'px,'+FZ.y.toFixed(1)+'px) scale('+FZ.s.toFixed(4)+')';
 h.classList.toggle('gb-zoomed',FZ.s>1.001);}
function fzClamp(){var h=fzHost();if(!h)return;var W=h.clientWidth,H=h.clientHeight;
 FZ.x=Math.min(0,Math.max(W-W*FZ.s,FZ.x)); FZ.y=Math.min(0,Math.max(H-H*FZ.s,FZ.y));}
function fzAt(ns,px,py){ns=Math.max(1,Math.min(FZ_MAX,ns));
 var wx=(px-FZ.x)/FZ.s, wy=(py-FZ.y)/FZ.s;
 FZ.x=px-wx*ns; FZ.y=py-wy*ns; FZ.s=ns; fzClamp(); fzApply(); paint();}
function zoomBy(k){
 if(fzOn()){var h=fzHost();fzAt(FZ.s*k,h.clientWidth/2,h.clientHeight/2);}
 else setZoom(S.zoom*k,CW/2,CH/2);
 paint();}
function reframeNow(quiet){
 if(fzOn()){FZ={s:1,x:0,y:0};fzApply();}
 else{S.zoom=1;S.panx=0;S.pany=0;reframe();render();}
 paint();
 if(!quiet&&typeof status==='function')status(fzOn()
  ?'Reframed. Scroll on the picture to move in, drag to move it, F to come back.'
  :HOWTO_ZOOM_OUT);}
function fzWire(){
 var h=fzHost(); if(!h)return;
 /* the picture is rebuilt by innerHTML, so the move goes back on the new one */
 new MutationObserver(function(){fzApply();}).observe(h,{childList:true});
 h.addEventListener('wheel',function(e){if(!fzOn())return;e.preventDefault();
  var r=h.getBoundingClientRect();fzAt(FZ.s*(e.deltaY<0?1.12:1/1.12),e.clientX-r.left,e.clientY-r.top);},{passive:false});
 h.addEventListener('pointerdown',function(e){if(!fzOn()||FZ.s<=1.001||e.button!==0)return;
  FZDRAG={x:e.clientX,y:e.clientY,fx:FZ.x,fy:FZ.y};FZMOVED=false;});
 addEventListener('pointermove',function(e){if(!FZDRAG)return;
  var dx=e.clientX-FZDRAG.x,dy=e.clientY-FZDRAG.y;
  if(Math.abs(dx)+Math.abs(dy)>4)FZMOVED=true;
  if(FZMOVED){FZ.x=FZDRAG.fx+dx;FZ.y=FZDRAG.fy+dy;fzClamp();fzApply();h.classList.add('gb-drag');}});
 addEventListener('pointerup',function(){FZDRAG=null;h.classList.remove('gb-drag');});
 /* a drag that moved the picture is not also a press on whatever it ended on */
 h.addEventListener('click',function(e){if(FZMOVED){FZMOVED=false;e.stopPropagation();e.preventDefault();}},true);
 /* F, plus and minus. The Wheel's own handler already reads these on the
    Field; on Frames and Dial it would reframe a wheel nobody can see and say
    so, so these are caught first and answered for the picture that is up. */
 addEventListener('keydown',function(e){
  if(S.tab!==TAB.FIELD||!fzOn())return;
  var t=e.target&&e.target.tagName; if(t==='INPUT'||t==='TEXTAREA'||t==='SELECT')return;
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  var k=(e.key||'').toLowerCase(), done=true;
  if(k==='f')reframeNow(); else if(k==='+'||k==='=')zoomBy(1.25); else if(k==='-'||k==='_')zoomBy(1/1.25); else done=false;
  if(done){e.preventDefault();e.stopImmediatePropagation();}},true);}

/* ============================================================
   THE READINGS MOVE TO THE LEFT RAIL, IN THE CIRCLE SHAPE. His words:
   "now that we've got the circular one up here, all the buttons on the
   bottom don't make sense, so you should go on the left hand side, so this
   is more real estate."

   The dock itself moves, not a copy of it: the product's own renderers keep
   writing CQ, DQ, SQ, the four that move through a person and accuracy into
   the same elements, with the same doors, and only where they sit and the
   shape they are drawn in changes. The rings are drawn at their own small
   size, so each is given a viewBox and scaled up to the circle, with its
   stroke set back to the circle's weight.

   CQ AND DQ, A PAIR. "Lining those up so they don't look like a design
   element that's not quite designed right, but has a symmetry, and I do
   want the CQ number bigger, so it's in your face." CQ is the large circle
   in the middle, DQ and SQ stand either side of it at one size on one
   centre line, and the CQ figure is the largest number in the rail.
   ============================================================ */
function dockFix(){var d=document.getElementById('gb-dock');if(!d)return;
 d.querySelectorAll('svg.arc').forEach(function(sv){
  if(sv.getAttribute('viewBox'))return;
  var bx=+sv.getAttribute('width')||24;
  sv.setAttribute('viewBox','0 0 '+bx+' '+bx);
  var hero=!!sv.closest('[data-q=cq]'), px=hero?72:44, want=hero?4:2.8;
  sv.querySelectorAll('circle').forEach(function(c){c.setAttribute('stroke-width',(want*bx/px).toFixed(2));});});}
function moveDock(){
 var fd=document.getElementById('fdock'); if(!fd)return;
 var left=document.querySelector('.mid > .col .panel'); if(!left)return;
 var w=document.createElement('div'); w.id='gb-dock'; w.className='gb-dock';
 w.setAttribute('role','group'); w.setAttribute('aria-label','Readings');
 w.appendChild(fd); left.insertBefore(w,left.firstChild);
 new MutationObserver(dockFix).observe(w,{childList:true,subtree:true});
 dockFix();}

function darkUnder(e){var rgb=null;
 while(e&&e.nodeType===1){var m=getComputedStyle(e).backgroundColor.match(/[\d.]+/g);
  if(m&&(m.length<4||+m[3]>=0.4)){rgb=m.slice(0,3).map(Number);break;}
  e=e.parentNode;}
 if(!rgb)rgb=[16,16,16];
 return (0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2])/255<0.5;}
function tone(){
 var dark=darkUnder(document.querySelector('.stage'));
 [BAR,PANEL,MENU].forEach(function(x){if(!x)return;x.classList.toggle('gb-dk',dark);x.classList.toggle('gb-lt',!dark);});
 /* the renditions row takes the tone of wherever it is sitting, the rail's
    panel or the bar, which under Snow are opposite grounds */
 if(RREND){var d2=darkUnder(RREND.parentNode);RREND.classList.toggle('gb-dk',d2);RREND.classList.toggle('gb-lt',!d2);}}
function mount(){
 if(BAR)return;
 patchWheel(); patchRings();
 /* the ladder becomes geometry. effView was the depth plus what zoom
    reached; it is now the depth the visible set needs room for. */
 window.effView=geomDepth;
 /* the reduced motion cache has to miss when a layer changes */
 var ds=drawSig; window.drawSig=function(r){var s=ds(r);return s===null?null:s+'|'+sig();};
 var sz=setZoom; window.setZoom=function(z,ax,ay){sz(z,ax,ay);applyRend();paint();};
 var fs=fviewSet; window.fviewSet=function(k){fs(k);FR_SIG=null;applyRend();paint();render();};
 FR_SIG=null;
 /* the rings read the same reading the render just took, not a second one */
 var cp=compute; window.compute=function(){var r=cp.apply(this,arguments);LASTR=r;return r;};
 var rn=render; window.render=function(){var x=rn.apply(this,arguments);queueVals();return x;};
 document.body.classList.add('gb');
 build(); placeRend(); opts(); fzWire(); moveDock();
 /* a rendition switch starts that picture whole */
 var fs2=window.fviewSet; window.fviewSet=function(k){FZ={s:1,x:0,y:0};document.body.classList.toggle('gb-fv-frames',k==='frames');
  fs2(k);if(typeof layout==='function')layout();};
 fvClass();
 if(typeof layout==='function')layout();
 var sl=setLighting; window.setLighting=function(k){sl(k);tone();};
 fitFold(); tone(); apply();
 window.addEventListener('resize',function(){fitFold();openPanel(false);openMenu(false);});}

return {mount:mount,PV:PV,ON:function(){return ON;},set:function(k,v){if(v)ON[k]=1;else delete ON[k];unpinHidden();apply();},
 preset:function(i){ON=preset(i);S.view=i;S.pin=null;apply();},opt:function(o,v){OPT[o]=v;fitFold();apply();},zoom:function(){return fzNow();},vals:function(){return VALS;},
 LAYERS:LAYERS,geomDepth:geomDepth,visible:visible};
})();
window.PV=function(k){return GB.PV(k);};
