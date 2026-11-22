
/* ============================================================
   THE TABLE. The seventy six universal laws laid out the way the
   book calls them, "a periodic table, not a curriculum", at the top
   of the wisdom school. Built 21 November from the art review's
   direction A (dark), which was the default working direction: no
   pick among the four mockups is recorded anywhere this seat can
   read, so this is A pending his pick, and the layout below is the
   requirements list it was graded against, read off kb.js and never
   typed.

     the quotient column        the coherence formula, written out in
                                words, then how many laws are read
     the frame row              E76 and E75 at one and a half, and a
                                third cell drawn dashed, "To be
                                named", because which law sits there
                                is his and nobody else's
     the family bands           one tile each, HARM's own order, E01
                                to E74, every family on a new row and
                                every row from one left edge
     the summary rail           whatever was pressed, whole, and Next

   Relaid 21 November on his notes on direction A: left justified, the
   quotients in a column of their own inside the table, the left card gone,
   the right panel made the summary every press answers into, and every law
   with its own mark.

   Nothing on this board is a percent. CQ is a percent and it is shown
   in the summary rail only, when the formula is the thing open, so the
   score here, n of N read, is never mistaken for a reading of the
   person. What is read is per device (KBT_KEY, through STORE, which
   ui/ui.js binds to localStorage inside a try): there is no account
   copy of it and nothing here builds one.

   It does not replace the seat browser under it. kbRender puts it
   above the seven assemblage points when the page is on its default
   view, no deck chosen and no search, so every gate that walks the
   decks walks exactly what it walked before.
   ============================================================ */
var KBT_KEY='atuned-kb-seen';
/* the formula's colour is the accent, ruled #7EB8D4 for this tile by name.
   It is GOLD in engine/data/canon.js, read rather than typed a second time. */
var KBT_FORMULA=(typeof GOLD!=='undefined')?GOLD:'#7EB8D4';
/* WHICH LAWS HAVE A FILM IS THE ENGINE'S OWN MAP, HARM_FILM in
   engine/data/kb.js, and never a list typed here. The first cut typed eight
   codes off BOOK-ERRATA.md 14 and 15 (E01 to E10 less E04 and E05), and the
   same day the folder itself was listed and holds ten, E04 and E05 among
   them, so the typed list was already wrong by two on the day it landed.
   The films are a map for the Worker seam and are not in this file, so a
   tile that has one says so and says it is not attached, and no path is
   invented for it. */
var KBT_FILM=(typeof HARM_FILM!=='undefined')?HARM_FILM:{};
/* the open tile, the one hovered, and whether the board has made its
   entrance this session. The page is rewritten whole on every press, so
   this outlives the markup. */
var KBT={open:null, hover:null, seen:false};

/* ---------- the record of what has been read ---------- */
/* { "E01": { "kbSeen": true }, ... }. A boolean per tile and only ever true:
   a tile not in the record has not been read. Anything that is not that
   shape is left out on the read, and a store that throws is an empty one,
   so a private window draws the board unread instead of no board. */
function kbtSeenAll(){
 if(typeof STORE==='undefined')return {};
 try{var o=JSON.parse(STORE.get(KBT_KEY)||'{}'), out={};
  if(!o||typeof o!=='object'||Array.isArray(o))return {};
  HARM.forEach(function(e){if(o[e.c]&&o[e.c].kbSeen===true)out[e.c]={kbSeen:true};});
  return out;}catch(e){return {};}}
function kbtSeen(c){return !!(kbtSeenAll()[c]);}
/* returns whether the write landed, so a caller never claims one it does not
   have. A tile marked read on a device that cannot store still closes its
   ring for the visit, and status() says the mark will not be kept. */
var KBT_MEM={};
function kbtMark(c){
 KBT_MEM[c]=true;
 var o=kbtSeenAll(); if(o[c])return true;
 o[c]={kbSeen:true};
 try{STORE.set(KBT_KEY,JSON.stringify(o)); return JSON.parse(STORE.get(KBT_KEY)||'{}')[c].kbSeen===true;}
 catch(e){return false;}}
function kbtIsSeen(c){return !!KBT_MEM[c]||kbtSeen(c);}

/* ---------- what the board is made of, read off kb.js ---------- */
/* the families in the order HARM first meets them. The frame, meta, is the
   row under the formula and not a band, and it is still one of the seven the
   formula's arcs count, because it is one of the seven HARM_AX names. */
function kbtFams(){
 var out=[]; HARM.forEach(function(e){if(out.indexOf(e.a)<0)out.push(e.a);}); return out;}
function kbtOf(a){return HARM.filter(function(e){return e.a===a;});}
/* a Law of Moral Integrity wears its own mark and its own seat (SI), which
   is the rule kbRowsOf('harm') already follows; every other family wears
   HARM_FAM's. One tile, one mark, the same one its deck row draws. */
function kbtSeatOf(e){
 var si=(e.a==='spirit')?kbFind(SI,e.t):null;
 return (si&&si.b)||(HARM_FAM[e.a]||{}).b||'Heart';}
/* AND EVERY OTHER LAW NOW WEARS ITS OWN TOO, 21 November: HARM_IC in
   engine/data/kb.js, by code. The family's mark is the fallback for a law
   added to HARM before its mark is drawn, and the band heading's glyph. */
function kbtIcOf(e){
 var si=(e.a==='spirit')?kbFind(SI,e.t):null;
 return (si&&si.ic)||(typeof HARM_IC!=='undefined'&&HARM_IC[e.c])||(HARM_FAM[e.a]||{}).ic||GLOSS_IC;}
/* NOT YET CONFIRMED IN THE BOOK, read off the entry and not a list of codes:
   the three whose own text says "pending confirmation", which is E65, E67
   and E68 on this build. tests/engine.js holds the three by code, so the
   day the book confirms one and kb.js drops the words, the gate says so. */
function kbtUnconfirmed(e){return /pending confirmation/i.test(e.d||'');}
/* TWO LAWS ARE NAMED COHERENCE. E74 is the instrument, the measure family's
   sixth, and E76 is the frame's destination state; a tile that only said
   Coherence twice on one screen asks a person which one they read. */
function kbtSub(e){return (e.c==='E74')?'the instrument':'';}
/* A LONG NAME BREAKS WHERE A PERSON WOULD HYPHENATE IT. At four tiles of 80
   on a phone the name has about 72 pixels at 13, and Acceptance, Anticipation
   and Accountability do not fit. hyphens:auto needs the browser's own
   dictionary and the Chromium the gates run did not have one, so the first
   cut broke them as "Acceptanc / e", measured at 390. A soft hyphen before a
   common ending is invisible until the line has to break there. */
/* THREE NAMES MATCHED NO ENDING AND BROKE ON A LETTER, 21 November.
   Correspond printed "Correspon / d" on a phone tile, measured at 390, and
   Transparency and Compassion had no break point either, read off HARM by
   listing every name of ten letters or more against this list. "sion" and
   "ency" cover two. Correspond has no common ending at all, so a word the
   list misses breaks at its last pair of consonants that leaves four letters
   on each side, "Corres-pond", rather than wherever the box runs out. */
var KBT_ENDS=['ability','ation','ance','ence','ency','sion','tion','ment','ness','ual','ity'];
function kbtName(t){
 return esc(t).split(' ').map(function(w){
  if(w.length<10)return w;
  for(var i=0;i<KBT_ENDS.length;i++){var k=w.toLowerCase().lastIndexOf(KBT_ENDS[i]);
   if(k>=4&&k+KBT_ENDS[i].length===w.length)return w.slice(0,k)+'&shy;'+w.slice(k);}
  var V=/[aeiouy]/i;
  for(var j=w.length-4;j>=4;j--)if(/^[a-z]{2}$/i.test(w[j-1]+w[j])&&!V.test(w[j-1])&&!V.test(w[j]))
   return w.slice(0,j)+'&shy;'+w.slice(j);
  return w;}).join(' ');}
function kbtFamName(a){return HARM_AX[a]||a;}
/* the family line, the heading's own words after the name where KB_AXHD has
   them, so Sat and Chit are never printed without what they mean */
function kbtFamLine(a){var s=KB_AXHD[a]||'', i=s.indexOf(' · ');
 return i>=0?s.slice(i+3):'';}

/* ---------- the three tiers ---------- */
/* unlocked: the first law in a family read. read: every law in it read, and
   its heading ring closes. grand: every one of the formula's seven arcs
   closed, which is every family read. Nothing is padlocked at any tier. */
function kbtTally(){
 var fams=kbtFams(), per={}, n=0;
 fams.forEach(function(a){var rs=kbtOf(a), k=rs.filter(function(e){return kbtIsSeen(e.c);}).length;
  per[a]={k:k, n:rs.length}; n+=k;});
 var unlocked=fams.filter(function(a){return per[a].k>0;}).length;
 var done=fams.filter(function(a){return per[a].k===per[a].n;}).length;
 return {n:n, N:HARM.length, per:per, fams:fams, unlocked:unlocked, done:done, grand:done===fams.length};}

/* ---------- marks ---------- */
/* THE READ MARK IS A RING THAT CLOSES, never a fill, because icons are ring
   and not fill. The track is dashed and faint; reading draws the ring round
   to closed in the tile's own colour. */
function kbtRing(ic,col,seen,px){
 var r=22.5, C=(2*Math.PI*r).toFixed(1);
 return '<span class="kbt-sy" style="width:'+px+'px;height:'+px+'px">'
  +'<svg class="kbt-rg" viewBox="0 0 48 48" aria-hidden="true">'
  +'<circle class="kbt-rt" cx="24" cy="24" r="'+r+'" fill="none" stroke="'+col+'" stroke-opacity=".38" stroke-width="1.2" stroke-dasharray="2 3.2"/>'
  +'<circle class="kbt-rf" cx="24" cy="24" r="'+r+'" fill="none" stroke="'+col+'" stroke-width="1.6" stroke-linecap="round" '
  +'stroke-dasharray="'+C+'" stroke-dashoffset="'+(seen?0:C)+'" transform="rotate(-90 24 24)"/></svg>'
  +'<svg class="kbt-gl" viewBox="0 0 24 24" fill="none" stroke="'+col+'" stroke-width="1.5" '
  +'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+glyphPath(ic)+'</svg></span>';}
/* the formula's seven arcs, one per family, each drawn to the share of its
   family read and closed when the family is */
function kbtArcs(t,px){
 var r=44, C=2*Math.PI*r, n=t.fams.length, gap=6, seg=C/n-gap, o='';
 t.fams.forEach(function(a,i){
  var f=t.per[a].n?t.per[a].k/t.per[a].n:0, rot=-90+i*360/n+(gap/2)/C*360;
  o+='<circle cx="50" cy="50" r="'+r+'" fill="none" stroke="'+KBT_FORMULA+'" stroke-opacity=".24" stroke-width="3" '
   +'stroke-dasharray="'+seg.toFixed(2)+' '+(C-seg).toFixed(2)+'" transform="rotate('+rot.toFixed(2)+' 50 50)"/>'
   +'<circle class="kbt-arc" data-kbtf="'+esc(a)+'" cx="50" cy="50" r="'+r+'" fill="none" stroke="'+KBT_FORMULA+'" stroke-width="3" '
   +'stroke-linecap="butt" stroke-dasharray="'+(seg*f).toFixed(2)+' '+(C-seg*f).toFixed(2)+'" transform="rotate('+rot.toFixed(2)+' 50 50)"/>';});
 /* px 0 is the formula tile's own, sized by its sheet; an inline 0 by 0 here
    drew the tile with no arcs at all, measured on the first screenshot */
 return '<span class="kbt-fx"'+(px?' style="width:'+px+'px;height:'+px+'px"':'')+'><svg viewBox="0 0 100 100" aria-hidden="true">'+o
  +'<svg x="30" y="30" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="'+KBT_FORMULA+'" stroke-width="1.5" '
  +'stroke-linecap="round" stroke-linejoin="round">'+glyphPath(KBT_SIGMA)+'</svg></svg></span>';}
var KBT_SIGMA='M18 5H6l6 7-6 7h12';
/* a family heading's ring: the same closing ring, small, in the band's
   colour, with the family's own mark inside it. The ring said how far the
   family was read and nothing said which family it was until the words, so
   the heading led with its name and not its symbol, 21 November: symbol
   first, header second. */
function kbtHeadRing(a,t){
 var col=seatCol(kbtSeatOf(kbtOf(a)[0])), r=11, C=2*Math.PI*r, f=t.per[a].k/t.per[a].n;
 var ic=(HARM_FAM[a]||{}).ic;
 return '<svg class="kbt-hr" viewBox="0 0 24 24" aria-hidden="true">'
  +'<circle cx="12" cy="12" r="'+r+'" fill="none" stroke="'+col+'" stroke-opacity=".32" stroke-width="1.2"/>'
  +'<circle class="kbt-hf" cx="12" cy="12" r="'+r+'" fill="none" stroke="'+col+'" stroke-width="1.5" stroke-linecap="round" '
  +'stroke-dasharray="'+C.toFixed(2)+'" stroke-dashoffset="'+(C*(1-f)).toFixed(2)+'" transform="rotate(-90 12 12)"/>'
  +(ic?'<svg x="6" y="6" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="'+col+'" stroke-width="1.8" '
   +'stroke-linecap="round" stroke-linejoin="round">'+glyphPath(ic)+'</svg>':'')+'</svg>';}

/* ---------- the order a person reads in ---------- */
/* NEXT IS HARM'S OWN ORDER, 21 November, his words: "at the end of each one,
   it lights up the next one or allows you to go to the next one." A family
   is read through in its own order and the last law of one family hands on
   to the first of the next, which is E01 to E76 exactly, because HARM is
   written family by family. The frame, E75 and E76, comes last, and that is
   the book's argument and not an accident of the list: meta awareness and
   coherence are the laws about all the others. After E76 the next thing is
   the formula itself, what the seventy six add up to, so the sequence closes
   into a circle and never ends on a last page. The formula's own next is the
   first law not yet read, so a person who comes back is handed where they
   stopped and not sent to E01 again. */
function kbtNextOf(c){
 if(c==='cq'||!c){
  var u=HARM.filter(function(e){return !kbtIsSeen(e.c);})[0];
  return (u||HARM[0]).c;}
 for(var i=0;i<HARM.length;i++)if(HARM[i].c===c)return (i+1<HARM.length)?HARM[i+1].c:'cq';
 return HARM[0].c;}

/* ---------- markup ---------- */
function kbtTile(e,frame){
 var seat=kbtSeatOf(e), col=seatCol(seat), seen=kbtIsSeen(e.c), un=kbtUnconfirmed(e), sub=kbtSub(e);
 var lbl=e.c+', '+e.t+(sub?', '+sub:'')+', '+kbtFamName(e.a)+(un?', not yet confirmed in the book':'')+(seen?', read':', not read');
 return '<button type="button" class="kbt-t'+(frame?' kbt-fr':'')+(un?' kbt-un':'')+(seen?' kbt-seen':'')+'" data-kbtc="'+esc(e.c)+'" '
  +'aria-label="'+esc(lbl)+'" style="--c:'+col+'">'
  +'<span class="kbt-c">'+esc(e.c)+'</span>'
  +kbtRing(kbtIcOf(e),col,seen,48)
  +'<span class="kbt-n" lang="en">'+kbtName(e.t)+'</span>'
  +(sub?'<span class="kbt-s">'+esc(sub)+'</span>':'')
  /* THE DASHED OUTLINE SAID WHAT IT MEANT ONLY ON HOVER. The line was a
     tooltip, so on a phone, where nothing hovers, three tiles were drawn
     differently and nothing on the screen said why, which is a symbol left
     unpacked. The line sits on the tile now and the tooltip is gone, so it is
     said once, in the one place every device reads. */
  +(un?'<span class="kbt-s kbt-uc">Not yet confirmed in the book</span>':'')+'</button>';}
/* AN ACHIEVEMENT IS SHOWN WHEN IT IS EARNED, AND NOT BEFORE. The first cut
   listed all three from the first visit, dimmed, with "0" and "Not yet" in
   them, which is a locked reward drawn as a tease: the product has no
   padlocks and no dead states, so a tier nobody has reached is not on the
   screen at all. A fresh board shows the count and nothing under it. The
   tooltips stay, because a tier name is a label and its meaning goes with it. */
function kbtTiers(t){
 var o='';
 if(t.unlocked)o+='<li class="kbt-tier on" data-tip-k="Families unlocked" data-tip="A family opens when you read its first law." tabindex="0">'
  +'<span class="kbt-tl">Families unlocked</span><span class="kbt-tv">'+t.unlocked+'</span></li>';
 if(t.done)o+='<li class="kbt-tier on" data-tip-k="Families read" data-tip="Every law in the family read. Its heading ring closes." tabindex="0">'
  +'<span class="kbt-tl">Families read</span><span class="kbt-tv">'+t.done+'</span></li>';
 if(t.grand)o+='<li class="kbt-tier on" data-tip-k="The formula closed" data-tip="All seven arcs on the formula are closed: every family is read." tabindex="0">'
  +'<span class="kbt-tl">The formula closed</span></li>';
 return o?'<ul class="kbt-tiers">'+o+'</ul>':'';}
/* THE FORMULA, WRITTEN OUT, 21 November, his words: "for the coherence
   formula, write it out. Coherence equals intention times integrity divided
   by resistance." It is the engine's own formula, DESIGN-quotients.md's
   "(Intention x Integrity) / Resistance", said in words and not symbols. The
   line breaks on the division, so the two lines read as the fraction does. */
var KBT_SAY=['Coherence equals intention times integrity','divided by resistance.'];
/* NO COUNT AGAINST A TOTAL ON THE BOARD, 21 November. The first cut printed
   "0 of 76 read", "0 of 7" for the families and "0 of 13" on each band, and
   tests/functional.js's count gate refused all of them at both widths: a
   tally against the size of a set is the score out of a possible score that
   ruling bans, and the brief's own cut list already named "of 76 read". So
   the board says how many were read and stops; how far there is to go is
   what the rings and the formula's arcs already draw. The aria-labels keep
   the whole sentence for a screen reader, which is not printed copy. */
/* THE QUOTIENT COLUMN, 21 November, his words: "I want the quotients
   vertically along its own column, but within the same column as the main
   sets of cells." It is the first column of the table's own grid, so its top
   is the frame row's top and its gaps are the tiles' gaps. The quotients
   measure the person and the laws are reference, so a quotient card takes
   the accent and a law tile takes its seat. Only CQ is drawn: IQ, EQ, AQ and
   PQ are named in the book and not yet measured, and an empty slot for each
   would be four dead cards.

   AND THE LEFT CARD IS GONE. It held "0 read" and "Open any tile to read it.
   Its ring closes." and he ruled it out by name, "this text box that says
   red, open any file, get rid of that", which is speech to text for that
   card's "0 read" and "Open any tile". The instruction went with it; the
   count did not, because it is the one place a person sees how much they
   have read, so it sits under the formula in this column, with the tiers
   under it once one is earned. */
function kbtQuot(t){
 return '<div class="kbt-q">'
  +'<button type="button" class="kbt-f'+(t.grand?' kbt-grand':'')+'" data-kbtc="cq" '
  +'aria-label="The coherence formula, '+t.done+' of '+t.fams.length+' arcs closed. '+esc(KBT_SAY.join(' '))+'">'
  +kbtArcs(t,0)+'<span class="kbt-fn">The coherence formula</span>'
  +'<span class="kbt-fs">'+esc(KBT_SAY[0])+'<br>'+esc(KBT_SAY[1])+'</span></button>'
  +'<div class="kbt-sc" data-tip-k="Read" data-tip="Each tile is one universal law. Its code, E01 to E'
  +HARM.length+', is its place in the book\'s own table. Open a tile and its ring closes." tabindex="0">'
  +'<span class="kbt-scn"><b>'+t.n+'</b> read</span></div>'
  +kbtTiers(t)+'</div>';}
/* THE FILM IS A LINK OUT, AND ONLY THAT, 21 November. It said "A film of
   this law exists. It is not attached yet." over ten films that are real
   files with real ids in HARM_FILM, which told a person there was something
   to watch and gave them no way to watch it. The link opens the Drive file
   in a new tab on the person's own press. Nothing is fetched by this page,
   nothing is embedded and no player is drawn: the standing rule for this
   content, and design.js gate 7, which fails on any request the page makes,
   still hold, because a link that is not followed makes none. Whether the
   file opens for someone who is not signed in to the owner's Drive is the
   file's sharing setting, not this page's. */
function kbtFilm(c){
 var f=KBT_FILM[c]; if(!f||!f.id)return '';
 return '<a class="kbt-film" href="https://drive.google.com/file/d/'+encodeURIComponent(f.id)+'/view" target="_blank" rel="noopener noreferrer">'
  +'<span class="kbt-fi" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
  +'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z M10 9.5v5l4-2.5z"/></svg></span>'
  +'<span class="kbt-flt"><b>Watch the film of this law</b><span>Opens in Google Drive, in a new tab</span></span></a>';}
/* the one action at the foot of the rail: the next law, by its own mark and
   name, so a person sees where they are going before they press */
function kbtNextBtn(c){
 var n=kbtNextOf(c);
 if(n==='cq')return '<div class="ins-rel"><button type="button" class="kbt-nx" data-kbtnext="cq">'
  +svgI(glyphPath(KBT_SIGMA))+'Next: the coherence formula</button></div>';
 var e=HARM.filter(function(x){return x.c===n;})[0]; if(!e)return '';
 return '<div class="ins-rel"><button type="button" class="kbt-nx" data-kbtnext="'+esc(n)+'" style="--c:'+seatCol(kbtSeatOf(e))+'">'
  +svgI(glyphPath(kbtIcOf(e)))+'Next: '+esc(e.c)+' '+esc(e.t)+'</button></div>';}
/* THE RIGHT RAIL IS THE SUMMARY, 21 November, his words: "Keep the right
   rail, but turn that into a summary. We can use that as the output of each
   button. So if I click on all is one, the insight panel gives me all the
   information for that. So that kind of keeps the same consistent logic."

   So it is built out of the Field's Insight panel (railInsight,
   ui/insightui.js) and not beside it: the same identity row, a ring with the
   mark in the colour of what is selected and the name and its kind under
   it, the same reading block and page, and one action at the foot. Its
   classes are that panel's, so a change to the Insight panel's look reaches
   this rail too. What it does not borrow is the Source AI mark: the text
   here is the book's own, not a sentence Source AI composed, and his 15
   November ruling keeps that mark for Source AI's words only.

   It replaces two places for one answer. The panel used to show the opening
   eight words of a law (kbtOne) with "Open the full card" under it, which
   opened the whole text in an overlay over the page. The rail is the card
   now: the whole text, the film, and Next. And it is never empty: with no
   law open it carries the formula, what the laws add up to, and Next hands
   a person their first unread law, which is the step one fix for a first
   visit that landed on an empty panel and stopped. */
function kbtRail(c){
 if(!c||c==='cq'){
  var r=compute(), cq=(!kbUnread()&&r.answered)?pct('cq',r.CQ):null;
  return '<div class="ins-id" style="--c:'+KBT_FORMULA+'">'
   +'<span class="ins-ring" aria-hidden="true">'+svgI(glyphPath(KBT_SIGMA))+'</span>'
   +'<span class="ins-idt"><span class="ins-nm">The coherence formula</span>'
   +'<span class="ins-kd">What the laws add up to</span></span>'
   +(cq!=null?'<span class="ins-fg">'+cq+'%</span>':'')+'</div>'
   +'<div class="ins-rd"><div class="ins-pgs"><div class="ins-pg" data-on="1">'
   +'<p class="ins-p kbt-say"><b>'+esc(KBT_SAY.join(' '))+'</b></p>'
   +'<p class="ins-p">Your '+unp('CQ','CQ, the coherence quotient')+' is that sum: '+SI.length
   +' laws of moral integrity, each 0 to 10, added up and read as a percent of the most they can hold.</p>'
   +(cq!=null?'':'<p class="ins-p kbt-dim2">It fills as you answer the laws.</p>')
   +'</div></div></div>'
   +kbtNextBtn('cq');}
 var e=HARM.filter(function(x){return x.c===c;})[0]; if(!e)return '';
 var col=seatCol(kbtSeatOf(e)), line=kbtFamLine(e.a), sub=kbtSub(e);
 var mine=(e.a==='spirit'&&S.law&&S.law[e.t]!=null&&(typeof lawIn!=='function'||lawIn(e.t)))?kbPct(S.law[e.t]):null;
 return '<div class="ins-id" style="--c:'+col+'">'
  +'<span class="ins-ring" aria-hidden="true">'+svgI(glyphPath(kbtIcOf(e)))+'</span>'
  +'<span class="ins-idt"><span class="ins-nm">'+esc(e.t)+(sub?', '+esc(sub):'')+'</span>'
  +'<span class="ins-kd">'+esc(e.c)+' · '+esc(kbtFamName(e.a))+(line?', '+esc(line):'')+'</span></span>'
  +(mine!=null?'<span class="ins-fg" data-tip-k="Yours" data-tip="How you keep this law, from your answers." tabindex="0">'+mine+'%</span>':'')+'</div>'
  +'<div class="ins-rd"><div class="ins-pgs"><div class="ins-pg" data-on="1">'
  +'<p class="ins-p">'+esc(e.d)+'</p>'
  +(kbtUnconfirmed(e)?'<p class="ins-p kbt-dim2">Not yet confirmed in the book.</p>':'')
  +(e.ch?'<p class="ins-p kbt-dim2">'+esc(e.ch)+' of the book.</p>':'')
  +'</div></div></div>'
  +kbtFilm(c)
  +kbtNextBtn(c);}
function kbtHtml(){
 var t=kbtTally(), cur=KBT.open||'cq';
 var h='<div class="kbt-w"><section class="kbt" id="kbt" aria-label="The table of universal laws">'
  +kbtQuot(t)
  +'<div class="kbt-laws">'
  +'<div class="kbt-frame">'
  +HARM.filter(function(e){return e.a==='meta';}).slice().reverse().map(function(e){return kbtTile(e,true);}).join('')
  /* the third law of the frame is not named, and the cell says so rather
     than holding a guess. It is not a tile: nothing opens and nothing counts. */
  +'<div class="kbt-t kbt-fr kbt-tbn" aria-label="A third law of the frame, to be named"><span class="kbt-n">To be named</span></div>'
  +'</div>';
 t.fams.filter(function(a){return a!=='meta';}).forEach(function(a){
  var line=kbtFamLine(a), p=t.per[a];
  h+='<div class="kbt-band" data-kbtb="'+esc(a)+'">'
   +'<div class="kbt-bh'+(p.k?' on':'')+(p.k===p.n?' done':'')+'">'+kbtHeadRing(a,t)
   +'<span class="kbt-bn">'+esc(kbtFamName(a))+'</span>'+(line?'<span class="kbt-bl">'+esc(line)+'</span>':'')
   +'<span class="kbt-bk">'+p.k+' read</span></div>'
   +'<div class="kbt-g">'+kbtOf(a).map(function(e){return kbtTile(e,false);}).join('')+'</div></div>';});
 h+='</div>'
  +'<aside class="kbt-rail'+(cur==='cq'?' kbt-rcq':'')+'" id="kbtrail" aria-live="polite" aria-label="Summary of what is open">'+kbtRail(cur)+'</aside>';
 return h+'</section></div>';}

/* ---------- behaviour ---------- */
/* the rail, written in place, and the tile its Next names lit. Focus is put
   back on Next when Next was the press, so a keyboard can read the whole
   table by pressing one key over and over. */
function kbtPanel(c,refocus){
 var d=document.getElementById('kbtrail'); if(!d)return;
 d.innerHTML=kbtRail(c||'cq');
 d.classList.toggle('kbt-rcq',!c||c==='cq');
 kbtLight(c);
 kbtPanelWire();
 if(refocus){var n=d.querySelector('[data-kbtnext]'); if(n){try{n.focus({preventScroll:true});}catch(e){n.focus();}}}}
/* THE NEXT ONE LIGHTS UP. Its ring track goes from faint to whole and its
   outline to its own seat colour, never the alarm colour. Only the light is
   built here: how it moves is the animation seat's, in the round after this
   one. */
function kbtLight(c){
 var b=document.getElementById('kbt'); if(!b)return;
 var n=kbtNextOf(c||'cq');
 b.querySelectorAll('[data-kbtc]').forEach(function(el){el.classList.toggle('kbt-next',el.getAttribute('data-kbtc')===n);});}
function kbtPanelWire(){
 var d=document.getElementById('kbtrail'); if(!d)return;
 var nx=d.querySelector('[data-kbtnext]');
 if(nx)nx.onclick=function(){
  var c=nx.getAttribute('data-kbtnext');
  var tile=document.querySelector('#kbt [data-kbtc="'+c+'"]');
  kbtOpen(c,tile,true);
  /* the law it opened may be a band further down; it is brought into view
     so the lit ring and the summary beside it are the same law */
  if(tile){try{tile.scrollIntoView({block:'nearest'});}catch(e){}}};}
/* the open tile's ring, the band heading, the formula's arcs and the count,
   repainted in place so a closing ring transitions rather than snapping with
   a rewrite */
function kbtRepaint(){
 var b=document.getElementById('kbt'); if(!b)return;
 var t=kbtTally();
 b.querySelectorAll('.kbt-t[data-kbtc]').forEach(function(el){
  var s=kbtIsSeen(el.getAttribute('data-kbtc')), f=el.querySelector('.kbt-rf');
  el.classList.toggle('kbt-seen',s);
  if(f)f.setAttribute('stroke-dashoffset',s?'0':f.getAttribute('stroke-dasharray'));
  var l=el.getAttribute('aria-label')||''; el.setAttribute('aria-label',l.replace(/, (not )?read$/,s?', read':', not read'));});
 b.querySelectorAll('[data-kbtb]').forEach(function(el){
  var a=el.getAttribute('data-kbtb'), p=t.per[a], hd=el.querySelector('.kbt-bh'), hf=el.querySelector('.kbt-hf');
  hd.classList.toggle('on',p.k>0); hd.classList.toggle('done',p.k===p.n);
  el.querySelector('.kbt-bk').textContent=p.k+' read';
  if(hf){var C=parseFloat(hf.getAttribute('stroke-dasharray')); hf.setAttribute('stroke-dashoffset',(C*(1-p.k/p.n)).toFixed(2));}});
 var fx=b.querySelector('.kbt-f'); if(fx){
  fx.querySelector('.kbt-fx').outerHTML=kbtArcs(t,0); fx.classList.toggle('kbt-grand',t.grand);
  fx.setAttribute('aria-label','The coherence formula, '+t.done+' of '+t.fams.length+' arcs closed. '+KBT_SAY.join(' '));}
 var sc=b.querySelector('.kbt-sc b'); if(sc)sc.textContent=t.n;
 var q=b.querySelector('.kbt-q'), tl=q&&q.querySelector('.kbt-tiers');
 if(q){var nt=kbtTiers(t); if(tl)tl.outerHTML=nt||''; else if(nt)q.insertAdjacentHTML('beforeend',nt);}}
/* A PRESS WRITES THE RAIL. The grid no longer dims under an open panel: the
   rail is beside it for good now, so dimming seventy five tiles on every
   press would draw the board as switched off while the person is still
   reading it, and the open tile's own outline already says which one is
   open. */
function kbtOpen(c,tile,refocus){
 KBT.open=c; KBT.hover=null;
 var b=document.getElementById('kbt'); if(!b)return;
 if(c!=='cq'&&!kbtIsSeen(c)){
  var kept=kbtMark(c);
  if(!kept&&typeof status==='function')status('Read on this visit. This browser is not keeping it.');}
 b.querySelectorAll('[data-kbtc]').forEach(function(el){el.classList.toggle('kbt-on',el.getAttribute('data-kbtc')===c);
  if(el.getAttribute('data-kbtc')===c)el.setAttribute('aria-expanded','true'); else el.removeAttribute('aria-expanded');});
 kbtRepaint(); kbtPanel(c,refocus);}
/* closing hands the rail back to the formula, and focus back to the tile
   that opened it, so a keyboard is put back exactly where it was */
function kbtClose(focus){
 var c=KBT.open; if(!c)return; KBT.open=null;
 var b=document.getElementById('kbt'); if(!b)return;
 b.querySelectorAll('.kbt-on').forEach(function(el){el.classList.remove('kbt-on'); el.removeAttribute('aria-expanded');});
 kbtPanel(null);
 var t=b.querySelector('[data-kbtc="'+c+'"]');
 if(focus&&t){try{t.focus({preventScroll:true});}catch(e){t.focus();}}}
function kbtWire(){
 var b=document.getElementById('kbt'); if(!b)return;
 b.querySelectorAll('[data-kbtc]').forEach(function(el){
  var c=el.getAttribute('data-kbtc');
  /* the press is the rail's own, railPick in ui/railmotion.js, after the
     open so it lands on the tile the person sees; kind 'kb' has no caption */
  el.onclick=function(){if(KBT.open===c)kbtClose(true); else kbtOpen(c,el);
   if(typeof railPick==='function')railPick(el,'kb');};});
 b.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&KBT.open){ev.stopPropagation(); kbtClose(true);}});
 kbtLight(KBT.open);
 kbtPanelWire();
 kbtEnter(b);}
/* THE ENTRANCE IS THE RAIL'S, once a session. rmCascade (ui/railmotion.js)
   already brings a grid of tiles up out of .8 with one overshoot, row by row
   on the wheel's stagger; the board is a grid of tiles, so it is handed the
   ones on screen and nothing new is written. Nothing here loops and nothing
   runs again after the first sight, and reduced motion gets the end state. */
function kbtEnter(b){
 if(KBT.seen)return; KBT.seen=true;
 if(rbStill()||typeof rmCascade!=='function')return;
 var items=[];
 b.querySelectorAll('.kbt-f,.kbt-t,.kbt-bh').forEach(function(el){var r=el.getBoundingClientRect();
  if(r.width&&r.top<innerHeight&&r.bottom>0)items.push({el:el,r:r,tile:!el.classList.contains('kbt-bh')});});
 rmCascade(items,ENTER_STAGGER,0,8);}

/* the board's own sheet, injected beside kbsCss for the same reason */
function kbtCss(){
 if(document.getElementById('kbt-css'))return;
 var st=document.createElement('style'); st.id='kbt-css';
 st.textContent=[
  /* LEFT JUSTIFIED, AND ONE LEFT EDGE, 21 November, his words: "I want it
     left. The whole thing left justified." Three columns of one grid: the
     quotients, the laws and the summary rail, each gap the tiles' own gap.
     The lopsided look the centred board had was not the centring of the
     whole, it was justify-content:center on every row, so a band whose last
     row was part full floated that row in the middle and every band started
     at its own left edge. Every row now starts at the column's edge.

     The board measures itself off its own width (cqw, against .kbt-w): ten
     tiles of up to 104 across the quotients and the laws, and the rail at
     340, so a narrower pane shrinks the tiles before anything wraps. */
  '.kbt-w{container-type:inline-size;margin:0 0 28px}',
  '.kbt{--kg:16px;--kr:340px;--kt:clamp(64px,calc((100cqw - var(--kr) - var(--kg)*10)/10),104px);',
  ' display:grid;grid-template-columns:calc(var(--kt)*2 + var(--kg)) calc(var(--kt)*8 + var(--kg)*7) var(--kr);',
  ' gap:var(--kg);justify-content:start;align-items:start;margin:0}',
  '.kbt-laws{display:flex;flex-direction:column;gap:var(--kg);min-width:0}',
  /* the quotient column: the formula card, the count, then any tier earned */
  '.kbt-q{display:flex;flex-direction:column;gap:12px;min-width:0}',
  '.kbt-sc{font-size:15px;color:var(--dim);padding:0 4px}',
  '.kbt-sc b{font-size:22px;font-weight:600;color:var(--ink);margin-right:2px}',
  '.kbt-tiers{list-style:none;margin:0;padding:0 4px;display:flex;flex-direction:column;gap:8px}',
  '.kbt-tier{display:flex;justify-content:space-between;gap:12px;font-size:13px;color:var(--dim)}',
  '.kbt-tier.on{color:var(--ink)}',
  '.kbt-tv{font-variant-numeric:tabular-nums}',
  /* the quotient card. The accent at 12% with a solid 1.5 ring: a quotient
     measures the person and a law is reference, so they take different
     light, and the same radius and gap keep them one structure */
  '.kbt-f{all:unset;box-sizing:border-box;cursor:pointer;width:100%;display:flex;flex-direction:column;align-items:center;gap:10px;',
  ' padding:16px 14px;border-radius:var(--r-xs);background:color-mix(in srgb,'+KBT_FORMULA+' 12%,var(--panel));',
  ' box-shadow:inset 0 0 0 1.5px color-mix(in srgb,'+KBT_FORMULA+' 55%,transparent);text-align:center}',
  '.kbt-f .kbt-fx{width:56%;height:auto;aspect-ratio:1}',
  '.kbt-fx{display:block}.kbt-fx>svg{display:block;width:100%;height:100%}',
  '.kbt-fn{font-size:15px;font-weight:600;color:var(--ink)}',
  '.kbt-fs{font-size:14px;font-weight:500;line-height:1.4;color:var(--ink)}',
  '.kbt-f.kbt-grand,.kbt-f.kbt-on,.kbt-f.kbt-next{box-shadow:inset 0 0 0 1.5px '+KBT_FORMULA+'}',
  /* THE RAIL. Its inside is the Insight panel's own classes; the frame is
     the Insight panel's frame, the sunk ground, the second edge and the
     small radius, at the same 16 between blocks. Sticky, so the summary
     stays beside whichever band a person has scrolled to. At top 0 and not
     16: the scroller's own padding is already taken off the sticky edge, so
     16 stood the rail 16 pixels below the quotient card beside it, measured
     at 1600, where the two tops are one line. */
  '.kbt-rail{position:sticky;top:0;box-sizing:border-box;display:flex;flex-direction:column;gap:16px;min-width:0;',
  ' padding:14px;border:1px solid var(--edge-2);border-radius:var(--r-s);background:var(--sunk);',
  ' box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}',
  '.kbt-rail .ins-nm{white-space:normal}',
  '.kbt-say b{font-weight:600}',
  '.kbt-dim2{color:var(--dim)}',
  '.kbt-film{display:flex;align-items:center;gap:10px;min-height:var(--tap);box-sizing:border-box;font-size:13px;color:var(--dim);',
  ' padding:8px 12px;border:1px solid var(--edge-2);border-radius:var(--r-xs);text-decoration:none}',
  '.kbt-film:hover{border-color:var(--ink)}',
  '.kbt-film:focus-visible{outline:2px solid var(--ink);outline-offset:2px}',
  '.kbt-flt{display:flex;flex-direction:column;gap:2px}.kbt-flt b{font-weight:500;color:var(--ink)}',
  '.kbt-fi{display:inline-flex;flex:0 0 auto;width:20px;height:20px;color:var(--ink)}.kbt-fi svg{width:100%;height:100%}',
  /* Next is the Insight panel's one action, its ring pill, with the next
     law's own mark in the next law's own colour */
  '.kbt-nx{min-height:var(--tap);max-width:100%;padding:0 20px;border-radius:999px;border:1.5px solid var(--c,var(--accent));',
  ' background:transparent;color:var(--ink);font-family:var(--sans);font-size:14px;font-weight:600;cursor:pointer;',
  ' display:inline-flex;align-items:center;gap:8px;text-align:left}',
  '.kbt-nx svg{flex:0 0 auto;width:18px;height:18px;fill:none;stroke:var(--c,var(--accent));stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
  '.kbt-nx:hover{background:color-mix(in srgb,var(--c,var(--accent)) 14%,transparent)}',
  '.kbt-nx:focus-visible{outline:2px solid var(--ink);outline-offset:2px}',
  /* the rows. flex from the left edge, never centred: see the head of this sheet */
  '.kbt-frame,.kbt-g{display:flex;flex-wrap:wrap;justify-content:flex-start;gap:var(--kg)}',
  '.kbt-band{display:flex;flex-direction:column;gap:12px}',
  '.kbt-bh{display:flex;align-items:center;gap:8px;min-height:24px;color:var(--dim);font-size:13px}',
  '.kbt-bh.on .kbt-bn{color:var(--ink)}',
  '.kbt-hr{width:24px;height:24px;flex:0 0 auto}',
  '.kbt-bn{font-size:14px;font-weight:600}',
  '.kbt-bl{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
  '.kbt-bk{margin-left:auto;font-variant-numeric:tabular-nums}',
  /* the tile: code top left, the mark at 40 centred inside its read ring, the
     name at 13 in ink, which carries its contrast on the tint at every seat */
  '.kbt-t{all:unset;box-sizing:border-box;position:relative;cursor:pointer;width:var(--kt);',
  ' min-width:44px;min-height:max(44px,var(--kt));display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:4px;',
  ' padding:15px 6px 6px;border-radius:var(--r-xs);background:color-mix(in srgb,var(--c) 12%,var(--panel));',
  ' outline:1px solid color-mix(in srgb,var(--c) 40%,transparent);outline-offset:-1px;text-align:center}',
  '.kbt-t:focus-visible,.kbt-f:focus-visible{outline:2px solid var(--ink);outline-offset:2px}',
  '.kbt-un{outline-style:dashed}',
  '.kbt-c{position:absolute;top:5px;left:7px;font-size:11px;letter-spacing:.02em;color:var(--dim);font-variant-numeric:tabular-nums}',
  '.kbt-sy{position:relative;display:grid;place-items:center;flex:0 0 auto}',
  '.kbt-sy>svg{position:absolute;inset:0;width:100%;height:100%}',
  '.kbt-sy>.kbt-gl{inset:auto;position:static;width:calc(100% - 8px);height:calc(100% - 8px)}',
  '.kbt-rf{transition:stroke-dashoffset .4s cubic-bezier(.22,1,.36,1)}',
  '.kbt-hf{transition:stroke-dashoffset .4s cubic-bezier(.22,1,.36,1)}',
  '.kbt-n{font-size:13px;line-height:1.15;color:var(--ink);hyphens:manual;overflow-wrap:break-word;max-width:100%}',
  '.kbt-s{font-size:11px;color:var(--dim);line-height:1.1}',
  '.kbt-uc{line-height:1.2;max-width:100%}',
  /* the frame row is one and a half */
  '.kbt-fr{width:calc(var(--kt)*1.5);max-width:calc((100% - var(--kg)*2)/3);min-height:calc(var(--kt)*1.2)}',
  '.kbt-tbn{cursor:default;justify-content:center;background:transparent;outline:1px dashed var(--edge-2)}',
  '.kbt-tbn .kbt-n{color:var(--dim)}',
  '.kbt-on{outline-width:1.5px;outline-color:var(--c)}',
  /* the next one, lit: its track whole and its outline its own colour */
  '.kbt-t.kbt-next{outline-width:1.5px;outline-color:var(--c)}',
  '.kbt-next .kbt-rt{stroke-opacity:1}',
  '@media (prefers-reduced-motion:reduce){.kbt-rf,.kbt-hf{transition:none}}',
  'body.quiet .kbt-rf,body.rm .kbt-rf,body.quiet .kbt-hf,body.rm .kbt-hf{transition:none}',
  /* .kbt-rg, .kbt-arc, .kbt-scn and .kbt-tl name parts the draw code and the
     gates find (the read ring, the formula's seven arcs, the count, the tier
     label) and carry no look of their own; the look is the parent's. Named
     here so the design gate's coverage check, which reads a class only off a
     selector that names it, finds them, the way .gate-r is named in
     shell/head.html. */
  '.kbt-rg{}.kbt-arc{}.kbt-scn{}.kbt-tl{}',
  /* NARROWER THAN THREE COLUMNS HOLD, the rail leaves the row and becomes a
     sheet held at the foot of the screen while the table scrolls under it,
     the same markup, so a press still answers where the person is looking.
     The overrides are scoped under .kbt and not written as bare classes:
     tests/design.js's "declared twice with geometry" check walks @container
     rules and reads a bare class declared a second time as a second claim on
     the word. */
  '@container (max-width:1140px){',
  ' .kbt{--kt:clamp(64px,calc((100cqw - var(--kg)*9)/10),104px);grid-template-columns:calc(var(--kt)*2 + var(--kg)) calc(var(--kt)*8 + var(--kg)*7)}',
  ' .kbt .kbt-rail{grid-column:1/-1;position:sticky;top:auto;bottom:0;max-height:42vh;overflow-y:auto;',
  '  box-shadow:0 -12px 32px rgba(0,0,0,.35)}}',
  /* a phone: four of up to 104 with 12 between, 80 at 390, the formula card across the top in
     a row of its own, and the sheet under the laws */
  '@container (max-width:800px){',
  ' .kbt{--kt:min(104px,calc((100cqw - 36px)/4));--kg:12px;grid-template-columns:calc(var(--kt)*4 + var(--kg)*3)}',
  ' .kbt .kbt-f{flex-direction:row;text-align:left;align-items:center;flex-wrap:wrap;column-gap:14px}',
  ' .kbt .kbt-f .kbt-fx{width:72px;flex:0 0 72px}',
  ' .kbt .kbt-fn{flex:1 1 0}',
  ' .kbt .kbt-fs{flex:1 1 100%}',
  ' .kbt .kbt-t{padding:15px 4px 7px;min-height:118px}',
  ' .kbt .kbt-fr{min-height:112px}',
  ' .kbt .kbt-rail{max-height:38vh}',
  /* the sheet with no law open is the formula a second time, the card at
     the head of the page already says it in full, so on a phone it is only
     where the formula hands on to, and it stops covering a third of the
     table a person arrived to look at, measured at 390 */
  ' .kbt .kbt-rcq .ins-rd{display:none}',
  ' .kbt-bl{display:none}}',
  /* STACKED, THE PAGE SCROLLS AND NOT #know. Below 1181 the columns stack
     and #know grows to its content, so it never scrolls, but its
     overflow-y:auto (shell/head.html, TAB VISIBILITY) still makes it the
     scroll container a sticky child is held against, and the sheet sat at
     the foot of the table, 3,580 pixels down a phone, while a press wrote
     into it: measured at 390, #know scrollHeight equal to its clientHeight.
     visible here changes nothing a person sees, because a box that never
     overflows clips nothing, and hands the sheet to the scroller that
     moves. */
  '@media (max-width:1180px){body.tab-know #know{overflow-y:visible}}'
 ].join('\n');
 document.head.appendChild(st);}
