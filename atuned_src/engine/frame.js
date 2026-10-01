/* ============================================================
   THE STORY FRAME. Round OU, TASKS.md, and his own report: he dictated "I had
   a really rough day", then "I had a confrontation with my boss", then "I was
   really irritated by him", and the instrument asked nothing about any of
   them. Three sentences that between them say a day was bad, who was in it,
   what kind of event it was and how he felt, and not one of them says what
   happened. A person who writes that is mid sentence. What a friend does next
   is ask what happened.

   WHAT THIS IS. A pure, host free reading of an entry, or of the day's
   running entries joined, into the slots a story has:

     day      how the day was, bad or good, and how heavy. A state of the whole
              entry. It carries no seat, and moves no charge, see below.
     event    what happened, as a sentence a person could point at: somebody
              did something. "I had a confrontation" is not one, it names the
              kind of thing and not what was said or done.
     other    who else is in it, the role they hold, and whether that role is
              above the person. Recorded, never inferred about the person.
     act      what somebody did to or with somebody, the thing that belongs in
              the acting and behaving channels of the release.
     feeling  the person's own feeling, its word, its aim, how strong.
     body     where it was felt, if said.
     under    what the person says was beneath it, if said.
     missing  the slots the entry does not answer, in a fixed order.
     ask      the one slot to ask about next, and the question for it.

   THE QUESTION CHAIN. The order is the owner's, and it is a fixed order and
   not a score, because there is no labelled set to fit a weight against and a
   weighted sum here would be five magic numbers:

     what     what happened, or what did he do or say
     did      what did you do
     feel     how did you feel, only when the entry names no feeling
     where    where did you feel it
     under    what was under it

   "feel" sits between "did" and "where" because "where did you feel it"
   needs an it. Every other relative order is his. The chain asks one slot at
   a time, never one already asked in this entry, and never a slot the entry
   already answers. What the person writes in answer goes in the journal and is
   read again as part of the same story, which is the only feed back there is:
   nothing here stores a thing the person did not write.

   WHAT IT NEVER DOES. It claims no cause. "What made it rough?" asks for the
   person's own account and supplies none, and "supports, not causes" is the
   rule it is written to: every field is a thing the person's words say, with
   the span they said it in. It diagnoses nothing, names no address, and a
   question quotes the person's own words and never the lexicon's.

   HOW A DAY QUALITY FEEDS THE ENGINE, STATED PLAINLY. It does not. A hit has a
   seat and an amount, and "a rough day" has no seat: the sniffer places charge
   in the body, and the product has no address for a day. A hit seated
   anywhere would be invented, which is what parseStory was fixed for.
   So day.load is a reading of the ENTRY, on the same zero to ten scale as a
   seat's reading, from the same arithmetic: a tier amount anchored to a word
   the lexicon already carries, scaled by the degree word before it,
   divided by three, capped at ten. What moves because of it is the question,
   srcTurn's frame ask, and what the page says it heard. What would move the
   field is a ruling, and it is the owner's: see SNIFFER-RECOMMENDATION.md.

   THE RELEASE'S SIX CHANNELS. believing, perceiving, thinking, behaving,
   acting and feeling, C3_VERB in engine/data/cards.js, and read here and not
   retyped. An imprint carries no channel: it is a node, a name, a band, a
   fetter and an amount. The release sweeps all six on every line, so a
   channel is not something a reading chooses today. The frame reports which
   channels the person's own words sit in, as a fact about the words, so
   "acts of aggression" is recorded as acting and behaving. Nothing reads it
   yet.
   ============================================================ */
var FRAME_SLOTS=['what','did','feel','where','under'];
/* a feeling ending in -ed is not a thing that happened */
var FRAME_STATE=['tired','bored','stressed','worried','upset','excited','relieved','pleased',
 'confused','surprised','shocked','scared','stuck','drunk','married','retired'];
var FRAME_ADV=['just','then','also','really','suddenly','immediately','finally','even',
 'still','again','only','actually','literally','honestly'];
var FRAME_DET=['my','his','her','their','the','our','a','an','this','that','these','those','your'];
var FRAME_PREP=['by','at','with','about','toward','towards','over','from','to','on','against'];
var FRAME_ME=['i',"i'm",'im','me','myself'];
var FRAME_THEM=['he','she','they',"he's","she's","they're",'you'];
var FRAME_SKIP=['just','honestly','actually','literally','been','also','being','so','such',
 'a','an'];

function frameClean(w){return String(w||'').replace(/'/g,'');}
/* every degree word, longest first, as token lists */
function frameMods(){
 return Object.keys(LEXMOD).map(function(m){return {m:m,w:m.split(' ')};})
  .sort(function(a,b){return b.w.length-a.w.length;});}
function frameModEnd(ws,k,MODS){
 for(var q=0;q<MODS.length;q++){
  var m=MODS[q], n=m.w.length, ok=k-n+1>=0;
  for(var z=0;ok&&z<n;z++)if(ws[k-n+1+z].w!==m.w[z])ok=false;
  if(ok)return {m:m.m,len:n};}
 return null;}
function frameModAt(ws,j,MODS){
 for(var q=0;q<MODS.length;q++){
  var m=MODS[q], n=m.w.length, ok=j+n<=ws.length;
  for(var z=0;ok&&z<n;z++)if(ws[j+z].w!==m.w[z])ok=false;
  if(ok)return {m:m.m,len:n};}
 return null;}
function framePhraseAt(ws,i,key){
 var p=key.split(' ');
 if(i+p.length>ws.length)return false;
 for(var z=0;z<p.length;z++)if(ws[i+z].w!==p[z])return false;
 return true;}
/* a negator inside the three words before an index, in the same clause */
function frameNegBefore(ws,i){
 for(var k=i-1,n=0;k>=0&&n<3;k--,n++){
  if(ws[k].c!==ws[i].c)break;
  if(FRAME_NEG.indexOf(ws[k].w)>=0)return true;}
 return false;}
function frameTyped(t,ws,i,j){return t.slice(ws[i].s,ws[j].e);}
/* a swear, for the clause level lift. A word the lexicon reads, alone or inside
   a phrase, is not one: pissed is in the restoring list because Chrome masks
   it, and it is also an anger word with an amount of its own, so counting it
   here would lift "pissed off" and "pissing me off" for being exactly that. */
var FRAME_LEXTOK=null;
function frameSwearWord(w){
 if(!FRAME_LEXTOK){FRAME_LEXTOK={};
  Object.keys(LEX).forEach(function(k){k.split(' ').forEach(function(x){FRAME_LEXTOK[x]=1;});});}
 return (SWEAR_WORDS.indexOf(w)>=0||SWEAR_INT.indexOf(w)>=0)&&!FRAME_LEXTOK[w];}
/* a swear anywhere in this clause */
function frameProfane(ws,c){
 for(var k=0;k<ws.length;k++)if(ws[k].c===c&&frameSwearWord(ws[k].w))return true;
 return false;}

/* THE DAY. Four shapes, and each one is a thing people actually say:
     a really rough day        the adjective stands before the day noun
     today was rough           the day is the subject of be and an adjective
     today sucked              or of a verb the day takes
     one of those days         a fixed phrase
   Each is read as written and nothing is inferred from tone. A negated bad
   word is unknown and reads as nothing; a negated good word is bad. */
function frameDay(t,ws,MODS){
 var found=[];
 function add(c){found.push(c);}
 function finish(c){
  /* the degree factor is the strongest degree word among those standing
     there, not their product: two degree words say one degree */
  /* degs is in the order met going backward from the word, so degs[0] is the
     nearest. It is the one that counts, which is scanStory's own rule, and a
     swear standing nearest is stepped over to the word before it, the
     stronger of the two winning. */
  var f=1, prof=false;
  if(c.degs.length){
   f=LEXMOD[c.degs[0].m]; prof=SWEAR_INT.indexOf(c.degs[0].m)>=0;
   if(prof&&c.degs[1]&&LEXMOD[c.degs[1].m]>f)f=LEXMOD[c.degs[1].m];}
  c.mod=f; c.adjacentSwear=prof;
  var v=c.valence, tier=c.tier;
  if(c.negated){
   if(v<0)return null;
   v=-1; tier=1; c.flipped=true;}
  c.valence=v; c.tier=v<0?tier:0;
  var amt=v<0?DAYQ_AMT[c.tier]*f:0;
  c.load=v<0?Math.round(Math.min(10,amt/3)*10)/10:0;
  return c;}
 var n,k,i;
 /* attributive */
 for(n=0;n<ws.length;n++){
  if(DAYQ_NOUN.indexOf(ws[n].w)<0)continue;
  var adjs=[], degs=[], start=n, kk=n-1, pend=null;
  while(kk>=0&&ws[kk].c===ws[n].c){
   if(DAYQ_ADJ[ws[kk].w]){adjs.unshift(kk);start=kk;pend=null;kk--;continue;}
   var me=frameModEnd(ws,kk,MODS);
   if(me){degs.push(me);start=kk-me.len+1;kk-=me.len;continue;}
   if(ws[kk].w==='and'&&adjs.length){pend=kk;kk--;continue;}
   break;}
  if(!adjs.length)continue;
  /* a greeting, a farewell and a holiday are not days that went well or badly */
  if(DAYQ_IDIOM.indexOf(ws[adjs[adjs.length-1]].w+' '+ws[n].w)>=0)continue;
  var vs=adjs.map(function(a){return DAYQ_ADJ[ws[a].w];});
  var worst=vs.reduce(function(a,b){return (b[0]<a[0]||(b[0]===a[0]&&b[1]>a[1]))?b:a;});
  add(finish({via:'before',valence:worst[0],tier:worst[1],degs:degs,i0:adjs[0],i1:n,
   negated:frameNegBefore(ws,start),adjs:adjs}));}
 /* the day as the subject */
 for(i=0;i<ws.length;i++){
  var sw=ws[i].w.replace(/'s$/,'');
  if(DAYQ_SUBJ.indexOf(sw)<0)continue;
  var j=i+1, negd=false, be=ws[i].w.slice(-2)==="'s"?1:0;
  while(j<ws.length&&ws[j].c===ws[i].c&&DAYQ_BE.indexOf(ws[j].w)>=0&&j-i<=4){
   if(FRAME_NEG.indexOf(ws[j].w)>=0)negd=true; be++; j++;}
  /* a verb the day takes: today sucked */
  if(!be&&ws[j]&&DAYQ_VERB[ws[j].w]){
   add(finish({via:'verb',valence:-1,tier:DAYQ_VERB[ws[j].w],degs:[],i0:i,i1:j,
    negated:frameNegBefore(ws,i),adjs:[j]}));continue;}
  if(!be)continue;
  var degs2=[];
  while(j<ws.length&&ws[j].c===ws[i].c){
   var ma=frameModAt(ws,j,MODS);
   if(ma){degs2.push(ma);j+=ma.len;continue;}
   if(FRAME_SKIP.indexOf(ws[j].w)>=0&&ws[j].w!=='a'&&ws[j].w!=='an'){j++;continue;}
   break;}
  var det=(ws[j]&&(ws[j].w==='a'||ws[j].w==='an'))?1:0;
  var tk=ws[j+det];
  if(!tk||tk.c!==ws[i].c)continue;
  if(!det&&DAYQ_ADJ[tk.w]){
   var dv=DAYQ_ADJ[tk.w];
   add(finish({via:'is',valence:dv[0],tier:dv[1],degs:degs2,i0:i,i1:j,negated:negd||frameNegBefore(ws,i),adjs:[j]}));}
  else if(DAYQ_NOUNQ[tk.w]){
   add(finish({via:'is',valence:-1,tier:DAYQ_NOUNQ[tk.w],degs:degs2,i0:i,i1:j+det,negated:negd||frameNegBefore(ws,i),adjs:[j+det]}));}
  else if(det&&DAYQ_ADJ[tk.w]){
   var dv2=DAYQ_ADJ[tk.w], nx=ws[j+det+1];
   /* "today was a good one" has no day noun to anchor, so it is read as the
      adjective it is */
   add(finish({via:'is',valence:dv2[0],tier:dv2[1],degs:degs2,i0:i,i1:j+det,negated:negd||frameNegBefore(ws,i),adjs:[j+det]}));}}
 /* the fixed phrases */
 DAYQ_PHRASE.forEach(function(p){
  for(var q=0;q<ws.length;q++)if(framePhraseAt(ws,q,p[0])){
   add(finish({via:'phrase',valence:-1,tier:p[1],degs:[],i0:q,i1:q+p[0].split(' ').length-1,
    negated:frameNegBefore(ws,q),adjs:[q]}));}});
 found=found.filter(function(c){return c;});
 if(!found.length)return null;
 /* the heaviest bad one wins, then a good one, then a flat one; earliest on a tie */
 found.sort(function(a,b){
  return (a.valence<0?0:a.valence>0?1:2)-(b.valence<0?0:b.valence>0?1:2)
   ||b.load-a.load||a.i0-b.i0;});
 var c=found[0], a0=c.adjs[0], a1=c.adjs[c.adjs.length-1];
 var sp0=c.via==='before'?a0:(c.via==='phrase'?c.i0:a0), sp1=c.via==='before'?c.i1:(c.via==='phrase'?c.i1:a1);
 return {valence:c.valence, tier:c.tier, load:c.load, via:c.via, mod:c.mod,
  profane:c.adjacentSwear||frameProfane(ws,ws[c.i0].c), flipped:!!c.flipped,
  word:(c.via==='before'||(c.via==='is'&&DAYQ_ADJ[ws[a0].w]))?ws[a0].w:null,
  text:frameTyped(t,ws,sp0,sp1), s:ws[sp0].s, e:ws[sp1].e};}

/* A ROLE OR A PRONOUN AT AN INDEX, as the other party. det is the word
   before it when it was one of my, his, the. */
function frameWho(t,ws,i){
 var w=ws[i]&&ws[i].w, det=(ws[i-1]&&FRAME_DET.indexOf(ws[i-1].w)>=0)?i-1:i;
 if(!w)return null;
 if(ROLES[w]){
  var dw=det<i?ws[det].w:'', you=dw==='my'?'your '+w:((dw==='the'||dw==='this'||dw==='that')?dw+' '+w:w);
  return {word:w, pron:null, role:w, rel:ROLES[w], authority:ROLES[w]==='authority',
   text:frameTyped(t,ws,det,i), you:you, i:i, resolved:false};}
 if(PRON_OTHER[w])
  return {word:w, pron:PRON_OTHER[w], role:null, rel:null, authority:false,
   text:ws[i].w, you:PRON_OTHER[w], i:i, resolved:false};
 return null;}
/* the target after a word: an optional preposition, an optional determiner,
   then a role or a pronoun. j is the first index after the word. */
function frameAim(t,ws,j,c){
 var k=j;
 if(ws[k]&&ws[k].c===c&&FRAME_PREP.indexOf(ws[k].w)>=0)k++;
 if(ws[k]&&ws[k].c===c&&FRAME_DET.indexOf(ws[k].w)>=0&&!PRON_OTHER[ws[k].w])k++;
 if(!ws[k]||ws[k].c!==c)return null;
 return frameWho(t,ws,k);}
/* WHO A PRONOUN MEANS. Only when the entry has named exactly one role before
   it. Two roles, or none, and the pronoun stays a pronoun: choosing between
   two would be the instrument deciding who the person meant. */
function frameResolve(t,ws,who){
 if(!who||who.role||!who.pron)return who;
 var seen={}, last=null;
 for(var k=0;k<who.i;k++)if(ROLES[ws[k].w]){seen[ws[k].w]=1;last=k;}
 var names=Object.keys(seen);
 if(names.length!==1)return who;
 var r=names[0];
 who.role=r; who.rel=ROLES[r]; who.authority=ROLES[r]==='authority'; who.resolved=true;
 /* the phrase the person used for the role when they named it, "my boss",
    which is what a line that has to say who reads back */
 var ref=frameWho(t,ws,last); who.ref=ref?ref.text:r;
 return who;}

function frameFeeling(t,ws,p,MODS,day){
 var best=null, others=0, all=[];
 p.hits.forEach(function(h){
  if(h.kind!=='word')return;
  if(!(h.fet||ADJ2CHG[h.t]))return;
  if(ACTS.indexOf(h.t)>=0)return;
  var i=-1; for(var k=0;k<ws.length;k++)if(ws[k].at===h.at){i=k;break;}
  if(i<0)return;
  /* a word the day quality already used is the day's and not a feeling: "a
     miserable day" is how the day was, and miserable is not said of the person */
  if(day&&ws[i].s>=day.s&&ws[i].e<=day.e)return;
  var n=h.t.split(' ').length, e=i+n-1, c=ws[i].c;
  /* whose feeling. Back up to six words in the clause to the first subject:
     I and me are the person, he, she, they and a role are somebody else. "It
     made me furious" is the person, through the me that stands before it. */
  var mine=true, via=null;
  for(var b=i-1,steps=0;b>=0&&steps<6&&ws[b].c===c;b--,steps++){
   var w=ws[b].w;
   if(FRAME_ME.indexOf(w)>=0){mine=true;break;}
   if(FRAME_THEM.indexOf(w)>=0||ROLES[w]){mine=false;via=b;break;}}
  /* "he irritated me": the subject is somebody else and the feeling is the
     person's, which the me after it says */
  var subjWho=null;
  if(!mine&&((ws[e+1]&&ws[e+1].c===c&&ws[e+1].w==='me')||/\bmy\b/.test(h.t))){
   mine=true;subjWho=frameWho(t,ws,via);}
  if(!mine){others++;return;}
  /* aimed at somebody: a preposition and a target after it, or somebody who is
     the subject of a feeling verb directly before it, "my boss irritated me" */
  var who=subjWho||frameAim(t,ws,e+1,c);
  if(!who){
   var b2=i-1; while(b2>=0&&frameModEnd(ws,b2,MODS))b2--;
   var sw=ws[b2];
   if(sw&&sw.c===c&&(ROLES[sw.w]||PRON_OTHER[sw.w])&&/(ed|nerves|s)$/.test(ws[e].w))who=frameWho(t,ws,b2);}
  who=frameResolve(t,ws,who);
  var amt=h.amt==null?0:h.amt, lvl=amt<18?1:(amt<24?2:3);
  var lifted=false;
  if(frameProfane(ws,c)&&SWEAR_INT.indexOf(h.modw||'')<0&&lvl<3){lvl++;lifted=true;}
  var aimEnd=who?Math.max(who.i,e):e;
  var f={word:h.t, typed:frameTyped(t,ws,i,e), fet:h.fet||CHG2FET[ADJ2CHG[h.t]]||null,
   amt:Math.round(amt*10)/10, level:lvl, lifted:lifted, mod:h.mod||1, modw:h.modw||null,
   other:who||null, aimed:!!who, i:i, text:frameTyped(t,ws,i,aimEnd), s:ws[i].s, e:ws[aimEnd].e};
  all.push(f);
  if(!best||f.amt>best.amt||(f.amt===best.amt&&f.i<best.i))best=f;});
 all.sort(function(a,b){return a.i-b.i;});
 if(best){best.others=others;
  best.all=all.map(function(f){return {word:f.word,typed:f.typed,level:f.level,fet:f.fet,aimed:f.aimed};});}
 return best;}

function frameAct(t,ws){
 var keys=ACTS.slice().sort(function(a,b){return b.split(' ').length-a.split(' ').length;});
 var taken={}, found=[];
 for(var i=0;i<ws.length;i++){
  for(var q=0;q<keys.length;q++){
   var key=keys[q], n=key.split(' ').length;
   if(taken[i]||!framePhraseAt(ws,i,key))continue;
   for(var z=0;z<n;z++)taken[i+z]=1;
   var c=ws[i].c, mine=null, actor=null;
   /* who did it. Back up four words, over a, had, the adverbs and degree
      words, to a subject. */
   for(var b=i-1,st=0;b>=0&&st<4&&ws[b].c===c;b--,st++){
    var w=ws[b].w;
    if(w==='i'||w==='we'){mine=true;break;}
    if((FRAME_THEM.indexOf(w)>=0&&w!=='you')||ROLES[w]){mine=false;actor=b;break;}}
   var e=i+n-1, who=frameAim(t,ws,e+1,c);
   if(!who&&actor!==null)who=frameWho(t,ws,actor);
   /* the person inside the act: "told him off" names him in the key itself */
   if(!who){var kw=key.split(' ');
    for(var y=0;y<kw.length;y++)if(kw[y]==='him'||kw[y]==='her'||kw[y]==='them')
     who={word:kw[y],pron:PRON_OTHER[kw[y]],role:null,rel:null,authority:false,
      text:kw[y],you:PRON_OTHER[kw[y]],i:i+y,resolved:false};}
   who=frameResolve(t,ws,who);
   var end=who&&who.i>e?who.i:e;
   found.push({word:key, typed:frameTyped(t,ws,i,e), mine:mine, other:who||null, i:i,
    text:frameTyped(t,ws,i,end), s:ws[i].s, e:ws[end].e,
    channels:ACT_CHANNELS.slice()});}}
 if(!found.length)return null;
 found.sort(function(a,b){return (b.other?1:0)-(a.other?1:0)||a.i-b.i;});
 return found[0];}

/* a thing that happened: somebody, then a verb that is not was or had */
function frameEvent(t,ws,MODS,skip){
 var out=null;
 function isVerb(w){
  if(PAST_LIGHT.indexOf(w)>=0||FRAME_STATE.indexOf(w)>=0||DAYQ_ADJ[w])return false;
  var L=LEX[w];
  if(ADJ2CHG[w]||(L&&L[LEX_FET]))return false;
  return PAST_IRR.indexOf(w)>=0||(w.length>3&&/ed$/.test(w));}
 for(var i=0;i<ws.length&&!out;i++){
  if(skip&&skip[i])continue;
  var w=ws[i].w, c=ws[i].c, subj=null, vi=-1;
  if(w==='i'||w==='we'||w==='he'||w==='she'||w==='they'||w==='it'||ROLES[w])subj=w;
  else if(FRAME_DET.indexOf(w)>=0&&ws[i+1]&&ws[i+2]&&ws[i+2].c===c&&!ROLES[ws[i+1].w]){
   /* the det, a noun, a verb: "my car broke down" */
   if(isVerb(ws[i+2].w)){out={mine:false,typed:frameTyped(t,ws,i,i+2),i:i};}
   continue;}
  if(!subj)continue;
  var j=i+1;
  while(j<ws.length&&ws[j].c===c&&(FRAME_ADV.indexOf(ws[j].w)>=0||frameModAt(ws,j,MODS)))j++;
  /* "it made me depressed" is a feeling and not a thing that happened */
  if(j<ws.length&&ws[j].w==='made'&&ws[j+1]&&/^(me|us|him|her|them)$/.test(ws[j+1].w)&&ws[j+2]&&
   (ADJ2CHG[ws[j+2].w]||LEX[ws[j+2].w]||DAYQ_ADJ[ws[j+2].w]))continue;
  if(j<ws.length&&ws[j].c===c&&isVerb(ws[j].w))out={mine:(subj==='i'||subj==='we'),typed:frameTyped(t,ws,i,j),i:i};}
 return out;}

/* THE ENTRY, READ. text is what the person wrote, exactly as they wrote it,
   and opts.asked is the slots the chain has already asked in this entry.
   Returns every slot, what is missing, and the one to ask next. */
function storyFrame(text,opts){
 var t=String(text||''), o=opts||{};
 var out={empty:!t.trim(), has:false, trigger:false, day:null, event:null, other:null,
  act:null, feeling:null, feelings:[], note:[], body:null, under:null, channels:[], channelWords:{},
  profane:false, missing:[], ask:null, question:null, questions:{}};
 if(out.empty)return out;
 var nm=normMap(t), ws=wordsOf(t,nm), MODS=frameMods(), p=parseStory(t);
 out.day=frameDay(t,ws,MODS);
 out.feeling=frameFeeling(t,ws,p,MODS,out.day);
 out.feelings=out.feeling?out.feeling.all:[];
 /* what the entry says about the other person that is not a feeling of the
    writer's: "He showed no remorse." The sniffer takes a lacked feeling said
    of somebody else out of its hits, p.aboutOther, so it is not charged to the
    person who wrote it and is not struck on the page as their negated word.
    Here it is kept, whole and in the person's own letters, as a note about
    him. It does not answer what happened: showing no remorse is something he
    did, and the confrontation it follows is still not said. */
 out.note=(p.aboutOther||[]).map(function(a){
  var i=-1,j=-1; for(var k=0;k<ws.length;k++){if(ws[k].at===a.from)i=k; if(ws[k].at===a.at)j=k;}
  var n=a.t.split(' ').length;
  return i>=0&&j>=0?{kind:'lacks',who:a.who,word:a.t,text:frameTyped(t,ws,i,Math.min(ws.length-1,j+n-1))}:null;})
  .filter(function(x){return x;});
 var skipEv={};
 (p.aboutOther||[]).forEach(function(a){for(var k=0;k<ws.length;k++)if(ws[k].at===a.from)skipEv[k]=1;});
 out.event=frameEvent(t,ws,MODS,skipEv);
 out.act=frameAct(t,ws);
 /* THE OTHER PARTY, in order of how directly the words name them: the target
    of a feeling, the target or doer of an act, and last any role named at all,
    which says somebody is in the story and not that the feeling was aimed. */
 out.other=(out.feeling&&out.feeling.other)||(out.act&&out.act.other)||null;
 if(!out.other)for(var k=0;k<ws.length;k++)if(ROLES[ws[k].w]){
  out.other=frameResolve(t,ws,frameWho(t,ws,k));out.other.via='named';break;}
 out.profane=ws.some(function(w){return frameSwearWord(w.w);});
 var d=srcDims(t), ans=d.answered;
 var feltWord=(ans.feeling||[]).some(function(x){return SRC_FEEL_V.indexOf(x.split(' ')[0])>=0&&x.indexOf(' ')>0;});
 var did=!!(ans.behaviour||(out.event&&out.event.mine)||(out.act&&out.act.mine===true&&ACT_NOUN.indexOf(out.act.word)<0));
 var src=nm.s;
 out.body=ans.body?ans.body.slice():null;
 out.under=(ans.meaning||ans.belief||ans.goal||(srcCue(src,'because')?['because']:null)||null);
 var answered={what:!!out.event, did:did, feel:!!(out.feeling||feltWord), where:!!ans.body, under:!!out.under};
 out.answered=answered;
 out.has=!!(out.day||out.feeling||out.act);
 out.trigger=!!((out.day&&out.day.valence<0)||(out.act&&out.other)||(out.feeling&&out.feeling.other));
 out.missing=FRAME_SLOTS.filter(function(s){return !answered[s];});
 /* the six channels the words sit in, as facts about the words */
 function chan(name,w){if(out.channels.indexOf(name)<0)out.channels.push(name);
  (out.channelWords[name]=out.channelWords[name]||[]).push(w);}
 if(out.act)ACT_CHANNELS.forEach(function(c){chan(c,out.act.typed);});
 if(out.feeling)chan('feeling',out.feeling.typed);
 Object.keys(CHAN_CUE).forEach(function(c){CHAN_CUE[c].forEach(function(cue){
  if(srcCue(src,cue))chan(c,cue);});});
 out.channels=C3_VERB.filter(function(c){return out.channels.indexOf(c)>=0;});
 var asked=o.asked||[];
 out.ask=out.missing.filter(function(s){return asked.indexOf(s)<0;})[0]||null;
 out.questions={};
 out.missing.forEach(function(sl){out.questions[sl]=frameQuestion(out,sl);});
 out.question=out.ask?out.questions[out.ask]:null;
 return out;}

/* THE DAY'S RUNNING ENTRIES, read as one story. The texts joined by a line
   break, which the clause floor reads as a boundary, so a negation in one
   entry cannot reach into the next. WHO MAY PASS IT. Source AI reads the seat
   keys of earlier entries and not their text, round GO; whether it may read
   the text is DESIGN-sniffer.md question 12 and is the owner's. This function
   takes any texts and does not decide that: the Story page passes the entry
   being written and nothing else. */
function storyFrameDay(texts,opts){
 return storyFrame((texts||[]).filter(function(x){return String(x||'').trim();}).join('\n'),opts);}

/* THE QUESTIONS, in the house voice: short, casual, one thing at a time, the
   person's own words quoted back when there are some to quote and never a
   word of ours put in their mouth. The quote is the span they typed, without
   the degree word and without any swear, so a question never echoes a
   profanity back at them and never repeats the intensifier. None of them says
   why anything happened. */
function frameYou(who){return who?(who.you||who.word):null;}
function frameQuestion(f,slot){
 var q='', quote='', who=f.other, subj=who?frameYou(who):null;
 var doer=who?(who.pron||subj):null;
 if(slot==='what'){
  if(f.act&&f.act.other){quote=f.act.text;
   q='What did '+(f.act.other.pron||frameYou(f.act.other))+' do or say?';}
  else if(f.feeling&&f.feeling.other){quote=f.feeling.text;
   q='What did '+(f.feeling.other.pron||frameYou(f.feeling.other))+' do?';}
  else if(f.day&&f.day.valence<0){quote=f.day.text;
   if(f.day.flipped)quote='';
   q=f.day.flipped?'What got in the way?':(f.day.word?'What made it '+(f.day.word==='worst'?'the worst':f.day.word)+'?':'What happened?');}
  else if(f.feeling){quote=f.feeling.text;q='What happened?';}
  else if(f.act){quote=f.act.text;q='What happened?';}
  else if(f.day){quote=f.day.text;q=(f.day.valence>0&&f.day.word)?'What made it '+f.day.word+'?':'What happened?';}
  else q='What happened?';}
 else if(slot==='did'){
  quote=(f.act&&f.act.text)||(f.feeling&&f.feeling.text)||'';
  q='What did you do?';}
 else if(slot==='feel'){
  quote=(f.act&&f.act.text)||(f.day&&f.day.text)||'';
  q='How did you feel?';}
 else if(slot==='where'){
  quote=(f.feeling&&f.feeling.text)||'';
  q='Where did you feel it?';}
 else if(slot==='under'){
  quote=(f.feeling&&f.feeling.text)||(f.act&&f.act.text)||(f.day&&f.day.text)||'';
  q='What was under it?';}
 return {slot:slot, quote:quote, q:quote?'You wrote “'+quote+'”. '+q:q, ask:q};}

/* ============================================================
   THE SUBJECT OF A STORY, round OZ, his words: "the release prompt doesn't
   have the subject. It says I give up separation, but it doesn't say what. So
   the story needs to ALWAYS HAVE THE SUBJECT." An imprint said which address
   and how much and never who or what it was about, so a release line built
   from it could say "I give up separation" and no more.

   WHAT A SUBJECT IS. What or who the words that made the imprint are about,
   taken from the person's own sentence, in this order, and the order is the
   rule:

     1  the clause itself. A target after the word, "irritated by him",
        "a confrontation with my boss", "angry at her", or somebody who is the
        subject of the word, "he got on my nerves", "my boss irritated me".
        kind other, from clause.
     2  the person themself, stated. "I felt hopeless" with nobody else in the
        clause: the sentence says I. kind self, from clause.
     3  the entry. When the clause names nobody and does not say I, as in "it
        made me mad", the one other person the entry names, and failing that
        the event it names, the confrontation. kind other or event, from entry.
     4  nothing. The person themself, as a default and marked as one: kind
        inferred, from none. Never presented as something they said.

   A pronoun is kept as the pronoun the person used ("him") and carries the
   role it was resolved to ("boss", ref "my boss") only when the entry names
   exactly one role before it, the same rule the frame uses and for the same
   reason: choosing between two would be the instrument deciding who was meant.

   WHAT AN IMPRINT TAKES. Imprints are made per seat, so the seat's subject is
   the subject of the heaviest word there that had one in its own clause, then
   a stated self, then the entry's. Every word keeps its own as well, in
   subjects, so two clauses at one seat are both on the record.
   ============================================================ */
var SUBJ_KINDS=['other','self','event','inferred'];
var SUBJ_FROM=['clause','entry','none'];
/* the preposition each address name takes before a person, where one is
   certain. Everything else takes "with", which is true of any of them and
   claims the least. A release line owns its own grammar; this is the part the
   data can say. */
var SUBJ_PREP={separation:'from',abandonment:'by',rejection:'by',fear:'of',anger:'at',
 hatred:'toward',resentment:'toward',longing:'for',grief:'over',shame:'about',guilt:'about'};
function frameTarget(t,ws,i,e,c){
 /* who the words are about: the target after them, or the somebody who is
    their subject, and whether the person said I */
 var who=frameAim(t,ws,e+1,c), subj=null, statedI=false, key=ws.slice(i,e+1).map(function(x){return x.w;}).join(' ');
 /* BACK UP TO THE SUBJECT, and stop at a conjunction for anybody but the
    person: "I snapped at my sister and felt ashamed" is ashamed of the
    snapping and not of her, so the sister before the "and" is not the subject
    of what follows it, where an I before it still is. */
 var crossed=false;
 for(var b=i-1,st=0;b>=0&&st<8&&ws[b].c===c;b--,st++){
  var w=ws[b].w;
  if(w==='and'||w==='but'||w==='then'||w==='because'||w==='so'||w==='while'){crossed=true;continue;}
  if(w==='i'||w==="i'm"||w==='im'){statedI=true;break;}
  if(w==='me'||w==='myself'){break;}
  if(FRAME_THEM.indexOf(w)>=0||ROLES[w]){if(!crossed)subj=b;break;}}
 if(!who&&subj!==null)who=frameWho(t,ws,subj);
 if(who)who=frameResolve(t,ws,who);
 return {who:who||null, statedI:statedI&&!who};}
function hitSubjects(t,hits){
 var nm=normMap(t), ws=wordsOf(t,nm), out=[], seats={};
 if(!hits||!hits.length||!ws.length)return {hits:out,seats:seats};
 /* the entry's one other person, for the clause that names nobody */
 var firstWho=null, entryRole=null, act=null;
 hits.forEach(function(h){
  if(h.kind==='adj'||!h.band||h.band==='coherent')return;
  var i=-1; for(var k=0;k<ws.length;k++)if(ws[k].at===h.at){i=k;break;}
  if(i<0)return;
  var e=i+String(h.t).split(' ').length-1, tg=frameTarget(t,ws,i,e,ws[i].c);
  var rec={t:h.t, at:h.at, seat:h.band, amt:Math.abs(h.amt||0), subject:null, kind:null,
   role:null, ref:null, from:null, why:null};
  if(tg.who){
   rec.pron=!!(tg.who.pron&&!tg.who.role);
   rec.subject=tg.who.text; rec.kind='other'; rec.role=tg.who.role||null;
   rec.ref=tg.who.ref||(tg.who.role&&tg.who.text!==tg.who.role?tg.who.text:null)||null;
   rec.from='clause'; rec.why='the clause is about '+tg.who.text;
   if(!firstWho)firstWho=tg.who;}
  else if(tg.statedI){
   rec.subject='myself'; rec.kind='self'; rec.from='clause'; rec.why='the clause says I';}
  out.push(rec);});
 for(var k=0;k<ws.length&&!entryRole;k++)if(ROLES[ws[k].w])entryRole=frameResolve(t,ws,frameWho(t,ws,k));
 act=frameAct(t,ws);
 /* THE ENTRY'S FALLBACK, in the order written above */
 var fb;
 if(firstWho)fb={subject:firstWho.text,kind:'other',role:firstWho.role||null,ref:firstWho.ref||null,
  from:'entry',why:'the entry is about '+firstWho.text};
 else if(entryRole)fb={subject:entryRole.text,kind:'other',role:entryRole.role,ref:null,
  from:'entry',why:'the entry names '+entryRole.text};
 else if(act)fb={subject:act.text,kind:'event',role:null,ref:null,from:'entry',
  why:'the entry names '+act.typed};
 else fb={subject:'myself',kind:'inferred',role:null,ref:null,from:'none',
  why:'nothing in the entry says who it is about'};
 out.forEach(function(r){
  if(r.kind)return;
  r.subject=fb.subject; r.kind=fb.kind; r.role=fb.role; r.ref=fb.ref; r.from=fb.from; r.why=fb.why;});
 /* a seat takes the subject of its heaviest word that had one in its own
    clause, then a stated self, then the entry's */
 var rank={other:0,self:1,event:2,inferred:3};
 out.forEach(function(r){
  var cur=seats[r.seat], better=!cur;
  if(cur){
   var ra=(r.from==='clause'?rank[r.kind]:4), rb=(cur.from==='clause'?rank[cur.kind]:4);
   better=ra<rb||(ra===rb&&r.amt>cur.amt);}
  if(better)seats[r.seat]=r;});
 /* never longer than the boundary will take: an act span is the person's
    own words and may run on */
 out.forEach(function(r){r.subject=String(r.subject).slice(0,SUBJ_MAX); if(r.ref)r.ref=String(r.ref).slice(0,SUBJ_MAX);});
 var map={};
 Object.keys(seats).forEach(function(k){var r=seats[k];
  map[k]={subject:r.subject,kind:r.kind,role:r.role,ref:r.ref,from:r.from,why:r.why};});
 return {hits:out,seats:map};}
/* THE LINE A RELEASE CAN SAY. An imprint's address name and who it was about,
   joined: "separation from my boss". A pronoun is read back as the role the
   entry named it as, "my boss", when it resolved to one, and as the pronoun the
   person used when it did not. A stated self reads "in myself". An imprint
   whose subject was only inferred says nothing about anybody, because the
   instrument did not hear it, and the line is the name alone. The pieces are
   returned as well, so a release that owns its own grammar can use them. */
var SUBJ_OBJ={he:'him',she:'her',they:'them'};
function subjectLine(im){
 var name=String((im&&im.name)||'').replace(/\s*\(.*\)\s*$/,'').toLowerCase();
 var out={name:name, subject:null, kind:(im&&im.subjectKind)||null, prep:null, tail:'', line:name, certain:false};
 if(!im||!im.subject||!im.subjectKind)return out;
 if(im.subjectKind==='inferred')return out;
 var who=im.subjectRef||im.subject;
 /* a sentence that opened on My boss reads back as my boss, and he, she and
    they, which are subjects, read back as him, her and them, which is what
    follows a preposition */
 who=SUBJ_OBJ[who]||who.replace(/^(My|His|Her|Their|The|Our|Your)\b/,function(m){return m.toLowerCase();});
 if(im.subjectKind==='self'){out.prep='in';who='myself';}
 else if(im.subjectKind==='event'){out.prep='around';}
 else out.prep=SUBJ_PREP[name]||'with';
 out.subject=who; out.tail=out.prep+' '+who; out.line=name+' '+out.tail; out.certain=im.subjectFrom==='clause';
 return out;}

/* ============================================================
   IS THE SUBJECT CLEAR, round PA. The owner wants the Mirror's "Not quite" to be
   able to say that the subject is not clear. This is the check it asks: for
   every word the sniffer read, was who or what it is about said in the
   person's own clause, and said as somebody, and not as a pronoun with
   nobody behind it. It reports each word that fails and why, in the person's
   own letters, and it is a reading of the writing and never of the person.

   A word is unclear when
     the clause names nobody and does not say I, and the subject was taken from
       the rest of the entry (from entry), or from nothing at all (from none)
     the clause names somebody only as he, she, they, him, her or them, and the
       entry has not named exactly one role for it to be (a pronoun with
       nobody behind it)
   A stated I is clear. A role named in the clause is clear. An act in the
   clause is clear.

   `clear` is true when no word is unclear and at least one was read. An entry
   the sniffer read nothing in has no subject to be unclear about, so it is
   neither clear nor unclear: `read` is false and the Mirror has nothing to say.
   ============================================================ */
var SUBJECT_UNCLEAR='The subject is not clear.';
function subjectCheck(text){
 var p=parseStory(text), items=[];
 (p.subjects||[]).forEach(function(r){
  var why=null;
  if(r.from==='none')why='nothing in the entry says who or what this is about';
  else if(r.from==='entry')why='the clause names nobody, so the subject was taken from the rest of the entry';
  else if(r.pron&&!r.role)why='the clause says '+r.subject+' and the entry does not say who that is';
  items.push({word:r.t,subject:r.subject,kind:r.kind,from:r.from,unclear:!!why,why:why});});
 var unclear=items.filter(function(x){return x.unclear;});
 return {read:items.length>0, clear:items.length>0&&!unclear.length, unclear:unclear, items:items,
  say:(items.length&&unclear.length)?SUBJECT_UNCLEAR:null};}

/* ============================================================
   THE MIRROR'S CAUSE LINE, round OX, his words: "Four, let's try it": the
   Mirror's cause line is the person's OWN second answer quoted back, with no
   language step. The question the chain asked is what made it rough, or what
   he did, and what the person wrote in answer is the cause line. Nothing is
   composed: the answer comes back as typed, trimmed of the space around it and
   of nothing else, and it carries the question it answered so the Mirror can
   say what it is quoting. A first answer with no frame, or no second answer,
   gives no cause line, and the Mirror shows none rather than writing one.
   ============================================================ */
function mirrorCause(first,second){
 var a=String(second==null?'':second).trim();
 if(!a)return null;
 var f=storyFrame(String(first||'')), q=f.questions&&f.questions.what?f.questions.what:null;
 return {cause:a, asked:q?q.q:null, slot:'what', verbatim:true};}
