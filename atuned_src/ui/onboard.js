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
/* THE FIGURE. The Body page's own silhouette, at the Body page's own
   transform, with the seven seats where PMBANDS puts them.

   WHY THE SEATS ON IT ARE NOT THE CONTROL, said here because the storyboard
   asks for a tap on the figure. Measured: at 390 the card is 346 wide, the
   drawing 310, and the seven seats span 49 of 102 units of its height, which
   is 15 pixels between the crown and the 3rd eye. The tap floor is 44. Seven
   targets cannot sit 15 pixels apart and be pressable, so the figure is the
   picture and the chips under it are the control, and pressing a chip lights
   its seat here. One concept, one control, and the drawing says where.

   WHERE THE NAMES SIT, AND WHY THERE IS NO LEADER LINE TO THEM. The figure
   occupies x 28.8 to 71.4 of its own hundred unit box, which leaves 28.8
   units of gutter on its left with nothing in it. The seat names go there, at
   the seat's own height, which is how the four release sheets drawn this
   round carry them (release-redesign/, mockup B). No rule is drawn between a
   name and its ring: the two share a baseline, which is the connection, and a
   line from the name would cross the silhouette at every seat below the
   throat. One mark fewer, and nothing lost.

   THE NAMES COME OFF WHEN THEY WOULD BE TOO SMALL TO READ. 4.4 units of a 300
   pixel drawing is 13 pixels and of a 220 pixel drawing is 9.7, which is under
   the eleven pixel type floor. So the caller says whether this drawing is
   large enough to carry them, and the small one on the mirror does not: the
   groups under it name every seat in full.

   lit is a list of seat names to light, pick is the one seat answered. */
function obBodyFig(o){
 o=o||{}; var lit={}; (o.lit||[]).forEach(function(b){lit[b]=1;});
 var names=o.names!==false;
 /* THE BOX IS CROPPED TO WHAT IS DRAWN, not left at the Body page's hundred
    units. With names the content runs x 10 to 71.4 and with them off it runs
    28.8 to 71.4, so one box for both put the figure visibly right of the
    card's centre, measured at 1600 on the welcome. Each is cropped to its own
    content and the figure lands on the optical centre either way. */
 var box=names?'6 0 68 102':'26 0 48 102';
 var s='<svg class="ob-bodyfig'+(o.cls?' '+o.cls:'')+'" viewBox="'+box+'" aria-hidden="true">'
  +'<g transform="translate(0 1)">'
  +'<g transform="translate('+PMTX+','+PMTY+') scale('+PMS+')">'
  +'<path class="ob-bf-skin" d="'+BODYPATH+'"/></g>'
  /* the midline the seats stand on, the Body page's own axis */
  +'<line class="ob-bf-ax" x1="50" y1="3.6" x2="50" y2="57"/>';
 obSeatRows().forEach(function(r,i){
  var on=lit[r.b]||o.pick===r.b, c=seatCol(r.b);
  s+='<g class="ob-bf-s'+(on?' on':'')+'" style="--c:'+c+'">'
   +(names?'<text class="ob-bf-n" x="26" y="'+(r.y+1.6)+'">'+esc(r.b)+'</text>':'')
   +'<circle class="ob-bf-r" cx="50" cy="'+r.y+'" r="'+(on?3.4:2.4)+'" '
   +'style="animation-delay:'+(0.05+(6-i)*0.035).toFixed(3)+'s"/>'
   +(on?'<circle class="ob-bf-h" cx="50" cy="'+r.y+'" r="6.2"/>':'')
   +'</g>';});
 return s+'</g></svg>';}
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
/* THE FIGURE, AT REST, kept as the watermark only. The welcome draws the real
   body above instead, because a spine with seven coloured dots on it is the
   rainbow column the brief rules out, at small size. The watermark keeps this
   one: behind a card at seven percent it is a shape and not a claim, and the
   real silhouette at that opacity reads as a smudge. */
function obFigure(){
 var y=[160,140,120,100,80,60,40];
 var col=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
 return '<svg class="ob-fig" viewBox="0 0 200 178" aria-hidden="true">'
  +'<ellipse class="ob-fig-h" cx="100" cy="21" rx="13" ry="4.4"/>'
  +'<line class="ob-fig-s" x1="100" y1="160" x2="100" y2="40"/>'
  +y.map(function(yy,i){
    return '<circle class="ob-fig-d" cx="100" cy="'+yy+'" r="4.6" '
     +'style="fill:'+seatCol(col[i])+';animation-delay:'+(0.1+i*0.07).toFixed(2)+'s"/>';}).join('')
  +'</svg>';}
function obOpen(replay){
 var h=document.getElementById('ob'); if(!h)return;
 OB.open=true; OB.step=0; OB.replay=!!replay;
 OB.pick=null; OB.feel=null; OB.place=null;
 OB.text=''; OB.commit=null; OB.corr=''; OB.fixes=[];
 OB.read=null; OB.fixReads=[]; OB.ans={}; OB.more={}; OB.plan=null;
 h.classList.remove('ob-leaving');
 obRender();
 h.style.display='flex';
 var f=h.querySelector('button,textarea'); if(f)f.focus();}
/* THE HANDOFF TO THE FIELD IS A FADE, NOT A CUT, unchanged from round MP. */
var OB_LEAVE_MS=520;
function obClose(){
 var h=document.getElementById('ob'); if(!h)return;
 OB.open=false; h.classList.add('ob-leaving');
 /* LEFT BEFORE COMMIT. Nothing was written, and the words are not lost:
    they are still the Story tab's pending text, ST_TEXT, where the Commit
    button there can keep them. Said once, so a person who pressed Escape on
    the mirror is not left to assume the story was saved. */
 var left=OB.read&&!OB.commit&&OB.text&&typeof ST_TEXT==='string'&&ST_TEXT===OB.text;
 setTimeout(function(){ h.style.display='none'; h.classList.remove('ob-leaving'); h.innerHTML=''; },OB_LEAVE_MS);
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
function obCard(eye,title,body,acts,nsteps){
 var n=nsteps||OB_NSTEPS, b=String(body||'');
 var wm=b.indexOf('ob-bodyfig')<0&&b.indexOf('ob-loop')<0;
 return '<div class="ob-card" role="dialog" aria-modal="true" aria-label="'+esc(title)+'">'
  +'<div class="ob-wash" aria-hidden="true"></div>'
  +(wm?'<div class="ob-fig-wm" aria-hidden="true">'+obFigure()+'</div>':'')
  +'<div class="ob-scroll">'
  +'<span class="'+obEyeCls(eye)+'">'+esc(eye)+'</span>'
  +'<h2 class="ob-h">'+esc(title)+'</h2>'
  +body
  +'<div class="ob-acts">'+acts+'</div>'
  +'<div class="ob-dots">'+Array.from({length:n}).map(function(_,i){
    return '<span class="ob-dot'+(i===OB.step?' on':(i<OB.step?' past':''))+'"></span>';}).join('')+'</div>'
  +'</div></div>';}
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
  out=obCard('Welcome to a neurosomatic experience','This is you, and it is okay.',
   obBodyFig({cls:'ob-bodyfig-hero'})
   +'<p class="ob-p">No judgment. Nothing here grades you. This one is for you.</p>'
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
  out=obCard('Ask','What brought you here?',
   '<p class="ob-p ob-dim">Pick the one that is closest. Nothing is locked in.</p>'
   +obChips(OB_STARTS,'obpick',OB.pick,false),
   '<button type="button" class="btn" data-ob="back">Back</button>');
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
     the reason obBodyFig states, and each chip carries its seat's own mark.

     ONE THING THE DRAWING DOES NOT SAY, kept out of the copy on purpose. A
     press on a place is the advance, so the seat it lights is on screen for
     one frame and then the card is the Story. The line under the figure
     therefore says what the figure is, and never promises a light a person
     will not see. Coming back lights it, because OB.place is still set. */
  var pb=(OB.place!=null&&OB.place>=0)?OB_PLACES[OB.place]:null;
  out=obCard('Body','Where do you notice it?',
   '<p class="ob-p ob-dim">Pick the place that is closest to it.</p>'
   +obBodyFig({pick:pb?pb.b:null})
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
   +'<div class="ob-f"><textarea id="obtext" rows="4" placeholder="What happened, and what it was like."></textarea></div>',
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
 h.innerHTML=out;
 var ta=document.getElementById('obtext');
 if(ta){ta.value=OB.text; ta.oninput=function(){
   var go=document.getElementById('obdone'); if(go)go.disabled=(ta.value.trim().split(/\s+/).filter(Boolean).length<3);};
  ta.focus();}
 var ci=document.getElementById('obcorr');
 if(ci){ci.oninput=function(){OB.corr=ci.value;};}
 var f=h.querySelector('.ob-scroll'); if(f)f.scrollTop=0;}

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
  lines+='<div class="ob-mirrorfig">'+obBodyFig({lit:seats,names:false})
   +'<p class="ob-p ob-dim ob-figsay">Lit where your words put weight: '
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
    :pl.inferred+' of the '+n+' come')+' from where the feeling sits. Your words did not name '
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
