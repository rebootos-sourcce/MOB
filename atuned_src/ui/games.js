
/* ============================================================
   GAMES. Two, and both are the instrument at practice speed
   rather than a diversion bolted on the side.

   THE LETTING GO RUN. Twenty four cards face down, a pole, and
   a clock. Turn a card, say the line at that address, turn it
   back. The clock is the point: the practice is two or three
   minutes and a person who has never timed it does not believe
   that.

   The lines are the owner's, out of the pattern catalog. Where
   the dealt address sits on an axis with a printed card, the run
   speaks that card's sentence and its paired embodied truth.
   Where it does not, it speaks the strict 3C syntax at the
   address. Nothing here writes a sentence the catalog does not.

   The pole is masculine or feminine, which the printed cards
   label right channel sympathetic and left channel
   parasympathetic. Both must clear, so a card is not done until
   it has been run through both.

   THE MATCH. Eight pairs of fetter marks face down. Match a
   pair and the fetter opens: what it is, how it runs through
   you, what the coherent opposite is, and how many of your own
   addresses it is running right now.

   Both deal from the engine. Neither invents a pattern.
   ============================================================ */
var GAME=null;

/* ---- the letting go run ---- */
var LG={cards:[], pole:'m', turned:0, t0:0, tick:null, open:null, done:false};
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
 /* m and f are tracked apart, because the bilateral note says both clear */
 LG.cards=pool.map(function(n){return {n:n, face:false, m:false, f:false};});
 LG.pole='m'; LG.turned=0; LG.open=null; LG.done=false; LG.t0=Date.now();
 if(LG.tick)clearInterval(LG.tick);
 LG.tick=setInterval(function(){var e=document.getElementById('lgclock');
  if(e)e.textContent=lgClock(); else {clearInterval(LG.tick);LG.tick=null;}},250);
 gmRender();}

function lgClock(){
 if(!LG.t0)return '0:00';
 var s=Math.floor((Date.now()-LG.t0)/1000);
 return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}

function lgStop(){ if(LG.tick){clearInterval(LG.tick);LG.tick=null;} }

/* a card is clear when every side it actually has has been run. a bilateral
   statement has one side, a printed card has two. */
function lgSplit(c){return lgLine(c.n).split;}
function lgDone(c){return lgSplit(c)?(c.m&&c.f):(c.m||c.f);}
function lgCount(){var n=0;LG.cards.forEach(function(c){if(lgDone(c))n++;});return n;}
function lgTurn(i){
 var c=LG.cards[i]; if(!c)return;
 if(c[LG.pole]||lgDone(c))return; /* already run on this side */
 if(LG.open===i){ /* second press puts it down and marks this side clear */
  c.face=false; c[LG.pole]=true; LG.open=null; LG.turned=lgCount();
  if(LG.turned>=LG.cards.length){LG.done=true; lgStop();}
  gmRender(); return;}
 if(LG.open!==null){LG.cards[LG.open].face=false;}
 c.face=true; LG.open=i; gmRender();}

/* the line for a dealt address. a printed card first, then the axis card, then
   the strict syntax at the address itself. the source is always named, so a
   person can tell a catalogued sentence from a constructed one. */
function lgLine(n){
 var ax=n.cf, i;
 var d=cardDepth(ax,LG.pole);
 if(d){ /* the printed card, cycled by address so one axis does not repeat */
  i=Math.abs(n.i|0)%d;
  var l=cardLine(ax,LG.pole,i);
  /* split: the printed cards say different things on the two sides, so both
     sides have to be run. */
  if(l)return {rel:l.rel, tru:l.tru, src:'Release protocol card, '+ax,
    track:null, split:true};}
 var a=AXC_BY[ax];
 /* the axes card is one statement run bilaterally, and its install is written
    out on the card. Synthesising a truth from the coherent pole produced
    "that I am worth", which is not a sentence the owner wrote or would.
    not split: one pass clears both sides, which is what the card says. */
 if(a)return {rel:axLine(ax), tru:a.inst, track:a.track,
   src:'Letting go card, axis '+a.num, split:false};
 /* no card at this address. the strict syntax, and the coherent pole of the
    axis if the engine knows one, never a guess. */
 var opp=(CHILD.filter(function(x){return x.nm===ax;})[0]||{}).opp;
 return {rel:C3_STEM+String(n.k).toLowerCase()+'.',
   tru:opp?C3_TRUTH+'moving toward '+String(opp).toLowerCase()+' at this address.'
     :C3_TRUTH+'not '+String(n.k).toLowerCase()+'.',
   track:null, src:'Strict syntax at the address', split:false};}

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
  +'<p class="gm-p">It runs <b>'+at.length+'</b> address'+(at.length===1?'':'es')+'. '
  +(live.length?'<b>'+live.length+'</b> of them are carrying in your field right now.'
    :'None of them are carrying in your field right now.')+'</p>'
  +'<p class="gm-p">Held <b>'+held.toFixed(1)+'</b>. '+esc(c.opp)+' installed <b>'+inst.toFixed(1)+'</b>. '
  +'Release empties the address, the opposite is what fills it.</p>'
  +(live.length?'<button class="btn" data-gmimp="'+esc(c.nm)+'">See the '+live.length+' running you</button>':'')
  +'</div>';}

/* ---- the shell ---- */
function gmRender(){
 var host=document.getElementById('games'); if(!host)return;
 /* GAMES BORROWED THE CODEX'S HEADER AND THE CODEX'S HEADER CHANGED.
    kb-hd and kb-tabs were the stacked title block and the wrapping chip row.
    The codex now runs one baseline and a strip that scrolls, so those two
    rules went with the card, and the CSS coverage gate caught this surface
    still emitting them. Games keeps the shape it wants under its own gm-
    prefix rather than depending on another surface's internals. */
 var h='<div class="kb-top"><div class="gm-hd"><div class="pm-eye">Games</div>'
  +'<h2 class="kb-h plain">The instrument at practice speed</h2>'
  +'<p class="kb-p">Both deal from your own field. Neither invents a pattern.</p></div>'
  +'<div class="gm-tabs" role="tablist">'
  +'<button type="button" role="tab" class="kb-t'+(GAME==='lg'?' on':'')+'" data-gm="lg" '
   +'aria-selected="'+(GAME==='lg')+'">The letting go run</button>'
  +'<button type="button" role="tab" class="kb-t'+(GAME==='mt'?' on':'')+'" data-gm="mt" '
   +'aria-selected="'+(GAME==='mt')+'">The match</button>'
  +'</div></div>';

 if(GAME==='lg'){
  if(!LG.cards.length){
   h+='<div class="gm-intro"><p class="gm-p">Twenty four cards, face down, dealt from what you '
    +'are carrying. Turn one, say the line and the truth under it, turn it back. The clock runs '
    +'while you do it.</p>'
    +'<p class="gm-p">The practice is two or three minutes. Time it once and you will believe it.</p>'
    +'<p class="gm-p">'+esc(CARD_OPEN)+'</p>'
    +'<div class="gm-gates"><span class="pm-eye plain">The statement runs nine gates at once</span>'
    +'<div class="gm-glist">'+C3_VERB.map(function(v){
      return '<span class="gm-gate">'+esc(v)+'</span>';}).join('')+'</div></div>'
    +'<button class="btn pri" id="lggo">Deal twenty four</button></div>';}
  else{
   h+='<div class="gm-bar"><div class="gm-chan"><span class="pm-eye">Pole</span>'
    +'<div class="gm-chips">'+C3_POLE.map(function(p){
      return '<button type="button" class="gm-chip'+(LG.pole===p.k?' on':'')+'" data-lgc="'+p.k+'">'
       +esc(p.nm)+'<em>'+esc(p.ch.toLowerCase())+'</em></button>';}).join('')+'</div></div>'
    +'<div class="gm-meter"><span class="gm-clock" id="lgclock">'+lgClock()+'</span>'
    +'<span class="gm-of">'+LG.turned+' of '+LG.cards.length+' cleared</span></div></div>';
   if(LG.open!==null){
    var n=LG.cards[LG.open].n, L=lgLine(n);
    var pl=C3_POLE.filter(function(p){return p.k===LG.pole;})[0];
    h+='<div class="gm-say"><div class="pm-eye">'+esc(n.b)+', '+esc(n.n||'field')+'</div>'
     +(L.track?'<p class="gm-track">'+esc(L.track)+'</p>':'')
     +'<p class="gm-line">'+esc(L.rel)+'</p>'
     +'<p class="gm-line tru">'+esc(L.tru)+'</p>'
     +'<div class="gm-src">'+esc(L.src)+'. '
     +(L.split?esc(pl.ch)+', '+esc(pl.ans)+'.':'Bilateral, both channels at once.')+'</div>'
     +'<p class="gm-p">Say both, feel where they land, then put the card down.</p></div>';}
   h+='<div class="gm-grid">'+LG.cards.map(function(c,i){
     var did=c[LG.pole], both=lgDone(c), sp=lgSplit(c);
     return '<button type="button" class="gm-card'+(c.face?' face':'')+(both?' done':'')
      +(did&&!both?' half':'')+'" '
      +'data-lg="'+i+'" style="--c:'+seatCol(c.n.b)+'" aria-label="'+(c.face?esc(c.n.k):'Face down card')+'">'
      +(both?'<span class="gm-tick">'+(sp?'both':'clear')+'</span>'
        :c.face?'<span class="gm-cn">'+esc(c.n.k)+'</span><span class="gm-cb">'+esc(c.n.b)+'</span>'
        :did?'<span class="gm-tick">'+(LG.pole==='m'?'right':'left')+'</span>'
        :'<span class="gm-back"></span>')+'</button>';}).join('')+'</div>';
   if(LG.done)h+='<div class="gm-done"><div class="pm-eye">Run complete</div>'
    +'<p class="gm-p">Twenty four addresses cleared in <b>'
    +lgClock()+'</b>. Deal again, or open the release to commit it.</p></div>';
   h+='<div class="gm-note"><div class="pm-eye">Both sides</div><p class="gm-p">'
    +esc(C3_BILATERAL)+'</p></div>';
   h+='<div class="gm-shut"><p class="gm-p">'+esc(CARD_SHUT)+'</p></div>'
    +'<div class="gm-act"><button class="btn" id="lggo">Deal again</button></div>';}}

 if(GAME==='mt'){
  if(!MT.cards.length){
   h+='<div class="gm-intro"><p class="gm-p">Eight pairs of child emotion marks, face down. Match a pair '
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
  LG.pole=el.getAttribute('data-lgc'); LG.open=null;
  LG.cards.forEach(function(c){c.face=false;});
  LG.turned=lgCount(); gmRender();};});
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
