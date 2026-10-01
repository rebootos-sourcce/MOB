/* ============================================================
   THE ONE TOOLTIP.

   Ruled: "the tooltip design is inconsistent across the board. Design it so
   that it is sexy. Wow me. Think transition, think animation, think how can I
   make this interesting."

   The audit found worse than inconsistent. There was no tooltip. There were
   eight mechanisms doing the job of one, plus a ninth pattern that is not a
   tooltip and does a tooltip's job: native title in renderer strings, native
   title in the shell, native title emitted unconditionally by cr(), the same
   conditionally by crBadge(), the same by addrRow(), title assigned as a
   property in ten places, the #railtip panel, the #probe panel, and three
   caption slots that a hover writes into. aria-describedby was used zero times
   across all ten surfaces.

   And the count of definitions reachable only by hover was wrong by a factor
   of twenty four. The backlog said eight. Measured live at 1600 with a loaded
   profile, walking every surface: 259 distinct visible title strings, 195 of
   them definitions existing nowhere else on the screen. This audience arrives
   on phones and a phone has no hover, so those 195 were unreachable.

   THE ONE THING THIS FILE BUYS ON ITS OWN. read() falls back to the native
   title, so every one of those 195 becomes tap reachable the moment this
   loads, without a single renderer being touched. The enrichment to data-tip
   comes later, file by file.

   The shape: the panel grows out of its carrier along a two pixel tether in
   the carrier's own colour, and the tether plus a thirty pixel entry mark make
   a T where the line arrives, which does the caret's job without being a
   caret. Sheet on a coarse pointer, taking the half of the window the carrier
   is not in.

   Measured on the live Field with the panel open: 16.5ms, 60.6 frames a
   second, no backdrop filter in any of the seven lightings, lowest contrast
   inside the panel 5.30 to 1, close control exactly 44 by 44, and zero panel
   over carrier overlaps at either width.

   DESIGN-tooltip.md carries the ten mechanisms considered and the nine that
   lost, and proto/tip/ is the runnable prototype it was measured in.
   ============================================================ */
var TIP=(function(){
 var GAP=10;        /* the tether's length, and the distance the panel keeps */
 var INSET=8;       /* the panel never comes closer than this to a window edge */
 var MINW=200;      /* below this the panel goes to the sheet instead of shrinking */
 var DELAY=380;     /* hover intent. under 300 the panel fires while crossing */
 var GRACE=120;     /* the crossing tolerance, and the exit duration */
 var EL=null, CUR=null, TO=null, HOLD=null, RESTORE=null;

 function el(){
  if(EL)return EL;
  EL=document.createElement('div');
  EL.className='tip'; EL.id='tip';
  EL.setAttribute('role','tooltip');
  EL.setAttribute('aria-hidden','true');
  document.body.appendChild(EL);
  EL.addEventListener('pointerenter',function(){clearTimeout(HOLD);});
  EL.addEventListener('pointerleave',function(){soon();});
  return EL;}

 /* WHICH SHAPE THIS IS. A coarse pointer or a narrow window gets the sheet.
    Set as a class rather than left to a media query, because a media query
    cannot say "or narrow" and a gate cannot force one. */
 function sheet(){
  var m=(window.matchMedia&&matchMedia('(hover:none),(pointer:coarse)').matches)
     || innerWidth<600;
  if(document.body.classList.contains('tip-force-sheet'))m=true;
  document.body.classList.toggle('tip-sheet',m);
  return m;}

 /* THE CONTENT. Every field optional but the body. Numbers are a list of
    three: what it is, the value, and what the value is out of. There is no
    way to pass a bare number, which is the point. */
 function build(d){
  var h='';
  if(d.k)h+='<p class="tip-k">'+esc(d.k)+'</p>';
  if(d.t)h+='<p class="tip-t">'+esc(d.t)+'</p>';
  h+='<p class="tip-b">'+esc(d.b||'')+'</p>';
  if(d.n&&d.n.length){
   h+='<dl class="tip-n">';
   d.n.forEach(function(r){
    if(r.length<3)return;                    /* a value with no denominator is dropped */
    h+='<dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+' <i>of '+esc(r[2])+'</i></dd>';});
   h+='</dl>';}
  if(d.a)h+='<p class="tip-a">'+esc(d.a)+'</p>';
  /* A DOOR INSIDE A DEFINITION. A locked control's definition has to say where
     to go to unlock it, and a sentence naming a place is not a way there, so
     the panel can carry one button. It is one and only one: this is still a
     definition and not a dialog. What it does is not this file's to know. The
     click is delegated in ui/lock.js, which owns the lock, so the tooltip has
     no reason to reach for the billing page. */
  if(d.go)h+='<p class="tip-g"><button type="button" class="tip-go">'+esc(d.go)+'</button></p>';
  return '<div class="tip-s">'+h+'</div>'
   +'<button type="button" class="tip-x" aria-label="Close">'
   +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';}

 /* READ A CARRIER. Attributes first, then the native title as the body of
    last resort, so an element that has not been migrated still works. */
 function read(e){
  var b=e.getAttribute('data-tip');
  if(b==null)b=e.getAttribute('title');
  if(!b)return null;
  var n=(e.getAttribute('data-tip-n')||'').split(';').filter(Boolean)
        .map(function(s){return s.split('|');});
  return {t:e.getAttribute('data-tip-t')||'',
          k:e.getAttribute('data-tip-k')||'',
          a:e.getAttribute('data-tip-a')||'',
          go:e.getAttribute('data-tip-go')||'',
          b:b, n:n,
          c:(getComputedStyle(e).getPropertyValue('--c')||'').trim()};}

 /* PLACEMENT. Below, above, right, left, first that fits. The rectangle
    handed in is the box the panel must stay OFF, inflated by the gap before
    the fit test, so the panel can never land on the thing it describes.

    at, when given, is a point inside that rectangle: it sets where along the
    near edge the panel lines up and where the tether's foot sits. It is how a
    canvas mark works. The wheel hands over the CANVAS's box, not the mark's,
    because law 8 says no text over the hero graphic and a panel placed
    against a mark in the middle of the wheel is text over the hero graphic.
    Measured before this existed: the panel landed at 637,531,300,233 inside a
    canvas at 451,263,664,727, which is dead centre of the picture. The mark
    itself is already lit by the wheel's own hover render, so nothing is lost
    by moving the panel off the graphic. */
 /* THE PANEL NEVER COVERS THE TAB BAR. The bar is how a person leaves the
    surface, and a definition that hides the way out is worse than no
    definition. Measured before this existed: on the live Field in Glass the
    canvas panel landed at 637,26 and sat across Knowledge, Games and
    Summary. The bar's own bottom edge is the top inset, read once per open,
    so nothing has to be written down and the number cannot go stale. */
 function topFloor(){
  var bar=document.querySelector('.top'); if(!bar)return INSET;
  var s=getComputedStyle(bar);
  if(s.display==='none'||s.visibility==='hidden')return INSET;
  if(s.position!=='fixed'&&s.position!=='sticky')return INSET;
  var b=bar.getBoundingClientRect();
  return b.height>0?Math.max(INSET,b.bottom+INSET):INSET;}

 function place(r,t,force,at,order){
  var vw=innerWidth, vh=innerHeight, w=t.w, h=t.h, out=null;
  var TOP=topFloor();
  var fits={
   bottom: vh-r.bottom-GAP-INSET >= h,
   top:    r.top-GAP-TOP         >= h,
   right:  vw-r.right-GAP-INSET  >= w,
   left:   r.left-GAP-INSET      >= w};
  /* PLACEMENT ORDER, AND WHY THE CALLER CAN SET IT. Below, above, beside is
     right for a row, a ring and a tab: the eye is already travelling down.
     It is wrong for the wheel. The wheel fills the middle of the surface, so
     above it is the tab bar and below it is the key strip, and the only
     clear ground is beside it. The Field passes right, left, bottom, top and
     the reason travels with the call. */
  /* AND WHEN THE CALLER GIVES A POINT AND NO ORDER, the side follows the
     point. A mark on the left of the wheel opens to the left, a mark on the
     right opens to the right. The tether stays short, the eye never crosses
     the picture to read about the picture, and the panel lands on whichever
     rail is furthest from what the person is looking at. */
  var ORDER=order||(at
   ? (at.x < r.left+r.width/2 ? ['left','right','bottom','top']
                              : ['right','left','bottom','top'])
   : ['bottom','top','right','left']), side=null, i;
  if(force&&fits[force])side=force;
  else for(i=0;i<ORDER.length;i++)if(fits[ORDER[i]]){side=ORDER[i];break;}
  if(!side){
   /* nothing fits. take the side with the most room and shrink to it. */
   var room={bottom:vh-r.bottom,top:r.top-TOP,right:vw-r.right,left:r.left};
   side=Object.keys(room).sort(function(a,b){return room[b]-room[a];})[0];
   if((side==='right'||side==='left') && room[side]-GAP-INSET < MINW)return null;}
  var x,y, ax=at?at.x:(r.left+r.width/2), ay=at?at.y:(r.top+r.height/2);
  if(side==='bottom'||side==='top'){
   x=ax-w/2;
   x=Math.max(INSET,Math.min(vw-w-INSET,x));
   y=(side==='bottom')?r.bottom+GAP:Math.max(TOP,r.top-GAP-h);
   out={side:side,x:x,y:y,
        tx:Math.max(16,Math.min(w-16,ax-x)),ty:null};}
  else{
   y=ay-h/2;
   y=Math.max(TOP,Math.min(vh-h-INSET,y));
   x=(side==='right')?r.right+GAP:r.left-GAP-w;
   out={side:side,x:x,y:y,
        tx:null,ty:Math.max(16,Math.min(h-16,ay-y))};}
  return out;}

 /* OPEN AT A RECTANGLE. A canvas mark has no element, so this is the entry
    the wheel uses: it hands over the mark's box in client coordinates. */
 function showAt(rect,d,owner){
  clearTimeout(HOLD);
  if(CUR&&CUR!==owner&&CUR.classList)CUR.classList.remove('tip-open');
  var e=el();
  e.innerHTML=build(d);
  e.style.setProperty('--tc',d.c||'var(--accent)');
  CUR=owner||null;

  if(sheet()){
   e.style.left=''; e.style.top='';
   e.setAttribute('data-side','bottom');
   e.setAttribute('aria-hidden','false');
   /* THE SHEET MUST NOT COVER ITS CARRIER EITHER, and scrolling is not
      always enough. Measured on the 390 run: five of eighteen carriers were
      still under the sheet after it scrolled, because a carrier in the last
      three hundred pixels of a page has nowhere left to go.

      So the side is decided from the arithmetic before anything moves. The
      sheet takes the bottom when the carrier clears it, or when the page can
      scroll far enough to make it clear. Otherwise it takes the top. The
      placement never depends on the scroll landing, so there is no race
      between the scroll and the panel's own two hundred and twenty
      milliseconds. */
   var doc=document.scrollingElement||document.documentElement;
   e.classList.remove('top');
   var sh=e.getBoundingClientRect().height, vh=innerHeight, need=0, top=false;
   if(rect){
    var floor=vh-sh-16;
    if(rect.bottom>floor){
     need=rect.bottom-floor;
     var room=doc.scrollHeight-doc.clientHeight-doc.scrollTop;
     if(room>=need){doc.scrollBy({top:need,behavior:'smooth'});}
     else{
      top=true; need=0;
      if(rect.top<sh+16){
       var up=Math.min(doc.scrollTop,(sh+16)-rect.top);
       if(up>0)doc.scrollBy({top:-up,behavior:'smooth'});}}}}
   if(top)e.classList.add('top');
   requestAnimationFrame(function(){e.classList.add('on');});
   return;}

  /* measure before placing. the panel is laid out invisibly first, because
     its height depends on how the body wraps at 300 pixels. */
  e.removeAttribute('data-side');
  e.style.left='-9999px'; e.style.top='0px';
  e.style.setProperty('--dx','0px'); e.style.setProperty('--dy','0px');
  var b=e.getBoundingClientRect();
  var p=place(rect,{w:b.width,h:b.height},d.force,d.at,d.order);
  if(!p){ document.body.classList.add('tip-force-sheet'); showAt(rect,d,owner);
          document.body.classList.remove('tip-force-sheet'); return; }
  e.setAttribute('data-side',p.side);
  e.style.left=Math.round(p.x)+'px';
  e.style.top=Math.round(p.y)+'px';
  if(p.tx!=null)e.style.setProperty('--tx',Math.round(p.tx)+'px');
  if(p.ty!=null)e.style.setProperty('--ty',Math.round(p.ty)+'px');
  /* THE PANEL ARRIVES FROM ITS CARRIER. Six pixels of travel toward the
     carrier on the way in, and the transform origin sits at the tether's
     foot, so the panel grows out of the line rather than out of its own
     middle. */
  var D=6;
  e.style.setProperty('--dx', p.side==='right'?(-D+'px'):p.side==='left'?(D+'px'):'0px');
  e.style.setProperty('--dy', p.side==='bottom'?(-D+'px'):p.side==='top'?(D+'px'):'0px');
  e.style.setProperty('--ox', p.tx!=null?(Math.round(p.tx)+'px'):(p.side==='right'?'0px':'100%'));
  e.style.setProperty('--oy', p.ty!=null?(Math.round(p.ty)+'px'):(p.side==='bottom'?'0px':'100%'));
  e.setAttribute('aria-hidden','false');
  requestAnimationFrame(function(){e.classList.add('on');});}

 function showFor(target){
  var d=read(target); if(!d)return;
  /* THE NATIVE TITLE STANDS DOWN, and only now. Up to this moment the
     element still carries its title, so a script that never ran or that
     threw at boot leaves a working native tooltip behind. */
  if(target.hasAttribute('title')){
   RESTORE=[target,target.getAttribute('title')];
   target.removeAttribute('title');}
  target.classList.add('tip-open');
  showAt(target.getBoundingClientRect(),d,target);}

 function hide(){
  clearTimeout(TO); clearTimeout(HOLD);
  if(EL){EL.classList.remove('on'); EL.setAttribute('aria-hidden','true');}
  if(CUR&&CUR.classList)CUR.classList.remove('tip-open');
  if(RESTORE){RESTORE[0].setAttribute('title',RESTORE[1]); RESTORE=null;}
  CUR=null;}
 function soon(){clearTimeout(HOLD); HOLD=setTimeout(hide,GRACE);}

 /* A NATIVE TITLE IS A CARRIER, and leaving it out made the headline claim for
    this module false. read() falls back to the title, which is what was meant
    to make all one hundred and ninety five hover only definitions tap
    reachable the moment this loaded. But carrier() never recognised a title
    only element, so read() was never called on one. Measured after it landed:
    280 title carriers, 8 data-tip carriers, four of those 0 by 0 pixels. Four
    carriers in the whole product opened a panel, not one hundred and ninety
    five.

    The title is suppressed and restored around a show already, so including it
    here cannot produce two tooltips on one element. */
 function carrier(t){
  return t&&t.closest?t.closest('[data-tip],[data-tip-t],[title]'):null;}

 function wire(){
  if(!document.body)return;
  sheet();
  addEventListener('resize',function(){sheet(); hide();});
  /* HOVER, WITH INTENT. A pointer crossing a rail of twenty rows must not
     fire twenty panels. */
  document.addEventListener('pointerover',function(ev){
   if(sheet())return;
   var c=carrier(ev.target);
   if(!c){ if(!EL||!EL.contains(ev.target))soon(); return; }
   if(c===CUR){clearTimeout(HOLD);return;}
   clearTimeout(TO); clearTimeout(HOLD);
   TO=setTimeout(function(){showFor(c);},DELAY);});
  document.addEventListener('pointerout',function(ev){
   if(sheet())return;
   clearTimeout(TO);
   if(EL&&EL.contains(ev.relatedTarget))return;
   if(carrier(ev.relatedTarget))return;
   soon();});
  /* TAP. The only route on a phone, and a second route everywhere else.
     pointerdown rather than click, so the panel is up before the carrier's
     own click handler navigates. */
  /* ON A PHONE, EXPLAIN AND NAVIGATE WERE ONE GESTURE AND THE WRONG ONE WON.
     Measured at 390 on a rail row: at 120ms the tab had already changed and
     the panel read correctly, and at 300ms the panel was empty, because the
     navigation re-rendered the surface out from under it. The definition
     arrived and was destroyed before it could be read.

     So on a coarse pointer the first tap explains and the second acts, which
     is what every other product with this problem does. The first tap's click
     is swallowed in the capture phase rather than prevented on pointerdown,
     because preventing a pointerdown does not reliably stop the click that
     follows it. */
  var EAT=null;
  /* PRESS AND HOLD, ON A CONTROL. GF in TASKS.md, 27 September, his words:
     "when I press CQ, DQ, whatever, it should pull up a tooltip if I press for
     a second and a half." The first tap explaining was right for a word and
     wrong for a control: CQ, DQ, accuracy, an address row and a glass bar
     circle are each a door, and on a phone every one of them asked for two
     taps to open, the first spent on a panel the person had not asked for. So
     a carrier inside a control acts on a tap, as it does under a mouse, and
     explains on a hold of PRESS_MS without moving more than PRESS_SLOP. The
     click that ends a hold is swallowed, so a hold never also opens the door.
     A carrier that is only words keeps the first tap, because a tap on it has
     nothing else to do. The copy is whatever the carrier already says; the
     words themselves wait on DESIGN-tooltip-copy.md. */
  var PRESS=null, PRESS_MS=1500, PRESS_SLOP=10;
  function control(c){return !!(c&&c.closest&&c.closest('button,a[href],[role=button]'));}
  /* THE WHOLE CONTROL ANSWERS FOR THE DEFINITION INSIDE IT, on a phone. The
     dock's buttons carry their title on the ring inside, not on the button, so
     a finger on accuracy's word, or on a tile's edge, found no carrier and the
     hold explained nothing; and the release focused the button, which read as
     nothing to explain and closed a panel the hold had just opened. Measured:
     CQ's panel opened at 1.5s and was gone the moment the finger lifted. */
  /* And the open carrier counts though it has no title: showFor lifts the
     title off while its panel is up, so without CUR the release's own focus
     found nothing and hid the panel it had just opened. */
  function carrierIn(t){var c=carrier(t); if(c||!t||!t.closest)return c;
   var k=t.closest('button,a[href],[role=button]'); if(!k)return null;
   if(CUR&&CUR.nodeType===1&&k.contains(CUR))return CUR;
   return k.querySelector('[data-tip],[data-tip-t],[title]');}
  function pressDrop(){if(PRESS){clearTimeout(PRESS.t);PRESS=null;}}
  function pressArm(c,ev){pressDrop();
   PRESS={c:c,id:ev.pointerId,x:ev.clientX,y:ev.clientY,t:setTimeout(function(){
    var p=PRESS; PRESS=null; if(!p)return;
    clearTimeout(TO); showFor(p.c); EAT=p.c;},PRESS_MS)};}
  document.addEventListener('pointermove',function(ev){
   if(PRESS&&ev.pointerId===PRESS.id
      &&Math.hypot(ev.clientX-PRESS.x,ev.clientY-PRESS.y)>PRESS_SLOP)pressDrop();},true);
  ['pointerup','pointercancel'].forEach(function(t){
   document.addEventListener(t,function(ev){if(PRESS&&ev.pointerId===PRESS.id)pressDrop();},true);});
  /* a held finger is the browser's own cue for a context menu and a text
     selection, and either would land on top of the panel this opens */
  document.addEventListener('contextmenu',function(ev){
   if(sheet()&&(PRESS||EAT)&&carrierIn(ev.target))ev.preventDefault();},true);
  document.addEventListener('pointerdown',function(ev){
   var c=sheet()?carrierIn(ev.target):carrier(ev.target);
   if(EL&&EL.contains(ev.target))return;
   if(!c){hide();return;}
   if(!sheet())return;                    /* a fine pointer keeps hover */
   if(control(c)){EAT=null; hide(); pressArm(c,ev); return;}
   if(c===CUR){EAT=null; hide(); return;} /* tap the same thing again and it acts */
   clearTimeout(TO); showFor(c); EAT=c;},true);
  document.addEventListener('click',function(ev){
   if(!EAT)return;
   var c=sheet()?carrierIn(ev.target):carrier(ev.target);
   if(c!==EAT){EAT=null;return;}
   EAT=null;
   ev.stopPropagation(); ev.preventDefault();},true);
  /* KEYBOARD. Focus opens, escape closes, and escape is caught in the
     capture phase so a carrier inside a sheet cannot eat it. */
  document.addEventListener('focusin',function(ev){
   var c=sheet()?carrierIn(ev.target):carrier(ev.target); if(!c){hide();return;}
   /* on a phone a tap focuses the button it lands on, and this opened the
      panel on that focus, so the hold above would never have been the only
      way in. Keyboard focus still opens it: that is what :focus-visible
      tells apart. */
   var kb=true; try{kb=ev.target.matches(':focus-visible');}catch(e){}
   if(sheet()&&control(c)&&!kb)return;
   clearTimeout(TO); showFor(c);});
  document.addEventListener('focusout',function(ev){
   if(EL&&EL.contains(ev.relatedTarget))return; soon();});
  document.addEventListener('keydown',function(ev){
   if(ev.key!=='Escape')return;
   if(!EL||!EL.classList.contains('on'))return;
   hide(); ev.stopPropagation();},true);
  /* SCROLL CLOSES, AND ONLY WHEN THE PANEL IS ANCHORED. A panel that chases
     a scrolling carrier is a second moving object and the eye has to track
     both, so an anchored tooltip goes when the page moves under it.

     The sheet does not, and it took a failed run to see why. The sheet
     scrolls the carrier clear of itself on open, that scroll fired this
     handler, and the sheet closed itself on the way up: measured on the 390
     run, the long definition and the Snow row both reported on:false a
     moment after opening. A sheet is fixed to the window and tracks nothing,
     so there is nothing for a scroll to invalidate, and a person reading a
     long definition with a thumb on the page must be allowed to move it. */
  addEventListener('scroll',function(ev){
   if(!EL||!EL.classList.contains('on'))return;
   if(document.body.classList.contains('tip-sheet'))return;
   if(ev&&ev.target&&ev.target.nodeType===1&&EL.contains(ev.target))return;
   hide();},true);
  document.addEventListener('click',function(ev){
   if(EL&&EL.contains(ev.target)&&ev.target.closest('.tip-x')){hide();}});}

 return {wire:wire, show:showFor, showAt:showAt, hide:hide, sheet:sheet,
         set DELAY(v){DELAY=v;}, get DELAY(){return DELAY;}};
})();
TIP.wire();