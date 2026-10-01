/* flow.js. The onboarding, as one clickable prototype. Hash selects a frame:
   #start #start-picked #feeling #story #story-voice #forming #mirror
   #mirror-notquite #mirror-adjust #mirror-empty #somatic #release #observe #handoff */
(function(){
var W=innerWidth,HT=innerHeight,M=W<=700;
var root=document.createElement('div');root.className='stage';document.body.appendChild(root);
var bg=document.createElement('div');bg.className='fieldbg';root.appendChild(bg);
var ui=document.createElement('div');ui.className='ui';root.appendChild(ui);
var timers=[];function clearT(){timers.forEach(function(t){clearTimeout(t);});timers=[];window.__stop&&window.__stop();window.__stop=null;}
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var SAMPLE='I keep taking care of everybody else and I feel overwhelmed, afraid that things will fall apart if I do not handle them.';

function setBg(o,extra){
 bg.innerHTML='<svg viewBox="0 0 '+W+' '+HT+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="breathe">'+fieldRing(o)+'</g>'+(extra||'')+'</svg>';}
function chrome(n,leave,noTrace){
 return '<div class="topl">'+mark()+'</div>'+(noTrace?'':'<div class="trace">'+trace(n)+'</div>')+(leave===false?'':leaveBtn());}
function seatOf(i){return SEATS[i];}
function sig(txt,words){ // underline signal words in the person's own sentence
 words.forEach(function(w){var re=new RegExp('('+w[0]+')','i');txt=txt.replace(re,'<span class="sg" style="--c:'+w[1]+'">$1</span>');});return txt;}
var SIGW=[['taking care of everybody else',SEATS[2].c],['overwhelmed',SEATS[5].c],['afraid',SEATS[0].c],['fall apart',SEATS[0].c]];

function fcol(){var w=Math.min(M?W-12:W*.40,M?378:640),mg=Math.max(36,W*.035);
 return {w:w,cx:M?W/2:W-mg-w/2,cy:M?HT*.72:HT*.5,r:M?118:w*.47};}
var SCR={};

/* ================= 1. STARTING POINT ================= */
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

/* ================= 2. FEELING ================= */
SCR.feeling=function(){
 var A=STARTS[0],c=seatOf(A.s).c,F=fcol();
 setBg({cx:F.cx,cy:F.cy,r:F.r,arcs:false,lit:[A.s],tl:M?8:13},'');
 var fsv='<svg viewBox="0 0 400 360" aria-label="Your starting point, and two words the Field has picked up">'
  +'<circle cx="200" cy="180" r="150" fill="none" stroke="rgba(255,255,255,.07)"/>'
  +'<path d="M200 70 L200 150" stroke="'+c+'" stroke-width="2"/>'
  +'<circle cx="200" cy="48" r="26" fill="#0C0D12" stroke="'+c+'" stroke-width="2.6"/><svg x="184" y="32" width="32" height="32" viewBox="0 0 48 48" style="color:'+c+'" class="ic">'+ICONS.anxiety+'</svg>'
  +'<text x="200" y="100" text-anchor="middle" font-size="13" fill="#B4B0A8" font-family="Inter,sans-serif" opacity="0">Anxiety</text>'
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
function waveSVG(){var d='';for(var x=0;x<=600;x+=5){var a=18*Math.sin(x/38)*Math.sin(x/170+.6);d+=(x?'L':'M')+x+' '+f(24+a);}
 return '<svg viewBox="0 0 600 48" preserveAspectRatio="none" aria-label="Voice level"><path d="'+d+'" fill="none" stroke="'+ACC+'" stroke-width="2" stroke-linecap="round"/></svg>';}

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
function statCell(label,val,icon,c,extra){
 return '<div class="st"><span class="sl">'+label+'</span><span class="sv"><span class="si" style="color:'+c+'">'+ico(icon,22)+'</span>'+val+(extra||'')+'</span></div>';}
function intensityRing(n,c){var r=14,L=2*Math.PI*r;
 return '<svg class="irg" width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="'+r+'" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="2.4"/><circle cx="17" cy="17" r="'+r+'" fill="none" stroke="'+c+'" stroke-width="2.8" stroke-linecap="round" stroke-dasharray="'+f(L*n/10)+' '+f(L)+'" transform="rotate(-90 17 17)"/></svg>';}
function acc3(){
 return '<div class="acc3">'
  +'<button type="button" class="ab" data-go="somatic">'+ico('thatsit',30)+'<span>That’s it</span></button>'
  +'<button type="button" class="ab" data-go="mirror-notquite">'+ico('notquite',30)+'<span>Not quite</span></button>'
  +'<button type="button" class="ab" data-go="mirror-adjust">'+ico('adjust',30)+'<span>Adjust</span></button></div>';}
SCR.mirror=function(){
 var c=SEATS[2].c;
 setBg({cx:M?W*.68:W*.485,cy:M?222:HT*.55,r:M?90:Math.min(HT*.335,330),arcs:false,lit:[2],tl:M?7:12},'');
 var art='<div class="art2"><div class="bodybox" id="bb">'+bodySVG({hi:2,pulse:.3,labels:M?'hi':true})+'</div><div class="clbox" id="cb">'+relSVG(REL_P[M?0:0])+'</div></div>';
 var said='<div class="said t-said"><span class="eyebrow">You said</span><p class="quote">“I keep taking care of everybody else.”</p>'
  +'<div class="chips2">'+SIGW.map(function(w){return '<span class="sgc" style="--c:'+w[1]+'"><i></i>'+w[0].replace('taking care of everybody else','taking care')+'</span>';}).join('')+'</div></div>';
 var noticed='<div class="noticed"><span class="eyebrow acc">Atüned noticed</span><h1 class="tag">Over-responsibility</h1>'+art
  +'<div class="stats">'+statCell('Quality','Overwhelmed','overwhelm',SEATS[5].c)+statCell('Intensity','8','pressure',c,intensityRing(8,c))+statCell('Where','Solar plexus','density',c)+statCell('Colour','Solar','other',c)+'</div></div>';
 var test='<div class="test t-test"><span class="eyebrow">Let’s test</span><p class="hyp"><b>Cause.</b> Fear that things will fall apart if I do not handle them.</p>'
  +'<p class="q">Does this feel accurate?</p>'+acc3()+'</div>';
 ui.innerHTML=chrome(2)+'<div class="mr">'+said+noticed+test+'</div>';
 // the pattern breathes between held and contracted: how it operates
 if(!reduce){var alive=true;window.__stop=function(){alive=false;};
  var ph=0,t0=null;(function loop(ts){if(!alive)return;if(t0===null)t0=ts;var t=(ts-t0)/1000,k=(Math.sin(t*1.3)+1)/2;
   var P=mixParams(REL_P[0],REL_P[1],k);var cb=$('#cb');if(cb)cb.innerHTML=relSVG(P);var bb=$('#bb');if(bb)bb.innerHTML=bodySVG({hi:2,pulse:k,labels:M?'hi':true});requestAnimationFrame(loop);})(0);}
 else{var cb=$('#cb');cb.innerHTML=relSVG(REL_P[1]);}
};
SCR.notquite=function(){
 setBg({cx:M?W/2:W*.72,cy:M?250:HT*.5,r:M?118:300,arcs:false,lit:[],quiet:.4,tl:M?8:12},'');
 var fork='<svg viewBox="0 0 400 260" class="forksvg" aria-label="The path splits in two">'
  +'<circle cx="60" cy="130" r="14" fill="#0C0D12" stroke="'+ACC+'" stroke-width="2.4"/><circle cx="60" cy="130" r="4.5" fill="'+ACC+'"/>'
  +'<path d="M74 130 H170" stroke="'+ACC+'" stroke-width="2.2"/><circle cx="170" cy="130" r="8" fill="#0C0D12" stroke="'+ACC+'" stroke-width="2"/>'
  +'<path d="M178 126 C 230 100, 280 70, 340 62" stroke="'+MID+'" stroke-width="2" stroke-dasharray="6 6" fill="none"/>'
  +'<path d="M178 134 C 230 160, 280 190, 340 198" stroke="'+MID+'" stroke-width="2" stroke-dasharray="6 6" fill="none"/>'
  +'<circle cx="346" cy="62" r="12" fill="none" stroke="'+MID+'" stroke-width="2" stroke-dasharray="3 4"/><circle cx="346" cy="198" r="12" fill="none" stroke="'+MID+'" stroke-width="2" stroke-dasharray="3 4"/>'
  +'<text x="170" y="170" text-anchor="middle" font-size="13" fill="#B4B0A8" font-family="Inter,sans-serif">Over-responsibility</text></svg>';
 ui.innerHTML=chrome(2)
  +'<div class="col mid">'+'<span class="eyebrow acc">Not quite</span><h1 class="'+(M?'h1':'display')+'">Which part is off?</h1>'+(M?fork:'')
  +'<div class="chipcol">'
  +'<button type="button" class="chip" aria-pressed="false">'+ico('overwhelm',24)+'The name it gave</button>'
  +'<button type="button" class="chip on" style="--c:'+ACC+'" aria-pressed="true">'+ico('density',24)+'Where it sits</button>'
  +'<button type="button" class="chip" aria-pressed="false">'+ico('pressure',24)+'How strong it is</button>'
  +'<button type="button" class="chip" aria-pressed="false">'+ico('other',24)+'All of it</button></div>'
  +'<div class="row"><button type="button" class="btn" data-go="mirror">'+ico('back',20)+'Back</button><button type="button" class="btn pri" data-go="mirror">Show another reading</button></div></div>'
  +(M?'':'<div class="rightcol" style="right:auto;left:'+(W*.72-290)+'px;width:580px">'+fork+'</div>');};
SCR.adjust=function(){
 var F=fcol();setBg({cx:F.cx,cy:F.cy,r:F.r,arcs:false,lit:[2],tl:M?8:13},'');
 var P=formParams(5);
 ui.innerHTML=chrome(2)
  +'<div class="col story">'
  +'<h1 class="'+(M?'h1':'display')+'">Tell us what’s off.</h1>'
  +'<div class="was t-said"><span class="eyebrow">What we read</span><p class="small">Over-responsibility, at the solar plexus, intensity 8.</p></div>'
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
  +'<span class="eyebrow acc">Nothing came up from that</span><h1 class="'+(M?'h1':'display')+'">When you think about it, where do you feel it?</h1>'
  +'<div class="chipcol row2">'+zones.map(function(z){return '<button type="button" class="chip" style="--c:'+SEATS[z[1]].c+'" aria-pressed="false"><i class="dotc" style="--c:'+SEATS[z[1]].c+'"></i>'+z[0]+'</button>';}).join('')
  +'<button type="button" class="chip" aria-pressed="false">'+ico('other',24)+'Somewhere else</button></div>'
  +'<p class="small dim">Or add a few more words to what you wrote.</p>'
  +'<div class="row"><button type="button" class="btn" data-go="story">'+ico('back',20)+'Back to the story</button></div></div>'
  +'<div class="rightcol low" style="right:min(20vw,330px)">'+spine+'</div>';};

/* ================= 7. SOMATIC SETUP ================= */
SCR.somatic=function(){
 var c=SEATS[2].c;
 setBg({cx:M?W-70:Math.max(150,W*.13)+130,cy:M?200:HT*.5,r:M?84:Math.min(HT*.37,330),arcs:false,lit:[2],tl:M?7:13},'');
 var sens=[['pressure','Pressure'],['density','Density'],['relief','Relief'],['movement','Movement'],['activation','Activation'],['nothing','Nothing']];
 ui.innerHTML=chrome(3)
  +'<div class="somL"><div class="bodybox" id="bb">'+bodySVG({hi:2,pulse:.3,labels:M?'hi':true})+'</div></div>'
  +'<div class="col som">'
  +'<span class="eyebrow acc">Before the release</span><h1 class="'+(M?'h1':'display')+'">Turn your senses inward.</h1>'
  +'<div class="held t-said"><span class="eyebrow">Hold this in mind</span><p class="quote">“I keep taking care of everybody else.”</p></div>'
  +'<p class="lead">Notice what answers. It might be any of these.</p>'
  +'<div class="sens">'+sens.map(function(s,i){return '<span class="sn'+(i===5?' z':'')+'">'+ico(s[0],26)+s[1]+'</span>';}).join('')+'</div>'
  +'<p class="small">You do not need to feel anything. Noticing nothing is information too.</p>'
  +'<div class="row"><button type="button" class="btn pri" data-go="release">Begin</button><button type="button" class="btn ghost">'+ico('stop',20)+'Stop</button></div></div>';
 if(!reduce){var alive=true;window.__stop=function(){alive=false;};var t0=null;(function lp(ts){if(!alive)return;if(t0===null)t0=ts;var k=(Math.sin((ts-t0)/1000*1.1)+1)/2;var bb=$('#bb');if(bb)bb.innerHTML=bodySVG({hi:2,pulse:k,labels:M?'hi':true});requestAnimationFrame(lp);})(0);}
};

/* ================= 8. THE RELEASE, in motion ================= */
SCR.release=function(startIdx){
 var idx=startIdx==null?2:startIdx;
 setBg({cx:M?W/2:W*.71,cy:M?482:(HT-130)/2,r:M?172:Math.min(HT*.37,340),arcs:false,lit:[2],tl:M?8:13},'');
 var s=Math.min(M?W-24:HT*.74,740);
 ui.innerHTML=chrome(3)
  +'<div class="col relL">'
  +'<span class="eyebrow acc" id="rln">Pattern 4 of 10</span>'
  +'<h1 class="state" id="rst">'+REL_STATES[idx]+'</h1><p class="lead" id="rsay">'+REL_SAY[idx]+'</p>'
  +'<div class="rtext t-said"><p class="quote">I am releasing believing, thinking, feeling, behaving, acting.</p><p class="small">taking care of everybody else</p></div>'
  +'</div>'
  +'<div class="relC"><div class="relbox" id="rb" style="width:'+s+'px">'+relSVG(REL_P[idx])+'</div></div>'
  +'<div class="relB"><div id="rtr">'+statesTrack(idx,null,M?260:560,M)+'</div>'
  +'<div class="row"><button type="button" class="btn" aria-label="Pause">'+ico('stop',20)+'Pause</button><button type="button" class="btn ghost" data-go="observe">Skip to the end</button></div></div>';
 function paintStatic(i){$('#rst').textContent=REL_STATES[i];$('#rsay').textContent=REL_SAY[i];$('#rtr').innerHTML=statesTrack(i,null,M?260:560,M);}
 if(!reduce){var alive=true;window.__stop=function(){alive=false;};var cur=idx;
  (function next(){if(!alive)return;var n=(cur+1)%6;var from=REL_P[cur];
   timers.push(setTimeout(function(){tween(from,REL_P[n],1500,function(P){$('#rb').innerHTML=relSVG(P);},function(){cur=n;paintStatic(cur);next();});},1800));})();}
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
  +'<span class="eyebrow acc">Feel. Then reflect.</span><h1 class="'+(M?'h1':'display')+'">What is here now?</h1>'
  +'<div class="chipcol">'+opts.map(function(o){return '<button type="button" class="chip'+(o[2]?' on':'')+'" style="--c:'+ACC+'" aria-pressed="'+!!o[2]+'">'+ico(o[0],24)+o[1]+'</button>';}).join('')+'</div>'
  +'<p class="small">Recorded as what you noticed. Whether it changes what you do comes later.</p>'
  +'<div class="row"><button type="button" class="btn pri" data-go="handoff">Continue</button></div></div>';};

/* ================= 10. HANDOFF ================= */
SCR.handoff=function(){
 setBg({cx:-999,cy:-999,r:10,arcs:false,ticks:false},'');
 var items=[['You said','\u201cI keep taking care of everybody else.\u201d','t-said'],['Atüned noticed','Over-responsibility, at the solar plexus','t-noticed'],['You tested','That\u2019s it','t-test'],['You worked with it','10 patterns, released','t-w'],['You observed','Something moved','t-o']];
 var lz=M?150:230,hs=lz+(M?30:70);
 var ring='<div class="hp" style="width:'+hs+'px;height:'+hs+'px"><svg class="hring" width="'+hs+'" height="'+hs+'" viewBox="0 0 '+hs+' '+hs+'" aria-hidden="true">'+fieldRing({cx:hs/2,cy:hs/2,r:lz*.5+(M?16:30),arcs:false,quiet:.5,tl:M?7:11,sw:M?1.6:2})+'</svg><div class="lpi">'+loopRing(lz,{done:0,lit:0,labels:true})+'</div></div>';
 ui.innerHTML=chrome(5,true,true)
  +'<div class="col hand"><span class="eyebrow acc">What just happened</span><h1 class="'+(M?'h1':'display')+'">You did that.</h1>'
  +'<div class="five">'+items.map(function(it,i){return '<div class="fv '+it[2]+'">'+(M?'<i class="mn"></i>':'')+'<span class="eyebrow">'+it[0]+'</span><p>'+it[1]+'</p></div>';}).join('')+'</div>'
  +'<div class="hrow">'+ring
  +'<div class="hact"><p class="lead">Next is Discover. The Field is open.</p><button type="button" class="btn pri" data-go="tutorial">Open the Field</button>'
  +'<button type="button" class="btn ghost">'+ico('guest',20)+'Keep this: choose a username</button></div></div></div>';};

/* ================= routing ================= */
var ROUTE={'start':function(){SCR.start(-1);},'start-picked':function(){SCR.start(0);},'feeling':function(){SCR.feeling();},
 'story':function(){SCR.story(false);},'story-voice':function(){SCR.story(true);},'forming':function(){SCR.forming();},
 'mirror':function(){SCR.mirror();},'mirror-notquite':function(){SCR.notquite();},'mirror-adjust':function(){SCR.adjust();},'mirror-empty':function(){SCR.empty();},
 'somatic':function(){SCR.somatic();},'release':function(){SCR.release(2);},'observe':function(){SCR.observe();},'handoff':function(){SCR.handoff();}};
function show(){clearT();var h=setHash()||'start-picked';(ROUTE[h]||ROUTE['start-picked'])();document.title='Onboarding, '+h;}
ui.addEventListener('click',function(e){
 var t=e.target.closest('[data-pick],[data-go]');if(!t)return;
 if(t.hasAttribute('data-pick')){clearT();SCR.start(+t.getAttribute('data-pick'));return;}
 var g=t.getAttribute('data-go');if(g==='tutorial'){location.href='tutorial.html#t0';return;}
 location.hash=g;});
addEventListener('hashchange',show);
show();
})();
