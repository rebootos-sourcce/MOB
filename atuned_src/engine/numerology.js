
/* ============================================================
   NUMEROLOGY, IN FULL.

   The summary reduced a whole name to one value and called it the
   name lens. That is one of six numbers and it was the wrong one:
   the value of every letter in a name is the Expression, and the
   product was printing it under the heading Name with no statement
   of what had been reduced or how.

   Six numbers, and each answers a different question.

     Life path     the birth date. The road, not the traveller.
     Expression    every letter of the full name. What the person
                   is equipped to do.
     Soul urge     the vowels. What is wanted when nobody is asked.
     Personality   the consonants. What arrives in the room first.
     Birthday      the day of the month, unreduced. A single gift.
     Maturity      life path plus expression. What the second half
                   is for.

   Pythagorean, which is the system the codex uses: A to I are 1 to
   9, J to R are 1 to 9 again, S to Z are 1 to 8. Master numbers 11,
   22 and 33 survive reduction at every step, including inside a
   single name part, because a master reduced is a master lost.

   KARMIC DEBT is reported off the unreduced total and not inferred.
   13, 14, 16 and 19 are the four, and a 4 that came from 13 is not
   the same 4 as one that came from 22.

   Y IS THE ARGUMENT, in every system. The rule here is stated
   rather than felt: Y is a vowel when it carries the sound, which
   is when it has no vowel beside it. Wyn is a vowel Y. Yara is a
   consonant Y. The rule is one line and it is written down, which
   is more than most tables that use it can say.

   No etymology table. A root meaning for an arbitrary name cannot
   be looked up on a device that makes no outbound request, and
   inventing one is the kind of claim this instrument does not make.
   What a name part carries is its own number, its cornerstone and
   its capstone, and those are computed rather than remembered.
   ============================================================ */
const NUM_LET=(function(){
 var m={}, A='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 for(var i=0;i<26;i++)m[A[i]]=(i%9)+1;
 return m;})();
const NUM_VOW='AEIOU';
const NUM_MASTER=[11,22,33];
const NUM_DEBT=[13,14,16,19];

/* reduce, keeping the masters. the unreduced total is returned with it
   because karmic debt is a statement about the total and not about the
   digit it collapses to. */
function numReduce(n){
 var v=Math.abs(n|0);
 while(v>9&&NUM_MASTER.indexOf(v)<0)
  v=String(v).split('').reduce(function(a,c){return a+ +c;},0);
 return v;}

/* THE Y RULE, written down. Y is a vowel when it carries the sound, which is
   when neither neighbour inside the same name part is a vowel. */
function numIsVowel(s,i){
 var c=s[i];
 if(NUM_VOW.indexOf(c)>=0)return true;
 if(c!=='Y')return false;
 var prev=s[i-1], next=s[i+1];
 if(prev&&NUM_VOW.indexOf(prev)>=0)return false;
 if(next&&NUM_VOW.indexOf(next)>=0)return false;
 return true;}

function numClean(s){return String(s||'').toUpperCase().replace(/[^A-Z ]/g,' ')
 .replace(/\s+/g,' ').trim();}
function numParts(s){var c=numClean(s); return c?c.split(' '):[];}

/* one name part, summed three ways. total is the unreduced figure, which is
   what debt is read from. */
function numSum(part,mode){
 var t=0;
 for(var i=0;i<part.length;i++){
  var v=NUM_LET[part[i]]; if(!v)continue;
  var vow=numIsVowel(part,i);
  if(mode==='vowel'&&!vow)continue;
  if(mode==='cons'&&vow)continue;
  t+=v;}
 return t;}

/* THE STEP THAT MOST TABLES GET WRONG. Expression is each name part reduced on
   its own and then those reduced, not every letter in one pile.

   WHEN THE TWO CAN DISAGREE, exactly. Digit summing preserves the value mod
   nine, so the two totals are always congruent and the only thing that can
   separate them is the master rule: numReduce stops at 11, 22 and 33, so one
   route can halt on a master while the other walks past it to a single digit.
   Same name, two answers, and only one of them keeps the master.

   That is uncommon and it is not rare enough to ignore, so both totals are
   kept and the renderer says so when they part. The parts are the reading,
   because a master inside a name is the thing the flat sum destroys. */
function numAcross(parts,mode){
 var each=parts.map(function(p){return numReduce(numSum(p,mode));});
 var flat=parts.reduce(function(a,p){return a+numSum(p,mode);},0);
 return {each:each, byPart:numReduce(each.reduce(function(a,v){return a+v;},0)),
  flatTotal:flat, flat:numReduce(flat)};}

function numDebt(total){return NUM_DEBT.indexOf(total)>=0?total:null;}

/* what each number does, by the position it is standing in. The same digit is
   not the same statement in the soul as it is in the personality: one is what
   is wanted and the other is what arrives first. */
const NUM_CORE={
 1:{n:'The one who starts', ex:'builds first and asks after', so:'wants to be the origin of it',
    pe:'arrives direct, and early'},
 2:{n:'The one who joins', ex:'works through the other person', so:'wants to be met',
    pe:'arrives quiet, and reads the room'},
 3:{n:'The one who expresses', ex:'makes the thing visible', so:'wants to be heard',
    pe:'arrives bright, and talking'},
 4:{n:'The one who builds', ex:'puts a floor under it', so:'wants it to hold',
    pe:'arrives solid, and early'},
 5:{n:'The one who moves', ex:'changes the conditions', so:'wants the exit unlocked',
    pe:'arrives fast, and unpinned'},
 6:{n:'The one who tends', ex:'carries what others put down', so:'wants to be needed',
    pe:'arrives warm, and responsible'},
 7:{n:'The one who looks', ex:'takes it apart to see it', so:'wants to know',
    pe:'arrives reserved, and watching'},
 8:{n:'The one who commands', ex:'moves the resource', so:'wants the authority real',
    pe:'arrives weighted, and in charge'},
 9:{n:'The one who completes', ex:'finishes what was handed over', so:'wants it to mean something',
    pe:'arrives wide, and already leaving'},
 11:{n:'The one who channels', ex:'carries more current than the wire is rated for',
    so:'wants the signal clean', pe:'arrives charged, and unsettling'},
 22:{n:'The one who makes it real', ex:'lands the thing nobody could land',
    so:'wants it built', pe:'arrives steady, and very large'},
 33:{n:'The one who teaches', ex:'raises the whole room',
    so:'wants the others through', pe:'arrives given away'}};
const NUM_DEBT_SAYS={
 13:'Work refused earlier. The way out is the work, done plainly and without a shortcut.',
 14:'Freedom taken at somebody else’s cost. The way out is a limit you set yourself.',
 16:'Something built on a false footing, and it comes down. The way out is being seen as you are.',
 19:'Power used alone. The way out is needing somebody.'};
/* the cornerstone is the first letter of the first name and the capstone the
   last. one says how a thing is approached, the other how it is finished. */
const NUM_STONE={
 1:'straight at it',2:'alongside it',3:'talking about it',4:'shoring it up',
 5:'moving around it',6:'carrying it',7:'studying it',8:'owning it',9:'releasing it'};

/* THE FULL PROFILE. Pure. Name in, six numbers out, and a birth date only for
   the two that need one. Nothing here reads shared state and nothing stores. */
function numerology(name,birthDate){
 var parts=numParts(name);
 if(!parts.length)return null;
 var all=numAcross(parts,'all'), vow=numAcross(parts,'vowel'), con=numAcross(parts,'cons');
 var first=parts[0], last=parts[parts.length-1];
 var lp=null, bday=null, bdayR=null;
 if(birthDate&&/^\d{4}-\d{2}-\d{2}$/.test(birthDate)){
  lp=lifePath(birthDate);
  bday=+birthDate.split('-')[2];
  bdayR=numReduce(bday);}
 var expr=all.byPart;
 var mat=(lp!==null)?numReduce(lp+expr):null;
 return {
  parts:parts,
  /* each name part on its own, which is what the owner asked to see */
  each:parts.map(function(p,i){
   return {nm:p.charAt(0)+p.slice(1).toLowerCase(),
    v:all.each[i], total:numSum(p,'all'),
    debt:numDebt(numSum(p,'all')),
    says:(NUM_CORE[all.each[i]]||{}).n||'',
    role:i===0?'first':(i===parts.length-1?'last':'middle')};}),
  expression:expr, expressionFlat:all.flat, expressionTotal:all.flatTotal,
  soul:vow.byPart, personality:con.byPart,
  lifePath:lp, birthday:bday, birthdayReduced:bdayR, maturity:mat,
  /* the split only shows up when a part carries a master, and when it does it
     is worth saying out loud rather than silently taking one side. */
  split:(all.byPart!==all.flat)?{byPart:all.byPart, flat:all.flat}:null,
  debt:numDebt(all.flatTotal),
  cornerstone:first.charAt(0), capstone:last.charAt(last.length-1),
  cornerSays:NUM_STONE[NUM_LET[first.charAt(0)]]||'',
  capSays:NUM_STONE[NUM_LET[last.charAt(last.length-1)]]||'',
  master:NUM_MASTER.filter(function(m){
   return expr===m||vow.byPart===m||con.byPart===m||lp===m;})};}

/* one line per number, for a renderer that wants the reading and not the table */
function numSays(k,v){
 var c=NUM_CORE[v]; if(!c)return '';
 if(k==='expression')return c.ex;
 if(k==='soul')return c.so;
 if(k==='personality')return c.pe;
 return c.n;}

/* THE NAME THIS READS. A real person's own full name lives on their profile,
   because the product asks for first, middle and last at intake. A reference
   case has one in FULLNAME. Falling back to the bare roster name is the last
   resort and it is honest about being a first name only, because reading a
   nickname as a birth name is the numerological equivalent of reading a chart
   off the year. */
function numFullName(p){
 var w=p&&p.who; if(!w)return null;
 var parts=[w.first,w.middle,w.last].filter(function(x){return x&&String(x).trim();});
 return parts.length?parts.join(' '):null;}
function numerologyOf(name,p){
 var full=numFullName(p)
  ||((typeof FULLNAME!=='undefined'&&FULLNAME[name])||null)
  ||name;
 var bd=(p&&p.who&&p.who.born&&p.who.born.date)
  ||((typeof BIRTH!=='undefined'&&BIRTH[name]&&BIRTH[name].d)||null);
 return numerology(full,bd);}
