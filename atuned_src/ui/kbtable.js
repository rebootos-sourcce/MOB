
/* ============================================================
   THE TABLE. The seventy six universal laws laid out the way the
   book calls them, "a periodic table, not a curriculum", at the top
   of the wisdom school. Built 21 November from the art review's
   direction A (dark), which was the default working direction: no
   pick among the four mockups is recorded anywhere this seat can
   read, so this is A pending his pick, and the layout below is the
   requirements list it was graded against, read off kb.js and never
   typed.

     the coherence formula      2 by 2, alone, centred, at the top
     the frame row              E76 and E75 at one and a half, and a
                                third cell drawn dashed, "To be
                                named", because which law sits there
                                is his and nobody else's
     the family bands           one tile each, HARM's own order, E01
                                to E74, every family on a new row and
                                a part full last row centred

   Nothing on this board is a percent. CQ is a percent and it is shown
   in the detail panel only, when the formula is the thing open, so the
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
function kbtIcOf(e){
 var si=(e.a==='spirit')?kbFind(SI,e.t):null;
 return (si&&si.ic)||(HARM_FAM[e.a]||{}).ic||GLOSS_IC;}
/* NOT YET CONFIRMED IN THE BOOK, read off the entry and not a list of codes:
   the three whose own text says "pending confirmation", which is E65, E67
   and E68 on this build. tests/engine.js holds the three by code, so the
   day the book confirms one and kb.js drops the words, the gate says so. */
function kbtUnconfirmed(e){return /pending confirmation/i.test(e.d||'');}
/* TWO LAWS ARE NAMED COHERENCE. E74 is the instrument, the measure family's
   sixth, and E76 is the frame's destination state; a tile that only said
   Coherence twice on one screen asks a person which one they read. */
function kbtSub(e){return (e.c==='E74')?'the instrument':'';}
/* THE MEANING IS THE BOOK'S OWN OPENING, in its own order. The text opens on
   fragments as often as on a sentence ("One field. One source."), and the
   first cut took the first sentence of six words or more, which pulled a line
   from the middle: Anger read "The track is: This is wrong." with the two
   sentences that say what anger is skipped over. So the line is the opening
   sentences, joined until they hold eight words, and the whole text is one
   press away on the full card. */
function kbtOne(d){
 var ss=String(d||'').match(/[^.!?]+[.!?]+/g)||[String(d||'')], o=[], n=0;
 for(var i=0;i<ss.length&&n<8;i++){o.push(ss[i].trim()); n+=ss[i].trim().split(/\s+/).length;}
 return o.join(' ');}
/* A LONG NAME BREAKS WHERE A PERSON WOULD HYPHENATE IT. At four tiles of 80
   on a phone the name has about 72 pixels at 13, and Acceptance, Anticipation
   and Accountability do not fit. hyphens:auto needs the browser's own
   dictionary and the Chromium the gates run did not have one, so the first
   cut broke them as "Acceptanc / e", measured at 390. A soft hyphen before a
   common ending is invisible until the line has to break there. */
var KBT_ENDS=['ability','ation','ance','ence','tion','ment','ness','ual','ity'];
function kbtName(t){
 return esc(t).split(' ').map(function(w){
  if(w.length<10)return w;
  for(var i=0;i<KBT_ENDS.length;i++){var k=w.toLowerCase().lastIndexOf(KBT_ENDS[i]);
   if(k>=4&&k+KBT_ENDS[i].length===w.length)return w.slice(0,k)+'&shy;'+w.slice(k);}
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
  +'<circle cx="24" cy="24" r="'+r+'" fill="none" stroke="'+col+'" stroke-opacity=".38" stroke-width="1.2" stroke-dasharray="2 3.2"/>'
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
  +'stroke-linecap="round" stroke-linejoin="round">'+glyphPath('M18 5H6l6 7-6 7h12')+'</svg></svg></span>';}
/* a family heading's ring: the same closing ring, small, in the band's colour */
function kbtHeadRing(a,t){
 var col=seatCol(kbtSeatOf(kbtOf(a)[0])), r=8, C=2*Math.PI*r, f=t.per[a].k/t.per[a].n;
 return '<svg class="kbt-hr" viewBox="0 0 20 20" aria-hidden="true">'
  +'<circle cx="10" cy="10" r="'+r+'" fill="none" stroke="'+col+'" stroke-opacity=".32" stroke-width="1.4"/>'
  +'<circle class="kbt-hf" cx="10" cy="10" r="'+r+'" fill="none" stroke="'+col+'" stroke-width="1.8" stroke-linecap="round" '
  +'stroke-dasharray="'+C.toFixed(2)+'" stroke-dashoffset="'+(C*(1-f)).toFixed(2)+'" transform="rotate(-90 10 10)"/></svg>';}

/* ---------- markup ---------- */
function kbtTile(e,frame){
 var seat=kbtSeatOf(e), col=seatCol(seat), seen=kbtIsSeen(e.c), un=kbtUnconfirmed(e), sub=kbtSub(e);
 var lbl=e.c+', '+e.t+(sub?', '+sub:'')+', '+kbtFamName(e.a)+(un?', not yet confirmed in the book':'')+(seen?', read':', not read');
 return '<button type="button" class="kbt-t'+(frame?' kbt-fr':'')+(un?' kbt-un':'')+(seen?' kbt-seen':'')+'" data-kbtc="'+esc(e.c)+'" '
  +'aria-label="'+esc(lbl)+'" style="--c:'+col+'"'
  +(un?' data-tip-k="'+esc(e.t)+'" data-tip="Not yet confirmed in the book"':'')+'>'
  +'<span class="kbt-c">'+esc(e.c)+'</span>'
  +kbtRing(kbtIcOf(e),col,seen,48)
  +'<span class="kbt-n" lang="en">'+kbtName(e.t)+'</span>'
  +(sub?'<span class="kbt-s">'+esc(sub)+'</span>':'')+'</button>';}
/* NO COUNT AGAINST A TOTAL ON THE BOARD, 21 November. The first cut printed
   "0 of 76 read", "0 of 7" for the families and "0 of 13" on each band, and
   tests/functional.js's count gate refused all of them at both widths: a
   tally against the size of a set is the score out of a possible score that
   ruling bans, and the brief's own cut list already named "of 76 read". So
   the board says how many were read and stops; how far there is to go is
   what the rings and the formula's arcs already draw. The aria-labels keep
   the whole sentence for a screen reader, which is not printed copy. */
function kbtScore(t){
 return '<div class="kbt-sc"'+' data-tip-k="The table" data-tip="Each tile is one universal law. Its code, E01 to E'
  +HARM.length+', is its place in the book\'s own table. Open a tile to read it, and its ring closes." tabindex="0">'
  +'<span class="kbt-scn"><b>'+t.n+'</b> read</span></div>'
  +'<ul class="kbt-tiers">'
  +'<li class="kbt-tier'+(t.unlocked?' on':'')+'" data-tip-k="Families unlocked" data-tip="A family opens when you read its first law." tabindex="0">'
  +'<span class="kbt-tl">Families unlocked</span><span class="kbt-tv">'+t.unlocked+'</span></li>'
  +'<li class="kbt-tier'+(t.done?' on':'')+'" data-tip-k="Families read" data-tip="Every law in the family read. Its heading ring closes." tabindex="0">'
  +'<span class="kbt-tl">Families read</span><span class="kbt-tv">'+t.done+'</span></li>'
  +'<li class="kbt-tier'+(t.grand?' on':'')+'" data-tip-k="The formula closed" data-tip="All seven arcs on the formula close when every family is read." tabindex="0">'
  +'<span class="kbt-tl">The formula closed</span><span class="kbt-tv">'+(t.grand?'Yes':'Not yet')+'</span></li>'
  +'</ul>';}
/* the detail panel's content for one law, or for the formula when c is 'cq' */
function kbtDetail(c){
 if(!c||c==='cq'){
  var r=compute(), cq=(!kbUnread()&&r.answered)?pct('cq',r.CQ):null;
  return '<div class="kbt-dh">'+kbtArcs(kbtTally(),64)+'<div><div class="kbt-dn">The coherence formula</div>'
   +'<div class="kbt-df">What the laws add up to</div></div></div>'
   +'<p class="kbt-dd">'+SI.length+' laws, each 0 to 10, added up and read as a percent of the most they can hold.</p>'
   +(cq!=null?'<div class="kbt-cq"><span class="kbt-cqv">'+cq+'%</span><span class="kbt-cql">'
     +unp('CQ','CQ, your coherence quotient')+'</span></div>'
     :'<div class="kbt-cq"><span class="kbt-cql">Your CQ, the coherence quotient, fills as you answer the laws.</span></div>')
   +'<div class="kbt-da"><button type="button" class="btn" data-kbtgo="cq">Open the full card</button>'
   +(KBT.open?'<button type="button" class="btn" data-kbtx>Close</button>':'')+'</div>';}
 var e=HARM.filter(function(x){return x.c===c;})[0]; if(!e)return '';
 var col=seatCol(kbtSeatOf(e)), line=kbtFamLine(e.a), sub=kbtSub(e);
 return '<div class="kbt-dh" style="--c:'+col+'">'+kbtRing(kbtIcOf(e),col,kbtIsSeen(c),56)
  +'<div><div class="kbt-dn">'+esc(e.t)+(sub?' <span class="kbt-ds">'+esc(sub)+'</span>':'')+'</div>'
  +'<div class="kbt-df">'+esc(e.c)+' · '+esc(kbtFamName(e.a))+(line?', '+esc(line):'')+'</div></div></div>'
  +'<p class="kbt-dd">'+esc(kbtOne(e.d))+'</p>'
  +(kbtUnconfirmed(e)?'<p class="kbt-dnote">Not yet confirmed in the book.</p>':'')
  +(KBT_FILM[c]?'<div class="kbt-film"><span class="kbt-fi" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    +'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z M10 9.5v5l4-2.5z"/></svg></span>'
    +'<span>A film of this law exists. It is not attached yet.</span></div>':'')
  +'<div class="kbt-da"><button type="button" class="btn" data-kbtgo="'+esc(c)+'">Open the full card</button>'
  +(KBT.open?'<button type="button" class="btn" data-kbtx>Close</button>':'')+'</div>';}
function kbtHtml(){
 var t=kbtTally();
 var h='<div class="kbt-w"><section class="kbt'+(KBT.open?' open':'')+'" id="kbt" aria-label="The table of universal laws">'
  +'<div class="kbt-top">'
  +'<div class="kbt-l">'+kbtScore(t)+'</div>'
  +'<button type="button" class="kbt-f kbt-dim'+(t.grand?' kbt-grand':'')+'" data-kbtc="cq" '
  +'aria-label="The coherence formula, '+t.done+' of '+t.fams.length+' arcs closed">'
  +kbtArcs(t,0)+'<span class="kbt-fn">The coherence formula</span></button>'
  +'<aside class="kbt-dt" id="kbtdt" aria-live="polite">'+kbtDetail(KBT.open||KBT.hover)+'</aside>'
  +'</div>'
  +'<div class="kbt-frame kbt-dim">'
  +HARM.filter(function(e){return e.a==='meta';}).slice().reverse().map(function(e){return kbtTile(e,true);}).join('')
  /* the third law of the frame is not named, and the cell says so rather
     than holding a guess. It is not a tile: nothing opens and nothing counts. */
  +'<div class="kbt-t kbt-fr kbt-tbn" aria-label="A third law of the frame, to be named"><span class="kbt-n">To be named</span></div>'
  +'</div>';
 t.fams.filter(function(a){return a!=='meta';}).forEach(function(a){
  var line=kbtFamLine(a), p=t.per[a];
  h+='<div class="kbt-band kbt-dim" data-kbtb="'+esc(a)+'">'
   +'<div class="kbt-bh'+(p.k?' on':'')+(p.k===p.n?' done':'')+'">'+kbtHeadRing(a,t)
   +'<span class="kbt-bn">'+esc(kbtFamName(a))+'</span>'+(line?'<span class="kbt-bl">'+esc(line)+'</span>':'')
   +'<span class="kbt-bk">'+p.k+' read</span></div>'
   +'<div class="kbt-g">'+kbtOf(a).map(function(e){return kbtTile(e,false);}).join('')+'</div></div>';});
 return h+'</section></div>';}

/* ---------- behaviour ---------- */
function kbtPanel(c){var d=document.getElementById('kbtdt'); if(d)d.innerHTML=kbtDetail(c); kbtPanelWire();}
function kbtPanelWire(){
 var d=document.getElementById('kbtdt'); if(!d)return;
 d.querySelectorAll('[data-kbtgo]').forEach(function(b){b.onclick=function(){
  var c=b.getAttribute('data-kbtgo');
  if(c==='cq'){kbOpen(kbFormulaRow()); return;}
  var row=kbRows('harm').filter(function(x){return x.o.c===c;})[0]; if(row)kbOpen(row);};});
 var x=d.querySelector('[data-kbtx]'); if(x)x.onclick=function(){kbtClose(true);};}
/* the open tile's ring, the band heading and the formula's arcs, repainted in
   place so a closing ring transitions rather than snapping with a rewrite */
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
  fx.setAttribute('aria-label','The coherence formula, '+t.done+' of '+t.fams.length+' arcs closed');}
 var l=b.querySelector('.kbt-l'); if(l){l.innerHTML=kbtScore(t);}}
/* CLICK OPENS THE PANEL GROWING FROM THE TILE. The panel is laid out where it
   lives and starts at the tile's own box, 400ms on the house's landing curve,
   while the grid stays exactly where it is and dims. A phone has the panel
   under the formula, so it is scrolled into view first and grows from where
   the tile is after the scroll. Reduced motion lands it in place. */
function kbtOpen(c,tile){
 var was=KBT.open; KBT.open=c; KBT.hover=null;
 var b=document.getElementById('kbt'); if(!b)return;
 if(c!=='cq'&&!kbtIsSeen(c)){
  var kept=kbtMark(c);
  if(!kept&&typeof status==='function')status('Read on this visit. This browser is not keeping it.');}
 b.classList.add('open');
 b.querySelectorAll('[data-kbtc]').forEach(function(el){el.classList.toggle('kbt-on',el.getAttribute('data-kbtc')===c);
  if(el.getAttribute('data-kbtc')===c)el.setAttribute('aria-expanded','true'); else el.removeAttribute('aria-expanded');});
 kbtPanel(c); kbtRepaint();
 var d=document.getElementById('kbtdt'); if(!d)return;
 var pr=d.getBoundingClientRect();
 /* the page scrolls inside the stage and not the window, so in view is read
    against the scroller's own box: checked against the window, a panel
    tucked under the header read as on screen and opened with its name cut
    off, measured at 1600 */
 var sc=d.parentElement; while(sc&&sc!==document.body){var ov=getComputedStyle(sc).overflowY;
  if((ov==='auto'||ov==='scroll')&&sc.scrollHeight>sc.clientHeight)break; sc=sc.parentElement;}
 var vr=(sc&&sc!==document.body)?sc.getBoundingClientRect():{top:0,bottom:innerHeight};
 if(pr.top<Math.max(0,vr.top)||pr.bottom>Math.min(innerHeight,vr.bottom)){
  try{d.scrollIntoView({block:'nearest'});}catch(e){} pr=d.getBoundingClientRect();}
 if(!rbStill()&&d.animate&&tile&&was!==c){
  var tr=tile.getBoundingClientRect();
  d.animate([{transformOrigin:'0 0',transform:'translate('+(tr.left-pr.left).toFixed(1)+'px,'+(tr.top-pr.top).toFixed(1)+'px) scale('
    +(tr.width/pr.width).toFixed(3)+','+(tr.height/pr.height).toFixed(3)+')',opacity:.4},
   {transformOrigin:'0 0',transform:'none',opacity:1}],{duration:400,easing:'cubic-bezier(.22,1,.36,1)'});
  [].forEach.call(d.children,function(k){k.animate([{opacity:0},{opacity:0,offset:.45},{opacity:1}],{duration:400,easing:'linear'});});}
 var x=d.querySelector('[data-kbtx]'); if(x){try{x.focus({preventScroll:true});}catch(e){x.focus();}}}
/* closing returns focus to the tile that opened it, so a keyboard is put back
   exactly where it was */
function kbtClose(focus){
 var c=KBT.open; if(!c)return; KBT.open=null;
 var b=document.getElementById('kbt'); if(!b)return;
 b.classList.remove('open');
 b.querySelectorAll('.kbt-on').forEach(function(el){el.classList.remove('kbt-on'); el.removeAttribute('aria-expanded');});
 kbtPanel(null);
 var t=b.querySelector('[data-kbtc="'+c+'"]');
 if(focus&&t){try{t.focus({preventScroll:true});}catch(e){t.focus();}}}
function kbtWire(){
 var b=document.getElementById('kbt'); if(!b)return;
 b.querySelectorAll('[data-kbtc]').forEach(function(el){
  var c=el.getAttribute('data-kbtc');
  el.onclick=function(){if(KBT.open===c)kbtClose(true); else kbtOpen(c,el);};
  /* pointing previews in the panel without opening or marking anything */
  var peek=function(){if(KBT.open||KBT.hover===c)return; KBT.hover=c; kbtPanel(c);};
  el.addEventListener('mouseenter',peek); el.addEventListener('focus',peek);});
 b.addEventListener('mouseleave',function(){if(KBT.open||!KBT.hover)return; KBT.hover=null; kbtPanel(null);});
 b.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&KBT.open){ev.stopPropagation(); kbtClose(true);}});
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
  /* the board measures itself: eight columns of 104 with 16 between on a
     wide pane, four of 80 with 12 between on a phone, and in between the
     tiles shrink with the pane rather than the row overflowing it */
  '.kbt-w{container-type:inline-size;margin:0 0 28px}',
  '.kbt{--kt:104px;--kg:16px;--kcols:8;margin:0 auto;',
  ' width:min(100%,calc(var(--kt)*var(--kcols) + var(--kg)*(var(--kcols) - 1)));display:flex;flex-direction:column;gap:var(--kg)}',
  '.kbt-top{display:grid;grid-template-columns:minmax(0,1fr) calc(var(--kt)*2 + var(--kg)) minmax(0,1fr);gap:var(--kg);align-items:stretch}',
  '.kbt-l{display:flex;flex-direction:column;justify-content:center;gap:12px;padding:16px;border:1px solid var(--edge);border-radius:var(--r-s);background:var(--panel)}',
  '.kbt-sc{font-size:15px;color:var(--dim)}',
  '.kbt-sc b{font-size:28px;font-weight:600;color:var(--ink);margin-right:2px}',
  '.kbt-tiers{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.kbt-tier{display:flex;justify-content:space-between;gap:12px;font-size:13px;color:var(--dim)}',
  '.kbt-tier.on{color:var(--ink)}',
  '.kbt-tv{font-variant-numeric:tabular-nums}',
  /* the formula, 2 by 2, alone and centred */
  '.kbt-f{all:unset;box-sizing:border-box;cursor:pointer;width:100%;aspect-ratio:1;align-self:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;',
  ' padding:16px;border-radius:var(--r-s);background:color-mix(in srgb,'+KBT_FORMULA+' 12%,var(--panel));',
  ' box-shadow:inset 0 0 0 1px color-mix(in srgb,'+KBT_FORMULA+' 40%,transparent)}',
  '.kbt-f .kbt-fx{width:62%;height:auto;aspect-ratio:1}',
  '.kbt-fx{display:block}.kbt-fx>svg{display:block;width:100%;height:100%}',
  '.kbt-fn{font-size:15px;font-weight:500;color:var(--ink);text-align:center}',
  '.kbt-f.kbt-grand{box-shadow:inset 0 0 0 1.5px '+KBT_FORMULA+'}',
  /* the detail panel, beside the formula on a wide pane */
  '.kbt-dt{box-sizing:border-box;padding:16px;border:1px solid var(--edge);border-radius:var(--r-s);background:var(--panel);',
  ' display:flex;flex-direction:column;gap:10px;min-width:0}',
  '.kbt-dh{display:flex;align-items:center;gap:12px}',
  '.kbt-dh .kbt-fx{flex:0 0 auto}',
  '.kbt-dn{font-size:16px;font-weight:600;color:var(--ink)}',
  '.kbt-ds{font-size:13px;font-weight:400;color:var(--dim)}',
  '.kbt-df{font-size:12.5px;color:var(--dim);margin-top:2px}',
  '.kbt-dd{margin:0;font-size:14px;line-height:1.45;color:var(--ink)}',
  '.kbt-dnote{margin:0;font-size:13px;color:var(--dim)}',
  '.kbt-film{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--dim);padding:8px 10px;border:1px dashed var(--edge-2);border-radius:var(--r-xs)}',
  '.kbt-fi{display:inline-flex;width:20px;height:20px}.kbt-fi svg{width:100%;height:100%}',
  '.kbt-cq{display:flex;align-items:baseline;gap:8px;font-size:13px;color:var(--dim)}',
  '.kbt-cqv{font-size:22px;font-weight:600;color:var(--ink)}',
  '.kbt-da{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto}',
  '.kbt-da .btn{min-height:var(--tap)}',
  /* the rows. flex, not grid, because a part full last row is centred */
  '.kbt-frame,.kbt-g{display:flex;flex-wrap:wrap;justify-content:center;gap:var(--kg)}',
  '.kbt-band{display:flex;flex-direction:column;gap:12px}',
  '.kbt-bh{display:flex;align-items:center;gap:8px;min-height:24px;color:var(--dim);font-size:13px}',
  '.kbt-bh.on .kbt-bn{color:var(--ink)}',
  '.kbt-hr{width:20px;height:20px;flex:0 0 auto}',
  '.kbt-bn{font-size:14px;font-weight:600}',
  '.kbt-bl{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
  '.kbt-bk{margin-left:auto;font-variant-numeric:tabular-nums}',
  /* the tile: code top left, the mark at 40 centred inside its read ring, the
     name at 13 in ink, which carries its contrast on the tint at every seat */
  '.kbt-t{all:unset;box-sizing:border-box;position:relative;cursor:pointer;width:calc((100% - var(--kg)*(var(--kcols) - 1))/var(--kcols));',
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
  /* the frame row is one and a half */
  '.kbt-fr{width:calc(var(--kt)*1.5);max-width:calc((100% - var(--kg)*2)/3);min-height:calc(var(--kt)*1.2)}',
  '.kbt-tbn{cursor:default;justify-content:center;background:transparent;outline:1px dashed var(--edge-2)}',
  '.kbt-tbn .kbt-n{color:var(--dim)}',
  /* open: the grid holds still and dims; the open tile and the panel do not */
  '.kbt-dim,.kbt-t{transition:opacity .4s cubic-bezier(.22,1,.36,1)}',
  '.kbt.open .kbt-dim .kbt-t:not(.kbt-on),.kbt.open .kbt-f:not(.kbt-on){opacity:.35}',
  '.kbt-on{outline-width:1.5px;outline-color:var(--c)}',
  '@media (prefers-reduced-motion:reduce){.kbt-rf,.kbt-hf,.kbt-dim,.kbt-t{transition:none}}',
  'body.quiet .kbt-rf,body.rm .kbt-rf,body.quiet .kbt-hf,body.rm .kbt-hf,body.quiet .kbt-t,body.rm .kbt-t{transition:none}',
  /* .kbt-rg, .kbt-arc, .kbt-scn, .kbt-tl and .kbt-cql name parts the draw
     code and the gates find (the read ring, the formula's seven arcs, the
     score, the tier label, the CQ line) and carry no look of their own; the
     look is the parent's. Named here so the design gate's coverage check,
     which reads a class only off a selector that names it, finds them, the
     way .gate-r is named in shell/head.html. */
  '.kbt-rg{}.kbt-arc{}.kbt-scn{}.kbt-tl{}.kbt-cql{}',
  /* a phone: four of 80 with 12 between, and the panel under the formula.
     The overrides are scoped under .kbt and not written as bare classes: the
     first cut wrote .kbt-f, .kbt-dt, .kbt-l and .kbt-t bare a second time in
     here, and tests/design.js's "declared twice with geometry" check, which
     walks @container rules, read each as a second claim on the word. .kbt-fr
     is scoped too so it still lands after .kbt .kbt-t and keeps 112. */
  '@container (max-width:600px){',
  ' .kbt{--kt:80px;--kg:12px;--kcols:4}',
  ' .kbt-top{grid-template-columns:minmax(0,1fr);justify-items:center}',
  ' .kbt .kbt-f{width:calc(var(--kt)*2 + var(--kg));order:1}',
  ' .kbt .kbt-dt{order:2;width:100%}',
  ' .kbt .kbt-l{order:3;width:100%}',
  ' .kbt .kbt-t{padding:15px 4px 7px;min-height:118px}',
  ' .kbt .kbt-fr{min-height:112px}',
  ' .kbt-bl{display:none}}'
 ].join('\n');
 document.head.appendChild(st);}
