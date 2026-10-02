/* ============================================================
   A WORKED EXAMPLE'S BANK AND VAULT. Round QD, the owner's words: "for these
   profiles, load up their bank and their vault. With real data, let's give
   their profile some depth. That way we can use the engine to simulate it
   accurately."

   WHAT THE TWO WORDS ARE IN THIS CODE, read off it and not assumed. They are
   the two icons on the Story page's read column, round IG (ui/storyui.js):
     the bank    "every imprint you hold, on the Imprints page". The held
                 field, and the committed stories that put it there, which the
                 Imprints page groups by entry under Story (ui/imprints.js).
     the vault   "what you have released". stVaultRows reads it off the
                 record's meter: the line keys meterRun wrote and the dated
                 firsts meterFirst wrote. Nothing else.
   A worked example had neither. A story cannot be committed on one and a
   release is refused on one (stCommit, relCoolDown), so its story list and
   its meter were always empty, and the vault said "Nothing released yet" on
   every example in the product.

   WHAT IS AUTHORED AND WHAT IS READ, the discipline engine/pracex.js set.
   Authored, per example: the words of each journal entry, which day it was
   written, and for each release the day, how many addresses and the dose a
   channel (the Patterns field). Nothing else. Read, by replaying the history
   through the writers a person's own presses go through:
     an entry      parseStory reads it, and when it found anything applyStory,
                   verpApply and leanApply write it, exactly as stCommit does;
                   the entry is pushed in stCommit's shape, imprints and seats
                   as parseStory counted them
     a release     relHeaviest picks the addresses the Release button would,
                   off the field as the history has left it that day,
                   meterBudget caps it, meterPlan keys it down the four
                   channels, relWrite moves the charge at each address,
                   meterRun records the lines, releaseWork lifts the laws, and
                   meterFirst dates each address and seat opened. The
                   lifetime counts are relCoolDown's own sums
   So every key, count, seat and date in the result is the engine's answer and
   none is typed here. A history the engine cannot run is a thrown error naming
   the step, and tests/engine.js runs every row.

   THE FIELD IS LEFT EXACTLY WHERE IT WAS. The replay writes the shared state
   S, because those writers only write S, and puts every charge, every
   opposite and both gate mixes back before it returns, the way relProject
   already does for its shadow. The example's table (engine/data/people.js) is
   its measurement now; the history is how it got there, and it does not move
   the reading a person sees.

   AND THE LAW TABLE IS THE LATEST MEASUREMENT, taken after the history. A
   release lifts the laws at its seat (releaseWork), and a law answered again
   is a new reading that clears that lift (lawAnswered, which the intake calls).
   The table is the example's answers as they stand, so the history ends with
   every law answered and the lift is cleared through that same writer. Without
   it the CQ on screen would drift off the target each table was solved to.

   NEVER STORED. It fills a scratch record in memory, the one loadP keeps per
   example (PROF_BY, ui/personas.js), which never joins PROFILES and is never
   persisted. HOST FREE: the moment is passed in.
   ============================================================ */

/* ONE PERSON'S HISTORY. e is the journal: [days back, the words]. r is the
   releases: [days back, addresses, patterns a channel]. Addresses stays at six
   or under on purpose: six addresses down four channels is twenty four lines,
   under RUN_MAX, so the plan reaches every address the queue holds and no
   address is written without a line said at it. The words are the example's
   own, in the first person, and like `says` they are quoted rather than the
   product speaking. Every one names a thing that happened in a body on a day,
   because that is what the sniffer reads. */
var EXDEPTH_HIST={
 Sofia:{
  e:[[34,'I held the room for three hours and drove home with my shoulders up by my ears. The grief came when the garage door closed.'],
     [26,'A client thanked me and I felt nothing. Then I sat in the bath until the water went cold and my chest stayed tight the whole time.'],
     [17,'I asked my sister for help with the move and my throat closed on the word. I said I had it covered.'],
     [8,'Slept nine hours for the first time this year. Woke up sad and I could not tell you why.']],
  r:[[30,3,20],[21,4,30],[12,3,30],[4,2,40]]},
 Diane:{
  e:[[38,'Board call at six. My stomach was a fist before I opened the laptop, anxious until noon.'],
     [29,'I took Sunday off and spent it afraid of Monday. My jaw ached by the evening from holding it.'],
     [20,'Fired a vendor today. I was right and I felt sick for two hours afterwards, a hot shame in the gut.'],
     [11,'The investor said the numbers were good. I felt dread anyway, like waiting for the floor to drop.'],
     [3,'I left the office at five and sat in the car park for forty minutes because going home felt like failing.']],
  r:[[33,4,25],[24,5,25],[15,4,30],[6,5,30]]},
 Marcus:{
  e:[[35,'I saw the flaw in the deck in four seconds and said so. The room went cold and I was angry, my neck burning with it.'],
     [24,'My junior cried after the review. I felt disgust at the work and then at myself.'],
     [14,'I praised a piece out loud for once. My chest felt open and strange, like a window left up.'],
     [5,'Lost the pitch. I was angry at the client, then at the team, then at nobody, and my hands would not stop.']],
  r:[[28,3,20],[18,3,25],[9,4,30]]},
 Angela:{
  e:[[33,'My father is in hospital and I told everyone it was meant to be. In the lift my legs went weak and I was afraid.'],
     [23,'I did a sound bath and a reading and a cold plunge in one week. I still feel numb behind my ribs.'],
     [13,'I screamed in the car at a red light. Then I laughed, because I never scream. My throat is raw.'],
     [4,'I let myself be sad at the funeral and it hurt in my chest like a bruise. Nobody told me it happened for a reason.']],
  r:[[27,3,20],[16,4,25],[7,3,30]]},
 Derek:{
  e:[[40,'Ran twenty miles on a sore shin and told nobody. The pain was loud and I made it quiet.'],
     [31,'My coach said rest a week. I was furious, a heat in my chest, and I went out anyway.'],
     [22,'Shin went at mile eight. I stood on the verge ashamed, shaking, waiting for the car.'],
     [13,'Two weeks off the road. I am angry all day and I do not know where to put it in my body.'],
     [4,'Walked for an hour with my daughter. No watch. My breath went slow and I did not hate it.']],
  r:[[36,5,30],[27,5,30],[18,6,30],[9,5,40]]},
 James:{
  e:[[41,'Cut four hundred jobs on a video call. I slept fine. My wife says I grind my teeth now.'],
     [30,'The board chair shouted at me and I felt nothing, then a cold shock in the gut on the drive home.'],
     [19,'My son did not call on my birthday. I told myself it did not matter. My jaw locked all evening and I was resentful.'],
     [9,'A former director wrote to say I had been cruel. I read it twice and felt the heat of shame in my face.']],
  r:[[24,4,20],[12,3,25]]},
 Rosa:{
  e:[[37,'Delivered my granddaughter in the front room. My hands knew the way. Afterwards the old grief for my mother came up, and it moved through.'],
     [25,'Walked to the market and back. Nothing caught. The sun was warm on my neck.'],
     [14,'An old patient died. I was sad for a day, a soft ache in the chest, and then it settled.'],
     [7,'Packed my mother\'s sewing box for my niece. Sad for the afternoon, an ache in the chest, and I let it be there.']],
  r:[[13,2,40],[5,2,50]]},
 Ana:{
  e:[[39,'I packed the classroom into nine boxes and could not lift the last one. I sat on the floor shaking.'],
     [32,'Woke at three with my heart racing and the old fear that I chose wrong.'],
     [25,'My ex took the dog for the weekend. The house was so quiet my ears rang. I felt hollow and ashamed.'],
     [17,'Interview went well and I felt sick and afraid afterwards anyway, sweat down my back in the corridor.'],
     [10,'Sat in the park for an hour. For about ten minutes my chest was not tight.'],
     [3,'I cried at the bank because the clerk was kind. I am exhausted all the way to the bone.']],
  r:[[28,5,20],[14,5,25],[5,4,25]]},
 Tomas:{
  e:[[42,'Could not get past the end of the street again. My legs went to water at the corner and the fear came up hot.'],
     [33,'My daughter brought dinner and I could not eat it. The shame sat in my stomach like a stone.'],
     [21,'Woke up shaking from the old crash dream. Sat on the bed edge until it was light.'],
     [11,'Watched the lorries on the motorway from the bridge. Felt nothing at all, then a hot wave of grief.']],
  r:[[16,3,10]]},
 Wren:{
  e:[[36,'Strung a cello for a girl of twelve. My hands were steady and warm the whole afternoon.'],
     [22,'My brother rang about the house. The old shame came up hot in my face and sat there for an evening.'],
     [9,'Planed a spruce top in the morning light. Nothing caught. I noticed the breath go all the way down.']],
  r:[[31,2,40],[19,3,40],[7,2,50]]},
 Abraham:{
  e:[[38,'Sat for an hour at dawn. Somewhere in the second half my hands went warm and stayed warm.'],
     [24,'A former colleague asked if I regret a sentence I passed. The shame came up in my chest and I let it be there.'],
     [10,'My grandson asked what a judge does. I laughed and told him I mostly listened. My shoulders dropped.']],
  r:[[33,3,40],[20,3,50],[8,3,50]]},
 Gordon:{
  e:[[40,'Another partner resigned by email. I was furious for an hour, a pressure behind my eyes.'],
     [28,'My doctor said blood pressure. I told him it is the job. My chest was tight in the waiting room.'],
     [16,'The associates went quiet when I walked in. I felt disgust, and something under it I did not look at.'],
     [6,'My daughter said I frighten people. I shouted, and then my hands shook on the steering wheel.']],
  r:[]},
 'Lance 15':{
  e:[[37,'Shipped at four in the morning and woke at six with my jaw already set. Coffee on an empty stomach, heart racing by nine.'],
     [28,'A build broke in front of the team and I was angry before I knew it, a heat up my neck I could not put down.'],
     [19,'Missed dinner again. Sat in the car outside the house with my chest tight, ashamed to go in.'],
     [10,'Could not sleep. Lay there afraid the whole thing falls over if I stop for one day.'],
     [2,'Snapped at my son over nothing. The shame sat in my stomach the rest of the night.']],
  r:[[24,3,15],[7,3,20]]},
 'Lance 50':{
  e:[[36,'Good week. The work ran clean and I slept through three nights in a row.'],
     [27,'One call landed wrong and I was back in the old wiring, angry before I knew it, my shoulders up and my voice sharp.'],
     [17,'Walked the dog without my phone. My breath slowed down about halfway round.'],
     [8,'Waiting on a contract. The old dread in the gut, the need to know now, right now.']],
  r:[[31,4,25],[21,4,30],[12,4,30],[4,3,30]]},
 'Lance 85':{
  e:[[35,'Long day and nothing stuck. I noticed my hands were warm at the keyboard.'],
     [21,'Caught myself waiting for the reply, anxious, a small pull in the chest. I let it pass.'],
     [9,'Argued a design call and needed to be right. Felt the anger as heat in my face, named it, and dropped it.']],
  r:[[30,4,40],[18,4,40],[6,3,50]]},
 'Lance 100':{
  e:[[33,'A deadline moved and the old anxious pull sat in my stomach for an hour, then it went.'],
     [27,'The launch slipped a week. Anxious again, the same knot under the ribs, the need to know now.'],
     [18,'A hard conversation with an old friend. Some sadness, and my chest stayed open the whole way through.'],
     [6,'Sat on the back step in the cold and felt the breath all the way down. Nothing holding.']],
  r:[[26,2,50],[12,2,50]]}};

/* the hour of the day each kind of event lands at, UTC, on its day. A story
   in the evening and a release after it, so on a day that has both the story
   reads first, the order the chain runs in: journal, imprint, release. */
var EXDEPTH_HOUR={e:20, r:21};
function exdepthAt(now,back,h){
 var d=new Date(now), base=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate());
 return new Date(base-back*DAY_MS+h*3600000).toISOString();}

/* whether a record already carries a history. A worked example's scratch
   record can be made before its first load (the practitioner page makes one
   blank), so loadP asks this rather than asking whether the record is new.
   Nothing else can fill either list on an example: a commit and a release are
   both refused on one. */
function exdepthHas(rec){
 return !!rec&&(((rec.story&&rec.story.entries)||[]).length>0
  ||((rec.meter&&rec.meter.unique)||[]).length>0);}

/* a map put back in place, the object kept because other code holds it by
   reference (relPut in ui/release.js does the same for the card's shadow) */
function exdepthPut(o,from){
 Object.keys(o).forEach(function(k){if(!(k in from))delete o[k];});
 Object.assign(o,from);}
/* THE REPLAY. rec is the example's record, S must already hold the example's
   field (loadP has just put it there), and now is the moment the history runs
   back from. Returns what it did, or throws naming the step the engine
   refused. */
function exdepthFill(rec,p,now){
 var h=p&&EXDEPTH_HIST[p.nm]; if(!rec||!h)return null;
 var ev=[];
 (h.e||[]).forEach(function(x){ev.push({k:'e', back:x[0], text:x[1]});});
 (h.r||[]).forEach(function(x){ev.push({k:'r', back:x[0], n:x[1], dose:x[2]});});
 /* oldest first, and on one day the story before the release */
 ev.sort(function(a,b){return b.back-a.back||(a.k===b.k?0:(a.k==='e'?-1:1));});
 var c0=Object.assign({},S.charge), r0=Object.assign({},S.replace);
 var v0=Object.assign({},VERPMIX), l0=Object.assign({},LEANMIX);
 var out={entries:0, imprints:0, runs:0, lines:0, addrs:0};
 try{
  rec.story=rec.story||{entries:[]};
  if(!Array.isArray(rec.story.entries))rec.story.entries=[];
  ev.forEach(function(x){
   var at=exdepthAt(now,x.back,EXDEPTH_HOUR[x.k]);
   if(x.k==='e'){
    var P=parseStory(x.text), k=P.imprints.length;
    if(k){applyStory(x.text); verpApply(x.text); leanApply(x.text);}
    rec.story.entries.push({t:at, text:x.text, imprints:k, bands:P.bands, lex:LEX_VERSION});
    out.entries++; out.imprints+=k; return;}
   compute();
   var q=relHeaviest(x.n);
   if(!q.length)throw new Error('exdepth '+p.nm+' release '+x.back+' days back: nothing is carrying');
   var cap=meterBudget(rec,at).cap;
   if(cap<1)throw new Error('exdepth '+p.nm+' release '+x.back+' days back: the allowance is spent');
   var keys=meterPlan(rec,q.map(function(n){return n.i;}),ONB_CHANS,cap);
   /* every address in the queue has a line in the plan, or the write below
      would release ground nobody said a line at */
   var reached={}; keys.forEach(function(k){reached[String(k).split(':')[0]]=1;});
   q.forEach(function(n){if(!reached[n.i])
    throw new Error('exdepth '+p.nm+' release '+x.back+' days back: '+n.k+' has no line in the plan');});
   /* relCoolDown reads every weight before the first write moves any */
   var w0=q.map(function(n){return n.sq*10;});
   q.forEach(function(n,j){relWrite(q,n,w0[j]);});
   var m=meterRun(rec,keys,at);
   /* the lifetime split, relCounts: a line down a release channel said `dose`
      times is that many patterns released, down a truth channel installed */
   var rel=0, put=0;
   keys.forEach(function(k){if(/truth$/.test(String(k).split(':')[1]||''))put+=x.dose; else rel+=x.dose;});
   rec.meter.relLines=(rec.meter.relLines||0)+rel;
   rec.meter.truthLines=(rec.meter.truthLines||0)+put;
   releaseWork(rec,m.fresh);
   q.forEach(function(n){meterFirst(rec,'addr:'+n.i,n.k+', '+n.b,at);});
   var seats={}; q.forEach(function(n){seats[n.b]=1;});
   Object.keys(seats).forEach(function(b){
    meterFirst(rec,'seat:'+b,'first release at the '+String(b).toLowerCase(),at);});
   out.runs++; out.lines+=keys.length; out.addrs+=q.length;});
  /* the law table is the latest measurement, so every law was answered after
     the last release: the intake's own writer clears the lift */
  SI.forEach(function(l){lawAnswered(rec,l.nm);});}
 finally{
  exdepthPut(S.charge,c0); exdepthPut(S.replace,r0);
  exdepthPut(VERPMIX,v0); exdepthPut(LEANMIX,l0);
  compute();}
 return out;}
