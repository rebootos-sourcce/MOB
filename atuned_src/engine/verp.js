
/* ============================================================
   THE SIX AXES. Three higher gates and three lower gates. This is
   not a display, it is a COST MULTIPLIER on every held pattern.
   A lower gate multiplies what the pattern costs down. A higher
   gate multiplies it up. It moves every CQ in the app.
   ============================================================ */
var VERP=[
 {k:'aware',  nm:'Awareness',  side:'higher', d:'I was present with the sensation.'},
 {k:'detach', nm:'Detachment', side:'higher', d:'I felt it and stayed out of the story.'},
 {k:'intent', nm:'Intention',  side:'higher', d:'It rose and it did not move me off what I was doing.'},
 {k:'ignore', nm:'Ignorance',  side:'lower',  d:'I did not see it coming, or I chose not to look.'},
 {k:'attach', nm:'Attachment', side:'lower',  d:'The story had me. I went with it.'},
 {k:'averse', nm:'Aversion',   side:'lower',  d:'I went around it. I avoided the thing.'}];
var VERPMULT={aware:0.7, detach:0.6, intent:0.75, ignore:1.3, attach:1.35, averse:1.25};
var VERPMIX={aware:0,detach:0,intent:0,ignore:0,attach:0,averse:0};
var VERPCUE={
 aware:['i noticed','i was aware','i felt it','i could feel','present with','i watched'],
 detach:['let it pass','did not take it','stayed out of','let it go','watched it without','did not bite'],
 intent:['kept going','did it anyway','stayed on','finished it','did not stop','carried on'],
 ignore:['did not see','had no idea','did not notice','blindsided','chose not to look','ignored'],
 attach:['could not stop','went with it','took it personally','spiralled','spiraled','it had me','kept going over'],
 averse:['avoided','went around','put it off','changed the subject','walked away','did not want to']};

/* ============================================================
   THE LEAN. benign against malignant, read from the story itself, and it
   is now TWO CHANNELS rather than one axis.

   His two dimensions, in his words: empathy or its lack, accountability or
   its lack. They are counted separately and summed afterwards, because a
   single axis cannot say which of the two moved, and the first list mixed
   them without saying so: "i understood" and "listened" were empathy,
   "my fault" and "owned it" were accountability, "not my problem" and
   "their fault" were the lack of the second, and all four landed on one
   number.

   WHAT THIS IS NOT. It is not a verdict on a person. A story that blames
   outward is a story that blames outward. The words benign and malignant
   are his and they are right as internal names for a direction of travel;
   they are not a diagnosis and no surface may print one.

   THE FAILURE MODE THIS IS BUILT AGAINST, and it was shipped behaviour.
   Somebody writing honestly about being harmed uses the language of blame,
   because they were blamed against. Measured on the shipped list: an
   account of a parent read 60 of 100 malignant and an account of taking
   full responsibility read 11 of 100, so the person who did nothing wrong
   scored five times worse than the person who did the harm and owned it.

   Four separate defects produced that, each reproduced before it was
   fixed:

   1. NO NEGATION. 'my fault' was a benign cue and matched inside "it was
      not my fault", so a denial of fault read as taking it.
   2. NO PRECEDENCE. 'let them' was benign and 'let them think' was
      malignant, and the scanner used a bare indexOf, so "let them think i
      did not know" scored one of each. The sniffer has had the rule for
      this since it was written: a phrase outranks the words inside it.
      Both faults are fixed by the same rule, ported from scanStory.
   3. SUBJECT BLINDNESS. 'should have known' was malignant, and its
      subject can be the writer or the other person. Self blame and other
      blame landed on the same number.
   4. NO FRAME. Reporting what another person did and refusing your own
      part in something you did use identical words. 'their fault' said
      about an abuser is accurate. Said about a partner you hurt it is
      evasion. Word matching alone cannot separate them, so the lack side
      is now gated on evidence of the writer's own agency and is not read
      at all without it. See leanFrame.
   ============================================================ */

/* The two channels, four counts. Presence and lack are separate counts and
   not two ends of one number, because absence of blame is not the same
   evidence as presence of ownership and they must be able to disagree. */
var LEANCH=[
 {k:'emp',     ch:'empathy',        dir:'shown', gate:false, nm:'Empathy shown'},
 {k:'empLack', ch:'empathy',        dir:'lack',  gate:true,  nm:'Empathy withheld'},
 {k:'acc',     ch:'accountability', dir:'shown', gate:false, nm:'Accountability taken'},
 {k:'accLack', ch:'accountability', dir:'lack',  gate:true,  nm:'Accountability refused'}];

/* EMPATHY SHOWN. Three mechanisms, after the EPITOME framework for
   assessing empathy in text: naming another's state, taking their
   position, and asking. Plus the prosocial behaviour category LIWC-22
   added. Every entry names another person, because empathy is directed
   and a phrase with no object is not evidence of it. */
var LEANLEX={
 emp:[
  /* interpretation. naming the other person's inner state */
  'they were hurt','she was hurt','he was hurt',
  'they were scared','she was scared','he was scared',
  'they were frightened','they were exhausted',
  'they were struggling','she was struggling','he was struggling',
  'they were doing their best','she was doing her best','he was doing his best',
  'they did their best','she did her best','he did his best',
  'they were carrying','she was carrying','he was carrying',
  'they must have felt','she must have felt','he must have felt',
  'they felt','she felt','he felt',
  /* perspective taking */
  'i can see why','i can see how','i understand why','i understood why','i get why',
  'i see why they','i see why she','i see why he',
  'from their side','from her side','from his side',
  'in their shoes','in her shoes','in his shoes',
  'their point of view','her point of view','his point of view',
  'if i were them','if i were her','if i were him',
  'what it was like for them','what it was like for her','what it was like for him',
  'how it landed for them','how it landed for her','how it landed for him',
  'it makes sense that they','it makes sense that she','it makes sense that he',
  'i had not thought about how','i understood',
  /* exploration. asking rather than assuming */
  'i asked them how','i asked her how','i asked him how',
  'i asked how they','i asked what they',
  'i listened to them','i listened to her','i listened to him','i listened',
  'i let them finish','i let her finish','i let him finish',
  'i wanted to understand','i wanted to know how',
  'i checked on them','i checked on her','i checked on him',
  /* prosocial behaviour */
  'i stayed with them','i sat with them','i held them','i comforted',
  'i looked after','i was gentle with','i was kind to',
  'i made space for','i gave them room','i thanked them',
  'i forgave them','i forgave her','i forgave him','i forgave'],

 /* EMPATHY WITHHELD. Contempt first, because contempt is the one
    construct here with a measured predictive record: in the Gottman
    observational work on couples it is the single strongest predictor of
    divorce. Then dismissal of another's state, the moralization category
    LIWC-22 added, overgeneralisation, and retaliation. EVERY ONE IS
    GATED. A person describing being disbelieved writes "they always said
    i was making it up", and that is a report, not contempt. */
 empLack:[
  /* contempt and derogation */
  'typical of them','typical of her','typical of him',
  'of course they did','of course she did','of course he did',
  'what do you expect from them','what do you expect from her','what do you expect from him',
  'they are pathetic','she is pathetic','he is pathetic',
  'they are useless','she is useless','he is useless',
  'they are an idiot','she is an idiot','he is an idiot','what an idiot',
  'they are a joke','she is a joke','he is a joke',
  'they are weak','she is weak','he is weak',
  /* dismissal of the other's state */
  'i do not care how they','i do not care what they',
  'i do not care how she','i do not care how he',
  'they need to get over','she needs to get over','he needs to get over',
  'they are overreacting','she is overreacting','he is overreacting',
  'they are being dramatic','she is being dramatic','he is being dramatic',
  'they are too sensitive','she is too sensitive','he is too sensitive',
  'their feelings are not my','that is not my job to',
  /* moralization */
  'they deserved it','she deserved it','he deserved it',
  'they had it coming','serves them right','serves her right','serves him right',
  'they should be ashamed','she should be ashamed','he should be ashamed',
  'they are a bad person','they brought it on themselves',
  /* overgeneralisation */
  'they always','she always','he always',
  'they never','she never','he never',
  'they are all the same','every single time they',
  /* retaliation and withdrawal */
  'i got them back','i wanted to punish','i wanted them to hurt',
  'i made sure they knew','i let them stew','i shut them out',
  'i gave them the silent treatment','i stopped answering','i would not look at'],

 /* ACCOUNTABILITY TAKEN. Ownership, repair, and causal self reference
    that is explicitly about the writer's own act.

    WHERE FOLLOWING THE LITERATURE LITERALLY WOULD HAVE BROKEN THIS. The
    Pennebaker expressive writing finding is that rising causal and
    insight words track improvement, so 'because i was' and 'i realised'
    look like obvious entries. They are not accountability. "because i was
    eleven" and "i realised he was never going to change" are insight
    about being harmed, and both are common in exactly the accounts this
    must not misread. Worse, this list feeds the frame gate below, so a
    false entry here opens the lack side on a harm account. Only causal
    forms naming the writer's own act are kept. */
 acc:[
  'i was wrong','i was in the wrong','it was my fault','my own fault','my fault',
  'i own that','i own it','i owned it','i owned up to it','i owned up',
  'i take responsibility','i took responsibility',
  'i am responsible for','i was responsible for','i caused',
  'i apologised','i apologized','i said sorry','i told them sorry',
  'i made it right','i put it right','i made amends','i paid it back','i fixed it',
  'i came clean','i told them the truth','i told the truth',
  'i was honest','i admitted it','i admitted','i confessed',
  'i see what i did','i can see what i did','i know what i did','i know why i did',
  'what i was actually doing','my part in','my share of',
  'i had a part in','i contributed to',
  'next time i will','i will not do that again','i will do better',
  'i need to change','i have to change',
  'i chose to','i chose that','i made that choice','i decided to'],

 /* ACCOUNTABILITY REFUSED. External stable attribution, after the
    dimensions the Leeds Attributional Coding System codes; defensiveness,
    which in the Gottman work is claiming oneself blameless and deflecting
    back; counterfactual blame; concealment; and score keeping. EVERY ONE
    IS GATED, and the two that most need to be are concealment and score
    keeping: "i did not tell anyone" is survival in a harm account, and
    "they owe me those four years" is an accurate moral claim. */
 accLack:[
  /* external attribution */
  'their fault','her fault','his fault','not my fault',
  'nothing to do with me','i had nothing to do with',
  'not my problem','not my job',
  /* defensiveness */
  'i only did it because they','i only did it because she','i only did it because he',
  'they made me do it','she made me do it','he made me do it',
  'they left me no choice','anyone would have','what was i supposed to do',
  'i did not do anything wrong','i did nothing wrong',
  'i never said that','you are twisting',
  /* counterfactual blame */
  'if they had just','if she had just','if he had just',
  'if they had not','if she had not','if he had not',
  'if they had listened','if she had listened','if he had listened',
  'none of this would have happened if they',
  'they started it','they started this','she started it','he started it',
  /* concealment */
  'i kept it to myself','i did not tell them','i did not tell her',
  'i did not tell him','i did not tell anyone',
  'i let them think','i let her think','i let him think',
  'i left that part out','they did not need to know',
  'i covered it up','i made sure they never found out',
  /* score keeping */
  'they owe me','she owes me','he owes me',
  'after everything i did','after everything i have done',
  'i was the only one who','i am the only one who',
  'nobody appreciates','no one appreciates','they never once thanked',
  'i deserve better than','i deserved better','i was the bigger person']};

/* LEANCUE is kept, and it is now derived rather than authored. The old name
   and the old two way shape still exist for anything that reads them, and
   they can no longer disagree with the channels. */
var LEANCUE={
 benign:LEANLEX.emp.concat(LEANLEX.acc),
 malignant:LEANLEX.empLack.concat(LEANLEX.accLack)};

/* ============================================================
   THE FRAME, which is the part that makes the lack side defensible.

   Two acts use identical words. REPORTING names what another person did.
   DEFLECTING refuses your own part in something you did. A matcher cannot
   tell them apart from the phrase, so it looks at something else: whether
   the writer has placed themselves as an agent at all.

   Deflection needs an own act to deflect from. So the lack side is
   admitted in proportion to the writer's own agency and damped by
   evidence of being acted upon.

   THE SAFETY DOES NOT DEPEND ON THE HARM LIST BEING COMPLETE, which
   matters because no such list ever is. With no self agency evidence the
   admitted fraction is zero whatever the harm list holds. An incomplete
   harm list costs a missed deflection. An incomplete self list costs the
   same. Neither costs a survivor being called malignant, and that is the
   direction the asymmetry is chosen for: a false positive on the lack
   side is the one error this product cannot afford, so the threshold
   follows from that and not from a balanced score. */
var LEANFRAME={
 /* THE WRITER AS THE ONE ACTED UPON. Reporting evidence. */
 other:[
  'i was a child','i was little','i was young','i was too young','i was only',
  'i had no choice','i could not leave','i had nowhere to go','i was trapped',
  'i was scared','i was terrified','i was frightened','i was not safe',
  'against my will','without my consent','i did not ask for','i never asked for',
  'i was told i had to','i was made to','i was not allowed','i had to','i ended up',
  'i begged','i said no',
  'i asked them to stop','i asked him to stop','i asked her to stop',
  'nobody helped me','no one helped me','nobody believed me','no one believed me',
  'i was not believed','i was making it up','i was overreacting',
  'i was being dramatic','i was too sensitive',
  'hit me','hurt me','pushed me','grabbed me','shoved me','held me down','locked me',
  'shouted at me','screamed at me','yelled at me','threatened me','lied to me',
  'laughed at me','humiliated me','ignored me','blamed me','followed me','touched me',
  'used me','cheated on me','took credit','took the credit',
  'in front of everyone','came into my room','would not stop',
  'i needed the job','because of the kids'],
 /* THE WRITER AS THE ONE ACTING, on somebody else. This is the gate
    opener and it is deliberately narrow. A person describing being
    harmed does not write "i hurt her" about the harm done to them, so
    requiring this fails closed in the safe direction. 'i left them' and
    'i walked out' were drafted here and removed: in an account of
    coercive control, leaving is escape and not harm done. */
 self:[
  'i hurt them','i hurt her','i hurt him','i hurt someone',
  'i lied to','i lied about','i lied',
  'i shouted at','i screamed at','i yelled at','i snapped at','i raised my voice',
  'i said things i','i took it out on',
  'i let them down','i let her down','i let him down',
  'i broke it','i broke my promise','i cheated on','i cheated',
  'i did not listen','i did not turn up','i did not show up',
  'i ignored them','i ignored her','i ignored him',
  'i went behind','i hid it from',
  'i blamed them','i blamed her','i blamed him',
  'i pushed them away','i shut them down',
  'i was cruel','i was harsh','i humiliated','i embarrassed them',
  'i slammed','i threw']};

/* WHAT WAS TAKEN OUT, and why, because a phrase removed with no reason is
   a phrase somebody puts back. Fifteen of the forty one shipped cues are
   here. Nine of them were doing real damage. */
var LEANOUT=[
 ['i had no choice','coercion in a harm account, evasion in a deflection. now a frame marker, scored on neither channel'],
 ['should have known','the subject can be the writer or the other person and the matcher cannot see which, so self blame and other blame landed on one number'],
 ['made me','matches i was made to, she made me laugh and he made me realise, which point three different ways'],
 ['let it go','already a detachment cue on the six gates, so one occurrence moved two instruments'],
 ['let them','matches let them think, which points the other way'],
 ['i did not tell','kept, but lengthened to name an object and moved behind the frame gate'],
 ['kept it to myself','kept, but behind the frame gate. concealment is survival in a harm account'],
 ['they started it','kept, but behind the frame gate. in an assault account it is literally true'],
 ['i was the only one','kept, but lengthened to i was the only one who, and gated'],
 ['proved them wrong','a contest, and it reads either way depending on what was contested'],
 ['reached out','contact, which is neither empathy nor accountability'],
 ['asked for help','contact, which is neither empathy nor accountability'],
 ['put it down','release, which the six gates already read'],
 ['showed up','attendance, which is neither channel'],
 ['gave them','too short to carry a direction'],
 ['stayed with','the object can be a person or a sensation, so it was not evidence of either']];

/* THE WEIGHTS, and each one has a reason or it is a magic number waiting
   to be questioned. */
var LEAN_FRAME_W=2;      /* one report marker outweighs two agency markers. the
                            asymmetry is the precision choice, stated above */
var LEAN_TRUST_CAP=0.62; /* his cap. the story never carries more than 62 of
                            100 of the reading, the field carries the rest */
var LEAN_TRUST_HALF=12;  /* matched phrases needed to reach half the cap. it was
                            seven phrases for the whole cap, which is a great
                            deal of confidence from seven substring matches */
var LEAN_MIN_CH=2;       /* under this many matched phrases a channel reports
                            read false. refusing to read is a legitimate answer
                            and it is the right one more often than not */

/* The mix accumulates. benign is a count of matched presence phrases.
   malignant is a WEIGHT, not a count: it is the lack phrases after the
   frame gate has been applied, so it is fractional and always at or below
   the raw count. The two are what persist, because the profile boundary
   accepts gates.lean.benign and gates.lean.malignant and nothing else, and
   widening that whitelist is not this seat's to do. Everything else here
   is a session number, and leanRead says so rather than reporting a zero
   it did not measure. */
var LEANMIX={benign:0,malignant:0,
 emp:0,empLack:0,acc:0,accLack:0,
 self:0,other:0,rawLack:0,texts:0};

/* ---------- the six gates ---------- */
function verpScan(text){
 var src=' '+String(text||'').toLowerCase().replace(/[^a-z' ]+/g,' ').replace(/\s+/g,' ')+' ';
 var hits={},tot=0;
 Object.keys(VERPCUE).forEach(function(g){hits[g]=0;
  VERPCUE[g].forEach(function(p){var at=src.indexOf(p);
   while(at>=0){hits[g]++;tot++;at=src.indexOf(p,at+1);}});});
 return {hits:hits,total:tot};}
function verpApply(text){var s=verpScan(text);if(!s.total)return s;
 Object.keys(s.hits).forEach(function(g){VERPMIX[g]+=s.hits[g];});return s;}
function verpShare(){
 var tot=Object.keys(VERPMIX).reduce(function(a,k){return a+VERPMIX[k];},0);
 if(!tot) return null;
 var out={};Object.keys(VERPMIX).forEach(function(k){out[k]=VERPMIX[k]/tot;});return out;}
/* THE MULTIPLIER. the weighted average of whichever gates the person runs.
   no story yet means no gate evidence, so it returns 1 and costs nothing. */
function verpFactor(){var sh=verpShare();if(!sh)return 1;
 var f=0;Object.keys(sh).forEach(function(k){f+=sh[k]*VERPMULT[k];});return f;}
function verpRead(){var sh=verpShare();
 return VERP.map(function(v){return {k:v.k,nm:v.nm,side:v.side,d:v.d,mult:VERPMULT[v.k],
  pct: sh?Math.round(sh[v.k]*100):0, n:VERPMIX[v.k]};});}
/* ---------- the lean ----------
   MATCH PRECEDENCE, ported from scanStory rather than invented. Every
   phrase from every list is scanned longest first, bounded by spaces, and a
   longer match blocks the shorter ones inside it. That one rule fixes two
   of the four shipped defects at once: 'not my fault' now beats 'my fault'
   and 'let them think' now beats 'let them'. The overlap predicate is the
   sniffer's, including the reason its window is length plus one and not
   length plus two: the trailing space of a match is the next word's
   leading space. */
/* NEGATION, and it is one mechanism rather than a longer list. The first
   cut fixed 'not my fault' by precedence alone, which works because that
   exact string is in the table. It does not generalise: "none of it was my
   fault" still matched 'it was my fault' and read as taking responsibility,
   measured on the deflection account before this was written. So a match is
   void if a negator stands within the three words directly before it. It
   applies to every list, because "it was not her fault, it was mine" is
   accountability and not blame, and "he did not hit me" is not a harm
   marker. A negator INSIDE a phrase is not affected, which is what keeps
   'i did not tell anyone' and 'i was not allowed' working. */
var LEANNEG={'not':1,'never':1,'no':1,'none':1,'nothing':1,'nobody':1,
 'cannot':1,'without':1,'hardly':1,'rarely':1,'barely':1};
var LEAN_NEG_W=3;        /* words of look back. three is one clause of run up,
                            and wider started voiding phrases whose negator
                            belonged to the sentence before */
function leanNegated(src,at){
 var pre=src.slice(0,at).split(' ');
 for(var i=pre.length-1,n=0;i>=0&&n<LEAN_NEG_W;i--){
  if(!pre[i])continue;
  if(pre[i]==='|')return false;
  if(LEANNEG[pre[i]])return true;
  n++;}
 return false;}

/* The sorted key list is built once and kept, because sorting the whole table on
   every story is work with one answer. THE CACHE IS KEYED ON THE SIZE OF THE
   TABLES rather than on a bare null, so a list edited at run time is picked up
   instead of silently having no effect. A cache that ignores its own input is
   how a table edit looks like it landed and did not. */
var LEANKEYS=null, LEANKEYN=-1;
function leanCount(){
 var n=0;
 LEANCH.forEach(function(c){n+=LEANLEX[c.k].length;});
 Object.keys(LEANFRAME).forEach(function(s){n+=LEANFRAME[s].length;});
 return n;}
function leanKeys(){
 var n=leanCount();
 if(LEANKEYS&&LEANKEYN===n) return LEANKEYS;
 LEANKEYN=n;
 var rows=[];
 LEANCH.forEach(function(c){LEANLEX[c.k].forEach(function(p){
  rows.push({p:p,k:c.k,fr:null});});});
 Object.keys(LEANFRAME).forEach(function(side){LEANFRAME[side].forEach(function(p){
  rows.push({p:p,k:null,fr:side});});});
 rows.sort(function(a,b){return b.p.length-a.p.length;});
 LEANKEYS=rows; return rows;}

/* THE NORMALISER KEEPS SENTENCE BOUNDARIES, which the rest of the engine
   does not need and this does. Stripping every mark to a space put "i said
   things i cannot take back. i lied to her" into one run of words, so the
   negator from the sentence before voided a true self action cue and the
   ownership account lost one of its four. A full stop, a question mark, a
   semicolon, a colon and a line break become a bar, which no phrase can
   contain, so it stops the look back and also stops a phrase matching
   across two sentences. A comma is left as a space on purpose: it is too
   weak a break to end a negation. */
function leanNorm(text){
 return ' '+String(text||'').toLowerCase()
  .replace(/[.!?;:\n\r]+/g,' | ')
  .replace(/[^a-z'| ]+/g,' ').replace(/\s+/g,' ')+' ';}

/* THE FRAME GATE. What fraction of the lack cues this text is allowed to
   read. Zero with no agency evidence, which is the whole point. */
function leanAdmit(self,other){
 if(self<=0) return 0;
 return self/(self+LEAN_FRAME_W*other);}

/* leanScan keeps its name and its two old keys. benign and malignant still
   come out and still mean what they meant, so anything reading them is
   unaffected. Everything else on the object is new. */
function leanScan(text){
 var src=leanNorm(text), rows=leanKeys(), hits=[], spans=[];
 rows.forEach(function(row){
  var t=' '+row.p+' ', at=src.indexOf(t);
  while(at>=0){
   /* SPANS, NOT HITS, DECIDE WHAT IS BLOCKED, and the difference is not
      cosmetic. A negated long match that was merely dropped left its own
      substring free to match, so negation on the long form was defeated by
      the short form inside it: "none of it was my fault" voided
      'it was my fault' and then matched 'my fault', and the deflection
      account read one accountability cue for a sentence that refuses all of
      it. Measured before this line was written. A voided match still
      consumes its span. */
   if(!spans.some(function(h){return h.at<=at&&at<h.at+h.len+1;})){
    spans.push({at:at,len:row.p.length});
    if(!leanNegated(src,at)) hits.push({p:row.p,k:row.k,fr:row.fr,at:at});}
   at=src.indexOf(t,at+1);}});
 hits.sort(function(a,b){return a.at-b.at;});
 var out={benign:0,malignant:0,emp:0,empLack:0,acc:0,accLack:0,
  self:0,other:0,rawLack:0,admit:0,hits:hits};
 hits.forEach(function(h){
  if(h.k) out[h.k]++;
  else if(h.fr==='self') out.self++;
  else out.other++;});
 /* accountability taken is agency evidence as well as a channel count. a
    person who names their own act has placed themselves as an agent. */
 var self=out.self+out.acc;
 out.admit=leanAdmit(self,out.other);
 out.rawLack=out.empLack+out.accLack;
 out.benign=out.emp+out.acc;
 out.malignant=out.rawLack*out.admit;
 return out;}

function leanApply(text){var s=leanScan(text);
 LEANMIX.benign+=s.benign; LEANMIX.malignant+=s.malignant;
 LEANMIX.emp+=s.emp; LEANMIX.empLack+=s.empLack;
 LEANMIX.acc+=s.acc; LEANMIX.accLack+=s.accLack;
 LEANMIX.self+=s.self; LEANMIX.other+=s.other;
 LEANMIX.rawLack+=s.rawLack; LEANMIX.texts++;
 return s;}

/* ONE CHANNEL, REPORTED. Every number says what it is out of. `of` is the
   channel's own matched phrase count and `shown` and `lack` are counts
   against it, never against a total that includes the other channel. */
function leanChan(c,known){
 var shown=LEANMIX[c.shown], lack=LEANMIX[c.lack], of=shown+lack;
 return {ch:c.ch, shown:shown, lack:lack, of:of,
  read:!!known&&of>=LEAN_MIN_CH,
  /* null rather than 50 when there is nothing to divide. a midpoint printed
     for an unmeasured channel is the defect this repository keeps finding. */
  pct: of? Math.round(shown/of*100) : null};}

/* leanRead keeps its signature and every key it returned. ben, mal, src and
   cues are unchanged in meaning and ui/summary.js and ui/ui.js read them.
   WHAT CHANGED, named rather than slipped in: the trust ramp. It was
   min(0.62, cues x 0.09), which reached the cap at seven matched phrases.
   It is now asymptotic, so the cap is approached and never touched and
   half of it takes twelve phrases. Monotone in cues either way. */
function leanRead(r){
 var fieldMal=Math.max(0,Math.min(100,(r&&r.malig)||0));
 var ben=LEANMIX.benign, mal=LEANMIX.malignant, tot=ben+mal;
 /* the channel split is a session number. a profile off the disk restores
    the two sums and not the four counts, so the channels report read false
    rather than four zeros that were never measured. */
 var known=LEANMIX.texts>0;
 var out={ben:100-fieldMal, mal:fieldMal, src:'field only', cues:0,
  channels:known, texts:LEANMIX.texts, trust:0,
  empathy:       leanChan({ch:'empathy',       shown:'emp', lack:'empLack'},known),
  accountability:leanChan({ch:'accountability',shown:'acc', lack:'accLack'},known),
  frame:{self:LEANMIX.self, other:LEANMIX.other, rawLack:LEANMIX.rawLack,
   admit:leanAdmit(LEANMIX.self+LEANMIX.acc,LEANMIX.other),
   read:known&&(LEANMIX.self+LEANMIX.acc)>0}};
 if(!tot) return out;
 var storyMal=mal/tot*100;
 var trust=LEAN_TRUST_CAP*tot/(tot+LEAN_TRUST_HALF);
 var m=fieldMal*(1-trust)+storyMal*trust;
 var n=Math.round(tot);
 out.ben=100-m; out.mal=m; out.cues=tot; out.trust=trust;
 out.src='field and '+n+' story cue'+(n===1?'':'s');
 return out;}

/* ---------- direction over time ----------
   "So that we can now start to track people's benign and malignant
   behaviour." Nothing did. snapshot() writes fifteen fields and the lean is
   not one of them.

   NO SCHEMA FIELD WAS ADDED, and the reason is measured rather than
   assumed. validateProfile REBUILDS every history entry from a whitelist
   at schema.js, keeping four strings and eleven numbers by name, so a
   sixteenth field added to snapshot() survives until the next read off the
   disk and is then silently dropped. A number that looks stored and is not
   is the exact defect this repository keeps being bitten by, so it is not
   being shipped. The whitelist line needed is named in DESIGN-lean.md and
   the call is the owner's.

   WHAT IS AVAILABLE WITHOUT TOUCHING THE SCHEMA. malig is a function of
   CQ, and every snapshot already carries cq, so the field's own lean at
   every point on the record can be recovered exactly. That is one of the
   two halves of the reading and it needs no migration, no new field and no
   recompute. The story cue half is not in the record, and this says so per
   point rather than drawing a line through numbers it does not have. */
function leanSeries(p){
 var H=(p&&p.history)||[], out=[];
 for(var i=0;i<H.length;i++){
  var cq=typeof H[i].cq==='number'?H[i].cq:null;
  if(cq===null) continue;
  var m=cq>=50?0:Math.round((50-cq)/50*100);
  out.push({t:H[i].t, cq:cq, mal:m, ben:100-m, src:'field'});}
 return {points:out, n:out.length, of:H.length,
  /* what the series cannot see, stated on the series rather than in a
     document nobody reads next to the chart. */
  storyCues:false,
  says:out.length?('the field lean at '+out.length+' of '+H.length+' snapshots')
   :'no snapshot on file carries a coherence reading'};}

/* ---------- the gates as schema ----------
   VERPMIX and LEANMIX are inputs, not derived numbers, so they belong in the
   profile. They live here rather than with the schema because the schema
   loads after this file and a forward reference would only work by accident
   of hoisting. */
/* The gate mixes accumulate with +=, so a second pass would count the
   same cues a second time. Zeroing is what makes a read repeatable. */
/* LEANMIX gained eight keys when the lean became two channels, and zeroing
   two of them by name would have left the other six dirty across a read.
   It loops over its own keys now, so a key added later cannot be forgotten
   here, and the gate asserts exactly that. */
function gatesClear(){
 Object.keys(VERPMIX).forEach(function(k){VERPMIX[k]=0;});
 Object.keys(LEANMIX).forEach(function(k){LEANMIX[k]=0;});
 return {verp:VERPMIX, lean:LEANMIX};}

function gatesLoad(p){
 gatesClear();
 var g=p&&p.gates; if(!g)return null;
 if(g.verp)Object.keys(VERPMIX).forEach(function(k){VERPMIX[k]=g.verp[k]||0;});
 /* the two sums come back and texts stays at zero, which is what tells
    leanRead the channel split was not measured this session. */
 if(g.lean){LEANMIX.benign=g.lean.benign||0; LEANMIX.malignant=g.lean.malignant||0;}
 return g;}

function gatesSave(p){
 var v={}; Object.keys(VERPMIX).forEach(function(k){v[k]=VERPMIX[k];});
 /* The ADMITTED lack weight is what is written, never the raw count. If the
    raw count were persisted, a harm account would pass the frame gate on
    the way out and fail it on the way back in, and the reading would turn
    malignant on a reload. Measured before this was written: it does. */
 p.gates={verp:v, lean:{benign:LEANMIX.benign, malignant:LEANMIX.malignant}};
 return p.gates;}
