/* ============================================================
   THE STORY PAGE, SECOND ROUND. Round HY in TASKS.md. Proposal only.

   Forked from proto/story-redesign/src/shared.js, round HX. What is kept is
   the read: the same engine calls on the same keystroke rule, the same flight,
   the same release arithmetic. What is new:

     one imprints instrument, Trace's strip chart with Route's line through it
     a sort that moves the lanes and the list together, five ways
     four layouts that put Story, Imprints and Release on one screen
     the release reads whichever field is picked, so each ICP sees their own

   The engine above this script is the committed engine.js, unmodified. Every
   number, word and rung on this page is its own output:

     parseStory   the hits, the seats, the path, the imprints
     marksOf      which letters were scored, and in which seat
     normMap      the offsets the scanner read through
     srcHear      what Source AI heard, per seat, the rung, negation
     srcTurn      open, listen, ask or pass
     compute      the picked field, for the release queue
     meterPlan    what a run costs, in patterns
     relLine      the thought line a run speaks first
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
function phone(){return innerWidth<=760;}
var CHILDBY={};CHILD.forEach(function(c){CHILDBY[c.nm]=c;});

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
var RUN_SPEED_S={Slow:3.2,Steady:2.2,Quick:1.4};
var CHANS=[['R','Right','limit'],['L','Left','limit'],['R','Right','truth'],['L','Left','truth']];

/* ---- whose field. Loaded the way ui/personas.js loadP loads a worked
   example. Nkem is the default because round HX used her; the ICPs are in the
   list so each of them can be walked against their own field. Nothing saved. ---- */
var PROF=null,WHO='Nkem';
var ROSTER=['Nkem','Sofia','Diane','Marcus','Angela','Derek','James','Ana','Gordon','Rosa'];
function loadWho(nm){
 var i=-1;PEOPLE.forEach(function(p,j){if(p.nm===nm)i=j;});if(i<0)return;var p=PEOPLE[i];WHO=nm;
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
var ST={l:'e',text:'',set:'',parse:null,heard:null,marks:[],toks:[],prev:{},passed:false,
 committed:[],priorDemo:false,rel:{src:'story',n:3,pace:'Steady'},run:null,said:'',
 sort:'seat',hot:null,focus:'write',lastFound:[],status:'',off:{},vault:[],showVault:false};
var PRIOR_DEMO=[{bands:{throat:12,heart:6}},{bands:{throat:9}}];
function priorList(){return (ST.priorDemo?PRIOR_DEMO:[]).concat(ST.committed);}
/* a word under the caret is left out of the read until a space or a stop closes it */
function settledOf(t){return /[A-Za-z']$/.test(t)?t.replace(/[A-Za-z']+$/,''):t;}

function stRead(){
 var t=ST.set, p=t.trim()?parseStory(t):null;
 var marks=p?marksOf(t,p):[], nm=normMap(t);
 var negAt={};
 if(p)p.path.steps.forEach(function(s){if(!s.seat||s.coherent)return;
  if(srcNegated(nm.s,s.at)){var a=nm.map[s.at+1];if(a!=null)negAt[a]=1;}});
 var modAt={};
 if(p)p.hits.forEach(function(h){if(!h.mod)return;var a=nm.map[h.at+1];if(a!=null)modAt[a]={f:h.mod,w:h.modw};});
 var toks=[],re=/[A-Za-z']+/g,m;while((m=re.exec(t)))toks.push({s:m.index,e:m.index+m[0].length,w:m[0]});
 var seen={};
 marks.forEach(function(k){
  k.txt=t.slice(k.s,k.e);k.neg=!!negAt[k.s];k.mod=modAt[k.s]||null;
  var base=(k.bn||'coh')+':'+k.txt.toLowerCase();seen[base]=(seen[base]||0)+1;k.key=base+':'+seen[base];
  k.depth=k.amt!=null?Math.min(1,Math.abs(k.amt)/PATHMAX):0.3;
  k.t0=-1;k.t1=-1;toks.forEach(function(o,j){if(o.s>=k.s&&o.e<=k.e){if(k.t0<0)k.t0=j;k.t1=j;o.m=k;}});
  if(k.neg){for(var q2=1;q2<=SRC_NEG_W;q2++){var d2=toks[k.t0-q2];if(d2&&SRC_NEG.indexOf(d2.w.toLowerCase().replace(/'/g,''))>=0){k.negFrom=d2.s;}}}});
 ST.parse=p;ST.marks=marks;ST.toks=toks;
 ST.heard=srcHear(t,srcPrior(priorList()));}

/* ============================================================
   THE PIPELINE. A keystroke paints the sentence at once; what it causes is
   painted when the word lands, so the order on screen is word, seat, rung,
   question.
   ============================================================ */
var PAINT_T=null;
function onText(v,close){
 ST.text=v;var s=close?v:settledOf(v);
 if(s===ST.set){paintHL();paintCount();return;}
 ST.set=s;
 var before=ST.prev;stRead();
 var now={},arr=[];ST.marks.forEach(function(m){now[m.key]=1;if(!before[m.key])arr.push(m);});
 ST.prev=now;
 paintHL(arr);paintCount();
 if(!ST.set.trim())ST.passed=false;
 if(ST.l==='h'&&ST.set.trim()&&ST.focus!=='write')setFocus('write');
 IX.sync();
 if(arr.length&&!still()){
  arr.forEach(function(m,i){fly(m,i*90);});
  clearTimeout(PAINT_T);PAINT_T=setTimeout(paintAfter,FLY_MS+(arr.length-1)*90);}
 else{arr.forEach(function(m){IX.land(m);});clearTimeout(PAINT_T);paintAfter();}}
function paintAfter(){SEATS_T();IX.relayout();paintPrompt();paintImprints();paintCtr();paintRelease();}

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
 var o=ST.status?'<b>'+esc(ST.status)+'</b>':(n+(n===1?' word':' words')+(p?', '+ST.marks.length+' read':''));
 $('ct').innerHTML=o;
 var k=p?p.imprints.length:0,b=$('commit');b.disabled=!k;}

/* ---- the prompt engine ---- */
function turnNow(){return srcTurn(ST.heard,{typed:!!ST.set.trim(),passed:ST.passed});}
function paintPrompt(){
 var h=ST.heard, turn=turnNow(), o='';
 var d=Math.floor(Date.now()/864e5),k=d%SRC_JOG.length;
 if(turn.move==='open'){o+='<p class="pe-q">'+esc(SRC_OPEN)+'</p><p class="pe-jog">Or start from <q>'+esc(SRC_JOG[k])+'</q></p>';}
 else if(turn.move==='ask'){
  o+='<p class="pe-q" style="--c:'+sc(turn.band)+'">'+esc(srcAsk(turn))+'</p>'
   +'<div class="pe-row"><button class="btn" id="pass">Move on</button><span class="pe-note">Answer in the journal, or leave it.</span></div>';}
 else if(turn.move==='pass'){o+='<p class="pe-q">Cool.</p><p class="pe-note">Nothing more asked in this entry.</p>';}
 else{
  o+='<p class="pe-q quiet">'+esc(SRC_OPEN)+'</p>';
  if(h&&h.top)o+='<div class="pe-row"><span class="pe-gauge" style="--c:'+sc(h.top.band)+'"><span>Next question</span>'
   +pips(h.top.rung,sc(h.top.band))+'<span class="sn">'+esc(h.top.band)+'</span></span></div>';}
 $('pe').innerHTML=o;
 var said=turn.move==='open'?SRC_OPEN:(turn.move==='ask'?srcAsk(turn):(turn.move==='pass'?'Cool.':''));
 if(said!==ST.said){ST.said=said;$('say').textContent=said;}
 var mv=$('pass');if(mv)mv.onclick=function(){ST.passed=true;paintPrompt();};}

/* ============================================================
   THE LANES. One model decides what a lane is and what order the lanes
   stand in, and the chart and the list both read it, so a sort moves both.

     seat        body order, crown at the top, root at the foot. Route's order.
     heard       first seat the story reached at the top. Trace's order in time.
     weight      the entry's reading at the seat, parseStory bands, heaviest top
     came back   the rung, srcHear, the seat nearest a question at the top
     charge      lanes are the charge each imprint carries, not the seat: the
                 shipped Imprints tab's Charge grouping, with its symbol
   ============================================================ */
var SORTS=[['seat','Seat'],['heard','When heard'],['weight','Weight'],['rung','Came back'],['charge','Charge']];
function laneModel(){
 var p=ST.parse,imps=p?p.imprints:[],rg={},wds={};(ST.heard&&ST.heard.seats||[]).forEach(function(s){rg[s.band]=s.rung;wds[s.band]=s.words;});
 var first={},cnt={};ST.marks.forEach(function(m){if(!m.bn)return;if(first[m.bn]==null||m.t0<first[m.bn])first[m.bn]=m.t0;if(!m.neg)cnt[m.bn]=(cnt[m.bn]||0)+1;});
 var seatW={};BN.forEach(function(b){seatW[b]=p&&p.bands[BKEY[b]]?p.bands[BKEY[b]]:0;});
 var byBand={};imps.forEach(function(im){(byBand[im.band]=byBand[im.band]||[]).push(im);});
 var lanes=[],keyOf;
 if(ST.sort==='charge'&&imps.length){
  var fb={};Object.keys(byBand).forEach(function(b){var t={};byBand[b].forEach(function(im){t[im.fetter]=(t[im.fetter]||0)+im.amt;});
   fb[b]=Object.keys(t).sort(function(x,y){return t[y]-t[x];})[0];});
  var L={};imps.forEach(function(im){var f=im.fetter,c=CHILDBY[f];
   var o=L[f]=L[f]||{key:'c:'+f,label:f,color:sc(c?c.seat:im.band),icon:c?c.ic:null,active:true,weight:0,rung:0,first:1e9,bands:[],imps:[]};
   o.weight+=im.amt;o.imps.push(im);if(o.bands.indexOf(im.band)<0)o.bands.push(im.band);
   o.rung=Math.max(o.rung,rg[im.band]||0);if(first[im.band]!=null)o.first=Math.min(o.first,first[im.band]);});
  lanes=Object.keys(L).map(function(k){return L[k];}).sort(function(a,b){return b.weight-a.weight||a.first-b.first;});
  keyOf=function(m){return m.bn&&fb[m.bn]?'c:'+fb[m.bn]:null;};}
 else{
  lanes=BN.slice().reverse().map(function(b,i){return {key:b,label:b,color:sc(b),icon:null,band:b,body:i,
   active:seatW[b]>0||cnt[b]>0||first[b]!=null,weight:seatW[b],rung:rg[b]||0,first:first[b]!=null?first[b]:1e9,
   bands:[b],imps:byBand[b]||[],words:wds[b]||[],count:cnt[b]||0};});
  var cmp={seat:function(a,b){return a.body-b.body;},
   heard:function(a,b){return a.first-b.first||a.body-b.body;},
   weight:function(a,b){return b.weight-a.weight||a.body-b.body;},
   rung:function(a,b){return b.rung-a.rung||b.weight-a.weight||a.body-b.body;}}[ST.sort==='charge'?'seat':ST.sort];
  lanes.sort(cmp);
  keyOf=function(m){return m.bn||null;};}
 /* the seat the story keeps returning to, Route's dwell, stress lines on it */
 var dw=null,best=0;Object.keys(cnt).forEach(function(b){if(cnt[b]>best){best=cnt[b];dw=b;}});
 var dwKey=dw?(ST.sort==='charge'?keyOf({bn:dw}):dw):null;
 return {lanes:lanes,keyOf:keyOf,dwell:best>=2?dwKey:null};}

/* ============================================================
   THE INSTRUMENT. Trace and Route, one canvas.

   From Trace: every word you write is a tick on the floor, left to right in
   the order you wrote it, and the words it kept rise into their lane as tall
   as they weigh. From Route: a dashed line runs from each kept word to the
   next, so the story's path through the body is drawn over the bars, and the
   lane the story keeps returning to carries stress lines. The heaviest word
   is named on the chart. Where the chart is wide enough, every kept word is.
   ============================================================ */
var CV=null,G=null,CW=0,CH=0,DPR=1;
var LANE={};             /* key -> spring state: y, h, alpha */
var LM={lanes:[],keyOf:function(){return null;},dwell:null};
var GUT_L=94,GUT_R=64,FLOOR=22,TOPPAD=6;
function sizeCanvas(){if(!CV)return;DPR=Math.min(2,window.devicePixelRatio||1);var st=$('stage');
 CW=st.clientWidth;CH=st.clientHeight;CV.width=Math.round(CW*DPR);CV.height=Math.round(CH*DPR);}
function cvPt(x,y){var r=CV.getBoundingClientRect();return {x:r.left+x,y:r.top+y};}
function rgba(hex,a){var n=parseInt(hex.slice(1),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')';}
function mix(hex,to,t){var n=parseInt(hex.slice(1),16),r=n>>16&255,g=n>>8&255,b=n&255;
 return '#'+[r+(to[0]-r)*t,g+(to[1]-g)*t,b+(to[2]-b)*t].map(function(v){v=Math.round(v);return (v<16?'0':'')+v.toString(16);}).join('');}
var ICONS={};function iconPath(d){if(!ICONS[d])ICONS[d]=new Path2D(d);return ICONS[d];}

var IX={items:{},
 box:function(){return {x0:GUT_L,x1:CW-GUT_R,y0:TOPPAD,y1:CH-FLOOR};},
 /* the lane targets: an empty lane is kept, thin, so a slot keeps its place */
 targets:function(){var q=IX.box(),L=LM.lanes,tot=0;L.forEach(function(l){tot+=l.active?1:0.42;});
  var u=tot?(q.y1-q.y0)/tot:0,y=q.y0,out={};L.forEach(function(l){var h=u*(l.active?1:0.42);out[l.key]={y:y,h:h};y+=h;});return out;},
 relayout:function(){LM=laneModel();var T=IX.targets(),snap=still();
  Object.keys(LANE).forEach(function(k){if(!T[k])LANE[k].gone=true;});
  Object.keys(T).forEach(function(k){var o=LANE[k];
   if(!o||o.gone&&o.a<.02){LANE[k]={y:T[k].y,h:T[k].h,vy:0,vh:0,a:snap?1:0,ty:T[k].y,th:T[k].h};}
   else{o.ty=T[k].y;o.th=T[k].h;o.gone=false;}});},
 lane:function(k){var o=LANE[k];return o?{y:o.y,h:o.h}:null;},
 dx:function(){var q=IX.box(),N=Math.max(1,ST.toks.length);return Math.max(3,Math.min(22,(q.x1-q.x0-8)/N));},
 xOf:function(j){var q=IX.box(),N=ST.toks.length,dx=IX.dx();
  return N*dx<=q.x1-q.x0-4?q.x0+4+j*dx:q.x1-(N-1-j)*dx;},
 target:function(m){if(!CV)return null;var k=LM.keyOf(m),l=k?IX.lane(k):null;
  if(!l)return cvPt(IX.xOf(Math.max(0,m.t0)),CH-FLOOR/2);return cvPt(IX.xOf(Math.max(0,m.t0))+IX.dx()/2,l.y+l.h*.55);},
 land:function(m){itemLand(IX.items,m);},
 sync:function(){itemSync(IX.items);},
 step:function(dt){var snap=still();
  Object.keys(LANE).forEach(function(k){var o=LANE[k],ta=o.gone?0:1;
   if(snap){o.y=o.ty;o.h=o.th;o.a=ta;o.vy=o.vh=0;if(o.gone)delete LANE[k];return;}
   var sub=Math.max(1,Math.ceil(dt/(1/120))),sd=dt/sub;
   for(var s=0;s<sub;s++){var a=170*(o.ty-o.y)-2*.86*13*o.vy;o.vy+=a*sd;o.y+=o.vy*sd;var a2=170*(o.th-o.h)-2*.86*13*o.vh;o.vh+=a2*sd;o.h+=o.vh*sd;}
   o.a+=(ta-o.a)*Math.min(1,dt*9);if(o.gone&&o.a<.02)delete LANE[k];});},
 frame:function(dt){itemStep(IX.items,dt);IX.step(dt);var g=G,q=IX.box();if(!g||!CW)return;
  g.setTransform(DPR,0,0,DPR,0,0);g.clearRect(0,0,CW,CH);
  var sort=ST.sort,wide=CW>=900;
  /* the lanes: a floor line, the name, the rung pips, stress lines on the dwell */
  LM.lanes.forEach(function(l){var o=LANE[l.key];if(!o)return;var c=l.color,al=o.a,y=o.y,h=o.h,on=l.active;
   if(ST.hot===l.key){g.fillStyle=rgba(c,.08*al);g.fillRect(4,y,CW-8,h);}
   g.beginPath();g.moveTo(q.x0,y+h-1);g.lineTo(q.x1,y+h-1);g.strokeStyle=rgba(c,(on?.24:.07)*al);g.lineWidth=1;g.stroke();
   var ly=y+h*.6,fs=h<15?11:12;g.textBaseline='middle';
   /* a lane too thin to carry a name carries its ring only, never a name over its neighbour's */
   if(h<12){if(h>=6){g.beginPath();g.arc(15,y+h/2,Math.min(4,h/2-1),0,TAU);g.strokeStyle=rgba(c,.4*al);g.lineWidth=1.2;g.stroke();}}
   else{
   if(l.icon){g.save();g.translate(10,ly-7);g.scale(14/24,14/24);g.strokeStyle=rgba(c,al);g.lineWidth=1.8*24/14;g.lineJoin='round';g.lineCap='round';g.stroke(iconPath(l.icon));g.restore();}
   else{g.beginPath();g.arc(15,ly,4,0,TAU);g.strokeStyle=rgba(c,(on?1:.45)*al);g.lineWidth=1.6;g.stroke();}
   g.fillStyle=rgba(on?mix(c,[255,255,255],.12):c,(on?1:.6)*al);g.font='600 '+fs+'px Inter,system-ui,sans-serif';g.textAlign='left';g.fillText(l.label,26,ly);}
   if(h>=11)for(var i=0;i<10;i++){var lit=i<Math.round(l.rung);g.fillStyle=lit?rgba(c,al):rgba(c,(i>=SRC_ASK-1?.3:.12)*al);g.fillRect(CW-GUT_R+8+i*5,ly-5,3,10);}
   if(LM.dwell===l.key&&l.rung>=1){var str=Math.min(1,l.rung/10),gp=3.2-1.1*str,f=still()?.5:((performance.now()/1400)%1);
    for(var k=0;k<3;k++){var pos=k+f,sa=str*Math.sin(Math.PI*pos/3)*.45*al;if(sa<.02)continue;
     [-1,1].forEach(function(sg){var yy=y+h*.5+sg*(h*.18+pos*gp);g.beginPath();g.moveTo(q.x0,yy);g.lineTo(q.x1,yy);g.strokeStyle=rgba(c,sa);g.lineWidth=1;g.stroke();});}}});
  g.save();g.beginPath();g.rect(q.x0,0,q.x1-q.x0+2,CH);g.clip();
  /* the floor: every word read, a tick. The ones it kept are in their colour */
  var dx=IX.dx(),tw=Math.max(1.5,dx-(dx>8?4:2));
  ST.toks.forEach(function(o,j){var x=IX.xOf(j);if(x<q.x0-8)return;g.fillStyle=o.m?(o.m.bn?sc(o.m.bn):'#7EB8D4'):'#3E3C39';g.fillRect(x,CH-FLOOR+6,tw,o.m?9:6);});
  /* the bars */
  var pts=[];
  Object.keys(IX.items).forEach(function(k){var it=IX.items[k],m=it.m,g1=Math.max(0,it.g);if(g1<.01||m.t0<0)return;
   var x=IX.xOf(m.t0),x2=IX.xOf(m.t1)+tw;
   if(m.coh){g.fillStyle=rgba('#7EB8D4',.9);g.fillRect(x,CH-FLOOR+2-10*g1,x2-x,3);return;}
   var lk=LM.keyOf(m),o=lk&&LANE[lk];if(!o)return;
   var c=sc(m.bn),hh=Math.max(3,g1*(0.22+0.78*m.depth)*o.h*.82),base=o.y+o.h-1,al=o.a;
   if(m.neg){g.strokeStyle=rgba(c,.55*al);g.setLineDash([2,2]);g.strokeRect(x+.5,base-hh+.5,x2-x-1,hh-1);g.setLineDash([]);}
   else{g.fillStyle=rgba(c,al);g.fillRect(x,base-hh,x2-x,hh);
    if(m.mod){var hb=hh/m.mod.f;g.fillStyle=rgba(mix(c,[255,255,255],.55),al);g.fillRect(x,base-hh,x2-x,hh-hb);}}
   pts.push({it:it,m:m,x:(x+x2)/2,y:base-hh,g:g1,c:c});});
  pts.sort(function(a,b){return a.m.s-b.m.s;});
  /* the route over the bars, Route's dashed trajectory, grown as each word lands */
  g.lineWidth=1.6;g.setLineDash([4,4]);
  for(var i=1;i<pts.length;i++){var a=pts[i-1],b2=pts[i],gg=Math.max(0,Math.min(1,b2.g));if(gg<.01)continue;
   var grd=g.createLinearGradient(a.x,a.y,b2.x,b2.y);grd.addColorStop(0,rgba(a.c,a.m.neg?.3:.9));grd.addColorStop(1,rgba(b2.c,b2.m.neg?.3:.9));
   g.strokeStyle=grd;g.beginPath();var mx=(b2.x-a.x)/2;g.moveTo(a.x,a.y);
   var N=18;for(var s2=1;s2<=Math.round(N*gg);s2++){var tt=s2/N,u=1-tt;
    var xx=u*u*u*a.x+3*u*u*tt*(a.x+mx)+3*u*tt*tt*(b2.x-mx)+tt*tt*tt*b2.x,yy=u*u*u*a.y+3*u*u*tt*a.y+3*u*tt*tt*b2.y+tt*tt*tt*b2.y;g.lineTo(xx,yy);}
   g.stroke();}
  g.setLineDash([]);
  /* the stations on the line, and the newest one lit */
  pts.forEach(function(p,i){var r=2.6+2.4*p.m.depth;
   if(i===pts.length-1){var hg=g.createRadialGradient(p.x,p.y,0,p.x,p.y,15);hg.addColorStop(0,rgba(p.c,.45));hg.addColorStop(1,rgba(p.c,0));g.fillStyle=hg;g.beginPath();g.arc(p.x,p.y,15,0,TAU);g.fill();}
   g.beginPath();g.arc(p.x,p.y,r,0,TAU);g.fillStyle='#101010';g.fill();if(p.m.neg)g.setLineDash([2,2]);g.strokeStyle=p.m.neg?rgba(p.c,.5):p.c;g.lineWidth=1.6;g.stroke();g.setLineDash([]);});
  /* the words: the heaviest always, the rest where there is room */
  var kink=null;pts.forEach(function(p){if(!p.m.neg&&p.m.amt!=null&&(!kink||p.m.amt>kink.m.amt))kink=p;});
  var placed=[];g.font='500 12px Inter,system-ui,sans-serif';g.textAlign='center';g.textBaseline='bottom';
  var order=pts.slice().sort(function(a,b){return (b===kink)-(a===kink)||b.m.depth-a.m.depth;});
  order.forEach(function(p){if(p.m.neg&&!wide)return;if(p!==kink&&!wide&&dx<12)return;if(p.g<.6)return;
   var w=g.measureText(p.m.txt).width+6,x0=p.x-w/2,y1=p.y-6,y0=y1-14;
   if(x0<q.x0||x0+w>q.x1+2||y0<0)return;
   if(placed.some(function(r){return !(x0+w<r[0]||x0>r[2]||y1<r[1]||y0>r[3]);}))return;
   placed.push([x0,y0,x0+w,y1]);g.fillStyle=p.m.neg?'rgba(148,144,138,.9)':mix(p.c,[255,255,255],.15);g.fillText(p.m.txt,p.x,y1);});
  var N2=ST.toks.length;if(N2){var px=IX.xOf(N2-1)+dx;g.fillStyle='rgba(126,184,212,.55)';g.fillRect(px,q.y0,1,CH-q.y0-6);}
  g.restore();
  g.fillStyle='rgba(148,144,138,.9)';g.font='12px Inter,system-ui,sans-serif';g.textAlign='left';g.textBaseline='middle';
  g.fillText('every word',26,CH-FLOOR/2+3);}};
function itemStep(items,dt){var snap=still();
 Object.keys(items).forEach(function(k){var it=items[k],t=it.alive&&it.landed?1:0;
  if(snap){it.g=t;it.gv=0;}else{var a=220*(t-it.g)-2*.55*14.8*it.gv;it.gv+=a*dt;it.g+=it.gv*dt;}
  if(!it.alive&&it.g<0.01&&Math.abs(it.gv)<0.01)delete items[k];});}
function itemSync(items){var now={};ST.marks.forEach(function(m){now[m.key]=m;
  if(!items[m.key])items[m.key]={m:m,g:0,gv:0,alive:true,landed:false};
  else{items[m.key].m=m;items[m.key].alive=true;}});
 Object.keys(items).forEach(function(k){if(!now[k])items[k].alive=false;});}
function itemLand(items,m){var it=items[m.key];if(it){it.landed=true;it.at=performance.now();}}

/* the springs the prompt gauge and the lanes read: the rung per seat */
var SEAT={};BN.forEach(function(b){SEAT[b]={rgT:0};});
function SEATS_T(){var h=ST.heard,rgs={};(h&&h.seats||[]).forEach(function(s){rgs[s.band]=s.rung;});BN.forEach(function(b){SEAT[b].rgT=rgs[b]||0;});}

/* ---- the flight: a scored word leaves the sentence and lands in its lane ---- */
function fly(m,delay){
 var mk=$('hl').querySelector('mark[data-k="'+(window.CSS&&CSS.escape?CSS.escape(m.key):m.key)+'"]'),to=IX.target(m);
 if(!mk||!to){IX.land(m);return;}
 var r=mk.getBoundingClientRect(),vh=innerHeight;
 if(r.bottom<0||r.top>vh||to.y<0||to.y>vh){setTimeout(function(){IX.land(m);},delay+FLY_MS);return;}
 var el=document.createElement('div');el.className='flt';el.style.setProperty('--c',m.bn?sc(m.bn):'#7EB8D4');
 el.textContent=m.txt;document.body.appendChild(el);
 var w=el.offsetWidth,hh=el.offsetHeight,x0=r.left+r.width/2-w/2,y0=r.top+r.height/2-hh/2,x1=to.x-w/2,y1=to.y-hh/2;
 var mx=(x0+x1)/2,my=Math.min(y0,y1)-40;
 el.animate([{transform:'translate('+x0+'px,'+y0+'px) scale(1)',opacity:0},
  {transform:'translate('+x0+'px,'+y0+'px) scale(1)',opacity:1,offset:.08},
  {transform:'translate('+mx+'px,'+my+'px) scale(.96)',opacity:1,offset:.55},
  {transform:'translate('+x1+'px,'+y1+'px) scale(.72)',opacity:0}],
  {duration:FLY_MS,delay:delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'})
  .onfinish=function(){el.remove();IX.land(m);};}

/* ---- the counter under the chart ---- */
function paintCtr(){var toks=ST.toks,tg=ST.marks.length,ng=ST.marks.filter(function(m){return m.neg;}).length;
 $('ctr').textContent=toks.length?(toks.length+' words read, '+tg+' kept'+(ng?', '+ng+' set aside as negated':'')):'';}

/* ============================================================
   THE LIST, in the lanes' order, so a sort moves the chart and the list
   together. Inferred imprints fold to one pill per seat and charge, the
   shipped round GR rule: four addresses the words did not name are one
   reading, not four findings.
   ============================================================ */
var IMP_SEEN={};
function svgIcon(d){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+d+'"/></svg>';}
function paintVault(){var box=$('imps');
 $('lshd').textContent='The vault, what you have released';
 box.innerHTML=ST.vault.length?ST.vault.map(function(v){return '<div class="grp" style="--c:'+sc(v.n.b)+'"><div class="ghd"><b><span class="ring" style="--c:'+sc(v.n.b)+'"></span>'+esc(v.n.k)+'</b><em>'+esc(v.n.b)+', '+v.t.toTimeString().slice(0,5)+'</em></div></div>';}).join('')
  :'<p class="none">Nothing released yet. What a release runs is kept here.</p>';}
function paintImprints(){
 if(ST.showVault){paintVault();return;}
 var p=ST.parse,box=$('imps'),o='',n=p?p.imprints.length:0;
 $('pend').textContent=n?n+' pending':(ST.set.trim()?'Nothing kept yet':(ST.committed.length?'Committed':'Nothing read yet'));
 $('lshd').textContent='Pending imprints, by '+SORTS.filter(function(s){return s[0]===ST.sort;})[0][1].toLowerCase();
 $('chopen').textContent=n?'List '+n:'List';
 /* THE EMPTY STATE SAYS WHAT IS TRUE. After a commit the box is empty and the
    person has just written, so "you have not written anything yet" would be
    the false empty state the shipped ui/imprints.js already records. */
 var wrote=ST.committed.length;
 if(!n){box.innerHTML='<p class="none">'+(ST.set.trim()?'Nothing in this entry reads as held yet. Keep writing, or write where you felt it.'
   :(wrote?'Your last entry is in the field and its addresses are queued in the release. The next entry gathers here.':'You have not written anything yet. Whatever you write gets pulled apart and collected here.'))+'</p>';IMP_SEEN={};return;}
 var heardB={};(ST.heard.seats||[]).forEach(function(s){heardB[s.band]=s;});
 var seen={};
 LM.lanes.forEach(function(l){if(!l.imps||!l.imps.length)return;var c=l.color,pills=[],fold={};
  l.imps.slice().sort(function(a,b){return b.amt-a.amt;}).forEach(function(im){
   if(im.inferred){var fk=im.band+':'+im.fetter;if(!fold[fk]){fold[fk]={label:ST.sort==='charge'?im.band:im.fetter,amt:0,inf:true,band:im.band};pills.push(fold[fk]);}fold[fk].amt+=im.amt;}
   else pills.push({label:im.name,amt:im.amt,inf:false,band:im.band});});
  /* THE TWO HALVES OF THE ENGINE DISAGREE, AND IT IS SHOWN. A seat whose only
     words were negated is charged by parseStory and set aside by srcHear. */
  var note='';
  if(ST.sort!=='charge'){var only=!heardB[l.band]?ST.marks.filter(function(m){return m.bn===l.band&&m.neg;}):[];
   note=only.length?'<em class="warn">only from '+only.map(function(m){return '&ldquo;'+esc(ST.set.slice(m.negFrom!=null?m.negFrom:m.s,m.e))+'&rdquo;';}).join(', ')+'</em>'
    :'<em>'+pills.length+' pending</em>';}
  else note='<em>at '+l.bands.map(function(b){return srcSeatSay(b).replace(/^the /,'the ');}).join(', ')+'</em>';
  var sym=l.icon?svgIcon(l.icon):'<span class="ring" style="--c:'+c+'"></span>';
  o+='<div class="grp'+(ST.hot===l.key?' hot':'')+'" data-k="'+esc(l.key)+'" style="--c:'+c+'"><div class="ghd"><b>'+sym+esc(l.label)+'</b>'+note+'</div><div class="pills">'
   +pills.map(function(q){var pc=sc(q.band),k=l.key+':'+q.label;seen[k]=1;
    return '<span class="pill'+(q.inf?' inf':'')+(IMP_SEEN[k]?'':' new')+'" style="--c:'+pc+'" title="'+(q.inf?'The seat was read. The words did not name this address.':'Named by the words.')+'">'
     +'<span class="ring"></span>'+esc(q.label)+' <small>+'+(Math.round(q.amt*10)/10)+'</small></span>';}).join('')+'</div></div>';});
 IMP_SEEN=seen;box.innerHTML=o;
 box.querySelectorAll('.grp').forEach(function(gp){gp.onmouseenter=function(){setHot(gp.getAttribute('data-k'));};gp.onmouseleave=function(){setHot(null);};});}
function setHot(k){if(ST.hot===k)return;ST.hot=k;document.querySelectorAll('#imps .grp').forEach(function(gp){gp.classList.toggle('hot',gp.getAttribute('data-k')===k);});}
function paintSort(){var el=$('sort');
 el.innerHTML='<span class="eb">Sort</span>'+SORTS.map(function(s){return '<button data-s="'+s[0]+'" aria-pressed="'+(ST.sort===s[0])+'">'+s[1]+'</button>';}).join('');
 el.querySelectorAll('button').forEach(function(b){b.onclick=function(){ST.sort=b.getAttribute('data-s');paintSort();IX.relayout();paintImprints();if(ST.l==='h')setFocus('read');};});}

/* ============================================================
   THE RELEASE. What it takes off, before it runs. relCoolDown's own
   arithmetic, ui/release.js: an address at weight w (0 to 100) loses 21
   percent of w plus 2, and is cleared at 6 or under.

   From "This story" by default now, because the chain he ruled is journal,
   imprint, release: what you wrote is what you are offered to let go. After a
   commit the entry is gone from the box and its addresses stay queued.
   ============================================================ */
function foundNow(){var found=[];if(ST.parse)ST.parse.imprints.forEach(function(im){var n=BY[im.node];if(n&&found.indexOf(n)<0)found.push(n);});
 return found.length?found:ST.lastFound;}
function relModel(){
 var r=compute(),live=r.loaded.slice().sort(function(a,b){return b.sq-a.sq;}),found=foundNow();
 var story=ST.rel.src==='story'&&found.length,pool=story?found.slice().sort(function(a,b){return b.sq-a.sq;}):live,take=pool.slice(0,ST.rel.n);
 /* SELECTIONS. Every queued address starts selected; a tap takes it out of the run */
 var sel=take.filter(function(n){return ST.off[n.i]!==true;});
 var bud=meterBudget(PROF),chans=CHANS.map(function(c){return c[0]+c[2];});
 var plan=(sel.length&&bud.cap>0)?meterPlan(PROF,sel.map(function(n){return n.i;}),chans,bud.cap):[];
 return {found:found,story:!!story,take:take,sel:sel,plan:plan,secs:Math.round(plan.length*RUN_SPEED_S[ST.rel.pace])};}
var REL_SEEN={};
function fmtT(s){var m=Math.floor(s/60),r=s%60;return m+':'+(r<10?'0':'')+r;}
/* THE RELEASE, CUT. His direction this round: selections, pace, pattern
   count, and a run button. No lead sentence, no per address weights, no
   quoted thought line, no cost block. */
function paintRelease(){
 var el=$('rl');if(ST.run){paintRun();return;}
 var M=relModel(),o='';
 o+='<div class="rl-hd"><span class="ring" style="--c:var(--glow)"></span><h3>Release</h3></div>';
 o+='<div class="rl-sum">'+(M.sel.length?'<b>'+esc(M.sel[0].k)+(M.sel.length>1?' and '+(M.sel.length-1)+' more':'')+'</b><span>'+M.plan.length+' patterns</span>'
  :'<b>Release</b><span>Nothing selected</span>')+'</div>';
 o+='<div class="rl-mid">';
 if(!M.take.length)o+='<p class="none">Nothing is held above the line yet, so there is nothing to release.</p>';
 else{var seen={};
  o+='<ol class="rl-q">'+M.take.map(function(n){var c=sc(n.b),on=ST.off[n.i]!==true;seen[n.i]=1;
   return '<li><button class="rq-b'+(REL_SEEN[n.i]?'':' new')+'" data-i="'+n.i+'" aria-pressed="'+on+'" style="--c:'+c+'"><span class="ring"></span><span class="nm">'+esc(n.k)+'</span><span class="sb">'+esc(n.b)+'</span></button></li>';}).join('')+'</ol>';
  REL_SEEN=seen;}
 o+='</div><div class="rl-foot">';
 o+='<div class="rl-pace"><span class="eb">Pace</span>'+Object.keys(RUN_SPEED_S).map(function(k){return '<button class="seg" data-pace="'+k+'" aria-pressed="'+(ST.rel.pace===k)+'">'+k+'</button>';}).join('')+'</div>';
 o+='<div class="rl-count">'+M.plan.length+'<small>patterns</small></div>';
 o+='<button class="rl-go" id="rlgo"'+(M.plan.length?'':' disabled')+'>Run a release</button></div>';
 el.innerHTML=o;relArt(M);
 el.querySelectorAll('[data-i]').forEach(function(b){b.onclick=function(){var i=+b.getAttribute('data-i');ST.off[i]=ST.off[i]===true?false:true;paintRelease();};});
 el.querySelectorAll('[data-pace]').forEach(function(b){b.onclick=function(){ST.rel.pace=b.getAttribute('data-pace');paintRelease();};});
 var go=$('rlgo');if(go)go.onclick=function(){startRun(M);};}
/* lit from within, in the heaviest queued seat's colour, as bright as that address is heavy */
function relArt(M){var el=$('rl');
 if(M.sel.length){el.style.setProperty('--glow',sc(M.sel[0].b));el.style.setProperty('--lux',(0.15+0.2*M.sel[0].sq/10).toFixed(2));}
 else{el.style.setProperty('--glow','#7EB8D4');el.style.setProperty('--lux','.1');}}
function startRun(M){ST.run={M:M,i:0};if(ST.l==='h')setFocus('release');paintRun();clearInterval(ST.runT);
 ST.runT=setInterval(function(){if(!ST.run)return;ST.run.i++;if(ST.run.i>=ST.run.M.plan.length){finishRun();return;}paintRun();},RUN_SPEED_S[ST.rel.pace]*1000);}
/* THE VAULT: what a run has released. Here a run is a preview and releases
   nothing, so the vault holds what the previews ran, in this page only. */
function finishRun(){if(!ST.run)return;clearInterval(ST.runT);var M=ST.run.M;ST.run=null;
 var at=new Date();M.sel.forEach(function(n){ST.vault.unshift({n:n,t:at,p:M.plan.length});});
 paintVaultN();paintRelease();if(ST.showVault)paintImprints();}
function paintVaultN(){$('vn').textContent=ST.vault.length;}
function paintRun(){var R=ST.run,M=R.M,key=String(M.plan[R.i]).split(':'),n=BY[+key[0]],ch=CHANS.filter(function(c){return c[0]+c[2]===key[1];})[0]||CHANS[0];
 var L=typeof relLine==='function'?relLine(n,key[1],+key[2]||0):null,c=sc(n.b),el=$('rl');
 el.innerHTML='<div class="rl-hd"><span class="ring" style="--c:'+c+'"></span><h3>Release</h3></div>'
  +'<div class="rl-sum"><b>'+esc(n.k)+'</b><span>'+(R.i+1)+' of '+M.plan.length+' patterns</span></div>'
  +'<div class="rl-mid">'
  +'<div class="rl-run" style="--c:'+c+'"><div class="nd">'+esc(n.k)+'</div><div class="chn">'+ch[1]+' '+ch[2]+', line '+((+key[2]||0)+1)+'</div>'
  +'<div class="pg"><i style="width:'+((R.i+1)/M.plan.length*100).toFixed(0)+'%"></i></div>'
  +'<div class="chn" style="margin-top:6px">'+(R.i+1)+' of '+M.plan.length+' patterns, '+fmtT(Math.max(0,Math.round((M.plan.length-R.i-1)*RUN_SPEED_S[ST.rel.pace])))+' left. A preview: nothing is released here.</div></div></div>'
  +'<div class="rl-foot"><button class="rl-go stop" id="rlstop">Stop</button></div>';
 relArt(M);$('rlstop').onclick=function(){clearInterval(ST.runT);ST.run=null;paintRelease();};}

/* ============================================================
   THE FOUR LAYOUTS. A layout is a tree of rows and columns and the panels
   are moved into it, so all four are the same components and the only thing
   that differs between them is the arrangement being proposed.
   ============================================================ */
var LAYOUTS={
 /* E. CHAIN. Write, imprint, release, left to right: the content chain made spatial */
 e:{d:'row',k:[{d:'col',f:'1.25 1 0',k:[{id:'pe',f:'0 0 auto'},{id:'jr',f:'1 1 0'}]},
   {d:'col',f:'1 1 0',k:[{id:'ch',f:'0 0 46%'},{id:'ls',f:'1 1 0'}]},
   {d:'col',f:'0 0 360px',k:[{id:'rl',f:'1 1 0'}]}]},
 /* F. BAND. The instrument spans the page on top; the words get the width */
 f:{d:'col',k:[{id:'ch',f:'0 0 34%'},
   {d:'row',f:'1 1 0',k:[{d:'col',f:'1 1 0',k:[{id:'pe',f:'0 0 auto'},{id:'jr',f:'1 1 0'}]},{d:'col',f:'0 0 380px',k:[{id:'ls',f:'1 1 0'}]},{d:'col',f:'0 0 360px',k:[{id:'rl',f:'1 1 0'}]}]}]},
 /* G. DOCK. Two working columns, the release a bar across the foot */
 g:{d:'col',k:[{d:'row',f:'1 1 0',k:[{d:'col',f:'1 1 0',k:[{id:'pe',f:'0 0 auto'},{id:'jr',f:'1 1 0'}]},
    {d:'col',f:'0 0 44%',k:[{id:'ch',f:'0 0 52%'},{id:'ls',f:'1 1 0'}]}]},{id:'rl',f:'0 0 104px'}]},
 /* H. FLOW. Three columns; the one you are working in gets the room */
 h:{d:'row',k:[{d:'col',key:'w',f:'1.5 1 0',k:[{id:'pe',f:'0 0 auto'},{id:'jr',f:'1 1 0'}]},
   {d:'col',key:'r',f:'1 1 0',k:[{id:'ch',f:'0 0 50%'},{id:'ls',f:'1 1 0'}]},
   {d:'col',key:'x',f:'0 0 300px',k:[{id:'rl',f:'1 1 0'}]}]}};
var FOCUS={write:{w:'1.5 1 0',r:'1 1 0',x:'0 0 300px'},read:{w:'1 1 0',r:'1.55 1 0',x:'0 0 300px'},release:{w:'1 1 0',r:'1 1 0',x:'0 0 430px'}};
var COLS={},PANELS={};
function mount(spec,parent){
 if(spec.id){var el=PANELS[spec.id];el.style.flex=spec.f||'';parent.appendChild(el);return;}
 var d=document.createElement('div');d.className=spec.d;if(spec.f)d.style.flex=spec.f;if(spec.key)COLS[spec.key]=d;
 parent.appendChild(d);spec.k.forEach(function(c){mount(c,d);});}
function setLayout(l){if(!LAYOUTS[l])l='e';ST.l=l;document.body.setAttribute('data-l',l);
 document.querySelectorAll('.tb [data-l]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-l')===l?'true':'false');});
 var app=$('app');['pe','jr','ch','ls','rl'].forEach(function(id){if(!PANELS[id])PANELS[id]=$(id);});
 var keep=Object.keys(PANELS).map(function(k){return PANELS[k];});COLS={};
 app.innerHTML='';var root=document.createElement('div');root.className=LAYOUTS[l].d;root.style.flex='1 1 auto';app.appendChild(root);
 LAYOUTS[l].k.forEach(function(c){mount(c,root);});
 keep.forEach(function(el){if(!el.parentNode)app.appendChild(el);});
 if(location.hash.slice(1)!==l)history.replaceState(null,'','#'+l);
 applyFocus();paintNotes();requestAnimationFrame(function(){sizeCanvas();IX.relayout();});}
/* H only: focus follows the loop. Typing is write, touching the imprints is
   read, a commit or a run is release. Every column stays on screen. */
function setFocus(f){ST.focus=f;applyFocus();}
function applyFocus(){var l=ST.l,f=ST.focus;
 ['jr','ch','ls','rl'].forEach(function(id){$(id).classList.remove('cmp');});
 $('rl').classList.toggle('dockbar',l==='g');
 if(l!=='h')return;
 var F=FOCUS[f];if(COLS.w){COLS.w.style.flex=F.w;COLS.r.style.flex=F.r;COLS.x.style.flex=F.x;}
 if(f!=='release')$('rl').classList.add('cmp');
 if(phone()){if(f!=='read'){$('ch').classList.add('cmp');$('ls').classList.add('cmp');}if(f!=='write')$('jr').classList.add('cmp');}
 setTimeout(sizeCanvas,520);}

/* ============================================================
   NOTES, and the simulation's own numbers when the build carried them in
   ============================================================ */
var IDEA={
 e:'<b>E. Chain.</b> Three columns, left to right in the order the content moves: what you write, what it imprints, what you release. Nothing is above anything else, so nothing is below the fold.',
 f:'<b>F. Band.</b> The instrument spans the whole page along the top, because its x axis is your text and the text is long: at this width every kept word is named on the chart. The journal, the list and the release sit under it.',
 g:'<b>G. Dock.</b> The journal and the instrument share the top. The release is a bar across the foot of the page, the one place that is never scrolled away, on the phone as well.',
 h:'<b>H. Flow.</b> Three columns, and the one you are working in gets the room. Typing widens the journal, touching the imprints widens them, a commit widens the release. Nothing is ever hidden; on the phone the two you are not in sit compact.'};
function pct(x){return Math.round(x*100)+'%';}
function paintNotes(){var v=ST.l,o='<h2>This layout</h2><p>'+IDEA[v]+'</p>';
 o+='<h2>The imprints instrument: Trace, with Route\'s line</h2>'
  +'<p>Trace is the base, on his word this round. From Trace: every word you write is a tick on the floor, left to right in the order you wrote it, and a word it kept rises into its lane as tall as it weighs. From Route: a dashed line runs from each kept word to the next, so the path the story took through the body is drawn over the bars; the lane the story keeps returning to carries stress lines, and the newest word is lit. The heaviest word is named on the chart, and where the chart is wide every kept word is.</p>'
  +'<p><b>Sort moves the chart and the list together.</b> Seat stands the lanes in body order, crown at the top. When heard puts the first seat the story reached at the top. Weight puts the heaviest reading at the top. Came back puts the seat nearest a question at the top; that is the rung, the ten pips at the right of each lane. Charge swaps the lanes for the charge each imprint carries, with its symbol, which is the shipped Imprints tab\'s own Charge grouping. The lanes slide to their new places, and the route re-threads through them.</p>'
  +'<p><b>Bank and Vault</b>, the two icons in its header. The bank goes to the main Imprints page, every imprint you hold rather than this entry. The vault shows what has been released, apart from what is pending. A run here is a preview, so the vault fills with what the previews ran, in this page only.</p>'
  +'<p><b>The release is cut to his direction this round:</b> the addresses as selections, pace, the pattern count, and Run. No lead sentence, no per address weights, no quoted thought line, no cost block.</p>';
 if(SIMDATA&&SIMDATA.layouts)o+=simHTML(SIMDATA);
 o+='<p style="color:var(--dim)">Engine: '+esc(PROTO_STAMP.engine)+'. Built '+esc(PROTO_STAMP.when)+'. Requests made by this page: none.</p>';
 $('notes').innerHTML=o;}
function simHTML(D){var L=D.layouts,keys=Object.keys(L);var o='<h2>The simulation</h2><p>'+esc(D.method)+'</p>';
 o+='<h3>Measured on the page, per layout</h3><div class="scroll"><table><tr><th>Layout</th><th>All three on the first screen, 1600</th><th>All three on the first screen, 390</th><th>Controls on screen, 1600</th><th>Scroll to Run, 390</th><th>Pointer effort, write to run, 1600</th></tr>'
  +keys.map(function(k){var m=L[k];return '<tr><td>'+esc(m.name)+'</td><td>'+(m.fold1600?'yes':'no')+'</td><td>'+(m.fold390?'yes':'no')+'</td><td class="n">'+m.choices1600+'</td><td class="n">'+m.scroll390+'px</td><td class="n">'+m.fitts1600.toFixed(1)+' bits</td></tr>';}).join('')+'</table></div>';
 o+='<h3>The panel, a thousand people drawn from the ICPs</h3><div class="scroll"><table><tr><th>Layout</th><th>Wrote</th><th>Understood the imprints</th><th>Reached the release</th><th>Ran it</th><th>Would come back</th></tr>'
  +keys.map(function(k){var f=L[k].funnel;return '<tr><td>'+esc(L[k].name)+'</td>'+['wrote','read','reach','ran','back'].map(function(s){return '<td class="n">'+pct(f[s])+'</td>';}).join('')+'</tr>';}).join('')+'</table></div>';
 if(D.findings)o+='<h3>What the panel found</h3><ul>'+D.findings.map(function(f){return '<li>'+esc(f)+'</li>';}).join('')+'</ul>';
 return o;}

/* ============================================================
   THE DEMO, THE FRAME LOOP, BOOT
   ============================================================ */
var EXAMPLE='My manager moved the deadline again and I said yes. My jaw was tight the whole call and I did not say anything. '
 +'I was not scared, I was angry. Afterwards I sat in the car and my throat was really tight. '
 +'I feel ashamed that I care this much. I slept well though, and I was grateful for the walk home.';
var DEMO=null;
function demo(txt,cps){stopDemo();var ta=$('ta'),i=0;ta.value='';onText('',true);
 var step=function(){if(i>=txt.length){DEMO=null;onText(ta.value,true);return;}var ch=txt.charAt(i++);ta.value+=ch;onText(ta.value);
  DEMO=setTimeout(step,ch==='.'?260:(ch===' '?46:(cps||32)));};step();}
function stopDemo(){clearTimeout(DEMO);DEMO=null;}
var LAST=0;
function loop(ts){var dt=Math.min(.05,(ts-(LAST||ts))/1000);LAST=ts;IX.frame(dt);requestAnimationFrame(loop);}
function commit(){if(!ST.parse||!ST.parse.imprints.length)return;
 var found=foundNow().slice(),k=ST.parse.imprints.length;
 applyStory(ST.set);ST.committed.push({bands:ST.parse.bands});ST.lastFound=found;stopDemo();$('ta').value='';ST.passed=false;
 ST.status='Committed. '+k+(k===1?' imprint':' imprints')+' written to the field.';onText('',true);
 /* on the phone the release stays a bar with Run on it; widening it there
    would push Run off the first screen, which is the thing H exists to stop */
 if(ST.l==='h')setFocus(phone()?'write':'release');paintRelease();
 setTimeout(function(){ST.status='';paintCount();},2400);}
function boot(){
 CV=$('cv');G=CV.getContext('2d');
 var sel=$('who');sel.innerHTML=ROSTER.map(function(n){return '<option value="'+n+'">'+n+'\'s field</option>';}).join('');
 sel.onchange=function(){loadWho(sel.value);ST.lastFound=[];paintRelease();};
 loadWho('Nkem');
 var ta=$('ta');
 ta.addEventListener('input',function(){stopDemo();onText(ta.value);});
 ta.addEventListener('scroll',function(){$('hl').scrollTop=ta.scrollTop;});
 ta.addEventListener('blur',function(){if(ST.set!==ST.text)onText(ST.text,true);});
 ta.addEventListener('focus',function(){if(ST.l==='h')setFocus('write');});
 $('ch').addEventListener('pointerdown',function(){if(ST.l==='h'&&ST.focus!=='read')setFocus('read');});
 $('ls').addEventListener('pointerdown',function(){if(ST.l==='h'&&ST.focus!=='read')setFocus('read');});
 $('rl').addEventListener('pointerdown',function(e){if(ST.l==='h'&&ST.focus!=='release'&&!(e.target&&e.target.id==='rlgo'))setFocus('release');});
 CV.addEventListener('pointermove',function(e){var r=CV.getBoundingClientRect(),y=e.clientY-r.top,k=null;
  LM.lanes.forEach(function(l){var o=LANE[l.key];if(o&&l.active&&y>=o.y&&y<o.y+o.h)k=l.key;});setHot(k);});
 CV.addEventListener('pointerleave',function(){setHot(null);});
 document.querySelectorAll('.tb [data-l]').forEach(function(b){b.onclick=function(){setLayout(b.getAttribute('data-l'));};});
 $('demo').onclick=function(){demo(EXAMPLE);};
 $('clr').onclick=$('jclr').onclick=function(){stopDemo();ta.value='';ST.passed=false;onText('',true);};
 $('prior').onclick=function(){ST.priorDemo=!ST.priorDemo;this.setAttribute('aria-pressed',ST.priorDemo);stRead();paintAfter();};
 $('still').onclick=function(){var on=!document.body.classList.contains('still');document.body.classList.toggle('still',on);this.setAttribute('aria-pressed',on);};
 $('gonotes').onclick=function(){$('notes').scrollIntoView({behavior:still()?'auto':'smooth'});};
 $('commit').onclick=commit;
 $('chopen').onclick=function(){setFocus('read');};
 /* THE BANK goes to the main Imprints page, the whole record rather than this entry */
 $('bank').onclick=function(){$('ctr').textContent='In the product the bank opens the Imprints page, every imprint you hold.';};
 $('vault').onclick=function(){ST.showVault=!ST.showVault;this.setAttribute('aria-pressed',ST.showVault);if(ST.l==='h')setFocus('read');paintImprints();};
 if(window.ResizeObserver)new ResizeObserver(function(){sizeCanvas();IX.relayout();}).observe($('stage'));
 window.addEventListener('resize',function(){applyFocus();});
 window.addEventListener('hashchange',function(){setLayout(location.hash.slice(1));});
 paintSort();setLayout((location.hash||'#e').slice(1));
 onText('',true);paintAfter();
 requestAnimationFrame(loop);}

/* the hook the screenshot and measuring harness drives, so a frame is a state */
window.PROTO={setL:setLayout,demo:demo,commit:commit,focus:setFocus,
 type:function(t){stopDemo();$('ta').value=t;onText(t,true);},
 who:function(n){loadWho(n);$('who').value=n;ST.lastFound=[];paintRelease();},
 sort:function(s){ST.sort=s;paintSort();IX.relayout();paintImprints();},
 prior:function(on){ST.priorDemo=!!on;$('prior').setAttribute('aria-pressed',!!on);stRead();paintAfter();},
 rel:function(o){Object.assign(ST.rel,o);paintRelease();},run:function(){startRun(relModel());},finishRun:function(){finishRun();},
 vault:function(on){ST.showVault=!!on;$('vault').setAttribute('aria-pressed',!!on);paintImprints();},
 lanes:function(){return LM.lanes.map(function(l){var o=LANE[l.key];return {key:l.key,active:l.active,y:o?Math.round(o.ty):null};});},
 state:function(){var p=ST.parse,imps=p?p.imprints:[],M=relModel(),turn=turnNow();
  return {l:ST.l,marks:ST.marks.length,neg:ST.marks.filter(function(m){return m.neg;}).length,coh:ST.marks.filter(function(m){return m.coh;}).length,
   imprints:imps.length,inferred:imps.filter(function(i){return i.inferred;}).length,
   seats:(ST.heard&&ST.heard.seats||[]).length,turn:turn.move,
   relRows:M.sel.length,relStory:M.story,relPatterns:M.plan.length,relSecs:M.secs};}};
boot();
