/* ============================================================
   SOURCE AI, THE LISTENING HALF. Ruled 27 September, round GO in TASKS.md.

   The owner, verbatim: "it doesn't use definitions, it's discerning the
   energy behind the story. It's able to probe questions from a scale of zero
   to 10 that are just seven, eight, nine, and 10. Looking for the root which
   is usually a 10." And: "it's their job to lead ... if they want to move on,
   source's job isn't to dig deeper, it's just to go cool."

   The whole specification is reviews/SPEC-source-ai.md. This file is the
   part that is arithmetic, and it is kept here, host free and pure, so the
   same reading can run in a browser, in node under tests/engine.js, and
   behind the sign in seam if a model is ever put there.

   WHAT THE ZERO TO TEN MEASURES, AND WHY IT IS NOT THE SNIFFER'S OWN.

   parseStory already puts a zero to ten on every seat an entry touches,
   min(10, sum/3). It is the obvious scale and it cannot carry this ruling.
   Measured on the shipped lexicon: the median single word reads 7.33 on its
   own, and 149 of 219 words clear seven alone, so "ask only at seven and
   over" on that number would ask about 68 percent of every story bank line
   the sniffer reads at all. That number measures how hot a word is. It does
   not measure a pattern, and the owner asked for pattern.

   So this scale is evidence of return. A pattern is something that comes
   back, and the rung counts how much of that the text actually shows:

     0      nothing read at that seat, or every mention of it negated
     1..6   heard once in this entry. The sniffer's own reading, capped at
            six, so one word is heard and never questioned however hot it is
     7      the entry comes back to the same seat a second time
     8      a third time or more
     9      an earlier committed entry touched this seat too
     10     it comes back across entries and again inside this one, or in two
            or more earlier entries. The root candidate.

   Every rung is a count a person could check by reading their own words,
   which is the explainability duty: Source AI can always say why it asked.

   WHAT IT READS, AND WHAT IT MAY NOT.

   The entry's text, and the seat keys earlier commits already stored on the
   person's own record (CURP.story.entries[].bands). Not the text of earlier
   entries and not the name. Nothing here leaves the device and nothing here
   can, because the engine has no host. Whether Source AI may read earlier
   entries at all is DESIGN-sniffer.md question 12 and is the owner's; with
   no prior passed in, rungs 9 and 10 cannot occur and the rest still work.

   WHAT IT NEVER DOES.

   It never names an address, a fetter or a saboteur to the person, because
   those are definitions and the ruling is that it does not use them. It
   never says why about the person. One because is allowed, ruled 27
   September in TASKS.md round JX, and it is about the body, never the
   person: `ui/storyui.js`'s `srcWhy` names the seat's nerve place and the
   mechanism the product already states as its own definition of Charge.
   Source AI still never answers the why it asks about the person; the
   person still finds that root themselves.
   ============================================================ */

/* the owner's own two numbers. asked at seven and over, the root at ten. */
var SRC_ASK=7, SRC_ROOT=10;
/* one mention is heard and never questioned, whatever the word weighs. */
var SRC_ONCE=6;

/* NEGATION, WHICH THE SNIFFER DOES NOT READ. "I was not angry" and "I was
   angry" parse to the same seat and the same amount, measured. A reading can
   live with that because the charge is small and the person can undo it. A
   question cannot: asking somebody why they are angry after they wrote that
   they are not is the false positive this seat was told costs more than a
   miss. So a mention counts toward a question only when neither of the two
   words before it is a negation.

   The window is two words and not the three the laws use, and "did" is not in
   the list. Measured on the owner's book: the three word window dropped
   "could not stop" because "not choose and" sat before it, across a
   conjunction, and "did" would mute "I did cry". Measured on the story bank:
   this drops nothing, because the lexicon's own negative phrases, "not told
   anyone", carry the negation inside the match. */
var SRC_NEG=['not','no','never','nobody','none','cannot','cant','didnt','dont',
 'doesnt','wont','wasnt','werent','isnt','arent','havent','hasnt','couldnt','wouldnt'];
var SRC_NEG_W=2;
/* THE SENTENCE BOUNDARY, round NQ, AUDIT-source-tdd-v3.md's own finding:
   "the core parse path itself reads no negation at all," and this is the
   one piece of it srcHear does read. Measured before this fix: "I am not
   afraid. Afraid now." read both mentions negated, the second sentence
   voided by the first one's own "not". floor is sniff.js's own
   clauseFloor, the normalised offset of the nearest sentence end before
   at, or -1 when there is none to find; srcHear passes it, and nothing
   else does, so every existing caller and the gate's own direct call,
   srcNegated(' i did cry ',6), is unaffected: floor undefined reads as no
   boundary, the exact width and word list this was measured against
   stand exactly as they were. */
function srcNegated(src,at,floor){
 var f=(typeof floor==='number'&&floor>=0)?floor+1:0;
 var before=String(src).slice(f,at).trim().split(' ');
 var run=before.slice(Math.max(0,before.length-SRC_NEG_W));
 return run.some(function(w){return SRC_NEG.indexOf(w)>=0;});}

/* how many earlier committed entries touched each seat. Reads only the seat
   keys a commit already stored, never the text. */
function srcPrior(entries){
 var out={};
 (entries||[]).forEach(function(e){
  Object.keys((e&&e.bands)||{}).forEach(function(k){
   if(K2BAND[k]&&(e.bands[k]||0)>0)out[k]=(out[k]||0)+1;});});
 return out;}

/* the rung for one seat, from the three counts. Kept apart so the ladder is
   one function a test can walk rung by rung. */
function srcRung(mentions,earlier,reading){
 if(!mentions)return 0;
 if(earlier>=2||(earlier>=1&&mentions>=2))return 10;
 if(earlier>=1)return 9;
 if(mentions>=3)return 8;
 if(mentions>=2)return 7;
 return Math.max(1,Math.min(SRC_ONCE,Math.round(reading||0)));}

/* HEAR AN ENTRY. text is what the person typed. prior is srcPrior of their
   own earlier entries, or nothing. Returns every seat heard, heaviest rung
   first, with the person's own words for each, which is what Source AI says
   back instead of a definition. */
function srcHear(text,prior){
 var t=String(text||'');
 var out={unread:true, seats:[], top:null, root:null, asks:false};
 if(!t.trim())return out;
 var p=parseStory(t), nm=normMap(t), src=nm.s, by={};
 p.path.steps.forEach(function(s){
  if(!s.seat||s.coherent)return;
  var o=by[s.seat]=by[s.seat]||{seat:s.seat, band:K2BAND[s.seat],
   reading:Math.min(10,(p.bands[s.seat]||0)/3), mentions:0, negated:0, words:[]};
  if(srcNegated(src,s.at,clauseFloor(t,nm,s.at))){o.negated++;return;}
  o.mentions++;
  /* the person's own letters, through the same map marksOf uses, so what is
     quoted back is what they typed and not the lowercased copy. */
  var a=s.at+1, b=s.at+String(s.word).length;
  var w=(a<nm.map.length&&b<nm.map.length)?t.slice(nm.map[a],nm.map[b]+1):s.word;
  if(o.words.indexOf(w)<0)o.words.push(w);});
 var P=prior||{};
 out.seats=Object.keys(by).map(function(k){var o=by[k];
  o.earlier=P[k]||0;
  o.rung=srcRung(o.mentions,o.earlier,o.reading);
  o.reading=Math.round(o.reading*10)/10;
  return o;})
  .filter(function(o){return o.rung>0;})
  /* heaviest rung first, then the sniffer's own reading, then the seat key so
     the order is a property of the text and never of object key order. */
  .sort(function(a,b){return b.rung-a.rung||b.reading-a.reading||(a.seat<b.seat?-1:1);});
 out.unread=!out.seats.length;
 out.top=out.seats[0]||null;
 out.asks=!!(out.top&&out.top.rung>=SRC_ASK);
 out.root=(out.top&&out.top.rung>=SRC_ROOT)?out.top:null;
 return out;}

/* WHAT SOURCE AI DOES NEXT. One of four moves, and the person's own choices
   decide it, never the depth of what was found.

     open    nothing written yet. The opening question.
     listen  something written, nothing read, or nothing at seven or over.
             It says back what it heard, and asks nothing.
     ask     a seat at seven or over that the person has not moved on from.
             One question. Never two at once.
     pass    the person pressed Move on. It says so and asks nothing more
             in this entry, however much more it hears.

   state.passed is set by the page when the person moves on. It is per entry:
   the page clears it on commit and on clear. There is no rule anywhere in
   here that asks again, raises the depth, or follows up, because the ruling
   is that the person leads. */
function srcTurn(heard,state){
 var st=state||{};
 if(!heard||(heard.unread&&!st.typed))return {move:'open'};
 if(st.passed)return {move:'pass'};
 if(!heard.asks)return {move:'listen'};
 var s=heard.top;
 return {move:'ask', seat:s.seat, band:s.band, rung:s.rung,
  why:s.rung>=SRC_ROOT?'root':(s.earlier?'earlier':'again'),
  mentions:s.mentions, earlier:s.earlier};}

/* ============================================================
   WHICH QUESTION, 20.H1. SOURCE-TDD-impression-excavation.md: "It selects
   the smallest useful question based on uncertainty reduction." The page's
   second button, "A question from what you wrote", walked four questions by
   how many times it had been pressed. It asked "What happened in the minute
   before?" of somebody who had just written what happened in the minute
   before. This reads which of the document's dimensions the entry already
   answers and asks about one it has not.

   WHAT DOES NOT CHANGE. When Source AI asks on its own (SRC_ASK, the rung
   at seven), the why it asks, Move on, and the person leading: all exactly
   as ruled at round GO. This chooses only which question the button asks.

   READ AS PRESENT OR ABSENT, NEVER NEGATED. "I did not say anything" answers
   what the person did as fully as "I said it", so nothing here reads "not",
   and PRIORITY.md's worry that these cues become a fourth negation handler
   does not arise. A cue matches whole words on normMap's own copy.

   THE PRECEDENCE, AND WHY IT IS AN ORDER AND NOT A SCORE. The document names
   eight scoring factors and gives no weight for any of them, and there is
   no labelled set to fit one against. A weighted sum here would be eight
   magic numbers. So the factors become a stated order, each step one a
   person could check:

     1  uncertainty      a dimension the entry already answers is not asked.
     2  the chain        among the rest, the document's own order. Its
                         excavation chain runs trigger, contact, feel,
                         locate, sense, behaviour, predict, believe,
                         meaning. Its failure test's "correct progression"
                         runs trigger, feel, expect, do, meaning, which puts
                         the prediction before the behaviour. The failure
                         test is the one place the document says what a
                         correct order is for a real sentence, so it wins
                         that one swap, and the gate holds it to it. Goal
                         is not on the chain and goes last.
     3  novelty          a dimension already asked in this entry waits
                         behind one that has not been.
     4  signal           the question is about a seat the entry was heard
                         at and quotes the person's own word for it, the way
                         the button always did.

   Not used, and named: contradiction (19.D5 is not built), verification
   (20.H4 is not built), and user effort and emotional load, which nothing
   measures; one question at a time is the only form of them here.
   ============================================================ */
var SRC_DIM_ORDER=['trigger','contact','feeling','body','prediction','behaviour',
 'belief','meaning','goal'];
/* the cues, by dimension. feeling and body are read off the sniffer as well,
   below, because the lexicon already knows more of those than a list can. */
var SRC_DIM_CUE={
 trigger:['when','after','because','as soon as','the moment','right before','just before'],
 contact:['he','she','they','him','her','them','his','their','someone','somebody',
  'everyone','everybody','nobody','people','boss','manager','colleague','partner',
  'husband','wife','boyfriend','girlfriend','mother','father','mum','mom','dad',
  'parents','son','daughter','brother','sister','friend','friends','family','kids',
  'child','children','teacher','client'],
 /* WRITTEN WITHOUT APOSTROPHES since round QZ, because normMap drops them
    and a cue with one could never be found. won't was already here as wont.
    i'll comes back as ill, which is also the word for sick, so it is read
    only before the verbs a prediction takes. */
 prediction:['will','wont','theyll','itll','ill be','ill never','ill end up','ill lose',
  'ill have to','ill always','going to','gonna',
  'expect','expected','expecting','what if','would happen','bound to'],
 belief:['i believe','i must','i have to','i should','if i','i always','i never',
  'people always','nobody ever'],
 meaning:['means','meant','mean that','says about me','proves','which means','what it means'],
 goal:['i want','i wanted','i wish','i need','i needed','i hope','i would like','id like',
  'trying to']};
/* WHAT A PERSON DID, ported rather than written. VERPCUE already carries the
   engine's approach, avoidance and attachment cues (engine/verp.js), and the
   idioms already label what is a behaviour. The one thing added is the
   plainest report of all, "I" and a doing verb, from a stated list, because
   "I froze" and "I left" are the document's own examples of an impression. */
var SRC_DO=['left','leave','walked','ran','hid','froze','freeze','stopped','stop',
 'avoided','avoid','said','told','asked','shouted','yelled','screamed','snapped',
 'slammed','cried','went','stayed','keep','kept','quit','called','texted','apologised',
 'apologized','agreed','nodded','smiled','drank','ate','scrolled','checked',
 'shut','pretended','ignored','did'];
var SRC_DO_IDIOM=['silenced','over-giving','avoidance','compulsion','concealment','rigidity'];
/* after a feel verb, these say the feeling has not been named yet: "I felt
   tight" is the body, "I felt like" is a thought on its way. Degree words
   are stepped over, so "I felt so tight" reads the same. */
var SRC_FEEL_V=['felt','feel','feeling','feels'];
var SRC_BODY_NOT=['back','hand','hands','face','head','arm','arms'];
var SRC_FEEL_NOT=['like','that','as','in','at','on','for','about','when','if','it',
 'my','a','an','the','this'];
function srcCue(src,c){return src.indexOf(' '+c+' ')>=0;}
/* WHICH DIMENSIONS AN ENTRY ANSWERS. Returns each answered dimension with
   the cue that answered it, which is the because, and the open ones in the
   order above. Pure, and reads nothing but the text. */
function srcDims(text){
 var t=String(text||''), nm=normMap(t), src=nm.s, p=parseStory(t);
 var by={}, place=SOMA_PLACE_WORDS, sense=SOMA_PLACE.sense;
 function say(k,why){var l=by[k]=by[k]||[]; if(l.indexOf(why)<0)l.push(why);}
 Object.keys(SRC_DIM_CUE).forEach(function(k){
  SRC_DIM_CUE[k].forEach(function(c){if(srcCue(src,c))say(k,c);});});
 /* the body. a sensation word or a place word, but not the place words
    ordinary sentences use for something else: "she came back", "on the
    other hand", "face it", "head home". Those still stop a sensation moving
    in scanStory, where a wrong move is the cost; here a wrong read would
    only skip a question, but it would skip it on every entry that uses one
    of these words in its ordinary sense. */
 sense.concat(place).forEach(function(w){
  if(SRC_BODY_NOT.indexOf(w)<0&&srcCue(src,w))say('body',w);});
 /* the feeling. Any hit the sniffer read that is not a sensation or a body
    phrase names a feeling, including a coherent one: "calm" answers how a
    person felt. Biased this way on purpose: counting a dimension as answered
    when it was not costs one question not asked, and counting it open when
    it was answered is the over-questioning the document's failure tests
    name. */
 p.hits.forEach(function(h){
  if(sense.indexOf(h.t)>=0)return;
  if(place.some(function(w){return (' '+h.t+' ').indexOf(' '+w+' ')>=0;}))return;
  say('feeling',h.t);});
 var ws=src.trim().split(' ');
 ws.forEach(function(w,i){
  if(SRC_FEEL_V.indexOf(w)<0)return;
  var j=i+1;
  while(j<ws.length&&LEXMOD[ws[j]]!==undefined)j++;
  var n=ws[j]; if(!n)return;
  if(SRC_FEEL_NOT.indexOf(n)>=0||sense.indexOf(n)>=0||place.indexOf(n)>=0)return;
  say('feeling',w+' '+n);});
 /* what the person did */
 ['intent','averse','attach'].forEach(function(g){
  (VERPCUE[g]||[]).forEach(function(c){if(srcCue(src,c))say('behaviour',c);});});
 p.hits.forEach(function(h){
  if(h.kind==='phrase'&&SRC_DO_IDIOM.indexOf(h.label)>=0)say('behaviour',h.t);});
 ws.forEach(function(w,i){
  if(w!=='i')return;
  var n=ws[i+1]==='just'||ws[i+1]==='then'?ws[i+2]:ws[i+1];
  if(SRC_DO.indexOf(n)>=0)say('behaviour','i '+n);});
 var open=SRC_DIM_ORDER.filter(function(k){return !by[k];});
 return {answered:by, open:open, words:ws.filter(Boolean).length};}

/* THE NEXT DIMENSION TO ASK, by the precedence above. dims is srcDims's
   result, asked the kinds already asked in this entry in the order they
   were asked, askable the dimensions the page has a question for. Returns a
   kind, or null when there is nothing it can ask. When every askable
   dimension is answered the person still pressed for a question, so it
   walks them all in the same order rather than saying nothing. */
function srcNext(dims,asked,askable){
 var can=SRC_DIM_ORDER.filter(function(k){return (askable||[]).indexOf(k)>=0;});
 if(!can.length)return null;
 var open=can.filter(function(k){return dims&&dims.open.indexOf(k)>=0;});
 var pool=open.length?open:can, a=asked||[];
 var fresh=pool.filter(function(k){return a.indexOf(k)<0;});
 if(fresh.length)return fresh[0];
 /* everything here has been asked once: the one asked longest ago */
 return pool.slice().sort(function(x,y){return a.lastIndexOf(x)-a.lastIndexOf(y);})[0];}

/* ============================================================
   WHAT SOURCE AI ASKED, KEPT WITH THE ENTRY, 20.H5. Every Source AI state
   was page memory and went at commit, so nothing could ever say what was
   asked about which entry, or whether the person moved on from it.

   PRIVACY, CHECKED FIRST. It stays on the device, on the entry it was asked
   about, and it stores a question KIND and a SEAT KEY. Never the words of
   the question and never anything the person wrote in answer: the entry's
   own text already holds what they wrote, and a second copy of a question
   with their words quoted in it would be a second copy of their words.
   This is inside the narrow version of DESIGN-sniffer.md question 12 that
   round GO built.

   THE KINDS. The document's dimensions the button can ask, the three whys
   the ask move asks (again, earlier, root, see srcTurn), and the two the
   button asks off earlier entries when this one has nothing heard.

   THE OUTCOMES, and only the three this page can actually observe:
     moved   the person pressed Move on while it was showing
     wrote   they wrote more after it was asked, and did not move on
     left    neither: committed with nothing added after it
   "Answered" would claim the instrument knows that what was written is an
   answer, and it does not, so it says wrote. "Refused" has no control on the
   page today; that is 20.H4 and S6, and a state nothing can produce is not
   offered. */
var SRC_KINDS=SRC_DIM_ORDER.concat(['again','earlier','root','since','back']);
var SRC_OUTCOMES=['moved','wrote','left'];
/* log is the page's own list, one row per question shown: {k, seat, at, moved},
   where at is the length of the text when it was first shown. Returns what
   the entry keeps. A kind or seat it does not know is dropped here rather
   than written, so the boundary never sees one. */
function srcAsked(log,len){
 var out=[], seen={};
 (log||[]).forEach(function(r){
  if(!r||SRC_KINDS.indexOf(r.k)<0)return;
  var seat=(r.seat&&K2BAND[r.seat])?r.seat:null, key=r.k+'|'+seat;
  if(seen[key])return; seen[key]=1;
  out.push({k:r.k, seat:seat,
   a:r.moved?'moved':((+len||0)>(+r.at||0)?'wrote':'left')});});
 return out;}
/* the most an entry can carry: every kind at every seat and at none. */
function srcAskedMax(){return SRC_KINDS.length*(Object.keys(K2BAND).length+1);}
