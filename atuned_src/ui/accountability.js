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

   WHERE EACH THING SITS, and the order is what a person came for. Since
   SV19: the streak strip at the top of the rail, above the menu's name; the
   thirty days; then History, one press, which opens the rituals as cards and
   the Record. Done and Missed are no longer cards, below, and Due today went
   to the week in SV17.

   A MISS IS NOT A VERDICT. engine/practice.js says it in PR_MISS_AT and the
   TDD says it in section 24: "Repeated failure should trigger investigation
   rather than punishment." So a miss is counted and never coloured as a
   failure, and Edit is one press from the ritual's own row. The reason a day was missed is not asked here: the
   practice domain has the classes (PR_MISS) and the profile has nowhere to
   keep one yet, and a control that took an answer and dropped it would be
   the status lie. Reported, not built.
   ============================================================ */

/* THE PER RITUAL MISS COUNT, ACCT_SPAN AND acctMissed, WENT WITH THE MISSED
   CARD, SV19. The one miss figure left is the strip's, the thirty days'
   own count, the dashed cubes (acctCubeRead), so the number and the cubes
   under it cannot disagree about a day. */

function acctDays(n){return n+(n===1?' day':' days');}

/* DUE TODAY IS GONE, SV17, 5 November. His reaction to the page was too
   much text, and this card said the week's own today a second time: the
   rituals set for today, each with a ring, under a line telling the person to
   press it. Its two jobs went to the two places that already carry them.
   Which rituals are due today is today's column of the week (ritWeekCalHtml,
   ui/ritcal.js), ringed and at full strength while the other days sit back.
   Marking one done is the Done ring in that sash's sheet (ritSashSheet), the
   same ritLog press and the same writer this card's ring was. The Active list
   in the centre keeps its own ring as well, so the press is never further
   than it was. */

/* MISSED AND DONE ARE GONE AS CARDS, SV19, 5 November. His words, on the
   live page: "Where it says streak missed, make the symbolic icons, the
   streak should be in the upper right hand side ... Get rid of the missed
   section." And of Done, "The gigantic graphic, this is done and 14, taking
   up all that space by itself. Clean that up."

   DONE WAS A 180 PIXEL RING FOR ONE NUMBER. The rings round it were today's
   due rituals, which today's column of the week already draws and presses,
   and the number in the middle was the streak. Best, Kept and Practised sat
   under it as three more boxes. The brief asked whether it was the same ring
   drawn twice with the Thirty day loop: it was not, the loop had become cubes
   in round QS, but the rail did print 14 three times for Ana, the loop's days
   kept, Done's streak and Done's Kept, three different counts reading as one
   figure printed three ways.

   MISSED WAS A LIST WITH EDIT ON IT. Edit is on the ritual's own row in the
   centre and in its sash's sheet, so nothing lost a route; the line advising
   an edit went with the card, third tier text by his own ruling.

   WHAT IS LEFT IS ONE STRIP AT THE TOP OF THE RAIL, above the menu's name,
   acctStreakHtml below, written into #flowhd by ritRender. Each figure is a
   mark and its number, and the word is the mark's accessible name and the
   tooltip's title, the unpack rule met in the same place without a word on
   the screen (CLAUDE.md, round PO). */
var ACCT_IC={
 /* the streak is a run that keeps turning: the avatar page's own cycle arrow */
 streak:'<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4.5h-4.5"/>',
 /* a miss is the dashed ring every calendar on this page draws for one */
 miss:'<circle cx="12" cy="12" r="8" stroke-dasharray="3 3.3"/>',
 mins:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2 M10 3h4"/>'};
function acctStreakHtml(st){
 var L=st.L, s=L.streak||{}, run=s.run||0, best=s.best||0, kept=s.days||0, mins=(L.ledger&&L.ledger.minutes)||0;
 var miss=acctCubeRead(st).days.filter(function(X){return X.st==='miss';}).length;
 /* A ZERO IS A DASH, COPY.md Value, and the unit rides on the figure (V17) */
 var fig=function(k,n,u,nm,tip,fl){
  return '<span class="acs acs-'+k+'"'+rvTip(nm,tip,fl)+' aria-label="'+esc(nm+', '+(n?n+' '+u:'none'))+'">'
   +'<svg viewBox="0 0 24 24" aria-hidden="true">'+ACCT_IC[k]+'</svg>'
   +'<b>'+(n?n+'<small> '+u+'</small>':'\u2013')+'</b></span>';};
 /* Best and Kept ride in the streak's tooltip: Best is the longest run with
    no gap, which can be shorter than the streak (streakRead's grace day, the
    mismatch recorded at ritTodayHtml's old home), and the sentence says so */
 return '<div class="acs-row" role="group" aria-label="Streak">'
  +fig('streak',run,run===1?'day':'days','Streak',STREAK_MEANS+' Best is your longest run with no gap. Kept is the days you marked a ritual done.',
    'Best|'+(best?acctDays(best):'\u2013')+';Kept|'+(kept?acctDays(kept):'\u2013'))
  +fig('miss',miss,miss===1?'day':'days','Missed','Days in the last thirty a ritual was due and nothing was marked done: the dashed cubes below.')
  +fig('mins',mins,'min','Practised','The minutes you have put in.')+'</div>';}

/* THE THIRTY DAY LOOP OF ROUND QN, one ring round thirty days, became the
   cubes in round QS, below, and its read, acctLoopRead, went in SV19 with the
   figures it fed. It counted a day missed when any ritual on it was missed,
   so on Ana the strip said 10 days missed while Success over time, on the
   same page, said 7: a day with one ritual kept and one missed is a kept day
   on the cubes and in Success, and a missed day in the loop's count. The
   strip counts the dashed cubes now (acctCubeRead's own state), so the number
   and the picture under it cannot disagree. ACCT_LOOP is the thirty. */
var ACCT_LOOP=30;
/* ---------------- THE THIRTY DAYS AS CUBES, round QS ----------------
   His words, 3 October: "the accountability should have the the 30 days of
   cubes showing my progression and my achievements and badges and whatnot
   attached to it".

   THE CUBES REPLACE THE RING, and that is a judgment and is said as one. The
   ring of round QN and these cubes are two drawings of one read, and one page
   says a thing once, so the picture changed and the read did not: every cube
   is ritDaySegs for its day, the month's own read, exactly as each piece of
   the ring was. The heading was his name for it, Thirty day loop, until SV19
   cut the words; below.

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
   The shelf under the cubes that drew every earned mark a second time was cut
   in SV19, below. Only earned marks: the next one is the Ongoing goal
   card's, and the rest are never listed (engine/ladder.js, "never how many of
   how many").

   Nothing here is a rate. The figures that sat over the cubes are the streak
   strip's now, counts of days and minutes, the ruling for every surface that
   shows a record. */
var ACCT_COLS=7;
/* ROUND QX, A CALENDAR AND NOT A CHART. His words: "the whole thing should
   look effectively like a calendar." Round QS laid the thirty a week to a row
   counted back from today, so a row began on whatever weekday that was and the
   grid had no weekday a person could read off it: a progress chart in a
   calendar's clothes. Now the columns are the days of the week, Monday first
   as RU2 ruled and Sunday first since SV24 reversed it (ritWc), with their letters over them; each cube carries its date; the
   first day of a month carries the month; and the rest of this week is drawn
   ahead of today, so a ritual set for Tuesday, Thursday and Saturday shows on
   the days it is still to come. The thirty are still the read: the miss count
   in the strip counts those thirty and nothing ahead, and a day ahead is never
   a miss. */
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
 /* the rest of this week, ahead: what is set for it, and nothing else */
 var ahead=[];
 for(var e=today+1;e<=today+6-ritWc(today);e++){
  var Y={d:e, done:[], miss:[], plan:[], marks:[], st:'ahead'}, seen2={};
  ritDaySegs(e,st.plans,today).forEach(function(s){if(s.st!=='ahead'||seen2[s.nm])return; seen2[s.nm]=1; Y.plan.push(s);});
  ahead.push(Y);}
 return {days:out, ahead:ahead, pad:ritWc(t0), md:md};}
function acctCubeHtml(X,k,today,empty){
 var row=Math.floor(k/ACCT_COLS)+2, col=k%ACCT_COLS+1;
 var nm=function(a){return a.map(function(s){return s.nm;}).join(', ');};
 var bg='';
 if(X.done.length){var w=100/X.done.length;
  bg=';background:linear-gradient(90deg,'+X.done.map(function(s,j){return s.col+' '+(j*w).toFixed(1)+'% '+((j+1)*w).toFixed(1)+'%';}).join(',')+')';}
 var c=(X.done[0]||X.plan[0]||X.miss[0]||{}).col||'var(--accent)';
 var ahead=X.st==='ahead';
 var said=ahead?(X.plan.length?'Set: '+nm(X.plan)+'.':'Nothing set yet.')
  :([X.done.length?'Done: '+nm(X.done)+'.':'', X.plan.length?'Planned: '+nm(X.plan)+'.':'',
  X.miss.length?'Missed: '+nm(X.miss)+'.':'', X.marks.length?'Earned '+X.marks.map(function(m){return m.nm;}).join(', ')+'.':'']
  .filter(Boolean).join(' ')||'Nothing was set for this day.');
 var day=ritDayName(X.d,today), dt=ritDateOf(X.d);
 var date=(dt.getDate()===1?dt.toLocaleDateString('en-GB',{month:'short'})+' ':'')+dt.getDate();
 return '<span class="rv-cb rv-cb-'+X.st+(ahead&&X.plan.length?' rv-cb-set':'')+(X.d===today?' rv-cb-now':'')+'" style="grid-row:'+row+';grid-column:'+col
  +';--c:'+c+';--i:'+(row+col)+bg+'"'
  /* AN EMPTY RECORD IS A PICTURE AND NOT THIRTY PRESSES, the month's own rule
     (ritRecordHtml): on a first visit the sockets show what will fill and are
     not each a carrier to tab through */
  +(empty?' aria-hidden="true"':rvTip(day,said)+' aria-label="'+esc(day+'. '+said)+'"')+'>'
  +'<i class="rv-cbd" aria-hidden="true">'+date+'</i>'
  +X.marks.map(function(m,j){return '<i class="rv-cbm" style="--c:'+seatCol(m.b)+';--k:'+j+'" aria-hidden="true">'
   +'<svg viewBox="0 0 24 24"><path d="'+m.ic+'"/></svg></i>';}).join('')+'</span>';}
/* THE MARKS SHELF IS GONE, SV19, his words: "Get rid of the section that
   says marks." The earned marks are still on the cubes, each pinned to the
   day that earned it with its name on the press, so a mark is not lost, only
   its second drawing in a row of seven circles under the calendar. */
/* AND "THIRTY DAY LOOP" IS GONE AS A HEADING, SV19, his words: "Get rid of
   the text that says 30-day loop." A blank heading over a calendar would be a
   box that failed to draw, and a new name would be a narrative director's
   word chosen by an engineer, so the heading is what a calendar is headed by
   anyway: its month, October to November 2026, which was already printed one
   line down. What the cubes mean rides on it as the one tooltip (ritTell).
   The figures that sat over the cubes went up to the streak strip, and the
   count of days kept with them: the cubes draw those days. */
function acctLoopHtml(st){
 var Q=acctCubeRead(st);
 var empty=!st.plans.length&&!((CURP&&CURP.rituals)||[]).length;
 var all=Q.days.concat(Q.ahead), a=ritDateOf(all[0].d), z=ritDateOf(all[all.length-1].d);
 var mo=a.getMonth()===z.getMonth()?a.toLocaleDateString('en-GB',{month:'long',year:'numeric'})
  :a.toLocaleDateString('en-GB',{month:'long'})+' to '+z.toLocaleDateString('en-GB',{month:'long',year:'numeric'});
 return '<div class="rv-sec rv-loopw"><div class="rv-hd"><span class="rv-h">'+esc(mo)+'</span></div>'
  +'<p class="rv-mean">The last thirty days, Sunday to Saturday, with the rest of this week ahead. '
  +'A solid cube is a day you kept a ritual, in the colour of its seat; an outline is planned; dashed is missed. A mark on a cube is one you earned that day.</p>'
  +'<div class="rv-cubes'+(empty?' rv-cubes0':'')+'" role="group" aria-label="The last thirty days, Sunday first">'
  +RIT_WCOL.map(function(w){return '<span class="rv-cbw" aria-hidden="true">'+RIT_WD[w]+'</span>';}).join('')
  +Q.days.map(function(X,i){return acctCubeHtml(X,Q.pad+i,st.today,empty);}).join('')
  +Q.ahead.map(function(X,i){return acctCubeHtml(X,Q.pad+Q.days.length+i,st.today,empty);}).join('')+'</div>'
  +'<div class="rv-key" aria-hidden="true"><span><i class="rv-k-cube"></i>Done</span><span><i class="rv-k-cplan"></i>Planned</span>'
  +'<span><i class="rv-k-cmiss"></i>Missed</span></div></div>';}

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
 /* the heading is Rituals and not History, SV19: History is the press that
    opens this, and a heading reading the press's own name back under it is
    the same word twice */
 return '<div class="rv-sec rv-hist"><div class="rv-hd"><span class="rv-h">Rituals</span></div>'
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
   any more: the parts are the right rail's contents and the rail is a
   sibling of the stage, so the stage's paint cannot delete them. The read is
   handed in, so this column and the centre cannot disagree about the day.

   The worked example note is not repeated here, and since SV19 it is not on
   the page at all: the profile picker says "Ana, example", and a write on an
   example is refused by name through status() at the moment it is tried. */
/* SV19 is the order now. The streak strip sits above the menu's name, in the
   rail's head (ritRender). Under the name, the thirty days. Then History, one
   press, his words: "Get rid of the history on the right-hand side. There
   should be a button and if I press it, it shows me the history on my
   right-hand menu." The press opens, in this same rail and under itself, the
   rituals as cards and the Record, because the Record is the history too: the
   month a day at a time, and every entry, with its delete.

   WHY THE RECORD WENT BEHIND THE SAME PRESS, his question: "You have
   something called record, and 30-day loop. How are these different?" Read
   off the code, both draw ritDaySegs, the one read of a day, as a calendar.
   The thirty days are this month at a glance, one picture, with the marks
   pinned on the days that earned them, and nothing on it to press but a
   tooltip. The Record is the whole history: any month back, a list of every
   entry, and a day opened to mark yesterday done or delete an entry. So they
   differ in reach and not in what they say, and two calendars of one read
   stacked in one rail was the page saying a thing twice. The glance stays;
   the history is the press. The press keeps one label and its chevron
   carries the state, the Practices press's rule (UX rule 2). */
function acctSideHtml(st,arrive){
 var open=!!RIT.histOpen;
 return '<div class="rvr-wrap'+(arrive?' rv-arrive':'')+'">'+acctLoopHtml(st)
  /* PUT BACK IS OFFERED WHERE A PERSON CAN SEE IT. A delete from a sash's
     sheet or the Record offers it in the Record (ritRecordHtml), and with
     History shut the Record is not drawn, so the offer would be a status
     nobody could reach. It sits over the press instead until History opens,
     and then the Record carries it as it always did. */
  +(!open&&RIT.gone&&RIT.goneAt!=='keep'?'<div class="rv-gone" role="status"><span>Deleted.</span>'
   +'<button type="button" class="btn" data-act="putback">Put back</button></div>':'')
  +'<button type="button" class="rit-more rv-more-t rv-histt" data-act="hist" aria-expanded="'+open+'" aria-controls="rvhist">'
  +'<span>History</span>'+ritIc('down')+'</button>'
  +(open?'<div class="rv-histp" id="rvhist">'+acctHistHtml(st)+ritRecordHtml(st.plans,st.today)+'</div>':'')+'</div>';}
