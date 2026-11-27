
/* ================================================================ layout on resize */
function relayout(){
 W=stage.clientWidth;H=stage.clientHeight;DPR=Math.min(2,window.devicePixelRatio||1);
 cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);
 stage.style.setProperty('--dial',(W<=700?(H>=780?208:H>=700?160:0):0)+'px');
 var top=lay('top');stage.style.setProperty('--top-b',(top.cy+top.ry*1.74+16)+'px');
 layoutChips();layoutBody();
 var A=ACT[S.act];
 if(A&&A.pose){POSE.cur=lay(A.pose);POSE.to=null;}
 if(A&&A.box)placeBox(A.box,A.pose,true);
 draw();}

/* ================================================================ the clock */
function ctlState(){
 var user=!!(S.mask&4);
 $('#pause').innerHTML=ico(user?'play':'pause',22);
 $('#pause').setAttribute('aria-label',user?'Resume':'Pause');$('#pausel').textContent=user?'Resume':'Pause';
 var snd=$('#soundb');snd.innerHTML=ico(snd.getAttribute('aria-pressed')==='true'?'sound':'muted',22);}
function step(dt){
 if(S.mask&16)return;
 var A=ACT[S.act];if(!A)return;
 var paused=!!(S.mask&(1|2|4|32));
 if(!(S.mask&64))S.ringT+=dt;   /* the door's ring clock. A frozen shot freezes the drift too, so a screenshot is the same picture twice */
 if(!paused){
  stepPose(dt);FD.step(dt,!!(S.mask&64));
  if(S.bead){S.bead.t+=dt;if(S.bead.t>=S.bead.dur)S.bead.done=true;}
  if(S.mark)S.mark.t+=dt;if(S.lexMark)S.lexMark.t+=dt;
  if(S.bodyOn)S.bodyW+=dt;
  S.bodyD=STILL?1:clamp((S.bodyW-.25)/.9,0,1);
  S.bodyA+=STILL?(S.bodyAT-S.bodyA):(S.bodyAT-S.bodyA)*(1-Math.exp(-dt/.25));
  if(S.dw){S.dw.left-=dt;if(S.dw.left<=0){var nx=S.dw.next;S.dw=null;go(nx);return;}}}
 if(A.clocked){
  var tgt=S.mask?0:1;S.rate=tgt?Math.min(1,S.rate+dt/.32):0;     /* a release from hold or pause ramps in over 320 ms */
  S.t+=dt*S.rate*S.speed/S.mul;
  runCues();
  if(!S.outDone&&A.deck&&S.t>=A.len-.22&&A.next){S.outDone=true;DECK[A.deck].hide();}
  if(!S.outDone&&A.sec==='flow'&&S.t>=A.len-.22&&A.next){S.outDone=true;DECK.fl.hide();}
  if(S.t>=A.len){
   if(A.holdEnd){S.t=A.len;if(!S.sigQ&&A.onEnd)A.onEnd();}
   else go(A.next);}
 }else{
  S.t+=dt;runCues();
  if(S.act==='ask'&&!S.live&&S.t>=1.0&&!S.picked){S.live=true;SETS.start.host.classList.add('live');}
  if(S.act==='b1'&&S.t>=3.0)$('#b1-go')&&$('#b1-go').classList.add('in');}}
var MEAS={rec:false,ft:[]};
function frame(ts){
 var dt=(ts-S.last)/1000;S.last=ts;if(!(dt>0))dt=0;if(dt>.1)dt=.1;       /* clamp 100 ms: a longer gap is a hidden tab, which is a pause */
 if(MEAS.manual){requestAnimationFrame(frame);return;}                       /* filmstrip.js steps the clock by hand */
 var a=performance.now();step(dt);draw();var b=performance.now();
 if(MEAS.rec)MEAS.ft.push([ts,dt*1000,b-a,S.act,FD.mv.pose+FD.mv.wave+FD.mv.rip+FD.mv.pull+FD.mv.bead+FD.mv.lean]);
 readout();requestAnimationFrame(frame);}
var roAt=0;
function readout(){
 var n=performance.now();if(n-roAt<120)return;roAt=n;
 var A=ACT[S.act],s=S.act+'  '+S.t.toFixed(1)+(A&&A.len?' / '+A.len.toFixed(1):'')+' s'+(S.mask&(1|4|16|32|64)?'  paused':'');
 var e=$('#readout');if(e)e.textContent=s;}

/* ================================================================ controls */
function togglePause(){S.mask^=4;ctlState();}
var TAPNEXT={arr1:1,arr2:1,settle:1,b2:1},TAPBACK={arr2:'arr1',b2:'b1'};
function nextSlide(){var A=ACT[S.act];if(!TAPNEXT[S.act])return;go(A.next);}
function backSlide(){
 if(!TAPNEXT[S.act])return;
 var twice=(performance.now()/1000-S.lastBack)<1.5;S.lastBack=performance.now()/1000;
 if(twice&&TAPBACK[S.act])go(TAPBACK[S.act]);else go(S.act);}   /* first tap restarts this one, a second within 1.5 s goes back one */
function skip(){
 var id=S.act;
 if(id==='arr1'||id==='arr2'||id==='transit')go('ask');
 else if(id==='settle')go('feel');
 else if(id==='rel')go('b1');
 else if(id==='b2'||id==='sig')go('b3');}
function leave(){S.end='leave';go('end');}

var hold=null;
stage.addEventListener('pointerdown',function(e){
 var A=ACT[S.act];if(!A||!A.clocked||S.mask&16)return;
 if(e.target.closest('button,a,input,textarea,select,label'))return;
 hold={x:e.clientX,held:false,id:e.pointerId,timer:setTimeout(function(){if(hold){hold.held=true;S.mask|=1;ctlState();}},180)};});
function endHold(e,cancel){
 if(!hold)return;clearTimeout(hold.timer);var h=hold;hold=null;
 if(h.held){S.mask&=~1;ctlState();return;}
 if(cancel)return;
 if(!TAPNEXT[S.act])return;
 var r=stage.getBoundingClientRect(),f=(h.x-r.left)/r.width;
 if(f<1/3)backSlide();else nextSlide();}
stage.addEventListener('pointerup',function(e){endHold(e,false);});
stage.addEventListener('pointercancel',function(e){endHold(e,true);});
stage.addEventListener('pointerleave',function(e){if(hold&&hold.held)endHold(e,true);});
stage.addEventListener('contextmenu',function(e){if(stage.classList.contains('film'))e.preventDefault();});
/* a tap on empty stage while the space after an answer is running goes on at once */
stage.addEventListener('click',function(e){
 if(!S.dw||e.target.closest('button,a,input,textarea,select,label'))return;
 var n=S.dw.next;S.dw=null;go(n);});

$('#pause').addEventListener('click',function(e){e.stopPropagation();togglePause();});
$('#pause').addEventListener('focus',function(){if($('#pause').matches(':focus-visible')){S.mask|=32;}});
$('#pause').addEventListener('blur',function(){S.mask&=~32;});
$('#soundb').addEventListener('click',function(e){e.stopPropagation();var b=$('#soundb'),on=b.getAttribute('aria-pressed')==='true';
 b.setAttribute('aria-pressed',on?'false':'true');b.setAttribute('aria-label',on?'Sound off, turn on':'Sound on, turn off');ctlState();});
$('#skip').addEventListener('click',function(e){e.stopPropagation();skip();});
$('#leave').addEventListener('click',function(e){e.stopPropagation();leave();});
document.addEventListener('visibilitychange',function(){if(document.hidden)S.mask|=2;else S.mask&=~2;});
document.addEventListener('keydown',function(e){
 var A=ACT[S.act],typing=/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName||''));
 if(S.stop){if(e.key==='Escape')showStop(false);return;}
 if(e.key==='Escape'){if(A&&A.clocked&&/skip/.test(A.ctl))skip();else if(S.act==='ask')leave();return;}
 if(e.target.id==='m-in'&&e.key==='Enter'){e.preventDefault();var v=e.target.value.trim();if(v)applyFix(v);return;}
 if(e.target.id==='words'&&e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();doStory(false);return;}
 if(typing||e.target.closest&&e.target.closest('#ctl'))return;
 if(A&&A.clocked&&e.key===' '&&!(e.target.tagName==='BUTTON')){togglePause();e.preventDefault();}
 if(e.key==='ArrowRight')nextSlide();
 if(e.key==='ArrowLeft')backSlide();});

/* browser Back steps back one beat and never leaves the app */
function pushH(id){try{history.pushState({a:id},'',location.href);}catch(e){}}
window.addEventListener('popstate',function(){
 var id=S.act;
 if(id==='arr2')go('arr1',{nopush:true});
 else if(id==='ask')go('arr2',{nopush:true});
 else pushH(id);});

/* ---- the door. One row of Log in and Guest; Create account is its own quiet control at the very bottom and flips the
   fields between the two modes. UNCHANGED by round PP. */
function setDoor(m){
 S.door=m;
 $('#lg-fields').classList.toggle('shut',m==='create');$('#lg-hint').hidden=m!=='create';
 $('#lg-go').textContent=m==='create'?'Create account':'Log in';
 $('#lg-create').textContent=m==='create'?'Log in instead':'Create account';}
$('#lg-create').addEventListener('click',function(){setDoor(S.door==='create'?'login':'create');});
$('#lg-go').addEventListener('click',function(){if(S.door==='create'){S.mode='account';startRun();}else{S.end='login';go('end');}});
$('#lg-guest').addEventListener('click',function(){S.mode='guest';startRun();});
$('#lg-gico').innerHTML=ico('guest',20);
function startRun(){go('transit');}

/* ---- the flow's own buttons, reel B, the signal test */
document.addEventListener('click',function(e){
 var b=e.target.closest('button');if(!b)return;
 if(b.id==='st-done')doStory(false);
 if(b.id==='st-skip')doStory(true);
 if(b.id==='m-yes')go('recog');
 if(b.id==='m-no'){var q=$('#mq');q&&q.classList.remove('in');var cr=$('#corr');cr&&cr.classList.add('in');setTimeout(function(){var i=$('#m-in');i&&i.focus({preventScroll:true});},STILL?0:420);}
 if(b.id==='m-adj'){var v=($('#m-in')||{}).value;if(v&&v.trim())applyFix(v.trim());}
 if(b.id==='go-rel')go('rel');
 if(b.id==='b1-btn')go('b2');
 if(b.id==='b3-keep'){$('#b3-fine').classList.add('on');b.classList.add('live');$('#b3-u').focus({preventScroll:true});}
 if(b.id==='b3-not'){S.end='notnow';go('end');}
 if(b.id==='b3-make'){S.end='account';S.made=true;go('end');}
 if(b.id==='b3-guestgo'){S.end='guest';go('end');}
 if(b.id==='b3-sig')go('sig');
 if(b.closest('#sig-q')&&b.dataset.a){var a=b.dataset.a;
  $('#sig-reply').textContent=a==='different'?'You noticed a difference between yes and no.':a==='same'?'They felt the same.':'';
  S.answered=a==='unsure'?'':a;$('#sig-qt').hidden=true;$$('#sig-q .signalq').forEach(function(x){x.hidden=true;});$('#sig-back').hidden=false;
  if(a==='unsure'){$('#sig-reply').textContent='Left empty. You can test it again later.';}}
 if(b.id==='sig-back')go('b3');
 if(b.id==='end-restart')restart();
});
$('#b3-tick').addEventListener('change',function(){$('#b3-make').disabled=!(this.checked&&$('#b3-u').value.trim().length>0&&$('#b3-p').value.length>0);});
['#b3-u','#b3-p'].forEach(function(s){$(s).addEventListener('input',function(){$('#b3-make').disabled=!($('#b3-tick').checked&&$('#b3-u').value.trim().length>0&&$('#b3-p').value.length>0);});});

/* ---- the distress stop frame. A static document: nothing animates and nothing is sold on it. */
function stopFig(){
 var h='<ellipse cx="36" cy="10" rx="9" ry="3" fill="none" stroke="#EFEDE8" stroke-width="1.2"/><line x1="36" y1="22" x2="36" y2="98" stroke="#EFEDE8" stroke-width="1.2"/>';
 for(var i=0;i<7;i++)h+='<circle cx="36" cy="'+(98-i*12.6).toFixed(1)+'" r="3" fill="#EFEDE8"/>';return h;}
function showStop(on){
 S.stop=on;$('#stop').classList.toggle('on',on);
 if(on)S.mask|=16;else S.mask&=~16;
 $$('.act,#ctrls').forEach(function(e){if(on)e.setAttribute('inert','');else e.removeAttribute('inert');});
 var d=$('#c-stop');d.textContent=on?'Hide':'Show';d.setAttribute('aria-pressed',String(on));
 if(!on)return;
 $('#stop-fig').innerHTML=stopFig();
 var ind=S.stopv==='indirect',row=$('#stop-row');
 $('#stop-1').textContent=ind?'That sounded heavy. Tell one person today what you wrote.':'Stop here. A release is not for this.';
 $('#stop-2').textContent='If you are not safe, call or text 988 in the United States, or your local emergency number.';
 $('#stop-3').textContent=(ind||S.made)?'':'Nobody reads this but you.';$('#stop-3').hidden=ind||S.made;
 row.innerHTML=(ind?'':'<button type="button" class="ring">Call 988</button><button type="button" class="ring">Text 988</button>')+'<button type="button" class="ring" id="stop-go">Go on</button>';
 $('#stop-go').addEventListener('click',function(){showStop(false);S.end='stop';go('end');});}
$('#c-stop').addEventListener('click',function(){showStop(!S.stop);});   /* the stop frame has no link on the stage: it is reached from the review strip only */

/* ================================================================ the owner's strip */
var JUMPS=[
 ['login','The door'],['transit','Transit from the door'],['arr1','Arrive 1, Welcome'],['arr2','Arrive 2, The invitation'],
 ['ask','Ask, what brought you here'],['settle','Settle and notice'],['feel','Feel, what are you feeling'],['body','Body, where do you notice it'],
 ['story','Story, what was happening'],['mirror','Mirror, here is what I heard'],['recog','Recognition and bridge'],
 ['rel-open','Release, opening'],['rel-lines','Release, lines'],['rel-settle','Release, settle'],
 ['b1','Reel B 1, The reading'],['b2','Reel B 2, The loop'],['b3','Reel B 3, Keep this'],['sig','Signal test'],['sigq','Signal test, question'],
 ['end','The Field (end)'],['stop','Stop frame']];
var ORDER=['login','transit','arr1','arr2','ask','settle','feel','body','story','mirror','recog','rel','b1','b2','b3','sig','end'];
var DEFWORDS='I was trying to handle everyone and nobody asked if I was okay';
/* a jump fills in what the person would have answered on the way, so any beat can be opened cold */
function ensureDefaults(key){
 var k=key.indexOf('rel')===0?'rel':key==='sigq'?'sig':key,ix=ORDER.indexOf(k);
 if(ix>ORDER.indexOf('ask')&&S.pick==null)S.pick=2;
 if(ix>ORDER.indexOf('feel')&&S.feel==null)S.feel=0;
 if(ix>ORDER.indexOf('body')&&S.place===-1&&!S.placeAsked)S.place=3;
 if(ix>ORDER.indexOf('story')&&!S.words&&!S.skipStory)S.words=DEFWORDS;
 if(ix>ORDER.indexOf('story')&&!S.lex&&S.words)S.lex=readWords(S.words);
 if(ix>ORDER.indexOf('mirror'))S.seat=mirrorSeat();
 if(ix>=ORDER.indexOf('rel')&&S.seat==null)S.seat=mirrorSeat();
 S.trail=[];
 if(ix>ORDER.indexOf('ask')&&S.pick!=null)S.trail[0]={s:STARTS[S.pick].n};
 if(ix>ORDER.indexOf('feel')&&S.feel>=0)S.trail[1]={s:FEELS[S.feel].n};
 if(ix>ORDER.indexOf('body')&&S.place>=0)S.trail[2]={s:placeOf(S.place).n};
 S.trail=S.trail.filter(Boolean);renderTrail();
 S.mark=(ix>ORDER.indexOf('body')&&S.place>=0)?{seat:S.place,t:1}:null;
 if(ix>=ORDER.indexOf('recog'))S.mark={seat:S.seat,t:1,hold:true};
 S.lexMark=null;}
function jump(key,t,o){
 o=o||{};
 if(S.stop)showStop(false);
 var k=key.indexOf('rel')===0?'rel':key==='sigq'?'sig':key;
 if(key==='login'){restart(true);go('login',{t:0,snap:true});if(o.freeze)S.mask|=64;else S.mask&=~64;ctlState();return;}
 ensureDefaults(key);
 S.figDone=ORDER.indexOf(k)>ORDER.indexOf('arr1');
 SETS.start.host.className='chipset start';SETS.feel.host.className='chipset feel';layoutChips();
 S.bodyOn=ORDER.indexOf(k)>=ORDER.indexOf('body');S.bodyW=S.bodyOn?3:0;
 if(key==='stop'){showStop(true);return;}
 var tt=t;
 if(key==='rel-open')tt=t!=null?t:REL.stem+1.9;else if(key==='rel-lines')tt=t!=null?t:REL.lines0+5.0;else if(key==='rel-settle')tt=t!=null?t:REL.settle0+4.0;
 else if(key==='sigq')tt=SIG_LEN;
 else if(key==='mirror')tt=t!=null?t:12;
 else if(key==='recog')tt=t!=null?t:5;
 else if(key==='ask'||key==='feel'||key==='body'||key==='story')tt=t!=null?t:2;
 if(key==='end'&&!S.end)S.end='notnow';
 S.bodyA=S.bodyAT=(ACT[k]&&ACT[k].body!=null)?ACT[k].body:0;S.bodyD=S.bodyOn?1:0;
 go(k,{t:tt||0,snap:true,keep:true});
 FD.geo={cx:POSE.cur.cx,cy:POSE.cur.cy,rx:POSE.cur.rx,ry:POSE.cur.ry};
 FD.aim(null,{snap:true});FD.resetLit();
 FD.leanTo(S.place>=0&&ORDER.indexOf(k)>ORDER.indexOf('body')?S.place:-1,true);
 if(ORDER.indexOf(k)>=ORDER.indexOf('recog'))FD.leanTo(S.seat,true);
 if(ACT[k]&&ACT[k].lean)FD.leanTo(ACT[k].lean(),true);
 FD.snapAll();FD.sim(3);
 if(ORDER.indexOf(k)>=ORDER.indexOf('b1')){FD.resetLit();relNodes().forEach(function(n){FD.lit[n[0]-1]=1;});}
 FD.door=FD.doorT=(k==='transit'?0:(ORDER.indexOf(k)<ORDER.indexOf('transit')?1:0));if(k==='transit'){FD.door=clamp(1-((tt||0)-.15)/.6,0,1);}
 if(o.freeze)S.mask|=64;else S.mask&=~64;
 if(key==='b3'&&o.keep){$('#b3-fine').classList.add('on');}
 ctlState();}
function restart(quiet){
 S.ringT=0;S.mask=0;S.rate=1;S.pick=null;S.feel=null;S.place=-1;S.placeAsked=false;S.words='';S.skipStory=false;S.lex=null;S.fixes=[];S.seat=null;S.mark=null;S.lexMark=null;S.bead=null;S.dw=null;
 S.breathOn=false;S.tableQ=false;S.end='';S.made=false;S.figDone=false;S.bodyOn=false;S.bodyW=0;S.bodyD=0;S.bodyA=0;S.bodyAT=0;S.mood=null;S.picked=false;S.live=false;
 clearTrail();FD.door=FD.doorT=1;FD.resetLit();FD.leanTo(-1,true);FD.rip.length=0;FD.breathA=FD.breathAT=.3;FD.arcA=FD.arcAT=1;FD.aim(null,{snap:true});FD.snapAll();
 Object.keys(DECK).forEach(function(k){DECK[k].clear();});
 openSet('start',false);openSet('feel',false);SETS.start.host.className='chipset start gone';SETS.feel.host.className='chipset feel gone';layoutChips();
 $('#bodyt').classList.remove('on','live');$('#body-ns').classList.remove('on','live');
 $('#lg').classList.remove('gone');setDoor('login');
 if(!quiet)go('login',{snap:true});}
function buildStrip(){
 var sel=$('#c-jump');sel.innerHTML=JUMPS.map(function(j){return '<option value="'+j[0]+'">'+j[1]+'</option>';}).join('');
 sel.addEventListener('change',function(){jump(sel.value);});
 $('#c-restart').addEventListener('click',function(){restart();sel.selectedIndex=0;});
 $$('.c-speed').forEach(function(b){b.addEventListener('click',function(){S.speed=+b.dataset.v;$$('.c-speed').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});});});
 $('#c-still').addEventListener('change',function(){setStill(this.checked);});
 $$('.c-width').forEach(function(b){b.addEventListener('click',function(){S.width=b.dataset.v;$$('.c-width').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});fitFrame();});});
 $$('.c-path').forEach(function(b){b.addEventListener('click',function(){S.mode=b.dataset.v;$$('.c-path').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});if(S.act==='b3')enterB3();});});
 $$('.c-stopv').forEach(function(b){b.addEventListener('click',function(){S.stopv=b.dataset.v;$$('.c-stopv').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});if(S.stop)showStop(true);});});
 $('#ctl-t').addEventListener('click',function(){var c=$('#ctl'),sh=c.classList.toggle('shut');this.setAttribute('aria-expanded',String(!sh));setTimeout(fitFrame,0);});}
function fitFrame(){
 var wrap=$('#wrap'),fr=$('#frame'),ww=wrap.clientWidth,wh=wrap.clientHeight,m=S.width;
 if(m==='fit'){fr.style.width='100%';fr.style.height='100%';fr.style.transform='none';fr.className='';}
 else{var w=m==='1600'?1600:390,h=m==='1600'?1000:844,k=Math.min(1,(ww-24)/w,(wh-24)/h);
  fr.style.width=w+'px';fr.style.height=h+'px';fr.style.transform='scale('+k+')';fr.className='fixed'+(m==='390'?' phone':'');}
 setTimeout(relayout,0);}

/* ONE FUNCTION SETS body.still. It reads the system setting and the owner's toggle, and it sets the dwell multiplier
   with it: dwell times x1.5, which the clock applies by running slower, so every cue keeps its design time. Under it the
   Field draws its rest pose and answers an input with the end state: no spring, no wave, no ripple, no drift. */
function setStill(v){STILL=!!v;S.mul=STILL?1.5:1;document.body.classList.toggle('still',STILL);$('#c-still').checked=STILL;
 if(STILL){FD.snapAll();S.bodyD=1;}}
var mq=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
if(mq){setStill(mq.matches);if(mq.addEventListener)mq.addEventListener('change',function(e){setStill(e.matches);});}

/* ================================================================ boot */
var q=location.search;
if(/[?&]clean\b/.test(q))document.body.classList.add('clean');
DECK.fl=new Deck('fl-deck');DECK.rel=new Deck('rel-deck');
DECK.b1=new Deck('b1-deck');DECK.b2=new Deck('b2-deck');DECK.sig=new Deck('sig-deck');
buildChips();buildBody();buildStrip();ctlState();
S.bodyAT=0;S.bodyW=0;
if(window.ResizeObserver)new ResizeObserver(function(){relayout();}).observe(stage);
window.addEventListener('resize',function(){fitFrame();});
fitFrame();relayout();
try{history.replaceState({a:'login'},'',location.href);}catch(e){}
go('login',{snap:true,nopush:true});
requestAnimationFrame(function(t){S.last=t;requestAnimationFrame(frame);});

/* handles for the screenshot script, the probes and the owner's console */
window.MOCK={advance:function(sec){var n=Math.round(sec*60);for(var i=0;i<n;i++)step(1/60);draw();},jump:jump,go:go,S:S,ACT:ACT,FD:FD,MEAS:MEAS,timeLine:timeLine,pathSeconds:pathSeconds,setStill:setStill,showStop:showStop,relayout:relayout,fitFrame:fitFrame,
 pickStart:function(i){S.live=true;pickStart(i,SETS.start.els[i]);},pickFeel:function(i){S.live=true;pickFeel(i,SETS.feel.els[i<0?SETS.feel.els.length-1:i]);},
 pickPlace:function(i){S.live=true;pickPlace(i,$$('#bodyt .bt')[i]);},PLACES:PLACES,STARTS:STARTS,FEELS:FEELS,restart:restart,POSE:POSE,doStory:doStory,applyFix:applyFix};
})();
