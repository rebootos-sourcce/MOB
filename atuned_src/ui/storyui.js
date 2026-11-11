/* ============================================================
   THE STORY PAGE IS THREE COLUMNS NOW, AND THE RIGHT RAIL STEPS ASIDE.

   Round IJ in TASKS.md, his words: "This looks good for the story. Wired in."
   That approves round II's prototype, proto/story-redesign2, and this is the
   port of its layout H, Flow: write, imprints and release side by side, all
   of it above the fold at 1600, and the column a person is working in takes
   the room. H is the one the round II panel favoured on a phone, 67 per cent
   of a thousand reaching the release against 24 on the old page, because it
   is the only layout that kept every control on the first screen. He named no
   other layout when he approved it.

   His two rulings from round HY and IG that it carries: "I want story,
   imprints and release to all be above the fold ... feel free to break that
   right navigation", and the release cut to "your selections, pace, and how
   many patterns ... and this, just, run release button".

   WHAT IS PORTED AND WHAT IS NOT. The read is the prototype's, on the same
   engine calls: parseStory and marksOf for the marks, srcHear and srcTurn for
   Source AI, compute and meterPlan for the release. The instrument is its
   Trace strip chart with Route's line through it and the five sorts. Three
   things of the prototype's are not ported, because each was standing in for
   something the product already has:
     the in panel run, which was a preview that released nothing. Run opens
       the real release card, ui/release.js, which spends and records.
     the vault's page only memory of previews. The vault reads the record's
       own meter, which is what a release actually wrote.
     the flying word chip. The bars rise on their own spring as a word lands,
       which is the same event, drawn once rather than twice.
   ============================================================ */
/* THE THREE COLUMNS WEAR THEIR NAMES. Round QB, his words: "For the font
   titles for the journal, I don't want source. I want journal, the word
   journal and prints and release. And I want them to have a font and symbolic
   icon that reflects them. So when I come here, it looks branded."

   The left column had no name of its own. The first title in it read Source
   AI, over the question box, and Source is already a canon word with its own
   meaning in kb.js: the field before any pattern is put in. So the column is
   Journal now, and the question box carries no eyebrow.

   One mark per column, one shape for all three: a ring icon on the 24 unit
   grid, stroked and never filled, beside the word, which is a carrier of the
   word's sentence in engine/data/gloss.js. Three treatments of the one
   typeface the build carries, each saying what the column does:
     Journal   light, 300. Ink going on to the page.  The mark is a pen nib.
     Imprints  heavy and tight, 700. Pressed in, held. The mark is the rail's
               own three rings for Imprints, reused, never redrawn.
     Release   regular, tracked wide. Coming apart.   The mark is a ring open
               at the top, and the charge leaving through the gap as three
               small rings. A line through the gap was the first cut, and
               measured at its real size it read as a power button.
   Knowledge already owns the open book and Story owns the page, so neither
   is used here: a second drawing for a named thing is a second name for it. */
var ST_MARK={
 j:'<path d="M12 21l-5-6.5L9.2 5.5h5.6L17 14.5z"/><path d="M12 21v-7.4"/>'
  +'<circle cx="12" cy="12.2" r="1.4"/><path d="M9 3h6"/>',
 i:'<circle cx="7.5" cy="8" r="3"/><circle cx="16.5" cy="8" r="3"/><circle cx="12" cy="16" r="3.6"/>',
 r:'<path d="M8.14 10.4A6 6 0 1 0 15.86 10.4"/>'
  +'<circle cx="12" cy="8.4" r="1.3"/><circle cx="9.2" cy="4.9" r="1.3"/><circle cx="14.6" cy="2.9" r="1.3"/>'};
function stMark(k,word,term,cls,tail){
 var a=unpAttr(term,null,word);
 return '<div class="st-mk st-mk-'+k+(cls?' '+cls:'')+'">'
  +'<svg viewBox="0 0 24 24" aria-hidden="true">'+ST_MARK[k]+'</svg>'
  +'<h3'+(a?' class="tipu"'+a:'')+'>'+esc(word)+'</h3>'+(tail||'')+'</div>';}
/* ============================================================
   THE FIVE MINI PICTURES, 10 November. Round of the four-column
   Dashboard: "I want to do a mock-up with the imprints as a third
   column, release as a fourth column... Bank is something very
   important, so we want to see this filling up... make the uni column
   and the imprint columns 2 and 3 the same width." Approved, then
   widened the same round to a second row under each of those three
   columns, his words: "we want our boundary and compass 2D
   representations of those systems," and under imprints a Body and a
   Field, under Release an Avatar.

   NONE OF THESE ARE THE REAL TAB. Compass (ui/cone.js), Field
   (ui/wheel.js), Body (ui/map.js) and Character (ui/character.js,
   avatarui.js) are each one singleton canvas tied to one element by id,
   holding shared zoom, pan and animation state (CONE, AURA_K, CHV). A
   second live instance here would fight the real tab's own, or go
   blank the moment both exist. So each of these draws once from
   compute()'s own reading, as a small read-only picture: no zoom, no
   pan, no loop of its own, redrawn only when stRender runs, same as
   every other static piece of this page.

   "BOUNDARY" WAS ASKED AND ANSWERED, not guessed. The name was already
   taken: boundaryCount() (engine/avatar.js) is the purpose hexagon, how
   many of a person's own stated commitments are actually kept, six
   sides of five each. An earlier task's own wording ("Remove
   Boundary/Compass headings, reposition CQ/DQ") read like it meant
   CQ/DQ; asked directly, it is the hexagon. CQ's own home among these
   five is Field, whose real tab already reads its headline off the
   same number (ui/wheel.js:508). */
/* the seven seats' own colour tokens, named once so a MIRROR axis or a
   body address can be coloured by its seat without guessing a string */
var SEATCOL={Root:'--root',Sacral:'--sacral',Solar:'--solar',Heart:'--heart',
 Throat:'--throat',Eye:'--eye','Third Eye':'--eye',Crown:'--crown'};
function stMiniShell(id,label,inner){
 return '<div class="st-mini" id="'+id+'" aria-label="'+esc(label)+'">'
  +'<div class="st-mini-lb">'+esc(label)+'</div>'+inner+'</div>';}
/* COMPASS, the sixteen MIRROR axes (engine/data/compass.js) as spokes from
   the centre; coneMirPos (ui/cone.js) is the real tab's own per-axis read,
   0 to 100 or null unanswered, reused rather than re-derived. */
function stMiniCompass(r){
 var un=r.unread, pts='';
 MIRROR.forEach(function(m,i){
  var v=un?50:coneMirPos(m);
  var a=(i/MIRROR.length)*Math.PI*2-Math.PI/2;
  var rad=10+(v/100)*42, x=60+Math.cos(a)*rad, y=60+Math.sin(a)*rad;
  var col=un?'var(--dim)':'var('+(SEATCOL[m.seat]||'--dim')+')';
  pts+='<line x1="60" y1="60" x2="'+x.toFixed(1)+'" y2="'+y.toFixed(1)+'" stroke="'+col+'" stroke-opacity=".4"/>'
   +'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="2.3" fill="'+col+'"/>';});
 return '<div class="st-mini-vis"><svg viewBox="0 0 120 120" aria-hidden="true">'
  +'<circle cx="60" cy="60" r="52" fill="none" stroke="var(--edge)"/>'+pts
  +'<circle cx="60" cy="60" r="2.4" fill="var(--ink)"/></svg></div>';}
/* BOUNDARY, the purpose hexagon. Each of the six sides (PUR_SIDES,
   engine/avatar.js) lit by how many of its five slots (PUR_PER_SIDE) are
   filled, the same filter boundaryCount runs, so the picture and the
   number it carries never disagree. Not gated on r.unread: a purpose
   nobody has opened yet is honestly 0 of 30, not a story left unread. */
function stMiniBoundary(){
 var pu=(CURP&&CURP.purpose)||purposeBlank(), bc=boundaryCount(pu), segs='';
 PUR_SIDES.forEach(function(s,i){
  var a=((pu.sides&&pu.sides[s])||[]).filter(function(x){return x&&String(x).trim();});
  var frac=Math.min(a.length,PUR_PER_SIDE)/PUR_PER_SIDE;
  var a0=(i/PUR_SIDES.length)*Math.PI*2-Math.PI/2, a1=((i+1)/PUR_SIDES.length)*Math.PI*2-Math.PI/2;
  var x0=(60+Math.cos(a0)*50).toFixed(1), y0=(60+Math.sin(a0)*50).toFixed(1);
  var x1=(60+Math.cos(a1)*50).toFixed(1), y1=(60+Math.sin(a1)*50).toFixed(1);
  segs+='<path d="M60 60L'+x0+' '+y0+'A50 50 0 0 1 '+x1+' '+y1+'Z" fill="var(--throat)" '
   +'fill-opacity="'+(0.12+frac*0.6).toFixed(2)+'" stroke="var(--edge-2)"/>';});
 return '<div class="st-mini-vis"><svg viewBox="0 0 120 120" aria-hidden="true">'+segs
  +'<text x="60" y="65" text-anchor="middle" font-size="15" fill="var(--ink)">'+bc.filled+'/'+bc.of+'</text></svg></div>';}
/* BODY, the heaviest of what compute() already calls carrying: the top
   address (r.heaviest), the band it sits in (r.darkB) and every address
   holding anything at all (r.carrying.length). No address-by-address
   detail here, that is the real Body tab's job; this is one glance at
   where the charge is sitting now. */
function stMiniBody(r){
 var un=r.unread, hot=un?null:r.darkB;
 var dot=function(seat,x,y){
  var on=hot===seat, col=un?'var(--dim)':'var('+(SEATCOL[seat]||'--dim')+')';
  return '<circle cx="'+x+'" cy="'+y+'" r="3.6" fill="'+col+'" stroke="none" opacity="'+(on?1:.5)+'"/>';};
 var svg='<svg viewBox="0 0 70 120" aria-hidden="true" fill="none" stroke="var(--edge-2)" stroke-width="2">'
  +'<circle cx="35" cy="14" r="10"/><path d="M35 24v46M35 34h-18M35 34h18M35 70l-14 36M35 70l14 36"/>'
  +dot('Throat',35,34)+dot('Heart',35,48)+dot('Solar',35,58)+dot('Sacral',35,66)+dot('Root',35,72)+'</svg>';
 var cap=un?'–':(r.carrying.length+' carrying'+(r.heaviest?', '+esc(hot)+' '+r.darkV.toFixed(1):''));
 return '<div class="st-mini-vis">'+svg+'</div><div class="st-mini-cap">'+cap+'</div>';}
/* FIELD, the same headline the real tab reads, r.CQ, as a filled ring, the
   fill a percent equal to the number beside it (the same rule the Summary
   gate already holds the app to). Coloured through --uni-amb-core, the
   same live custom property ambPaint (ui/uni.js) already writes onto
   the document from her own palette; getPalette itself is private to
   her module's own closure and unreachable from here, so this reads
   the one value she already publishes rather than a second colour
   invented in this file. */
function stMiniField(r){
 var un=r.unread, cq=un?0:clamp(r.CQ,0,100);
 var col='rgb(var(--uni-amb-core))';
 var C=2*Math.PI*46, frac=un?0:cq/100;
 var svg='<svg viewBox="0 0 120 120" aria-hidden="true">'
  +'<circle cx="60" cy="60" r="46" fill="none" stroke="var(--edge)" stroke-width="9"/>'
  +'<circle cx="60" cy="60" r="46" fill="none" stroke="'+col+'" stroke-width="9" stroke-linecap="round" '
  +'stroke-dasharray="'+(C*frac).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 60 60)"/>'
  +'<text x="60" y="66" text-anchor="middle" font-size="18" fill="var(--ink)">'+(un?'–':Math.round(cq)+'%')+'</text></svg>';
 return '<div class="st-mini-vis">'+svg+'</div>';}
/* AVATAR, the character's own current mask (r.mask, the same field
   ui/character.js reads) in its own colour (CHC.maskCols,
   ui/character.js), or Uni's own published coherence colour
   (--uni-amb-core, see stMiniField above) when nothing is worn right
   now; never a guess at what the real torus is doing. */
function stMiniAvatar(r){
 /* r.mask IS AN OBJECT, NOT A NAME, caught the first time this ran in a
    real browser against a profile that actually triggered one: it is
    whichever of sups/hys/cxs/sabs sits first (engine/compute.js), each
    its own shape with its own .nm, never a MASKS_READ name maskOf could
    look up. maskOf(r.mask) always came back null; the caption printed
    "Wearing [object Object]". There is no real link from that ladder to
    MASKS_READ's five, so this reads only r.mask.nm for the words and
    falls back to her own coherence colour exactly as before. */
 var un=r.unread, nm=r.mask&&r.mask.nm;
 var col='rgb(var(--uni-amb-core))';
 var cap=un?'–':(nm?'Wearing '+nm:'No mask read yet');
 var svg='<svg viewBox="0 0 100 120" aria-hidden="true" fill="none" stroke="'+col+'" stroke-width="2">'
  +'<circle cx="50" cy="38" r="26"/><path d="M14 112c0-24 16-40 36-40s36 16 36 40"/>'
  +'<circle cx="42" cy="36" r="2.6" fill="var(--ink)" stroke="none"/>'
  +'<circle cx="58" cy="36" r="2.6" fill="var(--ink)" stroke="none"/></svg>';
 return '<div class="st-mini-vis">'+svg+'</div><div class="st-mini-cap">'+esc(cap)+'</div>';}
/* THE FOUR MASKS BESIDE HER, 10 November, his words: "on the avatar, you
   still have this blank space to its right. What I want you to do is
   move the avatar to the right and then add the masks. Add four
   masks." MASKS_READ (engine/data/canon.js) names five, each tied to
   the seats it sits over (m.b); this scores each by the mean weight
   r.carrying already gives those seats (the same figure darkB/darkV
   read it from in compute.js, not a second arithmetic invented here)
   and shows the top four, strongest first, rather than a fixed four
   that may say nothing about this person's own reading. */
function stMiniMasks(r){
 var un=r.unread;
 if(un||typeof MASKS_READ==='undefined')
  return '<div class="st-mask4" aria-label="Masks"><p class="st-mini-cap">–</p></div>';
 var bySeat={};
 r.carrying.forEach(function(n){ (bySeat[n.b]=bySeat[n.b]||[]).push(n.sq); });
 var scored=MASKS_READ.map(function(m){
  var vals=(m.b||[]).map(function(s){ var a=bySeat[s];
   return a&&a.length?a.reduce(function(x,y){return x+y;},0)/a.length:0; });
  var v=vals.length?vals.reduce(function(x,y){return x+y;},0)/vals.length:0;
  return {m:m,v:v};}).sort(function(a,b){return b.v-a.v;}).slice(0,4);
 var tiles=scored.map(function(s){
  var col=CHC.maskCols(s.m)[0];
  return '<div class="st-mask4-t" style="--c:'+col+'" title="'+esc(s.m.nm)+'">'
   +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+s.m.ic+'"/></svg></div>';}).join('');
 return '<div class="st-mask4" aria-label="Masks">'+tiles+'</div>';}
/* ---- the journal ---- */
function stRender(){
 var h=document.getElementById('story'); if(!h) return;
 /* FULL OR SIMPLE, SAID ONCE, before anything is measured: the Full view's
    left rail takes 302 pixels of the row (shell/head.html, st-full), so the
    chart below must be sized on the row it will actually have. Only on the
    Journal itself, because stCommit can redraw this page from another tab
    and the class must not outlive stRailClear there. */
 document.body.classList.toggle('st-full',!!STV.dash&&S.tab===TAB.STORY);
 stOwn(); stDraftBack();
 var p=ST_PARSED;
 /* THE FIVE MINI PICTURES READ THIS, 10 November. One compute() for
    Compass, Boundary, Body, Field and Avatar below, the same reading
    every other panel on this page already reads off, not a sixth call
    for a sixth picture. */
 var r=compute();
 /* A WORKED EXAMPLE IS SHOW ONLY, ruled 16 October (engine/showonly.js). Its
    bank, its vault and its imprints are the reading and all of them stay.
    The journal is where a person's own words are read, so on an example the
    box, Talk, Record, Source AI's question and Commit are the one preview
    line in their place (showNote, ui/personas.js). It was a box that took a
    whole story and then refused it at Commit, which is a control that looks
    like it works until the moment it does not. */
 var show=showOnly();
 /* THE ONLY TWO ICONS, AT REST, 10 November. His words, naming exactly
    what the hero view may show: "the talk icon... the dashboard... these
    are the only icons on the screen. Everything else is conversational
    between me and Uni." Source AI's own question line and the keyboard
    plus commit bar are what read as a text chat and a third control to
    him; they still exist and still work (the crisis door is untouched,
    below), they are only hidden by CSS, shell/head.html's own
    body.tab-story:not(.st-full) #stjr.st-rest rules, while nothing is
    actually happening. The moment any of the four below is true, a
    person is already past "at rest" and into the conversation itself,
    so the ordinary UI is exactly what belongs back on screen. */
 /* AND AT REST MEANS NOTHING HAS BEEN SAID YET, caught by tests/sound.js's
    own real-browser round: a voice turn lands (srcTurnCommit, above,
    which writes ST_TEXT) and the person then presses the real Commit
    button to write it, exactly the one door "everything else is
    conversational between me and Uni" describes. !ST_TEXT is that
    fourth condition: the instant a turn has landed, or a person typed,
    this is no longer rest, it is the conversation he named, and the
    ordinary controls (Commit among them) are what belong back on
    screen for it. */
 var heroRest=!STV.dash&&!STV.typed&&!ST_LISTEN&&!STV.crisis&&!ST_TEXT;
 var out='<div class="st-flow'+(STV.dash?'':' st-simple')+'" id="stflow" data-focus="'+STV.focus+'">'
  /* ---- the write column: the journal, with Source AI inside it ---- */
  +'<div class="st-colw">'
  +'<div class="st-pan st-jr'+(STV.chat?' st-chat':'')+(heroRest?' st-rest':'')+'" id="stjr">'
  /* SPEAK BECAME RECORD, AND IT CARRIES ITS STATE.

     Speak is what you do, record is what the control does, and the ruling
     everywhere else in this product is that a menu word describes exactly
     what the thing does. The dot says which mode you are in without reading
     the label: green while it is recording, red while you are typing.

     THE EYEBROW AND THE LINE UNDER IT ARE GONE, round LO, his words: "I want
     to remove the text saying the day and re remove the recording sends the
     audio to browser. Just get rid of that text." The eyebrow read "The day";
     the box keeps it as its accessible name, which nobody sees and a screen
     reader needs. The line read "Recording sends the audio to your browser's
     speech service. Typing does not leave this device." It was put there
     because that is true and was nowhere else, and it is still true: browser
     speech recognition is a network service and the audio reaches the
     browser vendor. So the fact moved rather than went. It is in the
     button's own tooltip, on the one control that sends the audio anywhere,
     and it is off the page. */
  /* the live dot came up here with the name, see srcPaint: it breathes while
     the question box is idle and holds lit while it reads, and it sits beside
     the word it was always beside. */
  +'<div class="st-hd">'
   /* THE JOURNAL MARK IS GONE FROM THIS HEADER, round of 29 October, his
      words: "the icon for journal and the text journal remove." Talk takes
      its place on the left; Dashboard keeps the right. stMark('j',...) is
      still the Discover door's own name elsewhere (TABDEF, the section
      itself), only this panel's own repeated word is cut. */
   +'<div class="st-hdbtns">'
   /* CHAT, THE ONLY CONTROL ON THE LEFT, round of 29 October, name changed a
      second time the same day: "the talk button, you're going to change to
      chat," looking at the new text window it opens onto (see the ruling at
      srcThread). Still the same control that starts or stops the
      microphone (stMic); the word changed, not the wiring. The clock and
      the dot are unchanged. */
   +(show?'':'<button class="st-mic'+(ST_LISTEN?' on':'')+'" id="stmic" type="button" aria-label="'
   +(ST_LISTEN?'Listening':'Talk')+'" title="'
   +(ST_LISTEN?'Listening. Press to stop and keep what it heard.'
     :'Talk by speaking instead of typing. What you say goes to your browser\'s speech service; typing does not leave this device.')+'">'
   +'<span class="st-dot"></span>'
   /* AN ACTUAL TALK BUBBLE, 10 November, his words: "the talk icon is an
      actual talk bubble icon." The capsule-and-stand microphone glyph
      that stood here read as a recording control, not as talk, and he
      had already asked for a bubble once before (9 November, "I want a
      talk icon on the left"), answered with the mic glyph below it
      instead: this is the actual shape, not a second pass at the same
      one. Ring, not fill, the house's own icon rule: a stroked bubble
      with its tail, no capsule. */
   +'<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8">'
   +'<path d="M6 4h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7.6l-3.4 2.8a.6.6 0 0 1-1-.46V15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke-linejoin="round"/></svg>'
   /* THE WORD AND THE CLOCK ARE BOTH GONE, 9 November, his words on this
      exact screen: "I want a talk icon on the left. No words... we don't
      need a timer for how long it's for, get rid of that." The label the
      button carried ("Talk"/"Listening", 29 October through 9 November,
      more than once renamed) and the mm:ss clock (round LV, "I want the
      time showing how long my recording is") both move to aria-label and
      title above; a screen reader still hears exactly what it did, a
      sighted eye reads only the icon and the dot. stmicElapsed/stMicFmt
      stay defined and reachable (stMicTick still ticks #stmictime if that
      id is ever reintroduced elsewhere), only this button's own two lines
      are cut. */
   +'</button>')
   /* THE DOT IS GONE, round of 29 October, his words: "the chat icon still
      looks really boring, get rid of the blue dot next to it." .src-live
      was the live breathing dot beside Chat, tied to Source AI's own
      hearing state (srcHearing below). Nothing else showed that state, so
      removing it is a real loss of a signal, not only a cosmetic one, and
      is his call to make, taken as said. */
   +'</div>'
   /* THE DASHBOARD DOOR STANDS ON ITS OWN NOW, round of 29 October, found by
      his own screenshot of the real site: Dashboard sat right beside Talk on
      the left, both inside .st-hdbtns, which left .st-hd with one child and
      nothing for its own justify-content:space-between to push apart. The
      comment above always said Dashboard keeps the right; the markup did
      not. A sibling of .st-hdbtns, not a child of it, is what that rule
      needs to do anything. */
   /* THE DASHBOARD DOOR, ON THE RIGHT, round of 29 October. His own 20
      September ruling already named what that word means in this product:
      "THE AVATAR IS THE DASHBOARD" (TASKS.md 0o), the avatar reading across
      every tool at once. The Avatar already exists and already renders
      (TAB.INTAKE, nm:'Avatar', renderAvatar() in ui/avatarui.js). Pressing
      it no longer opens that tab: it toggles Imprints and Release open or
      shut beside the conversation, simple on landing, his words "when I
      land on this page it starts off in simple mode" and "if I press it
      dashboard icon is lit up." Bound below, as #stdash's onclick near the
      foot of this function. */
   /* "MINIMIZE" ONCE IT IS OPEN, 9 November, his words: "change the word
      dashboard when it's full to minimize." The control and its wiring
      are unchanged, STV.dash still decides what it does; only the word a
      person reads flips with the state it is already in, the same way
      this button's own .on class already does. */
   +(show?'':'<button class="st-dash'+(STV.dash?' on':'')+'" id="stdash" type="button" aria-label="'
    +(STV.dash?'Minimize':'Dashboard')+'" title="'
    +(STV.dash?'Minimize, back to the conversation alone':'Show Imprints and Release beside the conversation')+'">'
   +'<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8">'
   +'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/>'
   +'<rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/></svg>'
   /* ICON ONLY, 9 November, his words: "I don't want the word dashboard,
      I just want the icon." Same pattern as Talk beside it: the word moves
      to aria-label and title, nothing a screen reader hears changes. */
   +'</button>')
   +'</div>'
  /* SOURCE AI AND THE JOURNAL'S MENU CHANGED PLACES, round LO, his words: "I
     want you to swap the main journal menu with the source AI question." The
     column read Source AI, then the journal's own top line with Record on it,
     then the box. It reads Record, then Source AI, then the box now, so the
     question sits straight over the place it is answered. Source AI came
     inside the journal's panel to do that, and it wears its own ground, the
     same sunk ground as the box and the chart, because he asked for it to
     read as a display: "right now the source scripted area is on gray ... I
     want it to have its own black background."

     It keeps its id, #stsrc, and its one speaking line, so a screen reader
     still hears only what it says. HT in TASKS.md put it above the journal,
     "above the journal part will be a prompt engine", and it is still above
     the part a person writes in.

     ROUND LV WRAPS IT IN ITS OWN HALO. His words: "I want that location to
     feel like it's alive and innovative... a different nature to it... pull
     elements from the field style... to give this a more animated, alive
     feel." Not the field's canvas, which has no business on a page a person
     is writing in: its aesthetic, see the CSS at .st-glow. The wrapper is
     the only change here; #stsrc keeps its id, its aria-label and its one
     spoken line exactly as they were, so nothing that already reads it has
     to change. It has to be a real element and not a third pseudo on .st-pe,
     because that panel already spends both of its own, ::before and
     ::after, on the passing light and the scan; see the same CSS. */
  /* ROUND PW PUTS THE FIELD ON ITS FLOOR, see srcComb below and the CSS at
     .src-comb. It is a sibling of #stsrc and not inside it, for the reason
     the halo is: srcPaint rewrites #stsrc on every key, and the floor is
     painted once a render. srcLock puts every loop in here on one clock. */
  /* THE EYEBROW IS GONE, round of 29 October, his words: "get rid of that
     text that says talk." The Talk button named on the left is the label
     now; Source AI's own line carries no second name above it. */
  /* THE GRADIENT BAR UNDER SOURCE AI IS GONE, round of 29 October. A second,
     separate rainbow element from the per-word floor strip cut 28 October
     (srcComb's seat-colour gradient, not the trace canvas): missed twice
     before a photo made it obvious it sat right over the reply box. His
     words both times were "get rid of those rainbow colours," and this is
     the one that was still there. srcComb() itself stays defined, in case a
     later screen wants it, only this call is cut. */
  +(show?showNote('story','st-show'):'<div class="st-glow">'
  /* UNI IS THE CHARACTER, AND SHE STANDS ON TOP, 8 November. His words,
     direct: "swap the character in the text field, put the character on
     top." She used to sit under the question, #stsrc, which put the
     ground a person writes toward above her and left her as a tall box
     filling whatever space was left (round TF: "wire in Uni into the
     dashboards. Replace the dashboard small with Uni"). That round still
     holds, the order it put her in does not: #stuni is first in the
     markup now, #stsrc after it, so the character is what a person sees
     first and the ground she answers on sits under her, the same relation
     the Source AI mockup he sent draws (SOURCE_AI_V10_STORY_SIGNALS_LOCAL,
     "Source AI" over the orb). #stuni is still a sibling of #stsrc and not
     a child of it, because #stsrc's own innerHTML is rewritten on every
     keystroke (srcLand/srcPaint above) and a mounted canvas living inside
     that would be destroyed and rebuilt on every key. uniMount is called
     once, after this whole panel lands, at the foot of stRender. */
  +'<div class="st-uni" id="stuni" aria-hidden="true"></div>'
  +'<div class="st-pe" id="stsrc" aria-label="Question"></div>'
  /* WHAT YOU ARE SAYING, WHILE YOU ARE SAYING IT, round of 29 October. His
     words: "I should see my input as I'm talking." Not the reply box, which
     a normal speech conversation has no reason to open (see stMic and
     srcTurnCommit): the words a sentence is still becoming, read straight
     off the speech service's own interim result, shown and gone the moment
     that sentence finalises and lands as a real turn. aria-live so a screen
     reader hears it grow the way a sighted ear does. */
  +(ST_LISTEN?'<p class="src-livecap" id="stlivecap" aria-live="polite">'
    +esc(ST_LIVE||'Listening')+'</p>':'')
  +'</div>'
  /* THE FETTERS LIGHT UP IN THE PERSON'S OWN SENTENCE.

     The sniffer already names every word it is reading and which seat that
     word belongs to, and none of that reached the page: a person watched a
     counter say "14 tagged" with no way to see which fourteen. A textarea
     cannot carry colour, so the highlight is a layer behind it holding the
     same text at the same metrics, and the textarea's own text is
     transparent with only its caret showing. */
  /* TALKING, THE BOX IS A REPLY LINE AND NOT A SECOND ENTRY. The whole entry
     is still ST_TEXT and a reply is appended to it, see srcChatSend, so the
     big box steps aside rather than standing beside a copy of itself, and
     Talk pressed again puts it back holding every reply as its own line. */
  /* IS THIS A CRISIS, TALK IT THROUGH, 16 October (ui/crisis.js). His words:
     "It's always a story." The person chose to talk it through, so the box
     says what it is for in one line above it, until the entry is committed.
     A note and not the box's own text: words put in the box would be read
     and committed as if the person had typed them. */
  /* AND THE WAY BACK TO THE NUMBERS, from the review of these screens: Talk it
     through landed on the full Story page and the three numbers were behind a
     panel that had shut, with no way back to them short of the profile menu.
     Reach someone now stands beside this line and beside Commit while the
     line is up, and opens the same panel on the numbers (crisisReach,
     ui/crisis.js). It is only a door: nothing here reads the box. A sibling
     of the line and not inside it, so the line's own words stay its words. */
  +(STV.crisis&&!STV.chat?'<div class="st-crxrow">'
    +'<p class="st-mask st-crisis" id="stcrisis" role="note">'+esc(CRISIS_SAY.story)+'</p>'
    +crisisReachBtn('st-crxline')+'</div>':'')
  /* THE REPLY LINE IS GONE, round of 29 October, his words: "let's get rid
     of the text field entirely. Get rid of the text field, the arrow plus
     clear. This is going to be a conversation dashboard." #stcin and
     #stcsend stood for typing a reply by hand; there is no hand typed
     reply any more, voice is the only door a turn comes through
     (srcTurnCommit, stMic). srcChatSend(), SRC_CDRAFT and srcChatWire()
     stay defined, reachable only from the legacy !STV.chat box below,
     which this build never renders outside a test forcing that state. */
  /* THE KEYBOARD IS A PANEL NOW AND NOT A SWAP, 9 November. His words: "the
     keyboard starts off closed, and it does not move the screen... fix
     Uni's height and fix the keyboard height." It used to render on
     !STV.chat alone, and STV.chat went false from more than the keyboard
     icon: the crisis flow sets it directly (crisisTalk, ui/crisis.js), and
     tests/srcchat.js's own round-trip check does too, straight at STV.chat,
     never touching STV.typed, and still expects the box. So the condition
     stays !STV.chat, widened rather than replaced: !STV.chat||STV.typed.
     Every existing door that set STV.chat false to reach this box still
     does; the keyboard icon is a second, independent door onto the same
     box, through STV.typed, which stType (below) now owns alone. Pressing
     it no longer touches STV.chat at all, so the thread and Uni stay
     exactly as they were; before this fix it still flipped STV.chat off
     too, which is the reflow he is naming, Uni and the thread swapped out
     for this box. tests/srcchat.js's "Record is there from the start, with
     no toggle and no write box" check is what holds the box absent on
     ordinary arrival (STV.chat true, STV.typed false, neither door open),
     unchanged by this. Uni no longer needing the box's absence to keep her
     own size (her #stflow.st-simple .st-chat .st-uni rule above is a fixed
     height now, not flex-shared) is what makes a conditionally rendered
     box safe to reintroduce here: it can still come and go in the DOM,
     nothing else moves when it does. */
  /* ONLY THE KEYBOARD'S OWN DOOR GETS THE COMPACT HEIGHT. The crisis flow
     reaches this same box through !STV.chat alone, STV.typed untouched,
     and a person talking through a crisis needs the room the box always
     had (min-height:260px), never a 128px strip sized for a mini-view
     keyboard. The 'open' class (and the shell's compact CSS keyed on it)
     is only added when STV.typed is what opened it, so the crisis box's
     own size is exactly what it was before this round. */
  +((!STV.chat||STV.typed)?'<div class="st-ed'+(STV.typed?' open':'')+'"><div class="st-hl" id="sthl" aria-hidden="true"></div>'
    +'<textarea id="sttext" class="st-ta" spellcheck="false" aria-label="The day" '
    +'placeholder="What happened. Write it the way you would say it out loud.">'+esc(ST_TEXT)+'</textarea></div>':'')
  /* WORDS DICTATION HID BEHIND STARS, said under the box they are in, round
     QR. His own story arrived with whole words turned to stars by the speech
     service and nothing on the page said so. The sentence and the rule are
     the engine's (maskedRuns, maskedSay in engine/sniff.js); this is only
     where it is shown. role=note, not a live region: the status line already
     speaks once when a recording brings stars in, see stMic. */
  +'<p class="st-mask" id="stmask" role="note"'+(maskedRuns(ST_TEXT).length?'':' hidden')+'>'
   +esc(maskedSay(maskedRuns(ST_TEXT)))+'</p>'
  /* WHAT WAS READ AND NOT COUNTED, said under the box it is in, S5 of the 9
     October sniffer audit. A word said with a no and a word about someone
     else are drawn set aside in the sentence, and an exclusion nobody can
     read is a silent one. This is the place the page already says what the
     reading cannot use, the stars line above, and it takes the same shape:
     the engine's one sentence (asideOf, asideSay in engine/sniff.js), each
     quote with what "not counted" means beside it, and nothing at all when
     nothing was set aside. It is a sentence and not a count, so it is not
     the counter round HS took off this place. */
  +'<p class="st-mask" id="staside" role="note"'+(stAsideSay()?'':' hidden')+'>'
   +esc(stAsideSay())+'</p>'
  /* THE COUNTER UNDER THE JOURNAL IS GONE. Round HS, his words: "under the
     left window it says two words zero tag get rid of that so it's never
     there" It read "2 words, 0 tagged". The word count is a number nobody
     acts on, and what the sniffer tagged is already shown twice: lit in the
     sentence itself, and counted on the Commit button beside it. Reproduced
     before it was cut, on the blank profile, by typing two words. The spacer
     keeps the two buttons at the right edge where the counter pushed them.
     The prototype this page is ported from put a word count back here, and
     it stays out: the ruling is his and names this exact place. */
  /* COMMIT STANDS WHERE THE BANK IS ON SCREEN, round of 29 October, his
     words: "the commit button should be on the bank." Dashboard shuts the
     bank away in simple mode (his own earlier ruling, "when I land on this
     page it starts off in simple mode"), and a button nobody can reach is
     not moved, it is lost: caught by tests/srcchat.js timing out on a
     hidden #stapply before this read STV.dash. So Commit lives here,
     exactly when there is no bank on screen to carry it (!STV.chat, the
     crisis door's own contract tests/onboarding2.js holds, or
     STV.chat&&!STV.dash, simple mode); the bank carries it itself, below,
     the moment STV.dash opens it. One #stapply at a time, never both,
     never neither.

     CLEAR IS GONE, round of 29 October, the same line as the text field:
     "get rid of the text field, the arrow plus clear." Clear wrote ST_TEXT
     back to empty; there is no hand typed text to clear any more, only
     turns landed by srcTurnCommit, and undo already carries the way back
     past a turn that should not have landed (undoPush, engine/undo.js). */
  +'<div class="st-bar'+(STV.crisis&&!STV.chat?' st-bar-crx':'')+'">'
   /* the second door, at the foot, where the person finishes: see the crisis
      line above. */
   +(STV.crisis&&!STV.chat?crisisReachBtn('st-crxbar'):'')
   /* TYPE INSTEAD, THE BOX ON REQUEST, 4 November. His words: "We should
      probably just add the typing panel, closed, to the bottom of the
      journal. And if a person wants to use it, they can just use it." Since
      29 October the box came back only when voice could not run
      (stVoiceCant), so a person whose microphone works but who would rather
      not speak, in an office or on a train, had no way in. This opens the
      same box, see stType. It is not drawn beside the forced box
      (STV.novoice), where closing it would hand the person back to a voice
      that cannot run, nor beside the crisis door's box, which keeps the one
      door it already has. The label stays the same open or shut, and
      aria-expanded carries which. */
   +(STV.novoice||STV.crisis||!(STV.chat||STV.typed)?''
    /* ICON ONLY, BIGGER, 6 November, his words on this exact screen:
       "instead of type instead, just have the keyboard icon. Make it more
       interesting looking, bigger." The visible label is gone; aria-label
       carries the same words the title already did, so a screen reader
       still hears "Type instead", per the same pattern PR #200 already
       cut this label to an icon with on Discover. 15px to 22px, a heavier
       stroke so it still reads at the larger size. */
    :'<button type="button" class="st-type" id="sttype" aria-expanded="'+STV.typed+'" aria-label="Type instead" title="'
    +(STV.typed?'Close the box. What you typed stays in the entry.':'Open a box to type in, in place of speaking.')+'">'
    +'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">'
    +'<rect x="2" y="5.5" width="20" height="13" rx="2.6"/><path d="M6 10h1M9.5 10h1M13 10h1M16.5 10h1M7 14h10"/></svg>'
    +'</button>')
   /* AN ARROW, NOT THE WORD, 9 November, his words on this exact screen:
      "replace the commit button with an arrow." aria-label carries
      "Commit" so nothing a screen reader hears changes; the count, when
      there is one, stays as a small badge the same way the Archive
      button beside it already carries one (#stvn above), rather than
      vanishing with the word. */
   +(STV.chat&&STV.dash?'':'<span class="st-ct" aria-hidden="true"></span>'
    +'<button class="btn pri st-send" id="stapply" aria-label="Commit'
    +(p&&p.imprints.length?', '+p.imprints.length+' imprints':'')+'"'+(p?'':' disabled')+'>'
    +'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">'
    +'<path d="M5 12h14M13 6l6 6-6 6"/></svg>'
    +(p&&p.imprints.length?'<b class="st-sendn">'+p.imprints.length+'</b>':'')
    +'</button>')
  +'</div>')+'</div>'
  /* THE SECOND ROW UNDER UNI, 10 November: Compass and Boundary, his own
     pairing. Hidden on the mini view by CSS (#stflow.st-simple), the same
     way .st-colb/.st-colz are below, not by leaving it out of the
     string: one render path, one place a reader of this file looks. */
  +'<div class="st-2row">'+stMiniShell('stcompass','Compass',stMiniCompass(r))
   +stMiniShell('stboundary','Boundary',stMiniBoundary())+'</div>'
  +'</div>'
  /* ---- the read column: the instrument, the list, then Commit ----
     SWAPPED BACK, round of 29 October, second pass. The round before this
     one put the list above the chart; looking at it built, his ruling
     reversed: "reverse or swap the location of the analyzing layer and
     the imprints... make sure their associated buttons are with them."
     The analyzing layer is the chart (it reads the lanes), so it goes
     back on top; the pills list goes back under it. Each panel is still
     its own self-contained block, icon row included, so swapping their
     order here is all swapping them takes: nothing moved out from under
     either one's own buttons.

     THE ICONS CANNOT LIVE INSIDE #stlshd ITSELF. stListPaint() owns that
     element and rewrites it, text and all, on every repaint (a sort, a
     vault toggle, a fresh render): anything static put there is gone the
     first time the list repaints. .st-lsico is a sibling wrapper, never
     touched by stListPaint, so the icons are a fixture of the panel and
     not of the list. Same lesson .st-chd already stood on: an element a
     renderer owns is not also a shelf for something else to sit on. */
  /* ---- the chart left this column entirely, 9 November. ----
     His words: "the imprints detector, which takes up the top half of
     that column, now moves to the lower left... near the lower left
     bottom of the left rail." #stch no longer builds here; stImpDetHtml
     and stImpDetMount below build and place it, and ui/stdash.js's own
     rail gives it a host above the Boundary/Compass pair. What stays in
     this flow, the list and Commit, moves in with the release column,
     his own next sentence: "the imprints themselves... shows up to the
     bank. From there, the user can commit those patterns to the bank or
     select a 100 to run immediately. And the release." So .st-colr is
     gone; .st-colx carries both, and keeps the id its rail section had
     for the release half. ANALYTICS PREVIEW AND LAWS NOTICED stay gone
     from it too, round of 29 October, his words: "get rid of the
     analytics preview button... get rid of the laws notice that."
     stAnaHtml() and stLawHtml() stay defined, only the calls here are
     cut; nothing else in the product reached them through this column. */
  /* .st-colx SPLITS IN TWO, 10 November, his words: "I want to do a
     mock-up with the imprints as a third column, release as a fourth
     column... make the uni column and the imprint columns 2 and 3 the
     same width." .st-colb carries the list alone now (the old .st-colr
     name stays retired, see the ruling at .st-colx above, so this is a
     new name and not that one back); .st-colz is Release's own column,
     narrower, width and both set in shell/head.html's flex rules and
     not here. */
  +'<div class="st-colb">'
  +'<div class="st-pan st-ls" id="stls" aria-label="Imprints, listed">'
   /* BANK AND VAULT ON THE LEFT, COMMIT ON THE RIGHT, 9 November, his
      words: "move the bank and the vault icons to the left-hand side of
      that menu bar, and then move the commit button to the upper
      right-hand corner of that menu bar, and change the word commit to
      bank." One row now holds all three: the two icon buttons keep their
      left-hand place (.st-lsico's own default flex order), and #stapply
      joins them with margin-left:auto (shell/head.html) to land at the
      row's far right, the "upper right-hand corner" of this card's own
      top. It keeps the id stRender's wire-up and stPaintAll's disabled
      state already find it by; only its row and its word moved. */
   +'<div class="st-lsico">'
   /* THE BANK AND THE VAULT, round IG, his words: "We need to be able to see
      the bank as an icon, which goes to the main imprints page. And the
      vault, which is what's been released." Both were icons with their word
      beside them at 1600 and the icon alone on a phone. Round LO took the
      word off at every width, his words: "for the bank and the vault, I just
      want their icons only, not the text." The word is still in the button,
      clipped the way a folded tab's name is, so a screen reader still hears
      it; .st-lb in the shell does it. The vault keeps its count, which is a
      figure and not a label, as it always has on a phone. */
   +'<button type="button" class="st-ico" id="stbank" aria-pressed="'+STV.bank+'" '
    +'title="Imprints: every one you hold, to select what you release">'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.5L12 4l9 5.5M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20.5h18"/></svg>'
    +'<span class="st-lb">Imprints</span></button>'
   +'<button type="button" class="st-ico" id="stvault" aria-pressed="'+(STV.list==='vault')+'" '
    +'title="Archive: what you have released">'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5h16v14H4zM7 18.5v2M17 18.5v2"/>'
    +'<circle cx="12" cy="11.5" r="3.6"/><path d="M12 7.9v1.2M12 13.9v1.2"/></svg>'
    +'<span class="st-lb">Archive</span><b id="stvn">\u2013</b></button>'
   /* "COMMIT" READS "BANK" HERE, his word for the action, not only the
      place: putting an imprint away is banking it. #stapply stays the
      one id this column's wiring and stPaintAll's disabled state find;
      the !STV.dash and !STV.chat button in .st-bar above (a different
      element, same id, mutually exclusive with this one) keeps the word
      "Commit", since this rename is for this card specifically. */
   +(STV.chat&&STV.dash?'<button type="button" class="btn pri st-lsbank" id="stapply"'+(p?'':' disabled')+'>'
    +'Bank'+(p&&p.imprints.length?' '+p.imprints.length:'')+'</button>':'')
   +'</div>'
   /* SORT MOVED INTO THE BANK, round of 29 October, his words: "sort,
      weight, charge, etc., belongs in the bank menu." It sorts the list
      directly below it (and the chart with it, one lane model for both,
      see stLaneModel), so its new seat is the list panel's own menu row
      rather than the chart's. Same id, same wiring, stSortPaint finds it
      by id wherever it stands. */
   +'<div class="st-sort" id="stsort" role="group" aria-label="Sort imprints by"></div>'
   +'<div class="st-lshd" id="stlshd"></div><div class="st-lsb" id="stimps"></div></div>'
  /* BODY AND FIELD, under the bank, his pairing. Same stMiniShell every
     other mini picture here uses, same compute() reading. */
  +'<div class="st-2row">'+stMiniShell('stbody','Body',stMiniBody(r))
   +stMiniShell('stfield','Field',stMiniField(r))+'</div>'
  +'</div>'
  +'<div class="st-colz">'
  +'<div class="st-rl" id="strel" aria-label="Release"></div>'
  /* AVATAR, under Release, alone: his fifth picture, one per column
     this round, three columns, five pictures, Avatar the only one
     without a partner beside it. */
  +'<div class="st-2row st-2row-1">'+stMiniMasks(r)+stMiniShell('stavatar','Avatar',stMiniAvatar(r))+'</div>'
  +'</div>'
  /* CLOSES .st-flow ITSELF, opened at the top of this function; lost for a
     moment in the 9 November edit that folded .st-colr's own closing div
     into .st-colx's, caught by BUILD.sh's own div-balance check. */
  +'</div>'
  /* WHAT A SCREEN READER HEARS IS WHAT SOURCE AI SAYS, ONCE. The column is
     rewritten on every keystroke, so a live column would read itself aloud
     at every letter. One hidden line carries only the question, the "Cool."
     or the opener, and srcPaint writes it only when it changes. */
  +'<p class="src-say" id="srcsay" aria-live="polite"></p>';
 h.innerHTML=out;
 /* THE LANES AND THE BARS OUTLIVE A RENDER. This emptied both, so every
    arrival at the tab and every redraw of the page faded all seven lanes in
    and grew every bar again from the floor: motion that said a word had
    landed when none had. It also cost frames: measured in the design gate's
    Chromium under Glass white, 23 frames in 1.2 seconds with the chart
    replaying against 36 with it still, which left the lighting's own
    transition half done when the gate read it. Only what is new moves now. */
 STC.cv=null; STC.dirty=true;
 /* MEASURED BEFORE ANYTHING IS LAID OUT ON IT. setTab shows the host before
    it calls this, so the canvas has its size the moment it exists. Left to
    the resize observer, the first layout ran at a height of nought and every
    lane sprang in from above the chart on each arrival at the tab. */
 stSize();
 ST_ACTIVE=typeof srcHyperSeats==='function'?srcHyperSeats(compute()):null;
 stRead(); stSortPaint();
 /* the live dot's own lock call is gone with the dot, round of 29 October */
 srcLock(h.querySelector('.st-glow'));
 var ta=document.getElementById('sttext');
 if(ta){ta.oninput=function(){ ST_TEXT=ta.value;
  ST_PARSED=ST_TEXT.trim()?parseStory(ST_TEXT):null; stRefresh(); };
  /* the layer behind has to travel with the text, or a long entry drifts
     out of register the moment the box scrolls. */
  ta.onscroll=function(){var hl=document.getElementById('sthl');
   if(hl){hl.scrollTop=ta.scrollTop;hl.scrollLeft=ta.scrollLeft;}};
  ta.onfocus=function(){stFocus('write');};}
 stPaintHL();
 stPaintAll();
 stWire();
 stAnaWire();
 stLawWire();
 var ap=document.getElementById('stapply');
 /* srcChatSend() used to run first here, sending a reply still sitting in
    the typed box before Commit read the entry; the box is gone (see the
    ruling at .st-bar above) and there is nothing left for it to send. */
 if(ap)ap.onclick=stCommit;
 var mic=document.getElementById('stmic');
 /* ONE ICON CARRIES BOTH DOORS, 10 November. His words, naming the hero
    view's only two icons, the talk bubble and Dashboard: "I do want the
    ability to type in case I want to. But that is minimized when I
    start," with no third icon for it (his own answer, asked straight,
    to "how should someone open the type box if the keyboard icon is not
    one of the two icons" -- "fold into the talk bubble"). A tap still
    talks (stMic, unchanged). A press held past stHoldMs opens the same
    box stType already owns, never both: held._open marks that this
    press already decided, so the click a held pointerup still fires in
    every browser does not also call stMic and start listening on top of
    the box that press just opened. */
 if(mic){
  mic.onclick=function(e){ if(held._open){ held._open=false; e.preventDefault(); return; } stMic(); };
  var held={t:null,_open:false}, stHoldMs=480;
  var holdGo=function(){ held.t=setTimeout(function(){ held.t=null; held._open=true; stType(); },stHoldMs); };
  var holdStop=function(){ if(held.t){ clearTimeout(held.t); held.t=null; } };
  mic.addEventListener('pointerdown',holdGo);
  mic.addEventListener('pointerup',holdStop);
  mic.addEventListener('pointerleave',holdStop);
  mic.addEventListener('pointercancel',holdStop);}
 var ty=document.getElementById('sttype');
 if(ty)ty.onclick=stType;
 /* DASHBOARD TOGGLES, ON THIS SCREEN, round of 29 October. His words: "when
    I land on this page it starts off in simple mode... if I press it
    dashboard icon is lit up." It no longer leaves the Journal for the
    Avatar tab; it shows or hides the real Imprints and Release columns
    already built beside it, nothing invented. stRender() repaints the
    whole flow, so the hidden columns' own content stays current under
    .st-flow.st-simple's display:none the moment Dashboard opens them.

    AND IT TOGGLES THE FULL VIEW'S TWO RAILS, ruled 2 November, his words:
    "use a left menu and the right menu." The body's st-full class says the
    Journal is in Full, and the shell reads it to give #lcol back to this tab
    with #stleft in it (ui/stdash.js). The class is written at the head of
    stRender from STV.dash and nowhere else, so this press, a return to the
    tab and a profile change all leave it agreeing with the flow's own
    st-simple: STV.dash outlives a tab change, and a class set only here
    would have been gone from a person who left in Full and came back. */
 var dash=document.getElementById('stdash');
 if(dash)dash.onclick=function(){STV.dash=!STV.dash; stRender();};
 srcChatWire();
 /* round TF: mount her fresh into the container this render just built, a
    worked example gets none (show only, nothing she would react to is the
    person's own), TAB.STORY's own leave in panels.js parks her. */
 if(!show){var un=document.getElementById('stuni');
  if(un&&typeof uniMount==='function'){uniMount(un); uniApply(ST_PARSED);}}
 else if(typeof uniPark==='function')uniPark();}

/* ============================================================
   THE PAGE'S OWN STATE. None of it is a reading: which way the lanes are
   sorted, which column has the room, which list is up, and whether the bank
   is open. Kept across a return to the tab, never saved.
   ============================================================ */
/* CHAT IS ALWAYS TRUE NOW, round of 28 October, his words: "the focus needs
   to be on two-way conversation for the journal ... this needs to be a
   two-way conversation between me and the source." The Talk button that
   used to toggle it is gone, see stWire. Three things still set it false:
   the crisis door (crisisTalk, ui/crisis.js), a browser on which voice
   cannot run at all (stVoiceCant, STV.novoice), so a person always has a
   way to say something, and a person who would rather type (stType,
   STV.typed). */
/* DASHBOARD STARTS OFF, round of 29 October, his words: "when I land on this
   page, it starts off in simple mode." Imprints and Release are real panels,
   not removed, only shut until Dashboard is pressed; see #stdash's onclick
   at the foot of stRender.
   THE SORT OPENS ON WEIGHT, 6 November, his words on this exact screen:
   "for imprints, for a sort, just do it by weight." Was Seat. */
var STV={sort:'weight',focus:'write',list:'entry',bank:false,lastFound:[],lastT:null,hot:null,view:'lanes',ana:false,chat:true,law:false,
 unsaved:null,draftT:null,draftFail:false,crisis:false,dash:false,novoice:false,typed:false,lastOpen:false};
/* THE IMPRINTS DETECTOR, PORTED TO THE LEFT RAIL, 9 November. His words:
   "the imprints detector, which takes up the top half of that column,
   now moves to the lower left... near the lower left bottom of the left
   rail." This is the one piece of the old .st-colr that still needs its
   own markup built here (the chart's wiring, stSize/stRelayout/stFrame/
   stWire, all stay in this file): ui/stdash.js's rail cannot build a
   canvas that has to keep the springs this file already keeps running
   in STC, and should not have to know how.

   WHY A MOUNT FUNCTION AND NOT A STRING, the way the rest of the rail
   works. ui/stdash.js's own left rail is rebuilt whole, h.innerHTML=o,
   on every keystroke (stDashLeft, called through stPaintAll below, same
   as stRefresh's path on every character typed). A plain string placed
   in that rebuild would tear the canvas out and rebuild it fresh each
   time, and this one carries real state a fresh node does not: a
   ResizeObserver (stWire, below), two pointer listeners, and the lane
   springs' own continuity depends on stFrame finding the same connected
   canvas across frames, not a new one appearing every keystroke. So
   stdash.js's rail carries only an empty slot, #st-impdet-host, and
   this function either builds #stch into it once or, every other time,
   moves the one already live there with appendChild, which relocates a
   node in the document without destroying it: same canvas, same
   listeners, same observer, new parent. */
function stImpDetHtml(){
 /* THE WORD IS GONE, 9 November, his words: "just get rid of the word
    imprints up entirely." stMark was the icon-plus-word eyebrow; the
    section's own aria-label ("Imprints, as read") still carries the name
    for a screen reader, so nothing here loses its name, only its visible
    caption. #stpend (the pending count) and the view toggle stay: both
    are real controls, not a label repeating what the figure already
    shows. */
 return '<div class="st-pan st-ch" id="stch" aria-label="Imprints, as read">'
  +'<div class="st-chd"><span class="st-tag" id="stpend"></span>'
  +stViewHtml()+'</div>'
  /* the key probe is never shown. The canvas cannot read a custom property,
     so the chart reads the lighting's ink and dim off these two computed
     colours, which is the one answer that follows every lighting. */
  +'<div class="st-cvw" id="stcvw"><canvas id="stcv" aria-hidden="true"></canvas><i class="st-cvk"></i></div></div>';}
function stImpDetMount(){
 var host=document.getElementById('st-impdet-host'); if(!host)return;
 var ex=document.getElementById('stch');
 if(ex){ if(ex.parentNode!==host)host.appendChild(ex); }
 else{ host.insertAdjacentHTML('beforeend',stImpDetHtml()); stSize(); }}
/* the one width the page changes shape at is the one the product stacks its
   columns at, so the Story cannot be in three columns while the rails are
   already one. */
function stPhone(){return typeof innerWidth==='number'&&innerWidth<=1180;}
function stFocus(f){
 if(STV.focus===f)return; STV.focus=f;
 var fl=document.getElementById('stflow'); if(fl)fl.setAttribute('data-focus',f);}
function stWire(){
 var on=function(id,ev,fn){var e=document.getElementById(id); if(e)e.addEventListener(ev,fn);};
 /* FOCUS FOLLOWS THE LOOP, layout H. Typing is write, touching the imprints
    is read, touching the release is release. Every column stays on screen;
    the one being worked in takes the room. Run itself is excluded, because
    widening the panel under a press moves the button the finger is on.

    ON CLICK, NOT ON POINTERDOWN, which is where the prototype had it. Stacked,
    a focus change reflows the column: the journal shrinks and everything
    under it rises. Changed on pointerdown, the Vault moved up between the
    press and the release and the click landed on the chart instead, measured
    at 390 by 844: Vault pressed, the list stayed on the entry. A click
    bubbles here after the button has already acted. */
 on('stch','click',function(){stFocus('read');});
 on('stls','click',function(){stFocus('read');});
 on('strel','click',function(e){if(!(e.target&&e.target.closest&&e.target.closest('#strun')))stFocus('release');});
 on('stlist','click',function(){stFocus('read');});
 on('stbank','click',stBank);
 /* the press bubbles on to #stch, which gives the imprints column the room.
    THE VIEW ICONS MOVED TO .st-chd, round of 29 October (see the ruling at
    stRender above): [data-view] on its own still finds the one group that
    exists on the page, wherever it stands. */
 document.querySelectorAll('[data-view]').forEach(function(b){
  b.addEventListener('click',function(){stView(b.getAttribute('data-view'));});});
 on('stvault','click',function(){
  STV.list=STV.list==='vault'?'entry':'vault';
  this.setAttribute('aria-pressed',STV.list==='vault');
  stFocus('read'); stListPaint();});
 var cv=document.getElementById('stcv');
 if(cv){
  /* the hover reads the sorted lanes' rows, which only the Lanes view draws.
     Over the Ring or the Strip the same height is a different seat, so it
     would light the wrong group in the list. */
  cv.addEventListener('pointermove',function(e){if(STV.view!=='lanes'){stHot(null);return;}
   var r=cv.getBoundingClientRect(),y=e.clientY-r.top,k=null;
   STC.lm.lanes.forEach(function(l){var o=STC.lane[l.key];if(o&&l.active&&y>=o.y&&y<o.y+o.h)k=l.key;});stHot(k);});
  cv.addEventListener('pointerleave',function(){stHot(null);});}
 var w=document.getElementById('stcvw');
 if(w&&typeof ResizeObserver==='function'){
  if(STC.ro)STC.ro.disconnect();
  STC.ro=new ResizeObserver(function(){stSize();stRelayout();});
  STC.ro.observe(w);}}

/* ============================================================
   THE BANK OPENS THE IMPRINTS PAGE, and the Imprints page is the one this
   product already has: impRender's record in #imp, every imprint held, the
   five groupings, the child patterns, and the pills a person selects to
   release. It lives in the right rail's Imprints section, where it has been
   since GO, beside Selection, where its Detail opens a drill. On the Story
   that rail steps aside so the three columns get its width, and the bank
   brings it back.

   WHAT IS PICKED THERE IS WHAT THE RELEASE RUNS. His words, round IG: "In
   that imprints I can select what I want to be released and then I've got
   my settings for release, then I can run release." So a pill pressed in the
   bank feeds the release column directly, see stRelModel.
   ============================================================ */
function stBank(){
 STV.bank=!STV.bank;
 document.body.classList.toggle('st-bank',STV.bank);
 var b=document.getElementById('stbank'); if(b)b.setAttribute('aria-pressed',STV.bank);
 if(STV.bank){
  if(typeof OPENSEC==='object'&&OPENSEC&&OPENSEC.right)OPENSEC.right.simp=1;
  if(typeof paintSections==='function')paintSections();
  impRender();
  /* stacked, the rail sits under the whole surface, so the bank is taken to
     rather than left for a person to find four screens down */
  var sec=document.querySelector('.lsec[data-sec="simp"]');
  if(sec&&stPhone()&&sec.scrollIntoView)sec.scrollIntoView({block:'start'});}
 stFocus('read');}

/* ============================================================
   THE ONE READ. Every surface on this page reads the same marks off the
   same text, so the sentence, the chart and the list cannot disagree about
   which words were scored.

   A WORD SAID WITH A NO IS SHOWN AS SET ASIDE, AND IT IS SET ASIDE. Round
   HX drew "I was not scared" struck while parseStory still charged it, and
   showed that disagreement rather than pick a side. Package S1 of
   REVIEW-sniffer-audit-2026-10-09.md picked: the engine flags the word
   denied and counts it nowhere, and this reads that flag off marksOf, neg
   and negFrom, and works nothing out again. It used to call srcNegated
   itself over the path, a second reader of one rule, which is how the
   picture and the score came to disagree. The mark still runs back over its
   no and is struck, and the bar is still dashed. */
var STR={t:null,marks:[],toks:[],heard:null};
/* THE SEATS A DRIVEN HYPER COMPLEX ACTUALLY SITS ON RIGHT NOW, read off the
   committed profile, never the live draft: compute() only ever reflects
   S and W as they stand after the last commit, so this is computed once a
   full stRender(), not on every key in stRefresh()/stRead(), which would
   cost a real compute() a keystroke for a number that cannot have changed
   since the last commit anyway. srcHyperSeats lives in engine/sourceai.js. */
var ST_ACTIVE=null;
function stMarks(t,p){
 if(!p||typeof marksOf!=='function')return [];
 var marks=marksOf(t,p), nm=normMap(t), modAt={};
 if(!marks.length)return [];
 storyHits(p).forEach(function(h){if(!h.mod)return;var a=nm.map[h.at+1];if(a!=null)modAt[a]={f:h.mod,w:h.modw};});
 /* a curly apostrophe, the mark a phone's own autocorrect writes, used to
    split "don't" into two tokens and leave the strike-through short of the
    negator. The class matches NORM_APOS (engine/sniff.js), the same marks
    normMap already treats as one. */
 var toks=[],re=/[A-Za-z'‘’]+/g,m; while((m=re.exec(t)))toks.push({s:m.index,e:m.index+m[0].length,w:m[0]});
 var seen={};
 marks.forEach(function(k){
  /* neg, negFrom, other and whoFrom are marksOf's, the engine's flags, and are
     not touched. oth is someone else's word, S2, drawn set aside and not
     struck, because it is not a no. aside is either, and is what the chart
     reads: a word read and not counted is drawn dashed, whichever it was. */
  k.txt=t.slice(k.s,k.e); k.neg=!!k.neg; k.oth=!!k.other&&!k.neg; k.aside=k.neg||k.oth; k.mod=modAt[k.s]||null;
  var base=(k.bn||'coh')+':'+k.txt.toLowerCase(); seen[base]=(seen[base]||0)+1; k.key=base+':'+seen[base];
  k.depth=k.amt!=null?Math.min(1,Math.abs(k.amt)/PATHMAX):0.3;
  k.t0=-1; k.t1=-1;
  toks.forEach(function(o,j){if(o.s>=k.s&&o.e<=k.e){if(k.t0<0)k.t0=j;k.t1=j;o.m=k;}});});
 marks.toks=toks;
 return marks;}
function stRead(){
 var t=ST_TEXT, ents=(CURP&&CURP.story&&CURP.story.entries)||[];
 var marks=stMarks(t,ST_PARSED);
 STR={t:t,marks:marks,toks:marks.toks||(t?(t.match(/[A-Za-z']+/g)||[]).map(function(w){return {w:w};}):[]),
  heard:srcHear(t,srcPrior(ents),ST_ACTIVE)};}
/* ============================================================
   THE ENTRY srcSafe STOPS, 17 October (engine/safe.js). True while the words
   in the box trip it, and after Commit of words that did, until the person
   starts the next entry. The second is STV.safeSaid, page memory and
   nothing else: it is not on the record, the draft, the entry, the export
   or the outbox, so a reload forgets it and nothing about it can leave the
   device. The engine already reads the words as nothing; this is only what
   the page draws in place of the release and the question. Emmy's ruling,
   17 October: the entry is saved as written, no modal, no sound, no red, no
   "we noticed", one line and one door, once, and nothing escalates if it is
   left alone. The release column stays reachable and is not offered. The
   no sound part was lifted for the line alone by the owner on 3 November:
   in the spoken conversation Source AI says it, once, see srcPaint.
   ============================================================ */
function stSafe(){
 var t=ST_TEXT||'';
 return t.trim()?srcSafe(t):!!STV.safeSaid;}
/* the addresses this entry reaches, or the last committed entry's.
   THE ONES THE WORDS NAMED COME FIRST, and .named says how many of the head of
   the list they are, 17 October. parseStory reaches two kinds of address: the
   ones the person's words chose, and the ones it fills a seat with when the
   seat was read and no feeling named one (inferred, engine/sniff.js, whose own
   rule is that such a name is never printed as a finding). The split rides on
   the list so STV.lastFound keeps it once the parse is cleared at commit;
   stRelModel says what losing it cost. */
function stFound(){
 /* nothing off an entry srcSafe stops, and not the last entry's either: the
    fall back below put an earlier entry's places in the release column
    beside these words, which is a release offered on them by another door */
 if(stSafe())return [];
 var found=[], named=0;
 [false,true].forEach(function(inf){
  if(ST_PARSED)ST_PARSED.imprints.forEach(function(im){var n=BY[im.node];
   if(!!im.inferred===inf&&n&&n.cf&&found.indexOf(n)<0)found.push(n);});
  if(!inf)named=found.length;});
 found.named=named;
 return found.length?found:STV.lastFound;}

/* THE REAL COMMIT, FACTORED OUT OF THE APPLY BUTTON'S OWN ONCLICK, round NF,
   so the Day One Tutorial can write a person's first entry through the exact
   same path the Story tab's own button uses rather than a second copy of it.
   Two writers for one commit is the same mistake setTab's own history
   warns against, a thing read in one table and written from two; this is one
   function, called from both. Returns what happened rather than only acting,
   so a caller that is not the button itself (the onboarding's commit) can
   act on a real result instead of re-deriving it. */
function stCommit(){
 /* AN ENTRY THAT READS AS NOTHING IS STILL THE PERSON'S OWN WORDS, round NZ,
    21.I1. This used to refuse the whole commit whenever the sniffer found no
    imprint, which is a UI gate and not the boundary: validateProfile already
    accepts an entry with imprints:0 and empty bands (engine/schema.js). Four
    of his own example sentences measured nothing here, "I keep putting off
    the conversation" among them, and the Day One tutorial ran this same
    path, so a first entry exactly like one of his own examples was dropped
    on day one while the card beside it said "it is not a problem with what
    you wrote." The TDDs this product is built from rule it directly: "the
    user's original words are evidence" and "unknown is a valid result." Kept
    now, with no charge written and no reading moved, and said so below. */
 if(!ST_PARSED||!ST_TEXT||!ST_TEXT.trim())return {ok:false,why:'empty'};
 /* AND A STORY CANNOT BE COMMITTED ONTO A WORKED EXAMPLE, for the same reason
    the release cannot be run on one: the words are the person's and the field
    is not. This wrote the charge onto the case's field, pushed the entry onto
    the case's record, and then called toYou() on the last line, which moves
    the pointer to the person's own record. So the entry landed in a record the
    person does not own, the charge landed on a field they were about to leave,
    and the undo for it stayed with the example. While the persona loader was
    pushing its scratch profiles onto PROFILES that entry was then written into
    the person's own store, which is the leak ui/personas.js now refuses; with
    that closed the same press would keep nothing at all and say nothing about
    it. Refusing is the version that is true, and it is the wording the release
    already uses for the same crossing. That wording is one line since BA9, 25
    September: he struck the long form above the Field, and the state it
    carried is on the profile picker now. */
/* AND IT IS THE ENGINE'S ONE RULE NOW, ruled 16 October: a worked example is
    show only (engine/showonly.js). showRefuse is the same question S.who
    asked, by the record's identity, and its reporter says what Commit would
    do on the person's own profile in place of the wall this was. */
 if(showRefuse('story'))return {ok:false,why:'example'};
 /* asked of the words, not of the page, so the tutorial's and the first
    run's commits through here are held the same way (stSafe, above) */
 var safe=srcSafe(ST_TEXT);
 var kept=safe?[]:stFound(), k=ST_PARSED.imprints.length, bands=ST_PARSED.bands;
 /* A PRESS AFTER THE BROWSER REFUSED THE LAST ONE ASKS IT AGAIN, AND WRITES
    NOTHING TWICE. A refused save leaves the entry in this session and the
    words in the box (below), so the same words pressed again are the same
    entry: applying them again would put a second entry on the record and the
    charge on the field twice. Keyed on the refused entry's date and its exact
    words, so a story that is typed again on purpose another time is a new
    entry, as it always was. */
 var es0=(CURP&&CURP.story&&CURP.story.entries)||[], last=es0[es0.length-1];
 var again=!!(STV.unsaved&&last&&last.t===STV.unsaved&&last.text===ST_TEXT);
 /* NO READING MOVES ON AN ENTRY THAT FOUND NOTHING, 21.I1. applyStory also
    pulls every charge down on coherent language even when k is 0, so calling
    it here would still move the field on words the sniffer read as nothing
    in particular. The entry is kept; the field is not touched at all, and
    undoPush only runs for the branch that can actually be undone. */
 if(k&&!again){
  /* the field is about to change and until now there was no way back */
  undoPush('committing the story');
  applyStory(ST_TEXT); applyStoryAddr(ST_TEXT); verpApply(ST_TEXT); leanApply(ST_TEXT);
  /* THE CHARGE HAS TO REACH THE MIRROR, OR THE NEXT VISIT TAKES IT BACK OUT.
     applyStory writes S and pSave writes the record, and neither writes
     PEOPLE[0], which is the table loadP(0) reads the person's field back out
     of. This was the one write of charge in the product that skipped saveYou.
     Measured: 7.24 units committed and on disk, a visit to James and back
     through the picker read 0.00 out of the stale mirror, saveProfile put 0.00
     on the record, and the next ordinary save wrote 0.00 over the disk. The
     entry text survived and the charge it wrote did not. S.who is 0 here, the
     guard above sees to it, so this mirrors and writes the way every slider
     does. */
  saveYou();}
 var entT=null, saved=true;
 if(CURP){CURP.story=CURP.story||{entries:[]};
  if(again)entT=last.t;
  else{
  /* lex, the lexicon that read it, 19.B6, so a later reading can say whether
     it is reading these words the way they were read at the time. asked,
     what Source AI asked while it was written, 20.H5: a kind and a seat for
     each, and what the person did next. Never the words of a question. */
  var ent={t:new Date().toISOString(),text:ST_TEXT,
   imprints:ST_PARSED.imprints.length,bands:ST_PARSED.bands,lex:LEX_VERSION};
  var asked=srcAsked(SRC_LOG,ST_TEXT.length);
  if(asked.length)ent.asked=asked;
  CURP.story.entries.push(ent);
  /* the entry's identity, handed back so a release planned off this entry can
     name it on the answer to What changed (relPick's from). STV.lastT sits
     beside STV.lastFound because they are one fact: what the last commit
     found, and which entry found it. */
  entT=ent.t;}
  /* the draft these words were is taken off in the same write that puts the
     entry on, so a reload never offers back a story already committed. Only
     when it is these words: onboarding commits its own text through here,
     and a half written story waiting on the Story page is not its to clear. */
  var wasDraft=CURP.story.draft===ST_TEXT;
  if(wasDraft)delete CURP.story.draft;
  /* Commit always sends whatever is in the reply line first (see ap.onclick
     below), so by the time an entry is pushed SRC_CDRAFT is already empty;
     this only clears what a reload might still be holding from before. */
  if(CURP.story.reply!==undefined)delete CURP.story.reply;
  stDraftStop();
  /* THE COMMIT SAID "Committed" WHETHER OR NOT ANYTHING WAS SAVED, pass 4,
     probe 6. pSave's answer was dropped, so with a store that refused every
     write the line read "Committed. 4 imprints written to the field." and a
     reload took the entry, the meter and the evidence away. The answer is
     read now and nothing below claims what it did not get. */
  saved=pSave();
  /* AND THE DEBOUNCED WRITE saveYou SET GOING ABOVE IS THIS SAME WRITE.
     persistNow writes CURP after saveProfile, which is what pSave just did, so
     the timer could only write it again; and on a refusing store it fired 400
     ms after this line and put its own "Not saved. Error." over the commit's
     report, which is the line probe 6 then read off the release. */
  if(typeof YOU_T!=='undefined'&&YOU_T){clearTimeout(YOU_T);YOU_T=null;}
  if(saved){pSnap(); STV.unsaved=null;}
  else{ STV.unsaved=entT; if(wasDraft)CURP.story.draft=ST_TEXT; }}
 /* NOT SAVED: THE ENTRY STAYS IN THIS SESSION AND THE WORDS STAY IN THE BOX.
    The same answer relAnswer and obCommit give a refused save, the write kept
    in memory and said to be off the record, so onboarding's first run still
    reaches its release in a browser that keeps nothing. What this adds is the
    box: clearing it would leave the person's words only in an entry a reload
    throws away, and the words are the one thing here that cannot be made
    again. A press on the same words asks the browser again, see again above. */
 if(!saved){
  STV.lastFound=kept; STV.lastT=entT; STV.lastOpen=!!kept.length;
  toYou();syncCh();if(typeof stRender==='function')stRender();render();
  status('This browser would not save. The entry is on this page and not on your record. '
   +'Your words are still in the box, so copy them before you reload.','fail');
  return {ok:true,k:k,kept:kept,bands:bands,text:ST_TEXT,t:entT,saved:false};}
 /* a new entry is a new conversation, so moving on from the last one does
    not silence the next. */
 var text=ST_TEXT;
 ST_TEXT='';ST_PARSED=null;SRC_PASSED=false;if(typeof srcFresh==='function')srcFresh();STV.lastFound=kept;STV.lastT=entT;STV.lastOpen=!!kept.length;
 /* the line stays where it was once the box empties, see stSafe */
 STV.safeSaid=safe;
 /* the release takes the room on a desktop. On a phone it stays the bar
    with Run on it: widening it there would push Run off the first screen,
    which is the one thing layout H exists to stop. Not after an entry
    srcSafe stopped: the page does not walk a person to a release on it. */
 STV.focus=(stPhone()||safe)?'write':'release';
 /* the crisis line has said what the box is for, and the box has been used.
    crisisTalk forced STV.chat false on the way in, deliberately, so a crisis
    is met in the plain box and not inside a chat bubble; nothing used to set
    it back since the Talk button did that by hand. With Talk gone the
    conversation is the Journal's only normal state, so a finished crisis
    entry returns to it here rather than staying stuck in the write box with
    no way back. */
 /* A box opened by Type instead shuts with the entry it held, so the next
    one starts in the conversation, which is the Journal's own state; only
    the forced box stays (STV.novoice). Not on a refused save above: that
    line says the words are still in the box, so the box stays to hold them. */
 STV.crisis=false; STV.typed=false; STV.chat=!STV.novoice;
 toYou();syncCh();if(typeof stRender==='function')stRender();render();
 /* A STORY KEPT WITH STARS IN IT SAYS SO, round QR. The person may choose
    not to type the hidden words, and the entry is still theirs; it is kept
    as it stands. What the line may not do is report the commit as if every
    word had been read. */
 var hid=maskedRuns(text).length;
 /* an entry srcSafe stopped is reported as kept and nothing else: the line
    beside it already says so, and "nothing read as charge" would be a claim
    about the words. And no sound, Emmy's ruling: a chime is a reward. */
 status((safe?'Kept.':k?'Committed. '+k+(k===1?' imprint':' imprints')+' written to the field.'
  :'Kept. Nothing here read as charge, so nothing moved.')
  +(hid?' '+hid+(hid===1?' word':' words')+' hidden behind stars by dictation could not be read.':''));
 if(!safe&&typeof sfx==='function')sfx('kept');
 return {ok:true,k:k,kept:kept,bands:bands,text:text,t:entT,saved:true};}

/* ============================================================
   THE DRAFT IS KEPT ON THE RECORD, the way the first run keeps its own
   (engine/journey.js, the walk's text; ui/onboard.js, obDraft). Pass 4 typed
   106 characters on the Story page, reloaded, and the box was empty: TDD
   section 47, "No user input should be silently discarded."

   It sits on the person's own record beside the entries it will become, so
   deleting the record deletes it, and it is checked at the boundary as the
   string it is (engine/schema.js). The record copy follows the box the moment
   the text changes, so a redraw inside the half second never brings back
   words that were just deleted; only the write waits, half a second after
   the last change, as obDraft does. A worked example is not a record and is
   never written. Commit and Clear take it off.

   THE REPLY LINE CARRIES THE SAME PROMISE NOW, round of 28 October. Before
   this a reply typed into #stcin but never sent lived only in SRC_CDRAFT, a
   variable, so closing the tab mid-reply lost it the way a half written
   story used to. It is the one timer below and the one write, on
   CURP.story.reply beside CURP.story.draft, so a reload or a tab closed
   inside the half second keeps whichever box had words in it, or both. */
function stDraft(){
 /* never one person's words onto another's record: a voice turn that lands
    after the picker moved is not the open record's (ST_OWN, ui/imprints.js) */
 if(!stMine())return;
 if(CURP)ST_OWN=CURP;
 if(!CURP||!CURP.story||(typeof S!=='undefined'&&S.who!==0))return;
 var v=(ST_TEXT&&ST_TEXT.trim())?ST_TEXT:null,
  r=(typeof SRC_CDRAFT==='string'&&SRC_CDRAFT.trim())?SRC_CDRAFT:null, moved=false;
 if((CURP.story.draft||null)!==v){ if(v===null)delete CURP.story.draft; else CURP.story.draft=v; moved=true; }
 if((CURP.story.reply||null)!==r){ if(r===null)delete CURP.story.reply; else CURP.story.reply=r; moved=true; }
 if(!moved)return;
 stDraftStop(); STV.draftT=setTimeout(stDraftSave,500);}
function stDraftStop(){ if(STV.draftT){clearTimeout(STV.draftT); STV.draftT=null;} }
/* a refusal is said once until a save lands again, because a line on every
   pause in typing would bury the box it is about */
function stDraftSave(){
 stDraftStop();
 var ok=pSave();
 if(!ok&&!STV.draftFail&&typeof status==='function')
  status('This browser would not save. Your words are in the box and not on your record, so copy them before you reload.','fail');
 STV.draftFail=!ok;}
/* the half second is a debounce with no flush, so a tab that closes or reloads
   inside it loses the sentence the person was in, and never says so: the write
   never reaches the store at all. The same flush ui/personas.js carries. */
if(typeof addEventListener==='function')['pagehide','visibilitychange'].forEach(function(ev){
 addEventListener(ev,function(){ if(STV.draftT)stDraftSave(); });});
/* back into the box when the box is empty, which is a reload or a commit of
   somebody else's words through stCommit. The two halves are independent: a
   reload can find words waiting to be sent, words already sent and not yet
   committed, both, or neither. */
function stDraftBack(){
 if(!stMine())return;
 if(!CURP||!CURP.story||(typeof S!=='undefined'&&S.who!==0))return;
 if(!ST_TEXT&&typeof CURP.story.draft==='string'){
  ST_TEXT=CURP.story.draft; ST_PARSED=ST_TEXT.trim()?parseStory(ST_TEXT):null; ST_OWN=CURP;}
 if(!SRC_CDRAFT&&typeof CURP.story.reply==='string'){SRC_CDRAFT=CURP.story.reply; ST_OWN=CURP;}}
/* THE OPEN RECORD CHANGED UNDER THE JOURNAL, 3 November. Called at the head
   of render() (ui/ui.js), stRender and stFieldPaint, so every route CURP
   moves by is met before anything is painted: loadP, the picker, an import,
   a new record. Returns true when the words were someone else's, so the
   caller redraws the whole Journal and not only what stFieldPaint patches.

   It is the commit's own reset (stCommit), because a switch is the same
   fact: the entry on the page is no longer this person's. The words are not
   lost. stDraft put them on their own record as they were typed, so the
   pending half second is written now, while they are still that record's,
   and they come back through stDraftBack when that record is opened again.
   lastFound and lastT go too: they are the last commit's, and the release
   picker credits a run to them (relPick's story_t). A recording still
   running is stopped, because its next words would land on the next record.
   The safe line goes too, where the commit keeps it: STV.safeSaid and
   SRC_SAFE_UP are the last person's, and a switch left the next person the
   line, the door, and the line said aloud on Talk, with nothing written.
   SRC_SAFE_UP is cleared here and not in srcFresh, which Commit also calls,
   so the line kept standing at Commit is not said a second time. */
function stOwn(){
 var cur=(typeof CURP!=='undefined')?CURP:null;
 if(ST_OWN===cur)return false;
 if(ST_OWN===null){ ST_OWN=cur; return false; }
 if(STV.draftT){ stDraftStop();
  if(typeof pPersist==='function'&&!pPersist()&&typeof status==='function')
   status('This browser would not save. The words you left in the Journal are on this page and not on your record.','fail');}
 if(ST_LISTEN||ST_WANT_LISTEN){ ST_WANT_LISTEN=false; ST_LISTEN=false; ST_LISTEN_T0=null; ST_LIVE='';
  try{ if(ST_REC)ST_REC.stop(); }catch(e){} }
 ST_OWN=cur;
 ST_TEXT=''; ST_PARSED=null; SRC_PASSED=false; SRC_SAFE_UP=false; if(typeof srcFresh==='function')srcFresh();
 STV.lastFound=[]; STV.lastT=null; STV.unsaved=null; STV.safeSaid=false; STV.lastOpen=false;
 stDraftBack();
 return true;}

/* refresh only what the text moves, so typing never loses the caret */
function stRefresh(){
 /* the next entry has started, so the line about the last one goes */
 if(ST_TEXT&&ST_TEXT.trim())STV.safeSaid=false;
 stDraft();
 var keep=document.getElementById('sttext'), pos=keep?keep.selectionStart:0;
 /* the counter is gone, see stRender: nothing is written into .st-ct */
 var ap=document.getElementById('stapply');
 /* THE WORD DEPENDS ON WHICH #stapply IS IN THE DOCUMENT, 9 November. One
    id, two mutually exclusive places it can render (STV.chat&&STV.dash's
    own .st-lsbank in the bank row, reading "Bank"; every other state's
    plain button in .st-bar, reading "Commit", see ui/storyui.js's own
    stRender). This refresh runs on every keystroke, well after either
    render chose its word, and used to reset it to "Commit" unconditionally
    whichever button it found; now it reads the class that marks which one
    it actually found rather than guessing. */
 if(ap){ap.disabled=!ST_PARSED;
  var apw=ap.classList.contains('st-lsbank')?'Bank':'Commit';
  ap.textContent=apw+(ST_PARSED&&ST_PARSED.imprints.length?' '+ST_PARSED.imprints.length:'');}
 /* THE HERO VIEW LEAVES REST THE MOMENT A TURN LANDS, same reason the
    word above is read live rather than guessed: srcTurnCommit calls
    this, not a full stRender, every time a spoken sentence finalises
    (ui/storyui.js's own ST_REC.onresult), and heroRest (stRender's own
    flag) would otherwise sit stale at the old, textless render until
    something else happened to re-render the whole flow. Caught by
    tests/sound.js's real-browser round: a turn landed, and the real
    Commit button it then pressed was still hidden from before the
    turn existed. Mirrors stRender's own heroRest exactly; the only
    thing this adds is that it also runs here, live. */
 var jr=document.getElementById('stjr');
 if(jr)jr.classList.toggle('st-rest',!STV.dash&&!STV.typed&&!ST_LISTEN&&!STV.crisis&&!ST_TEXT);
 stRead();
 stMaskPaint();
 stAsidePaint();
 stFocus('write');
 /* the highlight is refreshed with the count, not with the whole surface,
    because stRefresh exists so typing never loses the caret. */
 stPaintHL();
 stPaintAll();
 if(keep){keep.focus(); try{keep.setSelectionRange(pos,pos);}catch(e){}}}
/* the stars line under the box, kept in step with the text as it is typed
   over, so it goes the moment the last hidden word has been typed in */
function stMaskPaint(){
 var e=document.getElementById('stmask'); if(!e)return;
 var runs=maskedRuns(ST_TEXT);
 e.hidden=!runs.length; e.textContent=maskedSay(runs);}
/* and the set aside line under it, S5, kept in step the same way. The text is
   the engine's; this only says whether there is any. */
function stAsideSay(){
 return (ST_PARSED&&ST_TEXT&&ST_TEXT.trim()&&typeof asideSay==='function')?asideSay(asideOf(ST_TEXT,ST_PARSED)):'';}
function stAsidePaint(){
 var e=document.getElementById('staside'); if(!e)return;
 var s=stAsideSay(); e.hidden=!s; e.textContent=s;}
/* everything below the sentence, off the one read */
function stPaintAll(){
 STC.sync(); stRelayout();
 srcPaint(); stPendPaint(); stListPaint(); stVaultCount(); stRelPanel();
 impRender();
 /* the Full view's left rail reads the same ST_PARSED as everything above,
    here, so a key typed or a turn landed by voice moves it with the chart
    (stRefresh reaches this too, not only stRender). ui/stdash.js. */
 if(typeof stDashLeft==='function')stDashLeft();}
/* THE FIELD MOVED UNDER THE PAGE. render() calls this on the Story, because
   a release that finishes, an undo, or a profile change all change what is
   held, what the release column offers and what the vault holds, and none of
   them passes through this file. Without it the vault read 0 after a run
   until the tab was left and entered again. */
function stFieldPaint(moved){
 if(!document.getElementById('stflow'))return;
 /* A PROFILE CHANGE IS NOT A PATCH, 3 November. Everything below patches
    the record's half of the page, and the words, the box, the conversation
    and the Full view's Energy rail are the other half. They were never
    refreshed here, so a switch on the Journal kept the last person's story
    on screen under the next person's name. moved is render()'s own stOwn,
    which has already run by the time this is reached. */
 if(stOwn()||moved){ stRender(); return; }
 /* a lighting change arrives here too, and the chart's ink is read off it.
    Only then: reading it forces a style flush, and render() runs on every
    slider step. */
 if(STC.cv&&STC.lit!==S.theme){STC.lit=S.theme; stInk(); STC.dirty=true;}
 stVaultCount(); stRelPanel();
 if(STV.list==='vault')stListPaint();
 /* a release moves what is running hot, so an open preview is repainted with
    it. The windows are cached on the record, so this is one pass over the 112. */
 if(STV.ana)stAnaPaint();
 /* the bank only while it is open. Closed, its rail is not drawn, and
    stBank repaints it on the way in, so nothing stale is ever on screen.
    Repainting it here on every render() was measured doubling the work a
    lighting change does on this tab. */
 if(STV.bank)impRender();}

/* ============================================================
   SOURCE AI, THE SPEAKING HALF. The listening half is engine/sourceai.js
   and the whole behaviour is written down in reviews/SPEC-source-ai.md.

   Scripted. No model is called: every line below is chosen by srcTurn off a
   count the person can check in their own words. It said so on screen, a
   small "scripted" beside its name, until round LO, his words: "Remove the
   text that says scripted." The fact is unchanged and is still written down
   in the spec above; only the label is off the page.

   Four moves, and the person decides which one it makes:
     open    the opening question, which a press turns to another one
     listen  it has heard something and asks nothing. The seat nearest a
             question and its rung show as a gauge; the words it heard are
             on the chart beside it, in the lanes they landed in.
     ask     one why question, about one seat, at seven or over
     pass    the person pressed Move on. "Cool." Nothing more is asked in
             this entry, however much more it hears. His words: "it's their
             job to lead ... if they want to move on, source's job isn't to
             dig deeper, it's just to go cool."

   What it may say is narrow on purpose. A place in the body, how often the
   story comes back to it, and the person's own words. Never an address, a
   fetter or a saboteur, because those are definitions and the ruling is that
   it discerns the energy and does not define it. Never a because about the
   person, since nothing the instrument measures is a cause. It asks why and
   the person answers, which is how the root gets found by the person who
   carries it.

   ONE BECAUSE IS ALLOWED, AND IT IS ABOUT THE BODY, NOT THE PERSON. Ruled 27
   September, his words: "Source AI also needs to add a why, right? Why you're
   releasing this. This is the most important part ... The stress response is
   impairing the nerve flow. While the story happened, the resistance is
   blocking the flow. So to bring you back to stasis and the baseline, all
   stories must go." That is a why of release, the mechanism the product
   already states as its definition of Charge, and it says nothing about why
   the person is the way they are. So the rule above still holds for the root:
   Source AI never answers the why it asks. See srcWhy below.

   THE HEARD ROWS WENT TO THE CHART. They printed each seat, the words heard
   there and the rung, which is exactly what a lane of the instrument now
   draws: the name, the words standing on it, and the ten pips at its right.
   Printing both would be the same reading in two places to disagree.
   ============================================================ */
var SRC_PASSED=false;
/* THE OPENER IS HIS SECOND WORDING, AND IT USES THE NAME. It was "What are
   we writing about today?", one of the two he offered at round GO. Round JS
   replaced it in his own words: "That's not quite what I want you to use. We
   need to invite them to writing. We first need to welcome them with their
   name. Hello, Lance. What would you like to write about today? Or would you
   like me to offer some suggestions?" Recorded in DECISIONS.md as ruled and
   not built. Built at round LT, where he asked for the questions to read like
   "a friend who knows me very well".

   The name is the first name the person entered on the intake, who.first,
   and nothing else: a profile called Custom is not greeted as Custom, and a
   worked example is not greeted by a case name. No name, no greeting, and the
   question stands alone.

   HIS LAST SENTENCE IS NOT PRINTED, AND THAT IS A CHOICE FOR HIM TO OVERRULE.
   "Or would you like me to offer some suggestions?" is a yes or no with no
   yes and no on the screen. The two buttons beside the question are the
   offer: one turns to another question, one builds one from what the person
   wrote. The sentence would describe the buttons next to the buttons. */
/* ROUND OT, his words: "I want the output to be a little bit more casual. So I
   was saying, what would you like to write about today? Say, what are we
   writing about today?" The round JS wording above is replaced by the one he
   first offered at round GO, at his own request.
   SUPERSEDED, look-dev reconciliation, section 109, his words with a Page
   mock-up in front of him: "What are we talking about today? That's new.
   That's what we're using." A later, explicit, in-context ruling over the
   same line -- not a guess, not drift. Round OT's reasoning kept above
   rather than deleted, in case it needs to be reopened. */
var SRC_OPEN='What are we talking about today?';
function srcOpen(){
 var w=(typeof CURP!=='undefined'&&CURP&&CURP.who)||{};
 var f=capName(String(w.first||'').trim().split(/\s+/)[0]);
 return (f?'Hello, '+f+'. ':'')+SRC_OPEN;}
/* SIMPLE, STRAIGHTFORWARD, DEEP. His three words for what the page should
   ask. Each is a physical event a person can answer from memory, the shape
   funnel/questions.js already proved works in this product, and none of them
   names a feeling for the person. One at a time, turned by the day, so the
   page does not become furniture.

   THEY WERE A SECOND LINE UNDER THE OPENER, AND THEY ARE THE OPENER'S NEXT
   QUESTIONS NOW. Round LO, his words: "have source AI question have a button
   to generate new questions ... Remove the text that says or start from
   where did you feel it first." That line was "Or start from" and one of
   these, picked by the day, and on the day he read it the day picked "Where
   did you feel it first?". The line is gone and the list is what the button
   walks. The opener is still his own sentence and still comes first; the
   first press lands on the day's question, which keeps the turn by the day,
   and each press after it is the next one round. SRC_QI is where the walk
   is, and below nought means the opener. It is not reset by Clear or by a
   new entry, because the question a person chose is theirs until they press
   again.

   REWRITTEN AT ROUND LT, his words: "these are horrible questions, they're
   not deep personal questions, they make it feel like a person, a friend who
   knows me very well is asking me a personal question." The six they replace:

     What happened today that your body is still holding?
     Where did you feel it first?
     What did you not say?
     Who was in the room?
     What keeps coming back?
     What did you do straight after?

   Each of those was a physical event, which was right, and each was asked
   from outside the room, which was the defect: a form asks "who was in the
   room", a friend asks who got under your skin. The rule kept from the old
   list is that no question names a feeling for the person. What changed is
   that each one now assumes the thing a close friend already knows about
   you: that you swallow things, that your shoulders go up, that you replay
   the conversation, that you reach for something after. Warmth here is the
   specific question, never a soft word. Eight rather than six, so the walk
   takes longer to come round. */
var SRC_QI=-1;
function srcQuestion(){
 if(SRC_DQ)return SRC_DQ;
 return SRC_QI<0?srcOpen():SRC_JOG[SRC_QI%SRC_JOG.length];}
function srcNextQ(){
 SRC_DQ='';
 SRC_QI=SRC_QI<0?Math.floor(Date.now()/864e5)%SRC_JOG.length:(SRC_QI+1)%SRC_JOG.length;
 return srcQuestion();}
var SRC_JOG=['Who got under your skin today?',
 'When did your shoulders go up today?',
 'What did you swallow instead of saying?',
 'What did your stomach know before you did?',
 'What conversation are you still having in your head?',
 'Who did you make yourself small for?',
 'What did you reach for today to take the edge off?',
 'What have you not told anyone yet?'];
function srcSeatSay(b){
 return b==='Solar'?'the solar plexus':(b==='3rd Eye'?'the third eye':'the '+String(b).toLowerCase());}
function srcTimes(n){return n===1?'once':(n===2?'twice':(n===3?'three times':n+' times'));}
/* the one question, by the evidence that raised it, and about a place rather
   than a label.

   REWRITTEN AT ROUND LT, with the same three cases and the same evidence.
   They read, with the heart as the seat:

     root     You keep coming back to the heart, here and in what you wrote
              before. Why do you think that is?
     earlier  The heart was in an earlier entry too. Why do you think it
              comes back?
     again    The heart comes up three times in this. Why do you think it
              keeps landing there?

   Two things moved. The person's own words come back to them in quotes,
   heard.top.words, which srcHear has already cleared of negated mentions:
   a friend who knows you says "you wrote tight", and a form says "the throat
   comes up". And the seat is said as the place it is, the same phrase the Why
   line under it uses, SRC_WHY_AT, "in your throat" and not "the throat".
   "Why do you think" went, because it is a hedge on a question: the question
   is still a why, and the person still answers it. Nothing here says a cause.
   The root case asks what is at the bottom of it, which is the root in a
   physical picture, and it is only asked when the rung is ten. */
function srcPlace(b){return SRC_WHY_AT[b]||('at '+srcSeatSay(b));}
function srcQuote(ws){
 return (ws||[]).slice(0,2).map(function(w){return '“'+w+'”';}).join(' and ');}
function srcAsk(t,words){
 var at=srcPlace(t.band), ws=(words||[]).slice(0,2), q=srcQuote(ws);
 var said=q?'You wrote '+q+'. ':'';
 if(t.why==='root')
  return said+'Here and in what you wrote before, it lands '+at+'. What sits at the bottom of it?';
 if(t.why==='earlier')
  return said+'It lands '+at+', and an earlier entry did too. What takes you back there?';
 if(ws.length>1)return said+'Both land '+at+'. Why there?';
 /* ONE MENTION REACHES HERE SINCE 27 OCTOBER, a seat the field's own driven
    pattern sits on (srcRung, engine/sourceai.js), and this line then read
    "You wrote “afraid” once. It lands at the base of your spine each time."
    Measured round SK, 30 October. Once and each time cannot both be true,
    so one mention says it lands, and no count. */
 if((+t.mentions||0)<2)return said+'It lands '+at+'. Why there?';
 return (q?'You wrote '+q+' '+srcTimes(t.mentions)+'. ':'')+'It lands '+at+(q?' each time':' '+srcTimes(t.mentions))+'. Why there?';}
/* ============================================================
   THE ASK, CHECKED BEFORE IT IS SHOWN. Round SK, 30 October, his words
   about the live chat: "This is the behavior I want source AI to take on
   during chat. It's currently not doing that. It's currently acting like a
   chatbot." The behaviour is his own blueprint, Journal Mode, 4 October,
   and its section 35 is ten checks every question passes or is
   regenerated. They are srcVet in engine/qcheck.js, and this is where the
   ask goes through them.

   WHAT IT CHANGES ON SCREEN, said plainly. srcAsk's own line is tried first
   and still decides the lead: the person's words in quotes, and where they
   land, which since round SK and the seam package is said only about a seat
   the person confirmed (EV_PLACEABLE, engine/evidence.js), so in practice
   the lead is their words alone (srcLeadOk below). Its last sentence was a why, "Why there?",
   "What takes you back there?", "What sits at the bottom of it?", and every
   one fails: point 4, a why asks for a cause and not what happened, or point
   5, "takes you" casts the person as pushed. Measured on the story bank,
   186 asks, none passed as written. So the lead stays and the question
   becomes the first of the document's own family questions that passes all
   ten, in its own priority order: what did you do, what would you rather be
   doing, what happens next, where do you feel it, and on. Nothing is
   written here; every question is a line from his document.

   THIS REVERSES ONE LINE OF A RULING, AND SAYS SO. DECISIONS.md, 27
   September: "Why questions are its questions, and it never answers one."
   His 4 October document has no why among its questions, its section 24
   lists the ones to prefer, and on 30 October he pointed at it as the
   behaviour he wants. The later word wins, and the earlier is recorded as
   superseded there rather than deleted.

   When nothing passes, the lead stands alone and nothing is asked, which is
   the document's Space, and once the lead was said its own Space line,
   SRC_SPACE, stands instead (srcAskVetted). SRC_VET keeps the last result, every refusal with
   its reason, for a gate and for whoever asks why a line was not shown. */
var SRC_VET=null;
/* THE LINES SOURCE AI ALREADY ASKED IN THIS ENTRY: every one the person has
   replied under. The one still waiting for a reply is not a repeat of
   itself, so it is left out, and it is repainted on every key. Once a reply
   lands under it, it has been asked, and point 10 will not ask it again:
   the next question after a reply is a new turn. Before round SK an ask
   about the same seat rewrote its own row in place across a reply, which
   was right while it could only ever ask the same why. */
function srcSaidBefore(){
 var out=[], pend=null;
 SRC_CHAT.forEach(function(r){
  if(r.w==='src'){pend=r.q||null; return;}
  if(r.w==='me'&&pend){out.push(pend); pend=null;}});
 return out;}
/* one ledger a text: srcPaint runs on every key and the ledger only moves
   when the text, the committed entries or the field's pattern do */
var SRC_LEDGER=null, SRC_LEDGER_K='';
/* THE PERSON'S ANSWERS IN THIS ENTRY, round SK: a spoken "that doesn't fit
   me" is a no on the claim Source AI was on (srcTurnCommit). Page memory,
   cleared with the entry by srcFresh, never kept: keeping a verdict is the
   additive field TASKS.md SK1 names, not built. SRC_VENT is the person
   asking to be heard and not asked, the package's VENT. */
var SRC_VERDICTS=[], SRC_VENT=false;
/* WHERE THE CONVERSATION'S SUBJECT STARTS, 31 October. An offset into
   ST_TEXT, set by srcTurnCommit at the start of a turn that asks to change
   the subject (srcIntent's shift, engine/evidence.js), and nought for the
   whole entry. Before it, a change of subject was filed as Move on, and the
   seat asked about was always srcHear's top, the one mentioned most, so the
   old subject kept the question after the person had left it: reproduced
   in reviews/source-ai-conversation-diagnosis-2026-10-31.md, transcript 3,
   the job fear still the top seat three turns after "I want to talk about
   my brother instead".

   WHAT IT MOVES AND WHAT IT DOES NOT. What Source AI reads to decide its
   next line, the seat it hears (srcHeardNow), the ledger (srcLedgerNow) and
   the text the ten checks hold a line against, reads from here on. The
   entry does not: ST_TEXT, the parse, the bank and what Commit keeps are
   the whole entry, both subjects, exactly as before. Setting a subject
   down is a choice about the conversation and never edits the record.
   Page memory, cleared with the thread by srcFresh. */
var SRC_FROM=0;
/* whether the last paint drew the safe line, so it is spoken once, srcPaint */
var SRC_SAFE_UP=false;
function srcConvText(){
 if(SRC_FROM>ST_TEXT.length)SRC_FROM=0;
 return SRC_FROM?ST_TEXT.slice(SRC_FROM):ST_TEXT;}
/* THE STOP READS THE WHOLE ENTRY, 3 November. A change of subject moves
   what Source AI reads, and it must never move the stop: "can we talk about
   something else", said straight after the words, put SRC_FROM past them and
   the line and the door went from the screen for the rest of the entry,
   reproduced in tests/safepage.js section 10. Commit already read the whole
   entry and kept no release; the screen did not. srcHear of the whole entry
   is heard as safe and nothing else, the same answer the unsliced case gives. */
function srcHeardNow(){
 if(!SRC_FROM)return STR.heard||srcHear(ST_TEXT,null);
 if(srcSafe(ST_TEXT))return srcHear(ST_TEXT,null);
 var ents=(CURP&&CURP.story&&CURP.story.entries)||[];
 return srcHear(srcConvText(),srcPrior(ents),ST_ACTIVE);}
function srcLedgerNow(){
 var ents=(CURP&&CURP.story&&CURP.story.entries)||[], t=srcConvText();
 var asked=SRC_LOG.map(function(r){return r.seat;}).filter(Boolean);
 var k=t+'\u0000'+ents.length+'\u0000'+JSON.stringify(ST_ACTIVE||null)+'\u0000'+JSON.stringify(SRC_VERDICTS)+'\u0000'+asked.join();
 if(!SRC_LEDGER||k!==SRC_LEDGER_K){
  SRC_LEDGER=evLedger(t,ents,{active:ST_ACTIVE, verdicts:SRC_VERDICTS, asked:asked}); SRC_LEDGER_K=k;}
 return SRC_LEDGER;}
/* THE LEAD IS SAID ONCE A SEAT. Seen on the page, round SK: every ask
   about the same seat opened on the same mirror, "You wrote “afraid” three
   times. It lands at the base of your spine each time.", which is a script
   saying its line again. Once a person has replied under an ask about this
   seat, the next ask is the question alone: the mirror was heard. */
function srcLeadSaid(seat){
 var pend=false, said=false;
 SRC_CHAT.forEach(function(r){
  if(r.w==='src'){pend=!!(r.key&&r.key.indexOf('ask|'+seat+'|')===0); return;}
  if(r.w==='me'&&pend){said=true; pend=false;}});
 return said;}
/* THE LEAD IS CHECKED A SENTENCE AT A TIME, round SK. srcAsk's lead says
   the person's words back and, after them, where they land. Since the seam
   package a place is said only about a claim the person confirmed (point 7,
   engine/qcheck.js), so the sentences that fail are dropped and the ones
   that pass, the person's own words said back, stay. */
function srcLeadOk(lead,L,seat){
 return (String(lead).match(/[^.]+\./g)||[]).map(function(x){return x.trim();}).filter(function(x){
  return x&&srcVetSay(x,{text:srcConvText(), ledger:L},seat).ok;}).join(' ');}
/* AN ASK IS BUILT ONCE FOR WHAT IT DEPENDS ON, round SK: the text, the
   conversation so far, the answers given, the move and its seat. srcPaint
   runs on every render, most of which change none of those, and the ten
   checks cost an animation frame when run on all of them (measured, see
   qcFind in engine/qcheck.js). */
var SRC_ASK_K='', SRC_ASK_V='';
function srcAskVetted(turn,heard){
 var k=[ST_TEXT,SRC_FROM,SRC_CHAT.length,JSON.stringify(SRC_VERDICTS),SRC_PASSED,turn.seat,turn.why,turn.mentions,srcLedgerNow()===SRC_LEDGER&&SRC_LEDGER_K].join('\u0000');
 if(k===SRC_ASK_K&&SRC_VET)return SRC_ASK_V;
 SRC_ASK_V=srcAskBuild(turn,heard); SRC_ASK_K=k; return SRC_ASK_V;}
function srcAskBuild(turn,heard){
 var full=srcAsk(turn,heard&&heard.top&&heard.top.words), cut=full.lastIndexOf('. ');
 var L=srcLedgerNow();
 var lead=srcLeadSaid(turn.seat)?'':srcLeadOk(cut>=0?full.slice(0,cut+1):'',L,turn.seat);
 var r=srcChoose([{q:full, base:full, family:'why', target:turn.seat}].concat(srcFamilyCands(lead,turn.seat)),
  {text:srcConvText(), ledger:L, asked:srcSaidBefore(), passed:SRC_PASSED});
 SRC_VET=r;
 /* NOTHING LEFT THAT PASSES, and the lead already said: the document's
    Space, in its own words, section 23, "Keep writing." Reproduced round
    SK: sixteen replies about one seat ran every family question once, nine
    distinct, and the tenth turn drew an empty bubble. */
 return r.ok?r.q:(lead||SRC_SPACE);}
var SRC_SPACE='Keep writing.';

/* A QUESTION FROM WHAT YOU WROTE. Round LT, his words: "Then you need to be
   another button next to it that makes it dynamic." He did not say what
   dynamic does, so this is one reading of it, and the report that shipped it
   says so. The other button walks a fixed list. This one reads the person:

     1  what they are writing now. Every seat srcHear heard in this entry,
        with the person's own words for it, one seat per press, heaviest rung
        first, and the question about a dimension the entry has not
        answered yet, 20.H1, srcDims and srcNext in engine/sourceai.js.
     2  written, and heard at no seat. The same choice of question, with no
        quote and no place, because the words are still the person's.
     3  nothing written yet, so what they wrote before. The seat keys their
        committed entries stored, srcPrior, the only thing Source AI may read
        from an earlier entry. Never the text.
     4  nothing on either. It says so, and asks nothing.

   WHAT IT IS NOT, SAID PLAINLY. It is not a model and it generates nothing.
   It picks a seat and a word the engine already read and puts them into one
   of a handful of written questions. What makes it personal is that the words
   are the person's and the place is where their own story landed, which is
   every claim the instrument can make and no more. */
var SRC_DQ='', SRC_DN=0, SRC_DW='';
/* WHAT WAS ASKED IN THIS ENTRY, 20.H5. One row per question shown, a kind
   and a seat key and the text's length when it first showed, and whether the
   person moved on from it. srcAsked in engine/sourceai.js turns it into what
   the entry keeps at commit. SRC_DK is the dimensions the button has asked,
   in order, which is what srcNext reads for novelty. */
var SRC_LOG=[], SRC_DK=[];
function srcLog(k,seat){
 if(SRC_LOG.some(function(r){return r.k===k&&r.seat===seat;}))return;
 SRC_LOG.push({k:k, seat:seat||null, at:ST_TEXT.length, moved:false});}
/* a new entry is a new conversation: the built question quoted the last one.
   The thread goes with it, and so does a reply still in the line, which on a
   commit has already been sent into the entry and on Clear is cleared. */
function srcFresh(){SRC_DQ='';SRC_DW='';SRC_DN=0;SRC_DNONE=false;SRC_LOG=[];SRC_DK=[];SRC_VET=null;SRC_VERDICTS=[];SRC_VENT=false;SRC_ASK_K='';SRC_FROM=0;
 SRC_CHAT=[];SRC_CPRESS=false;SRC_CDRAFT='';}
/* THE BUTTON'S QUESTIONS, ONE PER DIMENSION, 20.H1. It walked four of these
   by how many times it was pressed; srcNext now picks the dimension the
   entry has not answered, in the order written in engine/sourceai.js. Each
   takes the person's own word in quotes, or nothing when this entry was
   heard at no seat.
     kept      trigger, contact and behaviour are the three this button
               already asked, word for word.
     from the  feeling, prediction and meaning are the document's own
     document  "correct progression" for "I felt tight in my chest when my
               boss called", "How did you feel?", "What did you expect would
               happen?", "What does that mean to you?". Body is its somatic
               following, "When you say 'freeze,' what happens in your
               body?", and with no word to quote its somatic example,
               "Where do you feel that?".
     retired   "What did your body want to do right then?" It asked the
               body and the behaviour at once, and one useful question is
               the document's tenth rule. It is the one line this removes.
   Belief and goal are read and never asked: the document gives no question
   for either, and a wording made up here would be a wording nobody ruled. */
var SRC_DIMQ={
 trigger:function(w,at){return w?'You wrote '+w+'. It lands '+at+'. What happened in the minute before?'
  :'What happened in the minute before?';},
 contact:function(w){return (w?'You wrote '+w+'. ':'')+'Who was there when it started?';},
 feeling:function(w){return (w?'You wrote '+w+'. ':'')+'How did you feel?';},
 body:function(w){return w?'When you say '+w+', what happens in your body?':'Where do you feel that?';},
 prediction:function(w){return (w?'You wrote '+w+'. ':'')+'What did you expect would happen?';},
 behaviour:function(w){return (w?'You wrote '+w+'. ':'')+'What did you do straight after?';},
 meaning:function(w){return (w?'You wrote '+w+'. ':'')+'What does that mean to you?';}};
/* THE BUTTON'S QUESTION GOES THROUGH THE SAME TEN CHECKS, round SK. No button
   calls srcDyn since 29 October; if one ever does, what it builds is checked
   exactly as the ask is, and a line that fails is not shown: the caller
   already reads an empty answer as nothing to ask (SRC_DNONE). */
function srcDimVet(q,k,seat){
 var r=srcVet({q:q, dim:k, family:'dim', target:seat||null},
  {text:ST_TEXT, ledger:srcLedgerNow(), asked:srcSaidBefore(), passed:SRC_PASSED});
 SRC_VET={ok:r.ok, q:r.ok?q:'', cand:null, tried:[{q:q, fails:r.fails}]};
 return r.ok?q:'';}
function srcDyn(heard,entries,text){
 var n=SRC_DN++, seats=((heard&&heard.seats)||[]).filter(function(s){return s.words&&s.words.length;});
 var t=String(text||''), dims=t.trim()?srcDims(t):null;
 var k=dims?srcNext(dims,SRC_DK,Object.keys(SRC_DIMQ)):null;
 if(seats.length&&k){
  var s=seats[n%seats.length], lap=Math.floor(n/seats.length);
  SRC_DW=s.words[lap%s.words.length];
  SRC_DK.push(k); srcLog(k,s.seat);
  return srcDimVet(SRC_DIMQ[k]('“'+SRC_DW+'”',srcPlace(s.band)),k,s.seat);}
 SRC_DW='';
 /* HEARD AT NO SEAT, AND STILL WRITTEN. 20.H6 says what the instrument read
    nothing in; an entry it read nothing in is still the person's own words,
    and the document's third rule is to follow the signal before the label.
    So it asks about this entry, without a quote and without a place, before
    it reaches back to earlier ones. */
 if(k&&unmarkedOf(t,parseStory(t)).unmarked>0){
  SRC_DK.push(k); srcLog(k,null);
  return srcDimVet(SRC_DIMQ[k]('',null),k,null);}
 var ents=entries||[], pr=srcPrior(ents);
 var ks=Object.keys(pr).sort(function(a,b){return pr[b]-pr[a]||(a<b?-1:1);});
 if(!ks.length)return '';
 /* the last entry's heaviest seat, then the seats most often landed on */
 var last=(ents[ents.length-1]||{}).bands||{};
 var lk=Object.keys(last).filter(function(k){return K2BAND[k]&&last[k]>0;})
  .sort(function(a,b){return last[b]-last[a]||(a<b?-1:1);})[0];
 var turn=[];
 if(lk)turn.push({k:'since',seat:lk,q:function(){return 'Last time, what you wrote landed '+srcPlace(K2BAND[lk])+'. What has moved since?';}});
 ks.forEach(function(sk){if(pr[sk]<2&&turn.length)return;
  turn.push({k:'back',seat:sk,q:function(){return 'What you write has landed '+srcPlace(K2BAND[sk])+' '+srcTimes(pr[sk])+(pr[sk]>1?' now':'')+'. Is it back today?';}});});
 var pick=turn[n%turn.length];
 srcLog(pick.k,pick.seat);
 return pick.q();}
/* WHY RELEASE IT. His dictation, translated to the ten year old rule (V21):

     his        The stress response is impairing the nerve flow. While the
                story happened, the resistance is blocking the flow. So to
                bring you back to stasis and the baseline, all stories must go.
     shipped    The stress from this story is stuck in the nerves behind your
                stomach. They rest again once every story stuck there is
                released.

   stress response and resistance become the stress, stuck, which is the
   shipped Charge definition's own word ("It gets stuck when a stress reaction
   starts and never gets to finish"). Impairing the nerve flow becomes stuck in
   the nerves at a named place. Stasis and the baseline become rest. All
   stories must go becomes every story released. It was "gone" in the first
   cut, and read as a bereaved person it said the father goes, where a release
   takes the charge and leaves the memory: ruling GS, "a release empties a
   story from the body". Released is also the word on the button.

   GROUNDED IN TWO FIELDS, AND NO OTHER. The seat is heard.seats[].band, which
   srcHear has already cleared of negated mentions, so "I was not angry" never
   earns a why. The place is that seat's nerve bundle in APC, the pattern
   catalog: each phrase below is taken from the APC entry's own d, which
   describes the nv it names, so the words say where that bundle sits and not
   what it is called. The nerve names themselves stay off this line: "celiac
   plexus" fails the ten year old test, and a single address's nerve would be
   read off a fallback most of the time (parseStory marks those inferred),
   which is the precision the place cannot fake. A seat APC does not carry is
   not spoken about. At most two seats, heaviest rung first, because one or two
   sentences is the length and the chart beside it already shows every lane. */
var SRC_WHY_AT={'Root':'at the base of your spine','Sacral':'low in your belly',
 'Solar':'behind your stomach','Heart':'around your heart','Throat':'in your throat',
 '3rd Eye':'behind your eyes','Crown':'at the top of your head'};
function srcWhy(heard){
 var at=((heard&&heard.seats)||[]).filter(function(s){
  return SRC_WHY_AT[s.band]&&APC.some(function(a){return a.b===s.band;});})
  .slice(0,2).map(function(s){return SRC_WHY_AT[s.band];});
 if(!at.length)return '';
 return 'The stress from this story is stuck in the nerves '+at.join(' and ')+'.'
  +' They rest again once every story stuck there is released.';}
/* ten marks, filled to the rung, the last four drawn as the end it asks at.
   Drawn and never printed, because a reading is not a score. */
function srcPips(rung,col){
 var s='<span class="src-pips" aria-hidden="true" style="--c:'+col+'">';
 for(var i=1;i<=10;i++)s+='<i class="'+(i<=rung?'on':'')+(i>=SRC_ASK?' ask':'')+'"></i>';
 return s+'</span>';}
/* the listening gauge and the listening refusal, lifted out of srcPaint
   unchanged so the thread says them in the same words and draws the same
   pips: two copies of one line are two lines to drift apart. */
function srcGauge(top){
 return '<div class="src-row"><span class="src-gauge" style="--c:'+seatCol(top.band)+'">'
  +'<span>Next question</span>'+srcPips(top.rung,seatCol(top.band))
  +'<span class="src-seat">'+esc(top.band)+'</span></span></div>';}
/* NOT "NOTHING READ". Round OY, 1 October, caught by his own screenshot: the
   panel read "53 words read, 1 kept" beside this line reading "Nothing read
   yet, so nothing is asked" on the same entry, which is the house's own empty
   state wording (V19, atuned-voice SKILL.md) borrowed for a state where it is
   false. Words were read; no seat was found in them. Those are different
   facts and V19 is reserved for the first one (nothing written at all, see
   the literal strings beside SRC_DNONE below, which are that true case).
   This says the true one instead. */
function srcNone(){
 return 'Nothing placed yet, so nothing is asked. Say what your body did, and where.';}
function srcPaint(){
 var h=document.getElementById('stsrc'); if(!h)return;
 var heard=srcHeardNow();
 /* a built question that quotes a word the person has since deleted is no
    longer true, so it goes and the walk's own question comes back */
 if(SRC_DQ&&SRC_DW&&ST_TEXT.indexOf(SRC_DW)<0){SRC_DQ='';SRC_DW='';}
 var turn=srcTurn(heard,{typed:!!ST_TEXT.trim(),passed:SRC_PASSED});
 /* THE PERSON'S OWN WORDS ABOUT THE CONVERSATION, round SK, the seam
    package's VENT and CORRECT. srcTurn is the engine's and is unchanged;
    the page reads two more things it cannot. A seat the person said does
    not fit is not asked about again, the move falls back to listening. And
    a person who asked to vent is listened to and asked nothing, for the
    rest of the entry, the way Move on is final for it. */
 if(turn.move==='ask'){var Lt=srcLedgerNow(), ct=Lt.claims[turn.seat];
  if(ct&&(ct.state==='rejected'||ct.state==='corrected'))turn={move:'listen'};}
 if(SRC_VENT&&(turn.move==='ask'||turn.move==='listen'))turn={move:'vent'};
 /* A TURN THAT IS ONLY TALK IS ANSWERED AS TALK, 31 October: see srcAct in
    engine/evidence.js. It is answered before anything is asked, so a
    person who says "can you hear me" while a seat sits at seven is told it
    hears them and is not handed the next family question; and it is set
    here, before srcLog, so a question that was never shown is never logged
    as asked. Move on and venting keep their move, only the line changes. */
 var act=STV.chat?srcActNow():null;
 if(act){if(turn.move==='ask'||turn.move==='listen')turn={move:'listen'}; turn.act=act;}
 /* after Commit the box is empty and the engine has nothing to hear, so the
    page's own memory keeps the line up until the next entry starts. Last, so
    no later rule (a rejected seat, venting, talk) can turn it back into a
    question, and the whole turn is replaced, act and all. */
 if(turn.move==='open'&&stSafe())turn={move:'safe'};
 /* THE LIVE MARK. A dot beside the name that breathes while Source AI is
    idle and holds lit while it is reading, see srcHearing. It is drawn and
    carries no word, because "thinking" printed on a scripted reader would be
    a claim, and the dot only says what is true: it reads on every key.
    ROUND QB TOOK THE NAME OFF THIS BOX. The eyebrow read "Source AI"; the
    column is called Journal now and wears it in its own top row, see stMark,
    so the dot went up with the name it sits beside. It is written once a
    render there and not on every key here, which is cheaper, and the lock
    below has nothing of its own left to put on the beat. */
 var o='';
 var ask=turn.move==='ask'?srcAskVetted(turn,heard):'';
 /* an ask on screen is a question asked, 20.H5: its why and its seat */
 if(turn.move==='ask')srcLog(turn.why,turn.seat);
 /* THE QUESTION, AND THE TWO PRESSES THAT CHANGE IT, ON THE RIGHT. Round LT,
    his words: "The cycle a new question needs to go on the right hand side.
    Then you need to be another button next to it that makes it dynamic."
    The turn arrow sat straight after the question's own measure, 44
    characters, so on a panel wider than that it stood in the middle of the
    line: measured on the build before this one at 1920 by 1080, the panel ran
    114 to 962 and the button stood at 754. The pair is its own group now and
    the group takes the right edge at every width.

    The question and its buttons share a line, the way the Avatar's question
    and its turn arrow do. They are here on the opener and while Source AI is
    listening, which is every move where the person leads the asking. Not on
    an ask, which has its own question and Move on, and not after Move on,
    which is final for the entry. A press repaints and puts the focus back on
    the button pressed, so the next press is one key away. */
 /* THE TWO PRESSES ARE GONE, round of 29 October, his words: "get rid of the
    another question button... get rid of a question from what you wrote
    button because we have rules for the way source AI behaves. We don't
    need these anymore." srcNextQ() and srcDyn() stay defined and reachable
    (press() below still wires #srcnew/#srcdyn if either ever returns), only
    the buttons that called them are cut. */
 var acts='';
 var q=turn.move==='open'||turn.move==='listen'?srcQuestion():ask;
 /* SAFE, 17 October (stSafe above). No question and no question buttons, one
    line and one door, in the row the Story box already uses after Talk it
    through, so it is the same quiet weight and not a new alarm. The door is
    crisisReachBtn, which opens the panel straight on the numbers. When Talk
    it through already put that door beside the box, the line comes alone,
    so there is still one door on the page. The first sentence goes when this
    browser refused to keep the words, see CRISIS_SAY.entryNow. */
 var safeSay=(STV.unsaved||STV.draftFail)?CRISIS_SAY.entryNow:CRISIS_SAY.entry;
 if(turn.move==='safe')
  o+='<div class="st-crxrow" id="stsafe"><p class="st-mask st-crisis" role="note">'+esc(safeSay)+'</p>'
   +(STV.crisis&&!STV.chat?'':crisisReachBtn('st-crxline'))+'</div>';
 else if(turn.move==='open')
  o+='<div class="src-ask">'+srcLand('src-open',q)+acts+'</div>';
 else if(turn.move==='ask'){
  o+=srcLand('src-q',ask,'--c:'+seatCol(turn.band))
   +'<div class="src-row"><button type="button" class="btn" id="srcpass">Move on</button>'
   +'<span class="src-note">Answer in the journal, or leave it.</span></div>';}
 else if(turn.move==='pass'){
  o+='<p class="src-q">Cool.</p><p class="src-note">Nothing more asked in this entry.</p>';}
 else if(turn.move==='vent'){
  o+='<p class="src-q">'+esc(SRC_LISTENING)+'</p>';}
 else{
  /* listening, the question steps back, unless the person asked for this
     one: a question built from their words is the one thing on this move
     they pressed for, so it stands at full size. */
  o+='<div class="src-ask">'+srcLand('src-open'+(SRC_DQ?'':' quiet'),q)+acts+'</div>';
  if(heard.top)o+=srcGauge(heard.top);
  else o+='<p class="src-note">'+esc(srcNone())+'</p>';}
 /* THE REFUSAL FOR A PRESS WITH NOTHING TO READ. Nothing heard in this entry
    and nothing on the record, so the button has nothing of the person's to
    build from, and it says so rather than handing back a question from the
    walk dressed as a personal one. While listening it takes the listening
    note's place above, so the column never says nothing read twice. */
 if(SRC_DNONE&&turn.move==='open')
  o+='<p class="src-note">Nothing read yet, so there is nothing of yours to ask from. Write a line first.</p>';
 /* the why, under whatever move was made, on every move that has heard a
    seat. It is not a question, so Move on does not silence it: moving on ends
    the asking, and the reason for a release is still true. srcThread below
    still takes it as its own fifth argument; #srcwhy, the div this used to
    build, never survives to h.innerHTML now (the mine-only override further
    down replaces o outright), confirmed dead by reading the whole function,
    10 November, so only the markup that built it is gone, not the value. */
 var why=(turn.move==='open'||turn.move==='safe')?'':srcWhy(heard);
 /* TALKING, THE SAME MOVE IS DRAWN AS A THREAD. Everything above still ran:
    the same turn, the same question, and the same srcLog row for an ask, so
    what the entry keeps at commit is identical whichever way it was shown.
    Only the markup is swapped, and the wiring below finds the same ids. */
 var cur=null, fresh=false;
 /* NOT WHILE THE BOX IS OPEN, 9 November. srcChatSync reads the whole of
    ST_TEXT and treats everything past its last known row as one new turn,
    which is right once, on a finished sentence, and wrong on every key: a
    box open for STV.typed repaints on each keystroke (stRefresh, this
    function's own caller), so a sentence typed one letter at a time synced
    one row per letter, measured as SRC_CHAT turning "My jaw was tight all
    morning." into twenty eight single character rows. The box still shows
    the words as they are typed, the thread above still paints (cur, fresh
    and o below are untouched), only the one write that promotes them into
    the thread waits for the box to actually close, which stType does by
    calling this same function once, by name, before it renders. */
 if(STV.chat&&turn.move!=='safe'){cur=srcChatCur(turn,heard,q,ask); if(!STV.typed)srcChatSync(); fresh=srcChatNote(cur);
  o=srcThread(turn,heard,cur,acts,why);}
 /* SAFE, TALKING: THE PERSON'S OWN WORDS STAY ON THE PAGE, 3 November. The
    conversation became the Journal's only state on 28 October, and the
    first cut of the merge drew the safe row in place of the whole thread,
    so a person who said it out loud watched every word they had said
    vanish, measured: two of their own rows before, none after. The thread
    is drawn as it stands, every Source AI row as an earlier one, and the
    line and the door take the place of the reply. Nothing is added to
    SRC_CHAT, so nothing reaches the entry's asked. */
 var safeTh=STV.chat&&turn.move==='safe';
 if(safeTh)o=srcThreadSafe(o);
 /* AND THE LINE IS SAID OUT LOUD, owner's ruling of 3 November, his words:
    "Source AI can speak the crisis safety line out loud. We want to take off
    the no sound rules. Since we're now using voice speech to speech." Scoped
    to this line alone. It goes through stSrcSpeak, the call every reply
    below goes through, on the same rule: only while Talk is on, and once,
    when the line first takes the reply's place, never on a repaint of it
    and never again when Commit keeps it standing. Its own words and nothing
    else, the words on the screen. Still nothing is added to SRC_CHAT. */
 var safeNew=turn.move==='safe'&&!SRC_SAFE_UP;
 SRC_SAFE_UP=turn.move==='safe';
 if(safeNew&&safeTh&&ST_WANT_LISTEN)stSrcSpeak(safeSay);
 /* NO TWO-WAY CHAT, ANYWHERE, 10 November, his words, given over and
    over, most recently pointed straight at the Dashboard: "we don't need
    2-way talk anymore... it's just the user's input. Or the user can put
    text." First built for the hero view alone; widened to the Dashboard
    the same night once he said the words looking at it, not the hero.
    Everything above still ran unchanged, the same turn, the same srcLog
    row, the same SRC_CHAT writes and the same spoken reply (stSrcSpeak
    above and below both read cur/safeSay, neither o), so what an entry
    keeps at Commit is identical to before; only the markup painted here,
    last, over whatever o the code above built, changed. Nothing reads
    #stsrc's own markup back (verified directly in srcTurn, srcSaidBefore,
    srcConvText and stSrcSpeak's own srcSayNow route, all of which read
    SRC_CHAT and ST_TEXT, never the panel), and nothing in the Dashboard
    (stdash.js) reads it either, so this is safe in both views alike. The
    safe row is the one thing kept rather than replaced: it is the crisis
    door, already built above, and the person's own words stand ahead of
    it the way srcThreadSafe used to keep them ahead of it, never swapped
    out by it. */
 /* ONE BOX, NOT TWO, 10 November. His words, on a real screenshot: "Under
    Uni, you've got two text fields... delete the text field directly
    under Uni. You're going to move its properties where it's detecting
    the patterns into the text field beneath that one." The upper box was
    this one, .src-mine; the lower, correctly sized one he means is
    #staside (stAsideSay/stAsidePaint, a few hundred lines up), the set
    aside line that already sits under the writing box elsewhere on this
    page and says the same "is not counted, because..." sentence on its
    own, by its own stRefresh call. Read here instead of rebuilding it,
    so there is exactly one sentence of truth for it; #staside itself is
    hidden wherever this box shows (head.html), so the words never print
    twice. */
 var asideSentence=stAsideSay();
 var mineHtml=ST_TEXT.trim()?'<div class="src-mine"><p class="src-me">'+srcMeHtml(0,ST_TEXT.length)+'</p>'
  +(asideSentence?'<p class="src-aside">'+esc(asideSentence)+'</p>':'')+'</div>':'';
 o=mineHtml;
 if(turn.move==='safe')
  o+='<div class="st-crxrow" id="stsafe"><p class="st-mask st-crisis" role="note">'+esc(safeSay)+'</p>'
   +(STV.crisis&&!STV.chat?'':crisisReachBtn('st-crxline'))+'</div>';
 h.innerHTML=o;
 SRC_SHOWN=cur?cur.q:((turn.move==='pass'||turn.move==='safe')?'':q);
 srcLock(h);
 var mn=h.querySelector('.src-mine'); if(mn)mn.scrollTop=mn.scrollHeight;
 srcHearing(h);
 /* EVERY NEW TURN SOURCE AI TAKES IS SAID OUT LOUD while Talk is on, 31
    October. stSrcSpeak had one caller, the Talk press, so the greeting was
    the only line he ever heard, and on a screen where voice is the only
    way in he spoke, heard nothing, and said it again. Only a row
    srcChatNote added is spoken, never a repaint of one already there, and
    its own words, cur.q. While Talk is off nothing is spoken, the same
    rule the greeting already keeps: the voice belongs to the spoken
    conversation, and a reply nobody is listening for is a bill for
    nothing. */
 if(fresh&&ST_WANT_LISTEN)stSrcSpeak(cur.q);
 /* the dot used to be rebuilt here on every key and put back on the beat.
    Since round QB it lives in the Journal row, which a key never rewrites,
    so it is locked once a render with the halo, and again when it lets go,
    see srcHearing. Locking on every key cost a forced layout a key, measured
    143 to 190 over the same typed line, and that cost is gone with it. */
 /* a screen reader hears the opener, an ask, "Cool.", and while listening
    only a question the person pressed for. */
 var said=turn.move==='safe'?safeSay:turn.move==='open'?q:(turn.move==='ask'?ask:(turn.move==='pass'?'Cool.':turn.move==='vent'?SRC_LISTENING
  :((SRC_DQ||SRC_QI>=0)?q:'')));
 /* talking, every turn Source AI takes is a line it says, once */
 if(cur)said=cur.q;
 var sy=document.getElementById('srcsay');
 if(sy&&sy.textContent!==said)sy.textContent=said;
 var mv=document.getElementById('srcpass');
 if(mv)mv.onclick=function(){SRC_PASSED=true;
  SRC_LOG.forEach(function(r){if(r.k===turn.why&&r.seat===turn.seat)r.moved=true;});
  srcPaint();};
 var press=function(id,fn){var b=document.getElementById(id); if(!b)return;
  b.onclick=function(){fn(); if(STV.chat)SRC_CPRESS=true; srcPaint();
   var a=document.getElementById(id); if(a)a.focus();};};
 press('srcnew',function(){SRC_DNONE=false; srcNextQ();});
 press('srcdyn',function(){
  var d=srcDyn(STR.heard||heard,(CURP&&CURP.story&&CURP.story.entries)||[],ST_TEXT);
  SRC_DNONE=!d; if(d)SRC_DQ=d;});}
/* ONE CLOCK FOR THE PANEL, round PW. Every loop on the Source AI panel is on
   the Field's 4.2 second breath or twice it, and each is created at a
   different moment: the halo, the bar and the floor once a render, the dot
   on every key. Started bare, each breathes from whenever it was made, so
   the dot, rebuilt on a key, falls out of step with the halo it sits in.

   A delay worked out from the clock at the moment the markup is written was
   the first cut, and measured it was not enough: an animation starts on the
   next frame and not when its markup is written, and with keys arriving the
   dot came back 319ms behind the halo, a fourteenth of a breath. So the start
   is set on the animation itself, after it exists: every one of these starts
   at the document's own zero, and so all of them are on the same beat
   however late each was made. Only the named loops are touched; the words
   landing and the caret are one shot and keep their own start. */
/* frflow joined at Talk: the thread's pulses are rebuilt on every repaint of
   the column, and on this clock a rebuilt pulse lands where it already was. */
var SRC_LOOPS={srcHalo:1,srcPass:1,srcBreath:1,srcWind:1,frflow:1};
function srcLock(el){
 if(!el||typeof el.getAnimations!=='function')return;
 el.getAnimations({subtree:true}).forEach(function(a){
  if(SRC_LOOPS[a.animationName])a.startTime=0;});}
/* THE FLOOR. The Field's ring of addresses, unrolled: the two below the body,
   the seven seats Root to Crown in the ring's own order, W, then the two
   above, which is FIELD split by the side it extends. One tick per address,
   as tall as its charge, a fifth of the floor at nothing and all of it at
   ten, so a blank profile is an even comb and never an empty strip. The
   height goes as the square root, the rule the Field's pulses already take
   for tension: most charges sit under three, and on a straight line a
   person carrying 2.5 at the heaviest drew a floor indistinguishable from a
   blank one, measured on Marcus. The ticks are the mask, painted once; the
   colour under them is the seats', one hard stop per seat, through seatCol
   so it follows the lighting; the two outside the body wear the seat they
   extend, his torus, the rule compute already uses for their charge. Nothing is printed and nothing is
   interactive: aria-hidden, and the reading it draws is the Field's. */
function srcComb(){
 var lo=FIELD.filter(function(n){return n.b==='Field-Below';}),
     hi=FIELD.filter(function(n){return n.b==='Field-Above';}),
     L=lo.concat(W,hi), N=L.length; if(!N)return '';
 var seat=function(n){return n.b==='Field-Below'?'Root':(n.b==='Field-Above'?'Crown':n.b);};
 var r='';
 for(var i=0;i<N;i++){var v=Math.sqrt(clamp((+L[i].sq||0)/10,0,1)),h=2+8*v;
  r+='<rect x="'+(i+.3)+'" y="'+(10-h).toFixed(2)+'" width=".4" height="'+h.toFixed(2)+'"/>';}
 var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+N+' 10" preserveAspectRatio="none">'+r+'</svg>';
 var m='url(&quot;data:image/svg+xml,'+encodeURIComponent(svg).replace(/'/g,'%27')+'&quot;)';
 var stops=[],a=0;
 while(a<N){var s=seat(L[a]),b=a; while(b<N&&seat(L[b])===s)b++;
  var c=seatCol(s);
  stops.push(c+' '+(a/N*100).toFixed(2)+'%',c+' '+(b/N*100).toFixed(2)+'%'); a=b;}
 return '<i class="src-comb" aria-hidden="true" style="-webkit-mask-image:'+m+';mask-image:'+m+'">'
  +'<i class="src-seats" style="background:linear-gradient(90deg,'+stops.join(',')+')"></i>'
  +'<i class="src-wind"></i></i>';}
/* WHAT WAS LAST ON SCREEN, so a repaint that changes nothing moves nothing.
   The column is rewritten on every key, and a question that faded in on
   every key would be motion saying something new landed when nothing had. */
var SRC_SHOWN='', SRC_DNONE=false, SRC_HT=0, SRC_HX=null;
/* A QUESTION LANDS WORD BY WORD, round LT, his words: "I want Source AI to
   feel like it's a thinking system ... makes that text look like it's
   alive." And from round GQ, the same ask the first time: "I want it to feel
   dynamic and alive when the text gets typed ... like there's a little brain
   behind it. And I want it to feel a little digital."

   Only a question that is new to the screen lands. Each word arrives in the
   accent and settles to ink, one after the other at the product's stagger,
   and a block caret blinks twice at the end of it and goes. The words are
   real text the whole time, in order, with their spaces, so a copy, a find
   and a screen reader all read the sentence and never the pieces. There is
   no pause before it: a delay dressed as thought, on a reader that answers
   in a millisecond, would be the product pretending. */
function srcLand(cls,q,style){
 var id=cls.indexOf('src-open')===0?' id="srcq"':'';
 var st=style?' style="'+style+'"':'';
 if(!q||q===SRC_SHOWN)return '<p class="'+cls+'"'+id+st+'>'+esc(q)+'</p>';
 var ws=String(q).split(' ');
 return '<p class="'+cls+' src-land"'+id+' style="--n:'+ws.length+(style?';'+style:'')+'">'
  +ws.map(function(w,i){return '<span class="src-w" style="--i:'+i+'">'+esc(w)+'</span>';}).join(' ')+'</p>';}
/* AND IT HEARS AS THE PERSON TYPES. srcHear reads the whole entry again on
   every key, which is true, and until now nothing on the screen said so. The
   light on the accent bar runs quick and bright while keys are coming and
   settles back to a slow pass about a second after the last one. It is on the
   host, which outlives the repaint, so the run is not restarted by the key
   that keeps it running. */
function srcHearing(h){
 var t=ST_TEXT;
 if(SRC_HX===null){SRC_HX=t;return;}
 if(t===SRC_HX)return;
 SRC_HX=t;
 if(!t.trim()){h.classList.remove('hear');return;}
 h.classList.add('hear');
 clearTimeout(SRC_HT);
 SRC_HT=setTimeout(function(){var e=document.getElementById('stsrc');
  /* the live dot's own lock call is gone with the dot, round of 29
     October; .hear itself still drives #stsrc's own halo and stays */
  if(e)e.classList.remove('hear');},1100);}
/* ============================================================
   TALK. PLAN.md section C item 4, his words: "make source a socially chat
   interactive," "add a button where I can just have a conversation back and
   forth," and "make it look like the soul."

   NOTHING NEW DECIDES ANYTHING. The four moves are srcTurn's, the questions
   are srcAsk's, the walk's and srcDyn's, Move on is the same button, and
   srcLog still writes one kind and one seat per question shown. This is the
   same loop the panel above runs, drawn as a thread: what the person wrote,
   turn by turn, and what Source AI said back.

   A REPLY IS APPENDED TO THE ONE ENTRY, AND THAT IS A DECISION WITH A
   MEASUREMENT BEHIND IT. The other way was each reply a message of its own,
   read on its own. That breaks two things srcHear already gets right only
   because it reads the entry as one text:
     the rung   a seat comes back across turns. "I am afraid" then "still
                afraid" reads rung 7 and asks, as one text; read apart, each
                is one mention and nothing would ever be asked in a
                conversation, which is where a story most comes back.
     negation   srcNegated reads the two words before a mention, cut at a
                sentence end by clauseFloor. Measured on engine.js with "I did
                not sleep" then "afraid all night.": joined by a space, afraid
                reads negated, the first turn's "not" reaching into the
                second; joined by a newline it reads root, rung 5, exactly
                what "afraid all night." reads alone. A newline is in
                SENT_END, so the turn is a boundary the reader already honours.
   So a reply is the old text with its trailing spaces cut, a newline, and the
   reply. The trailing spaces are cut because normMap maps a run of
   punctuation and spaces to its FIRST raw character: "sleep \nafraid" puts
   the space first and the boundary is lost, measured, the afraid read as
   negated again. A turn the person ended on a comma loses it the same way,
   and that is left as it is rather than editing their text: negation only
   ever removes a mention, so the cost is a seat heard less, the cheap miss
   sourceai.js already chose over asking about what someone said they were
   not.

   WHAT THE THREAD HOLDS, AND THAT IT IS NEVER KEPT. SRC_CHAT is page memory
   beside ST_TEXT, cleared by srcFresh on Clear and on commit, and nothing in
   stCommit reads it: the entry still keeps text, bands and srcAsked(SRC_LOG),
   a kind and a seat per question and never its words. A Source AI row holds
   the line it said, so the thread can show it; a reply row holds offsets into
   ST_TEXT and the reply as sent, which is only how the thread notices the
   entry was edited in the box. tests/srcchat.js commits a conversation and
   checks the record holds nothing else.

   ONE QUESTION ON SCREEN, STILL. Only the newest Source AI row carries its
   words. Every earlier one is its ring on the thread, so a person reading
   back sees their own words in full and one live question, never a column of
   them to answer. And it never asks the same why twice: an ask about the seat
   it is already asking about updates that row in place, the way the panel's
   one question updates its count, rather than landing as a second ask.

   THE THREAD IS THE FIELD'S, AND ITS NUMBERS ARE ITS READING. Round LV kept
   the Field's canvas off this page, and this keeps to that: no canvas. The
   threads are the renditions' half of pulses() that rings.js already draws in
   markup, frFlow, on its numbers: a wire hangs by the tension of what it
   carries, the bow 1.28 less 0.62 of it, and carries a pulse seven long, a
   period from 96 slack to 48 taut and a speed from 16 to 84 pixels a second on
   the square root, running from the earlier turn to the newer, toward now.
   The tension is the rung the reading stood at on that turn, tenths of ten,
   and the colour its seat's. So as a story comes back to one place the wire
   it is written on tightens, quickens and takes that seat's colour, and a
   conversation that has found nothing hangs slack and runs slow and faint.
   Nothing on it is decoration. Reduced motion, quiet and rm keep the wires,
   which are the reading, and drop the pulses, which are motion.
   ============================================================ */
var SRC_CHAT=[], SRC_CPRESS=false, SRC_CDRAFT='';
/* WHAT SOURCE AI SAYS ON THIS TURN, as a row, from the move srcPaint already
   chose. The key is what makes two rows the same turn: an ask is the seat and
   the why, so its count updating is not a new question. Listening it says
   back what it heard, the person's own words and the place they land, in
   srcAsk's own wording, and asks nothing, srcTurn's listen; a question the
   person pressed for since their last reply stands instead. */
function srcChatCur(turn,heard,q,ask){
 var top=heard&&heard.top, r={rg:top?top.rung:0, bd:turn.band||(top?top.band:null), mv:turn.move};
 if(turn.move==='open'){r.key='open|'+q; r.q=q; r.w='src'; return r;}
 /* NEVER THE SAME LINE TWICE RUNNING, 31 October. Since srcChatNote gives
    every turn its own new row, a reply that is the same as the last one
    would be said again word for word, which is the other half of what he
    heard as a script. So each move offers its lines in order and srcPick
    takes the first not yet said in this conversation, and failing that the
    first that is not the line just said, with SRC_HEARD always behind
    them. said is srcSaidBefore, the lines the person has replied under,
    which leaves out the row being repainted, so a repaint picks what the
    push picked. */
 var said=srcSaidBefore(), keys=srcChatKeysBefore(), lines;
 if(turn.act){r.key='act|'+turn.act; lines=SRC_ACT_SAY[turn.act];}
 /* an ask's key carries the family question since round SK: the lead's
    count still updates in place, and a new question after a reply is a new
    turn, never the earlier one rewritten under the person's answer */
 else if(turn.move==='ask'){r.key='ask|'+turn.seat+'|'+turn.why+'|'+((SRC_VET&&SRC_VET.cand&&SRC_VET.cand.base)||''); lines=[ask];}
 /* AFTER "Cool." IT STILL ANSWERS, AND STILL ASKS NOTHING. Move on was a
    key that never changed, so every turn after it was the same row updated
    in place, and a person who moved on was met with silence for the rest
    of the entry (the diagnosis, transcripts 3 and 5). "Cool." is said once,
    for the turn or the press that moved on; every turn after it is
    listened to. Venting is the same: "I'm listening." once, then listened
    to. Neither ever asks, which is what both rulings say. */
 else if(turn.move==='pass'){
  if(keys.some(function(k){return /^pass/.test(k);})){r.key='pass|'; lines=[];} else {r.key='pass'; lines=['Cool.'];}}
 else if(turn.move==='vent'){
  if(keys.some(function(k){return /^vent/.test(k);})){r.key='vent|'; lines=[];} else {r.key='vent'; lines=[SRC_LISTENING];}}
 else if(SRC_CPRESS&&!SRC_DNONE){r.key='q|'+q; lines=[q]; r.mv='asked';}
 /* LISTENING, IT SAYS BACK THE THREAD, round SK. Two changes, both his
    blueprint's. The seat is the ledger's thread, the one with the newest
    evidence, where it was srcHear's top: on the document's own section 40
    session the top held "want to disappear" three turns running after
    "guilty" arrived, and the chat said the same line three times. And the
    place is said only once the person confirmed the seat (EV_PLACEABLE),
    the seam package's "no unconfirmed ontology label", stricter than the
    4 October document's section 23, "only when evidence supports it". So
    it says the words and not the place, which is the Mirror. The chart
    still draws the lane. */
 /* a seat the person turned down is not said back to them either: with no
    other thread, Source AI listens, round SK */
 else if(top&&!srcLedgerNow().thread&&srcLedgerNow().claims[top.seat]&&
  ['rejected','corrected'].indexOf(srcLedgerNow().claims[top.seat].state)>=0){r.key='say|'; lines=[SRC_LISTENING];}
 else if(top){var L=srcLedgerNow(), c=(L.thread&&L.claims[L.thread])||top, w=srcQuote(c.words), ctx={text:srcConvText(), ledger:L};
  var line=(w?'You wrote '+w+'. ':'')+'It lands '+srcPlace(c.band)+'.';
  if(!srcVetSay(line,ctx,c.seat).ok)line=w?'You wrote '+w+'.':srcNone();
  /* the same word said again is said back with how often, and only when
     that count is the ledger's own and the line passes the same checks */
  var more=(w&&(c.words||[]).length===1&&(+c.mentions||0)>1)?'You wrote '+w+' '+srcTimes(c.mentions)+'.':'';
  r.key='say|'+c.seat; lines=[line].concat(more&&srcVetSay(more,ctx,c.seat).ok?[more]:[]);}
 else{r.key='say|'; lines=[srcNone()];}
 r.q=srcPick(lines.concat(SRC_HEARD),said);
 r.w='src'; return r;}
function srcPick(lines,said){
 var prev=said.length?said[said.length-1]:null, i;
 for(i=0;i<lines.length;i++)if(lines[i]&&said.indexOf(lines[i])<0)return lines[i];
 for(i=0;i<lines.length;i++)if(lines[i]&&lines[i]!==prev)return lines[i];
 return lines[0]||'';}
/* the keys of the Source AI rows the person has replied under, srcSaidBefore's
   rule read for keys. "Cool." and "I'm listening." are said once in the whole
   conversation, so it is any of them and not only the last: a turn that is
   only talk after Move on is answered as talk, and the turn after that must
   not say "Cool." and its note again. */
function srcChatKeysBefore(){
 var out=[], pend=null;
 SRC_CHAT.forEach(function(r){if(r.w==='src'){pend=r.key||''; return;} if(pend!==null){out.push(pend); pend=null;}});
 return out;}
/* THE NEWEST TURN, IF IT IS ONLY TALK: srcAct's act, or shift for a change
   of subject, and only when the turn carries no seat of its own. A turn
   that is about the conversation in srcIntent's other three senses already
   has its own answer (Move on, venting, a no), so it is never an act. */
function srcActNow(){
 var t=null; SRC_CHAT.forEach(function(r){if(r.w==='me')t=r.t;});
 if(!t)return null;
 var it=srcIntent(t);
 if(it&&it.intent!=='shift')return null;
 if(srcHear(t,null).seats.length)return null;
 if(it)return 'shift';
 var a=srcAct(t); return a?a.act:null;}
/* THE REPLIES STILL MATCH THE ENTRY. Text added in the box, or by Record,
   since the last row is the person's next turn. Text changed inside an
   earlier turn means the rows no longer say what the entry says, so the
   thread starts again from the entry as one turn rather than show a
   conversation that is not the one on the record. */
function srcChatSync(){
 var t=ST_TEXT, end=0, okk=SRC_CHAT.every(function(r){
  if(r.w!=='me')return true; end=r.b; return t.slice(r.a,r.b)===r.t;});
 /* the subject's start was an offset into the entry the rows described */
 if(!okk){SRC_CHAT=[]; end=0; SRC_FROM=0;}
 var tail=t.slice(end), lead=tail.length-tail.replace(/^\s+/,'').length, v=tail.trim();
 if(v)SRC_CHAT.push({w:'me', a:end+lead, b:end+lead+v.length, t:v});}
/* A NEW TURN IS NOTED, OR THE LAST ONE IS UPDATED. Same key, the same turn
   with its words refreshed. Nothing written since a question the person
   pressed for, or since a line said back, and the new one takes its place:
   pressing for another question is asking for that one instead. Otherwise it
   is a new turn, and the one before it folds to its ring.

   A PERSON WHO HAS SPOKEN GETS A NEW TURN, ALWAYS, 31 October. The same key
   rule above ran first whatever had happened since, so a reply with the
   key of the last bubble updated that bubble in place and added nothing.
   Every turn with no seat in it is key say|, every vented turn vent, every
   turn after Move on pass, so his second "can you hear me" drew nothing on
   screen and nothing in the ear (reviews/source-ai-conversation-diagnosis-
   2026-10-31.md, transcript 1). The rule is from 3 October, when the chat
   was a ring whose one live row was the only one with words, and updating
   it was right; the thread became a text window that prints every turn on
   29 October and this was not revisited. Updating in place is for a
   repaint with no new turn from the person, which is all it was ever for.

   Returns true when it added a row Source AI has not said yet, which is
   what srcPaint speaks. The opener is not one: Talk greets on its own. */
function srcChatNote(cur){
 var li=-1, after=false;
 SRC_CHAT.forEach(function(r,i){if(r.w==='src'){li=i; after=false;} else if(li>=0)after=true;});
 var L=li>=0?SRC_CHAT[li]:null;
 if(after){SRC_CHAT.push(cur); return true;}
 if(L&&L.key===cur.key){L.q=cur.q; L.mv=cur.mv; L.rg=cur.rg; L.bd=cur.bd; return false;}
 if(L&&/^(open|q|say)\|/.test(L.key)){SRC_CHAT[li]=cur; return false;}
 SRC_CHAT.push(cur);
 return !/^open\|/.test(cur.key);}
/* A TURN LANDS. The reply joins the entry on its own line, see the block
   above for why a newline and why the trailing spaces go, and the page
   reads it the way a key in the box is read: parse, then stRefresh, which
   repaints the thread. One door for a turn to land through, typed or
   spoken (see stMic), so Source AI asks and the bank fills exactly the
   same way whichever one it was. */
/* the seam package's own line for VENT, 06_DIALOGUE_TDD.md: "I'm listening."
   [No evaluation or immediate excavation.] */
var SRC_LISTENING='I\u2019m listening.';
/* WHAT SOURCE AI SAYS TO A TURN THAT IS ONLY TALK, 31 October, read by
   srcAct and srcIntent's shift in engine/evidence.js. Before this every one
   of them got the panel's status line, "Nothing placed yet, so nothing is
   asked", or silence. Each answers what was actually said, in as few words
   as stay true, and each list runs in order so a second "can you hear me"
   is answered and never with the first answer again (srcPick).

     check  he asked whether it hears him. It says yes, first, and then
            hands him the opener's own question, SRC_OPEN, his ruled line,
            rather than a second wording of it. The second says where his
            words go, which is the true sign it heard: they are on the
            right, in his bubble.
     greet  a greeting back, the opener's question again, and nothing
            about how Source AI is, since it is not anything.
     ask    what it is, said as what it does, no more than the engine
            does: it reads where what he says sits in his body and asks
            one question at a time. "find where it sits" names no place,
            which point 7 keeps for a seat he confirmed.
     brief  a yeah is an answer with nothing in it, so it asks for one
            sentence more, and never steps to the next family question
     shift  the old subject set down, his physical word for it, and the
            floor moved under it (SRC_FROM). Asking goes on, about what he
            says next.
   None holds a why, a place, a canon name or a feeling word, so each
   passes srcVetSay as written; tests/srcchat.js holds that. */
var SRC_ACT_SAY={
 check:['Yes, I hear you. '+SRC_OPEN, 'I hear you. Every sentence you say shows up on the right.',
  'Still here, and I hear you. Say what happened.'],
 greet:['Hello. I hear you. '+SRC_OPEN, 'Here, and listening. What happened today?', 'Still here. Say what happened.'],
 ask:['I am Source AI. You say what happened, and I find where it sits in your body. I ask one question at a time.',
  'I work only from what you say. Say one thing that happened today.',
  'Say what happened, in your own words. I follow where it goes.'],
 brief:['Say more about that.', 'Go on. One sentence about what happened.', 'Keep going.'],
 shift:['Okay. We set that down. What do you want to talk about instead?', 'Okay, new subject. Go ahead.', 'Okay. What is next?']};
/* listening, with nothing asked: what stands behind every list, so no turn
   is ever answered with the line it was answered with last time */
var SRC_HEARD=[SRC_LISTENING, 'Go on.', 'Still here. Keep going.'];
/* A TURN THAT IS ABOUT THE CONVERSATION, round SK, read by srcIntent in
   engine/evidence.js before the turn lands. Move on said in words is the
   Move on button, exactly: the same flag, the same outcome kept on the
   entry. A no to a reading is a verdict on the claim Source AI was on, the
   one it last asked about or the thread it last said back, and nothing is
   kept beyond the entry. Venting is listened to. A change of subject sets
   nothing here: srcTurnCommit moves SRC_FROM once it knows where the turn
   lands in the entry. */
function srcIntentLand(v){
 var it=srcIntent(v); if(!it)return null;
 if(it.intent==='move_on'){
  if(!SRC_PASSED&&SRC_LOG.length)SRC_LOG[SRC_LOG.length-1].moved=true;
  SRC_PASSED=true;}
 else if(it.intent==='vent')SRC_VENT=true;
 else if(it.intent==='reject'){
  var L=srcLedgerNow(), seat=(SRC_VET&&SRC_VET.cand&&SRC_VET.cand.target)||L.thread;
  if(seat){var r=evVerdict(SRC_VERDICTS,seat,'no'); if(r.ok)SRC_VERDICTS=r.verdicts;}}
 return it;}
/* UNI'S ONE OWNER, 9 November. Three places would otherwise push her: a
   turn landing here, the record moving under render(), and stRender
   remounting her on a tab return or a dashboard toggle. One function and
   one held snapshot mean a stale push from an old render can never land
   over a fresh one, and nothing calls a setter twice for the same value --
   setEmotion is a RETRIGGER (restarts her pose timer, spawns rings), not a
   setter, measured in the systems review, so equal-value calls are not
   merely wasted, they are a visible defect. */
var UNI_LAST={unread:null,cq:null,dq:null,fam:null,rank:null};
function uniApply(parsed){
 if(typeof window==='undefined'||!window.Uni)return;
 /* THE DOOR IS A DOOR AND NOT AN ALARM, carried here from the crisis
    ruling (storyui.js's own entry-kept message, and engine/data/crisis.js):
    "no modal, no sound, no red, no 'we noticed', and nothing escalates."
    A face that visibly reacted the moment srcSafe tripped would be exactly
    that escalation in a different channel, so every voluntary push below
    (coherence, shadow, emotion) is skipped whole for this call. Her
    involuntary channels, blink and breath, are not reached by any of this
    and keep running regardless -- a held pose, not a frozen one. */
 if(typeof srcSafe==='function'&&srcSafe(ST_TEXT))return;
 var r=(typeof computeSeen==='function')?computeSeen():null;
 if(r){
  if(r.unread!==UNI_LAST.unread){
   UNI_LAST.unread=r.unread;
   if(window.Uni.setUnread)window.Uni.setUnread(!!r.unread);}
  if(!r.unread){
   if(UNI_LAST.cq!==r.CQ){UNI_LAST.cq=r.CQ; if(window.Uni.setCoherence)window.Uni.setCoherence(r.CQ);}
   if(UNI_LAST.dq!==r.DQ){UNI_LAST.dq=r.DQ; if(window.Uni.setDQ)window.Uni.setDQ(r.DQ);}}}
 var u=(parsed&&typeof uniFromParsed==='function')?uniFromParsed(parsed):null;
 var fam=u?u.family:null, rank=u?u.rank:null;
 if(fam&&(fam!==UNI_LAST.fam||rank!==UNI_LAST.rank)){
  UNI_LAST.fam=fam; UNI_LAST.rank=rank;
  if(window.Uni.setEmotion)window.Uni.setEmotion(fam,rank);}}
function srcTurnCommit(v){
 v=String(v||'').trim(); if(!v)return false;
 var it=srcIntentLand(v);
 srcChatSync();
 var base=ST_TEXT.replace(/\s+$/,''), a=base.length+(base?1:0);
 ST_TEXT=base+(base?'\n':'')+v;
 /* a change of subject moves the conversation's start to this turn, which
    is kept in it because it may already name the new subject; see
    SRC_FROM */
 if(it&&it.intent==='shift')SRC_FROM=a;
 SRC_CHAT.push({w:'me', a:a, b:ST_TEXT.length, t:v});
 ST_PARSED=parseStory(ST_TEXT); stRefresh();
 uniApply(ST_PARSED);
 return true;}
/* SEND, the typed door onto srcTurnCommit. */
function srcChatSend(){
 var cin=document.getElementById('stcin'), v=String(cin?cin.value:SRC_CDRAFT).trim();
 if(!srcTurnCommit(v))return false;
 SRC_CDRAFT=''; SRC_CPRESS=false; if(cin){cin.value=''; cin.focus();}
 return true;}
/* the reply line. Enter sends and Shift and Enter is a new line, the way a
   conversation box works everywhere else; a draft is kept across a repaint
   of the page and across a reload, the same promise stDraft keeps for the
   entry itself (see the block above it), and Commit counts it as something
   to commit. */
function srcChatWire(){
 var cin=document.getElementById('stcin'); if(!cin)return;
 var ap=document.getElementById('stapply');
 cin.oninput=function(){SRC_CDRAFT=cin.value; stDraft(); if(ap)ap.disabled=!ST_PARSED&&!cin.value.trim();};
 cin.onkeydown=function(e){if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault(); srcChatSend();}};
 cin.onfocus=function(){stFocus('write');};
 if(ap&&SRC_CDRAFT.trim())ap.disabled=false;
 var sd=document.getElementById('stcsend');
 if(sd)sd.onclick=function(){srcChatSend(); cin.focus();};}
/* THE THREAD IS A TEXT WINDOW NOW, round of 29 October, his words, looking
   at the ring-and-wire build: "the chat area is fucking hideous. Get rid
   of that daisy chain chat that's no longer happening. This is now a text
   window between AI on the left, me on the right." The wire, the pulse and
   the node ring are gone; a turn is a bubble, Source AI's on the left,
   the person's on the right, oldest at the top, the way every other chat
   window reads. The newest Source AI row still carries the same controls
   the panel does, under the same ids, so srcPaint wires them without
   knowing which view it drew.

   EVERY TURN PRINTS NOW, past ones included. The ring design held only the
   last Source AI turn to a question and showed nothing for an earlier one,
   on purpose (tests/srcchat.js still holds a probe proving that rule would
   have been caught if broken). A text window is read the way any chat is,
   top to bottom, so the words a person is scrolled past are read the same
   as the ones in front of them; a ring with nothing in it had no equivalent
   once there was no ring. srcchat.js's own check reads the new rule:
   the thread is the whole conversation in order, not one line at a time. */
/* THE PERSON'S OWN BUBBLE SHOWS WHAT THE SNIFFER FOUND, round of 29
   October, his words: "sentences that are sniffed are bolded with their
   chakra color. The intensity modifier is italicized... as a person's
   having their text conversation, they're seeing visually the construct
   of their story." THE RULING ITSELF IS OLD: "Bold and coloured" is
   already the rule at .st-f in the shell, reverted there only because
   that layer sits behind a live textarea and bold glyphs are wider than
   the box's own 300 weight, which drags the caret out of register with
   what a person is looking at. A bubble is not a textarea overlay and
   carries no caret to protect, so the true ruling runs here unreverted:
   real bold, real colour, real italic on a mark whose intensity was
   modified (m.mod, storyHits). The struck and dashed-underline treatments
   for a no and an about-someone-else word are the same rules stHLHtml
   already draws, read off the same STR.marks, so the two surfaces never
   disagree about which letters were scored.

   READ OFF STR.marks, THE WHOLE ENTRY'S OWN MARKS, SLICED TO THE TURN.
   marksOf runs on the whole accumulated text, not a fragment, so a turn's
   own marks are exactly the ones whose span falls inside its own [a,b)
   stretch of ST_TEXT; stRead() keeps STR.marks current with ST_TEXT on
   every refresh, srcTurnCommit's own call to stRefresh() included, so by
   the time srcThread runs after a commit the marks for the turn just
   landed are already there. */
function srcMeHtml(from,to){
 var marks=STR.marks.filter(function(m){
  var back=m.neg?m.negFrom:m.oth?m.whoFrom:null;
  var start=(back!=null)?back:m.s;
  return start>=from&&m.e<=to;});
 if(!marks.length)return esc(ST_TEXT.slice(from,to));
 var out='',last=from;
 marks.forEach(function(m){
  var back=m.neg?m.negFrom:m.oth?m.whoFrom:null;
  var start=(back!=null&&back>=last)?back:m.s;
  out+=esc(ST_TEXT.slice(last,start))
   +'<mark class="src-f'+(m.neg?' neg':m.oth?' oth':'')+(m.mod?' mod':'')+'" '
   +'style="--c:'+(m.bn?seatCol(m.bn):'var(--accent)')+'">'
   +esc(ST_TEXT.slice(start,m.e))+'</mark>';
  last=m.e;});
 return out+esc(ST_TEXT.slice(last,to));}
function srcThread(turn,heard,cur,acts,why){
 var ents=(CURP&&CURP.story&&CURP.story.entries)||[], pr=null, last=-1;
 SRC_CHAT.forEach(function(r,i){if(r.w==='src')last=i;});
 var o='<ol class="src-th" aria-label="Conversation">';
 SRC_CHAT.forEach(function(r,i){
  /* a reply's reading is the entry as it stood when it was sent */
  if(r.w==='me'&&r.rg===undefined){pr=pr||srcPrior(ents);
   var hh=srcHear(ST_TEXT.slice(0,r.b),pr); r.rg=hh.top?hh.top.rung:0; r.bd=hh.top?hh.top.band:null;}
  var cls='src-tn src-tn-'+(r.w==='me'?'me':(i===last?'now':'past'));
  o+='<li class="'+cls+'"'+(r.w==='src'&&i!==last?' aria-label="An earlier turn"':'')+'>';
  /* ONE BUBBLE SHAPE, round of 29 October: see the ruling at .src-bub in
     the shell. The per-turn seat colour on the AI bubble's edge is gone
     with its own border scheme; r.bd and the rung read above still feed
     srcThreadNow's own seat colour where a live ask still uses one
     (srcLand's style argument), unrelated to the bubble's own ground. */
  if(r.w==='me')o+='<div class="src-bub src-bub-me"><p class="src-me">'+srcMeHtml(r.a,r.b)+'</p></div>';
  else if(i===last)o+='<div class="src-bub src-bub-src">'+srcThreadNow(r,turn,heard,acts,why)+'</div>';
  else o+='<div class="src-bub src-bub-src src-bub-past"><p class="src-q">'+esc(r.q)+'</p></div>';
  o+='</li>';});
 return o+'</ol>';}
/* the thread beside an entry srcSafe stops (srcPaint above): the person's
   rows as they are, every Source AI row as an earlier turn, and the safe
   row, already built, where the reply would be */
function srcThreadSafe(row){
 var o='<ol class="src-th" aria-label="Conversation">';
 SRC_CHAT.forEach(function(r){
  if(r.w==='me')o+='<li class="src-tn src-tn-me"><div class="src-bub src-bub-me"><p class="src-me">'+srcMeHtml(r.a,r.b)+'</p></div></li>';
  else o+='<li class="src-tn src-tn-past" aria-label="An earlier turn"><div class="src-bub src-bub-src src-bub-past"><p class="src-q">'+esc(r.q)+'</p></div></li>';});
 return o+'<li class="src-tn src-tn-now">'+row+'</li></ol>';}
/* the one live Source AI row, in the panel's own markup for each move.
   NO GAUGE AND NO WHY HERE ANY MORE, round of 28 October, his words: "I
   don't want to see the questions written out, this needs to be a two-way
   conversation between me and the source." A labelled "Why" paragraph and a
   rung gauge beside "Next question" are a readout glued to the side of the
   conversation, not a thing either side would say. What Source AI actually
   says is still exactly r.q, word for word; the reasoning that used to
   print here still runs and still decides what gets asked (srcWhy, srcLog),
   it is only no longer printed as its own block. */
function srcThreadNow(r,turn,heard,acts,why){
 var o='';
 if(turn.move==='ask')
  o+=srcLand('src-q',r.q,'--c:'+seatCol(turn.band))
   +'<div class="src-row"><button type="button" class="btn" id="srcpass">Move on</button>'
   +'<span class="src-note">Answer below, or leave it.</span></div>';
 /* the row's own words since 31 October: after "Cool." a turn is answered
    with a listening line, and the note stands under "Cool." alone */
 else if(turn.move==='pass')
  o+='<p class="src-q">'+esc(r.q)+'</p>'+(r.key==='pass'?'<p class="src-note">Nothing more asked in this entry.</p>':'');
 else if(turn.move==='vent')
  o+='<p class="src-q">'+esc(r.q)+'</p>';
 else{
  o+='<div class="src-ask">'+srcLand('src-open'+(r.key.indexOf('say|')===0?' quiet':''),r.q)+acts+'</div>';
  if(SRC_DNONE&&turn.move==='open')
   o+='<p class="src-note">Nothing read yet, so there is nothing of yours to ask from. Write a line first.</p>';}
 return o;}
/* THE THREAD SETTLES AFTER THE ROWS ARE ON THE PAGE. This used to lay the
   wire and the pulse down a row at a time, sized off each row's own
   height once it had one; there is no wire any more (see the ruling at
   srcThread above), so what is left is what that code also always did:
   the panel's one clock locks here so a repaint does not restart the live
   dot's own breathing, and the thread opens scrolled to its newest turn,
   the bottom, the way a text window opens on whatever was said last. Kept
   under its old name: stRender's own call site finds it by name and
   nothing about when it runs changed, only what it had to do once it got
   here. */
function srcWire(h){
 srcLock(h);
 var th=h.querySelector('.src-th'); if(th)th.scrollTop=th.scrollHeight;}
/* THE RAIL HOST IS STATIC, SO IT IS EMPTIED ON THE WAY OUT. A hidden surface
   never sits in the document asserting a stale reading, the rule Summary
   already keeps. setTab calls this on every tab but Story. The bank closes
   with it, so the rail a person comes back to on another tab is that tab's. */
function stRailClear(){
 var e=document.getElementById('imp'); if(e&&e.innerHTML)e.innerHTML='';
 STV.bank=false; document.body.classList.remove('st-bank');
 /* and the Full view's left rail goes with it, for the same reason: #stleft
    is a static host in #lcol, and the class that shows it is this tab's.
    STV.dash itself is kept, so a person who left in Full comes back in Full,
    and stRender writes the class again on the way in. */
 var l=document.getElementById('stleft'); if(l&&l.innerHTML)l.innerHTML='';
 document.body.classList.remove('st-full');}

/* ============================================================
   THE LANES. One model decides what a lane is and what order the lanes
   stand in, and the chart and the list both read it, so a sort moves both.
   Ported from proto/story-redesign2 as it was measured, round II.

     seat        body order, crown at the top, root at the foot. Route's order.
     heard       first seat the story reached at the top. Trace's order in time.
     weight      the entry's reading at the seat, parseStory bands, heaviest top
     came back   the rung, srcHear, the seat nearest a question at the top
     charge      lanes are the charge each imprint carries, not the seat: the
                 Imprints page's own Charge grouping, with its symbol
   ============================================================ */
/* CHARGE AND CAME BACK ARE GONE, 10 November, his words: "get rid of
   charge, because I think charge and weight is the same thing. Get rid
   of came back." Charge is not actually weight (it regroups the lanes by
   fetter instead of ordering them by seat, stLaneModel's own
   STV.sort==='charge' branch below), but the two sorts read alike enough
   on screen that his call stands as given. STV.sort starts at 'weight'
   (declared below) and only ever changes from a button click here, so
   dropping these two from the row leaves nothing able to reach either
   state again; the branches that still exist for them (stLaneModel,
   stOpenPattern and the rest) are reachable by nothing and are left
   alone rather than torn out blind. */
var ST_SORTS=[['seat','Seat'],['heard','When heard'],['weight','Weight']];
var ST_BKEY={}; Object.keys(K2BAND).forEach(function(k){ST_BKEY[K2BAND[k]]=k;});
function stLaneModel(){
 var p=ST_PARSED,imps=p?p.imprints:[],rg={},wds={},heard=STR.heard;
 ((heard&&heard.seats)||[]).forEach(function(s){rg[s.band]=s.rung;wds[s.band]=s.words;});
 var first={},cnt={};
 STR.marks.forEach(function(m){if(!m.bn)return;
  if(first[m.bn]==null||m.t0<first[m.bn])first[m.bn]=m.t0; if(!m.aside)cnt[m.bn]=(cnt[m.bn]||0)+1;});
 var seatW={}; BANDS.forEach(function(b){seatW[b]=p&&p.bands[ST_BKEY[b]]?p.bands[ST_BKEY[b]]:0;});
 var byBand={}; imps.forEach(function(im){(byBand[im.band]=byBand[im.band]||[]).push(im);});
 var lanes=[],keyOf;
 if(STV.sort==='charge'&&imps.length){
  var fb={};
  Object.keys(byBand).forEach(function(b){var t={};byBand[b].forEach(function(im){t[im.fetter]=(t[im.fetter]||0)+im.amt;});
   fb[b]=Object.keys(t).sort(function(x,y){return t[y]-t[x];})[0];});
  var L={};
  imps.forEach(function(im){var f=im.fetter,c=CHILD.filter(function(x){return x.nm===f;})[0];
   var o=L[f]=L[f]||{key:'c:'+f,label:f,seat:c?c.seat:im.band,icon:c?c.ic:null,active:true,
    weight:0,rung:0,first:1e9,bands:[],imps:[]};
   o.weight+=im.amt; o.imps.push(im); if(o.bands.indexOf(im.band)<0)o.bands.push(im.band);
   o.rung=Math.max(o.rung,rg[im.band]||0); if(first[im.band]!=null)o.first=Math.min(o.first,first[im.band]);});
  lanes=Object.keys(L).map(function(k){return L[k];}).sort(function(a,b){return b.weight-a.weight||a.first-b.first;});
  keyOf=function(m){return m.bn&&fb[m.bn]?'c:'+fb[m.bn]:null;};}
 else{
  lanes=BANDS.slice().reverse().map(function(b,i){return {key:b,label:b,seat:b,icon:null,band:b,body:i,
   active:seatW[b]>0||cnt[b]>0||first[b]!=null,weight:seatW[b],rung:rg[b]||0,
   first:first[b]!=null?first[b]:1e9,bands:[b],imps:byBand[b]||[],words:wds[b]||[],count:cnt[b]||0};});
  var cmp={seat:function(a,b){return a.body-b.body;},
   heard:function(a,b){return a.first-b.first||a.body-b.body;},
   weight:function(a,b){return b.weight-a.weight||a.body-b.body;},
   rung:function(a,b){return b.rung-a.rung||b.weight-a.weight||a.body-b.body;}}[STV.sort==='charge'?'seat':STV.sort];
  lanes.sort(cmp);
  keyOf=function(m){return m.bn||null;};}
 /* the seat the story keeps returning to, Route's dwell, stress lines on it */
 var dw=null,best=0; Object.keys(cnt).forEach(function(b){if(cnt[b]>best){best=cnt[b];dw=b;}});
 var dwKey=dw?(STV.sort==='charge'?keyOf({bn:dw}):dw):null;
 return {lanes:lanes,keyOf:keyOf,dwell:best>=2?dwKey:null};}
/* THREE VIEWS OF ONE READ, round IW, his words: "add little three icons for
   the three versions of the imprint, so I can see toggle through, see which
   ones I like." All three are drawn on the one canvas off the same marks,
   rungs and bands, so switching changes the drawing and never the reading.
     lanes  what shipped at round IJ: Trace's strip chart with Route's line
            through it and the five sorts. The default, because he approved it.
     ring   mockup A of round HT, proto/story-redesign: the Field small, seven
            seat arcs in the Field's own order, a spoke per kept word.
     strip  mockup C of round HT, Trace as first drawn and as he picked it in
            round IG: fixed body lanes, the newest word at the right edge and
            the chart sliding left as the story is written.
   The sort still orders the list under all three. Only Lanes re-orders its
   chart by it, because the other two were drawn in body order on purpose. */
var ST_VIEWS=[
 ['lanes','Lanes','Lanes: Trace and Route together, the view wired in',
  'M3 20h18M6 17v-4M10 17v-9M14 17v-3M18 17v-7M6 11l4-5 4 6 4-4'],
 ['ring','Ring','Ring: the seven seats as a circle, a spoke for each word kept',
  'M12 3.5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 1 1 0-17M12 9.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 1 1 0-5M12 7V3.5M16.3 14.5l3 1.7M7.7 14.5l-3 1.7'],
 ['strip','Strip','Strip: Trace as first drawn, sliding left as you write',
  'M3 6.5h13M3 12h13M3 17.5h13M19.5 4v16M8 12V9M12 6.5V4M14 17.5v-3']];
/* inline styles only, because the page's stylesheet is not this file's to
   change. .st-ico is the Bank and Vault's own button, so the three carry the
   tap floor, the pressed ring and the Punch treatment those two already have. */
function stViewHtml(){
 return '<span role="group" aria-label="Imprints view" style="display:inline-flex;gap:4px;flex:0 0 auto">'
  +ST_VIEWS.map(function(v){
   return '<button type="button" class="st-ico" data-view="'+v[0]+'" aria-pressed="'+(STV.view===v[0])+'" '
    +'aria-label="'+esc(v[1])+'" title="'+esc(v[2])+'">'+stSvg(v[3])+'</button>';}).join('')+'</span>';}
function stView(v){
 if(STV.view===v)return; STV.view=v;
 /* the Strip's slide is banked from the moment it is up, never before */
 STC.shift=0; STC.lastN=STR.toks.length; stSeatT(); STC.dirty=true;
 /* moved to .st-chd, round of 29 October: see the ruling at stRender */
 document.querySelectorAll('[data-view]').forEach(function(b){
  b.setAttribute('aria-pressed',b.getAttribute('data-view')===v);});}
function stSortPaint(){
 var el=document.getElementById('stsort'); if(!el)return;
 el.innerHTML='<span class="st-eb">Sort</span>'+ST_SORTS.map(function(s){
  return '<button type="button" class="st-rb'+(STV.sort===s[0]?' on':'')+'" data-sort="'+s[0]+'" '
   +'aria-pressed="'+(STV.sort===s[0])+'">'+s[1]+'</button>';}).join('');
 el.querySelectorAll('[data-sort]').forEach(function(b){b.onclick=function(){
  STV.sort=b.getAttribute('data-sort'); stSortPaint(); stRelayout(); stListPaint(); stFocus('read');};});}

/* ============================================================
   THE INSTRUMENT. Trace and Route, one canvas.

   From Trace: every word written is a tick on the floor, left to right in
   the order it was written, and a word the sniffer kept rises into its lane
   as tall as it weighs. From Route: a dashed line runs from each kept word to
   the next, so the story's path through the body is drawn over the bars, and
   the lane the story keeps returning to carries stress lines. The heaviest
   word is named on the chart; where the chart is wide enough, every kept
   word is.

   IT DRAWS ON THE PRODUCT'S OWN FRAME. The main loop in ui/ui.js calls
   stFrame while the Story is up, so there is no second requestAnimationFrame
   running behind another tab, and leaving the tab stops it by construction.
   It paints only while something is moving: the springs, or the stress
   lines, which are still under reduced motion.
   ============================================================ */
var STC={cv:null,g:null,W:0,H:0,dpr:1,lane:{},items:{},prev:{},ro:null,dirty:true,last:0,
 lm:{lanes:[],keyOf:function(){return null;},dwell:null},
 GL:94,GR:64,FLOOR:22,TOP:6,shift:0,lastN:0,
 sync:function(){var now={},items=STC.items;
  STC.stressTo=performance.now()+ST_STRESS_MS;
  /* at is when the word landed, which the Ring's ripple reads. The prototype
     stamped it when the flying chip arrived; there is no chip here, see the
     head of this file, so it is stamped when the read first holds the word. */
  STR.marks.forEach(function(m){now[m.key]=m;
   if(!items[m.key])items[m.key]={m:m,g:REDUCED?1:0,gv:0,alive:true,at:performance.now()};
   else{items[m.key].m=m;items[m.key].alive=true;}});
  Object.keys(items).forEach(function(k){if(!now[k])items[k].alive=false;});
  /* the Strip slides only once the words are packed at their narrowest, the
     prototype's rule: before that each word already moves the strip left by
     a whole step, because the newest word is pinned to the right edge. */
  var N=STR.toks.length;
  if(STV.view==='strip'&&N>STC.lastN&&!REDUCED&&stStripDx()<=3)STC.shift+=(N-STC.lastN)*3;
  STC.lastN=N;
  stSeatT();
  STC.dirty=true;}};
/* the chart's colours, read off the lighting rather than typed. A seat
   colour comes through seatCol, which is the ladder every HTML ring uses. */
function stCol(b){var c=seatCol(b);return /^#[0-9a-f]{6}$/i.test(c)?hx(c):STC.acc;}
function stRgb(s){var m=String(s||'').match(/[\d.]+/g); if(!m||m.length<3)return null;
 var v=m.slice(0,3).map(Number);
 /* color(srgb 0.1 0.2 0.3) is what a colour built with color-mix computes to */
 if(/^color\(/.test(s))v=v.map(function(x){return Math.round(x*255);});
 return v;}
function stInk(){
 var w=document.getElementById('stcvw'), k=w&&w.querySelector('.st-cvk');
 STC.ink=(w&&stRgb(getComputedStyle(w).color))||[239,237,232];
 STC.dim=(k&&stRgb(getComputedStyle(k).color))||[148,144,138];
 STC.acc=(k&&stRgb(getComputedStyle(k).borderTopColor))||[126,184,212];}
function stSize(){
 var w=document.getElementById('stcvw'), cv=document.getElementById('stcv'); if(!w||!cv)return;
 STC.cv=cv; STC.g=cv.getContext('2d');
 STC.dpr=Math.min(2,window.devicePixelRatio||1);
 STC.W=w.clientWidth; STC.H=w.clientHeight;
 cv.width=Math.round(STC.W*STC.dpr); cv.height=Math.round(STC.H*STC.dpr);
 /* a narrow chart gives the lane names the room and drops the gutter a
    word would otherwise be named in */
 STC.GL=STC.W<420?84:94;
 STC.lit=S.theme; stInk(); STC.dirty=true;}
function stBox(){return {x0:STC.GL,x1:STC.W-STC.GR,y0:STC.TOP,y1:STC.H-STC.FLOOR};}
/* the lane targets: an empty lane is kept, thin, so a slot keeps its place */
function stRelayout(){
 STC.lm=stLaneModel();
 /* a chart with no height yet places nothing; the observer lays it out the
    moment it has one, and a lane born there starts at its own place */
 if(STC.H<=STC.FLOOR+STC.TOP){STC.dirty=true;return;}
 var q=stBox(),L=STC.lm.lanes,tot=0; L.forEach(function(l){tot+=l.active?1:0.42;});
 var u=tot?(q.y1-q.y0)/tot:0,y=q.y0,T={};
 L.forEach(function(l){var h=u*(l.active?1:0.42);T[l.key]={y:y,h:h};y+=h;});
 Object.keys(STC.lane).forEach(function(k){if(!T[k])STC.lane[k].gone=true;});
 Object.keys(T).forEach(function(k){var o=STC.lane[k];
  if(!o||o.gone&&o.a<.02)STC.lane[k]={y:T[k].y,h:T[k].h,vy:0,vh:0,a:REDUCED?1:0,ty:T[k].y,th:T[k].h};
  else{o.ty=T[k].y;o.th=T[k].h;o.gone=false;}});
 STC.dirty=true;}
function stDx(){var q=stBox(),N=Math.max(1,STR.toks.length);return Math.max(3,Math.min(22,(q.x1-q.x0-8)/N));}
function stXOf(j){var q=stBox(),N=STR.toks.length,dx=stDx();
 return N*dx<=q.x1-q.x0-4?q.x0+4+j*dx:q.x1-(N-1-j)*dx;}
/* the springs. Critically damped enough that a sort slides rather than
   rings, stepped at 120 a second whatever the frame rate. */
function stStep(dt){
 var moving=false;
 Object.keys(STC.items).forEach(function(k){var it=STC.items[k],t=it.alive?1:0;
  if(REDUCED){it.g=t;it.gv=0;}else{var a=220*(t-it.g)-2*.55*14.8*it.gv;it.gv+=a*dt;it.g+=it.gv*dt;}
  if(Math.abs(t-it.g)>.004||Math.abs(it.gv)>.004)moving=true;
  if(!it.alive&&it.g<0.01&&Math.abs(it.gv)<0.01)delete STC.items[k];});
 Object.keys(STC.lane).forEach(function(k){var o=STC.lane[k],ta=o.gone?0:1;
  if(REDUCED){o.y=o.ty;o.h=o.th;o.a=ta;o.vy=o.vh=0;if(o.gone)delete STC.lane[k];return;}
  var sub=Math.max(1,Math.ceil(dt/(1/120))),sd=dt/sub;
  for(var s=0;s<sub;s++){var a=170*(o.ty-o.y)-2*.86*13*o.vy;o.vy+=a*sd;o.y+=o.vy*sd;
   var a2=170*(o.th-o.h)-2*.86*13*o.vh;o.vh+=a2*sd;o.h+=o.vh*sd;}
  o.a+=(ta-o.a)*Math.min(1,dt*9);
  if(Math.abs(o.ty-o.y)>.2||Math.abs(o.th-o.h)>.2||Math.abs(ta-o.a)>.01)moving=true;
  if(o.gone&&o.a<.02)delete STC.lane[k];});
 return moving;}
/* THE STRESS LINES MOVE WHILE THE READING IS MOVING, AND THEN HOLD.
   The prototype pulsed them for ever. On the product that is a canvas
   repainting sixty times a second on a page where somebody is typing, inside
   a stage the Glass lightings blur behind: measured in the design gate's own
   Chromium, the Glass white lighting could not finish its transition, two
   reads of the body 120ms apart came back equal half way, and the child
   treatment gate scored its pills against a ground that was half dark. They
   pulse for a few seconds after each change in what was read and then stand
   at the middle of their swing, which is where reduced motion puts them. */
var ST_STRESS_MS=2600;
function stFrame(ts){
 /* the clock, ahead of the canvas guard below, so a recording still ticks
    on a frame where the chart itself has nothing to draw. */
 stMicTick();
 if(!STC.cv||!STC.cv.isConnected){if(document.getElementById('stcv'))stSize();else return;}
 var dt=Math.min(.05,(ts-(STC.last||ts))/1000); STC.last=ts;
 var live=!REDUCED&&STC.lm.dwell&&performance.now()<(STC.stressTo||0);
 var moving=stStep(dt);
 /* the seat springs only drive the Ring and the Strip, so Lanes pays for
    nothing it does not draw */
 if(STV.view!=='lanes')moving=stSeatStep(dt)||moving;
 /* one more frame once the pulse ends, so it comes to rest at the still phase */
 if(!live&&STC.pulsing){STC.pulsing=false;STC.dirty=true;}
 if(live)STC.pulsing=true;
 if(!moving&&!live&&!STC.dirty)return;
 STC.dirty=false; stDraw();}
function stDraw(){
 if(STV.view==='ring')return stDrawRing();
 if(STV.view==='strip')return stDrawStrip();
 var g=STC.g,q=stBox(),W=STC.W,H=STC.H; if(!g||!W||!H)return;
 var ink=STC.ink,dim=STC.dim,wide=W>=900;
 g.setTransform(STC.dpr,0,0,STC.dpr,0,0); g.clearRect(0,0,W,H);
 /* the lanes: a floor line, the name, the rung pips, stress lines on the dwell */
 STC.lm.lanes.forEach(function(l){var o=STC.lane[l.key];if(!o)return;
  var c=stCol(l.seat),al=o.a,y=o.y,h=o.h,on=l.active;
  if(STV.hot===l.key){g.fillStyle=rgba(c,.08*al);g.fillRect(4,y,W-8,h);}
  g.beginPath();g.moveTo(q.x0,y+h-1);g.lineTo(q.x1,y+h-1);g.strokeStyle=rgba(c,(on?.24:.07)*al);g.lineWidth=1;g.stroke();
  var ly=y+h*.6;g.textBaseline='middle';
  /* a lane too thin to carry a name carries its ring only, never a name over
     its neighbour's */
  if(h<12){if(h>=6){g.beginPath();g.arc(15,y+h/2,Math.min(4,h/2-1),0,TAU);g.strokeStyle=rgba(c,.4*al);g.lineWidth=1.2;g.stroke();}}
  else{
   if(l.icon){g.save();g.translate(8,ly-7);g.scale(14/24,14/24);g.strokeStyle=rgba(c,al);g.lineWidth=1.8*24/14;
    g.lineJoin='round';g.lineCap='round';g.stroke(new Path2D(l.icon));g.restore();}
   else{g.beginPath();g.arc(15,ly,4,0,TAU);g.strokeStyle=rgba(c,(on?1:.45)*al);g.lineWidth=1.6;g.stroke();}
   g.fillStyle=rgba(on?mixc(c,ink,.12):c,(on?1:.6)*al);g.font='600 12px Inter,system-ui,sans-serif';g.textAlign='left';
   g.fillText(l.label.length>11&&STC.GL<94?l.label.slice(0,10)+'.':l.label,26,ly);}
  if(h>=11)for(var i=0;i<10;i++){var lit=i<Math.round(l.rung);
   g.fillStyle=lit?rgba(c,al):rgba(c,(i>=SRC_ASK-1?.3:.12)*al);g.fillRect(W-STC.GR+8+i*5,ly-5,3,10);}
  if(STC.lm.dwell===l.key&&l.rung>=1){var str=Math.min(1,l.rung/10),gp=3.2-1.1*str,f=(REDUCED||!STC.pulsing)?.5:((performance.now()/1400)%1);
   for(var k=0;k<3;k++){var pos=k+f,sa=str*Math.sin(Math.PI*pos/3)*.45*al;if(sa<.02)continue;
    [-1,1].forEach(function(sg){var yy=y+h*.5+sg*(h*.18+pos*gp);g.beginPath();g.moveTo(q.x0,yy);g.lineTo(q.x1,yy);
     g.strokeStyle=rgba(c,sa);g.lineWidth=1;g.stroke();});}}});
 g.save();g.beginPath();g.rect(q.x0,0,q.x1-q.x0+2,H);g.clip();
 /* THE FLOOR IS GONE, round of 28 October, his words: "get rid of those
    rainbow colours on the bottom, those don't do anything." It ticked every
    word read, kept ones in their seat colour, under the lanes this canvas
    still draws. dx and tw stay: the bars below still measure a word's
    width by them. */
 var dx=stDx(),tw=Math.max(1.5,dx-(dx>8?4:2));
 /* the bars */
 var pts=[];
 Object.keys(STC.items).forEach(function(k){var it=STC.items[k],m=it.m,g1=Math.max(0,it.g);if(g1<.01||m.t0<0)return;
  var x=stXOf(m.t0),x2=stXOf(m.t1)+tw;
  /* a calm word said with a no is set aside like any other word, P3-1 of the
     inference audit: drawn dashed and faint, never as the solid bar of a calm
     that counted */
  if(m.coh){var cy=H-STC.FLOOR+2-10*g1;
   if(m.aside){g.strokeStyle=rgba(STC.acc,.55);g.setLineDash([2,2]);g.strokeRect(x+.5,cy+.5,x2-x-1,2);g.setLineDash([]);return;}
   g.fillStyle=rgba(STC.acc,.9);g.fillRect(x,cy,x2-x,3);return;}
  var lk=STC.lm.keyOf(m),o=lk&&STC.lane[lk];if(!o)return;
  var c=stCol(m.bn),hh=Math.max(3,g1*(0.22+0.78*m.depth)*o.h*.82),base=o.y+o.h-1,al=o.a;
  if(m.aside){g.strokeStyle=rgba(c,.55*al);g.setLineDash([2,2]);g.strokeRect(x+.5,base-hh+.5,x2-x-1,hh-1);g.setLineDash([]);}
  else{g.fillStyle=rgba(c,al);g.fillRect(x,base-hh,x2-x,hh);
   /* a modifier's share of the bar is drawn lighter, so "really tight" shows
      how much of its height the "really" added */
   if(m.mod){var hb=hh/m.mod.f;g.fillStyle=rgba(mixc(c,ink,.55),al);g.fillRect(x,base-hh,x2-x,hh-hb);}}
  pts.push({m:m,x:(x+x2)/2,y:base-hh,g:g1,c:c});});
 pts.sort(function(a,b){return a.m.s-b.m.s;});
 /* the route over the bars, Route's dashed trajectory, grown as each word lands */
 g.lineWidth=1.6;g.setLineDash([4,4]);
 for(var i=1;i<pts.length;i++){var a=pts[i-1],b2=pts[i],gg=Math.max(0,Math.min(1,b2.g));if(gg<.01)continue;
  var grd=g.createLinearGradient(a.x,a.y,b2.x,b2.y);
  grd.addColorStop(0,rgba(a.c,a.m.aside?.3:.9));grd.addColorStop(1,rgba(b2.c,b2.m.aside?.3:.9));
  g.strokeStyle=grd;g.beginPath();var mx=(b2.x-a.x)/2;g.moveTo(a.x,a.y);
  var N=18;for(var s2=1;s2<=Math.round(N*gg);s2++){var tt=s2/N,u=1-tt;
   var xx=u*u*u*a.x+3*u*u*tt*(a.x+mx)+3*u*tt*tt*(b2.x-mx)+tt*tt*tt*b2.x,
       yy=u*u*u*a.y+3*u*u*tt*a.y+3*u*tt*tt*b2.y+tt*tt*tt*b2.y;g.lineTo(xx,yy);}
  g.stroke();}
 g.setLineDash([]);
 /* the stations on the line, and the newest one lit */
 pts.forEach(function(p,i){var r=2.6+2.4*p.m.depth;
  if(i===pts.length-1){var hg=g.createRadialGradient(p.x,p.y,0,p.x,p.y,15);hg.addColorStop(0,rgba(p.c,.45));hg.addColorStop(1,rgba(p.c,0));
   g.fillStyle=hg;g.beginPath();g.arc(p.x,p.y,15,0,TAU);g.fill();}
  /* THE STATION IS HOLLOW BY CUTTING, NOT BY PAINTING. It was filled with a
     ground colour read off the panel, and the panel's ground is the ink at 3
     per cent, so the read came back as the ink itself and every station drew
     as a solid white dot on the dark lightings. Cutting the disc out of the
     canvas lets the lighting's own ground show through, on all seven. */
  g.save();g.globalCompositeOperation='destination-out';g.beginPath();g.arc(p.x,p.y,r,0,TAU);g.fill();g.restore();
  g.beginPath();g.arc(p.x,p.y,r,0,TAU);
  if(p.m.aside)g.setLineDash([2,2]);g.strokeStyle=rgba(p.c,p.m.aside?.5:1);g.lineWidth=1.6;g.stroke();g.setLineDash([]);});
 /* the words: the heaviest always, the rest where there is room */
 var kink=null;pts.forEach(function(p){if(!p.m.aside&&p.m.amt!=null&&(!kink||p.m.amt>kink.m.amt))kink=p;});
 var placed=[];g.font='500 12px Inter,system-ui,sans-serif';g.textAlign='center';g.textBaseline='bottom';
 pts.slice().sort(function(a,b){return (b===kink)-(a===kink)||b.m.depth-a.m.depth;}).forEach(function(p){
  if(p.m.aside&&!wide)return; if(p!==kink&&!wide&&dx<12)return; if(p.g<.6)return;
  var w=g.measureText(p.m.txt).width+6,x0=p.x-w/2,y1=p.y-6,y0=y1-14;
  if(x0<q.x0||x0+w>q.x1+2||y0<0)return;
  if(placed.some(function(r){return !(x0+w<r[0]||x0>r[2]||y1<r[1]||y0>r[3]);}))return;
  placed.push([x0,y0,x0+w,y1]);g.fillStyle=p.m.aside?rgba(dim,.9):rgba(mixc(p.c,ink,.15),1);g.fillText(p.m.txt,p.x,y1);});
 var N2=STR.toks.length;if(N2){var px=stXOf(N2-1)+dx;g.fillStyle=rgba(STC.acc,.55);g.fillRect(px,q.y0,1,H-q.y0-6);}
 g.restore();}
function stHot(k){
 if(STV.hot===k)return; STV.hot=k; STC.dirty=true;
 document.querySelectorAll('#stimps .st-grp').forEach(function(gp){gp.classList.toggle('hot',gp.getAttribute('data-k')===k);});}

/* ============================================================
   THE RING AND THE STRIP, PORTED FROM proto/story-redesign/src/shared.js,
   its VA and VC. The drawing is the prototype's, number for number. What
   changed is only where the numbers come from, and each change is the one
   this file already made for Lanes:
     the read is STR and ST_PARSED, not the prototype's own copy of it
     colours come through stCol and the lighting's ink, dim and accent, so
       both views follow all seven lightings rather than the Dark one the
       prototype was drawn on
     a hollow is cut, not painted, for the reason given at the stations
     the frame is the product's own, and it stops when nothing moves
   ============================================================ */
/* THE SEATS, AS SPRINGS. The prototype's targets, unchanged:
     rd   the entry's reading at the seat, parseStory bands over three, capped at ten
     rg   the rung, srcHear
     bend the Field's own stress curve, frStress in ui/wheel.js, which is the
          prototype's frStressP on the same LEVER_MU, so it is called rather
          than copied a second time */
var STSEAT={}; BANDS.forEach(function(b){STSEAT[b]={rd:0,rv:0,rdT:0,rg:0,rgv:0,rgT:0,bend:0,bv:0,ph:0,rise:0};});
function stSeatT(){
 var p=ST_PARSED,rg={},snap=STV.view==='lanes';
 ((STR.heard&&STR.heard.seats)||[]).forEach(function(s){rg[s.band]=s.rung;});
 BANDS.forEach(function(b){var o=STSEAT[b],k=ST_BKEY[b],t=p&&p.bands[k]?Math.min(10,p.bands[k]/3):0;
  if(t>o.rdT+0.01)o.rise=1.6; o.rdT=t; o.rgT=rg[b]||0;
  /* WHILE LANES IS UP THE SPRINGS ARE NOT STEPPED, so they are held at their
     targets instead. Left behind, a switch to the Ring grew every arc and
     spoke from nothing for a reading that had not changed, which is the
     motion that says a word landed when none had, the defect the head of
     stRender records for the lanes. */
  if(snap){o.rd=t;o.rg=o.rgT;o.rv=o.rgv=o.bv=0;o.bend=frStress(t);o.rise=0;}});}
function stSeatStep(dt){
 var moving=false,now=performance.now();
 BANDS.forEach(function(b){var o=STSEAT[b],tb=frStress(Math.max(0,o.rdT));
  if(REDUCED){o.rd=o.rdT;o.rg=o.rgT;o.rv=o.rgv=0;o.bend=tb;o.bv=0;o.rise=0;return;}
  var sub=Math.max(1,Math.ceil(dt/(1/120))),sd=dt/sub;
  for(var s=0;s<sub;s++){
   var a=144*(o.rdT-o.rd)-2*.72*12*o.rv;o.rv+=a*sd;o.rd+=o.rv*sd;
   var a2=196*(o.rgT-o.rg)-2*.8*14*o.rgv;o.rgv+=a2*sd;o.rg+=o.rgv*sd;
   /* the Field's bend: w 14, damping .42, so it lands a fifth past its mark */
   var a3=196*(tb-o.bend)-2*.42*14*o.bv;o.bv+=a3*sd;o.bend+=o.bv*sd;}
  o.rise=Math.max(0,o.rise-dt); o.ph+=dt*(o.rise>0?0.9:0);
  if(Math.abs(o.rdT-o.rd)>.004||Math.abs(o.rv)>.004||Math.abs(o.rgT-o.rg)>.004||Math.abs(o.rgv)>.004
   ||Math.abs(tb-o.bend)>.002||Math.abs(o.bv)>.004||o.rise>0)moving=true;});
 if(STV.view==='strip'){STC.shift*=REDUCED?0:Math.exp(-dt*9);
  if(STC.shift>.05)moving=true; else STC.shift=0;}
 /* the ripple outlives the spoke's spring by a few hundred milliseconds, and
    a frame that stopped with it would leave a ring standing on the canvas */
 if(STV.view==='ring'&&!REDUCED)Object.keys(STC.items).forEach(function(k){if(now-(STC.items[k].at||0)<900)moving=true;});
 return moving;}
/* the seven sectors in the Field's own order and size: Root at twelve
   o'clock, clockwise, each as wide as its share of the somatic addresses */
var ST_SECT=null;
function stSect(){
 if(ST_SECT)return ST_SECT;
 var cnt={},a=-Math.PI/2,o={};W.forEach(function(n){cnt[n.b]=(cnt[n.b]||0)+1;});
 BANDS.forEach(function(b){var w=(cnt[b]||0)/W.length*TAU;o[b]={a0:a,a1:a+w};a+=w;});
 return (ST_SECT=o);}
/* ---- A. THE LISTENING RING ---- */
function stDrawRing(){
 var g=STC.g,CW=STC.W,CH=STC.H; if(!g||!CW||!CH)return;
 var s=Math.min(CW,CH)/300,q={cx:CW/2,cy:CH/2,core:22*s,sp0:28*s,spL:44*s,ring:100*s};
 var SE=stSect(),ink=STC.ink,acc=STC.acc,now=performance.now();
 g.setTransform(STC.dpr,0,0,STC.dpr,0,0); g.clearRect(0,0,CW,CH); g.setLineDash([]);
 /* the seat arcs, bent by the Field's rule, and the fringes past five */
 BANDS.forEach(function(b){var o=STSEAT[b],S_=SE[b],c=stCol(b),gap=.025,heard=o.rgT>0||o.rd>0.05;
  var r=q.ring+o.bend*9*s;
  g.beginPath();g.arc(q.cx,q.cy,r,S_.a0+gap,S_.a1-gap);g.strokeStyle=rgba(c,heard?.92:.2);g.lineWidth=5*s;g.lineCap='butt';g.stroke();
  /* the rung, ten ticks along the outside of the arc; seven to ten are the end it asks at */
  for(var i=0;i<10;i++){var a=S_.a0+gap+(i+.5)/10*(S_.a1-S_.a0-2*gap),on=i<Math.round(o.rg),ask=i>=SRC_ASK-1,r0=r+8*s,r1=r0+(ask?8:6)*s;
   g.beginPath();g.moveTo(q.cx+Math.cos(a)*r0,q.cy+Math.sin(a)*r0);g.lineTo(q.cx+Math.cos(a)*r1,q.cy+Math.sin(a)*r1);
   g.strokeStyle=on?rgba(c,1):rgba(c,heard?(ask?.4:.18):.08);g.lineWidth=(on?2.2:1.3)*s;g.stroke();}
  var str=Math.max(0,o.bend);
  if(str>=.03){var gp=(10-6*str)*s,f=REDUCED?.5:(o.ph-Math.floor(o.ph)),lift=mixc(c,ink,.55);
   for(var k=0;k<5;k++){var pos=k+f,al=Math.pow(Math.min(1,str),1.3)*Math.sin(Math.PI*pos/5)*.85;if(al<.02)continue;
    g.beginPath();g.arc(q.cx,q.cy,r+22*s+pos*gp,S_.a0+gap*2,S_.a1-gap*2);g.strokeStyle=rgba(k%2?c:lift,al);g.lineWidth=(k%2?1.1:1.6)*s;g.stroke();}}
  if(heard){var am=(S_.a0+S_.a1)/2,lr=q.ring-15*s;g.fillStyle=rgba(c,.95);g.font='600 '+Math.max(11,11*s)+'px Inter,system-ui,sans-serif';
   g.textAlign='center';g.textBaseline='middle';g.fillText(b,q.cx+Math.cos(am)*lr,q.cy+Math.sin(am)*lr);}});
 /* the spokes, one per kept stretch of text, as long as it weighed */
 var per={},coh=[];
 Object.keys(STC.items).forEach(function(k){var it=STC.items[k];
  if(it.m.coh){coh.push(it);return;} if(!it.m.bn||!SE[it.m.bn])return; (per[it.m.bn]=per[it.m.bn]||[]).push(it);});
 Object.keys(per).forEach(function(b){var L=per[b].sort(function(x,y){return x.m.s-y.m.s;}),S_=SE[b],c=stCol(b),n=L.length;
  L.forEach(function(it,j){var a=S_.a0+(j+1)/(n+1)*(S_.a1-S_.a0),g1=Math.max(0,it.g),len=q.sp0+g1*(0.25+0.75*it.m.depth)*q.spL,
   ca=Math.cos(a),sa=Math.sin(a);if(g1<.01)return;
   g.beginPath();g.moveTo(q.cx+ca*q.sp0,q.cy+sa*q.sp0);g.lineTo(q.cx+ca*len,q.cy+sa*len);
   if(it.m.aside){g.setLineDash([2*s,3*s]);g.strokeStyle=rgba(c,.45);}else{g.setLineDash([]);g.strokeStyle=rgba(c,1);}
   g.lineWidth=2.2*s;g.lineCap='round';g.stroke();g.setLineDash([]);
   /* a degree word's share of the spoke is drawn lighter, as on Lanes */
   if(it.m.mod&&!it.m.aside){var base=q.sp0+g1*(0.25+0.75*it.m.depth/it.m.mod.f)*q.spL;
    g.beginPath();g.moveTo(q.cx+ca*base,q.cy+sa*base);g.lineTo(q.cx+ca*len,q.cy+sa*len);g.strokeStyle=rgba(mixc(c,ink,.6),1);g.lineWidth=3*s;g.stroke();}
   var age=(now-(it.at||0))/900;
   if(age<1&&!REDUCED){var rr=(6+10*age)*s;g.beginPath();g.arc(q.cx+ca*len,q.cy+sa*len,rr,0,TAU);g.strokeStyle=rgba(c,.5*(1-age));g.lineWidth=1.4*s;g.stroke();}});});
 /* the core. A coherent word places nothing, so it lands here and grows
    nothing. Hollow by cutting, like the stations on Lanes. */
 g.save();g.globalCompositeOperation='destination-out';g.beginPath();g.arc(q.cx,q.cy,q.core,0,TAU);g.fill();g.restore();
 /* and a calm word said with a no is drawn set aside here too, P3-1, and
    does not brighten the core it did not reach */
 var cohKept=coh.filter(function(it){return !it.m.aside;}).length;
 g.beginPath();g.arc(q.cx,q.cy,q.core,0,TAU);g.strokeStyle=rgba(acc,Math.min(1,.35+.1*cohKept));g.lineWidth=1.4*s;g.stroke();
 coh.forEach(function(it,j){var a=-Math.PI/2+j*.5,g1=Math.max(0,it.g),r0=q.core+3*s,r1=r0+6*s*g1;
  g.beginPath();g.moveTo(q.cx+Math.cos(a)*r0,q.cy+Math.sin(a)*r0);g.lineTo(q.cx+Math.cos(a)*r1,q.cy+Math.sin(a)*r1);
  if(it.m.aside){g.setLineDash([2*s,2*s]);g.strokeStyle=rgba(acc,.45);}else{g.setLineDash([]);g.strokeStyle=rgba(acc,1);}
  g.lineWidth=2*s;g.stroke();g.setLineDash([]);});
 g.lineCap='butt';}
/* ---- C. THE TRACE, AS FIRST DRAWN: THE STRIP ---- */
function stStripBox(){return {x0:70,x1:STC.W-60,y0:8,y1:STC.H-26};}
function stStripLane(b){var q=stStripBox(),i=BANDS.length-1-BANDS.indexOf(b),h=(q.y1-q.y0)/7;return {y:q.y0+i*h,h:h};}
/* a chart with no width yet reads as packed, and would bank a slide it never
   drew; nothing slides until the canvas has been measured */
function stStripDx(){var q=stStripBox(),N=Math.max(1,STR.toks.length);
 return STC.W?Math.max(3,Math.min(9,(q.x1-q.x0-8)/N)):9;}
function stStripX(j){var q=stStripBox(),N=STR.toks.length;return q.x1-(N-1-j)*stStripDx()-STC.shift;}
function stDrawStrip(){
 var g=STC.g,CW=STC.W,CH=STC.H; if(!g||!CW||!CH)return;
 var q=stStripBox(),dx=stStripDx(),ink=STC.ink,dim=STC.dim,acc=STC.acc;
 g.setTransform(STC.dpr,0,0,STC.dpr,0,0); g.clearRect(0,0,CW,CH); g.setLineDash([]);
 BANDS.forEach(function(b){var l=stStripLane(b),c=stCol(b),o=STSEAT[b],heard=o.rgT>0;
  g.beginPath();g.moveTo(q.x0,l.y+l.h-1);g.lineTo(q.x1,l.y+l.h-1);g.strokeStyle=rgba(c,heard?.22:.07);g.lineWidth=1;g.stroke();
  g.fillStyle=rgba(c,heard?1:.76);g.font='600 12px Inter,system-ui,sans-serif';g.textAlign='right';g.textBaseline='middle';g.fillText(b,q.x0-10,l.y+l.h*.6);
  for(var i=0;i<10;i++){var on=i<Math.round(o.rg);g.fillStyle=on?rgba(c,1):rgba(c,i>=SRC_ASK-1?.3:.12);g.fillRect(CW-54+i*5,l.y+l.h*.6-5,3,10);}});
 g.save();g.beginPath();g.rect(q.x0,0,q.x1-q.x0+8,CH);g.clip();
 /* every word read, a tick on the floor; the ones it kept rise into their seat */
 STR.toks.forEach(function(o,j){var x=stStripX(j);if(x<q.x0-8)return;
  g.fillStyle=o.m?rgba(o.m.bn?stCol(o.m.bn):acc,1):rgba(dim,.45);g.fillRect(x,CH-20,Math.max(1.5,dx-3),o.m?9:6);});
 Object.keys(STC.items).forEach(function(k){var it=STC.items[k],m=it.m,g1=Math.max(0,it.g);if(g1<.01||m.t0<0)return;
  var x=stStripX(m.t0),x2=stStripX(m.t1)+Math.max(5,dx-1.5);
  /* a calm word said with a no, set aside as on the lanes, P3-1 */
  if(m.coh){var cy=CH-20-12*g1;
   if(m.aside){g.strokeStyle=rgba(acc,.55);g.setLineDash([2,2]);g.strokeRect(x+.5,cy+.5,x2-x-1,2);g.setLineDash([]);return;}
   g.fillStyle=rgba(acc,.9);g.fillRect(x,cy,x2-x,3);return;}
  if(!m.bn)return;
  var l=stStripLane(m.bn),c=stCol(m.bn),hh=g1*(0.2+0.8*m.depth)*l.h*.9,base=l.y+l.h-1;
  if(m.aside){g.strokeStyle=rgba(c,.55);g.setLineDash([2,2]);g.strokeRect(x+.5,base-hh+.5,x2-x-1,hh-1);g.setLineDash([]);return;}
  g.fillStyle=rgba(c,1);g.fillRect(x,base-hh,x2-x,hh);
  if(m.mod){var hb=hh/m.mod.f;g.fillStyle=rgba(mixc(c,ink,.55),1);g.fillRect(x,base-hh,x2-x,hh-hb);}});
 var N=STR.toks.length;if(N){var px=stStripX(N-1)+dx;g.fillStyle=rgba(acc,.55);g.fillRect(px,q.y0,1,CH-q.y0-6);}
 g.restore();
 g.fillStyle=rgba(dim,.9);g.font='12px Inter,system-ui,sans-serif';g.textAlign='right';g.textBaseline='middle';g.fillText('read',q.x0-10,CH-15);}

/* ---- the words under the chart and the tag beside its name ----
   THE TAG IS EMPTY UNTIL THERE IS SOMETHING TO SAY. Round LO, his words:
   "For the imprints, I remove the text saying imprints not read yet, unless
   that does something specific." Checked before it was cut: it was the tag's
   fourth state, shown only with the box empty and nothing committed since
   the page opened, and it did nothing. It was not a control, nothing reads
   it, and it said the same thing as the list directly under it, "You have
   not written anything yet. Whatever you write gets pulled apart and
   collected here", and as the empty chart beside it. On a phone that list
   is folded away behind List, and there the empty chart and the empty box
   with its placeholder still say it, the chart on the same line of sight
   the tag sat on.
   THE "N PENDING" STATE IS GONE TOO, 6 November, his words looking at this
   exact screen: "it says imprints 11 pending, just get rid of the 11
   pending, because that's bullshit." The pills under it already say there
   is something there by being there, the same reasoning round of 29
   October used to cut the pending count that used to repeat per seat
   group below (still true, see the note at stListPaint). Two states are
   left, and the span stays in place empty otherwise, because it is the
   spacer that holds the view icons at the row's right edge (the Bank and
   the Vault moved to the list's own header, round of 29 October, see the
   ruling at stRender). */
function stPendPaint(){
 var e=document.getElementById('stpend'); if(!e)return;
 var n=ST_PARSED?ST_PARSED.imprints.length:0;
 e.textContent=n?'':(ST_TEXT.trim()?'Nothing kept yet':(STV.lastFound.length?'Committed':''));
 var l=document.getElementById('stlist'); if(l)l.textContent=n?'List '+n:'List';}
/* THE CAPTION UNDER THE CHART IS GONE, round of 29 October, his words:
   "get rid of the text that says 29 words read to kept." stCtrPaint used
   to write it into #stctrt; both are gone with it, #stctr's own div along
   with them since it held nothing else. The counts themselves, kept, set
   aside after a no, about someone else, still come off STR.marks and
   STR.toks exactly as this function read them; tests/sniffpage.js reads
   them the same way directly off STR now rather than off a caption built
   to show a person, which is a cleaner read in its own right and not only
   a consequence of the caption going. */

/* ============================================================
   THE LIST, in the lanes' order, so a sort moves the chart and the list
   together. Inferred imprints fold to one pill per seat and charge, the
   shipped round GR rule: four addresses the words did not name are one
   reading, not four findings. Or the vault, when it is open.
   ============================================================ */
function stSvg(d){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+d+'"/></svg>';}
var ST_SEEN={};
function stListPaint(){
 var hd=document.getElementById('stlshd'), box=document.getElementById('stimps'); if(!hd||!box)return;
 if(STV.list==='vault'){stVaultPaint(hd,box);return;}
 /* the person's own draft is not read onto a worked example's page */
 var p=showOnly()?null:ST_PARSED,n=p?p.imprints.length:0,o='';
 /* THE HEADING AND THE EMPTY-STATE SENTENCE ARE GONE, round of 29 October,
    his words: "get rid of the text pending imprints by seat... you have not
    written anything yet." The sort control above it still says which sort
    is active; the box is simply blank until there is something to list. */
 hd.textContent='';
 if(!n){ box.innerHTML=''; ST_SEEN={}; return; }
 var seen={};
 STC.lm.lanes.forEach(function(l){if(!l.imps||!l.imps.length)return;var c=seatCol(l.seat),pills=[],fold={};
  /* AN AXIS NAMED IS NOT AN ADDRESS NAMED, S4 of the 9 October sniffer audit,
     ruling 5. Every pill that was not inferred was titled "Named by the
     words." over an address name, and the words never name an address: a
     named imprint is the axis the words named, at an address the engine
     picked by susceptibility, so "I was furious" titled Pride as named. A
     stated imprint was worse: its node is only the seat's first address,
     which does not carry the fetter, so "I am exhausted" printed Pride.
     A stated imprint now folds to its fetter like an inferred one, because
     it has no address of its own, and each title says what the words did. */
  /* AND A NAMED IMPRINT FOLDS TOO, P0-3 of the inference audit, 23 October.
     It printed the address, so "My father died last year" showed a pill
     reading Martyrdom, and the one sentence saying the engine chose it sat in
     a hover title a phone never shows. The words named the feeling and only
     the feeling, so every pill prints the feeling at its seat. */
  l.imps.slice().sort(function(a,b){return b.amt-a.amt;}).forEach(function(im){
   var fk=(im.stated?'s:':im.inferred?'i:':'n:')+im.band+':'+im.fetter;
   if(!fold[fk]){fold[fk]={label:STV.sort==='charge'?im.band:im.fetter,amt:0,inf:!!(im.inferred||im.stated),
    st:!!im.stated,band:im.band,fet:im.fetter};pills.push(fold[fk]);}
   fold[fk].amt+=im.amt;});
  /* THE "ONLY FROM" WARNING IS GONE, S1, because its case is. It was written
     for a seat charged by parseStory from words srcHear set aside, the two
     halves of the engine disagreeing. Since S1 a word said with a no charges
     no seat, so a lane here always has a word that counts, and a note that
     said otherwise would be a false sentence. */
  /* THE PENDING COUNT IS GONE FROM EVERY GROUP HEADING, round of 29
     October, his words: "get rid of one pending, one pending." It repeated
     once per seat and said nothing the pills under it did not already
     show by being there. The charge sort's own note, which seats a charge
     group spans, is a different sentence and stays. */
  var note='';
  if(STV.sort==='charge')note='<em>at '+l.bands.map(srcSeatSay).join(', ')+'</em>';
  var sym=l.icon?stSvg(l.icon):'<span class="st-ring"></span>';
  o+='<div class="st-grp'+(STV.hot===l.key?' hot':'')+'" data-k="'+esc(l.key)+'" style="--c:'+c+'">'
   +'<div class="st-ghd"><b>'+sym+esc(l.label)+'</b>'+note+'</div><div class="st-pills">'
   +pills.map(function(q){var k=l.key+':'+q.label;seen[k]=1;
    return '<span class="st-pill'+(q.inf?' inf':'')+(ST_SEEN[k]?'':' new')+'" style="--c:'+seatCol(q.band)+'" '
     +'title="'+esc(q.st?'Your words named '+String(q.fet||'').toLowerCase()+'. This seat has no address for it, so the charge stays at the seat.'
      :q.inf?'The seat was read. The words did not name this address.'
      :'Your words named '+String(q.fet||'').toLowerCase()+'.')+'">'
     +'<span class="st-ring"></span>'+esc(q.label)+' <small>+'+fmtPct('atom',q.amt)+'</small></span>';}).join('')
   +'</div></div>';});
 ST_SEEN=seen; box.innerHTML=o;
 box.querySelectorAll('.st-grp').forEach(function(gp){
  gp.onmouseenter=function(){stHot(gp.getAttribute('data-k'));};gp.onmouseleave=function(){stHot(null);};});}

/* ============================================================
   THE VAULT: WHAT HAS ACTUALLY BEEN RELEASED, read off the record.

   A release writes one key per pattern into the record's meter, address,
   channel and line, meterRun in engine/schema.js, and a dated first per
   address, meterFirst. That is the whole history and it is the person's own:
   nothing here is inferred from charge, which also moves by writing and by
   the sliders. A worked example has no meter of its own, because a release
   is refused on one, so its vault is honestly empty.
   ============================================================ */
function stVaultRows(){
 var m=(typeof CURP!=='undefined'&&CURP&&CURP.meter)||null, by={}, first={};
 ((m&&m.unique)||[]).forEach(function(k){var id=+String(k).split(':')[0];if(BY[id])by[id]=(by[id]||0)+1;});
 ((m&&m.firsts)||[]).forEach(function(f){if(/^addr:\d+$/.test(f.k))first[+f.k.slice(5)]=f.t;});
 return Object.keys(by).map(function(id){return {n:BY[+id],lines:by[id],t:first[id]||''};})
  .sort(function(a,b){return String(b.t).localeCompare(String(a.t))||b.lines-a.lines;});}
function stVaultCount(){
 var e=document.getElementById('stvn'); if(e){var n=stVaultRows().length; e.textContent=n?String(n):'\u2013';}}
function stVaultPaint(hd,box){
 var rows=stVaultRows();
 hd.textContent='Released';
 box.innerHTML=rows.length?rows.map(function(v){
   return '<div class="st-grp" style="--c:'+seatCol(v.n.b)+'"><div class="st-ghd"><b><span class="st-ring"></span>'
    +esc(v.n.k)+'</b><em>'+esc(v.n.b)+', '+v.lines+(v.lines===1?' pattern':' patterns')+'</em></div></div>';}).join('')
  :'<p class="st-none">Nothing released yet. What a release runs is kept here.</p>';}

/* ============================================================
   THE RELEASE PANEL, CUT TO HIS WORDS, AND TO THE CARD'S. Round IG: "it's
   release your selections, pace, and how many patterns ... and this, just,
   run release button." Commit 2c6e38b made that cut on the release card in
   ui/release.js, and this panel is cut the same way so the two surfaces say
   one thing: the selection as rings and nothing else, Pace, Patterns, and
   Run release. No address rows, no weights, no price, no count printed as a
   figure or a sentence. The price is still enforced, at the card's door.

   WHICH ADDRESSES, in the order his chain reads. What was picked in the bank
   first, because picking there is how he said he chooses. Otherwise what this
   entry reaches, or the last committed one's, because the chain is journal,
   imprint, release. Otherwise the three heaviest held. Every ring starts
   selected and a tap takes it out of the run; its name is its label.

   PACE AND PATTERNS ARE THE CARD'S OWN TWO FIELDS, RUN.pace and RUN.dose,
   so a setting made here is the setting the run uses and there is one of
   each. Patterns is the dose a channel, fifty by default, the engine's
   LINES_PER_CH, and Pace is 1 at speaking pace. relPick reads the pace back
   off RUN.speed, so the speed is written to match rather than the pace
   being set twice.

   RUN RELEASE BEGINS THE RUN. The setup is here, so the card opens on the
   opening rather than on a second copy of this panel. It presses the card's
   own Begin, inside this press, because Begin is also the gesture a browser
   needs before it will speak. A spent allowance has no Begin, and the card
   stays on its refusal and names the way out, which this panel must not
   duplicate. There is no Cancel here: nothing has started until Run release,
   and the card that opens carries Pause and Stop.
   ============================================================ */
var ST_OFF={};
/* the card's ceiling on times said, read off its own picks (REL_DOSES,
   ui/release.js, which loads after this file and is read only at a press) */
function stDoseMax(){return typeof REL_DOSES!=='undefined'?REL_DOSES[REL_DOSES.length-1]:LINES_PER_CH;}
function stRelModel(){
 var r=compute(), bySq=function(a,b){return b.sq-a.sq;};
 var picked=Object.keys(IMP_PICK).filter(function(k){return IMP_PICK[k];})
  .map(function(k){return BY[+k];}).filter(function(n){return n&&n.cf;});
 var found=stFound(), take;
 /* WHAT THE WORDS NAMED RUNS, 17 October. These were the heaviest three of
    everything the entry reached, and charge lands per feeling, so a feeling
    with fewer addresses reads heavier at each of them: "My father died ... I
    feel completely alone" ran Addiction, Lust and Shame of Desire, filled in at
    a sacral the words never named, said "that I am in apathy" a hundred times
    a block, and left out the four grief addresses it did name. The shame story
    did the same. Filling the three up with them kept two of the shame story's
    three on apathy, so a filled in address runs only when the words named
    none, and the welcome never names one as what is being released while a
    named one exists. Weight still orders what runs. An entry from before the
    split carries no .named and reads as it always did. */
 var cut=found.named||0;
 /* A STALE LAST ENTRY IS NOT A LIVE PREVIEW, 10 November, found by the
    team reviewing his repeated "there's three icons, there's no persona
    loaded" complaint after the first, confirmed fix (the third tier,
    below) did not account for everything he was seeing. stFound() itself
    falls back to STV.lastFound the moment nothing is typed (its own
    return found.length?found:STV.lastFound), so a person who has
    committed anything, ever, sees that commit's own real addresses here
    on every return to a blank page, forever, with no story open and
    nothing picked. That is the actual "no persona loaded, still three
    icons" he kept reporting, not the live-draft preview this tier is
    meant to be. found!==STV.lastFound is the one test that tells a
    genuine live parse (a new array, every time something is typed) apart
    from the recycled one stFound() hands back on empty input; the model
    already computed this distinction for its own fromLast flag and
    simply never gated take on it.

    BUT found!==STV.lastFound ALSO READS FALSE RIGHT AFTER A COMMIT, 11
    November, bug #164. stCommit stores the just-committed entry's own
    addresses as STV.lastFound (the line this comment already names), then
    sends the person straight to this same release panel -- which is the
    product's own intended flow, "commit, then the release offers what you
    just wrote." found===STV.lastFound in BOTH that moment and the stale
    one above; object identity alone cannot tell "just committed, not yet
    released" from "released already, or never coming back to it". The
    difference is STV.lastOpen, set true by stCommit and stOwn's own reset,
    cleared the moment relPick actually runs a release against this same
    entry (ui/release.js), so "stale" now means specifically "closed",
    never merely "not the newest object". */
 var live=found.length&&(found!==STV.lastFound||STV.lastOpen===true);
 if(picked.length)take=picked.sort(bySq);
 else if(live)take=(cut?found.slice(0,cut):found.slice()).sort(bySq).slice(0,3);
 /* THE THIRD TIER IS GONE, 10 November, his words looking at the live
    panel: "there's three icons that start there. There should be
    nothing." With nothing picked and nothing in the live story, this used
    to fall back to the whole record's own heaviest three addresses ever
    carried, an always-on "what would release right now" preview wearing
    the same real address names a genuine selection shows. The row reads
    as the person's own nothing-yet state, not as a feature, the same rule
    every other section on this page already keeps, so the fallback is cut
    outright rather than gated: take stays empty, and stRelPanel's own
    if(!M.take.length) guard, already written, already does the rest. */
 else take=[];
 return {take:take,sel:take.filter(function(n){return ST_OFF[n.i]!==true;}),bank:!!picked.length,
  added:!!(picked.length||live),
  fromLast:!picked.length&&!!found.length&&found===STV.lastFound};}
function stRelPanel(){
 var e=document.getElementById('strel'); if(!e)return;
 var M=stRelModel(), o='';
 o+=stMark('r','Release','release','st-rlhd')
  +'<div class="st-rlmid">';
 /* THE SENTENCE IS GONE, round of 29 October, his words: "get rid of the text
    that says nothing is held above the line yet." Run release still carries
    its own disabled state with nothing to release; this panel is simply
    blank above it until there is. */
 /* UNPACK EVERY SYMBOL, CLAUDE.md's own ruling, 10 November: he looked at
    these three rings and asked outright, "I don't understand what those
    are there for, what they do." They already carried their real name in
    a title attribute, which only a mouse hover ever shows; a phone, and
    apparently a person not hovering, saw three bare rings. The name now
    prints under each one, the same way a term of art gets its meaning
    beside it everywhere else in this product. */
 if(!M.take.length){}
 else o+='<div class="st-rings">'+M.take.map(function(a){var on=ST_OFF[a.i]!==true;
   return '<div class="st-rq-wrap"><button type="button" class="st-rq" data-rq="'+a.i+'" aria-pressed="'+on+'" '
    +'aria-label="'+esc(a.k+', '+a.b)+'" title="'+esc(a.k+', '+a.b)+'">'+crNode(a,'sm',{raw:'',title:''})+'</button>'
    +'<span class="st-rq-lb">'+esc(a.k)+'</span></div>';}).join('')
  +'</div>';
 /* THE BINAURAL TOGGLE BELONGS HERE TOO, 9 November, his words: "why is a
    binaural audio toggle not on the release?" Only the full run screen
    (ui/release.js's own #rel, relSws) carried it; this reads and sets the
    same tone through the same relToneOn/uiSet pair the run itself plays,
    so setting it here before a run begins is the one switch read early,
    not a second one. A SEPARATE ID, strtone and not reltone: #rel sits in
    the document whether or not a run has begun (shell/body.html), so both
    switches can exist at once and a shared id would collide.

    ITS OWN WRAPPER CLASS, NOT release.js's .rel-sws. That class's rule
    only exists once relCss() has run, and relCss also registers --rc as
    a typed @property (its own "<color>" syntax block), which is a
    document-wide registration, not scoped to release.js's own markup:
    calling it from here, before any release run, made the Field dock's
    unrelated --rc/--lc custom properties (ui/ui.js, ui/component.js, a
    plain string swap, never meant to be colour-typed) start reading back
    browser-normalized rgb() instead of the literal hex seatCol hands
    them, which is exactly the regression tests/railmenu.js's RM2 caught.
    .st-relsws (shell/head.html) is a plain, always-present rule with no
    such side effect. */
 o+='</div><div class="st-rlfoot">'
  /* pace and patterns set the run, so they go with it on a worked example.
     THE BINAURAL TOGGLE MOVES INTO THIS SAME ROW, 10 November, his words:
     "the binaural audio button, you're going to move to the lower right
     next to the number of patterns," said twice in the one round. It was
     a sibling row above this one, built that way only because it needed
     to exist whether or not Speed/Patterns were drawn (bedCan() is its
     own, separate gate from showOnly()); moving it inside rel-fields ties
     its visibility to theirs too, which reads as one setting group doing
     one job (how the run plays) rather than a regression, since nothing
     here is a run control a worked example could act on anyway. */
  +(showOnly()?'':'<div class="rel-fields st-fields">'
   /* PACE READ RUN SPEED ALREADY ON THE CARD, round LY, his words then:
      "run speed instead of pace." This panel never got that update; round
      of 29 October his words made it plain it still said Pace, so it now
      reads what the card already reads, the two kept in step the way
      Times said was kept in step with the card below.
      RUN SPEED READS SPEED, 6 November, his words on this exact screen:
      "get rid of the word run and just put speed." The field's id and
      RUN.pace are untouched, only the label moved again. */
   +'<label class="rel-field"><span>Speed</span><input type="number" id="strpace" min="0.5" max="2" step="0.1" value="'+RUN.pace+'"></label>'
   /* PATTERNS, round of 29 October, overriding the 17 October ruling below
      kept for the record: his words then were that Times said is the
      card's own word for the allowance's real unit, not Patterns, because
      the field counts how often a line is said and not a pattern count.
      His words today, looking at this exact panel, were to call it
      Patterns anyway, so both this field and the card's own
      (ui/release.js) now read Patterns; a mismatch between the two was
      the thing the earlier rename existed to prevent, so both still
      agree, only on the opposite word. */
   +'<label class="rel-field"><span>Patterns</span><input type="number" id="strdose" min="1" max="'+stDoseMax()+'" step="1" value="'+RUN.dose+'"></label>'
   +((typeof accTog==='function'&&typeof bedCan==='function'&&bedCan())
    /* title HERE, ON THE WRAPPER, 10 November: the standing-up switch now
       hides its own visible label (head.html's own rule, same round) to
       fit the one-line row his words asked for, the same move every pill
       on this rail already makes (a name in title/aria-label, never
       printed beside the control). accTog's button already carries the
       name to a screen reader through its own aria-label; this is the
       mouse's equivalent, since the hidden span can print no native
       tooltip of its own once it is off screen. */
    ?'<div class="st-relsws" title="Binaural tone">'+accTog('Binaural tone','strtone',typeof relToneOn==='function'&&relToneOn(),'')+'</div>':'')
  +'</div>')
  /* ENABLED ON A SELECTION, NOT ON A PRICE, so a spent allowance still
     reaches the card that refuses it and says why. */
  /* and on a worked example it is the preview line, ruled 16 October: the
     rings above are the reading and stay, Run is the run and does not */
  +(showOnly()?showNote('release','st-show')
   /* RELEASE, not Run release, round of 29 October, his words: "change run
      release to just release." The card's own button (ui/release.js)
      renamed the same way, same reason the fields above stay matched. */
   :'<button type="button" class="st-go" id="strun"'+(M.sel.length?'':' disabled')+'>Release</button>')+'</div>';
 e.innerHTML=o;
 /* lit from within, in the heaviest selected seat's colour, as bright as
    that address is heavy. Round HX, B, which he did not strike.

    AND ONLY ONCE SOMETHING HAS BEEN ADDED TO IT. Round LO, his words:
    "release should not start red. It should only become red once you add
    things to it." It started lit because of the third source above: with
    nothing picked in the bank and nothing found in the journal, the panel
    offers the three heaviest addresses the field already holds, and it lit
    in the first one's colour on arrival. Root is the heaviest seat on many
    fields and Root is red, so the panel opened red on a person who had done
    nothing. The offer stays, because Run on the heaviest three is a real
    route, but it is drawn in the accent like an empty panel. The seat's
    colour arrives the moment a word the journal read or a pick from the bank
    puts something in, which is what added means here. */
 var lit=M.added&&M.sel.length;
 e.style.setProperty('--glow',lit?seatCol(M.sel[0].b):'var(--accent)');
 e.style.setProperty('--lux',lit?(0.15+0.2*Math.min(10,M.sel[0].sq)/10).toFixed(2):'.1');
 e.querySelectorAll('[data-rq]').forEach(function(b){b.onclick=function(){
  var i=+b.getAttribute('data-rq'); ST_OFF[i]=ST_OFF[i]!==true; stRelPanel();};});
 /* the card's own clamps, so a value typed here cannot be one the card
    would refuse */
 var f;
 if((f=document.getElementById('strpace')))f.onchange=function(){
  RUN.pace=Math.max(0.5,Math.min(2,Math.round((+this.value||1)*10)/10));
  RUN.speed=2.2/RUN.pace; this.value=RUN.pace;};
 if((f=document.getElementById('strdose')))f.onchange=function(){
  RUN.dose=Math.max(1,Math.min(stDoseMax(),Math.round(+this.value)||1)); this.value=RUN.dose;};
 /* the same never-both-at-once rule release.js's own #reltone keeps: tone
    on turns voice off, read through the same relVoiceWanted/uiSet pair. */
 if((f=document.getElementById('strtone')))f.onclick=function(){
  if(typeof relToneOn!=='function'||typeof uiSet!=='function')return;
  var on=!relToneOn(); uiSet('tone',on);
  if(on&&typeof relVoiceWanted==='function'&&relVoiceWanted())uiSet('voice',false);
  if(typeof relRender==='function')relRender();
  stRelPanel();};
 var go=document.getElementById('strun');
 if(go)go.onclick=function(){
  if(!M.sel.length)return;
  RUN.speed=2.2/(RUN.pace||1);
  /* the entry is named only when the panel is reading the last commit's own
     addresses: not a bank pick, not a draft still being typed, not the three
     heaviest held, none of which came from one entry */
  relPick(M.sel.map(function(n){return n.i;}),M.fromLast&&STV.lastT?{story_t:STV.lastT}:null);
  var begin=document.getElementById('relgo'); if(begin)begin.click();};}

/* ============================================================
   THE ANALYTICS PREVIEW, CLOSED, AT THE FOOT OF THE RELEASE COLUMN.

   Round JJ, his words: "add in a button for one of the analytic layers, just
   off the imprints ... low on the right hand side in the menu, in a closed tab
   at the very bottom. This will collect analytics from the sniffer, over the
   last week, over the last month, what are the major patterns. It branches
   naturally back to the analytic, main analytic page." And, in the same
   breath: "I'm not certain how I want that shaped yet." So this is the least
   that answers the sentence, and it is written to be thrown away when he
   shapes it: two windows, three names each, one line off Analytics, one door.

   A PATTERN HERE IS A CHARGE THE WORDS NAMED, counted by entry. The record
   keeps each entry's text and its seat totals and nothing finer, so the only
   way to say what a week of writing named is to run the sniffer, parseStory,
   over each committed entry again. That is the engine's own read and not a
   second one, and it is pure over the text: it reads the address table and
   nothing a release or a slider moves. Two things are kept out on purpose.
   An inferred imprint, because parseStory marks it as the seat's modal charge
   chosen by arithmetic and a renderer must not print it as a finding; on "my
   chest was tight and I felt scared" that is Disgust four times, which the
   words never said. And the weight, because a count of entries is a thing a
   person can check by reading their own journal, where a summed amount is a
   figure with no scale beside it.

   The word is charge and not pattern, because Patterns is already the field
   beside Run in the panel above this one, where it means how many lines a
   channel runs. One word per concept, and that one was taken first.

   RUNNING HOT IS ANALYTICS' OWN LIST, CALLED AND NOT COPIED. hotList, hotDir
   and anaHotInk are the three calls anaHot makes, so the names here are the
   first rows the full page prints and the two cannot disagree. Analytics has
   no windowed view of the journal for this to reuse, which is why the windows
   above are read here and the hot line is not. Nothing on an unread field,
   the rule anaHot already keeps.

   THE DOOR IS ANALYTICS ITSELF, since round LV. Analytics is integer 4 and
   had no door of its own for a while, folded into Summary and reached only
   through TABREAL, which is why this used to call setTab(TAB.ANALYTICS) and
   let the redirect find Summary rather than naming a tab that did not
   exist. It has its own door again, TABREAL no longer answers it with
   Summary, and the call below needs no change: it always meant Analytics
   and now it also lands there. #ana is brought into view at its Running hot
   list on arrival, which is the part of it this preview is a slice of.
   ============================================================ */
var ST_ANA_TOP=3, ST_ANA_WIN=[[7,'Last 7 days'],[30,'Last 30 days']];
/* the windows are cached on the record and the hour, so a render that moves
   nothing in the journal re-reads nothing. The hour lets the window slide. */
var STA={key:null,wins:null};
function stAnaWins(){
 var ents=(typeof CURP!=='undefined'&&CURP&&CURP.story&&CURP.story.entries)||[];
 var now=Date.now(), key=S.who+'|'+ents.length+'|'+(ents.length?ents[ents.length-1].t:'')+'|'+Math.floor(now/36e5);
 if(STA.key===key)return STA.wins;
 var far=ST_ANA_WIN[ST_ANA_WIN.length-1][0], read=[];
 /* each entry is read once, against the widest window, then bucketed */
 ents.forEach(function(e){var at=Date.parse(e&&e.t);
  if(!(at>=now-far*864e5)||typeof e.text!=='string')return;
  var got={};
  parseStory(e.text).imprints.forEach(function(im){if(im.inferred||!im.fetter)return;
   got[im.fetter]=(got[im.fetter]||0)+im.amt;});
  read.push({at:at,got:got});});
 var wins=ST_ANA_WIN.map(function(w){var from=now-w[0]*864e5,by={},n=0;
  read.forEach(function(r){if(r.at<from)return; n++;
   Object.keys(r.got).forEach(function(f){var o=by[f]=by[f]||{nm:f,n:0,amt:0};o.n++;o.amt+=r.got[f];});});
  /* ties go to the heavier, so two charges named equally often keep a stable order */
  var top=Object.keys(by).map(function(f){return by[f];})
   .sort(function(a,b){return b.n-a.n||b.amt-a.amt||(a.nm<b.nm?-1:1);}).slice(0,ST_ANA_TOP);
  return {say:w[1],entries:n,top:top};});
 STA={key:key,wins:wins};
 return wins;}
/* inline styles only, for the reason stViewHtml gives. A details element is
   closed by the platform, so the section costs its one line until it is
   opened and needs no script to open. Its state is STV's, so a redraw of the
   page does not shut it under a person reading it. */
var ST_ANA_CHEV='M9 6l6 6-6 6';
function stAnaHtml(){
 return '<details class="st-pan" id="stana"'+(STV.ana?' open':'')+' style="display:block;flex:0 0 auto;padding:0">'
  +'<summary style="display:flex;align-items:center;gap:8px;min-height:var(--tap);padding:0 16px;cursor:pointer;list-style:none">'
  +'<svg id="stanachev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style="flex:0 0 auto;fill:none;'
  +'stroke:var(--dim);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:transform var(--t-micro) var(--ease-out);'
  +'transform:rotate('+(STV.ana?90:0)+'deg)"><path d="'+ST_ANA_CHEV+'"/></svg>'
  +'<span class="st-eb">Analytics</span><span class="st-tag">preview</span></summary>'
  +'<div id="stanab" style="padding:0 16px 14px;font-size:13px;color:var(--mid)"></div></details>';}
function stAnaWire(){
 var d=document.getElementById('stana'); if(!d)return;
 d.addEventListener('toggle',function(){STV.ana=d.open;
  var c=document.getElementById('stanachev'); if(c)c.style.transform='rotate('+(d.open?90:0)+'deg)';
  if(d.open)stAnaPaint();});
 if(STV.ana)stAnaPaint();}
function stAnaRow(ring,name,right,title){
 return '<div style="display:flex;align-items:center;gap:8px;padding:3px 0"'+(title?' title="'+esc(title)+'"':'')+'>'
  +ring+'<span style="flex:1 1 auto;min-width:0;color:var(--ink)">'+esc(name)+'</span>'+right+'</div>';}
function stAnaHead(t,right){
 return '<div style="display:flex;justify-content:space-between;gap:8px;margin-top:12px;padding-bottom:3px;'
  +'border-bottom:1px solid var(--edge)"><span class="st-eb">'+t+'</span>'
  +'<span style="font-size:12px;color:var(--dim)">'+right+'</span></div>';}
function stAnaPaint(){
 var b=document.getElementById('stanab'); if(!b)return;
 var o='';
 stAnaWins().forEach(function(w){
  o+=stAnaHead(w.say,w.entries?w.entries+(w.entries===1?' entry':' entries'):'\u2013');
  if(!w.entries)o+='<p class="st-none" style="margin-top:4px">Nothing written.</p>';
  else if(!w.top.length)o+='<p class="st-none" style="margin-top:4px">No charge named in words.</p>';
  else o+=w.top.map(function(t){var c=CHILD.filter(function(x){return x.nm===t.nm;})[0],col=seatCol(c?c.seat:'Heart');
   var ic=c?'<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" style="flex:0 0 auto;fill:none;stroke:'+col
     +';stroke-width:1.8;stroke-linejoin:round;stroke-linecap:round"><path d="'+c.ic+'"/></svg>'
    :'<span class="st-ring" style="--c:'+col+'"></span>';
   return stAnaRow(ic,t.nm,'<em style="font-style:normal;font-size:12px;color:var(--dim)">in '
    +t.n+(t.n===1?' entry':' entries')+'</em>');}).join('');});
 var r=compute();
 if(!r.unread&&typeof hotList==='function'){
  var L=hotList();
  o+=stAnaHead('Running hot',L.length?L.length+(L.length===1?' address':' addresses'):'');
  o+=L.length?L.slice(0,ST_ANA_TOP).map(function(n){var d=hotDir(n);
    return stAnaRow('<span class="st-ring" style="--c:'+seatCol(n.b)+'"></span>',n.k,
     '<em style="font-style:normal;font-size:12px;color:'+anaHotInk(d)+'">'+d+'</em>',ANA_DIRSAY[d]||'');}).join('')
   :'<p class="st-none" style="margin-top:4px">No address is past five.</p>';}
 o+='<button type="button" class="btn" id="stanago" style="margin-top:14px">Open analytics</button>';
 b.innerHTML=o;
 var go=document.getElementById('stanago');
 if(go)go.onclick=function(){
  setTab(TAB.ANALYTICS);
  /* ON THE FRAME AFTER setTab's OWN. setTab puts the page back at its top,
     once now and once on the next frame, and stacked it is the page that
     scrolls. Brought into view straight away, measured at 390 by 844, the
     list was put on screen and then sent 4993 pixels back down it. A frame
     asked for after setTab's runs after it. */
  var bring=function(){var a=document.getElementById('ana'), at=a&&(a.querySelector('.ana-hot')||a);
   if(at&&at.scrollIntoView)at.scrollIntoView({block:'start'});};
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(bring); else bring();};}


/* ============================================================
   THE LAWS, READ FROM THE SAME WORDS A STORY ALREADY GAVE. His own
   instruction, 3 October: "wire that in... it should be easy because the
   system is already done." It was. `sniffLaws` and `sniffGates`
   (engine/sniff.js, built against SNIFFER_SPEC.md sections 6 and 8) already
   read a story's text for which of the 21 laws of integrity reads as held or
   let go, and for whether the words read as aware or reactive, attached or
   detached, folded into one avoidance number. Both existed and were called
   from exactly one place before this, the tutorial's own internal debug
   object, which read a different field off the same contract and left the
   rest on the floor.

   THIS PANEL READS, IT DOES NOT SCORE, ON PURPOSE. The spec itself rules
   that a violation "is not decorative, it is the actual input to the
   coherence number" (section 6), and that is the next, separate step: moving
   a person's own law answer, and therefore coherence itself, from what the
   sniffer reads rather than what Intake asked. Every number that already
   moves coherence in this product (the release lift above, lawLift) is
   fitted first to a real measured anchor, his own CQ at 88 to 92. This has
   no anchor yet, so it is not wired to that number tonight. Named here and
   in PLAN.md as the deliberate next piece rather than guessed at with an
   unfitted magnitude.

   A REAL GAP, FOUND WHILE WIRING THIS IN AND NOT BEFORE. DECISIONS.md
   settled this product's own 21 laws as SI (engine/data/canon.js) with
   Responsibility and Accountability where the book, SNIFFER_SPEC.md and
   the sniffer's own cue tables (LAWCUE, LAWVIO, engine/lexicon.js and
   engine/sniff.js) still carry Wisdom and Ownership. The two names were
   never reconciled. A hit on either is filtered out below rather than shown
   against a law this product does not have, and Responsibility and
   Accountability are left with no cue words to read a violation from at
   all. Named rather than patched with invented wording, since writing the
   cue phrases a real violation of either would sound like is a voice
   decision on its own and not a side effect of wiring a panel in. */
var ST_LAW_TOP=3;
/* ONE PLAIN CLAUSE PER VIOLATION, so the word never stands alone (V23). Not
   the spec's own phrasing, which runs to abstractions a ten year old has
   not met (V21): "Folly and sophistry" and "Synthetic departure" are the
   book's words for the law, not a sentence a person says about their own
   day. Keyed by the exact violation string sniffLaws returns, which is
   LAWVIO's own string, so a change there is a change here and not a second
   table drifting from the first. */
var ST_LAWSAY={
 Deception:'saying something that was not quite true',
 Opacity:'keeping something back that the other person never got to know',
 Division:'treating some people as not one of us',
 Reactivity:'snapping before you noticed you were upset',
 Absence:'being somewhere else in your head while it happened',
 Volatility:'your peace depending on things going right',
 Indifference:'not caring what happened to someone else',
 'Self-abandonment':'putting yourself last until you stopped counting',
 Resentment:'still holding it against someone',
 Avoidance:'putting it off instead of facing it',
 Overindulgence:'one more, past the point you meant to stop',
 Betrayal:'saying you would and then not doing it',
 Corruption:'bending what is fair to get what you wanted',
 'Cruelty and carelessness':'hurting someone, on purpose or without noticing',
 'Pride and grandiosity':'needing to be seen as better than everyone else',
 'Self-abasement':'making yourself smaller than you are',
 'Hoarding on giving':'holding back what you had room to give',
 'Entitlement on receiving':'expecting more than was offered',
 Attachment:'needing it to go exactly one way',
 'Forcing or scattering':'pushing before its time, or giving up on it too soon',
 Chaos:'noise piling on noise until nothing settled',
 'Synthetic departure':'pulled further from what your body actually needs'};
var STLW={key:null,wins:null,gate:null};
function stLawWins(){
 var ents=(typeof CURP!=='undefined'&&CURP&&CURP.story&&CURP.story.entries)||[];
 var now=Date.now(), key=S.who+'|'+ents.length+'|'+(ents.length?ents[ents.length-1].t:'')+'|'+Math.floor(now/36e5);
 if(STLW.key===key)return STLW.wins;
 var far=ST_ANA_WIN[ST_ANA_WIN.length-1][0], read=[];
 ents.forEach(function(e){var at=Date.parse(e&&e.t);
  if(!(at>=now-far*864e5)||typeof e.text!=='string')return;
  var laws=(typeof sniffLaws==='function'?sniffLaws(e.text):[])
   .filter(function(v){return SINAMES.indexOf(v.law)>=0;});
  var gates=typeof sniffGates==='function'?sniffGates(e.text):null;
  read.push({at:at,laws:laws,gates:gates});});
 var wins=ST_ANA_WIN.map(function(w){var from=now-w[0]*864e5,by={},n=0;
  read.forEach(function(r){if(r.at<from)return; n++;
   r.laws.forEach(function(v){var k=v.law+'|'+v.violation, o=by[k]=by[k]||{law:v.law,violation:v.violation,n:0,score:0};
    o.n++;o.score+=v.score;});});
  var top=Object.keys(by).map(function(k){return by[k];})
   .sort(function(a,b){return b.n-a.n||b.score-a.score||(a.law<b.law?-1:1);}).slice(0,ST_LAW_TOP);
  return {say:w[1],entries:n,top:top};});
 /* the gate reading is the most recent entry's own, never an average across
    the window: an avoidance number is a reading of one story, not a trend,
    and the upstream pair it was built from travels with it everywhere it is
    shown, the spec's own rule 5 for this exact number (section 8). */
 var withGate=read.filter(function(r){return r.gates&&r.gates.read;}).sort(function(a,b){return b.at-a.at;});
 STLW={key:key,wins:wins,gate:withGate.length?withGate[0].gates:null};
 return STLW.wins;}
var ST_LAW_CHEV='M9 6l6 6-6 6';
function stLawHtml(){
 return '<details class="st-pan" id="stlaw"'+(STV.law?' open':'')+' style="display:block;flex:0 0 auto;padding:0">'
  +'<summary style="display:flex;align-items:center;gap:8px;min-height:var(--tap);padding:0 16px;cursor:pointer;list-style:none">'
  +'<svg id="stlawchev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style="flex:0 0 auto;fill:none;'
  +'stroke:var(--dim);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:transform var(--t-micro) var(--ease-out);'
  +'transform:rotate('+(STV.law?90:0)+'deg)"><path d="'+ST_LAW_CHEV+'"/></svg>'
  +'<span class="st-eb">Laws</span><span class="st-tag">noticed</span></summary>'
  +'<div id="stlawb" style="padding:0 16px 14px;font-size:13px;color:var(--mid)"></div></details>';}
function stLawWire(){
 var d=document.getElementById('stlaw'); if(!d)return;
 d.addEventListener('toggle',function(){STV.law=d.open;
  var c=document.getElementById('stlawchev'); if(c)c.style.transform='rotate('+(d.open?90:0)+'deg)';
  if(d.open)stLawPaint();});
 if(STV.law)stLawPaint();}
function stLawRow(t){
 var l=SI.filter(function(x){return x.nm===t.law;})[0], c=l?seatCol(l.b):'var(--dim)';
 var ring=l?'<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" style="flex:0 0 auto;fill:none;stroke:'+c
   +';stroke-width:1.8;stroke-linejoin:round;stroke-linecap:round"><path d="'+l.ic+'"/></svg>'
  :'<span class="st-ring" style="--c:'+c+'"></span>';
 var say=ST_LAWSAY[t.violation]||t.violation.toLowerCase();
 return '<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0">'+ring
  +'<span style="flex:1 1 auto;min-width:0;color:var(--ink)">'+esc(t.law)
  +'<span style="color:var(--dim)">, '+esc(say)+'</span></span>'
  +'<em style="flex:0 0 auto;font-style:normal;font-size:12px;color:var(--dim)">in '+t.n+(t.n===1?' entry':' entries')+'</em></div>';}
function stLawPaint(){
 var b=document.getElementById('stlawb'); if(!b)return;
 /* KEPT, NOT HELD. Held is the word for charge at an address, so a law is
    kept or let go, and the set is named the way every other surface names it,
    the count read off SI. */
 var o='<p class="st-none" style="margin:0 0 10px">From your own words, not a score: which of the '+SI.length+' Laws of '
  +'Moral Integrity read as kept or let go in what you wrote. Nothing here moves your coherence number yet.</p>';
 stLawWins().forEach(function(w){
  o+=stAnaHead(w.say,w.entries?w.entries+(w.entries===1?' entry':' entries'):'–');
  if(!w.entries)o+='<p class="st-none" style="margin-top:4px">Nothing written.</p>';
  else if(!w.top.length)o+='<p class="st-none" style="margin-top:4px">No law read as let go in these words.</p>';
  else o+=w.top.map(stLawRow).join('');});
 var g=STLW.gate;
 if(g&&g.intentional){
  /* RENAMED FROM INTENTION, 28 October. This heading named the six gates'
     avoidance cascade (engine/sniff.js sniffGates, engine/verp.js VERP)
     "Intention" before the ruled Intention, said against done, had a
     screen of its own. Two different readings sharing one word, the exact
     defect one word per concept exists to stop. This stays named for what
     it is: right action read from this entry's own words. The real
     Intention is on the Instruments row (ui/ui.js). */
  o+=stAnaHead('Right action','your last entry');
  /* NEVER THE AVOIDANCE NUMBER ALONE, the spec's own rule: it reads as a
     character flaw without the two readings it was built from beside it. */
  o+='<p style="margin:6px 0 2px">Avoidance reads <b>'+fmtPct('avoid',g.intentional.avoidance)+'</b> in your last entry, built '
   +'from the two readings below it and never shown without them.</p>'
   /* TWO LAWS OF ACTION, EACH AGAINST THE MOVE ACROSS FROM IT. These read
      "Aware against reactive, clean", and sniffGates (engine/sniff.js) scores
      aware against ignore, so reactive named an end the figure never counts,
      and clean was the spec's word for the share. Each figure is the right
      action's share of its own pair. */
   +'<p style="margin:2px 0">Awareness against ignorance: <b>'+fmtPct('clean',g.aware)+'</b> awareness.</p>'
   +'<p style="margin:2px 0">Detachment against attachment: <b>'+fmtPct('clean',g.detached)+'</b> detachment.</p>';}
 b.innerHTML=o;}

/* ============================================================
   WHAT THE SNIFFER IS READING, SHOWN IN THE SENTENCE IT READ IT IN.

   The parse already knows every word it matched and which seat that word
   belongs to. None of it reached the page: the bar said "14 tagged" and
   there was no way to see which fourteen, so the one place the instrument
   explains itself was a number.

   AND THEN IT READ THE SENTENCE TWICE, which is this pass.

   The scanner records hit.at on every hit, an offset into the normalised copy
   it scanned. This threw those offsets away and ran its own global regular
   expression over the raw text, which is a second reading of the same sentence
   by a different rule, and the two rules do not agree. Measured on an 87 word
   story: the engine read 8 hits and this lit 5. It dropped the coherent hit
   because it filtered coherent hits out of the table it built the expression
   from, so the words that take charge OFF a person were the only ones invisible
   on the surface whose whole job is to show the reading. And a phrase the
   scanner matched across punctuation could not be found at all: on "I wanted to
   shut the door, and not come out", the scanner reads one hit, marksOf lights
   the twenty two characters "shut the door, and not" and names them wanting to
   disappear, and the expression over the raw text matches nothing, because the
   normalisation the scanner read through had turned the comma into a space.

   engine/sniff.js carries normMap and marksOf now, ported from proto/story4
   where four prototypes each had a copy. One string, one set of offsets, and a
   mark lands on exactly the characters that were scored.

   AND THE NAME IS CARRIED BUT NOT DRAWN. The engine holds a label on a named
   hit, "silenced" on stayed quiet and "self-attack" on ashamed of myself, and
   marksOf carries them, so each mark states its name, its fetter, its amount
   and whether it is coherent. It is stated and not shown: this layer is
   aria-hidden and sits behind the textarea with pointer-events none, so a
   title on it reaches nobody. The gate asserts the attributes, so they are
   not decoration waiting to rot.

   A NEGATED MARK RUNS BACK OVER ITS NEGATOR AND IS STRUCK, see stMarks. It is
   still one mark per stretch marksOf placed, so the count the gate holds is
   unchanged, and the characters in the layer are still exactly the box's. */
function stHLHtml(txt){
 var p=ST_PARSED;
 /* not p.hits alone: since S1 a story whose only word was said with a no
    has no counted hit, and that word is still drawn, struck */
 if(!p)return esc(txt);
 var marks=(STR.t===txt&&STR.marks.length)?STR.marks:stMarks(txt,p);
 if(!marks.length)return esc(txt);
 var out='',last=0;
 marks.forEach(function(m){
  /* marksOf returns one mark per stretch of text, already sorted and already
     merged where a phrase covers the words inside it, so this walks forward
     and never has to decide precedence. That decision is the scanner's. */
  /* a word said with a no runs back over its no, S1; a word about someone
     else runs back over who it is about, S2, so the reason is on the letters */
  var back=m.neg?m.negFrom:m.oth?m.whoFrom:null;
  var from=(back!=null&&back>=last)?back:m.s;
  out+=esc(txt.slice(last,from))
   /* A HIT CARRIES A SEAT KEY, NOT A BAND NAME. LEX stores 'throat' and
      seatCol wants 'Throat', so every word used to resolve to the same
      fallback and six fetters across four seats came out in one colour, which
      is the opposite of the point. marksOf has already run the key through
      K2BAND and put the answer in m.bn. A coherent hit has no seat, because
      it is not charge at an address, so it takes the accent the way an
      unseated hit always has here. */
   +'<mark class="st-f'+(m.neg?' neg':m.oth?' oth':'')+'" style="--c:'+(m.bn?seatCol(m.bn):'var(--accent)')+'"'
   +(m.label?' data-nm="'+esc(m.label)+'"':'')
   +(m.fet?' data-fet="'+esc(m.fet)+'"':'')
   +(m.amt!=null?' data-amt="'+esc(m.amt)+'"':'')
   +(m.coh?' data-coh="1"':'')
   +'>'+esc(txt.slice(from,m.e))+'</mark>';
  last=m.e;});
 return out+esc(txt.slice(last));}
function stPaintHL(){
 var hl=document.getElementById('sthl'); if(!hl)return;
 /* the trailing newline keeps the last line's height when the text ends on
    a return, so the two layers stay the same height. */
 hl.innerHTML=stHLHtml(ST_TEXT)+'\n';
 var ta=document.getElementById('sttext'); if(ta)hl.scrollTop=ta.scrollTop;}

/* RECORDING FAILED SILENTLY, WHICH IS WHY IT LOOKED BROKEN.

   Every failure path here flipped the button back to its resting state and
   said nothing: a person pressed Record, the browser refused, and the
   control simply un-pressed itself. The standing rule in this product is
   that every write which can fail reports through status() and a control
   never claims success before it has it. This one broke it three ways.

   Speech recognition needs a secure context. On a file:// page the
   constructor exists and start() either throws or fails on the first
   result, which is the most common way this is met and the one that reads
   most like the feature being broken. It is named now, before anything is
   attempted.

   start() can also throw synchronously, and onerror carries a reason that
   was being discarded. Both are reported in the words that fit them: a
   refused permission is a different problem from no microphone, and a
   person can act on the difference. */
/* THE CLOCK, ROUND LV: "I want the time showing how long my recording is."
   ST_LISTEN_T0 is stamped the instant start() actually succeeds, not the
   instant the button is pressed, so a start that throws or a browser that
   refuses never shows a clock ticking over a recording that is not
   running. stFrame reads it every frame the Story tab is up, the same frame
   the chart already draws on, so this costs no second loop; it only ever
   writes the one span's textContent, and only when the second it shows has
   actually changed. */
var ST_LISTEN_T0=null;
function stMicFmt(ms){
 var s=Math.max(0,Math.floor(ms/1000)), m=Math.floor(s/60); s=s%60;
 return (m<10?'0':'')+m+':'+(s<10?'0':'')+s;}
function stMicElapsed(){return ST_LISTEN_T0?performance.now()-ST_LISTEN_T0:0;}
function stMicTick(){
 if(!ST_LISTEN||!ST_LISTEN_T0)return;
 var e=document.getElementById('stmictime'); if(!e)return;
 var v=stMicFmt(stMicElapsed());
 if(e.textContent!==v)e.textContent=v;}
function stMicLine(code){
 var M={'not-allowed':'Recording needs microphone permission. Allow it in the browser and press Record again.',
  'service-not-allowed':'The browser blocked speech recognition for this page.',
  'audio-capture':'No microphone was found.',
  'network':'Speech recognition could not reach the network.',
  'no-speech':'Nothing was heard. Press Record and speak, or type it.',
  'aborted':''};
 return (code in M)?M[code]:('Recording stopped: '+code+'.');}
function stMicSay(code){ var m=stMicLine(code); if(m)status(m,'fail'); }
/* THREE ERRORS THAT MEAN THIS DEVICE CANNOT BE HEARD, 3 November, the second
   half of the fix below. The browser has a recogniser and the page is secure,
   so stMic starts, and then the recogniser reports one of these: no
   microphone on the device (audio-capture), the browser or a policy refusing
   speech recognition outright (service-not-allowed), or the browser's speech
   service out of reach (network, which is every press for anyone offline or
   behind a firewall that blocks it). Each went to stMicSay alone and left
   STV.chat true, so the person was told what broke and given nothing to type
   in. Reproduced on c5140956, all three. They go to stVoiceCant now, the same
   box as the two cases above. not-allowed is not on this list: see
   stMicRefused. */
var ST_CANT_HEAR={'audio-capture':1,'service-not-allowed':1,'network':1};
/* A REFUSED MICROPHONE, AND WHETHER IT IS FOR GOOD. not-allowed comes both
   from a prompt the person closed, which the next press asks again, and from
   a browser that has blocked the microphone for this page, which no press
   will ever undo: only the browser's own site settings can. The error itself
   does not say which. The Permissions API does: measured 3 November in
   Chromium, a microphone the browser has stored as blocked reads 'denied'
   from navigator.permissions.query({name:'microphone'}), and one that will be
   asked again reads 'prompt', on http://localhost and on a file alike. So
   'denied' opens the box, and the line says where the block is undone.
   Anything else (prompt, granted, a browser with no Permissions API, a query
   that throws or never answers) keeps the old line and no box, because
   nothing then says the refusal is permanent, and the box is not drawn on a
   guess. Measured in Chromium only; Safari reports this state too by its own
   documentation and is not measured here. */
function stMicRefused(){
 stMicSay('not-allowed');
 var P=typeof navigator!=='undefined'&&navigator.permissions;
 if(!P||typeof P.query!=='function')return;
 var q; try{ q=P.query({name:'microphone'}); }catch(e){ return; }
 Promise.resolve(q).then(function(s){
  if(!s||s.state!=='denied'||ST_LISTEN)return;
  stVoiceCant('The browser has blocked the microphone for this page. Allow it in the site settings beside the address to chat by voice. Typing works.');
 },function(){});}
/* RECORDING THAT WILL NOT START, decided 3 November. When start() itself
   throws, or the recogniser cannot be built, the old line said "Typing
   works." over a page with nothing to type in. It is not treated like the
   three errors above on the first throw: every press builds a new recogniser,
   so a throw is not a state the page is stuck in, and a double start or a
   timing slip is gone by the next press. The first throw now says to press
   Chat again, which is true. A second throw in a row means the next press
   will fail the same way, so it opens the box. ST_START_FAIL counts throws
   in a row, and a start that works sets it back to nought. */
var ST_START_FAIL=0;
function stMicStartFail(err){
 ST_WANT_LISTEN=false; ST_LISTEN=false; ST_LISTEN_T0=null; ST_REC_ON=false;
 ST_START_FAIL++;
 var why=err&&err.message?' ('+String(err.message).replace(/[.\s]+$/,'')+')':'';
 if(ST_START_FAIL>=2){ stVoiceCant('Recording could not start again'+why+'. Typing works.'); return; }
 stRender();
 status('Recording could not start'+why+'. Press Chat to try again.','fail');}
/* WHEN VOICE CANNOT RUN AT ALL, THE BOX COMES BACK, 3 November. The two
   refusals below said "Typing works." while the page had no box to type in:
   since the reply line went, 29 October, nothing renders #sttext while
   STV.chat is true, so a person on a browser with no speech recognition, or
   on a page the browser will not give a microphone, could press Chat, be
   told to type, and have no way to say anything to Source AI at all.
   Reproduced on b6f86211 in headless Chromium, both cases, before this.
   This is not the reply line back. It is the plain box the crisis door
   already opens (STV.chat false, crisisTalk in ui/crisis.js), the same
   #sttext, the same oninput into ST_TEXT and the same Commit, so nothing new
   is drawn. These two came first, the browser has no recogniser and the page
   is not one the browser will give a microphone to, both true for as long as
   the page is open. The same day the three errors in ST_CANT_HEAR, a
   microphone the browser has blocked for good (stMicRefused) and a second
   start that throws in a row (stMicStartFail) were added, for the same
   reason. Silence (no-speech) and a prompt the person closed are not on that
   list, and keep their own lines in stMicSay. STV.novoice
   holds it across a Commit, which otherwise puts chat back on (stCommit),
   and is never saved, so the next page load tries voice again. */
/* A greeting still on its way is dropped here, by moving SRC_VOICE.seq on:
   the Journal is a typing page now, and that greeting's own failure line was
   measured landing after this one and writing over it, so the person read
   "could not speak that line" where the line saying typing works should be. */
function stVoiceCant(msg){
 ST_LISTEN=false; ST_LISTEN_T0=null; ST_WANT_LISTEN=false;
 SRC_VOICE.seq++; srcVoiceStop(); ST_HUSH=false;
 /* typed goes because the box is the forced one now: Type instead is not
    drawn beside it, and its Close would hand the person back to a voice
    that cannot run */
 STV.novoice=true; STV.typed=false; STV.chat=false; STV.focus='write'; stRender();
 var ta=document.getElementById('sttext'); if(ta)ta.focus();
 status(msg,'fail');}
/* TYPE INSTEAD, 4 November, see the ruling at #sttype in stRender. It is the
   same box stVoiceCant opens and on the same switch, STV.chat false, so the
   words go into ST_TEXT through the box's own oninput and Commit is stCommit:
   nothing here is a second way to write an entry. What differs is that voice
   works, so nothing holds the box open. Commit shuts it (stCommit), Chat
   shuts it and listens (stMic), and a second press shuts it with the words
   still in the entry, where srcChatSync files them as the person's next turn
   once the thread is back.

   A RECORDING RUNNING WHEN IT OPENS IS STOPPED, the way Chat's own stop
   branch stops it, stop and not abort, so the sentence being spoken is
   handed back and lands in the box rather than being thrown away. Left
   running, the next sentence would be written into the entry by
   srcTurnCommit while the person typed in it, and the render that follows
   each one rebuilds the box under their fingers. A line Source AI is
   already speaking is let finish: ST_WANT_LISTEN false is what stops stHush
   starting the recording again once it ends, and srcPaint speaks no new
   reply while nobody is listening for it. */
/* STV.chat NO LONGER MOVES HERE, 9 November. It used to flip false to open
   the box and true to close it, which is the reflow his round named: the
   whole conversation thread and Uni left while the box stood in their
   place. STV.chat stays exactly as it already was (true, in real use,
   always); only STV.typed moves, and the box's own open/shut is the
   #stflow.st-simple .st-ed CSS rule reading it, additive beside the
   thread rather than a replacement for it. */
function stType(){
 /* THE DEFERRED SYNC LANDS HERE, 9 November. srcPaint stops calling
    srcChatSync while STV.typed (see the gate there, same date), so the
    words typed into the box are not yet the person's turn in the thread;
    closing the box is what makes them one, in a single row covering the
    whole of what was typed, the way tests/typein.js's own item 4 always
    read it. */
 if(STV.typed){ STV.typed=false; srcChatSync(); stRender();
  var b=document.getElementById('sttype'); if(b)b.focus(); return; }
 ST_WANT_LISTEN=false;
 if(ST_REC&&ST_LISTEN){ try{ ST_REC.stop(); }catch(e){} }
 ST_LISTEN=false; ST_LISTEN_T0=null; ST_LIVE='';
 STV.typed=true; STV.focus='write'; stRender();
 var ta=document.getElementById('sttext');
 if(ta){ ta.focus(); var n=ta.value.length; try{ ta.setSelectionRange(n,n); }catch(e){} }}
function stMic(){
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 /* alert() blocks the page and is not the status region, which is the app's
    one writer for anything that can fail. */
 if(!SR){ stVoiceCant('This browser has no speech recognition. Typing works.'); return; }
 /* named before it is attempted, because this is the common case and the
    failure it produces otherwise is indistinguishable from a broken button. */
 if(typeof isSecureContext!=='undefined'&&!isSecureContext){
  stVoiceCant('Recording needs a secure page. Opened from a file, the browser will '
   +'not turn the microphone on. Typing works.'); return; }
 if(ST_REC&&ST_LISTEN){ ST_WANT_LISTEN=false; ST_REC.stop(); ST_LISTEN=false; ST_LISTEN_T0=null; stRender(); return; }
 /* Chat pressed from a box Type instead opened goes back to the
    conversation, so the two never both write the entry (see stType). Only
    here, past the two refusals above, which put the forced box in its
    place instead. */
 if(STV.typed){ STV.typed=false; STV.chat=true; }
 /* a recording never starts under a line still playing from the last one,
    or the microphone would take it for the person */
 srcVoiceStop(); ST_HUSH=false;
 ST_WANT_LISTEN=true;
 try{ ST_REC=new SR(); }catch(err){ ST_REC=null; stMicStartFail(err); return; }
 ST_REC.continuous=true; ST_REC.interimResults=true; ST_REC.lang='en-US';
 /* A NORMAL SPEECH CONVERSATION, round of 29 October, his words: "I hit the
    talk button and whatever I say enters into the text field. That should
    not happen... If there was no text field, I should be able to talk to
    the AI, see its output, and I should see my input as I'm talking." Talk
    no longer writes the reply box at all (the SRC_CDRAFT routing this
    carried until today's audit fix stays wrong for the same reason the bug
    it fixed was wrong, only one step further back: a voice conversation is
    not typing, by mouth or by hand, so it does not need the box typing
    uses). Each sentence becomes a real turn, srcTurnCommit, the instant the
    speech service finalises it: Source AI reacts turn by turn, and the bank
    fills as each one lands, because landing a turn is exactly what already
    drives both. What has not finalised yet is never kept, only shown,
    ST_LIVE, read by stRender at #stlivecap, and cleared the moment either
    it finalises into a turn or listening stops. */
 /* HIS OWN REPORT, EARLIER: "every sentence I stop and pause at seems like
    it disappears." Reproduced against the real bug: a pause is exactly when
    the speech service finalises the sentence just spoken and the next
    event's resultIndex moves past it, so code that rebuilt its text from a
    single frozen base lost that sentence. Committing a turn the moment it
    finalises cannot have that bug: each finalised chunk lands in ST_TEXT on
    its own, through srcTurnCommit, and nothing after ever rewrites it. */
 /* STARS FROM THE SPEECH SERVICE ARE SAID ONCE, round QR. The browser's
    speech service filters what it counts as swearing before the words reach
    this handler, and nothing here can undo it (maskedRuns, engine/sniff.js).
    The line under the box says so for as long as stars are there; the status
    line says it once, when a recording first brings new ones in, so a person
    talking with their eyes off the screen still hears it. Read off ST_TEXT
    itself now, since a finalised sentence lands there directly. */
 /* A SENTENCE IS COMMITTED ONCE, 31 October. Every final from resultIndex
    on used to be committed, with no memory of which were already in, so a
    browser that reports an earlier final again (Chrome's continuous
    recognition is known to on some Android builds) filed it as a second
    turn: measured in reviews/source-ai-conversation-diagnosis-2026-10-31.md,
    transcript 7, and not measured on his device, so this is a guard and not
    a fix for something seen there. A result keeps its index for the whole
    of one recording, so ST_REC_DONE holds the indices already in and is
    emptied whenever a recording starts, in stMicGo, because a new one
    counts from nought. It is by index and never by text: a person who says
    "can you hear me" twice said it twice, and that is his complaint.

    AND NOTHING IS HEARD WHILE SOURCE AI SPEAKS. The recording is stopped
    for the length of the line (stHush), and anything still delivered in
    that window is dropped here: it is Source AI's own voice coming back
    through the microphone, and filing it as his turn would have it answer
    itself. */
 var hidAt=maskedRuns(ST_TEXT).length;
 ST_REC.onresult=function(e){var fin='',live='';
  if(ST_HUSH)return;
  for(var i=e.resultIndex;i<e.results.length;i++){
   var t=e.results[i][0].transcript;
   if(e.results[i].isFinal){ if(ST_REC_DONE[i])continue; ST_REC_DONE[i]=1; fin+=t; } else live+=t;}
  if(fin.trim())srcTurnCommit(fin);
  /* the box keeps its focus here too, 4 November: Type instead stops the
     recording with stop, which hands back the sentence still being spoken
     as one last final, and this render rebuilt the box it had just
     focused. Measured in tests/typein.js at 1600 and 390: the sentence
     landed and the keys typed after it went nowhere. */
  ST_LIVE=live; stRenderKeep();
  var hid=maskedRuns(ST_TEXT).length;
  if(fin&&hid>hidAt){
   status('Dictation hid '+(hid-hidAt===1?'a word':(hid-hidAt)+' words')
    +' behind stars. Type '+(hid-hidAt===1?'it':'them')+' over the stars to have '
    +(hid-hidAt===1?'it':'them')+' read.','fail');
   hidAt=hid;}};
 /* CAN'T HEAR ME, round of 29 October: Chrome's own continuous recognition
    still ends itself on its own, silently, well before the person is done
    talking, and the old onend read that the same as the person pressing
    stop. The mic looked live (the button still said Listening) while the
    browser had already walked away from it. ST_WANT_LISTEN is the person's
    own intent, set true here and only ever set false by the stop branch
    above or a fatal error below, so an onend that fires while it is still
    true is the browser's own idea and gets restarted rather than believed. */
 /* an end while Source AI speaks is the pause stHush asked for: the person
    still wants to be heard, so nothing is reset, and stHush starts the
    recording again when the line is done */
 /* THE BOX KEEPS ITS FOCUS THROUGH THIS END, 3 November. A browser fires
    onend after every onerror, so an error that opened the box (stVoiceCant
    focuses it) was followed by this render, which rebuilt #sttext and left
    the focus on nothing: measured, focusin on sttext, then this stRender,
    then focusout. The node is new after a render, so the focus and the caret
    are put back on the new one. */
 ST_REC.onend=function(){ST_LIVE=''; ST_REC_ON=false;
  if(ST_WANT_LISTEN&&ST_HUSH){ stRender(); return; }
  if(ST_WANT_LISTEN){ try{ stMicGo(); stRender(); return; }catch(err){} }
  ST_WANT_LISTEN=false; ST_LISTEN=false; ST_LISTEN_T0=null;
  stRenderKeep();};
 ST_REC.onerror=function(e){var code=(e&&e.error)||'unknown';
  /* no-speech is the browser noticing silence, not a failure, and onend
     follows it either way; restarting there, not here, keeps one path. */
  if(code==='no-speech')return;
  /* aborted while Source AI speaks is the pause itself, not a failure */
  if(code==='aborted'&&ST_HUSH)return;
  ST_WANT_LISTEN=false; ST_LISTEN=false; ST_LISTEN_T0=null; ST_LIVE='';
  /* the recording is over, so the greeting it asked for is dropped: measured
     3 November, the greeting's own failure line ("could not speak that line")
     landed after this error's line and wrote over it, so a person was told
     the voice failed and not that the microphone did */
  SRC_VOICE.seq++; srcVoiceStop(); ST_HUSH=false;
  if(ST_CANT_HEAR[code]){ stVoiceCant(stMicLine(code)+' Typing works.'); return; }
  stRender();
  if(code==='not-allowed'){ stMicRefused(); return; }
  stMicSay(code);};
 try{ stMicGo(); }
 catch(err){ stMicStartFail(err); return; }
 ST_START_FAIL=0; ST_LISTEN=true; ST_LISTEN_T0=performance.now(); stRender();
 status('Listening. Press again to stop.','ok'); stSrcSpeak();}
/* SOURCE AI GREETS OUT LOUD WHEN TALK IS PRESSED, round of 29 October, his
   words: "when I hit the talk button, I want to be greeted by the AI. So I
   need to hear the voice." The voice is ElevenLabs and there is no other
   (ui/release.js's own ruling, 9 October): this calls the same authVoice()
   Release already proves works, never a browser voice. Reads whatever
   Source AI is currently showing in #stsrc, the greeting on a fresh page or
   the live question once one has been asked, so the line spoken is always
   the line on screen and never typed twice.

   NEEDS THE REAL SERVER, NOT A LOCAL FILE. The Worker that holds the
   ElevenLabs key answers only its own origin (ALLOWED_ORIGIN, reboot-os
   server/wrangler.toml), the same reason stMic() above already refuses the
   microphone on a page opened from a file. A build opened locally cannot
   reach it; the hosted site can, the same as Release already does. Failure
   is reported through status(), per the house rule that a control never
   claims success before it has it, and names the file-opened case by name
   rather than leaving a person to guess at "failed to fetch". */
/* ONE LINE, NEVER THE PANEL, 31 October. This read #stsrc's whole
   textContent, which was the greeting on a fresh page and, once there was a
   thread, the entire thread run together with the button labels: the second
   press of Talk sent the voice "...What did you do?Move onAnswer below, or
   leave it." (the diagnosis, transcript 6). It speaks the line it is
   handed now, srcPaint's new row, and with none, the newest line Source AI
   has on the thread, which on a fresh page is the opener. That keeps the
   ruling above: the line spoken is the line on screen.

   A NEWER LINE WINS. Each call takes a number, and an answer that comes
   back for an older one is dropped, so a slow line can never play over the
   reply to a turn the person has already moved past; a line that does play
   stops the one before it. And it holds the recording for as long as it
   plays, stHush, so the microphone does not hear Source AI and file it as
   the person's next turn, a risk that only arrived once every reply was
   spoken. The diagnosis asks for that pause to be measured on real
   speakers before it is trusted, and it has not been: this is measured on
   the stand-in in tests/srcchat.js only. */
var SRC_VOICE={seq:0, el:null, url:'', t:0};
/* the longest a line may hold the recording. A reply is a sentence or two,
   well under ten seconds spoken; an audio element that never reports its
   end must not leave the person unheard for the rest of the conversation. */
var SRC_VOICE_MAX=30000;
function srcSayNow(){
 /* the safe line, while it stands in the reply's place: the line spoken is
    the line on screen, so pressing Talk never reads an earlier question */
 if(stSafe())return (STV.unsaved||STV.draftFail)?CRISIS_SAY.entryNow:CRISIS_SAY.entry;
 var q=''; SRC_CHAT.forEach(function(r){if(r.w==='src'&&r.q)q=r.q;});
 return q||srcOpen();}
function srcVoiceStop(){
 clearTimeout(SRC_VOICE.t);
 try{ if(SRC_VOICE.el){ SRC_VOICE.el.onended=SRC_VOICE.el.onerror=null; SRC_VOICE.el.pause(); } }catch(e){}
 try{ if(SRC_VOICE.url)URL.revokeObjectURL(SRC_VOICE.url); }catch(e){}
 SRC_VOICE.el=null; SRC_VOICE.url='';}
function stSrcSpeak(line){
 var text=String(line==null?srcSayNow():line).trim(); if(!text)return;
 if(typeof authVoice!=='function')return;
 if(typeof isSecureContext!=='undefined'&&!isSecureContext){
  status('Source AI cannot speak from a file. Open the hosted build to hear it.','fail'); return; }
 var seq=++SRC_VOICE.seq;
 authVoice(text,'frame').then(function(r){
  if(seq!==SRC_VOICE.seq)return;
  if(!r||!r.ok){
   status('Source AI could not speak that line. '+
    (r&&r.status===429?'The voice has reached today\'s limit.':'Try again in a moment.'),'fail');
   return;}
  srcVoiceStop();
  var url=URL.createObjectURL(r.blob);
  var a=new Audio(url);
  SRC_VOICE.el=a; SRC_VOICE.url=url;
  var done=function(){ if(SRC_VOICE.el!==a)return; srcVoiceStop(); stHush(false); };
  a.onended=done; a.onerror=done;
  SRC_VOICE.t=setTimeout(done,SRC_VOICE_MAX);
  stHush(true);
  var pl=a.play();
  /* A LINE THIS PAGE STOPPED WAS NOT BLOCKED, 4 November. A microphone
     error drops the greeting (SRC_VOICE.seq++ and srcVoiceStop, in
     ST_REC.onerror), and the pause() in srcVoiceStop makes the browser
     reject this play() with AbortError. That rejection landed after the
     error's own line and wrote this one over it: measured on the
     permission refused case, "Recording needs microphone permission" at
     6880ms, then this line at 6884ms. So the same number that drops a late
     answer drops a late refusal, and a line that is no longer the one
     playing says nothing. A refusal for the line still playing is the
     browser's, and is still said. */
  if(pl&&pl.catch)pl.catch(function(){ if(seq!==SRC_VOICE.seq||SRC_VOICE.el!==a)return;
   done(); status('Source AI\'s voice is ready but the browser blocked playing it.','fail');});
 });}
/* THE RECORDING, HELD WHILE SOURCE AI SPEAKS. ST_HUSH is the hold.
   ST_REC_ON is whether the recogniser is running, which ST_LISTEN is not:
   ST_LISTEN is what the button says, and through a hold the button still
   says Listening, because the person has not stopped. abort and not stop,
   because stop hands back what it heard so far, and what it hears from the
   moment the voice starts is the voice. A stand-in with no abort is
   stopped instead. A recording that will not start again is reported, the
   house rule for anything that can fail, rather than leaving a button that
   says Listening over a microphone that is off. */
var ST_HUSH=false, ST_REC_ON=false, ST_REC_DONE={};
/* A RENDER FROM THE RECOGNISER KEEPS THE BOX'S FOCUS. stRender writes the
   whole Journal, so #sttext is a new node after it and the focus and caret
   stay with the old one. Lifted out of ST_REC.onend, where it went in on 3
   November for the end that follows every error, when onresult needed the
   same lines for Type instead (stType). Nothing moves when the box did not
   have the focus. A caret at the end stays at the end: that sentence lands
   after the caret stType put at the end of the entry, so a caret kept where
   it was would have put the person's first typed words in front of the
   words they had just said. */
function stRenderKeep(){
 var a=document.activeElement, kept=a&&a.id==='sttext'?[a.selectionStart,a.selectionEnd,a.selectionEnd===a.value.length]:null;
 stRender();
 var t=kept&&document.getElementById('sttext');
 if(t){ t.focus(); var n=t.value.length;
  try{ if(kept[2])t.setSelectionRange(n,n); else t.setSelectionRange(kept[0],kept[1]); }catch(e){} }}
function stMicGo(){ ST_REC_DONE={}; ST_REC.start(); ST_REC_ON=true; }
function stHush(on){
 if(on){ if(ST_HUSH)return; ST_HUSH=true; ST_LIVE='';
  if(ST_REC&&ST_REC_ON){ try{ if(typeof ST_REC.abort==='function')ST_REC.abort(); else ST_REC.stop(); }catch(e){} }
  return;}
 if(!ST_HUSH)return;
 ST_HUSH=false;
 if(!ST_WANT_LISTEN||!ST_REC||ST_REC_ON)return;
 try{ stMicGo(); stRender(); }
 catch(err){ ST_WANT_LISTEN=false; ST_LISTEN=false; ST_LISTEN_T0=null; stRender();
  /* the button's own word, Chat, see stRender: a status line that names a
     control by another word sends a person looking for a button that is
     not there */
  status('Recording stopped after Source AI spoke. Press Chat to start it again.','fail'); }}
