/* ============================================================
   THE STORY PAGE, FOUR WAYS. Round HT in TASKS.md. Proposal only.

   The engine above this script is the committed engine.js, unmodified. Every
   number, word, rung and question on this page is its own output, computed on
   every keystroke in this browser:

     parseStory   the hits, the seats, the path, the imprints
     marksOf      which letters were scored, and in which seat
     normMap      the offsets the scanner read through
     srcHear      what Source AI heard, per seat, the rung, negation
     srcTurn      open, listen, ask or pass
     compute      Nkem's field, for the release queue
     meterPlan    what a run costs, in patterns
     relLine      the thought line a run speaks first

   Nothing animates that the engine did not just do. There is no scanning
   sweep and no "thinking" shimmer, because the whole read takes under a
   millisecond and an indicator for it would be a lie about effort (the UX
   skill, "Skeleton screens").
   ============================================================ */
'use strict';
var BN=BANDS.slice();                                   /* Root .. Crown */
var BKEY={};Object.keys(K2BAND).forEach(function(k){BKEY[K2BAND[k]]=k;});
function sc(bn){return PAL[bn]||'#7EB8D4';}
var FLY_MS=560;
var OS_REDUCED=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
function still(){return OS_REDUCED||document.body.classList.contains('still');}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function $(id){return document.getElementById(id);}

/* ---- ported verbatim from atuned_src/ui/storyui.js, the speaking half ---- */
var SRC_OPEN='What are we writing about today?';
var SRC_JOG=['What happened today that your body is still holding?','Where did you feel it first?',
 'What did you not say?','Who was in the room?','What keeps coming back?','What did you do straight after?'];
function srcSeatSay(b){return b==='Solar'?'the solar plexus':(b==='3rd Eye'?'the third eye':'the '+String(b).toLowerCase());}
function srcTimes(n){return n===2?'twice':(n===3?'three times':n+' times');}
function srcAsk(t){var at=srcSeatSay(t.band);
 if(t.why==='root')return 'You keep coming back to '+at+', here and in what you wrote before. Why do you think that is?';
 if(t.why==='earlier')return at.charAt(0).toUpperCase()+at.slice(1)+' was in an earlier entry too. Why do you think it comes back?';
 return at.charAt(0).toUpperCase()+at.slice(1)+' comes up '+srcTimes(t.mentions)+' in this. Why do you think it keeps landing there?';}
function pips(rung,col){var s='<span class="pips" aria-hidden="true" style="--c:'+col+'">';
 for(var i=1;i<=10;i++)s+='<i class="'+(i<=rung?'on':'')+(i>=SRC_ASK?' ask':'')+'"></i>';return s+'</span>';}
/* from ui/storyui.js and ui/release.js */
var RUN_SPEED_S={Slow:3.2,Steady:2.2,Quick:1.4};
var CHANS=[['R','Right','limit'],['L','Left','limit'],['R','Right','truth'],['L','Left','truth']];

/* ---- Nkem's field, loaded the way ui/personas.js loadP loads a worked
   example: domain, arcs, soul, charges, replacement and her own laws. Her
   field is the release queue's ground. Nothing is saved anywhere. ---- */
var PROF=null;
function loadNkem(){
 var i=-1;PEOPLE.forEach(function(p,j){if(p.nm==='Nkem')i=j;});var p=PEOPLE[i];
 S.who=i;S.pin=null;S.dom=p.dom;S.a1=p.a1;S.a2=p.a2;
 S.doms=p.doms?p.doms.slice():[p.dom];S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];S.roots=p.roots?p.roots.slice():[];
 buildSoul();
 CHARGES.forEach(function(c){S.charge[c]=(p.c&&p.c[c]!==undefined)?p.c[c]:0;S.replace[c]=(p.rep&&p.rep[c])||0;});
 var LS=p.law||LAWSET[p.nm]||{_:LAW_DEFAULT};
 SINAMES.forEach(function(l){S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:LAW_DEFAULT);});
 PROF=blankProfile();}

/* ============================================================
   STATE, AND THE ONE READ
   ============================================================ */
var ST={v:'a',text:'',set:'',parse:null,heard:null,marks:[],toks:[],prev:{},passed:false,
 committed:[],priorDemo:false,rel:{src:'heavy',n:3,pace:'Steady'},run:null,said:''};
var PRIOR_DEMO=[{bands:{throat:12,heart:6}},{bands:{throat:9}}];
function priorList(){return (ST.priorDemo?PRIOR_DEMO:[]).concat(ST.committed);}

/* IT READS A WORD ONCE THE WORD IS FINISHED. The shipped page parses the
   raw text on every keystroke, so "tight" lights at "tight" and goes dark
   again at "tightl". That flicker is honest and useless. A word still under
   the caret is left out of the read until a space or a stop closes it. */
function settledOf(t){return /[A-Za-z']$/.test(t)?t.replace(/[A-Za-z']+$/,''):t;}

function stRead(){
 var t=ST.set, p=t.trim()?parseStory(t):null;
 var marks=p?marksOf(t,p):[], nm=normMap(t);
 /* negation, per mark, by the same rule srcHear applies per step */
 var negAt={};
 if(p)p.path.steps.forEach(function(s){if(!s.seat||s.coherent)return;
  if(srcNegated(nm.s,s.at)){var a=nm.map[s.at+1];if(a!=null)negAt[a]=1;}});
 /* the degree word in front of a scaled hit */
 var modAt={};
 if(p)p.hits.forEach(function(h){if(!h.mod)return;var a=nm.map[h.at+1];if(a!=null)modAt[a]={f:h.mod,w:h.modw};});
 var toks=[],re=/[A-Za-z']+/g,m;while((m=re.exec(t)))toks.push({s:m.index,e:m.index+m[0].length,w:m[0]});
 var seen={};
 marks.forEach(function(k){
  k.txt=t.slice(k.s,k.e);k.neg=!!negAt[k.s];k.mod=modAt[k.s]||null;
  var base=(k.bn||'coh')+':'+k.txt.toLowerCase();seen[base]=(seen[base]||0)+1;k.key=base+':'+seen[base];
  k.depth=k.amt!=null?Math.min(1,Math.abs(k.amt)/PATHMAX):0.3;
  k.t0=-1;k.t1=-1;toks.forEach(function(o,j){if(o.s>=k.s&&o.e<=k.e){if(k.t0<0)k.t0=j;k.t1=j;o.m=k;}});
  if(k.mod&&k.t0>0){var nw=k.mod.w.split(' ').length;for(var q=1;q<=nw;q++){var d=toks[k.t0-q];if(d&&!d.m)d.deg=k.mod.f;}}
  if(k.neg){for(var q2=1;q2<=SRC_NEG_W;q2++){var d2=toks[k.t0-q2];if(d2&&SRC_NEG.indexOf(d2.w.toLowerCase().replace(/'/g,''))>=0){k.negFrom=d2.s;}}}});
 ST.parse=p;ST.marks=marks;ST.toks=toks;
 ST.heard=srcHear(t,srcPrior(priorList()));}

/* ============================================================
   THE PIPELINE. A keystroke paints the sentence at once. What the sentence
   causes (the seat, the rung, the question, the imprint, the queue) is
   painted when the word lands, so the order of consequence on screen is the
   order it happens in: word, seat, rung, question.
   ============================================================ */
var PAINT_T=null;
function onText(v,close){
 ST.text=v;var s=close?v:settledOf(v);
 /* the word under the caret is still being written: the sentence repaints,
    the read does not move */
 if(s===ST.set){paintHL();paintCount();return;}
 ST.set=s;
 var before=ST.prev;stRead();
 var now={},arr=[];ST.marks.forEach(function(m){now[m.key]=1;if(!before[m.key])arr.push(m);});
 ST.prev=now;
 paintHL(arr);paintCount();
 if(!ST.set.trim())ST.passed=false;
 /* the stage learns about every mark before any of them lands */
 VAR().sync();
 if(arr.length&&!still()){
  arr.forEach(function(m,i){fly(m,i*90);});
  clearTimeout(PAINT_T);PAINT_T=setTimeout(paintAfter,FLY_MS+(arr.length-1)*90);}
 else{arr.forEach(function(m){VAR().land(m);});clearTimeout(PAINT_T);paintAfter();}}
function paintAfter(){SEATS_T();paintPrompt();paintSummary();paintImprints();paintStream();paintRelease();VAR().after&&VAR().after();}

/* ---- the sentence ---- */
function paintHL(arr){
 var hl=$('hl'),t=ST.text,out='',last=0,newk={};(arr||[]).forEach(function(m){newk[m.key]=1;});
 ST.marks.forEach(function(m){
  var from=(m.neg&&m.negFrom!=null)?m.negFrom:m.s;
  out+=esc(t.slice(last,from));
  var cls=(m.coh?'coh':'')+(m.neg?' neg':'')+(newk[m.key]?' new':'');
  out+='<mark data-k="'+esc(m.key)+'" class="'+cls+'" style="--c:'+(m.bn?sc(m.bn):'var(--accent)')+'">'+esc(t.slice(from,m.e))+'</mark>';
  last=m.e;});
 hl.innerHTML=out+esc(t.slice(last))+'\n';
 var ta=$('ta');hl.scrollTop=ta.scrollTop;}
function paintCount(){
 var n=ST.text.trim()?ST.text.trim().split(/\s+/).length:0, p=ST.parse;
 $('ct').textContent=n+(n===1?' word':' words')+(p?', '+ST.marks.length+' tagged':'');
 var k=p?p.imprints.length:0, b=$('commit');b.disabled=!k;b.textContent='Commit '+k;}

/* ---- the prompt engine ---- */
function turnNow(){return srcTurn(ST.heard,{typed:!!ST.set.trim(),passed:ST.passed});}
function paintPrompt(){
 var h=ST.heard, turn=turnNow(), o='<div class="hd"><span class="eb">Source AI</span><span class="tag">scripted</span></div>';
 var d=Math.floor(Date.now()/864e5),k=d%SRC_JOG.length;
 var jog='<ul class="pe-jog">'+[0,1,2].map(function(j){return '<li>'+esc(SRC_JOG[(k+j)%SRC_JOG.length])+'</li>';}).join('')+'</ul>';
 if(turn.move==='open'){o+='<p class="pe-q">'+esc(SRC_OPEN)+'</p>'+jog;}
 else if(turn.move==='ask'){
  o+='<p class="pe-q" style="--c:'+sc(turn.band)+'">'+esc(srcAsk(turn))+'</p>'
   +'<div class="pe-row"><button class="btn" id="pass">Move on</button><span class="pe-note">Answer in the journal, or leave it.</span></div>';}
 else if(turn.move==='pass'){o+='<p class="pe-q">Cool.</p><p class="pe-note">Nothing more asked in this entry.</p>';}
 else{
  o+='<p class="pe-q quiet">'+esc(SRC_OPEN)+'</p>';
  /* HOW NEAR THE NEXT QUESTION IS. srcTurn asks at SRC_ASK, seven, and the
     top seat's rung is how far along that is. Drawn, never printed. */
  if(h&&h.top)o+='<div class="pe-row"><span class="pe-gauge" style="--c:'+sc(h.top.band)+'"><span>Next question</span>'
   +pips(h.top.rung,sc(h.top.band))+'<span class="sn">'+esc(h.top.band)+'</span></span>'
   +'<span class="pe-note">A place that comes back gets a question.</span></div>';
  else o+=jog;}
 $('pe').innerHTML=o;
 var said=turn.move==='open'?SRC_OPEN:(turn.move==='ask'?srcAsk(turn):(turn.move==='pass'?'Cool.':''));
 if(said!==ST.said){ST.said=said;$('say').textContent=said;}
 var mv=$('pass');if(mv)mv.onclick=function(){ST.passed=true;paintPrompt();};}

/* ---- Source AI's summary: what it heard, in the person's own words ---- */
function paintSummary(){
 var h=ST.heard,o='<div class="hd"><span class="eb">Heard</span><span class="tag">in your words</span></div>';
 if(!h||h.unread){o+='<p class="sm-none">Nothing read yet, so nothing is asked.</p>';$('sm').innerHTML=o;return;}
 o+='<div class="sm-hdr"><span class="eb">Place</span><span class="eb">Your words</span><span class="eb">Came back</span></div><div class="sm-rows">'
  +h.seats.map(function(s){var c=sc(s.band);
   return '<div class="sm-row" style="--c:'+c+'"><span class="sm-seat">'+esc(s.band)+'</span><span class="sm-words">'
    +s.words.map(function(w){return '<q>'+esc(w)+'</q>';}).join(' ')
    +(s.earlier?'<span class="sm-er">and in '+(s.earlier===1?'an earlier entry':s.earlier+' earlier entries')+'</span>':'')
    +'</span>'+pips(s.rung,c)+'</div>';}).join('')+'</div>';
 /* THE ROUTE, three slots that keep their labels. Read off the heard steps
    only, so a word written as "not" is not a place the story went. */
 var nm=normMap(ST.set),steps=(ST.parse?ST.parse.path.steps:[]).filter(function(s){return s.seat&&!s.coherent&&!srcNegated(nm.s,s.at);});
 if(steps.length){var tal={};steps.forEach(function(s){tal[s.seat]=(tal[s.seat]||0)+1;});
  var dw=steps.reduce(function(a,s){return tal[s.seat]>tal[a]?s.seat:a;},steps[0].seat);
  var cell=function(lab,k){var b=K2BAND[k];return '<div style="--c:'+sc(b)+'"><span class="eb">'+lab+'</span><b>'+esc(b)+'</b></div>';};
  o+='<div class="sm-route">'+cell('Opened',steps[0].seat)+cell('Stayed',dw)+cell('Closed',steps[steps.length-1].seat)+'</div>';}
 $('sm').innerHTML=o;}

/* ---- the imprints: what the sniffer would write, grouped by seat ---- */
var IMP_SEEN={};
function paintImprints(){
 var p=ST.parse,box=$('imps'),o='';
 $('pend').textContent='Pending '+(p?p.imprints.length:0);
 if(!p||!p.imprints.length){box.innerHTML='<p class="sm-none" style="margin-top:12px">You have not written anything yet. Whatever you write gets pulled apart and collected here.</p>';IMP_SEEN={};return;}
 var by={},order=[];p.imprints.forEach(function(im){if(!by[im.band]){by[im.band]=[];order.push(im.band);}by[im.band].push(im);});
 var heardB={};(ST.heard.seats||[]).forEach(function(s){heardB[s.band]=s;});
 var seen={};
 order.forEach(function(b){var c=sc(b),list=by[b],pills=[],fold={};
  list.forEach(function(im){
   if(im.inferred){var fk=im.fetter;if(!fold[fk]){fold[fk]={label:im.fetter,amt:0,inf:true};pills.push(fold[fk]);}fold[fk].amt+=im.amt;}
   else pills.push({label:im.name,amt:im.amt,inf:false});});
  /* THE TWO HALVES OF THE ENGINE DISAGREE HERE, AND IT IS SHOWN. A seat whose
     only words were negated is charged by parseStory and set aside by
     srcHear. The group says which words did it. */
  var only=!heardB[b]?ST.marks.filter(function(m){return m.bn===b&&m.neg;}):[];
  var note=only.length?'<em class="warn">only from '+only.map(function(m){return '&ldquo;'+esc(ST.set.slice(m.negFrom!=null?m.negFrom:m.s,m.e))+'&rdquo;';}).join(', ')+'</em>'
   :'<em>'+pills.length+' pending</em>';
  o+='<div class="grp" style="--c:'+c+'"><div class="ghd"><b>'+esc(b)+'</b>'+note+'</div><div class="pills">'
   +pills.map(function(q){var k=b+':'+q.label;seen[k]=1;
    return '<span class="pill'+(q.inf?' inf':'')+(IMP_SEEN[k]?'':' new')+'" style="--c:'+c+'" title="'+(q.inf?'The seat was read. The words did not name this address.':'Named by the words.')+'">'
     +'<span class="ring"></span>'+esc(q.label)+' <small>+'+(Math.round(q.amt*10)/10)+'</small></span>';}).join('')+'</div></div>';});
 IMP_SEEN=seen;box.innerHTML=o;}

/* ---- the reading line: every word, scored or dropped ---- */
function paintStream(){
 var el=$('strm'),toks=ST.toks,from=Math.max(0,toks.length-18);
 el.innerHTML=toks.slice(from).map(function(o,j){var m=o.m,cls='',st='';
  if(m){cls=m.coh?'coh':(m.neg?'neg':'hit');st=' style="--c:'+(m.bn?sc(m.bn):'var(--accent)')+'"';}
  else if(o.deg)cls='mod';
  if(from+j===toks.length-1)cls+=' last';
  return '<span class="'+cls+'"'+st+'>'+esc(o.w)+(o.deg?'<sup>&times;'+o.deg+'</sup>':'')+'</span>';}).join('');
 var tg=ST.marks.length, ng=ST.marks.filter(function(m){return m.neg;}).length;
 $('ctr').textContent=toks.length?(toks.length+' words read, '+tg+' tagged'+(ng?', '+ng+' set aside as negated':'')):'';}

/* ============================================================
   THE FLIGHT. A scored word leaves the sentence and lands at its seat.
   Real event: marksOf placed these letters at this seat on this read.
   ============================================================ */
function fly(m,delay){
 var mk=$('hl').querySelector('mark[data-k="'+(window.CSS&&CSS.escape?CSS.escape(m.key):m.key)+'"]'),to=VAR().target(m);
 if(!mk||!to){VAR().land(m);return;}
 var r=mk.getBoundingClientRect(),vh=innerHeight;
 if(r.bottom<0||r.top>vh||to.y<0||to.y>vh){setTimeout(function(){VAR().land(m);},delay+FLY_MS);return;}
 var el=document.createElement('div');el.className='flt';el.style.setProperty('--c',m.bn?sc(m.bn):'#7EB8D4');
 el.textContent=m.txt;document.body.appendChild(el);
 var w=el.offsetWidth,hh=el.offsetHeight,x0=r.left+r.width/2-w/2,y0=r.top+r.height/2-hh/2,x1=to.x-w/2,y1=to.y-hh/2;
 var mx=(x0+x1)/2,my=Math.min(y0,y1)-40;
 el.animate([{transform:'translate('+x0+'px,'+y0+'px) scale(1)',opacity:0},
  {transform:'translate('+x0+'px,'+y0+'px) scale(1)',opacity:1,offset:.08},
  {transform:'translate('+mx+'px,'+my+'px) scale(.96)',opacity:1,offset:.55},
  {transform:'translate('+x1+'px,'+y1+'px) scale(.72)',opacity:0}],
  {duration:FLY_MS,delay:delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'})
  .onfinish=function(){el.remove();VAR().land(m);};}

/* ============================================================
   THE SEATS, AS SPRINGS. Targets are the engine's; the springs only carry a
   value from where it was to where the read put it.
     rd   the entry's reading at the seat, parseStory bands / 3, capped at 10
     rg   the rung, srcHear
     str  stress past five, the Field's own frStress curve on LEVER_MU
   ============================================================ */
var SEAT={};BN.forEach(function(b){SEAT[b]={rd:0,rv:0,rdT:0,rg:0,rgv:0,rgT:0,bend:0,bv:0,ph:0,rise:0};});
function frStressP(v){return v>LEVER_MU?0.18+0.82*Math.pow((v-LEVER_MU)/(10-LEVER_MU),0.8):0;}
function SEATS_T(){
 var p=ST.parse,h=ST.heard,rgs={};(h&&h.seats||[]).forEach(function(s){rgs[s.band]=s.rung;});
 BN.forEach(function(b){var o=SEAT[b],k=BKEY[b],t=p&&p.bands[k]?Math.min(10,p.bands[k]/3):0;
  if(t>o.rdT+0.01)o.rise=1.6;o.rdT=t;o.rgT=rgs[b]||0;});}
function stepSeats(dt){
 var snap=still();
 BN.forEach(function(b){var o=SEAT[b];
  if(snap){o.rd=o.rdT;o.rg=o.rgT;o.rv=o.rgv=0;o.bend=frStressP(o.rd);o.bv=0;return;}
  var sub=Math.max(1,Math.ceil(dt/(1/120))),sd=dt/sub;
  for(var s=0;s<sub;s++){
   var a=144*(o.rdT-o.rd)-2*.72*12*o.rv;o.rv+=a*sd;o.rd+=o.rv*sd;
   var a2=196*(o.rgT-o.rg)-2*.8*14*o.rgv;o.rgv+=a2*sd;o.rg+=o.rgv*sd;
   /* the Field's bend: w 14, damping .42, so it lands a fifth past its mark */
   var tb=frStressP(Math.max(0,o.rdT)),a3=196*(tb-o.bend)-2*.42*14*o.bv;o.bv+=a3*sd;o.bend+=o.bv*sd;}
  o.rise=Math.max(0,o.rise-dt);o.ph+=dt*(o.rise>0?0.9:0);});}

/* items that grow on landing, one per mark, per variant */
function itemStep(items,dt){var snap=still();
 Object.keys(items).forEach(function(k){var it=items[k],t=it.alive&&it.landed?1:0;
  if(snap){it.g=t;it.gv=0;}else{var a=220*(t-it.g)-2*.55*14.8*it.gv;it.gv+=a*dt;it.g+=it.gv*dt;}
  if(!it.alive&&it.g<0.01&&Math.abs(it.gv)<0.01)delete items[k];});}
function itemSync(items){var now={};ST.marks.forEach(function(m){now[m.key]=m;
  if(!items[m.key])items[m.key]={m:m,g:0,gv:0,alive:true,landed:false,born:performance.now()};
  else{items[m.key].m=m;items[m.key].alive=true;}});
 Object.keys(items).forEach(function(k){if(!now[k])items[k].alive=false;});}
function itemLand(items,m){var it=items[m.key];if(it){it.landed=true;it.at=performance.now();}}

/* ============================================================
   THE CANVAS STAGE
   ============================================================ */
var CV=null,G=null,CW=0,CH=0,DPR=1;
function stageCanvas(h){
 var st=$('stage');st.className='stage';st.innerHTML='<canvas aria-hidden="true"></canvas>';
 CV=st.firstChild;G=CV.getContext('2d');sizeCanvas(h);}
function sizeCanvas(h){if(!CV)return;DPR=Math.min(2,window.devicePixelRatio||1);
 CW=CV.parentNode.clientWidth;CH=h;CV.style.height=h+'px';CV.width=Math.round(CW*DPR);CV.height=Math.round(CH*DPR);}
function cvPt(x,y){var r=CV.getBoundingClientRect();return {x:r.left+x,y:r.top+y};}
function rgba(hex,a){var n=parseInt(hex.slice(1),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')';}
function mix(hex,to,t){var n=parseInt(hex.slice(1),16),r=n>>16&255,g=n>>8&255,b=n&255;
 return '#'+[r+(to[0]-r)*t,g+(to[1]-g)*t,b+(to[2]-b)*t].map(function(v){v=Math.round(v);return (v<16?'0':'')+v.toString(16);}).join('');}
/* TAU is the engine's own, 2 pi */

/* the seven sectors in the Field's own order and size: Root at twelve
   o'clock, clockwise, each as wide as its share of the 108 somatic addresses */
var SECT=(function(){var cnt={};W.forEach(function(n){cnt[n.b]=(cnt[n.b]||0)+1;});var tot=W.length,a=-Math.PI/2,o={};
 BN.forEach(function(b){var w=(cnt[b]||0)/tot*TAU;o[b]={a0:a,a1:a+w};a+=w;});return o;})();

/* ---- A. THE LISTENING RING ---- */
var VA={items:{},
 init:function(){stageCanvas(300);},
 geo:function(){var s=Math.min(CW,CH)/300;return {s:s,cx:CW/2,cy:CH/2,core:22*s,sp0:28*s,spL:44*s,ring:100*s};},
 target:function(m){if(!CV)return null;var q=VA.geo();
  if(!m.bn)return cvPt(q.cx,q.cy);
  var S_=SECT[m.bn],a=(S_.a0+S_.a1)/2;return cvPt(q.cx+Math.cos(a)*70*q.s,q.cy+Math.sin(a)*70*q.s);},
 land:function(m){itemLand(VA.items,m);},
 sync:function(){itemSync(VA.items);},
 frame:function(dt,t){itemStep(VA.items,dt);var g=G,q=VA.geo(),s=q.s;
  g.setTransform(DPR,0,0,DPR,0,0);g.clearRect(0,0,CW,CH);
  /* the seat arcs, bent by the Field's rule, and the fringes past five */
  BN.forEach(function(b){var o=SEAT[b],S_=SECT[b],c=sc(b),gap=.025,heard=o.rgT>0||o.rd>0.05;
   var r=q.ring+o.bend*9*s;
   g.beginPath();g.arc(q.cx,q.cy,r,S_.a0+gap,S_.a1-gap);g.strokeStyle=rgba(c,heard?.92:.2);g.lineWidth=5*s;g.lineCap='butt';g.stroke();
   /* the rung, ten ticks along the outside of the arc; seven to ten are the end it asks at */
   for(var i=0;i<10;i++){var a=S_.a0+gap+(i+.5)/10*(S_.a1-S_.a0-2*gap),on=i<Math.round(o.rg),ask=i>=SRC_ASK-1,r0=r+8*s,r1=r0+(ask?8:6)*s;
    g.beginPath();g.moveTo(q.cx+Math.cos(a)*r0,q.cy+Math.sin(a)*r0);g.lineTo(q.cx+Math.cos(a)*r1,q.cy+Math.sin(a)*r1);
    g.strokeStyle=on?c:rgba(c,heard?(ask?.4:.18):.08);g.lineWidth=(on?2.2:1.3)*s;g.stroke();}
   var str=Math.max(0,o.bend);
   if(str>=.03){var gp=(10-6*str)*s,f=still()?.5:(o.ph-Math.floor(o.ph)),lift=mix(c,[255,255,255],.55);
    for(var k=0;k<5;k++){var pos=k+f,al=Math.pow(Math.min(1,str),1.3)*Math.sin(Math.PI*pos/5)*.85;if(al<.02)continue;
     g.beginPath();g.arc(q.cx,q.cy,r+22*s+pos*gp,S_.a0+gap*2,S_.a1-gap*2);g.strokeStyle=rgba(k%2?c:lift,al);g.lineWidth=(k%2?1.1:1.6)*s;g.stroke();}}
   if(heard){var am=(S_.a0+S_.a1)/2,lr=q.ring-15*s;g.fillStyle=rgba(c,.95);g.font='600 '+Math.max(11,11*s)+'px Inter,system-ui,sans-serif';
    g.textAlign='center';g.textBaseline='middle';g.fillText(b,q.cx+Math.cos(am)*lr,q.cy+Math.sin(am)*lr);}});
  /* the spokes, one per scored stretch of text, as long as it weighed */
  var per={};Object.keys(VA.items).forEach(function(k){var it=VA.items[k];if(it.m.coh)return;(per[it.m.bn]=per[it.m.bn]||[]).push(it);});
  Object.keys(per).forEach(function(b){var L=per[b].sort(function(x,y){return x.m.s-y.m.s;}),S_=SECT[b],c=sc(b),n=L.length;
   L.forEach(function(it,j){var a=S_.a0+(j+1)/(n+1)*(S_.a1-S_.a0),g1=Math.max(0,it.g),len=q.sp0+g1*(0.25+0.75*it.m.depth)*q.spL,
    ca=Math.cos(a),sa=Math.sin(a);if(g1<.01)return;
    g.beginPath();g.moveTo(q.cx+ca*q.sp0,q.cy+sa*q.sp0);g.lineTo(q.cx+ca*len,q.cy+sa*len);
    if(it.m.neg){g.setLineDash([2*s,3*s]);g.strokeStyle=rgba(c,.45);}else{g.setLineDash([]);g.strokeStyle=c;}
    g.lineWidth=2.2*s;g.lineCap='round';g.stroke();g.setLineDash([]);
    if(it.m.mod&&!it.m.neg){var base=q.sp0+g1*(0.25+0.75*it.m.depth/it.m.mod.f)*q.spL;
     g.beginPath();g.moveTo(q.cx+ca*base,q.cy+sa*base);g.lineTo(q.cx+ca*len,q.cy+sa*len);g.strokeStyle=mix(c,[255,255,255],.6);g.lineWidth=3*s;g.stroke();}
    var age=(performance.now()-(it.at||0))/900;
    if(it.landed&&age<1&&!still()){var rr=(6+10*age)*s;g.beginPath();g.arc(q.cx+ca*len,q.cy+sa*len,rr,0,TAU);g.strokeStyle=rgba(c,.5*(1-age));g.lineWidth=1.4*s;g.stroke();}});});
  /* the core. A coherent word places nothing, so it lands here and grows nothing */
  var coh=Object.keys(VA.items).map(function(k){return VA.items[k];}).filter(function(it){return it.m.coh;});
  g.beginPath();g.arc(q.cx,q.cy,q.core,0,TAU);g.fillStyle='#161B22';g.fill();g.strokeStyle=rgba('#7EB8D4',.35+.1*coh.length);g.lineWidth=1.4*s;g.stroke();
  coh.forEach(function(it,j){var a=-Math.PI/2+j*.5,g1=Math.max(0,it.g),r0=q.core+3*s,r1=r0+6*s*g1;
   g.beginPath();g.moveTo(q.cx+Math.cos(a)*r0,q.cy+Math.sin(a)*r0);g.lineTo(q.cx+Math.cos(a)*r1,q.cy+Math.sin(a)*r1);g.strokeStyle='#7EB8D4';g.lineWidth=2*s;g.stroke();});}};

/* ---- B. THE ROUTE ---- */
var YMIN=SEATXY.crown.y,YMAX=SEATXY.root.y;
var VB={items:{},
 init:function(){stageCanvas(300);},
 box:function(){return {x0:84,x1:CW-76,y0:22,y1:CH-30};},
 /* THE MEASURED HEIGHT, KEPT LEGIBLE. The third eye and the throat sit 4.2
    units apart in SEATXY, which put two nameplates on one line. The order is
    the measurement's; where two stations fall closer than 28px the lower one
    is pushed down, and the whole column is then fitted back into the box. */
 yOf:function(b){var q=VB.box(),ys=[],prev=-1e9;
  BN.slice().reverse().forEach(function(x){var y=q.y0+(SEATXY[BKEY[x]].y-YMIN)/(YMAX-YMIN)*(q.y1-q.y0);y=Math.max(y,prev+28);ys.push([x,y]);prev=y;});
  var last=ys[ys.length-1][1],k=last>q.y1?(q.y1-q.y0)/(last-q.y0):1,out=0;
  ys.forEach(function(e){if(e[0]===b)out=q.y0+(e[1]-q.y0)*k;});return out;},
 pts:function(){var q=VB.box(),L=Object.keys(VB.items).map(function(k){return VB.items[k];}).filter(function(it){return !it.m.coh;})
   .sort(function(a,b){return a.m.s-b.m.s;}),n=L.length,dx=n>1?Math.min(64,(q.x1-q.x0)/(n-1)):0,
   x0=q.x0+8;
  L.forEach(function(it,i){var tx=x0+i*dx;it.x=it.x==null?tx:it.x+(tx-it.x)*.2;if(still())it.x=tx;it.y=VB.yOf(it.m.bn);});return L;},
 target:function(m){if(!CV)return null;itemSync(VB.items);var L=VB.pts(),it=VB.items[m.key];
  if(m.coh||!it)return cvPt(CW/2,CH-12);return cvPt(it.x,it.y);},
 land:function(m){itemLand(VB.items,m);},
 sync:function(){itemSync(VB.items);},
 frame:function(dt,t){itemStep(VB.items,dt);var g=G,q=VB.box();g.setTransform(DPR,0,0,DPR,0,0);g.clearRect(0,0,CW,CH);
  var L=VB.pts();
  /* the stations, where the seat sits in the body: SEATXY, the centroid of each seat's traced nerves */
  var dwell=null,best=0;BN.forEach(function(b){if(SEAT[b].rgT>best){best=SEAT[b].rgT;dwell=b;}});
  BN.slice().reverse().forEach(function(b){var y=VB.yOf(b),c=sc(b),o=SEAT[b],heard=o.rgT>0;
   g.beginPath();g.moveTo(q.x0-6,y);g.lineTo(q.x1+6,y);g.strokeStyle=rgba(c,heard?.16:.06);g.lineWidth=1;g.stroke();
   g.beginPath();g.arc(70,y,4.5,0,TAU);g.strokeStyle=rgba(c,heard?1:.4);g.lineWidth=1.6;g.stroke();
   g.fillStyle=rgba(c,heard?1:.76);g.font='600 12px Inter,system-ui,sans-serif';g.textAlign='right';g.textBaseline='middle';g.fillText(b,60,y);
   for(var i=0;i<10;i++){var on=i<Math.round(o.rg),x=CW-56+i*5;g.fillStyle=on?c:rgba(c,i>=SRC_ASK-1?.3:.12);g.fillRect(x,y-5,3,10);}
   /* stress lines round the seat the story keeps returning to, the Fringe turned flat */
   if(b===dwell&&o.rg>=1){var str=Math.min(1,o.rg/10),gp=3.4-1.2*str,f=still()?.5:(o.ph-Math.floor(o.ph));
    for(var k=0;k<3;k++){var pos=k+f,al=str*Math.sin(Math.PI*pos/3)*.5;if(al<.02)continue;
     [-1,1].forEach(function(sg){g.beginPath();g.moveTo(q.x0,y+sg*(5+pos*gp));g.lineTo(q.x1,y+sg*(5+pos*gp));g.strokeStyle=rgba(c,al);g.lineWidth=1;g.stroke();});}}});
  /* the route itself, the Field's dashed trajectory, drawn as far as each step has landed */
  g.lineWidth=1.6;g.setLineDash([4,4]);
  for(var i=1;i<L.length;i++){var a=L[i-1],b2=L[i],gg=Math.max(0,Math.min(1,b2.g));if(gg<.01)continue;
   var grd=g.createLinearGradient(a.x,a.y,b2.x,b2.y);grd.addColorStop(0,rgba(sc(a.m.bn),a.m.neg?.3:.85));grd.addColorStop(1,rgba(sc(b2.m.bn),b2.m.neg?.3:.85));
   g.strokeStyle=grd;g.beginPath();var mx=(b2.x-a.x)/2;g.moveTo(a.x,a.y);
   var N=16;for(var s2=1;s2<=Math.round(N*gg);s2++){var tt=s2/N,u=1-tt;
    var x=u*u*u*a.x+3*u*u*tt*(a.x+mx)+3*u*tt*tt*(b2.x-mx)+tt*tt*tt*b2.x,y=u*u*u*a.y+3*u*u*tt*a.y+3*u*tt*tt*b2.y+tt*tt*tt*b2.y;g.lineTo(x,y);}
   g.stroke();}
  g.setLineDash([]);
  var kink=null;L.forEach(function(it){if(!it.m.neg&&it.m.amt!=null&&(!kink||it.m.amt>kink.m.amt))kink=it;});
  L.forEach(function(it,i){var c=sc(it.m.bn),g1=Math.max(0,it.g);if(g1<.01)return;var r=(3+4*it.m.depth)*Math.min(1.15,g1);
   if(i===L.length-1){var hg=g.createRadialGradient(it.x,it.y,0,it.x,it.y,18);hg.addColorStop(0,rgba(c,.45));hg.addColorStop(1,rgba(c,0));g.fillStyle=hg;g.beginPath();g.arc(it.x,it.y,18,0,TAU);g.fill();}
   g.beginPath();g.arc(it.x,it.y,r,0,TAU);g.fillStyle='#101010';g.fill();
   if(it.m.neg)g.setLineDash([2,2]);g.strokeStyle=it.m.neg?rgba(c,.5):c;g.lineWidth=1.8;g.stroke();g.setLineDash([]);
   if(it===kink){g.fillStyle=c;g.font='500 12px Inter,system-ui,sans-serif';g.textAlign='center';g.textBaseline='bottom';g.fillText(it.m.txt,it.x,it.y-r-5);}});
  /* coherent words place nothing; they sit on the floor line at their place in the text */
  var len=Math.max(1,ST.set.length);
  Object.keys(VB.items).forEach(function(k){var it=VB.items[k];if(!it.m.coh||it.g<.01)return;var x=q.x0+(it.m.s/len)*(q.x1-q.x0);
   g.beginPath();g.moveTo(x,CH-10);g.lineTo(x,CH-10-8*it.g);g.strokeStyle='#7EB8D4';g.lineWidth=2;g.stroke();});
  g.fillStyle='rgba(148,144,138,.9)';g.font='12px Inter,system-ui,sans-serif';g.textAlign='left';g.textBaseline='alphabetic';
  if(L.length)g.fillText('in the order you wrote it',q.x0,CH-4);}};

/* ---- C. THE TRACE ---- */
var VC={items:{},shift:0,lastN:0,
 init:function(){stageCanvas(300);VC.lastN=ST.toks.length;},
 box:function(){return {x0:70,x1:CW-60,y0:8,y1:CH-26};},
 lane:function(b){var q=VC.box(),i=BN.length-1-BN.indexOf(b),h=(q.y1-q.y0)/7;return {y:q.y0+i*h,h:h};},
 dx:function(){var q=VC.box(),N=Math.max(1,ST.toks.length);return Math.max(3,Math.min(9,(q.x1-q.x0-8)/N));},
 xOf:function(j){var q=VC.box(),N=ST.toks.length;return q.x1-(N-1-j)*VC.dx()-VC.shift;},
 target:function(m){if(!CV)return null;var l=m.bn?VC.lane(m.bn):{y:CH-24,h:16};return cvPt(VC.xOf(Math.max(0,m.t0)),l.y+l.h*.55);},
 land:function(m){itemLand(VC.items,m);},
 sync:function(){itemSync(VC.items);var N=ST.toks.length;if(N>VC.lastN&&!still()&&VC.dx()<=3)VC.shift+=(N-VC.lastN)*3;VC.lastN=N;},
 frame:function(dt,t){itemStep(VC.items,dt);VC.shift*=still()?0:Math.exp(-dt*9);var g=G,q=VC.box();g.setTransform(DPR,0,0,DPR,0,0);g.clearRect(0,0,CW,CH);
  BN.forEach(function(b){var l=VC.lane(b),c=sc(b),o=SEAT[b],heard=o.rgT>0;
   g.beginPath();g.moveTo(q.x0,l.y+l.h-1);g.lineTo(q.x1,l.y+l.h-1);g.strokeStyle=rgba(c,heard?.22:.07);g.lineWidth=1;g.stroke();
   g.fillStyle=rgba(c,heard?1:.76);g.font='600 12px Inter,system-ui,sans-serif';g.textAlign='right';g.textBaseline='middle';g.fillText(b,q.x0-10,l.y+l.h*.6);
   for(var i=0;i<10;i++){var on=i<Math.round(o.rg);g.fillStyle=on?c:rgba(c,i>=SRC_ASK-1?.3:.12);g.fillRect(CW-54+i*5,l.y+l.h*.6-5,3,10);}});
  g.save();g.beginPath();g.rect(q.x0,0,q.x1-q.x0+8,CH);g.clip();
  /* every word read, a tick on the floor; the ones it kept rise into their seat */
  ST.toks.forEach(function(o,j){var x=VC.xOf(j);if(x<q.x0-8)return;g.fillStyle=o.m?(o.m.bn?sc(o.m.bn):'#7EB8D4'):'#3E3C39';g.fillRect(x,CH-20,Math.max(1.5,VC.dx()-3),o.m?9:6);});
  Object.keys(VC.items).forEach(function(k){var it=VC.items[k],m=it.m,g1=Math.max(0,it.g);if(g1<.01||m.t0<0)return;
   var x=VC.xOf(m.t0),x2=VC.xOf(m.t1)+Math.max(5,VC.dx()-1.5);
   if(m.coh){g.fillStyle=rgba('#7EB8D4',.9);g.fillRect(x,CH-20-12*g1,x2-x,3);return;}
   var l=VC.lane(m.bn),c=sc(m.bn),hh=g1*(0.2+0.8*m.depth)*l.h*.9,base=l.y+l.h-1;
   if(m.neg){g.strokeStyle=rgba(c,.55);g.setLineDash([2,2]);g.strokeRect(x+.5,base-hh+.5,x2-x-1,hh-1);g.setLineDash([]);return;}
   g.fillStyle=c;g.fillRect(x,base-hh,x2-x,hh);
   if(m.mod){var hb=hh/m.mod.f;g.fillStyle=mix(c,[255,255,255],.55);g.fillRect(x,base-hh,x2-x,hh-hb);}});
  var N=ST.toks.length;if(N){var px=VC.xOf(N-1)+VC.dx();g.fillStyle='rgba(126,184,212,.55)';g.fillRect(px,q.y0,1,CH-q.y0-6);}
  g.restore();
  g.fillStyle='rgba(148,144,138,.9)';g.font='12px Inter,system-ui,sans-serif';g.textAlign='right';g.textBaseline='middle';g.fillText('read',q.x0-10,CH-15);}};

/* ---- D. THE BINS (markup, not a canvas) ---- */
var VD={seen:{},
 init:function(){CV=null;var st=$('stage');st.className='';st.innerHTML='<div class="bins" id="bins"></div><div class="notc" id="notc"></div><div class="cohb" id="cohb"></div>';VD.seen={};VD.paint();},
 target:function(m){var b=m.coh?null:document.querySelector('.bin[data-b="'+m.bn+'"] .stk');if(!b){var cb=$('cohb');if(!cb)return null;var r0=cb.getBoundingClientRect();return {x:r0.left+40,y:r0.top+8};}
  var r=b.getBoundingClientRect(),n=b.children.length;return {x:r.left+r.width/2,y:r.bottom-14-n*30};},
 land:function(){},sync:function(){},after:function(){VD.paint();},frame:function(){},
 paint:function(){var h=ST.heard,by={},ms=ST.marks,seen={};(h&&h.seats||[]).forEach(function(s){by[s.band]=s;});
  var bins=$('bins');if(!bins)return;
  bins.innerHTML=BN.map(function(b){var c=sc(b),s=by[b],words=ms.filter(function(m){return m.bn===b&&!m.neg;}),er=s?s.earlier:0,on=words.length>0;
   var chips='';for(var i=0;i<er;i++)chips+='<div class="ch er">earlier entry</div>';
   chips+=words.map(function(m){var k=m.key;seen[k]=1;return '<div class="ch'+(VD.seen[k]?'':' new')+'">'+esc(m.txt)+'</div>';}).join('');
   return '<div class="bin'+(on?' on':'')+'" data-b="'+b+'" style="--c:'+c+'" title="'+esc(b)+'"><div class="bhd">'+esc(b)+'</div>'
    +(on?'<div class="bp">'+pips(s?s.rung:0,c)+'</div>':'')+'<div class="stk">'+chips+'</div></div>';}).join('');
  VD.seen=seen;
  /* the question line: the second thing counted at a seat is where srcRung reaches seven */
  bins.querySelectorAll('.bin.on .stk').forEach(function(stk){var kids=stk.children,y;
   if(kids.length>=2)y=kids[0].offsetTop-2.5;else y=stk.clientHeight-6-30-2.5;var ln=document.createElement('div');ln.className='askl';ln.style.top=y+'px';stk.appendChild(ln);});
  var neg=ms.filter(function(m){return m.neg;}),coh=ms.filter(function(m){return m.coh;});
  $('notc').innerHTML=neg.length?'<span>Set aside</span>'+neg.map(function(m){return '<s style="--c:'+sc(m.bn)+'">'+esc(ST.set.slice(m.negFrom!=null?m.negFrom:m.s,m.e))+'</s>';}).join(''):'';
  $('cohb').innerHTML=coh.length?'Coherent '+coh.map(function(m){return '<span>'+esc(m.txt)+'</span>';}).join(', '):'';}};

var VARS={a:VA,b:VB,c:VC,d:VD};
function VAR(){return VARS[ST.v];}

/* ============================================================
   THE RELEASE. What it takes off, before it runs.

   The arithmetic is relCoolDown's own, ui/release.js: an address at weight
   w (0 to 100) loses 21 percent of w plus 2, and is cleared at 6 or under.
   The done card already reports exactly these numbers after a run. Here they
   are shown before it, because a person is entitled to see what a run costs
   and what it does before they begin it.
   ============================================================ */
function relModel(){
 var r=compute(),live=r.loaded.slice().sort(function(a,b){return b.sq-a.sq;}),found=[];
 if(ST.parse)ST.parse.imprints.forEach(function(im){var n=BY[im.node];if(n&&found.indexOf(n)<0)found.push(n);});
 var story=ST.rel.src==='story'&&found.length,pool=story?found:live,take=pool.slice(0,ST.rel.n);
 var bud=meterBudget(PROF),chans=CHANS.map(function(c){return c[0]+c[2];});
 var plan=(take.length&&bud.cap>0)?meterPlan(PROF,take.map(function(n){return n.i;}),chans,bud.cap):[];
 var rows=take.map(function(n){var w0=n.sq*10,d=-Math.round(w0*.21+2),w1=Math.max(0,w0+d);
  return {n:n,w0:w0,w1:w1,clears:w1<=6,opp:(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||''};});
 var first=take.length&&typeof relLine==='function'?relLine(take[0],'Rlimit',0):null;
 return {live:live,found:found,take:take,rows:rows,plan:plan,secs:Math.round(plan.length*RUN_SPEED_S[ST.rel.pace]),left:bud.left,first:first};}
var REL_SEEN={};
function fmtT(s){var m=Math.floor(s/60),r=s%60;return m+':'+(r<10?'0':'')+r;}
function paintRelease(){
 var el=$('rl');if(ST.run){paintRun();return;}
 var M=relModel(),o='';
 o+='<div class="rl-hd"><span class="ring" style="--c:var(--rl-hi,var(--accent))"></span><h3>Release</h3></div>'
  +'<p class="rl-lead">A release empties the story held at these addresses. The coherent opposite installs on the same pass.</p>';
 var seg=function(k,v,lab,on){return '<button class="seg" data-'+k+'="'+v+'" aria-pressed="'+on+'">'+lab+'</button>';};
 o+='<div class="rl-opts">'
  +'<div class="rl-opt"><span class="eb">From</span>'+seg('src','heavy','Heaviest',ST.rel.src==='heavy')+seg('src','story','This story'+(M.found.length?' '+M.found.length:''),ST.rel.src==='story')+'</div>'
  +'<div class="rl-opt"><span class="eb">Addresses</span>'+[1,3,5,8].map(function(n){return seg('n',n,n,ST.rel.n===n);}).join('')+'</div>'
  +'<div class="rl-opt"><span class="eb">Pace</span>'+Object.keys(RUN_SPEED_S).map(function(k){return seg('pace',k,k,ST.rel.pace===k);}).join('')+'</div></div>';
 if(ST.v==='d')o+='<div class="dial">'+dialSvg(M,-1)+'</div>';
 if(!M.rows.length)o+='<p class="rl-none">Nothing is held above the line yet, so there is nothing to release.</p>';
 else{var seen={};
  o+='<ol class="rl-q">'+M.rows.map(function(q){var c=sc(q.n.b),k=q.n.i;seen[k]=1;
   return '<li class="rq'+(REL_SEEN[k]?'':' new')+'" style="--c:'+c+'"><span class="ring"></span><span class="nm">'+esc(q.n.k)+'</span>'
    +'<span class="wt"><b>'+(q.w0/10).toFixed(1)+'</b> to <b>'+(q.w1/10).toFixed(1)+'</b></span>'
    +'<span class="br"><i style="width:'+(q.w1)+'%"></i><i class="cut" style="left:'+q.w1+'%;width:'+(q.w0-q.w1)+'%"></i></span>'
    +'<span class="sub"><span>'+esc(q.n.b)+', '+esc(q.n.n||'')+'</span><span>'+(q.clears?'clears':(q.opp?'toward '+esc(q.opp):''))+'</span></span></li>';}).join('')+'</ol>';
  REL_SEEN=seen;
  if(M.first&&M.first.text)o+='<div class="rl-first"><span class="eb">First line</span><q>'+esc(M.first.text)+'</q></div>';
  o+='<div class="rl-cost"><div><span class="eb">Costs</span><b>'+M.plan.length+'<small>patterns</small></b></div>'
   +'<div><span class="eb">Runs</span><b>'+M.secs+'<small>seconds</small></b></div>'
   +'<div><span class="eb">Left</span><b>'+M.left+'<small>patterns</small></b></div></div>';}
 o+='<button class="rl-go" id="rlgo"'+(M.plan.length?'':' disabled')+'>Run a release</button>';
 el.innerHTML=o;relArt(M);
 el.querySelectorAll('[data-src]').forEach(function(b){b.onclick=function(){ST.rel.src=b.getAttribute('data-src');paintRelease();};});
 el.querySelectorAll('[data-n]').forEach(function(b){b.onclick=function(){ST.rel.n=+b.getAttribute('data-n');paintRelease();};});
 el.querySelectorAll('[data-pace]').forEach(function(b){b.onclick=function(){ST.rel.pace=b.getAttribute('data-pace');paintRelease();};});
 var go=$('rlgo');if(go)go.onclick=function(){startRun(M);};}
/* each mockup's own callout, driven by the queue */
function relArt(M){var el=$('rl');el.style.boxShadow='';el.style.removeProperty('--glow');el.style.removeProperty('--lux');
 if(ST.v==='a'){
  /* THE FIELD AROUND IT. One shell per queued address, in its seat's colour,
     as thick as the address is heavy, on the Field's own stage */
  var sh=['0 0 0 1px rgba(255,255,255,.05)'],sp=0;
  M.rows.slice(0,5).forEach(function(q){var w=1+q.w0/100*2.4;sp+=6;sh.push('0 0 0 '+sp+'px var(--bg)');sp+=w;sh.push('0 0 0 '+sp.toFixed(1)+'px '+rgba(sc(q.n.b),.75-.1*sh.length/2));});
  el.style.boxShadow=sh.join(',');}
 if(ST.v==='b'&&M.rows.length){
  /* LIT FROM WITHIN, in the heaviest queued seat's own colour, as bright as that address is heavy.
     Capped at a fifth of the colour, where the copy under it measures 5.7 to 1 at the brightest point. */
  el.style.setProperty('--glow',sc(M.rows[0].n.b));el.style.setProperty('--lux',(0.15+0.2*M.rows[0].w0/100).toFixed(2));}}
/* D's dial: one tick per pattern the plan will speak, coloured by its address */
function dialSvg(M,lit){var N=M.plan.length,R=72,o='<svg width="184" height="184" viewBox="-92 -92 184 184" aria-hidden="true">'
  +'<circle r="'+(R+8)+'" fill="none" stroke="rgba(194,160,99,.28)" stroke-width="1"/>';
 M.plan.forEach(function(key,i){var n=BY[+String(key).split(':')[0]],a=-Math.PI/2+i/N*TAU,c=n?sc(n.b):'#C2A063',on=lit<0||i<=lit;
  o+='<line x1="'+(Math.cos(a)*(R-6)).toFixed(1)+'" y1="'+(Math.sin(a)*(R-6)).toFixed(1)+'" x2="'+(Math.cos(a)*(R+4)).toFixed(1)+'" y2="'+(Math.sin(a)*(R+4)).toFixed(1)
   +'" stroke="'+c+'" stroke-opacity="'+(on?(lit<0?.85:1):.2)+'" stroke-width="'+(N>40?1.4:2.2)+'" stroke-linecap="round"/>';});
 var sec=lit<0?M.secs:Math.max(0,Math.round((N-lit-1)*RUN_SPEED_S[ST.rel.pace]));
 o+='<text y="2" text-anchor="middle" fill="#E8D7B3" font-family="Inter,system-ui,sans-serif" font-size="30" font-weight="600">'+fmtT(sec)+'</text>'
  +'<text y="26" text-anchor="middle" fill="#A99A7D" font-family="Inter,system-ui,sans-serif" font-size="12">'+N+' patterns</text></svg>';return o;}

/* THE RUN, PREVIEWED. The plan's own lines at the chosen pace. Nothing is released and nothing is spent. */
function startRun(M){ST.run={M:M,i:0};paintRun();clearInterval(ST.runT);
 ST.runT=setInterval(function(){if(!ST.run)return;ST.run.i++;if(ST.run.i>=ST.run.M.plan.length){clearInterval(ST.runT);ST.run=null;paintRelease();return;}paintRun();},RUN_SPEED_S[ST.rel.pace]*1000);}
function paintRun(){var R=ST.run,M=R.M,key=String(M.plan[R.i]).split(':'),n=BY[+key[0]],ch=CHANS.filter(function(c){return c[0]+c[2]===key[1];})[0]||CHANS[0];
 var L=typeof relLine==='function'?relLine(n,key[1],+key[2]||0):null,c=sc(n.b),el=$('rl');
 el.innerHTML='<div class="rl-hd"><span class="ring" style="--c:'+c+'"></span><h3>Release</h3></div>'
  +'<p class="rl-lead">Preview. Nothing is released and no pattern is spent.</p>'
  +(ST.v==='d'?'<div class="dial">'+dialSvg(M,R.i)+'</div>':'')
  +'<div class="rl-run" style="--c:'+c+'"><div class="ch">'+ch[1]+' '+ch[2]+', line '+((+key[2]||0)+1)+'</div><div class="nd">'+esc(n.k)+'</div>'
  +'<div class="ln">'+esc(L&&L.text?L.text:'')+'</div><div class="pg"><i style="width:'+((R.i+1)/M.plan.length*100).toFixed(0)+'%"></i></div>'
  +'<div class="ch" style="margin-top:6px">'+(R.i+1)+' of '+M.plan.length+' patterns</div></div>'
  +'<button class="rl-go" id="rlstop" style="--rl-go:var(--panel-2);--rl-on:var(--ink)">Stop</button>';
 relArt(M);$('rlstop').onclick=function(){clearInterval(ST.runT);ST.run=null;paintRelease();};}

/* ============================================================
   THE NOTES, per mockup
   ============================================================ */
var IDEA={
 a:'<b>A. Ring.</b> Borrowed from the Field. The imprints panel is a small Field reading this one entry: the seven seat arcs in the Field\'s own order, a spoke for every word it scored, the ring bending where the entry reads past five. The release sits on the Field\'s stage with its own shells round it.',
 b:'<b>B. Route.</b> Borrowed from the Field. The imprints panel draws the story\'s path through the body with the Field\'s dashed trajectory, seat to seat in the order you wrote it, at each seat\'s measured height. The release is lit from inside by the heaviest address it will run.',
 c:'<b>C. Trace.</b> An instrument\'s strip chart. Every word you write is a tick on the floor; the ones it keeps rise into their seat\'s lane, as tall as they weigh. The release is the one lit surface on a dark page.',
 d:'<b>D. Bins.</b> The words it caught, stacked in the seat they landed in, in their own column between the journal and the imprints. A dashed line marks where a seat earns a question. The release is a dial: one tick for every thought line the run will speak.'};
var NOTE_ROWS=[
 ['A word lights in the journal','marksOf placed these letters at a seat on this read','engine/sniff.js marksOf'],
 ['The word flies to its seat, 560ms','the hit is scored at that seat; nothing moves for a word it did not score','scanStory, seatOf'],
 ['A struck word, and its seat does not climb','the two words before it hold a negation, so Source AI sets it aside','engine/sourceai.js srcNegated'],
 ['A brighter tip or cap on a mark','a degree word in front scaled the amount, and the bright part is the scaling','LEXMOD, hit.mod'],
 ['A coherent word goes to the centre or the floor','a coherent hit places nothing at any seat','seatOf returns null'],
 ['The seat grows, then settles','the entry\'s reading at that seat, bands divided by three, capped at ten','parseStory bands'],
 ['A pip fills','the rung: once is one to six, twice is seven, three times eight, an earlier entry nine or ten','srcRung'],
 ['The prompt changes to a question','a seat reached seven; one question, never two','srcTurn move ask'],
 ['An imprint pill springs in','the address the charge would land on; dashed when the words did not name it','parseStory imprints, inferred'],
 ['A release row appears','This story is picked and the imprint named an address','relModel from parseStory imprints']];
var NOTE_VAR={
 a:[['The ring bends and fringes appear','the seat\'s reading passed five, LEVER_MU, the Field\'s own line; spring w 14, damping .42, the Field\'s numbers','frStress, fringeStep in ui/wheel.js'],
    ['Rings around the release','one shell per queued address, in its seat colour, as thick as the address is heavy','compute, n.sq']],
 b:[['A dashed line extends','the path of the story through the body, step by step as each word lands','pathOf steps'],
    ['A station sits where it does','the centroid of that seat\'s traced nerves, top to bottom','SEATXY'],
    ['Stress lines round one station','the seat the story keeps returning to, spaced tighter as its rung climbs','srcHear rung'],
    ['The release glows','the heaviest queued address\'s seat colour, brighter the heavier it is','compute, n.sq']],
 c:[['The chart slides left','one word read; the floor ticks are every word, kept or dropped','the tokens of the text'],
    ['A bar rises in a lane','one scored stretch of text, as tall as its amount over the largest in the lexicon','amt / PATHMAX']],
 d:[['A chip drops into a bin','the person\'s own word, in the seat it scored at','marksOf, srcHear words'],
    ['A bin widens','the seat has something in it; an empty seat stays a sliver','srcHear seats'],
    ['The dashed line','the second thing counted at a seat, which is where the rung reaches seven','srcRung'],
    ['A dial tick lights during the run','one thought line spoken; the ticks are the plan','meterPlan']]};
var NOTE_REL={
 a:'<b>Release, the field around it.</b> The card drops to the Field\'s own stage, darker than every panel, and carries one shell per queued address around its edge, in that address\'s seat colour and as thick as the address is heavy. His words: "maybe that field that\'s around it has a different call out look entirely."',
 b:'<b>Release, lit from within.</b> No border and no grey. The card is lit from its top edge in the seat colour of the heaviest address it will run, and the light is stronger the heavier that address is. The button takes the same colour, so the one action on the card reads as the light source.',
 c:'<b>Release, the lit slab.</b> The only light surface on a dark page, in the Snow lighting\'s own ground and ink. Kenya Hara\'s White: the one place the page changes its light is the place that changes the person.',
 d:'<b>Release, the dial.</b> A warm black and a brass hairline, the product\'s true gold token, where every other surface is a cool grey. The dial is the run: one tick per thought line, in its address\'s colour, the run time in the middle. During a run the ticks light one by one.'};
var NOTE_SHARED='<p><b>What changed in the release, on all four.</b> It says what it does in one line, before any control. Each address shows its weight now and its weight after the run, with the part the run takes off hatched: that is relCoolDown\'s own arithmetic, the same numbers the done card prints after a run, shown before it. The thought line the run speaks first is quoted. The cost is three figures with one word each: patterns, seconds, and patterns left. <b>Run a release</b> here plays the plan\'s own lines at the chosen pace and releases nothing.</p>'
 +'<p><b>Found while building, and shown rather than hidden.</b> "I was not scared" is set aside by Source AI as negated, so the root never appears under Heard. parseStory still charges four root imprints from the same word, so the imprints panel shows them, labelled with the words that did it. And the shipped journal sets a matched word in weight 600 over a caret that belongs to weight 300 text: measured 12.8 pixels of drift after five marks on one line. No mark here changes weight.</p>'
 +'<p><b>What each commit here does.</b> Commit writes the entry\'s charge onto an in-page copy of Nkem\'s field, which the release queue reads, and adds its seats to the earlier entries, which is how rungs nine and ten happen. Nothing is saved. Two earlier entries adds two example commits that touched the throat and the heart, seat keys only.</p>';
function paintNotes(){var v=ST.v,rows=NOTE_ROWS.concat(NOTE_VAR[v]||[]);
 $('idea').innerHTML=IDEA[v];
 $('notes').innerHTML='<h2>What moves, and what it is</h2><p>Nothing moves that the engine did not just do. There is no scanning sweep: the whole read takes under a millisecond, and an indicator for it would be a claim about effort that is false. Under Still, or the system\'s reduced motion setting, every value sits at its end state.</p>'
  +'<table><tr><th>Motion</th><th>What it represents</th><th>Where it comes from</th></tr>'
  +rows.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td><code>'+r[2]+'</code></td></tr>';}).join('')+'</table>'
  +'<h2>The release</h2><p>'+NOTE_REL[v]+'</p>'+NOTE_SHARED
  +'<p style="color:var(--dim)">Engine: '+esc(PROTO_STAMP.engine)+'. Built '+esc(PROTO_STAMP.when)+'. Requests made by this page: none.</p>';}

/* ============================================================
   SWITCHING, THE DEMO, AND THE FRAME LOOP
   ============================================================ */
function setV(v){if(!VARS[v])v='a';ST.v=v;document.body.setAttribute('data-v',v);
 document.querySelectorAll('#mkv button').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-v')===v?'true':'false');});
 var pv=$('pv');if(v==='d'){$('colm').appendChild(pv);pv.classList.add('panel','im','alone');}
 else{$('imp').insertBefore(pv,$('imps'));pv.classList.remove('panel','im','alone');}
 if(location.hash.slice(1)!==v)history.replaceState(null,'','#'+v);
 VAR().init();VAR().sync&&VAR().sync();ST.marks.forEach(function(m){VAR().land(m);});
 SEATS_T();paintAll();}
function paintAll(){paintHL();paintCount();paintPrompt();paintSummary();paintImprints();paintStream();paintRelease();paintNotes();if(ST.v==='d')VD.paint();}
var EXAMPLE='My manager moved the deadline again and I said yes. My jaw was tight the whole call and I did not say anything. '
 +'I was not scared, I was angry. Afterwards I sat in the car and my throat was really tight. '
 +'I feel ashamed that I care this much. I slept well though, and I was grateful for the walk home.';
var DEMO=null;
function demo(txt,cps){stopDemo();var ta=$('ta'),i=0;ta.value='';onText('',true);
 var step=function(){if(i>=txt.length){DEMO=null;onText(ta.value,true);return;}var ch=txt.charAt(i++);ta.value+=ch;onText(ta.value);
  DEMO=setTimeout(step,ch==='.'?260:(ch===' '?46:(cps||32)));};step();}
function stopDemo(){clearTimeout(DEMO);DEMO=null;}
var LAST=0;
function loop(ts){var dt=Math.min(.05,(ts-(LAST||ts))/1000);LAST=ts;stepSeats(dt);if(CV&&VAR().frame)VAR().frame(dt,ts/1000);requestAnimationFrame(loop);}

function boot(){
 loadNkem();
 var ta=$('ta');
 ta.addEventListener('input',function(){stopDemo();onText(ta.value);});
 ta.addEventListener('scroll',function(){$('hl').scrollTop=ta.scrollTop;});
 /* a word closes when the caret leaves it, so moving away counts as finishing it */
 ta.addEventListener('blur',function(){if(ST.set!==ST.text)onText(ST.text,true);});
 document.querySelectorAll('#mkv button').forEach(function(b){b.onclick=function(){setV(b.getAttribute('data-v'));};});
 $('demo').onclick=function(){demo(EXAMPLE);};
 $('clr').onclick=$('jclr').onclick=function(){stopDemo();ta.value='';ST.passed=false;onText('',true);};
 /* the Move on button is repainted with the prompt, so it is bound there */
 $('prior').onclick=function(){ST.priorDemo=!ST.priorDemo;this.setAttribute('aria-pressed',ST.priorDemo);stRead();paintAfter();};
 $('still').onclick=function(){var on=!document.body.classList.contains('still');document.body.classList.toggle('still',on);this.setAttribute('aria-pressed',on);};
 $('commit').onclick=function(){if(!ST.parse||!ST.parse.imprints.length)return;
  applyStory(ST.set);ST.committed.push({bands:ST.parse.bands});stopDemo();ta.value='';ST.passed=false;onText('',true);paintRelease();};
 window.addEventListener('resize',function(){if(CV){sizeCanvas(CH);}});
 window.addEventListener('hashchange',function(){setV(location.hash.slice(1));});
 setV((location.hash||'#a').slice(1));
 requestAnimationFrame(loop);}
/* the test hook the screenshot harness drives, so a frame is taken of a state and not of a moment */
window.PROTO={setV:setV,demo:demo,type:function(t){stopDemo();$('ta').value=t;onText(t,true);},
 prior:function(on){ST.priorDemo=!!on;$('prior').setAttribute('aria-pressed',!!on);stRead();paintAfter();},
 rel:function(o){Object.assign(ST.rel,o);paintRelease();},run:function(){var M=relModel();startRun(M);},
 state:function(){return {v:ST.v,marks:ST.marks.length,turn:turnNow(),heard:ST.heard&&ST.heard.seats.map(function(s){return [s.band,s.rung];})};}};
boot();
