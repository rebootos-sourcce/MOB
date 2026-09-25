
/* ============================================================
   THE KNOWLEDGE BASE. Everything the instrument knows, in one
   place, searchable, and every row a door to the same drill the
   wheel opens. Nothing here is a second copy of the data: it
   reads the engine tables directly, so the knowledge base and
   the reading can never disagree.

   The Letting Go Deck sits underneath it. The book specifies it
   as a playing card deck whose suits are the seats and whose
   ranks are intensity. It deals from the person's own held
   addresses, so a card is a thing they are actually carrying.
   ============================================================ */
var KB_Q='', KB_SEC='addr';

/* every searchable thing in the instrument, built from the engine tables.
   kind decides which drill a row opens. */
/* a glossary term matched, case insensitively, to the thing it names. The
   tables are searched in the order a collision should resolve: a law before a
   fetter before a hypercomplex before a seat, because a word that is both is
   the law first in this system. Returns null when the term is only a word. */
function glossHit(t){
 var q=String(t||'').toLowerCase(), i;
 for(i=0;i<SI.length;i++)if(SI[i].nm.toLowerCase()===q)return {o:SI[i],b:SI[i].b};
 for(i=0;i<CHILD.length;i++)if(CHILD[i].nm.toLowerCase()===q)return {o:CHILD[i],b:CHILD[i].seat};
 for(i=0;i<HCX_LIB.length;i++)if(HCX_LIB[i].nm.toLowerCase()===q)return {o:HCX_LIB[i],b:HCX_LIB[i].b};
 for(i=0;i<MASKS.length;i++)if(MASKS[i].nm.toLowerCase()===q)return {o:MASKS[i],b:MASKS[i].b[0]};
 return null;}
/* an open book. a definition, and nothing claimed beyond one. */
var GLOSS_IC='M3 5h7a2 2 0 012 2v12a2 2 0 00-2-2H3z M21 5h-7a2 2 0 00-2 2v12a2 2 0 012-2h7z';
function glossMark(t){var h=glossHit(t); return (h&&h.o.ic)||GLOSS_IC;}
function glossBand(t){var h=glossHit(t); return (h&&h.b)||'3rd Eye';}

/* ============================================================
   THE ROW IS FOUR THINGS. Ruled by the owner, and it is tight
   enough to build from: the icon, the percent it is impacting
   the person, the word, and what it is associated with.

     "what we need to see is just these atomised: the icon, the
      percent it is impacting you, and the word, and the chakra
      that is associated with it"

   and one sentence later, which is the correction that matters:

     "This should be mainly icon, percent you actually do it,
      and what it is associated with, like rigidity or collapse."

   Rigidity and Collapse are not chakras. They are two of the six
   architectures a saboteur belongs to. So the fourth thing is the
   row's FAMILY, and the family's seat is the colour. For seven
   decks the family is a seat and the word is the seat's name,
   which is what he asked for first. For four it is not, and the
   word says the useful thing while the colour still says the
   seat, so the colour system never bends.

   Measured against the card this replaced, at 1600 and at 390,
   counted in a screenshot rather than predicted: twelve rows
   above the fold became thirty nine, and one became six.
   ============================================================ */
/* a row: t is the word, s is the family, seat is the band that colours it,
   p is the percent or null when there is no honest one, ic is the mark. */
function kbRow(k,t,s,seat,p,ic,o,col){
 return {k:k, t:t, s:s, seat:seat, p:p, ic:ic, o:o, col:col||null};}
/* 0 to 10 becomes 0 to 100. Every reading in this engine that is bounded runs
   on the same scale, so one conversion serves nine of the eleven decks. */
function kbPct(v){return Math.max(0,Math.min(100,Math.round((v||0)*10)));}
function kbPct100(v){return Math.max(0,Math.min(100,Math.round((v||0)*100)));}
function kbFind(a,nm){for(var i=0;i<a.length;i++)if(a[i].nm===nm)return a[i];return null;}

function kbRows(sec){
 var r=compute(), out=[];
 /* THE DECK CARRIES ALL 112, NOT THE 108 IT USED TO.

    W is the 108 somatic addresses, built in core.js by filtering NODES down
    to the seven seats. The four field anchors carry Field-Above and
    Field-Below, which are not seats, so they fell out of W and appeared
    nowhere in the codex: the deck that exists to list every address was
    showing 108 of the 112 the product states. A deck chip counting its own
    rows would have printed 108 to a person, which is a standing ruling
    against. The four come in. They printed an en dash while the engine forced
    their sq to 0; since 25 September each takes the mean of the seat it
    extends and counts in DQ, so it prints its figure like the other 108.

    AND THE MARK IS COMPOSED. 108 named nodes wore seven marks between them,
    15.4 rows to a mark, which is the icon rule inverted: if it has a name it
    has an icon. Nobody is drawing 108 marks and nobody has to. Every node
    already states its axis and every axis already has a mark, and the seat is
    already the ring's colour. So the colour around the mark is the seat and
    the mark inside it is the axis. Two tables that both ship, no new drawing,
    and the distinct marks go from 7 to 40 with the worst collision falling
    from 21 rows to 10. */
 if(sec==='addr') NODES.forEach(function(n){
  var field=BANDS.indexOf(n.b)<0;
  var seat=field?(n.b==='Field-Above'?'Crown':'Root'):n.b;
  var ax=n.cf?kbFind(CHILD,n.cf):null;
  out.push(kbRow('node', n.k, field?'field anchor':n.b, seat,
   kbPct(n.sq), (ax&&ax.ic)||SEATGLYPH[seat]||SEATGLYPH._, n));});
 /* THE NINE ARE CHILD EMOTIONS, NOT FETTERS. His ruling, and the product's
    own glossary already agreed with him: a fetter is "a named conditional
    response pattern resident at a specific node address, one per physical
    node". That is the 108. The nine are the poled axes those patterns run on.
    The section key stays 'fetter' because a key is identity and identity is
    never renamed in this repository. The word a person reads is what moves. */
 if(sec==='fetter') CHILD.forEach(function(c){
  out.push(kbRow('fetter', c.nm, c.seat, c.seat,
   kbPct(S.charge[c.nm]), c.ic, c));});
 /* a saboteur's family is its architecture, which is the word he named. The
    colour is that architecture's seat, so six families read as six colours.
    Every one of the thirty nine carries a live weight, so every one has a
    percent and none of them is blank. */
 if(sec==='sab') ALL_SAB.forEach(function(s){
  var fam=kbFind(HCX_LIB,s.hcx), live=kbFind(r.sabs,s.nm);
  out.push(kbRow('sab', s.nm, s.hcx||'unnamed', (fam&&fam.b)||'Heart',
   kbPct(live?live.w:0), (fam&&fam.ic)||null, s));});
 /* HIGH IS GOOD HERE AND THE COLOUR MUST NOT SAY OTHERWISE. A law at 90 is a
    law kept, not an alarm, and this product has shipped that defect twice.
    The ring takes the seat colour like every other deck and never the alarm.

    THE ORDER IS THE ONE HARM ALREADY HOLDS. The book numbers its coherence
    laws 27 to 39 in chapter 10 and the engine measures twenty one, carrying
    twelve of the book's thirteen, not carrying Reverence, and adding nine the
    book does not number. Which of those is right is the owner's and is open,
    so nothing here changes membership and nothing invents a position: the
    deck follows HARM, which is an order the product already has. */
 if(sec==='law') HARM.forEach(function(e){
  if(e.a!=='spirit')return;
  var l=kbFind(SI,e.t); if(!l)return;
  out.push(kbRow('law', l.nm, l.b, l.b, kbPct(S.law[l.nm]), l.ic, l));});
 /* a mask is worn over the seats it covers and takes the first for its
    colour. maskRing carries a weight for all six, so all six have a percent. */
 if(sec==='mask') MASKS.forEach(function(m){
  var live=kbFind(r.maskRing||[],m.nm);
  out.push(kbRow('mask', m.nm, (m.b||[]).join(' and '), (m.b&&m.b[0])||'Heart',
   kbPct(live?live.w:0), m.ic, m));});
 /* nineteen domains, four families. The root already has a colour the rest of
    the product uses, so the row states it outright rather than being forced
    through a seat that would pick the wrong one. DOMAIN is normalised to the
    strongest lobe, so the percent says so. */
 if(sec==='dom') DOMAINS.forEach(function(d,i){
  out.push(kbRow('dom', d.nm, d.r, 'Heart', kbPct100(DOMAIN[i]), d.ic||null, d,
   ROOTCOL[d.r]||null));});
 /* affinity is normalised to the strongest archetype, so the top one is 100
    by construction and the scale line says what it is a share of. */
 if(sec==='arch') ARCH.forEach(function(a,i){
  out.push(kbRow('arch', a.nm, a.b||'Heart', a.b||'Heart',
   kbPct100(r.aff[i]), a.ic||null, a));});
 /* a gate's percent is its share of the gate evidence in the story, which is
    honestly zero until a story exists. Zero is a reading and prints. */
 if(sec==='gate') verpRead().forEach(function(g){
  out.push(kbRow('gate', g.nm, g.side+' gate', g.side==='higher'?'Crown':'Root',
   g.pct||0, GATEGLYPH[g.k]||null, g));});
 /* THE FOURTH THING IS NEVER THE THIRD THING SAID TWICE. The stack is the
    seven seats, so its name and its seat are the same word and the row read
    "Root / Root" seven times. APC already carries nv, the nerve plexus the
    seat is generated by, which is the useful fact and is not a definition.
    The percent is the share of that seat's addresses carrying charge. */
 if(sec==='seat') APC.forEach(function(c){
  var all=W.filter(function(n){return n.b===c.b;});
  var lit=all.filter(function(n){return n.sq>=1;}).length;
  out.push(kbRow('seat', c.b, c.nv, c.b,
   all.length?Math.round(lit/all.length*100):0, SEATGLYPH[c.b]||SEATGLYPH._, c));});
 /* THE CARDS DECK HOLDS FIVE DIFFERENT THINGS and the family says which. The
    twelve that name an axis take that axis's charge, because that is what the
    card releases. The thirteen that are a band, a kind or a pole are the
    instrument's own vocabulary rather than a reading about a person, so there
    is nothing for them to be a percent of and they carry none. */
 if(sec==='card'){
  CARDSET.forEach(function(c){
   out.push(kbRow('card', c.nm, 'release protocol', 'Heart',
    kbPct(S.charge[c.ax]), 'M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5', c));});
  AXCARD.forEach(function(c){
   var ch=c.ax?kbFind(CHILD,c.ax):null;
   out.push(kbRow('axcard', c.ax||c.un, 'letting go card',
    (ch&&ch.seat)||'Throat', c.ax?kbPct(S.charge[c.ax]):null,
    (ch&&ch.ic)||'M4 12h16 M4 9v6 M20 9v6 M12 8v8', c));});
  C3_BAND.forEach(function(b){
   out.push(kbRow('band', b.nm, 'intensity band', 'Solar', null,
    'M3 8h18 M3 16h18 M8 8v8 M16 8v8', b));});
  C3_KIND.forEach(function(x){
   out.push(kbRow('kind', x.nm, 'pattern kind', 'Sacral', null,
    'M5 5h5v5H5z M14 5h5v5h-5z M5 14h5v5H5z M14 14h5v5h-5z', x));});
  C3_POLE.forEach(function(x){
   out.push(kbRow('pole', x.nm, 'pole', '3rd Eye', null,
    'M12 3v18 M8 7l4-4 4 4 M8 17l4 4 4-4', x));});}
 /* seventy six, in the book's chapter order, which HARM already holds. The
    family is the axis, because that is what the flow is made of. Twenty one
    are scored by the intake and the other fifty five are read, so those
    fifty five carry no percent: a figure off a default is a figure about the
    default. */
 /* AND THE FOURTH THING MUST NOT BE THE HEADING SAID AGAIN.

    This deck breaks into sections and the section names the axis, so a row
    that answered "Laws of Nature" under a heading reading "Laws of nature,
    Sat, how the field behaves" printed the heading thirteen more times. That
    is the same defect this row was built to remove, wearing a different coat:
    the shipping deck had twenty one law cards spending their third line
    restating their second line as a sentence.

    So under a heading the row says what the heading cannot. A scored law says
    its seat, which is genuinely its own: Truth is at the throat, Unity at the
    crown, Compassion at the heart.

    A law the intake does not score says NOTHING, and this took two attempts.
    The first said "read, not scored" and that is fifty five rows carrying one
    sentence, which is the defect again in a third coat: twenty eight of them
    are on the screen at once. There is no per row fact to put there, the dash
    in the figure column already says the intake does not score it, and the
    ruling is that if you cannot use regular words to describe a thing you do
    not describe it. So the row is three things instead of four and the name
    sits centred against its mark. A line with nothing of its own to say is
    not a quieter line, it is a line that should not be drawn.

    The axis comes back when the heading is not drawn, which is a sort by
    weight or a search, because then the family is the only thing saying which
    deck a row came from. That is the rule the kind label already follows. */
 if(sec==='harm') HARM.forEach(function(e){
  var scored=(e.a==='spirit'), fam=HARM_FAM[e.a]||{};
  var si=scored?kbFind(SI,e.t):null;
  var seat=(si&&si.b)||fam.b||'Heart';
  var row=kbRow('harm', e.t, scored?seat:'', seat,
   scored&&S.law[e.t]!=null?kbPct(S.law[e.t]):null,
   (si&&si.ic)||fam.ic||null, e);
  /* what the row says when nothing above it names the family */
  row.fam=HARM_AX[e.a]||e.a;
  row.axis=e.a; out.push(row);});
 /* THE GLOSSARY IS NOT A DECK ANY MORE.

    DESIGN-information.md rules that a name is glossed once, in one table, and
    nothing else may carry a definition. GLOSS is that table. Fifty six rows
    whose entire content is a definition are not eleven decks' worth of
    readings with a twelfth beside them: they are the answer to a question,
    and the question is asked in the search field. So the glossary leaves the
    deck strip and becomes what the search returns, above the matching rows.

    kbRows still builds it, because the search reads it and because a deck
    that can still be asked for by key is one the gates can still walk. */
 if(sec==='gloss') GLOSS.forEach(function(g){
  out.push(kbRow('gloss', g.t, 'definition', glossBand(g.t), null,
   glossMark(g.t), g));});
 return out;}

/* THE OWNER ASKED WHERE THE STACK AND THE UNIVERSAL LAWS WERE. Both were on
   this page the whole time, filed under names that did not say what they held.
   The seven seats were "The catalog", which is what a list of anything is
   called, and the seventy six were "The 76 laws", which leads with a count
   over the thing counted and reads as a different set from the twenty one deck
   two tabs to the left. One word per concept: the seats are the stack, and the
   seventy six are the universal laws.

   AND THE TWO THE OWNER CAUGHT THIS ROUND.

   "I do not know the difference between a node and a fetter the way you are
   using it. A fetter is a node. The fetters are the 108. Which you listed here
   between fear, anger, shame, these are the nine child emotions. Very
   different." So the deck of 112 addresses is the Fetters, which is what the
   glossary has always said they are, and the deck of nine is the Child
   emotions. The keys do not move: addr and fetter are identity.

   "So the laws, it just says laws, that should be moral integrity." Laws
   becomes Moral integrity. The book calls the same set the Laws of Spiritual
   Integrity; he said moral, so moral wins, and the disagreement is recorded in
   BOOK-ERRATA.md rather than argued here.

   The glossary is gone from this list on purpose. See kbRows. */
const KB_SECS=[['addr','Fetters'],['fetter','Child emotions'],['sab','Saboteurs'],
 ['law','Moral integrity'],['mask','Masks'],['dom','Domains'],['arch','Archetypes'],
 ['gate','Gates'],['card','The cards'],['seat','The stack'],
 ['harm','Universal laws']];

/* what each deck's percent is a percent of. One line per family, and where a
   family has no honest percent for some of its rows the line says so rather
   than leaving a person to assume the blanks are zeroes. */
const KB_OF={
 addr:'of the address at full load',
 fetter:'of the axis held',
 sab:'of the pattern at full weight',
 law:'of the law kept, where high is the law holding',
 mask:'of the mask at full weight',
 dom:'of your strongest blueprint lobe',
 arch:'of your strongest archetype',
 gate:'of the gate evidence in your story',
 seat:'of the seat’s addresses carrying charge',
 card:'of the axis the card releases, where the card names one',
 harm:'of the law kept, where the intake scores it',
 gloss:''};

/* the axis headings on the universal laws, which is the only deck that breaks
   into sections. The words are the book's own: Sat, Chit and Ananda are what
   chapters 08, 09 and 10 call their axes, and the flow he asked for is that
   order. Which laws belong on the coherence axis is open and is not touched. */
const KB_AXHD={
 nature:'Laws of nature · Sat, how the field behaves',
 human:'Laws of human nature · Chit, how consciousness enters form',
 spirit:'Moral integrity · Ananda, what maintains coherence',
 express:'Laws of expression · what it comes out as',
 emotion:'The nine architectures', measure:'The instruments', meta:'The frame'};

function kbMatch(row,q){
 if(!q)return true;
 return (row.t+' '+row.s).toLowerCase().indexOf(q)>=0;}

/* EVERY KIND, because a miss here prints the raw key. A search across the
   decks was labelling results axcard, band, kind and pole, which are variable
   names and not words the product uses anywhere a person can see. node reads
   Fetter and fetter reads Child emotion, which is the rename: the keys are
   identity and the labels are what a person sees. */
const KB_KIND={node:'Fetter',fetter:'Child emotion',sab:'Saboteur',
 law:'Moral integrity',dom:'Domain',arch:'Archetype',gate:'Gate',
 harm:'Universal law',gloss:'Term',seat:'Seat',mask:'Mask',card:'Card',
 axcard:'Card',band:'Band',kind:'Pattern',pole:'Pole'};

/* in order is the default, because he ruled that the universal laws go in
   order and a deck that reorders itself per person has no stable answer to
   "where is Fear". By weight is one press away, because the squint test only
   passes when the heaviest thing is first. */
var KB_SORT='order';

function kbRender(){
 /* #knowbody, not #know. #know is the tab host and it also carries the folded
    games surface, which this function would otherwise overwrite. */
 var host=document.getElementById('knowbody'); if(!host)return;
 var q=KB_Q.trim().toLowerCase();
 var rows=kbRows(KB_SEC).filter(function(x){return kbMatch(x,q);});
 if(KB_SORT==='weight') rows=rows.slice().sort(function(a,b){
  return (b.p==null?-1:b.p)-(a.p==null?-1:a.p);});
 /* the count across every deck, so search says what it found everywhere */
 var total=0, per={};
 KB_SECS.forEach(function(s){
  var n=kbRows(s[0]).filter(function(x){return kbMatch(x,q);}).length;
  per[s[0]]=n; total+=n;});
 /* and the glossary, which is not a deck and answers above the rows */
 var gl=q?kbRows('gloss').filter(function(x){return kbMatch(x,q);}):[];

 /* THE HEADER WAS EATING THE PAGE AND THE ROW COULD NOT BE REACHED PAST IT.

    Measured on the shipping build: the codex's own header was 288 pixels at
    1600 and 381 on a phone, and the app's chrome above it is another 104 and
    267. So on a 844 pixel screen the header was 648 pixels, 77 percent of the
    device, and one entry was visible below it.

    Four separate attempts at the row were measured before this was, and all
    four left the header alone. Every one of them put a better row on a phone
    with nothing above the fold to see it in. The paragraph explaining that the
    codex is open goes: it said the same thing on every one of eleven decks,
    on every visit, forever. The twelve deck chips stop wrapping to two and
    three rows and scroll sideways on one. The eyebrow, the deck's name and
    what its percent means sit on one baseline.

    154 pixels at 1600 and 226 on a phone. Twelve rows above the fold became
    thirty nine, and one became six. */
 var h='<div class="kb-top">'
  +'<div class="kb-hdr"><div class="pm-eye">The codex</div>'
  +'<h2 class="kb-h">'+esc(kbSecName(KB_SEC))+'</h2>'
  +'<span class="kb-scale">'+rows.length+(q?' matching':' of them')
  +(KB_OF[KB_SEC]?'. The percent is '+esc(KB_OF[KB_SEC])+'.':'')+'</span></div>'
  +'<div class="kb-bar">'
  +'<input type="search" id="kbq" class="kb-q" placeholder="Search the codex" '
  +'value="'+esc(KB_Q)+'" aria-label="Search the knowledge base">'
  +(q?'<span class="kb-found">'+total+' match'+(total===1?'':'es')+'</span>':'')
  +'<span class="kb-sw" role="group" aria-label="Order">'
  +'<button type="button" class="kb-swb'+(KB_SORT==='order'?' on':'')+'" data-kbs="order"'
  +' aria-pressed="'+(KB_SORT==='order')+'">In order</button>'
  +'<button type="button" class="kb-swb'+(KB_SORT==='weight'?' on':'')+'" data-kbs="weight"'
  +' aria-pressed="'+(KB_SORT==='weight')+'">By weight</button></span></div>'
  +'<div class="kb-strip" role="tablist">'+KB_SECS.map(function(s){
    return '<button type="button" role="tab" class="kb-t'+(KB_SEC===s[0]?' on':'')+'" data-kb="'+s[0]+'" '
     +'aria-selected="'+(KB_SEC===s[0])+'">'+s[1]+' <b>'+(q?per[s[0]]:kbRows(s[0]).length)+'</b></button>';}).join('')
  +'</div></div>';

 /* THE GLOSSARY ANSWERS FIRST AND ANSWERS ONCE. A name is glossed in one
    table and the search shows it; nothing else on this page carries a
    definition any more. */
 if(gl.length){
  h+='<div class="kb-gloss">';
  gl.slice(0,4).forEach(function(g){
   h+='<div class="kb-g"><div class="kb-gt">'+esc(g.t)+'</div>'
    +'<p class="kb-gd">'+esc(g.o.d)+'</p></div>';});
  h+='</div>';}

 h+='<div class="kb-rg">';
 if(!rows.length) h+='<div class="rnone">Nothing here matches. The count beside each deck says where it is.</div>';
 var lastAx='';
 rows.forEach(function(x,i){
  /* the axis break, so the flow is visible rather than implied. It is only
     drawn in the deck's own order, because a sort by weight crosses the axes
     by definition and a heading over a mixed run would be a lie. */
  if(KB_SEC==='harm'&&KB_SORT==='order'&&!q&&x.axis&&x.axis!==lastAx){
   lastAx=x.axis;
   h+='<div class="kb-sec">'+esc(KB_AXHD[x.axis]||x.axis)+'</div>';}
  var seat=BANDS.indexOf(x.seat)>=0?x.seat:'Heart';
  var c=x.col||seatCol(seat);
  /* THE FIGURE TAKES THE INK COLOUR AND NOT THE SEAT'S.

     Measured against its own ground rather than against the page, which is
     the only way this is ever caught: Root is 4.81 to 1 on the page and 4.17
     on the panel, which is what the row stands on when a person points at it,
     and a number needs 4.5. So the Root percent dropped below AA on hover.

     It is the better design regardless. The ring already carries the seat
     colour, so a coloured figure is the same channel used twice, and on the
     moral integrity deck a high figure in a warm colour would read as an
     alarm on a law that is being kept. Colour means the seat, once. */
  var cls=x.p==null?' off':(x.p?'':' z');
  /* the family comes back on a row whose section heading is not drawn */
  var fam=(x.fam&&(KB_SORT==='weight'||q))?x.fam:x.s;
  h+='<button type="button" class="kb-row" data-kbi="'+i+'" style="--c:'+c+'">'
   +crBadge(seat, x.p||0, {size:'md', bare:true, color:c,
      glyph:glyphPath(x.ic), title:x.t+(x.p==null?'':' · '+x.p+'%')})
   +'<span class="kb-rt"><span class="kb-rn">'+esc(x.t)+'</span>'
   +(fam?'<span class="kb-rs">'+esc(q?(KB_KIND[x.k]||x.k)+' · '+fam:fam)+'</span>':'')+'</span>'
   +'<span class="kb-rv'+cls+'">'+(x.p==null?'–':x.p+'%')+'</span>'
   +'</button>';});
 h+='</div>';

 /* the deck sits under the base, because a card is the base at practice speed */
 h+='<div class="kb-deck"><div class="pm-eye">The Letting Go Deck</div>'
  +'<p class="kb-p">A deck whose suits are the seven seats and whose ranks are intensity. It deals '
  +'from what you are actually carrying, so every card is an address with charge on it. '
  +(deckSize()?'<b>'+deckSize()+'</b> cards in the deck.':'Nothing is held above the line yet, so the deck is empty.')+'</p>'
  +'<button class="btn pri" id="kbdeck"'+(deckSize()?'':' disabled')+'>Deal a card</button></div>';

 host.innerHTML=h;
 var qi=document.getElementById('kbq');
 if(qi){qi.oninput=function(){KB_Q=qi.value; kbRender();
   var e=document.getElementById('kbq'); if(e){e.focus(); try{e.setSelectionRange(e.value.length,e.value.length);}catch(err){}}};}
 host.querySelectorAll('[data-kb]').forEach(function(el){el.onclick=function(){
  KB_SEC=el.getAttribute('data-kb'); kbRender();};});
 host.querySelectorAll('[data-kbs]').forEach(function(el){el.onclick=function(){
  KB_SORT=el.getAttribute('data-kbs'); kbRender();};});
 host.querySelectorAll('[data-kbi]').forEach(function(el){el.onclick=function(){
  kbOpen(rows[+el.getAttribute('data-kbi')]);};});
 var dk=document.getElementById('kbdeck');
 if(dk)dk.onclick=function(){deckDeal();};}

/* the deck's own name, looked up by key and never by position, which is the
   rule this repository already carries for anything needing a tab's entry. */
function kbSecName(k){
 for(var i=0;i<KB_SECS.length;i++)if(KB_SECS[i][0]===k)return KB_SECS[i][1];
 return 'The codex';}
/* one row, one door. every kind routes to the drill that already exists for it. */
function kbOpen(x){
 if(!x)return;
 S.pin=null; ANA_PICK=null;
 if(x.k==='node'){runNodeDrill(x.o); render(); return;}
 if(x.k==='law'){runLawDrill(x.o); render(); return;}
 if(x.k==='gate'){runGatesDrill(x.o.k); render(); return;}
 if(x.k==='fetter'){runFetterDrill(x.o); return;}
 if(x.k==='sab'){
  var r=compute(), live=r.sabs.filter(function(s){return s.nm===x.o.nm;})[0];
  if(live){S.pin=live; runDrill(live); render(); return;}
  runSabDrill(x.o); return;}
 if(x.k==='harm'){runKbDrill('Harmonic element '+x.o.c, x.o.t, HARM_AX[x.o.a]||x.o.a, x.o.ch); return;}
 if(x.k==='gloss'){runKbDrill('Glossary', x.o.t, '', x.o.d); return;}
 if(x.k==='dom'){runDomDrill(x.o); return;}
 if(x.k==='arch'){runKbDrill('Archetype', x.o.nm, 'how the blueprint expresses', x.o.v||''); return;}
 if(x.k==='mask'){runKbDrill('Mask', x.o.nm, 'worn over the '+(x.o.b||[]).join(' and '),
   'A mask is not a fault and it is not a stage you failed to leave. It is a '
   +'shape held in front of the seats it covers, and it costs what holding it '
   +'costs. This one sits over the '+(x.o.b||[]).join(' and ')+'. Its charge is '
   +'read from the story, never from a question about your age.'); return;}
 if(x.k==='seat'){runSeatDrill(x.o); return;}
 if(x.k==='card'){runCardDrill(x.o); return;}
 if(x.k==='axcard'){runAxCardDrill(x.o); return;}
 if(x.k==='band'){runKbDrill('Intensity band '+x.o.lo+' to '+x.o.hi, x.o.nm,
   'why the band exists', 'To '+x.o.why+'. The language at this depth: '
   +x.o.w.join(', ')+'. A card cannot open here. The curve is pacing, not decoration.');
  return;}
 if(x.k==='kind'){runKbDrill('Pattern kind', x.o.nm, 'what the generator takes',
   x.o.ex.join(', ')+'.'); return;}
 if(x.k==='pole'){runKbDrill(x.o.ch+', '+x.o.ans, x.o.nm, 'the polarity of '+x.o.of,
   'Themes: '+x.o.th.join(', ')+'. Held in the '+x.o.body.join(', ')+'. The energy is '
   +x.o.en+'. '+C3_BILATERAL); return;}}

/* a printed card, whole: both poles, every line paired to its truth. */
function runCardDrill(c){
 var h='<div class="pm-eye">Release protocol No.'+esc(c.no)+'</div>'
  +'<div class="ad-nm">'+esc(c.nm)+'</div>'
  +'<div class="ad-sub">'+esc(c.dom)+'</div>'
  +'<div class="pm-eye">Where it sits</div>'
  +'<p class="ad-p">'+esc(c.seat)+'. '+esc(c.nrv)+'.</p>'
  +'<p class="ad-p">'+esc(c.lad.join(' to '))+'.</p>'
  +'<div class="pm-eye">How to read it</div>'
  +'<p class="ad-p">'+esc(CARD_OPEN)+'</p>';
 C3_POLE.forEach(function(p){
  var side=c[p.k];
  h+='<div class="pm-eye">'+esc(p.ch)+', '+esc(p.ans)+'</div>';
  side.rel.forEach(function(r,i){
   h+='<div class="kb-pair"><p class="kb-rel">'+esc(C3_STEM+r+'.')+'</p>'
    +'<p class="kb-tru">'+esc(C3_TRUTH+side.tru[i]+'.')+'</p></div>';});});
 h+='<p class="ad-p">'+esc(CARD_SHUT)+'</p>';
 rdShell(h);}

/* one axis card: the track the pattern speaks, the release, the install. */
function runAxCardDrill(c){
 /* a sentence, not a name, so it keeps sentence case. See the label gate. */
 var h='<div class="pm-eye plain">Letting go card, axis '+esc(c.num)+'</div>'
  +'<div class="ad-nm">'+esc(c.ax||c.un)+'</div>'
  +'<div class="ad-sub">toward '+esc(c.cop)+'. '+esc(c.addr)+'</div>'
  +(c.ax?'':'<div class="pm-eye">Unmatched</div><p class="ad-p">The engine carries no axis '
    +'at this address under this name, so the card is kept under its own and is not '
    +'merged into a neighbour.</p>')
  +'<div class="pm-eye">What the pattern says</div>'
  +'<p class="kb-rel" style="font-style:italic">'+esc(c.track)+'</p>'
  +'<div class="pm-eye">Release</div>'
  +'<p class="kb-rel">'+esc(axLine(c.ax||c.un))+'</p>'
  +'<div class="pm-eye">Install</div>'
  +'<p class="kb-tru">'+esc(c.inst)+'</p>'
  +'<div class="pm-eye">How it is run</div>'
  +CARD_STEP.map(function(t,i){return '<p class="ad-p"><b>'+(i+1)+'.</b> '+esc(t)+'</p>';}).join('');
 rdShell(h);}

/* ---- THE LETTING GO DECK ----
   Suits are the seven seats. Ranks are intensity, the charge at the address
   rounded to a whole number, so an ace is a one and the face cards are the
   heaviest thing a person carries. The deck is dealt from the field, never
   from the library, because a card a person is not carrying teaches nothing. */
var DECK_CARD=null;
/* compute() already builds this list and calls it loaded. */
function deckPool(){return compute().loaded;}
function deckSize(){return deckPool().length;}
const RANKNM={1:'Ace',11:'Jack',12:'Queen',13:'King'};
function deckDeal(){
 var pool=deckPool(); if(!pool.length)return;
 var n=pool[Math.floor(Math.random()*pool.length)];
 DECK_CARD={n:n, rank:Math.max(1,Math.min(13,Math.round(n.sq)))};
 deckRender();}
function deckClose(){DECK_CARD=null; deckRender();}
function deckRender(){
 var el=document.getElementById('deck'); if(!el)return;
 if(!DECK_CARD){el.style.display='none'; el.innerHTML=''; return;}
 var c=DECK_CARD, n=c.n, col=seatCol(n.b);
 var opp=(CHILD.filter(function(x){return x.nm===n.cf;})[0]||{}).opp||'';
 var rk=RANKNM[c.rank]||String(c.rank);
 el.style.display='flex';
 el.innerHTML='<div class="card" style="--c:'+col+'">'
  +'<div class="card-hd"><span class="card-rk">'+rk+'</span>'
   +'<span class="card-suit">'+esc(n.b)+'</span></div>'
  +'<div class="card-mid"><div class="card-nm">'+esc(n.k)+'</div>'
   +'<div class="card-ad">'+esc(n.n||'field')+'</div></div>'
  +'<div class="card-say"><div class="pm-eye">Say it</div>'
   +'<p>Letting go of believing that I am '+esc(String(n.k).toLowerCase())+'.</p>'
   +'<p>Letting go of feeling that I am '+esc(String(n.k).toLowerCase())+'.</p></div>'
  +'<div class="card-ft"><span>axis '+esc(n.cf||'unrouted')+(opp?', toward '+esc(opp):'')+'</span>'
   +'<span class="card-sq">'+n.sq.toFixed(1)+'</span></div>'
  +'<div class="card-act"><button class="btn" id="cardnext">Deal another</button>'
   +'<button class="btn" id="cardopen">Open the address</button>'
   +'<button class="btn" id="cardx">Close</button></div>'
  +'</div>';
 var b;
 b=document.getElementById('cardnext'); if(b)b.onclick=deckDeal;
 b=document.getElementById('cardx'); if(b)b.onclick=deckClose;
 b=document.getElementById('cardopen'); if(b)b.onclick=function(){
  deckClose(); S.pin=null; runNodeDrill(n); render();};}
