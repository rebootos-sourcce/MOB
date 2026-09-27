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
   never says why. It asks why, and the person answers, which is the line
   reviews/SPEC-source-ai.md already drew: nothing in the flow measures cause.
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
function srcNegated(src,at){
 var before=String(src).slice(0,at).trim().split(' ');
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
  if(srcNegated(src,s.at)){o.negated++;return;}
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
