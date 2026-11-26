/* ============================================================
   THE LAW OF THE WEEK. 22 November.

   His ask: the Ritual system serves one law a week that is not measured yet,
   as a ritual practice, so a person is not asked to sit down to all sixty
   three questions at once.

   NOTHING HERE DECIDES WHICH LAW. The Intake page already has the one answer
   to "what is next", iqNext (ui/intakeui.js): the first law in body order,
   crown to root, with a question still unanswered. This file asks it and
   never walks the order itself, so a law measured on the Intake page is
   skipped here with nothing to keep in step, and a person doing both is
   served the next law either has left.

   NOTHING HERE DRAWS OR WRITES A QUESTION. The pop-up draws the law's three
   framings with iqFramings, the function all three Intake views draw them
   with, and a press goes through iqPress, the Intake page's own press lifted
   out of renderIntake for exactly this second caller. So the scale, its
   rounding of a reference profile's decimals, the save, its report through
   status() and the worked example's refusal are each one piece of code.

   THE WEEK IS THE CALENDARS' WEEK. Every calendar on the Ritual tab starts on
   Sunday (SV24, ritWc in ui/ritual.js), so the week's law turns on Sunday
   too: a week is the Sunday on or before today and the six days after it.

   DONE IS THE DID LOG, the way a challenge is done. When the week's law gets
   its third answer, from this pop-up or from the Intake page, one entry
   [day, 'iq:<law index>'] goes into the same log a challenge's tick writes
   (ritMore, ui/ritcal.js), through its one writer, ritMoreWrite, which
   refuses a worked example and says so when the store will not take it. The
   index and not the name, because the index is what the answers are keyed by
   (answers[li*3+t]) and two laws have been renamed under their answers
   before. That entry is what holds the card on this law, lit, for the rest
   of the week: without it the third answer would move iqNext on and the card
   would serve a second law the same week.

   AND WHEN EVERY LAW IS MEASURED there is nothing to serve, so there is no
   card. The one exception is the week the last law was measured in, which
   keeps its lit card until Sunday, the same as any other week's.
   ============================================================ */
var RIT_LAW_ID=/^iq:\d+$/;
/* the Sunday that opens the week a day key falls in */
function ritLawWeek(day){return day-ritWc(day);}
/* THIS WEEK'S LAW, or null. {li, done}: li the law's index in SI, done when
   the did log holds its entry inside this week. A done entry wins over
   iqNext, which has already moved past it. */
function ritLawOf(p){
 if(!p||!p.intake||!p.intake.answers||typeof iqNext!=='function')return null;
 var today=ritToday0(), w0=ritLawWeek(today), hit=null;
 if(p===CURP)ritMore().did.forEach(function(x){
  if(!hit&&x[0]>=w0&&x[0]<=w0+6&&RIT_LAW_ID.test(x[1])&&SI[+x[1].slice(3)])hit=x;});
 if(hit)return {li:+hit[1].slice(3), done:true};
 var n=iqNext(p);
 return n==null?null:{li:n, done:false};}
/* the week's law measured: one did entry, once a week. Called by iqPress after
   the third answer's save has landed, never before it. */
function ritLawMark(li){
 /* not this person's own record: the answer was already refused or is not
    theirs to mark, and ritMoreWrite would put a failure over it */
 if(!SI[li]||!ritOwn())return false;
 var today=ritToday0(), w0=ritLawWeek(today), nx=iqNext(CURP);
 return ritMoreWrite(function(m){
  if(m.did.some(function(x){return x[0]>=w0&&x[0]<=w0+6&&RIT_LAW_ID.test(x[1]);}))return;
  m.did.push([today,'iq:'+li]);},
  'Measured. '+SI[li].nm+' was this week\'s law. '
  +(nx==null?'Every law is measured, so nothing more comes.':'The next law comes on Sunday, when the week turns.'));}
/* what the law is, for the badge's hover and tap: the verb its questions ask
   about, the Intake's own phrase (IQ_STEM, engine/intake.js), and what the
   ring round its mark says */
function ritLawSays(l){
 return 'How often you '+IQ_STEM[l.nm]+'. Its three questions each light one part of the ring, and a law with all three answered is measured.';}
/* how far the week's law is, in what is left and never as a fraction, the
   Intake header's rule: "1 of 3" is a score */
function ritLawLeft(W,g){
 if(W.done)return 'Measured this week';
 var left=3-g;
 return g?left+(left===1?' question left':' questions left'):'This week\'s law, 3 questions';}

/* ---------------- the card ----------------
   Last in Called for, after the practice cards (ritSugHtml says why), in
   the affirmations' row's shape and classes (ritAffCardHtml, ui/ritweek.js)
   for the same reasons: it is not a practice to add or dismiss, so it has no green and no red, and it is not
   in RIT.sug, whose readers take a card's place in that list as its index.
   Symbol first: the law's own ring from the Intake page (iqLawBadge), its
   segments lit as its answers land. Its name is the headline and the press,
   and the second row is the kind and how far, nothing else. Lit once the
   week's law is measured, the rule the affirmations' row keeps. */
function ritLawCardHtml(st){
 var W=ritLawOf(CURP); if(!W)return '';
 if(typeof iqArtCss==='function')iqArtCss();
 ritLawCss();
 var l=SI[W.li], s=iqScore(CURP)[l.nm], g=iqGot(CURP,W.li), K=ritKind('msr');
 return '<li class="rv-affc rv-lawc'+(W.done?' rv-on':'')+'" style="--c:'+ritKindCol('msr')+'" data-kind="msr">'
  +'<div class="rv-sgh"><button type="button" class="rv-sgn rv-bko'+(W.done?' rv-on':'')+'" data-act="law-open" data-wlaw="'+W.li+'" aria-label="'
  +esc('This week\'s law, '+l.nm+'. '+(W.done?'Measured this week. Open':'Answer its questions'))+'">'+esc(l.nm)+'</button>'
  +'<span class="rv-lawb"'+rvTip(l.nm,ritLawSays(l))+' role="img" aria-label="'+esc(l.nm+'. '+ritLawSays(l))+'">'+iqLawBadge(l,s,g,'md')+'</span></div>'
  +'<div class="rv-sgo"><span class="rv-sgk"'+rvTip(K.nm,K.says)+'>'+ritKindIc('msr')+esc(K.nm)+'</span>'
  +'<span class="rv-sgm">'+esc(ritLawLeft(W,g))+'</span></div></li>';}

/* ---------------- the pop-up ----------------
   The law the card opened, pinned on RIT.pop.li by the press, so the third
   answer leaves the person looking at what they just measured rather than at
   the next law, the Intake page's own lesson ("THE LAW IN HAND IS PINNED ON
   ARRIVAL", renderIntake). Inside the Intake page's grammar, its classes and
   its seat colour: the law's ring and seat line, the gap between the three
   answers (iqGap), and the three framings, all the Intake page's functions. */
function ritPopLaw(st){
 var P=RIT.pop, li=(P&&P.li!=null&&SI[P.li])?P.li:null;
 if(li==null){var W0=ritLawOf(CURP); li=W0?W0.li:null;}
 if(li==null)return ritPopGone('Every law is measured. Nothing is waiting this week.');
 var p=CURP, l=SI[li], s=iqScore(p)[l.nm], g=iqGot(p,li), W=ritLawOf(p), wk=!!(W&&W.done&&W.li===li);
 var body='<div class="iqa iqw rv-plaw" style="--c:'+seatCol(l.b)+'">'
  +'<div class="iqw-hd">'+iqLawBadge(l,s,g,'md')
  +'<div class="iqw-hx"><div class="iqa-sub"><b>'+esc(l.b)+'</b>, '+esc(IQ_SEATLINE[l.b])+'</div>'
  +'<div class="iqa-sub">'+esc(iqLine(s,g))+'</div></div></div>'
  +iqGap(p,li,356)
  +'<div class="iq-law open iqa-inhand">'+iqFramings(p,iqList(),li)+'</div>'
  +(wk?'<p class="rv-pp">'+(iqNext(p)==null?'Every law is measured, so nothing more comes.':'The next law comes on Sunday, when the week turns.')+'</p>':'')
  +'</div>';
 return ritPopShell(ritKindCol('msr'),l.nm,wk?'Measured this week':g>=3?'Measured':ritLawLeft({done:false},g),body,'');}
/* THE SCALE'S PRESSES. One answer through iqPress, then the page under the
   sheet and the pop-up are both drawn again from the record, and the
   keyboard is put back on the cell that was pressed, found by what it is.
   On a worked example the cells are drawn disabled, the Intake page's rule,
   so the pop-up reads as a reading and offers no press the engine refuses. */
function ritLawWire(c){
 var only=typeof showOnly==='function'&&showOnly();
 c.querySelectorAll('[data-a]').forEach(function(el){
  if(only){el.disabled=true; el.setAttribute('aria-disabled','true'); return;}
  el.onclick=function(){
   var a=el.getAttribute('data-a'), v=el.getAttribute('data-v');
   if(!iqPress(+a,+v))return;
   if(typeof render==='function')render();
   ritRender();
   if(!RIT.pop||RIT.pop.t!=='law')return;
   c.innerHTML=ritBankHtml(); ritBankWireIn();
   var f=c.querySelector('[data-a="'+a+'"][data-v="'+v+'"]');
   if(f){f.focus({preventScroll:true}); f.classList.add('iqa-pop');}};});}

/* ---------------- the look ----------------
   The card is the affirmations' row (ui/ritweek.js) and the framings are the
   Intake page's (iqArtCss names .iqw beside #iqbody), so this is only what
   neither has: the badge's place on the headline row, the pop-up's head row,
   and a wider sheet, because the sheet's 390 gives each of the eleven cells
   32 pixels and the Intake page gives them 48 at the same scale. */
function ritLawCss(){
 if(document.getElementById('ritlaw-css'))return;
 var st=document.createElement('style'); st.id='ritlaw-css';
 st.textContent=[
  '.rv-lawb{display:grid;place-items:center;min-width:44px;min-height:44px;border-radius:999px;cursor:help}',
  '.rv-lawb:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-lawc .rv-sgh{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;column-gap:12px}',
  '.sheet-card:has(.rv-plaw){width:min(600px,100%)}',
  '.rv-plaw{gap:16px}',
  '.iqw-hd{display:flex;align-items:center;gap:12px}',
  '.iqw-hx{display:flex;flex-direction:column;gap:2px;min-width:0}'
 ].join('\n');
 document.head.appendChild(st);}
