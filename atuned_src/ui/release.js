/* ============================================================
   RELEASE. The protocol as the book writes it, heard.

   "The dose pattern: 50 release statements on the left channel,
   50 on the right, transition through release, 50 embodied truth
   on the left, 50 on the right." (index.html 2401, and again at
   2703.) "Reading it, aloud or silently, produces somatic release
   at the anatomical address the sequence specifies." (2701.)

   So a run is a script and not a ticker. An opening, then per
   address four blocks, left release, right release, left reframe,
   right reframe, each block its head statement once and then its
   passes, then a cooldown. DESIGN-release.md sections 6 and 7 are
   the specification and this is their port.

   WHAT IS PRICED AND WHAT IS FREE. Open question 2 of that
   document, answered with its own recommendation under the time
   pressure of round ID and named as a default he can reverse: a
   pattern is a unique line of new ground and is what the meter
   charges, a pass is one spoken repetition and costs nothing. The
   blocks are meterPlan's keys exactly, and relCoolDown commits
   exactly those keys through meterRun, so what a person pays is
   what the engine priced and not a count typed here. The dose is
   the engine's own LINES_PER_CH, which is fifty.

   coolDown takes 21 percent of weight plus 2, clears at 6 or below,
   and installs the coherent opposite at 62 percent of what it removed.
   ============================================================ */
/* LEFT FIRST. Open question 4, answered for the book: "50 release statements
   on the left channel, 50 on the right." This read right first, with the
   comment "Right then left, limit before truth", and the prototype followed
   the code. He is measuring against the book and the original app this round,
   so the book wins and the change is named in the commit. Only the order
   moves: the keys are side and phase ("Llimit"), so no key already on a
   record changes meaning. */
var CHAN=[['L','Left','limit'],['R','Right','limit'],['L','Left','truth'],['R','Right','truth']];
/* the book's own words for the two sides, at 1042 */
var REL_SIDE={L:'Left, inward',R:'Right, outward'};
/* WHICH NERVOUS SYSTEM A SIDE IS, AND WHICH POLE. Asked 27 September, his
   words: "the release protocol is a list of the parasympathetic and
   sympathetic nerves, left and right channels, masculine and feminine." The
   engine already carried all of it and the card said none of it. C3_POLE in
   engine/data/cards.js is his printed cards' own split, feminine, left and
   parasympathetic as one thing and masculine, right and sympathetic as the
   other, and relLine already picks the side of the card by it. The card said
   "Left, inward" and stopped, so the pole a line was addressing was known to
   the engine and to nobody reading. Read off C3_POLE by the side letter, so
   there is one table and this is not a second one. */
function relPole(side){
 var k=side==='L'?'f':'m';
 return (typeof C3_POLE!=='undefined'&&C3_POLE.filter(function(p){return p.k===k;})[0])||null;}
/* ============================================================
   THE SCRIPT. DESIGN-release.md section 6, line for line.

   TWO VOICES, AND THE SEAM BETWEEN THEM IS HIS. Ruled 27 September:
   "The setup for the user should be to introduce, welcome the
   person to the journey ... That's my voice, it's human. After that,
   it's AI. And AI is reading the list."

   This file had one opening, spoken by the synthetic voice in place
   of his recording. So the one part of the run he said is a person
   was the part a synthesiser said, and the stand in said it every
   time. It is two phases now.

   THE WELCOME is his recorded voice and nothing else. The recording
   is not in this build (DESIGN-release.md section 2, the audio
   ruling, is still his), so the welcome is read on the screen in
   silence and the card says so in plain words. The synthetic voice never says a
   word of it, voice switch on or off, because a stand in for a
   person is the thing he just ruled out. When the recording lands it
   plays in this phase, and the lines below stay as what the screen
   shows under it.

   His spoken script, "sit back and relax ... take a deep breath and
   feel, keep your senses in there, and when you're ready, repeat
   this prompt in your mind", is his to say in his own recording and
   is not typed here. The house voice rules "sit back" and "relax"
   out of written copy by name (atuned-voice V2, an outcome given as
   an instruction), which is correct for text and does not reach a
   recording of him. What the screen shows is the same four moves in
   written form: a position a body can take, attention moved inside,
   one breath, attention held there. The first line names what is
   being released, which is his "you're releasing this pattern", and
   it is built from the queue in relWelcome.

   THE OPENING is the synthetic voice's first line, the hand over. It
   is one line and it is the product's, so the first thing the voice
   ever says is the instruction to repeat what follows, and the next
   thing it says is the first statement on the six channels, "I am
   letting go of believing, perceiving, thinking, behaving, acting,
   and feeling", which is the prompt he described. With the welcome
   silent, a person with their eyes shut hears this line as the list
   starting, which is what a seam should sound like.
   ============================================================ */
var REL_WELCOME=['Sit down. Put both feet on the floor.',
 'Move your awareness inside your body.',
 'Take one deep breath. Feel what your body is doing mechanically.',
 'Keep your awareness inside your body.'];
var OPENING=['Each line names one pattern. Repeat it in thought as it lands.'];
/* the book's end state, 2705, and its one sensation line that names a place,
   2355 to 2358. The fourth is his, 27 September: "keep your awareness inside
   your body ... wait for two minutes", and it hands over to the clock that
   counts those two minutes, REL_SETTLE_S below. The two say the same length
   and move together. */
var COOLING=['Stop the work. Stay where you are.',
 'The charge moves up the channel and out through the mouth.',
 'Notice which place answers.',
 'Keep your awareness inside your body for two minutes.'];
var REL_SETTLE_S=120;
/* THE DOSE, AS HE NAMES IT. "Do you want to release 25 left and right, 50 left
   and right, or 100 left and right." Three quick picks beside the number
   field, which stays: the field is what round IG ruled ("how many patterns"),
   the picks are what he reaches for, and both set the same RUN.dose. 50 is the
   book's and LINES_PER_CH's and is still the default. 100 runs past the fifty
   lines a printed card carries a side, which is safe because a pass past the
   head is a spoken repetition and the meter never sees it: the plan, and so
   the price, is the same at 25 as at 100. The numbers are his words and are
   typed as his words. */
var REL_DOSES=[25,50,100];
/* the welcome's first line, which is his "you're releasing this pattern", read
   off the queue. Three names and then a count, because eight names read out
   as one sentence is a list and not a welcome. */
function relWelcome(){
 var nm=(RUN.queue||[]).map(function(n){return String(n.k||'').toLowerCase();})
  .filter(function(x,i,a){return x&&a.indexOf(x)===i;});
 if(!nm.length)return REL_WELCOME;
 var said=nm.length<=3
  ?(nm.length>1?nm.slice(0,-1).join(', ')+' and ':'')+nm[nm.length-1]
  :nm.slice(0,3).join(', ')+' and '+(nm.length-3)+' more';
 return ['You are releasing '+said+'.'].concat(REL_WELCOME);}
/* THE PASSES. "Let go. Give up. Forgive myself. Forgive others. Same
   mechanic. Different entry points." (2315.) They rotate because the book
   says the entry that is hardest to say is the diagnostic. */
var REL_ENTRY=['I let go of ','I give up ','I forgive myself for '];

/* what the allowance says is left, read the same way Settings reads it.
   The arithmetic moved into the engine as meterBudget, because this function
   quoted the number and nothing enforced it: the panel said "16 patterns of
   the 0 you have left" and ran all sixteen. One read, one cap, one place. */
function relLeft(){
 if(typeof meterBudget!=='function')return 0;
 return meterBudget((typeof CURP!=='undefined'&&CURP)||null).left;}
/* what a run may cost from here: the smaller of the run ceiling and what the
   person actually has. relPlan builds to this, so the number the panel prints
   is the number the run spends. */
function relBudget(){
 if(typeof meterBudget!=='function')return 0;
 return meterBudget((typeof CURP!=='undefined'&&CURP)||null).cap;}
/* speed is the seconds a line took on the old ticker. It is kept because the
   story panel still offers Slow, Steady and Quick through it, and it now sets
   the pace a run opens at, so that choice still means something. */
var RUN={open:false,queue:[],plan:[],sec:0,idx:0,phase:'idle',speed:2.2,timer:null,
         paused:false,done:false,line:0,log:[],freed:0,
         pass:0,cool:0,tok:0,halted:false,
         dose:LINES_PER_CH,pace:1,spokeMs:0,spokeW:0,
         t0:0,tEnd:0,pauseAt:0,pausedMs:0,tick:null,
         tally:null,hits:null,settleAt:0,settled:false};
/* THE RUN IS A PLAN OF THOUGHT LINES, ruled. One pattern is one thought line
   and the line targets the address by way of the channel, so a run is a list
   of address, channel and line, capped at RUN_MAX. It is built when the run is
   picked rather than when it ends, because a person is entitled to see what a
   run costs before they begin it. */
function relPlan(){
 var ids=RUN.queue.map(function(n){return n.i;});
 var chans=CHAN.map(function(c){return c[0]+c[2];});
 /* capped at what is left and not only at RUN_MAX, so the plan a person is
    shown is a plan they can pay for. Nought is returned here rather than
    passed down, because meterPlan reads a cap of nought as "no cap given" and
    falls back to twenty five, which is the ceiling it was asked to remove. */
 var cap=relBudget();
 return (CURP&&cap>0)?meterPlan(CURP,ids,chans,cap):[];}
/* one entry of the plan, read back into the address and channel it names */
function relAt(i){
 var k=(RUN.plan||[])[i]; if(!k)return null;
 var bits=String(k).split(':');
 var n=BY[+bits[0]];
 var ch=CHAN.filter(function(c){return (c[0]+c[2])===bits[1];})[0]||CHAN[0];
 return {n:n, ch:ch, line:+bits[2]||0, key:k};}
/* WHERE THE RUN IS, for the card and for anything that has to agree with it.
   One answer, because the seat tone reads it too, and two copies of the
   fallback would be two places for the sound and the card to disagree. The
   opening is spoken ahead of the first address, so it answers with that one. */
function relNow(){
 return relAt(RUN.phase==='run'?RUN.idx:0)||{n:RUN.queue[0],ch:CHAN[0],line:0};}
function relOpp(n){
 return (n&&(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp)||'';}
function relPick(nodeIds){
 relHush();
 RUN.queue=nodeIds.map(function(i){return BY[i];}).filter(function(n){return n&&n.cf;});
 RUN.sec=0;RUN.idx=0;RUN.line=0;RUN.pass=0;RUN.cool=0;RUN.halted=false;
 RUN.phase='idle';RUN.done=false;RUN.log=[];RUN.freed=0;RUN.paused=false;
 RUN.proj=null;RUN.dq0=null;
 relTicker(false);
 RUN.t0=0;RUN.tEnd=0;RUN.pauseAt=0;RUN.pausedMs=0;
 RUN.tally=null;RUN.hits=null;RUN.settleAt=0;RUN.settled=false;
 RUN.pace=Math.max(0.5,Math.min(2,Math.round(22/(RUN.speed||2.2))/10));
 RUN.plan=relPlan();
 RUN.open=true; relRender();}

/* ============================================================
   ONE STEP OF THE SCRIPT, read off where the run is. Nothing is
   built ahead: a full run at three addresses is six hundred lines,
   and every one of them is a function of the plan key and the pass.
   ============================================================ */
/* the head statement, which is relLine's sentence for this key, the printed
   card first, and on the release side it opens on his six channels. */
function relHead(at){
 var L=(typeof relLine==='function')?relLine(at.n,at.ch[0]+at.ch[2],at.line):null;
 var truth=at.ch[2]==='truth';
 if(!L)return {text:truth?(relOpp(at.n)||at.n.k)+'.':C3_STEM+String(at.n.k).toLowerCase()+'.',truth:truth};
 return {text:L.text,truth:truth,src:L.src};}
/* A PASS. On the release side the entries rotate over the pattern's name. On
   the reframe side it is the coherent state on its own, which is open
   question 3 answered with the document's own fallback: the engine carries
   his written install for the head of each block, and no table of embodied
   truths to rotate the passes through. The panel says so in one line. */
function relShort(at,i,head){
 if(at.ch[2]==='limit')
  return REL_ENTRY[(i-1)%REL_ENTRY.length]+String(at.n.k||'').toLowerCase()+'.';
 var o=relOpp(at.n); return o?o+'.':head;}
function relStepAt(at,pass){
 if(!at||!at.n)return null;
 var h=relHead(at);
 return pass>0?{kind:'pass',text:relShort(at,pass,h.text),truth:h.truth,at:at}
  :{kind:'head',text:h.text,truth:h.truth,at:at,src:h.src};}
function relCur(){
 if(RUN.phase==='welcome'){var w=relWelcome();
  return {kind:'welcome',text:w[Math.min(RUN.line,w.length-1)]};}
 if(RUN.phase==='opening')
  return {kind:'open',text:OPENING[Math.min(RUN.line,OPENING.length-1)]};
 if(RUN.phase==='run')return relStepAt(relAt(RUN.idx),RUN.pass);
 if(RUN.phase==='done'&&RUN.open)
  return {kind:'cool',text:COOLING[Math.min(RUN.cool,COOLING.length-1)]};
 return null;}

/* ============================================================
   THE CLOCK DOES NOT LIE. Speech synthesis will not say in advance
   how long it needs, so a line is first estimated at 0.40 seconds a
   word, about 150 a minute, an unhurried instructional rate. Once
   the voice has actually spoken twenty words the estimate is the
   measured rate of this voice on this machine. Within a minute of
   starting, the number a person reads is a measurement.
   ============================================================ */
var REL_WORD_S=0.40, REL_GAP_S=0.30, REL_HEAD_S=0.6, REL_FRAME_S=1.2;
/* FOUR SECONDS BETWEEN STATEMENTS. His words, 27 September: "The list timing
   is based off of the timing spacing. The default should be four seconds
   between." The walker had no spacing at all. A line lasted as long as it
   took to say, so with the voice off a pass, "I let go of fear.", held the
   screen for 2.3 seconds, and with the voice on the next line started the
   moment the last one ended. Measured off relSec at pace 1: every pass of the
   release half ran between 2.3 and 2.7 seconds.

   So a statement of the list now holds for at least the spacing, start to
   start, voice on or off, and one that takes longer to say than the spacing
   runs its own length. The head statement, twenty words on the six channels,
   is always the second case and is never cut. The frame, the welcome, the
   opening and the cooldown, is not the list and keeps its own reading time.
   Pace divides it, so pace 1 is four seconds and 2 is two, and the pace field
   keeps meaning what round IG ruled it means.

   It is stated in words at the reading rate, ten words at REL_WORD_S, which
   is four seconds, so the clock has one unit and everything that retimes the
   reading rate retimes the spacing with it. That includes tests/design.js,
   which runs the whole walker at the full dose by shrinking these constants,
   and would otherwise sit through two hundred four second lines. */
var REL_SPACE_W=10;
function relSpace(){return REL_SPACE_W*REL_WORD_S/Math.max(0.5,RUN.pace);}
function relWords(t){return String(t||'').trim().split(/\s+/).length;}
function relSec(st){
 if(!st)return 0;
 var per=RUN.spokeW>=20?RUN.spokeMs/RUN.spokeW/1000:REL_WORD_S/Math.max(0.5,RUN.pace);
 var s=relWords(st.text)*per+REL_GAP_S;
 if(st.kind==='head')s+=REL_HEAD_S;
 if(st.kind==='welcome'||st.kind==='open'||st.kind==='cool')s+=REL_FRAME_S;
 return s;}
/* how long a step holds the card: its reading time, and on the list never
   less than the spacing */
function relList(st){return !!st&&(st.kind==='head'||st.kind==='pass');}
function relStepSec(st){var s=relSec(st); return relList(st)?Math.max(s,relSpace()):s;}
/* seconds of script from a point to the end, cooldown included. from is
   {phase,line,idx,pass}; with no from it is the whole run. */
function relSecFrom(from){
 var f=from||{phase:'welcome',line:0,idx:0,pass:0}, s=0, i;
 if(f.phase==='welcome'){var w=relWelcome();
  for(i=f.line;i<w.length;i++)s+=relSec({kind:'welcome',text:w[i]});}
 if(f.phase==='welcome'||f.phase==='opening')
  for(i=(f.phase==='opening'?f.line:0);i<OPENING.length;i++)s+=relSec({kind:'open',text:OPENING[i]});
 if(f.phase==='welcome'||f.phase==='opening'||f.phase==='run'){
  var i0=f.phase==='run'?f.idx:0, p0=f.phase==='run'?f.pass:0;
  for(i=i0;i<(RUN.plan||[]).length;i++){
   var at=relAt(i); if(!at||!at.n)continue;
   var h=relHead(at);
   for(var p=(i===i0?p0:0);p<RUN.dose;p++)
    s+=relStepSec(p?{kind:'pass',text:relShort(at,p,h.text)}:{kind:'head',text:h.text});}}
 var c0=f.phase==='done'?f.cool:0;
 for(i=c0;i<COOLING.length;i++)s+=relSec({kind:'cool',text:COOLING[i]});
 return s;}
function relMMSS(sec){
 var s=Math.max(0,Math.round(sec));
 return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}

/* ============================================================
   THE WALKER. One step is one line, and it lasts as long as the
   voice takes to say it. With the voice off it lasts as long as the
   clock above says the line takes to read. It replaced a fixed
   2.2 second interval, which read a protocol built to be heard.

   A step is a token, so a late callback from a line already left
   behind (an utterance cancelled by Pause, a timer from before End)
   can never move the run. A voice that reports the end of a line in
   less than a quarter of its estimate did not say it: the rest of
   the estimate is waited out, so a browser with no real voice runs
   at reading pace instead of racing to the cooldown.
   ============================================================ */
function relVoiceOn(){
 if(typeof voiceCan!=='function'||!voiceCan())return false;
 return !(typeof CURP!=='undefined'&&CURP&&CURP.ui&&CURP.ui.voice===false);}
function relBuzzOn(){
 return !!(typeof CURP!=='undefined'&&CURP&&CURP.ui&&CURP.ui.buzz)&&typeof buzzCan==='function'&&buzzCan();}
function relHush(){
 clearTimeout(RUN.timer); RUN.tok++;
 if(typeof speakStop==='function')speakStop();}
/* THE MARKS, at a boundary and never on a beat. They ride the seat tone's
   switch: it is the one switch for sound that is not words, and a run with it
   off opens no audio channel at all. The vibration doubles the same mark at
   the same length. */
function relMark(kind,side,truth){
 var snd=relToneOn()&&typeof tone==='function';
 if(kind==='turn'){ if(snd)earTurn(side,truth); if(relBuzzOn())buzz([12]); }
 else if(kind==='cross'){ if(snd)earCross(); if(relBuzzOn())buzz([30,60,30]); }
 else if(kind==='close'){ if(snd)earClose(); if(relBuzzOn())buzz([90]); }
 else if(kind==='halt'){ if(snd)earHalt(); if(relBuzzOn())buzz([20,40,20]); }}
function relBoundary(){
 if(RUN.phase!=='run'||RUN.pass!==0)return;
 var at=relAt(RUN.idx), pr=RUN.idx>0?relAt(RUN.idx-1):null; if(!at)return;
 var truth=at.ch[2]==='truth';
 if(pr&&pr.n===at.n&&pr.ch[2]==='limit'&&truth)relMark('cross');
 else relMark('turn',at.ch[0],truth);}
function relStep(){
 clearTimeout(RUN.timer);
 var tok=++RUN.tok;
 if(!RUN.open||RUN.paused)return;
 var st=relCur();
 if(!st){ if(RUN.phase==='run')relCoolDown(); return; }
 relBoundary();
 relRender();
 /* raw is how long the line takes to say, and is what the quarter test below
    judges a voice by. est is how long the card holds it, which on the list is
    never less than the spacing. gap is the spacing alone, waited out after a
    voice that finished early, so a spoken run keeps the same four seconds a
    read one does. Judging the voice against est would have called every short
    pass unspoken and thrown its measurement away. */
 var raw=relSec(st)*1000, est=relStepSec(st)*1000, gap=relList(st)?relSpace()*1000:0, moved=false;
 function next(){
  if(moved||tok!==RUN.tok)return; moved=true; clearTimeout(RUN.timer);
  if(!RUN.paused)relAdvance();}
 /* THE WELCOME IS NEVER SYNTHESISED. It is his recorded voice or it is
    silence, whatever the voice switch says; see THE SCRIPT above. */
 if(st.kind!=='welcome'&&relVoiceOn()&&speak(st.text,RUN.pace,function(ms){
    if(tok!==RUN.tok)return;
    if(ms<raw*0.25){ clearTimeout(RUN.timer); RUN.timer=setTimeout(next,Math.max(0,est-ms)); return; }
    RUN.spokeMs+=ms; RUN.spokeW+=relWords(st.text);
    if(ms<gap){ clearTimeout(RUN.timer); RUN.timer=setTimeout(next,gap-ms); return; }
    next();},
   function(){
    /* the browser refused the line. The run goes on at reading pace. */
    if(tok!==RUN.tok)return;
    clearTimeout(RUN.timer); RUN.timer=setTimeout(next,est);})){
  RUN.timer=setTimeout(next,est+9000);}
 else RUN.timer=setTimeout(next,est);}
function relAdvance(){
 if(RUN.phase==='welcome'){
  RUN.line++;
  if(RUN.line>=relWelcome().length){RUN.phase='opening';RUN.line=0;}
  return relStep();}
 if(RUN.phase==='opening'){
  RUN.line++;
  if(RUN.line>=OPENING.length){RUN.phase='run';RUN.line=0;RUN.idx=0;RUN.pass=0;}
  return relStep();}
 if(RUN.phase==='run'){
  RUN.pass++;
  if(RUN.pass>=RUN.dose){RUN.pass=0;RUN.idx++;}
  if(RUN.idx>=(RUN.plan||[]).length){relCoolDown();return;}
  return relStep();}
 if(RUN.phase==='done'){
  RUN.cool++;
  if(RUN.cool>=COOLING.length){RUN.cool=COOLING.length;relRender();return;}
  return relStep();}}
/* ONE ADDRESS'S SHARE OF THE WRITE, and the only copy of it. It sat inline in
   relCoolDown, and the live shadow row below has to run the same arithmetic
   ahead of the commit. Two copies of it would be two answers to "what does
   this run do", and the row would count down to a number the run then did not
   land on. w0 is passed in because relCoolDown reads every weight before the
   first write moves anything, and the projection has to read them the same
   way. */
function relWrite(q,n,w0){
 var d=-Math.round(w0*0.21+2);
 var w1=Math.max(0,w0+d);
 var share=Math.abs(d)/10/Math.max(1,q.filter(function(x){return x.cf===n.cf;}).length);
 S.charge[n.cf]=clamp((S.charge[n.cf]||0)-share,0,10);
 /* release empties the address, replace fills it. the second half is not optional. */
 S.replace[n.cf]=clamp((S.replace[n.cf]||0)+share*0.62,0,10);
 return {d:d,w1:w1};}
/* put a saved map back in place. The object is kept and its keys are
   restored, because S.charge is read by reference elsewhere and a new object
   would leave those readers holding the projection's numbers. */
function relPut(o,from){
 Object.keys(o).forEach(function(k){if(!(k in from))delete o[k];});
 Object.assign(o,from);}
/* ============================================================
   THE SHADOW, COUNTED DOWN WHILE THE RUN IS SPOKEN. His words, 27
   September: "CQ should raise, DQ should lower, SQ should lower.
   You should see SQ lowering in real time since those are the
   patterns releasing."

   The engine already did all three. What it did not do was show it:
   the write lands once, in relCoolDown, so for the whole of a forty
   minute run DQ sat still and the only number on the card that moved
   was the clock. Measured on the shipped build with the Release
   button's own pick of eight: Diane 19.64 to 14.25, James 26.68 to
   20.16, Gordon 53.85 to 40.56, Sofia 3.15 to 2.49. Whole points, so
   DQ is the figure. CQ moved 0.09 to 0.22 on the same runs, which
   rounds away at the one decimal every surface prints it at, so it is
   not on this row and relCoolDown still reports it through expression.

   So the row is a projection of the commit and says nothing the
   commit will not do. The write is run once, address by address in
   queue order, on the live field, with compute() read after each
   address, and the field is put back before anything draws. The row
   then walks from one address's result to the next as that address's
   lines are spoken. The step inside an address is drawn, never
   computed: the engine has one write per address and no half way
   state, and the line count is how far through it the person is.

   A worked example gets no row. relCoolDown refuses it, so a count
   down there would be a number that never lands.
   ============================================================ */
function relProject(){
 var q=RUN.queue||[], P={queue:RUN.queue,plan:RUN.plan,dq:null};
 RUN.proj=P;
 if(typeof S==='undefined'||S.who!==0||!q.length)return P;
 var c0=Object.assign({},S.charge), r0=Object.assign({},S.replace);
 try{
  var r=compute(), w0=q.map(function(n){return n.sq*10;});
  var dq=[r.DQ], sq=[q.map(function(n){return n.sq;})];
  q.forEach(function(n,k){
   relWrite(q,n,w0[k]); r=compute();
   dq.push(r.DQ); sq.push(q.map(function(x){return x.sq;}));});
  P.dq=dq; P.sq=sq;}
 catch(e){P.dq=null;}
 finally{relPut(S.charge,c0); relPut(S.replace,r0); compute();}
 if(!P.dq)return P;
 /* which queue address each plan line speaks for, and how many lines each has.
    The first place an address sits in the queue is the one the write uses. */
 P.at={}; q.forEach(function(n,k){if(P.at[n.i]==null)P.at[n.i]=k;});
 P.of=(RUN.plan||[]).map(function(key){return P.at[+String(key).split(':')[0]];});
 P.lines=q.map(function(){return 0;});
 P.of.forEach(function(k){if(k!=null)P.lines[k]++;});
 return P;}
/* where the count stands on the line being said. A line counts once it has
   been said, so the first pass of a run reads the field as it stood. An
   address the plan was cut before reaching has no lines, so its share lands
   with the cooldown and not before. */
function relLive(){
 var P=RUN.proj;
 /* keyed to the run it was built for, so a run built by hand, or picked again,
    is projected again rather than read off the last one */
 if(!P||P.queue!==RUN.queue||P.plan!==RUN.plan)P=relProject();
 if(!P.dq)return null;
 var said=P.lines.map(function(){return 0;});
 if(RUN.phase==='run')P.of.forEach(function(k,i){
  if(k==null)return;
  said[k]+=i<RUN.idx?RUN.dose:(i===RUN.idx?RUN.pass:0);});
 var f=said.map(function(x,k){return P.lines[k]?Math.min(1,x/(P.lines[k]*RUN.dose)):0;});
 var dq=P.dq[0];
 f.forEach(function(x,k){dq+=x*(P.dq[k+1]-P.dq[k]);});
 return {dq:dq,dq0:P.dq[0],
  sqAt:function(n){var k=n?P.at[n.i]:null; if(k==null)return null;
   return P.sq[k][k]+f[k]*(P.sq[k+1][k]-P.sq[k][k]);}};}
/* THE ROW. A label is one word (V17), and DQ is the word the Field prints beside
   the same figure. It carries NO TITLE, and the first cut did: tip.js turns
   every title into the product's tooltip, this row sits directly over Pause
   and End, and the tooltip it raised on the way down covered Pause so the
   press did not land. The functional gate timed out on exactly that click.
   On a run the person is reaching for Pause, so nothing opens on this row. Two
   decimals, because at one the lightest profile measured, Sofia, moves a tenth
   every few minutes, and a count down that holds still reads as a count down
   that stopped. Not aria-live: it changes on every line, and a reader that
   announced it would talk over the voice. */
function relShade(dq,dq0){
 if(dq==null||dq0==null)return '';
 return '<div class="rel-clock">'
  +'<div class="rel-fig"><span>DQ</span><b>'+dq.toFixed(2)+'%</b></div>'
  +'<div class="rel-fig"><span>Down</span><b>'+Math.max(0,dq0-dq).toFixed(2)+'%</b></div></div>';}
/* ============================================================
   THE TWO COUNTS. His words, 27 September: "You should have a
   countdown of how much is counting. Every time you release one, it
   should tick down. It should start with the starting number. The
   install should tick up, show you which positive charges you're
   adding."

   The card had "Pass 3 of 50 · pattern 1 of 4" in twelve point dim
   type, and it was not either of these: it counted up, it counted
   one block and started again at every block, and it said nothing
   of the install. So these are new and they are the run's own
   figures, read off where the walker is, never kept by hand beside
   it. A line counts once it has been said, so the first line of a
   run shows the whole dose still to release, which is his "start
   with the starting number", and the release count reaches nought
   on the cooldown.

   The unit is "patterns" for the release half because it is the word
   the setup already gives the dose ("Patterns", ruled at round IG)
   and the word he uses for what was released. The install half is
   "truths", the book's own noun for it at 2401: "50 embodied truth on
   the left". Toward is what CHILD calls the coherent opposite and
   what the finished card already prints beside every address.
   ============================================================ */
function relCounts(){
 var c={left:0,of:0,put:0,putOf:0,said:0,toward:[]};
 (RUN.plan||[]).forEach(function(k,i){
  var truth=/truth$/.test(String(k).split(':')[1]||'');
  var said=RUN.phase==='run'?(i<RUN.idx?RUN.dose:(i===RUN.idx?RUN.pass:0)):0;
  if(truth){c.putOf+=RUN.dose; c.put+=said;
   if(RUN.phase==='run'&&i<=RUN.idx){var o=relOpp(BY[+String(k).split(':')[0]]);
    if(o&&c.toward.indexOf(o)<0)c.toward.push(o);}}
  else {c.of+=RUN.dose; c.said+=said;}});
 c.left=c.of-c.said;
 return c;}
function relTally(c){
 if(!c||!c.of)return '';
 /* the number large and the unit beside it at body size, so two of them fit
    across a phone's card with the strips on it */
 function fig(lbl,n,u){return '<div class="rel-fig"><span>'+lbl+'</span><b style="font-size:30px;line-height:1.1">'
  +n+'<small style="font-size:13px;font-weight:400;color:var(--dim)"> '+u+'</small></b></div>';}
 return '<div class="rel-clock" style="flex-wrap:wrap;margin-bottom:6px">'
  +fig('Remaining',c.left,c.left===1?'pattern':'patterns')
  +fig('Installed',c.put,c.put===1?'truth':'truths')+'</div>'
  +(c.toward.length?'<div class="rel-ct">Toward '+esc(c.toward.join(', ').toLowerCase())+'</div>':'');}
/* which address of the run the card is on, counted in the order the plan
   speaks them. "pattern 1 of 4" stood here and counted plan blocks, four to an
   address, under the same word the two counts above now use for lines. */
function relAddrAt(){
 var seen=[], at=0;
 (RUN.plan||[]).forEach(function(k,i){var a=String(k).split(':')[0];
  if(seen.indexOf(a)<0)seen.push(a); if(i===RUN.idx)at=seen.indexOf(a);});
 return {at:at,of:seen.length};}
/* ============================================================
   THE RUNNING CLOCK AND THE TWO MINUTES. "You should see a running
   log of how long it's running", and after the list, "wait for two
   minutes, and there should be a two minute countdown."

   Elapsed is wall time from Run release, less any time spent
   paused, frozen when the list ends. Left, beside it, is the script
   still to come, which the card already had. They are two clocks and
   say two things.

   One ticker, once a second, and it writes two text nodes and the
   settle dial by id and nothing else. The card is rewritten on every
   line, and a ticker that rewrote it every second would take focus
   off Pause under a keyboard and off a Felt mark mid press. It
   redraws the card once, when the two minutes run out, because that
   is where the summary appears.
   ============================================================ */
function relElapsed(){
 if(!RUN.t0)return 0;
 var end=RUN.tEnd||(RUN.paused&&RUN.pauseAt?RUN.pauseAt:Date.now());
 return Math.max(0,(end-RUN.t0-(RUN.pausedMs||0))/1000);}
function relSettleLeft(){
 return RUN.settleAt?Math.max(0,REL_SETTLE_S-(Date.now()-RUN.settleAt)/1000):REL_SETTLE_S;}
function relTicker(on){
 clearInterval(RUN.tick); RUN.tick=on?setInterval(relSecond,1000):null;}
function relSecond(){
 if(!RUN.open){relTicker(false);return;}
 var e=document.getElementById('relel'); if(e)e.textContent=relMMSS(relElapsed());
 if(RUN.phase!=='done'||!RUN.settleAt||RUN.settled)return;
 var left=relSettleLeft(), s=document.getElementById('relset'), d=document.getElementById('relsetd');
 if(s)s.textContent=relMMSS(left);
 if(d)d.setAttribute('stroke-dashoffset',(parseFloat(d.getAttribute('stroke-dasharray'))*(1-left/REL_SETTLE_S)).toFixed(1));
 if(left<=0){RUN.settled=true; relTicker(false); relRender();}}
/* ============================================================
   WHAT THIS RUN REACHED, AND ONLY THAT. His words: "the person
   should get a badge or reward ... tied to the number of releases
   and the number of patterns or structures they're releasing. We
   should have badges for all the saboteurs, complexes, and
   hypercomplexes."

   This is the literal, bounded half of it and deliberately no more.
   What it means to have cleared a saboteur is an open question of
   his (every address of it below the release line, or its
   replacement installed there), and a badge that says cleared
   before he answers is a claim the engine cannot back. So nothing
   here is permanent, nothing is saved, nothing is a currency, and
   the word cleared is not used. It says which saboteurs, complexes
   and hyper complexes were running through the addresses this run
   worked, and how many of each one's addresses it worked.

   Read off compute() taken before the write, because that is the
   field the run was aimed at; after the write some of them stop
   running, and a list read then would leave out the ones the run did
   the most to. An overshot entry is left out: it is the installed
   opposite driven past where it helps, and a release does not work
   on it. The character layer is left out because he named three
   tiers and not four. Kept as names and numbers, never as the live
   objects, which the next compute() rewrites.
   ============================================================ */
function relHits(r){
 var ids={}, H={sab:[],cx:[],hy:[]};
 (RUN.queue||[]).forEach(function(n){ids[n.i]=1;});
 [['sab','sabs'],['cx','cxs'],['hy','hys']].forEach(function(t){
  var seen={};
  ((r&&r[t[1]])||[]).forEach(function(o){
   if(!o||o.over||seen[o.nm])return;
   var lv=leaves(o), hit=lv.filter(function(n){return ids[n.i];}).length;
   if(!hit)return; seen[o.nm]=1;
   H[t[0]].push({nm:o.nm,hit:hit,of:lv.length,b:(lv[0]||{}).b||'Heart'});});
  /* the ones this run reached furthest into first, and on a tie the larger
     share of its own addresses */
  H[t[0]].sort(function(a,b){return b.hit-a.hit||b.hit/b.of-a.hit/a.of;});});
 return H;}
function relHitRows(H){
 if(!H)return '';
 var NM={sab:'Saboteurs',cx:'Complexes',hy:'Hyper complexes'};
 var ks=['sab','cx','hy'].filter(function(k){return H[k].length;});
 if(!ks.length)return '<div class="pm-eye">In this run</div>'
  +'<div class="rel-sub">No saboteur, complex or hyper complex was running through these addresses.</div>';
 return '<div class="pm-eye">In this run</div>'+ks.map(function(k){
  return '<div class="rel-ct" style="text-align:left;margin-top:12px">'+NM[k]+'</div>'
   /* no scroll of its own: three lists each scrolling inside a card that
      scrolls is three places for a thumb to catch */
   +'<div class="rel-log" style="margin:6px 0;max-height:none;overflow:visible">'+H[k].map(function(x){
    return '<div class="rel-row">'
     +crBadge(x.b,x.hit/Math.max(1,x.of)*100,{size:'sm',raw:String(x.hit),
       glyph:'<path d="'+CHAINGLYPH[k]+'"/>',
       title:x.nm+', '+x.hit+' of its '+x.of+(x.of===1?' address':' addresses')+' in this run'})
     +'<span>'+esc(x.nm)+'</span><em>'+x.hit+' of '+x.of+(x.of===1?' address':' addresses')+'</em></div>';}).join('')
   +'</div>';}).join('');}
function relCoolDown(){
 if(RUN.done)return;
 /* where the walker stood, read before the phase moves off the list */
 var tally=relCounts();
 RUN.done=true; RUN.phase='done';
 relHush();
 /* THE RUN IS OVER HOWEVER THIS ENDS, AND SO IS THE TONE. relRender is what
    moves the tone, and the refusal below returns without one, so a run walked
    to its end on a worked example left the card on its last line and the tone
    sounding that line's seat until something redrew the card. Measured with
    this line taken out: refused, and still sounding. */
 relTone();
 /* READ THE NUMBER BEFORE THE WRITE, so the panel can report what this run
    actually did rather than asserting that it did something. A control must
    never claim success before it has it, and "released" is not the same claim
    as "your coherence moved". */
 /* YOU CANNOT RELEASE SOMEBODY ELSE'S PATTERNS, AND THE ANSWER IS TO REFUSE.

    This is my defect and the second attempt at it. The first version wrote the
    release into whichever field was loaded and then moved the pointer, so a
    run started on a reference case emptied that case and left the person's own
    record carrying its charge. The fix was to repoint first, which stopped the
    leak and broke the surface: repointing before the read meant the whole run
    executed against the person's own empty field while the queue had been
    built from the case's addresses.

    Measured on the second version: Sofia 57.18, Diane 28.65, Marcus 39.17 and
    James 12.79 all landed on CQ 42.3, every carrying address zeroed, the
    profile silently switched to Custom and twenty five patterns spent. Four
    presses spent the whole gift. That is worse than the bug it replaced.

    Both versions were answering the wrong question. A reference case is a
    demonstration, not a record, and releasing its addresses is not a thing a
    person can coherently do: the patterns are theirs and the charge is not.
    So the run refuses and says which profile it is on. Refusing costs nothing
    and the alternative destroys a field and bills for it.

    The meter ruling is untouched. When a person runs their own release they
    are the person charged, which is what it always meant. */
 if(typeof S!=='undefined'&&S.who!==0){
  RUN.done=false; RUN.phase='pick';
  /* ONE LINE, AND THE STATE MOVED TO THE PICKER. Ruled 25 September (BA9): he
     struck the sentence that stood here, "You are looking at Abraham, which is
     a worked example rather than your record. Switch to your own profile to
     run a release.", as unnecessary text. A failure holds on screen, so it sat
     above the Field long after the run that raised it.

     It was doing two jobs and they go to two places. Which profile is up is a
     state, and a state belongs on the control that sets it: the picker reads
     "Abraham, example" for as long as one is loaded (loadP, ui/personas.js).
     That nothing was released is a refusal, and a refusal still reports and
     names its own reason, because a write that fails without a word is the
     silent failure this codebase forbids by name. */
  if(typeof status==='function')status('Nothing released on a worked example.','fail');
  return false; }
 /* expression before and after, because it is what a release moves visibly.
    CQ is the 21 laws, and since the correction of 25 September a release lifts
    the laws at its seat a little (releaseWork below), 0.14 of CQ for a full
    run at 50 and 0.055 at 80. That is his "you may not see CQ move", so
    the panel reads the move a person can see, and expression carries the lift
    inside it, since expression is CQ times what the pull leaves. */
 var _pre=compute(); RUN.ex0=_pre.EX; RUN.ceil0=exCeiling();
 /* what the finished card reports, fixed here: the two counts where the list
    stopped, the elapsed clock stopped with it, and what was running through
    these addresses before the write moved any of it */
 RUN.tally=tally;
 if(RUN.paused&&RUN.pauseAt){RUN.pausedMs+=Date.now()-RUN.pauseAt;RUN.pauseAt=0;}
 RUN.tEnd=RUN.t0?Date.now():0;
 RUN.hits=relHits(_pre);
 /* and the shadow, so the row the run counted down on lands on a number the
    engine computed, read before the write and after it */
 RUN.dq0=_pre.DQ;
 /* the release empties addresses and installs their opposites. it is the
    largest single write this product makes and it had no way back. */
 undoPush('the release at '+(RUN.queue.length?RUN.queue.length+' addresses':'no addresses'));
 var freed=0;
 RUN.queue.forEach(function(n){
  var w0=n.sq*10;                                   /* weights are 0 to 100 here */
  var m=relWrite(RUN.queue,n,w0);
  freed+=Math.abs(m.d);
  RUN.log.push({node:n.i,name:n.k,band:n.b,fetter:n.cf,
   opp:(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'',
   w0:Math.round(w0),d:m.d,w1:m.w1,cleared:(m.w1<=6)});});
 RUN.freed=freed;
 /* One pattern is one line: one channel over one address. Every line of the
    run is keyed, so a rerun of the same ground costs nothing and only new
    ground spends the tier. */
 /* THE PERSON WHO RAN IT IS THE PERSON WHO IS CHARGED. toYou repoints CURP at
    the person's own record, and it was called at the end of this function, so
    a release run while a reference case was loaded wrote its meter onto the
    reference case and then moved the pointer away. The patterns were spent, the
    person's allowance never moved, and the keys went into a record nobody
    reads. The repoint comes first now, so everything below lands on the person
    who did the work. */
 if(CURP){
  /* the plan built when the run was picked, committed as it stands. a plan
     that changes between being shown and being charged is a bill a person did
     not agree to. */
  RUN.meter=meterRun(CURP,RUN.plan||[]);
  /* AND THE WORK REACHES THE LAWS. Ruled 25 September, after ship: "Those 15k
     releases raised my CQ." Every pattern of new ground this run opened lifts
     the answered laws at its address's seat by LIFT_R of what is left. Only
     new ground: the meter has just said which keys those are, so a rerun of
     ground already open is free and moves nothing, exactly as it spends
     nothing. After undoPush above, so taking the release back takes this too. */
  RUN.lift=releaseWork(CURP,(RUN.meter&&RUN.meter.fresh)||[]);
  /* A first is a dated fact about the work. Recorded here because this is
     the one place that knows an address was opened for the first time, and
     it is recorded as the address and the seat, never as a claim about the
     person who opened it. */
  RUN.firsts=[];
  RUN.queue.forEach(function(n){
   var f=meterFirst(CURP,'addr:'+n.i,n.k+', '+n.b);
   if(f)RUN.firsts.push(f);});
  var seats={}; RUN.queue.forEach(function(n){seats[n.b]=1;});
  Object.keys(seats).forEach(function(b){
   var f=meterFirst(CURP,'seat:'+b,'first release at the '+String(b).toLowerCase());
   if(f)RUN.firsts.push(f);});}
 /* this pushed a snapshot by hand and then saved, which is pSnap plus pSave
    with one of the two writes done twice. */
 if(CURP){pSave();pSnap();}
 /* THE COOLDOWN IS SPOKEN AFTER THE WRITE, never instead of it. End jumps
    here and does not skip it: an address opened and then abandoned is open
    territory, "whatever frequency the system encounters first will fill the
    space" (3656), so the cooldown runs out whichever way the run ended. The
    mark says which: a stop when End was pressed, the close when it ran out. */
 RUN.cool=0; RUN.paused=false;
 /* THE TWO MINUTES START WITH THE COOLDOWN, not after it: "meanwhile, keep
    your awareness inside your body". The cooldown's lines are said inside
    them. Leaving is never blocked; Done is on the card the whole time. */
 RUN.settleAt=Date.now(); RUN.settled=false; relTicker(true);
 relMark(RUN.halted?'halt':'close');
 syncCh();relRender();render();
 relStep();}
function relClose(){relHush();relTicker(false);RUN.open=false;RUN.phase='idle';RUN.paused=false;relRender();render();}
/* ============================================================
   THE SEAT TONE FOLLOWS THE CARD.

   The pitch is the seat of the address the card is on, its own
   Solfeggio number, chosen by the address and never by a picker.
   The slow pulse under it is the half: theta while the address is
   released, alpha while its opposite installs, which are the two
   bands the book gives those two moments. ui/sound.js makes the
   sound. This decides what it should be.

   It is moved from relRender, because the card and the tone are
   two readings of one state and every change to that state already
   comes through there. A tone kept in step by hand at each place
   the run moves is one more place to forget.
   ============================================================ */
function relToneOn(){
 return !!(typeof CURP!=='undefined'&&CURP&&CURP.ui&&CURP.ui.tone);}
/* EVERY MOVE LANDS INSIDE THE LINE THAT CAUSED IT.

   The tone only moves at a block's first line, its head, because that is the
   only place the address or the half changes. A glide takes nine tenths of
   RUN.speed, about two seconds, and the shortest head the script can speak,
   one gate at the fastest pace, is longer than that, so the pitch has arrived
   before the next line appears and a target never lands on a glide still in
   flight. The bed restarts a glide from its last target, which is why that
   margin matters. The fade in takes what is left of the opening, all of it
   from Begin, and arrives with the first address; started once the run is
   under way, by Resume or by the switch, it takes one line. The fade out
   keeps the research's four seconds, because nothing after it can disagree. */
var REL_GLIDE=0.9;
function relTone(){
 if(typeof bedFollow!=='function')return;
 var live=RUN.open&&!RUN.paused&&(RUN.phase==='welcome'||RUN.phase==='opening'||RUN.phase==='run');
 var at=(live&&relToneOn())?relNow():null;
 var hz=(at&&at.n)?seatHz(at.n.b):null;
 /* no tone at this seat is silence, never the last seat's tone held over */
 if(!hz){bedStop();return;}
 var fade=RUN.speed, i;
 /* the fade in takes the whole frame ahead of the list, welcome and opening,
    so it still arrives with the first address now that the frame is two */
 if(RUN.phase==='welcome'||RUN.phase==='opening'){fade=0;
  if(RUN.phase==='welcome'){var w=relWelcome();
   for(i=RUN.line;i<w.length;i++)fade+=relSec({kind:'welcome',text:w[i]});}
  for(i=(RUN.phase==='opening'?RUN.line:0);i<OPENING.length;i++)fade+=relSec({kind:'open',text:OPENING[i]});}
 bedFollow(hz, at.ch[2]==='truth'?BED_ALPHA:BED_THETA, fade, RUN.speed*REL_GLIDE);}
/* THE SWITCH, and it is the account page's own switch, so one control has one
   look wherever it appears. It is on the opening and on the run as well as on
   the panel before them, because a person finds out mid run, in a quiet room,
   that they left it on, and the answer to that must not be to abandon the run.

   The hertz under it is read off the bed and not off the address, so it
   cannot claim a sound that is not playing. It is in the seat's own colour,
   as ruled, and it is printed still. The beat is never drawn: a pulse at six
   to ten a second is past the three flashes a second WCAG 2.3.1 allows, and
   the heading already says which half it is in words. */
function relToneRow(n){
 if(typeof bedCan!=='function'||!bedCan()||typeof accTog!=='function')return '';
 var st=bedState(), hz=(st.on&&n)?st.carrier:0;
 return accTog('Seat tone','reltone',relToneOn(),hz?hz+' Hz':'',hz?seatCol(n.b):'');}
/* the voice's own switch, and where there is no voice there is no switch.
   Its note is the standing privacy line cut to its facts: which voice, and
   whether the words stay on this machine, said before the voice says a word. */
function relVoiceRow(){
 if(typeof voiceCan!=='function'||!voiceCan()||typeof accTog!=='function')return '';
 var v=voicePick();
 return accTog('Voice','relvoice',relVoiceOn(),
  !v?'':v.name+(v.localService?', on this machine':', a network service'));}
function relBuzzRow(){
 if(typeof buzzCan!=='function'||!buzzCan()||typeof accTog!=='function')return '';
 return accTog('Vibration','relbuzz',relBuzzOn(),'');}
function relSwitches(n){return relVoiceRow()+relToneRow(n)+relBuzzRow();}
/* the line being said, which is the line being displayed */
function relLineRow(st){
 if(!st||!st.text)return '';
 return '<div class="rel-line'+(st.truth?' tru':'')+(st.kind==='pass'?' pass':'')+'">'
  +esc(st.text)+'</div>';}
/* THE TWO STRIPS, left and right, with the live one lit. The heading says the
   side in words as well, so the colour is never the only carrier. */
function relStrips(side){
 return ['L','R'].map(function(s){
  return '<div class="rel-strip rel-strip-'+s+(s===side?' on':'')+'" aria-hidden="true"><span>'
   +REL_SIDE[s]+'</span></div>';}).join('');}
/* angular progress, because a circle has no last place */
function relDial(p,id){
 var r=22, C=2*Math.PI*r, off=C*(1-Math.max(0,Math.min(1,p)));
 return '<svg class="rel-dial" width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">'
  +'<circle cx="26" cy="26" r="'+r+'" fill="none" stroke="var(--sunk)" stroke-width="3"/>'
  +'<circle'+(id?' id="'+id+'"':'')+' cx="26" cy="26" r="'+r+'" fill="none" stroke="var(--accent)" stroke-width="3" '
  +'stroke-linecap="round" transform="rotate(-90 26 26)" stroke-dasharray="'+C.toFixed(1)
  +'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg>';}
/* ELAPSED REPLACED PLANNED ON THE RUN. Planned is Elapsed plus Left, so three
   times on one row said one thing twice; the dial still reads the share of
   the whole script that is behind. */
function relClock(){
 var total=relSecFrom(null), left=relSecFrom({phase:RUN.phase,line:RUN.line,idx:RUN.idx,pass:RUN.pass,cool:RUN.cool});
 return '<div class="rel-clock">'+relDial(total?1-left/total:0)
  +'<div class="rel-fig"><span>Elapsed</span><b id="relel">'+relMMSS(relElapsed())+'</b></div>'
  +'<div class="rel-fig"><span>Left</span><b>'+relMMSS(left)+'</b></div></div>';}
/* the two minutes, as a dial that empties and the time left on it, with the
   run's own elapsed time beside it, stopped where the list stopped */
function relSettle(){
 var left=relSettleLeft();
 return '<div class="rel-clock">'+relDial(left/REL_SETTLE_S,'relsetd')
  +'<div class="rel-fig"><span>Left</span><b id="relset">'+relMMSS(left)+'</b></div>'
  +(RUN.t0?'<div class="rel-fig"><span>Elapsed</span><b>'+relMMSS(relElapsed())+'</b></div>':'')
  +'</div>';}
function relRender(){
 /* the tone first, so the switch below prints what is sounding now */
 relTone();
 var h=document.getElementById('rel'); if(!h)return;
 if(!RUN.open){h.style.display='none';h.innerHTML='';return;}
 h.style.display='flex';
 var st=relCur();
 var out='<div class="rel-card'+(RUN.phase==='run'?' rel-running':'')+'">';
 if(RUN.phase==='welcome'){
  /* HIS VOICE'S SLOT. The line is set at the size .rel-speak sets and does not
     carry that class, on purpose: .rel-speak and .rel-line mean "the line the
     voice is saying", tests/design.js holds every one of them to what the
     voice actually said, and this line is never said by the synthesiser. The
     note says so on its first line, and says the voice starts at the list only
     while the voice is on, because with it off that sentence is not true. */
  var wl=relWelcome();
  out+='<div class="pm-eye" aria-live="polite">Release, opening</div>'
   +'<div class="rel-human" style="font-size:22px;line-height:1.6;margin:22px 0;min-height:70px;'
    +'color:var(--ink);font-weight:300">'+esc(st.text)+'</div>'
   +'<div class="rel-dots">'+wl.map(function(_,i){
     return '<i class="'+(i<=RUN.line?'on':'')+'"></i>';}).join('')+'</div>'
   /* plain words, the JK ruling of the same day: "we want to speak to people
      as if they're 10". "Not in this build" was the engineering word for it. */
   +(RUN.line===0?'<div class="rel-sub">His recorded voice reads this part. Until it is recorded, '
     +'read it to yourself.'+(relVoiceOn()?' The app voice starts with the list.':'')+'</div>':'')
   +relClock()
   +'<div class="rel-act"><button class="btn" id="relskip">Skip the opening</button>'
   +'<button class="btn" id="relpause">'+(RUN.paused?'Resume':'Pause')+'</button></div>'
   +relSwitches(relNow().n);
 } else if(RUN.phase==='opening'){
  /* "Release and reframe" was the old name for the mechanic, two words where
     GS ruled one: "stick with release." The line is the synthetic voice's
     first, the hand over from the welcome to the list. */
  out+='<div class="pm-eye" aria-live="polite">Release, opening</div>'
   +'<div class="rel-speak">'+esc(st.text)+'</div>'
   +relClock()
   +'<div class="rel-act"><button class="btn" id="relskip">Skip the opening</button>'
   +'<button class="btn" id="relpause">'+(RUN.paused?'Resume':'Pause')+'</button></div>'
   +relSwitches(relNow().n);
 } else if(RUN.phase==='run'){
  var at=relNow();
  var ch=at.ch, n=at.n, c=seatCol(n.b);
  var cur=relStepAt(relAt(RUN.idx),RUN.pass)||relStepAt(at,0);
  /* THE RING ON THE PLATE IS THE ADDRESS BEING RELEASED, so it is where SQ is
     seen going down. It read n.sq, which does not move until the cooldown, so
     it printed the same percent for every one of two hundred lines. It reads
     the count down now, and n.sq still when there is none. */
  var live=relLive(), sqNow=live?live.sqAt(n):null;
  if(sqNow==null)sqNow=n.sq;
  var pole=relPole(ch[0]), ad=relAddrAt();
  out+=relStrips(ch[0])
   /* THE HALF AND THE SIDE, IN WORDS. "Release, left channel" is the book's
      own order of telling it, and it is the heading so it is read first. */
   +'<div class="pm-eye" aria-live="polite">'+(ch[2]==='truth'?'Reframe':'Release')+', '
     +ch[1].toLowerCase()+' channel</div>'
   /* and which pole and which nervous system that side is, from C3_POLE */
   +(pole?'<div class="rel-ct">'+esc(pole.nm)+', '+esc(pole.ans)+'</div>':'')
   +'<div class="rel-plate">'+crNode(Object.assign({},n,{sq:sqNow}),'xs',{raw:Math.round(sqNow*10)+'%'})
   +'<span><span class="rel-node" style="color:'+c+'">'+esc(n.k)+'</span>'
   +'<span class="rel-sub">'+esc(n.b)+' · '+esc(n.n||'')+'</span></span></div>'
   /* THE THOUGHT LINE ITSELF, and it is the line the voice is saying. relLine
      reads the plan key this card is on, so the head of every block is the
      pattern the meter charges for, and a limit line carries the six channels
      he ruled through C3_STEM, all six in one sweep. */
   +relLineRow(cur)
   +'<div class="rel-ct">Pass '+(RUN.pass+1)+' of '+RUN.dose+' · address '+(ad.at+1)+' of '+ad.of+'</div>'
   +relTally(relCounts())
   +relClock()
   +(live?relShade(live.dq,live.dq0):'')
   +'<div class="rel-act"><button class="btn" id="relpause">'+(RUN.paused?'Resume':'Pause')+'</button>'
   /* End does not abandon the run. It commits the plan and runs the cooldown. */
   +'<button class="btn" id="relstop">End</button></div>'
   +relSwitches(n);
 } else if(RUN.phase==='done'){
  var cl=RUN.log.filter(function(x){return x.cleared;}).length;
  /* A ONE ADDRESS RUN PRINTED "1 addresses". The plural was typed onto the
     count with no singular beside it, on the card a person reads at the end
     of the run. The picker below already asks q.length===1; this asks the
     same of the log. */
  /* WHAT THE RUN DID, IN HIS SENTENCE. Asked 27 September: "You've released X
     number of patterns. You may not have felt them all, but the ones you did,
     mark to optimize for better performance." X is the release count that
     ticked down to nought on the run, read where the list stopped, so a run
     ended early says what it actually said and not what it planned. "Mark"
     needs something to mark with, so each address below carries a Felt mark;
     "to optimize for better performance" is not in the sentence, because
     nothing in the product reads a mark yet and a sentence promising that it
     does would be the claim this file refuses to make. The mark is held for
     this run and rides in the log to the ritual. */
  var t=RUN.tally||{said:0,put:0};
  out+='<div class="pm-eye">Released</div>'
   +'<div class="rel-speak rel-cool">'+esc(COOLING[Math.min(RUN.cool,COOLING.length-1)])+'</div>'
   +'<div class="rel-node" style="font-size:24px">You released '+t.said+(t.said===1?' pattern.':' patterns.')+'</div>'
   +'<div class="rel-sub">You may not have felt them all. Mark where you felt them.</div>'
   /* THE TWO MINUTES, then what the run reached. The summary takes the
      clock's place when the clock runs out, which is his order: "at the end
      of that, the person should get a badge". */
   +(RUN.settleAt&&!RUN.settled
     ?relSettle()+'<div class="rel-sub">The release keeps moving after the lines stop.</div>'
     :relHitRows(RUN.hits))
   +'<div class="rel-sub">'+RUN.log.length+(RUN.log.length===1?' address, ':' addresses, ')
     +t.put+(t.put===1?' truth':' truths')+' installed, '+cl+' cleared entirely, '+RUN.freed+' weight freed</div>'
   /* the row the run counted down on, landed. Read off compute() after the
      write and against the reading taken before it, never off the projection,
      so if the two ever part it is this number that is true. */
   +relShade(RUN.dq0!=null?compute().DQ:null,RUN.dq0)
   +'<div class="rel-log">';
  RUN.log.forEach(function(x,i){
   /* the direction goes under the name rather than beside it. As a fourth
      column it pushed the mark out of the card at 390, measured on
      Possession, whose "toward Groundedness" is the longest the nine carry. */
   out+='<div class="rel-row'+(x.cleared?' cleared':'')+'">'
    +cr(x.band, (x.w0||0)*10, {size:'xs', raw:x.w0+' '+x.d,
       title:x.name+' · '+x.band+' · '+x.w0})
    +'<span>'+esc(x.name)+'<em style="display:block">toward '+esc(x.opp||'no pole')+'</em></span>'
    /* a segment of one, so pressed reads the way every other pressed choice
       in the product reads, and at the tap floor */
    +'<span class="seg"><button type="button" data-relfelt="'+i+'" aria-pressed="'+(!!x.felt)
     +'" aria-label="Felt at '+esc(x.name)+'">Felt</button></span></div>';});
  /* WHAT MOVED, AND WHAT RELEASE BARELY MOVES. The panel used to report weight
     freed and nothing else, so a person ran the loop again and again watching
     a number that was never going to answer. Release works on the shadow, and
     on integrity only slowly: it lifts the laws at its seat by a small share
     of what is left, which is thousands of releases to a visible change in CQ.
     So the panel states the move it actually made, and when the ground under
     release is spent it says so and names the lever that is not spent, the
     laws themselves. Measured: three of the six ICPs have under two points of
     total release headroom. */
  var _now=compute(), _mv=_now.EX-(RUN.ex0||0), _left=exHeadroom(_now.EX);
  out+='</div><div class="rel-note">Expression '
   +(Math.abs(_mv)<0.05?'did not move.'
     :(_mv>0?'up ':'down ')+Math.abs(_mv).toFixed(1)+', now '+_now.EX.toFixed(1)+'.')
   +' '+(_left<1.5
     /* THE NUMBER SAYS WHAT IT IS, AND THE SENTENCE STOPS. "about 1.2 left to
        give you" is one point two of what, and the sentence after it ran to
        thirty words with its subject deferred and a gloss in the middle. */
     ?'Release has about '+_left.toFixed(1)+' points left to give you. The laws '
      +'hold expression down from here, and there are twenty one of them. '
      +'They move when you answer them, and when what you do changes.'
     :'Release has about '+_left.toFixed(1)+' points more in it before the laws '
      +'are the only thing holding expression down.')
   +'</div>'
   /* "A release empties the story, that's gone." Struck by him at round IG,
      with the rebound and completion days that rode in the same note. */
   +'<div class="rel-act"><button class="btn" id="relclose">Done</button>'
   +'<button class="btn pri" id="relrit">Build a ritual</button></div>'
   /* the voice can still be silenced while the cooldown is being said */
   +(RUN.cool<COOLING.length?relVoiceRow():'');
 } else {
  var q=RUN.queue;
  /* CUT HARD, RULED 27 SEPTEMBER (round IG). His words: "a release empties
     the story, that's gone... Need for approval, nihilism, self silencing,
     all that goes away because you've selected the ones you want... Cost
     runs left, that goes away. And just a run release button. So it's
     release your selections, pace, and how many patterns."

     The selection is made in Imprints, so it is not listed again here with
     commentary: it is shown as its rings and nothing else, each named on
     hover. Two settings, pace and how many patterns, and one button. The
     price is still enforced at the door, below, and still nowhere else: nought
     left means there is no run to offer, and that refusal says why, because a
     control that silently does nothing is the failure this codebase forbids.
     The plan it runs is still meterPlan's, capped at what is left, and
     relCoolDown still charges exactly that plan. */
  var left=relLeft(), spent=(left<=0);
  out+='<div class="pm-eye">Release your selections</div>'
   +'<div class="rel-rings">'+q.map(function(n){
     return crNode(n,'xs',{raw:''});}).join('')+'</div>';
  if(spent)out+='<div class="rel-node">Nothing left to open</div>'
   /* "New ground is what an allowance buys" is the lexicon read aloud, which
      is his GX complaint about "find an address". Said as what it pays for. */
   +'<div class="rel-note">Your allowance pays for addresses you have not released before, and this '
   +'period\'s is spent. Rerunning an address costs nothing and is in the '
   +'ritual. A wider allowance is on the plan in settings.</div>';
  /* HOW MANY PATTERNS is the dose a channel, fifty by default, which is the
     book's and what he described hearing (open question 5). Pace is 1 at
     speaking pace, which is four seconds between statements (relSpace). Both
     answer to the clock the run shows once it starts. */
  else out+='<div class="rel-fields">'
    +'<label class="rel-field"><span>Pace</span><input type="number" id="relpace" min="0.5" max="2" step="0.1" value="'
     +RUN.pace+'"></label>'
    +'<label class="rel-field"><span>Patterns</span><input type="number" id="reldose" min="1" max="'
     +REL_DOSES[REL_DOSES.length-1]+'" step="1" value="'+RUN.dose+'"></label>'
    /* his three, as quick picks on the same number. "Left and right" is his
       own framing of it and is true: every pick is that many on each side. */
    +'<div class="rel-field"><span>Left and right</span><div class="seg" role="group" aria-label="Patterns, left and right">'
     +REL_DOSES.map(function(d){return '<button type="button" data-reldose="'+d+'" aria-pressed="'
      +(RUN.dose===d)+'">'+d+'</button>';}).join('')+'</div></div>'
    +'</div>';
  out+='<div class="rel-act"><button class="btn" id="relcancel">'+(spent?'Close':'Cancel')+'</button>'
   /* THE BUTTON IS NOT THERE WHEN THERE IS NOTHING TO SPEND. A disabled Begin
      would be a control the panel is still offering, and the honest reading of
      a spent allowance is that this run does not exist yet. The route out goes
      where the allowance is, which is the only thing that changes the answer. */
   +(spent?'<button class="btn pri" id="relplan">Open settings</button>'
         :'<button class="btn pri" id="relgo">Run release</button>')+'</div>'
   /* and no switch for a run that cannot begin */
   +(spent?'':relSwitches(null));}
 out+='</div>';
 h.innerHTML=out;
 var b;
 /* BEGIN IS THE HAND OVER, and the press a browser needs before it will make
    a sound. The technical requirement and the ritual are the same press. */
 if((b=document.getElementById('relgo')))b.onclick=function(){
  RUN.phase='welcome';RUN.line=0;RUN.idx=0;RUN.pass=0;RUN.halted=false;RUN.paused=false;
  RUN.t0=Date.now();RUN.tEnd=0;RUN.pauseAt=0;RUN.pausedMs=0;relTicker(true);relStep();};
 if((b=document.getElementById('relskip')))b.onclick=function(){
  RUN.phase='run';RUN.line=0;RUN.idx=0;RUN.pass=0;relStep();};
 if((b=document.getElementById('relcancel')))b.onclick=relClose;
 /* the same call the profile button makes, which is the one route to that
    surface and goes through setTab so the folded surface ruling holds. */
 if((b=document.getElementById('relplan')))b.onclick=function(){relClose();setTab(TAB.SETTINGS);};
 if((b=document.getElementById('relclose')))b.onclick=relClose;
 if((b=document.getElementById('relrit')))b.onclick=function(){var lg=RUN.log.slice();relClose();ritOpen(lg);};
 if((b=document.getElementById('relstop')))b.onclick=function(){RUN.halted=true;relCoolDown();};
 /* Pause stops the voice mid word. Resume says the line again from its start,
    because half a statement is not one. */
 if((b=document.getElementById('relpause')))b.onclick=function(){
  RUN.paused=!RUN.paused;
  /* the elapsed clock stops with the run and does not count the pause */
  if(RUN.paused){RUN.pauseAt=Date.now();relHush();relRender();}
  else {if(RUN.pauseAt)RUN.pausedMs+=Date.now()-RUN.pauseAt; RUN.pauseAt=0; relStep();}};
 if((b=document.getElementById('reldose')))b.onchange=function(){
  RUN.dose=Math.max(1,Math.min(REL_DOSES[REL_DOSES.length-1],Math.round(+this.value)||1));relRender();};
 h.querySelectorAll('[data-reldose]').forEach(function(el){el.onclick=function(){
  RUN.dose=+this.getAttribute('data-reldose');relRender();};});
 /* a mark changes one attribute and the log entry under it, never the card:
    the cooldown is still being said and a redraw would move the list */
 h.querySelectorAll('[data-relfelt]').forEach(function(el){el.onclick=function(){
  var x=RUN.log[+this.getAttribute('data-relfelt')]; if(!x)return;
  x.felt=!x.felt; this.setAttribute('aria-pressed',String(x.felt));};});
 if((b=document.getElementById('relpace')))b.onchange=function(){
  RUN.pace=Math.max(0.5,Math.min(2,Math.round((+this.value||1)*10)/10));relRender();};
 /* uiSet is the one writer for the profile's preferences, so this reports
    through statusSaved like the other switches do. A save that fails leaves
    the tone on for this visit and says it will not survive a reload, and both
    halves of that are true. */
 if((b=document.getElementById('reltone')))b.onclick=function(){uiSet('tone',!relToneOn());relRender();};
 /* the voice, off or on mid line: the line starts again in the new state, so
    a voice turned on is heard at once and a voice turned off never finishes a
    sentence over silence */
 if((b=document.getElementById('relvoice')))b.onclick=function(){
  uiSet('voice',!relVoiceOn());
  var live=RUN.open&&!RUN.paused&&(RUN.phase==='welcome'||RUN.phase==='opening'||RUN.phase==='run'
    ||(RUN.phase==='done'&&RUN.cool<COOLING.length));
  if(live)relStep(); else {if(!relVoiceOn())speakStop(); relRender();}};
 if((b=document.getElementById('relbuzz')))b.onclick=function(){uiSet('buzz',!relBuzzOn());relRender();};}
/* THE LIST OF VOICES ARRIVES LATE. The panel names the voice before a word is
   said, so when the browser finally names its voices the panel says it again. */
(function(){
 try{ if(window.speechSynthesis&&'onvoiceschanged' in speechSynthesis)
  speechSynthesis.addEventListener('voiceschanged',function(){
   if(RUN.open&&RUN.phase==='idle')relRender();}); }catch(e){}
})();
