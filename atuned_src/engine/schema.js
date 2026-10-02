
/* ============================================================
   SOURCE PROFILE SCHEMA v1 · the cross-compatibility contract.
   Every number in the app derives from this and nothing else.
   Versioned so a v2 can migrate rather than break.
   ============================================================ */
/* v2 adds gates. The VERP mix is a cost multiplier of 0.60 to 1.35 on every
   held pattern, and in v1 it was never written down, so a reload silently
   moved every CQ in the app. A v1 profile still loads: gates absent reads as
   zeroes, which is exactly what no story evidence means. Saving upgrades it.
   This touches the cross-compatibility contract with SOURCE, so the bump is
   flagged for his ruling in REVIEW-source.md. */
var SCHEMA_V=2, PKEY='source.profiles';
function blankProfile(name){
 var p={v:SCHEMA_V, id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
  name:name||'New profile', created:new Date().toISOString(), updated:null,
  soul:{doms:[0], arcs:[0,1], roots:[]},            /* the invariant */
  axes:{},                                          /* nine poled child fetters */
  /* who. name, sex at birth, and the birth moment. Nothing derived is
     stored: the energetics are pure functions of these three strings, so a
     sixth system still costs nothing. timeUnknown is explicit, because an
     unknown birth time changes what can be read and must not be guessed. */
  /* sealed is the stamp from the moment the person pressed save on their own
     identity. Ruled: once it is in, the block rolls up and an edit control is
     what reopens it, because a birth moment does not change and a form left
     open invites somebody to fiddle with the one input that cannot be wrong. */
  who:{first:'', middle:'', last:'', sex:'', sealed:'',
   born:{date:'', time:'', place:'', zone:'', timeUnknown:false}},
  /* PER PROFILE INTERFACE PREFERENCES. quiet is the reduced motion switch the
     phone spec asked for and nothing had built; model is the consent to let a
     story with nothing identifying attached refine the reading, and it is off
     until a person turns it on, because it is a use of their own words. tone
     is the seat tone under a release, and it is off until a person turns it on
     for the same reason in a different organ: it is a sound in their ears.
     voice is the spoken release, and it is ON, the one sound that is: a
     protocol built to be heard that opened silent was the defect recorded at
     TASKS RF10, "pressing begin played nothing". The panel names the voice
     and where it runs before it says a word, and one switch turns it off.
     buzz is the vibration under the release's marks, off like the tone.
     practitioner is round LL's mode, and it is off: it puts a Practitioner
     section in the bar, and a door a person never asked for is a door they
     have to work out how to get rid of. sfx is the interface's own sounds,
     ui/sound.js, and sfxoff is the person turning them off: round OJ, his
     ruling "sound on by default", so the stored fact is the OFF, which a
     profile written before the ruling cannot have set by accident (the old
     sfx:false was the blank's own default and not a choice, so it is
     ignored and kept only so an older record still validates). studio is the
     ElevenLabs voice in the release, off: the browser voice is the default by
     ruling, and a voice that sends each line to a company over the network is
     one a person chooses, never one they find already on. */
  ui:{quiet:false, model:false, tone:false, voice:true, buzz:false, practitioner:false, sfx:false, sfxoff:false, onboarded:false, tutorialSeen:false, paidWelcomed:false, studio:false},
  /* what the person said their type is, and what it wrote. null until stated. */
  seed:null,
  /* THE METER. One pattern is one release line delivered: one channel over
     one address. A six channel sweep over one address is six.

     Lines counts every line ever spoken, repeats included, because a person
     may rerun anything as often as they like and that is free. Unique holds
     the keys of the lines run at least once, and that is what the tier
     ladder buys: a tier is not how much you may speak, it is how much new
     ground you may open. It lives on the record and is never derived,
     because a derived count moves when the model moves and then the tier
     gate disagrees with the app about what was run. */
  meter:{lines:0, unique:[], firsts:[], first:null, last:null,
   /* the moment the unique count reached the gift's size, stamped once by
      meterRun. It is a fact about the work, like first and last, and it is
      what the free tier's weeks are counted from (planWeeks, engine/plan.js),
      because nothing in a one file build is there to start a week. */
   giftAt:null,
   /* RELLINES AND TRUTHLINES, round LY. His words: "total number of
      patterns released, total number of patterns installed, over the
      history." lines already counts every line ever spoken, release and
      reframe together; these two split it by channel, the same split
      relCounts already reads for one session. Neither is derived from
      lines at read time, the same reasoning lines itself gives for not
      being derived: a rule that moved would move a number that already
      told somebody what they did. */
   relLines:0, truthLines:0,
   /* HEAVY, round OG. The line keys a person marked heavy while they were
      said, a sorted list with no repeats, and every key in it is also a key
      in unique, because a line that was never opened cannot have been heavy.
      A fact about a line and not about a run, so it is stored here and not
      in RUN.heavy, which is keyed by plan index and pass and is gone when the
      card closes. The rerun reads it (meterRerunOrder). Nothing that prices a
      run reads it: the allowance counts unique and never this. */
   heavy:[]},
  /* THE PLAN. Written by the record store from the processor's own state and
     never by the app, because a record a person can edit must not be able to
     grant itself a tier. Everything here is either the processor's word for
     something or a number the processor sent, so a record round trips without
     translation, and translation is where access bugs live.

     There is no customer id, no subscription id, no email and no key. The app
     does not need any of them to answer what somebody may open, and holding an
     identifier it does not need is how a promise about a name gets broken. */
  /* base is null and not 0: null says no host has opened a period yet, and
     planAllowance reads that as the end of the gift. A literal 0 here was read
     as a period opened at nothing, charged the gift against the first free
     week, and read nought left for good. */
  plan:{tier:'free', status:'', granted:0, carried:0, base:null, since:null, until:null},
  /* THE BECOMING HALF. Who you are becoming, what that is for, and what is
     yours to protect. Six values in on the purpose map and nothing derived is
     stored, because a derived value that is also stored is one that can
     drift. */
  avatar:avatarBlank(), purpose:purposeBlank(),
  laws:{}, intake:{answers:{}, done:[], startedAt:null, completedAt:null,
   /* the three blocks stacked under the 63, engine/intakemore.js. Evidence and
      read by no sum. Additive: an older record has none and is filled from this
      blank, with no SCHEMA_V bump. */
   more:ixBlank()},
  /* THE RELEASES SINCE EACH LAW WAS ANSWERED, by law: n patterns of new ground
     at the law's seat, counted against the answer on. CQ reads a law as its
     answer lifted by these (engine/compute.js, LIFT_R). Kept beside the answer
     and never written into it, because iqApply rewrites every answered law
     from the raw answers on every read, and a lift stored in p.laws would be
     wiped by opening the Intake. Empty on every record until a release runs. */
  work:{},
  gates:{verp:{aware:0,detach:0,intent:0,ignore:0,attach:0,averse:0},
         lean:{benign:0,malignant:0}},   /* the cost multiplier, v2 */
  story:{entries:[]}, rituals:[], history:[],
  /* THE PRACTICE OBJECTS, engine/practice.js. Additive: an older record has
     none and is filled from this blank, and no SCHEMA_V bump, which is the
     owner's call. p.rituals above is the Ritual tab's day log and is a
     different thing; see PRACTICE-AUDIT.md for why both exist for now. */
  practice:practiceBlank()};
 /* held was 3 on every axis, and this is the profile a new person gets. The
    laws beside it are correctly null, meaning not yet measured, and the charge
    was not given the same honesty. Nobody entered a 3. Zero is the only value
    that is true of a person who has said nothing. */
 CHILD.forEach(function(c){p.axes[c.nm]={held:0,opp:0};});
 SI.forEach(function(l){p.laws[l.nm]=null;});        /* null = not yet measured */
 /* the trace graph's stored half, engine/trace.js. Only what cannot be
    derived from the record lives here; everything else is read off it. */
 p.trace=traceNew();
 /* the bank of frozen days, engine/daily.js. Additive: an older record has
    none and is filled from this blank, and no SCHEMA_V bump, which is the
    owner's call. Named here AND at the boundary below, because a key the
    boundary does not name is deleted on the next load. */
 p.summaries=dlyBlank();
 return p;}
/* WHICH LAWS ARE SITTING ON THE SEED, AND WHAT THEY WERE SEEDED WITH.
   LAW_DEFAULT is the seed itself and it moved to engine/core.js, which is the
   module that first uses it: this one named the number and core.js printed a
   literal 6 beside a comment about it, and ui/personas.js then named two more
   numbers for the same quantity. One declaration, at the first use. */
var LAW_UNSET={}, LAW_SEED={};
/* WHAT A LAW WAS CALLED BEFORE, current name to old. Expression and
   Discernment were the twenty one until the owner ruled that Justice and
   Humility are. A law is keyed by name in every saved profile, so an old name
   is carried across rather than dropped. It lived inside loadProfile and is
   out here because the history rows now carry laws by name too, and a table
   of renames kept in two places is two answers that drift: the next rename
   written into one and not the other would refuse every older row at the
   boundary. Expression is a whole separate law axis in the codex and keeps its
   own name there. */
var LAW_WAS={Justice:'Expression', Humility:'Discernment'};
/* AND THE RECORD THEY CAME FROM, as the object. The release lift reads the work
   of the record the laws in S were loaded from and of no other (lawWork,
   engine/compute.js). It was CURP, and the front door loads a profile into S
   without making it CURP, so read() of a profile carrying work dropped its lift.
   Set wherever S.rec is set, which is here and loadP. */
var LAW_REC=null;
function loadProfile(p){
 if(!p.who)p.who={first:'',middle:'',last:'',sex:'',born:{date:'',time:'',place:'',zone:'',timeUnknown:false}};
 if(!p.who.born)p.who.born={date:'',time:'',place:'',zone:'',timeUnknown:false};
 if(!p.meter)p.meter={lines:0,unique:[],first:null,last:null,giftAt:null};
 if(!Array.isArray(p.meter.unique))p.meter.unique=[];
 if(p.meter.giftAt===undefined)p.meter.giftAt=null;
 /* an older record has no split, which is not a record round LY started
    counting for yet, so it opens at nought rather than at undefined */
 if(typeof p.meter.relLines!=='number')p.meter.relLines=0;
 if(typeof p.meter.truthLines!=='number')p.meter.truthLines=0;
 /* an older record has no heavy marks, which is a record that never marked
    one and not a broken one, so it opens with an empty list */
 if(!Array.isArray(p.meter.heavy))p.meter.heavy=[];
 /* an older record has no plan, which is a free record and not a broken one */
 if(!p.plan)p.plan={tier:'free',status:'',granted:0,carried:0,base:null,since:null,until:null};
 /* a missing baseline is filled as missing. A 0 already on disk is left as
    written and read through the gift floor in planAllowance. */
 if(p.plan.base===undefined)p.plan.base=null;
 if(!p.avatar)p.avatar=avatarBlank();
 if(!Array.isArray(p.avatar.pairs))p.avatar.pairs=[];
 if(!p.purpose)p.purpose=purposeBlank();
 /* a record from before the release lift has done no work since its answers,
    which is exactly what an empty map says */
 if(!p.work||typeof p.work!=='object'||Array.isArray(p.work))p.work={};
 /* a record from before the practice objects has none, which is a record
    nobody has built a practice on yet */
 if(!p.practice||typeof p.practice!=='object'||Array.isArray(p.practice))p.practice=practiceBlank();
 /* and a record from before the daily summary has no bank of days, which is a
    record that has never opened one */
 if(!p.summaries||typeof p.summaries!=='object'||Array.isArray(p.summaries))p.summaries=dlyBlank();
 /* soul was the one field this did not fill, and it is the one the next line
    reads without a guard. Six fields were defended and the seventh took the
    boot down. */
 if(!p.soul)p.soul={doms:[0],arcs:[0,1],roots:[]};
 /* and a record from before the archetype and axis blocks has no answers to
    them, which is a record that was never asked */
 ixFill(p);
 S.doms=(p.soul.doms||[0]).slice(); S.arcs=(p.soul.arcs||[0,1]).slice();
 S.roots=(p.soul.roots||[]).slice(); buildSoul();
 CHILD.forEach(function(c){var a=p.axes[c.nm]||{};
  S.charge[c.nm]=a.held!=null?a.held:3; S.replace[c.nm]=a.opp||0;});
 /* an old name's score is carried across rather than dropped back to the
    default a person never entered (LAW_WAS, above) */
 var LAWWAS=LAW_WAS;
 SI.forEach(function(l){
  var v=p.laws[l.nm];
  if(v==null&&LAWWAS[l.nm]!=null&&p.laws[LAWWAS[l.nm]]!=null){
   v=p.laws[LAWWAS[l.nm]]; p.laws[l.nm]=v; delete p.laws[LAWWAS[l.nm]];}
  /* remembered, so saveProfile can tell a default apart from a reading */
  LAW_UNSET[l.nm]=(v==null);
  S.law[l.nm]=(v!=null)?v:LAW_DEFAULT;
  LAW_SEED[l.nm]=S.law[l.nm];});
 gatesLoad(p);   /* absent on a v1 profile, which reads as no story evidence */
 suscAll();      /* so a story applied before compute() lands on this profile */
 /* WHICH RECORD THE WORKING STATE CAME FROM, keyed by the record's id.

    S.who names a PERSONA, and every one of the person's own records is S.who
    0, so S.who cannot tell two of their own records apart. The Intake's
    switcher repoints CURP and loads the other record's field into S, S.who
    stays 0, and saveYou then writes whatever S holds into PEOPLE[0], which is
    the table the person's own record is read back from. Measured on a clean
    page: 2.20 units of held charge in PEOPLE[0] before, 63.00 after one
    saveYou taken while a second own record was loaded, and 63.00 still there
    after loadP(0), so the first record's field was gone for good.

    Same class as the undo leak closed at 88181e6 and the same answer, which
    engine/undo.js argues at length: key the thing to the record it came from
    rather than repointing anything, because two attempts at repointing are
    already recorded as worse than the bug. */
 S.rec=p.id||null;
 LAW_REC=p;
 return p;}
function saveProfile(p){
 p.soul={doms:S.doms.slice(),arcs:S.arcs.slice(),roots:S.roots.slice()};
 CHILD.forEach(function(c){p.axes[c.nm]={held:S.charge[c.nm],opp:S.replace[c.nm]||0};});
 /* A LAW NOBODY MEASURED MUST NOT COME BACK MEASURED.

    null in p.laws means not yet measured, and every surface that asks whether
    a person has been read at all counts the non null ones. loadProfile fills
    the working state with 6 for an unmeasured law, because the arithmetic
    downstream needs a number. This line then wrote the whole of S.law back,
    and S.law is never null, so the first save of a blank profile turned all
    twenty one nulls into twenty one sixes.

    Measured: a fresh profile with nothing entered reported 21 of 21 laws
    measured, so unread was false for somebody who had typed nothing, and the
    guards that exist precisely to stop the product reading a stranger off its
    own defaults were all reading false. The bug was invisible because 6 is
    also a plausible score.

    So a law that arrived unmeasured is only written once it holds something
    other than the default it was given. The one case this cannot see is a
    person deliberately setting an unmeasured law to exactly 6, which stays
    unmeasured. That is the honest cost of not having a separate touched flag
    on the control, and it is the right way round: failing to record a 6
    understates what was measured, where the old behaviour invented twenty one
    measurements nobody made. The intake writes p.laws directly and is
    unaffected. */
 SI.forEach(function(l){
  if(S.law[l.nm]==null)return;
  /* Compared against the value this law was SEEDED with, not against a single
     literal. Three callers seeded an unmeasured law and none of them agreed:
     this module said 6, the persona loader said 6.5 and its own fallback said
     5.5. Testing one literal wrote the other two straight through, which is
     the bug wearing a different number. They all read LAW_DEFAULT now, and
     this still compares against the seed rather than against that constant,
     because what is being asked is "has anybody moved this since it was given
     a placeholder" and only the seed the law actually got can answer it. A
     stated type writes real values onto these through seedApply, so the seed
     is not always the default even now. */
  if(LAW_UNSET[l.nm]&&S.law[l.nm]===LAW_SEED[l.nm])return;
  p.laws[l.nm]=S.law[l.nm]; LAW_UNSET[l.nm]=false;});
 gatesSave(p);
 p.updated=new Date().toISOString(); p.v=SCHEMA_V;
 return p;}
/* a snapshot is what Analytics plots. derived only, never inputs.

   m IS WHICH ARITHMETIC WROTE THE ROW. cq and dq changed meaning on 25
   September: cq was It*Ig/Rz and is now the laws over 210, dq was an
   uncapped sum over the addresses at 4 or more and is now the 112 over 1120.
   A row written before that carries no m, reads back as 0, and a surface
   comparing two rows must not report the change of formula as a move in the
   person. tier is null while CQ is still filling. */
function snapshot(p){
 var r=compute();
 return {t:new Date().toISOString(), m:CQ_MODEL, cq:Math.round(r.CQ*10)/10, dq:Math.round(r.DQ*100)/100,
  sq:Math.round(r.SQm*100)/100, pole:Math.round(r.poleMean*100)/100,
  jq:Math.round(r.JQ*100)/100, rad:Math.round(r.radiance*1000)/1000,
  loaded:r.loaded.length, sab:r.sabs.length, cx:r.cxs.length, hy:r.hys.length, ch:r.sups.length,
  dark:r.darkB, tier:r.tier, arch:ARCH[r.pi].nm, lawNow:snapLaws()};}
/* ============================================================
   THE TWENTY ONE, ON EVERY ROW. Ruled 26 September, answering BW Q2:
   "keeping track of the laws over time is excellent, and being able to show
   a graph to show how far you've come." A row carried cq, which is the laws
   summed over 210, and not the laws themselves, so no row could say which law
   moved. This is the twenty one as that same cq read them.

   WHAT IS WRITTEN IS lawNow, NOT THE ANSWER, AND THE KEY IS NAMED FOR IT.
   p.laws is the answers, an input, and a second meaning under that same name
   is a bug that has not happened yet. A law as CQ reads it is the answer
   lifted by the releases at its seat since (engine/compute.js, LIFT_R),
   and the lift is the whole of what a release does to a law. Writing the bare
   answer would draw every release as a flat line, which is the opposite of
   what the graph is for. So the row reconciles with itself: the laws that are
   not null, summed, over 210, times 100, is the row's own cq to within the
   rounding of both. The gate asserts it on every row it writes.

   A LAW NOT YET ANSWERED IS null, the meaning p.laws already gives it, and CQ
   counts it as nothing (lawIn). Writing the six it is seeded with would put a
   reading on the graph that nobody gave.

   THREE PLACES. At a law of 9 one pattern lifts it by under a thousandth and
   four patterns at its seat, which is what a run spread over the body tends
   to leave at each one, by about three thousandths. At two places most runs
   would draw as no move at all. Three costs at most twenty one bytes a row
   over two.

   A ROW WITH NO lawNow KEY WAS WRITTEN BEFORE THIS EXISTED. That is not the same
   as a row whose laws are all null, which is a record read before anything was
   answered, and a reader must keep the two apart (lawSeries, below). Nothing
   back fills an older row: its laws were never recorded and cannot be
   recovered from its cq, which is twenty one numbers folded into one.

   No version bump. The row gains a key, an older row still loads exactly as it
   did, and the record's v stays where it is. An older build reading a newer
   record drops this key on its way in, because the boundary rebuilds each row
   from a whitelist, and loses it at its next save. That is a loss, not a
   break, and it is the same for every field ever added to a row. */
function snapLaws(){
 var o={};
 SINAMES.forEach(function(nm){
  o[nm]=lawIn(nm)?Math.round(lawNow(nm)*1000)/1000:null;});
 return o;}
/* ONE LAW OVER TIME, off the record and nothing else. Rows written before the
   laws were recorded are counted and skipped rather than drawn as a gap or a
   zero, and the count is on the result so a graph can say where its record of
   each law begins. A name that is not one of the twenty one returns null: a
   series for a law that does not exist is not an empty series. An old name is
   read as the law it became. m is carried on every point, because a row
   written under one arithmetic compared with one written under another is a
   change of formula and not a move in the person (CQ_MODEL). */
function lawSeries(p,nm){
 if(SINAMES.indexOf(nm)<0)return null;
 var H=(p&&p.history)||[], pts=[], before=0, unread=0;
 for(var i=0;i<H.length;i++){
  var s=H[i];
  if(!s||!s.lawNow||typeof s.lawNow!=='object'){before++; continue;}
  var v=s.lawNow[nm];
  if(v===undefined&&LAW_WAS[nm]!==undefined)v=s.lawNow[LAW_WAS[nm]];
  if(typeof v!=='number'){unread++; continue;}
  pts.push({t:s.t, v:v, m:s.m});}
 return {law:nm, pts:pts, n:pts.length, of:H.length, before:before, unread:unread,
  first:pts.length?pts[0].v:null, last:pts.length?pts[pts.length-1].v:null,
  /* a direction is only a claim when there are two ends to compare */
  dir:pts.length>1?(pts[pts.length-1].v>pts[0].v?'up'
   :(pts[pts.length-1].v<pts[0].v?'down':'level')):null};}
var PROFILES=[], CURP=null;
/* The engine does not know what a browser is. The host binds a store. With none
   bound the profiles last as long as the process, which is what a headless run
   wants. ui/ui.js binds localStorage. */
/* The default store is a no-op whose set() never throws, so a browser that
   blocks storage left SAVE_OK true and the app reported "Saved." while nothing
   was written. That is the lie this file already forbids. A store has to be
   bound before a save can be claimed. */
var STORE={get:function(){return null;}, set:function(){}}, STORE_BOUND=false;
/* a host binds its own. exported, because module.exports captures the value of
   STORE and not the binding, so an outside caller cannot assign to it. */
function bindStore(get,set){ STORE={get:get,set:set}; STORE_BOUND=true; return STORE; }
/* A DEVICE SETTING IS THE BROWSER'S, NOT THE PERSON'S RECORD.

   The sound switch was written onto the profile with uiSet, which saves the
   profile, so turning sound off while a worked example was open answered
   "Nothing saved on a worked example." The owner hit it on 2 October: "When I
   turn sound effects off, it says nothing saved on worked example. So that's
   a bug." Whether this machine makes a noise is a fact about the machine. It
   has nothing to do with whose record is loaded, a worked example has no
   record to write, and a person on three profiles would have had to turn it
   off three times.

   So it lives under a key of its own in the same bound store, in one small
   object, and never on a profile. It goes through bindStore like everything
   else here, so the engine still never names a browser, and a host that bound
   nothing gets a refusal and not a pretended write. devSet reports what
   happened and the host decides the words, the same split pPersist keeps. A
   key never written reads as null, which is the host's cue to fall back to
   whatever it did before the setting existed. */
var DEVKEY=PKEY+'.device';
function devRead(){
 try{ var t=STORE.get(DEVKEY), o=t?JSON.parse(t):{};
  return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};
 }catch(e){ return {}; }}
function devGet(k){
 var o=devRead(); return Object.prototype.hasOwnProperty.call(o,k)?o[k]:null; }
/* read back after the write, because a store that swallows a write and says
   nothing is the failure this file refuses everywhere else */
function devSet(k,v){
 if(!STORE_BOUND)return {ok:false, err:'NoStore'};
 var o=devRead(); o[k]=v;
 try{ var txt=JSON.stringify(o); STORE.set(DEVKEY,txt);
  if(STORE.get(DEVKEY)!==txt)return {ok:false, err:'NotKept'};
  return {ok:true, err:null};
 }catch(e){ return {ok:false, err:(e&&e.name)||'error'}; }}
/* EVERYTHING THAT COMES OFF THE DISK GOES THROUGH THE BOUNDARY.

   This was the last route into the product that did not, and it was filed as a
   gap this morning and left. What it cost: a profile written by an earlier
   build has no `soul`, loadProfile reads `p.soul.doms` on line 88 without a
   guard, and the throw takes the boot down with it. Measured on a profile in
   the shape an earlier build saved: the centre canvas came back 0 by 0 and the
   console carried "Cannot read properties of undefined (reading 'doms')".
   That is the owner's report of the centre not rendering, and it only ever
   reproduced for somebody who had used the product before.

   validateProfile is exactly the right instrument for it and always was: a
   missing field is an older profile and is filled from the blank, which is the
   standing rule. A record it refuses is kept rather than dropped, because a
   person's own data is not ours to discard in silence, and the caller is told
   so it can say something true.

   A profile store is the one place a refusal must not be fatal: one bad record
   must not take the other nine with it. */
var STORE_REFUSED=[], STORE_KEPT=[];
/* AN UNREADABLE STORE IS NOT AN EMPTY ONE, AND IT WAS TOLD APART FROM ONE BY
   NOTHING.

   A parse failure and a value that is not a list both returned [], which is
   exactly what a first visit returns, so the boot read a truncated store as
   "no profile yet", called pNew, and pNew's own write replaced the key.
   Measured on a real record cut to 60 percent of its bytes: 954 bytes on disk
   before the boot, a blank "You" of 1562 bytes after it, nothing on the status
   line and no copy of the old bytes anywhere. The same for a store holding
   {"v":2}. That is the whole record, gone during the boot and before a single
   save, on a failure a person cannot see and did not cause.

   So the bytes are set aside under a key of their own before anything can
   write, verbatim, and read back to prove they landed. The key carries the
   time, so a second failure on another day never lands on the first one's
   copy. If the set aside does not land, which is likely exactly when the cut
   was a full store, pPersist refuses every write over the key for the session:
   the only copy of a person's record is not ours to overwrite, and a refused
   save reports itself where a silent one did not. The engine reports, and the
   host decides the words (storeUnread, below). */
var STORE_UNREAD=null;
function storeSetAside(txt,why){
 var key=PKEY+'.unreadable.'+Date.now().toString(36), kept=false;
 try{ STORE.set(key,txt); kept=(STORE.get(key)===txt); }catch(e){}
 STORE_UNREAD={why:why, bytes:txt.length, key:kept?key:null};
 return [];}
function pStore(){
 var raw, txt=STORE.get(PKEY);
 STORE_UNREAD=null; STORE_REFUSED=[]; STORE_KEPT=[];
 try{ raw=JSON.parse(txt||'[]'); }catch(e){ return storeSetAside(String(txt),'it does not parse'); }
 if(!Array.isArray(raw)) return storeSetAside(String(txt),'it is not a list of profiles');
 var out=[];
 for(var i=0;i<raw.length;i++){
  var v=validateProfile(raw[i]);
  if(v.ok){ out.push(v.profile); }
  else {
   STORE_REFUSED.push({i:i, name:(raw[i]&&raw[i].name)||'unnamed',
    errs:(v.errs||[]).slice(0,3)});
   /* KEPT MEANS KEPT ON THE DISK, NOT KEPT IN MEMORY.

      The comment here said a refused record is kept rather than dropped, and
      that was a lie by omission: it was held in PROFILES' place for the
      session and then erased by the next pPersist, which writes the whole
      validated array back over the key. Measured: two records on disk, one
      refused, one pSave, disk holds one.

      The raw bytes are held verbatim and written back beside the good ones, so
      a record this version cannot read survives for a version that can. It is
      never loaded and never shown. It is simply not destroyed. */
   STORE_KEPT.push(raw[i]); }}
 return out;}
/* what the boundary would not take, for a host that wants to say so */
function storeRefused(){ return STORE_REFUSED.slice(); }
/* and the store it could not read at all: null when it read, otherwise why,
   how many bytes, and the key the copy is under, null if the copy failed. */
function storeUnread(){ return STORE_UNREAD?Object.assign({},STORE_UNREAD):null; }
/* The empty catch here meant a save that failed on quota or blocked storage
   told nobody, and the intake button said "Saved" regardless. The engine still
   does not render anything: it reports, and the UI decides what to show. */
var SAVE_OK=true, SAVE_ERR=null;
function pPersist(){
 if(!STORE_BOUND){ SAVE_OK=false; SAVE_ERR='NoStore'; return false; }
 /* the one copy of a store nobody could read is still under the key */
 if(STORE_UNREAD&&!STORE_UNREAD.key){ SAVE_OK=false; SAVE_ERR='UnreadableStore'; return false; }
 /* the records the boundary would not read go back untouched, at the end, so
    a save never costs a person data this version happens not to understand. */
 var all=PROFILES.concat(STORE_KEPT);
 try{ STORE.set(PKEY,JSON.stringify(all)); SAVE_OK=true; SAVE_ERR=null; }
 catch(e){ SAVE_OK=false; SAVE_ERR=(e&&e.name)||'error'; }
 return SAVE_OK; }
function saveState(){ return {ok:SAVE_OK, err:SAVE_ERR}; }
function pNew(name){ var p=blankProfile(name); PROFILES.push(p); CURP=p; pPersist(); return p; }
/* A SAVE REPORTS WHETHER IT SAVED. This returned CURP, an object, so every
   caller testing it got true whatever the disk did, and accDelete's guard
   `if(!pSave())` could never fire: a delete that failed to write said
   "Deleted from this browser" and left the record where it was. That is the
   one write in the product where a false claim is worst. */
/* AND A SAVE ONTO SOMETHING THAT IS NOT IN THE RECORD LIST CANNOT LAND, SO IT
   SAYS SO RATHER THAN REPORTING THE WRITE IT DID NOT MAKE.

   pPersist writes PROFILES. A profile outside that array is never written, and
   this returned pPersist's answer regardless, so the caller was told the disk
   had taken a record that was never offered to it. That was invisible while the
   persona loader pushed its scratch profiles onto PROFILES, because then
   everything was in the list: the price of that was a demo persona landing in
   the person's own store, which is the leak ui/personas.js now refuses. Fixing
   the leak is what makes this path reachable, so the report comes with it. The
   host decides what to say; this only reports what happened. */
function pSave(){ if(!CURP)return false; saveProfile(CURP);
 if(PROFILES.indexOf(CURP)<0){ SAVE_OK=false; SAVE_ERR='NotARecord'; return false; }
 return pPersist(); }
/* checked before the push, so a history nobody can read does not grow */
function pSnap(){ if(!CURP)return false;
 if(PROFILES.indexOf(CURP)<0){ SAVE_OK=false; SAVE_ERR='NotARecord'; return false; }
 CURP.history.push(snapshot(CURP)); return pPersist(); }
function pExport(){ return JSON.stringify(CURP?saveProfile(CURP):null,null,1); }
/* ============================================================
   THE BOUNDARY. Everything above this line trusts its input
   because the app wrote it. Everything a person can paste in
   does not get that. loadProfile accepted a charge of 9999 and
   pImport pushed a malformed profile onto PROFILES and moved
   CURP onto it before loadProfile could throw, so a bad paste
   left the app holding it with no way back.

   A missing field is an older profile and is filled from the
   blank. A field of the wrong type or out of range is corruption
   or an attack, and it is refused by name. Nothing is silently
   clamped, because a clamped 9999 reads as a 10 a person never
   entered, and this file already forbids lying about what
   happened.
   ============================================================ */
var NUM=function(v){return typeof v==='number'&&isFinite(v);};
function vRange(errs,path,v,lo,hi){
 if(v===undefined||v===null)return null;
 if(!NUM(v)){errs.push(path+' is not a number');return null;}
 if(v<lo||v>hi){errs.push(path+' is '+v+', outside '+lo+' to '+hi);return null;}
 return v;}
/* ============================================================
   THE TWO NESTED BAGS. Both escaped the boundary above.

   plan refuses customer, subscription, email, key, secret and token by name.
   rituals was accepted on one condition, that each entry is an object, so a
   ritual arrived with no errors at all carrying a track that is not a track,
   a seat that is not a seat, a step naming no practice, a negative length, a
   five thousand character when where the surface caps at forty, a hundred
   thousand character note, and the keys secret and email: refused by name one
   level up and passed silently one level down. story.entries was a bare
   slice, and three surfaces call .slice and .length on entry.text.

   A CLOSED KEY SET RATHER THAN A SECOND DENY LIST. OB_NEVER in outbox.js
   names about forty things that may never leave the device, and it is the
   wrong table to import here: it is about what goes out rather than what
   comes in, and it names date, key, type, story and answers, which are
   legitimate field names elsewhere in this same profile. OB_KEYS is the
   posture worth copying instead, and a closed set refuses what nobody thought
   of rather than only what somebody did, including the field whoever adds one
   six months from now forgets to declare. The gate then asserts that every
   name on OB_NEVER is refused inside both bags, so the deny list still
   protects them and there is no second copy of it to drift.
   ============================================================ */
function vKeys(errs,path,x,allow){
 Object.keys(x).forEach(function(k){
  if(allow.indexOf(k)<0)errs.push(path+' may not carry '+k);});}
function vDate(errs,path,t){
 if(typeof t!=='string'||isNaN(new Date(t).getTime())){
  errs.push(path+' is not a date'); return null;}
 return t;}
/* A CEILING IS REFUSED AND NEVER TRUNCATED, which is obValidate's rule and is
   the same reason: a silently cut sentence reads back to the person as
   something they never said. */
function vStr(errs,path,s,cap){
 if(typeof s!=='string'){errs.push(path+' is not a string'); return null;}
 if(cap&&s.length>cap){
  errs.push(path+' is '+s.length+' characters and the cap is '+cap); return null;}
 return s;}
/* WHAT A RITUAL MAY CARRY. t, track, band, steps and min are the original
   five. when, where and done were added later, so an older entry has none of
   the three and they are filled rather than required. */
var RIT_KEYS=['t','track','band','steps','min','when','where','done'];
/* The when and where cap, and ui/ritual.js writes this into the two inputs
   rather than repeating 40, because the boundary and the surface have to agree
   about it and the two places in this repository that used the number 6 had to
   agree and did not. */
var RIT_PLAN_MAX=40;
/* The tracks, the steps and the longest ritual there is, read off the practice
   library rather than typed here. A practice added to that table is accepted
   by the boundary the moment it exists, and a step naming nothing is refused
   without anybody having to remember this file. The minutes ceiling is the
   whole library summed, which is every practice picked once and is the longest
   ritual the builder can produce. */
var RIT_TRACK={}, RIT_STEP={}, RIT_MIN_MAX=0;
PRACTICE.forEach(function(pr){
 RIT_TRACK[pr.track]=1; RIT_STEP[pr.k]=1; RIT_MIN_MAX+=pr.min;});

/* ============================================================
   THE SHAPE AND THE TARGET OF A GENERATED RITUAL.

   His design for the ring: "it tells you how many you're actually supposed to
   do in the session. So if it's four things, you'll have four dashes. If you've
   got ten, then you'll have ten dashes."

   The ring is built and the generator was not feeding it. Measured by the seat
   that built it: 50 of the 52 rows the engine's queue generates carried a
   target of one, so every ring in the panel was a single dash, and the counts
   that make the idea visible existed only in the nine rows the owner wrote
   himself. A parameter that does not vary is a parameter nobody can read.

   A target of one was not a reading, it was a literal typed at each of four
   push sites. So the three shapes are told apart HERE, off the tables, and a
   target is returned only for the shape that is a count.

   WHICH FIELD, NAMED, because a derivation nobody can check is a magic number
   with a better story:

     A PRACTICE IS A WINDOW AND ITS PARAMETER IS `PRACTICE[].min`. The practice
     library carries exactly two numbers per row, min and tier. tier is a
     difficulty and min is a duration, and neither is a count of anything a
     person does twice. So a practice has no count, and a thing with no count is
     not a count shape: it is a span with an edge, held or crossed once, which
     is the window. The minutes are what it costs and the window already takes
     one dash on that page, so nothing here invents a number and the parameter
     line gets a real field instead of a literal.

     A RELEASE IS A COUNT AND ITS TARGET IS THE NUMBER OF LINES THERE ARE TO
     SPEAK. Where the axis has one of the owner's printed production cards the
     target is `cardDepth`, the paired lines that card actually carries on a
     side: five for Anger, Sad and Anticipation, which is five statements in the
     session and five dashes. Where it does not, the 3C generator is what
     supplies the lines, and its escalation curve is five bands of ten in
     `C3_BAND`, one band being the nervous system pacing the spec calls non
     negotiable. So the session is one band, and the target is that band's own
     size read off `lo` and `hi`. Ten.

     THE TWO SIDES OF A CARD ARE READ AT THEIR FLOOR. cardDepth takes a pole and
     the masculine and feminine sides carry five each on all three cards today,
     so the two agree and nothing is being chosen. The floor is taken rather
     than either side by name, so if a card is ever written with an uneven pair
     the target is the number of lines the thinner side can actually give.

     AND IF THE BANDS EVER STOP AGREEING, THIS REFUSES. A run opens at the band
     the charge puts it in and the generator does not know which, which is only
     safe while every band is the same size. C3_BAND_N is null the moment they
     differ, and a null target draws as unknown rather than as ten.

     A STANCE HAS NONE UNTIL THE DAY SUPPLIES ONE. A law with no practice
     against it is practised when a moment asks for it, so before the day has
     tested it there is no number, and one dash would be a claim.

   WHAT IS STILL HIS. Whether a release session is one band of ten or the whole
   channel of fifty, and whether a sitting is honestly a window and therefore
   marked held or broken rather than counted. Both are named in the report and
   neither is decided here.

   NOTHING RECOGNISED IS REFUSED BY NAME. An argument naming no practice, no
   axis and no law returns a null shape and says so, rather than defaulting to a
   count of one, which is the defect this exists to remove.
   ============================================================ */
var RIT_SHAPES=['count','window','stance'];
/* the size of one band of the escalation curve, off C3_BAND rather than typed,
   and null if the five ever stop agreeing. */
var C3_BAND_N=(function(){
 var seen={};
 C3_BAND.forEach(function(b){seen[b.hi-b.lo+1]=1;});
 var k=Object.keys(seen);
 return k.length===1?+k[0]:null;})();
function ritTarget(o){
 var q=o||{};
 if(q.practice){
  var pr=null;
  PRACTICE.forEach(function(x){if(x.k===q.practice)pr=x;});
  if(!pr)return {shape:null, target:null, src:null,
   because:'no practice in the library is keyed '+q.practice};
  return {shape:'window', target:null, minutes:pr.min, what:pr.nm,
   unit:null, period:null, src:'PRACTICE[].min',
   because:pr.nm+' is '+pr.min+' minutes and the library carries no count for '
    +'it, so it is one span held or crossed and not a number of things'};}
 if(q.axis){
  /* THE NODE TABLE'S CHARGE COLUMN IS NOT THE NINE AXES, which a release row
     hands straight in. Measured on NODES: 12 rows carry Sadness, 13 Resentment
     and 12 Joy, and none of those three is one of the nine. CHG2FET is the
     engine's own map from the charge vocabulary to the axis, keyed lowercase,
     and it answers Sadness with Sad. It has no answer for Joy, which is not one
     of the nine at all, or for Resentment, which the sniffer rules a composite
     of Anger and Apathy: two axes means two cards and there is no single count,
     so both are refused by name below rather than rounded to the nearer axis. */
  var ax=CHARGES.indexOf(q.axis)>=0?q.axis
   :(CHG2FET[String(q.axis).toLowerCase()]||null);
  if(!ax)return {shape:null, target:null, src:null,
   because:q.axis+' is in the node table\'s charge column and is not one of the '
    +'nine axes, and nothing maps it to one, so there is no card and no count'};
  var m=cardDepth(ax,'m'), f=cardDepth(ax,'f');
  var printed=Math.min(m,f);
  if(printed>0)return {shape:'count', target:printed, unit:'lines',
   period:'a run', axis:ax, src:'cardDepth('+ax+')',
   because:'the printed card for '+ax+' carries '+printed
    +' paired lines on a side, and the session is every line on it'};
  return {shape:'count', target:C3_BAND_N, unit:'lines', period:'a run', axis:ax,
   src:C3_BAND_N===null?null:'C3_BAND[].lo and .hi',
   because:C3_BAND_N===null
    ?'the escalation bands are no longer one size, so which band a run opens '
     +'at decides the count and nothing here knows it'
    :ax+' has no printed card, so the lines come off the generator, whose '
     +'curve is five bands of '+C3_BAND_N+' and whose session is one band'};}
 if(q.law&&SINAMES.indexOf(q.law)>=0)
  return {shape:'stance', target:null, law:q.law, unit:null, period:null,
   src:'SI',
   because:q.law+' is a law and not a practice, so the day decides when it is '
    +'tested and how often, and there is no count until it has'};
 return {shape:null, target:null, src:null,
  because:'nothing here names a practice, one of the nine axes or one of the '
   +'twenty one laws, so there is no shape to read and no target to give'};}
function vRitual(errs,i,x){
 var path='rituals['+i+']';
 if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(path+' is not an object'); return null;}
 vKeys(errs,path,x,RIT_KEYS);
 var q={};
 /* THE DAY IS REQUIRED AND IS NEVER INVENTED. pracDay reads t and the streak
    is counted in the days it returns, so filling a missing t from now would
    hand somebody a day they did not practise, which is the 9999 that reads as
    a 10 wearing a different hat. Every ritual the app has ever written carries
    t, so requiring it cannot refuse an older profile. */
 var t=vDate(errs,path+'.t',x.t);
 if(t!==null)q.t=t;
 /* A TRACK OR A SEAT NOBODY RECORDED IS LEFT EMPTY RATHER THAN NAMED, the way
    an unmeasured law is left null. Defaulting to Body and Root would write a
    diagnosis nothing measured. Nothing reads either one back off a saved
    ritual yet, so empty costs nothing here and a default would cost the
    truth. */
 /* '' IS THE EMPTY THIS FUNCTION ITSELF WRITES, so it must read back. Found
    round OG: a ritual with no track or seat passed once, came out as '' and
    the next pass refused its own output, so pStore loaded no profile and the
    person's profile vanished at boot. Empty is read as nobody recorded it. */
 q.track='';
 if(x.track!==undefined&&x.track!==''){
  if(RIT_TRACK[x.track])q.track=x.track;
  else errs.push(path+'.track is not a track in the practice library: '+x.track);}
 q.band='';
 if(x.band!==undefined&&x.band!==''){
  if(BANDS.indexOf(x.band)>=0)q.band=x.band;
  else errs.push(path+'.band is not a seat: '+x.band);}
 /* A STEP NAMES A PRACTICE OR IT NAMES NOTHING, and ritSteps drops what it
    cannot find, so an unnamed step reads on the surface as a ritual with fewer
    steps than it was saved with. A list longer than the library is not a
    ritual either: the builder writes one entry per practice picked, so the
    count of practices is the most a ritual can hold, and that bound is also
    what stops one valid key arriving a hundred thousand times. */
 q.steps=[];
 if(x.steps!==undefined){
  if(!Array.isArray(x.steps))errs.push(path+'.steps is not a list');
  else if(x.steps.length>PRACTICE.length)
   errs.push(path+'.steps holds '+x.steps.length+', which is more than the '
    +PRACTICE.length+' practices there are');
  else x.steps.forEach(function(k,j){
   if(RIT_STEP[k])q.steps.push(k);
   else errs.push(path+'.steps['+j+'] names no practice: '+k);});}
 /* the length, in minutes, and a negative one was the finding. Not floored:
    every minute in the library is whole, so a fraction can only come from a
    hand written file and rounding it would be a silent edit. */
 q.min=0;
 var mn=vRange(errs,path+'.min',x.min,0,RIT_MIN_MAX);
 if(mn!==null)q.min=mn;
 ['when','where'].forEach(function(f){
  q[f]='';
  if(x[f]===undefined)return;
  var s=vStr(errs,path+'.'+f,x[f],RIT_PLAN_MAX);
  if(s!==null)q[f]=s;});
 /* DONE IS NOT FILLED, AND THAT IS DELIBERATE. ledgerRead reads an entry with
    no done key at all as practised, because minutes planned and minutes
    practised were one number until they were split and a person's history is
    not ours to delete over a schema change. Writing done:false here would move
    every older ritual out of the practised column on the way through the
    boundary. It is a boolean from the builder and a stamp from the control
    that marks the day done, so both are taken and nothing else is. */
 if(x.done!==undefined){
  if(typeof x.done==='boolean')q.done=x.done;
  else{
   var d=vDate(errs,path+'.done',x.done);
   if(d!==null)q.done=d;}}
 return q;}
/* WHAT A STORY ENTRY MAY CARRY. The same four since the first build, and two
   optional ones since round OB: lex, the lexicon version that read it
   (19.B6, LEX_VERSION in engine/sniff.js), and asked, what Source AI asked
   about it (20.H5, srcAsked in engine/sourceai.js). And a third since round
   QB: ob, what the person answered on the onboarding sheet that committed it
   (vEntryOb, below).

   ob WAS WRITTEN BEFORE IT WAS DECLARED HERE, and that cost every person who
   finished onboarding their whole profile on the next visit: obCommit put ob
   on the entry, this list did not name it, and the boot refused the record,
   "story.entries[0] may not carry ob". The closed set did its job, which is
   to refuse what nobody declared. The defect was a writer that shipped
   without a rule here, so the rule now sits beside the list it extends. */
var ENT_KEYS=['t','text','imprints','bands','lex','asked','ob'];
/* WHAT ONBOARDING WRITES, read off obCommit in ui/onboard.js and nowhere else:

     pick    which of OB_STARTS the person picked, by position, or null
     feel    which of OB_FEELS, by position, -1 for Not sure, or null
     place   which of OB_PLACES, by position, -1 for Not sure, or null
     yes     the node ids they said yes to on the mirror
     no      the node ids they said no to
     fixes   their corrections, word for word, only when there were any

   The three lists are engine data (engine/data/onboarding.js) so a position
   is checked against the list it points into, and a position past the end is
   refused by name rather than read as the last one. pick has no Not sure on
   the sheet, so -1 is refused there and taken for the other two.

   yes and no are node ids, refused by name when no node carries the id, when
   one repeats, or when the same id is both. OB.ans holds one answer per id,
   so the writer cannot produce either, and a record that carries one did not
   come from it.

   MISSING IS NOT ANSWERED. An entry from before onboarding wrote ob, or one
   the Story tab committed, has no ob and keeps none: filling one would claim
   the person was shown a mirror they never saw, the same lie the lex stamp
   refuses above. Inside an ob that is present, a missing pick, feel or place
   is null and a missing yes or no is empty, so a field added to ob later
   does not refuse the ones written before it. fixes is taken as text is: a
   string, and no length is invented, for the reason the text has none. */
var ENT_OB_KEYS=['pick','feel','place','yes','no','fixes'];
function vEntryOb(errs,path,x){
 if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(path+' is not an object'); return null;}
 var bad=errs.length;
 vKeys(errs,path,x,ENT_OB_KEYS);
 var q={pick:null, feel:null, place:null, yes:[], no:[]};
 [['pick',OB_STARTS,false],['feel',OB_FEELS,true],['place',OB_PLACES,true]].forEach(function(f){
  var v=x[f[0]];
  if(v===undefined||v===null)return;
  if(typeof v!=='number'||v!==Math.floor(v)||(v<0&&!(f[2]&&v===-1))||v>=f[1].length){
   errs.push(path+'.'+f[0]+' is not a position in its list of '+f[1].length
    +(f[2]?' or -1 for Not sure':'')+': '+v);
   return;}
  q[f[0]]=v;});
 var seen={};
 ['yes','no'].forEach(function(f){
  var v=x[f];
  if(v===undefined)return;
  if(!Array.isArray(v)){errs.push(path+'.'+f+' is not a list'); return;}
  v.forEach(function(i,j){
   var ip=path+'.'+f+'['+j+']';
   if(typeof i!=='number'||!BY[i]){errs.push(ip+' names no node: '+i); return;}
   if(seen[i]){errs.push(ip+(seen[i]===f?' repeats ':' is also a '+seen[i]+': ')+i); return;}
   seen[i]=f; q[f].push(i);});});
 if(x.fixes!==undefined){
  if(!Array.isArray(x.fixes))errs.push(path+'.fixes is not a list');
  else{
   var fx=[];
   x.fixes.forEach(function(s,j){
    var v=vStr(errs,path+'.fixes['+j+']',s);
    if(v!==null)fx.push(v);});
   q.fixes=fx;}}
 return errs.length>bad?null:q;}
function vEntry(errs,i,x){
 var path='story.entries['+i+']';
 if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(path+' is not an object'); return null;}
 vKeys(errs,path,x,ENT_KEYS);
 var q={};
 var t=vDate(errs,path+'.t',x.t);
 if(t!==null)q.t=t;
 /* NO LENGTH IS INVENTED FOR THE TEXT. The story box enforces no cap on
    purpose: it is the one field in the product a person is asked to fill with
    prose, so there is no surface number to check against and guessing one here
    would refuse an entry somebody wrote. What is checked is that it is a
    string, because Imprints and Analytics both call .slice and .length on it
    with no guard, so one imported number in place of a text threw the surface
    rather than the import. An entry is its text and no writer has ever omitted
    it, so a missing one is corruption rather than an older record. */
 var tx=vStr(errs,path+'.text',x.text);
 if(tx!==null)q.text=tx;
 /* the count the entry reported when it was committed, printed beside the
    date. Not recomputed from the text: the sniffer has moved since the oldest
    of these were written, and recomputing would rewrite what the person was
    told at the time. */
 q.imprints=0;
 var im=vRange(errs,path+'.imprints',x.imprints,0,1e6);
 if(im!==null)q.imprints=im;
 /* bands is keyed by the sniffer's own seat keys, so a key that is not one of
    them is refused by name rather than dropped. Analytics reads it as
    e.bands[B2K[seat]] and Imprints maps every key through K2BAND, so a key
    neither table holds is weight sitting at a seat that does not exist. */
 q.bands={};
 if(x.bands!==undefined){
  if(!x.bands||typeof x.bands!=='object'||Array.isArray(x.bands))
   errs.push(path+'.bands is not an object');
  else Object.keys(x.bands).forEach(function(k){
   if(!K2BAND[k]){errs.push(path+'.bands names no seat: '+k); return;}
   var v=vRange(errs,path+'.bands.'+k,x.bands[k],0,1e6);
   if(v!==null)q.bands[k]=v;});}
 /* THE LEXICON THAT READ IT, 19.B6. Missing is an entry from before the stamp
    and stays missing: filling it with today's version would claim today's
    lexicon read words it never saw, which is the lie the stamp exists to
    prevent. Present, it is the form lexVersion writes or it is refused by
    name. An older version is not an error; that is what it is for. */
 if(x.lex!==undefined){
  if(typeof x.lex!=='string'||!LEXV_RE.test(x.lex))
   errs.push(path+'.lex is not a lexicon version: '+x.lex);
  else q.lex=x.lex;}
 /* WHAT SOURCE AI ASKED, 20.H5. A question kind and a seat key, and the one
    outcome the page saw. Never text, and a row carrying anything else is
    refused rather than stripped, so a field nobody declared cannot ride in
    on a known one. Missing is an older entry, or one nothing was asked
    about, and reads as nothing asked. */
 if(x.asked!==undefined){
  if(!Array.isArray(x.asked))errs.push(path+'.asked is not a list');
  else if(x.asked.length>srcAskedMax())
   errs.push(path+'.asked holds '+x.asked.length+', which is more than the '
    +srcAskedMax()+' kinds and seats there are');
  else{
   var ak=[];
   x.asked.forEach(function(r,j){
    var ap=path+'.asked['+j+']';
    if(!r||typeof r!=='object'||Array.isArray(r)){errs.push(ap+' is not an object');return;}
    var bad=0;
    Object.keys(r).forEach(function(k){
     if(['k','seat','a'].indexOf(k)<0){errs.push(ap+' may not carry '+k);bad++;}});
    if(SRC_KINDS.indexOf(r.k)<0){errs.push(ap+'.k is not a question kind: '+r.k);bad++;}
    if(r.seat!==null&&!K2BAND[r.seat]){errs.push(ap+'.seat names no seat: '+r.seat);bad++;}
    if(SRC_OUTCOMES.indexOf(r.a)<0){errs.push(ap+'.a is not an outcome: '+r.a);bad++;}
    if(!bad)ak.push({k:r.k, seat:r.seat, a:r.a});});
   q.asked=ak;}}
 /* WHAT THE ONBOARDING SHEET WAS TOLD, round QB. Missing stays missing:
    vEntryOb above says why. */
 if(x.ob!==undefined){
  var ob=vEntryOb(errs,path+'.ob',x.ob);
  if(ob)q.ob=ob;}
 return q;}
function validateProfile(o){
 var errs=[];
 if(!o||typeof o!=='object'||Array.isArray(o))return {ok:false, errs:['not an object']};
 if(!NUM(o.v)||o.v<1||o.v>SCHEMA_V)errs.push('schema version '+o.v+' is not 1 to '+SCHEMA_V);
 var p=blankProfile(typeof o.name==='string'?o.name:'Imported');
 p.v=NUM(o.v)?o.v:SCHEMA_V;
 if(typeof o.id==='string')p.id=o.id;
 if(typeof o.created==='string')p.created=o.created;
 if(typeof o.updated==='string')p.updated=o.updated;
 /* the nine axes */
 if(o.axes&&typeof o.axes==='object')CHILD.forEach(function(c){
  var a=o.axes[c.nm]; if(!a||typeof a!=='object')return;
  var h=vRange(errs,'axes.'+c.nm+'.held',a.held,0,10);
  var q=vRange(errs,'axes.'+c.nm+'.opp',a.opp,0,10);
  if(h!==null)p.axes[c.nm].held=h;
  if(q!==null)p.axes[c.nm].opp=q;});
 /* the 21 laws. null is a law not yet measured and is not an error. */
 if(o.laws&&typeof o.laws==='object')SI.forEach(function(l){
  if(o.laws[l.nm]===undefined||o.laws[l.nm]===null)return;
  var v=vRange(errs,'laws.'+l.nm,o.laws[l.nm],0,10);
  if(v!==null)p.laws[l.nm]=v;});
 /* the soul. indexes into fixed tables, so an index outside them is refused. */
 if(o.soul&&typeof o.soul==='object'){
  if(Array.isArray(o.soul.doms))p.soul.doms=o.soul.doms.filter(function(d){
   var v=vRange(errs,'soul.doms',d,0,DOMAINS.length-1);return v!==null;});
  if(Array.isArray(o.soul.arcs))p.soul.arcs=o.soul.arcs.filter(function(a){
   var v=vRange(errs,'soul.arcs',a,0,ARCH.length-1);return v!==null;});
  if(Array.isArray(o.soul.roots))p.soul.roots=o.soul.roots.filter(function(r){return typeof r==='string';});
  if(!p.soul.doms.length)p.soul.doms=[0];
  if(!p.soul.arcs.length)p.soul.arcs=[0,1];}
 /* gate evidence. counts of sentences, so any non negative integer. */
 if(o.gates&&typeof o.gates==='object'){
  if(o.gates.verp&&typeof o.gates.verp==='object')Object.keys(p.gates.verp).forEach(function(k){
   var v=vRange(errs,'gates.verp.'+k,o.gates.verp[k],0,1e6); if(v!==null)p.gates.verp[k]=v;});
  if(o.gates.lean&&typeof o.gates.lean==='object')['benign','malignant'].forEach(function(k){
   var v=vRange(errs,'gates.lean.'+k,o.gates.lean[k],0,1e6); if(v!==null)p.gates.lean[k]=v;});}
 /* the 63 answers */
 if(o.intake&&typeof o.intake==='object'){
  if(o.intake.answers&&typeof o.intake.answers==='object')Object.keys(o.intake.answers).forEach(function(k){
   var i=+k; if(!NUM(i)||i<0||i>62||i%1!==0){errs.push('intake answer key '+k+' is not 0 to 62');return;}
   if(o.intake.answers[k]===null)return;
   var v=vRange(errs,'intake.answers.'+k,o.intake.answers[k],0,10);
   if(v!==null)p.intake.answers[i]=v;});
  if(Array.isArray(o.intake.done))p.intake.done=o.intake.done.slice();
  if(typeof o.intake.startedAt==='string')p.intake.startedAt=o.intake.startedAt;
  if(typeof o.intake.completedAt==='string')p.intake.completedAt=o.intake.completedAt;
  /* THE THREE BLOCKS UNDER THE 63, through their own boundary into the same
     errs. Missing is an older record and keeps the blank. */
  p.intake.more=ixValidate(errs,o.intake.more,'intake.more');}
 /* who. strings only, and never trusted into the document by this file. */
 if(o.who&&typeof o.who==='object'){
  ['first','middle','last','sex','sealed'].forEach(function(k){
   if(typeof o.who[k]==='string')p.who[k]=o.who[k].slice(0,200);});
  if(o.who.born&&typeof o.who.born==='object'){
   /* zone is the IANA time zone name, ruled 26 September. A string like the
      others and not checked against the zone list here: whether a name can
      be read is a property of the runtime reading it, and an unreadable one
      reads unresolved rather than being refused on the way in. */
   ['date','time','place','zone'].forEach(function(k){
    if(typeof o.who.born[k]==='string')p.who.born[k]=o.who.born[k].slice(0,200);});
   p.who.born.timeUnknown=!!o.who.born.timeUnknown;}}
 /* ui preferences. booleans only, and an older profile without them is filled
    from the blank rather than refused. */
 if(o.ui&&typeof o.ui==='object'){
  /* a key missing from this list is dropped on every load, so the switch
     would read on for one session and off after a reload with nothing said */
  ['quiet','model','tone','voice','buzz','practitioner','sfx','sfxoff','onboarded','tutorialSeen','paidWelcomed','studio'].forEach(function(k){
   if(o.ui[k]!==undefined)p.ui[k]=!!o.ui[k];});}
 /* the seed is a stated type, so it is one of sixteen or it is nothing. */
 if(o.seed&&typeof o.seed==='object'){
  if(!seedValid(o.seed.type))errs.push('seed type '+o.seed.type+' is not one of the sixteen');
  else{p.seed={type:String(o.seed.type).toUpperCase(),
   at:typeof o.seed.at==='string'?o.seed.at:new Date().toISOString(), axes:{}};
   CHARGES.forEach(function(c){
    var v=vRange(errs,'seed.axes.'+c,o.seed.axes?o.seed.axes[c]:3,0,10);
    p.seed.axes[c]=v===null?3:v;});}}
 /* logs. the text inside an entry is the person's own and is never edited,
    but the bag it arrives in is checked like everything else. The shape around
    it was the whole of what this line used to check. */
 if(o.story&&typeof o.story==='object'){
  if(Array.isArray(o.story.entries))p.story.entries=o.story.entries
   .map(function(x,i){return vEntry(errs,i,x);}).filter(Boolean);
  else if(o.story.entries!==undefined)errs.push('story.entries is not a list');}
 else if(o.story!==undefined&&o.story!==null)errs.push('story is not an object');
 if(o.meter&&typeof o.meter==='object'){
  var mp=vRange(errs,'meter.lines',o.meter.lines,0,1e9);
  if(mp!==null)p.meter.lines=Math.floor(mp);
  /* the split, round LY. Missing is an older record and reads as the blank's
     own nought, already on p from blankProfile, not an error. */
  var mrl=vRange(errs,'meter.relLines',o.meter.relLines,0,1e9);
  if(mrl!==null)p.meter.relLines=Math.floor(mrl);
  var mtl=vRange(errs,'meter.truthLines',o.meter.truthLines,0,1e9);
  if(mtl!==null)p.meter.truthLines=Math.floor(mtl);
  if(Array.isArray(o.meter.unique))
   p.meter.unique=o.meter.unique.filter(function(k){return typeof k==='string'&&k.length<64;});
  else if(o.meter.unique!==undefined)errs.push('meter.unique is not a list');
  if(typeof o.meter.first==='string')p.meter.first=o.meter.first;
  if(typeof o.meter.last==='string')p.meter.last=o.meter.last;
  /* when the gift ran out. Absent or null is an older record, or one still
     inside the gift. Anything else must be a date, because the free weeks are
     counted from it, and a value that is not one is refused by name rather
     than read as no date, which would quietly hand back a week. */
  if(typeof o.meter.giftAt==='string'&&!isNaN(new Date(o.meter.giftAt).getTime()))
   p.meter.giftAt=o.meter.giftAt;
  else if(o.meter.giftAt!==undefined&&o.meter.giftAt!==null)
   errs.push('meter.giftAt is not a date');
  /* The dated firsts were written by meterFirst, returned by meterRead, and
     dropped here, so every one of them was lost through an import. They are
     the only achievement shape this product allows, which made the boundary
     the one place that could quietly delete a person's whole record of it.
     Validated like everything else: typed, bounded, and refused by name. */
  if(Array.isArray(o.meter.firsts)){
   p.meter.firsts=o.meter.firsts.filter(function(f){
    return f&&typeof f==='object'
     &&typeof f.k==='string'&&f.k.length>0&&f.k.length<64
     &&typeof f.t==='string'&&!isNaN(new Date(f.t).getTime())
     &&(f.nm===undefined||(typeof f.nm==='string'&&f.nm.length<120));})
    .map(function(f){return {k:f.k,t:f.t,nm:typeof f.nm==='string'?f.nm:f.k};});
   if(p.meter.firsts.length!==o.meter.firsts.length)
    errs.push('meter.firsts held '+(o.meter.firsts.length-p.meter.firsts.length)
     +' entries that are not a dated first');}
  else if(o.meter.firsts!==undefined)errs.push('meter.firsts is not a list');
  /* THE HEAVY MARKS, round OG, refused by name and never filtered. unique just
     above drops a stray entry without a word, which is the wrong shape for a
     mark that changes what a rerun says: a heavy key dropped here would be a
     line the person marked that the next rerun quietly leaves out. Each key
     must be a line key that this record has opened (meterHeavyWhy), and a key
     listed twice is refused, since the list is a set and a doubled entry is
     a file that was edited by hand or written by something else. Order is not
     meaning, so a list in any order loads sorted. Absent is an older record
     and keeps the blank's empty list. */
  if(o.meter.heavy!==undefined){
   if(!Array.isArray(o.meter.heavy))errs.push('meter.heavy is not a list');
   else {
    var hvSeen={}, hvKeep=[];
    o.meter.heavy.forEach(function(k,i){
     var why=meterHeavyWhy(p,k);
     if(why){errs.push('meter.heavy['+i+'] '+why+(typeof k==='string'?': '+k.slice(0,40):''));return;}
     if(hvSeen[k]){errs.push('meter.heavy lists '+k+' twice');return;}
     hvSeen[k]=1; hvKeep.push(k);});
    p.meter.heavy=meterHeavySort(hvKeep);}}}
 /* THE RELEASES SINCE EACH LAW WAS ANSWERED. Read after the meter, because the
    meter is what bounds them: a count is patterns of new ground at the law's
    seat, every one of them is a key in meter.unique, and a new answer only ever
    lowers it. So a count above the keys the record holds at that seat is not
    an older record and not a rounding, it is a law lifted by work nobody did,
    and it is refused by name rather than clamped to what the meter allows. */
 if(o.work&&typeof o.work==='object'&&!Array.isArray(o.work)){
  var seatKeys={};
  p.meter.unique.forEach(function(k){var n=BY[+String(k).split(':')[0]];
   if(n&&n.b)seatKeys[n.b]=(seatKeys[n.b]||0)+1;});
  SI.forEach(function(l){
   var w=o.work[l.nm]; if(w===undefined||w===null)return;
   if(typeof w!=='object'||Array.isArray(w)){errs.push('work.'+l.nm+' is not an object');return;}
   var n=vRange(errs,'work.'+l.nm+'.n',w.n,0,1e6);
   var on=vRange(errs,'work.'+l.nm+'.on',w.on,0,10);
   if(n===null||on===null){
    if(w.n===undefined||w.on===undefined)errs.push('work.'+l.nm+' is not a count and the answer it was counted on');
    return;}
   if(n%1!==0){errs.push('work.'+l.nm+'.n is '+n+', not a whole number of patterns');return;}
   if(n>(seatKeys[l.b]||0)){errs.push('work.'+l.nm+'.n is '+n+', more than the '
    +(seatKeys[l.b]||0)+' patterns this record has opened at the '+l.b);return;}
   p.work[l.nm]={n:n,on:on};});}
 else if(o.work!==undefined&&o.work!==null)errs.push('work is not an object');
 /* THE PLAN, refused by name and never clamped. A tier this build does not
    know is refused rather than rounded down to free, because silently
    downgrading somebody who paid is the same class of error as silently
    upgrading somebody who did not, and only one of them gets reported. A
    status this build does not know is kept as written and read as pending by
    planState, which grants nothing: an unknown state must not open a door. */
 if(o.plan&&typeof o.plan==='object'){
  if(typeof o.plan.tier==='string'){
   if(PLAN_BY[o.plan.tier])p.plan.tier=o.plan.tier;
   else errs.push('plan.tier is not a tier this build knows: '+o.plan.tier);}
  else if(o.plan.tier!==undefined)errs.push('plan.tier is not a string');
  if(typeof o.plan.status==='string'&&o.plan.status.length<32)p.plan.status=o.plan.status;
  else if(o.plan.status!==undefined)errs.push('plan.status is not a short string');
  var gr=vRange(errs,'plan.granted',o.plan.granted,0,1e6);
  if(gr!==null)p.plan.granted=Math.floor(gr);
  var ca=vRange(errs,'plan.carried',o.plan.carried,0,1e6);
  if(ca!==null)p.plan.carried=Math.floor(ca);
  /* the unique count when the current period opened. spend is per period and
     a lifetime count cannot answer it. */
  var ba=vRange(errs,'plan.base',o.plan.base,0,1e7);
  if(ba!==null)p.plan.base=Math.floor(ba);
  ['since','until'].forEach(function(f){
   if(o.plan[f]===null||o.plan[f]===undefined)return;
   if(typeof o.plan[f]==='string'&&!isNaN(new Date(o.plan[f]).getTime()))p.plan[f]=o.plan[f];
   else errs.push('plan.'+f+' is not a date');});
  /* and nothing else comes across. a record carrying a customer id or a key
     is carrying something this product refused to hold. */
  ['customer','subscription','email','key','secret','token'].forEach(function(f){
   if(o.plan[f]!==undefined)errs.push('plan.'+f+' is not held by this product');});}
 else if(o.plan!==undefined)errs.push('plan is not an object');
 /* THE AVATAR. A pair is written as a pair and half a pair is refused rather
    than half kept, because the left side alone has no address and the right
    side alone has no direction. The text is the person's own and is only
    bounded, never edited. */
 if(o.avatar&&typeof o.avatar==='object'){
  p.avatar.built=!!o.avatar.built;
  ['at','reviewedAt'].forEach(function(f){
   if(o.avatar[f]===null||o.avatar[f]===undefined)return;
   if(typeof o.avatar[f]==='string'&&!isNaN(new Date(o.avatar[f]).getTime()))
    p.avatar[f]=o.avatar[f];
   else errs.push('avatar.'+f+' is not a date');});
  if(Array.isArray(o.avatar.pairs)){
   p.avatar.pairs=o.avatar.pairs.filter(function(x){
    return x&&typeof x==='object'
     &&typeof x.be==='string'&&x.be.length>0&&x.be.length<200
     &&typeof x.notbe==='string'&&x.notbe.length>0&&x.notbe.length<200;})
    /* THE SEAT A PAIR WAS WRITTEN AT, round JP, and the one field this round
       adds to the record. He asked for the avatar to be written root to crown,
       one story per seat, and the seat a person wrote at is a fact the sniffer
       cannot recover: "my throat is tight at the board" written at the root is
       the root's story that happens to land at the throat. Without it here the
       boundary rebuilt every pair as be and notbe and the seat was gone on the
       next load, so every tick on the wheel would have moved to wherever the
       sniffer heard the words. Optional, because every pair written before
       this round has none and is still placed by the sniffer as it always was.
       A seat that is not one of the seven is refused by name rather than
       dropped, because a story quietly moved off its seat is a story the
       person thinks they wrote somewhere else. */
    .map(function(x){var q={be:x.be, notbe:x.notbe};
     if(x.seat!==undefined&&x.seat!==null){
      if(BANDS.indexOf(x.seat)>=0)q.seat=x.seat;
      else errs.push('avatar.pairs seat '+JSON.stringify(x.seat)+' is not a seat');}
     return q;});
   if(p.avatar.pairs.length!==o.avatar.pairs.length)
    errs.push('avatar.pairs held '+(o.avatar.pairs.length-p.avatar.pairs.length)
     +' entries that are not a written pair');}
  else if(o.avatar.pairs!==undefined)errs.push('avatar.pairs is not a list');}
 /* NULL IS MISSING, NOT WRONG. The rule is that a missing field is an older
    profile and is filled from the blank, and only a field of the wrong type or
    out of range is refused by name. These two tested `!==undefined`, so a
    record carrying avatar:null, which is exactly what an earlier build wrote,
    was refused and the person's whole profile with it. loadProfile has always
    treated a null avatar as an older record and filled it. The boundary now
    agrees with it. */
 else if(o.avatar!==undefined&&o.avatar!==null)errs.push('avatar is not an object');
 /* THE PURPOSE MAP. Three and three, and six sides of five. A seventh value
    or a sixth commitment on one side is refused rather than dropped, because
    a boundary quietly truncated is a boundary a person thinks they set. */
 if(o.purpose&&typeof o.purpose==='object'){
  ['soul','ego'].forEach(function(f){
   if(o.purpose[f]===undefined)return;
   if(!Array.isArray(o.purpose[f])||o.purpose[f].length>3){
    errs.push('purpose.'+f+' is not three values'); return;}
   p.purpose[f]=o.purpose[f].map(function(x){
    return typeof x==='string'&&x.length<120?x:'';});
   while(p.purpose[f].length<3)p.purpose[f].push('');});
  if(o.purpose.sides&&typeof o.purpose.sides==='object'){
   PUR_SIDES.forEach(function(sd){
    var a=o.purpose.sides[sd];
    if(a===undefined)return;
    if(!Array.isArray(a)){errs.push('purpose.sides.'+sd+' is not a list'); return;}
    if(a.length>PUR_PER_SIDE){
     errs.push('purpose.sides.'+sd+' holds '+a.length+', which is more than '+PUR_PER_SIDE);
     return;}
    p.purpose.sides[sd]=a.filter(function(x){
     return typeof x==='string'&&x.length>0&&x.length<200;});});}
  else if(o.purpose.sides!==undefined)errs.push('purpose.sides is not an object');}
 else if(o.purpose!==undefined&&o.purpose!==null)errs.push('purpose is not an object');
 if(Array.isArray(o.rituals))p.rituals=o.rituals
  .map(function(x,i){return vRitual(errs,i,x);}).filter(Boolean);
 else if(o.rituals!==undefined&&o.rituals!==null)errs.push('rituals is not a list');
 /* THE PRACTICE OBJECTS, through their own boundary (practiceValidate,
    engine/practice.js), into the same errs, so one bad practice refuses the
    whole record and pImport stays atomic. Missing or null is an older
    record and keeps the blank. */
 if(o.practice!==undefined&&o.practice!==null)p.practice=practiceValidate(errs,o.practice,'practice');
 /* A snapshot is strictly typed numbers and the record calls toFixed on them,
    so "the person's own text" does not apply here. An unchecked history
    crashed the record view on the first render after an import. */
 if(Array.isArray(o.history))p.history=o.history.map(function(x,i){
  if(!x||typeof x!=='object'){errs.push('history entry '+i+' is not an object');return null;}
  var q={t:typeof x.t==='string'?x.t:new Date().toISOString(),
   dark:typeof x.dark==='string'?x.dark:'Heart',
   /* null is a row written while CQ was still filling, and it stays null:
      defaulting it to Collapsed would put the lowest word on the scale on
      somebody who had only not finished the intake. */
   tier:(typeof x.tier==='string'||x.tier===null)?x.tier:'Collapsed',
   arch:typeof x.arch==='string'?x.arch:''};
  [['m',0,CQ_MODEL],['cq',0,100],['dq',0,1e4],['sq',0,10],['pole',0,10],['jq',0,10],['rad',0,10],
   ['loaded',0,1e4],['sab',0,1e4],['cx',0,1e4],['hy',0,1e4],['ch',0,1e4]].forEach(function(f){
   var v=vRange(errs,'history['+i+'].'+f[0],x[f[0]],f[1],f[2]);
   q[f[0]]=v===null?0:v;});
  /* THE TWENTY ONE ON THE ROW (snapLaws). This whitelist is why the field
     needed a line here and not only in snapshot(): every row is rebuilt from
     it, so a key snapshot() writes and this does not name survives until the
     next read off the disk and is then gone, which verp.js measured for the
     lean and declined to ship for exactly that reason.

     Absent or null is a row from before the laws were recorded and stays
     absent, never filled: twenty one nulls would say "read, and nothing
     answered", which is a different claim about that day. Present, it is a
     closed key set, the posture the two nested bags above take. A key that is
     not one of the twenty one is refused by name, an old name is read as the
     law it became, and a value is 0 to 10 or null and is refused by name
     otherwise, never clamped. */
  if(x.lawNow!==undefined&&x.lawNow!==null){
   var lp='history['+i+'].lawNow';
   if(typeof x.lawNow!=='object'||Array.isArray(x.lawNow))errs.push(lp+' is not an object');
   else{
    var WAS={}; Object.keys(LAW_WAS).forEach(function(k){WAS[LAW_WAS[k]]=k;});
    var lw={};
    Object.keys(x.lawNow).forEach(function(k){
     var nm=SINAMES.indexOf(k)>=0?k:(WAS[k]||null);
     if(!nm){errs.push(lp+' may not carry '+k); return;}
     /* the current name wins over an old one naming the same law */
     if(nm!==k&&x.lawNow[nm]!==undefined)return;
     if(x.lawNow[k]===null){lw[nm]=null; return;}
     var v=vRange(errs,lp+'.'+k,x.lawNow[k],0,10);
     if(v!==null)lw[nm]=v;});
    q.lawNow=lw;}}
  return q;}).filter(Boolean);
 /* A SIGN IN IS THE BROWSER'S AND NEVER THE RECORD'S. The brief that wired
    sign in, 30 September, asked for the bearer token to be added here as a
    profile field, and it would have leaked on the first press of Export: that
    control copies this whole record to the clipboard, and a record is a file
    a person hands to somebody else. One browser also holds several profiles
    and one session, so a token stored on one of them signs in whichever
    profile happens to be open. ui/auth.js holds it under its own key, beside
    the profiles and never inside one. This refuses it by name at the top
    level the way plan refuses it one level down, so a pasted record carrying
    somebody's session says so rather than being dropped with nothing said,
    and nothing that writes a profile can put one back without this failing. */
 ['token','session','password','email'].forEach(function(f){
  if(o[f]!==undefined)errs.push(f+' is not held by this product');});
 /* THE TRACE GRAPH'S STORED HALF, engine/trace.js. Missing or null is an
    older record and reads as the blank's empty layer. Anything else goes
    through validateTrace, which uses the live graph's own rule table, and
    each refusal is named under trace. rather than dropped. */
 if(o.trace!==undefined&&o.trace!==null){
  var tv=validateTrace(o.trace);
  if(tv.ok)p.trace=tv.trace;
  else tv.errs.forEach(function(e){errs.push('trace.'+e);});}
 /* THE BANK OF FROZEN DAYS, through its own boundary (dlyValidate,
    engine/daily.js), into the same errs, so one bad day refuses the whole
    record and pImport stays atomic. Missing or null is an older record and
    keeps the blank. The name is handed in for the one rule about it. */
 if(o.summaries!==undefined&&o.summaries!==null)
  p.summaries=dlyValidate(errs,o.summaries,'summaries',{names:dlyNamesOf(p)});
 return errs.length?{ok:false, errs:errs}:{ok:true, profile:p};}

/* Atomic. Nothing is pushed and CURP is not moved until the profile has
   validated and loaded. A failure leaves the app exactly as it was, and
   says what was wrong rather than returning a bare null. */
/* Counting is an engine job because the tier gate will read it, and the tier
   gate must not be able to disagree with the app about what was run. */
/* ============================================================
   THE KEY. Ruled: one pattern is one THOUGHT LINE, and the line
   targets the address by way of the channel.

   So the key is three parts and the order of them is the ruling
   read backwards: which thought, down which channel, at which
   address. The address is what is hit, the channel is how it is
   reached, and the line is the thought that does it.

   It was two parts, address and channel, which made every one of
   the fifty thoughts on a channel the same key. All two hundred
   statements on a card collapsed into four, the whole product held
   four hundred and twenty eight units of new ground, and tier one
   at four hundred a month finished it in five weeks. The ruling
   had already been written down and the code had taken half of it.

   A thought line, not a spoken one. Reading it in thought spends
   it. Nothing in this product requires a person to say anything
   out loud, and the count must not imply that it does.
   ============================================================ */
const LINES_PER_CH=50;          /* the printed card, a hundred each way, split */
function meterKey(nodeId,chan,line){
 return String(nodeId)+':'+String(chan)+(line==null?'':':'+String(line));}
/* THE NEXT UNOPENED LINE at an address down a channel. Read off the keys
   already held rather than stored, because a stored cursor and a stored key
   list are two answers to one question and they drift. */
function meterNext(p,nodeId,chan){
 var have={}; ((p&&p.meter&&p.meter.unique)||[]).forEach(function(k){have[k]=1;});
 for(var i=0;i<LINES_PER_CH;i++)
  if(!have[meterKey(nodeId,chan,i)])return i;
 return -1;}                    /* that channel at that address is fully open */
/* A RUN, as a list of keys. Walks the queue address by address and channel by
   channel, taking the next unopened line each time, and stops at the cap. New
   ground first, because that is what a tier buys and what a person came for. */
function meterPlan(p,nodeIds,chans,cap){
 var out=[], seen={};
 var lim=cap>0?cap:25;
 /* A RUN COSTS THE MINIMUM. Ruled.

    This took passes until it reached the cap, so the cap was a fill target and
    not a ceiling: every run cost twenty five whatever was selected, and one
    address cost the same as eight. Against a free grant of ten unique patterns
    that is nought runs a week, which this file's own comment downstream
    already noticed and described as the arithmetic rather than as a bug.

    One pass. The run is the addresses picked crossed with the channels, which
    is the fewest lines that covers the selection, and it is allowed to contain
    repeats. The cap still truncates a wide selection, which is what a ceiling
    is for. Opening more ground is done by running again, and a rerun of ground
    already open costs nothing, because planAllowance charges the unique count
    and not the line count. */
 for(var pass=0;pass<1&&out.length<lim;pass++){
  for(var a=0;a<(nodeIds||[]).length&&out.length<lim;a++){
   for(var c=0;c<(chans||[]).length&&out.length<lim;c++){
    var id=nodeIds[a], ch=chans[c];
    var n=meterNext(p,id,ch);
    /* skip forward past anything this plan has already taken */
    while(n>=0&&seen[meterKey(id,ch,n)])n++;
    if(n<0||n>=LINES_PER_CH)continue;
    var k=meterKey(id,ch,n); seen[k]=1; out.push(k);}}}
 return out;}
/* ============================================================
   THE RERUN, 22.K17. DECISIONS.md rules it four times: "Anything
   already opened may be rerun without limit and without cost,
   forever." Nothing planned it. meterPlan above walks unopened lines
   only and skips a channel with none left, so measured on one record
   one address released four times planned lines 0, 1, 2 and 3 and
   spent four patterns each time, 100 to 96 to 92 to 88, and an
   address with every line open planned nothing at all. The free
   rerun the plan sheet promised was a counting quirk in meterRun,
   which skips a repeated key, reached by no planner.

   So it is a second planner and a second writer, and neither one
   touches the first. It is a deliberate act, which DECISIONS.md also
   rules ("a rerun is a deliberate act rather than something that
   happens while somebody thinks they are opening something"), so
   meterPlan still never re-offers an open line and the release panel
   only builds this plan when the person picks it.
   ============================================================ */
/* THE LINE A RERUN SAYS, which is the highest open line down that channel
   at that address, or -1 when nothing there is open. meterNext opens the
   lowest unopened line, so the highest open one is the newest, which is
   what the last run there said. Line 0 again was the other candidate and it
   says the same first line of the card forever, because the cursor is read
   and never stored and so cannot walk a rerun forward. A line marked heavy
   was the third, and the engine has nothing to read it from: RUN.heavy in
   ui/release.js is keyed by plan index and pass and is gone when the card
   closes. Read off the keys held, for the reason meterNext is. */
function meterLast(p,nodeId,chan){
 var have={}; ((p&&p.meter&&p.meter.unique)||[]).forEach(function(k){have[k]=1;});
 for(var i=LINES_PER_CH-1;i>=0;i--)
  if(have[meterKey(nodeId,chan,i)])return i;
 return -1;}
/* A RERUN, as a list of keys, the same shape as a run: the addresses picked
   crossed with the channels, one line each, address by address so the
   release card's relSpan still finds every address in one block. A channel
   with nothing open is left out, never filled with new ground. The cap is
   RUN_MAX and only RUN_MAX: the allowance is not read here, because nothing
   here is charged. */
function meterRerunPlan(p,nodeIds,chans,cap){
 var out=[], lim=cap>0?cap:RUN_MAX;
 for(var a=0;a<(nodeIds||[]).length&&out.length<lim;a++)
  for(var c=0;c<(chans||[]).length&&out.length<lim;c++){
   var n=meterLast(p,nodeIds[a],chans[c]);
   if(n>=0)out.push(meterKey(nodeIds[a],chans[c],n));}
 return out;}
/* RECORDING A RERUN, which never spends. meterRun pushes every key it has not
   seen onto meter.unique, and the allowance is that list's length, so the
   rerun does not go through it at all: a rerun that reached meterRun would
   cost nothing only for as long as every key in it happened to be open. This
   checks each key against what is open and refuses the rest by name, so a
   rerun plan gone stale between being shown and being run, after an undo,
   opens nothing and is not counted. Lines spoken and the last run move,
   because they were spoken and it was a run. */
function meterRerun(p,keys){
 var list=(keys||[]).filter(function(k){return typeof k==='string'&&k;});
 var m=(p&&p.meter)||null, have={}, said=[], refused=[];
 ((m&&Array.isArray(m.unique)&&m.unique)||[]).forEach(function(k){have[k]=1;});
 list.forEach(function(k){(have[k]?said:refused).push(k);});
 if(m&&said.length){
  /* THE FREE WEEKS MUST NOT MOVE. A record that ran the gift out before the
     giftAt stamp existed counts its weeks from meter.last, which this is
     about to move, so the stamp is written first off the value already read,
     the way meterRun writes it. Without it a rerun would restart that count
     and take weeks of allowance from somebody for using the free route. */
  var now=new Date().toISOString();
  if(!m.giftAt&&(m.unique||[]).length>=GIFT_N)m.giftAt=meterGiftAt(p)||now;
  m.lines=(+m.lines||0)+said.length; m.last=now;
  if(!m.first)m.first=now;}
 return {added:0, repeated:said.length, fresh:[], refused:refused, rerun:true};}
/* WHAT A RUN IS ALLOWED TO COST, WHICH IS NOT THE SAME AS WHAT IT CAPS AT.

   The release panel printed "16 patterns of the 0 you have left" and then ran
   all sixteen. Measured on the shipped build against a free record with the
   gift spent and base at 100: relLeft() 0, plan 16, unique 110 before the run
   and 126 after, and relLeft() still 0 afterwards because the subtraction
   clamps at nought. So the overspend was invisible before, during and after,
   and the one panel in this product that quotes a price was quoting a false
   one directly under the paid tiers.

   The allowance is a second ceiling and belongs where the first one is.
   meterPlan already truncates a wide selection at the cap, one pattern per
   line, and every line it returns is new ground, so a cap of what is left
   spends exactly what is left and the printed number is the price. That is a
   shorter run rather than a refused one, which matters: a person who picked
   eight addresses with three patterns left gets three, not nothing.

   Refusing is left to the door, and only when the cap is nought. A run already
   under way is never interrupted, because relCoolDown commits the plan it was
   shown, and that plan is now already inside the allowance. */
/* WHEN THE FREE WEEKS COUNT FROM. The stamp meterRun writes when the gift runs
   out. A record that ran the gift out before the stamp existed has none, and
   for that record the last run is used: its allowance read nought from the
   moment the gift was spent, so its last run is the run that spent it, and
   the weeks it was owed since are counted from there. meterRun stamps that
   same value on the next run, before it moves last, so the count never
   restarts. */
function meterGiftAt(p){
 var m=(p&&p.meter)||null; if(!m)return null;
 if(m.giftAt)return m.giftAt;
 return ((m.unique||[]).length>=GIFT_N&&m.last)?m.last:null;}
function meterBudget(p,now){
 var m=(p&&p.meter)||null;
 var a=(typeof planAllowance==='function')
   ? planAllowance((p&&p.plan)||null,((m&&m.unique)||[]).length,meterGiftAt(p),now) : null;
 var left=(a&&a.left!=null)?Math.max(0,Math.floor(a.left)):0;
 return {left:left, cap:Math.min(RUN_MAX,left), allow:a};}
/* `at`, optional, is the moment the run happened, an ISO string. Missing is
   now, which is every live run. A worked example's history is replayed
   through this same writer (engine/exdepth.js) and passes the day each run
   happened, so its dated first and last are the history's and not the
   moment the page was opened. Added on the end, so every caller that passes
   two arguments reads exactly as it did. */
function meterRun(p,keys,at){
 if(!p)return null;
 if(!p.meter)p.meter={lines:0,unique:[],first:null,last:null,giftAt:null};
 if(!Array.isArray(p.meter.unique))p.meter.unique=[];
 if(p.meter.giftAt===undefined)p.meter.giftAt=null;
 if(typeof p.meter.relLines!=='number')p.meter.relLines=0;
 if(typeof p.meter.truthLines!=='number')p.meter.truthLines=0;
 /* an older record has no plan, which is a free record and not a broken one */
 if(!p.plan)p.plan={tier:'free',status:'',granted:0,carried:0,base:null,since:null,until:null};
 if(p.plan.base===undefined)p.plan.base=null;
 if(!p.avatar)p.avatar=avatarBlank();
 if(!Array.isArray(p.avatar.pairs))p.avatar.pairs=[];
 if(!p.purpose)p.purpose=purposeBlank();
 var list=(keys||[]).filter(function(k){return typeof k==='string'&&k;});
 if(!list.length)return {added:0,repeated:0,fresh:[]};
 var have={},added=0,repeated=0,fresh=[];
 /* whether the gift was already spent before this run, read before the push */
 var spentBefore=p.meter.unique.length>=GIFT_N;
 p.meter.unique.forEach(function(k){have[k]=1;});
 list.forEach(function(k){ if(have[k]){repeated++;} else {have[k]=1;p.meter.unique.push(k);fresh.push(k);added++;} });
 var now=(typeof at==='string'&&!isNaN(Date.parse(at)))?at:new Date().toISOString();
 /* the gift runs out once, and this is where it is seen to. If it ran out in
    this run, it ran out now. If it ran out before the stamp existed, the date
    it has been read at is kept, read through meterGiftAt before last moves,
    so the count of weeks never restarts. */
 if(!p.meter.giftAt&&p.meter.unique.length>=GIFT_N)
  p.meter.giftAt=(spentBefore&&meterGiftAt(p))||now;
 if(!p.meter.first)p.meter.first=now;
 p.meter.lines+=list.length; p.meter.last=now;
 /* fresh is the new ground by key, which is what the release lift counts:
    the address in each key names the seat whose laws it lifts. */
 return {added:added, repeated:repeated, fresh:fresh};}

/* ============================================================
   RERUN V2, round OG. His words: "rerunning is a line you marked heavy. And
   it would go back into that kind of where it would sit in that bell curve."
   And of the release itself: "there's a structural flow to the release. We
   start with the least tense words, the most tense words, and then the
   decompression words, from the least intense to the most intense."

   WHAT THE CODE CAN SAY ABOUT WHERE A LINE SITS, AND ONLY THAT. The one rank
   of tension a line carries is its number on the fifty. The card is an
   escalation, "five bands of ten" (C3_BAND in engine/data/cards.js), meterNext
   opens the lowest unopened number first, and a key is address, channel and
   that number. So a line's place on the curve is its line number, ascending,
   and nothing is invented here: no rating per line exists and none is added.
   What is NOT in the code is the curve as a shape. relLine says the printed
   card's five lines round and round (cardLine reads i modulo the card's depth)
   and says one sentence for every number at an address with no card, so the
   words at line 7 are the words at line 2. The number orders the rerun and
   does not yet change a sentence. The hertz per seat (FLOWSEAT) is a tone and
   the lever's bell (compute.js) is over an address's weight, and neither is
   an intensity per line, so neither is read here. The questions this leaves
   are in DECISIONS.md under round OG.

   THE ORDER, so a heavy line goes back and nothing is appended. Address by
   address in the order the addresses were picked, which keeps the release's
   address major run and relSpan's one block per address. Inside an address,
   the channels in the order the caller names them, which is left release,
   right release, left reframe, right reframe: release first and reframe
   after, the book's order. Inside a channel the lines ascend, least tense
   first. With nothing marked heavy that is exactly what meterRerunPlan
   returned, one line a channel, so a record that never marked a line reruns
   as it always has.

   NEVER NEW GROUND AND NEVER A PRICE. A heavy mark is a fact about a key
   already in unique, so the plan can only hold lines that are open, and
   meterRerun still refuses any key that is not. Nothing here writes unique,
   lines, first or last, so the allowance does not move.
   ============================================================ */
var HEAVY_KEY=/^(\d+):([LR](?:limit|truth)):(\d+)$/;
/* WHY A KEY CANNOT BE HEAVY, or null when it can. The one test, read by the
   writer and by the boundary, so a mark the app would refuse is a mark an
   import refuses in the same words. */
function meterHeavyWhy(p,k){
 if(typeof k!=='string')return 'is not a string';
 var m=HEAVY_KEY.exec(k);
 if(!m||+m[3]>=LINES_PER_CH)
  return 'is not a line key, address:channel:line with the line under '+LINES_PER_CH;
 var open=(p&&p.meter&&Array.isArray(p.meter.unique))?p.meter.unique:[];
 if(open.indexOf(k)<0)return 'is not a line this record has opened';
 return null;}
/* the stored order: address, then channel, then line as a number. Called on
   keys that already passed meterHeavyWhy, because it parses them. */
function meterHeavySort(list){
 function part(k){var m=HEAVY_KEY.exec(k); return [+m[1],m[2],+m[3]];}
 return list.slice().sort(function(a,b){
  var x=part(a), y=part(b);
  return x[0]-y[0]||(x[1]<y[1]?-1:x[1]>y[1]?1:0)||x[2]-y[2];});}
/* MARK LINES HEAVY ON THE RECORD. Refuses by name any key that is not a line
   this record has opened and reports every refusal with its reason, so the
   caller can say so. It touches meter.heavy and nothing else, so it can never
   cost anything. Marking a line that is already heavy is not an error and is
   reported as already. */
function meterHeavy(p,keys){
 var out={marked:[], already:[], refused:[]}, m=(p&&p.meter)||null;
 var held=(m&&Array.isArray(m.heavy))?m.heavy:[], have={};
 held.forEach(function(k){have[k]=1;});
 (keys||[]).forEach(function(k){
  var why=m?meterHeavyWhy(p,k):'has no record to be marked on';
  if(why){out.refused.push({key:k, why:why}); return;}
  if(have[k]){out.already.push(k); return;}
  have[k]=1; out.marked.push(k);});
 if(out.marked.length)m.heavy=meterHeavySort(held.concat(out.marked));
 return out;}
/* TAKE A MARK OFF. Nothing in the app calls it yet: a mark is made while a line
   is said and there is no ruling on how one is withdrawn. It is here so that
   when there is, the record has a writer that keeps the list sorted and unique
   rather than a screen splicing the array by hand. */
function meterHeavyClear(p,keys){
 var out={cleared:[], absent:[]}, m=(p&&p.meter)||null;
 var held=(m&&Array.isArray(m.heavy))?m.heavy:[], drop={};
 (keys||[]).forEach(function(k){
  if(held.indexOf(k)>=0&&!drop[k]){drop[k]=1; out.cleared.push(k);} else out.absent.push(k);});
 if(out.cleared.length)m.heavy=held.filter(function(k){return !drop[k];});
 return out;}
/* THE RERUN, WITH THE HEAVY LINES PUT BACK. meterRerunPlan is the opened line
   rule and is called unchanged for the base, so the cap and the addresses it
   reaches are exactly what they were: an address the cap cut off stays cut off
   and a heavy line never pulls one in. The heavy lines of the addresses it did
   reach are then added in the room under the cap, address by address and
   channel by channel, lowest line first, so what the cap drops is the most
   tense heavy line of the last address and never a channel's own last line,
   which would leave a release with no reframe. The whole is then put in order.
   A heavy key no longer open, which a hand edited store could hold, is
   skipped here as meterRerun would refuse it. */
function meterRerunOrder(p,nodeIds,chans,cap){
 var lim=cap>0?cap:RUN_MAX;
 var take={}, base=meterRerunPlan(p,nodeIds,chans,lim), reached={};
 base.forEach(function(k){take[k]=1; reached[k.split(':')[0]]=1;});
 var heavy={}, open={}, room=lim-base.length;
 ((p&&p.meter&&p.meter.unique)||[]).forEach(function(k){open[k]=1;});
 ((p&&p.meter&&Array.isArray(p.meter.heavy)&&p.meter.heavy)||[]).forEach(function(k){
  if(open[k]&&HEAVY_KEY.test(k))heavy[k]=1;});
 var ids=[], seenId={};
 (nodeIds||[]).forEach(function(id){id=String(id); if(!seenId[id]){seenId[id]=1; ids.push(id);}});
 ids.forEach(function(id){ if(!reached[id])return;
  (chans||[]).forEach(function(ch){
   for(var i=0;i<LINES_PER_CH&&room>0;i++){
    var k=meterKey(id,ch,i);
    if(heavy[k]&&!take[k]){take[k]=1; room--;}}});});
 /* THE DECOMPRESSION HALF RUNS DOWN, round OK. His words, on the order of
    the reframe lines: "I never thought about cycling it back down to one.
    Let's try it." The release channels run line 1 up to 50, least tense to
    most tense, and the reframe channels (the ones ending in truth) run 50
    back down to 1, so a run leaves the way it came in. */
 var out=[];
 ids.forEach(function(id){ if(!reached[id])return;
  (chans||[]).forEach(function(ch){
   var down=/truth$/.test(ch);
   for(var j=0;j<LINES_PER_CH;j++){
    var i=down?LINES_PER_CH-1-j:j, k=meterKey(id,ch,i);
    if(take[k])out.push(k);}});});
 return out;}

/* ============================================================
   THE HORIZON, AND WHY THE LADDER IS NOT A FIXED COUNT.

   The owner's ruling, and it overturns what this file said before.
   A person does not have to clear a fixed number. They have to
   clear THEIR OWN, and their own is a function of how long they
   have been alive to accumulate it.

   The anchor is his: fifteen thousand by the age of fifty. That is
   three hundred a year, and three thousand a decade, not the two
   thousand a decade he estimated out loud. The arithmetic is stated
   here rather than rounded to the estimate, because every marker in
   the product derives from it.

   Three thresholds were named with distances attached: breaking
   duality around five hundred, the beginning of nirvana around ten
   thousand, ascension around fifteen thousand. Against a total of
   fifteen thousand those are exact thirtieths, one, twenty and
   thirty, and the three thresholds already in the book fall on
   thirtieths too, five, seven and nine. So the ladder is a fraction
   of a person's own load and always was. The absolute counts were
   one man's numbers at one man's age.

   A twenty year old does not reach ascension at fifteen thousand.
   They reach it at six. The distance is the same distance: all of
   what they are carrying.

   The swing is ten percent because how hard somebody identifies
   with a thing is not knowable from a birth date. PAT_GEN is the
   place a generational rate goes, on the owner's observation that
   younger people are more identified, which is a real effect and
   not yet a number. It multiplies the yearly rate and is one until
   he sets it, so the model has the seam without inventing the
   figure.

   It was called PAT_COHORT for half a day. A cohort is now a group
   of people a practitioner teaches together, which is a different
   object entirely and is the one a person will say out loud. One
   word per concept, so the birth band is a generation and the
   classroom keeps the word cohort.
   ============================================================ */
const PAT_PER_YEAR=300, PAT_SWING=0.10, PAT_GEN=1;
/* The ladder, from SOURCE OS v27.3 Sprint J, which the owner had already
   designed. Six fixed distances on one ruler.

   Two things were reconciled against that document. It names 3,500
   Integration where the engine had Christ consciousness; the owner's own
   document wins. And its counts are of total releases, which include
   repeats, where the meter counts unique ground opened. Unique is the
   harder number and the one a tier sells, so the thresholds are held
   against it and the difference is stated rather than quietly rescaled.

   A marker is a distance, never a trophy and never a gate. Nothing in the
   product unlocks at one, because a marker that unlocks something is a
   marker for sale, and unique ground is exactly what money buys. */
const MARKERS=[
 {nm:'Entry',                at:1,     of:'the first address opened'},
 {nm:'Breaking duality',     frac:1/30,  of:'your own load'},
 {nm:'The Still Mind',       frac:5/30,  of:'your own load'},
 {nm:'The Open Heart',       frac:7/30,  of:'your own load'},
 {nm:'Clear Perception',     frac:9/30,  of:'your own load'},
 {nm:'Beginning of Nirvana', frac:20/30, of:'your own load'},
 {nm:'Ascension',            frac:1,     of:'your own load'}];
/* A marker resolves against the person in front of it. Entry is the one
   absolute, because a first address is a first address at any age. The rest
   are fractions and need a total, so a record with no birth date is read
   against the reference scale rather than refused: the owner's own, fifty
   years, fifteen thousand. The read says which of the two it used, because a
   distance computed from somebody else's age is a different claim and the
   surface has to be able to say so. */
const PAT_REF_AGE=50;
function markersFor(est){
 var total=est||Math.round(PAT_REF_AGE*PAT_PER_YEAR*PAT_GEN);
 return MARKERS.map(function(k){
  return {nm:k.nm, of:k.of,
   at:(k.at!=null)?k.at:Math.max(1,Math.round(total*k.frac))};});}
function ageAt(dateStr,now){
 if(!dateStr)return null;
 var b=new Date(dateStr+'T00:00:00Z'); if(isNaN(b.getTime()))return null;
 var t=now?new Date(now):new Date();
 var a=(t-b)/(365.2425*24*3600*1000);
 return a>0&&a<130?a:null;}
function meterRead(p,now){
 var m=(p&&p.meter)||{lines:0,unique:[],first:null,last:null};
 var uniq=(m.unique||[]).length;
 var age=ageAt(p&&p.who&&p.who.born?p.who.born.date:null,now);
 var est=age===null?null:Math.round(age*PAT_PER_YEAR*PAT_GEN);
 var mk=markersFor(est);
 return {lines:m.lines, unique:uniq, first:m.first, last:m.last,
  /* the gift is 100 of new ground, ruled. reruns never spend it. */
  giftLeft:Math.max(0,GIFT_N-uniq), inGift:uniq<GIFT_N,
  age:age===null?null:Math.round(age*10)/10,
  estimate:est,
  estimateLow:est===null?null:Math.round(est*(1-PAT_SWING)),
  estimateHigh:est===null?null:Math.round(est*(1+PAT_SWING)),
  cleared:est?Math.min(1,uniq/est):null,
  /* the ladder, resolved against this person rather than against a table */
  scaled:est!==null,
  markers:mk.map(function(k){return {nm:k.nm, at:k.at, of:k.of,
   reached:uniq>=k.at, left:Math.max(0,k.at-uniq)};}),
  /* the next one only, because six distances at once is a to do list and
     one distance is a direction. null when they are all behind you. */
  next:(function(){for(var i=0;i<mk.length;i++)
   if(uniq<mk[i].at)return {nm:mk[i].nm, at:mk[i].at,
    left:mk[i].at-uniq}; return null;})(),
  /* a dated first cannot be taken away and claims no causation, which is
     why it is the only achievement shape this product allows. */
  firsts:(p&&p.meter&&p.meter.firsts)||[]};}

/* Record a dated first. meterRun already knows the moment ground is new
   and nothing read it. These are facts about the work, never statements
   about the person: the ladder says an address was opened on a date, it
   does not say what that made someone. */
function meterFirst(p,key,label,at){
 if(!p||!key)return null;
 if(!p.meter)p.meter={lines:0,unique:[],first:null,last:null};
 if(!Array.isArray(p.meter.firsts))p.meter.firsts=[];
 for(var i=0;i<p.meter.firsts.length;i++)
  if(p.meter.firsts[i].k===key)return null;      /* a first happens once */
 /* `at` is meterRun's: the moment of the run, missing for a live one */
 var f={k:key, t:(typeof at==='string'&&!isNaN(Date.parse(at)))?at:new Date().toISOString(), nm:label||key};
 p.meter.firsts.push(f);
 return f;}

var IMPORT_ERR=null;
function pImport(txt){
 IMPORT_ERR=null;
 var o; try{ o=JSON.parse(txt); }catch(e){ IMPORT_ERR=['not valid JSON']; return null; }
 var v=validateProfile(o);
 if(!v.ok){ IMPORT_ERR=v.errs; return null; }
 var keepP=PROFILES.slice(), keepC=CURP;
 /* with no current profile there is nothing to restore to, so the rollback
    loads a blank rather than leaving the engine holding the rejected one. */
 var back=function(){ PROFILES=keepP; CURP=keepC; loadProfile(keepC||blankProfile('unnamed')); };
 try{ loadProfile(v.profile); }
 catch(e){ back(); IMPORT_ERR=['could not load: '+((e&&e.message)||'error')]; return null; }
 PROFILES.push(v.profile); CURP=v.profile;
 if(!pPersist()){ back(); IMPORT_ERR=['could not save: '+(SAVE_ERR||'error')]; return null; }
 return v.profile;}
function importError(){ return IMPORT_ERR; }

