/* ============================================================
   THE EVIDENCE LEDGER, P0 of the Journal Mode blueprint. Round SK, 30
   October, TASKS.md. The document is atuned_source_ai_journal_mode_TDDB.md,
   his own Drive, 4 October, and its rule is "the system proposes, the person
   verifies". Its section 15 names eight states and this is them, as data.

   WHAT A CLAIM IS, AND WHAT EVIDENCE IS. They are two things and a mark used
   to be both. A mark from marksOf (engine/sniff.js) holds the person's own
   letters, s to e, and the seat the lexicon put them at. The letters are
   what was said. The seat is what the engine made of them. So here the
   letters are EVIDENCE, and the seat is a CLAIM that cites them. Source AI
   may only ever say a claim when the evidence under it is good enough, and
   the person is the only one who can say a claim is theirs.

   THE EIGHT STATES, AND WHO MAY SET EACH ONE.

     observed   evidence only. The words were written. Every evidence row
                is observed; a claim is never observed, because a claim is
                always the engine's reading of something observed.
     inferred   a claim with nothing said for it in this entry: an earlier
                entry's stored seat key, or the field's own driven pattern.
                Held, never asked about, never said.
     candidate  heard once in this entry and nothing else behind it.
     supported  more than one piece of evidence points the same way: heard
                twice or more in this entry, or once here and in an earlier
                entry, or once here at a seat a driven hyper complex sits on
                (his ruling of 27 October, srcRung in engine/sourceai.js:
                the field's pattern is built from his own committed charge,
                so it is his evidence, not the engine's guess).
     confirmed  the person said yes.
     rejected   the person said not me.
     corrected  the person said what it is instead, in their own words.
     unknown    the person said they are not sure. And the root, always,
                at this stage: see evRoot.

   THE ONE INVARIANT EVERYTHING ELSE SERVES. The engine moves a claim only
   between inferred, candidate and supported. confirmed, rejected, corrected
   and unknown are reachable ONLY through a verdict the person gave, evVerdict
   below, and a verdict outranks any amount of new evidence: a seat the person
   said not me to stays rejected however often the story comes back to it,
   until the person says otherwise. That is the document's "no silent
   promotion" and "correction dominance" (section 53, 2 and 5).

   ONE READER, NOT TWO. The counts a claim's state is read from are srcHear's
   own (mentions, earlier, structural), so the state and the rung can never
   disagree about how often a seat was heard. The spans come off marksOf, the
   same list the person's own bubble is drawn from. tests/evidence.js holds
   the two to the same count on every line of the story bank.

   HOW THIS MAPS ONTO THE TRACE GRAPH, SO IT IS NOT A SECOND MODEL. trace.js
   already carries five provenance words, TRACE_SRC, and its own warning is
   that a second model beside the real engine is how two truths appear. The
   eight states are finer than the five, and EV_TRACE says exactly where each
   one lands: every engine state is the graph's inferred, a yes and a
   correction are its user_confirmed, and a no and an unknown have no
   provenance there at all, which is trace.js's own standing gap (a refusal
   is F16, the owner's). Nothing here writes the graph yet.

   PRIVACY, CHECKED FIRST, and it decides the shape. The ledger is DERIVED,
   never stored. It reads the entry being written, and from earlier entries
   only the seat keys a commit already stored (srcPrior), never their text:
   that is the narrow reading of DESIGN-sniffer.md question 12, which is
   still the owner's. An evidence row holds offsets into the text the person
   is writing; the letters are sliced for a caller and never kept a second
   time. A verdict is page memory in P0, passed in by the caller, and nothing
   here reaches the record. Keeping a verdict on the entry is P2, an additive
   field beside ob.yes and ob.no, and it is not built.

   THE ENGINE MAY NOT TOUCH THE HOST, and this file does not.
   ============================================================ */
var EV_STATES=['observed','inferred','candidate','supported','confirmed','rejected','corrected','unknown'];
/* the states only a person can put a claim into */
var EV_PERSON=['confirmed','rejected','corrected','unknown'];
/* the states the engine itself may set, from counts */
var EV_ENGINE=['inferred','candidate','supported'];
/* a claim Source AI may name to the person: there is more than one piece of
   evidence under it, or the person already said it is theirs */
var EV_NAMEABLE=['supported','confirmed','corrected'];
/* the person's four answers, and the state each one sets */
var EV_VERDICT={yes:'confirmed', no:'rejected', fix:'corrected', unsure:'unknown'};
/* section 15's arrows. The engine's run is observed to inferred to candidate
   to supported. Section 15 draws the person's reject and correct off
   candidate and supported only, and this widens it on purpose: section 52's
   second test is that a person can reject an interpretation "without
   fighting the system", so a no is honoured from every state a claim can be
   in, a confirmed one included, because a person may change their mind. */
var EV_MOVES={
 observed:['inferred','unknown'],
 inferred:['candidate','supported','confirmed','rejected','corrected','unknown'],
 candidate:['supported','confirmed','rejected','corrected','unknown'],
 supported:['confirmed','rejected','corrected','unknown'],
 confirmed:['rejected','corrected','unknown'],
 rejected:['confirmed','corrected','unknown'],
 corrected:['confirmed','rejected','corrected','unknown'],
 unknown:['confirmed','rejected','corrected']};
/* where each state lands in trace.js's own vocabulary, TRACE_SRC */
var EV_TRACE={observed:null, inferred:'inferred', candidate:'inferred', supported:'inferred',
 confirmed:'user_confirmed', corrected:'user_confirmed', rejected:null, unknown:null};
function evTraceSrc(state){ return EV_TRACE.hasOwnProperty(state)?EV_TRACE[state]:null; }
function evCan(from,to){ return !!(EV_MOVES[from]&&EV_MOVES[from].indexOf(to)>=0); }

/* THE STATE THE ENGINE READS OFF THE COUNTS, before any verdict. c carries
   srcHear's own three numbers. Returns null when there is nothing at all. */
function evEngineState(c){
 var m=+c.mentions||0, e=+c.earlier||0, st=!!c.structural;
 if(!m)return (e>0||st)?'inferred':null;
 if(m>=2||e>=1||st)return 'supported';
 return 'candidate';}
/* the plain because for each engine state, which is the explainability duty:
   Source AI can always say why it holds what it holds. */
function evWhy(c,state){
 var m=+c.mentions||0, e=+c.earlier||0;
 if(state==='confirmed')return 'you said yes to this';
 if(state==='rejected')return 'you said this is not you';
 if(state==='corrected')return 'you said what it is instead';
 if(state==='unknown')return 'you said you are not sure';
 if(state==='inferred')return e?'an earlier entry landed here, and nothing in this one has':'the field holds a pattern here, and nothing in this entry has said it';
 if(state==='supported'){
  if(m>=2)return 'heard '+m+' times in this entry';
  if(e>=1)return 'heard in this entry and in an earlier one';
  return 'heard in this entry, at a seat the field already holds a pattern on';}
 return 'heard once in this entry';}

/* THE CUES srcDims ALREADY READS, AS EVIDENCE WITH AN ADDRESS. srcDims says
   which of the document's dimensions an entry answers and with which cue,
   and gives no place. A behaviour the person wrote, "I keep", is observed
   language exactly as much as a feeling word is, and the document's whole
   claim is that behaviour comes before labels, so it is kept as evidence
   too, with no seat: a cue is never a claim about where anything lands. */
function evCueRows(t,dims,nm){
 var out=[], seen={};
 Object.keys((dims&&dims.answered)||{}).forEach(function(k){
  dims.answered[k].forEach(function(c){
   var needle=' '+String(c)+' ', from=0, i;
   while((i=nm.s.indexOf(needle,from))>=0){from=i+1;
    var a=i+1, b=i+String(c).length;
    if(a>=nm.map.length||b>=nm.map.length)continue;
    var s=nm.map[a], e=nm.map[b]+1, key=k+'|'+s+'|'+e;
    if(seen[key])continue; seen[key]=1;
    out.push({kind:k, s:s, e:e, cue:String(c)});}});});
 return out;}

/* BUILD THE LEDGER. text is the entry being written. entries is the person's
   committed entries, of which only the stored seat keys are read. o is
   {active, verdicts, asked}: active is srcHyperSeats of a real reading,
   verdicts the person's answers this session, [{seat, v, fix}], in the order
   given, and asked the seat keys Source AI has asked about in this entry.
   Pure: reads nothing else and writes nothing, the field included. */
function evLedger(text,entries,o){
 o=o||{};
 var t=String(text||''), out={ev:[], claims:{}, order:[], thread:null, root:null, verdicts:[]};
 var prior=srcPrior(entries||[]);
 var heard=srcHear(t,prior,o.active||null);
 var p=t.trim()?parseStory(t):null, nm=normMap(t);
 /* EVIDENCE, the marks. Every one, said or not: a word said with a no is
    evidence the person said no, and a word about someone else is evidence
    about someone else. Neither is ever counted for a claim. */
 var marks=p?marksOf(t,p):[];
 marks.forEach(function(m,i){
  out.ev.push({id:'w'+i, src:'mark', s:m.s, e:m.e, text:t.slice(m.s,m.e),
   seat:m.seat||null, kind:m.seat?'seat':(m.coh?'coherent':'word'),
   said:m.neg?'denied':(m.other?'other':'said'), state:'observed'});});
 /* EVIDENCE, the cues */
 var dims=t.trim()?srcDims(t):null;
 evCueRows(t,dims,nm).forEach(function(r,i){
  out.ev.push({id:'c'+i, src:'cue', s:r.s, e:r.e, text:t.slice(r.s,r.e), seat:null,
   kind:r.kind, cue:r.cue, said:'said', state:'observed'});});
 /* EVIDENCE, earlier entries, as the seat keys their commits stored and
    nothing more. No span and no text, by the privacy rule above. */
 Object.keys(prior).forEach(function(k){
  out.ev.push({id:'e:'+k, src:'earlier', s:null, e:null, text:null, seat:k,
   kind:'seat', said:'said', count:prior[k], state:'observed'});});
 /* WHICH SPANS A SEAT'S CLAIM CITES, walked the way srcHear walks them,
    pathOf's own steps, and joined to the marks by where they start. Not by
    the mark's own seat: the two readers can disagree. Measured round SK on
    the story bank, "I sat in the car outside work": the hit for "outside"
    carries no band, so marksOf leaves it uncoloured in the person's bubble,
    while pathOf resolves it to the crown and srcHear counts it there. A
    claim that cited by the mark's seat would cite nothing for a mention it
    counts, which is the traceability the document's section 53 rules out.
    So it cites the span srcHear counted, and the row says the mark read it
    elsewhere (seatSaid), which is the disagreement kept as data rather than
    hidden. Which reader is right is the sniffer's to settle, not this file's. */
 var cite={}, den={}, oth={};
 if(p){
  (p.denied||[]).forEach(function(h){den[h.at]=1;});
  (p.others||[]).forEach(function(h){oth[h.at]=1;});
  pathOf(storyHits(p)).steps.forEach(function(st){
   if(!st.seat||st.coherent||oth[st.at]||den[st.at])return;
   var a=nm.map[st.at+1]; if(a==null)return;
   var x=null; out.ev.forEach(function(r){if(r.src==='mark'&&r.s===a&&!x)x=r;});
   if(!x)return;
   if(x.seat!==st.seat)x.seatSaid=st.seat;
   var l=cite[st.seat]=cite[st.seat]||[]; if(l.indexOf(x.id)<0)l.push(x.id);});}
 /* CLAIMS, one a seat, off srcHear's own counts */
 var mk=function(k,h){
  var c={key:'seat:'+k, seat:k, band:K2BAND[k], mentions:h?h.mentions:0,
   earlier:prior[k]||0, structural:!!(h?h.structural:(o.active&&o.active[k])),
   rung:h?h.rung:0, words:h?h.words.slice():[], ev:[], last:-1, verdict:null,
   asked:(o.asked||[]).indexOf(k)>=0};
  (cite[k]||[]).forEach(function(id){var x=null; out.ev.forEach(function(r){if(r.id===id)x=r;});
   c.ev.push(id); if(x&&x.s>c.last)c.last=x.s;});
  if(prior[k])c.ev.push('e:'+k);
  c.state=evEngineState(c); return c;};
 (heard.seats||[]).forEach(function(h){out.claims[h.seat]=mk(h.seat,h);});
 Object.keys(prior).forEach(function(k){if(!out.claims[k]&&K2BAND[k])out.claims[k]=mk(k,null);});
 Object.keys(o.active||{}).forEach(function(k){if(!out.claims[k]&&K2BAND[k])out.claims[k]=mk(k,null);});
 Object.keys(out.claims).forEach(function(k){if(!out.claims[k].state)delete out.claims[k];});
 /* VERDICTS, the person's, last one wins. A verdict about a seat nothing was
    heard at is still the person's word and is held: it is not the engine's
    to drop. A verdict that is not one of the four answers is refused here by
    name and never applied. */
 (o.verdicts||[]).forEach(function(v){
  var r=evVerdictOk(v);
  if(!r.ok){out.verdicts.push({seat:v&&v.seat, refused:r.why}); return;}
  var c=out.claims[v.seat]||(out.claims[v.seat]=mk(v.seat,null));
  var to=EV_VERDICT[v.v], from=c.state||'unknown';
  /* the same answer twice is the same state, and anything else must be an
     arrow EV_MOVES draws, so the table is the rule and not a comment */
  if(from!==to&&!evCan(from,to)){out.verdicts.push({seat:v.seat, v:v.v, refused:'no move from '+from+' to '+to}); return;}
  c.verdict={v:v.v, fix:v.v==='fix'?String(v.fix).trim():null};
  c.state=to;
  out.verdicts.push({seat:v.seat, v:v.v});});
 Object.keys(out.claims).forEach(function(k){var c=out.claims[k];
  c.why=evWhy(c,c.state); c.trace=evTraceSrc(c.state); c.seam=evSeamState(c);});
 out.order=evOrder(out.claims);
 out.thread=evThread(out.claims,heard.seats);
 out.root=evRoot(out.claims);
 out.dims=dims;
 return out;}
/* a verdict the ledger will take, or the reason it will not */
function evVerdictOk(v){
 if(!v||typeof v!=='object')return {ok:false, why:'a verdict is an object'};
 if(!K2BAND[v.seat])return {ok:false, why:'no seat called '+JSON.stringify(v.seat)};
 if(!EV_VERDICT.hasOwnProperty(v.v))return {ok:false, why:'the answers are yes, no, fix and unsure, not '+JSON.stringify(v.v)};
 if(v.v==='fix'&&!String(v.fix||'').trim())return {ok:false, why:'a correction needs the person\'s own words'};
 return {ok:true};}
/* ADD A VERDICT, returning the new list and never touching the one given.
   The one door into a person state. */
function evVerdict(verdicts,seat,v,fix){
 var x={seat:seat, v:v}; if(v==='fix')x.fix=fix;
 var r=evVerdictOk(x);
 if(!r.ok)return {ok:false, why:r.why, verdicts:(verdicts||[]).slice()};
 return {ok:true, verdicts:(verdicts||[]).concat([x])};}

/* THE ORDER, strongest state first, then the most recent evidence in this
   entry, then the seat key, so it is a property of the text and never of
   object key order. */
var EV_RANK={confirmed:6, corrected:5, supported:4, candidate:3, unknown:2, inferred:1, rejected:0};
function evOrder(claims){
 return Object.keys(claims).sort(function(a,b){var x=claims[a], y=claims[b];
  return (EV_RANK[y.state]-EV_RANK[x.state])||(y.last-x.last)||(a<b?-1:1);});}
/* THE ACTIVE THREAD, the document's "select active thread". The claim the
   person is talking about now: one with words in this entry, never one they
   said not me to or corrected.

   WHEN SOURCE AI MAY NAME ONE, it is the one srcHear ranks first among the
   nameable, so the thread and the ask (srcTurn, rung first, his ruling at
   round GO) are read by one reader and can never point at two seats.

   WHEN IT MAY NAME NONE, it is the one with the newest evidence. Measured on
   the document's own section 40 session: srcHear's order, rung then reading
   then seat key, held "want to disappear" at the heart three turns running
   after "guilty" had arrived at the solar plexus, because both read rung six
   and heart sorts before solar, so the chat said the same line back three
   times. The thread is what the person is writing about now.

   heard is srcHear's own seat list, in its order. Null when no claim has
   words here. */
function evThread(claims,heard){
 var live=Object.keys(claims).filter(function(k){var c=claims[k];
  return c.mentions>0&&c.state!=='rejected'&&c.state!=='corrected';});
 if(!live.length)return null;
 var nm=(heard||[]).map(function(h){return h.seat;}).filter(function(k){
  return live.indexOf(k)>=0&&EV_NAMEABLE.indexOf(claims[k].state)>=0;});
 if(nm.length)return nm[0];
 return live.sort(function(a,b){return (claims[b].last-claims[a].last)||(a<b?-1:1);})[0];}
/* THE ROOT IS UNKNOWN, and at P0 it always is. The document, section 18 and
   51.10: a root is the earliest supported origin the person's own evidence
   reaches, through history, an event, an impression and a rule, and "if it
   cannot be established, UNKNOWN is the correct result". Nothing in this
   engine traces history yet, so no chain can close. What a seat coming back
   across entries does earn is permission to ask about history, which is
   the document's own precondition (section 18, "begins only with enough
   evidence of repetition"), and that is what history names. srcHear's
   rung ten is still called the root candidate in sourceai.js; under the
   document it is this, the door to history, and not a root. */
function evRoot(claims){
 var h=Object.keys(claims).filter(function(k){var c=claims[k];
  return c.mentions>0&&c.earlier>0&&EV_NAMEABLE.indexOf(c.state)>=0;});
 return {state:'unknown', why:'no history has been traced, so no origin is supported', history:h.sort()};}

/* ============================================================
   THE SEAM PACKAGE'S LIFECYCLE, AND WHERE THESE STATES LAND IN IT. Round SK,
   30 October. His later document, ATUNED_SOURCE_AI_SEAM_READY_HANDOFF,
   02_SOURCE_AI_ENGINEERING_TDD.md section 4, the same day as this file, is
   narrower than the 4 October one and wins where the two disagree:

     CANDIDATE -> ASKED -> CONFIRMED | REFINED | REJECTED | UNRESOLVED, and
     with further evidence REPEATED, WEAKENED, DISPUTED, INTEGRATED.

   Its rule that changes the reading: "Repeated expressions in one event do
   not count as independent episodes." So a seat heard twice inside one
   entry is still one episode, and stays CANDIDATE, however supported this
   file calls it; only a seat heard here AND in an earlier entry is
   REPEATED. The eight states are kept, because the 4 October document's
   questions still read them, and each is mapped, not swapped:

     observed   evidence only, no candidate state
     inferred   nothing said in this event, so no candidate in it
     candidate  CANDIDATE, or ASKED once Source AI asked about it
     supported  REPEATED when an earlier entry is behind it, otherwise
                CANDIDATE (or ASKED), by the one-event rule above
     confirmed  CONFIRMED      corrected  REFINED
     rejected   REJECTED       unknown    UNRESOLVED

   WEAKENED, DISPUTED and INTEGRATED are never produced, and that is said
   rather than faked: weakened needs evidence that moves against a claim
   over time, disputed needs the person's answer and new evidence to
   conflict, and integrated needs "explicit comparable behavioral evidence"
   after a release. Nothing in this engine measures any of the three.

   Its rejection rule is kept, more strictly: "Rejection must not be
   silently resurrected from a synonym hit; new separate evidence is needed
   to reopen." Here only the person reopens a claim they turned down.
   ============================================================ */
var EV_SEAM_STATES=['CANDIDATE','ASKED','CONFIRMED','REFINED','REJECTED','UNRESOLVED',
 'REPEATED','WEAKENED','DISPUTED','INTEGRATED'];
var EV_SEAM_NEVER=['WEAKENED','DISPUTED','INTEGRATED'];
var EV_SEAM_PERSON={confirmed:'CONFIRMED', corrected:'REFINED', rejected:'REJECTED', unknown:'UNRESOLVED'};
function evSeamState(c){
 if(!c||!c.state)return null;
 if(EV_SEAM_PERSON[c.state])return EV_SEAM_PERSON[c.state];
 if(c.state==='observed'||c.state==='inferred'||!c.mentions)return null;
 if(c.asked)return 'ASKED';
 if(c.earlier>0)return 'REPEATED';
 return 'CANDIDATE';}
/* A PLACE IS SAID ONLY ONCE THE PERSON HAS SAID THE CLAIM IS THEIRS. The
   package, 06_DIALOGUE_TDD.md: "Do not map to a chakra as fact without
   user evidence", and "the spoken language should not reveal an
   unconfirmed ontology label"; 02 section 3: "No reported somatic location
   -> null, never invented anatomy." Where a story lands is this product's
   own mapping, a hypothesis in its words, so naming it needs the person's
   yes or their correction, not only more evidence. A place word the person
   wrote themselves is their language and is always theirs to hear back. */
var EV_PLACEABLE=['confirmed','corrected'];

/* ============================================================
   WHAT THE PERSON SAYS ABOUT THE CONVERSATION ITSELF. Round SK. The package's
   dialogue states VENT, MOVE_ON and the CORRECT branch, 02 section 5:
   "If caller says 'just vent,' stay in LISTEN", "MOVE_ON ends excavation for
   this episode", and 06: "User rejecting a candidate -> mark rejected and
   stop pressing it." Its own vectors are "I just want to vent", "I don't
   want to talk about it anymore" and "No, that interpretation doesn't fit
   me". Measured before this, on all three: nothing read them, so a person
   who said any of them straight after a question was asked the next one.

   READ OFF A SHORT LIST ON PURPOSE. A phrase list is inspectable and a
   person can see why it fired. Each phrase is about the conversation and not
   about life: "move on" alone is left out because "I can't move on from
   him" is grief, not a request, and asking nothing after it would be the
   miss. A phrase said with a no before it ("I don't want to vent") does not
   count, by srcNegated, the same two word window the sniffer uses. A reject
   phrase counts only in a short turn, because "that's not me" inside a long
   story is far more often about something in the story.

   Returns {intent, cue} or null. move_on outranks reject outranks vent: a
   turn that both turns down a reading and asks to stop is a request to
   stop. Pure, reads only the turn.

   A CHANGE OF SUBJECT IS NOT A STOP, 31 October. "change the subject" and
   "talk about something else" sat in the move_on list, so a person who
   asked to talk about something else was told "Cool." and then met with
   silence for the rest of the entry, about the new subject too: reproduced
   in reviews/source-ai-conversation-diagnosis-2026-10-31.md, transcript 3.
   They are shift now, which sets the old subject down and keeps asking
   about the new one (the page's SRC_FROM, ui/storyui.js). shift outranks
   move_on, because "I don't want to talk about this, can we talk about
   something else" asks to go on, about something else. And the shape he
   actually used, "I want to talk about my brother instead", names the new
   subject inside the request, so a turn holding both "talk about" and
   "instead" is a shift too: SRC_SHIFT_PAIR, each pair a phrase and the word
   that has to follow it. */
var SRC_INTENT={
 shift:['change the subject','change of subject','talk about something else','talk about something different',
  'something else to talk about','different subject','different topic','new subject','new topic',
  'rather talk about'],
 move_on:['dont want to talk about it','do not want to talk about it','dont want to talk about this',
  'dont want to talk anymore','dont want to talk any more','stop asking','no more questions',
  'enough questions','stop talking','can we stop','lets stop'],
 reject:['doesnt fit me','that doesnt fit','does not fit me','thats not me','that is not me',
  'thats not it','that is not it','thats not right','thats wrong','not what i meant','youre wrong',
  'you are wrong'],
 vent:['just want to vent','want to vent','need to vent','just venting','let me vent',
  'just want to get it out','just need to get it out','just want to talk','just listen']};
var SRC_INTENT_ORDER=['shift','move_on','reject','vent'];
var SRC_INTENT_SHORT=12;
var SRC_SHIFT_PAIR=[['talk about','instead']];
function srcIntent(turn){
 var nm=normMap(String(turn||'')), s=nm.s, words=s.trim()?s.trim().split(' ').length:0;
 if(!words)return null;
 for(var i=0;i<SRC_INTENT_ORDER.length;i++){var k=SRC_INTENT_ORDER[i], list=SRC_INTENT[k];
  if(k==='reject'&&words>SRC_INTENT_SHORT)continue;
  for(var j=0;j<list.length;j++){var c=' '+list[j]+' ', at=s.indexOf(c);
   if(at<0)continue;
   /* the phrases that carry their own no are read as said; the others are
      set aside when a no stands before them */
   if(!/^(dont|do not)/.test(list[j])&&srcNegated(s,at+1))continue;
   return {intent:k, cue:list[j]};}
  if(k==='shift')for(var q=0;q<SRC_SHIFT_PAIR.length;q++){var a=s.indexOf(' '+SRC_SHIFT_PAIR[q][0]+' ');
   if(a>=0&&!srcNegated(s,a+1)&&s.indexOf(' '+SRC_SHIFT_PAIR[q][1]+' ',a)>a)
    return {intent:'shift', cue:SRC_SHIFT_PAIR[q].join(' ')};}}
 return null;}

/* ============================================================
   A TURN THAT IS ONLY TALK, 31 October. His session opened on "can you hear
   me", twice, and Source AI's only reply to a turn with no feeling word in
   it was the panel's own status line, "Nothing placed yet, so nothing is
   asked", which reads as an instrument talking about itself, and then, by
   the bug in srcChatNote, nothing at all. Measured in the diagnosis
   (reviews/source-ai-conversation-diagnosis-2026-10-31.md): a greeting, a
   check that it can hear, a question to Source AI and a bare "yeah" all
   fell through to the same line or to silence.

   Four acts, read the way srcIntent reads vent: a short stated list a
   person can read and see why it fired, never a guess.

     check  can you hear me, are you there, is this working
     ask    a question about Source AI itself: what is this, who are you
     greet  a turn that opens on hello, hi or hey, or asks how it is
     brief  a turn made only of yes, yeah, okay, no and their kind

   Each is read only in a short turn, and the page answers it only when the
   turn carries no seat of its own (srcActNow, ui/storyui.js): "hello, I am
   so anxious" is about being anxious, and the feeling is answered. A brief
   turn has to be brief all the way through, every word on the list, so
   "okay so then she left" is a story and not an okay. Pure, reads only the
   turn, and nothing it returns reaches the record.

   Returns {act, cue} or null, in SRC_ACT_ORDER: a check outranks a
   question outranks a greeting outranks a yes, so "hello, can you hear me"
   is answered as a check. */
var SRC_ACT={
 check:['can you hear me','do you hear me','can you hear','are you there','are you listening',
  'is this working','is it working','is this on','is this thing on','anyone there','anybody there',
  'can you understand me','hello hello','testing'],
 ask:['what is this','whats this','what is source','who are you','what are you','how does this work',
  'how does it work','how do i use this','how do i do this','what do you do','what can you do',
  'what do i do','what should i say','what do i say','what should i talk about','what do i talk about',
  'are you real','are you a person','are you human','are you a robot','are you a bot','are you ai',
  'are you an ai','is this ai','is this a person','what am i supposed to do'],
 greet:['hi','hello','hey','hiya','good morning','good afternoon','good evening','how are you'],
 brief:['yeah','yes','yep','yup','yea','ya','ok','okay','sure','mm','mhm','hmm','uh','huh','um',
  'right','true','maybe','no','nope','nah','not','really','i','guess','suppose','think','so',
  'kind','sort','of','dont','know','dunno','fine','alright','cool']};
var SRC_ACT_ORDER=['check','ask','greet','brief'];
var SRC_ACT_SHORT={check:8, ask:SRC_INTENT_SHORT, greet:6, brief:5};
function srcAct(turn){
 var s=normMap(String(turn||'')).s, ws=s.trim()?s.trim().split(' '):[];
 if(!ws.length)return null;
 for(var i=0;i<SRC_ACT_ORDER.length;i++){var k=SRC_ACT_ORDER[i], list=SRC_ACT[k];
  if(ws.length>SRC_ACT_SHORT[k])continue;
  if(k==='brief'){
   if(ws.every(function(w){return list.indexOf(w)>=0;}))return {act:k, cue:ws.join(' ')};
   continue;}
  for(var j=0;j<list.length;j++){var at=s.indexOf(' '+list[j]+' ');
   if(at<0)continue;
   /* a greeting opens the turn, "hi" anywhere else is a word in a story;
      "how are you" is the one asked anywhere in it. NO NEGATION GUARD,
      unlike srcIntent: every act but brief is a question to Source AI, and
      a no before one, "No, can you hear me?", answers something else and
      leaves the question standing. Found by coverage, 31 October, where
      the guard never ran and would have filed that turn as nothing. */
   if(k==='greet'&&at!==0&&list[j]!=='how are you')continue;
   return {act:k, cue:list[j]};}}
 return null;}
