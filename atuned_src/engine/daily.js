/* ============================================================
   THE DAILY SUMMARY. The engine half of the page the owner ruled on 1
   October (round OI): once a day, on open, frozen, and the previous day goes
   into a bank. Audited in SUMMARY-AUDIT.md against
   ATUNED-daily-summary-personal-mirror-TDD.md, whose addendum is the spec
   where the two differ.

   HOST FREE. Nothing here touches a document, a store or a network, and the
   moment is always passed in. A write goes through the one boundary
   (dlyValidate) and returns a new summaries object, the way practiceDo does,
   so a refused write leaves the old object exactly as it was and the caller
   has nothing to put back. The one function that persists is dlyDayOpen, and
   it does not call a store: the host hands it the save function, and a save
   that fails puts the old object back and says why.

   NO MODEL. Rules and templates over the record. A model would sit outside
   engine/, behind the one seam ui/auth.js already is, and would hand back
   proposals marked proposed that go through dlyGround exactly as a template
   does. Nothing here calls one, and nothing here pretends to.

   WHAT IS STORED, said once.
     p.summaries = { v, days:[frozen day, ...], events:[event, ...] }
   days is append only, one per local day, never edited: a frozen day carries
   its statements as they were SHOWN, text and all, so a template edited in a
   later build cannot change what an old day said. events is ONE numbered
   append only list: the person's one aim for a day, the mark they gave it,
   and their response to a sentence. The aim is an event and not a field on the
   day because the day is frozen on the first open and the person writes the
   line after it was composed. What an aim currently reads as, and what a
   sentence currently stands as, is a fold over the events, never stored.

   THE AIM IS NOT CALLED INTENTION, AND THE STORED KINDS ARE aim_set AND
   aim_answer. That word already names three things here (the band mean of the
   laws, the ritual said against done in engine/ladder.js, and one of the six
   gates in engine/verp.js) and the trace and practice builds use "intent" for
   a typed edge waiting to be applied (practiceTraceIntents). A fourth and a
   fifth meaning is the defect one word per concept exists to stop. "aim" is
   free in this codebase. It is a stored name and not a UI word: what the page
   calls it is the owner's, and DLY_AIM_WORD is the one constant a sentence
   reads it from. Renaming the stored kinds later is a migration, which is why
   they are settled before any record carries one.

   THE LANGUAGE IS A SOFT RULE, ruled 1 October: "keep it as the language as
   universal as possible... I don't want to be a super hard rule... part of this
   is educating the person and cross pollinating the language." The seven
   phrases of the document's section 12 are reported as a note and never
   refuse a statement, and the product's own canon words may appear and link to
   their Knowledge base entry (DLY_CANON). What stays hard is the document's
   non claims: no diagnosis, no unsupported cause, no fabricated evidence, no
   worth scoring, no deterministic claim about the future, and, from the same
   day's ruling that points never go down, no penalty language.

   WHAT IS NOT HERE. No page, no History view and no response controls
   (slice D8 and after). No behaviour: nothing records what a person did, so no
   sentence says they acted. Nothing about a day nobody opened the app: that
   day has no summary and cannot be made later.

   ONE LOCAL DAY. A day is the local calendar date at the moment of opening,
   through pracDay, because a streak and an aim are counted in days a person
   lived. The boundary allows one day of slack into the future so a person
   who flew west and back does not find their own bank refused on import.
   ============================================================ */
var DLY_SCHEMA_V=1;
/* THE RULE VERSION, an integer set by hand and bumped with any template or
   detector change. It is stamped on every day beside LEX_VERSION, CQ_MODEL and
   TRACE_ALG, because a day read under one rule and a day read under another
   are not comparable and a bank that cannot say which is which will be
   compared anyway. */
var DLY_RULES=1;
/* section 14's eight blocks, in its order. today, what is showing up, what is
   getting in the way, what is changing, what needs attention, today's
   intention, try this, why. The gate reads the headings off the document and
   holds this list to them. */
var DLY_BLOCKS=['today','showing','interfering','changing','attention','aim','try','why'];
/* a rung is a count a person could check, never a number between 0 and 1.
   Ordered, lowest first. apart is two records of one thing that differ, a
   ritual set and a ritual done, and it is a name and not a verdict: the rung
   is never printed. */
var DLY_RUNGS=['once','repeated','windowed','apart'];
var DLY_SRC=PR_SRC.slice();
/* provenance by strength. A statement may be no stronger than the weakest
   thing it cites: a count of words read off a story is inferred, and a
   sentence calling it known would be the hidden inference section 25 forbids. */
var DLY_RANK={proposed:0, inferred:1, known:2, user_confirmed:2, observed:2};
/* the aim's mark, set by the person and nobody else. The document's section
   4.7 says completed and missed. This is the owner's list, ruled 1 October,
   and it has no word for failure: a day with no aim loses nothing. */
var DLY_ANSWER=['kept','partly','not','unknown'];
/* section 24's six, in its order, as the kinds of response */
var DLY_RESP=['accurate','partly','not','why','context','correct'];
var DLY_RESP_TEXT=['context','correct'];
var DLY_EV=['aim_set','aim_answer'].concat(DLY_RESP);
/* the noun a sentence prints for the aim. One constant, because the word is
   the owner's to rule on (question 13) and a sentence frozen into a day says
   what was true the day it was written. */
var DLY_AIM_WORD='aim';
/* record references. The trace graph is closed over its node types and has no
   node for these, so they resolve against the record itself. */
var DLY_REC=['history','law','first','ritualday','avatar','aim'];
/* ceilings, refused above and never truncated. The day cap is a retention
   decision and the owner's (question 6), so this is a placeholder with the
   posture of PR_CAP: past it a write is refused and nothing old is trimmed,
   because rewriting an old day is the thing this design refuses. */
var DLY_CAP={days:3660, events:40000, st:8, ev:12, a:12, read:12, links:4,
 text:400, arg:240, id:200, aim:200, note:600, tpl:60};
/* A READING IS NOT A SCORE, and a missed aim is no entry and never a loss.
   Both lists are keys refused by name wherever they appear on a day, a
   statement or an event, whatever their value. */
var DLY_SCORE=['confidence','language_confidence','score','focus','rank','weight','percent'];
var DLY_LOSS=['points','penalty','loss','deduct','streak'];
var DLY_SILENT=['unread','thin'];
/* the spans a day reads, through spanOf and not retyped */
var DLY_SPANS=['week','month','quarter'];
/* WHEN A MOVE IS A MOVE. Set by hand and not calibrated against anything,
   which is said here so nobody reads them as measured: a reading that shifts
   by less than this is reported as level. CQ is 0 to 100, a law is 0 to 10. */
var DLY_MOVE={cq:1, dq:1, law:0.5};
/* a sentence with the same template and the same arguments as one frozen in
   the last week is not composed again, which is how a day stays fresh without
   a number being invented to say so */
var DLY_NOVEL_DAYS=7;
var DLY_EDU_DAYS=30;
/* how many sentences one block may carry, and which blocks survive when more
   than DLY_CAP.st compete. The document asks for two to four observations and
   one to three obstacles, and one practice, one focus. */
var DLY_BLOCK_MAX={today:1, showing:3, interfering:1, changing:2, attention:1, aim:1, try:1, why:2};
var DLY_PRI={aim:0, attention:1, try:1, today:2, changing:3, interfering:4, why:5, showing:6, edu:7};
/* the seven phrases of the document's section 12. A soft note, never a refusal */
var DLY_NOTE_PHRASES=['divine energy','cosmic destiny','soul evolution','spiritual vibration',
 'karmic certainty','your universe is telling you','your energy guarantees'];
/* THE CANON WORDS, the owner's own, and the Knowledge base entry each one
   points at. A word with no entry has t null, and that is content for the copy
   seat and not a defect here: a search of the Knowledge base on 1 October
   finds no entry for soul, spiritual or energy. seat points at Chakra, whose
   entry begins "A seat." */
var DLY_CANON=[{w:'soul',t:null},{w:'spiritual',t:null},{w:'source',t:'Source'},{w:'energy',t:null},
 {w:'seat',t:'Chakra'},{w:'charge',t:'Charge'},{w:'coherence',t:'Coherence'},{w:'address',t:'Address'}];

/* ---------------- the templates ----------------
   src is the strongest provenance a template may carry, and a statement may be
   no stronger than that or than the weakest thing it cites. A sentence read off
   the person's words through the lexicon is inferred, because the lexicon
   chose the seat, and a template that says known about it would be the hidden
   inference section 25 forbids.

   A slot takes a count, a day, or a name from a canon table (a seat, a law),
   never free text. The person's own words are not copied into sealed text: they
   appear in the drawer, read live from the entry a reference names. A
   template that cites something read off the story has a hedged variant, id
   plus .h, used when the evidence is one record (show_uncertainty).
   @aim and @aims print DLY_AIM_WORD. */
var DLY_TPL=[
 {id:'today.read', src:'known', k:'today', text:'Your latest saved reading is from {0}. The {1} seat carried the most weight in it.'},
 {id:'show.seat', src:'inferred', k:'showing', text:'In the last {0} days, entries touched the {1} seat on {2} separate days.'},
 {id:'show.seat.h', src:'inferred', k:'showing', text:'So far one entry, from {0}, touched the {1} seat.'},
 {id:'show.seat.new', src:'inferred', k:'showing', text:'In the last {0} days, entries touched the {1} seat. In the {2} days before that, none did.'},
 {id:'show.cue', src:'inferred', k:'showing', text:'Words that read as {1} came up {2} times across {3} entries in the last {0} days. They are counted here and not quoted.'},
 {id:'show.cue.h', src:'inferred', k:'showing', text:'So far one entry, from {0}, carried words that read as {1}. They are counted here and not quoted.'},
 {id:'show.opened', src:'known', k:'showing', text:'{1} addresses were opened for the first time in the last {0} days. The latest was on {2}.'},
 {id:'show.opened.1', src:'known', k:'showing', text:'An address was opened for the first time in the last {0} days, on {1}.'},
 {id:'show.ritual', src:'known', k:'showing', text:'In the last {0} days you set {1} rituals and marked {2} done. Both counts are your own entries.'},
 {id:'show.ritual.1', src:'known', k:'showing', text:'In the last {0} days you set one ritual and marked {1} done. Both counts are your own entries.'},
 {id:'show.avatar', src:'inferred', k:'showing', text:'Entries in the last {0} days touched the {1} seat {2} times. Your avatar has a line written for that seat.'},
 {id:'show.avatar.h', src:'inferred', k:'showing', text:'So far one entry, from {0}, touched the {1} seat, where your avatar has a line written.'},
 {id:'intf.seat', src:'known', k:'interfering', text:'The {1} seat carried the most weight in {2} saved readings in the last {0} days.'},
 {id:'chg.heavy', src:'known', k:'changing', text:'The seat carrying the most weight moved from {0} on {1} to {2} on {3}.'},
 {id:'chg.law', src:'known', k:'changing', text:'Your answer for {0} moved {1} between {2} and {3}, across {4} saved readings.'},
 {id:'chg.cq', src:'known', k:'changing', text:'Across {1} saved readings in the last {0} days, your coherence moved {2}.'},
 {id:'chg.cq.level', src:'known', k:'changing', text:'Across {1} saved readings in the last {0} days, your coherence stayed level.'},
 {id:'chg.dq', src:'known', k:'changing', text:'Across {1} saved readings in the last {0} days, the charge held at your addresses moved {2}.'},
 {id:'chg.dq.level', src:'known', k:'changing', text:'Across {1} saved readings in the last {0} days, the charge held at your addresses stayed level.'},
 {id:'att.seat', src:'inferred', k:'attention', text:'In the last {0} days, the {1} seat has {2} separate days of evidence behind it, the most of any seat.'},
 {id:'aim.fold', src:'known', k:'aim', text:'In the last {0} days you wrote {1} @aims and marked {2} kept, {3} partly kept, {4} not kept and {5} unknown.'},
 {id:'aim.fold.1', src:'known', k:'aim', text:'You wrote one @aim in the last {0} days, on {1}, and marked it {2}.'},
 {id:'try.avatar', src:'known', k:'try', text:'Your avatar was last reviewed on {0}. A monthly review is due.'},
 {id:'why.basis', src:'known', k:'why', text:'These sentences are read from {1} saved readings, {2} entries and {3} ritual days in the last {0} days.'},
 {id:'why.edu', src:'known', k:'why', text:'A word used above: {0}. {1}'}];
function dlyTpl(id){for(var i=0;i<DLY_TPL.length;i++)if(DLY_TPL[i].id===id)return DLY_TPL[i]; return null;}
function dlyFill(t,args){
 return t.text.replace(/\{(\d)\}/g,function(m,i){return args[+i];})
  .replace(/@aims/g,DLY_AIM_WORD+'s').replace(/@aim/g,DLY_AIM_WORD);}

/* ---------------- small pure helpers ---------------- */
/* a local calendar day, 'YYYY-MM-DD', or null. pracDay is the local frame. */
function dlyDay(t){
 var n=pracDay(t); if(n===null)return null;
 return new Date(n*DAY_MS).toISOString().slice(0,10);}
function dlyDateOk(d){
 return typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)
  &&!isNaN(Date.parse(d+'T00:00:00Z'))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;}
function dlyDayNum(d){return Math.round(Date.parse(d+'T00:00:00Z')/DAY_MS);}
var DLY_MONTHS=['January','February','March','April','May','June','July','August','September',
 'October','November','December'];
/* '2026-10-03' as '3 October', which is a slot's own printed form so a digit
   in the sentence is a digit in an argument */
function dlyDayWord(d){return (+d.slice(8))+' '+DLY_MONTHS[+d.slice(5,7)-1];}
function dlyDigits(s){return String(s).match(/\d+/g)||[];}
var DLY_GLOSS_IX={};
GLOSS.forEach(function(g){DLY_GLOSS_IX[g.t]=g;});
function dlyGloss(term){
 return (typeof term==='string'&&Object.prototype.hasOwnProperty.call(DLY_GLOSS_IX,term))?DLY_GLOSS_IX[term]:null;}
function dlyWords(s){return String(s).toLowerCase().split(/[^a-z0-9']+/).filter(Boolean);}
function dlyBlank(){return {v:DLY_SCHEMA_V, days:[], events:[]};}
/* the tokens of a person's own name, for the one rule about it. A token that is
   also a canon name (a seat, a law, a fetter) is dropped: a person called
   Justice must not make every sentence about the law refuse. */
function dlyNamesOf(p){
 var out=[], canon={};
 BANDS.concat(SINAMES,CHARGES).forEach(function(w){dlyWords(w).forEach(function(x){canon[x]=1;});});
 var add=function(s){dlyWords(s).forEach(function(w){
  if(w.length>=2&&!canon[w]&&out.indexOf(w)<0)out.push(w);});};
 if(!p)return out;
 add(p.name); if(p.who&&typeof p.who==='object'){add(p.who.first); add(p.who.middle); add(p.who.last);}
 return out;}
function dlyNameHit(s,names){
 var w=dlyWords(s);
 for(var i=0;i<names.length;i++)if(w.indexOf(names[i])>=0)return names[i];
 return null;}

/* ============================================================
   THE BOUNDARY. validateProfile hands p.summaries here, so an import is atomic
   with everything else on the record: one error here refuses the whole record
   and nothing moves. Every error names its path. A missing summaries is an
   older record and keeps the blank, and nothing is ever clamped, because a
   clamped sentence reads back to the person as something they never said.
   A key nobody declared is refused by name rather than dropped, which is the
   hole audit probe X7 measured for p.summaries before this existed.
   ============================================================ */
function dlyKeys(errs,path,x,allow){
 Object.keys(x).forEach(function(k){
  if(DLY_SCORE.indexOf(k)>=0)errs.push(path+' may not carry '+k+'. A reading is not a score');
  else if(DLY_LOSS.indexOf(k)>=0)errs.push(path+' may not carry '+k
   +'. A day with no aim loses nothing, so no loss is written down');
  else if(PR_NEVER.indexOf(k)>=0)errs.push(path+' may not carry '+k
   +': a day belongs to the record that holds it and carries no account, payment or session field');
  else if(k==='prompt_version'||k==='model')errs.push(path+' may not carry '+k
   +': this build claims no model wrote it');
  else if(allow.indexOf(k)<0)errs.push(path+' may not carry '+k);});}
function dlyInt(errs,path,v,lo,hi){
 if(!NUM(v)||v%1!==0){errs.push(path+' is not a whole number'); return null;}
 if(v<lo||v>hi){errs.push(path+' is '+v+', outside '+lo+' to '+hi); return null;}
 return v;}
function dlyIso(errs,path,v){
 if(typeof v!=='string'||isNaN(Date.parse(v))){errs.push(path+' is not a date'); return null;}
 return v;}
function dlyStr(errs,path,v,max){
 var s=vStr(errs,path,v,max); if(s===null)return null;
 if(!s.trim().length){errs.push(path+' is empty'); return null;}
 return s;}
/* why a reference names nothing, or null. Three kinds: a trace node (the
   graph's own types), a record reference, and kb, a term in the Knowledge base
   that an education statement points at. */
function dlyRefWhy(type,id){
 if(typeof type!=='string'||typeof id!=='string'||!id.length||id.length>DLY_CAP.id)
  return 'names no kind of evidence this build holds';
 if(/[\u0000-\u001f]/.test(id))return 'carries a control character';
 if(type==='kb')return dlyGloss(id)?null:'names no entry in the Knowledge base: '+id;
 if(type==='law')return SINAMES.indexOf(id)>=0?null:'names no law: '+id;
 if(type==='avatar')return (BANDS.indexOf(id)>=0||id==='review')?null:'names no seat: '+id;
 if(type==='aim')return /^sum:\d{4}-\d{2}-\d{2}$/.test(id)?null:'names no day: '+id;
 if(type==='history'||type==='ritualday')return isNaN(Date.parse(id))?'is not a date: '+id:null;
 if(type==='first')return null;
 if(TRACE_NODE_TYPES.indexOf(type)>=0)return null;
 return 'names no kind of evidence this build holds';}
function dlyStValid(errs,path,x,names){
 if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(path+' is not an object'); return null;}
 dlyKeys(errs,path,x,['k','tpl','text','a','ev','read','src','rung','links']);
 var o={}, n0=errs.length;
 if(DLY_BLOCKS.indexOf(x.k)<0)errs.push(path+'.k is not one of '+DLY_BLOCKS.join(', ')+': '+JSON.stringify(x.k));
 o.k=x.k;
 o.tpl=dlyStr(errs,path+'.tpl',x.tpl,DLY_CAP.tpl);
 o.text=dlyStr(errs,path+'.text',x.text,DLY_CAP.text);
 if(DLY_SRC.indexOf(x.src)<0)errs.push(path+'.src is not one of '+DLY_SRC.join(', ')+': '+JSON.stringify(x.src));
 o.src=x.src;
 if(DLY_RUNGS.indexOf(x.rung)<0)errs.push(path+'.rung is not one of '+DLY_RUNGS.join(', ')+': '+JSON.stringify(x.rung));
 o.rung=x.rung;
 o.a=[];
 if(x.a!==undefined&&x.a!==null){
  if(!Array.isArray(x.a))errs.push(path+'.a is not a list');
  else if(x.a.length>DLY_CAP.a)errs.push(path+'.a holds '+x.a.length+', more than '+DLY_CAP.a);
  else x.a.forEach(function(v,i){var s=vStr(errs,path+'.a['+i+']',v,DLY_CAP.arg); if(s!==null)o.a.push(s);});}
 o.ev=[];
 if(!Array.isArray(x.ev))errs.push(path+'.ev is not a list');
 else if(!x.ev.length)errs.push(path+'.ev is empty: a statement names the evidence it was built from');
 else if(x.ev.length>DLY_CAP.ev)errs.push(path+'.ev holds '+x.ev.length+', more than '+DLY_CAP.ev);
 else x.ev.forEach(function(r,j){
  var p2=path+'.ev['+j+']';
  if(!r||typeof r!=='object'||Array.isArray(r)){errs.push(p2+' is not an object'); return;}
  dlyKeys(errs,p2,r,['type','id']);
  var w=dlyRefWhy(r.type,r.id);
  if(w)errs.push(p2+' '+w);
  else o.ev.push({type:r.type,id:r.id});});
 o.read=[];
 if(x.read!==undefined&&x.read!==null){
  if(!Array.isArray(x.read))errs.push(path+'.read is not a list');
  else if(x.read.length>DLY_CAP.read)errs.push(path+'.read holds '+x.read.length+', more than '+DLY_CAP.read);
  else x.read.forEach(function(r,j){
   var p2=path+'.read['+j+']';
   if(!r||typeof r!=='object'||Array.isArray(r)){errs.push(p2+' is not an object'); return;}
   dlyKeys(errs,p2,r,['addr','band']);
   var a=dlyInt(errs,p2+'.addr',r.addr,0,1e4);
   if(a!==null&&!BY[a]){errs.push(p2+'.addr is '+a+', which is not one of the addresses'); a=null;}
   if(BANDS.indexOf(r.band)<0)errs.push(p2+'.band is not a seat: '+JSON.stringify(r.band));
   else if(a!==null)o.read.push({addr:a,band:r.band});});}
 o.links=[];
 if(x.links!==undefined&&x.links!==null){
  if(!Array.isArray(x.links))errs.push(path+'.links is not a list');
  else if(x.links.length>DLY_CAP.links)errs.push(path+'.links holds '+x.links.length+', more than '+DLY_CAP.links);
  else x.links.forEach(function(t,j){
   if(typeof t!=='string'||!dlyGloss(t))errs.push(path+'.links['+j+'] is not a term in the Knowledge base: '+JSON.stringify(t));
   else o.links.push(t);});}
 /* A DIGIT IN A SENTENCE IS A DIGIT IN AN ARGUMENT. A sealed sentence prints a
    number only because a template was handed it, so a number that is not one
    of the arguments was written by something else, and this boundary is where
    an edited record is caught. */
 if(typeof o.text==='string'){
  var have=dlyDigits(o.a.join(' '));
  dlyDigits(o.text).forEach(function(d){
   if(have.indexOf(d)<0)errs.push(path+'.text prints '+d+', which is not one of its arguments');});}
 /* THE NAME RULE LIVES ON THE ARGUMENTS HERE AND ON THE WHOLE SENTENCE IN
    dlyGround. A boundary that matched the name against template words refused
    every record belonging to a person called Will, Mark or Hope the day a
    template said will, mark or hope. The arguments are the only place the
    person's own words could enter, and a statement that cites only the
    Knowledge base says nothing about them. */
 var kbOnly=o.ev.length&&o.ev.every(function(r){return r.type==='kb';});
 if(!kbOnly&&names&&names.length){
  var hit=dlyNameHit(o.a.join(' '),names);
  if(hit)errs.push(path+'.a carries the person\'s name: '+hit);}
 return errs.length>n0?null:o;}
function dlyDayValid(errs,path,x,names,now,seen){
 if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(path+' is not an object'); return null;}
 dlyKeys(errs,path,x,['id','d','t','rv','lex','cq','alg','generated_by','basis','st','silent']);
 var n0=errs.length, o={};
 if(!dlyDateOk(x.d))errs.push(path+'.d is not a calendar day: '+JSON.stringify(x.d));
 else{
  /* one day of slack, because a person who crossed a date line is in the
     document's own "context transfer" and a bank must survive the flight home */
  var lim=dlyDay(Date.parse(now)+DAY_MS);
  if(lim&&x.d>lim)errs.push(path+'.d is '+x.d+', after the day of this import');
  if(seen[x.d])errs.push(path+' repeats day '+x.d+', a sealed day is never replaced');
  seen[x.d]=1;}
 o.d=x.d;
 if(x.id!=='sum:'+x.d)errs.push(path+'.id is '+JSON.stringify(x.id)+', not sum: and its own day');
 o.id=x.id;
 o.t=dlyIso(errs,path+'.t',x.t);
 o.rv=dlyInt(errs,path+'.rv',x.rv,1,DLY_RULES);
 o.lex=dlyStr(errs,path+'.lex',x.lex,40);
 o.cq=dlyInt(errs,path+'.cq',x.cq,0,CQ_MODEL);
 o.alg=dlyInt(errs,path+'.alg',x.alg,1,TRACE_ALG);
 var g=x.generated_by;
 if(!g||typeof g!=='object'||Array.isArray(g))errs.push(path+'.generated_by is not an object');
 else{
  dlyKeys(errs,path+'.generated_by',g,['system','model_version','timestamp']);
  if(g.system!=='rules')errs.push(path+'.generated_by.system is '+JSON.stringify(g.system)+', and only rules write a day in this build');
  if(g.model_version!==null&&g.model_version!==undefined)
   errs.push(path+'.generated_by.model_version claims a model wrote a rules summary');
  o.generated_by={system:'rules', model_version:null, timestamp:dlyIso(errs,path+'.generated_by.timestamp',g.timestamp)};}
 var b=x.basis;
 if(!b||typeof b!=='object'||Array.isArray(b))errs.push(path+'.basis is not an object');
 else{
  dlyKeys(errs,path+'.basis',b,['h','e','r','p']);
  o.basis={}; ['h','e','r','p'].forEach(function(k){o.basis[k]=dlyInt(errs,path+'.basis.'+k,b[k],0,1e6);});}
 o.silent=null;
 if(x.silent!==undefined&&x.silent!==null){
  if(DLY_SILENT.indexOf(x.silent)<0)errs.push(path+'.silent is not one of '+DLY_SILENT.join(', ')+': '+JSON.stringify(x.silent));
  else o.silent=x.silent;}
 o.st=[];
 if(!Array.isArray(x.st))errs.push(path+'.st is not a list');
 else if(x.st.length>DLY_CAP.st)errs.push(path+'.st holds '+x.st.length+', more than '+DLY_CAP.st);
 else x.st.forEach(function(s,i){var v=dlyStValid(errs,path+'.st['+i+']',s,names); if(v)o.st.push(v);});
 if(o.silent&&o.st.length)errs.push(path+' is silent and carries statements');
 return errs.length>n0?null:o;}
function dlyEvValid(errs,path,x,i,days,state){
 if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(path+' is not an object'); return null;}
 var n0=errs.length;
 var T=x.type;
 var keys=['seq','at','type','sid'];
 if(T==='aim_set')keys=keys.concat(['text','domain']);
 else if(T==='aim_answer')keys=keys.concat(['kind']);
 else keys=keys.concat(['st','note']);
 dlyKeys(errs,path,x,keys);
 if(DLY_EV.indexOf(T)<0){errs.push(path+'.type is not one of '+DLY_EV.join(', ')+': '+JSON.stringify(T)); return null;}
 var o={type:T};
 o.seq=dlyInt(errs,path+'.seq',x.seq,1,1e9);
 if(NUM(x.seq)&&x.seq!==i+1)errs.push(path+'.seq is '+x.seq+', and the next in the list is '+(i+1)+': a sequence rises by one');
 o.at=dlyIso(errs,path+'.at',x.at);
 o.sid=x.sid;
 var day=typeof x.sid==='string'?days[x.sid]:null;
 if(!day){errs.push(path+'.sid names no sealed day: '+JSON.stringify(x.sid)); return null;}
 if(T==='aim_set'){
  o.text=dlyStr(errs,path+'.text',x.text,DLY_CAP.aim);
  if(x.domain!==undefined&&x.domain!==null&&BANDS.indexOf(x.domain)<0&&PUR_SIDES.indexOf(x.domain)<0)
   errs.push(path+'.domain is not a seat or a side: '+JSON.stringify(x.domain));
  o.domain=(x.domain===undefined)?null:x.domain;
  if(state.set[x.sid])errs.push(path+' is a second aim for '+x.sid+', and a day has one');
  state.set[x.sid]=1;}
 else if(T==='aim_answer'){
  if(DLY_ANSWER.indexOf(x.kind)<0)errs.push(path+'.kind is not one of '+DLY_ANSWER.join(', ')+': '+JSON.stringify(x.kind));
  o.kind=x.kind;
  if(!state.set[x.sid])errs.push(path+' answers an aim that was never set for '+x.sid);
  if(state.ans[x.sid])errs.push(path+' is a second answer for '+x.sid+', and an aim has one');
  state.ans[x.sid]=1;}
 else{
  var st=dlyInt(errs,path+'.st',x.st,0,Math.max(0,day.st.length-1));
  if(st!==null&&!day.st.length)errs.push(path+'.st names a statement on a day that has none');
  o.st=st;
  var need=DLY_RESP_TEXT.indexOf(T)>=0;
  if(need){o.note=dlyStr(errs,path+'.note',x.note,DLY_CAP.note);}
  else if(x.note!==undefined&&x.note!==null&&x.note!=='')errs.push(path+'.note: '+T+' carries no text');
  else o.note='';}
 return errs.length>n0?null:o;}
/* the whole bank, through every rule above. now is the moment of the import
   and names is the person's own name, both from the caller, never read here. */
function dlyValidate(errs,o,base,ctx){
 var path=base||'summaries', S=dlyBlank();
 ctx=ctx||{};
 var now=ctx.now||new Date().toISOString(), names=ctx.names||[];
 if(!o||typeof o!=='object'||Array.isArray(o)){errs.push(path+' is not an object'); return S;}
 dlyKeys(errs,path,o,['v','days','events']);
 if(o.v!==undefined&&(!NUM(o.v)||o.v<1||o.v%1!==0||o.v>DLY_SCHEMA_V))
  errs.push(path+'.v is '+JSON.stringify(o.v)+(NUM(o.v)&&o.v>DLY_SCHEMA_V?', newer than this build reads':', not a summaries version this build reads')
   +' (1 to '+DLY_SCHEMA_V+')');
 var days={};
 if(o.days!==undefined&&o.days!==null){
  if(!Array.isArray(o.days))errs.push(path+'.days is not a list');
  else if(o.days.length>DLY_CAP.days)errs.push(path+'.days holds '+o.days.length+', the cap is '+DLY_CAP.days);
  else{
   var seen={};
   S.days=o.days.map(function(x,i){return dlyDayValid(errs,path+'.days['+i+']',x,names,now,seen);}).filter(Boolean);
   S.days.forEach(function(d){days[d.id]=d;});
   /* a day the pass above refused is still a day an event can name, so one bad
      day is one error and not one more for each event that rests on it */
   o.days.forEach(function(x){
    if(x&&typeof x==='object'&&typeof x.id==='string'&&!days[x.id])days[x.id]={st:Array.isArray(x.st)?x.st:[]};});}}
 if(o.events!==undefined&&o.events!==null){
  if(!Array.isArray(o.events))errs.push(path+'.events is not a list');
  else if(o.events.length>DLY_CAP.events)errs.push(path+'.events holds '+o.events.length+', the cap is '+DLY_CAP.events);
  else{
   var state={set:{},ans:{}};
   S.events=o.events.map(function(x,i){return dlyEvValid(errs,path+'.events['+i+']',x,i,days,state);}).filter(Boolean);}}
 return S;}

/* ============================================================
   THE FOLDS. What an aim currently reads as and what a sentence currently
   stands as are read off the events and never stored. A fold reads no points
   and writes none, and an aim nobody answered is open, not lost.
   ============================================================ */
function dlyAimOf(S,sid){
 var set=null, ans=null;
 ((S&&S.events)||[]).forEach(function(e){
  if(e.sid!==sid)return;
  if(e.type==='aim_set')set=e; else if(e.type==='aim_answer')ans=e;});
 return {set:set, answer:ans, state:!set?'none':(ans?ans.kind:'open')};}
/* the window is the last d local days ending today, by the day id */
function dlyAimFold(p,now,d){
 var S=(p&&p.summaries)||dlyBlank(), today=pracDay(now);
 var out={days:d, n:0, kept:0, partly:0, not:0, unknown:0, open:0, sids:[], answered:[]};
 if(today===null)return out;
 S.days.forEach(function(day){
  var dn=dlyDayNum(day.d); if(today-dn<0||today-dn>=d)return;
  var a=dlyAimOf(S,day.id); if(!a.set)return;
  out.n++; out.sids.push(day.id);
  if(a.state==='open')out.open++; else{out[a.state]++; out.answered.push({sid:day.id, kind:a.state});}});
 return out;}
function dlyStanding(S,sid,idx){
 var last=null;
 ((S&&S.events)||[]).forEach(function(e){
  if(e.sid===sid&&e.st===idx&&DLY_RESP.indexOf(e.type)>=0)last=e.type;});
 return last;}

/* EVERY WRITE GOES THROUGH THE BOUNDARY'S OWN CHECK OF THE THING WRITTEN, the
   same dlyEvValid and dlyDayValid an import runs, with the bank as it stands
   for context. It does not re-walk every day already on the bank: those came
   through the boundary when they were written or loaded, and walking them on
   each write grew with the bank, which made a year of aims and marks take over
   a minute in the gate on the day this was written. A refusal returns
   the reasons and the caller's object is exactly as it was, because the new
   bank shares the old lists and never edits them. */
function dlyAppend(p,ev,now){
 var old=(p&&p.summaries)||dlyBlank(), iso=new Date(now).toISOString();
 if(old.events.length>=DLY_CAP.events)return {ok:false, errs:['summaries.events holds '+old.events.length+', the cap is '+DLY_CAP.events]};
 var days={}, state={set:{},ans:{}}, n=old.events.length;
 old.days.forEach(function(d){days[d.id]=d;});
 old.events.forEach(function(e){
  if(e.type==='aim_set')state.set[e.sid]=1; else if(e.type==='aim_answer')state.ans[e.sid]=1;});
 ev.seq=n+1; ev.at=iso;
 var errs=[], clean=dlyEvValid(errs,'summaries.events['+n+']',ev,n,days,state);
 if(errs.length)return {ok:false, errs:errs};
 return {ok:true, S:{v:old.v, days:old.days.slice(), events:old.events.concat([clean])}, ev:clean};}
function dlyToday(p,now){
 var d=dlyDay(now), S=(p&&p.summaries)||dlyBlank();
 for(var i=0;i<S.days.length;i++)if(S.days[i].d===d)return S.days[i];
 return null;}
/* THE AIM FOR TODAY. It goes on the day that was frozen when the Summary was
   first opened, so there has to be one, and it is today's: yesterday is over
   and an aim for it written now would be a record of a thing nobody was
   asked. One per day is the boundary's rule and this says so before it asks. */
function dlyAimSet(p,now,text,domain){
 var day=dlyToday(p,now);
 if(!day)return {ok:false, errs:['no day is frozen yet today, so there is nothing to put an '+DLY_AIM_WORD+' on']};
 if(typeof text!=='string')return {ok:false, errs:['the '+DLY_AIM_WORD+' is not text']};
 var ev={type:'aim_set', sid:day.id, text:text.trim()};
 if(domain!==undefined&&domain!==null)ev.domain=domain;
 return dlyAppend(p,ev,now);}
function dlyAimAnswer(p,sid,kind,now){
 return dlyAppend(p,{type:'aim_answer', sid:sid, kind:kind},now);}
/* a response to a sentence. accurate, partly, not and why carry no text;
   context and correct carry the person's own words. None of it edits the day. */
function dlyRespond(p,sid,st,type,note,now){
 var ev={type:type, sid:sid, st:st};
 if(DLY_RESP_TEXT.indexOf(type)>=0)ev.note=note;
 return dlyAppend(p,ev,now);}
/* THE BANK, MEASURED. The size is a thing this reports and not a thing it
   promises: a year of days is read off the days there are. */
function dlySize(p){
 var S=(p&&p.summaries)||dlyBlank(), b=JSON.stringify(S).length, d=S.days.length;
 return {days:d, events:S.events.length, bytes:b, perDay:d?Math.round(b/d):0, perYear:d?Math.round(b/d*365):0};}

/* ============================================================
   THE READER. One context off the record and the moment, and detectors over
   it that each return a change with its references or an unread with its
   reason. Never a zero it did not measure: nothing here is read as "no change"
   when it is "no record".

   Every input is the record's own stored data. The reading is not computed
   from the shared state S, so the same record and the same moment give the
   same answer whichever profile the engine happens to hold. The one place
   that reads words is the cue count and the address a story was read at, and
   those borrow the record's own soul through traceWithSoul.
   ============================================================ */
function dlySpan(k){return spanOf(k).d;}
function dlyOrderBy(a,b){var x=JSON.stringify(a),y=JSON.stringify(b); return x<y?-1:x>y?1:0;}
function dlyCtx(p,now){
 var ms=new Date(now).getTime(), today=pracDay(ms);
 var ids=traceStoryIds(p), hist=[], ents=[], rits=[], firsts=[];
 (p.history||[]).forEach(function(r){
  if(!r||typeof r.t!=='string'||!NUM(r.cq))return;
  var dn=pracDay(r.t); if(dn===null||dn>today)return;
  hist.push({r:r, dn:dn});});
 hist.sort(function(a,b){return a.r.t<b.r.t?-1:a.r.t>b.r.t?1:dlyOrderBy(a.r,b.r);});
 ((p.story&&p.story.entries)||[]).forEach(function(e,i){
  if(!e||typeof e!=='object'||typeof e.t!=='string')return;
  var dn=pracDay(e.t); if(dn===null||dn>today)return;
  var seats=[];
  Object.keys(e.bands||{}).forEach(function(k){if(K2BAND[k]&&(e.bands[k]||0)>0)seats.push(K2BAND[k]);});
  ents.push({i:i, id:ids[i], e:e, dn:dn, seats:seats});});
 ents.sort(function(a,b){return a.e.t<b.e.t?-1:a.e.t>b.e.t?1:(a.id<b.id?-1:a.id>b.id?1:0);});
 (p.rituals||[]).forEach(function(x){
  if(!x||typeof x.t!=='string')return;
  var dn=pracDay(x.t); if(dn===null||dn>today)return;
  rits.push({x:x, dn:dn});});
 rits.sort(function(a,b){return a.x.t<b.x.t?-1:a.x.t>b.x.t?1:dlyOrderBy(a.x,b.x);});
 ((p.meter&&p.meter.firsts)||[]).forEach(function(f){
  if(!f||typeof f.k!=='string'||typeof f.t!=='string')return;
  var dn=pracDay(f.t); if(dn===null||dn>today)return;
  firsts.push({f:f, dn:dn});});
 firsts.sort(function(a,b){return a.f.t<b.f.t?-1:a.f.t>b.f.t?1:(a.f.k<b.f.k?-1:a.f.k>b.f.k?1:0);});
 return {p:p, now:new Date(ms).toISOString(), ms:ms, today:today, day:dlyDay(ms),
  hist:hist, ents:ents, rits:rits, firsts:firsts, S:p.summaries||dlyBlank(), reads:{}};}
function dlyWin(list,today,d){return list.filter(function(x){return today-x.dn>=0&&today-x.dn<d;});}
function dlyDistinct(list){var s={}; list.forEach(function(x){s[x.dn]=1;}); return Object.keys(s).length;}
function dlyNewest(list,n){return list.slice(-n).reverse();}
/* the addresses one entry was read at, under the record's own soul, for a seat
   or for every seat. Stored with a statement as read, because the graph and
   this both re-read a story under today's lexicon and a drawer that answered
   from today's reading would say something the person was never shown. */
function dlyReadOf(p,entry,seat,memo){
 var key=entry.t+'\u0001'+(entry.text||''), all=memo&&memo[key];
 if(!all){
  var seen={}; all=[];
  /* borrowing the record's soul rebuilds the susceptibilities, which is the
     expensive part, so one read of one entry is kept for the length of one
     composition and one grounding pass */
  var parse=function(){return parseStory(entry.text||'').imprints;};
  (memo&&memo.__soul?parse():traceWithSoul(p,parse)).forEach(function(x){
   if(x.node===null||x.node===undefined||!BY[x.node]||seen[x.node])return;
   seen[x.node]=1; all.push({addr:x.node, band:x.band});});
  all.sort(function(a,b){return a.addr-b.addr;});
  if(memo)memo[key]=all;}
 return all.filter(function(r){return !seat||r.band===seat;});}

/* a reading of a series, with the reason it cannot be one */
function dlySeries(ctx,key,move){
 var latest=ctx.hist.length?ctx.hist[ctx.hist.length-1]:null;
 if(!latest)return {unread:true, why:'there is no saved reading yet'};
 var m=latest.r.m||0, all90=dlyWin(ctx.hist,ctx.today,dlySpan('quarter'));
 for(var i=0;i<DLY_SPANS.length;i++){
  var d=dlySpan(DLY_SPANS[i]), rows=dlyWin(ctx.hist,ctx.today,d).filter(function(x){return (x.r.m||0)===m;});
  if(rows.length>=2&&dlyDistinct(rows)>=2){
   var a=rows[0], z=rows[rows.length-1], dv=z.r[key]-a.r[key];
   return {span:d, n:rows.length, from:a.r.t, to:z.r.t,
    dir:Math.abs(dv)<move?'level':(dv>0?'up':'down'), ev:[{type:'history',id:a.r.t},{type:'history',id:z.r.t}]};}}
 if(all90.length<2)return {unread:true, why:'there are fewer than two saved readings in 90 days, and one reading is a point and not a line'};
 if(all90.filter(function(x){return (x.r.m||0)===m;}).length<2)
  return {unread:true, why:'the readings in range were made under different models of coherence, and a change of model is not a change in the person'};
 return {unread:true, why:'the readings in range are all from one day'};}
function dlyLawItems(ctx){
 var out=[], any=false;
 SINAMES.forEach(function(l){
  for(var i=0;i<DLY_SPANS.length;i++){
   var d=dlySpan(DLY_SPANS[i]);
   var rows=dlyWin(ctx.hist,ctx.today,d).filter(function(x){return x.r.lawNow&&NUM(x.r.lawNow[l]);});
   if(rows.length)any=true;
   if(rows.length>=2&&dlyDistinct(rows)>=2){
    var a=rows[0], z=rows[rows.length-1], dv=z.r.lawNow[l]-a.r.lawNow[l];
    /* a move too small for this span may not be too small for the next, so
       the walk goes on until a span shows one and stops there */
    if(Math.abs(dv)>=DLY_MOVE.law){
     out.push({kind:'law', law:l, span:d, n:rows.length, dir:dv>0?'up':'down', mag:Math.abs(dv),
      from:a.r.t, to:z.r.t, ev:[{type:'law',id:l},{type:'history',id:a.r.t},{type:'history',id:z.r.t}]});
     return;}}}});
 out.sort(function(a,b){return b.mag-a.mag||(a.law<b.law?-1:1);});
 return {items:out.slice(0,2), unread:any?null:{kind:'law', why:'no saved reading carries the 21 laws, so there is nothing to compare'}};}
function dlyHeavyItems(ctx){
 var items=[];
 for(var i=0;i<DLY_SPANS.length;i++){
  var d=dlySpan(DLY_SPANS[i]), rows=dlyWin(ctx.hist,ctx.today,d).filter(function(x){return BANDS.indexOf(x.r.dark)>=0;});
  if(rows.length<2||dlyDistinct(rows)<2)continue;
  var by={}; rows.forEach(function(x){by[x.r.dark]=(by[x.r.dark]||0)+1;});
  var seat=BANDS.slice().sort(function(a,b){return (by[b]||0)-(by[a]||0)||BANDS.indexOf(a)-BANDS.indexOf(b);})[0];
  var mine=rows.filter(function(x){return x.r.dark===seat;});
  items.push({kind:'heavy', seat:seat, span:d, n:by[seat], rows:rows.length, days:dlyDistinct(mine),
   ev:dlyNewest(mine,4).map(function(x){return {type:'history',id:x.r.t};})});
  var a=rows[0], z=rows[rows.length-1];
  if(a.r.dark!==z.r.dark)items.push({kind:'heavychg', span:d, fromSeat:a.r.dark, toSeat:z.r.dark,
   from:a.r.t, to:z.r.t, ev:[{type:'history',id:a.r.t},{type:'history',id:z.r.t}]});
  return items;}
 return items;}
function dlyOpenedItem(ctx){
 for(var i=0;i<2;i++){
  var d=dlySpan(DLY_SPANS[i]);
  var rows=dlyWin(ctx.firsts,ctx.today,d).filter(function(x){return /^addr:\d+$/.test(x.f.k);});
  if(rows.length){var z=rows[rows.length-1];
   return {kind:'opened', span:d, n:rows.length, latest:dlyDay(z.f.t),
    ev:dlyNewest(rows,4).map(function(x){return {type:'first',id:x.f.k};})};}}
 return null;}
/* seat recurrence, with the rung read off counts. windowed is a seat present in
   this window and absent from the three windows before it, and it is only said
   when that baseline held entries at all: absence from nothing is not absence. */
function dlySeatItems(ctx){
 for(var i=0;i<2;i++){
  var d=dlySpan(DLY_SPANS[i]), cur=dlyWin(ctx.ents,ctx.today,d);
  if(!cur.length)continue;
  var base=ctx.ents.filter(function(x){var g=ctx.today-x.dn; return g>=d&&g<4*d;});
  var items=[];
  BANDS.forEach(function(s){
   var mine=cur.filter(function(x){return x.seats.indexOf(s)>=0;});
   if(!mine.length)return;
   var days=dlyDistinct(mine), inBase=base.some(function(x){return x.seats.indexOf(s)>=0;});
   var rung=(base.length&&!inBase)?'windowed':((mine.length>=2&&days>=2)?'repeated':'once');
   items.push({kind:'seatrec', seat:s, span:d, n:mine.length, days:days, base:3*d, rung:rung,
    last:dlyDay(mine[mine.length-1].e.t), ids:dlyNewest(mine,6).map(function(x){return x.id;}),
    idx:dlyNewest(mine,6).map(function(x){return x.i;})});});
  if(items.length)return items;}
 return [];}
/* gates that read as the person's own pull toward or away: awareness,
   detachment, attachment, aversion. Ignorance is left out because as a word
   to a person it is an insult, and intention because that word is spoken for. */
var DLY_GATES=['aware','detach','attach','averse'];
function dlyCueItem(ctx){
 for(var i=0;i<2;i++){
  var d=dlySpan(DLY_SPANS[i]), cur=dlyWin(ctx.ents,ctx.today,d);
  if(!cur.length)continue;
  var best=null;
  DLY_GATES.forEach(function(g){
   var hit=[], total=0;
   cur.forEach(function(x){var h=verpScan(x.e.text||'').hits[g]; if(h>0){hit.push(x); total+=h;}});
   if(!total)return;
   var it={kind:'cue', gate:g, nm:VERP.filter(function(v){return v.k===g;})[0].nm.toLowerCase(),
    span:d, total:total, ents:hit.length, days:dlyDistinct(hit),
    last:dlyDay(hit[hit.length-1].e.t), ids:dlyNewest(hit,6).map(function(x){return x.id;})};
   if(!best||it.total>best.total)best=it;});
  if(best)return best;}
 return null;}
/* a ritual set and a ritual marked done, as two counts, from the done flag on
   the day log and never from pracDays: the ladder counts a day a ritual was
   set and never done, ledger side, and a said against done cannot stand on that.
   An entry saved before done existed says neither and is left out of both, as
   intentionRead leaves it. */
function dlyRitualWin(ctx,d){
 var set=0, done=0, rows=[];
 ctx.rits.forEach(function(r){
  if(r.x.done===undefined||ctx.today-r.dn<0||ctx.today-r.dn>=d)return;
  set++; if(r.x.done)done++; rows.push(r);});
 return {set:set, done:done, rows:rows};}
function dlyRitualItem(ctx){
 for(var i=0;i<2;i++){
  var d=dlySpan(DLY_SPANS[i]), w=dlyRitualWin(ctx,d);
  if(w.set)return {kind:'ritual', span:d, set:w.set, done:w.done,
   ids:dlyNewest(w.rows,6).map(function(r){return r.x.t;})};}
 return null;}
function dlyAvatarItems(ctx){
 var av=ctx.p.avatar, out=[];
 if(!av||!av.built)return {items:[], due:null};
 (av.pairs||[]).forEach(function(pr){
  if(!pr||BANDS.indexOf(pr.seat)<0)return;
  for(var i=0;i<2;i++){
   var d=dlySpan(DLY_SPANS[i]), mine=dlyWin(ctx.ents,ctx.today,d).filter(function(x){return x.seats.indexOf(pr.seat)>=0;});
   if(!mine.length)continue;
   out.push({kind:'avatar', seat:pr.seat, span:d, n:mine.length, days:dlyDistinct(mine),
    last:dlyDay(mine[mine.length-1].e.t), ids:dlyNewest(mine,6).map(function(x){return x.id;}),
    idx:dlyNewest(mine,4).map(function(x){return x.i;})});
   return;}});
 var due=avatarDue(av,ctx.ms)?dlyDay(av.reviewedAt||av.at):null;
 return {items:out, due:due};}
/* THE CONTRADICTIONS, as pairs of records that differ and never as a verdict. Two
   plain facts side by side is what the owner's own ruling asks for: a miss is
   data. The only pair this slice has an input for is a ritual set against done. */
function dlyContra(ctx){
 var out=[];
 [7,30,90].forEach(function(d){
  var w=dlyRitualWin(ctx,d);
  if(w.set>w.done&&w.done>=0&&w.set>=1)out.push({kind:'said_done', span:d, said:w.set, did:w.done,
   refs:w.rows.map(function(r){return {type:'ritualday',id:r.x.t};})});});
 return out;}
/* every detector over one context. items are changes with their references,
   unread says why an input could not be read. */
function dlyChanges(ctx){
 var items=[], unread=[], s;
 ['cq','dq'].forEach(function(k){
  s=dlySeries(ctx,k,DLY_MOVE[k]);
  if(s.unread)unread.push({kind:k, why:s.why}); else{s.kind=k; items.push(s);}});
 var l=dlyLawItems(ctx); l.items.forEach(function(x){items.push(x);}); if(l.unread)unread.push(l.unread);
 dlyHeavyItems(ctx).forEach(function(x){items.push(x);});
 var o=dlyOpenedItem(ctx); if(o)items.push(o);
 dlySeatItems(ctx).forEach(function(x){items.push(x);});
 var c=dlyCueItem(ctx); if(c)items.push(c);
 var r=dlyRitualItem(ctx); if(r)items.push(r);
 var a=dlyAvatarItems(ctx); a.items.forEach(function(x){items.push(x);});
 if(a.due)items.push({kind:'avatarDue', at:a.due});
 var f=dlyAimFold(ctx.p,ctx.ms,dlySpan('week'));
 if(f.kept+f.partly+f.not+f.unknown===0)f=dlyAimFold(ctx.p,ctx.ms,dlySpan('month'));
 if(f.kept+f.partly+f.not+f.unknown>0)items.push({kind:'aim', fold:f,
  ev:f.answered.slice(-DLY_CAP.ev).map(function(x){return {type:'aim',id:x.sid};})});
 return {items:items, unread:unread};}

/* THE ORDER OF WHAT NEEDS ATTENTION, a tuple of counts a person could check and
   never a stored number: distinct days of evidence, how many of the three
   spans it shows in, days since it was last the focus, whether it is the seat
   of the person's own avatar line, then a fixed tie break. The tuple is
   returned so "why this one" can be printed. */
function dlyFocus(c){
 var rows=c.map(function(x){return {key:x.key, cand:x, tuple:[x.days,x.spans,x.quiet,x.avatar?1:0,-x.order]};});
 rows.sort(function(a,b){
  for(var i=0;i<a.tuple.length;i++)if(a.tuple[i]!==b.tuple[i])return b.tuple[i]-a.tuple[i];
  return a.key<b.key?-1:a.key>b.key?1:0;});
 return rows;}

/* ============================================================
   THE COMPOSER. A pure function of the record and the moment: the same record
   and the same moment give the same sentences, byte for byte, in any order of
   the inputs. Silence is a result and it carries its reason.
   ============================================================ */
function dlyUnread(p,r){
 if(r&&r.unread)return true;
 var laws=0, charged=0;
 SINAMES.forEach(function(l){if(p.laws&&NUM(p.laws[l]))laws++;});
 CHILD.forEach(function(c){var a=(p.axes&&p.axes[c.nm])||{}; if((a.held||0)>0||(a.opp||0)>0)charged++;});
 return !laws&&!charged&&!((p.story&&p.story.entries)||[]).length&&!(p.history||[]).length;}
function dlyCand(tpl,k,args,ev,src,rung,o){
 return {tpl:tpl, k:k, args:args.map(String), ev:ev, src:src, rung:rung, read:(o&&o.read)||[], dom:(o&&o.dom)||null,
  /* weak is a sentence that says nothing moved. It is true and it is worth
     saying, and it yields its place in a block to one that says something did. */
  weak:!!(o&&o.weak)};}
function dlyLinks(text){
 var out=[];
 DLY_CANON.forEach(function(c){
  if(c.t&&new RegExp('\\b'+c.w+'(s|es)?\\b','i').test(text)&&out.indexOf(c.t)<0)out.push(c.t);});
 return out.slice(0,DLY_CAP.links);}
function dlyStmt(c){
 var t=dlyTpl(c.tpl), text=dlyFill(t,c.args);
 return {k:c.k, tpl:c.tpl, text:text, a:c.args.slice(), ev:c.ev.slice(0,DLY_CAP.ev),
  read:c.read.slice(0,DLY_CAP.read), src:c.src, rung:c.rung, links:dlyLinks(text)};}
/* the hedged variant when the evidence is one record and the statement is not
   a plain fact off the record (show_uncertainty) */
function dlyStoryEv(ids){return ids.map(function(id){return {type:'story',id:id};});}
function dlyRead(ctx,idx,seat){
 var seen={}, out=[];
 idx.forEach(function(i){
  dlyReadOf(ctx.p,ctx.p.story.entries[i],seat,ctx.reads).forEach(function(r){
   if(!seen[r.addr]){seen[r.addr]=1; out.push(r);}});});
 return out.sort(function(a,b){return a.addr-b.addr;}).slice(0,DLY_CAP.read);}
function dlyCompose(p,now,opt){
 /* the record's soul is borrowed once for the whole composition and put back
    after, instead of once for every entry read, which was most of its time */
 return traceWithSoul(p,function(){return dlyComposeIn(p,now,opt);});}
function dlyComposeIn(p,now,opt){
 opt=opt||{};
 var res={state:'ok', st:[], silent:null, silence:[], refused:[], focus:[], basis:{h:0,e:0,r:0,p:0}};
 /* AN UNREAD RECORD COMPOSES NOTHING. CLAUDE.md: anything that renders there
    renders to somebody who has entered nothing, and a sentence read off a
    default is a claim about a stranger. */
 if(dlyUnread(p,opt.r)){
  res.state='unread'; res.silent='unread'; res.silence.push({why:'nothing has been entered, so there is nothing to read'});
  return res;}
 var ctx=dlyCtx(p,now), ch=dlyChanges(ctx), cands=[], by={};
 ctx.reads.__soul=1;
 ch.unread.forEach(function(u){res.silence.push({kind:u.kind, why:u.why});});
 ch.items.forEach(function(it){(by[it.kind]=by[it.kind]||[]).push(it);});
 var q=dlySpan('quarter');
 res.basis={h:dlyWin(ctx.hist,ctx.today,q).length, e:dlyWin(ctx.ents,ctx.today,q).length,
  r:dlyWin(ctx.rits,ctx.today,q).length,
  p:((p.practice&&p.practice.practice_events)||[]).filter(function(x){
   var dn=x&&pracDay(x.scheduled_at); return dn!==null&&dn!==undefined&&ctx.today-dn>=0&&ctx.today-dn<q;}).length};
 /* today: the latest saved reading, as a fact the record states */
 if(ctx.hist.length){
  var lt=ctx.hist[ctx.hist.length-1];
  if(BANDS.indexOf(lt.r.dark)>=0)
   cands.push(dlyCand('today.read','today',[dlyDayWord(dlyDay(lt.r.t)),lt.r.dark],[{type:'history',id:lt.r.t}],'known','once',{dom:lt.r.dark}));}
 /* showing */
 var seatIt=(by.seatrec||[]).slice().sort(function(a,b){
  var ra=DLY_RUNGS.indexOf(a.rung), rb=DLY_RUNGS.indexOf(b.rung);
  return rb-ra||b.days-a.days||b.n-a.n||BANDS.indexOf(a.seat)-BANDS.indexOf(b.seat);});
 seatIt.slice(0,2).forEach(function(s){
  var rd=dlyRead(ctx,s.idx,s.seat), ev=dlyStoryEv(s.ids);
  if(s.rung==='windowed')cands.push(dlyCand('show.seat.new','showing',[s.span,s.seat,s.base],ev,'inferred','windowed',{read:rd,dom:s.seat}));
  else if(s.rung==='repeated')cands.push(dlyCand('show.seat','showing',[s.span,s.seat,s.days],ev,'inferred','repeated',{read:rd,dom:s.seat}));
  else cands.push(dlyCand('show.seat.h','showing',[dlyDayWord(s.last),s.seat],ev,'inferred','once',{read:rd,dom:s.seat}));});
 (by.cue||[]).forEach(function(c){
  var rung=(c.ents>=2&&c.days>=2)?'repeated':'once', ev=dlyStoryEv(c.ids);
  if(rung==='repeated')cands.push(dlyCand('show.cue','showing',[c.span,c.nm,c.total,c.ents],ev,'inferred','repeated'));
  else cands.push(dlyCand('show.cue.h','showing',[dlyDayWord(c.last),c.nm],ev,'inferred','once'));});
 (by.opened||[]).forEach(function(o){
  if(o.n===1)cands.push(dlyCand('show.opened.1','showing',[o.span,dlyDayWord(o.latest)],o.ev,'known','once'));
  else cands.push(dlyCand('show.opened','showing',[o.span,o.n,dlyDayWord(o.latest)],o.ev,'known','repeated'));});
 var apart=dlyContra(ctx);
 (by.ritual||[]).forEach(function(r){
  var isApart=apart.some(function(a){return a.span===r.span;});
  var ev=r.ids.map(function(t){return {type:'ritualday',id:t};}), rung=isApart?'apart':(r.set>=2?'repeated':'once');
  if(r.set===1)cands.push(dlyCand('show.ritual.1','showing',[r.span,r.done],ev,'known',rung));
  else cands.push(dlyCand('show.ritual','showing',[r.span,r.set,r.done],ev,'known',rung));});
 (by.avatar||[]).slice(0,1).forEach(function(a){
  var rd=dlyRead(ctx,a.idx,a.seat), ev=[{type:'avatar',id:a.seat}].concat(dlyStoryEv(a.ids.slice(0,4)));
  if(a.n===1)cands.push(dlyCand('show.avatar.h','showing',[dlyDayWord(a.last),a.seat],ev,'inferred','once',{read:rd,dom:a.seat}));
  else cands.push(dlyCand('show.avatar','showing',[a.span,a.seat,a.n],ev,'inferred','repeated',{read:rd,dom:a.seat}));});
 /* interfering and changing */
 (by.heavy||[]).slice(0,1).forEach(function(h){
  if(h.n>=2)cands.push(dlyCand('intf.seat','interfering',[h.span,h.seat,h.n],h.ev,'known','repeated',{dom:h.seat}));});
 (by.heavychg||[]).slice(0,1).forEach(function(h){
  cands.push(dlyCand('chg.heavy','changing',[h.fromSeat,dlyDayWord(dlyDay(h.from)),h.toSeat,dlyDayWord(dlyDay(h.to))],h.ev,'known','repeated'));});
 (by.law||[]).forEach(function(l){
  cands.push(dlyCand('chg.law','changing',[l.law,l.dir,dlyDayWord(dlyDay(l.from)),dlyDayWord(dlyDay(l.to)),l.n],l.ev,'known','repeated',{dom:l.law}));});
 (by.cq||[]).forEach(function(c){
  if(c.dir==='level')cands.push(dlyCand('chg.cq.level','changing',[c.span,c.n],c.ev,'known','repeated',{weak:1}));
  else cands.push(dlyCand('chg.cq','changing',[c.span,c.n,c.dir],c.ev,'known','repeated'));});
 (by.dq||[]).forEach(function(c){
  if(c.dir==='level')cands.push(dlyCand('chg.dq.level','changing',[c.span,c.n],c.ev,'known','repeated',{weak:1}));
  else cands.push(dlyCand('chg.dq','changing',[c.span,c.n,c.dir],c.ev,'known','repeated'));});
 /* attention: the seat with the most separate days behind it, ordered by a
    tuple of counts that is returned and never stored. Not said at one day,
    because one day is not leverage. */
 var foc=[], q30=dlySpan('month');
 BANDS.forEach(function(s,ord){
  var e30=dlyWin(ctx.ents,ctx.today,q30).filter(function(x){return x.seats.indexOf(s)>=0;});
  var h30=dlyWin(ctx.hist,ctx.today,q30).filter(function(x){return x.r.dark===s;});
  var days=dlyDistinct(e30.concat(h30)); if(!days)return;
  var spans=DLY_SPANS.filter(function(k){var d=dlySpan(k);
   return dlyWin(ctx.ents,ctx.today,d).some(function(x){return x.seats.indexOf(s)>=0;})
    ||dlyWin(ctx.hist,ctx.today,d).some(function(x){return x.r.dark===s;});}).length;
  var quiet=999;
  ctx.S.days.forEach(function(dy){dy.st.forEach(function(st){
   if(st.tpl==='att.seat'&&st.a[1]===s)quiet=Math.min(quiet,ctx.today-dlyDayNum(dy.d));});});
  var av=!!(ctx.p.avatar&&ctx.p.avatar.built&&(ctx.p.avatar.pairs||[]).some(function(pr){return pr&&pr.seat===s;}));
  foc.push({key:s, days:days, spans:spans, quiet:quiet, avatar:av, order:ord, e30:e30, h30:h30});});
 res.focus=dlyFocus(foc).map(function(f){return {key:f.key, tuple:f.tuple};});
 var top=dlyFocus(foc)[0];
 if(top&&top.cand.days>=2){
  var tc=top.cand, cited=dlyNewest(tc.e30,4), ev=dlyNewest(tc.h30,3).map(function(x){return {type:'history',id:x.r.t};})
   .concat(dlyStoryEv(cited.map(function(x){return x.id;})));
  /* the addresses are those of the entries cited and no others, which is what
     the grounding pass holds a statement to, and reading all thirty entries of
     the window to cite four was most of the time a composition took */
  cands.push(dlyCand('att.seat','attention',[q30,tc.key,tc.days],ev,tc.e30.length?'inferred':'known','repeated',
   {read:dlyRead(ctx,cited.map(function(x){return x.i;}),tc.key),dom:tc.key}));}
 /* the aim, as counts of what the person wrote and marked */
 (by.aim||[]).forEach(function(a){
  var f=a.fold, n=f.kept+f.partly+f.not+f.unknown;
  /* one aim written and one marked. Two written and one marked is not "you
     wrote one", it is the general sentence with its counts, because the plain
     one would say less was written than was. */
  if(f.n===1&&n===1){
   var w=f.kept?'kept':f.partly?'partly kept':f.not?'not kept':'unknown';
   cands.push(dlyCand('aim.fold.1','aim',[f.days,dlyDayWord(f.answered[0].sid.slice(4)),w],a.ev,'known','once'));}
  else cands.push(dlyCand('aim.fold','aim',[f.days,f.n,f.kept,f.partly,f.not,f.unknown],a.ev,'known','repeated'));});
 /* try this: the one concrete act the record supports */
 (by.avatarDue||[]).forEach(function(a){
  cands.push(dlyCand('try.avatar','try',[dlyDayWord(a.at)],[{type:'avatar',id:'review'}],'known','once'));});
 /* WHY: where these sentences were read from. Only said when something was. */
 if(res.basis.h+res.basis.e+res.basis.r>0&&cands.length){
  var wev=[];
  dlyNewest(ctx.hist,2).forEach(function(x){wev.push({type:'history',id:x.r.t});});
  dlyNewest(ctx.ents,2).forEach(function(x){wev.push({type:'story',id:x.id});});
  dlyNewest(ctx.rits,2).forEach(function(x){wev.push({type:'ritualday',id:x.x.t});});
  if(wev.length)cands.push(dlyCand('why.basis','why',[q,res.basis.h,res.basis.e,res.basis.r],wev,'known','once'));}

 /* ---- the silence and novelty rules, all derived from what is sealed ---- */
 var recent={}, edu={};
 ctx.S.days.forEach(function(dy){
  var age=ctx.today-dlyDayNum(dy.d);
  dy.st.forEach(function(st){
   if(age>=1&&age<=DLY_NOVEL_DAYS)recent[st.tpl+'|'+st.a.join('|')]=1;
   if(st.tpl==='why.edu'&&age>=0&&age<=DLY_EDU_DAYS)edu[st.a[0]]=1;});});
 var kept=[], domN={}, blockN={};
 /* a block, then the strongest rung first, then a fixed order, so that the
    same record gives the same sentences whatever order it was assembled in */
 cands.sort(function(a,b){
  return DLY_BLOCKS.indexOf(a.k)-DLY_BLOCKS.indexOf(b.k)||(a.weak?1:0)-(b.weak?1:0)||DLY_RUNGS.indexOf(b.rung)-DLY_RUNGS.indexOf(a.rung)
   ||(a.tpl<b.tpl?-1:a.tpl>b.tpl?1:0)||dlyOrderBy(a.args,b.args);});
 cands.forEach(function(c){
  var key=c.tpl+'|'+c.args.join('|');
  if((blockN[c.k]||0)>=DLY_BLOCK_MAX[c.k])return;
  if(recent[key]){res.silence.push({kind:c.tpl, why:'the same sentence with the same counts was frozen in the last '+DLY_NOVEL_DAYS+' days'}); return;}
  /* ONE SENTENCE PER BLOCK PER DOMAIN, section 21D's guard against fixing on
     one pattern: a seat or a law is said once in a block and the rest of the
     block goes to something else */
  if(c.dom){
   var dk=c.k+'|'+c.dom;
   if(domN[dk]){res.silence.push({kind:c.tpl, why:'a second sentence about '+c.dom+' in this block would crowd out the rest'}); return;}
   domN[dk]=1;}
  blockN[c.k]=(blockN[c.k]||0)+1;
  kept.push(c);});
 /* a single reading on its own is at most one sentence, hedged. */
 if(ctx.hist.length<=1&&ctx.ents.length<=1&&kept.length>1){
  res.silence.push({why:'one saved reading or one entry is not enough to say more than one thing'});
  kept=kept.filter(function(c){return c.k!=='why';}).slice(0,1);}
 var sts=kept.map(dlyStmt);
 /* the education statement: one canon word used above that has an entry in the
    Knowledge base and has not been explained in the last month. It says
    nothing about the person, so its only provenance is known. */
 if(sts.length&&sts.length<DLY_CAP.st){
  var linked=[]; sts.forEach(function(s){s.links.forEach(function(t){if(linked.indexOf(t)<0)linked.push(t);});});
  for(var i=0;i<linked.length;i++){
   var g=dlyGloss(linked[i]), first=g?g.d.slice(0,g.d.indexOf('.')+1):'';
   if(!g||first.length<25||edu[linked[i]])continue;
   var ec=dlyCand('why.edu','why',[linked[i],first],[{type:'kb',id:linked[i]}],'known','once');
   var es=dlyStmt(ec); es.links=[linked[i]]; sts.push(es); break;}}
 /* every sentence is held to the hard rules before it is kept, and one that
    fails is dropped with its reason, so a template that goes wrong can never
    stop a day from being frozen. The gate asserts nothing is dropped. */
 var names=dlyNamesOf(p), gx={p:p, reads:ctx.reads};
 sts=sts.filter(function(s){
  var f=dlyGroundOne(s,p,gx,names);
  if(f.length){res.refused.push({tpl:s.tpl, rules:f.map(function(x){return x.rule;})}); return false;}
  return true;});
 /* AT MOST EIGHT, AND THE TAIL IS NOT WHAT GOES. Cutting the list at eight in
    block order dropped try this and why, the two blocks that say what to do
    and where the sentences came from, whenever the earlier blocks were full.
    So the cut is by the priority below, then the survivors go back in the
    document's order. The education line goes first and the basis next. */
 if(sts.length>DLY_CAP.st){
  sts=sts.map(function(s,i){return {s:s,i:i};}).sort(function(a,b){
   return DLY_PRI[a.s.tpl===('why.edu')?'edu':a.s.k]-DLY_PRI[b.s.tpl===('why.edu')?'edu':b.s.k]||a.i-b.i;})
   .slice(0,DLY_CAP.st).sort(function(a,b){return a.i-b.i;}).map(function(x){return x.s;});}
 sts=sts.map(function(s,i){return {s:s,i:i};}).sort(function(a,b){
  return DLY_BLOCKS.indexOf(a.s.k)-DLY_BLOCKS.indexOf(b.s.k)||a.i-b.i;}).map(function(x){return x.s;});
 res.st=sts;
 if(!res.st.length){res.state='thin'; res.silent='thin';
  if(!res.silence.length)res.silence.push({why:'what is on the record is not enough to say anything'});}
 return res;}

/* ============================================================
   THE GROUNDING PASS. Every rule is a name and a refusal. dlyGround is run on
   a draft before it is sealed, and again by dlySeal, so a day that the pass
   did not clear cannot be written.

   The hard rules are the document's non claims. The language list is a soft
   note, ruled 1 October, and nothing here refuses on a word.
   ============================================================ */
var DLY_RX={
 cause:/\b(caused?|causes|causing|made you|makes you|led to|leads to|because|due to|as a result|resulted in|results in|therefore)\b/i,
 future:/\b(is destined|are destined|destined to|will always|will never|guarantee[sd]?|is certain to|is bound to|you will become)\b/i,
 system:/\b(astrolog\w*|zodiac|horoscope|numerolog\w*|life path|sun sign|moon sign|rising sign|human design|gene keys|birth chart|natal chart|chinese year|enneagram|kabbalah)\b/i,
 worth:/(\d\s*%|\bpercent(age|ile)?\b|\brank(ed|ing|s)?\b|\bscor(e|ed|es|ing)\b|\bahead of\b|\bbetter than\b|\bworse than\b|\b\d+\s+(out\s+)?of\s+(your\s+|the\s+|these\s+|those\s+)?(last\s+)?\d+\b|\bout of\s+\d+)/i,
 loss:/\b(points|penalt(y|ies|ised|ized)|deduct\w*|forfeit\w*|streak|lose|loses|losing|lost|loss|broke|broken|fail(s|ed|ing|ure)?|miss(ed|es)?|fell short|let (yourself|you|me) down)\b/i,
 agency:/\b(you|we)\s+(need to|must|should|have to|ought to)\b|\bmake sure you\b/i};
/* a reference, resolved against the record or the graph, with what it is as
   provenance. null is a reference that names nothing, which is fabricated
   evidence. */
function dlyGraph(p){
 try{return traceFromRecord(p,practiceTraceIntents(p.practice));}catch(e){return null;}}
function dlyResolve(p,ref,gx){
 var t=ref&&ref.type, id=ref&&ref.id, i;
 if(typeof t!=='string'||typeof id!=='string')return null;
 var S=p.summaries||dlyBlank();
 if(t==='kb')return dlyGloss(id)?{src:'known'}:null;
 if(t==='law'){
  if(SINAMES.indexOf(id)<0)return null;
  var has=(p.laws&&NUM(p.laws[id]))||(p.history||[]).some(function(r){return r&&r.lawNow&&NUM(r.lawNow[id]);});
  return has?{src:'known'}:null;}
 if(t==='history')return (p.history||[]).some(function(r){return r&&r.t===id;})?{src:'known'}:null;
 if(t==='first')return ((p.meter&&p.meter.firsts)||[]).some(function(f){return f&&f.k===id;})?{src:'known'}:null;
 if(t==='ritualday')return (p.rituals||[]).some(function(x){return x&&x.t===id;})?{src:'known'}:null;
 if(t==='avatar'){
  var av=p.avatar; if(!av)return null;
  if(id==='review')return av.built?{src:'known'}:null;
  return (av.pairs||[]).some(function(pr){return pr&&pr.seat===id;})?{src:'known'}:null;}
 if(t==='aim')return dlyAimOf(S,id).set?{src:'known'}:null;
 /* an entry is known: it is the person's own words and it exists. What the
    lexicon read out of it is inferred, and a template says so in its own src
    cap, which dlyGroundOne holds a statement to. */
 if(t==='story'){
  var ids=traceStoryIds(p);
  return ids.indexOf(id)>=0?{src:'known'}:null;}
 if(TRACE_NODE_TYPES.indexOf(t)>=0){
  if(gx&&!gx.graph)gx.graph=dlyGraph(p);
  var g=gx&&gx.graph; if(!g)return null;
  for(i=0;i<g.nodes.length;i++)if(g.nodes[i].type===t&&String(g.nodes[i].id)===id)return {src:g.nodes[i].src||'known'};
  return null;}
 return null;}
/* one statement against every hard rule. Returns findings, each {rule, why}. */
function dlyGroundOne(s,p,gx,names){
 var out=[], push=function(rule,why){out.push({rule:rule, why:why});};
 var tp=dlyTpl(s.tpl), text=String(s.text||''), refs=Array.isArray(s.ev)?s.ev:[];
 /* no_fabricated_evidence */
 if(!refs.length)push('no_fabricated_evidence','a statement with no reference names nothing it was built from');
 var weakest=2, storyIds={};
 refs.forEach(function(r){
  var res=dlyResolve(p,r,gx);
  if(!res)push('no_fabricated_evidence',(r&&r.type)+':'+(r&&r.id)+' resolves to nothing on this record');
  else{weakest=Math.min(weakest,DLY_RANK[res.src]===undefined?2:DLY_RANK[res.src]);
   if(r.type==='story')storyIds[r.id]=1;}});
 var have=dlyDigits((s.a||[]).join(' '));
 dlyDigits(text).forEach(function(d){
  if(have.indexOf(d)<0)push('no_fabricated_evidence','the sentence prints '+d+', which is not one of the arguments the template was given');});
 if(Array.isArray(s.read)&&s.read.length){
  var allowed={}, ids=traceStoryIds(p), ents=(p.story&&p.story.entries)||[];
  Object.keys(storyIds).forEach(function(id){var i=ids.indexOf(id);
   if(i>=0)dlyReadOf(p,ents[i],null,gx&&gx.reads).forEach(function(r){allowed[r.addr+'|'+r.band]=1;});});
  s.read.forEach(function(r){
   if(!allowed[r.addr+'|'+r.band])push('no_fabricated_evidence','read names address '+r.addr+' at '+r.band+', where no cited entry was read');});}
 /* no_unsupported_causality: a sequence may be stated, a cause may not unless
    it is proposed or the person confirmed it */
 if(DLY_RX.cause.test(text)&&s.src!=='proposed'&&s.src!=='user_confirmed')
  push('no_unsupported_causality','a cause is stated as '+s.src+': "'+DLY_RX.cause.exec(text)[0]+'"');
 /* no_deterministic_profile_claims: a profile system is named in one block only,
    and nothing is promised about the future */
 if(DLY_RX.system.test(text)&&s.tpl!=='sys.point')
  push('no_deterministic_profile_claims','a profile system is named outside the one sentence that says several parts point toward the same themes');
 if(DLY_RX.future.test(text))push('no_deterministic_profile_claims','a claim about the future: "'+DLY_RX.future.exec(text)[0]+'"');
 /* no_personal_worth_scoring */
 if(DLY_RX.worth.test(text))push('no_personal_worth_scoring','"'+DLY_RX.worth.exec(text)[0]+'" is a score, a rank or a count against a total');
 /* no_penalty_language: a day with no aim loses nothing */
 if(DLY_RX.loss.test(text))push('no_penalty_language','"'+DLY_RX.loss.exec(text)[0]+'" reads as a loss, and a missed aim is no entry');
 /* no_hidden_inference: no stronger than the weakest thing it cites, and no
    stronger than the template allows */
 if(DLY_RANK[s.src]===undefined)push('no_hidden_inference','provenance '+s.src+' is not one this build knows');
 else{
  if(refs.length&&DLY_RANK[s.src]>weakest)push('no_hidden_inference','a statement says '+s.src+' and cites something weaker');
  if(tp&&DLY_RANK[s.src]>DLY_RANK[tp.src])push('no_hidden_inference','the template '+tp.id+' reads words and may not say '+s.src);}
 /* show_uncertainty: one record, not a plain fact, is the hedged variant */
 if(s.rung==='once'&&s.src!=='known'&&!/\.h$/.test(String(s.tpl)))
  push('show_uncertainty','one record is stated at full strength; the hedged variant of the template is used at the lowest rung');
 /* preserve_user_agency */
 if(DLY_RX.agency.test(text))push('preserve_user_agency','"'+DLY_RX.agency.exec(text)[0]+'" tells the person what to do');
 /* no_name: the person's own name is not written into a sentence. Words that
    are the template's own are not the person's, and a statement that cites
    only the Knowledge base says nothing about them. */
 var kbOnly=refs.length&&refs.every(function(r){return r.type==='kb';});
 if(!kbOnly&&names&&names.length){
  var own={}; if(tp)dlyWords(tp.text).forEach(function(w){own[w]=1;});
  var left=dlyWords(text).filter(function(w){return !own[w];}).join(' ');
  var hit=dlyNameHit(left,names);
  if(hit)push('no_name','the sentence carries the person\'s name: '+hit);}
 return out;}
/* the soft rules, notes only. grounded_language reports each of the seven
   phrases it finds. canon words with an entry should link to it, and those
   without one are content for the copy seat. A note never refuses. */
function dlyNotes(s){
 var out=[], text=String(s.text||'').toLowerCase(), links=s.links||[];
 DLY_NOTE_PHRASES.forEach(function(ph){
  if(text.indexOf(ph)>=0)out.push({rule:'grounded_language', phrase:ph});});
 DLY_CANON.forEach(function(c){
  if(!new RegExp('\\b'+c.w+'(s|es)?\\b').test(text))return;
  if(c.t===null)out.push({rule:'canon_no_entry', word:c.w});
  else if(links.indexOf(c.t)<0)out.push({rule:'canon_unlinked', word:c.w, term:c.t});});
 return out;}
function dlyGround(draft,p,now){
 return traceWithSoul(p,function(){return dlyGroundIn(draft,p,now);});}
function dlyGroundIn(draft,p,now){
 var res={ok:true, findings:[], notes:[]}, names=dlyNamesOf(p), gx={p:p, reads:{__soul:1}};
 (draft&&draft.st||[]).forEach(function(s,i){
  dlyGroundOne(s,p,gx,names).forEach(function(f){f.st=i; res.findings.push(f);});
  dlyNotes(s).forEach(function(n){n.st=i; res.notes.push(n);});});
 res.ok=!res.findings.length;
 return res;}

/* ============================================================
   SEALING AND OPENING. A day is written once, on the first open of the
   Summary that day, and never again. dlySeal is the pure door, and
   dlyDayOpen is the one the page calls, guarded so that nothing it does can
   throw into the boot path or a render.
   ============================================================ */
function dlySeal(p,draft,now){
 var iso=new Date(now).toISOString(), d=dlyDay(iso);
 var g=dlyGround(draft,p,iso);
 if(!g.ok)return {ok:false, errs:g.findings.map(function(f){return f.rule+': '+f.why;})};
 var day={id:'sum:'+d, d:d, t:iso, rv:DLY_RULES, lex:LEX_VERSION, cq:CQ_MODEL, alg:TRACE_ALG,
  generated_by:{system:'rules', model_version:null, timestamp:iso},
  basis:draft.basis, st:draft.st, silent:draft.silent||null};
 var old=p.summaries||dlyBlank(), seen={}, errs=[];
 if(old.days.length>=DLY_CAP.days)return {ok:false, errs:['summaries.days holds '+old.days.length+', the cap is '+DLY_CAP.days]};
 old.days.forEach(function(x){seen[x.d]=1;});
 var clean=dlyDayValid(errs,'summaries.days['+old.days.length+']',day,dlyNamesOf(p),iso,seen);
 if(errs.length)return {ok:false, errs:errs};
 var S={v:old.v, days:old.days.slice(), events:old.events.slice()};
 S.days.push(clean);
 return {ok:true, S:S, day:clean};}
/* THE FOUR RESULTS. frozen: composed and written. already: today has its day
   and nothing is recomposed, which is what frozen means. silent: unread or
   thin, still written as a day with no statements, so the day is accounted
   for. error: nothing was written, and why says so, for status() to carry
   before anything claims success.

   save is the host's own, pSave. A save that fails puts the old summaries
   back, so memory never holds a day the disk refused. A record that is not in
   the record list, a roster persona, is never frozen: that is the guard pSnap
   already has, and it comes back as an error naming NotARecord so the caller
   can stay quiet about it. */
function dlyDayOpen(p,now,save,opt){
 try{
  if(!p||typeof p!=='object')return {result:'error', why:'there is no record to open a day on'};
  var iso=new Date(now).toISOString(), d=dlyDay(iso);
  if(d===null)return {result:'error', why:'the moment is not a date'};
  if(typeof PROFILES!=='undefined'&&PROFILES.indexOf(p)<0)return {result:'error', why:'NotARecord'};
  if(!p.summaries||typeof p.summaries!=='object')p.summaries=dlyBlank();
  var have=dlyToday(p,iso);
  if(have)return {result:'already', day:have};
  var draft=dlyCompose(p,iso,opt);
  var r=dlySeal(p,draft,iso);
  if(!r.ok)return {result:'error', why:'the day was not frozen: '+r.errs.join('; ')};
  var old=p.summaries;
  p.summaries=r.S;
  if(typeof save==='function'&&!save()){
   p.summaries=old;
   return {result:'error', why:'could not save: '+(SAVE_ERR||'error')};}
  return {result:draft.silent?'silent':'frozen', day:r.day, silent:draft.silent, silence:draft.silence};}
 catch(e){return {result:'error', why:'the day was not frozen: '+((e&&e.message)||'error')};}}

/* ============================================================
   THE DRAWER. dlyWhy answers "why did you say this" for one sentence of one
   frozen day, from the record and the trace graph, in the document's two
   interactions. Three kinds of reference: a graph node, a record reference
   and a term in the Knowledge base. The rules, each held by the gate:
   registration is not causation, so an edge is printed as its own verb and its
   provenance and never as a cause; a sentence keeps the addresses it was read
   at and the drawer says so when today's reading differs; an isolated node is
   flagged and never hidden; practice evidence is shown only when there is
   any, and its absence reads as no record yet and never as no change; and a
   story is shown as the person's own entry, read live.
   ============================================================ */
function dlyWhy(p,sid,idx,opt){
 var S=(p&&p.summaries)||dlyBlank(), day=null, i;
 for(i=0;i<S.days.length;i++)if(S.days[i].id===sid)day=S.days[i];
 if(!day)return {ok:false, why:'no frozen day is named '+sid};
 var st=day.st[idx];
 if(!st)return {ok:false, why:'day '+sid+' has no statement '+idx};
 var g=(opt&&opt.graph)||dlyGraph(p), gx={p:p, graph:g, reads:{}};
 var ids=traceStoryIds(p), ents=(p.story&&p.story.entries)||[], keys=[];
 var refs=st.ev.map(function(r){
  var res=dlyResolve(p,r,gx), kind=r.type==='kb'?'kb':(DLY_REC.indexOf(r.type)>=0?'record':'graph');
  var o={type:r.type, id:r.id, kind:kind, found:!!res, src:res?res.src:null};
  if(r.type==='story'){var k=ids.indexOf(r.id); o.entry=k>=0?ents[k].text:null; keys.push('story:'+r.id);}
  else if(kind==='graph')keys.push(r.type+':'+r.id);
  if(r.type==='kb'){var gl=dlyGloss(r.id); o.def=gl?gl.d:null;}
  return o;});
 var chains=[];
 for(i=0;i<keys.length;i++)for(var j=i+1;j<keys.length;j++){
  var path=g?tracePath(g,traceSplit(keys[i]),traceSplit(keys[j]),{undirected:true}):null;
  chains.push({from:keys[i], to:keys[j], steps:path?path.map(function(s){
   return {from:s.from, edge:s.edge, to:s.to, src:s.src};}):null});}
 var orphans=g?traceOrphans(g).isolated.filter(function(k){return keys.indexOf(k)>=0;}):[];
 var restated=g?(g.restated||[]).filter(function(x){return keys.indexOf(x.story)>=0;}):[];
 /* what each cited story reads as today, against what the person was shown */
 var now=[];
 refs.forEach(function(r){if(r.type==='story'&&r.entry!==null&&r.entry!==undefined){
  var k=ids.indexOf(r.id);
  dlyReadOf(p,ents[k],null,gx.reads).forEach(function(x){if(!st.read.length||st.read.some(function(y){return y.band===x.band;}))now.push(x);});}});
 var sig=function(a){return JSON.stringify(a.map(function(x){return x.addr+'|'+x.band;}).sort());};
 var seen={}, nowU=now.filter(function(x){var k=x.addr+'|'+x.band; if(seen[k])return false; seen[k]=1; return true;});
 var pe=((p.practice&&p.practice.practice_events)||[]).length;
 return {ok:true, day:sid, st:idx, text:st.text, src:st.src, rung:st.rung, refs:refs, chains:chains,
  orphans:orphans, restated:restated,
  read:{shown:st.read, today:nowU, differs:st.read.length>0&&sig(st.read)!==sig(nowU)},
  practice:pe?pe:'no record yet', standing:dlyStanding(S,sid,idx)};}
