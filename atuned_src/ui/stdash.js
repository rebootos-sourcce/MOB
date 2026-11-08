/* ============================================================
   THE JOURNAL'S FULL VIEW. Ruled 2 November, his words: "use a left menu
   and the right menu." Recorded in DECISIONS.md under that date.

   NOT A NEW SCREEN. The Journal already has a Full and a Simple view:
   Dashboard (#stdash, ui/storyui.js) sets STV.dash, and Simple is what a
   person lands on, his 29 October words "when I land on this page it starts
   off in simple mode." This file fills the Full view's left rail and nothing
   else. The right rail is the one the Journal already has: the bank sets
   st-bank and the shell brings back Imprints (#imp) and Selection there.

   WHAT IS IN IT, AND WHAT IS NOT YET. Energy, below, is the first section,
   and it is built only from calls already on main: parseStory's bands, the
   per-seat scale stSeatT already uses, pct and fmtPct, the cr() ring, and the
   seat's own sentence in engine/data/gloss.js. Action, Compass, a laws grid,
   Channels, Patterns, Boundary and Feelings each need new engine work or a
   ruling first, so none of them is started here and no empty heading stands
   in for one.

   THE HOST IS STATIC, #stleft in shell/body.html, so it is emptied whenever
   it is not shown: in Simple here, and on leaving the tab in stRailClear. A
   hidden surface never sits in the document asserting a stale reading, the
   rule Summary keeps.
   ============================================================ */

/* ENERGY, READ OFF THIS STORY. The decision recorded with the ruling: the
   Journal's Energy reads the story being written, never the whole record.
   The record's Energy is the Field's, on the Field's own left rail, and one
   word naming two readings in one place would be two truths on one screen;
   the line under the heading is what keeps them apart.

   THE SCALE IS THE ONE THE PAGE ALREADY DRAWS. stSeatT in ui/storyui.js
   lifts each seat to min(10, bands/3), which is also the line in
   engine/sniff.js that the 'atom' kind in engine/pct.js cites. So the ring
   here and the seat's spring in the Journal's own chart read one number,
   and the percent printed is the ring's fill.

   ALL SEVEN, ALWAYS, ROOT TO CROWN, once there is a story. A seat this story
   has not reached stays in its place with the dash cr() prints for nought,
   because a list that drops the quiet seats reads as a body with fewer seats
   in it.

   SILENT WITH NO STORY. Nothing typed and nothing spoken is not seven zeros:
   a row of dashes on a story that does not exist yet is a reading the
   instrument did not take. So the section says what is absent, once, in the
   wording the house keeps for this state, and draws no ring.

   AND r.unread IS NOT WHAT SILENCES IT, which is the rule this page already
   keeps. r.unread is a claim about the record (engine/compute.js: nothing
   entered anywhere). This section reads uncommitted words, so on a stranger's
   first story the record is still unread while the chart beside this rail
   already lights the seats the words reached. Gated on r.unread, this would
   go quiet on exactly the story the chart is drawing, which is the
   disagreement stRead exists to prevent ("the sentence, the chart and the
   list cannot disagree"). The Journal's own record reader, stAnaPaint's
   Running hot list, is the part that is gated on r.unread, and it still is. */
/* THE PILL ROW: COLOUR ONLY, NO WORD, SORTED BY STRENGTH, 8 November. His
   words: "On the left panel, I don't want the text. I only want the
   color. And a pill, almost like a light. And I want them side by side,
   arranged according to signal strength... Plus maybe the other four
   right for person, mouse is over it, they can see what's being lit
   up." Replaces the ring-plus-name list Energy, Assemblage Point and
   Chakra Health each drew the same way. ALL SEVEN, ALWAYS still holds
   (see the Energy comment above): a seat at nothing stays in the row,
   dimmer, rather than dropping out of it, so "the other four" are the
   ones still visible, just quieter. The seat's own name and reading are
   not gone, they are what the hover says: cr()'s own title plumbing
   already carries a name and a figure into a tooltip everywhere else in
   this product, so this reuses that convention rather than inventing a
   second one. Strength order, strongest first, is a plain numeric sort
   on the same v every cr() ring used to fill its arc with; nothing about
   the ordering is new, only the drawing is. */
function stPillRow(id,items){
 var sorted=items.slice().sort(function(a,b){return (b.v||0)-(a.v||0);});
 return '<div class="st-pl-row" id="'+id+'">'+sorted.map(function(it){
   var lit=(it.v||0)>0;
   return '<span class="st-pl'+(lit?' lit':'')+'" data-seat="'+esc(it.b)+'" tabindex="0" role="img" style="--c:'+it.c+'" '
    +'aria-label="'+esc(it.title)+'" title="'+esc(it.title)+'"></span>';}).join('')
  +'</div>';}
function stDashLeft(){
 var h=document.getElementById('stleft'); if(!h)return;
 /* ONLY ON THE JOURNAL, the guard stRender already keeps on st-full: stCommit
    can redraw the Journal from another tab, and #stleft is a static host in
    #lcol, so a paint off the tab would put this story's seats into another
    tab's column. */
 if(!STV.dash||typeof S==='undefined'||S.tab!==TAB.STORY){ if(h.innerHTML)h.innerHTML=''; return; }
 /* AND ONLY THE OPEN RECORD'S WORDS, 3 November. This reads ST_TEXT and
    ST_PARSED, which are a record's (ST_OWN, ui/imprints.js). Words written
    on another record are not this person's reading, so the rail is emptied
    rather than drawn off them; stOwn, which render() runs first, puts the
    right words back and the next paint draws them. */
 if(!stMine()){ if(h.innerHTML)h.innerHTML=''; return; }
 /* THE SUBTITLE IS GONE, 6 November, his words on this exact screen: "where
    it says like what this story puts at each of the screen, get rid of
    that bullshit." Ruled in place on 2 November (DECISIONS.md, "The
    Journal's Full view gets a left menu and a right menu") for the reason
    a reading needs to say which record it reads; that reason still holds,
    it is just not told to the screen as a line under the heading any more.
    aria-labelledby keeps the section announced as "Energy" alone. */
 var p=(typeof ST_TEXT==='string'&&ST_TEXT.trim())?ST_PARSED:null;
 var o='<section class="st-en" id="st-energy" aria-labelledby="st-energy-h">'
  +'<h2 class="rblk" id="st-energy-h">Energy</h2>';
 if(!p){
  o+='<p class="st-none" id="st-energy-none">Nothing read yet, so no seat holds anything from this story.</p>';}
 else{
  o+=stPillRow('st-energy-ls',BANDS.map(function(b){
   var raw=p.bands[B2K[b]]||0, v=Math.min(10,raw/3), f=fmtPct('atom',v);
   return {v:v,b:b,c:seatCol(b),
     title:b+(f!==PCT_DASH?', '+f+' from this story':', nothing from this story')};}));}
 o+='</section>';
 o+=stDashAssemblage(p);
 o+=stDashChakraHealth();
 o+=stDashLaws();
 o+=stDashBoundary();
 o+=stDashChannel(p);
 o+=stDashPatterns();
 h.innerHTML=o;}

/* ASSEMBLAGE POINT, 6 November. His own ask, mapped to what the engine
   already calls it: engine/data/gloss.js, "An assemblage point is a seat."
   Same seven seats, same reading as Energy above -- this is not a second
   computation, it is the one reading under the second name he asked for.
   Kept as its own section rather than folded into Energy because he named
   them as two separate things he wants to see, and this file does not
   decide for him that they are the same line. */
function stDashAssemblage(p){
 var o='<section class="st-en st-ap" id="st-ap" aria-labelledby="st-ap-h">'
  +'<h2 class="rblk" id="st-ap-h">Assemblage Point</h2>';
 if(!p){
  o+='<p class="st-none" id="st-ap-none">Nothing read yet, so no seat holds anything from this story.</p>';}
 else{
  o+=stPillRow('st-ap-ls',BANDS.map(function(b){
   var raw=p.bands[B2K[b]]||0, v=Math.min(10,raw/3), f=fmtPct('atom',v);
   return {v:v,b:b,c:seatCol(b),
     title:b+(f!==PCT_DASH?', '+f+' from this story':', nothing from this story')};}));}
 o+='</section>';
 return o;}

/* CHAKRA HEALTH, the avatar's reading, 6 November: "the health of the 7
   chakras, a simple radial visual, with the pill percent." THIS READS THE
   RECORD, NOT THE OPEN DRAFT -- a different scope than Energy above on
   purpose. Energy is this story being typed; a chakra's health is not
   something one unsent draft should claim to move. It is the mean of
   engine/data/canon.js's SI table (the 21 laws) at each law's own seat,
   each law read through lawNow() (engine/compute.js), the same real
   arithmetic CQ itself is built from -- not a new number invented for this
   rail. A seat whose laws have not been answered yet stays a dash, the same
   "nothing read" convention Energy keeps, because an unanswered law is a
   reading the instrument did not take, not a zero. */
function stDashChakraHealth(){
 if(typeof SI==='undefined'||typeof lawIn!=='function'||typeof lawNow!=='function')return '';
 var o='<section class="st-en st-ch" id="st-chakra" aria-labelledby="st-chakra-h">'
  +'<h2 class="rblk" id="st-chakra-h">Chakra Health</h2>'
  +stPillRow('st-chakra-ls',BANDS.map(function(b){
   var laws=SI.filter(function(l){return l.b===b;}), answered=laws.filter(function(l){return lawIn(l.nm);});
   var v=answered.length?answered.reduce(function(a,l){return a+lawNow(l.nm);},0)/answered.length:null;
   var f=v==null?PCT_DASH:fmtPct('law',v);
   return {v:v||0,b:b,c:seatCol(b),
     title:b+(v==null?', no laws answered at this seat yet':', '+f+' across '+answered.length+' of '+laws.length+' laws answered at this seat')};}))
  +'</section>';
 return o;}

/* THE 21 LAWS, grouped by seat (3 to 4 a seat, SI's own grouping) rather
   than one flat list of 21 -- a compact left rail reading 21 ungrouped rows
   is not a reading a person can take in. Each law reads lawNow() off the
   current record (compute.js), same source CQ itself sums; a law never
   answered prints the dash, the same unread-is-not-zero rule the rest of
   this file already keeps, never 21 laws read as 21 failing grades. */
function stDashLaws(){
 if(typeof SI==='undefined'||typeof lawIn!=='function'||typeof lawNow!=='function')return '';
 var o='<section class="st-en st-si" id="st-laws" aria-labelledby="st-laws-h">'
  +'<h2 class="rblk" id="st-laws-h">The 21 Laws</h2>';
 o+=BANDS.map(function(b){
  var laws=SI.filter(function(l){return l.b===b;});
  if(!laws.length)return '';
  return '<div class="st-si-seat" data-seat="'+esc(b)+'">'
   +'<span class="st-si-seatn">'+esc(b)+'</span>'
   +'<ul class="st-en-ls st-si-ls">'+laws.map(function(l){
    var known=lawIn(l.nm), v=known?lawNow(l.nm):null, f=v==null?PCT_DASH:fmtPct('law',v);
    return '<li class="st-en-r" data-law="'+esc(l.nm)+'">'
     +cr(b,v==null?0:(pct('law',v)||0),{size:'sm',raw:f,hot:false,
       title:l.nm+(v==null?', not answered yet':', '+f)})
     +'<span class="st-en-n">'+esc(l.nm)+'</span></li>';}).join('')
   +'</ul></div>';}).join('');
 o+='</section>';
 return o;}

/* BOUNDARY, THE SIX AXES. His ask, 6 November: "the boundary, we're going
   to want as a widget." The only six axes the product has, per
   engine/data/intakemore.js's own ruling (TASKS.md GL4): engine/verp.js's
   six gates, aware/detach/intent/ignore/attach/averse. THIS IS A RECORD
   READING, NOT THE OPEN DRAFT -- verpApply only ever runs at Commit
   (ui/storyui.js stCommit), so verpRead() here reads the accumulated mix
   from entries already committed, the same way Chakra Health above reads
   the record and not the draft. Colour is a judgement call, not a ruling:
   the higher-side gates (aware/detach/intent) take Heart's tone and the
   lower-side (ignore/attach/averse) take Root's, reusing seat colours
   already in the palette rather than inventing a new one -- his to
   overrule if a different split is wanted. */
function stDashBoundary(){
 if(typeof verpRead!=='function')return '';
 var V=verpRead(), any=V.some(function(v){return v.n>0;});
 var o='<section class="st-en st-vb" id="st-boundary" aria-labelledby="st-boundary-h">'
  +'<h2 class="rblk" id="st-boundary-h">Boundary</h2>';
 if(!any){
  o+='<p class="st-none" id="st-boundary-none">Nothing recorded yet, so no gate holds anything from this record.</p>';}
 else{
  o+='<ul class="st-en-ls" id="st-boundary-ls">'+V.map(function(v){
   var f=v.n>0?v.pct+'%':PCT_DASH, col=seatCol(v.side==='higher'?'Heart':'Root');
   return '<li class="st-en-r" data-axis="'+esc(v.k)+'">'
    +cr(v.nm,v.n>0?v.pct:0,{size:'sm',color:col,raw:f,hot:false,
      title:v.nm+(v.n>0?', '+f+' of the recorded mix':', nothing recorded yet')})
    +'<span class="st-en-n">'+unp('verp:'+v.k,v.nm)+'</span></li>';}).join('')
   +'</ul>';}
 o+='</section>';
 return o;}

/* CHANNEL, BOTH -- his explicit instruction, 6 November: "It's both," given
   the worked example "I think I'm a failure" answering as belief on the
   live system and thinking on the named one.

   1. The live nine-dimension system, engine/sourceai.js SRC_DIM_ORDER,
      already driving real Source AI turn-taking. srcDims(ST_TEXT) is pure
      and reads the open draft exactly as Energy does; a dimension this
      entry answered lights, one still open stays a dash -- a real
      present/absent reading, not a percent, because srcDims never scores a
      dimension's strength, only whether it answered yet.
   2. The six-channel list named in engine/data/intakemore.js and
      engine/data/cards.js (believing/perceiving/thinking/behaving/acting/
      feeling) -- confirmed nowhere live in the engine. Built as a shell
      only, honestly marked not yet computing. No classifier invented here;
      that is new engine work, not a UI pull-through, and is his or the
      engine side's to build, not this file's to fake. */
var SRC_DIM_LABEL={trigger:'Trigger',contact:'Contact',feeling:'Feeling',body:'Body',
 prediction:'Prediction',behaviour:'Behaviour',belief:'Belief',meaning:'Meaning',goal:'Goal'};
var CH6_LABEL=['Believing','Perceiving','Thinking','Behaving','Acting','Feeling'];
function stDashChannel(p){
 if(typeof srcDims!=='function')return '';
 var o='<section class="st-en st-ch9" id="st-channel9" aria-labelledby="st-channel9-h">'
  +'<h2 class="rblk" id="st-channel9-h">Channel</h2>';
 if(!p||typeof ST_TEXT!=='string'||!ST_TEXT.trim()){
  o+='<p class="st-none" id="st-channel9-none">Nothing read yet, so no dimension holds anything from this story.</p>';}
 else{
  var dims=srcDims(ST_TEXT), answered=dims.answered||{};
  o+='<ul class="st-en-ls" id="st-channel9-ls">'+SRC_DIM_ORDER.map(function(k){
   var hit=answered[k], on=!!hit;
   return '<li class="st-en-r" data-dim="'+esc(k)+'">'
    +cr(k,on?100:0,{size:'sm',color:seatCol('Throat'),raw:on?'Answered':PCT_DASH,hot:false,
      title:SRC_DIM_LABEL[k]+(on?', answered -- "'+esc(hit[0])+'"':', not answered yet')})
    +'<span class="st-en-n">'+esc(SRC_DIM_LABEL[k])+'</span></li>';}).join('')
   +'</ul>';}
 o+='</section>';
 o+='<section class="st-en st-ch6" id="st-channel6" aria-labelledby="st-channel6-h">'
  +'<h2 class="rblk" id="st-channel6-h">Channel (six-part)</h2>'
  +'<p class="st-none" id="st-channel6-none">Not yet computing -- no live reading exists for this list yet.</p>'
  +'<ul class="st-en-ls st-ch6-shell" id="st-channel6-ls" aria-hidden="true">'+CH6_LABEL.map(function(nm){
   return '<li class="st-en-r">'+cr(nm,0,{size:'sm',raw:PCT_DASH,hot:false,title:nm+', not yet computing'})
    +'<span class="st-en-n">'+esc(nm)+'</span></li>';}).join('')
   +'</ul></section>';
 return o;}

/* PATTERNS -- ANCESTRAL, GENERATIONAL, PARENTAL, LEARNED. Confirmed wanted,
   6 November: "yeah, definitely we want the patterns." No sorting rule for
   these four exists anywhere in the engine (grepped the whole tree before
   writing this). A shell only, same honest-gap voice the rest of this file
   keeps -- not a guess at a classifier dressed up as a reading. Needs a
   real ruling from him (what, concretely, makes a pattern ancestral versus
   learned) before this prints a single real number. */
function stDashPatterns(){
 var o='<section class="st-en st-pat" id="st-patterns" aria-labelledby="st-patterns-h">'
  +'<h2 class="rblk" id="st-patterns-h">Patterns</h2>'
  +'<p class="st-none" id="st-patterns-none">Not yet classified -- no sorting rule exists yet for ancestral, generational, parental or learned.</p>'
  +'</section>';
 return o;}
