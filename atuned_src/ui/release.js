/* ============================================================
   RELEASE. Four channels: right-limit, left-limit, right-truth,
   left-truth. A queue, so one or many run in the same session.
   coolDown takes 21 percent of weight plus 2, clears at 6 or below,
   and installs the coherent opposite at 62 percent of what it removed.
   ============================================================ */
var CHAN=[['R','Right','limit'],['L','Left','limit'],['R','Right','truth'],['L','Left','truth']];
/* SEVEN LINES HELD 2.2 SECONDS EACH IS 15.4 SECONDS BEFORE THE FIRST ADDRESS.
   Line one and line seven read the heading aloud. Line two is vaguer than the
   product, which already printed the computed run length on the screen before
   this one. Line three instructs a nervous system in the register this brand
   refuses. Line four is a sensation with no place in it, in the passive with
   the agent hidden. Line five carries an instruction and a definition in one
   string. Line six has no mass and no direction.

   Three lines, 6.6 seconds, one thing each. The somatic work line four was
   gesturing at is done by line three with a place in it. "In thought" stays
   because it is already the product's own term. See the house voice skill. */
var OPENING=['Sit down. Put both feet on the floor.',
 'Each line names one pattern. Follow it in thought as it lands.',
 'Keep some attention on your body, and notice which place answers.'];
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
var RUN={open:false,queue:[],plan:[],sec:0,idx:0,phase:'idle',speed:2.2,timer:null,
         paused:false,done:false,line:0,log:[],freed:0};
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
function relPick(nodeIds){
 RUN.queue=nodeIds.map(function(i){return BY[i];}).filter(function(n){return n&&n.cf;});
 RUN.sec=0;RUN.idx=0;RUN.line=0;RUN.phase='idle';RUN.done=false;RUN.log=[];RUN.freed=0;
 RUN.plan=relPlan();
 RUN.open=true; relRender();}
function relTick(){
 clearInterval(RUN.timer);
 RUN.timer=setInterval(function(){
  if(RUN.paused)return;
  if(RUN.phase==='opening'){
   RUN.line++;
   if(RUN.line>=OPENING.length){RUN.phase='run';RUN.line=0;}
   relRender(); return;}
  /* the run walks the plan. one tick is one thought line. */
  RUN.idx++;
  if(RUN.idx>=(RUN.plan||[]).length){ clearInterval(RUN.timer); relCoolDown(); return; }
  relRender();}, RUN.speed*1000);}
function relCoolDown(){
 if(RUN.done)return; RUN.done=true; RUN.phase='done';
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
 syncCh();relRender();render();}
function relClose(){clearInterval(RUN.timer);RUN.open=false;RUN.phase='idle';relRender();render();}
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
/* THE TIMING IS THE RUN'S, AND NOT THE PROTOTYPE'S.

   The research sized its ramps for the prototype, where an address is fifty
   lines a channel and a half runs for minutes: eight seconds to fade in,
   twelve to rise from theta to alpha, twelve to glide between seats. Here
   meterPlan gives an address one line a channel, so a half is two lines, 4.4
   seconds at RUN.speed. A twelve second rise started at the cross would still
   be climbing when the next address took the card. It tops out near 7.5,
   which is theta, so no reframe half would ever be heard in alpha, and a
   twelve second glide never reaches the seat whose name is on the screen.
   That is the sound stating what the card does not, which DESIGN-release.md
   rules out: every fact the sound states is on the screen at the same moment.

   So every move lands inside the line that caused it. A glide or a rise takes
   nine tenths of a line and has arrived before the next line appears. Not the
   whole line: the bed restarts a glide from its last target, so a target that
   came while one was still in flight would step the pitch by what was left,
   and a timer that fires a few milliseconds early is ordinary. The tenth is
   the margin. The fade in takes what is left of the opening, all of it from
   Begin, and arrives with the first address; started once the run is under
   way, by Resume or by the switch, it takes one line. The fade out keeps the
   research's four seconds, because nothing after it can disagree with it. */
var REL_GLIDE=0.9;
function relTone(){
 if(typeof bedFollow!=='function')return;
 var live=RUN.open&&!RUN.paused&&(RUN.phase==='opening'||RUN.phase==='run');
 var at=(live&&relToneOn())?relNow():null;
 var hz=(at&&at.n)?seatHz(at.n.b):null;
 /* no tone at this seat is silence, never the last seat's tone held over */
 if(!hz){bedStop();return;}
 bedFollow(hz, at.ch[2]==='truth'?BED_ALPHA:BED_THETA,
  RUN.phase==='opening'?(OPENING.length-RUN.line)*RUN.speed:RUN.speed, RUN.speed*REL_GLIDE);}
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
function relRender(){
 /* the tone first, so the switch below prints what is sounding now */
 relTone();
 var h=document.getElementById('rel'); if(!h)return;
 if(!RUN.open){h.style.display='none';h.innerHTML='';return;}
 h.style.display='flex';
 var out='<div class="rel-card">';
 if(RUN.phase==='opening'){
  out+='<div class="pm-eye">Release and reframe</div>'
   +'<div class="rel-speak">'+esc(OPENING[Math.min(RUN.line,OPENING.length-1)])+'</div>'
   +'<div class="rel-dots">'+OPENING.map(function(_,i){
     return '<i class="'+(i<=RUN.line?'on':'')+'"></i>';}).join('')+'</div>'
   +'<div class="rel-act"><button class="btn" id="relskip">Skip the opening</button></div>'
   +relToneRow(relNow().n);
 } else if(RUN.phase==='run'){
  var at=relNow();
  var ch=at.ch, n=at.n, c=seatCol(n.b);
  var tot=(RUN.plan||[]).length||1;
  out+='<div class="pm-eye">'+ch[1]+' '+ch[2]+', line '+(at.line+1)+'</div>'
   +'<div class="rel-node" style="color:'+c+'">'+esc(n.k)+'</div>'
   +'<div class="rel-sub">'+n.b+' · '+(n.n||'')+'</div>'
   +'<div class="rel-side rel-'+ch[0]+'"><span>'+ch[1]+'</span></div>'
   +'<div class="rel-prog"><i style="width:'+
     (((RUN.idx+1)/tot)*100).toFixed(0)
     +'%;background:'+c+'"></i></div>'
   +'<div class="rel-ct">'+(RUN.idx+1)+' of '+tot+' patterns</div>'
   +'<div class="rel-act"><button class="btn" id="relpause">'+(RUN.paused?'Resume':'Pause')+'</button>'
   +'<button class="btn" id="relstop">Stop</button></div>'
   +relToneRow(n);
 } else if(RUN.phase==='done'){
  var cl=RUN.log.filter(function(x){return x.cleared;}).length;
  /* A ONE ADDRESS RUN PRINTED "1 addresses". The plural was typed onto the
     count with no singular beside it, on the card a person reads at the end
     of the run. The picker below already asks q.length===1; this asks the
     same of the log. */
  out+='<div class="pm-eye">Released</div>'
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
   +'<div class="rel-note">Release empties the address. The coherent opposite is '
   +'installing on the same pass. The rebound is day four and a half. Completion is day '
   +'twenty seven.</div>'
   +'<div class="rel-act"><button class="btn" id="relclose">Done</button>'
   +'<button class="btn pri" id="relrit">Build a ritual</button></div>';
 } else {
  var q=RUN.queue;
  /* THE PRICE IS ENFORCED AT THE DOOR AND NOWHERE ELSE.

     Nought left means the run does not start, and this is the only place that
     may say so. Stopping a run that is already walking is a worse failure than
     a wrong label: the person has sat down, the addresses are open in front of
     them, and half a release is neither a release nor a refund. relPlan is
     capped at the allowance now, so anything that gets past this branch costs
     what it printed and is charged in full. */
  var left=relLeft(), spent=(left<=0), pl=(RUN.plan||[]).length;
  out+='<div class="pm-eye">Run a release</div>'
   +'<div class="rel-node">'+(spent?'Nothing left to open'
     :q.length+(q.length===1?' address':' addresses'))+'</div>'
   /* A NUMBER CARRIES WHAT IT IS OF. This read "25 of your allowance", which
      says twenty five of what, and reads as a bill on a grant of ten a week
      against a run that caps at twenty five. planAllowance already returns
      both halves, so the honest sentence needs no new field. */
   +'<div class="rel-sub">'+(spent
     ?q.length+(q.length===1?' address':' addresses')+' picked, 0 patterns available'
     :pl+' patterns of the '+left+' you have left')+'</div>'
   +'<div class="rel-log">';
  q.forEach(function(n){
   out+='<div class="rel-row">'+crNode(n,'xs')
    +'<span>'+esc(n.k)+'</span><em>'+n.b+'</em></div>';});
  /* WHICH CEILING TRUNCATED THE RUN, because the two mean different things to
     a person. Short of the run ceiling used to print "that is everything still
     unopened in this queue", which is false the moment the allowance is what
     cut it: there is more unopened ground and they cannot reach it yet. */
  var byAllow=(pl>0&&pl>=left&&left<RUN_MAX);
  out+='</div><div class="rel-note">'+(spent
    ?'New ground is what an allowance buys, and this period\'s is spent. '
     +'Rerunning an address you have already opened costs nothing and is in '
     +'the ritual. A wider allowance is on the plan in settings.'
    :pl+' thought line'+(pl===1?'':'s')+' of new ground, which is '+pl+' pattern'+(pl===1?'':'s')+'. Right then left, limit before truth. About '
     +(Math.round(pl*RUN.speed/60*10)/10)+' minutes.'
     +(byAllow?' That is all the allowance has left, and the rest of this queue stays unopened.'
       :(pl<RUN_MAX?' That is everything still unopened in this queue.':'')))+'</div>'
   +'<div class="rel-act"><button class="btn" id="relcancel">'+(spent?'Close':'Cancel')+'</button>'
   /* THE BUTTON IS NOT THERE WHEN THERE IS NOTHING TO SPEND. A disabled Begin
      would be a control the panel is still offering, and the honest reading of
      a spent allowance is that this run does not exist yet. The route out goes
      where the allowance is, which is the only thing that changes the answer. */
   +(spent?'<button class="btn pri" id="relplan">Open settings</button>'
         :'<button class="btn pri" id="relgo">Begin</button>')+'</div>'
   /* and no switch for a run that cannot begin */
   +(spent?'':relToneRow(null));}
 out+='</div>';
 h.innerHTML=out;
 var b;
 if((b=document.getElementById('relgo')))b.onclick=function(){RUN.phase='opening';RUN.line=0;relTick();relRender();};
 if((b=document.getElementById('relskip')))b.onclick=function(){RUN.phase='run';RUN.line=0;relRender();};
 if((b=document.getElementById('relcancel')))b.onclick=relClose;
 /* the same call the profile button makes, which is the one route to that
    surface and goes through setTab so the folded surface ruling holds. */
 if((b=document.getElementById('relplan')))b.onclick=function(){relClose();setTab(TAB.SETTINGS);};
 if((b=document.getElementById('relclose')))b.onclick=relClose;
 if((b=document.getElementById('relrit')))b.onclick=function(){var lg=RUN.log.slice();relClose();ritOpen(lg);};
 if((b=document.getElementById('relstop')))b.onclick=function(){clearInterval(RUN.timer);relCoolDown();};
 if((b=document.getElementById('relpause')))b.onclick=function(){RUN.paused=!RUN.paused;relRender();};
 /* uiSet is the one writer for the profile's preferences, so this reports
    through statusSaved like the other switches do. A save that fails leaves
    the tone on for this visit and says it will not survive a reload, and both
    halves of that are true. */
 if((b=document.getElementById('reltone')))b.onclick=function(){uiSet('tone',!relToneOn());relRender();};}

