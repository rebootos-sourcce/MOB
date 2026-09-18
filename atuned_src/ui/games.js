
/* ============================================================
   GAMES. Two, and both are the instrument at practice speed
   rather than a diversion bolted on the side.

   THE LETTING GO RUN. Twenty four cards face down, a channel
   prompt, and a clock. Turn a card, say the line at that
   address through that channel, turn it back. The clock is the
   point: the practice is two or three minutes and a person who
   has never timed it does not believe that.

   THE MATCH. Eight pairs of fetter marks face down. Match a
   pair and the fetter opens: what it is, how it runs through
   you, what the coherent opposite is, and how many of your own
   addresses it is running right now.

   Both deal from the engine. Neither invents a pattern.
   ============================================================ */
var GAME=null;

/* ---- the letting go run ---- */
var LG={cards:[], chan:0, turned:0, t0:0, tick:null, open:null, done:false};
const LG_CHAN=[['believe','believing'],['perceive','perceiving'],['think','thinking'],
 ['behave','behaving'],['act','acting'],['feel','feeling']];
const LG_N=24;

function lgPool(){
 var r=compute(), held=r.loaded.slice();
 /* a person with a light field still gets a full deck, drawn from the
    heaviest addresses they have rather than from nothing. */
 if(held.length<LG_N){
  var rest=W.filter(function(n){return held.indexOf(n)<0;})
   .sort(function(a,b){return b.sq-a.sq;});
  held=held.concat(rest.slice(0,LG_N-held.length));}
 return held.slice(0,LG_N);}

function lgStart(){
 var pool=lgPool().slice();
 for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=pool[i];pool[i]=pool[j];pool[j]=t;}
 LG.cards=pool.map(function(n){return {n:n, face:false, done:false};});
 LG.chan=0; LG.turned=0; LG.open=null; LG.done=false; LG.t0=Date.now();
 if(LG.tick)clearInterval(LG.tick);
 LG.tick=setInterval(function(){var e=document.getElementById('lgclock');
  if(e)e.textContent=lgClock(); else {clearInterval(LG.tick);LG.tick=null;}},250);
 gmRender();}

function lgClock(){
 if(!LG.t0)return '0:00';
 var s=Math.floor((Date.now()-LG.t0)/1000);
 return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}

function lgStop(){ if(LG.tick){clearInterval(LG.tick);LG.tick=null;} }

function lgTurn(i){
 var c=LG.cards[i]; if(!c||c.done)return;
 if(LG.open===i){ /* second press on the same card puts it down and counts it */
  c.face=false; c.done=true; LG.open=null; LG.turned++;
  if(LG.turned>=LG.cards.length){LG.done=true; lgStop();}
  gmRender(); return;}
 if(LG.open!==null){LG.cards[LG.open].face=false;}
 c.face=true; LG.open=i; gmRender();}

function lgLine(n){
 var ch=LG_CHAN[LG.chan][1];
 return 'I am letting go of '+ch+' that I am '+String(n.k).toLowerCase()+'.';}

/* ---- the match ---- */
var MT={cards:[], open:[], found:0, lock:false, pick:null};
const MT_PAIRS=8;

function mtStart(){
 var fs=CHILD.slice(0,MT_PAIRS), deck=[];
 fs.forEach(function(c,i){deck.push({c:c,id:i},{c:c,id:i});});
 for(var i=deck.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=deck[i];deck[i]=deck[j];deck[j]=t;}
 MT.cards=deck.map(function(d){return {c:d.c, id:d.id, face:false, done:false};});
 MT.open=[]; MT.found=0; MT.lock=false; MT.pick=null;
 gmRender();}

function mtTurn(i){
 if(MT.lock)return;
 var c=MT.cards[i]; if(!c||c.done||c.face)return;
 c.face=true; MT.open.push(i);
 if(MT.open.length<2){gmRender();return;}
 var a=MT.cards[MT.open[0]], b=MT.cards[MT.open[1]];
 if(a.id===b.id){
  a.done=b.done=true; MT.found++; MT.open=[]; MT.pick=a.c;
  gmRender(); return;}
 MT.lock=true; gmRender();
 setTimeout(function(){a.face=b.face=false; MT.open=[]; MT.lock=false; gmRender();},700);}

/* what a matched pair is worth: the fetter, how it runs, the opposite, and
   how much of the person's own field it is actually running. */
function mtBlock(c){
 if(!c)return '<p class="gm-p">Match a pair to open it.</p>';
 var at=W.filter(function(n){return n.cf===c.nm;});
 var live=at.filter(function(n){return n.sq>=4;});
 var held=S.charge[c.nm]||0, inst=S.replace[c.nm]||0;
 return '<div class="gm-open"><div class="pm-eye">'+esc(c.seat)+'</div>'
  +'<div class="gm-on">'+esc(c.nm)+'</div>'
  +'<div class="gm-oo">toward '+esc(c.opp)+'</div>'
  +'<p class="gm-p">It sits at the '+esc(c.addr).toLowerCase()+', at '+esc(c.loc)+'.</p>'
  +'<p class="gm-p">It runs <b>'+at.length+'</b> of the 112 addresses. '
  +(live.length?'<b>'+live.length+'</b> of them are carrying in your field right now.'
    :'None of them are carrying in your field right now.')+'</p>'
  +'<p class="gm-p">Held <b>'+held.toFixed(1)+'</b>. '+esc(c.opp)+' installed <b>'+inst.toFixed(1)+'</b>. '
  +'Release empties the address, the opposite is what fills it.</p>'
  +(live.length?'<button class="btn" data-gmimp="'+esc(c.nm)+'">See the '+live.length+' running you</button>':'')
  +'</div>';}

/* ---- the shell ---- */
function gmRender(){
 var host=document.getElementById('games'); if(!host)return;
 var h='<div class="kb-top"><div class="kb-hd"><div class="pm-eye">Games</div>'
  +'<h2 class="kb-h">The instrument at practice speed</h2>'
  +'<p class="kb-p">Both deal from your own field. Neither invents a pattern.</p></div>'
  +'<div class="kb-tabs" role="tablist">'
  +'<button type="button" role="tab" class="kb-t'+(GAME==='lg'?' on':'')+'" data-gm="lg" '
   +'aria-selected="'+(GAME==='lg')+'">The letting go run</button>'
  +'<button type="button" role="tab" class="kb-t'+(GAME==='mt'?' on':'')+'" data-gm="mt" '
   +'aria-selected="'+(GAME==='mt')+'">The match</button>'
  +'</div></div>';

 if(GAME==='lg'){
  if(!LG.cards.length){
   h+='<div class="gm-intro"><p class="gm-p">Twenty four cards, face down, dealt from what you '
    +'are carrying. Turn one, say the line, turn it back. The clock runs while you do it.</p>'
    +'<p class="gm-p">The practice is two or three minutes. Time it once and you will believe it.</p>'
    +'<button class="btn pri" id="lggo">Deal twenty four</button></div>';}
  else{
   h+='<div class="gm-bar"><div class="gm-chan"><span class="pm-eye">Channel</span>'
    +'<div class="gm-chips">'+LG_CHAN.map(function(c,i){
      return '<button type="button" class="gm-chip'+(LG.chan===i?' on':'')+'" data-lgc="'+i+'">'
       +c[1]+'</button>';}).join('')+'</div></div>'
    +'<div class="gm-meter"><span class="gm-clock" id="lgclock">'+lgClock()+'</span>'
    +'<span class="gm-of">'+LG.turned+' of '+LG.cards.length+' put down</span></div></div>';
   if(LG.open!==null){
    var n=LG.cards[LG.open].n;
    h+='<div class="gm-say"><div class="pm-eye">'+esc(n.b)+', '+esc(n.n||'field')+'</div>'
     +'<p class="gm-line">'+esc(lgLine(n))+'</p>'
     +'<p class="gm-p">Say it, feel where it lands, then put the card down.</p></div>';}
   h+='<div class="gm-grid">'+LG.cards.map(function(c,i){
     return '<button type="button" class="gm-card'+(c.face?' face':'')+(c.done?' done':'')+'" '
      +'data-lg="'+i+'" style="--c:'+seatCol(c.n.b)+'" aria-label="'+(c.face?esc(c.n.k):'Face down card')+'">'
      +(c.done?'<span class="gm-tick">done</span>'
        :c.face?'<span class="gm-cn">'+esc(c.n.k)+'</span><span class="gm-cb">'+esc(c.n.b)+'</span>'
        :'<span class="gm-back"></span>')+'</button>';}).join('')+'</div>';
   if(LG.done)h+='<div class="gm-done"><div class="pm-eye">Run complete</div>'
    +'<p class="gm-p">Twenty four addresses through the '+LG_CHAN[LG.chan][1]+' channel in <b>'
    +lgClock()+'</b>. Change the channel and run it again, or open the release to commit it.</p></div>';
   h+='<div class="gm-act"><button class="btn" id="lggo">Deal again</button></div>';}}

 if(GAME==='mt'){
  if(!MT.cards.length){
   h+='<div class="gm-intro"><p class="gm-p">Eight pairs of fetter marks, face down. Match a pair '
    +'and it opens: what it is, how it runs through you, and what the coherent opposite is.</p>'
    +'<button class="btn pri" id="mtgo">Deal the marks</button></div>';}
  else{
   h+='<div class="gm-bar"><div class="gm-of">'+MT.found+' of '+MT_PAIRS+' matched</div></div>'
    +'<div class="gm-grid mt">'+MT.cards.map(function(c,i){
      return '<button type="button" class="gm-card mt'+(c.face||c.done?' face':'')+(c.done?' done':'')+'" '
       +'data-mt="'+i+'" style="--c:'+seatCol(c.c.seat)+'" '
       +'aria-label="'+((c.face||c.done)?esc(c.c.nm):'Face down card')+'">'
       +((c.face||c.done)
         ? '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="'+c.c.ic+'"/></svg>'
         : '<span class="gm-back"></span>')+'</button>';}).join('')+'</div>'
    +mtBlock(MT.pick)
    +(MT.found>=MT_PAIRS?'<div class="gm-done"><div class="pm-eye">All eight matched</div>'
      +'<p class="gm-p">The nine axes are the whole emotional architecture. The ninth, '
      +esc(CHILD[8].nm)+', is not in this deck.</p></div>':'')
    +'<div class="gm-act"><button class="btn" id="mtgo">Deal again</button></div>';}}

 h+='<div class="gm-soon"><div class="pm-eye">Phase two</div>'
  +'<p class="gm-p">A narrated walkthrough of how a matched pair actually runs, unlocked by '
  +'matching it. Not built.</p></div>';

 host.innerHTML=h;
 host.querySelectorAll('[data-gm]').forEach(function(el){el.onclick=function(){
  GAME=el.getAttribute('data-gm'); lgStop(); gmRender();};});
 host.querySelectorAll('[data-lgc]').forEach(function(el){el.onclick=function(){
  LG.chan=+el.getAttribute('data-lgc'); gmRender();};});
 host.querySelectorAll('[data-lg]').forEach(function(el){el.onclick=function(){
  lgTurn(+el.getAttribute('data-lg'));};});
 host.querySelectorAll('[data-mt]').forEach(function(el){el.onclick=function(){
  mtTurn(+el.getAttribute('data-mt'));};});
 host.querySelectorAll('[data-gmimp]').forEach(function(el){el.onclick=function(){
  var nm=el.getAttribute('data-gmimp');
  IMP_PICK={};
  W.forEach(function(n){if(n.cf===nm&&n.sq>=4)IMP_PICK[n.i]=1;});
  setTab(TAB.STORY); render();};});
 var b=document.getElementById('lggo'); if(b)b.onclick=lgStart;
 b=document.getElementById('mtgo'); if(b)b.onclick=mtStart;}
