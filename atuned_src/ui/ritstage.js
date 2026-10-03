/* ============================================================
   THE RITUAL STAGE, SIX CARDS, AND WHAT IS SUGGESTED. Round QN, 2 October.

   His words, verbatim: "on the left hand side for the ... rituals I not only
   want the input there but I want all the suggested ones that have come from
   the sniffer and then my centerpiece is all my analytics and my ability to
   like keep or delete check if I was successful ideally this would be about
   six stack tall my upper right would be my ongoing goal challenge the middle
   would be my active challenge and then my top left would be Ritual to avatar.
   Completion ... the input ritual uses tags. And sniffs the relationship
   between the avatar the person's patterns and then gets the data organized.
   And links it up with the achievements when that system comes online. This
   is also a very visual system. When I come to this page, even though it looks
   static, it's very alive. It feels meaningful."

   THE SIX, in his slots, and what each one reads. Nothing below is a second
   mechanism: every read is one some other surface already makes.

     top left   Ritual to avatar   avCycles, the Avatar page's own read: each
                                   day a ritual is kept turns the avatar one
                                   seat. And avRows, the avatar's stories, each
                                   at the seat the sniffer hears it at, with
                                   the active ritual that feeds that seat.
     top right  Ongoing goal       ritBecoming, the avatar's newest line and
                                   the pattern held at its seat, and the
                                   ladder's next mark (ladderRead.next).
     middle     Active today       the Active list, unchanged. His "active
                                   challenge" is the rituals running now, and
                                   Active is his own word for them (NW1).
     then       Did it work        the record's kept and missed days for each
                                   ritual, and the held places the snapshot
                                   history recorded before it started against
                                   compute() now. A snapshot is taken on every
                                   story commit and every finished release.
                Keep or delete     a ritual in its last three days: keep it a
                                   week more (ritStartPlan wakes it), or delete
                                   it (ritDelPlan, with Put back in place).
                Practice analytics the chain from story to goal, kept days by
                                   seat and minutes by week, off CURP.rituals.

   WHAT "SUGGESTED BY THE SNIFFER" TURNED OUT TO MEAN, checked rather than
   invented. engine/sourceai.js suggests nothing: it asks questions about a
   story. Three reads already turn the sniffer's seat reading into a practice,
   and the left column lists all three, deduplicated:
     the field    ritFor, the seat carrying the most and the practice it calls
                  for. This was the chain's own Start; it moved here, because
                  the left column is where a ritual is started now.
     the avatar   avRituals, the Avatar page's own queue. Each avatar story's
                  bad-day line goes through readSeat (parseStory, the sniffer),
                  the seat it lands on carries a load, and ritFor names the
                  practice that seat calls for. That is his "relationship
                  between the avatar and the person's patterns", and it was
                  already written, in ui/avatarui.js, round JP.
     the bank     the heaviest held places, relQueueOf, one per seat, each as a
                  release schedule tied to that place (rel), the same shape the
                  becoming card's schedule has.
   The becoming's own schedule is not repeated here: the Ongoing goal card
   offers it, and one choice is offered once.

   ACHIEVEMENTS, WHEN THAT SYSTEM COMES ONLINE. It does not exist yet
   (POINTS-AUDIT.md; the points, achievements and unlocks TDD is audited and
   unbuilt). The link point is the row ritSuggest returns: when achievements
   exist, a row may carry the achievement it moves toward, read from that
   system and never typed here. Nothing reads or writes one now, and the page
   says nothing about achievements, because a promise on screen with nothing
   behind it is the status lie. The ladder's marks (engine/ladder.js) are real
   and are shown, as the next mark, on the Ongoing goal card.

   ALIVE AT REST. The stage carries a still layer behind the cards, one soft
   pool per seat that holds charge, placed at the seat's own angle on the
   Avatar ring and sized by how many places it holds, so the light behind the
   page is the bank and not decoration. It breathes on --t-breath, the
   product's own breath. The rings that carry a reading draw in when the page
   is arrived at and not on every press, and the arc for today breathes until
   it is kept. Under prefers-reduced-motion nothing moves.
   ============================================================ */

/* the page draws in once on arrival, and every press after that repaints
   without replaying it. ritRender sets it back whenever Flow is left. */
RIT.arrive=true;
/* where the last delete was pressed, so Put back is offered where the person
   is looking: 'keep' is the Keep or delete card, anything else the Record */
RIT.goneAt='';
/* the history list's length, the Record list's own posture */
RIT.hh=6;

/* ---------------- what is suggested ---------------- */
/* a seat as a phrase inside a sentence, the Avatar page's own */
function ritThe(b){return (typeof AV_THE!=='undefined'&&AV_THE[b])||('the '+ritSeatNm(b));}
function ritSuggest(st){
 var r=st.r, c=st.c, out=[], by={}, actKey={}, actRel={};
 st.act.forEach(function(p){actKey[ritKey(p.steps)]=1; if(p.rel!=null)actRel[p.rel]=1;});
 /* one card per practice, or per practice and place for a release schedule.
    A second reason for the same card is added to it, never a second card. */
 var add=function(k,seat,why,rel){
  var key=k+'|'+(rel==null?'':rel), x=by[key], p=ritPr(k);
  if(!p)return;
  if(x){if(seat&&x.seats.indexOf(seat)<0)x.seats.push(seat);
   if(x.why.indexOf(why)<0)x.why.push(why); return;}
  out.push(by[key]={k:k, p:p, seats:seat?[seat]:[], why:[why], rel:(rel==null?null:rel)});};
 /* the field. Nothing read yet is said as that, and the practice is the
    lightest place to start, not something a seat called for. */
 if(c.called&&!actKey[c.called.k])
  add(c.called.k,r.unread?'':c.band,r.unread
   ?'Nothing is read yet, so this is the lightest place to start.'
   :ritCap(ritThe(c.band))+' carries the most charge in your field.');
 /* the avatar */
 if(typeof avRituals==='function'&&typeof avRows==='function'&&typeof avSide==='function'){
  var rows=avRows();
  avRituals(r,rows,avSide().rule).forEach(function(x){
   if(actKey[x.p.k])return;
   x.areas.forEach(function(A){
    add(x.p.k,A.b,'Your avatar\'s story about '+String(A.nm).toLowerCase()+' sits at '+ritThe(A.b)
     +', which still carries charge.');});});}
 /* the bank, one place per seat, the heaviest, and only a place held at the
    line every surface counts held at (4) */
 var bc=ritBecoming(), seen={}, n=0;
 if(typeof relQueueOf==='function')relQueueOf(8).forEach(function(q){
  /* the becoming's seat is the Ongoing goal card's, so the bank offers no
     second schedule at that seat beside it */
  if(n>=3||q.sq<4||seen[q.b]||(bc&&q.b===bc.seat)||actRel[q.i])return;
  var called=ritFor({darkB:q.b, DQ:r.DQ}).called; if(!called)return;
  seen[q.b]=1; n++;
  var why='You hold '+String(q.k).toLowerCase()+' at '+ritThe(q.b)+'. This runs as a release schedule for it.';
  /* THE SAME PRACTICE AT THE SAME SEAT IS ONE CARD, round QN, found walking
     the page as James: the sacral carried the most charge and held envy, so
     The Somatic Truth Check was offered twice at the sacral, one plain and one
     for envy. The place is the more particular reason, so the card the field
     or the avatar already made takes it, and its Start sets the schedule. */
  var same=out.filter(function(x){return x.k===called.k&&x.rel==null&&x.seats.indexOf(q.b)>=0;})[0];
  if(same){same.why.push(why); same.rel=q.i; by[called.k+'|'+q.i]=same; return;}
  add(called.k,q.b,why,q.i);});
 return out;}
function ritCap(s){s=String(s||''); return s.charAt(0).toUpperCase()+s.slice(1);}
function ritSugStart(i){
 var x=(RIT.sug||[])[i]; if(!x)return false;
 var seat=x.seats[0]||'';
 var q={steps:[x.k], band:seat, track:x.p.track, days:7, tags:x.seats.slice()};
 if(x.rel!=null&&BY[x.rel]){q.rel=x.rel;
  return ritStartPlan(q,'Set. '+x.p.nm+' each day for a week, for '+String(BY[x.rel].k).toLowerCase()+'.');}
 return ritStartPlan(q,'Started. '+x.p.nm+' each day for a week.');}
function ritSugHtml(st){
 /* a practice already picked in the builder above is that choice being made,
    so it is not offered a second time underneath. A release schedule is tied
    to a place and is a different choice, so it stays. */
 var all=ritSuggest(st), list=all.filter(function(x){return x.rel!=null||!RIT.sel[x.k];}); RIT.sug=list;
 /* and when the builder holds every suggestion there is, the section says
    nothing: "Nothing to suggest yet" under a builder holding the suggestion
    would be untrue */
 if(!list.length&&all.length)return '';
 var body=!list.length?'<p class="rv-empty">Nothing to suggest yet.</p>'
  :'<ul class="rv-sugl">'+list.map(function(x,i){
   var col=x.seats.length?seatCol(x.seats[0]):'var(--accent)';
   return '<li class="rv-sg1" style="--c:'+col+'">'
    +'<div class="rv-sgh"><span class="rv-sgn">'+esc(x.p.nm)+'</span><span class="rv-sgm">'+x.p.min+' min</span></div>'
    /* one line per reason, so a practice two sources call for reads as two
       short reasons and not one paragraph */
    +'<ul class="rv-sgw">'+x.why.map(function(w){return '<li>'+esc(w)+'</li>';}).join('')+'</ul>'
    +'<div class="rv-sgf"><span class="rv-sgt">'+x.seats.map(function(b){
      return '<em class="rv-tg" style="--t:'+seatCol(b)+'">'+esc(ritTagNm(b))+'</em>';}).join('')+'</span>'
    +'<button type="button" class="btn" data-act="sug" data-i="'+i+'" aria-label="Start '+esc(x.p.nm)+' for a week">Start for a week</button></div></li>';}).join('')+'</ul>';
 return '<div class="rv-sec rv-sug"><div class="rv-hd"><span class="rv-h">Suggested</span></div>'
  +'<p class="rv-mean">Read from your avatar\'s stories and from the places your field holds the most charge. '
  +'Each is the practice that seat calls for at the charge you carry now. The tag on it is the seat.</p>'+body+'</div>';}

/* ---------------- ritual to avatar ---------------- */
function ritAvHtml(st){
 var C=(typeof avCycles==='function')?avCycles(CURP):{days:0,cyc:[]};
 var cur=-1; C.cyc.forEach(function(c,i){if(cur<0&&!c.done)cur=i;});
 var names=['First','Second','Third'];
 var rings=C.cyc.map(function(c,i){
  var s='<svg viewBox="0 0 40 40" aria-hidden="true">';
  c.turns.forEach(function(f,t){var a0=t*120+3;
   s+='<path class="rv-cy-t" d="'+avCycArc(1,a0,114)+'"/>';
   if(f>0)s+='<path class="rv-cy-a" pathLength="1" d="'+avCycArc(f,a0,114)+'" style="--i:'+(i*3+t)+'"/>';});
  if(c.done)s+='<path class="rv-cy-ok" d="M14 20.5l4 4 8-9"/>';
  var turns=c.turns.filter(function(f){return f>=1;}).length;
  return '<div class="rv-cy'+(i===cur?' rv-cur':'')+'" role="img" aria-label="'+names[i]+' cycle, '
   +(c.done?'done':(turns?turns+(turns===1?' turn':' turns')+' done':'not started'))+'">'+s+'</svg><span>'+names[i]+'</span></div>';}).join('');
 var rows=(typeof avRows==='function')?avRows():[], seat={};
 rows.forEach(function(x){if(x.gap&&x.gap.seat)seat[x.gap.seat]=x;});
 var seats=BANDS.filter(function(b){return seat[b];});
 var list='';
 if(!rows.length)list='<p class="rv-empty">Your avatar has no stories yet.</p>'
  +'<div class="rv-acts"><button type="button" class="btn" data-act="go-avatar">Open the avatar</button></div>';
 else if(!seats.length)list='<p class="rv-empty">Your avatar\'s stories do not read at a seat yet.</p>';
 else list='<ul class="rv-avl">'+seats.slice(0,4).map(function(b){
  var x=seat[b], A=(typeof AV_OF!=='undefined'&&AV_OF[b])||{nm:b,about:''};
  var fed=st.act.filter(function(p){return p.band===b||p.tags.indexOf(b)>=0;});
  return '<li class="rv-avs" style="--c:'+seatCol(b)+'"><i aria-hidden="true"></i><span class="rv-avt">'
   +'<span class="rv-avn">'+esc(A.nm)+' <small>'+esc(A.about)+', at '+esc(ritThe(b))+'</small></span>'
   +'<span class="rv-avb">"'+esc(ritClip(String(x.pair.be).replace(/^"+|"+$/g,''),64))+'"</span>'
   +'<span class="rv-avf'+(fed.length?' rv-fed':'')+'">'+(x.gap.clear?'Clear at this seat'
    :fed.length?'Fed by '+esc(fed.map(function(p){return ritName(p.steps);}).join(', '))
    :'No ritual at this seat yet')+'</span></span></li>';}).join('')+'</ul>';
 return '<section class="rv-sec rv-c rv-c-av" data-slot="top-left"><div class="rv-hd"><span class="rv-h">Ritual to avatar</span></div>'
  +'<p class="rv-mean">Each day you keep a ritual turns your avatar one seat, root to crown. Seven days make a turn, and three turns make a cycle.</p>'
  +'<div class="rv-avw"><div class="rv-cys">'+rings+'</div>'
  +'<div class="rv-fig rv-avfig"><b>'+(C.days?C.days+'<small>'+(C.days===1?' day':' days')+'</small>':'–')+'</b><span>Kept</span></div></div>'
  +list+'</section>';}
function ritClip(s,n){return s.length>n?s.slice(0,n-1).replace(/\s+\S*$/,'')+'…':s;}

/* ---------------- the ongoing goal ---------------- */
function ritGoalHtml(st){
 var bc=ritBecoming(), pairs=(CURP&&CURP.avatar&&CURP.avatar.pairs)||[], last=null;
 for(var i=pairs.length-1;i>=0;i--)if(pairs[i]&&pairs[i].be&&String(pairs[i].be).trim()){last=pairs[i];break;}
 var h='<section class="rv-sec rv-c rv-c-goal" data-slot="top-right"><div class="rv-hd"><span class="rv-h">Ongoing goal</span></div>'
  +'<p class="rv-mean">Who your avatar is becoming, what is held in the way, and the next mark your record can earn.</p>';
 /* each branch opens and closes its own markup, because the build counts the
    divs in the source text and a shared open closed in two branches reads as
    two closes for one open */
 if(bc){
  var on=st.act.some(function(p){return p.rel===bc.n.i;}), col=seatCol(bc.seat);
  var said=on?'<p class="rv-why-p">A release schedule for <b>'+esc(String(bc.n.k).toLowerCase())+'</b> at '+esc(ritThe(bc.seat))+' is active.</p>'
   :'<p class="rv-why-p">You are holding on to <b>'+esc(String(bc.n.k).toLowerCase())+'</b> at '
    +esc(ritThe(bc.seat))+'. Set up a release schedule for it?</p>';
  var acts=on?'':'<span class="rv-acts rv-why-a">'
   +'<button type="button" class="btn pri" data-act="why" data-d="7">A week</button>'
   +'<button type="button" class="btn pri" data-act="why" data-d="14">Two weeks</button></span>';
  h+='<div class="rv-why" style="--c:'+col+'"><div class="rv-why-t"><span class="rv-lb">Your avatar wants to be</span>'
   +'<p class="rv-why-be">"'+esc(bc.be.replace(/^"+|"+$/g,''))+'"</p>'+said+'</div>'+acts+'</div>';}
 else if(last)
  h+='<div class="rv-why" style="--c:var(--accent)"><div class="rv-why-t"><span class="rv-lb">Your avatar wants to be</span>'
   +'<p class="rv-why-be">"'+esc(String(last.be).trim().replace(/^"+|"+$/g,''))+'"</p>'
   +'<p class="rv-why-p">Nothing held at four or more stands in the way of it yet.</p></div></div>';
 else h+='<p class="rv-empty">Your avatar has no goal written yet.</p>';
 var m=st.L.next;
 if(m)h+='<div class="rv-nxm" style="--c:'+seatCol(m.b)+'"><span class="rv-nxi" aria-hidden="true">'
  +'<svg viewBox="0 0 24 24"><path d="'+m.ic+'"/></svg></span>'
  +'<span class="rv-nxt"><span class="rv-lb">Next mark</span><b>'+esc(m.nm)+'</b><span>'+esc(m.d)+'</span></span></div>'
  +'<p class="rv-mean rv-nxs">A mark is earned from your record, never bought.</p>';
 return h+'</section>';}

/* ---------------- did it work ---------------- */
/* the kept and missed days of one ritual from the day it started, read off the
   same coverage the month draws. Today counts only once it is kept: a day
   still open is not a miss. */
function ritRunRead(p,today){
 var s=ritStart0(p), kept=0, missed=0;
 for(var d=s;d<=today;d++){
  if(!ritCovers(p,d))continue;
  var e=ritEntryFor(p,d), done=!!(e&&ritIsDone(e.x));
  if(done)kept++; else if(d<today)missed++;}
 return {kept:kept, missed:missed};}
/* the last reading taken at or before a moment, off the snapshot history */
function ritSnapBefore(iso){
 var t=Date.parse(iso), best=null, bt=-Infinity;
 ((CURP&&CURP.history)||[]).forEach(function(h){
  var ms=h&&Date.parse(h.t); if(!(ms<=t)||ms<bt)return; bt=ms; best=h;});
 return best;}
function ritOkRead(st){
 var today=st.today, now=(st.r.loaded||[]).length;
 return st.plans.filter(function(p){
  var s=ritStart0(p); if(today-s<2)return false;
  if(ritActive(p,today))return true;
  var end=p.stop?pracDay(p.stop):s+p.days; return today-end<=30;})
  .sort(function(a,b){return ritStart0(b)-ritStart0(a);}).slice(0,3)
  .map(function(p){var run=ritRunRead(p,today), h=ritSnapBefore(p.from);
   return {p:p, kept:run.kept, missed:run.missed, then:h?h.loaded:null, now:now};});}
function ritOkHtml(st){
 var rows=ritOkRead(st), body;
 if(!rows.length)body='<p class="rv-empty">Nothing has run long enough to read. A ritual shows here from its third day.</p>';
 else body='<ul class="rv-okl">'+rows.map(function(x){
  var top=Math.max(1,x.then||0,x.now);
  return '<li class="rv-ok1" style="--c:'+ritCol(x.p)+'"><span class="rv-okn">'+esc(ritName(x.p.steps))+'</span>'
   +'<span class="rv-okk">Kept '+acctDays(x.kept)+', missed '+x.missed+'.</span>'
   +(x.then===null?'<span class="rv-okf">No reading from before it started.</span>'
    :'<span class="rv-okf">Held places: '+x.then+' when it started, '+x.now+' now.</span>'
     +'<span class="rv-okb" aria-hidden="true"><i class="rv-okb0" style="width:'+(100*x.then/top).toFixed(1)+'%"></i>'
     +'<i class="rv-okb1" style="width:'+(100*x.now/top).toFixed(1)+'%"></i></span>')+'</li>';}).join('')+'</ul>';
 return '<section class="rv-sec rv-c rv-c-ok"><div class="rv-hd"><span class="rv-h">Did it work</span></div>'
  +'<p class="rv-mean">Kept and missed come from your record. Held places are the places at four or more, read before the ritual started '
  +'and now; a reading is taken each time you commit a story or finish a release. The two moved together. That does not say the ritual moved them.</p>'
  +body+'</section>';}

/* ---------------- keep or delete ---------------- */
var RIT_KEEP_AT=3;
function ritKeepHtml(st){
 var today=st.today, rows=st.act.filter(function(p){return p.days>0&&ritStart0(p)+p.days-today<=RIT_KEEP_AT;});
 var body=(RIT.gone&&RIT.goneAt==='keep')?'<div class="rv-gone" role="status"><span>Deleted.</span><button type="button" class="btn" data-act="putback">Put back</button></div>':'';
 if(!rows.length)body+='<p class="rv-empty">Nothing ends in the next '+RIT_KEEP_AT+' days.</p>';
 else body+='<ul class="rv-kpl">'+rows.map(function(p){var run=ritRunRead(p,today);
  return '<li class="rv-kp1" style="--c:'+ritCol(p)+'"><span class="rv-kpt"><span class="rv-okn">'+esc(ritName(p.steps))+'</span>'
   +'<span class="rv-okk">'+esc(ritLeft(p,today))+'. Kept '+acctDays(run.kept)+'.</span></span>'
   +'<span class="rv-kpa"><button type="button" class="btn" data-act="del-keep" data-id="'+p.id+'" aria-label="Delete '+esc(ritName(p.steps))+'">Delete</button>'
   +'<button type="button" class="btn pri" data-act="keep" data-id="'+p.id+'" aria-label="Keep '+esc(ritName(p.steps))+' a week more">Keep</button></span></li>';}).join('')+'</ul>';
 return '<section class="rv-sec rv-c rv-c-keep"><div class="rv-hd"><span class="rv-h">Keep or delete</span></div>'
  +'<p class="rv-mean">A ritual comes here in its last '+RIT_KEEP_AT+' days. Keep runs it a week more from where it is. '
  +'Delete takes it off and leaves the days you kept on the record. One with no end stays until you stop it.</p>'+body+'</section>';}
function ritKeep(id){
 var p=ritPlans().filter(function(x){return x.id===id;})[0]; if(!p)return false;
 return ritStartPlan({steps:p.steps, band:p.band, track:p.track, days:7, when:p.when, where:p.where,
  rel:p.rel, tc:p.tc, tags:p.tags, on:p.on, tm:p.tm},'Kept. '+ritName(p.steps)+' runs a week more.');}

/* ---------------- practice analytics ---------------- */
var RIT_WK_NM=['Last 7 days','2 weeks ago','3 weeks ago','4 weeks ago'];
function ritAnaRead(st){
 var t0=st.today-29, seat={}, wk=[0,0,0,0], any=false;
 ((CURP&&CURP.rituals)||[]).forEach(function(x){
  if(!x||!ritIsDone(x))return;
  var d=pracDay(x.t); if(d===null||d<t0||d>st.today)return;
  any=true;
  var b=(x.band&&BANDS.indexOf(x.band)>=0)?x.band:'';
  (seat[b]=seat[b]||{})[d]=1;
  var w=Math.floor((st.today-d)/7); if(w<4)wk[w]+=(+x.min||0);});
 var bars=BANDS.slice().reverse().concat(['']).filter(function(b){return seat[b];})
  .map(function(b){return {b:b, n:Object.keys(seat[b]).length};});
 return {any:any, bars:bars, wk:wk};}
function ritAnaHtml(st,chain){
 var A=ritAnaRead(st), g='';
 if(!A.any)g='<p class="rv-empty">Nothing kept in the last thirty days.</p>';
 else{
  var top=Math.max.apply(null,A.bars.map(function(x){return x.n;}).concat([1]));
  var wtop=Math.max.apply(null,A.wk.concat([1]));
  g='<div class="rv-anag"><div class="rv-ana1"><span class="rv-lb">Kept by seat, last thirty days</span><ul class="rv-sbars">'
   +A.bars.map(function(x){
    return '<li style="--c:'+(x.b?seatCol(x.b):'var(--dim)')+'"><span class="rv-sbn">'+esc(x.b?ritTagNm(x.b):'No seat')+'</span>'
     +'<span class="rv-sbt"><i style="width:'+(100*x.n/top).toFixed(1)+'%"></i></span><span class="rv-sbv">'+acctDays(x.n)+'</span></li>';}).join('')
   +'</ul></div><div class="rv-ana1"><span class="rv-lb">Minutes by week</span><div class="rv-wks">'
   +A.wk.slice().reverse().map(function(m,j){var i=3-j;
    return '<div class="rv-wk1"><span class="rv-wkv">'+(m?m+'<small> min</small>':'–')+'</span>'
     +'<span class="rv-wkb"><i style="height:'+(100*m/wtop).toFixed(1)+'%"></i></span><span class="rv-wkn">'+RIT_WK_NM[i]+'</span></div>';}).join('')
   +'</div></div></div>';}
 return '<section class="rv-sec rv-c rv-c-ana"><div class="rv-hd"><span class="rv-h">Practice analytics</span></div>'
  +'<p class="rv-mean">From what you wrote, to what it left held, to the practice it calls for. Then the days you kept a ritual at each seat, '
  +'and the minutes of every ritual marked done, counted back in sevens from today.</p>'+chain+g+'</section>';}

/* ---------------- the still layer behind the stage ---------------- */
function ritLiveHtml(){
 var held=ritHeld(), by={};
 held.forEach(function(x){by[x.b]=(by[x.b]||0)+1;});
 var seats=BANDS.filter(function(b){return by[b];});
 var pools=seats.map(function(b,i){
  var A=(typeof AV_OF!=='undefined'&&AV_OF[b])||{a:i*51};
  var t=A.a*Math.PI/180, x=50+38*Math.cos(t), y=46+34*Math.sin(t), s=200+Math.min(by[b],8)*34;
  return '<i class="rv-pool" style="--c:'+seatCol(b)+';--x:'+x.toFixed(1)+'%;--y:'+y.toFixed(1)+'%;--s:'+s+'px;--i:'+i+'"></i>';}).join('');
 /* nothing held is a quiet page and not an empty one: one pool of the
    accent, centred, so the stage still breathes */
 if(!pools)pools='<i class="rv-pool rv-pool0" style="--c:var(--accent);--x:50%;--y:40%;--s:360px;--i:0"></i>';
 return '<div class="rv-live" aria-hidden="true">'+pools+'</div>';}

/* the six, in his slots. Active today is the existing list and keeps its own
   heading, so the middle slot is the one a person already knows. */
function ritStageHtml(st,P){
 return '<div class="rv-six">'+ritAvHtml(st)+ritGoalHtml(st)+P.active+ritOkHtml(st)+ritKeepHtml(st)
  +ritAnaHtml(st,P.chain)+'</div>';}

function ritStageCss(){
 if(document.getElementById('rit2-css'))return;
 var st=document.createElement('style'); st.id='rit2-css';
 st.textContent=[
  /* the six. Two columns with the middle slot across both, and one column
     under 640 of stage, in his order: top left, top right, middle, then the
     three that read and decide. Named areas, so the order on a phone and the
     slots on a desktop are one statement. */
  '.rv-six{display:grid;gap:14px;grid-template-columns:minmax(0,1fr) minmax(0,1fr);',
  ' grid-template-areas:"av goal" "act act" "ok keep" "ana ana";align-items:stretch}',
  '.rv-six>.rv-sec{margin:0;min-width:0}',
  '.rv-six>.rv-c-av{grid-area:av} .rv-six>.rv-c-goal{grid-area:goal} .rv-six>.rv-act{grid-area:act}',
  '.rv-six>.rv-c-ok{grid-area:ok} .rv-six>.rv-c-keep{grid-area:keep} .rv-six>.rv-c-ana{grid-area:ana}',
  '@container (max-width:639px){.rv .rv-six{grid-template-columns:minmax(0,1fr);',
  ' grid-template-areas:"av" "goal" "act" "ok" "keep" "ana"}}',
  /* each card takes one hue from the tokens the page already themes */
  '.rv-c-av{--k:var(--sec-embody)} .rv-c-goal{--k:var(--accent)} .rv-c-ok{--k:var(--sec-play)}',
  '.rv-c-keep{--k:var(--sec-flow)} .rv-c-ana{--k:var(--sec-discover)}',
  '.rv-c{border-color:color-mix(in srgb,var(--k) 34%,transparent);background:color-mix(in srgb,var(--k) 5%,var(--panel))}',
  /* the still layer. Behind the cards and never in front of them; the card
     body sits on its own ground, so the light only shows in the gaps */
  'body.tab-ritual #rit .rit-card.rv{position:relative;isolation:isolate}',
  '.rv-live{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:-1}',
  '.rv-pool{position:absolute;left:var(--x);top:var(--y);width:var(--s);height:var(--s);margin:calc(var(--s) / -2) 0 0 calc(var(--s) / -2);',
  ' border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--c) 26%,transparent),transparent);',
  ' animation:rvDrift calc(var(--t-breath) * 5) var(--ease-breath) infinite alternate,rvBreath var(--t-breath) var(--ease-breath) infinite alternate;',
  ' animation-delay:calc(var(--i) * -2.3s),calc(var(--i) * -.6s)}',
  '.rv-pool0{background:radial-gradient(closest-side,color-mix(in srgb,var(--c) 14%,transparent),transparent)}',
  '@keyframes rvDrift{from{translate:-18px -12px}to{translate:20px 14px}}',
  '@keyframes rvBreath{from{opacity:.5}to{opacity:1}}',
  'body.snow .rv-pool,body.glasswhite .rv-pool{background:radial-gradient(closest-side,color-mix(in srgb,var(--c) 16%,transparent),transparent)}',
  /* the left column's suggestions */
  '.rv-sug{--k:var(--accent)}',
  '.rv-sugl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.rv-sg1{padding:11px 12px;border-radius:12px;background:var(--panel-2);border:1px solid var(--edge);box-shadow:inset 3px 0 0 var(--c)}',
  '.rv-sgh{display:flex;align-items:baseline;justify-content:space-between;gap:10px}',
  '.rv-sgn{font-size:15px;font-weight:600;color:var(--ink)}',
  '.rv-sgm{font-size:13px;color:var(--mid);white-space:nowrap}',
  '.rv-sgw{list-style:none;margin:4px 0 8px;padding:0;display:flex;flex-direction:column;gap:3px;font-size:13.5px;line-height:1.5;color:var(--mid)}',
  '.rv-sgf{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}',
  '.rv-sgt{display:flex;flex-wrap:wrap;gap:4px}',
  /* ritual to avatar */
  '.rv-avw{display:flex;align-items:center;gap:14px;margin:0 0 10px;flex-wrap:wrap}',
  '.rv-cys{display:flex;gap:10px}',
  '.rv-cy{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:12.5px;color:var(--mid)}',
  '.rv-cy svg{width:58px;height:58px}',
  '.rv-cy-t{fill:none;stroke:var(--edge-2);stroke-width:3;stroke-linecap:round;opacity:.7}',
  '.rv-cy-a{fill:none;stroke:var(--k);stroke-width:3.4;stroke-linecap:round}',
  '.rv-cy-ok{fill:none;stroke:var(--k);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-cy.rv-cur .rv-cy-a{animation:rvGlow var(--t-breath) var(--ease-breath) infinite alternate}',
  '.rv-cy.rv-cur span{color:var(--ink);font-weight:600}',
  '@keyframes rvGlow{from{opacity:.62}to{opacity:1}}',
  '.rv-avfig{flex:0 0 auto;min-width:96px}',
  '.rv-c-av .rv-fig{border-color:color-mix(in srgb,var(--k) 40%,transparent);background:color-mix(in srgb,var(--k) 8%,var(--panel))}',
  '.rv-c-av .rv-fig b{color:var(--k)}',
  '.rv-avl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
  '.rv-avs{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid var(--edge)}',
  '.rv-avs>i{width:10px;height:10px;margin-top:5px;border-radius:50%;border:2px solid var(--c);flex:0 0 auto}',
  '.rv-avt{display:flex;flex-direction:column;gap:2px;min-width:0}',
  '.rv-avn{font-size:14px;font-weight:600;color:var(--ink)}',
  '.rv-avn small{font-weight:400;font-size:13px;color:var(--dim)}',
  '.rv-avb{font-size:14px;line-height:1.45;color:var(--mid)}',
  '.rv-avf{font-size:13px;color:var(--dim)}',
  '.rv-avf.rv-fed{color:var(--ink)}',
  '.rv-avf.rv-fed::before{content:"";display:inline-block;width:7px;height:7px;margin:0 6px 1px 0;border-radius:50%;background:var(--c)}',
  /* the ongoing goal */
  '.rv-c-goal .rv-why{margin:0 0 12px}',
  '.rv-nxm{display:flex;gap:12px;align-items:flex-start;padding:10px 12px;border-radius:12px;background:var(--panel-2);border:1px solid var(--edge)}',
  '.rv-nxi{display:inline-flex;align-items:center;justify-content:center;flex:0 0 40px;width:40px;height:40px;border-radius:50%;',
  ' border:1.5px solid var(--c);color:var(--c);animation:rvGlow var(--t-breath) var(--ease-breath) infinite alternate}',
  '.rv-nxi svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-nxt{display:flex;flex-direction:column;gap:2px;min-width:0}',
  '.rv-nxt b{font-size:15px;font-weight:600;color:var(--ink)}',
  '.rv-nxt>span:last-child{font-size:13.5px;line-height:1.5;color:var(--mid)}',
  '.rv-nxs{margin:8px 0 0}',
  /* did it work, and keep or delete */
  '.rv-okl,.rv-kpl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.rv-ok1,.rv-kp1{display:flex;flex-direction:column;gap:3px;padding:10px 12px;border-radius:12px;background:var(--panel-2);',
  ' border:1px solid var(--edge);box-shadow:inset 3px 0 0 var(--c)}',
  '.rv-kp1{flex-direction:row;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}',
  '.rv-kpt{display:flex;flex-direction:column;gap:3px;min-width:0}',
  '.rv-kpa{display:flex;gap:8px}',
  '.rv-okn{font-size:15px;font-weight:600;color:var(--ink)}',
  '.rv-okk{font-size:13.5px;color:var(--mid)}',
  '.rv-okf{font-size:13.5px;color:var(--ink)}',
  '.rv-okb{display:flex;flex-direction:column;gap:3px;margin-top:4px}',
  '.rv-okb i{display:block;height:6px;border-radius:3px;min-width:2px}',
  '.rv-okb0{background:color-mix(in srgb,var(--c) 40%,transparent)}',
  '.rv-okb1{background:var(--c)}',
  /* practice analytics */
  '.rv-c-ana .rv-chain{margin-bottom:14px}',
  '.rv-anag{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:16px}',
  '@container (max-width:560px){.rv .rv-anag{grid-template-columns:minmax(0,1fr)}}',
  '.rv-ana1 .rv-lb{margin-bottom:8px}',
  '.rv-sbars{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
  '.rv-sbars li{display:grid;grid-template-columns:72px minmax(0,1fr) 62px;align-items:center;gap:8px;font-size:13px}',
  '.rv-sbn{color:var(--mid)}',
  '.rv-sbt{height:10px;border-radius:5px;background:color-mix(in srgb,var(--c) 12%,transparent);overflow:hidden}',
  '.rv-sbt i{display:block;height:100%;border-radius:5px;background:var(--c)}',
  '.rv-sbv{color:var(--ink);text-align:right;font-variant-numeric:tabular-nums}',
  '.rv-wks{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;align-items:end}',
  '.rv-wk1{display:flex;flex-direction:column;align-items:stretch;gap:4px;text-align:center}',
  '.rv-wkv{font-size:13px;color:var(--ink);font-variant-numeric:tabular-nums}',
  '.rv-wkv small{color:var(--dim)}',
  '.rv-wkb{display:flex;align-items:flex-end;height:64px;border-radius:6px;background:color-mix(in srgb,var(--k) 8%,transparent)}',
  '.rv-wkb i{display:block;width:100%;border-radius:6px;background:var(--k);min-height:2px}',
  '.rv-wkn{font-size:12.5px;line-height:1.3;color:var(--dim)}',
  /* the right column's loop and history */
  '.rv-loopw{--k:var(--sec-embody)}',
  '.rv-loopw,.rv-hist{border-color:color-mix(in srgb,var(--k) 38%,transparent);background:color-mix(in srgb,var(--k) 6%,var(--panel))}',
  '.rv-hist{--k:var(--sec-flow)}',
  '.rv-loopb{position:relative;width:min(100%,260px);aspect-ratio:1/1;margin:2px auto 8px}',
  '.rv-loop{display:block;width:100%;height:100%;overflow:visible}',
  '.rv-ld{fill:none;stroke-linecap:butt}',
  '.rv-ld-none{stroke:var(--edge-2);opacity:.55}',
  '.rv-ld-done{opacity:1}',
  '.rv-ld-plan{opacity:.34}',
  '.rv-ld-ahead{opacity:.34}',
  '.rv-ld-miss{stroke:var(--dim)!important;opacity:.9;stroke-dasharray:2 2.4}',
  '.rv-ld-now.rv-ld-plan{animation:rvNow var(--t-breath) var(--ease-breath) infinite alternate}',
  '@keyframes rvNow{from{opacity:.3}to{opacity:.85}}',
  '.rv-ltk{stroke:var(--mid);stroke-width:1.6;stroke-linecap:round}',
  '.rv-lnow{fill:var(--k);animation:rvGlow var(--t-breath) var(--ease-breath) infinite alternate}',
  '.rv-lmid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none}',
  '.rv-lmid b{font-size:34px;font-weight:600;line-height:1;color:var(--ink);font-variant-numeric:tabular-nums}',
  '.rv-lmid span{font-size:13px;color:var(--mid);margin-top:4px}',
  '.rv-lkey{list-style:none;margin:0 0 8px;padding:0;display:flex;flex-direction:column;gap:4px}',
  '.rv-lkey li{display:flex;align-items:center;gap:8px;font-size:13.5px;color:var(--ink)}',
  '.rv-lkey li i{width:18px;height:6px;border-radius:3px;background:var(--c);flex:0 0 auto}',
  '.rv-lkey li small{color:var(--dim);font-size:13px}',
  '.rv-lsum{margin:8px 0 0;padding:10px 12px;border-radius:12px;background:var(--panel-2);font-size:14px;line-height:1.55;color:var(--mid)}',
  '.rv-lsum b{color:var(--ink);font-weight:600}',
  '.rv-hl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.rv-hc{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:var(--panel-2);border:1px solid var(--edge);',
  ' box-shadow:inset 3px 0 0 var(--c)}',
  '.rv-hc svg{width:34px;height:34px;flex:0 0 auto}',
  '.rv-hct{display:flex;flex-direction:column;gap:2px;flex:1 1 auto;min-width:0}',
  '.rv-hcn{font-size:14.5px;font-weight:600;color:var(--ink)}',
  '.rv-hcs{font-size:13px;color:var(--mid)}',
  '.rv-hc .rv-tag{margin:0;flex:0 0 auto}',
  '.rv-hc .btn{flex:0 0 auto}',
  /* arrival: the readings draw in once, when the page is arrived at. Only
     strokes move, never text, so nothing a person reads is ever half there */
  '.rv-arrive .rv-cy-a{animation:rvDraw .9s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(.15s + var(--i,0) * 70ms)}',
  '.rv-arrive .rv-cy.rv-cur .rv-cy-a{animation:rvDraw .9s cubic-bezier(.22,1,.36,1) both,rvGlow var(--t-breath) var(--ease-breath) 1.2s infinite alternate}',
  '@keyframes rvDraw{from{stroke-dasharray:0 1}to{stroke-dasharray:1 0}}',
  '.rv-arrive .rv-ld{animation:rvTick .5s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(var(--i,0) * 18ms)}',
  '@keyframes rvTick{from{opacity:0}}',
  '.rv-arrive .rv-ld-now.rv-ld-plan{animation:rvTick .5s cubic-bezier(.22,1,.36,1) both,rvNow var(--t-breath) var(--ease-breath) .6s infinite alternate}',
  '.rv-arrive .rv-okb i,.rv-arrive .rv-sbt i{animation:rvGrow .8s cubic-bezier(.22,1,.36,1) both}',
  '.rv-arrive .rv-wkb i{animation:rvRise .8s cubic-bezier(.22,1,.36,1) both}',
  '@keyframes rvGrow{from{transform:scaleX(0)}} @keyframes rvRise{from{transform:scaleY(0)}}',
  '.rv-okb i,.rv-sbt i{transform-origin:left center} .rv-wkb i{transform-origin:bottom center}'
  /* NO REDUCED MOTION RULE HERE, and that is on purpose: shell/head.html
     already stills every animation in the product under
     prefers-reduced-motion, '*{animation:none!important}'. A second rule
     here would be a second place to keep in step. FT23 holds the page to it. */
 ].join('\n');
 document.head.appendChild(st);}
