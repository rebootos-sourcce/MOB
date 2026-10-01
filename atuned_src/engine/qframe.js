/* ============================================================
   THE QUESTION FRAMEWORKS. Round OV, TASKS.md, his own words: when a person
   lands on the journal, Source AI's questions should come from named
   frameworks and not a flat list. The seven deadly sins, the nine circles of
   Dante's Inferno as layers of descent, the ages of life, and more of that
   kind, asked as the specifics of a life: "When have you been greedy?",
   "When have you backstabbed someone?", "What do you love doing more than
   anything else?".

   WHAT THIS IS. A host free table, framework to layer to question, and a
   picker that chooses the next layer. Each layer carries:

     q         the question, in the house voice, one thing, a specific
     looks     what it looks for, in plain words, so the person can be told
               why it was asked
     seats     the seats of the body its answer can light, and ONLY where an
               existing table in this product already seats it, named in
               `src`. A framework nothing in the product seats says [] and
               does not guess one.
     channels  which of the release's six channels the question invites,
               C3_VERB's own names

   WHERE THE WORDS COME FROM, AND WHERE THEY DO NOT.
     sins       the sin each circle of the Compass carries, 'sin:' in
                engine/data/compass.js, read at load. The Compass carries
                Lust, Gluttony, Greed, Wrath and sloth, Pride, Wrath and
                Envy, and "Wrath and sloth" is two of the seven, so the seven
                are read off it and not typed. A question is written for each,
                and qfCheck fails if the data ever carries a sin that has
                none.
     inferno    the nine circles, CIRCLES in the same file, in descent order,
                each seated where its own 'at' column says.
     ages       AGES in engine/data/ages.js, the owner's own age ladder, three
                to eighteen, with his own questions. The product's age bands
                are single years and this does not invent coarser ones.
     PROPOSED   jouissance, cognitive bias, the shadow, attachment and the
                four temperaments. Mine, not his, flagged `proposed` in the
                table and in the Story page's own record of what was asked,
                until he rules. Nothing in the product seats them, so they
                feed channels and no seat.

   WHAT NONE OF IT CLAIMS. A question asks for an event in a life and the
   answer is the person's own. "Supports, not causes": a question is never a
   finding, an answer is never a diagnosis, and no layer names a label the
   person is. The temperaments are an old and unvalidated scheme, which is
   the reason they are asked as things a person did and never as a type a
   person is.

   WHAT IT MAY SEE. Seat keys of the entry being written, and the framework
   and layer already asked. Nothing leaves the device and nothing here can: the
   engine has no host. It stores nothing; what was asked is page memory, and
   the entry keeps only the kind of question, never its words.
   ============================================================ */
var QF_ORDER=['sins','inferno','ages','jouissance','bias','shadow','attachment','temperament'];

/* the seat words in a Compass 'at' column, as the engine's own seat keys */
var QF_SEATWORD={root:'root',sacral:'sacral',solar:'solar',heart:'heart',throat:'throat',
 'third eye':'eye',crown:'crown'};
function qfSeatsIn(text){
 var out=[], s=String(text||'').toLowerCase();
 Object.keys(QF_SEATWORD).forEach(function(w){
  if(new RegExp('\\b'+w+'\\b').test(s)&&out.indexOf(QF_SEATWORD[w])<0)out.push(QF_SEATWORD[w]);});
 return out;}

/* THE SEVEN, read off the Compass. A circle's `sin` may name two ("Wrath and
   sloth"), and each is one of the seven. Each carries the seats of every
   circle that carries it. */
function qfSins(){
 var out=[], by={};
 CIRCLES.forEach(function(c){
  String(c.sin||'').split(' and ').forEach(function(x){
   x=x.trim().toLowerCase(); if(!x)return;
   if(!by[x]){by[x]={id:x,seats:[],circles:[]};out.push(by[x]);}
   by[x].circles.push(c.nm);
   qfSeatsIn(c.at).forEach(function(k){if(by[x].seats.indexOf(k)<0)by[x].seats.push(k);});});});
 return out;}

var QF_SIN_Q={
 pride:['When did you last refuse help you needed?','a time help was offered and turned down',['behaving']],
 greed:['When have you been greedy?','a time more was taken than was needed',['behaving']],
 lust:['What have you wanted more than was good for you?','a want that ran past its limit',['feeling']],
 envy:['Who has what you wanted, and what did you do when you saw it?','a time somebody else’s luck was hard to watch',['feeling','behaving']],
 gluttony:['What do you take more of than you need, when you are low?','what gets reached for to fill a gap',['behaving']],
 wrath:['When did you last lose it with somebody?','a time anger went out as an act',['acting']],
 sloth:['What have you put off the longest?','the thing that has waited the longest',['behaving']]};

var QF_CIRCLE_Q={
 limbo:['What are you going along with that you do not believe in?','going through the motions without belief',['believing']],
 lust:['What do you do so that people want you around?','arranging things to be wanted',['behaving']],
 gluttony:['What do you reach for when you feel the gap?','consuming to cover an empty place',['behaving']],
 greed:['What do you count to know how you are doing?','worth measured by what is kept',['thinking']],
 'wrath and sloth':['What did you go off about this week, or go flat about?','anger out as an attack, or in as a shutdown',['acting','feeling']],
 heresy:['What have you decided you already know, and stopped listening on?','a belief that has closed the question',['believing']],
 violence:['When did you last want to break something?','the wish to break something, said out loud',['acting']],
 fraud:['When have you been warm at someone because it was easy, and not because you meant it?','warmth that costs nothing',['behaving']],
 treachery:['When have you backstabbed someone?','a time somebody who trusted you was gone against',['acting']]};

/* THE PROPOSED FRAMEWORKS. Flagged, and the flag travels with every layer. */
var QF_PROPOSED={
 jouissance:{nm:'Jouissance',looks:'the thing a person returns to more than anything, the excess they will not give up',
  layers:[
  ['return','What do you go back to more than anything, even when it costs you?','what gets returned to against its cost',['behaving']],
  ['love','What do you love doing more than anything else?','the enjoyment the person organises the week around',['feeling']],
  ['hold','What would you not give up, even if somebody asked nicely?','what is held when it is asked for',['behaving']]]},
 bias:{nm:'Cognitive bias',looks:'the three ordinary habits of a mind defending itself',
  layers:[
  ['confirm','What have you read or heard lately that only agreed with you?','taking in only what agrees',['perceiving']],
  ['sunk','What are you still doing because of how much you have already put in?','staying for the cost already paid',['thinking']],
  ['credit','What went wrong lately that you put on somebody else?','blame placed outside, credit kept inside',['believing']]]},
 shadow:{nm:'The shadow',looks:'what a person will not own in themselves and sees in other people',
  layers:[
  ['project','What annoys you most in other people?','a trait that gets a stronger reaction than it earns',['perceiving']],
  ['deny','What have you been told about yourself that you shrugged off?','a thing said and not taken in',['believing']],
  ['hide','What do you pretend you do not do?','a habit kept out of the account',['behaving']]]},
 attachment:{nm:'Attachment',looks:'how a person moves toward and away from the people they depend on',
  layers:[
  ['pull','Who do you go quiet around when you need them?','pulling away at the point of need',['behaving']],
  ['check','Who do you check on more than you want to?','reaching for reassurance',['behaving']],
  ['safe','Who can you call at three in the morning?','who is actually reachable',['perceiving']],
  ['leave','What do you do when somebody pulls away?','the move made when a person withdraws',['acting']]]},
 temperament:{nm:'The four temperaments',looks:'four old ways of describing what a person does with energy, asked as acts and never as a type',
  layers:[
  ['choleric','When did you last take charge of something nobody asked you to?','energy going out as command',['acting']],
  ['sanguine','What did you start this month and drop?','energy going out and not landing',['behaving']],
  ['melancholic','What have you gone over again and again this week?','energy going inward and round',['thinking']],
  ['phlegmatic','What have you let slide because it was easier?','energy not spent',['behaving']]]}};

/* THE TABLE, built once, at load, from the three sourced frameworks and the
   five proposed ones. A layer is {fw, id, nm, q, looks, seats, channels, src,
   proposed}. */
function qfBuild(){
 var T={};
 var sins=qfSins();
 T.sins={nm:'The seven deadly sins',ordered:false,proposed:false,
  src:'engine/data/compass.js, the sin of each circle',
  layers:sins.map(function(s){var d=QF_SIN_Q[s.id]||['','',[]];
   return {fw:'sins',id:s.id,nm:s.id,q:d[0],looks:d[1],seats:s.seats.slice(),channels:d[2].slice(),
    src:'compass: '+s.circles.join(', '),proposed:false};})};
 T.inferno={nm:'The nine circles',ordered:true,proposed:false,
  src:'engine/data/compass.js, CIRCLES in descent order',
  layers:CIRCLES.map(function(c){var key=c.nm.toLowerCase(), d=QF_CIRCLE_Q[key]||['','',[]];
   return {fw:'inferno',id:key,nm:c.nm,q:d[0],looks:d[1],seats:qfSeatsIn(c.at),channels:d[2].slice(),
    src:'compass circle '+c.c+', at: '+c.at,proposed:false};})};
 T.ages={nm:'The ages of life',ordered:true,proposed:false,
  src:'engine/data/ages.js, the age ladder, three to eighteen',
  layers:AGES.map(function(a){
   return {fw:'ages',id:'a'+a.a,nm:'age '+a.a,q:a.q,looks:a.k,seats:[],channels:['believing'],
    src:'age ladder, age '+a.a,proposed:false};})};
 Object.keys(QF_PROPOSED).forEach(function(k){var f=QF_PROPOSED[k];
  T[k]={nm:f.nm,ordered:false,proposed:true,src:'PROPOSED, not ruled',looks:f.looks,
   layers:f.layers.map(function(l){
    return {fw:k,id:l[0],nm:l[0],q:l[1],looks:l[2],seats:[],channels:l[3].slice(),
     src:'PROPOSED, no table in the product seats it',proposed:true};})};});
 return T;}
var QF=qfBuild();
function qfLayers(){
 var out=[]; QF_ORDER.forEach(function(k){(QF[k]?QF[k].layers:[]).forEach(function(l){out.push(l);});});
 return out;}

/* WHAT THE STORY HAS TOUCHED: the seat keys Source AI heard, with negated
   mentions already cleared by srcHear. Never the words. */
function qfTouched(text,prior){
 var h=srcHear(text,prior), out={};
 h.seats.forEach(function(s){out[s.seat]=s.rung;});
 return out;}

/* THE NEXT LAYER. A stated order, not a score. There is no labelled set to
   fit a weight against and no outcome to fit it to, so each step is one a
   person could check by reading the table:

     1  a framework is never asked twice in a row. Only when it is the only
        one left does it go again.
     2  a layer already asked is not asked again. An ordered framework, the
        descent and the ages, offers only the first layer not yet asked, so
        the descent is walked in the order it descends.
     3  a layer that sits at a seat the story touched comes before one that
        does not. That is following the signal: it is the only way the story
        reaches this, and it never creates one, because a layer with no seat
        has no signal and is neither favoured nor held back by it.
     4  then the framework asked longest ago, never asked first.
     5  then the table's own order, turned by seed. The seed is a whole number
        the caller chooses, a day number is the natural one, so two days open
        on two different questions and the same day opens on the same one.

   state is {touched, asked:[{fw,id}], seed}. Returns the layer with the steps
   that chose it, or null when nothing is left. */
function qfNext(state){
 var st=state||{}, touched=st.touched||{}, asked=st.asked||[], seed=Math.abs(+st.seed||0);
 var last=asked.length?asked[asked.length-1].fw:null;
 function done(l){return asked.some(function(a){return a.fw===l.fw&&a.id===l.id;});}
 function eligible(k){
  var f=QF[k]; if(!f)return [];
  var left=f.layers.filter(function(l){return !done(l);});
  return f.ordered?left.slice(0,1):left;}
 function signal(l){return l.seats.filter(function(s){return touched[s]>0;});}
 var ks=QF_ORDER.filter(function(k){return eligible(k).length;});
 if(!ks.length)return null;
 var pool=ks.filter(function(k){return k!==last;});
 var why=[];
 if(!pool.length)pool=ks; else if(last)why.push('not '+QF[last].nm.toLowerCase()+' again, it was the last one asked');
 var sig=pool.filter(function(k){return eligible(k).some(function(l){return signal(l).length;});});
 if(sig.length){pool=sig;}
 function lastAt(k){for(var i=asked.length-1;i>=0;i--)if(asked[i].fw===k)return i;return -1;}
 var oldest=Math.min.apply(null,pool.map(lastAt));
 pool=pool.filter(function(k){return lastAt(k)===oldest;});
 var k=pool.slice().sort(function(a,b){
  var n=QF_ORDER.length, ia=(QF_ORDER.indexOf(a)-seed%n+n)%n, ib=(QF_ORDER.indexOf(b)-seed%n+n)%n;
  return ia-ib;})[0];
 var el=eligible(k), sl=el.filter(function(l){return signal(l).length;});
 var l=sl.length?sl[0]:(QF[k].ordered?el[0]:el[seed%el.length]);
 if(signal(l).length)why.unshift('the story touched '+signal(l).map(function(s){return K2BAND[s];}).join(' and ')+
  ', and '+l.nm+' sits there in '+(l.fw==='sins'||l.fw==='inferno'?'the Compass':'the table'));
 else if(QF[k].ordered)why.push(QF[k].nm.toLowerCase()+' is walked in order');
 if(oldest<0)why.push('not asked yet');
 return {fw:k,id:l.id,nm:l.nm,framework:QF[k].nm,q:l.q,looks:l.looks,seats:l.seats.slice(),
  channels:l.channels.slice(),proposed:l.proposed,src:l.src,because:why};}

/* THE GATE'S OWN CHECK, so the table cannot drift from the data it was built
   from, and so a proposed framework cannot lose its flag. Returns the list of
   things wrong, which is empty when the table holds. */
function qfCheck(){
 var bad=[], seen={};
 var sins=qfSins();
 if(sins.length!==7)bad.push('the Compass carries '+sins.length+' sins and the framework is the seven');
 sins.forEach(function(s){if(!QF_SIN_Q[s.id])bad.push('the sin '+s.id+' has no question');});
 Object.keys(QF_SIN_Q).forEach(function(k){if(!sins.some(function(s){return s.id===k;}))bad.push('a question for '+k+', which the Compass does not carry');});
 CIRCLES.forEach(function(c){if(!QF_CIRCLE_Q[c.nm.toLowerCase()])bad.push('the circle '+c.nm+' has no question');});
 if(QF.inferno.layers.map(function(l){return l.id;}).join('|')!==CIRCLES.map(function(c){return c.nm.toLowerCase();}).join('|'))
  bad.push('the descent is not the Compass order');
 if(QF.ages.layers.length!==AGES.length)bad.push('the ages are not the age ladder');
 QF_ORDER.forEach(function(k){
  var f=QF[k]; if(!f){bad.push('the framework '+k+' is not built');return;}
  if(!f.layers.length)bad.push(k+' has no layers');
  if((k==='jouissance'||k==='bias'||k==='shadow'||k==='attachment'||k==='temperament')!==f.proposed)
   bad.push(k+' proposed flag is wrong');
  f.layers.forEach(function(l){
   var id=l.fw+'/'+l.id;
   if(seen[id])bad.push(id+' is listed twice'); seen[id]=1;
   if(!l.q||l.q.charAt(l.q.length-1)!=='?')bad.push(id+' is not a question');
   if(!l.looks)bad.push(id+' does not say what it looks for');
   l.channels.forEach(function(c){if(C3_VERB.indexOf(c)<0)bad.push(id+' names the channel '+c+', which is not one of the six');});
   l.seats.forEach(function(s){if(!K2BAND[s])bad.push(id+' names the seat '+s+', which is not a seat');});
   if(/[\u2014\u2013]/.test(l.q))bad.push(id+' has a dash in it');
   if(/\byou are (a|an|so|too)\b|disorder|diagnos|trauma|narciss|psychopath/i.test(l.q))bad.push(id+' says what the person is');
   if(l.proposed&&l.seats.length)bad.push(id+' is proposed and claims a seat nothing seats');});});
 return bad;}
