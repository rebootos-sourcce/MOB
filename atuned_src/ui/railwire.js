/* ============================================================
   THE SIX READINGS ON ONE WIRE, round OJ.

   The bars were six unrelated rectangles, and the engine says they are not.
   This file draws the contacts the engine already keeps in compute() and
   draws nothing it does not. It is the structure the bars hang on; the bars
   themselves, their words and their motion are the rest of the menu
   (ui/component.js, rbRow, and ui/railtiles.js).

   THE GUTTER. A wire runs down the dock's left edge, one tap to each bar at
   the bar's own height, so a bar reads as a branch of it. Every segment is a
   formula.
     Decoherence to coherence is the lever. Expression is CQ times what the
     shadow leaves, and the share it takes is drawn on the coherence bar
     itself, as the hatched foot of its fill (rbRow, o.pull). The wire between
     the two rows is the pull's own strength.
     Decoherence to vitality is X. Seventy percent of vitality is what the
     shadow leaves, so the wire from one to the other is DQ over fourteen,
     which is the term in the formula.
     Vitality, awareness and will meet in radiance, the root of their
     squares. The junction under them is that figure, and it is the same
     figure the wash behind the wheel takes its brightness from, so the light
     in the rail and the light on the Field are one number.
   Flow is not on the wire, because nothing feeds it. It is seven seats
   multiplied, root to crown, so its tap stands open and its row draws the
   seven seats as a wave, ui/component.js, rbWave.

   THE PULSES RUN ON THE FIELD'S RATE. pulseRate(r) in ui/wheel.js is the
   shadow layer's own breath. A pulse is a dash of a longer period, as the
   Field's are, so at any moment most of the wire is at rest and a few
   dashes are live. A wire with nothing to carry carries nothing: no shadow
   means no pulse down to vitality, and a record with no lever has a dead
   lever. The speed goes as the root of the strength, which is the Field's
   own law for a wave on a string.

   THE STILL EQUIVALENT. Reduced motion, Quiet and Rm draw no pulse. The wire
   already says it standing still, because its width and brightness are the
   same strength the pulse is driven by.

   RADIANCE moves into its value on the beat the three bars above it do, from
   wherever it had got to, and counts with them.

   WHERE IT STANDS. The gutter and the junction row belong to the column
   beside the stage. Below it the rail stacks under the picture on a phone,
   and the bars are the whole of what is wanted there, so the sheet drops
   both and the bars take the width back.

   COST. The wire is built when a row has moved and never per frame. The
   dashes only ever have a transform and an opacity written, and a write is
   skipped when its value has not changed. Nothing here reads layout in the
   loop: the rectangles are read in rwDress, which render() calls. A throw in
   the frame would end requestAnimationFrame for the session, so each half is
   held, and a failure stops the layer and goes once to the console.
   ============================================================ */
var RW={rad:null,radShown:undefined,radRec:null,on:false,dead:false,seen:false};
function rwFail(e){RW.dead=true;
 try{console.error('railwire stopped: '+(e&&e.message?e.message:e));}catch(x){}}
/* ---- the radiance figure, and its tween ---- */
function rwRadRow(r){
 var now=performance.now(), rt=r.unread?null:r.radiance, rec=S.who+'|'+(S.rec==null?'':S.rec), q=RW.rad;
 if(!q||rec!==RW.radRec||rt===null||q.b===null){
  var first=!RW.seen&&rt!==null; RW.radRec=rec; RW.seen=RW.seen||rt!==null;
  if(first&&!rbStill()){
   RW.rad={a:0,b:rt,t0:isBooted()?now+4*ENTER_STAGGER:Infinity,dur:ENTER_SPAN,done:false}; RW.radShown=0;
   if(!isBooted())afterBoot(function(){RW.rad.t0=performance.now()+4*ENTER_STAGGER;});}
  else{RW.rad={a:rt,b:rt,t0:now,dur:ENTER_SPAN,done:true}; RW.radShown=rt;}}
 else if(Math.abs(q.b-rt)>0.001){
  RW.rad={a:RW.radShown,b:rt,t0:now,dur:ENTER_SPAN,done:rbStill()}; if(rbStill())RW.radShown=rt;}
 var v=RW.radShown;
 return '<div class="rw-rad" tabindex="0" data-tip-k="Radiance" data-tip="Vitality, awareness and will combined, '
  +'the root of their squares. It sets how bright the field behind the wheel is."><span class="rb-n">'+rbIcon('rad')
  +'Radiance</span><b>'+(v===null||v===undefined?'–':v.toFixed(2))+'</b></div>';}
function rwRadFrame(){
 var q=RW.rad; if(!q||q.done||q.b===null||q.a===null)return;
 var e=crMoAt(q,performance.now()), v=q.a+(q.b-q.a)*e;
 RW.radShown=v; if(e>=1){q.done=true;RW.radShown=q.b;v=q.b;}
 var b=document.querySelector('#fdock .rw-rad b'); if(b)b.textContent=v.toFixed(2);}
/* ============================================================
   DRESS. Called at the end of render(), after the six rows have been written
   and have taken their motion. The wire lives in the dock and not in either
   strip, so it survives the strips being rewritten; what it rebuilds from is
   the rows' own positions and the readings.
   ============================================================ */
/* THE WIRE ITSELF IS OFF. His words: "I don't know what that bar is on the
   left-hand side, but it's taking up real estate. Kill it." It drew real
   computed relationships between the six readings, never explained anywhere
   a person could find, so it read as decoration and cost a column of width
   for it. RW.on stays false, so rwFrame's own animation loop never starts
   one either. Radiance keeps its own tween, rwRadFrame, which never
   depended on the wire being on. */
function rwDress(r){RW.on=false;}
/* ============================================================
   THE FRAME. Called from the loop on the Field only. It advances the clock at
   the Field's own rate and moves the dashes along their wires. Nothing here
   touches layout.
   ============================================================ */
function rwFrame(r){
 if(RW.dead)return;
 try{rwRadFrame();}catch(e){rwFail(e);}}
