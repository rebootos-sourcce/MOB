
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
/* THE RAMP ENDS AT THE ACCENT.

   This was a heat ramp: dark red, red, orange, gold, white. It was correct
   when the accent was gold and nothing re-pointed it when the accent went
   blue, so the hero element of the product, the largest and only saturated
   object on the Field, was returning rgb(204,107,48) at CQ 39 inside a product
   whose accent is #7EB8D4. Measured, not guessed. That is the orange, and it
   survived the Punch fix because it was never the theme doing it.

   The scale now runs alarm at the floor, through a neutral slate at the
   median, into the product's own sky at the crown and past it to white. Three
   things it gets right that a heat ramp did not:

   The median reads as neutral rather than as amber, so fifty stops looking
   like a warning. Coherence resolves toward the accent, so the core becomes
   the thing the accent already means rather than arguing with it. And the
   floor keeps the alarm red, which is the one place in this product where red
   is earned.

   Saturation and size are still coherence and nothing else. */
function cqRamp(cq){
 var t=Math.max(0,Math.min(100,cq))/100;
 var ST=[[0.00,[58,23,20]],[0.28,[163,58,50]],[0.50,[90,96,112]],
         [0.76,[126,184,212]],[1.00,[234,244,249]]];
 for(var i=1;i<ST.length;i++){
  if(t<=ST[i][0]){var a=ST[i-1],b=ST[i],f=(t-a[0])/(b[0]-a[0]);
   return [Math.round(a[1][0]+(b[1][0]-a[1][0])*f),
           Math.round(a[1][1]+(b[1][1]-a[1][1])*f),
           Math.round(a[1][2]+(b[1][2]-a[1][2])*f)];}}
 return ST[ST.length-1][1];}
/* ============================================================
   THE CORE ATOMIZES.

   The core is CQ, and CQ is not a primitive. It is intention times
   integrity over resistance, and every one of those is a sum over
   things the instrument already measures. A solid disc with a number
   on it was the one place in this product where a figure was drawn
   as though it had no parts.

   So zoom resolves it, the same way zoom already resolves the depth
   ladder outside it. Three layers, each a real decomposition, each
   fading in over its own threshold rather than snapping:

     1.45  the triad. vitality, awareness and will, the three
           quantities the energy read is the mean of.
     2.30  the seven seats, each feather as long as that seat's
           share of integrity, which is bandIg over ten.
     3.40  the twenty one laws, one filament each, at its own
           value. These are literally the numerator of CQ.

   They are feathers because that is what they look like from the
   inside: a spine with barbs, thinning to the tip, and the tip is
   how far that quantity actually reaches. A short feather is a
   quantity that is not carrying. Nothing here is decoration: every
   length on screen is a number the engine computed.

   The shell goes translucent as the layers come in, so the interior
   reads as inside rather than on top, and the number shrinks and
   keeps a backing disc so it stays legible over the detail.
   ============================================================ */
const CORE_STEP=[1.45,2.30,3.40];
/* ============================================================
   THE FETTERS GROW AS YOU COME IN.

   Zoom already resolved two things: the depth ladder outside the
   wheel and the interior of the core. The shell, which is the 112
   addresses and is where the actual work happens, resolved nothing:
   an address was a tick at every magnification, so moving in gave a
   bigger tick and no more information.

   Two more thresholds, on the same gesture.

     2.60  an address that is carrying grows out of the shell by its
           own charge, and takes the glyph of the axis it sits on.
           You can see which fetter a behaviour is standing on.
     3.90  it is named, and its two ends are drawn as a pair: held
           outward from the ring, opposite inward. The pair is the
           protocol in one shape, because release empties the first
           and replace fills the second.

   Only what is carrying grows. A hundred and twelve labels at once
   is not detail, it is noise, and an address at zero has nothing to
   say. Growth is by charge, so what grows most is what costs most,
   which is also what you would want to reach for.

   Every grown address is a target, and the target is bigger than
   the tick was, which is the point: at this magnification a person
   is choosing one thing to work on.
   ============================================================ */
/* THE THRESHOLDS COME DOWN. Ruled.

   Measured: the shell is fully on screen only to zoom 2.08. The glyph layer
   started at 2.60, names at 3.90 and atoms at 4.40, so every symbol the owner
   asked to see was drawn after the ring had left the frame and reached full
   strength with more than half the addresses off screen. They were being
   drawn where he could not see them.

   At 1.55 the ring sits well inside the frame and the glyphs land on a ring
   he can see all of. At 2.05 the names arrive as the ring reaches the edge,
   which is the moment a person has committed to one sector. */
const FET_STEP=[1.55,2.05];
function fetA(i){
 var z=S.zoom||1, t=FET_STEP[i];
 return Math.max(0,Math.min(1,(z-t)/(t*0.30)));}
function fetOpen(){return Math.max(fetA(0),fetA(1));}
function fetResolved(){
 return atomA()>0.5?'the stories behind every address'
  :(fetA(1)>0.5?'every fetter named':(fetA(0)>0.5?'the fetters':''));}

/* ============================================================
   THE ATOM. WHAT PUT THE CHARGE THERE.

   Zoom already resolved the core into its parts and the shell into named
   fetters, and then it stopped. Past the fetter layer there was nothing left
   to find, which made the deepest magnification in the product the one that
   said the least.

   A fetter is not the bottom. A charge at an address was put there by
   something a person wrote, and that is the smallest true unit this
   instrument holds: one story, one address, one weight. So past the fetters,
   each carrying address grows a line per story that landed on it, out along
   its own radius, the length being what that story put there. Click one and
   it names the story it came from and what it weighed.

   Nothing new is measured. Every committed story is kept with its text, and
   the sniffer is pure, so re-reading an entry gives back the same imprints it
   gave when it was committed. No schema change and it works on profiles that
   were saved before this existed.
   ============================================================ */
/* THE BAND HAS TO BE WIDER THAN ONE NOTCH OF THE WHEEL.

   At 5.20 against a ceiling of 7 the atoms lived in a stretch of zoom one
   wheel step wide: a person scrolling went 4.89, then 7, and never passed
   through the layer at all, they arrived at the far side of it. A threshold
   you can only land on by accident is not a threshold.

   At 4.40 the layer opens as the fetters finish naming themselves, which is
   the right place for it: the fetter is the pattern and the atom is what put
   the pattern there, so one resolves into the other. */
const ATOM_STEP=2.60;
function atomA(){
 var z=S.zoom||1;
 return Math.max(0,Math.min(1,(z-ATOM_STEP)/(ATOM_STEP*0.26)));}
/* the atoms of one address, newest first, memoised against the entry count so
   a parse per frame never happens. */
var _ATOM={key:null,by:null};
function atomIndex(){
 var ents=(CURP&&CURP.story&&CURP.story.entries)||[];
 var key=ents.length+':'+(CURP?CURP.id||CURP.nm||'':'');
 if(_ATOM.key===key)return _ATOM.by;
 var by={};
 ents.forEach(function(e,ei){
  if(!e||!e.text)return;
  var im;
  try{im=parseStory(e.text).imprints;}catch(err){return;}
  im.forEach(function(x){
   (by[x.node]=by[x.node]||[]).push({amt:x.amt,ei:ei,t:e.t,
    text:String(e.text).replace(/\s+/g,' ').trim()});});});
 Object.keys(by).forEach(function(k){
  by[k].sort(function(a,b){return b.amt-a.amt;});});
 _ATOM.key=key; _ATOM.by=by; return by;}
/* ONE ADDRESS WORTH OF ATOMS. Lines out along the address's own radius, each
   one as long as what that story put here, each one a target. */
function atomGrow(n,a,hw,base,c,al){
 var list=(atomIndex()||{})[n.i]; if(!list||!list.length)return;
 var show=list.slice(0,6);
 show.forEach(function(x,i){
  /* fanned across the address so six do not stack into one line */
  var off=(show.length===1)?0:((i/(show.length-1))-0.5)*hw*1.25;
  var aa=a+off;
  var len=clamp(x.amt/4,0.08,1)*U*0.085*al;
  var r0=base+3, r1=r0+len;
  var on=(S.atom&&S.atom.i===n.i&&S.atom.ei===x.ei);
  g.beginPath();
  g.moveTo(CX+Math.cos(aa)*r0,CY+Math.sin(aa)*r0);
  g.lineTo(CX+Math.cos(aa)*r1,CY+Math.sin(aa)*r1);
  g.strokeStyle=rgba(mixc(c,[255,255,255],on?.7:.28),al*(on?1:.55));
  g.lineWidth=on?2.6:1.5; g.lineCap='round'; g.stroke();
  /* the tip is the handle, and it is the thing a pointer can actually find */
  g.beginPath(); g.arc(CX+Math.cos(aa)*r1,CY+Math.sin(aa)*r1,on?3.2:2,0,TAU);
  g.fillStyle=rgba(mixc(c,[255,255,255],on?.8:.4),al*(on?1:.7)); g.fill();
  HIT.push({k:'atom',n:n,x:CX+Math.cos(aa)*r1,y:CY+Math.sin(aa)*r1,rad:9,
   v:x});});}
/* ============================================================
   WHAT IS STILL UNDER THE CURRENT DEPTH, IN ONE SENTENCE.

   Ruled: "the atomization is nine scroll notches deep and effectively not in
   the product." It is reachable, and it has been since the threshold came
   down from 5.20 to 2.60, but nothing anywhere says it exists. A layer a
   person can only find by scrolling past the point where they expected
   anything to happen is a layer nobody finds.

   So the legend under the wheel names the next thing down and how to reach
   it. It is about the tool, which is what may sit under the tool. It never
   carries a reading, and it says nothing about a layer the person's own
   record cannot fill: offering to show what put a pattern somewhere, to
   somebody who has written no story, would be an empty room with a sign on
   it.
   ============================================================ */
const LEGEND_BASE='The ring is the seven seats, from the root at the top round '
 +'to the crown. Press a band to open it, or any single mark on it to open '
 +'that address.';
function wheelLegend(){
 var z=S.zoom||1;
 var next=null;
 if(z<FET_STEP[0])next='the patterns each address is running';
 else if(z<FET_STEP[1])next='what each pattern has compounded into';
 else if(z<ATOM_STEP){
  /* only offered when the record can actually fill it */
  var by=atomIndex()||{};
  if(Object.keys(by).length)next='the moments that put each pattern there';}
 return LEGEND_BASE+(next?' Scroll in on the wheel for '+next+'.':'');}

/* how far in each layer is, 0 to 1, over a ramp of its own threshold. */
function coreLayerA(i){
 var z=S.zoom||1, t=CORE_STEP[i];
 return Math.max(0,Math.min(1,(z-t)/(t*0.42)));}
/* what the core has resolved, for the readout under the tab bar */
function coreOpen(){return Math.max(coreLayerA(0),coreLayerA(1),coreLayerA(2));}
const CORE_LAYER_NM=['the triad','the seven seats','the twenty one laws'];
function coreResolved(){
 var n='';
 for(var i=0;i<CORE_STEP.length;i++) if(coreLayerA(i)>0.5)n=CORE_LAYER_NM[i];
 return n;}
/* ONE FEATHER. A rachis out from the centre, barbs either side thinning to
   the tip, and a vane behind them at low alpha so a dense layer still reads
   as a shape rather than as a scribble. len is the reading. */
function coreFeather(a,len,wid,col,al){
 if(len<=1||al<=0.01)return;
 var ca=Math.cos(a), sa=Math.sin(a), nx=-sa, ny=ca;
 var bx=CX+ca*len*0.05, by=CY+sa*len*0.05;
 var tx=CX+ca*len, ty=CY+sa*len;
 /* the vane */
 g.beginPath();
 g.moveTo(bx,by);
 g.quadraticCurveTo(CX+ca*len*0.42+nx*wid, CY+sa*len*0.42+ny*wid, tx,ty);
 g.quadraticCurveTo(CX+ca*len*0.42-nx*wid, CY+sa*len*0.42-ny*wid, bx,by);
 g.closePath();
 g.fillStyle=rgba(col,al*0.22); g.fill();
 /* the barbs. each one a shallow V pointing out, widest at the middle of the
    feather and closing at both ends, which is the shape of a real vane. */
 var n=Math.max(4,Math.min(11,Math.round(len/7)));
 g.lineWidth=Math.max(0.7,wid*0.14); g.strokeStyle=rgba(col,al*0.62);
 for(var i=1;i<=n;i++){
  var f=i/(n+1), px=CX+ca*len*f, py=CY+sa*len*f;
  var bw=wid*Math.sin(f*Math.PI);
  g.beginPath();
  g.moveTo(px-nx*bw,py-ny*bw);
  g.quadraticCurveTo(px+ca*len*0.05,py+sa*len*0.05,px+nx*bw,py+ny*bw);
  g.stroke();}
 /* the rachis */
 g.beginPath(); g.moveTo(bx,by); g.lineTo(tx,ty);
 g.strokeStyle=rgba(col,al*0.98);
 g.lineWidth=Math.max(1,wid*0.24); g.lineCap='round'; g.stroke(); g.lineCap='butt';}
/* the three layers, clipped to the shell so nothing leaks past the rim */
function coreInside(r,cr0){
 var a0=coreLayerA(0), a1=coreLayerA(1), a2=coreLayerA(2);
 if(a0+a1+a2<=0)return;
 var spin=REDUCED?0:S.t*0.05;
 g.save();
 g.beginPath(); g.arc(CX,CY,cr0*0.985,0,TAU); g.clip();
 /* THE SCALE, SO A LENGTH CAN BE READ. Every feather runs from the centre out
    by its own value over ten, so the rim is ten and a feather reaching a third
    of the way is a three. Without the rings that is a texture; with them it is
    a chart, and the difference is whether a person can answer "how much" by
    looking. Four rings, quarter steps, at the alpha of the faintest layer
    currently in. */
 var ink=INK();
 [0.25,0.5,0.75,1].forEach(function(f){
  g.beginPath(); g.arc(CX,CY,cr0*0.93*f,0,TAU);
  g.strokeStyle=rgba(ink,0.055+(f===0.5?0.05:0)); g.lineWidth=1; g.stroke();});
 /* 3. the laws, finest and furthest back, so the coarser layers read over
    them rather than under. */
 if(a2>0)SI.forEach(function(l,i){
  var v=(S.law[l.nm]||0)/10;
  coreFeather(i/SI.length*TAU-Math.PI/2+spin, cr0*0.93*v, cr0*0.035, bc(l.b), a2*0.75);});
 /* 2. the seven seats */
 if(a1>0)BANDS.forEach(function(b,i){
  var v=bandIg(b)/10;
  coreFeather(i/BANDS.length*TAU-Math.PI/2-spin*0.6, cr0*0.86*v, cr0*0.10, bc(b), a1*0.80);});
 /* 1. the triad. vitality, awareness, will: the three the energy read means. */
 if(a0>0)[[r.X,'Sacral'],[r.Y,'3rd Eye'],[r.Z,'Solar']].forEach(function(x,i){
  coreFeather(i/3*TAU-Math.PI/2+spin*0.3, cr0*0.80*x[0], cr0*0.20, bc(x[1]), a0*0.95);});
 g.restore();}
function solCore(r,base){
 const coh=r.CQ/100, breathe=REDUCED?0:Math.sin(S.t*1.4)*.05;
 /* below the median the soul shrinks. above it, it grows. 50 is neutral. */
 var sz = coh<0.5 ? lerp(0.34,0.72,coh/0.5) : lerp(0.72,1.06,(coh-0.5)/0.5);
 var open=coreOpen();
 /* THE CORE GROWS AS IT OPENS. An exploded view needs somewhere to explode
    into: at a low reading the sphere is small by design, and three layers of
    detail inside something that size is a smudge. Opening it is the gesture
    that asks for the parts, so the sphere gives them room. It is the one
    dimension on the wheel that is not a reading, and it is not pretending to
    be: the lengths inside it are the reading and they scale with it. */
 /* THE CORE BLOOMS LAST, once the ring is whole, because the core is what the
    ring adds up to. It arrives out of nothing rather than out of small, so
    the ring is briefly a ring around an empty middle, which is the moment the
    figure reads as assembled rather than revealed. */
 /* out of a third, never out of nothing. A core at zero is a reading that has
    vanished, and this figure is the only thing on the surface. */
 const ce=0.34+0.66*enterA(ENTER_CORE,ENTER_SPAN);
 const cr0=base*sz*(1+breathe)*(1+open*0.95)*ce;
 var gc=cqRamp(r.CQ);
 /* the glow is earned. nothing below the median, then it opens out. */
 var glow = coh<=0.5 ? 0 : (coh-0.5)/0.5;
 const halo=g.createRadialGradient(CX,CY,cr0*.90,CX,CY,cr0*(1.18+glow*1.5));
 halo.addColorStop(0,rgba(mixc(gc,[255,255,255],.35),glow*0.92));
 halo.addColorStop(.14,rgba(gc,glow*0.6));
 halo.addColorStop(.42,rgba(mixc(gc,[0,0,0],.4),glow*0.18));
 halo.addColorStop(1,rgba(gc,0));
 g.fillStyle=halo;g.beginPath();g.arc(CX,CY,cr0*(1.18+glow*1.5),0,TAU);g.fill();
 /* THE SHELL OPENS. Opaque until zoom asks, then down to a wash, so what is
    inside reads as inside. A dark base goes under it first, because a wash
    over the wheel's own web would let the chords show through the sphere. */
 if(open>0){g.beginPath();g.arc(CX,CY,cr0,0,TAU);
  g.fillStyle=rgba(LIGHT()?[250,249,245]:[16,17,25],0.90*open);g.fill();}
 g.beginPath();g.arc(CX,CY,cr0,0,TAU);g.fillStyle=rgba(gc,1-open*0.62);g.fill();
 g.lineWidth=Math.max(1.2,cr0*.05);g.strokeStyle=rgba(mixc(gc,[0,0,0],.45),.9);g.stroke();
 coreInside(r,cr0);
 var sh=g.createRadialGradient(CX-cr0*.3,CY-cr0*.42,cr0*.04,CX-cr0*.1,CY-cr0*.15,cr0*.95);
 sh.addColorStop(0,rgba(mixc(gc,[255,255,255],.4),.45*(1-open)));
 sh.addColorStop(.55,rgba(gc,0));
 g.fillStyle=sh;g.beginPath();g.arc(CX,CY,cr0,0,TAU);g.fill();
 /* the specular. it is the one mark that says solid, so it goes when the
    sphere stops being solid. */
 if(open<0.98){
  g.beginPath();g.arc(CX-cr0*.3,CY-cr0*.36,cr0*.24,0,TAU);
  g.fillStyle='rgba(255,255,252,'+(lerp(.28,.85,coh)*(1-open)).toFixed(2)+')';g.fill();}
 g.beginPath();g.arc(CX,CY,cr0,0,TAU);
 g.strokeStyle=rgba(mixc(gc,[255,255,255],.5),lerp(.4,.95,coh));g.lineWidth=1.4;g.stroke();
 /* THE CORE PRINTS NOTHING UNTIL SOMETHING IS READ. With nothing held and no
    law measured, CQ comes out 36 from the defaults on the twenty one laws.
    compute already refuses to name a band on that, and the rail already says
    not read yet, but the core was still printing 36 in the largest type on
    the screen to somebody who had not typed a word. The same reading of the
    same defaults, said two ways on one screen. A dash is the honest glyph. */
 /* the number gives ground as the interior comes in, but it never leaves:
    the parts are what the number is made of and losing it loses the point.
    A backing disc keeps it legible over the feathers. */
 /* The number gives up most of its size once the parts are showing, because
    by then the parts are what is being read and the number is the caption.
    It never goes: the parts are what the number is made of. */
 /* THE NUMBER COMES OFF THE CORE, and the comment above is the argument it
    beat for a long time: the parts are what the number is made of, so losing
    the number loses the point. Two later rulings outrank it.

    No text over the hero graphic, ever. The wheel is the hero graphic of this
    surface and the coherence figure was set in the middle of it, at up to
    half the core's diameter.

    THE OWNER REVERSED THIS AND HE IS RIGHT. "What happened to my CQ number at
    the centre of my circle? It's gone." The rule is his and so is the
    reversal, and the distinction that resolves it is worth writing down:
    a caption floating over a picture is text on the hero, and a figure at the
    centre of the thing that figure describes is the hero labelling itself.
    The core IS coherence. The number in the middle of it is not sitting on
    top of the drawing, it is the drawing saying its own name.

    The other half of the old argument still stood and is kept: coherence was
    printed four times on one screen, and the tier word is coherence restated
    in a word. The core takes the number back and the tier word stays where it
    went, so it is said twice and not four times.

    It goes back the way the rest of this product states a figure. Large, in
    the tier's own colour, with its scale under it in small type, because
    every number says what it is out of. And it is suppressed on an unread
    field, because a percentage is never printed off a default. */
 if(!r.unread){
  var cqc=(typeof TIERCOL!=='undefined'&&TIERCOL[r.tier])||'#'+gc.map(function(n){
    return ('0'+Math.round(n).toString(16)).slice(-2);}).join('');
  var big=Math.max(15,Math.min(cr0*0.52,64));
  g.save();
  g.textAlign='center'; g.textBaseline='alphabetic';
  g.fillStyle=cqc;
  g.font='500 '+big.toFixed(1)+'px Inter, system-ui, sans-serif';
  g.fillText(String(Math.round(r.CQ)), CX, CY+big*0.30);
  /* THE SCALE, ALWAYS. A bare 51 in the middle of a figure is the exact
     defect the number law exists for. It is drawn only when there is room
     for it to be legible, which is the eleven pixel floor the rest of the
     product holds. */
  var sm=big*0.26;
  if(sm>=11){
   /* INK() rather than ink. solCore has no `ink` in scope, drawWheel does, and
      the difference only showed above zoom 1 because below it the core is too
      small for this line to be drawn at all. It threw, the draw aborted, and
      every hit target on the surface went with it: 136 at zoom 1 and zero at
      2.3, 3.3 and 4.3. The functional gate caught it. */
   g.fillStyle=rgba(INK(),.5);
   g.font='400 '+sm.toFixed(1)+'px Inter, system-ui, sans-serif';
   g.fillText('of 100', CX, CY+big*0.30+sm*1.75);}
  g.restore();}
 HIT.push({k:'core',x:CX,y:CY,rad:cr0*1.5});
 return cr0;}

/* SIX GATES at the core. three higher above, three lower below, each a
   ring icon on a short stem. The ring closes by the share of the story that
   ran through that gate, the pill at its lower right says the number, the
   glyph says which gate without a word, and the name comes on hover and on
   click. No text is drawn over the wheel. The long labelled arrows were
   read as too long and as text hovering over the construct. */
function verpArrows(cr0){
 /* the six arrive with the core and just after it, because they are read off
    the core rather than off the ring */
 var ge=0.4+0.6*enterA(ENTER_CORE+80,ENTER_SPAN);
 var V=verpRead(), evid=V.some(function(v){return v.pct>0;});
 if(!evid) V=V.map(function(v){return {k:v.k,nm:v.nm,side:v.side,mult:v.mult,d:v.d,pct:0,n:0};});
 var hi=V.filter(function(v){return v.side==='higher';});
 var lo=V.filter(function(v){return v.side==='lower';});
 var ink=INK(), bgc=LIGHT()?[248,247,243]:[23,25,34];
 var R=13*ge, rr=cr0*1.3+34;
 function gate(v,i,n,up){
  var a=(up?-Math.PI/2:Math.PI/2)+(i-(n-1)/2)*0.72;
  var x=CX+Math.cos(a)*rr, y=CY+Math.sin(a)*rr;
  var c=up?hx(PAL.Heart):hx(PAL.Root), f=v.pct/100;
  /* the stem. its weight is the share, its length is fixed and short */
  g.beginPath();g.moveTo(CX+Math.cos(a)*cr0*1.12,CY+Math.sin(a)*cr0*1.12);
  g.lineTo(x-Math.cos(a)*(R+3),y-Math.sin(a)*(R+3));
  g.strokeStyle=rgba(c,(evid?.25:.40)+f*.6);g.lineWidth=1+f*3;
  g.lineCap='round';g.stroke();g.lineCap='butt';
  /* the ring. a dim track, then the share closing clockwise from the top */
  g.beginPath();g.arc(x,y,R,0,TAU);g.fillStyle=rgba(bgc,.92);g.fill();
  g.beginPath();g.arc(x,y,R,0,TAU);
  g.strokeStyle=rgba(c,evid?.22:.42);g.lineWidth=2.4;g.stroke();
  if(f>0){g.beginPath();g.arc(x,y,R,-Math.PI/2,-Math.PI/2+TAU*f);
   g.strokeStyle=rgba(c,.95);g.lineWidth=2.4;g.lineCap='round';g.stroke();g.lineCap='butt';}
  /* the glyph */
  /* THE GLYPH IS LEGIBLE WHETHER OR NOT THERE IS A STORY. Ruled: "our six
     axis icons, they are barely visible." They were drawn at half alpha on
     any profile with no story run, which is most profiles most of the time,
     and half alpha on a dark wheel is the difference between a control and a
     smudge. A thing that has not been read yet still has to be seen: that is
     how a person learns it exists and presses it. */
  var P=new Path2D(GATEGLYPH[v.k]), sc=15/24;
  g.save();g.translate(x-7.5,y-7.5);g.scale(sc,sc);
  g.lineWidth=1.9/sc;g.lineCap='round';g.lineJoin='round';
  g.strokeStyle=rgba(ink,evid?.95:.82);g.stroke(P);g.restore();
  /* AND THE PILL IS ALWAYS THERE. Ruled in the same breath: they carry no
     pill with the percent. It was drawn only once a story had run, so the one
     thing telling a person what the ring is measuring appeared and
     disappeared. It appears always and holds a dash when nothing has been
     read, which is the pattern this product already uses everywhere else: the
     figure is never invented, and the absence is said rather than hidden. */
  {var px=x+R-3, py=y+R-5, pw=(evid&&v.pct>=100)?26:22, ph=12;
   roundRect(px,py,pw,ph,6);
   g.fillStyle=evid?rgba(c,1):rgba(ink,.22);g.fill();
   g.save();g.font='600 8.5px Inter, system-ui, sans-serif';
   g.textAlign='center';g.textBaseline='middle';
   g.fillStyle=evid?rgba(bgc,1):rgba(ink,.72);
   g.fillText(evid?v.pct+'%':'\u2013',px+pw/2,py+ph/2+.5);g.restore();}
  HIT.push({k:'gate',v:v,x:x,y:y,rad:R+9});}
 hi.forEach(function(v,i){gate(v,i,hi.length,true);});
 lo.forEach(function(v,i){gate(v,i,lo.length,false);});
 if(evid){
  var top=V.slice().sort(function(a,b){return b.pct-a.pct;})[0];
  if(top.pct>=34){
   txt('defaults to '+top.nm.toLowerCase(),CX,CY+rr+R+22,13,
    top.side==='higher'?hx(PAL.Heart):hx(PAL.Root),.95,600);
   txt('costs \u00d7'+top.mult.toFixed(2)+' on everything held',CX,CY+rr+R+38,11,INK(),.5,400);}}}

/* ============================================================
   THE WHEEL, four depths. A complexity ladder, not four skins.
   Each step adds exactly one named layer. D is the maximum.
   The three quotients own three elements at every depth:
     CQ  the core, and how far the light reaches
     DQ  the wash, area of effect
     SQ  depth of any single segment
   ============================================================ */
/* THE FOUR DEPTHS ARE NAMED FOR WHAT THEY ADD.

   They were Charge, Cluster, Chain, Blueprint, and two of those four are
   words this product does not define anywhere else. A cluster of what: a
   saboteur is a pattern, not a cluster, and nothing in the codex calls it
   one. Chain is undefined entirely. Charge reads as the thing an individual
   address holds, which it also is, so at the top of a depth ladder it is
   ambiguous with itself.

   The ruling is that a menu word describes exactly what the thing does. Each
   depth adds one layer of the architecture, so each is named for the layer it
   adds, in words the product already uses everywhere else:

     Charge      the three quotients and the addresses carrying them
     Patterns    the saboteurs, which is what the rail has always called them
     Chains      how a pattern compounds into a complex, a hyper complex and
                 a character layer. Drawn as chords, which is why the word
                 survives at all
     Blueprint   domains, masks and laws, and this one already landed

   Blueprint keeps its name because it is the one the owner said he
   understood, and because the rail already calls those blueprint domains.

   A word alone cannot carry a definition, so each depth now has one. Menu is
   one word. Definition is on demand. */
const VIEWS=[
 {k:'A',nm:'Charge',    layers:'the core, 112 addresses, the wash',
  tip:'What you are carrying, and where. The core is coherence, the ring is your 112 addresses, the wash is shadow weight.',
  how:'Charge. Three things only.\nThe core is CQ, the alignment of the whole circuit.\nThe ring is your 112 addresses, SQ.\nThe wash behind everything is DQ.\nDrag any segment to load or clear it.'},
 {k:'B',nm:'Patterns',  layers:'charge, plus the seats named and the saboteurs',
  tip:'The saboteurs running on top of the charge. Each bead is one, and the threads show which addresses built it.',
  how:'Patterns. Charge, plus the seats and the saboteurs.\nEach bead is a saboteur. The threads show which\naddresses built it. Hover a bead to name it.'},
 {k:'C',nm:'Chains',    layers:'patterns, plus complexes, hyper, character, archetypes',
  tip:'How a pattern compounds. Saboteur into complex into hyper complex into character, inward, each built from the one outside it.',
  how:'Chains. Patterns, plus the rest of the compounding.\nSaboteur to complex to hyper to character, inward.\nThe named ring is your twelve archetypes.\nClick one to change how the soul expresses.'},
 {k:'D',nm:'Blueprint', layers:'chains, plus 19 domains, 6 masks, 21 laws',
  tip:'What was there before any of it. Nineteen domains, six masks, and the twenty one laws underneath the whole reading.',
  how:'Blueprint. Chains, plus domains, masks and laws.\nThe outer ring is nineteen domains, five per root cluster.\nThe faint ring inside is the six masks.\nThe short spokes at the centre are the twenty-one laws.'}];

/* ATOMIZING. Zoom used to magnify the same picture, and the depth ladder was
   a separate control for the same idea: how much of the construct is drawn.
   They are one idea. Past a threshold the next layer resolves, because at 3x
   there is room on the ring for names that cannot fit at 1x.

   Zoom only ever ADDS. The depth buttons set the floor, so a person who chose
   Charge still sees Charge when they zoom back out, and nothing a person
   selected is ever taken off the screen by a gesture. */
const ZOOM_STEP=[1,2.2,3.2,4.2];
function effView(){
 var extra=0, z=S.zoom||1;
 for(var i=1;i<ZOOM_STEP.length;i++) if(z>=ZOOM_STEP[i])extra=i;
 return Math.min(VIEWS.length-1,(S.view|0)+extra);}
/* what zoom added on top of the button, for the readout */
function zoomAdded(){return effView()-(S.view|0);}
function nzAng(a){while(a<-Math.PI)a+=TAU;while(a>Math.PI)a-=TAU;return a;}
/* ONE GROWN ADDRESS. The glyph of the axis it sits on, then at the deeper
   threshold its name and its two ends. Held reads outward from the ring and
   opposite inward, which is the protocol in one shape: release empties the
   first and replace fills the second, at the same address. */
function fetGrown(n,a,hw,r0,c,ld,fg,fn){
 var cf=CHILD.filter(function(x){return x.nm===n.cf;})[0];
 var gx=CX+Math.cos(a)*(r0+6), gy=CY+Math.sin(a)*(r0+6);
 /* the axis glyph, sized by charge, on the leading edge of the address */
 if(cf&&cf.ic&&fg>0.12){
  /* the glyph reads or it is not worth drawing. It is the one mark that says
     WHICH axis this address is standing on, which is the whole reason a person
     came in this close, so it gets size and contrast rather than a tint. */
  var sc=(11+ld*13)*fg/24;
  g.save(); g.translate(gx,gy); g.rotate(a+Math.PI/2); g.scale(sc,sc);
  g.translate(-12,-12);
  g.strokeStyle=rgba(mixc(c,[255,255,255],.72),fg*(0.55+ld*0.45));
  g.lineWidth=2.0/sc; g.lineJoin='round'; g.lineCap='round';
  g.stroke(new Path2D(cf.ic));
  g.restore();}
 /* an edge, so a grown address reads as one object with a boundary rather
    than as a gradient that happens to be brighter. It is a target now. */
 if(fg>0.3){arcP(r0,R_SHELL,a-hw,a+hw);
  g.strokeStyle=rgba(mixc(c,[255,255,255],.35),fg*(.18+ld*.35));
  g.lineWidth=1; g.stroke();}
 if(fn<=0.05)return;
 /* the pair. outward from the ring is what is held, inward is what is
    installed against it. Two bars, one axis, and the gap between them is the
    work left. */
 var hl=ld*U*.075*fn, pl=clamp((n.rep||0)/10,0,1)*U*.075*fn;
 if(hl>1){arcP(R_SHELL+2,R_SHELL+2+hl,a-hw*.62,a+hw*.62);
  g.fillStyle=rgba(c,.30+ld*.5); g.fill();}
 if(pl>1){arcP(r0-2-pl,r0-2,a-hw*.62,a+hw*.62);
  g.fillStyle=rgba(bc('Heart'),.28+(n.rep||0)/10*.5); g.fill();}
 /* the name. only the heaviest, because the collide gate is right that a ring
    of a hundred labels is a ring of no labels. */
 if(n.disp>=6&&fn>0.45)
  radialTxt(n.k,a,R_SHELL+9+hl,11.5,mixc(c,[255,255,255],.3),.6+fn*.4,600);}
var R_SHELL=0;
/* ============================================================
   THE FIELD ASSEMBLES WHEN YOU LAND ON IT.

   His question: the field almost looks like a character, and the elements are
   separate, so what if they each moved into place. And a colour animation of
   the bands. As a one time event.

   So it is one, and it is the seven seats arriving in turn rather than a
   hundred and eight things fading up together. Root first and crown last,
   which is the order the body fills and the order every other reading in this
   product is given in, so the motion says something rather than decorating
   something. That sweep IS the colour animation of the bands: the seats are
   the rainbow, and taking them in turn is the only way to see that they are
   seven things and not one gradient.

   Each address swings the last few degrees into place and settles out of a
   slight lift, which is what makes it read as parts assembling rather than a
   picture fading up. The core blooms last, after the ring is whole, because
   the core is what the ring adds up to.

   ONE TIME, AND ONLY ON ARRIVAL. It runs when the Field is entered, not on
   every repaint, or a person dragging the wheel would watch it reassemble
   under their hand. Reduced motion gets the end state on the first frame:
   somebody who asked the machine to stop moving has not asked it to move
   less, which is the rule the rest of this build already keeps.
   ============================================================ */
/* MEASURED AND CUT DOWN. The first cut ran 1.9 seconds with the core absent
   for the first 1.28 of them, and the functional gate returned 44 failures
   because for well over a second the instrument genuinely was not there. The
   gate was right twice: a person landing on the Field and reaching for
   something in that window finds nothing either, and an entrance that has to
   be waited out is not an entrance, it is a loading screen.

   Under a second end to end now, and the core is never at nothing: it arrives
   out of a third of its size rather than out of zero, so the figure is
   complete from the first frame and what moves is how complete it looks. */
const ENTER_SPAN=380, ENTER_STAGGER=62, ENTER_CORE=300, ENTER_TOTAL=900;
var ENTER_T0=null, ENTER_SEEN=false;
function enterStart(){
 /* ONCE A SESSION, NOT ONCE A VISIT. Ruled: "as a one time event." It was
    firing on every arrival at the Field, so a person who stepped to Knowledge
    and back watched the figure assemble again, which turns an entrance into a
    tax on navigation. It also made every measurement of this surface a race,
    because anything that looked at the Field within 900ms of a tab change was
    measuring the animation rather than the figure. */
 if(ENTER_SEEN)return;
 ENTER_SEEN=true;
 /* null means never run, zero means run and finished. Both answer 1 from
    enterA, and only one of them is worth starting a clock for. */
 ENTER_T0=REDUCED?0:performance.now();}
function enterOver(){
 return ENTER_T0===null||ENTER_T0===0||(performance.now()-ENTER_T0)>ENTER_TOTAL;}
/* how far into its own arrival one part is, 0 to 1, eased out so everything
   decelerates into place instead of stopping dead */
function enterA(delay,span){
 if(ENTER_T0===null||ENTER_T0===0)return 1;
 var e=performance.now()-ENTER_T0-delay;
 if(e<=0)return 0;
 if(e>=(span||ENTER_SPAN))return 1;
 var k=e/(span||ENTER_SPAN);
 return 1-Math.pow(1-k,3);}
/* one seat's turn. Root is 0 and Crown is 6, so the sweep runs up the body. */
function enterSeat(b){
 var i=BANDS.indexOf(b); if(i<0)i=0;
 return enterA(i*ENTER_STAGGER,ENTER_SPAN);}

function drawWheel(r,L){
 const ink=INK(),p=S.pin,gc=GOLDC();
 const shellR=[U*.62,U*.68,U*.74,U*.78][L];
 /* the shell radius, published once so the grown address can draw outside it
    without being handed four arguments it would only pass along. */
 R_SHELL=shellR;
 const R={shell:shellR,arch:U*.60,sab:[0,U*.56,U*.545,U*.50][L],cx:U*.425,hy:U*.335,
  sup:U*.255,dom:U*.93,mask:U*.685};
 const coreBase=[U*.30,U*.26,U*.20,U*.155][L];

 /* --- chain chords, C and D --- */
 if(L>=2){
  /* with a selection the rest of the web falls to .08 and the selected chain
     rises above rest: alpha up, width up. it saturates rather than lights. */
  const lit=o=>{if(!p)return 1;if(p===o)return 2;const has=x=>x===o||(x.parts||[]).some(has);return has(p)?2:.08;};
  const al=(b,o)=>Math.min(1,b*lit(o)), wd=(b,o)=>lit(o)>1?b*1.5:b;
  /* ============================================================
     THE CHORDS CARRY WEIGHT AND TENSION.

     Every chord was stroked at one of four constant widths and four constant
     alphas, chosen by tier. Meanwhile the engine had already computed, on the
     same frame, a real spread: thirty four saboteur weights running 3.73 to
     6.00, fifteen complexes, and a source charge per address. All of it
     resolved to one line width and thrown away at the draw call.

     WEIGHT. w01 normalises a pattern's own weight across the band the engine
     actually produces, and it drives width and alpha together, because a
     heavy thing is both thicker and brighter. The heaviest chord now reads
     about four times the lightest. It read exactly the same before.

     TENSION, and the product already had the word. wheel.js draws held and
     installed at the fetter layer as two bars with a gap and calls the gap
     "the work left". That is tension, defined here, in this product's own
     language, and the chord's control point offset has been sitting in the
     draw call as a hard coded pull constant the whole time. That constant is
     the sag.

     A chord with nothing installed against its charge runs taut and nearly
     straight. A chord whose opposite is already in place hangs slack. So the
     geometry of the web becomes the reading: the loaded quadrant pulls
     straight and hard, the cleared quadrant bellies. A person who has pulled
     on a rope reads it with the labels off, which is the test.

     Both are static geometry. Neither is an animation, so neither has a
     reduced motion case: this is the information, not decoration on top of
     it. ============================================================ */
  const w01=o=>clamp((((o&&o.w)||0)-3.5)/3.0,0,1);
  /* TENSION IS SUSCEPTIBILITY, AND THE FIRST DEFINITION I SHIPPED WAS NOISE.

     I took tension as held minus installed, which is the gap the fetter layer
     already draws and calls "the work left", and it is the right idea at the
     wrong level. Within one saboteur the parts almost always carry the same
     sq, because sq is a pure function of the axis charge, the band's
     integrity and susceptibility. Measured on the live page after I had
     already built it: THREE distinct values across a hundred and twenty
     chords. That is a reading with no variance, which is a picture of
     nothing drawn convincingly.

     Susceptibility discriminates and it is the thing that was never drawn.
     n.susc is the Domain Matrix: the root domain a person runs makes them up
     to 1.3 times more susceptible at its affine addresses and as little as
     0.45 elsewhere. Measured on the same hundred and twenty chords: fourteen
     distinct values across 0.45 to 1.30. It is the answer to "why this line
     and not that one", it varies per connection by construction, and this
     instrument has been computing it since the first commit without ever
     showing it to anybody.

     So a taut chord is one the person is susceptible at. That is a true
     sentence about them and it is the sentence the Field could not say. */
  const ten01=n=>clamp((((n&&n.susc)||1)-0.45)/0.85,0,1);
  const quad=(a0,r0,a1,r1,pull,st,w,dash)=>{const am=meanAng([a0,a1]),rm=(r0+r1)/2*pull;
   g.beginPath();g.moveTo(CX+Math.cos(a0)*r0,CY+Math.sin(a0)*r0);
   g.quadraticCurveTo(CX+Math.cos(am)*rm,CY+Math.sin(am)*rm,CX+Math.cos(a1)*r1,CY+Math.sin(a1)*r1);
   if(dash)g.setLineDash(dash);g.strokeStyle=st;g.lineWidth=w;g.stroke();g.setLineDash([]);};
  /* the sag, from slack to taut. The old constants were .42 to .48 and the
     range is opened around them rather than replaced, so a chord at middling
     tension sits where every chord used to. */
  const sag=(base,t)=>base*(1.28-0.62*t);
  r.sabs.forEach(s=>{const k=w01(s);
   s.parts.forEach(n=>quad(n.ang,R.shell*.92,s.ang,R.sab,sag(.42,ten01(n)),
    rgba(bc(n.b),al(.46*(0.55+k*0.80),s)),wd(1.6*(0.45+k*1.45),s),
    s.unnamed?[3,3]:null));});
  r.cxs.forEach(c=>{const k=w01(c);
   c.parts.forEach(s=>quad(s.ang,R.sab,c.ang,R.cx,sag(.44,w01(s)),
    rgba(bc('Solar'),al(.62*(0.55+k*0.80),c)),wd(2.4*(0.45+k*1.45),c)));});
  r.hys.forEach(h=>{const k=w01(h);
   h.parts.forEach(c=>quad(c.ang,R.cx,h.ang,R.hy,sag(.46,w01(c)),
    rgba(bc('Sacral'),al(.74*(0.60+k*0.70),h)),wd(3.2*(0.50+k*1.30),h)));});
  r.sups.forEach(u=>{const k=w01(u);
   u.parts.forEach(h=>quad(h.ang,R.hy,u.ang,R.sup,sag(.48,w01(h)),
    rgba(bc('Root'),al(.9*(0.60+k*0.70),u)),wd(4*(0.50+k*1.30),u)));});
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
 /* AND THE WORD CQ AND THE TIER WORD GO WITH IT, for the same two reasons.
    The tier is coherence said as a word, which was the fourth printing. */

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
 const fg=fetA(0), fn=fetA(1);
 W.forEach(n=>{
  /* its seat's turn to arrive. Nothing is drawn before its turn, which is
     what makes the sweep visible: a band that is merely dim is a band that is
     already there. */
  const ea=enterSeat(n.b);
  if(ea<=0)return;
  /* the last few degrees of travel, and the lift it settles out of */
  const a=n.ang+(1-ea)*0.19, ld=clamp(n.disp/10,0,1)*ea;
  /* the slice widens a little as the fetters grow, so a grown address is a
     shape you can hit rather than a hair you have to aim at */
  const hw=TAU/108*(.43+fg*.24);
  const c=nodeCol(n), carrying=n.disp>=4;
  /* GROWTH IS BY CHARGE. An address at zero does not move, whatever the zoom:
     there is nothing there to come forward. */
  const grow=carrying?fg*ld*U*.085:0;
  const d=U*.016+ld*U*.088+grow, r0=R.shell-d;
  arcP(r0,R.shell,a-hw,a+hw);
  const gr=g.createRadialGradient(CX,CY,r0,CX,CY,R.shell);
  gr.addColorStop(0,rgba(mixc(c,[0,0,0],LIGHT()?.05:.36),carrying?.34+ld*.6:.08));
  gr.addColorStop(1,rgba(mixc(c,[255,255,255],.44),carrying?.7:.15));
  g.fillStyle=gr;g.fill();
  if(n.disp>=6.5){g.shadowColor=rgba(c,.9);g.shadowBlur=16;g.fill();g.shadowBlur=0;}
  if(n.disp>=9){g.strokeStyle=rgba(hx('#FF2E1F'),.85);g.lineWidth=1.4;g.stroke();}
  if(S.hover===n||S.pin===n){g.strokeStyle=rgba(gc,1);g.lineWidth=2;g.stroke();}
  if(fg>0&&carrying)fetGrown(n,a,hw,r0,c,ld,fg,fn);
  /* the target grows with the shape. r0 is where the address now starts. */
  /* THE TARGET IS WHERE IT LANDS, NOT WHERE IT IS MID FLIGHT. A hit box that
     travels with the animation would move under a pointer that had already
     found it, which is worse than no box at all for the second and a half it
     lasts. */
  HIT.push({k:'node',n,cx:CX,cy:CY,a0:n.ang-hw,a1:n.ang+hw,
   r0:Math.min(R.shell*.85,r0-4),r1:R.shell*1.02+(fn>0&&carrying?U*.05:0)});});

 /* AND PAST THE FETTERS, WHAT PUT THE CHARGE THERE.

    Two things had to be got right here and both were wrong first.

    It was gated on carrying. A story spreads its weight across up to four
    addresses per seat and applyStory scales what lands by a third, so two
    committed entries left every touched address reading between 1.2 and 2.8
    against a carrying floor of 4. The layer was invisible in exactly the
    case it exists for. An atom is history and history does not stop being
    true when the charge it left is small.

    And it ran INSIDE the shell loop, before each address registered its own
    hit. HIT is scanned backwards, so the address that was pushed after its
    own atoms answered for all of them: hovering an atom named the address
    and the atom could not be reached. It is its own pass now, after the
    whole shell, which also puts the lines over the ring rather than under
    it. */
 {var aa2=atomA();
  if(aa2>0)W.forEach(n=>{
   const a=n.ang, ld=clamp(n.disp/10,0,1), carrying=n.disp>=4;
   const hw=TAU/108*(.43+fg*.24);
   atomGrow(n,a,hw,R_SHELL+3+(carrying?ld*U*.075*fn:0),nodeCol(n),aa2);});}
 pill('112 addresses · SQ · '+r.loaded.length+' loaded',R.shell+14);
 /* THE SEVEN SEAT BANDS ARE TARGETS. Ruled: "the rainbow bands at the centre,
    say what they are and make them clickable." They were seven names drawn
    around the outside of the shell and nothing else: not a word about what
    they are, and no way to press one. Every individual node in the ring was
    already pressable, so a person could open one address of a hundred and
    twelve and could not open the seat the whole coloured arc belongs to.

    The target is the arc the seat's nodes actually occupy, from the first to
    the last, plus the radius the name runs out to, so pressing the colour and
    pressing the word both land. It opens the seat's own reading, which the
    Summary has been able to open all along. */
 if(L>=1)BANDS.forEach(b=>{const seg=W.filter(n=>n.b===b);
  if(!seg.length)return;
  var am=meanAng(seg.map(n=>n.ang));
  radialTxt(b,am,R.shell*1.058,12,bc(b),.9,600);
  var angs=seg.map(n=>n.ang).sort(function(x,y){return x-y;});
  HIT.push({k:'seat',b:b,cx:CX,cy:CY,
   a0:angs[0]-TAU/216, a1:angs[angs.length-1]+TAU/216,
   r0:R.shell-U*.02, r1:R.shell*1.058+U*.10});});

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
 /* The seven seat names sit on the shell at a fixed bearing and were drawn
    before any nameplate, but they were never registered as occupied, so a
    saboteur's plate could run straight through one. "AggreSolar" was the
    shipped result. They go in first, so every plate routes around them. */
 if(L>=1)BANDS.forEach(b=>{const seg=W.filter(n=>n.b===b);
  if(seg.length)PLATES.push({ang:meanAng(seg.map(n=>n.ang)), out:R.shell*1.058,
   len:b.length, fs:12});});
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
  g.save();g.font='600 '+fs+'px Inter, system-ui, sans-serif';
  const w=g.measureText(o.nm).width;g.restore();
  let lx=x+(right?1:-1)*(size+10), ly=y;
  for(let step=0;step<6;step++){
   const box={x0:right?lx:lx-w,x1:right?lx+w:lx,y0:ly-fs*0.7,y1:ly+fs*0.7};
   if(!FLATS.some(q=>box.x0<q.x1&&q.x0<box.x1&&box.y0<q.y1&&q.y0<box.y1)){
    FLATS.push(box);
    g.beginPath();g.moveTo(x+(right?1:-1)*size,y);g.lineTo(lx,ly);
    g.strokeStyle=rgba(c,.6);g.lineWidth=1;g.stroke();
    g.save();g.font='600 '+fs+'px Inter, system-ui, sans-serif';
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
var DISP_T=null, DISP_RATE=-Math.log(.86)*60;
function drawSig(r){
 if(!REDUCED) return null;                 /* animating, always draw */
 var d=0; for(var i=0;i<W.length;i++)d+=W[i].sq;
 /* effView, not S.view: the cache has to miss when zoom resolves a layer */
 return [effView(),S.tab,S.who,S.hover&&S.hover.k,S.pin&&(S.pin.nm||S.pin.k),
         LIGHT()?1:0,S.zoom.toFixed(3),S.panx|0,S.pany|0,
         d.toFixed(3),r.CQ.toFixed(3)].join('|');}
function draw(r){
 /* The ease used to be a flat .14 of the remaining distance per frame, which
    makes the settle a function of the display and not of the design. On the
    120Hz panel the bead arrived in half the time it takes on the 60Hz one,
    and on a loaded frame it crawled. Same curve, driven by elapsed time: the
    retention is .86 per frame at 60Hz, so the rate is -ln(.86)*60, about 9.05
    per second, and the per frame fraction is 1-e^(-rate*dt). At exactly 60Hz
    this is .14 again, so nothing about the look moves.

    dt is clamped at 100ms. A tab that was hidden for a minute reports one
    enormous frame, and without the clamp every bead would snap to its target
    in a single step, which is the jump the easing exists to prevent. */
 var t=performance.now(), dt=(DISP_T===null?1/60:(t-DISP_T)/1000);
 DISP_T=t; if(dt>.1)dt=.1; if(!(dt>0))dt=1/60;
 var k=1-Math.exp(-DISP_RATE*dt);
 W.forEach(n=>{n.disp=(n.disp===undefined?n.sq:(REDUCED?n.sq:n.disp+(n.sq-n.disp)*k));});
 var sig=drawSig(r);
 if(sig!==null&&sig===DRAW_SIG) return;    /* nothing moved and nothing will */
 DRAW_SIG=sig;
 g.clearRect(0,0,CW,CH);HIT=[];LBL=[];
 drawWheel(r,effView());}
