/* ============================================================
   ACCOUNTABILITY. The right column of the Ritual page. Ritual is what a
   person will do, and this is what they did.

   THIS SURFACE HAS MOVED THREE TIMES AND THE THIRD IS THE ONE IT IS ON. Round
   JQ built it inside the Ritual page ("attach the accountability tracker to
   it"). Round PO, 2 October, pulled it out into a tool set with a door of its
   own ("you're supposed to move accountability to its own tool set"). Round
   QF, the same day, put it back as a column: "we're re-merging the knowledge
   base and the accountability tracker ... Right side of the menu is for the
   accountability tracker. Center piece is for the ritual."

   So it has no host on the stage and no door. TAB.ACCOUNT keeps integer 14,
   folded onto TAB.RITUAL in engine/core.js, and what this file draws goes into
   #flowside in the right rail, written by ritRender on every paint. The rules
   are in DESIGN-flow-tools.md and each one names its gate.

   WHAT IT READS, and it reads three things and invents none of them.
     the plans   ritPlans, beside the record under their own key. What is
                 committed to, on which days, until when.
     the record  CURP.rituals, one entry a day a ritual was set or done. What
                 was done.
     the ladder  ladderRead, the streak and the minutes. The one streak in the
                 product, so this page cannot disagree with the Summary.
   A number printed here is a count of days or minutes taken off those three.
   There is no percent, no score and no rate on this page, which is the ruling
   for every surface that shows a record: a person who missed three days of
   fourteen is told three days, never a grade.

   WHAT IT WRITES. Marking a day done or taking it off, and deleting an entry
   and putting it back. Nothing else, and all of it through ritWrite, so a
   save that fails says so through status() and keeps nothing, and a worked
   example is refused by name. It does not start or change a ritual: that is
   Ritual's menu, and Edit on a missed ritual sends the person there with the
   ritual already open.

   WHERE EACH THING SITS, and the order is what a person came for. Due today
   first, because the one thing they open this page to do is press a ring.
   Done second, the streak and the figures, which is the answer to whether it
   is holding. Missed third. The record last, because a month is a thing to
   read once the day is marked and not before.

   A MISS IS NOT A VERDICT. engine/practice.js says it in PR_MISS_AT and the
   TDD says it in section 24: "Repeated failure should trigger investigation
   rather than punishment." So a ritual missed PR_MISS_AT days or more in the
   window offers Edit and says what editing is for, and a ritual missed fewer
   times is only counted. The reason a day was missed is not asked here: the
   practice domain has the classes (PR_MISS) and the profile has nowhere to
   keep one yet, and a control that took an answer and dropped it would be
   the status lie. Reported, not built.
   ============================================================ */

/* how far back a miss is counted. Two weeks is the longest span the builder
   offers (RIT_SPANS), so a ritual still running was started inside the window
   or earlier, and what was missed in it is what a person can still change. */
var ACCT_SPAN=14;

/* THE DAYS A RITUAL WAS DUE AND NOT DONE, read off ritDaySegs and not worked
   out a second way. The month on this same page draws a dashed ring for a
   missed piece and this counts exactly those, so the number and the picture
   cannot disagree about a day. A day counts once however many entries it
   holds for the same steps. */
function acctMissed(p,today){
 var k=ritKey(p.steps), n=0;
 for(var d=today-ACCT_SPAN;d<today;d++){
  var hit=ritDaySegs(d,[p],today).some(function(s){
   return s.st==='miss'&&ritKey(s.x?s.x.steps:s.p.steps)===k;});
  if(hit)n++;}
 return n;}

function acctDays(n){return n+(n===1?' day':' days');}

/* DUE TODAY. The rituals whose day this is, each with the ring that marks it
   done, the same press and the same writer as the ring on the Active list. A
   ritual kept on other days is active but is not due, and a Tuesday is not a
   missed Monday, so it is not listed. */
function acctDueHtml(st){
 var due=st.act.filter(function(p){return ritDue(p,st.today);}), body='';
 /* one exit and the body built in branches, because the build's div balance
    check counts the markup in the source text and a function that closes its
    card on three different returns reads as three closes for one open */
 /* NOTHING ACTIVE, AND THE WAY OUT IS ONE PRESS AND NOT A PAGE. This offered
    Open Ritual while Accountability was a page of its own. The builder is the
    left column of this same page now, so the press opens it where it stands:
    naming a column would have been wrong anyway, because on a phone the
    columns stack and the left one is not on the left. */
 if(!st.act.length)
  body='<p class="rv-empty">Nothing active yet.</p>'
   +'<div class="rv-acts"><button type="button" class="btn" data-act="add">New ritual</button></div>';
 else if(!due.length)body='<p class="rv-empty">Nothing due today.</p>';
 else{
  body='<ol class="rv-list">';
  due.forEach(function(p){
   var e=ritEntryFor(p,st.today), d=!!(e&&ritIsDone(e.x)), col=ritCol(p);
   body+='<li class="rv-item'+(d?' rv-done':'')+'" style="--c:'+col+'"><div class="rv-row">'
    +'<button type="button" class="rv-log" data-act="log" data-id="'+p.id+'" aria-pressed="'+d+'" aria-label="'
    +(d?'Done today. Press to take it off':'Mark '+esc(ritName(p.steps))+' done today')+'">'+ritRingHtml(p,d,col)+'</button>'
    +'<span class="rv-txt"><span class="rv-nm">'+esc(ritName(p.steps))+'</span>'
    +'<span class="rv-sub">'+(d?'Done today':'Planned for today')+'<i>'+esc(ritLeft(p,st.today))+'</i></span></span>'
    +ritPctHtml(p,st.today)+'</div></li>';});
  body+='</ol>';}
 return '<div class="rv-sec rv-act"><div class="rv-hd"><span class="rv-h">Due today</span>'
  +(due.length?'<span class="rv-min">'+due.length+(due.length===1?' ritual':' rituals')+'</span>':'')+'</div>'
  +'<p class="rv-mean">Rituals set for today. Press the ring when you have done one.</p>'+body+'</div>';}

/* MISSED. Active rituals only: one that has ended or been stopped is not a
   thing a person can still change. Most missed first, because that is the one
   that wants looking at. */
function acctMissHtml(st){
 var rows=st.act.map(function(p){return {p:p, n:acctMissed(p,st.today)};})
  .filter(function(x){return x.n>0;}).sort(function(a,b){return b.n-a.n;});
 var body='', again=false;
 if(!rows.length)
  body='<p class="rv-empty">'+(st.act.length?'Nothing missed in the last '+ACCT_SPAN+' days.':'Nothing to miss yet.')+'</p>';
 else{
  body='<ul class="rv-days">';
  rows.forEach(function(x){
   var edit=x.n>=PR_MISS_AT; if(edit)again=true;
   body+='<li class="rv-dr" style="--c:'+ritCol(x.p)+'"><i class="rv-dot rv-s-miss"></i>'
    +'<span class="rv-dn">'+esc(ritName(x.p.steps))+' <small>'+acctDays(x.n)+' missed</small></span>'
    +(edit?'<button type="button" class="btn" data-act="miss-edit" data-id="'+x.p.id+'" aria-label="Edit '
      +esc(ritName(x.p.steps))+'">Edit</button>':'')
    +'</li>';});
  body+='</ul>';
  /* said once under the list, and only when a row offers Edit: what editing
     is for. Mechanical, and it blames nobody. */
  if(again)body+='<p class="rv-mean">A ritual missed this often does not fit your days. Edit it: make it shorter, or move its days.</p>';}
 return '<div class="rv-sec rv-miss"><div class="rv-hd"><span class="rv-h">Missed</span></div>'
  +'<p class="rv-mean">Days a ritual was due and not marked done, in the last '+ACCT_SPAN+' days.</p>'+body+'</div>';}

/* DONE, on the stage. The rings are what is due today and the figures are the
   ladder's own: the streak is the product's one streak, and the same numbers
   are printed by the Summary because the same function reads them. What each
   figure means is said under them in the same place, the unpack rule. */
function acctDoneHtml(st){
 return '<div class="rv-sec rv-done"><div class="rv-hd"><span class="rv-h">Done</span></div>'
  +ritTodayHtml(st.act.filter(function(p){return ritDue(p,st.today);}),st.today,st.L)
  +'<p class="rv-mean">Streak is your current run of days with a ritual on the record. One skipped day is forgiven and a longer gap halves it. '
  +'Best is your longest run with no gap. Kept is the days you marked a ritual done. Practised is the minutes you put in.</p>'
  /* the earned marks stay here, with the record that earned them. The next one
     moved to the Ongoing goal card in the centre, round QN, because the next
     mark is a goal and that card is where he asked the goal to sit. */
  /* ROUND QS: the earned marks moved to the cubes, pinned to the day each was
     earned, his "achievements and badges ... attached to it". Shown once. */
  +'</div>';}

/* ---------------- THE THIRTY DAY LOOP, round QN ----------------
   His words: "on the accountability tracker slide on the right hand side the
   thirty day loop." A loop and not a list, which is his standing ruling for
   anything that turns ("we're showing a core game loop mechanic"): thirty
   days round one circle, the oldest just after the top and running clockwise,
   and today closing it at the top. One track round the loop per ritual,
   outermost first, the same ring grammar the month and the Active row already
   use, so solid is done, faint is planned and dashed is missed everywhere on
   the page. A small mark outside the loop falls every seven days back from
   today, because seven kept days are one turn of the avatar (avCycles).

   It reads ritDaySegs, the month's own read of a day, and nothing else, so
   the loop and the month cannot disagree about a day. The summary under it is
   counts of days and minutes, never a rate: the ruling for every surface that
   shows a record. */
var ACCT_LOOP=30, ACCT_RINGS=4;
var ACCT_RANK={done:4, plan:3, miss:2, ahead:1};
function acctLoopRead(st){
 var today=st.today, t0=today-ACCT_LOOP+1, by={}, keys=[];
 var get=function(k,col,nm){
  if(!by[k]){by[k]={k:k, col:col, nm:nm, days:{}, last:-1, act:false}; keys.push(by[k]);}
  return by[k];};
 st.act.forEach(function(p){get(ritKey(p.steps),ritCol(p),ritName(p.steps)).act=true;});
 var kept={}, miss={}, mins=0;
 for(var d=t0;d<=today;d++)ritDaySegs(d,st.plans,today).forEach(function(s){
  var R=get(ritKey(s.x?s.x.steps:s.p.steps),s.col,s.nm), was=R.days[d];
  if(!was||ACCT_RANK[s.st]>ACCT_RANK[was])R.days[d]=s.st;
  if(s.st!=='ahead'&&d>R.last)R.last=d;
  if(s.st==='done'){kept[d]=1; mins+=(s.x&&+s.x.min)||0;}
  if(s.st==='miss')miss[d]=1;});
 var used=keys.filter(function(R){return R.last>=0;})
  .sort(function(a,b){return (b.act-a.act)||(b.last-a.last);});
 return {t0:t0, today:today, rings:used.slice(0,ACCT_RINGS), more:Math.max(0,used.length-ACCT_RINGS),
  n:used.length, kept:Object.keys(kept).length, miss:Object.keys(miss).length, mins:mins};}
/* ---------------- THE THIRTY DAYS AS CUBES, round QS ----------------
   His words, 3 October: "the accountability should have the the 30 days of
   cubes showing my progression and my achievements and badges and whatnot
   attached to it".

   THE CUBES REPLACE THE RING, and that is a judgment and is said as one. The
   ring of round QN and these cubes are two drawings of one read, and one page
   says a thing once, so the picture changed and the read did not: every cube
   is ritDaySegs for its day, the month's own read, exactly as each piece of
   the ring was. The heading stays his name for it, Thirty day loop.

   ONE CUBE A DAY, seven to a row and today last, at the lower right, so the
   page reads oldest to newest the way a person reads, and a row is a week
   counted back from today. A day kept is a solid cube in the seat colour of
   every ritual kept on it, side by side; planned and not yet done is its
   outline; missed is dashed; a day nothing was set for is the empty socket.
   The same grammar as the month and the rings: solid is done, faint is
   planned, dashed is missed.

   THE MARKS ARE PINNED TO THE DAY THAT EARNED THEM. markDays (engine/ladder.js)
   dates each earned practice mark off the record, and a mark whose day falls
   in the thirty sits on that cube, in its own seat colour with its own icon.
   Every earned mark is on the shelf under the cubes, each with its meaning and
   its date on the press. Only earned marks: the next one is the Ongoing goal
   card's, and the rest are never listed (engine/ladder.js, "never how many of
   how many").

   Nothing here is a rate. The figures over the cubes are counts of days and
   minutes, the ruling for every surface that shows a record. */
var ACCT_COLS=7;
function acctCubeRead(st){
 var today=st.today, t0=today-ACCT_LOOP+1, out=[];
 var md=(typeof markDays==='function')?markDays(CURP,Date.now()):{}, pin={};
 (st.L.earned||[]).forEach(function(m){var d=md[m.k]; if(d!=null&&d>=t0&&d<=today)(pin[d]=pin[d]||[]).push(m);});
 for(var d=t0;d<=today;d++){
  var X={d:d, done:[], miss:[], plan:[], marks:pin[d]||[]}, seen={};
  ritDaySegs(d,st.plans,today).forEach(function(s){
   var k=s.st+'|'+s.nm; if(seen[k])return; seen[k]=1;
   if(s.st==='done')X.done.push(s); else if(s.st==='miss')X.miss.push(s); else if(s.st==='plan')X.plan.push(s);});
  X.st=X.done.length?'done':X.plan.length?'plan':X.miss.length?'miss':'none';
  out.push(X);}
 return {days:out, md:md};}
function acctCubeHtml(X,i,n,today,empty){
 var j=n-1-i, row=Math.floor((n-1)/ACCT_COLS)-Math.floor(j/ACCT_COLS)+1, col=ACCT_COLS-(j%ACCT_COLS);
 var nm=function(a){return a.map(function(s){return s.nm;}).join(', ');};
 var bg='';
 if(X.done.length){var w=100/X.done.length;
  bg=';background:linear-gradient(90deg,'+X.done.map(function(s,k){return s.col+' '+(k*w).toFixed(1)+'% '+((k+1)*w).toFixed(1)+'%';}).join(',')+')';}
 var c=(X.done[0]||X.plan[0]||X.miss[0]||{}).col||'var(--accent)';
 var said=[X.done.length?'Done: '+nm(X.done)+'.':'', X.plan.length?'Planned: '+nm(X.plan)+'.':'',
  X.miss.length?'Missed: '+nm(X.miss)+'.':'', X.marks.length?'Earned '+X.marks.map(function(m){return m.nm;}).join(', ')+'.':'']
  .filter(Boolean).join(' ')||'Nothing was set for this day.';
 var day=ritDayName(X.d,today);
 return '<span class="rv-cb rv-cb-'+X.st+(X.d===today?' rv-cb-now':'')+'" style="grid-row:'+row+';grid-column:'+col
  +';--c:'+c+';--i:'+(row+col)+bg+'"'
  /* AN EMPTY RECORD IS A PICTURE AND NOT THIRTY PRESSES, the month's own rule
     (ritRecordHtml): on a first visit the sockets show what will fill and are
     not each a carrier to tab through */
  +(empty?' aria-hidden="true"':rvTip(day,said)+' aria-label="'+esc(day+'. '+said)+'"')+'>'
  +X.marks.map(function(m,k){return '<i class="rv-cbm" style="--c:'+seatCol(m.b)+';--k:'+k+'" aria-hidden="true">'
   +'<svg viewBox="0 0 24 24"><path d="'+m.ic+'"/></svg></i>';}).join('')+'</span>';}
/* the earned marks, each a carrier: its name, its meaning, and its date when
   the record dates it. The shelf is ritMarksHtml's circle, the ladder's own
   icon in its family's seat colour, ring not fill. */
function acctShelfHtml(L,md,today){
 if(!L.earned.length)return '<div class="rv-marks"><span class="rv-lb">Marks</span>'
  +'<p class="rv-empty">None yet. A mark is earned from your record, never bought.</p></div>';
 return '<div class="rv-marks"><span class="rv-lb">Marks</span><div class="rv-mk">'
  +L.earned.map(function(m,i){var d=md[m.k];
   return '<span class="rv-m" style="--c:'+seatCol(m.b)+';--i:'+i+'"'
    +rvTip(m.nm,m.d+(d!=null?' Earned '+String(ritDayName(d,today)).replace(/^(Today|Yesterday)$/,function(x){return x.toLowerCase();})+'.':''),'',m.fam)+'>'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+m.ic+'"/></svg></span>';}).join('')+'</div></div>';}
/* NAMED IN HIS WORDS, "the thirty day loop", round QN. It read Thirty days,
   which is also the name of a ladder mark (thirty in a row) shown on the
   Ongoing goal card on the same screen: one word for two things. */
function acctLoopHtml(st){
 var L=acctLoopRead(st), Q=acctCubeRead(st), n=Q.days.length;
 var empty=!st.plans.length&&!((CURP&&CURP.rituals)||[]).length;
 var figs='<div class="rv-cbf"><span class="rv-cbk"><b>'+(L.kept||'–')+'</b> '+(L.kept===1?'day':'days')+' kept</span>'
  +'<span><b>'+(L.miss||'–')+'</b> missed</span><span><b>'+(L.mins||'–')+'</b> min</span></div>';
 return '<div class="rv-sec rv-loopw"><div class="rv-hd"><span class="rv-h">Thirty day loop</span></div>'
  +'<p class="rv-mean">The last thirty days as cubes, a week to a row and today last. A solid cube is a day you kept a ritual, '
  +'in the colour of its seat; an outline is planned; dashed is missed. A mark on a cube is one you earned that day.</p>'
  +figs+'<div class="rv-cubes'+(empty?' rv-cubes0':'')+'" role="group" aria-label="The last thirty days">'
  +Q.days.map(function(X,i){return acctCubeHtml(X,i,n,st.today,empty);}).join('')+'</div>'
  +'<div class="rv-key" aria-hidden="true"><span><i class="rv-k-cube"></i>Done</span><span><i class="rv-k-cplan"></i>Planned</span>'
  +'<span><i class="rv-k-cmiss"></i>Missed</span></div>'
  +acctShelfHtml(st.L,Q.md,st.today)+'</div>';}

/* ---------------- HISTORY, round QN ----------------
   His words: "I want to be able to track my accountability history. I want my
   ritual history and the cards that I've done so far. Which I can always put a
   card from there back in rotation."

   ONE CARD PER RITUAL EVER RUN, read off the two stores that already hold it
   and no third: the plans beside the record (ritPlans, active and ended) and
   the record itself (CURP.rituals), grouped by the steps they carry, which is
   how the page already decides two entries are the same ritual (ritKey). The
   practice domain (engine/practice.js) holds no ritual events, because nothing
   writes them yet, and a second history built beside these two would be two
   answers to "what did I do".

   BACK IN ROTATION is one press and goes through ritStartPlan, the writer the
   builder and the Compass use, so it starts again from today for the span it
   ran last, carrying its seat, tags, days and timer, and reports through
   status(). It replaces the Record list's Ended rows and their Again press,
   which were the same choice under a second name. */
function acctHistRead(st){
 var by={}, out=[], today=st.today;
 var get=function(k,steps){
  if(!by[k]){by[k]={k:k, steps:steps.slice(), days:{}, last:null, plan:null, act:false, band:''}; out.push(by[k]);}
  return by[k];};
 st.plans.forEach(function(p){var H=get(ritKey(p.steps),p.steps);
  if(!H.plan||ritStart0(p)>=ritStart0(H.plan))H.plan=p;
  if(ritActive(p,today))H.act=true;
  var s=ritStart0(p); if(H.last===null||s>H.last)H.last=s;});
 ((CURP&&CURP.rituals)||[]).forEach(function(x){
  if(!x||!Array.isArray(x.steps)||!x.steps.length)return;
  var d=pracDay(x.t); if(d===null)return;
  var H=get(ritKey(x.steps),x.steps);
  if(!H.band&&x.band&&BANDS.indexOf(x.band)>=0)H.band=x.band;
  if(ritIsDone(x))H.days[d]=1;
  if(H.last===null||d>H.last)H.last=d;});
 return out.filter(function(H){return H.steps.every(function(k){return !!ritPr(k);});})
  .map(function(H){var ds=Object.keys(H.days).map(Number);
   H.kept=ds.length; H.lastDone=ds.length?Math.max.apply(null,ds):null;
   H.col=H.plan?ritCol(H.plan):(H.band?seatCol(H.band):'var(--accent)');
   H.nm=ritName(H.steps); return H;})
  .sort(function(a,b){return (b.act-a.act)||((b.last||0)-(a.last||0));});}
function acctHistHtml(st){
 var list=acctHistRead(st); RIT.hist=list;
 var body;
 if(!list.length)body='<p class="rv-empty">Nothing on the record yet.</p>';
 else{
  body='<ul class="rv-hl">'+list.slice(0,RIT.hh).map(function(H,i){
   var last=H.lastDone===null?'never kept':'last kept '+String(ritDayName(H.lastDone,st.today)).replace(/^(Today|Yesterday)$/,function(m){return m.toLowerCase();});
   return '<li class="rv-hc'+(H.act?' rv-hon':'')+'" style="--c:'+H.col+'">'
    +'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="13" class="rv-track" style="stroke-width:4"/>'
    +ritArcs(20,20,13,H.steps.map(function(){return {col:H.col, st:H.kept?'done':'plan'};}),4)+'</svg>'
    +'<span class="rv-hct"><span class="rv-hcn">'+esc(H.nm)+'</span><span class="rv-hcs">Kept '+acctDays(H.kept)+', '+esc(last)+'</span></span>'
    +(H.act?'<span class="rv-tag" style="--c:'+H.col+'">Active</span>'
     :'<button type="button" class="btn" data-act="rot" data-i="'+i+'" aria-label="Put '+esc(H.nm)+' back in rotation">Back in rotation</button>')
    +'</li>';}).join('')+'</ul>';
  if(list.length>RIT.hh)body+='<button type="button" class="rit-more" data-act="hmore">Show more</button>';}
 return '<div class="rv-sec rv-hist"><div class="rv-hd"><span class="rv-h">History</span></div>'
  +'<p class="rv-mean">Every ritual you have run, active first and then the most recent, with the days you kept it. '
  +'One that has ended goes back into rotation with one press, from today, for the span it ran last.</p>'+body+'</div>';}
function acctRotate(i){
 var H=(RIT.hist||[])[i]; if(!H)return false;
 var p=H.plan, span=(p&&RIT_SPAN_D.indexOf(p.days)>=0)?p.days:7;
 var sp=RIT_SPANS.filter(function(s){return s.d===span;})[0];
 return ritStartPlan({steps:H.steps, band:p?p.band:H.band, track:p?p.track:'', days:span,
  when:p?p.when:'', where:p?p.where:'', rel:(p&&p.rel!=null&&BY[p.rel])?p.rel:null,
  tc:(p&&p.tc&&typeof becomingOf==='function'&&becomingOf(p.tc))?p.tc:null,
  tags:p?p.tags:null, on:p?p.on:null, tm:p?p.tm:null},
  'Back in rotation. '+H.nm+(span?', '+sp.nm.toLowerCase()+' from today.':', with no end.'));}

/* THE WHOLE COLUMN, AS ONE STRING, and ritRender writes it. It returns markup
   rather than painting a host of its own, because there is no host of its own
   any more: the four parts are the right rail's contents and the rail is a
   sibling of the stage, so the stage's paint cannot delete them. The read is
   handed in, so this column and the centre cannot disagree about the day.

   The worked example note is not repeated here. The centre already carries it
   once, ritNote in ui/ritual.js, and one page says a thing once. */
/* ROUND QN put two parts in it, and the order is still what a person came for:
   Due today first, the press; then the thirty day loop with its summary, which
   is the answer to whether it is holding at a glance; Done and Missed, the
   figures under it; History, the rituals as cards; the Record last, the month
   and the list a person reads day by day. */
function acctSideHtml(st,arrive){
 return '<div class="rvr-wrap'+(arrive?' rv-arrive':'')+'">'+acctDueHtml(st)+acctLoopHtml(st)+acctDoneHtml(st)+acctMissHtml(st)
  +acctHistHtml(st)+ritRecordHtml(st.plans,st.today)+'</div>';}
