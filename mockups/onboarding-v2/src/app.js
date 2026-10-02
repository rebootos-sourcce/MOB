/* onboarding-v2 mockup. No network, no dependencies, no audio.

   THE SHAPE. One clock, REEL time S.t in seconds, local to the act that is
   running. Every picture is a pure function of (act, S.t) drawn on one canvas,
   so the film can be paused, held, seeked, jumped into and screenshotted at an
   exact instant, and the owner's Speed control is a multiplier on dt and
   nothing else. Text lives in the DOM as cards that fade in 420 ms and out
   220 ms, driven by cues on the same clock. CSS transitions are 120, 220, 320
   and 420 ms only; anything longer is on the canvas.

   WHAT IS REAL AND WHAT IS A STUB is listed in NOTES.md. The short version:
   the 112 addresses, the seven seat colours and the shipped release lines are
   read from the engine's own tables at build time; the reading is a fourteen
   word lexicon, the distress frame is inert, there is no audio and no account. */
(function(){
'use strict';

/* ================================================================ data */
var PAL=['#D6524C','#D8924E','#DABF6A','#5FD5A6','#5EBBDB','#7D93E0','#A77EDB'];   /* PAL in engine/data/canon.js */
var SEAT=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];               /* the engine's band names */
var NODES=/*NODES*/[]/*END*/;                                                         /* [i, k, band, nerve] x 112, from engine/data/nodes.js */
var BAND=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
var INK=[239,237,232], INK40=[100,100,99], BGC='#06060a';

/* twelve starting points, clockwise from twelve. s is the seat a pick would seed. It is a STUB: no table in the
   engine maps a topic to a seat (creative pass 3), so the pick only places a 12 px ink seed mark and never a hue. */
var STARTS=[
 {k:'anxiety',n:'Anxiety',s:0},{k:'anger',n:'Anger',s:2},{k:'overwhelm',n:'Overwhelm',s:2},
 {k:'burnout',n:'Burnout',s:2},{k:'grief',n:'Grief',s:3},{k:'fear',n:'Fear',s:0},
 {k:'relationships',n:'Relationships',s:3},{k:'pain',n:'Pain',s:0},{k:'selfworth',n:'Self-worth',s:1},
 {k:'purpose',n:'Purpose',s:6},{k:'money',n:'Money',s:0},{k:'other',n:'Something else',s:-1}];

/* the stub reading. Values are the engine's own LEX entries (seat, amount), fourteen of the real words. */
var LEX={afraid:[0,16],panicking:[0,28],exhausted:[2,26],snapped:[2,22],angry:[2,18],mortified:[1,26],criticised:[1,22],
 grief:[3,26],lonely:[3,20],sad:[3,16],interrupted:[4,20],betrayed:[4,28],overthinking:[5,22],pointless:[6,22]};

/* Reel A. dwell = max(3.0, 1.0 + words / 2.5), up to 0.5 s, cap 7.0, checked in DWELLCHECK below. */
var SL=[
 {id:'A1',text:'Welcome to a neurosomatic experience.',dwell:3.0,lineIn:.4},
 {id:'A2',text:'Awareness and intuition is a tool we use to turn your senses inward.',dwell:6.5,ruled:true},
 {id:'A3',text:'This is a mirror. It shows what is running you.',dwell:5.0},
 {id:'A4',text:'It reads {N} addresses. Each is a place in your body.',dwell:5.0},
 {id:'A5',text:'Discover. Play. Flow. Embody. Then round again.',dwell:5.0}];
var LOOP=['Discover','Play','Flow','Embody'];

/* The release, SHORTENED for the mockup and labelled so on screen. The real table is in REAL. */
var REL={gift:.6,caps:[3.6,6.6,9.6,13.6],stem:16.6,own:18.4,hint:21.0,lines0:23.0,lineLen:2.0,n:12,settle0:47.0,settleLen:10.0};
REL.end=REL.settle0+REL.settleLen;
var REL_WELCOME=['Sit down. Put both feet on the floor.','Move your awareness inside your body.',
 'Take one deep breath. Feel what your body is doing mechanically.','Keep your awareness inside your body.'];
var REL_SETTLE_LINE='Keep your awareness inside your body for two minutes.';
var ENTRY=['I let go of ','I give up ','I forgive myself for '];
var REAL={pick:5,story:30,open:38.5,lines:48,settle:120,b:11};   /* seconds, the silent column of the narrative cue table */
var GIFT_START=100;                                              /* STUB for the engine's gift number */
var SIG=[['Bring your attention to your throat.',3.5],['Think yes, ten times. Notice how it feels there.',12],['Now think no, ten times. Notice how that feels.',12]];
var SIG_LEN=SIG.reduce(function(a,s){return a+s[1];},0);

var ICONS={
 anxiety:'<circle cx="22" cy="24" r="12"/><circle cx="27" cy="24" r="12" opacity=".5"/>',
 overwhelm:'<circle cx="18.5" cy="20" r="9"/><circle cx="29.5" cy="20" r="9"/><circle cx="24" cy="29.5" r="9"/>',
 anger:'<circle cx="24" cy="24" r="17"/><path d="M27 11 L20 25 L28 25 L21 37"/>',
 burnout:'<path d="M24 7 A17 17 0 1 1 7 24"/><circle cx="10" cy="16.5" r="1.3"/><circle cx="15.5" cy="10.5" r="1.3"/>',
 pain:'<circle cx="24" cy="24" r="17"/><path d="M2 24 H21"/><circle cx="24" cy="24" r="3"/>',
 grief:'<circle cx="24" cy="19" r="12"/><path d="M24 31 V39"/><circle cx="24" cy="43" r="1.4"/>',
 fear:'<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="3.5"/><path d="M24 10 V16 M24 38 V32 M10 24 H16 M38 24 H32"/>',
 relationships:'<circle cx="13" cy="24" r="8"/><circle cx="35" cy="24" r="8"/><path d="M21 24 H27"/>',
 selfworth:'<circle cx="24" cy="24" r="17"/><circle cx="24" cy="31" r="5"/>',
 money:'<circle cx="24" cy="24" r="17"/><path d="M16 20 H32 M16 28 H32"/>',
 purpose:'<circle cx="24" cy="24" r="17"/><path d="M24 24 L36 12"/><circle cx="36" cy="12" r="2.4"/>',
 other:'<circle cx="24" cy="24" r="17" stroke-dasharray="3 5.2"/><circle cx="24" cy="24" r="2.2"/>',
 guest:'<circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="18" stroke-dasharray="2 4.5"/>',
 pause:'<path d="M17 13 V35 M31 13 V35"/>',
 play:'<path d="M17 12 L36 24 L17 36Z"/>',
 sound:'<path d="M8 19 H15 L24 11 V37 L15 29 H8Z"/><path d="M31 17 Q37 24 31 31"/>',
 muted:'<path d="M8 19 H15 L24 11 V37 L15 29 H8Z"/><path d="M32 18 L42 30 M42 18 L32 30"/>'};
function ico(n,s){return '<svg class="ic" width="'+(s||24)+'" height="'+(s||24)+'" viewBox="0 0 48 48" aria-hidden="true">'+(ICONS[n]||'')+'</svg>';}

/* ================================================================ helpers */
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function lerp(a,b,u){return a+(b-a)*u;}
function bez(x1,y1,x2,y2){
 var cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
 function X(t){return ((ax*t+bx)*t+cx)*t;} function Y(t){return ((ay*t+by)*t+cy)*t;}
 function dX(t){return (3*ax*t+2*bx)*t+cx;}
 return function(x){
  if(x<=0)return 0; if(x>=1)return 1;
  var t=x,i,e,d;
  for(i=0;i<8;i++){e=X(t)-x; if(Math.abs(e)<1e-5)break; d=dX(t); if(Math.abs(d)<1e-6)break; t-=e/d;}
  if(Math.abs(X(t)-x)>1e-4||t<0||t>1){var lo=0,hi=1;t=x;for(i=0;i<24;i++){if(X(t)<x)lo=t;else hi=t;t=(lo+hi)/2;}}
  return Y(t);};}
var EOUT=bez(.22,1,.36,1), EIN=bez(.4,0,1,1), ELAND=bez(.34,1.56,.64,1), EDRAW=bez(.45,0,.15,1);
function rgba(c,a){return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')';}
function hex(h){return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)];}
function mix(a,b,u){return 'rgb('+Math.round(lerp(a[0],b[0],u))+','+Math.round(lerp(a[1],b[1],u))+','+Math.round(lerp(a[2],b[2],u))+')';}
function words(s){return (String(s).match(/[A-Za-z0-9'’-]+/g)||[]);}
function cap1(s){return s.charAt(0).toUpperCase()+s.slice(1);}

/* The dwell rule, stated once and checked against the table so a typed number cannot drift from it (the repository has
   been bitten by that nine times). A4 has eleven words, which the rule rounds to 5.5; the narrative table says 5.0. */
function dwellRule(txt){var w=words(txt.replace('{N}',String(NODES.length))).length;return Math.min(7,Math.ceil(Math.max(3,1+w/2.5)*2)/2);}
var DWELLCHECK=SL.map(function(s){return {id:s.id,table:s.dwell,rule:dwellRule(s.text),words:words(s.text.replace('{N}','112')).length};});

/* ================================================================ stage, state, layout */
var stage=$('#stage'), cv=$('#cv'), ctx=cv.getContext('2d');
var W=0,H=0,DPR=1,STILL=false;
var S={act:'login',t:0,mask:0,rate:1,speed:1,mul:1,last:0,cues:[],card:null,outDone:false,
 mode:'account',door:'login',pick:null,seat:null,word:null,src:'',words:'',empty:0,seed:-1,
 breathOn:false,breathR:0,breathT:0,tableQ:false,stop:false,stopv:'direct',live:false,bead:null,
 lastBack:-9,width:'fit',end:'',sealed:0,answered:'',sigQ:false,made:false};
var POSE={cur:{cx:0,cy:0,h:0},from:null,to:null,t:0,dur:.42};
var DECK={};

function lay(kind){
 var nar=W<=700, sho=H<=480&&W>H, h;
 if(kind==='reel'){
  if(sho){h=Math.min(.7*H,300);return {cx:.27*W,cy:.5*H,h:h};}
  h=clamp(.34*H,220,340);return {cx:W/2,cy:.40*H,h:h};}
 if(kind==='gate'){
  if(nar){h=clamp(.22*H,120,200);return {cx:W/2,cy:.26*H,h:h};}
  h=clamp(.2*H,160,220);return {cx:W/2,cy:.56*H,h:h};}
 if(kind==='top'){
  h=H<560?72:(nar?96:150);return {cx:W/2,cy:nar||H<560?24+h/2:Math.max(30+h/2,.16*H),h:h};}
 return {cx:W/2,cy:H/2,h:200};}
function ringR(p){return Math.min(p.h*.6,W/2-44,H/2-36);}
function seatXY(p,i){var s=p.h/178;return {x:p.cx,y:p.cy+(160-20*i-89)*s};}

function relayout(){
 W=stage.clientWidth;H=stage.clientHeight;DPR=Math.min(2,window.devicePixelRatio||1);
 cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);
 var top=lay('top');stage.style.setProperty('--top-b',(top.cy+top.h/2+(W<=700?4:10))+'px');
 var g=lay('gate');stage.style.setProperty('--gate-fb',(g.cy+g.h/2)+'px');
 layoutChips();
 var A=ACT[S.act];if(A&&A.pose){POSE.cur=lay(A.pose);POSE.to=null;}
 draw();}
function setPose(to,dur,snap){
 if(snap||STILL||!POSE.cur.h){POSE.cur=to;POSE.to=null;return;}
 POSE.from={cx:POSE.cur.cx,cy:POSE.cur.cy,h:POSE.cur.h};POSE.to=to;POSE.t=0;POSE.dur=dur||.42;}
function stepPose(dt){
 if(!POSE.to)return;
 POSE.t+=dt;var u=clamp(POSE.t/POSE.dur,0,1),e=EOUT(u),f=POSE.from,t=POSE.to;
 var dx=t.cx-f.cx,dy=t.cy-f.cy,d=Math.sqrt(dx*dx+dy*dy)||1,bend=.12*d*Math.sin(Math.PI*e);   /* travel is bent 12 percent */
 POSE.cur={cx:lerp(f.cx,t.cx,e)+(-dy/d)*bend,cy:lerp(f.cy,t.cy,e)+(dx/d)*bend,h:lerp(f.h,t.h,e)};
 if(u>=1){POSE.cur=t;POSE.to=null;}}

/* A tween read off the clock. Under reduced motion every move is its end state at the cue time. */
function tw(t,t0,d,e){if(STILL)return t>=t0?1:0;var u=clamp((t-t0)/d,0,1);return (e||EOUT)(u);}

/* ================================================================ decks and cues */
function Deck(id){this.el=$('#'+id);this.cur=null;}
Deck.prototype.show=function(html,nt){
 var n=document.createElement('div');n.className='card'+(nt?' nt':'');n.innerHTML=html;this.el.appendChild(n);
 var old=this.cur;this.cur=n;if(old)this._out(old);
 if(nt)n.classList.add('in');else{void n.offsetWidth;requestAnimationFrame(function(){n.classList.add('in');});}
 return n;};
Deck.prototype._out=function(n){n.classList.remove('in');n.classList.add('out');setTimeout(function(){if(n.parentNode)n.parentNode.removeChild(n);},260);};
Deck.prototype.hide=function(){if(this.cur){this._out(this.cur);this.cur=null;}};
Deck.prototype.clear=function(){this.el.innerHTML='';this.cur=null;};
function cue(t,f){S.cues.push({t:t,f:f,done:false});}
function runCues(){for(var i=0;i<S.cues.length;i++){var c=S.cues[i];if(!c.done&&S.t>=c.t){c.done=true;c.f();}}}
function say(t){$('#live').textContent=t;}

/* ================================================================ acts */
var ACT={};
var SECS={};
['login','reel','gate','story','read','rel','b1','b2','b3','sig','end'].forEach(function(k){SECS[k]=$('#s-'+k);});
function showSec(k){Object.keys(SECS).forEach(function(j){SECS[j].classList.toggle('on',j===k);});}

ACT.login={sec:'login',ctl:'',enter:function(){
 var lg=$('#lg');lg.classList.remove('gone');$('#hair').classList.remove('on');}};
ACT.transit={sec:'login',ctl:'',clocked:true,len:.62,next:'A1',film:true,enter:function(){
 /* fields fade 220 ms ease in, then the ring scales 1 to 1.5 and fades over 420 ms, ending on the first frame of Reel A.
    The ground is the door's own #06060a, so there is no seam to hide. */
 cue(0,function(){$('#lg').classList.add('gone');});}};
SL.forEach(function(s,i){
 ACT[s.id]={sec:'reel',ctl:'pause sound skip',clocked:true,film:true,len:s.dwell,pose:'reel',hair:i,
  next:i<4?SL[i+1].id:'gate',deck:'reel',enter:function(o){enterSlide(i,o);}};});
ACT.gate={sec:'gate',ctl:'leave',pose:'gate',enter:function(o){enterGate(o);}};
ACT.story={sec:'story',ctl:'',pose:'top',enter:function(o){enterStory(o);}};
ACT.read={sec:'read',ctl:'',pose:'reel',deck:'read',enter:function(o){enterRead(o);}};
ACT.rel={sec:'rel',ctl:'pause sound skip',clocked:true,film:true,len:REL.end,next:'b1',deck:'rel',enter:function(o){enterRel(o);}};
ACT.b1={sec:'b1',ctl:'',pose:'reel',deck:'b1',enter:function(o){enterB1(o);}};
ACT.b2={sec:'b2',ctl:'pause sound skip',clocked:true,film:true,len:5.0,next:'b3',pose:'reel',deck:'b2',enter:function(o){enterB2(o);}};
ACT.b3={sec:'b3',ctl:'',pose:'top',enter:function(o){enterB3(o);}};
ACT.sig={sec:'sig',ctl:'pause sound skip',clocked:true,film:true,len:SIG_LEN,holdEnd:true,pose:'reel',deck:'sig',enter:function(o){enterSig(o);},
 onEnd:function(){S.sigQ=true;stage.dataset.ctl='';$('#sig-q').classList.add('in');$('#sig-reply').textContent='';$('#sig-back').hidden=true;
  $('#sig-qt').hidden=false;$$('#sig-q .signalq').forEach(function(e){e.hidden=false;});DECK.sig.hide();say('Did the two feel different?');}};
ACT.end={sec:'end',ctl:'',enter:function(){
 var m={login:['Log in goes to the Field.','A returning person skips the film and lands where they left off.'],
  leave:['The Field opens here.','Leave writes that onboarding is done and opens the Field unread. Nothing was read.'],
  notnow:['The Field opens here.','The reading stays on this device.'],
  account:['The Field opens here.','Your story moves to your account.'],
  guest:['The Field opens here.','This stays on this device.'],
  stop:['The Field opens here.','Unread. No release was run.']}[S.end]||['The Field opens here.',''];
 $('#end-h').textContent=m[0];$('#end-sub').textContent=m[1];
 $('#end-cap').textContent='Mockup end. In the build the figure arcs into the Field hub here.';
 $('#hair').classList.remove('on');}};

function go(id,o){
 o=o||{};var A=ACT[id];if(!A)return;
 var prev=ACT[S.act];
 if(prev&&prev.deck&&prev.deck!==A.deck)DECK[prev.deck].hide();
 if(A.deck&&(!prev||prev.deck!==A.deck))DECK[A.deck].clear();
 S.act=id;S.t=o.t||0;S.cues=[];S.outDone=false;S.card=null;S.rate=o.snap?1:S.rate;
 if(id!=='gate'){S.live=false;}
 stage.dataset.act=id;stage.dataset.ctl=A.ctl||'';
 stage.classList.toggle('film',!!A.film);
 stage.classList.toggle('stats-on',id==='rel');
 $('#hair').classList.toggle('on',A.hair!=null);
 $('#soundl').textContent=id==='rel'?'Hear it':'';
 showSec(A.sec);
 if(A.pose)setPose(lay(A.pose),.42,o.snap);
 if(A.enter)A.enter(o);
 runCues();
 if(!o.nopush)pushH(id);
 var js=$('#c-jump');if(js&&$('option[value="'+id+'"]',js))js.value=id;
 ctlState();}

/* ---- Reel A */
function a4Extra(){
 var r=NODES[0]||[1,'Fear','Root','Lumbar Plexus'];   /* the first real row, read at run time */
 return '<div class="proof after" id="proof"><div class="row" style="display:flex;gap:14px;justify-content:center;align-items:center;margin-top:24px;font-size:var(--f16);line-height:24px">'
  +'<span>'+r[1]+'</span><span style="color:var(--mid);display:inline-flex;align-items:center;gap:8px"><i style="width:10px;height:10px;border-radius:50%;background:'+PAL[BAND.indexOf(r[2])]+'"></i>'+r[2]+'</span>'
  +'<span style="color:var(--mid)">'+r[3]+'</span></div>'
  +'<p class="cap" style="margin-top:6px">From the addresses table. Row '+r[0]+' of '+NODES.length+'.</p>'
  +'<div style="margin-top:12px"><button type="button" class="ring quiet" id="tbl-q">'+(S.tableQ?'Opens after the film':'Open the table')+'</button></div></div>';}
function slideHTML(i){
 var s=SL[i],txt=s.text.replace('{N}','<b class="n pre">'+NODES.length+'</b>');
 return '<p class="hero">'+txt+'</p>'+(i===3?a4Extra():'');}
function enterSlide(i,o){
 var s=SL[i],d=DECK.reel;
 cue(s.lineIn||0,function(){S.card=d.show(slideHTML(i),!!(o&&o.snap));say(s.text.replace('{N}',String(NODES.length)));});
 if(i===3){
  cue(.5,function(){var p=$('#proof');p&&p.classList.add('in');});
  cue(1.4,function(){var n=$('#reel-deck .n');n&&n.classList.add('land');});
  cue(2.0,function(){var b=$('#tbl-q');if(b)b.classList.add('live');});}}

/* ---- the gate */
var chipEls=[];
function buildChips(){
 var host=$('#chips');host.innerHTML='';chipEls=[];
 STARTS.forEach(function(s,i){
  var b=document.createElement('button');b.type='button';b.className='chip';b.dataset.k=s.k;b.style.setProperty('--i',i);
  b.innerHTML=ico(s.k,24)+'<span class="lab">'+s.n+'</span>';b.setAttribute('aria-label',s.n);
  b.addEventListener('click',function(){pickStart(i,b);});host.appendChild(b);chipEls.push(b);});}
function relPos(el){var r=el.getBoundingClientRect(),sr=stage.getBoundingClientRect(),k=sr.width/(stage.clientWidth||1)||1;
 return {x:(r.left+r.width/2-sr.left)/k,y:(r.top+r.height/2-sr.top)/k};}
function layoutChips(){
 var host=$('#chips');if(!host||!chipEls.length||!W)return;
 var ring=W>700;host.className='chips'+(ring?' lay-ring':' lay-grid');
 var gp=lay('gate');
 if(ring){
  var ry=.33*H,rx=Math.min(.36*W,ry*1.9);
  chipEls.forEach(function(c,i){
   var a=i*Math.PI/6,x=gp.cx+rx*Math.sin(a),y=gp.cy-ry*Math.cos(a);
   c.style.setProperty('--x',x.toFixed(1));c.style.setProperty('--y',y.toFixed(1));
   c.style.setProperty('--tx',(gp.cx-x).toFixed(1)+'px');c.style.setProperty('--ty',(gp.cy-y).toFixed(1)+'px');
   var sn=Math.sin(a);c.className=c.className.replace(/\bl-[trlb]\b/g,'').trim()+' '+(i===0?'l-t':i===6?'l-b':sn>0?'l-r':'l-l');});
 }else{
  chipEls.forEach(function(c){c.className=c.className.replace(/\bl-[trlb]\b/g,'').trim();});
  requestAnimationFrame(function(){chipEls.forEach(function(c){var p=relPos(c);
   c.style.setProperty('--tx',(gp.cx-p.x).toFixed(1)+'px');c.style.setProperty('--ty',(gp.cy-p.y).toFixed(1)+'px');});});}}
/* HONEST TIME LINE. Computed from the cue table, never typed. It is printed only when the measured path from the pick
   to the end of Reel B is within 30 s of four minutes (narrative pass 3), and rounded to the nearest minute. */
function pathSeconds(){return REAL.pick+REAL.story+REAL.open+REAL.lines+REAL.settle+REAL.b;}
function timeLine(){
 var s=pathSeconds(),m=Math.round(s/60),w=['zero','one','two','three','four','five','six','seven'];
 return Math.abs(s-240)<=30?'About '+w[m]+' minutes. Stop any time.':'';}
function enterGate(o){
 var g=$('#s-gate');g.classList.remove('live','picked','fold');
 chipEls.forEach(function(c){c.classList.remove('picked');c.style.transition='';c.style.transform='';});
 S.live=false;S.bead=null;S.picked=false;S.pick=S.pick&&o&&o.keep?S.pick:null;
 $('#gate-t').textContent=timeLine();
 var tb=$('#gate-tbl');tb.hidden=!S.tableQ;
 layoutChips();say('Pick your starting point. '+timeLine());
 $('#gate-h').focus({preventScroll:true});}
function pickStart(i,el){
 if(S.picked||!S.live)return;S.picked=true;S.pick=i;
 var st=STARTS[i],g=$('#s-gate');
 g.classList.add('picked');
 /* the pressed chip Lands 320 ms: set it small with no transition, then let the class carry it home on ease-land */
 el.style.transition='none';el.style.transform='scale(.9)';void el.offsetWidth;el.style.transition='';el.style.transform='';el.classList.add('picked');
 var c=relPos(el);S.bead={x:c.x,y:c.y,t0:S.t+.12,dur:.6};
 S.seed=st.s;
 cue(S.t+.72,function(){g.classList.add('fold');});
 cue(S.t+1.2,function(){go('story');});}

/* ---- the story. No clock: nothing here advances itself. */
function readWords(txt){
 var best=null;words(txt.toLowerCase()).forEach(function(w){var e=LEX[w];if(e&&(!best||e[1]>best.amt))best={word:w,seat:e[0],amt:e[1]};});
 return best;}
function msg(t){$('#msgline').textContent=t;}
function wordCount(){return words($('#words').value).length;}
function syncCommit(){$('#commit').classList.toggle('show',wordCount()>=5);}
function enterStory(o){
 var st=S.pick!=null?STARTS[S.pick]:null;
 S.seed=st?st.s:-1;
 $('#seedlab').textContent=st?'Starting point: '+st.n:'';
 if(!(o&&o.keep)){$('#words').value=S.words||'';S.empty=0;msg('');}
 syncCommit();say('Finish it in your own words.');$('#stem').focus({preventScroll:true});}
function doCommit(){
 var txt=$('#words').value.trim(),r=readWords(txt);
 if(wordCount()<5)return;
 S.words=txt;
 if(r){S.word=r.word;S.seat=r.seat;S.src='words';go('read');return;}
 S.empty++;
 if(S.empty===1){msg('Nothing in that matched a pattern. Name how it felt.');return;}
 var st=S.pick!=null?STARTS[S.pick]:null;
 if(st&&st.s>=0){S.word=st.n;S.seat=st.s;S.src='pick';}
 else{S.word=null;S.seat=0;S.src='none';}
 go('read');}
function seatName(){return SEAT[S.seat==null?0:S.seat];}
function enterRead(o){
 S.breathOn=true;S.breathR=0;
 var line,src;
 if(S.src==='words'){line=cap1(S.word)+' sits at your '+seatName()+'.';src='You wrote “'+S.word+'”.';}
 else if(S.src==='pick'){line=S.word+' sits at your '+seatName()+'.';src='From your pick, not your words.';}
 else{line='Nothing matched.';src='The release starts at the Root.';}
 var d=DECK.read;
 cue(.5,function(){d.show('<p class="hero">'+line+'</p><p class="sub" style="margin-top:12px">'+src+'</p>'
  +'<div style="margin-top:24px"><button type="button" class="ring live" id="go-rel">Begin the release</button></div>',!!(o&&o.snap));say(line+' '+src);});}

/* ---- the release (shortened) */
function relNodes(){
 var seat=BAND[S.seat==null?0:S.seat];
 var l=NODES.filter(function(n){return n[2]===seat&&!/Unnamed/.test(n[1]);}).slice(0,REL.n);
 return l;}
function relLine(i,list){
 var n=list[i%list.length];var k=n[1].toLowerCase().replace(/\s*\((solar|heart)\)/,'');
 return ENTRY[i%3]+k+'.';}
function enterRel(o){
 S.sealed=0;var list=relNodes();S.relList=list;
 var seals=$('#seals');seals.innerHTML='';for(var i=0;i<REL.n;i++)seals.appendChild(document.createElement('i'));seals.classList.remove('on');
 $('#cnt').textContent=GIFT_START;$('#cnt').classList.remove('land');$('#cnt').classList.add('pre');
 $('#mocklab').textContent='Mockup, shortened. Real: his voice for about '+Math.round(REAL.open)+' s, '+REL.n+' lines at 4 s, a '+REAL.settle+' s settle. Here: '+REL.lineLen+' s lines, a '+REL.settleLen+' s settle.';
 var d=DECK.rel,nt=!!(o&&o.snap);
 cue(REL.gift,function(){var c=$('#cnt');c.classList.add('land');d.show('<p class="lead20">'+GIFT_START+' patterns are open to you.</p>',nt);});
 REL_WELCOME.forEach(function(l,i){cue(REL.caps[i],function(){d.show('<p class="hero">'+l+'</p>',nt);say(l);});});
 cue(REL.stem,function(){d.show('<p class="hero">I am releasing believing, thinking, feeling, behaving and acting that I am ...</p><p class="own" id="own"></p>',nt);
  var own=$('#own');own.textContent=S.words||'';});
 cue(REL.own,function(){var o2=$('#own');o2&&o2.classList.add('in');});
 cue(REL.hint,function(){d.show('<p class="lead20">Each line names one pattern. Repeat it in thought as it lands.</p>',nt);});
 for(var j=0;j<REL.n;j++)(function(j){cue(REL.lines0+j*REL.lineLen,function(){var l=relLine(j,list);d.show('<p class="hero">'+l+'</p>',nt);say(l);});})(j);
 cue(REL.settle0,function(){d.show('<p class="hero s">'+REL_SETTLE_LINE+'</p>',nt);say(REL_SETTLE_LINE);});
 cue(REL.settle0+REL.settleLen-.22,function(){d.hide();});}

/* ---- reel B */
function enterB1(o){
 var d=DECK.b1,nt=!!(o&&o.snap);
 cue(1.2,function(){d.show('<p class="hero">'+seatName()+' is lower.</p><p class="cap" style="margin-top:12px">The outline is where it was. The colour is where it is.</p>'
  +'<div class="after" id="b1-go" style="margin-top:24px"><button type="button" class="ring" id="b1-btn">Go on</button></div>',nt);say(seatName()+' is lower.');});
 cue(3.0,function(){var g=$('#b1-go');g&&g.classList.add('in');});}
function enterB2(o){
 var d=DECK.b2,nt=!!(o&&o.snap);
 cue(.2,function(){S.card=d.show('<p class="hero">This is your avatar.</p><p class="cap" style="margin-top:12px">A lit station is something you did. The rest wait.</p>',nt);say('This is your avatar.');});
 cue(5.0-.22,function(){d.hide();});}
function enterB3(o){
 var guest=S.mode==='guest';
 $('#b3-h').textContent=guest?'This stays on this device.':'Keep this reading?';
 $('#b3-sub').textContent=guest?'Guest keeps everything on this device. Clearing the browser clears it.':'Your story moves to your account. Your name and birth data stay on this device.';
 $('#b3-pair').hidden=guest;$('#b3-guestgo').hidden=!guest;
 $('#b3-fine').classList.remove('on');$('#b3-keep').classList.remove('live');
 $('#b3-tick').checked=false;$('#b3-make').disabled=true;
 say($('#b3-h').textContent);$('#b3-h').focus({preventScroll:true});}
function enterSig(o){
 S.sigQ=false;$('#sig-q').classList.remove('in');$('#sig-qt').hidden=false;$$('#sig-q .signalq').forEach(function(e){e.hidden=false;});$('#sig-reply').textContent='';$('#sig-back').hidden=true;
 var d=DECK.sig,t=0,nt=!!(o&&o.snap);
 SIG.forEach(function(s){cue(t,function(){d.show('<p class="hero s" style="font-size:var(--f28);line-height:36px;font-weight:400">'+s[0]+'</p>',nt);say(s[0]);});t+=s[1];});}

/* ================================================================ drawing */
function figAlpha(){
 if(!S.breathOn||STILL)return 1;
 var ramp=clamp(S.breathR/1.2,0,1),ph=(S.breathT%4.2)/4.2;
 var sm=function(x){return x*x*(3-2*x);};
 var shape=ph<.4?sm(ph/.4):1-sm((ph-.4)/.6);                 /* in for 1.7 s, out for 2.5 s: the exhale is longer */
 return 1-ramp*(1-(.64+.36*shape));}
function drawFigure(c,p,o){
 var s=p.h/178,X=function(x){return p.cx+(x-100)*s;},Y=function(y){return p.cy+(y-89)*s;};
 var i,r=Math.min(4.6*s,6);
 c.save();c.globalAlpha=o.alpha==null?1:o.alpha;
 var sp=o.spine==null?1:o.spine;
 if(sp>0){c.strokeStyle=rgba(INK,.4);c.lineWidth=1.5;c.beginPath();c.moveTo(X(100),Y(160));c.lineTo(X(100),Y(160-120*sp));c.stroke();}
 if(o.halo>0){c.strokeStyle=rgba(INK,.85);c.lineWidth=1.5;c.beginPath();c.ellipse(X(100),Y(21),13*s,4.4*s,0,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,o.halo));c.stroke();}
 for(i=0;i<7;i++){
  var L=o.land?o.land[i]:1;if(L<=0)continue;
  var hu=o.hue?o.hue[i]:0;
  c.fillStyle=mix(INK40,hex(PAL[i]),hu);c.beginPath();c.arc(X(100),Y(160-20*i),Math.max(.1,r*L),0,6.2832);c.fill();}
 c.restore();}
function arcRing(c,cx,cy,r,prog,col,lw,a){
 if(prog<=0||a<=0)return;c.save();c.globalAlpha=a;c.strokeStyle=col;c.lineWidth=lw;c.beginPath();
 c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,prog));c.stroke();c.restore();}
function dot(c,x,y,r,col,a){c.save();c.globalAlpha=a==null?1:a;c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,6.2832);c.fill();c.restore();}
function ringMark(c,x,y,r,col,lw,a){c.save();c.globalAlpha=a==null?1:a;c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.arc(x,y,r,0,6.2832);c.stroke();c.restore();}
function ticks112(c,cx,cy,r,len,a,hi,hiHue,hiP){
 c.save();c.lineCap='round';c.lineWidth=r<40?1:1.5;
 for(var j=0;j<112;j++){
  var ang=Math.PI/2+j*Math.PI*2/112,ca=Math.cos(ang),sa=Math.sin(ang);
  var al=a*(STILL?1:clamp((hiP.grow-j*.006)/.2,0,1));
  if(al<=0)continue;
  var isH=(j===hi),l=isH?len*1.8:len;
  c.strokeStyle=isH&&hiP.on?hiHue:rgba(INK,.4);c.lineWidth=isH&&hiP.on?(r<40?2:3):(r<40?1:1.5);c.globalAlpha=al;
  c.beginPath();c.moveTo(cx+ca*r,cy+sa*r);c.lineTo(cx+ca*(r+l),cy+sa*(r+l));c.stroke();}
 c.restore();}
function loginRing(c,k,a){
 var nar=W<=700,cx=W/2,cy=nar?140:H/2,r=nar?98:Math.min(W,H)*.335,tl=nar?8:11,i;
 var br=STILL?.75:.55+.4*(.5-.5*Math.cos(S.breathT*2*Math.PI/9));   /* login ring breathes on a 9 s period */
 c.save();c.translate(cx,cy);c.scale(k,k);c.translate(-cx,-cy);c.globalAlpha=a*br;
 c.lineCap='round';c.lineWidth=2;
 for(i=0;i<112;i++){var s=Math.floor(i/16),ang=Math.PI/2+i*Math.PI*2/112+Math.PI/112;
  c.strokeStyle=PAL[s];c.beginPath();c.moveTo(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r);c.lineTo(cx+Math.cos(ang)*(r+tl),cy+Math.sin(ang)*(r+tl));c.stroke();}
 [1.2,1.44,1.72].forEach(function(m,ri){c.lineWidth=1.4;c.globalAlpha=a*(.38-ri*.09);
  for(var s=0;s<7;s++){var a0=Math.PI/2+s*Math.PI*2/7+.038+ri*.05,a1=Math.PI/2+(s+1)*Math.PI*2/7-.038+ri*.05;
   c.strokeStyle=PAL[s];c.beginPath();c.arc(cx,cy,r*m,a0,a1);c.stroke();}});
 c.restore();}
/* the loop: one circle, four stations. Unlit in Reel A, lit only for an act done in Reel B. */
function loopDraw(c,p,o){
 var R=ringR(p),cx=p.cx,cy=p.cy,i;
 arcRing(c,cx,cy,R,o.prog,rgba(INK,.4),1.5,1);
 var ang=[-Math.PI/2,0,Math.PI/2,Math.PI];
 c.save();c.font='400 13px Inter,system-ui,sans-serif';c.textBaseline='middle';
 for(i=0;i<4;i++){
  var L=o.st[i];if(L<=0)continue;
  var x=cx+R*Math.cos(ang[i]),y=cy+R*Math.sin(ang[i]),lit=o.lit&&o.lit[i];
  if(lit){dot(c,x,y,6*Math.max(.1,L),rgba(INK,.85));}
  else{dot(c,x,y,6*Math.max(.1,L),BGC);ringMark(c,x,y,6*Math.max(.1,L),rgba(INK,.4),1.5);}
  c.globalAlpha=clamp(L*2,0,1);c.fillStyle=lit?rgba(INK,.85):'#94908A';
  var tx=x,ty=y;
  if(i===0){c.textAlign='center';ty=y+22;}else if(i===2){c.textAlign='center';ty=y-22;}else if(i===1){c.textAlign='right';tx=x-16;}else{c.textAlign='left';tx=x+16;}
  c.fillText(LOOP[i],tx,ty);c.globalAlpha=1;}
 c.restore();
 if(o.dot!=null&&o.dot>0){var a=-Math.PI/2+o.dot*Math.PI*2;dot(c,cx+R*Math.cos(a),cy+R*Math.sin(a),4,rgba(INK,.85));}}

function sceneReel(c,i,t,p){
 var R=ringR(p),cx=p.cx,cy=p.cy,j,s7=function(v){return [v,v,v,v,v,v,v];};
 var o={hue:s7(1),land:s7(1),spine:1,halo:1};
 if(i===0){
  o.spine=tw(t,0,.7,EDRAW);o.halo=tw(t,.9,.9,EDRAW);
  for(j=0;j<7;j++)o.land[j]=tw(t,.2+.09*j,.32,ELAND);}
 if(i===1){
  [.5,.75,1].forEach(function(m,k){arcRing(c,cx,cy,R*m,tw(t,.6+.15*k,.9,EDRAW),rgba(INK,.4),1,1);});
  var pop=t>4.1&&t<4.42&&!STILL?Math.sin(Math.PI*(t-4.1)/.32):0;
  for(j=0;j<7;j++)o.land[j]=1+.35*pop;}
 if(i===2){[.5,.75,1].forEach(function(m){arcRing(c,cx,cy,R*m,1,rgba(INK,.4),1,1);});}
 drawFigure(c,p,o);
 if(i===1&&t>=1.5&&t<4.1){
  var u=tw(t,3.0,1.1,EIN),ap=tw(t,1.5,.22,EOUT);
  for(j=0;j<7;j++){
   var th=-Math.PI/2+(j+.5)*Math.PI*2/7,x0=cx+R*Math.cos(th),y0=cy+R*Math.sin(th),sp=seatXY(p,j);
   var dx=sp.x-x0,dy=sp.y-y0,d=Math.sqrt(dx*dx+dy*dy)||1,bend=.12*d*Math.sin(Math.PI*u);
   dot(c,lerp(x0,sp.x,u)+(-dy/d)*bend,lerp(y0,sp.y,u)+(dx/d)*bend,4,PAL[j],ap);}}
 if(i===3){
  var ra=1-tw(t,0,.22,EIN);
  [.5,.75,1].forEach(function(m){arcRing(c,cx,cy,R*m,1,rgba(INK,.4),1,ra);});
  var hp={grow:STILL?9:(t-.3)*1.25,on:t>=1.4};         /* ticks sweep clockwise from the root, 112 of them, over about 1.1 s */
  ticks112(c,cx,cy,R,Math.max(6,R*.045),1,0,PAL[0],hp);}
 if(i===4){
  var ta=1-tw(t,0,.22,EIN);
  if(ta>0)ticks112(c,cx,cy,R,Math.max(6,R*.045),ta,-1,PAL[0],{grow:9,on:false});
  var st=[];for(j=0;j<4;j++)st.push(tw(t,.9+j*1.0,.32,ELAND));
  var dp=tw(t,.9,4.0,function(x){return x;});               /* one dot, once round, linear: it is real time */
  loopDraw(c,p,{prog:tw(t,0,.9,EDRAW),st:st,lit:[0,0,0,0],dot:dp});}
 }

function sceneRead(c,t,p){
 var hue=[0,0,0,0,0,0,0];if(S.seat!=null&&S.src!=='none')hue[S.seat]=tw(t,.3,.42,EOUT);
 var land=[1,1,1,1,1,1,1];if(S.seat!=null&&S.src!=='none'&&!STILL){var u=t-.3;land[S.seat]=1+(u>0&&u<.32?.35*Math.sin(Math.PI*u/.32):0);}
 drawFigure(c,p,{hue:hue,land:land,alpha:figAlpha()});
 if(S.seat!=null&&S.src!=='none'){var sp=seatXY(p,S.seat),a=tw(t,.3,.32,ELAND);
  ringMark(c,sp.x,sp.y,.062*p.h*Math.max(a,0),mix(INK40,hex(PAL[S.seat]),1),1.5,clamp(a,0,1));}}

function sceneGate(c,t,p){
 var hue=[1,1,1,1,1,1,1],d=tw(t,0,.42,EOUT);hue=hue.map(function(){return 1-d;});
 drawFigure(c,p,{hue:hue});
 /* the loop circle from slide 5 stays for a moment around the figure, then folds in with it */
 var fa=1-tw(t,0,.22,EIN);
 if(fa>0){arcRing(c,p.cx,p.cy,ringR(p),1,rgba(INK,.4),1.5,fa);}
 if(S.bead){var b=S.bead,u=tw(S.t-b.t0,0,b.dur,EIN);
  if(S.t>=b.t0){var to=S.seed>=0?seatXY(p,S.seed):{x:p.cx,y:p.cy};
   var dx=to.x-b.x,dy=to.y-b.y,dd=Math.sqrt(dx*dx+dy*dy)||1,bend=.12*dd*Math.sin(Math.PI*u);
   var done=S.t>=b.t0+b.dur;
   if(!done)dot(c,lerp(b.x,to.x,u)+(-dy/dd)*bend,lerp(b.y,to.y,u)+(dx/dd)*bend,4,rgba(INK,.85));
   else if(S.seed>=0)ringMark(c,to.x,to.y,7,rgba(INK,.85),1.5,tw(S.t,b.t0+b.dur,.32,ELAND));}}}
function sceneStory(c,t,p){
 drawFigure(c,p,{hue:[0,0,0,0,0,0,0]});
 if(S.seed>=0){var sp=seatXY(p,S.seed);ringMark(c,sp.x,sp.y,7,rgba(INK,.85),1.5,1);}}   /* the seed mark: a 12 px ink ring, never a hue */
function sceneRel(c,t){
 var nar=W<=700,a=$('#aslot'),cs=$('#cslot');
 var sealed=clamp(Math.floor((t-REL.lines0)/REL.lineLen),0,REL.n);
 if(t<REL.lines0)sealed=0;
 /* address ring, small, upper left: 112 ticks, the current line's address in its seat's hue at 12 px or less */
 var r1=a.getBoundingClientRect(),sr=stage.getBoundingClientRect(),k=sr.width/(stage.clientWidth||1)||1;
 var ax=(r1.left+r1.width/2-sr.left)/k,ay=(r1.top+r1.height/2-sr.top)/k,ar=r1.width/k/2-6;
 var list=S.relList||[],cur=(t>=REL.lines0&&t<REL.settle0)?list[clamp(Math.floor((t-REL.lines0)/REL.lineLen),0,list.length-1)]:null;
 var hi=cur?cur[0]-1:-1;
 ticks112(c,ax,ay,ar,4,1,hi,cur?PAL[BAND.indexOf(cur[2])]:PAL[0],{grow:9,on:!!cur});
 /* gift ring, 100 ticks, one drops to ink 40 per line */
 var r2=cs.getBoundingClientRect(),gx=(r2.left+r2.width/2-sr.left)/k,gy=(r2.top+r2.height/2-sr.top)/k,gr=r2.width/k/2-5;
 var show=tw(t,REL.gift,.42,EOUT);
 if(show>0){c.save();c.lineWidth=1;c.lineCap='butt';c.globalAlpha=show;
  for(var j=0;j<GIFT_START;j++){var ang=-Math.PI/2+j*Math.PI*2/GIFT_START,spent=j>=GIFT_START-sealed;
   c.strokeStyle=spent?rgba(INK,.4):rgba(INK,.85);c.beginPath();c.moveTo(gx+Math.cos(ang)*gr,gy+Math.sin(ang)*gr);c.lineTo(gx+Math.cos(ang)*(gr+5),gy+Math.sin(ang)*(gr+5));c.stroke();}
  c.restore();}
 /* the settle dial, linear because it is real time */
 if(t>=REL.settle0){
  var q=(t-REL.settle0)/REL.settleLen;if(STILL)q=Math.floor(q*REL.settleLen)/REL.settleLen;
  var dr=nar?54:68,dcx=W/2,dcy=H*(nar?.66:.68);
  arcRing(c,dcx,dcy,dr,1,rgba(INK,.4),1.5,1);arcRing(c,dcx,dcy,dr,clamp(q,0,1),rgba(INK,.85),2,1);
  var an=-Math.PI/2+clamp(q,0,1)*Math.PI*2;dot(c,dcx+dr*Math.cos(an),dcy+dr*Math.sin(an),4,rgba(INK,.85));}
 syncRel(sealed,t);}
function syncRel(n,t){
 if(S.sealed!==n){S.sealed=n;
  $$('#seals i').forEach(function(e,i){e.classList.toggle('on',i<n);});
  var c=$('#cnt');c.textContent=GIFT_START-n;
  if(n>0){c.classList.remove('land');c.classList.add('pre');void c.offsetWidth;c.classList.add('land');}}
 $('#seals').classList.toggle('on',t>=REL.lines0&&t<REL.settle0);}
function sceneB1(c,t,p){
 var hue=[0,0,0,0,0,0,0];hue[S.seat||0]=1;
 drawFigure(c,p,{hue:hue,alpha:figAlpha()});
 var sp=seatXY(p,S.seat||0),r0=.062*p.h,r1=.034*p.h,u=tw(t,.8,.9,EOUT);
 ringMark(c,sp.x,sp.y,r0,rgba(INK,.4),1.5,1);
 ringMark(c,sp.x,sp.y,lerp(r0,r1,u),PAL[S.seat||0],1.5,1);}
function sceneB2(c,t,p){
 var hue=[0,0,0,0,0,0,0];hue[S.seat||0]=1;
 drawFigure(c,p,{hue:hue,alpha:figAlpha()});
 /* stations in loop order: Discover, Play, Flow, Embody. Discover is the reading, Flow the release lines, Embody the
    settle. Play is games and nothing here played one, so it stays unlit. */
 var lit=[1,0,1,1];
 var earn=[1.2,0,1.6,2.0],st=earn.map(function(e,i){return i===1?tw(t,.9,.32,ELAND):tw(t,e,.32,ELAND);});
 loopDraw(c,p,{prog:tw(t,.3,.9,EDRAW),st:st,lit:lit});}
function sceneB3(c,t,p){var hue=[0,0,0,0,0,0,0];hue[S.seat||0]=1;drawFigure(c,p,{hue:hue,alpha:figAlpha()});}
function sceneSig(c,t,p){
 var hue=[0,0,0,0,0,0,0];hue[4]=1;drawFigure(c,p,{hue:hue,alpha:figAlpha()});
 var sp=seatXY(p,4);ringMark(c,sp.x,sp.y,.062*p.h*tw(t,.3,.32,ELAND),PAL[4],1.5,1);}

function draw(){
 if(!W)return;
 var c=ctx,t=S.t,p=POSE.cur,a=S.act;
 c.setTransform(DPR,0,0,DPR,0,0);c.clearRect(0,0,W,H);
 if(a==='login')loginRing(c,1,1);
 else if(a==='transit'){var u=tw(t,.2,.42,EOUT);loginRing(c,1+.5*u,1-u);}
 else if(/^A[1-5]$/.test(a))sceneReel(c,+a.charAt(1)-1,t,p);
 else if(a==='gate')sceneGate(c,t,p);
 else if(a==='story')sceneStory(c,t,p);
 else if(a==='read')sceneRead(c,t,p);
 else if(a==='rel')sceneRel(c,t);
 else if(a==='b1')sceneB1(c,t,p);
 else if(a==='b2')sceneB2(c,t,p);
 else if(a==='b3')sceneB3(c,t,p);
 else if(a==='sig')sceneSig(c,t,p);}

/* ================================================================ the clock */
function ctlState(){
 var A=ACT[S.act],user=!!(S.mask&4);
 $('#pause').innerHTML=ico(user?'play':'pause',22);
 $('#pause').setAttribute('aria-label',user?'Resume':'Pause');$('#pausel').textContent=user?'Resume':'Pause';
 var snd=$('#soundb');snd.innerHTML=ico(snd.getAttribute('aria-pressed')==='true'?'sound':'muted',22);}
function step(dt){
 if(S.mask&16)return;
 var A=ACT[S.act];if(!A)return;
 stepPose(dt);
 S.breathT+=dt;
 if(S.breathOn&&!(A.clocked&&S.mask))S.breathR+=dt;
 if(A.clocked){
  var tgt=S.mask?0:1;S.rate=tgt?Math.min(1,S.rate+dt/.32):0;     /* a release from hold or pause ramps in over 320 ms */
  S.t+=dt*S.rate*S.speed/S.mul;
  runCues();
  if(A.hair!=null)hairline(A);
  if(!S.outDone&&A.deck&&S.t>=A.len-.22&&A.next){S.outDone=true;DECK[A.deck].hide();}
  if(S.t>=A.len){
   if(A.holdEnd){S.t=A.len;if(!S.sigQ&&A.onEnd)A.onEnd();}
   else go(A.next);}
 }else{
  S.t+=dt;runCues();
  if(S.act==='gate'&&!S.live&&S.t>=1.1){S.live=true;$('#s-gate').classList.add('live');}
  if(S.act==='b1'&&S.t>=3.0)$('#b1-go')&&$('#b1-go').classList.add('in');}}
function hairline(A){
 $$('#hair i b').forEach(function(b,i){
  var f=i<A.hair?1:i===A.hair?clamp(S.t/A.len,0,1):0;b.style.transform='scaleX('+f+')';});}
function frame(ts){
 var dt=(ts-S.last)/1000;S.last=ts;if(!(dt>0))dt=0;if(dt>.1)dt=.1;       /* clamp 100 ms: a longer gap is a hidden tab, which is a pause */
 step(dt);draw();readout();requestAnimationFrame(frame);}
var roAt=0;
function readout(){
 var n=performance.now();if(n-roAt<120)return;roAt=n;
 var A=ACT[S.act],s=S.act+'  '+S.t.toFixed(1)+(A&&A.len?' / '+A.len.toFixed(1):'')+' s'+(S.mask&(1|4|16|32|64)?'  paused':'');
 var e=$('#readout');if(e)e.textContent=s;}

/* ================================================================ controls */
function togglePause(){S.mask^=4;ctlState();}
function nextSlide(){var A=ACT[S.act];if(A.hair==null&&S.act!=='b2')return;go(A.next);}
function backSlide(){
 var A=ACT[S.act],now=S.t;
 if(A.hair==null&&S.act!=='b2')return;
 var twice=(performance.now()/1000-S.lastBack)<1.5;S.lastBack=performance.now()/1000;
 if(twice&&A.hair>0)go(SL[A.hair-1].id);else if(twice&&S.act==='b2')go('b1');else go(S.act);}   /* first tap restarts this one, a second within 1.5 s goes back one */
function skip(){
 var id=S.act;
 if(/^A[1-5]$/.test(id)||id==='transit')go('gate');
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
 var A=ACT[S.act];if(!A||(A.hair==null&&S.act!=='b2'))return;
 var r=stage.getBoundingClientRect(),f=(h.x-r.left)/r.width;
 if(f<1/3)backSlide();else nextSlide();}
stage.addEventListener('pointerup',function(e){endHold(e,false);});
stage.addEventListener('pointercancel',function(e){endHold(e,true);});
stage.addEventListener('pointerleave',function(e){if(hold&&hold.held)endHold(e,true);});
stage.addEventListener('contextmenu',function(e){if(stage.classList.contains('film'))e.preventDefault();});

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
 if(e.key==='Escape'){if(A&&A.clocked&&/skip/.test(A.ctl))skip();else if(S.act==='gate')leave();return;}
 if(typing||e.target.closest&&e.target.closest('#ctl'))return;
 if(A&&A.clocked&&e.key===' '&&!(e.target.tagName==='BUTTON')){togglePause();e.preventDefault();}
 if(e.key==='ArrowRight')nextSlide();
 if(e.key==='ArrowLeft')backSlide();});

/* browser Back steps back one slide and never leaves the app */
function pushH(id){try{history.pushState({a:id},'',location.href);}catch(e){}}
window.addEventListener('popstate',function(){
 var id=S.act,m=/^A([1-5])$/.exec(id);
 if(m&&+m[1]>1)go(SL[+m[1]-2].id,{nopush:true});
 else if(id==='gate')go('A5',{nopush:true});
 else if(id==='story')go('gate',{nopush:true,keep:false});
 else pushH(id);});

/* ---- the door. One row of Log in and Guest; Create account is its own quiet
   control at the very bottom and flips the fields between the two modes. */
function setDoor(m){
 S.door=m;
 $('#lg-fields').classList.toggle('shut',m==='create');$('#lg-hint').hidden=m!=='create';
 $('#lg-go').textContent=m==='create'?'Create account':'Log in';
 $('#lg-create').textContent=m==='create'?'Log in instead':'Create account';}
$('#lg-create').addEventListener('click',function(){setDoor(S.door==='create'?'login':'create');});
$('#lg-go').addEventListener('click',function(){if(S.door==='create'){S.mode='account';startRun();}else{S.end='login';go('end');}});
$('#lg-guest').addEventListener('click',function(){S.mode='guest';startRun();});
$('#lg-gico').innerHTML=ico('guest',20);
function startRun(){S.breathOn=false;go('transit');}

/* ---- the gate extras, the story, the read, reel B */
document.addEventListener('click',function(e){
 var b=e.target.closest('button');if(!b)return;
 if(b.id==='tbl-q'){S.tableQ=true;b.textContent='Opens after the film';}
 if(b.id==='gate-tbl')openTbl(true);
 if(b.id==='tbl-close')openTbl(false);
 if(b.id==='commit')doCommit();
 if(b.closest('#feels')){var w=b.dataset.w,ta=$('#words');ta.value=(ta.value.replace(/\s+$/,'')+(ta.value.trim()?' ':'')+w+' ').replace(/^\s+/,'');ta.focus();syncCommit();}
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
$('#words').addEventListener('input',syncCommit);
$('#words').addEventListener('keydown',function(e){if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();doCommit();}});
$('#b3-tick').addEventListener('change',function(){$('#b3-make').disabled=!(this.checked&&$('#b3-u').value.trim().length>0&&$('#b3-p').value.length>0);});
['#b3-u','#b3-p'].forEach(function(s){$(s).addEventListener('input',function(){$('#b3-make').disabled=!($('#b3-tick').checked&&$('#b3-u').value.trim().length>0&&$('#b3-p').value.length>0);});});
function openTbl(on){$('#tbl').classList.toggle('on',on);}
(function buildTbl(){var h='';NODES.forEach(function(n){var bi=BAND.indexOf(n[2]);
 h+='<tr><td>'+n[0]+'</td><td>'+n[1]+'</td><td>'+(bi>=0?'<i class="dot" style="background:'+PAL[bi]+'"></i>':'')+n[2]+'</td><td>'+n[3]+'</td></tr>';});$('#tbl-b').innerHTML=h;})();

/* ---- the distress stop frame. A static document: nothing animates and nothing is sold on it. */
function stopFig(){
 var h='<ellipse cx="36" cy="10" rx="9" ry="3" fill="none" stroke="#EFEDE8" stroke-width="1.2"/><line x1="36" y1="22" x2="36" y2="98" stroke="#EFEDE8" stroke-width="1.2"/>';
 for(var i=0;i<7;i++)h+='<circle cx="36" cy="'+(98-i*12.6).toFixed(1)+'" r="3" fill="#EFEDE8"/>';return h;}
function showStop(on){
 S.stop=on;$('#stop').classList.toggle('on',on);
 if(on)S.mask|=16;else S.mask&=~16;
 $$('.act,#hair,#ctrls').forEach(function(e){if(on)e.setAttribute('inert','');else e.removeAttribute('inert');});
 var d=$('#devlink');d.textContent=on?'hide stop frame':'show stop frame';d.setAttribute('aria-pressed',String(on));
 if(!on)return;
 $('#stop-fig').innerHTML=stopFig();
 var ind=S.stopv==='indirect',row=$('#stop-row');
 $('#stop-1').textContent=ind?'That sounded heavy. Tell one person today what you wrote.':'Stop here. A release is not for this.';
 $('#stop-2').textContent='If you are not safe, call or text 988 in the United States, or your local emergency number.';
 $('#stop-3').textContent=(ind||S.made)?'':'Nobody reads this but you.';$('#stop-3').hidden=ind||S.made;
 row.innerHTML=(ind?'':'<button type="button" class="ring">Call 988</button><button type="button" class="ring">Text 988</button>')+'<button type="button" class="ring" id="stop-go">Go on</button>';
 $('#stop-go').addEventListener('click',function(){showStop(false);S.end='stop';go('end');});}
$('#devlink').addEventListener('click',function(){showStop(!S.stop);});

/* ================================================================ the owner's strip */
var JUMPS=[
 ['login','The door'],['transit','Transit from the door'],
 ['A1','Reel A 1, Welcome'],['A2','Reel A 2, Awareness'],['A3','Reel A 3, Mirror'],['A4','Reel A 4, 112 addresses'],['A5','Reel A 5, The loop'],
 ['gate','The gate'],['story','The story'],['read','The first reading'],
 ['rel-open','Release, opening'],['rel-lines','Release, lines'],['rel-settle','Release, settle'],
 ['b1','Reel B 1, The reading'],['b2','Reel B 2, The loop'],['b3','Reel B 3, Keep this'],['sig','Signal test'],['sigq','Signal test, question'],
 ['end','The Field (end)'],['stop','Stop frame']];
function ensureDefaults(){
 if(S.pick==null){S.pick=0;}
 if(S.seat==null){S.seat=0;S.word='afraid';S.src='words';}
 if(!S.words)S.words='I am afraid that I am not enough';
 S.seed=STARTS[S.pick].s;}
function jump(key,t,o){
 o=o||{};var snap=true;
 if(S.stop)showStop(false);
 openTbl(false);
 ensureDefaults();
 var m;
 if(/^A[1-5]$/.test(key)||key==='transit'||key==='gate'||key==='b1'||key==='b2'||key==='b3'||key==='sig'||key==='story'||key==='read'||key==='login'||key==='end'){
  if(key==='read'||key==='b1'||key==='b2'||key==='b3'||key==='sig'){S.breathOn=true;S.breathR=2;}
  if(key==='login')restart(true);
  if(key==='end'&&!S.end)S.end='notnow';
  if(key==='story')go('story',{snap:snap,keep:true});
  else go(key==='login'?'login':key,{t:t||0,snap:snap});
 }else if(key==='rel-open'){S.breathOn=true;go('rel',{t:t!=null?t:REL.stem+1.9,snap:snap});}
 else if(key==='rel-lines'){S.breathOn=true;go('rel',{t:t!=null?t:REL.lines0+5.0,snap:snap});}
 else if(key==='rel-settle'){S.breathOn=true;go('rel',{t:t!=null?t:REL.settle0+4.0,snap:snap});}
 else if(key==='sigq'){S.breathOn=true;go('sig',{t:SIG_LEN,snap:snap});}
 else if(key==='stop'){showStop(true);}
 if(o.freeze)S.mask|=64;else S.mask&=~64;
 if(key==='b3'&&o.keep){$('#b3-fine').classList.add('on');}
 ctlState();}
function restart(quiet){
 S.mask=0;S.rate=1;S.pick=null;S.seat=null;S.word=null;S.src='';S.words='';S.empty=0;S.seed=-1;S.breathOn=false;S.breathR=0;S.tableQ=false;S.end='';S.made=false;
 Object.keys(DECK).forEach(function(k){DECK[k].clear();});
 $('#words').value='';msg('');$('#lg').classList.remove('gone');setDoor('login');
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
   with it: dwell times x1.5, which the clock applies by running slower, so every cue keeps its design time. */
function setStill(v){STILL=!!v;S.mul=STILL?1.5:1;document.body.classList.toggle('still',STILL);$('#c-still').checked=STILL;}
var mq=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
if(mq){setStill(mq.matches);if(mq.addEventListener)mq.addEventListener('change',function(e){setStill(e.matches);});}

/* ================================================================ boot */
var q=location.search;
if(/[?&]clean\b/.test(q))document.body.classList.add('clean');
DECK.reel=new Deck('reel-deck');DECK.read=new Deck('read-deck');DECK.rel=new Deck('rel-deck');
DECK.b1=new Deck('b1-deck');DECK.b2=new Deck('b2-deck');DECK.sig=new Deck('sig-deck');
buildChips();buildStrip();ctlState();
if(window.ResizeObserver)new ResizeObserver(function(){relayout();}).observe(stage);
window.addEventListener('resize',function(){fitFrame();});
fitFrame();relayout();
try{history.replaceState({a:'login'},'',location.href);}catch(e){}
go('login',{snap:true,nopush:true});
requestAnimationFrame(function(t){S.last=t;requestAnimationFrame(frame);});

/* handles for the screenshot script and the owner's console */
window.MOCK={jump:jump,go:go,S:S,ACT:ACT,DWELLCHECK:DWELLCHECK,timeLine:timeLine,pathSeconds:pathSeconds,setStill:setStill,showStop:showStop,
 pick:function(i){var el=chipEls[i];S.live=true;pickStart(i,el);},doCommit:doCommit,relayout:relayout,fitFrame:fitFrame};
})();
