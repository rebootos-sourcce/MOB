
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
  out.push({k:'sab', t:s.nm, s:s.hcx||'', d:(s.unnamed?'inferred from the connection types':
    (pi?'Positive Intelligence':'SOURCE library'))+', '+(s.nids||[]).length+' addresses',
   v:'', o:s});});
 if(sec==='law') SI.forEach(function(l,i){
  out.push({k:'law', t:l.nm, s:l.b, d:l.d||'seated at the '+l.b.toLowerCase(),
   v:(S.law[l.nm]!=null?S.law[l.nm].toFixed(1):''), o:l, j:i});});
 if(sec==='dom') DOMAINS.forEach(function(d,i){
  out.push({k:'dom', t:d.nm, s:d.r, d:d.d||'', v:(DOMAIN[i]||0).toFixed(2), o:d, j:i});});
 if(sec==='arch') ARCH.forEach(function(a,i){
  out.push({k:'arch', t:a.nm, s:'archetype', d:a.v||'', v:((r.aff[i]||0)*100).toFixed(0)+'%', o:a, j:i});});
 if(sec==='gate') verpRead().forEach(function(g){
  out.push({k:'gate', t:g.nm, s:g.side+' gate', d:g.d, v:g.pct?g.pct+'%':'', o:g});});
 if(sec==='harm') HARM.forEach(function(e){
  out.push({k:'harm', t:e.t, s:HARM_AX[e.a]||e.a, d:e.c+', '+e.ch, v:'', o:e});});
 if(sec==='gloss') GLOSS.forEach(function(g){
  out.push({k:'gloss', t:g.t, s:'', d:g.d, v:'', o:g});});
 if(sec==='seat') APC.forEach(function(c){
  var rel=0,emb=0; c.sub.forEach(function(x){rel+=x[1];emb+=x[2];});
  out.push({k:'seat', t:c.b, s:c.nv, d:c.d, v:rel+' released', o:c, emb:emb});});
 return out;}

const KB_SECS=[['addr','Addresses'],['fetter','Fetters'],['sab','Saboteurs'],
 ['law','Laws'],['dom','Domains'],['arch','Archetypes'],['gate','Gates'],['seat','The catalog'],
 ['harm','The 76 elements'],['gloss','Glossary']];

function kbMatch(row,q){
 if(!q)return true;
 return (row.t+' '+row.s+' '+row.d).toLowerCase().indexOf(q)>=0;}

function kbRender(){
 var host=document.getElementById('know'); if(!host)return;
 var q=KB_Q.trim().toLowerCase();
 var rows=kbRows(KB_SEC).filter(function(x){return kbMatch(x,q);});
 /* the count across every section, so search says what it found everywhere */
 var total=0, per={};
 KB_SECS.forEach(function(s){
  var n=kbRows(s[0]).filter(function(x){return kbMatch(x,q);}).length;
  per[s[0]]=n; total+=n;});

 var h='<div class="kb-top">'
  +'<div class="kb-hd"><div class="pm-eye">The knowledge base</div>'
  +'<h2 class="kb-h">Everything the instrument knows</h2>'
  +'<p class="kb-p">The same tables the reading runs on. Search any of it. Every row opens '
  +'the same detail the wheel opens, on the right.</p></div>'
  +'<div class="kb-search"><input type="search" id="kbq" placeholder="Search addresses, fetters, saboteurs, laws, domains" '
  +'value="'+esc(KB_Q)+'" aria-label="Search the knowledge base">'
  +(q?'<span class="kb-found">'+total+' match'+(total===1?'':'es')+'</span>':'')+'</div>'
  +'<div class="kb-tabs" role="tablist">'+KB_SECS.map(function(s){
    return '<button type="button" role="tab" class="kb-t'+(KB_SEC===s[0]?' on':'')+'" data-kb="'+s[0]+'" '
     +'aria-selected="'+(KB_SEC===s[0])+'">'+s[1]+(q?' <b>'+per[s[0]]+'</b>':'')+'</button>';}).join('')
  +'</div></div>';

 h+='<div class="kb-list">';
 if(!rows.length) h+='<div class="rnone">Nothing here matches. The count beside each tab says where it is.</div>';
 rows.forEach(function(x,i){
  var col=x.k==='seat'?x.t:(x.s&&BANDS.indexOf(x.s)>=0?x.s:'Heart');
  h+='<button type="button" class="kb-r" data-kbi="'+i+'">'
   +'<span class="kb-rc">'+cr(BANDS.indexOf(col)>=0?col:'Heart', 0, {size:'xs', raw:''})+'</span>'
   +'<span class="kb-rt"><b>'+esc(x.t)+'</b>'+(x.s?'<em>'+esc(x.s)+'</em>':'')+'</span>'
   +'<span class="kb-rd">'+esc(String(x.d||'').slice(0,150))+'</span>'
   +(x.v?'<span class="kb-rv">'+esc(x.v)+'</span>':'')
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
 if(x.k==='seat'){runSeatDrill(x.o); return;}}

/* the catalog entry for one seat. the counts are the clinical record, not a
   score, so they are stated as what was released and what installed. */
function runSeatDrill(c){
 var h='<div class="pm-eye">Seat</div><div class="ad-nm">'+esc(c.b)+'</div>'
  +'<div class="ad-sub">'+esc(c.nv)+'</div>'
  +'<div class="pm-eye">What encodes here</div><p class="ad-p">'+esc(c.d)+'</p>'
  +'<div class="pm-eye">The record</div><div class="ad-rows">'
  +c.sub.map(function(x){
    return '<div class="ad-r static"><span class="ad-k">'+esc(x[0])+'</span>'
     +'<span class="ad-m">'+x[1]+' released, '+x[2]+' installed</span></div>';}).join('')
  +'</div>'
  +'<div class="pm-eye">Addresses at this seat</div><div class="ad-rows">'
  +W.filter(function(n){return n.b===c.b;}).slice(0,10).map(addrRow).join('')+'</div>';
 rdShell(h);}

function runFetterDrill(c){
 var held=S.charge[c.nm]||0, inst=S.replace[c.nm]||0;
 var at=W.filter(function(n){return n.cf===c.nm;});
 var h='<div class="pm-eye">Child fetter</div><div class="ad-nm">'+esc(c.nm)+'</div>'
  +'<div class="ad-sub">toward '+esc(c.opp)+'</div>'
  +'<div class="pm-eye">Where it sits</div><p class="ad-p">'+esc(c.addr)+', at '+esc(c.loc)
  +'. Seated at the '+esc(c.seat).toLowerCase()+'.</p>'
  +'<div class="pm-eye">Both halves</div><p class="ad-p">Held <b>'+held.toFixed(1)+'</b>. '
  +esc(c.opp)+' installed <b>'+inst.toFixed(1)+'</b>. Release empties the address, the opposite is what fills it.</p>'
  +'<div class="pm-eye">It runs '+at.length+' addresses</div><div class="ad-rows">'
  +at.slice(0,10).map(addrRow).join('')
  +(at.length>10?'<div class="pm-more">and '+(at.length-10)+' more</div>':'')+'</div>';
 rdShell(h);}

/* a saboteur the reading is not currently carrying. it still has a definition. */
function runSabDrill(s){
 var pi=SAB_PI.indexOf(s.nm)>=0;
 var nodes=(s.nids||[]).map(function(i){return BY[i];}).filter(Boolean);
 var h='<div class="pm-eye">Saboteur, not running</div><div class="ad-nm">'+esc(s.nm)+'</div>'
  +'<div class="ad-sub">'+(s.unnamed?'Inferred from the connection types'
    :(pi?'One of the ten Positive Intelligence saboteurs, after Shirzad Chamine':'SOURCE library'))+'</div>'
  +'<div class="pm-eye">What it would take</div><p class="ad-p">It fires when its addresses carry at '
  +'once. Yours are not carrying enough for it to run, which is why it is here and not on the wheel.'
  +(s.hcx?' It compounds into <b>'+esc(s.hcx)+'</b>.':'')+'</p>'
  +kbSabBlock(s.nm)
  +'<div class="pm-eye">Made of</div><div class="ad-rows">'+nodes.map(addrRow).join('')+'</div>';
 rdShell(h);}

/* THE DOMAIN, read clear and read distorted. The book prints both readings
   for all nineteen. Four are under a different name in the engine, and the
   drill says both rather than picking one, because that ruling is not mine. */
function runDomDrill(d){
 var k=KB_KEY(d.nm), def=DOMDEF[k], alt=KB_RENAME[k];
 var h='<div class="pm-eye">Blueprint domain'+(def&&def.n?' '+def.n:'')+'</div>'
  +'<div class="ad-nm">'+esc(d.nm)+'</div>'
  +'<div class="ad-sub">'+esc(d.r)+' cluster'+(alt?', called '+esc(alt)+' in the codex':'')+'</div>';
 if(def){
  h+='<div class="pm-eye">Read clear</div><p class="ad-p">'+esc(def.c)+'</p>'
   +'<div class="pm-eye">Read distorted</div><p class="ad-p">'+esc(def.x)+'</p>';}
 else h+='<div class="pm-eye">What it is</div><p class="ad-p">'+esc(d.d||'')+'</p>';
 rdShell(h);}

/* the definition, the trigger and the interrupt. an interrupt is the only
   part a person can act on in the moment, so it is printed last and plainly. */
function kbSabBlock(nm){
 var def=SABDEF[KB_KEY(nm)]; if(!def)return '';
 return (def.d?'<div class="pm-eye">What it is</div><p class="ad-p">'+esc(def.d)+'</p>':'')
  +(def.t?'<div class="pm-eye">When it fires</div><p class="ad-p">'+esc(def.t)+'</p>':'')
  +(def.q?'<div class="pm-eye">What it says</div><p class="ad-p"><em>'+esc(def.q)+'</em></p>':'')
  +(def.i?'<div class="pm-eye">The interrupt</div><p class="ad-p">'+esc(def.i)+'</p>':'');}

function runKbDrill(eyebrow,title,sub,body){
 rdShell('<div class="pm-eye">'+esc(eyebrow)+'</div><div class="ad-nm">'+esc(title)+'</div>'
  +(sub?'<div class="ad-sub">'+esc(sub)+'</div>':'')
  +(body?'<div class="pm-eye">What it is</div><p class="ad-p">'+esc(body)+'</p>':''));}

/* ---- THE LETTING GO DECK ----
   Suits are the seven seats. Ranks are intensity, the charge at the address
   rounded to a whole number, so an ace is a one and the face cards are the
   heaviest thing a person carries. The deck is dealt from the field, never
   from the library, because a card a person is not carrying teaches nothing. */
var DECK_CARD=null;
function deckPool(){return W.filter(function(n){return n.sq>=4;});}
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
