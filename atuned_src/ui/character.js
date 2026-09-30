
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
var CHV={face:'dark', pick:null, html:''};
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
/* the face's box inside the icons' 24 unit viewBox. MASK_FACE runs 4 to 20
   across and 3 to 19 down, so the grid is laid over exactly that square. */
var CH_X0=4, CH_Y0=3, CH_S=16;
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
   both running (engine/compute.js). So a mask is 16 pixels across while
   only loose fetters sit under it, 24 once a saboteur runs there, and 32
   once one of those saboteurs has joined a complex.

   Why those three steps and not a count of entries. A saboteur is four
   addresses drawn as one block, and at 16 across a two seat mask gives an
   address about three pixels of the half face, so a block of four is a
   dozen pixels with a spacer taken out of it and its weight rounded to
   thirds of a place. At 24 the same block is about twenty five, and at 32 a
   complex's two blocks have room to read as two things joined. The finer
   grid arrives when there is structure that needs it, and it arrives at the
   two moments he tied to a reward: "if you create a saboteur if you create
   a Complex it gets you your reward for it."

   Either reading counts, light or dark, so pressing Light never changes the
   grid under it: the grid belongs to the mask, and the reading is what
   lights it. */
var CH_RES=[16,24,32];
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
 return (_CHGEO[key]={G:G,rim:rim,half:half,grid:grid,mk:mk,inner:inner});}
/* THE ARCHETYPE'S GLOW. Round LT retired the icon scan (chGlyph, the
   removed twin of this function): dead centre of the grid in both axes,
   which is also where the icon anchor always sat (12,11 in the face's own
   24 unit space maps to G/2,G/2 in cell space, chCell/chRow solved for c
   given CH_X0 4, CH_S 16). One point and a radius, not a shape, because the
   finding above is that no shape reads honestly this small. */
function chGlowAt(G){return {cx:G/2,cy:G/2,r:G*CH_GLOW_R};}

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
     side by side along the walk are two blocks and not one */
  if(run>1&&cells.length>=run)cells.length=run-1;
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
/* ONE GRID AS SVG. A document, so the Selection panel can carry the same
   drawing, and so the render watch reads its markup: a canvas has no
   innerHTML, which is the lesson monitor.js already records about the Field.
   One path per colour and opacity, so a 32 across face is a handful of
   elements and not a thousand rects. The rim's own paths sit in their own
   group now, round LT, so a CSS animation can address the rim alone: see
   the breathing note where lit is set below. */
function chSvg(rd,cls,label){
 var G=rd.G, geo=chGeo(rd.m,G), paths={}, rimPaths={}, on={};
 var addTo=function(dict,fill,op,c,r,inset){
  var key=fill+'|'+op+'|'+inset, s=(1-2*inset);
  (dict[key]=dict[key]||[]).push('M'+(+(c+inset).toFixed(2))+' '+(+(r+inset).toFixed(2))+'h'+s+'v'+s+'h-'+s+'z');};
 var render=function(dict){return Object.keys(dict).map(function(k){var p=k.split('|');
  return '<path style="fill:'+p[0]+'" fill-opacity="'+p[1]+'" d="'+dict[k].join('')+'"/>';}).join('');};
 var add=function(fill,op,c,r,inset){addTo(paths,fill,op,c,r,inset);};
 rd.px.forEach(function(x){
  var f=chTone(x.n.b,x.tier,rd.face), op=CH_OP[rd.face==='light'?'light':'dark'][Math.max(0,x.tier)];
  [[x.p[0],x.p[1]],[G-1-x.p[0],x.p[1]]].forEach(function(q){on[q[0]+','+q[1]]=1;add(f,op,q[0],q[1],CH_FILL_INS);});});
 geo.grid.forEach(function(q){var k=q[0]+','+q[1];if(on[k])return;
  add('var(--ink)','.08',q[0],q[1],CH_BG_INS);});
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
    the rim, so the two light together. */
 /* .52, NOT .68, ROUND MQ: measured against the ground this mark has to
    read against now that a shadow sits under it. .52 holds 5.02:1 in Dark
    and 3.51:1 in Snow, the 3:1 floor for a graphic; .44 reads sharper on
    Dark but fails Snow at 2.78:1, so .52 is the floor and not a taste. */
 geo.mk.forEach(function(q){
  add('var(--ink)',lit?'.95':'.52',q[0],q[1],CH_MARK_INS);});
 return '<svg class="'+cls+'" viewBox="0 0 '+G+' '+G+'" data-chres="'+G+'" data-chlit="'+rd.lit+'"'
  +(label?' role="img" aria-label="'+esc(label)+'"':' aria-hidden="true"')+'>'
  +glow+render(paths)+'<g class="chv-rim'+(lit?' chv-rim-on':'')+'">'+render(rimPaths)+'</g>'
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
function renderCharacter(r){
 var host=$('masksview'); if(!host)return;
 /* the pick goes down with the panel, the way every surface's does. rdClose
    puts down PMPICK and S.pin by name and does not know this one, so it is
    read off the panel itself rather than added to drills.js */
 var rd0=$('rdrill');
 if(CHV.pick&&(!rd0||rd0.style.display==='none'||!rd0.innerHTML))CHV.pick=null;
 var unread=!r||r.unread;
 var cards=MASKS_READ.map(function(m){
  var rd=chRead(m,r,CHV.face), on=CHV.pick===m.nm;
  /* the hover's own lookup, left-half cell to the pixel drawn there, built
     on the same pass that reads the mask so the overlay never disagrees
     with what is on screen. Keyed by mask name because six cards render at
     once and a pointer is only ever over one of them. */
  var byCell={};
  rd.px.forEach(function(x){byCell[x.p[0]+','+x.p[1]]=x;});
  CH_HOVER[m.nm]={G:rd.G,byCell:byCell,r:r};
  var say=m.nm+' mask, '+CHV.face+' reading. It '+m.v+'.';
  return '<button type="button" class="chv-m" data-chmask="'+esc(m.nm)+'" aria-pressed="'+on+'" title="'+esc(say)+'" aria-label="'+esc(say)+'">'
   +'<span class="chv-nm">'+esc(m.nm)+'</span>'+chSvg(rd,'chv-svg')+'</button>';}).join('');
 var html=chWash(r)+'<div class="chv">'
  +'<div class="chv-top"><div class="seg" role="group" aria-label="Reading">'
  +['dark','light'].map(function(f){return '<button type="button" data-chface="'+f+'" aria-pressed="'+(CHV.face===f)+'">'
   +(f==='dark'?'Dark':'Light')+'</button>';}).join('')+'</div></div>'
  +(unread?'<p class="chv-empty">Nothing read yet, so the masks are empty. Write what happened on the Story page and they start to fill.</p>':'')
  +'<div class="chv-grid">'+cards+'</div><div class="probe" id="chprobe"></div></div>';
 /* written only when it changed. render() runs on every press anywhere in
    the app, and rewriting the host each time would drop the focus off the
    card a keyboard is sitting on */
 if(html===CHV.html&&host.firstChild)return;
 CHV.html=html; host.innerHTML=html;
 /* THE HOVER'S OWN LISTENERS, WIRED ONCE. host is the tab's fixed door and
    outlives every render, where the buttons above do not: html is only
    rewritten when it changes, so a listener attached here on every call
    would pile up one more copy of itself on every face toggle. A flag on
    the host is cheaper than a teardown. */
 if(!host._chHover){host._chHover=true;
  host.addEventListener('pointermove',function(e){
   /* a finger has no hover, the Field's own reason, ui/ui.js */
   if(e.pointerType==='touch')return;
   var svg=e.target&&e.target.closest&&e.target.closest('svg.chv-svg');
   var pr=$('chprobe'), grid=host.querySelector('.chv-grid');
   var btn=svg&&svg.closest('[data-chmask]');
   var ch=btn&&CH_HOVER[btn.getAttribute('data-chmask')];
   if(!pr||!grid)return;
   if(!svg||!ch){pr.classList.remove('on');return;}
   /* THE NEAREST CELL, SOLVED FROM THE POINTER. chGeo's own reason: the
      grid is drawn as a handful of merged paths, one per fill colour, so
      no single pixel carries its own element to read a hit off. Mirrored
      past G/2 because rd.px only ever names the left half, chSvg's own
      mirror for the right. */
   var rect=svg.getBoundingClientRect(), G=ch.G;
   if(!rect.width||!rect.height){pr.classList.remove('on');return;}
   var c=Math.max(0,Math.min(G-1,Math.floor((e.clientX-rect.left)/rect.width*G)));
   var rr=Math.max(0,Math.min(G-1,Math.floor((e.clientY-rect.top)/rect.height*G)));
   var x=ch.byCell[(c<G/2?c:G-1-c)+','+rr];
   var t=x?chHoverHtml(x,ch.r):'';
   if(!t){pr.classList.remove('on');return;}
   pr.innerHTML=t;
   /* probeAt adds el.offsetLeft to the local x it is given to place pr
      against pr.offsetParent, so el has to be a plain, unpositioned child
      of that same box (.chv, set position:relative above) for the two
      offsets to land in one coordinate space. .chv-grid is that child;
      host itself sits one level further out and does not share it. */
   var gb=grid.getBoundingClientRect();
   probeAt(pr,grid,e.clientX-gb.left,e.clientY-gb.top);});
  host.addEventListener('pointerleave',function(){var pr=$('chprobe'); if(pr)pr.classList.remove('on');});}
 host.querySelectorAll('[data-chface]').forEach(function(b){b.onclick=function(){
  CHV.face=b.getAttribute('data-chface'); render();};});
 host.querySelectorAll('[data-chmask]').forEach(function(b){b.onclick=function(){
  var m=MASKS.filter(function(x){return x.nm===b.getAttribute('data-chmask');})[0];
  if(!m)return;
  if(CHV.pick===m.nm){CHV.pick=null;rdClose();return;}
  CHV.pick=m.nm; chDrill(m); render();};});}

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
