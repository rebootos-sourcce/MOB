/* ============================================================
   THE JOURNAL'S FULL VIEW. Ruled 2 November, his words: "use a left menu
   and the right menu." Recorded in DECISIONS.md under that date.

   NOT A NEW SCREEN. The Journal already has a Full and a Simple view:
   Dashboard (#stdash, ui/storyui.js) sets STV.dash, and Simple is what a
   person lands on, his 29 October words "when I land on this page it starts
   off in simple mode." This file fills the Full view's left rail and nothing
   else. The right rail is the one the Journal already has: the bank sets
   st-bank and the shell brings back Imprints (#imp) and Selection there.

   THE REAL SCOPE, 8 November, corrected the same night it drifted. An
   earlier pass on this file grew Assemblage Point, Chakra Health, a 21-law
   grid and Boundary and Channel sections onto this rail, carried over from
   `feature/extended-dashboard-stdash` (`be67ae3a`). That branch was already
   reviewed and cut down once, same day, in two places this file now defers
   to rather than repeats: Round TB in TASKS.md (the real agreed v1: "Uni
   (once wired), Energy, Child emotions, Psyche Stack, Release", intensity
   curve and the rest to backlog on purpose) and the parallel-session
   mailbox entry `FLD-PAR-20261108-007` (chakra pills dropped as a duplicate
   of Energy, the 21-law grouping dropped because "Lance ruled them hidden",
   the Patterns stub dropped as superseded). This file grew those sections
   back in anyway, which is the bug his own words caught: "I don't know
   what the difference is between assemblage point and energy is here...
   there's just a bunch of stuff missing." There was never meant to be a
   difference, because Assemblage Point was never meant to ship, and what
   was actually missing, Child emotions and Psyche Stack, is what this
   version adds. Back to the real scope: Energy, Child emotions, Psyche
   Stack. Uni mounts separately (ui/storyui.js). Release is its own existing
   panel, not built here.

   THE HOST IS STATIC, #stleft in shell/body.html, so it is emptied whenever
   it is not shown: in Simple here, and on leaving the tab in stRailClear. A
   hidden surface never sits in the document asserting a stale reading, the
   rule Summary keeps.
   ============================================================ */

/* THE TILE ROW: SQUARE, DARK, AND IT LIGHTS UP AS YOU TALK, 9 November,
   corrected the same night. His first words asked for a round "pill,
   almost like a light." His next, after seeing four mockups built on
   that and rejecting all four ("None of these"), gave the real shape
   directly: "I want them like square, but with slight beveled edges.
   And the symbol in the middle of it. And it's mostly dark, but when a
   person starts to speak, it begins, it lights up and activates which
   one is lit up. And the more they talk, the brighter it gets." Square
   with a cut corner (CSS clip-path, a true bevel, not a rounded corner),
   dark at rest, the icon always there, and a continuous glow driven by
   one CSS custom property, --b, 0 to 1, rather than the old binary
   lit/dim class: nothing here steps, everything here is a dial.

   LIVE AS SHE TYPES, NOT A SEPARATE WIRE. "When a person starts to
   speak, it begins" is already true of this whole rail and was before
   this round: ST_TEXT's own oninput handler (ui/storyui.js) calls
   stRefresh on every keystroke, which already calls stDashLeft through
   stPaintAll, so the tiles already repaint on every character typed or
   dictated. Nothing new had to be wired for that half of his words.

   AND THE MORE THEY REPEAT CERTAIN STORIES, his words, is the other
   half, and it is a second real number, not an invented one: srcPrior
   (engine/sourceai.js) already counts, for a committed record, how many
   earlier entries landed at each seat, the same count Source AI's own
   "is it back today?" question already reads. A seat, feeling or law's
   brightness is a blend of what today's words say (stShare, 0 to 1) and
   how often that seat has come back before (stRecur, 0 to 1), where the
   data genuinely keys to one seat; where it does not (Patterns' two
   categories, the six VERP gates, the four Psyche Stack tiers), only
   stShare drives it, said plainly at each call site rather than faked. */
function stSeatRecur(){
 if(typeof srcPrior!=='function')return {};
 return srcPrior((CURP&&CURP.story&&CURP.story.entries)||[]);}
/* story-share and seat-recurrence blended into one 0-1 dial. 0.65/0.35 is
   a judgement call, not a ruling: today's words lead, the pattern of
   return adds to it rather than taking over. recurN is the real count
   srcPrior gives (prior entries landed at this seat), scaled 5 and up
   to full; a seat that has come back five separate times reads as fully
   its own pattern, not only today's charge. */
function stBright(share,recurN){
 var s=Math.max(0,Math.min(1,share||0)), r=Math.max(0,Math.min(1,(recurN||0)/5));
 return Math.max(0,Math.min(1,s*0.65+r*0.35));}
function stPillRow(id,items){
 var sorted=items.slice().sort(function(a,b){return (b.v||0)-(a.v||0);});
 return '<div class="st-pl-row" id="'+id+'">'+sorted.map(function(it){
   var br=Math.max(0,Math.min(1,it.str!=null?it.str:((it.v||0)>0?1:0)));
   return '<button type="button" class="st-pl" data-seat="'+esc(it.b||it.k||'')+'" data-stdrill="'+esc((it.k||'')+'|'+(it.b||''))+'" style="--c:'+it.c+';--b:'+br.toFixed(3)+'" '
    +'aria-label="'+esc(it.title)+'" title="'+esc(it.title)+'">'
    +(it.ic?'<svg viewBox="0 0 24 24" aria-hidden="true">'+it.ic+'</svg>':'')
    +'</button>';}).join('')
  +'</div>';}
/* THE ONE LISTENER FOR ALL FOUR ROWS. Energy and Emotions open a real card
   this product already has (a seat, ui/analytics.js anaSeatCard; a child
   feeling, which that file's own anaCard answers under its "axis" kind,
   anaAxisCard), through anaGo, the one door every other bubble in this
   product already walks through, so the trail, the crumbs and the close
   control behave exactly as they do from Analytics. Patterns and Psyche
   Stack have no existing card for "every word handed down as parental" or
   "every saboteur running", so their own two openers below build the card
   and hand it to rdShell directly, the same direct call mapshelf.js and
   other callers already make for a drill with no anaCard kind of its own. */
/* THE ACCENT BAR IS GONE, 9 November, the same night it shipped. His words
   on seeing it: "I don't like that rainbow bar. Get rid of that... just
   get rid of it." stAccent used to hand each section a gradient style
   attribute (--ac); every call site below now passes nothing and the CSS
   rule that painted it is gone from shell/head.html. */
addEventListener('click',function(e){
 var t=e.target&&e.target.closest?e.target.closest('#stleft [data-stdrill]'):null;
 if(!t)return;
 var v=t.getAttribute('data-stdrill'), at=v.indexOf('|'), k=v.slice(0,at), nm=v.slice(at+1);
 if((k==='seat'||k==='axis'||k==='law'||k==='mask')&&typeof anaGo==='function'){anaGo(k,nm,true);return;}
 if(k==='pat'){stOpenPattern(nm);return;}
 if(k==='verp'){stOpenVerp(nm);return;}
 if(k==='psy'){stOpenPsyche(nm);return;}});

/* ENERGY, READ OFF THIS STORY. The decision recorded with the ruling: the
   Journal's Energy reads the story being written, never the whole record.
   The record's Energy is the Field's, on the Field's own left rail, and one
   word naming two readings in one place would be two truths on one screen.

   ALL SEVEN, ALWAYS, ROOT TO CROWN, once there is a story. A seat this story
   has not reached stays in its place, dim, because a row that drops the
   quiet seats reads as a body with fewer seats in it.

   SILENT WITH NO STORY. Nothing typed and nothing spoken is not seven zeros:
   a row of dashes on a story that does not exist yet is a reading the
   instrument did not take. So the section says what is absent, once, and
   draws no pill at all.

   AND r.unread IS NOT WHAT SILENCES IT, which is the rule this page already
   keeps. r.unread is a claim about the record (engine/compute.js: nothing
   entered anywhere). This section reads uncommitted words, so on a stranger's
   first story the record is still unread while the chart beside this rail
   already lights the seats the words reached. Gated on r.unread, this would
   go quiet on exactly the story the chart is drawing, which is the
   disagreement stRead exists to prevent ("the sentence, the chart and the
   list cannot disagree"). */
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
 var p=(typeof ST_TEXT==='string'&&ST_TEXT.trim())?ST_PARSED:null;
 /* THE SEAT RECURRENCE, READ ONCE PER PAINT, 9 November, his own answer
    when asked whether this should cross from the draft to the record:
    "all 7 tiles read recurrence." srcPrior (engine/sourceai.js) counts
    real prior committed entries landed per seat; stBright blends it with
    today's words, 65/35, below. */
 var rec=stSeatRecur();
 var o='<section class="st-en" id="st-energy" aria-labelledby="st-energy-h"'+'>'
  +'<h2 class="rblk" id="st-energy-h">Energy</h2>';
 if(!p){
  o+='<p class="st-none" id="st-energy-none">Nothing read yet, so no seat holds anything from this story.</p>';}
 else{
  o+=stPillRow('st-energy-ls',BANDS.map(function(b){
   var raw=p.bands[B2K[b]]||0, v=Math.min(10,raw/3), f=fmtPct('atom',v), rn=rec[B2K[b]]||0;
   return {v:v,b:b,c:seatCol(b),k:'seat',ic:SEATGLYPH[b]||SEATGLYPH._,str:stBright(v/10,rn),
     title:b+(f!==PCT_DASH?', '+f+' from this story':', nothing from this story')
      +(rn?', back '+rn+' time'+(rn===1?'':'s')+' before':'')};}));}
 o+='</section>';
 o+=stDashChildEmotions(p);
 o+=stDashPatterns(p);
 o+=stDashIntegrity(p);
 o+=stDashVerp(p);
 o+=stDashPsycheStack();
 o+=stDashMasks();
 /* THE IMPRINTS DETECTOR'S OWN SLOT, 9 November, his words: "the imprints
    detector... moves to the lower left or near the lower left bottom of
    the left rail." Empty here on purpose: ui/storyui.js's stImpDetMount,
    called below once this innerHTML write has landed, either builds the
    chart into it once or moves the one already live there, which is why
    this div carries nothing of its own. */
 o+='<div id="st-impdet-host"></div>';
 /* THE BOUNDARY/COMPASS PAIR IS GONE FROM HERE, 10 November, his words:
    "remove boundary and compass from the left menu." The purpose
    hexagon stDashBoundary drew and the CQ/DQ arrow gauge stDashCompass
    drew now duplicate real work this round built elsewhere: the
    Dashboard's own Compass and Boundary mini pictures under Uni's
    column (ui/storyui.js's stMiniCompass/stMiniBoundary), and Field's
    mini picture under Imprints/Bank for the same CQ this gauge read.
    Both functions stay defined, reachable, in case a later screen
    still wants either shape; only this call and the pairing wrapper
    around it are cut. */
 h.innerHTML=o;
 if(typeof stImpDetMount==='function')stImpDetMount();}

/* CHILD EMOTIONS, THE SAME NINE, READ OFF THIS STORY, 8 November. Round
   TB's own words named this the real missing piece: "Child emotions (9
   pills, data ready, rail wiring not built)." The data: parseStory's own
   return already carries `charges`, a count per raw charge word this story
   used (engine/sniff.js, byChg), and CHG2FET (engine/core.js) is the
   product's own existing table from a raw charge word to one of the nine
   CHILD feelings -- checked directly before using it: every value in that
   table is one of CHILD's own nine names, nothing invented here, only
   summed. Same draft scope as Energy above, same pill row, same silence
   with no story. */
function stDashChildEmotions(p){
 /* HEADING SHORTENED TO "EMOTIONS", 9 November, his words: "get rid of the
    word child versus child emotions." The section id and the function name
    stay (an id is identity, never renamed for a label change, the same
    rule TAB integers keep), the nine feelings underneath are still CHILD's
    own nine, only the word a person reads changes. */
 var o='<section class="st-en st-ce" id="st-childem" aria-labelledby="st-childem-h"'+'>'
  +'<h2 class="rblk" id="st-childem-h">Emotions</h2>';
 if(!p||typeof CHG2FET==='undefined'){
  o+='<p class="st-none" id="st-childem-none">Nothing read yet, so no feeling holds anything from this story.</p>';
  o+='</section>';
  return o;}
 var byChild={}, rec=stSeatRecur();
 CHILD.forEach(function(c){byChild[c.nm]=0;});
 Object.keys(p.charges||{}).forEach(function(k){
  var f=CHG2FET[k]; if(f&&byChild[f]!==undefined)byChild[f]+=p.charges[k];});
 o+=stPillRow('st-childem-ls',CHILD.map(function(c){
  var n=byChild[c.nm]||0, rn=rec[B2K[c.seat]]||0;
  return {v:n,b:c.nm,c:seatCol(c.seat),k:'axis',ic:'<path d="'+c.ic+'"/>',str:stBright(n/4,rn),
    title:c.nm+(n>0?', '+n+' word'+(n===1?'':'s')+' from this story':', nothing from this story')
     +(rn?', its seat back '+rn+' time'+(rn===1?'':'s')+' before':'')};}));
 o+='</section>';
 return o;}

/* PATTERNS, PARENTAL AND ANCESTRAL, READ OFF THIS STORY, 9 November. His
   own repeated words, finally wired: "I don't understand... the parental
   generational... those pills belongs." This was dropped entirely on 8
   November as superseded by real sniffer work, and that was half right:
   the OLD Patterns stub (a guess at ancestral/generational/parental/
   learned with no sorting rule) is gone for good, but the real sniffer
   work it was superseded by was never actually wired into this rail,
   which is the part his repeating caught. originCategory()
   (engine/sniff.js) already runs inside scanStory, called from
   parseStory, so every hit in p.hits that named who handed a feeling
   down already carries h.originCat, 'parental' or 'ancestral' -- nothing
   guessed here, the same two real categories his own 8 November ruling
   collapsed generational into ancestral to make ("Let's combine
   ancestral and generational. They're the same thing."). TWO PILLS, NOT
   FOUR: parental and ancestral are the only two real categories; learned
   was never built and is not drawn as an empty third; "ideological" is a
   different concept entirely, one of the five Masks (canon.js), not a
   Patterns category, so it is not here either. Same draft scope as
   Energy and Emotions above. Colour is a judgement call, not a ruling:
   Heart for parental (closest relation) and Root for ancestral (furthest
   back), reusing seat colours already in the palette -- his to overrule. */
function stDashPatterns(p){
 var o='<section class="st-en st-pat" id="st-patterns" aria-labelledby="st-patterns-h"'+'>'
  +'<h2 class="rblk" id="st-patterns-h">Patterns</h2>';
 if(!p){
  o+='<p class="st-none" id="st-patterns-none">Nothing read yet, so no pattern holds anything from this story.</p>';
  o+='</section>';
  return o;}
 var n={parental:0,ancestral:0}, rec=stSeatRecur();
 (p.hits||[]).forEach(function(h){if(h.originCat&&n[h.originCat]!==undefined)n[h.originCat]++;});
 /* NO EXISTING GLYPH NAMES EITHER OF THESE, so two are drawn here, plain
    lines, nothing filled: parental as one figure standing over a smaller
    one, ancestral as a line handed down through three generations. */
 var PATIC={parental:'<path d="M9 20v-2a3 3 0 013-3 3 3 0 013 3v2M12 11a2.2 2.2 0 100-4.4 2.2 2.2 0 000 4.4M5.5 20v-1.4a2 2 0 012-2 2 2 0 011.6.8M18.5 20v-1.4a2 2 0 00-2-2 2 2 0 00-1.6.8M6.3 13.6a1.5 1.5 0 100-3 1.5 1.5 0 000 3M17.7 13.6a1.5 1.5 0 100-3 1.5 1.5 0 000 3"/>',
  ancestral:'<circle cx="12" cy="4.6" r="1.8"/><path d="M12 6.4v3.4M12 9.8l-5 5M12 9.8l5 5"/><circle cx="7" cy="17.4" r="1.8"/><circle cx="17" cy="17.4" r="1.8"/>'};
 /* PATTERNS HAS NO SEAT OF ITS OWN TO READ RECURRENCE OFF, so this reuses
    the same borrowed seat the colour above already borrows (Heart for
    parental, Root for ancestral, "a judgement call, not a ruling"),
    rather than leave recurrence out where his answer ("all 7 tiles")
    asked for it everywhere. */
 var CAT=[['parental','Parental',seatCol('Heart'),'Heart'],['ancestral','Ancestral',seatCol('Root'),'Root']];
 o+=stPillRow('st-patterns-ls',CAT.map(function(c){
   var v=n[c[0]], rn=rec[B2K[c[3]]]||0;
   return {v:v,b:c[0],c:c[2],k:'pat',ic:PATIC[c[0]],str:stBright(Math.min(1,v/4),rn),
     title:c[1]+(v>0?', '+v+' word'+(v===1?'':'s')+' handed down in this story':', nothing handed down in this story')
      +(rn?', its seat back '+rn+' time'+(rn===1?'':'s')+' before':'')};}));
 o+='</section>';
 return o;}
/* THE PATTERNS DRILL. Every word this story read as handed down, in the
   one panel every other drill opens, built here rather than through
   anaGo because no existing anaCard kind answers "parental" or
   "ancestral": those are this file's own two real categories
   (originCategory, engine/sniff.js), not one of analytics.js's own. */
function stOpenPattern(cat){
 var p=(typeof ST_TEXT==='string'&&ST_TEXT.trim())?ST_PARSED:null;
 var lab=cat==='parental'?'Parental':'Ancestral';
 var hits=p?(p.hits||[]).filter(function(h){return h.originCat===cat;}):[];
 var h=anaHead('Patterns',lab,'words in this story handed down as '+lab.toLowerCase());
 if(!hits.length){h+='<p class="ad-p">Nothing handed down as '+lab.toLowerCase()+' in this story yet.</p>';}
 else{h+='<div class="ad-rows">'+hits.slice(0,12).map(function(x){
   var f=x.fet||x.charge||'';
   return '<div class="pm-r"><span>'+esc(x.t||'')+'</span><em>'+esc(x.who?'from '+x.who:'')+'</em>'
    +(f?'<b>'+esc(f)+'</b>':'')+'</div>';}).join('')+'</div>';}
 rdShell(h);}

/* INTEGRITY, THE 21 LAWS, BACK AND NOT AS PILLS, 9 November. Round TB's
   own ruling hid the law grid (TASKS.md, "Lance ruled them hidden"); his
   own words tonight bring it back on a different shape: "re-add the 21
   law pills, but no more pills. We're going to use the symbol icons...
   you can see their buckets filling." Two real, already built pieces,
   neither invented for this: SI (engine/data/canon.js) already carries a
   drawn icon for every one of the 21 laws, "each a physical metaphor
   drawn as an open stroke in a 24 box, never a fill"; and cr(), the ring
   badge the rest of this product already uses for a law
   (ui/analytics.js's own law rows on a seat card), already draws a
   filling arc round a glyph, which is the bucket. So this is cr() at its
   smallest size, one per law, SI's own icon and seat colour, nothing
   this file invented.

   DRAFT SCOPED, THE SAME SILENCE AS ENERGY, Emotions and Patterns above:
   this reads the words not yet committed, through sniffLaws
   (engine/sniff.js), which already turns free text into a law name, a
   direction and a score and was built, checked directly before use, and
   never once wired into anything in this product until this line. Same
   rule as its three siblings: nothing typed draws no buckets at all; a
   story typed draws all 21, the quiet ones empty rather than missing.

   WHAT THIS DOES NOT DO. His own third sentence, "that's what gets
   committed to the bank," asks for a second thing this pass does not
   build: stCommit (ui/storyui.js) already carries every other sniffer
   it reads (applyStory, applyStoryAddr, verpApply, leanApply) into the
   record on commit, and sniffLaws is not in that list, so nothing here
   writes to p.laws or S.law yet. Writing it would mean deciding how a
   law already measured by the intake (p.laws, a person's own direct
   answer) is reconciled with the same law read a second way, off a
   sentence in a story. That is a real decision and his to make, named
   here rather than guessed at. */
function stDashIntegrity(p){
 if(typeof SI==='undefined')return '';
 var o='<section class="st-en st-law" id="st-integrity" aria-labelledby="st-integrity-h"'
  +'>'
  +'<h2 class="rblk" id="st-integrity-h">Integrity</h2>';
 if(!p){
  o+='<p class="st-none" id="st-integrity-none">Nothing read yet, so no law holds anything from this story.</p>';
  o+='</section>';
  return o;}
 var hits=(typeof sniffLaws==='function')?sniffLaws(ST_TEXT):[], by={}, rec=stSeatRecur();
 hits.forEach(function(x){ if(!by[x.law]||x.score>by[x.law].score)by[x.law]=x; });
 /* ONE TILE LANGUAGE, NOT TWO, 9 November. This drew cr()'s own filling
    ring at first; once his real spec for the row landed (square,
    beveled, dark, continuous), keeping a second, round, ring-filled
    shape for only this section would have been exactly the mismatch
    his own rejection of the four mockups was about. SI's score is
    already 0 to 10, the same scale stBright already takes. */
 o+=stPillRow('st-integrity-ls',SI.map(function(l){
   var x=by[l.nm], v=x?x.score:0, rn=rec[B2K[l.b]]||0;
   return {v:v,b:l.nm,c:seatCol(l.b),k:'law',ic:'<path d="'+l.ic+'"/>',str:stBright(v/10,rn),
     title:l.nm+(x?', '+fmtPct('law',v)+' from this story':', nothing from this story')
      +(rn?', its seat back '+rn+' time'+(rn===1?'':'s')+' before':'')};}));
 o+='</section>';
 return o;}

/* THE SIX AXES, THE LAWS OF ACTION, BACK ON THE RAIL, 9 November, his
   words: "don't forget to add the 6 action axes to that left menu."
   Round 110 in TASKS.md built this once already and it was lost when the
   rail's real scope was corrected back to its agreed three sections; his
   own words tonight put it back as a fourth. VERP (engine/verp.js) is six
   gates, three right action and three wrong (aware, detach, intent;
   ignore, attach, averse), each with its own real icon (GATEGLYPH,
   canon.js, "the six gate glyphs... stroked") and its own real colour,
   the same split the action drill and the dial's collar already draw a
   gate in: higher seatCol('Heart'), lower seatCol('Root')
   (ui/drills.js:598, ui/rings.js:722), nothing new chosen here.

   DRAFT SCOPED, THE SAME SILENCE, verpScan(text) (engine/verp.js) is the
   live reader stCommit already calls on commit (verpApply); this calls
   its read-only half, verpScan, directly on ST_TEXT, same convention as
   every pill row above it: nothing typed draws nothing, a story typed
   draws all six, the quiet ones dim rather than missing. */
function stDashVerp(p){
 if(typeof VERP==='undefined'||typeof verpScan!=='function')return '';
 var o='<section class="st-en st-verp" id="st-verp" aria-labelledby="st-verp-h"'
  +'>'
  /* "ACTION", NOT "LAWS OF ACTION", 10 November, his words: "change word
     laws of actions to action." The id keeps its own name (st-verp-h,
     identity, never renamed for a label alone); only the word a person
     reads shortens. */
  +'<h2 class="rblk" id="st-verp-h">Action</h2>';
 if(!p){
  o+='<p class="st-none" id="st-verp-none">Nothing read yet, so no gate holds anything from this story.</p>';
  o+='</section>';
  return o;}
 var s=verpScan(ST_TEXT);
 /* VERP HAS NO SEAT TO READ srcPrior OFF EITHER, but it has its own real
    running total: VERPMIX (engine/verp.js) already adds every commit's
    verpApply straight into one counter per gate, for as long as the
    record exists, which is a real measure of how often this gate keeps
    coming back, not a borrowed one. */
 var mix=(typeof VERPMIX!=='undefined')?VERPMIX:{};
 o+=stPillRow('st-verp-ls',VERP.map(function(v){
   var n=s.hits[v.k]||0, rn=mix[v.k]||0;
   return {v:n,b:v.k,c:v.side==='higher'?seatCol('Heart'):seatCol('Root'),k:'verp',ic:'<path d="'+GATEGLYPH[v.k]+'"/>',
     str:stBright(Math.min(1,n/4),rn),
     title:v.nm+(n>0?', '+n+' word'+(n===1?'':'s')+' from this story':', nothing from this story')
      +(rn?', run '+rn+' time'+(rn===1?'':'s')+' on your record':'')};}));
 o+='</section>';
 return o;}
/* THE SIX AXES DRILL. No existing anaCard kind answers one gate by name
   (the Field's own action drill opens off a press on its dial, a
   different host), so this reads VERP's own line for the gate, the same
   sentence the action drill already quotes, and the record's own share
   of it from verpRead() (engine/verp.js), real and already computed,
   never a second number invented for this card. */
function stOpenVerp(k){
 var v=(typeof VERP!=='undefined'?VERP:[]).filter(function(x){return x.k===k;})[0]; if(!v)return;
 var read=(typeof verpRead==='function')?verpRead().filter(function(x){return x.k===k;})[0]:null;
 var h=anaHead('Law of action',v.nm,v.side==='higher'?'right action':'wrong action');
 h+='<p class="ad-p">"'+esc(v.d)+'"</p>';
 h+='<p class="ad-p">'+(read&&read.n?'Read '+anaN(read.n)+' time'+(read.n===1?'':'s')+' on your record, '+read.pct+'% of every gate it runs.':'Nothing recorded on your record yet.')+'</p>';
 rdShell(h);}

/* PSYCHE STACK, THE REAL SUMMARY, NOT A DUPLICATE OF IT, 8 November. Round
   TB's own words: "Psyche Stack (`railStack` in ui/ui.js, pointed at the
   story being written instead of the whole record)." Checked directly
   before building this: railStack's own tree (saboteur to complex to
   hyper to super complex, ui/ui.js stkGroup/stkFetBar) is built from
   compute()'s chain arrays, which are cross-address pattern matching over
   the whole record (SAB33 ranges and the rest, engine/compute.js) -- there
   is no version of that pipeline that runs on one unsent draft's parse,
   and building one is new engine work, not a rail to wire. So this is not
   railStack re-pointed at the draft, which is not honestly buildable
   tonight; it is a real summary of the same record railStack already
   reads (computeSeen(), the same call ui.js's own railStack makes), in
   the same pill language the rest of this rail uses, with the full
   interactive tree still in its one place, the right rail's own Insight
   panel (#stack), not duplicated here. Child emotions carries its own
   section above, so this counts only the three tiers built from it:
   saboteurs, complexes, hyper complexes, super complexes. Colour is
   CHAINGLYPH/TIER's own, the same mark and tone analytics.js's "What is
   running" bubbles already use for these four kinds, one mark per
   concept rather than a second one invented here. */
function stDashPsycheStack(){
 if(typeof computeSeen!=='function')return '';
 var r=computeSeen();
 var TIER={sab:PAL.Throat,cx:PAL.Solar,hy:PAL.Sacral,sup:PAL.Root};
 var KIND=[['sab','Saboteurs',r.sabs],['cx','Complexes',r.cxs],['hy','Hyper complexes',r.hys],['sup','Super complexes',r.sups]];
 var o='<section class="st-en st-ps" id="st-psyche" aria-labelledby="st-psyche-h">'
  +'<h2 class="rblk" id="st-psyche-h">Psyche stack</h2>';
 /* ALWAYS THE PILLS, ONLY TEXT ON AN UNREAD RECORD, 9 November, corrected
    the same night: this used to fall back to a whole sentence the moment
    every tier was empty, which is the one section on this rail that did
    not hold the rule its own three siblings above already keep (a seat or
    a feeling at nothing stays a dim pill in the row, never a sentence).
    His own complaint named the result exactly: "right now you get the
    Psyche stack with a bunch of text. I don't want that there." The
    sentence now means what r.unread already means everywhere else on
    this page, nothing entered anywhere, and nothing short of that. */
 if(r.unread){
  o+='<p class="st-none" id="st-psyche-none">Nothing recorded yet, so no pattern holds anything from this record.</p>';}
 else{
  /* NO SEPARATE RECURRENCE TERM HERE, by design and not an oversight:
     every other section blends today's words with how often the record
     has shown the same thing before; this section already reads the
     whole record (computeSeen(), not the draft), so what the other six
     add as a second number is already the whole of what this one reads. */
  o+=stPillRow('st-psyche-ls',KIND.map(function(k){
   var n=(k[2]||[]).length;
   return {v:n,b:k[0],c:TIER[k[0]],k:'psy',ic:'<path d="'+CHAINGLYPH[k[0]]+'"/>',str:Math.min(1,n/4),
     title:k[1]+(n>0?', '+n+' running':', nothing running')};}));}
 o+='</section>';
 return o;}
/* MASKS, ON THE LEFT RAIL ITSELF, 10 November, his words: "add the masks."
   The scoring is stMiniMasks's own (ui/storyui.js), the same five
   MASKS_READ entries (engine/data/canon.js) weighed by the mean of
   r.carrying's charge at the seats each mask sits over; this reads the
   whole record the same way Psyche Stack above does (computeSeen()), not
   the unsent draft.

   ONE TILE LANGUAGE, NOT TWO, THE SAME LESSON INTEGRITY ALREADY LEARNED,
   overridden the same night: this used to print each mask's own row
   (.st-mks-t/.st-mks-i/.st-mks-lb), a name always visible under a bigger
   icon, for the unpack-every-symbol rule. Two real defects, not a style
   choice: those three classes carried no CSS anywhere in this file, so
   the icon painted at the SVG element's own unstyled default size, a
   giant black shape with no colour and no clip-path, not a small lit
   tile at all; and his own later words, looking at the live rail, ruled
   the row itself out before the bug was ever found -- "same with the
   psyche stack, I just want the same functionality as emotions,
   patterns, integrity... these are also buttons that light up." Masks
   now calls stPillRow like every other section, the name carried in
   title/aria-label the same way a seat or a law already is, nothing
   printed as standing text. */
function stDashMasks(){
 if(typeof computeSeen!=='function'||typeof MASKS_READ==='undefined')return '';
 var r=computeSeen();
 var o='<section class="st-en st-mks" id="st-masks" aria-labelledby="st-masks-h">'
  +'<h2 class="rblk" id="st-masks-h">Masks</h2>';
 if(r.unread){
  o+='<p class="st-none" id="st-masks-none">Nothing recorded yet, so no mask reads anything from this record.</p>';}
 else{
  var bySeat={};
  r.carrying.forEach(function(n){ (bySeat[n.b]=bySeat[n.b]||[]).push(n.sq); });
  var scored=MASKS_READ.map(function(m){
   var vals=(m.b||[]).map(function(s){ var a=bySeat[s];
    return a&&a.length?a.reduce(function(x,y){return x+y;},0)/a.length:0; });
   var v=vals.length?vals.reduce(function(x,y){return x+y;},0)/vals.length:0;
   return {m:m,v:v};}).sort(function(a,b){return b.v-a.v;});
  o+=stPillRow('st-masks-ls',scored.map(function(s){
   var col=CHC.maskCols(s.m)[0], pct=fmtPct('atom',s.v);
   return {v:s.v,b:s.m.nm,c:col,k:'mask',ic:'<path d="'+s.m.ic+'"/>',str:Math.min(1,s.v/10),
     title:s.m.nm+(pct!==PCT_DASH?', '+pct+' of this record':', nothing from this record')};}));}
 o+='</section>';
 return o;}
/* THE PSYCHE STACK DRILL. Every chain of one tier, in the same card shape
   and the same rows (anaPatRows) the right rail's own Insight panel and
   every analytics bubble already draw a chain in, built here directly
   because no single anaCard kind answers "every saboteur" the way it
   answers one saboteur by name; a press on a row inside this card still
   opens that one chain's own real card, through the same global listener
   (its data-ana, written by anaPatRow, fires inside #rdrill exactly as it
   does inside #ana). */
function stOpenPsyche(kind){
 if(typeof computeSeen!=='function')return;
 var r=computeSeen();
 var NAME={sab:'Saboteurs',cx:'Complexes',hy:'Hyper complexes',sup:'Super complexes'};
 var LIST={sab:r.sabs,cx:r.cxs,hy:r.hys,sup:r.sups};
 var lab=NAME[kind]||kind, list=(LIST[kind]||[]).slice().sort(function(a,b){return (b.w||0)-(a.w||0);});
 var h=anaHead('Psyche stack',lab);
 h+=list.length?anaPatRows(list,20):'<p class="ad-p">Nothing by this name is running on this record right now.</p>';
 rdShell(h);}

/* BOUNDARY, THE PURPOSE MAP, NOT THE SIX GATES, 9 November. Corrected the
   same night: the six VERP gates (aware/detach/intent/ignore/attach/
   averse, engine/verp.js) are actions, and this section drew them once
   before under this name. His own words, asked for this exact shape: "the
   ends of the points of the triangle are our values." Only one thing in
   this engine is a six-point figure built from values rather than
   actions: the purpose map (engine/avatar.js, CURP.purpose), his own
   ruling (DECISIONS.md, "the purpose map"), two triangles, soul up and
   earthly down, "the overlap of the two triangles is a hexagon and the
   hexagon is the boundary." A point lights when its value is written,
   the one real signal that exists; alignment and fulfilment, the other
   two states he described, have no reading anywhere in this engine yet
   and are not drawn as if they did. THE EDGES ARE SOFT DOTTED LINES, his
   words: "show the edges, connected, between the points, as soft dotted
   lines," each triangle's three edges, not solid. RECORD SCOPED, not the
   draft: a value is something a person writes once to their profile, the
   same way Psyche Stack above reads the record and not this one unsent
   story. */
function stDashBoundary(){
 if(typeof purposeBlank!=='function')return '';
 var pu=(CURP&&CURP.purpose)||purposeBlank();
 var cx=85,cy=85,R=62;
 var pt=function(deg){var rad=deg*Math.PI/180;return {x:cx+R*Math.cos(rad),y:cy+R*Math.sin(rad)};};
 var soulAng=[-90,150,30], egoAng=[90,210,330];
 var soulCol=seatCol('Crown'), egoCol=seatCol('Root');
 var dot=function(ang,col,val,i,side){
  var p=pt(ang), lit=!!(val&&String(val).trim());
  var t=(lit?String(val).trim():(side+' value '+(i+1))+', not written yet');
  return '<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="7" fill="'+col+'" '
   +'opacity="'+(lit?'.95':'.22')+'" data-seat="'+esc(side+i)+'" tabindex="0" role="img" aria-label="'+esc(t)+'">'
   +'<title>'+esc(t)+'</title></circle>';};
 var ring=function(angs){return '<polygon points="'+angs.map(function(a){var p=pt(a);return p.x.toFixed(1)+','+p.y.toFixed(1);}).join(' ')
  +'" fill="none" stroke="var(--edge-2)" stroke-width="1.3" stroke-dasharray="1.5 5" stroke-linecap="round"/>';};
 /* THE TITLE IS GONE, 9 November, his words: "get rid of the title.
    Boundary and compass." The name is still here, only moved to
    aria-label: a screen reader still hears what this is, a sighted
    person reads the figure itself rather than a word above it. */
 var o='<section class="st-en st-bnd" id="st-boundary" aria-label="Boundary">'
  +'<svg viewBox="0 0 170 170" class="st-bnd-svg" aria-hidden="true">'
  +ring(soulAng)+ring(egoAng)
  +soulAng.map(function(a,i){return dot(a,soulCol,pu.soul&&pu.soul[i],i,'Soul');}).join('')
  +egoAng.map(function(a,i){return dot(a,egoCol,pu.ego&&pu.ego[i],i,'Earthly');}).join('')
  +'</svg></section>';
 return o;}

/* THE COMPASS, FLATTENED TO CQ AND DQ, 9 November. His words: "the compass
   is just an arrow up, line middle, line down. That's the CQ, SQ, DQ...
   remove the SQ part." A wide arrow filling upward for CQ, a wide arrow
   filling downward for DQ, on one thick line, zeroed at the middle.
   NO HALO, NO PITCHFORK, his words: "get rid of the halo and the
   pitchfork." Those were the real Compass's own top and bottom marks
   (ui/cone.js, ui/component.js GL_HALO/GL_FORK) for Coherent and
   Decoherent; this flattened gauge is not that screen and does not
   borrow its glyphs. A soft glow behind the line in place of them, so
   the panel is not bare, his own note that the first pass "was pretty
   boring." DQ NEVER BORROWS A SEAT COLOUR OR THE ALARM, the same rule
   analytics.js already keeps for Shadow: drawn in a plain grey. RECORD
   SCOPED: CQ and DQ are the record's own two figures (computeSeen),
   never the draft's. */
function stDashCompass(){
 if(typeof computeSeen!=='function')return '';
 var r=computeSeen(), cx=60, cy=85, maxLen=58;
 var cq=r.unread?0:r.CQ, dq=r.unread?0:r.DQ;
 var arrow=function(len,up,col){
  if(len<2)return '';
  var sw=9, hw=18, hl=16, dir=up?-1:1;
  var yTip=cy+dir*Math.max(len,hl+4), yBase=cy, yShoulder=yTip-dir*hl;
  return '<polygon points="'+[
    [cx-sw,yBase],[cx-sw,yShoulder],[cx-hw,yShoulder],[cx,yTip],[cx+hw,yShoulder],[cx+sw,yShoulder],[cx+sw,yBase]
   ].map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1);}).join(' ')+'" fill="'+col+'"/>';};
 /* THE TITLE IS GONE AND CQ/DQ MOVE TO EITHER END, 9 November, his words:
    "put CQ, DQ at the top and the bottom." They read as the figure's own
    two poles now, CQ over the upward arrow and DQ under the downward one,
    rather than a caption printed once below both. */
 var o='<section class="st-en st-cps" id="st-compass" aria-label="Compass">'
  +'<p class="st-cps-top" title="Coherence, how well your 21 laws of moral integrity hold">CQ '+(r.unread?PCT_DASH:Math.round(cq))+'</p>'
  +'<svg viewBox="0 0 120 170" class="st-cps-svg" aria-hidden="true">'
  +'<radialGradient id="stcpsg" cx="50%" cy="50%" r="55%">'
  +'<stop offset="0%" stop-color="'+GOLD+'" stop-opacity=".28"/><stop offset="100%" stop-color="'+GOLD+'" stop-opacity="0"/></radialGradient>'
  +'<circle cx="'+cx+'" cy="'+cy+'" r="54" fill="url(#stcpsg)"/>'
  +'<rect x="'+(cx-3)+'" y="'+(cy-maxLen)+'" width="6" height="'+(maxLen*2)+'" rx="3" fill="var(--edge-2)"/>'
  +arrow(Math.min(maxLen,(cq/100)*maxLen),true,seatCol('Heart'))
  +arrow(Math.min(maxLen,(dq/100)*maxLen),false,'var(--dim)')
  +'</svg>'
  +'<p class="st-cps-bot" title="Shadow, the charge still carried across all 112 addresses">DQ '+(r.unread?PCT_DASH:Math.round(dq))+'</p>'
  +'</section>';
 return o;}
