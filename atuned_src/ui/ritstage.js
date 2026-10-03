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

   ROUND QX changed two of the six on his words, "my complete list of daily,
   weekly, monthly goals, and my success win": the middle is Goals, the
   Active list as its Today with a week and a month beside it, and the last
   is Success over time, his ten spans from a year down to a day. Both are in
   ui/ritcal.js, which also says what each suggestion is, what it is for, the
   person's own record with it, and takes Save for later and Dismiss.

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
   unbuilt past its slice 0). The link point is the row ritSuggest returns:
   when achievements exist, a row may carry the achievement it moves toward,
   read from that system and never typed here. Nothing reads or writes one now,
   because a promise on screen with nothing behind it is the status lie. The
   ladder's marks (engine/ladder.js) are real: the next one is on the Ongoing
   goal card, and since round QS the earned ones are pinned on the thirty day
   cubes on the day each was earned (ui/accountability.js, FT28).

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
 /* ROUND QX: one saved for later or dismissed is not offered again here. A
    saved one is under Saved for later; a dismissed one comes back with Put
    back, or with Bring back dismissed at the foot of the list. */
 var MO=(typeof ritMore==='function')?ritMore():{save:[],gone:[]}, held={};
 MO.save.forEach(function(s){held[ritSugKey(s)]=1;}); MO.gone.forEach(function(k){held[k]=1;});
 var all0=ritSuggest(st), all=all0.filter(function(x){return !held[ritSugKey(x)];});
 var list=all.filter(function(x){return x.rel!=null||!RIT.sel[x.k];}); RIT.sug=list;
 var saved=(typeof ritSavedHtml==='function')?ritSavedHtml():'';
 var undo=RIT.sgGone?'<div class="rv-gone" role="status"><span>Dismissed '+esc(RIT.sgGone.nm)+'.</span>'
  +'<button type="button" class="btn" data-act="sug-back">Put back</button></div>':'';
 var foot=(MO.gone.length&&!RIT.sgGone)?'<div class="rv-sgfoot"><button type="button" class="btn rv-sgq" data-act="sug-all">Bring back dismissed</button></div>':'';
 /* and when the builder holds every suggestion there is, the section says
    nothing: "Nothing to suggest yet" under a builder holding the suggestion
    would be untrue */
 if(!list.length&&all.length&&!undo)return saved;
 RIT.sgw=RIT.sgw||{};
 var body=!list.length?'<p class="rv-empty">'+(all0.length?'Nothing else to suggest. Each one is started, saved for later or dismissed.':'Nothing to suggest yet.')+'</p>'
  :'<ul class="rv-sugl">'+list.map(function(x,i){
   var b=x.seats[0]||'', col=b?seatCol(b):'var(--accent)', M=ritSugMark(x,b), open=!!RIT.sgw[x.k+'|'+x.rel];
   /* ROUND QX, "add a text description. And the success of what it leads
      to." The description is the library's own line for the practice. What
      it leads to is the quality release installs at the place the card is
      for, a canon word and not a measurement. The success is the person's own
      record with this practice, because no measure of how well a practice
      works exists anywhere in the engine and one made up here would be the
      status lie. ui/ritcal.js says the same at ritSugRec. */
   var R=ritSugRec(x,(st.r.loaded||[]).length), T=ritSugToward(x), recSays=ritSugRecSays(x,R);
   var chips='<div class="rv-sgo">'
    +(T?'<span class="rv-sgc"'+rvTip('Toward '+T.opp.toLowerCase(),'What it is for: '+T.opp.toLowerCase()
      +' is the quality release puts back where '+ritCfWord(T.nm)+' was held. You hold '+String(T.k).toLowerCase()+' at '+ritThe(T.b)+'.')+'>'
      +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14 M14 7l5 5-5 5"/></svg>Toward '+esc(T.opp.toLowerCase())+'</span>':'')
    +'<span class="rv-sgc'+(R.kept?'':' rv-sgc0')+'"'+rvTip('Your record with it',recSays.join(' '))+'>'
     +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>'
     +(R.kept?'Kept '+acctDays(R.kept):'Not tried yet')+'</span></div>';
   return '<li class="rv-sg1'+(open?' rv-open':'')+'" style="--c:'+col+'">'
    +'<div class="rv-sgh"><button type="button" class="rv-sgs" data-act="sgwhy" data-i="'+i+'" aria-expanded="'+open
     +'" aria-label="Why '+esc(x.p.nm)+' is suggested">'+M.badge+'</button>'
    +'<span class="rv-sgt0"><span class="rv-sgn">'+esc(x.p.nm)+'</span><span class="rv-sgm">'+x.p.min+' min a day</span></span></div>'
    /* ONE LINE STAYS VISIBLE, round QV, "with suggested add a little text".
       Round QX made it what the practice is, his "text description", and the
       reason it is offered moved into the press, where the full why-list was
       already: the first reason was printed twice whenever a card was open. */
    +'<p class="rv-sgd">'+esc(x.p.d||'')+'</p>'+chips
    /* THE REASONS ARE ONE PRESS AWAY, round QS. His words: "more show less
       tell if you want tell you press on something to get information." The
       mark is the press, and it opens the reasons and what the ring measures
       in place, under the name, rather than in a panel somewhere else. */
    +'<div class="rv-sgx"'+(open?'':' hidden')+'><ul class="rv-sgw">'+x.why.map(function(w){return '<li>'+esc(w)+'</li>';}).join('')
     +'</ul><ul class="rv-sgrec">'+recSays.map(function(w){return '<li>'+esc(w)+'</li>';}).join('')+'</ul>'
     +'<p class="rv-sgr">'+esc(M.says)+'</p></div>'
    +'<div class="rv-sgf"><span class="rv-sgt">'+x.seats.map(function(sb){
      return '<em class="rv-tg" style="--t:'+seatCol(sb)+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+(SEATGLYPH[sb]||SEATGLYPH._)+'</svg>'
       +esc(ritTagNm(sb))+'</em>';}).join('')+'</span></div>'
    /* ROUND QX, HIS THREE: "add them to my daily practice or bank them to my
       vault or dismiss". Add is the press it always was (ritSugStart). Save
       for later is his "bank to my vault": Bank and Vault already mean the
       imprints held and what has been released, so a third meaning for either
       word would be one word for two concepts. Dismiss takes it off the list,
       with Put back in the same place. */
    +'<div class="rv-sga"><button type="button" class="btn pri" data-act="sug" data-i="'+i+'" aria-label="Add '+esc(x.p.nm)+' to daily practice, each day for a week">Add to daily practice</button>'
    +'<button type="button" class="btn" data-act="sug-save" data-i="'+i+'" aria-label="Save '+esc(x.p.nm)+' for later">Save for later</button>'
    +'<button type="button" class="btn rv-sgq" data-act="sug-x" data-i="'+i+'" aria-label="Dismiss '+esc(x.p.nm)+'">Dismiss</button></div></li>';}).join('')+'</ul>';
 return '<div class="rv-sec rv-sug"><div class="rv-hd"><span class="rv-h">Suggested</span></div>'
  +'<p class="rv-mean">Read from your avatar\'s stories and from the places your field holds the most charge. '
  +'Each is the practice that seat calls for at the charge you carry now. Its mark is the seat, or the pattern it releases.</p>'+undo+body+foot+'</div>'+saved;}
/* A SUGGESTION'S MARK, round QS. His words: "the cards that come from the
   ritual builder they should be colorized and related to the color of the
   chakra or fetter with their symbol." A card that runs as a release schedule
   is tied to one held place, so it wears that place's pattern, the fetter's
   own mark from CHILD (the one the rail and the Avatar page draw for it), and
   its ring is that place's charge, which is crbNode's shape for an address.
   Any other card is for its seat, so it wears the seat's mark from SEATGLYPH
   and its ring is the heaviest place held at that seat. Both in the seat's
   colour, from seatCol. A seat holding nothing draws the mark with an empty
   ring and says so. */
function ritSugMark(x,b){
 var n=(x.rel!=null&&BY[x.rel])?BY[x.rel]:null;
 if(!n&&b)n=ritHeld().filter(function(h){return h.b===b;}).sort(function(a,c){return c.sq-a.sq;})[0]||null;
 var cf=n&&n.cf?CHILD.filter(function(c){return c.nm===n.cf;})[0]:null;
 var glyph=(x.rel!=null&&cf)?glyphPath(cf.ic):(SEATGLYPH[b]||SEATGLYPH._);
 var col=b?seatCol(b):'var(--accent)';
 var badge=crBadge(b,n?n.sq*10:0,{size:'md', color:col, glyph:glyph, raw:n?n.sq.toFixed(1):'–'});
 var says=!b?'No seat yet, so the mark is empty.'
  :n?'The mark is '+(x.rel!=null&&cf?'the pattern '+cf.nm.toLowerCase()+', ':'the seat, ')+'and the ring is '
    +String(n.k).toLowerCase()+' held at '+ritThe(b)+', at '+n.sq.toFixed(1)+'.'
  :'The mark is the seat. Nothing is held at '+ritThe(b)+', so the ring is empty.';
 return {badge:badge, says:says};}

/* ---------------- ritual to avatar ----------------
   ROUND QS made this card a picture first. His words: "everything like the
   rest of the app has to be visually symbolic ... more show less tell if you
   want tell you press on something to get information."

   THE HERO is the avatar's own percent complete, avState().overall, the
   figure the Avatar page draws round its core and the one he called good
   there ("And the percent complete, that's good", round HG). It is drawn as
   cr() at its hero size, the CQ circle's own object, with the avatar's own
   mark (AV_IC.person) inside. Nothing new is measured: the ring is how much of
   what the avatar's stories carried has gone since they were written.

   THE CYCLES beside it are unchanged: avCycles, the days kept turning the
   avatar a seat at a time.

   THE SEATS are tiles, one per seat an avatar story sits at, each a crBadge
   with the Avatar page's own mark for that area (AV_IC) in the seat's colour,
   its ring the area's percent complete (avState().areas). The line the person
   wrote and the ritual that feeds the seat moved off the card and onto the
   press, so the card at rest is seven marks and not seven paragraphs. A dot
   under the mark is filled when an active ritual feeds the seat. */
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
 var A0=(typeof avState==='function')?avState():null;
 var all=A0&&A0.overall!=null?A0.overall:null, pc=all===null?0:Math.round(all*100);
 var hero='<span class="rv-avhero"'+rvTip('Your avatar',
   'Percent complete: how much of what your avatar\'s stories carried has gone since you wrote them. The same figure the Avatar page draws round its core.',
   all===null?'':'Complete|'+pc+'%|100%','Avatar')+'>'
  +cr('Heart',pc,{size:'hero', hot:false, color:'var(--k)', glyph:(typeof AV_IC!=='undefined'?AV_IC.person:SEATGLYPH._), raw:all===null?'–':pc+'%'})
  +'<span class="rv-avhl">Avatar</span></span>';
 var cyc='<div class="rv-avc"'+rvTip('Cycles',
   'Each day you keep a ritual turns your avatar one seat, root to crown. Seven days make a turn, and three turns make a cycle.',
   'Kept|'+acctDays(C.days)+'|'+(AV_TURN*AV_TURNS*AV_CYCLES)+' days for three cycles','Ritual to avatar')+'>'
  +'<div class="rv-cys">'+rings+'</div>'
  +'<div class="rv-avfig"><b>'+(C.days?C.days+'<small>'+(C.days===1?' day':' days')+'</small>':'–')+'</b><span>kept</span></div></div>';
 var rows=(typeof avRows==='function')?avRows():[], seat={};
 rows.forEach(function(x){if(x.gap&&x.gap.seat)seat[x.gap.seat]=x;});
 var seats=BANDS.filter(function(b){return seat[b];});
 var list='';
 if(!rows.length)list='<p class="rv-empty">Your avatar has no stories yet.</p>'
  +'<div class="rv-acts"><button type="button" class="btn" data-act="go-avatar">Open the avatar</button></div>';
 else if(!seats.length)list='<p class="rv-empty">Your avatar\'s stories do not read at a seat yet.</p>';
 else list='<ul class="rv-avl">'+seats.map(function(b,i){
  var x=seat[b], A=(typeof AV_OF!=='undefined'&&AV_OF[b])||{nm:b,about:'',k:''};
  var fed=st.act.filter(function(p){return p.band===b||p.tags.indexOf(b)>=0;});
  var ar=A0&&A0.areas&&A0.areas[A.k], ap=ar&&ar.pct!=null?Math.round(ar.pct*100):null;
  var said=x.gap.clear?'Clear at this seat.'
   :fed.length?'Fed by '+fed.map(function(p){return ritName(p.steps);}).join(', ')+'.':'No ritual at this seat yet.';
  return '<li class="rv-avs'+(fed.length?' rv-fed':'')+'" style="--c:'+seatCol(b)+';--i:'+i+'"'
   +rvTip(A.nm+', at '+ritThe(b),'"'+String(x.pair.be).replace(/^"+|"+$/g,'')+'" '+said,
    ap===null?'':'Complete|'+ap+'%|100%',A.about)+'>'
   +crBadge(b,ap||0,{size:'md', glyph:(typeof AV_IC!=='undefined'&&AV_IC[A.k])||SEATGLYPH[b], raw:ap===null?'–':ap+'%'})
   +'<span class="rv-avn">'+esc(A.nm)+'</span><i class="rv-avd" aria-hidden="true"></i></li>';}).join('')+'</ul>';
 return '<section class="rv-sec rv-c rv-c-av" data-slot="top-left"><div class="rv-hd"><span class="rv-h">Ritual to avatar</span></div>'
  +'<p class="rv-mean">Your avatar\'s percent complete, the cycles your kept days turn, and each seat your avatar has a story at.</p>'
  +'<div class="rv-avw">'+hero+cyc+'</div>'+list+'</section>';}
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

/* ---------------- practice analytics ----------------
   GONE AS A CARD, round QX. Its two thirty day charts, kept by seat and
   minutes by week, are Success over time now (ui/ritcal.js), for whichever of
   his ten spans is picked, and the chain from story to goal moved with them.
   A second drawing of the same days beside it would be one page saying a
   thing twice. */

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
/* ROUND QX: the middle slot is Goals, the Active list as its Today with the
   week and the month beside it, and the last slot is Success over time, his
   ten spans. Both are ui/ritcal.js. */
function ritStageHtml(st,P){
 return '<div class="rv-six">'+ritAvHtml(st)+ritGoalHtml(st)+ritGoalsHtml(st,P)+ritOkHtml(st)+ritKeepHtml(st)
  +ritSuccessHtml(st,P.chain)+'</div>';}

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
  '.rv-cys{display:flex;gap:10px}',
  '.rv-cy{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:12.5px;color:var(--mid)}',
  '.rv-cy-t{fill:none;stroke:var(--edge-2);stroke-width:3;stroke-linecap:round;opacity:.7}',
  '.rv-cy-a{fill:none;stroke:var(--k);stroke-width:3.4;stroke-linecap:round}',
  '.rv-cy-ok{fill:none;stroke:var(--k);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-cy.rv-cur .rv-cy-a{animation:rvGlow var(--t-breath) var(--ease-breath) infinite alternate}',
  '.rv-cy.rv-cur span{color:var(--ink);font-weight:600}',
  '@keyframes rvGlow{from{opacity:.62}to{opacity:1}}',
  '.rv-avl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
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
  '.rv-arrive .rv-okb i,.rv-arrive .rv-sbt i{animation:rvGrow .8s cubic-bezier(.22,1,.36,1) both}',
  '.rv-arrive .rv-wkb i{animation:rvRise .8s cubic-bezier(.22,1,.36,1) both}',
  '@keyframes rvGrow{from{transform:scaleX(0)}} @keyframes rvRise{from{transform:scaleY(0)}}',
  '.rv-okb i,.rv-sbt i{transform-origin:left center} .rv-wkb i{transform-origin:bottom center}',
  /* ---- ROUND QS: symbol first, the tell on the press ---- */
  /* a ring drawn by cr() or crBadge() takes its colour as an attribute, which
     cannot read a token; the page's own colour is a token (var(--k), the
     accent), so the arc and the glyph read --c from the sheet instead. Same
     value for a seat hex, and the right one for a token. */
  '.rv .crb-a circle:last-child,.rv .cr .arc circle:last-child{stroke:var(--c)}',
  /* the folded sentence, and the heading that carries it now */
  '.rv-mean.rv-told{display:none}',
  '.rv-h.rv-hq{cursor:help;text-decoration:underline dotted color-mix(in srgb,var(--k) 70%,var(--edge-2));text-underline-offset:4px;text-decoration-thickness:1px;border-radius:4px}',
  '.rv-h.rv-hq:focus-visible,.rv-pc:focus-visible,.rv-avs:focus-visible,.rv-avhero:focus-visible,.rv-avc:focus-visible,.rv-cb:focus-visible,.rv-m:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  /* a ritual's badge on its row: the seat's mark, percent complete, the pill */
  '.rv-pc{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;min-width:44px;min-height:44px;margin-right:6px;cursor:help;border-radius:12px}',
  '.rv-tgi{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;border:1.5px solid var(--t);font-style:normal}',
  '.rv-tgi svg{width:11px;height:11px;fill:none;stroke:var(--t);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
  /* the builder\'s rituals wear their seat: a wash and an edge in its colour,
     not only the stripe at the left */
  '.rv-item{background:color-mix(in srgb,var(--c) 7%,var(--panel-2));border-color:color-mix(in srgb,var(--c) 30%,var(--edge))}',
  /* ritual to avatar, the picture */
  '.rv-c-av .rv-avw{display:flex;align-items:center;gap:16px;margin:2px 0 14px;flex-wrap:wrap}',
  '.rv-avhero{display:flex;flex-direction:column;align-items:center;gap:6px;margin-right:26px;cursor:help;border-radius:14px;padding:2px}',
  '.rv-avhero .cr.hero{--c:var(--k);margin:0 0 12px}',
  '.rv-avhero .cr.hero .v{font-size:16px;height:24px;line-height:24px;padding:0 8px;min-width:0}',
  '.rv-avhero .cr.hero .ring .gl svg{width:28px;height:28px;stroke-width:1.6}',
  '.rv-avhl{font-size:12.5px;color:var(--mid);font-weight:600}',
  '.rv-avc{display:flex;flex-direction:column;gap:6px;cursor:help;border-radius:12px;padding:2px}',
  '.rv-c-av .rv-cys{gap:8px}',
  '.rv-c-av .rv-cy svg{width:46px;height:46px}',
  '.rv-c-av .rv-avfig{display:flex;align-items:baseline;gap:6px;min-width:0}',
  '.rv-c-av .rv-avfig b{font-size:20px;font-weight:600;color:var(--k);font-variant-numeric:tabular-nums}',
  '.rv-c-av .rv-avfig small{font-size:13px;font-weight:400;color:var(--mid)}',
  '.rv-c-av .rv-avfig span{font-size:13px;color:var(--mid)}',
  '.rv-c-av .rv-avl{flex-direction:row;flex-wrap:wrap;gap:6px}',
  '.rv-c-av .rv-avs{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 6px 7px;border:0;border-radius:12px;min-width:84px;cursor:help;',
  ' background:color-mix(in srgb,var(--c) 8%,transparent);transition:background var(--t-micro) var(--ease-out)}',
  '.rv-c-av .rv-avs:hover{background:color-mix(in srgb,var(--c) 15%,transparent)}',
  '.rv-c-av .rv-avn{font-size:13px;font-weight:600;color:var(--ink)}',
  '.rv-avd{width:7px;height:7px;border-radius:50%;border:1.5px solid var(--c);opacity:.7}',
  '.rv-avs.rv-fed .rv-avd{background:var(--c);opacity:1}',
  /* the suggestions, coloured by the seat or the pattern they are for */
  '.rv-sg1{background:color-mix(in srgb,var(--c) 9%,var(--panel-2));border-color:color-mix(in srgb,var(--c) 40%,var(--edge));box-shadow:none}',
  '.rv-sgh{align-items:center;justify-content:flex-start;gap:8px}',
  '.rv-sgs{flex:0 0 auto;display:inline-flex;min-width:44px;min-height:44px;padding:0;border:0;border-radius:12px;background:none;cursor:pointer;color:inherit}',
  '.rv-sgs:hover .crb-a circle:first-child{stroke:color-mix(in srgb,var(--c) 40%,transparent)}',
  '.rv-sgs:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-sgt0{display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex:1 1 auto;min-width:0}',
  '.rv-sg0{margin:4px 0 0;font-size:13px;line-height:1.4;color:var(--mid);overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
  '.rv-sgx{margin:6px 0 8px;padding:8px 10px;border-radius:10px;background:color-mix(in srgb,var(--c) 7%,var(--panel))}',
  '.rv-sgx[hidden]{display:none}',
  '.rv-sg1 .rv-sgw{margin:0}',
  '.rv-sgr{margin:6px 0 0;font-size:13px;line-height:1.5;color:var(--dim)}',
  '.rv-sg1.rv-open .rv-sgx{animation:rvOpen .22s cubic-bezier(.22,1,.36,1) both}',
  '@keyframes rvOpen{from{opacity:0;transform:translateY(-4px)}}',
  '.rv-sgf{margin-top:8px}',
  '.rv-sg1 .rv-tg{gap:5px;padding:2px 9px 2px 6px;color:var(--ink);background:color-mix(in srgb,var(--t) 12%,transparent)}',
  '.rv-tg svg{width:12px;height:12px;fill:none;stroke:var(--t);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}',
  '.rv-sg1 .btn{border-color:color-mix(in srgb,var(--c) 45%,var(--edge-2))}',
  /* the thirty days as cubes */
  '.rv-cbf{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 16px;margin:0 0 12px;font-size:13px;color:var(--mid)}',
  '.rv-cbf b{font-size:17px;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums}',
  '.rv-cbf .rv-cbk b{font-size:30px;color:var(--k);line-height:1}',
  '.rv-cubes{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px;max-width:340px;margin:0 auto 10px}',
  '.rv-cb{position:relative;aspect-ratio:1/1;border-radius:7px;background:color-mix(in srgb,var(--edge-2) 30%,transparent);cursor:help}',
  '.rv-cubes0 .rv-cb{cursor:default}',
  /* a kept day is a cube: the top lit, the foot in shade, so it sits on the
     panel rather than being printed on it */
  '.rv-cb-done{box-shadow:inset 0 1.5px 0 rgba(255,255,255,.28),inset 0 -4px 0 rgba(0,0,0,.30),0 2px 6px -2px color-mix(in srgb,var(--c) 70%,transparent)}',
  '.rv-cb-plan{background:color-mix(in srgb,var(--c) 12%,transparent);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--c) 70%,transparent)}',
  '.rv-cb-miss{background:none;box-shadow:inset 0 0 0 1.5px transparent;outline:1.5px dashed var(--dim);outline-offset:-1.5px}',
  '.rv-cb-now::after{content:"";position:absolute;left:50%;bottom:-6px;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:var(--ink)}',
  /* today, set and not yet kept, breathes until it is: the product's own
     breath, on the opacity of a ring laid over the cube, so the compositor
     carries it and nothing repaints */
  '.rv-cb-now.rv-cb-plan::before{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 2px var(--c);',
  ' animation:rvNowCb var(--t-breath) var(--ease-breath) infinite alternate}',
  '@keyframes rvNowCb{from{opacity:.2}to{opacity:1}}',
  '.rv-cbm{position:absolute;top:-6px;right:-6px;display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;',
  ' background:var(--panel);border:1.5px solid var(--c);color:var(--c);z-index:1}',
  '.rv-cbm+.rv-cbm{right:auto;left:-6px}',
  '.rv-cbm svg{width:11px;height:11px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-key .rv-k-cube,.rv-key .rv-k-cplan,.rv-key .rv-k-cmiss{border-radius:3px;border:0;background:var(--sec-embody);box-shadow:inset 0 -2px 0 rgba(0,0,0,.3)}',
  '.rv-key .rv-k-cplan{background:none;box-shadow:inset 0 0 0 1.5px var(--sec-embody);opacity:1}',
  '.rv-key .rv-k-cmiss{background:none;box-shadow:none;outline:1.5px dashed var(--dim);outline-offset:-1.5px}',
  '.rv-loopw .rv-marks{margin:14px 0 0;padding-top:12px;border-top:1px solid color-mix(in srgb,var(--k) 25%,var(--edge))}',
  '.rv-loopw .rv-m{cursor:help;background:color-mix(in srgb,var(--c) 10%,transparent)}',
  /* motion. The cubes land as a wave that runs from the oldest corner to
     today, row plus column at 32ms, so thirty cubes read as one event and not
     thirty: a quick rise with a small overshoot, 240ms, on transform and
     opacity only, which the compositor carries. The marks land after their
     cube, a beat later and with more overshoot, because they are the news.
     Under reduced motion shell/head.html stills every animation and the end
     state is what is drawn. */
  '.rv-arrive .rv-cb{animation:rvCube .24s cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(var(--i,0) * 32ms)}',
  '@keyframes rvCube{from{opacity:0;transform:translateY(6px) scale(.72)}}',
  '.rv-arrive .rv-cbm{animation:rvPin .32s cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(var(--i,0) * 32ms + 260ms + var(--k,0) * 80ms)}',
  '@keyframes rvPin{from{opacity:0;transform:scale(.2)}}',
  '.rv-arrive .rv-m{animation:rvPin .32s cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(560ms + var(--i,0) * 70ms)}',
  '.rv-arrive .rv-avs{animation:rvCube .26s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(120ms + var(--i,0) * 70ms)}'
  /* NO REDUCED MOTION RULE HERE, and that is on purpose: shell/head.html
     already stills every animation in the product under
     prefers-reduced-motion, '*{animation:none!important}'. A second rule
     here would be a second place to keep in step. FT23 holds the page to it. */
 ].join('\n');
 document.head.appendChild(st);}
