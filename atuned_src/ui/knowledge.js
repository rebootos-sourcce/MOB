
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

function kbRows(sec){
 var r=compute(), out=[];
 if(sec==='addr') W.forEach(function(n){
  out.push({k:'node', t:n.k, s:n.b, d:(n.n||'field')+', axis '+(n.cf||'unrouted'),
   v:n.sq>=4?n.sq.toFixed(1):'', o:n});});
 if(sec==='fetter') CHILD.forEach(function(c){
  out.push({k:'fetter', t:c.nm, s:c.seat, d:'toward '+c.opp+'. '+c.addr+', '+c.loc,
   v:(S.charge[c.nm]||0).toFixed(1), o:c});});
 if(sec==='sab') ALL_SAB.forEach(function(s){
  var pi=SAB_PI.indexOf(s.nm)>=0;
  /* a saboteur's family is its hypercomplex, which carries the mark and the
     colour. Six architectures rather than thirty nine inventions. */
  var fam=null;
  for(var q=0;q<HCX_LIB.length;q++)if(HCX_LIB[q].nm===s.hcx){fam=HCX_LIB[q];break;}
  out.push({k:'sab', t:s.nm, s:s.hcx||'', d:(s.unnamed?'inferred from the connection types':
    (pi?'Positive Intelligence':'SOURCE library'))+', '+(s.nids||[]).length+' addresses',
   v:'', o:s, band:(fam&&fam.b)||null, mark:(fam&&fam.ic)||null});});
 if(sec==='law') SI.forEach(function(l,i){
  out.push({k:'law', t:l.nm, s:l.b, d:l.d||'seated at the '+l.b.toLowerCase(),
   v:(S.law[l.nm]!=null?S.law[l.nm].toFixed(1):''), o:l, j:i});});
 if(sec==='mask') MASKS.forEach(function(m){
  /* a mask sits across the seats it is worn over, so the card takes the first
     of them for its colour and names all of them in the line under. */
  out.push({k:'mask', t:m.nm, s:(m.b&&m.b[0])||'Heart',
   d:'worn over the '+(m.b||[]).join(' and ')+'. '+(m.b.length>1?'two seats':'one seat'),
   v:'', o:m});});
 if(sec==='dom') DOMAINS.forEach(function(d,i){
  /* nineteen domains carried nineteen marks in one colour, because a domain is
     not seated and the fallback is the heart. Its family is its root domain,
     four of them, and those already have colours the rest of the product uses.
     So the deck reads as four families rather than one wash. */
  out.push({k:'dom', t:d.nm, s:d.r, d:d.d||'', v:(DOMAIN[i]||0).toFixed(2), o:d, j:i,
   col:ROOTCOL[d.r]||null});});
 if(sec==='arch') ARCH.forEach(function(a,i){
  out.push({k:'arch', t:a.nm, s:'archetype', d:a.v||'', v:((r.aff[i]||0)*100).toFixed(0)+'%', o:a, j:i});});
 if(sec==='gate') verpRead().forEach(function(g){
  /* GATEGLYPH has carried a mark per gate the whole time and the codex never
     asked for it, so six gates printed the Heart glyph six times. The side is
     the family: a higher gate opens at the crown, a lower one holds at the
     root. */
  out.push({k:'gate', t:g.nm, s:g.side+' gate', d:g.d, v:g.pct?g.pct+'%':'', o:g,
   band:g.side==='higher'?'Crown':'Root', mark:GATEGLYPH[g.k]||null});});
 /* a universal law's family is its axis, so the card takes its colour and its
    mark from HARM_FAM. The twenty one of Moral Integrity are by name the same
    twenty one the instrument measures, so they are matched to SI and wear the
    law's own icon and the law's own seat rather than a family mark. */
 if(sec==='harm') HARM.forEach(function(e){
  /* 21 of the 76 are the Laws of Moral Integrity and those are the ones the
     intake scores. The other 55 are read, not measured, and the row says
     which it is rather than leaving a person to assume all 76 carry a score. */
  var scored=(e.a==='spirit');
  var fam=HARM_FAM[e.a]||{}, si=null;
  if(scored)for(var q=0;q<SI.length;q++)if(SI[q].nm===e.t){si=SI[q];break;}
  out.push({k:'harm', t:e.t, s:HARM_AX[e.a]||e.a,
   d:e.c+', '+e.ch+(scored?'. scored by the intake':'. read, not scored'),
   v:scored&&S.law[e.t]!=null?S.law[e.t].toFixed(1):'', o:e,
   /* band carries the colour, mark carries the glyph. a row states its own
      family rather than leaving the renderer to guess from a label. */
   band:(si&&si.b)||fam.b||'Heart', mark:(si&&si.ic)||fam.ic||null});});
 if(sec==='gloss') GLOSS.forEach(function(g){
  /* A GLOSSARY TERM IS OFTEN A THING THIS CODEX ALREADY HOLDS. Fifty six
     entries printed one mark, and a third of them name a law, a fetter, a
     hypercomplex or a seat that has its own. So the term wears that mark and
     the glossary reads as cross referenced rather than as a list of words.
     Everything else takes the plain term mark, an open book, which is honest:
     it is a definition and nothing more. */
  out.push({k:'gloss', t:g.t, s:'', d:g.d, v:'', o:g,
   band:glossBand(g.t), mark:glossMark(g.t)});});
 /* THE CARDS DECK HOLDS FIVE DIFFERENT THINGS and printed one mark across all
    twenty five: the printed protocols, the axis cards, the intensity bands, the
    pattern kinds and the poles. The kind is the family here, because that is
    genuinely what separates a band from a protocol, and the mark says which
    one a person is looking at before they read a word of it. */
 var CARDMARK={
  /* a card, face up, with its rule printed on it. */
  card:{b:'Heart',ic:'M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5'},
  /* an axis: two ends and the line between them. */
  axcard:{b:'Throat',ic:'M4 12h16 M4 9v6 M20 9v6 M12 8v8'},
  /* a band: a range taken out of a longer scale. */
  band:{b:'Solar',ic:'M3 8h18 M3 16h18 M8 8v8 M16 8v8'},
  /* a kind: one shape repeated, which is what a pattern is. */
  kind:{b:'Sacral',ic:'M5 5h5v5H5z M14 5h5v5h-5z M5 14h5v5H5z M14 14h5v5h-5z'},
  /* a pole: one axis, and which end of it is loaded. */
  pole:{b:'3rd Eye',ic:'M12 3v18 M8 7l4-4 4 4 M8 17l4 4 4-4'}};
 if(sec==='card'){
  /* the printed cards first, then the axes cards, then the two the engine has
     no axis for. every row opens the card, and a row never invents a line. */
  CARDSET.forEach(function(c){
   out.push({band:CARDMARK.card.b, mark:CARDMARK.card.ic, k:'card', t:c.nm, s:'protocol No.'+c.no,
    d:c.dom+'. '+c.seat+'. '+c.lad.join(' to '),
    v:(c.m.rel.length+c.f.rel.length)+' lines', o:c});});
  AXCARD.forEach(function(c){
   out.push({band:CARDMARK.axcard.b, mark:CARDMARK.axcard.ic, k:'axcard', t:c.ax||c.un, s:'axis '+c.num+(c.ax?'':', unmatched'),
    d:'"'+c.track+'" toward '+c.cop+'. '+c.addr, v:'', o:c});});
  C3_BAND.forEach(function(b){
   out.push({band:CARDMARK.band.b, mark:CARDMARK.band.ic, k:'band', t:b.nm, s:b.lo+' to '+b.hi,
    d:'to '+b.why+'. '+b.w.join(', '), v:'', o:b});});
  C3_KIND.forEach(function(x){
   out.push({band:CARDMARK.kind.b, mark:CARDMARK.kind.ic, k:'kind', t:x.nm, s:'pattern kind', d:x.ex.join(', '), v:'', o:x});});
  C3_POLE.forEach(function(x){
   out.push({band:CARDMARK.pole.b, mark:CARDMARK.pole.ic, k:'pole', t:x.nm, s:x.ch+', '+x.ans, d:x.of+'. '+x.is.join(', '), v:'', o:x});});}
 if(sec==='seat') APC.forEach(function(c){
  var rel=0,emb=0; c.sub.forEach(function(x){rel+=x[1];emb+=x[2];});
  out.push({k:'seat', t:c.b, s:c.nv, d:c.d, v:rel+' released', o:c, emb:emb});});
 return out;}

/* THE OWNER ASKED WHERE THE STACK AND THE UNIVERSAL LAWS WERE. Both were on
   this page the whole time, filed under names that did not say what they held.
   The seven seats were "The catalog", which is what a list of anything is
   called, and the seventy six were "The 76 laws", which leads with a count
   over the thing counted and reads as a different set from the twenty one deck
   two tabs to the left. One word per concept: the seats are the stack, and the
   seventy six are the universal laws. The twenty one keep Laws because they are
   the ones this instrument measures, and their deck says so on entry.

   Masks were the one named table with no deck at all. Six of them, each with a
   seat and now a mark, reachable only through a reading that happened to raise
   one. They are in the codex because everything is. */
const KB_SECS=[['addr','Nodes'],['fetter','Fetters'],['sab','Saboteurs'],
 ['law','Laws'],['mask','Masks'],['dom','Domains'],['arch','Archetypes'],
 ['gate','Gates'],['card','The cards'],['seat','The stack'],
 ['harm','Universal laws'],['gloss','Glossary']];

function kbMatch(row,q){
 if(!q)return true;
 return (row.t+' '+row.s+' '+row.d).toLowerCase().indexOf(q)>=0;}

function kbRender(){
 /* #knowbody, not #know. #know is the tab host and it also carries the folded
    games surface, which this function would otherwise overwrite. */
 var host=document.getElementById('knowbody'); if(!host)return;
 var q=KB_Q.trim().toLowerCase();
 var rows=kbRows(KB_SEC).filter(function(x){return kbMatch(x,q);});
 /* the count across every section, so search says what it found everywhere */
 var total=0, per={};
 KB_SECS.forEach(function(s){
  var n=kbRows(s[0]).filter(function(x){return kbMatch(x,q);}).length;
  per[s[0]]=n; total+=n;});

 /* THIS IS THE CODEX, NOT A WIKI.

    It opened with "Everything the instrument knows" over a search box and a
    list of rows, which is the shape of a reference a person consults when
    they already know what they are looking for. Nobody arrives here knowing
    that. They arrive because a word in their own reading meant nothing to
    them, and the page has to be worth standing in.

    So it says what it is and why it is open to you. Transparency is a law in
    this system, and the whole of the philosophy being readable is the proof
    of it, which is a thing to say out loud rather than to imply with a
    search field. */
 var h='<div class="kb-top">'
  +'<div class="kb-hd"><div class="pm-eye">The codex</div>'
  +'<h2 class="kb-h">Every part of the system, open</h2>'
  +'<p class="kb-p">Nothing here is held back. These are the same tables the '
  +'reading runs on, the whole structure it is built from, and it is open '
  +'because a mirror you cannot inspect is not a mirror. Take any card.</p></div>'
  +'<div class="kb-search"><input type="search" id="kbq" placeholder="Search addresses, fetters, saboteurs, laws, domains" '
  +'value="'+esc(KB_Q)+'" aria-label="Search the knowledge base">'
  +(q?'<span class="kb-found">'+total+' match'+(total===1?'':'es')+'</span>':'')+'</div>'
  +'<div class="kb-tabs" role="tablist">'+KB_SECS.map(function(s){
    return '<button type="button" role="tab" class="kb-t'+(KB_SEC===s[0]?' on':'')+'" data-kb="'+s[0]+'" '
     +'aria-selected="'+(KB_SEC===s[0])+'">'+s[1]+(q?' <b>'+per[s[0]]+'</b>':'')+'</button>';}).join('')
  +'</div></div>';

 /* EVERY ENTRY IS A CARD.

    A row in a list is a line of text with a hit area. It says "there are
    many of these and none of them is special", which is exactly wrong for a
    codex: every one of these is a named thing with a seat, a family and a
    reading, and the point of being here is that they are each worth looking
    at.

    A card carries its family stripe at the top, its glyph, its name, what it
    is, and its own reading when it has one. The families are the sections
    and the colour is the seat, so a person reading these is learning the
    colour system at the same time. */
 /* ADDRESS BECOMES NODE, and the two words were never a distinction.

    The codex called the same thing an address in one place and a node in
    another, and a person clicking Addresses could not tell what separated
    them from Fetters. One word per concept: the place in the architecture is
    a node. What sits at a node is a fetter.

    And the kind label on a fetter card was the word "Fetter" on all nine of
    them, which is the category printed nine times where the thing itself
    could have been. Icon, then the thing. A fetter card says Fear, or Anger,
    and the card knows it is a fetter because it is in the Fetters deck. */
 /* EVERY KIND, because a miss here prints the raw key. A search across the
    decks was labelling results axcard, band, kind and pole, which are variable
    names and not words the product uses anywhere a person can see. */
 var KIND={node:'Node',fetter:'Fetter',sab:'Saboteur',law:'Law',dom:'Domain',
  arch:'Archetype',gate:'Gate',harm:'Harmonic',gloss:'Term',seat:'Seat',
  mask:'Mask',card:'Card',axcard:'Card',band:'Band',kind:'Pattern',pole:'Pole'};
 h+='<div class="kb-grid">';
 if(!rows.length) h+='<div class="rnone">Nothing here matches. The count beside each tab says where it is.</div>';
 rows.forEach(function(x,i){
  /* a row may state its own band, which is how a thing whose family is not a
     seat still lands in the colour system. Otherwise the subtitle is read as a
     band name, and Heart is the last resort rather than the common case. */
  var col=x.band||(x.k==='seat'?x.t:(x.s&&BANDS.indexOf(x.s)>=0?x.s:'Heart'));
  var band=BANDS.indexOf(col)>=0?col:'Heart';
  /* a row may state its own colour outright, for a family that is real and is
     not a seat. The root domains are the case: they have four colours already
     and forcing them through a band would have picked the wrong one. */
  var c=x.col||seatCol(band);
  var gl=SEATGLYPH[band]||SEATGLYPH._;
  /* the reading on a card is the card's own number, and it is only printed
     when the card has one. A card with no reading is not a card at zero. */
  var hot=x.v&&parseFloat(x.v)>0;
  /* a fetter carries its own glyph, not its seat's, because it has one and
     the icon rule says a named thing wears its own mark. */
  /* ANY NAMED THING THAT CARRIES A MARK WEARS ITS OWN, not its band's. This
     was written for fetters alone, so the twenty one laws printed seven seat
     glyphs between them and the six masks had none at all. The rule is not
     about fetters, it is about names: if the row's object has an ic, that is
     the icon. The seat colour still comes from the band, so the family holds. */
  if(x.mark)gl='<path d="'+x.mark+'"/>';
  else if(x.o&&x.o.ic)gl='<path d="'+x.o.ic+'"/>';
  /* THE READING SITS IN A PILL AT THE LOWER RIGHT OF THE ICON. Ruled, and
     the badge already exists for exactly this: the ring carries the share as
     a shape, the pill carries the figure. A card with nothing on it in this
     person's field gets the plain glyph and no pill, because a card at zero
     is not a card with a zero on it. */
  var pct=hot?Math.min(100,parseFloat(x.v)*10):0;
  h+='<button type="button" class="kb-c'+(hot?' live':'')+'" data-kbi="'+i+'" '
   +'style="--c:'+c+'">'
   +'<span class="kb-cs"></span>'
   +'<span class="kb-ch">'
   +(hot
     ? crBadge(band,pct,{size:'sm',raw:x.v,glyph:gl,color:c,
        title:x.t+' · '+x.v})
     : '<span class="kb-cg"><svg viewBox="0 0 24 24" aria-hidden="true">'+gl+'</svg></span>')
   /* THE KIND LABEL ONLY EARNS ITS SPACE WHEN THE DECK DOES NOT SAY IT.

      Every fetter card printed the word "Fetter" in a deck already titled
      Fetters, nine times, above the name of the thing. That is the category
      occupying the line the thing itself should be on. Icon, then the thing.

      It comes back during a search, because a search spans every deck and
      then the kind is the only thing saying which one a result came from. */
   +(q?'<span class="kb-ck">'+esc(KIND[x.k]||x.k)+'</span>':'')+'</span>'
   +'<span class="kb-cn">'+esc(x.t)+'</span>'
   +(x.s?'<span class="kb-cb">'+esc(x.s)+'</span>':'')
   +'<span class="kb-cd">'+esc(String(x.d||''))+'</span>'
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
 host.querySelectorAll('[data-kbi]').forEach(function(el){el.onclick=function(){
  kbOpen(rows[+el.getAttribute('data-kbi')]);};});
 var dk=document.getElementById('kbdeck');
 if(dk)dk.onclick=function(){deckDeal();};}

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
 var h='<div class="pm-eye">Letting go card, axis '+esc(c.num)+'</div>'
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
