/* ============================================================
   THE RITUAL BANK: ONE CALLED FOR CARD, ONE POP-UP, ONE WRITER. 20 November.

   Why a file of its own. The Called for card was drawn inline in ritSugHtml
   (ui/ritstage.js), and the Path and Avatar seats were each about to draw a
   card for the same practice from their own pages. Three cards for one
   practice is three answers to "what does Add do", and they drift: the
   Ritual card's chip already disagreed with its own tooltip (Not tried yet
   over Kept on 0 days, fixed at ritSugRecWord). So the card's face, the
   pop-up it opens and the writer the pop-up calls live here, and a host draws
   ritBankCard and wires its data-act presses. Ritual is the first host. The
   Path and Avatar seats call the same three functions and write nothing of
   their own.

   THE WRITER IS ritStartPlan WITH join, never a second writer. The defect
   this file was asked to close: a second day added to a practice already
   running replaced the first (ritStartPlan, ui/ritual.js, says how). Every
   Add here joins, and a day set Once rides the plan's ex list, so a Thursday
   dropped on a weekday plan is that one Thursday and not every Thursday.

   WHAT IS ON THE RECORD, 21 November. A plan's days and time ride the plan,
   and affirmations and challenges are not plans, so they get rows of their
   own, deliberately not inside the ritual more key, whose writer rebuilds
   its entry from a fixed shape and would erase any field it does not know.
   Both were beside the record in this browser until his ruling, "rituals
   travel with the record, they don't stay on the device", and both are on
   the practice object now (p.practice.plans and p.practice.sched, practice
   schema 2, engine/practice.js), so they go with an export and a record
   link. A row still under atuned-ritual-sched from before is moved onto the
   record the first time the page reads it (ritAdopt, ui/ritual.js).

   IF I MISS, THE FRAME AND NOT THE CONTENT. Ruled 18 November
   (DECISIONS.md, "If I miss"): nothing can be forced, the app can only take
   the person's word, and what happens has to be something the person can
   learn and not a punishment; build the shell now and the content later.
   So the frame is built and holds one choice the team defaulted, answer why,
   because the why question is the one thing every design of this asked
   first, plus the person's own words. It never takes points, never touches
   the streak or the record, never draws red, and one offer is open at a time.
   THE DEFAULT IS THE TEAM'S AND HE MAY OVERRIDE IT: the choices are
   RIT_MISS, one table, and nothing else names them.
   ============================================================ */

/* ---------------- a time of day ----------------
   HH:MM, 00:00 to 23:59, and nothing else. 24:00 and 7:5 are refused by name
   and never rounded, because a rounded time is a time the person never set.
   No time is any time. The field is a text field and not type=time on
   purpose: a time picker cannot produce 24:00, so a refusal behind one would
   be a rule nothing could reach, and a typed time is what a phone keyboard
   and a screen reader both give. Nothing reminds anyone of the time yet, the
   product has no push, and the pop-up says so where the time is set.
   RIT_AT_RX and ritAtOk are in engine/practice.js since 21 November, because
   the boundary refuses a plan's time by the same rule the pop-up does. */
function ritAtNo(s){
 return '"'+String(s).slice(0,12)+'" is not a time of day. Write hours and minutes, 00:00 to 23:59. Nothing changed.';}

/* ---------------- When: days, time, repeat ----------------
   One state the pop-up owns, W: on (null is every day, else stored weekdays,
   Monday 0, ritWd's numbering), at ('' is any time) and rep, a repeat in
   days (1 Once, then the builder's own lengths). own and wp are the repeat
   band's two (ritRecurHtml below): own is Set days chosen while every day is
   still lit, and wp is which of When and Where is open. RIT_REP IS RIT_SPANS,
   one table: the pop-up kept a copy of its own with Once where the builder
   said A day, and the two drifted the day the builder's list grew. */
RIT.pop=null;
var RIT_REP=RIT_SPANS;
var RIT_REP_SAY={1:'once', 0:'with no end'};
RIT_SPANS.forEach(function(s){if(!RIT_REP_SAY[s.d])RIT_REP_SAY[s.d]='for '+s.say;});
function ritWhen0(p){
 var rep=p&&typeof p.days==='number'&&RIT_REP.some(function(r){return r.d===p.days;})?p.days:7;
 return {on:p&&p.on?p.on.slice():null, at:(p&&p.at)||'', rep:rep, own:false, wp:null};}
function ritWhenHtml(W){
 return ritRecurHtml(W,{a:'data-sh', id:'rv-p', col:'var(--c)'});}

/* ---------------- one repeat band, two hosts ----------------
   20 NOVEMBER, GRADED D-, his words on the builder: "This panel takes up too
   much space ... how long a day, a week, 2 weeks, no end, plus Sunday,
   Monday ... every day and Wednesday, those are all spread out, but those
   are all describing one system, which is, do you want it reoccurring? And
   then select the days of the week you want it reoccurring and for how long.
   That's just a number." Measured at 390 before this: the builder was 678
   pixels tall with 22 controls, and its Every day and Weekdays pills, seven
   day letters and four How long pills were three groups in three places for
   one answer. The pop-up drew the same three again as four rows of its own.
   So the answer is one shaded band, drawn by this one function for both:
   row A is Repeat (Once, Every day, Weekdays, Set days), For (a number of
   weeks, or No end, not drawn on Once) and the When and Where icons; row B
   is the seven days, or on Once the next seven dates.
   "MAYBE WHEN AND WHERE IS A CALENDAR ICON THEY CAN CLICK ON, SO WE CAN
   CLAIM ALL THAT SPACE FROM THOSE BLACK FIELDS." The two black fields were
   never broken: they were plain text fields on --sunk, the darkest token,
   with no hint text because SV19 struck the sample answer, stretched under an
   11 pixel label. They are the icons now, and each opens a small panel under
   the band holding the same field by the same id and cap, so the boundary
   and every gate that reads #ritwhen's maxLength still find it. The panels
   are drawn and hidden, never left out, for the same reason.
   o.a is the attribute a press carries, data-act on the builder's host and
   data-sh in the sheet, so each host keeps the one listener it has. o.id
   prefixes every id, o.cue and o.where are the host's own field markup and
   o.cueV and o.whereV their values, and both are optional: the pop-up writes
   no cue and no place, so it draws no Where. Every press ends in
   ritRecurAct, so the two hosts cannot disagree about what a press does. */
var RIT_RMODE=[{k:'once',nm:'Once'},{k:'all',nm:'Every day'},{k:'wk',nm:'Weekdays'},{k:'own',nm:'Set days'}];
function ritRecurMode(R){
 if(R.rep===1)return 'once';
 if(R.own)return 'own';
 if(!R.on)return 'all';
 return R.on.join()==='0,1,2,3,4'?'wk':'own';}
function ritRecurHtml(R,o){
 ritBankCss();
 var A=o.a, id=o.id, m=ritRecurMode(R), on=R.on||[0,1,2,3,4,5,6], today=ritToday0();
 var opt=function(v,nm,y){return '<option value="'+v+'"'+(y?' selected':'')+'>'+esc(nm)+'</option>';};
 var rep='<label class="rv-rsel rv-rrep" data-tip-t="Repeat" data-tip="Does it repeat: once, every day, weekdays, or only the days you set.">'
  +'<select '+A+'="rc-rep" aria-label="Repeat">'
  +RIT_RMODE.map(function(x){return opt(x.k,x.nm,x.k===m);}).join('')+'</select>'+ritIc('down','rv-ic rv-rch')+'</label>';
 /* For is a number of weeks or no end, and on Once there is no length to
    give. o.left is an edit's own first answer, what is left, because a
    length chosen on a ritual five weeks old runs from today (ritSaveEdit)
    and a dropdown reading 1 week over it would be a claim */
 var fr=m==='once'?'':'<label class="rv-rsel rv-rfor" data-tip-t="For" data-tip="How long it runs. No end keeps it until you stop it.">'
  +'<select '+A+'="rc-for" aria-label="For how long">'
  +(o.left&&R.rep<0?opt(-1,o.left,true):'')
  +RIT_SPANS.filter(function(s){return s.d!==1;}).map(function(s){return opt(s.d,s.nm,s.d===R.rep);}).join('')+'</select>'+ritIc('down','rv-ic rv-rch')+'</label>';
 /* an icon carries what it holds in its name and its dot, and the value
    itself stays off the row: a screen reader hears "When: 07:30, after
    coffee", and a row of 44 pixel icons is not stretched by a sentence */
 var ib=function(k,ic,nm,say,tip){var set=!!say, op=R.wp===k;
  return '<button type="button" class="rv-rib'+(set?' rv-set':'')+'" '+A+'="rc-pop" data-v="'+k+'" aria-expanded="'+op
   +'" aria-controls="'+id+k+'o" aria-label="'+esc(nm+': '+(say||'not set'))+'" data-tip-t="'+nm+'" data-tip="'+esc(tip)+'">'
   +ritIc(ic)+(set?'<i aria-hidden="true"></i>':'')+'</button>';};
 var wSay=[R.at,o.cueV].filter(Boolean).join(', ');
 var row='<div class="rv-rca">'+rep+fr
  +ib('when','cal','When',wSay,'The time and the cue that starts it.')
  +(o.where?ib('where','pin','Where',o.whereV||'','The place you will do it.'):'')+'</div>';
 /* ONE BAR OF SEVEN, Sunday first, RIT_WCOL. The row it replaces asked for
    seven columns of at least 44 with 4 between, 332 pixels, in the 316 a
    phone has, and its last Saturday ran into the card's edge. Seven equal
    shares of the row with a hairline between cannot overflow it, and at 390
    each is 44. On Once the same seven are the next
    seven dates, and since seven days in a row are seven different weekdays,
    each date is still one stored weekday and the press is the same press. */
 var cells=[0,1,2,3,4,5,6].map(function(i){
  var wd=m==='once'?ritWd(today+i):RIT_WCOL[i], y=on.indexOf(wd)>=0, lab, face;
  if(m==='once'){var dt=ritDateOf(today+i);
   lab=i?RIT_WDF[wd]+' '+dt.getDate():'Today';
   face='<small>'+(i?RIT_WDN[wd]:'Today')+'</small><b>'+dt.getDate()+'</b>';}
  else{lab=RIT_WDF[wd]; face=RIT_WD[wd];}
  return '<button type="button" class="rv-rd'+(y?' rv-on':'')+'" '+A+'="rc-d" data-d="'+wd+'" aria-pressed="'+y+'" aria-label="'+lab+'">'+face+'</button>';}).join('');
 var days='<div class="rv-rcd" role="group" aria-label="'+(m==='once'?'Dates':'Days')+'">'+cells+'</div>';
 /* the time is a typed HH:MM and never a picker, ritAtOk says why, and
    nothing reminds anyone of it yet, which is said where it is set */
 var wo='<div class="rv-ro" id="'+id+'wheno" role="group" aria-label="When"'+(R.wp==='when'?'':' hidden')+'>'
  +'<div class="rv-rot"><button type="button" class="rv-rq'+(R.at?'':' rv-on')+'" '+A+'="rc-any" aria-pressed="'+!R.at+'">Any time</button>'
  +'<input type="text" class="rv-rat" id="'+id+'at" inputmode="numeric" maxlength="5" placeholder="07:30" autocomplete="off" value="'+esc(R.at||'')
  +'" aria-label="Time of day, hours and minutes"></div>'
  +(o.cue||'')+'<p class="rv-rno">A time orders your day. Nothing reminds you of it yet.</p></div>';
 var ro=o.where?'<div class="rv-ro" id="'+id+'whereo" role="group" aria-label="Where"'+(R.wp==='where'?'':' hidden')+'>'+o.where+'</div>':'';
 return '<div class="rv-rc" id="'+id+'when" data-rc="'+A+'">'+row+days+wo+ro+'</div>';}
/* what a press on the band does, for both hosts. The last day lit cannot be
   pressed off, the rule both day rows already kept: a ritual due on no day
   is not one, and the cell says so by staying lit rather than by an error. */
function ritRecurAct(R,a,v){
 switch(a){
  case 'rc-rep':
   if(v==='once'){R.rep=1; R.own=false;
    /* Once from every day is today, not the coming seven: Once means once */
    if(!R.on)R.on=[ritWd(ritToday0())];}
   else{if(R.rep===1||R.rep==null)R.rep=7;
    R.own=v==='own';
    if(v==='all')R.on=null;
    if(v==='wk')R.on=[0,1,2,3,4];}
   return true;
  case 'rc-for': R.rep=+v; return true;
  case 'rc-d': {var wd=+v, cur=(R.on||[0,1,2,3,4,5,6]).slice(), at=cur.indexOf(wd);
   if(at>=0){if(cur.length>1)cur.splice(at,1);} else cur.push(wd);
   cur.sort(); R.on=cur.length===7?null:cur;
   if(R.rep!==1)R.own=true;
   return true;}
  case 'rc-pop': R.wp=R.wp===v?null:v; return true;
  case 'rc-any': R.at=''; return true;
  default: return false;}}
/* ESCAPE SHUTS THE PANEL BEFORE THE SHEET. Captured on the document, so in
   the pop-up it is the panel that closes and not the whole sheet behind it,
   and the keyboard goes back to the icon that opened it. */
if(typeof document!=='undefined')document.addEventListener('keydown',function(ev){
 if(ev.key!=='Escape')return;
 var t=ev.target, band=t&&t.closest&&t.closest('.rv-rc'); if(!band)return;
 var op=band.querySelector('.rv-ro:not([hidden])'); if(!op)return;
 var k=op.id.slice(-5)==='wheno'?'when':'where', b=band.querySelector('[data-v="'+k+'"]');
 ev.stopPropagation(); ev.preventDefault();
 if(b)b.click();
 var id=band.id;
 var f=document.getElementById(id)&&document.getElementById(id).querySelector('[data-v="'+k+'"]'); if(f)f.focus();},true);
/* the first set day on or after today, and for Once the last set day inside
   the coming seven, so Once on Tuesday and Thursday is this Tuesday and this
   Thursday and then it ends */
function ritWhenSpan(W,today){
 var on=W.on, first=today, last=today;
 if(on){first=null;
  for(var i=0;i<7;i++)if(on.indexOf(ritWd(today+i))>=0){if(first===null)first=today+i; last=today+i;}}
 if(W.rep!==1)return {from:first, days:W.rep, list:null};
 var list=[]; for(var d=first;d<=last;d++)if(!on||on.indexOf(ritWd(d))>=0)list.push(d);
 return {from:first, days:last-first+1, list:list};}
function ritWhenSay(W,from,today){
 var dt=ritDateOf(from), day=(from===today?'today':RIT_WDN[ritWd(from)]+' '+dt.getDate());
 /* inside a sentence the plain words go lower case and a day's name keeps
    its capital, so "every day but Sat" and "Tue, Thu" both read right */
 var often=W.on?ritOften(W.on).replace(/^(Every|Weekdays|Weekends)/,function(m){return m.toLowerCase();}):'every day';
 return 'from '+day+(W.at?', at '+W.at:'')+', '+often+', '+RIT_REP_SAY[W.rep];}

/* ---------------- Source AI's own sentences ----------------
   The 15 November ruling: a sentence the app composed carries srcMark (ui/
   storyui.js) and the src-ai treatment, both, never the mark alone, and one
   mark everywhere. On this tab that is the reasons a card is offered, the
   goal's held pattern sentence and a challenge's who line. The person's own
   words (an avatar line, their own If I miss) never carry it. */
function ritAiHtml(t,tag){
 tag=tag||'li';
 return '<'+tag+' class="src-ai">'+((typeof srcMark==='function')?srcMark():'')+esc(t)+'</'+tag+'>';}

/* ---------------- the card's kind ----------------
   THE FILL SAYS WHAT KIND OF THING IT IS, graded D-4 on 20 November, his
   words: "We don't need the icon, the large icon ... It's taking up a lot of
   space. And we can allow the background color to define whether something's
   an affirmation or a challenge or whatever." The card was filled with its
   seat's colour and led by a 72 by 53 ring badge, so the colour and the mark
   both said where in the body and nothing said what the card was. The fill is
   the practice's track now, PTRACK (engine/data/practice.js), the table the
   builder's tiles and the Active rows already colour by, so no colour is new.
   The seat is not lost: its tag keeps its own colour and glyph. Round QS's
   "colour of the chakra with its symbol" moves from the fill and the badge to
   that tag, which is this ruling overriding that one.
   And the colour is never alone, unpack every symbol: the track's word is
   printed on the card and its meaning is on the word's hover and tap. Only
   practices reach Called for today; an affirmation or a challenge that ever
   does needs its own entry here, and the challenge's colour is his to pick. */
/* THE FILL IS THE KIND NOW, 21 November, and no longer the track. His D-4
   words asked for exactly this, "the background color to define whether
   something's an affirmation or a challenge", and the track was the nearest
   table that existed then. The week's blocks are coloured by the four kinds
   from today (ui/ritweek.js), and one page with colour meaning the kind on the
   week and the track on the card beside it would be one colour meaning two
   things. So the card wears its practice's kind, the same mark, word and
   sentence the week's key carries. PTRACK still colours the builder's tiles,
   which is a different surface. */
function ritSugKind(x){
 var K=ritKind(ritKindOf(x));
 return {k:K.k, nm:K.nm, col:ritKindCol(K.k), says:'The card\'s colour is its kind. '+K.says};}

/* ---------------- the card ----------------
   The Called for card's face. Since the D-4 grade of 20 November it is three
   rows and three presses: the name as the headline with Add and Dismiss
   beside it, then the track, the minutes, the two chips and the seats, then
   the library's line. i is the card's place in RIT.sug, which is what every
   press carries. A host other than Ritual sets RIT.sug to its own list and
   wires the same data-act names (sug, sug-x, bank) to the same functions.
   Save and the reasons are one press away, in the pop-up the name opens. */
function ritBankCard(x,i,st){
 /* the look is injected with the first card, not with the first pop-up: the
    name is a button now, and a button with no rule of its own is drawn by
    the browser as a white box on every card until a pop-up has opened */
 ritBankCss();
 var K=ritSugKind(x);
 /* THE CARD IS SHORT, 21 November, his 18 November words: "Simplify them.
    It just needs to be a little text and the buttons that I need to do ...
    And if I click on it, then I got a pop-up that tells me information
    about it." Its second row is the kind and the minutes, and nothing else:
    Toward, the person's record with it, the seats and the library's line
    moved into the pop-up the name opens (ritPopSug), nothing cut. The kind's
    word is still the finger's grip for a drag onto a day. */
 var chips='<div class="rv-sgo"><span class="rv-sgk" data-grip="1"'+rvTip(K.nm,K.says)+'>'+ritKindIc(K.k)+esc(K.nm)+'</span>'
  +'<span class="rv-sgm">'+x.p.min+(x.p.min===1?' minute':' minutes')+'</span></div>';
 return '<li class="rv-sg1" style="--c:'+K.col+'" data-kind="'+K.k+'" data-drag="sug" data-i="'+i+'">'
  /* THE NAME IS THE HEADLINE AND OPENS THE POP-UP. His words, D-4: "The text
     is a headline, like a news headline. It is the thing that calls my
     attention ... If I click the text, then it should give me the pop-up."
     Days, a time and a repeat are set there, the reasons and Save are there,
     and it is the keyboard's way to put the card on a day, the same thing a
     drag onto the week does. */
  +'<div class="rv-sgh"><button type="button" class="rv-sgn rv-bko" data-act="bank" data-i="'+i+'" aria-label="'+esc(x.p.nm)+': why, days, time and repeat">'
   +esc(x.p.nm)+'</button>'
  /* GREEN ADDS, RED DISMISSES, D-4. His words: "Add is overwhelming, and the
     dismiss is ineffectual ... Maybe just like a green or red button, so they
     can either just press a green or press a red." Add was a 138 pixel pill
     and Dismiss grey text pushed to the row's end, so the pair read as one
     answer and an afterthought. They are two equal squares now, solid
     --good and --bad, the theme's own tokens, with a stroked check and cross.
     ADD WRITES AND OPENS NOTHING, "If I click on add, that should
     automatically add it to my schedule, not give me the pop-up": the press
     is ritBankAdd with the pop-up's own default, every day, any time, a week,
     the span the accessible name says. Dismiss keeps Put back beside the
     list. Save, round QX's third answer, is in the pop-up. */
  +'<span class="rv-sga"><button type="button" class="rv-yes" data-act="sug" data-i="'+i+'" aria-label="Add '+esc(x.p.nm)+' to practice, every day, for a week"'
   +' data-tip-t="Add" data-tip="Puts it on your week: every day, any time, for a week. Press the name to pick days and a time.">'
   +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></button>'
  +'<button type="button" class="rv-no" data-act="sug-x" data-i="'+i+'" aria-label="Dismiss '+esc(x.p.nm)+'"'
   /* "Takes it off Today", round SW: the card's own heading renamed
      (ritstage.js), so its own tooltip reads the same word back */
   +' data-tip-t="Dismiss" data-tip="Takes it off Today. Put back is offered in the same place.">'
   +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12 M18 6L6 18"/></svg></button></span></div>'
  +chips+'</li>';}

/* ---------------- the schedule rows for affirmations and challenges ---------------- */
/* THE OLD KEY, read once and emptied. The rows are on the record since 21
   November (p.practice.sched, practice schema 2); this key is kept only so
   ritAdopt can move what a browser still holds there, and so accForget can
   clear what is left of a deleted profile. Nothing writes it. RIT_MISS and
   the three text ceilings are in engine/practice.js, which refuses a row by
   the same rule this file draws it by. */
var RIT_SCHED_KEY='atuned-ritual-sched';
var RIT_MISS_AT=3;
function ritSchedAll(){
 if(typeof STORE==='undefined')return {};
 try{var o=JSON.parse(STORE.get(RIT_SCHED_KEY)||'{}');
  return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}catch(e){return {};}}
/* the boundary's rule asked whether it found anything, so a row the record
   would refuse is never drawn and never adopted. One rule, two postures:
   named on the record, a yes or no here. */
function ritSchedOk(r){var e=[]; practiceSchedCheck(e,'sched',r); return !e.length;}
/* the one shape a row is written in, so a row adopted off the device carries
   nothing the record's closed key set would refuse */
function ritSchedShape(r){
 return {id:r.id, kind:r.kind, on:r.on?r.on.slice().sort():null, at:r.at||'', from:r.from, days:r.days,
  ex:r.ex?r.ex.slice():null, miss:r.miss?{k:r.miss.k, own:r.miss.own||''}:null,
  ack:(r.ack==null?null:r.ack), ans:(r.ans||[]).map(function(a){return {d:a.d, why:a.why};})};}
function ritSched(){
 if(!CURP||!CURP.id)return [];
 ritAdopt();
 var a=CURP.practice&&CURP.practice.sched;
 if(!Array.isArray(a))return [];
 return a.filter(ritSchedOk).map(ritSchedShape);}
function ritSchedOf(id){return ritSched().filter(function(r){return r.id===id;})[0]||null;}
/* ONE WRITER for the rows, the ritWrite posture: a worked example is refused
   by name, the rows go onto the record and the record is saved, and a save
   that did not land puts the rows back and says so, so a control never
   claims a save it does not have. The message was "Your browser refused the
   write" and stays so, because a refused pSave is exactly that. */
function ritSchedWrite(fn,msg){
 if(!ritOwn()){status(ritWhose()+' is a worked example, so nothing was saved to it.','fail');return false;}
 var P=CURP.practice||(CURP.practice=practiceBlank()), was=P.sched, ok=false;
 try{var cur=fn(ritSched());
  if(cur){P.sched=cur.map(ritSchedShape); ok=ritSchedPutOk(P.sched)&&!!pSave();}
  else ok=true;}
 catch(err){ok=false;}
 if(!ok){P.sched=was; try{pSave();}catch(e){}
  status('Not saved. Your browser refused the write. Nothing changed.','fail'); ritRender(); return false;}
 if(msg)status(msg);
 ritRender(); return true;}
/* a list the boundary would refuse is never saved: the next load would set
   the whole record aside over one row */
function ritSchedPutOk(list){
 var e=[]; practicePlansCheck(e,'sched',list,PR_SCHED_CAP,practiceSchedCheck); return !e.length;}
function ritSchedCovers(r,day){
 return ritCovers({from:r.from, days:r.days, on:r.on, stop:null, ex:r.ex},day);}
function ritSchedActive(r,today){
 return ritActive({from:r.from, days:r.days, stop:null, ex:r.ex},today);}
/* the challenge a row is for, found again by its id among the ones the
   reading names now. A row whose challenge the reading no longer names draws
   nothing: a challenge nothing points to is not offered, the rule ritChallenge
   already keeps. */
function ritSchedChal(r,st){
 st._ch=st._ch||ritChallenge(st);
 return st._ch.filter(function(c){return 'ch:'+c.id===r.id;})[0]||null;}
/* the blocks a row puts on a day, for the week. Done once a line was said or
   the challenge marked done that day, read off the same marks the Today
   ticks write (ritMore), so the two cannot disagree about a day. */
function ritSchedSegs(d,st){
 var out=[], M=st._mo=st._mo||ritMore();
 ritSched().forEach(function(r){
  if(!ritSchedCovers(r,d))return;
  var nm, b='', done;
  if(r.kind==='aff'){nm='Affirmations'; done=M.said.some(function(x){return x[0]===d;});}
  else{var c=ritSchedChal(r,st); if(!c)return; nm=c.nm; b=c.b||''; done=ritDayOn(M.did,d,c.id);}
  out.push({sc:r, nm:nm, b:b, col:b?seatCol(b):'var(--accent)',
   st:done?'done':d<st.today?'miss':d===st.today?'plan':'ahead'});});
 return out;}

/* ---------------- if I miss: when it is offered ----------------
   Three set days in a row with the challenge not marked done, counted back
   from yesterday (today is still open, never a miss), and only over days
   after the last offer was answered, so one offer is open at a time and a
   long run of misses is one question and not a pile of them. A set day with
   the challenge done ends the run. */
function ritMissRun(r,st){
 var c=ritSchedChal(r,st); if(!c||!r.miss)return {n:0, last:null};
 var M=st._mo=st._mo||ritMore(), s=pracDay(r.from), lo=r.ack==null?s:Math.max(s,r.ack+1), n=0, last=null;
 for(var d=st.today-1;d>=lo;d--){
  if(!ritSchedCovers(r,d))continue;
  if(ritDayOn(M.did,d,c.id))break;
  if(last===null)last=d; n++;}
 return {n:n, last:last};}
function ritMissOffer(r,st){var R=ritMissRun(r,st); return R.n>=RIT_MISS_AT?R:null;}

/* ---------------- the pop-up ----------------
   One sheet, the product's (sheetOpen, ui/panels.js), which closes on its
   backdrop and on Escape. It keeps its own state, RIT.pop, because the page
   redraws under it after every write. Every message goes through status(),
   and nothing claims success before its writer answers. */
function ritPopShell(col,head,sub,body,acts){
 return '<div class="rv-sh rv-pop" style="--c:'+col+'"><div class="rv-shh"><span class="rv-sht"><span class="sh-h plain">'+esc(head)+'</span>'
  +(sub?'<span class="rv-shs">'+esc(sub)+'</span>':'')+'</span></div>'+body
  +'<div class="sh-act rv-sha">'+acts+'<button type="button" class="btn rv-shx" data-sh="close">Close</button></div></div>';}
function ritPopGone(t){return ritPopShell('var(--accent)',t,'','','');}
function ritFold(nm,body){
 return body?'<details class="rv-pf"><summary>'+esc(nm)+'</summary>'+body+'</details>':'';}
/* ---------------- what the Today list carried, in the pop-up ----------------
   21 November. The Today card is gone (ui/ritcal.js lists where each of its
   controls went), and a ritual that is running keeps its Timer, its Stop and,
   for a release schedule tied to a place held at four or more, Release now,
   here: on the block's pop-up (ritSashSheet) and on the Called for pop-up of
   a practice already on the week. One helper, so the two cannot drift. The
   presses are data-sh, the sheet's own attribute, and ritBankAct does them. */
function ritRunActs(p,today){
 if(!p||!ritActive(p,today))return '';
 return '<div class="rv-prun" role="group" aria-label="Running">'
  +ritTimerHtml(p).replace('data-act="timer"','data-sh="ptimer"')
  +(p.rel!=null&&BY[p.rel]&&BY[p.rel].sq>=4?'<button type="button" class="btn" data-sh="prel" data-n="'+p.rel+'">Release now</button>':'')
  +'<button type="button" class="btn" data-sh="pstop" data-id="'+p.id+'">Stop</button></div>';}
/* a said or a did ring in a pop-up, the Today list's own press, today only */
function ritPopTick(kind,id,line,on,col,ai){
 return '<li class="rv-ptk'+(on?' rv-on':'')+'" style="--c:'+col+'"><button type="button" class="rv-log" data-sh="'+kind+'" data-id="'+esc(id)+'" aria-pressed="'+on+'" aria-label="'
  +esc(on?(kind==='said'?'Said today':'Done today')+'. Press to take it off':(kind==='said'?'Mark said today':'Mark done today'))+'">'+ritTickHtml(on,col)+'</button>'
  +'<span class="rv-ptq'+(ai?' src-ai':'')+'">'+line+'</span></li>';}
function ritPopSug(st){
 var P=RIT.pop, x=(RIT.sug||[]).filter(function(s){return ritSugKey(s)===P.key;})[0]||P.x;
 if(!x)return ritPopGone('This one is no longer called for.');
 /* the pop-up wears its card's fill, the track, so the two read as one thing */
 var i=(RIT.sug||[]).indexOf(x), col=ritSugKind(x).col;
 var R=ritSugRec(x,(st.r.loaded||[]).length), T=ritSugToward(x);
 var steps=ritSteps({steps:[x.k]}), run=ritPlans().filter(function(p){return ritKey(p.steps)===x.k&&ritActive(p,st.today);})[0];
 /* what the short card no longer prints: its kind, the seats it is for, and
    the person's record with it, each a chip carrying its meaning */
 var chips='<div class="rv-pchips">'+ritKindChip(ritKindOf(x))+x.seats.map(function(b){
   return '<span class="rv-kch" style="--c:'+seatCol(b)+'"'+rvTip(ritTagNm(b)+' point','The place in your body this is for.')+'><svg viewBox="0 0 24 24" class="rv-kic" aria-hidden="true">'
    +(SEATGLYPH[b]||SEATGLYPH._)+'</svg><span>'+esc(ritTagNm(b))+'</span></span>';}).join('')
  +'<span class="rv-kch" style="--c:var(--mid)"'+rvTip('Your record with it',ritSugRecSays(x,R).join(' '))+'><span>'+esc(ritSugRecWord(R))+'</span></span></div>';
 var body=chips+(x.p.d?'<p class="rv-pwhat">'+esc(x.p.d)+'</p>':'')+ritRunActs(run,st.today)
  +ritFold('Why here','<ul class="rv-pwl">'+x.why.map(function(w){return ritAiHtml(w);}).join('')+'</ul>'
   +(T?'<p class="rv-pp">Toward '+esc(T.opp.toLowerCase())+': the quality release puts back where '+esc(ritCfWord(T.nm))+' was held.</p>':'')
   +ritSugRecSays(x,R).map(function(w){return '<p class="rv-pp">'+esc(w)+'</p>';}).join(''))
  +ritFold('How',steps.map(function(s){return '<p class="rv-pp">'+esc(s.how)+'</p>';}).join(''))
  +ritWhenHtml(P.W);
 var acts='<button type="button" class="btn pri" data-sh="badd">Add</button>'
  +(i>=0?'<button type="button" class="btn" data-sh="bsave" data-i="'+i+'">Save</button>'
   +'<button type="button" class="btn" data-sh="bdrop" data-i="'+i+'">Dismiss</button>':'');
 return ritPopShell(col,x.p.nm,x.p.min+(x.p.min===1?' minute':' minutes'),body,acts);}
function ritPopAff(st){
 var P=RIT.pop, r=ritSchedOf('aff'), A=ritAffirm(st);
 var M=st._mo=st._mo||ritMore();
 /* THE SAID RINGS LIVE HERE NOW, 21 November: they were on the Today list's
    rows, which are gone. The same press through the same writer (ritDayMark),
    today only, and a line Source AI composed keeps its mark. */
 var body='<ul class="rv-pticks" aria-label="Said today">'+A.map(function(a){
   return ritPopTick('said',a.id,(a.ai&&typeof srcMark==='function'?srcMark():'')+(a.own?'"'+esc(a.line)+'"':esc(a.line)),
    ritDayOn(M.said,st.today,a.id),a.b?seatCol(a.b):ritKindCol('aff'),a.ai);}).join('')+'</ul>'
  +ritWhenHtml(P.W);
 var acts='<button type="button" class="btn pri" data-sh="baff">'+(r?'Change days':'Add to my week')+'</button>'
  +(r?'<button type="button" class="btn" data-sh="bstop">Stop all days</button>':'');
 return ritPopShell(ritKindCol('aff'),'Affirmations',r?'On your week, '+ritOften(r.on).toLowerCase():'Not on your week yet',body,acts);}
function ritMissHtml(P,r){
 var k=P.mk||(r&&r.miss&&r.miss.k)||RIT_MISS[0].k, own=P.own!=null?P.own:((r&&r.miss&&r.miss.own)||'');
 return '<div class="rv-pw rv-miss" id="rv-pmiss"><span class="rv-pwh"'+rvTip('If I miss','What you agree to do if '+RIT_MISS_AT
   +' of its set days pass in a row without it. It never takes points, never touches your streak, and only your word counts.')+'>'
  +ritIc('ring')+'If I miss</span>'
  +'<div class="rv-prow" role="radiogroup" aria-label="If I miss">'+RIT_MISS.map(function(m){var y=m.k===k;
   return '<button type="button" class="rv-pq'+(y?' rv-on':'')+'" role="radio" data-sh="pmk" data-d="'+m.k+'" aria-checked="'+y+'"'
    +' data-tip-t="'+esc(m.nm)+'" data-tip="'+esc(m.says)+'">'+esc(m.nm)+'</button>';}).join('')+'</div>'
  +'<p class="rv-pp">'+esc((RIT_MISS.filter(function(m){return m.k===k;})[0]||RIT_MISS[0]).says)+'</p>'
  +(k==='own'?'<input type="text" class="rv-pown" id="rv-pown" maxlength="'+RIT_OWN_MAX+'" value="'+esc(own)
   +'" aria-label="If I miss, what you will do, in your words">':'')+'</div>';}
function ritPopChal(st){
 var P=RIT.pop, r=ritSchedOf(P.id), c=r?ritSchedChal(r,st):ritChallenge(st).filter(function(x){return 'ch:'+x.id===P.id;})[0];
 if(!c)return ritPopGone('This challenge is no longer read from your stories.');
 var col=c.b?seatCol(c.b):'var(--accent)', off=r?ritMissOffer(r,st):null;
 /* THE WHY QUESTION FIRST, when an offer is open: it is the first thing in
    the pop-up, ahead of the challenge itself, and nothing else is asked */
 var why=off?'<div class="rv-pw rv-mwhy"><span class="rv-pwh">'+ritIc('ring')+'Three set days missed</span>'
   +'<label class="rv-pp" for="rv-mwhy">What got in the way?</label>'
   +'<textarea id="rv-mwhy" class="rv-pwhy" maxlength="'+RIT_WHY_MAX+'" rows="3"></textarea>'
   +'<p class="rv-pp">You agreed: '+(r.miss.k==='own'&&r.miss.own?'"'+esc(r.miss.own)+'"':esc((RIT_MISS.filter(function(m){return m.k===r.miss.k;})[0]||RIT_MISS[0]).nm.toLowerCase()))+'.</p>'
   +'<div class="rv-prow"><button type="button" class="btn pri" data-sh="bwhy">Save my answer</button></div></div>':'';
 var last=r&&r.ans.length?r.ans[r.ans.length-1]:null;
 var M=st._mo=st._mo||ritMore();
 /* the did ring, which the Today list's row carried, today only */
 var body=why+'<ul class="rv-pticks" aria-label="Done today">'+ritPopTick('did',c.id,esc(c.act),ritDayOn(M.did,st.today,c.id),col,false)+'</ul>'
  +'<p class="rv-pp"><b>When it applies.</b> '+esc(c.when)+'</p>'
  +ritAiHtml('Who it answers: '+c.who+'.','p')
  +(last?'<p class="rv-pp">Your last answer: "'+esc(last.why)+'"</p>':'')
  +ritWhenHtml(P.W)+ritMissHtml(P,r);
 var acts='<button type="button" class="btn pri" data-sh="bagree">Agree</button>'
  +(r?'<button type="button" class="btn" data-sh="bstop">Stop all days</button>':'');
 return ritPopShell(col,c.nm,r?'On your week, '+ritOften(r.on).toLowerCase():'Challenge',body,acts);}
/* THE GOAL'S POP-UP, 21 November. The Goal card left the centre for a tile
   in the top row (ui/ritweek.js), and its whole markup opens here, with the
   chain from the story to the work, which left Success over time when that
   moved to the rail. Its presses are rewritten to the sheet's own attribute,
   because the sheet is outside the page's listener. */
function ritPopGoal(st){
 var bc=ritBecoming();
 var body=(ritGoalHtml(st)+ritChainHtml(st.c,st.r,st.act)).replace(/data-act="(why|go-story|go-bank)"/g,'data-sh="$1"');
 return ritPopShell(bc?seatCol(bc.seat):'var(--accent)','Goal',RIT_TOP_SAY.goal,'<div class="rv-pgoal">'+body+'</div>','');}
/* a block's pop-up is ritSashSheet (ui/ritcal.js), found again on its day by
   its name after every write, the rule ritSheetWire already keeps, because a
   planned day marked done moves in the day's list */
function ritPopBlk(st){
 var P=RIT.pop, s=ritWeekDay(P.d,st).filter(function(x){return x.nm===P.nm;})[0];
 return s?ritSashSheet(s,P.d,st):ritPopGone('This is no longer on that day.');}
function ritBankHtml(){
 var P=RIT.pop; if(!P)return '';
 var st=ritRead();
 if(P.t==='sug')return ritPopSug(st);
 if(P.t==='aff')return ritPopAff(st);
 if(P.t==='chal')return ritPopChal(st);
 if(P.t==='goal')return ritPopGoal(st);
 if(P.t==='blk')return ritPopBlk(st);
 /* the law of the week, ui/ritlaw.js */
 if(P.t==='law'&&typeof ritPopLaw==='function')return ritPopLaw(st);
 return '';}
/* open a pop-up. sug is a Called for card (x, from RIT.sug or a host's own
   list), aff the affirmation set, chal a challenge by its row id ch:<id>. The
   When state starts from what is already set, so Change days opens on the
   days that are set. */
function ritBankOpen(P){
 if(typeof sheetOpen!=='function'||!P)return false;
 var today=ritToday0();
 if(!P.W){
  if(P.t==='sug'&&P.x){P.key=ritSugKey(P.x);
   var run=ritPlans().filter(function(p){return ritKey(p.steps)===P.x.k&&ritActive(p,today);})[0];
   P.W=run?ritWhen0(run):ritWhen0(null);}
  else P.W=ritWhen0(ritSchedOf(P.t==='aff'?'aff':P.id));}
 if(P.on){P.W.on=P.on.slice(); P.W.rep=1;}
 RIT.pop=P; ritCalCss(); ritBankCss(); if(typeof ritWeekCss==='function')ritWeekCss(); sheetOpen(ritBankHtml()); ritSheetWire(); ritBankWireIn();
 var f=P.at==='why'?document.getElementById('rv-mwhy'):null; if(f)f.focus();
 return true;}
/* the two text fields write to the pop-up's state on the way past, so a
   redraw for a day pressed after them keeps what was typed */
function ritBankWireIn(){
 var t=document.getElementById('rv-pat'), o=document.getElementById('rv-pown'), c=document.getElementById('sheet-card');
 if(t)t.oninput=t.onchange=function(){if(RIT.pop&&RIT.pop.W)RIT.pop.W.at=t.value.trim();};
 if(o)o.oninput=o.onchange=function(){if(RIT.pop)RIT.pop.own=o.value;};
 /* Repeat and For are selects, and a select answers on change and not on
    click, so the card listens for that too. The text fields above set their
    own and are left to them. */
 if(c)c.onchange=function(ev){var s=ev.target;
  if(!s||s.tagName!=='SELECT'||!RIT.pop||!RIT.pop.W||!c.contains(s))return;
  var a=s.getAttribute('data-sh'); if(a!=='rc-rep'&&a!=='rc-for')return;
  ritRecurAct(RIT.pop.W,a,s.value); ritBankRedraw(s);};
 /* the law of the week's scale carries data-a, the Intake page's attribute,
    and not data-sh, so the sheet's listener does not see it: it is wired
    here, after every draw, by ritlaw.js */
 if(RIT.pop&&RIT.pop.t==='law'&&typeof ritLawWire==='function')ritLawWire(c);}
/* redraw in place and keep the keyboard where it was, found by what the
   control does and not by where it sits */
function ritBankRedraw(b){
 var c=document.getElementById('sheet-card'); if(!c)return;
 var key=b?b.getAttribute('data-sh')+'|'+(b.getAttribute('data-d')||b.getAttribute('data-id')||''):'';
 c.innerHTML=ritBankHtml(); ritBankWireIn();
 if(key){var f=[].slice.call(c.querySelectorAll('[data-sh]')).filter(function(x){
   return x.getAttribute('data-sh')+'|'+(x.getAttribute('data-d')||x.getAttribute('data-id')||'')===key;})[0]; if(f)f.focus();}}
function ritBankShut(){sheetShut(); RIT.pop=null;}

/* ---------------- the writers ---------------- */
/* a time is checked before anything is written, and a bad one is named */
function ritAtCheck(W){
 if(W.at&&!ritAtOk(W.at)){status(ritAtNo(W.at),'fail'); return false;}
 return true;}
/* ONCE ON GIVEN DAYS, for a drop on the week and for Once in the pop-up. A
   practice already running gets the days on its ex list, so a Thursday set
   once on a weekday plan is that Thursday and not every Thursday; one that is
   not running starts as a plan over exactly those days. A day gone is
   refused, and a day already set says so and writes nothing. */
function ritPlanOnce(q,days,msg){
 var today=ritToday0();
 days=days.filter(function(d){return d>=today;}).sort(function(a,b){return a-b;});
 if(!days.length){status('That day has gone, so it cannot be set. Nothing changed.','fail'); return false;}
 var k=ritKey(q.steps), cur=ritPlans().filter(function(p){return ritKey(p.steps)===k&&ritActive(p,today);})[0];
 if(cur){var add=days.filter(function(d){return !ritCovers(cur,d);});
  if(!add.length){status(ritName(q.steps)+' is already set on '+(days.length===1?'that day':'those days')+'. Nothing changed.'); return false;}
  return ritWrite(function(plans){
   var p=plans.filter(function(x){return x.id===cur.id;})[0]; if(!p)throw new Error('gone');
   p.ex=(p.ex||[]).concat(add.filter(function(d){return (p.ex||[]).indexOf(d)<0;})).sort(function(a,b){return a-b;});
   if(q.at)p.at=q.at;
   return plans;},msg);}
 var lo=days[0], hi=days[days.length-1], on=[];
 days.forEach(function(d){var w=ritWd(d); if(on.indexOf(w)<0)on.push(w);});
 return ritStartPlan({steps:q.steps, band:q.band, track:q.track, tags:q.tags, rel:q.rel, at:q.at,
  fromDay:lo, days:hi-lo+1, on:on.length===7?null:on.sort()},msg);}
/* ADD from a card's pop-up: Once is ritPlanOnce, a repeat is a joined start */
function ritBankAdd(x,W){
 if(!ritAtCheck(W))return false;
 var today=ritToday0(), S=ritWhenSpan(W,today);
 var q={steps:[x.k], band:x.seats[0]||'', track:x.p.track, tags:x.seats.slice(), at:W.at||null};
 if(x.rel!=null&&BY[x.rel])q.rel=x.rel;
 var msg='Added. '+x.p.nm+', '+ritWhenSay(W,S.from,today)+'.';
 if(W.rep===1)return ritPlanOnce(q,S.list,msg);
 q.days=S.days; q.on=W.on; q.fromDay=S.from; q.join=true;
 return ritStartPlan(q,msg);}
/* an affirmation or challenge row set from its pop-up. A row already there
   has its days, time and repeat replaced, which is what Change days says,
   and keeps its If I miss, its answers and its last offer. */
function ritSchedSet(id,kind,W,miss,msg){
 if(!ritAtCheck(W))return false;
 var today=ritToday0(), S=ritWhenSpan(W,today);
 return ritSchedWrite(function(rows){
  var was=rows.filter(function(r){return r.id===id;})[0];
  rows=rows.filter(function(r){return r.id!==id;});
  var on=W.on?W.on.slice():null, days=S.days;
  if(W.rep===1&&W.on){on=[]; S.list.forEach(function(d){var w=ritWd(d); if(on.indexOf(w)<0)on.push(w);}); on.sort();}
  rows.push({id:id, kind:kind, on:on, at:W.at||'', from:ritDayIso(S.from), days:days, ex:null,
   miss:miss||(was&&was.miss)||null, ack:was?was.ack:null, ans:was?was.ans:[]});
  return rows;},msg+', '+ritWhenSay(W,S.from,today)+'.');}
function ritSchedStop(id,msg){
 return ritSchedWrite(function(rows){return rows.filter(function(r){return r.id!==id;});},msg);}
/* one day on an affirmation or challenge row, from a drop on the week */
function ritSchedOnce(id,d,nm){
 var today=ritToday0(), r=ritSchedOf(id); if(!r)return false;
 if(d<today){status('That day has gone, so it cannot be set. Nothing changed.','fail'); return false;}
 if(ritSchedCovers(r,d)){status(nm+' is already set on that day. Nothing changed.'); return false;}
 return ritSchedWrite(function(rows){
  var x=rows.filter(function(y){return y.id===id;})[0]; if(!x)throw new Error('gone');
  x.ex=(x.ex||[]).concat([d]).sort(function(a,b){return a-b;});
  return rows;},'Added. '+nm+', once on '+RIT_WDN[ritWd(d)]+' '+ritDateOf(d).getDate()+'.');}
/* THE ANSWER TO THE WHY QUESTION. It is kept, the last one is shown the
   next time the pop-up opens, and the offer closes at the last missed day,
   so the next offer needs three more set days missed after it. Nothing is
   written to the record, the streak or the ladder. */
function ritMissAnswer(id,why){
 why=String(why||'').trim();
 if(!why){status('Write a few words first. Nothing saved.','fail'); return false;}
 var st=ritRead(), r=ritSchedOf(id), off=r?ritMissOffer(r,st):null; if(!off)return false;
 return ritSchedWrite(function(rows){
  var x=rows.filter(function(y){return y.id===id;})[0]; if(!x)throw new Error('gone');
  x.ans=(x.ans||[]).concat([{d:st.today, why:why.slice(0,RIT_WHY_MAX)}]).slice(-RIT_ANS_MAX);
  x.ack=off.last;
  return rows;},'Saved. Your answer is kept with the challenge.');}

/* the pop-up's presses, reached from ritSheetWire for anything it does not
   handle itself */
function ritBankAct(a,b){
 var P=RIT.pop, W=P&&P.W; if(!P)return;
 switch(a){
  /* the repeat band's presses, the same function the builder's go through */
  case 'rc-d': case 'rc-pop': case 'rc-any':
   ritRecurAct(W,a,b.getAttribute(a==='rc-d'?'data-d':'data-v')); break;
  case 'pmk': P.mk=b.getAttribute('data-d'); break;
  case 'badd': {var x=(RIT.sug||[]).filter(function(s){return ritSugKey(s)===P.key;})[0]||P.x; if(!x)return;
   if(ritBankAdd(x,W))ritBankShut(); return;}
  case 'bsave': ritBankShut(); ritSugSave(+b.getAttribute('data-i')); return;
  case 'bdrop': ritBankShut(); ritSugDrop(+b.getAttribute('data-i')); return;
  case 'baff': if(ritSchedSet('aff','aff',W,null,'Affirmations set'))ritBankShut(); return;
  case 'bagree': {var k=P.mk||((ritSchedOf(P.id)||{}).miss||{}).k||RIT_MISS[0].k, own=String(P.own!=null?P.own:(((ritSchedOf(P.id)||{}).miss||{}).own||'')).trim();
   if(k==='own'&&!own){status('Write what you will do if you miss, or pick Answer why. Nothing saved.','fail'); return;}
   var c=ritChallenge(ritRead()).filter(function(y){return 'ch:'+y.id===P.id;})[0];
   if(ritSchedSet(P.id,'chal',W,{k:k, own:k==='own'?own.slice(0,RIT_OWN_MAX):''},'Agreed. '+(c?c.nm:'The challenge')+' is on your week'))ritBankShut(); return;}
  case 'bstop': if(ritSchedStop(P.t==='aff'?'aff':P.id,'Stopped. The days you marked stay on your record.'))ritBankShut(); return;
  /* what the Today list carried, 21 November. Each goes through the writer
     it always went through; a write repaints the page under the pop-up, and
     the pop-up is redrawn from a fresh read below. */
  case 'said': case 'did': ritDayMark(a,b.getAttribute('data-id')); break;
  case 'ptimer': ritTimer(b.getAttribute('data-id')); return;
  case 'pstop': ritBankShut(); ritStop(b.getAttribute('data-id')); return;
  case 'prel': ritBankShut(); if(typeof relPick==='function')relPick([+b.getAttribute('data-n')]); return;
  case 'why': {var bc=ritBecoming(); ritBankShut(); if(bc)ritStartFor(bc,+b.getAttribute('data-d')); return;}
  case 'go-story': ritBankShut(); if(typeof setTab==='function')setTab(TAB.STORY); return;
  case 'go-bank': ritBankShut();
   /* the bank is the Imprints page since 27 November, and stBank opens it
      on the bank side of its switch */
   if(typeof stBank==='function')stBank(); return;
  case 'bwhy': {var t=document.getElementById('rv-mwhy'); if(ritMissAnswer(P.id,t?t.value:''))ritBankRedraw(null); return;}
  default: return;}
 ritBankRedraw(b);}

/* ---------------- drag onto a day ----------------
   A Called for card, or a block on the week, dragged onto a day writes one
   Once entry for that day and opens the same pop-up, so what was just set can
   be turned into a repeat. Released anywhere that is not a day, or on a day
   that has gone, the ghost goes and nothing is written.
   POINTER EVENTS AND NOT HTML DRAG AND DROP, because HTML drag does not run
   on a touch screen at all. A mouse drags the card from anywhere on it that
   is not a press; a finger drags from the card's track word and a block itself,
   which carry touch-action:none, so a finger anywhere else still scrolls the
   page. The keyboard route is the pop-up: the card's name opens it, a day and
   Once are pressed, then Add, which writes exactly what a drop writes. */
var RIT_DRAG=null, RIT_DRAG_PX=6;
function ritDragSrc(el){
 if(el.getAttribute('data-drag')==='sug'){var x=(RIT.sug||[])[+el.getAttribute('data-i')]; return x?{t:'sug', x:x, nm:x.p.nm}:null;}
 if(el.classList.contains('rv-wch')&&el.hasAttribute('data-nm')&&!el.classList.contains('rv-wmore')){
  var d=+el.getAttribute('data-d'), s=ritWeekDay(d,ritRead())[+el.getAttribute('data-i')];
  return s?{t:'blk', s:s, nm:s.nm, from:d}:null;}
 return null;}
function ritDayAt(x,y){
 var e=document.elementFromPoint(x,y), li=e&&e.closest&&e.closest('#rit .rv-wd1[data-d]');
 return li?+li.getAttribute('data-d'):null;}
function ritDragDown(ev){
 if(ev.button>0||RIT_DRAG)return;
 var el=ev.target.closest&&ev.target.closest('[data-drag="sug"],#rit .rv-week button.rv-wch'); if(!el)return;
 /* a finger starts only on a grip or a block; a mouse anywhere but a press */
 if(ev.pointerType!=='mouse'){if(!ev.target.closest('[data-grip],.rv-wch'))return;}
 else if(el.getAttribute('data-drag')==='sug'&&ev.target.closest('button,a,input,[tabindex]'))return;
 RIT_DRAG={el:el, x0:ev.clientX, y0:ev.clientY, on:false, id:ev.pointerId, g:null, d:null};
 document.addEventListener('pointermove',ritDragMove);
 document.addEventListener('pointerup',ritDragUp);
 document.addEventListener('pointercancel',ritDragEnd);}
function ritDragMove(ev){
 var D=RIT_DRAG; if(!D||ev.pointerId!==D.id)return;
 if(!D.on){if(Math.abs(ev.clientX-D.x0)+Math.abs(ev.clientY-D.y0)<RIT_DRAG_PX)return;
  D.src=ritDragSrc(D.el); if(!D.src){ritDragEnd(); return;}
  D.on=true; ritBankCss();
  var g=document.createElement('div'); g.className='rv-ghost'; g.setAttribute('aria-hidden','true');
  g.textContent=D.src.nm; document.body.appendChild(g); D.g=g; document.body.classList.add('rv-dragging');}
 ev.preventDefault();
 D.g.style.transform='translate('+(ev.clientX+12)+'px,'+(ev.clientY+12)+'px)';
 var d=ritDayAt(ev.clientX,ev.clientY);
 if(d!==D.d){
  [].forEach.call(document.querySelectorAll('#rit .rv-wd1.rv-drop,#rit .rv-wd1.rv-nodrop'),function(li){li.classList.remove('rv-drop','rv-nodrop');});
  var li=d!=null&&document.querySelector('#rit .rv-wd1[data-d="'+d+'"]');
  if(li)li.classList.add(d>=ritToday0()?'rv-drop':'rv-nodrop');
  D.d=d;}}
function ritDragEnd(){
 var D=RIT_DRAG; RIT_DRAG=null;
 document.removeEventListener('pointermove',ritDragMove);
 document.removeEventListener('pointerup',ritDragUp);
 document.removeEventListener('pointercancel',ritDragEnd);
 if(D&&D.g)D.g.remove();
 document.body.classList.remove('rv-dragging');
 [].forEach.call(document.querySelectorAll('#rit .rv-wd1.rv-drop,#rit .rv-wd1.rv-nodrop'),function(li){li.classList.remove('rv-drop','rv-nodrop');});
 /* a drag that moved must not also be a click on the thing it started on */
 if(D&&D.on){var kill=function(e){e.stopPropagation(); e.preventDefault();};
  document.addEventListener('click',kill,true); setTimeout(function(){document.removeEventListener('click',kill,true);},0);}
 return D;}
function ritDragUp(ev){
 var D=RIT_DRAG; if(!D||ev.pointerId!==D.id)return;
 var d=D.on?ritDayAt(ev.clientX,ev.clientY):null; ritDragEnd();
 if(!D.on||d==null)return;
 ritDropOn(D.src,d);}
/* the drop itself, apart from the pointer, so the gate and any other route
   reach exactly what a hand reaches */
function ritDropOn(src,d){
 if(!src)return false;
 var today=ritToday0();
 if(d<today){status('That day has gone, so it cannot be set. Nothing changed.','fail'); return false;}
 var say=RIT_WDN[ritWd(d)]+' '+ritDateOf(d).getDate(), ok=false;
 if(src.t==='sug'){var x=src.x, q={steps:[x.k], band:x.seats[0]||'', track:x.p.track, tags:x.seats.slice()};
  if(x.rel!=null&&BY[x.rel])q.rel=x.rel;
  ok=ritPlanOnce(q,[d],'Added. '+x.p.nm+', once on '+say+'.');
  if(ok)ritBankOpen({t:'sug', x:x, on:[ritWd(d)]});
  return ok;}
 var s=src.s;
 if(s.sc){ok=ritSchedOnce(s.sc.id,d,s.nm);
  if(ok)ritBankOpen(s.sc.kind==='aff'?{t:'aff'}:{t:'chal', id:s.sc.id});
  return ok;}
 var p=s.p||ritSashPlan(s,src.from,ritRead()); if(!p)return false;
 ok=ritPlanOnce({steps:p.steps, band:p.band, track:p.track, tags:p.tags, rel:p.rel},[d],'Added. '+s.nm+', once on '+say+'.');
 /* the block's own pop-up is its sheet, ritSashSheet, found on the new day
    by its name, the rule ritSheetWire already keeps */
 if(ok){var k=-1; ritWeekDay(d,ritRead()).forEach(function(x,j){if(k<0&&x.nm===s.nm)k=j;}); if(k>=0)ritSashOpen(d,k);}
 return ok;}
function ritBankDragWire(el){if(el)el.onpointerdown=ritDragDown;}

/* ---------------- the look ---------------- */
function ritBankCss(){
 if(document.getElementById('ritbank-css'))return;
 var st=document.createElement('style'); st.id='ritbank-css';
 st.textContent=[
  /* the name is a press now and still reads as the name */
  '.rv-sg1 .rv-bko{padding:0;border:0;background:none;font:inherit;font-size:15px;font-weight:600;color:var(--ink);text-align:left;cursor:pointer;min-height:44px}',
  '.rv-sg1 .rv-bko:hover{text-decoration:underline;text-underline-offset:3px}',
  '.rv-bko:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:6px}',
  '.rv-pop{display:flex;flex-direction:column;gap:12px}',
  '.rv-pwhat{margin:0;font-size:14.5px;line-height:1.5;color:var(--ink)}',
  '.rv-pp{margin:0;font-size:13.5px;line-height:1.5;color:var(--mid)}',
  '.rv-pwl,.rv-pafl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13.5px;line-height:1.5}',
  '.rv-pf summary{cursor:pointer;min-height:44px;display:flex;align-items:center;font-size:14px;font-weight:600;color:var(--ink)}',
  '.rv-pf[open]{display:flex;flex-direction:column;gap:6px}',
  '.rv-pw{display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:12px;background:color-mix(in srgb,var(--c) 7%,var(--panel-2))}',
  '.rv-pwh{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;font-size:14px;font-weight:600;color:var(--ink);cursor:help;min-height:32px}',
  '.rv-pwh svg{width:18px;height:18px;fill:none;stroke:var(--c);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-pdays{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}',
  '.rv-prow{display:flex;flex-wrap:wrap;gap:6px}',
  '.rv-pd,.rv-pq{min-height:44px;min-width:44px;padding:0 12px;border-radius:12px;border:1px solid var(--edge);background:var(--panel);color:var(--ink);font:inherit;font-size:13.5px;cursor:pointer}',
  '.rv-pd{padding:0}',
  '.rv-pd.rv-on,.rv-pq.rv-on{background:color-mix(in srgb,var(--c) 22%,var(--panel));border-color:color-mix(in srgb,var(--c) 60%,var(--edge));font-weight:600}',
  '.rv-pd:focus-visible,.rv-pq:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-pat{width:7.5em;min-height:44px;padding:0 12px;border-radius:12px;border:1px solid var(--edge);background:var(--panel);color:var(--ink);font:inherit;font-size:14px;font-variant-numeric:tabular-nums}',
  '.rv-pown,.rv-pwhy{box-sizing:border-box;width:100%;min-height:44px;padding:10px 12px;border-radius:12px;border:1px solid var(--edge);background:var(--panel);color:var(--ink);font:inherit;font-size:14px}',
  /* the offer is the accent and never the alarm: a miss here is never red */
  '.rv-mwhy{background:color-mix(in srgb,var(--accent) 9%,var(--panel-2));--c:var(--accent)}',
  '.rv-mof{display:inline-flex;align-items:center;gap:6px;min-height:44px;margin-top:4px;padding:0 12px;border-radius:12px;border:1px solid color-mix(in srgb,var(--accent) 45%,var(--edge));',
  ' background:color-mix(in srgb,var(--accent) 10%,var(--panel));color:var(--ink);font:inherit;font-size:13.5px;cursor:pointer}',
  '.rv-mof svg{width:16px;height:16px;fill:none;stroke:var(--accent);stroke-width:2}',
  '.rv-ib.rv-set{flex:0 0 auto}',
  /* the affirmations' clock sits at the end of their heading's row, level
     with the name, the way each challenge's clock ends its row */
  '.rv-aff>.rv-gh{flex-direction:row;align-items:center;justify-content:space-between}',
  '.rv-ib.rv-set.rv-on svg{stroke:var(--accent)}',
  /* drag: the ghost follows the pointer and never takes a press */
  '.rv-ghost{position:fixed;left:0;top:0;z-index:1000;pointer-events:none;padding:8px 12px;border-radius:12px;background:var(--panel);color:var(--ink);',
  ' font-size:14px;font-weight:600;box-shadow:0 8px 24px -8px rgba(0,0,0,.5);border:1px solid var(--accent);white-space:nowrap}',
  'body.rv-dragging{user-select:none;-webkit-user-select:none;cursor:grabbing}',
  '#rit .rv-wd1.rv-drop{box-shadow:inset 0 0 0 2px var(--accent);border-radius:12px}',
  '#rit .rv-wd1.rv-nodrop{opacity:.55}',
  '.rv-sg1[data-drag]{cursor:grab}',
  /* THE REPEAT BAND, ritRecurHtml. One shaded band is one setting, the look
     .rv-pw already gave the pop-up's When. 8 between the rows the band
     stacks (this row, the days, the panels), 44 on every press, and the
     panels under it fold away whole. */
  '.rv-rc{display:flex;flex-direction:column;gap:8px;padding:8px;border-radius:12px;background:color-mix(in srgb,var(--c) 7%,var(--panel-2))}',
  /* THIS ROW ITSELF IS 6 BETWEEN ITS OWN FOUR PARTS, not the 8 above it,
     found in the same 21 November pass as the timer: Repeat (whose own
     longest real answer, Weekdays, already measured 110.3 of the 316 a
     phone gives this row) plus For (whose longest, 2/3/4 weeks, measures
     97.6) plus two 44 pixel presses needed 319.9 at the old 8, four pixels
     more than the row had, and the only part of the four with any give
     (For, the one flex-shrink:1 among them) lost exactly that four,
     truncating "2 weeks" to "2 we...". At 6 the same four need 313.9, which
     fits with room left over for Repeat's own flex-grow to take up, so For
     renders at its full, unshrunk, content width. */
  '.rv-rca{display:flex;align-items:center;gap:6px}',
  '.rv-rsel{position:relative;display:flex;align-items:center;min-width:0;cursor:pointer}',
  '.rv-rsel select{appearance:none;-webkit-appearance:none;width:100%;min-width:0;min-height:44px;padding:0 28px 0 12px;border-radius:12px;border:1px solid var(--edge);',
  ' background:var(--panel);color:var(--ink);font:inherit;font-size:14px;cursor:pointer;text-overflow:ellipsis}',
  '.rv-rsel>.rv-ic:first-child{position:absolute;left:11px;pointer-events:none;color:var(--c,var(--accent))}',
  '.rv-rsel>.rv-ic:first-child~select{padding-left:36px}',
  '.rv-rsel .rv-rch{position:absolute;right:8px;width:16px;height:16px;pointer-events:none;color:var(--mid)}',
  '.rv-rsel select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-rsel select:hover{border-color:var(--edge-2)}',
  /* Repeat takes what the row leaves, and For is as wide as its longest
     answer and no wider: on a phone the row is 316 and both have to read
     whole, Every day beside 2 weeks beside two icons */
  '.rv-rrep{flex:1 0 auto}',
  '.rv-rfor{flex:0 1 auto;min-width:0}',
  '.rv-rib{position:relative;display:inline-flex;align-items:center;justify-content:center;flex:0 0 44px;width:44px;height:44px;padding:0;',
  ' border-radius:12px;border:1px solid var(--edge);background:var(--panel);color:var(--mid);cursor:pointer}',
  '.rv-rib .rv-ic{width:20px;height:20px}',
  '.rv-rib:hover{color:var(--ink);border-color:var(--edge-2)}',
  '.rv-rib[aria-expanded="true"]{border-color:var(--c);color:var(--ink)}',
  '.rv-rib.rv-set{background:color-mix(in srgb,var(--c) 22%,var(--panel));color:var(--ink)}',
  '.rv-rib i{position:absolute;top:6px;right:6px;width:6px;height:6px;border-radius:50%;background:var(--c)}',
  '.rv-rib:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  /* seven cells and a hairline between, drawn as the gap over the edge
     colour, so the outer corners are the bar's own and only those round */
  '.rv-rcd{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:1px;width:100%;border-radius:12px;overflow:hidden;',
  ' background:var(--edge-2);box-shadow:0 0 0 1px var(--edge)}',
  '.rv-rd{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:44px;min-width:0;padding:0;border:0;border-radius:0;',
  ' background:var(--panel);color:var(--mid);font:inherit;font-size:14px;line-height:1.1;cursor:pointer}',
  '.rv-rd:hover{color:var(--ink)}',
  '.rv-rd.rv-on{background:color-mix(in srgb,var(--c) 22%,var(--panel));color:var(--ink);font-weight:600}',
  '.rv-rd:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}',
  '.rv-rd small{font-size:11px;font-weight:500;color:inherit}',
  '.rv-rd b{font-size:13.5px;font-weight:inherit;font-variant-numeric:tabular-nums}',
  /* the panel under When or Where, attached to the band and not a sheet */
  '.rv-ro{display:flex;flex-direction:column;gap:8px;padding-top:8px;border-top:1px solid var(--edge)}',
  '.rv-ro[hidden]{display:none}',
  '.rv-rot{display:flex;flex-wrap:wrap;gap:8px}',
  '.rv-rq{min-height:44px;min-width:44px;padding:0 12px;border-radius:12px;border:1px solid var(--edge);background:var(--panel);color:var(--ink);font:inherit;font-size:13.5px;cursor:pointer}',
  '.rv-rq.rv-on{background:color-mix(in srgb,var(--c) 22%,var(--panel));border-color:color-mix(in srgb,var(--c) 60%,var(--edge));font-weight:600}',
  '.rv-rq:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-rat{width:7.5em;min-height:44px;padding:0 12px;border-radius:12px;border:1px solid var(--edge);background:var(--panel);color:var(--ink);font:inherit;font-size:14px;font-variant-numeric:tabular-nums}',
  '.rv-rf{display:flex;align-items:center;gap:8px;margin:0}',
  '.rv-rf span{flex:0 0 auto;min-width:3.4em;font-size:13px;font-weight:500;color:var(--mid)}',
  /* the field is the panel's colour and never --sunk: on the darkest token
     an empty field read as a hole in the card, which is what he called the
     black fields */
  '.rv-rf input{flex:1 1 auto;min-width:0;min-height:44px;padding:0 12px;border-radius:12px;border:1px solid var(--edge);background:var(--panel);color:var(--ink);font:inherit;font-size:14px}',
  '.rv-rf input:focus-visible,.rv-rat:focus-visible{outline:2px solid var(--accent);outline-offset:1px}',
  '.rv-rno{margin:0;font-size:12.5px;line-height:1.5;color:var(--dim)}',
  '.rv-ro .rv-if{margin:0}',
  '.rv-sg1 .rv-sgk,#rit .rv-week button.rv-wch{touch-action:none}',
  /* THE CARD, D-4, 20 November. Three rows on even gaps, nothing flush, his
     "symmetry in space": the headline and the pair of presses, then the
     track, minutes, chips and seats, then the line. The rules carry .rv-sugl
     ahead of the card so they win over ui/ritstage.js and ui/ritcal.js
     whichever sheet was injected last. */
  '.rv-sugl>.rv-sg1{display:flex;flex-direction:column;gap:8px;padding:12px 12px 12px 14px}',
  '.rv-sugl .rv-sgh{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;column-gap:12px}',
  /* the headline: smaller than the 15 it was, as he asked, and heavier so it
     still reads first; two lines at most, the second for a long name */
  '.rv-sugl .rv-sg1 .rv-bko{font-size:14px;font-weight:650;line-height:1.3;letter-spacing:-.005em;min-height:44px;',
  ' display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
  '.rv-sugl .rv-sga{display:inline-flex;gap:8px;margin:0}',
  '.rv-yes,.rv-no{width:48px;height:48px;padding:0;border:0;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;',
  ' color:var(--on-accent);transition:background var(--t-micro) var(--ease-out)}',
  '.rv-yes{background:var(--good)}',
  '.rv-no{background:var(--bad)}',
  '.rv-yes:hover{background:color-mix(in srgb,var(--good) 92%,black)}',
  '.rv-no:hover{background:color-mix(in srgb,var(--bad) 92%,black)}',
  '.rv-yes:focus-visible,.rv-no:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  /* the glyphs are stroked, icons are ring and not fill; the press is solid */
  '.rv-yes svg,.rv-no svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-sugl .rv-sgo{align-items:center;gap:6px 8px;margin:0}',
  '.rv-sgk{display:inline-flex;align-items:center;gap:6px;min-height:28px;font-size:12.5px;font-weight:600;cursor:help;',
  ' color:color-mix(in srgb,var(--c) 55%,var(--ink))}',
  '.rv-sgk::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--c)}',
  '.rv-sgk:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:6px}',
  '.rv-sugl .rv-sgo .rv-sgm{font-size:12.5px;margin-right:4px}',
  '.rv-sugl .rv-sgd{margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'
 ].join('\n');
 document.head.appendChild(st);}
