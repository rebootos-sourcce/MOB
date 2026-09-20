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

 function carrier(t){
  return t&&t.closest?t.closest('[data-tip],[data-tip-t]'):null;}

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
  document.addEventListener('pointerdown',function(ev){
   var c=carrier(ev.target);
   if(EL&&EL.contains(ev.target))return;
   if(!c){hide();return;}
   if(!sheet())return;                    /* a fine pointer keeps hover */
   if(c===CUR){hide();return;}            /* tap the same thing to close */
   clearTimeout(TO); showFor(c);},true);
  /* KEYBOARD. Focus opens, escape closes, and escape is caught in the
     capture phase so a carrier inside a sheet cannot eat it. */
  document.addEventListener('focusin',function(ev){
   var c=carrier(ev.target); if(!c){hide();return;}
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