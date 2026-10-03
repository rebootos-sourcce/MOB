/* ============================================================
   CHARACTER. The five masks as one person made of points, inside a torus of
   light that is the health of their body.

   THIS IS THE FIFTH BUILD OF THIS PAGE AND IT REPLACES THE FOURTH IN FULL. The
   fourth (round LP, 7220610 to NK) drew each mask as a pixel grid, a face cut
   out of a grid with the chain lighting pixels. On 1 October, rounds ON to OW,
   the owner took it apart: "the face designs are terrible, they look like stick
   figures", "each mask is symbolic on its own", "the point cloud is the mask
   and the aura is the radiance", and then the pick: Orbit with a torus. The
   grids, the Dark and Light switch, the weave and the pixel hover are gone with
   it, and so is chRead, which only they used. What the old page held that is
   still true is kept: the lock, the integer 11 and the host #masksview, the
   last mask a person opened, and the one-line summary of a mask in Selection.

   WHAT IS WHERE, ruled in round PE: "all information is on the right hand side:
   nothing but the figure, the field and the overlay row in the centre panel".
   The stage carries the canvas, the five mask icons at the upper left and four
   toggles at the upper right, and no text at all; a control says what it is on
   hover through the product's own tooltip, and says so to a screen reader. The
   leading pattern, the mask and what it does, the coherence and vitality
   readings, the seven seats, what the points are, the address under the
   pointer and the trace card are all in the right rail, in the section
   data-sec="chr", which is the only section the rail shows on this page besides
   Selection, the way it is on the Story. On a phone the rail is under the
   stage, so the text reads under the picture and never over it.

   THE FOUR TOGGLES, round PE: Point cloud, Torus, Heat map and Trace. The
   first three are overlays and each is a real button, 44 pixels, a ring icon,
   lit when on and dim when off, kept in the browser's store with the other view
   preferences ('chov'). The cloud and the torus are on by default and the heat
   map is off. Trace is a mode and is not remembered.

   WHAT DRIVES IT, from the engine and from nothing typed here:
     the shape   the nine pattern weights, S.charge, and the mask picked
     the density the 112 charges, NODES[i].sq, through addrField. The sniffer
                 writes the charges out of the stories, compute() makes them
                 sq, so the cloud changes as stories are written
     the light   coherence, r.CQ over a hundred, the number the left menu shows
     the breath  Vitality, r.X, the number the left menu shows. The mapping is
                 engine/charfield.js charOscillation and is stated there
     the seats   seatField and charSeatState: the mean charge of each seat's
                 addresses and its integrity, bandIg, bend the torus there
   and the page OPENS DIM AND GROWS LIT over about two seconds to the real
   level, every time it is entered (charGrow), so a person watches their own
   coherence arrive.

   THE LOCK IS UNCHANGED. The masks are the tier's (SIGHT, engine/plan.js, key
   mask), ruled 1 October: "they can't see ... the child masks". Below the tier
   that carries them the host holds the lock's own panel and nothing drawn, the
   door is greyed (lockTabs) and the rail's section is empty.
   ============================================================ */

/* the page's own state. CHV and not CH: CH is the Field canvas's height, a let
   in ui/component.js, and a second declaration threw at parse once and took
   every module after it with it. pick is the mask on screen and is never null
   once the page has rendered; it is also what ui/drills.js sets when a Runs
   under row names a mask. sel is the seat being traced and selAddr the address
   a person pressed, -1 for neither. */
var CHV={pick:null, sel:-1, selAddr:-1, sc:null, ov:null, r:null, raf:0, last:0, live:false, dirty:true,
 rail:'', hov:-1, perf:{n:0,ms:0,max:0}, tg:null, built:false};
/* the three overlays and the key they are kept under in the store */
var CH_OVERLAYS=[
 {k:'cloud', nm:'Point cloud', on:true,
  d:'The person and the 112 addresses round them, as points.'},
 {k:'torus', nm:'Torus', on:true,
  d:'The field round the body. The seats bend it and vitality makes it breathe.'},
 {k:'heat', nm:'Heat map', on:false,
  d:'The body coloured by the charge it carries, cool to hot.'}];
/* ring icons, 24 by 24, stroked and never filled. A ring of dots, an apple
   torus with its axis, a heat ring that is dense at the middle, and the trace
   mark the rest of the product already wears. */
var CH_IC={
 cloud:'<circle cx="12" cy="12" r="2.4"/><circle cx="12" cy="12" r="6.6" stroke-dasharray="0.1 3" stroke-width="2.2"/><circle cx="12" cy="12" r="10" stroke-dasharray="0.1 3.6" stroke-width="2"/>',
 torus:'<ellipse cx="12" cy="12" rx="9.4" ry="5.2"/><ellipse cx="12" cy="12" rx="4" ry="9.4"/><path d="M12 2.6v18.8" stroke-dasharray="1 3"/>',
 heat:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.6"/><circle cx="12" cy="12" r="2.2"/>',
 trace:'M7 7.5m-2.4 0a2.4 2.4 0 104.8 0a2.4 2.4 0 10-4.8 0M17 16.5m-2.4 0a2.4 2.4 0 104.8 0a2.4 2.4 0 10-4.8 0M8.9 9l6.2 6M17 7h3M4 17h3'};

/* a count and a noun, and a list in words. drills.js reads both. */
function chPl(n,one,many){return n+' '+(n===1?one:many);}
function chAnd(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
function chSentence(v){v=String(v||'');return v.charAt(0).toUpperCase()+v.slice(1)+'.';}
function chSeatWord(b){return b==='3rd Eye'?'3rd eye':String(b).toLowerCase();}
function chSeats(m){return m.b.map(chSeatWord).join(' and ');}
function chMon(t){var d=new Date(t);if(isNaN(d.getTime()))return '';
 return d.getDate()+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];}

/* WHICH MASK OPENS. "It always starts off on the user's last open. First time
   users start off on child" (MX). CHV.pick only lives for this session's
   module, so a second visit with CHV.pick still null reads the one small
   preference this page keeps on the profile, CURP.ui.chmask, written by uiSet
   like every other UI preference (ui/account.js). A name the profile does not
   recognise, an older save or a hand edited one, falls back to the first of the
   roster rather than throwing, and the first is Child today because canon.js
   lists it there and not because this reads a position that happens to be
   zero. */
function chLast(){
 var v=(typeof CURP!=='undefined'&&CURP&&CURP.ui&&CURP.ui.chmask)||'';
 return MASKS_READ.some(function(m){return m.nm===v;})?v:MASKS_READ[0].nm;}
/* WHO THE PICK WAS MADE FOR. "The user's last open" is that user's: CHV.pick
   was read once a session, so switching profile carried the last person's
   mask onto the next one and never read their own CURP.ui.chmask. It is read
   again whenever the profile on screen is not the one it was read for. */
function chWho(){return (typeof CURP!=='undefined'&&CURP)?(CURP.id||CURP.name||''):'';}
/* a seat's name standing on its own as a label, which takes a capital. The
   lower case form above is for the middle of a sentence. */
function chSeatName(b){var s=chSeatWord(b);return s.charAt(0).toUpperCase()+s.slice(1);}

/* THE OVERLAYS, kept in the browser's store like the other view preferences
   (STORE, 'fview', 'bmov'). Nothing stored means the defaults above. A store
   that cannot be read or written leaves the defaults and the page still
   draws: a preference is a convenience and never a reason for the page to
   fail. 'none' is written when all three are off, because an empty string
   cannot be told from a store that never held the key. */
function chOvGet(){
 var s=null; try{s=STORE.get('chov');}catch(e){}
 var o={}; CH_OVERLAYS.forEach(function(x){o[x.k]=x.on;});
 if(s===null||s===undefined||s==='')return o;
 var on={}; String(s).split(',').forEach(function(k){on[k]=1;});
 CH_OVERLAYS.forEach(function(x){o[x.k]=!!on[x.k];});
 return o;}
function chOvSave(o){
 var l=CH_OVERLAYS.filter(function(x){return o[x.k];}).map(function(x){return x.k;});
 try{STORE.set('chov',l.length?l.join(','):'none');}catch(e){}}

/* THE NUMBERS THE SCENE IS FED, read off the engine on every render and off
   nothing else. r is the reading render() just took. */
function chData(r){
 var w={}; CHILD.forEach(function(c){w[c.nm]=+S.charge[c.nm]||0;});
 var AF=addrField(), ach=new Float32Array(112), SF=seatField();
 AF.forEach(function(a,j){ach[j]=a.sq/10;});
 var unread=!r||!!r.unread;
 return {w:w, ach:ach, ig:SF.map(function(s){return s.ig;}), unread:unread, mask:CHV.pick,
  coh:unread?0:clamp((+r.CQ||0)/100,0,1),
  /* VITALITY IS r.X, the figure the left menu prints beside the leaf. A reading
     nobody has made yet is unread, the menu prints a dash for it, and the torus
     holds flat: a breath with nothing to be the breath of. */
  vit:unread?0:clamp(+r.X||0,0,1)};}

/* ============================================================
   THE STAGE, built once. The scene's canvas goes in first, then the mask icons
   upper left and the toggles upper right, each a real button and none of them
   with text in it.
   ============================================================ */
/* one mask icon. The ring is a gradient from the mask's first seat to its last,
   the wash behind the sign is the same two colours, the arc is how loaded the
   mask is, and the sign inside is that mask's own symbol with Orbit's tilted
   orbit through it. Nothing about a mask is tied to a row of the left menu:
   round OR, "don't link the masks to Vitality and Awareness and stuff like
   that". The description is on hover through the one tooltip. */
function chMaskBtn(m){
 var c=CHC.maskCols(m), R=26, C=2*Math.PI*R, id=m.nm.replace(/\W/g,'');
 return '<button type="button" class="chp-mk" data-chmask="'+esc(m.nm)+'" aria-pressed="false" aria-label="'+esc(m.nm)+' mask. '+esc(m.v)+'"'
  +' data-tip-t="'+esc(m.nm)+'" data-tip="'+esc(chSeats(m).charAt(0).toUpperCase()+chSeats(m).slice(1)+'. '+chSentence(m.v))+'" style="--mc1:'+c[0]+';--mc2:'+c[1]+';--c:'+c[0]+'">'
  +'<svg viewBox="0 0 60 60" aria-hidden="true"><defs>'
  +'<linearGradient id="chlg'+id+'" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient>'
  +'<radialGradient id="chrg'+id+'" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="'+c[1]+'" stop-opacity=".34"/><stop offset=".6" stop-color="'+c[0]+'" stop-opacity=".16"/><stop offset="1" stop-color="'+c[0]+'" stop-opacity=".05"/></radialGradient></defs>'
  +'<circle class="wash" cx="30" cy="30" r="27" fill="url(#chrg'+id+')"/>'
  +'<circle cx="30" cy="30" r="'+R+'" fill="none" stroke="url(#chlg'+id+')" stroke-width="2" opacity=".4"/>'
  +'<circle class="ld" cx="30" cy="30" r="'+R+'" fill="none" stroke="url(#chlg'+id+')" stroke-width="3" stroke-linecap="round" transform="rotate(-90 30 30)" stroke-dasharray="0 '+C.toFixed(1)+'"/>'
  +'<g transform="translate(14 14) scale(.875)" fill="none" stroke="url(#chlg'+id+')" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+CHC.glyph(m.nm)+'</g></svg></button>';}
function chOvBtn(k,nm,d,ic,pressed){
 return '<button type="button" class="chp-ob" data-chov="'+k+'" aria-pressed="'+pressed+'" aria-label="'+esc(nm)+'" data-tip-t="'+esc(nm)+'" data-tip="'+esc(d)+'">'
  +'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
  +(ic.charAt(0)==='<'?ic:'<path d="'+ic+'"/>')+'</svg></button>';}

function chBuild(host){
 if(CHV.built&&host.querySelector('.chp-stage')&&CHV.sc)return;
 CHV.ov=chOvGet();
 host.innerHTML='<div class="chp"><div class="chp-stage" id="chpstage">'
  +'<div class="chp-masks" role="group" aria-label="Masks">'+MASKS_READ.map(chMaskBtn).join('')+'</div>'
  +'<div class="chp-ovs" role="group" aria-label="Overlays">'
  +CH_OVERLAYS.map(function(x){return chOvBtn(x.k,x.nm,x.d,CH_IC[x.k],CHV.ov[x.k]);}).join('')
  +chOvBtn('trace','Trace','Where the energy leaks. Press a seat on the field to trace it.',CH_IC.trace,false)
  +'</div></div></div>';
 var stage=host.querySelector('.chp-stage');
 var sc=CHV.sc=new CHC.Scene(stage,{});
 sc.ov=CHV.ov; sc.cv.setAttribute('aria-label','Your field: a person made of points inside a torus of light. The reading is in the right panel.');
 CHV.built=true; CHV.sel=-1; CHV.selAddr=-1; CHV.rail=''; CHV.hov=-1;
 chWire(host,stage,sc);}

/* every listener goes on once, on elements that outlive a render: the canvas
   and the buttons are written by chBuild alone and chBuild writes them once */
function chWire(host,stage,sc){
 var cv=sc.cv;
 var seatAt=function(e){var r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
  return {a:sc.nearAddr(px,py,sc.mobile?22:15),px:px,py:py};};
 cv.addEventListener('pointermove',function(e){
  var h=seatAt(e), seat=h.a<0?sc.near(h.px,h.py,sc.mobile?46:38):-1;
  if(h.a!==sc.hovAddr||seat!==sc.hov){sc.hovAddr=h.a;sc.hov=seat;CHV.dirty=true;chHover(h.a,seat);}
  cv.classList.toggle('hit',h.a>=0||seat>=0);});
 cv.addEventListener('pointerleave',function(){sc.hov=-1;sc.hovAddr=-1;CHV.dirty=true;chHover(-1,-1);cv.classList.remove('hit');});
 /* a press on a point traces the seat it belongs to and names the address, a
    press on the body traces that seat, and a press on nothing puts the trace
    down. A finger has no hover, so on a touch screen the press is the only
    way to ask which address a point is, and the rail answers it. */
 cv.addEventListener('click',function(e){
  var h=seatAt(e);
  if(h.a>=0){chTrace(CHC.addr()[h.a].seat,h.a);return;}
  var seat=sc.near(h.px,h.py,sc.mobile?46:38);
  if(seat>=0){chTrace(CHV.sel===seat?-1:seat);return;}
  if(CHV.sel>=0)chTrace(-1);});
 host.querySelectorAll('[data-chmask]').forEach(function(b){b.onclick=function(){
  var m=maskOf(b.getAttribute('data-chmask')); if(!m)return;
  CHV.pick=m.nm;
  if(typeof uiSet==='function')uiSet('chmask',m.nm);
  render();};});
 host.querySelectorAll('[data-chov]').forEach(function(b){b.onclick=function(){
  var k=b.getAttribute('data-chov');
  if(k==='trace'){chTrace(CHV.sel>=0?-1:chLeakFirst());return;}
  CHV.ov[k]=!CHV.ov[k]; sc.ov=CHV.ov; sc.heatDirty=true; chOvSave(CHV.ov);
  b.setAttribute('aria-pressed',CHV.ov[k]?'true':'false'); CHV.dirty=true;
  chRail(CHV.r);};});}
function maskOf(nm){return MASKS_READ.filter(function(m){return m.nm===nm;})[0]||null;}

/* TRACE. Press the toggle or a seat. The torus stops turning so the markers
   stay put, every other seat dims in the cloud and in the points, a ring marks
   each place the flow leaves (at most three) and a dotted thread runs from the
   chosen leak toward the right panel, where the card is. A leak is a closed
   seat, so the ones marked are the seats with the most shadow. The first press
   of the toggle goes to the heaviest leak, or to the first seat the mask is
   worn over when nothing is leaking. */
function chLeakFirst(){
 var sc=CHV.sc; if(!sc)return 0;
 var st=CHC.seatState(sc,true).st;
 if(st.leaks.length)return st.leaks[0];
 return BANDS.indexOf(maskOf(CHV.pick).b[0]);}
function chTrace(k,addr){
 var sc=CHV.sc; if(!sc)return;
 CHV.sel=k; CHV.selAddr=k>=0&&addr!==undefined?addr:-1;
 sc.setSel(CHV.sel,CHV.selAddr); CHV.dirty=true;
 var host=$('masksview');
 if(host){host.classList.toggle('chp-tracing',k>=0);
  var b=host.querySelector('[data-chov="trace"]'); if(b)b.setAttribute('aria-pressed',k>=0?'true':'false');}
 chRail(CHV.r);
 chAnchor();
 /* ON A PHONE THE CARD IS NOT UNDER THE STAGE. The left menu sits between
    them, so the trace card opened about 480 pixels below the bottom of the
    stage at 390 wide, measured, and a press on the field changed nothing a
    person could see except the field. The card is brought to them. */
 if(sc.mobile&&k>=0){var cd=document.querySelector('#charrail .chr-trace');
  if(cd&&cd.scrollIntoView){try{cd.scrollIntoView({block:'start',behavior:rbStill()?'auto':'smooth'});}catch(e){cd.scrollIntoView();}}}}
/* where the dotted thread ends: the right edge of the canvas on a desktop, its
   foot on a phone, where the card sits under the stage */
function chAnchor(){
 var sc=CHV.sc; if(!sc)return;
 if(CHV.sel<0){sc.anchor=null;return;}
 sc.anchor=sc.mobile?[sc.w2/2,sc.h2-4]:[sc.w2-4,sc.h2*.5];}

/* THE ADDRESS UNDER THE POINTER, in the right panel and not on the stage. The
   rail section holds a "Pointing at" line and this writes it. On the stage
   itself nothing is written: the centre carries no text. */
function chHoverText(j,seat){
 var sc=CHV.sc;
 if(j>=0){var a=CHC.addr()[j];
  return '<b>'+esc(a.k)+'</b>'+(a.plex?', '+esc(a.plex.toLowerCase()):'')+'. '
   +(a.fld?esc(a.b):esc(chSeatName(a.b))+' seat')+(a.c?', '+esc(a.c.toLowerCase())+' channel':'')
   +'. Charge '+(sc.achT[j]*10).toFixed(1)+'.';}
 if(seat>=0){var st=CHC.seatState(sc,true),sh=st.st.sh[seat];
  return '<b>'+chSentence(chSeatWord(BANDS[seat])+' seat').replace(/\.$/,'')+'</b>, '+Math.round(sh*100)+' percent shadow. Press to trace it.';}
 /* nothing under the pointer is the empty value, a dash. The sentence that
    stood here explained how to use the line (CO-27, section-explains-itself) */
 return '\u2013';}
function chHover(j,seat){
 var t=chHoverText(j,seat); CHV.hov=j>=0?j:-1;
 var el=$('chhover'); if(el&&el.getAttribute('data-h')!==t){el.innerHTML=t;el.setAttribute('data-h',t);}}

/* ============================================================
   THE RIGHT PANEL. Everything the page says, in one rail section.
   ============================================================ */
/* WHAT STANDS BEHIND A LEAK: the story, the address, the mask. The chain is the
   one engine/trace.js already keeps, a story supports a pattern, read off the
   record and never stored here. A story supports an address and never causes
   it: nothing on the record observes a cause. The address is the heaviest one
   at the seat that some story has landed on, or the one a person pressed; if no
   story has landed at the seat the card says so and names the heaviest address
   anyway, because the charge there is from the seed and not from a story. */
function chGraph(){
 var p=(typeof CURP!=='undefined')?CURP:null;
 if(!p||!p.story||!Array.isArray(p.story.entries)||!p.story.entries.length||typeof traceFromRecord!=='function')return null;
 /* read once per record and per count of entries: the graph parses every story */
 var key=(p.id||'')+'|'+p.story.entries.length+'|'+(p.story.entries[p.story.entries.length-1].t||'');
 if(CHV.tg&&CHV.tg.key===key)return CHV.tg;
 var g=null,ids=null; try{g=traceFromRecord(p);ids=traceStoryIds(p);}catch(e){g=null;}
 CHV.tg=g?{key:key,g:g,ids:ids,entries:p.story.entries}:{key:key,g:null};
 return CHV.tg.g?CHV.tg:null;}
function chChain(k){
 var seat=BANDS[k], AF=addrField();
 var cand=AF.filter(function(a){return a.seat===seat&&!a.field;}).sort(function(a,b){return b.sq-a.sq;});
 var pressed=CHV.selAddr>=0&&AF[CHV.selAddr]&&AF[CHV.selAddr].seat===seat&&!AF[CHV.selAddr].field?AF[CHV.selAddr]:null;
 if(pressed)cand=[pressed].concat(cand.filter(function(a){return a.i!==pressed.i;}));
 var out={seat:seat,addr:cand[0]||null,story:null,when:'',src:'',w:0}, tg=chGraph();
 if(tg){
  for(var i=0;i<cand.length;i++){
   var es=tg.g.edges.filter(function(e){return e.edge==='supports'&&e.to==='pattern:'+cand[i].i&&/^story:/.test(e.from);});
   if(!es.length)continue;
   /* the latest story that supports it. Keys are the entry's own time, so they sort as dates. */
   es.sort(function(a,b){return a.from<b.from?1:-1;});
   var id=es[0].from.slice(6), ix=tg.ids.indexOf(id), en=ix>=0?tg.entries[ix]:null;
   if(en&&en.text){out.addr=cand[i];out.story=en.text;out.when=chMon(en.t);out.src=es[0].src||'inferred';out.w=es[0].w||0;break;}}}
 return out;}
function chStoryHtml(t){t=String(t||'');return esc(t.length>220?t.slice(0,217)+'...':t);}

/* THE CHARGE TAKES ITS SEAT'S COLOUR. addrRow's right hand word is Heart
   green by default, the colour it carries for a direction elsewhere, so a
   charge on a Root address printed in the Heart's colour: a colour that
   meant a seat the address is not in. ink is the option addrRow already has. */
function chTraceCard(r){
 var sc=CHV.sc, k=CHV.sel, st=CHC.seatState(sc,true).st, col=PAL[BANDS[k]], ch=chChain(k), m=maskOf(CHV.pick);
 var under=MASKS_READ.filter(function(mm){return mm.b.indexOf(BANDS[k])>=0;}).map(function(mm){return mm.nm;});
 var tabs=st.leaks.slice(); if(tabs.indexOf(k)<0)tabs.push(k);
 var lk=st.lk[k];
 var h='<section class="chr-trace" aria-label="Trace" style="--tc:'+col+'">'
  +'<div class="pm-eye plain">Trace. Where the energy leaks.</div>'
  +'<div class="chr-tabs" role="group" aria-label="Leaks">'+tabs.map(function(t){
    return '<button type="button" class="chr-tab" data-chtrace="'+t+'" aria-pressed="'+(t===k)+'" style="--lc:'+PAL[BANDS[t]]+'"><i></i>'+esc(chSeatName(BANDS[t]))+'</button>';}).join('')+'</div>'
  +'<div class="chr-ttl"><b>'+esc(chSeatName(BANDS[k]))+' seat</b><span>'
  +(lk>.12?'Leaking, '+Math.round(lk*100)+' percent':'Holding. No leak')+'</span></div>';
 if(ch.story)h+='<div class="chr-step"><div class="chr-k">Story'+(ch.when?', '+esc(ch.when):'')+'<i>'+esc(ch.src)+'</i></div><p class="chr-q">“'+chStoryHtml(ch.story)+'”</p></div><div class="chr-edge">supports</div>';
 else h+='<div class="chr-step"><div class="chr-k">Story<i>none</i></div><p class="chr-m">No story has landed here. The charge is from your intake.</p></div><div class="chr-edge">supports</div>';
 if(ch.addr){var n=BY[ch.addr.i];
  h+='<div class="chr-step"><div class="chr-k">Address '+ch.addr.i+'<i>known</i></div>'+addrRow(n,{em:'Charge '+ch.addr.sq.toFixed(1),ink:PAL[ch.addr.seat]})
   +'<p class="chr-m">'+esc(chSeatName(ch.addr.seat))+' seat'+(ch.addr.plexus?', '+esc(ch.addr.plexus.toLowerCase()):'')+(ch.addr.channel?', '+esc(ch.addr.channel.toLowerCase())+' channel':'')+'.</p></div>';}
 h+='<div class="chr-edge">worn under</div><div class="chr-step"><div class="chr-k">Mask<i>known</i></div><p class="chr-m"><b>'
  +esc(under.join(', ')||'No mask')+'</b>, by the '+esc(chSeatWord(BANDS[k]))+' seat.'+(under.indexOf(m.nm)<0&&under.length?' You are viewing '+esc(m.nm)+'.':'')+'</p></div>'
  +'<p class="chr-why">Supports, not causes. The ring on the field marks where the flow leaves at this seat. A story put charge on the address. Nothing on the record says it is the only cause.</p>'
  +'<div class="chr-acts"><button type="button" class="btn" id="chto">Open the story</button><button type="button" class="btn" id="chtc">Close trace</button></div></section>';
 return h;}

function chRailHtml(r){
 var sc=CHV.sc, m=maskOf(CHV.pick), unread=!r||r.unread, w=sc.w, li=CHC.leadPat(w), a=CHILD[li], col='#'+'';
 var pc=CHC.PCOL[li], hexc='#'+pc.map(function(v){return ('0'+Math.round(v).toString(16)).slice(-2);}).join('');
 var SF=seatField(), AF=addrField();
 var h='<div class="chr">';
 if(unread)h+='<p class="chr-note">Nothing read yet, so the field is dark and the cloud is plain. Write what happened on the Story page and it starts to answer.</p>';
 /* the leading pattern, what the mask does, and the one line the stage used to
    carry as a caption */
 /* AN UNREAD PROFILE LEADS WITH NOTHING. It printed "Leading pattern, Fear
    0.0", in Fear's red, to somebody who has entered nothing, which is a
    reading the record does not hold. The note above says the field is dark;
    the panel now agrees with it. */
 if(!unread)h+='<div class="chr-lead" style="--lead:'+hexc+'"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="'+hexc+'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="'+a.ic+'"/></svg>'
  +'<div><div class="pm-eye">Leading pattern</div><b>'+esc(a.nm)+'</b><span class="chr-fig">'+(w[a.nm]||0).toFixed(1)+'</span></div></div>'
  +'<div class="chr-where">'+esc(chSentence(a.loc))+'</div>';
 h+='<div class="pm-eye">Mask</div><div class="ad-nm">'+esc(m.nm)+'</div><div class="ad-sub">Worn over the '+esc(chSeats(m))+'</div>'
  +'<p class="ad-p">It '+esc(m.v)+'.</p>'
  +'<button type="button" class="btn" id="chread">Read this mask</button>';
 if(CHV.sel>=0)h+=chTraceCard(r);
 h+='<div class="pm-eye chr-sp">Pointing at</div><div class="chr-hover" id="chhover" aria-live="polite" data-h="">'+chHoverText(CHV.hov,-1)+'</div>';
 /* the two readings that light and move the field */
 var cq=unread?0:Math.round(+r.CQ||0), dq=unread?0:Math.round(+r.DQ||0), vt=unread?0:(+r.X||0);
 h+='<div class="pm-eye chr-sp">Light and breath</div><div class="chr-read">'
  +'<div class="chr-row"><span>Coherence</span><b>'+(unread?'–':cq+'%')+'</b><i>'+esc(chSentence(charCohWord(unread?0:cq/100)))+' It lights the figure and sets how wide, bright and whole the field is.</i></div>'
  +'<div class="chr-row"><span>Vitality</span><b>'+(unread?'–':vt.toFixed(2))+'</b><i>'+esc(chVitWord(unread?0:vt))+' It sets how far and how fast the field breathes.</i></div>'
  +'<div class="chr-row"><span>Decoherence</span><b>'+(unread?'–':dq+'%')+'</b><i>The shadow, all 112 addresses against the most they could hold. It opens the gaps.</i></div></div>';
 /* the seven seats: root first as everywhere, each a button that traces it */
 h+='<div class="pm-eye chr-sp plain">The seven seats</div><div class="chr-seats">'
  +SF.map(function(s,k){var sh=charSmooth(CHAR_SEAT_LO,CHAR_SEAT_FULL,s.mean),word=sh<.25?'Open':sh<.6?'Loaded':'Closed';
   return '<button type="button" class="chr-seat" data-chtrace="'+k+'" aria-pressed="'+(CHV.sel===k)+'" title="'+word+'" style="--sc:'+PAL[s.seat]+'">'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6.5" fill="none" stroke="'+PAL[s.seat]+'" stroke-width="1.7"/></svg>'
    +'<span class="chr-sn">'+esc(chSeatName(s.seat))+'</span><span class="chr-bar"><i style="width:'+Math.round(sh*100)+'%"></i></span><span class="chr-sv">'+Math.round(sh*100)+'</span></button>';}).join('')
  +'</div><p class="chr-note">The bar is how closed the seat is, from the charge on its own addresses. Past about a third the field pinches there, runs slow and breaks up. An open seat swells.</p>';
 /* what the points are, which is the question the owner asked of the mockup */
 h+='<div class="pm-eye chr-sp">What the points are</div>'
  /* NEVER THE LOWER COUNT. This printed the body's own share of the
     addresses, which is the figure the house rule says is never put in front
     of a person: the count stated is the whole set. Round RG. */
  +'<p class="ad-p">Each point is one address, and there are '+AF.length
  +'. Most sit round the body at the height of their seat, going slowly round the spine. '
  +'Four are field anchors, two above the head and two below the feet, drawn as rings. Size and brightness are the address’s charge, and a ring round a point is a charge above seven tenths.</p>'
  +'<div class="chr-counts">'+SF.map(function(s){return '<span style="--sc:'+PAL[s.seat]+'"><i></i>'+esc(chSeatName(s.seat))+' <b>'+s.n+'</b></span>';}).join('')+'<span class="chr-anc"><i></i>Anchors <b>4</b></span></div>';
 h+='</div>';
 return h;}
/* the words for a vitality, the left menu's own scale of 0 to 1 */
function chVitWord(v){return v<.34?'Low. The field barely moves.':v<.67?'Middling. The field breathes.':'High. The field breathes deep and quick.';}

function chRail(r){
 var host=$('charrail'); if(!host||!CHV.sc)return;
 if(!r)r=CHV.r; if(!r)return;
 var h=chRailHtml(r);
 if(h===CHV.rail&&host.firstChild)return;
 CHV.rail=h; host.innerHTML=h;
 var rd=$('chread'); if(rd)rd.onclick=function(){var m=maskOf(CHV.pick);if(m)chDrill(m);};
 host.querySelectorAll('[data-chtrace]').forEach(function(b){b.onclick=function(){
  var k=+b.getAttribute('data-chtrace'); chTrace(CHV.sel===k&&b.classList.contains('chr-seat')?-1:k);};});
 var to=$('chto'); if(to)to.onclick=function(){if(typeof setTab==='function'){setTab(TAB.STORY);}};
 var tc=$('chtc'); if(tc)tc.onclick=function(){chTrace(-1);};}

/* ============================================================
   THE LOOP. One requestAnimationFrame, started by the render that finds the
   page shown and ended by the frame that finds it is not. The page is in motion
   from the first frame. It is not the app's own loop in ui/ui.js on purpose:
   that loop draws every surface and this one draws one, and a second consumer
   there is another place a throw could end requestAnimationFrame for the
   session.
   ============================================================ */
function chLive(){
 var host=$('masksview');
 return !!(CHV.sc&&host&&host.isConnected&&S.tab===TAB.MASKS&&document.body.classList.contains('tab-masksview')&&lockSees('mask'));}
function chStart(){
 if(CHV.raf||!CHV.sc)return;
 CHV.last=0; CHV.live=false; CHV.raf=requestAnimationFrame(chFrame);}
function chFrame(ts){
 var sc=CHV.sc;
 if(!chLive()){CHV.raf=0;CHV.live=false;return;}
 /* THE OPENING. Entering the page starts the clock again, so it opens dim and
    grows lit to the person's real level in about two seconds every time, and
    the cloud gathers into the mask while it does. */
 if(!CHV.live){CHV.live=true;CHV.last=ts;sc.t=0;sc.fn=0;CHV.dirty=true;}
 var dt=clamp((ts-CHV.last)/1000,0,.05), raw=ts-CHV.last; CHV.last=ts;
 try{
  var still=rbStill(), w0=sc.W, h0=sc.H, shown=sc.resize();
  if(shown){
   if(sc.W!==w0||sc.H!==h0){CHV.dirty=true;chAnchor();}
   sc.update(dt,still);
   /* a person who asked for less motion gets one settled picture, drawn again
      only when something has changed it */
   if(!still||CHV.dirty){
    var a=performance.now(); sc.render(); var ms=performance.now()-a;
    CHV.perf.n++;CHV.perf.ms+=ms;if(ms>CHV.perf.max)CHV.perf.max=ms;CHV.dirty=false;
    if(!still&&raw>0&&raw<250)sc.govern(raw);}}
 }catch(e){CHV.raf=0;CHV.live=false;throw e;}
 CHV.raf=requestAnimationFrame(chFrame);}

/* THE REAL ENTRY. render() calls this on every press anywhere, so everything
   in it is cheap and idempotent: the numbers are handed to the scene, the
   buttons are painted from the state and the rail is written only when its
   markup changed, which keeps a keyboard's place in it. */
function renderCharacter(r){
 var host=$('masksview'); if(!host)return;
 var rail=$('charrail');
 /* THE MASKS ARE THE TIER'S, ruled 1 October. Below the tier that carries them
    the host holds the lock's own panel and nothing drawn, the rail's section is
    emptied, and the scene is dropped, so a stored tab, a drill that names a
    mask or a plan that lapsed with the page open all land on the panel and
    never on a picture of what the plan cannot see. */
 if(!lockSees('mask')){
  CHV.sc=null; CHV.built=false; CHV.rail=''; CHV.sel=-1; CHV.selAddr=-1; CHV.tg=null;
  host.classList.remove('chp-tracing');
  if(rail&&rail.innerHTML)rail.innerHTML='';
  var lh='<div class="lk-page">'+lockPanelHtml('mask')+'</div>';
  if(host._lk!==lh){host._lk=lh; host.innerHTML=lh;}
  return;}
 if(host._lk){host._lk=null; CHV.built=false;}
 if(!CHV.pick||CHV.pickFor!==chWho()){CHV.pick=chLast();CHV.pickFor=chWho();}
 chBuild(host);
 CHV.r=r;
 var sc=CHV.sc, d=chData(r);
 sc.feed(d);
 /* a mask press and a change of profile both land here, and under reduced
    motion nothing eases, so the picture is brought to where it is going */
 if(rbStill())sc.snap();
 CHV.dirty=true;
 host.querySelectorAll('[data-chmask]').forEach(function(b){
  var on=b.getAttribute('data-chmask')===CHV.pick, m=maskOf(b.getAttribute('data-chmask'));
  b.setAttribute('aria-pressed',on?'true':'false');
  var R=26,C=2*Math.PI*R,ld=Math.min(1,CHC.maskLoad(m,d.w)/9);
  b.querySelector('.ld').setAttribute('stroke-dasharray',(C*ld).toFixed(1)+' '+C.toFixed(1));});
 host.style.setProperty('--mc1',CHC.maskCols(maskOf(CHV.pick))[0]);
 /* the rail's section opens the first time the page is reached, and is left as
    the person leaves it after that (ui/panels.js, WANT) */
 chRail(r);
 chStart();}

/* THE SUMMARY IN SELECTION. "It gives me a full summary of what that mask is
   doing. How it operates through me." Opened by the Read this mask button in
   the right panel, and by a Runs under row in a saboteur's drill
   (ui/drills.js), which is why it is still here. What it says is read off the
   same engine the picture is: what the mask does, the seats it is worn over
   with how closed each is, and the addresses under it carrying the most. */
function chDrill(m){
 var r=compute(), SF=seatField(), AF=addrField();
 var h='<div class="pm-eye">Mask</div><div class="ad-nm">'+esc(m.nm)+'</div>'
  +'<div class="ad-sub">Worn over the '+esc(chSeats(m))+'</div>'
  +'<div class="pm-eye">What it does</div><p class="ad-p">'+esc(chSentence('It '+m.v))+'</p>';
 if(r.unread){
  h+='<p class="ad-p">Nothing read yet, so this mask is plain. Write what happened on the Story page and it starts to fill.</p>';
  rdShell(h);return;}
 var seats=SF.filter(function(s){return m.b.indexOf(s.seat)>=0;});
 h+='<div class="pm-eye">The seats it covers</div><div class="chr-seats">'+seats.map(function(s){
  var sh=charSmooth(CHAR_SEAT_LO,CHAR_SEAT_FULL,s.mean);
  return '<div class="chr-seat chr-seat-ro" style="--sc:'+PAL[s.seat]+'"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6.5" fill="none" stroke="'+PAL[s.seat]+'" stroke-width="1.7"/></svg>'
   +'<span class="chr-sn">'+esc(chSeatName(s.seat))+'</span><span class="chr-bar"><i style="width:'+Math.round(sh*100)+'%"></i></span><span class="chr-sv">'+Math.round(sh*100)+'</span></div>';}).join('')+'</div>';
 var top=AF.filter(function(a){return !a.field&&m.b.indexOf(a.seat)>=0&&a.sq>0;}).sort(function(a,b){return b.sq-a.sq;}).slice(0,6);
 h+='<div class="pm-eye">Carrying the most</div>';
 if(!top.length)h+='<p class="ad-p">Nothing held under this mask.</p>';
 else h+='<div class="ad-rows">'+top.map(function(a){return addrRow(BY[a.i],{em:'Charge '+a.sq.toFixed(1),ink:PAL[a.seat]});}).join('')+'</div>';
 var cov=AF.filter(function(a){return !a.field&&m.b.indexOf(a.seat)>=0;}).length;
 h+='<p class="ad-p">It covers '+chPl(cov,'address','addresses')+'. '+chPl(AF.filter(function(a){return !a.field&&m.b.indexOf(a.seat)>=0&&a.sq>=4;}).length,'is','are')+' held at 4 or more.</p>';
 rdShell(h);}
