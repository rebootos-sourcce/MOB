/* ============================================================
   THE LADDER. What you have done, and what it has cost you to do it.

   Ruled: badges, achievements and a score. The last word is the hard one,
   because this product has a standing ruling that a reading is never a score
   and that a count is never printed against a total. Both hold here and
   neither is in the way, because a reading and a record are different things.

   The reading is what is true of you now, and it is not an achievement, has no
   maximum, and is nobody's business to score. The record is what you did: how
   many days in a row you practised, how much ground you have opened, which
   marks you have earned. Those are counts of events that happened, and a count
   of what happened is honest. What is still refused is the shape "3 of 14",
   because that turns a record into a completion bar and invites a person to
   finish their own nervous system. Earned marks are shown. The next one is
   named with what it takes. The ones beyond it are not enumerated.

   Everything here is a pure function of a profile. No dates from the host: the
   caller passes the moment, so a test can hold time still and a streak cannot
   quietly break because a gate ran at midnight.
   ============================================================ */

/* a day key in the local frame of whoever recorded it, because a streak is
   counted in days a person lived and not in UTC. Derived from the stored
   timestamp rather than stored beside it, so an old record still counts. */
var DAY_MS=86400000;
function pracDay(t){
 var d=new Date(t); if(isNaN(d))return null;
 return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/DAY_MS);}

/* every distinct day carrying a saved ritual, newest first. */
function pracDays(p){
 var seen={}, out=[];
 ((p&&p.rituals)||[]).forEach(function(x){
  var k=pracDay(x&&x.t); if(k===null||seen[k])return; seen[k]=1; out.push(k);});
 return out.sort(function(a,b){return b-a;});}

/* THE STREAK, AND WHY TODAY IS NOT REQUIRED.

   A streak that breaks at midnight punishes a person for the hour they opened
   the app rather than for missing a day. It runs from the most recent day
   practised, and it is live while that day is today or yesterday. Practise
   today and yesterday's streak continues. Miss a whole day and it is over, and
   the length of what was lost is still reported, because the thing a person
   built is not deleted by having stopped. */
function streakRead(p,now){
 var days=pracDays(p), today=pracDay(now||Date.now());
 if(!days.length||today===null)return {run:0, live:false, last:null, best:0, days:0};
 /* THE RUN HALVES, IT DOES NOT RESET. Ruled, Bible 1133:
    Math.max(1, Math.ceil(s/2)) with one grace day.

    It used to break out of the walk at the first gap, so one missed pair of
    days threw away a month. Measured against a thousand simulated arrivals,
    a reset costs 36 of 1000 at day 30, and it is the wrong arithmetic as well
    as the expensive one: Lally 2010 found that missing one opportunity did not
    materially affect habit formation, so the penalty for a miss should be a
    penalty and not a demolition.

    Walked oldest to newest, because a rule that carries forward cannot be read
    backwards. A gap of one day is consecutive. A gap of two is the grace day
    and costs nothing. Three or more halves what was standing, and the day
    being walked is already inside the halved run rather than added to it.

    Nothing new is stored. This is the same day list read under a different
    rule, so an older profile gets the new arithmetic on the next render. */
 var asc=days.slice().reverse();
 var run=1;
 for(var i=1;i<asc.length;i++){
  var gap=asc[i]-asc[i-1];
  if(gap<=2)run++;
  else run=Math.max(1,Math.ceil(run/2));}
 var best=1,cur=1; for(var j=1;j<days.length;j++){
  if(days[j]===days[j-1]-1){cur++; if(cur>best)best=cur;} else cur=1;}
 var gap=today-days[0];
 return {run:run, live:gap<=1, last:days[0], best:best, days:days.length, gap:gap};}

/* THE LEDGER. Four quantities, each a count of something that happened.

   minutes is what the person put in. lines is what was spoken, repeats
   included, and ground is the unique addresses opened, which is the one the
   tier ladder charges for. clear is how many addresses are held at the far
   pole right now, and it is the only one of the four that can go down, which
   is correct: it is a state and not a tally. */
function ledgerRead(p){
 /* MINUTES PRACTISED WAS MINUTES PLANNED, and it was the one label in the
    product claiming what the data did not carry. Select the twenty minute scan,
    press save, close the tab, and the ledger read twenty minutes practised.

    A saved ritual is a plan. A ritual marked done is a thing that happened.
    They are now two counts and they are named differently. An entry saved
    before this existed carries no done key at all, and is read as practised
    rather than discarded, because a person's history is not ours to delete over
    a schema change. Only entries written from here on can be planned and not
    yet done. */
 var mins=0, plan=0, doneN=0;
 ((p&&p.rituals)||[]).forEach(function(x){
  var m=(x&&+x.min)||0; plan+=m;
  var done=(x&&x.done!==undefined)?!!x.done:true;
  if(done){mins+=m; doneN++;}});
 var m=(p&&p.meter)||{};
 var clear=0, carry=0;
 ((p&&p.axes)&&CHILD.forEach(function(c){
  var a=p.axes[c.nm]||{}; if((a.opp||0)>=4)clear++; if((a.held||0)>=4)carry++;}));
 return {minutes:mins, planned:plan, done:doneN,
  rituals:((p&&p.rituals)||[]).length,
  lines:+m.lines||0, ground:((m.unique||[]).length),
  clear:clear, carry:carry, snaps:((p&&p.history)||[]).length};}

/* THE MARKS.

   Each is a named thing, so each has an icon and a family, and the family has
   a colour that means what it means everywhere else: the seat. Three families,
   and they are the three things a person actually does here.

   Practice is what you kept up, and it sits at the root, because keeping up is
   the base everything else stands on. Ground is what you opened, at the throat,
   because opening ground is the act of saying the thing. Structure is what
   changed in the field, at the heart.

   A mark's test takes the ledger, the streak and the profile and returns true
   or false. Nothing in a test reaches outside those three. */
var MARKS=[
 /* practice */
 {k:'first', fam:'Practice', b:'Root', nm:'First run',
  d:'You ran one. The instrument is no longer a thing you are reading about.',
  ic:'M12 21V6 M7 11l5-5 5 5',
  t:function(l){return l.rituals>=1;}},
 {k:'week', fam:'Practice', b:'Root', nm:'Seven days',
  d:'Seven days in a row. This is where it stops being a decision each morning.',
  ic:'M4 6h16v14H4z M4 11h16 M8 3v4 M16 3v4',
  t:function(l,s){return s.best>=7;}},
 {k:'month', fam:'Practice', b:'Root', nm:'Thirty days',
  d:'Thirty in a row. The nervous system has had long enough to believe you.',
  ic:'M4 6h16v14H4z M4 11h16 M8 3v4 M16 3v4 M9 15l2 2 4-4',
  t:function(l,s){return s.best>=30;}},
 {k:'season', fam:'Practice', b:'Root', nm:'Ninety days',
  d:'A quarter of a year, unbroken. Nothing about this is a beginner number.',
  ic:'M12 3a9 9 0 109 9 M12 3v9h9 M12 12l5 5',
  t:function(l,s){return s.best>=90;}},
 {k:'hour', fam:'Practice', b:'Root', nm:'Sixty minutes',
  d:'An hour of practice on the record, however it was spread.',
  ic:'M12 3a9 9 0 100 18 9 9 0 100-18 M12 7v5l4 2',
  t:function(l){return l.minutes>=60;}},
 /* ground */
 {k:'ten', fam:'Ground', b:'Throat', nm:'Ten addresses',
  d:'Ten distinct addresses opened. Not ten runs. Ten places.',
  ic:'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  t:function(l){return l.ground>=10;}},
 {k:'fifty', fam:'Ground', b:'Throat', nm:'Fifty addresses',
  d:'Fifty. Close to half the architecture has been opened at least once.',
  ic:'M3 12h18 M3 7h18 M3 17h18 M7 3v18 M17 3v18',
  t:function(l){return l.ground>=50;}},
 {k:'told', fam:'Ground', b:'Throat', nm:'First story',
  d:'You told it something true and let it read the charge out of that.',
  ic:'M4 5h16v11H8l-4 4z',
  t:function(l,s,p){return !!(p&&p.story&&(p.story.entries||[]).length);}},
 {k:'kept', fam:'Ground', b:'Throat', nm:'Ten stories',
  d:'Ten told. The field is being read from your own words and not from a form.',
  ic:'M4 5h16v11H8l-4 4z M8 9h8 M8 12h5',
  t:function(l,s,p){return ((p&&p.story&&p.story.entries)||[]).length>=10;}},
 /* structure */
 {k:'nine', fam:'Structure', b:'Heart', nm:'Nine axes',
  d:'Every one of the nine has a value you entered. Nothing is a default.',
  ic:'M5 5h14v14H5z M5 10h14 M5 15h14 M10 5v14 M15 5v14',
  t:function(l){return l.clear+l.carry>=9;}},
 {k:'laws', fam:'Structure', b:'Heart', nm:'Laws measured',
  d:'The intake is complete, so integrity is measured rather than assumed.',
  ic:'M12 4v4 M4 8h16 M4 8l-2 5h4z M20 8l-2 5h4z',
  t:function(l,s,p){return !!(p&&p.intake&&p.intake.completedAt);}},
 {k:'stated', fam:'Structure', b:'Heart', nm:'Blueprint stated',
  d:'You named your type, and the field carries that until you move it.',
  ic:'M4 20V8l8-5 8 5v12 M9 20v-7h6v7',
  t:function(l,s,p){return !!(p&&p.seed);}},
 {k:'aimed', fam:'Structure', b:'Heart', nm:'Purpose set',
  d:'Six values placed. The compass has something to point at.',
  ic:'M12 3a9 9 0 100 18 9 9 0 100-18 M12 8l3 8-3-2-3 2z',
  t:function(l,s,p){return !!(p&&p.purpose&&purposeReady&&purposeReady(p.purpose));}},
 {k:'turned', fam:'Structure', b:'Heart', nm:'First clearing',
  d:'An address that was carrying is held at the far pole instead.',
  ic:'M4 12a8 8 0 1116 0 8 8 0 01-16 0 M8 12l3 3 5-6',
  t:function(l){return l.clear>=1;}},
 {k:'seat', fam:'Structure', b:'Heart', nm:'Five clear',
  d:'Five addresses holding the opposite. That is structure, not a good day.',
  ic:'M4 12a8 8 0 1116 0 8 8 0 01-16 0 M12 4v16 M4 12h16',
  t:function(l){return l.clear>=5;}},
 /* the record itself */
 {k:'watched', fam:'Structure', b:'Heart', nm:'Ten snapshots',
  d:'Ten readings on file, so the movement is yours to see and not to recall.',
  ic:'M3 17l5-6 4 4 3-4 6 6 M3 5h18v14H3z',
  t:function(l){return l.snaps>=10;}}];

/* WHAT IS EARNED, AND WHAT IS NEXT. Never how many of how many.

   next is one mark: the nearest unearned one in the family the person is
   already furthest into, because the useful next thing is the one adjacent to
   what they are doing. Everything past it is deliberately not returned, so no
   caller can render a checklist of a person's unfinished self. */
function ladderRead(p,now){
 var l=ledgerRead(p), s=streakRead(p,now), got=[], left=[];
 MARKS.forEach(function(m){
  var ok=false; try{ok=!!m.t(l,s,p);}catch(e){ok=false;}
  (ok?got:left).push(m);});
 var by={}; got.forEach(function(m){by[m.fam]=(by[m.fam]||0)+1;});
 var lead=null, best=-1;
 left.forEach(function(m){var n=by[m.fam]||0; if(n>best){best=n; lead=m;}});
 return {earned:got, next:lead, ledger:l, streak:s};}

/* ============================================================
   COHERENCE OVER TIME. The series behind the graph.

   Every snapshot already carries an ISO stamp and a coherence, so the record
   is a time series and nothing on any surface was drawing it. Ruled: the span
   buttons become a graph, and the graph opens Summary.

   AN EMPTY SPAN SAYS EMPTY. A graph drawn from one point is a flat line, and a
   flat line is a claim: nothing changed. One reading is not a flat line, it is
   one reading, and the read says which so the renderer can say so too.
   ============================================================ */
var SPANS=[{k:'day',nm:'Day',d:1},{k:'week',nm:'Week',d:7},
 {k:'month',nm:'Month',d:30},{k:'quarter',nm:'Quarter',d:90},
 {k:'year',nm:'Year',d:365},{k:'five',nm:'Five years',d:1826}];
function spanOf(k){for(var i=0;i<SPANS.length;i++)if(SPANS[i].k===k)return SPANS[i];
 return SPANS[3];}
function seriesRead(p,spanKey,now){
 var sp=spanOf(spanKey), t1=(now===undefined?Date.now():now);
 var t0=t1-sp.d*86400000;
 var hist=(p&&p.history)||[];
 var pts=[];
 for(var i=0;i<hist.length;i++){
  var s=hist[i];
  if(!s||typeof s.cq!=='number')continue;
  var ms=Date.parse(s.t);
  if(!(ms>=t0&&ms<=t1))continue;
  pts.push({ms:ms, cq:s.cq, ig:(typeof s.jq==='number'?s.jq:null)});}
 pts.sort(function(a,b){return a.ms-b.ms;});
 /* WHAT THE SPAN CAN AND CANNOT SAY. Nothing at all is one state, one reading
    is a second, and two or more is a line. They read differently and a caller
    that cannot tell them apart will draw a flat line for a single point. */
 var st = !pts.length ? 'none' : (pts.length===1 ? 'one' : 'line');
 var lo=null, hi=null, first=null, last=null;
 if(pts.length){
  lo=hi=pts[0].cq; first=pts[0].cq; last=pts[pts.length-1].cq;
  for(var j=0;j<pts.length;j++){
   if(pts[j].cq<lo)lo=pts[j].cq;
   if(pts[j].cq>hi)hi=pts[j].cq;}}
 return {span:sp, state:st, pts:pts, n:pts.length,
  lo:lo, hi:hi, first:first, last:last,
  /* direction is only a claim when there are two ends to compare */
  dir: st==='line' ? (last>first?'up':(last<first?'down':'level')) : null,
  t0:t0, t1:t1};}
