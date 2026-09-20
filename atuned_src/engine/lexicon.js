/* ============================================================
   THE LEXICON. word -> [seat, intensity].
   The original declared several keys twice across two blocks, so the
   later generic entries silently cancelled the newer specific ones , 
   the opposite of the stated intent. Merged here, one entry per key.
   ============================================================ */
var LEX={
 /* ============================================================
    WHAT AN ORDINARY SENTENCE BRINGS, and the reason this block exists.

    Measured against six plain sentences a person would actually type, four
    returned nothing at all: a father dying, being exhausted, feeling alone,
    and a panic attack. Those are not edge cases. They are the four most
    common things somebody opens an instrument like this to say, and the core
    loop of the product is that a story is read for charge.

    The gap was not conceptual. Almost every one of these concepts was already
    here in ONE inflection and missing in the others: lonely but not alone,
    grieving but not grief or died, drained and depleted but not exhausted,
    panicked but not panic. A person writes what happened in nouns and verbs,
    and this table was written in adjectives.

    So this is the same map widened, not a new theory: the event words and the
    noun forms of concepts already seated here, at the weights their existing
    neighbours carry. Seats follow the ones already in use: grief and
    loneliness at the heart, exhaustion and rage at the solar plexus, panic
    and survival at the root, shame and worth at the sacral, deceit and being
    unheard at the throat, meaninglessness at the crown, rumination at the
    third eye.
    ============================================================ */
 /* WHAT ANGER LOOKS LIKE WHEN SOMEBODY DESCRIBES IT. The table had furious
    and angry, which are the words a person uses about themselves afterwards,
    and none of the verbs they use about what happened. "He shouted at me and I
    slammed the door" read as nothing at all. */
 shouted:['solar',24],yelled:['solar',24],screamed:['solar',26],
 slammed:['solar',22],snapped:['solar',22],'lashed out':['solar',26],
 'blew up':['solar',26],'lost it':['solar',24],'saw red':['solar',26],
 /* and what being unheard looks like from the outside, at the throat */
 'talked over':['throat',22],interrupted:['throat',20],'shut me down':['throat',24],
 'would not listen':['throat',24],'wouldnt listen':['throat',24],
 'nobody listened':['throat',24],
 /* and being judged, at the sacral, where shame already sits */
 criticised:['sacral',22],criticized:['sacral',22],'told me off':['sacral',22],
 'made me feel small':['sacral',26],laughed:['sacral',20],
 /* grief and loss. heartbroken and grieving were here; the event was not. */
 died:['heart',28],death:['heart',26],dying:['heart',26],'passed away':['heart',28],
 grief:['heart',26],mourning:['heart',24],mourn:['heart',24],bereaved:['heart',26],
 loss:['heart',22],funeral:['heart',24],buried:['heart',22],widowed:['heart',26],
 miscarriage:['heart',28],stillborn:['heart',28],
 /* alone. lonely was here and alone was not, which is the commoner word. */
 alone:['heart',24],loneliness:['heart',24],isolated:['heart',22],
 unwanted:['heart',22],'nobody cares':['heart',26],'no one came':['heart',24],
 /* exhaustion. drained and depleted were here, the plain word was not. */
 exhausted:['solar',26,'Apathy'],exhaustion:['solar',26,'Apathy'],weary:['solar',22,'Apathy'],
 fatigue:['solar',22,'Apathy'],'wiped out':['solar',24,'Apathy'],'no energy':['solar',24,'Apathy'],
 'running on empty':['solar',26,'Apathy'],'cannot keep going':['solar',28,'Apathy'],
 'can not keep going':['solar',28,'Apathy'],'cant keep going':['solar',28,'Apathy'],
 /* panic. panicked was here, the noun and the event were not. */
 panic:['root',28],'panic attack':['root',28],panicking:['root',28],
 terror:['root',28],petrified:['root',26],
 /* being lied to. the throat carries deceit and had no verb for it. */
 lied:['throat',24],lying:['throat',22],lies:['throat',22],
 betrayed:['throat',28],betrayal:['throat',28],cheated:['throat',26],
 deceived:['throat',24],'went behind my back':['throat',26],
 /* overwhelm */
 overwhelmed:['solar',26],drowning:['solar',26],'too much':['solar',22],
 'cannot cope':['solar',26],'cant cope':['solar',26],
 /* rage. furious was here; the noun and the held forms were not. */
 rage:['solar',28],livid:['solar',26],seething:['solar',24],
 resentment:['solar',24],resentful:['solar',24],bitter:['solar',22],
 bitterness:['solar',22],
 /* shame and worth. humiliated was here, the rest of the family was not. */
 mortified:['sacral',26],disgraced:['sacral',26],exposed:['sacral',22],
 unlovable:['sacral',26],disgusting:['sacral',24],'not good enough':['sacral',24],
 /* meaninglessness. numb and empty were here, the statements were not. */
 meaningless:['crown',24],'nothing matters':['crown',26],
 'what is the point':['crown',24],'whats the point':['crown',24],
 disconnected:['crown',22],detached:['crown',20],hollow:['crown',22],
 /* rumination */
 overthinking:['eye',22],'cannot stop thinking':['eye',24],
 'cant stop thinking':['eye',24],'going over it':['eye',20],replaying:['eye',22],
 /* what the body reports, which is where a somatic instrument should be
    widest and was not. */
 'chest is tight':['heart',24],'chest tight':['heart',24],
 'cannot breathe':['root',26],'cant breathe':['root',26],'holding my breath':['root',22],
 'jaw is tight':['throat',22],'jaw clenched':['throat',22],
 'throat closed':['throat',24],'stomach knot':['sacral',22],
 nauseous:['sacral',22],'sick to my stomach':['sacral',24],
 trembling:['root',24],shaky:['root',20],'heavy in my chest':['heart',24],
 /* and the things that read as clear, which keep the scale honest at the
    other end. The coherent seat already carried calm, settled and grateful. */
 rested:['coherent',-12],easeful:['coherent',-12],unhurried:['coherent',-12],
 'slept well':['coherent',-14],'let it go':['coherent',-14],
 /* the burnout set. the resolver had no entry for any of these and read
    four segments out of thirty-three. */
 inadequacy:['throat',24],inadequate:['throat',22],misery:['heart',24],
 miserable:['heart',22],remorse:['heart',20],remorseful:['heart',18],
 burnout:['solar',28,'Apathy'],'burnt out':['solar',28,'Apathy'],'burned out':['solar',28,'Apathy'],
 depleted:['solar',24,'Apathy'],drained:['solar',22,'Apathy'],evaporated:['solar',20,'Apathy'],
 throbbing:['eye',18],throb:['eye',16],pounding:['eye',20],
 tense:['throat',16],tension:['throat',16],tight:['throat',16],clenched:['throat',20],
 crushed:['heart',26],humiliating:['throat',22],
 dread:['root',24],dreading:['root',22],bracing:['root',14],
 defeated:['heart',22],hopeless:['heart',26],pointless:['crown',22],
 resigned:['heart',18],flattened:['heart',20],
 grueling:['solar',18],relentless:['solar',18],
 /* root */
 nervous:['root',14],anxious:['root',16],scared:['root',18],afraid:['root',16],
 frightened:['root',18],terrified:['root',26],panicked:['root',24],froze:['root',18],
 frozen:['root',18],shaking:['root',20],unsafe:['root',20],
 /* sacral */
 restless:['sacral',12],craving:['sacral',14],numb:['sacral',16],empty:['sacral',18],
 hungry:['sacral',12],addicted:['sacral',22],distracted:['sacral',12],obsessed:['sacral',20],
 /* solar */
 angry:['solar',18],furious:['solar',24],ashamed:['solar',20],humiliated:['solar',24],
 defensive:['solar',16],blamed:['solar',18],stupid:['solar',20],worthless:['solar',26],
 embarrassed:['solar',16],guilty:['solar',18],
 /* heart */
 sad:['heart',16],lonely:['heart',20],grieving:['heart',22],hurt:['heart',18],
 rejected:['heart',22],abandoned:['heart',26],unloved:['heart',24],heartbroken:['heart',26],
 /* throat */
 silent:['throat',14],unheard:['throat',18],voiceless:['throat',20],choked:['throat',18],
 dismissed:['throat',18],ignored:['throat',18],
 /* coherent. these subtract. */
 grateful:['coherent',-14],content:['coherent',-12],calm:['coherent',-12],
 steady:['coherent',-12],peaceful:['coherent',-14],settled:['coherent',-12]};
var ADJ2CHG={
 nervous:'anxiety',anxious:'anxiety',tense:'anxiety',
 unheard:'silence',voiceless:'silence',choked:'silence',swallowed:'silence',
 doubtful:'doubt',uncertain:'doubt',suspicious:'doubt',distrustful:'doubt',
 numb:'apathy',flat:'apathy',blank:'apathy',indifferent:'apathy',hollow:'apathy',
 unmoved:'apathy',detached:'apathy',uncaring:'apathy',
 apart:'separation',disconnected:'separation',outside:'separation',adrift:'separation',
 scared:'fear',afraid:'fear',frightened:'fear',terrified:'fear',panicked:'fear',
 froze:'fear',frozen:'fear',shaking:'fear',unsafe:'fear',dread:'fear',bracing:'fear',
 angry:'anger',furious:'anger',defensive:'anger',blamed:'anger',
 ashamed:'shame',humiliated:'shame',embarrassed:'shame',guilty:'shame',
 stupid:'shame',worthless:'shame',inadequate:'shame',
 sad:'sadness',lonely:'sadness',grieving:'sadness',hurt:'sadness',rejected:'sadness',
 abandoned:'sadness',unloved:'sadness',heartbroken:'sadness',miserable:'sadness',
 crushed:'sadness',hopeless:'sadness',defeated:'sadness',
 restless:'joy',craving:'joy',empty:'joy',hungry:'joy',
 addicted:'joy',distracted:'joy',obsessed:'joy',
 silent:'shame',dismissed:'shame'};

/* the idioms. an idiom outranks its own words, because a statement can carry
   no feeling word at all and still be a report. */
var PHRASES=[
 [['wrap myself in a blanket','pretend the world hit pause','pretend the world would stop',
   'want to disappear','wish i could disappear','not be here','not exist',
   'pull the covers over','stay in bed all day','never come out','hide from everyone',
   'crawl into a hole','shut the door and not','be left alone forever'],
   'heart',26,'wanting to disappear'],
 [['the mountain just rolls right over','mountain rolled over me','i am tire tracks',
   'definitely tire tracks','rolled right over me','flattened me','ran me over',
   'what is the point of any of it','nothing i do matters','it never gets better',
   'i cannot keep doing this','i have nothing left','there is nothing left of me',
   'running on empty','i am done'],
   'heart',28,'despair'],
 [['i miss who i used to be','i do not recognise myself','i do not recognize myself',
   'lost myself somewhere','the person i was is gone','grieving something',
   'i will never get that back','it is too late for me'],
   'heart',26,'grief'],
 [['just want to get through','get through the day','one foot in front',
   'going through the motions','on autopilot','like an automaton',
   'nodded like','stared at his','stared at her','have the energy','no energy left'],
   'crown',22,'resignation'],
 [['could not stop','cant stop','can not stop','cannot stop','kept checking','keep checking'],
   'sacral',18,'compulsion'],
 [['stayed quiet','said nothing','kept my mouth','did not say','didnt say','bit my tongue'],'throat',20,'silenced'],
 [['could not say no','couldnt say no','said yes when','agreed anyway'],'throat',22,'over-giving'],
 [['do not trust','dont trust','cannot trust'],'eye',20,'distrust'],
 [['nobody says what','nobody means','everyone is lying','no one is honest'],'eye',18,'suspicion'],
 [['felt nothing','feel nothing','feeling nothing','numb to'],'crown',26,'frozen'],
 [['cannot remember the last','cant remember what i want','do not know what i want'],'crown',22,'forgotten'],
 [['held my position','would not back down','refused to admit','knew i was wrong'],'solar',20,'rigidity'],
 [['put it off','putting it off','keep postponing','waiting to feel ready'],'root',18,'avoidance'],
 [['is never finished','never finished','never good enough','still wrong','redid it',
   'ever finished'],'sacral',20,'perfectionism'],
 [['doing all of it alone','on my own','no one helps','carrying it alone'],'heart',22,'isolation'],
 [['carried it home','took it home','could not leave it','carried her','carried his',
   'home with me'],'heart',18,'over-merging'],
 [['gave more than i had','gave more than','and then resented','resented it'],'solar',22,'resentment'],
 [['have been dreading','been dreading','dreading it','dread it'],'root',22,'dread'],
 [['have not slept','havent slept','not sleeping','cannot sleep'],'root',20,'hypervigilance'],
 [['hated myself','disgusted with myself','ashamed of myself'],'throat',24,'self-attack'],
 [['do not show anyone','dont show anyone','not until it is perfect'],'sacral',18,'concealment'],
 [['find out i am','find out im','they will know','see through me'],'root',24,'exposure']];

/* ============================================================
   WHAT AN ENTRY IS, WHERE IT CAME FROM, AND WHAT IT MAY ASSERT.

   The three tables above were authored and nothing recorded their provenance,
   so the repository could not answer the owner's own question: does the
   sniffer have the logic supplied by the book. Measured, the answer was no in
   two directions at once. Nine of the nine axes the instrument scores, and
   seven of the seven cue words the thirty three saboteurs are defined by, were
   not words the scanner could find: one of nine and zero of seven resolved.
   And of the 192 authored words, 87 appear anywhere in the book and 105 do
   not, so more than half the vocabulary had no stated source at all.

   Neither of those is fixed by typing more words in. They are fixed by an
   entry knowing what it is. So an entry now has a schema, a source, and a
   validator that refuses rather than clamps, and every entry that is not hand
   authored is DERIVED by a named pass from a table that already has an owner.

   An entry is [seat, amount, fetter]. Positions are named below because a
   table read by index is a table nobody can search.

     seat     WHERE in the body the charge is held. One of LEX_SEATS. Always
              asserted, because the scanner genuinely knows it: the table says
              so and nothing was inferred to get there.
     amount   HOW MUCH, on the authored 12 to 28 curve. Signed: a coherent
              entry subtracts. parseStory divides by 3 and applyStory scales
              by 0.35, so this number is not a charge and must never be read
              as one.
     fetter   WHICH of the nine axes, and it is OPTIONAL BY DESIGN. Present
              means the word named the axis itself and the reading may say so.
              Absent means the seat is known and the axis is not, and
              parseStory will mark the imprint inferred. That flag is the
              whole difference between evidence and an accusation, and the
              product has already shipped the accusation once.

   WHAT AN ENTRY MAY NEVER ASSERT: a saboteur, an architecture, a diagnosis, a
   verdict, or a person. A word is evidence that a word was written. Every
   claim past that is made downstream, by a named stage, and says which it is.
   ============================================================ */
var LEX_SEAT=0, LEX_AMT=1, LEX_FET=2;
var LEX_SEATS=['root','sacral','solar','heart','throat','eye','crown','coherent'];
/* WHERE AN ENTRY CAME FROM. This list is the spec, not a summary of one.
   A source not on it is refused by name, including by whoever adds a helpful
   one later, because the gate asserts the set exactly.
     authored  hand written. the 192 above. no stated source and that is the
               open question, not a defect to be hidden.
     canon     derived from a canon table that already has an owner: the nine
               axes, and the seats and fetters CHG2SEAT and CHG2FET already
               assign them. No new number is invented by this pass.
     fold      an ordinary surface form of a key already present, generated by
               a stated rule and admitted only where a named corpus confirms
               the form is real writing. */
var LEX_SRC=['authored','canon','fold'];
var LEX_AMT_MAX=30;
/* key -> {src, from, rule, cite}. Covers LEX exactly, in both directions, and
   the gate asserts that, because a provenance table with holes in it is worse
   than none: it reads as though everything in it were sourced. */
var LEXMETA={};
Object.keys(LEX).forEach(function(k){
 LEXMETA[k]={src:'authored',from:null,rule:null,cite:null};});
var CHGMETA={};
Object.keys(ADJ2CHG).forEach(function(k){
 CHGMETA[k]={src:'authored',from:null,rule:null,cite:null};});

/* THE BOUNDARY, in validateProfile's and obValidate's posture: refuse by name,
   never clamp, never accept in silence. A clamped amount reads back as a
   reading the author never wrote. */
function lexKeyOk(k){
 /* exactly the surface forms scanStory's normalisation can produce: lowercase
    letters, apostrophes and single interior spaces. A key with a capital or a
    comma in it can never match anything and is a dead row that looks live. */
 return typeof k==='string' && /^[a-z']+( [a-z']+)*$/.test(k);}

function lexRefuse(k,seat,amt,fet){
 var errs=[];
 if(!lexKeyOk(k)) errs.push('the key '+JSON.stringify(k)+' is not a form the scanner can ever match');
 if(LEX_SEATS.indexOf(seat)<0) errs.push(k+' names the seat '+seat+', which is not one of the '+LEX_SEATS.length);
 if(typeof amt!=='number'||amt!==Math.round(amt)||amt===0||Math.abs(amt)>LEX_AMT_MAX)
  errs.push(k+' carries the amount '+amt+', and an amount is a non zero integer no further than '+LEX_AMT_MAX+' from zero');
 if((amt<0)!==(seat==='coherent'))
  errs.push(k+' is seated at '+seat+' with amount '+amt+', and only a coherent entry subtracts');
 if(fet!=null&&CHARGES.indexOf(fet)<0)
  errs.push(k+' states the fetter '+fet+', which is not one of the nine axes');
 if(LEX[k]&&LEX[k][LEX_SEAT]!==seat)
  errs.push(k+' is already seated at '+LEX[k][LEX_SEAT]+' and this would move it to '+seat);
 return errs;}

/* ONE ENTRY. Already present with the same seat is a no op and says so, so a
   pass can be re-run without silently doubling the table. */
function lexAdd(k,seat,amt,fet,meta){
 var errs=lexRefuse(k,seat,amt,fet);
 if(errs.length) return {ok:false,why:errs[0],errs:errs};
 if(LEX_SRC.indexOf(meta&&meta.src)<0)
  return {ok:false,why:'the source '+(meta&&meta.src)+' is not one of '+LEX_SRC.join(', '),errs:[]};
 if(LEX[k]) return {ok:true,already:true};
 LEX[k]=fet!=null?[seat,amt,fet]:[seat,amt];
 LEXMETA[k]={src:meta.src,from:meta.from||null,rule:meta.rule||null,cite:meta.cite||null};
 return {ok:true,already:false};}

/* AND THE CHARGE NAME, which is the other half of the same entry.
   ADJ2CHG is the surface form to axis name table. Its name says adjective and
   its job is wider than that: it is what makes an imprint NAMED rather than
   inferred, and a person writes the noun as often as the adjective. Renaming
   it touches the export contract and two tools, so the rename is named and
   deferred rather than done in the same pass as the vocabulary. Nothing may be
   added to it except through here. */
function chgAdd(k,chg,meta){
 if(!lexKeyOk(k)) return {ok:false,why:'the key '+JSON.stringify(k)+' is not a matchable form'};
 if(typeof chg!=='string'||!chg) return {ok:false,why:k+' names no charge'};
 if(ADJ2CHG[k]&&ADJ2CHG[k]!==chg)
  return {ok:false,why:k+' already names '+ADJ2CHG[k]+' and this would move it to '+chg};
 if(LEX_SRC.indexOf(meta&&meta.src)<0)
  return {ok:false,why:'the source '+(meta&&meta.src)+' is not one of '+LEX_SRC.join(', ')};
 if(ADJ2CHG[k]) return {ok:true,already:true};
 ADJ2CHG[k]=chg;
 CHGMETA[k]={src:meta.src,from:meta.from||null,rule:meta.rule||null,cite:meta.cite||null};
 return {ok:true,already:false};}

/* ============================================================
   PASS ONE, THE FOLD. And the reason it is a list and not a stemmer.

   Measured. 29 of 63 ordinary inflections of words already in the table did
   not resolve, so the table was written in one form and people write in
   another. The obvious fix is a stemmer. It was prototyped and it is the wrong
   instrument here, and the numbers are the argument:

   The fourteen rules below, run over the 145 single word keys, generate 438
   forms. Of those 438, thirty one are confirmed by a corpus this repository
   actually holds. Seven percent. The other 407 are strings like ashams and
   anxiousing: harmless, because they never occur, and corrosive, because a
   lexicon nobody can read is a lexicon nobody can audit, and this product
   shows a person why.

   Worse, three of the thirty one confirmed forms are real English words with a
   different meaning, and two of those three fold off COHERENT keys, which
   subtract. A stemmer would have had the word contents lowering somebody's
   reading. A false positive in a somatic reading costs more than a miss, so
   the refusals are by name, in the table below, with the reason.

   So: the rules stay in the engine, because they are pure and tiny and the
   gate uses them to prove that every admitted form is reachable from a real
   key. The corpus stays out, because the engine may not read a file. What
   crosses the boundary is the confirmed list, and proto/sniffer/ holds the
   tool that produced it and re-runs it when a corpus grows.

   THE CORPUS, NAMED. index.html, the owner's own book, 117,716 words and
   7,667 distinct surface forms, plus the fourteen persona voices the product
   ships. A form neither confirms is not admitted, because admitting it is an
   unmeasured claim. When the record store exists there will be a third and
   much better corpus, and this list grows by re-running the tool rather than
   by anybody's judgement about what a person might write.

   A FOLD CHANGES THE SURFACE FORM AND NOTHING ELSE. Same seat, same amount,
   same stated fetter, same charge name. The gate asserts all four, so a fold
   can never be the back door through which a new reading arrives.
   ============================================================ */
var LEX_FOLD_RULES=[
 ['s',   function(k){return !/(s|x|z|ch|sh|y)$/.test(k);},                   function(k){return k+'s';}],
 ['es',  function(k){return /(s|x|z|ch|sh)$/.test(k);},                      function(k){return k+'es';}],
 ['ies', function(k){return /[^aeiou]y$/.test(k);},                          function(k){return k.slice(0,-1)+'ies';}],
 ['ed',  function(k){return /[^ey]$/.test(k)&&!/(ed|ing|ness)$/.test(k);},   function(k){return k+'ed';}],
 ['d',   function(k){return /e$/.test(k);},                                  function(k){return k+'d';}],
 ['ied', function(k){return /[^aeiou]y$/.test(k);},                          function(k){return k.slice(0,-1)+'ied';}],
 ['ing', function(k){return /[^ey]$/.test(k)&&!/(ed|ing)$/.test(k);},        function(k){return k+'ing';}],
 ['eing',function(k){return /e$/.test(k);},                                  function(k){return k.slice(0,-1)+'ing';}],
 ['ped', function(k){return /[^aeiou][aeiou][pgmnt]$/.test(k);},             function(k){return k+k.slice(-1)+'ed';}],
 ['ping',function(k){return /[^aeiou][aeiou][pgmnt]$/.test(k);},             function(k){return k+k.slice(-1)+'ing';}],
 /* backward, off a past participle the table already holds */
 ['V',   function(k){return /[a-z]{3}ed$/.test(k);},                         function(k){return k.slice(0,-2)+'ing';}],
 ['Vs',  function(k){return /[a-z]{3}ed$/.test(k);},                         function(k){return k.slice(0,-2)+'s';}],
 ['Vy',  function(k){return /[a-z]{2}ied$/.test(k);},                        function(k){return k.slice(0,-3)+'ying';}],
 ['ness',function(k){return /[a-z]{4}$/.test(k)&&!/(ness|ion|ity|ing|ed|s)$/.test(k);},function(k){return k+'ness';}]];

/* THE ALLOW LIST. Twenty seven forms. Every one is generated by a rule above
   from a key above, and confirmed by the named corpus. The gate asserts both,
   so a form hand typed in here with no reachable base is refused. */
var LEX_FOLD_OK=['abandoning','betrays','calmed','calming','clenching','dismissing',
 'draining','drains','flattens','funerals','hurts','interrupting','interrupts',
 'isolating','losses','numbness','overwhelming','rejecting','rejects','resting',
 'screaming','settling','snapping','tensed','terrifying','tightness','yelling'];

/* THE REFUSE LIST, and read this before adding to the one above. Each of these
   IS generated by a rule and IS confirmed by the corpus, and each is refused
   because the form is a different word in ordinary use. Two of the four fold
   off coherent keys, where a false positive lowers a reading rather than
   raising it, which is the more dangerous direction and the harder one to
   notice. */
var LEX_FOLD_NO={
 contents:'the contents of a box, not the state of being content, and content subtracts',
 laughing:'the person laughing, where laughed in this table means being laughed at',
 rests:'it rests on the table, not the person resting, and rested subtracts',
 tenses:'the tenses of a verb, not a body tensing'};

/* ============================================================
   THE DEAD ROWS, NAMED, because a row that matches nothing looks live.

   Found by the gate that asserts every entry can actually be found by the
   scanner, which is a check nothing had. Two of the 192 authored entries cannot
   be reached, and they predate this pass:

     cannot stop thinking   seated at the third eye, amount 24, rumination
     cant stop thinking     the same

   Both are eaten by the phrase cannot stop, which is seated at the sacral at
   amount 18 and labelled compulsion. scanStory adds phrases first and then
   suppresses any later match overlapping a hit already recorded, so the phrase
   wins at that offset whatever its length. Measured: i cannot stop thinking
   about it reads as {sacral:18}, compulsion, and the third eye rumination entry
   never lands. A person ruminating is told they are compulsive, at a lower
   amount, at the wrong seat.

   THE STATED RULE IS NOT THE IMPLEMENTED RULE, and that is the actual defect. A
   phrase outranks THE WORDS INSIDE IT, which is right and is why the rule
   exists. Here the lexicon entry CONTAINS the phrase and is strictly longer and
   strictly more specific, so the rule does not reach this case and the
   implementation decided it by loop order.

   NOT FIXED HERE, and that is deliberate. The fix is one clause in scanStory,
   and which way that clause goes is a ruling rather than a repair: does the
   longer specific entry beat the shorter idiom, or does an idiom always win.
   Both are defensible and they read differently. So the two rows are named
   here, with the reason, and the gate asserts the dead set is EXACTLY this
   table in both directions. A third dead row fails the gate. This one cannot
   quietly become three.
   ============================================================ */
var LEX_DEAD={
 'cannot stop thinking':'eaten by the phrase cannot stop, which is shorter, seated elsewhere and worth less',
 'cant stop thinking':'eaten by the phrase cant stop, the same way'};

/* run the fold. keys are snapshotted first: the pass writes into the table it
   reads from, and reading a table while growing it is how a generator quietly
   folds its own output. */
function lexFold(){
 var base=Object.keys(LEX).filter(function(k){return k.indexOf(' ')<0;});
 var made={}, out={added:0,already:0,refused:[],unreachable:[]};
 base.forEach(function(k){
  LEX_FOLD_RULES.forEach(function(r){
   if(!r[1](k)) return;
   var f=r[2](k);
   if(LEX[f]||made[f]) return;
   made[f]={from:k,rule:r[0]};});});
 LEX_FOLD_OK.forEach(function(f){
  if(LEX_FOLD_NO[f]){out.refused.push(f);return;}
  if(!made[f]){out.unreachable.push(f);return;}
  var k=made[f].from, e=LEX[k];
  var a=lexAdd(f,e[LEX_SEAT],e[LEX_AMT],e[LEX_FET]!=null?e[LEX_FET]:null,
   {src:'fold',from:k,rule:made[f].rule,cite:'corpus'});
  if(a.ok&&!a.already)out.added++; else if(a.already)out.already++;
  /* the charge name folds with the form. without this the folded word gets a
     seat and no axis, so the imprint comes back inferred, and inferred is the
     flag that decides what the product is allowed to say out loud. */
  if(ADJ2CHG[k])chgAdd(f,ADJ2CHG[k],{src:'fold',from:k,rule:made[f].rule,cite:'corpus'});});
 out.generated=Object.keys(made).length;
 return out;}
/* lexFold is NOT run here, and the reason is load order. lexRefuse checks a
   stated fetter against CHARGES, and CHARGES is declared in core.js, which
   MANIFEST loads after this file. Touching it from here throws at parse, which
   is the failure this repository's load order rule exists to prevent. So the
   vocabulary, its schema, its validator and its rules live with the vocabulary,
   and the passes are RUN at the top of sniff.js, which is the first module
   where the canon tables are in scope and still before anything can scan. */
