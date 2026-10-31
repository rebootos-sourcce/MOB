/* ============================================================
   THE QUESTION CHECK, section 35 of the Journal Mode blueprint, ten points,
   as code every question Source AI builds passes through before it is shown.
   Round SK, 30 October, TASKS.md.

   The document's words: "Every generated question should pass: Is it one
   question? Is it clear? Does it use the user's language? Does it ask about
   observable experience? Does it preserve agency? Does it avoid inserting a
   diagnosis? Does it avoid naming an unsupported pattern? Does it reduce
   uncertainty? Does it advance the active thread? Is it necessary now? If
   not, regenerate."

   EACH POINT IS A RULE A PERSON COULD CHECK BY READING THE LINE. None is a
   score and none has a weight, because there is no labelled set of good and
   bad questions to fit a weight against, and a weight nobody can explain is
   a magic number. A question passes all ten or it is refused, and the refusal
   names the point and the words that failed it.

   WHAT A QUESTION IS CHECKED AGAINST. A candidate is {q, dim, family,
   target}: the line, the dimension of srcDims it asks about if any, the
   question family it was drawn from, and the seat key it is about. The
   context is {text, ledger, asked, passed}: the person's own words, the
   evidence ledger (engine/evidence.js), the lines already shown in this
   entry, and whether they moved on.

   QUOTES ARE THE PERSON'S, AND ARE READ APART. Anything inside quote marks
   must be the person's own letters (point 3), and is then left out of every
   other point: "You wrote “I have to”" quotes a person, and is not Source AI
   telling them they have to.

   WHAT THIS DOES NOT DO, said so nobody reads more into it. It does not judge
   whether a question is a good one. It refuses the kinds of bad the document
   names, and it is only as wide as its lists: a leading question built from
   words none of them hold would pass. The lists are written out below so
   that gap is visible rather than assumed away.
   ============================================================ */

/* THE QUESTION FAMILIES, the document's own wording, section 7 and section
   24, and nothing written here. Each carries the dimension of srcDims it
   asks about, where one fits, and what evidence it needs before it may be
   asked: repetition needs a claim with more than one piece of evidence
   under it, and history and origin need that claim heard across entries too,
   section 18: root tracing "begins only with enough evidence of repetition
   or persistence".

   THE ORDER IS SECTION 6's PRIORITY ORDER, clarification, behaviour,
   intention, immediate consequence, body, repetition, function, history,
   origin. Section 7 files "What happens next?" under behaviour; section 6
   names immediate consequence as its own step, and that is where it sits,
   with no dimension, because srcDims has none for what happened next.
   Agency waits for a behaviour: section 2.3 asks "What would you rather be
   doing?" of somebody who said what they do, to find the competing choice,
   and asked of "I am terrified" it contrasts nothing. Measured on the story
   bank before this gate, it was the line chosen after a bare feeling word.
   "What gets in the way of doing it?" is left out: it assumes a blocked
   intention the person may never have stated, which is section 2.3's
   warning about agency.
   Clarification is held back (need 'unclear'): the document gives the
   reading of what is unclear to a language model, section 38, and this
   product has none, so nothing can set it yet and it is never chosen. Two of
   the document's own lines fail its own section 8 unless the person used
   the word first, and are kept so the check is seen to catch them: "What
   part feels uncertain?" plants uncertain, and "What does that let you
   avoid?" plants avoidance. */
var SRC_FAMILY=[
 {family:'clarification', need:'unclear', dim:null, q:'What do you mean by that?'},
 {family:'clarification', need:'unclear', dim:null, q:'What part feels uncertain?'},
 {family:'behaviour', dim:'behaviour', q:'What did you do?'},
 {family:'agency', need:'behaviour', dim:'goal', q:'What would you rather be doing?'},
 {family:'agency', need:'behaviour', dim:'goal', q:'What did you want to do?'},
 {family:'consequence', dim:null, q:'What happens next?'},
 {family:'body', dim:'body', q:'Where do you feel it?'},
 {family:'body', dim:'body', q:'What do you notice first?'},
 {family:'repetition', need:'supported', dim:null, q:'When else does this happen?'},
 {family:'repetition', need:'supported', dim:null, q:'Where else does this happen?'},
 {family:'function', dim:'behaviour', q:'What changes after you do it?'},
 {family:'function', dim:'behaviour', q:'What does that let you avoid?'},
 {family:'history', need:'history', dim:null, q:'How long has this been happening?'},
 {family:'history', need:'history', dim:null, q:'What was happening then?'},
 {family:'origin', need:'history', dim:null, q:'What happened the first time you remember this?'}];

/* POINT 2, CLEAR. The document: "approximately a 10th-grade comprehension
   level", short sentences, concrete words, no academic terms. Read on the
   question sentence, quotes left out, as a Flesch Kincaid grade, with
   syllables counted by vowel groups. That count is rough and is the only one
   the engine can make with no dictionary; its own bad example, "What is the
   primary unresolved component of the recollection?", grades past twelve on
   it and its good one, "What part feels uncertain?", under four. */
var QC_GRADE=10, QC_QWORDS=14, QC_WORDS=32;
/* the document's own academic examples, and the therapeutic cliches section
   24 says to avoid. Pop words a person might well use themselves, trigger
   and process among them, are left off rather than guessed at. */
var QC_JARGON=['somatic','manifestation','localized','localised','component','unresolved',
 'recollection','dysregulation','dysregulated','trauma','traumatic','nervous system',
 'attachment','projection','inner child','shadow work','boundaries','cognitive','emotional state'];
function qcSyl(w){
 w=String(w).toLowerCase().replace(/[^a-z]/g,''); if(!w)return 0;
 if(w.length<=3)return 1;
 w=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,'');
 var g=w.match(/[aeiouy]{1,2}/g); return g?g.length:1;}
function qcGrade(s){
 var ws=String(s).split(/\s+/).filter(function(w){return /[a-z]/i.test(w);});
 if(!ws.length)return 0;
 var sy=ws.reduce(function(a,w){return a+qcSyl(w);},0);
 return Math.round((0.39*ws.length+11.8*(sy/ws.length)-15.59)*10)/10;}

/* POINT 4, OBSERVABLE. A question about what happened, what was done, felt
   or noticed, where and when. Asking why asks for an explanation, and an
   explanation is not experience: the document's preferred questions, section
   24, have no why among them, and its root tracing walks what happened, what
   was decided, what was learned. */
var QC_CAUSE=['why','what causes','what caused','the reason','do you think','bottom of it',
 'deep down','really about'];
/* POINT 5, AGENCY. Nothing that casts the person as pushed by a force, and
   nothing that tells them what they must do. Section 2.3: behaviour is not
   treated as involuntary. */
var QC_FORCE=['made you','make you','makes you','forced you','takes you','drives you',
 'pulls you','cant help','couldnt help','you always','you never','you should','you need to',
 'you have to','you must'];
/* POINT 6, NO DIAGNOSIS. Every canon name (the addresses, the saboteurs, the
   charges) and these labels, unless the person wrote the word first. And
   every word the sniffer itself reads as charge in the question: the same
   reader that reads the person reads Source AI, so "Are you feeling shame?"
   is caught by the lexicon that knows shame, not by a second list of
   feelings that would drift from it. */
var QC_LABELS=['pattern','saboteur','fetter','complex','diagnosis','disorder','chakra','blockage',
 'wound','abandonment','avoidance','avoid','avoiding','withdrawal','withdraw','control',
 'controlling','codependent','codependency','narcissist','narcissistic','people pleaser',
 'perfectionist','perfectionism','parents','mother','father','mom','mum','dad','childhood',
 'child','family','ancestors','lazy','root'];
/* POINT 7, NO UNSUPPORTED PATTERN. A line that says a word came back says a
   claim, and may only say one the ledger holds as nameable (EV_NAMEABLE). A
   line that says where something lands needs more, the person's own yes or
   correction (EV_PLACEABLE), since round SK; see QC_LANDS. The places are the seat names and the body's
   own place words, SOMA_PLACE_WORDS, as srcAsk and srcWhy say them. */
var QC_AGAIN=['again','twice','three times','each time','every time','keep coming','comes back',
 'come back','earlier entry','wrote before','last time'];
/* SINCE ROUND SK a place is its own rule, stricter than a return: where a
   story lands is said only about a claim the person confirmed or corrected
   (EV_PLACEABLE, engine/evidence.js, and the package's reasons beside it),
   while saying a word came back needs only that it did. "lands" moved here
   from the list above, because "it lands" is a place said. */
var QC_LANDS=['lands','land'];
/* place words that name no seat: "what happens in your body" asks about the
   body and says nothing about where a story lands. And srcDims's own
   SRC_BODY_NOT, the place words ordinary sentences use for something else,
   "takes you back", "on the other hand". */
var QC_NOTPLACE=['body','skin','muscles'];
var QC_PLACE=null;
function qcPlaces(){
 if(QC_PLACE)return QC_PLACE;
 QC_PLACE=['base of your spine','low in your belly','behind your stomach','around your heart',
  'in your throat','behind your eyes','top of your head','solar plexus','third eye']
  .concat(SOMA_PLACE_WORDS.filter(function(w){
   return QC_NOTPLACE.indexOf(w)<0&&SRC_BODY_NOT.indexOf(w)<0;}));
 return QC_PLACE;}
var QC_CANON=null;
function qcCanon(){
 if(QC_CANON)return QC_CANON;
 var s={};
 NODES.forEach(function(n){if(n&&n.n)s[String(n.n).toLowerCase()]=1;});
 SAB33.forEach(function(x){s[String(x[0]).toLowerCase().replace(/-/g,' ')]=1;});
 CHARGES.forEach(function(c){s[String(c).toLowerCase()]=1;});
 QC_LABELS.forEach(function(w){s[w]=1;});
 QC_CANON=Object.keys(s).sort();
 return QC_CANON;}

/* the line apart from its quotes, and the quotes */
var QC_QUOTE=/[“"]([^”"]+)[”"]/g;
function qcSplit(q){
 var quotes=[], m; QC_QUOTE.lastIndex=0;
 while((m=QC_QUOTE.exec(q)))quotes.push(m[1]);
 return {quotes:quotes, bare:String(q).replace(QC_QUOTE,' ')};}
/* the question sentence: the last one, the one that ends on the mark. No
   lookbehind in the pattern: an engine regex an older Safari cannot parse is
   a parse error, and a parse error here stops every file after it. */
function qcAsked(bare){
 var s=String(bare).trim(), m=s.match(/[^.!?]*\?\s*$/);
 if(m)return m[0].trim();
 var parts=s.split(/[.!?]\s+/).filter(function(x){return x.trim();});
 return parts.length?parts[parts.length-1]:'';}
function qcHas(norm,w){ return norm.indexOf(' '+w+' ')>=0; }
/* every phrase on the list the line holds, read on normMap's own copy.
   EACH LIST IS NORMALISED ONCE, round SK. Measured: one ask ran sixteen
   candidates through ten checks and normalised every word of every list each
   time, the canon list alone 179 names, about 25 ms an ask in node, paid on
   every repaint of the page. That was enough to swallow an animation frame:
   tests/functional.js caught the vitality bar arriving at its end two frames
   after a render, on this build and not on the one before it. The lists are
   fixed at load, so their normal form is kept beside them. */
function qcNorm(list){
 if(!list.__qn)Object.defineProperty(list,'__qn',{value:list.map(function(w){return normMap(w).s.trim();})});
 return list.__qn;}
function qcFind(norm,list){
 var n=qcNorm(list); return list.filter(function(w,i){return qcHas(norm,n[i]);}); }
/* the sniffer's own read of a line, kept for the lines asked again and again:
   the family questions never change and the lead changes only with the text */
var QC_READ={}, QC_READ_N=0;
function qcRead(bare){
 if(QC_READ.hasOwnProperty(bare))return QC_READ[bare];
 if(++QC_READ_N>400){QC_READ={}; QC_READ_N=1;}
 return (QC_READ[bare]=storyHits(parseStory(bare)).map(function(h){return String(h.t).trim();}));}
var QC_SAID_T=null, QC_SAID_S='';
function qcSaid(text){ if(text!==QC_SAID_T){QC_SAID_T=text; QC_SAID_S=normMap(text).s;} return QC_SAID_S; }
var QC_ASKW=['what','where','when','who','how','which','why','is','are','do','does','did','can',
 'could','would','will','have','has'];

/* CHECK ONE CANDIDATE. Returns {ok, q, checks, fails}; checks is all ten,
   in the document's order, each {n, rule, ok, why}. Pure. */
function srcVet(cand,ctx){
 cand=cand||{}; ctx=ctx||{};
 var q=String(cand.q||'').trim(), text=String(ctx.text||''), L=ctx.ledger||null;
 var said=qcSaid(text), sp=qcSplit(q), bare=sp.bare, nb=normMap(bare).s;
 var asked=qcAsked(bare), na=normMap(asked).s;
 var claim=(L&&cand.target&&L.claims)?L.claims[cand.target]||null:null;
 var nameable=!!(claim&&EV_NAMEABLE.indexOf(claim.state)>=0);
 var checks=[], add=function(n,rule,ok,why){checks.push({n:n, rule:rule, ok:!!ok, why:ok?'':why});};
 var notSaid=function(list){var n=qcNorm(list); return list.filter(function(w,i){return !qcHas(said,n[i]);});};

 /* 1 ONE QUESTION. One mark, at the end, and one asking clause: a leading
    "when you say it," or "if it," is a condition and not a second question. */
 var marks=(q.match(/\?/g)||[]).length;
 var body=asked.toLowerCase().replace(/[^a-z,\s]/g,' ').replace(/^\s*(when|if)\b[^,]*,/,' ');
 var clauses=body.split(/,| and | or | but /).map(function(x){return x.trim().split(' ')[0];})
  .filter(function(w){return QC_ASKW.indexOf(w)>=0;}).length;
 add(1,'one question',marks===1&&/\?\s*$/.test(q)&&clauses<=1,
  marks!==1?(marks+' question marks'):(!/\?\s*$/.test(q)?'it does not end on the question':'two questions in one sentence'));

 /* 2 CLEAR */
 var aw=asked.split(/\s+/).filter(function(w){return /[a-z]/i.test(w);}).length;
 var lw=bare.split(/\s+/).filter(function(w){return /[a-z]/i.test(w);}).length+sp.quotes.join(' ').split(/\s+/).filter(Boolean).length;
 var gr=qcGrade(asked), jar=notSaid(qcFind(nb,QC_JARGON));
 add(2,'clear',gr<=QC_GRADE&&aw<=QC_QWORDS&&lw<=QC_WORDS&&!jar.length,
  jar.length?('words a ten year old would not use: '+jar.join(', ')):
  (gr>QC_GRADE?('reads at grade '+gr+', over '+QC_GRADE):(aw>QC_QWORDS?('the question is '+aw+' words, over '+QC_QWORDS):('the line is '+lw+' words, over '+QC_WORDS))));

 /* 3 THE PERSON'S OWN LANGUAGE. Every quote is letters they wrote. */
 var bad=sp.quotes.filter(function(x){var n=normMap(x).s.trim(); return !n||!qcHas(said,n);});
 add(3,'the person\'s own words',!bad.length,'quotes words they did not write: '+bad.join(', '));

 /* 4 OBSERVABLE */
 var cause=qcFind(na,QC_CAUSE);
 add(4,'observable experience',!cause.length,'asks for a cause, not what happened: '+cause.join(', '));

 /* 5 AGENCY */
 var force=qcFind(nb,QC_FORCE);
 add(5,'agency',!force.length,'casts the person as pushed or told: '+force.join(', '));

 /* 6 NO DIAGNOSIS. Canon names and labels, then the sniffer's own read. */
 var named=notSaid(qcFind(nb,qcCanon()));
 var charged=[];
 qcRead(bare).forEach(function(w){
  if(w&&!qcHas(said,w)&&charged.indexOf(w)<0)charged.push(w);});
 add(6,'no diagnosis',!named.length&&!charged.length,
  'names what the person did not say: '+named.concat(charged.filter(function(w){return named.indexOf(w)<0;})).join(', '));

 /* 7 NO UNSUPPORTED PATTERN */
 var says=notSaid(qcFind(nb,QC_AGAIN));
 var where=notSaid(qcFind(nb,QC_LANDS.concat(qcPlaces())));
 var placeable=!!(claim&&EV_PLACEABLE.indexOf(claim.state)>=0);
 var need=cand.need||'';
 var fam=need==='supported'||need==='history';
 var okAgain=(!says.length||nameable)&&(!fam||nameable);
 var okWhere=!where.length||placeable;
 var okHist=need!=='history'||!!(claim&&claim.earlier>0);
 add(7,'no unsupported pattern',okAgain&&okWhere&&okHist,
  !claim&&(says.length||where.length||fam)?'it says a pattern and is about no claim':
  (!okWhere?('says where it lands, '+where.join(', ')+', about a claim the person has not confirmed, held as '+claim.state):
  (!okAgain?('says '+(says.join(', ')||cand.family)+' about a claim held only as '+claim.state):
  'asks about history before the seat has come back across entries')));

 /* 8 REDUCES UNCERTAINTY. It must say what it is for, and not ask what the
    entry already answers while something else is still open. */
 var dims=L&&L.dims, open=(dims&&dims.open)||[];
 var purpose=!!(cand.dim||cand.family);
 var answered=!!(cand.dim&&dims&&dims.answered&&dims.answered[cand.dim]);
 var other=open.filter(function(k){return k!==cand.dim;}).length>0;
 var noDo=cand.need==='behaviour'&&!(dims&&dims.answered&&dims.answered.behaviour);
 add(8,'reduces uncertainty',purpose&&!(answered&&other)&&!noDo,
  !purpose?'it carries no purpose':(noDo?'it asks what else they wanted before they said what they did':
  ('the entry already answers '+cand.dim+', while '+open.join(', ')+' is open')));

 /* 9 ADVANCES THE ACTIVE THREAD */
 var thr=L?L.thread:null;
 add(9,'advances the thread',!thr||cand.target===thr,
  'it is about '+(cand.target||'nothing')+', and the person is writing about '+thr);

 /* 10 NECESSARY NOW. A repeat is the same question sentence, whatever lead
    stands before it: "You wrote it twice. What did you do?" and "You wrote
    it three times. What did you do?" are one question asked twice. Measured
    on the page, round SK: compared as whole lines, the count in the lead
    moved and the same question passed as new. */
 var qOf=function(x){return normMap(qcAsked(qcSplit(String(x)).bare)).s.trim();};
 var nq=qOf(q), rep=!!nq&&(ctx.asked||[]).some(function(a){return qOf(a)===nq;});
 var closed=!!(claim&&(claim.state==='rejected'||claim.state==='corrected'));
 var stop=need==='unclear';
 add(10,'necessary now',!ctx.passed&&!rep&&!closed&&!stop,
  ctx.passed?'the person moved on':(rep?'already asked in this entry':
  (closed?'the person already answered this claim':'nothing has said what is unclear')));

 var fails=checks.filter(function(c){return !c.ok;});
 return {ok:!fails.length, q:q, checks:checks, fails:fails};}

/* REGENERATE, the document's last word on section 35. Tries each candidate
   in the order given and returns the first that passes all ten, with every
   refusal on the way, so a caller and a gate can both say why a line was
   not shown. When nothing passes it returns no question at all, which is
   section 23's Space: Source AI says nothing rather than something that
   fails. */
/* A FAMILY ALREADY ASKED WAITS. Section 22: stop or change direction when
   "the next question would be repetitive". Seen on the page, round SK: the
   person answered "What would you rather be doing?" with something else,
   and the next turn was "What did you want to do?", the same question in
   other words. So among the candidates, one from a family not yet asked in
   this entry goes before one from a family that has been, each keeping its
   place otherwise, which is srcNext's own novelty rule (engine/sourceai.js)
   read for families. A family is known by its question, off SRC_FAMILY. */
function qcFamilyOf(line){
 var nq=normMap(qcAsked(qcSplit(String(line)).bare)).s.trim(), out=null;
 SRC_FAMILY.forEach(function(f){if(!out&&normMap(f.q).s.trim()===nq)out=f.family;});
 return out;}
function srcChoose(cands,ctx){
 var tried=[], used={};
 ((ctx&&ctx.asked)||[]).forEach(function(a){var f=qcFamilyOf(a); if(f)used[f]=1;});
 var list=(cands||[]).map(function(c,i){return {c:c, i:i, w:(c&&used[c.family])?1:0};})
  .sort(function(a,b){return a.w-b.w||a.i-b.i;}).map(function(x){return x.c;});
 for(var i=0;i<list.length;i++){
  var r=srcVet(list[i],ctx); tried.push({q:r.q, fails:r.fails});
  if(r.ok)return {ok:true, q:r.q, cand:list[i], tried:tried};}
 return {ok:false, q:'', cand:null, tried:tried};}
/* THE FAMILY QUESTIONS AS CANDIDATES about one claim, each after a lead the
   caller builds from the person's own words (a mirror, section 23), in the
   document's order. */
function srcFamilyCands(lead,target){
 var pre=String(lead||'').trim();
 return SRC_FAMILY.map(function(f){
  return {q:(pre?pre+' ':'')+f.q, base:f.q, dim:f.dim, family:f.family, need:f.need||'', target:target||null};});}
/* A LINE THAT SAYS AND DOES NOT ASK, section 23's Mirror and Name. Three of
   the ten points are about any line Source AI says, not only a question: the
   quotes are the person's (3), nothing is diagnosed (6), and no claim is
   said that the ledger does not hold as nameable (7). Mirror says the
   person's words back; Name says where they land, and section 23 allows
   that "only when evidence supports it". Same rules, same code: this is
   srcVet's own result with the seven points that only a question has set
   aside. */
function srcVetSay(line,ctx,target){
 var r=srcVet({q:String(line||'').trim()+' ?', target:target||null, family:'say'},ctx);
 var keep=r.checks.filter(function(c){return c.n===3||c.n===6||c.n===7;});
 var fails=keep.filter(function(c){return !c.ok;});
 return {ok:!fails.length, line:String(line||'').trim(), checks:keep, fails:fails};}
