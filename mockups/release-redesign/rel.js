/* THE RELEASE ROOM, as a mock. One clock, three scenes: the opening, the run and
   the done state. Everything on screen is a function of the time T in seconds
   since Begin, which is how the frames are shot (?t=) and how the live pages
   move (a real clock, times ?rate=). The numbers, names, colours, glyphs and
   sentences are the engine's own through data.js; the three things the engine
   does not carry yet are marked where they are made:

     SUBJECT   the imprint's subject. Illustrative in data.js, 'myself' when none.
     PREP      the word between the pattern and the subject. Proposed.
     CUES      the per-word timing of his recording. Synthesised here at a
               speaking pace, in the exact format record.html produces.

   Query: dir=edges|ring|stage  who=gordon|derek|angela|sofia  first=1|0
          t=SECONDS or at=ADDR.BLOCK.PASS[&f=0..1]  rate=N  theme=snow
          paused=1 heavy=1 sheet=1 bare=1 sum=1 more=1 dose=N */
(function(){
'use strict';
var D=window.D, Q=new URLSearchParams(location.search);
function q(k,d){return Q.has(k)?Q.get(k):d;}
var DIR=q('dir','edges'), WHO=q('who','gordon'), FIRST=q('first','1')==='1';
var DOSE=+q('dose',100), SEC=+q('sec',4), RATE=+q('rate',1), BARE=Q.has('bare');
var P=D.people.filter(function(x){return x.key===WHO;})[0]||D.people[0];
var root=document.documentElement;
if(q('theme','dark')==='snow')root.setAttribute('data-theme','snow');
if(BARE)document.body.classList.add('bare');
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}

/* ------------------------------------------------------------ the script -- */
/* PROPOSED, and his to edit: about twenty five words, then the sentence the
   screen writes out and freezes on. The five channel sentence is his words
   for the first run; every run after reads the engine's own stem (C3_STEM). */
var INTRO=['Sit down. Feet on the floor.','Move your awareness inside your body. Take one deep breath.',
 'When you are ready, repeat this in your mind.'];
var STEM_FIRST='I am releasing believing, thinking, feeling, behaving and acting that I am';
var STEM_SIX=D.stem.trim();
var STEM_TRUTH=D.truth.trim();
function relStem(){return FIRST?STEM_FIRST:STEM_SIX;}

/* THE TIMING TRACK. record.html writes this shape from his clip; here it is
   made from the words at a speaking pace so the frames can be drawn before the
   clip exists. words[i] is [startSeconds,endSeconds] of the i-th word of the
   line, split on whitespace, and the closing "..." has no sound: it is held
   for half a second after the last spoken word. */
function synthCues(lines){
 var t=0.6, out=[];
 lines.forEach(function(L){
  var words=[], start=t;
  L.text.split(/\s+/).forEach(function(w){
   if(w==='...'){words.push([t,t+0.5]);t+=0.5;return;}
   var d=0.13+0.05*w.replace(/[^\w']/g,'').length;
   words.push([t,t+d]); t+=d+0.04;
   if(/[.!?]$/.test(w))t+=0.5; else if(/,$/.test(w))t+=0.26;});
  out.push({id:L.id,text:L.text,start:start,end:t,words:words}); t+=0.8;});
 return {lines:out,duration:t};}
var CUES=synthCues([{id:'intro',text:INTRO.join(' ')},{id:'stem',text:relStem()+' ...'}]);
var PULSE_S=5.2, HOLD_S=0.5;
var OPEN_END=CUES.lines[1].end+HOLD_S+PULSE_S;

/* ------------------------------------------------------ the run timeline -- */
/* Where the subject comes from: the story's imprint, which the sniffer writes
   at the address. None recorded reads 'myself'. */
var PREP_DEFAULT={Fear:'of',Anger:'at',Shame:'about',Disgust:'toward',Apathy:'around',Shock:'about',
 Sad:'over',Surprise:'about',Anticipation:'about'};
var PREP_NODE={'Separation':'from','Disconnection':'from','Possession':'of','Need For Approval':'from',
 'Self-Exclusion':'from','Insecurity':'around','Self-Silencing':'with','People Pleasing':'with','Pride':'toward','Fear':'of'};
function prep(a){return PREP_NODE[a.k]||PREP_DEFAULT[a.cf]||'about';}
function subj(a){return a.subject||'myself';}
function withSubject(text,a){
 return /^(I let go of|I give up|I forgive myself for) /.test(text)
  ?text.replace(/\.$/,' '+prep(a)+' '+subj(a)+'.'):text;}
function words(t){return String(t).trim().split(/\s+/).length;}

var BLOCKS=[], RUN_END=0;
(function(){
 var t=0;
 P.addrs.forEach(function(a,ai){D.chan.forEach(function(ch,ci){
  var truth=ch[2]==='truth', key=ch[0]+ch[2], B=a.blocks[key];
  var pre=truth?D.truth:D.stem;
  var tail=B.head.indexOf(pre)===0?B.head.slice(pre.length).trim():B.head;
  var stem=truth?STEM_TRUTH:relStem();
  var hd=Math.max(SEC,(words(stem)+words(tail))*0.4+0.9);
  BLOCKS.push({ai:ai,ci:ci,side:ch[0],truth:truth,key:key,a:a,B:B,t0:t,hd:hd,dur:hd+(DOSE-1)*SEC,stem:stem,tail:tail});
  t+=hd+(DOSE-1)*SEC;});});
 RUN_END=t;})();
var NREL=BLOCKS.filter(function(b){return !b.truth;}).length*DOSE;
var NINS=BLOCKS.filter(function(b){return b.truth;}).length*DOSE;
var SETTLE=D.settle;

function stmtText(b,p){
 if(p===0)return b.tail;
 return withSubject(b.B.passes[(p-1)%3],b.a);}
function runAt(Tr){
 var bi=BLOCKS.length-1;
 for(var i=0;i<BLOCKS.length;i++){if(Tr<BLOCKS[i].t0+BLOCKS[i].dur){bi=i;break;}}
 var b=BLOCKS[bi], tin=clamp(Tr-b.t0,0,b.dur), p, f, sd;
 if(tin<b.hd){p=0;f=tin/b.hd;sd=b.hd;}
 else{var k=(tin-b.hd)/SEC; p=1+Math.min(DOSE-2,Math.floor(k)); f=Math.min(1,k-Math.floor(k)); sd=SEC;}
 if(Tr>=RUN_END){p=DOSE-1;f=1;}
 var relSaid=0, insSaid=0;
 BLOCKS.forEach(function(x,j){if(j<bi){if(x.truth)insSaid+=DOSE;else relSaid+=DOSE;}});
 /* a line counts once it has been said, so the line on screen is not yet in the
    count, and the whole run reads complete only when the run is over */
 var pSaid=Tr>=RUN_END?DOSE:p;
 if(b.truth)insSaid+=pSaid; else relSaid+=pSaid;
 /* the address's share of the write, which the build reads off relLive().sqAt:
    here the engine's own arithmetic for one address, relWrite, in one step */
 var a=b.a, w0=a.pct, w1=Math.max(0,w0-Math.round(w0*0.21+2));
 var said=0; BLOCKS.forEach(function(x,j){if(x.ai!==b.ai)return; if(j<bi)said+=DOSE; else if(j===bi)said+=p+f;});
 var pct=w0-(w0-w1)*clamp(said/(4*DOSE),0,1);
 /* the two sides, as timers. live drains, waiting is full, done is empty */
 var ch={L:{st:'wait',g:1,n:DOSE},R:{st:'wait',g:1,n:DOSE}};
 var cur=ch[b.side], half=b.ci<2?0:1;
 cur.st='live'; cur.g=clamp(1-(p+f)/DOSE,0,1); cur.n=DOSE-p;
 var other=ch[b.side==='L'?'R':'L'], otherCi=half*2+(b.side==='L'?1:0);
 if(otherCi<b.ci){other.st='done';other.g=0;other.n=0;}
 return {bi:bi,b:b,p:p,f:f,sd:sd,rel:NREL-relSaid,ins:insSaid,ch:ch,half:half,pct:pct,pct1:w1,
  next:(p<DOSE-1)?stmtText(b,p+1):''};}

/* ------------------------------------------------------------- the DOM -- */
var G={
 rel:'<path d="M12 19V6M7 11l5-5 5 5"/>',
 ins:'<path d="M12 5v11M7 12l5 5 5-5M7 20h10"/>',
 L:'<path d="M15.5 5.5a8 8 0 100 13"/><circle cx="13.5" cy="12" r="1.7"/>',
 R:'<path d="M8 5.5l10 6.5-10 6.5z"/>'};
var LAB={L:'Left',R:'Right',REL:'Release',INS:'Install'};
var ARIA={L:'Left channel, feminine, parasympathetic, inward',R:'Right channel, masculine, sympathetic, outward',
 REL:'Release, patterns left',INS:'Install, truths installed'};
var CIRC=2*Math.PI*18;
function sym(k,fill){
 return '<span class="sym"><svg viewBox="0 0 44 44" aria-hidden="true"><circle class="tr" cx="22" cy="22" r="18"/>'
  +'<circle class="ar" cx="22" cy="22" r="18" transform="rotate(-90 22 22)" stroke-dasharray="'+CIRC.toFixed(1)
  +'" stroke-dashoffset="'+(CIRC*(1-fill)).toFixed(1)+'"/><g class="gl" transform="translate(10 10)">'+G[k==='REL'?'rel':k==='INS'?'ins':k]+'</g></svg></span>';}
function cnt(k,val,fill,extra){
 return '<div class="cnt '+k+(extra||'')+'" data-k="'+k+'" role="group" aria-label="'+ARIA[k]+'">'+sym(k,fill)
  +'<span class="tx"><span>'+LAB[k]+'</span><b>'+val+'</b></span></div>';}
function ic(p){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>';}
var IC={pause:'<path d="M9 5v14M15 5v14"/>',play:'<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
 stop:'<circle cx="12" cy="12" r="8.5"/><path d="M9 9h6v6H9z" fill="currentColor" stroke="none"/>',
 vol:'<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><g class="wv"><path d="M15.5 9.5a3.5 3.5 0 010 5M18 7a7 7 0 010 10"/></g><path class="sl" d="M16 9.5l5 5M21 9.5l-5 5"/>',
 more:'<path d="M6 14l6-6 6 6"/>'};
function bar(){
 return '<div class="rel-bar"><div class="rel-split"><button type="button" class="rel-btn voice" id="relvoice" role="switch" aria-checked="true" aria-label="Voice">'
  +ic(IC.vol)+'<span id="vlab">Voice on</span></button>'
  +'<button type="button" class="rel-btn more" id="relmore" aria-label="Sound settings" aria-expanded="false">'+ic(IC.more)+'</button></div>'
  +'<div class="grp"><button type="button" class="rel-btn" id="relpause" aria-label="Pause">'+ic(IC.pause)+'<span>Pause</span></button>'
  +'<button type="button" class="rel-btn" id="relstop" aria-label="End session">'+ic(IC.stop)+'<span>End</span></button></div></div>';}
function sheet(){
 return '<div class="rel-sheet" id="sheet" role="dialog" aria-label="Sound">'
  +'<div class="row"><span><b>Voice</b><em id="vnote">His recording, then the app voice on this machine</em></span><button type="button" class="sw" role="switch" aria-checked="true" id="swvoice" aria-label="Voice"></button></div>'
  +'<div class="row"><span><b>Seat tone</b><em id="tnote">Off. Sounds the seat of the address</em></span><button type="button" class="sw" role="switch" aria-checked="false" id="reltone" aria-label="Seat tone"></button></div>'
  +'<div class="row"><span><b>Vibration</b><em>Off. Marks each change of side</em></span><button type="button" class="sw" role="switch" aria-checked="false" id="relbuzz" aria-label="Vibration"></button></div></div>';}
function pips(){return '<span class="rel-pips" id="pips" role="img" aria-label="Addresses">'+P.addrs.map(function(){return '<i></i>';}).join('')+'</span>';}
function addrHead(){
 var a=P.addrs[0];
 return '<div class="rel-top"><div class="rel-addr" id="addr" style="--c:'+a.col+'"><span class="rel-ring" id="adRing"><svg viewBox="0 0 60 60" aria-hidden="true">'
  +'<circle class="tr" cx="30" cy="30" r="25" fill="none" stroke-width="4"/><circle class="ar" id="adArc" cx="30" cy="30" r="25" fill="none" stroke-width="4" stroke-linecap="round" transform="rotate(-90 30 30)" stroke-dasharray="157.1" stroke-dashoffset="0"/></svg>'
  +'<span class="gl" id="adGl"><svg viewBox="0 0 24 24">'+a.glyph+'</svg></span><span class="pc" id="adPc">0%</span></span>'
  +'<span class="rel-name"><b id="adNm"></b><span id="adSub"></span></span></div>'+pips()+'</div>';}

/* the three scenes */
function sceneOpen(){
 return '<div class="rel-scene rel-open on" id="sOpen"><span class="rel-voice" aria-hidden="true"><svg viewBox="0 0 64 64"><circle class="rg" cx="32" cy="32" r="22"/><circle class="rg2" cx="32" cy="32" r="22"/>'
  +'<g class="bars"><rect x="24" y="22" width="3.4" height="20" rx="1.7"/><rect x="30.3" y="18" width="3.4" height="28" rx="1.7"/><rect x="36.6" y="23" width="3.4" height="18" rx="1.7"/></g></svg></span>'
  +'<div class="rel-col"><div class="rel-intro rel-typed" id="intro" aria-live="polite"></div>'
  +'<p class="rel-stem rel-typed" id="ostem"></p></div>'
  +'<button type="button" class="rel-skip" id="relskip">Start now</button>'
  +'<div class="rel-note" id="onote"></div></div>';}
function sceneRun(){
 return '<div class="rel-scene rel-run" id="sRun"><p class="rel-stem" id="stem"></p>'
  +'<div class="rel-zone"><button type="button" class="rel-prompt" id="prompt" aria-pressed="false" aria-label="Mark this line heavy"><span class="rel-line" id="line"></span><i class="rel-hv" aria-hidden="true"></i></button>'
  +'<p class="rel-next" id="next" aria-hidden="true"></p><p class="rel-hint" id="hint">Tap a line that feels heavy to mark it.</p></div></div>';}
function sceneDone(){
 return '<div class="rel-scene rel-done" id="sDone"><div id="dCool" style="display:contents">'
  +'<div class="rel-cool rel-typed" id="cool" aria-live="polite"></div>'
  +'<div class="rel-settle" id="settle"><svg viewBox="0 0 100 100"><circle class="tr" cx="50" cy="50" r="46" stroke-width="3"/><circle class="ar" id="setArc" cx="50" cy="50" r="46" stroke-width="3" transform="rotate(-90 50 50)" stroke-dasharray="289" stroke-dashoffset="0"/></svg>'
  +'<div class="mid"><b id="setT">2:00</b><span>Stay inside the body</span></div></div>'
  +'<div class="rel-final" id="fin"></div></div>'
  +'<div class="rel-sum" id="dSum" style="display:none"></div></div>';}

var MAIN=null, BAR=null, EDGE=null;
function mount(){
 var h='<div class="rel" id="rel" data-dir="'+DIR+'" data-phase="" data-voice="1" data-paused="0" data-speaking="0"><div class="rel-room">';
 if(DIR==='edges')h+='<div class="rel-edge L" id="eL" aria-hidden="true"><div class="tube"><div class="fill"></div></div><div class="bleed"></div></div>'
  +'<div class="rel-edge R" id="eR" aria-hidden="true"><div class="tube">'+new Array(11).join('<div class="seg"><i></i></div>')+'</div><div class="tick"></div></div>';
 if(DIR==='stage')h+='<div class="rel-top" id="topStage" style="min-height:0;height:0"></div>';
 else h+=addrHead();
 h+='<main class="rel-main">'+sceneOpen()+sceneRun()+sceneDone()+'</main><div class="rel-foot" id="foot"></div>'+sheet()+'</div></div>';
 document.getElementById('app').innerHTML=h;
 buildFoot();
}
function buildFoot(){
 var f=document.getElementById('foot'), h='';
 if(DIR==='edges'){
  h='<div class="rel-feet" id="feet">'+cnt('L',DOSE,1)+cnt('REL',NREL,1)+cnt('INS',0,0)+cnt('R',DOSE,1)+'</div>';
 }else if(DIR==='ring'){
  h='';
 }else{
  h='<div class="rel-quad" id="quad">'
   +'<div class="cell" data-k="L">'+cnt('L',DOSE,1)+'<div class="bar round"><i></i></div></div>'
   +'<div class="cell" data-k="R">'+cnt('R',DOSE,1)+'<div class="bar seg">'+new Array(11).join('<s><i></i></s>')+'</div></div>'
   +'<div class="cell" data-k="REL">'+cnt('REL',NREL,1)+'<div class="bar round"><i></i></div></div>'
   +'<div class="cell" data-k="INS">'+cnt('INS',0,0)+'<div class="bar round"><i></i></div></div></div>';}
 f.innerHTML=h+bar();
}
/* direction A puts the instrument inside the run scene, between prompt and bar */
function ringInstrument(){
 var cs='var(--cs)';
 var C=2*Math.PI;
 function arc(r,a0,a1){var x0=100+r*Math.cos(a0),y0=100+r*Math.sin(a0),x1=100+r*Math.cos(a1),y1=100+r*Math.sin(a1);
  return 'M'+x0.toFixed(2)+' '+y0.toFixed(2)+' A'+r+' '+r+' 0 '+((a1-a0)>Math.PI?1:0)+' 1 '+x1.toFixed(2)+' '+y1.toFixed(2);}
 var d2r=Math.PI/180, rr=92;
 /* left arc, a continuous round-capped line down the left side, drawn from the
    bottom up to the top so it drains from the top; right, ten square-capped
    dashes down the right side */
 var Lp=arc(rr,(250)*d2r*-1+0,0); /* placeholder, replaced below */
 var h='<div class="rel-inst" id="inst"><div class="rel-c3">'
  +'<div class="lab L" id="lLab"><svg viewBox="0 0 24 24">'+G.L+'</svg><span>Left</span><b>'+DOSE+'</b></div>'
  +'<div class="rel-comp" id="comp"><svg viewBox="0 0 200 200" aria-hidden="true">'
  +'<circle class="tr" cx="100" cy="100" r="66" stroke-width="6"/>'
  +'<circle class="ad" id="cArc" cx="100" cy="100" r="66" stroke-width="6" transform="rotate(-90 100 100)" stroke-dasharray="414.7" stroke-dashoffset="0"/>'
  +'<path class="tr" d="'+arc(rr,(110)*d2r,(250)*d2r)+'" stroke-width="5" stroke-linecap="round"/>'
  +'<path class="la" id="lArc" d="'+arc(rr,(250)*d2r,(110)*d2r).replace(' 1 ',' 0 ')+'" stroke-width="5" pathLength="100" stroke-dasharray="100" stroke-dashoffset="0"/>'
  +'<g class="ra" id="rSeg"></g></svg>'
  +'<div class="core" id="cCore" style="--c:'+P.addrs[0].col+'"><svg viewBox="0 0 24 24">'+P.addrs[0].glyph+'</svg><b id="cPc">0%</b></div>'
  +'</div><div class="lab R" id="rLab"><svg viewBox="0 0 24 24">'+G.R+'</svg><span>Right</span><b>'+DOSE+'</b></div></div>'
  +'<div class="rel-pair">'+cnt('REL',NREL,1)+cnt('INS',0,0)+'</div></div>';
 return h;}

/* --------------------------------------------------------- typed text -- */
function buildTyped(el,paras,flat){
 /* paras: array of strings, flat word index continues across them */
 var idx=0, out=[], html='';
 paras.forEach(function(p,pi){
  var ws=p.split(/\s+/);
  var inner=ws.map(function(w){
   var chars=w.split('').map(function(c){return '<span class="rel-ch">'+esc(c)+'</span>';}).join('');
   var s='<span class="rel-w" data-i="'+(idx++)+'">'+chars+'</span>';
   return s;}).join(' ');
  html+=(el.tagName==='P'||paras.length===1&&!flat?'':'<p>')+inner+(el.tagName==='P'||paras.length===1&&!flat?'':'</p>');});
 el.innerHTML=html;
 var wsE=[].slice.call(el.querySelectorAll('.rel-w'));
 return wsE.map(function(w){return {el:w,ch:[].slice.call(w.children),n:w.children.length,shown:-1};});}
var TY={intro:null,stem:null,cool:null};
var lastCh=null;
function revealTyped(ty,line,T,clearLast){
 /* line.words[i]=[s,e]; characters of word i appear across the first 88% of it */
 var lastW=-1;
 for(var i=0;i<ty.length;i++){
  var w=ty[i], c=line.words[i]||[1e9,1e9+1], f=clamp((T-c[0])/((c[1]-c[0])*0.88),0,1);
  var n=Math.ceil(f*w.n-1e-9); if(T<c[0])n=0;
  if(n!==w.shown){for(var k=0;k<w.n;k++)w.ch[k].classList.toggle('on',k<n);w.shown=n;}
  if(n>0)lastW=i;}
 return lastW;}
function setLast(ty,lastW,showCaret){
 if(lastCh){lastCh.classList.remove('last');lastCh=null;}
 if(!showCaret)return;
 var w=ty[Math.max(0,lastW)]; if(!w)return;
 var k=Math.max(0,w.shown-1); if(lastW<0)k=0;
 if(w.ch[k]){lastCh=w.ch[k];lastCh.classList.add('last');}}
function allShown(ty){ty.forEach(function(w){if(w.shown!==w.n){w.ch.forEach(function(c){c.classList.add('on');});w.shown=w.n;}});}

/* ------------------------------------------------------------ the state -- */
var S={T:0,paused:Q.get('paused')==='1',voice:true,ended:null,heavy:{},sum:Q.get('sum')==='1',more:Q.get('more')==='1',
 lastKey:'',lastPhase:'',sheet:Q.get('sheet')==='1',tone:false,buzz:false,t0:0,pausedAt:0,pausedMs:0};
var el={};
function $(id){return document.getElementById(id);}

function phaseAt(T){
 if(S.ended!==null)return 'done';
 if(T<OPEN_END)return 'open';
 if(T<OPEN_END+RUN_END)return 'run';
 return 'done';}

function fmtMS(s){s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}

function setArc(node,frac,C){if(node)node.setAttribute('stroke-dashoffset',(C*(1-clamp(frac,0,1))).toFixed(2));}
function setCnt(k,val,fill,cls){
 var els=document.querySelectorAll('.cnt[data-k="'+k+'"]');
 els.forEach(function(c){
  var b=c.querySelector('.tx b'); if(b&&String(b.textContent)!==String(val)){b.textContent=val;b.classList.remove('tick');void b.offsetWidth;b.classList.add('tick');}
  var a=c.querySelector('.ar'); if(a)a.setAttribute('stroke-dashoffset',(CIRC*(1-clamp(fill,0,1))).toFixed(2));
  c.classList.toggle('idle',cls==='idle'||cls==='wait'&&false);c.classList.toggle('fin',cls==='fin');});}

function applyRun(T,live){
 var Tr=T-OPEN_END, r=runAt(Tr), b=r.b, a=b.a;
 var key=r.bi+':'+r.p;
 /* the address */
 var addr=$('addr'); if(addr&&addr.dataset.ai!==String(b.ai)){addr.dataset.ai=b.ai;
  addr.style.setProperty('--c',a.col);$('adGl').innerHTML='<svg viewBox="0 0 24 24">'+a.glyph+'</svg>';
  $('adNm').textContent=a.k;$('adSub').textContent=a.b+' · '+a.n;
  $('adNm').style.setProperty('--c',a.col);
  var ps=document.querySelectorAll('#pips i');ps.forEach(function(p,i){p.className=i<b.ai?'dn':i===b.ai?'on':'';});}
 if($('adArc')){var C=157.08; var fr=r.pct/100; $('adArc').style.transitionDuration=(live?(r.sd/RATE):0)+'s';setArc($('adArc'),fr,C);}
 if($('adPc'))$('adPc').textContent=Math.round(r.pct)+'%';
 if($('cArc')){var fr2=r.pct/100;$('cArc').style.setProperty('stroke',a.col);setArc($('cArc'),fr2,414.7);$('cPc').textContent=Math.round(r.pct)+'%';
  $('cCore').style.setProperty('--c',a.col);$('cCore').querySelector('svg').innerHTML=a.glyph;}
 if(DIR==='stage'){var hero=$('hero'); if(hero&&hero.dataset.ai!==String(b.ai)){hero.dataset.ai=b.ai;hero.style.setProperty('--c',a.col);
   hero.querySelector('.gl').innerHTML='<svg viewBox="0 0 24 24">'+a.glyph+'</svg>';hero.querySelector('b').textContent=a.k;hero.querySelector('.nm span').textContent=a.b+' · '+a.n;
   document.querySelectorAll('#pips i').forEach(function(p,i){p.className=i<b.ai?'dn':i===b.ai?'on':'';});}
  var hp=$('hArc'); if(hp)setArc(hp,r.pct/100,157.08); if($('hPc'))$('hPc').textContent=Math.round(r.pct)+'%';}
 /* the stem and the prompt */
 if($('stem').dataset.k!==b.stem){var st=$('stem');st.dataset.k=b.stem;st.textContent=b.stem+' ...';
  if(live&&S.lastPhase==='run'){st.classList.remove('beat');void st.offsetWidth;st.classList.add('beat');}}
 var step=key; var pr=$('prompt'), ln=$('line');
 if(S.lastKey!==step){
  S.lastKey=step;
  var isHead=r.p===0;
  pr.classList.toggle('head',isHead);
  if(isHead){ln.innerHTML=b.tail.split(/\s+/).map(function(w,i){return '<span class="w" data-i="'+i+'">'+esc(w)+'</span>';}).join(' ');}
  else ln.textContent=stmtText(b,r.p);
  if(live){pr.classList.remove('fade');void pr.offsetWidth;pr.classList.add('fade');}
  pr.setAttribute('aria-pressed',String(!!S.heavy[key]));
  $('next').textContent=isHead?'':r.next;
  if(isHead&&live){var st2=$('stem');st2.classList.remove('beat');void st2.offsetWidth;st2.classList.add('beat');}
  var hint=(b.ai===0&&b.ci===0&&r.p<4)?1:0; $('hint').style.transition=live?'':'none';$('hint').style.opacity=hint;
  if(live){root.parentNode;document.getElementById('rel').setAttribute('data-speaking','1');
   clearTimeout(applyRun.sp);applyRun.sp=setTimeout(function(){var e=document.getElementById('rel');if(e)e.setAttribute('data-speaking','0');},Math.min(2200,r.sd*1000*0.6)/RATE);}
  else document.getElementById('rel').setAttribute('data-speaking','1');
 }
 if(r.p===0){ /* the spoken words light as they are said */
  var said=Math.floor(r.f*r.sd/0.4); document.querySelectorAll('#line .w').forEach(function(w,i){w.classList.toggle('said',i<said-words(b.stem));});}
 /* counters */
 var relIdle=b.truth, insIdle=!b.truth;
 setCnt('REL',r.rel,r.rel/NREL,relIdle?'idle':'');
 setCnt('INS',r.ins,r.ins/NINS,insIdle?'idle':'');
 ['L','R'].forEach(function(s){var c=r.ch[s];
  var val=c.st==='done'?'0':String(c.n);
  setCnt(s,val,c.g,c.st==='done'?'fin':c.st==='wait'?'idle':'');
  /* edge strips */
  var e=$('e'+s);
  if(e){e.classList.toggle('live',c.st==='live'&&!S.paused);e.classList.toggle('idle',c.st!=='live');e.classList.toggle('fin',c.st==='done');
   var endG=c.st==='live'?clamp(1-(r.p+1)/DOSE,0,1):c.g;
   var dur=live&&c.st==='live'?(r.sd*(1-r.f)/RATE):0;
   if(s==='L'){var fl=e.querySelector('.fill');e.style.setProperty('--dur',dur+'s');e.style.setProperty('--f',live&&c.st==='live'?endG:c.g);}
   else{var segs=e.querySelectorAll('.seg i');var g=live&&c.st==='live'?endG:c.g;
    segs.forEach(function(sg,i){var v=clamp(g*10-i,0,1);sg.style.setProperty('--s',live&&c.st==='live'?Math.ceil(v*10)/10:Math.round(v*10)/10);});}}
  /* direction A arcs and labels */
  if(DIR==='ring'){var lab=$(s.toLowerCase()+'Lab'); if(lab){lab.querySelector('b').textContent=val;lab.classList.toggle('idle',c.st!=='live');}
   if(s==='L'){var la=$('lArc');la.style.setProperty('--dur',(live&&c.st==='live'?r.sd*(1-r.f)/RATE:0)+'s');la.style.strokeDashoffset=(100*(1-(live&&c.st==='live'?endG:c.g))).toFixed(2);la.style.opacity=c.st==='live'?1:c.st==='done'?.25:.5;}
   else{var ss=document.querySelectorAll('#rSeg .sg');var g2=c.g;ss.forEach(function(sg,i){var on=g2*10-i;sg.style.opacity=on>=1?1:on>0?.5+.5*on:.14;sg.style.stroke=c.st==='live'||on>0?'':'';});
    $('rSeg').style.opacity=c.st==='live'?1:c.st==='done'?.3:.6;}}
  if(DIR==='stage'){var cell=document.querySelector('.cell[data-k="'+s+'"]');if(cell){cell.classList.toggle('idle',c.st==='wait');
    var bar=cell.querySelector('.bar'); var gg=live&&c.st==='live'?clamp(1-(r.p+1)/DOSE,0,1):c.g;
    bar.style.setProperty('--dur',(live&&c.st==='live'?r.sd*(1-r.f)/RATE:0)+'s');
    if(s==='L')bar.style.setProperty('--f',gg);
    else bar.querySelectorAll('s i').forEach(function(sg,i){sg.style.setProperty('--s',clamp(gg*10-i,0,1));});}}});
 ['REL','INS'].forEach(function(k){if(DIR==='stage'){var cell=document.querySelector('.cell[data-k="'+k+'"]');if(cell){cell.classList.toggle('idle',k==='REL'?b.truth:!b.truth);
   cell.querySelector('.bar').style.setProperty('--f',k==='REL'?r.rel/NREL:r.ins/NINS);}}});
 var tn=$('tnote'); if(tn&&!S.tone)tn.textContent='Off. Sounds the seat of the address';
 if(S.tone&&tn)tn.textContent=D.hz[a.b]+' Hz, the '+a.b.toLowerCase()+' seat';
}

function applyOpen(T,live){
 var I=CUES.lines[0], St=CUES.lines[1];
 var lw=revealTyped(TY.intro,I,T), ls=revealTyped(TY.stem,St,T);
 var inI=T<I.end+0.2, inS=T>=I.end+0.2&&T<St.end+0.4;
 var tyAct=ls>=0&&T<St.end+0.1?TY.stem:TY.intro;
 /* the caret stays on the line being written */
 var useStem=T>=St.start-0.2;
 $('sOpen').setAttribute('data-stem',useStem?'1':'0');
 setLast(useStem?TY.stem:TY.intro,useStem?ls:lw,T<St.end+0.2);
 $('intro').classList.toggle('done',T>=I.end+0.2); $('ostem').classList.toggle('done',T>=St.end+0.2);
 /* written, then frozen, then pulsed twice, then let be. A frame shot at a time
    inside the pulse is held at that point of the animation */
 var pt=T-(St.end+HOLD_S), ost=$('ostem');
 if(pt>=0&&pt<PULSE_S){ost.classList.add('pulse');
  if(!live){ost.style.animationDelay=(-pt)+'s';ost.style.animationPlayState='paused';}}
 else{ost.classList.remove('pulse');ost.style.animationDelay='';ost.style.animationPlayState='';}
 /* the dots at the end of the stem are the part that is held still */
 var speaking=(T>=I.start&&T<I.end)||(T>=St.start&&T<St.end-0.4);
 document.getElementById('rel').setAttribute('data-speaking',speaking?'1':'0');
 $('onote').textContent=T<1.4?'':'';
}

var PH={open:'open',run:'run',done:'done'};
function applyDone(T,live){
 var Td=T-(S.ended!==null?S.ended:OPEN_END+RUN_END);
 if(S.ended!==null)Td=T-S.endedT;
 /* counts where the list stopped */
 var Tr=(S.ended!==null?S.ended:RUN_END), r=runAt(Tr);
 var said=NREL-r.rel, put=r.ins;
 var cl=CD.lines;
 var lw=revealTyped(TY.cool,{words:CD.words},Td);
 setLast(TY.cool,lw,Td<CD.end+0.2);$('cool').classList.toggle('done',Td>=CD.end+0.2);
 var left=Math.max(0,SETTLE-Td);
 $('setT').textContent=fmtMS(left);setArc($('setArc'),left/SETTLE,289);
 $('setArc').style.transitionDuration='0s';
 var fin=$('fin');
 if(!fin.dataset.k){fin.dataset.k=1;
  fin.innerHTML=cnt('REL',said,0,' fin')+cnt('INS',put,put/NINS)+cnt('L',0,0,' fin')+cnt('R',0,0,' fin');
  fin.querySelectorAll('.cnt').forEach(function(c){c.classList.remove('idle');});
  var rl=fin.querySelector('.cnt.REL .tx span'),il=fin.querySelector('.cnt.INS .tx span');if(rl)rl.textContent='Released';if(il)il.textContent='Installed';
  fin.querySelector('.cnt.REL .ar').setAttribute('stroke-dashoffset',0);
  fin.querySelector('.cnt.REL').classList.remove('fin');}
 var showSum=(left<=0&&S.ended===null)||S.sum;
 $('dCool').style.display=showSum?'none':'contents';
 var sm=$('dSum'); sm.style.display=showSum?'flex':'none';
 if(showSum&&!sm.dataset.k){sm.dataset.k=1;sm.innerHTML=summaryHtml(said,put);sm.classList.toggle('more',S.more);bindSummary();}
 document.querySelectorAll('#pips i').forEach(function(p){p.className='dn';});
 var fl=document.querySelectorAll('.rel-edge'); fl.forEach(function(e){e.classList.remove('live');e.classList.add('idle');});
 if(DIR==='edges'){$('eL').style.setProperty('--f',0);$('eR').querySelectorAll('.seg i').forEach(function(s){s.style.setProperty('--s',0);});}
 var feet=$('feet'); if(feet){feet.style.display='none';}
 var quad=$('quad'); if(quad)quad.style.display='none';
 var inst=$('inst'); if(inst)inst.style.display='none';
 document.getElementById('rel').setAttribute('data-speaking',Td<CD.end&&Td>0?'1':'0');
 var bt=$('relpause'); if(bt&&!bt.dataset.done){bt.dataset.done=1;bt.style.display='none';
  var st=$('relstop');st.classList.add('pri');st.setAttribute('aria-label','Done');st.querySelector('span').textContent='Done';st.querySelector('svg').innerHTML='<path d="M5 12.5l4.5 4.5L19 7.5"/>';}
}
var CD={lines:null,words:null,end:0};
function coolCues(){
 var c=synthCues(D.cooling.map(function(t,i){return {id:'c'+i,text:t};}));
 var ws=[];c.lines.forEach(function(l){l.words.forEach(function(w){ws.push(w);});});
 CD={lines:c.lines,words:ws,end:c.lines[c.lines.length-1].end};}

function summaryHtml(said,put){
 var marks=Object.keys(S.heavy).filter(function(k){return S.heavy[k];}).map(function(k){var p=k.split(':'),b=BLOCKS[+p[0]];return {t:+p[1]===0?b.tail:stmtText(b,+p[1]),n:b.a.k};});
 var seen={},mk=marks.filter(function(m){if(seen[m.t])return false;seen[m.t]=1;return true;});
 var h='<h2>You released <b>'+said+'</b> patterns.</h2>';
 h+='<div class="rel-final">'+cnt('REL',said,0,' fin')+cnt('INS',put,put/NINS)+'</div>';
 h+=mk.length?'<ul class="rel-marks">'+mk.slice(0,3).map(function(m){return '<li><i></i><span>'+esc(m.t)+'<em>'+esc(m.n)+'</em></span></li>';}).join('')+'</ul>'
  :'<p>The heaviest ones are the work. Tap the addresses that felt heavy.</p>';
 h+='<div class="rel-who" id="who">'+P.addrs.map(function(a,i){
  var after=Math.max(0,a.pct-Math.round(a.pct*0.21+2));
  return '<button type="button" data-i="'+i+'" aria-pressed="false" aria-label="Heavy at '+esc(a.k)+'" style="--c:'+a.col+'">'
   +'<span class="rel-ring"><svg viewBox="0 0 60 60"><circle class="tr" cx="30" cy="30" r="25" fill="none" stroke-width="4"/><circle class="ar" cx="30" cy="30" r="25" fill="none" stroke-width="4" stroke-linecap="round" transform="rotate(-90 30 30)" stroke-dasharray="157.1" stroke-dashoffset="'+(157.1*(1-after/100)).toFixed(1)+'"/></svg><span class="gl"><svg viewBox="0 0 24 24">'+a.glyph+'</svg></span></span>'
   +'<span>'+esc(a.k)+'</span><i class="hv"></i></button>';}).join('')+'</div>';
 h+='<div class="rel-more'+(S.more?' on':'')+'" id="more"><p>'+moreLine()+'</p>'
  +'<div class="rel-legend"><svg viewBox="0 0 24 24" style="stroke:var(--L)">'+G.L+'</svg><span>Left. Feminine, parasympathetic, inward. Smooth, on the left.</span>'
  +'<svg viewBox="0 0 24 24" style="stroke:var(--R)">'+G.R+'</svg><span>Right. Masculine, sympathetic, outward. Stepped, on the right.</span>'
  +'<svg viewBox="0 0 24 24" style="stroke:var(--REL)">'+G.rel+'</svg><span>Release. The number falls as each pattern is said.</span>'
  +'<svg viewBox="0 0 24 24" style="stroke:var(--INS)">'+G.ins+'</svg><span>Install. The number rises as each truth is set.</span></div></div>';
 h+='<div class="rel-bar" style="width:100%;justify-content:center;gap:10px"><button type="button" class="rel-btn" id="relmoreb" aria-expanded="'+S.more+'" style="min-width:120px"><span style="font-size:14px;color:var(--ink)">'+(S.more?'Less':'Details')+'</span></button>'
  +'<button type="button" class="rel-btn" id="relrit" style="min-width:140px"><span style="font-size:14px;color:var(--ink)">Build a ritual</span></button></div>';
 return h;}
function moreLine(){return 'Expression did not move. Release has about 1.2 points left to give you. The laws hold expression down from here, and there are twenty one of them.';}
function bindSummary(){
 document.querySelectorAll('#who button').forEach(function(b){b.onclick=function(){b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));};});
 var mb=$('relmoreb'); if(mb)mb.onclick=function(){S.more=!S.more;$('more').classList.toggle('on',S.more);$('dSum').classList.toggle('more',S.more);mb.setAttribute('aria-expanded',String(S.more));mb.querySelector('span').textContent=S.more?'Less':'Details';};}

/* --------------------------------------------------- the clock and frame -- */
function setPhase(ph){
 var rel=document.getElementById('rel'); if(rel.getAttribute('data-phase')===ph)return;
 rel.setAttribute('data-phase',ph);
 $('sOpen').classList.toggle('on',ph==='open');$('sRun').classList.toggle('on',ph==='run');$('sDone').classList.toggle('on',ph==='done');
 var f=$('feet');if(f)f.style.visibility=ph==='open'?'hidden':'visible';
 var qd=$('quad');if(qd)qd.style.visibility=ph==='open'?'hidden':'visible';
 var ins=$('inst');if(ins)ins.style.visibility=ph==='open'?'hidden':'visible';
 ['eL','eR'].forEach(function(i){var e=$(i);if(e)e.style.opacity=ph==='run'?'':0;});
 if(ph!=='open'&&$('relskip'))$('relskip').style.display='none';
}
function fitRing(){
 var c3=document.querySelector('.rel-c3'), comp=$('comp'); if(!c3||!comp)return;
 var s=Math.max(96,Math.min(c3.clientHeight,c3.clientWidth-2*(56+6),360));
 comp.style.setProperty('--cs',s+'px');}
window.addEventListener('resize',fitRing);
function frame(T,live){
 fitRing();
 var ph=phaseAt(T);
 setPhase(ph); S.lastPhase=ph;
 if(ph==='open')applyOpen(T,live);
 else if(ph==='run'){applyRun(T,live);}
 else {applyOpen(OPEN_END,false);applyDone(T,live);}
 S.lastPhase=ph;
}

function seek(T){S.T=T;frame(T,false);}
function nowT(){return S.t0?((S.paused?S.pausedAt:performance.now())-S.t0-S.pausedMs)/1000*RATE:0;}
/* tick=MS holds the run and the done state to one update every MS milliseconds,
   which is what the build does (one update per statement); the opening always
   runs every frame, because the typewriter does */
var TICK=+q('tick',0), lastTick=-1e9;
function loop(){
 if(!S.paused){var T=nowT(), now=performance.now();
  if(T<OPEN_END||!TICK||now-lastTick>=TICK){lastTick=now;S.T=T;frame(T,true);}}
 requestAnimationFrame(loop);}

function wire(){
 var rel=document.getElementById('rel');
 function setVoice(v){S.voice=v;rel.setAttribute('data-voice',v?'1':'0');
  $('relvoice').setAttribute('aria-checked',String(v));$('swvoice').setAttribute('aria-checked',String(v));
  $('vlab').textContent=v?'Voice on':'Voice off';}
 $('relvoice').onclick=function(e){if(e.target.closest&&e.target.closest('#relmore'))return;setVoice(!S.voice);};
 $('swvoice').onclick=function(){setVoice(!S.voice);};
 $('relmore').onclick=function(e){e.stopPropagation();var on=!$('sheet').classList.contains('on');$('sheet').classList.toggle('on',on);$('relmore').setAttribute('aria-expanded',String(on));};
 $('reltone').onclick=function(){S.tone=!S.tone;this.setAttribute('aria-checked',String(S.tone));};
 $('relbuzz').onclick=function(){S.buzz=!S.buzz;this.setAttribute('aria-checked',String(S.buzz));};
 $('relpause').onclick=function(){S.paused=!S.paused;rel.setAttribute('data-paused',S.paused?'1':'0');
  var b=$('relpause');b.setAttribute('aria-label',S.paused?'Resume':'Pause');b.querySelector('span').textContent=S.paused?'Resume':'Pause';
  b.querySelector('svg').innerHTML=S.paused?IC.play:IC.pause;
  if(S.paused){S.pausedAt=performance.now();}else{S.pausedMs+=performance.now()-S.pausedAt;}
  frame(S.T,false);};
 $('relstop').onclick=function(){
  if(rel.getAttribute('data-phase')==='done'){return;}
  S.ended=clamp(S.T-OPEN_END,0,RUN_END);S.endedT=S.T;coolCues();
  if(!TY.cool)TY.cool=buildTyped($('cool'),D.cooling,true);};
 $('relskip').onclick=function(){S.pausedMs-= (OPEN_END-S.T)/RATE*1000;};
 $('prompt').onclick=function(){var k=S.lastKey;S.heavy[k]=!S.heavy[k];this.setAttribute('aria-pressed',String(!!S.heavy[k]));};
 document.addEventListener('keydown',function(e){if(e.key==='Escape'){$('sheet').classList.remove('on');}});
 if(S.paused){rel.setAttribute('data-paused','1');var b=$('relpause');b.setAttribute('aria-label','Resume');b.querySelector('span').textContent='Resume';b.querySelector('svg').innerHTML=IC.play;}
 if(S.sheet){$('sheet').classList.add('on');$('relmore').setAttribute('aria-expanded','true');}
}

/* the director bar: the mock's own, not the product's */
function director(){
 var d=document.createElement('div');d.className='dir';
 function a(t,href,on){return '<a href="'+href+'"'+(on?' style="background:rgba(255,255,255,.18)"':'')+'>'+t+'</a>';}
 function url(o){var u=new URLSearchParams(location.search);Object.keys(o).forEach(function(k){if(o[k]===null)u.delete(k);else u.set(k,o[k]);});u.delete('t');u.delete('at');u.delete('f');return '?'+u.toString();}
 var h='';
 h+=['edges','ring','stage'].map(function(x){return a(x==='edges'?'B Edges':x==='ring'?'A Ring':'C Stage',url({dir:x}),DIR===x);}).join('');
 h+='<span class="sp">|</span>'+D.people.map(function(p){return a(p.nm,url({who:p.key}),p.key===WHO);}).join('');
 h+='<span class="sp">|</span>'+a('first run',url({first:'1'}),FIRST)+a('later',url({first:'0'}),!FIRST);
 h+='<span class="sp">|</span><select id="dj" aria-label="Jump"><option value="">Jump to</option><option value="0">Opening start</option><option value="'+(CUES.lines[1].start)+'">Stem writing</option><option value="'+(OPEN_END-3)+'">Stem frozen, pulsing</option>'
  +'<option value="'+(OPEN_END+5)+'">Run: head, left release</option><option value="'+(OPEN_END+BLOCKS[0].t0+BLOCKS[0].hd+30*SEC)+'">Run: left release</option>'
  +'<option value="'+(OPEN_END+BLOCKS[1].t0+BLOCKS[1].hd+50*SEC)+'">Run: right release</option><option value="'+(OPEN_END+BLOCKS[2].t0+BLOCKS[2].hd+20*SEC)+'">Run: left install</option>'
  +'<option value="'+(OPEN_END+BLOCKS[3].t0+BLOCKS[3].hd+70*SEC)+'">Run: right install</option><option value="'+(OPEN_END+BLOCKS[4].t0+BLOCKS[4].hd+10*SEC)+'">Run: second address</option>'
  +'<option value="'+(OPEN_END+RUN_END+1)+'">Cooldown</option><option value="'+(OPEN_END+RUN_END+SETTLE+1)+'">Summary</option></select>';
 h+='<span class="sp">|</span><select id="dr" aria-label="Rate"><option value="1">1x</option><option value="4">4x</option><option value="12">12x</option><option value="40">40x</option></select>';
 d.innerHTML=h;document.body.appendChild(d);
 var dr=$('dr');dr.value=String(RATE);dr.onchange=function(){var u=new URLSearchParams(location.search);u.set('rate',dr.value);location.search=u.toString();};
 $('dj').onchange=function(){var v=+this.value;if(isNaN(v))return;S.pausedMs=0;S.t0=performance.now()-v/RATE*1000;S.ended=null;
  if($('dSum')){$('dSum').dataset.k='';$('fin').dataset.k='';}
  var u=new URLSearchParams(location.search);};
}

/* ---------------------------------------------------------------- start -- */
mount();
if(DIR==='ring'){
 var rr=document.querySelector('#sRun .rel-zone');rr.insertAdjacentHTML('afterend',ringInstrument());
 /* the ten right-hand dashes: square caps, a gap between each, down the right side */
 var d2r=Math.PI/180, g='';for(var i=0;i<10;i++){var a0=(-70+i*14+1.6)*d2r,a1=(-70+(i+1)*14-1.6)*d2r,r2=92;
  g+='<path class="sg" d="M'+(100+r2*Math.cos(a0)).toFixed(2)+' '+(100+r2*Math.sin(a0)).toFixed(2)+' A'+r2+' '+r2+' 0 0 1 '+(100+r2*Math.cos(a1)).toFixed(2)+' '+(100+r2*Math.sin(a1)).toFixed(2)+'" stroke-width="5"/>';}
 $('rSeg').innerHTML=g;
 $('sRun').style.justifyContent='flex-start';
}
if(DIR==='stage'){
 var a0=P.addrs[0], hero='<div class="rel-hero" id="hero" style="--c:'+a0.col+'"><span class="rel-ring"><svg viewBox="0 0 60 60"><circle class="tr" cx="30" cy="30" r="25" fill="none" stroke-width="3.5"/><circle class="ar" id="hArc" cx="30" cy="30" r="25" fill="none" stroke-width="3.5" stroke-linecap="round" transform="rotate(-90 30 30)" stroke-dasharray="157.1" stroke-dashoffset="0"/></svg><span class="gl"><svg viewBox="0 0 24 24">'+a0.glyph+'</svg></span><span class="pc" id="hPc">0%</span></span>'
  +'<span class="rel-name nm"><b style="color:var(--c)"></b><span></span></span>'+pips()+'</div>';
 $('sRun').insertAdjacentHTML('afterbegin',hero);
}
TY.intro=buildTyped($('intro'),INTRO,true);
TY.stem=buildTyped($('ostem'),[relStem()+' ...'],false);
TY.stem.forEach(function(w,i){});
var dotsW=TY.stem[TY.stem.length-1]; if(dotsW)dotsW.el.classList.add('dots');
TY.cool=buildTyped($('cool'),D.cooling,true);coolCues();
wire();
if(!BARE)director();
document.title='Release room, '+(DIR==='edges'?'B edges':DIR==='ring'?'A ring':'C stage');

var T0=NaN;
if(Q.has('t'))T0=+Q.get('t');
if(Q.has('at')){var s=Q.get('at').split('.').map(Number),ai=s[0]||0,ci=s[1]||0,pp=s[2]||0,ff=+q('f',0.5);
 var bb=BLOCKS[ai*4+ci];T0=OPEN_END+bb.t0+(pp===0?ff*bb.hd:bb.hd+(pp-1+ff)*SEC);}
if(Q.has('ended')){S.ended=+Q.get('ended');S.endedT=OPEN_END+S.ended;}
if(Q.has('dt')){S.endedT=S.endedT||OPEN_END+RUN_END;T0=S.endedT+ +Q.get('dt');}
if(Q.get('heavy')==='1'&&!isNaN(T0)&&T0>=OPEN_END&&T0<OPEN_END+RUN_END&&S.ended===null){var rr0=runAt(T0-OPEN_END);S.heavy[rr0.bi+':'+rr0.p]=true;}
if(Q.get('heavy')==='1'){ /* a few marks for the summary */
 S.heavy['0:3']=true;S.heavy['1:14']=true;S.heavy['0:0']=false;}
window.REL={seek:seek,S:S,OPEN_END:OPEN_END,RUN_END:RUN_END,CUES:CUES,BLOCKS:BLOCKS,runAt:runAt,NREL:NREL,NINS:NINS};
if(!isNaN(T0)){document.documentElement.classList.add('static');S.t0=0;seek(T0);if(S.sum)seek(T0);}
else{S.t0=performance.now();requestAnimationFrame(loop);}
if(!isNaN(T0)&&S.paused===false&&Q.get('live')==='1'){S.t0=performance.now()-T0/RATE*1000;requestAnimationFrame(loop);}
})();
