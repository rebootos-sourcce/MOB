/* ============================================================
   THE SNIFFER. scanStory finds every hit, parseStory turns tags
   into imprints, applyStory is the only function that mutates.
   ============================================================ */
var K2BAND={crown:'Crown',eye:'3rd Eye',throat:'Throat',heart:'Heart',
 solar:'Solar',sacral:'Sacral',root:'Root'};
var B2K={Crown:'crown','3rd Eye':'eye',Throat:'throat',Heart:'heart',
 Solar:'solar',Sacral:'sacral',Root:'root'};
var K2B={};Object.keys(B2K).forEach(function(b){K2B[B2K[b]]=b;});
var PMC={};BANDS.forEach(function(b){PMC[b]=PAL[b];});

/* ============================================================
   PASS TWO, THE CANON. And the measurement that makes it the first thing the
   sniffer does rather than a widening of the table.

   The owner asked whether the sniffer has the logic supplied by the book.
   Measured, and this is the answer that mattered most:

     the nine axes the instrument scores   1 of 9 resolved. sad. that is all.
                                           fear, anger, shame, disgust, apathy,
                                           shock, surprise and anticipation were
                                           not words this scanner could find.
     the seven cue words the thirty three
     saboteurs are defined by              0 of 7 resolved.
     the thirty three saboteurs themselves all 33 are named in the book, so the
                                           canon is sourced. the vocabulary that
                                           reaches it was not.

   So a person could write i am full of anger and the instrument that scores an
   Anger axis, and defines eleven of its thirty three saboteurs by an anger
   range, read nothing at all. Not a tuning problem. The scoring layer and the
   reading layer did not share a vocabulary.

   NOTHING HERE IS AUTHORED. Every seat comes from CHG2SEAT and every fetter
   from CHG2FET, which are the app's own existing answers and already have an
   owner. The amount is derived by a stated rule, below. If the owner moves a
   charge to a different seat, this pass moves with it and no second table is
   left behind holding the old answer, which is the defect this whole design
   exists to prevent.
   ============================================================ */
/* THE AMOUNT, DERIVED, because a typed number here would be a magic number in
   the most load bearing row of the table.

   A bare axis noun is the LEAST specific evidence in its family. I was furious
   is a stronger report than I have anger, and the table already prices that:
   the Anger family runs 16 for defensive to 24 for furious. So the bare noun
   takes the floor of its own family, never the median and never the top. Where
   an axis has no authored family at all, and three of the nine do not, it takes
   the lowest charged amount anywhere in the table. Both are read off the table
   at load, so a retuned neighbour retunes this and the gate asserts the rule
   rather than the number. Precision over recall: a false positive in a somatic
   reading costs more than a miss. */
function lexFamilyFloor(){
 var fam={}, all=[];
 Object.keys(LEX).forEach(function(k){
  var e=LEX[k], amt=e[LEX_AMT];
  if(amt<=0) return;
  all.push(amt);
  var f=e[LEX_FET]!=null?e[LEX_FET]:(ADJ2CHG[k]?CHG2FET[ADJ2CHG[k]]:null);
  if(!f) return;
  if(fam[f]===undefined||amt<fam[f]) fam[f]=amt;});
 all.sort(function(a,b){return a-b;});
 return {fam:fam, floor:all.length?all[0]:12};}

/* THE WORDS THIS PASS OWES. Two sets, and they overlap.
     the nine axis names, lowercased. these are what compute() scores.
     every cue word SAB33 defines a saboteur by. these are what the saboteur
     layer reads, and a saboteur nothing can trigger is a dead row.
   Both are read off the canon at load. Neither is a list typed here, so
   neither can fall out of step with the table it came from. */
function lexCanonWords(){
 var want={};
 CHARGES.forEach(function(c){want[String(c).toLowerCase()]=1;});
 SAB33.forEach(function(r){r[1].forEach(function(p){want[p[0]]=1;});});
 return Object.keys(want).sort();}

function lexCanon(){
 var fl=lexFamilyFloor(), axis={};
 CHARGES.forEach(function(c){axis[String(c).toLowerCase()]=c;});
 var out={added:0,already:0,unseated:[],identity:[],floor:fl.floor,fam:fl.fam};
 lexCanonWords().forEach(function(w){
  /* ALREADY RESOLVES, SO NOTHING IS OWED. sad is the case: the axis is named
     Sad, CHG2SEAT answers for sadness and not for sad, and the authored table
     already seats sad at the heart, which is where CHG2SEAT puts sadness. The
     pass does not need a seat it was never going to use. */
  if(LEX[w]){out.already++;return;}
  var bn=CHG2SEAT[w];
  /* THE FETTER, AND THE ONE DERIVATION THAT IS NOT AN INVENTION. CHG2FET
     answers for anxiety and not for anticipation, so the axis Anticipation had
     no route from its own name. Where the word IS an axis name, the fetter is
     that axis: the same string, by identity. Anything else would be a guess and
     is refused below instead. */
  var fet=CHG2FET[w]||axis[w]||null;
  if(fet&&!CHG2FET[w])out.identity.push(w);
  /* A WORD WITH NO SEAT IS NOT GUESSED AT. CHG2SEAT is the owner's ruling about
     where a charge is held. The 112 addresses carry a second answer, in cf, and
     the two DISAGREE for four of the nine axes: cf makes Shame modal at the
     throat where CHG2SEAT says sacral, and Apathy modal at the sacral where
     CHG2SEAT says throat, and Surprise and Anticipation are three way and five
     way ties with no modal band at all. So cf is not a fallback, it is an open
     question, and a pass that picked one of two disagreeing answers would be
     laundering a ruling nobody has made. Reported by name, and the gate fails
     on it, so it gets ruled rather than defaulted. */
  if(!bn||!B2K[bn]||!fet){out.unseated.push(w);return;}
  var amt=fl.fam[fet]!==undefined?fl.fam[fet]:fl.floor;
  var a=lexAdd(w,B2K[bn],amt,fet,{src:'canon',from:'CHG2SEAT and CHG2FET',
   rule:'family floor',cite:'canon'});
  if(a.ok&&!a.already)out.added++; else if(a.already)out.already++;
  /* and the charge name, so the imprint comes back NAMED. a person who wrote
     the axis by its own name has named it, and an imprint marked inferred off
     that word would be the instrument disowning the plainest evidence it ever
     gets. */
  chgAdd(w,w,{src:'canon',from:'CHARGES and SAB33',rule:'identity',cite:'canon'});});
 return out;}

/* THE ORDER IS LOAD BEARING. Canon first, then the fold, so the fold can take
   an inflection of a canon word and never the other way round: a fold entry
   generated off a key that did not exist yet would silently not be generated,
   and the gate would then be asserting the absence of a bug it had itself
   introduced. Both run before scanStory can be called. */
var LEXCANONRUN=lexCanon();
var LEXFOLDRUN=lexFold();
/* ============================================================
   THE PLACE WORD, 20.H2. "The body word the person used is where the body
   is." The excavation document's own failure test, run on the shipped
   build: "I felt tight in my chest when my boss called" read throat 16,
   because body places were read only as fixed phrases, chest tight and jaw
   clenched, and split up by other words "tight" fell back to its own seat.
   The person said chest.

   So a sensation word takes the seat of a place word written in the same
   clause. Three sources seat a place, and each is named on the table so a
   reader can say which one moved a word.

   THE SENSATIONS are the words in this lexicon that report what a muscle or
   a pulse is doing, which is a thing that happens somewhere. A feeling word
   does not move: "shaking" and "trembling" are fear, and fear is held at the
   root wherever the hands are. Every one of these must already be a key, so
   this never makes a hit, it only moves where one lands.

   THE PLACES, in the order they are tried.
   1. The lexicon's own body phrases. A place word is seated where every
      phrase containing it is seated: chest where chest is tight, heavy in my
      chest and chest tight already sit. CHILD's loc column, the plain words
      the product uses for where each axis is held, can veto that seat.
   2. The owner's rulings, SOMA_PLACE_RULED below, which are typed because a
      ruling is a decision and not a derivation. Each names its round. A
      ruled word that a phrase seats the other way is listed in `dispute`
      and the gate asserts that list is empty.
   3. CHILD's loc column, added round OG, on the owner's word that detail may be
      added from what the codex already says. A word the phrases do not seat
      and that CHILD names at exactly one seat takes that seat. A word CHILD
      names at two seats is refused by name, never split. This reverses the
      earlier rule that CHILD could only veto: the gate asserts the derived
      table, so the reversal is visible and not silent.
   A place none of these seat is not guessed at, it is listed in `unseated`,
   which is the list of words the codex is silent on. A place two sources
   seat differently is refused by name.
   ============================================================ */
var SOMA_SENSE=['tight','tightness','tense','tensed','tension','clenched','clenching',
 'throbbing','throb','pounding'];
/* every place a person names, seated or not. Only the ones the lexicon's
   own phrases seat can move a sensation; the rest are here so they can stop
   one. Measured on every string the repository ships, the book included:
   with chest as the only place listed, "chest tightness, foot pain, lower
   back tension" carried the back's tension to the chest. Listing back makes
   it the nearest place to "tension", and a place with no seat moves
   nothing. Adding a word here can only ever stop a move. */
var SOMA_PLACE_WORDS=['chest','jaw','throat','stomach','neck','shoulder','shoulders','gut',
 'belly','heart','head','back','rib','ribs','spine','hip','hips','arm','arms','hand',
 'hands','leg','legs','foot','feet','face','eyes','forehead','temples','muscles','body',
 'navel','diaphragm','abdomen','sternum','skin','celiac','hypogastric','pudendal','plexus'];
/* THE OWNER'S RULINGS. Round OG: "The belly button is the sacral. The
   diaphragm is a solar plexus." Round OI: "Oh, heart should go at where the
   heart goes." Belly button is read through the word belly, which is the only
   place word in it. The seat keys are the engine's own, B2K's values, and the
   gate asserts that. Spine is NOT here and is not seated anywhere: round OI,
   "Spine would be for the Kundalini health. But this also looks like it's
   part of the pain map." It stays a place word, so it can stop a move, and
   it moves nothing. */
var SOMA_PLACE_RULED={belly:'sacral',navel:'sacral',diaphragm:'solar',heart:'heart'};
/* THE HALVES, round OI: "No, upper and lower could be solar and sacral." A
   half in front of belly or abdomen is a two word place and outranks the word
   inside it. Abdomen alone stays refused, because CHILD splits it: the upper
   abdomen is Anger at the solar seat and the lower abdomen is Disgust at the
   sacral. The gate holds the abdomen pair against CHILD's loc column. */
var SOMA_PLACE_HALVES={upper:'solar',lower:'sacral'};
var SOMA_PLACE_HALVED=['belly','abdomen'];
/* THE PLEXUS NAMES, round OI: "sacral is just below the belly button and the
   plexus at the back of the spine. The solar is the diaphragm and the plexus
   at the back of the spine." What the engine can carry of that is the names
   the codex gives those plexuses, read off CHILD's addr column and the nv
   column of APC, never a seat typed here. A person does not write "the plexus
   at the back of the spine", so no such phrase is read; the back of the spine
   is a position and spine is not seated. Phrases tried, each seated where the
   rows that name every word of it agree. */
var SOMA_PLACE_PLEX=['solar plexus','celiac plexus','sacral plexus','hypogastric plexus'];
var SOMA_PLACE_PLEXWORDS=['celiac','hypogastric','pudendal','plexus'];
/* the codex rows that name every word of a place, by seat key. Plain, that is
   CHILD's loc column alone, where the book says each axis is held in the
   body. Wide, it also reads CHILD's addr column and APC's nv column, which
   name the plexus that carries each axis. Wide is for the plexus names only:
   the addr column also says "Shoulder girdle and throat" for Apathy, and the
   owner has not ruled on shoulders, so a body word is never read wide. The
   prose column d is not read. */
function codexRows(ws,wide){
 var out={};
 function has(text,w){return (' '+String(text||'').toLowerCase().replace(/[^a-z]+/g,' ')+' ').indexOf(' '+w+' ')>=0;}
 function all(text){return ws.every(function(w){return has(text,w);});}
 CHILD.forEach(function(c){
  if(B2K[c.seat]&&(all(c.loc)||(wide&&all(c.addr))))out[B2K[c.seat]]=c.nm+' at the '+(all(c.loc)?c.loc:c.addr);});
 if(wide)APC.forEach(function(r){
  if(B2K[r.b]&&all(r.nv)&&!out[B2K[r.b]])out[B2K[r.b]]=r.b+' seat, '+r.nv;});
 return out;}
function somaPlaces(){
 var out={seat:{}, refused:{}, unseated:[], sense:[], missing:[], ruled:[], codex:[], dispute:{},
  phrase:{}, phraseRefused:{}, phraseWhy:{}};
 SOMA_SENSE.forEach(function(w){(LEX[w]?out.sense:out.missing).push(w);});
 SOMA_PLACE_WORDS.forEach(function(w){
  var seats={};
  Object.keys(LEX).forEach(function(k){
   /* a phrase says where. a single word is a sensation or a feeling */
   if(k.indexOf(' ')<0||(' '+k+' ').indexOf(' '+w+' ')<0)return;
   var s=LEX[k][LEX_SEAT]; if(s!=='coherent')seats[s]=1;});
  var sk=Object.keys(seats);
  if(SOMA_PLACE_RULED[w]){
   if(sk.length&&(sk.length>1||sk[0]!==SOMA_PLACE_RULED[w]))out.dispute[w]=sk.sort().join(' and ');
   out.seat[w]=SOMA_PLACE_RULED[w]; out.ruled.push(w); return;}
  if(!sk.length){
   /* no phrase seats it. CHILD's loc column may, if it names the word at one
      seat and one only */
   var cs=codexRows([w],SOMA_PLACE_PLEXWORDS.indexOf(w)>=0), ck=Object.keys(cs);
   if(ck.length===1){out.seat[w]=ck[0]; out.codex.push(w);}
   else if(ck.length>1)out.refused[w]='the codex holds it at '+ck.sort().join(' and ')
    +' ('+ck.map(function(k){return cs[k];}).join('; ')+')';
   else out.unseated.push(w);
   return;}
  if(sk.length>1){out.refused[w]='the lexicon seats it at '+sk.sort().join(' and ');return;}
  var veto=CHILD.filter(function(c){
   var loc=' '+String(c.loc||'').toLowerCase().replace(/[^a-z]+/g,' ')+' ';
   return loc.indexOf(' '+w+' ')>=0&&B2K[c.seat]!==sk[0];});
  if(veto.length){out.refused[w]='the codex holds '+veto[0].nm+' at the '+veto[0].loc
   +', which is the '+veto[0].seat+' seat and not '+sk[0];return;}
  out.seat[w]=sk[0];});
 /* the two word places. A half and a place: the owner's ruling, checked
    against the codex wherever the codex says the same words. */
 Object.keys(SOMA_PLACE_HALVES).forEach(function(h){SOMA_PLACE_HALVED.forEach(function(pw){
  var ph=h+' '+pw, seat=SOMA_PLACE_HALVES[h], cs=codexRows([h,pw]), ck=Object.keys(cs);
  if(ck.length&&(ck.length>1||ck[0]!==seat)){out.dispute[ph]=ck.join(' and ');return;}
  out.phrase[ph]=seat; out.phraseWhy[ph]=ck.length?'ruled, and the codex agrees: '+cs[ck[0]]:'ruled';});});
 /* the plexus names, derived. A name the codex gives two seats is refused. */
 SOMA_PLACE_PLEX.forEach(function(ph){
  var cs=codexRows(ph.split(' '),true), ck=Object.keys(cs);
  if(ck.length===1){out.phrase[ph]=ck[0]; out.phraseWhy[ph]=cs[ck[0]];}
  else if(ck.length>1)out.phraseRefused[ph]='the codex holds it at '+ck.sort().join(' and ')
   +' ('+ck.map(function(k){return cs[k];}).join('; ')+')';
  else out.phraseRefused[ph]='the codex does not name it';});
 return out;}
/* PASS THREE RUNS HERE, round QZ follow on, and not beside the canon and the
   fold above, because it needs the place words, which are declared just above,
   and must finish before the place table below is derived from LEX. It is
   handed the place table as it stands without it, and refuses any key that
   would seat a place differently, so SOMA_PLACE comes out the same and the gate
   asserts that against LEXSYNPLACES, the table as it stood before. */
var LEXSYNPLACES=somaPlaces();
var LEXSYNRUN=lexSyn({words:SOMA_PLACE_WORDS,seat:LEXSYNPLACES.seat});
var SOMA_PLACE=somaPlaces();
/* ============================================================
   THE NORMALISATION, AND THE INDEX BACK OUT OF IT.

   scanStory reads a normalised copy of the story: lowercased, everything that
   is not a letter, an apostrophe or a space turned into a space, runs of space
   collapsed to one, and a space added at each end so every word has a boundary
   on both sides. hit.at is an offset into THAT string and the engine has been
   carrying it since the path was built.

   The story page threw those offsets away and ran its own global regular
   expression over the raw text, which is a second reading of the same sentence
   by a different rule. Measured on an 87 word story in the shipped build: the
   scanner recorded 8 hits and the page lit 4. It dropped both coherent hits,
   because it filtered them out to pick a seat colour, and it never printed the
   name the engine already holds, where "stayed quiet" is silenced.

   So the normalisation is a function that also returns the raw index of every
   character it kept, and scanStory builds its own src from it. One string, one
   set of offsets, and no way for the two to drift: the earlier inline version
   and a hand rebuilt copy differed by one whenever the text opened or closed on
   punctuation, because ' '+body put two spaces at the front when body already
   began with one.

   Ported from proto/story4, where four prototypes each carried a copy.
   ============================================================ */
/* THE APOSTROPHE IS DROPPED, round QZ follow on, and it was the cheapest
   recall this file had. Measured before: "I can't cope" read nothing, "I
   cant cope" read solar 26. Every key in the lexicon that a person writes with
   an apostrophe, dont, cant, didnt, couldnt, wouldnt, havent, whats, im, is
   typed without one, and normMap kept the one the person typed, so all of
   them were unreachable from ordinary writing. A phone types the curly one,
   which was turned into a SPACE, "can t", which was worse. lawNorm, the other
   normalisation in this file, has always dropped apostrophes, and srcNegated's
   own list is written dont and cant, so this makes the two readers agree
   rather than inventing a third rule. Dropping a character moves no offset
   the map cannot carry: map holds the raw index of every character kept. */
var NORM_APOS=/['\u2018\u2019]/;
function normMap(t){
 t=String(t||'');
 var body='',bm=[],i,c;
 for(i=0;i<t.length;i++){
  c=t.charAt(i).toLowerCase();
  if(NORM_APOS.test(c))continue;
  if(!/[a-z ]/.test(c))c=' ';
  body+=c; bm.push(i);}
 var s=' ', map=[0], prev=true;
 for(i=0;i<body.length;i++){
  var sp=body.charAt(i)===' ';
  if(sp&&prev)continue;
  s+=body.charAt(i); map.push(bm[i]); prev=sp;}
 /* AND THE CLOSING BOUNDARY IS ONLY ADDED IF THERE IS NOT ONE THERE ALREADY,
    which the opening one has always done and this end had not. A story ending
    on punctuation turned that punctuation into a space and then had another
    appended, so the normalised copy closed on two: "hello." came back as
    " hello  " and empty text came back as two spaces with a map entry
    addressing nothing. It is the same off by one the note above records for the
    opening boundary, on the other end, and the prototypes carry it too.

    It changes no match, and that was measured rather than argued: 1779 texts
    built from every phrase and four hundred words of the lexicon, each placed
    at the end of a sentence, mid sentence and alone, scanned before and after.
    Same hits, same kinds, same bands, same offsets, identical to the md5. A
    phrase at the very end still closes on a space, because the first of the two
    was always the real one. */
 if(!prev){s+=' '; map.push(t.length);}
 return {s:s,map:map};}
/* ============================================================
   WORDS DICTATION HID BEHIND STARS. Round QR, 3 October: his own dictated
   story on the Journal arrived as "I used to just ******* hate" and "I was
   really ****** ***", whole words gone, with nothing on the page saying so.

   THIS PRODUCT DID NOT DO IT. Searched: nothing in atuned_src masks a word.
   Reproduced in Chromium with the recognizer stood in: whatever transcript the
   speech service hands stMic lands in the box byte for byte, stars and swear
   words alike. The stars are put there by the dictation service before the
   words reach the page: Chrome's Web Speech API, Gboard voice typing and
   other vendors' dictation all filter profanity by default, some keeping the
   first letter ("s****") and some not ("*******"). The page cannot get the
   word back. What it can do is notice, say so, and ask.

   And it matters to the reading, not only to the record. normMap above turns
   every star into a space, so a hidden word is not read as a gap, it is read
   as nothing: "really ****** ***" reaches the scanner as "really", and
   "really ****** furious" reaches it as "really furious", which puts the
   degree word against a word the person did not put it against (24 read as
   33.6, measured). The stars are not changed here; that is the scanner's own
   rule and it is protected. The person is told, and can type the word.

   A RUN IS TWO OR MORE STARS IN A ROW inside one word, with any letters the
   service left on either side: "******", "s****", "f***ing". One star alone
   is a person's own emphasis or a footnote, and is not flagged. Returns each
   run with its raw offset, its length and the word as it stands, in order.
   Pure: no host, nothing stored. */
var MASK_RE=/[A-Za-z']*\*{2,}[A-Za-z'*]*/g;
function maskedRuns(t){
 t=String(t||''); var out=[], m;
 MASK_RE.lastIndex=0;
 while((m=MASK_RE.exec(t))){out.push({at:m.index, len:m[0].length, word:m[0]});}
 return out;}
/* THE SENTENCE, ONE COPY, for every surface that takes a story. Plain words
   per the ten year old ruling, and the word dictation unpacked where it
   stands. Empty when nothing is hidden, so a caller prints it or prints
   nothing and never a sentence about zero words. */
function maskedSay(runs){
 var n=(runs&&runs.length)||0; if(!n)return '';
 var one=n===1;
 return (one?'One word was':n+' words were')+' hidden behind stars before '
  +(one?'it':'they')+' reached this page. Dictation, the speech to text on '
  +'your device or in your browser, does that to words it counts as swearing. '
  +'Nothing here changed '+(one?'it':'them')+', and the reading cannot see '
  +(one?'it':'them')+'. Type each word over its stars and it will be read.';}
/* ============================================================
   THE CLAUSE FLOOR. One shared primitive, built so srcNegated below and
   anything built on 20.G6 or 20.G7 later can all stop a backward read at a
   sentence boundary without a second normalised copy of the text.

   lawNegated and leanNegated already solve their own version of this, by
   building their own copy of the text with a literal '|' inserted at every
   sentence end (lawNorm, leanNorm) and scanning THAT. That works for them
   because they also do their own matching on that same copy, so the
   offsets never have to agree with anyone else's.

   srcHear cannot do that. It reads scanStory's own hits off p.path.steps,
   so its offsets are normMap's own, and a second copy with '|' tokens
   inserted would be a different length from the first boundary on, which
   desyncs every offset after it. Measured directly rather than assumed:
   "I am not afraid. Afraid now." reads nm.s as
   " i am not afraid afraid now ", one single space standing for the
   period, and srcNegated(nm.s, at of the second afraid) read true before
   this fix, the second sentence voided by the first one's own negation.

   So this asks the question a different way, on the one copy that
   already exists. nm.map carries the raw index behind every character of
   nm.s, and the single space a run of punctuation collapsed to is mapped
   to the FIRST character of that run, because normMap keeps only the
   first space of a run and nothing after it. So where nm.s holds a space
   AND the raw character behind it is one that ends a clause, that space
   is a boundary, found without moving a single offset scanStory itself
   produced. A comma is left out on purpose, the same ruling leanNorm
   already made: it is too weak a break to end a negation. */
var SENT_END=/[.!?;:\n\r]/;
function clauseFloor(t,nm,at){
 t=String(t||'');
 for(var k=Math.min(at,nm.s.length-1);k>=0;k--){
  if(nm.s.charAt(k)===' '&&SENT_END.test(t.charAt(nm.map[k])))return k;}
 return -1;}
/* EVERY WORD, WITH ITS CLAUSE. The forward half of clauseFloor, on the same
   copy and by the same rule: a space whose raw character ends a clause opens
   the next one, so a word whose own leading space is that boundary belongs
   to the clause after it, which is where clauseFloor already puts it. One
   reader of the boundary for every pass that needs it, 20.H1, 20.H2 and
   20.H6, rather than a second rule to drift from the first.
     at  the word's leading space in nm.s, which is what a hit's at is
     s,e the raw letters it came from, so t.slice(s,e) is what was typed
     c   the clause, counted from nought
     g   the clause cut again at every comma. Only 20.H2 reads it: a comma
         is too weak a break to end a negation, leanNorm's ruling, and it is
         exactly the break between items in a list, which is where a place
         and a sensation stop belonging together. */
function wordsOf(t,nm){
 t=String(t||''); nm=nm||normMap(t);
 var out=[], c=0, g=0, s=nm.s;
 for(var k=0;k<s.length;k++){
  if(s.charAt(k)!==' ')continue;
  var raw=t.charAt(nm.map[k]);
  if(k>0&&SENT_END.test(raw)){c++;g++;}
  else if(k>0&&raw===',')g++;
  var j=s.indexOf(' ',k+1); if(j<0||j===k+1)continue;
  out.push({at:k, w:s.slice(k+1,j), s:nm.map[k+1], e:nm.map[j-1]+1, c:c, g:g});}
 return out;}
/* ============================================================
   A WORD SAID WITH A NO, package S1 of REVIEW-sniffer-audit-2026-10-09.md,
   ruling 1. Measured on main before this: "I was not angry" read Anger 18 at
   the solar plexus, exactly "I was angry", while the Story page drew the same
   word struck through. A negated charge word is not a positive admission and
   is not erased either: the hit is kept, flagged neg, and parseStory lists it
   in denied and counts it nowhere.

   NOT A THIRD NEGATION READER. srcNegated (engine/sourceai.js) decides, with
   its own list and its own two word window, cut at a sentence end by
   clauseFloor, which is exactly what Source AI has always asked. This only
   moves the floor that call is given, for two named reasons, and both only
   ever stop a no from reaching a word:
     a word already read keeps its own no. "cant sleep", "im not okay",
       "nobody listens" are read as charge with the no inside them, so the no
       is theirs and the word after it is not denied by it. Measured: "I
       can't sleep, terrified" denied terrified before this.
     a can't stop frame is not a denial. A no straight before one of
       NEG_NOT_DENY says the thing would not stop: "I can't stop crying",
       "it never stops hurting", "I couldn't help crying". Each has a test.
   A comma does not end a no, which is leanNorm's ruling and clauseFloor's,
   so "I was not, honestly, angry" is denied. The cost of that ruling is
   measured and reported with the change, not hidden here.

   A COHERENT WORD IS NEVER DENIED. A denial must never raise a reading, and
   denying a word that subtracts would. "I am not grateful" subtracts as it
   always did; that is a known gap, written in TDD-sniffer.md, and not made
   worse here.

   The hit keeps negw, the no it saw, and negAt, that word's leading space in
   nm.s, so a mark and a list can quote from the no to the word on the letters
   typed. srcNegated is the decision; this only finds which word it saw. */
var NEG_NOT_DENY=['stop','stops','stopped','help'];
function sniffDeny(t,nm,hits){
 var ws=null, cuts=[];
 hits.forEach(function(h){
  if(h.band==='coherent')return;
  if(!ws){ws=wordsOf(t,nm);
   /* every place a no is already spoken for: the end of each word read, and
      the end of each can't stop frame. Kept as the trailing space, which is
      the next word's leading one, so the window starts on the next word. */
   hits.forEach(function(o){cuts.push({at:o.at,end:o.at+1+String(o.t).length});});
   for(var i=0;i+1<ws.length;i++)
    if(ws[i].c===ws[i+1].c&&SRC_NEG.indexOf(ws[i].w)>=0&&NEG_NOT_DENY.indexOf(ws[i+1].w)>=0)
     cuts.push({at:ws[i].at,end:ws[i+1].at+1+ws[i+1].w.length});}
  var f=clauseFloor(t,nm,h.at);
  cuts.forEach(function(c){if(c.at<h.at&&c.end<=h.at&&c.end>f)f=c.end;});
  if(!srcNegated(nm.s,h.at,f))return;
  var win=ws.filter(function(w){return w.at<h.at&&w.at>=Math.max(f,0);}).slice(-SRC_NEG_W);
  var ng=win.filter(function(w){return SRC_NEG.indexOf(w.w)>=0;})[0]||null;
  h.neg=true; h.negw=ng?ng.w:null; h.negAt=ng?ng.at:null;});}
/* ============================================================
   WHOSE CHARGE, package S2 of REVIEW-sniffer-audit-2026-10-09.md, ruling 2,
   and guard 2 of SNIFFER_SPEC.md, "never score another person". Measured on
   main before this: "he shouted at me" read Anger 24 at the solar plexus,
   exactly "I shouted at him", and "he is furious" exactly "I am furious".

   THE RULE, AS RULED. A charge word whose clear subject in its own comma
   group is a third person, with no first person between that subject and the
   word, is held: the hit is kept, flagged other with who it was, parseStory
   lists it in others and counts it nowhere. No subject, or a first person
   subject, is the writer, which is what a journal is. An unclear subject is
   held too, and flagged unclear, so a page can say it is unclear rather than
   say it is someone else's.

   HOW A SUBJECT IS FOUND, read backward from the word through its own comma
   group (wordsOf's g), nearest first, so the first person or third person
   met first decides:
     a first person (WHO_ME)    the writer, and the read stops. "he made me
                                furious" is the writer's.
     he, she, they (WHO_SUBJ)   someone else. These are subjects by their
                                form, wherever they stand.
     a person, opening a clause someone else, when the phrase opens its clause:
                                the group's first word, or after a word in
                                WHO_OPEN ("and", "when", "then", "like").
                                A person is a word in LEXKIN or in Source AI's
                                own contact cues, SRC_DIM_CUE.contact, read
                                from there and not retyped, with its "my",
                                "the" or "her" in front. After a verb it is who
                                was spoken to, "I called my mother and was
                                furious", and the read steps past it, its "my"
                                with it.
     his, her, their opening    someone else's: "her anger scared me".
       a clause
     a name opening a clause    a capital that does not start its sentence,
                                after a word in WHO_OPEN or at a comma: "then
                                Sarah screamed". A capital after "to" is a
                                place. A name that starts its sentence cannot
                                be told from any other first word, and is read
                                as the writer's, which is named in GAPS.
     you, opening a clause      unclear: generic "you" is often the writer and
                                sometimes not, so it is held and says so.
   And straight before the word, his, her, their, him or them makes it theirs:
   "her anger", "I made her cry", "I saw him crying".

   A DENIAL IS A DENIAL WHOEVER SAID IT. A hit sniffDeny flagged is not read
   again here, so it is listed once. A coherent word is never held, for the
   reason S1 gives: holding a word that subtracts would raise a reading.

   A LOSS IS THE WRITER'S, WHOEVER IT HAPPENED TO. Measured on the first cut
   of this reader: "My father died and I feel ashamed" lost its grief at the
   heart, and "I've been on my own since he died" fell from 50 to 22, because
   "my father" and "he" are the subjects of "died". The ruling is about
   another person's feelings and doings, "he is furious", "he shouted at me".
   A death or a loss is neither: it happens to the one who is gone and the
   charge the lexicon gives it, grief at the heart, is carried by the one left.
   lexicon.js wrote its grief and loss block for exactly this, "a father
   dying" read as nothing before it. So a hit in WHO_LOSS, or a synonym or
   fold of one by LEXMETA.from ("killed himself", "took his own life",
   "funerals", "divorced"), is never held. Told that a father's death is
   about someone else, a bereaved person would be told the worst thing this
   product could say. The list is the heads of that block and of the
   grieving family, and the gate holds each one as a heart key.

   NOT A CLINICAL CLAIM AND NOT A MODEL. It is a few grammar words and two
   tables the engine already has, and every hold names the word that decided
   it in who, so a person and a reviewer can both see why. */
var WHO_ME=['i','im','ive','id','me','my','mine','myself','we','us','our','ours','ourselves','weve'];
var WHO_SUBJ=['he','she','they','hes','shes','theyre','theyve','theyll','theyd','hed'];
var WHO_POSS=['his','her','their'];
var WHO_OBJ=['him','them'];
var WHO_YOU=['you','youre','youve','youd','youll'];
var WHO_DET=['my','his','her','their','our','your','the','a','an'];
var WHO_OPEN=['and','but','then','when','while','because','cause','so','after','before','until','till',
 'as','if','since','or','that','though','although','once','whenever','where','why','how','like',
 'now','today','yesterday','tonight','again','also','just','still','even','suddenly','finally','later'];
var WHO_LOSS=['died','death','dying','passed away','grief','mourning','mourn','bereaved','loss','funeral',
 'buried','widowed','miscarriage','stillborn','grieving'];
function whoLoss(h){
 var m=LEXMETA[h.t];
 return WHO_LOSS.indexOf(h.t)>=0||!!(m&&m.from&&WHO_LOSS.indexOf(m.from)>=0);}
function whoPerson(w){
 if(WHO_SUBJ.indexOf(w)>=0||WHO_POSS.indexOf(w)>=0||WHO_OBJ.indexOf(w)>=0)return false;
 return LEXKIN.indexOf(w)>=0||SRC_DIM_CUE.contact.indexOf(w)>=0;}
/* a phrase starting at word k opens its clause: the first word of its comma
   group, or straight after a word that opens a clause */
function whoOpens(ws,k){return k===0||ws[k-1].g!==ws[k].g||WHO_OPEN.indexOf(ws[k-1].w)>=0;}
function whoOf(t,ws,i){
 var g=ws[i].g, j, w, k;
 if(i>0&&ws[i-1].g===g&&(WHO_POSS.indexOf(ws[i-1].w)>=0||WHO_OBJ.indexOf(ws[i-1].w)>=0))
  return {k:i-1,j:i-1};
 for(j=i-1;j>=0&&ws[j].g===g;j--){
  w=ws[j].w;
  if(WHO_ME.indexOf(w)>=0)return null;
  if(WHO_SUBJ.indexOf(w)>=0)return {k:j,j:j};
  if(whoPerson(w)){
   k=j;
   if(k>0&&ws[k-1].g===g&&LEXKIN.indexOf(ws[k-1].w+' '+w)>=0)k--;
   if(k>0&&ws[k-1].g===g&&WHO_DET.indexOf(ws[k-1].w)>=0)k--;
   if(whoOpens(ws,k))return {k:k,j:j};
   j=k; continue;}
  if(WHO_POSS.indexOf(w)>=0&&whoOpens(ws,j))return {k:j,j:j};
  if(WHO_YOU.indexOf(w)>=0&&whoOpens(ws,j))return {k:j,j:j,unclear:true};
  if(j>0&&ws[j-1].c===ws[j].c&&/^[A-Z][a-z]+$/.test(t.slice(ws[j].s,ws[j].e))&&whoOpens(ws,j))
   return {k:j,j:j};}
 return null;}
function sniffWho(t,nm,hits){
 var ws=null, byAt=null;
 hits.forEach(function(h){
  if(h.band==='coherent'||h.neg||whoLoss(h))return;
  if(!ws){ws=wordsOf(t,nm); byAt={}; ws.forEach(function(w,i){byAt[w.at]=i;});}
  var i=byAt[h.at]; if(i===undefined)return;
  var r=whoOf(t,ws,i); if(!r)return;
  h.other=true; h.whoAt=ws[r.k].at;
  h.who=ws.slice(r.k,r.j+1).map(function(x){return x.w;}).join(' ');
  if(r.unclear)h.unclear=true;});}
function scanStory(text){
 var nm=normMap(text), src=nm.s;
 var hits=[];
 /* phrases first: an idiom outranks its own words */
 PHRASES.forEach(function(row){
  var words=row[0], band=row[1], amt=row[2], label=row[3];
  words.forEach(function(w){
   var at=src.indexOf(' '+w+' ');
   while(at>=0){ hits.push({t:w,kind:'phrase',band:band,amt:amt,label:label,at:at});
    at=src.indexOf(' '+w+' ',at+1); }});});
 /* multi-word LEX entries next, then single words */
 var keys=Object.keys(LEX).sort(function(a,b){return b.length-a.length;});
 keys.forEach(function(w){
  var at=src.indexOf(' '+w+' ');
  while(at>=0){
   /* The window was t.length+2. A match of ' w ' occupies [at, at+len+2), but
      its trailing space IS the next word's leading space, so the next word
      starts at at+len+1 and fell inside the window. Every word directly
      following a longer one was suppressed, and keys are scanned longest
      first, so it bit constantly: a third of legitimate matches never landed.
      The phrase still outranks the words inside it, which is what this is for. */
   if(!hits.some(function(h){return h.at<=at&&at<h.at+h.t.length+1;}))
    /* A WORD MAY NAME ITS OWN FETTER, and some have to.

       LEX was [seat, intensity] and the fetter was then inferred from the
       seat's modal one. That works while a seat carries the child emotion the word
       means, and the exhaustion family proves it does not always: the owner
       ruled that exhaustion sits at the solar plexus and is NOT anger, and the
       solar plexus carries ten Anger addresses and no Apathy address at all.
       Seat and fetter are two facts and the table could only hold one.

       A third element states the fetter outright. The seat still says where,
       which is what the body map needs, and the fetter now says what, which is
       what the person reads. Entries without a third element behave exactly as
       before. */
    hits.push({t:w,kind:'word',band:LEX[w][0],amt:LEX[w][1],fet:LEX[w][2]||null,at:at});
   at=src.indexOf(' '+w+' ',at+1);}});
 /* adjectives name the charge even when they carry no band */
 Object.keys(ADJ2CHG).forEach(function(w){
  var at=src.indexOf(' '+w+' ');
  while(at>=0){ hits.push({t:w,kind:'adj',charge:ADJ2CHG[w],at:at});
   at=src.indexOf(' '+w+' ',at+1);}});
 /* THE DEGREE WORD, AZ6. A LEXMOD entry standing immediately before a word or
    phrase hit scales its amount, and the hit keeps both so the path and any
    reader can see what was scaled and by what. Only the nearest degree word
    counts, longest first, so "a little" wins over a stray "little". The
    amount stays unrounded: parseStory divides by 3 before anything is
    rounded, and rounding here would fold "fairly" back into the plain word. */
 var mods=Object.keys(LEXMOD).sort(function(a,b){return b.length-a.length;});
 hits.forEach(function(h){
  if(h.amt==null||(h.kind!=='word'&&h.kind!=='phrase'))return;
  var before=src.slice(0,h.at+1);
  for(var i=0;i<mods.length;i++){
   if(before.slice(-(mods[i].length+2))===' '+mods[i]+' '){
    h.mod=LEXMOD[mods[i]]; h.modw=mods[i]; h.amt=h.amt*h.mod; break;}}});
 /* THE PLACE WORD, 20.H2, see SOMA_PLACE above. A sensation word moves to
    the seat of the nearest place word in its own clause, counted in words,
    and not across a comma (wordsOf's g). Measured on every string the
    repository ships: "chest tightness, foot pain, lower back tension" has
    the chest and the foot one word either side of "tightness".
    Two places at the same distance that disagree move nothing, because
    picking one would be the instrument choosing where the person meant.
    The hit keeps the seat it had in `was` and the word that moved it in
    `place`, so a reader can always say why it landed there. The amount is
    untouched: the person said how much, and where. */
 var sense=hits.filter(function(h){return h.kind==='word'&&SOMA_PLACE.sense.indexOf(h.t)>=0;});
 if(sense.length){
  var ws=wordsOf(text,nm), byAt={};
  ws.forEach(function(w,i){byAt[w.at]=i;});
  /* EVERY PLACE WORD COUNTS FOR NEAREST, SEATED OR NOT. "my stomach was in a
     knot and my shoulders tight" names shoulders for the tightness, and
     shoulders has no seat in this lexicon. Counting only the seated places
     would carry the tightness eight words back to the stomach, which is a
     place the person did not say was tight. So the nearest place decides,
     and a nearest place with no seat moves nothing. */
  /* A TWO WORD PLACE OUTRANKS THE WORD INSIDE IT, the way a phrase outranks
     its words everywhere else in this scanner: "upper belly" is one place,
     read at the solar seat, and not the belly at the sacral. It sits at its
     last word. A phrase the codex refused is still a place, seatless, so it
     still stops a move. */
  var pl=[], used={}, phr=Object.keys(SOMA_PLACE.phrase).concat(Object.keys(SOMA_PLACE.phraseRefused));
  ws.forEach(function(w0,i){
   phr.forEach(function(ph){
    var pw=ph.split(' '), n=pw.length, k;
    if(i+n>ws.length||used[i])return;
    for(k=0;k<n;k++)if(ws[i+k].w!==pw[k]||ws[i+k].g!==ws[i].g||used[i+k])return;
    for(k=0;k<n;k++)used[i+k]=1;
    pl.push({j:i+n-1,w:ph,at:ws[i].at,seat:SOMA_PLACE.phrase[ph]||null});});});
  ws.forEach(function(w,i){if(!used[i]&&SOMA_PLACE_WORDS.indexOf(w.w)>=0)pl.push({j:i,w:w.w,at:w.at,seat:SOMA_PLACE.seat[w.w]||null});});
  sense.forEach(function(h){
   var i=byAt[h.at]; if(i===undefined)return;
   var best=null, tie=false;
   pl.forEach(function(q){
    var j=q.j;
    if(ws[j].g!==ws[i].g)return;
    var d=Math.abs(j-i), seat=q.seat;
    if(!best||d<best.d){best={d:d,seat:seat,w:q.w,at:q.at};tie=false;}
    else if(d===best.d&&seat!==best.seat)tie=true;});
   if(!best||tie||!best.seat)return;
   h.place=best.w; h.placeAt=best.at;
   if(best.seat!==h.band){h.was=h.band; h.band=best.seat;}});}
 hits.sort(function(a,b){return a.at-b.at;});
 /* A WORD SAID WITH A NO, S1, see sniffDeny above. The scanner says what is
    around a word, the way it already says the degree word and the place
    word; parseStory decides what counts. */
 sniffDeny(text,nm,hits);
 /* AND WHOSE IT IS, S2, see sniffWho above. After the denial, so a word said
    with a no is listed once, as denied. */
 sniffWho(text,nm,hits);
 return hits;}
/* ============================================================
   THE PATH.

   scanStory already records `at`, the character offset of every hit, and
   sorts the hits by it. parseStory then collapsed everything into per band
   totals, so the route a sentence takes through the body was computed once
   per parse and thrown away. This keeps it.

   Every step sits at a measured position: the centroid of that seat's own
   traced nerve branches, SEATXY. No invented anatomy. What the path adds is
   order, direction and distance, which the totals cannot carry.

   It is a record, not an input. applyStory does not read it and no number in
   the app moves because of it. That is deliberate: the claim it encodes is
   not measured yet, and an unmeasured claim must not reach the arithmetic.
   ============================================================ */

/* Where a named charge sits. Mirrors CHG2SEAT, which is the app's existing
   answer, lowercased to the seat keys the artwork uses. Three charges have no
   entry there: silence and doubt are routed the way CHG2FET already routes
   them, through apathy and shock. joy is coherent and places nothing. */
var PATHSEAT={fear:'root',anger:'solar',shame:'sacral',disgust:'sacral',
 apathy:'throat',shock:'eye',sadness:'heart',grief:'heart',surprise:'heart',
 anticipation:'solar',anxiety:'solar',pride:'crown',guilt:'sacral',
 craving:'sacral',separation:'crown',silence:'throat',doubt:'eye',joy:null};
var PATHMAX=28;                       /* the largest charged amount in LEX */

/* Match precedence, and the reason it is written down rather than inherited.
   scanStory adds phrases, then LEX words, then adjectives, and sorts by
   offset. Sort is stable, so equal offsets keep that insertion order, which
   means the route silently depended on the order of three loops. Stating the
   precedence here makes the path a property of the text instead. */
var PATHRANK={phrase:0, word:1, adj:2};

function seatOf(h){
 if(h.kind==='adj') return PATHSEAT[h.charge]||null;
 if(!h.band||h.band==='coherent') return null;
 return K2BAND[h.band]?h.band:null;}

/* A step is a word occurrence, not a lexicon match. One word can match a
   phrase, a LEX entry and an adjective at once, and those are the same event
   in the body, not three. The occurrence keeps every seat it names, primary
   first, because a word reaching two places is the thing being recorded. */
function pathOf(hits){
 var byAt={}, order=[];
 hits.forEach(function(h){
  if(byAt[h.at]===undefined){byAt[h.at]=[];order.push(h.at);}
  byAt[h.at].push(h);});
 order.sort(function(a,b){return a-b;});

 var steps=order.map(function(at,i){
  var g=byAt[at].slice().sort(function(a,b){
   var r=PATHRANK[a.kind]-PATHRANK[b.kind];
   if(r)return r;
   return String(a.t)<String(b.t)?-1:String(a.t)>String(b.t)?1:0;});
  var seats=[], seen={};
  g.forEach(function(h){var k=seatOf(h);
   if(k&&!seen[k]){seen[k]=1;seats.push(k);}});
  /* the amount comes from whichever match carries one. an adjective names the
     charge without scoring it, and reading that as zero made the adjective the
     minimum of every path it appeared in. */
  var scored=g.filter(function(h){return h.amt!=null;});
  var amt=scored.length?scored.reduce(function(a,h){
   return Math.abs(h.amt)>Math.abs(a)?h.amt:a;},scored[0].amt):null;
  var k=seats[0]||null, xy=k?SEATXY[k]:null;
  return {i:i, at:at, word:g[0].t, kind:g[0].kind,
   seat:k, band:k?K2BAND[k]:null, seats:seats,
   x:xy?xy.x:null, y:xy?xy.y:null,
   amt:amt, depth:amt!=null?clamp(amt/PATHMAX,0,1):null,
   coherent:g.some(function(h){return h.band==='coherent';})};});

 var on=steps.filter(function(s){return s.seat;});
 var sc=on.filter(function(s){return s.amt!=null;});
 var span=0, net=0, drop=0, rise=0, dwell=null, kink=null, floor=null;
 if(on.length){
  for(var j=1;j<on.length;j++){
   var dx=on[j].x-on[j-1].x, dy=on[j].y-on[j-1].y;
   span+=Math.sqrt(dx*dx+dy*dy);
   if(dy>drop)drop=dy; if(dy<rise)rise=dy;}
  net=on[on.length-1].y-on[0].y;      /* positive is downward, toward root */
  var tal={};on.forEach(function(s){tal[s.seat]=(tal[s.seat]||0)+1;});
  dwell=on.reduce(function(a,s){return tal[s.seat]>tal[a]?s.seat:a;},on[0].seat);}
 /* The kink. parseStory sorts by susceptibility and takes the top, which is to
    say the app already assumed the block sits at the highest charge. Nobody
    ruled that. Both ends are reported so it can be ruled from data rather than
    from a sort order. */
 if(sc.length){
  kink =sc.reduce(function(a,s){return s.amt>a.amt?s:a;},sc[0]);
  floor=sc.reduce(function(a,s){return s.amt<a.amt?s:a;},sc[0]);}

 function end(s){return s?{seat:s.seat,word:s.word,amt:s.amt,i:s.i}:null;}
 return {steps:steps, located:on.length, scored:sc.length,
  span:Math.round(span*100)/100, net:Math.round(net*100)/100,
  drop:Math.round(drop*100)/100, rise:Math.round(rise*100)/100,
  dwell:dwell, start:on.length?on[0].seat:null, end:on.length?on[on.length-1].seat:null,
  kink:end(kink), floor:end(floor)};}

function parseStory(text){
 /* WHAT COUNTS, AND WHAT IS KEPT BESIDE IT, S1. A hit said with a no goes to
    denied and nowhere else, so it reaches no band, charge, weight, named
    fetter, imprint or path, and every reader of hits below and of this
    result's hits sees only what counts. It is kept, not erased: marksOf
    draws it struck and the Story page names it. */
 var all=scanStory(text), hits=[], denied=[], others=[], byBand={}, byChg={}, imprints=[];
 /* AND A HIT ABOUT SOMEONE ELSE GOES TO others, S2, by the same rule: kept,
    listed, and counted nowhere. A denied hit is never also in others. */
 all.forEach(function(h){(h.neg?denied:h.other?others:hits).push(h);});
 hits.forEach(function(h){
  if(h.band&&h.band!=='coherent'){ byBand[h.band]=(byBand[h.band]||0)+h.amt; }
  if(h.charge){ byChg[h.charge]=(byChg[h.charge]||0)+1; }});
 var wanted={}; Object.keys(byChg).forEach(function(c){var f=CHG2FET[c]; if(f)wanted[f]=true;});
 /* a word that names its own fetter is as named as an adjective that maps to
    one, so it counts toward wanted and stops the reading being inferred. */
 /* AND A STATED FETTER IS STATED AT THE SEAT ITS WORD SITS AT, round GR. It
    was one flag for the whole text, so a fetter stated anywhere let every seat
    skip the quarter rule. Measured on 27 September: "I am exhausted. My father
    died." filed the bereavement at the heart as stated Apathy, and once the
    shame family stated Shame, "my father died and I feel ashamed" routed the
    heart onto its one Shame address, which is the grief filed as shame the
    quarter rule was written to stop. So each seat now asks only what was
    stated at that seat, heaviest first. A seat nothing stated at is read by
    the quarter rule exactly as before. */
 var statedAt={};
 hits.forEach(function(h){ if(h.fet){ wanted[h.fet]=true;
  if(h.band){ var sa=statedAt[h.band]=statedAt[h.band]||{};
   sa[h.fet]=(sa[h.fet]||0)+Math.abs(h.amt||0); } } });
 var anyNamed=Object.keys(wanted).length>0;
 Object.keys(byBand).forEach(function(k){
  var bn=K2BAND[k]; if(!bn) return;
  var all=W.filter(function(n){return n.b===bn&&n.cf;});
  /* Band says WHERE, the adjective says WHAT. But a named fetter only governs
     a band it actually occupies. The original accepted any non-empty match, so
     one Shame address at the heart was enough to route the whole heart band --
     including everything the despair idioms carried -- onto Shame, and grief
     was filed as shame. A named fetter now has to hold at least a quarter of
     the band, otherwise the band's own modal child emotion is the better read. */
  var seg=anyNamed? all.filter(function(n){return wanted[n.cf];}) : [];
  /* DID THE TEXT NAME THIS, OR DID WE INFER IT? The answer decides what the
     product is allowed to SAY, and until now it said the same thing either
     way, which is how the worst readings in the instrument were produced.

     Measured. "Partner cut me out of the deal" told the person they were
     carrying Deceit, Lying, Excuse and Spiritual Language To Manipulate: the
     person was wronged and the instrument accused them of lying. "My father
     died last year" returned Separation, Martyrdom, Longing and Closed Heart,
     and Martyrdom on a bereavement is not a reading, it is an insult. "I am
     exhausted" returned Pride, Arrogance and Competition.

     None of those words was in the sentence. What the scan actually knew was
     a seat and an intensity. The fallback below then took the seat's modal
     fetter, sorted its addresses by susceptibility and named the first four,
     which is arithmetic presented as a finding about somebody's character.

     The charge still lands, because the body map needs a place to put it and
     the seat is genuinely known. What changes is that the imprint says so.
     Anything rendering a name now has to ask whether the text named it. */
  var named=seg.length>0;
  /* A STATED FETTER SURVIVES A SEAT THAT CANNOT HOUSE IT. The quarter rule
     below exists to stop one stray address dragging a whole band onto the
     wrong reading, and it is right for a fetter that was inferred. A fetter
     the person's own word named is different: exhaustion states Apathy and the
     solar plexus has no Apathy address, so the quarter rule would discard the
     one thing the sentence actually said and fall back to Anger. The charge
     still lands on the seat, because that is where the body holds it, and the
     reading keeps the name the word gave it. */
  var here=statedAt[k]||{};
  var hereF=Object.keys(here).sort(function(a,b){return here[b]-here[a];});
  var stateHere=hereF.length>0;
  if(stateHere&&!seg.length){
   imprints.push({node:all[0]?all[0].i:null, name:all[0]?all[0].k:'', band:bn,
    fetter:hereF[0], inferred:false, stated:true,
    amt:Math.round(Math.min(10,byBand[k]/3)*10)/10, from:k});
   return;}
  if(seg.length < all.length*0.25 && !stateHere){
   named=false;
   var tally={}; all.forEach(function(n){tally[n.cf]=(tally[n.cf]||0)+1;});
   var modal=Object.keys(tally).sort(function(a,b){return tally[b]-tally[a];})[0];
   var mseg=all.filter(function(n){return n.cf===modal;});
   /* keep whichever reading is better represented at this seat */
   if(mseg.length>seg.length) seg=mseg;
   if(!seg.length) seg=all;}
  seg=seg.sort(function(a,b){return (b.susc||1)-(a.susc||1);});
  if(!seg.length) return;
  /* the intensity curve is 0-30ish. normalise to a 0-10 charge delta. */
  var total=Math.min(10,byBand[k]/3), share=total/Math.min(4,seg.length);
  seg.slice(0,4).forEach(function(n){
   imprints.push({node:n.i, name:n.k, band:bn, fetter:n.cf,
    /* inferred: the seat was read, the address was chosen by the fallback and
       not by the person's words. A renderer must not print name as a finding
       when this is true. */
    inferred:!named,
    amt:Math.round(share*10)/10, from:k});});});
 var nm={}; Object.keys(byChg).forEach(function(c){
  var f=CHG2FET[c]; if(f) nm[f]=(nm[f]||0)+byChg[c];});
 var named=Object.keys(nm).sort(function(a,b){return nm[b]-nm[a];});
 return {hits:hits, bands:byBand, charges:byChg, named:named, weights:nm, imprints:imprints,
  path:pathOf(hits),
  words:hits.filter(function(h){return h.kind!=='adj';}).length,
  denied:denied, others:others};}
/* ============================================================
   THE MARKS. Every hit, placed back on the letters a person typed.

   One reading of the sentence. The scanner's own offsets, mapped through the
   same normalisation it scanned, so a mark lands on exactly the characters that
   were scored and nothing re-matches anything.

   It carries what the engine knows and the page had no way to see: the seat, the
   band the seat belongs to, the amount, the fetter the word names, the charge an
   adjective names, the phrase's label, and whether the hit is coherent. The
   shipping highlighter filtered coherent hits out because it only wanted a seat
   colour, so the words that take charge OFF a person were invisible on the one
   surface whose whole job is to show the reading.

   One mark per stretch of text, which is the scanner's own precedence: a phrase
   outranks the words inside it and an adjective sitting on the same word as a
   placed term merges into it rather than drawing twice.

   Ported from proto/story4 unchanged in behaviour. None of the four designs'
   look comes with it: this returns data and the page decides what to draw.

   A WORD SAID WITH A NO IS STILL A MARK, S1, and it carries neg and negFrom,
   the letter its no starts on, so a page strikes it from the no without
   working negation out again. The flag is the engine's, from sniffDeny, so
   the sentence, the chart, the list and the score read one answer.
   ============================================================ */
/* EVERY HIT THE SCANNER FOUND, counted or set aside. parseStory's own hits
   are only what counts; a reader that must show or quote every word read,
   marksOf, unmarkedOf, srcHear and srcDims, asks here, so there is one
   answer to which lists make up the whole. */
function storyHits(p){
 return p?(p.hits||[]).concat(p.denied||[],p.others||[]):[];}
function marksOf(t,p){
 var all=storyHits(p);
 if(!all.length)return [];
 var nm=normMap(t), raw=[];
 all.forEach(function(h){
  if(h.at==null)return;
  var a=h.at+1, b=h.at+String(h.t).length;
  if(a>=nm.map.length||b>=nm.map.length)return;
  raw.push({s:nm.map[a], e:nm.map[b]+1, kind:h.kind, band:h.band||null,
   amt:(h.amt==null?null:h.amt), label:h.label||null, charge:h.charge||null,
   fet:h.fet||null, coh:h.band==='coherent',
   neg:!!h.neg, negFrom:(h.neg&&h.negAt!=null&&nm.map[h.negAt+1]!=null)?nm.map[h.negAt+1]:null,
   other:!!h.other, unclear:!!h.unclear,
   whoFrom:(h.other&&h.whoAt!=null&&nm.map[h.whoAt+1]!=null)?nm.map[h.whoAt+1]:null});});
 raw.sort(function(a,b){return a.s-b.s||(b.e-b.s)-(a.e-a.s);});
 var keep=[], last=-1;
 raw.forEach(function(m){
  if(m.s<last){var pv=keep[keep.length-1];
   if(pv&&m.charge&&!pv.charge)pv.charge=m.charge;
   if(pv&&m.fet&&!pv.fet)pv.fet=m.fet;
   if(pv&&m.band&&!pv.band){pv.band=m.band;pv.coh=m.coh;}
   if(pv&&m.amt!=null&&pv.amt==null)pv.amt=m.amt;
   return;}
  m.seat=(m.band&&m.band!=='coherent')?m.band:null;
  m.bn=m.seat?K2BAND[m.seat]:null;
  keep.push(m); last=m.e;});
 keep.forEach(function(m,i){m.i=i;});
 return keep;}
/* WHAT WAS READ AND NOT COUNTED, quoted in the letters the person typed, each
   stretch once. Said with a no (S1), from its no to its word. About someone
   else (S2), from the person to the word, and unclear apart from it, because
   "you" may be the writer. Off marksOf, so a quote is exactly what the page
   sets aside. */
function asideOf(t,p){
 t=String(t||'');
 var out={denied:[],others:[],unclear:[]};
 marksOf(t,p).forEach(function(m){
  var l=m.neg?out.denied:m.other?(m.unclear?out.unclear:out.others):null; if(!l)return;
  var from=m.neg?m.negFrom:m.whoFrom;
  var q=t.slice(from!=null?from:m.s,m.e);
  if(l.indexOf(q)<0)l.push(q);});
 return out;}
/* THE SENTENCES, ONE COPY, for every surface that shows a story's reading,
   the way maskedSay is for hidden words. Each says what was not counted and
   why in the same sentence, the unpack ruling, in words a ten year old has,
   V21, and where the person can change it, the one thing to write. Empty
   when nothing was set aside, so a caller prints it or prints nothing. */
function asideList(q){
 q=q.map(function(x){return '“'+x+'”';});
 return q.length<3?q.join(' and '):q.slice(0,-1).join(', ')+' and '+q[q.length-1];}
function asideSay(a){
 a=a||{}; var out=[], d=a.denied||[], o=a.others||[], u=a.unclear||[];
 if(d.length)out.push(asideList(d)+(d.length===1?' is not counted, because you said no to it.'
  :' are not counted, because you said no to them.'));
 if(o.length)out.push(asideList(o)+(o.length===1?' is not counted, because it is about someone else. '
  +'Write how it landed on you, and that can be counted.'
  :' are not counted, because they are about someone else. Write how each one landed on you, and that can be counted.'));
 if(u.length)out.push(asideList(u)+(u.length===1?' is not counted, because it may not be about you. '
  +'Write it with I if it is yours.'
  :' are not counted, because they may not be about you. Write them with I if they are yours.'));
 return out.join(' ');}
/* ============================================================
   WHAT READ AS NOTHING, 20.H6. The complement of marksOf.

   The excavation document's matching order ends at NOVEL: a signal with no
   canon match is kept, not dropped. This instrument has one matcher,
   scanStory, and until now nothing said which of a person's words it
   passed over. marksOf reports what was read; this reports every stretch
   of the entry that produced no hit at all, in the letters the person
   typed, so "it read nothing" can always be answered with what it did not
   read.

   A stretch is a run of words with no mark on any of them, inside one
   clause: a mark ends it, and so does a sentence end, by wordsOf's rule. A
   word a mark touches at all is read, so a phrase's own words never come
   back here. A place word that seated a sensation, 20.H2, is read too: it
   scored nothing itself and it decided where the charge landed. A word said
   with a no is read too, S1: it was read, named and set aside, which is not
   the same as passed over, and it is still a mark.

   It is reporting and nothing else. No reading moves, nothing is scored,
   and nothing leaves the device: the count 19.D8 wants across people is
   built from this only once there is a server and a consent ruling.
   ============================================================ */
function unmarkedOf(t,p){
 t=String(t||'');
 var marks=marksOf(t,p), ws=wordsOf(t), out=[], cur=null, read=0, placed={};
 storyHits(p).forEach(function(h){if(h.placeAt!=null)placed[h.placeAt]=1;});
 ws.forEach(function(w){
  var hit=placed[w.at]||marks.some(function(m){return m.s<w.e&&m.e>w.s;});
  if(hit){read++; cur=null; return;}
  if(cur&&cur.c===w.c){cur.e=w.e; cur.words++; return;}
  cur={s:w.s, e:w.e, c:w.c, words:1}; out.push(cur);});
 out.forEach(function(r){r.text=t.slice(r.s,r.e);});
 return {stretches:out, words:ws.length, read:read, unmarked:ws.length-read};}
function applyStory(text){
 var p=parseStory(text), touched={};
 p.imprints.forEach(function(im){ var f=im.fetter; if(!f) return;
  touched[f]=(touched[f]||0)+im.amt;});
 /* an adjective sharpens which fetter; repeated mentions weigh more */
 p.named.forEach(function(f,i){ touched[f]=(touched[f]||0)+0.8/(1+i*0.5); });
 Object.keys(touched).forEach(function(f){
  S.charge[f]=clamp((S.charge[f]||0)+touched[f]*0.35,0,10);});
 /* the coherent words pull the other way */
 var calm=p.hits.filter(function(h){return h.band==='coherent';})
  .reduce(function(a,h){return a+Math.abs(h.amt);},0);
 if(calm)CHARGES.forEach(function(c){S.charge[c]=clamp(S.charge[c]-calm/140,0,10);});
 return {parsed:p, applied:touched};}

/* ============================================================
   SNIFFSTORY · THE OUTPUT CONTRACT, SNIFFER_SPEC.md SECTION 10.

   scanStory, parseStory and applyStory are untouched and keep their bodies and
   signatures, on the standing ruling. This is a new layer above them. It reads
   what they already produce and emits the shape the spec specifies, so release
   has something to consume that is not a bag of internal fields.

   offer IS THE PAYLOAD. Everything else is evidence for it. The spec is explicit
   that the sniffer's job is to end at an address with a named replacement state,
   because that is exactly what release consumes, so offer is built first in
   intent and emitted last in the object.

   BECAUSE IS ALWAYS EMITTED. Every confidence in this output carries the
   citation that produced it. A confidence with no citation is not inspectable,
   and this instrument's whole defence is that it shows its work. The gate
   asserts it on every saboteur, and it is asserted rather than trusted because
   a missing citation is invisible in a rendered panel.

   WHAT THIS LAYER DOES NOT DO, stated so nobody has to discover it:
     it does not mutate. applyStory is still the only function that mutates.
     it does not score another person. That line used to say there was no
       subject model, so every hit landed on the writer, and "he shouted at
       me" proved it broke guard 2. Since S2 parseStory holds a word whose
       clear subject is someone else in others, so nothing this layer reads
       off hits or imprints can carry it. The law path below reads its own
       copy of the text and is not yet held the same way, said there.
     it emits no clinical label. guard 1 is a translation column and never an
       equals sign, so no mode name reaches this output as a condition.
     it names no diagnosis and the gate asserts that too.
   ============================================================ */

/* THE SPEC'S COHERENT POLES AND ADDRESSES, section 2, which is the table the
   offer is built from.

   THIS DISAGREES WITH CHILD AND THE SPEC WINS, on the owner's ruling. Measured:
   4 of the 9 coherent poles differ and one address differs materially.

     Fear    spec Safety / Ground          CHILD Trust
     Anger   spec Calm / Integrated Power  CHILD Equanimity
     Apathy  spec Joy / Aliveness          CHILD Vitality
     Sad     spec Happy / Restoration      CHILD Joy

   AND THE TWO TABLES COLLIDE ON ONE WORD. The spec offers Joy at Apathy. CHILD
   offers Joy at Sad. So a person could be offered Joy for their apathy on this
   output and Joy for their sadness on every other surface in the product, which
   is one word naming two different addresses. That is not something this seat
   may settle by picking one: CHILD.opp is read by the wheel, the summary, the
   drills and the release control, and moving it moves readings on surfaces this
   pass has not measured. So the spec's table is used HERE, where the spec rules
   the contract, the disagreement is named in the output as poleDiffers, and the
   reconciliation is raised for the owner rather than performed.

   The address differs materially on one axis. Surprise: the spec puts it at the
   lower solar plexus, bilateral at the lung edges; CHILD puts it at the upper
   chest and back with the Heart seat. A somatic address is the thing this
   product points at on a body, so that is his call and not a rounding. */
/* AND THE WORD `address` MEANT TWO DIFFERENT THINGS, WHICH IS THE DEFECT THIS
   BLOCK NOW CARRIES THE FIX FOR.

   In this product an address is a row of the 112 address table: it has an
   index, a seat, a fetter and a name out of the `n` column, Lumbar Plexus and
   Cardiac Plexus and Pudendal Nerve. The spec's column above is a somatic
   REGION, in the spec's own shorthand, and the two vocabularies overlap in
   wording without being the same thing.

   So this layer emitted `address:'Inferior Cardiac'` and a reading named a
   place the product does not have. Measured before it was touched, against the
   112 names rather than argued: all NINE of the spec's regions fail the table,
   not just the one a seat noticed. The table has Cardiac Plexus, Cardiac Nerve
   Plexus and Great Cardiac Nerve and nothing called Inferior Cardiac; it has
   Lumbar Plexus and nothing called Lumbar; and Dermis, Shoulder / Throat,
   Below the heart and Lower solar plexus, bilateral at lung edges are prose
   locations that were never going to be rows.

   It is not an address missing from the table and the table is not moving for
   it. A somatic address is the thing this product points at on a body and the
   112 are the owner's, so composing a tenth from a spec shorthand is exactly
   the invention the sniffer is not allowed to make. Nor can it be derived from
   the axis: an axis spans up to six seats in the node table, so axis to seat is
   not a function and axis to address is not one either.

   WHAT IT IS DERIVED FROM INSTEAD. The reading already placed addresses on the
   body: parseStory returns imprints, each carrying a node id out of the 112 and
   the fetter that put it there. So the address an axis is offered at is the
   heaviest address that reading itself placed on that axis, resolved through
   the node table's own `n` column. It is a real row, it is the person's own
   text and not a table lookup on the axis name, and it is what release
   consumes, because release runs at an address.

   Measured after: over the 231 word lexicon as single word stories plus 33 two
   word pairs, 260 of 268 offers resolve to a real address and 8 do not, every
   one of them Apathy, which is the exhaustion case where the stated fetter is
   recovered from the hits after the imprint layer dropped it and no imprint
   carries it. Those emit a null address and say so rather than naming a place.

   The spec's words are not discarded. They move to `region`, which is what
   they are, so the spec's contract is still legible in the output and nothing
   claims to be one of the 112 that is not. */
var SPEC_POLE={
 Fear:        {addr:'Lumbar',                                      pole:'Safety / Ground'},
 Anger:       {addr:'Celiac',                                      pole:'Calm / Integrated Power'},
 Shame:       {addr:'Pudendal',                                    pole:'Worth / Self-respect'},
 Disgust:     {addr:'Sacral / Dermis',                             pole:'Acceptance / Equanimity'},
 Apathy:      {addr:'Shoulder / Throat',                           pole:'Joy / Aliveness'},
 Shock:       {addr:'Dermis',                                      pole:'Groundedness'},
 Sad:         {addr:'Inferior Cardiac',                            pole:'Happy / Restoration'},
 Surprise:    {addr:'Lower solar plexus, bilateral at lung edges', pole:'Readiness'},
 Anticipation:{addr:'Below the heart',                             pole:'Presence'}};

/* the 112 address table's own names, by node id. Built off NODES rather than
   typed, so a row renamed there renames here and the four field anchors, which
   carry no `n`, are absent rather than present as undefined. */
var NODE_ADDR={}; NODES.forEach(function(n){ if(n.n) NODE_ADDR[n.i]=n.n; });
/* THE ADDRESS AN AXIS IS OFFERED AT. The heaviest address the same reading
   already placed on that axis, resolved to the name the node table uses.
   null rather than a guess when the reading placed none. */
function axisAddr(imprints,axis){
 var best=null;
 (imprints||[]).forEach(function(im){
  if(!im||im.fetter!==axis||im.node==null||!NODE_ADDR[im.node])return;
  if(!best||im.amt>best.amt)best=im;});
 return best?NODE_ADDR[best.node]:null;}

/* RESENTMENT, AS THE COMPOSITE THE SPEC RULES IT IS.

   "Resentment mapped onto Anger collapsed Aggressor and Manipulator in
   simulation. Resentment is ruled as a composite, Anger plus Apathy, the grudge
   held. Sniff it as the composite, not as Anger."

   The shipped lexicon seats resentment at the solar plexus with no stated
   fetter, so the fetter is inferred from the seat and comes back Anger alone,
   which is exactly the mapping the spec names as the defect. The LEX row format
   holds ONE fetter, so a composite cannot be expressed in it without changing a
   schema that has other callers.

   So the composite lives here, as a table this layer applies, and the charge is
   SPLIT rather than doubled: half to each side. Doubling would let one word
   carry twice the load of any other word in the table, which is a magic number
   dressed as a composite. Split is the reading "the grudge held" actually
   describes: anger that has stopped moving.

   THE LEGACY PATH STILL READS IT AS ANGER, and that is stated rather than
   quietly half fixed. applyStory keeps its body on the standing ruling, so
   S.charge still takes resentment onto Anger alone. Moving that is a one line
   change to parseStory and it is specified in DESIGN-sniffer.md for whoever
   rules that the field should move with the contract. */
var LEXCOMP={resentment:['Anger','Apathy'], resentful:['Anger','Apathy'],
 bitter:['Anger','Apathy'], bitterness:['Anger','Apathy'], grudge:['Anger','Apathy'],
 begrudge:['Anger','Apathy'], embittered:['Anger','Apathy'],
 /* THE VERB, round QZ follow on. "I resent having to carry everyone" read
    nothing, measured, because the table held the noun and the adjective and
    not the thing a person does. These are added HERE and not to pass three's
    synonym table, because a synonym copies one fetter and this reading is
    two, and lexComposite below already seats an unseated key off its
    family's unanimous seat and floor, which is exactly what is wanted. */
 resent:['Anger','Apathy'], resents:['Anger','Apathy'], resented:['Anger','Apathy'],
 resenting:['Anger','Apathy']};

/* A COMPOSITE KEY THE SCANNER CANNOT REACH IS A DEAD ROW, and three of these
   were. Found by the gate rather than by reading: `grudge`, `begrudge` and
   `embittered` are ordinary resentment words, they were in this table, and none
   of them was in LEX, so each scored 0 and 0 while the table asserted it was a
   composite. The first cut of the gate missed it because it exercised only
   `resentful`, which IS seated. It exercises every key now.

   THE SEAT AND THE AMOUNT ARE DERIVED, not typed, by the same rule lexCanon
   already runs on: a key with no entry takes the seat its already seated family
   members share, and the FLOOR of their amounts. The floor and not the median,
   because an unseated word is the least evidenced member of its own family, and
   because a typed number in a table this load bearing is a magic number waiting
   to be questioned. Every seated member of this composite sits at the solar
   plexus, so the seat is unanimous and nothing is being chosen.

   THE STATED FETTER IS ANGER AND THAT IS NOT THE COMPOSITE CONTRADICTING
   ITSELF. LEX holds one fetter per row and the composite holds two, so the row
   states the seat's own reading and LEXCOMP does the split above it. That is
   the same division of labour the exhaustion ruling uses: the seat says where,
   the table above says what.

   IF THE SEAT IS NOT UNANIMOUS the pass refuses rather than picking, and the
   gate fails on the refusal, so it gets ruled instead of defaulted. */
function lexComposite(){
 var out={added:0,already:0,unseated:[],split:[],seat:null,amt:null};
 var seats={}, amts=[];
 Object.keys(LEXCOMP).forEach(function(k){
  var e=LEX[k];
  if(!e)return;
  out.already++;
  seats[e[LEX_SEAT]]=1;
  if(e[LEX_AMT]>0)amts.push(e[LEX_AMT]);});
 var sk=Object.keys(seats);
 if(sk.length!==1||!amts.length){
  out.split=sk;
  Object.keys(LEXCOMP).forEach(function(k){if(!LEX[k])out.unseated.push(k);});
  return out;}
 amts.sort(function(a,b){return a-b;});
 out.seat=sk[0]; out.amt=amts[0];
 Object.keys(LEXCOMP).forEach(function(k){
  if(LEX[k])return;
  var a=lexAdd(k,out.seat,out.amt,'Anger',
   {src:'composite',from:'the seated members of LEXCOMP',
    rule:'unanimous seat, family floor',cite:'canon'});
  if(a.ok&&!a.already)out.added++;
  else out.unseated.push(k);});
 return out;}
var LEXCOMPRUN=lexComposite();

/* ============================================================
   PASS FIVE, PROFANITY AND ABSTRACT DISTRESS. Recall over precision, which
   is this pass's own stated stance and the opposite of the engine's baseline.
   The owner's instruction: "make it oversensitive." A person who swears about
   their day has named distress more plainly than any clinical term. A phrase
   like "worst day" or "rough day" may land on a surface that clinical words
   miss entirely.

   PORTED BY HAND FROM THE OLD LINE, 94d328e, with its own follow up, 5ce3934,
   applied, round S0 of REVIEW-sniffer-audit-2026-10-09.md. Six of the old
   rows are not here, each for a reason the gate holds:
     fucking         a key here fills the gap the QR group holds open: stars
                     between "really" and "furious" must read differently
                     from the word typed in, and with this key they read the
                     same. fuck and fucked still carry the family.
     not okay, ok    refused by name in LEXSYN_NO (lexicon.js): "that is not
                     okay" is usually about somebody else's conduct. Only "im
                     not okay" reads, through LEXANT.
     helpless        main's synonym pass already seats it at the heart, off
                     defeated. lexAdd refuses a move, and a row here asking
                     for the root would be a row that never lands.
     falling apart   the same, at the solar plexus, off overwhelmed.
     breaking point  the same seat, solar, at 26 off overwhelmed. lexAdd keeps
                     the row it has, so a row here saying 24 would be a row
                     saying an amount the table does not hold.

   EVERY ENTRY IS AUTHORED, not derived. The seat, the amount and the optional
   fetter are chosen here and are not computed from other tables. lexAdd never
   moves an existing entry, and the gate asserts that this pass met none.

   SEATS FOLLOW THE SAME THEORY AS THE REST OF THE LEXICON. Profanity in the
   context of distress is acute frustration, which is Anger at the solar
   plexus. "Shitty" and "bitch" tilt toward shame and sit with the shame
   family lexicon.js already built at sacral and solar. Abstract distress
   phrases go where their emotional content lands: overwhelm and effortful
   struggle at solar, emotional collapse at heart, fear at root.
   ============================================================ */
var LEXPROF={
 /* PROFANITY */
 'fuck':['solar',20,'Anger'],
 'fucked':['solar',22,'Anger'],
 'fucked up':['solar',24,'Anger'],
 'shit':['solar',18],
 'shitty':['solar',20,'Shame'],
 'damn':['solar',16],
 'crap':['solar',14],
 'bullshit':['solar',22,'Anger'],
 'bastard':['solar',20,'Anger'],
 'bitch':['sacral',18,'Shame'],
 'asshole':['solar',20,'Anger'],
 /* ABSTRACT DISTRESS: general bad */
 'terrible':['solar',20],
 'awful':['solar',18],
 'horrible':['heart',20],
 'nightmare':['root',24],
 /* ABSTRACT DISTRESS: overwhelm and effortful struggle */
 'unbearable':['solar',26,'Apathy'],
 'struggling':['solar',20,'Apathy'],
 'at my breaking point':['solar',26,'Apathy'],
 'end of my rope':['solar',26,'Apathy'],
 'at my wits end':['solar',22,'Apathy'],
 'wits end':['solar',22,'Apathy'],
 'cant take it':['solar',24,'Apathy'],
 'cannot take it':['solar',24,'Apathy'],
 'can not take it':['solar',24,'Apathy'],
 'cant take this':['solar',24,'Apathy'],
 'cannot take this':['solar',24,'Apathy'],
 'cant do this anymore':['solar',24,'Apathy'],
 'cannot do this anymore':['solar',24,'Apathy'],
 'had enough':['solar',18],
 'have had enough':['solar',20],
 'over it':['solar',16],
 'done with this':['solar',16],
 /* ABSTRACT DISTRESS: emotional collapse */
 'breaking down':['heart',22],
 'broken down':['heart',22],
 'losing it':['solar',24,'Anger'],
 'losing my mind':['eye',24],
 'going crazy':['solar',22],
 'messed up':['solar',20,'Anger'],
 /* ABSTRACT DISTRESS: bad day phrases */
 'bad day':['solar',14],
 'rough day':['solar',16],
 'hard day':['solar',16],
 'tough day':['solar',16],
 'awful day':['solar',20],
 'horrible day':['solar',20],
 'terrible day':['solar',22],
 'shitty day':['solar',22],
 'worst day':['solar',24],
 'worst day ever':['solar',26],
 'worst day of my life':['solar',28],
 'fucked up day':['solar',24,'Anger']};
function lexProf(){
 var out={added:0,already:0,refused:[]};
 Object.keys(LEXPROF).forEach(function(k){
  var e=LEXPROF[k];
  var a=lexAdd(k,e[0],e[1],e[2]!=null?e[2]:null,
   {src:'authored',from:'LEXPROF profanity and abstract distress',
    rule:'recall over precision, oversensitive by design',cite:'owner'});
  if(a.ok&&!a.already)out.added++;
  else if(a.ok&&a.already)out.already++;
  else out.refused.push(k+': '+(a.why||'unknown'));});
 return out;}
var LEXPROFRUN=lexProf();

/* ============================================================
   THE LEXICON VERSION, 19.B6. Every story entry is stamped with the
   lexicon that read it, so reading it again later is reproducible, or at
   least knowably not.

   The atom layer re-parses stored entries under today's tables, and an
   entry stores what it was told at the time, its imprint count and seat
   totals, and never re-derives them. Those two disagree the moment the
   lexicon moves, and nothing could say whether a given entry was read by
   this lexicon or an older one. 20.H2 moves readings, so it is the first
   change that needs this, and is why it lands first.

   THE VERSION IS A HASH OF THE TABLES, NOT A NUMBER TYPED HERE. A typed
   version is bumped by whoever remembers, which is the typed number
   failure CLAUDE.md records again and again. This is computed at load, after
   the canon, fold and composite passes have finished writing, over every
   table the scanner reads a match, an amount or a seat from: LEX, ADJ2CHG,
   PHRASES, LEXMOD and the place word tables, the blocking places included,
   because adding one can stop a move. A word added, an amount
   retuned or a seat moved changes it, and nothing else does.

   WHAT IT DOES NOT COVER, said so nobody has to discover it: a change to
   scanStory's or parseStory's own rules with no change to a table moves no
   table, so it does not move this. S1 and S2 of the 9 October sniffer audit
   are such changes: an entry committed before them reads again with its
   denied and someone else's words left out, under the same stamp. The node table W is not the lexicon and
   is not in it either. Same version means the same words land the same
   way; it does not promise the same addresses.

   FNV-1a, 32 bits, over a canonical JSON with object keys sorted, so key
   insertion order cannot move it and the browser and node agree. */
var LEXV_RE=/^lx[0-9a-f]{8}$/;
function lexCanonJSON(v){
 if(Array.isArray(v))return '['+v.map(lexCanonJSON).join(',')+']';
 if(v&&typeof v==='object')return '{'+Object.keys(v).sort().map(function(k){
  return JSON.stringify(k)+':'+lexCanonJSON(v[k]);}).join(',')+'}';
 return JSON.stringify(v===undefined?null:v);}
function lexVersion(){
 var s=[LEX,ADJ2CHG,PHRASES,LEXMOD,SOMA_PLACE.sense,SOMA_PLACE.seat,SOMA_PLACE_WORDS]
  .map(lexCanonJSON).join('|');
 var h=0x811c9dc5;
 for(var i=0;i<s.length;i++){h^=s.charCodeAt(i); h=Math.imul(h,0x01000193)>>>0;}
 return 'lx'+('0000000'+h.toString(16)).slice(-8);}
var LEX_VERSION=lexVersion();

/* ---------- the shared matcher ----------
   ONE SCANNER FOR EVERY PHRASE TABLE IN THIS LAYER, with the two rules the rest
   of the engine already learned the expensive way.

   PRECEDENCE. Longest first, and a longer match blocks the shorter ones inside
   it, which is scanStory's rule and the reason 'let them think' beats 'let
   them' in the lean. Without it, a table containing both 'not my fault' and 'my
   fault' reads a denial as an admission.

   NEGATION. A match is void if a negator stands within the three words directly
   before it. Ported from verp.js, including its width and its reason: three is
   one clause of run up, and wider voids phrases whose negator belonged to the
   previous sentence. Without it "i did not lie to them" fires Truth, which is
   the instrument accusing a person of the thing they just denied.

   THE SENTENCE BOUNDARY WAS NOT PORTED WITH IT, and a width limit alone does
   not stand in for one: "I was not around. I hid it from everyone" strips its
   period to a plain space and reads as "not around i hid it", three words
   exactly, so "not" from the first sentence voided an admission in the
   second. Measured directly: lawNegated returned true on that pair before
   this fix. lawNorm now turns sentence-ending punctuation into a literal
   '|' the way verp.js's leanNorm already does, and lawNegated stops its
   look back at one, the one piece of leanNegated that was not ported the
   first time.

   This is the single biggest known weakness of the law table and it is handled
   here rather than left. It is still not subject handling: "she lied to me"
   fires Truth on the writer, and that is guard 2's problem, named in
   DESIGN-sniffer.md and not solved by this pass.

   STILL OPEN AFTER S2, AND WHY IT WAS NOT CLOSED WITH THE SAME READER. The
   story path holds someone else's words since S2 (sniffWho, above scanStory).
   This path matches on lawNorm's own copy, which puts a '|' at every sentence
   end, so its offsets are not normMap's and wordsOf cannot be laid over them
   without a second offset map. Building that map is a new reader of the text,
   which is the risk the review said not to take for alpha. The gap is named in
   TDD-sniffer.md and is held there, not here. */
var LAW_NEG=['not','no','never','nobody','none','cannot','cant','did',
 'didnt','dont','wont','wasnt','isnt','havent','hasnt','couldnt','wouldnt','refuse','refused'];
var LAW_NEG_W=3;
function lawNorm(text){
 return ' '+String(text||'').toLowerCase()
  .replace(/[.!?;:\n\r]+/g,' | ')
  .replace(/[^a-z'| ]+/g,' ').replace(/'/g,'').replace(/\s+/g,' ')+' ';}
function lawNegated(src,at){
 var pre=src.slice(0,at).split(' ');
 for(var i=pre.length-1,n=0;i>=0&&n<LAW_NEG_W;i--){
  if(!pre[i])continue;
  if(pre[i]==='|')return false;
  if(LAW_NEG.indexOf(pre[i])>=0)return true;
  n++;}
 return false;}
/* every cue from every row, longest first, bounded by spaces, a longer match
   blocking the shorter ones inside it. returns one entry per surviving hit. */
function lawMatch(src,rows,cueAt){
 var all=[];
 rows.forEach(function(r,ri){r[cueAt].forEach(function(c){all.push({c:c,ri:ri});});});
 all.sort(function(a,b){return b.c.length-a.c.length;});
 var taken=[], out=[];
 all.forEach(function(x){
  var needle=' '+x.c.replace(/'/g,'')+' ', at=src.indexOf(needle);
  while(at>=0){
   var hi=at+needle.length-1;
   if(!taken.some(function(t){return at<t.hi&&hi>t.at;})&&!lawNegated(src,at)){
    taken.push({at:at,hi:hi});
    out.push({row:rows[x.ri],ri:x.ri,cue:x.c,at:at});}
   at=src.indexOf(needle,at+1);}});
 return out.sort(function(a,b){return a.at-b.at;});}

/* ---------- axes · two readings, never one signed number ----------
   Guard 3. The shadow load and the coherent load are built in two separate
   passes over the same hits and never subtracted from one another, because a
   person can hold real Safety in one context and real Fear in another and one
   signed number cannot say that.

   The shadow comes off the seat totals parseStory already computes, mapped to
   the axis through the fetter the hit names. The coherent comes off the hits
   seated at `coherent`, which is the lexicon's own eighth seat for words that
   pull the other way. Both are normalised to 0 through 10 by the same divisor
   parseStory uses, so the two numbers are on one scale even though they are
   independent. */
function sniffAxes(p){
 var shadow={}, coh=0, cited={};
 CHARGES.forEach(function(c){shadow[c]=0;});
 /* a hit that states its fetter states its axis. one that does not is routed
    through the seat's reading, which parseStory has already resolved into
    imprints, so this does not re-derive it and cannot disagree with it. */
 p.imprints.forEach(function(im){
  if(!im.fetter||shadow[im.fetter]===undefined)return;
  shadow[im.fetter]+=im.amt;
  (cited[im.fetter]=cited[im.fetter]||[]).push(
   im.stated?'the text named '+im.fetter.toLowerCase():
   im.inferred?'read from the '+im.band+' seat, no address named':
   'at '+im.name);});
 /* A STATED FETTER THAT parseStory DROPPED, RECOVERED. Measured, and it is the
    reason this block exists rather than trusting the imprints alone.

    "i am angry and exhausted" returned Anger 10 and Apathy 0. The owner's
    exhaustion ruling is that exhaustion sits at the solar plexus and is NOT
    anger, and parseStory honours that through its stateHere branch, but that
    branch only runs when the seat has NO address for any wanted fetter. Here
    `angry` puts Anger in wanted, the solar plexus carries ten Anger addresses,
    so seg is non empty, the branch is skipped and the one thing the sentence
    actually said about apathy is discarded. The same happens to every stated
    fetter whose seat is shared with a co-occurring axis.

    parseStory keeps its body on the standing ruling, so this is repaired here
    and only where it was dropped: a stated fetter that no imprint carries is
    added at the floor of what the hit itself scored. A fetter the imprints DID
    carry is left alone, so nothing is counted twice. The one line change to
    parseStory that would fix it at source is written down in DESIGN-sniffer.md
    for whoever rules on it. */
 var carried={};
 p.imprints.forEach(function(im){if(im.fetter)carried[im.fetter]=1;});
 p.hits.forEach(function(h){
  if(!h.fet||carried[h.fet]||shadow[h.fet]===undefined)return;
  shadow[h.fet]+=Math.abs(h.amt||0)/3;
  (cited[h.fet]=cited[h.fet]||[]).push('"'+h.t+'" states '+h.fet+
   ', and its seat is shared with another axis so the imprint layer dropped it');});
 /* the composite. resentment is anger that has stopped moving, so it splits. */
 p.hits.forEach(function(h){
  var comp=LEXCOMP[h.t];
  if(!comp)return;
  var each=Math.abs(h.amt||0)/3/comp.length;
  comp.forEach(function(f){
   if(shadow[f]===undefined)return;
   shadow[f]+=each;
   (cited[f]=cited[f]||[]).push('"'+h.t+'" is the composite Anger and Apathy, split');});});
 p.hits.forEach(function(h){if(h.band==='coherent')coh+=Math.abs(h.amt||0);});
 /* A DENIED WORD IS EVIDENCE OF NOTHING, AND IS STILL CITED, S1. p.hits are
    only what counts, so no denied word reaches a shadow above. An axis the
    text named and said no to is not "nothing reached it": it was read and
    set aside, and its because says so with the person's own words. */
 var said={}, theirs={};
 (p.denied||[]).forEach(function(h){
  var f=h.fet||(h.charge?CHG2FET[h.charge]:null); if(!f||shadow[f]===undefined)return;
  var q='"'+(h.negw?h.negw+' ':'')+h.t+'"', l=said[f]=said[f]||[];
  if(l.indexOf(q)<0)l.push(q);});
 /* and the same for a word about someone else, S2: read, held, cited */
 (p.others||[]).forEach(function(h){
  var f=h.fet||(h.charge?CHG2FET[h.charge]:null); if(!f||shadow[f]===undefined)return;
  var q='"'+h.t+'" said of '+(h.who||'someone else'), l=theirs[f]=theirs[f]||[];
  if(l.indexOf(q)<0)l.push(q);});
 var out=[];
 CHARGES.forEach(function(c){
  var s=Math.round(Math.min(10,shadow[c])*10)/10;
  /* the coherent load is not apportioned per axis, because the lexicon's
     coherent seat does not say WHICH axis a calm word answers. So it is
     reported as one field level reading on every axis and says so, rather
     than being split nine ways by an assumption nobody made. */
  var k=Math.round(Math.min(10,coh/3)*10)/10;
  out.push({axis:c, shadow:s, coherent:k,
   /* a row of the 112, off this reading's own imprints, or null. The spec's
      somatic region keeps its words beside it under its own name. */
   address:axisAddr(p.imprints,c),
   region:SPEC_POLE[c]?SPEC_POLE[c].addr:null,
   because: s>0?(cited[c]||[]).slice(0,3)
    :said[c]?['the text said no to it, '+said[c].slice(0,3).join(' and ')+', so nothing is counted']
    :theirs[c]?['the text gives it to someone else, '+theirs[c].slice(0,3).join(' and ')+', so nothing is counted on the writer']
    :['nothing in the text reached this axis'],
   coherentBecause: k>0
    ?['the text carries '+k+' of coherent language, not apportioned by axis']
    :['no coherent language in the text'],
   /* named against inferred, carried up from the imprints, because it decides
      what a renderer is allowed to print as a finding. */
   named:(cited[c]||[]).some(function(w){return w.indexOf('named')===0||w.indexOf('the text named')===0;})});});
 return out;}

/* ---------- saboteurs · ranked confidence, no boolean firing set ----------
   THERE IS NO FIRING THRESHOLD HERE AND THAT IS DELIBERATE. The first
   measurement of the ramp put it BEHIND a hard floor at 0.6 and it scored
   WORSE than the staircase it replaced, 54.4 against 58.8 on set agreement. The
   finding is that a ramp inside the membership buys nothing while the OUTPUT is
   still a cliff: the edge moved from the band to the floor.

   So the output is a ranked list with a confidence on every row and nothing is
   discarded by a line. SAB_SHOW bounds what is RENDERED, which is a display
   decision a renderer may change, and not a claim that row 4 is absent.

   Measured on the ported bands, proto/sniffer/ramp.js and cohort.js:
     resolution   the largest move in confidence one tenth of a point of input
                  can cause falls from 0.5000 to 0.0375. thirteen times finer.
     steadiness   mean absolute move in confidence under an off by one reading
                  falls 9 to 15 percent.
     set agree    a dead tie, 51.4 against 51.4 on the 14 stated profiles. the
                  ramp helps Ana, Derek and Marcus and hurts James, Nkem and
                  Wren. It redistributes stability, it does not add it, and
                  saying otherwise would be inheriting a number.

   THIS SEAT COULD NOT REPRODUCE THE SPEC'S 94 AND 73. Those need the cohort
   they were measured on, and it is not in this repository. What is reported
   above is what this seat can stand behind with its definition stated. */
var SAB_SHOW=6;
function sniffSaboteurs(axes){
 var L={}, F={Fear:'fear',Anger:'anger',Shame:'shame',Disgust:'disgust',Apathy:'apathy',
  Shock:'shock',Sad:'sadness',Surprise:'surprise',Anticipation:'anticipation'};
 axes.forEach(function(a){L[F[a.axis]||String(a.axis).toLowerCase()]=a.shadow;});
 var out=[];
 SAB33.forEach(function(row,i){
  var nm=row[0], parts=row[1], conf=sabConfidence(nm,parts,L);
  if(conf<=0)return;
  /* THE CITATION, and it is the whole reason this row is inspectable. Every
     part says its level, its band, where in the band it sat, and what the
     membership came out as, so a person can see why and a reviewer can see
     where it is wrong. */
  var because=parts.map(function(p){
   var lvl=Math.round((L[p[0]]||0)*10)/10, m=sabMember(lvl,p[1],p[2]);
   var where=lvl<p[1]?'under the band':lvl>p[2]?'over the band':'in the band';
   return AXOF(p[0])+' '+lvl+' '+where+' '+p[1]+' to '+p[2]+
    ', ramp '+(Math.round(m*100)/100);});
  var w=sabWeight(nm,parts);
  if(w!==1)because.push(parts.length===1
   ?'one child emotion only, so the claim is the least specific in the table and is held at '+w
   :'held at '+w+' on the ruling that this row fires on everything');
  out.push({id:'S'+String(i+1<10?'0':'')+(i+1), name:nm,
   confidence:Math.round(conf*100)/100, because:because, weight:w,
   fetters:parts.map(function(p){return AXOF(p[0]);})});});
 out.sort(function(a,b){return b.confidence-a.confidence||
  (a.name<b.name?-1:a.name>b.name?1:0);});
 return out;}
function AXOF(k){return {fear:'Fear',anger:'Anger',shame:'Shame',disgust:'Disgust',
 apathy:'Apathy',shock:'Shock',sadness:'Sad',surprise:'Surprise',
 anticipation:'Anticipation'}[k]||k;}

/* ---------- laws · with the direction on the four that need it ----------
   The score is the violation load, 0 through 10, and it is a COUNT scaled and
   clamped rather than a model, which is what the evidence supports. Two cues is
   not twice the violation of one, so it is a diminishing curve: the first cue
   carries most of the reading and the tenth carries almost none. The shape is
   the same asymptote verp.js uses for its trust ramp, for the same reason, that
   a handful of substring matches must not buy certainty. */
function sniffLaws(text){
 var src=lawNorm(text), hits=lawMatch(src,LAWCUE,3), by={};
 hits.forEach(function(h){
  var r=h.row, key=r[0]+'|'+r[2];
  if(!by[key])by[key]={e:r[0],law:r[1],direction:r[2],n:0,cues:[]};
  by[key].n++;
  if(by[key].cues.indexOf(h.cue)<0)by[key].cues.push(h.cue);});
 return Object.keys(by).map(function(k){
  var v=by[k];
  var score=Math.round(10*(v.n/(v.n+2))*10)/10;
  var vio=LAWVIO[v.law]?LAWVIO[v.law][v.direction]||LAWVIO[v.law].single:null;
  return {e:v.e, law:v.law, violation:vio, score:score,
   direction:v.direction===LAW_ONE?null:v.direction,
   because:v.cues.slice(0,3).map(function(c){return '"'+c+'" in the text';})
    .concat(v.direction!==LAW_ONE
     ?['read in the '+v.direction+' direction, which the spec rules is the half a one sided reader misses']
     :[])};})
  .sort(function(a,b){return b.score-a.score||a.e-b.e;});}
/* the violation reading per law, the spec's own strings from section 6, and both
   readings on the four it rules bidirectional. */
var LAWVIO={
 Truth:{single:'Deception'}, Transparency:{single:'Opacity'}, Unity:{single:'Division'},
 Awareness:{single:'Reactivity'}, Presence:{single:'Absence'}, Equanimity:{single:'Volatility'},
 Compassion:{other:'Indifference', self:'Self-abandonment'},
 Forgiveness:{single:'Resentment'}, Courage:{single:'Avoidance'},
 Temperance:{single:'Overindulgence'}, Duty:{single:'Betrayal'},
 Ownership:{other:'Justification outward', self:'Victimhood inward'},
 Justice:{single:'Corruption'}, 'Non-Harm':{single:'Cruelty and carelessness'},
 Wisdom:{single:'Folly and sophistry'},
 Humility:{other:'Pride and grandiosity', self:'Self-abasement'},
 Generosity:{other:'Hoarding on giving', self:'Entitlement on receiving'},
 Detachment:{single:'Attachment'}, Patience:{single:'Forcing or scattering'},
 'Aesthetic Beauty':{single:'Chaos'}, Nature:{single:'Synthetic departure'}};

/* ---------- flow · expression only, and the two empty lenses say why ---------- */
function sniffFlow(text){
 var src=lawNorm(text), hits=lawMatch(src,EXPRCUE,3), by={};
 hits.forEach(function(h){var r=h.row;
  if(!by[r[0]])by[r[0]]={e:r[0],law:r[1],shadow:r[2],cues:[]};
  if(by[r[0]].cues.indexOf(h.cue)<0)by[r[0]].cues.push(h.cue);});
 var expr=Object.keys(by).map(function(k){var v=by[k];
  return {e:v.e, law:v.law, shadow:v.shadow,
   because:v.cues.slice(0,3).map(function(c){return '"'+c+'" in the text';})};});
 /* NOT ZERO, UNREADABLE, and the difference matters. An empty array with no
    explanation reads as "nothing violated". These two lenses are 28 of the
    spec's 76 slots and the file that carries their shadow strings is not in
    this repository, so the honest answer is that they were not read. */
 return {nature:[], human:[], expression:expr,
  unread:['nature','human'],
  because:['the 13 nature and 15 human nature elements were not read, and are not '+
   'reported as clean. Their shadow strings are in reviews/elements.json, which is '+
   'not in this repository']};}

/* ---------- gates · two upstream feeding one sump ----------
   Section 8, and it is ruled that this is not three peers.

       Aware / Ignorant   --+
                            +--> Intentional / Avoidant   the sump
       Detached / Attached--+

   THE CASCADE IS FITTED TO HIS OWN THREE NUMBERS AND NOT TO A CURVE THIS SEAT
   PREFERRED. The spec measures avoidance at 14.5 percent with both upstream
   clean, 43.2 with one distorted and 71.9 with both. Those three points are
   exactly linear: 43.2 minus 14.5 is 28.7, and 71.9 minus 43.2 is 28.7 to the
   tenth. So the cascade has a base and one step, both read straight off his
   measurement, and there is no third parameter to tune.

       avoidance = 14.5 + 28.7 x (aware distortion + detached distortion)

   with each distortion 0 through 1. It reproduces all three of his points
   exactly and generalises to the continuous case, which is what a story gives.

   GUARD 5 IS STRUCTURAL HERE, not advisory. "An avoidance number shown alone is
   a readout of everything upstream, not a trait. Show the upstream state with
   it or it reads as a character flaw." So avoidance is not a bare number on
   this object: it sits inside `intentional` next to the two upstream readings
   that produced it and a because that names them. A renderer that prints the
   number has the upstream state in its hand and cannot avoid having been given
   it. That is as far as an engine can enforce a rendering rule. */
var GATE_BASE=14.5, GATE_STEP=28.7;
function sniffGates(text){
 var s=(typeof verpScan==='function')?verpScan(text):{hits:{},total:0};
 var h=s.hits||{};
 function side(up,down){
  var u=h[up]||0, d=h[down]||0, n=u+d;
  return {clean:n?u/n:null, distortion:n?d/n:null, n:n, read:n>0};}
 var aware=side('aware','ignore'), det=side('detach','attach');
 /* no evidence is not a clean reading. with nothing matched the upstream is
    unread and the cascade is not run, because running it on assumed zeros
    would report 14.5 percent avoidance to somebody who wrote nothing about it. */
 var read=aware.read&&det.read;
 var dist=read?(aware.distortion+det.distortion):null;
 return {
  aware:    aware.read?Math.round(aware.clean*100)/100:null,
  detached: det.read  ?Math.round(det.clean  *100)/100:null,
  intentional: read?{
   avoidance:Math.round((GATE_BASE+GATE_STEP*dist)*10)/10,
   of:100,
   upstream:{aware:Math.round(aware.clean*100)/100,
             detached:Math.round(det.clean*100)/100},
   because:['aware against ignorant read '+aware.n+' cues, '+
             Math.round(aware.distortion*100)+' of 100 distorted',
            'detached against attached read '+det.n+' cues, '+
             Math.round(det.distortion*100)+' of 100 distorted',
            'the sump is 14.5 of 100 with both upstream clean and rises 28.7 '+
             'for each one distorted, which is his measured cascade']}:null,
  read:read, cues:s.total,
  because:read?['both upstream gates were read from the text']
   :['the text matched '+s.total+' gate cues. The sump is not computed '+
     'without both upstream readings. Assuming them clean would report '+
     'an avoidance number nobody entered']};}

/* ---------- depth · Dante, and null rather than a guess ----------
   The C8 test is implemented as a test because the spec calls it one: warmth
   that requires an audience. A giving marker and a display marker inside one
   sentence's reach of each other. Everything else is a thin phrase table or an
   empty one, and four of the nine circles are empty and reported so.

   depth returns null when nothing reads. A depth reading is the heaviest thing
   in this output and a low confidence guess at it is worse than no reading,
   because a person told they are in the eighth circle on two matched substrings
   has been handed a verdict the instrument cannot support. */
function sniffDepth(text){
 var src=lawNorm(text), best=null, why=[];
 /* the C8 test first, because it outranks a word list: it is a relation
    between two markers rather than the presence of one. */
 var give=[], aud=[];
 C8_GIVE.forEach(function(c){var at=src.indexOf(' '+c+' ');
  while(at>=0){if(!lawNegated(src,at))give.push(at);at=src.indexOf(' '+c+' ',at+1);}});
 C8_AUDIENCE.forEach(function(c){var at=src.indexOf(' '+c+' ');
  while(at>=0){aud.push(at);at=src.indexOf(' '+c+' ',at+1);}});
 if(give.length&&aud.length){
  var near=give.some(function(g){return aud.some(function(a){
   return Math.abs(src.slice(Math.min(g,a),Math.max(g,a)).split(' ').length)<=C8_WINDOW;});});
  if(near) best={circle:'C8', pattern:'Fraud. Performed warmth',
   confidence:0.4,
   because:['a giving marker and a display marker inside one sentence of each other',
    'the spec\'s test: does the warmth cost anything, or does it require an audience',
    'confidence is held at 0.4 because this is one relation in one sentence and '+
    'not a pattern across entries']};}
 if(!best){
  var hits=lawMatch(src,DANTECUE,3), tal={};
  hits.forEach(function(h){var c=h.row;
   if(!tal[c[0]])tal[c[0]]={circle:c[0],pattern:c[1]+'. '+c[2],cues:[]};
   if(tal[c[0]].cues.indexOf(h.cue)<0)tal[c[0]].cues.push(h.cue);});
  var ks=Object.keys(tal).sort(function(a,b){return tal[b].cues.length-tal[a].cues.length;});
  if(ks.length){var t=tal[ks[0]];
   best={circle:t.circle, pattern:t.pattern,
    confidence:Math.round(Math.min(0.5,t.cues.length*0.15)*100)/100,
    because:t.cues.slice(0,3).map(function(c){return '"'+c+'" in the text';})
     .concat(['confidence is capped at 0.5 for every circle but C8, because a '+
      'circle read off a phrase list is weaker evidence than a test'])};}}
 if(!best) return {circle:null, confidence:0, pattern:null,
  because:['nothing in the text reached a circle. four of the nine carry no cue '+
   'table at all and are reported unkeyed rather than clean'],
  unkeyed:DANTECUE.filter(function(c){return !c[3].length&&c[0]!=='C8';})
   .map(function(c){return c[0];})};
 best.unkeyed=DANTECUE.filter(function(c){return !c[3].length&&c[0]!=='C8';})
  .map(function(c){return c[0];});
 return best;}

/* ---------- offer · the payload ----------
   The spec: "offer is the payload. Everything else is evidence for it. The
   sniffer's job is to end at an address with a named replacement state, because
   that is exactly what release consumes."

   So this is the one field that must never come back empty when the axes carried
   anything, and the gate asserts that. It is ordered by shadow load, because the
   address carrying most is the one release should be offered at first, and it
   carries the disagreement with CHILD by name rather than hiding it. */
var OFFER_MAX=3;
/* THE OFFER'S ADDRESS IS THE AXIS ROW'S, not a second lookup on the axis name.
   sniffAxes has already resolved it against the 112 through this reading's own
   imprints, and re-deriving it here would be a second copy of one rule and a
   place for the two to disagree. A row that carries no address at all reads as
   null, which is the honest answer and not the spec region. */
function sniffOffer(axes){
 return axes.filter(function(a){return a.shadow>0;})
  .sort(function(a,b){return b.shadow-a.shadow;})
  .slice(0,OFFER_MAX)
  .map(function(a){
   var sp=SPEC_POLE[a.axis], ch=CHILD.find(function(c){return c.nm===a.axis;});
   var differs=ch&&sp&&sp.pole.toLowerCase().indexOf(String(ch.opp).toLowerCase())<0;
   var at=(a.address===undefined)?null:a.address;
   return {address:at, region:sp?sp.addr:null, axis:a.axis,
    replacement:sp?sp.pole:null,
    shadow:a.shadow, coherent:a.coherent,
    because:['the '+a.axis+' axis carries '+a.shadow+' of 10 of shadow load'+
      (at?' and this reading places it heaviest at '+at
         :', and this reading placed no address on it, so there is nowhere to '+
          'name'),
     'every shadow in the system has a named coherent opposite at the same '+
      'address. Finding the shadow names the replacement to offer']
     .concat(a.because.slice(0,2)),
    /* named where the two tables disagree, so a renderer can decline to print
       a replacement the rest of the product contradicts. */
    poleDiffers:differs?{spec:sp.pole, child:ch.opp}:null};});}

/* ---------- the contract ---------- */
function sniffStory(text){
 var p=parseStory(text);
 var axes=sniffAxes(p);
 return {
  axes:      axes,
  saboteurs: sniffSaboteurs(axes).slice(0,SAB_SHOW),
  laws:      sniffLaws(text),
  flow:      sniffFlow(text),
  gates:     sniffGates(text),
  depth:     sniffDepth(text),
  offer:     sniffOffer(axes),
  /* the working, kept, because a contract that discards its own evidence cannot
     be audited and re-parsing is what makes the atom layer possible. */
  parsed:    p,
  /* WHAT THIS READING DOES NOT KNOW. Carried in the output rather than left to
     a reviewer to remember, because every one of these is a place a renderer
     could otherwise print a clean reading over a hole. */
  gaps:      (typeof lawCoverage==='function')?lawCoverage():null};}
