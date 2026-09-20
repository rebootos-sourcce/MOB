/* ============================================================
   RELEASE. Four channels: right-limit, left-limit, right-truth,
   left-truth. A queue, so one or many run in the same session.
   coolDown takes 21 percent of weight plus 2, clears at 6 or below,
   and installs the coherent opposite at 62 percent of what it removed.
   ============================================================ */
var CHAN=[['R','Right','limit'],['L','Left','limit'],['R','Right','truth'],['L','Left','truth']];
var OPENING=['Welcome to release and reframe.','We will be here for a few minutes.',
 'Find a quiet space. Sit back and relax,','and turn your senses inward to feel what is released.',
 'As the words repeat, follow along in thought.','Feel what the body is doing as the energy goes.',
 'Let us begin.'];
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
 return CURP?meterPlan(CURP,ids,chans,RUN_MAX):[];}
/* one entry of the plan, read back into the address and channel it names */
function relAt(i){
 var k=(RUN.plan||[])[i]; if(!k)return null;
 var bits=String(k).split(':');
 var n=BY[+bits[0]];
 var ch=CHAN.filter(function(c){return (c[0]+c[2])===bits[1];})[0]||CHAN[0];
 return {n:n, ch:ch, line:+bits[2]||0, key:k};}
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
  if(typeof status==='function')
   status('You are looking at '+((PEOPLE[S.who]||{}).nm||'a reference case')
    +', which is a worked example rather than your record. Switch to your own '
    +'profile to run a release.','fail');
  return false; }
 var _pre=compute(); RUN.cq0=_pre.CQ; RUN.ceil0=cqCeiling();
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
function relRender(){
 var h=document.getElementById('rel'); if(!h)return;
 if(!RUN.open){h.style.display='none';h.innerHTML='';return;}
 h.style.display='flex';
 var out='<div class="rel-card">';
 if(RUN.phase==='opening'){
  out+='<div class="pm-eye">Release and reframe</div>'
   +'<div class="rel-speak">'+esc(OPENING[Math.min(RUN.line,OPENING.length-1)])+'</div>'
   +'<div class="rel-dots">'+OPENING.map(function(_,i){
     return '<i class="'+(i<=RUN.line?'on':'')+'"></i>';}).join('')+'</div>'
   +'<div class="rel-act"><button class="btn" id="relskip">Skip the opening</button></div>';
 } else if(RUN.phase==='run'){
  var at=relAt(RUN.idx)||{n:RUN.queue[0],ch:CHAN[0],line:0};
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
   +'<button class="btn" id="relstop">Stop</button></div>';
 } else if(RUN.phase==='done'){
  var cl=RUN.log.filter(function(x){return x.cleared;}).length;
  out+='<div class="pm-eye">Released</div>'
   +'<div class="rel-node">'+RUN.log.length+' addresses</div>'
   +'<div class="rel-sub">'+cl+' cleared entirely, '+RUN.freed+' weight freed</div>'
   +'<div class="rel-log">';
  RUN.log.forEach(function(x){
   out+='<div class="rel-row'+(x.cleared?' cleared':'')+'">'
    +cr(x.band, (x.w0||0)*10, {size:'xs', raw:x.w0+' '+x.d,
       title:x.name+' · '+x.band+' · '+x.w0})
    +'<span>'+esc(x.name)+'</span><em>toward '+esc(x.opp||'no pole')+'</em></div>';});
  /* WHAT MOVED, AND WHAT RELEASE CANNOT MOVE. The panel used to report weight
     freed and nothing else, so a person ran the loop again and again watching
     a number that was never going to answer. Release works on resistance and
     on the installed pole. It cannot touch integrity, which is the twenty one
     laws, and integrity is most of the reading. So the panel states the move
     it actually made, and when the ground under release is spent it says so
     and names the lever that is not spent. Measured: three of the six ICPs
     have under two points of total release headroom. */
  var _now=compute(), _mv=_now.CQ-(RUN.cq0||0), _left=cqHeadroom(_now.CQ);
  out+='</div><div class="rel-note">Coherence '
   +(Math.abs(_mv)<0.05?'did not move.'
     :(_mv>0?'up ':'down ')+Math.abs(_mv).toFixed(1)+', now '+_now.CQ.toFixed(1)+'.')
   +' '+(_left<1.5
     ?'Release has about '+_left.toFixed(1)+' left to give you. What is holding the '
      +'reading down now is integrity, which is the twenty one laws, and those move '
      +'when you answer them or when what you do changes. Not from here.'
     :'Release has about '+_left.toFixed(1)+' more in it before integrity is the '
      +'only thing left holding the reading down.')
   +'</div>'
   +'<div class="rel-note">Release empties the address. The coherent opposite is '
   +'installing on the same pass. The rebound is day four and a half. Completion is day '
   +'twenty seven.</div>'
   +'<div class="rel-act"><button class="btn" id="relclose">Done</button>'
   +'<button class="btn pri" id="relrit">Build a ritual</button></div>';
 } else {
  var q=RUN.queue;
  out+='<div class="pm-eye">Run a release</div>'
   +'<div class="rel-node">'+q.length+(q.length===1?' address':' addresses')+'</div>'
   +'<div class="rel-sub">'+((RUN.plan||[]).length)+' of your allowance</div>'
   +'<div class="rel-log">';
  q.forEach(function(n){
   out+='<div class="rel-row">'+crNode(n,'xs')
    +'<span>'+esc(n.k)+'</span><em>'+n.b+'</em></div>';});
  var pl=(RUN.plan||[]).length;
  out+='</div><div class="rel-note">'+pl+' thought line'+(pl===1?'':'s')+' of new ground, which is '+pl+' pattern'+(pl===1?'':'s')+'. Right then left, limit before truth. About '
   +(Math.round(pl*RUN.speed/60*10)/10)+' minutes.'
   +(pl<RUN_MAX?' That is everything still unopened in this queue.':'')+'</div>'
   +'<div class="rel-act"><button class="btn" id="relcancel">Cancel</button>'
   +'<button class="btn pri" id="relgo">Begin</button></div>';}
 out+='</div>';
 h.innerHTML=out;
 var b;
 if((b=document.getElementById('relgo')))b.onclick=function(){RUN.phase='opening';RUN.line=0;relTick();relRender();};
 if((b=document.getElementById('relskip')))b.onclick=function(){RUN.phase='run';RUN.line=0;relRender();};
 if((b=document.getElementById('relcancel')))b.onclick=relClose;
 if((b=document.getElementById('relclose')))b.onclick=relClose;
 if((b=document.getElementById('relrit')))b.onclick=function(){var lg=RUN.log.slice();relClose();ritOpen(lg);};
 if((b=document.getElementById('relstop')))b.onclick=function(){clearInterval(RUN.timer);relCoolDown();};
 if((b=document.getElementById('relpause')))b.onclick=function(){RUN.paused=!RUN.paused;relRender();};}

