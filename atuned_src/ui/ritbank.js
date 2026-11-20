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

   WHAT IS ON THIS DEVICE AND NOT ON THE RECORD. A plan's days and time ride
   the plan beside the record, as plans always have. Affirmations and
   challenges are not plans, so they get rows of their own under
   atuned-ritual-sched, deliberately not inside the ritual more key, whose
   writer rebuilds its entry from a fixed shape and would erase any field it
   does not know. None of it travels with an export: moving rituals onto the
   record is a schema change and his call (TASKS, ritual-move-to-record).

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
   product has no push, and the pop-up says so where the time is set. */
var RIT_AT_RX=/^([01]\d|2[0-3]):[0-5]\d$/;
function ritAtOk(s){return typeof s==='string'&&RIT_AT_RX.test(s);}
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

/* ---------------- the card ----------------
   The Called for card's face, as Ritual drew it before this file existed and
   unchanged on that page: the mark that opens the reasons, the name, now a
   press that opens the pop-up, the minutes, the library's line, the two
   chips, the reasons folded, the seats, and Add, Save, Dismiss. i is the
   card's place in RIT.sug, which is what every press carries. A host other
   than Ritual sets RIT.sug to its own list and wires the same data-act names
   (sug, sug-save, sug-x, sgwhy, bank) to the same functions. */
function ritBankCard(x,i,st){
 /* the look is injected with the first card, not with the first pop-up: the
    name is a button now, and a button with no rule of its own is drawn by
    the browser as a white box on every card until a pop-up has opened */
 ritBankCss();
 var b=x.seats[0]||'', col=b?seatCol(b):'var(--accent)', M=ritSugMark(x,b), open=!!(RIT.sgw&&RIT.sgw[x.k+'|'+x.rel]);
 /* ROUND QX, "add a text description. And the success of what it leads
    to." The description is the library's own line for the practice. What
    it leads to is the quality release installs at the place the card is
    for, a canon word and not a measurement. The success is the person's own
    record with this practice, because no measure of how well a practice
    works exists anywhere in the engine and one made up here would be the
    status lie. ui/ritcal.js says the same at ritSugRec. */
 var R=ritSugRec(x,(st.r.loaded||[]).length), T=ritSugToward(x), recSays=ritSugRecSays(x,R);
 var chips='<div class="rv-sgo">'
  +(T?'<span class="rv-sgc"'+rvTip('Toward '+T.opp.toLowerCase(),'What it is for: '+T.opp.toLowerCase()
    +' is the quality release puts back where '+ritCfWord(T.nm)+' was held. You hold '+String(T.k).toLowerCase()+' at '+ritThe(T.b)+'.')+'>'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14 M14 7l5 5-5 5"/></svg>Toward '+esc(T.opp.toLowerCase())+'</span>':'')
  +'<span class="rv-sgc'+(R.kept?'':' rv-sgc0')+'"'+rvTip('Your record with it',recSays.join(' '))+'>'
   +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>'
   +esc(ritSugRecWord(R))+'</span></div>';
 return '<li class="rv-sg1'+(open?' rv-open':'')+'" style="--c:'+col+'" data-drag="sug" data-i="'+i+'">'
  +'<div class="rv-sgh"><button type="button" class="rv-sgs" data-act="sgwhy" data-i="'+i+'" data-grip="1" aria-expanded="'+open
   +'" aria-label="Why '+esc(x.p.nm)+' is called for">'+M.badge+'</button>'
  /* THE NAME OPENS THE POP-UP, 20 November: days, a time and a repeat are
     set there, and it is also the keyboard's way to put the card on a day,
     the same thing a drag onto the week does */
  +'<span class="rv-sgt0"><button type="button" class="rv-sgn rv-bko" data-act="bank" data-i="'+i+'" aria-label="'+esc(x.p.nm)+': days, time and repeat">'
   +esc(x.p.nm)+'</button><span class="rv-sgm">'+x.p.min+(x.p.min===1?' minute':' minutes')+'</span></span></div>'
  /* ONE LINE STAYS VISIBLE, round QV, "with suggested add a little text".
     Round QX made it what the practice is, his "text description", and the
     reason it is offered moved into the press, where the full why-list was
     already: the first reason was printed twice whenever a card was open. */
  /* and a practice with no line prints no empty paragraph: the Truth
     Check's was cut, engine/data/practice.js says why */
  +(x.p.d?'<p class="rv-sgd">'+esc(x.p.d)+'</p>':'')+chips
  /* THE REASONS ARE ONE PRESS AWAY, round QS. His words: "more show less
     tell if you want tell you press on something to get information." The
     mark is the press, and it opens the reasons and what the ring measures
     in place, under the name, rather than in a panel somewhere else. */
  /* and the reasons are Source AI's own sentences, so since 20 November each
     wears its mark */
  +'<div class="rv-sgx"'+(open?'':' hidden')+'><ul class="rv-sgw">'+x.why.map(function(w){return ritAiHtml(w);}).join('')
   +'</ul><ul class="rv-sgrec">'+recSays.map(function(w){return '<li>'+esc(w)+'</li>';}).join('')+'</ul>'
   +'<p class="rv-sgr">'+esc(M.says)+'</p></div>'
  +'<div class="rv-sgf"><span class="rv-sgt">'+x.seats.map(function(sb){
    return '<em class="rv-tg" style="--t:'+seatCol(sb)+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+(SEATGLYPH[sb]||SEATGLYPH._)+'</svg>'
     +esc(ritTagNm(sb))+'</em>';}).join('')+'</span></div>'
  /* ROUND QX, HIS THREE: "add them to my daily practice or bank them to my
     vault or dismiss". Add is the press it always was (ritSugStart). Save
     for later is his "bank to my vault": Bank and Vault already mean the
     imprints held and what has been released, so a third meaning for either
     word would be one word for two concepts. Dismiss takes it off the list,
     with Put back in the same place. */
  /* SV16, his words: "Instead of add to daily practice, just add to
     practice. Instead of saying save for later, just do save." The
     accessible name keeps the span the press sets, because a button that
     starts a week of practice should say so to a person who cannot see the
     card's other lines. */
  +'<div class="rv-sga"><button type="button" class="btn pri" data-act="sug" data-i="'+i+'" aria-label="Add '+esc(x.p.nm)+' to practice, each day for a week">Add to practice</button>'
  +'<button type="button" class="btn" data-act="sug-save" data-i="'+i+'" aria-label="Save '+esc(x.p.nm)+'">Save</button>'
  +'<button type="button" class="btn rv-sgq" data-act="sug-x" data-i="'+i+'" aria-label="Dismiss '+esc(x.p.nm)+'">Dismiss</button></div></li>';}

/* ---------------- the schedule rows for affirmations and challenges ---------------- */
var RIT_SCHED_KEY='atuned-ritual-sched';
var RIT_WHY_MAX=280, RIT_OWN_MAX=140, RIT_ANS_MAX=60;
/* IF I MISS, the choices, one table. The team's default is the first, and it
   is the one he may change: see the head of this file. The person's own is
   their own sentence, so it is quoted back and never carries the Source AI
   mark. */
var RIT_MISS=[
 {k:'why', nm:'Answer why', says:'You answer the one question, what got in the way. Nothing else happens.'},
 {k:'own', nm:'In my words', says:'You write what you will do, and the app takes your word that you did it.'}];
var RIT_MISS_AT=3;
function ritSchedAll(){
 if(typeof STORE==='undefined')return {};
 try{var o=JSON.parse(STORE.get(RIT_SCHED_KEY)||'{}');
  return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}catch(e){return {};}}
/* a row that is not the shape the writer puts there is left out on the read,
   the boundary's posture, and a store that cannot be read is an empty one */
function ritSchedOk(r){
 var str=function(s,n){return typeof s==='string'&&s.length<=n;};
 return !!(r&&typeof r==='object'&&typeof r.id==='string'&&r.id.length<=80
  &&((r.kind==='aff'&&r.id==='aff')||(r.kind==='chal'&&/^ch:/.test(r.id)))
  &&typeof r.from==='string'&&pracDay(r.from)!==null
  &&typeof r.days==='number'&&r.days>=0&&r.days<=3660&&Math.floor(r.days)===r.days
  &&(r.at==null||r.at===''||ritAtOk(r.at))
  &&(r.on==null||(Array.isArray(r.on)&&r.on.length>=1&&r.on.length<=7
   &&r.on.every(function(d,i){return typeof d==='number'&&d>=0&&d<=6&&Math.floor(d)===d&&r.on.indexOf(d)===i;})))
  &&(r.ex==null||ritExOk(r.ex))
  &&(r.miss==null||(typeof r.miss==='object'&&RIT_MISS.some(function(m){return m.k===r.miss.k;})&&str(r.miss.own||'',RIT_OWN_MAX)))
  &&(r.ack==null||(typeof r.ack==='number'&&Math.floor(r.ack)===r.ack))
  &&(r.ans==null||(Array.isArray(r.ans)&&r.ans.length<=RIT_ANS_MAX&&r.ans.every(function(a){
   return a&&typeof a.d==='number'&&Math.floor(a.d)===a.d&&str(a.why,RIT_WHY_MAX);}))));}
function ritSched(){
 if(!CURP||!CURP.id)return [];
 var a=ritSchedAll()[CURP.id];
 if(!Array.isArray(a))return [];
 return a.filter(ritSchedOk).map(function(r){
  return {id:r.id, kind:r.kind, on:r.on?r.on.slice().sort():null, at:r.at||'', from:r.from, days:r.days,
   ex:r.ex?r.ex.slice():null, miss:r.miss?{k:r.miss.k, own:r.miss.own||''}:null,
   ack:(r.ack==null?null:r.ack), ans:(r.ans||[]).map(function(a){return {d:a.d, why:a.why};})};});}
function ritSchedOf(id){return ritSched().filter(function(r){return r.id===id;})[0]||null;}
/* ONE WRITER for this key, the ritMoreWrite posture: a worked example is
   refused by name, and a store that would not take it says so, so a control
   never claims a save it does not have */
function ritSchedWrite(fn,msg){
 if(!ritOwn()){status(ritWhose()+' is a worked example, so nothing was saved to it.','fail');return false;}
 var ok=false;
 if(typeof STORE_BOUND!=='undefined'&&STORE_BOUND){
  try{var all=ritSchedAll(), cur=fn(ritSched());
   if(cur){all[CURP.id]=cur; STORE.set(RIT_SCHED_KEY,JSON.stringify(all));}
   ok=true;}
  catch(err){ok=false;}}
 if(!ok){status('Not saved. Your browser refused the write. Nothing changed.','fail'); ritRender(); return false;}
 if(msg)status(msg);
 ritRender(); return true;}
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
function ritPopSug(st){
 var P=RIT.pop, x=(RIT.sug||[]).filter(function(s){return ritSugKey(s)===P.key;})[0]||P.x;
 if(!x)return ritPopGone('This one is no longer called for.');
 var i=(RIT.sug||[]).indexOf(x), b=x.seats[0]||'', col=b?seatCol(b):'var(--accent)';
 var R=ritSugRec(x,(st.r.loaded||[]).length), T=ritSugToward(x);
 var steps=ritSteps({steps:[x.k]});
 var body=(x.p.d?'<p class="rv-pwhat">'+esc(x.p.d)+'</p>':'')
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
 var body='<ul class="rv-pafl">'+A.map(function(a){
   return '<li class="rv-paf1'+(a.ai?' src-ai':'')+'">'+(a.ai&&typeof srcMark==='function'?srcMark():'')+(a.own?'"'+esc(a.line)+'"':esc(a.line))+'</li>';}).join('')+'</ul>'
  +ritWhenHtml(P.W);
 var acts='<button type="button" class="btn pri" data-sh="baff">'+(r?'Change days':'Add to my week')+'</button>'
  +(r?'<button type="button" class="btn" data-sh="bstop">Stop all days</button>':'');
 return ritPopShell('var(--accent)','Affirmations',r?'On your week, '+ritOften(r.on).toLowerCase():'Not on your week yet',body,acts);}
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
 var body=why+'<p class="rv-pwhat">'+esc(c.act)+'</p>'
  +'<p class="rv-pp"><b>When it applies.</b> '+esc(c.when)+'</p>'
  +ritAiHtml('Who it answers: '+c.who+'.','p')
  +(last?'<p class="rv-pp">Your last answer: "'+esc(last.why)+'"</p>':'')
  +ritWhenHtml(P.W)+ritMissHtml(P,r);
 var acts='<button type="button" class="btn pri" data-sh="bagree">Agree</button>'
  +(r?'<button type="button" class="btn" data-sh="bstop">Stop all days</button>':'');
 return ritPopShell(col,c.nm,r?'On your week, '+ritOften(r.on).toLowerCase():'Challenge',body,acts);}
function ritBankHtml(){
 var P=RIT.pop; if(!P)return '';
 var st=ritRead();
 if(P.t==='sug')return ritPopSug(st);
 if(P.t==='aff')return ritPopAff(st);
 if(P.t==='chal')return ritPopChal(st);
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
 RIT.pop=P; ritCalCss(); ritBankCss(); sheetOpen(ritBankHtml()); ritSheetWire(); ritBankWireIn();
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
  ritRecurAct(RIT.pop.W,a,s.value); ritBankRedraw(s);};}
/* redraw in place and keep the keyboard where it was, found by what the
   control does and not by where it sits */
function ritBankRedraw(b){
 var c=document.getElementById('sheet-card'); if(!c)return;
 var key=b?b.getAttribute('data-sh')+'|'+(b.getAttribute('data-d')||''):'';
 c.innerHTML=ritBankHtml(); ritBankWireIn();
 if(key){var f=[].slice.call(c.querySelectorAll('[data-sh]')).filter(function(x){
   return x.getAttribute('data-sh')+'|'+(x.getAttribute('data-d')||'')===key;})[0]; if(f)f.focus();}}
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
   is not a press; a finger drags from the card's mark and a block itself,
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
     .rv-pw already gave the pop-up's When. 8 between the parts of the one
     setting, 44 on every press, and the panels under it fold away whole. */
  '.rv-rc{display:flex;flex-direction:column;gap:8px;padding:8px;border-radius:12px;background:color-mix(in srgb,var(--c) 7%,var(--panel-2))}',
  '.rv-rca{display:flex;align-items:center;gap:8px}',
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
  '.rv-sg1 .rv-sgs,#rit .rv-week button.rv-wch{touch-action:none}'
 ].join('\n');
 document.head.appendChild(st);}
