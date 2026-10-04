/* ============================================================
   A WORKED EXAMPLE'S RITUALS. Round RB, 3 October, the owner's words: "For
   profiles, I want these rituals to have different configurations for the
   profile so I can see how it actually looks when it's being utilized."

   WHAT WAS THERE, measured before this file was written. Every worked example
   opened the Ritual page on zero plans and zero logged days: Derek, Diane and
   the blank all read plans 0, act 0, log 0 on a fresh page. Two reasons, both
   by design. The plans live beside the record under atuned-ritual-active,
   keyed by the record's id (ui/ritual.js ritPlans), and ritPlanPut refuses a
   worked example, because a demonstration is never stored. And exdepthFill
   gives an example a bank and a vault but writes no day log. So every example
   showed the same empty page, which is no demonstration of a ritual at all.

   WHY NOT engine/practice.js. The brief named Goal, Protocol, Ritual and
   PracticeEvent, and they were checked first. The Ritual page reads none of
   them: it reads the plans beside the record and p.rituals, the day log, and
   practice.js says in its own header that the cutover from that log to its
   objects is NOT run, because two writers of one day is two truths. A history
   written into practice objects would draw nothing on this page. So this file
   writes the two shapes the page does read, and engine/pracex.js keeps the
   practice objects the practitioner page reads. Each example's shape here is
   the one PRACEX_HIST gives it there (Derek every day, Diane stops at the end,
   Ana stops and starts, James and Gordon say yes to nothing), so the two pages
   tell one story about one person.

   WHAT IS AUTHORED AND WHAT IS READ, the discipline exdepth.js and pracex.js
   set. Authored, per ritual: its practices, its seat, which weekdays, how
   long it runs, how many days ago it started (and stopped, when it did), the
   when and where, and one character per day it was due. Read, by the
   product's own code: whether a day was due (the plan, the same arithmetic as
   ritCovers), every streak, mark, percent, cube and count on the page
   (ladderRead, ritRunRead, ritDaySegs, all off what is written here).

   THE SHAPES ARE THE WRITERS' OWN. A plan is exactly what ritStartPlan pushes
   and a day is exactly what ritEntryOf builds and ritMarkOn stamps, and every
   day goes through vRitual, the boundary's own rule for a day, so a history
   the product could not have written for a real person is a thrown error
   naming the ritual. The start day carries an entry whether or not it was
   kept, because ritStartPlan writes one the moment a ritual starts.

   NEVER STORED. The day log goes onto the scratch record loadP keeps per
   example (PROF_BY, ui/personas.js), which never joins PROFILES and is never
   persisted, and the plans are handed back for the page to hold in memory.
   HOST FREE: the moment is passed in.
   ============================================================ */

/* ONE ROW PER RITUAL.
     k      the practices, in order, PRACTICE keys joined by +
     b      the seat it is kept at, which colours its ring
     on     the weekdays it is due, Monday 0, or null for every day
     n      how many days it runs from the day it started, 0 for no end
     back   how many days ago it started; today is 0
     stop   how many days ago it was stopped, when it was
     w, at  the when and the where, the builder's two fields
     d      one character per day it was due, oldest first, from the day it
            started to yesterday: c kept, m missed. A row shorter than the run
            repeats, so a rhythm is written once.
     end    the last due days before today, oldest first, written over the
            tail of d. A rhythm that cycles cannot say how a run ends, and
            whether the weekdays leave nine due days or eleven depends on the
            day the page is opened, so "stopped for the last three" is said
            here and not counted out by hand.
     td     1 when today is already kept
   A missed day is no entry at all, which is how the page reads one: a day it
   was due with nothing done. */
var RITEX_HIST={
 Sofia:[
  {k:'escan', b:'Throat', on:[0,2,4], n:0, back:20, w:'After the last client', at:'The car, before driving home', d:'cm'},
  {k:'tu_plain', b:'Throat', on:null, n:7, back:4, w:'Before the first session', at:'Studio', d:'c', td:1}],
 Diane:[
  {k:'truth+slow', b:'Solar', on:null, n:14, back:12, w:'6:30, before the laptop', at:'Kitchen', d:'c', end:'mmm'},
  {k:'sig', b:'Solar', on:[0,1,2,3,4], n:0, back:19, w:'Before the board call', at:'Office', d:'c', end:'mm'}],
 Marcus:[
  {k:'listen', b:'Throat', on:[0,1,2,3,4], n:14, back:6, w:'In the review', at:'Studio floor', d:'cc', td:1}],
 Angela:[
  {k:'box', b:'Root', on:null, n:0, back:18, w:'When I wake', at:'Bedroom', d:'cmcmmcc'},
  {k:'heartpt', b:'Heart', on:[1,3,5], n:14, back:16, w:'Evening', at:'The hospital car park', d:'cmc'},
  {k:'candle', b:'3rd Eye', on:null, n:7, back:30, w:'Late', at:'Living room', d:'cmmcm'}],
 Derek:[
  {k:'box+truth', b:'Solar', on:null, n:0, back:40, w:'6:00, before the run', at:'Garage', d:'c', td:1},
  {k:'resist', b:'Root', on:[0,2,4], n:14, back:9, w:'After the walk', at:'Back step', d:'c'},
  {k:'sysbreath', b:'Sacral', on:null, n:7, back:27, w:'Bed', at:'Bedroom', d:'c'}],
 Ana:[
  {k:'heartpt', b:'Heart', on:[1,3,5], n:0, back:25, w:'Before school run', at:'The park bench', d:'ccmmcmc'},
  {k:'box', b:'Solar', on:null, n:7, back:3, w:'At three, when I wake', at:'Bed', d:'cm'},
  {k:'noting', b:'Sacral', on:null, n:0, back:22, stop:9, w:'Lunch', at:'Kitchen', d:'ccmcm'}],
 Tomas:[
  {k:'box', b:'Root', on:null, n:1, back:0, w:'Morning', at:'The end of the street', d:''}],
 Wren:[
  {k:'hands', b:'Root', on:[0,1,2,3,4,5], n:0, back:36, w:'At the bench, first thing', at:'Workshop', d:'c', td:1},
  {k:'na_tend', b:'Heart', on:[6], n:0, back:30, w:'Sunday morning', at:'Garden', d:'c'}],
 Abraham:[
  {k:'noting', b:'Throat', on:null, n:0, back:60, w:'Dawn', at:'The front room', d:'ccccccccccccccm', td:1},
  {k:'observer', b:'Crown', on:[6], n:0, back:45, w:'Sunday', at:'The front room', d:'c'}],
 'Lance 15':[
  {k:'box', b:'Root', on:null, n:7, back:5, w:'Before the laptop opens', at:'Desk', d:'cmm'}],
 'Lance 50':[
  {k:'box', b:'Root', on:null, n:0, back:24, w:'Before the laptop opens', at:'Desk', d:'ccccmc'},
  {k:'letmove', b:'Root', on:[0,2,4], n:14, back:10, w:'After lunch', at:'The walk with the dog', d:'cmc'}],
 'Lance 85':[
  {k:'truth+box', b:'Solar', on:null, n:0, back:35, w:'Before the laptop opens', at:'Desk', d:'ccccccccccm', td:1},
  {k:'meetit', b:'Solar', on:[0,1,2,3,4], n:14, back:12, w:'Before a design call', at:'Desk', d:'c'},
  {k:'heartpt', b:'Heart', on:[5,6], n:0, back:20, w:'Weekend morning', at:'The back step', d:'c'}],
 'Lance 100':[
  {k:'noting', b:'Root', on:null, n:0, back:50, w:'Dawn', at:'The back step', d:'c', td:1},
  {k:'chakra', b:'Crown', on:[6], n:0, back:42, w:'Sunday', at:'The back step', d:'c'}]};

/* the weekday of a day key, Monday 0, and whether a plan is due on a day:
   ui/ritual.js ritWd and ritCovers, the same arithmetic, here because the
   engine cannot call a renderer. tests/flowtools.js FT33 reads the page's own
   kept and missed counts back against this file, so the two cannot drift. */
function ritexWd(day){return ((day%7)+7+3)%7;}
function ritexCovers(x,s,day,today){
 if(day<s||day>today)return false;
 if(x.on&&x.on.indexOf(ritexWd(day))<0)return false;
 if(x.n&&day>=s+x.n)return false;
 if(x.stop!=null&&day>=today-x.stop)return false;
 return true;}
/* a day key back to local noon on that day, ui/ritual.js ritDayIso, so a day
   lands on the day it names in whatever zone the page runs in */
function ritexIso(day,now){
 var off=new Date(now).getTimezoneOffset()*60000;
 return new Date(day*DAY_MS+off+12*3600000).toISOString();}
function ritexMin(steps){
 return steps.reduce(function(a,k){var pr=PRACTICE.filter(function(q){return q.k===k;})[0]; return a+(pr?pr.min:0);},0);}

/* THE BUILD. Returns {plans, rituals, kept, missed} for the example, or null
   for one with no row, and throws naming the ritual on anything the boundary
   would refuse. Writes nothing: loadP puts the day log on the scratch record
   and the plans where the page reads them. */
function ritexBuild(p,now){
 var rows=p&&RITEX_HIST[p.nm]; if(!rows)return null;
 var today=pracDay(now), plans=[], log=[], kept=0, missed=0, stamp=new Date(now).toISOString();
 rows.forEach(function(x,j){
  var nm=p.nm+' '+x.k, steps=x.k.split('+');
  steps.forEach(function(k){if(!RIT_STEP[k])throw new Error('ritex '+nm+': '+k+' names no practice');});
  if(BANDS.indexOf(x.b)<0)throw new Error('ritex '+nm+': '+x.b+' is not a seat');
  if(x.stop!=null&&x.stop>x.back)throw new Error('ritex '+nm+': stopped before it started');
  var pr=PRACTICE.filter(function(q){return q.k===steps[0];})[0];
  var s=today-x.back, from=x.back?ritexIso(s,now):stamp;
  plans.push({id:'ex'+j+'_'+String(p.nm).replace(/\W+/g,'').toLowerCase(), steps:steps, when:x.w||'', where:x.at||'',
   days:x.n, from:from, stop:x.stop!=null?ritexIso(today-x.stop,now):null, band:x.b, track:pr.track,
   rel:null, tc:null, tags:[x.b], on:x.on?x.on.slice():null, tm:null});
  var day=function(d,done){
   var e={t:d===today?stamp:ritexIso(d,now), steps:steps.slice(), min:ritexMin(steps),
    when:x.w||'', where:x.at||'', done:done, track:pr.track, band:x.b};
   var errs=[]; vRitual(errs,log.length,e);
   if(errs.length)throw new Error('ritex '+nm+': '+errs.join('; '));
   log.push(e);};
  var due=[], d;
  for(d=s;d<today;d++)if(ritexCovers(x,s,d,today))due.push(d);
  var end=x.end||'', cut=due.length-end.length, said={};
  due.forEach(function(d,i){
   said[d]=(i>=cut?end.charAt(i-cut):x.d.charAt(i%Math.max(1,x.d.length)))==='c';});
  if(ritexCovers(x,s,today,today))said[today]=!!x.td;
  for(d=s;d<=today;d++){
   var on=!!said[d];
   /* counted the way ritRunRead counts: today once it is kept, never as a
      miss while it can still be kept. FT33 found the two a day apart on
      Derek, who had kept today. */
   if(d in said){if(on)kept++; else if(d<today)missed++;}
   if(on)day(d,d===today?stamp:ritexIso(d,now));
   /* the start day keeps its entry, as set, the one ritStartPlan writes */
   else if(d===s)day(d,false);}});
 /* oldest first, the order the product appends in */
 log.sort(function(a,b){return Date.parse(a.t)-Date.parse(b.t);});
 return {plans:plans, rituals:log, kept:kept, missed:missed};}

/* whether a record already carries a day log, asked the way exdepthHas asks,
   because the practitioner page can make an example's record before a load */
function ritexHas(rec){return !!rec&&((rec.rituals||[]).length>0);}

if(typeof module!=='undefined'&&module.exports){
 Object.assign(module.exports,{RITEX_HIST:RITEX_HIST, ritexBuild:ritexBuild, ritexHas:ritexHas,
  ritexCovers:ritexCovers, ritexWd:ritexWd});}
