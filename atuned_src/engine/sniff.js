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
function scanStory(text){
 var src=' '+String(text||'').toLowerCase().replace(/[^a-z' ]+/g,' ').replace(/\s+/g,' ')+' ';
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
 hits.sort(function(a,b){return a.at-b.at;});
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
 var hits=scanStory(text), byBand={}, byChg={}, imprints=[];
 hits.forEach(function(h){
  if(h.band&&h.band!=='coherent'){ byBand[h.band]=(byBand[h.band]||0)+h.amt; }
  if(h.charge){ byChg[h.charge]=(byChg[h.charge]||0)+1; }});
 var wanted={}; Object.keys(byChg).forEach(function(c){var f=CHG2FET[c]; if(f)wanted[f]=true;});
 /* a word that names its own fetter is as named as an adjective that maps to
    one, so it counts toward wanted and stops the reading being inferred. */
 var stated={};
 hits.forEach(function(h){ if(h.fet){ wanted[h.fet]=true; stated[h.fet]=true; } });
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
  var stateHere=Object.keys(stated).filter(function(f){return wanted[f];}).length>0;
  if(stateHere&&!seg.length){
   imprints.push({node:all[0]?all[0].i:null, name:all[0]?all[0].k:'', band:bn,
    fetter:Object.keys(stated)[0], inferred:false, stated:true,
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
  words:hits.filter(function(h){return h.kind!=='adj';}).length};}
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
     it does not score another person. there is no subject model, so every hit
       lands on the writer, which satisfies guard 2 by having no mechanism
       rather than by a rule. a frame layer would need the rule.
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
 begrudge:['Anger','Apathy'], embittered:['Anger','Apathy']};

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

   This is the single biggest known weakness of the law table and it is handled
   here rather than left. It is still not subject handling: "she lied to me"
   fires Truth on the writer, and that is guard 2's problem, named in
   DESIGN-sniffer.md and not solved by this pass. */
var LAW_NEG=['not','no','never','nobody','none','cannot','cant','did',
 'didnt','dont','wont','wasnt','isnt','havent','hasnt','couldnt','wouldnt','refuse','refused'];
var LAW_NEG_W=3;
function lawNorm(text){
 return ' '+String(text||'').toLowerCase().replace(/[^a-z' ]+/g,' ')
  .replace(/'/g,'').replace(/\s+/g,' ')+' ';}
function lawNegated(src,at){
 var before=src.slice(0,at).trim().split(' ');
 var run=before.slice(Math.max(0,before.length-LAW_NEG_W));
 return run.some(function(w){return LAW_NEG.indexOf(w)>=0;});}
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
  because:['the 13 nature and 15 human nature elements carry their shadow strings in '+
   'reviews/elements.json, which is not in this repository, so they were not read '+
   'rather than read as clean']};}

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
   :['the text matched '+s.total+' gate cues, and the sump is not computed '+
     'without both upstream readings, because assuming them clean would report '+
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
      'address, and detecting the shadow is what names the replacement to offer']
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
