/* ============================================================
   THE RECIPE ENGINE. Round PD, his words: "the behaviours in the Compass are
   RECIPES. We probably need a recipe engine to design what those recipes are,
   that tie into the ritual, and tie into the protocol, and sniff for those
   behaviours, and it shows you which behaviours are running in you that are
   keeping you from achieving that."

   A RECIPE IS A POLE'S QUALITY TAKEN APART. The quality a teacher stands for
   (Musashi's power, Zoroaster's truth) is not one thing a person has or lacks,
   it is a set of behaviours done in four channels, Do, Think, Body and Say,
   and each of those is an INGREDIENT. The same pole's opposite is the same
   quality inverted, and that is a set of behaviours too, the INVERSION. A
   person is not at one end of a pole. They run some ingredients and some of
   the inversion's behaviours, in some channels, and the recipe is what makes
   that visible.

   THE FOUR THINGS THIS FILE DOES
     sniff     finds both halves in the person's own entries, with the sentence
               quoted and the entry it came from (recipeSniff)
     rank      puts the inversion's behaviours that are running in order, so
               the one most in the way of the quality is first (recipeBlockers)
     tie       builds the ritual that builds the ingredients and the release
               that clears the addresses the inversion sits at (recipeToRitual)
     say       the reason for each thing it shows, in plain words (recipeReason)

   WHAT IT DOES NOT CLAIM. It finds words in entries. A behaviour that is found
   is a behaviour a person wrote about, and the engine never says it is why a
   quality is missing, never says it is a trait of the person, and never gives
   a number for how well anything fits. Every sentence it returns is a sentence
   about what the entries describe. RECIPE_CLAIM is printed with the list.

   HOST FREE. It reads the entries it is handed, the sniffer's own public
   normaliser and negation guard (lawNorm, lawNegated, lawMatch in sniff.js)
   and, for the person's own reading, the live field (W) through one function,
   recipeCtx. Everything else is pure over its arguments, so it tests without a
   browser. The sniffer is called and not extended: the cue tables below are
   this file's.
   ============================================================ */
var RECIPE_CLAIM='This shows what your entries describe. It does not say why it happens.';
/* evidence kept per behaviour, and the longest quoted sentence. A sentence over
   the cap is cut at a word and marked, never cut silently. */
var RECIPE_EV_MAX=3;
var RECIPE_SNIP_MAX=200;
/* ---- THE CUES, one table, the owner's to edit ----
   A cue is a phrase a person writes when the behaviour is in their day. They
   are written the way the sniffer's own tables are (engine/sniff.js lawNorm):
   lowercase, no punctuation, an apostrophe is dropped, so "didn't" is didnt
   and nobody has to guess how a cue was spelt. They are SPECIFIC and
   FILMABLE: an event with a verb in it, never a mood word on its own and never
   a trait ("i am a liar"). Where a phrase could be said of somebody else it is
   written in the first person, because the sniffer's own known weakness is
   that "she lied to me" fires on the writer, and a recipe that accused the
   writer of what was done to them would be the instrument lying.

   TWO HALVES A POLE. `pos` is the quality's ingredient in each of the four
   channels (do, think, body, say) and `neg` is the inversion's behaviour in the
   same four, each with the addresses it sits at, which is how a behaviour in a
   sentence is tied back to the person's own reading. The addresses are the
   opposite's five marked addresses (engine/data/teachers.js), by name, and a
   test fails if one is not on that pole's list or does not resolve.

   NO PHRASE IS IN TWO BEHAVIOURS. A phrase that fired two recipes at once
   would read as the instrument finding the same sentence twice, so a gate
   asserts that every cue is unique across the whole table, after the same
   normalisation the match uses. */
var RECIPE_CUES={
 IL:{
  pos:{do:['gave it away and told nobody','without telling anyone','kept it quiet that i helped','helped someone who could do nothing for me','did it for no one in particular'],
       think:['asked what they needed','wondered what she needed','wondered what he needed','what did they need from me'],
       body:['my chest felt wide','my chest felt warm and open','my shoulders dropped and my chest opened','shoulders sat lower'],
       say:['said the kind thing and left it there','without waiting for thanks','did not wait for thanks','told her i was glad and meant it']},
  neg:{do:{c:['warm in the room','put on a warm face','made sure they saw what i did','did it so they would see','went cold when they left','went flat when the room emptied'],a:['Stage Performing','Seeking Validation','Manipulative Kindness']},
       think:{c:['wondered who noticed','did anyone notice','kept count of who noticed','hoped they noticed','nobody thanked me','nobody said thank you'],a:['Seeking Validation','Spiritual Pride']},
       body:{c:['my chest tightened when nobody was looking','chest got tight when no one was watching','felt hollow after they left','my face ached from smiling'],a:['Stage Performing','False Love']},
       say:{c:['told everyone what i did for','told the story of how i helped','after all i did for','after everything i did for','reminded them what i did for them'],a:['Manipulative Kindness','Spiritual Pride','Seeking Validation']}}},
 RE:{
  pos:{do:['changed my mind','went to see for myself','took another look at what i believed','tested it myself','i had it wrong'],
       think:['what would it change if it were true','wondered if i had it wrong','considered that i might be wrong','maybe i have this wrong'],
       body:['my jaw stayed loose while i listened','jaw relaxed while i listened','my forehead softened while they spoke'],
       say:['that changes what i thought','i had not seen it that way','tell me what you saw','i did not know that']},
  neg:{do:{c:['refused to look at the evidence','would not look at what they sent','avoided the one person who disagrees','changed the subject when it got close','shut the conversation down','walked away from the argument'],a:['Dogma','Denial Of Truth','Knowing Better Than God']},
       think:{c:['i already knew how this works','i already know how this goes','i knew it all along','there is only one way to see this','they are just wrong'],a:['Knowing Better Than God','Condemnation','Dogma']},
       body:{c:['my jaw set when they disagreed','jaw clenched when he disagreed','my jaw locked while she talked','my forehead tightened when they pushed back'],a:['Speaking To Be Right','Dogma']},
       say:{c:['let me finish','i cut her off','i cut him off','i talked over them','i told them they were wrong','that is not how it works','i corrected them'],a:['Speaking To Be Right','Condemnation']}}},
 DE:{
  pos:{do:['stopped when i had enough','left some on the plate','put the phone down and left it','slept on it before buying','waited a day before buying'],
       think:['who else would this serve','asked myself what i actually wanted','what is this want for'],
       body:['the craving peaked and passed','let the urge pass','sat with the urge until it faded','the pull faded on its own'],
       say:['that is enough for today','i have enough','i am done for today','i said that is enough']},
  neg:{do:{c:['bought it and wanted another','kept scrolling for hours','kept eating after i was full','ate past full','ordered another one','another drink and another','could not stop myself','kept refreshing it','binged'],a:['Addiction','Obsession','Infatuation']},
       think:{c:['once i have it i will be happy','as soon as i get it','i have to have it','i could not stop thinking about','i cannot stop thinking about'],a:['Obsession','Infatuation','Lust']},
       body:{c:['my belly stayed tight after i had it','stomach stayed tight after','still hungry after eating','a craving in my belly'],a:['Addiction','Lust']},
       say:{c:['just one more','i told myself just one more','just a little more','i promised myself just one'],a:['Addiction','Hypersexuality']}}},
 OR:{
  pos:{do:['kept the rule','kept my word even though it cost','followed the plan we agreed','wrote the plan down','told them the plan before we started'],
       think:['who is relying on this','who is standing on this plan','who depends on this plan'],
       body:['my throat felt steady when i said it','my voice was steady when i told them','my throat stayed open while i gave the plan'],
       say:['told the team the plan','said the plan out loud','told them before they built on it','told them the plan had changed']},
  neg:{do:{c:['changed the plan without telling','changed the rules without telling','went back on what we agreed','went behind their back','agreed in the meeting and then','said yes and did the opposite','broke the agreement','quietly undid'],a:['Betrayal','Deceit','Manipulation Through Emotion']},
       think:{c:['nobody will check','they will not find out','no one will find out','i can get away with it','the plan only has to work while they are watching'],a:['Deceit','Lying']},
       body:{c:['my throat went dry when i was asked','throat went dry when i had to repeat it','my mouth went dry when i had to explain','throat tightened when i had to explain the plan'],a:['Lying','Deceit']},
       say:{c:['told them one thing and told someone else another','said one thing in the meeting and another','said yes in the meeting','smooth talked','spun it','told them what they wanted to hear'],a:['Lying','Manipulation Through Emotion','Spiritual Language To Manipulate']}}},
 PO:{
  pos:{do:['did it again today even though','did my practice anyway','showed up at the same time','kept to my schedule','did the small version','paid for it myself','took the hit myself','covered the cost myself'],
       think:['what is the small version','what is the smallest version i can do','what can i still do today'],
       body:['my breath stayed low','breathed into my belly while i worked','belly stayed soft while i worked'],
       say:['i missed today and wrote one line','that one is on me','i own that','my mistake and i fixed it']},
  neg:{do:{c:['made them cover for me','got someone to cover for me','left it for them to finish','dumped it on','made her stay late','made him stay late','made them stay late','pushed them to work late','expected them to cover','passed the work to','piled it on them'],a:['Entitlement','Force','Superiority']},
       think:{c:['a day does not count unless','it does not count unless i won','i have to win','i need to win','i cannot lose'],a:['Need To Win','Competition']},
       body:{c:['my stomach clenched when someone else led','my gut clenched when he took the lead','stomach clenched when she set the pace','upper stomach clenched'],a:['Competition','Need To Win']},
       say:{c:['somebody will cover it','someone will cover it','it was his fault','it was her fault','it was their fault','because of him','because of her','because of them','showed no remorse','no remorse','never apologized','never apologised','refused to apologize','refused to apologise','would not own it','i blamed','blamed him','blamed her','blamed them','blamed it on','not my fault','he made me','she made me','they made me'],a:['Entitlement','Superiority','Force']}}},
 PE:{
  pos:{do:['noticed what i was feeling','named the feeling','noticed the urge and did not act','paused and noticed','watched the thought go by'],
       think:['described it as i would to the person in it','what is actually happening here','what do i actually see'],
       body:['the space between my eyebrows stayed soft','my forehead stayed soft while i looked','my eyes softened while i listened'],
       say:['i said what i saw','i said what i noticed','i told them what i saw before what i thought','i notice that']},
  neg:{do:{c:['put on a face','wore a mask','kept up the act','played the part','acted fine','pretended to be fine','pretended i was fine','faked it','put on my game face','managed how i came across'],a:['Stage Performing','Delusion','Distortion']},
       think:{c:['read him like a book','read her like a book','worked out how to handle him','worked out how to handle her','how to play him','how to manage her','what they wanted to see'],a:['Projection','Distortion','Stage Performing']},
       body:{c:['my face did not match how i felt','smiling while my stomach','smiling but my stomach','my face held a smile while'],a:['False Love','Stage Performing']},
       say:{c:['told them i was fine','told everyone i was fine','edited what i said','said whatever kept them happy'],a:['Delusion','Distortion','False Love']}}},
 TR:{
  pos:{do:['stopped to look at it','stood and watched','let myself be moved','let it move me','cried at it','took the step before i had proof','let her in','let him in'],
       think:['let it land before i explained it','let it sink in','did not try to explain it'],
       body:['my chest opened','my breath dropped as it landed','my chest felt wide while it landed'],
       say:['told her it moved me','told him it moved me','said it moved me','told someone what moved me']},
  neg:{do:{c:['waited until i was sure','waited for proof','wanted proof first','checked everything first','researched it again','read one more review','held back until i knew','held off until i knew','kept my distance until','stood at the edge of it'],a:['Overanalysis','Doubt','Distrust']},
       think:{c:['what if it is a mistake','i needed more information','i have to be sure','i needed to be sure','i could not be sure','i do not trust it','prove it'],a:['Cynicism','Distrust','Overanalysis']},
       body:{c:['my chest stayed braced','chest stayed shut','braced in my chest','my chest was closed','chest closed up'],a:['Closed Heart']},
       say:{c:['where is the evidence','what is the evidence','how do you know it is real','are you sure about that','it is too good to be true','too good to be true'],a:['Cynicism','Doubt']}}},
 CH:{
  pos:{do:['went for a walk to cool down','walked it off','lifted until the heat went','went for a run to burn it off','took a walk before i said anything','stood outside and breathed'],
       think:['where is the anger in my body','where do i feel it in my body','what is the anger doing in my body'],
       body:['heat rose in my legs and i stayed on my feet','felt the heat and stayed','i stayed on my feet while it rose'],
       say:['i need ten minutes','i need a minute','i said i needed a break','told him i needed time']},
  neg:{do:{c:['i yelled','i shouted','i screamed','i snapped at','i lost it','i lost my temper','i blew up','slammed the door','had a confrontation','confrontation with','got into it with','got into a fight','went off at','went flat','shut down for the afternoon','lay on the couch all afternoon','could not get off the couch','did nothing all afternoon','stared at the wall'],a:['Anger','Panic','Lethargy','Collapse']},
       think:{c:['i am either fine or finished','i was irritated','so irritated','irritated by him','irritated by her','irritated by them','annoyed at','i was furious','i was livid','so angry at','so angry with','i hated him','i hated her','pissed off','fed up with','fuming','i was done with them'],a:['Anger','Fear']},
       body:{c:['my belly locked','my stomach locked','my legs went heavy','my legs felt heavy','my chest was pounding','my heart was pounding','shaking with anger','my hands were shaking','heat in my face'],a:['Anger','Panic','Collapse']},
       say:{c:['i raised my voice','i swore at','i told him off','i told her off','i went quiet and said nothing','i stopped answering','gave him the silent treatment','gave her the silent treatment'],a:['Anger','Lethargy']}}},
 FL:{
  pos:{do:['made the call','made the decision at last','let the plan change','tried it another way','took another route','let it go and moved on'],
       think:['what does the day want to do','what wants to happen next','what is the next small move'],
       body:['my jaw loosened','my shoulders dropped and moved','shook it out','stretched and let it move'],
       say:['let us do it the other way','let us try it differently','let us change the plan','we can do it differently']},
  neg:{do:{c:['held onto the plan no matter what','stuck to the plan no matter','kept doing the same thing','kept the same routine even though','refused to change it','would not let it go','held the grudge','kept going over it','kept replaying it'],a:['Control','Possession','Resistance','Compulsion']},
       think:{c:['it has to be done this way','it has to go my way','it must be done my way','i could not let it go','i cannot let it go','i could not let go','i needed to control','if i let go it will all change'],a:['Control','Resistance','Possession']},
       body:{c:['my jaw was locked','my jaw was clenched all day','my hands were clenched','my fists were clenched','my shoulders were locked'],a:['Control','Resistance']},
       say:{c:['told the same story again','i said it again for the fourth time','i keep saying the same thing','here we go again','i have said this before'],a:['Possession','Avoidance Of Grief','Compulsion']}}},
 AL:{
  pos:{do:['did what i said i would','kept my promise even though no one would know','showed up as promised','did it without complaining','did it without a grudge','finished what i said i would'],
       think:['what do i owe them','asked myself what i owe','what did i say i would do'],
       body:['my back felt straight','stood tall while i said it','my spine felt long'],
       say:['i said i would and i did','i gave my word and kept it','i promised and i meant it']},
  neg:{do:{c:['broke my promise','broke my word','went back on my word','knew i should not and did','knew it was against the rules and','crossed the line','broke the rule','bent the rules','cut corners','skipped it again','let them down again'],a:['Excuse','Entitlement','Lust']},
       think:{c:['this once will not matter','just this once','this time is different','it is an exception','this is an exception','i deserve it','i earned it','the rules do not apply to me'],a:['Entitlement','Hubris','Knowing Better Than God']},
       body:{c:['my back slumped','my shoulders slumped when i was reminded','sank when they read out the rules'],a:['Excuse','Hubris']},
       say:{c:['i had a good reason','i had my reasons','i explained why it was fine','i told them why it was okay','i justified it','i made an excuse','i made excuses'],a:['Excuse','Hubris','Knowing Better Than God']}}},
 HO:{
  pos:{do:['did nothing and waited','left it alone','waited and let it finish','let it be','stopped checking it','turned off the notifications','stopped scrolling','put the phone away','gave it space'],
       think:['what finishes by itself','what would happen if i left it','what happens if i leave it'],
       body:['my hands rested open','my hands were open','my breath ran on its own','sat with my hands open'],
       say:['i will wait','i can wait','i said nothing and waited']},
  neg:{do:{c:['i rushed in to help','rushed to help','jumped in to fix it','jumped in and fixed it','stepped in and took over','took over from','fixed it for them','did it for them','swooped in','redid their work','could not help myself','had to step in'],a:['Savior Complex','Need To Be Needed','Force']},
       think:{c:['it needed one more fix','one more fix','they cannot do it without me','they cannot manage without me','somebody has to fix it','if i do not step in'],a:['Need To Be Needed','Savior Complex']},
       body:{c:['my hands itched to fix it','my hands reached before i decided','i reached in before i could stop myself','could not keep my hands off it'],a:['Force','Interrupting']},
       say:{c:['gave advice nobody asked for','offered advice nobody asked for','nobody asked but i told them','i told them how to do it','i told her how to do it','i told him how to do it','you should just','i cut in','jumped in with'],a:['Interrupting','Savior Complex','Need To Be Needed']}}},
 SA:{
  pos:{do:['passed it on','passed it along','shared what i learned','taught her what i knew','taught him what i knew','handed it on','gave them the credit','shared the credit','credited them'],
       think:['who gave me this','who taught me this','where did this come from'],
       body:['my hands felt open','sat with my palms up','my face felt open to the air'],
       say:['i learned this from','i got this from','credit goes to','thanks to her for this','thanks to him for this','she taught me this','he taught me this']},
  neg:{do:{c:['kept it to myself','kept it for myself','kept the credit','took the credit','took all the credit','took credit for','would not share it','kept the idea to myself','withheld it'],a:['Self-Exclusion','Denial Of Light','Rejection Of Spirit']},
       think:{c:['it is mine','nobody needs to know where i got it','they do not need to know where i got it','it was all me','i did it all myself'],a:['Denial Of Light','Distortion','Self-Exclusion']},
       body:{c:['my chest folded in','curled in on myself','folded in on myself','closed in on myself','withdrew into myself'],a:['Self-Exclusion','Nihilism']},
       say:{c:['i built this on my own','i made this from nothing','i figured it out myself','it started with me','i came up with this','what is the point of sharing it','what is the point of sharing'],a:['Distortion','Nihilism','Denial Of Light']}}},
 TU:{
  pos:{do:['told her the truth','told him the truth','told them the truth','said what happened','said the true thing','owned up to it','admitted it','came clean','confessed'],
       think:['what is actually so','what is true here','what really happened'],
       body:['my throat felt open','my throat opened','my breath dropped after i spoke','my throat felt clear after i said it'],
       say:['i said it plainly','i said it straight','i told them straight','i ended the sentence there','i did not soften it']},
  neg:{do:{c:['i lied','told a white lie','left out the part','kept it from them','kept it from her','kept it from him','hid it from them','hid it from her','hid it from him','covered it up','kept quiet about it'],a:['Lying','Denial Of Truth','Self-Silencing']},
       think:{c:['i could not say it','it was not worth saying','it would cost too much to say','it is probably nothing','they would not understand','it would ruin it','better not to say','it was easier not to say','i did not want to make it worse','i decided not to say'],a:['Self-Silencing','Excuse']},
       body:{c:['my throat closed','my throat closed up','my throat tightened before i spoke','swallowed the words','a lump in my throat','my voice caught','held my breath before i spoke'],a:['Self-Silencing','Talking To Avoid Feeling']},
       say:{c:['said it was fine when it was not','said it was nothing','said it was probably nothing','said i did not mind','told them it did not matter','talked around it','talked about something else','kept talking to fill the silence','made a joke of it','laughed it off'],a:['Talking To Avoid Feeling','Self-Silencing','Excuse']}}},
 NA:{
  pos:{do:['left it alone to grow','let it grow','gave it time','waited for the season','did only what it needed','took my hands off it','kept the same pace'],
       think:['what season is this','what season am i in','what does this need today','what does it need right now'],
       body:['breathed with the pace of the work','my breath slowed with the work','my hands relaxed on it'],
       say:['it is not ready yet','it will be ready when it is ready','it takes the time it takes','these things take time']},
  neg:{do:{c:['pushed it harder to make it grow','forced it to happen','tried to speed it up','rushed the process','pulled on it','kept pushing it','added more hours to it','overworked it','redid it again and again','kept tweaking it','kept polishing it'],a:['Force','Perfectionism','Rigidity']},
       think:{c:['it has to be perfect','it is not good enough yet','it should be further along by now','it should be done by now','there has to be a faster way','tried another method','signed up for another course','bought another book','the next thing will be the one'],a:['Perfectionism','Hubris','Endless Seeking']},
       body:{c:['my hands gripped the wheel while i waited','clenched my hands while i waited','tensed up while i waited','my shoulders were up around my ears'],a:['Rigidity','Force']},
       say:{c:['why is this taking so long','how long will this take','hurry up','just do it faster','is it done yet','are we there yet'],a:['Force','Hubris','Endless Seeking']}}}};

/* ---------------- the compiled table ----------------
   Every cue goes through lawNorm, the sniffer's own normaliser, once, so the
   spelling a cue was written in cannot differ from the spelling it is matched
   against. Built on first use and kept, because the sniffer's tables load after
   this file and nothing here may call them at load. */
var RECIPE_ROWS=null;
function recipeRows(){
 if(RECIPE_ROWS)return RECIPE_ROWS;
 var rows=[];
 TEACH_ORDER.forEach(function(k){
  var c=RECIPE_CUES[k]; if(!c)return;
  TEACH_CH.forEach(function(ch){
   rows.push({id:k+'.pos.'+ch, k:k, side:'pos', ch:ch, addrs:[], raw:c.pos[ch].slice(),
    cues:c.pos[ch].map(function(x){return lawNorm(x).trim();})});});
  TEACH_CH.forEach(function(ch){
   rows.push({id:k+'.neg.'+ch, k:k, side:'neg', ch:ch, addrs:c.neg[ch].a.slice(), raw:c.neg[ch].c.slice(),
    cues:c.neg[ch].c.map(function(x){return lawNorm(x).trim();})});});});
 RECIPE_ROWS=rows; return rows;}
function recipeRow(id){
 var r=recipeRows(); for(var i=0;i<r.length;i++)if(r[i].id===id)return r[i];
 return null;}
/* the step of the pole's own ritual that builds each channel. Do is built by the
   pole's practice, which is the last step of its ritual. Body is built by the
   grounding, the first step. Think and Say are built by the lines step, which
   is where a sentence is said and held at a seat. Read off BECOMING and never
   typed, so a ritual edited there is a recipe edited here. */
function recipeBuilds(k,ch){
 var s=BECOMING[k]; if(!s)return null;
 var step=(ch==='do')?s[s.length-1]:(ch==='body'?s[0]:'aff_'+k);
 var p=null; for(var i=0;i<PRACTICE.length;i++)if(PRACTICE[i].k===step)p=PRACTICE[i];
 return p?{step:step, nm:p.nm, min:p.min}:{step:step, nm:step, min:0};}
/* ONE RECIPE, composed. The ingredients are the quality's four behaviours, each
   with the cues the sniffer looks for and the step that builds it. The inversion
   is the opposite's four, each with the addresses it sits at. Null for a key
   nobody was issued. */
function recipeFor(k){
 var P=teachPole(k); if(!P||!RECIPE_CUES[k])return null;
 var ids=teachMarkIds(k), byName={};
 TEACH_ROWS.forEach(function(r){if(r.k===k)r.marks.forEach(function(nm,i){byName[nm]=ids[i];});});
 return {k:k, who:P.who, word:P.word, opposite:P.opp.nm, seat:P.seat||P.home||null,
  ingredients:TEACH_CH.map(function(ch){var r=recipeRow(k+'.pos.'+ch);
   return {id:r.id, ch:ch, behaviour:P.imp.pos[ch], cues:r.raw.slice(), builds:recipeBuilds(k,ch)};}),
  inversion:TEACH_CH.map(function(ch){var r=recipeRow(k+'.neg.'+ch);
   return {id:r.id, ch:ch, behaviour:P.imp.neg[ch], cues:r.raw.slice(),
    addrs:r.addrs.map(function(nm){return {k:nm, id:byName[nm]===undefined?null:byName[nm]};})};})};}

/* ---------------- sniffing ----------------
   One sentence at a time, because a negator in the sentence before must not
   void a cue in the next (the sniffer learned that the expensive way, and
   lawNorm turns a sentence end into a bar for lawNegated to stop at). All
   fourteen poles' cues are matched together, longest first, so a long phrase
   is not also counted as the shorter one inside it. */
function recipeSentences(text){
 return String(text).split(/[.!?\n\r]+/).map(function(s){return s.replace(/\s+/g,' ').trim();})
  .filter(function(s){return s.length>0;});}
function recipeQuote(s){
 if(s.length<=RECIPE_SNIP_MAX)return s;
 var cut=s.slice(0,RECIPE_SNIP_MAX), sp=cut.lastIndexOf(' ');
 return (sp>40?cut.slice(0,sp):cut)+'...';}
function recipeSniff(entries){
 var rows=recipeRows(), by={}, list=Array.isArray(entries)?entries:[];
 var ids=traceTimeIds(list), scanned=0;
 list.forEach(function(e,i){
  if(!e||typeof e!=='object'||typeof e.text!=='string')return;
  scanned++;
  recipeSentences(e.text).forEach(function(sent){
   var hits=lawMatch(lawNorm(sent),rows,'cues');
   hits.forEach(function(h){
    var b=by[h.row.id]||(by[h.row.id]={id:h.row.id, k:h.row.k, side:h.row.side, ch:h.row.ch,
     hits:0, entries:[], evidence:[]});
    b.hits++;
    if(b.entries.indexOf(ids[i])<0)b.entries.push(ids[i]);
    /* one quoted sentence is quoted once, however many cues it carries */
    if(!b.evidence.some(function(x){return x.entry===ids[i]&&x.snippet===recipeQuote(sent);}))
     b.evidence.push({entry:ids[i], at:(typeof e.t==='string'?e.t:null), snippet:recipeQuote(sent), cue:h.cue, order:i});});});});
 var poles=TEACH_ORDER.map(function(k){
  var pick=function(side){return TEACH_CH.map(function(ch){return by[k+'.'+side+'.'+ch];}).filter(Boolean)
   .map(function(b){
    /* the newest evidence first, and a stable order inside one entry */
    var ev=b.evidence.slice().sort(function(a,c){return c.order-a.order;}).slice(0,RECIPE_EV_MAX)
     .map(function(x){return {entry:x.entry, at:x.at, snippet:x.snippet, cue:x.cue};});
    var last=b.evidence.reduce(function(m,x){return x.order>m?x.order:m;},-1);
    return {id:b.id, k:b.k, side:b.side, ch:b.ch, hits:b.hits, entries:b.entries.slice(), evidence:ev, last:last};});};
  return {k:k, present:pick('pos'), running:pick('neg')};});
 return {scanned:scanned, poles:poles};}
function recipeScanOf(sn,k){
 for(var i=0;i<sn.poles.length;i++)if(sn.poles[i].k===k)return sn.poles[i];
 return {k:k, present:[], running:[]};}
/* THE POLES WHOSE INVERSION IS RUNNING, most first, for a list that wants to
   mark them. Ties break in roster order, so two runs give one order. */
function recipeRunning(entries){
 var sn=recipeSniff(entries);
 return sn.poles.map(function(p,i){return {k:p.k, running:p.running.length, present:p.present.length, i:i};})
  .filter(function(x){return x.running>0;})
  .sort(function(a,b){return b.running-a.running||a.i-b.i;})
  .map(function(x){return {k:x.k, running:x.running, present:x.present};});}

/* ---------------- the person's own reading ----------------
   The one impure line. A recipe ties a sentence to an address, and whether the
   address is carrying is the field's to say, so it is read once into a plain
   object and everything below is pure over it. Callers load the profile first
   (loadProfile, which is what the app and the gates already do). A blank field
   is `unread`, and unread says so rather than reading as nothing carrying. */
function recipeCtx(){
 var r=compute(), sq={}, seats={};
 W.forEach(function(n){
  sq[n.i]=n.sq;
  var s=seats[n.b]||(seats[n.b]={sum:0,hot:0,tot:0});
  s.sum+=n.sq; s.tot++; if(n.sq>=4)s.hot++;});
 return {unread:!!r.unread, DQ:r.DQ, pacing:r.unread?1:pacingStep(r.DQ),
  sq:sq, seats:seats, heaviest:r.darkB||null};}
/* an address is carrying from 4 out of 10, the product's own line */
var RECIPE_CARRY=4;
function recipeAddr(ctx,a){
 var n=null; for(var i=0;i<NODES.length;i++)if(NODES[i].i===a.id)n=NODES[i];
 var v=(ctx&&ctx.sq&&ctx.sq[a.id]!==undefined)?ctx.sq[a.id]:null;
 return {id:a.id, k:a.k, seat:n?n.b:null, charge:n?(n.cf||null):null,
  sq:v, carrying:v!==null&&v>=RECIPE_CARRY};}

/* ---------------- blockers ----------------
   The inversion's behaviours that are running in this person, in the order
   they are most in the way. THE ORDER, and why it is not arbitrary:
     1  behaviours whose addresses are carrying come first, because a pattern
        found in words AND held in the body is the one a release can reach
     2  then the one found in more entries, because a behaviour that keeps
        coming back is the one to start on
     3  then the one found more times, then the channel in the order Do, Think,
        Body, Say, then the id
   A behaviour whose own quality is shown beside it, in the same channel, in an
   entry at least as new, is marked `eased` and sorts after the ones that are
   not, because the person is already doing something else there. Nothing in
   the order is a score and none is returned: an order is all a surface gets. */
function recipeBlockers(profile,k,o){
 o=o||{};
 var P=teachPole(k); if(!P)return [];
 var sn=o.scan||recipeSniff(profile&&profile.story&&profile.story.entries);
 var mine=recipeScanOf(sn,k), ctx=o.ctx||null;
 var ids=teachMarkIds(k), byName={};
 TEACH_ROWS.forEach(function(r){if(r.k===k)r.marks.forEach(function(nm,i){byName[nm]=ids[i];});});
 var out=mine.running.map(function(b){
  var row=recipeRow(b.id);
  var addrs=row.addrs.map(function(nm){return recipeAddr(ctx,{id:byName[nm],k:nm});});
  var pos=null; mine.present.forEach(function(x){if(x.ch===b.ch)pos=x;});
  var eased=!!(pos&&pos.last>=b.last);
  return {id:b.id, k:k, ch:b.ch, behaviour:P.imp.neg[b.ch], hits:b.hits, entries:b.entries.length,
   evidence:b.evidence, addrs:addrs, carrying:addrs.filter(function(a){return a.carrying;}).length,
   eased:eased, reason:null};});
 out.sort(function(a,b){
  return (a.eased-b.eased)||(b.carrying>0)-(a.carrying>0)||(b.entries-a.entries)||(b.hits-a.hits)
   ||(TEACH_CH.indexOf(a.ch)-TEACH_CH.indexOf(b.ch))||(a.id<b.id?-1:(a.id>b.id?1:0));});
 out.forEach(function(x){x.reason=recipeReason('blocker',x);});
 return out;}
/* the ingredients of the quality that are already present, for the same list */
function recipeIngredients(profile,k,o){
 o=o||{};
 var P=teachPole(k); if(!P)return [];
 var sn=o.scan||recipeSniff(profile&&profile.story&&profile.story.entries);
 return recipeScanOf(sn,k).present.map(function(b){
  var x={id:b.id, k:k, ch:b.ch, behaviour:P.imp.pos[b.ch], hits:b.hits, entries:b.entries.length,
   evidence:b.evidence, builds:recipeBuilds(k,b.ch), reason:null};
  x.reason=recipeReason('ingredient',x); return x;});}

/* ---------------- the reasons, in plain words ----------------
   Never a number as a match score, never a cause. A count is a count of
   entries, with its unit, and never a count against a total. */
function recipeTimes(n){return n===1?'once':(n===2?'twice':n+' times');}
function recipeSeatWord(b){return String(b||'').toLowerCase();}
function recipeReason(kind,x){
 x=x||{};
 if(kind==='blocker'){
  var s='Your entries describe this '+recipeTimes(x.entries||0)+'.';
  var hot=(x.addrs||[]).filter(function(a){return a.carrying;});
  if(hot.length===1)s+=' '+hot[0].k+(hot[0].seat?', at the '+recipeSeatWord(hot[0].seat)+',':'')+' is carrying.';
  else if(hot.length>1)s+=' '+hot.map(function(a){return a.k;}).join(' and ')+' are carrying.';
  if(x.eased)s+=' Your newer entries also show the other way.';
  return s;}
 if(kind==='ingredient')
  return 'Your entries describe this '+recipeTimes(x.entries||0)+'.';
 if(kind==='release'){
  var nm=(x.names||[]);
  if(!nm.length)return '';
  return (nm.length===1?nm[0]+' is':nm.slice(0,-1).join(', ')+' and '+nm[nm.length-1]+' are')
   +' carrying, so a release is offered over '+(nm.length===1?'it':'them')+'.';}
 if(kind==='saved')return 'Written for '+(x.who||'this teacher')+'.';
 if(kind==='practice')return 'A step of the ritual toward '+String(x.word||'').toLowerCase()+'.';
 if(kind==='held')return (x.nm||'This step')+' opens as the charge drops.';
 if(kind==='lane-saved')return 'Your saved rituals that fit: none yet. Starting this one saves it there.';
 if(kind==='lane-release-unread')return 'Nothing read yet, so there is nothing to release.';
 if(kind==='lane-release-none')return 'Nothing to release here. No address this pole’s opposite sits at is carrying.';
 return '';}

/* ---------------- the tie to the ritual and the protocol ----------------
   NO SECOND WRITER AND NO SECOND RUNNER. This returns the plan in the shape
   ritStartPlan already takes and the addresses relPick already takes, and the
   surface hands them to those. The library order is the owner's round OX
   answer: the person's own saved rituals first, then the practices that ship
   in the app, and a release only when an address is carrying.

   PACING IS A GATE, NOT A SCORE. A step above the person's pacing step is
   held, never offered, which is becomingSteps and the sentence ritTeachHtml
   already says. Nothing is handed to a heavy field that ritFor would not hand
   it, and unread is step one, the cautious side, where ritFor reads unread as
   step three. That difference is deliberate: nothing has been measured, and a
   screen that offers things to do should not assume a light field. */
function recipeRelease(k,ctx){
 var P=teachPole(k); if(!P||!ctx)return null;
 var hot=teachMarkIds(k).map(function(id,i){return recipeAddr(ctx,{id:id,k:P.marks[i]});})
  .filter(function(a){return a.carrying;});
 if(!hot.length)return null;
 /* the heaviest charge among the ones carrying, so the release is one card's
    worth and not a spread: the group with the most weight, ties to the one
    named first in the node table */
 var g={}; hot.forEach(function(a){var c=a.charge||'';
  var x=g[c]||(g[c]={charge:c,sum:0,list:[]}); x.sum+=a.sq; x.list.push(a);});
 var best=Object.keys(g).map(function(c){return g[c];})
  .sort(function(a,b){return b.sum-a.sum||(a.charge<b.charge?-1:1);})[0];
 /* a run is capped, and four channels at an address is the smallest run, so
    the most addresses a run carries is the cap over the smallest. Read off the
    plan's own constants. */
 var most=Math.max(1,Math.floor(RUN_MAX/RUN_MIN));
 var list=best.list.slice().sort(function(a,b){return b.sq-a.sq||a.id-b.id;});
 return {charge:best.charge, addrs:list.slice(0,most).map(function(a){return a.id;}),
  names:list.slice(0,most).map(function(a){return a.k;}), rest:Math.max(0,list.length-most),
  seat:list[0].seat};}
function recipeFit(k,steps){
 /* the share of a candidate's steps that are in this pole's own ritual. A sort
    key and nothing else: it is not returned and it is not shown. */
 var mine=BECOMING[k]||[]; if(!steps||!steps.length)return 0;
 return steps.filter(function(s){return mine.indexOf(s)>=0;}).length/steps.length;}
function recipeToRitual(profile,k,o){
 o=o||{};
 var P=teachPole(k), b=becomingOf(k); if(!P||!b)return null;
 var ctx=o.ctx||null, tier=ctx?ctx.pacing:1;
 var s=becomingSteps(k,tier);
 var plan={tc:k, steps:s.steps.slice(), days:7,
  band:b.seat||b.home||((ctx&&!ctx.unread&&ctx.heaviest)||'')};
 var held=s.held.map(function(x){var p=recipePractice(x); return {step:x, nm:p?p.nm:x, reason:recipeReason('held',{nm:p?p.nm:x})};});
 var rel=ctx?recipeRelease(k,ctx):null;
 /* the person's saved rituals that fit: written toward this pole, or built of
    its own steps. Sorted by how much of the plan is this pole's, then the
    shorter first, then the id, and shown with a reason and no number. */
 var own=PRACTICE.filter(function(p){return p.tc===k;}).map(function(p){return p.k;});
 var saved=(Array.isArray(o.saved)?o.saved:[]).filter(function(p){
  return p&&Array.isArray(p.steps)&&(p.tc===k||p.steps.some(function(x){return own.indexOf(x)>=0;}));})
  .map(function(p){return {p:p, f:recipeFit(k,p.steps), m:recipeMinutes(p.steps)};})
  .sort(function(a,c){return c.f-a.f||a.m-c.m||(a.p.id<c.p.id?-1:1);})
  .map(function(x){return {id:x.p.id, steps:x.p.steps.slice(), tc:x.p.tc||null, reason:recipeReason('saved',{who:P.who})};});
 var shipped=plan.steps.map(function(x){var p=recipePractice(x);
  return {step:x, nm:p?p.nm:x, min:p?p.min:0, own:own.indexOf(x)>=0,
   reason:recipeReason('practice',{word:P.word})};});
 var lanes=[
  {kind:'saved', items:saved, empty:saved.length?null:recipeReason('lane-saved')},
  {kind:'practice', items:shipped, empty:null},
  {kind:'release', items:rel?[rel]:[], empty:rel?null:(ctx&&ctx.unread?recipeReason('lane-release-unread'):recipeReason('lane-release-none'))}];
 if(rel)lanes[2].reason=recipeReason('release',rel);
 return {k:k, tc:k, who:P.who, word:P.word, pacing:tier, plan:plan, held:held,
  protocol:rel, lanes:lanes, order:lanes.map(function(l){return l.kind;})};}
/* two small readers so this file needs nothing from a renderer: a practice by
   key, and the minutes of a list of steps. ritual.js has the same two for the
   page; these are the engine's own and read the same table. */
function recipePractice(key){for(var i=0;i<PRACTICE.length;i++)if(PRACTICE[i].k===key)return PRACTICE[i];return null;}
function recipeMinutes(steps){return (steps||[]).reduce(function(a,x){var p=recipePractice(x);return a+(p?p.min:0);},0);}
