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
  o+='<ul class="st-en-ls" id="st-energy-ls">'+BANDS.map(function(b){
   var raw=p.bands[B2K[b]]||0, v=Math.min(10,raw/3), f=fmtPct('atom',v);
   return '<li class="st-en-r" data-seat="'+esc(b)+'">'
    +cr(b,pct('atom',v)||0,{size:'sm',raw:f,hot:false,
      title:b+(f!==PCT_DASH?', '+f+' from this story':', nothing from this story')})
    +'<span class="st-en-n">'+unp('seat:'+b.toLowerCase(),b)+'</span></li>';}).join('')
   +'</ul>';}
 o+='</section>';
 h.innerHTML=o;}
