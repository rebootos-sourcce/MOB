
/* ============================================================
   ANALYTICS. Bubbles. Size is magnitude, colour is seat or tier. The
   biggest circle is the biggest thing. Line charts answered nothing
   about a single session; packed circles are what one snapshot looks
   like.
   ============================================================ */
var ANA_PICK=null;
function anaHist(){
 var h=(CURP&&CURP.history)||[];
 return h.slice().sort(function(a,b){return new Date(a.t)-new Date(b.t);});}
/* deterministic packing. biggest first, then spiral out until it fits. */
function anaPack(items,w,h){
 var out=[],cx=w/2,cy=h/2;
 items=items.slice().sort(function(a,b){return b.v-a.v;});
 /* a cleared field has every value at zero. dividing by that maximum gives NaN
    and the browser rejects the radius, so the floor is 1 and the circles come
    out uniformly small, which is the correct reading of nothing held. */
 var max=(items.length&&items[0].v>0)?items[0].v:1;
 /* size by AREA BUDGET. radius goes as sqrt(value), and the constant comes from
    how many circles must fit, not from the box. budget 46 percent of the field. */
 var sumS=items.reduce(function(a,x){return a+Math.max(0.05,x.v||0)/max;},0)||1;
 var K=Math.sqrt((w*h*0.46)/(Math.PI*sumS));
 items.forEach(function(it,i){
  var r=Math.max(7,Math.min(Math.min(w,h)*0.30, Math.sqrt(Math.max(0.05,it.v||0)/max)*K));
  var placed=false,ang=i*2.399,rad=0,tries=0;
  while(!placed&&tries<800){
   var x=cx+Math.cos(ang)*rad,y=cy+Math.sin(ang)*rad;
   var ok=(x-r>2&&x+r<w-2&&y-r>2&&y+r<h-2);
   if(ok)for(var k=0;k<out.length;k++){
    if(Math.hypot(x-out[k].x,y-out[k].y)<r+out[k].r+2.5){ok=false;break;}}
   if(ok){out.push({x:x,y:y,r:r,it:it});placed=true;}
   else{ang+=0.34;rad+=1.1;tries++;}}
  /* if it still will not fit, shrink rather than stack it on the pile */
  if(!placed){var rr=r;
   for(var s=0;s<14&&!placed;s++){
    rr*=0.82; ang=i*2.399; rad=0;
    for(var t=0;t<400&&!placed;t++){
     var x2=cx+Math.cos(ang)*rad,y2=cy+Math.sin(ang)*rad;
     var ok2=(x2-rr>2&&x2+rr<w-2&&y2-rr>2&&y2+rr<h-2);
     if(ok2)for(var m=0;m<out.length;m++){
      if(Math.hypot(x2-out[m].x,y2-out[m].y)<rr+out[m].r+2){ok2=false;break;}}
     if(ok2){out.push({x:x2,y:y2,r:rr,it:it});placed=true;}
     else{ang+=0.34;rad+=1.1;}}}
   if(!placed)out.push({x:cx,y:cy,r:Math.max(5,rr),it:it});}});
 return out;}
function anaField(title,sub,items,w,h){
 items=(items||[]).filter(function(x){return x&&x.nm;});
 if(!items.length)
  return '<div class="ab-f"><div class="pm-eye">'+title+'</div>'
   +'<div class="ab-none">nothing here</div></div>';
 var P=anaPack(items,w,h),top=P[0]?P[0].it.v:1, LMIN=13;
 /* NOTHING READ, SO NO FIGURE. The page says so in its first line and the
    bubbles still printed 10.0 and 7.2 off the blueprint it had selected.
    The bubbles keep their size, which is the blueprint, and lose the figure.
    Round J13. */
 var UN=false; try{UN=!!computeSeen().unread;}catch(e){}
 var s='<div class="ab-f"><div class="pm-eye">'+title+'</div>'
  +'<svg viewBox="0 0 '+w+' '+h+'" class="ab-svg">';
 P.forEach(function(p){
  var fit=p.r>=26, tiny=p.r<LMIN;
  var on=(ANA_PICK&&ANA_PICK.k===p.it.k&&ANA_PICK.nm===p.it.nm);
  /* EVERY BUBBLE IS A DOOR INTO THE TRAIL, round RB, and a keyboard can
     reach it: focusable, named, and Enter or Space presses it (the handler
     at the foot of this file). */
  s+='<g class="ab-b'+(on?' on':'')+'" data-ana="'+esc((p.it.k||'')+'|'+p.it.nm)+'" tabindex="0" role="button" '
   +'aria-label="'+esc('Open '+p.it.nm)+'">'
   +'<title>'+esc(p.it.nm+(UN?', not read yet':(p.it.v>0?', '+p.it.v.toFixed(1):', nothing held')))+'</title>'
   +'<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'+p.r.toFixed(1)
   +'" fill="'+p.it.c+'" opacity="'+(0.26+0.56*(p.it.v/(top||1))).toFixed(2)+'"/>'
   +'<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'+p.r.toFixed(1)
   +'" fill="none" stroke="'+p.it.c+'" stroke-width="1.2" opacity=".85"/>';
  if(!tiny){
   var fs=Math.max(11,Math.min(14,p.r*0.30));
   var room=Math.floor((p.r*1.7)/(fs*0.56));
   /* A name cut to "Hyper-Ach\u2026" names nothing and still costs the ink.
      A name that does not fit is dropped, and the bubble carries its value
      instead. The full name is on hover and in the list beside the chart. */
   var t=(p.it.nm.length<=room)?p.it.nm:'';
   if(t){
    s+='<text x="'+p.x.toFixed(1)+'" y="'+(p.y-(fit?3:-3)).toFixed(1)+'" text-anchor="middle" '
     +'class="ab-t" style="font-size:'+fs.toFixed(1)+'px">'+esc(t)+'</text>';
    if(fit)s+='<text x="'+p.x.toFixed(1)+'" y="'+(p.y+13).toFixed(1)+'" text-anchor="middle" '
     +'class="ab-v" style="font-size:'+Math.max(11,p.r*0.24).toFixed(1)+'px">'+(!UN&&p.it.v>0?p.it.v.toFixed(1):'\u2013')+'</text>';}}
  s+='</g>';});
 return s+'</svg>'+(sub?'<div class="ab-s">'+sub+'</div>':'')+'</div>';}
function anaRender(){
 var el=document.getElementById('ana'); if(!el)return;
 /* the reading this plan may see, ui/lock.js: the biggest thing compounding,
    the What is running chart and the masks chart are the tier's */
 var r=computeSeen(),H=anaHist(),prev=H.length>1?H[H.length-2]:null;
 var TIER={sup:PAL.Root,hy:PAL.Sacral,cx:PAL.Solar,sab:PAL.Throat};
 var seats=flSeats();
 var stop=null;seats.slice().reverse().forEach(function(s){if(!stop&&s.held)stop=s;});
 var loud=[].concat(r.sups,r.hys,r.cxs,r.sabs).sort(function(a,b){return b.w-a.w;})[0];
 var held=W.filter(function(n){return n.sq>=4;});
 var out='<div class="ana-wrap">';
 /* Every figure on this tab was bare except CQ, which carries a percent only
    because cr() appends one. A number with no scale is not a reading, it is a
    digit, and six of them sat here on six different scales. */
 var acc=accuracy(r);
 /* THIS SURFACE IS A DOOR OF ITS OWN AGAIN, round LV, unfolded from Summary
    on the same rule that put Games back on the bar: an integer never
    renumbers, so Analytics kept TAB.ANALYTICS and this renderer the whole
    time it had no door, and TABREAL no longer answers it with Summary. A
    tab in the bar is one click from a stranger who has entered nothing, the
    same reach it had while it rendered folded under Summary's own opening
    screen, so the guard below still has to hold. The eyebrow already knew
    how to say "not read yet" and the ring beside it printed 36 percent
    anyway once, which is the exact failure the ruling about the opening
    screen exposed. The ring holds a dash and the arc holds nothing. Same
    rule as everywhere else: a percentage is never printed off a default. */
 out+='<div class="ab-hero">'
  /* the ring opens coherence in the trail, round RB: the laws that make it,
     weakest first */
  +cr(r.darkB,r.unread?0:r.CQ,{size:'lg',label:'coherence',act:!r.unread,data:r.unread?'':'data-ana="met|cq"',
    /* HIGH COHERENCE IS THE GOOD END, so it never prints red. cr reddens
       anything past ninety, which is right for a charge and backwards for
       every reading whose high end is the one a person is working toward. */
    raw:r.unread?'\u2013':null, hot:false,
    color:r.unread?'var(--dim)':null})
  /* ONE SLOT, ONE LABEL. This read "Coherence, corrupt, 0 to 100" and it was
     doing three jobs: naming the slot, printing the tier and stating the
     range. The label changed identity with the data, which is the thing a
     person has to re-parse every time the reading moves, and "0 to 100" is the
     phrasing the owner struck: if you cannot use regular words to describe it,
     do not describe it. The regular words for a coherence number are the tier
     word itself, so the tier moves to the front of the reading where a value
     belongs and the label stays put. */
  +'<div><div class="pm-eye">Coherence</div>'
  +'<div class="ab-say">'
  +(r.unread?'Nothing has been entered, so none of this is measured yet. Every figure '
    +'below is drawn from the '+unp('blueprint')+' you have selected and not from a reading.'
   /* THE TIER WORD, which used to live in the label. It is the reading in
      plain words and it goes first, because it is the one thing on this
      surface a person reads before anything else.

      It is attached and not left standing. "Corrupt." alone, bold, with a full
      stop after it, is a band word with nothing on it, which is a judgement
      and not a reading. The subject is the field, which is the right distance:
      a person at level 3 who is defended reads a verdict in a bare label and
      a measurement in a sentence about their field. */
   /* and while CQ is still filling there is no word yet, so the sentence says
      what is left rather than naming a band off laws nobody answered */
   :(r.tier?'The field reads <b>'+esc(r.tier.toLowerCase())+'</b>. '
     :'Coherence is still filling, with <b>'+esc(tierSay(r))+'</b>. ')
   +(loud?'<b>'+esc(loud.nm)+'</b> is the biggest thing running. '
     /* "Nothing is compounding" is a claim about somebody's chain, and a plan
        that cannot see the chain has no grounds to make it */
     :(r.locked&&r.locked.length===SEE_ORDER.length?'':'Nothing is compounding. '))
   /* a count against a total is a score, and this is not a score */
   +(stop?'Flow stops at the <b>'+stop.p.n.toLowerCase()+'</b>. ':'Every seat is passing. ')
   /* HELD, NOT CARRYING, round RB. The count is of addresses at 4 or more,
      which this product calls held; carrying is anything above nothing
      (engine/compute.js, CARRYING IS NOT THE SAME AS HELD), so the word was
      wrong for the number beside it. And the shadow is a share of all 112,
      not a weight those held addresses make between them, so the sentence
      no longer says they make it. The Shadow tile below says what it is. */
   +(held.length?'<b>'+held.length+'</b> address'+(held.length===1?' is':'es are')
     +' held, and the shadow across all '+NODES.length+' reads <b>'+Math.round(r.DQ)+' per cent</b>.'
   /* Held above the line and carrying anything at all are two different facts
      and this said the second when it only knew the first. A field with load
      spread under the line reported "Nothing is carrying" beside a tier word
      earned by that same load. It now says which of the two is true. */
    :(r.heaviest?'Nothing is above the line. The heaviest is <b>'+esc(r.heaviest.k)
      +'</b> at <b>'+r.heaviest.sq.toFixed(1)+'</b>, at the '
      +String(r.heaviest.b).toLowerCase()+'.':'Nothing is carrying.'))
   /* only against a row the same arithmetic wrote. A row from before 25
      September holds It*Ig/Rz, and the gap to the laws over 210 is the
      formula changing, not the person moving. */
   /* a move that prints as 0.0 is no move, round RB: "CQ up 0.0" read as
      a change and was a rounding */
   +(prev&&prev.m===CQ_MODEL?(Math.abs(r.CQ-prev.cq)<0.05?' CQ has not moved since last session.'
     :' CQ '+(r.CQ-prev.cq>0?'up ':'down ')+Math.abs(r.CQ-prev.cq).toFixed(1)+' since last session.'):''))
  +'</div>'
  /* THE FIGURE STAYS ON THE TAB WHOSE JOB IS SAYING WHAT THE INSTRUMENT
     KNOWS. The tolerance beside it does not. It printed "58% plus or minus
     11" and then a line telling a person to compare their own movement
     against that eleven, which is a lab readout and a conversion exercise.
     Ruled: "100 plus minus 12, swing 11, that shit has to all go."

     What the line owed was never the number, it was the warning. The
     coverage facts underneath are what actually widen it, they are stated by
     name, and they are the things a person can go and change. So the note
     keeps the warning in plain words and drops the arithmetic.

     AND THE EMPTY STATE IS SAID THE ONE WAY. This read "Nothing measured",
     which is one of the five phrasings of one state the product was carrying,
     and the copy seat's sweep names it. The wording is not read yet, as a
     value, and "Nothing read yet, so what is absent" as a sentence. */
  /* a press opens the identification drill that already exists
     (ui/personas.js runAccDrill), round RB */
  +'<div class="ab-acc"'+(r.unread?'':' data-ana="met|id" role="button" tabindex="0"')+'><span class="pm-eye">Identification</span>'
  +'<b>'+(r.unread?'\u2013':acc.pct.toFixed(0)+'%')+'</b>'
  +'<span class="ab-note">'+(r.unread
    ?'Nothing read yet. Write what happened and this fills in.'
    /* the coverage as a fact and a remainder, not as a fraction of the person */
    :acc.cov+' law'+(acc.cov===1?'':'s')+' measured'
     +(acc.cov<21?', '+(21-acc.cov)+' still at the default':'')
     /* held, round RB: accuracy() counts addresses at 4 or more */
     +(acc.held?', '+acc.held+' address'+(acc.held===1?'':'es')+' held':'')
     +'. The needle has play in it, so a small move is not a reading.')+'</span></div>'
  +'</div></div>'+anaHot(r)+'<div class="ab-grid">';
 /* HS SWEEP. Every chart here carried a caption under it saying how to read
    it: what the heading means and that a bigger mark is more. A bubble chart
    says bigger is more by being one, and the heading names the set. The one
    caption kept is the colour key on What is running, because four kinds
    share one chart and colour is the only thing telling them apart. Its tail,
    the bigger the mark, goes with the rest. */
 out+=(lockSees('mask')?anaField('Masks','',
  r.maskRing.map(function(m){return {k:'mask',nm:m.nm,v:m.w,
   c:seatCol((m.bands||['Heart'])[0])};}),300,210)
  :'<div class="ab-f"><div class="pm-eye">Masks</div>'+lockPanelHtml('mask',{brief:true})+'</div>');
 out+=anaField('Domains','',
  S.doms.map(function(di){var d=DOMAINS[di];return {k:'dom',nm:d.nm,v:9,c:rootPlain(d.r)};})
   .concat(DOMAINS.filter(function(d,i){return S.doms.indexOf(i)<0;}).slice(0,9)
    .map(function(d){return {k:'dom',nm:d.nm,v:2,c:rootPlain(d.r)};})),300,210);
 out+=anaField('Archetypes','',
  (r.aff||[]).map(function(a,i){return {k:'arch',nm:(ARCH[i]||{}).nm||'',
   v:Math.max(0.4,a*10),c:(i===r.pi?GOLD:PAL['3rd Eye'])};}),300,210);
 out+=(r.locked&&r.locked.length===SEE_ORDER.length
  /* nothing of the chain is visible on this plan: the chart's place says so
     rather than printing "nothing here" over a chain somebody has */
  ?'<div class="ab-f"><div class="pm-eye">What is running</div>'+lockPanelHtml('sab',{brief:true})+'</div>'
  :anaField('What is running','blue saboteur, gold complex, orange hyper, red character',
  /* THE SIXTEEN HEAVIEST, NOT THE FIRST SIXTEEN, round RB. The list is in
     ring order, character first, so on a deep chain the cut at sixteen took
     every character layer, hyper and complex and no saboteur at all: Gordon
     drew sixteen bubbles and none in the blue the key names. Sorted by
     weight, the chart shows what the eyebrow says, what is running hardest. */
  [].concat(r.sups,r.hys,r.cxs,r.sabs).sort(function(a,b){return b.w-a.w;}).slice(0,16).map(function(o){
   return {k:'chain',nm:o.nm,v:o.w,c:o.over?ALARM:(TIER[o.kind]||PAL.Throat)};}),300,210));
 out+=anaField('The nine axes','',
  CHILD.map(function(c){return {k:'axis',nm:c.nm,v:Math.max(0.3,S.charge[c.nm]||0),
   c:seatCol(c.seat)};}),300,210);
 out+=anaField('The seven seats','',
  seats.map(function(s){return {k:'seat',nm:s.p.n,v:Math.max(0.3,s.hot),
   c:seatCol(K2B[s.p.k])};}),300,210);
 out+='</div>';
 /* TELEMETRY, round RB, his words: "I want the analytics page to give me
    telemetry and have that telemetry broken out in as many dimensions as we
    can to see what's running and where." What follows is the engine's own
    arithmetic and nothing new: the six readings compute() returns, every
    address split by seat and by feeling, and the chain counted ring by ring. */
 out+=anaTele(r);
 var laws=SI.map(function(l){return {nm:l.nm,b:l.b,v:S.law[l.nm]};});
 var shutL=laws.filter(function(l){return l.v<4;});
 /* 21 of the 76, and the 21 are the Laws of Moral Integrity. Saying "the 21
    laws" with no frame reads as though there were only 21. */
 /* THE LABEL IS THE LABEL. This was a whole statement in an eyebrow, so it
    printed "Moral Integrity, 21 Of The 76 Laws, Each 0 To 10, None Shut". The
    frame is still owed to the person and it is prose, so it goes in the prose
    class underneath. "each 0 to 10" is the struck phrasing and the plain words
    for that scale are the ones the intake already uses: never to every time.

    "scored" was the first word here and terms.py caught it: this product says
    a reading is not a score, and drills.js tells a person in as many words
    that nothing is scored. The intake already counts what a person has
    answered, so answered is the word. */
 /* AND THE FRAME IS GONE TOO, round HS. "21 laws, each answered from never
    to every time" was the section describing itself under its own heading.
    The twenty one bars are the count, and the scale is said once, where it
    is answered, in the intake's key. */
 out+='<div class="pm-eye" style="margin-top:20px">Moral integrity</div>'
  +'<div class="ana-laws">';
 laws.forEach(function(l){
  /* a bar is a button now, round RB, and opens its law in the trail */
  out+='<button type="button" class="ana-lw'+(l.v<4?' shut':'')+'" data-ana="'+esc('law|'+l.nm)+'" title="'+esc(l.nm+' '+l.v.toFixed(1)+(l.v<4?', shut':''))+'">'
   +'<s><u style="height:'+Math.max(4,Math.round(l.v/10*60))+'px;background:'
   +seatCol(l.b)+'"></u></s><span>'+l.nm.slice(0,3)+'</span></button>';});
 out+='</div>';
 /* AND THE SHUT COUNT, which the eyebrow used to carry. The none shut case
    was said there too and would have been lost, so this line answers in both
    directions rather than only when there is bad news. */
 out+='<p class="sum-p">'+(shutL.length?'Shut: <b>'
  +shutL.map(function(l){return l.nm;}).join(', ')+'</b>.':'None shut.')+'</p>';
 if(H.length>1){
  out+='<div class="pm-eye" style="margin-top:20px">'+H.length+' sessions</div>'
   /* the third printing of the same tolerance on one surface. Same ruling,
      same treatment: the warning survives, the arithmetic does not. */
   /* HS sweep: a legend for the strip, and the needle warning said a second
      time on this surface. Each bar names its CQ and seat on its title, and
      the warning stands once, beside Identification. */
   +'<div class="ana-strip">';
  /* ESCAPED, ROUND RA: x.dark is a history row's own string, checked by the schema
     boundary for type only, not content (engine/schema.js); it lands in a title
     attribute here, where an unescaped quote breaks out of it. esc() closes that. */
  /* and a session is a button, round RB: its whole row opens in the trail,
     every figure the snapshot kept and how far each moved from the one before */
  H.forEach(function(x,i){out+='<button type="button" class="ana-px" data-ana="sess|'+i+'" title="CQ '+x.cq+', heaviest at the '+esc(String(x.dark).toLowerCase())
   +'"><u style="height:'+Math.max(6,Math.round(x.cq/100*50))+'px;background:'
   +seatCol(x.dark)+'"></u></button>';});
  out+='</div>';}
 var meas=SI.filter(function(l){return CURP&&CURP.laws&&CURP.laws[l.nm]!=null;});
 /* HS SWEEP, AND PASS ONE BEFORE IT. "Every law is measured, so nothing here
    is a default" said nothing a person acts on and is silent now. The other
    two said an unanswered law "flatters the score", which has been untrue
    since 25 September: engine/compute.js counts an unanswered law 0 against a
    fixed 210, and the default 6 never enters CQ. What is true is that the
    bars above draw an unanswered law at that 6, so that is what is said, and
    the route names the section by the word on the button that opens it. */
 var unm=21-meas.length;
 out+=(unm?'<p class="sum-p" style="margin-top:18px">'
    +(meas.length?'<b>'+unm+'</b> law'+(unm===1?' is':'s are')+' unmeasured, drawn above at the default 6.'
      :'No law is measured yet. All 21 are drawn above at the default 6.')
    +' Answer them in Energetics.</p>':'')
  +'</div>';
 /* the record. every snapshot the profile carries, and the distance between
    any two of them. the data has been accruing since the rebuild. */
 out+='<div class="ab-f" id="rec"></div>';
 el.innerHTML=out;
 recRender();
 /* every press on this page and in its trail goes through one handler, at
    the foot of this file, round RB */
 anaDrill();}
/* ============================================================
   RUNNING HOT. GQ in TASKS.md, his words: "And the running hot, add that to
   analytics. Yeah, that's really, really good." The list sat beside the
   Field in the Fringe mockup, proto/field/tension/src/common.js, and it
   comes here on the same terms the shipped Field now bends by (ui/wheel.js,
   THE RING BENDS UNDER LOAD): past five, heaviest first, and which way each
   one last moved.

   A ROW OPENS THE ADDRESS. In the mockup a row flew the camera to it, and
   there is no camera on this surface. The row is the product's own address
   row, so it opens the same drill every other address row opens.

   TWELVE ROWS AND A COUNT. A heavy field has fifty addresses past five, and
   fifty rows is a spreadsheet of feelings, which the badge rule in
   ui/component.js was written against. The count says how many there are
   and how they split, and the Field draws every one.

   Nothing on an unread field. The hero above already says nothing is
   entered, and a list of none says it a second time.
   ============================================================ */
const ANA_HOT_ROWS=12;
/* THE THREE WORDS ARE NOT ONE COLOUR. Collapsing is the opposite going in,
   and the fetter layer on the Field already draws what is installed in the
   Heart's colour, so it takes that, off the lighting in force when the row
   is drawn. Expanding is load arriving and reads at full ink. Steady is the
   absence of news and sits at the dim step. */
function anaHotInk(d){return d==='collapsing'?seatCol('Heart'):(d==='steady'?'var(--dim)':'var(--ink)');}
function anaHot(r){
 if(r.unread||typeof hotList!=='function')return '';
 var L=hotList(), t={expanding:0,collapsing:0,steady:0};
 L.forEach(function(n){t[hotDir(n)]++;});
 var s='<div class="pm-eye" style="margin-top:20px">Running hot</div>';
 if(!L.length)s+='<p class="sum-p">No address is past five. Past five an address pulls '
  +'more than half as hard as it can, and the ring on the Field bends under it.</p>';
 else s+=anaHotRows(L,t);
 return '<div class="ana-hot">'+s+'</div>';}
var ANA_DIRSAY={expanding:'Its charge rose on its last change.',
 collapsing:'Its charge fell on its last change.',
 steady:'It has not moved since this record was opened.'};
function anaHotRows(L,t){
 var say=[], s='';
 ['expanding','collapsing','steady'].forEach(function(k){if(t[k])say.push('<b>'+t[k]+'</b> '+k);});
 s='<p class="sum-p"><b>'+L.length+'</b> address'+(L.length===1?' is':'es are')
  +' past five, where an address pulls more than half as hard as it can and the ring on the '
  +'Field bends under it. '+say.join(', ')+'.</p>'
  /* HS sweep: a three sentence legend for the three direction words sat
     between the count and the rows. Each word now carries its own meaning as
     its title, and the colour of the word already separates the three. */
  +'<div class="ad-rows">'+L.slice(0,ANA_HOT_ROWS).map(function(n){var d=hotDir(n);
   return '<button type="button" class="ad-r" data-addr="'+n.i+'" data-ana="addr|'+n.i+'" data-dir="'+d+'" '
    +'title="Open '+esc(n.k)+'">'+crbNode(n,'sm')
    +'<span>'+esc(n.k)+'</span><em style="color:'+anaHotInk(d)+'" title="'+esc(ANA_DIRSAY[d]||'')+'">'+d+'</em></button>';}).join('')+'</div>';
 if(L.length>ANA_HOT_ROWS)s+='<p class="sum-p">The '+ANA_HOT_ROWS+' heaviest. '
  +(L.length-ANA_HOT_ROWS)+' more are past five, and the Field draws every one.</p>';
 return s;}
/* ============================================================
   THE TRAIL. Round RB, his words: "all the bubbles. I should be able to click
   on it and drill down deeper and trace all my patterns down to the fetters.
   ... If I click on any analytics, I want it to give me a summary on the
   right side."

   WHAT WAS HERE. A press on a bubble opened one card one level down and
   stopped: a hyper-complex jumped straight to its addresses, the complexes
   and saboteurs between were never shown, and nothing on the card could be
   pressed. Seven kinds of bubble had a card and nothing else on the page did.
   And it is where the line he read came from, "Built from 1 held addresses
   across Root": it counted every address under the pattern and called all of
   them held, which only the ones at 4 or more are.

   WHAT IT IS NOW. Every figure on this page and every row on a card is a
   door, and each door adds a step to a trail shown at the top of the card,
   so a person can go down and come back up the same way. The chain is the
   engine's own and nothing is invented here (engine/compute.js, compute):

     character layer  two hyper-complexes running together
     hyper-complex    the complexes of one family
     complex          two saboteurs of one family
     saboteur         a group of addresses charged at once
     fetter           the named pattern at one address (engine/data/gloss.js)
     axis             the feeling that address holds, against its opposite

   and every card also splits what it is made of by seat and by feeling, which
   are the two directions the engine files every address by.

   ONE CARD PER THING. The address card and the law card are the product's
   own, built by nodeDrillHtml and lawDrillHtml in ui/drills.js, so a press
   here and a press on the Field show the same card. The trail only adds the
   steps above it and makes its rows into doors.

   ANA_PICK stays what it was, {k, nm}, the thing on the card now, and
   anaDrill() still answers it: tests/unpack.js sets it and calls anaDrill by
   name. ANA_TRAIL is the steps that led there.
   ============================================================ */
var ANA_TRAIL=[];
var ANA_KIND={sup:['character','Character layer'],hy:['hyper complex','Hyper-complex'],
 cx:['complex','Complex'],sab:['saboteur','Saboteur']};
function anaKey(k,nm){return esc(k+'|'+nm);}
function anaPl(n,one,many){return n+' '+(n===1?one:many);}
function anaAnd(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
function anaBySq(a,b){return b.sq-a.sq;}
function anaChainOf(r){return [].concat(r.sups,r.hys,r.cxs,r.sabs);}
function anaFind(r,nm){return anaChainOf(r).filter(function(x){return x.nm===nm;})[0]||null;}
/* the seat bubbles are named by FLOWSEAT, where the 3rd Eye is Brow, and the
   engine files an address by band. One lookup between the two. */
function anaSeatNm(band){
 var s=flSeats().filter(function(x){return K2B[x.p.k]===band;})[0];
 return s?s.p.n:band;}
function anaSeatWord(band,cap){return unp('seat:'+String(band).toLowerCase(),cap?band:(band==='3rd Eye'?'3rd eye':String(band).toLowerCase()));}
/* a count, with nought as the dash the product prints for nothing */
function anaN(n){return n?String(n):'\u2013';}
/* A DOOR TO ONE THING, a row with its own badge, for the step from an
   address to its feeling or its seat. Bars compare groups on one scale and
   these are not on one scale, so they are rows and not bars. */
function anaAxisRow(nm){
 var c=CHILD.filter(function(x){return x.nm===nm;})[0]; if(!c)return '';
 var v=S.charge[c.nm]||0;
 return '<button type="button" class="ad-r" data-ana="'+anaKey('axis',c.nm)+'" title="'+esc('Open '+c.nm+', the feeling, held against '+c.opp.toLowerCase())+'">'
  +crBadge(c.seat,v*10,{size:'sm',raw:v.toFixed(1),title:c.nm+' held'})
  +'<span>'+esc(c.nm)+'</span><em>'+unp('axis','toward '+c.opp.toLowerCase())+'</em></button>';}
function anaSeatRow(band){
 var s=flSeats().filter(function(x){return K2B[x.p.k]===band;})[0]; if(!s)return '';
 return '<button type="button" class="ad-r" data-ana="'+anaKey('seat',s.p.n)+'" title="'+esc('Open the '+band.toLowerCase()+' seat')+'">'
  +crBadge(band,Math.min(100,s.load*100),{size:'sm',raw:anaN(s.hot),title:anaPl(s.hot,'address','addresses')+' held at the '+band.toLowerCase()})
  +'<span>'+esc(s.p.n)+'</span><em>'+anaSeatWord(band)+' seat</em></button>';}
function anaBands(list){var bs=[];list.forEach(function(n){if(n.b&&bs.indexOf(n.b)<0)bs.push(n.b);});
 return BANDS.filter(function(b){return bs.indexOf(b)>=0;});}

/* ---- the rows a card is made of ---- */
/* A pattern as a row: the badge carries its weight as a ring and a figure,
   which is the picture V22 asks for, and the kind word carries its meaning. */
function anaPatRow(o){
 var lv=leaves(o), b=(lv[0]||{}).b||'Heart', K=ANA_KIND[o.kind]||['pattern','Pattern'];
 return '<button type="button" class="ad-r" data-ana="'+anaKey('chain',o.nm)+'" title="'+esc('Open '+o.nm)+'">'
  +crBadge(b,o.w*10,{size:'sm',raw:o.w.toFixed(1),color:o.over?ALARM:null,
    title:o.nm+', '+K[1].toLowerCase()+(o.over?', overshot':'')})
  +'<span>'+esc(o.nm)+'</span><em>'+unp(K[0],K[1].toLowerCase()+(o.over?', overshot':''))+'</em></button>';}
function anaAddrRows(list,max){
 max=max||10;
 return '<div class="ad-rows">'+list.slice(0,max).map(function(n){return addrRow(n,{ana:true});}).join('')
  +(list.length>max?'<div class="pm-more">and '+(list.length-max)+' more</div>':'')+'</div>';}
function anaPatRows(list,max){
 max=max||8;
 return '<div class="ad-rows">'+list.slice(0,max).map(anaPatRow).join('')
  +(list.length>max?'<div class="pm-more">and '+(list.length-max)+' more</div>':'')+'</div>';}
/* A SPLIT, as bars. Each row is a door. The bar is the charge left on the
   addresses in that group, added up, and drawn against the biggest group on
   the same card, so the longest bar is the heaviest group and nothing else.
   The figure beside it is a count of fetters, which a person can check. */
function anaGroup(list,keyf){
 var m={},order=[];
 list.forEach(function(n){var k=keyf(n); if(k==null)return;
  if(!m[k]){m[k]={k:k,n:0,h:0,v:0};order.push(k);}
  m[k].n++; m[k].v+=n.sq; if(n.sq>=4)m[k].h++;});
 return order.map(function(k){return m[k];}).sort(function(a,b){return b.v-a.v||b.n-a.n;});}
function anaBars(rows){
 var max=rows.reduce(function(a,x){return Math.max(a,x.v);},0)||1;
 return '<div class="ana-bars">'+rows.map(function(x){
  var w=x.v>0?Math.max(3,Math.round(x.v/max*100)):0;
  return '<button type="button" class="ana-bar" data-ana="'+x.key+'" title="'+esc(x.title)+'">'
   +'<span class="ana-bar-n">'+x.lbl+'</span>'
   +'<span class="ana-bar-t"><i style="width:'+w+'%;background:'+x.c+'"></i></span>'
   +'<span class="ana-bar-f">'+x.fig+'</span></button>';}).join('')+'</div>';}
function anaFig(g){return anaPl(g.n,'fetter','fetters')+(g.h?', '+g.h+' held':'');}
function anaByFeeling(list){
 return anaBars(anaGroup(list,function(n){return n.cf;}).map(function(g){
  var c=CHILD.filter(function(x){return x.nm===g.k;})[0]||{};
  return {key:anaKey('axis',g.k),lbl:esc(g.k),v:g.v,c:seatCol(c.seat||'Heart'),fig:anaFig(g),
   title:'Open '+g.k+'. The bar is the charge left on these fetters, added up.'};}));}
function anaBySeat(list){
 return anaBars(anaGroup(list,function(n){return n.b;}).map(function(g){
  return {key:anaKey('seat',anaSeatNm(g.k)),lbl:anaSeatWord(g.k,true),v:g.v,c:seatCol(g.k),fig:anaFig(g),
   title:'Open the '+String(g.k).toLowerCase()+' seat. The bar is the charge left on these fetters, added up.'};}));}
/* the two splits, under one pair of headings, for any set of addresses */
function anaSplits(list){
 if(!list.length)return '';
 return '<div class="pm-eye" style="margin-top:14px">By feeling</div>'+anaByFeeling(list)
  +'<div class="pm-eye" style="margin-top:12px">By seat</div>'+anaBySeat(list);}
/* the patterns running on a set of addresses, or the lock where the plan
   cannot see them. Never "nothing runs here" to a plan that cannot look. */
function anaRunning(r,list,head){
 if(!lockSees('sab'))return '<div class="pm-eye" style="margin-top:14px">'+head+'</div>'+lockPanelHtml('sab',{brief:true});
 var ids={}; list.forEach(function(n){ids[n.i]=1;});
 var on=anaChainOf(r).filter(function(o){return leaves(o).some(function(n){return ids[n.i];});})
  .sort(function(a,b){return b.w-a.w;});
 if(!on.length)return '';
 return '<div class="pm-eye" style="margin-top:14px">'+head+' '+on.length+'</div>'+anaPatRows(on,8);}
/* the stories that landed on these seats, as the drill always showed them */
function anaStories(bands){
 var ents=((CURP&&CURP.story&&CURP.story.entries)||[]);
 var hit=ents.filter(function(e){return bands.some(function(b){return e.bands&&e.bands[B2K[b]];});});
 var s='<div class="pm-eye" style="margin-top:14px">From your stories, '+hit.length+'</div>';
 return s+(hit.length?hit.slice(0,4).map(function(e){
  return '<div class="ad-q">'+esc(e.text.slice(0,130))+(e.text.length>130?'…':'')+'</div>';}).join('')
  :'<p class="ad-p">No entry has landed on these seats yet.</p>');}
/* how many of a set are held, how many carry under the line, said once */
function anaHeldSay(list){
 var h=list.filter(function(n){return n.sq>=4;}).length;
 var u=list.filter(function(n){return n.sq>0&&n.sq<4;}).length;
 return (h?'<b>'+h+'</b> '+(h===1?'is':'are')+' held, at 4 or more.':'None is held at 4 or more.')
  +(u?' <b>'+u+'</b> more '+(u===1?'carries':'carry')+' charge under that line.':'');}
/* the feeling and the seat under one address, as two doors, for the card
   ui/drills.js builds (nodeDrillHtml asks for this by name) */
function anaTraceRows(n){
 var h=(n.cf?anaAxisRow(n.cf):'')+(n.b&&BANDS.indexOf(n.b)>=0?anaSeatRow(n.b):'');
 return h?'<div class="pm-eye">Under it</div><div class="ad-rows">'+h+'</div>':'';}

/* ---- the cards ---- */
function anaHead(eye,nm,sub){
 return '<div class="pm-eye">'+eye+'</div><div class="ad-nm">'+esc(nm)+'</div>'
  +(sub?'<div class="ad-sub">'+sub+'</div>':'');}
/* a figure row: one word over each figure, V17 */
function anaKv(pairs){
 return '<div class="ana-kv">'+pairs.map(function(p){
  return '<div><span>'+p[0]+'</span><b>'+p[1]+'</b></div>';}).join('')+'</div>';}
function anaChainCard(r,o){
 var K=ANA_KIND[o.kind]||['pattern','Pattern'];
 var lv=leaves(o).slice().sort(anaBySq), bs=anaBands(lv);
 var fets=[];lv.forEach(function(n){if(n.cf&&fets.indexOf(n.cf)<0)fets.push(n.cf);});
 var oppOf=function(f){var c=CHILD.filter(function(x){return x.nm===f;})[0];return c?c.opp:'';};
 var opps=fets.map(oppOf).filter(Boolean);
 var inst=fets.filter(function(f){return (S.replace[f]||0)>=4;});
 var h=anaHead(unp(K[0],K[1])+(o.over?', overshot':''),o.nm,o.auth?esc(o.auth):'');
 h+=anaKv([['Weight',crBadge(bs[0]||'Heart',o.w*10,{size:'md',raw:o.w.toFixed(1),color:o.over?ALARM:null,
   title:'How heavily it runs, on the same scale as an address'})],
  ['Fetters',anaN(lv.length)],['Held',anaN(lv.filter(function(n){return n.sq>=4;}).length)],
  ['Seats',anaN(bs.length)]]);
 /* the word's own meaning, from the one table. Not "What it is": a
    saboteur's card carries that heading already, for its library entry
    (kbSabBlock), and two headings of one name read as one section twice. */
 h+='<div class="pm-eye">What the word means</div><p class="ad-p">'+unpSay(K[0])+'</p>';
 /* WHAT IT RUNS ON, AND HOW ITS WEIGHT IS MADE. Each sentence is the line in
    compute() that builds it, said in words. */
 var made=o.over?'Its weight is how far past the helpful point the opposite sits, on average, across those fetters.'
  :o.kind==='sab'?(o.named?'Its weight is the average charge on the feelings it is matched on.'
    :'Its weight is the average charge left on those fetters.')
  :o.kind==='cx'?'Its weight is the average of its two saboteurs.'
  :o.kind==='hy'?'Its weight is the average of the complexes in it.'
  :'Its weight is the average of its two hyper-complexes.';
 h+='<div class="pm-eye">How it runs through you</div><p class="ad-p">'
  +(o.over?'Overshot. The opposite of the feeling underneath is put in past the point where it helps, '
    +'so these fetters will not shut, where a held fetter will not open. ':'')
  +'It runs on <b>'+anaPl(lv.length,'fetter','fetters')+'</b> at the '+anaAnd(bs.map(function(b){return b==='3rd Eye'?'3rd eye':b.toLowerCase();}))
  +(bs.length===1?' seat':' seats')+'. '+anaHeldSay(lv)+' '+made
  +(o.kind==='sab'&&o.score?' Matched at <b>'+o.score+'%</b>, a measure of how closely your feelings fit the ranges this saboteur is defined by.':'')
  +(o.kind==='sup'?' A character layer costs more than it looks like it should, because you cannot see it as separate from you.':'')
  +'</p>';
 if(o.kind==='sab'&&typeof kbSabBlock==='function')h+=kbSabBlock(String(o.nm).replace(/ overshot$/,''));
 if(o.kind!=='sab'&&o.parts&&o.parts.length){
  var down=({sup:'Its hyper-complexes',hy:'Its complexes',cx:'Its saboteurs'})[o.kind]||'Made of';
  h+='<div class="pm-eye">'+down+'</div>'+anaPatRows(o.parts,8);}
 h+='<div class="pm-eye" style="margin-top:14px">'+(o.kind==='sab'?'Made of':'The fetters underneath')+'</div>'+anaAddrRows(lv,o.kind==='sab'?12:8);
 h+=anaSplits(lv);
 h+='<div class="pm-eye" style="margin-top:14px">The opposite</div><p class="ad-p">'
  +(opps.length?'It runs on '+fets.join(', ').toLowerCase()+'. The opposite is <b>'+opps.join(', ').toLowerCase()+'</b>. '
    +(inst.length?'You already have '+inst.map(oppOf).join(', ').toLowerCase()+' partly installed.'
      :'None of it is installed yet. Release empties the address, and the opposite is what fills it.')
   :'No feeling and its opposite sits underneath this one.')+'</p>';
 return h+anaStories(bs);}
function anaAddrCard(r,n){return nodeDrillHtml(n,{ana:true});}
function anaAxisCard(r,nm){
 var c=CHILD.filter(function(x){return x.nm===nm;})[0]; if(!c)return null;
 var own=W.filter(function(n){return n.cf===nm;}).sort(anaBySq);
 var where=String(c.addr).indexOf('plexus')>=0?unp('plexus',c.addr):esc(c.addr);
 var h=anaHead(unp('axis','Axis'),c.nm+' toward '+c.opp,where+', '+esc(c.loc));
 h+=anaKv([['Held',crBadge(c.seat,(S.charge[c.nm]||0)*10,{size:'md',raw:(S.charge[c.nm]||0).toFixed(1),title:c.nm+' held'})],
  ['Installed',crBadge(c.seat,(S.replace[c.nm]||0)*10,{size:'md',raw:(S.replace[c.nm]||0).toFixed(1),title:c.opp+' installed'})],
  ['Fetters',anaN(own.length)]]);
 h+='<p class="ad-p">'+unpSay('axis')+' Held is how much '+c.nm.toLowerCase()+' is stored. Installed is how much '
  +c.opp.toLowerCase()+' is in place. Coherence is the centre of this axis, not either end. It runs through <b>'
  +anaPl(own.length,'fetter','fetters')+'</b>. '+anaHeldSay(own)+'</p>';
 h+='<div class="pm-eye">Its fetters</div>'+anaAddrRows(own,10);
 h+='<div class="pm-eye" style="margin-top:12px">By seat</div>'+anaBySeat(own);
 return h+anaRunning(r,own,'Running on it');}
function anaSeatCard(r,nm){
 var s2=flSeats().filter(function(x){return x.p.n===nm;})[0]; if(!s2)return null;
 var bn=K2B[s2.p.k];
 var seg=W.filter(function(n){return n.b===bn;}).sort(anaBySq);
 /* AX8, closed 2 October. The sub line printed "Sahasrara · Cranial plexus
    · 963 Hz" bare, and the paragraph opened "Vritti pineal, cortical". The
    sub line's terms carry their sentences now, and the level is its own
    sentence. Vritti is gone: the codex makes it the wave around a nerve,
    never a spine level. The reason is written at engine/data/gloss.js. The
    Hz wears its own seat's colour, as ruled 25 September (TASKS.md AX8). */
 var h=anaHead('Seat',s2.p.n)+'<div class="ad-sub">'+unp(s2.p.n,s2.p.sk,'yoga')+' · '+unp('plexus',s2.p.nv)
  +' · <span style="color:'+seatCol(bn)+'">'+unp('seat tone',s2.p.hz+' Hz')+'</span></div>';
 h+='<p class="ad-p">'+unpSay('level:'+s2.p.k)+' The seat sits at '+unp('spot:'+s2.p.k,s2.p.seat)+'. It passes <b>'
  +Math.round(s2.pass*100)+'%</b> of what reaches it. <b>'+s2.hot+'</b> address'
  +(s2.hot===1?' is':'es are')+' held here.</p>';
 /* the laws seated here, as doors, round RB. They were chips that went nowhere. */
 var laws=SI.filter(function(l){return l.b===bn;});
 h+='<div class="pm-eye">Moral integrity seated here</div><div class="ad-rows">'+laws.map(function(l){
  var read=(typeof lawIn!=='function')||lawIn(l.nm), v=S.law[l.nm];
  return '<button type="button" class="ad-r" data-ana="'+anaKey('law',l.nm)+'" title="'+esc('Open '+l.nm)+'">'
   +crBadge(bn,read?v*10:0,{size:'sm',raw:read?v.toFixed(1):'\u2013',title:l.nm+(read?'':', not read yet')})
   +'<span>'+esc(l.nm)+'</span><em>'+(!read?'not read yet':v<4?'shut':v>=7?'open':'working')+'</em></button>';}).join('')+'</div>';
 h+='<div class="pm-eye" style="margin-top:12px">Addresses here</div>'+anaAddrRows(seg,10);
 h+='<div class="pm-eye" style="margin-top:12px">By feeling</div>'+anaByFeeling(seg);
 return h+anaRunning(r,seg,'Running here')+anaStories([bn]);}
function anaLawCard(r,nm){
 var l=SI.filter(function(x){return x.nm===nm;})[0]; if(!l)return null;
 var s=anaSeatNm(l.b);
 return lawDrillHtml(l,{ana:true})+'<div class="pm-eye" style="margin-top:12px">Its seat</div>'
  +'<div class="ad-rows">'+anaSeatRow(l.b)+'</div>';}
function anaDomCard(r,nm){
 var di=-1; DOMAINS.forEach(function(d,i){if(d.nm===nm)di=i;});
 var d=DOMAINS[di]||{}, own=W.filter(function(n){return Math.min(18,Math.floor(n.slot/(108/19)))===di;}).sort(anaBySq);
 var bands=anaBands(own);
 var h=anaHead('Blueprint domain',d.nm||nm,esc((d.r||'')+' cluster, '+(S.doms.indexOf(di)>=0?'you run this':'not selected')));
 h+='<p class="ad-p">'+esc(d.d||'')+'. It owns <b>'+anaPl(own.length,'address','addresses')+'</b> across '
  +bands.map(function(b){return b.toLowerCase();}).join(', ')+'. '+anaHeldSay(own)
  +' What is held is what the domain costs you rather than gives you.</p>'
  +'<div class="pm-eye">Addresses here</div>'+anaAddrRows(own,10);
 return h+anaSplits(own)+anaRunning(r,own,'Running here')+anaStories(bands);}
function anaArchCard(r,nm){
 var ai=-1; ARCH.forEach(function(x,i){if(x.nm===nm)ai=i;});
 /* ARCH names it Rebel and the eighteen name it Outlaw. one row, two names. */
 var a18=ARCH18.filter(function(x){return x[0]===nm||(nm==='Rebel'&&x[0]==='Outlaw');})[0];
 var h=anaHead('Archetype',nm,(ai===r.pi?'primary, how the soul expresses':'not your primary'));
 h+='<p class="ad-p">'+esc((ARCH[ai]||{}).v||'')+'. <b>'
  +(((r.aff||[])[ai]||0)*100).toFixed(0)+'%</b> as strong as your strongest.'
  +(a18?' Its primary saboteur is <b>'+esc(a18[1])+'</b>, seated at the '+a18[2].toLowerCase()+'.':'')
  +' The archetype does not change. Release clears what bends it on the way out.</p>';
 /* and when that saboteur is running, it is a door */
 var run=a18&&lockSees('sab')?anaFind(r,a18[1]):null;
 if(run)h+='<div class="pm-eye">Running now</div>'+anaPatRows([run],1);
 return h;}
function anaMaskCard(r,nm){
 var m2=r.maskRing.filter(function(x){return x.nm===nm;})[0]; if(!m2)return null;
 var sb=(m2.bands||[]);
 var all=W.filter(function(n){return sb.indexOf(n.b)>=0;}).sort(anaBySq);
 var lv2=all.filter(function(n){return n.sq>=4;});
 var h=anaHead(unp('mask','Mask'),m2.nm,'speaks from '+esc(sb.join(' and ')));
 h+=anaKv([['Load',crBadge(sb[0]||'Heart',m2.w*10,{size:'md',raw:m2.w.toFixed(1),title:'The average charge left across these seats'})],
  ['Held',anaN(lv2.length)]]);
 h+='<p class="ad-p">'+unpSay('mask')+' This is the age the output takes on the way out. Its load is the average charge left across every address at those seats.</p>'
  +'<div class="pm-eye">Underneath it</div>'+anaAddrRows(all.filter(function(n){return n.sq>0;}),10);
 return h+anaSplits(all)+anaRunning(r,all,'Running under it')+anaStories(sb);}
/* one seat and one feeling, the cell of the grid */
function anaCellCard(r,nm){
 var i=nm.indexOf(':'), b=nm.slice(0,i), f=nm.slice(i+1);
 var c=CHILD.filter(function(x){return x.nm===f;})[0]; if(!c||BANDS.indexOf(b)<0)return null;
 var list=W.filter(function(n){return n.b===b&&n.cf===f;}).sort(anaBySq);
 var h=anaHead('Seat and feeling',f+' at the '+(b==='3rd Eye'?'3rd eye':b.toLowerCase()));
 h+='<p class="ad-p">'+(list.length?'<b>'+anaPl(list.length,'fetter','fetters')+'</b> at the '+anaSeatWord(b)
   +' seat hold '+esc(f.toLowerCase())+'. '+anaHeldSay(list)
   :'No fetter at this seat holds '+esc(f.toLowerCase())+', so nothing can gather here.')+'</p>';
 if(list.length)h+='<div class="pm-eye">Its fetters</div>'+anaAddrRows(list,12);
 h+='<div class="pm-eye" style="margin-top:12px">Under it</div><div class="ad-rows">'+anaAxisRow(f)+anaSeatRow(b)+'</div>';
 return h+(list.length?anaRunning(r,list,'Running here'):'');}
/* one ring of the chain, every pattern on it */
var ANA_RUNG={fet:['fetter','Fetters'],sab:['saboteur','Saboteurs'],cx:['complex','Complexes'],
 hy:['hyper complex','Hyper-complexes'],sup:['character','Character layers']};
function anaRungCard(r,nm){
 var R=ANA_RUNG[nm]; if(!R)return null;
 var h=anaHead('The chain',R[1]);
 if(nm==='fet'){
  var carry=W.filter(function(n){return n.sq>0;}).sort(anaBySq);
  return h+'<p class="ad-p">'+unpSay('fetter')+' '+anaHeldSay(carry)+'</p>'
   +'<div class="pm-eye">Heaviest first</div>'+anaAddrRows(carry,20)+anaSplits(carry);}
 if(!lockSees(nm))return h+lockPanelHtml(nm,{brief:true});
 var list=({sab:r.sabs,cx:r.cxs,hy:r.hys,sup:r.sups})[nm]||[];
 h+='<p class="ad-p">'+unpSay(R[0])+' '+(list.length?'<b>'+list.length+'</b> '+(list.length===1?'is':'are')+' running now.'
  :'None is running now.')+'</p>';
 if(!list.length)return h;
 var all=[]; list.forEach(function(o){leaves(o).forEach(function(n){if(all.indexOf(n)<0)all.push(n);});});
 return h+'<div class="pm-eye">Heaviest first</div>'+anaPatRows(list.slice().sort(function(a,b){return b.w-a.w;}),20)
  +'<div class="pm-eye" style="margin-top:14px">What they run on</div>'+anaAddrRows(all.sort(anaBySq),8)+anaSplits(all);}

/* ---- the six readings ---- */
/* WHAT EACH ONE IS, in words, and what the tile prints. Every figure is one
   compute() already returns; nothing is measured here that the engine did not
   measure. Shadow, pull and expression are worked out from the addresses,
   which is said on each, because a figure that is arithmetic must not read as
   a second instrument. */
var ANA_MET={
 cq:{nm:'Coherence',seat:'Crown',txt:'CQ',
  tip:'CQ is your coherence number, built only from your answers on the laws.',
  fig:function(r){return {p:r.CQ,raw:String(Math.round(r.CQ))};}},
 dq:{nm:'Shadow',seat:'Root',txt:'DQ',
  tip:'Shadow is all the charge left at your addresses, added up, as a share of the most they could hold.',
  fig:function(r){return {p:r.DQ,raw:Math.round(r.DQ)+'%'};}},
 pull:{nm:'Pull',seat:'Solar',txt:null,
  tip:'Pull is how hard the charge you hold drags on what you do, and a heavy place drags far harder than a light one.',
  fig:function(r){return {p:r.PULL*100,raw:Math.round(r.PULL*100)+'%'};}},
 ex:{nm:'Expression',seat:'Throat',txt:null,
  tip:'Expression is your coherence with the pull taken off it, so it is how much of it reaches what you do.',
  fig:function(r){return {p:r.EX,raw:String(Math.round(r.EX))};}},
 jq:{nm:'Overshoot',seat:'3rd Eye',txt:null,
  tip:'Overshoot is an opposite feeling put in past the point where it helps, at 6 and above.',
  fig:function(r){return {p:r.JQ*10,raw:r.JQ.toFixed(1)};}},
 pole:{nm:'Installed',seat:'Heart',txt:null,
  tip:'Installed is how much of each opposite feeling is in place where its feeling was, such as trust where fear sat.',
  fig:function(r){return {p:r.poleMean*10,raw:r.poleMean.toFixed(1)};}}};
function anaMetRow(r,k){
 var M=ANA_MET[k], f=M.fig(r);
 return '<button type="button" class="ad-r" data-ana="met|'+k+'" title="'+esc('Open '+M.nm)+'">'
  +crBadge(M.seat,f.p,{size:'sm',raw:f.raw,title:M.nm})+'<span>'+esc(M.nm)+'</span><em>reading</em></button>';}
function anaMetCard(r,k){
 var M=ANA_MET[k]; if(!M)return null;
 var f=M.fig(r), h=anaHead('Reading',M.nm);
 h+=anaKv([['Now',cr(M.seat,f.p,{size:'md',raw:f.raw,text:M.txt,hot:false,label:M.nm})]]);
 h+='<p class="ad-p">'+esc(M.tip)+'</p>';
 var bySeat=function(){return anaBySeat(W.filter(function(n){return n.sq>0;}));};
 if(k==='cq'){
  var laws=SI.slice().sort(function(a,b){
   var ia=lawIn(a.nm),ib=lawIn(b.nm); if(ia!==ib)return ia?-1:1; return S.law[a.nm]-S.law[b.nm];});
  h+='<p class="ad-p">The '+SI.length+' laws, each answered from nothing to ten, added together. '
   +(r.complete?'All '+SI.length+' are in. '+(r.tier?'The band is <b>'+esc(r.tier.toLowerCase())+'</b>.':'')
    :'<b>'+(SI.length-r.answered)+'</b> are still to answer, and each counts nothing until it is.')
   +' The shadow does not touch this number. It pulls on expression.</p>'
   +'<div class="pm-eye">The laws, weakest first</div><div class="ad-rows">'+laws.map(function(l){
    var read=lawIn(l.nm), v=S.law[l.nm];
    return '<button type="button" class="ad-r" data-ana="'+anaKey('law',l.nm)+'" title="'+esc('Open '+l.nm)+'">'
     +crBadge(l.b,read?v*10:0,{size:'sm',raw:read?v.toFixed(1):'\u2013',title:l.nm+(read?'':', not read yet')})
     +'<span>'+esc(l.nm)+'</span><em>'+(!read?'not read yet':v<4?'shut':v>=7?'open':'working')+'</em></button>';}).join('')+'</div>';}
 else if(k==='dq'){
  h+='<p class="ad-p">It counts every one of your '+NODES.length+' addresses, under the line at 4 as well as over it. '
   +'It is worked out from the addresses and is not measured on its own. It does not touch CQ. It feeds the pull.</p>'
   +'<div class="pm-eye">Where it sits, by seat</div>'+bySeat()
   +'<div class="pm-eye" style="margin-top:12px">Heaviest fetters</div>'+anaAddrRows(W.filter(function(n){return n.sq>0;}).sort(anaBySq),8);}
 else if(k==='pull'){
  h+='<p class="ad-p">Each address drags by how heavy it is, on a curve. At 2 it barely drags, '
   +'at 5 it drags half as hard as it can, and from 7 up it drags almost fully. Pull is the average drag across all '
   +NODES.length+' addresses, so a few heavy places pull harder than many light ones.</p>'
   +'<div class="pm-eye">Pulling hardest</div><div class="ad-rows">'
   +W.filter(function(n){return n.sq>=2;}).sort(anaBySq).slice(0,10).map(function(n){
    return addrRow(n,{ana:true,em:'drags '+Math.round(leverPull(n.sq)*100)+'%'});}).join('')+'</div>'
   +'<div class="pm-eye" style="margin-top:12px">By seat</div>'+bySeat();}
 else if(k==='ex'){
  var top=(typeof exCeiling==='function')?exCeiling():null;
  h+='<p class="ad-p">Expression is CQ times what the pull leaves. CQ <b>'+Math.round(r.CQ)+'</b>, pull <b>'
   +Math.round(r.PULL*100)+'%</b>, expression <b>'+Math.round(r.EX)+'</b>.'
   +(top!=null?' With every charge released it would read <b>'+Math.round(top)+'</b> on the laws as they stand.':'')+'</p>'
   +'<div class="pm-eye">What makes it</div><div class="ad-rows">'+anaMetRow(r,'cq')+anaMetRow(r,'pull')+'</div>';}
 else if(k==='jq'){
  var ex=W.filter(function(n){return n.jq>=4;}).sort(function(a,b){return b.jq-a.jq;});
  h+='<p class="ad-p">The figure is the average across your addresses. '+(ex.length?'<b>'+ex.length+'</b> '
   +(ex.length===1?'address is':'addresses are')+' overshot far enough to count, where the opposite will not let the fetter shut.'
   :'No address is overshot far enough to count.')+'</p>'
   +(ex.length?'<div class="pm-eye">Overshot</div>'+'<div class="ad-rows">'+ex.slice(0,10).map(function(n){
    return addrRow(n,{ana:true,em:'overshot'});}).join('')+'</div>':'');}
 else if(k==='pole'){
  var inn=W.filter(function(n){return n.pole>=4;}).sort(function(a,b){return b.pole-a.pole;});
  h+='<p class="ad-p">The figure is the average across your addresses of how far the opposite has passed what is still held there.</p>'
   +'<div class="pm-eye">Each opposite</div>'+anaBars(CHILD.map(function(c){
    return {key:anaKey('axis',c.nm),lbl:esc(c.opp),v:S.replace[c.nm]||0,c:seatCol(c.seat),
     fig:'for '+esc(c.nm.toLowerCase()),title:'Open '+c.nm+' toward '+c.opp};}).sort(function(a,b){return b.v-a.v;}))
   +(inn.length?'<div class="pm-eye" style="margin-top:12px">Where it is in</div>'+anaAddrRows(inn,10):'');}
 return h;}
/* one row of the record, every figure the snapshot kept */
function anaSessCard(r,nm){
 var H=anaHist(), i=+nm, x=H[i]; if(!x)return null;
 var p=i>0?H[i-1]:null, same=p&&p.m===x.m;
 var d=function(k,dp){if(!same||x[k]==null||p[k]==null)return '';
  var v=+x[k]-+p[k]; if(Math.abs(v)<Math.pow(10,-dp)/2)return ' <em>no change</em>';
  return ' <em>'+(v>0?'up ':'down ')+Math.abs(v).toFixed(dp)+'</em>';};
 var row=function(lbl,k,dp,unit){
  return '<div class="ana-dl"><span>'+lbl+'</span><b>'+(x[k]==null||x[k]===0?'\u2013':(+x[k]).toFixed(dp)+(unit||''))+'</b>'+d(k,dp)+'</div>';};
 var h=anaHead('Session '+(i+1),(typeof dlyDayWord==='function'?dlyDayWord(String(x.t).slice(0,10))+' '+String(x.t).slice(0,4):String(x.t).slice(0,10)),
  esc(x.dark?'heaviest at the '+String(x.dark).toLowerCase():''));
 h+='<p class="ad-p">Every figure this session kept. '+(p?(same?'Each change is against the session before it.'
   :'The session before was worked out a different way, so no change is shown against it.'):'This is the first session on the record.')+'</p>'
  +'<div class="ana-dls">'+row('Coherence','cq',1)+row('Shadow','dq',1,'%')+row('Held','loaded',0)
  +row('Saboteurs','sab',0)+row('Complexes','cx',0)+row('Hyper-complexes','hy',0)+row('Character','ch',0)
  +row('Overshoot','jq',2)+row('Installed','pole',2)+'</div>'
  +(x.tier?'<p class="ad-p">The band read <b>'+esc(String(x.tier).toLowerCase())+'</b>.</p>':'')
  +(x.arch?'<p class="ad-p">The leading archetype was <b>'+esc(x.arch)+'</b>.</p>':'');
 return h;}

function anaCard(r,P){
 if(P.k==='chain'){var o=anaFind(r,P.nm); return o?anaChainCard(r,o):null;}
 if(P.k==='addr'){var n=BY[+P.nm]; return n?anaAddrCard(r,n):null;}
 if(P.k==='axis')return anaAxisCard(r,P.nm);
 if(P.k==='seat')return anaSeatCard(r,P.nm);
 if(P.k==='law')return anaLawCard(r,P.nm);
 if(P.k==='dom')return anaDomCard(r,P.nm);
 if(P.k==='arch')return anaArchCard(r,P.nm);
 if(P.k==='mask')return anaMaskCard(r,P.nm);
 if(P.k==='cell')return anaCellCard(r,P.nm);
 if(P.k==='rung')return anaRungCard(r,P.nm);
 if(P.k==='met')return anaMetCard(r,P.nm);
 if(P.k==='sess')return anaSessCard(r,P.nm);
 return null;}
function anaStepName(P){
 if(P.k==='addr'){var n=BY[+P.nm]; return n?n.k:P.nm;}
 if(P.k==='met')return (ANA_MET[P.nm]||{}).nm||P.nm;
 if(P.k==='rung')return (ANA_RUNG[P.nm]||[])[1]||P.nm;
 if(P.k==='sess')return 'Session '+(+P.nm+1);
 if(P.k==='cell')return P.nm.replace(':',', ');
 return P.nm;}
function anaCrumbs(){
 if(!ANA_TRAIL.length)return '';
 return '<nav class="ana-crumbs" aria-label="How you got here">'+ANA_TRAIL.map(function(p,i){
  return '<button type="button" class="ana-crumb" data-anacrumb="'+i+'">'+esc(anaStepName(p))+'</button>'
   +'<span class="ana-crumb-s" aria-hidden="true">\u203a</span>';}).join('')
  +'<span class="ana-crumb-at">'+esc(anaStepName(ANA_PICK))+'</span></nav>';}
/* THE DRILL. Still the function every caller knows, and it still clears in
   place: rdClose calls render, render calls anaRender, anaRender calls this,
   which recursed until the stack died when this called rdClose. */
function anaDrill(){
 var box=document.getElementById('rdrill'); if(!box)return;
 if(!ANA_PICK){ANA_TRAIL=[];box.innerHTML='';box.style.display='none';
  var none=document.getElementById('rdrill-none'); if(none)none.style.display='';
  return;}
 var r=computeSeen(), h=anaCard(r,ANA_PICK);
 /* a thing on the trail can stop running while a person is on it, after a
    release. The card says so and the trail still leads back. */
 if(h==null)h=anaHead('Not running now',anaStepName(ANA_PICK))
  +'<p class="ad-p">Nothing by this name is on the reading as it stands now.</p>';
 rdShell(anaCrumbs()+h);}
/* ONE WAY IN, from the page or from a card. A press on the page starts a new
   trail, and a second press on the same bubble with nothing below it closes
   the card, which is what the bubbles always did. A press on a card adds a
   step. A press on a step goes back to it. */
function anaGo(k,nm,fromPage){
 if(k==='met'&&nm==='id'){ANA_PICK=null;ANA_TRAIL=[];if(typeof runAccDrill==='function')runAccDrill();return;}
 if(fromPage){
  var same=ANA_PICK&&ANA_PICK.k===k&&ANA_PICK.nm===nm&&!ANA_TRAIL.length;
  ANA_TRAIL=[]; ANA_PICK=same?null:{k:k,nm:nm};}
 else{if(ANA_PICK)ANA_TRAIL.push(ANA_PICK); ANA_PICK={k:k,nm:nm};}
 S.pin=null;
 anaRedraw(!fromPage);}
/* A STEP TAKEN INSIDE THE CARD IS ANSWERED WHERE THE PERSON IS READING.
   On a phone the rail sits under the page, and rdOpen does not move the
   page for a press made on the page (ui/drills.js, BRING THE DRILL INTO
   VIEW). A press made in the card is the other case it names: without this
   a row pressed near the foot of a long card left the new card's top a
   screen above. RD_INRAIL is that file's own seam, held for one drill. */
function anaRedraw(inRail){
 var was=RD_INRAIL; RD_INRAIL=!!inRail;
 try{if(S.tab===TAB.ANALYTICS)anaRender(); else anaDrill();}finally{RD_INRAIL=was;}}
addEventListener('click',function(e){
 var t=e.target&&e.target.closest?e.target.closest('[data-ana],[data-anacrumb]'):null;
 if(!t)return;
 var inPage=!!t.closest('#ana'), inDrill=!!t.closest('#rdrill');
 if(!inPage&&!inDrill)return;
 if(t.hasAttribute('data-anacrumb')){
  var i=+t.getAttribute('data-anacrumb'); if(!ANA_TRAIL[i])return;
  ANA_PICK=ANA_TRAIL[i]; ANA_TRAIL=ANA_TRAIL.slice(0,i);
  anaRedraw(true);
  return;}
 var v=t.getAttribute('data-ana'), at=v.indexOf('|');
 anaGo(v.slice(0,at),v.slice(at+1),inPage&&!inDrill);});
/* a bubble and the identification block are not buttons, so Enter and Space
   press them the way they press a button */
addEventListener('keydown',function(e){
 if(e.key!=='Enter'&&e.key!==' ')return;
 var t=e.target; if(!t||!t.getAttribute||t.tagName==='BUTTON')return;
 if(t.getAttribute('role')!=='button'||!t.hasAttribute('data-ana'))return;
 e.preventDefault(); t.dispatchEvent(new MouseEvent('click',{bubbles:true}));});

/* ============================================================
   TELEMETRY ON THE PAGE. Three views, each answering one question.

     Readings       how the field reads, six figures, each a door
     Where it runs  every address by seat and by feeling at once: the
                    darker a square, the more charge is left on the fetters
                    at that seat holding that feeling. The two edges add
                    each row and each column up.
     The chain      how many patterns sit on each ring, fetter to character

   Nothing on an unread field, for the reason Running hot gives: the hero
   already says nothing is entered, and six dashes say it six more times.
   ============================================================ */
function anaTele(r){
 if(r.unread)return '';
 var s='<div class="ana-tele"><div class="pm-eye" style="margin-top:20px">Readings</div>'
  +'<div class="ana-tiles">'+['cq','dq','pull','ex','jq','pole'].map(function(k){
   var M=ANA_MET[k], f=M.fig(r);
   return '<button type="button" class="ana-tile" data-ana="met|'+k+'">'
    +cr(M.seat,f.p,{size:'md',raw:f.raw,text:M.txt,hot:false,title:M.nm})
    +'<span class="ana-tile-l" data-tip-k="'+esc(M.nm)+'" data-tip="'+esc(M.tip)+'">'+esc(M.nm)+'</span></button>';}).join('')
  +'</div>';
 s+='<div class="pm-eye" style="margin-top:20px">Where it runs</div>'+anaGrid(r);
 s+='<div class="pm-eye" style="margin-top:20px">The chain</div>'+anaRungs(r);
 return s+'</div>';}
function anaGrid(r){
 var cols=BANDS, rows=CHILD, M={}, max=0, rowT={}, colT={}, rmax=0, cmax=0;
 W.forEach(function(n){if(!n.cf)return; var k=n.b+':'+n.cf;
  if(!M[k])M[k]={n:0,h:0,v:0}; M[k].n++; M[k].v+=n.sq; if(n.sq>=4)M[k].h++;
  rowT[n.cf]=(rowT[n.cf]||0)+n.sq; colT[n.b]=(colT[n.b]||0)+n.sq;});
 Object.keys(M).forEach(function(k){if(M[k].v>max)max=M[k].v;});
 Object.keys(rowT).forEach(function(k){if(rowT[k]>rmax)rmax=rowT[k];});
 Object.keys(colT).forEach(function(k){if(colT[k]>cmax)cmax=colT[k];});
 /* THE EDGES ARE THE DOORS. A seat's name over its column opens the seat,
    a feeling's name at the start of its row opens the feeling, and the thin
    bar under each name adds that whole column or row up. Same scale along
    each edge, so the longest bar is the heaviest seat or feeling. */
 var s='<div class="ana-grid" role="group" aria-label="Charge left by seat and feeling">'
  +'<span class="ana-g-c"></span>'+cols.map(function(b){
   var ch=colT[b]?Math.max(6,Math.round(colT[b]/(cmax||1)*100)):0;
   return '<button type="button" class="ana-g-h" data-ana="'+anaKey('seat',anaSeatNm(b))+'" title="'+esc('The '+b.toLowerCase()+' seat, every feeling. Open it.')+'">'
    +'<span>'+anaSeatWord(b,true)+'</span><i style="width:'+ch+'%;background:'+seatCol(b)+'"></i></button>';}).join('');
 rows.forEach(function(c){
  var rw=rowT[c.nm]?Math.max(6,Math.round(rowT[c.nm]/(rmax||1)*100)):0;
  s+='<button type="button" class="ana-g-r" data-ana="'+anaKey('axis',c.nm)+'" title="'+esc(c.nm+' at every seat. Open it.')+'">'
   +'<span>'+esc(c.nm)+'</span><i style="width:'+rw+'%;background:'+seatCol(c.seat)+'"></i></button>';
  cols.forEach(function(b){
   var m=M[b+':'+c.nm];
   if(!m){s+='<span class="ana-g-x" title="'+esc('No fetter at the '+b.toLowerCase()+' holds '+c.nm.toLowerCase())+'"></span>';return;}
   var a=m.v>0?Math.round(14+76*m.v/(max||1)):0;
   s+='<button type="button" class="ana-g'+(m.h?' held':'')+'" data-ana="'+anaKey('cell',b+':'+c.nm)+'" '
    +'style="--c:'+seatCol(b)+';background:'+(a?'color-mix(in srgb,'+seatCol(b)+' '+a+'%,transparent)':'transparent')+'" '
    +'title="'+esc(c.nm+' at the '+b.toLowerCase()+': '+anaPl(m.n,'fetter','fetters')+(m.h?', '+m.h+' held':'')+'. Open it.')+'" '
    +'aria-label="'+esc(c.nm+' at the '+b.toLowerCase())+'"></button>';});});
 return s+'</div><p class="ab-s">Darker is more charge left. A ringed square has a held fetter in it, and a hatched one has no fetter that can hold that feeling there.</p>';}
function anaRungs(r){
 var held=W.filter(function(n){return n.sq>=4;}).length;
 var items=[['fet',held]].concat(['sab','cx','hy','sup'].map(function(k){
  return [k,lockSees(k)?({sab:r.sabs,cx:r.cxs,hy:r.hys,sup:r.sups})[k].length:null];}));
 return '<div class="ana-rungs">'+items.map(function(it,i){
  var R=ANA_RUNG[it[0]];
  return (i?'<span class="ana-rung-s" aria-hidden="true">\u203a</span>':'')
   +'<button type="button" class="ana-rung" data-ana="rung|'+it[0]+'" title="'+esc(it[0]==='fet'?'Fetters held at 4 or more. Open them.':'Open every '+R[0]+' running')+'">'
   +'<b>'+(it[1]==null?lockMarkHtml():(it[1]?it[1]:'\u2013'))+'</b>'
   +'<span>'+unp(R[0],R[1])+'</span></button>';}).join('')+'</div>';}
