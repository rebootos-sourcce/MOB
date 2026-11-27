
/* ================================================================ the flow: arrive, ask, settle, feel, body, story, mirror
   One section (#s-flow) stays up for all of it. Its text box glides between anchors (a translate, never a layout change),
   its chips leave the Field and return to it, and the Field answers every input. Nothing on this screen is a page. */
var fq=$('#fq'),flowSec=$('#s-flow');

/* ---- the text box. FLIP: set the new anchor, then animate a translate from where it was. compositor only. */
function boxRect(kind,pose){
 var nar=W<=700,p=lay(pose),tl=tickLen(p),w;
 if(kind==='under'){w=Math.min(760,W-32);return {left:W/2-w/2,top:p.cy+p.ry*(nar?1.5:1.74)+(nar?28:20),width:w,al:'center',mid:false};}
 if(kind==='head'){w=Math.min(34*16,W-32);return {left:W/2-w/2,top:nar?p.cy+p.ry*1.06+tl+16:56,width:w,al:'center',mid:false};}
 if(kind==='bodyhead'){w=Math.min(34*16,W-32);return {left:W/2-w/2,top:nar?52:56,width:w,al:'center',mid:false};}
 if(kind==='side'){
  if(nar){w=W-32;return {left:16,top:p.cy+p.ry*1.06+tl+18,width:w,al:'left',mid:false};}
  w=Math.min(620,W*.38);return {left:W*.52,top:H*.5,width:w,al:'left',mid:true};}
 return {left:16,top:16,width:W-32,al:'center',mid:false};}
function placeBox(kind,pose,snap){
 var b=boxRect(kind,pose),el=fq,r0=el.getBoundingClientRect(),sr=stage.getBoundingClientRect(),k=sr.width/(stage.clientWidth||1)||1;
 el.style.left=b.left+'px';el.style.top=b.top+'px';el.style.width=b.width+'px';el.style.transform=b.mid?'translateY(-50%)':'none';
 el.dataset.box=kind;el.dataset.al=b.al;
 if(snap||STILL||!r0.width)return;
 var r1=el.getBoundingClientRect(),dx=(r0.left-r1.left)/k,dy=(r0.top-r1.top)/k;
 if(Math.abs(dx)+Math.abs(dy)>2&&el.animate)el.animate([{translate:dx+'px '+dy+'px'},{translate:'0 0'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});}

/* ---- chips. Two sets share one layout routine. They are born inside the Field and travel out on arcs (x on the arc curve,
   y on the land curve), 62 ms apart, so they read as the Field's answer and not as a menu that appeared. */
var SETS={
 start:{host:$('#chips-start'),items:STARTS,els:[],ry:.33,n:12,a0:0,pose:'ask'},
 feel:{host:$('#chips-feel'),items:FEELS,els:[],ry:.30,n:6,a0:Math.PI/6,pose:'ask',ns:true}};
function buildChips(){
 Object.keys(SETS).forEach(function(key){
  var set=SETS[key];set.host.innerHTML='';set.els=[];
  set.items.forEach(function(s,i){
   var b=document.createElement('button');b.type='button';b.className='chip';b.dataset.k=s.k;b.style.setProperty('--i',i);
   b.innerHTML=ico(s.k,24)+'<span class="lab">'+s.n+'</span>';b.setAttribute('aria-label',s.n);
   b.addEventListener('click',function(){key==='start'?pickStart(i,b):pickFeel(i,b);});set.host.appendChild(b);set.els.push(b);});
  if(set.ns){var b=document.createElement('button');b.type='button';b.className='chip ns';b.style.setProperty('--i',set.items.length);b.dataset.k='notsure';
   b.innerHTML='<span class="lab">Not sure</span>';b.addEventListener('click',function(){pickFeel(-1,b);});set.host.appendChild(b);set.els.push(b);}});}
function layoutChips(){
 if(!W)return;
 Object.keys(SETS).forEach(function(key){
  var set=SETS[key],ring=W>700,gp=lay(set.pose),host=set.host,m=set.items.length;
  host.className='chipset '+key+(ring?' lay-ring':' lay-grid')+(host.classList.contains('on')?' on':'')+(host.classList.contains('live')?' live':'')+(host.classList.contains('fold')?' fold':'')+(host.classList.contains('gone')?' gone':'');
  if(ring){
   var ry=set.ry*H,rx=Math.min((key==='start'?.36:.30)*W,ry*(key==='start'?1.9:1.5));
   set.els.forEach(function(c,i){
    if(i>=m){c.style.setProperty('--x',gp.cx.toFixed(1));c.style.setProperty('--y',(H-58).toFixed(1));c.style.setProperty('--tx','0px');c.style.setProperty('--ty',(gp.cy-(H-58)).toFixed(1)+'px');return;}
    var a=set.a0+i*Math.PI*2/m,x=gp.cx+rx*Math.sin(a),y=gp.cy-ry*Math.cos(a),sn=Math.sin(a);
    c.style.setProperty('--x',x.toFixed(1));c.style.setProperty('--y',y.toFixed(1));
    c.style.setProperty('--tx',(gp.cx-x).toFixed(1)+'px');c.style.setProperty('--ty',(gp.cy-y).toFixed(1)+'px');
    c.className=c.className.replace(/\bl-[trlb]\b/g,'').trim()+' '+(key==='start'&&i===0?'l-t':key==='start'&&i===6?'l-b':sn>0?'l-r':'l-l');});
  }else{
   var rows=Math.ceil(m/3)+(set.ns?1:0),cw=(W-32-16)/3,gh=rows*64+(rows-1)*8,top=H-64-gh;
   set.els.forEach(function(c,i){
    var r=i>=m?Math.ceil(m/3):Math.floor(i/3),cc=i>=m?1:i%3,x=i>=m?W/2:16+cc*(cw+8)+cw/2,y=top+r*72+(i>=m?22:32);
    c.className=c.className.replace(/\bl-[trlb]\b/g,'').trim();
    c.style.setProperty('--tx',(gp.cx-x).toFixed(1)+'px');c.style.setProperty('--ty',(gp.cy-y).toFixed(1)+'px');});}});}
function relPos(el){var r=el.getBoundingClientRect(),sr=stage.getBoundingClientRect(),k=sr.width/(stage.clientWidth||1)||1;
 return {x:(r.left+r.width/2-sr.left)/k,y:(r.top+r.height/2-sr.top)/k};}
/* squash and stretch: 80 ms to 1.10 wide by 0.90 tall, then 320 ms land back to 1 by 1 on the overshoot curve.
   The neighbours lean away and come back, nearest first, so the tap is felt along the ring. */
function squash(el,set){
 if(STILL||!el.animate)return;
 el.animate([{transform:'scale(1,1)',offset:0,easing:'cubic-bezier(.4,0,1,1)'},{transform:'scale(1.1,.9)',offset:.2,easing:'cubic-bezier(.34,1.56,.64,1)'},{transform:'scale(1,1)',offset:1}],{duration:400});
 var c=relPos(el);
 set.els.forEach(function(o){if(o===el)return;var q=relPos(o),dx=q.x-c.x,dy=q.y-c.y,d=Math.sqrt(dx*dx+dy*dy)||1,f=14*Math.exp(-d/(.25*Math.max(W,H)));
  if(f<1.5)return;o.animate([{translate:'0 0'},{translate:(dx/d*f).toFixed(1)+'px '+(dy/d*f).toFixed(1)+'px',offset:.3},{translate:'0 0'}],{duration:520,delay:Math.min(240,d*.35),easing:'cubic-bezier(.22,1,.36,1)',composite:'add'});});}
function openSet(key,on,snap){
 var set=SETS[key],h=set.host;
 (set.tm||[]).forEach(clearTimeout);set.tm=[];
 if(on){h.classList.remove('gone','fold','live');set.els.forEach(function(c){c.classList.remove('picked','rdy');c.style.removeProperty('--fd');});void h.offsetWidth;h.classList.add('on');
  /* a chip takes taps only once it has landed, so one still travelling cannot sit on top of another */
  set.els.forEach(function(c,i){if(snap||STILL)c.classList.add('rdy');else set.tm.push(setTimeout(function(){c.classList.add('rdy');},480+i*62+420));});}
 else{h.classList.remove('on','live','fold');h.classList.add('gone');}}
function foldSet(key,fromEl){
 var set=SETS[key],h=set.host,c=fromEl?relPos(fromEl):lay('ask');
 var order=set.els.map(function(e,i){var q=relPos(e);return {i:i,d:Math.sqrt((q.x-(c.x))*(q.x-c.x)+(q.y-c.y)*(q.y-c.y))};}).sort(function(a,b){return a.d-b.d;});
 order.forEach(function(o,r){set.els[o.i].style.setProperty('--fd',(r*55)+'ms');});
 h.classList.remove('live');h.classList.add('fold');
 setTimeout(function(){if(h.classList.contains('fold')){h.classList.remove('on');h.classList.add('gone');}},order.length*55+520);}

/* ---- the trail: the person's own words, gathering at the top as they answer. It is what the mirror is made of. */
S.trail=[];
function renderTrail(){
 var el=$('#trail');el.innerHTML='';
 S.trail.forEach(function(t,i){
  if(i){var sp=document.createElement('span');sp.className='ts';sp.textContent=' · ';el.appendChild(sp);}
  var w=document.createElement('span');w.className='tw'+(t.fresh?'':' in');w.textContent=t.s;el.appendChild(w);
  if(t.fresh){t.fresh=false;void w.offsetWidth;requestAnimationFrame(function(){w.classList.add('in');});}});}
function setTrail(i,s){S.trail[i]={s:s,fresh:true};S.trail.length=Math.max(S.trail.length,i+1);renderTrail();}
function clearTrail(){S.trail=[];renderTrail();}

/* ---- the field's answer to an input. Anticipation first (the ring pulls in), then the wave. */
function centre(){var p=POSE.to||POSE.cur;return {x:p.cx,y:p.cy};}
function fieldAnswer(origin,amp){FD.aim(origin||centre(),{delay:.12});FD.ripple(origin||centre(),amp==null?1:amp,.12);}

/* ---- ask: the twelve starting points. Picking is the advance. */
function enterAsk(o){
 var nt=!!(o&&o.snap),d=DECK.fl;S.live=false;S.picked=false;S.asked=true;
 if(!(o&&o.keep)){S.pick=null;S.feel=null;S.place=-1;S.mark=null;FD.leanTo(-1,true);clearTrail();}
 S.mood=null;S.bead=null;
 openSet('start',true,nt);if(nt){SETS.start.host.classList.add('live');S.live=true;}
 cue(.05,function(){d.show('<h1 class="hero s qh" tabindex="-1">What brought you here?</h1><p class="cap nostag">'+timeLine()+'</p>',nt);say('What brought you here? '+timeLine());
  var h=$('.qh',fq);h&&h.focus({preventScroll:true});});}
function pickStart(i,el){
 if(S.picked||!S.live)return;S.picked=true;S.pick=i;
 var set=SETS.start,st=STARTS[i];
 set.host.classList.remove('live');el.classList.add('picked');
 squash(el,set);
 var c=relPos(el),g=centre();S.bead=STILL?null:{x0:c.x,y0:c.y,t:-.12,dur:.6,done:false};
 cue(S.t+.3,function(){foldSet('start',el);});
 cue(S.t+.35,function(){DECK.fl.hide();});
 cue(S.t+.6,function(){S.mood=null;fieldAnswer(g,1);});                      /* the pull starts as the bead arrives */
 cue(S.t+.72,function(){setTrail(0,st.n);});
 cue(S.t+1.6,function(){go('settle');});}

/* ---- settle: the descent. The Field slows and warms; the breath is its pace. */
function enterSettle(o){
 var nt=!!(o&&o.snap),d=DECK.fl;
 cue(.3,function(){d.show('<p class="hero s">Awareness and intuition is a tool we use to turn your senses inward.</p>',nt);say('Awareness and intuition is a tool we use to turn your senses inward.');});
 cue(6.8,function(){d.show('<p class="hero">Do not solve it yet.</p><p class="hero rv" style="--pd:700ms">Notice what is here.</p>',nt);say('Do not solve it yet. Notice what is here.');});}

/* ---- feel */
function enterFeel(o){
 var nt=!!(o&&o.snap),d=DECK.fl;S.live=false;S.dw=null;
 SETS.feel.els.forEach(function(c){c.classList.remove('picked');});
 openSet('feel',true,nt);if(nt)SETS.feel.host.classList.add('live');
 if(S.feel!=null&&S.feel>=0)SETS.feel.els[S.feel].classList.add('picked');
 cue(.05,function(){d.show('<h1 class="hero s qh" tabindex="-1">What are you feeling?</h1><p class="sub rv" style="--pd:380ms">Take a second.</p><p class="cap nostag" style="margin-top:12px">The ring behind this is your Field. It moves as you answer.</p>',nt);say('What are you feeling? Take a second.');
  var h=$('.qh',fq);h&&h.focus({preventScroll:true});});
 cue(.95,function(){SETS.feel.host.classList.add('live');S.live=true;});}
function pickFeel(i,el){
 if(!S.live)return;
 var set=SETS.feel;set.els.forEach(function(c){c.classList.remove('picked');});el.classList.add('picked');
 S.feel=i;squash(el,set);
 var c=relPos(el),g=centre();S.bead=STILL?null:{x0:c.x,y0:c.y,t:-.12,dur:.5,done:false};
 S.mood=null;
 cue(S.t+.5,function(){fieldAnswer(g,.9);});
 cue(S.t+.62,function(){if(i>=0)setTrail(1,FEELS[i].n);else{S.trail.length=Math.min(S.trail.length,1);renderTrail();}});
 S.dw={left:i>=0?1.8:1.2,next:'body'};}

/* ---- body: tap where you feel it. The outline draws itself on the seat spacing, then the seven places arrive top to bottom. */
function layoutBody(){
 var host=$('#bodyt');if(!W||!host)return;var p=lay('body'),s=p.h/178,nar=W<=700;
 $$('.bt',host).forEach(function(b,i){
  var pl=PLACES[i],y=p.cy+(160-20*pl.s-89)*s;
  var hw=(function(u){if(u>=39&&u<=73)return 13;if(u<=80)return 8;if(u<=92)return 8+(u-80)*2.4;if(u<=150)return 36;return 32;})(160-20*pl.s)*s;
  var right=i%2===0,x=p.cx;
  b.style.top=(y-24)+'px';b.dataset.side=right?'r':'l';
  var gap=hw+12,lw=(nar?96:130);
  if(right){b.style.left=(x-24)+'px';b.style.width=(24+gap+lw)+'px';b.style.paddingLeft=(24+gap)+'px';}
  else{b.style.left=(x-24-gap-lw+48)+'px';b.style.width=(24+gap+lw)+'px';b.style.paddingRight=(24+gap)+'px';}
  b.style.setProperty('--i',i);});
 var ns=$('#body-ns');if(ns){ns.style.top=(H-(nar?64:64))+'px';}}
function buildBody(){
 var host=$('#bodyt');host.innerHTML='';
 PLACES.forEach(function(pl,i){
  var b=document.createElement('button');b.type='button';b.className='bt';b.dataset.s=pl.s;b.setAttribute('aria-label',pl.n);
  b.innerHTML='<span class="lab">'+pl.n+'</span>';
  b.addEventListener('click',function(){pickPlace(i,b);});
  b.addEventListener('pointerenter',function(){S.hover=pl.s;});b.addEventListener('pointerleave',function(){if(S.hover===pl.s)S.hover=-1;});
  b.addEventListener('focus',function(){if(b.matches(':focus-visible'))S.hover=pl.s;});b.addEventListener('blur',function(){if(S.hover===pl.s)S.hover=-1;});
  host.appendChild(b);});
 $('#body-ns').addEventListener('click',function(){pickPlace(-1);});}
function enterBody(o){
 var nt=!!(o&&o.snap),d=DECK.fl;S.live=false;S.dw=null;
 layoutBody();
 var host=$('#bodyt');host.classList.remove('live');$$('.bt',host).forEach(function(b){b.classList.remove('picked');});
 if(S.place>=0){var pl=PLACES.filter(function(x){return x.s===S.place;})[0],ix=PLACES.indexOf(pl);host.children[ix].classList.add('picked');}
 foldSet('feel',null);
 S.bodyOn=true;if(nt||STILL){S.bodyW=2;S.bodyD=1;}
 cue(.2,function(){d.show('<h1 class="hero s qh" tabindex="-1">Where do you notice it?</h1><p class="cap nostag" style="margin-top:8px">Tap the place on the body.</p><p class="cap nostag" id="bd-cap" style="min-height:20px;margin-top:4px"></p>',nt);say('Where do you notice it? Tap the place on the body.');
  var h=$('.qh',fq);h&&h.focus({preventScroll:true});});
 cue(.7,function(){host.classList.add('on');$('#body-ns').classList.add('on');});
 cue(1.5,function(){host.classList.add('live');$('#body-ns').classList.add('live');S.live=true;});
 if(S.place>=0&&nt){var cp=$('#bd-cap');}
 if(nt){host.classList.add('on','live');$('#body-ns').classList.add('on','live');S.live=true;}}
function setBodyCap(){
 var el=$('#bd-cap');if(!el)return;
 var pl=placeOf(S.place);var t=pl?pl.n+'. That is the '+pl.seat+' seat, one of seven places the Field reads.':'Not placed. The Field stays centred.';
 el.style.opacity=0;setTimeout(function(){el.textContent=t;el.style.opacity=1;},STILL?0:140);}
function pickPlace(i,btn){
 if(!S.live)return;
 var host=$('#bodyt');$$('.bt',host).forEach(function(b){b.classList.remove('picked');});
 if(i<0){S.place=-1;FD.leanTo(-1);S.mark=null;FD.pull(.97,.1);S.trail.length=Math.min(S.trail.length,2);renderTrail();setBodyCap();S.dw={left:1.2,next:'story'};return;}
 btn.classList.add('picked');
 var pl=PLACES[i],p=POSE.cur,o=seatXY(p,pl.s);
 S.place=pl.s;S.mark={seat:pl.s,t:-.12};
 FD.pull(.955,.12);FD.ripple(o,1.6,.12);FD.leanTo(pl.s);          /* anticipation, then a ripple 1.6 tick lengths high, then the lean, then (300 ms late) the colour and the motes */
 setTrail(2,pl.n);setBodyCap();say(pl.n+'. '+pl.seat+' seat.');
 S.dw={left:2.0,next:'story'};}

/* ---- story: one open field, only now. */
function enterStory(o){
 var nt=!!(o&&o.snap),d=DECK.fl;S.dw=null;
 foldSet('feel',null);$('#bodyt').classList.remove('on','live');$('#body-ns').classList.remove('on','live');
 cue(.25,function(){d.show('<div class="st"><h1 class="hero s qh" tabindex="-1">What was happening?</h1><p class="cap nostag" style="margin-top:8px">A sentence is enough.</p>'
  +'<textarea id="words" rows="3" autocomplete="off" spellcheck="false" aria-label="What was happening"></textarea>'
  +'<div class="srow"><button type="button" class="ring live" id="st-done">Done</button><button type="button" class="ring quiet" id="st-skip">I would rather not say</button></div></div>',nt);
  var ta=$('#words');if(ta){ta.value=S.words||'';S.wc=wordCount();syncDone();}say('What was happening? A sentence is enough.');
  setTimeout(function(){var t=$('#words');if(t&&S.act==='story')t.focus({preventScroll:true});},nt?0:700);});}
function wordCount(){var t=$('#words');return t?words(t.value).length:0;}
function syncDone(){var b=$('#st-done');if(b)b.classList.toggle('show',wordCount()>=3);}
document.addEventListener('input',function(e){
 if(!e.target||e.target.id!=='words')return;
 syncDone();var n=wordCount();
 if(n>(S.wc||0)&&!STILL){var p=POSE.cur;FD.ripple({x:p.cx,y:p.cy},.45,0);}   /* the Field hears each word: a small ripple per word, nothing else */
 S.wc=n;});
function readWords(txt){
 var best=null;words(txt.toLowerCase()).forEach(function(w){var e=LEX[w];if(e&&(!best||e[1]>best.amt))best={word:w,seat:e[0],amt:e[1]};});
 return best;}
function doStory(skip){
 var t=$('#words'),txt=t?t.value.trim():'';
 if(!skip&&words(txt).length<3)return;
 S.words=skip?'':txt;S.skipStory=!!skip;S.lex=skip?null:readWords(txt);S.fixes=[];
 go('mirror');}

/* ---- mirror. Everything it says is the person's own: a pick, a feeling, a place, a quote, a word the lexicon knows.
   Nothing is inferred and nothing is added. */
function quoteOf(txt){
 var s=txt.replace(/\s+/g,' ').trim(),m=s.match(/^[^.!?]+/),t=(m?m[0]:s).trim(),w=t.split(' ');
 if(w.length>14)t=w.slice(0,14).join(' ')+'...';
 return t;}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function mirrorSeat(){
 if(S.place>=0)return S.place;if(S.lex)return S.lex.seat;
 var st=S.pick!=null?STARTS[S.pick]:null;return st&&st.s>=0?st.s:0;}
function mirrorLines(){
 var L=[],st=S.pick!=null?STARTS[S.pick]:null,pl=placeOf(S.place),fe=S.feel>=0?FEELS[S.feel]:null;
 L.push({src:'pick',h:'You came in with <b>'+(st&&st.k!=='other'?esc(st.n.toLowerCase()):'something else')+'</b>.'});
 var a=fe?'It feels <b class="'+((S.chg&1)?'chg':'')+'">'+fe.n.toLowerCase()+'</b>':'You did not name how it feels',b=pl?', and you notice it in your <b class="'+((S.chg&2)?'chg':'')+'">'+pl.n.toLowerCase()+'</b>.':'. You did not place it in your body.';
 L.push({src:'place',h:a+b,cap:pl?pl.n+' is the '+pl.seat+' seat. A seat is one of seven places on the body that the Field reads.':''});
 if(S.words)L.push({src:'story',h:'You said: <b>“'+esc(quoteOf(S.words))+'”</b>'});else L.push({src:'story',h:'You did not say what happened.'});
 if(S.lex)L.push({src:'lex',h:'Your word <b>“'+esc(S.lex.word)+'”</b> sits at the '+SEAT[S.lex.seat]+' seat.'});
 S.fixes.forEach(function(f){L.push({src:'fix',h:'You added: <b>“'+esc(f)+'”</b>'});});
 return L;}
function mirrorHTML(){
 var L=mirrorLines();
 return '<div class="mir"><h1 class="hero s qh" tabindex="-1">'+(S.fixes.length?'Here is what I heard now.':'Here is what I heard.')+'</h1><ul class="lines">'
  +L.map(function(l,i){return '<li class="rv hold'+(l.src==='fix'?' fix':'')+'" data-src="'+l.src+'" data-i="'+i+'">'+l.h+(l.cap?'<span class="cap nostag lcap">'+esc(l.cap)+'</span>':'')+'</li>';}).join('')
  +'</ul><div class="qwrap"><div class="after mq rv hold" id="mq"><p class="lead20">Does that feel like you?</p><div class="pair"><button type="button" class="ring live" id="m-yes">That is me</button><button type="button" class="ring" id="m-no">Not quite</button></div></div>'
  +'<div class="after corr rv hold" id="corr"><label for="m-in" class="lead20">Tell me what is off.</label><div class="crow"><input id="m-in" autocomplete="off" spellcheck="false" aria-label="What is off"><button type="button" class="ring live" id="m-adj">Adjust</button></div></div></div></div>';}
function cite(src){
 var p=POSE.cur,o={x:p.cx,y:p.cy};
 if(src==='pick'){FD.ripple(o,.5,.1);}
 else if(src==='place'){var sx=S.place>=0?seatXY(p,S.place):o;FD.pull(.98,.1);FD.ripple(sx,1,.1);if(S.place>=0)S.mark={seat:S.place,t:-.1};}
 else if(src==='story'){FD.ripple(o,.7,.1);FD.ripple(o,.5,.4);}
 else if(src==='lex'&&S.lex){var sx2=seatXY(p,S.lex.seat);FD.ripple(sx2,1,.1);S.lexMark={seat:S.lex.seat,t:-.1};}
 else if(src==='fix'){FD.ripple(o,.6,.1);}}
function enterMirror(o){
 var nt=!!(o&&o.snap),d=DECK.fl;S.dw=null;S.recog=false;S.lexMark=null;S.chg=0;
 $('#trail').classList.remove('on');
 if(S.lex===undefined)S.lex=null;
 cue(.3,function(){var card=d.show(mirrorHTML(),nt);S.card=card;say('Here is what I heard.');
  var lines=$$('.lines li',card),t0=nt?0:2.1;
  lines.forEach(function(li,i){var tt=S.t+(nt?0:(2.1+i*.9));
   cue(tt,function(){li.classList.add('in');cite(li.dataset.src);});});
  var tq=S.t+(nt?0:(2.1+lines.length*.9+.3));
  cue(tq,function(){var q=$('#mq',card);q&&q.classList.add('in');});});
 if(nt){/* snapped: everything shown at once */}}
function applyFix(txt){
 var ws=words(txt.toLowerCase()),changed=0,p=POSE.cur;
 ws.forEach(function(w){if(FEEL_WORDS[w]!=null&&FEEL_WORDS[w]!==S.feel){S.feel=FEEL_WORDS[w];changed|=1;}});
 ws.forEach(function(w){if(PLACE_WORDS[w]!=null&&PLACE_WORDS[w]!==S.place){S.place=PLACE_WORDS[w];changed|=2;}});
 ws.forEach(function(w){if(LEX[w]&&(!S.lex||S.lex.word!==w)){S.lex={word:w,seat:LEX[w][0]};changed|=4;}});
 S.fixes.push(txt.trim());S.chg=changed;
 /* the Field adjusts: a changed feeling retargets the whole ring, a changed place moves the lean and the mark, and when
    nothing was recognised the ring still answers once, because the person was heard */
 if(changed&1){S.mood=ACT[S.act]&&ACT[S.act].fm||null;FD.aim(centre(),{delay:.12});FD.ripple(centre(),1,.12);setTrail(1,FEELS[S.feel].n);}
 if(changed&2){var o=seatXY(p,S.place);FD.pull(.955,.12);FD.ripple(o,1.6,.12);FD.leanTo(S.place);S.mark={seat:S.place,t:-.12};setTrail(2,placeOf(S.place).n);}
 if(!changed){FD.pull(.955,.12);FD.ripple(centre(),.9,.12);}
 var d=DECK.fl,nt=false;
 var card=d.show(mirrorHTML(),nt);S.card=card;say('Changed. Does that feel like you?');
 var lines=$$('.lines li',card);
 lines.forEach(function(li,i){cue(S.t+.45+i*.28,function(){li.classList.add('in');});});
 cue(S.t+.45+lines.length*.28+.7,function(){var q=$('#mq',card);q&&q.classList.add('in');});}

/* ---- recognition, then the bridge into the release. The space after "That is me" is the beat. */
function enterRecog(o){
 var nt=!!(o&&o.snap),d=DECK.fl,seat=mirrorSeat(),pl=SEAT[seat];S.seat=seat;S.dw=null;
 var p=POSE.cur,so=seatXY(p,seat);
 if(!nt)d.hide();
 S.mark={seat:seat,t:-.16,hold:true};
 if(!nt){FD.pull(.94,.16,1.4);FD.leanTo(seat);FD.ripple(so,1.8,.16);FD.ripple({x:p.cx,y:p.cy},1,.6);FD.breathAT=1;}
 else{FD.leanTo(seat,true);}
 S.mood={amp:.8,spd:.55,warm:.3};FD.aim(so,{delay:.16,span:.7,pull:false});if(nt)FD.snapAll();
 cue(1.2,function(){d.show('<p class="hero s">Next is a release. Twelve lines, one at a time, at your '+pl+' seat.</p><div class="after" id="rc-go" style="margin-top:24px"><button type="button" class="ring live" id="go-rel">Begin the release</button></div>',nt);say('Next is a release. Twelve lines, one at a time, at your '+pl+' seat.');});
 cue(4.0,function(){var g=$('#rc-go');g&&g.classList.add('in');});}
