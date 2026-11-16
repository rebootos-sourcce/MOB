/* ============================================================
   SOURCE READS AN EXAMPLE. Eleven seconds, once per device, between the
   door and the first card of the onboarding. His words, 16 November: "Let's
   bring that up to 90% now." The spec is the animation pass's, built on the
   face's own timers and not on a second copy of them.

   The face wakes, reads one fixed sentence that is not the person's, lights
   the two seats those words land on, says one line, and hands over with one
   button. It is shown, not explained: the first card that follows is where
   the person writes, and this is the eleven seconds that show what writing
   does before they are asked to.

   WHERE IT PLAYS. loginEnter (ui/login.js), behind the seen check and ahead
   of obOpen(false), as srcIntro(()=>obOpen(false)). Never on a replay from
   Account, which calls obOpen(true) directly and never reaches loginEnter;
   never for a walk that is half done (journeyRead(CURP).at), which goes
   straight back to its card; never under DEV_SKIP; and once per device,
   source.intro in the browser's own store, the pattern tabLandFirst uses
   for source.landed (ui/panels.js), for its reason: having seen the face
   read is about this screen, not about the person. Set as it starts, so a
   reload mid sentence does not play it twice. A store that is blocked
   cannot remember, so the intro is skipped rather than shown on every
   launch, which is tabLandFirst's own answer to the same case.

   EVERY BEAT IS THE FACE'S OWN CLOCK. Ahead of the reading the intro holds
   three times, all from its own start: the beat cued at 0.6 seconds, line
   one in at 1.25, out at 2.85 with the reading. From there nothing is timed
   here: each word shows on onWord, each underline on onHit, the rows and the
   spoken line on onHold, all fired by srcface.js's own word clock and seat
   timers, so a change to the face's pacing moves the captions with it. The
   one other timer is the button's fallback, 10.4 seconds, for a voice that
   never starts; a voice that plays brings the button on its own end.

   SKIP and Escape land on the end frame, the sentence, both underlines, both
   rows and the button, and never on the first card: one deliberate press is
   still the way in. The face keeps reading on its own clock under the end
   frame, since the face is the one thing here with its own motion, and a
   skip is silence: the line is not spoken after it.

   REDUCED MOTION is the end frame from the first frame, as rbStill
   (ui/component.js) reads it. The face already reads and draws at reduced
   motion, every timer at zero, so there is no second still path here. The
   voice still speaks: sound is not motion.

   THE FACE IS LENT, NOT MOVED. One canvas, normally in #stuni. take() holds
   it on this stage, so a render of the Journal underneath cannot pull it
   back mid sentence; clear() drops the example's reading at once, so it is
   not still lit on the Journal for the fourteen seconds a reading normally
   takes to leave; give() ends the loan; uniHandBack (ui/panels.js), the
   boot's own route home, puts it back. One route, three callers.
   ============================================================ */
var SRC_INTRO_KEY='source.intro';
/* parseStory, run headless on the built engine, 16 November: "heart sank" is
   a counted Heart hit landing on 53 to 56 with Sad, "afraid" a counted Root
   hit landing on 1, 4, 5 and 7 with Fear, nothing denied, nothing about
   someone else, and srcSafe does not trip. tests/srcintro.js holds all of it,
   so a lexicon change that moves either hit fails a gate before it changes
   what a stranger is shown. */
var SRC_INTRO_EX='My heart sank when she left, and I felt afraid all night.';
/* fixed script, not composed: it names the two seats the example lands on,
   in the order they land, and voiceTick (ui/srcface.js) rings each seat as
   the voice reaches its name */
var SRC_INTRO_SAY='Heart, then root. That is where those words landed.';
var SRC_INTRO_L1='This is Source. It reads what you write.';
var SRC_INTRO_EB='An example, not yours.';
/* ms from the start, the spec's, ahead of the face's own clock taking over */
var SRC_INTRO_T={cue:600, l1:1250, read:2850, go:10400, out:260, hand:120};
var SX=null;
function srcIntroDue(){
 if(typeof DEV_SKIP!=='undefined'&&DEV_SKIP)return false;
 if(!window.SrcFace||typeof SrcFace.take!=='function'||typeof SrcFace.plan!=='function')return false;
 try{ if(typeof journeyRead==='function'&&typeof CURP!=='undefined'&&CURP&&journeyRead(CURP).at)return false; }catch(e){}
 try{
  if(typeof STORE_BOUND==='undefined'||!STORE_BOUND)return false;
  if(STORE.get(SRC_INTRO_KEY))return false;
 }catch(e){ return false; }
 return true;}
/* the sentence, laid out from the face's own plan of it, word for word, with
   each counted hit's words held in one underline in its seat's colour. The
   face's words are the normalised ones and these are the shown ones, so the
   two are matched by count, and an example the two would count differently
   is refused rather than underlined in the wrong place */
function srcIntroSentence(pl){
 var shown=SRC_INTRO_EX.split(/\s+/);
 if(!pl||shown.length!==pl.words.length)return null;
 var at={}; pl.hits.forEach(function(h,i){ at[h.k-h.n+1]=i; });
 var out=[], k=0;
 while(k<shown.length){
  if(at[k]!==undefined){ var h=pl.hits[at[k]], ws=[];
   for(var j=k;j<=h.k;j++)ws.push('<span class="sx-w" data-k="'+j+'">'+esc(shown[j])+'</span>');
   out.push('<span class="sx-u" data-h="'+at[k]+'" style="--sc:'+h.col+'">'+ws.join(' ')+'</span>');
   k=h.k+1; continue; }
  out.push('<span class="sx-w" data-k="'+k+'">'+esc(shown[k])+'</span>'); k++; }
 return out.join(' ');}
/* one row a seat, in the order the seats are hit, each its FLOWSEAT entry's
   own name and seat: "Heart, mid sternum." The name alone is a symbol, and
   the seat beside it is what it means on a body */
function srcIntroRows(pl){
 var seen={}, rows=[];
 pl.hits.forEach(function(h){ if(seen[h.key])return; seen[h.key]=1;
  var f=(typeof FLOWSEAT!=='undefined'?FLOWSEAT:[]).filter(function(x){ return x.k===h.key; })[0];
  if(f)rows.push('<li class="sx-row" style="--sc:'+h.col+'">'+esc(f.n+', '+f.seat+'.')+'</li>'); });
 return rows.join('');}
function srcIntro(done){
 done=typeof done==='function'?done:function(){};
 if(SX||!srcIntroDue()){ if(!SX)done(); return; }
 var pl=SrcFace.plan(SRC_INTRO_EX), sent=srcIntroSentence(pl);
 if(!sent||!pl.hits.length){ done(); return; }
 try{ STORE.set(SRC_INTRO_KEY,'1'); }catch(e){ done(); return; }
 var still=typeof rbStill==='function'&&rbStill();
 var h=document.createElement('div');
 h.id='srcintro'; h.className='sx'+(still?' sx-still':'');
 h.setAttribute('role','dialog'); h.setAttribute('aria-modal','true');
 h.setAttribute('aria-label','Source reads an example');
 h.innerHTML='<button type="button" class="dev-skip sx-skip">Skip</button>'
  +'<div class="sx-col"><div class="sx-face"></div>'
  +'<div class="sx-text"><div class="sx-slot">'
  +'<p class="sx-l1">'+esc(SRC_INTRO_L1)+'</p>'
  +'<div class="sx-ex" aria-live="polite"><p class="sx-eb">'+esc(SRC_INTRO_EB)+'</p><p class="sx-s">'+sent+'</p></div>'
  +'</div><ul class="sx-rows">'+srcIntroRows(pl)+'</ul>'
  +'<div class="sx-go"><button type="button" class="btn pri sx-own">Write your own</button></div>'
  +'</div></div>';
 document.body.appendChild(h);
 SX={h:h, done:done, pl:pl, t:[], t0:performance.now(), end:false, rows:false, go:false,
  voiced:false, playing:false, spoke:false, left:false, still:still};
 SrcFace.take(h.querySelector('.sx-face'));
 h.querySelector('.sx-skip').addEventListener('click',srcIntroSkip);
 h.querySelector('.sx-own').addEventListener('click',srcIntroLeave);
 addEventListener('keydown',srcIntroKey,true);
 var q=function(f,ms){ SX.t.push(setTimeout(f,ms)); };
 if(still){ srcIntroEnd(); srcIntroRead(); srcIntroSpeak(); srcIntroGo(); return; }
 /* the focus goes into the stage and not onto Skip: a ring round Skip on
    the first frame was the loudest thing on the screen, measured on the
    first screenshots, and Escape answers from anywhere in it */
 h.tabIndex=-1; h.focus({preventScroll:true});
 q(function(){ if(window.SrcFace)SrcFace.cue(); },SRC_INTRO_T.cue);
 q(function(){ srcIntroOn('.sx-l1'); },SRC_INTRO_T.l1);
 q(function(){ var l=h.querySelector('.sx-l1'); l.classList.add('off'); l.classList.remove('on');
  srcIntroOn('.sx-ex'); srcIntroRead(); },SRC_INTRO_T.read);
 /* a voice that never started brings the button here; one that is playing
    brings it at its own end */
 q(function(){ if(!SX.playing)srcIntroGo(); },SRC_INTRO_T.go);}
function srcIntroOn(sel){ if(!SX)return; [].forEach.call(SX.h.querySelectorAll(sel),function(e){ e.classList.add('on'); }); }
/* the reading, on the face's own clock, its hooks the captions */
function srcIntroRead(){
 if(!SX)return;
 SrcFace.read(SRC_INTRO_EX,{
  onWord:function(w){ if(!SX)return; var e=SX.h.querySelector('.sx-w[data-k="'+w.k+'"]'); if(e)e.classList.add('on'); },
  onHit:function(x){ if(!SX)return; var i=-1; SX.pl.hits.forEach(function(y,j){ if(y.k===x.k&&y.ring===x.ring)i=j; });
   var u=SX.h.querySelector('.sx-u[data-h="'+i+'"]'); if(u)u.classList.add('on'); },
  onHold:function(){ if(!SX)return; srcIntroOn('.sx-row'); SX.rows=true; srcIntroSpeak(); }});}
function srcIntroSpeak(){
 if(!SX||SX.voiced)return; SX.voiced=true;
 if(typeof stSrcSpeak!=='function'){ return; }
 stSrcSpeak(SRC_INTRO_SAY,{quiet:true,
  onPlay:function(){ if(SX)SX.playing=true; },
  onEnd:function(played){ if(!SX)return; SX.playing=false; SX.spoke=!!played;
   /* a line that failed before 10.4 waits for the fallback, so a voice that
      cannot reach the server never brings the button early */
   if(played||performance.now()-SX.t0>=SRC_INTRO_T.go)srcIntroGo(); }});}
/* the end frame: every word, both underlines, both rows, line one gone */
function srcIntroEnd(){
 if(!SX)return; SX.end=true;
 var l=SX.h.querySelector('.sx-l1'); l.classList.remove('on'); l.classList.add('off');
 srcIntroOn('.sx-ex,.sx-w,.sx-u,.sx-row'); SX.rows=true;}
function srcIntroGo(){
 if(!SX||SX.go)return; SX.go=true; srcIntroOn('.sx-go');
 var b=SX.h.querySelector('.sx-own'); if(b)b.focus({preventScroll:true});}
function srcIntroSkip(){
 if(!SX||SX.left)return;
 SX.t.forEach(clearTimeout); SX.t=[];
 /* a skip is silence: the line is not spoken after it, and one still
    waiting on the server is dropped. A line already playing finishes,
    the way a press in the middle of a sentence would not cut it either. */
 if(!SX.playing){ var asked=SX.voiced; SX.voiced=true; if(asked&&typeof srcVoiceCut==='function')srcVoiceCut(); }
 if(!SX.end){ var started=!!SX.h.querySelector('.sx-w.on'); if(!started)srcIntroRead(); srcIntroEnd(); }
 srcIntroGo();}
function srcIntroKey(e){
 if(!SX||e.key!=='Escape')return;
 e.stopPropagation(); if(e.cancelable)e.preventDefault();
 srcIntroSkip();}
/* THE HAND OVER. The face leaves on the ease in over 260ms, and the first
   card's own arrival starts 120ms into that, under it, so the two overlap
   and the ground never shows the Journal between them. Only then is the face
   cleared and given back. */
function srcIntroLeave(){
 if(!SX||SX.left)return; var sx=SX; sx.left=true;
 sx.t.forEach(clearTimeout); sx.t=[];
 removeEventListener('keydown',srcIntroKey,true);
 if(typeof srcVoiceCut==='function')srcVoiceCut();
 var fin=function(){
  try{ SrcFace.clear(); SrcFace.give(); }catch(e){}
  try{ if(typeof uniHandBack==='function')uniHandBack(); }catch(e){}
  if(sx.h.parentNode)sx.h.parentNode.removeChild(sx.h);
  if(SX===sx)SX=null; };
 if(sx.still){ sx.done(); fin(); return; }
 sx.h.classList.add('sx-out');
 setTimeout(function(){ try{ sx.done(); }catch(e){} },SRC_INTRO_T.hand);
 setTimeout(fin,SRC_INTRO_T.out);}
