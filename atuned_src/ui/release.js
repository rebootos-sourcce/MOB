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
/* THE CLOSING IS HIS SCRIPT NOW, round QH, 2 October. His words: "The AI
   voice says, congratulations, you finished your, number, your patterns.
   Tells you the number of patterns. That's your release. And which ones you
   reframe. And now relax for the next two minutes. Stay focused on what the
   body is doing. And then it takes you to your congratulations screen."

   So the closing is built off the run that just ended and is not a fixed
   list: the count is the release count where the list stopped, the same
   number that ticked down to nought on the run, and the reframes are the
   addresses whose reframe half was actually said, each named with the
   coherent opposite it was moved toward (CHILD's opp, the "toward" the
   finished card already prints). Nothing reframed is nothing said about it.

   "Relax" is the one word of his not typed: the house voice gate refuses it
   as category language, an outcome given as an instruction. "Rest" is the
   physical fact it stands for, and the second sentence is his nearly word for
   word. The book's three lines that stood here, "Stop the work. Stay where
   you are.", "The charge moves up the channel and out through the mouth." and
   "Notice which place answers.", gave way to his script; they are kept in
   this comment so they can come back as words if he asks.

   COOLING stays the one name every reader uses (the walker, the clock, the
   gates), and holds the closing of the run that is open: relPick sets it to
   the planned run's closing so the clock can price it before Begin, and
   relCoolDown sets it again to what the run actually did. */
var REL_REST='Now rest for two minutes. Stay with what your body is doing.';
var COOLING=[REL_REST];
var REL_SETTLE_S=120;
/* a list said the way a person says one: a, b and c */
function relAnd(a){
 return a.length<2?(a[0]||''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
/* WHICH ONES WERE REFRAMED, grouped by what they were moved toward, so eight
   addresses toward two opposites is two clauses and not eight. Past six names
   the sentence would be a list read out, so it says the count and the
   opposites instead. */
function relReframeSay(ref){
 if(!ref||!ref.length)return '';
 var by={}, order=[];
 ref.forEach(function(x){var o=String(x.opp||'').toLowerCase(); if(!o)return;
  if(!by[o]){by[o]=[]; order.push(o);}
  var nm=String(x.nm||'').toLowerCase(); if(nm&&by[o].indexOf(nm)<0)by[o].push(nm);});
 if(!order.length)return '';
 var names=order.reduce(function(s,o){return s+by[o].length;},0);
 if(names>6)return 'You reframed '+names+' addresses toward '+relAnd(order)+'.';
 /* the clauses take a comma before their and, or "fear and control toward
    trust and separation toward joy" reads as one list of four */
 var cl=order.map(function(o){return relAnd(by[o])+' toward '+o;});
 return 'You reframed '+(cl.length<2?cl[0]:cl.slice(0,-1).join(', ')+', and '+cl[cl.length-1])+'.';}
/* the closing of one run, read off its counts. t is relCounts' answer, halted
   is whether End was pressed. A run ended early is not congratulated on a
   finish it did not reach; it is told what it did. */
function relClosing(t,halted){
 var n=(t&&t.said)||0, u=n===1?' pattern':' patterns';
 var out=[halted?'You ended early. You released '+n+u+'.'
  :'Congratulations. You finished your release: '+n+u+'.'];
 var rf=relReframeSay(t&&t.ref); if(rf)out.push(rf);
 out.push(REL_REST);
 return out;}
/* THE DOSE, AS HE NAMES IT. "Do you want to release 25 left and right, 50 left
   and right, or 100 left and right." Three quick picks beside the number
   field, which stays: the field is what round IG ruled ("how many patterns"),
   the picks are what he reaches for, and both set the same RUN.dose. 50 is the
   book's and LINES_PER_CH's own number, but round LY moved the default to
   100, his own words, "defaults at one hundred": RUN.dose below opens there
   now, LINES_PER_CH is untouched since it is the printed card's own count and
   not a default. 100 runs past the fifty lines a printed card carries a side,
   which is safe because a pass past the head is a spoken repetition and the
   meter never sees it: the plan, and so the price, is the same at 25 as at
   100. The numbers are his words and are typed as his words. */
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
/* ============================================================
   THE REFRAME, IN HIS WORDS, round QM, 2 October. "The next set is the
   reframe, it's the I know that I am ... I know that I am and then the
   story, reframe of the release pattern. In the same order. In the same
   intensity descriptor. This is the portion that ... is the recharge."

   It settles PRIORITY.md U3, which was open: no reframe line on the run
   began "I know". The engine's stem, C3_TRUTH, "I now embody the truth that
   I am", stays the engine's, because the games and the knowledge cards read
   it and tests/engine.js holds it verbatim; the run says his register over
   it. So this is the reframe's half of the same construction the release
   half already has: REL_ENTRY rotates the release passes over the pattern,
   REF_ENTRY rotates the reframe passes over the reframe, both indexed by the
   same pass number, so pass 7 of the reframe sits on the same rung as pass 7
   of the release. He has given the reframe one entry and the table holds
   one; a second or third rung is a string added here, no code.

   THE SAME ORDER AND THE SAME INTENSITY ARE THE PLAN'S, not new arithmetic.
   An address runs left release, right release, left reframe, right reframe
   (CHAN), and a reframe block's head is the printed card's truth at the same
   line number as the release block it answers (meterNext opens the two in
   step), so "completely unsafe in the world" is answered by "safe", line for
   line, which is the card's own pairing.

   WHAT THE HEAD SAYS. A line on the engine's truth stem has the stem swapped
   for his, so the card's own words after "that I am" are untouched. An axes
   card's install is his written paragraph and opens on no stem; it is said
   after "I know that", with only its first letter lowered when it does not
   open on "I", so "I am safe in this body. ..." reads "I know that I am safe
   in this body. ..." and nothing of his paragraph is rewritten. */
var REL_KNOW='I know that I am ';
var REL_KNOW_PRE='I know ';
var REF_ENTRY=[REL_KNOW];
function relKnow(text){
 var t=String(text||'');
 if(!t||t.indexOf(REL_KNOW_PRE+'that ')===0)return t;
 if(typeof C3_TRUTH==='string'&&t.indexOf(C3_TRUTH)===0)return REL_KNOW+t.slice(C3_TRUTH.length);
 return REL_KNOW_PRE+'that '+(/^I\b/.test(t)?t:t.charAt(0).toLowerCase()+t.slice(1));}
/* what a reframe pass says after "I know that I am": the head's own words
   after the stem, cut at its first sentence and without the strict syntax's
   "at this address", so a pass is a breath long like the release's passes.
   An install that does not open on "I am" has no such words, and the pass
   names the coherent opposite the finished card already prints as "toward". */
function relRefTail(at,head){
 var t=String(head||'');
 if(t.indexOf(REL_KNOW)===0){
  var m=t.slice(REL_KNOW.length).split(/\.\s/)[0].replace(/\s+at this address\.?$/,'').replace(/\.$/,'').trim();
  if(m&&m.split(/\s+/).length<=8)return m;}
 var o=relOpp(at&&at.n); return o?'moving toward '+String(o).toLowerCase():'';}

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
         dose:100,pace:1,spokeMs:0,spokeW:0,
         t0:0,tEnd:0,pauseAt:0,pausedMs:0,tick:null,
         tally:null,hits:null,settleAt:0,settled:false,
         heavy:{},look:false,rerun:false,pick:[],studioLost:false,
         ask:false,said:null,skip:false,storyT:null,grp:'story',gfocus:0};
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
/* THE RERUN'S PLAN, 22.K17. The same addresses and channels, read through
   meterRerunPlan, which plans only lines already open. relBudget is not called
   here and that is the point of this function: a rerun is charged nothing, so
   the allowance cannot shorten it, and a person whose allowance is spent can
   still rerun everything they have opened, which DECISIONS.md rules "forever".
   RUN_MAX still caps it, because a run's length is a ceiling for the sake of
   the person sitting through it and has nothing to do with price. */
function relRerunPlan(q){
 var ids=(q||[]).map(function(n){return n.i;});
 var chans=CHAN.map(function(c){return c[0]+c[2];});
 /* ROUND OG: THE HEAVY LINES GO BACK IN. meterRerunOrder is meterRerunPlan, the
    opened line rule, with every line this record holds as heavy at those
    addresses put back at its place on the fifty, least tense first, inside the
    run's own order. It is still only lines already open, so the price above
    holds: the allowance is not read and nothing here is new ground. */
 return (typeof CURP!=='undefined'&&CURP&&typeof meterRerunOrder==='function')
  ?meterRerunOrder(CURP,ids,chans,RUN_MAX):[];}
/* NEW OR RERUN, picked on the panel and never by the panel. relPick always
   opens on new, because DECISIONS.md rules a rerun "a deliberate act rather
   than something that happens while somebody thinks they are opening
   something", so the only way into a rerun is the press below.
   The queue narrows to the addresses the rerun plan reaches. relCoolDown
   releases the charge at every address in the queue, and an address with
   nothing open, or one the cap cut off, would otherwise be released for free
   with no line said at it, which is new ground bought by the free route.
   RUN.pick holds what was picked so pressing New puts it all back. */
function relMode(rr){
 var pick=RUN.pick||[];
 RUN.rerun=!!rr;
 if(RUN.rerun){
  RUN.plan=relRerunPlan(pick);
  var on={}; RUN.plan.forEach(function(k){on[String(k).split(':')[0]]=1;});
  RUN.queue=pick.filter(function(n){return on[n.i];});}
 else {RUN.queue=pick.slice(); RUN.plan=relPlan();}
 RUN.proj=null; relRender();}
/* what the panel says before a rerun begins, which is the whole of its price
   and anything it leaves out of what was picked. Read off the plan it will
   run, so the sentence cannot describe a different rerun. */
function relRerunSay(){
 var pick=RUN.pick||[], none=pick.filter(function(n){return !relRerunPlan([n]).length;}).length;
 var cut=pick.length-none-RUN.queue.length;
 /* THE HEAVY LINES, said only when there are some, and counted off the same
    plan the rerun will run. hv is every line this record holds as heavy at the
    addresses picked, on the four channels; back is how many of those the plan
    carries, and the rest were cut by the run's ceiling. Without this the
    sentence above says a rerun is the last line on each channel, which stops
    being the whole of it the first time a line has been marked. */
 var ids={}, held=(typeof CURP!=='undefined'&&CURP&&CURP.meter&&CURP.meter.heavy)||[], inPlan={};
 pick.forEach(function(n){ids[n.i]=1;});
 (RUN.plan||[]).forEach(function(k){inPlan[k]=1;});
 var hv=held.filter(function(k){return ids[String(k).split(':')[0]];});
 var back=hv.filter(function(k){return inPlan[k];}).length, left=hv.length-back;
 return 'A rerun says the last line you opened on each channel again. It costs nothing and opens nothing new.'
  +(back?' '+back+(back===1?' line you marked heavy goes back in its place, least tense first.'
    :' lines you marked heavy go back in their places, least tense first.'):'')
  +(back&&left>0?' A run is full, so '+left+(left===1?' heavy line waits':' heavy lines wait')+' for the next one.':'')
  +(none?' '+none+(none===1?' address you picked has nothing open yet, so it is'
    :' addresses you picked have nothing open yet, so they are')+' left out.':'')
  +(cut>0?' A run is full, so '+cut+(cut===1?' more address waits':' more addresses wait')+' for the next one.':'');}
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
/* from, optional: { story_t }, the t of the story entry this run was planned
   from, so the answer to What changed can name it. Only a door that planned
   the run off an entry it just committed passes one; any other run has no
   story behind it and its answer carries none. */
function relPick(nodeIds,from){
 relHush();
 RUN.queue=nodeIds.map(function(i){return BY[i];}).filter(function(n){return n&&n.cf;});
 RUN.sec=0;RUN.idx=0;RUN.line=0;RUN.pass=0;RUN.cool=0;RUN.halted=false;
 RUN.phase='idle';RUN.done=false;RUN.log=[];RUN.freed=0;RUN.paused=false;
 RUN.proj=null;RUN.dq0=null;RUN.studioLost=false;
 relTicker(false);
 RUN.t0=0;RUN.tEnd=0;RUN.pauseAt=0;RUN.pausedMs=0;
 RUN.tally=null;RUN.hits=null;RUN.settleAt=0;RUN.settled=false;
 RUN.heavy={};RUN.look=false;
 RUN.pick=RUN.queue.slice(); RUN.rerun=false; RUN.reach=null; RUN.planN=0;
 RUN.resShown=false; RUN.ask=false; RUN.said=null; RUN.skip=false; RUN.storyT=(from&&typeof from.story_t==='string')?from.story_t:null;
 RUN.pace=Math.max(0.5,Math.min(2,Math.round(22/(RUN.speed||2.2))/10));
 RUN.plan=relPlan();
 /* the setup carousel opens on its first group, and on stories when any of
    what was picked came from one; the toggle is the person's after that */
 RUN.gfocus=0; RUN.grp=relGroups('story').some(function(g){return g.ei!=null;})?'story':'seat';
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
 if(!L)return {text:truth?REL_KNOW+String(relOpp(at.n)||at.n.k).toLowerCase()+'.':C3_STEM+String(at.n.k).toLowerCase()+'.',truth:truth};
 /* the reframe half in his register, see THE REFRAME, IN HIS WORDS */
 return {text:truth?relKnow(L.text):L.text,truth:truth,src:L.src};}
/* ============================================================
   THE PROMPT AND THE SCRIPT ARE TWO THINGS ON THE SCREEN, round QH.
   His words: "I'm letting go of believing, perceiving, thinking,
   behaving, acting, feeling. That's the prompt that needs to be
   separate. The script is dot, dot, dot, that I am. And then the
   release script."

   Read as a screen and not as a change to what is said, and that is a
   call made here rather than asked, because both readings were open. The
   voice still says every head statement whole, six channels and all, so
   a person with their eyes shut hears exactly what the book prints and
   tests/design.js still holds the screen to the voice word for word. What
   moves is where the eye finds the two halves: the six channels stand once
   above the carousel as the prompt, top and centre, and each line in the
   carousel starts at "... that I am", which is the script. The words of
   the prompt are still inside each line for a screen reader and for the
   gates, hidden from the eye only, because the prompt above already shows
   them. Repeating them a hundred rows deep was the blur he named.

   The reframe half gets the same seam on its own stem, C3_TRUTH, "I now
   embody the truth". A line that does not open on either stem (an axes
   card's written install, a pass) is shown whole, because there is no
   prompt inside it to lift out.
   ============================================================ */
var REL_THAT='that I am ';
function relStemPre(stem){return stem.slice(0,stem.length-REL_THAT.length);}
/* {pre, tail} when the line opens on a stem, else null. pre keeps its
   trailing space so pre+tail is the line exactly. */
function relSplit(text){
 var t=String(text||'');
 /* his reframe register first: "I know" is the prompt and "that ..." is the
    script, whatever follows "that", so an axes card's install said after
    "I know that" splits on the same seam as a card truth does */
 if(t.indexOf(REL_KNOW_PRE+'that ')===0)return {pre:REL_KNOW_PRE,tail:t.slice(REL_KNOW_PRE.length)};
 var stems=[typeof C3_STEM==='string'?C3_STEM:'',typeof C3_TRUTH==='string'?C3_TRUTH:''];
 for(var i=0;i<stems.length;i++){var s=stems[i];
  if(s&&s.slice(-REL_THAT.length)===REL_THAT&&t.indexOf(s)===0){
   var pre=relStemPre(s); return {pre:pre,tail:t.slice(pre.length)};}}
 return null;}
/* the line's text as the carousel draws it: the stem in a span the eye does
   not see, the script after it with its ellipsis drawn by the sheet */
function relLineHtml(text){
 var sp=relSplit(text);
 return sp?'<span class="rel-sr">'+esc(sp.pre)+'</span><span class="rel-tail">'+esc(sp.tail)+'</span>':esc(text);}
/* the prompt for the half a plan key is in */
/* The reframe's prompt is his "I know", the half of "I know that I am" that
   comes before the script, the same seam the release's six channels sit on. */
function relPrompt(at){
 var truth=at&&at.ch&&at.ch[2]==='truth';
 return {half:truth?'Reframe':'Release',truth:!!truth,
  text:truth?REL_KNOW_PRE.replace(/\s+$/,''):relStemPre(C3_STEM).replace(/\s+$/,'')};}
/* A PASS. On the release side the entries rotate over the pattern's name. On
   the reframe side it is the coherent state on its own, which is open
   question 3 answered with the document's own fallback: the engine carries
   his written install for the head of each block, and no table of embodied
   truths to rotate the passes through. The panel says so in one line. */
/* ROUND QM: the reframe's passes are his "I know that I am" over the reframe,
   on the same rung index as the release's, and no longer the opposite's bare
   name. relRefTail says why the words are the head's own. */
function relShort(at,i,head){
 if(at.ch[2]==='limit')
  return REL_ENTRY[(i-1)%REL_ENTRY.length]+String(at.n.k||'').toLowerCase()+'.';
 var t=relRefTail(at,head);
 return t?REF_ENTRY[(i-1)%REF_ENTRY.length]+t+'.':head;}
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
/* THE STUDIO VOICE is a choice inside the voice, never a second voice switch:
   with the voice off nothing is said by either. Signed in only, because the
   server answers only a session, and switched on by the person, because the
   browser voice is the default by ruling (ui/sound.js, THE STUDIO VOICE).
   studioLost is this run giving up on it after a failure, so one dead server
   costs one line and not one per line. A new run asks again. */
function relStudioOn(){
 if(!relVoiceOn()||RUN.studioLost||typeof studioCan!=='function'||!studioCan())return false;
 if(typeof authSession!=='function'||!authSession())return false;
 return !!(typeof CURP!=='undefined'&&CURP&&CURP.ui&&CURP.ui.studio===true);}
/* what each failure means for the run, in words. The server's own sentence
   for a 503 names a setting on the server, so it is not shown; a 401 is a
   sign in the server has ended, which ui/auth.js authCheck says on its own. */
function relStudioLostSay(st){
 if(st===503)return 'The studio voice is not switched on at the server yet, so this browser\'s voice reads the run.';
 if(st===429)return 'Today\'s studio voice lines are used up, so this browser\'s voice reads the rest of the run.';
 return 'The studio voice did not answer, so this browser\'s voice reads the rest of the run.';}
/* SAY ONE STEP, in whichever voice is on. The list is the server's 'list'
   style and everything around it is 'frame', the same split both apps
   already make by saying the frame slower. A studio failure falls back to the
   browser voice for this same line, so the line the person was waiting for is
   still said, and then for the rest of the run. */
function relSay(st,onend,onfail){
 if(!relStudioOn())return speak(st.text,RUN.pace,onend,onfail);
 var style=(st.kind==='head'||st.kind==='pass')?'list':'frame', tok=RUN.tok;
 return speakStudio(st.text,RUN.pace,style,onend,function(why){
  if(tok!==RUN.tok)return;
  RUN.studioLost=true;
  /* said and not redrawn: the switch still says what the person chose, and a
     redraw mid line would move the list under their eyes */
  status(relStudioLostSay(why),'fail');
  if(!speak(st.text,RUN.pace,onend,onfail)&&onfail)onfail(why);});}
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
 if(st.kind!=='welcome'&&relVoiceOn()&&relSay(st,function(ms){
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
/* relWrite, one address's share of the write, lives in engine/compute.js
   beside releaseWork, so a worked example's history (engine/exdepth.js) runs
   the same arithmetic the card does and there is still one copy of it. */
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
/* NO PERCENT ON A HEADLINE READING, round PQ, his words: "No, it doesn't
   need to be a percent. Just a number." DQ is exactly the headline reading
   the ruling names (the Field's rings, the glass bar, the Summary tile and
   the Compass centre all read it bare), and this row is where a person
   watches it move live while a run is open, so it is the one place the
   figure is seen counting in real time. It carried the sign anyway, which
   this file never swept because round PQ landed in a different session and
   release.js was not touched this round either (see the owner's own words,
   round PS in TASKS.md: "the release protocol has not been updated at all").
   Two decimals stay, for the reason above them; only the sign goes. */
function relShade(dq,dq0){
 if(dq==null||dq0==null)return '';
 return '<div class="rel-clock">'
  +'<div class="rel-fig"><span>DQ</span><b>'+dq.toFixed(2)+'</b></div>'
  +'<div class="rel-fig"><span>Down</span><b>'+Math.max(0,dq0-dq).toFixed(2)+'</b></div></div>';}
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
/* all: count the whole plan as said, which is what a run that reaches its end
   will have said. The setup reads it to price the closing before Begin.
   ref is the addresses whose reframe half has had a line said, each with the
   opposite it moves toward, for the closing's "which ones you reframed". */
/* ROUND QM: and each side apart, his "visual representations for left and
   right, how many have been released and how many have been recharged".
   side.L.rel is left release lines said, side.L.ref left reframe lines said,
   relOf and refOf what the plan holds, read off the same walk as the rest. */
function relCounts(all){
 var c={left:0,of:0,put:0,putOf:0,said:0,toward:[],ref:[],
  side:{L:{rel:0,ref:0,relOf:0,refOf:0},R:{rel:0,ref:0,relOf:0,refOf:0}}}, seen={};
 (RUN.plan||[]).forEach(function(k,i){
  var chk=String(k).split(':')[1]||'', truth=/truth$/.test(chk), sd=c.side[chk.charAt(0)==='R'?'R':'L'];
  var said=all?RUN.dose:RUN.phase==='run'?(i<RUN.idx?RUN.dose:(i===RUN.idx?RUN.pass:0)):0;
  if(truth){sd.ref+=said; sd.refOf+=RUN.dose;} else {sd.rel+=said; sd.relOf+=RUN.dose;}
  if(truth){c.putOf+=RUN.dose; c.put+=said;
   var n=BY[+String(k).split(':')[0]], o=relOpp(n);
   if(!all&&RUN.phase==='run'&&i<=RUN.idx&&o&&c.toward.indexOf(o)<0)c.toward.push(o);
   if(said>0&&n&&o&&!seen[n.i]){seen[n.i]=1; c.ref.push({nm:n.k,opp:o});}}
  else {c.of+=RUN.dose; c.said+=said;}});
 c.left=c.of-c.said;
 return c;}
/* the planned run's closing, so the clock prices the closing it will say */
function relClosePlan(){COOLING=relClosing(relCounts(true),false);}
/* FOUR MORE FIGURES, round LY. His words: "I get to have a total number of
   patterns I'm releasing this session, how many total number of reframes
   I'm adding the session, total number of patterns released, total number
   of patterns installed, over the history." Remaining and Installed already
   answered "how many left... I'm releasing and how many I'm adding"; these
   four are new. Session is c.of and c.putOf, the plan's own full size, read
   the same way Remaining and Installed already are, never kept by hand.
   History is CURP.meter.relLines and .truthLines, added to in relCoolDown,
   the same place Remaining and Installed's own numbers are earned. A worked
   example has a plan but no meter worth reading as a lifetime, so history
   is shown only on the person's own record. */
function relTally(c,live){
 if(!c||!c.of)return '';
 /* A ZERO IS A DASH. "0 patterns" reads nought of a thing where the slot has
    nothing to say yet. Round J13. */
 function fig(lbl,n,u){return '<div class="rel-fig"><span>'+lbl+'</span><b>'
  +(n?n+'<small> '+u+'</small>':'\u2013')+'</b></div>';}
 /* the person's own record only, the same guard relProject and relCoolDown
    already read S.who by, not a worked example's */
 var hist=(typeof S!=='undefined'&&S.who===0&&typeof CURP!=='undefined'&&CURP&&CURP.meter)?CURP.meter:null;
 /* ROUND QM. Released and recharged this session are on the two side panels
    now, one per side of the nerve, so this is what they do not say, on one
    centred row: how many are left, how big the session is, and the shadow
    reading counting down live (relShade's two, his "you should see SQ
    lowering in real time"). Under it, in one quiet line, what the reframes
    move toward and the lifetime pair from round LY. The word installed
    comes off the run (PRIORITY.md 22.K8, "do not use the earlier term
    installing"); recharged is his word for the reframe half. */
 var tw=c.toward.length?'Toward '+c.toward.join(', ').toLowerCase()+'.':'';
 var at=(hist&&(hist.relLines||hist.truthLines))?'All time: '+(hist.relLines||0)+' released, '+(hist.truthLines||0)+' recharged.':'';
 return '<div class="rel-clock rel-figs">'
  +fig('Remaining',c.left,c.left===1?'pattern':'patterns')
  +fig('This session',c.of+c.putOf,'lines')
  +(live&&live.dq!=null?'<div class="rel-fig"><span>DQ</span><b>'+live.dq.toFixed(2)+'</b></div>'
    +'<div class="rel-fig"><span>Down</span><b>'+Math.max(0,live.dq0-live.dq).toFixed(2)+'</b></div>':'')
  +'</div>'
  +((tw||at)?'<div class="rel-ct rel-figs-s">'+esc([tw,at].filter(Boolean).join(' '))+'</div>':'');}
/* THE CLOCK IN THE CORNER, round QM. Elapsed and Left sat in their own row
   under the counts and fell below the first screen once the list took the
   screen's height. They are the rail's companions, so they sit beside it:
   the small dial, the time run and the time left. relSecond still writes
   Elapsed by its id once a second. */
function relTopClock(){
 var total=relSecFrom(null), left=relSecFrom({phase:RUN.phase,line:RUN.line,idx:RUN.idx,pass:RUN.pass,cool:RUN.cool});
 return '<span class="rel-tclk">'+relDial(total?1-left/total:0)
  +'<span class="rel-tclk-f"><b id="relel">'+relMMSS(relElapsed())+'</b><em>elapsed</em></span>'
  +'<span class="rel-tclk-f rel-tclk-l"><b>'+relMMSS(left)+'</b><em>left</em></span></span>';}
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
   off Pause under a keyboard and off a Heavy mark mid press. It
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
 relTopSync();
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
/* HOW MUCH OF THE PLAN WAS TRULY SAID, as a count of plan entries from the
   front. An entry counts once one of its passes has been said, which is the
   same rule relCounts reads, and never while a pass is still being spoken. A
   run that reached its end has said all of them, and a card still on the
   opening has said none. This was not asked at all: End jumped to the
   cooldown, which committed RUN.plan whole and wrote the field at every
   address in the queue, so a person who pressed End on the first address of
   forty was charged for forty and shown forty addresses released. 2 October,
   the owner: "make sure there's an end or stop", and the rule that comes with
   it is that End charges what was released and nothing else. */
function relReach(){
 var n=(RUN.plan||[]).length;
 if(RUN.phase==='done')return RUN.reach==null?n:RUN.reach;
 if(RUN.phase!=='run')return 0;
 return Math.min(n,RUN.idx+(RUN.pass>0?1:0));}
/* WHAT END DID, IN PLAIN WORDS, on the card the run lands on. Said only when the
   run was cut short, and read off the figures the write used, never typed:
   reach and planN from relCoolDown, and added from the meter's own answer. A
   rerun is never charged, so it says so and does not print a charge that did
   not happen. */
function relEndNote(){
 if(!RUN.halted||RUN.reach==null||RUN.reach>=RUN.planN)return '';
 var rest=RUN.planN-RUN.reach, paid=(RUN.meter&&RUN.meter.added)||0;
 return '<div class="rel-note" id="relendnote">You ended this '+(RUN.rerun?'rerun':'release')+' early. '
  +RUN.reach+' of '+RUN.planN+(RUN.planN===1?' line was':' lines were')+' said. '
  +(RUN.rerun?'A rerun costs nothing. '
    :'You were charged for '+paid+' new '+(paid===1?'line':'lines')+', not for the whole plan. ')
  +'The other '+rest+(rest===1?' line was':' lines were')+' never started'
  +(RUN.rerun?'.':', so '+(rest===1?'it was':'they were')+' not charged.')+'</div>';}
/* ============================================================
   WHAT CHANGED. The System Congruency TDD, section 15, and the step
   CONGRUENCY-AUDIT.md found missing from every release path: "There is no
   'what changed?' step anywhere." The finished card asked nothing, so a
   release ended on Heavy, Done and Build a ritual and the record never heard
   whether anything moved.

   Five answers, none chosen, and Skip. The answer is written as evidence,
   one record per address this run worked, through releaseVerify in
   engine/journey.js and so through practiceDo and the boundary, and saved.
   A positive answer is never asked for and is not the default: Nothing
   changed and Not sure are kept exactly as cleanly as Something moved.

   SKIP RECORDS NOTHING, AND SO DOES LEAVING. The card has Done and Build a
   ritual on it the whole time, and leaving is never blocked. Skip, Done,
   Build a ritual, another release opened over it, or a page closed: none of
   them writes, because none of them is an answer, and the audit's scope
   asks for "a way past it that records nothing". Why the record does not
   hold a "skipped" is written at RV_METRIC in engine/practice.js. Skip says
   on the card that nothing was kept, so the press is never silent.

   One answer per run. Evidence is history, so a pressed answer is not
   rewritten; the next release is asked again.
   ============================================================ */
function relAskHtml(){
 if(!RUN.ask)return '';
 if(RUN.said||RUN.skip)return '<div class="rel-ask" id="relask"><div class="pm-eye">What changed?</div>'
  +'<div class="rel-sub" id="relsaid">'+(RUN.said?'You said: '+esc(RV_SAY[RUN.said]||RUN.said)+'. Kept on your record.'
   :'Skipped. Nothing was recorded.')+'</div></div>';
 return '<div class="rel-ask" id="relask"><div class="pm-eye" id="relaskh">What changed?</div>'
  +'<div class="seg" role="group" aria-labelledby="relaskh">'+RV_ANSWERS.map(function(k){
    return '<button type="button" data-relsaid="'+k+'" aria-pressed="false">'+esc(RV_SAY[k])+'</button>';}).join('')
  +'</div><div class="rel-sub">Your answer is kept with each address this release worked.</div>'
  +'<div class="rel-act"><button type="button" class="btn" data-relskip="1">Skip</button></div></div>';}
/* the one writer. Refuses by name, writes all of the run's addresses or none,
   saves, and says so if the save fails. Returns whether it was kept. */
function relAnswer(k){
 if(!RUN.ask||RUN.said||RUN.skip||!CURP)return false;
 var ids=(RUN.queue||[]).map(function(n){return n.i;});
 var r=releaseVerify(CURP.practice||null,k,ids,{story_t:RUN.storyT});
 if(!r.ok){
  if(typeof status==='function')status('Your answer was not kept. '+(r.errs[0]||''),'fail');
  return false;}
 CURP.practice=r.P; RUN.said=k;
 if(!pSave()&&typeof status==='function')
  status('This browser would not save. Your answer is on this card and not on your record.','fail');
 if(RUN.open&&RUN.phase==='done')relRender();
 if(typeof loopRepaint==='function')loopRepaint();
 return true;}
/* Skip: writes nothing, and says so on the card */
function relAskSkip(){
 if(!RUN.ask||RUN.said||RUN.skip)return;
 RUN.skip=true;
 if(RUN.open&&RUN.phase==='done')relRender();}
function relCoolDown(){
 if(RUN.done)return;
 /* where the walker stood, read before the phase moves off the list */
 var tally=relCounts();
 var planN=(RUN.plan||[]).length, reach=RUN.halted?relReach():planN;
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
 /* THE RESULTS SCREEN'S BEFORE, round QM, read here for the same reason the
    expression is: a figure that says what moved needs the figure before the
    write. The bank is what Imprints counts as Held, the vault what the Story's
    Vault counts, the marks what the ladder says is earned. */
 RUN.bank0=relBankN(); RUN.vault0=relVaultN(); RUN.marks0=relMarksNow();
 /* END CHARGES WHAT WAS REACHED. A run ended early keeps only the plan
    entries that had a pass said and the addresses those entries belong to,
    before anything reads the queue or the plan: the meter below, the write
    at every address, the log and the hits all read these two, so cutting
    them here is what keeps the money, the field and the card agreeing. An
    address with at least one line said is written whole, because the engine
    has one write per address and no half way state, and the book's own
    reason for End still running the cooldown holds for an opened address:
    the space has to be filled whichever way the run ended. An address the run
    never reached is not written and not charged. A run that reached its end
    has reach equal to the plan and nothing is cut. */
 RUN.reach=reach; RUN.planN=planN;
 if(reach<planN){
  var reached={}; RUN.plan.slice(0,reach).forEach(function(k){reached[String(k).split(':')[0]]=1;});
  RUN.queue=RUN.queue.filter(function(n){return reached[n.i];});
  RUN.plan=RUN.plan.slice(0,reach);}
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
 undoPush((RUN.rerun?'the rerun at ':'the release at ')+(RUN.queue.length?RUN.queue.length+' addresses':'no addresses'));
 var freed=0;
 RUN.queue.forEach(function(n){
  var w0=n.sq*10;                                   /* weights are 0 to 100 here */
  var m=relWrite(RUN.queue,n,w0);
  freed+=Math.abs(m.d);
  /* a line marked heavy during the run marks its address Heavy before the
     finished card is drawn. The person already said the body answered there,
     and asking again on the card would be asking twice. It stays a toggle. */
  var hv=relHeavyAt(n);
  RUN.log.push({node:n.i,name:n.k,band:n.b,fetter:n.cf,sq0:n.sq,
   opp:(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'',
   w0:Math.round(w0),d:m.d,w1:m.w1,cleared:(m.w1<=6),
   heavy:hv,felt:hv.length>0});});
 RUN.freed=freed;
 /* One pattern is one line: one channel over one address. Every line of the
    run is keyed, and only new ground spends the tier. */
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
  /* A RERUN IS RECORDED BY meterRerun AND NEVER BY meterRun, 22.K17. meterRun
     is the one writer of meter.unique, which is what the allowance counts, so
     the rerun goes round it rather than through it and relying on it to skip
     a repeated key. meterRerun refuses any key that is not already open, so
     a rerun plan gone stale opens nothing. fresh comes back empty, so
     releaseWork below lifts nothing, as it never has for ground already open. */
  RUN.meter=RUN.rerun?meterRerun(CURP,RUN.plan||[]):meterRun(CURP,RUN.plan||[]);
  /* THE LINES MARKED HEAVY ARE KEPT ON THE RECORD, round OG. RUN.heavy is keyed
     by plan index and pass and is gone when the card closes, so a mark made
     while a line was said reached the finished card and nothing after it. This
     is the one place that knows the run's keys have just been written, so the
     marks are folded to the line they were made on and handed to meterHeavy,
     which refuses any key the record has not opened and writes nothing else:
     a mark never costs, and never opens a line. A refusal is said, because a
     mark the person made that was not kept is a write that failed. */
  RUN.kept=(typeof meterHeavy==='function')?meterHeavy(CURP,relHeavyKeys()):null;
  if(RUN.kept&&RUN.kept.refused.length&&typeof status==='function')
   status(RUN.kept.refused.length+(RUN.kept.refused.length===1?' heavy mark was':' heavy marks were')
    +' not kept, because the line is not open.','fail');
  /* THE LIFETIME SPLIT, round LY: "total number of patterns released, total
     number of patterns installed, over the history." tally is read at the
     top of this function, before the write, off where the list actually
     stopped, so a run ended early adds only the lines actually said and not
     the whole plan it was shown; a rerun of ground already open still adds
     here, unlike meter.lines' own unique count, because a line spoken twice
     was spoken twice, the same reasoning lines itself already carries. */
  if(!CURP.meter)CURP.meter={lines:0,unique:[],first:null,last:null,giftAt:null,relLines:0,truthLines:0};
  CURP.meter.relLines=(CURP.meter.relLines||0)+tally.said;
  CURP.meter.truthLines=(CURP.meter.truthLines||0)+tally.put;
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
 /* A RUN THAT REACHED ITS END COUNTS AS THE DAY'S RITUAL, round KG, when a
    ritual is tracking one of these addresses. Here and nowhere else: this is
    after the worked example refusal, so a refused run marks nothing, and after
    the write, so no day is marked for a release that did not land. Stop comes
    through this same function with halted set, and "a stopped run does not
    count" is the rule avWatch already keeps for a rule's day, so halted marks
    nothing. A card closed mid run goes to relClose and never arrives here. */
 RUN.ritDone=(!RUN.halted&&typeof ritRelDone==='function')
  ?(ritRelDone(RUN.queue.map(function(n){return n.i;}))||0):0;
 /* and the after, once the write and the save have landed. A mark the run
    earned is one the ladder reads now and did not read before, so it is
    derived from the record and never awarded here. */
 compute(); RUN.bank1=relBankN(); RUN.vault1=relVaultN();
 RUN.marksNew=(function(a){var was={}; (RUN.marks0||[]).forEach(function(k){was[k]=1;});
  return a.filter(function(m){return !was[m.k];});})(relMarksNow(true));
 RUN.log.forEach(function(x){var n=BY[x.node]; x.sq1=n?n.sq:null;});
 /* THE COOLDOWN IS SPOKEN AFTER THE WRITE, never instead of it. End jumps
    here and does not skip it: an address opened and then abandoned is open
    territory, "whatever frequency the system encounters first will fill the
    space" (3656), so the cooldown runs out whichever way the run ended. The
    mark says which: a stop when End was pressed, the close when it ran out. */
 /* HIS CLOSING, read off what this run did: tally is where the list stopped,
    and halted says whether End stopped it. See THE CLOSING IS HIS SCRIPT NOW. */
 COOLING=relClosing(tally,RUN.halted);
 RUN.cool=0; RUN.paused=false;
 /* THE TWO MINUTES START WITH THE COOLDOWN, not after it: "meanwhile, keep
    your awareness inside your body". The cooldown's lines are said inside
    them. Leaving is never blocked; Done is on the card the whole time. */
 RUN.settleAt=Date.now(); RUN.settled=false; relTicker(true);
 /* WHAT CHANGED IS ASKED FROM HERE, after the write and only after it: a run
    refused on a worked example returned above and is never asked, and a run
    that wrote is asked once, on the finished card, with nothing chosen. */
 RUN.ask=!!(CURP&&RUN.queue.length); RUN.said=null; RUN.skip=false;
 relMark(RUN.halted?'halt':'close');
 /* THE RUN HAS ENDED, SOUNDED ONCE, AFTER THE WRITE LANDED. Here and not at the
    top: a run refused on a worked example returns above and never reaches
    this line, so a refusal is heard as the refusal and not as a finish. The
    room argument lets it through the release's own hold. */
 if(typeof sfx==='function')sfx('done',true);
 if(RUN.halted&&reach<planN&&typeof status==='function')
  status(RUN.rerun?'Rerun ended early. A rerun costs nothing.'
   :'Release ended early. You were charged only for the lines you reached.');
 syncCh();relRender();render();
 relStep();}
/* CANCEL BEFORE A RUN. Nothing has started, so there is nothing to undo and
   nothing charged: the meter is written in relCoolDown and nowhere else. */
function relCancel(){
 relClose();
 status('Release closed. Nothing was started and nothing was charged.');}
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
 /* ROUND QM: named Binaural tone, his word, because that is what it is, two
    tones one per ear (see THE BINAURAL TONE, SAID). The note stays the bare
    hertz in the seat's colour, which tests/functional.js holds it to; the
    line under the switches says what the two ears are hearing. */
 return accTog('Binaural tone','reltone',relToneOn(),hz?hz+' Hz':'',hz?seatCol(n.b):'');}
/* the voice's own switch, and where there is no voice there is no switch.
   Its note is the standing privacy line cut to its facts: which voice, and
   whether the words stay on this machine, said before the voice says a word. */
function relVoiceRow(){
 if(typeof voiceCan!=='function'||!voiceCan()||typeof accTog!=='function')return '';
 var v=voicePick();
 return accTog('Voice','relvoice',relVoiceOn(),
  !v?'':v.name+(v.localService?', on this machine':', a network service'));}
/* the studio voice's switch, under the voice's and only while the voice is on
   and a person is signed in, since it can do nothing otherwise. Its note is
   the same privacy line the voice row carries, cut to its facts: who says the
   words and what they are given. ElevenLabs is a company name, so the note
   says what it is in the same place (round PO). The Atüned server passes the
   line on and keeps a count of characters, never the line. */
function relStudioRow(){
 if(!relVoiceOn()||typeof studioCan!=='function'||!studioCan()||typeof accTog!=='function')return '';
 if(typeof authSession!=='function'||!authSession())return '';
 return accTog('Studio voice','relstudio',!!(CURP&&CURP.ui&&CURP.ui.studio===true),
  'ElevenLabs, a voice company, over the network. It gets each line and nothing about you.');}
function relBuzzRow(){
 if(typeof buzzCan!=='function'||!buzzCan()||typeof accTog!=='function')return '';
 return accTog('Vibration','relbuzz',relBuzzOn(),'');}
function relSwitches(n){return relVoiceRow()+relStudioRow()+relToneRow(n)+relBuzzRow();}
/* ============================================================
   THE LIST, IN FRONT OF THE PERSON. His words, 27 September: "For
   the letting go of believing list and the reframes, it needs to be
   a list. You need to be able to see the list right in front of you
   and read it, and you need to see the next word coming up. And I
   want to be able to cycle forward and backward and be able to flag
   the ones I felt were the most heavy. This isn't a flash image,
   this is a carousel from north to south."

   The card printed one line and replaced it whole on the next, so the
   only line a person could read was the one being said, and the next
   arrived unannounced four seconds later. It is a list now: every line
   of the address the run is on, top to bottom in the order the walker
   says them, the live line marked Now and the one after it marked Next
   directly under it.

   THE FOUR BUCKETS ARE THE PLAN'S OWN. "Bucketed from left and right
   channels for both masculine and feminine, from release and reframe"
   is CHAN above: left release, right release, left reframe, right
   reframe, and the pole of each side is relPole off C3_POLE. Nothing
   is grouped here that the plan did not already group. A bucket is one
   plan key and its RUN.dose lines, and the map over the list is the
   same four laid out the way the strips lay them out, left on the left.

   ONE ADDRESS AT A TIME. A whole run can be eight addresses at a
   hundred lines a block, three thousand two hundred rows, and the list
   would carry every one of them to show the few a person reads. It
   holds the address the run is on, and its foot is the first line of
   what comes after it, the next address or the cooldown, so at the
   seam the next line is still on screen.

   LOOKING NEVER MOVES THE RUN. The walker's place is RUN.idx and
   RUN.pass, and nothing in this section writes either. Scrolling, Back,
   Forward and the map move what is shown. RUN.look says the person has
   moved it, and while it is set the list stops following the live line,
   so somebody reading ahead is not pulled back every four seconds. Now
   puts it back.
   ============================================================ */
/* the plan entries of the address the walker is on, which are contiguous
   because meterPlan walks the queue address by address */
function relSpan(i){
 var P=RUN.plan||[];
 function a(j){return String(P[j]||'').split(':')[0];}
 var id=a(i), a0=i, a1=i+1;
 while(a0>0&&a(a0-1)===id)a0--;
 while(a1<P.length&&a(a1)===id)a1++;
 return {a0:a0,a1:a1,key:P[a0]+'/'+a1+'/'+RUN.dose};}
/* the eyebrow's words for a bucket, so a bucket is named one way everywhere */
function relBucket(ch){return (ch[2]==='truth'?'Reframe':'Release')+', '+ch[1].toLowerCase()+' channel';}
/* the key of the line after the live one, which may sit past this address */
function relNextKey(){
 if(RUN.pass+1<RUN.dose)return RUN.idx+':'+(RUN.pass+1);
 return RUN.idx+1<(RUN.plan||[]).length?(RUN.idx+1)+':0':'end';}
/* HEAVY, MARKED WHILE IT IS SAID. Round JO put a Felt mark on the finished
   card, one to an address, which comes after the fact and cannot say which
   line it was. This mark is on the line, keyed by plan index and pass, so a
   tap lights the row tapped and no other. "I give up fear." at pass 4 and at
   pass 7 are the same words at two moments, and which moment landed is what
   the person is telling us. Carried out as the distinct sentences, because
   that is what a ritual can use. */
function relHeavyAt(n){
 var out=[];
 Object.keys(RUN.heavy||{}).map(function(k){return k.split(':').map(Number);})
  .sort(function(a,b){return a[0]-b[0]||a[1]-b[1];})
  .forEach(function(ip){
   var at=relAt(ip[0]); if(!at||at.n!==n)return;
   var st=relStepAt(at,ip[1]); if(st&&out.indexOf(st.text)<0)out.push(st.text);});
 return out;}
/* THE LINE KEYS BEHIND THE MARKS. A mark is plan index and pass, and a pass is
   one more saying of the same line, so the record keeps the line and not the
   saying: the plan's key at that index, once each, in plan order. */
function relHeavyKeys(){
 var out=[], P=RUN.plan||[];
 Object.keys(RUN.heavy||{}).map(function(k){return +String(k).split(':')[0];})
  .sort(function(a,b){return a-b;})
  .forEach(function(i){var k=P[i]; if(k&&out.indexOf(k)<0)out.push(k);});
 return out;}
/* ============================================================
   SWIPE EITHER WAY, round QM. His words: "I can flag which patterns felt
   heaviest. Those heaviest I can swipe either way. I can swipe to keep.
   Either way those patterns get weighted heavier in my bank or in my
   shadow. Maybe it tells me the total, the weight on that chakra."

   THE CALL, made here and named in the report because his words leave it
   open: a swipe either way is the Heavy mark, the one concept, and the
   direction says which pile it is kept in. RIGHT IS BANK: the line is kept
   to be released again, which is what the bank is, what is still held. LEFT
   IS SHADOW: the line is weight still carried, which is what the shadow
   reading counts. Right reads as keep and forward on every list a thumb has
   swiped; left reads as set aside, which is where weight that did not move
   goes.

   WHAT EACH PILE DOES ON THE RECORD IS THE SAME, and that is said rather
   than dressed up. Both are kept through meterHeavy as a heavy line, so both
   come back in the next rerun at their place on the fifty, which is "weighted
   heavier". The engine has no per line shadow weight to write a left swipe
   into, and inventing one is the schema change that is his (Schema v2). So
   the pile is carried on the run and tallied per seat on the results screen,
   "the weight on that chakra", and nothing claims more than that.

   A tap is still Heavy, kept in the bank, and a tap on a marked line takes
   the mark off: round LY's "If I press it, it fills in red" holds. With a
   keyboard, Left and Right on a line are the two swipes.
   ============================================================ */
var REL_PILE={bank:'Bank',shadow:'Shadow'};
/* a mark's pile: 1 is a tap, which is the bank */
function relPileOf(v){return v==='shadow'?'shadow':'bank';}
function relMarkSet(k,pile,row){
 if(pile)RUN.heavy[k]=pile; else delete RUN.heavy[k];
 if(row){row.setAttribute('aria-pressed',String(!!RUN.heavy[k]));
  if(RUN.heavy[k])row.setAttribute('data-pile',relPileOf(RUN.heavy[k])); else row.removeAttribute('data-pile');
  var hv=row.querySelector('.rel-cr-hv'); if(hv)hv.textContent=RUN.heavy[k]?REL_PILE[relPileOf(RUN.heavy[k])]:'Heavy';}
 relHeavyHint();}
/* how many lines are in each pile, and at which seat, read off the marks */
function relPiles(){
 var o={bank:0,shadow:0,seat:{}};
 Object.keys(RUN.heavy||{}).forEach(function(k){
  var p=relPileOf(RUN.heavy[k]), at=relAt(+String(k).split(':')[0]); o[p]++;
  if(at&&at.n){var s=o.seat[at.n.b]||(o.seat[at.n.b]={bank:0,shadow:0}); s[p]++;}});
 return o;}
function relHeavyHint(){
 var e=document.getElementById('relhv'); if(!e)return;
 var P=relPiles(), k=P.bank+P.shadow;
 e.textContent=k?k+(k===1?' line':' lines')+' marked heavy: '+P.bank+' kept in your bank, '+P.shadow+' weighted in your shadow.'
  :'Tap or swipe a line that feels heavy. Swipe right to keep it in your bank, the lines still to release. Swipe left to weight it in your shadow, the load you still carry.';}
/* THE HEAVIEST, ON THE FINISHED CARD. "Note the patterns that felt heaviest.
   That's the work." The lines marked while they were said, each under the
   address it was said at, with the same double ring the list marks them with,
   so a line flagged on the run is recognised on the card. Nothing marked is
   nothing listed: an empty heading would read as a list that failed to load. */
function relHeaviest(){
 /* red, the same mark the carousel made it with, round LY */
 var rows='';
 (RUN.log||[]).forEach(function(x){(x.heavy||[]).forEach(function(tx){
  rows+='<div class="rel-row" style="grid-template-columns:auto 1fr">'
   +'<i aria-hidden="true" style="width:12px;height:12px;border-radius:50%;border:2px solid var(--alarm);'
   +'background:var(--alarm);box-shadow:0 0 0 2px var(--panel),0 0 0 3.5px var(--alarm);margin:0 4px"></i>'
   +'<span>'+esc(tx)+'<em style="display:block">'+esc(x.name)+'</em></span></div>';});});
 return rows?'<div class="pm-eye" style="margin-top:6px">Heaviest</div>'
  +'<div class="rel-log" style="max-height:none;overflow:visible">'+rows+'</div>':'';}
/* GRAPHIC SYMBOLS, round LY. His words: "turn the back now forward pause
   buttons into graphic symbols." Back and Forward are the arrows every other
   surface in this product already draws with (ritual.js's own ritIc carries
   the same two paths); Now is a ring around a filled centre, the shape a
   map already uses for where you are; Pause is two bars and End a filled
   square inside a ring, ritual.js's own stop mark, because a run that is
   over is a stop and not a pause held longer. Every button still carries an
   aria-label, so what changed is what is drawn and never what is announced. */
var REL_IC={
 back:'<path d="M15 5l-7 7 7 7"/>', fwd:'<path d="M9 5l7 7-7 7"/>',
 /* the carousel runs north to south, so its arrows do too, round QH */
 up:'<path d="M5 15l7-7 7 7"/>', down:'<path d="M5 9l7 7 7-7"/>',
 now:'<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/>',
 pause:'<path d="M9 5v14 M15 5v14"/>',
 /* Resume is not Pause struck through: a run held still asks to be moved,
    which is a play mark, the same triangle every other surface uses for it */
 play:'<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
 stop:'<circle cx="12" cy="12" r="8.5"/><path d="M9 9h6v6H9z" fill="currentColor" stroke="none"/>',
 /* the cancel mark, a ring and a cross, ring and not fill like every icon here */
 x:'<circle cx="12" cy="12" r="9"/><path d="M8.7 8.7l6.6 6.6M15.3 8.7l-6.6 6.6"/>'};
function relIc(k){
 return '<svg viewBox="0 0 24 24" class="rel-ic" aria-hidden="true">'+REL_IC[k]+'</svg>';}
/* its styles travel with it. The stylesheet in shell/head.html is not this
   file's, and every rule names two classes so the design gate's collision
   check, which reads a single class as a claim on that word, reads none of
   these as a second claim on .rel-line. */
function relCss(){
 if(document.getElementById('rel-cr-css'))return;
 var st=document.createElement('style'); st.id='rel-cr-css';
 st.textContent=[
  /* ============================================================
     THE CAROUSEL, round QH. His words, 2 October: "I do like Horizon.
     However, this needs to be more like a carousel. I want to be able to
     read what I'm letting go of in the moment. And then see the one above
     and below grayed out and then the ones above and below those ... almost
     blacked out. So there's a gradient."

     Horizon, the mockup he picked, is a near empty ground with one line
     set large and light. This keeps its ground and its type and turns the
     one line into a column that rolls north to south: the line being said
     sits on the centre of the list at full ink, the one either side of it
     at under half, the next ring out at a sixth, and everything past that
     at a twentieth, which on this ground reads as black. Four steps and
     not a mask, because a mask fades by where a row sits in pixels and the
     rows are not one height: the six channel statement is four lines and a
     pass is one, so a mask lit half a head statement and the next pass at
     once. The steps are counted in rows.

     WHAT MOVES AND WHAT DOES NOT. A row never changes size: the first cut
     of the list set the live row larger and the browser moved the list
     twenty one pixels on every line to hold a reader's place (the reason is
     kept below at NO ROW CHANGES SIZE). So the step is carried by opacity
     and a scale, both compositor only, over the element duration on the
     arriving curve, and the list itself glides one row on the same curve
     (relGlide). Nothing overshoots: a line read forty times a block must
     land and hold, not bounce. Reduced motion gets the end state, the steps
     and the jump, never a slower glide.
     ============================================================ */
  '.rel-card.rel-hz{width:min(640px,94vw);background:var(--bg)}',
  /* the bar Pause and End hold to is the card's own ground, or it reads as a
     second panel laid over the foot of the first */
  '.rel-card.rel-hz .rel-act-lr{background:var(--bg)}',
  '.rel-hd .rel-hdt .seg{display:inline-flex}',
  '.rel-cr{--ch:min(360px,44vh)}',
  '.rel-cr .rel-cr-hint{margin:6px 0 0;font-size:13px;color:var(--dim)}',
  /* A FEATHER AT THE TWO EDGES, and only there. The gradient is the steps,
     counted in rows; the feather is the window's own edge, so a row passing
     out of the list thins away over 24 pixels instead of being cut through
     its letters, measured at 390 where the head statement above the centre
     showed its lower half under the heading as a sliced line. The band
     under the sticky heading stays opaque, so the heading is never faded:
     --hh is the heading's own height, measured at 31 here and 29 on a phone. Paint
     only, so a row under the feather still takes the press. */
  '.rel-cr .rel-cr-l{position:relative;height:var(--ch);overflow-y:auto;overscroll-behavior:contain;',
  ' scrollbar-width:none;text-align:center;outline:none;--hh:31px;',
  ' -webkit-mask-image:linear-gradient(to bottom,#000 var(--hh),transparent var(--hh),#000 calc(var(--hh) + 24px),#000 calc(100% - 24px),transparent);',
  ' mask-image:linear-gradient(to bottom,#000 var(--hh),transparent var(--hh),#000 calc(var(--hh) + 24px),#000 calc(100% - 24px),transparent)}',
  '.rel-cr .rel-cr-l::-webkit-scrollbar{display:none}',
  '.rel-cr .rel-cr-l:focus-visible{box-shadow:0 0 0 2px var(--accent);border-radius:var(--r-s)}',
  /* the spacers, so the first line and the last can both sit on the centre */
  '.rel-cr .rel-cr-pad{height:calc(var(--ch) / 2 - 26px)}',
  '.rel-cr .rel-cr-h{position:sticky;top:0;z-index:1;padding:6px 12px;background:var(--bg);',
  ' font-size:11.5px;font-weight:600;color:var(--dim);text-align:center}',
  '.rel-cr .rel-cr-h em{font-style:normal;font-weight:400}',
  /* NO ROW CHANGES SIZE WHEN THE MARK MOVES. The first cut set the live row
     at 17 pixels against 15. At 390 the row it left wrapped one line fewer,
     above where a person reading ahead was looking, and the browser moved the
     list 21 pixels to hold their place, so the list twitched on every line
     while they read. Every row is set at the one size; the live one is told
     by the step, which takes up no room. */
  '.rel-cr .rel-cr-i{display:grid;grid-template-columns:60px 1fr 60px;gap:8px;align-items:center;width:100%;',
  ' min-height:52px;padding:8px 4px;border:0;border-radius:var(--r-s);background:transparent;color:var(--ink);',
  ' font:inherit;font-size:20px;line-height:1.45;font-weight:300;letter-spacing:-.005em;text-align:center;cursor:pointer;',
  ' opacity:.05;transform:scale(.88);',
  /* THE STEP LANDS WITH THE GLIDE. The rows changed ink on the element
     duration, 220, while the list glided on the surface duration, 320, so
     the line arriving reached full ink a hundred milliseconds before it
     reached the centre and read as two events, a light and then a move.
     Both are the surface duration on the arriving curve now, REL_GLIDE_MS
     and --t-surface being the same 320, so brightness and place land on
     the same frame. */
  ' transition:opacity var(--t-surface) var(--ease-out),transform var(--t-surface) var(--ease-out),',
  /* the swipe goes home on the landing curve, round QM, see relSwipeBind */
  ' translate var(--t-element) var(--ease-land);position:relative;touch-action:pan-y}',
  /* while a finger holds it the row follows one to one, so nothing eases */
  '.rel-cr .rel-cr-i.sw-held{transition:opacity var(--t-surface) var(--ease-out),transform var(--t-surface) var(--ease-out)}',
  /* the pile's word, behind the row on the side it is leaving, half ink until
     the swipe is past the line and full ink once letting go would keep it */
  '.rel-cr .rel-cr-i[data-sw]::after{position:absolute;top:50%;translate:0 -50%;font-size:12.5px;font-weight:600;',
  ' color:var(--alarm);opacity:.45;pointer-events:none;white-space:nowrap}',
  '.rel-cr .rel-cr-i[data-sw^="bank"]::after{content:"Bank";right:calc(100% + 10px)}',
  '.rel-cr .rel-cr-i[data-sw^="shadow"]::after{content:"Shadow";left:calc(100% + 10px)}',
  '.rel-cr .rel-cr-i[data-sw="bank"]::after,.rel-cr .rel-cr-i[data-sw="shadow"]::after{opacity:1}',
  '.rel-cr .rel-cr-i[data-d="0"]{opacity:1;transform:none}',
  '.rel-cr .rel-cr-i[data-d="1"]{opacity:.46;transform:scale(.95)}',
  '.rel-cr .rel-cr-i[data-d="2"]{opacity:.16;transform:scale(.91)}',
  /* NO HOVER LIFT. The first cut raised a row under the pointer to .72 so a
     line could be read before it was marked, and a pointer left resting over
     the list then lit a far row brighter than the line being said, measured
     at 390 under the spot Skip the opening had been pressed. A far line is
     read by scrolling to it, which puts it on the centre. */
  '.rel-cr .rel-cr-i:focus-visible{outline:2px solid var(--accent);outline-offset:-2px;opacity:1}',
  '.rel-cr .rel-cr-n{font-family:var(--num);font-size:11.5px;color:var(--dim);font-variant-numeric:tabular-nums}',
  '.rel-cr .rel-cr-i.now .rel-cr-n{color:var(--accent);font-weight:600}',
  '.rel-cr .rel-cr-end{cursor:default;color:var(--mid)}',
  /* THE SCRIPT AFTER THE PROMPT. The stem is in the line for the voice, the
     gates and a screen reader, and out of sight because the prompt above
     already shows it; the ellipsis is drawn, so it is never read as a word. */
  '.rel-cr .rel-sr,.rel-pr .rel-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}',
  '.rel-cr .rel-tail::before{content:"\\2026\\00a0";color:var(--dim)}',
  /* RED, AND IT FILLS, round LY. His words: "I want a red box on each one of
     those, or a red outline, that show heavy or not. If I press it, it fills
     in red." The mark is red at rest, an outline and not yet a claim, and
     pressing it fills the circle solid, the one fill in the product's ring
     only icon language, because this is a mark a person makes.

     AND THE LINE ON THE CENTRE SAYS SO IN A WORD, round QH: "I should be able
     to flag if one is heavy or not here too." The whole row was already the
     press, and nothing on it said so but a twelve pixel ring. The row on the
     centre carries the word Heavy beside its ring, so the line a person is
     reading is the line that tells them it can be marked. */
  '.rel-cr .rel-cr-m{display:inline-flex;align-items:center;justify-content:center;gap:6px}',
  '.rel-cr .rel-cr-f{width:12px;height:12px;border-radius:50%;border:1.5px solid var(--alarm);flex:none}',
  '.rel-cr .rel-cr-hv{display:none;font-size:12px;font-weight:600;color:var(--alarm)}',
  '.rel-cr .rel-cr-i[data-d="0"] .rel-cr-hv{display:inline}',
  '.rel-cr .rel-cr-i[aria-pressed="true"] .rel-cr-f{border-color:var(--alarm);background:var(--alarm);',
  ' box-shadow:0 0 0 2px var(--bg),0 0 0 3.5px var(--alarm)}',
  '.rel-cr .rel-cr-i[aria-pressed="true"] .rel-cr-t{color:var(--alarm)}',
  /* the live row's sentence carries .rel-line for the gates, and not its look */
  '.rel-cr .rel-line{margin:0;min-height:0;font-size:inherit;line-height:inherit;font-weight:inherit;color:inherit}',
  '.rel-cr .rel-cr-nav{display:flex;justify-content:center;margin:8px 0 2px}',
  /* THE PROMPT, top and centre. It changes twice an address, at the turn from
     release to reframe and back, and arrives on the element duration. */
  '.rel-pr{margin:2px auto 10px;max-width:540px;min-height:4.4em;text-align:center}',
  '.rel-pr span{display:block;font-size:11px;font-weight:600;letter-spacing:.06em;color:var(--dim);margin-bottom:4px}',
  '.rel-pr b{display:block;font-size:18px;line-height:1.5;font-weight:400;color:var(--ink);text-wrap:balance}',
  '.rel-pr.in{animation:relIn var(--t-element) var(--ease-out)}',
  '@keyframes relIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
  /* ============================================================
     THE SETUP CAROUSEL, round QH: "get rid of the text that says release
     your selections. I want this to show me the stories or the patterns
     that I'm about to release. I can ... toggle between story or chakra.
     It should have the number of patterns that are within those." The
     same column and the same four steps as the run, so the screen a
     person picks on is the screen they run on. It snaps, because a group
     is a thing to stop on and a line is not.
     ============================================================ */
  '.rel-gc{--gh:min(330px,42vh);position:relative;height:var(--gh);overflow-y:auto;overscroll-behavior:contain;',
  ' scroll-snap-type:y mandatory;scrollbar-width:none;margin:6px 0 0;outline:none;',
  ' -webkit-mask-image:linear-gradient(to bottom,transparent,#000 24px,#000 calc(100% - 24px),transparent);',
  ' mask-image:linear-gradient(to bottom,transparent,#000 24px,#000 calc(100% - 24px),transparent)}',
  '.rel-gc::-webkit-scrollbar{display:none}',
  '.rel-gc:focus-visible{box-shadow:0 0 0 2px var(--accent);border-radius:var(--r-s)}',
  '.rel-gc .rel-gpad{height:calc(var(--gh) / 2 - 40px)}',
  '.rel-gc .rel-gi{display:flex;flex-direction:column;align-items:center;gap:4px;width:100%;padding:12px 10px;',
  ' border:0;border-radius:var(--r-s);background:transparent;color:var(--ink);font:inherit;text-align:center;cursor:pointer;',
  ' scroll-snap-align:center;opacity:.05;transform:scale(.88);',
  ' transition:opacity var(--t-element) var(--ease-out),transform var(--t-element) var(--ease-out)}',
  '.rel-gc .rel-gi[data-d="0"]{opacity:1;transform:none;cursor:default}',
  '.rel-gc .rel-gi[data-d="1"]{opacity:.46;transform:scale(.95)}',
  '.rel-gc .rel-gi[data-d="2"]{opacity:.16;transform:scale(.91)}',

  '.rel-gc .rel-gi:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}',
  '.rel-gi .rel-gi-t{font-size:20px;line-height:1.4;font-weight:300;max-width:520px;text-wrap:balance;',
  ' display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
  '.rel-gi .rel-gi-s{font-size:12.5px;color:var(--dim);max-width:460px;line-height:1.45}',
  /* the names wrap as words, never as a clipped run: at 390 five addresses
     on one line ran out of both sides of the card */
  '.rel-gc .rel-gi{white-space:normal}',
  '.rel-gi .rel-gi-a{display:flex;flex-wrap:wrap;justify-content:center;column-gap:0;row-gap:2px;max-width:520px;',
  ' font-size:14px;font-weight:500;line-height:1.5}',
  '.rel-gi .rel-gi-a i{font-style:normal;color:var(--dim);margin:0 6px}',
  '.rel-gi .rel-gi-c{font-size:13px;color:var(--mid)}',
  '.rel-gi .rel-gi-c b{font-family:var(--num);font-variant-numeric:tabular-nums;font-size:22px;font-weight:500;color:var(--ink);margin-right:5px}',
  '.rel-gnav{display:flex;align-items:center;justify-content:center;gap:12px;margin:6px 0 2px}',
  '.rel-gnav .rel-gat{font-family:var(--num);font-size:12.5px;color:var(--dim);min-width:60px;text-align:center}',
  '.rel-gsum{font-size:13px;color:var(--dim);text-align:center;margin:4px 0 4px}',
  '.rel-gsum b{color:var(--ink);font-weight:500}',
  '.rel-ic{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;',
  ' stroke-linejoin:round;flex:0 0 auto}',
  /* PAUSE, END AND THE CANCEL CROSS ARE 44 TALL AND AT LEAST 44 WIDE, ON EVERY
     PHASE. They rendered blank on the welcome and the opening, measured 0 by
     0: this sheet was only appended by the run phase, so the icon had no size
     until the first line of the list, and a person who opened a release and
     wanted out had nothing to press. relRender appends it first now, whichever
     phase it draws. The label is words beside the mark, because a ring with a
     square in it is not a word a person has been told means End. */
  '.rel-act .rel-b{display:inline-flex;align-items:center;justify-content:center;gap:8px;',
  ' min-width:44px;min-height:44px;padding:0 16px}',
  '.rel-hd .rel-x{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;',
  ' width:44px;height:44px;margin:-8px -10px -8px 0;padding:0;border:0;border-radius:50%;',
  ' background:transparent;color:var(--mid);cursor:pointer}',
  '.rel-hd .rel-x:hover,.rel-hd .rel-x:focus-visible{background:var(--sunk);color:var(--ink);outline:none}',
  '.rel-hd .rel-x .rel-ic{width:24px;height:24px}',
  '.rel-hd .rel-hdt{flex:1 1 auto;text-align:left}',
  '.rel-card .rel-hd{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px}',
  /* ============================================================
     THE TWO MINUTES, ON THE SAME GROUND, round QH: "I think the two
     minute cooldown goes here as well ... And then it takes you to your
     congratulations screen." The closing lines roll on the same column
     the list rolled on, and the clock is one large ring that empties.
     It moves once a second and eases into each new place on the context
     duration, so at rest it ticks like a slow pulse, sixty a minute, which
     is the one motion on a screen whose whole instruction is to stay
     still. Reduced motion takes the place and not the ease.
     ============================================================ */
  '.rel-cl{display:flex;flex-direction:column;align-items:center;gap:6px;margin:10px 0 6px;min-height:150px;justify-content:center}',
  '.rel-cl .rel-cl-i{max-width:520px;font-size:15px;line-height:1.5;font-weight:300;color:var(--ink);opacity:.05;transform:scale(.9);',
  ' transition:opacity var(--t-element) var(--ease-out),transform var(--t-element) var(--ease-out)}',
  '.rel-cl .rel-cl-i[data-d="0"]{opacity:1;transform:none;font-size:22px}',
  '.rel-cl .rel-cl-i[data-d="1"]{opacity:.46;transform:scale(.95)}',
  '.rel-cl .rel-cl-i[data-d="2"]{opacity:.16;transform:scale(.91)}',
  '.rel-cl .rel-speak{margin:0;min-height:0}',
  '.rel-sd{position:relative;width:168px;height:168px;margin:14px auto 8px}',
  '.rel-sd svg{display:block;width:168px;height:168px}',
  '.rel-sd #relsetd{transition:stroke-dashoffset var(--t-context) var(--ease-out)}',
  '.rel-sd .rel-sd-c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}',
  '.rel-sd .rel-sd-c span{font-size:11px;font-weight:600;letter-spacing:.06em;color:var(--dim)}',
  '.rel-sd .rel-sd-c b{font-family:var(--num);font-variant-numeric:tabular-nums;font-size:30px;font-weight:300;color:var(--ink)}',
  /* A PHONE GETS ITS WIDTH BACK, not height. The running card pads 44 a side
     for strips 30 wide, so the list takes the 12 pixels of gutter between
     them, the rows set a size down, and the number column and the word Heavy
     give their room to the line: the ring stays, and the hint under the list
     says what it does. */
  /* and the groups take less height on a phone than on a desk, because Run
     release sits under them and has to stay on the first screen */
  '@media (max-width:520px){.rel-cr{--ch:min(330px,42vh)}.rel-cr .rel-cr-l{margin:0 -12px;--hh:29px}',
  ' .rel-gc{--gh:min(250px,31vh)}',
  ' .rel-cr .rel-cr-h{padding:5px 10px}',
  ' .rel-cr .rel-cr-i{font-size:17px;grid-template-columns:20px 1fr 20px;gap:6px;padding:8px 2px}',
  ' .rel-cr .rel-cr-n{visibility:hidden}',
  ' .rel-cr .rel-cr-i[data-d="0"] .rel-cr-hv{display:none}',
  ' .rel-pr b{font-size:16px}',
  ' .rel-gi .rel-gi-t{font-size:18px}',
  ' .rel-cl .rel-cl-i[data-d="0"]{font-size:19px}}',
  '@media (prefers-reduced-motion:reduce){.rel-cr .rel-cr-i,.rel-gc .rel-gi,.rel-cl .rel-cl-i,.rel-sd #relsetd{transition:none}',
  ' .rel-pr.in{animation:none}}',
  'body.punch .rel-cr .rel-cr-h{background:var(--bg)}',
  /* WHAT CHANGED. Five answers in one pressed group that wraps, so at 390 they
     fold onto two rows inside the card rather than running out of it. */
  '.rel-ask{margin:14px 0 8px;text-align:left}',
  '.rel-ask .seg{flex-wrap:wrap;flex:1 1 auto;margin:6px 0}',
  '.rel-ask .seg button{flex:1 1 auto}',
  '.rel-ask .rel-act{justify-content:flex-start;margin-top:4px}',
  /* ============================================================
     THE WHOLE SCREEN, round QM. See NO FRAME, THE WHOLE SCREEN above
     relStepNow for the account; these are its numbers.
     ============================================================ */
  '@property --rc{syntax:"<color>";inherits:false;initial-value:transparent}',
  '#rel.rel{background:var(--bg);-webkit-backdrop-filter:none;backdrop-filter:none}',
  /* #rel lives inside .app, so it takes its visibility back; everything else
     in the app stops painting while the release is up */
  'body.rel-on .app,body.rel-on #bgaura{visibility:hidden}',
  'body.rel-on #rel{visibility:visible}',
  '.rel-card.rel-fs,.rel-card.rel-fs.rel-running{position:absolute;inset:0;width:auto;max-height:none;padding:0;border:0;',
  ' border-radius:0;box-shadow:none;background:transparent;overflow:hidden;display:flex;flex-direction:column;text-align:center}',
  '.rel-fs>*{position:relative;z-index:1}',
  /* the far layer, the seat's light on the ground and the edges falling away */
  '.rel-fs>.rel-far{position:absolute;inset:-12%;z-index:0;pointer-events:none;',
  ' background:radial-gradient(52% 42% at 50% 40%,color-mix(in srgb,var(--rc) 14%,transparent) 0,transparent 72%),',
  '  radial-gradient(34% 44% at 10% 58%,color-mix(in srgb,var(--rc) 6%,transparent) 0,transparent 72%),',
  '  radial-gradient(34% 44% at 90% 58%,color-mix(in srgb,var(--rc) 6%,transparent) 0,transparent 72%),',
  '  radial-gradient(70% 46% at 50% 112%,color-mix(in srgb,var(--accent) 7%,transparent) 0,transparent 72%);',
  ' transition:--rc var(--t-context) var(--ease-out);animation:relBreath 2.1s var(--ease-breath) infinite alternate}',
  '.rel-fs::after{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;',
  ' background:radial-gradient(120% 96% at 50% 46%,transparent 55%,color-mix(in srgb,var(--sunk) 72%,transparent) 100%)}',
  '@keyframes relBreath{from{opacity:.82}to{opacity:1}}',
  /* six breaths a minute through the two minutes: five seconds each way */
  '.rel-fs.rel-resting>.rel-far{animation-duration:5s}',
  /* ---- the top: the word, the rail, the way out ---- */
  '.rel-top{flex:none;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:64px;padding:0 24px}',
  '.rel-word{justify-self:start;font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--mid)}',
  '.rel-topr{justify-self:end;display:flex;align-items:center;min-width:44px;min-height:44px}',
  '.rel-rail{display:flex;align-items:center;gap:14px}',
  '.rel-trk{position:relative;width:min(232px,34vw);height:12px;display:flex;align-items:center;justify-content:space-between}',
  '.rel-trk::before{content:"";position:absolute;left:3px;right:3px;top:50%;height:1px;background:color-mix(in srgb,var(--ink) 16%,transparent)}',
  '.rel-fill{position:absolute;left:3px;right:3px;top:50%;height:1px;margin-top:-.5px;background:var(--accent);',
  ' transform-origin:0 50%;transform:scaleX(var(--p,0));transition:transform var(--t-context) var(--ease-out)}',
  '.rel-dot{position:relative;z-index:1;display:block;width:7px;height:7px;border-radius:50%;',
  ' background:color-mix(in srgb,var(--ink) 24%,var(--bg));',
  ' transition:background var(--t-surface) var(--ease-out),transform var(--t-surface) var(--ease-land),box-shadow var(--t-surface) var(--ease-out)}',
  '.rel-dot.past{background:var(--accent)}',
  '.rel-dot.on{background:var(--accent);transform:scale(1.5);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 22%,transparent)}',
  '.rel-stepw{font-size:12.5px;font-weight:600;color:var(--ink);min-width:58px;text-align:left;white-space:nowrap}',
  '.rel-topr .rel-x{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;padding:0;border:0;',
  ' border-radius:50%;background:transparent;color:var(--mid);cursor:pointer;',
  ' transition:background var(--t-micro) var(--ease-out),color var(--t-micro) var(--ease-out)}',
  '.rel-topr .rel-x:hover,.rel-topr .rel-x:focus-visible{background:var(--sunk);color:var(--ink);outline:none}',
  '.rel-topr .rel-x .rel-ic{width:24px;height:24px}',
  '.rel-tclk{display:flex;align-items:center;gap:12px}',
  '.rel-tclk .rel-dial{width:28px;height:28px}',
  '.rel-tclk-f{display:flex;flex-direction:column;align-items:flex-start;line-height:1.15}',
  '.rel-tclk-f b{font-family:var(--num);font-variant-numeric:tabular-nums;font-size:15px;font-weight:500;color:var(--ink)}',
  '.rel-tclk-f em{font-style:normal;font-size:11px;color:var(--dim)}',
  '.rel-figs{flex-wrap:wrap;gap:12px 30px;margin:12px 0 4px}',
  '.rel-figs .rel-fig{align-items:center}',
  '.rel-figs .rel-fig small{font-size:12px;font-weight:400;color:var(--dim)}',
  '.rel-figs-s{font-family:var(--sans);margin:0 auto 6px;max-width:560px;line-height:1.5}',
  '.rel-fs #relhd .rel-plate{margin:8px 0 0}',
  '.rel-fs #relhd .rel-plate .rel-ct{display:block;margin-top:2px}',
  '.rel-fs .rel-scr{margin-top:6px}.rel-fs .rel-cr .rel-cr-nav{margin:2px 0 0}',
  '.rel-fs .rel-cr .rel-cr-hint{margin-top:4px}',
  '.rel-res .rel-gi-a{display:flex;flex-wrap:wrap;justify-content:center;row-gap:2px;font-size:14px;font-weight:500;line-height:1.5}',
  '.rel-res .rel-gi-a i{font-style:normal;color:var(--dim);margin:0 6px}',
  /* ---- the prompt, pinned between the rail and what scrolls ---- */
  '.rel-fs>.rel-pr{flex:none;width:100%;max-width:820px;margin:0 auto;padding:0 24px 8px;min-height:0}',
  /* THE PROMPT HOLDS ITS HEIGHT. At the turn into the reframe the six
     channels, two lines, become "I know", one, and everything under the
     prompt jumped up fifty pixels in one frame, measured at 35ms into the
     turn at 390. Two lines are reserved and the words sit on their middle,
     so the turn changes the words and nothing else moves. */
  '.rel-fs>.rel-pr b{font-size:clamp(17px,1.5vw,22px);min-height:3em;display:flex;align-items:center;justify-content:center}',
  '.rel-fs>.rel-pr.ref span{color:var(--au)}',
  /* ---- what scrolls, and the controls pinned under it ---- */
  '.rel-scroll{flex:1 1 auto;min-height:0;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;',
  ' padding:4px 24px 28px;display:flex;flex-direction:column;align-items:center}',
  '.rel-scroll>*{width:100%;max-width:720px;flex:none}',
  '.rel-scroll>.rel-mid{max-width:1160px}',
  '.rel-foot.rel-act{flex:none;display:flex;justify-content:center;align-items:center;gap:12px;flex-wrap:wrap;margin:0;',
  ' padding:12px 24px calc(20px + env(safe-area-inset-bottom,0px));background:linear-gradient(to top,var(--bg) 62%,transparent)}',
  '.rel-stage{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:min(52vh,500px)}',
  '.rel-fs .rel-human,.rel-fs .rel-stage>.rel-speak{font-size:clamp(22px,2.1vw,30px);line-height:1.5;margin:22px auto;',
  ' min-height:0;max-width:680px;color:var(--ink);font-weight:300;text-wrap:balance}',
  /* ---- the list with a side of the nerve either side of it ---- */
  '.rel-mid{display:grid;grid-template-columns:minmax(140px,210px) minmax(0,660px) minmax(140px,210px);',
  ' justify-content:center;align-items:center;column-gap:clamp(16px,3vw,52px)}',
  '.rel-mid>.rel-cr{min-width:0}',
  '.rel-fs .rel-cr{--ch:clamp(220px,calc(100dvh - 600px),460px)}',
  /* THE HEADINGS SCROLL WITH THEIR BLOCK on the full screen. Pinned, each
     needed an opaque band to hide the rows passing under it, and on the
     breathing ground that band read as a dark box laid over the light, the
     frame he asked to lose. The block is named by the lit side and the scrub
     now, so the heading can travel with its rows and the top edge is a plain
     feather like the bottom. */
  '.rel-fs .rel-cr .rel-cr-h{position:static;background:transparent}',
  '.rel-fs .rel-cr .rel-cr-l{--hh:0px}',
  '.rel-lr{display:flex;flex-direction:column;gap:16px;opacity:.5;transition:opacity var(--t-surface) var(--ease-out)}',
  '.rel-lr.on{opacity:1}',
  '.rel-lr-L{align-items:flex-end;text-align:right}.rel-lr-R{align-items:flex-start;text-align:left}',
  '.rel-lr-h{font-size:12px;font-weight:600;letter-spacing:.06em;color:var(--dim);transition:color var(--t-surface) var(--ease-out)}',
  '.rel-lr.on .rel-lr-h{color:var(--accent)}.rel-lr.on.ref .rel-lr-h{color:var(--au)}',
  '.rel-lr-m{display:flex;flex-direction:column;gap:3px;width:100%}',
  '.rel-lr-L .rel-lr-m{align-items:flex-end}.rel-lr-R .rel-lr-m{align-items:flex-start}',
  '.rel-lr-l{font-size:11px;font-weight:600;letter-spacing:.06em;color:var(--dim)}',
  '.rel-lr-n{font-family:var(--num);font-variant-numeric:tabular-nums;font-size:26px;font-weight:400;line-height:1.1;color:var(--ink)}',
  /* the bars grow outward from the list, so the two sides open like a pair */
  '.rel-lr-b{display:block;width:100%;height:3px;border-radius:2px;overflow:hidden;background:color-mix(in srgb,var(--ink) 10%,transparent)}',
  '.rel-lr-b i{display:block;height:100%;background:var(--accent);transform:scaleX(var(--p,0));',
  ' transition:transform var(--t-element) var(--ease-out)}',
  '.rel-lr-m.m-ref .rel-lr-b i{background:var(--au)}',
  '.rel-lr-L .rel-lr-b i{transform-origin:100% 50%}.rel-lr-R .rel-lr-b i{transform-origin:0 50%}',
  /* ---- the four blocks and the scrub ---- */
  '.rel-scr{margin:10px auto 0;max-width:560px;width:100%}',
  '.rel-scr-h{display:flex;font-size:11px;font-weight:600;letter-spacing:.06em;color:var(--dim)}',
  '.rel-scr-h span{flex:1;text-align:center}.rel-scr-h span+span{color:color-mix(in srgb,var(--au) 80%,var(--dim))}',
  '.rel-scr-t{position:relative;height:44px;overflow:clip}',
  '.rel-scr-sg{position:absolute;left:11px;right:11px;top:50%;height:6px;margin-top:-3px;display:flex;gap:3px}',
  '.rel-sg{position:relative;height:100%;border-radius:3px;background:color-mix(in srgb,var(--accent) 36%,transparent)}',
  '.rel-sg[data-half="ref"]{background:color-mix(in srgb,var(--au) 42%,transparent)}',
  '.rel-sg[data-half="end"]{background:color-mix(in srgb,var(--ink) 14%,transparent);min-width:3px}',
  '.rel-sg em{position:absolute;top:10px;left:0;right:0;font-style:normal;font-size:10.5px;color:var(--dim);text-align:center}',
  /* where the voice is: a tick moved by transform across the track's width */
  '.rel-scr-now{position:absolute;left:11px;right:11px;top:0;bottom:0;pointer-events:none;',
  ' transform:translateX(calc(var(--k,0) * 100%));transition:transform var(--t-surface) var(--ease-out)}',
  '.rel-scr-now::before{content:"";position:absolute;left:-1px;top:50%;width:2px;height:16px;margin-top:-8px;border-radius:1px;background:var(--ink)}',
  '.rel-scr input[type=range]{position:absolute;inset:0;width:100%;height:100%;margin:0;background:transparent;',
  ' -webkit-appearance:none;appearance:none;cursor:pointer;touch-action:none}',
  '.rel-scr input[type=range]::-webkit-slider-runnable-track{height:100%;background:transparent}',
  '.rel-scr input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;margin-top:11px;',
  ' border-radius:50%;border:2px solid var(--ink);background:var(--bg);box-shadow:0 0 0 4px color-mix(in srgb,var(--bg) 70%,transparent)}',
  '.rel-scr input[type=range]::-moz-range-track{background:transparent}',
  '.rel-scr input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;border:2px solid var(--ink);background:var(--bg)}',
  '.rel-scr input[type=range]:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:var(--r-s)}',
  /* ---- the switches, one centred row ---- */
  '.rel-sws{display:flex;flex-wrap:wrap;justify-content:center;gap:2px 30px;margin:18px auto 0}',
  '.rel-fs .rel-sws .ac-tog,.rel-fs .rel-sws .ac-tog+.ac-tog{margin:0;padding:4px 0;border:0;min-height:0;gap:12px;text-align:left}',
  '.rel-bin{font-size:12.5px;line-height:1.55;color:var(--dim);max-width:520px;margin:8px auto 0}',
  /* ---- the setup's toggle on the centre line ---- */
  '.rel-fs .rel-hdt{display:flex;justify-content:center;margin:4px 0 2px}',
  '.rel-fs .rel-gc{--gh:clamp(220px,calc(100dvh - 540px),400px)}',
  /* ---- the results ---- */
  '.rel-res{display:flex;flex-direction:column;align-items:center;gap:4px;max-width:720px;margin:0 auto}',
  '.rel-res .rel-rs-hero{font-size:clamp(24px,2.3vw,32px);font-weight:500;line-height:1.3;text-wrap:balance;margin:8px 0 6px}',
  '.rel-rs{width:100%;margin:20px 0 2px;padding-top:18px;border-top:1px solid color-mix(in srgb,var(--ink) 9%,transparent)}',
  '.rel-rs-h{margin:0 0 12px;font-size:11.5px;font-weight:600;letter-spacing:.06em;color:var(--dim);text-align:center}',
  '.rel-rs-s{max-width:540px;margin:12px auto 0;font-size:13px;line-height:1.6;color:var(--dim)}',
  '.rel-rs-c{color:var(--mid)}',
  '.rel-rs-row,.rel-lrw{display:grid;grid-template-columns:1fr 1fr;column-gap:clamp(20px,6vw,72px)}',
  '.rel-lrw .rel-lr{opacity:1}',
  '.rel-rs-f{display:flex;flex-direction:column;align-items:center;gap:2px}',
  '.rel-rs-l{font-size:11px;font-weight:600;letter-spacing:.06em;color:var(--dim)}',
  '.rel-rs-n{font-family:var(--num);font-variant-numeric:tabular-nums;font-size:34px;font-weight:400;line-height:1.1;color:var(--ink)}',
  '.rel-rs-u{font-size:13px;color:var(--mid)}.rel-rs-w{font-size:12px;color:var(--dim)}',
  '.rel-rs-m{max-width:240px;margin-top:6px;font-size:12.5px;line-height:1.5;color:var(--dim)}',
  '.rel-seats{display:flex;flex-direction:column;gap:6px;max-width:440px;margin:14px auto 0}',
  '.rel-seat{display:grid;grid-template-columns:1fr auto;gap:2px 12px;align-items:baseline;padding:9px 14px;text-align:left;',
  ' border-radius:var(--r-s);background:color-mix(in srgb,var(--c) 8%,transparent)}',
  '.rel-seat b{font-weight:600;color:var(--c)}',
  '.rel-seat-w{font-family:var(--num);font-variant-numeric:tabular-nums;color:var(--ink)}.rel-seat-w i{font-style:normal;color:var(--dim)}',
  '.rel-seat-p{grid-column:1/-1;font-size:12px;color:var(--dim)}',
  '.rel-why{max-width:560px;margin:12px auto}.rel-why .rel-gi-a{justify-content:center;margin-top:6px}',
  '.rel-why-t{font-size:16px;line-height:1.5;font-weight:300;color:var(--ink);text-wrap:balance}',
  '.rel-why-t em{display:block;margin-top:2px;font-style:normal;font-size:12px;color:var(--dim)}',
  '.rel-rs-next{justify-content:center;margin:10px auto 0}',
  '.rel-res .rel-ask{width:100%;text-align:center}.rel-res .rel-ask .seg{justify-content:center}',
  '.rel-res .rel-ask .rel-act{justify-content:center}',
  '.rel-rs-d .rel-log{text-align:left}',
  /* A MARK EARNED LANDS LAST AND LANDS ONCE: after the headline has settled,
     out of rest with one overshoot, the landing curve. It is shown only when
     the ladder reads a mark it did not read before the run, so it is rare,
     and a rare thing may arrive with weight. */
  '.rel-mark{display:flex;align-items:center;gap:14px;max-width:480px;margin:12px auto 2px;padding:12px 18px;text-align:left;',
  ' border-radius:var(--r);border:1px solid color-mix(in srgb,var(--c) 55%,transparent);',
  ' background:color-mix(in srgb,var(--c) 7%,transparent);animation:relMarkIn var(--t-context) var(--ease-land) .36s both}',
  '@keyframes relMarkIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}',
  '.rel-mark-i{width:34px;height:34px;flex:none;fill:none;stroke:var(--c);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
  '.rel-mark-k{display:block;font-size:11px;font-weight:600;letter-spacing:.06em;color:var(--c)}',
  '.rel-mark b{display:block;font-size:18px;font-weight:600;color:var(--ink)}',
  '.rel-mark em{display:block;font-style:normal;font-size:13px;line-height:1.5;color:var(--mid)}',
  /* the results arrive as one story, top down, a sibling every 62ms */
  '.rel-res-in>*{animation:relUp var(--t-enter) var(--ease-enter) both}',
  '.rel-res-in>:nth-child(2){animation-delay:62ms}.rel-res-in>:nth-child(3){animation-delay:124ms}',
  '.rel-res-in>:nth-child(4){animation-delay:186ms}.rel-res-in>:nth-child(5){animation-delay:248ms}',
  '.rel-res-in>:nth-child(n+6){animation-delay:310ms}',
  '.rel-res-in>.rel-mark{animation:relMarkIn var(--t-context) var(--ease-land) .36s both}',
  '.rel-res:not(.rel-res-in) .rel-mark{animation:none}',
  '@keyframes relUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
  /* ---- a phone: the two sides sit side by side under the list ---- */
  '@media (max-width:760px){.rel-mid{grid-template-columns:1fr 1fr;column-gap:20px;row-gap:14px}',
  ' .rel-mid>.rel-cr{grid-column:1/-1;order:-1}',
  ' .rel-lr{gap:10px;opacity:.6}.rel-lr-n{font-size:22px}}',
  /* a phone drops the word, which the rail's own step word says again, and
     gives the rail the left and the clock or the cross the right */
  '@media (max-width:520px){.rel-top{height:52px;padding:0 12px 0 16px;grid-template-columns:1fr auto;column-gap:10px}',
  ' .rel-rail{justify-self:start;gap:10px}.rel-trk{width:min(150px,38vw)}',
  ' .rel-fs>.rel-pr{padding:0 14px 6px}.rel-scroll{padding:2px 14px 24px}',
  ' .rel-word{display:none}.rel-tclk-l{display:none}.rel-tclk{gap:8px}',
  ' .rel-fs .rel-cr{--ch:clamp(200px,calc(100dvh - 480px),380px)}',
  ' .rel-fs .rel-gc{--gh:clamp(200px,calc(100dvh - 600px),300px)}',
  ' .rel-foot.rel-act{padding:10px 12px calc(14px + env(safe-area-inset-bottom,0px));gap:8px}',
  ' .rel-sws{gap:0 18px}.rel-rs-n{font-size:28px}}',
  '@media (prefers-reduced-motion:reduce){.rel-fs>.rel-far{animation:none;transition:none}',
  ' .rel-fill,.rel-dot,.rel-lr,.rel-lr-b i,.rel-scr-now,.rel-cr .rel-cr-i{transition:none}',
  ' .rel-res-in>*,.rel-res-in>.rel-mark,.rel-mark{animation:none}}'].join('\n');
 document.head.appendChild(st);}
function relCar(sp){
 var rows='<div class="rel-cr-pad" aria-hidden="true"></div>', i, p;
 for(i=sp.a0;i<sp.a1;i++){
  var at=relAt(i); if(!at||!at.n)continue;
  var pole=relPole(at.ch[0]), nm=relBucket(at.ch);
  /* one line at 390, so the heading does not take a fifth of the list */
  /* ONE WRAPPER A BLOCK, round QM, so a heading is sticky only while its own
     block is on screen and the next block's heading pushes it off. In one
     shared container every heading stuck at the same top and, with the
     taller list of the full screen, two of them stood one over the other. */
  rows+='<div class="rel-cr-blk"><div class="rel-cr-h">'+esc(nm)+(pole?' <em>· '+esc(pole.nm.toLowerCase())+'</em>':'')+'</div>';
  for(p=0;p<RUN.dose;p++){
   var st=relStepAt(at,p);
   rows+=relRow(i+':'+p,p+1,st.text);}
  rows+='</div>';}
 /* THE FOOT. The next address's first line is a row like any other and can
    be marked; the closing is shown and is not the list, so it is not. */
 var nx=sp.a1<(RUN.plan||[]).length?relStepAt(relAt(sp.a1),0):null;
 rows+=nx
  ?'<div class="rel-cr-blk"><div class="rel-cr-h">Next address, '+esc(nx.at.n.k)+'</div>'+relRow(sp.a1+':0',1,nx.text)+'</div>'
  :'<div class="rel-cr-blk"><div class="rel-cr-h">After the list</div>'
   +'<div class="rel-cr-i rel-cr-end" data-relh="end"><span class="rel-cr-n"></span>'
   +'<span class="rel-cr-t">'+esc(COOLING[0])+'</span><span></span></div></div>';
 rows+='<div class="rel-cr-pad" aria-hidden="true"></div>';
 /* the region is focusable so the arrow keys scroll it, and it is not
    aria-live: it changes on every line and would talk over the voice */
 /* THE MAP, THE TWO COLUMNS, IS GONE. Round LY, his words: "get rid of left
    feminine, right masculine, those two columns, release and reframe, those
    are unnecessary." The strips already carry the side, in colour and in the
    words on them. */
 return '<div class="rel-cr" id="relcar" data-span="'+esc(sp.key)+'">'
  +'<div class="rel-cr-l" id="relcarl" tabindex="0" role="region" aria-label="The list">'+rows+'</div>'
  +relScrubHtml(sp)
  +'<div class="rel-cr-nav"><span class="seg" role="group" aria-label="Move the list">'
  +'<button type="button" id="relback" aria-label="Back">'+relIc('up')+'</button>'
  +'<button type="button" id="relnow" aria-pressed="true" aria-label="Now">'+relIc('now')+'</button>'
  +'<button type="button" id="relfwd" aria-label="Forward">'+relIc('down')+'</button></span></div>'
  +'<div class="rel-cr-hint" id="relhv"></div></div>';}
/* one line of the list. data-pile carries which pile a heavy mark is in, so
   the sheet can tint it and the word beside the ring can say it. */
function relRow(k,num,text){
 var v=RUN.heavy[k], pile=v?relPileOf(v):'';
 return '<button type="button" class="rel-cr-i" data-relh="'+k+'" aria-pressed="'+!!v+'"'+(pile?' data-pile="'+pile+'"':'')+'>'
  +'<span class="rel-cr-n">'+num+'</span><span class="rel-cr-t">'+relLineHtml(text)+'</span>'
  +'<span class="rel-cr-m" aria-hidden="true"><i class="rel-cr-f"></i><span class="rel-cr-hv">'+(pile?REL_PILE[pile]:'Heavy')+'</span></span></button>';}
/* ============================================================
   THE TWO PASSES, DRAWN, AND THE SCRUB ON THEM, round QM.

   His words: "we do the escalation of the story for one side of the nerve
   and then we do the next side of the story for the opposite side of the
   nerve, that is a release ... the next set is the reframe ... in the same
   order." The plan already runs exactly that at every address, left release,
   right release, left reframe, right reframe (CHAN), and the screen only said
   it in a sticky heading that scrolls away. So the address's four blocks are
   one rail under the list, each segment as wide as its share of the rows,
   the release pair in one tone and the reframe pair in the recharge's, a
   tick where the voice is, and the words for each half over it.

   AND THE RAIL IS THE SCRUB. "I can interrupt the scroll, scrub through it."
   Back and Forward moved the list one row at a time; a finger on this rail
   puts the list anywhere in the address at once, the way a timeline scrubs.
   It is a range input, so a keyboard, a screen reader and a thumb all get it
   for nothing. Scrubbing is looking: it sets RUN.look like every other hand
   on the list, the walker does not move, and Now puts the list back on the
   line being said. Its value is the row on the centre, kept in step by
   relCarFocus, so the thumb and the list never disagree.
   ============================================================ */
function relScrubHtml(sp){
 var segs='', n=(sp.a1-sp.a0)*RUN.dose+1, i;
 for(i=sp.a0;i<sp.a1;i++){var at=relAt(i); if(!at)continue;
  segs+='<i class="rel-sg" data-half="'+(at.ch[2]==='truth'?'ref':'rel')+'" style="flex:'+RUN.dose+'">'
   +'<em>'+(at.ch[0]==='L'?'left':'right')+'</em></i>';}
 segs+='<i class="rel-sg" data-half="end" style="flex:1"></i>';
 return '<div class="rel-scr">'
  +'<div class="rel-scr-h" aria-hidden="true"><span>Release</span><span>Reframe, the recharge</span></div>'
  +'<div class="rel-scr-t"><div class="rel-scr-sg" aria-hidden="true">'+segs+'</div>'
  +'<i class="rel-scr-now" id="relscrnow" aria-hidden="true"></i>'
  +'<input type="range" id="relscrub" min="0" max="'+(n-1)+'" step="1" value="0" '
  +'aria-label="Scrub through this address\'s lines. The run keeps its place."></div></div>';}
/* ONE GLIDE, the list's own scroll on the arriving curve. The browser's
   smooth scroll has its own length and its own curve and neither is ours to
   set, so the list could not be timed against the steps it carries. This is
   the element duration's big brother, the surface duration, on a quintic
   out, which is the arriving curve's shape near enough to read as one. A
   wheel or a drag stops it, because the person has taken the list. */
var REL_GLIDE_MS=320;
function relGlide(L,top){
 top=Math.max(0,Math.min(Math.round(top),L.scrollHeight-L.clientHeight));
 if(L._gl){cancelAnimationFrame(L._gl); L._gl=0;}
 var from=L.scrollTop, d=top-from;
 if((typeof REDUCED!=='undefined'&&REDUCED)||Math.abs(d)<1||typeof requestAnimationFrame!=='function'){L.scrollTop=top;return;}
 var t0=0;
 function f(now){
  if(!t0)t0=now;
  var k=Math.min(1,(now-t0)/REL_GLIDE_MS), e=1-Math.pow(1-k,5);
  L.scrollTop=from+d*e;
  L._gl=k<1?requestAnimationFrame(f):0;}
 L._gl=requestAnimationFrame(f);}
function relScroll(L,top,smooth){
 if(smooth)relGlide(L,top);
 else {if(L._gl){cancelAnimationFrame(L._gl); L._gl=0;} L.scrollTop=Math.max(0,top);}}
/* the rows of a list, kept on the list, because the list is only rebuilt at
   a new address and a querySelectorAll per scroll frame is what this saves */
function relCarRows(L){return L._rows||(L._rows=[].slice.call(L.querySelectorAll('.rel-cr-i')));}
/* the row whose middle is nearest the middle of the list */
function relCarMid(L){
 var R=relCarRows(L), c=L.scrollTop+L.clientHeight/2, best=0, bd=1e9;
 for(var j=0;j<R.length;j++){var r=R[j], dd=Math.abs(r.offsetTop+r.offsetHeight/2-c);
  if(dd<bd){bd=dd;best=j;}}
 return best;}
/* THE GRADIENT. Two rows either side of the focus carry their step, every
   other row carries none and sits at the far step by the sheet's default,
   so a line change writes at most ten attributes and never two hundred. */
function relCarFocus(L,k){
 var R=relCarRows(L), o=L._f;
 if(o===k)return; L._f=k;
 var j;
 if(o!=null)for(j=o-2;j<=o+2;j++)if(R[j])R[j].removeAttribute('data-d');
 for(j=k-2;j<=k+2;j++)if(R[j])R[j].setAttribute('data-d',String(Math.abs(j-k)));
 /* the scrub's thumb is the row on the centre, unless a finger is on it */
 var sc=document.getElementById('relscrub');
 if(sc&&!sc._held&&+sc.value!==k)sc.value=String(k);}
/* the live tick on the scrub: where the voice is, as a share of the rows */
function relScrubLive(L,live){
 var t=document.getElementById('relscrnow'); if(!t||!L)return;
 var R=relCarRows(L), k=live?R.indexOf(live):-1;
 if(k<0){t.style.opacity='0';return;}
 t.style.opacity=''; t.style.setProperty('--k',(R.length>1?k/(R.length-1):0).toFixed(4));}
/* ONLY THE LIVE ROW CARRIES .rel-line. tests/design.js holds every line it
   finds there to what the voice said and reads the first as the line being
   said, and tests/functional.js reads it the same way. Two hundred rows all
   carrying it would make the top row of the list "the line being said" for a
   whole block. So the class moves with the live mark, and the card still has
   exactly one line being said, which is the one the voice is saying. */
function relCarSync(smooth){
 var car=document.getElementById('relcar'), L=document.getElementById('relcarl'); if(!car||!L)return;
 var now=RUN.idx+':'+RUN.pass, nx=relNextKey(), live=null;
 car.querySelectorAll('[data-relh]').forEach(function(r){
  var k=r.getAttribute('data-relh'), ip=k.split(':'), i=+ip[0], p=+ip[1];
  var on=(k===now), nxt=(k===nx), t=r.querySelector('.rel-cr-t'), n=r.querySelector('.rel-cr-n');
  r.classList.toggle('said',k!=='end'&&(i<RUN.idx||(i===RUN.idx&&p<RUN.pass)));
  r.classList.toggle('now',on); r.classList.toggle('next',nxt);
  if(on){r.setAttribute('aria-current','step'); live=r;} else r.removeAttribute('aria-current');
  if(t)t.classList.toggle('rel-line',on);
  if(n)n.textContent=on?'Now':nxt?'Next':(k==='end'?'':String(p+1));});
 var nb=document.getElementById('relnow'); if(nb)nb.setAttribute('aria-pressed',String(!RUN.look));
 relHeavyHint(); relScrubLive(L,live);
 /* THE LIVE ROW ON THE CENTRE. It sat three tenths down so the line just
    said stayed above it and Next stayed whole under it; on a carousel the
    line said and the line coming are the two rows either side of the centre,
    and the spacers at both ends let the first line and the last sit there
    too. Looking never moves it: while the person holds the list the
    gradient follows their scroll and not the walker. */
 if(RUN.look||!live)return;
 relCarFocus(L,relCarRows(L).indexOf(live));
 relScroll(L,live.offsetTop+live.offsetHeight/2-L.clientHeight/2,smooth);}
/* one row back or forward from the row on the centre */
function relCarStep(d){
 var L=document.getElementById('relcarl'); if(!L)return;
 var R=relCarRows(L), k=Math.max(0,Math.min(R.length-1,relCarMid(L)+d)), r=R[k];
 if(!r)return;
 relCarFocus(L,k);
 relScroll(L,r.offsetTop+r.offsetHeight/2-L.clientHeight/2,true);}
function relCarLook(){
 var L=document.getElementById('relcarl');
 /* a hand on the list stops the glide where it is, so it never fights one */
 if(L&&L._gl){cancelAnimationFrame(L._gl); L._gl=0;}
 if(RUN.look)return; RUN.look=true;
 var nb=document.getElementById('relnow'); if(nb)nb.setAttribute('aria-pressed','false');}
/* bound once per list, on the list, because the list outlives the card
   around it for as long as the run stays on one address */
function relCarBind(){
 var car=document.getElementById('relcar'), L=document.getElementById('relcarl'); if(!car||!L)return;
 car.onclick=function(e){
  var t=e.target&&e.target.closest?e.target.closest('button'):null; if(!t||!car.contains(t))return;
  var k=t.getAttribute('data-relh');
  /* a swipe that just landed is not also a tap */
  if(k&&car._swiped){car._swiped=false; return;}
  if(k){ relMarkSet(k,RUN.heavy[k]?null:'bank',t); return; }
  if(t.id==='relnow'){RUN.look=false; relCarSync(true); return;}
  if(t.id==='relback'||t.id==='relfwd'){relCarLook(); relCarStep(t.id==='relfwd'?1:-1);}};
 /* what counts as the person moving the list: a wheel, a drag, a key, or a
    press on the scrollbar. Not the scroll event, which the list's own
    following fires too, and not a touch start, which is also how a row is
    marked. */
 L.addEventListener('wheel',relCarLook,{passive:true});
 L.addEventListener('touchmove',relCarLook,{passive:true});
 /* while the person holds the list the gradient follows their scroll, one
    measure a frame and only while they are looking */
 var raf=0;
 L.addEventListener('scroll',function(){
  if(!RUN.look||raf)return;
  raf=requestAnimationFrame(function(){raf=0; if(RUN.look)relCarFocus(L,relCarMid(L));});},{passive:true});
 /* space on a row presses the row; it only scrolls from the list itself.
    Left and Right on a row are the two swipes, so the piles are reachable
    without a finger. */
 L.onkeydown=function(e){
  var row=e.target&&e.target.closest?e.target.closest('[data-relh]'):null;
  if(row&&(e.key==='ArrowLeft'||e.key==='ArrowRight')&&row.getAttribute('data-relh')!=='end'){
   e.preventDefault(); relMarkSet(row.getAttribute('data-relh'),e.key==='ArrowRight'?'bank':'shadow',row); return;}
  if(/^(Arrow|Page|Home|End)/.test(e.key)||(e.key===' '&&e.target===L))relCarLook();};
 L.onpointerdown=function(e){if(e.target===L)relCarLook();};
 relSwipeBind(car,L);
 relScrubBind(L);}
/* ============================================================
   THE SWIPE, as physics. A row follows the finger one to one while it is
   held, because a line under a thumb that lags reads as a line that is
   heavy in the wrong sense. Past 64 pixels, a fifth of a phone's width and
   past where a tap's drift ever reaches, letting go keeps the mark; short of
   it the row goes home. Either way it goes home on the landing curve over
   the element duration, a small overshoot so the row reads as released by
   the hand and not snapped back by the machine. The translate property and
   not transform, because transform carries the brightness step's scale and
   the two must not fight.

   Horizontal only: the row is touch-action pan-y, so a vertical drag is
   still the list scrolling and a horizontal one is ours. A drag that starts
   vertical is the list's for its whole length. Compositor only while held;
   the one paint is the pile's word appearing behind the row.
   ============================================================ */
var REL_SWIPE_PX=64;
function relSwipeBind(car,L){
 var S0=null;
 function home(r){
  r.classList.remove('sw-held'); r.style.translate=''; r.removeAttribute('data-sw');}
 L.addEventListener('pointerdown',function(e){
  var r=e.target&&e.target.closest?e.target.closest('.rel-cr-i[data-relh]'):null;
  if(!r||r.getAttribute('data-relh')==='end'||e.button>0)return;
  S0={r:r,x:e.clientX,y:e.clientY,id:e.pointerId,on:false,dx:0};});
 L.addEventListener('pointermove',function(e){
  if(!S0||e.pointerId!==S0.id)return;
  var dx=e.clientX-S0.x, dy=e.clientY-S0.y;
  if(!S0.on){
   if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){S0=null;return;}
   if(Math.abs(dx)<10||Math.abs(dx)<Math.abs(dy)*1.5)return;
   S0.on=true; relCarLook(); S0.r.classList.add('sw-held');
   try{S0.r.setPointerCapture(e.pointerId);}catch(x){}}
  S0.dx=dx;
  /* past the line the row slows, so the threshold is felt as a give */
  var a=Math.abs(dx), m=a>REL_SWIPE_PX?REL_SWIPE_PX+(a-REL_SWIPE_PX)*0.35:a;
  S0.r.style.translate=(dx<0?-m:m).toFixed(1)+'px 0';
  S0.r.setAttribute('data-sw',a>=REL_SWIPE_PX?(dx>0?'bank':'shadow'):(dx>0?'bank-near':'shadow-near'));});
 function up(e){
  if(!S0||e.pointerId!==S0.id)return;
  var s=S0; S0=null;
  if(!s.on)return;
  car._swiped=true; setTimeout(function(){car._swiped=false;},400);
  if(Math.abs(s.dx)>=REL_SWIPE_PX)relMarkSet(s.r.getAttribute('data-relh'),s.dx>0?'bank':'shadow',s.r);
  home(s.r);}
 L.addEventListener('pointerup',up);
 L.addEventListener('pointercancel',function(e){if(S0&&e.pointerId===S0.id){home(S0.r); S0=null;}});}
/* the scrub, bound once per list. input is the finger moving; the list jumps
   rather than glides under it, because a glide behind a moving finger is a
   list that is always late. */
function relScrubBind(L){
 var sc=document.getElementById('relscrub'); if(!sc)return;
 function go(){
  var R=relCarRows(L), k=Math.max(0,Math.min(R.length-1,+sc.value||0)), r=R[k]; if(!r)return;
  relCarLook(); relCarFocus(L,k);
  relScroll(L,r.offsetTop+r.offsetHeight/2-L.clientHeight/2,false);}
 sc.addEventListener('input',go);
 sc.addEventListener('pointerdown',function(){sc._held=true;});
 ['pointerup','pointercancel','blur'].forEach(function(t){sc.addEventListener(t,function(){sc._held=false;});});}
/* ============================================================
   WHAT IS ABOUT TO BE RELEASED, GROUPED TWO WAYS, round QH.

   By story: each address picked is filed under the journal entry that
   put the most charge on it, read through the Field's own index of
   which entry reached which address (atomIndex in ui/wheel.js, the one
   parse of the journal the wheel already keeps), and under the entry the
   run was planned from when one was handed to relPick. An address no
   entry reached is filed under "Not from a story", never guessed into
   one.

   By seat: each address under its own seat, the word Imprints groups by,
   with the seat's own meaning sentence beside it from the gloss table,
   because a seat name with nothing beside it is the bare label the
   unpack ruling forbids. He said "chakra"; the product's one word for it
   is seat, and this keeps the one word.

   The count on each is patterns, the setup's own word for the dose: the
   release lines the plan will say at those addresses, read off the plan
   and never kept beside it, so an address the allowance cut off reads as
   not in this run rather than as a number it will not get. Both groupings
   are in the order the run will reach them.
   ============================================================ */
function relStoryOf(n){
 if(typeof S==='undefined'||S.who!==0||typeof atomIndex!=='function')return null;
 var L=(atomIndex()||{})[n.i]||[]; if(!L.length)return null;
 if(RUN.storyT){var m=L.filter(function(x){return x.t===RUN.storyT;})[0]; if(m)return m;}
 return L[0];}
function relClip(s,max){
 s=String(s||'').replace(/\s+/g,' ').trim(); if(s.length<=max)return s;
 var c=s.slice(0,max), sp=c.lastIndexOf(' ');
 return (sp>max*0.6?c.slice(0,sp):c).replace(/[\s,;:.]+$/,'')+'…';}
function relGroups(mode){
 var per={}, dose=RUN.dose||0, G=[], by={};
 (RUN.plan||[]).forEach(function(k){var b=String(k).split(':');
  if(!/truth$/.test(b[1]||''))per[b[0]]=(per[b[0]]||0)+dose;});
 (RUN.queue||[]).forEach(function(n){
  var key, g;
  if(mode==='seat')key='s:'+n.b;
  else {var e=relStoryOf(n); key=e?'e:'+e.ei:'none';
   if(!by[key])by[key]={key:key,ei:e?e.ei:null,t:e?e.t:null,text:e?e.text:'',ns:[],pats:0};}
  g=by[key]||(by[key]={key:key,b:n.b,ns:[],pats:0});
  if(G.indexOf(g)<0)G.push(g);
  if(g.ns.indexOf(n)<0){g.ns.push(n); g.pats+=per[n.i]||0;}});
 return G;}
function relDay(t){
 var d=new Date(t); if(isNaN(d.getTime()))return '';
 try{return d.toLocaleDateString('en-GB',{day:'numeric',month:'long'});}catch(e){return '';}}
function relGroupHtml(g,k){
 var t, s;
 if(g.b!=null&&g.ei===undefined){
  t='<span class="rel-gi-t" style="color:'+seatCol(g.b)+'">'+esc(g.b)+'</span>';
  s=(typeof unpSay==='function')?unpSay(g.b,'seat'):'';}
 else if(g.ei!=null){
  t='<span class="rel-gi-t">'+esc(relClip(g.text,140))+'</span>';
  s=relDay(g.t)?'Written '+esc(relDay(g.t)):'';}
 else {t='<span class="rel-gi-t">Not from a story</span>';
  s='Picked without a journal entry behind it.';}
 return '<button type="button" class="rel-gi" data-relgi="'+k+'">'+t
  +(s?'<span class="rel-gi-s">'+s+'</span>':'')
  +'<span class="rel-gi-a">'+g.ns.map(function(n){
    return '<span style="color:'+seatCol(n.b)+'">'+esc(n.k)+'</span>';}).join('<i aria-hidden="true">·</i>')+'</span>'
  +'<span class="rel-gi-c">'+(g.pats?'<b>'+g.pats+'</b>'+(g.pats===1?'pattern':'patterns'):'Not in this run')+'</span>'
  +'</button>';}
function relSetupCar(){
 var mode=RUN.grp==='seat'?'seat':'story', G=relGroups(mode);
 var pats=G.reduce(function(s,g){return s+g.pats;},0), q=RUN.queue||[];
 return '<div class="rel-gc" id="relgc" tabindex="0" role="region" aria-label="What this run will release, by '+mode+'">'
  +'<div class="rel-gpad" aria-hidden="true"></div>'
  +G.map(relGroupHtml).join('')
  +'<div class="rel-gpad" aria-hidden="true"></div></div>'
  +(G.length>1?'<div class="rel-gnav"><span class="seg" role="group" aria-label="Move the groups">'
   +'<button type="button" id="relgup" aria-label="Back">'+relIc('up')+'</button>'
   +'<button type="button" id="relgdn" aria-label="Forward">'+relIc('down')+'</button></span>'
   +'<span class="rel-gat" id="relgat" aria-live="polite"></span></div>':'')
  +'<div class="rel-gsum"><b>'+q.length+'</b>'+(q.length===1?' address, ':' addresses, ')
  +'<b>'+pats+'</b>'+(pats===1?' pattern':' patterns')+'. Each pattern is one line, said once.</div>';}
/* which group sits on the centre, the gradient on it, and the count under it */
function relGcSync(G){
 var R=[].slice.call(G.querySelectorAll('.rel-gi')); if(!R.length)return;
 var c=G.scrollTop+G.clientHeight/2, k=0, bd=1e9;
 R.forEach(function(r,j){var dd=Math.abs(r.offsetTop+r.offsetHeight/2-c); if(dd<bd){bd=dd;k=j;}});
 RUN.gfocus=k;
 R.forEach(function(r,j){var d=Math.abs(j-k);
  if(d<=2)r.setAttribute('data-d',String(d)); else r.removeAttribute('data-d');
  if(d===0)r.setAttribute('aria-current','true'); else r.removeAttribute('aria-current');});
 var a=document.getElementById('relgat');
 if(a)a.textContent=(RUN.grp==='seat'?'Seat ':'Story ')+(k+1)+' of '+R.length;}
function relGcTo(G,k,smooth){
 var R=G.querySelectorAll('.rel-gi'), r=R[Math.max(0,Math.min(R.length-1,k))]; if(!r)return;
 var top=r.offsetTop+r.offsetHeight/2-G.clientHeight/2;
 if(smooth&&G.scrollTo&&!(typeof REDUCED!=='undefined'&&REDUCED))G.scrollTo({top:top,behavior:'smooth'});
 else {G.scrollTop=top; relGcSync(G);}}
function relGcBind(){
 var G=document.getElementById('relgc'); if(!G)return;
 /* opened where the person last left it, at once and without a glide: a
    redraw for a new dose is not a move they made */
 relGcTo(G,RUN.gfocus||0,false);
 var raf=0;
 G.addEventListener('scroll',function(){ if(raf)return;
  raf=requestAnimationFrame(function(){raf=0; relGcSync(G);});},{passive:true});
 G.onclick=function(e){
  var t=e.target&&e.target.closest?e.target.closest('[data-relgi]'):null; if(!t)return;
  relGcTo(G,+t.getAttribute('data-relgi'),true);};
 G.onkeydown=function(e){
  if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;
  e.preventDefault(); relGcTo(G,(RUN.gfocus||0)+(e.key==='ArrowDown'?1:-1),true);};
 var u=document.getElementById('relgup'), d=document.getElementById('relgdn');
 if(u)u.onclick=function(){relGcTo(G,(RUN.gfocus||0)-1,true);};
 if(d)d.onclick=function(){relGcTo(G,(RUN.gfocus||0)+1,true);};}
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
/* the two minutes, as one large ring that empties with the time left in its
   middle, and the run's own elapsed time under it, stopped where the list
   stopped. relSecond moves the ring by its id once a second and reads the
   ring's length off it, so the size is said once, here. */
function relSettle(){
 var left=relSettleLeft(), r=72, C=2*Math.PI*r, off=C*(1-left/REL_SETTLE_S);
 return '<div class="rel-sd"><svg viewBox="0 0 168 168" aria-hidden="true">'
  +'<circle cx="84" cy="84" r="'+r+'" fill="none" stroke="var(--sunk)" stroke-width="3"/>'
  +'<circle id="relsetd" cx="84" cy="84" r="'+r+'" fill="none" stroke="var(--accent)" stroke-width="3" '
  +'stroke-linecap="round" transform="rotate(-90 84 84)" stroke-dasharray="'+C.toFixed(1)
  +'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg>'
  +'<div class="rel-sd-c"><span>Rest</span><b id="relset">'+relMMSS(left)+'</b></div></div>'
  +(RUN.t0?'<div class="rel-ct">The release took '+relMMSS(relElapsed())+'.</div>':'');}
/* THE CLOSING ON THE COLUMN. Each closing line in the same four steps the
   list rolled on, the one being said on the centre, so the run does not
   change screens when the list ends: it keeps rolling, into his closing and
   the two minutes. Only the line being said carries .rel-speak, which is the
   class the gates hold to the voice. */
function relClosingCol(){
 var cur=Math.min(RUN.cool,COOLING.length-1);
 return '<div class="rel-cl">'+COOLING.map(function(t,i){var d=Math.abs(i-cur);
   return '<div class="rel-cl-i'+(i===cur?' rel-speak':'')+'"'+(d<=2?' data-d="'+d+'"':'')+'>'+esc(t)+'</div>';}).join('')
  +'</div>';}
/* WHETHER THE TWO MINUTES ARE STILL THE SCREEN. From the end of the list
   until the clock runs out or the person skips it; the congratulations
   screen, the finished card, comes after. */
function relResting(){return RUN.phase==='done'&&!!RUN.settleAt&&!RUN.settled;}

/* ---- the counts the results screen reads, before the write and after ---- */
/* the bank: what Imprints prints as Held, an address at or over the line */
function relBankN(){
 return (typeof W!=='undefined'?W:[]).filter(function(n){return n.cf&&n.sq>=4;}).length;}
/* the vault: addresses with a line released on the record, the Story's own
   Vault count, read through its function so the two never disagree */
function relVaultN(){
 if(typeof stVaultRows==='function')return stVaultRows().length;
 var by={}; ((CURP&&CURP.meter&&CURP.meter.unique)||[]).forEach(function(k){by[String(k).split(':')[0]]=1;});
 return Object.keys(by).length;}
function relMarksNow(full){
 if(typeof ladderRead!=='function'||typeof CURP==='undefined'||!CURP)return [];
 try{var e=ladderRead(CURP,Date.now()).earned; return full?e:e.map(function(m){return m.k;});}catch(x){return [];}}

/* ============================================================
   NO FRAME, THE WHOLE SCREEN, round QM. His words: "I don't want a frame
   around anything. I want it to be the entire screen. You can keep the
   buttons organized center screen. Lay out the text so that it's
   symmetrical and evenly spaced."

   The same correction the onboarding took the same night (branch
   onboarding-real-skin, round QH), and the same three ideas so the two
   full screen surfaces read as one product and not two: the app is out of
   the picture rather than dimmed behind a card; the ground is one far layer
   of light that breathes on the Field's own wave; and a thin rail at the top
   says where the person is, with the way out beside it. The release does
   not borrow the onboarding's figure, because the release's centre is the
   list and not a body.

   THE FAR LAYER CARRIES DATA. Its light is the seat the run is on, so the
   room changes colour when the address does, over the context duration on
   the arriving curve (a registered colour property, so it is a crossfade
   and not a cut). It breathes on the Field's 4.2 second wave while the list
   runs, and on a ten second wave through the two minutes, six breaths a
   minute, which is the pace a resting body settles toward and the one motion
   on a screen whose instruction is to stay still. Opacity only, one layer,
   compositor work. Reduced motion takes the colour and not the breath.

   SYMMETRY. Everything sits on the centre line: the prompt, the list, the
   controls. The two sides of the nerve are the two sides of the screen, the
   left panel on the left and the right on the right, mirrored, each with its
   own released and recharged counts. On a phone the two panels sit side by
   side under the list, still left and right.
   ============================================================ */
var REL_STEPS=['Set up','Settle','Release','Rest','Results'];
function relStepNow(){
 if(RUN.phase==='welcome'||RUN.phase==='opening')return 1;
 if(RUN.phase==='run')return 2;
 if(RUN.phase==='done')return relResting()?3:4;
 return 0;}
/* how far along the rail the fill reaches: whole steps behind, and inside the
   list the share of the plan said, so the line moves while the list runs */
function relRailP(){
 var k=relStepNow(), w=0;
 if(k===2){var n=(RUN.plan||[]).length*RUN.dose; w=n?(RUN.idx*RUN.dose+RUN.pass)/n:0;}
 if(k===3)w=1-relSettleLeft()/REL_SETTLE_S;
 return Math.max(0,Math.min(1,(k+w)/(REL_STEPS.length-1)));}
function relTop(right){
 var k=relStepNow();
 return '<div class="rel-top" id="reltop">'
  +'<span class="rel-word">Release</span>'
  +'<div class="rel-rail" role="img" aria-label="Step '+(k+1)+' of '+REL_STEPS.length+', '+REL_STEPS[k]+'">'
  +'<span class="rel-trk"><i class="rel-fill" style="--p:'+relRailP().toFixed(3)+'"></i>'
  +REL_STEPS.map(function(_,i){return '<b class="rel-dot'+(i<k?' past':'')+(i===k?' on':'')+'"></b>';}).join('')+'</span>'
  +'<span class="rel-stepw">'+esc(REL_STEPS[k])+'</span></div>'
  +'<span class="rel-topr">'+(right||'')+'</span></div>';}
/* the rail moved in place on the list, so the fill glides on the context
   duration rather than being rebuilt at its new length every line */
function relTopSync(){
 var t=document.getElementById('reltop'); if(!t)return;
 var k=relStepNow(), f=t.querySelector('.rel-fill'), w=t.querySelector('.rel-stepw'), r=t.querySelector('.rel-rail');
 if(f)f.style.setProperty('--p',relRailP().toFixed(3));
 [].slice.call(t.querySelectorAll('.rel-dot')).forEach(function(d,i){
  d.classList.toggle('past',i<k); d.classList.toggle('on',i===k);});
 if(w&&w.textContent!==REL_STEPS[k])w.textContent=REL_STEPS[k];
 if(r)r.setAttribute('aria-label','Step '+(k+1)+' of '+REL_STEPS.length+', '+REL_STEPS[k]);}
/* the whole screen around a phase. pre sits between the rail and the part
   that scrolls, which is where the prompt lives on the list, so it never
   scrolls away; foot is the controls, pinned on the centre line. */
function relShell(o){
 return '<div class="rel-card rel-hz rel-fs'+(o.cls?' '+o.cls:'')+'" data-ph="'+esc(o.ph)+'">'
  +'<div class="rel-far" id="relfar" aria-hidden="true" style="--rc:'+(o.col||'var(--accent)')+'"></div>'
  +relTop(o.right)+(o.pre||'')
  +'<div class="rel-scroll" id="relsc">'+(o.body||'')+'</div>'
  +(o.foot?'<div class="rel-foot rel-act" id="relfoot">'+o.foot+'</div>':'')+'</div>';}
/* Pause and End, the same two on every phase that has them */
function relPauseEnd(){
 return '<button class="btn rel-b" id="relpause" aria-label="'+(RUN.paused?'Resume':'Pause')+'">'
  +relIc(RUN.paused?'play':'pause')+'<span>'+(RUN.paused?'Resume':'Pause')+'</span></button>'
  +'<button class="btn rel-b" id="relstop" aria-label="End">'+relIc('stop')+'<span>End</span></button>';}
/* the switches as one centred row, his "toggles for my options" */
function relSws(n){var s=relSwitches(n); return s?'<div class="rel-sws">'+s+'</div>'+relBinSay():'';}
/* ============================================================
   THE BINAURAL TONE, SAID. His words: "my binaural audio, that switches
   dynamically with the hertz of the pattern associated with the patterns
   I'm releasing."

   It was already that, and the screen did not say so. The bed in
   ui/sound.js has always been two sine tones, one per ear through a channel
   merger and never a pan, centred on the seat's own number, so the two ears
   differ by the beat and the beat is heard between them: theta, 6, under
   the release and alpha, 10, under the reframe. relTone moves it to each
   address's seat as the list reaches it. Nothing in the audio is rebuilt.
   What changes is the switch's name, Binaural tone, his word for it, and
   one line under the switches while it sounds, read off the oscillators
   themselves (bedState), so it can never claim a sound that is not playing.
   Every number carries its meaning beside it, the round PO ruling.
   ============================================================ */
function relBinSay(){
 if(typeof bedState!=='function')return '';
 var b=bedState(); if(!b.on||!b.carrier)return '';
 return '<div class="rel-bin" id="relbin">Left ear '+Math.round(b.carrier-b.beat/2)+' Hz, right ear '
  +Math.round(b.carrier+b.beat/2)+' Hz. Hz is how many times a second the tone shakes. The gap of '+b.beat
  +' is the slow pulse you hear between your ears, so use headphones.</div>';}
/* ============================================================
   THE TWO SIDES OF THE NERVE, ONE PANEL EACH. "We want visual
   representations for left and right, how many have been released and how
   many have been recharged." The strips that stood at the card's two edges
   said the side and nothing else. Each side is now a column: the strips' own
   words, "Left, inward" and "Right, outward" (REL_SIDE, the book's), and two
   meters, released and recharged, each a bar that fills as that side's
   lines are said, with the count beside it. The pole is not printed: round
   LY struck "feminine, parasympathetic" from the run by name. The live side
   is lit. A bar is scaleX on the compositor over the element duration on the
   arriving curve, so each line said is a small step on the side it was said
   on, and at the full dose a line is a hundredth of a bar, which is a creep
   and never a jump.
   ============================================================ */
function relSidePanel(s,c,live,truth){
 var d=(c&&c.side&&c.side[s])||{rel:0,ref:0,relOf:0,refOf:0};
 function bar(lbl,n,of,cls){
  return '<div class="rel-lr-m '+cls+'"><span class="rel-lr-l">'+lbl+'</span>'
   +'<b class="rel-lr-n">'+(n||'–')+'</b>'
   +'<span class="rel-lr-b"><i style="--p:'+(of?Math.min(1,n/of):0).toFixed(3)+'"></i></span></div>';}
 return '<div class="rel-lr rel-lr-'+s+(live===s?' on':'')+(live===s&&truth?' ref':'')+'" id="rellr'+s+'">'
  +'<div class="rel-lr-h">'+esc(REL_SIDE[s])+'</div>'
  +bar('Released',d.rel,d.relOf,'m-rel')+bar('Recharged',d.ref,d.refOf,'m-ref')+'</div>';}
/* move the panels' figures in place, so the bars glide rather than being
   rebuilt at their new width with nothing to animate from */
function relSideSync(c,live,truth){
 ['L','R'].forEach(function(s){
  var e=document.getElementById('rellr'+s); if(!e)return;
  var d=c.side[s]; e.classList.toggle('on',live===s); e.classList.toggle('ref',live===s&&!!truth);
  [['m-rel',d.rel,d.relOf],['m-ref',d.ref,d.refOf]].forEach(function(m){
   var r=e.querySelector('.rel-lr-m.'+m[0]); if(!r)return;
   var b=r.querySelector('.rel-lr-n'), i=r.querySelector('.rel-lr-b i');
   if(b)b.textContent=m[1]?String(m[1]):'–';
   if(i)i.style.setProperty('--p',(m[2]?Math.min(1,m[1]/m[2]):0).toFixed(3));});});}

/* ============================================================
   THE RESULTS, round QM. His list, in his order, each read off something
   the run or the record already holds, and nothing new computed to fill a
   slot: "visual representations for left and right, how many have been
   released and how many have been recharged ... How many patterns in your
   bank? How many patterns in your vault? How many patterns did you just
   release, or you just reframe, what shadow weight has adjusted ... do you
   want to run another session, we would recommend these, with a
   congratulations. If they get an achievement give them their achievement.
   We also let them know that certain rituals have been added to their
   queue. And we should have a why they're running the release in the
   patterns that they're releasing."

   WHAT IS AND IS NOT THERE, said plainly on the screen where it matters.
   The achievement is a mark from the ladder (engine/ladder.js MARKS), shown
   only when the ladder reads it now and did not before this run, so it is
   derived and never awarded. A ritual is never added to a queue by a
   release: what a release does is mark today done on any ritual already
   tracking one of its addresses (ritRelDone, round KG), and the screen says
   which of those it did, then names the practice the field calls for next
   (ritFor, the ritual page's own call) beside the one press that builds it.
   ============================================================ */
function relFig(lbl,n,u,was,mean){
 return '<div class="rel-rs-f"><span class="rel-rs-l">'+esc(lbl)+'</span>'
  +'<b class="rel-rs-n">'+(n==null?'–':n)+'</b>'
  +(u?'<span class="rel-rs-u">'+esc(u)+'</span>':'')
  +(was!=null&&was!==n?'<span class="rel-rs-w">was '+was+'</span>':'')
  +(mean?'<span class="rel-rs-m">'+esc(mean)+'</span>':'')+'</div>';}
function relSect(t,body,id){
 return '<section class="rel-rs"'+(id?' id="'+id+'"':'')+'><h3 class="rel-rs-h">'+esc(t)+'</h3>'+body+'</section>';}
function relResults(){
 var t=RUN.tally||{said:0,put:0,side:null}, out='';
 /* 1. the congratulations, and a mark if this run earned one */
 out+='<div class="pm-eye">Released</div>'
  +'<div class="rel-node rel-rs-hero">'+(RUN.halted?'':'Congratulations. ')
  +'You released '+t.said+(t.said===1?' pattern':' patterns')+' and recharged '+t.put+'.</div>'
  +relEndNote();
 (RUN.marksNew||[]).forEach(function(m){
  out+='<div class="rel-mark" style="--c:'+(typeof seatCol==='function'?seatCol(m.b):'var(--accent)')+'">'
   +'<svg viewBox="0 0 24 24" class="rel-mark-i" aria-hidden="true"><path d="'+esc(m.ic||'')+'"/></svg>'
   +'<span><span class="rel-mark-k">New mark</span><b>'+esc(m.nm)+'</b><em>'+esc(m.d)+'</em></span></div>';});
 /* 2. left and right, mirrored, the same panels the run counted on */
 if(t.side)out+=relSect('Left and right',
  '<div class="rel-lrw">'+relSidePanel('L',t,null)+relSidePanel('R',t,null)+'</div>'
  +'<div class="rel-rs-s">Released is a release line said, "I let go". Recharged is a reframe line said, "I know that I am".</div>');
 /* 3. the bank and the vault, now and before the run */
 out+=relSect('Your patterns','<div class="rel-rs-row">'
  +relFig('Bank',RUN.bank1,RUN.bank1===1?'address held':'addresses held',RUN.bank0,'What is still held in your body, waiting to be released.')
  +relFig('Vault',RUN.vault1,RUN.vault1===1?'address released':'addresses released',RUN.vault0,'Every address you have ever released, kept on your record.')
  +'</div>');
 /* 4. the shadow: DQ before and after, and the weight at each seat this run
    worked, before and after, with the heavy marks made there by pile */
 var seats={}, order=[], P=relPiles();
 (RUN.log||[]).forEach(function(x){
  if(!seats[x.band]){seats[x.band]={w0:0,w1:0}; order.push(x.band);}
  seats[x.band].w0+=+x.sq0||0; seats[x.band].w1+=(x.sq1==null?+x.sq0||0:+x.sq1);});
 var dqNow=RUN.dq0!=null?compute().DQ:null;
 out+=relSect('Shadow weight',
  relShade(dqNow,RUN.dq0)
  +'<div class="rel-rs-s">DQ is your shadow reading, the charge your body still holds. Down is how far this release moved it.</div>'
  +(order.length?'<div class="rel-seats">'+order.map(function(b){var s=seats[b], pb=P.seat[b]||{bank:0,shadow:0};
    return '<div class="rel-seat" style="--c:'+seatCol(b)+'"><b>'+esc(b)+'</b>'
     +'<span class="rel-seat-w">'+s.w0.toFixed(1)+' <i aria-hidden="true">→</i> '+s.w1.toFixed(1)+'</span>'
     +((pb.bank||pb.shadow)?'<span class="rel-seat-p">'+pb.bank+' to bank, '+pb.shadow+' to shadow</span>':'')+'</div>';}).join('')
   +'</div><div class="rel-rs-s">Weight at a seat is the charge held at the addresses this release worked there, added up. Each address reads nought to ten.</div>':''));
 /* 5. what changed, the TDD's own question, unchanged */
 out+=relAskHtml();
 /* 6. why this ran, and what it carried */
 var G=relGroups('story');
 if(G.length)out+=relSect('Why this release ran',G.map(function(g){
  var why=g.ei!=null?'“'+esc(relClip(g.text,160))+'”'+(relDay(g.t)?' <em>Written '+esc(relDay(g.t))+'</em>':'')
   :'Picked by hand, with no journal entry behind it.';
  return '<div class="rel-why"><div class="rel-why-t">'+why+'</div><div class="rel-gi-a">'+g.ns.map(function(n){
   return '<span style="color:'+seatCol(n.b)+'">'+esc(n.k)+'</span>';}).join('<i aria-hidden="true">·</i>')+'</div></div>';}).join(''));
 /* 7. rituals: what this run marked, and what to build next */
 var rd=RUN.ritDone||0, call=null;
 try{call=(typeof ritFor==='function')?ritFor(compute()).called:null;}catch(e){call=null;}
 out+=relSect('Your ritual',
  '<div class="rel-rs-s rel-rs-c">'+(rd?rd+(rd===1?' ritual tracking these addresses is':' rituals tracking these addresses are')+' done for today.'
   :(RUN.halted?'A release ended early does not count as a ritual done.':'No ritual was tracking these addresses, so none was marked done.'))
  +(call?' The practice your field calls for next is '+esc(call.nm)+', '+call.min+' minutes. Build a ritual puts it on your list.':'')+'</div>');
 /* 8. another session, and which addresses it would carry */
 var nx=(typeof relQueueOf==='function')?relQueueOf(6):[];
 if(nx.length)out+=relSect('Run another',
  '<div class="rel-rs-s rel-rs-c">The heaviest addresses you still hold are these. Run another release starts on them.</div>'
  +'<div class="rel-gi-a rel-rs-next">'+nx.map(function(n){
   return '<span style="color:'+seatCol(n.b)+'">'+esc(n.k)+'</span>';}).join('<i aria-hidden="true">·</i>')+'</div>');
 /* 9. the detail the card always carried: the heaviest lines, what the run
    reached, each address with its Heavy mark, and the expression */
 var cl=RUN.log.filter(function(x){return x.cleared;}).length;
 out+='<section class="rel-rs rel-rs-d"><h3 class="rel-rs-h">Every address</h3>'
  +'<div class="rel-sub">The heaviest ones are the work. Mark them.</div>'
  +relHeaviest()+relHitRows(RUN.hits)
  +'<div class="rel-sub">'+RUN.log.length+(RUN.log.length===1?' address, ':' addresses, ')
   +t.put+' recharged, '+cl+' read low, '+RUN.freed+' weight freed</div><div class="rel-log">';
 RUN.log.forEach(function(x,i){
  out+='<div class="rel-row'+(x.cleared?' cleared':'')+'">'
   +cr(x.band,(x.w0||0)*10,{size:'xs',raw:x.w0+' '+x.d,title:x.name+' · '+x.band+' · '+x.w0})
   +'<span>'+esc(x.name)+'<em style="display:block">toward '+esc(x.opp||'no pole')+'</em></span>'
   +'<span class="seg"><button type="button" data-relfelt="'+i+'" aria-pressed="'+(!!x.felt)
    +'" aria-label="Heavy at '+esc(x.name)+'">Heavy</button></span></div>';});
 var _now=compute(), _mv=_now.EX-(RUN.ex0||0), _left=exHeadroom(_now.EX);
 out+='</div><div class="rel-note">Expression '
  +(Math.abs(_mv)<0.05?'did not move.':(_mv>0?'up ':'down ')+Math.abs(_mv).toFixed(1)+', now '+_now.EX.toFixed(1)+'.')
  +' '+(_left<1.5
   ?'Release has about '+_left.toFixed(1)+' points left to give you. The laws '
    +'hold expression down from here, and there are twenty one of them. '
    +'They move when you answer them, and when what you do changes.'
   :'Release has about '+_left.toFixed(1)+' points more in it before the laws '
    +'are the only thing holding expression down.')
  +'</div></section>';
 return out;}
function relRender(){
 /* the tone first, so the switch below prints what is sounding now */
 relTone();
 var h=document.getElementById('rel'); if(!h)return;
 if(!RUN.open){h.style.display='none';h.innerHTML='';document.body.classList.remove('rel-on');return;}
 h.style.display='flex';
 /* NO FRAME, round QM: the app is out of the picture while the release is up,
    not dimmed behind it, and the compositor stops drawing a Field nobody can
    see. The onboarding stage does the same with body.ob-on. */
 document.body.classList.add('rel-on');
 /* THE STYLES GO IN BEFORE ANY PHASE DRAWS. This was called only inside the run
    phase, so the welcome, the opening and the setup drew Pause and End with an
    unsized icon and nothing to press. See the 44 rule in relCss. */
 relCss();
 var st=relCur(), out='', kept=false;
 /* the room's light is the seat the run is on, or will start on */
 var at0=relNow(), col0=(at0&&at0.n&&typeof seatCol==='function')?seatCol(at0.n.b):'';
 /* END IS ON THE OPENING TOO, round OZ, his words: "I can't even end the
    screen now. Priority." The opening and the welcome carried Skip and Pause
    and nothing that left, so a person who did not want a release could only
    skip it into the list. Nothing has been released at this point, so End
    here closes without committing anything. */
 var openFoot='<button class="btn" id="relskip">Skip the opening</button>'+relPauseEnd();
 if(RUN.phase==='welcome'){
  /* HIS VOICE'S SLOT. The line is set at the size .rel-speak sets and does not
     carry that class, on purpose: .rel-speak and .rel-line mean "the line the
     voice is saying", tests/design.js holds every one of them to what the
     voice actually said, and this line is never said by the synthesiser. The
     note says so on its first line, and says the voice starts at the list only
     while the voice is on, because with it off that sentence is not true. */
  var wl=relWelcome();
  out=relShell({ph:'welcome',col:col0,foot:openFoot,
   body:'<div class="rel-stage"><div class="pm-eye" aria-live="polite">Release, opening</div>'
    +'<div class="rel-human">'+esc(st.text)+'</div>'
    +'<div class="rel-dots">'+wl.map(function(_,i){return '<i class="'+(i<=RUN.line?'on':'')+'"></i>';}).join('')+'</div>'
    /* plain words, the JK ruling of the same day: "we want to speak to people
       as if they're 10". "Not in this build" was the engineering word for it. */
    +(RUN.line===0?'<div class="rel-sub">His recorded voice reads this part. Until it is recorded, '
      +'read it to yourself.'+(relVoiceOn()?' The app voice starts with the list.':'')+'</div>':'')
    +relClock()+'</div>'+relSws(relNow().n)});
 } else if(RUN.phase==='opening'){
  /* "Release and reframe" was the old name for the mechanic, two words where
     GS ruled one: "stick with release." The line is the synthetic voice's
     first, the hand over from the welcome to the list. THE PROMPT ARRIVES
     HERE, round QM, "the prompt which is important to keep visible at all
     times": the opening is the instruction to repeat it, so it stands above
     the opening line and stays where it is for the whole list. */
  var pr0=relPrompt(relNow());
  out=relShell({ph:'opening',col:col0,foot:openFoot,
   pre:'<div class="rel-pr in" id="relpr" data-k="'+esc(pr0.half)+'"><span>'+esc(pr0.half)+'</span><b>'+esc(pr0.text)+'</b></div>',
   body:'<div class="rel-stage"><div class="pm-eye" aria-live="polite">Release, opening</div>'
    +'<div class="rel-speak">'+esc(st.text)+'</div>'+relClock()+'</div>'+relSws(relNow().n)});
 } else if(RUN.phase==='run'){
  var at=relNow();
  var ch=at.ch, n=at.n, c=seatCol(n.b), truth=ch[2]==='truth';
  /* THE RING ON THE PLATE IS THE ADDRESS BEING RELEASED, so it is where SQ is
     seen going down. It read n.sq, which does not move until the cooldown, so
     it printed the same percent for every one of two hundred lines. It reads
     the count down now, and n.sq still when there is none. */
  var live=relLive(), sqNow=live?live.sqAt(n):null;
  if(sqNow==null)sqNow=n.sq;
  var ad=relAddrAt(), cts=relCounts();
  /* "RELEASE, LEFT CHANNEL" AND "FEMININE, PARASYMPATHETIC" ARE GONE, round
     LY. His words: "get rid of the text saying release left channel,
     feminine, parasympathetic." The side is carried by the two side panels
     (relSidePanel) and by which of the four blocks the scrub is on. What he
     named to keep is the address itself: "you already have disconnection,
     root, sacral root ganglia, that's great."
     THE RING'S OWN NUMBER CARRIES NO PERCENT, round PQ: "it doesn't need to be
     a percent. Just a number." crNode's own bare format. */
  var plate='<div class="rel-plate" style="--c:'+c+'">'+crNode(Object.assign({},n,{sq:sqNow}),'xs',{raw:sqNow.toFixed(1)})
   +'<span><span class="rel-node" style="color:'+c+'">'+esc(n.k)+'</span>'
   +'<span class="rel-sub">'+esc(n.b)+' · '+esc(n.n||'')+'</span>'
   /* where in the run, on the plate it describes, rather than a row of its own */
   +'<span class="rel-ct">Pass '+(RUN.pass+1)+' of '+RUN.dose+' · address '+(ad.at+1)+' of '+ad.of+'</span></span></div>';
  var info=relTally(cts,live)+relSws(n);
  /* PAUSE AND END ON THE CENTRE LINE, round QM, his words: "You can keep the
     buttons organized center screen." Round LY had put them at the lower
     right of a card; there is no card now, and the foot they sit in is
     pinned under everything, so they are always on screen. Graphic symbols,
     round LY. End does not abandon the run, and it does not bill the whole
     plan: it runs the cooldown over what was reached and charges only that,
     see relReach and relCoolDown. */
  var foot=relPauseEnd();
  /* AND THE LIST IS NEVER REDRAWN UNDER A FINGER. While the run stays on one
     address the screen is rewritten around the list, and the list is only
     marked again; a new address is a new list, following the live line from
     its top. The scrub lives with the list for the same reason: it is under a
     finger too. */
  var sp=relSpan(RUN.idx), car=document.getElementById('relcar'),
   hdE=document.getElementById('relhd'), ftE=document.getElementById('relft'),
   fE=document.getElementById('relfoot'), tE=document.getElementById('reltop');
  /* THE PROMPT, top and centre and PINNED, round QM: "the prompt which is
     important to keep visible at all times". It sat above the list inside a
     card that scrolled, so a person who scrolled to read the counts scrolled
     the prompt away. It sits between the rail and the part that scrolls now,
     so nothing moves it. It changes twice an address, at the turn into the
     reframe and back, and only then does it arrive. */
  var pr=relPrompt(at), prE=document.getElementById('relpr'),
   prH='<span>'+esc(pr.half==='Reframe'?'Reframe, the recharge':pr.half)+'</span><b>'+esc(pr.text)+'</b>';
  if(car&&hdE&&ftE&&prE&&fE&&tE&&car.getAttribute('data-span')===sp.key){
   if(prE.getAttribute('data-k')!==pr.half){prE.setAttribute('data-k',pr.half); prE.innerHTML=prH;
    prE.classList.toggle('ref',pr.truth); prE.classList.remove('in'); void prE.offsetWidth; prE.classList.add('in');}
   hdE.innerHTML=plate; ftE.innerHTML=info; fE.innerHTML=foot;
   relTopSync();
   var tr=tE.querySelector('.rel-topr'); if(tr)tr.innerHTML=relTopClock();
   relSideSync(cts,ch[0],truth);
   var far=document.getElementById('relfar'); if(far)far.style.setProperty('--rc',c);
   kept=true;}
  else {RUN.look=false;
   out=relShell({ph:'run',cls:'rel-running',col:c,foot:foot,right:relTopClock(),
    pre:'<div class="rel-pr in'+(pr.truth?' ref':'')+'" id="relpr" data-k="'+esc(pr.half)+'">'+prH+'</div>',
    body:'<div class="rel-mid">'+relSidePanel('L',cts,ch[0],truth)+relCar(sp)+relSidePanel('R',cts,ch[0],truth)+'</div>'
     +'<div id="relhd">'+plate+'</div><div id="relft">'+info+'</div>'});}
 } else if(relResting()){
  /* THE TWO MINUTES, ON THE SCREEN THE LIST RAN ON, round QH. His order: the
     voice says his closing, "now relax for the next two minutes. Stay focused
     on what the body is doing. And then it takes you to your congratulations
     screen." The closing rolling on the column, the ring counting the two
     minutes, and the way past it. When the ring runs out relSecond draws the
     results below, and there is no second screen.

     Leaving is never blocked: Skip the two minutes goes to the results now,
     and Done closes the release, recording nothing, as it always has. */
  out=relShell({ph:'rest',cls:'rel-resting',col:col0,
   body:'<div class="rel-stage"><div class="pm-eye">Released</div>'+relClosingCol()+relSettle()+relEndNote()+'</div>'
    /* the voice can still be silenced while the closing is being said */
    +(RUN.cool<COOLING.length?'<div class="rel-sws">'+relVoiceRow()+'</div>':''),
   foot:'<button class="btn" id="relrest">Skip the two minutes</button><button class="btn" id="relclose">Done</button>'});
 } else if(RUN.phase==='done'){
  /* THE RESULTS, the screen he called congratulations, see relResults. "A
     release empties the story, that's gone." Struck by him at round IG, with
     the rebound and completion days that rode in the same note. */
  /* THE RESULTS ARRIVE ONCE. An answer to What changed redraws this screen,
     and the stagger replaying and the screen jumping to its top under the
     press that caused it would be the screen performing at the person. So
     the entrance plays on the first draw of a run only, and the scroll
     position is carried across every redraw below. */
  var resIn=!RUN.resShown; RUN.resShown=true;
  out=relShell({ph:'done',col:col0,body:'<div class="rel-res'+(resIn?' rel-res-in':'')+'">'+relResults()+'</div>'
    +(RUN.cool<COOLING.length?'<div class="rel-sws">'+relVoiceRow()+'</div>':''),
   foot:'<button class="btn" id="relclose">Done</button>'
    +((typeof relQueueOf==='function'&&relQueueOf(6).length)?'<button class="btn" id="relagain">Run another</button>':'')
    +'<button class="btn pri" id="relrit">Build a ritual</button>'});
 } else {
  var q=RUN.queue;
  /* CUT HARD, RULED 27 SEPTEMBER (round IG). His words: "a release empties
     the story, that's gone... Cost runs left, that goes away. And just a run
     release button. So it's release your selections, pace, and how many
     patterns." The price is still enforced at the door, below, and still
     nowhere else: nought left means there is no run to offer, and that
     refusal says why. The plan it runs is still meterPlan's, capped at what
     is left, and relCoolDown still charges exactly that plan. */
  /* A RERUN IS NEVER SPENT, so a spent allowance closes the new route only.
     can is whether any picked address has a line open to rerun; with none,
     the panel is exactly what it was before 22.K17 and offers no choice. */
  var left=relLeft(), spent=(left<=0)&&!RUN.rerun,
   can=RUN.rerun||relRerunPlan(RUN.pick||[]).length>0;
  /* THE CROSS, ruled 2 October: "when I click on a protocol, if I don't want
     to run it, give me the X so I can have the option of canceling." Same
     close as Cancel, so nothing is started and nothing is charged. It sits at
     the top right of the screen now, beside the rail, where a hand goes to
     leave. 44 by 44, a ring and not a fill. */
  /* "RELEASE YOUR SELECTIONS" IS GONE, round QH: the heading's place holds the
     Story and Seat toggle, centred, and under it the carousel of what is
     about to go, by story or by seat, each with its count. */
  relClosePlan();
  var body='<div class="rel-hdt"><span class="seg" role="group" aria-label="Show what is picked by">'
   +'<button type="button" data-relgrp="story" aria-pressed="'+(RUN.grp!=='seat')+'">Story</button>'
   +'<button type="button" data-relgrp="seat" aria-pressed="'+(RUN.grp==='seat')+'">Seat</button></span></div>'
   +relSetupCar();
  /* NEW OR RERUN, 22.K17, as a pressed pair the way the dose picks are. The
     rerun's price is said before Run release is offered, because a person is
     entitled to see what a run costs before they begin it. */
  if(can)body+='<div class="rel-fields"><div class="rel-field"><span>Lines</span>'
    +'<div class="seg" role="group" aria-label="New lines or a rerun">'
    +'<button type="button" data-relmode="new" aria-pressed="'+(!RUN.rerun)+'">New</button>'
    +'<button type="button" data-relmode="rerun" aria-pressed="'+(!!RUN.rerun)+'">Rerun</button>'
    +'</div></div></div>'
   +(RUN.rerun?'<div class="rel-note">'+esc(relRerunSay())+'</div>':'');
  /* "on the plan in settings" sent a person to a section they then had to
     find. The button below opens the tiers themselves, round NZ. */
  if(spent)body+='<div class="rel-node">Nothing left to open</div>'
   +'<div class="rel-note">Your allowance pays for addresses you have not released before, and this '
   +'period\'s is spent. Each tier sets how much new ground a period opens.</div>';
  /* HOW MANY PATTERNS, RUN SPEED AND TIME, round LY: "dials that say time, run
     speed... number of patterns". Time is the length this exact plan will
     run, read off relSecFrom, the same clock the run shows once it starts. */
  else body+='<div class="rel-fields">'
    +'<label class="rel-field"><span>Run speed</span><input type="number" id="relpace" min="0.5" max="2" step="0.1" value="'
     +RUN.pace+'"></label>'
    +'<label class="rel-field"><span>Patterns</span><input type="number" id="reldose" min="1" max="'
     +REL_DOSES[REL_DOSES.length-1]+'" step="1" value="'+RUN.dose+'"></label>'
    +'<div class="rel-field"><span>Time</span><b class="rel-time">'+relMMSS(relSecFrom(null))+'</b></div>'
    /* his three, as quick picks on the same number */
    +'<div class="rel-field"><span>Left and right</span><div class="seg" role="group" aria-label="Patterns, left and right">'
     +REL_DOSES.map(function(d){return '<button type="button" data-reldose="'+d+'" aria-pressed="'
      +(RUN.dose===d)+'">'+d+'</button>';}).join('')+'</div></div>'
    +'</div>';
  /* and no switch for a run that cannot begin */
  if(!spent)body+=relSws(null);
  out=relShell({ph:'setup',col:col0,body:body,
   right:'<button type="button" class="rel-x" id="relx" aria-label="Cancel">'+relIc('x')+'</button>',
   /* THE BUTTON IS NOT THERE WHEN THERE IS NOTHING TO SPEND. A disabled Begin
      would be a control the panel is still offering, and the honest reading of
      a spent allowance is that this run does not exist yet. */
   foot:'<button class="btn" id="relcancel">'+(spent?'Close':'Cancel')+'</button>'
    +(spent?'<button class="btn pri" id="relplan">See the tiers</button>'
          :'<button class="btn pri" id="relgo">Run release</button>')});}
 var sc0=document.getElementById('relsc'), keepY=(sc0&&sc0.closest('[data-ph]')
  &&sc0.closest('[data-ph]').getAttribute('data-ph')==='done'&&RUN.phase==='done')?sc0.scrollTop:0;
 if(!kept)h.innerHTML=out;
 if(keepY){var sc1=document.getElementById('relsc'); if(sc1)sc1.scrollTop=keepY;}
 if(RUN.phase==='run'){if(!kept)relCarBind(); relCarSync(kept);}
 var b;
 relGcBind();
 h.querySelectorAll('[data-relgrp]').forEach(function(el){el.onclick=function(){
  var g=this.getAttribute('data-relgrp'); if(RUN.grp===g)return;
  RUN.grp=g; RUN.gfocus=0; relRender();};});
 /* the two minutes, skipped: the congratulations screen now. A closing line
    still being said stops with the screen it belongs to, because "now rest
    for two minutes" said over the card that ends them is the voice and the
    screen disagreeing, which this file does not allow. */
 if((b=document.getElementById('relrest')))b.onclick=function(){
  relHush(); RUN.cool=COOLING.length; RUN.settled=true; relTicker(false); relRender();};
 /* BEGIN IS THE HAND OVER, and the press a browser needs before it will make
    a sound. The technical requirement and the ritual are the same press. */
 if((b=document.getElementById('relgo')))b.onclick=function(){
  /* sounded first, while the room is still the interface's, and with the room
     argument as well so it does not depend on that: it is the one fitting a
     run is allowed, and it is one per run. */
  if(typeof sfx==='function')sfx('begin',true);
  RUN.phase='welcome';RUN.line=0;RUN.idx=0;RUN.pass=0;RUN.halted=false;RUN.paused=false;
  RUN.t0=Date.now();RUN.tEnd=0;RUN.pauseAt=0;RUN.pausedMs=0;relTicker(true);relStep();};
 if((b=document.getElementById('relskip')))b.onclick=function(){
  RUN.phase='run';RUN.line=0;RUN.idx=0;RUN.pass=0;relStep();};
 /* the cross and the Cancel button are one close, and it says what did not
    happen, because closing a dialog with nothing said leaves a person unsure
    whether anything was spent */
 if((b=document.getElementById('relcancel')))b.onclick=relCancel;
 if((b=document.getElementById('relx')))b.onclick=relCancel;
 /* the same call the profile button makes, which is the one route to that
    surface and goes through setTab so the folded surface ruling holds. */
 /* ROUND NZ. This went to Settings and landed on whichever section was last
    open, the sign in form by default, which says nothing about a plan. It
    opens Billing at the tiers now, ui/plans.js, still through setTab. */
 if((b=document.getElementById('relplan')))b.onclick=function(){relClose();
  if(typeof planTiersOpen==='function')planTiersOpen(); else setTab(TAB.SETTINGS);};
 if((b=document.getElementById('relclose')))b.onclick=relClose;
 if((b=document.getElementById('relrit')))b.onclick=function(){var lg=RUN.log.slice();relClose();ritOpen(lg);};
 /* RUN ANOTHER, round QM: "do you want to run another session, we would
    recommend these". The heaviest addresses still held, by the Release
    button's own rule (relQueueOf), opened on the setup, so nothing starts
    and nothing is charged until Run release is pressed again. */
 if((b=document.getElementById('relagain')))b.onclick=function(){
  var ids=relQueueOf(6).map(function(n){return n.i;});
  if(ids.length)relPick(ids,RUN.storyT?{story_t:RUN.storyT}:null);};
 /* END, ON EVERY PHASE. Before the list there is nothing to commit, so End
    closes and says nothing was released and nothing was charged. On the list
    it runs the cooldown over what was reached and charges only that. At the
    very first line, before a single pass has been said, there is nothing
    reached, so it is the same close and not a cooldown over an empty run. */
 if((b=document.getElementById('relstop')))b.onclick=function(){
  if(RUN.phase==='welcome'||RUN.phase==='opening'||(RUN.phase==='run'&&relReach()===0)){
   relClose(); status('Release ended. Nothing was released and nothing was charged.'); return; }
  RUN.halted=true;relCoolDown();};
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
 h.querySelectorAll('[data-relmode]').forEach(function(el){el.onclick=function(){
  relMode(this.getAttribute('data-relmode')==='rerun');};});
 /* WHAT CHANGED, one press. relAnswer writes and then redraws the card, so
    the answer is shown as kept only once it is. Skip writes nothing. */
 h.querySelectorAll('[data-relsaid]').forEach(function(el){el.onclick=function(){
  relAnswer(this.getAttribute('data-relsaid'));};});
 h.querySelectorAll('[data-relskip]').forEach(function(el){el.onclick=relAskSkip;});
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
 /* the studio voice, the same way: the line starts again in the voice just
    chosen. Turning it on asks again after a run gave up on it, because the
    press is the person saying try it now. */
 if((b=document.getElementById('relstudio')))b.onclick=function(){
  uiSet('studio',!(CURP&&CURP.ui&&CURP.ui.studio===true)); RUN.studioLost=false;
  var live=RUN.open&&!RUN.paused&&(RUN.phase==='opening'||RUN.phase==='run'
    ||(RUN.phase==='done'&&RUN.cool<COOLING.length));
  if(live)relStep(); else relRender();};
 if((b=document.getElementById('relbuzz')))b.onclick=function(){uiSet('buzz',!relBuzzOn());relRender();};}
/* THE LIST OF VOICES ARRIVES LATE. The panel names the voice before a word is
   said, so when the browser finally names its voices the panel says it again. */
(function(){
 try{ if(window.speechSynthesis&&'onvoiceschanged' in speechSynthesis)
  speechSynthesis.addEventListener('voiceschanged',function(){
   if(RUN.open&&RUN.phase==='idle')relRender();}); }catch(e){}
})();
