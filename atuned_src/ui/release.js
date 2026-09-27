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
/* ============================================================
   THE SCRIPT. DESIGN-release.md section 6, line for line.

   The first line is where his recording goes. It is not in this
   build, so the synthetic voice reads a line in its place and the
   card says so. His remembered words, "sit back, relax, we're going
   to walk through this process", are not typed here: the house
   voice rules "sit back" and "relax" out of written copy by name
   (atuned-voice V2, an outcome given as an instruction), and in his
   own recorded voice they are his, which the rule does not reach.
   That collision is his to settle and it is asked in the report,
   not settled here.

   The next three are his instruction as RV3 records it, "move your
   awareness inside your body, feel what your body is doing
   mechanically, keep your awareness inside your body", which is the
   book at 2451. The fifth is the product's own line. After it the
   first head statement opens on the six channels, "I am letting go
   of believing, perceiving, thinking, behaving, acting, and
   feeling", which is the prompt he described.
   ============================================================ */
var OPENING=['Sit down. We are going to walk through this process.',
 'Move your awareness inside your body.',
 'Feel what your body is doing mechanically.',
 'Keep your awareness inside your body.',
 'Each line names one pattern. Follow it in thought as it lands.'];
/* the book's end state, 2705, and its one sensation line that names a place,
   2355 to 2358 */
var COOLING=['Stop the work. Stay where you are.',
 'The charge moves up the channel and out through the mouth.',
 'Notice which place answers.'];
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
         dose:LINES_PER_CH,pace:1,spokeMs:0,spokeW:0};
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
function relWords(t){return String(t||'').trim().split(/\s+/).length;}
function relSec(st){
 if(!st)return 0;
 var per=RUN.spokeW>=20?RUN.spokeMs/RUN.spokeW/1000:REL_WORD_S/Math.max(0.5,RUN.pace);
 var s=relWords(st.text)*per+REL_GAP_S;
 if(st.kind==='head')s+=REL_HEAD_S;
 if(st.kind==='open'||st.kind==='cool')s+=REL_FRAME_S;
 return s;}
/* seconds of script from a point to the end, cooldown included. from is
   {phase,line,idx,pass}; with no from it is the whole run. */
function relSecFrom(from){
 var f=from||{phase:'opening',line:0,idx:0,pass:0}, s=0, i;
 if(f.phase==='opening')
  for(i=f.line;i<OPENING.length;i++)s+=relSec({kind:'open',text:OPENING[i]});
 if(f.phase==='opening'||f.phase==='run'){
  var i0=f.phase==='run'?f.idx:0, p0=f.phase==='run'?f.pass:0;
  for(i=i0;i<(RUN.plan||[]).length;i++){
   var at=relAt(i); if(!at||!at.n)continue;
   var h=relHead(at);
   for(var p=(i===i0?p0:0);p<RUN.dose;p++)
    s+=relSec(p?{kind:'pass',text:relShort(at,p,h.text)}:{kind:'head',text:h.text});}}
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
 var est=relSec(st)*1000, moved=false;
 function next(){
  if(moved||tok!==RUN.tok)return; moved=true; clearTimeout(RUN.timer);
  if(!RUN.paused)relAdvance();}
 if(relVoiceOn()&&speak(st.text,RUN.pace,function(ms){
    if(tok!==RUN.tok)return;
    if(ms<est*0.25){ clearTimeout(RUN.timer); RUN.timer=setTimeout(next,est-ms); return; }
    RUN.spokeMs+=ms; RUN.spokeW+=relWords(st.text); next();},
   function(){
    /* the browser refused the line. The run goes on at reading pace. */
    if(tok!==RUN.tok)return;
    clearTimeout(RUN.timer); RUN.timer=setTimeout(next,est);})){
  RUN.timer=setTimeout(next,est+9000);}
 else RUN.timer=setTimeout(next,est);}
function relAdvance(){
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
function relCoolDown(){
 if(RUN.done)return; RUN.done=true; RUN.phase='done';
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
 /* the release empties addresses and installs their opposites. it is the
    largest single write this product makes and it had no way back. */
 undoPush('the release at '+(RUN.queue.length?RUN.queue.length+' addresses':'no addresses'));
 var freed=0;
 RUN.queue.forEach(function(n){
  var w0=n.sq*10;                                   /* weights are 0 to 100 here */
  var d=-Math.round(w0*0.21+2);
  var w1=Math.max(0,w0+d);
  freed+=Math.abs(d);
  var share=Math.abs(d)/10/Math.max(1,RUN.queue.filter(function(q){return q.cf===n.cf;}).length);
  S.charge[n.cf]=clamp((S.charge[n.cf]||0)-share,0,10);
  /* release empties the address, replace fills it. the second half is not optional. */
  S.replace[n.cf]=clamp((S.replace[n.cf]||0)+share*0.62,0,10);
  RUN.log.push({node:n.i,name:n.k,band:n.b,fetter:n.cf,
   opp:(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'',
   w0:Math.round(w0),d:d,w1:w1,cleared:(w1<=6)});});
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
 relMark(RUN.halted?'halt':'close');
 syncCh();relRender();render();
 relStep();}
function relClose(){relHush();RUN.open=false;RUN.phase='idle';RUN.paused=false;relRender();render();}
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
 var live=RUN.open&&!RUN.paused&&(RUN.phase==='opening'||RUN.phase==='run');
 var at=(live&&relToneOn())?relNow():null;
 var hz=(at&&at.n)?seatHz(at.n.b):null;
 /* no tone at this seat is silence, never the last seat's tone held over */
 if(!hz){bedStop();return;}
 var fade=RUN.speed;
 if(RUN.phase==='opening'){fade=0;
  for(var i=RUN.line;i<OPENING.length;i++)fade+=relSec({kind:'open',text:OPENING[i]});}
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
function relDial(p){
 var r=22, C=2*Math.PI*r, off=C*(1-Math.max(0,Math.min(1,p)));
 return '<svg class="rel-dial" width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">'
  +'<circle cx="26" cy="26" r="'+r+'" fill="none" stroke="var(--sunk)" stroke-width="3"/>'
  +'<circle cx="26" cy="26" r="'+r+'" fill="none" stroke="var(--accent)" stroke-width="3" '
  +'stroke-linecap="round" transform="rotate(-90 26 26)" stroke-dasharray="'+C.toFixed(1)
  +'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg>';}
function relClock(){
 var total=relSecFrom(null), left=relSecFrom({phase:RUN.phase,line:RUN.line,idx:RUN.idx,pass:RUN.pass,cool:RUN.cool});
 return '<div class="rel-clock">'+relDial(total?1-left/total:0)
  +'<div class="rel-fig"><span>Left</span><b>'+relMMSS(left)+'</b></div>'
  +'<div class="rel-fig"><span>Planned</span><b>'+relMMSS(total)+'</b></div></div>';}
function relRender(){
 /* the tone first, so the switch below prints what is sounding now */
 relTone();
 var h=document.getElementById('rel'); if(!h)return;
 if(!RUN.open){h.style.display='none';h.innerHTML='';return;}
 h.style.display='flex';
 var st=relCur();
 var out='<div class="rel-card'+(RUN.phase==='run'?' rel-running':'')+'">';
 if(RUN.phase==='opening'){
  /* "Release and reframe" was the old name for the mechanic, two words where
     GS ruled one: "stick with release." */
  out+='<div class="pm-eye" aria-live="polite">Release, opening</div>'
   +'<div class="rel-speak">'+esc(st.text)+'</div>'
   +'<div class="rel-dots">'+OPENING.map(function(_,i){
     return '<i class="'+(i<=RUN.line?'on':'')+'"></i>';}).join('')+'</div>'
   +(RUN.line===0?'<div class="rel-sub">His recorded opening is not in this build. '
     +'This line stands in its place.</div>':'')
   +relClock()
   +'<div class="rel-act"><button class="btn" id="relskip">Skip the opening</button>'
   +'<button class="btn" id="relpause">'+(RUN.paused?'Resume':'Pause')+'</button></div>'
   +relSwitches(relNow().n);
 } else if(RUN.phase==='run'){
  var at=relNow();
  var ch=at.ch, n=at.n, c=seatCol(n.b);
  var tot=(RUN.plan||[]).length||1;
  var cur=relStepAt(relAt(RUN.idx),RUN.pass)||relStepAt(at,0);
  out+=relStrips(ch[0])
   /* THE HALF AND THE SIDE, IN WORDS. "Release, left channel" is the book's
      own order of telling it, and it is the heading so it is read first. */
   +'<div class="pm-eye" aria-live="polite">'+(ch[2]==='truth'?'Reframe':'Release')+', '
     +ch[1].toLowerCase()+' channel</div>'
   +'<div class="rel-plate">'+crNode(n,'xs',{raw:Math.round(n.sq*10)+'%'})
   +'<span><span class="rel-node" style="color:'+c+'">'+esc(n.k)+'</span>'
   +'<span class="rel-sub">'+esc(n.b)+' · '+esc(n.n||'')+'</span></span></div>'
   /* THE THOUGHT LINE ITSELF, and it is the line the voice is saying. relLine
      reads the plan key this card is on, so the head of every block is the
      pattern the meter charges for, and a limit line carries the six channels
      he ruled through C3_STEM, all six in one sweep. */
   +relLineRow(cur)
   +'<div class="rel-ct">Pass '+(RUN.pass+1)+' of '+RUN.dose+' · pattern '+(RUN.idx+1)+' of '+tot+'</div>'
   +relClock()
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
  out+='<div class="pm-eye">Released</div>'
   +'<div class="rel-speak rel-cool">'+esc(COOLING[Math.min(RUN.cool,COOLING.length-1)])+'</div>'
   +'<div class="rel-node">'+RUN.log.length+(RUN.log.length===1?' address':' addresses')+'</div>'
   +'<div class="rel-sub">'+cl+' cleared entirely, '+RUN.freed+' weight freed</div>'
   +'<div class="rel-log">';
  RUN.log.forEach(function(x){
   out+='<div class="rel-row'+(x.cleared?' cleared':'')+'">'
    +cr(x.band, (x.w0||0)*10, {size:'xs', raw:x.w0+' '+x.d,
       title:x.name+' · '+x.band+' · '+x.w0})
    +'<span>'+esc(x.name)+'</span><em>toward '+esc(x.opp||'no pole')+'</em></div>';});
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
     speaking pace. Both answer to the clock the run shows once it starts. */
  else out+='<div class="rel-fields">'
    +'<label class="rel-field"><span>Pace</span><input type="number" id="relpace" min="0.5" max="2" step="0.1" value="'
     +RUN.pace+'"></label>'
    +'<label class="rel-field"><span>Patterns</span><input type="number" id="reldose" min="1" max="'
     +LINES_PER_CH+'" step="1" value="'+RUN.dose+'"></label>'
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
  RUN.phase='opening';RUN.line=0;RUN.idx=0;RUN.pass=0;RUN.halted=false;RUN.paused=false;relStep();};
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
  if(RUN.paused){relHush();relRender();} else relStep();};
 if((b=document.getElementById('reldose')))b.onchange=function(){
  RUN.dose=Math.max(1,Math.min(LINES_PER_CH,Math.round(+this.value)||1));relRender();};
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
  var live=RUN.open&&!RUN.paused&&(RUN.phase==='opening'||RUN.phase==='run'
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
