/* ============================================================
   THE RAIL ARRIVES, AND A PICK LANDS, round OH, kept in round OJ.

   His words, OH: "I want innovation and animation. And I want these things
   dynamic. Meaningfully dynamic." This is the part of the animation seat's
   build that survived the combine: how the rail comes into view, and how a
   tile answers a press. How a reading moves is the bars' own (ui/component.js,
   rbFx), what the circles and the map do on their own is ui/railtiles.js, and
   the clock under all of it is the Field's. Round OO ruled that none of the
   left menu's motion reaches into the centre pane, so this file touches the
   rail and nothing else. It has no loop of its own, and nothing here runs
   again after the thing it announces has been announced.

   THE RULE THIS FILE KEEPS. Motion carries a reading or announces a thing
   that is real. Nothing in it is decoration, and nothing in it repeats.

   ARRIVE. The first time the rail is on the page, once per session, which is
   the ruling enterStart carries for the wheel: a heading and a row slide 10px
   in and fade over 220ms, a tile comes up out of .8 scale with one overshoot
   to 1.06 over 260ms, all on the wheel's own ENTER_STAGGER of 62ms and done
   inside the wheel's own ENTER_TOTAL. The six bars take the first six places
   of the stagger, so the tiles start as the last bar is charging. The column
   opens shut on a wide screen, so this is usually the person's first sight of
   it, and the bars' own sweep is started here if no render found them open.
   After the first time, opening the column or a section is a surface and not
   an entrance: what is in it slides 10px in and fades over 260ms, one child
   after the next 40ms apart, and everything is already at its figure.

   ANSWER. A tile pressed anticipates (.9 in 60ms), lands (1.08, then 1, over
   300ms), and the ring round it opens, .72 to 1.16 to 1 with its opacity on
   the landing curve in 340ms. A tile put away is only a small press, .94 over
   140ms. The caption under the grid fades up 5px over 220ms. That is the whole
   of the answer: the pick lands on the rail, where it was made.

   STILL. Reduced motion, body.quiet and body.rm get the end state of every one
   of these: tiles and rows in place, no pop, no cascade.
   ============================================================ */
var RM={seen:false,waiting:false,seenAt:0};
var RM_OUT='cubic-bezier(.22,1,.36,1)', RM_IN='cubic-bezier(.4,0,1,1)';
function rmRailOpen(){var p=document.getElementById('lpanel');
 return !!(p&&p.offsetParent&&!document.body.classList.contains('lshut'));}
/* a tile pressed. Called from the three handlers in ui/panels.js after the
   render, so the DOM it reads is the one the person sees. */
function railPick(btn,kind){
 if(!btn)return;
 var sel=btn.getAttribute('aria-pressed')==='true'||btn.dataset.r==='2';
 var cap=document.getElementById(kind==='arch'?'capA':'capD');
 if(rbStill()||!btn.animate)return;
 var land='cubic-bezier(.34,1.56,.64,1)';
 if(sel){
  btn.animate([{transform:'scale(1)',offset:0,easing:RM_IN},{transform:'scale(.9)',offset:.2,easing:RM_OUT},
   {transform:'scale(1.08)',offset:.58,easing:RM_OUT},{transform:'scale(1)',offset:1}],{duration:300,easing:'linear'});
  try{btn.animate([{transform:'scale(.72)',opacity:0,offset:0,easing:land},{transform:'scale(1.16)',opacity:1,offset:.55,easing:RM_OUT},
   {transform:'scale(1)',offset:1}],{duration:340,easing:'linear',pseudoElement:'::after'});}catch(e){}}
 else btn.animate([{transform:'scale(1)',offset:0,easing:RM_IN},{transform:'scale(.94)',offset:.4,easing:RM_OUT},
   {transform:'scale(1)',offset:1}],{duration:140,easing:'linear'});
 if(cap&&cap.animate)cap.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:220,easing:RM_OUT});}
/* ---------- first sight, and a section opening ---------- */
function rmCascade(items,stagger,base,cap){
 var rows=[]; items.sort(function(a,b){return a.r.top-b.r.top||a.r.left-b.r.left;});
 items.forEach(function(it){var g=rows[rows.length-1];
  if(g&&Math.abs(it.r.top-g.top)<10)g.items.push(it); else rows.push({top:it.r.top,items:[it]});});
 rows.forEach(function(g,u){
  g.items.forEach(function(it,c){
   var d=(base+Math.min(u,cap))*stagger+Math.min(c,5)*16;
   if(!it.el.animate)return;
   if(it.tile)it.el.animate([{opacity:0,transform:'scale(.8)',offset:0,easing:RM_OUT},
     {opacity:1,transform:'scale(1.06)',offset:.62,easing:RM_OUT},{opacity:1,transform:'scale(1)',offset:1}],
     {duration:260,delay:d,easing:'linear',fill:'backwards'});
   else it.el.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],
     {duration:220,delay:d,easing:RM_OUT,fill:'backwards'});});});}
function rmVisible(sel,scope){
 var pr=document.getElementById('lpanel').getBoundingClientRect(), out=[];
 scope.querySelectorAll(sel).forEach(function(el){
  var r=el.getBoundingClientRect(); if(!r.width||r.bottom<=pr.top||r.top>=pr.bottom)return;
  out.push({el:el,r:r,tile:el.classList.contains('ib')||el.classList.contains('rootb')||el.classList.contains('aw-c')});});
 return out;}
function railFirstSight(){
 if(RM.seen||!rmRailOpen())return;
 if(!isBooted()){if(!RM.waiting){RM.waiting=true; afterBoot(function(){RM.waiting=false; railFirstSight();});} return;}
 RM.seen=true; RM.seenAt=performance.now();
 /* the bars, if they were not already started by a render that found the
    rail open */
 rbMotion([document.getElementById('key'),document.getElementById('keylo')]);
 if(rbStill())return;
 var p=document.getElementById('lpanel');
 var items=rmVisible('.rblk,.lsec.re,.lsec:not(.re)>.lsec-hd,.tier1,.fdl,.rootlegend,.cap,.rootb,.ib,.aw-r,.ax',p);
 /* the six bars take the first six places of the stagger and what is under
    them starts as the last bar is charging */
 var bar0=document.querySelector('#fdock .rbar'), top0=bar0?bar0.getBoundingClientRect().top:0;
 var head=items.filter(function(it){return it.r.top<top0-2;});
 var rest=items.filter(function(it){return it.r.top>=top0-2;});
 rmCascade(head,ENTER_STAGGER,0,0);
 rmCascade(rest,ENTER_STAGGER,5,4);}
/* THE COLUMN OPENING, after the first time. A surface, so 280 to 420 and not
   an entrance. */
function railOpened(){
 if(!RM.seen){railFirstSight(); return;}
 /* a render that found the column open has just given it its first sight */
 if(rbStill()||!rmRailOpen()||performance.now()-RM.seenAt<150)return;
 var kids=[]; Array.prototype.forEach.call(document.getElementById('lpanel').children,function(c){
  if(c.classList.contains('lfold')||!c.offsetParent)return; kids.push(c);});
 kids.forEach(function(c,i){if(!c.animate)return;
  c.animate([{opacity:0,transform:'translateX(-10px)'},{opacity:1,transform:'none'}],
   {duration:260,delay:Math.min(i,6)*40,easing:RM_OUT,fill:'backwards'});});}
function railSection(sec,opening){
 if(!opening||rbStill()||!sec)return;
 var items=rmVisible('.sp-row,.sp-hd,.tier1,.ib,.rootb,.ax,.sp-map',sec).filter(function(it){return it.el.offsetParent;});
 if(items.length)rmCascade(items,40,0,6);}
