/* ============================================================
   DISTRESS, round OX, TASKS.md. The owner, on the permanent line under the
   story box: "Safety line, no. The sniffer needs to be good enough to detect
   distress in a person's story, as I just demonstrated earlier."

   THE REVIEW'S TWO CASES, reproduced before anything was written, on the build
   in hand:
     "I want to end my life. I feel hopeless and numb."   read Sad 8.8, with a
                                                          release offered
     "I do not want to be here anymore."                  read nothing at all
   The first is a person saying they want to die and being offered a ritual. The
   second is a person saying the same thing in the passive voice and not being
   heard at all. Nothing in the lexicon is wrong about either: it is a seat and
   an amount, and what these sentences carry is neither.

   WHAT THIS IS. A reader of one entry, pure and host free, that returns a
   level, none, concern or urgent, and the reasons, each a phrase the person
   wrote and what it says. It is not the sniffer and shares nothing with its
   arithmetic: no seat, no amount, nothing that touches the field.

   WHAT IT DOES, WHICH IS THE POINT OF IT. A detection has to do something. At
   concern or urgent the Story page does not offer a release, and shows a short
   plain message, the support lines drafted in reviews/LEGAL-floor.md block C
   quoted exactly, and a way to keep writing. Under no detection it shows
   nothing: there is no permanent line. The first-run Mirror takes the same
   guard through mirrorGuard, which is a function and not a screen, because the
   Mirror is not in this build.

   WHY IT IS A PHRASE TABLE AND NOT A MODEL. A false negative here is the
   expensive error and a false positive is not free: it stops a person's
   release and puts a crisis line in front of somebody who wrote about a bad
   day. There is no labelled set, and there is not going to be a safe one to
   build, so the threshold cannot be fitted and a model would be a number
   nobody could defend. A table can be read line by line by the owner, a
   clinician and a lawyer, and every detection says which words it was.

   THE KINDS, AND WHAT EACH ONE SAYS. The level follows from which kinds are
   present, by a rule a person can check, and not from a score:

     active    says they want to end their life or hurt themself. "I want to
               end my life", "kill myself", "hurt myself"
     passive   says they wish to be dead, or not to live. "I wish I was dead",
               "I do not want to live", "I want to die"
     burden    says others would be better off without them. "everyone would
               be better off without me", "no one would miss me"
     leave     says they do not want to be here, in the sense of anywhere. "I do
               not want to be here anymore", "I want to disappear"
     cant      says they cannot go on. "I can't do this anymore", "I can't go
               on", "I can't take it anymore"
     hopeless  says it is hopeless. "I feel hopeless", "no way out"
     point     asks what the point is, and stops there. "What is the point."
     weakburden  says they are a burden, with nothing about leaving
     support   numb, empty. Recorded as a reason and never changes the level.

     urgent  = any of active, passive, burden; or two different kinds among
               leave, cant and hopeless
     concern = any one of leave, cant, hopeless, point, weakburden
     none    = anything else

   The two pairings are the only judgement in the rule: that one of the five
   concern kinds alone is worth a line, and that two of three together is worth
   the stronger one. Both are stated here so they can be argued with.

   WHAT IT WILL NOT READ AS DISTRESS, deliberately:
     a negated cue. "I do not want to die", "I would never kill myself" stand
       a negator in the three words before the cue, in the same clause, and
       read as nothing. A cue that carries its own negation, "I do not want to
       be here anymore", is matched as a whole and is not voided by it.
     a cue about somebody else. Every cue carries I, me, myself or my in its
       own words, so "he wants to end his life" matches none of them.
     a cue in the past. "when I was a teenager I wanted to die" is a line and
       not an alarm: urgent kinds drop to concern, concern kinds drop out.
     "hopeless at" and "hopeless about": the word as a figure of speech.
     "what is the point" with something after it: "what is the point of this
       meeting" is not about a life. It reads only when it stops, or goes on to
       living, going on, it all, anything or anymore.
     "I could kill myself for being so stupid": a hyperbole, read at concern and
       not urgent. Wrong in both directions sometimes, and named below.

   WHAT IT CANNOT KNOW, and the report says it again because it is the part that
   matters. It cannot know whether a person means it. It cannot read tone, a
   quotation, a song lyric, a character in a story the person is writing, or
   a thing said to a therapist about the past. It cannot read a euphemism it has
   no phrase for, and the table is a floor and not the language: "I just want
   it all to stop" is in it and "I'm so tired of fighting" is not. It reads
   English only, and only what was typed. It cannot know that nobody is hurt
   by a message shown to a person who did not need it. And no amount of testing
   here makes it safe: the tests below measure the table against sentences
   written for them, which is not the same as measuring it against the people
   who will use it.
   ============================================================ */
var DISTRESS_LEVELS=['none','concern','urgent'];
var DISTRESS_URGENT_KINDS=['active','passive','burden'];
var DISTRESS_SOFT_KINDS=['leave','cant','hopeless'];
var DISTRESS_CONCERN_KINDS=['leave','cant','hopeless','point','weakburden'];
/* what each kind says, in plain words. This is the reason, and it is for the
   person reading the detection and never shown to the person who wrote it. */
var DISTRESS_SAY={
 active:'says they want to end their life or hurt themself',
 passive:'says they wish to be dead or not to live',
 burden:'says others would be better off without them',
 leave:'says they do not want to be here, or want to disappear',
 cant:'says they cannot go on',
 hopeless:'says it is hopeless',
 point:'asks what the point is',
 weakburden:'says they are a burden',
 support:'says they feel numb or empty'};
/* [kind, cues, options]. Cues are written as lawNorm reads a text: lower case,
   no apostrophes, words only. "dont" is "don't". Options: end, the cue must
   stand at the end of its clause or be followed only by one of the words in
   `then`; not, words that may not follow it. */
var DISTRESS_CUES=[
 ['active',['want to end my life','wanna end my life','going to end my life','end my own life',
  'end my life','take my own life','kill myself','killing myself',
  'want to hurt myself','wanna hurt myself','going to hurt myself','urge to hurt myself',
  'thinking about hurting myself','hurting myself on purpose','hurt myself on purpose',
  'want to harm myself','going to harm myself','thinking of harming myself','harm myself',
  'cut myself on purpose','cutting myself','end it all','thinking about suicide',
  'thinking of suicide','think about suicide','considering suicide','am suicidal','im suicidal',
  'feel suicidal','feeling suicidal','i was suicidal','suicidal thoughts','take an overdose',
  'taking an overdose','i self harm','want to self harm','urge to self harm','self harming again',
  'took a lot of pills','took all my pills','swallowed all my pills','overdosed on purpose',
  'plan to end it','plan to kill myself','plan to end my life','plan to die','have a plan to end it',
  'thoughts of hurting myself','thoughts of harming myself','thoughts of killing myself',
  'thoughts of suicide','thoughts about suicide','thoughts of ending my life','thoughts of ending it']],
 ['active',['take my life'],{not:['back']}],
 ['passive',['want to die','wanna die'],{not:['of','from','laughing'],notBy:['he','she','they','you','people','who','everyone']}],
 ['passive',['wish i was dead','wish i were dead','wish i would die',
  'better off dead','rather be dead','want to be dead','dont want to live','do not want to live',
  'dont want to be alive','do not want to be alive','no reason to live','nothing to live for',
  'not worth living','isnt worth living',
  'wish i had never been born','wish i was never born','wish i never woke up','wish id never been born',
  'wish i would never have been born','dont deserve to live','dont deserve to be alive',
  'do not deserve to live','do not deserve to be alive','want out of this life','want out of life',
  'want to not wake up','wish i would not wake up','hope i do not wake up','hope i dont wake up',
  'go to sleep and not wake up','sleep and never wake up']],
 ['passive',['tired of living','tired of being alive','sick of living'],{not:['in','with','here','like','at']}],
 ['passive',['think about dying','thinking about dying','thoughts of dying'],{}],
 ['passive',['dont want to wake up','do not want to wake up'],{not:['at','early','before','to','in','until','on','tomorrow']}],
 ['burden',['would notice if i just vanished','would notice if i vanished','would notice if i disappeared',
  'would notice if i just disappeared','better off without me','better without me','no one would miss me','nobody would miss me',
  'no one would notice if i was gone','nobody would notice if i were gone',
  'better off if i was gone','better off if i were gone','better off if i were not here',
  'better off if i was not here']],
 ['weakburden',['if i wasnt around','if i wasnt here','if i werent around','if i werent here',
  'if i was not around','if i was not here','if i were not around','if i was gone','if i were gone',
  'am a burden','im a burden','such a burden','feel like a burden','burden to everyone',
  'burden on everyone']],
 ['leave',['dont want to be here anymore','do not want to be here anymore',
  'dont want to be here any more','do not want to be here any more',
  'dont want to be around anymore','do not want to be around anymore',
  'dont want to exist','do not want to exist',
  'wish i did not exist','wish i didnt exist',
  'wish i was not here','wish i wasnt here','not be here anymore','want it all to stop',
  'want it all to be over']],
 ['leave',['want to disappear','wish i could disappear','want to vanish','wish i could vanish'],
  {not:['into','to','for','on','off','somewhere','in']}],
 ['cant',['cant do this anymore','cannot do this anymore','cant go on','cannot go on',
  'cant take it anymore','cant take this anymore','cannot take it anymore','cant take much more',
  'cant handle this anymore','cant live like this','cannot live like this',
  'dont know how much more i can take','dont know how much longer i can',
  'dont think i can keep going','dont think i can go on','dont think i can do this anymore',
  'dont think i can take it','just cant do it anymore','cant do it anymore']],
 ['cant',['cant keep going','cant keep doing this'],{end:true,then:['like this','on','anymore']}],
 ['hopeless',['feel hopeless','feeling hopeless','felt hopeless','feels hopeless','am hopeless',
  'hopelessness','without hope','see no way out','cant see any way out','cant see a way out',
  'see any way out','no point in living','no point in going on','and hopeless','so hopeless'],
  {not:['at','about','with','when','case']}],
 ['hopeless',['feel so hopeless','feel completely hopeless','feel totally hopeless','feel utterly hopeless',
  'feel absolutely hopeless'],{not:['at','about','with','when','case']}],
 ['hopeless',['no hope'],{not:['of','for','that','in','to']}],
 ['hopeless',['no way out','it will never get better','it never gets better',
  'nothing will ever get better'],{end:true,then:['of this','of it','anymore']}],
 ['point',['what is the point','whats the point'],{end:true,
  then:['of living','of going on','of it all','of any of it','of anything','of all this','anymore','of me']}],
 ['point',['no point anymore','no point any more'],{}],
 ['point',['dont see the point','do not see the point'],{end:true,
  then:['in anything','in going on','in living','in life','anymore','any more','in anything any more','in anything anymore']}],
 ['leave',['want to sleep forever'],{}],
 ['point',['nothing matters anymore','done with life','done with it all','done with everything'],{}],
 ['support',['numb','empty inside','feel empty','feel nothing']]];
/* the words before a cue that void it. Short on purpose: cant, cannot and
   couldnt are left out because "I can't stop wanting to die" is exactly what
   they would void. */
var DISTRESS_NEG=['not','no','never','nobody','dont','didnt','wont','wouldnt','wasnt','isnt',
 'arent','without','hardly'];
/* the words before a cue that put it in the past */
var DISTRESS_PAST=['used to','back then','years ago','when i was','as a teenager','as a kid',
 'last year','long ago','in the past'];
/* the shape of a hyperbole: "I could kill myself for being so stupid" */
var DISTRESS_HYPER_BEFORE=['could','could have','almost','nearly','just about'];
var DISTRESS_HYPER_AFTER=['for','when','if','over','because'];

/* THE DRAFTED LINES, quoted from reviews/LEGAL-floor.md block C, "If You Are In
   Danger Now", word for word, with the line breaks of the file joined. Nothing
   is paraphrased and no number is written that the file does not carry: the
   one number is the one it carries. The gate reads the file and fails if any of
   these is not in it. Block C's last sentence, "Put the instrument down and use
   it", is left out: the owner's instruction is to offer to keep writing, and
   the two say opposite things. The permanent one line under the story box, the
   file's other draft, is not used: he struck it. */
var DISTRESS_LINES={
 floor:'This is not an emergency service. Nobody reads what you write here. It stays on your device and there is no person on the other end of it.',
 line:'If you are thinking about ending your life, or you do not feel safe, contact a crisis line now. In the United States, call or text 988 for the Suicide and Crisis Lifeline, or chat at 988lifeline.org. Outside the United States, use your local emergency number.',
 help:'People trained for exactly this answer that line. Help is available.'};
/* the one sentence that is this product's and not the file's: short, plain, no
   method, no cause, no advice. */
var DISTRESS_LEAD='What you wrote sounds like a lot to carry.';
var DISTRESS_KEEP='Keep writing';

function distressRead(text){
 var out={level:'none', reasons:[], kinds:[], support:[], offerRelease:true};
 var raw=String(text||'');
 if(!raw.trim())return out;
 var src=lawNorm(raw);
 var rows=[];
 DISTRESS_CUES.forEach(function(row){row[1].forEach(function(c){rows.push({kind:row[0],cue:c,opt:row[2]||{}});});});
 rows.sort(function(a,b){return b.cue.length-a.cue.length;});
 var taken=[], found=[];
 rows.forEach(function(r){
  var needle=' '+r.cue+' ', at=src.indexOf(needle);
  while(at>=0){
   var hi=at+needle.length-1;
   if(!taken.some(function(t){return at<t.hi&&hi>t.at;})){
    var pre=src.slice(0,at+1).split(' ').filter(function(x){return x!=='';});
    var post=src.slice(hi).split(' ').filter(function(x){return x!=='';});
    /* a negator within three words before, in the same clause. The cue's own
       words are not looked at, so a cue that carries its own "not" is whole. */
    var neg=false;
    for(var k=pre.length-1,n=0;k>=0&&n<3;k--,n++){
     if(pre[k]==='|')break;
     if(DISTRESS_NEG.indexOf(pre[k])>=0){neg=true;break;}}
    var ok=!neg;
    /* the cue has to stop, or go on only the way the table says */
    if(ok&&r.opt.end){
     var nxt=post[0]===undefined||post[0]==='|';
     var then=(r.opt.then||[]).some(function(w){
      return post.slice(0,w.split(' ').length).join(' ')===w;});
     ok=nxt||then;}
    if(ok&&r.opt.not&&post[0]!==undefined&&r.opt.not.indexOf(post[0])>=0)ok=false;
    /* somebody else wanting it: "they want to die" is not the person */
    if(ok&&r.opt.notBy&&pre.length&&r.opt.notBy.indexOf(pre[pre.length-1])>=0)ok=false;
    if(ok){
     taken.push({at:at,hi:hi});
     var before=pre.slice(Math.max(0,pre.length-8));
     /* the clause floor for the look back: nothing before a bar counts */
     var bi=before.lastIndexOf('|'); if(bi>=0)before=before.slice(bi+1);
     var ctx=' '+before.join(' ')+' ';
     var past=DISTRESS_PAST.some(function(p){return ctx.indexOf(' '+p+' ')>=0;});
     var hyper=false;
     if((r.cue==='kill myself'||r.cue==='killing myself')){
      var b2=before.slice(-2).join(' '), b1=before.slice(-1).join(' ');
      var a3=post.slice(0,3);
      hyper=(DISTRESS_HYPER_BEFORE.indexOf(b1)>=0||DISTRESS_HYPER_BEFORE.indexOf(b2)>=0)&&
       a3.some(function(w){return DISTRESS_HYPER_AFTER.indexOf(w)>=0;});}
     found.push({kind:r.kind,cue:r.cue,at:at,past:past,hyper:hyper});}}
   at=src.indexOf(needle,at+1);}});
 found.sort(function(a,b){return a.at-b.at;});
 /* the past and the hyperbole step a cue down, and say so */
 var eff=[];
 found.forEach(function(f){
  var kind=f.kind, note='';
  if(kind==='support'){out.support.push({kind:'support',text:f.cue,why:DISTRESS_SAY.support});return;}
  if(f.hyper){kind='leave'; note=', read as a figure of speech and held at concern';}
  else if(f.past){
   if(DISTRESS_URGENT_KINDS.indexOf(kind)>=0){kind='leave'; note=', said of the past and held at concern';}
   else{return;}}
  eff.push({kind:kind,text:f.cue,why:DISTRESS_SAY[f.kind]+note,said:f.kind});});
 var kinds=[]; eff.forEach(function(e){if(kinds.indexOf(e.kind)<0)kinds.push(e.kind);});
 var soft=kinds.filter(function(k){return DISTRESS_SOFT_KINDS.indexOf(k)>=0;});
 var level='none';
 if(kinds.some(function(k){return DISTRESS_URGENT_KINDS.indexOf(k)>=0;})||soft.length>=2)level='urgent';
 else if(kinds.some(function(k){return DISTRESS_CONCERN_KINDS.indexOf(k)>=0;}))level='concern';
 out.level=level; out.kinds=kinds; out.reasons=eff;
 out.offerRelease=(level==='none');
 return out;}

/* WHAT IS SHOWN, as data, so the Story page and the Mirror print the same
   words. Under no detection it is nothing at all: a person who wrote about a bad
   day is shown no line. */
function distressMessage(level){
 if(level!=='concern'&&level!=='urgent')return null;
 return {level:level, lead:DISTRESS_LEAD,
  lines:[DISTRESS_LINES.line,DISTRESS_LINES.help,DISTRESS_LINES.floor],
  keep:DISTRESS_KEEP, offerRelease:false};}

/* THE FIRST-RUN MIRROR'S GUARD. The Mirror is not in this build, so this is
   the call it makes: the entry in, and out comes whether a release may be
   offered and what to show instead. Pure, one line to wire. */
function mirrorGuard(text){
 var d=distressRead(text), m=distressMessage(d.level);
 return {level:d.level, offerRelease:d.offerRelease, message:m, reasons:d.reasons};}
