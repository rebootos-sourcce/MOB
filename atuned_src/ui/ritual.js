/* ============================================================
   RITUAL. Release names what is running. The ritual turns it into
   something repeatable. Which practice the state calls for is decided
   by the seat carrying the most, not by preference.

   ROUND JQ, 27 September, his words, and they are the specification for
   everything below ritFor: "the ritual page needs to be visual, like super
   visual ... right now it's all text based ... attach the accountability
   tracker to it ... very visual, very simple, and pass data from my story to
   the bank to the work I need to do ritually. I need to be able to see it as
   a calendar, see which ones are running, edit, remove, log, delete,
   rearrange, see a list, have history."

   One page, four parts, and none of them is a second mechanism:

     the chain    what you wrote, what it left held in your body (the bank,
                  impLive, the same list the Imprints page draws), and the one
                  practice the seat holding the most calls for (ritFor). The
                  seat's colour runs through all three, so the line from story
                  to work is drawn in colour and not explained in words.
     today        one ring per active ritual, one dash per step in it, his own
                  design from RT1: four things is four dashes. A ring closes
                  when the ritual is marked done today. The streak sits in the
                  middle and is streakRead's, the one streak in the product.
     active       the rituals a person is doing now, in the order they put
                  them. Mark done, open to read how, edit, move up, stop.
     the record   a month of days, each a small ring cut into the rituals that
                  day carried, and the same record as a list. Tap a day to see
                  it; mark today or yesterday done; delete an entry and put it
                  back.

   THE WORD IS ACTIVE, NOT RUNNING. He said "which ones are running", and the
   UX skill reserves running for a saboteur (rule 1, one word per concept).
   Active is one of his own four figure words from NW1: "Recurring, missed,
   active, streak." So the page says Active and Missed, and nothing on it says
   running.

   WHERE EACH THING IS KEPT, said here so nothing claims otherwise.
     the record   CURP.rituals, the shape the boundary already validates, one
                  entry a day a ritual was set or done. Nothing new is written
                  into it and no field is added. Schema v2 is the owner's call.
     active       what is active, in what order, until when, beside the record
                  under its own key in the bound store, keyed by profile id.
                  It is the posture avatarui.js took for the avatar's own rules
                  for the same reason: the boundary rebuilds a record from the
                  fields it names and would drop anything else on the next
                  load. It survives a reload and does not travel with an
                  export, and that is named as a cost in the report.
   ============================================================ */
/* ROUND LT, his words, and they are the specification for tags, on and tm:
   "I should be able to add tags to create the ritual, put a timer for it, how
   often I want to do it, I should see a list of my active running tasks for
   the day." All three live on the plan beside the record, where ritPlanOk
   already decides what is kept, so none of them is a schema change.

     tags   the seats a ritual is for, a closed set of seven read against
            BANDS. TG4 ruled the shape before this round: "tags set for each
            major chakra", a closed field and never free text, because free
            text is a field the practitioner model would later have to hide.
            A tag creates the ritual by drafting the practice that seat calls
            for, ritFor's own answer, so a tag carries no second library.
     on     the weekdays it is due, Monday 0 to Sunday 6, the week starting
            Monday as RU2 ruled. Missing is every day, which is what every plan
            written before this round meant, so an older plan reads unchanged.
            One day is weekly and any set is custom: one shape for all three.
     tm     the timer, whole minutes. Missing is the minutes its steps add up
            to, so a plan with no timer set still has an honest one.
   run is the timer counting now, and rang is the one that reached zero and is
   waiting to be marked. Neither is kept: a timer is a moment, not a record. */
var RIT={open:false, sel:{}, order:[], from:null, all:false, when:'', where:'',
 days:7, add:false, edit:null, exp:null, view:'month', mo:0, day:null, gone:null, hn:40,
 /* ROUND LT, HIS WORDS: "I should be able to add tags to create the ritual,
    put a timer for it, how often I want to do it." tags is a closed set of
    seats, TG4's own shape, "no to free text tags... yes to a closed field
    validated against a table"; on is the weekdays it is due, Monday first;
    run and rang are the live timer's own state, named by the plan id it
    counts against so switching rituals cannot leave two ticking against one
    render, and never persisted, the same posture as hover and pin. */
 tags:[], on:null, tm:null, run:null, rang:null};
/* TRACK4BAND moved to engine/data/practice.js, which the recipe engine reads
   and may not reach into a renderer for. The name is the same. */
function ritFor(r){
 var band=r.darkB||'Root', track=TRACK4BAND[band]||'Body';
 /* HEAVY LOAD STARTS AT 70, AND IT WAS STARTING AT 8. This read DQ>=8 and
    DQ>=4, written when the shadow score ran zero to ten, and it never moved
    when compute() rescaled DQ to zero to a hundred. So a DQ of 8 out of 100,
    barely any held charge, was treated as heavy load and locked a person to
    the entry practices. Measured on the roster: nine of fourteen profiles sat
    in tier 1 at DQ 10.7 to 54.3, and the heaviest person in it, Gordon at
    54.3, is median on the scale below. The bands are the owner's, ruled 26
    September on a zero to ten scale: "heavy would be seven eight nine, four
    five six would be median, one two three would be impaired, zero is
    flowing, ten is blocked or collapsed." Times ten onto DQ: heavy and
    collapsed from 70, median from 40, impaired and flowing below.
    tools/loopsim.js carries a copy of this line and moved with it.
    tools/ritualsim.js keeps 8 and 4 on purpose: it is the AP2 snapshot, it
    still calls the first practice rather than the lightest, and it reproduces
    the numbers that were taken with both. */
 /* the cut points are pacingStep's (engine/data/practice.js), one rule for
    this and the recipe engine; the history above is the reason for them */
 var tier=pacingStep(r.DQ);
 /* a teacher's own practice (tc) is reached through its teacher and is never
    what a seat calls for, so the call and the builder's library are what they
    were before the rituals of becoming existed. See engine/data/practice.js. */
 var fit=PRACTICE.filter(function(p){return p.tier<=tier&&!p.tc;});
 var first=fit.filter(function(p){return p.track===track;});
 /* at tier 1 some tracks hold nothing. say so rather than naming a track and
    then calling for a practice from a different one. */
 /* THE LIGHTEST ONE IN THE TRACK, NOT THE FIRST ONE IN THE TABLE. Measured:
    835 of 1000 arrivals were asked for fifteen minutes or more as a first
    practice and 585 of 1000 for twenty, because the table order happened to put
    the long ones first. The track is the diagnosis and stays. Which practice
    inside it is the entry is a question about what a person will actually do
    once, and the answer is the short one. */
 var lightest=function(set){return set.slice().sort(function(a,b){
  return (a.min-b.min)||(a.tier-b.tier);})[0];};
 var called=first.length?lightest(first):lightest(fit);
 return {band:band, track:track, tier:tier, called:called,
  substituted:!first.length, actualTrack:called?called.track:track, all:fit};}
/* OPENING THE PAGE DOES NOT PICK FOR THE PERSON ANY MORE. It used to write the
   called practice into the selection on open, and the selection then outlived
   a change of profile: measured on the shipped page, the blank profile's Box
   Breathing was still the ritual below a card that called Active Listening
   for Marcus. The called practice is read on every render now, and the
   selection only holds what a person or a caller put there.

   Two callers still hand a selection in. The release passes the log of what
   it just released, and the page opens with a new ritual started. The avatar
   sets RIT.sel to the practices it queued and RIT.all, then renders, and the
   page opens with exactly those steps in the builder. */
function ritOpen(fromLog){
 RIT.open=true; RIT.from=fromLog||null; RIT.sel={}; RIT.order=[]; RIT.all=false;
 RIT.when=''; RIT.where=''; RIT.edit=null; RIT.exp=null; RIT.days=7;
 RIT.tags=[]; RIT.on=null; RIT.tm=null;
 RIT.add=!!(fromLog&&fromLog.length);
 ritRender();}
/* THE ONE ALREADY SAVED, newest first. A ritual is a plan and a plan a person
   cannot find again is not a plan. */
function ritLast(){
 var a=(CURP&&CURP.rituals)||[];
 return a.length?a[a.length-1]:null;}
function ritToday(){
 var r=ritLast();
 if(!r||typeof pracDay!=='function')return null;
 return (pracDay(r.t)===pracDay(Date.now()))?r:null;}
/* the steps of a saved ritual, read back out of the keys it stored */
function ritSteps(r){
 return ((r&&r.steps)||[]).map(function(k){
  return PRACTICE.filter(function(p){return p.k===k;})[0];}).filter(Boolean);}
/* Closing means leaving the surface, not emptying it. While Ritual is the tab
   there is nothing behind it to go back to, so a close that blanked the host
   would leave a named tab showing an empty box. */
function ritTab(){
 return typeof TAB!=='undefined'&&typeof S!=='undefined'&&S.tab===TAB.RITUAL;}
function ritClose(){
 if(typeof TAB!=='undefined'&&typeof S!=='undefined'&&S.tab===TAB.RITUAL){
  if(typeof setTab==='function'){setTab(TAB.SUMMARY);return;} }
 RIT.open=false;ritRender();}

/* ---------------- whose record this is ----------------
   A worked example is a demonstration and not a record, so nothing on this
   page writes to one. The shipped Save and Done both wrote to it and then said
   Saved and Marked done, and pSave had already answered false: that is the
   status lie rule 3 names. The refusal is the one the avatar and the release
   give for the same crossing. */
function ritOwn(){
 return !!(typeof S!=='undefined'&&S.who===0&&CURP&&PROFILES.indexOf(CURP)>=0);}
function ritWhose(){
 var p=(typeof PEOPLE!=='undefined'&&typeof S!=='undefined')?PEOPLE[S.who]:null;
 return (p&&p.nm)||'This';}

/* ---------------- what is active, beside the record ---------------- */
var RIT_KEY='atuned-ritual-active';
/* how long a ritual stays active. His three from the avatar, "a week or two
   weeks or a day", and the avatar's own names for them so the two pages say
   the same thing, plus one with no end, because a morning breath is not a two
   week project. 0 is no end. */
var RIT_SPANS=[{d:1,nm:'A day'},{d:7,nm:'A week'},{d:14,nm:'Two weeks'},{d:0,nm:'No end'}];
var RIT_SPAN_D=RIT_SPANS.map(function(s){return s.d;});
function ritSideAll(){
 if(typeof STORE==='undefined')return {};
 try{var o=JSON.parse(STORE.get(RIT_KEY)||'{}');
  return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}catch(e){return {};}}
/* anything that is not the shape ritPlanPut writes is left out on the read
   rather than trusted, the boundary's posture, and a store that cannot be read
   is an empty one here and never a reason to throw the surface. */
function ritPlanOk(p){
 var sd=function(s){return typeof s==='string'&&pracDay(s)!==null;};
 var st=function(s){return typeof s==='string'&&s.length<=RIT_PLAN_MAX;};
 return !!(p&&typeof p==='object'&&typeof p.id==='string'&&p.id.length<40
  &&Array.isArray(p.steps)&&p.steps.length>0&&p.steps.length<=PRACTICE.length
  &&p.steps.every(function(k){return !!RIT_STEP[k];})
  /* the four spans are what the chooser offers. What is kept is any whole
     number of days, because a ritual woken again runs on from where it is. */
  &&typeof p.days==='number'&&p.days>=0&&p.days<=3660&&Math.floor(p.days)===p.days&&sd(p.from)&&(p.stop==null||sd(p.stop))
  &&st(p.when||'')&&st(p.where||'')
  &&(!p.band||BANDS.indexOf(p.band)>=0)&&(!p.track||!!RIT_TRACK[p.track])
  &&(p.rel==null||(typeof p.rel==='number'&&!!BY[p.rel]))
  /* tc is the teacher a ritual of becoming was started toward, an axis or
     path key. It lives here beside the record and not on it, so it is no
     schema change. */
  &&(p.tc==null||(typeof p.tc==='string'&&!!becomingOf(p.tc)))
  /* round LT's three, and TAGS ARE A CLOSED SET, TG4: "no to free text tags
     on measured grounds, and yes to a closed field validated against a
     table. Tags set for each major chakra is a closed set of seven." Each of
     the three is checked by name and by range and a plan carrying any of
     them out of shape is left out whole, the same posture as every field
     above: a seat that is not a seat, a weekday eight, or a timer of a
     thousand minutes is a store somebody else wrote. */
  &&(p.tags==null||(Array.isArray(p.tags)&&p.tags.length<=BANDS.length
   &&p.tags.every(function(b,i){return BANDS.indexOf(b)>=0&&p.tags.indexOf(b)===i;})))
  &&(p.on==null||(Array.isArray(p.on)&&p.on.length>=1&&p.on.length<=7
   &&p.on.every(function(d,i){return typeof d==='number'&&d>=0&&d<=6&&Math.floor(d)===d&&p.on.indexOf(d)===i;})))
  &&(p.tm==null||(typeof p.tm==='number'&&p.tm>=1&&p.tm<=RIT_TM_MAX&&Math.floor(p.tm)===p.tm)));}
/* the longest timer the builder offers is the boundary's own ceiling on a
   ritual's minutes, every practice in the library once, so the two cannot
   disagree and no number is typed here */
var RIT_TM_MAX=RIT_MIN_MAX;
function ritPlans(){
 if(!CURP||!CURP.id)return [];
 var a=ritSideAll()[CURP.id];
 if(!Array.isArray(a))return [];
 return a.filter(ritPlanOk).map(function(p){
  return {id:p.id, steps:p.steps.slice(), when:p.when||'', where:p.where||'',
   days:p.days, from:p.from, stop:p.stop||null, band:p.band||'', track:p.track||'',
   rel:(p.rel==null?null:p.rel), tc:(p.tc==null?null:p.tc),
   tags:(p.tags||[]).slice(), on:(p.on?p.on.slice().sort():null), tm:(p.tm==null?null:p.tm)};});}
/* true only when the store took it. A store that was never bound, or that
   throws on quota or on a blocked origin, answers false. */
function ritPlanPut(list){
 if(!ritOwn()||typeof STORE_BOUND==='undefined'||!STORE_BOUND)return false;
 try{var all=ritSideAll(); all[CURP.id]=list; STORE.set(RIT_KEY,JSON.stringify(all)); return true;}
 catch(e){return false;}}

function ritToday0(){return pracDay(Date.now());}
function ritStart0(p){return pracDay(p.from);}
function ritActive(p,today){
 if(p.stop)return false;
 return p.days===0||today<ritStart0(p)+p.days;}
/* a day is on a ritual from the day it started, for as long as it runs, and
   not on or after the day it was stopped. */
/* the weekday of a day key, Monday 0. Day 0 of pracDay is 1 January 1970, a
   Thursday, which is why the three. */
function ritWd(day){return ((day%7)+7+3)%7;}
var RIT_WDN=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
var RIT_WDF=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
/* DUE IS NOT ACTIVE. Active is whether a ritual is still running at all;
   due is whether today is one of its days. A ritual kept on Mondays is active
   all week and due on one day of it, and a Tuesday is not a missed Monday. */
function ritDue(p,day){return !p.on||p.on.indexOf(ritWd(day))>=0;}
function ritOften(on){
 if(!on||on.length===7)return 'Every day';
 if(on.join()==='0,1,2,3,4')return 'Weekdays';
 if(on.join()==='5,6')return 'Weekends';
 /* six of seven is said by the one it leaves out, not by listing six */
 if(on.length===6)return 'Every day but '+RIT_WDN.filter(function(n,d){return on.indexOf(d)<0;})[0];
 return on.map(function(d){return RIT_WDN[d];}).join(', ');}
/* the timer a ritual runs for, its own when one was set */
function ritTm(p){return (p&&p.tm)||ritMin(p&&p.steps)||1;}
function ritCovers(p,day){
 var s=ritStart0(p);
 if(day<s)return false;
 if(!ritDue(p,day))return false;
 if(p.days&&day>=s+p.days)return false;
 if(p.stop&&day>=pracDay(p.stop))return false;
 return true;}
function ritKey(steps){return (steps||[]).join('+');}
function ritPr(k){return PRACTICE.filter(function(p){return p.k===k;})[0]||null;}
function ritMin(steps){return (steps||[]).reduce(function(a,k){var p=ritPr(k);return a+(p?p.min:0);},0);}
function ritName(steps){
 return (steps||[]).map(function(k){var p=ritPr(k);return p?p.nm:'';}).filter(Boolean).join(', ');}
/* the seat's colour, which is what threads the chain: the seat carrying the
   most colours the bank, the practice it calls for, its ring and its days. */
function ritCol(x){
 if(x&&x.band)return seatCol(x.band);
 if(x&&x.track&&PTRACK[x.track])return PTRACK[x.track];
 return 'var(--accent)';}
/* an entry with no done key was saved before done existed and is read as
   practised, which is ledgerRead's posture for the same record. */
function ritIsDone(x){return x&&(x.done===undefined?true:!!x.done);}
function ritEntries(day){
 var out=[];
 ((CURP&&CURP.rituals)||[]).forEach(function(x,i){
  if(x&&pracDay(x.t)===day)out.push({x:x,i:i});});
 return out;}
function ritEntryFor(p,day){
 var k=ritKey(p.steps);
 return ritEntries(day).filter(function(e){return ritKey(e.x.steps)===k;})[0]||null;}
/* a day's key back to a moment inside it, local noon, so a day marked
   yesterday lands on yesterday in whatever zone the person is in. */
function ritDayIso(day){
 if(day===ritToday0())return new Date().toISOString();
 var off=new Date().getTimezoneOffset()*60000;
 return new Date(day*DAY_MS+off+12*3600000).toISOString();}

/* ---------------- one writer ----------------
   Every write on this page goes through here. It refuses a worked example by
   name, writes the store and then the record, and if either one does not take
   it puts both back and says so. Nothing claims success before pSave has
   answered, which is rule 3. */
function ritWrite(fn,okMsg){
 if(!ritOwn()){status(ritWhose()+' is a worked example, so nothing was saved to it.','fail');return false;}
 CURP.rituals=CURP.rituals||[];
 var was=JSON.stringify(CURP.rituals), wasP=ritPlans(), ok=false;
 try{ var plans=fn(ritPlans());
  ok=(plans?ritPlanPut(plans):true)&&!!pSave(); }
 catch(e){ ok=false; }
 if(!ok){
  CURP.rituals=JSON.parse(was); ritPlanPut(wasP);
  try{pSave();}catch(e){}
  status('Could not save that. Nothing changed.','fail');
  ritRender(); return false;}
 if(okMsg)status(okMsg);
 ritRender(); if(typeof render==='function')render();
 return true;}

/* ONE SHAPE FOR AN ENTRY. A seat or a track nobody measured is left out, not
   written empty: the boundary refuses an empty band as "not a seat", measured
   on a Start made before any reading, which would have put a record past its
   own boundary. The boundary also writes band '' itself when one is missing,
   so a record that crossed it once is refused the second time; that half is in
   schema.js and is reported rather than touched from here. */
function ritEntryOf(o){
 var x={t:o.t, steps:o.steps.slice(), min:ritMin(o.steps), when:o.when||'', where:o.where||'', done:o.done};
 if(o.track&&RIT_TRACK[o.track])x.track=o.track;
 if(o.band&&BANDS.indexOf(o.band)>=0)x.band=o.band;
 return x;}
/* the steps a person is building, in the order they picked them */
function ritDraft(){
 var on=Object.keys(RIT.sel).filter(function(k){return RIT.sel[k]&&ritPr(k);});
 var out=RIT.order.filter(function(k){return on.indexOf(k)>=0;});
 on.forEach(function(k){if(out.indexOf(k)<0)out.push(k);});
 return out;}
function ritPick(k){
 RIT.sel[k]=!RIT.sel[k];
 if(RIT.sel[k]){RIT.order=RIT.order.filter(function(x){return x!==k;}); RIT.order.push(k);}
 else RIT.order=RIT.order.filter(function(x){return x!==k;});}
/* A TAG CREATES THE RITUAL. His words, round LT: "add tags that create new
   rituals". Pressing a seat's tag puts on the draft the practice ritFor calls
   for at that seat, at the tier the person's load allows today, so a tag
   hands a heavy field nothing ritFor would not. Taking the tag off leaves the
   step where it is: a person who kept it has already said so by keeping it,
   and the step's own cross is the one way a step comes off. */
function ritTagOn(b){
 if(BANDS.indexOf(b)<0||RIT.tags.indexOf(b)>=0)return;
 RIT.tags.push(b);
 var q=ritFor({darkB:b, DQ:compute().DQ}).called;
 if(q&&!RIT.sel[q.k])ritPick(q.k);}
/* START. The plan is written beside the record and today goes on the record as
   set and not done, which is exactly what Save ritual wrote before: said is
   what intentionRead counts, and ritToday is what the avatar reads back. */
function ritStartPlan(q,msg){
 var now=new Date().toISOString(), today=ritToday0(), steps=q.steps;
 var track=(ritPr(steps[0])||{}).track||q.track||'';
 var id='r'+Date.now().toString(36);
 return ritWrite(function(plans){
  var k=ritKey(steps);
  /* the same steps twice is one ritual. Starting it again wakes the one there
     rather than drawing a second ring for the same practice. */
  var same=plans.filter(function(p){return ritKey(p.steps)===k&&ritActive(p,today);})[0];
  /* AND WAKING ONE ONLY EVER LENGTHENS IT. The span counts from the day it
     started, so writing a week onto a ritual started thirty six days ago ended
     it on the spot: measured, pressing A week on the release schedule took Box
     Breathing off the Active list and its missed days off the month. A ritual
     with no end keeps none; one with an end runs at least the new span from
     today. */
  if(same){same.when=q.when||same.when; same.where=q.where||same.where;
   if(same.days){var need=q.days?today-ritStart0(same)+q.days:0;
    if(!need||need>same.days)same.days=need;}
   if(q.rel!=null)same.rel=q.rel;
   if(q.tc)same.tc=q.tc;
   /* a wake carries what the builder set and keeps what it did not: a
      release schedule that sets none of the three leaves them as they were */
   if(q.tags&&q.tags.length)same.tags=q.tags.slice();
   if(q.on)same.on=q.on.slice();
   if(q.tm)same.tm=q.tm;}
  else plans.push({id:id, steps:steps, when:q.when||'', where:q.where||'', days:q.days,
   from:now, stop:null, band:q.band||'', track:track, rel:(q.rel==null?null:q.rel),
   tc:q.tc||null, tags:(q.tags&&q.tags.length?q.tags.slice():null),
   on:(q.on?q.on.slice():null), tm:(q.tm||null)});
  if(!ritEntryFor({steps:steps},today))
   CURP.rituals.push(ritEntryOf({t:now, track:track, band:q.band, steps:steps,
    when:q.when, where:q.where, done:false}));
  return plans;},msg||'Started.');}
function ritStart(c){
 var steps=ritDraft(); if(!steps.length)return;
 /* a tagged ritual is kept at the first seat it was tagged for, so its ring
    carries the colour of the seat the person named and not the heaviest one */
 var ok=ritStartPlan({steps:steps, band:RIT.tags.length?RIT.tags[0]:(compute().unread?'':c.band), track:c.track,
  days:RIT.days, when:RIT.when, where:RIT.where, tags:RIT.tags, on:RIT.on, tm:RIT.tm});
 if(ok){RIT.sel={}; RIT.order=[]; RIT.when=''; RIT.where=''; RIT.add=false; RIT.all=false;
  RIT.tags=[]; RIT.on=null; RIT.tm=null; RIT.from=null; ritRender();}}
/* A RELEASE SCHEDULE. The practice the pattern's own seat calls for, every day
   for the span he named, carrying the place it is for, so the Active row can
   open the release on that place any day. The record holds practices and not
   releases, so the day marked done is the practice. A release on that place
   that runs to its end marks the same day, ruled in round KG, and rel is what
   ties the two: see ritRelDone. */
function ritStartFor(bc,days){
 var r=compute(), c=ritFor({darkB:bc.seat, DQ:r.DQ}); if(!c.called)return;
 ritStartPlan({steps:[c.called.k], band:bc.seat, track:c.called.track, days:days, rel:bc.n.i},
  'Set. '+c.called.nm+' each day, for '+String(bc.n.k).toLowerCase()+'.');}
/* ---------------- a ritual of becoming, from a teacher ----------------
   Round KQ. The Compass carries the teachers; pressing one opens its drill,
   and the drill offers the ritual that moves toward that teacher's quality.
   It is a release schedule's twin: ritStartPlan does the writing, so it is
   one ritual among the others on the page, with the same ring, the same
   record and the same streak, and nothing about it is a second mechanism.

   WHICH STEPS, AND PACING. The steps are the teacher's (BECOMING). ritFor's
   tier is the pacing, and pacing is the safety system here: a step above the
   tier a person's load allows waits, and says so. If every step waits, the
   ritual starts on the practice the person's state calls for instead, and
   says that too. Nothing is handed to a heavy field that ritFor would not
   hand it.

   WHICH SEAT. An axis teacher's ritual carries the seat the compass reads
   that axis at. A path sits at no seat, so its ritual carries the seat
   holding the most today, which is ritFor's own band. */
function ritTeach(k){
 var b=(typeof becomingOf==='function')?becomingOf(k):null; if(!b)return null;
 var r=compute(), c=ritFor(r), s=becomingSteps(b.k,c.tier);
 var entry=!s.steps.length;
 return {b:b, steps:entry?(c.called?[c.called.k]:[]):s.steps, held:s.held, entry:entry,
  /* a pole with a home seat (round PD) is kept there, as an axis teacher is kept at
     its axis, and only a pole with neither is kept where the load sits today */
  seat:b.seat||b.home||(r.unread?'':c.band)};}
function ritTeachStart(k,days){
 var t=ritTeach(k); if(!t||!t.steps.length)return false;
 var nm=ritSteps({steps:t.steps}).map(function(p){return p.nm;});
 var ok=ritStartPlan({steps:t.steps, band:t.seat, days:days, tc:t.b.k},
  'Set. '+(nm.length>1?nm.slice(0,-1).join(', ')+' and '+nm[nm.length-1]:nm[0])
  +' each day, toward '+String(t.b.q).toLowerCase()+'.');
 /* ROUND PD: a ritual started toward a teacher pins the teacher when there is
    room and logs the start as a count (ui/teachers.js). Both are after the
    writer has answered true, so a start that did not save logs nothing. */
 if(ok&&typeof teachAfterStart==='function')teachAfterStart(t.b.k,'ritual',t.steps.length);
 return ok;}
/* THE LINES STEP PRINTS THE PERSON'S OPEN LINE FOR THE DAY, in place of the
   static text, wherever a step prints (round PD). A step with `aff` names the
   pole whose lines it carries. The line is read and never stored, one of the
   open lines by the day number, so two devices agree. Below the level it is
   shown in hold form, and with nothing open yet the step says how to open one.
   Any other step prints the text it was handed. */
function ritAffText(p,fallback){
 if(!p||!p.aff||typeof teachReach!=='function'||typeof CURP==='undefined'||!CURP)return fallback;
 var P=teachPole(p.aff); if(!P)return fallback;
 var open=teachReach(CURP,p.aff).open, seat=P.seat||P.home;
 var ln=teachLineOf(p.aff,open,ritToday0());
 if(!ln)return 'Choose '+P.who+' on the Compass to open the first line. '+fallback;
 var form=(typeof teachForm==='function')?teachForm(compute()):'say';
 return 'Today\u2019s line, held at '+(seat?'the '+ritSeatNm(seat):'the place you feel it most')+': '
  +(form==='hold'?TEACH_HOLD_PREFIX+' ':'')+ln.line;}
/* the section the teacher drill carries. Only the coherent pole: nobody
   practises toward the inversion. */
function ritTeachHtml(k){
 var t=ritTeach(k); if(!t)return '';
 ritCss();
 var today=ritToday0(), key=ritKey(t.steps);
 var act=ritPlans().filter(function(p){
  return ritActive(p,today)&&(p.tc===t.b.k||ritKey(p.steps)===key);})[0]||null;
 var nm=function(ks){return ks.map(function(x){var p=ritPr(x);return p?p.nm:'';}).filter(Boolean);};
 var h='<div class="pm-eye">A ritual toward '+esc(String(t.b.q).toLowerCase())+'</div>'
  +'<div class="tb-rit" data-tb="'+t.b.k+'">'
  +ritSteps({steps:t.steps}).map(function(p){
   return '<div class="rv-step"><b>'+esc(p.nm)+' <small>'+p.min+' min</small></b><p>'+esc(ritAffText(p,p.d))+'</p></div>';}).join('');
 /* the pacing, said once, after the steps and never instead of them */
 var many=t.held.length>1;
 if(t.entry)h+='<p class="ad-p">At the charge you carry now, '+esc(nm(t.held).join(' and '))
  +(many?' wait':' waits')+'. This starts on '+esc(nm(t.steps)[0]||'')
  +', the practice your state calls for, and the rest opens as the charge drops.</p>';
 else if(t.held.length)h+='<p class="ad-p">'+esc(nm(t.held).join(' and '))
  +(many?' open':' opens')+' as the charge drops.</p>';
 h+='<p class="ad-p">'+(t.b.path
   ?(t.seat?'The five paths sit at no one seat, so this is kept at the '+esc(ritSeatNm(t.seat))+', where you carry the most.'
     :'The five paths sit at no one seat, and nothing is read yet, so this is kept without one.')
   :(t.b.home?'Kept at the '+esc(ritSeatNm(t.b.home))+', the seat this quality\u2019s own law sits at.'
    :(t.b.extra?(t.seat?'This one is read across the field and sits at no one seat, so it is kept at the '+esc(ritSeatNm(t.seat))+', where you carry the most.'
      :'This one is read across the field, and nothing is read yet, so this is kept without a seat.')
    :'Kept at the '+esc(ritSeatNm(t.seat))+', the seat this axis is read at.')))+'</p>';
 if(act)h+='<p class="ad-p"><b>Active</b>, '+esc(ritLeft(act,today).toLowerCase())+'.</p>'
  +'<div class="rv-acts"><button type="button" class="btn" data-tbgo="1">Open the ritual</button></div>';
 else if(!ritOwn())h+='<p class="ad-p">'+esc(ritWhose())+' is a worked example, so nothing here is saved.</p>';
 else if(t.steps.length)h+='<div class="rv-acts">'
  +'<button type="button" class="btn pri" data-tbd="7">Start for a week</button>'
  +'<button type="button" class="btn pri" data-tbd="14">Start for two weeks</button></div>';
 return h+'</div>';}
/* one wire for the section, wherever a drill put it. redraw is the drill
   that holds it, so after a start the section says Active in place. */
function ritTeachWire(redraw){
 var box=document.querySelector('#rdrill .tb-rit'); if(!box)return;
 var k=box.getAttribute('data-tb');
 box.querySelectorAll('[data-tbd]').forEach(function(b){
  b.onclick=function(){if(ritTeachStart(k,+b.getAttribute('data-tbd'))&&redraw)redraw();};});
 var go=box.querySelector('[data-tbgo]');
 if(go)go.onclick=function(){if(typeof setTab==='function'&&typeof TAB!=='undefined')setTab(TAB.RITUAL);};}
function ritSaveEdit(){
 var steps=ritDraft(); if(!steps.length||!RIT.edit)return;
 var id=RIT.edit, today=ritToday0();
 var ok=ritWrite(function(plans){
  var p=plans.filter(function(x){return x.id===id;})[0]; if(!p)throw new Error('gone');
  /* today's entry, if it is only set and not done, follows the edit, because
     it was the plan for today and the plan just changed. A day already done
     is history and is not rewritten. */
  var e=ritEntryFor(p,today);
  p.steps=steps; p.when=RIT.when||''; p.where=RIT.where||'';
  /* the seat follows the tags only when there are tags. A teacher's ritual
     carries the seat its axis is read at, and an edit that sets no tag must
     not move it to wherever the heaviest charge sits today. */
  p.tags=RIT.tags.length?RIT.tags.slice():null; if(RIT.tags.length)p.band=RIT.tags[0];
  p.on=RIT.on?RIT.on.slice():null; p.tm=RIT.tm||null;
  /* a span chosen while editing runs from today, not from the day the ritual
     began, or a week chosen on a ritual five weeks old would end it */
  if(RIT.days>=0)p.days=RIT.days?today-ritStart0(p)+RIT.days:0;
  if(e&&!ritIsDone(e.x)){e.x.steps=steps; e.x.min=ritMin(steps); e.x.when=p.when; e.x.where=p.where;}
  return plans;},'Saved.');
 if(ok){RIT.edit=null; RIT.sel={}; RIT.order=[]; RIT.when=''; RIT.where=''; RIT.all=false;
  RIT.tags=[]; RIT.on=null; RIT.tm=null;}}
function ritEditOpen(id){
 var p=ritPlans().filter(function(x){return x.id===id;})[0]; if(!p)return;
 RIT.edit=id; RIT.add=false; RIT.sel={}; RIT.order=p.steps.slice();
 p.steps.forEach(function(k){RIT.sel[k]=true;});
 /* no span is chosen on the way in. A chip reading A week on a ritual with two
    days left would be a claim, so the chips start empty with what is left
    beside them, and a span chosen here runs from today. */
 RIT.when=p.when; RIT.where=p.where; RIT.days=-1; RIT.all=false;
 RIT.tags=p.tags.slice(); RIT.on=p.on?p.on.slice():null; RIT.tm=p.tm; ritRender();
 var f=document.querySelector('.rv-build'); if(f&&f.scrollIntoView)f.scrollIntoView({block:'nearest'});}
/* MARK DONE, AND UNDO IT WITH THE SAME PRESS. Today, and yesterday, because
   the streak already forgives a day (streakRead) and a person who practised
   late and forgot to press should be able to say so the next morning. Nothing
   older: a record a person can rewrite at will is not a record. */
function ritLog(id,day){
 var today=ritToday0(); if(day===undefined)day=today;
 if(day!==today&&day!==today-1)return;
 var p=ritPlans().filter(function(x){return x.id===id;})[0]; if(!p)return;
 var e=ritEntryFor(p,day), on=e&&ritIsDone(e.x);
 if(ritWrite(function(plans){
  if(e&&on){
   /* the day it was started keeps its entry, as set, because that is what
      the person said that day. Any other day's entry was made by the press
      being taken back, so it goes: left behind it would count as a practised
      day on the streak, which reads every entry and not only the done ones. */
   if(day===ritStart0(p))CURP.rituals[e.i].done=false;
   else CURP.rituals.splice(e.i,1);}
  else ritMarkOn(p,day);
  return null;}, on?'Taken off.':'Done.')&&!on&&typeof sfx==='function')sfx('done');}
/* THE ON HALF OF THE PRESS, AND ONLY THAT. It sat inline in ritLog, and the
   release now marks a day too. ritLog is a toggle, so a release that called it
   on a day the person had already pressed would have taken that day off the
   record and the streak, the one outcome a finished release must never have.
   This half only ever turns a day on, and on a day already done it does
   nothing, so the press and the release cannot count a day twice. Inside a
   ritWrite, which is what saves it and puts it back on a failure. */
function ritMarkOn(p,day){
 var e=ritEntryFor(p,day);
 if(e){if(!ritIsDone(e.x))CURP.rituals[e.i].done=new Date().toISOString(); return;}
 CURP.rituals.push(ritEntryOf({t:ritDayIso(day), track:p.track, band:p.band,
  steps:p.steps, when:p.when, where:p.where, done:new Date().toISOString()}));}
/* A RELEASE THAT RAN TO ITS END IS THE DAY DONE. Round KG, his words: "Is
   someone really does a release and it's part of the ritual that should count
   their day as done automatically?" relCoolDown calls this with the addresses
   the run worked, and only for a run that was not stopped.

   Part of the ritual is read as a ritual carrying that address in rel, which
   is what a release schedule is (ritStartFor) and the only row that offers
   Release now. A ritual started from the builder carries a seat and no
   address, and a release somewhere at that seat is not the breath it asked
   for, so it is not counted; that wider reading is his call and is asked.

   Returns how many rituals it marked. Nothing to mark is not a failure and
   says nothing: most releases are not part of any ritual. A worked example is
   refused before this is reached, by the release itself, so it is not refused
   a second time here. */
function ritRelDone(ids){
 if(!ritOwn()||!ids||!ids.length)return 0;
 var today=ritToday0(), on={};
 ids.forEach(function(i){on[i]=1;});
 var hit=ritPlans().filter(function(p){
  if(p.rel==null||!on[p.rel]||!ritActive(p,today))return false;
  var e=ritEntryFor(p,today); return !(e&&ritIsDone(e.x));});
 if(!hit.length)return 0;
 var nm=hit.map(function(p){return ritName(p.steps);});
 var ok=ritWrite(function(){hit.forEach(function(p){ritMarkOn(p,today);}); return null;},
  'Release finished. '+(nm.length>1?nm.slice(0,-1).join(', ')+' and '+nm[nm.length-1]+' are':nm[0]+' is')+' done for today.');
 return ok?hit.length:0;}
function ritMove(id){
 ritWrite(function(plans){
  var i=-1; plans.forEach(function(p,j){if(p.id===id)i=j;});
  /* up among the active ones, which is the order a person sees */
  var today=ritToday0(), j=i-1;
  while(j>=0&&!ritActive(plans[j],today))j--;
  if(i>0&&j>=0){var t=plans[i]; plans.splice(i,1); plans.splice(j,0,t);}
  return plans;},'Moved.');}
function ritStop(id){
 RIT.exp=null; RIT.edit=null;
 ritWrite(function(plans){
  plans.forEach(function(p){if(p.id===id)p.stop=new Date().toISOString();});
  return plans;},'Stopped. The days you did stay on the record.');}
function ritAgain(id){
 var p=ritPlans().filter(function(x){return x.id===id;})[0]; if(!p)return;
 RIT.sel={}; RIT.order=p.steps.slice(); p.steps.forEach(function(k){RIT.sel[k]=true;});
 RIT.when=p.when; RIT.where=p.where; RIT.days=RIT_SPAN_D.indexOf(p.days)>=0?p.days:7; RIT.add=true; RIT.edit=null;
 RIT.tags=p.tags.slice(); RIT.on=p.on?p.on.slice():null; RIT.tm=p.tm;
 ritRender();}
/* DELETE, AND PUT IT BACK. Undo beats confirm, rule 5. The engine's undo
   holds the field and not this list, so the one thing deleted last is held
   here until the next write, and the page offers it back in place. */
function ritDelPlan(id){
 var today=ritToday0(), gone=null;
 ritWrite(function(plans){
  var i=-1; plans.forEach(function(p,j){if(p.id===id)i=j;}); if(i<0)throw new Error('gone');
  var p=plans[i], e=ritEntryFor(p,today);
  gone={kind:'plan', x:p, i:i, ent:null};
  /* today's entry leaves with it only when it was set and never done: a plan
     that was deleted was not a thing that happened. Anything done stays. */
  if(e&&!ritIsDone(e.x)&&ritStart0(p)===today){gone.ent={x:e.x,i:e.i}; CURP.rituals.splice(e.i,1);}
  plans.splice(i,1); return plans;},'Deleted.');
 if(gone){RIT.gone=gone; RIT.edit=null; RIT.exp=null; ritRender();}}
function ritDelEntry(i){
 var x=CURP&&CURP.rituals&&CURP.rituals[i]; if(!x)return;
 var ok=ritWrite(function(){CURP.rituals.splice(i,1); return null;},'Deleted.');
 if(ok){RIT.gone={kind:'entry', x:x, i:i}; ritRender();}}
function ritPutBack(){
 var g=RIT.gone; if(!g)return;
 var ok=ritWrite(function(plans){
  if(g.kind==='entry')CURP.rituals.splice(Math.min(g.i,CURP.rituals.length),0,g.x);
  else{plans.splice(Math.min(g.i,plans.length),0,g.x);
   if(g.ent)CURP.rituals.splice(Math.min(g.ent.i,CURP.rituals.length),0,g.ent.x);}
  return g.kind==='plan'?plans:null;},'Put back.');
 if(ok){RIT.gone=null; ritRender();}}

function ritHeld(){
 return ((typeof impLive==='function')?impLive():[]).filter(function(n){return n.sq>=4;});}
function ritSeatNm(b){return b==='3rd Eye'?'third eye':String(b||'').toLowerCase();}

/* ---------------- who you want to become, and what is in the way ----------------
   Round JX, his words, as the shape of the line and not the line itself:
   "your avatar wants to be a public speaker, you're holding on to fear of
   judgment of others, would you like to set up a release schedule for that."

   Every part of it is the person's own data. The becoming is the newest avatar
   pair's own first line, quoted and never paraphrased. The seat is the one the
   pair was written at when the record carries it, and otherwise where the
   sniffer hears the second line, readSeat, which is where the avatar page puts
   it. The pattern in the way is the heaviest place held at that seat, off the
   bank. If nothing is held there, there is nothing to release and the page
   says nothing, rather than inventing an obstacle. */
function ritBecoming(){
 var pairs=(CURP&&CURP.avatar&&CURP.avatar.pairs)||[];
 if(!pairs.length)return null;
 var held=ritHeld();
 for(var i=pairs.length-1;i>=0;i--){
  var pr=pairs[i]; if(!pr||!pr.be)continue;
  var b=(pr.seat&&BANDS.indexOf(pr.seat)>=0)?pr.seat
   :((typeof readSeat==='function')?readSeat(pr.notbe||''):null);
  if(!b)continue;
  var n=held.filter(function(x){return x.b===b&&x.cf;})[0];
  if(n)return {be:String(pr.be).trim(), seat:b, n:n};}
 return null;}
function ritBecomingHtml(bc,act){
 if(!bc)return '';
 /* already scheduled, it is on the Active list and not asked again */
 if(act.some(function(p){return p.rel===bc.n.i;}))return '';
 var col=seatCol(bc.seat);
 return '<div class="rv-why" style="--c:'+col+'">'
  +'<div class="rv-why-t"><span class="rv-lb">Your avatar wants to be</span>'
  +'<p class="rv-why-be">"'+esc(bc.be.replace(/^"+|"+$/g,''))+'"</p>'
  +'<p class="rv-why-p">You are holding on to <b>'+esc(String(bc.n.k).toLowerCase())+'</b> at the '
  +esc(ritSeatNm(bc.seat))+'. Set up a release schedule for it?</p></div>'
  +'<div class="rv-acts rv-why-a">'
  /* one job, the schedule. Release now is on the row the schedule makes,
     so the card does not add a third choice to a question with two answers. */
  +'<button type="button" class="btn pri" data-act="why" data-d="7">A week</button>'
  +'<button type="button" class="btn pri" data-act="why" data-d="14">Two weeks</button>'
  +'</div></div>';}

/* ---------------- drawing ---------------- */
function ritP(n){return (+n).toFixed(2);}
/* one ring cut into n pieces with a small gap between each. A piece is done,
   set for a day still to come, set and not done yet today, or missed. */
function ritArcs(cx,cy,r,segs,w){
 var n=segs.length, out='';
 if(!n)return '';
 /* THE GAP IS MEASURED OFF THE STROKE, NOT TYPED IN DEGREES. A round cap
    reaches half a stroke past each end, so a fixed 14 degree gap on a small
    ring was eaten whole and a two step ritual drew one unbroken circle, which
    is the one thing RT1 says a ring must never do: the dashes are the count.
    The gap is a stroke and a half of clear space, and never more than half a
    piece, so ten steps still draw ten. */
 var gap=n>1?Math.min((w*2.5)/r*180/Math.PI,180/n):0;
 segs.forEach(function(s,i){
  var cls='rv-s rv-s-'+s.st;
  if(n===1){out+='<circle class="'+cls+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'" style="stroke:'+s.col
   +';stroke-width:'+w+'"/>';return;}
  var a0=(-90+i*360/n+gap/2)*Math.PI/180, a1=(-90+(i+1)*360/n-gap/2)*Math.PI/180;
  out+='<path class="'+cls+'" d="M'+ritP(cx+r*Math.cos(a0))+' '+ritP(cy+r*Math.sin(a0))
   +' A'+r+' '+r+' 0 '+((a1-a0)>Math.PI?1:0)+' 1 '+ritP(cx+r*Math.cos(a1))+' '+ritP(cy+r*Math.sin(a1))
   +'" style="stroke:'+s.col+';stroke-width:'+w+'"/>';});
 return out;}
/* what a day carries: what the record holds for it, and every active ritual
   that covered it without an entry. The record comes first, because it is
   what happened; a plan only fills a day nothing was written on. */
function ritDaySegs(day,plans,today){
 var segs=[], seen={};
 ritEntries(day).forEach(function(e){
  var k=ritKey(e.x.steps); seen[k]=1;
  segs.push({col:ritCol(e.x), st:ritIsDone(e.x)?'done':(day<today?'miss':'plan'),
   x:e.x, i:e.i, nm:ritName(e.x.steps)||'A ritual'});});
 plans.forEach(function(p){
  if(seen[ritKey(p.steps)]||!ritCovers(p,day))return;
  segs.push({col:ritCol(p), st:day<today?'miss':(day===today?'plan':'ahead'), p:p, nm:ritName(p.steps)});});
 return segs;}
var RIT_IC={
 pen:'<path d="M4 20h4L19 9l-4-4L4 16z M13 7l4 4"/>',
 body:'<circle cx="12" cy="5" r="2.2"/><path d="M12 8v7 M8 11h8 M9 21l3-6 3 6"/>',
 ring:'<circle cx="12" cy="12" r="8"/><path d="M12 4v3"/>',
 arrow:'<path d="M5 12h14 M14 7l5 5-5 5"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
 up:'<path d="M12 19V5 M6 11l6-6 6 6"/>',
 x:'<path d="M6 6l12 12 M18 6L6 18"/>',
 back:'<path d="M15 5l-7 7 7 7"/>', fwd:'<path d="M9 5l7 7-7 7"/>',
 plus:'<path d="M12 5v14 M5 12h14"/>', check:'<path d="M5 12l5 5 9-10"/>',
 clock:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2 M10 3h4"/>',
 stop:'<circle cx="12" cy="12" r="8"/><path d="M9.5 9.5h5v5h-5z"/>',
 minus:'<path d="M5 12h14"/>'};
function ritIc(k,cls){
 return '<svg viewBox="0 0 24 24" class="'+(cls||'rv-ic')+'" aria-hidden="true">'+RIT_IC[k]+'</svg>';}

/* THE CHAIN. His words: "pass data from my story to the bank to the work I
   need to do ritually." Three stops and the seat's colour through them. */
function ritChainHtml(c,r,act){
 var own=CURP||{}, n=((own.story&&own.story.entries)||[]).length;
 /* HELD IS CHARGE, AND ONLY CHARGE. impLive is the Imprints page's list and
    it carries installed places too, a place holding its opposite at 4 or more.
    Counting those here printed eight places held on a field holding none,
    measured on the seed. The bank's held is what a release can reach. */
 var held=ritHeld(), by={};
 held.forEach(function(x){by[x.b]=(by[x.b]||0)+1;});
 var bar=BANDS.map(function(b){
  if(!by[b])return '';
  return '<i class="rv-bar-s'+(b===c.band?' rv-on':'')+'" style="flex:'+by[b]+';background:'+seatCol(b)+'" title="'
   +esc(b)+', '+by[b]+' held"></i>';}).join('');
 /* no reading yet, no seat: the practice is where to start and not what a
    seat called for, so it takes the accent and not Root's colour. */
 var p=c.called, col=r.unread?'var(--accent)':seatCol(c.band);
 var running=act.some(function(x){return x.steps.indexOf(p&&p.k)>=0;});
 /* the builder below already holds it, with its own Start: a second Start
    here is the same choice offered twice */
 var drafted=!!(p&&RIT.sel[p.k]);
 var fromN=(RIT.from&&RIT.from.length)||0;
 /* ROUND LT, five cuts on this chain, his words and in his reading order:
    "Get rid of the text 'your words', just put 'Imprints'. Get rid of the
    text says 'write the first one'. Get rid of the text says 'held in your
    body'. Get rid of the text says 'most at the throat'. ... change 'do
    this' to 'goal'." The first stop's label was You wrote, which is the one he
    read as your words, and it is Imprints now, the Story page's own word for
    what a story leaves. Write the first one and Held in your body are gone.
    Most at the throat was a pattern and not one line, Most at the plus
    whichever seat carries the most, so the pattern is gone on every seat; the
    bar under it still marks that seat by its outline. What rode on the same
    line, how many were released just now, is a figure of its own and keeps
    its own line. The unread label, Start here, is not his to cut and stays. */
 var out='<div class="rv-chain" role="group" aria-label="From your story to your ritual">';
 out+='<button type="button" class="rv-node rv-n-imp" data-act="go-story">'
  +'<span class="rv-lb">Imprints</span>'
  +'<span class="rv-nv">'+ritIc('pen','rv-nic')+'<b>'+n+'</b><em>'+(n===1?'story':'stories')+'</em></span>'
  +'</button>';
 out+='<span class="rv-arr" aria-hidden="true">'+ritIc('arrow')+'</span>';
 /* ROUND LT, HIS WORDS: "get rid of the text 'your words', just put
    'Imprints'." This node already opens the Imprints bank (data-act="go-bank",
    impLive, the same list the Imprints page draws), so the label now names
    the surface it opens rather than describing what sits there. That same
    edit removes "held in your body", which he named as its own line: it was
    the phrase this label used to carry. rv-n-held and --c carry the round LT
    colour by part rule onto this node too: the seat colour on the held
    place, ritCss's own words. */
 out+='<button type="button" class="rv-node rv-n-held" data-act="go-bank" style="--c:'+col+'">'
  +'<span class="rv-lb">Imprints</span>'
  +(held.length
    ?'<span class="rv-nv">'+ritIc('body','rv-nic')+'<b>'+held.length+'</b><em>'+(held.length===1?'place':'places')+'</em></span>'
     +'<span class="rv-bar">'+bar+'</span>'
     /* "GET RID OF THE TEXT SAYS 'MOST AT THE THROAT'." The seat name was a
        second reading of the same bar the coloured segments already draw, and
        it was the seat holding the most on every profile, worded to sound like
        news. The "released just now" note is kept: it is not the phrase he
        named and it is the one piece of information here a bar cannot draw. */
     +(fromN?'<span class="rv-ns">'+fromN+' released just now</span>':'')
    :'<span class="rv-nv">'+ritIc('body','rv-nic')+'<em>Nothing held</em></span>')
  +'</button>';
 out+='<span class="rv-arr" aria-hidden="true">'+ritIc('arrow')+'</span>';
 out+='<div class="rv-node rv-do" style="--c:'+col+'">'
  /* "CHANGE 'DO THIS' TO 'GOAL'." Do this named the action; Goal names what
     the action is for, which is the word he asked for in its place. */
  +'<span class="rv-lb">'+(r.unread?'Start here':'Goal')+'</span>'
  +'<span class="rv-nv"><svg viewBox="0 0 24 24" class="rv-nic" aria-hidden="true"><circle cx="12" cy="12" r="8" style="stroke:'+col+'"/></svg>'
  +'<b class="rv-pn">'+esc(p?p.nm:'')+'</b></span>'
  +'<span class="rv-ns">'+(p?p.min+' minutes':'')+'</span>'
  +(running?'<span class="rv-tag">Active</span>'
   :drafted?'':'<button type="button" class="btn pri rv-go" data-act="start-called">Start</button>')
  +'</div>';
 return out+'</div>';}

/* TODAY. One ring per active ritual, outermost first, one dash per step. */
function ritTodayHtml(act,today,L){
 var R=46, step=9, w=5.5, svg='<svg viewBox="0 0 120 120" class="rv-rings" aria-hidden="true">';
 if(!act.length)
  svg+='<circle cx="60" cy="60" r="'+R+'" class="rv-s rv-s-ahead" style="stroke:var(--dim);stroke-width:'+w+'"/>';
 act.slice(0,4).forEach(function(p,i){
  var e=ritEntryFor(p,today), d=e&&ritIsDone(e.x);
  svg+='<circle cx="60" cy="60" r="'+(R-i*step)+'" class="rv-track" style="stroke-width:'+w+'"/>';
  svg+=ritArcs(60,60,R-i*step,p.steps.map(function(){return {col:ritCol(p), st:d?'done':'plan'};}),w);});
 svg+='</svg>';
 /* the streak is in the middle of the rings and nowhere else, because two
    places that print a streak are two places it can be wrong from. Kept is
    his word from RT11: the distinct days a ritual was marked done. */
 /* BEST IS NEVER SHORTER THAN THE STREAK BESIDE IT. streakRead counts the run
    with a grace day and the halving rule, and counts best as strictly
    consecutive days, so on the seed the page read Streak 22 and Best 17 side
    by side. The two rules are the ladder's, in engine/ladder.js, and the
    mismatch is reported there. Here the longest run a person has held is at
    least the one they are holding. */
 var s=L.streak, kd={}, best=Math.max(s.best||0,s.run||0);
 ((CURP&&CURP.rituals)||[]).forEach(function(x){if(ritIsDone(x)){var k=pracDay(x.t); if(k!==null)kd[k]=1;}});
 var kept=Object.keys(kd).length;
 return '<div class="rv-today">'
  +'<div class="rv-hero">'+svg+'<div class="rv-mid"><b>'+s.run+'</b><span>Streak</span></div></div>'
  +'<div class="rv-figs">'
  +'<div class="rv-fig"><b>'+best+'<small>'+(best===1?' day':' days')+'</small></b><span>Best</span></div>'
  +'<div class="rv-fig"><b>'+kept+'<small>'+(kept===1?' day':' days')+'</small></b><span>Kept</span></div>'
  +'<div class="rv-fig"><b>'+L.ledger.minutes+'<small> min</small></b><span>Practised</span></div>'
  +'</div></div>';}

/* ACTIVE. The list a person keeps, in their order. */
function ritLeft(p,today){
 if(!p.days)return 'No end';
 var left=ritStart0(p)+p.days-today;
 return left<=1?'Last day':left+' days left';}
/* THE TIMER ON A ROW. Round LT: "put a timer for it". One runs at a time, the
   way a person does one thing at a time, and pressing it again stops it. It
   counts down on the row and nowhere else, and reaching zero does not mark
   the day done: a timer that ran out is a phone left on a table as often as
   it is a practice finished, and ritLog's rule is that a person says so. It
   says Time is up on the row, and the ring beside it is the press. */
function ritClock(s){s=Math.max(0,Math.ceil(s)); return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2);}
function ritTimerHtml(p){
 var run=RIT.run&&RIT.run.id===p.id, rang=RIT.rang===p.id, m=ritTm(p);
 var lab=run?'Stop the timer':'Start a '+m+' minute timer for '+ritName(p.steps);
 /* at rest it is the clock alone, and the minutes it will run are on the
    line under the name. Counting, it prints what is left; at zero, that the
    time is up. Only then does it take the width a figure needs. */
 return '<button type="button" class="rv-tmr'+(run?' rv-run':'')+(rang?' rv-rang':'')+'" data-act="timer" data-id="'+p.id+'" aria-label="'+esc(lab)+'" title="'+esc(lab)+'">'
  +ritIc(run?'stop':'clock')
  +'<span data-tmr="'+p.id+'">'+(run?ritClock((RIT.run.end-Date.now())/1000):(rang?'Time is up':''))+'</span></button>';}
function ritTimer(id){
 var p=ritPlans().filter(function(x){return x.id===id;})[0]; if(!p)return;
 var was=RIT.run&&RIT.run.id; RIT.rang=null;
 if(RIT.run){clearInterval(RIT.run.iv); RIT.run=null;}
 if(was===id){ritRender();return;}
 var end=Date.now()+ritTm(p)*60000;
 RIT.run={id:id, end:end, iv:setInterval(function(){
  var left=(end-Date.now())/1000, el=document.querySelector('#rit [data-tmr="'+id+'"]');
  if(left<=0){clearInterval(RIT.run.iv); RIT.run=null; RIT.rang=id;
   status(ritName(p.steps)+', time is up.'); if(typeof sfx==='function')sfx('time'); ritRender(); return;}
  /* only the figure is written each second. A render every second would take
     the focus out of the When field while a person typed in it. */
  if(el)el.textContent=ritClock(left);},1000)};
 ritRender();}
/* ACTIVE TODAY, AND THE REST. Round LT: "I should see a list of my active
   running tasks for the day." Running is a saboteur's word here, so the list
   is the Active one it always was, split by due: what is due today first,
   in the person's own order, and what is active but kept on other days under
   it, named by its days so nobody reads it as missed. */
/* COMPACT WHILE THE BUILDER IS OPEN. The list sits in the narrow column then,
   and at full height three rituals put the page past the screen again,
   measured at 1123 pixels of content in 867. So each row is its ring and its
   name: the ring still marks the day done, and how often, the timer and the
   rest come back the moment the builder closes. */
function ritActiveHtml(act,today,compact){
 var due=act.filter(function(p){return ritDue(p,today);}), rest=act.filter(function(p){return !ritDue(p,today);});
 var out='<div class="rv-sec rv-act'+(compact?' rv-cpt':'')+'"><div class="rv-hd"><span class="rv-h">Active today</span>'
  +(due.length?'<span class="rv-min">'+due.length+(due.length===1?' ritual':' rituals')+'</span>':'')+'</div>';
 out+=due.length?'':'<p class="rv-empty">'+(act.length?'Nothing due today.':'Nothing active yet.')+'</p>';
 out+=ritRowsHtml(due,today,act);
 if(rest.length)out+='<div class="rv-h rv-h2 rv-other">Other days</div>'+ritRowsHtml(rest,today,act);
 return out+'</div>';}
function ritRowsHtml(list,today,act){
 var out='<ol class="rv-list">';
 list.forEach(function(p){
  var ix=act.indexOf(p);
  var e=ritEntryFor(p,today), d=e&&ritIsDone(e.x), col=ritCol(p), open=RIT.exp===p.id;
  var ring='<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="14" class="rv-track" style="stroke-width:4"/>'
   +ritArcs(20,20,14,p.steps.map(function(){return {col:col, st:d?'done':'plan'};}),4)
   +(d?'<path d="M13 20l5 5 9-10" class="rv-tick" style="stroke:'+col+'"/>':'')+'</svg>';
  out+='<li class="rv-item'+(d?' rv-done':'')+'" style="--c:'+col+'">'
   +'<div class="rv-row">'
   +'<button type="button" class="rv-log" data-act="log" data-id="'+p.id+'" aria-pressed="'+!!d+'" aria-label="'
   +(d?'Done today. Press to take it off':'Mark '+esc(ritName(p.steps))+' done today')+'">'+ring+'</button>'
   +'<button type="button" class="rv-open" data-act="exp" data-id="'+p.id+'" aria-expanded="'+open+'">'
   +'<span class="rv-nm">'+esc(ritName(p.steps))+'</span>'
   +'<span class="rv-sub">'+(p.rel!=null&&BY[p.rel]?'For '+esc(String(BY[p.rel].k).toLowerCase())+', ':'')
   +(p.tc&&becomingOf(p.tc)?'Toward '+esc(becomingOf(p.tc).who)+', ':'')
   /* the minutes are the timer's, so a timer set longer than the steps reads
      here as what it is set to. How often is said only when it is not every
      day, because every day is what a ritual is unless it says otherwise,
      and a line that wraps to three rows is what put the page past the
      screen with both rails open. Mid line it is a value and a value is
      never titled, V13: it read "20 minutes, Every day but Thu". */
   +ritTm(p)+' minutes'+(p.on?', '+esc(ritOften(p.on).replace(/^(Every|Week)/,function(m){return m.toLowerCase();})):'')+(p.when?', '+esc(p.when):'')+'<i>'+ritLeft(p,today)+'</i>'
   +p.tags.map(function(b){return '<em class="rv-tg" style="--t:'+seatCol(b)+'">'+esc(ritTagNm(b))+'</em>';}).join('')
   +'</span></button>'+ritTimerHtml(p)+'</div>';
  if(open){
   out+='<div class="rv-more">'
    +ritSteps(p).map(function(s,i){
     return '<div class="rv-step"><b>'+(p.steps.length>1?(i+1)+'. ':'')+esc(s.nm)+' <small>'+s.min+' min</small></b><p>'+esc(ritAffText(s,s.how))+'</p></div>';}).join('')
    +((p.when||p.where)?'<p class="rv-if">When '+esc(p.when||'it is time')+', '+esc(p.where?'at '+p.where:'wherever you are')+'.</p>':'')
    +'<div class="rv-acts">'
    +(p.rel!=null&&BY[p.rel]&&BY[p.rel].sq>=4?'<button type="button" class="btn" data-act="rel" data-n="'+p.rel+'">Release now</button>':'')
    +'<button type="button" class="btn" data-act="edit" data-id="'+p.id+'">'+ritIc('edit')+'Edit</button>'
    +(ix>0?'<button type="button" class="btn" data-act="up" data-id="'+p.id+'">'+ritIc('up')+'Move up</button>':'')
    +'<button type="button" class="btn" data-act="stop" data-id="'+p.id+'">Stop</button>'
    +'</div></div>';}
  out+='</li>';});
 return out+'</ol>';}
/* a seat's name as a tag carries it: sentence case, and the third eye spelled
   out, the way ritSeatNm spells it inside a sentence */
function ritTagNm(b){return b==='3rd Eye'?'Third eye':String(b||'');}

/* THE BUILDER. New and edit are one card. The steps a person picked sit at
   the top in their order, the practice the state calls for is the first tile,
   and the rest of the library is one press away rather than nineteen rows. */
/* THE SEVEN TAGS, one per seat, each in its seat's colour. The same row sits
   on the closed panel, where a press starts a new ritual from that seat, and
   in the builder, where a press adds or takes off the tag. */
function ritTagsHtml(act,on){
 return '<div class="rv-tags" role="group" aria-label="Tags">'+BANDS.map(function(b){
  var p=on.indexOf(b)>=0;
  return '<button type="button" class="rv-tag2'+(p?' rv-on':'')+'" data-act="'+act+'" data-b="'+esc(b)+'" aria-pressed="'+p
   +'" style="--t:'+seatCol(b)+'"><i></i>'+esc(ritTagNm(b))+'</button>';}).join('')+'</div>';}
/* THE NEW RITUAL, CLOSED. Round LT: "the new ritual needs to be on the upper
   right hand side so it's front and center". It was a small New button in the
   Active heading, which is where he looked and did not see it. It is the
   first panel in the right column now, and it is the builder's own slot, so
   pressing it opens the builder in the same place rather than somewhere else
   on the page. */
function ritNewHtml(){
 /* no heading: the press is the heading, and a heading reading New ritual
    over a button reading New ritual said it twice */
 return '<div class="rv-sec rv-new rv-shut">'
  +'<button type="button" class="btn pri rv-add" data-act="add">'+ritIc('plus')+'New ritual</button>'
  +'<span class="rv-fl">Start from a tag</span>'+ritTagsHtml('newtag',[])+'</div>';}
function ritBuildHtml(c,nAct){
 var draft=ritDraft(), editing=!!RIT.edit, mins=ritMin(draft);
 /* the minutes the steps add up to used to sit in this heading. The timer
    below starts at that figure and prints it, so it is said once, there. */
 var out='<div class="rv-sec rv-build rv-new"><div class="rv-hd"><span class="rv-h">'+(editing?'Edit':'New ritual')+'</span></div>';
 if(RIT.from&&RIT.from.length)
  out+='<p class="rit-from">After releasing '+esc(RIT.from.slice(0,3).map(function(x){return x.name;}).join(', '))
   +(RIT.from.length>3?' and '+(RIT.from.length-3)+' more':'')+'</p>';
 /* tags first, because a tag is what creates the ritual: his order, "add
    tags to create the ritual, put a timer for it, how often" */
 out+='<span class="rv-fl">Tags</span>'+ritTagsHtml('tag',RIT.tags);
 if(draft.length){
  out+='<ol class="rv-steps">';
  draft.forEach(function(k,i){var p=ritPr(k);
   out+='<li class="rv-st" style="--c:'+(PTRACK[p.track]||'var(--accent)')+'"><i></i><span>'+esc(p.nm)+'</span><small>'+p.min+' min</small>'
    +(i>0?'<button type="button" class="rv-ib" data-act="step-up" data-k="'+k+'" aria-label="Move '+esc(p.nm)+' up">'+ritIc('up')+'</button>':'')
    +'<button type="button" class="rv-ib" data-act="pick" data-k="'+k+'" aria-label="Take '+esc(p.nm)+' out">'+ritIc('x')+'</button></li>';});
  out+='</ol>';}
 /* the tiles. Called first; then, one press on, every practice this state
    allows, by track, each tile the colour of its track. */
 var tile=function(p,big){
  var on=!!RIT.sel[p.k], call=c.called&&c.called.k===p.k;
  return '<button type="button" class="rv-tile'+(on?' rv-on':'')+(big?' rv-big':'')+'" data-act="pick" data-k="'+p.k
   +'" aria-pressed="'+on+'" style="--c:'+(PTRACK[p.track]||'var(--accent)')+'">'
   +'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/>'+(on?'<path d="M8 12l3 3 5-6"/>':'')+'</svg>'
   +'<span class="rv-tn">'+esc(p.nm)+'</span><span class="rv-tm">'+p.min+' min'+(call?', called for':'')+'</span>'
   +(big?'<span class="rv-td">'+esc(p.d)+'</span>':'')+'</button>';};
 if(c.called&&!RIT.all&&!RIT.sel[c.called.k])out+='<div class="rv-tiles">'+tile(c.called,true)+'</div>';
 if(RIT.all){
  ['Somatic','Body','Energy','Mind'].forEach(function(tr){
   var set=c.all.filter(function(p){return p.track===tr;}); if(!set.length)return;
   out+='<div class="rv-trk" style="--c:'+(PTRACK[tr]||'var(--accent)')+'">'+tr+'</div><div class="rv-tiles">'
    +set.map(function(p){return tile(p,false);}).join('')+'</div>';});}
 out+='<button type="button" class="rit-more" id="ritall" data-act="all">'+(RIT.all?'Fewer practices':'More practices')+'</button>';
 /* THE TIMER AND HOW OFTEN. The timer starts at the minutes the steps add
    up to and a press moves it a minute at a time under ten and five at a
    time above, which is the size of the difference at each end. How often is
    a week of seven presses, Monday first, with the two sets a person picks
    most as one press each: every day, and weekdays. One day is weekly. */
 var tm=RIT.tm||mins||1, on=RIT.on||[0,1,2,3,4,5,6], wk=on.join()==='0,1,2,3,4';
 out+='<div class="rv-row2">'
  +'<div class="rv-fld"><span class="rv-fl">Timer</span><div class="rv-stp">'
  +'<button type="button" class="rv-ib" data-act="tm" data-d="-1" aria-label="Shorter"'+(tm<=1?' disabled':'')+'>'+ritIc('minus')+'</button>'
  +'<b>'+tm+' min</b>'
  +'<button type="button" class="rv-ib" data-act="tm" data-d="1" aria-label="Longer"'+(tm>=RIT_TM_MAX?' disabled':'')+'>'+ritIc('plus')+'</button></div></div>'
  +'<div class="rv-fld"><span class="rv-fl">How often</span><div class="rv-span rv-oft">'
  +'<button type="button" class="rv-sp'+(!RIT.on?' rv-on':'')+'" data-act="often" data-v="all" aria-pressed="'+!RIT.on+'">Every day</button>'
  +'<button type="button" class="rv-sp'+(wk?' rv-on':'')+'" data-act="often" data-v="wk" aria-pressed="'+wk+'">Weekdays</button>'
  +'</div></div></div>'
  +'<div class="rv-wk" role="group" aria-label="Days">'
  +RIT_WD.map(function(w,i){var p=on.indexOf(i)>=0;
   return '<button type="button" class="rv-wkd'+(p?' rv-on':'')+'" data-act="wd" data-d="'+i+'" aria-pressed="'+p+'" aria-label="'+RIT_WDF[i]+'">'+w+'</button>';}).join('')
  +'</div>';
 /* THE IF THEN PLAN. Two fields, and they are the largest single item in the
    whole loop: 72 of 1000 at day thirty, measured. Gollwitzer and Sheeran
    2006, ninety four studies, d 0.65: a plan that names a time and a place is
    acted on and a plan that names an intention is not. Both optional. The
    cap comes from the boundary, RIT_PLAN_MAX, and is not typed again here. */
 out+='<div class="rv-plan">'
  +'<label class="rit-f"><span>When</span><input type="text" id="ritwhen" maxlength="'+RIT_PLAN_MAX
  +'" placeholder="after I put the kettle on" value="'+esc(RIT.when||'')+'"></label>'
  +'<label class="rit-f"><span>Where</span><input type="text" id="ritwhere" maxlength="'+RIT_PLAN_MAX
  +'" placeholder="the chair by the window" value="'+esc(RIT.where||'')+'"></label>'
  +(RIT.days<0&&RIT.edit?(function(){var q=ritPlans().filter(function(x){return x.id===RIT.edit;})[0];
    return q?'<p class="rv-left">'+ritLeft(q,ritToday0())+'</p>':'';})():'')
  +'<span class="rv-fl">How long</span><div class="rv-span" role="radiogroup" aria-label="How long">'
  +RIT_SPANS.map(function(s){var on=RIT.days===s.d;
   return '<button type="button" role="radio" aria-checked="'+on+'" class="rv-sp'+(on?' rv-on':'')+'" data-act="span" data-d="'+s.d+'">'+s.nm+'</button>';}).join('')
  +'</div>'
  +((RIT.when||RIT.where)&&draft.length
    ?'<p class="rv-if">When '+esc(RIT.when||'it is time')+', '+esc(RIT.where?'at '+RIT.where:'wherever you are')
     +', you will '+esc(String(ritPr(draft[0]).nm).toLowerCase())+'.</p>':'')
  +'</div>';
 out+='<div class="rv-acts">'
  +(editing?'<button type="button" class="btn" data-act="del-plan" data-id="'+RIT.edit+'">Delete</button>':'')
  /* nothing to go back to on the tab when nothing is active, so no cancel:
     the builder is the page. Over another tab it closes. */
  +((editing||nAct||!ritTab())?'<button type="button" class="btn" id="ritx" data-act="cancel">'+(ritTab()?'Cancel':'Close')+'</button>':'')
  +'<button type="button" class="btn pri" id="ritsave" data-act="save"'+(draft.length?'':' disabled')+'>'+(editing?'Save':'Start')+'</button>'
  +'</div>';
 return out+'</div>';}

/* THE RECORD AS A MONTH. Each day is a ring cut into what it carried. */
var RIT_WD=['M','T','W','T','F','S','S'];
function ritDayName(day,today){
 if(day===today)return 'Today';
 if(day===today-1)return 'Yesterday';
 var off=new Date().getTimezoneOffset()*60000, d=new Date(day*DAY_MS+off+12*3600000);
 return d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});}
function ritCalHtml(plans,today,empty){
 var now=new Date(), y=now.getFullYear(), m=now.getMonth()+RIT.mo;
 var first=new Date(y,m,1,12), yy=first.getFullYear(), mm=first.getMonth();
 var nd=new Date(yy,mm+1,0).getDate(), lead=(first.getDay()+6)%7;
 var mon='<span class="rv-mon">'+first.toLocaleDateString('en-GB',{month:'long',year:'numeric'})+'</span>';
 var out='<div class="rv-cal"><div class="rv-calh">'
  +(empty?mon:'<button type="button" class="rv-ib" data-act="mo" data-d="-1" aria-label="Month before">'+ritIc('back')+'</button>'
   +mon+'<button type="button" class="rv-ib" data-act="mo" data-d="1" aria-label="Month after"'+(RIT.mo>=1?' disabled':'')+'>'+ritIc('fwd')+'</button>')
  +'</div><div class="rv-grid">';
 RIT_WD.forEach(function(w){out+='<span class="rv-wd" aria-hidden="true">'+w+'</span>';});
 for(var i=0;i<lead;i++)out+='<span class="rv-blank"></span>';
 for(var d=1;d<=nd;d++){
  var day=pracDay(new Date(yy,mm,d,12)), segs=ritDaySegs(day,plans,today);
  var sel=RIT.day===day;
  var doneN=segs.filter(function(s){return s.st==='done';}).length;
  var tag=empty?'span':'button';
  out+='<'+tag+(empty?'':' type="button"')+' class="rv-day'+(day===today?' rv-now':'')+(sel?' rv-sel':'')+(day>today?' rv-fut':'')
   +'"'+(empty?' aria-hidden="true"':' data-act="day" data-d="'+day+'" aria-pressed="'+sel+'" aria-label="'+esc(ritDayName(day,today))+', '+d
   +(segs.length?', '+doneN+' done':'')+'"')+'>'
   +'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" class="rv-track" style="stroke-width:3.5"/>'
   +ritArcs(20,20,15,segs,3.5)+'</svg><span>'+d+'</span></'+tag+'>';}
 out+='</div><div class="rv-key" aria-hidden="true">'
  +'<span><i class="rv-k-done"></i>Done</span><span><i class="rv-k-plan"></i>Planned</span><span><i class="rv-k-miss"></i>Missed</span></div>';
 return out+'</div>';}
/* one day read back: what it carried, marked done or not, and deletable */
function ritDayRows(day,plans,today){
 var segs=ritDaySegs(day,plans,today), can=(day===today||day===today-1);
 if(!segs.length)return '<p class="rv-empty">Nothing on this day.</p>';
 return '<ul class="rv-days">'+segs.map(function(s){
  var st=s.st==='done'?'Done':(s.st==='miss'?'Missed':'Planned');
  var pid=s.p?s.p.id:(function(){var k=ritKey(s.x.steps);
   var q=plans.filter(function(p){return ritKey(p.steps)===k;})[0]; return q?q.id:null;})();
  return '<li class="rv-dr" style="--c:'+s.col+'"><i class="rv-dot rv-s-'+s.st+'"></i>'
   +'<span class="rv-dn">'+esc(s.nm)+'</span><span class="rv-ds">'+st+'</span>'
   +(can&&pid?'<button type="button" class="rv-ib" data-act="logday" data-id="'+pid+'" data-d="'+day+'" aria-pressed="'+(s.st==='done')
     +'" aria-label="'+(s.st==='done'?'Take off':'Mark done')+'">'+ritIc('check')+'</button>':'')
   +(s.x?'<button type="button" class="rv-ib" data-act="del-entry" data-i="'+s.i+'" aria-label="Delete this entry">'+ritIc('x')+'</button>':'')
   +'</li>';}).join('')+'</ul>';}
/* THE SAME RECORD AS A LIST, newest first, and the rituals that have ended,
   which can be started again. */
function ritListHtml(plans,today){
 var rows=((CURP&&CURP.rituals)||[]).map(function(x,i){return {x:x,i:i,d:pracDay(x&&x.t)};})
  .filter(function(e){return e.d!==null;}).sort(function(a,b){return b.d-a.d||b.i-a.i;});
 var ended=plans.filter(function(p){return !ritActive(p,today);}).reverse();
 var out='';
 if(ended.length){
  out+='<div class="rv-h rv-h2">Ended</div><ul class="rv-days">';
  ended.forEach(function(p){
   out+='<li class="rv-dr" style="--c:'+ritCol(p)+'"><i class="rv-dot rv-s-plan"></i><span class="rv-dn">'+esc(ritName(p.steps))+'</span>'
    +'<button type="button" class="btn" data-act="again" data-id="'+p.id+'">Again</button>'
    +'<button type="button" class="rv-ib" data-act="del-plan" data-id="'+p.id+'" aria-label="Delete">'+ritIc('x')+'</button></li>';});
  out+='</ul>';}
 if(!rows.length)return out+'<p class="rv-empty">Nothing on the record yet.</p>';
 var last=null, n=0;
 out+='<ul class="rv-days">';
 rows.slice(0,RIT.hn).forEach(function(e){
  if(e.d!==last){out+='<li class="rv-dg">'+esc(ritDayName(e.d,today))+'</li>'; last=e.d;}
  var st=ritIsDone(e.x)?'done':(e.d<today?'miss':'plan');
  out+='<li class="rv-dr" style="--c:'+ritCol(e.x)+'"><i class="rv-dot rv-s-'+st+'"></i><span class="rv-dn">'
   +esc(ritName(e.x.steps)||'A ritual')+' <small>'+((+e.x.min)||0)+' min</small></span>'
   +'<span class="rv-ds">'+(st==='done'?'Done':(st==='miss'?'Missed':'Planned'))+'</span>'
   +'<button type="button" class="rv-ib" data-act="del-entry" data-i="'+e.i+'" aria-label="Delete this entry">'+ritIc('x')+'</button></li>';
  n++;});
 out+='</ul>';
 if(rows.length>RIT.hn)out+='<button type="button" class="rit-more" data-act="more">Show more</button>';
 return out;}
/* the marks, which are the ladder's and drawn as its own icons. Earned ones
   are shown and the next one is named. Never how many of how many. */
function ritMarksHtml(L){
 if(!L.earned.length&&!L.next)return '';
 return '<div class="rv-marks"><span class="rv-h">Marks</span><div class="rv-mk">'
  +L.earned.map(function(m){
   return '<span class="rv-m" style="--c:'+seatCol(m.b)+'" title="'+esc(m.nm+'. '+m.d)+'">'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+m.ic+'"/></svg></span>';}).join('')
  +'</div>'+(L.next?'<p class="rv-next">Next: <b>'+esc(L.next.nm)+'</b></p>':'')+'</div>';}
function ritRecordHtml(plans,today){
 /* A DAY OPENS WHEN IT IS PRESSED. It used to open on today, and today's
    rows repeated the Active list's own mark done controls one column over:
    three more choices on the working screen, measured, for nothing new. */
 var sel=RIT.day;
 /* AN EMPTY RECORD IS A PICTURE AND NOT A CONTROL PANEL. On a first visit the
    month is drawn so a person can see what will fill, and its arrows, its
    view switch and its thirty days were thirty four things to press on a
    record holding nothing. They arrive with the first entry. */
 var empty=!((CURP&&CURP.rituals)||[]).length&&!plans.length&&!RIT.gone;
 if(empty){RIT.view='month'; sel=null;}
 var out='<div class="rv-sec rv-rec"><div class="rv-hd"><span class="rv-h">Record</span>'
  +(empty?'':'<div class="rv-seg" role="tablist" aria-label="Record view">'
  +[['month','Month'],['list','List']].map(function(v){var on=RIT.view===v[0];
   return '<button type="button" role="tab" aria-selected="'+on+'" class="rv-sg'+(on?' rv-on':'')+'" data-act="view" data-v="'+v[0]+'">'+v[1]+'</button>';}).join('')
  +'</div>')+'</div>';
 if(RIT.gone)out+='<div class="rv-gone" role="status"><span>Deleted.</span><button type="button" class="btn" data-act="putback">Put back</button></div>';
 if(RIT.view==='list')out+=ritListHtml(plans,today);
 else out+=ritCalHtml(plans,today,empty)+(sel===null?''
  :'<div class="rv-dayh">'+esc(ritDayName(sel,today))+'</div>'+ritDayRows(sel,plans,today));
 return out+'</div>';}

/* THE LAYOUT, one function so the design options in proto/ritual-redesign can
   put the same parts in a different order without a second copy of any of
   them. */
/* ROUND LT, his words: "this is a scroll up and down in that center column
   for the ritual even though there's about an inch and a half on the left and
   right of the screen, this should not have a scroll". Measured at 1600 by
   1000 before the change: the card was held to 1180 pixels and scrolled 969
   pixels of content inside 867, two columns stacked five parts deep on the
   left while the width beside them went unused. So it is three columns now
   and the card takes the stage's whole width: the chain, today and the
   record share the left two, and the new ritual takes the right one from the
   top, which is where he asked for it. Below 1080 pixels of card the right
   column folds in under the chain, still ahead of everything else, and
   below 880 today and the record stack as they always did.

   THE LIST OF WHAT IS ACTIVE TODAY SITS UNDER THE NEW RITUAL, and moves
   under the rings while the builder is open. His two asks sit side by side:
   the new ritual front and centre, and "a list of my active running tasks for
   the day". Closed, the new ritual is short and the list under it is the
   second thing seen. Open, the builder needs the whole column to stay inside
   the screen, measured, so the list goes to the column under today's rings,
   the one place it was before this round, until the builder closes. */
function ritLayout(P){
 return P.note+P.why+'<div class="rv-cols"><div class="rv-main">'+P.chain
  +'<div class="rv-pair"><div class="rv-col">'+P.today+(P.building?P.active:'')+P.marks
  +'</div><div class="rv-col">'+P.record+'</div></div></div>'
  +'<div class="rv-side">'+P.build+(P.building?'':P.active)+'</div></div>';}

function ritRender(){
 var h=document.getElementById('rit'); if(!h)return;
 if(!RIT.open){h.style.display='none';h.innerHTML='';return;}
 h.style.display='flex'; ritCss();
 var r=compute(), c=ritFor(r), today=ritToday0();
 var plans=ritPlans(), act=plans.filter(function(p){return ritActive(p,today);});
 var L=(typeof ladderRead==='function')?ladderRead(CURP,Date.now())
  :{streak:{run:0,best:0},ledger:{minutes:0},earned:[],next:null};
 var drafting=Object.keys(RIT.sel).some(function(k){return RIT.sel[k];});
 /* when nothing is active the page's one job is to start something, so the
    builder is open with the called practice ready and nothing else to find. */
 if(!act.length&&!drafting&&!RIT.edit&&c.called){RIT.sel[c.called.k]=true; RIT.order=[c.called.k]; drafting=true;}
 var building=!!RIT.edit||RIT.add||drafting;
 var P={
  note:ritOwn()?'':'<p class="rv-note">'+esc(ritWhose())+' is a worked example, so nothing here is saved.</p>',
  why:ritBecomingHtml(ritBecoming(),act),
  /* the rings are what is due today and nothing else. A ring is closed by
     marking today done, so a ritual kept on other days would draw a ring
     that today cannot close. */
  chain:ritChainHtml(c,r,act), today:ritTodayHtml(act.filter(function(p){return ritDue(p,today);}),today,L),
  active:ritActiveHtml(act,today,building), build:building?ritBuildHtml(c,act.length):ritNewHtml(),
  marks:ritMarksHtml(L), record:ritRecordHtml(plans,today), building:building};
 h.innerHTML='<div class="rel-card rit-card rv">'+ritLayout(P)+'</div>';
 ritWire(h,c);}

/* one listener on the host. Every control carries what it does in data-act,
   so a layout that moves a control does not have to move its wiring. */
function ritWire(h,c){
 h.onclick=function(ev){
  var b=ev.target.closest&&ev.target.closest('[data-act]'); if(!b||!h.contains(b)||b.disabled)return;
  var a=b.getAttribute('data-act'), id=b.getAttribute('data-id');
  /* the offer to put a deletion back lasts until the next thing that writes
     or builds. Looking around the record does not spend it. */
  if(['putback','view','day','mo','exp','more'].indexOf(a)<0)RIT.gone=null;
  switch(a){
   case 'go-story': if(typeof setTab==='function')setTab(TAB.STORY); return;
   case 'go-bank': if(typeof setTab==='function')setTab(TAB.STORY);
    if(typeof stBank==='function'&&typeof STV!=='undefined'&&!STV.bank)stBank(); return;
   case 'start-called': RIT.sel={}; RIT.order=[]; if(c.called)ritPick(c.called.k); RIT.add=true; RIT.edit=null; break;
   case 'add': RIT.add=true; RIT.edit=null; RIT.sel={}; RIT.order=[]; RIT.tags=[]; RIT.on=null; RIT.tm=null;
    if(c.called)ritPick(c.called.k); break;
   /* a tag on the closed panel is a new ritual from that seat: the builder
      opens holding the tag and the practice that seat calls for */
   case 'newtag': RIT.add=true; RIT.edit=null; RIT.sel={}; RIT.order=[]; RIT.on=null; RIT.tm=null; RIT.tags=[];
    ritTagOn(b.getAttribute('data-b')); break;
   case 'tag': {var tb=b.getAttribute('data-b');
    if(RIT.tags.indexOf(tb)>=0)RIT.tags=RIT.tags.filter(function(x){return x!==tb;}); else ritTagOn(tb); break;}
   case 'tm': {var t0=RIT.tm||ritMin(ritDraft())||1, st=+b.getAttribute('data-d');
    var t1=st<0?(t0<=10?t0-1:t0-5):(t0<10?t0+1:t0+5);
    RIT.tm=Math.max(1,Math.min(RIT_TM_MAX,t1)); break;}
   case 'often': RIT.on=b.getAttribute('data-v')==='wk'?[0,1,2,3,4]:null; break;
   /* a day pressed off the week. The last day cannot be pressed off: a
      ritual due on no day is not a ritual, and the button says so by staying
      on rather than by an error. All seven on is every day, stored as none. */
   case 'wd': {var wd=+b.getAttribute('data-d'), cur=(RIT.on||[0,1,2,3,4,5,6]).slice(), at=cur.indexOf(wd);
    if(at>=0){if(cur.length>1)cur.splice(at,1);} else cur.push(wd);
    cur.sort(); RIT.on=cur.length===7?null:cur; break;}
   case 'timer': ritTimer(id); return;
   case 'pick': ritPick(b.getAttribute('data-k')); break;
   case 'step-up': {var k=b.getAttribute('data-k'), d=ritDraft(), i=d.indexOf(k);
    if(i>0){d.splice(i,1); d.splice(i-1,0,k); RIT.order=d;} break;}
   case 'all': RIT.all=!RIT.all; break;
   case 'span': RIT.days=+b.getAttribute('data-d'); break;
   /* cancel empties the builder. Opened over another tab by the release, it
      is the close as well, because there is a tab behind it to go back to. */
   case 'cancel': RIT.add=false; RIT.edit=null; RIT.sel={}; RIT.order=[]; RIT.all=false; RIT.from=null;
    RIT.tags=[]; RIT.on=null; RIT.tm=null;
    if(!ritTab()){ritClose();return;} break;
   case 'save': if(RIT.edit)ritSaveEdit(); else ritStart(c); return;
   case 'why': {var bc=ritBecoming(); if(bc)ritStartFor(bc,+b.getAttribute('data-d')); return;}
   /* the release is its own surface and its own door. relPick is the one the
      avatar and the Story page already use, and it refuses nothing here that
      it would not refuse there. */
   case 'rel': if(typeof relPick==='function')relPick([+b.getAttribute('data-n')]); return;
   case 'log': ritLog(id); return;
   case 'logday': ritLog(id,+b.getAttribute('data-d')); return;
   case 'exp': RIT.exp=RIT.exp===id?null:id; break;
   case 'edit': ritEditOpen(id); return;
   case 'up': ritMove(id); return;
   case 'stop': ritStop(id); return;
   case 'again': ritAgain(id); return;
   case 'del-plan': ritDelPlan(id); return;
   case 'del-entry': ritDelEntry(+b.getAttribute('data-i')); return;
   case 'putback': ritPutBack(); return;
   case 'view': RIT.view=b.getAttribute('data-v'); break;
   case 'mo': RIT.mo=Math.min(1,RIT.mo+(+b.getAttribute('data-d'))); RIT.day=null; break;
   case 'day': {var dd=+b.getAttribute('data-d'); RIT.day=RIT.day===dd?null:dd; break;}
   case 'more': RIT.hn+=40; break;
   default: return;}
  ritRender();};
 /* the two fields write to state on the way past rather than on render, so
    the sentence under them updates as they are typed and nothing is lost when
    the card redraws. */
 ['when','where'].forEach(function(k){
  var el=document.getElementById('rit'+k); if(!el)return;
  el.oninput=function(){RIT[k]=el.value;};
  el.onchange=function(){RIT[k]=el.value; ritRender();};});}

/* ---------------- the look ----------------
   Carried by this file and injected once, the way intakeui.js carries its own,
   so the page ships from the one file it lives in. Every colour is a token, so
   all four lightings are the page's own. Rules inside a container query name
   two classes, because the design gate walks into a container rule and reads a
   single class that sets geometry twice as a collision. */
function ritCss(){
 if(document.getElementById('rit-css'))return;
 var st=document.createElement('style'); st.id='rit-css';
 st.textContent=[
  /* 1180 was the cap that left the width unused at 1600, round LT. The stage
     is the limit now; 1760 only stops three columns spreading past reading
     distance on a very wide screen with both rails shut. */
  'body.tab-ritual #rit .rit-card.rv{max-width:1760px}',
  '.rv{container-type:inline-size;container-name:rv;text-align:left}',
  '.rv-note{margin:0 0 12px;font-size:14px;color:var(--mid)}',
  '.rv-lb{display:block;font-size:12.5px;color:var(--dim);font-weight:500}',
  '.rv-h{font-size:15px;font-weight:600;color:var(--ink)}',
  '.rv-h2{display:block;margin:4px 0 6px}',
  '.rv-hd{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 10px}',
  '.rv-sec{margin:0 0 18px;padding:14px;border:1px solid var(--edge);border-radius:14px;background:var(--panel)}',
  '.rv-empty{margin:4px 0;font-size:14px;color:var(--dim)}',
  '.rv-ic{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}',
  '.rv-nic{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}',
  /* the becoming */
  '.rv-why{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:10px 18px;margin:0 0 14px;padding:14px 16px;',
  ' border-radius:14px;border:1px solid color-mix(in srgb,var(--c) 45%,transparent);background:color-mix(in srgb,var(--c) 9%,var(--panel))}',
  '.rv-why-t{flex:1 1 320px;min-width:0}',
  '.rv-why-be{margin:3px 0 6px;font-size:19px;line-height:1.35;color:var(--ink);font-weight:500}',
  '.rv-why-p{margin:0;font-size:15px;line-height:1.55;color:var(--mid);max-width:62ch}',
  '.rv-why-p b{color:var(--c);font-weight:600}',
  '.rv-why-a{margin-top:0}',
  /* the chain */
  '.rv-chain{display:grid;grid-template-columns:1fr 14px 1fr 14px 1.25fr;gap:4px;margin:0 0 18px;align-items:stretch}',
  '.rv-node{display:flex;flex-direction:column;align-items:flex-start;gap:5px;min-height:44px;padding:12px 14px;',
  ' border:1px solid var(--edge);border-radius:14px;background:var(--panel);color:var(--ink);text-align:left;font:inherit;cursor:pointer;',
  ' transition:border-color var(--t-micro) var(--ease-out)}',
  'button.rv-node:hover{border-color:var(--accent)}',
  '.rv-nv{display:flex;align-items:center;gap:9px;color:var(--mid)}',
  '.rv-nv b{font-size:26px;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums;line-height:1}',
  '.rv-nv em{font-style:normal;font-size:14px;color:var(--mid)}',
  '.rv-nv .rv-pn{font-size:18px;line-height:1.25}',
  '.rv-ns{font-size:13px;color:var(--mid)}',
  '.rv-bar{display:flex;gap:2px;width:100%;height:8px}',
  '.rv-bar-s{display:block;border-radius:3px;opacity:.55}',
  '.rv-bar-s.rv-on{opacity:1;box-shadow:0 0 0 1.5px var(--ink)}',
  '.rv-do{border-color:color-mix(in srgb,var(--c) 45%,transparent);background:color-mix(in srgb,var(--c) 8%,var(--panel));cursor:default}',
  '.rv-do svg circle{fill:none;stroke-width:3}',
  '.rv-go{margin-top:4px}',
  '.rv-tag{margin-top:4px;padding:3px 10px;border-radius:999px;font-size:12.5px;color:var(--c);border:1px solid var(--c)}',
  '.rv-arr{display:flex;align-items:center;justify-content:center;color:var(--dim)}',
  '.rv-arr .rv-ic{width:14px;height:14px}',
  '@container (min-width:620px){.rv .rv-chain{grid-template-columns:1fr 28px 1.1fr 28px 1.2fr;gap:6px}',
  ' .rv .rv-arr .rv-ic{width:18px;height:18px}}',
  /* on a phone the chain is one row of three small stops, so the ring that
     marks today done is on the first screen and not under three cards. */
  '@container (max-width:619px){.rv .rv-node{padding:9px 8px;gap:3px;border-radius:12px}',
  ' .rv .rv-nv{gap:5px;flex-wrap:wrap} .rv .rv-nv b{font-size:20px} .rv .rv-nv em{font-size:12.5px}',
  ' .rv .rv-nv .rv-pn{font-size:14px} .rv .rv-nic{width:18px;height:18px} .rv .rv-lb{font-size:12px}',
  ' .rv .rv-ns{font-size:12px} .rv .rv-go{padding:0 14px}}',
  /* columns, see ritLayout. At three columns a column is its own container,
     so the rules written for a narrow card (the hero at 136, the figures as
     rows) apply to a narrow column too: the left one is a phone's width, and
     it reads as one. */
  '.rv-cols{display:grid;grid-template-columns:minmax(0,1fr);gap:0 18px;align-items:start}',
  '.rv-main,.rv-side,.rv-col{min-width:0}',
  '.rv-col,.rv-side{container-type:inline-size}',
  '.rv-pair{display:grid;grid-template-columns:minmax(0,1fr);gap:0 18px}',
  /* at three columns the record keeps the wider share of the left two,
     because seven days of 44 pixel presses is the floor it cannot go under,
     and the new ritual gets enough width that its tags, its timer and how
     often each take one row, which is what keeps it inside the screen */
  '@container (min-width:1080px){.rv .rv-cols{grid-template-columns:minmax(0,2fr) minmax(0,1.2fr)}',
  ' .rv .rv-pair{grid-template-columns:minmax(0,4fr) minmax(0,5fr)}}',
  /* UNDER 1080 THE COLUMNS DISSOLVE AND EVERY PART IS PLACED BY NAME. The
     first cut folded the whole right column in under the chain, and with both
     rails open at 1600 the card is 920 wide and that stacked the new ritual
     panel and the list on top of the two columns that fit before: 1265
     pixels of content in 867, measured, where the build before this round
     fit. So the parts are placed one by one: the new ritual is one press at
     the top of the left column, and the list of what is active sits under
     today's rings where it always sat at this width. The press is not in the
     right column over the record: tried, the record's height then spread
     into the rows beside it and opened a 150 pixel hole under the rings.
     The marks go under the record, where the right column had room to
     spare, and the list runs on into the last row, the one flexible row, so
     neither column is pushed apart by the other's height. On a phone it is
     one column in the order the areas name. */
  /* and a dissolved column stops being a container. Measured: left as one,
     every part inside it asked a box that no longer existed for its width,
     no query of its own matched, and the parts fell into the grid in source
     order, the record under today's rings and the marks beside them. The
     query names the card, rv, because a part inside a column asks its
     column otherwise: at 1920 the right column is 536 wide, under 1079,
     and the new ritual's tags were hidden on the widest screen there is. */
  '@container rv (max-width:1079px){.rv .rv-main,.rv .rv-pair,.rv .rv-col,.rv .rv-side{display:contents;container-type:normal}',
  ' .rv .rv-cols{grid-template-areas:"chain" "new" "today" "act" "marks" "rec"}',
  ' .rv .rv-chain{grid-area:chain} .rv .rv-new{grid-area:new} .rv .rv-today{grid-area:today}',
  ' .rv .rv-act{grid-area:act} .rv .rv-marks{grid-area:marks} .rv .rv-rec{grid-area:rec}',
  ' .rv .rv-new.rv-shut{padding:0;border:0;background:none}',
  ' .rv .rv-shut .rv-hd,.rv .rv-shut .rv-fl,.rv .rv-shut .rv-tags{display:none}}',
  '@container rv (min-width:880px) and (max-width:1079px){.rv .rv-cols{grid-template-columns:minmax(0,5fr) minmax(0,6fr);',
  ' grid-template-rows:auto auto auto auto 1fr;grid-template-areas:"chain chain" "new rec" "today rec" "act rec" "act marks"}}',
  /* ---- colour, round LT: "I want color on this page to separate things,
     everything is gray." Each part takes one hue from tokens the product
     already carries and themes, as a ring before its heading, a wash behind
     it and an edge around it, never as a fill. The loop colours are the
     stations': Imprints is Discover's, because the Story page is there; the
     list of what is active today is Flow's, because Ritual is there; the
     record is Embody's, time kept in the body; the accountability figures
     take Play's green, the one loop colour no part above already holds; and
     the new ritual takes the accent, the colour of every primary press. The
     seat colours stay what they were, the seat's, on the held place, the
     goal and every ring. ---- */
  '.rv-sec{--k:var(--edge-2)}',
  '.rv-act{--k:var(--sec-flow)} .rv-rec{--k:var(--sec-embody)} .rv-new{--k:var(--accent)}',
  '.rv-act,.rv-rec,.rv-new{border-color:color-mix(in srgb,var(--k) 38%,transparent);',
  ' background:color-mix(in srgb,var(--k) 6%,var(--panel))}',
  '.rv-sec>.rv-hd .rv-h::before{content:"";display:inline-block;width:8px;height:8px;margin:0 9px 1px 0;',
  ' border:2px solid var(--k);border-radius:50%}',
  /* Record and its month, the field he named: the heading and the month in
     Embody's colour on a band of it, so the date reads as the record's own */
  '.rv-rec>.rv-hd .rv-h{color:var(--k)}',
  '.rv-calh{padding:2px 6px;border-radius:10px;background:color-mix(in srgb,var(--k) 13%,transparent)}',
  '.rv-mon{color:var(--k)}',
  '.rv-n-imp{--c:var(--sec-discover)}',
  '.rv-n-imp,.rv-n-held{border-color:color-mix(in srgb,var(--c) 32%,var(--edge));background:color-mix(in srgb,var(--c) 5%,var(--panel))}',
  '.rv-n-imp .rv-nic,.rv-n-held .rv-nic{color:var(--c)}',
  'button.rv-n-imp:hover,button.rv-n-held:hover{border-color:var(--c)}',
  /* today */
  '.rv-today{display:flex;align-items:center;gap:18px;margin:0 0 18px;flex-wrap:wrap}',
  '.rv-hero{position:relative;width:180px;height:180px;flex:0 0 auto}',
  '.rv-rings{width:100%;height:100%}',
  '.rv-track{fill:none;stroke:var(--edge-2);opacity:.6}',
  '.rv-s{fill:none;stroke-linecap:round}',
  '.rv-s-done{opacity:1}',
  '.rv-s-plan{opacity:.34}',
  '.rv-s-ahead{opacity:.5;stroke-dasharray:1.5 4}',
  '.rv-s-miss{opacity:.9;stroke:var(--dim)!important;stroke-dasharray:2 3}',
  '.rv-mid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}',
  '.rv-mid b{font-size:40px;font-weight:600;line-height:1;color:var(--ink);font-variant-numeric:tabular-nums}',
  '.rv-mid span{font-size:13px;color:var(--dim);margin-top:4px}',
  '.rv-figs{display:flex;gap:10px;flex:1 1 180px;flex-wrap:wrap}',
  '.rv-fig{flex:1 1 70px;padding:10px 12px;border-radius:12px;background:var(--panel);border:1px solid var(--edge)}',
  '.rv-fig b{display:block;font-size:22px;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums}',
  '.rv-fig small{font-size:13px;font-weight:400;color:var(--mid)}',
  '.rv-fig span{font-size:13px;color:var(--dim)}',
  /* the accountability figures, the line he read as "days best kept
     practiced": their own colour, on the figure and its edge, round LT */
  '.rv-today{--k:var(--sec-play)}',
  '.rv-fig{border-color:color-mix(in srgb,var(--k) 40%,transparent);background:color-mix(in srgb,var(--k) 8%,var(--panel))}',
  '.rv-fig b{color:var(--k)}',
  '.rv-fig span{color:var(--mid)}',
  /* active */
  '.rv-add{display:inline-flex;align-items:center;gap:6px}',
  '.rv-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.rv-item{border-radius:12px;background:var(--panel-2);border:1px solid var(--edge)}',
  '.rv-item.rv-done{border-color:color-mix(in srgb,var(--c) 55%,transparent)}',
  '.rv-row{display:flex;align-items:center;gap:4px}',
  '.rv-log{flex:0 0 56px;height:56px;padding:4px;border:0;background:none;cursor:pointer;border-radius:12px;color:inherit}',
  '.rv-log svg{width:100%;height:100%}',
  '.rv-log:focus-visible,.rv-open:focus-visible,.rv-day:focus-visible,.rv-tile:focus-visible{outline:2px solid var(--accent);outline-offset:1px}',
  '.rv-tick{fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-open{flex:1 1 auto;min-width:0;min-height:56px;padding:8px 10px 8px 2px;border:0;background:none;color:var(--ink);text-align:left;font:inherit;cursor:pointer}',
  '.rv-nm{display:block;font-size:16px;font-weight:500;line-height:1.3}',
  '.rv-sub{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:13px;color:var(--mid);margin-top:3px}',
  '.rv-sub i{font-style:normal;color:var(--dim)}',
  '.rv-more{padding:0 14px 14px 60px}',
  '.rv-step{margin:0 0 10px}',
  '.rv-step b{display:block;font-size:15px;font-weight:600;color:var(--ink);margin-bottom:4px}',
  '.rv-step small{font-weight:400;color:var(--dim);font-size:13px}',
  '.rv-step p{margin:0;font-size:15px;line-height:1.65;color:var(--mid);max-width:62ch}',
  '.rv-if{margin:8px 0 0;font-size:14px;line-height:1.6;color:var(--mid)}',
  '.rv-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;justify-content:flex-end}',
  '.rv-acts .btn{display:inline-flex;align-items:center;gap:6px}',
  /* builder */
  '.rv-min{font-size:14px;color:var(--mid);font-variant-numeric:tabular-nums}',
  '.rv-steps{list-style:none;margin:0 0 10px;padding:0;display:flex;flex-direction:column;gap:6px}',
  '.rv-st{display:flex;align-items:center;gap:8px;padding:0 0 0 12px;border-radius:10px;background:var(--panel-2)}',
  '.rv-st i{width:10px;height:10px;border-radius:50%;background:var(--c);flex:0 0 auto}',
  '.rv-st span{flex:1 1 auto;font-size:15px;color:var(--ink)}',
  '.rv-st small{font-size:13px;color:var(--dim)}',
  '.rv-ib{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;flex:0 0 44px;',
  ' border:0;border-radius:10px;background:none;color:var(--mid);cursor:pointer}',
  '.rv-ib:hover{color:var(--ink);background:var(--panel-2)}',
  '.rv-ib[disabled]{opacity:.3;cursor:default}',
  '.rv-ib[aria-pressed=true]{color:var(--accent)}',
  '.rv-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin:0 0 8px}',
  '.rv-tile{display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-height:44px;padding:10px 12px;',
  ' border:1px solid color-mix(in srgb,var(--c) 30%,var(--edge));border-radius:12px;background:var(--panel-2);',
  ' color:var(--ink);text-align:left;font:inherit;cursor:pointer;transition:border-color var(--t-micro) var(--ease-out)}',
  '.rv-tile svg{width:22px;height:22px;fill:none;stroke:var(--c);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-tile.rv-on{border-color:var(--c);background:color-mix(in srgb,var(--c) 12%,var(--panel-2))}',
  '.rv-tile.rv-big{grid-column:1/-1;padding:14px}',
  /* the called tile keeps its ring beside its name and not above it: a row
     of its own for a 22 pixel ring was what put a tagged new ritual 42
     pixels past the screen at 1600, measured, round LT */
  '.rv-tile.rv-big{display:grid;grid-template-columns:22px minmax(0,1fr);column-gap:10px;row-gap:3px;align-items:center}',
  '.rv-tile.rv-big svg{grid-row:1/span 2}',
  '.rv-tile.rv-big .rv-td{grid-column:1/-1}',
  '.rv-tn{font-size:15px;font-weight:500}',
  '.rv-tm{font-size:13px;color:var(--mid)}',
  '.rv-td{font-size:14px;color:var(--mid);line-height:1.5}',
  '.rv-trk{margin:10px 0 6px;font-size:13px;font-weight:600;color:var(--c)}',
  '.rv-left{margin:10px 0 0;font-size:14px;color:var(--mid)}',
  '.rv-plan{margin-top:12px;padding-top:12px;border-top:1px solid var(--edge)}',
  '.rv-span,.rv-seg{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}',
  '.rv-sp,.rv-sg{min-height:44px;padding:0 14px;border-radius:999px;border:1px solid var(--edge-2);background:none;',
  ' color:var(--mid);font:inherit;font-size:14px;cursor:pointer}',
  '.rv-sp.rv-on,.rv-sg.rv-on{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}',
  '.rv-seg{margin-top:0}',
  /* the new ritual: the closed panel, its tags, the timer, and the week */
  '.rv-new .rv-add{width:100%;justify-content:center;min-height:48px;font-size:15px}',
  /* the last part in a column ends the column; its gap was 18 pixels of
     scroll with nothing under it */
  '.rv-col>:last-child,.rv-side>:last-child{margin-bottom:0}',
  '.rv-fl{display:block;margin:10px 0 5px;font-size:12.5px;font-weight:500;color:var(--dim)}',
  '.rv .rit-f{margin:7px 0}',
  '.rv-tags{display:flex;flex-wrap:wrap;gap:6px}',
  '.rv-tag2{display:inline-flex;align-items:center;gap:7px;min-height:44px;padding:0 12px;border-radius:999px;',
  ' border:1px solid color-mix(in srgb,var(--t) 45%,transparent);background:none;color:var(--mid);font:inherit;font-size:14px;cursor:pointer}',
  '.rv-tag2 i{width:9px;height:9px;border-radius:50%;border:2px solid var(--t);flex:0 0 auto}',
  '.rv-tag2:hover{border-color:var(--t);color:var(--ink)}',
  '.rv-tag2.rv-on{border-color:var(--t);background:color-mix(in srgb,var(--t) 18%,transparent);color:var(--ink)}',
  '.rv-tag2.rv-on i{background:var(--t)}',
  '.rv-row2{display:flex;flex-wrap:wrap;gap:0 16px}',
  '.rv-fld{flex:0 0 auto}',
  '.rv-stp{display:flex;align-items:center;gap:2px;border:1px solid var(--edge-2);border-radius:999px}',
  '.rv-stp b{min-width:58px;text-align:center;font-size:14px;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums}',
  '.rv-stp .rv-ib{border-radius:999px}',
  '.rv-oft{margin-top:0}',
  '.rv-wk{display:grid;grid-template-columns:repeat(7,minmax(44px,1fr));gap:4px;margin-top:8px}',
  '.rv-wkd{min-height:44px;padding:0;border-radius:10px;border:1px solid var(--edge-2);background:none;color:var(--mid);font:inherit;font-size:14px;cursor:pointer}',
  '.rv-wkd.rv-on{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--ink);font-weight:600}',
  /* the timer on a row, and its three states: set, counting, time is up */
  '.rv-tmr{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;min-height:44px;min-width:44px;margin-right:6px;padding:0 12px;',
  ' border:1px solid var(--edge-2);border-radius:999px;background:none;color:var(--mid);font:inherit;font-size:13.5px;',
  ' font-variant-numeric:tabular-nums;cursor:pointer;white-space:nowrap}',
  '.rv-tmr span:empty{display:none}',
  '.rv-tmr:hover{color:var(--ink);border-color:var(--c)}',
  '.rv-tmr.rv-run{border-color:var(--c);color:var(--ink);background:color-mix(in srgb,var(--c) 14%,transparent)}',
  '.rv-tmr.rv-rang{border-color:var(--c);color:var(--ink);font-weight:600}',
  '.rv-tg{display:inline-flex;align-items:center;padding:0 8px;border-radius:999px;font-style:normal;font-size:12.5px;',
  ' color:var(--mid);border:1px solid color-mix(in srgb,var(--t) 50%,transparent)}',
  '.rv-item{box-shadow:inset 3px 0 0 var(--c)}',
  '.rv-cpt .rv-sub,.rv-cpt .rv-tmr,.rv-cpt .rv-more{display:none}',
  '.rv-other{margin:14px 0 8px;font-size:13px;color:var(--dim)}',
  /* the record */
  '.rv-calh{display:flex;align-items:center;justify-content:space-between;margin:0 0 6px}',
  '.rv-mon{font-size:15px;font-weight:600;color:var(--ink)}',
  '.rv-grid{display:grid;grid-template-columns:repeat(7,minmax(44px,1fr));gap:4px}',
  '.rv-wd{text-align:center;font-size:12px;color:var(--dim);padding:2px 0}',
  '.rv-day{position:relative;display:flex;align-items:center;justify-content:center;min-height:48px;aspect-ratio:1/1;max-height:74px;padding:0;border:1px solid transparent;border-radius:12px;',
  ' background:var(--panel-2);color:var(--mid);font:inherit;cursor:pointer}',
  '.rv-day svg{position:absolute;inset:3px;width:calc(100% - 6px);height:calc(100% - 6px)}',
  '.rv-day span{position:relative;font-size:13px;font-variant-numeric:tabular-nums}',
  '.rv-day.rv-now{color:var(--ink);font-weight:600;border-color:var(--edge-2)}',
  '.rv-day.rv-sel{border-color:var(--accent)}',
  '.rv-day.rv-fut{background:none}',
  '.rv-key{display:flex;gap:14px;margin:10px 0 0;font-size:12.5px;color:var(--dim)}',
  '.rv-key span{display:inline-flex;align-items:center;gap:6px}',
  '.rv-key i{display:inline-block;width:12px;height:12px;border-radius:50%;border:2.5px solid var(--accent)}',
  '.rv-key .rv-k-plan{opacity:.4}',
  '.rv-key .rv-k-miss{border-color:var(--dim);border-style:dashed}',
  '.rv-dayh{margin:14px 0 4px;font-size:14px;font-weight:600;color:var(--ink)}',
  '.rv-days{list-style:none;margin:0;padding:0}',
  '.rv-dg{margin:12px 0 2px;font-size:13px;font-weight:600;color:var(--dim)}',
  '.rv-dr{display:flex;align-items:center;gap:10px;min-height:44px;border-bottom:1px solid var(--edge)}',
  '.rv-dot{width:12px;height:12px;border-radius:50%;flex:0 0 auto;border:2.5px solid var(--c)}',
  '.rv-dot.rv-s-done{background:var(--c)}',
  '.rv-dot.rv-s-plan,.rv-dot.rv-s-ahead{opacity:.5}',
  '.rv-dot.rv-s-miss{border-color:var(--dim);border-style:dashed}',
  '.rv-dn{flex:1 1 auto;min-width:0;font-size:14.5px;color:var(--ink)}',
  '.rv-dn small{color:var(--dim);font-size:13px}',
  '.rv-ds{font-size:13px;color:var(--mid)}',
  '.rv-gone{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 10px;padding:6px 6px 6px 12px;',
  ' border-radius:10px;background:var(--panel-2);font-size:14px;color:var(--ink)}',
  '.rv-marks{margin:0 0 18px}',
  '.rv-mk{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}',
  '.rv-m{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;',
  ' border:1.5px solid var(--c);color:var(--c)}',
  '.rv-m svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-next{margin:8px 0 0;font-size:13.5px;color:var(--mid)}',
  '.rv-next b{color:var(--ink);font-weight:500}',
  '@container (max-width:520px){.rv .rv-hero{width:136px;height:136px} .rv .rv-more{padding-left:14px}',
  ' .rv .rv-today{gap:12px;flex-wrap:nowrap} .rv .rv-figs{flex-direction:column;gap:6px;flex:1 1 auto}',
  ' .rv .rv-fig{display:flex;align-items:baseline;justify-content:space-between;gap:8px;padding:7px 10px;flex:0 0 auto}',
  ' .rv .rv-fig b{font-size:18px} .rv .rv-mid b{font-size:32px}}'
 ].join('\n');
 document.head.appendChild(st);}
