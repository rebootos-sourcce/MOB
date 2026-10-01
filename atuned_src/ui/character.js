
/* ============================================================
   CHARACTER. The six masks as pixel art, one grid each.

   Round LP in TASKS.md, his words, the creative in full: "When I come to this
   mask page, I see six grids. Above it is the name of the mask. In very
   small, simple font ... the spiritual energetics drives the shape ... It's
   pixel art. And it needs to take account of the fetters saboteurs clusters
   hyper clusters that form it ... The dark mask and the light mask. and all
   of those form the character. So that's the character page ... if I click
   on an entire mask, on my right hand information side, it gives me a full
   summary of what that mask is doing ... So if a person goes over a certain
   amount, the grid will dynamically scale." And the line that settles what
   this replaces: "if what you're asking in the current mask page is the
   human body with all the chakra points, then yes, it definitely replaces
   all that."

   THIS IS THE FOURTH BUILD OF THIS PAGE AND THE FIRST ONE NOT ON A BODY. The
   three before it drew the masks onto the Body's figure (7220610, then the
   story pixels of KW, then the Masks door of LE, bmRender with the masks
   alone). He rejected the container every time, never the data: MK2, LO and
   LP all ask for six small faces. So nothing here reads ui/map.js. The door
   keeps integer 11 and host #masksview, because the integers are identity,
   and everything drawn inside the host is new.

   WHAT DRIVES THE SHAPE, layer by layer, in the order he gave it.

   1. The face. MASK_FACE and each mask's own mark (engine/data/canon.js), the
      same outline the six icons already wear, rasterised onto the grid. The
      mark is cut out of the face rather than drawn on it, one eye open for
      the Child, the split for the Teen, the seam for the Adult, so each grid
      is a different mask before anything is lit.
   2. "Someone has a sage. Or someone has a rebel." The foundation is the
      archetype seated under the mask that this person's blueprint leans on
      hardest, r.aff off the domain wheel, drawn faintly in its own icon's
      shape (ARCH[j].ic) on the unlit face. The Teen sits on the Throat and
      the Throat carries the Rebel and the Jester, which is his own GG
      example, "the teen, for example, like the rebel", read off ARCH.b
      rather than typed into a table he has not ruled (GG4 holds that table
      open). It is the essence, so it shows only where nothing is lit yet.
   3. The fetters. Every address under the mask's seats has a home on the
      face, and lights a share of it equal to its charge over ten: "the more
      intense, the more the pixel" (JP). A pixel is a share of one address's
      charge, and the address is the unit the engine carries charge in.
   4. The saboteurs, complexes and hyper complexes. An address that a running
      saboteur is built on is laid down next to that saboteur's other
      addresses, heaviest saboteur first, so a saboteur is one block and two
      saboteurs are two blocks with a dark pixel between them. The tone is
      the tier: a loose fetter is dim, a saboteur brighter, a saboteur joined
      into a complex brighter again, and one whose family has built up into a
      hyper complex is the hottest pixel on the face. That is a palette ramp,
      which is how eight bit art shows depth with four colours. And when the
      chain reaches the top, r.sups, which ui.js already calls Character, the
      rim of the mask lights: the character is what the page is named for.

   So an Overthinker and a Perfectionist light different pixels on the same
   Child mask, because they are built on different addresses at different
   seats, and the block each makes is sized by its own charge.

   WHAT A PIXEL IS NOT. KW asked for "each pixel represents a story", and the
   Body's own mask overlay still draws exactly that (bmMaskRead). It is not
   the unit here, and on purpose: every worked example is a table of charges
   with no stories in it, so a story pixel reads empty on all fourteen
   reference profiles, and LP names the chain, not the entries, as what forms
   the face. A story still fills this page, because a story is what moves the
   charge that lights it.

   PRETEEN AND PROFESSIONAL SIT ON THE SAME TWO SEATS, Solar and Throat, in
   MASKS today, so the engine cannot tell their charge apart and their fill is
   the same fill. What differs is the face, two eyes against a fitted jaw.
   That is the canon's call and not this file's, and it is asked rather than
   papered over with an invented difference.
   ============================================================ */

/* ============================================================
   ROUND LT, HIS AESTHETIC PASS ON THIS PAGE. Four findings, each with an
   owner, read off the rendered screen and not off this file.

   SOL: the loose fetter tier sat at .34 of full seat colour, and a worked
   ICP holds most of its addresses (26 of 32 on James's Child), so the
   interior read as a near solid wash with almost no quiet ground. The ramp
   is now .20 to .62 to 1 dark, .38 to .78 to 1 light, so only a saboteur and
   above carries real weight and a loose fetter recedes to a texture.

   BJORN: the mark, the one thing that tells a Child from a Teen, was drawn
   in the mask's own seat colour, the same family as every fetter pixel
   around it, so it read as more noise and not as structure. It is drawn in
   var(--ink) now, fixed against the stage regardless of what is lit, and
   the rim's own inset is pulled in from .06 to .025 so the silhouette reads
   as one line and not a row of dots.

   PETRA: "star looks like a crown, left right arrow, another crown, another
   crown." Measured, not guessed: on a light reading with nothing else lit,
   the archetype's icon is the only shape on the face, scanned onto a grid a
   handful of cells wide. The Warrior's five point star and the Ruler's
   crown both alias into the same jagged blob at that size, and Ruler sits
   under two of the six masks (Solar), so "another crown" was heard twice
   for the reason it looked that way. No icon this size reads honestly, so
   the icon is gone. What sits there now is a soft glow in the archetype's
   own seat colour, the same technique the Field's own shadow wash uses
   (frShadow in ui/rings.js), which does not claim to be a legible symbol
   because it is not one. The name goes on hover instead, next finding.

   THE HOVER ITSELF IS NOT BUILT YET. This paragraph described a plan and
   this file shipped without it, caught in review rather than left to read
   as done: nothing below calls chGeo() from a pointer position and nothing
   answers a hover with the address, seat, charge or chain chDrill already
   prints. What it would need, honestly stated so the next pass does not
   re-derive it: a pointermove handler on the card's own svg, the pointer
   converted to the viewBox's own units, the nearest cell solved and
   mirrored past G/2 the way chGeo() already lays the half face out, then
   a lookup against rd.px (cached per card at render time, since chSvg only
   returns markup today and throws the read away) for the node at that
   cell. One shared tooltip element, not one per pixel, the same reasoning
   that already keeps chSvg to a handful of paths. Open.

   THE ANIMATION, ROUND MQ: taken from "earned" to "alive," on the Field's
   own clock. Measured before the change: 9 of the 14 reference profiles
   light no rim at all in the default Dark reading, so a page that only
   animates the rim reads as a still printout for most people who open it,
   next to a Field that breathes every frame for everyone. Now every read
   mask's archetype glow breathes on the Field's own 4.2 second wave
   (wheel.js's fringe wave, 0.82+0.18 sin(2 pi t/4.2)), whether or not its
   chain has reached the character; the rim joins that same breath, on the
   same beat, only once it has, so the reward is still legible as the rim
   lighting at all, and what changed is that six faces now read as one
   character breathing on one clock rather than nothing moving until an
   arrival few profiles ever reach.
   ============================================================ */

/* the reading on screen, and the mask whose summary is in Selection. CHV and
   not CH: CH is the Field canvas's height, a let in ui/component.js, and the
   first cut declaring it a second time threw at parse and took every module
   after this one with it, loadP included, so the app booted to nothing. */
/* pick is never null once a reading has rendered once, round MX/MZ/NA: see
   chLast() below for why, and the big comment above renderCharacter for
   what pick and weave each now answer. */
var CHV={face:'dark', pick:null, weave:null, opened:false, html:''};
/* THE HOVER, ROUND MQ, built to the plan round LT wrote and left open: "As I
   hover over the pixels, the overlay tells my limiting belief (fetter),
   saboteur cluster, etc." One entry per rendered card, keyed by mask name,
   holding its grid size, the compute() this render read, and a lookup from
   left-half cell to the pixel at it, since chSvg only ever returns markup
   and a merged path per fill colour carries no single pixel's identity in
   the document: the nearest cell is solved from the pointer instead of
   found by data-h, chGeo's own note. */
var CH_HOVER={};
/* ONE PIXEL, IN WORDS. Reuses describe()'s own node case rather than a
   second wording of the same address: the name, the seat, what it shows up
   as, the charge held, all of it already right there in ui/ui.js. What this
   adds is the chain the Field's own readout does not carry, because a
   mask's pixel is asking a different question of the same address, how far
   it has built here rather than what it is. */
function chHoverHtml(x,r){
 var t=describe({k:'node',n:x.n},r,true); if(!t)return '';
 var extra='';
 if(x.tier>=1){
  extra='<hr>'+(x.o?'Part of the <b>'+esc(x.o.nm)+'</b> saboteur.':'A saboteur on its own.')
   +(x.cx?' Joined into a complex.':'')+(x.hy?' Inside a hyper complex.':'')
   +(x.sup?' It reaches your character.':'');}
 return t.replace('<hr><b>Click for detail.</b>',extra+'<hr><b>Click the mask for the full reading.</b>');}
/* THE GRID'S BOX, ROUND NK, moved with the egg. The old arc face ran 4 to
   20 across and 3 to 19 down, a 16 unit square it filled edge to edge. The
   egg is narrower and taller, 6.27 to 17.73 across and 5 to 19.8 down, and
   does not fill a 16 unit square the same honest way, so the box is not the
   face's own bounding box any more: it is the one 18 unit square Bjorn
   measured against the drawing in DESIGN-character-effects.md 1, chosen so
   chRow(3,20) through chRow(19,20) land on the egg's own brow to chin and
   rows 0 to 2 sit clear above it, which a tighter box would have put inside
   the face instead of above it. He measured 16 first and it dropped the
   Teen's own crack to zero cells. */
var CH_X0=3, CH_Y0=2.2, CH_S=18;
/* A MARK IS A PHYSICAL WIDTH, in the icon's own units, and not a pixel
   count. The first cut stroked it one cell wide, so the Child's eye was a
   quarter of the size at 32 across that it was at 16, and a finer grid drew
   a different face. A finer grid draws the same face in more pixels. */
var CH_MARKW=1.25;
/* THREE INSETS, THREE JOBS, round LT. Held pixels widened from .06 so the
   fill has visible gaps between cells rather than reading as a solid wash.
   The rim pulled in to near solid, a silhouette rather than a dotted line.
   The mark stays close to its old .06, a confident line rather than a
   field of small squares. The background stipple keeps its own .33, the
   fine dot texture that was never the complaint. */
var CH_FILL_INS=.10, CH_RIM_INS=.025, CH_MARK_INS=.05, CH_BG_INS=.33;
/* the archetype's glow, dead centre of the face (see the geometry note in
   chSvg for why G/2 is also the icon anchor in grid units), replacing the
   icon scan round LT retired. Radius as a share of the grid, so it scales
   with G the way everything else here does. */
var CH_GLOW_R=.30;
var CH_UID=0; /* one glow per card can share the page with its own drill pair, so the gradient id is never reused twice at once */
/* THE GRID SCALES WITH WHAT HAS FORMED UNDER THE MASK. His words: "So if a
   person goes over a certain amount, the grid will dynamically scale." The
   amount is the engine's own: a saboteur forms when the mean charge on its
   addresses reaches 3.7, and a complex when two saboteurs of one family are
   both running (engine/compute.js). So a mask is 20 pixels across while
   only loose fetters sit under it, 28 once a saboteur runs there, and 36
   once one of those saboteurs has joined a complex. THESE THREE MOVED WITH
   THE EGG, ROUND NK, from 16, 24 and 32: the old arc face filled its own 16
   unit box edge to edge, and the egg does not, so the box grew to the 18
   unit square DESIGN-character-effects.md 1 measures against, and CH_RES
   grew with it rather than leaving the grid a size narrower than the box
   it now sits inside.

   Why those three steps and not a count of entries. A saboteur is four
   addresses drawn as one block, and Root and Sacral between them carry 32
   addresses, so at 20 across, 60 half face cells over 32 addresses, a block
   of four runs about seven or eight pixels with a spacer taken out of it
   and its weight rounded to thirds of a place. At 28 across the same half
   face holds 128 cells and the block is about sixteen; at 36 across it
   holds 218 and the block is about twenty seven, where a complex's two
   blocks have room to read as two things joined. Measured against the
   current roster of addresses rather than quoted from the arc face's own
   figures, which this file no longer builds against. The finer grid arrives
   when there is structure that needs it, and it arrives at the two moments
   he tied to a reward: "if you create a saboteur if you create a Complex it
   gets you your reward for it."

   Either reading counts, light or dark, so pressing Light never changes the
   grid under it: the grid belongs to the mask, and the reading is what
   lights it. */
var CH_RES=[20,28,36];
var _CHGEO={}, _CHCTX=null;
function chCtx(){
 if(!_CHCTX)_CHCTX=document.createElement('canvas').getContext('2d');
 _CHCTX.setTransform(1,0,0,1,0,0);
 _CHCTX.lineCap='round';_CHCTX.lineJoin='round';
 return _CHCTX;}
function chCell(c,G){return CH_X0+(c+.5)*CH_S/G;}
function chRow(r,G){return CH_Y0+(r+.5)*CH_S/G;}
/* the Hilbert curve's own walk, d to x and y. A run of consecutive places
   along it is a compact blob and never a stripe, which is what makes a
   saboteur a block. At order n the first half of the walk covers exactly the
   left half of the square, so the half face is laid down in one pass. */
function chHilbert(n,d){
 var x=0,y=0,t=d,s,rx,ry,q;
 for(s=1;s<n;s*=2){rx=1&(t/2);ry=1&(t^rx);
  if(ry===0){if(rx===1){x=s-1-x;y=s-1-y;}q=x;x=y;y=q;}
  x+=s*rx;y+=s*ry;t=Math.floor(t/4);}
 return [x,y];}
/* ONE MASK'S FACE AT ONE RESOLUTION, memoised, because it never changes for
   a person: which cells are face, which are rim, which the mark cuts out,
   and the half face's cells in the order the fetters are laid down.

   THE LEFT HALF IS MEASURED AND THE RIGHT IS ITS MIRROR, rather than both
   measured. The outline and all six marks are symmetric about x 12, and
   isPointInPath on a cell centre that sits on the curve can answer one side
   and not the other, which put a single stray pixel on one cheek. */
function chGeo(m,G){
 var key=m.nm+':'+G; if(_CHGEO[key])return _CHGEO[key];
 var g=chCtx(), face=new Path2D(MASK_FACE);
 var md=m.ic.indexOf(MASK_FACE)===0?m.ic.slice(MASK_FACE.length):'';
 var mark=md.trim()?new Path2D(md):null;
 var h=G/2, inF=[], cut=[], c, r;
 for(r=0;r<G;r++){inF[r]=[];cut[r]=[];
  for(c=0;c<h;c++){var x=chCell(c,G), y=chRow(r,G);
   inF[r][c]=g.isPointInPath(face,x,y);
   g.lineWidth=CH_MARKW; cut[r][c]=!!mark&&g.isPointInStroke(mark,x,y);}
  for(c=h;c<G;c++){inF[r][c]=inF[r][G-1-c];cut[r][c]=cut[r][G-1-c];}}
 var at=function(c,r){return r>=0&&r<G&&c>=0&&c<G&&inF[r][c];};
 var rim=[], half=[], grid=[], mk=[];
 for(r=0;r<G;r++)for(c=0;c<G;c++){if(!inF[r][c])continue;
  var edge=!at(c-1,r)||!at(c+1,r)||!at(c,r-1)||!at(c,r+1);
  /* the rim holds whatever the mark does: the Teen's split is "held
     together from outside", so it cuts the face and never the rim */
  if(edge)rim.push([c,r]); else if(cut[r][c])mk.push([c,r]); else grid.push([c,r]);}
 var n=1;while(n<G)n*=2;
 var inner=function(c,r){return inF[r][c]&&!cut[r][c]&&at(c-1,r)&&at(c+1,r)&&at(c,r-1)&&at(c,r+1);};
 for(var d=0;d<n*n;d++){var p=chHilbert(n,d);
  if(p[0]<h&&p[1]<G&&inner(p[0],p[1]))half.push(p);}
 /* GRIDSET, FOR THE SPILL, SECTION 4. The overexpressed mark's one cell
    spill lights every GROUND cell its block touches, never a rim cell and
    never a mark cell, both of which already carry a meaning of their own
    (the membrane and the thing that tells one mask from another). A plain
    object keyed 'c,r' rather than a second pass over grid with indexOf,
    since the spill is computed once a render for every pixel in an over
    group and a linear search there would be the one pass through chSvg
    that quietly goes quadratic on a 36 across face. */
 var gridSet={}; grid.forEach(function(q){gridSet[q[0]+','+q[1]]=1;});
 return (_CHGEO[key]={G:G,rim:rim,half:half,grid:grid,mk:mk,inner:inner,at:at,gridSet:gridSet});}
/* THE ARCHETYPE'S GLOW. Round LT retired the icon scan (chGlyph, the
   removed twin of this function): dead centre of the grid in both axes,
   which is also where the icon anchor always sat (12,11 in the face's own
   24 unit space maps to G/2,G/2 in cell space, chCell/chRow solved for c
   given CH_X0 4, CH_S 16). One point and a radius, not a shape, because the
   finding above is that no shape reads honestly this small. */
function chGlowAt(G){return {cx:G/2,cy:G/2,r:G*CH_GLOW_R};}

/* ============================================================
   SECTION 4, DESIGN-character-effects.md. RUNNING HOT, OUTSIDE THE RIM.

   "Running hot" already means an address past five, RUNHOT_AT in wheel.js,
   and the Field already answers who is running hot and which way they are
   moving (hotTrack, hotDir, frStress, all ui/wheel.js, loaded before this
   file in MANIFEST). Nothing here invents a second notion of hot: it reads
   the same W, the same threshold and the same direction the Field's own
   fringes read, restricted to one mask's own seat rather than the whole
   ring, so a mask and the Field can never disagree about who is loaded.
   ============================================================ */
/* ONE SEAT'S OWN LOAD. Dark reading only, hero only (the caller's job, not
   this function's): the heaviest address at this seat, past RUNHOT_AT, its
   stress on wheel.js's own curve, and the direction wheel.js's own hotTrack
   already keeps per address since the record was opened. null where nothing
   at this seat is hot, which the caller reads as "draw nothing here". */
function chSeatHot(b){
 hotTrack();
 var seg=W.filter(function(n){return n.b===b&&(+n.sq||0)>RUNHOT_AT;});
 if(!seg.length)return null;
 var hot=seg.slice().sort(function(a,b2){return (b2.sq||0)-(a.sq||0);})[0];
 /* exp/col/steady, not hotDir's own full words: chSvg below only ever
    compares against these three short codes, and the first cut called
    hotDir and compared its answer against 'exp', which never matched
    'expanding' and left every seat reading steady regardless of which
    way it was actually moving. */
 return {max:hot.sq,stress:frStress(hot.sq),dir:hot.frDir>0?'exp':(hot.frDir<0?'col':'steady')};}
/* THE SEAT LIFTED TOWARD WHITE OR BLACK, fringeDraw's own "lift" colour in
   ui/wheel.js (mixc(c,[0,0,0],.3) on paper, mixc(c,[255,255,255],.55) on a
   dark stage), ported to a CSS colour string rather than a canvas rgb array
   because every other tone on this page already is one (chTone, chMkTop).
   Same two ratios, .3 toward black and .55 toward white, so the two surfaces
   read as the same load in two rendering systems rather than two readings
   of it. */
function chLift(b){var c=seatCol(b);
 return LIGHT()?'color-mix(in srgb,'+c+' 70%,#000)':'color-mix(in srgb,'+c+' 45%,#fff)';}
/* THREE DOTTED ECHOES OF THE OUTLINE, standing off whichever half of the
   rim belongs to a hot seat (chSvg's own split, first seat on the left and
   last on the right). Each rim cell steps outward along its own direction
   from the grid's centre, which draws a parallel contour rather than a
   patch of noise, and six steps are kept rather than three because the gap
   between echoes tightens from two cells at low stress to one at full, so
   the furthest of three can sit as far out as cell six.

   MEMOISED LIKE chGeo, BY MASK AND RESOLUTION, because the geometry never
   changes for a person: what moves from render to render is which seat is
   hot and how hard, read separately by chSeatHot above and applied at
   draw time in chSvg. */
function chHotGeo(m,G){
 var key=m.nm+':hot:'+G; if(_CHGEO[key])return _CHGEO[key];
 var geo=chGeo(m,G), h=G/2, mid=G/2;
 var step=function(side){
  var out=[], k;
  for(k=1;k<=6;k++)out[k]=[];
  side.forEach(function(q){
   /* the outward direction is the rim cell's own position against the
      grid's centre, rounded to the nearest of eight compass points: a cell
      dead level with the centre on one axis steps straight out on the
      other rather than drifting diagonally, which kept a stray dash
      drifting into the neighbouring seat's own half at the chin and brow */
   var dx=Math.sign(Math.round(q[0]+.5-mid)), dy=Math.sign(Math.round(q[1]+.5-mid));
   if(!dx&&!dy)dy=(q[1]+.5<mid)?-1:1;
   for(k=1;k<=6;k++){var c=q[0]+k*dx, r=q[1]+k*dy;
    if(c>=0&&c<G&&r>=0&&r<G)out[k].push([c,r]);}});
  return out;};
 return (_CHGEO[key]={L:step(geo.rim.filter(function(q){return q[0]<h;})),
  R:step(geo.rim.filter(function(q){return q[0]>=h;}))});}

/* THE CHAIN ABOVE ONE SABOTEUR, read off compute() and nowhere else: the
   complex it is part of, the hyper complex that complex is part of, and the
   character above that. Light reads the overshot chain and dark the other,
   the same split compute() already makes with .over. */
function chChain(r){
 var up={};
 (r.cxs||[]).forEach(function(c){(c.parts||[]).forEach(function(s){if(!up[s.nm])up[s.nm]={cx:c};});});
 (r.hys||[]).forEach(function(h){(h.parts||[]).forEach(function(c){
  (c.parts||[]).forEach(function(s){if(up[s.nm]&&!up[s.nm].hy)up[s.nm].hy=h;});});});
 (r.sups||[]).forEach(function(sp){(sp.parts||[]).forEach(function(h){
  Object.keys(up).forEach(function(k){if(up[k].hy===h&&!up[k].sup)up[k].sup=sp;});});});
 return up;}
/* what each reading lights an address by. Dark is the charge left after the
   opposite, sq. Light is the opposite installed past what is held, pole, or
   where the cure is overdone, jq, whichever is more: "there's a jouissance,
   the part where we overly lean into it", and compute() names that exact
   thing JOUISSANCE, the opposite overshot past 6. */
function chVal(n,face){return face==='light'?Math.max(n.pole||0,n.jq||0):(n.sq||0);}
function chOwn(s,face){return face==='light'?!!s.over:!s.over;}
/* the grid a mask is drawn at, off both readings: see CH_RES */
function chRes(m,r){
 if(!r||r.unread)return CH_RES[0];
 var under=function(s){return (s.parts||[]).some(function(n){return n&&m.b.indexOf(n.b)>=0;});};
 var sabs=(r.sabs||[]).filter(under);
 if(!sabs.length)return CH_RES[0];
 var up=chChain(r);
 return sabs.some(function(s){return up[s.nm]&&up[s.nm].cx;})?CH_RES[2]:CH_RES[1];}

/* ONE MASK, ONE READING. Returns the pixels and everything the summary
   says, so the grid and the words are read off one pass and cannot
   disagree. */
function chRead(m,r,face,G){
 G=G||chRes(m,r);
 var geo=chGeo(m,G), H=geo.half.length;
 var seg=W.filter(function(n){return m.b.indexOf(n.b)>=0;});
 var out={m:m,face:face,G:G,N:seg.length,px:[],groups:[],held:0,sabs:[],cxs:[],hys:[],sup:null,arch:null,aff:0,lit:0,
  unread:!r||!!r.unread};
 /* the archetype under this mask the blueprint leans on hardest */
 ARCH.forEach(function(a,j){
  if(m.b.indexOf(a.b)<0)return;
  var v=(r&&r.aff)?(r.aff[j]||0):0;
  if(!out.arch||v>out.aff){out.arch=a;out.aff=v;}});
 if(!r||r.unread)return out;
 var up=chChain(r), own={}, groups=[];
 (r.sabs||[]).filter(function(s){return chOwn(s,face);}).forEach(function(s){
  var mine=(s.parts||[]).filter(function(n){return n&&m.b.indexOf(n.b)>=0&&!own[n.i];});
  if(!mine.length)return;
  var u=up[s.nm]||{}, gp={o:s,ns:mine,tier:u.hy?3:u.cx?2:1,cx:u.cx||null,hy:u.hy||null,sup:u.sup||null};
  mine.forEach(function(n){own[n.i]=gp;});
  groups.push(gp);});
 seg.filter(function(n){return !own[n.i]&&chVal(n,face)>=1;})
  .sort(function(a,b){return chVal(b,face)-chVal(a,face);})
  .forEach(function(n){groups.push({o:null,ns:[n],tier:0});});
 var rest=seg.filter(function(n){return !own[n.i]&&chVal(n,face)<1;});
 if(rest.length)groups.push({o:null,ns:rest,tier:-1});
 out.groups=groups;
 out.held=seg.filter(function(n){return chVal(n,face)>=1;}).length;
 /* every address has a home, in this order, and a home is the same size for
    every address under the mask: cumulative, so the whole half face is
    handed out and none is left over at the chin */
 var k=0, N=seg.length;
 groups.forEach(function(gp){
  var a0=Math.floor(k*H/N), cells=[];
  gp.ns.slice().sort(function(a,b){return chVal(b,face)-chVal(a,face);}).forEach(function(n){
   var len=Math.floor((k+1)*H/N)-Math.floor(k*H/N); k++;
   /* under 1 is not held, the line every surface already draws, so it
      lights nothing even where a share of a long run would round to one */
   var v=chVal(n,face), lit=v>=1?Math.round(len*Math.min(10,v)/10):0;
   for(var i=0;i<lit;i++)cells.push(n);});
  var run=Math.floor(k*H/N)-a0;
  /* a block keeps one dark place at its end, so two saboteurs laid down
     side by side along the walk are two blocks and not one.

     OVERSHOT IS THE ONE EXCEPTION, DESIGN-character-effects.md 4. Every real
     saboteur group a light reading ever shows is already over (chOwn above
     filters light to !!s.over, so gp.o.over is never false here), and the
     engine's own words for what that state is are "will not shut, rather
     than will not open." The one cell this block would otherwise give back
     dark is the shutting: skipped for an over group, so its own block runs
     to the full width the walk allotted it and never closes against its
     neighbour. Dark groups, and the loose and rest groups with no gp.o,
     keep the gap exactly as before. */
  if(run>1&&cells.length>=run&&!(gp.o&&gp.o.over))cells.length=run-1;
  cells.forEach(function(n,i){out.px.push({p:geo.half[a0+i],n:n,tier:gp.tier,o:gp.o,cx:gp.cx,hy:gp.hy,sup:gp.sup});});});
 out.lit=out.px.length;
 var seen=function(list,o){if(o&&list.indexOf(o)<0)list.push(o);};
 groups.forEach(function(gp){if(!gp.o)return;
  seen(out.sabs,gp.o);seen(out.cxs,gp.cx);seen(out.hys,gp.hy);if(gp.sup&&!out.sup)out.sup=gp.sup;});
 return out;}

/* THE PALETTE RAMP. The seat colour is the mask's colour, MK2: "made up of
   the chakra colours of our masks", and each lit pixel wears the seat of the
   address it belongs to, so a two seat mask shows both. Dark is the seat
   colour at depth, dimmest for a loose fetter and full once a complex has
   formed, with the hyper complex mixed toward the ink as the hottest step.
   Light is the same ramp mixed half way to the ink, so a light mask reads
   pale where the dark one reads deep. Mixed toward --ink and not toward
   white: on the paper themes the ink is dark, and a tint toward white on a
   near white stage was a pixel nobody could see. */
/* ROUND LT, SOL'S READING. The loose step sat at .34 of full colour, and a
   worked ICP holds most of what a two seat mask covers (26 of 32 on James's
   Child), so almost the whole interior sat at or near that one step and the
   card read as a wash rather than a ramp. Pulled down to .20, with the
   saboteur and complex steps left where they were, so the climb from loose
   to built is the thing that now carries the eye. */
var CH_OP={dark:[.20,.62,1,1],
 /* the light ramp starts higher: a pale tint at a third opacity on the black
    ground measured as a grey brown, so Derek's light mask, all loose
    opposites and nothing overshot, read as a darker mask than his dark one */
 light:[.38,.78,1,1]};
function chTone(b,tier,face){
 var C=seatCol(b);
 if(face==='light')return tier>=3?'color-mix(in srgb,'+C+' 22%,var(--ink))':'color-mix(in srgb,'+C+' 52%,var(--ink))';
 return tier>=3?'color-mix(in srgb,'+C+' 64%,var(--ink))':C;}
/* THE MASK'S OWN TOP SEAT, for the selected pool, head.html's --mk-top.
   m.b already runs low seat to high (Child ['Root','Sacral'], Adult
   ['Sacral','Solar'], and so on), the same order chSvg's own rim reads
   off when it colours the right half of the face by rd.m.b[rd.m.b.length-1]
   rather than the left: reused here rather than adding a second "which
   seat is this mask's own colour" lookup next to that one. */
function chMkTop(m){return seatCol(m.b[m.b.length-1]);}
/* ONE GRID AS SVG. A document, so the Selection panel can carry the same
   drawing, and so the render watch reads its markup: a canvas has no
   innerHTML, which is the lesson monitor.js already records about the Field.
   One path per colour and opacity, so a 32 across face is a handful of
   elements and not a thousand rects. The rim's own paths sit in their own
   group now, round LT, so a CSS animation can address the rim alone: see
   the breathing note where lit is set below.

   WEAVENAME, ROUND NH, the fourth argument every older caller leaves out.
   "I'm able to select the saboteur clusters, I'm able to see different
   effects... if you select it on one mask, then you see how it shows up in
   all the others" (MX). A saboteur's own addresses can sit under more than
   one mask's seats, so the same name can match a pixel here even on a card
   this call was never asked to treat as the hero: the ring below is drawn
   on whichever of this mask's own held pixels belong to it, nothing more.

   HERO, THE FIFTH ARGUMENT, DESIGN-character-effects.md 4, round NK's own
   effects pass. Running hot is drawn outside the rim only on the hero: a
   rail icon is 48 pixels and the dashes the design calls for would be noise
   at that size, and the design's own words say so, "hero only". Every
   caller that is not renderCharacter's own hero figure leaves this false. */
function chSvg(rd,cls,label,weaveName,hero){
 var G=rd.G, geo=chGeo(rd.m,G), paths={}, rimPaths={}, markPaths={}, on={};
 var addTo=function(dict,fill,op,c,r,inset){
  var key=fill+'|'+op+'|'+inset, s=(1-2*inset);
  (dict[key]=dict[key]||[]).push('M'+(+(c+inset).toFixed(2))+' '+(+(r+inset).toFixed(2))+'h'+s+'v'+s+'h-'+s+'z');};
 var render=function(dict){return Object.keys(dict).map(function(k){var p=k.split('|');
  return '<path style="fill:'+p[0]+'" fill-opacity="'+p[1]+'" d="'+dict[k].join('')+'"/>';}).join('');};
 var add=function(fill,op,c,r,inset){addTo(paths,fill,op,c,r,inset);};
 var sq=function(c,r,inset){var s=1-2*inset;
  return 'M'+(+(c+inset).toFixed(2))+' '+(+(r+inset).toFixed(2))+'h'+s+'v'+s+'h-'+s+'z';};
 /* THE WEAVE'S OWN CELLS, SECTION 5, DRAWN APART FROM EVERY OTHER FILL.
    A saboteur's own block always used to merge into the one dict every
    other fill shares, which is right until a saboteur is the thing picked:
    the weave-alone motion then needs to dim everything else behind one
    group (chv-rest, below) and to walk a highlight through its own cells
    one at a time, and neither reads off a single merged <path d="..."> with
    every cell of every colour flattened into it. So a cell that belongs to
    the woven saboteur is drawn on its own, in the walk's own order (the
    order rd.px already carries it in, chRead's own Hilbert walk), and
    everything else still merges exactly as it always did. */
 var weaveOn=!!weaveName&&rd.px.some(function(x){return x.o&&x.o.nm===weaveName;});
 var waveN=0, waveCells=[], waveOver=false, waveSusc=0;
 rd.px.forEach(function(x){
  var f=chTone(x.n.b,x.tier,rd.face), op=CH_OP[rd.face==='light'?'light':'dark'][Math.max(0,x.tier)];
  var qs=[[x.p[0],x.p[1]],[G-1-x.p[0],x.p[1]]];
  if(weaveOn&&x.o&&x.o.nm===weaveName){
   /* STILL IF OVEREXPRESSED, SECTION 4's OWN RULE CARRIED INTO SECTION 5.
      "It holds visually still while the mask breathes." A saboteur any
      light reading ever shows is already over (chOwn), so a weave set
      while CHV.face is light is always this case: the walk below never
      runs on it, waveOver instead, which head.html reads as a fixed
      highlight rather than one that marches. */
   if(x.o.over)waveOver=true;
   waveSusc+=((x.n&&x.n.susc)||1); waveN++;
   waveCells.push('<g class="chv-weavecell" style="--i:'+(waveN-1)+'">'
    +qs.map(function(q){on[q[0]+','+q[1]]=1;
     return '<path style="fill:'+f+'" fill-opacity="'+op+'" d="'+sq(q[0],q[1],CH_FILL_INS)+'"/>';}).join('')
    +'</g>');
  } else qs.forEach(function(q){on[q[0]+','+q[1]]=1;add(f,op,q[0],q[1],CH_FILL_INS);});});
 /* THE WALK'S OWN SPEED, wheel.js's own tension (ten01 near its pulses(),
    "a taut chord is one the person is susceptible at"), ported rather than
    re-derived: a step runs 180ms slack to 90ms taut, so a saboteur built on
    addresses this person is more susceptible at marches faster through its
    own block, the same reason a taut thread carries a faster pulse there. */
 var waveStep=waveN?(180-90*Math.max(0,Math.min(1,((waveSusc/waveN)-0.45)/0.85))):180;
 geo.grid.forEach(function(q){var k=q[0]+','+q[1];if(on[k])return;
  add('var(--ink)','.08',q[0],q[1],CH_BG_INS);});
 /* THE SPILL, SECTION 4'S OVEREXPRESSED. The engine's own words for o.over
    are "will not shut, rather than will not open," and chRead above already
    keeps the block's own end cell lit rather than dark for exactly this
    reason. What follows is the other half of that sentence: a one cell
    spill at a flat .30, on every GROUND cell (geo.gridSet, never a rim cell
    and never a mark, both of which already answer a different question)
    that touches one of the group's own cells, the address getting out
    rather than a second reading of how built the group is. Light reading
    only, since chOwn above never shows an over group on dark, and computed
    once a render in its own pass rather than inside the loop above, because
    it needs `on` fully settled first: a spill is only ever onto a cell
    nothing else has already lit. A Set keeps two cells that share a
    neighbour from drawing it twice. */
 var spill={};
 if(rd.face==='light'&&!rd.unread){
  var seenG={}, nb=[[1,0],[-1,0],[0,1],[0,-1]];
  rd.px.forEach(function(x){
   if(!(x.o&&x.o.over))return;
   var tone=chTone(x.n.b,x.tier,rd.face);
   [[x.p[0],x.p[1]],[G-1-x.p[0],x.p[1]]].forEach(function(q){
    nb.forEach(function(d){var c=q[0]+d[0], r=q[1]+d[1], key=c+','+r;
     if(geo.gridSet[key]&&!on[key]&&!seenG[key]){seenG[key]=1; addTo(spill,tone,'.30',c,r,CH_FILL_INS);}});});});}
 /* THE ARCHETYPE'S GLOW, round LT, replacing the icon scan. A radial
    gradient behind everything else, so an opaque held pixel drawn after it
    covers it exactly where the chain has built over the foundation, the
    same "shows only where nothing is lit yet" rule the icon kept, now for
    free from paint order instead of a per cell check. */
 var glow='';
 if(rd.arch&&!rd.unread){
  var gp=chGlowAt(G), gid='chvglow'+(CH_UID++);
  var fop=(.10+.16*Math.max(0,Math.min(1,rd.aff))).toFixed(2);
  glow='<defs><radialGradient id="'+gid+'" cx="'+gp.cx+'" cy="'+gp.cy+'" r="'+gp.r.toFixed(2)
   +'" gradientUnits="userSpaceOnUse">'
   +'<stop offset="0" stop-color="'+seatCol(rd.arch.b)+'" stop-opacity="'+fop+'"/>'
   +'<stop offset="1" stop-color="'+seatCol(rd.arch.b)+'" stop-opacity="0"/></radialGradient></defs>'
   +'<circle class="chv-glow" cx="'+gp.cx+'" cy="'+gp.cy+'" r="'+gp.r.toFixed(2)+'" fill="url(#'+gid+')"/>';}
 /* RUNNING HOT, SECTION 4, OUTSIDE THE RIM. Dark reading, hero only (the
    caller says so with the fifth argument), and silent where chSeatHot
    answers null: a mask nobody has loaded past RUNHOT_AT never draws a
    dash. Three echoes a side, at the radius the stress itself sets (tight
    at high load, two cells apart at low), alternating the seat's own
    colour and the same seat lifted toward white or black, and the nearest
    echo turns into a solid continuation of the rim once any address here
    has crossed 6.5, the design's own "the rim itself pushing out one
    cell" read as the rim's first echo losing its dots rather than the
    rim's own geometry moving, which this grid has no room to do once it
    is laid out. The direction class (chv-hot-exp, -col, -steady) is what
    head.html's own keyframe reads to decide whether the dashes travel
    out, in, or simply breathe; reduced motion freezes that travel and
    this alpha, set here and not by the animation, is what is left
    standing when it does. */
 var hotBand='';
 if(hero&&rd.face==='dark'&&!rd.unread){
  var hg=chHotGeo(rd.m,G), groups=[];
  [['L',rd.m.b[0]],['R',rd.m.b[rd.m.b.length-1]]].forEach(function(sv){
   var side=sv[0], b=sv[1], info=chSeatHot(b); if(!info)return;
   var gap=Math.max(1,Math.min(2,2-info.stress)), alpha=Math.pow(info.stress,1.3).toFixed(2);
   var pushed=info.max>=6.5, dirCls=info.dir==='exp'?'chv-hot-exp':(info.dir==='col'?'chv-hot-col':'chv-hot-steady');
   for(var e=0;e<3;e++){
    var k=Math.max(1,Math.min(6,Math.round((e+1)*gap))), cells=(hg[side]||[])[k]||[];
    if(!cells.length)continue;
    var solid=(e===0&&pushed), tone=solid?chTone(b,2,rd.face):(e%2?chLift(b):seatCol(b));
    var op=solid?(rd.sup?'1':'.85'):alpha, dict={};
    cells.forEach(function(q){addTo(dict,tone,op,q[0],q[1],CH_BG_INS);});
    groups.push('<g class="chv-hotcell '+dirCls+'" style="--k:'+e+'">'+render(dict)+'</g>');}});
  if(groups.length)hotBand='<g class="chv-hotband">'+groups.join('')+'</g>';}
 /* the rim is the mask's own seats, first seat on the left and last on the
    right, faint until the chain reaches the character, then lit, and
    breathing while it is: see .chv-rim-on in head.html */
 var lit=!!rd.sup;
 geo.rim.forEach(function(q){var b=q[0]<G/2?rd.m.b[0]:rd.m.b[rd.m.b.length-1];
  addTo(rimPaths,lit?chTone(b,2,rd.face):seatCol(b),lit?'1':'.3',q[0],q[1],CH_RIM_INS);});
 /* THE MARK IS DRAWN IN var(--ink) NOW, round LT, not the mask's own seat
    colour. It always sat in the same colour family as the fetter pixels
    around it, seat colour on seat colour, so the one thing that tells a
    Child from a Teen was camouflaged by the thing it needed to stand out
    against. Ink is fixed against the stage in every reading and every
    theme, and it steps up when the chain reaches the character, same as
    the rim, so the two light together.

    ITS OWN DICT NOW, SECTION 5: the weave-alone motion holds the mark
    still while the rest of the hero falls to .08 ("rim and marks hold"),
    which only reads true if the mark is never inside the group that
    falls. It used to share `paths` with every fetter fill and would have
    dimmed with them. */
 /* .52, NOT .68, ROUND MQ: measured against the ground this mark has to
    read against now that a shadow sits under it. .52 holds 5.02:1 in Dark
    and 3.51:1 in Snow, the 3:1 floor for a graphic; .44 reads sharper on
    Dark but fails Snow at 2.78:1, so .52 is the floor and not a taste. */
 geo.mk.forEach(function(q){
  addTo(markPaths,'var(--ink)',lit?'.95':'.52',q[0],q[1],CH_MARK_INS);});
 /* THE WEAVE'S OWN RING, ROUND NH. A stroke and never a fill, because the
    cell underneath already carries the tier's own tone (chTone) and a
    second fill would answer a different question, how hot this pixel runs,
    with a colour meant to answer this one, where else it runs. Mirrored the
    same way every fill above already is, since rd.px only ever names the
    left half. */
 var weave='';
 if(weaveName){
  var hits=rd.px.filter(function(x){return x.o&&x.o.nm===weaveName;}), wp=[];
  hits.forEach(function(x){[[x.p[0],x.p[1]],[G-1-x.p[0],x.p[1]]].forEach(function(q){
   var i=CH_FILL_INS, s=1-2*i;
   wp.push('M'+(+(q[0]+i).toFixed(2))+' '+(+(q[1]+i).toFixed(2))+'h'+s+'v'+s+'h-'+s+'z');});});
  if(wp.length)weave='<path class="chv-weavepx" fill="none" stroke="var(--accent)" stroke-width=".12" d="'+wp.join('')+'"/>';}
 /* THE REST, IN ITS OWN GROUP, SECTION 5. Everything that is not the weave
    and not a mark: every fetter and saboteur fill, the ground stipple and
    the spill. Named chv-rest because that is the question it answers for
    head.html's own CSS, "is this outside the woven block," and it is the
    group that falls to .08 while a saboteur is picked, the Field's own
    Fall number (DESIGN-character-effects.md 3), the same .08 the ground
    stipple already sat at, which is why a ground cell dimming further is
    not visible: it was already there. Not grouped when nothing is woven,
    since an extra <g> around a hero that never weaves would be markup
    with no job. */
 var rest=render(paths)+render(spill);
 /* THE WALK ITSELF, SECTION 5, built on PULSE from section 3: one cell of
    the woven block brightened at a time, in the order it was laid down,
    which is already "hand out of pocket order" since that order is the
    Hilbert walk a block is built from. --n and --step are read by
    head.html's own keyframe; chv-weaveband-still freezes it for an
    overexpressed group rather than animating a block the design calls
    for holding visibly still. */
 var waveBand=waveCells.length
  ?'<g class="chv-weaveband'+(waveOver?' chv-weaveband-still':'')+'" style="--n:'+waveN+';--step:'+Math.round(waveStep)+'ms">'
   +waveCells.join('')+'</g>':'';
 return '<svg class="'+cls+'" viewBox="0 0 '+G+' '+G+'" data-chres="'+G+'" data-chlit="'+rd.lit+'"'
  +(label?' role="img" aria-label="'+esc(label)+'"':' aria-hidden="true"')+'>'
  +glow+'<g class="chv-rest">'+rest+'</g>'+render(markPaths)+waveBand+weave+hotBand
  +'<g class="chv-rim'+(lit?' chv-rim-on':'')+'">'+render(rimPaths)+'</g>'
  +'</svg>';}

function chSentence(v){v=String(v||'');return v.charAt(0).toUpperCase()+v.slice(1)+'.';}
function chSeats(m){return m.b.map(function(b){return b==='3rd Eye'?'3rd eye':b.toLowerCase();}).join(' and ');}
function chPl(n,one,many){return n+' '+(n===1?one:many);}
function chAnd(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
/* HOW FAR UP THE CHAIN ONE READING HAS BUILT, as two sentences at most. A
   complex pairs two saboteurs of one family and the other may run under a
   different mask, so the count is of the saboteurs here that are part of
   one, never "pairs of them": the first cut said six complexes were pairs
   of seven saboteurs, which is arithmetic the page could not have meant. */
function chUp(rd){
 var n=rd.sabs.length, k=rd.groups.filter(function(g){return g.o&&g.cx;}).length, o='';
 if(k)o+=' '+(k===n&&n>1?'All of them are':k+' of them '+(k===1?'is':'are'))+' part of a complex.';
 if(rd.hys.length)o+=' The '+esc(chAnd(rd.hys.map(function(y){return y.nm;})))
  +(rd.hys.length===1?' family has built up into a hyper complex.':' families have built up into hyper complexes.');
 return o;}

/* ============================================================
   SECTION 5, DESIGN-character-effects.md. THE INFORMATION LAYER.

   Three depths for the right column: the page on open with nothing pressed
   yet (chOverview), one mask pressed (chDrill, already built, extended
   below with chCounts) and a saboteur picked off the weave (runDrill, in
   ui/drills.js, extended there with "Runs under").
   ============================================================ */
/* THE HIGHEST THING BUILT, in one word, canon's own vocabulary for the
   chain (chSvg's own tiers, CHAINGLYPH's own kinds) rather than a second
   name invented for this row. Checked top down because each one implies
   every name below it: a character layer cannot exist without a hyper
   complex under it, nor that without a complex, nor that without a
   saboteur running. */
function chBuiltWord(dk){
 if(dk.sup)return 'character';
 if(dk.hys.length)return 'hyper complex';
 if(dk.cxs.length)return 'complex';
 if(dk.sabs.length)return 'saboteur';
 if(dk.held)return 'fetter';
 return 'clear';}
/* HOW MANY OF A MASK'S OWN ADDRESSES ARE RUNNING HOT, wheel.js's own
   RUNHOT_AT and nothing invented beside it, the same count chSvg's own
   running hot fringes are reading when they decide whether to draw at
   all. Reading dependent on nothing: hot is a fact about sq, not about
   which face is on screen. */
function chHotCount(m){
 hotTrack();
 return W.filter(function(n){return m.b.indexOf(n.b)>=0&&(+n.sq||0)>RUNHOT_AT;}).length;}
/* A THREE BY THREE CROP OF THE REAL GRID, centred on one real cell, so a
   count in Selection carries a sample of the actual pixels it is counting
   rather than a bare number next to a claim about them. Built off the same
   rd this count was read from, cell by cell: a fill the reading lit, the
   ground stipple where geo says there is face and nothing lit it, or
   nothing at all past the egg's own edge, which is why a corner of the
   crop can come back empty, a face is round and a crop is square. */
function chSampleSvg(rd,c0,r0){
 var G=rd.G, geo=chGeo(rd.m,G), tones={};
 rd.px.forEach(function(x){var f=chTone(x.n.b,x.tier,rd.face);
  [[x.p[0],x.p[1]],[G-1-x.p[0],x.p[1]]].forEach(function(q){tones[q[0]+','+q[1]]=f;});});
 var cells=[];
 for(var dr=-1;dr<=1;dr++)for(var dc=-1;dc<=1;dc++){
  var c=c0+dc, r=r0+dr, key=c+','+r, f=tones[key];
  if(!f&&!geo.gridSet[key])continue;
  cells.push('<rect x="'+(dc+1)+'" y="'+(dr+1)+'" width="1" height="1" fill="'+(f||'var(--ink)')+'" fill-opacity="'+(f?1:.08)+'"/>');}
 return '<svg class="chv-samp" viewBox="0 0 3 3" aria-hidden="true">'+cells.join('')+'</svg>';}
/* THE THREE COUNTS THAT LEAD A MASK'S OWN DRILL. Running hot off the dark
   reading, how built off the dark reading's own chain, overshot off the
   light reading, each paired with a real px entry to crop a sample from:
   the heaviest hot address, the highest tiered pixel, the first overshot
   one. null where there is nothing to show, which chSampleSvg's caller
   below reads as an empty crop rather than guessing at one. */
function chCounts(m,dk,lt){
 var hotN=chHotCount(m);
 var hotPx=dk.px.filter(function(x){return (+x.n.sq||0)>RUNHOT_AT;}).sort(function(a,b){return (b.n.sq||0)-(a.n.sq||0);})[0]||null;
 var hiPx=dk.px.reduce(function(a,x){return (!a||x.tier>a.tier)?x:a;},null);
 var overN=lt.sabs.length;
 var overPx=lt.px.filter(function(x){return x.o&&x.o.over;})[0]||null;
 var tile=function(val,label,px,rd){
  return '<div class="chv-ct">'
   +(px?chSampleSvg(rd,px.p[0],px.p[1]):'<svg class="chv-samp" viewBox="0 0 3 3" aria-hidden="true"></svg>')
   +'<div class="chv-ct-v">'+esc(String(val))+'</div><div class="chv-ct-lb">'+esc(label)+'</div></div>';};
 return '<div class="chv-counts">'
  +tile(hotN,'running hot',hotPx,dk)+tile(chBuiltWord(dk),'how built',hiPx,dk)+tile(overN,'overshot',overPx,lt)
  +'</div>';}
/* DEPTH 1: THE PAGE ON OPEN, BEFORE ANY PRESS. "Your character", a row a
   mask in canon order (MASKS_READ, never resorted, the rule this whole
   file already keeps), a small icon in the mask's own current grid, its
   name, the highest thing built there in one word and how many of its own
   addresses are running hot. The hero's own row carries the same pool
   token (--mk-top) the selected rail icon already lights, Petra's "same
   light at two sizes" carried a third size. A row is a rail press with
   extra words on it: pressing it sets the hero and opens chDrill exactly
   the way the rail icon under the same name already does. */
function chOverview(r,heroNm){
 var rows=MASKS_READ.map(function(m){
  var dk=chRead(m,r,'dark'), unread=!r||r.unread;
  var word=unread?'clear':chBuiltWord(dk), hot=unread?0:chHotCount(m), isHero=m.nm===heroNm;
  return '<button type="button" class="chv-ov-row'+(isHero?' chv-ov-hero':'')+'" data-chovrow="'+esc(m.nm)+'"'
   +(isHero?' style="--mk-top:'+chMkTop(m)+'"':'')+'>'
   +chSvg(dk,'chv-svg chv-ov-ic',null)
   +'<span class="chv-ov-nm">'+esc(m.nm)+'</span>'
   +'<span class="chv-ov-word">'+esc(word)+'</span>'
   +(hot?'<span class="chv-ov-hot">'+hot+' running hot</span>':'')
   +'</button>';});
 var unread=!r||r.unread;
 var h='<div class="pm-eye">Your character</div>'
  +(unread?'<p class="ad-p">Nothing read yet, so there is nothing under any mask. Write what happened on the Story page and they start to fill.</p>'
    :'<p class="ad-p">Five masks, each as far as its own story has built it. Press one for the full reading.</p>')
  +'<div class="chv-ov-rows">'+rows.join('')+'</div>';
 rdShell(h);
 var b=$('rdrill');
 if(b)b.querySelectorAll('[data-chovrow]').forEach(function(el){el.onclick=function(){
  var m=MASKS.filter(function(x){return x.nm===el.getAttribute('data-chovrow');})[0]; if(!m)return;
  CHV.pick=m.nm; if(typeof uiSet==='function')uiSet('chmask',m.nm);
  chDrill(m); render();};});}

/* THE PAGE. Six grids, each under its name, and one switch for the reading.

   ONE SWITCH FOR ALL SIX, NOT TWO BUTTONS ON EACH. He said "maybe this two
   buttons for their masks", and then "all of those form the character",
   which is the six read together in one reading. Two buttons a card is
   twelve controls on a page he asked to be six grids, three times the four
   choices a person holds at once, and it lets the six sit in two readings
   at the same moment, which is a character nobody has. The summary in
   Selection carries both readings of the mask pressed, side by side, so
   the per mask comparison is one press away and not lost. */
/* THE FIELD'S OWN SHADOW, UNDER THE SIX, ROUND MQ. His words: "add look dev
   from the field to masks." Measured first rather than guessed at: the host
   painted flat #101010 at every sample point, and the Field's own Dial view
   pools the person's own shadow at its four diagonals, frShadow in
   ui/rings.js. This calls that same function, prefixed so its ids never
   collide with the Field's own when both are ever in the document together,
   rather than copying its gradients by hand.

   Silent on an unread profile, the same rule frShadow's own caller already
   keeps for the Field. The viewBox is fixed at 1000x1000 rather than read
   off the live host: measuring the host would put a pixel size into the
   cached CHV.html string below, so a window resize would rewrite the host
   and drop the focus a keyboard is sitting on, the exact failure that
   caching exists to prevent. */
function chWash(r){
 if(!r||r.unread)return '';
 var M={W:1000,H:1000,defs:[],L:{shadow:[]},seat:function(b){return hx(seatCol(b));}};
 frShadow(M,r,{pre:'chw'});
 return '<svg class="chv-wash" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">'
  +'<defs>'+M.defs.join('')+'</defs>'+M.L.shadow.join('')+'</svg>';}
/* WHICH MASK OPENS. "It always starts off on the user's last open. First
   time users start off on child" (MX). CHV.pick itself only lives for this
   one session's module, the same as CHV.face always has, so a second visit
   with CHV.pick still null reads the one small preference this page keeps
   on the profile, CURP.ui.chmask, written by uiSet the way every other UI
   preference here already is (ui/account.js). A name the profile does not
   recognise, an older save or a hand edited one, falls back to the first
   of the roster rather than throwing, and the first of the roster is Child
   today because canon.js lists it there, not because this reads a position
   that happens to be zero. */
function chLast(){
 var v=(typeof CURP!=='undefined'&&CURP&&CURP.ui&&CURP.ui.chmask)||'';
 return MASKS_READ.some(function(m){return m.nm===v;})?v:MASKS_READ[0].nm;}
/* THE POINTER TO PIXEL, SHARED. Pulled out of the hover handler below so
   the hero's own click handler, THE WEAVE a few lines down, resolves the
   exact cell the hover tooltip already does, rather than carrying a second
   copy of the same arithmetic that quietly drifts from the first the next
   time either one is touched. Returns the px entry at the nearest cell, or
   null off the grid, in a dark gap, or before the svg has ever laid out. */
function chCellAt(ch,svg,clientX,clientY){
 var rect=svg.getBoundingClientRect(), G=ch.G;
 if(!rect.width||!rect.height)return null;
 var c=Math.max(0,Math.min(G-1,Math.floor((clientX-rect.left)/rect.width*G)));
 var rr=Math.max(0,Math.min(G-1,Math.floor((clientY-rect.top)/rect.height*G)));
 return ch.byCell[(c<G/2?c:G-1-c)+','+rr]||null;}
/* THE RAIL, THE HERO AND THE WEAVE. Rounds MX, MZ and NA, quoted in full
   against his words at `TASKS.md`. The three column grid every mask used to
   share gave each one the same small square and left a wide desktop mostly
   blank below it, exactly what MX calls out: "we have all five masks as
   small icons on the left hand side of the screen... but then it gives us,
   we can maximize the rest of that space." Five icons sit in .chv-rail,
   Child at the top because MASKS_READ already carries child to ideological
   off canon.js and nothing here resorts it, the rule round NA's own
   PRIORITY line is keeping this file to. A press makes that mask the hero,
   the one face the rest of the stage is built around, and calls chDrill for
   it, the same summary the three column grid already opened in Selection,
   so the hero and the right column move together on one press, his own
   words at NA: "a rail press updates the hero and the right column
   together."

   THE WEAVE is CHV.weave, a saboteur's own name and never the object chRead
   just built, because compute() runs fresh on every render and an object
   from the pass before this one would never match the next one's by
   reference, only a name survives that. Clicking a pixel on the HERO, and
   only the hero, that is part of one sets it; clicking the hero anywhere
   else, or the same pixel again, clears it. Every mask's own chSvg call
   below is handed that name regardless of which one is the hero, and rings
   whichever of its own held pixels belongs to it (see weaveName in chSvg).
   That is the technical answer MX left open on purpose, "how the lines draw
   once one mask can be large and the others a rail": no line crosses the
   gap between two sizes of the same face, the pixel on each one answers
   instead, and the rail icon it sits on gets a glow of its own
   (.chv-weave-on) so "does this show up here" reads before a cell inside a
   64 pixel square ever would. */
function renderCharacter(r){
 var host=$('masksview'); if(!host)return;
 /* THE MASKS ARE THE TIER'S, ruled 1 October: "they can't see ... the child
    masks". Each grid is lit by the chain (saboteur, complex, hyper complex,
    and the rim by the character layer), so the page is the picture of what is
    running a person, and below the tier that carries it the host holds the
    lock's own panel and nothing drawn. The door to this page is greyed too
    (lockTabs), so this is the page a person lands on by any other route: a
    stored tab, a drill that names a mask, a plan that lapsed with it open.
    CHV.opened is put back so the overview reopens when the plan covers it,
    and the hover table is emptied so a pointer cannot find a cell of a
    picture that is not there. */
 if(!lockSees('mask')){
  CHV.opened=false; CHV.html=""; Object.keys(CH_HOVER).forEach(function(hk){delete CH_HOVER[hk];});
  var lh='<div class="lk-page">'+lockPanelHtml('mask')+'</div>';
  if(host._lk!==lh){host._lk=lh; host.innerHTML=lh;}
  return;}
 host._lk=null;
 if(!CHV.pick)CHV.pick=chLast();
 var unread=!r||r.unread, heroM=null, heroRd=null;
 var cards=MASKS_READ.map(function(m){
  var rd=chRead(m,r,CHV.face), on=CHV.pick===m.nm;
  if(on){heroM=m;heroRd=rd;}
  /* the hover's own lookup, left-half cell to the pixel drawn there, built
     on the same pass that reads the mask so the overlay never disagrees
     with what is on screen. Keyed by mask name because five cards and the
     hero all render at once and a pointer is only ever over one of them;
     the hero shares this entry with its own rail icon rather than getting
     a second one, since chRead is deterministic on the same inputs. */
  var byCell={};
  rd.px.forEach(function(x){byCell[x.p[0]+','+x.p[1]]=x;});
  CH_HOVER[m.nm]={G:rd.G,byCell:byCell,r:r};
  var weaveOn=!!CHV.weave&&rd.px.some(function(x){return x.o&&x.o.nm===CHV.weave;});
  var say=m.nm+' mask, '+CHV.face+' reading. It '+m.v+'.';
  /* THE NAME COMES OFF THE RAIL, ROUND NK: "I don't want the buttons that
     tall. Shrink the icons down. Remove the name above it so you get more
     space of the icons. And then keep the name above the major symbol,"
     his own word for the hero. The label is not lost, only moved: it is
     still read aloud, title and aria-label both already carry it, so a
     screen reader and a long-press tooltip still say which mask this is.
     Only the sighted, always-visible copy comes off, freeing the height
     his own complaint was about. */
  return '<button type="button" class="chv-m'+(weaveOn?' chv-weave-on':'')
   +'" data-chmask="'+esc(m.nm)+'" aria-pressed="'+on+'" title="'+esc(say)+'" aria-label="'+esc(say)+'"'
   +' style="--mk-top:'+chMkTop(m)+'">'
   +chSvg(rd,'chv-svg',null,CHV.weave)+'</button>';}).join('');
 /* heroM is always set: CHV.pick is read off chLast() above the first time
    and off a real press every time after, and both only ever hand back a
    name MASKS_READ actually carries, so exactly one card's own on is true
    and heroRd is that card's own rd, never computed twice. */
 /* THE HERO AND SELECTION OPEN TOGETHER, EVEN ON A FIRST ARRIVAL, ROUND NK.
    NA's own ruling, "a rail press updates the hero and the right column
    together," was built for a press and read as only a press: the hero is
    never blank, chLast() sees to that, but the column it should have
    opened beside stayed silent until the first click. Once, not on every
    render: render() runs on every press anywhere in the app, and writing
    over whatever else Selection is showing on every one of those would
    fight a person reading something unrelated elsewhere.

    WHAT OPENS THERE CHANGED, SECTION 5, DESIGN-character-effects.md 5.
    Petra's own defect: "the page opens with Child as hero and Selection
    silent... chDrill runs only on a press," and the first fix, round NK,
    answered it with chDrill(heroM), the one mask's full summary, on a
    first arrival that had not asked about one mask yet. The design calls
    for a shallower first answer, "Your character," a row per mask and
    nothing pressed: chOverview now opens there instead, and chDrill still
    opens on every real press exactly as it always did, a rail icon's own
    onclick below and an overview row's own, chOverview's own. */
 if(!CHV.opened){CHV.opened=true; chOverview(r,heroM.nm);}
 var heroSay=heroM.nm+' mask, '+CHV.face+' reading, enlarged. It '+heroM.v+'.';
 /* THE HERO'S OWN WRAP, head.html's .chv-hero-wrap, holds the svg alone and
    not the name above it, so the pool's ::before can sit exactly over the
    face it is meant to light rather than over the name and the face both:
    see the sizing note beside .chv-hero-wrap for why that split matters. */
 var hero='<div class="chv-hero" data-chhero="'+esc(heroM.nm)+'">'
  +'<div class="chv-hero-nm">'+esc(heroM.nm)+'</div>'
  +'<div class="chv-hero-wrap" style="--mk-top:'+chMkTop(heroM)+'">'
  +chSvg(heroRd,'chv-svg chv-hero-svg',heroSay,CHV.weave,true)+'</div></div>';
 /* THE WEAVE-ALONE MOTION, SECTION 5. One class on the page's own wrapper,
    read by head.html: the wash drops, the hero's rest falls and its glow
    goes out, and a rail icon that does not carry the weave desaturates,
    all off the one fact a saboteur is picked, rather than this file
    threading a flag through chWash, every card and the rail separately. */
 var html=chWash(r)+'<div class="chv'+(CHV.weave?' chv-weaving':'')+'">'
  +'<div class="chv-top"><div class="seg" role="group" aria-label="Reading">'
  +['dark','light'].map(function(f){return '<button type="button" data-chface="'+f+'" aria-pressed="'+(CHV.face===f)+'">'
   +(f==='dark'?'Dark':'Light')+'</button>';}).join('')+'</div></div>'
  +(unread?'<p class="chv-empty">Nothing read yet, so the masks are empty. Write what happened on the Story page and they start to fill.</p>':'')
  +'<div class="chv-stage"><div class="chv-rail" role="group" aria-label="Masks">'+cards+'</div>'+hero+'</div>'
  +'<div class="probe" id="chprobe"></div></div>';
 /* written only when it changed. render() runs on every press anywhere in
    the app, and rewriting the host each time would drop the focus off the
    card a keyboard is sitting on */
 if(html===CHV.html&&host.firstChild)return;
 CHV.html=html; host.innerHTML=html;
 /* THE HOVER AND THE WEAVE'S LISTENERS, WIRED ONCE. host is the tab's fixed
    door and outlives every render, where the buttons above do not: html is
    only rewritten when it changes, so a listener attached here on every
    call would pile up one more copy of itself on every face toggle. A flag
    on the host is cheaper than a teardown. */
 if(!host._chHover){host._chHover=true;
  host.addEventListener('pointermove',function(e){
   /* a finger has no hover, the Field's own reason, ui/ui.js */
   if(e.pointerType==='touch')return;
   var svg=e.target&&e.target.closest&&e.target.closest('svg.chv-svg');
   var pr=$('chprobe'), grid=host.querySelector('.chv-stage');
   /* the hero carries data-chhero and a rail icon carries data-chmask, two
      names for the same lookup rather than one shared attribute, so the
      click handler below can tell a hero press from a rail press without
      also having to check which class the button wears */
   var btn=svg&&svg.closest('[data-chmask],[data-chhero]');
   var nm=btn&&(btn.getAttribute('data-chmask')||btn.getAttribute('data-chhero'));
   var ch=nm&&CH_HOVER[nm];
   if(!pr||!grid)return;
   if(!svg||!ch){pr.classList.remove('on');return;}
   var x=chCellAt(ch,svg,e.clientX,e.clientY);
   var t=x?chHoverHtml(x,ch.r):'';
   if(!t){pr.classList.remove('on');return;}
   pr.innerHTML=t;
   /* probeAt adds el.offsetLeft to the local x it is given to place pr
      against pr.offsetParent, so el has to be a plain, unpositioned child
      of that same box (.chv, set position:relative above) for the two
      offsets to land in one coordinate space. .chv-stage is that child;
      host itself sits one level further out and does not share it. */
   var gb=grid.getBoundingClientRect();
   probeAt(pr,grid,e.clientX-gb.left,e.clientY-gb.top);});
  host.addEventListener('pointerleave',function(){var pr=$('chprobe'); if(pr)pr.classList.remove('on');});
  /* THE WEAVE'S OWN CLICK, scoped to svg.chv-hero-svg and nothing else, so
     a press on a rail icon never reaches here: that press is a different
     gesture, picking which mask is the hero, wired separately below. */
  host.addEventListener('click',function(e){
   var svg=e.target&&e.target.closest&&e.target.closest('svg.chv-hero-svg');
   var wrap=svg&&svg.closest('[data-chhero]'); if(!wrap)return;
   var nm=wrap.getAttribute('data-chhero'), ch=CH_HOVER[nm]; if(!ch)return;
   var x=chCellAt(ch,svg,e.clientX,e.clientY);
   var m=MASKS_READ.filter(function(mm){return mm.nm===nm;})[0];
   if(x&&x.tier>=1&&x.o){
    CHV.weave=(CHV.weave===x.o.nm)?null:x.o.nm;
    if(CHV.weave)runDrill(x.o); else if(m)chDrill(m);
   } else if(CHV.weave){CHV.weave=null; if(m)chDrill(m);}
   else return;
   render();});}
 host.querySelectorAll('[data-chface]').forEach(function(b){b.onclick=function(){
  CHV.face=b.getAttribute('data-chface'); render();};});
 /* a rail press, never the hero's own click above: picking which mask is
    the hero rather than which pixel on it is the weave. Always sets both
    the hero and Selection together (NA), and there is no toggle back to
    nothing, round NH: the hero is never empty once a reading has rendered
    once, so a second press on the one already open simply redraws it. */
 host.querySelectorAll('.chv-rail [data-chmask]').forEach(function(b){b.onclick=function(){
  var m=MASKS.filter(function(x){return x.nm===b.getAttribute('data-chmask');})[0];
  if(!m)return;
  CHV.pick=m.nm;
  if(typeof uiSet==='function')uiSet('chmask',m.nm);
  chDrill(m); render();};});}

/* THE SUMMARY IN SELECTION. "It gives me a full summary of what that mask
   is doing. How it operates through me. Both light and dark." Both grids
   first, because a question about a drawing is asked with the drawing, then
   what the mask does, what it is built on, and each reading in words read
   off the same pass that drew it. */
function chDrill(m){
 var r=compute(), G=chRes(m,r), dk=chRead(m,r,'dark',G), lt=chRead(m,r,'light',G), rows=[];
 var row=function(o){rows.push(o);var lv=leaves(o), b=(lv[0]||{}).b||m.b[0];
  return '<button type="button" class="chv-row" data-chrow="'+(rows.length-1)+'">'
   +crBadge(b,o.w*10,{size:'sm',raw:o.w.toFixed(1),glyph:'<path d="'+CHAINGLYPH[o.kind]+'"/>',
     title:o.nm+(o.over?', overshot':'')})
   +'<span>'+esc(o.nm)+'</span></button>';};
 var h='<div class="pm-eye">Mask</div><div class="ad-nm">'+esc(m.nm)+'</div>'
  +'<div class="ad-sub">worn over the '+esc(chSeats(m))+'</div>'
  +'<div class="chv-pair">'
  +'<figure>'+chSvg(dk,'chv-svg',m.nm+' mask, the dark reading')+'<figcaption>Dark</figcaption></figure>'
  +'<figure>'+chSvg(lt,'chv-svg',m.nm+' mask, the light reading')+'<figcaption>Light</figcaption></figure></div>'
  +'<div class="pm-eye">What it does</div><p class="ad-p">'+esc(chSentence('It '+m.v))+'</p>';
 if(r.unread){
  h+='<p class="ad-p">Nothing read yet, so this mask is empty. Write what happened on the Story page and it starts to fill.</p>';
  rdShell(h);return;}
 /* THE THREE COUNTS, SECTION 5, DESIGN-character-effects.md 5: "led by
    three counts, each keyed by a 3 by 3 crop of the person's own cells."
    Running hot, how built and overshot, in that order, each with a real
    crop of the grid behind it rather than a bare figure, chCounts below. */
 h+=chCounts(m,dk,lt);
 if(dk.arch)h+='<div class="pm-eye">Built on</div><p class="ad-p">The '+esc(dk.arch.nm)+', which '
  +esc(dk.arch.v)+'. Of the archetypes seated under this mask, it is the one your blueprint leans on most. Its shape sits faint under the pixels.</p>';
 /* THE DARK MASK. What is held, what has clustered, and how far up the
    chain it has built, in that order, the way the chain itself is built. */
 h+='<div class="pm-eye">The dark mask</div><p class="ad-p">';
 if(!dk.held&&!dk.sabs.length)h+='Nothing held under this mask.';
 else{
  /* the count under it and the count carrying, each with its own unit, so
     neither is a bare "26 of the 32" a person has to parse as a score */
  h+='It covers '+dk.N+' addresses. Charge sits at '+chPl(dk.held,'address','addresses')+'.';
  if(dk.sabs.length)h+=' '+chPl(dk.sabs.length,'saboteur runs','saboteurs run')+' here.';
  h+=chUp(dk);
  if(dk.sup)h+=' It reaches your character, the top of the chain, so the rim of the mask is lit.';}
 h+='</p>';
 if(dk.hys.length||dk.sabs.length)h+='<div class="chv-rows">'+dk.hys.map(row).join('')+dk.sabs.slice(0,6).map(row).join('')+'</div>';
 /* THE LIGHT MASK. The opposite that is in, named by the state it installs
    (CHILD.opp, Trust for Fear), and then the part leaned on too hard. */
 var opps=[];
 W.filter(function(n){return m.b.indexOf(n.b)>=0&&(n.pole||0)>=1&&n.cf;}).forEach(function(n){
  var c=CHILD.filter(function(x){return x.nm===n.cf;})[0]; if(c&&opps.indexOf(c.opp)<0)opps.push(c.opp);});
 h+='<div class="pm-eye">The light mask</div><p class="ad-p">';
 if(!lt.held&&!lt.sabs.length)h+='No opposite is in yet under this mask.';
 else{
  var inst=W.filter(function(n){return m.b.indexOf(n.b)>=0&&(n.pole||0)>=1;}).length;
  if(inst)h+='The opposite is in at '+chPl(inst,'address','addresses')+(opps.length?': '+esc(opps.join(', ')):'')+'.';
  if(lt.sabs.length)h+=(inst?' ':'')+chPl(lt.sabs.length,'pattern runs','patterns run')+' past the point where it helps. That is the part you lean on too hard.';
  h+=chUp(lt);
  if(lt.sup)h+=' It reaches your character, so the rim of the mask is lit.';}
 h+='</p>';
 if(lt.hys.length||lt.sabs.length)h+='<div class="chv-rows">'+lt.hys.map(row).join('')+lt.sabs.slice(0,6).map(row).join('')+'</div>';
 rdShell(h);
 /* a row opens that pattern's own drill, the same one the Field's list opens */
 var b=$('rdrill');
 if(b)b.querySelectorAll('[data-chrow]').forEach(function(el){el.onclick=function(){
  var o=rows[+el.getAttribute('data-chrow')]; if(o)runDrill(o);};});}
