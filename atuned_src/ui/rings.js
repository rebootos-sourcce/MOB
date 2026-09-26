
/* ============================================================
   THE FIELD, DRAWN TWO MORE WAYS, AND THE SWITCH BETWEEN THEM.
   Ruled 25 September, BP8 in TASKS.md.

   His words: "I really like nested frames. You don't need to zoom, you can
   see everything. Let me see that dial with callouts too... do that in the
   app itself." The art team built four renditions of the Field as static
   pictures in proto/field-rings, each drawn from James's reading as
   capture.js took it off the live build. He picked two. They are ported
   here and they read the live reading, so a person looks at their own field
   and not at a snapshot of somebody else's.

   PORTED, NOT REBUILT. The geometry is kit.js, the two compositions are
   nested-frames.html and dial-with-callouts.html, and their tables of depths
   and radii are carried over unchanged. Four things had to move, and each
   was forced by something measured rather than preferred.

   THE DATA. The mockup read window.FIELD, a snapshot. Every field of it is
   read here from the engine call capture.js took it from, so each number
   has the same source the rail and the wheel read.

   THE BOX. The mockups drew on the whole stage with the depth bar and the
   compass lane cleared away. Here the picture takes the wheel's own cell, so
   all three are compared on one ground, and every depth scales with the
   box: at 390 the cell is 374 across and the mockup's depths run 248 pixels
   in from each side, which is past the middle.

   THE WORDS. Every mark in the mockup carried a native tooltip. The Field
   already has a readout and a drill for everything drawn on it, and two
   tooltips saying one thing two ways is one word per concept broken on the
   busiest surface in the product. So each mark carries the wheel's own hit
   record, and the wheel's readout and drills answer it, in ui/ui.js.

   THE GROUND. The mockup was drawn for Dark only, and the Field's ground is
   not what LIGHT() says it is under two lightings, measured: Snow keeps the
   ruled #101010 while LIGHT() reports light, and Glass white lays a white
   stage while LIGHT() reports dark. The wheel is drawn off LIGHT() and loses
   its ring under both. Ink and palette here are chosen off the stage's own
   computed ground, which is the thing the marks actually sit on.

   AND ONE DEFECT IN THE MOCKUP, found in the port and not carried into it.
   Its stories layer read the atom key as a position in the address list,
   and atomIndex keys by address id, which runs one ahead of the position.
   Every story mark was drawn one address clockwise of its own and named the
   wrong address. Measured on James: the atom that belongs to Addiction was
   drawn at Lust. The key is looked up by id here.
   ============================================================ */

/* ---- which picture the Field shows ----
   THREE AND NOT TWO. He asked to switch between the two he picked. The wheel
   is the third because it is the Field as it ships: the drag that sets a
   charge, the zoom and the depth ladder live only on it, and every Field
   check in tests/ is measured on it. Retiring it is a ruling he has not
   made, so it stays the default, and a person who has never pressed this
   sees exactly what shipped. */
const FVIEWS=[
 {k:'wheel',nm:'Wheel',
  ic:'<circle cx="12" cy="12" r="2.8"/><path d="M12 2.6v3.6M12 17.8v3.6M2.6 12h3.6M17.8 12h3.6'
   +'M5.35 5.35l2.55 2.55M16.1 16.1l2.55 2.55M18.65 5.35L16.1 7.9M7.9 16.1l-2.55 2.55"/>',
  tip:'One ring, read by depth. The bar above adds a layer at a time and scrolling on the ring adds more.'},
 {k:'frames',nm:'Frames',
  ic:'<rect x="3.2" y="4.2" width="17.6" height="15.6" rx="3"/><rect x="7.4" y="8.4" width="9.2" height="7.2" rx="1.8"/>'
   +'<circle cx="12" cy="12" r="1.2"/>',
  tip:'Every ring drawn as a frame inside the last, with all of them showing at once.'},
 {k:'dial',nm:'Dial',
  ic:'<circle cx="10.4" cy="13.6" r="7.4"/><circle cx="10.4" cy="13.6" r="2.2"/><path d="M15.6 8.4L18.2 5.8H22"/>',
  tip:'The ring at full size with every layer showing, and the heaviest few named beside their marks.'}];
var FVIEW='wheel';
/* KEPT THE WAY DENSITY IS KEPT: one key in the store and nothing on the
   profile, because it is how this person likes to look and not a reading
   about them. A name this build does not know reads as the wheel, since a
   stored value outlives a renamed view and nothing must come back blank. */
function fviewGet(){
 try{var v=STORE.get('fview')||'';
  return FVIEWS.some(function(f){return f.k===v;})?v:'wheel';}
 catch(e){return 'wheel';}}
function fviewOn(){return FVIEW!=='wheel';}
function fviewSet(k){
 if(!FVIEWS.some(function(f){return f.k===k;}))k='wheel';
 FVIEW=k;
 try{STORE.set('fview',k);}catch(e){}
 S.pin=null; FR_SIG=null;
 fviewPaint(S.tab);
 /* THE CANVAS IS MEASURED THE MOMENT IT IS VISIBLE, setTab's own lesson.
    Hidden behind a rendition it measured nothing, so the first wheel drawn
    on the way back would be laid out for a box of zero by zero. setTab
    measures after its tab class lands, which is why this is here and not in
    fviewPaint: called from setTab it would measure a canvas still hidden. */
 if(S.tab===TAB.FIELD&&!fviewOn()&&typeof layout==='function')layout();
 render();}
/* WHICH PARTS SHOW, decided in one place. The wheel and its depth bar are one
   pair and a rendition and its layer row are the other, and only one pair is
   ever up. The depth bar sets how much of the wheel is drawn, and pressed
   over a picture that already draws every layer it would do nothing, which
   is a dead control. setTab calls this rather than showing the canvas
   itself, because two writers for one display is how a surface ends up
   showing two pictures. */
function fviewPaint(tab){
 var on=(tab===TAB.FIELD), ring=fviewOn();
 var show=function(id,how){var e=document.getElementById(id); if(e)e.style.display=how;};
 show('cv',on&&!ring?'block':'none');
 show('vbar',on&&!ring?'flex':'none');
 show('frend',on&&ring?'block':'none');
 show('flay',on&&ring?'flex':'none');
 var sw=document.getElementById('fview');
 if(sw)sw.querySelectorAll('[data-fview]').forEach(function(b){
  b.setAttribute('aria-pressed',b.getAttribute('data-fview')===FVIEW);});
 var fr=document.getElementById('frend');
 if(fr)fr.setAttribute('aria-label','The Field, drawn as '+(FVIEW==='dial'?'a dial':'nested frames')
  +'. Every element is also listed in the panels either side.');}

/* ---- the layers, in the order the rings sit, outside first ----
   One row, so the row is the legend and the legend is the control, which is
   what BA8 asked for and the mockup's own argument for it. Every icon is the
   mockup's, drawn on the product's 24 unit grid in the mark its ring uses. */
function frSegRing(n,r,gapDeg){var d='',g=gapDeg/360*TAU,step=TAU/n;
 for(var i=0;i<n;i++){var a0=-Math.PI/2+i*step+g/2;d+=frArcD(12,12,r,a0,a0+step-g);}return d;}
function frTicks(n,r0,r1,lens){var d='';
 for(var i=0;i<n;i++){var a=-Math.PI/2+i/n*TAU,l=lens?lens[i%lens.length]:1;
  d+='M'+(12+Math.cos(a)*r0).toFixed(2)+' '+(12+Math.sin(a)*r0).toFixed(2)
   +'L'+(12+Math.cos(a)*(r0+(r1-r0)*l)).toFixed(2)+' '+(12+Math.sin(a)*(r0+(r1-r0)*l)).toFixed(2);}
 return d;}
function frCirc(x,y,r){return 'M'+(x-r)+' '+y+'a'+r+' '+r+' 0 1 0 '+(2*r)+' 0a'+r+' '+r+' 0 1 0 '+(-2*r)+' 0';}
const FLAYS=[
 {k:'domains',nm:'Domains',d:frSegRing(5,8.6,20),
  tip:'The nineteen blueprint domains, what was there before any of it.'},
 {k:'addresses',nm:'Addresses',d:frCirc(12,12,4.2)+frTicks(8,7,10.4),
  tip:'Your 112 addresses. Each mark is the charge held at one place.'},
 {k:'stories',nm:'Stories',d:frCirc(12,12,2.6)+'M12 9V4.4M14.6 13.5l4 2.3M9.4 13.5l-4 2.3'
   +frCirc(12,3.4,1.1)+frCirc(19.4,16.2,1.1)+frCirc(4.6,16.2,1.1),
  tip:'One line for each story that put charge on an address.'},
 {k:'masks',nm:'Masks',d:'M4.5 8.5C4.5 6.4 8 5 12 5s7.5 1.4 7.5 3.5c0 5.6-3.4 10.5-7.5 10.5S4.5 14.1 4.5 8.5zM8.2 10.3h2.6M13.2 10.3h2.6',
  tip:'The six masks, each at its weight.'},
 {k:'archetypes',nm:'Archetypes',d:'M12 3.8l2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.6-5.1 2.6 1-5.6-4-3.9 5.6-.8z',
  tip:'The twelve, each set in the seat it runs through.'},
 {k:'patterns',nm:'Patterns',d:frCirc(15.6,8.4,3.2)+'M13.3 10.7L5 19',
  tip:'The saboteurs running on the charge, threaded to the addresses that built them.'},
 {k:'chains',nm:'Chains',d:frCirc(5.4,18.6,1.6)+frCirc(11,13,2.3)+frCirc(17.4,6.6,3)+'M6.6 17.4l2.8-2.8M12.7 11.3l2.6-2.6',
  tip:'How a pattern compounds: complex, hyper complex, character, inward.'},
 {k:'laws',nm:'Laws',d:frCirc(12,12,2.4)+frTicks(7,5.2,10,[1,.6,.9,.45,.8,.55,.95]),
  tip:'The twenty one laws, set by seat. Their sum is the number at the centre.'},
 {k:'gates',nm:'Gates',d:frCirc(12,12,3.1)+'M12 8.9V3.6M9.6 6L12 3.6 14.4 6M12 15.1v5.3',
  tip:'The six gates round the core. Each higher gate sits across from the lower one it stands against.'},
 {sep:true},
 {k:'shadow',nm:'Shadow',d:frCirc(12,12,8.5)+'M7.2 16.6l3.4-3.4M10.2 19.2l6-6M14.6 19.9l4.6-4.6',
  tip:'The weight on all 112 addresses, as a wash behind everything.'}];
/* hidden layers. View state, like the depth and the pin, so it is not kept:
   the wheel's depth is not kept either, and a person reloading gets every
   layer back rather than a picture with pieces missing and no reason shown. */
var FLAY_OFF={};

/* The switch and the row are built here, once, the way the depth buttons are
   built in panels.js. getElementById and not $, because $ is a const in
   panels.js, which loads after this file, and reaching it here would throw
   at load and take every module after this one with it. */
(function(){
 var sw=document.getElementById('fview');
 if(sw)FVIEWS.forEach(function(f){
  var b=document.createElement('button'); b.type='button'; b.className='vt';
  b.setAttribute('data-fview',f.k); b.setAttribute('aria-pressed',f.k===FVIEW);
  /* the product's own tooltip, the way the depth buttons carry theirs, so a
     touch screen reaches the definition and not only a pointer */
  b.setAttribute('data-tip-t',f.nm); b.setAttribute('data-tip',f.tip);
  b.innerHTML=svgI(f.ic)+'<span class="n">'+f.nm+'</span>';
  b.addEventListener('click',function(){fviewSet(f.k);});
  sw.appendChild(b);});
 var row=document.getElementById('flay');
 if(row)FLAYS.forEach(function(t){
  if(t.sep){var s=document.createElement('span');s.className='lay-sep';row.appendChild(s);return;}
  var b=document.createElement('button'); b.type='button'; b.className='lay';
  b.setAttribute('aria-pressed','true'); b.setAttribute('data-lay',t.k);
  b.setAttribute('data-tip-t',t.nm); b.setAttribute('data-tip',t.tip);
  b.innerHTML='<span class="lay-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+t.d+'"/></svg></span>'
   +'<span class="lay-nm">'+t.nm+'</span>';
  /* A HIDDEN LAYER IS A CLASS ON THE HOST, NOT A REDRAW. Every mark and
     every word a layer draws sits in a group carrying that layer's class, so
     the sheet takes both off together and the picture is not rebuilt. */
  b.addEventListener('click',function(){
   var on=b.getAttribute('aria-pressed')!=='true';
   b.setAttribute('aria-pressed',String(on));
   if(on)delete FLAY_OFF[t.k]; else FLAY_OFF[t.k]=1;
   var fr=document.getElementById('frend'); if(fr)fr.classList.toggle('off-'+t.k,!on);});
  row.appendChild(b);});})();

/* ---- the geometry, kit.js ----
   Every ring is a superellipse, |x/a|^n + |y/b|^n = 1. n at 2 with a equal to
   b is a circle and n near 12 is the rectangle with its corners eased, so one
   family draws the frame, the dial and everything between. */
function frRing(cx,cy,a,b,n){
 var N=1440,P=[],i;
 var rAt=function(th){var c=Math.cos(th),s=Math.sin(th);
  return Math.pow(Math.pow(Math.abs(c/a),n)+Math.pow(Math.abs(s/b),n),-1/n);};
 for(i=0;i<N;i++){var t0=-Math.PI/2+i/N*TAU,r0=rAt(t0);P.push([cx+Math.cos(t0)*r0,cy+Math.sin(t0)*r0]);}
 var L=[0];for(i=1;i<=N;i++){var p=P[i%N],q=P[i-1];L.push(L[i-1]+Math.hypot(p[0]-q[0],p[1]-q[1]));}
 var R={cx:cx,cy:cy,len:L[N]};
 /* the point on this ring along a bearing from the centre, with the inward
    normal, which is the direction a mark stands off a flat edge */
 R.at=function(th){var r=rAt(th),e=.002;
  var x=cx+Math.cos(th)*r,y=cy+Math.sin(th)*r,r1=rAt(th+e),r0=rAt(th-e);
  var tx=(cx+Math.cos(th+e)*r1)-(cx+Math.cos(th-e)*r0),ty=(cy+Math.sin(th+e)*r1)-(cy+Math.sin(th-e)*r0);
  var m=Math.hypot(tx,ty)||1;return {x:x,y:y,r:r,nx:-ty/m,ny:tx/m,th:th};};
 /* the bearing at a share of the way round by length, so places spaced evenly
    along this ring can be carried inward to every other ring on their bearing */
 R.thAt=function(t){t=((t%1)+1)%1;var want=t*L[N],lo=0,hi=N;
  while(hi-lo>1){var mid=(lo+hi)>>1;if(L[mid]<=want)lo=mid;else hi=mid;}
  var f=(want-L[lo])/((L[lo+1]-L[lo])||1);return -Math.PI/2+(lo+f)/N*TAU;};
 /* the whole ring. Every second sample, because a hairline drawn from 1440
    points put 150 kilobytes of path into the document for a line a person
    cannot tell from one drawn with 720. */
 R.d=function(k){k=k||1;var s='';for(var j=0;j<N;j+=k)s+=(j?'L':'M')+P[j][0].toFixed(1)+' '+P[j][1].toFixed(1);return s+'Z';};
 /* the stretch of this ring between two bearings, clockwise */
 R.seg=function(th0,th1,steps){steps=steps||Math.max(4,Math.ceil((th1-th0)/TAU*360));var pts=[];
  for(var j=0;j<=steps;j++){var th=th0+(th1-th0)*j/steps,r=rAt(th);pts.push([cx+Math.cos(th)*r,cy+Math.sin(th)*r]);}
  return pts;};
 return R;}
/* THE RINGS ARE KEPT PER BOX. They depend on the box and never on the
   reading, and a slider dragged in the rail changes the reading every frame,
   so every frame of a drag sampled some twenty rings of 1440 points again.
   Kept until the box changes, which is the one thing that moves them. */
var FR_RINGS={},FR_BOX='';
function frRingC(cx,cy,a,b,n){var k=cx.toFixed(2)+'|'+cy.toFixed(2)+'|'+a.toFixed(2)+'|'+b.toFixed(2)+'|'+n;
 return FR_RINGS[k]||(FR_RINGS[k]=frRing(cx,cy,a,b,n));}
function frPolyD(pts,close){
 return 'M'+pts.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}).join('L')+(close?'Z':'');}
/* a band between two rings over a stretch of bearings */
function frBandD(outer,inner,th0,th1){
 return frPolyD(outer.seg(th0,th1).concat(inner.seg(th0,th1).reverse()),true);}
/* AN ARC THAT CLOSES IS TWO ARCS. SVG omits an arc whose two ends are the
   same point, which is the specification's own rule, so a coherence of 100,
   a whole ring, drew no ring at all. Measured on a radius of 40: the
   mockup's single arc for a full turn has a length of 0, and these two have
   251.36 against a circumference of 251.33. It never met the case because
   James reads 44. */
function frArcD(cx,cy,r,a0,a1){
 if(a1-a0>=TAU-1e-6)return frArcD(cx,cy,r,a0,a0+Math.PI)+frArcD(cx,cy,r,a0+Math.PI,a0+TAU).replace(/^M[^A]+/,'');
 var large=(a1-a0)%TAU>Math.PI?1:0;
 return 'M'+(cx+Math.cos(a0)*r).toFixed(2)+' '+(cy+Math.sin(a0)*r).toFixed(2)
  +'A'+r.toFixed(2)+' '+r.toFixed(2)+' 0 '+large+' 1 '+(cx+Math.cos(a1)*r).toFixed(2)+' '+(cy+Math.sin(a1)*r).toFixed(2);}
/* a quadratic from a to b whose middle is pulled toward the centre, so a
   thread between two rings bows inward the way the wheel's chords do */
function frBowD(a,b,cx,cy,pull){var mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
 return 'M'+a.x.toFixed(1)+' '+a.y.toFixed(1)+'Q'+(mx+(cx-mx)*pull).toFixed(1)+' '+(my+(cy-my)*pull).toFixed(1)
  +' '+b.x.toFixed(1)+' '+b.y.toFixed(1);}
function frTmean(ts){var x=0,y=0;ts.forEach(function(t){x+=Math.cos(t*TAU);y+=Math.sin(t*TAU);});
 return ((Math.atan2(y,x)/TAU)+1)%1;}
const frRgb=function(c){return 'rgb('+c.map(function(v){return Math.round(v);}).join(',')+')';};
/* a 24 unit stroked glyph at a size. Ring, never fill. A mark that is also a
   target carries a hit circle the size of its box, because a pointer has to
   find a two pixel line to find the thing otherwise. */
function frGlyph(ic,x,y,size,col,w,h){var s=size/24;
 return '<g'+(h!=null?' data-h="'+h+'"':'')+' transform="translate('+(x-size/2).toFixed(2)+' '+(y-size/2).toFixed(2)
  +') scale('+s.toFixed(4)+')" fill="none" stroke="'+col+'" stroke-width="'+(w/s).toFixed(2)
  +'" stroke-linecap="round" stroke-linejoin="round">'+glyphPath(ic)
  +(h!=null?'<circle cx="12" cy="12" r="13" fill="transparent" stroke="none"/>':'')+'</g>';}
/* a word over line work gets a halo of the ground behind it, the way a map
   sets a name over contours, so a thread crossing it cannot take a letter */
function frLabel(M,s,x,y,at){
 return '<text x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" stroke="'+frRgb(M.ground)+'" stroke-width="4"'
  +' stroke-linejoin="round" paint-order="stroke" '+at+'>'+esc(s)+'</text>';}
/* the width of a word as the canvas sets it in the same face, so a callout
   can be tested against the dial before it is drawn rather than after */
function frTextW(s,font){g.save();g.font=font;var w=g.measureText(s).width;g.restore();return w;}
/* laws and archetypes run through a seat, so each sits inside its seat's own
   stretch of the loop, spread evenly across it */
function frSpread(list,sector){var t=[];
 BANDS.forEach(function(b){var S0=sector[b];if(!S0)return;
  var mine=[];list.forEach(function(x,i){if(x.b===b)mine.push(i);});
  mine.forEach(function(i,k){t[i]=S0.t0+(k+.5)/mine.length*(S0.t1-S0.t0);});});
 return t;}
/* TENSION, from the wheel. A thread from an address to its pattern runs taut
   where the person is susceptible and hangs slack where they are not: the
   base bow times 1.28 less 0.62 of the tension, the wheel's own curve. */
function frSag(n,base){var t=clamp((((n&&n.susc)||1)-0.45)/0.85,0,1);return base*(1.28-0.62*t);}

/* ---- the mount. the ground, the window, the loop ----
   THE GATES GO ON AFTER THE CORE, as the wheel draws them. The mockup drew
   the core last, and its ground disc covered what came before it: measured
   on the dial at 1600, the upper left gate's pill hangs toward the centre
   and 11.6 pixels of it went under the core on every reference case. */
const FR_L=['shadow','ground','domains','stories','addresses','masks','archetypes','patterns','chains','laws','core','gates'];
const FR_T=['domains','addresses','archetypes','patterns','chains','laws','seats'];
/* a group that answers to a layer toggle takes that layer's class. The three
   that answer to none, the dial's engraving, the core and the seat marks, are
   drawn unclassed, because a class no rule mentions is one the design gate
   refuses by name */
const FR_CLS={ground:0,core:0,seats:0};
/* THE FOUR OUTSIDE THE BODY ARE HIDDEN HERE, AND ONLY HERE. Gaia Gateway,
   Earth Star, Sol Star and Stellar Gateway. These two renditions were the
   first surface on which they were ever drawn, as four open rings at the
   seam, and shown them the owner ruled on 26 September, CB in TASKS.md: "let's
   just hide it from the system, and if we need to come back to it at some
   point in time because of calculations aren't working, we will."

   HIDDEN FROM THE PICTURE, NOT FROM THE MATHS. The four stay in NODES and in
   FIELD, compute() still sets their SQ off the seat each one extends, and
   nothing that reads a reading changes. What this switches off is the slot
   each one took on the loop, so the loop closes on the 108 body addresses
   with no gap at the seam where the four stood. A gap would be the four
   drawn as an absence, which is still drawing them.

   TO BRING THEM BACK, set this true. The drawing for them was never removed:
   the s.field branches in frFrames and frDial, the 'anchor' hit record, and
   its readout in ui/ui.js all still run the moment a slot carries one. And
   tests/functional.js asserts they are absent, so it has to be turned with
   this, which is on purpose: a reversal should be a decision someone makes
   and not a side effect nobody sees. */
const FR_SHOW_OUTSIDE=false;
/* THE WINDOW'S FOOT. The host's own box, less a margin, and less the strip
   along the stage's foot where the lower pills and accuracy sit over this
   cell. The wheel is a circle and never reaches those corners. A frame fills
   its rectangle, so it would run underneath them. Measured rather than
   assumed, because on a phone both are in flow and take nothing, and read
   every frame into the signature, because the picture is built from it:
   measured on four reference cases, the foot moved after a picture was built
   and every bearing on the frame's top edge drew a tenth of a pixel off. */
function frFoot(host,H_,pad){
 var y1=H_-pad,hb=host.getBoundingClientRect();
 ['keylo','acc'].forEach(function(id){var e=document.getElementById(id);if(!e)return;
  if(getComputedStyle(e).position!=='absolute')return;
  var b=e.getBoundingClientRect();if(!b.width||!b.height)return;
  if(b.right<=hb.left||b.left>=hb.right||b.bottom<=hb.top||b.top>=hb.bottom)return;
  var top=b.top-hb.top;if(top<H_/2)return;
  y1=Math.min(y1,top-pad);});
 return y1;}
function frMount(host,W_,H_,r){
 var M={W:W_,H:H_,L:{},T:{},defs:[],hit:[]};
 FR_L.forEach(function(k){M.L[k]=[];});
 FR_T.forEach(function(k){M.T[k]=[];});
 M.hid=function(h){M.hit.push(h);return M.hit.length-1;};
 /* THE GROUND IS READ OFF THE STAGE, not off LIGHT(). The two disagree under
    Snow and under Glass white, measured, and the marks sit on the stage. */
 var st=document.getElementById('stage'),bgc=st?getComputedStyle(st).backgroundColor:'';
 var m=/rgba?\(([^)]+)\)/.exec(bgc||''),c=[16,16,16];
 if(m){var v=m[1].split(',').map(parseFloat);if(v.length>=3&&v.slice(0,3).every(isFinite))c=v.slice(0,3);}
 M.ground=c.map(Math.round);
 M.light=(0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255>0.5;
 M.ink=M.light?[22,23,28]:[239,237,232];
 M.dim=mixc(M.ink,M.ground,.4);
 M.accent=hx(M.light?'#2F6E92':'#7EB8D4');
 var P=S.theme==='lumen'?PAL_VIVID:(M.light?PAL_LIGHT:PAL);
 M.seat=function(b){return hx(P[b]||PAL[b]||'#7EB8D4');};
 /* THE SHADOW'S OWN COLOUR, for DQ where it shares the core with coherence.
    The Root washed 45 percent toward slate, which is nodeCol's grammar for a
    light charge and on Dark lands exactly on CE's #B9757B: weight, and not the
    full Root red the compass paints its lower half in, so it does not read as
    an alarm beside the tier's colour. On a light ground the slate it washes
    toward is darkened, because washing toward the pale one took it toward the
    paper it sits on. */
 M.dq=mixc(M.seat('Root'),M.light?[90,96,110]:[150,160,180],.45);
 /* nodeCol from ui/component.js, keyed on the same ground: a light address
    is its seat washed toward slate and takes its full hue as charge comes up */
 M.nodeCol=function(b,sq){var base=M.seat(b),ld=clamp(sq/10,0,1);
  return mixc(mixc(base,M.light?[238,236,230]:[150,160,180],.74),base,Math.pow(ld,.55));};
 var pad=8,w={x0:pad,y0:pad,x1:W_-pad,y1:frFoot(host,H_,pad)};
 w.cx=(w.x0+w.x1)/2;w.cy=(w.y0+w.y1)/2;w.a=(w.x1-w.x0)/2;w.b=(w.y1-w.y0)/2;
 M.win=w;
 /* THE LOOP. 112 places, the seam at twelve o'clock, clockwise from the root
    to the crown as the wheel runs. The four outside the body sit at the seam
    because that is where the loop closes: below the root on the root side,
    above the crown on the crown side. Found by name and never by position in
    FIELD, which is the rule this repository keeps for every table. While
    FR_SHOW_OUTSIDE is off, fld answers null for all four and the filter that
    already stood here for a missing name takes them out of the loop. */
 var byK={};FIELD.forEach(function(n){byK[n.k]=n;});
 var fld=function(k){return FR_SHOW_OUTSIDE&&byK[k]?{field:true,n:byK[k]}:null;};
 var slots=[fld('Gaia Gateway'),fld('Earth Star')].filter(Boolean)
  .concat(W.map(function(n){return {field:false,n:n};}))
  .concat([fld('Sol Star'),fld('Stellar Gateway')].filter(Boolean));
 M.N=slots.length;M.slotByI={};
 slots.forEach(function(s,i){s.s=i;s.t=(i+.5)/M.N;M.slotByI[s.n.i]=s;});
 M.slots=slots;M.sector={};
 BANDS.forEach(function(b){var ss=slots.filter(function(s){return !s.field&&s.n.b===b;});
  if(!ss.length)return;
  M.sector[b]={t0:ss[0].s/M.N,t1:(ss[ss.length-1].s+1)/M.N,n:ss.length,
   tm:(ss[0].s+ss[ss.length-1].s+1)/2/M.N};});
 /* everything inside the loop takes its place from the loop. A pattern sits
    over the addresses that built it and a chain over its parts, found by
    identity, because two saboteurs can share a name and a name would thread
    a chain to the wrong bead */
 var tOf=function(n){var s=M.slotByI[n.i];return s?s.t:0;};
 var ix=function(list){var mp=new Map();list.forEach(function(o,i){mp.set(o,i);});return mp;};
 var mean=function(ts){ts=ts.filter(function(t){return t!=null&&isFinite(t);});return ts.length?frTmean(ts):0;};
 M.ixSab=ix(r.sabs);M.ixCx=ix(r.cxs);M.ixHy=ix(r.hys);
 M.tSab=r.sabs.map(function(s){return mean(s.parts.map(tOf));});
 M.tCx=r.cxs.map(function(c){return mean(c.parts.map(function(p){return M.tSab[M.ixSab.get(p)];}));});
 M.tHy=r.hys.map(function(c){return mean(c.parts.map(function(p){return M.tCx[M.ixCx.get(p)];}));});
 M.tSup=r.sups.map(function(c){return mean(c.parts.map(function(p){return M.tHy[M.ixHy.get(p)];}));});
 M.tLaw=frSpread(SI,M.sector);M.tArch=frSpread(ARCH,M.sector);
 return M;}
function frSvg(M){
 var s='<svg class="frsvg" width="'+M.W+'" height="'+M.H+'" viewBox="0 0 '+M.W+' '+M.H+'" aria-hidden="true">'
  +'<defs>'+M.defs.join('')+'</defs>';
 var grp=function(k,list){return (k in FR_CLS)?'<g>'+list.join('')+'</g>':'<g class="L-'+k+'">'+list.join('')+'</g>';};
 FR_L.forEach(function(k){s+=grp(k,M.L[k]);});
 /* the words ride on top of every mark, in their layer's class, so a hidden
    layer takes its words with it */
 FR_T.forEach(function(k){s+=grp(k,M.T[k]);});
 /* and the dial's callouts ride on top of the words, still in their layer's
    class. Inside the ring a callout sits over other layers' glyphs, and in
    its own layer's word group the archetype glyphs, drawn after the address
    words, went straight through "Heart. SQ 6.2" on James at 390 */
 FR_T.forEach(function(k){if(M.C&&M.C[k])s+=grp(k,M.C[k]);});
 return s+'</svg>';}

/* ---- the shared parts, the same in both ---- */
/* THE SHADOW WASH, drawAura in ui/wheel.js redrawn inside the picture. Four
   soft pools, the darkest seat and the root, at a density read off DQ over
   its own 100. */
function frShadow(M,r,o){o=o||{};
 var dens=clamp((+r.DQ||0)/100,0,1);
 var lead=M.seat(r.darkB||'Sacral'),warm=r.benign===false?M.seat('Root'):M.seat('Heart');
 var at=o.at||[[.13,.24],[.92,.25],[.09,.83],[.91,.84]],reach=o.reach||1,col=[lead,warm,warm,lead],pools='';
 at.forEach(function(p,i){var id='frsh'+i,c=frRgb(col[i%4]);
  M.defs.push('<radialGradient id="'+id+'" cx="'+(p[0]*M.W).toFixed(1)+'" cy="'+(p[1]*M.H).toFixed(1)
   +'" r="'+(Math.max(M.W,M.H)*(.30+dens*.30)*reach).toFixed(1)+'" gradientUnits="userSpaceOnUse">'
   +'<stop offset="0" stop-color="'+c+'" stop-opacity="'+(.03+.20*dens).toFixed(3)+'"/>'
   +'<stop offset="1" stop-color="'+c+'" stop-opacity="0"/></radialGradient>');
  pools+='<rect x="0" y="0" width="'+M.W+'" height="'+M.H+'" fill="url(#'+id+')"/>';});
 /* THE WASH FADES OUT BEFORE THE EDGE OF THE CELL. The mockup's wash ran
    under the whole stage, so it ended at the stage's own rounded border and
    nobody saw it end. Here the picture has the wheel's cell, and a pool cut
    off by the cell's side drew the cell as a rectangle: measured on James
    under nested frames, the ground stepped from 16 to 28 in one pixel down
    both sides and along the top. Forty pixels of fade on every side, as two
    masks, one across and one down, because one gradient cannot fade both. */
 var e=40,fade=function(id,len,x2,y2){var f=Math.min(.45,e/Math.max(1,len));
  return '<linearGradient id="'+id+'g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="'+x2+'" y2="'+y2+'">'
   +'<stop offset="0" stop-color="#000"/><stop offset="'+f.toFixed(3)+'" stop-color="#fff"/>'
   +'<stop offset="'+(1-f).toFixed(3)+'" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>'
   +'<mask id="'+id+'" maskUnits="userSpaceOnUse" x="0" y="0" width="'+M.W+'" height="'+M.H+'">'
   +'<rect x="0" y="0" width="'+M.W+'" height="'+M.H+'" fill="url(#'+id+'g)"/></mask>';};
 M.defs.push(fade('frfx',M.W,M.W,0),fade('frfy',M.H,0,M.H));
 M.L.shadow.push('<g mask="url(#frfx)"><g mask="url(#frfy)">'+pools+'</g></g>');}
/* THE CORE. The product's own ring grammar at hero size, carrying both
   quotients on the one ring. Ruled 26 September, CH in TASKS.md, picking A
   off the CE sheet: "for coherence, for CQ and DQ, A looks great."
   Coherence runs clockwise from twelve in the tier's colour and the shadow
   runs anticlockwise from twelve in its own, so one coming down as the other
   goes up is drawn and not only printed.

   HIS PICK OVER THE ROUND'S OWN RECOMMENDATION, SAID RATHER THAN SWAPPED. CE
   recommended two rings, because the two are not shares of one whole: CQ is
   the 21 laws alone and DQ is the weight on the 112 addresses, so the stretch
   of ring between the two ends stands for nothing, 22 points of it on James.
   He saw that caption and picked A. Past 100 together the two arcs meet and
   run over each other, and coherence is drawn second so it is the one on top.

   THE LABELS ARE THE LETTERS. His words: "we don't need the word shadow ...
   and for coherence just put CQ." He asked for SQ beside the shadow figure,
   and SQ is a different reading in this product: the charge at one address,
   out of 10, which the strip directly above prints as SQ beside this figure
   printed as DQ. Two letters on two readings is what one word per concept
   forbids, so it says DQ, which is the strip's label for this same number and
   the one he used for it in the same sentence. Flagged back to him.

   THE SWING CAME OFF. "Let's take that highlight off the circle, because it's
   adding noise." A thinner, paler arc rode the ring's outside edge over the
   median range, cqRange, and on A it lay across the two arcs as a third mark
   on one ring. The range is not lost: the compass draws it as the pill beside
   its own needle, off the same arithmetic.

   NOTHING IS PRINTED OFF THE DEFAULTS. On an unread field the ring is empty
   and the figure is a dash, which is what the key pill directly above says in
   the same state. */
function frCore(M,r,cx,cy,R,o){
 var w=o.w,un=!!r.unread,f=clamp(r.CQ/100,0,1),fd=clamp((+r.DQ||0)/100,0,1);
 var col=un?M.dim:hx((typeof TIERCOL!=='undefined'&&TIERCOL[r.tier])||(M.light?'#2F6E92':'#7EB8D4'));
 var s='<g data-h="'+M.hid({k:'core'})+'">'
  +'<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="'+(R+w/2+o.halo).toFixed(1)+'" fill="'+frRgb(M.ground)+'"/>'
  +'<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="'+R.toFixed(1)+'" fill="none" stroke="rgba(128,128,128,.22)" stroke-width="'+w+'"/>';
 if(!un&&fd>0)s+='<path d="'+frArcD(cx,cy,R,-Math.PI/2-TAU*fd,-Math.PI/2)+'" fill="none" stroke="'+frRgb(M.dq)
  +'" stroke-width="'+w+'" stroke-linecap="round"/>';
 if(!un&&f>0)s+='<path d="'+frArcD(cx,cy,R,-Math.PI/2,-Math.PI/2+TAU*f)+'" fill="none" stroke="'+frRgb(col)
  +'" stroke-width="'+w+'" stroke-linecap="round"/>';
 var t=function(y,fill,size,wt,str,at){return '<text x="'+cx.toFixed(1)+'" y="'+y.toFixed(1)+'" text-anchor="middle" fill="'
  +fill+'" font-size="'+size.toFixed(1)+'" font-weight="'+wt+'"'+(at||'')+'>'+str+'</text>';};
 if(un){var cu=o.fs*.727;
  M.L.core.push(s+t(cy+cu/2,frRgb(col),o.fs,300,'\u2013',' letter-spacing="-0.02em"')+'</g>');return;}
 var cq=String(Math.round(r.CQ)),dq=String(Math.round(+r.DQ||0)),lab=11;
 var FC=cq.length>2?cq:'88',FD=dq.length>2?dq:'88';
 var W_=function(str,size,wt){return frTextW(str,wt+' '+size.toFixed(1)+'px Inter, system-ui, sans-serif');};
 /* THE TYPE IS FITTED TO THE HOLE, NOT TO A TABLE. The ring's inside runs
    from 22 pixels of radius on a phone to 57 on a wide screen, and two figures
    and two labels set for the wide one ran onto the ring on the phone. Each
    layout is tried at falling sizes and the first whose every line clears the
    ring's inside edge is drawn: the stack from CE's sheet where there is room,
    each figure on one line with its letters where there is not. The letters
    hold at eleven, which is the product's floor, and only the figures give.

    AND IT IS FITTED TO THE WIDEST TWO DIGIT FIGURE, 88, never to the two on
    screen. Fitted to its own, a person whose DQ was one digit got a coherence
    figure set larger than a person whose DQ was two: measured at 390 on
    Frames, Sofia's 73 at 22.8 pixels beside James's 44 at 19.4, so the size of
    one reading moved with the other. Fitted to 100, the one figure the core
    almost never prints, it set everybody's coherence at 13.7 on a phone,
    under three pixels above its own letters. So a figure of 100 is fitted as
    itself and is the only one that sets smaller.

    THE STACK IS KEPT ONLY WHILE IT HOLDS FOUR FIFTHS OF ITS SIZE. Past that
    the figures are one line each from full size, because a stack shrunk to
    fit is a coherence figure that no longer reads as the largest thing on
    the Field. */
 var inner=R-w/2-3,fits=function(rows){var H=0;rows.forEach(function(q){H+=q.h+(q.g||0);});
  var y=-H/2,ok=true;rows.forEach(function(q){var y0=y,y1=y+q.h,ym=Math.max(Math.abs(y0),Math.abs(y1));
   if(ym>=inner||q.w/2>Math.sqrt(inner*inner-ym*ym))ok=false;y=y1+(q.g||0);});return ok?H:0;};
 var F1=Math.max(22,38*inner/45),F2=Math.max(13,17*inner/45),lc=lab*.727,k,f1,f2,H;
 for(k=1;k>=.79;k-=.05){f1=F1*k;f2=Math.max(lab,F2*k);
  var g1=Math.max(4,6*inner/45),g2=Math.max(7,11*inner/45);
  H=fits([{h:f1*.727,w:W_(FC,f1,300),g:g1},{h:lc,w:W_('CQ',lab,500),g:g2},{h:f2*.727,w:W_(FD,f2,500)+4+W_('DQ',lab,500)}]);
  if(H){var y0=cy-H/2,ry=y0+f1*.727+g1+lc+g2/2+.5;
   s+=t(y0+f1*.727,frRgb(col),f1,300,cq,' letter-spacing="-0.02em"')
    +t(y0+f1*.727+g1+lc,frRgb(M.dim),lab,500,'CQ')
    +'<line x1="'+(cx-12).toFixed(1)+'" y1="'+ry.toFixed(1)+'" x2="'+(cx+12).toFixed(1)+'" y2="'+ry.toFixed(1)+'" stroke="'+rgba(M.ink,.16)+'" stroke-width="1"/>'
    +'<text x="'+cx.toFixed(1)+'" y="'+(y0+H).toFixed(1)+'" text-anchor="middle">'
    +'<tspan fill="'+frRgb(M.dq)+'" font-size="'+f2.toFixed(1)+'" font-weight="500">'+dq+'</tspan>'
    +'<tspan fill="'+frRgb(M.dim)+'" font-size="'+lab+'" font-weight="500" dx="4">DQ</tspan></text>';
   M.L.core.push(s+'</g>');return;}}
 for(k=1;k>=.4;k-=.05){f1=Math.max(lab+2,F1*k);f2=Math.max(lab,F2*k);
  H=fits([{h:f1*.727,w:W_(FC,f1,300)+4+W_('CQ',lab,500),g:6},{h:f2*.727,w:W_(FD,f2,500)+4+W_('DQ',lab,500)}]);
  if(H)break;}
 if(!H)H=f1*.727+6+f2*.727;
 var y1=cy-H/2+f1*.727,y2=cy+H/2,row=function(y,n,c,size,wt){return '<text x="'+cx.toFixed(1)+'" y="'+y.toFixed(1)+'" text-anchor="middle">'
  +'<tspan fill="'+c+'" font-size="'+size.toFixed(1)+'" font-weight="'+wt+'">'+n.v+'</tspan>'
  +'<tspan fill="'+frRgb(M.dim)+'" font-size="'+lab+'" font-weight="500" dx="4">'+n.l+'</tspan></text>';};
 s+=row(y1,{v:cq,l:'CQ'},frRgb(col),f1,300)+row(y2,{v:dq,l:'DQ'},frRgb(M.dq),f2,500);
 M.L.core.push(s+'</g>');}
/* THE SIX GATES AS A COLLAR. Ruled 26 September, CH in TASKS.md: "for the
   six gates I like three", the third on the CE sheet and the round's own
   recommendation. They stood as two rows of three, one above the core and one
   below, which he had already refused: "do not stack the six above the
   centre, they're in opposition." Here each gate has a sector of the core's
   own rim, on the bearing directly across from the gate it stands against,
   awareness against ignorance, detachment against attachment, intention
   against aversion. Each fill is that gate's share of its pair and grows from
   the middle of its sector, so the two ends of one diameter read as a balance
   and not as two clocks.

   THE PERCENT GOES IN A PILL TO THE LOWER RIGHT OF THE ICON. His words, with
   the reach he gave it: "instead of the percent being above the number, I
   want it in the pill, to the lower right of the icon. That should be a
   standard language for everything that we do." CE's sheet set each figure
   bare beyond its glyph. The pill here is the one the gates already carried:
   11 pixels, as wide as its figure, the gate's colour once a story has run
   through it and a dash on a grey pill until one has.

   THE PILL IS WHAT SETS HOW FAR OUT A GATE SITS. A pill hanging to the lower
   right points back at the core from the two gates on the left, and at the
   collar's base radius it lay across its own sector and onto the ring:
   worked by hand on the dial at 390, the lower left pill came within 33
   pixels of the centre against a collar edge at 42. So each gate is carried
   out along its own bearing until its pill clears the collar, which moves the
   two left hand gates further than the four others and leaves every sector on
   the rim where it is. */
const FR_GATE_AT={intent:-150,aware:-90,detach:-30,averse:30,ignore:90,attach:150};
const FR_GATE_VS={aware:'ignore',ignore:'aware',detach:'attach',attach:'detach',intent:'averse',averse:'intent'};
function frCollar(M,cx,cy,edge,sm){
 var G=frGates(),V=G.hi.concat(G.lo),by={};V.forEach(function(v){by[v.k]=v;});
 var rc=edge+(sm?3:4),wc=sm?3:4,span=46*Math.PI/180,gz=sm?11:13,Rg=gz/2+3,ph=15,clear=rc+wc/2+2;
 V.forEach(function(v){var t=(FR_GATE_AT[v.k]||0)*Math.PI/180,ev=G.ev,c=M.seat(v.side==='higher'?'Heart':'Root');
  var o=by[FR_GATE_VS[v.k]],sum=v.pct+(o?o.pct:0),f=ev&&sum>0?v.pct/sum:0;
  var pw=G.pw(v),ct=Math.cos(t),st=Math.sin(t),gr=rc+wc/2+Rg+3,gx,gy,px,py;
  for(var n=0;n<200;n++){gx=cx+ct*gr;gy=cy+st*gr;px=gx+Rg-4;py=gy+Rg-7;
   var nx=Math.max(px,Math.min(cx,px+pw)),ny=Math.max(py,Math.min(cy,py+ph));
   if(Math.hypot(nx-cx,ny-cy)>=clear)break;gr+=.5;}
  /* the ground disc goes first, because it is the gate's own place and the
     threads crossing under the glyph would otherwise take its strokes */
  var s='<g data-h="'+M.hid({k:'gate',v:v})+'">'
   +'<circle cx="'+gx.toFixed(1)+'" cy="'+gy.toFixed(1)+'" r="'+Rg.toFixed(1)+'" fill="'+frRgb(M.ground)+'"/>'
   +'<path d="'+frArcD(cx,cy,rc,t-span/2,t+span/2)+'" fill="none" stroke="'+rgba(c,ev?.18:.30)+'" stroke-width="'+wc+'"/>';
  if(f>0)s+='<path d="'+frArcD(cx,cy,rc,t-span/2*f,t+span/2*f)+'" fill="none" stroke="'+rgba(c,.92)+'" stroke-width="'+wc+'"/>';
  /* the gate's own box, disc and pill, kept so the dial's callouts can
     stand clear of it: the first cut of bringing them inside set "Sacral.
     SQ 5.8" across the right hand pill on James at 390 */
  (M.gateBox=M.gateBox||[]).push({x0:Math.min(gx-Rg,px),y0:Math.min(gy-Rg,py),x1:Math.max(gx+Rg,px+pw),y1:Math.max(gy+Rg,py+ph)});
  s+=frGlyph(GATEGLYPH[v.k],gx,gy,gz,frRgb(mixc(c,M.ink,.25)),1.5)
   +'<rect x="'+px.toFixed(1)+'" y="'+py.toFixed(1)+'" width="'+pw+'" height="'+ph+'" rx="'+(ph/2)+'" fill="'
   +(ev?frRgb(c):rgba(M.ink,.22))+'"/>'
   +'<text x="'+(px+pw/2).toFixed(1)+'" y="'+(py+ph/2+4).toFixed(1)+'" text-anchor="middle" font-size="11" font-weight="600" fill="'
   +(ev?frRgb(M.ground):rgba(M.ink,.8))+'">'+G.lab(v)+'</text></g>';
  M.L.gates.push(s);});}
/* the gates, with the wheel's own rule for a field no story has run through:
   every share reads nothing and every pill a dash, rather than six zeros.
   Each pill is as wide as its figure set at 11 pixels, measured, and the
   widest of the six is what the renditions space the gates by. */
function frGates(){var V=verpRead(),ev=V.some(function(v){return v.pct>0;});
 var lab=function(v){return ev?v.pct+'%':'–';};
 var pw=function(v){return Math.max(24,Math.ceil(frTextW(lab(v),'600 11px Inter, system-ui, sans-serif'))+10);};
 return {ev:ev,lab:lab,pw:pw,pwMax:Math.max.apply(null,V.map(pw).concat([24])),
  hi:V.filter(function(v){return v.side==='higher';}),lo:V.filter(function(v){return v.side==='lower';})};}
/* the seat's own mark. Law 8, no text over the hero graphic, so a seat is
   named on the drawing by its glyph, which engine/data/canon.js carries for
   exactly this, and the word comes on hover in the readout */
function frSeatGlyph(M,b,x,y,size){
 M.T.seats.push(frGlyph(SEATGLYPH[b]||SEATGLYPH._,x,y,size,frRgb(M.seat(b)),1.8,M.hid({k:'seat',b:b})));}

/* ============================================================
   NESTED FRAMES. Every ring takes the stage's own shape.

   The literal reading of the ask: rectangular, fitted to the rectangle, the
   rings running from the outside in. Each layer is a frame inside the last,
   the way the chapter ring of a rectangular watch runs round its dial. Every
   frame is inset by the same distance on all four sides, so a band is the
   same depth wherever it is read and a bar on the side means what a bar on
   the top means. The one curve is the core: everything else is a
   rectangle, and coherence is a circle.
   ============================================================ */
function frFrames(M,r){
 var w=M.win,cx=w.cx,cy=w.cy,NS=12;
 /* THE DEPTHS SCALE WITH THE BOX. The mockup's table was drawn for a window
    whose short half was 381, and it is carried over unchanged and multiplied
    by this box's short half over that. Line weights and type do not scale:
    a hairline is a hairline and eleven pixels is the floor at any size. */
 var sc=Math.min(w.a,w.b)/381,gs=function(v){return v*Math.max(sc,.7);};
 var D={dom0:0,dom1:20,story:25,base:31,barMax:48,seatNm:94,mask0:106,mask1:114,arch0:119,arch1:133,
  pat:147,cx:165,hy:181,sup:197,law0:207,lawIc:214,lawBar:223,lawMax:19,inner:248};
 Object.keys(D).forEach(function(k){D[k]*=sc;});
 var ring=function(d){return frRingC(cx,cy,w.a-d,w.b-d,NS);};
 var lineRing=function(list,d,al){list.push('<path d="'+ring(d).d(2)+'" fill="none" stroke="'+rgba(M.ink,al)+'" stroke-width="1"/>');};
 var base=ring(D.base),th=function(t){return base.thAt(t);};
 frShadow(M,r);

 /* domains. nineteen cells in the outer frame, each with its own mark */
 (function(){var o=ring(D.dom0),i=ring(D.dom1),mid=ring((D.dom0+D.dom1)/2);
  DOMAINS.forEach(function(dm,k){var t0=k/19+.0016,t1=(k+1)/19-.0016,sel=S.doms.indexOf(k)>=0,v=+DOMAIN[k]||0;
   var c=hx(ROOTCOL[dm.r]),h=M.hid({k:'dom',j:k});
   M.L.domains.push('<path data-h="'+h+'" d="'+frBandD(o,i,th(t0),th(t1))+'" fill="'+rgba(c,sel?.34:.05+v*.22)+'"'
    +(sel?' stroke="'+rgba(c,.95)+'" stroke-width="1.5"':'')+'/>');
   var q=mid.at(th((k+.5)/19));
   M.T.domains.push(frGlyph(dm.ic,q.x,q.y,gs(12),rgba(c,sel?1:.42+v*.5),1.7,h));});})();

 /* addresses. 112 places on the second frame, charge as depth */
 var tip={};
 (function(){var slot=base.len/M.N,hw=slot*.25,A=M.L.addresses;
  lineRing(A,D.base,.10);
  M.slots.forEach(function(s){var p=base.at(th(s.t)),tx=p.ny,ty=-p.nx;
   if(s.field){                     /* outside the body: an anchor, not a charge */
    var q={x:p.x+p.nx*8*sc,y:p.y+p.ny*8*sc};
    A.push('<circle data-h="'+M.hid({k:'anchor',n:s.n})+'" cx="'+q.x.toFixed(1)+'" cy="'+q.y.toFixed(1)
     +'" r="'+(4*Math.max(sc,.7)).toFixed(1)+'" fill="transparent" stroke="'+rgba(M.ink,.55)+'" stroke-width="1.3"/>');
    tip[s.s]=q;return;}
   var n=s.n,sq=n.sq||0,len=(4+clamp(sq/10,0,1)*48)*sc,held=sq>=4,c=M.nodeCol(n.b,sq);
   var quad=function(l){return [[p.x+tx*hw,p.y+ty*hw],[p.x-tx*hw,p.y-ty*hw],[p.x-tx*hw+p.nx*l,p.y-ty*hw+p.ny*l],[p.x+tx*hw+p.nx*l,p.y+ty*hw+p.ny*l]];};
   A.push('<g data-h="'+M.hid({k:'node',n:n})+'">'
    +'<path d="'+frPolyD(quad(D.barMax+4*sc),true)+'" fill="'+rgba(M.ink,.03)+'"/>'     /* the empty place */
    +'<path d="'+frPolyD(quad(len),true)+'" fill="'+rgba(c,held?.92:.44)+'"/>'
    +(sq>=9?'<path d="'+frPolyD(quad(len),true)+'" fill="none" stroke="rgb(255,46,31)" stroke-width="1.4"/>':'')+'</g>');
   tip[s.s]={x:p.x+p.nx*len,y:p.y+p.ny*len};});
  /* the seven seats: a hairline of the seat's colour along its run, and its
     glyph on the inside of the frame. No word: Law 8 */
  var nm=ring(D.seatNm);
  BANDS.forEach(function(b){var Sx=M.sector[b];if(!Sx)return;
   A.push('<path d="'+frPolyD(base.seg(th(Sx.t0+.002),th(Sx.t1-.002)))+'" fill="none" stroke="'+rgba(M.seat(b),.9)+'" stroke-width="2"/>');
   var q=nm.at(th(Sx.tm));frSeatGlyph(M,b,q.x,q.y,gs(17));});})();

 /* stories. one mark outside the frame for each story that landed, keyed by
    the address id atomIndex keys by, which the mockup read as a position */
 (function(){var st=ring(D.story),AT=(typeof atomIndex==='function'&&atomIndex())||{};
  Object.keys(AT).forEach(function(id){var s=M.slotByI[+id];if(!s||s.field)return;
   AT[id].forEach(function(x){var p=st.at(th(s.t)),c=mixc(M.seat(s.n.b),M.ink,.4),l=(2+x.amt)*sc;
    var ex=p.x-p.nx*l,ey=p.y-p.ny*l;
    M.L.stories.push('<g data-h="'+M.hid({k:'atom',n:s.n,v:x})+'">'
     +'<line x1="'+(p.x+p.nx*5*sc).toFixed(1)+'" y1="'+(p.y+p.ny*5*sc).toFixed(1)+'" x2="'+ex.toFixed(1)+'" y2="'+ey.toFixed(1)
     +'" stroke="'+rgba(c,.85)+'" stroke-width="1.3" stroke-linecap="round"/>'
     +'<circle cx="'+ex.toFixed(1)+'" cy="'+ey.toFixed(1)+'" r="'+Math.max(1.6,2.1*sc).toFixed(1)+'" fill="'+frRgb(c)+'"/>'
     +'<circle cx="'+ex.toFixed(1)+'" cy="'+ey.toFixed(1)+'" r="7" fill="transparent"/></g>');});});})();

 /* masks, then archetypes, two narrow frames. A highlight is a line, not a
    flood: every cell is filled by its own weight and the first and second
    archetypes are drawn round, not poured in. */
 (function(){var o=ring(D.mask0),i=ring(D.mask1),warm=M.light?[110,96,64]:[224,214,186];
  (r.maskRing||[]).forEach(function(m,k){var t0=k/6+.003,t1=(k+1)/6-.003,v=clamp(m.w/10,0,1);
   M.L.masks.push('<path data-h="'+M.hid({k:'mk',o:m})+'" d="'+frBandD(o,i,th(t0),th(t1))+'" fill="'+rgba(warm,.04+v*.30)+'"/>');});})();
 (function(){var o=ring(D.arch0),i=ring(D.arch1),mid=ring((D.arch0+D.arch1)/2),gc=M.accent;
  BANDS.forEach(function(b){var Sx=M.sector[b];if(!Sx)return;
   var mine=[];ARCH.forEach(function(a,j){if(a.b===b)mine.push(j);});
   var span=(Sx.t1-Sx.t0)/(mine.length||1);
   mine.forEach(function(j,k){var a=ARCH[j],lead=j===r.pi,sec=j===r.si,aff=+r.aff[j]||0;
    var t0=Sx.t0+k*span+.002,t1=Sx.t0+(k+1)*span-.002,h=M.hid({k:'arch',j:j});
    M.L.archetypes.push('<path data-h="'+h+'" d="'+frBandD(o,i,th(t0),th(t1))+'" fill="'+rgba(gc,.04+aff*.16)+'"'
     +(lead?' stroke="'+rgba(gc,.55)+'" stroke-width="1.4"':sec?' stroke="'+rgba(gc,.32)+'" stroke-width="1.1"':'')+'/>');
    var q=mid.at(th(M.tArch[j]));
    M.T.archetypes.push(frGlyph(a.ic,q.x,q.y,gs(11),rgba(gc,lead?1:sec?.85:.35+aff*.4),1.8,h));});});})();

 /* patterns. beads on their own frame, threaded to what built them */
 var at={sab:[],cx:[],hy:[],sup:[]};
 (function(){var tr=ring(D.pat),w01=function(s){return clamp((s.w-3.5)/3,0,1);},P=M.L.patterns;
  P.push('<path d="'+tr.d(2)+'" fill="none" stroke="'+rgba(M.ink,.07)+'" stroke-width="1"/>');
  r.sabs.forEach(function(s,k){var p=tr.at(th(M.tSab[k])),kk=w01(s);at.sab[k]=p;
   s.parts.forEach(function(n){var sl=M.slotByI[n.i],q=sl&&tip[sl.s];if(!q)return;
    P.push('<path d="'+frBowD(q,p,cx,cy,frSag(n,.16))+'" fill="none" stroke="'+rgba(M.seat(n.b),.16+kk*.22)
     +'" stroke-width="'+(.7+kk*1).toFixed(2)+'"'+(s.unnamed?' stroke-dasharray="3 3"':'')+'/>');});});
  r.sabs.forEach(function(s,k){var p=at.sab[k],c=M.seat((s.parts[0]&&s.parts[0].b)||'Root'),rb=(2.6+w01(s)*3.4)*Math.max(sc,.6);
   P.push('<circle data-h="'+M.hid({k:'sab',o:s})+'" cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'+rb.toFixed(1)+'"'
    +(s.unnamed?' fill="'+frRgb(M.ground)+'" stroke="'+frRgb(c)+'" stroke-width="1.5"':' fill="'+frRgb(c)+'"')+'/>');});})();

 /* chains. complexes, hyper complexes, character, each a frame further in.
    The threads bow toward the core, because a chain is a pattern compounding
    inward, and drawn straight they ran across the frame as loose string. */
 frChains(M,r,at,[['cx',r.cxs,M.tCx,ring(D.cx),'Solar',3.4,1.5,'sab',M.ixSab,.30],
  ['hy',r.hys,M.tHy,ring(D.hy),'Sacral',4.8,2.1,'cx',M.ixCx,.40],
  ['sup',r.sups,M.tSup,ring(D.sup),'Root',6.8,2.7,'hy',M.ixHy,.50]],th,sc,true);

 /* laws. twenty one, each inside its own seat, each at its score */
 (function(){var ic=ring(D.lawIc),bs=ring(D.lawBar),Lw=M.L.laws;
  lineRing(Lw,D.law0,.07);
  SI.forEach(function(l,j){var t=th(M.tLaw[j]),p=bs.at(t),c=M.seat(l.b),v=clamp((+S.law[l.nm]||0)/10,0,1),len=(3+v*19)*sc;
   var tx=p.ny,ty=-p.nx,hw=3*Math.max(sc,.7),h=M.hid({k:'law',j:j});
   var quad=function(L){return [[p.x+tx*hw,p.y+ty*hw],[p.x-tx*hw,p.y-ty*hw],[p.x-tx*hw+p.nx*L,p.y-ty*hw+p.ny*L],[p.x+tx*hw+p.nx*L,p.y+ty*hw+p.ny*L]];};
   Lw.push('<g data-h="'+h+'"><path d="'+frPolyD(quad(D.lawMax+3*sc),true)+'" fill="'+rgba(M.ink,.04)+'"/>'
    +'<path d="'+frPolyD(quad(len),true)+'" fill="'+rgba(c,.40+v*.58)+'"/></g>');
   var q=ic.at(t);M.T.laws.push(frGlyph(l.ic,q.x,q.y,gs(11),rgba(c,.9),1.7,h));});
  lineRing(Lw,D.inner,.08);})();

 /* the core and its six gates */
 var R=76*sc,cw=6*Math.max(sc,.6),ch=10*Math.max(sc,.6);
 frCore(M,r,cx,cy,R,{w:cw,fs:Math.max(20,64*sc),halo:ch});
 frCollar(M,cx,cy,R+cw/2+ch,sc<.6);}

/* the three tiers of a chain, which both renditions draw the same way and
   only place differently. T: key, list, bearings, ring, seat, bead radius,
   thread width, the tier each part is from, its index, and the pull */
function frChains(M,r,at,tiers,th,sc,frames){
 tiers.forEach(function(T){var key=T[0],list=T[1],ts=T[2],tr=T[3],c=M.seat(T[4]),rb=T[5],wd=T[6],from=at[T[7]],ixf=T[8],pull=T[9];
  var cx=tr.cx,cy=tr.cy,Cn=M.L.chains;
  if(frames)Cn.push('<path d="'+tr.d(2)+'" fill="none" stroke="'+rgba(c,.09)+'" stroke-width="1"/>');
  list.forEach(function(o,k){at[key][k]=tr.at(th(ts[k]));});
  list.forEach(function(o,k){var p=at[key][k],kk=clamp((o.w-3.5)/3,0,1);
   o.parts.forEach(function(pt){var q=from[ixf.get(pt)];if(!q)return;
    Cn.push('<path d="'+frBowD(q,p,cx,cy,pull)+'" fill="none" stroke="'+rgba(c,(frames?.18:.16)+kk*.26)
     +'" stroke-width="'+(wd*(.45+kk*.7)).toFixed(2)+'"/>');});});
  /* each bead's hit record is kept beside its position, so a callout that
     names a bead answers to the same readout the bead does */
  at.h=at.h||{};at.h[key]=[];
  list.forEach(function(o,k){var p=at[key][k],kk=clamp((o.w-3.5)/3,0,1),h=M.hid({k:o.kind||key,o:o});
   at.h[key][k]=h;
   Cn.push('<circle data-h="'+h+'" cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'
    +((rb+kk*(frames?2.4:2.2))*Math.max(sc,.6)).toFixed(1)+'" fill="'+frRgb(c)+'" stroke="'+frRgb(M.ground)+'" stroke-width="1.5"/>');});});}

/* ============================================================
   DIAL WITH CALLOUTS. The circle, as large as the box allows, and the
   rectangle's corners put to work.

   Every layer sits at a fixed radius like the registers on a watch dial,
   and the few things worth naming are called out on a leader line, set
   level and read without turning the head. The mockup set them in the four
   corners the circle leaves, so no word sat over a mark, until the owner
   ruled that nothing on the Field sticks out past the ring: they sit beside
   their marks now, inside it, on a plate of the ground. frCallouts carries
   the ruling.
   ============================================================ */
function frDial(M,r){
 var w=M.win,cx=w.cx,cy=w.cy,R0=Math.min(w.a,w.b)-2;
 /* the mockup's radii, measured in from a rim of 379, scaled to this rim */
 var sc=R0/379,gs=function(v){return v*Math.max(sc,.7);},o=function(v){return R0-v*sc;};
 var C=function(rad){return frRingC(cx,cy,rad,rad,2);};
 var Rr={dom0:R0,dom1:o(18),story:o(24),base:o(30),barMax:46*sc,seatNm:o(92),
  mask0:o(102),mask1:o(109),arch0:o(115),arch1:o(128),pat:o(145),cx:o(168),hy:o(190),sup:o(212),
  lawIc:o(229),lawBar:o(237),lawMax:22*sc,gate:o(280),core:64*sc};
 var base=C(Rr.base),th=function(t){return base.thAt(t);};
 /* the wash sits on the dial's own rim and not in the corners, because the
    corners are where the words go. In the corners a Root name measured 4.29
    to 1 on the Root pool, and passed only on the width of its halo. */
 frShadow(M,r,{reach:.62,at:[-135,-45,135,45].map(function(a){var t=a*Math.PI/180;
  return [(cx+Math.cos(t)*R0*.78)/M.W,(cy+Math.sin(t)*R0*.78)/M.H];})});
 /* the registers: a hairline at every ring, the dial's own engraving */
 [Rr.dom1,Rr.base,Rr.mask0,Rr.arch1,Rr.pat,Rr.cx,Rr.hy,Rr.sup,Rr.lawBar].forEach(function(rad){
  M.L.ground.push('<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="'+rad.toFixed(1)+'" fill="none" stroke="'+rgba(M.ink,.06)+'" stroke-width="1"/>');});
 var hitOf={};

 /* domains, the outer register */
 (function(){var ou=C(Rr.dom0),i=C(Rr.dom1),mid=C((Rr.dom0+Rr.dom1)/2);
  DOMAINS.forEach(function(dm,k){var c=hx(ROOTCOL[dm.r]),t0=k/19+.0018,t1=(k+1)/19-.0018,sel=S.doms.indexOf(k)>=0,v=+DOMAIN[k]||0;
   var h=M.hid({k:'dom',j:k});
   M.L.domains.push('<path data-h="'+h+'" d="'+frBandD(ou,i,th(t0),th(t1))+'" fill="'+rgba(c,sel?.34:.05+v*.22)+'"'
    +(sel?' stroke="'+rgba(c,.95)+'" stroke-width="1.4"':'')+'/>');
   var q=mid.at(th((k+.5)/19));M.T.domains.push(frGlyph(dm.ic,q.x,q.y,gs(11),rgba(c,sel?1:.4+v*.5),1.7,h));});})();

 /* addresses, radial bars on the chapter ring */
 var tip={},anchorOf={};
 (function(){var slot=base.len/M.N,hw=slot*.24,A=M.L.addresses;
  M.slots.forEach(function(s){var t=th(s.t),p=base.at(t),tx=p.ny,ty=-p.nx;
   if(s.field){var q={x:p.x+p.nx*7*sc,y:p.y+p.ny*7*sc};tip[s.s]=q;
    A.push('<circle data-h="'+M.hid({k:'anchor',n:s.n})+'" cx="'+q.x.toFixed(1)+'" cy="'+q.y.toFixed(1)+'" r="'
     +(3.6*Math.max(sc,.7)).toFixed(1)+'" fill="transparent" stroke="'+rgba(M.ink,.6)+'" stroke-width="1.2"/>');return;}
   var n=s.n,sq=n.sq||0,len=(3*sc)+clamp(sq/10,0,1)*Rr.barMax,held=sq>=4,c=M.nodeCol(n.b,sq),h=M.hid({k:'node',n:n});
   var quad=function(l){return [[p.x+tx*hw,p.y+ty*hw],[p.x-tx*hw,p.y-ty*hw],[p.x-tx*hw*.8+p.nx*l,p.y-ty*hw*.8+p.ny*l],[p.x+tx*hw*.8+p.nx*l,p.y+ty*hw*.8+p.ny*l]];};
   A.push('<g data-h="'+h+'"><path d="'+frPolyD(quad(Rr.barMax+3*sc),true)+'" fill="'+rgba(M.ink,.03)+'"/>'
    +'<path d="'+frPolyD(quad(len),true)+'" fill="'+rgba(c,held?.92:.44)+'"/>'
    +(sq>=9?'<path d="'+frPolyD(quad(len),true)+'" fill="none" stroke="rgb(255,46,31)" stroke-width="1.3"/>':'')+'</g>');
   tip[s.s]={x:p.x+p.nx*len,y:p.y+p.ny*len};anchorOf[s.s]={x:p.x,y:p.y,th:t};hitOf['n'+s.s]=h;});
  /* the seats, in a hairline of their colour on the ring and their glyph just
     inside it, where a dial sets its numerals. The glyph and not the word:
     Law 8 keeps every word off the drawing, and on this rendition the few
     words it sets are the callouts beside their own marks */
  BANDS.forEach(function(b){var Sx=M.sector[b];if(!Sx)return;
   A.push('<path d="'+frArcD(cx,cy,Rr.base,th(Sx.t0+.002),th(Sx.t1-.002))+'" fill="none" stroke="'+rgba(M.seat(b),.9)+'" stroke-width="2"/>');
   var tm=th(Sx.tm);frSeatGlyph(M,b,cx+Math.cos(tm)*(Rr.seatNm+2*sc),cy+Math.sin(tm)*(Rr.seatNm+2*sc),gs(17));});})();

 /* stories */
 (function(){var st=C(Rr.story),AT=(typeof atomIndex==='function'&&atomIndex())||{};
  Object.keys(AT).forEach(function(id){var s=M.slotByI[+id];if(!s||s.field)return;
   AT[id].forEach(function(x){var p=st.at(th(s.t)),c=mixc(M.seat(s.n.b),M.ink,.4),l=(1+x.amt*1.2)*sc;
    var ex=p.x-p.nx*l,ey=p.y-p.ny*l;
    M.L.stories.push('<g data-h="'+M.hid({k:'atom',n:s.n,v:x})+'">'
     +'<line x1="'+(p.x+p.nx*4*sc).toFixed(1)+'" y1="'+(p.y+p.ny*4*sc).toFixed(1)+'" x2="'+ex.toFixed(1)+'" y2="'+ey.toFixed(1)
     +'" stroke="'+rgba(c,.8)+'" stroke-width="1.2" stroke-linecap="round"/>'
     +'<circle cx="'+ex.toFixed(1)+'" cy="'+ey.toFixed(1)+'" r="'+Math.max(1.5,1.9*sc).toFixed(1)+'" fill="'+frRgb(c)+'"/>'
     +'<circle cx="'+ex.toFixed(1)+'" cy="'+ey.toFixed(1)+'" r="7" fill="transparent"/></g>');});});})();

 /* masks and archetypes, two narrow registers */
 (function(){var ou=C(Rr.mask0),i=C(Rr.mask1),warm=M.light?[110,96,64]:[224,214,186];
  (r.maskRing||[]).forEach(function(m,k){var v=clamp(m.w/10,0,1),t0=k/6+.004,t1=(k+1)/6-.004;
   M.L.masks.push('<path data-h="'+M.hid({k:'mk',o:m})+'" d="'+frBandD(ou,i,th(t0),th(t1))+'" fill="'+rgba(warm,.04+v*.32)+'"/>');});})();
 var archAt={};
 (function(){var ou=C(Rr.arch0),i=C(Rr.arch1),mid=C((Rr.arch0+Rr.arch1)/2),gc=M.accent;
  BANDS.forEach(function(b){var Sx=M.sector[b];if(!Sx)return;
   var mine=[];ARCH.forEach(function(a,j){if(a.b===b)mine.push(j);});
   var span=(Sx.t1-Sx.t0)/(mine.length||1);
   mine.forEach(function(j,k){var a=ARCH[j],lead=j===r.pi,sec=j===r.si,aff=+r.aff[j]||0;
    var t0=Sx.t0+k*span+.002,t1=Sx.t0+(k+1)*span-.002,h=M.hid({k:'arch',j:j});
    M.L.archetypes.push('<path data-h="'+h+'" d="'+frBandD(ou,i,th(t0),th(t1))+'" fill="'+rgba(gc,.04+aff*.16)+'"'
     +(lead?' stroke="'+rgba(gc,.6)+'" stroke-width="1.4"':sec?' stroke="'+rgba(gc,.36)+'" stroke-width="1.1"':'')+'/>');
    var q=mid.at(th(M.tArch[j]));archAt[j]=q;hitOf['a'+j]=h;
    M.T.archetypes.push(frGlyph(a.ic,q.x,q.y,gs(10.5),rgba(gc,lead?1:sec?.8:.3+aff*.4),1.8,h));});});})();

 /* patterns and chains */
 var at={sab:[],cx:[],hy:[],sup:[]};
 (function(){var rp=C(Rr.pat),w01=function(s){return clamp((s.w-3.5)/3,0,1);},P=M.L.patterns;
  r.sabs.forEach(function(s,k){at.sab[k]=rp.at(th(M.tSab[k]));});
  r.sabs.forEach(function(s,k){var p=at.sab[k],kk=w01(s);
   s.parts.forEach(function(n){var sl=M.slotByI[n.i],q=sl&&tip[sl.s];if(!q)return;
    P.push('<path d="'+frBowD(q,p,cx,cy,frSag(n,.10))+'" fill="none" stroke="'+rgba(M.seat(n.b),.15+kk*.2)
     +'" stroke-width="'+(.6+kk*.9).toFixed(2)+'"'+(s.unnamed?' stroke-dasharray="2 3"':'')+'/>');});});
  r.sabs.forEach(function(s,k){var p=at.sab[k],c=M.seat((s.parts[0]&&s.parts[0].b)||'Root'),rr=(2.4+w01(s)*3.2)*Math.max(sc,.6),h=M.hid({k:'sab',o:s});
   hitOf['s'+k]=h;
   P.push('<circle data-h="'+h+'" cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'+rr.toFixed(1)+'"'
    +(s.unnamed?' fill="'+frRgb(M.ground)+'" stroke="'+frRgb(c)+'" stroke-width="1.4"':' fill="'+frRgb(c)+'"')+'/>');});})();
 frChains(M,r,at,[['cx',r.cxs,M.tCx,C(Rr.cx),'Solar',3.2,1.4,'sab',M.ixSab,.24],
  ['hy',r.hys,M.tHy,C(Rr.hy),'Sacral',4.6,2,'cx',M.ixCx,.30],
  ['sup',r.sups,M.tSup,C(Rr.sup),'Root',6.4,2.6,'hy',M.ixHy,.36]],th,sc,false);
 r.sups.forEach(function(u,k){hitOf['u'+k]=at.h.sup[k];});

 /* laws */
 var lawAt={};
 (function(){var ic=C(Rr.lawIc),bs=C(Rr.lawBar),Lw=M.L.laws;
  SI.forEach(function(l,j){var t=th(M.tLaw[j]),p=bs.at(t),c=M.seat(l.b),v=clamp((+S.law[l.nm]||0)/10,0,1),len=3*sc+v*Rr.lawMax;
   var h=M.hid({k:'law',j:j});hitOf['l'+j]=h;
   Lw.push('<g data-h="'+h+'"><line x1="'+p.x.toFixed(1)+'" y1="'+p.y.toFixed(1)+'" x2="'+(p.x+p.nx*(Rr.lawMax+3*sc)).toFixed(1)
    +'" y2="'+(p.y+p.ny*(Rr.lawMax+3*sc)).toFixed(1)+'" stroke="'+rgba(M.ink,.06)+'" stroke-width="4" stroke-linecap="round"/>'
    +'<line x1="'+p.x.toFixed(1)+'" y1="'+p.y.toFixed(1)+'" x2="'+(p.x+p.nx*len).toFixed(1)+'" y2="'+(p.y+p.ny*len).toFixed(1)
    +'" stroke="'+rgba(c,.40+v*.58)+'" stroke-width="4" stroke-linecap="round"/></g>');
   var q=ic.at(t);lawAt[j]=q;M.T.laws.push(frGlyph(l.ic,q.x,q.y,gs(10.5),rgba(c,.85),1.7,h));});})();

 /* the core and its gates */
 var cw=5*Math.max(sc,.6),ch=10*Math.max(sc,.6);
 frCore(M,r,cx,cy,Rr.core,{w:cw,fs:Math.max(20,56*sc),halo:ch});
 frCollar(M,cx,cy,Rr.core+cw/2+ch,sc<.6);

 /* edge is the domain band's inner edge, so a callout never sits on the
    outermost register either, and floor is the collar's outer edge, so none
    reaches the number at the centre. The gates past the collar are stood
    clear of one by one, off the boxes frCollar keeps */
 frCallouts(M,r,{cx:cx,cy:cy,tip:tip,anchorOf:anchorOf,archAt:archAt,lawAt:lawAt,at:at,hitOf:hitOf,
  edge:Rr.dom1,floor:Rr.core+cw/2+ch+8});}

/* ---- the callouts. what is worth a name is named beside its mark ----
   THEY CAME IN OFF THE CORNERS, ruled 26 September, CT in TASKS.md. His
   words: "for the field, I do not like the way that the words stick out."
   CR brought every seat, domain, archetype and pattern name on the wheel
   inside the ring and left these six on the dial's corners, asked about them
   as its Q5, and this is the answer. Measured on James at 1600 before the
   move, every one of Sage, Controller, Envy, Jealousy, Blame and Compassion
   sat in a corner on a leader running out past the domain band, and at 390
   Blame hung below the ring.

   PLACED BY THE WHEEL'S OWN RULE FOR A LEVEL NAME, flatplate in ui/wheel.js,
   and not by arcTxt. arcTxt and radialTxt draw on the wheel's canvas and
   this picture is SVG, so neither can be called here; and a callout is two
   lines, a name and what it is, which a word bent round an arc cannot carry.
   flatplate is CR's answer for exactly this shape: level, beside its mark on
   a short leader, the outward side first and then the inward side, stepped
   toward the centre on a collision, every corner of the box inside the ring
   and none of it on the core, and a name with no legible slot is not drawn.
   Stepped toward the centre rather than always down, because the lower half
   of the dial stepped down walks straight out of the ring.

   NOTHING IS NAMED OFF THE DEFAULTS. On an unread field there are no
   callouts. An address is named only when it is held, which is the mockup's
   own threshold for a held bar, and the most shut law only among the laws a
   person has answered, which is what lawIn() says. The mockup named its
   three heaviest whatever they held and its lowest law whatever it was, and
   on a light field that is three addresses at nothing and a default six.

   A NAME THAT DOES NOT FIT IS NOT DRAWN. Each label is measured before it is
   placed and tested against the ring, the core and every name already set.
   What is not named here is still in the readout and in the rail. */
function frCallouts(M,r,P){
 if(r.unread)return;
 var w=M.win,cx=P.cx,cy=P.cy,items=[];
 var push=function(k,p,nm,sub,col,h){if(!p||h==null)return;
  items.push({k:k,x:p.x,y:p.y,th:Math.atan2(p.y-cy,p.x-cx),nm:nm,sub:sub,col:col,h:h});};
 M.slots.filter(function(s){return !s.field&&(s.n.sq||0)>=4;})
  .sort(function(a,b){return b.n.sq-a.n.sq;}).slice(0,3)
  .forEach(function(s){var a=P.anchorOf[s.s];
   /* SQ, the product's own word for an address's depth: the readout, the
      badge and the rail all print it that way. The mockup said "Held at",
      and held is the axis charge in the readout two inches away. */
   push('addresses',a,s.n.k,s.n.b+'. SQ '+s.n.sq.toFixed(1),M.seat(s.n.b),P.hitOf['n'+s.s]);});
 if(ARCH[r.pi])push('archetypes',P.archAt[r.pi],ARCH[r.pi].nm,'First archetype',M.accent,P.hitOf['a'+r.pi]);
 /* the selected domain is not called out: the left rail already names it, and
    a fifth name in one corner reached the dial's own outer ring */
 r.sups.forEach(function(o,k){push('chains',P.at.sup[k],o.nm,'Character layer',M.seat('Root'),P.hitOf['u'+k]);});
 var shut=SI.map(function(l,i){return {l:l,i:i,v:+S.law[l.nm]||0};})
  .filter(function(x){return typeof lawIn!=='function'||lawIn(x.l.nm);})
  .sort(function(a,b){return a.v-b.v;})[0];
 if(shut)push('laws',P.lawAt[shut.i],shut.l.nm,'Most shut law. '+shut.v.toFixed(1)+' of 10',M.seat(shut.l.b),P.hitOf['l'+shut.i]);
 var hp=r.sabs.slice().sort(function(a,b){return b.w-a.w;})[0];
 if(hp){var hk=M.ixSab.get(hp);
  push('patterns',P.at.sab[hk],hp.nm,'Heaviest pattern. Weight '+hp.w.toFixed(1),M.seat((hp.parts[0]&&hp.parts[0].b)||'Root'),P.hitOf['s'+hk]);}
 /* the box a label takes is the name's line over the line saying what it is,
    30 tall, with the leader meeting it at the name. inRing is flatplate's
    test with the dial's own edge and floor in place of the wheel's. */
 var FLATS=(M.gateBox||[]).slice(),gap=10,H=30;
 var inRing=function(b){return [[b.x0,b.y0],[b.x1,b.y0],[b.x0,b.y1],[b.x1,b.y1]]
   .every(function(q){return Math.hypot(q[0]-cx,q[1]-cy)<=P.edge-2;})
  &&Math.hypot(Math.max(b.x0-cx,0,cx-b.x1),Math.max(b.y0-cy,0,cy-b.y1))>P.floor
  &&b.x0>=w.x0&&b.x1<=w.x1&&b.y0>=w.y0&&b.y1<=w.y1;};
 var free=function(b){return !FLATS.some(function(q){
  return b.x0<q.x1+4&&q.x0<b.x1+4&&b.y0<q.y1+4&&q.y0<b.y1+4;});};
 items.forEach(function(it){
  var tw=Math.max(frTextW(it.nm,'600 12.5px Inter, system-ui, sans-serif'),frTextW(it.sub,'500 11px Inter, system-ui, sans-serif'));
  var out=it.x>=cx,dy=it.y<cy?1:-1,box=null,right;
  for(var s=0;s<2&&!box;s++){right=s?!out:out;
   for(var step=0;step<6;step++){
    var ax=it.x+(right?gap:-gap),top=it.y-H/2+dy*step*(H*.6);
    var b={x0:right?ax:ax-tw,x1:right?ax+tw:ax,y0:top,y1:top+H};
    if(inRing(b)&&free(b)){box=b;box.lx=ax;break;}}}
  if(!box)return;
  FLATS.push(box);
  M.C=M.C||{};
  var lx=box.lx,ly=box.y0+21,ey=box.y0+8,g2=M.C[it.k]||(M.C[it.k]=[]),anc=right?'start':'end';
  /* A PLATE OF THE GROUND UNDER THE TWO LINES. In a corner the halo was
     enough, because a corner is empty. Inside the ring the label sits over
     bars and glyphs, and the four pixel halo let an archetype glyph through
     "Heart. SQ 6.2" on James at 390. The plate lets a quarter of the marks
     through, so the ring still reads as one ring under the word. */
  g2.push('<g data-h="'+it.h+'" data-call="'+it.k+'"><rect x="'+(box.x0-4).toFixed(1)+'" y="'+(box.y0+1).toFixed(1)
   +'" width="'+(box.x1-box.x0+8).toFixed(1)+'" height="'+(H-1)+'" rx="5" fill="'+rgba(M.ground,.76)+'"/>'
   /* the name in its colour lifted a fifth toward ink, so it clears 4.5 to 1
      on the ground itself and not only on the width of its halo: the Root
      red measured 4.36 beside the rim, the lifted one 5.40 */
   +'<circle cx="'+it.x.toFixed(1)+'" cy="'+it.y.toFixed(1)+'" r="2.4" fill="'+frRgb(it.col)+'"/>'
   +'<path d="M'+it.x.toFixed(1)+' '+it.y.toFixed(1)+'L'+(lx-(right?3:-3)).toFixed(1)+' '+ey.toFixed(1)
   +'" fill="none" stroke="'+rgba(it.col,.6)+'" stroke-width="1"/>'
   +frLabel(M,it.nm,lx,ly-9,'text-anchor="'+anc+'" font-size="12.5" font-weight="600" fill="'+frRgb(mixc(it.col,M.ink,.18))+'"')
   +frLabel(M,it.sub,lx,ly+6,'text-anchor="'+anc+'" font-size="11" font-weight="500" fill="'+frRgb(M.dim)+'"')
   +'</g>');});}

/* ---- per frame ----
   THE PICTURE IS BUILT WHEN ITS SIGNATURE CHANGES AND NOT OTHERWISE. Nothing
   in either rendition moves on its own, so a frame whose reading, box and
   lighting match the last one has nothing to draw. The signature carries
   every value a mark is drawn from, charge by charge and law by law, rather
   than a sum of them, because a sum is a picture that can go stale while two
   numbers trade places under it. */
var FR_SIG=null,FR_HIT=[],FR_ERR=false;
function frSig(r,W_,H_){
 var a=[FVIEW,W_,H_,S.theme,r.unread?1:0,(+r.CQ).toFixed(2),(+r.DQ).toFixed(2),r.tier,r.benign,r.darkB,
  r.pi,r.si,S.doms.join('.')];
 for(var i=0;i<W.length;i++)a.push((W[i].sq||0).toFixed(2));
 SI.forEach(function(l){a.push((+S.law[l.nm]||0).toFixed(2),typeof lawIn==='function'&&lawIn(l.nm)?1:0);});
 for(var d=0;d<DOMAINS.length;d++)a.push((+DOMAIN[d]||0).toFixed(3));
 (r.aff||[]).forEach(function(v){a.push((+v||0).toFixed(3));});
 (r.maskRing||[]).forEach(function(m){a.push((+m.w||0).toFixed(2));});
 [r.sabs,r.cxs,r.hys,r.sups].forEach(function(L){a.push(L.length);L.forEach(function(o){a.push(o.nm,(+o.w||0).toFixed(2));});});
 verpRead().forEach(function(v){a.push(v.pct);});
 a.push(((CURP&&CURP.story&&CURP.story.entries)||[]).length,CURP?(CURP.id||CURP.nm||''):'');
 return a.join('|');}
function ringsDraw(r){
 var host=document.getElementById('frend');if(!host)return;
 var W_=host.clientWidth,H_=host.clientHeight;
 /* hidden, or not laid out yet: nothing to measure, and a picture built for a
    box of nothing would be cached against the box it is about to get */
 if(W_<60||H_<60)return;
 /* THE FRAME LOOP HAS NO GUARD OF ITS OWN, so a throw here would stop it and
    take every later frame of the Field with it. The build is guarded and the
    failure is said, once, in the console, where the functional gate reads it
    as a failure: survivable for a person, loud for a test. */
 try{
  var box=FVIEW+'|'+W_+'x'+H_+'|'+frFoot(host,H_,8).toFixed(1),sig=frSig(r,W_,H_)+'|'+box;
  if(sig===FR_SIG)return;
  FR_SIG=sig;
  if(FR_BOX!==box){FR_BOX=box;FR_RINGS={};}
  var M=frMount(host,W_,H_,r);
  if(FVIEW==='dial')frDial(M,r);else frFrames(M,r);
  host.innerHTML=frSvg(M);
  FR_HIT=M.hit;}
 catch(e){if(!FR_ERR){FR_ERR=true;try{console.error('[atuned] the '+FVIEW+' rendition failed',e);}catch(e2){}}}}
