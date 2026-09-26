/* ============================================================
   SEVEN SEATS, FOUR WAYS. Prototype over the shipped build, round EQ.
   Not part of the product. Nothing under atuned_src/ is touched.

   His grade on round EL's layout: "It's not quite what I want, the layout
   design is awful, D minus." His criteria, whole: "how are we displaying
   information, what's above the fold, how awesome does it look, is it
   telling a story, can I look at it at a glance and understand what I'm
   supposed to do, right now it's not clear."

   THE MECHANIC IS EL's, CARRIED OVER, NOT REDRAWN. Every function in the
   first half of this file is proto/avatar/seats/seats.js with its body kept:
   the pairs through avRows and readSeat, one gap per seat, the top three by
   real seat load, the release queue the shipped button builds, the writes
   relCoolDown makes, ritFor asked about the gap's own seat, the masks off
   compute().maskRing. What is new is only the second half: five ways to lay
   the same reading out.

     graded   EL as he saw it and graded it, kept as the baseline
     ring     the ring is the page; one action sits in its centre
     three    the top three lead as cards; the ring is a small key
     story    one sentence at a time: who you said, your words, where it
              sits, what to do today
     loop     the core loop is the page's frame; the next station is lit

   A RELEASE ON A WORKED EXAMPLE REFUSES, ruled (ui/release.js). So while
   this layer is on, the release card's last step replays the same writes
   the release makes, on the same queue the card was handed, and nothing is
   saved. The card itself is the shipped one.
   ============================================================ */
window.S4=(function(){
'use strict';
var BANK=window.S4_BANK||{}, PAIRS=window.S4_PAIRS||{};
var ORDER=['root','sacral','solar','heart','throat','eye','crown'];
var NM={root:'Root',sacral:'Sacral',solar:'Solar',heart:'Heart',throat:'Throat',eye:'3rd Eye',crown:'Crown'};
var THE={root:'the root',sacral:'the sacral',solar:'the solar plexus',heart:'the heart',
 throat:'the throat',eye:'the third eye',crown:'the crown'};
var TAU=Math.PI*2, NS=' vector-effect="non-scaling-stroke"';
function col(k){return 'var(--'+k+')';}
function P(n){return (+n).toFixed(2);}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function cl(v,a,b){return Math.max(a,Math.min(b,v));}
function kOf(band){return B2K[band]||'root';}
function theB(band){return THE[kOf(band)];}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function mid(t){t=String(t||'').replace(/\.\s*$/,'');return /^I\b/.test(t)?t:t.charAt(0).toLowerCase()+t.slice(1);}
function bare(t){return String(t||'').replace(/\.\s*$/,'');}

var WHO=[{k:'Sofia'},{k:'Diane'},{k:'Marcus'},{k:'Angela'},{k:'Derek'},{k:'James'},{k:'blank',nm:'Nobody yet'}];
var LAYS=[{k:'told',nm:'Told'},{k:'ring',nm:'Ring'},{k:'three',nm:'Three'},{k:'story',nm:'Story'},{k:'loop',nm:'Loop'},{k:'graded',nm:'Graded, D minus'}];
var ST={on:true, L:'told', leadBy:'weight', who:'James', runs:0, max:14, mode:'cleared', fast:true, sel:null,
 station:'release', pairs:[], log:[], ritDone:false, flash:null, pending:null, runsBy:{}, days:0,
 anim:true, dock:true, clean:false, verdict:false};

/* ================= THE MECHANIC, CARRIED FROM ROUND EL ================= */
function pIndex(nm){for(var i=0;i<PEOPLE.length;i++)if(PEOPLE[i].nm===nm)return i;return 0;}
function applyText(t){
 applyStory(t);verpApply(t);if(typeof leanApply==='function')leanApply(t);
 if(CURP){var ps=parseStory(t);
  CURP.story.entries.push({t:new Date().toISOString(),text:t,imprints:ps.imprints.length,bands:ps.bands});}}
function setPairs(){
 if(!CURP)return;
 CURP.avatar={built:!!ST.pairs.length, at:'2026-09-20T08:00:00Z', reviewedAt:null,
  pairs:ST.pairs.map(function(p){return {be:p.be, notbe:p.notbe};})};}
function reset(){
 loadP(ST.who==='blank'?0:pIndex(ST.who));
 if(CURP){CURP.work={};CURP.story={entries:[]};}
 (BANK[ST.who]||[]).forEach(applyText);
 setPairs();}
function gaps(R){
 var by={}, list=[];
 R.forEach(function(r,i){if(!r.gap)return;var s=r.gap.seat;
  if(!by[s]){by[s]={seat:s,k:kOf(s),load:r.gap.load,at:r.gap.at,clear:r.gap.clear,idx:[]};list.push(by[s]);}
  by[s].idx.push(i);});
 return list;}
function top3(G){return G.filter(function(g){return !g.clear;}).sort(function(a,b){return b.load-a.load;}).slice(0,3);}
function queueFor(seat){
 var at=W.filter(function(n){return n.b===seat&&n.sq>0&&n.cf;}).sort(function(a,b){return b.sq-a.sq;});
 var hot=at.filter(function(n){return n.sq>=4;});
 return (hot.length?hot:at).slice(0,8);}
function write(q){
 var log=[],freed=0;
 q.forEach(function(n){
  var w0=n.sq*10, d=-Math.round(w0*0.21+2), w1=Math.max(0,w0+d);
  freed+=Math.abs(d);
  var share=Math.abs(d)/10/Math.max(1,q.filter(function(x){return x.cf===n.cf;}).length);
  S.charge[n.cf]=clamp((S.charge[n.cf]||0)-share,0,10);
  S.replace[n.cf]=clamp((S.replace[n.cf]||0)+share*0.62,0,10);
  log.push({node:n.i,name:n.k,band:n.b,fetter:n.cf,
   opp:(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'',
   w0:Math.round(w0),d:d,w1:w1,cleared:(w1<=6)});});
 return {log:log,freed:freed};}
function settle(){
 reset(); ST.runsBy={}; ST.days=0;
 for(var i=0;i<ST.runs;i++){
  compute(); var t=top3(gaps(avRows()))[0]; if(!t)break;
  var q=queueFor(t.seat); if(!q.length)break;
  write(q); ST.runsBy[t.seat]=(ST.runsBy[t.seat]||0)+1; ST.days++;}
 ST.log.forEach(function(e){
  compute();
  if(e.t==='story')applyText(e.text);
  else if(e.t==='run'){var q=e.ids.map(function(i){return BY[i];}).filter(function(n){return n&&n.cf;});
   write(q); ST.runsBy[e.seat]=(ST.runsBy[e.seat]||0)+1;}});
 compute();}
function build(who){
 ST.who=who; ST.log=[]; ST.ritDone=false; ST.flash=null; ST.sel=null;
 ST.pairs=(PAIRS[who]||[]).map(function(p){return {be:p.be, notbe:p.notbe, load0:null};});
 /* nothing open below the fold until pressed: the lead action is already
    on the page, and a second copy of it is a second choice */
 ST.station=null;
 var keep=ST.runs; ST.runs=0; reset(); compute();
 var R=avRows();
 ST.pairs.forEach(function(p,i){p.load0=R[i]&&R[i].gap?R[i].gap.load:null;});
 ST.runs=keep; settle();}
function closure(p,r){
 if(!r||!r.gap)return null;
 if(r.gap.clear)return 1;
 if(!p||p.load0==null||p.load0<=0)return 0;
 return cl(1-r.gap.load/p.load0,0,1);}
function seatOpen(b){
 var g=W.filter(function(n){return n.b===b;});
 return g.reduce(function(a,n){return a+Math.min(1,Math.max(0,n.open));},0)/Math.max(1,g.length);}
function ritOf(seat,D){
 try{var c=ritFor({darkB:seat, DQ:D.r.DQ});return c&&c.called?{nm:c.called.nm,min:c.called.min,k:c.called.k}:null;}catch(e){return null;}}

/* the run's own length, the way the shipped card prints it: thought lines in
   the plan times the seconds a line takes, read without starting anything */
function minutesFor(seat){
 var q=queueFor(seat); if(!q.length)return null;
 var keepQ=RUN.queue, pl=0;
 try{RUN.queue=q; pl=(relPlan()||[]).length;}catch(e){pl=0;} RUN.queue=keepQ;
 if(!pl)return null;
 var m=Math.round(pl*2.2/60*10)/10; return m<1?'under a minute':'about '+(m%1?m.toFixed(1):m)+' minutes';}

/* ================= THE READING EVERY LAYOUT DRAWS FROM ================= */
function read(){
 var r=compute(), R=avRows(), G=gaps(R), T=top3(G), pg=avatarProgress(R);
 var res=R.filter(function(x){return !!x.gap;});
 var closed=res.length?res.reduce(function(a,x){return a+closure(ST.pairs[R.indexOf(x)],x);},0)/res.length:0;
 if(ST.sel&&!G.some(function(g){return g.seat===ST.sel;}))ST.sel=null;
 /* the highest ideal: the first pair, the sentence his mechanic starts from */
 var ideal=ST.pairs[0]||null, iRow=R[0]||null;
 var iGap=iRow&&iRow.gap?G.filter(function(g){return g.seat===iRow.gap.seat;})[0]:null;
 /* the lead: the gap a layout asks a person to act on. The heaviest in the
    way, unless the person pressed another one. Story leads with the ideal's
    own seat when it has one, because the story starts from what they said. */
 var lead=null;
 if(ST.sel)lead=G.filter(function(g){return g.seat===ST.sel;})[0]||null;
 if(!lead&&(ST.L==='story'||ST.leadBy==='ideal')&&iGap&&!iGap.clear)lead=iGap;
 if(!lead)lead=T[0]||null;
 return {r:r, R:R, G:G, T:T, pg:pg, closedPct:Math.round(closed*100),
  ideal:ideal, iGap:iGap, lead:lead,
  unresolved:R.filter(function(x){return !x.gap;}).length,
  seats:ORDER.map(function(k){return {k:k,b:K2B[k],pass:r.unread?0:seatOpen(K2B[k])};})};}
/* the pair a gap stands for: the first pair written against that seat */
function pairOf(g){return g?ST.pairs[g.idx[0]]:null;}
/* weight in words, on the product's own line (ui/summary.js): under 4 is
   signal and not yet cost. No bare figure on a first screen. */
function weightWords(g){
 if(!g)return '';
 if(g.clear)return 'Nothing held there now.';
 return g.load>=4?'Held, and it is costing you.':'Held lightly. Signal, not yet cost.';}

/* ================= DRAWING ================= */
function arcD(cx,cy,r,a0,a1){
 if(a1-a0>=TAU-1e-4)
  return 'M'+P(cx+r)+','+P(cy)+' A'+P(r)+','+P(r)+' 0 1 1 '+P(cx-r)+','+P(cy)
   +' A'+P(r)+','+P(r)+' 0 1 1 '+P(cx+r)+','+P(cy);
 var x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1);
 return 'M'+P(x0)+','+P(y0)+' A'+P(r)+','+P(r)+' 0 '+((a1-a0)>Math.PI?1:0)+' 1 '+P(x1)+','+P(y1);}
function gauge(cx,cy,r,v,c,w,op){
 var h='<circle cx="'+P(cx)+'" cy="'+P(cy)+'" r="'+P(r)+'" fill="none" stroke="'+c
  +'" stroke-opacity="'+(op||'.22')+'" stroke-width="'+w+'"'+NS+'/>';
 if(v>0.004)h+='<path d="'+arcD(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.min(1,v)*TAU)
  +'" fill="none" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round"'+NS+'/>';
 return h;}
/* THE GLASS BAR'S RING, as a seat mark: the seat's glyph inside a ring whose
   arc is the weight held there, drawn and never printed. The same grammar as
   proto/glassbar's buttons: a ring, a mark inside it, the value as an arc. */
function seatMark(g,size){
 var k=g?g.k:'root', v=g?(g.clear?0:cl(g.load/10,0,1)):0;
 return '<svg class="s4-mark" viewBox="0 0 48 48" width="'+size+'" height="'+size+'" aria-hidden="true">'
  +gauge(24,24,20,v,col(k),2.6,'.22')
  +'<g transform="translate(14 14) scale(.8333)" fill="none" stroke="'+col(k)+'" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'
  +(SEATGLYPH[g?g.seat:'_']||SEATGLYPH._)+'</g></svg>';}

/* THE SEVEN SEATS. The ring direction ruled in EG and drawn in EL: seven
   seats closed, root just right of the top, each arc growing from its middle
   as the seat conducts, one charge tick outside it for every address. New:
   the seat a layout leads with breathes, and on landing every arc draws in,
   because he asked for movement the moment the page opens. */
function ringSVG(D,o){
 o=o||{};
 var cx=50,cy=50,Rr=30,seg=TAU/7,gp=0.05,unread=D.r.unread, focus=o.focus||null;
 var h='<svg class="s4-ring'+(o.cls?' '+o.cls:'')+'" viewBox="'+(o.box||'-3 -3 106 106')+'" role="img" aria-label="'+esc(o.label||'Seven seats')+'">'
  +'<defs><filter id="s4glow'+(o.id||'')+'" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter></defs>';
 var mids={};
 D.seats.forEach(function(s,i){
  var a0=-Math.PI/2+i*seg+gp,a1=-Math.PI/2+(i+1)*seg-gp,am=(a0+a1)/2,len=(a1-a0)*Math.max(s.pass,0.04);
  mids[s.b]={a0:a0,a1:a1,am:am};
  var isF=(focus===s.b), dim=(o.dim&&focus&&!isF);
  var inWay=D.T.some(function(g){return g.seat===s.b;});
  h+='<path d="'+arcD(cx,cy,Rr,a0,a1)+'" fill="none" stroke="'+col(s.k)+'" stroke-opacity="'+(dim?'.07':'.18')+'" stroke-width="3.4"'+NS+'/>';
  if(!o.still&&(isF||(o.glowAll&&inWay)))h+='<path class="s4-breathe" style="animation-delay:'+(i*0.18).toFixed(2)+'s" d="'+arcD(cx,cy,Rr,a0,a1)+'" fill="none" stroke="'+col(s.k)
   +'" stroke-width="'+(isF?7:5)+'" filter="url(#s4glow'+(o.id||'')+')"'+NS+'/>';
  if(!unread)h+='<path class="'+(o.still?'':'s4-draw')+'" pathLength="1" style="animation-delay:'+(0.15+i*0.09).toFixed(2)+'s" d="'+arcD(cx,cy,Rr,am-len/2,am+len/2)+'" fill="none" stroke="'+col(s.k)
   +'" stroke-opacity="'+(dim?'.3':'.95')+'" stroke-width="3.4" stroke-linecap="round"'+NS+'/>';
  if(o.ticks!==false){
   var ns=W.filter(function(n){return n.b===s.b;}),n=ns.length;
   ns.forEach(function(nd,j){
    var t=a0+(j+0.5)/n*(a1-a0),c=Math.cos(t),sn=Math.sin(t),v=nd.sq/10;
    if(v>0)h+='<line class="s4-tick" x1="'+P(cx+c*(Rr+3))+'" y1="'+P(cy+sn*(Rr+3))+'" x2="'+P(cx+c*(Rr+3.4+v*7))+'" y2="'+P(cy+sn*(Rr+3.4+v*7))
     +'" stroke="'+col(s.k)+'" stroke-opacity="'+P(dim?0.12:(0.3+0.55*v))+'" stroke-width="1"'+NS+'/>';});}
  if(o.names!==false){
   var tx=cx+Math.cos(am)*(Rr-6.4), ty=cy+Math.sin(am)*(Rr-6.4)+1;
   h+='<text x="'+P(tx)+'" y="'+P(ty)+'" text-anchor="middle" class="s4-sn" style="fill:'+col(s.k)+';opacity:'+(dim?'.35':'.9')+'">'+NM[s.k]+'</text>';}});
 /* the pegs: every pair, on the seat its second sentence resolved to */
 if(o.pegs){
  D.G.forEach(function(g){
   var m=mids[g.seat]; if(!m)return;
   var n=g.idx.length, isF=(focus===g.seat), inT=D.T.some(function(x){return x.seat===g.seat;});
   var r0=isF?3.6:(inT?3:2.4), rad=Rr+(o.pegR||15.5);
   g.idx.forEach(function(pi,j){
    var a=m.am+(j-(n-1)/2)*0.26, px=cx+Math.cos(a)*rad, py=cy+Math.sin(a)*rad;
    var p=ST.pairs[pi], v=closure(p,D.R[pi]);
    h+=(o.press?'<g class="s4-peg" data-s4-sel="'+esc(g.seat)+'" tabindex="0" role="button" aria-label="'+esc(bare(p.be))+', '+theB(g.seat)+'">':'<g aria-hidden="true">')
     +'<title>'+esc(p.be)+'</title>'
     +'<circle class="s4-hit" cx="'+P(px)+'" cy="'+P(py)+'" r="'+P(Math.max(r0+2.2,5.2))+'" fill="transparent" stroke="'+(isF?'var(--accent)':'transparent')+'" stroke-width="1.3"'+NS+'/>'
     +gauge(px,py,r0,g.clear?1:v,col(g.k),g.clear?2.8:(inT?2.4:1.8),g.clear?'.9':(inT?'.55':'.35'))
     +(g.clear?'<circle cx="'+P(px)+'" cy="'+P(py)+'" r="'+P(r0*0.42)+'" fill="none" stroke="'+col(g.k)+'" stroke-width="1.4"'+NS+'/>':'')
     +(o.nums&&inT&&!g.clear?'<text x="'+P(px)+'" y="'+P(py+1.2)+'" text-anchor="middle" class="g-cl" style="fill:var(--ink)">'+(D.T.map(function(x){return x.seat;}).indexOf(g.seat)+1)+'</text>':'')
     +'</g>';});});}
 if(o.centre)h+=o.centre(cx,cy);
 return h+'</svg>';}

/* ================= SHARED PIECES ================= */
function quote(p){return p?'<q class="s4-q">'+esc(bare(p.notbe))+'.</q>':'';}
function goBtn(g,label){
 if(!g||g.clear)return '';
 var m=minutesFor(g.seat);
 return '<button type="button" class="s4-go" data-s4-rel="'+esc(g.seat)+'" style="--c:'+col(g.k)+'">'
  +'<span>'+esc(label||('Release '+theB(g.seat)))+'</span>'+(m?'<small>'+cap(m)+'</small>':'')+'</button>';}
function flashHTML(at){
 var f=ST.flash; if(!f)return '';
 var hit=(f.at===at)||(at==='release'&&f.at==='pair'&&!f.fail);
 if(!hit)return '';
 var nx=(at==='release'&&f.at==='release'&&f.next&&ST.L!=='graded'&&ST.L!=='loop')
  ?'<button type="button" class="s4-go plain s4-next" data-s4-st="ritual"><span>Next, the ritual for it</span><small>'+esc(f.next)+'</small></button>':'';
 return '<p class="s4-flash'+(f.fail?' fail':'')+'" role="status" aria-live="polite">'+f.msg+'</p>'+nx;}
function pairForm(lead){
 return '<div class="s4-form">'
  +(lead?'<p class="s4-lede">'+lead+'</p>':'')
  +'<label>On your best day, how you are<input type="text" id="s4-be" placeholder="A great public speaker." autocomplete="off"></label>'
  +'<label>And on a bad day, in your words<input type="text" id="s4-not" placeholder="What your body does when you are not." autocomplete="off"></label>'
  +'<button type="button" class="s4-go plain" data-s4-do="pair"><span>Add the pair</span></button>'
  +flashHTML('pair')+'</div>';}
/* the loop's four stations, a closed strip: the last arrow returns to the first */
var IC={
 journal:'M5 6.5h14M5 11h14M5 15.5h9M16.5 15l2.5 3.5',
 release:'M12 12m-6.5 0a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0 -13 0M12 9v6M9 12h6',
 ritual:'M12 3.5v4M12 12m-5.5 0a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0M12 12m-1.6 0a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0M8 20.5h8',
 record:'M12 12m-7.5 0a7.5 7.5 0 1 0 15 0a7.5 7.5 0 1 0 -15 0M12 7.5V12l3 2'};
var STN=[{k:'journal',nm:'Journal'},{k:'release',nm:'Release'},{k:'ritual',nm:'Ritual'},{k:'record',nm:'Record'}];
function nextStation(D){
 if(!ST.pairs.length)return 'journal';
 var ran=ST.log.some(function(e){return e.t==='run';});
 if(D.lead&&!ran)return 'release';
 if(!ST.ritDone&&D.T.length)return 'ritual';
 return 'record';}
function icon(k){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+IC[k]+'"/></svg>';}
function strip(D){
 var nx=nextStation(D);
 return '<nav class="s4-strip" aria-label="The loop">'+STN.map(function(s){
  return '<button type="button" data-s4-st="'+s.k+'" aria-pressed="'+(ST.station===s.k)+'" class="'+(nx===s.k?'next':'')+'">'
   +icon(s.k)+'<span>'+s.nm+'</span></button>';}).join('<i aria-hidden="true"></i>')
  +'<b class="s4-back" aria-hidden="true">'+icon('record').replace(/<path[^>]*>/,'<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/>')+'</b></nav>';}
/* what each station holds; the same four EL built, rewritten into one panel */
function panel(D){
 var s=ST.station; if(!s)return '';
 var h='<div class="s4-panel" data-s4-panel="'+s+'">';
 if(s==='journal'){
  if(!ST.pairs.length)return h+pairForm('Who are you becoming? Two sentences. How you are on your best day, and what your body does on a bad one.')+'</div>';
  h+='<label class="s4-lbl">Write what happened today<textarea id="s4-story" placeholder="The day, in your own words. Say what your body did."></textarea></label>'
   +'<button type="button" class="s4-go plain" data-s4-do="story"><span>Read it</span></button>'+flashHTML('story')
   +'<details class="s4-more"><summary>Add who you are becoming</summary>'+pairForm('')+'</details>';
 } else if(s==='release'){
  var g=D.lead;
  if(g){h+='<p class="s4-note">Aimed at <b>'+theB(g.seat)+'</b>, behind <b>'+esc(bare(pairOf(g).be))+'</b>. '
    +'The shipped release card runs it.</p>'+goBtn(g)+flashHTML('release');}
  else h+='<p class="s4-note">Nothing held behind what you wrote, so there is nothing to aim a release at.</p>';
 } else if(s==='ritual'){
  var seen={}, list=[];
  D.T.forEach(function(g){var rt=ritOf(g.seat,D);if(rt&&!seen[rt.k]){seen[rt.k]=1;list.push({rt:rt,g:g});}});
  var mins=list.reduce(function(a,x){return a+x.rt.min;},0);
  if(list.length){
   h+='<p class="s4-note">Today\'s ritual, <b>'+mins+' minutes</b>, one practice for each seat in the way.</p>'
    +'<ul class="s4-list">'+list.map(function(x){
     return '<li style="--c:'+col(x.g.k)+'">'+seatMark(x.g,28)+'<span>'+esc(x.rt.nm)+'<small>for '+esc(bare(pairOf(x.g).be))+'</small></span><em>'+x.rt.min+' min</em></li>';}).join('')+'</ul>'
    +(ST.ritDone?'<p class="s4-flash" role="status">Done. It is on the record.</p>'
      :'<button type="button" class="s4-go plain" data-s4-do="ritdone"><span>I did it</span></button>');}
  else h+='<p class="s4-note">Nothing in the way, so nothing is called for.</p>';
 } else {
  var today=ST.ritDone||ST.log.some(function(e){return e.t==='run';});
  var streak=ST.days+(today?1:0), dots='';
  for(var i=0;i<14;i++){var on=(i===13)?today:(i>=13-ST.days);
   dots+='<i class="'+(on?'on':'')+(i===13?' today':'')+'"></i>';}
  h+='<p class="s4-note">'+(streak?'<b>'+streak+(streak===1?' day':' days')+'</b> in a row on the record.':'Nothing on the record yet.')
   +' '+(today?'Today is on it.':'Today is not on it yet.')+'</p>'
   +'<div class="s4-days" aria-label="The last fourteen days">'+dots+'</div>';}
 return h+'</div>';}
/* what it reads, and the masks: carried from EL, below the fold on all four */
function tail(D){
 var p=[];
 if(D.T.length){
  var g=D.T[0], q=queueFor(g.seat), loud=q[0];
  p.push('The heaviest thing between you and <b>'+esc(bare(pairOf(g).be))+'</b> sits at '+theB(g.seat)
   +(loud?'. The loudest address there is <b>'+esc(loud.k)+'</b>.':'.'));
  if(D.T[1])p.push('After it, '+D.T.slice(1).map(function(x){return theB(x.seat);}).join(', then ')+'.');}
 if(D.unresolved)p.push((D.unresolved===1?'One pair names':'Some pairs name')+' no feeling in its second sentence, so it has no seat yet. Say it again with one in.');
 var seats={}; D.T.forEach(function(g){seats[g.seat]=g.k;});
 var rows=(D.r.maskRing||[]).map(function(mr){
  var m=MASKS.filter(function(x){return x.nm===mr.nm;})[0]||{};
  var over=(m.b||[]).filter(function(b){return seats[b];})[0];
  return {m:m, w:mr.w, over:over};});
 rows.sort(function(a,b){return (!!b.over-!!a.over)||(b.w-a.w);});
 return '<section class="s4-tail"><div><h3>What it reads</h3>'+(p.length?p.map(function(x){return '<p>'+x+'</p>';}).join(''):'<p>Nothing held behind what you wrote.</p>')+'</div>'
  +'<div><h3>Masks, worn over the seats in the way first</h3><div class="s4-masks">'
  +rows.map(function(x){
   return '<button type="button" class="s4-mask'+(x.over?' on':'')+'" data-s4-mask="'+esc(x.m.nm)+'" style="--c:'+(x.over?col(seats[x.over]):'var(--mid)')+'">'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(x.m.ic||'')+'"/></svg><b>'+esc(x.m.nm)+'</b></button>';}).join('')
  +'</div></div></section>';}
function others(D,n){
 var rest=D.T.filter(function(g){return !D.lead||g.seat!==D.lead.seat;}).slice(0,n||2);
 if(!rest.length)return '';
 return '<div class="s4-also"><span>Also in the way</span>'+rest.map(function(g){
  return '<button type="button" data-s4-sel="'+esc(g.seat)+'" style="--c:'+col(g.k)+'">'+seatMark(g,26)
   +'<b>'+esc(bare(pairOf(g).be))+'</b></button>';}).join('')+'</div>';}
function allClear(D){
 return !D.T.length&&ST.pairs.length&&!D.unresolved?'<p class="s4-note">Every pair you wrote reads clear at its seat. Nothing held.</p>':'';}
function unresolvedNote(D){
 return D.iGap||!ST.pairs.length?'':'<p class="s4-note">Your words for this one name no feeling, so the instrument cannot seat it yet. '
  +'<button type="button" class="s4-link" data-s4-st="journal">Say it again</button></p>';}

/* ================= THE FIVE LAYOUTS ================= */
var L={};

/* GRADED. Round EL, laid out exactly as he saw it, for the before. Its own
   prototype strip is taken off the top so its first screen is measured on
   the page alone, which flatters it. */
L.graded=function(D){
 if(!ST.station)ST.station=ST.pairs.length?'release':'journal';
 var inTop={}; D.T.forEach(function(g,i){inTop[g.seat]=i+1;});
 var sel=D.T[0]?(ST.sel||D.T[0].seat):null;
 var ring=ringSVG(D,{pegs:true,press:true,still:true,nums:true,focus:sel,cls:'g-svg',ticks:true,names:true,
  centre:function(){var has=ST.pairs.length&&!D.r.unread, pct=!has?0:(ST.mode==='cleared'?(D.pg?D.pg.pct:0):D.closedPct);
   return gauge(50,50,15,pct/100,'var(--ink)',1.8,'.16')
    +'<text x="50" y="52.6" text-anchor="middle" class="g-cn">'+(has?pct+'<tspan font-size="6">%</tspan>':'-')+'</text>'
    +'<text x="50" y="59.4" text-anchor="middle" class="g-cl">'+(has?(ST.mode==='cleared'?'Cleared':'Closed'):'Nothing written')+'</text>';}});
 var top='<div class="g-top"><div class="g-eye">In the way</div>';
 if(!ST.pairs.length)top+='<div class="g-empty">'+pairForm('Nothing written yet. Describe yourself on your best day, not what you achieved but how you were. Then the opposite.')+'</div>';
 else{
  top+=D.T.map(function(g){var on=(sel===g.seat), p0=pairOf(g);
   return '<div class="g-card" style="--c:'+col(g.k)+'" data-on="'+on+'"><button type="button" class="g-cardh" data-s4-sel="'+esc(g.seat)+'">'
    +seatMark(g,30)+'<span class="g-be">'+esc(p0.be)+(g.idx.length>1?'<small>and '+esc(mid(ST.pairs[g.idx[1]].be))+'</small>':'')+'</span>'
    +'<span class="g-w"><em>'+NM[g.k]+'</em>, '+g.load.toFixed(1)+'</span></button></div>';}).join('');
  var g=D.T.filter(function(x){return x.seat===sel;})[0];
  if(g){var q=queueFor(g.seat), rt=ritOf(g.seat,D);
   top+='<div class="g-body" style="--c:'+col(g.k)+'">'
    +g.idx.map(function(pi){return '<div class="g-pair"><span>Releasing</span><q>'+esc(ST.pairs[pi].notbe)+'</q></div>';}).join('')
    +'<div class="g-act"><button type="button" class="btn pri" data-s4-rel="'+esc(g.seat)+'">Release these</button>'
    +'<button type="button" class="btn" data-s4-st="ritual">See the ritual</button></div>'+flashHTML('release')
    +'<div><div class="g-eye">Held at '+theB(g.seat)+', heaviest first</div><ul class="g-addr">'
    +q.slice(0,3).map(function(n){return '<li><i></i><span>'+esc(n.k)+'</span><b>'+n.sq.toFixed(1)+'</b></li>';}).join('')+'</ul></div>'
    +(rt?'<div class="g-rit">Ritual for it: <b>'+esc(rt.nm)+'</b>, '+rt.min+' minutes</div>':'')+'</div>';}}
 top+='</div>';
 return '<header class="g-head"><h2>Seven Seats</h2>'+(D.ideal?'<p><span>Becoming</span> <b>'+esc(D.ideal.be)+'</b></p>':'<p>Who you are becoming, and what stands in the way.</p>')+'</header>'
  +'<section class="g-main"><div class="g-fig">'+ring+'</div>'+top+'</section>'
  +'<section class="g-loop"><div class="g-stations">'+STN.map(function(s){return '<button type="button" data-s4-st="'+s.k+'" aria-pressed="'+(ST.station===s.k)+'">'+icon(s.k)+s.nm+'</button>';}).join('')+'</div>'+panel(D)+'</section>'
  +tail(D);};

/* RING. The ring is the page. The one thing to do sits in its centre. Every
   pair is a peg on its seat; pressing one moves the centre to it. The words
   behind the lead sit directly under the ring. Everything else is below. */
L.ring=function(D){
 var g=D.lead, p=pairOf(g);
 var centre='<div class="r-centre">'+(g?seatMark(g,34)+'<span class="r-seat" style="color:'+col(g.k)+'">'+cap(theB(g.seat))+'</span>'+goBtn(g,'Release it')
   :(ST.pairs.length?'<span class="r-seat">Nothing held</span>':'<button type="button" class="s4-go plain" data-s4-st="journal" data-s4-focus="s4-be"><span>Say who you are becoming</span></button>'))+'</div>';
 return '<div class="s4-in r-wrap">'
  +'<p class="r-kick">'+(D.ideal?'Becoming <b>'+esc(bare(D.ideal.be))+'</b>':'Seven seats. Who you are becoming, and what holds it back.')+'</p>'
  +'<div class="r-fig">'+ringSVG(D,{pegs:true,press:innerWidth>720,focus:g?g.seat:null,glowAll:true,id:'r',label:'Seven seats, each pair pinned to its seat'})+centre+'</div>'
  +(g?'<div class="r-words" style="--c:'+col(g.k)+'">'+quote(p)+'<p>Between you and <b>'+esc(bare(p.be))+'</b>. '+weightWords(g)+'</p>'+flashHTML('release')+others(D,2)+'</div>'
   :allClear(D)+unresolvedNote(D)+flashHTML('release'))
  +'</div>'
  +'<section class="s4-below">'+strip(D)+panel(D)+'</section>'+tail(D);};

/* TOLD. Born from the first run, not drawn before it. Ring won the fold and
   the look and failed the story: its action sat above the words that say why.
   Story told it in order and had almost no figure. Told is the ring as the
   hero, with the sentence moved above it, so the page reads top to bottom:
   who you said you are becoming, your own words on a bad day, then the ring
   with the one action in its centre, on the seat that holds those words. */
L.told=function(D){
 var g=D.lead, p=pairOf(g);
 var centre='<div class="r-centre">'+(g?seatMark(g,34)+'<span class="r-seat" style="color:'+col(g.k)+'">'+cap(theB(g.seat))+'</span>'+goBtn(g,'Release it')
   :(ST.pairs.length?'<span class="r-seat">Nothing held</span>':'<button type="button" class="s4-go plain" data-s4-st="journal" data-s4-focus="s4-be"><span>Say who you are becoming</span></button>'))+'</div>';
 /* after a release, the sentence slot carries what just happened and what is
    next, because that is where the eye already is; the ring below shows it */
 var done=ST.flash&&ST.flash.at==='release';
 var words=done?'<div class="w-words w-done">'+flashHTML('release')+'</div>'
  :g?'<div class="w-words s4-in" style="animation-delay:.12s;--c:'+col(g.k)+'">'+quote(p)
   +'<p>'+(D.iGap&&g.seat===D.iGap.seat?'':'In the way of <b>'+esc(bare(p.be))+'</b>. ')+weightWords(g)+'</p></div>'
  :(ST.pairs.length?allClear(D)+unresolvedNote(D):'<p class="s4-lede s4-in">Two sentences: how you are on your best day, and what your body does on a bad one. The ring lights the seat that holds the second.</p>');
 return '<div class="w-wrap">'
  +'<p class="r-kick s4-in">'+(D.ideal?'Becoming <b>'+esc(bare(D.ideal.be))+'</b>':'Seven seats. Who you are becoming, and what holds it back.')+'</p>'
  +words
  +'<div class="r-fig w-fig">'+ringSVG(D,{pegs:true,press:innerWidth>720,focus:g?g.seat:null,glowAll:true,id:'w',label:'Seven seats, each pair pinned to its seat, the one holding your words lit'})+centre+'</div>'
  +'<div class="w-after">'+(done?'':flashHTML('release'))+others(D,2)+'</div>'
  +'</div>'
  +'<section class="s4-below">'+strip(D)+panel(D)+'</section>'+tail(D);};

/* THREE. The three in the way lead, as cards in the person's own words. The
   ring is a small key beside the heading, not the hero. */
L.three=function(D){
 var head='<header class="t-head s4-in"><div><span class="s4-eye">Becoming</span><h2>'+(D.ideal?esc(bare(D.ideal.be)):'Who are you becoming?')+'</h2></div>'
  +'<div class="t-key">'+ringSVG(D,{pegs:true,focus:D.lead?D.lead.seat:null,ticks:false,names:false,id:'t',pegR:12,label:'Seven seats, a key'})+'</div></header>';
 if(!ST.pairs.length)return head+'<div class="s4-in">'+pairForm('Two sentences. How you are on your best day, and what your body does on a bad one. The instrument seats the second.')+'</div>'+tail(D);
 var cards=D.T.map(function(g,i){var p=pairOf(g), on=D.lead&&D.lead.seat===g.seat;
  return '<article class="t-card s4-in" style="--c:'+col(g.k)+';animation-delay:'+(0.12+i*0.1).toFixed(2)+'s" data-on="'+on+'">'
   +'<div class="t-top">'+seatMark(g,44)+'<div><b>'+cap(theB(g.seat))+'</b><small>'+(g.load>=4?'Costing you':'Signal, not yet cost')+'</small></div></div>'
   +quote(p)+'<p class="t-for">In the way of <b>'+esc(bare(p.be))+'</b></p>'
   +(on?goBtn(g,'Release it')+flashHTML('release'):'<button type="button" class="t-pick" data-s4-sel="'+esc(g.seat)+'">Start here instead</button>')+'</article>';}).join('');
 return head+'<h3 class="t-h3 s4-in">In the way, heaviest first</h3>'
  +(D.T.length?'<div class="t-cards">'+cards+'</div>':allClear(D)+flashHTML('release'))+unresolvedNote(D)
  +'<section class="s4-below">'+strip(D)+panel(D)+'</section>'+tail(D);};

/* STORY. The page reads top to bottom as one sentence: you said, your words,
   where your body holds it, what to do today. Each line arrives in turn. */
L.story=function(D){
 if(!ST.pairs.length)
  return '<div class="y-col"><p class="y-l s4-in" style="animation-delay:.05s">Start with one sentence.</p>'
   +'<h2 class="y-ideal s4-in" style="animation-delay:.25s">Who are you becoming?</h2>'
   +'<div class="s4-in" style="animation-delay:.5s">'+pairForm('')+'</div></div>'+tail(D);
 var g=D.lead, p=pairOf(g), isIdeal=g&&D.iGap&&g.seat===D.iGap.seat;
 var h='<div class="y-grid"><div class="y-col">'
  +'<p class="y-l s4-in" style="animation-delay:0s">You said you are becoming</p>'
  +'<h2 class="y-ideal s4-in" style="animation-delay:.12s">'+esc(bare(D.ideal.be))+'</h2>';
 if(g){
  h+='<p class="y-l s4-in" style="animation-delay:.3s">'+(isIdeal?'On a bad day, in your words':(D.iGap?'The heaviest thing in the way today, in your words':'Your words for that name no feeling yet. The heaviest thing in the way, in your words'))+'</p>'
   +'<div class="s4-in" style="animation-delay:.42s;--c:'+col(g.k)+'">'+quote(p)+(isIdeal?'':'<p class="y-for">In the way of <b>'+esc(bare(p.be))+'</b></p>')+'</div>'
   +'<p class="y-where s4-in" style="animation-delay:.6s;--c:'+col(g.k)+'">'+seatMark(g,30)+'<span>Your body holds it at <b>'+theB(g.seat)+'</b>. '+weightWords(g)+'</span></p>'
   +'<div class="y-today s4-in" style="animation-delay:.78s"><span class="s4-eye">Today</span>'+goBtn(g,'Release it')+flashHTML('release');
  var rt=ritOf(g.seat,D);
  if(rt)h+='<button type="button" class="y-rit" data-s4-st="ritual">Or the ritual for it: <b>'+esc(rt.nm)+'</b>, '+rt.min+' minutes</button>';
  h+='</div>';}
 else h+=allClear(D)+unresolvedNote(D);
 h+='</div><div class="y-fig s4-in" style="animation-delay:.5s">'+ringSVG(D,{focus:g?g.seat:null,dim:true,ticks:true,names:true,id:'y',label:'Seven seats, the one holding it lit'})+'</div></div>';
 return h+'<div class="y-rest">'+others(D,2)+'</div>'
  +'<section class="s4-below">'+strip(D)+panel(D)+'</section>'+tail(D);};

/* LOOP. The core loop is the frame of the page: the seven seats in the
   middle, the four stations on an orbit around them, closed, and the next
   station lit. What that station holds sits beside it. */
L.loop=function(D){
 var nx=nextStation(D), pos={journal:[50,6],release:[94,50],ritual:[50,94],record:[6,50]};
 var orbit='<svg class="o-orbit" viewBox="0 0 100 100" aria-hidden="true"><defs><marker id="s4arr" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto">'
  +'<path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--dim)" stroke-width="1"/></marker></defs>';
 for(var i=0;i<4;i++){var a0=-Math.PI/2+i*TAU/4+0.34, a1=-Math.PI/2+(i+1)*TAU/4-0.34;
  orbit+='<path class="s4-flow" d="'+arcD(50,50,44,a0,a1)+'" fill="none" stroke="var(--dim)" stroke-opacity=".75" stroke-width="1.2" marker-end="url(#s4arr)"'+NS+'/>';}
 orbit+='</svg>';
 var stations=STN.map(function(s){var xy=pos[s.k];
  return '<button type="button" class="o-st'+(nx===s.k?' next':'')+'" data-s4-st="'+s.k+'" aria-pressed="'+(ST.station===s.k)+'" style="left:'+xy[0]+'%;top:'+xy[1]+'%">'
   +icon(s.k)+'<span>'+s.nm+'</span></button>';}).join('');
 var g=D.lead; if(!ST.station)ST.station=nx;
 var title={journal:'Journal',release:'Release',ritual:'Ritual',record:'Record'}[ST.station];
 return '<div class="o-grid s4-in"><div class="o-fig">'+orbit
  +'<div class="o-seats">'+ringSVG(D,{pegs:true,focus:g?g.seat:null,glowAll:true,ticks:false,id:'o',pegR:11,label:'Seven seats inside the loop'})+'</div>'+stations+'</div>'
  +'<aside class="o-side"><p class="r-kick">'+(D.ideal?'Becoming <b>'+esc(bare(D.ideal.be))+'</b>':'Seven seats')+'</p>'
  +flashHTML('release')
  +(ST.station===nx?'<span class="s4-eye">Next</span>':'<span class="s4-eye">'+title+'</span>')
  +(ST.station==='release'&&g?'<div style="--c:'+col(g.k)+'">'+quote(pairOf(g))+'<p class="y-for">Held at <b>'+theB(g.seat)+'</b>, in the way of <b>'+esc(bare(pairOf(g).be))+'</b>.</p></div>'+goBtn(g,'Release it')+others(D,2)
    :(ST.station==='journal'&&!ST.pairs.length?pairForm('Who are you becoming? Two sentences, and the instrument seats the second.'):panel(D)))
  +'</aside></div>'+tail(D);};

/* ================= THE PROTOTYPE'S OWN CONTROLS =================
   Marked data-proto, so the measurement never counts them. They sit in a
   dock at the foot of the window, never above the page they describe. */
function dockHTML(){
 return '<div class="s4-dock'+(ST.dock?'':' shut')+'" data-proto="1" role="group" aria-label="Prototype controls">'
  +'<button type="button" class="s4-dt" data-s4-dock="1" aria-expanded="'+ST.dock+'">'+(ST.dock?'Hide':'Layouts')+'</button>'
  +(ST.dock?'<div class="s4-seg" role="radiogroup" aria-label="Layout">'+LAYS.map(function(l){
    return '<button type="button" data-s4-L="'+l.k+'" aria-pressed="'+(ST.L===l.k)+'">'+l.nm+'</button>';}).join('')+'</div>'
   +'<label class="s4-who">Person<select data-s4-who="1">'+WHO.map(function(w){
    return '<option value="'+w.k+'"'+(ST.who===w.k?' selected':'')+'>'+(w.nm||w.k)+'</option>';}).join('')+'</select></label>'
   +'<label class="s4-runs">Days of release<input type="range" min="0" max="'+ST.max+'" step="1" value="'+ST.runs+'"><output>'+ST.runs+'</output></label>'
   +(ST.L==='told'||ST.L==='ring'||ST.L==='three'||ST.L==='loop'?'<div class="s4-seg" role="radiogroup" aria-label="Which pair leads"><button type="button" data-s4-lead="weight" aria-pressed="'+(ST.leadBy==='weight')+'">Heaviest leads</button><button type="button" data-s4-lead="ideal" aria-pressed="'+(ST.leadBy==='ideal')+'">Ideal leads</button></div>':'')
   +'<button type="button" class="s4-vbtn" data-s4-verdict="1">The verdict</button>':'')
  +'</div>';}
function verdictHTML(){
 return '<div class="s4-vd" data-proto="1" role="dialog" aria-modal="true" aria-label="The verdict">'
  +'<div class="s4-vd-in"><button type="button" class="s4-vd-x" data-s4-verdict="0" aria-label="Close the verdict">'
  +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'
  +(window.S4_VERDICT||'<p>No measured run is embedded in this build yet. Run shoot.js, then build.js.</p>')
  +'</div></div>';}

/* ================= PAINT ================= */
function host(){
 var h=document.getElementById('s4');
 if(!h){h=document.createElement('div');h.id='s4';
  var cv=document.getElementById('cv');cv.parentNode.insertBefore(h,cv.nextSibling);}
 return h;}
function paint(){
 var b=document.body;
 b.classList.add('s4-on');
 LAYS.forEach(function(l){b.classList.toggle('s4-L-'+l.k,ST.L===l.k);});
 b.classList.toggle('s4-anim',!!ST.anim);
 var keepStory=(document.getElementById('s4-story')||{}).value||'';
 var D=read(), h=host();
 h.className='s4 s4-'+ST.L;
 h.innerHTML=L[ST.L](D);
 var ta=document.getElementById('s4-story'); if(ta&&keepStory)ta.value=keepStory;
 var dk=document.getElementById('s4-dockhost');
 if(!dk){dk=document.createElement('div');dk.id='s4-dockhost';document.body.appendChild(dk);}
 dk.innerHTML=ST.clean?'':dockHTML()+(ST.verdict?verdictHTML():'');
 b.classList.toggle('s4-vd-open',!!ST.verdict&&!ST.clean);
 ST.anim=false;
 mark(D);}
function mark(D){
 document.documentElement.setAttribute('data-s4',[ST.L,ST.who,ST.runs,D&&D.lead?D.lead.seat:'-'].join('|'));
 try{history.replaceState(null,'','#L='+ST.L+'&who='+ST.who+(ST.runs?'&runs='+ST.runs:'')+(ST.leadBy!=='weight'?'&lead='+ST.leadBy:'')+(ST.clean?'&clean=1':''));}catch(e){}}
function redraw(){render();paint();}

/* pressing a seat moves the lead there. On Loop and Graded that opens the
   release station, as EL did; on the other three the lead's own button
   already moved, so nothing opens below */
function onSel(cur){return (ST.L==='loop'||ST.L==='graded')?'release':cur==='release'?null:cur;}
/* ================= THE WRITES A PERSON MAKES ================= */
function doStory(){
 var ta=document.getElementById('s4-story'), t=(ta&&ta.value||'').trim();
 if(!t){ST.flash={at:'story',fail:true,msg:'Nothing to read. Write what happened first.'};return paint();}
 var ps=parseStory(t), tally={};
 (ps.imprints||[]).forEach(function(x){if(x&&x.band)tally[x.band]=(tally[x.band]||0)+(x.amt||1);});
 var bands=Object.keys(tally).sort(function(a,b){return tally[b]-tally[a];});
 if(!bands.length){ST.flash={at:'story',fail:true,msg:'Nothing landed. Say what your body did, and where.'};return paint();}
 compute(); ST.log.push({t:'story',text:t}); applyText(t); compute();
 var R=avRows(), hit=[];
 R.forEach(function(r,i){if(r.gap&&bands.indexOf(r.gap.seat)>=0)hit.push(bare(ST.pairs[i].be));});
 ST.flash={at:'story',msg:'Landed on '+bands.slice(0,3).map(theB).join(', ')+'.'
  +(hit.length?' That is the seat behind <b>'+esc(hit[0])+'</b>, so its weight just moved.':' None of your pairs sits there.')};
 ta.value=''; redraw();}
function doPair(){
 var be=((document.getElementById('s4-be')||{}).value||'').trim(), nb=((document.getElementById('s4-not')||{}).value||'').trim();
 var pr={be:be, notbe:nb};
 if(!avatarValid(pr)){ST.flash={at:'pair',fail:true,msg:'A pair is written as a pair. Both halves, or nothing.'};return paint();}
 compute(); var seat=readSeat(nb), load=null;
 if(seat){var grp=W.filter(function(n){return n.b===seat;});load=grp.reduce(function(a,n){return a+n.sq;},0)/Math.max(1,grp.length);}
 pr.load0=load; ST.pairs.push(pr); setPairs();
 ST.flash={at:'pair',fail:!seat,msg:seat?'The second sentence reads to '+theB(seat)+'.'
  :'The instrument could not read a feeling out of the second sentence. Say it again with one in.'};
 if(seat){ST.sel=seat;ST.station=(ST.L==='loop'||ST.L==='graded')?'release':null;}
 redraw();
 if(seat){var h=document.getElementById('s4');if(h){h.scrollTop=0;var r=h.getBoundingClientRect();if(r.top<0)window.scrollBy(0,r.top-8);}}}
function doRelease(seat){
 compute(); var q=queueFor(seat);
 if(!q.length){status('Nothing is held at '+theB(seat)+', so there is nothing to release.','fail');return;}
 ST.pending={seat:seat,load:(gaps(avRows()).filter(function(x){return x.seat===seat;})[0]||{}).load}; RUN.speed=2.2;
 relPick(q.map(function(n){return n.i;}));}
var realCool=window.relCoolDown, realClose=window.relClose;
window.relCoolDown=function(){
 if(!ST.on||!ST.pending)return realCool.apply(this,arguments);
 if(RUN.done)return; RUN.done=true; RUN.phase='done';
 try{relTone();}catch(e){}
 var pre=compute(); RUN.ex0=pre.EX; try{RUN.ceil0=exCeiling();}catch(e){}
 var ids=RUN.queue.map(function(n){return n.i;}), w=write(RUN.queue);
 RUN.log=w.log; RUN.freed=w.freed;
 ST.log.push({t:'run',ids:ids,seat:ST.pending.seat});
 ST.runsBy[ST.pending.seat]=(ST.runsBy[ST.pending.seat]||0)+1;
 compute(); var R=avRows(), g=gaps(R).filter(function(x){return x.seat===ST.pending.seat;})[0];
 var was=ST.pending.load;
 ST.flash={at:'release',msg:g?(g.clear?cap(theB(g.seat))+' reads clear. The pair behind it is lit.'
   :cap(theB(g.seat))+' carries less than it did'+(was!=null?', '+g.load.toFixed(1)+' where it was '+was.toFixed(1):'')+'. The arc there grew.'):'Released.'};
 var rt=ritOf(ST.pending.seat,{r:compute()}); if(rt)ST.flash.next=rt.nm+', '+rt.min+' minutes';
 ST.sel=ST.pending.seat; ST.station=(ST.L==='loop'||ST.L==='graded')?'ritual':null;
 ST.pending=null; RUN.speed=2.2;
 relRender(); redraw();};
window.relClose=function(){ST.pending=null;RUN.speed=2.2;return realClose.apply(this,arguments);};
document.addEventListener('click',function(e){
 if(e.target.closest&&e.target.closest('#relgo')&&ST.pending&&ST.fast)RUN.speed=0.3;},true);

document.addEventListener('click',function(e){
 var t=e.target.closest?e.target:null; if(!t)return;
 var b;
 if((b=t.closest('[data-s4-dock]'))){ST.dock=!ST.dock;return paint();}
 if((b=t.closest('[data-s4-lead]'))){ST.leadBy=b.getAttribute('data-s4-lead');ST.sel=null;ST.anim=true;return paint();}
 if((b=t.closest('[data-s4-verdict]'))){ST.verdict=b.getAttribute('data-s4-verdict')==='1';paint();
  if(ST.verdict){var x=document.querySelector('.s4-vd-x');if(x)x.focus();}return;}
 if((b=t.closest('[data-s4-openL]'))){ST.verdict=false;ST.L=b.getAttribute('data-s4-openL');ST.sel=null;ST.station=null;ST.anim=true;
  var w=b.getAttribute('data-s4-openwho');if(w){ST.runs=0;build(w);}return redraw();}
 if((b=t.closest('[data-s4-L]'))){ST.L=b.getAttribute('data-s4-L');ST.sel=null;ST.station=null;ST.flash=null;ST.anim=true;return paint();}
 if((b=t.closest('[data-s4-sel]'))){ST.sel=b.getAttribute('data-s4-sel');ST.station=onSel(ST.station);return paint();}
 if((b=t.closest('[data-s4-rel]')))return doRelease(b.getAttribute('data-s4-rel'));
 if((b=t.closest('[data-s4-st]'))){ST.station=b.getAttribute('data-s4-st');ST.flash=null;paint();
  var fid=b.getAttribute('data-s4-focus');
  var sec=document.querySelector('#s4 .s4-panel, #s4 .s4-form');if(sec&&sec.scrollIntoView)sec.scrollIntoView({block:'nearest'});
  if(fid){var el=document.getElementById(fid);if(el)el.focus();}return;}
 if((b=t.closest('[data-s4-do]'))){var k=b.getAttribute('data-s4-do');
  if(k==='story')return doStory();
  if(k==='pair')return doPair();
  if(k==='ritdone'){ST.ritDone=true;ST.station='record';return paint();}}
 if((b=t.closest('[data-s4-mask]'))){var nm=b.getAttribute('data-s4-mask');
  runMaskDrill(MASKS.filter(function(m){return m.nm===nm;})[0]);return;}});
document.addEventListener('change',function(e){
 if(e.target.matches&&e.target.matches('[data-s4-who]')){ST.runs=0;build(e.target.value);ST.anim=true;redraw();}});
document.addEventListener('keydown',function(e){
 if(e.key==='Escape'&&ST.verdict){ST.verdict=false;return paint();}
 var g=e.target.closest&&e.target.closest('.s4-peg');
 if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();ST.sel=g.getAttribute('data-s4-sel');ST.station=onSel(ST.station);paint();}});
document.addEventListener('input',function(e){
 if(e.target.closest&&e.target.closest('.s4-runs')){ST.runs=+e.target.value;settle();redraw();}});

function mount(o){
 o=o||{};
 ST.runs=+o.runs||0; ST.L=o.L||ST.L; ST.leadBy=o.lead||'weight'; ST.clean=!!o.clean; ST.verdict=!!o.verdict;
 ST.dock=o.dock!=null?o.dock:(innerWidth>720);
 setTab(TAB.FIELD);
 build(o.who||'James');
 ST.anim=true;
 redraw();}
return {mount:mount, ST:ST, read:read, LAYS:LAYS,
 set:function(k,v){ST[k]=v;if(k==='runs')settle();redraw();},
 build:function(w){ST.runs=0;build(w);ST.anim=true;redraw();}};
})();
