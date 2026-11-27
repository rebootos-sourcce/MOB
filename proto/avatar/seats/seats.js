/* ============================================================
   SEVEN SEATS. Prototype over the shipped build, round EI.
   Not part of the product. Nothing under atuned_src/ is touched.

   His words, 26 September: "Let's do the seven seats, I like that, we
   can even call it that." And the mechanic: "I don't think the avatar's
   CQ matters here, this is about becoming, the stories we tell ourselves
   about what we're not and what we want to become, using the software to
   sniff that out and elevate the patterns keeping them from doing that."

   EVERY NUMBER ON THIS PAGE IS THE PRODUCT'S OWN.
     the pairs        engine/avatar.js, {be, notbe}, validated by avatarValid
     the seat         readSeat (ui/drills.js), the story parser's own resolver
     the gap          avRows -> avatarGap, the seat's mean weight, and clear
     the success      avatarProgress, done over total, read from work done
     the seat arcs    each address's own conduction, n.open, as the ring
                      direction in proto/avatar/four draws it
     the release      relPick, the real release card, aimed at the gap's seat
     the ritual       ritFor, asked about the gap's seat rather than the
                      darkest one, so the practice follows the pair
     the masks        compute().maskRing and MASKS, and runMaskDrill

   WHAT IS MOCKUP AND NOT PRODUCT, said once here and on the strip:
     the pairs themselves (pairs.js; no reference person carries any and
     the shipped product has no way to write one), the record's day strip,
     and "one release a day" on the slider, which replays aimed runs.

   A RELEASE ON A WORKED EXAMPLE REFUSES, ruled (ui/release.js). So while
   this layer is on, the release card's last step replays the same writes
   the release makes, on the same queue the card was handed, and nothing
   is saved. The card itself, its opening, its lines and its tone, is the
   shipped one.
   ============================================================ */
window.SV7=(function(){
'use strict';
var BANK=window.SV7_BANK||{}, PAIRS=window.SV7_PAIRS||{};
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
/* a pair's first half, set inside a sentence: no closing stop, and a lower
   case first letter when it follows a word, unless it is "I" */
function mid(t){t=String(t||'').replace(/\.\s*$/,'');return /^I\b/.test(t)?t:t.charAt(0).toLowerCase()+t.slice(1);}
function bare(t){return String(t||'').replace(/\.\s*$/,'');}

var WHO=[{k:'James',nm:'James',sub:'57, level 3'},{k:'Angela',nm:'Angela',sub:'36, level 5'},
 {k:'Derek',nm:'Derek',sub:'39, level 7'},{k:'blank',nm:'Nobody yet',sub:'first run'}];
var ST={on:true, who:'James', runs:0, max:14, mode:'cleared', fast:true, sel:null,
 station:'journal', pairs:[], log:[], ritDone:false, flash:null, pending:null, runsBy:{}, days:0, openAll:false};

/* ---------------- the person ---------------- */
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

/* ---------------- the gap, the queue, the release ---------------- */
/* one gap per seat: two pairs on one seat are one weight, and releasing it
   moves both, so the top three are three seats and never one seat twice */
function gaps(R){
 var by={}, list=[];
 R.forEach(function(r,i){if(!r.gap)return;var s=r.gap.seat;
  if(!by[s]){by[s]={seat:s,k:kOf(s),load:r.gap.load,at:r.gap.at,clear:r.gap.clear,idx:[]};list.push(by[s]);}
  by[s].idx.push(i);});
 return list;}
function top3(G){return G.filter(function(g){return !g.clear;}).sort(function(a,b){return b.load-a.load;}).slice(0,3);}
/* the queue the release button builds (ui/personas.js, bRel), scoped to the
   seat the pair resolved to: the eight heaviest at or above the line of 4,
   else the eight heaviest carrying */
function queueFor(seat){
 var at=W.filter(function(n){return n.b===seat&&n.sq>0&&n.cf;}).sort(function(a,b){return b.sq-a.sq;});
 var hot=at.filter(function(n){return n.sq>=4;});
 return (hot.length?hot:at).slice(0,8);}
/* the writes relCoolDown makes, line for line, without the save */
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
 ST.who=who; ST.log=[]; ST.ritDone=false; ST.flash=null; ST.sel=null; ST.openAll=false;
 ST.pairs=(PAIRS[who]||[]).map(function(p){return {be:p.be, notbe:p.notbe, load0:null};});
 ST.station=ST.pairs.length?'release':'journal';
 var keep=ST.runs; ST.runs=0; reset(); compute();
 var R=avRows();
 ST.pairs.forEach(function(p,i){p.load0=R[i]&&R[i].gap?R[i].gap.load:null;});
 ST.runs=keep; settle();}

/* how far a pair's gap has closed since the day it was written. The engine
   stores no weight at writing, so the mockup keeps load0 beside the pair;
   building this means storing it, or reading it off the snapshot history. */
function closure(p,r){
 if(!r||!r.gap)return null;
 if(r.gap.clear)return 1;
 if(p.load0==null||p.load0<=0)return 0;
 return cl(1-r.gap.load/p.load0,0,1);}

/* ---------------- the reading the page is drawn from ---------------- */
function seatOpen(b){
 var g=W.filter(function(n){return n.b===b;});
 return g.reduce(function(a,n){return a+Math.min(1,Math.max(0,n.open));},0)/Math.max(1,g.length);}
function read(){
 var r=compute(), R=avRows(), G=gaps(R), T=top3(G), pg=avatarProgress(R);
 var res=R.filter(function(x){return !!x.gap;});
 var closed=res.length?res.reduce(function(a,x){return a+closure(ST.pairs[R.indexOf(x)],x);},0)/res.length:0;
 if(!ST.sel||!T.some(function(g){return g.seat===ST.sel;}))ST.sel=T[0]?T[0].seat:null;
 return {r:r, R:R, G:G, T:T, pg:pg, closedPct:Math.round(closed*100),
  unresolved:R.filter(function(x){return !x.gap;}).length,
  seats:ORDER.map(function(k){return {k:k,b:K2B[k],pass:r.unread?0:seatOpen(K2B[k])};})};}

/* ---------------- drawing primitives ---------------- */
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
/* a small ring glyph for a gap: its seat colour, filled round as it closes */
function glyph(k,v,clear){
 return '<svg viewBox="0 0 30 30" aria-hidden="true">'+gauge(15,15,11,clear?1:(v||0),col(k),clear?3:2.4,'.28')
  +(clear?'<circle cx="15" cy="15" r="4" fill="none" stroke="'+col(k)+'" stroke-width="1.6"/>':'')+'</svg>';}

/* ---------------- the avatar: the ring, with the pairs pinned to it ----------------
   The ring direction the team recommended in EG, from proto/avatar/four: seven
   seats closed, root just right of the top, each arc growing from its middle
   as the seat conducts. Charge ticks stand outside it, one an address.
   New here: every pair is a peg on the seat its second sentence resolved to,
   filled round as that gap closes and closed into a full ring when the engine
   reads it clear. The three in the way carry the accent. The centre is the
   success rate, because his own words take CQ out of this page. */
function drawRing(D){
 var cx=50,cy=50,Rr=30,seg=TAU/7,gap=0.05,unread=D.r.unread;
 var h='<svg class="sv-svg" viewBox="-3 -3 106 106" role="img" aria-label="Seven seats, with each stated pair pinned to the seat it resolves to">';
 var mid={};
 D.seats.forEach(function(s,i){
  var a0=-Math.PI/2+i*seg+gap,a1=-Math.PI/2+(i+1)*seg-gap,am=(a0+a1)/2,len=(a1-a0)*s.pass;
  mid[s.b]={a0:a0,a1:a1,am:am};
  h+='<path d="'+arcD(cx,cy,Rr,a0,a1)+'" fill="none" stroke="'+col(s.k)+'" stroke-opacity=".16" stroke-width="3.2"'+NS+'/>';
  if(len>0.004)h+='<path d="'+arcD(cx,cy,Rr,am-len/2,am+len/2)+'" fill="none" stroke="'+col(s.k)
   +'" stroke-opacity=".9" stroke-width="3.2" stroke-linecap="round"'+NS+'/>';
  var ns=W.filter(function(n){return n.b===s.b;}),n=ns.length;
  ns.forEach(function(nd,j){
   var t=a0+(j+0.5)/n*(a1-a0),c=Math.cos(t),sn=Math.sin(t),v=nd.sq/10;
   if(v>0)h+='<line x1="'+P(cx+c*(Rr+3))+'" y1="'+P(cy+sn*(Rr+3))+'" x2="'+P(cx+c*(Rr+3.4+v*7))+'" y2="'+P(cy+sn*(Rr+3.4+v*7))
    +'" stroke="'+col(s.k)+'" stroke-opacity="'+P(0.3+0.55*v)+'" stroke-width="1"'+NS+'/>';});
  /* the seat's name, inside the ring, small */
  var tx=cx+Math.cos(am)*(Rr-6.6), ty=cy+Math.sin(am)*(Rr-6.6)+1;
  h+='<text x="'+P(tx)+'" y="'+P(ty)+'" text-anchor="middle" class="sv-cl sv-sn" style="fill:'+col(s.k)+'">'+NM[s.k]+'</text>';});
 /* the pegs. The three in the way are drawn larger, and the one open below
    carries an accent ring and a tick back to its seat. */
 var inTop={}; D.T.forEach(function(g,i){inTop[g.seat]=i+1;});
 D.G.forEach(function(g){
  var m=mid[g.seat]; if(!m)return;
  var n=g.idx.length, big=!!inTop[g.seat], sel=(ST.sel===g.seat), r0=big?3.3:2.5;
  if(sel){var tx0=cx+Math.cos(m.am)*(Rr+11.2),ty0=cy+Math.sin(m.am)*(Rr+11.2),tx1=cx+Math.cos(m.am)*(Rr+15.5-r0-1.8),ty1=cy+Math.sin(m.am)*(Rr+15.5-r0-1.8);
   h+='<line x1="'+P(tx0)+'" y1="'+P(ty0)+'" x2="'+P(tx1)+'" y2="'+P(ty1)+'" stroke="var(--accent)" stroke-width="1.2"'+NS+'/>';}
  g.idx.forEach(function(pi,j){
   var a=m.am+(j-(n-1)/2)*0.24, px=cx+Math.cos(a)*(Rr+15.5), py=cy+Math.sin(a)*(Rr+15.5);
   var p=ST.pairs[pi], v=closure(p,D.R[pi]);
   h+='<g class="sv-peg" data-sv-sel="'+esc(g.seat)+'" tabindex="0" role="button" aria-label="'+esc(p.be)+', '+theB(g.seat)+(g.clear?', clear':'')+'">'
    +'<title>'+esc(p.be)+'</title>'
    +'<circle class="sv-hit" cx="'+P(px)+'" cy="'+P(py)+'" r="'+P(r0+1.7)+'" fill="transparent" stroke="'+(sel?'var(--accent)':'transparent')+'" stroke-width="1.3"'+NS+'/>'
    +gauge(px,py,r0,g.clear?1:v,col(g.k),g.clear?2.8:(big?2.4:1.8),g.clear?'.9':'.45')
    +(g.clear?'<circle cx="'+P(px)+'" cy="'+P(py)+'" r="'+P(r0*0.42)+'" fill="none" stroke="'+col(g.k)+'" stroke-width="1.4"'+NS+'/>':'')
    +(big&&!g.clear?'<text x="'+P(px)+'" y="'+P(py+1.2)+'" text-anchor="middle" class="sv-cl" style="fill:var(--ink)">'+inTop[g.seat]+'</text>':'')
    +'</g>';});});
 /* the centre: the success rate, drawn */
 var has=ST.pairs.length&&!unread, pct=!has?0:(ST.mode==='cleared'?(D.pg?D.pg.pct:0):D.closedPct);
 h+=gauge(cx,cy,15,pct/100,'var(--ink)',1.8,'.16');
 h+='<text x="50" y="52.6" text-anchor="middle" class="sv-cn">'+(has?pct+'<tspan font-size="6">%</tspan>':'–')+'</text>';
 h+='<text x="50" y="59.4" text-anchor="middle" class="sv-cl">'+(has?(ST.mode==='cleared'?'Cleared':'Closed'):'Nothing written')+'</text>';
 return h+'</svg>';}

/* ---------------- the top three ----------------
   Three rows, always all three on screen, because "persistent" is the whole
   ask: a row per seat in the way, heaviest first. The one selected opens
   underneath the three rather than inside its own row, so opening it never
   pushes the other two off the screen. */
function ritOf(seat,D){
 try{var c=ritFor({darkB:seat, DQ:D.r.DQ});return c&&c.called?{nm:c.called.nm,min:c.called.min,k:c.called.k}:null;}catch(e){return null;}}
function row(g,D){
 var on=(ST.sel===g.seat), p0=ST.pairs[g.idx[0]], v=closure(p0,D.R[g.idx[0]]);
 return '<div class="sv-card" style="--c:'+col(g.k)+'" aria-expanded="'+on+'">'
  +'<button type="button" class="sv-cardh" data-sv-sel="'+esc(g.seat)+'" aria-expanded="'+on+'">'
  +glyph(g.k,v,false)
  +'<span class="sv-be">'+esc(p0.be)+(g.idx.length>1?'<small>and '+esc(mid(ST.pairs[g.idx[1]].be))+'</small>':'')+'</span>'
  +'<span class="sv-w"><em>'+NM[g.k]+'</em>, '+g.load.toFixed(1)+'</span></button></div>';}
function detail(g,D){
 var q=queueFor(g.seat), rt=ritOf(g.seat,D), runs=ST.runsBy[g.seat]||0;
 return '<div class="sv-body" style="--c:'+col(g.k)+'">'
  +g.idx.map(function(pi){return '<div class="sv-pair"><span>Releasing</span><q>'+esc(ST.pairs[pi].notbe)+'</q></div>';}).join('')
  +'<div class="sv-act"><button type="button" class="btn pri" data-sv-rel="'+esc(g.seat)+'">Release these</button>'
  +'<button type="button" class="btn" data-sv-st="ritual">See the ritual</button></div>'
  +'<div><div class="sv-eye">Held at '+theB(g.seat)+', heaviest first</div><ul class="sv-addr">'
  +q.slice(0,3).map(function(n){return '<li><i></i><span>'+esc(n.k)+'</span><b>'+n.sq.toFixed(1)+'</b></li>';}).join('')
  +'</ul></div>'
  +(rt?'<div class="sv-rit">Ritual for it: <b>'+esc(rt.nm)+'</b>, '+rt.min+' minutes</div>':'')
  +(runs?'<p class="sv-note">Released against it <b>'+runs+(runs===1?' time':' times')+'</b>.</p>':'')
  +'</div>';}
function topHTML(D){
 var h='<div class="sv-top"><div class="sv-eye">In the way</div>';
 if(!ST.pairs.length)
  return h+'<div class="sv-empty"><p>Nothing written yet. Describe yourself on your best day, '
   +'not what you achieved but how you were. Then the opposite.</p>'
   +'<div class="sv-act"><button type="button" class="btn pri" data-sv-st="journal" data-sv-focus="sv-be">Write the pair</button></div></div></div>';
 if(!D.T.length)
  h+='<div class="sv-empty"><p>Nothing held behind what you wrote. Every pair reads clear at its seat.</p>'
   +'<div class="sv-act"><button type="button" class="btn" data-sv-st="journal" data-sv-focus="sv-be">Write the next pair</button></div></div>';
 else{
  h+=D.T.map(function(g){return row(g,D);}).join('');
  var g=D.T.filter(function(x){return x.seat===ST.sel;})[0];
  if(g)h+=detail(g,D);}
 if(D.unresolved)
  h+='<p class="sv-note">'+(D.unresolved===1?'One pair has':'Some pairs have')
   +' no seat yet. <button type="button" class="btn" data-sv-st="journal" style="margin-left:4px">Say it again</button></p>';
 return h+'</div>';}

/* ---------------- the core loop, closed ---------------- */
var IC={
 journal:'M5 6.5h14M5 11h14M5 15.5h9M16.5 15l2.5 3.5',
 release:'M12 12m-6.5 0a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0 -13 0M12 9v6M9 12h6',
 ritual:'M12 3.5v4M12 12m-5.5 0a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0M12 12m-1.6 0a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0M8 20.5h8',
 record:'M12 12m-7.5 0a7.5 7.5 0 1 0 15 0a7.5 7.5 0 1 0 -15 0M12 7.5V12l3 2'};
var STN=[{k:'journal',nm:'Journal',x:50,y:11},{k:'release',nm:'Release',x:80,y:50},
 {k:'ritual',nm:'Ritual',x:50,y:89},{k:'record',nm:'Record',x:20,y:50}];
function loopSvg(){
 var h='<svg viewBox="0 0 100 100" aria-hidden="true"><defs><marker id="svArr" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto">'
  +'<path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--dim)" stroke-width="1"/></marker></defs>';
 for(var i=0;i<4;i++){var a0=-Math.PI/2+i*TAU/4+0.42, a1=-Math.PI/2+(i+1)*TAU/4-0.42;
  h+='<path d="'+arcD(50,50,38,a0,a1)+'" fill="none" stroke="var(--dim)" stroke-opacity=".7" stroke-width="1.2" marker-end="url(#svArr)"'+NS+'/>';}
 return h+'</svg>';}
function stationHTML(D){
 var s=ST.station, h='<div class="sv-panel">';
 if(s==='journal'){
  h+='<h3>Journal</h3>'
   +'<label>Write what happened<textarea id="sv-story" placeholder="The day, in your own words."></textarea></label>'
   +'<div class="sv-act"><button type="button" class="btn pri" data-sv-do="story">Read it</button></div>';
  if(ST.flash&&ST.flash.at==='story')h+='<p class="sv-flash'+(ST.flash.fail?' fail':'')+'">'+ST.flash.msg+'</p>';
  h+='<div class="sv-eye" style="margin-top:6px">Who you are becoming</div>';
  if(ST.pairs.length)
   h+='<ul class="sv-plist">'+ST.pairs.map(function(p,i){var r=D.R[i],g=r&&r.gap;
    return '<li style="--c:'+(g?col(kOf(g.seat)):'var(--dim)')+'"><span>'+esc(p.be)+'</span><small>'+esc(p.notbe)+'</small>'
     +'<em>'+(g?(g.clear?NM[kOf(g.seat)]+', clear':NM[kOf(g.seat)]+', '+g.load.toFixed(1)):'not resolved')+'</em></li>';}).join('')+'</ul>';
  h+='<div class="sv-two"><label>On your best day, how you are<input type="text" id="sv-be" placeholder="A great public speaker."></label>'
   +'<label>And not, on a bad day<input type="text" id="sv-not" placeholder="What your body does when you are not."></label></div>'
   +'<div class="sv-act"><button type="button" class="btn" data-sv-do="pair">Add the pair</button></div>';
  if(ST.flash&&ST.flash.at==='pair')h+='<p class="sv-flash'+(ST.flash.fail?' fail':'')+'">'+ST.flash.msg+'</p>';
 } else if(s==='release'){
  var g=D.T.filter(function(x){return x.seat===ST.sel;})[0]||D.T[0];
  h+='<h3>Release</h3>';
  if(g){var q=queueFor(g.seat);
   h+='<p class="sv-note">Aimed at <b>'+theB(g.seat)+'</b>, behind <b>'+esc(bare(ST.pairs[g.idx[0]].be))+'</b>. '
    +q.length+(q.length===1?' address':' addresses')+', heaviest first. The shipped release card runs it.</p>'
    +'<div class="sv-act"><button type="button" class="btn pri" data-sv-rel="'+esc(g.seat)+'">Release these</button></div>';}
  else h+='<p class="sv-note">Nothing held behind what you wrote, so there is nothing to aim a release at.</p>';
  if(ST.flash&&ST.flash.at==='release')h+='<p class="sv-flash">'+ST.flash.msg+'</p>';
  h+='<div class="sv-later"><span class="sv-tag">Later</span><span>A binaural tone under the run, and a voice reading the script. '
   +'Named by him as their own question. Not designed here.</span></div>';
 } else if(s==='ritual'){
  var seen={}, list=[];
  D.T.forEach(function(g){var rt=ritOf(g.seat,D);if(rt&&!seen[rt.k]){seen[rt.k]=1;list.push({rt:rt,g:g});}});
  var mins=list.reduce(function(a,x){return a+x.rt.min;},0);
  h+='<h3>Ritual</h3>';
  if(list.length){
   h+='<p class="sv-note">Today\'s ritual, <b>'+mins+' minutes</b>, one practice for each seat in the way.</p>'
    +'<ul class="sv-plist">'+list.map(function(x){
     return '<li style="--c:'+col(x.g.k)+'"><span>'+esc(x.rt.nm)+'</span><small>for '+esc(ST.pairs[x.g.idx[0]].be)+'</small>'
      +'<em>'+x.rt.min+' minutes</em></li>';}).join('')+'</ul>'
    +'<div class="sv-act">'+(ST.ritDone?'<p class="sv-note" style="align-self:center">Done. It is on the record.</p>'
      :'<button type="button" class="btn pri" data-sv-do="ritdone">I did it</button>')
    +'<button type="button" class="btn" data-sv-do="ritopen">Open the ritual builder</button></div>';}
  else h+='<p class="sv-note">Nothing in the way, so nothing is called for.</p>';
 } else {
  var today=ST.ritDone||ST.log.some(function(e){return e.t==='run';});
  var streak=ST.days+(today?1:0), dots='';
  for(var i=0;i<14;i++){var on=(i===13)?today:(i>=13-ST.days);
   dots+='<i class="'+(on?'on':'')+(i===13?' today':'')+'" title="'+(i===13?'Today':(13-i)+(13-i===1?' day ago':' days ago'))+'"></i>';}
  var runs=Object.keys(ST.runsBy).reduce(function(a,k){return a+ST.runsBy[k];},0);
  h+='<h3>Record</h3>'
   +'<div class="sv-figs"><div class="sv-fg"><span>Streak</span><b>'+streak+'<i>'+(streak===1?'day':'days')+'</i></b></div>'
   +'<div class="sv-fg"><span>Released</span><b>'+runs+'<i>'+(runs===1?'run':'runs')+'</i></b></div>'
   +'<div class="sv-fg"><span>Cleared</span><b>'+(D.pg?D.pg.done:0)+'<i>'+((D.pg&&D.pg.done===1)?'pair':'pairs')+'</i></b></div></div>'
   +'<div class="sv-days" aria-label="The last fourteen days">'+dots+'</div>'
   +'<p class="sv-note">'+(today?'Today is on the record.':'Today is not on the record yet.')+'</p>';}
 return h+'</div>';}
function loopHTML(D){
 return '<section class="sv-loop" aria-label="The core loop"><div class="sv-wheel">'+loopSvg()
  +STN.map(function(s){return '<button type="button" class="sv-st" data-sv-st="'+s.k+'" aria-pressed="'+(ST.station===s.k)+'" style="left:'+s.x+'%;top:'+s.y+'%">'
   +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+IC[s.k]+'"/></svg>'+s.nm+'</button>';}).join('')
  +'</div>'+stationHTML(D)+'</section>';}

/* ---------------- what it reads, and the masks ---------------- */
function sumHTML(D){
 var p=[];
 if(!ST.pairs.length){
  p.push('No pair has been written, so there is nothing to measure against. Write one and this names what stands in the way.');}
 else if(D.T.length){
  var g=D.T[0], q=queueFor(g.seat), loud=q[0];
  p.push('The heaviest thing between you and <b>'+esc(bare(ST.pairs[g.idx[0]].be))+'</b> sits at '
   +theB(g.seat)+', at a weight of <b>'+g.load.toFixed(1)+'</b>.'
   +(loud?' The loudest address there is <b>'+esc(loud.k)+'</b>, at '+loud.sq.toFixed(1)+'.':''));
  if(D.T[1])p.push('After it, '+D.T.slice(1).map(function(x){return theB(x.seat)+' at '+x.load.toFixed(1);}).join(', then ')+'.');
  /* the product's own line, from ui/summary.js: under 4 is signal and not
     yet cost, so a level 5 reading of 0.4 is not called a wall */
  if(g.load<4)p.push((D.T.length>1?'All of it sits':'It sits')+' under the line of 4, which is signal and not yet cost.');
  var done=D.G.filter(function(x){return x.clear;});
  if(done.length)p.push(done.map(function(x){return '<b>'+esc(bare(ST.pairs[x.idx[0]].be))+'</b>';}).join(' and ')
   +' reads clear at '+(done.length===1?'its seat':'their seats')+'.');}
 else p.push('Every pair you wrote reads clear at its seat.');
 if(D.unresolved)p.push('The engine read no feeling out of '+(D.unresolved===1?'one second sentence':'some second sentences')
  +', so '+(D.unresolved===1?'that pair has':'those pairs have')+' no seat. Say it again with one in.');
 return '<div class="sv-sum"><div class="sv-eye">Summary</div>'+p.map(function(x){return '<p>'+x+'</p>';}).join('')+'</div>';}
function masksHTML(D){
 var seats={}; D.T.forEach(function(g){seats[g.seat]=g.k;});
 var rows=(D.r.maskRing||[]).map(function(mr){
  var m=MASKS.filter(function(x){return x.nm===mr.nm;})[0]||{};
  var over=(m.b||[]).filter(function(b){return seats[b];})[0];
  return {m:m, w:mr.w, over:over};});
 rows.sort(function(a,b){return (!!b.over-!!a.over)||(b.w-a.w);});
 return '<div><div class="sv-eye">Masks, worn over the seats in the way first</div><div class="sv-masks">'
  +rows.map(function(x){
   return '<button type="button" class="sv-mask'+(x.over?' on':'')+'" data-sv-mask="'+esc(x.m.nm)+'" style="--c:'+(x.over?col(seats[x.over]):'var(--mid)')+'" title="'+esc(x.m.v||'')+'">'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(x.m.ic||'')+'"/></svg>'
    +'<b>'+esc(x.m.nm)+'</b><span>'+(D.r.unread?'not read yet':'load '+x.w.toFixed(1))+'</span></button>';}).join('')
  +'</div></div>';}

/* ---------------- the prototype's own controls ---------------- */
function ctl(){
 return '<div class="sv-ctl" role="group" aria-label="Prototype controls">'
  +'<span class="sv-tag">Prototype</span>'
  +'<div class="sv-seg" role="radiogroup" aria-label="Whose reading">'
  +WHO.map(function(w){return '<button type="button" data-sv-who="'+w.k+'" aria-pressed="'+(ST.on&&ST.who===w.k)+'"><small>'+w.sub+'</small>'+w.nm+'</button>';}).join('')
  +'<button type="button" data-sv-off="1" aria-pressed="'+(!ST.on)+'"><small>Shipped</small>The Field</button></div>'
  +'<label class="sv-runs">Releases, one a day <input type="range" min="0" max="'+ST.max+'" step="1" value="'+ST.runs
  +'" aria-label="Aimed release runs since the pairs were written"><output>'+(ST.runs?ST.runs+(ST.runs===1?' day':' days'):'Day one')+'</output></label>'
  +'<div class="sv-seg" role="radiogroup" aria-label="What the centre reads">'
  +'<button type="button" data-sv-mode="cleared" aria-pressed="'+(ST.mode==='cleared')+'"><small>Centre, shipped rule</small>Cleared</button>'
  +'<button type="button" data-sv-mode="closed" aria-pressed="'+(ST.mode==='closed')+'"><small>Centre, alternative</small>Closed</button></div>'
  +'<div class="sv-seg" role="radiogroup" aria-label="Release card speed">'
  +'<button type="button" data-sv-fast="1" aria-pressed="'+ST.fast+'"><small>Release card</small>Fast</button>'
  +'<button type="button" data-sv-fast="0" aria-pressed="'+(!ST.fast)+'"><small>Release card</small>Real time</button></div>'
  +'</div>';}

/* ---------------- paint ---------------- */
function host(){
 var h=document.getElementById('sv7');
 if(!h){h=document.createElement('div');h.id='sv7';
  var cv=document.getElementById('cv');cv.parentNode.insertBefore(h,cv.nextSibling);}
 return h;}
function paint(){
 document.body.classList.toggle('sv-on',ST.on);
 var h=host(), f=document.getElementById('sv-float');
 if(!ST.on){h.innerHTML='';
  if(!f){f=document.createElement('div');f.id='sv-float';document.body.appendChild(f);}
  f.innerHTML=ctl();mark();return;}
 if(f)f.remove();
 var keepStory=(document.getElementById('sv-story')||{}).value||'';
 var D=read(), ideal=ST.pairs[0];
 h.innerHTML=ctl()
  +'<header class="sv-head"><h2>Seven Seats</h2>'+(ideal?'<p><span>Becoming</span> <b>'+esc(ideal.be)+'</b></p>'
    :'<p>Who you are becoming, and what stands in the way.</p>')+'</header>'
  +'<section class="sv-main"><div class="sv-fig">'+drawRing(D)+'</div>'+topHTML(D)+'</section>'
  +loopHTML(D)
  +'<section class="sv-read">'+sumHTML(D)+masksHTML(D)+'</section>';
 var ta=document.getElementById('sv-story'); if(ta&&keepStory)ta.value=keepStory;
 mark(D);}
function mark(D){
 D=D||(ST.on?read():null);
 document.documentElement.setAttribute('data-sv',[ST.on?ST.who:'off',ST.runs,ST.mode,ST.station,
  D&&D.pg?D.pg.pct:'-',D?D.closedPct:'-'].join('|'));}
function redraw(){render();paint();}

/* ---------------- the writes a person makes on this page ---------------- */
function doStory(){
 var ta=document.getElementById('sv-story'), t=(ta&&ta.value||'').trim();
 if(!t){ST.flash={at:'story',fail:true,msg:'Nothing to read. Write what happened first.'};return paint();}
 var ps=parseStory(t), tally={};
 (ps.imprints||[]).forEach(function(x){if(x&&x.band)tally[x.band]=(tally[x.band]||0)+(x.amt||1);});
 var bands=Object.keys(tally).sort(function(a,b){return tally[b]-tally[a];});
 if(!bands.length){ST.flash={at:'story',fail:true,msg:'Nothing landed. Say what your body did, and where.'};return paint();}
 compute(); ST.log.push({t:'story',text:t}); applyText(t); compute();
 var R=avRows(), hit=[];
 R.forEach(function(r,i){if(r.gap&&bands.indexOf(r.gap.seat)>=0)hit.push(bare(ST.pairs[i].be));});
 ST.flash={at:'story',msg:'Landed on '+bands.slice(0,3).map(theB).join(', ')+'.'
  +(hit.length?' That is the seat behind <b>'+esc(hit[0])+'</b>, so its gap just moved.':' None of your pairs sits there.')};
 ta.value=''; redraw();}
function doPair(){
 var be=((document.getElementById('sv-be')||{}).value||'').trim(), nb=((document.getElementById('sv-not')||{}).value||'').trim();
 var pr={be:be, notbe:nb};
 if(!avatarValid(pr)){ST.flash={at:'pair',fail:true,msg:'A pair is written as a pair. Both halves, or nothing.'};return paint();}
 compute(); var seat=readSeat(nb), load=null;
 if(seat){var grp=W.filter(function(n){return n.b===seat;});load=grp.reduce(function(a,n){return a+n.sq;},0)/Math.max(1,grp.length);}
 pr.load0=load; ST.pairs.push(pr); setPairs();
 ST.flash={at:'pair',fail:!seat,msg:seat?'The second sentence reads to '+theB(seat)+', at a weight of '+load.toFixed(1)+'.'
  :'The resolver could not read a feeling out of the second sentence. Say it again with one in.'};
 if(seat)ST.sel=seat;
 redraw();}
function doRelease(seat){
 compute(); var q=queueFor(seat);
 if(!q.length){status('Nothing is held at '+theB(seat)+', so there is nothing to release.','fail');return;}
 ST.pending={seat:seat}; RUN.speed=2.2;
 relPick(q.map(function(n){return n.i;}));}

/* the release card's last step, while this layer is on */
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
 ST.flash={at:'release',msg:g?(g.clear?theB(g.seat).replace(/^t/,'T')+' reads clear. The pair behind it is lit.'
   :theB(g.seat).replace(/^t/,'T')+' now carries '+g.load.toFixed(1)+'.'):'Released.'};
 ST.pending=null; RUN.speed=2.2;
 relRender(); redraw();};
window.relClose=function(){ST.pending=null;RUN.speed=2.2;return realClose.apply(this,arguments);};
/* Begin is where the timer starts, so fast is set there, after the card has
   printed its own honest run length */
document.addEventListener('click',function(e){
 if(e.target.closest&&e.target.closest('#relgo')&&ST.pending&&ST.fast)RUN.speed=0.3;},true);

document.addEventListener('click',function(e){
 var t=e.target.closest?e.target:null; if(!t)return;
 var b;
 if((b=t.closest('[data-sv-who]'))){ST.on=true;ST.runs=0;build(b.getAttribute('data-sv-who'));return redraw();}
 if((b=t.closest('[data-sv-off]'))){ST.on=false;return redraw();}
 if((b=t.closest('[data-sv-mode]'))){ST.mode=b.getAttribute('data-sv-mode');return paint();}
 if((b=t.closest('[data-sv-fast]'))){ST.fast=b.getAttribute('data-sv-fast')==='1';return paint();}
 if((b=t.closest('[data-sv-sel]'))){ST.sel=b.getAttribute('data-sv-sel');return paint();}
 if((b=t.closest('[data-sv-rel]')))return doRelease(b.getAttribute('data-sv-rel'));
 if((b=t.closest('[data-sv-st]'))){ST.station=b.getAttribute('data-sv-st');ST.flash=null;paint();
  var fid=b.getAttribute('data-sv-focus');
  var sec=document.querySelector('#sv7 .sv-loop');if(sec&&sec.scrollIntoView)sec.scrollIntoView({block:'nearest'});
  if(fid){var el=document.getElementById(fid);if(el)el.focus();}return;}
 if((b=t.closest('[data-sv-do]'))){var k=b.getAttribute('data-sv-do');
  if(k==='story')return doStory();
  if(k==='pair')return doPair();
  if(k==='ritdone'){ST.ritDone=true;return paint();}
  if(k==='ritopen'){ritOpen();return;}}
 if((b=t.closest('[data-sv-mask]'))){var nm=b.getAttribute('data-sv-mask');
  runMaskDrill(MASKS.filter(function(m){return m.nm===nm;})[0]);return;}});
document.addEventListener('keydown',function(e){
 var g=e.target.closest&&e.target.closest('.sv-peg');
 if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();ST.sel=g.getAttribute('data-sv-sel');paint();}});
document.addEventListener('input',function(e){
 if(e.target.closest&&e.target.closest('.sv-runs')){ST.runs=+e.target.value;settle();redraw();}});

function mount(o){
 o=o||{};
 ST.runs=+o.runs||0; ST.mode=o.mode||'cleared'; ST.on=o.who!=='off';
 setTab(TAB.FIELD);
 build(o.who&&o.who!=='off'?o.who:'James');
 if(o.station)ST.station=o.station;
 if(o.sel)ST.sel=o.sel;
 redraw();}
return {mount:mount, ST:ST, read:read, set:function(k,v){ST[k]=v;if(k==='runs')settle();redraw();},
 build:function(w){build(w);redraw();}};
})();
