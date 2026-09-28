/* ============================================================
   THE AVATAR, THE HERO OF ITS OWN TAB. Round HG in TASKS.md, 27 September.

   His words, verbatim, and they are the specification: "the centre panel is
   our hero element, and the avatar page is really about building the avatar,
   so it's me telling the story of who I want to become, and then that
   populating within these fields, maybe the tags, and it's using the sniffer
   to sniff those fields for my stories, and then it gives me the release
   protocols so I can become that person. And the percent complete, that's
   good. And then there should be something for the, not the release protocol,
   but the ritual, like which rituals I can queue up here, and task my
   rituals ... And where it says running, where you're visualizing it, the
   pleaser with the releasing loading, that's really excellent, I want you to
   add that design in there too."

   Five pieces, one surface, and every one of them is a port and not a new
   mechanism:

     the story    a pair, who you want to be and who you do not want to be,
                  in the exact shape engine/avatar.js validates. The second
                  line goes to readSeat, the resolver the avatar drill already
                  asks, so the address is the one the rest of the product
                  would give it. Nothing new parses anything.
     the tags     what the sniffer heard in that second line: the seat it
                  lands at, the person's own words that placed it (srcHear,
                  negation aware), and any fetter the words themselves named.
     the journal  the person's own committed entries, ranked by the charge the
                  sniffer stored at that seat when each was committed, and by
                  the words they share with the pair. The words quoted back
                  are marksOf's, so what is highlighted is what was scored.
     the release  queueFor from proto/avatar/seats4, carried with its body:
                  the addresses at the seat still carrying, the hot ones
                  first. The button is relPick, the shipped door.
     complete     closure from the same prototype, the share of the weight
                  held when the pair was written that has since gone. It is
                  the figure he approved on redesign-GG. avatarGap gives the
                  load now; the load then is kept at the moment of writing.

   And two he named on top of the story:

     running      the body map prototype's Running list, round HE, read off
                  compute().sabs rather than a mock table, with the direction
                  read off hotDir's own record of the last real change. So a
                  row says loading when a story has just raised it, releasing
                  when a release has just lowered it, and steady otherwise,
                  never on a timer. The tension line is drawn across the
                  avatar's own satellites.
     rituals      ritFor asked about each seat the avatar is working on,
                  exactly as seats4 asked it, queued here and tasked through
                  the shipped ritual builder, which is the one writer of a
                  ritual.

   WHAT IS NOT IN THE RECORD, said here and on nothing that claims otherwise.
   The profile boundary, validateProfile, rebuilds every stored record from
   the fields it names and drops the rest on the next load. It names no
   archetype rating and no starting weight for a pair, so both live beside the
   record under their own key in the same bound store, keyed by the profile's
   id. They survive a reload and do not travel with an export. Putting them in
   the record is a schema change, which is the owner's (CLAUDE.md, Schema v2).
   ============================================================ */
/* ============================================================
   ROOT TO CROWN, round JP, 27 September. His words, and they are the
   specification for everything below this block:

   "I want to have an icon of each symbol. You're going to go from root to
   crown. So the symbol will be on the left. The symbol will have the story
   behind the symbol, what it represents. You'll have the field at which you
   input your information. You'll talk through it. There'll be a prompt that
   you can cycle through to kind of drag that out of you. And then you could
   submit that to your avatar ... The sniffer then snips that out, adds that
   to your story cloud ... And then it will set up rules for affirmations or
   releases that you can do for a week or two weeks or a day ... And then if
   you click on the full avatar summary, it'll be the full wheel, and it'll
   have different ticks for what is set up ... You can edit that story from
   there. And then you can show your completion ... you get a tick per cycle
   as well. And I want three cycles, three revolutions per cycle."

   Nothing here is a second mechanism. What each piece is made of:

     the rows     BANDS in its own order, root first. The symbol is the one
                  this page already draws for the seat, AV_IC. What it
                  represents is AV_AREAS' own line, and the story behind it is
                  the seat's entry in APC, catalog.js, the only per seat prose
                  the engine carries. No seat description was written for this.
     the field    the same pair, be and notbe, that avatar.js validates, now
                  carrying the seat it was written at (schema.js, the one
                  field this round adds to the record).
     the prompt   AV_ASK, three questions a seat, cycled by one press. This is
                  the one piece of new copy, and it is a content decision that
                  is his to change. Each seat's example line was run through
                  readSeat before it went in and lands at its own seat.
     the sniffer  the Story page's own commit, step for step: undoPush,
                  applyStory, verpApply, leanApply, saveYou, an entry in the
                  four keys the boundary allows, pSave, pSnap. So what is
                  written here is in the journal the same way a journal entry
                  is, and the Story page, Imprints and Analytics read it.
     the rule     one practice a day for a day, a week or two weeks. A release
                  when the seat the story lands at is carrying, because that is
                  what release is for; the person's own first line said out
                  loud when nothing is held there, because an affirmation is
                  the install half of the two mechanics with nothing left to
                  clear. Kept beside the record, like the ratings, not in it.
     the wheel    the ring this page already drew, with a tick on every seat
                  that has a story, and the panel beside it edits that story.
     the cycles   read off the rituals marked done, the one record in the
                  product of a practice that happened. One turn is seven days
                  with a ritual done, one day for each seat root to crown;
                  three turns make a cycle; three cycles is the design target.
                  That reading of "revolution" is ours and is named as ours in
                  the report that carried it.
   ============================================================ */
var AV={sel:null, area:null, arch:null, trace:null, q:null,
 watch:null, sig:'', pc:{}, view:'seats', open:undefined, ask:{}, drafts:{}, edit:null, ruleRun:null};
var AV_KEY='atuned-avatar-side';
/* the seven areas and their angles are redesign-GG's own, so a satellite sits
   where it sat on the page he approved. The one word names are placeholders
   for his ruling and are marked as such in the report that carried them. */
var AV_AREAS=[
 {k:'meaning', b:'Crown',   nm:'Meaning',  about:'purpose, faith, what it is for', a:-90},
 {k:'clarity', b:'3rd Eye', nm:'Clarity',  about:'seeing straight, deciding',      a:-38.57},
 {k:'voice',   b:'Throat',  nm:'Voice',    about:'saying it, being heard',         a:-141.43},
 {k:'love',    b:'Heart',   nm:'Love',     about:'partner, family, closeness',     a:12.86},
 {k:'drive',   b:'Solar',   nm:'Drive',    about:'work, will, pressure',           a:167.14},
 {k:'pleasure',b:'Sacral',  nm:'Pleasure', about:'desire, play, making things',    a:64.29},
 {k:'ground',  b:'Root',    nm:'Ground',   about:'body, money, home, rest',        a:115.71}];
var AV_OF={}; AV_AREAS.forEach(function(x){AV_OF[x.b]=x;});
var AV_THE={Crown:'the crown','3rd Eye':'the third eye',Throat:'the throat',Heart:'the heart',
 Solar:'the solar plexus',Sacral:'the sacral',Root:'the root'};
var AV_IC={
 ground:'<path d="M4 11.5L12 5l8 6.5"/><path d="M6.5 10v9h11v-9"/><path d="M10.5 19v-4.5h3V19"/>',
 pleasure:'<path d="M3 9.5c2-2.6 4-2.6 6 0s4 2.6 6 0 4-2.6 6 0"/><path d="M3 15c2-2.6 4-2.6 6 0s4 2.6 6 0 4-2.6 6 0"/>',
 drive:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
 love:'<path d="M12 19.5s-7.5-4.4-7.5-9.7A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 2.2c0 5.3-7.5 9.7-7.5 9.7z"/>',
 voice:'<path d="M4.5 5.5h15v10h-9l-4.5 3.5v-3.5h-1.5z"/><path d="M8.5 10.5h7"/>',
 clarity:'<path d="M2.5 12s3.6-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.6 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
 meaning:'<path d="M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z"/>',
 person:'<circle cx="12" cy="7" r="3.4"/><path d="M4.5 21c0-4.6 3.4-7.8 7.5-7.8s7.5 3.2 7.5 7.8"/>'};
/* the tick, the pin and the cycle glyph, stroked like every icon here */
var AV_OK='<path d="M5 12.5l4.5 4.5L19 7.5"/>';
var AV_PIN='<path d="M9 3.5h6l-1 6 3.5 3.5h-11L10 9.5z"/><path d="M12 13v7.5"/>';
var AV_CYC='<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4.5h-4.5"/>';
/* THE PROMPTS, one set a seat, root to crown. Each asks for a thing that
   happened, in a body or a room, because that is what the sniffer can hear
   and what a person can answer without thinking about it first. The two
   example lines under each are placeholders in the fields, and every notbe
   was run through readSeat before it went in: an example the instrument
   cannot hear teaches a person the wrong thing on the first try, which is the
   same reason the throat line above was checked. Four first drafts failed
   that check and were rewritten: "my belly goes tight" read at the throat,
   "my head goes foggy" read nowhere, and "none of it matters" read at the
   sacral, because numb and empty are sacral words in the lexicon. */
var AV_ASK={
 Root:{ask:['Think of the last night you lay awake over money. What did your body do?',
  'When do you feel safe at home? Who are you on that day?',
  'What happens in your body when a bill comes in?'],
  be:'Someone who sleeps well and pays the bills on time.',
  notbe:'I lie awake scared about money and my legs will not keep still.'},
 Sacral:{ask:['When did you last stop yourself making something? What did your belly do?',
  'What would you make if nobody was watching?',
  'Think of a time you wanted something and said nothing. Where did you feel it?'],
  be:'Someone who makes things and shows them.',
  notbe:'When I show something I made, I feel exposed and I hide it.'},
 Solar:{ask:['Think of a hard day at work. Where did the pressure sit in your body?',
  'Who are you on a day you get the hard thing done?',
  'What does your stomach do when someone checks your work?'],
  be:'Someone who does the hard thing and stays steady.',
  notbe:'My stomach knots up and I feel angry when my boss checks my work.'},
 Heart:{ask:['Think of the last time someone close went quiet on you. What did your chest do?',
  'Who are you with the people you love, on a good day?',
  'When did you last feel alone in a full room?'],
  be:'Someone who stays close when it gets hard.',
  notbe:'My chest aches and I feel lonely when my partner goes quiet.'},
 Throat:{ask:['Think of the last time you held something back. What did your throat do?',
  'Who are you when you say the thing out loud in the room?',
  'When did someone talk over you? What did you do next?'],
  be:'A great public speaker. I stand up and the room hears me.',
  notbe:'My throat is tight and I am afraid when I stand up in front of the board.'},
 '3rd Eye':{ask:['Think of a choice you keep putting off. What happens when you go to make it?',
  'Who are you on a day you know which way to go?',
  'When did you last change your mind three times in an hour?'],
  be:'Someone who picks a way and walks it.',
  notbe:'I keep replaying the choice and never make it.'},
 Crown:{ask:['Finish this out loud: I am the kind of person who… What came out first?',
  'What would make this year feel worth it?',
  'When did you last feel that none of it matters? What did your body do?'],
  be:'Someone who knows what it is all for.',
  notbe:'I feel disconnected, like my life has no purpose.'}};
/* the story behind the symbol is APC's, first two sentences: what is stored
   at the seat and why. The rest of each entry is catalog counts, which answer
   a different question and are on the Knowledge page. */
function avStory(b){
 var a=(typeof APC!=='undefined')?APC.filter(function(x){return x.b===b;})[0]:null;
 if(!a||!a.d)return '';
 return (a.d.match(/[^.]*\./g)||[]).slice(0,2).join('').trim();}
/* how long a rule runs, in his three words: "a week or two weeks or a day" */
var AV_SPANS=[{d:1,nm:'A day'},{d:7,nm:'A week'},{d:14,nm:'Two weeks'}];
var AV_SPAN_D=AV_SPANS.map(function(s){return s.d;});
/* one turn is a day for each of the seven seats; three turns a cycle; three
   cycles is his target. Named once here so the drawing and the words agree. */
var AV_TURN=7, AV_TURNS=3, AV_CYCLES=3;
function avSvg(inner,cls){
 return '<svg viewBox="0 0 24 24" aria-hidden="true"'+(cls?' class="'+cls+'"':'')+'>'+inner+'</svg>';}
function avPos(a,r){var t=a*Math.PI/180;return [50+r*Math.cos(t),50+r*Math.sin(t)];}
function avP(n){return (+n).toFixed(2);}
function avArc(cx,cy,r,f){if(f<=0)return ''; if(f>=1)f=0.9999;
 var a0=-Math.PI/2,a1=a0+f*Math.PI*2;
 return 'M'+avP(cx+r*Math.cos(a0))+' '+avP(cy+r*Math.sin(a0))+' A'+r+' '+r+' 0 '+(f>0.5?1:0)
  +' 1 '+avP(cx+r*Math.cos(a1))+' '+avP(cy+r*Math.sin(a1));}
function avPct(f){return f==null?'–':Math.round(f*100)+'%';}

/* ---------------- whose record this is ----------------
   A worked example is a demonstration and not a record, so nothing on this
   page writes to one. The refusal is the one the release and the story
   already give for the same crossing. */
function avOwn(){
 return !!(typeof S!=='undefined'&&S.who===0&&CURP&&PROFILES.indexOf(CURP)>=0);}

/* ---------------- beside the record ----------------
   One key in the bound store, a map from profile id to that profile's
   ratings and starting weights. Anything that is not the shape this file
   writes is left out on the read rather than trusted, the same posture the
   boundary takes, and a store that cannot be read is an empty one here and
   never a reason to throw the surface. */
var AV_SCALE=[1,2,3,4,5];
function avSideAll(){
 if(typeof STORE==='undefined')return {};
 try{var o=JSON.parse(STORE.get(AV_KEY)||'{}');
  return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}catch(e){return {};}}
function avSide(){
 var out={arch:{}, load0:{}, rule:{}};
 if(!avOwn())return out;
 var e=avSideAll()[CURP.id];
 if(!e||typeof e!=='object')return out;
 if(e.arch&&typeof e.arch==='object')Object.keys(e.arch).forEach(function(k){
  if(avArchByName(k)&&AV_SCALE.indexOf(e.arch[k])>=0)out.arch[k]=e.arch[k];});
 if(e.load0&&typeof e.load0==='object')Object.keys(e.load0).forEach(function(k){
  var v=e.load0[k]; if(typeof v==='number'&&v>=0&&v<=10)out.load0[k]=v;});
 /* a rule is one seat's practice for a set run of days. Same posture as the
    two above: a rule that is not the shape avRuleSet writes is not a rule. */
 if(e.rule&&typeof e.rule==='object')Object.keys(e.rule).forEach(function(b){
  var r=e.rule[b];
  if(BANDS.indexOf(b)<0||!r||typeof r!=='object')return;
  if((r.k!=='release'&&r.k!=='say')||AV_SPAN_D.indexOf(r.days)<0)return;
  if(typeof r.from!=='string'||pracDay(r.from)===null)return;
  out.rule[b]={k:r.k, days:r.days, from:r.from,
   done:(Array.isArray(r.done)?r.done:[]).filter(function(d){return typeof d==='number'&&isFinite(d);})};});
 return out;}
/* true only when the store took it. A store that was never bound, or that
   throws on quota or on a blocked origin, answers false and the caller says so. */
function avSideWrite(fn){
 if(!avOwn()||typeof STORE_BOUND==='undefined'||!STORE_BOUND)return false;
 try{var all=avSideAll(), e=all[CURP.id]=all[CURP.id]||{};
  e.arch=e.arch||{}; e.load0=e.load0||{}; e.rule=e.rule||{};
  fn(e); STORE.set(AV_KEY,JSON.stringify(all)); return true;}
 catch(err){return false;}}
function avKey(pr){return pr.be+'\n'+pr.notbe;}

/* ---------------- where a story sits ----------------
   The seat it was written at, and for a pair written before round JP, which
   has none, the seat the sniffer hears it at, which is where the old page put
   it. A pair with neither sits on no seat and is listed on its own. */
function avSeatOf(x){return (x&&x.pair&&x.pair.seat)||(x&&x.gap&&x.gap.seat)||null;}

/* ---------------- the rule, read ----------------
   Days are counted the way the ladder counts them, pracDay, in the local
   frame of whoever pressed. A day is done when the person said it was or when
   a release started from the rule ran to its end. */
function avRuleRead(r,now){
 if(!r)return null;
 var t0=pracDay(r.from), today=pracDay(now||Date.now()), at=today-t0, marks=[], n=0;
 for(var i=0;i<r.days;i++){var y=r.done.indexOf(t0+i)>=0; if(y)n++;
  marks.push({y:y, t:i===at});}
 return {day:at+1, over:at>=r.days, doneN:n, today:r.done.indexOf(today)>=0, marks:marks};}

/* ---------------- the cycles ----------------
   A day counts when a ritual saved on it is marked done. An entry written
   before done existed carries no done key and is read as practised, which is
   ledgerRead's posture for the same record, so the two cannot disagree about
   whether a day happened. Distinct days, because ten rituals marked done on
   one afternoon is one day of practice and a wheel that turned ten seats for
   it would be counting presses. */
function avCycles(p){
 var seen={}, n=0;
 ((p&&p.rituals)||[]).forEach(function(x){
  if(!x)return;
  if(x.done!==undefined&&!x.done)return;
  var k=pracDay(x.t); if(k===null||seen[k])return; seen[k]=1; n++;});
 var per=AV_TURN*AV_TURNS, cyc=[];
 for(var c=0;c<AV_CYCLES;c++){
  var turns=[];
  for(var t=0;t<AV_TURNS;t++)
   turns.push(clamp((n-c*per-t*AV_TURN)/AV_TURN,0,1));
  cyc.push({turns:turns, done:n>=(c+1)*per});}
 return {days:n, cyc:cyc};}

/* ---------------- percent complete ----------------
   closure, carried from proto/avatar/seats4 with its body. A seat at no load
   is complete. With no starting weight kept, a pair reads nothing done, which
   understates rather than invents. */
function avClosure(row,load0){
 if(!row||!row.gap)return null;
 if(row.gap.clear)return 1;
 if(load0==null||load0<=0)return 0;
 return clamp(1-row.gap.load/load0,0,1);}

/* ---------------- what the sniffer hears in a pair ---------------- */
function avHeard(notbe){
 var t=String(notbe||'').trim(), out={seat:null, area:null, words:[], named:[]};
 if(!t)return out;
 var b=(typeof readSeat==='function')?readSeat(t):null;
 out.seat=b; out.area=b?AV_OF[b]:null;
 if(typeof srcHear==='function'){
  var h=srcHear(t), k=b?B2K[b]:null;
  h.seats.forEach(function(s){
   if(k&&s.seat!==k)return;
   s.words.forEach(function(w){if(out.words.indexOf(w)<0)out.words.push(w);});});}
 /* a fetter the words named, unless a heard word already carries it: "sad"
    heard and Sad named, or "ashamed" heard and Shame named, is one fact and
    prints once */
 var p=parseStory(t), lw=out.words.map(function(w){return String(w).toLowerCase();});
 out.named=(p.named||[]).filter(function(f){var fl=String(f).toLowerCase();
  return !lw.some(function(w){return w.indexOf(fl)>=0;});}).slice(0,3);
 return out;}

/* ---------------- the journal, sniffed for this pair ----------------
   An entry answers when the sniffer stored charge at the pair's seat when it
   was committed, or when it shares a word with what was heard in the pair.
   Stored bands are read rather than recomputed, because the sniffer has moved
   since the oldest entries were written and recomputing would rewrite what
   the person was told then. The text is parsed only to quote it back. */
function avParsed(t){
 if(AV.pc[t])return AV.pc[t];
 var p=parseStory(t), m=marksOf(t,p);
 return (AV.pc[t]={marks:m});}
function avJournal(seat,heard,own){
 var E=((CURP&&CURP.story&&CURP.story.entries)||[]).slice(-200);
 var k=B2K[seat], want={};
 (heard.words||[]).forEach(function(w){want[String(w).toLowerCase()]=1;});
 var now=Date.now(), out=[];
 E.forEach(function(e){
  if(!e||typeof e.text!=='string'||!e.text.trim())return;
  /* SINCE ROUND JP A PAIR'S SECOND LINE IS ITSELF A JOURNAL ENTRY, committed
     when it was added. It shares every word with the pair, so it would always
     rank first under "From your journal" and quote the person's own line back
     at them as though it were evidence found elsewhere. It is the pair. */
  if(own&&e.text.trim()===String(own).trim())return;
  var w=(e.bands&&e.bands[k])||0, pm=avParsed(e.text), at=[], shared=0;
  pm.marks.forEach(function(m){
   var s=e.text.slice(m.s,m.e);
   if(m.seat===k){at.push(m);}
   if(want[s.toLowerCase()]){shared++; if(m.seat!==k)at.push(m);}});
  if(w<=0&&!shared)return;
  var d=Math.floor((now-new Date(e.t).getTime())/86400000);
  out.push({e:e, score:Math.min(10,w/3)+shared*2, marks:at, days:d});});
 return out.sort(function(a,b){return b.score-a.score||a.days-b.days;}).slice(0,3);}
function avQuote(e,marks){
 var t=e.text, sorted=marks.slice().sort(function(a,b){return a.s-b.s;});
 var a=0, b=t.length, LIM=200;
 if(t.length>LIM){var c=sorted.length?sorted[0].s:0; a=Math.max(0,c-60); b=Math.min(t.length,a+LIM);}
 var h='', at=a;
 sorted.forEach(function(m){
  if(m.s<at||m.e>b)return;
  h+=esc(t.slice(at,m.s))+'<b>'+esc(t.slice(m.s,m.e))+'</b>'; at=m.e;});
 h+=esc(t.slice(at,b));
 return (a>0?'…':'')+h+(b<t.length?'…':'');}
function avAgo(d){return d<=0?'today':d===1?'yesterday':d+' days ago';}

/* ---------------- the release protocol ----------------
   queueFor, from proto/avatar/seats4, body kept. The run's length is the
   plan the release card will print, read without starting anything. */
function avQueue(seat){
 var at=W.filter(function(n){return n.b===seat&&n.sq>0&&n.cf;}).sort(function(a,b){return b.sq-a.sq;});
 var hot=at.filter(function(n){return n.sq>=4;});
 return (hot.length?hot:at).slice(0,8);}
function avMinutes(q){
 if(!q.length||!CURP||typeof meterPlan!=='function'||typeof relBudget!=='function')return null;
 var cap=relBudget(); if(cap<=0)return 0;
 var pl=meterPlan(CURP,q.map(function(n){return n.i;}),CHAN.map(function(c){return c[0]+c[2];}),cap);
 return pl.length*RUN.speed/60;}
function avMinSay(m){
 if(m===null)return '';
 if(m===0)return 'Allowance spent';
 return m<1?'Under a minute':'About '+Math.round(m)+(Math.round(m)===1?' minute':' minutes');}

/* ---------------- running ----------------
   The heaviest saboteurs compute() reads, one row a name, and which way
   their load last moved. A part that rose is loading, a part that fell is
   releasing, and a saboteur's direction is the sum of its parts. */
/* NOTHING WRITTEN MEANS NOTHING LOADED IT, round JP, reported by the owner:
   "it also says running ... negotiator when I haven't". Reproduced on a blank
   profile. A stated four letter type (engine/seed.js) writes charge onto the
   nine axes so a new field is not empty, and for eleven of the sixteen types
   that charge alone fits saboteurs: ENTP, INFJ, ENFP, ISTJ, ISFJ, ISTP, ISFP,
   ESTP and ESFP all listed the Negotiator, each row saying loading. hotTrack
   saw the axes rise from nothing and called it a rise, and loading is this
   page's word for a story that has just raised a load. No story had. So when
   the person has written nothing, no row claims a direction, and the card says
   where the rows came from instead. The seed is his ruling and is untouched;
   what changes is that the page stops attributing it to the person's words. */
function avRunning(r,seats,written){
 if(typeof hotTrack==='function')hotTrack();
 var seen={}, all=[];
 (r.sabs||[]).forEach(function(s){
  if(seen[s.nm]||!s.parts||!s.parts.length)return; seen[s.nm]=1;
  var dir=0, sb={};
  s.parts.forEach(function(n){dir+=(n.frDir||0); sb[n.b]=(sb[n.b]||0)+(+n.sq||0);});
  var order=Object.keys(sb).sort(function(a,b){return sb[a]-sb[b];});
  var fam=HCX_LIB.filter(function(h){return h.nm===s.hcx;})[0]||null;
  all.push({nm:s.nm, w:s.w, fam:fam, seats:order,
   dir:!written?'steady':dir>0?'loading':(dir<0?'releasing':'steady'),
   mine:order.some(function(b){return seats[b];})});});
 var mine=all.filter(function(x){return x.mine;});
 var seed=(!written&&CURP&&CURP.seed&&CURP.seed.type)?CURP.seed.type:null;
 return {mine:mine.length>0, seed:seed, written:!!written,
  rows:(mine.length?mine:all).slice(0,SAB_SHOW)};}
function avSabNamed(nm,run){
 for(var i=0;i<run.rows.length;i++)if(run.rows[i].nm===nm)return run.rows[i];
 return null;}

/* ---------------- rituals ----------------
   ritFor answers for one seat when it is handed that seat as the darkest,
   which is how seats4 asked it. One practice per seat, the lightest in the
   track, and a practice two seats call for is one row naming both. */
/* A SEAT WITH A RELEASE RULE RUNNING IS ASKED FIRST, round JP. His words: the
   sniffer "will set up rules for affirmations or releases that you can do for a
   week or two weeks". The rule is the person's own commitment to that seat for
   those days, so for as long as it runs its seat outranks a heavier one that
   nobody has committed to. After the run ends the order is the load again. */
function avRituals(r,rows,rule){
 var by={}, seats=[], pri={};
 rows.forEach(function(x){
  if(!x.gap||x.gap.clear)return;
  var R=rule&&rule[avSeatOf(x)], RR=avRuleRead(R);
  if(R&&R.k==='release'&&RR&&!RR.over)pri[x.gap.seat]=1;
  if(!by[x.gap.seat]){by[x.gap.seat]=x.gap.load; seats.push(x.gap.seat);}});
 seats.sort(function(a,b){return ((pri[b]||0)-(pri[a]||0))||(by[b]-by[a]);});
 var seen={}, out=[];
 seats.slice(0,4).forEach(function(b){
  var c=ritFor({darkB:b, DQ:r.DQ}); if(!c||!c.called)return;
  var k=c.called.k;
  if(seen[k]){seen[k].areas.push(AV_OF[b]); return;}
  out.push(seen[k]={p:c.called, areas:[AV_OF[b]], track:c.called.track});});
 return out;}

/* ---------------- the archetypes ----------------
   The twelve the instrument reads, ARCH, each seated where ARCH seats it.
   The primary saboteur and its seat come from ARCH18, the table that carries
   them, joined by name. ARCH18 calls the Rebel the Outlaw; ARCH is the table
   the engine reads and the rail prints, so the Rebel keeps its shipped name. */
var AV_DEF={
 Warrior:'The Warrior moves on the threat and counts the damage after. It gets the thing done on a day when feeling it would stop you.',
 Sage:'The Sage reads the situation before it moves. It gives you ground to stand on when the moment is unclear.',
 Rebel:'The Rebel refuses the frame it is handed. It marks where you end and other people begin.',
 Caregiver:'The Caregiver attends to the other person first. It sees who needs something before they ask.',
 Creator:'The Creator makes the thing. It turns what is in your head into something other people can hold.',
 Magician:'The Magician changes the conditions around a problem. It finds the one lever that moves the rest.',
 Ruler:'The Ruler keeps things in order. It keeps you trusted with people, money and decisions.',
 Explorer:'The Explorer goes to the edge of what it knows. It brings back what nobody at home has seen yet.',
 Lover:'The Lover closes the distance to the people it wants near. It stays close when things get hard.',
 Jester:'The Jester breaks the tension. It gets a tight room laughing, and breathing, again.',
 Everyman:'The Everyman stays with the room, so it reads the room first. It keeps you in the group.',
 Innocent:'The Innocent takes things at face value. It lets you trust people and start again after a bad day.'};
/* what taking the role on costs, as a thing that happens in a day. It names
   the saboteur and never calls the person by it. */
var AV_IMPACT={
 'Controller':'Handing a thing over feels like dropping it, so the grip stays on.',
 'Pleaser':'Yes comes out before your own answer has been checked.',
 'Stickler':'Time goes into holding everything to the one right way.',
 'Hyper-Rational':'What cannot be explained gets set aside, feelings first.',
 'Avoider':'What needs dealing with waits, for as long as waiting costs nothing today.',
 'Hyper-Vigilant':'Part of your attention stays on the door, even in a safe room.',
 'Victim':'What happened to you takes up the room the next step needs.',
 'Restless':'Once a thing turns familiar, the next one starts to pull.',
 'Judge':'Every shortfall gets a verdict, your own included.',
 'Hyper-Achiever':'Rest feels like falling behind, so the output keeps running.',
 'Worrywart':'The worst case runs on a loop, and it feels like planning.'};
var AV_ROSTER=ARCH.map(function(a,i){
 var row=ARCH18.filter(function(x){return (x[0]==='Outlaw'?'Rebel':x[0])===a.nm;})[0]||null;
 return {nm:a.nm, v:a.v, b:a.b, ic:a.ic, i:i, sab:row?row[1]:null, sabB:row?row[2]:null};});
function avArchByName(nm){
 for(var i=0;i<AV_ROSTER.length;i++)if(AV_ROSTER[i].nm===nm)return AV_ROSTER[i];
 return null;}
/* two to a seat sit either side of the seat's own angle */
var AV_SPREAD=13;
function avArchAngle(a){
 var same=AV_ROSTER.filter(function(x){return x.b===a.b;}), j=same.indexOf(a), n=same.length;
 return AV_OF[a.b].a+(n<2?0:(j-(n-1)/2)*2*AV_SPREAD);}
function avArchIc(a,cls){
 return '<svg viewBox="0 0 24 24" aria-hidden="true"'+(cls?' class="'+cls+'"':'')+'><path d="'+a.ic+'"/></svg>';}
var AV_RANK=['first','second','third'];
/* EVERY ARCHETYPE THE READING FINDS, AS A SHARE, and the top three pinned.
   Round JP, his words: "with the archetypes, we want their archetypes to
   already be pinned in. And we want the sniffer to identify the percent of all
   the ones that it picks up."

   WHERE THE PERCENT COMES FROM, said here because the obvious guess is wrong.
   compute().aff is affinity() in engine/core.js, and it is built from the
   soul's domain vector alone. No story and no charge reaches it, which is his
   own ruling in the glossary: an archetype "was there first, it is not stored
   in the body and it is not released." So the percent is each archetype's
   share of that reading, the twelve adding to a hundred, and it is not the
   sniffer's: nothing a person writes moves it, and the page does not say it
   does. Nothing is pinned on an unread field, for the reason avCompare is
   silent there. */
function avArchShare(r){
 if(!r||r.unread||!r.aff||!r.aff.length)return null;
 var sum=r.aff.reduce(function(s,v){return s+(v>0?v:0);},0);
 if(sum<=0)return null;
 return r.aff.map(function(v){return (v>0?v:0)/sum;});}
function avArchPins(sh){
 var out={}; if(!sh)return out;
 sh.map(function(v,i){return {i:i,v:v};}).filter(function(x){return x.v>0;})
  .sort(function(a,b){return b.v-a.v;}).slice(0,3).forEach(function(x){out[x.i]=true;});
 return out;}
function avCompare(a,rating,r){
 /* HS sweep. Silence on an unread field: there is nothing to set beside the
    person's own rating, and a sentence saying so is a refusal nobody asked
    for, sitting under a control they have not pressed. The two tails below,
    "That gap is what the scale is for" and "Both are kept", explained the
    scale rather than reading it, and are cut the same way. */
 if(r.unread)return '';
 var ro=(r.aff||[]).map(function(v,i){return {i:i,v:v};}).sort(function(x,y){return y.v-x.v;});
 if(!ro.length)return '';
 var at=-1; ro.forEach(function(x,j){if(x.i===a.i)at=j;});
 var top=ARCH[ro[0].i].nm, where=at<3?AV_RANK[at]:'further down';
 if(at===0)return 'Your field reads '+a.nm+' first'+(rating?' too.':'.');
 if(rating&&rating<=2&&at<=2)
  return 'You set '+a.nm+' low and your field reads it '+where+'.';
 return 'Your field reads '+top+' first and '+a.nm+' '+where+'.';}

/* ---------------- the state the page draws ---------------- */
function avState(){
 var r=compute(), side=avSide();
 var rows=(typeof avRows==='function')?avRows():[];
 rows.forEach(function(x,i){x.i=i; x.c=avClosure(x,side.load0[avKey(x.pair)]);});
 /* A STORY SITS AT THE SEAT IT WAS WRITTEN AT, round JP, which is where its
    row and its tick are. The percent it carries is still read at the seat
    the sniffer hears it at, because that is where the load it is measured
    against lives. Before this round both were the heard seat, so an older
    pair is placed exactly where it always was. */
 var areas={}, bySeat={};
 AV_AREAS.forEach(function(A){
  var mine=rows.filter(function(x){return avSeatOf(x)===A.b;});
  /* the one a row shows is the newest written at this seat, and a pair the
     sniffer placed here only when nothing was written here on purpose */
  var own=mine.filter(function(x){return x.pair.seat===A.b;});
  bySeat[A.b]=(own.length?own:mine).slice(-1)[0]||null;
  var cs=mine.map(function(x){return x.c;}).filter(function(v){return v!=null;});
  areas[A.k]={rows:mine, set:mine.length>0,
   pct:cs.length?cs.reduce(function(s,v){return s+v;},0)/cs.length:null};});
 var cs=rows.map(function(x){return x.c;}).filter(function(v){return v!=null;});
 var overall=cs.length?cs.reduce(function(s,v){return s+v;},0)/cs.length:null;
 /* the lead is the one the person pressed, or the heaviest still carrying */
 var lead=(AV.sel!=null&&rows[AV.sel])?rows[AV.sel]:null;
 if(!lead&&AV.area==null){
  var open=rows.filter(function(x){return x.gap&&!x.gap.clear;})
   .sort(function(a,b){return b.gap.load-a.gap.load;});
  lead=open[0]||rows[0]||null;}
 var seats={}; rows.forEach(function(x){if(x.gap)seats[x.gap.seat]=1;});
 var rated=Object.keys(side.arch).sort(function(a,b){return side.arch[b]-side.arch[a];});
 /* only the person's own record: a worked example's charge is its case file,
    which is neither something the person wrote nor a type they stated, and a
    line saying "nothing you wrote" over Diane's saboteurs, measured on the ICP
    read, speaks to the wrong person. Examples keep what they showed before. */
 var written=!avOwn()||rows.length>0||!!((CURP&&CURP.story&&CURP.story.entries)||[]).length;
 return {r:r, side:side, rows:rows, areas:areas, bySeat:bySeat, overall:overall, lead:lead,
  run:avRunning(r,seats,written), rit:avRituals(r,rows,side.rule), cyc:avCycles(CURP),
  top:rated[0]?avArchByName(rated[0]):null};}

/* ---------------- the ring ----------------
   redesign-GG's figure: a core carrying percent complete, seven satellites
   at the same angles, each with its own. The core wears the archetype the
   person rates highest. Over it, the running saboteurs as tension lines
   across the satellites of the seats their parts sit at, drawn from the
   lightest seat to the heaviest so a pulse travels toward the heaviest while
   loading and away from it while releasing. */
var AV_ORB=37.5, AV_SR=6.5;
function avLines(st){
 var rows=st.run.rows; if(!rows.length)return '';
 var show=AV.trace?rows.filter(function(x){return x.nm===AV.trace;}):rows.slice(0,3);
 var s='';
 show.forEach(function(x){
  var c=x.fam?seatCol(x.fam.b):'var(--dim)', sw=(0.35+Math.min(10,x.w)*0.05).toFixed(2), d;
  if(x.seats.length<2){
   var A=AV_OF[x.seats[0]]; if(!A)return;
   var o=avPos(A.a,AV_ORB), R=AV_SR+2.4;
   d='M'+avP(o[0])+' '+avP(o[1]-R)+' a'+R+' '+R+' 0 1 1 -0.01 0';}
  else{
   d='';
   x.seats.forEach(function(b,j){
    var A=AV_OF[b]; if(!A)return;
    var p=avPos(A.a,AV_ORB-AV_SR-1.2);
    if(!d){d='M'+avP(p[0])+' '+avP(p[1]);return;}
    var prev=AV_OF[x.seats[j-1]], q=avPos(prev.a,AV_ORB-AV_SR-1.2);
    var mx=(p[0]+q[0])/2, my=(p[1]+q[1])/2, cx=50+(mx-50)*0.35, cy=50+(my-50)*0.35;
    d+=' Q'+avP(cx)+' '+avP(cy)+' '+avP(p[0])+' '+avP(p[1]);});}
  if(!d)return;
  var dur=Math.max(3,9-Math.sqrt(Math.max(0,x.w))*1.8).toFixed(1);
  s+='<path class="av-line" d="'+d+'" style="stroke:'+c+';stroke-width:'+sw+'"/>';
  if(x.dir!=='steady')
   s+='<path class="av-pulse '+(x.dir==='loading'?'av-ld':'av-rl')+'" d="'+d+'" style="stroke:'+c
    +';stroke-width:'+(+sw+0.5).toFixed(2)+';animation-duration:'+dur+'s"/>';});
 return s;}
function avRing(st){
 var ORB=AV_ORB, SR=AV_SR, lead=st.lead, hot=lead&&lead.gap?lead.gap.seat:null;
 var s='<svg class="av-draw" viewBox="0 0 100 100" aria-hidden="true">';
 for(var i=0;i<72;i++){var a=i*5,p0=avPos(a,19.2),p1=avPos(a,i%6===0?21.4:20.4);
  s+='<line x1="'+avP(p0[0])+'" y1="'+avP(p0[1])+'" x2="'+avP(p1[0])+'" y2="'+avP(p1[1])+'" class="av-tick"/>';}
 s+='<circle cx="50" cy="50" r="17.6" class="av-track"/>';
 if(st.overall!=null&&st.overall>0)
  s+='<path d="'+avArc(50,50,17.6,st.overall)+'" class="av-prog"/>';
 AV_AREAS.forEach(function(x){
  var c=avPos(x.a,ORB), A=st.areas[x.k];
  var has=A.rows.length>0, on=hot===x.b||AV.area===x.k, col=seatCol(x.b);
  s+='<circle cx="'+avP(c[0])+'" cy="'+avP(c[1])+'" r="'+SR+'" class="av-sring" style="stroke:'
   +(has||on?col:'var(--edge-2)')+';stroke-opacity:'+(on?.95:has?.35:1)+';stroke-width:'+(on?.8:.55)+'"/>';
  if(A.pct!=null&&A.pct>0)
   s+='<path d="'+avArc(c[0],c[1],SR,A.pct)+'" class="av-sarc" style="stroke:'+col+'"/>';});
 s+=avLines(st)+'</svg>';
 var top=st.top, core='<div class="av-core'+(top?' av-on':'')+'"'+(top?' style="--c:'+seatCol(top.b)+'"':'')+'>'
  +(top?avArchIc(top,'av-core-ic'):avSvg(AV_IC.person,'av-core-ic'))
  +'<span class="av-core-big">'+avPct(st.overall)+'</span><span class="av-core-lb">Complete</span>'
  +(top?'<span class="av-core-an">'+esc(top.nm)+'</span>':'')+'</div>';
 var sats=AV_AREAS.map(function(x){
  var c=avPos(x.a,ORB), A=st.areas[x.k], on=(AV.area===x.k)||(AV.area==null&&hot===x.b);
  /* ON A FIRST RUN THE SEVEN WERE MARKS, NOT BUTTONS, because a press opened
     nothing worth opening and seven dead controls took the first screen past
     its floor. Both reasons are gone as of round JP: this wheel is no longer
     the first screen, the seat rows are, and a press on an empty seat now
     opens that seat's own form in the panel, which is the "you can edit that
     story from there" he asked for. So they are buttons from the start. The
     tick is his "different ticks for what is set up": a seat with a story. */
  return '<button type="button" class="av-sat'+(on?' av-on':'')+'" data-avsat="'+x.k+'" style="left:'
   +avP(c[0])+'%;top:'+avP(c[1])+'%;--c:'+seatCol(x.b)+'" aria-pressed="'+on+'" aria-label="'+x.nm+', '
   +(A.set?'story written, ':'nothing written')+(A.pct==null?'':Math.round(A.pct*100)+' percent complete')+'">'
   +avSvg(AV_IC[x.k])+'<span class="av-sat-pc">'+avPct(A.pct)+'</span>'
   +(A.set?'<span class="avs-tick" aria-hidden="true">'+avSvg(AV_OK)+'</span>':'')+'</button>';}).join('');
 var labs=AV_AREAS.map(function(x){var l=avPos(x.a,26.4);
  return '<span class="av-slab" style="left:'+avP(l[0])+'%;top:'+avP(l[1])+'%">'+x.nm+'</span>';}).join('');
 return '<div class="av-ring">'+s+labs+core+sats+'</div>';}

/* ---------------- the panel beside the ring ---------------- */
function avTags(h){
 if(!h.seat)return '';
 return '<div class="av-tags">'
  +'<span class="av-tag" style="--c:'+seatCol(h.seat)+'">'+avSvg(AV_IC[h.area.k])+esc(h.area.nm)+', '+AV_THE[h.seat]+'</span>'
  +h.words.slice(0,4).map(function(w){return '<span class="av-tag av-tw">'+esc(w)+'</span>';}).join('')
  +h.named.map(function(f){return '<span class="av-tag av-tf">'+esc(String(f).toLowerCase())+'</span>';}).join('')
  +'</div>';}
/* WHAT REPLACES IT, the embody side of his left and right: "on the left side,
   it's the patterns to release. And on the right side, it's the patterns to
   embody." A pattern to embody is the coherent pole CHILD already names for
   every fetter the release line was read to, Fear to Trust and the rest,
   heaviest first. Nothing is inferred past what parseStory placed. */
function avPoles(notbe){
 var t=String(notbe||'').trim(); if(!t)return [];
 var w={};
 parseStory(t).imprints.forEach(function(im){if(im.fetter)w[im.fetter]=(w[im.fetter]||0)+(im.amt||0);});
 return Object.keys(w).sort(function(a,b){return w[b]-w[a];}).map(function(f){
  var c=CHILD.filter(function(x){return x.nm===f;})[0];
  return c?{from:f, to:c.opp, b:c.seat}:null;}).filter(Boolean).slice(0,3);}
function avPoleTags(P){
 if(!P.length)return '';
 return '<div class="av-tags">'+P.map(function(p){
  return '<span class="av-tag" style="--c:'+seatCol(p.b)+'">'+esc(p.to)+'</span>';}).join('')+'</div>';}
/* THE SENTENCE, LIT THE WAY THE JOURNAL LIGHTS IT. His words: "make it look as
   interesting as the input text box for the story journal". The journal's
   interest is that the sniffer's words light up in their own seat colour in
   the person's own sentence. That is ported and not redrawn: stMarks is the
   Story page's own placement, over marksOf's offsets, and the mark is the
   same element with the same class, so the two surfaces cannot disagree about
   which letters were scored. stHLHtml itself reads the Story page's state and
   cannot be handed a string, which is the only reason these few lines exist. */
function avHL(t){
 t=String(t||'');
 if(!t.trim()||typeof stMarks!=='function')return esc(t);
 var p=parseStory(t), marks=stMarks(t,p);
 if(!marks.length)return esc(t);
 var out='', last=0;
 marks.forEach(function(m){
  var from=(m.neg&&m.negFrom!=null&&m.negFrom>=last)?m.negFrom:m.s;
  if(from<last)return;
  out+=esc(t.slice(last,from))+'<mark class="st-f'+(m.neg?' neg':'')+'" style="--c:'
   +(m.bn?seatCol(m.bn):'var(--accent)')+'">'+esc(t.slice(from,m.e))+'</mark>';
  last=m.e;});
 return out+esc(t.slice(last));}
function avDraft(b){return AV.drafts[b]=AV.drafts[b]||{be:'',notbe:''};}
/* the seat a row opens on when nobody has chosen one: the first with no
   story, root first, which is the order he asked it to be walked in */
function avOpenSeat(st){
 if(AV.open!==undefined)return AV.open;
 for(var i=0;i<BANDS.length;i++)if(!st.bySeat[BANDS[i]])return BANDS[i];
 return null;}
/* one box, in the journal's own two layers: the lit sentence behind, and a
   transparent textarea in front carrying the caret */
function avBox(b,k,text){
 var A=AV_OF[b], ask=AV_ASK[b], rel=k==='notbe';
 return '<div class="avs-col"><div class="avs-lab"><b>'+(rel?'To release':'To embody')+'</b>'
  +'<span>'+(rel?'Who you do not want to be':'Who you want to be')+'</span></div>'
  +'<div class="st-ed avs-ed"><div class="st-hl" data-avhl="'+k+'" aria-hidden="true">'+avHL(text)+'\n</div>'
  +'<textarea class="st-ta" data-avf="'+k+'" data-avs="'+b+'" maxlength="199" rows="3" spellcheck="false" '
  +'aria-label="'+(rel?'To release':'To embody')+', '+A.nm+'" placeholder="'+esc(rel?ask.notbe:ask.be)+'">'
  +esc(text)+'</textarea></div>'
  +'<div class="av-live" data-avlive="'+k+'" role="status" aria-live="polite">'
  +(rel?avLive(avHeard(text),{notbe:text}):avLiveBe(avDraft(b).notbe))+'</div></div>';}
/* THE PROMPT CYCLES, and the two boxes sit release left and embody right, his
   order. The question is the only thing on the form that is not a field or a
   button, and it is a question, so it is read and never explained. */
function avSeatForm(b,idx){
 var d=avDraft(b), ask=AV_ASK[b], i=(AV.ask[b]||0)%ask.ask.length;
 return '<div data-avform="'+b+'">'
  +'<div class="avs-ask"><span class="avs-ask-ic">'+avSvg(AV_CYC)+'</span>'
  +'<p class="avs-q" data-avq="'+b+'">'+esc(ask.ask[i])+'</p>'
  +'<button type="button" class="btn avs-cyc" data-avcyc="'+b+'">Another question</button></div>'
  +'<div class="avs-two">'+avBox(b,'notbe',d.notbe)+avBox(b,'be',d.be)+'</div>'
  +'<div class="av-act"><button type="button" class="btn pri" data-avadd="'+b+'"'
  +(d.be.trim()&&d.notbe.trim()?'':' disabled')+'>'+(idx!=null?'Save the change':'Add to your avatar')+'</button>'
  +(idx!=null?'<button type="button" class="btn" data-avcancel="'+b+'">Cancel</button>':'')+'</div></div>';}
/* a written story, the same two sides, lit and read back */
function avSeatWritten(st,b,x){
 var h=avHeard(x.pair.notbe), P=avPoles(x.pair.notbe);
 return '<div class="avs-two">'
  +'<div class="avs-col"><div class="avs-lab"><b>To release</b><span>Who you do not want to be</span></div>'
  +'<p class="avs-said">'+avHL(x.pair.notbe)+'</p>'+avTags(h)+'</div>'
  +'<div class="avs-col"><div class="avs-lab"><b>To embody</b><span>Who you want to be</span></div>'
  +'<p class="avs-said">'+avHL(x.pair.be)+'</p>'+avPoleTags(P)+'</div></div>'
  +avRuleHTML(st,b,x)
  +'<div class="av-act"><button type="button" class="btn" data-avedit="'+x.i+'">Edit</button>'
  +'<button type="button" class="btn" data-avtake="'+x.i+'">Take it off</button></div>';}
/* ---------------- the rule ----------------
   What it is follows from the seat the story lands at. Carrying, it is a
   release a day, because that is the mechanic that lowers a load. Clear, it is
   the person's own embody line said out loud once a day, which is the install
   half of the two mechanics and the only half left to do. The person picks the
   length, in his three words. */
function avRuleHTML(st,b,x){
 var g=x.gap;
 if(!g)return '<p class="av-p">The sniffer could not read a feeling out of this line, so it has no '
  +'address yet. Say it again with one in: what the body did, or what you felt.</p>';
 var R=st.side.rule[b], RR=avRuleRead(R), q=avQueue(g.seat), rel=!g.clear&&q.length>0;
 var out='<div class="avs-rule">';
 if(!R||RR.over){
  out+=(RR&&RR.over?'<p class="avs-rp"><b>Finished.</b> Done on '+RR.doneN+(RR.doneN===1?' day.':' days.')+'</p>':'')
   +'<p class="avs-rp">'+(rel?'One release a day at '+AV_THE[g.seat]+'.'
    :'Nothing held at '+AV_THE[g.seat]+', so say your embody line out loud once a day.')+'</p>'
   +'<div class="avs-spans" role="group" aria-label="How long">'+AV_SPANS.map(function(s){
    return '<button type="button" class="btn" data-avrule="'+s.d+'" data-avfor="'+b+'">'+s.nm+'</button>';}).join('')+'</div>';}
 else{
  out+='<div class="avs-rh"><span class="avs-rk">'+(R.k==='release'?'Release':'Say it')+', once a day</span>'
   +'<span class="avs-dn">Day '+Math.max(1,RR.day)+'</span></div>'
   +'<div class="avs-days" role="img" aria-label="'+RR.doneN+(RR.doneN===1?' day':' days')+' done">'
   +RR.marks.map(function(m){return '<i class="avs-d'+(m.y?' avs-y':'')+(m.t?' avs-now':'')+'"></i>';}).join('')+'</div>';
  if(R.k==='say')out+='<p class="avs-say">“'+esc(x.pair.be)+'”</p>';
  out+='<div class="av-act">';
  if(RR.today)out+='<span class="avs-ok">Done today.</span>';
  else if(R.k==='release'){var m=avMinutes(q);
   out+='<button type="button" class="btn pri av-go" data-avdo="'+b+'"'+(q.length?'':' disabled')+'>Release it'
    +(m!==null?'<small>'+avMinSay(m)+'</small>':'')+'</button>';}
  else out+='<button type="button" class="btn pri" data-avdo="'+b+'">I said it</button>';
  out+='<button type="button" class="btn" data-avstop="'+b+'">Stop</button></div>';}
 return out+'</div>';}
/* one seat, root to crown. The symbol on the left and what it represents, and
   open, the story behind it on the left of the two boxes. */
function avSeatRow(st,b){
 var A=AV_OF[b], x=st.bySeat[b], open=avOpenSeat(st)===b, editing=!!(x&&AV.edit===x.i);
 var R=st.side.rule[b], RR=avRuleRead(R);
 var sub=x?esc(x.pair.be):esc(A.about.charAt(0).toUpperCase()+A.about.slice(1))+'.';
 var h='<section class="avs-row'+(open?' avs-open':'')+(x?' avs-set':'')+'" data-avrow="'+b+'" style="--c:'+seatCol(b)+'">'
  +'<button type="button" class="avs-hd" data-avopen="'+b+'" aria-expanded="'+open+'">'
  +'<span class="avs-ic">'+avSvg(AV_IC[A.k])+(x?'<span class="avs-tick">'+avSvg(AV_OK)+'</span>':'')+'</span>'
  +'<span class="avs-t"><span class="avs-nm">'+A.nm+'<em>'+AV_THE[b]+'</em></span>'
  +'<span class="avs-ab">'+sub+'</span></span>'
  +(R&&RR&&!RR.over?'<span class="avs-live">Day '+Math.max(1,RR.day)+'</span>':'')
  +(x?'<span class="avs-pc">'+avPct(x.c)+'</span>':'')
  +'<span class="avs-chev">'+avSvg('<path d="M6 9.5l6 6 6-6"/>')+'</span></button>';
 if(open)h+='<div class="avs-body"><p class="avs-story">'+esc(avStory(b))+'</p><div class="avs-main">'
  +(x&&!editing?avSeatWritten(st,b,x):avSeatForm(b,editing?x.i:null))+'</div></div>';
 return h+'</section>';}
function avSeats(st){
 return '<div class="avs-list">'+BANDS.map(function(b){return avSeatRow(st,b);}).join('')+'</div>';}

/* THE PANEL IS SMALLER THAN IT WAS, his words at round JP: "the hero graphic
   is too small, and the information area is too big." It keeps one journal
   quote rather than three and states the pair once, and a seat with nothing
   on it opens its own form here, which is where a tick is set from the wheel. */
function avPanel(st){
 var x=st.lead;
 var head=function(b,pct){var A=AV_OF[b];
  return '<div class="av-ph"><span class="av-pic">'+avSvg(AV_IC[A.k])+'</span>'
   +'<div><div class="av-pn">'+A.nm+'</div><p class="av-pa">'+esc(A.about)+'. At '+AV_THE[b]+'.</p></div>'
   +'<span class="av-pp">'+avPct(pct)+(pct!=null?'<small>Complete</small>':'')+'</span></div>';};
 if(x&&AV.edit===x.i){var be=avSeatOf(x)||BANDS[0];
  return '<div class="av-card av-panel" style="--c:'+seatCol(be)+'">'+head(be,x.c)+avSeatForm(be,x.i)+'</div>';}
 if(!x){
  var A=AV.area!=null?AV_AREAS.filter(function(a){return a.k===AV.area;})[0]:null;
  var b=A?A.b:(avOpenSeat(st)||BANDS[0]);
  return '<div class="av-card av-panel" style="--c:'+seatCol(b)+'">'+head(b,null)
   +'<p class="avs-story">'+esc(avStory(b))+'</p>'+avSeatForm(b,null)+'</div>';}
 var g=x.gap, h=avHeard(x.pair.notbe), b2=avSeatOf(x);
 var out='<div class="av-card av-panel"'+(b2?' style="--c:'+seatCol(b2)+'"':'')+'>'
  +(b2?head(b2,x.c):'<div class="av-ph"><span class="av-pic">'+avSvg(AV_IC.person)+'</span><div><div class="av-pn">No seat</div>'
   +'<p class="av-pa">not read yet</p></div></div>')
  +'<div class="av-pl">To release</div><p class="av-pv av-pq">“'+esc(x.pair.notbe)+'”</p>'
  +avTags(h)
  +'<div class="av-pl">To embody</div><p class="av-pv">'+esc(x.pair.be)+'</p>'
  +avPoleTags(avPoles(x.pair.notbe));
 out+=g?avPanelFor(x,g,h)
  :'<p class="av-p">The sniffer could not read a feeling out of this line, so it has no '
   +'address yet. Say it again with one in: what the body did, or what you felt.</p>'
   +'<div class="av-act"><button type="button" class="btn" data-avedit="'+x.i+'">Edit</button>'
   +'<button type="button" class="btn" data-avtake="'+x.i+'">Take it off</button></div>';
 return out+'</div>';}
/* the half of the panel that needs an address: the journal sniffed for this
   pair, and the protocol that clears it */
function avPanelFor(x,g,h){
 var out='';
 var J=avJournal(g.seat,h,x.pair.notbe).slice(0,1);
 out+='<div class="av-pl">From your journal</div>';
 if(J.length)
  out+='<div class="av-jr">'+J.map(function(j){
   return '<div class="av-jr-row"><p class="av-jr-q">'+avQuote(j.e,j.marks)+'</p>'
    +'<p class="av-jr-m">'+avAgo(j.days)+(j.marks.length?'. Heard at '+AV_THE[g.seat]:'')+'</p></div>';}).join('')+'</div>';
 else
  /* HS sweep: "What you commit on the Story page is read here" explained
     where this row reads from. The row's own label says it: From your journal. */
  out+='<p class="av-p">Nothing in your journal lands at '+AV_THE[g.seat]+' yet.</p>';
 /* and the protocol that clears it */
 var q=avQueue(g.seat), m=avMinutes(q);
 var edit='<button type="button" class="btn" data-avedit="'+x.i+'">Edit</button>'
  +'<button type="button" class="btn" data-avtake="'+x.i+'">Take it off</button>';
 if(g.clear||!q.length)
  out+='<p class="av-p">Nothing is carrying at '+AV_THE[g.seat]+', so there is nothing to release for this one.</p>'
   +'<div class="av-act">'+edit+'</div>';
 else
  out+='<p class="av-p">'+q.length+(q.length===1?' address':' addresses')+' at '+AV_THE[g.seat]
   +' carry what stands in the way, heaviest '+esc(q[0].k)+'.</p>'
   +'<div class="av-act"><button type="button" class="btn pri av-go" id="avrel">Release it'
   +(m!==null?'<small>'+avMinSay(m)+'</small>':'')+'</button>'+edit+'</div>';
 return out;}
function avLive(h,d){
 if(!String(d.notbe||'').trim())return '';
 if(!h.seat)return '<p class="av-p">Nothing read yet, so this line has no address. Say what the body did, or what you felt.</p>';
 return '<p class="av-p">Lands at <b>'+esc(h.area.nm)+'</b>, '+AV_THE[h.seat]+'.</p>'+avTags(h);}
/* the embody box reads the release box, because what replaces a pattern is
   named by the pattern: the poles show under the line they are the direction
   of, as soon as the release line has been read */
function avLiveBe(notbe){
 var P=avPoles(notbe);
 return P.length?'<p class="av-p">Toward</p>'+avPoleTags(P):'';}
/* A PAIR ON NO SEAT, which is only an older one the sniffer could not read.
   Every other pair has a row and a tick; this one would otherwise be
   unreachable, so it is listed where it can be pressed and taken off. */
function avPairs(st){
 var loose=st.rows.filter(function(x){return !avSeatOf(x);});
 if(!loose.length)return '';
 return '<div class="av-pairs"><div class="pm-eye">No seat</div>'+loose.map(function(x){
  var on=st.lead===x;
  return '<button type="button" class="av-pair'+(on?' av-on':'')+'" data-avpair="'+x.i+'" aria-pressed="'+on+'">'
   +'<span class="av-pair-ic">'+avSvg(AV_IC.person)+'</span>'
   +'<span class="av-pair-t">'+esc(x.pair.be)+'</span>'
   +'<span class="av-pair-pc">'+avPct(x.c)+'</span></button>';}).join('')+'</div>';}

/* ---------------- running, as rows ---------------- */
function avRunHTML(st){
 var R=st.run, out='<section class="av-card av-run"><div class="pm-eye">Running</div>';
 if(!R.rows.length)
  return out+'<p class="av-p">'+(st.r.unread?'Nothing read yet, so no saboteur is running.'
   :'No saboteur is running.')+'</p></section>';
 /* HS sweep. A paragraph here described the list under it: which saboteurs,
    in what order, what the arrow means, and what a press does. The rows are
    ordered, carry their direction word and are buttons, so the list shows all
    four of those things itself. */
 /* the rows above a written word come from the stated type, and say so once */
 if(!R.written)out+='<p class="av-p">'+(R.seed?'From the type you stated, '+esc(R.seed)+'. ':'')
  +'Nothing you wrote is in this yet.</p>';
 out+='<div class="av-runs">';
 R.rows.forEach(function(x){
  var c=x.fam?seatCol(x.fam.b):'var(--dim)', on=AV.trace===x.nm;
  out+='<button type="button" class="av-run-row'+(on?' av-on':'')+'" data-avsab="'+esc(x.nm)+'" aria-pressed="'+on+'" style="--c:'+c+'">'
   +'<span class="av-run-ic"><svg viewBox="0 0 24 24" aria-hidden="true">'+glyphPath(x.fam?x.fam.ic:'')+'</svg></span>'
   +'<span class="av-run-nm">'+esc(x.nm)+'</span>'
   +'<span class="av-run-v">'+x.w.toFixed(1)+'</span>'
   +'<span class="av-run-d av-'+x.dir+'">'+(R.written?x.dir:'')+'</span>'
   +'<span class="av-run-bar"><i style="width:'+Math.min(100,x.w*10).toFixed(0)+'%"></i></span></button>';});
 return out+'</div></section>';}

/* ---------------- rituals, queued and tasked ---------------- */
function avRitHTML(st){
 var out='<section class="av-card av-rit"><div class="pm-eye">Rituals</div>';
 var td=(typeof ritToday==='function')?ritToday():null;
 if(td){var ts=ritSteps(td);
  out+='<p class="av-p av-rit-today">Today: '+esc(ts.map(function(p){return p.nm;}).join(', '))
   +', '+((+td.min)||0)+' minutes. '+(td.done?'Done.':'Not done yet.')+'</p>';}
 if(!st.rit.length)
  return out+'<p class="av-p">Nothing to queue yet.</p></section>';
 if(AV.q===null){AV.q={}; AV.q[st.rit[0].p.k]=true;}
 /* HS sweep. "What each area you are working on calls for... Queue them
    here, then task them" described the rows and the button under them, and
    the empty state above carried a second sentence on how a queue fills. Each
    row names its practice and the area it is for, and the button says Task
    these. */
 out+='<div class="av-rits">';
 var mins=0;
 st.rit.forEach(function(x){
  var on=!!AV.q[x.p.k]; if(on)mins+=x.p.min;
  out+='<button type="button" class="av-rit-row'+(on?' av-on':'')+'" data-avrit="'+x.p.k+'" aria-pressed="'+on+'" style="--c:'
   +(PTRACK[x.track]||GOLD)+'"><span class="av-rit-m"></span><span class="av-rit-t"><b>'+esc(x.p.nm)+'</b><em>for '
   +esc(x.areas.map(function(a){return a.nm;}).join(' and '))+'</em></span><span class="av-rit-n">'+x.p.min+' minutes</span></button>';});
 out+='</div><div class="av-act"><span class="av-rit-sum">'+(mins?mins+' minutes queued':'Nothing queued')+'</span>'
  +'<button type="button" class="btn pri" id="avtask"'+(mins?'':' disabled')+'>Task these</button></div>';
 return out+'</section>';}

/* ---------------- the cycles ----------------
   His, round JP: "you can show your completion, like as you've been running
   your rituals, how often you're doing a cycle. And then you get a tick per
   cycle as well. And I want three cycles, three revolutions per cycle."

   Three rings, one a cycle. Each ring is cut in three, one arc a turn, and an
   arc fills a seventh at a time as days with a ritual done come in, so the
   ring turns the way the seven seats sit, root to crown. A full ring takes the
   tick. DRAWN AND NOT PRINTED AS A FRACTION: the ladder's standing refusal of
   "3 of 14" is about a count against a total inviting a person to finish
   their own nervous system, and his ruling here is a drawn completion, so the
   rings carry it and the only printed figure is the days practised. */
function avCycArc(f,a0,span){
 if(f<=0)return '';
 var r=15, t0=(a0-90)*Math.PI/180, t1=(a0-90+span*Math.min(f,0.9999))*Math.PI/180;
 return 'M'+avP(20+r*Math.cos(t0))+' '+avP(20+r*Math.sin(t0))+' A'+r+' '+r+' 0 '+(span*f>180?1:0)
  +' 1 '+avP(20+r*Math.cos(t1))+' '+avP(20+r*Math.sin(t1));}
var AV_CYCN=['First','Second','Third'];
function avCycHTML(st){
 var C=st.cyc, out='<section class="av-card avc"><div class="pm-eye">Cycles</div><div class="avc-rings">';
 C.cyc.forEach(function(c,i){
  var gap=6, span=120-gap, s='<svg viewBox="0 0 40 40" aria-hidden="true">';
  c.turns.forEach(function(f,t){var a0=t*120+gap/2;
   s+='<path class="avc-trk" d="'+avCycArc(1,a0,span)+'"/>';
   if(f>0)s+='<path class="avc-arc" d="'+avCycArc(f,a0,span)+'"/>';});
  if(c.done)s+='<g transform="translate(10 10) scale(.84)" class="avc-ok">'+AV_OK+'</g>';
  var turns=c.turns.filter(function(f){return f>=1;}).length;
  out+='<div class="avc-one'+(c.done?' avc-done':'')+'" role="img" aria-label="'+AV_CYCN[i]+' cycle, '
   +(c.done?'done':turns+(turns===1?' turn':' turns')+' done')+'">'+s+'</svg>'
   +'<span class="avc-lb">'+AV_CYCN[i]+'</span></div>';});
 out+='</div><div class="avc-fig"><span>Practised</span><b>'+C.days+(C.days===1?' day':' days')+'</b></div>'
  +'<p class="av-p avc-how">Seven days with a ritual done make one turn. Three turns make a cycle.</p>';
 return out+'</section>';}

/* ---------------- the archetype wheel and its scale ----------------
   The merged wheel, round GU mockup D, approved for this page at round GV.
   His later ruling replaced the one press "Rings true" with a line of five:
   "instead of ringing true, change it to a line, but we want to give a scale
   from one to five. People may not see their full potential, they're a
   magician as an example, they may not understand it." A press on a point
   sets it and the same press takes it off, which keeps his GV ruling that
   there is no separate save. */
function avWheel(st){
 var r=st.r, aff=r.aff||[], mx=0; aff.forEach(function(v){if(v>mx)mx=v;});
 var sel=avArchByName(AV.arch)||st.top||(function(){
  if(r.unread||!aff.length)return AV_ROSTER[0];
  var b=0; aff.forEach(function(v,i){if(v>aff[b])b=i;}); return AV_ROSTER[b];})();
 AV.arch=sel.nm;
 var s='<svg class="av-draw" viewBox="0 0 100 100" aria-hidden="true">';
 AV_AREAS.forEach(function(x){
  var a0=(x.a-24)*Math.PI/180, a1=(x.a+24)*Math.PI/180, R=25;
  s+='<path d="M'+avP(50+R*Math.cos(a0))+' '+avP(50+R*Math.sin(a0))+' A'+R+' '+R+' 0 0 1 '
   +avP(50+R*Math.cos(a1))+' '+avP(50+R*Math.sin(a1))+'" class="av-wseat" style="stroke:'+seatCol(x.b)+'"/>';
  var ic=avPos(x.a,25);
  s+='<g transform="translate('+avP(ic[0]-2.4)+' '+avP(ic[1]-2.4)+') scale(.2)" class="av-wic" style="stroke:'
   +seatCol(x.b)+'">'+AV_IC[x.k]+'</g>';});
 s+='</svg>';
 var sh=avArchShare(r), pin=avArchPins(sh);
 var marks=AV_ROSTER.map(function(a){
  var p=avPos(avArchAngle(a),40), rt=st.side.arch[a.nm]||0, on=a===sel;
  var g=(!r.unread&&mx>0)?(aff[a.i]||0)/mx:0, pc=sh?Math.round(sh[a.i]*100):null, pn=pin[a.i];
  return '<button type="button" class="av-mk'+(on?' av-on':'')+(pn?' avs-pinned':'')+'" data-avmk="'+a.nm+'" style="left:'+avP(p[0])+'%;top:'
   +avP(p[1])+'%;--c:'+seatCol(a.b)+';--g:'+g.toFixed(2)+'" aria-pressed="'+on+'" aria-label="'+a.nm
   +(pc!=null?', '+pc+' percent of your reading':'')+(pn?', pinned':'')+(rt?', set at '+rt:', not set')+'"'
   /* the denominator rides in the tooltip, V17: the figure is one number and
      what it is out of is said once, where a person who asks will find it */
   +(pc!=null?' title="'+pc+' percent of the archetype reading from your domains'+(pn?', pinned':'')+'"':'')
   +'><span class="av-mk-ic">'+avArchIc(a)
   +(rt?'<span class="av-mk-pill">'+rt+'</span>':'')
   +(pn?'<span class="avs-pin" aria-hidden="true">'+avSvg(AV_PIN)+'</span>':'')
   +'</span><span class="av-mk-nm">'+a.nm+(pc?'<em class="avs-mpc">'+pc+'%</em>':'')+'</span></button>';}).join('');
 /* ON A PHONE THE SHARES LEAVE THE RING. Twelve marks on a ring 360 wide have
    no room for a thirteenth thing each, measured at 390 three ways: under the
    name it made each nameplate a line taller, beside the name a word wider,
    and as a badge on the ring it sat on the neighbour's name, and every one
    put a label over another where the page as it was had none. So on a phone
    the ring keeps the names and the twelve shares sit in one row under it,
    heaviest first, the pinned ones marked. On a desktop the share stays under
    its name, which measured clean at 1600. */
 var row=sh?AV_ROSTER.slice().sort(function(x,y){return sh[y.i]-sh[x.i];}).map(function(a){
  return '<span class="avs-ar'+(pin[a.i]?' avs-ar-pin':'')+'" style="--c:'+seatCol(a.b)+'">'
   +(pin[a.i]?avSvg(AV_PIN):'')+esc(a.nm)+' <b>'+Math.round(sh[a.i]*100)+'%</b></span>';}).join(''):'';
 var core='<div class="av-wcore" style="--c:'+seatCol(sel.b)+'">'+avArchIc(sel,'av-core-ic')
  +'<span class="av-wcore-nm">'+esc(sel.nm)+'</span><span class="av-core-lb">'+esc(AV_OF[sel.b].nm)+'</span></div>';
 return {html:'<div class="avs-wcol"><div class="av-wheel">'+s+core+marks+'</div>'
  +(row?'<div class="avs-arow">'+row+'</div>':'')+'</div>', sel:sel};}
function avDetail(st,a){
 var rt=st.side.arch[a.nm]||0, A=AV_OF[a.b], sab=a.sab?avSabNamed(a.sab,st.run):null;
 var out='<div class="av-card av-det" style="--c:'+seatCol(a.b)+'">'
  +'<div class="av-ph"><span class="av-pic">'+avArchIc(a)+'</span><div>'
  +'<p class="av-det-e"><b>'+A.nm+'</b>, '+AV_THE[a.b]+'</p><div class="av-pn">'+esc(a.nm)+'</div></div></div>'
  +'<p class="av-def">'+esc(AV_DEF[a.nm]||'')+'</p>';
 if(a.sab)
  out+='<div class="av-imp" style="--s:'+seatCol(a.sabB)+'"><div class="pm-eye">Impact</div>'
   +'<p class="av-imp-v"><b>'+esc(a.sab)+'</b><span>primary saboteur, at '+AV_THE[a.sabB]+'</span></p>'
   +'<p class="av-imp-c">'+esc(AV_IMPACT[a.sab]||'')+'</p>'
   /* the same rule as the Running card: no direction claimed before a word
      is written, and a seeded weight says where it came from */
   +(sab?'<p class="av-imp-r">Running at a weight of '+sab.w.toFixed(1)
    +(st.run.written?', <span class="av-'+sab.dir+'">'+sab.dir+'</span>.'
     :(st.run.seed?', from the type you stated.':'.'))+'</p>':'')
   +'</div>';
 out+='<div class="av-pl" id="avsclab">How much of this is you</div>'
  +'<div class="av-scale" role="radiogroup" aria-labelledby="avsclab"><span class="av-sl"><i style="width:'
  +(rt?((rt-1)/4*100).toFixed(0):0)+'%"></i></span>'
  +AV_SCALE.map(function(n){
   return '<button type="button" class="av-st'+(n<=rt?' av-on':'')+(n===rt?' av-at':'')+'" role="radio" aria-checked="'+(n===rt)
    +'" data-avst="'+n+'">'+n+'</button>';}).join('')+'</div>'
  +'<div class="av-ends"><span>Hardly</span><span>Fully</span></div>'
  +'<p class="av-hint">One press sets it. The same press again takes it off.</p>'
  +(function(t){return t?'<p class="av-cmp">'+t+'</p>':'';})(avCompare(a,rt,st.r))+'</div>';
 return out;}

/* ---------------- the intake questions, as situations ----------------
   His, round JP: "with the laws of integrity questions, we want to ask them
   moral questions. You see a beggar on the street, do you walk over them or
   give them money? You see two kids fighting, do you choose sides or break it
   up? We kind of want to mix it up so that we can pin down where a person is."

   THE FORMAT. A situation is one framing of one law, answered by picking what
   you would do. Each choice carries the value it writes, on the same eleven
   point scale the framing is answered on, into the same slot of
   CURP.intake.answers. So iqScore, iqApply and CQ read a situation exactly as
   they read the number it replaces, and the list below it shows the framing
   as answered. Nothing downstream learns a second shape.

   Both are his two examples and both are the left framing, "when it costs you
   something", because each costs the person something to do right: the money,
   and walking into somebody else's fight. Which law each belongs to is ours
   and is the first thing to overrule: the man asking for money is Generosity,
   "give without a ledger"; the fight is Non-Harm, "take the option that costs
   others least", which is what separates breaking it up from taking a side.

   THIS IS A SECOND WRITER OF INTAKE ANSWERS, and that is a real cost, named
   rather than hidden. intakeui.js is the writer of this record's answers and
   another seat holds that file this round. The write below is its write, step
   for step: lawAnswered when the value changes, the answer, startedAt,
   iqApply, pSave, syncLw. The two must move together until the situations
   live in engine/intake.js beside Q3 and intakeui.js renders them, which is
   the follow-up this block exists to make obvious. Sixty one framings are
   still numbers. */
var AV_DILEMMA=[
 {law:'Generosity', side:'left',
  q:'A man outside the shop asks you for money. You have cash in your pocket.',
  opts:[{t:'You give him some',v:10},{t:'You say sorry and keep walking',v:3},{t:'You walk past like he is not there',v:0}]},
 {law:'Non-Harm', side:'left',
  q:'Two kids are fighting in the park, and one of them is getting hurt.',
  opts:[{t:'You go over and break it up',v:10},{t:'You pick the side you think is right',v:3},{t:'You keep walking',v:0}]}];
function avDilIdx(d){
 var li=-1; SI.forEach(function(l,i){if(l.nm===d.law)li=i;});
 var ti=-1; Q3.forEach(function(t,i){if(t.k===d.side)ti=i;});
 return (li<0||ti<0)?-1:li*3+ti;}
function avDilHTML(){
 var A=(CURP&&CURP.intake&&CURP.intake.answers)||[];
 var out='<section class="av-card avd"><div class="pm-eye">Situations</div>';
 AV_DILEMMA.forEach(function(d,j){
  var idx=avDilIdx(d); if(idx<0)return;
  var law=SI[Math.floor(idx/3)], v=A[idx];
  out+='<div class="avd-one" style="--c:'+seatCol(law.b)+'"><p class="avd-q">'+esc(d.q)+'</p>'
   +'<div class="avd-opts" role="group" aria-label="'+esc(d.q)+'">'+d.opts.map(function(o){
    var on=v===o.v;
    return '<button type="button" class="btn avd-o'+(on?' av-on':'')+'" aria-pressed="'+on+'" data-avdil="'+j+'" data-avdv="'+o.v+'">'
     +esc(o.t)+'</button>';}).join('')+'</div>'
   +'<p class="avd-law">'+esc(law.nm)+'</p></div>';});
 return out+'</section>';}

/* ---------------- the three subtabs ----------------
   His, round JP: "I want the becoming on its own subtab. I want the archetypes
   to be on its own subtab. And I want the intake questions to be on its own
   subtab. So if I click on avatar, there'll be three subnavigations. That way
   it's not infinite scrolling and we can control the size of these things."

   The intake questions are drawn by intakeui.js into #iqbody, which sits under
   this host in the same tab. That file is another seat's this round, so this
   one does not draw them: it only shows or hides their host, by the hidden
   attribute, which intakeui never writes (it writes the host's innerHTML).
   Becoming is the default because it is the first thing he named. */
var AV_SUBS=[['becoming','Becoming'],['arch','Archetypes'],['intake','Intake questions']];
function avSub(k){
 if(!AV_SUBS.some(function(s){return s[0]===k;}))return;
 AV.sub=k; renderAvatar();}
function avShowIntake(){
 var iq=document.getElementById('iqbody'); if(!iq)return;
 iq.hidden=AV.sub!=='intake';}
/* FOUR DOORS IN OTHER FILES OPEN THIS TAB TO ANSWER A QUESTION OR TYPE A BIRTH
   DATE: the account sheet's #acgoiq, the worked example's #spgo, the root
   summary's .rs-go and Summary's data-sout="iq". Each calls setTab and, two of
   them, focuses #wdate on the next frame. With Becoming the default they would
   land a person on the seats and focus a field that is hidden, which a browser
   refuses without a word. Those files are other seats' this round, so the
   press is caught here on the way down, before their own handler runs, and the
   subtab is set first. The honest version is those four calling
   avSub('intake') themselves, and that is a named follow-up. */
function avDoors(){
 if(AV.doors)return; AV.doors=true;
 document.addEventListener('click',function(e){
  var t=e.target&&e.target.closest&&e.target.closest('#acgoiq,#spgo,.rs-go,[data-sout="iq"]');
  if(t)AV.sub='intake';},true);}

/* ---------------- the look of round JP ----------------
   THESE RULES BELONG IN shell/head.html BESIDE THE REST OF .av, and are here
   only because that file is another seat's this round. They are read off the
   same tokens, so the four lightings and Punch carry them, and they are
   written once into the head on the first render. Moving them across is a
   named follow-up, and nothing here depends on where they sit.

   THE HERO IS BIGGER AND THE PANEL SMALLER, his words: "the hero graphic is
   too small, and the information area is too big. So give more credence to
   the graphic." The ring took at most 440 of a grid that gave the panel the
   rest; it now takes three fifths and the panel two, and the ring may grow to
   620. The archetype wheel gets the same. */
var AV_CSS=[
 '#avbody .av-hero{grid-template-columns:minmax(0,3fr) minmax(280px,2fr);gap:22px}',
 '#avbody .av-ring,#avbody .av-wheel{max-width:620px}',
 '#avbody .av-archg{grid-template-columns:minmax(0,3fr) minmax(280px,2fr)}',
 '#avbody .av-panel .av-pn{font-size:18px}',
 '.avs-top{align-items:center;margin-bottom:2px}',
 '.avs-subs{display:flex;flex-wrap:wrap;gap:4px;padding:4px;border-radius:999px;background:var(--sunk);border:1px solid var(--edge)}',
 '.avs-sb{min-height:var(--tap);padding:0 18px;border-radius:999px;border:1px solid transparent;background:none;color:var(--mid);font:inherit;font-size:15px;cursor:pointer}',
 '.avs-sb:hover{color:var(--ink)}',
 '.avs-sb.av-on{background:var(--panel-2);border-color:var(--edge-2);color:var(--ink)}',
 'body.punch .avs-subs,body.punch .avs-sb.av-on{border-color:transparent}',
 '.avs-list{display:flex;flex-direction:column;gap:8px}',
 '.avs-row{background:var(--panel-2);border:1px solid var(--edge);border-left:3px solid var(--c);border-radius:var(--r);min-width:0}',
 'body.punch .avs-row{border-color:transparent;border-left-color:var(--c)}',
 '.avs-row.avs-open{background:color-mix(in srgb,var(--c) 6%,var(--panel-2))}',
 '.avs-hd{display:flex;align-items:center;gap:14px;width:100%;min-height:68px;padding:10px 16px;background:none;border:0;color:inherit;text-align:left;cursor:pointer;font:inherit;border-radius:var(--r)}',
 '.avs-ic{position:relative;flex:0 0 auto;width:48px;height:48px;border-radius:50%;border:1.5px solid var(--c);display:flex;align-items:center;justify-content:center;color:var(--c)}',
 '.avs-ic>svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}',
 '.avs-tick{position:absolute;right:-5px;bottom:-5px;width:20px;height:20px;border-radius:50%;background:var(--panel);border:1.5px solid var(--c);display:flex;align-items:center;justify-content:center;color:var(--c)}',
 '.avs-tick svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}',
 '.av-sat .avs-tick{top:-3px;right:-3px;bottom:auto}',
 '.av-sat .avs-tick svg{width:12px;height:12px}',
 '.avs-t{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}',
 '.avs-nm{font-size:18px;font-weight:600;color:var(--ink);line-height:1.25}',
 '.avs-nm em{font-style:normal;font-size:13px;font-weight:400;color:var(--dim);margin-left:8px}',
 '.avs-ab{font-size:14px;color:var(--mid);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
 '.avs-live{flex:0 0 auto;font-size:13px;color:var(--c);border:1px solid var(--c);border-radius:999px;padding:3px 10px}',
 '.avs-pc{flex:0 0 auto;font-family:var(--num);font-size:15px;color:var(--mid)}',
 '.avs-chev{flex:0 0 auto;color:var(--dim);display:flex}',
 '.avs-chev svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:transform var(--t-element) var(--ease-out)}',
 '.avs-open .avs-chev svg{transform:rotate(180deg)}',
 '.avs-body{display:grid;grid-template-columns:minmax(180px,250px) minmax(0,1fr);gap:22px;padding:4px 18px 18px 78px}',
 '.avs-story{font-size:14px;line-height:1.65;color:var(--dim);margin:0;max-width:60ch}',
 '.av-panel .avs-story{margin:0 0 12px}',
 '.avs-main{min-width:0}',
 '.avs-ask{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 14px;padding:10px 12px 10px 14px;border-radius:var(--r-s);background:var(--sunk);border-left:2px solid var(--c)}',
 '.avs-ask-ic{flex:0 0 auto;color:var(--c);display:flex}',
 '.avs-ask-ic svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
 '.avs-q{flex:1 1 240px;margin:0;font-size:16px;line-height:1.5;color:var(--ink)}',
 '.avs-cyc{flex:0 0 auto}',
 '.avs-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start}',
 '.avs-col{min-width:0;display:flex;flex-direction:column}',
 '.avs-lab{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin:0 0 6px}',
 '.avs-lab b{font-size:15px;font-weight:600;color:var(--ink)}',
 '.avs-lab span{font-size:13px;color:var(--dim)}',
 /* the journal's own editor, shorter, and wearing the seat: "if I click on
    orange the box turns orange". The border is width one on both layers, as
    the journal's rule requires, and only its colour moves. */
 '.avs-ed,.avs-ed .st-ta,.avs-ed .st-hl{min-height:118px}',
 '.avs-ed .st-ta,.avs-ed .st-hl{padding:12px 14px}',
 '.avs-ed .st-hl{border-color:color-mix(in srgb,var(--c) 55%,transparent)}',
 '.avs-ed:focus-within .st-hl{border-color:var(--c)}',
 '.avs-ed .st-ta:focus{border-color:transparent}',
 'body.punch .avs-ed .st-hl{border-color:transparent;box-shadow:inset 3px 0 0 var(--c)}',
 /* the panel beside the wheel is two fifths of the row, too narrow for two
    boxes side by side, so there they stack */
 '.av-panel .avs-two{grid-template-columns:1fr}',
 '.avs-col .av-live{margin-top:8px}',
 '.avs-col .av-live .av-p{font-size:14px;margin:0 0 4px}',
 '.avs-said{font-size:16px;line-height:1.6;color:var(--ink);margin:0;padding:12px 14px;border-radius:var(--r-s);background:var(--sunk);border:1px solid color-mix(in srgb,var(--c) 40%,transparent)}',
 'body.punch .avs-said{border-color:transparent}',
 '.avs-rule{margin-top:14px;padding:12px 14px;border-radius:var(--r-s);background:var(--sunk)}',
 '.avs-rp{font-size:15px;color:var(--mid);margin:0 0 10px}',
 '.avs-rp b{color:var(--ink);font-weight:600}',
 '.avs-spans{display:flex;flex-wrap:wrap;gap:8px}',
 '.avs-rh{display:flex;align-items:baseline;justify-content:space-between;gap:10px}',
 '.avs-rk{font-size:15px;color:var(--ink)}',
 '.avs-dn{font-family:var(--num);font-size:15px;color:var(--c)}',
 '.avs-days{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0 12px}',
 '.avs-d{width:16px;height:16px;border-radius:4px;border:1.5px solid var(--edge-2)}',
 '.avs-d.avs-y{background:var(--c);border-color:var(--c)}',
 '.avs-d.avs-now{border-color:var(--ink)}',
 '.avs-say{font-size:16px;color:var(--ink);margin:0 0 10px}',
 '.avs-ok{font-size:15px;color:var(--c)}',
 '.av-mk .avs-pin{position:absolute;left:-6px;top:-6px;width:20px;height:20px;border-radius:50%;background:var(--panel);border:1.5px solid var(--c);display:flex;align-items:center;justify-content:center;color:var(--c)}',
 '.av-mk .avs-pin svg{width:11px;height:11px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
 '.avs-mpc{display:block;font-style:normal;font-family:var(--num);font-size:12px;color:var(--c);margin-top:1px}',
 '.avs-wcol{min-width:0;display:flex;flex-direction:column;align-items:center;gap:14px}',
 '.avs-wcol .av-wheel{width:100%}',
 '.avs-arow{display:none;flex-wrap:wrap;gap:6px;justify-content:center}',
 '.avs-ar{display:inline-flex;align-items:center;gap:5px;font-size:13px;color:var(--mid);padding:5px 10px;border-radius:999px;border:1px solid var(--edge-2)}',
 '.avs-ar b{font-family:var(--num);font-weight:500;color:var(--c)}',
 '.avs-ar-pin{border-color:var(--c);color:var(--ink)}',
 '.avs-ar svg{width:12px;height:12px;fill:none;stroke:var(--c);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
 '.avc-rings{display:flex;gap:16px;flex-wrap:wrap;margin:4px 0 10px}',
 '.avc-one{display:flex;flex-direction:column;align-items:center;gap:4px}',
 '.avc-one svg{width:76px;height:76px}',
 '.avc-trk{fill:none;stroke:var(--edge-2);stroke-width:4.2;stroke-linecap:round}',
 '.avc-arc{fill:none;stroke:var(--gold);stroke-width:4.2;stroke-linecap:round}',
 '.avc-ok{fill:none;stroke:var(--gold);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}',
 '.avc-lb{font-size:12px;color:var(--dim)}',
 '.avc-fig{display:flex;align-items:baseline;gap:10px;margin:0 0 6px}',
 '.avc-fig span{font-size:13px;color:var(--dim)}',
 '.avc-fig b{font-family:var(--num);font-size:22px;font-weight:500;color:var(--ink)}',
 '.avc-how{font-size:14px;margin:0}',
 '.avd{display:flex;flex-direction:column;gap:14px}',
 '.avd-one{padding:14px 16px;border-radius:var(--r-s);background:var(--sunk);border-left:3px solid var(--c)}',
 '.avd-q{font-size:17px;line-height:1.5;color:var(--ink);margin:0 0 12px}',
 '.avd-opts{display:flex;flex-wrap:wrap;gap:8px}',
 '.avd-o.av-on{border-color:var(--c);color:var(--ink);background:color-mix(in srgb,var(--c) 14%,var(--panel-2))}',
 '.avd-law{font-size:12px;color:var(--dim);margin:10px 0 0}',
 '@media (max-width:900px){.avs-body{grid-template-columns:1fr;padding:0 14px 16px;gap:12px}',
 ' #avbody .av-hero,#avbody .av-archg{grid-template-columns:1fr}}',
 '@media (max-width:600px){.avs-two{grid-template-columns:1fr}.avs-hd{padding:10px 12px;gap:12px}',
 ' .avs-sb{padding:0 12px;font-size:14px}.avs-subs{width:100%;justify-content:space-between}',
 ' .avs-ab{white-space:normal}',
 ' .av-mk .avs-mpc{display:none}.avs-arow{display:flex}}',
 '@media (prefers-reduced-motion:reduce){.avs-chev svg{transition:none}}'].join('\n');
function avCss(){
 if(document.getElementById('avs-css'))return;
 var s=document.createElement('style'); s.id='avs-css'; s.textContent=AV_CSS;
 document.head.appendChild(s);}

/* ---------------- the surface ---------------- */
function avHead(st){
 var h='<header class="av-hd avs-top"><div class="avs-subs" role="group" aria-label="Avatar">'
  +AV_SUBS.map(function(s){var on=AV.sub===s[0];
   return '<button type="button" class="avs-sb'+(on?' av-on':'')+'" aria-pressed="'+on+'" data-avsub="'+s[0]+'">'+s[1]+'</button>';}).join('')
  +'</div></header>';
 if(AV.sub!=='becoming')return h;
 var wheel=AV.view==='wheel', lead=st.lead, g=lead&&lead.gap;
 /* no eyebrow: the pressed subtab directly above already says Becoming */
 h+='<div class="av-hd"><div class="av-hd-t">'
  +(wheel&&lead?'<h2 class="av-h">'+esc(lead.pair.be)+'</h2>'
    +(g?'<p class="av-hs">'+(g.clear?'Clear at '+AV_THE[g.seat]+'.'
      :'Held at '+AV_THE[g.seat]+', at a weight of '+g.load.toFixed(1)+'.')+'</p>':'')
   :'<h2 class="av-h">Who do you want to be?</h2>')
  +'</div><button type="button" class="btn av-jump" id="avview" aria-pressed="'+wheel+'">'
  +(wheel?'Seats':'Full avatar')+'</button></div>';
 return h;}
function renderAvatar(){
 var host=document.getElementById('avbody'); if(!host)return;
 if(typeof iqEnsure==='function')iqEnsure();
 avCss(); avDoors();
 /* a selection, a queue and a half typed pair belong to one person. Moving to
    another profile starts them over rather than carrying one person's draft
    onto somebody else's avatar. */
 var who=S.who+'|'+(CURP&&CURP.id);
 if(AV.who!==who){AV.who=who; AV.sel=null; AV.area=null; AV.arch=null; AV.trace=null; AV.q=null;
  AV.open=undefined; AV.ask={}; AV.drafts={}; AV.edit=null;}
 if(!AV.sub)AV.sub='becoming';
 var st=avState(), h='<div class="av">'+avHead(st);
 if(AV.sub==='becoming'){
  if(AV.view==='wheel'){
   h+='<div class="av-hero">'+avRing(st)+'<div class="av-side">'+avPanel(st)+avPairs(st)+'</div></div>';
   h+='<div class="av-row2">'+avCycHTML(st)+avRitHTML(st)+'</div>'+avRunHTML(st);}
  else h+=avSeats(st);}
 else if(AV.sub==='arch'){
  var W2=avWheel(st);
  /* THE PARAGRAPH EXPLAINING WHAT THIS SECTION IS, AND HOW TO USE THE SCALE,
     IS GONE. Round HS, his own words, quoting this exact line back: "you have
     this text again, where it says archetypes, 12 ways of acting, each
     besides the part, holy shit, I told you I don't want text like that
     anymore." The scale's own end labels and each archetype's own detail
     panel already say how the press works; nothing here needs a paragraph
     to explain itself first. */
  h+='<section class="av-arch"><div class="av-row2 av-archg">'+W2.html+avDetail(st,W2.sel)+'</div></section>';}
 else h+=avDilHTML();
 host.innerHTML=h+'</div>';
 avShowIntake();
 AV.sig=avSig();
 avBind(host,st);}
/* repaint only when something the page reads has moved. renderIntake calls
   this on every press of its own, and a press on a law must not throw away a
   half typed pair. A ritual marked done moves the cycles without changing how
   many rituals there are, so the done count is read as well as the length. */
function avSig(){
 var s=0; CHARGES.forEach(function(c){s+=(S.charge[c]||0)+(S.replace[c]||0)*0.001;});
 var p=CURP||{}, e=(p.story&&p.story.entries)||[], av=(p.avatar&&p.avatar.pairs)||[];
 var R=p.rituals||[], dn=R.filter(function(x){return x&&x.done;}).length;
 /* answers is keyed by index and is not always an array, so it is read whole */
 var ans=JSON.stringify((p.intake&&p.intake.answers)||{});
 return [S.who, p.id, e.length, av.length, R.length, dn, s.toFixed(4), S.theme, ans].join('|');}
function avRefresh(){
 var host=document.getElementById('avbody');
 if(host&&(!host.firstChild||AV.sig!==avSig()))renderAvatar();
 else avShowIntake();}

/* A RELEASE RUNS IN ITS OWN CARD OVER THE PAGE, and relCoolDown repaints the
   Field and not this. So the page watches the run it started and repaints once
   the writes have landed, which is when the percent and the direction move.
   A run started from a rule ticks that rule's day when it ran to its end.
   relCoolDown sets the phase to done both when the run finishes and when Stop
   is pressed, and only Stop sets halted, so a halted run ticks nothing; a
   card closed early goes back to idle and ticks nothing either. */
function avWatch(fromRule){
 clearInterval(AV.watch); AV.ruleRun=fromRule||null;
 AV.watch=setInterval(function(){
  if(RUN.open&&RUN.phase!=='done')return;
  clearInterval(AV.watch); AV.watch=null;
  if(AV.ruleRun&&RUN.phase==='done'&&!RUN.halted)avRuleTick(AV.ruleRun,true);
  AV.ruleRun=null;
  if(typeof S!=='undefined'&&S.tab===TAB.INTAKE)renderAvatar();},400);}

function avBind(host,st){
 var b;
 var on=function(sel,fn){host.querySelectorAll(sel).forEach(function(el){el.onclick=function(){fn(el);};});};
 on('[data-avsub]',function(el){avSub(el.dataset.avsub);});
 on('[data-avsat]',function(el){
  var k=el.dataset.avsat, A=st.areas[k];
  AV.area=k; AV.sel=null; AV.edit=null;
  if(A.rows.length){
   var pick=A.rows.slice().sort(function(a,b2){return (a.c||0)-(b2.c||0);})[0];
   AV.sel=pick.i; AV.area=null;}
  renderAvatar();});
 on('[data-avpair]',function(el){AV.sel=+el.dataset.avpair; AV.area=null; AV.edit=null; renderAvatar();});
 on('[data-avsab]',function(el){AV.trace=(AV.trace===el.dataset.avsab)?null:el.dataset.avsab; renderAvatar();});
 on('[data-avrit]',function(el){AV.q[el.dataset.avrit]=!AV.q[el.dataset.avrit]; renderAvatar();});
 on('[data-avmk]',function(el){AV.arch=el.dataset.avmk; renderAvatar();});
 on('[data-avst]',function(el){avRate(+el.dataset.avst);});
 on('[data-avopen]',function(el){var bb=el.dataset.avopen;
  AV.open=(avOpenSeat(st)===bb)?null:bb; AV.edit=null; renderAvatar();
  /* the row that opened is brought into view, and only the row: the page
     does not jump anywhere a person did not press */
  var r=host.querySelector('[data-avrow="'+bb+'"]'); if(AV.open&&r&&r.scrollIntoView)r.scrollIntoView({block:'nearest'});});
 /* the prompt turns in place, so nothing typed is redrawn under the caret */
 on('[data-avcyc]',function(el){var bb=el.dataset.avcyc, n=AV_ASK[bb].ask.length;
  AV.ask[bb]=((AV.ask[bb]||0)+1)%n;
  var q=host.querySelector('[data-avq="'+bb+'"]'); if(q)q.textContent=AV_ASK[bb].ask[AV.ask[bb]];});
 on('[data-avcancel]',function(el){AV.edit=null; AV.drafts[el.dataset.avcancel]={be:'',notbe:''}; renderAvatar();});
 on('[data-avedit]',function(el){var i=+el.dataset.avedit, x=st.rows[i]; if(!x)return;
  var bb=avSeatOf(x)||BANDS[0];
  AV.edit=i; AV.drafts[bb]={be:x.pair.be, notbe:x.pair.notbe};
  if(AV.view!=='wheel')AV.open=bb; renderAvatar();});
 on('[data-avtake]',function(el){avTake(+el.dataset.avtake);});
 on('[data-avrule]',function(el){avRuleSet(el.dataset.avfor,+el.dataset.avrule,st);});
 on('[data-avstop]',function(el){avRuleStop(el.dataset.avstop);});
 on('[data-avdo]',function(el){var bb=el.dataset.avdo, R=st.side.rule[bb]; if(!R)return;
  if(R.k==='say'){avRuleTick(bb,false); return;}
  var x=st.bySeat[bb]; if(!x||!x.gap)return;
  var q=avQueue(x.gap.seat); if(!q.length)return;
  relPick(q.map(function(n){return n.i;})); avWatch(bb);});
 on('[data-avdil]',function(el){avDilemma(+el.dataset.avdil,+el.dataset.avdv);});
 /* the boxes. The lit layer takes the text at once, because the textarea's
    own text is transparent and a layer that lagged would be a box that ate
    keystrokes. The reading under it waits for a pause, as the journal's does. */
 /* A BOX GROWS WITH WHAT IS IN IT. The lit layer behind is inset to the
    editor, so a textarea that scrolled inside a fixed height left the layer's
    last line hanging below the border, measured in the panel at 1600, where
    the release line took four lines in a box sized for three. */
 var grow=function(el){el.style.height='auto'; el.style.height=el.scrollHeight+'px';};
 host.querySelectorAll('[data-avf]').forEach(function(el){
  grow(el);
  el.oninput=function(){
   grow(el);
   var bb=el.dataset.avs, k=el.dataset.avf, d=avDraft(bb), form=el.closest('[data-avform]');
   d[k]=el.value;
   var hl=el.parentNode.querySelector('.st-hl'); if(hl)hl.textContent=el.value+'\n';
   var sub=form&&form.querySelector('[data-avadd]');
   if(sub)sub.disabled=!(d.be.trim()&&d.notbe.trim());
   /* one timer a box: a shared one let typing in the second box cancel the
      first box's reading, measured, and its words stayed unlit */
   AV.liveT=AV.liveT||{}; var tk=bb+'|'+k;
   clearTimeout(AV.liveT[tk]); AV.liveT[tk]=setTimeout(function(){
    if(hl)hl.innerHTML=avHL(el.value)+'\n';
    if(!form)return;
    var lr=form.querySelector('[data-avlive="notbe"]'), lb=form.querySelector('[data-avlive="be"]');
    if(lr)lr.innerHTML=avLive(avHeard(d.notbe),d);
    if(lb)lb.innerHTML=avLiveBe(d.notbe);},200);};
  el.onscroll=function(){var hl=el.parentNode.querySelector('.st-hl'); if(hl)hl.scrollTop=el.scrollTop;};});
 on('[data-avadd]',function(el){avSeatAdd(el.dataset.avadd);});
 if((b=document.getElementById('avview')))b.onclick=function(){
  AV.view=AV.view==='wheel'?'seats':'wheel'; AV.edit=null; renderAvatar();};
 if((b=document.getElementById('avrel')))b.onclick=function(){
  var x=st.lead; if(!x||!x.gap)return;
  var q=avQueue(x.gap.seat); if(!q.length)return;
  relPick(q.map(function(n){return n.i;})); avWatch();};
 if((b=document.getElementById('avtask')))b.onclick=function(){
  var keys=Object.keys(AV.q||{}).filter(function(k){return AV.q[k];}); if(!keys.length)return;
  /* the shipped builder is the one writer of a ritual. It opens with this
     queue in it and asks the when and the where before it saves. */
  ritOpen(); RIT.sel={}; keys.forEach(function(k){RIT.sel[k]=true;}); RIT.all=true; ritRender();};}

/* ---------------- the writes ----------------
   Each one says what happened through status(), and none of them claims a
   save it did not get. A pair goes into the record, so a refused save takes
   it back out. */
/* ADD OR CHANGE A SEAT'S STORY, and then hand the release line to the
   sniffer. His words: "you could submit that to your avatar ... The sniffer
   then snips that out, adds that to your story cloud ... it's going to start
   looking for those patterns."

   Two writes, in order. The pair first, into the record, and a refused save
   takes it back out and stops, so nothing is sent to the journal on the back
   of a pair that was never kept. Then the journal, by the Story page's own
   commit, storyui.js at the Commit button, step for step: undoPush before the
   field moves, applyStory, verpApply, leanApply, saveYou so the charge
   reaches the mirror, an entry in exactly the four keys the boundary allows,
   pSave and pSnap. A second copy of a commit sequence is a cost and it is
   named: the Story page and this must move together until the sequence is
   one function both call, which is a follow-up in a file another seat holds.
   A line the sniffer reads nothing in goes to no journal, because an entry of
   no imprints is a line that moved nothing, and the status says so. An edit
   that leaves the release line as it was sends nothing twice. */
function avSeatAdd(b){
 var d=avDraft(b), pr={be:d.be.trim(), notbe:d.notbe.trim(), seat:b};
 if(!avatarValid(pr))return;
 if(!avOwn()){status('Nothing saved on a worked example.','fail');return;}
 var av=CURP.avatar=CURP.avatar||avatarBlank(), was={built:av.built, at:av.at};
 var P=av.pairs, rows=avRows(), ed=(AV.edit!=null&&rows[AV.edit])?rows[AV.edit]:null;
 var at=ed?P.indexOf(ed.pair):-1, old=at>=0?P[at]:null;
 if(old)P[at]=pr; else P.push(pr);
 av.built=true; if(!av.at)av.at=new Date().toISOString();
 pSave();
 if(!statusSaved()){
  if(old)P[at]=old; else P.pop();
  av.built=was.built; av.at=was.at; return;}
 var send=!old||old.notbe!==pr.notbe, p=parseStory(pr.notbe), k=p.imprints.length, msg;
 if(send&&k&&S.who===0){
  undoPush('adding a story to your avatar');
  applyStory(pr.notbe); verpApply(pr.notbe); leanApply(pr.notbe);
  saveYou();
  CURP.story=CURP.story||{entries:[]};
  CURP.story.entries.push({t:new Date().toISOString(), text:pr.notbe, imprints:k, bands:p.bands});
  pSave(); pSnap();
  var sv=(typeof saveState==='function')?saveState():{ok:true};
  msg=sv.ok?(old?'Changed. ':'Added. ')+k+(k===1?' imprint':' imprints')+' written to the field.'
   :'The story is kept, and the journal entry was not saved. Storage is full or blocked.';
  if(!sv.ok){status(msg,'fail');}
  else status(msg);
  if(typeof syncCh==='function')syncCh();
  if(typeof render==='function')render();}
 else status((old?'Changed.':'Added.')+(send&&!k?' Nothing read yet, so nothing went to the field.':''));
 /* THE STARTING WEIGHT IS READ AFTER THE STORY HAS LANDED. It was read before
    the journal commit on the first cut, and measured on 27 September both
    stories kept a starting weight of 0: the charge the story itself carries
    was not on the field yet, so avClosure read nothing to have gone and the
    percent would have sat at nothing done for ever. The weight a pair is
    measured from is the weight with that story in it. An edited pair is a new
    story and starts again from the weight now. */
 compute();
 var rows2=avRows(), idx=old?at:rows2.length-1, row=rows2[idx];
 var kept=avSideWrite(function(e){
  if(old)delete e.load0[avKey(old)];
  if(row&&row.gap)e.load0[avKey(pr)]=row.gap.load;});
 if(!kept&&row&&row.gap)status('Saved. The starting weight was not kept, so this one reads from nothing done.','fail');
 AV.drafts[b]={be:'',notbe:''}; AV.edit=null; AV.sel=idx; AV.area=null; AV.q=null; AV.open=b;
 renderAvatar();}
function avTake(i){
 var rows=avRows(), x=(i!=null&&rows[i])?rows[i]:null;
 if(!x){var s2=avState(); x=s2.lead;}
 if(!x)return;
 if(!avOwn()){status('Nothing saved on a worked example.','fail');return;}
 var P=CURP.avatar.pairs, j=P.indexOf(x.pair); if(j<0)return;
 var b=avSeatOf(x);
 P.splice(j,1); pSave();
 if(!statusSaved()){P.splice(j,0,x.pair); return;}
 /* the rule goes with the last story at its seat, because a rule is a
    commitment to a story and there is no story left to keep it for */
 var left=avRows().some(function(y){return avSeatOf(y)===b;});
 avSideWrite(function(e){delete e.load0[avKey(x.pair)]; if(b&&!left)delete e.rule[b];});
 AV.sel=null; AV.area=null; AV.q=null; AV.edit=null; renderAvatar();}
function avRuleSet(b,days,st){
 if(!avOwn()){status('Nothing saved on a worked example.','fail');return;}
 var x=st.bySeat[b]; if(!x||!x.gap||AV_SPAN_D.indexOf(days)<0)return;
 var k=(!x.gap.clear&&avQueue(x.gap.seat).length)?'release':'say';
 var ok=avSideWrite(function(e){e.rule[b]={k:k, days:days, from:new Date().toISOString(), done:[]};});
 if(!ok){status('Not saved. Storage is full or blocked, so this session will not survive a reload.','fail');return;}
 status('Set. '+(k==='release'?'One release':'Your line, out loud,')+' a day for '
  +(days===1?'one day.':days===7?'a week.':'two weeks.'));
 renderAvatar();}
function avRuleStop(b){
 if(!avOwn()){status('Nothing saved on a worked example.','fail');return;}
 var ok=avSideWrite(function(e){delete e.rule[b];});
 if(!ok){status('Not saved. Storage is full or blocked, so this session will not survive a reload.','fail');return;}
 status('Stopped.'); renderAvatar();}
/* today's day, on the person's say so for a line said out loud, and on a
   finished run for a release */
function avRuleTick(b,quiet){
 if(!avOwn())return;
 var today=pracDay(Date.now());
 var ok=avSideWrite(function(e){var r=e.rule[b]; if(!r)return;
  r.done=Array.isArray(r.done)?r.done:[]; if(r.done.indexOf(today)<0)r.done.push(today);});
 if(!ok){status('Not saved. Storage is full or blocked, so this session will not survive a reload.','fail');return;}
 if(!quiet)status('Done today.');
 renderAvatar();}
/* a situation answered: intakeui's own write, see the note on AV_DILEMMA */
function avDilemma(j,v){
 var d=AV_DILEMMA[j]; if(!d)return;
 var idx=avDilIdx(d); if(idx<0)return;
 if(!avOwn()){status('Nothing saved on a worked example.','fail');return;}
 CURP.intake=CURP.intake||{answers:[]};
 var A=CURP.intake.answers, was=A[idx];
 if(was!==v)lawAnswered(CURP,SI[Math.floor(idx/3)].nm);
 A[idx]=v;
 if(!CURP.intake.startedAt)CURP.intake.startedAt=new Date().toISOString();
 iqApply(CURP); pSave();
 if(!statusSaved()){A[idx]=was; iqApply(CURP); return;}
 if(typeof syncLw==='function')syncLw();
 if(typeof renderIntake==='function')renderIntake();
 renderAvatar();
 if(typeof render==='function')render();}
function avRate(n){
 var a=avArchByName(AV.arch); if(!a)return;
 if(!avOwn()){status('Nothing saved on a worked example.','fail');return;}
 var was=avSide().arch[a.nm]||0, to=(was===n)?0:n;
 var ok=avSideWrite(function(e){if(to)e.arch[a.nm]=to; else delete e.arch[a.nm];});
 if(!ok){status('Not saved. Storage is full or blocked, so this session will not survive a reload.','fail');return;}
 status(to?'Saved. '+a.nm+' at '+to+'.':'Taken off. '+a.nm+' is not set.');
 renderAvatar();}
