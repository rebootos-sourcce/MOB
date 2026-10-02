/* flow.js, round PA. The onboarding, as one clickable prototype. Hash selects a
   frame:
   #start #start-compare #start-picked #feeling #story #story-voice #forming
   #mirror #mirror-wheel #mirror-notquite #mirror-subject #mirror-second
   #mirror-adjust #mirror-empty #somatic #release-open #release-run
   #release-cool #observe #handoff #keep */
(function(){
var W=innerWidth,HT=innerHeight,M=W<=700;
var root=document.createElement('div');root.className='stage';document.body.appendChild(root);
var bg=document.createElement('div');bg.className='fieldbg';root.appendChild(bg);
var ui=document.createElement('div');ui.className='ui';root.appendChild(ui);
var timers=[];function clearT(){timers.forEach(function(t){clearTimeout(t);});timers=[];window.__stop&&window.__stop();window.__stop=null;}
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var SAMPLE='I keep taking care of everybody else and I feel overwhelmed, afraid that things will fall apart if I do not handle them.';
var FEAR=SEATS[0].c;   // the Fearful family sits at Root: the colour of the feeling words

function setBg(o,extra){
 bg.style.transform='';bg.innerHTML='<svg viewBox="0 0 '+W+' '+HT+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="breathe">'+fieldRing(o)+'</g>'+(extra||'')+'</svg>';}
function chrome(n,leave,noTrace){
 return '<div class="topl">'+mark(M?84:104)+'</div>'+(noTrace?'':'<div class="trace">'+trace(n)+'</div>')+(leave===false?'':leaveBtn());}
function seatOf(i){return SEATS[i];}
function sig(txt,words){
 words.forEach(function(w){var re=new RegExp('('+w[0]+')','i');txt=txt.replace(re,'<span class="sg" style="--c:'+w[1]+'">$1</span>');});return txt;}
var SIGW=[['taking care of everybody else',SEATS[2].c],['overwhelmed',FEAR],['afraid',FEAR],['fall apart',FEAR]];
function fcol(){var w=Math.min(M?W-12:W*.40,M?378:640),mg=Math.max(36,W*.035);
 return {w:w,cx:M?W/2:W-mg-w/2,cy:M?HT*.72:HT*.5,r:M?118:w*.47};}
var SCR={};

/* ================= 1. STARTING POINT: twelve, Pain added ================= */
SCR.start=function(sel){
 sel=(sel==null)?-1:sel;var S=sel>-1?STARTS[sel]:null,sc=S&&S.s>-1?seatOf(S.s).c:ACC;
 var lit=(S&&S.s>-1)?[S.s]:(S?[0,1,2,3,4,5,6]:[]);
 var html=chrome(0);
 if(!M){
  var Rp=Math.min(HT*.335,320),cx=W/2,cy=HT/2+52;
  setBg({cx:cx,cy:cy,r:Rp*.56,radii:[Rp*1.24,Rp*1.44,Rp*1.68],lit:lit,tl:13},S?pathTo(cx,cy,Rp,sel,sc,S):'');
  html+='<div class="hd c" style="top:34px"><h1 class="display">What brought you here?</h1></div>';
  STARTS.forEach(function(s,i){var p=polar(cx,cy,Rp,-90+i*30),c=s.s>-1?seatOf(s.s).c:MID;
   html+='<button type="button" class="pick'+(i===sel?' on':'')+(sel>-1&&i!==sel?' q':'')+'" style="left:'+f(p[0]-62)+'px;top:'+f(p[1]-36)+'px;--c:'+c+'" data-pick="'+i+'" aria-pressed="'+(i===sel)+'"><span class="pc">'+ico(s.k,34)+'</span><span class="pl">'+s.n+'</span></button>';});
  html+='<div class="cread" style="left:'+(cx-170)+'px;top:'+(cy-120)+'px">'+readout(S,sc)+'</div>';
 }else{
  var cx2=W/2,cy2=176;
  setBg({cx:cx2,cy:cy2,r:56,radii:[70,86,104],lit:lit,tl:9,sw:1.8},'');
  html+='<div class="hd c m"><h1 class="h1">What brought you here?</h1></div>';
  html+='<div class="cread m" style="left:'+(cx2-60)+'px;top:'+(cy2-44)+'px">'+(S?'<span class="rbig" style="color:'+sc+'">'+ico(S.k,56)+'</span>':'<span class="rbig dim breathe">'+ico('other',44)+'</span>')+'</div>';
  html+='<div class="tiles">'+STARTS.map(function(s,i){var c=s.s>-1?seatOf(s.s).c:MID;
   return '<button type="button" class="tile'+(i===sel?' on':'')+(sel>-1&&i!==sel?' q':'')+'" style="--c:'+c+'" data-pick="'+i+'" aria-pressed="'+(i===sel)+'">'+ico(s.k,30)+'<span>'+s.n+'</span></button>';}).join('')+'</div>';
  html+='<div class="dock">'+(S?'<p class="gift">Your first 100 patterns are ready.</p><button type="button" class="btn pri" data-go="feeling" style="width:100%">Begin</button>':'<p class="small c">Pick the closest one.</p>')+'</div>';
 }
 ui.innerHTML=html;};
function pathTo(cx,cy,Rp,i,c,S){var p=polar(cx,cy,Rp-70,-90+i*30),q=polar(cx,cy,Rp*.56+30,-90+i*30),out='';
 out+='<path d="M'+f(p[0])+' '+f(p[1])+' L'+f(q[0])+' '+f(q[1])+'" stroke="'+c+'" stroke-width="2" stroke-linecap="round"/>';
 if(S.s>-1){var a=90+(S.s+.5)*360/7,lp=polar(cx,cy,Rp*.56-54,a);
  out+='<text x="'+f(lp[0])+'" y="'+f(lp[1]+4)+'" text-anchor="middle" font-size="13" font-weight="600" fill="'+c+'" font-family="Inter,sans-serif">'+SEATS[S.s].n+'</text>';}
 return out;}
function readout(S,sc){
 if(!S)return '<div class="rd"><span class="rbig dim breathe">'+ico('other',64)+'</span><p class="lead c">Pick the closest one.</p></div>';
 return '<div class="rd"><span class="rbig" style="color:'+sc+'">'+ico(S.k,72)+'</span><h2 class="h1 c">'+S.n+'</h2>'
  +'<p class="gift">Your first 100 patterns are ready.</p><button type="button" class="btn pri" data-go="feeling">Begin</button></div>';}

/* ================= 1b. TWELVE, OR SIX AND I'LL TELL YOU: the two, drawn side by side ================= */
var SIX=['anxiety','anger','grief','burnout','relationships','pain'];
function startNode(k,x,y,sz,lab,fs){
 var s=STARTS.filter(function(t){return t.k===k;})[0],c=s&&s.s>-1?seatOf(s.s).c:MID;
 return '<div class="pn" style="left:'+f(x)+'px;top:'+f(y)+'px;--c:'+c+'"><span class="pnc" style="width:'+sz+'px;height:'+sz+'px">'+ico(k,Math.round(sz*.52))+'</span><span class="pnl" style="font-size:'+(fs||13.5)+'px">'+(s?s.n:k)+'</span></div>';}
function ringPanel(keys,R,sz,w,h,inner){
 var cx=w/2,cy=h/2,out='<div class="rp" style="width:'+w+'px;height:'+h+'px"><svg viewBox="0 0 '+w+' '+h+'" width="'+w+'" height="'+h+'" aria-hidden="true"><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="1.2"/>';
 out+='</svg>';
 keys.forEach(function(k,i){var p=polar(cx,cy,R,-90+i*360/keys.length);out+=startNode(k,p[0],p[1],sz);});
 return out+inner+'</div>';}
SCR.compare=function(){
 var twelve=STARTS.map(function(s){return s.k;});
 var html=chrome(0);
 if(!M){
  setBg({cx:-999,cy:-999,r:10,arcs:false,ticks:false},'');
  var pw=640,ph=560;
  html+='<div class="hd c" style="top:44px"><span class="eyebrow acc">The first question, asked two ways</span><h1 class="display" style="font-size:38px;margin-top:6px">What brought you here?</h1></div>';
  html+='<section class="cmp" style="left:'+(W/2-pw-24)+'px;top:150px;width:'+pw+'px"><header><span class="tagd">Default</span><h2>Twelve</h2><p>Twelve symbols. You pick the closest one.</p></header>'
   +ringPanel(twelve,205,58,pw,ph-30,'<div class="pmid c1"><span class="small">Pick one</span></div>')
   +'<footer><button type="button" class="btn pri" data-go="start-picked">Use twelve</button></footer></section>';
  html+='<section class="cmp" style="left:'+(W/2+24)+'px;top:150px;width:'+pw+'px"><header><h2>Six and I’ll tell you</h2><p>Six symbols, and a box for your own words.</p></header>'
   +ringPanel(SIX,168,76,pw,ph-30,'<div class="pmid c2"><span class="tell">'+ico('mic',22)+ico('keyboard',22)+'<b>I’ll tell you</b></span><span class="small">Type it or say it</span></div>')
   +'<footer><button type="button" class="btn" data-go="start-picked">Use six</button></footer></section>';
 }else{
  setBg({cx:W/2,cy:-30,r:90,arcs:false,quiet:.25,tl:8},'');
  html+='<div class="hd c m" style="top:58px"><h1 class="h1" style="font-size:22px">Twelve, or six and your own words?</h1></div>';
  html+='<div class="cmpm"><section><header><span class="tagd">Default</span><b>Twelve</b><span class="small">Twelve symbols. Pick the closest.</span></header><div class="tg12">'
   +twelve.map(function(k){var s=STARTS.filter(function(t){return t.k===k;})[0],c=s.s>-1?seatOf(s.s).c:MID;return '<span class="tl" style="--c:'+c+'">'+ico(k,22)+'<i>'+s.n+'</i></span>';}).join('')+'</div></section>'
   +'<section><header><b>Six and I’ll tell you</b><span class="small">Six symbols and a box for your words.</span></header><div class="tg12 six">'
   +SIX.map(function(k){var s=STARTS.filter(function(t){return t.k===k;})[0],c=s.s>-1?seatOf(s.s).c:MID;return '<span class="tl" style="--c:'+c+'">'+ico(k,22)+'<i>'+s.n+'</i></span>';}).join('')
   +'<span class="tl tell" style="grid-column:1/-1">'+ico('mic',22)+ico('keyboard',22)+'<i>I’ll tell you. Type it or say it.</i></span></div></section></div>';
  html+='<div class="dock row2"><button type="button" class="btn pri" data-go="start-picked">Use twelve</button><button type="button" class="btn" data-go="start-picked">Use six</button></div>';
 }
 ui.innerHTML=html;};

/* ================= 2. FEELING ================= */
SCR.feeling=function(){
 var A=STARTS[0],c=seatOf(A.s).c,F=fcol();
 setBg({cx:F.cx,cy:F.cy,r:F.r,arcs:false,lit:[A.s],tl:M?8:13},'');
 var fsv='<svg viewBox="0 0 400 360" aria-label="Your starting point, and two words the Field has picked up">'
  +'<circle cx="200" cy="180" r="150" fill="none" stroke="rgba(255,255,255,.07)"/>'
  +'<path d="M200 70 L200 150" stroke="'+c+'" stroke-width="2"/>'
  +'<circle cx="200" cy="48" r="26" fill="#0C0D12" stroke="'+c+'" stroke-width="2.6"/><svg x="184" y="32" width="32" height="32" viewBox="0 0 48 48" style="color:'+c+'" class="ic">'+ICONS.anxiety+'</svg>'
  +'<circle cx="200" cy="180" r="30" fill="none" stroke="'+ACC+'" stroke-width="1.8" stroke-dasharray="4 5"/>'
  +'<circle cx="120" cy="230" r="9" fill="#0C0D12" stroke="'+SEATS[3].c+'" stroke-width="2.2"/><circle cx="120" cy="230" r="3.5" fill="'+SEATS[3].c+'"/><text x="108" y="256" text-anchor="end" font-size="'+(M?20:14)+'" fill="#EFEDE8" font-family="Inter,sans-serif">tight chest</text>'
  +'<path d="M128 224 L172 192" stroke="'+ACC+'" stroke-width="1.6"/>'
  +'<circle cx="290" cy="250" r="9" fill="#0C0D12" stroke="'+SEATS[2].c+'" stroke-width="2.2"/><circle cx="290" cy="250" r="3.5" fill="'+SEATS[2].c+'"/><text x="302" y="272" font-size="'+(M?20:14)+'" fill="#EFEDE8" font-family="Inter,sans-serif">cannot stop</text>'
  +'<path d="M282 244 L226 198" stroke="'+ACC+'" stroke-width="1.6" stroke-dasharray="4 4"/></svg>';
 ui.innerHTML=chrome(0)
  +'<div class="col story">'
  +'<button type="button" class="chip on" style="--c:'+c+';align-self:flex-start" aria-pressed="true" data-go="start-picked">'+ico(A.k,24)+'Starting point: '+A.n+'</button>'
  +'<span class="eyebrow acc">Feel</span>'
  +'<h1 class="'+(M?'h1':'display')+'">What are you feeling today?</h1>'
  +'<div class="ta one"><div class="tx">A tight chest. I keep checking my phone and I cannot stop.<i class="caret"></i></div></div>'
  +'<div class="ask2"><span class="eyebrow">Next</span><p class="lead">How does that feeling run through you?</p></div>'
  +'<div class="row"><button type="button" class="btn" aria-label="Speak instead">'+ico('mic',20)+'Speak</button><button type="button" class="btn pri" data-go="story">Continue</button></div>'
  +'</div><div class="rightcol"><div class="sfield" style="width:'+F.w+'px">'+fsv+'</div></div>';};

/* ================= 3. STORY, TEXT AND VOICE ================= */
function storyField(){
 var s=Math.min(M?W-12:W*.40,M?378:640);
 return '<div class="sfield" style="width:'+s+'px">'+formSVG(formParams(2),{big:true,fs:M?1.5:1})+'</div>';}
SCR.story=function(voice){
 var F=fcol();setBg({cx:F.cx,cy:F.cy,r:F.r,arcs:false,lit:[2,5,0],tl:M?8:13},'');
 var seg='<div class="seg" role="group" aria-label="Type or speak"><button type="button" aria-pressed="'+!voice+'" data-go="story">'+ico('keyboard',20)+'Type</button><button type="button" aria-pressed="'+!!voice+'" data-go="story-voice">'+ico('mic',20)+'Speak</button></div>';
 var body;
 if(!voice){
  body='<div class="ta big"><div class="tx">'+sig(SAMPLE,SIGW)+'<i class="caret"></i></div></div>'
   +'<p class="small dim">Typing stays on this device.</p>';
 }else{
  body='<div class="ta big v"><div class="tx">'+sig('I keep taking care of everybody else and I feel overwhelmed, afraid that things will',SIGW)+' <span class="interim">fall apart</span></div>'
   +'<div class="wave">'+waveSVG()+'</div></div>'
   +'<div class="listen"><span class="micring">'+ico('mic',28)+'</span><div><b>Listening</b><span class="small"> The line moves with your voice.</span></div><button type="button" class="btn">'+ico('stop',20)+'Stop</button></div>'
   +'<p class="small dim">Recording sends the audio to your browser’s speech service. Typing does not leave this device.</p>';}
 ui.innerHTML=chrome(0)
  +'<div class="col story">'
  +'<h1 class="'+(M?'h1':'display')+'">Tell us what’s off.</h1>'+seg+body
  +'<div class="row"><button type="button" class="btn pri" data-go="forming">Continue</button></div></div>'
  +'<div class="rightcol">'+storyField()+'</div>';};

/* ================= 4. MIRROR FORMING (live) ================= */
SCR.forming=function(){
 var s=Math.min(M?W-16:HT*.6,640);
 setBg({cx:W/2-58*s/464,cy:HT/2-(M?30:14),r:M?175:Math.min(HT*.42,400),arcs:false,lit:[2],tl:M?8:13},'');
 ui.innerHTML=chrome(1)
  +'<div class="stagecenter"><div class="formbox" id="fb" style="width:'+s+'px"></div>'
  +'<div class="fcap"><span class="eyebrow">Reading what you wrote</span><h2 class="h1" id="fname">Pattern</h2><p class="lead" id="fgram">Repetition gathers</p>'
  +'<div class="dots" id="fdots"></div></div></div>';
 var cur=reduce?3:0;
 function paint(P,idx){$('#fb').innerHTML=formSVG(P,{big:true,pulse:.4,fs:M?1.25:1});
  $('#fname').textContent=FORM_NAMES[idx];$('#fgram').textContent=FORM_GRAM[idx];
  $('#fdots').innerHTML=FORM_NAMES.map(function(n,i){return '<i class="'+(i<=idx?'on':'')+'"></i>';}).join('');}
 paint(formParams(cur),cur);
 if(!reduce){
  var alive=true;window.__stop=function(){alive=false;};
  (function next(){if(!alive)return;var from=formParams(cur),n=(cur+1)%6;
   tween(from,formParams(n),n===0?200:1100,function(P){paint(P,cur);},function(){cur=n;paint(formParams(cur),cur);timers.push(setTimeout(next,cur===5?2600:900));});})();}
};

/* ================= 5. MIRROR ================= */
function acc3(){
 return '<div class="acc3">'
  +'<button type="button" class="ab" data-go="somatic">'+ico('thatsit',30)+'<span>That’s it</span></button>'
  +'<button type="button" class="ab" data-go="mirror-notquite">'+ico('notquite',30)+'<span>Not quite</span></button>'
  +'<button type="button" class="ab" data-go="mirror-adjust">'+ico('adjust',30)+'<span>Adjust</span></button></div>';}
/* what the pattern feels like running through you: behaviour, thought, body,
   and what it costs. House voice: short, physical, no cure, no cause. The
   pattern supports what follows; it does not make it. */
function feelRows(subj){
 var rows=[['act','You do','You pick up '+(subj||'the next task')+' before anyone asks.'],
  ['think','You think','A count runs under it: if I stop, it all falls.'],
  ['pressure','Your body','A grip under the ribs. The shoulders sit half an inch high.'],
  ['reduce','It costs','Your own list waits.']];
 return '<div class="feel"><span class="eyebrow">Running through you</span>'+rows.map(function(r){
  return '<div class="fr2"><span class="fi">'+ico(r[0],24)+'</span><span class="fk">'+r[1]+'</span><span class="ft">'+r[2]+'</span></div>';}).join('')+'</div>';}
function partsBlock(subj){
 return '<div class="parts"><div class="pr"><span class="pl">Who it is about</span><span class="pv"><i class="dr" style="--c:'+ACC+'"></i>'+(subj||'everybody else')+'</span></div>'
  +'<div class="pr"><span class="pl">What you do</span><span class="pv"><i class="dr" style="--c:'+SEATS[2].c+'"></i>taking care of</span></div>'
  +'<div class="pr"><span class="pl">How it feels</span><span class="pv"><i class="dr" style="--c:'+FEAR+'"></i>overwhelmed, afraid</span></div></div>';}
function mirrorHTML(second){
 var c=SEATS[2].c,subj=second?'my team at work':'everybody else';
 var art='<div class="art2"><div class="bodybox" id="bb">'+bodySVG({hi:2,pulse:.3,labels:M?'hi':true})+'</div><div class="clbox" id="cb">'+relSVG(REL_P[0])+'</div></div>';
 var said='<div class="said t-said"><span class="eyebrow">You said</span><p class="quote">“I keep taking care of <span class="subj">'+subj+'</span>.”</p>'+partsBlock(subj)+'</div>';
 var quality='<div class="st"><span class="sl">Quality</span><span class="sv"><span class="si wmini">'+wheelMini(M?40:48,{f:'Fearful',s:'Anxious',t:'Overwhelmed'})+'</span><span><span class="svt">Overwhelmed</span><span class="svs">Fearful, anxious</span></span></span></div>';
 var where='<div class="st"><span class="sl">Where</span><span class="sv"><span class="si" style="color:'+c+'">'+ico('density',22)+'</span><span class="svt">Solar plexus</span></span></div>';
 var chg=second?'<div class="chg"><p><span class="dim">Who it is about:</span> <s>everybody else</s> '+ico('arrow',16)+' <b>my team at work</b></p></div>':'';
 var noticed='<div class="noticed"><span class="eyebrow acc">'+(second?'Atüned read it again':'Atüned noticed')+'</span><h1 class="tag">Over-responsibility</h1>'+chg+art
  +'<div class="stats">'+quality+where+'</div>'+feelRows(second?'your team’s tasks':null)+'</div>';
 var cw=M?350:440,ch=M?250:300;
 var link='<div class="link"><span class="eyebrow">Linked to</span>'+chainSVG(cw,ch)
  +'<p class="small">Charge on Fear and Anger can feed these if the pattern keeps repeating. Dashed means not formed yet.</p></div>';
 var hyp='<p class="hyp"><b>What supports it.</b> Fear that things fall apart if you do not handle them.</p>';
 var test='<div class="test t-test">'+hyp+'<p class="q">Does this feel accurate?</p>'+acc3()+'</div>';
 return '<div class="mr"><div class="c1">'+said+'</div><div class="c2">'+noticed+'</div><div class="c3">'+link+test+'</div></div>';}
SCR.mirror=function(second){
 setBg({cx:M?W*.66:W*.46,cy:M?200:HT*.418+(second?32:0),r:M?76:Math.min(HT*.138,138),arcs:false,lit:[2],tl:M?7:11},"");
 ui.innerHTML=chrome(2)+mirrorHTML(second);
 // at 390 the Mirror scrolls inside itself, and the ring behind it scrolls with it
 if(M){var mrs=$('.mr');mrs.addEventListener('scroll',function(){bg.style.transform='translateY('+(-mrs.scrollTop)+'px)';});}
 if(!reduce){var alive=true;window.__stop=function(){alive=false;};
  var t0=null;(function loop(ts){if(!alive)return;if(t0===null)t0=ts;var t=(ts-t0)/1000,k=(Math.sin(t*1.3)+1)/2;
   var P=mixParams(REL_P[0],REL_P[1],k);var cb=$('#cb');if(cb)cb.innerHTML=relSVG(P);var bb=$('#bb');if(bb)bb.innerHTML=bodySVG({hi:2,pulse:k,labels:M?'hi':true});requestAnimationFrame(loop);})(0);}
 else{var cb=$('#cb');cb.innerHTML=relSVG(REL_P[1]);}
};

/* ---- the Mirror's feeling word comes from the wheel ---- */
SCR.mwheel=function(){
 var sz=M?262:Math.min(HT*.72,700);
 setBg({cx:M?W/2:W*.3,cy:M?250:HT*.5,r:M?140:Math.min(sz/2+10,364),arcs:false,lit:[0],quiet:.3,tl:M?8:12},'');
 var path={f:'Fearful',s:'Anxious',t:'Overwhelmed'},also={f:'Bad',s:'Stressed',t:'Overwhelmed'};
 var wheel='<div class="whl" style="width:'+sz+'px;height:'+sz+'px">'+wheelSVG(sz,{path:path,also:also,labels:!M,lfs:14})+'</div>';
 var rows=[['Fearful','family',0],['Anxious','next ring',1],['Overwhelmed','your word',2]];
 var steps='<div class="wsteps">'+rows.map(function(r){
  return '<div class="ws"><span class="wsr">'+ringGlyph(r[2])+'</span><span class="wsw">'+r[0]+'</span><span class="wsk">'+r[1]+'</span></div>';}).join('')+'</div>';
 var also2='<p class="alsoline"><span class="alsor">'+ringGlyph(2,true)+'</span>The same word sits under Bad, then Stressed. Read in context, so both can apply.</p>';
 ui.innerHTML=chrome(2)
  +'<div class="wl" style="left:'+(M?(W-sz)/2:W*.3-sz/2)+'px;top:'+(M?96:HT*.5-sz/2)+'px">'+wheel+'</div>'
  +'<div class="col wr"><span class="eyebrow acc">Quality</span><h1 class="'+(M?'h1':'display')+'">The word comes from a wheel.</h1>'
  +'<p class="lead">You said “afraid” and “overwhelmed”. Both sit in one family.</p>'+steps
  +'<div class="fam"><span class="famdot" style="--c:'+FEAR+'"><i></i></span><span>Fearful sits at the <b>Root</b>.</span></div>'+also2
  +'<div class="row"><button type="button" class="btn" data-go="mirror">'+ico('back',20)+'Back to the reading</button></div></div>';};
/* a tiny ring that says which of the three rings a word is on */
function ringGlyph(n,dash){
 var out='<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">';
 [7,12.5,18].forEach(function(r,i){out+='<circle cx="20" cy="20" r="'+r+'" fill="none" stroke="'+(i===n?FEAR:'rgba(255,255,255,.2)')+'" stroke-width="'+(i===n?4:2)+'"'+(i===n&&dash?' stroke-dasharray="3 3"':'')+'/>';});
 return out+'</svg>';}

/* ---- Not quite: which part is not clear ---- */
SCR.notquite=function(sel){
 sel=sel==null?2:sel;
 setBg({cx:M?W/2:W*.72,cy:M?250:HT*.5,r:M?118:300,arcs:false,ticks:false,lit:[],quiet:.4,tl:M?8:12},'');
 var parts=[['feelword','How it feels','overwhelmed','feels'],['describe','What you do','taking care of','does'],['about','Who it is about','everybody else','about']];
 var sentence='<p class="sent">I keep <span class="pt'+(sel===1?' on':'')+'" data-l="What you do">taking care of</span> <span class="pt'+(sel===2?' on':'')+'" data-l="Who it is about">everybody else</span> and I feel <span class="pt'+(sel===0?' on':'')+'" data-l="How it feels">overwhelmed</span>.</p>';
 var chips=parts.map(function(p,i){return '<button type="button" class="chip pk'+(i===sel?' on':'')+'" style="--c:'+ACC+'" aria-pressed="'+(i===sel)+'">'+ico(p[0],24)+'<span><b>'+p[1]+'</b><i>'+p[2]+'</i></span></button>';}).join('')
  +'<button type="button" class="chip pk" aria-pressed="false">'+ico('other',24)+'<span><b>Something else</b></span></button>';
 ui.innerHTML=chrome(2)
  +'<div class="col mid nq"><span class="eyebrow acc">Not quite</span><h1 class="'+(M?'h1':'display')+'">Which part is not clear?</h1>'
  +(M?sentence:'')+'<div class="chipcol">'+chips+'</div>'
  +'<div class="row"><button type="button" class="btn" data-go="mirror">'+ico('back',20)+'Back</button><button type="button" class="btn pri" data-go="mirror-subject">Next</button></div></div>'
  +(M?'':'<div class="rightcol sentcol" style="right:max(40px,3vw);width:min(700px,44vw)">'+sentence+'<p class="small dim sentnote">Each part is read from your own sentence. The part you pick is read again first.</p></div>');};
/* ---- the subject, asked ---- */
SCR.subject=function(){
 setBg({cx:M?W/2:W*.74,cy:M?250:HT*.5,r:M?110:280,arcs:false,ticks:false,lit:[],quiet:.38,tl:M?8:12},'');
 var opts=[['Everybody else',0],['My family',0],['My team at work',1],['One person',0],['Something else',0]];
 var w=M?330:560,svg='<svg viewBox="0 0 '+w+' 210" class="forksvg" aria-label="The pattern, and who it is about">'
  +'<circle cx="70" cy="105" r="34" fill="#0C0D12" stroke="'+SEATS[2].c+'" stroke-width="2.8"/><circle cx="70" cy="105" r="11" fill="'+SEATS[2].c+'"/>'
  +'<text x="70" y="164" text-anchor="middle" font-size="14" font-weight="600" fill="#EFEDE8" font-family="Inter,sans-serif">Over-responsibility</text>'
  +'<path d="M104 105 H'+(w-110)+'" stroke="'+ACC+'" stroke-width="2.2"/>'
  +'<circle cx="'+(w-84)+'" cy="105" r="30" fill="none" stroke="'+ACC+'" stroke-width="2.4" stroke-dasharray="5 5"/>'
  +'<text x="'+(w-84)+'" y="164" text-anchor="middle" font-size="14" font-weight="600" fill="#EFEDE8" font-family="Inter,sans-serif">my team at work</text></svg>';
 ui.innerHTML=chrome(2)
  +'<div class="col mid nq"><span class="eyebrow acc">Not quite</span><h1 class="'+(M?'h1':'display')+'">Who or what is it about?</h1>'
  +'<div class="chipcol row2">'+opts.map(function(o){return '<button type="button" class="chip'+(o[1]?' on':'')+'" style="--c:'+ACC+'" aria-pressed="'+!!o[1]+'">'+o[0]+'</button>';}).join('')+'</div>'
  +'<div class="ta one"><div class="tx dim">Or say it in your own words.</div></div>'
  +'<div class="row"><button type="button" class="btn" data-go="mirror-notquite">'+ico('back',20)+'Back</button><button type="button" class="btn pri" data-go="mirror-second">Read it again</button></div></div>'
  +(M?'':'<div class="rightcol" style="right:max(60px,5vw);width:min(600px,40vw)">'+svg+'</div>');};
SCR.adjust=function(){
 var F=fcol();setBg({cx:F.cx,cy:F.cy,r:F.r,arcs:false,lit:[2],tl:M?8:13},'');
 var P=formParams(5);
 ui.innerHTML=chrome(2)
  +'<div class="col story">'
  +'<h1 class="'+(M?'h1':'display')+'">Tell us what’s off.</h1>'
  +'<div class="was t-said"><span class="eyebrow">What we read</span><p class="small">Over-responsibility, at the solar plexus, about everybody else.</p></div>'
  +'<div class="ta big"><div class="tx">It is not that I have to. It is that nobody else will notice if I stop, and that is the part that scares me.<i class="caret"></i></div></div>'
  +'<div class="seg" role="group"><button type="button" aria-pressed="true">'+ico('keyboard',20)+'Type</button><button type="button" aria-pressed="false">'+ico('mic',20)+'Speak</button></div>'
  +'<div class="row"><button type="button" class="btn pri" data-go="mirror">Update the reading</button></div></div>'
  +'<div class="rightcol"><div class="sfield" style="width:'+Math.min(M?W-24:W*.40,M?270:640)+'px">'+formSVG(P,{big:true,fs:M?1.5:1})+'</div></div>';};
SCR.empty=function(){
 setBg({cx:M?W/2:W*.76,cy:M?HT*.66:HT*.54,r:M?150:330,arcs:false,lit:[],quiet:.34,tl:M?8:12},'');
 var spine='<div class="bodybox pick4">'+bodySVG({hi:-1,labels:true,sel:[5,4,3,2]})+'</div>';
 var zones=[['Head',5],['Throat',4],['Chest',3],['Gut',2]];
 ui.innerHTML=chrome(1)
  +'<div class="col mid">'
  +'<span class="eyebrow acc">Nothing came up from that</span><h1 class="'+(M?'h1':'display')+'">Where does it land in your body?</h1>'
  +'<div class="chipcol row2">'+zones.map(function(z){return '<button type="button" class="chip" style="--c:'+SEATS[z[1]].c+'" aria-pressed="false"><i class="dotc" style="--c:'+SEATS[z[1]].c+'"></i>'+z[0]+'</button>';}).join('')
  +'<button type="button" class="chip" aria-pressed="false">'+ico('other',24)+'Somewhere else</button></div>'
  +'<p class="small dim">Or add a few more words to what you wrote.</p>'
  +'<div class="row"><button type="button" class="btn" data-go="story">'+ico('back',20)+'Back to the story</button></div></div>'
  +'<div class="rightcol low" style="right:min(20vw,330px)">'+spine+'</div>';};

/* ================= 7. SOMATIC SETUP: the neurosomatic line ================= */
SCR.somatic=function(){
 var c=SEATS[2].c;
 setBg({cx:M?W-70:Math.max(150,W*.13)+130,cy:M?200:HT*.5,r:M?84:Math.min(HT*.37,330),arcs:false,lit:[2],tl:M?7:13},'');
 var sens=[['pressure','Pressure'],['density','Density'],['relief','Relief'],['movement','Movement'],['activation','Activation'],['nothing','Nothing']];
 ui.innerHTML=chrome(3)
  +'<div class="somL"><div class="bodybox" id="bb">'+bodySVG({hi:2,pulse:.3,labels:M?'hi':true})+'</div></div>'
  +'<div class="col som">'
  +'<h1 class="'+(M?'h1':'display')+' som1">Welcome to a neurosomatic experience.</h1>'
  +'<p class="lead som2">Awareness and intuition is a tool we use to turn your senses inward.</p>'
  +'<div class="held t-said"><span class="eyebrow">Hold this in mind</span><p class="quote">“I keep taking care of everybody else.”</p></div>'
  +'<div class="sens">'+sens.map(function(s,i){return '<span class="sn'+(i===5?' z':'')+'">'+ico(s[0],26)+s[1]+'</span>';}).join('')+'</div>'
  +'<p class="small">You do not need to feel anything. Noticing nothing is information too.</p>'
  +'<div class="row"><button type="button" class="btn pri" data-go="release-open">Begin</button><button type="button" class="btn ghost">'+ico('stop',20)+'Stop</button></div></div>';
 if(!reduce){var alive=true;window.__stop=function(){alive=false;};var t0=null;(function lp(ts){if(!alive)return;if(t0===null)t0=ts;var k=(Math.sin((ts-t0)/1000*1.1)+1)/2;var bb=$('#bb');if(bb)bb.innerHTML=bodySVG({hi:2,pulse:k,labels:M?'hi':true});requestAnimationFrame(lp);})(0);}
};

/* ================= 8. THE RELEASE, as the software runs it ================= */
/* 8a. it opens on the recorded voice. one screen, written out as it is said. */
var Q=new URLSearchParams(location.search);
SCR.relopen=function(chars){
 var total=0;INTRO.forEach(function(l){total+=l.length;});total+=(STMT_REL+SUBJECT+'.').length;
 if(chars==null&&Q.get('c')!=null)chars=Math.min(total,+Q.get('c'));
 var full=chars==null||chars>=total;if(chars==null)chars=total;
 var cx=W/2,cy=M?HT*.7:HT*.5,r=M?112:Math.min(HT*.405,420);
 function bgdraw(t){bg.innerHTML='<svg viewBox="0 0 '+W+' '+HT+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g>'+voiceTicks(cx,cy,r,ampAt(t,1),M?8:12)+'</g></svg>';}
 bgdraw(1.2);
 ui.innerHTML=chrome(3,false)+'<div class="ropen" id="ro">'+relOpenHTML(chars,{nocaret:chars>=total})+'</div>'+relButtons({});
 if(Q.get('pulse'))document.body.classList.add('pulsepeak');
 if(!reduce){var alive=true;window.__stop=function(){alive=false;};var t0=null,written=chars;
  (function lp(ts){if(!alive)return;if(t0===null)t0=ts;var t=(ts-t0)/1000;bgdraw(t+1.2);
   var want=Math.min(total,Math.floor(t*17)+4);if(want!==written&&chars<total){written=want;$('#ro').innerHTML=relOpenHTML(want,{});}
   requestAnimationFrame(lp);})(0);
  }
};
/* 8b. the run: address by address, left and right, release and install */
SCR.relrun=function(i,p){
 i=i==null?(Q.get('i')!=null?+Q.get('i'):5):i;p=p==null?(Q.get('p')!=null?+Q.get('p'):.55):p;
 var cx=W/2,cy=M?HT*.42:HT*.47,r=M?150:Math.min(HT*.4,380);
 bg.innerHTML='';
 ui.innerHTML=chrome(3,false)+'<div class="rrun" id="rr">'+relRunHTML(M,i,p,{})+'</div>';
 if(!reduce){var alive=true;window.__stop=function(){alive=false;};var li=i,t0=null,pp=p;
  (function lp(ts){if(!alive)return;if(t0===null)t0=ts;pp+=.004;if(pp>=1){pp=0;li=(li+1)%12;}
   $('#rr').innerHTML=relRunHTML(M,li,pp,{});requestAnimationFrame(lp);})(0);}
};
/* 8c. the cooldown */
SCR.relcool=function(left){
 left=left==null?(Q.get('t')!=null?+Q.get('t'):106):left;
 var cx=M?W/2:W*.3,cy=M?158:HT*.5;
 setBg({cx:cx,cy:cy,r:M?112:Math.min(HT*.3,300),arcs:false,lit:[2],quiet:.4,tl:M?8:12},'');
 ui.innerHTML=chrome(3,false)+'<div class="rcool" id="rc">'+relCoolHTML(M,left,{})+'</div>';
 if(!reduce){var alive=true;window.__stop=function(){alive=false;};var s=left,t0=null,last=-1;
  (function lp(ts){if(!alive)return;if(t0===null)t0=ts;var n=Math.max(0,left-Math.floor((ts-t0)/1000));if(n!==last){last=n;$('#rc').innerHTML=relCoolHTML(M,n,{});}requestAnimationFrame(lp);})(0);}
};

/* ================= 9. AFTER THE RELEASE ================= */
SCR.observe=function(){
 setBg({cx:M?W/2:W*.29,cy:M?186:HT*.5,r:M?132:Math.min(HT*.34,310),arcs:false,lit:[2],tl:M?8:13},'');
 var opts=[['different','I feel different',0],['seeit','I see it differently',0],['moved','Something moved',1],['nothing','Nothing changed',0],['unsure','I’m not sure',0]];
 var s=Math.min(M?W*.62:HT*.58,520);
 ui.innerHTML=chrome(4)
  +'<div class="obsL"><div class="relbox" style="width:'+s+'px">'+relSVG(REL_P[5])+'</div>'
  +'<div class="ba"><span><i class="g"></i>Before</span><span><i class="s"></i>Now</span></div></div>'
  +'<div class="col obsR">'
  +'<span class="eyebrow acc">Three addresses, twelve lines</span><h1 class="'+(M?'h1':'display')+'">What is here now?</h1>'
  +'<div class="chipcol">'+opts.map(function(o){return '<button type="button" class="chip'+(o[2]?' on':'')+'" style="--c:'+ACC+'" aria-pressed="'+!!o[2]+'">'+ico(o[0],24)+o[1]+'</button>';}).join('')+'</div>'
  +'<p class="small">Recorded as what you noticed. Whether it changes what you do comes later.</p>'
  +'<div class="row"><button type="button" class="btn pri" data-go="handoff">Continue</button></div></div>';};

/* ================= 10. HANDOFF: what changed, or run it again ================= */
SCR.handoff=function(){
 setBg({cx:-999,cy:-999,r:10,arcs:false,ticks:false},'');
 var items=[['You said','“I keep taking care of everybody else.”','t-said'],['Atüned noticed','Over-responsibility, at the solar plexus','t-noticed'],['You tested','That’s it','t-test'],['You worked with it','12 lines, 3 addresses','t-w'],['You observed','Something moved','t-o']];
 var lz=M?150:230,hs=lz+(M?30:70);
 var ring='<div class="hp" style="width:'+hs+'px;height:'+hs+'px"><svg class="hring" width="'+hs+'" height="'+hs+'" viewBox="0 0 '+hs+' '+hs+'" aria-hidden="true">'+fieldRing({cx:hs/2,cy:hs/2,r:lz*.5+(M?16:30),arcs:false,quiet:.5,tl:M?7:11,sw:M?1.6:2})+'</svg><div class="lpi">'+loopRing(lz,{doneSet:[0,2],lit:1,labels:true})+'</div></div>';
 ui.innerHTML=chrome(5,true,true)
  +'<div class="col hand"><span class="eyebrow acc">What just happened</span><h1 class="'+(M?'h1':'display')+'">You did that.</h1>'
  +'<div class="five">'+items.map(function(it,i){return '<div class="fv '+it[2]+'">'+(M?'<i class="mn"></i>':'')+'<span class="eyebrow">'+it[0]+'</span><p>'+it[1]+'</p></div>';}).join('')+'</div>'
  +'<div class="hrow">'+ring
  +'<div class="hact"><p class="lead">Two stations closed. Play is next.</p>'
  +'<div class="hbtns"><button type="button" class="btn pri" data-go="tutorial">'+ico('seeit',20)+'See what changed</button>'
  +'<button type="button" class="btn" data-go="release-open">'+ico('rerun',20)+'Run it again</button></div>'
  +'<p class="small dim hnote">See what changed opens the Field with your three addresses, before and after. Running it again costs nothing.</p>'
  +'<button type="button" class="btn ghost" data-go="keep">'+ico('guest',20)+'Keep this</button></div></div></div>';};

/* ================= 11. KEEP WHAT YOU FOUND: the account, after the first release ================= */
SCR.keep=function(){
 setBg({cx:M?W/2:W*.74,cy:M?150:HT*.5,r:M?64:Math.min(HT*.34,320),arcs:false,lit:[0,2],quiet:.4,tl:M?7:12},'');
 var goes=[['The story you wrote'],['What Atüned read from it'],['The release you ran'],['Your answers']];
 var fl=function(id,label,dot,val,type,opt){return '<label class="kf"><span class="fl"><i class="dot" style="--c:'+dot+'"></i>'+label+(opt?' <span class="opt">optional</span>':'')+'</span><input id="'+id+'" type="'+type+'" value="'+val+'" autocomplete="off"></label>';};
 var ck=function(t,on){return '<label class="ck"><input type="checkbox"'+(on?' checked':'')+'><span class="bx">'+ico('tick',18)+'</span><span>'+t+'</span></label>';};
 var goesH='<div class="kgo t-noticed"><span class="eyebrow acc">Goes with you</span>'+goes.map(function(g){return '<p>'+ico('check',20)+g[0]+'</p>';}).join('')+'</div>'
  +'<div class="kstay t-test"><span class="eyebrow">Stays on this device</span><p>'+ico('lock',20)+'Your birth data</p></div>';
 ui.innerHTML=chrome(5,true,true)
  +'<div class="col keep"><span class="eyebrow acc">Account</span><h1 class="'+(M?'h1':'display')+'">Keep what you found.</h1>'
  +(M?'':'<p class="lead">Make a username and what you just did goes with it.</p>')
  +'<div class="kform">'+fl('ku','Username','var(--throat)','mika.salas','text')+fl('kp','Passphrase','var(--root)','••••••••••••••','password')
  +fl('ke','Recovery email','var(--heart)','mika@example.com','email',true)
  +'<span class="hint">Without one, a lost passphrase cannot be recovered.</span>'
  +ck('I am 18 or over.',true)+ck('I agree to the <a class="il" href="#terms">Terms</a> and the <a class="il" href="#privacy">Privacy policy</a>.',true)+'</div>'
  +'<div class="row"><button type="button" class="btn pri" data-go="tutorial">Keep it</button><button type="button" class="btn" data-go="handoff">Not now</button></div></div>'
  +'<div class="kside">'+goesH+'</div>';};

/* ================= routing ================= */
var ROUTE={'start':function(){SCR.start(-1);},'start-compare':function(){SCR.compare();},'start-picked':function(){SCR.start(0);},'feeling':function(){SCR.feeling();},
 'story':function(){SCR.story(false);},'story-voice':function(){SCR.story(true);},'forming':function(){SCR.forming();},
 'mirror':function(){SCR.mirror(false);},'mirror-wheel':function(){SCR.mwheel();},'mirror-notquite':function(){SCR.notquite(2);},'mirror-subject':function(){SCR.subject();},'mirror-second':function(){SCR.mirror(true);},'mirror-adjust':function(){SCR.adjust();},'mirror-empty':function(){SCR.empty();},
 'somatic':function(){SCR.somatic();},'release-open':function(){SCR.relopen();},'release-run':function(){SCR.relrun();},'release-cool':function(){SCR.relcool();},'observe':function(){SCR.observe();},'handoff':function(){SCR.handoff();},'keep':function(){SCR.keep();}};
function show(){clearT();var h=setHash()||'start-picked';(ROUTE[h]||ROUTE['start-picked'])();document.title='Onboarding, '+h;}
ui.addEventListener('click',function(e){
 var t=e.target.closest('[data-pick],[data-go]');if(!t)return;
 if(t.hasAttribute('data-pick')){clearT();SCR.start(+t.getAttribute('data-pick'));return;}
 var g=t.getAttribute('data-go');if(g==='tutorial'){location.href='tutorial.html#t0';return;}
 location.hash=g;});
addEventListener('hashchange',show);
show();
})();
