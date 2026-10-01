/* ============================================================
   THE FEELINGS WHEEL, as data for the sniffer. Round PA, the owner's own
   wheel, FEELINGS-WHEEL.md: seven primary families, their secondary words and
   their tertiary words, three rings. The sniffer looks for every word on it,
   groups each word to its family, and maps the family to the places the engine
   already holds a feeling: the nine charges, the seat each charge is held at,
   and the addresses at that seat that carry the charge, which are the nodes
   whose `c` is that charge.

   THE MAPPING IS A PROPOSAL, AND IT IS FLAGGED AS ONE. The wheel names
   families of feeling and the engine names nine charges. Nothing in the
   repository says which family is which charge, so each mapping below is mine,
   written as data so it can be changed in one place, and the owner is asked to
   confirm it (SNIFFER-RECOMMENDATION.md, question 3). Where the engine already
   rules a word, the ruling stands and the wheel does not overwrite it: ashamed
   is Shame at the solar plexus because round GR said so, and the wheel puts
   it under Sad. Authored entries are never touched. The wheel adds only the
   words the lexicon had no entry for.

   THE FAMILY, THEN THE CHARGE.
     Happy       no charge. These subtract, as calm and grateful already do.
     Surprised   Surprise, and under Startled and Confused Shock, which is where
                 the product puts doubt, and under Excited Anticipation
     Bad         Apathy, and under Busy and Stressed Anticipation, which is
                 where the product puts anxiety
     Fearful     Fear, Anticipation under Anxious, Shame under Insecure and Weak
     Angry       Anger, Shame under Humiliated, Apathy under Distant, Disgust
                 under Critical, Anger and Sad under Let down
     Disgusted   Disgust
     Sad         Sad, Shame under Guilty
   The seat is not typed here. It is CHG2SEAT's, the owner's ruling about where
   a charge is held, so the wheel can never seat a word somewhere the product
   does not.

   THE WEIGHT, BY RING, AND DERIVED. A tertiary word is more specific than a
   secondary one and a secondary one is more specific than the family word, and
   a more specific report is a stronger one, so the rings take three points of
   the family's own authored amounts, read off the table at load: the lowest
   for the family word, the median for a secondary, the upper quartile for a
   tertiary. Nothing is typed. A family with one authored amount gives all
   three the same, which under reads and is stated rather than hidden.

   THE PLAIN WORDS. A word that is also an ordinary word for something else, a
   free afternoon, a busy road, an exposed pipe, is on the wheel and grouped to
   its family, and is read as a feeling only after a word that says a person
   is feeling it: felt, feel, feeling, feels, "made me", "makes me". A
   false positive in a somatic reading costs more than a miss, so the plain
   words are read where the sentence says they are a feeling and nowhere else.

   TWO FAMILIES. Overwhelmed, inferior, disappointed and embarrassed are under
   two, and each is grouped to both. The first three read at both charges, the
   second as a second hit at the same word, which the path already records as
   one word reaching two places. Embarrassed stays Shame by the earlier ruling,
   see WHEEL_DUAL, below, flagged.
   ============================================================ */
var WHEEL_TREE={
 Happy:{Playful:['Aroused','Cheeky'],Content:['Free','Joyful'],Interested:['Curious','Inquisitive'],
  Proud:['Successful','Confident'],Accepted:['Respected','Valued'],Powerful:['Courageous','Creative'],
  Peaceful:['Loving','Thankful'],Trusting:['Sensitive','Intimate'],Optimistic:['Hopeful','Inspired']},
 Surprised:{Startled:['Shocked','Dismayed'],Confused:['Disillusioned','Perplexed'],
  Amazed:['Astonished','Awe'],Excited:['Eager','Energetic']},
 Bad:{Bored:['Indifferent','Apathetic'],Busy:['Pressured','Rushed'],
  Stressed:['Overwhelmed','Out of control'],Tired:['Sleepy','Unfocussed']},
 Fearful:{Scared:['Helpless','Frightened'],Anxious:['Overwhelmed','Worried'],
  Insecure:['Inadequate','Inferior'],Weak:['Worthless','Insignificant'],
  Rejected:['Excluded','Persecuted'],Threatened:['Nervous','Exposed']},
 Angry:{'Let down':['Betrayed','Resentful'],Humiliated:['Disrespected','Ridiculed'],
  Bitter:['Indignant','Violated'],Mad:['Furious','Jealous'],Aggressive:['Provoked','Hostile'],
  Frustrated:['Infuriated','Annoyed'],Distant:['Withdrawn','Numb'],Critical:['Skeptical','Dismissive']},
 Disgusted:{Disapproving:['Judgmental','Embarrassed'],Disappointed:['Appalled','Revolted'],
  Awful:['Nauseated','Detestable'],Repelled:['Horrified','Hesitant']},
 Sad:{Lonely:['Isolated','Abandoned'],Vulnerable:['Victimized','Fragile'],
  Despair:['Grief','Powerless'],Guilty:['Ashamed','Remorseful'],
  Depressed:['Empty','Inferior'],Hurt:['Disappointed','Embarrassed']}};
var WHEEL_PRIMARY=Object.keys(WHEEL_TREE);
/* the family to charge map. [] is the family that subtracts. PROPOSED. */
var WHEEL_FAM={Happy:[],Surprised:['Surprise'],Bad:['Apathy'],Fearful:['Fear'],
 Angry:['Anger'],Disgusted:['Disgust'],Sad:['Sad']};
/* the secondary overrides, family/secondary. PROPOSED. */
var WHEEL_SEC={'Surprised/Startled':['Shock'],'Surprised/Confused':['Shock'],
 'Surprised/Excited':['Anticipation'],'Bad/Busy':['Anticipation'],'Bad/Stressed':['Anticipation'],
 'Fearful/Anxious':['Anticipation'],'Fearful/Insecure':['Shame'],'Fearful/Weak':['Shame'],
 'Angry/Let down':['Anger','Sad'],'Angry/Humiliated':['Shame','Anger'],
 'Angry/Distant':['Apathy'],'Angry/Critical':['Disgust'],'Sad/Guilty':['Shame']};
/* the word overrides, where one word is read differently from its secondary.
   PROPOSED. powerless is the despair that is also an absence of will. */
var WHEEL_WORD={numb:['Apathy'],withdrawn:['Apathy'],powerless:['Sad','Apathy'],
 embarrassed:['Shame'],ashamed:['Shame'],remorseful:['Shame'],jealous:['Anger'],
 empty:['Apathy']};
/* the words under two families that read at two charges, and the second
   charge each one reads at besides the one the lexicon gives it. PROPOSED.
   EMBARRASSED IS THE FOURTH AND IS NOT HERE. The wheel puts it under Disgusted
   and under Sad, and both families are recorded for it in WHEEL, but round GR
   ruled the shame family, and the gate holds every one of them to Shame and
   nothing else, so a second hit at Disgust would break a ruling. It is the one
   place the wheel and an earlier ruling disagree and the earlier ruling wins. */
var WHEEL_DUAL={overwhelmed:'Fear',inferior:'Sad',disappointed:'Sad'};
/* words that are also ordinary words, read only after a feeling lead */
var WHEEL_PLAIN=['happy','bad','awful','aroused','cheeky','free','awe','creative','courageous',
 'respected','valued','successful','sensitive','intimate','energetic','eager','busy','rushed',
 'pressured','sleepy','tired','unfocussed','curious','inquisitive','interested','powerful',
 'accepted','trusting','distant','critical','weak','exposed','hesitant','skeptical','dismissive',
 'provoked','fragile','vulnerable','violated','excluded','out of control','confident','proud',
 'loving','playful','indifferent'];
/* the lead that says a person is feeling it. "made me" and its kin are the
   other way a person says it. */
var WHEEL_LEAD=['felt','feel','feeling','feels','made me','makes me','make me','left me','leaves me'];

function wheelFlat(){
 var rows={}, order=[];
 function add(w,fam,sec,ring){
  var k=w.toLowerCase();
  if(!rows[k]){rows[k]={w:k,fams:[],secs:[],ring:ring,rings:[]};order.push(k);}
  var r=rows[k];
  if(r.fams.indexOf(fam)<0)r.fams.push(fam);
  if(r.secs.indexOf(sec)<0)r.secs.push(sec);
  r.rings.push(ring); r.ring=Math.max(r.ring,ring);}
 Object.keys(WHEEL_TREE).forEach(function(fam){
  add(fam,fam,fam,1);
  Object.keys(WHEEL_TREE[fam]).forEach(function(sec){
   add(sec,fam,sec,2);
   WHEEL_TREE[fam][sec].forEach(function(t){add(t,fam,sec,3);});});});
 return order.map(function(k){return rows[k];});}
var WHEEL=wheelFlat();
var WHEEL_BY={}; WHEEL.forEach(function(r){WHEEL_BY[r.w]=r;});

/* the charges a wheel word reads at, in the order they are tried */
function wheelCharges(r){
 if(WHEEL_WORD[r.w])return WHEEL_WORD[r.w].slice();
 var out=[];
 r.fams.forEach(function(f,i){
  var sec=r.secs[i], c=WHEEL_SEC[f+'/'+sec]||WHEEL_FAM[f]||[];
  c.forEach(function(x){if(out.indexOf(x)<0)out.push(x);});});
 if(WHEEL_DUAL[r.w]&&out.indexOf(WHEEL_DUAL[r.w])<0)out.push(WHEEL_DUAL[r.w]);
 return out;}
/* the seat key a charge is held at, CHG2SEAT's own answer */
function wheelSeatOf(fetter){
 var key={Sad:'sadness'}[fetter]||String(fetter).toLowerCase();
 var b=CHG2SEAT[key]; return b&&B2K[b]?B2K[b]:null;}
/* the amounts of every authored word of a fetter, ascending */
function wheelAmounts(fetter){
 var out=[];
 Object.keys(LEX).forEach(function(k){
  var e=LEX[k], amt=e[LEX_AMT]; if(amt<=0)return;
  var f=e[LEX_FET]!=null?e[LEX_FET]:(ADJ2CHG[k]?CHG2FET[ADJ2CHG[k]]:null);
  if(f===fetter)out.push(amt);});
 return out.sort(function(a,b){return a-b;});}
/* the amount for a ring, the three points of the family's own amounts */
function wheelAmount(fetter,ring){
 var A=wheelAmounts(fetter);
 /* a charge with no authored word takes the lowest charged amount anywhere in
    the table, the rule lexCanon already keeps for an axis with no family */
 if(!A.length)return lexFamilyFloor().floor;
 var n=A.length, i=ring<=1?0:(ring===2?Math.floor((n-1)/2):Math.ceil(3*(n-1)/4));
 return A[i];}

/* THE PASS. Adds the wheel words the lexicon has no entry for, as a stated
   fetter at the charge's seat, the amount from the ring. The plain words are
   not added: they are read by the lead rule in scanStory. A word with no
   charge, the Happy family, is added as a coherent entry, minus twelve, the
   floor of the coherent words the lexicon already carries, and minus fourteen
   at the third ring, the top of them. */
function lexWheel(){
 var out={added:0,already:0,plain:0,coherent:0,unseated:[],groups:WHEEL.length};
 WHEEL.forEach(function(r){
  var ch=wheelCharges(r);
  if(WHEEL_PLAIN.indexOf(r.w)>=0){out.plain++;return;}
  if(LEX[r.w]){out.already++;return;}
  if(!ch.length){
   var a=lexAdd(r.w,'coherent',r.ring>=3?-14:-12,null,{src:'wheel',from:'FEELINGS-WHEEL.md',rule:'happy family subtracts',cite:'wheel'});
   if(a.ok&&!a.already){out.added++;out.coherent++;}
   return;}
  var f=ch[0], seat=wheelSeatOf(f), amt=wheelAmount(f,r.ring);
  if(!seat||amt==null){out.unseated.push(r.w);return;}
  var a2=lexAdd(r.w,seat,amt,f,{src:'wheel',from:'FEELINGS-WHEEL.md '+r.fams.join('+'),
   rule:'family '+f+', ring '+r.ring+', seat from CHG2SEAT',cite:'wheel'});
  if(a2.ok&&!a2.already)out.added++;
  else if(!a2.ok)out.unseated.push(r.w);});
 return out;}

/* the second hit a two family word reads, see WHEEL_DUAL. Returns null for a
   word that has none. */
function wheelDual(w){
 var f=WHEEL_DUAL[w]; if(!f)return null;
 var seat=wheelSeatOf(f), amt=wheelAmount(f,(WHEEL_BY[w]||{ring:3}).ring);
 return seat&&amt!=null?{band:seat,amt:amt,fet:f}:null;}
/* the plain words by their key, with what they read at once a lead says so */
function wheelPlain(){
 var out={};
 WHEEL_PLAIN.forEach(function(w){
  var r=WHEEL_BY[w]; if(!r)return;
  if(LEX[w]){return;}
  var ch=wheelCharges(r);
  if(!ch.length){out[w]={band:'coherent',amt:r.ring>=3?-14:-12,fet:null};return;}
  var seat=wheelSeatOf(ch[0]), amt=wheelAmount(ch[0],r.ring);
  if(seat&&amt!=null)out[w]={band:seat,amt:amt,fet:ch[0]};});
 return out;}
/* the addresses a charge is carried at, at its seat: the nodes whose child
   fetter, cf, is the charge and whose band is the charge's seat, which is the
   column parseStory routes an imprint through. NODES.c is the older name of the
   same thing, and holds Sadness and Joy and Resentment where cf holds the nine
   axes, so cf is the one that agrees with the imprints. */
function wheelAddresses(fetter){
 var seat=wheelSeatOf(fetter), band=seat?K2BAND[seat]:null;
 return W.filter(function(n){return n.cf===fetter&&n.b===band;}).map(function(n){return n.i;});}

/* WHAT A STORY SAYS, GROUPED. Every wheel word in the text, longest first, with
   its family, its ring, the charges and seats it reads at, and whether the
   sniffer read it as a hit or left it, which a plain word with no lead is. */
function wheelRead(text){
 var nm=normMap(text), src=nm.s, hits=scanStory(text), out=[], taken=[];
 var keys=WHEEL.map(function(r){return r.w;}).sort(function(a,b){return b.length-a.length;});
 keys.forEach(function(w){
  var at=src.indexOf(' '+w+' ');
  while(at>=0){
   var hi=at+w.length+1;
   if(!taken.some(function(t){return at<t.hi&&hi>t.at;})){
    taken.push({at:at,hi:hi});
    var r=WHEEL_BY[w], ch=wheelCharges(r);
    out.push({w:w,at:at,families:r.fams.slice(),secondary:r.secs.slice(),ring:r.ring,
     charges:ch,seats:ch.map(wheelSeatOf).filter(function(x){return x;}),
     plain:WHEEL_PLAIN.indexOf(w)>=0,
     read:hits.some(function(h){return h.at===at&&h.kind==='word'&&h.t===w;})});}
   at=src.indexOf(' '+w+' ',at+1);}});
 return out.sort(function(a,b){return a.at-b.at;});}
