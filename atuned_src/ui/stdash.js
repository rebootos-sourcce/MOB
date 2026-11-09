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

/* THE PILL ROW: COLOUR ONLY, NO WORD, SORTED BY STRENGTH, 8 November. His
   words: "On the left panel, I don't want the text. I only want the
   color. And a pill, almost like a light. And I want them side by side,
   arranged according to signal strength... Plus maybe the other four
   right for person, mouse is over it, they can see what's being lit
   up." One row of colour pills, strongest first. A seat or category at
   nothing stays in the row, dimmer, rather than dropping out of it, so
   "the other four" (or eight) are the ones still visible, just quieter.
   The name and the reading are not gone, they are what the hover says:
   cr()'s own title plumbing already carries a name and a figure into a
   tooltip everywhere else in this product, so this reuses that
   convention rather than inventing a second one. */
function stPillRow(id,items){
 var sorted=items.slice().sort(function(a,b){return (b.v||0)-(a.v||0);});
 return '<div class="st-pl-row" id="'+id+'">'+sorted.map(function(it){
   var lit=(it.v||0)>0;
   return '<span class="st-pl'+(lit?' lit':'')+'" data-seat="'+esc(it.b||it.k||'')+'" tabindex="0" role="img" style="--c:'+it.c+'" '
    +'aria-label="'+esc(it.title)+'" title="'+esc(it.title)+'"></span>';}).join('')
  +'</div>';}

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
 o+=stDashChildEmotions(p);
 o+=stDashPatterns(p);
 o+=stDashPsycheStack();
 /* BOUNDARY AND THE COMPASS SIT AS ONE PAIR, 9 November, his words: "these
    all need to look like they're together... make sure it's all
    symmetrical." Same row, same width each, same svg proportions (both
    170 tall), rather than two sections stacked at whatever height their
    own content happened to need. */
 o+='<div class="st-pair">'+stDashBoundary()+stDashCompass()+'</div>';
 h.innerHTML=o;}

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
 var o='<section class="st-en st-ce" id="st-childem" aria-labelledby="st-childem-h">'
  +'<h2 class="rblk" id="st-childem-h">Emotions</h2>';
 if(!p||typeof CHG2FET==='undefined'){
  o+='<p class="st-none" id="st-childem-none">Nothing read yet, so no feeling holds anything from this story.</p>';
  o+='</section>';
  return o;}
 var byChild={};
 CHILD.forEach(function(c){byChild[c.nm]=0;});
 Object.keys(p.charges||{}).forEach(function(k){
  var f=CHG2FET[k]; if(f&&byChild[f]!==undefined)byChild[f]+=p.charges[k];});
 o+=stPillRow('st-childem-ls',CHILD.map(function(c){
  var n=byChild[c.nm]||0;
  return {v:n,b:c.nm,c:seatCol(c.seat),
    title:c.nm+(n>0?', '+n+' word'+(n===1?'':'s')+' from this story':', nothing from this story')};}));
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
 var o='<section class="st-en st-pat" id="st-patterns" aria-labelledby="st-patterns-h">'
  +'<h2 class="rblk" id="st-patterns-h">Patterns</h2>';
 if(!p){
  o+='<p class="st-none" id="st-patterns-none">Nothing read yet, so no pattern holds anything from this story.</p>';
  o+='</section>';
  return o;}
 var n={parental:0,ancestral:0};
 (p.hits||[]).forEach(function(h){if(h.originCat&&n[h.originCat]!==undefined)n[h.originCat]++;});
 var CAT=[['parental','Parental',seatCol('Heart')],['ancestral','Ancestral',seatCol('Root')]];
 o+=stPillRow('st-patterns-ls',CAT.map(function(c){
   var v=n[c[0]];
   return {v:v,b:c[0],c:c[2],
     title:c[1]+(v>0?', '+v+' word'+(v===1?'':'s')+' handed down in this story':', nothing handed down in this story')};}));
 o+='</section>';
 return o;}

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
 var any=KIND.some(function(k){return k[2]&&k[2].length;});
 var o='<section class="st-en st-ps" id="st-psyche" aria-labelledby="st-psyche-h">'
  +'<h2 class="rblk" id="st-psyche-h">Psyche Stack</h2>';
 if(r.unread||!any){
  o+='<p class="st-none" id="st-psyche-none">Nothing recorded yet, so no pattern holds anything from this record.</p>';}
 else{
  o+=stPillRow('st-psyche-ls',KIND.map(function(k){
   var n=(k[2]||[]).length;
   return {v:n,b:k[0],c:TIER[k[0]],
     title:k[1]+(n>0?', '+n+' running':', nothing running')};}));}
 o+='</section>';
 return o;}

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
 var o='<section class="st-en st-bnd" id="st-boundary" aria-labelledby="st-boundary-h">'
  +'<h2 class="rblk" id="st-boundary-h">Boundary</h2>'
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
 var o='<section class="st-en st-cps" id="st-compass" aria-labelledby="st-compass-h">'
  +'<h2 class="rblk" id="st-compass-h">Compass</h2>'
  +'<svg viewBox="0 0 120 170" class="st-cps-svg" aria-hidden="true">'
  +'<radialGradient id="stcpsg" cx="50%" cy="50%" r="55%">'
  +'<stop offset="0%" stop-color="'+GOLD+'" stop-opacity=".28"/><stop offset="100%" stop-color="'+GOLD+'" stop-opacity="0"/></radialGradient>'
  +'<circle cx="'+cx+'" cy="'+cy+'" r="54" fill="url(#stcpsg)"/>'
  +'<rect x="'+(cx-3)+'" y="'+(cy-maxLen)+'" width="6" height="'+(maxLen*2)+'" rx="3" fill="var(--edge-2)"/>'
  +arrow(Math.min(maxLen,(cq/100)*maxLen),true,seatCol('Heart'))
  +arrow(Math.min(maxLen,(dq/100)*maxLen),false,'var(--dim)')
  +'</svg>'
  +'<p class="st-cps-say"><span title="Coherence, how well your 21 laws of moral integrity hold">CQ '+(r.unread?PCT_DASH:Math.round(cq))+'</span>'
  +'<span title="Shadow, the charge still carried across all 112 addresses">DQ '+(r.unread?PCT_DASH:Math.round(dq))+'</span></p>'
  +'</section>';
 return o;}
