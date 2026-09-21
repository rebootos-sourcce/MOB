/* ============================================================
   proto/ladder/roster.js  ·  THE PROFILES, BUILT BY THE ENGINE.

   Nothing in this file invents a number. It loads a roster persona exactly the
   way ui/personas.js loads one, runs compute(), and then drives the real engine
   writers to produce a profile: saveProfile writes the nine axes off S.charge
   and S.replace, meterPlan and meterRun open ground, snapshot() records a
   reading, and the release arithmetic is the exact arithmetic at
   ui/release.js:107 to :113, copied with its constants rather than approximated.

   TWO THINGS ARE STATED RATHER THAN MEASURED, AND THEY ARE LABELLED ON THE PAGE
   BECAUSE THEY HAVE TO BE.

   1. The cadence. How often somebody opens the app is not in the engine. The
      heavy column is the whole ring twice a week for ninety days and the light
      column is one session. Those are the two shapes DESIGN-gamification.md
      section 4 already costs, so they are the honest pair to show.
   2. The selection inside a release. A person picks their own addresses. The
      harness takes the heaviest address still carrying and runs it across the
      four channels, which is the floor sized run DESIGN-progression.md 6.4
      prices at four patterns.

   Everything else on the page is read off a function whose name is printed
   beside it.
   ============================================================ */
(function(root,factory){
 if(typeof module!=='undefined'&&module.exports)module.exports=factory();
 else root.ROSTER=factory();
})(typeof self!=='undefined'?self:this,function(){

/* the four release channels, from ui/release.js:7 */
var CHAN=['Rlimit','Llimit','Rtruth','Ltruth'];
var DAY=86400000;

/* ---- loaded exactly as ui/personas.js and proto/game/gen.js load one ---- */
function loadPerson(E,per){
 var S=E.S;
 S.dom=per.dom; S.a1=per.a1; S.a2=per.a2;
 S.doms=[per.dom]; S.arcs=[per.a1,per.a2]; S.roots=[];
 E.buildSoul();
 E.CHARGES.forEach(function(c){
  S.charge[c]=(per.c&&per.c[c]!==undefined)?per.c[c]:0;
  S.replace[c]=(per.rep&&per.rep[c])||0;});
 var LS=E.LAWSET[per.nm]||{_:5.5};
 E.SINAMES.forEach(function(l){
  S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:5.5);});
 return E.compute();}

/* ---- THE RELEASE, AND IT IS THE PRODUCT'S OWN ARITHMETIC.

   ui/release.js:107 to :113, constant for constant. w0 is sq on a nought to a
   hundred scale, the drop is twenty one percent of it plus two, the share is
   the drop spread across the addresses in the run that share a fetter, and the
   opposite fills at sixty two percent of what emptied. Reproduced here rather
   than referenced because the engine half is in ui/ and a prototype may not
   reach into the UI layer, and approximating it would make every number on the
   page a guess.

   It is the one piece of arithmetic in this folder copied out of another file,
   and if it moves there it must move here. Said out loud because a copy nobody
   knows about is the defect this repository keeps paying for. ---- */
function runRelease(E,queue){
 var S=E.S, clamp=function(v,a,b){return v<a?a:(v>b?b:v);};
 var freed=0;
 queue.forEach(function(n){
  var w0=n.sq*10;
  var d=-Math.round(w0*0.21+2);
  freed+=Math.abs(d);
  var same=queue.filter(function(q){return q.cf===n.cf;}).length;
  var share=Math.abs(d)/10/Math.max(1,same);
  S.charge[n.cf]=clamp((S.charge[n.cf]||0)-share,0,10);
  S.replace[n.cf]=clamp((S.replace[n.cf]||0)+share*0.62,0,10);});
 return freed;}

/* the addresses a release would be dealt: the heaviest still carrying. A person
   picks their own, so this is the stated part. */
function deal(E,p,r,many){
 /* ONLY WHAT THE READING LOADS, AND NO FALLBACK.

    A first cut fell back to every address in W with any charge on it when the
    reading loaded nothing, which quietly gave Rosa and Lance ground to open and
    hid the finding. There is no fallback now: if the reading loads nothing, the
    release deals nothing, and the marks that need ground stay unearned. That is
    the measurement, and a harness that softens it is a harness that lies. */
 var open={};
 T_addr(p).forEach(function(id){open[id]=1;});
 /* the pool is anything the reading says is carrying, in the order the release
    surface would rank it. excess is the release candidate list, jq at four or
    above. loaded and carrying are the wider pool a person can pick from at
    ui/release.js:48, which takes whatever node ids the surface hands it. The
    union is therefore what the product can actually offer, and a person at the
    top of the range with nothing carrying gets nothing, which is the finding. */
 var seen={}, pool=[];
 [(r&&r.excess)||[], (r&&r.loaded)||[], (r&&r.carrying)||[]].forEach(function(a){
  a.forEach(function(n){ if(n&&n.cf&&!seen[n.i]){seen[n.i]=1; pool.push(n);} });});
 pool.sort(function(a,b){return (b.sq||0)-(a.sq||0);});
 /* new ground first, which is what a person came for and what a plan buys */
 var fresh=pool.filter(function(n){return !open[String(n.i)];});
 return (fresh.length?fresh:pool).slice(0,many||1);}
/* the addresses already opened, read off the meter keys */
function T_addr(p){
 var s={};
 (((p&&p.meter&&p.meter.unique))||[]).forEach(function(k){
  var id=String(k).split(':')[0]; if(id)s[id]=1;});
 return Object.keys(s);}

/* ---- ONE VISIT. The whole ring once, in the order the loop runs it. ---- */
function visit(E,p,t,opt){
 var o=opt||{};
 /* DISCOVER. the entry, stamped. the text is the persona's own line from
    PEOPLE[].says, which this repository wrote as the voice of that person, so
    even the string is not authored here. */
 p.story.entries.push({t:new Date(t).toISOString(), text:o.says||'',
  seat:o.seat||'', n:1});
 /* PLAY. a ritual saved, with a track off PRACTICE and its own minutes. */
 var pr=o.practice||E.PRACTICE[0];
 var ritual={t:new Date(t).toISOString(), track:pr.track, band:'',
  steps:[pr.k], min:pr.min, when:'', where:'',
  /* FLOW. marked done, which is the second stamp and the one that keeps the
     day. A plan that is never marked done keeps nothing and this design does
     not pretend otherwise. */
  done:new Date(t+45*60000).toISOString()};
 if(o.floor){ ritual.floor=true; ritual.min=1; }
 p.rituals.push(ritual);
 /* the ground the release opens, keyed by the real meter */
 var r=E.compute();
 var q=deal(E,p,r,o.addrs||1);
 if(q.length){
  var keys=E.meterPlan(p, q.map(function(n){return n.i;}), CHAN, E.RUN_MAX||25);
  E.meterRun(p,keys);
  q.forEach(function(n){ E.meterFirst(p,'addr:'+n.i, n.k+', '+n.b); });
  runRelease(E,q);
  /* AND THE RELEASE HAS TO LAND ON THE PROFILE.

     The first cut of this harness moved S.charge and S.replace and never wrote
     them back, so twenty two closed circles produced a reading that had not
     moved by a thousandth and every Moved award read zero. The app does not
     have that bug: saveProfile at engine/schema.js:115 writes the nine axes off
     S on every save. The harness now does what saveProfile does, which is the
     only honest way to show what ninety days of releases is worth. */
  E.CHILD.forEach(function(c){
   p.axes[c.nm]={held:E.S.charge[c.nm]||0, opp:E.S.replace[c.nm]||0};});}
 /* EMBODY. the next reading, on the record. snapshot() calls compute() itself,
    so it reads the field the release just changed. */
 var s=E.snapshot(p);
 /* THE CEILING, ON THE SNAPSHOT. The one number the Closed family needs and the
    record does not carry. cqCeiling is already exported and already pure, so
    this is the whole addition: snapshot() gains one field. Written here so the
    prototype can show what the family is worth before anybody changes the
    schema for it. */
 s.ceil=E.cqCeiling();
 s.t=new Date(t+46*60000).toISOString();
 p.history.push(s);
 return p;}

/* ---- THE LIGHT COLUMN. Day one, one session. ---- */
/* the laws, off LAWSET, so the profile describes the same person the persona
   does. Without them every law reads LAW_DEFAULT and the profile's reading is a
   different person's reading, which made the light column's CQ disagree with
   the roster table by up to sixteen points. */
function setLaws(E,p,per){
 var LS=E.LAWSET[per.nm]||{_:5.5};
 E.SI.forEach(function(l){
  var v=(LS[l.nm]!==undefined)?LS[l.nm]:(LS._!==undefined?LS._:null);
  p.laws[l.nm]=v;});}
function light(E,per,t0){
 var r=loadPerson(E,per);
 var p=E.blankProfile(per.nm+', day one');
 p.soul={doms:[per.dom], arcs:[per.a1,per.a2], roots:[]};
 p.created=new Date(t0).toISOString();
 /* the nine axes, written by the engine's own writer off S, which is the only
    thing that puts a charge on a profile anywhere in this product. */
 E.CHILD.forEach(function(c){
  p.axes[c.nm]={held:E.S.charge[c.nm]||0, opp:E.S.replace[c.nm]||0};});
 /* the intake and the birth date are the two things a first session asks for
    and they are real inputs, not scores. The date is derived from the roster
    age so the marker ruler resolves against the person rather than against the
    reference scale, which is the difference meterRead prints as `scaled`. */
 var yr=new Date(t0).getUTCFullYear()-per.age;
 p.who.born.date=yr+'-06-15';
 setLaws(E,p,per);
 /* the intake and the stated type are what a first session asks for, on the
    strong default ruled in CLAUDE.md, so the light column is a real first
    session and not a blank record with one entry in it. */
 p.intake.completedAt=new Date(t0).toISOString();
 p.seed={type:'INFJ', at:new Date(t0).toISOString(), axes:{}};
 E.CHILD.forEach(function(c){p.seed.axes[c.nm]=3;});
 visit(E,p,t0,{says:per.says, practice:E.PRACTICE[0]});
 return p;}

/* ---- THE HEAVY COLUMN. Ninety days, the whole ring twice a week. ---- */
function heavy(E,per,t0,days,perWeek){
 var r=loadPerson(E,per);
 var p=E.blankProfile(per.nm+', ninety days');
 p.soul={doms:[per.dom], arcs:[per.a1,per.a2], roots:[]};
 p.created=new Date(t0).toISOString();
 E.CHILD.forEach(function(c){
  p.axes[c.nm]={held:E.S.charge[c.nm]||0, opp:E.S.replace[c.nm]||0};});
 var yr=new Date(t0).getUTCFullYear()-per.age;
 p.who.born.date=yr+'-06-15';
 setLaws(E,p,per);
 p.intake.completedAt=new Date(t0).toISOString();
 p.seed={type:'INFJ', at:new Date(t0).toISOString(), axes:{}};
 E.CHILD.forEach(function(c){p.seed.axes[c.nm]=3;});
 var n=days||90, w=perWeek||2;
 /* THE GAP IS IN HERE ON PURPOSE. Days 44 to 58 carry nothing, because the
    hardest case this design is judged on is a person who could not face it for
    a fortnight and then opened it again. It is the only way to see whether the
    ladder punishes that, and the Came back mark is the only thing in the
    product that reads it. */
 var gap0=44, gap1=58;
 for(var d=0;d<n;d++){
  if(d>=gap0&&d<gap1)continue;
  if(Math.floor(d*w/7)===Math.floor((d-1)*w/7)&&d>0)continue;
  var pr=E.PRACTICE[d%E.PRACTICE.length];
  visit(E,p,t0+d*DAY+9*3600000,
   {says:per.says, practice:pr, addrs:1, floor:(d%7===3)});}
 return p;}

/* ---- and the profile as the app would actually hold it: loadProfile puts it
   back into S so compute() reads the person the profile describes, which is
   what every surface in the product does before it renders. ---- */
function readingOf(E,p){ E.loadProfile(p); return E.compute(); }

return {CHAN:CHAN, loadPerson:loadPerson, setLaws:setLaws, runRelease:runRelease, deal:deal,
 visit:visit, light:light, heavy:heavy, readingOf:readingOf};
});
