/* ============================================================
   ONBOARDING, ROUND PS. The three reviews (REVIEW-onboarding/) and three
   rounds of mockup (mockups/onboarding-v2/) converged on one flow: arrive,
   the twelve starting points, settle, feel, body, story, a mirror with a
   correction path, then a bridge into the release. The owner watched the
   mockup's video and asked to "update the onboarding and tutorial" rather
   than ask for another design, so this ports that flow into real code
   rather than drawing a new one.

   WHAT IS PORTED AND WHAT IS NOT, same rule storyui.js states for its own
   port of a prototype. The mockup's canvas Field, its 112 tick ring and its
   choreographed motion are a standalone animation built to pitch a feel; none
   of that is a document this product's engine can be asked to move for real,
   so it is not ported. What is ported is the sequence, the twelve starting
   points, the six feeling words, the seven body places, and the rule that
   the mirror is built only from what the person gave and never invented.
   The card is this file's own .ob-card, the same sheet a stranger already
   meets, carrying the Field's own watermark figure and wash rather than a
   second visual language copied from the mockup's CSS.

   EVERY RULING THE OLD FLOW CARRIED STILL HOLDS AND IS NOT RETYPED HERE
   WHERE IT WOULD JUST REPEAT: humble and warm, the same flow for both
   arrivals, replayable from the profile. One thing changed on purpose.
   "it does not spend real charge" was true of the sheet and is still true
   of the sheet; it was never true of a real entry typed into it, which
   ui/tutorial.js's own header already states for the Day One tutorial: "the
   entry is real and costs whatever any entry costs." The reviewed design
   ends in a real release, which is the engine actually moving charge, so
   this flow now carries a real entry the same way the tutorial does, through
   the exact same functions the Story tab's own Apply button calls. Nothing
   here is a second writer.

   THE SIGNAL TEST, round MP's breath script, is gone from this sheet. It was
   the thing it asked a stranger to do before a story existed to read; the
   reviewed design asks for the story itself instead, which is the one
   interactive thing with something real behind it. The breath script is
   not deleted from the product's history, it is superseded, the same way
   the old six slides of Reel A were cut from the mockup itself.

   WHAT THIS IS NOT: a second parser. The mirror's one real-engine line comes
   from parseStory and stCommit, read exactly as the Story tab and the Day
   One tutorial already read them. Nothing here guesses a feeling or a place
   from a word list of its own; the taps the person makes are kept as exactly
   that, a tap, never dressed up as something the engine found.

   J0, SAID LOUDLY BECAUSE IT IS STILL OPEN. There is no distress detector
   anywhere in this engine, and this flow reads a stranger's first story
   through parseStory with no check of any kind ahead of it. The mockup's
   own stop frame (06-controls.js, body.html) is inert by its own account,
   "draft text, needs a clinician's sign off", reachable only from a
   reviewer's own strip and triggered by nothing a person's words say. Adding
   a frame that looks like a safety check but answers no real signal would be
   worse than adding nothing, so none is added here. See obStory below,
   where the first stranger's words are actually read, for the same warning
   placed at the exact line it describes. Tracked in the owner's plan as J0,
   a ship blocker for any build a stranger who is not the owner can reach.
   ============================================================ */
/* THE AUTOMATIC OPEN IS OFF BY ITS OWN FLAG, unchanged: ui/login.js's
   loginEnter runs this sheet on its own switch, DEV_PLAY_ONBOARDING, and
   never reads this one. OB_AUTO is kept only because a gate still asserts
   it reads false; nothing in the product reads it to decide anything. */
var OB_AUTO=false;
/* THE TWELVE STARTING POINTS, THE SIX FEELING WORDS AND THE SEVEN BODY
   PLACES live in engine/data/onboarding.js since round QB, unchanged. The
   record carries their positions on every entry onboarding commits (ob.pick,
   ob.feel, ob.place), so the profile boundary has to know how long each list
   is, and the boundary is engine and may not read a table that lives here. */
/* nsteps is 8: arrive, ask, settle, feel, body, story, mirror, bridge. */
var OB_NSTEPS=8;
var OB={open:false, step:0, replay:false,
 pick:null, feel:null, place:null,
 text:'', commit:null, corr:'', fixes:[],
 /* the mirror's read of the story before it is committed, each
    correction's read, and one answer per address: yes or no, by node id */
 read:null, fixReads:[], ans:{}, more:{},
 /* the first release's plan, read off the yes rows above (F5). Derived on
    the bridge and never stored: the record keeps ob.yes, not the plan. */
 plan:null};

/* ============================================================
   THE SKIN, ROUND QG. "Redesign this in our field compass or body style.
   Just pull our aesthetics into this. And replace what's there."

   A six panel storyboard was drawn against this flow: a stock mountain lake
   under a glowing orange ring, a glossy translucent human with seven bright
   rainbow dots down its middle, a blue to pink gradient portal with the word
   Release inside it, and bright blue pill buttons. Section 4 of the owner's
   own Congruency TDD (reviews/ATUNED-System-Congruency-MVP-TDD.md) lists
   exactly that set as what this product avoids: "stock photography, humans as
   decoration, mystical portals, religious imagery, dashboard clutter, generic
   wellness aesthetics." The same section names what the language is: "dark
   field, minimal typography, thin geometry, body figure, rings, nodes, 112
   addresses, colour, motion, breathing, symbolic geometry."

   SO NOTHING HERE IS DRAWN BY EYE. Every mark below is the product's own,
   taken from the file that already owns it:

     the figure      BODYPATH and its transform, engine/data/figure.js, the
                     same silhouette ui/map.js clips the Body page to. Not a
                     spine with dots on it, which is what this file drew.
     the seat places PMBANDS, engine/data/practice.js, each seat's real height
                     on that figure. The Body page puts its seat rings there.
     the seat names  FLOWSEAT, same file, for where on the body each one is:
                     mid sternum, below the navel. The anatomy, not a mood.
     the seat colour seatCol, ui/component.js, which reads PAL, PAL_LIGHT or
                     PAL_VIVID by lighting, so a seat is the same colour here
                     as on the wheel and goes light on Snow like everything
                     else.
     the seat mark   iqxMark's grammar, ui/intakeui.js, merged this round and
                     named the house standard for a seat shown as a mark: a
                     disc washed with its seat, a quiet track at 2.4, a
                     heavier arc at 3.2 over it, and the glyph stroked and
                     never filled. The glyph is SEATGLYPH, canon.js, and no
                     second drawing is made for a thing that has one.
     the loop        the four section marks in shell/body.html, the eye, the
                     play ring, the two waves and the standing figure, which
                     is what the bar already draws for discover, play, flow
                     and embody.
     the release     ui/release.js keeps every line of it. This sheet hands
                     over through relPick and draws no release of its own.

   AND ONE RULE FROM THE CHIP IT COPIES, kept rather than loosened: an arc is
   a reading. iqxMark's own note says "an arc drawn full for decoration would
   lie in a product where every arc is a reading." So a seat mark on a card
   where nothing has been read yet carries its track and no arc, and the two
   cards that do carry an arc say in words what it counts.
   ============================================================ */
/* THE SEVEN SEATS ON THE REAL FIGURE. PMBANDS is crown first; this sheet
   reads root first, the order OB_PLACES and the body itself run in. */
function obSeatRows(){
 return BANDS.map(function(b){
  var pb=null, fs=null, i;
  for(i=0;i<PMBANDS.length;i++)if(PMBANDS[i].b===b)pb=PMBANDS[i];
  for(i=0;i<FLOWSEAT.length;i++)if(pb&&FLOWSEAT[i].k===pb.k)fs=FLOWSEAT[i];
  return {b:b, y:pb?pb.yp:50, where:fs?fs.seat:''};});}
/* ONE SEAT AS A MARK, the chip grammar iqxMark set. share is a real quantity
   or null, and null draws no arc. The box is 56 like the chip's, so the two
   are the same object at two sizes and not two drawings. */
function obSeatMark(b,share,cls){
 var R=24.5, C=2*Math.PI*R, s=(share==null)?null:Math.max(0,Math.min(1,share));
 return '<svg class="ob-mk'+(cls?' '+cls:'')+'" viewBox="0 0 56 56" aria-hidden="true" '
  +'style="--c:'+seatCol(b)+'">'
  +'<circle class="ob-mk-dk" cx="28" cy="28" r="27"/>'
  +'<circle class="ob-mk-tk" cx="28" cy="28" r="'+R+'"/>'
  +(s>0?'<circle class="ob-mk-ld" cx="28" cy="28" r="'+R+'" transform="rotate(-90 28 28)" '
   +'stroke-dasharray="'+(C*s).toFixed(1)+' '+C.toFixed(1)+'"/>':'')
  +'<g class="ob-mk-gl" transform="translate(16 16)">'+(SEATGLYPH[b]||SEATGLYPH._)+'</g></svg>';}
/* ============================================================
   THE STAGE, ROUND QH. His words, on the screenshots of round QG: "I don't
   want anything in the pop-up panel. I want full screen. I want this to feel
   heavily like visually designed. As if an ad agency did it ... And I want it
   to feel like I'm being led through a process. Right now it's doing none of
   those."

   What he was looking at: a 560 pixel card centred over the running app, the
   bar and the right rail dimmed behind it, and a step change that swapped the
   card's text in place. A dialog that paused the product, which is the
   opposite of somebody being taken somewhere.

   SO THE SHEET IS NOW A STAGE, and the stage is built once per open and
   stays. Three depths, the boot's own staging (shell/head.html, .bx-wash is
   "the far depth", the figure "the middle depth", the lens "the near"):

     far    the seven seat pools, the boot's wash, breathing on the Field's
            4.2 second wave. Moves least and arrives last.
     middle the 112 addresses as one ring, each tick in its own seat's colour,
            the Field's wheel drawn as a halo. It turns one eighth of a turn
            per step, so eight steps walk it once round: the turn the Settle
            card names ("you are about to walk one turn of it") is a turn a
            person watches happen. Progress, readable with every label off.
     near   the body. The real silhouette, the same one object for all eight
            steps. It is never redrawn between steps, it is moved: each step
            gives it a pose, and the change of pose is the camera.

   The card is the fourth thing, on top, and it is the only thing that is
   replaced. The old one leaves as a ghost, a copy with every id and data-ob
   attribute stripped so nothing can click it or find it, and the new one
   rises in behind it.

   THE MOTION LANGUAGE, and why each piece of it:

     direction   forward is up. The outgoing card lifts 36 pixels and goes on
                 the ease in, 260ms; the incoming one rises 26 from below on
                 the ease out. Back reverses both signs, so a person who
                 pressed Back sees the column come down to meet them. The
                 direction is the information: with the words blurred out a
                 viewer could still say which button was pressed.
     overlap     the new card starts 140ms in, while the old is still going.
                 Nothing waits for the thing before it to finish.
     staging     eyebrow, headline, body, actions, 70ms apart, inside the
                 60 to 110 range where siblings read as a sequence and not as
                 a list being read out. The headline rises word by word out
                 of its own line, 45ms apart, deliberately under 50 so it
                 reads as one event with texture rather than as six.
     parallax    the three depths go to the same pose on different clocks:
                 the body in 640ms with a backswing, the ring in 820, the far
                 pools in 1100. Same destination, different arrival, and the
                 difference is what the eye reads as depth.
     anticipation the body draws back a little before every move, two percent
                 against the way it is about to go, 16 per cent of the move.
                 The boot's own push does exactly this (bxPush, "a push with
                 no draw back first starts from rest at full speed, which is
                 the one thing nothing in nature does").
     data        light only where something was read. The seat a person
                 picks ignites on the body and stays lit into the Story. The
                 mirror ignites the seats the words put weight on, root to
                 crown on the boot's 90ms beat, each one landing with a single
                 overshoot and a ring of light leaving it. Nothing glows on a
                 step where nothing has been read, which is the rule iqxMark
                 set for an arc, carried to a glow.

   AT REST, which is most of the time a person spends here, rebuilt in round
   QI (the block above obStageFig has the account): the whole figure
   breathes on the Field's 4.2 second wave, a thin line of ink climbs the
   spine on each inhale and each seat ring flares as it passes, and the room
   inhales with it and drifts. The figure, the line and the pools are layer
   transforms and opacity and run on the compositor, measured. The rings are
   stroke width and opacity, which is a repaint and not free: seven circles
   of about ten pixels, each lit for about a third of a breath. Said so
   rather than claimed free, which this line did until round QH measured it.

   WHAT THIS DOES NOT REOPEN, all ruled last round for reasons still true:
   no stock picture, no glossy figure with seven bright dots (the seats on the
   welcome are the house rings at half strength, never glows), no five step
   rail over an eight step flow (the rail has eight stations), no countdown on
   the hand off, and no targets on the body itself. Round QG measured it and
   the number still stands: at 390 the seven seats span 49 of 102 units of the
   drawing's height, 15 pixels between crown and brow against a tap floor of
   44, so the chips stay the control and the body is the picture.

   REDUCED MOTION GETS THE END STATE, never a faster animation: no ghost, no
   rise, no camera, no breath, no pulse, no pen. The body is there drawn
   whole and lit from above from the first frame. The poses are still there; they are simply
   where everything already is.
   ============================================================ */
function obCalm(){ try{ return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches); }catch(e){ return false; } }
/* the step names on the rail, the same words each card's eyebrow already uses */
var OB_STEPNM=['Arrive','Ask','Settle','Feel','Body','Story','Mirror','Next'];
/* THE BODY, ONCE, AT STAGE SIZE. The Body page's silhouette at the Body page's
   transform, seats where PMBANDS puts them. The names are HTML laid over the
   drawing at each seat's own height rather than SVG text, because an SVG name
   scales with the drawing: 4.4 units is 33 pixels on a 760 pixel body and 11
   on a 250 pixel one, and this one object is shown at both. A name in pixels
   is 13 pixels at every size. Under it, on the steps that introduce the
   seats, the anatomy line FLOWSEAT already carries, so a name never stands
   without its meaning (round PO).

   The box is the Body page's own with the gutter on the left kept, 6 to 74
   wide, so the names have the 28.8 units left of the silhouette to sit in. */
var OB_FIGBOX={x:6,w:68,h:102};
/* ============================================================
   ROUND QI, THE MOTION PASS. His grade on the welcome: "the animation is a
   d-, visually, its a stand in and needs aesthetic innovation and animation
   pass, out program must feel alive." Measured before a line was changed
   (tools/obwelcome-motion.js, computed style read frame by frame): on the
   way in the body layer's scale and opacity held at exactly 1 and the ring's
   rotation at 0, so every layer that moved arrived by fading, and at rest the
   only things that changed in eight seconds were the wash's opacity, .82 to
   1 on pools that are themselves under 15 per cent colour, and seven ten
   pixel rings. A still picture with a dimmer on it. The grade was right.

   WHAT MOVES NOW, every piece an idiom the product already owns:

     the spine     drawn root to crown first, the boot's own bxSpine draw,
                   because the house rule is that the body breathes upward.
     the seats     each ring pops on the boot's spring (bxPop) at the moment
                   the spine's drawn tip passes its real PMBANDS height, so the
                   seven arrive as one rising event and not on a timer.
     the outline   poured from the crown down both sides at once, one stroke
                   with a three part dash, the halo's own draw. The contour
                   starts at the crown, so half the dash runs each way and the
                   two meet between the feet.
     the camera    a push in: the body from 94 per cent, the ring from 96 with
                   the boot's drift wound out of it (bxDrift, -24 degrees),
                   the far pools least. Nearer moves more, the same parallax
                   the step change already uses.
     at rest       the body breathes on the Field's 4.2 second wave, and on
                   every inhale one thin line of ink climbs the spine, the
                   wheel's thread pulse (ui/wheel.js, pulses), and each seat
                   ring flares as it passes. Ink and never a seat's colour:
                   nothing has been read on this step and a coloured light
                   would claim it had.
     a step        the same pulse once, quick: up the spine on a step forward,
                   down it on Back, so the direction reads on the body too.

   obBezT finds when a CSS ease reaches a given share of its travel, so a
   seat's flare is timed to the instant the pulse actually reaches it rather
   than to a guess of where a curve might be. */
function obBezT(x1,y1,x2,y2,f){
 var lo=0,hi=1,s,k,B=function(a,b,t){return 3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*b+t*t*t;};
 for(k=0;k<26;k++){ s=(lo+hi)/2; if(B(y1,y2,s)<f)lo=s; else hi=s; }
 return B(x1,x2,(lo+hi)/2);}
/* THE CLOCK, in seconds and milliseconds. The breath starts at OB_BREATH_E,
   once the arrival has settled, so the first inhale is not spent under the
   entrance. The climb is the inhale's first 46 per cent, which is how long
   obxPulseUp's keyframes give it. Change one, change the stylesheet beside
   it: shell/head.html carries the same three numbers. */
var OB_SPINE={ms:600, at:120, y0:57, y1:3.6};
var OB_BREATH={e:2100, cyc:4200, climb:.46, peak:.08};
function obStageFig(){
 var rows=obSeatRows(), B=OB_FIGBOX, root=rows[0], crown=rows[rows.length-1];
 var span=root.y-crown.y;
 var s='<div class="obx-fig" aria-hidden="true">'
  +'<svg class="obx-figsv" viewBox="'+B.x+' 0 '+B.w+' '+B.h+'">'
  /* LIT FROM ABOVE, which the stylesheet said and did not do: the fill and
     the rim are both brightest at the shoulders and gone by the feet */
  +'<defs><linearGradient id="obxSkF" x1="0" y1="0" x2="0" y2="1">'
  +'<stop class="obx-gf0" offset="0"/><stop class="obx-gf1" offset=".42"/><stop class="obx-gf2" offset="1"/>'
  +'</linearGradient><linearGradient id="obxSkS" x1="0" y1="0" x2="0" y2="1">'
  +'<stop class="obx-gs0" offset="0"/><stop class="obx-gs1" offset=".34"/><stop class="obx-gs2" offset="1"/>'
  +'</linearGradient></defs>'
  +'<g transform="translate(0 1)">'
  +'<g transform="translate('+PMTX+','+PMTY+') scale('+PMS+')">'
  +'<path class="obx-skin" d="'+BODYPATH+'"/>'
  /* THE PEN, a second copy of the outline that exists only to be drawn on
     arrival. Measured, round QI: the skin's rim is non-scaling, and Chromium
     lays a non-scaling stroke's dashes out in screen pixels while scaling
     them by pathLength in the path's own units, so a dash of a quarter ran a
     third of the contour at 1600 and nearly all of it at 390, and the half
     coming down the left side never showed. This copy scales like any other
     line, so pathLength means what it says in every browser, and its width
     is set from the drawing's real scale (obPenWidth) to match the rim. */
  +'<path class="obx-draw" pathLength="100" d="'+BODYPATH+'"/></g>'
  /* root end first, so the draw climbs */
  +'<line class="obx-ax" pathLength="100" x1="50" y1="'+OB_SPINE.y0+'" x2="50" y2="'+OB_SPINE.y1+'"/>';
 rows.forEach(function(r,i){
  /* the pop: when the spine's tip, on its own curve, reaches this seat */
  var fa=(OB_SPINE.y0-r.y)/(OB_SPINE.y0-OB_SPINE.y1);
  var pp=Math.round(OB_SPINE.at+OB_SPINE.ms*obBezT(.45,0,.55,1,fa));
  /* the flare: when the climbing pulse, on the breath's curve, reaches it,
     less the time the flare's own keyframes take to peak */
  var fp=span?(root.y-r.y)/span:0;
  var pd=Math.round(OB_BREATH.e+OB_BREATH.cyc*(OB_BREATH.climb*obBezT(.37,0,.63,1,fp)-OB_BREATH.peak));
  s+='<g class="obx-s" data-obseat="'+esc(r.b)+'" style="--c:'+seatCol(r.b)+';--i:'+i+';--pp:'+pp+'ms;--pd:'+pd+'ms">'
   +'<circle class="obx-sr" cx="50" cy="'+r.y+'" r="2.4"/></g>';});
 s+='</g></svg>';
 /* the pulse, from the root seat to the crown seat, in the drawing's own
    coordinates: the breath's one, and the step's one */
 var pt=((root.y+1)/B.h*100).toFixed(3)+'%', pl=((50-B.x)/B.w*100).toFixed(3)+'%', cl=(span/B.h).toFixed(4);
 s+='<i class="obx-pulse" style="top:'+pt+';left:'+pl+';--cl:'+cl+'"></i>'
  +'<i class="obx-surge" style="top:'+pt+';left:'+pl+';--cl:'+cl+'"></i>';
 /* the glows and the names, in the drawing's own coordinates as percentages */
 rows.forEach(function(r,i){
  var top=((r.y+1)/B.h*100).toFixed(3)+'%', left=((50-B.x)/B.w*100).toFixed(3)+'%';
  var right=((B.x+B.w-26)/B.w*100).toFixed(3)+'%';
  s+='<span class="obx-glow" data-obseat="'+esc(r.b)+'" style="--c:'+seatCol(r.b)+';top:'+top+';left:'+left+'">'
   +'<i class="obx-wave"></i></span>'
   +'<span class="obx-fn" data-obseat="'+esc(r.b)+'" style="--c:'+seatCol(r.b)+';top:'+top+';right:'+right+';--i:'+i+'">'
   +'<b>'+esc(r.b)+'</b>'+(r.where?'<i>'+esc(r.where)+'</i>':'')
   +'<em>you tapped here</em></span>';});
 return s+'</div>';}
/* THE PEN'S WIDTH: the rim's 1.2 screen pixels in the outline's own units.
   The outline is drawn at PMS inside a viewBox 102 units tall shown at the
   figure's layout height, so one of its units is PMS times that height over
   102 pixels. Read after the stage is shown, since a hidden box has no
   height; with none, the stylesheet's own width stands. */
function obPenWidth(h){
 var f=h.querySelector('.obx-fig'), d=h.querySelector('.obx-draw');
 var k=f?PMS*f.offsetHeight/OB_FIGBOX.h:0;
 if(d&&k>0)d.style.strokeWidth=(1.2/k).toFixed(3);}
/* THE 112, AS A RING. Every address, in the engine's own order, which runs
   seat by seat root first, so the ring reads as seven arcs of colour and four
   neutral ticks for the two places above and below the body. The Field's
   wheel at the size of a halo: the product's two primary drawings, the body
   and the wheel, composed as one picture. Drawn once, coloured once, and never
   repainted: it moves only as a whole layer. */
function obRing(){
 var s='<svg class="obx-ringsv" viewBox="0 0 200 200">'
  +'<circle class="obx-r0" cx="100" cy="100" r="98.6"/>'
  +'<circle class="obx-r1" cx="100" cy="100" r="88.4"/>';
 var N=(typeof NODES!=='undefined'&&NODES.length)?NODES:[], n=N.length||112;
 for(var k=0;k<n;k++){
  var a=(-90+k*360/n)*Math.PI/180, b=N[k]?N[k].b:null;
  var c=(b&&BANDS.indexOf(b)>=0)?seatCol(b):'var(--dim)';
  var r0=91.2, r1=(k%4===0)?96.6:95.2, ca=Math.cos(a), sa=Math.sin(a);
  s+='<line class="obx-tk" style="--c:'+c+';--s:'+k+'" x1="'+(100+r0*ca).toFixed(2)+'" y1="'+(100+r0*sa).toFixed(2)
   +'" x2="'+(100+r1*ca).toFixed(2)+'" y2="'+(100+r1*sa).toFixed(2)+'"/>';}
 /* the gold halo, the boot's, as ruled: gold round the whole figure */
 return s+'<circle class="obx-halo" cx="100" cy="100" r="101.6" pathLength="100"/></svg>';}
/* THE SKELETON. Built on open and kept until close. The rail's eight stations
   are the .ob-dot every gate already counts; they moved from inside the card
   to the top of the screen, because a rail that is redrawn with each card
   cannot show the run so far filling. The wordmark is the bar's own, cloned
   from the document rather than drawn a second time. */
/* ROUND QJ: the Day One tutorial stands on this same stage (ui/tutorial.js),
   so the count of stations and the way out are the caller's. Called with
   only a host it is the first run's stage exactly as it was: eight stations
   and a Not now that answers to data-ob. */
function obStage(h,n,xattr){
 if(h.querySelector('.obx-slot'))return;
 n=n||OB_NSTEPS; xattr=xattr||'data-ob="skip"';
 var wm=document.querySelector('#brand .bn'), mark=wm?wm.outerHTML:'';
 h.classList.add('obx');
 h.innerHTML='<div class="obx-far" aria-hidden="true"><div class="obx-wash"></div></div>'
  +'<div class="obx-vig" aria-hidden="true"></div>'
  +'<div class="obx-tint" aria-hidden="true"></div>'
  +'<div class="obx-ring" aria-hidden="true">'+obRing()+'</div>'
  +'<div class="obx-near">'+obStageFig()+'</div>'
  +'<div class="obx-top">'
  +'<span class="obx-mark" aria-hidden="true">'+mark+'</span>'
  +'<div class="obx-rail" role="progressbar" aria-valuemin="1" aria-valuemax="'+n+'">'
  +'<div class="obx-track"><i class="obx-fill"></i>'
  +Array.from({length:n}).map(function(_,i){
    return '<span class="ob-dot" style="--k:'+i+'"></span>';}).join('')+'</div>'
  +'<span class="obx-step"></span></div>'
  +'<button type="button" class="obx-x" '+xattr+'>Not now</button>'
  +'</div>'
  +'<div class="obx-slot"></div>';}
/* WHAT THE BODY SHOWS ON EACH STEP. lit is the seats that carry a reading,
   pick the one a person tapped. Every name here is read off what this sheet
   already holds; nothing is lit that the mirror or the plan does not say. */
function obLitNow(){
 var s=OB.step, lit=[], pick=null;
 var pl=(OB.place!=null&&OB.place>=0)?OB_PLACES[OB.place]:null;
 if((s===4||s===5)&&pl)pick=pl.b;
 if(s===6){
  (OB.read||[]).forEach(function(g){if(lit.indexOf(g.seat)<0)lit.push(g.seat);});
  OB.fixReads.forEach(function(f){f.groups.forEach(function(g){if(lit.indexOf(g.seat)<0)lit.push(g.seat);});});}
 if(s===7&&OB.plan&&OB.plan.ok)
  OB.plan.addrs.forEach(function(i){var b=BY[i]&&BY[i].b; if(b&&lit.indexOf(b)<0)lit.push(b);});
 if(pick&&lit.indexOf(pick)<0)lit.push(pick);
 /* THE MIRROR KEEPS THE TAP, round QH. Its own copy says "You tapped your
    chest, at your Heart seat. Your words put weight at other seats ... Both
    are kept as they are", and the body showed only the second half: the seat
    the person pressed went dark the moment the mirror came up, so the drawing
    and the sentence beside it disagreed. The tapped seat is marked, a full
    ring and its name with no light, because light means words put weight
    there and the words did not. A tap the words also lit is simply lit. */
 var mark=(s===6&&pl&&lit.indexOf(pl.b)<0)?pl.b:null;
 return {lit:lit, pick:pick, mark:mark};}
/* LIGHT THE BODY. A seat newly lit ignites; one already lit stays lit and is
   not ignited again, so an answer on the mirror that redraws the card does
   not fire every seat a second time. Ignition order is root to crown on the
   boot's 90ms beat, starting after the body has landed in its new pose. */
/* now, when given, is the caller's own {lit, pick, mark}: the tutorial lights
   the seats its own entry read, through this same ignition. */
function obFigSync(h,delay,now){
 now=now||obLitNow(); var on={}, k=0, calm=obCalm();
 /* A PREVIEW NEVER OUTLIVES ITS STEP. Found in the frame capture, which
    hovers a chip before pressing it the way a pointer does: the press
    replaces the card, a removed chip never fires pointerout, and obPreview
    ignores every step but the Body one, so the hovered seat kept its preview
    light through the Story and onto the mirror, where it claimed weight the
    words did not put there. Every sync starts from no preview. */
 h.querySelectorAll('.obx-near .prev').forEach(function(x){x.classList.remove('prev');});
 now.lit.forEach(function(b){on[b]=1;});
 BANDS.forEach(function(b){
  var q='[data-obseat="'+b.replace(/"/g,'')+'"]';
  var els=h.querySelectorAll('.obx-near '+q);
  var was=els[0]&&els[0].classList.contains('on');
  els.forEach(function(e){
   e.classList.toggle('on',!!on[b]);
   e.classList.toggle('pick',now.pick===b);
   e.classList.toggle('mark',now.mark===b);});
  if(on[b]&&!was&&!calm){
   var gl=h.querySelector('.obx-glow'+q);
   if(gl){ gl.classList.remove('ign'); void gl.offsetWidth;
    gl.style.setProperty('--ig',((delay||0)+k*90)+'ms'); gl.classList.add('ign'); k++; }}});
 /* the room takes the colour of the first seat that carries a reading */
 var tc=now.lit.length?seatCol(now.lit[0]):null;
 h.classList.toggle('obx-lit',!!tc);
 if(tc)h.style.setProperty('--tc',tc);}
/* THE CAMERA. The poses are CSS, per step and per width, so a pose is a
   design value and not a number buried in a function. This reads where each
   layer is, lets the new step's pose apply, reads where each layer now
   belongs, and animates the difference. First, last, invert, play. */
var OB_LAYERS=[
 /* near: the body. 640ms, a two per cent backswing over the first 16 per cent */
 {q:'.obx-near', ms:640, back:true},
 /* middle: the ring. 820ms, no backswing, a turn does not wind up */
 {q:'.obx-ring', ms:820},
 {q:'.obx-tint', ms:820},
 /* far: the pools. slowest, least, last */
 {q:'.obx-far', ms:1100}];
function obPoseRead(h){
 return OB_LAYERS.map(function(L){
  var e=h.querySelector(L.q); if(!e)return null;
  var c=getComputedStyle(e);
  return {e:e, translate:c.translate, scale:c.scale, rotate:c.rotate, opacity:c.opacity};});}
function obPosePlay(h,from,dir){
 if(obCalm())return;
 var to=obPoseRead(h);
 OB_LAYERS.forEach(function(L,i){
  var a=from[i], b=to[i]; if(!a||!b)return;
  if(a.translate===b.translate&&a.scale===b.scale&&a.rotate===b.rotate&&a.opacity===b.opacity)return;
  var A={translate:a.translate, scale:a.scale, rotate:a.rotate, opacity:a.opacity};
  var Z={translate:b.translate, scale:b.scale, rotate:b.rotate, opacity:b.opacity};
  var kf;
  if(L.back){
   /* the backswing: against the direction of travel, and drawn in */
   var s0=parseFloat(a.scale)||1, sB=s0*0.98;
   kf=[Object.assign({},A,{easing:'cubic-bezier(.45,0,.55,1)'}),
    Object.assign({},A,{offset:.16, scale:String(sB), easing:'cubic-bezier(.22,1,.36,1)'}),Z];
  } else kf=[Object.assign({},A,{easing:'cubic-bezier(.22,1,.36,1)'}),Z];
  try{ b.e.animate(kf,{duration:L.ms}); }catch(e){}});}
/* THE GHOST. The outgoing card, copied where it stands and made inert: no id,
   no data-ob attribute, no pointer, hidden from the accessibility tree. It is
   appended after the live slot, so document order still finds the live card
   first for anything that asks for .ob-card, .ob-h or #obtext. */
/* HOW LONG THE OLD CARD TAKES TO GO. 260 on a wide screen, where the words
   and the body never share ground. 180 on a narrow one, where they do: the
   body stands over the column there, and on the move into the Body step it
   grows from the emblem down into the space the outgoing card is lifting
   out of. Measured at 390 before this: at 160ms the ghost was still at about
   half strength under the growing figure and its names. At 180 the ease in
   has it under a tenth by then. Still inside the 180 to 260 an exit takes. */
function obGhostMs(){ try{ return (window.matchMedia&&matchMedia('(max-width: 899px)').matches)?180:260; }catch(e){ return 260; } }
function obGhost(h,old,dir){
 if(!old||obCalm())return;
 var r=old.getBoundingClientRect(), sc=old.querySelector('.ob-scroll'), y=sc?sc.scrollTop:0;
 var g=old.cloneNode(true);
 g.className='obx-ghost'; ['role','aria-modal','aria-label'].forEach(function(a){g.removeAttribute(a);});
 g.setAttribute('aria-hidden','true'); g.inert=true;
 [g].concat([].slice.call(g.querySelectorAll('*'))).forEach(function(e){
  if(e.id)e.removeAttribute('id');
  /* data-tut too: the tutorial's ghost is made here, and a copy of its Next
     must never be a second Next */
  [].slice.call(e.attributes).forEach(function(a){if(/^data-(ob|tut)/.test(a.name))e.removeAttribute(a.name);});});
 g.style.left=r.left+'px'; g.style.top=r.top+'px'; g.style.width=r.width+'px'; g.style.height=r.height+'px';
 h.appendChild(g);
 var gs=g.querySelector('.ob-scroll'); if(gs)gs.scrollTop=y;
 var gone=function(){ if(g.parentNode)g.parentNode.removeChild(g); }, an=null;
 try{
  an=g.animate([{opacity:1,translate:'0 0'},{opacity:0,translate:'0 '+(-36*dir)+'px'}],
   {duration:obGhostMs(),easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
  an.onfinish=gone; an.oncancel=gone;
 }catch(e){ gone(); }
 /* the fallback only for an exit that is not alive: one that is still
    running, or held, finishes on its own and removes itself */
 setTimeout(function(){ if(!an||(an.playState!=='running'&&an.playState!=='paused'))gone(); },900);}
/* THE STAGGER. Each direct child of the card's column gets its place in the
   order, capped at seven so a long mirror does not keep a person waiting on
   its last paragraph; chips inside a row get their own faster count. */
function obStagger(card){
 var inn=card.querySelector('.obx-in'); if(!inn)return;
 [].slice.call(inn.children).forEach(function(c,i){
  c.style.setProperty('--si',Math.min(i,7));
  /* .ob-g is the tutorial's chain, four rows that take the chips' own count */
  [].slice.call(c.querySelectorAll('.ob-seat,.ob-g')).forEach(function(x,j){x.style.setProperty('--ci',j);});});}
/* the headline, one word to a masked line, so it rises out of its own baseline.
   textContent is the title exactly: the spaces stay as text between the words. */
function obWords(t){
 return String(t||'').split(' ').map(function(w,i){
  return '<span class="obx-wl"><span class="obx-w" style="--wi:'+i+'">'+esc(w)+'</span></span>';}).join(' ');}
/* THE LOOP, AND IT CLOSES. CLAUDE.md: "it is a circle, never a list ... a
   numbered column of four says the fourth one is the end, which is the
   opposite of a loop. Anywhere the four appear together they close." So the
   storyboard's four cards with arrows between them are drawn as four marks on
   one ring with the track running all the way round and no arrow head on it.
   The marks are the section bar's own, shell/body.html, so the four things a
   person is about to meet are drawn here exactly as they will be drawn in the
   menu they meet them in. */
var OB_LOOP=[
 {k:'discover', nm:'Discover', say:'You write what happened, in your own words.',
  ic:'<path d="M2.8 12c2.4-4.2 5.5-6.3 9.2-6.3s6.8 2.1 9.2 6.3c-2.4 4.2-5.5 6.3-9.2 6.3S5.2 16.2 2.8 12z"/><circle cx="12" cy="12" r="2.9"/>'},
 {k:'play', nm:'Play', say:'The instrument reads where that sits in your body.',
  ic:'<circle cx="12" cy="12" r="9.2"/><path d="M10.2 8.6l5.2 3.4-5.2 3.4z"/>'},
 {k:'flow', nm:'Flow', say:'You say the lines, and the charge leaves.',
  ic:'<path d="M3 9.2c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0M3 14.8c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0"/>'},
 {k:'embody', nm:'Embody', say:'What is left is yours, and the circle starts again.',
  ic:'<circle cx="12" cy="7.8" r="2.3"/><path d="M3.6 4.4c1.7 4.9 4.5 7.4 8.4 7.4s6.7-2.5 8.4-7.4M12 11.8v4.4M7.4 21c1.2-3.2 2.7-4.8 4.6-4.8s3.4 1.6 4.6 4.8"/>'}];
function obLoopRing(){
 /* R 36 and a node of 11.5, not 34 and 13: at the first values the chord
    between two neighbouring nodes was 48 units and the nodes took 26 of it,
    so 22 units of track showed between them and the ring read as a flower of
    four discs rather than as a turn with four stations on it. 28 units show
    now, which is the shortest run of clear track that still reads as track. */
 var R=36, cx=50, cy=50, NR=11.5;
 var s='<svg class="ob-loop" viewBox="0 0 100 100" aria-hidden="true">'
  +'<circle class="ob-loop-tk" cx="'+cx+'" cy="'+cy+'" r="'+R+'"/>';
 OB_LOOP.forEach(function(x,i){
  var a=(-90+i*90)*Math.PI/180, px=cx+R*Math.cos(a), py=cy+R*Math.sin(a);
  s+='<g class="ob-loop-n" style="animation-delay:'+(0.08+i*0.07).toFixed(2)+'s">'
   +'<circle class="ob-loop-d" cx="'+px.toFixed(2)+'" cy="'+py.toFixed(2)+'" r="'+NR+'"/>'
   +'<g class="ob-loop-g" transform="translate('+(px-8).toFixed(2)+' '+(py-8).toFixed(2)+') scale(.667)">'
   +x.ic+'</g></g>';});
 return s+'</svg>';}
/* the four, as rows beside the ring, each with its own plain sentence. One
   object says the shape and the rows say the words: a ring with four words
   crammed on it says neither, and at a hundred and sixteen pixels a word on
   that ring renders at five, which is half the type floor.

   THE MARK IS ON BOTH, which is a legend and not a second drawing. The ring
   says these four close; the row says which mark is which word. A person
   reading the row learns the mark, and the mark is the one the section bar
   will draw for the rest of their time in the product. */
function obLoopRows(){
 return '<ol class="ob-loopr">'+OB_LOOP.map(function(x){
   return '<li><svg class="ob-loopr-ic" viewBox="0 0 24 24" aria-hidden="true">'+x.ic+'</svg>'
    +'<span class="ob-loopr-n">'+esc(x.nm)+'</span>'
    +'<span class="ob-loopr-s">'+esc(x.say)+'</span></li>';}).join('')+'</ol>';}
function obOpen(replay){
 var h=document.getElementById('ob'); if(!h)return;
 if(typeof authFunnelStart==='function')authFunnelStart();
 OB.open=true; OB.step=0; OB.replay=!!replay;
 OB.pick=null; OB.feel=null; OB.place=null;
 OB.text=''; OB.commit=null; OB.corr=''; OB.fixes=[];
 OB.read=null; OB.fixReads=[]; OB.ans={}; OB.more={}; OB.plan=null;
 OB.shown=-1;
 if(OB.leaveT){ clearTimeout(OB.leaveT); OB.leaveT=null; }
 h.classList.remove('ob-leaving');
 /* a fresh stage on every open, so the arrival plays from its first frame */
 h.innerHTML=''; h.classList.remove('obx','obx-lit','obx-in-arrive');
 obStage(h);
 /* the running app goes out of the picture, not dimmed behind it: hidden, so
    nothing of it shows and the compositor stops drawing what nobody sees */
 document.body.classList.add('ob-on');
 obRender();
 h.style.display='flex';
 obPenWidth(h);
 var f=h.querySelector('.obx-slot button,.obx-slot textarea'); if(f)f.focus({preventScroll:true});}
/* THE HANDOFF TO THE FIELD, unchanged in length from round MP and now a push
   rather than a fade: the body goes forward and past the camera, the boot's
   own exit (bxPush), so leaving the first run reads as going in. */
var OB_LEAVE_MS=520;
/* the push, on its own so the tutorial's way out is this one and not a copy */
function obPushOut(h){
 if(obCalm())return;
 try{
  var n=h.querySelector('.obx-near'), r=h.querySelector('.obx-ring');
  if(n)n.animate([{scale:getComputedStyle(n).scale,opacity:1,easing:'cubic-bezier(.45,0,.55,1)'},
   {offset:.26,scale:String((parseFloat(getComputedStyle(n).scale)||1)*.972),opacity:1,easing:'cubic-bezier(.4,0,1,1)'},
   {scale:String((parseFloat(getComputedStyle(n).scale)||1)*1.45),opacity:0}],{duration:460,fill:'forwards'});
  if(r)r.animate([{opacity:getComputedStyle(r).opacity},{opacity:0,scale:String((parseFloat(getComputedStyle(r).scale)||1)*1.12)}],
   {duration:420,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
 }catch(e){}}
function obClose(){
 var h=document.getElementById('ob'); if(!h)return;
 OB.open=false; h.classList.add('ob-leaving');
 document.body.classList.remove('ob-on');
 obPushOut(h);
 /* LEFT BEFORE COMMIT. Nothing was written, and the words are not lost:
    they are still the Story tab's pending text, ST_TEXT, where the Commit
    button there can keep them. Said once, so a person who pressed Escape on
    the mirror is not left to assume the story was saved. */
 var left=OB.read&&!OB.commit&&OB.text&&typeof ST_TEXT==='string'&&ST_TEXT===OB.text;
 OB.leaveT=setTimeout(function(){ OB.leaveT=null; if(OB.open)return;
  h.style.display='none'; h.classList.remove('ob-leaving','obx','obx-lit'); h.innerHTML=''; },OB_LEAVE_MS);
 /* EVERY WRITE THAT CAN FAIL REPORTS, unchanged lesson. */
 try{
  if(CURP){ if(!CURP.ui||typeof CURP.ui!=='object')CURP.ui={}; CURP.ui.onboarded=true;
   if(!pSave()&&typeof status==='function')
    status('This browser would not save. The first run will open again.','fail'); }
 }catch(e){
  if(typeof status==='function')
   status('This browser would not save. The first run will open again.','fail'); }
 if(typeof render==='function')render();
 if(left&&typeof status==='function')status('Nothing committed. Your words wait in the Story tab.');}

/* ---- the card shell. nsteps carries over tutorial.js's own pattern,
   because a sheet of a fixed four steps is no longer the only one. ---- */
/* A LABEL IS TITLE CASED AND A SENTENCE IS NOT, and this card was printing a
   sentence as a title. .pm-eye carries text-transform:capitalize, and
   shell/head.html states the rule beside it: "A label is a short name for a
   region: four words or fewer, and no comma with a word after it ... Everything
   else is a sentence. A sentence takes plain and stays in sentence case."
   Measured on the shipped sheet: the welcome's eyebrow rendered "Welcome To A
   Neurosomatic Experience", five words, a sentence wearing a title. The rule
   is applied here once rather than remembered per card. */
function obEyeCls(s){
 var t=String(s||'').trim();
 return (t.split(/\s+/).length<=4&&!/,\s*\S/.test(t))?'pm-eye':'pm-eye plain';}
/* HOW FAR ALONG, not only where. Eight identical dots with one lit answers
   "which step is this" only by counting them, which is a person doing the
   instrument's arithmetic. A passed step is marked, so the run so far is a
   length a person reads on sight. */
/* ONE DRAWING PER CARD. The watermark is the standing figure behind every
   card, which was the only figure this sheet had. Four cards now carry a
   drawing of their own, and the watermark sat behind them: a spine with seven
   coloured dots showing through a silhouette, two drawings of one subject on
   one card, and the one the brief rules out drawn over the one it asks for.
   Measured on the Body card at 390, where the watermark's column reads through
   the figure's belly, and on Settle, where its gold halo lands in the middle
   of the loop ring and puts a mark where the loop has no station. A card that
   carries a drawing carries no watermark, read off the body it was handed
   rather than off a flag a caller has to remember to pass. */
/* ROUND QH: the card is a column on the stage and no longer a sheet. The wash,
   the watermark and the dots are the stage's, built once in obStage, so a card
   carries only what changes from one step to the next. The column is wrapped
   in .obx-in so a short card sits on the optical centre of the screen and a
   long one, the mirror, scrolls from its top. */
function obCard(eye,title,body,acts){
 return '<div class="ob-card" role="dialog" aria-modal="true" aria-label="'+esc(title)+'">'
  +'<div class="ob-scroll"><div class="obx-in">'
  +'<span class="'+obEyeCls(eye)+' obx-eye">'+esc(eye)+'</span>'
  +'<h2 class="ob-h" tabindex="-1">'+obWords(title)+'</h2>'
  +body
  +'<div class="ob-acts">'+acts+'</div>'
  +'</div></div></div>';}
/* THE RAIL. Eight stations, the run so far filled, the step in hand named in
   words beside it, so the rail says how far along without anybody counting. */
function obRail(h){ obRailAt(h,OB.step,OB_NSTEPS,OB_STEPNM); }
/* the rail for any run on this stage: the step, how many, and their names */
function obRailAt(h,s,n,nm){
 h.querySelectorAll('.obx-rail .ob-dot').forEach(function(d,i){
  d.classList.toggle('on',i===s); d.classList.toggle('past',i<s);});
 var f=h.querySelector('.obx-fill'); if(f)f.style.setProperty('--p',(s/(n-1)).toFixed(4));
 var rl=h.querySelector('.obx-rail');
 if(rl){ rl.setAttribute('aria-valuenow',String(s+1));
  rl.setAttribute('aria-valuetext','Step '+(s+1)+' of '+n+', '+nm[s]); }
 var t=h.querySelector('.obx-step');
 if(t)t.innerHTML='Step <b>'+(s+1)+'</b> of '+n+'<span class="obx-stepn">'+esc(nm[s])+'</span>';}
/* a row of chips, one choice at most. sel is the picked index, -1 for "not
   sure", null for nothing picked yet. b, when given, is the chip's seat
   band and tints it through seatCol, the same colour the body figure and
   the finished card already use for that seat; with no b the chip carries
   no colour, because this file makes no claim it has not earned.

   A SEAT CHIP CARRIES ITS SEAT MARK, round QG, the grammar ui/intakeui.js set
   this round and the reason the twelve starting points and the six feeling
   words still carry none: a feeling is not one place in the body, which
   engine/data/onboarding.js states beside those two lists, and a mark would
   be the claim this file has not earned. The seven body places are a seat and
   the data says so, so they get the mark and nothing else does. The mark
   carries no arc here: nothing has been read at the point a person is being
   asked where they feel it.

   AND THE PRESSED CHIP IS A RING, NEVER A SLAB. It filled solid with the
   seat, which on Dark put a Root answer at full #D6524C and made the pressed
   chip the brightest object on the card. ui/intakeui.js records the same
   defect and its fix, round PQ: "pressed is a ring in the archetype's own
   seat over a faint wash of it, never the solid accent slab ... which was the
   brightest thing on the screen and pulled the eye off the question." Same
   fix, same values, so the two surfaces press the same way. */
function obChips(items,attr,sel,withNotSure){
 return '<div class="ob-seats'+(items.some(function(x){return x.b;})?' ob-seats-mk':'')+'">'
  +items.map(function(x,i){
   var c=x.b?' style="--c:'+seatCol(x.b)+'"':'';
   return '<button type="button" class="ob-seat'+(sel===i?' on':'')+'"'+c
    +' data-'+attr+'="'+i+'">'
    +(x.b?obSeatMark(x.b,null,'ob-mk-s'):'')
    +'<span class="ob-seat-n">'+esc(x.n)+'</span></button>';}).join('')
  +(withNotSure?'<button type="button" class="ob-seat'+(sel===-1?' on':'')+'" data-'+attr+'="-1">'
   +'<span class="ob-seat-n">Not sure</span></button>':'')
  +'</div>';}

/* ROUND QH'S CHANGE OF STEP, on its own since round QJ so the Day One
   tutorial changes step through this one and not through a copy of it. The
   card goes into the stage's slot. On a change of step the old card leaves
   as a ghost and the new one rises; on a redraw of the same step, an answer
   on the mirror, it is swapped where it stands, because a person who pressed
   Yes has not gone anywhere. o.s is the step, o.shown the step on screen (-1
   for none, which is the arrival), o.attr the attribute the poses read, o.rail
   the rail's own writer and o.lit, when given, the seats to light. */
function obSwap(h,out,o){
 var slot=h.querySelector('.obx-slot'), old=slot.querySelector('.ob-card');
 var s=o.s, moved=o.shown!==s, arrive=o.shown<0, dir=(s<o.shown)?-1:1;
 var from=(moved&&!arrive)?obPoseRead(h):null;
 if(moved&&!arrive)obGhost(h,old,dir);
 h.setAttribute('data-dir',dir<0?'back':'fwd');
 h.setAttribute(o.attr||'data-step',String(s));
 h.classList.toggle('obx-in-arrive',arrive);
 slot.innerHTML=out;
 var card=slot.querySelector('.ob-card');
 if(moved&&card&&!obCalm()){ card.classList.add('obx-enter'); obStagger(card); }
 if(o.rail)o.rail(h);
 /* the seat lights land after the body has: 420ms into a move, at once on a
    redraw where the body has not moved */
 obFigSync(h,moved?(arrive?1300:420):0,o.lit||null);
 if(from)obPosePlay(h,from,dir);
 /* the step reads on the body: one pulse up the spine forward, down it on
    Back. Restarted rather than queued, so a fast run of presses shows the
    latest direction and never a backlog. */
 var sg=h.querySelector('.obx-surge');
 if(sg&&moved&&!arrive&&!obCalm()){ sg.classList.remove('go'); void sg.offsetWidth; sg.classList.add('go'); }
 return {moved:moved, arrive:arrive, card:card};}

function obRender(){
 var h=document.getElementById('ob'); if(!h)return;
 var s=OB.step, out='';
 if(s===0){
  /* ARRIVE. His two rulings, kept exactly: the figure and eleven words
     first, show not tell, and then the warmth he named, "hey, this is you,
     and it is okay. No judgment." The mockup's own first card, "Welcome to
     a neurosomatic experience," is his line too (NOTES.md item 1) and sits
     here as the eyebrow rather than a second sentence, so the card still
     opens on the figure and not on a claim. */
  /* THE HERO IS THE REAL BODY, round QG. It was a vertical line with seven
     coloured dots on it, which at 168 pixels reads as a dotted rule and is
     the rainbow column the brief rules out drawn small. This is the Body
     page's own silhouette with the seats where PMBANDS puts them, named down
     its left the way the release sheets name them. The storyboard's stock
     mountain lake and its glowing ring are not replaced by another picture,
     they are replaced by the one drawing this product already owns. */
  /* ROUND QH: the body is the stage's now, the one figure every step moves,
     so the card carries the words and the figure stands beside them at a
     size a card could never give it. */
  out=obCard('Arrive','This is you, and it is okay.',
   '<p class="ob-p">No judgment. Nothing here grades you. This one is for you.</p>'
   +'<p class="ob-p ob-dim">A few minutes. One real thing to write. Nothing to fill in.</p>'
   /* THE PRIVACY LINE IS A FACT ABOUT THE BUILD AND NOT A PROMISE. One file,
      no network: the storyboard's three fragments say it three times, so it
      is said once, as the thing that is actually true. */
   +'<p class="ob-p ob-foot">Nothing you write leaves this device.</p>',
   '<button type="button" class="btn pri" data-ob="next">Come in</button>'
   +'<button type="button" class="btn" data-ob="skip">Not now</button>');
 }
 else if(s===1){
  /* ASK. Picking is the advance in the mockup; kept here, with a Back for
     a person who taps the wrong one, which the mockup did not need because
     its chips fly back into the ring and this sheet's do not. */
  /* THE INTAKE INVITATION, round RI. His own words: "we want to invite the
     person. As they tour, one of the first things they do is stop at
     intake. And fill that in as much as possible. It's self-identified, and
     then the weights adjust it dynamically." The weighting is already real
     and needs nothing added, iqApply already folds every answered law into
     p.laws and S.law the moment it exists (engine/intake.js); what was
     missing is purely this invitation. It sits on Ask and not on Welcome
     above, because Ask is already the one card in this tour about saying who
     you are, and a second paragraph on Welcome would crowd a card every
     comment above it treats as finished. Pressing it ends the tour the same
     way Skip does (CURP.ui.onboarded is set either way) and opens the real
     page, named here the way the tab itself names it, Avatar, so the word
     a person reads here is the word they land on. Nothing about this gates
     anything: a person who answers three laws and leaves has a real partial
     reading, not a failed one, the same rule Verification on the funnel
     holds for "Nothing changed." */
  out=obCard('Ask','What brought you here?',
   '<p class="ob-p ob-dim">Pick the one that is closest. Nothing is locked in.</p>'
   +obChips(OB_STARTS,'obpick',OB.pick,false)
   +'<p class="ob-p ob-dim ob-foot">There is also a longer self-check, in the Avatar tab. '
   +'It asks how you actually act, not how you want to act. Answer what you want, in any order, '
   +'and stop anytime: a few answered is still a real reading, not a failed one.</p>',
   '<button type="button" class="btn" data-ob="intake">Open Avatar</button>'
   +'<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else if(s===2){
  /* SETTLE. His two lines, kept exactly as the mockup carries them
     (NOTES.md item 1): the awareness line, which answers what this sheet
     is asking the senses to do, and the instruction that follows it. */
  /* THE LOOP GOES HERE, round QG. The storyboard's second panel is "a 30
     second look at how Atuned works", four cards in a row with arrows between
     them. Four in a row with arrows is the one shape CLAUDE.md rules out by
     name: "a numbered column of four says the fourth one is the end, which is
     the opposite of a loop. Anywhere the four appear together they close." So
     the four are drawn on a closed ring, in the section bar's own marks, and
     they sit on this card because Settle is where the flow already pauses and
     was two sentences and nothing else. No step was added: the dots still
     read eight and every index below is where it was. */
  out=obCard('Settle','Do not solve it yet.',
   '<p class="ob-p">Awareness and intuition is a tool we use to turn your senses inward.</p>'
   +'<p class="ob-p">Notice what is here.</p>'
   +'<div class="ob-loopw">'+obLoopRing()+obLoopRows()+'</div>'
   +'<p class="ob-p ob-dim">Four parts, and the fourth goes back to the first. '
   +'You are about to walk one turn of it.</p>',
   '<button type="button" class="btn pri" data-ob="next">Continue</button>'
   +'<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else if(s===3){
  out=obCard('Feel','What are you feeling?',
   '<p class="ob-p ob-dim">Take a second.</p>'
   +obChips(OB_FEELS,'obfeel',OB.feel,true),
   '<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else if(s===4){
  /* THE BODY IS ON THE SCREEN NOW, round QG, and that is a defect fixed and
     not a decoration added. The card said "Tap the place on the body" over
     seven grey word chips and no body, so the instruction named a thing that
     was not there. The figure is the real one, the chips are the control for
     the reason the stage's header states (15 pixels between seats at 390),
     and each chip carries its seat's own mark.

     WHAT THE DRAWING SAYS NOW, round QH. Round QG kept a promise out of the
     copy here because the lit seat was on screen for one frame: a press is
     the advance, and the card that held the figure was replaced by the
     Story. The figure is the stage's now and is not replaced, so the seat a
     person presses ignites and stays lit through the Story step. The copy
     still promises nothing; the light is simply no longer thrown away. */
  var pb=(OB.place!=null&&OB.place>=0)?OB_PLACES[OB.place]:null;
  out=obCard('Body','Where do you notice it?',
   '<p class="ob-p ob-dim">Pick the place that is closest to it.</p>'
   /* the figure is the stage's, beside this column on a wide screen and over
      it on a narrow one; a chip held under a pointer lights its seat there
      before it is pressed, and the press keeps it lit into the Story */
   /* THE MEANING ONCE, round PO. The first cut led with "Seven seats, from the
      base of the spine to the top of the head" and then printed the table's
      sentence, which says the same thing in the same words: one fact, twice,
      on the card where the word seat is first used. The table's sentence is
      the one that ships, because it is the one every other surface prints. */
   +'<p class="ob-p ob-dim ob-figsay">'+esc(unpackOf('seat'))+'</p>'
   +obChips(OB_PLACES,'obplace',OB.place,true)
   +(pb?'<p class="ob-p ob-dim ob-seatsay">'+esc(pb.n)+', at your <b>'+esc(pb.b)+'</b> seat. '
     +esc(obSeatMean(pb.b))+'</p>':''),
   '<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else if(s===5){
  /* STORY. THE ONE REAL THING. This is the exact line J0 names in the
     header above: a stranger's first typed words are about to be read by
     parseStory with no distress check of any kind standing in front of it.
     Anybody building that check wires it here, ahead of obStoryDone, and
     nowhere else, because this is the only place in this sheet a stranger's
     own words exist before the engine reads them. */
  out=obCard('Story','What was happening?',
   '<p class="ob-p ob-dim">A sentence or two is enough. Your own words.</p>'
   +'<div class="ob-f"><textarea id="obtext" rows="4" placeholder="What happened, and what it was like."></textarea></div>'
   /* the same stars line the Journal carries, round QR: a keyboard's own
      dictation types straight into this box and filters the same way */
   +'<p class="st-mask" id="obmask" role="note" hidden></p>',
   '<button type="button" class="btn pri" id="obdone" data-ob="storydone" disabled>Done</button>'
   +'<button type="button" class="btn" data-ob="storyskip">I would rather not say</button>'
   +'<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else if(s===6){
  out=obMirrorCard();
 }
 else {
  out=obBridgeCard();
 }
 /* ROUND QH, the change of step, which obSwap above now carries */
 obStage(h);
 var sw=obSwap(h,out,{s:s, shown:OB.shown, attr:'data-step', rail:obRail});
 var moved=sw.moved, arrive=sw.arrive, card=sw.card;
 OB.shown=s;
 var ta=document.getElementById('obtext');
 var obMask=function(){var m=document.getElementById('obmask'); if(!m||!ta)return;
  var runs=maskedRuns(ta.value); m.hidden=!runs.length; m.textContent=maskedSay(runs);};
 if(ta){ta.value=OB.text; ta.oninput=function(){
   var go=document.getElementById('obdone'); if(go)go.disabled=(ta.value.trim().split(/\s+/).filter(Boolean).length<3);
   obMask();};
  obMask(); ta.focus({preventScroll:true});}
 else if(moved&&!arrive){ var hd=card&&card.querySelector('.ob-h'); if(hd)hd.focus({preventScroll:true}); }
 var ci=document.getElementById('obcorr');
 if(ci){ci.oninput=function(){OB.corr=ci.value;};}
 var f=card&&card.querySelector('.ob-scroll'); if(f&&moved)f.scrollTop=0;}

/* ============================================================
   THE MIRROR. Built only from what the person gave: the pick, the feel and
   body taps exactly as tapped (never dressed up as an engine reading), the
   person's own words quoted, and what the engine read in them.

   F4, round QA, from the funnel review's third pass (REVIEW-funnel/
   FINAL-SPEC.md, row F4, and the walks in its section 3). Two defects were
   measured here and both are fixed below.

   ONE, A GUESS WAS PRINTED AS A QUOTE. This card read stCommit's kept array,
   which is a list of addresses with the engine's own inferred flag already
   thrown away, and printed the first as "at your Solar, around the word
   Pride". Pride is the address's name, not a word anybody typed. Measured:
   "I snapped at my co-founder in front of the team and I cannot stop
   replaying it" reads twelve addresses, all twelve inferred and none stated,
   and the card said "around the word Pride" to a person who never said it.
   "My mother died last spring" reads four, all inferred, and the second line
   handed a bereaved person "Martyrdom" as if it had been found. parseStory
   has always said which is which (sniff.js, "DID THE TEXT NAME THIS, OR DID
   WE INFER IT?", and its own instruction: "A renderer must not print name as
   a finding when this is true"). So the card now reads the parse, not the
   commit, groups it by seat, leads every group with the seat and the
   person's own words that put weight there, and marks every address as
   either "your words" or "a guess", with the guess said as the engine's
   guess from that seat.

   TWO, A NO COULD NOT LAND. The commit ran on Done, before this card was
   ever shown, so the charge was already in the field when "Not quite" was
   offered, and "That is me" confirmed every address at once. The commit now
   runs here, on Commit, through the same stCommit the Story tab calls. And
   every address has its own Yes and Not me: only a yes goes into the
   release, and every yes and every no is written onto the entry, ob.yes and
   ob.no, for the decline record (F11) to read when it exists.

   WHAT A NO DOES NOT DO YET, said here so nobody reads more into it. The
   charge stCommit writes is per feeling, through applyStory, which reads the
   whole text and is arithmetic core that keeps its body on the standing
   ruling. So a no keeps that address out of the release and on the record
   as a no, and the weight the words put on that seat still lands. The card
   says exactly that and no more. Filtering the charge itself by the answers
   is F16's, and it needs an engine change the owner has not ruled on.
   ============================================================ */
/* a seat's plain meaning, the one table round PO says every meaning lives in */
function obSeatMean(b){ return (typeof unpackOf==='function')?unpackOf(b,'seat'):''; }
/* what an address means, off the node's own two fields, in the words the
   Practitioner page already uses for them ("Concerns ... Shows up as ..."),
   so a name never stands alone: Separation. It concerns unity and shows up
   as isolation. One wording for one concept, across both surfaces. */
function obLow(x){ x=String(x||'').trim(); return x?x.charAt(0).toLowerCase()+x.slice(1):''; }
function obAbout(n){
 var a=obLow(n&&n.a), d=obLow(n&&n.d);
 if(!a&&!d)return '';
 return ' It concerns '+esc(a||'this place')+(d?' and shows up as '+esc(d):'')+'.';}
/* THE READ, from a parse that has not been committed. One group per seat the
   words put weight on, in the order the words did it, stated groups first.
   A group is stated when parseStory says the words named its feeling
   (inferred false), and only then. words are the person's own letters the
   scanner scored at that seat, never a word list of this file's own.
   seen drops an address already shown above, so one address has one row and
   one answer wherever it was read. */
function obReadOf(p,src,seen){
 var groups=[], by={};
 if(!p||!p.imprints)return groups;
 p.imprints.forEach(function(im){
  var n=BY[im.node]; if(!n||!n.cf)return;
  if(seen[n.i])return; seen[n.i]=1;
  var g=by[im.from];
  if(!g){ g=by[im.from]={id:src+':'+im.from, from:im.from, seat:im.band, stated:false,
    fetter:im.fetter, words:[], rows:[]}; groups.push(g); }
  if(!im.inferred){ g.stated=true; g.fetter=im.fetter; }
  /* imStated is parseStory's own stated flag, carried so the first
     release's plan (F5, obYesSignal) can keep the engine's order, stated
     before named before inferred, without a second parse. */
  g.rows.push({n:n, fetter:im.fetter, imStated:!!im.stated});});
 groups.forEach(function(g){
  (p.hits||[]).forEach(function(h){
   if(h.band!==g.from||!h.t)return;
   var w=String(h.t).trim(); if(w&&g.words.indexOf(w)<0)g.words.push(w);});
  /* a row is stated only inside a stated group. Said per row so the release
     can carry it without reading the group again. */
  g.rows.forEach(function(r){r.stated=g.stated;});});
 return groups.filter(function(g){return g.stated;})
  .concat(groups.filter(function(g){return !g.stated;}));}
/* every address on the card, in the order shown, the story's then each
   correction's. The release reads this and nothing else. */
function obAllRows(){
 var out=[];
 (OB.read||[]).forEach(function(g){g.rows.forEach(function(r){out.push(r);});});
 OB.fixReads.forEach(function(f){f.groups.forEach(function(g){g.rows.forEach(function(r){out.push(r);});});});
 return out;}
function obYes(){ return obAllRows().filter(function(r){return OB.ans[r.n.i]==='yes';}).map(function(r){return r.n;}); }
function obNo(){ return obAllRows().filter(function(r){return OB.ans[r.n.i]==='no';}).map(function(r){return r.n;}); }
function obQuoteList(ws){
 var q=ws.map(function(w){return '&ldquo;'+esc(w)+'&rdquo;';});
 return q.length>1?q.slice(0,-1).join(', ')+' and '+q[q.length-1]:(q[0]||'');}
/* ONE ADDRESS, ONE ROW, ONE ANSWER. The label never changes with the answer;
   the pressed button and the line under it carry the state. */
function obRow(r,seat){
 var n=r.n, a=OB.ans[n.i]||'';
 var said=r.stated
  ?'<span class="ob-tag ob-tag-said">you named '+esc(obLow(r.fetter))+'</span> <b>'+esc(n.k)+'</b>. '
   /* A STATED FEELING THIS SEAT HAS NO ADDRESS FOR, sniff.js round GR:
      exhaustion names apathy and the Solar seat has none, so parseStory
      holds the weight at the seat's first address. Said as that, never as
      "one place apathy sits", which would be false. */
   +(n.cf===r.fetter?'One place '+esc(obLow(r.fetter))+' sits at your '+esc(seat)+' seat.'
    :'Your '+esc(seat)+' seat has no place for '+esc(obLow(r.fetter))+', so the engine holds it here.')
   +obAbout(n)
  :'<span class="ob-tag">a guess</span> <b>'+esc(n.k)+'</b>. The engine&rsquo;s guess, from your '
   +esc(seat)+' seat.'+obAbout(n);
 return '<div class="ob-row" data-obrow="'+n.i+'">'
  +'<p class="ob-p ob-rowp">'+said+'</p>'
  +'<div class="ob-as" role="group" aria-label="'+esc(n.k)+'">'
  +'<button type="button" class="ob-a'+(a==='yes'?' on':'')+'" aria-pressed="'+(a==='yes')+'" data-obans="yes" data-obi="'+n.i+'">Yes</button>'
  +'<button type="button" class="ob-a'+(a==='no'?' on':'')+'" aria-pressed="'+(a==='no')+'" data-obans="no" data-obi="'+n.i+'">Not me</button>'
  +'</div>'
  +(a==='yes'?'<p class="ob-p ob-dim ob-rowst">In your release.</p>'
   :a==='no'?'<p class="ob-p ob-dim ob-rowst">Kept out of your release, and kept on your record as a no.</p>':'')
  +'</div>';}
/* ONE SEAT. Led by the seat and the person's own words, never by an address
   name, because an address name alone presumes a precision the engine only
   has when the words named the feeling. The first address shows; the rest
   at the seat sit behind a button that says how many, never hidden with no
   affordance. */
/* HOW MUCH OF A SEAT HAS BEEN ANSWERED YES, as a share of the addresses this
   card has actually shown at it. It is the one real quantity a seat carries on
   this card, so it is the one thing the seat mark's arc is allowed to draw.
   Nothing answered draws no arc, which is the chip's own rule. */
function obGrpShare(g){
 var shown=g.rows.filter(function(r,i){return i===0||OB.more[g.id];});
 if(!shown.length)return null;
 var yes=shown.filter(function(r){return OB.ans[r.n.i]==='yes';}).length;
 return yes/shown.length;}
function obGroup(g){
 var col=(typeof seatCol==='function')?seatCol(g.seat):'';
 var mean=obSeatMean(g.seat);
 /* THE SEAT ARRIVES AS A MARK AND NOT AS A TWO PIXEL RULE. It was a coloured
    left border and a bold word, which on a card of nine paragraphs gives the
    eye nothing to land on and makes the seat colour the thinnest thing in the
    product carrying it. The mark is the house chip, obSeatMark, so a seat
    reads the same here as on the Avatar's archetype rows and the Summary
    rings. The heading stays the first <p> inside .ob-grp, which is where the
    gate reads the lead off. */
 var o='<div class="ob-grp" data-obgrp="'+esc(g.id)+'" style="--c:'+col+'">'
  +'<div class="ob-grph-r">'+obSeatMark(g.seat,obGrpShare(g),'ob-mk-g')
  +'<p class="ob-p ob-grph">At your <b>'+esc(g.seat)+'</b> seat.'
  +(mean?' <span class="ob-dim">'+esc(mean)+'</span>':'')+'</p></div>';
 var ws=g.words.length?obQuoteList(g.words):'';
 if(g.stated)
  o+='<p class="ob-p">'+(ws?(g.words.length>1?'Your words ':'Your word ')+ws:'Your words')
   +' named <b>'+esc(obLow(g.fetter))+'</b>. The engine picks the place at this seat.</p>';
 else
  o+='<p class="ob-p">'+(ws?(g.words.length>1?'Your words ':'Your word ')+ws+' put weight here.'
    :'Something in your words put weight here.')
   +(g.words.length>1?' They':' It')+' did not name a feeling, so what follows is a guess.</p>';
 var open=!!OB.more[g.id], show=open?g.rows:g.rows.slice(0,1);
 show.forEach(function(r){o+=obRow(r,g.seat);});
 var rest=g.rows.length-show.length;
 if(rest>0)
  o+='<button type="button" class="ob-a ob-more" data-obmore="'+esc(g.id)+'">'
   +rest+(g.stated?(rest===1?' more place':' more places'):(rest===1?' more guess':' more guesses'))
   +' at this seat</button>';
 return o+'</div>';}
function obQuote(t){
 var s=String(t||'').replace(/\s+/g,' ').trim(), m=s.match(/^[^.!?]+/), q=(m?m[0]:s).trim();
 var w=q.split(' '); if(w.length>16)q=w.slice(0,16).join(' ')+'...';
 return q;}
/* the seat a tapped place sits at, so the card can say when the tap and the
   words disagree instead of leaving two answers side by side unreconciled. */
function obSameSeat(a,b){ return String(a||'').toLowerCase()===String(b||'').toLowerCase(); }
function obMirrorCard(){
 var pk=OB.pick!=null&&OB.pick>=0?OB_STARTS[OB.pick]:null;
 var fe=OB.feel!=null&&OB.feel>=0?OB_FEELS[OB.feel]:null;
 var pl=OB.place!=null&&OB.place>=0?OB_PLACES[OB.place]:null;
 var groups=OB.read||[];
 var lines='';
 lines+='<p class="ob-p">'+(pk&&pk.k!=='other'?'You came in with <b>'+esc(pk.n.toLowerCase())+'</b>.'
   :'You did not pick a starting point.')+'</p>';
 if(fe||pl){
  var a=fe?'It feels <b>'+esc(fe.n.toLowerCase())+'</b>':'You did not say how it feels';
  var b=pl?', and you notice it in your <b>'+esc(pl.n.toLowerCase())+'</b>.':'.';
  lines+='<p class="ob-p">'+a+b+'</p>';
 } else lines+='<p class="ob-p">You did not say how it feels or where.</p>';
 lines+='<p class="ob-p">'+(OB.text?'You said: <b>&ldquo;'+esc(obQuote(OB.text))+'&rdquo;</b>'
   :'You did not say what happened.')+'</p>';
 if(groups.length){
  /* WHERE IT LIVES, AS THE FIGURE AND NOT AS A SENTENCE ALONE. The storyboard's
     fourth panel draws a body with a glow at the heart under the words "Where
     it lives: Heart". The body it draws is a glossy figure that is not this
     product's; this is the real silhouette with the seats the words actually
     lit standing out on it, read off the groups below and never a second
     reading of its own. */
  var seats=[]; groups.forEach(function(g){if(seats.indexOf(g.seat)<0)seats.push(g.seat);});
  lines+='<div class="ob-mirrorfig">'
   +'<p class="ob-p ob-dim ob-figsay">Lit on the body where your words put weight: '
   +seats.map(function(b){return '<b>'+esc(b)+'</b>';}).join(seats.length===2?' and ':', ')
   +(seats.length===1?' seat.':' seats.')+'</p></div>'
   +'<p class="ob-p">This separates into its own components, one seat at a time. '
   +'<span class="ob-dim">'+esc(unpackOf('seat'))+' '+esc(unpackOf('address'))+'</span></p>'
   +'<p class="ob-p ob-dim">Say Yes to each one that fits you. Only a yes goes into your release. '
   +'The ring beside each seat fills as you answer yes at it.</p>';
  if(pl&&!groups.some(function(g){return obSameSeat(g.seat,pl.b);}))
   lines+='<p class="ob-p ob-dim">You tapped your '+esc(pl.n.toLowerCase())+', at your '+esc(pl.b)
    +' seat. Your words put weight at other seats, shown below. Both are kept as they are.</p>';
  groups.forEach(function(g){lines+=obGroup(g);});
 }
 else if(OB.text)
  lines+='<p class="ob-p ob-dim">Nothing in that one lit anything the engine could name. '
   +'That happens, and it is not a problem with what you wrote.</p>';
 OB.fixReads.forEach(function(f){
  lines+='<p class="ob-p">You added: <b>&ldquo;'+esc(f.t)+'&rdquo;</b></p>';
  if(f.groups.length)f.groups.forEach(function(g){lines+=obGroup(g);});
  else if(f.any)lines+='<p class="ob-p ob-dim">That reads at places already shown above.</p>';
  else lines+='<p class="ob-p ob-dim">Nothing in that one lit anything the engine could name.</p>';});
 var body=lines
  +'<div class="ob-acts" style="margin-top:4px"><button type="button" class="btn" data-ob="mirrorno">Correct it</button></div>'
  +'<div class="ob-f" id="obcorrwrap" hidden><label for="obcorr">Tell me what is off, in your own words.</label>'
  +'<textarea id="obcorr" rows="2"></textarea>'
  +'<div class="ob-acts" style="margin-top:8px"><button type="button" class="btn pri" data-ob="mirroradjust">Read my correction</button></div></div>'
  +(OB.text?'<p class="ob-p ob-dim" style="margin-top:14px">Commit keeps your words and the weight they put on each seat. '
   +'Nothing is kept until you press it.</p>':'');
 return obCard('Mirror',OB.fixReads.length?'Here is what I heard now.':'Here is what I heard.',
  body,'<button type="button" class="btn pri" data-ob="mirrorcommit">'+(OB.text?'Commit':'Continue')+'</button>'
  +'<button type="button" class="btn" data-ob="back">Back</button>');}

/* ---- correct: a correction is read for real, through parseStory, and adds
   what it read to this card as rows of their own, each with its own Yes and
   Not me, so a correction lands somewhere a person can see. It writes no
   charge: the entry's text is the story, and the correction is kept on the
   entry beside it, ob.fixes, when Commit runs. ---- */
function obAdjust(){
 var ta=document.getElementById('obcorr'); if(!ta)return;
 var v=ta.value.trim(); if(!v)return;
 OB.fixes.push(v);
 var p=null; try{ p=parseStory(v); }catch(e){}
 var seen={}; obAllRows().forEach(function(r){seen[r.n.i]=1;});
 var groups=obReadOf(p,'f'+OB.fixReads.length,seen);
 OB.fixReads.push({t:v, groups:groups, any:!!(p&&p.imprints&&p.imprints.length)});
 ta.value=''; OB.corr='';
 obRender();}

/* ============================================================
   THE BRIDGE. The hand off this round names by name: never a second
   release engine, the one ui/release.js already carries, through relPick,
   the same one every other door in the product uses (avatarui.js,
   drills.js, imprints.js, map.js, personas.js, ritual.js, storyui.js,
   summary.js). The node ids it hands over come from what the mirror just
   read, never a guess built from a pick or a feeling word: those are taps
   and this is the engine's own read. Since F5 they are the first release's
   plan out of that read, at most three, and not all of it.
   ============================================================ */
/* ============================================================
   THE FIRST RELEASE'S SIZE, F5, ruled round PA: "The mini release is 12
   lines." This bridge handed relPick every address the story read, eight or
   twelve of them, and the card printed the count of addresses as a count of
   lines: "8 lines" over a run that was 25 (RUN_MAX cut the eighth address off
   and the seventh to one line). Measured on the shipped build, 2 October,
   with the gate's own sentence.

   Now the bridge goes through onbMiniPlan (engine/journey.js), which takes at
   most three whole addresses, stated before named before inferred, inside the
   allowance, and writes nothing. The ids handed to relPick are the plan's, so
   relPlan builds the same twelve keys the card counted (tests/onboarding2.js
   holds the two equal), and every number on the card is read off the plan.

   The Day One tutorial is the other door into the same first release and
   calls the same two functions, so there is one size and one sentence.
   ============================================================ */
/* THE SIGNAL IS A LIST, and the caller says which list. The Day One tutorial
   has no per address answer, so it passes parseStory's imprints. This sheet
   passes its yes rows (F4): only an address the person said yes to can be
   planned, so a no or an unanswered guess never reaches relPick. */
function obMini(list){
 if(typeof onbMiniPlan!=='function'||typeof CURP==='undefined'||!CURP)return {ok:false, why:'no record'};
 var ims=Array.isArray(list)?list:[];
 return onbMiniPlan(CURP,{unread:!ims.length, imprints:ims});}
/* parseStory's imprints, or none, for a door that kept the parse */
function obImprints(parsed){ return (parsed&&Array.isArray(parsed.imprints))?parsed.imprints:[]; }
/* THE YES ROWS, IN THE SHAPE onbMiniPlan READS: node, stated, inferred, as
   parseStory's imprints carry them. inferred is the row's own "a guess" tag
   on the mirror, so the plan's count of guesses is the card's. In the order
   the mirror showed them, the story's then each correction's. */
function obYesSignal(){
 return obAllRows().filter(function(r){return OB.ans[r.n.i]==='yes';})
  .map(function(r){return {node:r.n.i, stated:!!(r.stated&&r.imStated), inferred:!r.stated};});}
/* WHAT THE CARD SAYS ABOUT THE PLAN. Every number is the plan's. "Address" is
   the product's word and he ruled it means nothing to a person (SX1), so the
   card says place, which is what the mirror above already says. A line is
   unpacked where it is first used (round PO). The count of places the words
   did not name is said, never hidden: those are the engine's guess from where
   the feeling sits, and a person is owed the difference. */
function obMiniSay(pl,first,yes){
 if(!pl||!pl.ok)return '';
 var n=pl.addrs.length, rel=first?'Your first release':'This release';
 var places=function(k){return k+(k===1?' place':' places');};
 var seats=[]; pl.addrs.forEach(function(i){var b=BY[i]&&BY[i].b; if(b&&seats.indexOf(b)<0)seats.push(b);});
 var at=seats.length?(n===1?'It sits':(seats.length===1?'All '+n+' sit':'They sit'))+' at your '
  +seats.map(function(b){return '<b>'+esc(b)+'</b>';}).join(seats.length===2?' and ':', ')
  +(seats.length===1?' seat.':' seats.'):'';
 var out='';
 if(pl.rest>0){
  var nm=pl.found-pl.foundInferred;
  /* this sheet plans from the yes rows only, so its count is the yes count
     and never the story's: a place the person said no to is not owed a wait */
  out+='<p class="ob-p">'+(yes?'You said yes to '+places(pl.found)+'. ':'Your story touched '+places(pl.found)+' in your body. ')
   +(pl.foundInferred===0?'Your words point to all '+pl.found+'.'
    :(nm===0?'All '+pl.found+' come from where the feeling sits. Your words did not name them.'
     :'Your words point to '+nm+'. The other '+pl.foundInferred+' come from where the feeling sits.'))+'</p>'
   +'<p class="ob-p">'+rel+' takes '+n+(nm>0&&pl.foundInferred>0?', the ones your words point to first':'')
   +'. '+(pl.rest===1?'The other one waits':'The other '+pl.rest+' wait')+' for your next release.</p>';
 } else if(pl.inferred>0){
  out+='<p class="ob-p">'+(pl.inferred===n?(n===1?'This place comes':'All '+n+' come')
    :pl.inferred+' places of the '+n+' come')+' from where the feeling sits. Your words did not name '
   +(pl.inferred===1?'it':'them')+'.</p>';
 }
 out+='<p class="ob-p">'+(pl.rest>0?'That is ':rel+' is ')+pl.lines+' lines, '
  +(n===1?'all at one place':(pl.lines/n)+' at each of '+places(n))+'. '+at+'</p>'
  +'<p class="ob-p ob-dim">A line is one short sentence you follow in thought.</p>';
 return out;}
/* WHY THERE IS NO RELEASE TO BEGIN, when the story read and the plan is still
   refused. Said once, plainly; the route is the button beside it. */
function obMiniWhy(pl,yes){
 if(pl&&pl.why==='allowance')
  return 'There are no patterns left in your allowance right now, so no new release can begin from this story. '
   +'A pattern is one line you have not said before.';
 if(pl&&pl.why==='no new ground')
  return 'Every place '+(yes?'you said yes to':'this story touched')+' is already fully opened, so there is nothing new to release from it.';
 return '';}
/* THE PLAN AS MARKS, round QG. The card said what the release takes in three
   paragraphs and drew nothing, on the one screen where a person is deciding
   whether to start. One mark per seat the plan reaches, in the house chip
   grammar, with the lines that seat carries under it. The arc is that seat's
   share of the run's lines, which is a real quantity off the plan and is said
   in words beside it: a count of places with no arc would be a figure with no
   picture, and an arc with no count would be a picture of nothing. */
function obPlanMarks(pl){
 if(!pl||!pl.ok||!pl.addrs||!pl.addrs.length)return '';
 var per=pl.lines/pl.addrs.length, by=[], ix={};
 pl.addrs.forEach(function(i){
  var b=BY[i]&&BY[i].b; if(!b)return;
  if(ix[b]==null){ix[b]=by.length; by.push({b:b,n:0});}
  by[ix[b]].n++;});
 if(!by.length)return '';
 return '<div class="ob-plan">'+by.map(function(x){
   var ln=Math.round(x.n*per);
   return '<div class="ob-plan-i">'+obSeatMark(x.b,pl.lines?ln/pl.lines:null,'ob-mk-p')
    +'<b class="ob-plan-n">'+esc(x.b)+'</b>'
    +'<span class="ob-plan-v">'+ln+(ln===1?' line':' lines')+'</span></div>';}).join('')
  +'</div>';}
function obBridgeCard(){
 var c=OB.commit, yes=(c&&c.ok)?obYesSignal():[];
 /* the plan reads the yes rows, F4's answers, never the raw story read */
 var pl=OB.plan=(c&&c.ok&&c.k&&yes.length)?obMini(yes):null;
 if(pl&&pl.ok){
  var first=(typeof journeyRead==='function')?journeyRead(CURP).first:true;
  return obCard('Next',first?'Next is your first release.':'Next is a release.',
   obPlanMarks(pl)
   +obMiniSay(pl,first,true)
   /* SILENCE IS STATED, round QG. The storyboard's fifth panel is a blue to
      pink gradient ring the width of the screen with the word Release inside
      it, a timer, and "Breathe with the field". None of that is drawn here and
      no second release is drawn here either: the handoff is relPick and
      ui/release.js owns every pixel of the run. What this card owes a person
      is the one thing that panel does not say, which is that the run is
      silent and they set its pace. tests/design.js already holds the release
      to it: "the release runs to its end in silence." */
   +'<p class="ob-p">The lines are read in silence. Nothing speaks and nothing counts down. '
   +'You set the pace and how many times each line repeats, and you can stop at any line.</p>',
   '<button type="button" class="btn pri" data-ob="release">Begin the release</button>'
   +'<button type="button" class="btn" data-ob="done">Not now</button>');
 }
 if(obMiniWhy(pl,true))
  return obCard('Next','Nothing new to release yet.',
   '<p class="ob-p">'+obMiniWhy(pl,true)+'</p>',
   '<button type="button" class="btn pri" data-ob="done">Go in</button>');
 /* HONEST EMPTY, the same rule the signal test and the tutorial already
    keep: nothing to release is a real answer, not a failure to paper over. */
 return obCard('Next','Nothing to release yet.',
  (c&&c.ok&&c.k
   ?'<p class="ob-p">You did not say yes to any place, so nothing from this story goes into a release. '
    +'Your words are kept. You can always write another in the Story tab.</p>'
   :'<p class="ob-p">This entry did not carry enough charge to name a release yet. '
    +'That is fine. You can always write another in the Story tab.</p>'),
  '<button type="button" class="btn pri" data-ob="done">Go in</button>');}
/* the bridge's empty body, split by why it is empty: nothing read, or read
   and nothing said yes to. Same title slot, the value carries the state. */

/* ---- one listener for the whole sheet ---- */
addEventListener('click',function(e){
 if(!OB.open)return;
 var t=e.target&&e.target.closest?e.target:null; if(!t)return;
 var pk=t.closest?t.closest('[data-obpick]'):null;
 if(pk){ OB.pick=+pk.getAttribute('data-obpick'); OB.step=2; obRender(); return; }
 var fe=t.closest?t.closest('[data-obfeel]'):null;
 if(fe){ OB.feel=+fe.getAttribute('data-obfeel'); OB.step=4; obRender(); return; }
 var pl=t.closest?t.closest('[data-obplace]'):null;
 if(pl){ OB.place=+pl.getAttribute('data-obplace'); OB.step=5; obRender(); return; }
 var an=t.closest?t.closest('[data-obans]'):null;
 if(an){ var ni=+an.getAttribute('data-obi'), v=an.getAttribute('data-obans');
  /* a second press on the pressed answer takes it back to unanswered */
  if(OB.ans[ni]===v)delete OB.ans[ni]; else OB.ans[ni]=v;
  obRenderKeep(an); return; }
 var mo=t.closest?t.closest('[data-obmore]'):null;
 if(mo){ OB.more[mo.getAttribute('data-obmore')]=true; obRenderKeep(mo); return; }
 var b=t.closest?t.closest('[data-ob]'):null; if(!b)return;
 var k=b.getAttribute('data-ob');
 if(k==='next'){ OB.step++; obRender(); return; }
 if(k==='back'){ OB.step=Math.max(0,OB.step-1); obRender(); return; }
 if(k==='storydone'){ obStoryDone(); return; }
 if(k==='storyskip'){
  /* a story read on an earlier Done and then withdrawn is not left pending */
  if(OB.read&&typeof ST_TEXT==='string'&&ST_TEXT===OB.text){ ST_TEXT=''; ST_PARSED=null; }
  OB.text=''; OB.read=null; OB.fixReads=[]; OB.fixes=[]; OB.ans={}; OB.plan=null;
  OB.commit={ok:false,why:'skip'}; OB.step=6; obRender(); return; }
 if(k==='intake'){
  /* closes the same way skip/done do, including the onboarded flag, and
     then moves the running app to the real page: setTab is panels.js's own
     and TAB.INTAKE is core.js's own, both load ahead of this file per
     MANIFEST, so neither is a second definition of either. */
  obClose(); if(typeof setTab==='function')setTab(TAB.INTAKE); return; }
 if(k==='mirrorno'){ var w=document.getElementById('obcorrwrap'); if(w)w.hidden=false;
  var ci=document.getElementById('obcorr'); if(ci)ci.focus(); return; }
 if(k==='mirroradjust'){ obAdjust(); return; }
 if(k==='mirrorcommit'){ obCommit(); return; }
 if(k==='release'){
  /* the plan's addresses, out of the yes rows only: never every address
     the story read (F5), and never one the person did not say yes to (F4) */
  var pl=OB.plan||obMini(obYesSignal()), ids=(pl&&pl.ok)?pl.addrs:[];
  obClose();
  /* and the entry the mirror committed, so the answer to What changed after
     this release names the story it came from */
  if(ids.length&&typeof relPick==='function')
   relPick(ids,(OB.commit&&OB.commit.ok&&OB.commit.t)?{story_t:OB.commit.t}:null);
  return;}
 if(k==='skip'||k==='done'){ obClose(); return; }});
/* THE PREVIEW, round QH. On the Body step a chip under the pointer, or under
   keyboard focus, lights its own seat on the figure before it is pressed: the
   secondary action under the main one, so the word and the place are seen
   together and the press reads as a consequence of what was already shown.
   A class and a 120ms transition, nothing more; reduced motion still gets the
   light, at once, because the light is information and not decoration. */
function obPreview(e,on){
 if(!OB.open||OB.step!==4)return;
 var t=e.target&&e.target.closest?e.target.closest('[data-obplace]'):null;
 var h=document.getElementById('ob'); if(!h)return;
 h.querySelectorAll('.obx-near .prev').forEach(function(x){x.classList.remove('prev');});
 if(!on||!t)return;
 var i=+t.getAttribute('data-obplace'), p=(i>=0)?OB_PLACES[i]:null; if(!p)return;
 h.querySelectorAll('.obx-near [data-obseat="'+p.b+'"]').forEach(function(x){x.classList.add('prev');});}
addEventListener('pointerover',function(e){obPreview(e,true);});
addEventListener('pointerout',function(e){obPreview(e,false);});
addEventListener('focusin',function(e){obPreview(e,true);});
addEventListener('focusout',function(e){obPreview(e,false);});
/* escape leaves, because a sheet a person cannot dismiss is a sheet that has
   stopped being an invitation. */
addEventListener('keydown',function(e){
 if(OB.open&&e.key==='Escape')obClose();});

/* ---- the story screen reads, and does not commit. ----

   F4, round QA. Done used to run stCommit here, so the charge was in the
   field before the mirror was shown and a no on the mirror had nothing to
   take back. Done now sets the same two lines the Story tab's own textarea
   runs, ST_TEXT and ST_PARSED, and reads the parse into the mirror. The
   commit is obCommit below, on the mirror's own Commit.

   J0 AGAIN, NAMED AT THE LINE IT IS ABOUT. The parseStory call below is
   where a stranger's own first words, typed into this product for the
   first time, are first read. Nothing stands between that text and the
   engine's own parser, and nothing here claims otherwise. */
function obStoryDone(){
 var ta=document.getElementById('obtext'); if(!ta)return;
 var v=ta.value; OB.text=v;
 if(v.trim().split(/\s+/).filter(Boolean).length<3)return;
 ST_TEXT=v; ST_PARSED=v.trim()?parseStory(v):null;
 OB.commit=null; OB.read=obReadOf(ST_PARSED,'s',{});
 OB.fixReads=[]; OB.fixes=[]; OB.ans={}; OB.more={}; OB.plan=null;
 OB.step=6; obRender();}

/* ---- the one commit this sheet makes, through the real path: stCommit,
   factored out for the Day One tutorial first and reused here rather than a
   third copy of it. The text is set again from OB.text, so what is committed
   is exactly the story the mirror showed. ---- */
function obCommit(){
 if(!OB.text||!OB.text.trim()){ OB.step=7; obRender(); return; }
 ST_TEXT=OB.text; ST_PARSED=parseStory(OB.text); OB.plan=null;
 var r=stCommit();
 OB.commit=r;
 /* THE TAPS AND THE ANSWERS WRITE TO THE REAL PROFILE THE WAY THE STORY TAB
    ALREADY DOES: the same entry, the same CURP.story.entries array, the same
    pSave, never a second store. A tap is kept as exactly what it is, a tap,
    and is never run back through parseStory as if the person had typed it.
    yes and no are node ids, the decline record F11 will read; fixes are the
    corrections, word for word. */
 try{
  if(r&&r.ok&&CURP&&CURP.story&&CURP.story.entries&&CURP.story.entries.length){
   var ent=CURP.story.entries[CURP.story.entries.length-1];
   ent.ob={pick:OB.pick,feel:OB.feel,place:OB.place,
    yes:obYes().map(function(n){return n.i;}),no:obNo().map(function(n){return n.i;})};
   if(OB.fixes.length)ent.ob.fixes=OB.fixes.slice();
   if(!pSave()&&typeof status==='function')
    status('This browser would not save. The story is in the field and its answers are not.','fail');}
 }catch(e){}
 OB.step=7; obRender();}
/* an answer redraws the card and keeps the person where they were: the
   scroll position, and focus on the same control, so a keyboard user is not
   thrown back to the top of the sheet. */
function obRenderKeep(el){
 var h=document.getElementById('ob'), sc=h&&h.querySelector('.ob-scroll'), y=sc?sc.scrollTop:0;
 var key=el&&el.getAttribute?(el.getAttribute('data-obans')?'[data-obans="'+el.getAttribute('data-obans')+'"][data-obi="'+el.getAttribute('data-obi')+'"]'
  :''):'';
 var grp=el&&el.getAttribute?el.getAttribute('data-obmore'):null;
 obRender();
 sc=h&&h.querySelector('.ob-scroll'); if(sc)sc.scrollTop=y;
 var f=null;
 if(key&&h)f=h.querySelector(key);
 /* a seat just opened: focus moves to the first address it revealed */
 if(grp&&h){ var g=h.querySelector('.ob-grp[data-obgrp="'+grp+'"]');
  var ys=g?g.querySelectorAll('[data-obans="yes"]'):[]; f=ys[1]||ys[0]||null; }
 if(f&&f.focus)f.focus({preventScroll:true});}
