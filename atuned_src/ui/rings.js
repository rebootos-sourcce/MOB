/* ============================================================
   THE FIELD'S ICON GEOMETRY AND BACKGROUND GLOW.

   Wheel, Frames and Dial shipped as three renditions of the Field, BP8 in
   TASKS.md, switched by #fview. He ruled them down to one, 3 November, his
   words: "wheel frame dials coming out. We just need the field. Whichever
   the one we normally load up with. We want to get rid of the others
   because they don't do anything more than what the main one does." Frames
   and Dial, their switch, their host div #frend, and every function that
   existed only to build or zoom them are gone with that ruling, not only
   hidden. The wheel was already the shipped default and the one every Field
   check in tests/ measures, so it is what is left.

   What is still here is what the glass bar (ui/fieldbar.js) and the wheel
   itself (ui/wheel.js) still call: the small path builders behind the bar's
   own icons, the layer table the bar reads its marks from, and the
   background glow the Field, the Compass and Character all carry.
   ============================================================ */

/* ---- the layers, in the order the rings sit, outside first ----
   One row, so the row is the legend and the legend is the control, which is
   what BA8 asked for and the mockup's own argument for it. Every icon is the
   mockup's, drawn on the product's 24 unit grid in the mark its ring uses. */

function frSegRing(n,r,gapDeg){var d='',g=gapDeg/360*TAU,step=TAU/n;
 for(var i=0;i<n;i++){var a0=-Math.PI/2+i*step+g/2;d+=frArcD(12,12,r,a0,a0+step-g);}return d;}
function frTicks(n,r0,r1,lens){var d='';
 for(var i=0;i<n;i++){var a=-Math.PI/2+i/n*TAU,l=lens?lens[i%lens.length]:1;
  d+='M'+(12+Math.cos(a)*r0).toFixed(2)+' '+(12+Math.sin(a)*r0).toFixed(2)
   +'L'+(12+Math.cos(a)*(r0+(r1-r0)*l)).toFixed(2)+' '+(12+Math.sin(a)*(r0+(r1-r0)*l)).toFixed(2);}
 return d;}
function frCirc(x,y,r){return 'M'+(x-r)+' '+y+'a'+r+' '+r+' 0 1 0 '+(2*r)+' 0a'+r+' '+r+' 0 1 0 '+(-2*r)+' 0';}
const FLAYS=[
 {k:'domains',nm:'Domains',d:frSegRing(5,8.6,20),
  tip:'The nineteen blueprint domains, what was there before any of it.'},
 {k:'addresses',nm:'Addresses',d:frCirc(12,12,4.2)+frTicks(8,7,10.4),
  tip:'Your 108 addresses, plus 4 field anchors above and below the body. Each mark is the charge held at one place.'},
 {k:'stories',nm:'Stories',d:frCirc(12,12,2.6)+'M12 9V4.4M14.6 13.5l4 2.3M9.4 13.5l-4 2.3'
   +frCirc(12,3.4,1.1)+frCirc(19.4,16.2,1.1)+frCirc(4.6,16.2,1.1),
  tip:'One line for each story that put charge on an address.'},
 {k:'archetypes',nm:'Archetypes',d:'M12 3.8l2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.6-5.1 2.6 1-5.6-4-3.9 5.6-.8z',
  tip:'The twelve, each set in the seat it runs through.'},
 {k:'patterns',nm:'Patterns',d:frCirc(15.6,8.4,3.2)+'M13.3 10.7L5 19',
  tip:'The saboteurs running on the charge, threaded to the addresses that built them.'},
 {k:'chains',nm:'Chains',d:frCirc(5.4,18.6,1.6)+frCirc(11,13,2.3)+frCirc(17.4,6.6,3)+'M6.6 17.4l2.8-2.8M12.7 11.3l2.6-2.6',
  tip:'How a pattern compounds: complex, hyper complex, super complex, inward.'},
 {k:'laws',nm:'Laws',d:frCirc(12,12,2.4)+frTicks(7,5.2,10,[1,.6,.9,.45,.8,.55,.95]),
  tip:'The twenty one laws, set by seat. Their sum is the number at the centre.'},
 {k:'gates',nm:'Gates',d:frCirc(12,12,3.1)+'M12 8.9V3.6M9.6 6L12 3.6 14.4 6M12 15.1v5.3',
  tip:'The six gates round the core. Each higher gate sits across from the lower one it stands against.'},
 {sep:true},
 {k:'shadow',nm:'Decoherence',d:frCirc(12,12,8.5)+'M7.2 16.6l3.4-3.4M10.2 19.2l6-6M14.6 19.9l4.6-4.6',
  /* MATCHED TO GLOSS'S OWN DQ ENTRY (engine/data/kb.js), round 28 October:
     see fieldbar.js's own shadow tip, fixed the same round for the same
     reason, the ceiling DQ is read against. */
  tip:'Decoherence. The weight on your 108 addresses and 4 field anchors, against the most they could hold, as a wash behind everything.'}];
/* FLAYS stays because its marks are the glass bar's own marks, built in
   ui/fieldbar.js: one concept, one mark, on every surface. */

/* frArcD stays: fbIcSeat and fbIcAddr in ui/fieldbar.js (and FLAYS above)
   draw their icons from it. */
function frArcD(cx,cy,r,a0,a1){
 if(a1-a0>=TAU-1e-6)return frArcD(cx,cy,r,a0,a0+Math.PI)+frArcD(cx,cy,r,a0+Math.PI,a0+TAU).replace(/^M[^A]+/,'');
 var large=(a1-a0)%TAU>Math.PI?1:0;
 return 'M'+(cx+Math.cos(a0)*r).toFixed(2)+' '+(cy+Math.sin(a0)*r).toFixed(2)
  +'A'+r.toFixed(2)+' '+r.toFixed(2)+' 0 '+large+' 1 '+(cx+Math.cos(a1)*r).toFixed(2)+' '+(cy+Math.sin(a1)*r).toFixed(2);}

/* THE TENSION RUNS, the wheel's own half of pulses() in ui/wheel.js, off the
   same reading as the rest of the Field: a person susceptible where a story
   lands carries more slack on the thread than one who is not. */
function frTen(n){return clamp((((n&&n.susc)||1)-0.45)/0.85,0,1);}

/* THE SAME FAINT GLOW BEHIND THE WHEEL AND THE COMPASS, round OG. His words:
   "this very subtle coloring in the background. Very faint. A glow. That
   looks like something we should add to all the backgrounds. For field,
   compass and character." The same four pools, the same seats and the same
   density off DQ, laid as CSS on the wheel's stage, the compass and the
   body. Silent on an unread field, and off under Punch and Flat, where the
   whole shell is one plane of colour. */
function glowCss(r){
 if(!r||r.unread)return '';
 var dens=clamp((+r.DQ||0)/100,0,1);
 var lead=hx(PAL[r.darkB||'Sacral']||PAL.Sacral), warm=hx(r.benign===false?PAL.Root:PAL.Heart);
 var at=[[13,24],[92,25],[9,83],[91,84]], col=[lead,warm,warm,lead], a=(.03+.20*dens)*(LIGHT()?.7:1);
 return at.map(function(q,i){var c=col[i];
  return 'radial-gradient(circle at '+q[0]+'% '+q[1]+'%,rgba('+c[0]+','+c[1]+','+c[2]+','+a.toFixed(3)
   +') 0,rgba('+c[0]+','+c[1]+','+c[2]+',0) '+Math.round(46+dens*20)+'%)';}).join(',');}
function glowApply(r){
 var b=document.body, off=b.classList.contains('punch')||b.classList.contains('flat');
 var css=off?'':glowCss(r);
 var stage=document.querySelector('.stage'), cone=document.getElementById('cone'), emap=document.getElementById('emap');
 if(stage)stage.style.backgroundImage=(css&&S.tab===TAB.FIELD)?css:'';
 if(cone)cone.style.backgroundImage=css;
 /* THE BODY TOO, round OI. His words: "I want that in the background of
    field, body, compass and character... and have it fill the frame." The
    pools are sized off the farthest corner, so they fill the whole host and
    not a patch of it; Character carries the same wash as its own SVG, chWash. */
 if(emap)emap.style.backgroundImage=css;}

/* THE WHEEL'S OWN ZOOM, read and driven from one place. This used to ask
   fviewOn() which picture was up, because Frames and Dial carried a second
   zoom of their own, FZ.s, brought closer rather than resolving a radius.
   That question has one answer now, so these go straight to the wheel's:
   setZoom in ui/ui.js, a radius that resolves layers. Called from the
   keydown handler (ui/ui.js, the F, + and - keys) and sound.js, which reads
   fieldZoom() for the zoom's own pitch. */
function fieldZoom(){return {s:S.zoom||1,max:WHEEL_ZOOM_MAX};}
function fieldZoomBy(k){setZoom(S.zoom*k,CW/2,CH/2);}
function fieldReframe(){
 layGesture();S.zoom=1;S.panx=0;S.pany=0;reframe();render();status(HOWTO_ZOOM_OUT);
 /* back at 1x, so the room under the zoom goes, ui/sound.js */
 if(typeof atmZoom==='function')atmZoom(1,2);
 if(typeof fbPaint==='function')fbPaint();}
