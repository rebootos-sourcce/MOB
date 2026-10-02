/* ============================================================
   THE MEANING TABLE. Round PO, ruled 2 October: UNPACK EVERY SYMBOL.

   His words: "you have to unpack blueprint. They don't know what that means.
   Earth, they don't know what that means. Architect, they don't know what
   that means... And this is going to be a general rule for all information
   across the board."

   A label, a sign, a number or a term of art never stands alone. This is the
   one table of what each one means, and it is the only place those sentences
   are written. A surface asks it by name and prints the sentence beside the
   term, either in the line itself or in the one tooltip the product already
   has, so no surface keeps its own copy and none can say it differently.

   ONE SENTENCE EACH. Short, present tense, words a ten year old has. A
   sentence that is itself a claim says whose claim it is: numerology claims,
   astrology claims. Nothing here says the instrument measured a sign or a
   number, because it did not. The sun, moon and rising positions are
   computed from the sky, and what a sign then means is an old symbol system's
   say so. Where that matters the sentence says so in the sentence.

   NO COUNT IS TYPED. Where a sentence names how many there are, the number is
   read off the table it counts: SI for the laws, SAB33 for the saboteurs, ARCH
   for the archetypes. This product has been bitten by a typed count twelve
   times.

   HOW A KEY IS WRITTEN. Lower case. A family has a prefix: sign:capricorn,
   animal:tiger, path:9, law:truth, axis:light, feeling:fear, seat:root,
   archetype:caregiver, year:fire. The Western element fire is plain fire and
   the Chinese year element is year:fire, because one word means two things.

   HOW IT IS BUILT. The families are written from the tables the engine already
   carries, SIGN_RUNS, LP_RUNS, CH_RUNS, CE_RUNS, IQ_STEM, CHILD, ARCH and
   DOMAINS, so a meaning here cannot drift from what the engine says a thing
   does. They are built on the first ask and not at load, because IQ_STEM
   loads after this file. Host free: no document, no window, no storage.
   ============================================================ */
var UNPACK_BASE={
 /* THE BLUEPRINT, AND WHAT IT IS READ FROM */
 'blueprint':'Blueprint is the pattern you started with, before life added anything.',
 'symbolic reading':'A symbolic reading is a meaning an old system gives to a date or a name, and nothing in your body is measured to get it.',
 'running':'Running is what is acting in you now, as against what you were born with.',
 'root':'A root is one of four basic ways of running, and each one groups several of the starting patterns in your blueprint.',
 'architect':'Architect is the root that builds order and keeps it, by working things out and doing what is owed.',
 'engine':'Engine is the root that drives things, makes them and takes them apart to make room.',
 'weaver':'Weaver is the root that joins people, trades fairly, mends what broke and plays.',
 'witness':'Witness is the root that watches without stepping in and stays with a question without forcing an answer.',

 /* THE FOUR SYSTEMS A BIRTH IS READ BY */
 'western':'Western means Western astrology: your sun sign, your moon sign and your rising sign.',
 'eastern':'Eastern means the Chinese calendar: the animal and the element of your birth year.',
 'number':'Number means numerology: figures worked out from your birth date and your full name.',
 'design':'Design means Human Design, a modern system that turns the sun at your birth, and the sun 88 degrees of its path earlier, into gates and lines.',
 'overlap':'An overlap is where two of the four systems point at the same thing, such as both naming fire.',

 /* THE SIGNS, AND WHERE THEY COME FROM */
 'sun sign':'Your sun sign is the sign the sun stood in on the day you were born.',
 'moon sign':'Your moon sign is the sign the moon stood in when you were born, so it needs your birth time to be right.',
 'rising sign':'Your rising sign is the sign coming up over the eastern horizon where you were born, so it needs your birth time and your birthplace.',
 'cardinal':'Cardinal signs start things.',
 'fixed':'Fixed signs hold on to what has been started.',
 'mutable':'Mutable signs adapt as things change.',
 'year animal':'Your year animal is the animal for your birth year in the twelve year Chinese cycle, and the year turns in early February.',
 'year element':'Your year element is the element for your birth year in the Chinese calendar, and it repeats every ten years, two years to each element.',

 /* THE ELEMENTS ARE BUILT BELOW, from the sign table */

 /* NUMBERS */
 'life path':'Life path is the number you get by adding every digit of your birth date until one digit is left, except 11, 22 and 33, which stay as they are.',
 'master number':'A master number is 11, 22 or 33, and it is kept as it is and not added down to one digit.',
 'expression':'Expression is the number you get by adding the value of every letter in your full name.',
 'soul urge':'Soul urge is the number you get by adding only the vowels in your full name.',
 'personality':'Personality is the number you get by adding only the consonants in your full name.',
 'birthday':'Birthday is the day of the month you were born on.',
 'maturity':'Maturity is your life path added to your expression, and numerology claims it shows what the second half of life is for.',

 /* HUMAN DESIGN */
 'gate':'A gate is one of 64 positions on a wheel from the I Ching, an old Chinese book, and the sun passes through all of them in a year.',
 'line':'A line is one of six steps inside a gate, each under one degree of the sun’s path.',
 'profile':'A profile is two line numbers from 1 to 6: the line of your birth sun over the line of the sun 88 degrees earlier.',
 'personality gate':'Your personality gate is the gate the sun stood in at the moment you were born.',
 'design gate':'Your design gate is the gate the sun stood in 88 degrees of its path before you were born.',
 'gene key':'A gene key is the gate the sun stood in on your birth day, read for its shadow, its gift and its highest form.',

 /* THE SEATS */
 'seat':'A seat is one of seven places along the middle of your body, from the base of the spine to the top of the head, where the instrument reads what is held.',
 'assemblage point':'An assemblage point is a seat: one of seven places along the middle of your body where the instrument reads what is held.',
 'seat:root':'Root is the seat at the base of the spine, and it holds what you stand on.',
 'seat:sacral':'Sacral is the seat in the lower belly, and it holds what you want.',
 'seat:solar':'Solar is the seat in the upper belly behind the stomach, and it holds what you carry.',
 'seat:heart':'Heart is the seat in the middle of the chest, and it holds what you give.',
 'seat:throat':'Throat is the seat at the neck, and it holds what you say.',
 'seat:3rd eye':'The 3rd Eye is the seat in the forehead, and it holds what you see.',
 'seat:crown':'Crown is the seat at the top of the head, and it holds what you belong to.',

 /* THE SEATS IN THE YOGA TRADITION, which is where the Eastern lens takes its
    names. The name, the element and the seed sound are that tradition's own. */
 'yoga:root':'In the yoga tradition the root seat is called Muladhara, its element is earth and its seed sound is Lam.',
 'yoga:sacral':'In the yoga tradition the sacral seat is called Svadhisthana, its element is water and its seed sound is Vam.',
 'yoga:solar':'In the yoga tradition the solar seat is called Manipura, its element is fire and its seed sound is Ram.',
 'yoga:heart':'In the yoga tradition the heart seat is called Anahata, its element is air and its seed sound is Yam.',
 'yoga:throat':'In the yoga tradition the throat seat is called Vishuddha, its element is ether and its seed sound is Ham.',
 'yoga:3rd eye':'In the yoga tradition the 3rd Eye seat is called Ajna, its element is light and its seed sound is Om.',
 'yoga:crown':'In the yoga tradition the crown seat is called Sahasrara, its element is thought and its seed is silence.',

 /* THE CHAIN OF PATTERNS */
 'address':'An address is one exact place in your body where a pattern sits.',
 'charge':'Charge is survival energy stuck at one place in your body.',
 'fetter':'A fetter is a named pattern that sits at one address and fires when something matches it.',
 'complex':'A complex is two saboteurs from the same family joined into one pattern.',
 'hyper complex':'A hyper complex forms when complexes of the same family run together, one ring further in than a complex.',
 'character':'Character is the innermost ring, formed when two hyper complexes run together and are heavy enough.',
 'saboteur':'A saboteur is a named habit that runs on the charge held at several addresses at once.',
 'mask':'A mask is a way of showing up, such as Child or Teen, read from the weight held at a group of seats.',
 'axis':'An axis is a feeling and its opposite, such as fear and trust, and the instrument reads how much of the first is held and how much of the second is in place.',
 'cq':'CQ is your coherence number, built only from your answers on the laws.',
 'coherence':'Coherence is when what you mean, what you do and what your body does point the same way.',
 /* YOUR PATTERNS, the trace graph's screen (ui/loopread.js, engine/loop.js).
    Each word below is a label that block prints, and its meaning is the
    graph's own: confirmed is a user_confirmed edge, unanswered is everything
    the sniffer inferred that nobody has answered, from your words is a story
    edge marked named. */
 'pattern':'A pattern is a reaction you keep having, and the instrument places it at one exact spot in your body.',
 'confirmed':'Confirmed means you said yes, this pattern is yours, or you chose a practice to work on it.',
 'unanswered':'Unanswered means the instrument read this from what you wrote, and you have not said yes or no to it yet.',
 'declined':'Declined means you turned down a practice the instrument suggested, and your record keeps that.',
 'practised':'Practised counts the rituals on your record that were done.',
 'not done':'Not done counts the times in a row a ritual came due and was not marked done.',
 'from your words':'From your words means a feeling word you wrote names this pattern.',
 'from the seat':'From the seat means your words pointed at this part of the body, and the instrument picked the spot there because no word named one.',
 'release line':'A release line is one spoken line of a release, aimed at one address, that lets go of the limit held there.',
 'truth line':'A truth line is one spoken line that puts the opposite quality in at the address, where the limit was.',
 'evidence':'Evidence is something noticed or measured after a practice that backs a pattern up or goes against it.',

 /* THE COMPASS */
 'teacher':'A teacher here is a picture of one pole, named for the person who showed it most clearly, and the panel describes a behaviour and not that person.',
 'inversion':'An inversion is the same quality turned upside down, named for a figure who shows it, and it is a behaviour and not a being.',
 'pole':'A pole is one end of an axis, either the quality running clean or the same quality turned upside down.',
 'axis:light':'Light is the axis of warmth, from care that is given freely to a glow put on for an audience.',
 'axis:desire and will':'Desire and will is the axis of wanting, from a want that moves you toward something larger to a want that having never fills.',
 'axis:order':'Order is the axis of structure, from rules people can lean on to disorder made on purpose.',
 'axis:power':'Power is the axis of strength, from strength you pay for yourself to strength that others are billed for.',
 'axis:perception':'Perception is the axis of seeing and showing, from seeing what is there to presenting a surface that hides what is underneath.',
 'axis:trust':'Trust is the axis of knowing, from feeling things straight away to waiting for proof before you let yourself feel.',
 'axis:charge':'Charge is the axis of intensity, from strong feeling that moves through you cleanly to strong feeling with no clean way out.',
 'axis:revelation':'Revelation is the axis of belief, from changing what you believe when your life says otherwise to guarding a belief against what you live through.'
};

/* THE ELEMENTS. What each stands for is what ROOT_SAYS and ROOT_ELSAYS already
   say about it, put as a short phrase. The signs it names are read off ZSIGN. */
var UNPACK_ELEM={fire:'starting things and burning hot', earth:'steady, solid and slow to move',
 air:'watching and naming what it sees', water:'finding the low route and still arriving'};

/* THE SIGN LIST FOR AN ELEMENT, in the order the sky counts them from Aries */
function unpackSigns(el){
 if(typeof ZSIGN==='undefined')return [];
 var order=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
 return order.filter(function(n){return ZSIGN.some(function(z){return z[2]===n&&z[3]===el;});});}
function unpackList(a){return a.length>1?a.slice(0,-1).join(', ')+' and '+a[a.length-1]:(a[0]||'');}
/* a or an, by the sound the word starts on: an Ox, an 8, an 11, a 9 */
function unpackA(w){
 var s=String(w);
 return (/^[AEIOUaeiou]/.test(s)||/^(8|11|18)$/.test(s))?'an':'a';}

var UNPACK_MEMO=null;
function unpackAll(){
 if(UNPACK_MEMO)return UNPACK_MEMO;
 var t={}, k;
 for(k in UNPACK_BASE)t[k]=UNPACK_BASE[k];
 /* the four Western elements */
 Object.keys(UNPACK_ELEM).forEach(function(el){
  var signs=unpackSigns(el), nm=el.charAt(0).toUpperCase()+el.slice(1);
  t[el]=nm+' is the element of '+unpackList(signs)+', and it stands for '+UNPACK_ELEM[el]+'.';});
 /* the twelve signs. astrology's claim, said as the claim */
 if(typeof ZSIGN!=='undefined'&&typeof SIGN_RUNS!=='undefined')
  ZSIGN.forEach(function(z){
   t['sign:'+z[2].toLowerCase()]=z[2]+' is '+unpackA(z[3])+' '+z[3]+' sign, and astrology claims it '
    +(SIGN_RUNS[z[2]]||'')+'.';});
 /* the twelve year animals */
 if(typeof CHINESE!=='undefined'&&typeof CH_RUNS!=='undefined')
  CHINESE.forEach(function(a){
   t['animal:'+a.toLowerCase()]='The Chinese calendar claims '+unpackA(a)+' '+a+' year '+(CH_RUNS[a]||'')+'.';});
 /* the five Chinese elements */
 if(typeof CE_RUNS!=='undefined')
  Object.keys(CE_RUNS).forEach(function(e){
   t['year:'+e.toLowerCase()]=e+' is one of the five elements of the Chinese calendar, and it '+(CE_RUNS[e]||'')+'.';});
 /* every life path number, with what numerology claims for it */
 if(typeof LP_RUNS!=='undefined')
  Object.keys(LP_RUNS).forEach(function(n){
   t['path:'+n]='Numerology claims '+unpackA(n)+' '+n+' is the one who '+(LP_RUNS[n]||'')+'.';});
 /* the laws, from the question the intake asks about each */
 if(typeof SI!=='undefined'&&typeof IQ_STEM!=='undefined'){
  SI.forEach(function(l){
   t['law:'+l.nm.toLowerCase()]=l.nm+' is how often you '+(IQ_STEM[l.nm]||'')
    +', when it costs you, when nobody would know and on an ordinary day.';});
  t['law']='A law is one of '+SI.length+' ways of keeping your integrity, read from three questions you answer about each.';}
 /* the nine feelings, as the ends of the nine axes */
 if(typeof CHILD!=='undefined')
  CHILD.forEach(function(c){
   t['feeling:'+c.nm.toLowerCase()]=c.nm+' is one end of an axis, felt in the '+c.loc.replace(', ',' and ')
    +', with '+c.opp.toLowerCase()+' as its opposite.';});
 /* and the nine opposites, which are the other end of each axis: the slider
    that says how much of the opposite is in place at the same address */
 if(typeof CHILD!=='undefined')
  CHILD.forEach(function(c){
   t['opposite:'+c.opp.toLowerCase()]=c.opp+' is the opposite of '+c.nm.toLowerCase()
    +', and this is how much of it is in place at the same address.';});
 /* the twelve archetypes */
 if(typeof ARCH!=='undefined')
  ARCH.forEach(function(a){
   t['archetype:'+a.nm.toLowerCase()]=a.nm+' is one of '+ARCH.length+' kinds of character, the one that '+a.v+'.';});
 t['archetype']='An archetype is one of '+(typeof ARCH!=='undefined'?ARCH.length:'twelve')+' kinds of character you are born leaning toward.';
 /* THE TEN COHERENCE TIERS, round PT, added for the Practitioner page. TIERDEF
    already carries one sentence per tier in its own def field, written for
    exactly this job (tierOf, tierRange), so this is the same precedent as
    law: and archetype: just above: a meaning table entry built from the
    table the engine already carries, never typed a second time here. A gap
    this closed: before it, the tier word a reading is built on, "severe",
    "oscillating", "mastery", printed with no meaning beside it at all, which
    round PO's unpack rule names as a gate and not a preference.

    ONE SENTENCE, THE GATE'S OWN RULE, caught this file's first pass: def is
    sometimes two sentences ("Fifty is the median... The field crosses it
    both ways...") and this prepended the tier's own name as a third, "Gaining.
    The field builds...", so every one of the ten failed PO's own check for
    it. The display word already carries the name, unp()'s own label, so the
    tip needs only the first sentence of def and not the name again: split on
    the first ". " and keep one trailing full stop, never two. */
 if(typeof TIERDEF!=='undefined')
  TIERDEF.forEach(function(x){
   t['tier:'+x.nm.toLowerCase()]=String(x.def||'').split('. ')[0].replace(/\.+$/,'')+'.';});
 UNPACK_MEMO=t;
 return t;}

/* ONE LOOKUP. A term, and optionally the family it belongs to. Case and the
   Brow spelling of the 3rd Eye are folded here so no caller has to. Returns the
   sentence, or the empty string when the table has none, and a caller never
   prints a guess in its place. */
function unpackKey(term,ctx){
 var k=String(term||'').toLowerCase().replace(/^\s+|\s+$/g,'');
 if(k==='brow'||k==='third eye')k='3rd eye';
 var t=unpackAll();
 if(ctx&&t[ctx+':'+k])return ctx+':'+k;
 return t[k]?k:'';}
function unpackOf(term,ctx){
 var k=unpackKey(term,ctx);
 return k?unpackAll()[k]:'';}
