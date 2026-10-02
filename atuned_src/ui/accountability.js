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
    +'</div></li>';});
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
  +ritMarksHtml(st.L)+'</div>';}

/* THE WHOLE COLUMN, AS ONE STRING, and ritRender writes it. It returns markup
   rather than painting a host of its own, because there is no host of its own
   any more: the four parts are the right rail's contents and the rail is a
   sibling of the stage, so the stage's paint cannot delete them. The read is
   handed in, so this column and the centre cannot disagree about the day.

   The worked example note is not repeated here. The centre already carries it
   once, ritNote in ui/ritual.js, and one page says a thing once. */
function acctSideHtml(st){
 return '<div class="rvr-wrap">'+acctDueHtml(st)+acctDoneHtml(st)+acctMissHtml(st)
  +ritRecordHtml(st.plans,st.today)+'</div>';}
