/* ============================================================
   THE RITUAL WEEK AS BLOCKS, 18 November. His words, the spec for this file:

     "I want the actions that the user is supposed to do as blocks under the
      days of the week, sorted by the action color or type. Some are
      affirmations, some are actions, some may be meditations. This way,
      everything beneath that, where it says done, planned, missed, the
      rituals, the affirmations, that can go away. You can move the
      challenges to the very top above the week, so it's front and center.
      Same with the goal. Where it says called for, these need to be ritual
      cards ... Simplify them. It just needs to be a little text and the
      buttons that I need to do ... And if I click on it, then I got a pop-up
      that tells me information about it. And I could do additional actions
      like add it to my day of the week and select a day and time and
      whatnot."

   Then, on the plan read back to him: "I don't need to see your plans. I
   need to see your execution." So this is the plan's first half built in the
   real file (RITUAL-WEEK-REDESIGN-PLAN.md, B2 to B6, B8 and B11).

   WHAT THIS FILE OWNS, and every read names where it comes from.

     kinds        the four kinds of act and their colour, RIT_KINDS. Colour on
                  this page means the kind now, not the seat; the seat moved to
                  a small mark at the block's right edge (B4).
     the week     ritWeekBlocks orders what ritWeekDay already reads (the
                  record, then every plan covering the day) by kind, and adds
                  the affirmation block on the days a person placed it.
     the top row  the Ongoing goal and the challenges, ritTopHtml (B2).
     the cards    Called for, one short row each, ritCardHtml (B5).
     the pop-up   one pop-up for a card, a block, a challenge and the goal,
                  in the product's one sheet (sheetOpen), ritPopHtml (B6).
     the times    a plan's optional at, and the affirmation set's own row
                  under its own key, ritSched (B8).

   WHAT IT DOES NOT TOUCH. The Path card, Talk, Source AI's own text and the
   lighting code. Kind is labelled here, in the screen half, by hand, for
   every row of PRACTICE, and never guessed from a practice's track: a track
   is a topic and not an act (Active Listening is filed under Mind and it is
   something you do). The engine is not touched.
   ============================================================ */

/* ---------------- the four kinds ----------------
   Each kind is a physical act, and each carries its one sentence on hover and
   tap, the unpack rule. Warm is outward (said or done), cool is inward (held
   or released). The colours are tokens, --kd-*, declared in ritWeekCss with a
   darker ink for the light lightings so each mark keeps three to one against
   its ground. Every kind also has its own mark, one ring and one stroke, ring
   not fill, so the kind is never carried by colour alone: the same red reads
   "action" here and "root" on the Avatar page. */
var RIT_KINDS=[
 {k:'aff', nm:'Affirmation', says:'A line you say out loud.', ic:'<circle cx="11" cy="12" r="7"/><path d="M18 12h4"/>'},
 {k:'act', nm:'Action', says:'You do something with your body or with another person.', ic:'<circle cx="12" cy="12" r="7"/><path d="M7 17L17 7"/>'},
 {k:'med', nm:'Meditation', says:'You hold your attention on one thing, the breath included.', ic:'<circle cx="12" cy="12" r="7"/><path d="M9 12h6"/>'},
 {k:'rel', nm:'Release', says:'A daily round against one place you hold.', ic:'<circle cx="12" cy="13" r="7"/><path d="M12 13V2"/>'}];
var RIT_KIND_ORD={aff:0, act:1, med:2, rel:3};
/* EVERY PRACTICE'S KIND, BY HAND, ONCE. The library's seventeen, the eight
   teacher practices and the recipe steps of the Path. A breath practice is a
   meditation, journal writing and anything said to another person is an
   action. A practice missing from this table has no kind, and
   tests/ritweek.js fails on it, so a practice added to PRACTICE without a
   line here is caught the day it lands rather than drawn in a guessed colour.
   Release is not a practice's kind: it is a plan that carries a held place
   (rel), ritKindOf below. */
var RIT_KIND_OF={
 escan:'med', box:'med', slow:'med', sig:'med', sysbreath:'med', resist:'med', truth:'med', heartpt:'med',
 noting:'med', listen:'act', observer:'med', detect:'med', hands:'med', hardtrauma:'med', superego:'med',
 chakra:'med', candle:'med',
 given:'act', offered:'med', onerule:'act', samecut:'act', meetit:'med', letmove:'act', linehold:'act', stopone:'act',
 il_need:'act', il_alone:'act', re_changed:'act', re_jaw:'act', de_enough:'act', de_pull:'med',
 or_plan:'act', or_stand:'act', po_small:'act', po_own:'act', pe_name:'med', pe_match:'med',
 tr_land:'med', tr_tell:'act', ch_move:'act', ch_ten:'act', fl_call:'act', fl_other:'act',
 al_said:'act', al_owe:'act', ho_wait:'act', ho_open:'med', sa_hand:'act', sa_name:'act',
 tu_plain:'act', tu_end:'act', na_tend:'act', na_season:'med'};
function ritKind(k){for(var i=0;i<RIT_KINDS.length;i++)if(RIT_KINDS[i].k===k)return RIT_KINDS[i]; return null;}
/* a plan, a record entry, a suggestion or a block: a held place makes it a
   Release, an affirmation block is an Affirmation, and anything else is the
   kind of its first step, which is the act a person starts with */
function ritKindOf(x){
 if(!x)return 'med';
 if(x.aff)return 'aff';
 if(x.rel!=null)return 'rel';
 var st=x.steps||(x.k?[x.k]:[]);
 return RIT_KIND_OF[st[0]]||'med';}
function ritKindCol(k){return 'var(--kd-'+(RIT_KIND_ORD[k]==null?'med':k)+')';}
function ritKindIc(k,cls){
 var K=ritKind(k)||RIT_KINDS[2];
 return '<svg viewBox="0 0 24 24" class="'+(cls||'rv-kic')+'" aria-hidden="true">'+K.ic+'</svg>';}
/* the kind's chip, symbol first and the word second, carrying the meaning */
function ritKindChip(k){
 var K=ritKind(k)||RIT_KINDS[2];
 return '<span class="rv-kch" style="--c:'+ritKindCol(K.k)+'"'+rvTip(K.nm,K.says)+' role="img" aria-label="'+esc(K.nm+'. '+K.says)+'">'
  +ritKindIc(K.k)+'<span>'+esc(K.nm)+'</span></span>';}

/* ---------------- a time of day ----------------
   HH:MM, 00:00 to 23:59, and nothing else. 24:00 and 7:5 are refused by name,
   never rounded, because a rounded time is a time the person never set. A
   missing time is any time. The time orders a day's blocks and is said with
   them; nothing reminds anyone of it yet, because the product has no push. */
var RIT_AT_RX=/^([01]\d|2[0-3]):[0-5]\d$/;
function ritAtOk(s){return typeof s==='string'&&RIT_AT_RX.test(s);}

/* ---------------- the affirmation set's own row ----------------
   Affirmations are not plans, so their days and time cannot ride a plan. They
   get a key of their own beside the record, deliberately not the ritual more
   key: that key's writer rebuilds its entry from a fixed shape, so an older
   open tab writing there would erase any field it does not know. Same posture
   as the plans: on this device, never in an export, no schema change (B8).
   One row, id aff, the whole set: one Affirmation block a day holds all of
   that day's lines. */
var RIT_SCHED_KEY='atuned-ritual-sched';
function ritSchedAll(){
 if(typeof STORE==='undefined')return {};
 try{var o=JSON.parse(STORE.get(RIT_SCHED_KEY)||'{}');
  return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}catch(e){return {};}}
/* a row that is not the shape the writer puts there is dropped on the read,
   the boundary's posture, and a store that cannot be read is an empty one */
function ritSchedOk(r){
 return !!(r&&typeof r==='object'&&r.id==='aff'&&r.kind==='aff'
  &&typeof r.from==='string'&&pracDay(r.from)!==null
  &&typeof r.days==='number'&&r.days>=0&&r.days<=3660&&Math.floor(r.days)===r.days
  &&(r.at==null||r.at===''||ritAtOk(r.at))
  &&(r.on==null||(Array.isArray(r.on)&&r.on.length>=1&&r.on.length<=7
   &&r.on.every(function(d,i){return typeof d==='number'&&d>=0&&d<=6&&Math.floor(d)===d&&r.on.indexOf(d)===i;}))));}
function ritSched(){
 if(!CURP||!CURP.id)return [];
 var a=ritSchedAll()[CURP.id];
 if(!Array.isArray(a))return [];
 return a.filter(ritSchedOk).map(function(r){
  return {id:r.id, kind:r.kind, on:r.on?r.on.slice().sort():null, at:r.at||'', from:r.from, days:r.days};});}
function ritSchedAff(){return ritSched().filter(function(r){return r.id==='aff';})[0]||null;}
/* ONE WRITER for this key, the ritMoreWrite posture: a worked example is
   refused by name, and a store that would not take it says so, so a control
   never claims a save it does not have */
function ritSchedWrite(fn,msg){
 if(!ritOwn()){status(ritWhose()+' is a worked example, so nothing was saved to it.','fail');return false;}
 var ok=false;
 if(typeof STORE_BOUND!=='undefined'&&STORE_BOUND){
  try{var all=ritSchedAll(), cur=ritSched(); cur=fn(cur)||cur;
   all[CURP.id]=cur; STORE.set(RIT_SCHED_KEY,JSON.stringify(all)); ok=true;}
  catch(err){ok=false;}}
 if(!ok){status('Not saved. Your browser refused the write. Nothing changed.','fail'); ritRender(); return false;}
 if(msg)status(msg);
 ritRender(); return true;}
function ritSchedCovers(r,day){
 return ritCovers({from:r.from, days:r.days, on:r.on, stop:null},day);}
/* the affirmation block for a day: done once any line was said that day,
   missed when a placed day closed with none said, planned otherwise. Said is
   read off the same record the ticks write (ritMore().said). */
function ritAffSeg(d,st){
 var r=ritSchedAff(); if(!r||!ritSchedCovers(r,d))return null;
 var said=ritMore().said.some(function(x){return x[0]===d;});
 return {aff:true, nm:'Affirmations', at:r.at, kind:'aff', col:ritKindCol('aff'),
  st:said?'done':(d<st.today?'miss':(d===st.today?'plan':'ahead'))};}

/* ---------------- a day's blocks ----------------
   Order inside a day is fixed by kind, Affirmation, Action, Meditation,
   Release, so the colours line up in rows across the week the way he drew
   them; inside one kind, a set time comes before any time. ritWeekDay calls
   this with what it already read, so the week, a day's list and a block's
   pop-up all index the same list and a block's place is the pop-up's
   identity for one paint. */
function ritWeekBlocks(d,st,segs){
 segs.forEach(function(s){
  var p=s.p||(s.x&&typeof ritSashPlan==='function'?ritSashPlan(s,d,st):null);
  s.kind=ritKindOf(p||s.x); if(p&&p.at)s.at=p.at;
  s.col=ritKindCol(s.kind);});
 var a=ritAffSeg(d,st); if(a)segs.unshift(a);
 return segs.map(function(s,i){return {s:s,i:i};}).sort(function(A,B){
  var ka=RIT_KIND_ORD[A.s.kind], kb=RIT_KIND_ORD[B.s.kind];
  if(ka!==kb)return ka-kb;
  var ta=A.s.at||'99', tb=B.s.at||'99';
  return ta<tb?-1:ta>tb?1:A.i-B.i;}).map(function(o){return o.s;});}
/* what a block says to a screen reader and on its press:
   "Box Breathing, meditation, planned, 07:30" */
function ritBlockSay(s){
 var K=ritKind(s.kind)||RIT_KINDS[2];
 return s.nm+', '+K.nm.toLowerCase()+', '+String(RIT_DAY_SAY[s.st]).toLowerCase()+(s.at?', '+s.at:'');}
/* the key for the four kinds, in the Week's head where the Done, Planned,
   Missed key under the grid used to sit. Each word is its own carrier. */
function ritKindKeyHtml(){
 return '<div class="rv-kkey" role="group" aria-label="Kinds">'+RIT_KINDS.map(function(K){return ritKindChip(K.k);}).join('')+'</div>';}

/* ---------------- the top row: the goal and the challenges ----------------
   B2, his words: "move the challenges to the very top above the week, so
   it's front and center. Same with the goal." One row of four equal tiles,
   the goal first and then up to three challenges. Fewer than three and the
   tiles keep their width and sit in the centre, nothing stretched. Each tile
   is symbol first, then a short header, and no body text (16 November). The
   longer sentences are on the press, in the pop-up. */
function ritTopHtml(st){
 var tiles=[ritGoalTile(st)].concat(ritChallenge(st).map(function(c){return ritChalTile(c,st);}));
 if(!st.r.unread&&tiles.length===1)tiles.push('<div class="rv-tile rv-tile0" role="img" aria-label="No challenge: nothing your reading shows running has one written for it yet." data-tip-t="Challenges" data-tip="'
  +esc(RIT_TOP_SAY.chal+' Nothing your reading shows running has one written for it yet.')+'" tabindex="0"><span class="rv-tdash" aria-hidden="true">–</span></div>');
 return '<section class="rv-sec rv-top" aria-label="Goal and challenges"><div class="rv-tiles">'+tiles.join('')+'</div></section>';}
var RIT_TOP_SAY={
 goal:'Who your avatar is becoming, and what is held in the way.',
 chal:'One act against a pattern your reading shows running.'};
function ritGoalTile(st){
 var bc=ritBecoming(), pairs=(CURP&&CURP.avatar&&CURP.avatar.pairs)||[], last=null;
 for(var i=pairs.length-1;i>=0;i--)if(pairs[i]&&pairs[i].be&&String(pairs[i].be).trim()){last=pairs[i];break;}
 /* nothing read and no avatar line: one tile, and its one press is the way in */
 if(!bc&&!last){
  if(st.r.unread)return '<div class="rv-tile rv-tgoal" style="--c:var(--accent)">'
   +'<span class="rv-tlab"'+rvTip('Ongoing goal',RIT_TOP_SAY.goal)+'>'+ritIc('ring','rv-tic')+'Ongoing goal</span>'
   +'<span class="rv-tnm">Nothing read yet</span>'
   +'<span class="rv-tact"><button type="button" class="btn pri" data-act="go-story">Write a story</button></span></div>';
  return '<div class="rv-tile rv-tgoal" style="--c:var(--accent)">'
   +'<span class="rv-tlab"'+rvTip('Ongoing goal',RIT_TOP_SAY.goal)+'>'+ritIc('ring','rv-tic')+'Ongoing goal</span>'
   +'<button type="button" class="rv-tnm rv-tpr" data-act="pgoal" aria-label="Ongoing goal: open">–</button></div>';}
 var be=String((bc?bc.be:last.be)||'').trim().replace(/^"+|"+$/g,''), iam=ritIAm(be);
 var seat=bc?bc.seat:'', col=seat?seatCol(seat):'var(--accent)';
 var on=bc&&st.act.some(function(p){return p.rel===bc.n.i;});
 var glyph=seat&&SEATGLYPH[seat]?'<svg viewBox="0 0 24 24" class="rv-tic" aria-hidden="true">'+SEATGLYPH[seat]+'</svg>':ritIc('ring','rv-tic');
 return '<div class="rv-tile rv-tgoal" style="--c:'+col+'">'
  +'<span class="rv-tlab"'+rvTip('Ongoing goal',RIT_TOP_SAY.goal)+'>'+glyph+'Ongoing goal</span>'
  +'<button type="button" class="rv-tnm rv-tpr" data-act="pgoal" aria-label="'+esc('Ongoing goal: '+(iam||be)+'. Open')+'">'+esc(iam||('"'+be+'"'))+'</button>'
  +'<span class="rv-tact">'+(bc?(on?'<span class="rv-tsub">Release running</span>'
   :'<button type="button" class="btn pri" data-act="why" data-d="7" aria-label="'+esc('Release '+String(bc.n.k).toLowerCase()+', each day for a week')+'">Release</button>'):'')+'</span></div>';}
function ritChalTile(c,st){
 var M=ritMore(), on=ritDayOn(M.did,st.today,c.id), col=c.b?seatCol(c.b):'var(--accent)';
 var nm=ritChalName(c.nm);
 return '<div class="rv-tile rv-tchal'+(on?' rv-on':'')+'" style="--c:'+col+'">'
  +'<span class="rv-tlab"'+rvTip('Challenge',RIT_TOP_SAY.chal)+'>'+ritIc('ring','rv-tic')+'Challenge</span>'
  +'<button type="button" class="rv-tnm rv-tpr" data-act="pchal" data-id="'+esc(c.id)+'" aria-label="'+esc(c.nm+'. Open')+'">'+esc(nm)+'</button>'
  /* THE DID TICK MOVED ONTO THE TILE, B11: it was on the Today list's row,
     and the list is gone, so the tick is here and in the pop-up */
  +'<span class="rv-tact"><button type="button" class="rv-log rv-ttick" data-act="did" data-id="'+esc(c.id)+'" aria-pressed="'+on+'" aria-label="'
  +esc(on?'Done today. Press to take it off':'Mark done today: '+c.nm)+'">'+ritTickHtml(on,col)+'</button>'
  +'<span class="rv-tsub">'+(on?'Done today':'Not yet today')+'</span></span></div>';}
/* five words or fewer on a tile, the rest on the press */
function ritChalName(nm){var w=String(nm||'').split(/\s+/); return w.length>5?w.slice(0,5).join(' ')+'…':String(nm||'');}

/* ---------------- Called for, as simple cards ----------------
   B5. One row: the kind's ring, the name, the minutes and where it came from,
   and two presses, Add and Dismiss. The description, Toward, the record, the
   seats and the reasons moved into the pop-up, with Save. Four are shown, no
   more than two from one source, and the rest are one press away; the list
   is never padded. The affirmation set is the first card, because the Today
   list that carried its lines is gone (B11). */
var RIT_VIA={
 story:{nm:'Story', says:'Found in your story.', ic:'<path d="M5 5h10l4 4v10H5z M9 12h6 M9 15h4"/>'},
 avatar:{nm:'Avatar', says:'From your avatar\'s stories.', ic:'<circle cx="12" cy="8" r="3.2"/><path d="M5.5 19c1.2-3.6 3.8-5.4 6.5-5.4s5.3 1.8 6.5 5.4"/>'},
 field:{nm:'Field', says:'From the place in your field carrying the most charge.', ic:'<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3"/>'},
 held:{nm:'Held place', says:'From a place you hold at four or more, as a release.', ic:'<circle cx="12" cy="12" r="7.5"/><path d="M12 8v8 M8 12h8"/>'}};
var RIT_CF_SHOW=4, RIT_CF_PER=2;
function ritViaMark(v){
 var V=RIT_VIA[v]||RIT_VIA.story;
 return '<span class="rv-via" role="img" aria-label="'+esc(V.says)+'"'+rvTip(V.nm,V.says)+'><svg viewBox="0 0 24 24" aria-hidden="true">'+V.ic+'</svg></span>';}
function ritCardFace(o){
 var K=ritKind(o.kind)||RIT_KINDS[2];
 return '<li class="rv-cf" data-kind="'+K.k+'" data-via="'+esc(o.via||'story')+'" style="--c:'+ritKindCol(K.k)+'">'
  +'<span class="rv-cfr" role="img" aria-label="'+esc(K.nm+'. '+K.says)+'"'+rvTip(K.nm,K.says)+'>'+ritKindIc(K.k)+'</span>'
  +'<button type="button" class="rv-cfo" data-act="'+o.act+'" data-i="'+o.i+'" aria-label="'+esc(o.nm+', '+K.nm.toLowerCase()+'. Open')+'">'
  +'<span class="rv-cfn">'+esc(o.nm)+'</span><span class="rv-cfm">'+esc(o.sub)+'</span></button>'
  +ritViaMark(o.via)
  +'<button type="button" class="btn pri rv-cfa" data-act="'+o.act+'" data-i="'+o.i+'" data-at="when" aria-label="'+esc('Add '+o.nm)+'">Add</button>'
  +(o.x?'<button type="button" class="rv-cfx" data-act="'+o.x+'" data-i="'+o.i+'" aria-label="'+esc('Dismiss '+o.nm)+'"'
   +' data-tip-t="Dismiss" data-tip="Take it off this list. Put back brings it back.">'+ritIc('x')+'</button>':'<span class="rv-cfx0" aria-hidden="true"></span>')
  +'</li>';}
/* the offers, worked out fresh on every read and never stored, in the order
   ritSuggest returns them, capped as B5 says */
function ritCardList(list){
 var by={}, shown=[], rest=[];
 list.forEach(function(x){var v=x.via||'story';
  if(shown.length<RIT_CF_SHOW&&(by[v]||0)<RIT_CF_PER){by[v]=(by[v]||0)+1; shown.push(x);} else rest.push(x);});
 return {shown:shown, rest:rest};}
function ritAffCardHtml(st){
 var A=ritAffirm(st); if(!A.length)return '';
 var r=ritSchedAff();
 return ritCardFace({kind:'aff', nm:'Affirmations', act:'aff-pop', i:0, via:'story',
  sub:A.length+(A.length===1?' line':' lines')+(r?', '+ritOften(r.on).replace(/^(Every|Week)/,function(m){return m.toLowerCase();}):'')});}

/* ---------------- the pop-up ----------------
   B6. One pop-up for a card, a block, a challenge and the goal, inside the
   product's one sheet (sheetOpen, ui/panels.js), which already closes on the
   backdrop and on Escape. It keeps its own state, RIT.pop, because the page
   redraws under it after every write and a pop-up read off the page would
   lose what the person had chosen. Every message goes through status(), and
   nothing claims success before the writer answers. */
RIT.pop=null;
var RIT_REP=[{d:1,nm:'Once'},{d:7,nm:'A week'},{d:14,nm:'Two weeks'},{d:0,nm:'No end'}];
var RIT_REP_SAY={1:'Once', 7:'for a week', 14:'for two weeks', 0:'with no end'};
/* the When part, a state the pop-up owns: days (null is every day), time ('' is
   any time) and repeat */
function ritWhen0(p){
 return {on:p&&p.on?p.on.slice():null, at:(p&&p.at)||'', rep:p&&typeof p.days==='number'?(RIT_REP.some(function(r){return r.d===p.days;})?p.days:7):7};}
function ritWhenHtml(W,lead){
 var on=W.on||[0,1,2,3,4,5,6];
 var days=RIT_WCOL.map(function(wd){var y=on.indexOf(wd)>=0;
  return '<button type="button" class="rv-pd'+(y?' rv-on':'')+'" data-sh="pd" data-d="'+wd+'" aria-pressed="'+y+'" aria-label="'+RIT_WDF[wd]+'">'+RIT_WDN[wd].charAt(0)+RIT_WDN[wd].charAt(1).toLowerCase()+'</button>';}).join('');
 var all=!W.on, wk=W.on&&W.on.join()==='0,1,2,3,4';
 return '<div class="rv-pw" id="rv-pwhen"><span class="rv-pwh"'+rvTip('When','The days, the time and how long it runs. A time orders the day; nothing reminds you of it yet.')+'>'+ritIc('clock','rv-ic')+'When</span>'
  +(lead?'<p class="rv-pwl">'+esc(lead)+'</p>':'')
  +'<div class="rv-pdays" role="group" aria-label="Days">'+days+'</div>'
  +'<div class="rv-prow" role="group" aria-label="Days, quick">'
  +'<button type="button" class="rv-pq'+(all?' rv-on':'')+'" data-sh="pall" aria-pressed="'+all+'">Every day</button>'
  +'<button type="button" class="rv-pq'+(wk?' rv-on':'')+'" data-sh="pwk" aria-pressed="'+!!wk+'">Weekdays</button></div>'
  +'<div class="rv-prow" role="group" aria-label="Time">'
  +'<button type="button" class="rv-pq'+(W.at?'':' rv-on')+'" data-sh="pany" aria-pressed="'+!W.at+'">Any time</button>'
  +'<label class="rv-ptm"><span class="rv-sr">Time</span><input type="time" id="rv-pat" value="'+esc(W.at||'')+'" aria-label="Time of day"></label></div>'
  +'<div class="rv-prow" role="group" aria-label="Repeat">'+RIT_REP.map(function(r){var y=W.rep===r.d;
   return '<button type="button" class="rv-pq'+(y?' rv-on':'')+'" data-sh="prep" data-d="'+r.d+'" aria-pressed="'+y+'">'+r.nm+'</button>';}).join('')+'</div></div>';}
/* the first set day on or after today, and for Once the last one inside the
   coming seven days, so Once on Tuesday and Thursday is this Tuesday and this
   Thursday and then it ends. A start date in the future is allowed. */
function ritWhenSpan(W,today){
 var on=W.on, first=today;
 if(on){for(var i=0;i<7;i++)if(on.indexOf(ritWd(today+i))>=0){first=today+i;break;}}
 if(W.rep!==1)return {from:first, days:W.rep};
 var last=first;
 if(on){for(var j=0;j<7;j++)if(on.indexOf(ritWd(today+j))>=0)last=today+j;}
 return {from:first, days:last-first+1};}
function ritWhenSay(W,from,today){
 var dt=ritDateOf(from), day=RIT_WDN[ritWd(from)]+' '+dt.getDate();
 var often=W.on?ritOften(W.on).replace(/^(Every|Week)/,function(m){return m.toLowerCase();}):'every day';
 return 'from '+day+(W.at?', '+W.at:'')+', '+often+', '+RIT_REP_SAY[W.rep];}
function ritPopHead(K,nm,sub,col){
 return '<div class="rv-shh"><span class="rv-shg" style="--c:'+(col||ritKindCol(K.k))+'">'+ritKindIc(K.k,'rv-kic')+'</span>'
  +'<span class="rv-sht"><span class="sh-h plain">'+esc(nm)+'</span>'+(sub?'<span class="rv-shs">'+esc(sub)+'</span>':'')+'</span></div>';}
function ritFold(id,nm,body){
 if(!body)return '';
 return '<details class="rv-pf"><summary>'+esc(nm)+'</summary>'+body+'</details>';}
/* Source AI's own sentences carry its mark, the 15 November ruling: the
   reasons a card is offered, the goal's held pattern, a challenge's who */
function ritAi(t){
 var m=(typeof srcMark==='function')?srcMark():'';
 return '<p class="rv-pai src-ai">'+m+'<span class="src-ai-t">'+esc(t)+'</span></p>';}

function ritPopSug(st){
 var P=RIT.pop, x=(RIT.sug||[]).filter(function(s){return ritSugKey(s)===P.key;})[0];
 if(!x)return '<div class="rv-sh"><p class="rv-empty">This one is no longer on the list.</p><div class="sh-act rv-sha"><button type="button" class="btn rv-shx" data-sh="close">Close</button></div></div>';
 var K=ritKind(ritKindOf(x)), i=(RIT.sug||[]).indexOf(x);
 var R=ritSugRec(x,(st.r.loaded||[]).length), T=ritSugToward(x), recSays=ritSugRecSays(x,R), V=RIT_VIA[x.via]||RIT_VIA.story;
 var steps=ritSteps({steps:[x.k]});
 var out='<div class="rv-sh rv-pop" style="--c:'+ritKindCol(K.k)+'">'+ritPopHead(K,x.p.nm,x.p.min+' min, '+V.says.replace(/\.$/,'').toLowerCase())
  +'<div class="rv-pchips">'+ritKindChip(K.k)+x.seats.map(function(b){return '<span class="rv-kch" style="--c:'+seatCol(b)+'"'
   +rvTip(ritTagNm(b),'The body place this is for.')+'><svg viewBox="0 0 24 24" class="rv-kic" aria-hidden="true">'+(SEATGLYPH[b]||SEATGLYPH._)+'</svg><span>'+esc(ritTagNm(b))+'</span></span>';}).join('')+'</div>'
  +(x.p.d?'<p class="rv-pwhat">'+esc(x.p.d)+'</p>':'')
  +ritFold('why','Why here',x.why.map(ritAi).join('')+(T?'<p class="rv-pp">Toward '+esc(T.opp.toLowerCase())+': the quality release puts back where '+esc(ritCfWord(T.nm))+' was held.</p>':'')
   +recSays.map(function(w){return '<p class="rv-pp">'+esc(w)+'</p>';}).join(''))
  +ritFold('how','How',steps.map(function(s){return '<p class="rv-pp">'+esc(s.how)+'</p>';}).join(''))
  +ritWhenHtml(P.W)
  +'<div class="sh-act rv-sha"><button type="button" class="btn pri" data-sh="padd">Add</button>'
  +'<button type="button" class="btn" data-sh="psave" data-i="'+i+'">Save</button>'
  +'<button type="button" class="btn" data-sh="pdrop" data-i="'+i+'">Dismiss</button>'
  +'<button type="button" class="btn rv-shx" data-sh="close">Close</button></div></div>';
 return out;}
function ritPopAff(st){
 var P=RIT.pop, A=ritAffirm(st), M=ritMore(), r=ritSchedAff(), today=st.today;
 var lines='<ul class="rv-pafl">'+A.map(function(a){var on=ritDayOn(M.said,today,a.id), col=a.b?seatCol(a.b):'var(--accent)';
  return '<li class="rv-paf1'+(on?' rv-on':'')+'"><button type="button" class="rv-log" data-sh="said" data-id="'+esc(a.id)+'" aria-pressed="'+on+'" aria-label="'
   +esc(on?'Said today. Press to take it off':'Mark said today: '+a.line)+'">'+ritTickHtml(on,col)+'</button>'
   +'<span class="rv-pafq">'+(a.own?'"'+esc(a.line)+'"':esc(a.line))+'</span></li>';}).join('')+'</ul>';
 return '<div class="rv-sh rv-pop" style="--c:'+ritKindCol('aff')+'">'+ritPopHead(ritKind('aff'),'Affirmations',r?'On your week, '+ritOften(r.on).toLowerCase():'Not on your week yet')
  +'<div class="rv-pchips">'+ritKindChip('aff')+'</div>'
  /* THE SAID TICKS, B11: they lived on the Today list's rows, today only, and
     they live here now, the same press through the same writer (ritDayMark) */
  +'<span class="rv-pwh"'+rvTip('Said today','Press a ring once you have said the line out loud today. Today only.')+'>'+ritIc('check','rv-ic')+'Said today</span>'+lines
  +ritWhenHtml(P.W)
  +'<div class="sh-act rv-sha"><button type="button" class="btn pri" data-sh="paffset">'+(r?'Change days':'Add')+'</button>'
  +(r?'<button type="button" class="btn" data-sh="paffstop">Stop all days</button>':'')
  +'<button type="button" class="btn rv-shx" data-sh="close">Close</button></div></div>';}
function ritPopChal(st){
 var P=RIT.pop, c=ritChallenge(st).filter(function(x){return x.id===P.id;})[0];
 if(!c)return '<div class="rv-sh"><p class="rv-empty">This challenge is no longer read from your stories.</p><div class="sh-act rv-sha"><button type="button" class="btn rv-shx" data-sh="close">Close</button></div></div>';
 var M=ritMore(), on=ritDayOn(M.did,st.today,c.id), col=c.b?seatCol(c.b):'var(--accent)';
 return '<div class="rv-sh rv-pop" style="--c:'+col+'">'+ritPopHead(ritKind('act'),c.nm,'Challenge',col)
  +'<div class="rv-pchips">'+ritKindChip('act')+'</div>'
  +'<p class="rv-pwhat">'+esc(c.act)+'</p>'
  +'<p class="rv-pp"><b>When.</b> '+esc(c.when)+'</p>'
  +ritAi('Who it answers: '+c.who+'.')
  +'<div class="sh-act rv-sha"><button type="button" class="btn rv-shdone'+(on?' rv-on':'')+'" data-sh="did" data-id="'+esc(c.id)+'" aria-pressed="'+on+'" aria-label="'
  +esc(on?'Done today. Press to take it off':'Mark done today: '+c.nm)+'">'+ritTickHtml(on,col)+'Done</button>'
  +'<button type="button" class="btn rv-shx" data-sh="close">Close</button></div></div>';}
function ritPopGoal(st){
 var bc=ritBecoming(), r=st.r, c=st.c;
 var body=ritGoalHtml(st);
 /* the chain from the story to the work, B2: it left the centre and opens
   here, the one place it says what the goal is fed by */
 var chain=ritChainHtml(c,r,st.act);
 var held=bc?ritAi('You are holding on to '+String(bc.n.k).toLowerCase()+' at '+ritThe(bc.seat)+'.'):'';
 var on=bc&&st.act.some(function(p){return p.rel===bc.n.i;});
 return '<div class="rv-sh rv-pop rv-pgoal" style="--c:'+(bc?seatCol(bc.seat):'var(--accent)')+'">'
  +'<div class="rv-shh"><span class="rv-sht"><span class="sh-h plain">Ongoing goal</span><span class="rv-shs">'+esc(RIT_TOP_SAY.goal)+'</span></span></div>'
  +body+held+chain
  +'<div class="sh-act rv-sha">'+(bc&&!on?'<button type="button" class="btn pri" data-sh="pwhy" data-d="7">Release, a week</button>'
   +'<button type="button" class="btn" data-sh="pwhy" data-d="14">Release, two weeks</button>':'')
  +'<button type="button" class="btn rv-shx" data-sh="close">Close</button></div></div>';}
function ritPopHtml(){
 var P=RIT.pop; if(!P)return '';
 var st=ritRead();
 if(P.t==='sug')return ritPopSug(st);
 if(P.t==='aff')return ritPopAff(st);
 if(P.t==='chal')return ritPopChal(st);
 if(P.t==='goal')return ritPopGoal(st);
 return '';}
function ritPopOpen(P){
 if(typeof sheetOpen!=='function')return false;
 RIT.pop=P; ritCalCss(); ritWeekCss(); sheetOpen(ritPopHtml()); ritSheetWire(); ritPopWireIn();
 var f=P.at==='when'&&document.querySelector('#sheet-card .rv-pd'); if(f)f.focus();
 return true;}
/* the time field writes to the pop-up's state on the way past, so a redraw
   for a day pressed after it keeps the time typed */
function ritPopWireIn(){
 var t=document.getElementById('rv-pat'); if(!t)return;
 t.onchange=t.oninput=function(){if(RIT.pop&&RIT.pop.W)RIT.pop.W.at=t.value||'';};}
/* redraw the sheet in place and keep the keyboard where it was, read by what
   the control does and not where it sits */
function ritPopRedraw(html,b){
 var c=document.getElementById('sheet-card'); if(!c)return;
 var key=b?b.getAttribute('data-sh')+'|'+(b.getAttribute('data-d')||b.getAttribute('data-id')||''):'';
 c.innerHTML=html; ritPopWireIn();
 if(key){var f=[].slice.call(c.querySelectorAll('[data-sh]')).filter(function(x){
   return x.getAttribute('data-sh')+'|'+(x.getAttribute('data-d')||x.getAttribute('data-id')||'')===key;})[0]; if(f)f.focus();}}
/* ONE ADD for a practice from a card. Through ritStartPlan, the one writer,
   with join set: a practice already on the week gets these days added to the
   ones it has, never replaced (the B8 defect: Box Breathing dropped on
   Tuesday and then Thursday ended on Thursday only). */
function ritCardAdd(x,W){
 if(W.at&&!ritAtOk(W.at)){status('Time must be HH:MM, from 00:00 to 23:59. Nothing changed.','fail'); return false;}
 var today=ritToday0(), S=ritWhenSpan(W,today);
 var q={steps:[x.k], band:x.seats[0]||'', track:x.p.track, days:S.days, tags:x.seats.slice(), on:W.on, at:W.at||null,
  fromDay:S.from, join:true};
 if(x.rel!=null&&BY[x.rel])q.rel=x.rel;
 return ritStartPlan(q,'Added. '+x.p.nm+', '+ritWhenSay(W,S.from,today)+'.');}
/* CHANGE DAYS on a running plan sets them, where Add joins them. The span is
   counted from the day the plan started, so it is written as the days from
   there to the new end. */
function ritPlanSet(id,W){
 if(W.at&&!ritAtOk(W.at)){status('Time must be HH:MM, from 00:00 to 23:59. Nothing changed.','fail'); return false;}
 var today=ritToday0(), S=ritWhenSpan(W,today), was=ritPlans().filter(function(x){return x.id===id;})[0];
 if(!was)return false;
 return ritWrite(function(plans){
  var p=plans.filter(function(x){return x.id===id;})[0]; if(!p)throw new Error('gone');
  p.on=W.on?W.on.slice():null; p.at=W.at||null;
  p.days=W.rep===0?0:Math.max(1,S.from+S.days-ritStart0(p));
  return plans;},'Changed. '+ritName(was.steps)+', '+ritWhenSay(W,S.from,today)+'.');}
function ritAffSet(W){
 if(W.at&&!ritAtOk(W.at)){status('Time must be HH:MM, from 00:00 to 23:59. Nothing changed.','fail'); return false;}
 var today=ritToday0(), S=ritWhenSpan(W,today);
 return ritSchedWrite(function(rows){
  rows=rows.filter(function(r){return r.id!=='aff';});
  rows.push({id:'aff', kind:'aff', on:W.on?W.on.slice():null, at:W.at||'', from:ritDayIso(S.from), days:S.days});
  return rows;},'Affirmations, '+ritWhenSay(W,S.from,today)+'.');}
function ritAffStop(){
 return ritSchedWrite(function(rows){return rows.filter(function(r){return r.id!=='aff';});},'Stopped. The days you said them stay on the record.');}

/* the pop-up's presses, reached from ritSheetWire for anything it does not
   handle itself. Each one writes through its own writer and then redraws
   the pop-up from a fresh read. */
function ritPopAct(a,b,c){
 var P=RIT.pop, W=P&&P.W;
 switch(a){
  case 'pd': if(!W)return; {var wd=+b.getAttribute('data-d'), cur=(W.on||[0,1,2,3,4,5,6]).slice(), at=cur.indexOf(wd);
   /* the last day cannot be pressed off: a ritual on no day is not one */
   if(at>=0){if(cur.length>1)cur.splice(at,1);} else cur.push(wd);
   cur.sort(); W.on=cur.length===7?null:cur;} break;
  case 'pall': if(W)W.on=null; break;
  case 'pwk': if(W)W.on=[0,1,2,3,4]; break;
  case 'pany': if(W)W.at=''; break;
  case 'prep': if(W)W.rep=+b.getAttribute('data-d'); break;
  case 'padd': {var x=(RIT.sug||[]).filter(function(s){return ritSugKey(s)===P.key;})[0]; if(!x)return;
   if(ritCardAdd(x,W)){sheetShut(); RIT.pop=null;} return;}
  case 'psave': sheetShut(); RIT.pop=null; ritSugSave(+b.getAttribute('data-i')); return;
  case 'pdrop': sheetShut(); RIT.pop=null; ritSugDrop(+b.getAttribute('data-i')); return;
  case 'said': ritDayMark('said',b.getAttribute('data-id')); break;
  case 'did': ritDayMark('did',b.getAttribute('data-id')); break;
  case 'paffset': if(ritAffSet(W)){sheetShut(); RIT.pop=null;} return;
  case 'paffstop': if(ritAffStop()){sheetShut(); RIT.pop=null;} return;
  case 'pwhy': {var bc=ritBecoming(); sheetShut(); RIT.pop=null; if(bc)ritStartFor(bc,+b.getAttribute('data-d')); return;}
  /* the block pop-up's own, ritSashSheet */
  case 'ptimer': ritTimer(b.getAttribute('data-id')); ritSashRedraw(b); return;
  case 'pstop': sheetShut(); RIT.pop=null; ritStop(b.getAttribute('data-id')); return;
  case 'prel': sheetShut(); RIT.pop=null; if(typeof relPick==='function')relPick([+b.getAttribute('data-n')]); return;
  case 'pkeep': ritKeep(b.getAttribute('data-id')); ritSashRedraw(b); return;
  case 'pset': if(ritPlanSet(b.getAttribute('data-id'),W)){sheetShut(); RIT.pop=null;} return;
  default: return;}
 if(P&&P.t==='blk')ritSashRedraw(b); else ritPopRedraw(ritPopHtml(),b);}
/* a block's pop-up is ritSashSheet, ui/ritcal.js, found again by its name
   after a write, the rule ritSheetWire already keeps */
function ritSashRedraw(b){
 var P=RIT.pop, c=document.getElementById('sheet-card'); if(!P||!c)return;
 var st=ritRead(), segs=ritWeekDay(P.d,st), k=-1;
 segs.forEach(function(s,j){if(k<0&&s.nm===P.nm)k=j;});
 if(k>=0)ritPopRedraw(ritSashSheet(segs[k],P.d,st),b);}

/* ---------------- the look ---------------- */
function ritWeekCss(){
 if(document.getElementById('ritwk-css'))return;
 var st=document.createElement('style'); st.id='ritwk-css';
 st.textContent=[
  /* the four kinds, dark first, then the darker inks for the light lightings,
     each at three to one or more against its ground. Lumen's centre stays
     dark and its rails are paper, so only the rails take the darker ink. */
  ':root{--kd-aff:#D19255;--kd-act:#C4635E;--kd-med:#8296DB;--kd-rel:#6FC5A3}',
  'body.snow,body.glasswhite,body.lumen #lpanel,body.lumen #rpanel,body.lumen #sheet{--kd-aff:#9A6435;--kd-act:#A4473F;--kd-med:#5A6DB0;--kd-rel:#3F8068}',
  '.rv-kic{width:18px;height:18px;flex:0 0 auto;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
  /* the kind chip: the symbol, then the word, the one tooltip's carrier */
  '.rv-kch{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 10px 0 7px;border-radius:999px;color:var(--ink);font-size:13px;',
  ' background:color-mix(in srgb,var(--c) 14%,transparent);cursor:help}',
  '.rv-kch .rv-kic{color:var(--c)}',
  '.rv-kch:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-kkey{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}',
  /* THE TOP ROW, B2: four equal tiles, even gaps, centred when fewer */
  '.rv-top{padding:14px}',
  '.rv-tiles{display:grid;grid-template-columns:repeat(auto-fit,calc((100% - 36px) / 4));gap:12px;justify-content:center}',
  '.rv-tile{box-sizing:border-box;display:flex;flex-direction:column;gap:8px;min-width:0;min-height:132px;padding:12px 14px;border-radius:14px;',
  ' background:color-mix(in srgb,var(--c) 13%,var(--panel-2))}',
  '.rv-tlab{display:inline-flex;align-items:center;gap:7px;align-self:flex-start;min-height:28px;font-size:12.5px;font-weight:600;color:var(--mid);cursor:help}',
  '.rv-tlab:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-tic{width:20px;height:20px;flex:0 0 auto;fill:none;stroke:var(--c);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-tnm{display:block;flex:1 1 auto;min-height:44px;margin:0;padding:0;border:0;background:none;font:inherit;font-size:15px;font-weight:600;line-height:1.35;',
  ' color:var(--ink);text-align:left;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical}',
  'button.rv-tnm{cursor:pointer}',
  'button.rv-tnm:hover{color:var(--c)}',
  'button.rv-tnm:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-tact{display:flex;align-items:center;gap:8px;min-height:44px}',
  '.rv-tact .btn{min-height:44px}',
  '.rv-tsub{font-size:13px;color:var(--mid)}',
  '.rv-ttick{flex:0 0 44px;width:44px;height:44px;padding:0;border:0;background:none;cursor:pointer}',
  '.rv-ttick svg{width:40px;height:40px}',
  '.rv-tile0{align-items:center;justify-content:center;--c:var(--edge-2);cursor:help}',
  '.rv-tdash{font-size:22px;color:var(--dim)}',
  '@container (max-width:639px){.rv .rv-tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}',
  /* THE WEEK'S BLOCKS, B3. Every column the same height, three blocks and two
     gaps, so the week stays one rectangle. A block is the kind's colour and
     ring, its short name on one line, the seat's small mark at the right
     edge; under a narrow column the symbol alone. No stagger: the stack is
     read by kind, row by row across the week. */
  '.rv .rv-wdl>li{--o:0px}',
  '.rv-wch.rv-blk{display:flex;align-items:center;justify-content:flex-start;gap:6px;padding:0 8px;text-align:left;container-type:inline-size}',
  '.rv-blk .rv-kic{color:var(--c)}',
  '.rv-bn{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:600;color:var(--ink)}',
  '.rv-bs{flex:0 0 auto;width:12px;height:12px;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
  '@container (max-width:84px){.rv-bn,.rv-bs{display:none} .rv-wch.rv-blk{justify-content:center;padding:0}}',
  /* states, kept quiet and named on the press: planned is an edge over a light
     tint, done a deeper tint and a check, missed a dashed dim edge, never red */
  '.rv-wch-done.rv-blk{background:color-mix(in srgb,var(--c) 38%,var(--panel));color:var(--ink);box-shadow:none}',
  '.rv-blk .rv-bok{flex:0 0 auto;width:14px;height:14px;fill:none;stroke:var(--ink);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-wch-miss.rv-blk .rv-bn{color:var(--dim)}',
  '.rv-wch-miss.rv-blk .rv-kic{color:var(--dim)}',
  /* the day heads stop being near white cards, B3: plain type on the panel,
     weekday small and date large, and only today lit, with one accent edge */
  '.rv .rv-wdh,.rv .rv-wdh b{background:none;color:var(--ink)}',
  '.rv .rv-wdh span{font-size:12px;font-weight:500;color:var(--mid)}',
  '.rv .rv-wdh b{font-size:18px}',
  '.rv .rv-wdh:hover{background:color-mix(in srgb,var(--ink) 7%,transparent)}',
  '.rv .rv-wd1.rv-now .rv-wdh,.rv .rv-wd1.rv-now .rv-wdh b{background:none;color:var(--ink)}',
  '.rv .rv-wd1.rv-now .rv-wdh{box-shadow:inset 0 0 0 1.5px var(--accent)}',
  '.rv .rv-wd1.rv-now .rv-wdh span{color:var(--accent)}',
  '.rv .rv-wd1.rv-now{box-shadow:none;background:color-mix(in srgb,var(--accent) 6%,transparent)}',
  '.rv .rv-wkg-now .rv-wd1:not(.rv-now) .rv-wch{opacity:.72}',
  /* CALLED FOR, B5: one short row a card */
  '.rv-cfl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.rv-cf{display:flex;align-items:center;gap:8px;min-height:56px;padding:6px 6px 6px 8px;border-radius:12px;background:color-mix(in srgb,var(--c) 12%,var(--panel-2))}',
  '.rv-cfr{flex:0 0 36px;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:var(--c);box-shadow:inset 0 0 0 1.5px var(--c);cursor:help}',
  '.rv-cfr:focus-visible,.rv-via:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-cfo{flex:1 1 auto;min-width:0;min-height:44px;display:flex;flex-direction:column;justify-content:center;gap:2px;padding:0 2px;border:0;background:none;font:inherit;text-align:left;cursor:pointer;color:var(--ink)}',
  '.rv-cfo:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-cfn{font-size:14px;font-weight:600;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
  '.rv-cfo:hover .rv-cfn{color:var(--c)}',
  '.rv-cfm{font-size:12.5px;color:var(--mid);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
  '.rv-via{flex:0 0 auto;width:28px;height:28px;display:grid;place-items:center;border-radius:50%;cursor:help}',
  '.rv-via svg{width:16px;height:16px;fill:none;stroke:var(--mid);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-cfa{flex:0 0 auto;min-height:44px;padding:0 14px}',
  '.rv-cfx{flex:0 0 44px;width:44px;height:44px;display:grid;place-items:center;padding:0;border:0;border-radius:50%;background:none;color:var(--mid);cursor:pointer}',
  '.rv-cfx .rv-ic{width:16px;height:16px;padding:6px;border-radius:50%;box-shadow:inset 0 0 0 1.5px currentColor}',
  '.rv-cfx:hover{color:var(--ink)}',
  '.rv-cfx:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-cfx0{flex:0 0 44px}',
  '.rv-cfmore{margin-top:8px;width:100%;min-height:44px}',
  /* THE POP-UP, B6, inside the one sheet. 480 on a desk; under 720 the sheet
     already rises from the bottom (shell/head.html) */
  '#sheet-card:has(.rv-pop){width:min(480px,100%)}',
  '@media (min-width:721px){#sheet:has(.rv-pop){align-items:center;justify-content:center}}',
  '.rv-pchips{display:flex;flex-wrap:wrap;gap:8px}',
  '.rv-pwhat{margin:0;font-size:15px;line-height:1.5;color:var(--ink)}',
  '.rv-pp{margin:6px 0 0;font-size:14px;line-height:1.5;color:var(--mid)}',
  '.rv-pp b{color:var(--ink);font-weight:600}',
  '.rv-pai{margin:6px 0 0;font-size:14px;line-height:1.5}',
  '.rv-pf{border-top:1px solid var(--edge);padding-top:8px}',
  '.rv-pf summary{min-height:44px;display:flex;align-items:center;cursor:pointer;font-size:14px;font-weight:600;color:var(--ink)}',
  '.rv-pf summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-pw{display:flex;flex-direction:column;gap:10px;border-top:1px solid var(--edge);padding-top:12px}',
  '.rv-pwh{display:inline-flex;align-items:center;gap:7px;align-self:flex-start;min-height:28px;font-size:14px;font-weight:600;color:var(--ink);cursor:help}',
  '.rv-pwh .rv-ic{width:18px;height:18px}',
  '.rv-pwl{margin:0;font-size:13.5px;color:var(--mid)}',
  '.rv-pdays{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}',
  '.rv-pd,.rv-pq{min-height:44px;min-width:44px;padding:0 10px;border-radius:10px;border:1px solid var(--edge-2);background:none;color:var(--mid);font:inherit;font-size:13.5px;cursor:pointer}',
  '.rv-pd{padding:0}',
  '.rv-pd.rv-on,.rv-pq.rv-on{background:color-mix(in srgb,var(--c) 30%,var(--panel-2));border-color:var(--c);color:var(--ink);font-weight:600}',
  '.rv-pd:focus-visible,.rv-pq:focus-visible,.rv-ptm input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-prow{display:flex;flex-wrap:wrap;gap:6px;align-items:center}',
  '.rv-ptm input{min-height:44px;padding:0 10px;border-radius:10px;border:1px solid var(--edge-2);background:var(--sunk);color:var(--ink);font:inherit;font-size:14px}',
  '.rv-pafl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.rv-paf1{display:flex;align-items:center;gap:8px;border-radius:12px;padding:2px 10px 2px 2px;background:color-mix(in srgb,var(--c) 10%,var(--panel-2))}',
  '.rv-paf1.rv-on{background:color-mix(in srgb,var(--c) 22%,var(--panel-2))}',
  '.rv-pafq{font-size:15px;line-height:1.4;color:var(--ink)}',
  '.rv-pgoal .rv-sec{margin:0;padding:0;background:none;border:0}',
  '.rv-pgoal .rv-sec>.rv-hd{display:none}',
  '.rv-pgoal .rv-chain{margin:0}',
  /* the streak strip, four even chips with Marks, B12 */
  '#flowhd .acs-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}',
  '#flowhd .acs{justify-content:center;padding:0 6px}',
  '.acs-marks{--c:var(--sec-discover)}'
 ].join('\n');
 document.head.appendChild(st);}
