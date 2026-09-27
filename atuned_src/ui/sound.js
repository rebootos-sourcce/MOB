/* ============================================================
   THE SEAT TONE, THE FOUR MARKS AND THE VOICE. The only file in
   the product that touches AudioContext or speechSynthesis.

   hostfree.py names AudioContext and fails the build if engine/
   reaches for it, which is correct and must stay: a sound card is
   the host. The seat's number is data and lives in the engine, in
   FLOWSEAT, read through seatHz. This file only makes it audible.

   Ruled 25 September, on hearing it in two tunings: "The
   Solfeggio, excellent... we can wire this into the release... I
   think these all choose dynamically, based off the color of the
   chakra, that way it's just automatic. And then in the release,
   the person can toggle it on and off." ui/release.js decides
   what should be sounding and when. This file decides nothing.
   ============================================================ */

/* THE BED, ported from the sound research without a change to its bodies,
   because those bodies are what was measured. Rendered offline in headless
   Chromium against a harness that first read a known 393 and 399 pair back as
   393, 399 and a 5.99 beat, and caught its own first cut reading 16.6: every
   Solfeggio seat at both beats landed each ear on its own frequency to the
   hertz, steady to within 1 per cent, with the beat reading 5.99 and 9.98.
   tests/functional.js renders this bed offline on every run, with the same
   harness and its self test ahead of it, so those figures are held and not
   remembered.

   The carrier is the seat's tone, what a person hears as the pitch. The beat
   is the half's band, what a person hears as a slow pulse. They live on two
   different axes, pitch and pulse, so the seat's number and the brainwave band
   never compete for the same job.

   Centred: left is carrier minus half the beat, right is carrier plus half,
   so the fused tone sits on the seat's own number and a beat glide never drags
   the pitch with it.

   A ChannelMergerNode and not a StereoPannerNode: input 0 is the left ear and
   input 1 is the right ear, by definition, on every engine. The prototype used
   a panner and fell back to connecting the oscillator straight to the gain
   where there was none, which is a mix, and a mix is a monaural beat rather
   than a binaural one. That is the silent failure this file must not have.

   Two gain stages. One fades in, one fades out, so turning the bed off in the
   middle of its fade in never cancels a ramp and never clicks. Measured: off
   at 3 seconds into an 8 second fade in, the largest sample step was the one
   the still rising sine was already taking, 0.00085 against 0.00082 just
   before it, and the output was exactly zero from 7.2 seconds.

   Nothing loops. An oscillator runs until it is stopped, so there is no loop
   point and no seam to click. */
var BED=null;
function bedOn(ac,out,carrier,beat,gain,fadeS){
 if(BED)return BED;
 var t=ac.currentTime, m=ac.createChannelMerger(2),
     gi=ac.createGain(), go=ac.createGain();
 gi.gain.setValueAtTime(0,t);
 gi.gain.linearRampToValueAtTime(gain,t+(fadeS||8));
 m.connect(gi); gi.connect(go); go.connect(out);
 function ear(f,ch){var o=ac.createOscillator(); o.type='sine';
  o.frequency.setValueAtTime(f,t); o.connect(m,0,ch); o.start(t); return o;}
 BED={ac:ac,go:go,l:ear(carrier-beat/2,0),r:ear(carrier+beat/2,1),c:carrier,b:beat};
 return BED;}
/* glide the beat, the carrier, or both, over s seconds. linear on the beat,
   because the beat is a rate; exponential on the carrier, because the ear
   hears pitch in ratios.

   It restarts each ear from the last target rather than from wherever a glide
   in flight had reached, so a new target that arrives before the old one lands
   steps the pitch by what was left of it. The release never sends one early:
   its glides take nine tenths of a line and only a new line sends a target,
   so it keeps a tenth of a line in hand, which is REL_GLIDE. Anything that
   retargets faster has to hold the value in flight first. */
function bedTo(carrier,beat,s,at){
 if(!BED)return;
 var ac=BED.ac, t=(at==null?ac.currentTime:at), e=t+s;
 [[BED.l,-0.5],[BED.r,0.5]].forEach(function(p){
  var f=p[0].frequency; f.cancelScheduledValues(t);
  f.setValueAtTime(BED.c+p[1]*BED.b,t);
  if(carrier===BED.c) f.linearRampToValueAtTime(carrier+p[1]*beat,e);
  else f.exponentialRampToValueAtTime(carrier+p[1]*beat,e);});
 BED.c=carrier; BED.b=beat;}
/* off. an exponential approach to silence with a time constant of a fifth of
   the fade, from whatever level the bed is at, then the oscillators stop. */
function bedOff(s,at){
 if(!BED)return;
 var b=BED, ac=b.ac, t=(at==null?ac.currentTime:at), d=s||4; BED=null;
 b.go.gain.setTargetAtTime(0,t,d/5);
 b.l.stop(t+d+0.1); b.r.stop(t+d+0.1);}

/* THE LEVEL AND THE TWO BEATS, and none of the three is a new number.

   0.025 in each ear is 32 dB under full scale, measured at -32.04 on every
   seat. It is the prototype's level and the one the owner heard: a floor under
   the protocol, set where a person notices it stop and not start.

   The bands are the book's, at index.html 6434. "Theta, relaxed state. Most
   somatic release work happens here." "Alpha... The mind is programmable
   because it is not yet moving too fast. Most susceptible to installation
   work." The book names the bands and prints no hertz, so each beat sits mid
   band: 6 inside theta's 4 to 8, and 10 inside alpha's 8 to 12. The owner's
   own note on this, field note 15, names the five bands and no number either,
   and he left the number to the sound seat. BOOK-ERRATA.md items 29 to 31
   correct how alpha, waking and delta are described, and none of them moves
   the band under a release or under a reframe. */
var BED_GAIN=0.025, BED_THETA=6, BED_ALPHA=10;
/* four seconds out, on an end, a stop, a pause or the switch. The approach has
   a time constant of 0.8 seconds, so most of it is gone inside two. */
var BED_OUT=4;

/* ONE CONTEXT, OPENED ON A PRESS AND KEPT.

   A browser will not start audio before a person has pressed something, and
   it caps how many contexts a page may hold, so there is one, opened the first
   time the tone has to sound. That is always inside a press: Begin, Resume, or
   the switch itself. It is put to sleep once a fade out has finished, because
   a running context with nothing in it still holds the audio device awake on a
   phone, and it is woken the next time.

   A browser with no Web Audio at all is told apart from one that refused: the
   first gets no switch, because a control that cannot act is not offered, the
   rule the Begin button already keeps. The second is said once and not again,
   because a refusal repeated on every line of a run is noise. */
var BED_AC=null, BED_NAP=null, BED_DEAF=false;
function bedCan(){
 try{ return !!(window.AudioContext||window.webkitAudioContext); }catch(e){ return false; }}
function bedCtx(){
 if(BED_DEAF)return null;
 if(!BED_AC){
  try{ BED_AC=new (window.AudioContext||window.webkitAudioContext)(); }
  catch(e){ BED_DEAF=true;
   if(typeof status==='function')status('No seat tone. This browser would not open an audio channel.','fail');
   return null;}}
 if(BED_AC.state!=='running'){
  try{ var r=BED_AC.resume(); if(r&&r.catch)r.catch(function(){}); }catch(e){}}
 return BED_AC;}
/* ON AT A TONE, OR MOVED TO IT. The caller says what should be sounding and
   this makes it so, which is why every route through the release can call it
   without knowing what was sounding before. A target that is already sounding
   is left alone, so a render that changes nothing moves nothing. */
function bedFollow(carrier,beat,fadeS,glideS){
 if(BED){ if(BED.c!==carrier||BED.b!==beat)bedTo(carrier,beat,glideS); return true;}
 var ac=bedCtx(); if(!ac)return false;
 clearTimeout(BED_NAP);
 bedOn(ac,ac.destination,carrier,beat,BED_GAIN,fadeS);
 return true;}
function bedStop(s){
 if(!BED)return;
 var d=s||BED_OUT; bedOff(d);
 clearTimeout(BED_NAP);
 BED_NAP=setTimeout(function(){
  if(BED||!BED_AC||BED_AC.state!=='running')return;
  try{ var r=BED_AC.suspend(); if(r&&r.catch)r.catch(function(){}); }catch(e){}},(d+0.3)*1000);}
/* what is sounding, for the gate. The two ears are read off the oscillators
   rather than off what they were told, so the split can be held to what is
   actually playing and not to what this file intended. */
function bedState(){
 return {on:!!BED, carrier:BED?BED.c:null, beat:BED?BED.b:null,
  left:BED?BED.l.frequency.value:null, right:BED?BED.r.frequency.value:null,
  ctx:BED_AC?BED_AC.state:'none'};}

/* ============================================================
   THE FOUR MARKS. DESIGN-release.md section 4, as numbers.

   One family and one rule. Every mark is a sine, plus at most one
   partial, through one lowpass, at or under 0.09 of full scale.
   Meaning rides on two things only: which way the pitch moves and
   which side it comes from. Up is arriving, down is leaving, still
   is a stop, and the pan is the channel.

   A mark is a boundary and never a beat. A run at the full dose
   speaks hundreds of lines and none of them chimes: one mark at
   each change of channel, one at each cross, one at the close.
   The count does not grow with the dose, which is what lets a
   person hear it on the fortieth sitting.

   Everything sits between 330 and 900 hertz, above the mud a
   laptop speaker makes under 150 and under the band a voice
   needs. The marks go out on the one context the bed opened, so a
   run with the sound off never opens a channel at all.
   ============================================================ */
function audioOn(){ return bedCtx(); }
/* one mark. waveform sine, frequency, envelope in milliseconds, lowpass,
   peak gain, pan. every figure is passed in, never a preset. */
function tone(o){
 var ac=audioOn(); if(!ac)return false;
 try{
  var t=ac.currentTime+(o.at||0), end=t+o.ms/1000;
  var g=ac.createGain(), f=ac.createBiquadFilter(), osc=ac.createOscillator();
  f.type='lowpass'; f.frequency.value=o.lp; f.Q.value=0.7;
  osc.type='sine'; osc.frequency.setValueAtTime(o.f0,t);
  osc.connect(g);
  if(o.partial){ var o2=ac.createOscillator(), g2=ac.createGain(); o2.type='sine';
   o2.frequency.setValueAtTime(o.f0*o.partial,t); g2.gain.value=o.partialGain||0.10;
   o2.connect(g2); g2.connect(g); o2.start(t); o2.stop(end+0.08); }
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(o.peak,t+o.a/1000);
  if(o.hold)g.gain.setValueAtTime(o.peak,t+(o.a+o.hold)/1000);
  g.gain.exponentialRampToValueAtTime(0.0001,end);
  g.connect(f);
  var p=ac.createStereoPanner?ac.createStereoPanner():null;
  if(p){ p.pan.value=o.pan||0; f.connect(p); p.connect(ac.destination); }
  else f.connect(ac.destination);
  osc.start(t); osc.stop(end+0.08);
  return true;
 }catch(e){ return false; }}
/* TURN. The channel changes. An 8 ms attack is under the 10 ms line where an
   envelope stops reading as a click, and a change of side should click. Panned
   0.7 and never 1.0: hard panning hurts on headphones and vanishes on a laptop
   pair. 587 under the release, 784 under the reframe. */
function earTurn(side,truth){
 var f=truth?784:587;
 tone({f0:f,a:8,ms:190,lp:2200,peak:0.06,partial:2,partialGain:0.10,pan:side==='R'?0.7:-0.7});}
/* CROSS. Release to reframe at one address. A rising fifth, 587 then 880,
   with a 25 ms attack so it swells where TURN clicks. Centred, because both
   channels have just been addressed and the cross belongs to neither. */
function earCross(){
 tone({f0:587,a:25,ms:220,lp:2800,peak:0.09,partial:2,partialGain:0.08,pan:0});
 tone({f0:880,a:25,ms:420,lp:2800,peak:0.09,partial:2,partialGain:0.08,pan:0,at:0.13});}
/* CLOSE. The cooldown opens. One low note with a fifth over it, a 2.4 second
   decay and the darkest filter in the family. */
function earClose(){
 tone({f0:392,a:40,hold:200,ms:2400,lp:1600,peak:0.07,partial:1.5,partialGain:0.14,pan:0});}
/* HALT. End pressed. The only mark whose pitch goes nowhere. */
function earHalt(){
 tone({f0:330,a:6,ms:260,lp:1200,peak:0.05,pan:0});}

/* THE BODY HALF OF THE SAME MARK. navigator.vibrate exists on Android Chrome
   and not on iOS Safari, and a desktop browser carries the method with no
   motor behind it. So it is offered only where the pointer is a finger, and
   it fires at the same instant and for the same length as the mark it
   doubles, because a person feeling it and a person hearing it are being told
   one thing. */
function buzzCan(){
 try{ return !!(navigator.vibrate&&window.matchMedia&&matchMedia('(pointer:coarse)').matches); }
 catch(e){ return false; }}
function buzz(pat){
 if(!buzzCan())return false;
 try{ return navigator.vibrate(pat); }catch(e){ return false; }}

/* ============================================================
   THE VOICE. Browser speech synthesis, and the one other thing in
   the product besides the bed that makes a sound.

   It is the temporary voice, ruled (TASKS RF12): his own recording
   is the one asset that cannot be generated and it is not in this
   build. Everything a voice says is also on the screen at the same
   moment, so turning it off loses nothing.

   WHERE THE WORDS GO, which a page cannot prove and so has to say.
   Safari and Firefox speak on the device. Chrome and Edge offer
   both, and their best voices are servers. localService is the
   platform's own answer, so a local voice is preferred and the one
   picked is named, with where it runs, before it says a word
   (DESIGN-release.md section 3). A synthesis request leaves through
   the browser's own process, so no request log on any page can see
   it, and tests/design.js gate 7 stays green either way. That is
   why the sentence exists.

   The list is read fresh at every pick rather than cached, because
   every browser that loads its voices late returns an empty list on
   the first call (TASKS RF11).
   ============================================================ */
function voiceCan(){
 try{ return !!(window.speechSynthesis&&window.SpeechSynthesisUtterance); }catch(e){ return false; }}
function voiceList(){
 try{ return (voiceCan()&&speechSynthesis.getVoices())||[]; }catch(e){ return []; }}
function voicePick(){
 var vs=voiceList(); if(!vs.length)return null;
 var en=vs.filter(function(v){return /^en/i.test(v.lang||'');});
 var pool=en.length?en:vs;
 var local=pool.filter(function(v){return v.localService;});
 return local[0]||pool[0]||null;}
/* what the panel says about the voice, before the voice says anything */
function voiceSay(){
 if(!voiceCan())return {ok:false,line:'This browser has no speech voice. The run reads on the screen.'};
 var v=voicePick();
 if(!v)return {ok:true,unknown:true,
  line:'The browser has not named its voice yet, so this page cannot say whether the words stay '
   +'on this machine. Turn the voice off and the run reads on the screen.'};
 if(v.localService)return {ok:true,local:true,v:v,
  line:'The voice is '+v.name+', and it runs on this machine. The words go nowhere.'};
 return {ok:true,local:false,v:v,
  line:'The voice is '+v.name+', and it is a network service. The words are sent to the browser '
   +'vendor to be spoken. Turn the voice off and the run reads on the screen.'};}
/* SAY ONE LINE, a sentence at a time. A long utterance is cut off part way on
   some Chrome voices, and a card line from the letting go cards runs to three
   sentences, so each sentence is its own utterance and the line ends when the
   last one does. onend gets the milliseconds it took. onfail is told once if
   the browser refused, and the caller decides what silence means. */
function speak(text,rate,onend,onfail){
 if(!voiceCan())return false;
 var parts=String(text||'').match(/[^.!?]+[.!?]*/g)||[String(text||'')];
 parts=parts.map(function(s){return s.trim();}).filter(function(s){return s;});
 if(!parts.length)return false;
 var v=voicePick(), t0=Date.now(), over=false;
 try{
  if(speechSynthesis.speaking||speechSynthesis.pending)speakStop();
  parts.forEach(function(s,i){
   var u=new SpeechSynthesisUtterance(s);
   if(v){u.voice=v; u.lang=v.lang;}
   u.rate=Math.max(0.5,Math.min(1.8,0.9*(rate||1))); u.pitch=0.95; u.volume=1;
   if(i===parts.length-1)u.onend=function(){ if(over)return; over=true;
    if(onend)onend(Date.now()-t0); };
   u.onerror=function(e){ if(over)return; over=true;
    if(onfail)onfail((e&&e.error)||'error'); };
   speechSynthesis.speak(u);});
  return true;
 }catch(e){ return false; }}
function speakStop(){ try{ if(voiceCan())speechSynthesis.cancel(); }catch(e){} }
