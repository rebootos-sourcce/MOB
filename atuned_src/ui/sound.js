/* ============================================================
   THE SEAT TONE, THE FOUR MARKS, THE FITTINGS, THE ATMOSPHERE AND
   THE VOICE. The only file in the product that touches AudioContext
   or speechSynthesis. The fittings are the interface's own sounds
   for seven moments, played through sfx(name). The atmosphere is the
   soft layer under nearly every press, and the room under a zoom.
   Both are on until a person turns them off, with one switch.

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
   THE FITTINGS. The interface's own sounds, and the second family
   in the product. His words, 1 October: "the sound effects wire
   that in, make sure it's an engine." Earlier: "if it's low cost
   to get it in, let's do it." It is a few hundred bytes of
   numbers and one function, so it is in.

   AN ENGINE AND NOT A SCATTER. Every sound is one row of SFX
   below, read by one function, sfx(name). A hook point says what
   happened and nothing about how it sounds. Every number lives in
   the table, so a sound is retuned in one place and the gate in
   tests/sound.js reads the same rows it renders.

   THE GRAMMAR, which is the same job an icon set does for the eye.
   Every fitting is hardware: a latch, a valve, a key, a seal. No
   chime, no coin, no swell of strings. Each is built from at most
   two things, a body and a tick:

     the body   a sine between 392 and 587 hertz, with at most one
                partial, through a lowpass at or under 2.4 kilohertz.
                The partial is 2.76 times the body where a thing is
                struck, which is the second mode of a free bar and is
                what makes wood or metal read as wood or metal, and a
                plain octave or fifth where a thing is hollow or
                sealed.
     the tick   seeded noise through a bandpass at 1.8 to 3 kilohertz,
                one to fifteen milliseconds. The metal of the fitting.
                It is the only thing above 2.4 kilohertz in the family
                and it is over before it can be heard as a pitch.

   Meaning rides on three things only, and they are the release
   family's three where the two overlap:

     the envelope   under 10 ms of attack is a strike and reads as a
                    thing that happened. 60 ms and over is a swell
                    and reads as a thing arriving. undo is kept
                    played with its envelope reversed, a latch drawn
                    back, which is the whole of the difference.
     the pitch      still is a stop, as HALT is in the release. Up is
                    arriving, as it is in the release: only the mark
                    rises, by a semitone, the key turning home.
     the length     the weight of the event. A keep is a click, a
                    refusal is two knocks, a practice done is a seal
                    with a ring under it. Nothing reaches 600 ms.

   Centred, always. Pan belongs to the release, where it means the
   channel, and a fitting that came from one side would say a channel
   it does not mean.

   THE LEVEL. Every fitting peaks under SFX_CEIL, 0.08 of full scale,
   about 22 dB down, and each row carries its own lower ceiling. The
   release's loudest mark, CROSS, is 0.09: an interface sound is never
   the loudest thing the product makes, because the release is the
   event and a save is not.

   THE LENGTH. SFX_MAX_MS is 600. An interface sound has to be over
   before the next press, and a person's next press comes about half
   a second to a second after a confirmation; a sound still ringing
   when the next one lands is two sounds in one ear. The release may
   ring for 2.4 seconds because it closes a sitting. The interface
   never does.

   SILENCE IS THE DEFAULT, and every switch below can only make it
   quieter. Five things hold it silent, read in sfxWhy:

     off            the switch, in the profile menu and in Settings,
                    Display, Sound. ON on every profile until the
                    person turns it off, round OJ, his ruling: "sound
                    on by default". The seat tone and the release's own
                    switches are unchanged and stay off until chosen.
     quiet          the Quiet switch. A person who reached for less
                    on the screen did not ask for more in the ear.
     release        a release is running. It is its own room with its
                    own switches, tone, voice and vibration, and its
                    own four marks. A fitting inside it is a second
                    family at the same boundary, and two families at
                    one boundary fight. So a silent release stays
                    silent whatever this switch says, which
                    tests/design.js and tests/sound.js both hold.
     no press yet   a browser opens no audio before a person presses
                    something, and nothing here tries. Nothing sounds
                    on load, whatever the profile says.
     no audio       a browser with no Web Audio.

   NOT prefers-reduced-motion, and the reason is written down because
   the brief said to. That setting is a request about motion: things
   moving across the screen make some people unwell. It says nothing
   about sound. A person who set it for that reason and then turned
   Sound effects on in this product has said yes to sound in the one
   place that asks about sound. Silencing them would be the operating
   system overruling the person on a question it never asked. Quiet
   is different: it is this product's own switch for less, and it
   wins.

   NOTHING IS CARRIED BY SOUND ALONE. Every fitting plays beside a
   line on the screen that says the same thing: the status line, the
   Done on the ritual, "Time is up" on the timer, the mark on the
   record. A person who never turns this on loses nothing.

   WHAT THE FITTINGS LEAVE OUT, and it is most of the product, and it is
   the atmosphere's now. These seven were built on a reading that said no
   sound on a tab, a press, a hover, a slider, a save, a sheet opening or a
   tip, because a sound on each is the product that ships thirty sounds and
   is unbearable. He ruled that reading out in round OU and round OV, and
   THE ATMOSPHERE below is the answer: a quieter, shorter family of the same
   seven numbers under presses, overlays, sheets, the wheel, the zoom and a
   hovering pointer, with a burst limiter, a hover limiter and one level
   table. The fittings are unchanged, and a press that earns one of them
   gets it and no click. Still left out, on purpose: a slider, which would
   sound the whole length of a drag; typing, which would sound every key;
   and a tip appearing, which is a hover already. And still no sound for a
   release beginning, a rerun beginning or a release ending: the release
   already has the seat tone fading in under its opening and CLOSE at its
   cooldown, on its own switch. And no sound for the release wall, "Nothing
   left to open": it is a state a person reads, not a press that was
   refused, and a sound with no press in front of it is an alarm.
   ============================================================ */
var SFX_CEIL=0.08, SFX_MAX_MS=600;
/* no more than three fittings in any one second, whatever asks */
var SFX_BURST=3;
/* ONE ROW PER SOUND. k the name a hook point uses. at the moment it marks.
   max the longest it may run, ms. ceil its own peak ceiling, under SFX_CEIL.
   gap the least time between two of the same, ms, so a held key or a loop
   cannot machine gun it. earn, a sound that is replaced by the mark when the
   same press earned one. buzz the vibration that doubles it, at the same
   instants. parts, each one voice:

     w     'sine' or 'noise'
     f     hertz. f1 and gl, a glide to f1 over gl ms
     p2    a partial at f times p2, at g2 of the body
     at    ms from the start. a attack, h hold, r release, ms
     pk    peak gain
     lp    lowpass hertz, or bp a bandpass hertz with q, and bp1 to
           sweep the band to a second centre over the part

   The release is an exponential decay with five time constants inside r, the
   way a struck thing actually dies away, then a step to zero from a level
   about 43 dB under the peak, which nobody hears. */
var SFX=[
 /* KEPT. A latch dropping into its keep. A Story entry committed, whether
    imprints were read out of it or "Kept. Nothing here read as charge": the
    sound says the words were kept, and the screen says what was read. A sound
    that differed by what was read would be a reading by ear, and sound never
    carries a reading here. Also redo, which keeps the same thing again. A
    3000 hertz tick and a short struck body on B4, 150 ms. The commonest
    fitting, so the shortest and among the quietest. */
 {k:'kept', at:'a Story entry kept, and redo', max:200, ceil:0.06, gap:300, earn:true, buzz:[8],
  parts:[{w:'noise',bp:3000,q:1.4,at:0,a:1,r:16,pk:0.03},
   {w:'sine',f:494,p2:2.76,g2:0.12,at:2,a:3,r:140,pk:0.045,lp:2400}]},
 /* UNDO. The same latch drawn back: kept with its envelope reversed. A 60 ms
    swell on the same body, cut short, and the tick at the end where the
    latch catches. A person who has heard kept hears this as kept undone with
    nothing to learn. */
 {k:'undo', at:'undo, taking back a commit', max:160, ceil:0.05, gap:180, buzz:[0,66,8],
  parts:[{w:'sine',f:494,p2:2.76,g2:0.12,at:0,a:60,r:26,pk:0.035,lp:2400},
   {w:'noise',bp:3000,q:1.4,at:66,a:1,r:14,pk:0.02}]},
 /* REFUSE. A valve shut against pressure. Two dull knocks on G4, level, with
    a hollow octave and the darkest filter in the family, 900 hertz. Still is
    a stop, as it is in the release's HALT. No tick: a refusal has no metal in
    it, and nothing about it should sound like an alarm. Played once inside
    status(), for every status(msg,'fail'), so every refusal the product
    already writes is heard and none is missed by a call site. gap 1200,
    because the same refusal said twice in a second is one refusal. */
 {k:'refuse', at:'any status(msg,"fail"): a refusal or a failed write', max:280, ceil:0.06, gap:1200, buzz:[18,100,18],
  parts:[{w:'sine',f:392,p2:2,g2:0.06,at:0,a:4,r:95,pk:0.05,lp:900},
   {w:'sine',f:392,p2:2,g2:0.06,at:120,a:4,r:95,pk:0.045,lp:900}]},
 /* MARK. A key landing and turning. Two ticks a pin apart, then the body
    rising a semitone into D5 over 40 ms, the one fitting that rises, because
    up is arriving. Only when a press earned a mark on the record for the
    first time this session: a Story entry that is the first or the tenth, a
    practice done that makes seven days. It replaces kept or done for that
    press, one sound per press, the heavier one. Not a coin: no square wave,
    no leap, no bright top, and 0.4 of a second. */
 {k:'mark', at:'a mark on the record earned for the first time', max:480, ceil:0.07, gap:1500, buzz:[8,47,8,30,30],
  parts:[{w:'noise',bp:2600,q:1.6,at:0,a:1,r:12,pk:0.025},
   {w:'noise',bp:2900,q:1.6,at:55,a:1,r:12,pk:0.025},
   {w:'sine',f:554,f1:587,gl:40,p2:2,g2:0.08,at:80,a:6,h:30,r:330,pk:0.05,lp:2000}]},
 /* DONE. A seal settling. A practice marked done on the ritual. A soft tick
    where the two faces meet, then G4 with a fifth over it, the colour of the
    release's CLOSE at a quarter of its length: the release ends on CLOSE and
    a practice ends on its small cousin. A breath of low noise under it, the
    air leaving the seal. The longest strike in the family, because it is the
    heaviest thing a person does outside a release. */
 {k:'done', at:'a practice marked done', max:600, ceil:0.07, gap:600, earn:true, buzz:[30],
  parts:[{w:'noise',bp:1800,q:1.2,at:0,a:1,r:10,pk:0.015},
   {w:'sine',f:392,p2:1.5,g2:0.12,at:2,a:10,h:40,r:470,pk:0.055,lp:1400},
   {w:'noise',lp:700,at:4,a:20,r:160,pk:0.008}]},
 /* TIME. The ritual timer has run out. The one place in the interface where
    sound carries something the eye cannot: a person running a timed practice
    may have their eyes shut. So it is the one fitting with no tick and no
    strike at all, two slow 70 ms swells on the done body, because a startle
    inside a practice undoes the practice. It plays with no press in front of
    it, the only one that does, on the audio a press already opened. "Time is
    up" is on the timer and the status line either way. */
 {k:'time', at:'the ritual timer running out', max:600, ceil:0.07, gap:2000, buzz:[40,240,40],
  parts:[{w:'sine',f:392,p2:1.5,g2:0.12,at:0,a:70,h:20,r:190,pk:0.055,lp:1400},
   {w:'sine',f:392,p2:1.5,g2:0.12,at:300,a:70,h:20,r:190,pk:0.055,lp:1400}]}];
var SFX_BY={}; SFX.forEach(function(x){SFX_BY[x.k]=x;});
/* the declared length of a row, the latest any part of it ends */
function sfxLen(x){
 return Math.max.apply(null,x.parts.map(function(p){return (p.at||0)+p.a+(p.h||0)+p.r;}));}
/* SEEDED NOISE, one buffer per context, so the tick is the same tick every
   time and the gate renders the same samples a person hears. */
function sfxNoise(ac){
 if(ac.__sfxN)return ac.__sfxN;
 var n=Math.round(ac.sampleRate*0.25), b=ac.createBuffer(1,n,ac.sampleRate), d=b.getChannelData(0), s=0x9e3779b9;
 for(var i=0;i<n;i++){ s=(Math.imul(s,1664525)+1013904223)>>>0; d[i]=s/2147483648-1; }
 ac.__sfxN=b; return b;}
/* RENDER ONE ROW onto any context, live or offline. This is the only code that
   builds a fitting, so what the gate measures offline is what plays. Returns
   the time the last part ends. */
function sfxRender(ac,out,x,t0){
 var end=t0;
 x.parts.forEach(function(p){
  var t=t0+(p.at||0)/1000, ta=t+p.a/1000, th=ta+(p.h||0)/1000, te=th+p.r/1000;
  var g=ac.createGain(), f=ac.createBiquadFilter(), src=[];
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(p.pk,ta);
  if(p.h)g.gain.setValueAtTime(p.pk,th);
  g.gain.setTargetAtTime(0,th,p.r/5000);
  g.gain.setValueAtTime(0,te);
  /* bp1 sweeps the band to a second centre over the part, which is how an air
     swell leans one way: up on opening and down on closing */
  var tail=f;
  if(p.bp){ f.type='bandpass'; f.frequency.setValueAtTime(p.bp,t);
   if(p.bp1)f.frequency.exponentialRampToValueAtTime(p.bp1,te);
   f.Q.value=p.q||1;
   /* a band's skirts reach a long way up on noise, so a swell that has to stay
      off the top of the range carries a lowpass behind its band */
   if(p.lp){ tail=ac.createBiquadFilter(); tail.type='lowpass'; tail.frequency.value=p.lp; tail.Q.value=0.7; f.connect(tail); }}
  else { f.type='lowpass'; f.frequency.value=p.lp||2400; f.Q.value=0.7; }
  if(p.w==='noise'){ var nb=ac.createBufferSource(); nb.buffer=sfxNoise(ac); nb.connect(g); src.push(nb); }
  else {
   var o=ac.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(p.f,t);
   if(p.f1)o.frequency.exponentialRampToValueAtTime(p.f1,t+(p.gl||0)/1000);
   o.connect(g); src.push(o);
   if(p.p2){ var o2=ac.createOscillator(), g2=ac.createGain(); o2.type='sine';
    o2.frequency.setValueAtTime(p.f*p.p2,t);
    if(p.f1)o2.frequency.exponentialRampToValueAtTime(p.f1*p.p2,t+(p.gl||0)/1000);
    g2.gain.value=p.g2||0.1; o2.connect(g2); g2.connect(g); src.push(o2); }}
  g.connect(f); tail.connect(out);
  src.forEach(function(s){ s.start(t); s.stop(te+0.02); });
  if(te>end)end=te;});
 return end;}

/* A PRESS HAS HAPPENED. Set on the way down, pointer or key, ahead of the
   handler the press is for, so the handler's own sound is inside the press.
   Pointer covers mouse, pen and touch, and with keys that is every way a
   person can press anything.

   The browser keeps the same fact, navigator.userActivation, and this does not
   read it, on purpose. A test harness that runs script into the page is
   counted by the browser as a press, so a gate reading the browser's flag
   could never see the case it exists for: the first cut of tests/sound.js
   found sound on load, from a page nobody had touched, for exactly that
   reason. The product's own flag is set only by a real event. */
var SFX_PRESSED=false, SFX_DEAF=false, SFX_NAP=null, SFX_TOLD={}, SFX_LAST={}, SFX_RECENT=[], SFX_PLAYED=0, SFX_AT=0;
function sfxGestured(){ return SFX_PRESSED; }
/* INSIDE A RELEASE. Read off RUN rather than off the panel being open, because
   a panel left open at its setup is not a run. 'pick' is the one phase a run
   ends in when it is refused at its close on a worked example, and that
   refusal is the end of the run, so it is the release's to sound or not. */
function sfxRoomHeld(){
 try{
  if(typeof RUN==='undefined'||!RUN)return false;
  var p=RUN.phase;
  if(p==='welcome'||p==='opening'||p==='run'||p==='pick')return true;
  return p==='done'&&typeof COOLING!=='undefined'&&RUN.cool<COOLING.length;
 }catch(e){ return false; }}
/* WHY IT IS SILENT, or '' when it may sound. One reader for every switch, so
   the gate and the setting say the same thing. */
function sfxWhy(){
 /* ON UNLESS THE PERSON TURNED IT OFF, round OJ. His words: "yes, sound on by
    default. With the sound on off in the profile." So every profile plays
    until it says sfxoff, which only the person's own press writes. */
 var u=(typeof CURP!=='undefined'&&CURP)?(CURP.ui||{}):null;
 if(!u||u.sfxoff===true)return 'off';
 if(u.quiet)return 'quiet';
 if(sfxRoomHeld())return 'release';
 if(!sfxGestured())return 'no press yet';
 if(SFX_DEAF||!bedCan())return 'no audio';
 return '';}
/* ONE CONTEXT FOR BOTH FAMILIES. The release's bed opens BED_AC and so does
   this, whichever is first, because a browser caps how many a page may hold.
   It never speaks through status: a refusal sounds from inside status, and a
   context that will not open is told once and then left alone. */
function sfxCtx(){
 if(SFX_DEAF)return null;
 if(!BED_AC){
  try{ BED_AC=new (window.AudioContext||window.webkitAudioContext)(); }
  catch(e){ SFX_DEAF=true;
   if(typeof status==='function')status('No sound effects. This browser would not open an audio channel.','fail');
   return null; }}
 if(BED_AC.state!=='running'){
  try{ var r=BED_AC.resume(); if(r&&r.catch)r.catch(function(){}); }catch(e){}}
 return BED_AC;}
/* THE MARKS ALREADY HEARD, per profile, as a set that only grows. It is
   refilled from the record at every press, so a mark earned with no sound of
   its own (the intake finished, a release run) is taken in quietly rather
   than sounded later on a press that did not earn it. A mark undone and
   redone is not new. */
var SFX_HEARD={id:null, keys:{}};
function sfxMarksNow(){
 try{ if(typeof ladderRead!=='function'||!CURP)return [];
  return ladderRead(CURP,Date.now()).earned.map(function(m){return m.k;}); }catch(e){ return []; }}
function sfxMarksTake(){
 if(typeof CURP==='undefined'||!CURP)return;
 if(SFX_HEARD.id!==CURP.id)SFX_HEARD={id:CURP.id, keys:{}};
 sfxMarksNow().forEach(function(k){SFX_HEARD.keys[k]=1;});}
/* true when this press earned a mark not heard before, and takes it in */
function sfxMarkNew(){
 if(typeof CURP==='undefined'||!CURP||SFX_HEARD.id!==CURP.id){ sfxMarksTake(); return false; }
 var fresh=sfxMarksNow().filter(function(k){return !SFX_HEARD.keys[k];});
 fresh.forEach(function(k){SFX_HEARD.keys[k]=1;});
 return fresh.length>0;}
/* THE PRESS LISTENER. Capture phase, so it runs before the press's own
   handler. It records that a press happened, and only when the switch is on
   does it do anything more: wakes the context inside the press, which is the
   one place every browser allows it, and reads the marks. Enter and Space are
   presses; letters typed into a story are not, so typing costs nothing. */
function sfxOnPress(e){
 SFX_PRESSED=true;
 if(e&&e.type==='keydown'){
  var t=e.target&&e.target.tagName;
  if(!(e.key==='Enter'||(e.key===' '&&t!=='INPUT'&&t!=='TEXTAREA')))return;}
 var w=sfxWhy();
 /* a person who has just switched sound off, or entered a release, is not
    left with a zoom ambience still sounding under it */
 if(w&&ATM_AMB)atmAmbKill();
 if(w==='off'||w==='quiet'||w==='no audio')return;
 /* opened here, inside the press, so the timer's end, which has no press in
    front of it, finds the audio already open on a browser that only allows
    it inside one */
 if(w===''&&sfxCtx())sfxNapLater(20000);
 atmWatch();
 sfxMarksTake();}
try{ addEventListener('pointerdown',sfxOnPress,true); addEventListener('keydown',sfxOnPress,true); }catch(e){}
/* PLAY ONE. The only entry point a hook uses. Returns the name of the sound
   it played, which is mark when the press earned one, or false.
   An unknown name is said once in the console and never throws, so a typo at
   a hook point is found by whoever reads the console and costs a person
   nothing. */
function sfx(name){
 var x=SFX_BY[name];
 if(!x){
  if(!SFX_TOLD[name]){ SFX_TOLD[name]=1; try{ console.warn('sfx: there is no sound named '+name); }catch(e){} }
  return false;}
 if(sfxWhy())return false;
 if(x.earn&&sfxMarkNew())x=SFX_BY.mark;
 var now=Date.now();
 if(now-(SFX_LAST[x.k]||-1e9)<x.gap)return false;
 SFX_RECENT=SFX_RECENT.filter(function(t){return now-t<1000;});
 if(SFX_RECENT.length>=SFX_BURST)return false;
 var ac=sfxCtx(); if(!ac)return false;
 try{
  var end=sfxRender(ac,ac.destination,x,ac.currentTime+0.005);
  SFX_LAST[x.k]=now; SFX_RECENT.push(now); SFX_PLAYED++; SFX_AT=now;
  /* one sound per press: a fitting that sounds inside a press takes the press's
     click with it, the way a mark takes the keep's place */
  if(ATM_PEND)ATM_PEND.drop=true;
  /* the body half of the same fitting, at the same instants, and only where
     the person has the vibration switch on as well */
  if(x.buzz&&CURP.ui.buzz)buzz(x.buzz);
  sfxNapLater(Math.max(0,(end-ac.currentTime))*1000+20000);
  return x.k;
 }catch(e){ return false; }}
/* PUT THE CONTEXT TO SLEEP once it has been idle a while, as the bed does,
   because a running context with nothing in it holds a phone's audio awake.
   The next press wakes it. Not while the bed is sounding, and not while a
   ritual timer is counting, because its end is the one fitting with no press
   in front of it and some browsers will not wake a context without one. */
function sfxNapLater(ms){
 clearTimeout(SFX_NAP);
 SFX_NAP=setTimeout(function(){
  if(BED||!BED_AC||BED_AC.state!=='running')return;
  if(typeof RIT!=='undefined'&&RIT&&RIT.run)return sfxNapLater(ms);
  try{ var r=BED_AC.suspend(); if(r&&r.catch)r.catch(function(){}); }catch(e){}},ms);}
/* what is sounding, for the gate */
function sfxState(){
 return {why:sfxWhy(), played:SFX_PLAYED, ctx:BED_AC?BED_AC.state:'none', last:SFX_LAST};}

/* ============================================================
   THE ATMOSPHERE. The third family, round OU, 1 October, and the one
   that widens everything above. His words: "I don't hear sound effects,
   they're on," because only seven moments made a sound. Then: "I want
   everything to have a very subtle atmospheric sound. Overlays, clicks, if
   I click on the field, if I zoom in, this field sounds a little bit
   louder. You know, very subtle sci-fi. Sounds, nothing overwhelming." And
   on round OV: "Yeah, hover should make sound."

   WHAT CHANGED IN THE RULING, AND WHAT DID NOT. The fittings above were
   built on the opposite reading: seven moments, and no sound on a tab, a
   press, a hover, a slider, a sheet or a tip, because a sound on each is the
   product that ships thirty sounds and is unbearable. He has ruled that
   reading out. The layer below puts a sound under nearly every press, and
   the discipline that is left is the one that makes that bearable on the
   fortieth hearing: every one of them is quieter than any fitting, shorter
   than any fitting, and built from the same seven numbers.

   WHAT STAYS, and every line of it is read in sfxWhy and held by the same
   gate:

     silence is the default until a person presses something. Nothing here
       sounds on load, and no hover sounds before the first press.
     Sound effects is ON by default, with the switch in the profile menu and
       in Settings (CURP.ui.sfxoff) to turn it off. This layer is under that
       one switch and has none of its own.
     Quiet wins. A running release keeps its own room and is silent for every
       sound here. A browser with no Web Audio gets none. One AudioContext,
       shared with the bed and the fittings. Reduced motion does not silence
       it, for the reason written above sfx().
     nothing is carried by sound alone. Every sound here is a heard echo of
       something the screen already shows: the circle that filled, the sheet
       that opened, the node that took the pin, the picture that came closer.

   ONE INSTRUMENT. The seven seat tones, FLOWSEAT in the engine, read through
   seatHz, are the whole scale: 396, 417, 528, 639, 741, 852 and 963 hertz,
   and the hover tick is one octave over the 852. Every pitch in this layer
   is one of those, so a click, an overlay, a node and the room under a zoom
   all sound like one thing being played. Retune FLOWSEAT and this retunes.
   Every voice is a sine and at most one partial through a lowpass, or noise
   through a filter. Nothing is a square, a saw or a chime.

   FOUR RULES OF MEANING, the release family's three and one of its own. Up is
   arriving and down is leaving: an overlay going on rises and going off
   falls, an air swell opens upward and shuts downward. Weight is length and
   depth: the light click is the shortest and highest, the heavy one the
   longest and lowest. Pitch is place: a press on the wheel rings the seat it
   landed on, and a layer's circle rings the seat or kind it belongs to.
   And level is nearness: a ping comes up a little as the field comes closer,
   and the room under the field comes up with the zoom.

   THE LEVEL. ATM_DB is one table, in dBFS, the peak each sound is tuned to,
   and ATM_MASTER multiplies every row and the zoom room together, so one
   number moves everything: 0.5 is 6 decibels down and 2 is 6 up. The loudest
   row, a ping at full zoom, is under minus 27, and the fittings above peak
   near minus 22 and minus 26. Most rows sit at minus 31 or lower. The
   gate renders every row offline and holds the measured peak to the table.

   THE MAP. ATM_MAP below is the one place that says which kind of control
   gets which sound, and it is read by the listeners, not described by them.
   Nothing hooks a control by hand. Three listeners at the window in the
   capture phase, for a click, a pointer arriving and a pointer moving, read
   the roles and data attributes a control already carries. Three hooks cover
   what has no control to read: the wheel press, the zoom, and a sheet.

   ONE SOUND PER PRESS. A press that earns a fitting, or a ping or an air
   swell, gets that sound and not also a click: the click waits one turn of
   the event loop, and anything that sounds inside the press takes it. And a
   press on the switch that turns sound off is silent, because the click is
   judged after the handler has run.

   THE BURST LIMITER. Every sound has its own gap, and the layer as a whole
   plays at most ATM_BURST in any second with ATM_SPACE between any two, so
   a held key or a fast hand is a run of separate clicks and never a smear.
   Hover has a limiter of its own and never counts against a click: at most
   ATM_HOVER_PER_S ticks in a second, one per element per ATM_HOVER_EACH, and
   none within ATM_HOVER_QUIET of any other sound, so the tick of the next
   control never lands on the click of the last. A pointer that has not
   moved makes none: the layout moving a control under a resting pointer is
   not the person arriving at it. Mouse and pen only. A finger makes none.
   ============================================================ */
var ATM_MASTER=1;
/* dBFS, per sound. The peak each row is tuned to at ATM_MASTER 1. */
var ATM_DB={'click-light':-38,'click':-34,'click-heavy':-31,
 'overlay-on':-32,'overlay-off':-34,'air-open':-34,'air-close':-37,
 'ping':-31,'hover':-46,'ambience':-32};
/* a ping comes up by this many decibels from the field at 1x to the field at
   full zoom, linear in the zoom's own logarithm */
var ATM_LIFT_DB=3;
var ATM_BURST=6, ATM_SPACE=40, ATM_HOVER_PER_S=4, ATM_HOVER_EACH=1500, ATM_HOVER_QUIET=250, ATM_HOVER_GAP=140;
/* THE ROOM UNDER A ZOOM. Silent at 1x. It follows the zoom's level with a
   time constant of ATM_AMB_TC, and brightens with it from ATM_AMB_LP0 to
   ATM_AMB_LP1. A person who stops zooming holds it ATM_AMB_HOLD, lets it fall
   with a time constant of ATM_AMB_FALL, and it is exactly zero ATM_AMB_END
   after the last zoom input, which is the 1.5 seconds he asked for. */
var ATM_AMB_TC=0.15, ATM_AMB_HOLD=0.4, ATM_AMB_FALL=0.2, ATM_AMB_END=1.5, ATM_AMB_LP0=520, ATM_AMB_LP1=2400;
/* which seat's number a thing with no seat sounds at: the heart, the middle of
   the seven, so a press on a gate or the core is neither high nor low */
var ATM_NOSEAT='Heart';
/* THE ROWS. The grammar is the fittings' own: parts, with a, h and r in
   milliseconds, lp or bp in hertz. fr is a ratio of the row's pitch, so the
   pitch is one number the caller or the table names, a seat. fr1 is where a
   glide ends. pk is the part's weight against the row's level, 1 for the loud
   one. max is the longest the row may run and gap the least time between two
   of the same, ms. seat is the seat the pitch is read from, or null when the
   caller names it. oct is an octave multiplier. Sine parts carry at most one
   partial, p2 at g2 of the body, through a lowpass. A noise part is filtered
   and is the only thing here that is not a pitch. */
var ATM=[
 /* CLICK, light, normal and heavy. A press as a tone and never a strike: the
    attack is 9 to 12 ms, over the 10 ms line where an envelope stops reading
    as a click, a hair of fall in the pitch as the press settles, and a short
    decay. Light is the brow and the shortest, for a chip or a small switch;
    normal is the heart, for a button or a tab; heavy is the sacral and the
    longest, for a primary action and for anything that cannot be taken back. */
 {k:'click-light', seat:'3rd Eye', oct:1, max:120, gap:45,
  parts:[{w:'sine',fr:1,fr1:0.985,gl:30,p2:2,g2:0.14,at:0,a:9,r:55,pk:1,lp:2600}]},
 {k:'click', seat:'Heart', oct:1, max:140, gap:60,
  parts:[{w:'sine',fr:1,fr1:0.97,gl:35,p2:2,g2:0.12,at:0,a:10,r:75,pk:1,lp:2200}]},
 {k:'click-heavy', seat:'Sacral', oct:1, max:200, gap:90,
  parts:[{w:'sine',fr:1,fr1:0.97,gl:40,p2:1.5,g2:0.12,at:0,a:12,r:110,pk:1,lp:1500}]},
 /* OVERLAY. The layer's own pitch, from its seat or its kind. On, a tone
    that rises two semitones into the pitch and stays a moment; off, the same
    pitch leaving, falling two semitones and gone. Up arrives and down
    leaves, as everywhere in the product. */
 {k:'overlay-on', seat:null, oct:1, max:260, gap:120,
  parts:[{w:'sine',fr:0.8909,fr1:1,gl:80,p2:2,g2:0.10,at:0,a:16,h:10,r:110,pk:1,lp:2400}]},
 {k:'overlay-off', seat:null, oct:1, max:260, gap:120,
  parts:[{w:'sine',fr:1,fr1:0.8909,gl:80,p2:2,g2:0.10,at:0,a:10,h:0,r:120,pk:1,lp:2000}]},
 /* AIR. A sheet or a column opening or closing: band limited noise whose
    centre leans one way. Opening is a 120 ms swell leaning up from 700 to
    1500 hertz; closing is quicker, 40 ms, leaning down, and softer. The only
    rows that are not a pitch, and the only ones whose partial count is
    nothing. pk is set so a measured peak lands on the table. */
 {k:'air-open', seat:null, oct:1, max:340, gap:220,
  parts:[{w:'noise',bp:700,bp1:1500,q:0.9,lp:1900,at:0,a:120,r:180,pk:2.60}]},
 {k:'air-close', seat:null, oct:1, max:300, gap:220,
  parts:[{w:'noise',bp:1500,bp1:650,q:0.9,lp:1700,at:0,a:40,r:200,pk:2.39}]},
 /* PING. A press on the wheel, Frames or Dial. A node struck softly: the
    seat's own tone with the second mode of a free bar over it, 2.76, which is
    what makes it read as a thing and not a beep, and a 260 ms fall. */
 {k:'ping', seat:null, oct:1, max:300, gap:80,
  parts:[{w:'sine',fr:1,p2:2.76,g2:0.07,at:0,a:8,r:260,pk:1,lp:2800}]},
 /* HOVER. The faintest sound in the family: the brow's number an octave up,
    a 4 ms attack and a 22 ms fall, 26 milliseconds in all. */
 {k:'hover', seat:'3rd Eye', oct:2, max:60, gap:ATM_HOVER_GAP,
  parts:[{w:'sine',fr:1,p2:0,g2:0,at:0,a:4,r:22,pk:0.87,lp:3000}]}];
var ATM_BY={}; ATM.forEach(function(x){ATM_BY[x.k]=x;});
/* THE PITCH OF A LAYER. Where a layer's circle names a seat, or a kind that
   sits at one, this is the seat. One concept keeps one pitch on every
   surface: the Field's saboteurs, the Body's and the Compass's are one
   number. The chain climbs a seat per tier, the way the rail's stack does.
   The Compass's seat shells are not here: each rings the seat it is, read
   off BANDS, so a seat is never a table of its own. */
var ATM_SEAT={
 fb:{addresses:'Root', seats:'Sacral', laws:'Crown', gates:'Heart', shadow:'Root', stories:'Throat',
  saboteurs:'Solar', complexes:'Heart', hyper:'3rd Eye', character:'Crown', archetypes:'Throat', domains:'3rd Eye'},
 bm:{addr:'Root', masks:'Throat', pain:'Root', flow:'Sacral', sab:'Solar', cx:'Heart', hy:'3rd Eye'},
 cn:{top:'Crown', shells:'Heart', flat:'Sacral', reg:'Throat', well:'Root', heat:'Solar', layers:'3rd Eye'}};
/* THE MAP. First row a control matches wins. sel is what it matches, snd is
   the row of ATM it sounds (overlay and air choose their direction from the
   control's own state after the press), hover says whether a pointer resting
   on it ticks, attr and by say where an overlay reads its pitch. A row with no
   sel is a hook: it names the function that calls it. */
var ATM_MAP=[
 {kind:'Field layer circle', sel:'[data-fb][aria-pressed]', snd:'overlay', attr:'data-fb', by:'fb', hover:true},
 {kind:'Body layer circle', sel:'[data-bmov][aria-pressed]', snd:'overlay', attr:'data-bmov', by:'bm', hover:true},
 {kind:'Compass overlay circle', sel:'[data-cn][aria-pressed]', snd:'overlay', attr:'data-cn', by:'cn', hover:true},
 {kind:'Compass seat shell', sel:'[data-cnseat]', snd:'overlay', attr:'data-cnseat', by:'cs', hover:true},
 {kind:'Column, bar or menu fold', sel:'#lfold,#rfold,#navtog,#lightbtn,.fb-tog,[data-fb=fold],[data-fb=depth],[data-bmmk=tog],[data-bmsh=tog],[aria-haspopup]',
  snd:'air', hover:true},
 {kind:'Section header', sel:'.lsec-hd', snd:'click-light', hover:true},
 {kind:'Primary, destructive or upgrade button', sel:'.btn.pri,.btn.dgr,.st-go,.lk-go', snd:'click-heavy', hover:true},
 {kind:'Tab', sel:'[role=tab],.tabtop', snd:'click', hover:true},
 {kind:'Switch, checkbox or radio', sel:'[role=switch],[role=menuitemcheckbox],[role=radio],[role=menuitemradio],input[type=checkbox],input[type=radio]',
  snd:'click', hover:true},
 {kind:'Chip, pill or pressed toggle', sel:'[aria-pressed],.st-rb,.cn-sb,.kb-swb,.rv-sp,.rv-tag2,.rv-wkd', snd:'click-light', hover:true},
 {kind:'List row', sel:'.kb-row,.stk-r', snd:'click-light', hover:true},
 {kind:'Button, link or menu item', sel:'button,[role=button],[role=menuitem],a[href],summary', snd:'click', hover:true},
 {kind:'A press on the Field wheel, Frames or Dial', hook:'atmPing, from hitPress in ui/ui.js', snd:'ping'},
 {kind:'A sheet opening or closing', hook:'atmWatch, a MutationObserver on #sheet', snd:'air'},
 {kind:'A zoom on the Field', hook:'atmZoom, from setZoom and fzAt', snd:'ambience'},
 {kind:'A pointer resting on a control above', hook:'atmOnOver', snd:'hover'}];
var ATM_ANY=ATM_MAP.filter(function(m){return m.sel;}).map(function(m){return m.sel;}).join(',');
/* the pitch a seat name sounds at, off the one table the release reads */
function atmHz(seat){
 var h=null; try{ h=seatHz(seat); }catch(e){}
 return h||639;}
function atmLin(db){ return Math.pow(10,db/20); }
/* A ROW BUILT FOR ONE SOUNDING. The only code that turns a row of ATM into
   parts, so what the gate renders is what plays. o.seat names the pitch where
   the row's own seat is null, o.liftDb adds to its level. A sine's weight is
   divided by one plus its partial, so the table's decibels are the peak of the
   whole voice and not of its body. */
function atmRow(k,o){
 o=o||{};
 var x=ATM_BY[k]; if(!x)return null;
 var hz=atmHz(o.seat||x.seat||ATM_NOSEAT)*(x.oct||1), db=ATM_DB[k]+(o.liftDb||0), amp=atmLin(db)*ATM_MASTER;
 return {k:k, max:x.max, gap:x.gap, hz:hz, db:db,
  parts:x.parts.map(function(p){
   var q={}, n; for(n in p)q[n]=p[n];
   if(p.w==='sine'){
    q.f=hz*(p.fr||1); if(p.fr1)q.f1=hz*p.fr1;
    if(!p.p2)delete q.p2;
    q.pk=amp*(p.pk||1)/(1+(p.p2?(p.g2||0.1):0));}
   else q.pk=amp*p.pk;
   return q;})};}
/* what is sounding, for the gate */
var ATM_LAST={}, ATM_RECENT=[], ATM_HOV=[], ATM_AT=0, ATM_PLAYED=0, ATM_PEND=null, ATM_WIRED=false;
var ATM_ROW=null, ATM_PT={x:-99,y:-99}, ATM_HOVERED=null, ATM_OBS=null, ATM_AMB=null, ATM_AMB_T=null;
/* PLAY ONE ROW, behind the same silence as everything and the burst limiter on
   top. soft is the hover's: its own limiter, never counted against a click. */
function atmPlay(k,o,soft){
 var x=ATM_BY[k]; if(!x||sfxWhy())return false;
 var now=Date.now();
 if(now-(ATM_LAST[k]||-1e9)<x.gap)return false;
 /* a fitting is the event and this is its surroundings: nothing here lands
    within a breath of one */
 if(now-SFX_AT<150)return false;
 if(soft){
  ATM_HOV=ATM_HOV.filter(function(t){return now-t<1000;});
  if(ATM_HOV.length>=ATM_HOVER_PER_S||now-ATM_AT<ATM_HOVER_QUIET)return false;
 }else{
  ATM_RECENT=ATM_RECENT.filter(function(t){return now-t<1000;});
  if(ATM_RECENT.length>=ATM_BURST)return false;
  if(ATM_RECENT.length&&now-ATM_RECENT[ATM_RECENT.length-1]<ATM_SPACE)return false;}
 var ac=sfxCtx(); if(!ac)return false;
 try{
  var row=atmRow(k,o), end=sfxRender(ac,ac.destination,row,ac.currentTime+0.005);
  ATM_LAST[k]=now; ATM_AT=now; ATM_PLAYED++; ATM_ROW={k:k,hz:row.hz,db:row.db};
  if(soft)ATM_HOV.push(now); else{ ATM_RECENT.push(now); if(ATM_PEND)ATM_PEND.drop=true; }
  sfxNapLater(Math.max(0,(end-ac.currentTime))*1000+20000);
  return k;
 }catch(e){ return false; }}

/* WHAT A PRESS LANDED ON, and which row of the map it belongs to. The nearest
   control up the tree, so a press on an icon inside a circle is a press on the
   circle. A control that is disabled, or locked, which the product marks with
   aria-disabled, is not a press and sounds nothing. */
function atmTarget(t){
 var el=(t&&t.closest)?t.closest(ATM_ANY):null;
 if(!el||el.disabled||el.getAttribute('aria-disabled')==='true')return null;
 for(var i=0;i<ATM_MAP.length;i++){
  var m=ATM_MAP[i]; if(m.sel&&el.matches(m.sel))return {el:el,row:m};}
 return null;}
/* the seat an overlay sounds, by the surface it is on */
function atmSeatFor(hit){
 var v=hit.el.getAttribute(hit.row.attr), by=hit.row.by;
 if(by==='cs'){ try{ return BANDS[+v]||ATM_NOSEAT; }catch(e){ return ATM_NOSEAT; } }
 return (ATM_SEAT[by]&&ATM_SEAT[by][v])||ATM_NOSEAT;}
/* the state attribute a directional sound reads, before the press and after */
function atmStateOf(hit,el){ return el.getAttribute(hit.row.snd==='air'?'aria-expanded':'aria-pressed'); }
/* THE CLICK LISTENER. Capture phase, so it runs ahead of the press's own
   handler and reads the state the control was in. It schedules, and only when
   a sound could be heard: a silent product schedules nothing at all. The
   sound itself is chosen one turn later, after the handler, which is what
   lets an overlay say whether it went on or off and lets a press that earned
   a fitting, a ping or a swell give up its click. */
function atmOnClick(e){
 if(sfxWhy())return;
 var hit=atmTarget(e.target); if(!hit)return;
 var p={drop:false}, was=atmStateOf(hit,hit.el), by=hit.row.attr?hit.el.getAttribute(hit.row.attr):null;
 ATM_PEND=p;
 /* the context is opened here, inside the press, where every browser allows it */
 sfxCtx();
 setTimeout(function(){
  if(ATM_PEND===p)ATM_PEND=null;
  if(p.drop)return;
  var s=hit.row.snd, el=hit.el;
  if(s==='overlay'||s==='air'){
   /* the circle may have been drawn again, so read the one that is there */
   if(!el.isConnected&&hit.row.attr&&by!=null)
    el=document.querySelector('['+hit.row.attr+'="'+by+'"]')||el;
   var now=atmStateOf(hit,el);
   if(now==null||now===was)return;
   var on=now==='true';
   if(s==='overlay')atmPlay(on?'overlay-on':'overlay-off',{seat:atmSeatFor({el:el,row:hit.row})});
   else atmPlay(on?'air-open':'air-close');
   return;}
  atmPlay(s);},0);}
/* THE HOVER LISTENER. A tick for a pointer arriving at a control, mouse and
   pen only, and only if the pointer actually travelled: Chrome says a pointer
   arrived at whatever a layout put under it, with the same coordinates, and
   that is not an arrival. pointermove keeps the last position; pointerover
   compares against it. */
function atmOnMove(e){ ATM_PT.x=e.clientX; ATM_PT.y=e.clientY; }
function atmOnOver(e){
 var pt=e.pointerType;
 if(pt!=='mouse'&&pt!=='pen')return;
 var x=e.clientX, y=e.clientY, moved=Math.abs(x-ATM_PT.x)+Math.abs(y-ATM_PT.y)>=1;
 ATM_PT.x=x; ATM_PT.y=y;
 if(!moved||e.buttons||sfxWhy())return;
 var hit=atmTarget(e.target); if(!hit||!hit.row.hover)return;
 /* from one part of a control to another is not arriving */
 if(e.relatedTarget&&hit.el.contains(e.relatedTarget))return;
 var now=Date.now();
 if(ATM_HOVERED&&ATM_HOVERED.has(hit.el)&&now-ATM_HOVERED.get(hit.el)<ATM_HOVER_EACH)return;
 if(atmPlay('hover',null,true)&&ATM_HOVERED)ATM_HOVERED.set(hit.el,now);}
/* A SHEET. It has no control of its own to read, so its hidden attribute is
   watched, and one swell is played each way. Armed on the first press and
   again if the sheet was not yet in the document. */
function atmWatch(){
 if(ATM_OBS||typeof MutationObserver==='undefined')return;
 var s=document.getElementById('sheet'); if(!s)return;
 try{
  ATM_OBS=new MutationObserver(function(list){
   for(var i=0;i<list.length;i++){ var r=list[i];
    if(r.attributeName!=='hidden')continue;
    var open=!s.hidden, was=r.oldValue===null;
    if(open===was)continue;
    atmPlay(open?'air-open':'air-close');}});
  ATM_OBS.observe(s,{attributes:true,attributeOldValue:true,attributeFilter:['hidden']});
 }catch(e){ ATM_OBS=null; }}
/* A PRESS ON THE FIELD, for the wheel, Frames and Dial alike. hitPress and the
   wheel's two other press paths call this with what was hit, and the pitch
   is the seat of it: an address, a seat and an atom carry one, a law and an
   archetype are set at one, and a gate, a pole, a domain or the core are
   nowhere in the body and ring the middle of the seven. It comes up by ATM_LIFT_DB
   across the zoom, the field sounding a little louder the closer it is. */
function atmSeatOf(h){
 try{
  if(!h)return ATM_NOSEAT;
  if(h.n&&h.n.b)return h.n.b;
  if(h.k==='seat'&&h.b)return h.b;
  if(h.k==='law'&&SI[h.j])return SI[h.j].b;
  if(h.k==='arch'&&ARCH[h.j])return ARCH[h.j].b;
 }catch(e){}
 return ATM_NOSEAT;}
function atmZoomL(s,max){ return (s>1.0005&&max>1)?Math.min(1,Math.log(s)/Math.log(max)):0; }
function atmPing(h){
 if(sfxWhy())return false;
 var z=0; try{ var f=fieldZoom(); z=atmZoomL(f.s,f.max); }catch(e){}
 return atmPlay('ping',{seat:atmSeatOf(h),liftDb:ATM_LIFT_DB*z});}

/* THE ROOM UNDER A ZOOM. A low bed that comes up as the field comes closer,
   and goes as it goes. Two sines at the sacral and the heart and a breath of
   noise, through one lowpass that opens with the zoom, so it is both a little
   louder and a little brighter the closer you are. At 1x its target is zero.

   Nothing is created until there is a zoom to sound, one chain is kept while
   a person is zooming, and it is stopped ATM_AMB_END after the last input. The
   level is smoothed by the audio clock and never by a timer, so a wheel that
   sends sixty events a second moves it as gently as a wheel that sends five.
   The one timer only takes the nodes down once the gain has already been
   scheduled to zero. */
function atmAmbTarget(L){
 if(!(L>0))return {gain:0, lp:ATM_AMB_LP0};
 return {gain:atmLin(ATM_DB.ambience)*ATM_MASTER*Math.pow(Math.min(1,L),0.75),
  lp:ATM_AMB_LP0*Math.pow(ATM_AMB_LP1/ATM_AMB_LP0,Math.min(1,L))};}
/* two seconds of seeded noise whose seam is cross faded, so it loops without a
   click. The tail that would have followed the end is blended into the start. */
function atmAmbNoise(ac){
 if(ac.__atmN)return ac.__atmN;
 var sr=ac.sampleRate, n=Math.round(sr*2), x=Math.round(sr*0.2), raw=new Float32Array(n+x), s=0x2545F491, i;
 for(i=0;i<n+x;i++){ s=(Math.imul(s,1664525)+1013904223)>>>0; raw[i]=s/2147483648-1; }
 var b=ac.createBuffer(1,n,sr), d=b.getChannelData(0);
 for(i=0;i<n;i++)d[i]=raw[i];
 for(i=0;i<x;i++){ var w=i/x; d[i]=raw[i]*Math.sin(w*Math.PI/2)+raw[n+i]*Math.cos(w*Math.PI/2); }
 ac.__atmN=b; return b;}
function atmAmbBuild(ac,out){
 var t=ac.currentTime, g=ac.createGain(), lp=ac.createBiquadFilter(), src=[];
 g.gain.setValueAtTime(0,t);
 lp.type='lowpass'; lp.Q.value=0.5; lp.frequency.setValueAtTime(ATM_AMB_LP0,t);
 [['Sacral',0.42],['Heart',0.23]].forEach(function(v){
  var o=ac.createOscillator(), vg=ac.createGain();
  o.type='sine'; o.frequency.setValueAtTime(atmHz(v[0]),t); vg.gain.value=v[1];
  o.connect(vg); vg.connect(lp); o.start(t); src.push(o);});
 var nb=ac.createBufferSource(), nf=ac.createBiquadFilter(), ng=ac.createGain();
 nb.buffer=atmAmbNoise(ac); nb.loop=true;
 nf.type='bandpass'; nf.frequency.value=900; nf.Q.value=0.6; ng.gain.value=0.69;
 nb.connect(nf); nf.connect(ng); ng.connect(lp); nb.start(t); src.push(nb);
 lp.connect(g); g.connect(out);
 return {ac:ac, g:g, lp:lp, src:src, L:0, gain:0, fresh:true};}
/* a zoom input at level L, at time t. Every input reschedules the whole of the
   room's future from where it stands, so the last input is what the fall and
   the end are measured from. */
function atmAmbTo(h,L,t){
 var T=atmAmbTarget(L), g=h.g.gain, f=h.lp.frequency;
 g.cancelScheduledValues(t);
 f.cancelScheduledValues(t);
 /* the first input arrives at the instant the chain was built, and the cancel
    above takes the chain's own first values with it. A target is approached from
    wherever the parameter stands, which with nothing left scheduled is its
    default of one, full scale, so the first cut opened every zoom with a
    burst. Found by rendering it offline: the peak of the whole render read
    minus 3 dBFS where the steady level was minus 40. */
 if(h.fresh){ h.fresh=false; g.setValueAtTime(0,t); f.setValueAtTime(ATM_AMB_LP0,t); }
 g.setTargetAtTime(T.gain,t,ATM_AMB_TC);
 g.setTargetAtTime(0,t+ATM_AMB_HOLD,ATM_AMB_FALL);
 g.setValueAtTime(0,t+ATM_AMB_END);
 f.setTargetAtTime(T.lp,t,0.2);
 h.L=L; h.gain=T.gain;}
function atmAmbEnd(){
 var h=ATM_AMB; ATM_AMB=null; clearTimeout(ATM_AMB_T);
 if(!h)return;
 try{ h.src.forEach(function(s){ try{ s.stop(); }catch(e){} }); h.g.disconnect(); }catch(e){}}
/* hushed at once, for a person who switched sound off or entered a release
   in the middle of a zoom */
function atmAmbKill(){
 var h=ATM_AMB; if(!h)return;
 try{ var t=h.ac.currentTime; h.g.gain.cancelScheduledValues(t); h.g.gain.setTargetAtTime(0,t,0.03); }catch(e){}
 clearTimeout(ATM_AMB_T); ATM_AMB_T=setTimeout(atmAmbEnd,300);}
/* A ZOOM HAPPENED. s is the zoom and max is its ceiling, from setZoom and from
   fzAt, the Field's two zooms; the reset to 1x is a zoom to 1 and lowers the
   room to nothing. Called for every change, silent or not, and says nothing
   when the layer is silent. */
function atmZoom(s,max){
 var L=atmZoomL(s,max);
 if(sfxWhy()){ if(ATM_AMB)atmAmbKill(); return false; }
 if(!ATM_AMB&&!(L>0))return false;
 var ac=sfxCtx(); if(!ac)return false;
 try{
  if(!ATM_AMB)ATM_AMB=atmAmbBuild(ac,ac.destination);
  atmAmbTo(ATM_AMB,L,ac.currentTime);
  clearTimeout(ATM_AMB_T); ATM_AMB_T=setTimeout(atmAmbEnd,(ATM_AMB_END+0.15)*1000);
  sfxNapLater((ATM_AMB_END+20)*1000);
  return true;
 }catch(e){ return false; }}
/* what is sounding, for the gate */
function atmState(){
 return {why:sfxWhy(), played:ATM_PLAYED, last:ATM_LAST, wired:ATM_WIRED, row:ATM_ROW,
  amb:ATM_AMB?{L:ATM_AMB.L, gain:ATM_AMB.gain, now:ATM_AMB.g.gain.value, lp:ATM_AMB.lp.frequency.value}:null};}
function atmWire(){
 if(ATM_WIRED)return;
 try{
  ATM_HOVERED=(typeof WeakMap==='function')?new WeakMap():null;
  addEventListener('click',atmOnClick,true);
  addEventListener('pointerover',atmOnOver,true);
  addEventListener('pointermove',atmOnMove,{capture:true,passive:true});
  ATM_WIRED=true;
 }catch(e){}
 atmWatch();}
atmWire();

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
