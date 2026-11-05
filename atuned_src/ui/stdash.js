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
   the line under the heading is what keeps them apart. That line left the
   screen on 5 November, his words: "Get rid of the text that says what this
   story puts at each of the 7 seats." It is the heading's title now, which
   the shell's tooltip opens on hover, a tap and keyboard focus, so the
   meaning is one touch away and no longer printed (the unpack rule, round
   PO: the meaning moves, it never vanishes).

   THE SCALE IS THE ONE THE PAGE ALREADY DRAWS. stSeatT in ui/storyui.js
   lifts each seat to min(10, bands/3), which is also the line in
   engine/sniff.js that the 'atom' kind in engine/pct.js cites. So the ring
   here and the seat's spring in the Journal's own chart read one number,
   and the percent printed is the ring's fill.

   ALL SEVEN, ALWAYS, once there is a story. A seat this story has not reached
   stays in its place with the dash cr() prints for nought, because a list
   that drops the quiet seats reads as a body with fewer seats in it.

   CROWN AT THE TOP NOW, 5 November, and it was Root first until then. The
   Imprints chart stands beside this column in the Full view and has always
   run Crown at the top down to Root, the way the seats sit in a standing
   body, so the same seven seats ran in two opposite orders a few hundred
   pixels apart on one screen. This column takes the chart's order, because
   the column is now drawn as that body: see THE COLUMN IS A BODY below.

   SILENT WITH NO STORY. Nothing typed and nothing spoken is not seven zeros:
   a row of dashes on a story that does not exist yet is a reading the
   instrument did not take. So the section says what is absent, once, in the
   wording the house keeps for this state, and draws no ring and no figure.
   The seven seats still stand, as the quiet map the reading will land on:
   each glyph in its seat's colour, its name, and an empty track. A map is
   not a reading. It is what puts something in the column he said had
   nothing in it, and it shows where the words will go before there are any.

   THE COLUMN IS A BODY, 5 November, his words: "The left-hand menu I've
   asked for multiple redesigns. On the left-hand side of the menu, and I
   don't see anything there." It was seven bare rows, a small grey ring, a
   dash in a pill and a name, the same at every seat. It is drawn now in the
   language the Field's Insight rail ships (SW7, 4 November): the seat's own
   glyph in its own ring, the name in the seat's colour, the figure in the
   number face at the row's end, and under the name a track the seat's
   colour fills to the same share the ring's arc shows. A thin spine runs
   through the seven rings, shaded seat to seat, so the column reads as one
   body standing up and not seven unrelated lines. The seat this story
   reaches hardest sits on a ground of its own colour, so the one fact the
   column exists to show is the first thing seen, with no word added. Every
   colour is seatCol, so every lighting draws it with no rule of its own.

   AND r.unread IS NOT WHAT SILENCES IT, which is the rule this page already
   keeps. r.unread is a claim about the record (engine/compute.js: nothing
   entered anywhere). This section reads uncommitted words, so on a stranger's
   first story the record is still unread while the chart beside this rail
   already lights the seats the words reached. Gated on r.unread, this would
   go quiet on exactly the story the chart is drawing, which is the
   disagreement stRead exists to prevent ("the sentence, the chart and the
   list cannot disagree"). The Journal's own record reader, stAnaPaint's
   Running hot list, is the part that is gated on r.unread, and it still is. */
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
 var p=(typeof ST_TEXT==='string'&&ST_TEXT.trim())?ST_PARSED:stDashExample();
 var seats=BANDS.slice().reverse();
 /* the spine's shading, seat to seat, top to foot, in this lighting's colours */
 var spine='linear-gradient(to bottom,'+seats.map(seatCol).join(',')+')';
 var o='<section class="st-en" id="st-energy" aria-labelledby="st-energy-h">'
  +'<h2 class="rblk" id="st-energy-h" title="What this story puts at each of the seven seats.">Energy</h2>';
 if(!p){
  o+='<ul class="st-en-ls st-en-quiet" style="--spine:'+spine+'" aria-hidden="true">'+seats.map(function(b){
   return '<li class="st-en-q" style="--c:'+seatCol(b)+'"><span class="st-en-g"><svg viewBox="0 0 24 24">'
    +(SEATGLYPH[b]||SEATGLYPH._)+'</svg></span><span class="st-en-n">'+esc(b)+'</span><span class="st-en-bar"></span></li>';}).join('')
   +'</ul><p class="st-none" id="st-energy-none">Nothing read yet, so no seat holds anything from this story.</p>';}
 else{
  var rows=seats.map(function(b){var raw=p.bands[B2K[b]]||0, v=Math.min(10,raw/3);
    return {b:b,v:v,f:fmtPct('atom',v),s:pct('atom',v)||0};});
  var top=rows.reduce(function(m,r){return r.v>(m?m.v:0)?r:m;},null);
  o+='<ul class="st-en-ls" id="st-energy-ls" style="--spine:'+spine+'">'+rows.map(function(r){
   var t=r.b+(r.f!==PCT_DASH?', '+r.f+' from this story':', nothing from this story');
   return '<li class="st-en-r'+(r===top?' st-en-top':'')+(r.f===PCT_DASH?' st-en-0':'')+'" data-seat="'+esc(r.b)
    +'" style="--c:'+seatCol(r.b)+'" title="'+esc(t)+'">'
    +cr(r.b,r.s,{size:'md',raw:r.f,hot:false,title:t})
    +'<span class="st-en-n">'+unp('seat:'+r.b.toLowerCase(),r.b)+'</span>'
    +'<span class="st-en-bar"><i style="width:'+Math.round(r.s)+'%"></i></span></li>';}).join('')
   +'</ul>';}
 o+='</section>';
 h.innerHTML=o;}
/* ON A WORKED EXAMPLE, THE NEWEST ENTRY OF ITS OWN JOURNAL, 5 November. An
   example has no words being written (show only, engine/showonly.js), so
   this column read nothing on every example and said so, which is half of
   "I'm loading up my profile examples and there's nothing under Discover."
   The centre column now shows the example's journal (stExampleThread, in
   ui/storyui.js), and the story this column reads on an example is one of
   that thread's entries, read by the same parseStory the person's own words
   go through. parseStory is pure over the text, so nothing is written.

   WHICH ENTRY: THE NEWEST ONE THE WORDS REACHED A SEAT IN. The newest entry
   outright was the first cut, and measured over every example it read a
   dash at all seven seats on Sofia, Diane, Derek, Wren, Lance 85 and Lance
   100, because their last entry names no charge (its stored bands are empty,
   and parseStory agrees with every stored entry on every example). Seven
   dashes beside a journal full of words is the empty column again. The whole
   journal read as one story was the second option and it was refused: the
   scale is per story, min(10, bands/3), so Diane's three Root entries
   saturate it and two seats read 100%, which says nothing. So it is the
   newest entry that reached a seat, and the thread marks that entry
   (stDashExEntry, read by stExampleThread) so the column and the
   conversation visibly point at the same words. Kept by the text, because
   this paints on every refresh and the reading only changes when the entry
   does. */
var ST_DASH_EX={};
function stDashExRead(t){return ST_DASH_EX[t]||(ST_DASH_EX[t]=parseStory(t));}
function stDashExEntry(){
 if(typeof showOnly!=='function'||!showOnly())return null;
 var es=((typeof CURP!=='undefined'&&CURP&&CURP.story&&CURP.story.entries)||[])
  .filter(function(e){return e&&e.text;})
  .sort(function(a,b){return String(b.t).localeCompare(String(a.t));});
 for(var i=0;i<es.length;i++){var bd=stDashExRead(es[i].text).bands||{};
  if(Object.keys(bd).some(function(k){return bd[k]>0;}))return es[i];}
 return null;}
function stDashExample(){var e=stDashExEntry(); return e?stDashExRead(e.text):null;}
