/* ============================================================
   A STOP, NOT A DETECTOR, 17 October. srcSafe(text) says whether an entry
   carries one of the phrases in SAFE_WORDS (engine/data/safe.js) as the
   writer's own words. It is the name the ten expected red checks in
   tests/engine.js were written against on 9 October, and they are green on
   this function. Read the data file's header first: it says why the list
   exists, what it leaves out and how to turn it off.

   WHAT A TRIP DOES, and every place it does it:
     parseStory    reads nothing in the entry (engine/sniff.js), so no
                   imprint, band, seat, mark or path comes out of it. Every
                   surface that reads a story reads it through parseStory:
                   the commit, the release column, the tutorial's offer, the
                   wheel, Analytics, the daily rows, the trace graph. So one
                   question at one place keeps the entry out of all of them,
                   which a guard on the Story page alone would not: the
                   release column parses committed entries again and would
                   have offered one off the saved words on the next paint.
     verpApply, leanApply
                   apply nothing (engine/verp.js), because they read the text
                   themselves and would have moved the laws and the leans.
     srcHear       says safe, srcTurn makes the move safe and asks nothing,
                   srcDims says safe and srcNext then has nothing to ask
                   (engine/sourceai.js).
   The entry's words are still kept when the person presses Commit. Nothing
   about the match is: it is worked out again from the words every time it is
   asked, held in page memory and nowhere else, so the record, the export, the
   outbox and the server carry nothing that says it happened.

   NOT A SECOND SCANNER. The phrases are found the way scanStory finds its own
   (' '+phrase+' ' on normMap's copy), and every decision about a hit is the
   sniffer's own reader, called and not copied:
     a no        sniffDeny, which is srcNegated cut at clauseFloor, with the
                 can't stop frame and the comma ruling it already carries.
                 "I would never kill myself" is denied; "I can't stop
                 thinking about killing myself" is not.
     whose       sniffWho, which is whoOf. Asked only of a phrase with no
                 first person word of its own (WHO_ME): "he is suicidal" is
                 someone else's, while "kill myself" and "threatened to kill
                 me" say whose they are in their own words, and asking whoOf
                 of them would hold "he threatened to kill me" as his. An
                 unclear subject trips, because a generic you ("sometimes you
                 just want to die") is so often the writer, and a quiet line
                 shown in error costs less than a statement missed.
   The one rule added is the quotation, SAFE_SAY_V and SAFE_WORK in the data
   file, which the sniffer has no reader for yet. It is here and not in
   sniffWho on purpose: putting it there would change what every entry reads,
   which is L3's work and not this block's.

   KNOWN GAPS, said so nobody has to find them: a no in front of the comma
   ending a clause still reaches across it, the sniffer's comma ruling, so "No,
   I want to die" is read as denied; a phrase this list does not carry is
   read as it always was; and a quotation that runs over a full stop is
   read as the writer's.
   ============================================================ */
/* every hit, with why each one that does not count was set aside. Pure, and
   it keeps nothing: tests and the gate read it, the product reads srcSafe. */
function safeOf(text){
 var t=String(text||''), nm=normMap(t), src=nm.s, hits=[];
 SAFE_WORDS.forEach(function(row){
  if(!row.on)return;
  row.say.forEach(function(w){
   var at=src.indexOf(' '+w+' ');
   while(at>=0){ hits.push({t:w, fam:row.k, band:'safe', at:at, held:row.held[w]||null});
    at=src.indexOf(' '+w+' ',at+1); }});});
 if(!hits.length)return [];
 /* the longer phrase decides for a shorter one inside it, "going to kill
    myself" for "kill myself", so the no in front of the frame is read */
 hits=hits.filter(function(h){
  return !hits.some(function(o){return o!==h&&o.t.length>h.t.length&&o.at<=h.at
   &&o.at+o.t.length>=h.at+h.t.length;});});
 hits.forEach(function(h){
  var after=h.at+1+h.t.length;
  /* straight after it and in its own sentence: "I want to die. Laughing at
     me is all they do" is not the idiom */
  if(h.held&&!SENT_END.test(t.charAt(nm.map[after]))
   &&h.held.some(function(x){return src.indexOf(' '+x+' ',after)===after;}))h.why='idiom';});
 sniffDeny(t,nm,hits);
 hits.forEach(function(h){if(h.neg&&!h.why)h.why='no';});
 var ask=hits.filter(function(h){return !h.why&&!h.t.split(' ').some(function(w){return WHO_ME.indexOf(w)>=0;});});
 if(ask.length)sniffWho(t,nm,ask);
 hits.forEach(function(h){if(h.other&&!h.unclear&&!h.why)h.why='other';});
 var ws=null;
 hits.forEach(function(h){
  if(h.why)return;
  if(!ws)ws=wordsOf(t,nm);
  if(safeQuoted(t,nm,ws,h))h.why='quoted';});
 return hits;}
/* someone else's words or a work's, see SAFE_SAY_V in the data file. Walks
   back from the hit through its own sentence, across a colon ("She said:"),
   and stops at any other sentence end. */
function safeQuoted(t,nm,ws,h){
 var i=-1, k;
 for(k=0;k<ws.length;k++)if(ws[k].at===h.at){i=k;break;}
 /* never taken from safeOf, whose every at is a word's leading space on this
    same normMap copy; kept so a caller with a foreign at reads false and does
    not throw on ws[i] below */
 if(i<0)return false;
 var raw=nm.map[h.at+1], before=t.slice(0,raw), q=-1, n=0;
 for(k=0;k<before.length;k++)if(/["“”]/.test(before.charAt(k))){n++;q=k;}
 var inQuote=n%2===1;
 /* a topic word counts only as what a work is about, within three words of
    about or on: "a documentary about teen suicide". "I read the news and now
    I'm suicidal" names a work and is not about one, and trips. */
 var topic=SAFE_TOPIC.indexOf(h.t)>=0&&ws.slice(Math.max(0,i-3),i)
  .some(function(x){return x.c===ws[i].c&&SAFE_ABOUT.indexOf(x.w)>=0;});
 if(!inQuote&&!topic)return false;
 for(k=i-1;k>=0;k--){
  if(ws[k].c!==ws[k+1].c&&t.charAt(nm.map[ws[k+1].at])!==':')break;
  var w=ws[k].w;
  if(SAFE_WORK.indexOf(w)>=0&&(topic||ws[k].e<=q))return true;
  if(inQuote&&ws[k].e<=q&&SAFE_SAY_V.indexOf(w)>=0){
   var who=whoOf(t,ws,k);
   if(who&&!who.unclear)return true;}}
 return false;}
/* THE ONE QUESTION THE PRODUCT ASKS. true when any hit is the writer's own,
   said without a no, not an idiom and not somebody else's quoted line. */
function srcSafe(text){
 return safeOf(text).some(function(h){return !h.why;});}
