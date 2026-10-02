/* ============================================================
   YOUR PATTERNS. The trace graph on a screen, F23 in the pass 3 funnel spec:
   "P18a loopRead (confirmed patterns, practice history, misses, declines)
   and P18b, one Next. Its home is the Field's side column, where the app
   opens; Summary's pinned card is the same component."

   ONE COMPONENT, TWO HOMES, NEVER BOTH ON ONE SCREEN. loopHtml writes the
   whole block. The Field's right column carries it as a folding section,
   #loopside, shown on the Field only (head.html), and Summary carries it as
   its own named zone, #sumloop, through sumLoopSlot. The rail is on every tab
   and Summary's card is on Summary, so the rail section is hidden everywhere
   but the Field: the same block twice on one screen would be one answer
   asked for twice.

   A SEPARATE, NAMED BLOCK ON SUMMARY. Another seat builds the Daily Summary
   into the same page through sumDaySlot and sumDayHtml in ui/summary.js. This
   touches neither. Summary calls sumLoopSlot once, on a line of its own, and
   everything else lives in this file.

   WHAT IT READS. engine/loop.js, loopRead, and nothing else. No renderer
   walks the graph. The read is cached against a fingerprint of the parts of
   the record the graph is built from, because render() runs on every slider
   move and the graph parses every story entry.

   SILENT ON AN UNREAD FIELD, like every surface that prints a reading.
   NO DAY COUNT. Nothing here prints how many days anything has run.
   EVERY TERM CARRIES ITS MEANING, from engine/data/gloss.js, through unp().
   ============================================================ */
var LP={memo:null, sig:'', all:false, open:{}, wired:false};

/* the parts of the record traceFromRecord reads, and nothing else */
function loopSig(p){
 if(!p)return '';
 try{
  var es=(p.story&&p.story.entries)||[];
  return JSON.stringify([p.id||null, es.map(function(e){return [e&&e.t,e&&e.text&&e.text.length,e&&e.lex];}),
   (p.meter&&p.meter.unique)||[], (p.rituals||[]).map(function(x){return [x&&x.t,x&&x.done];}),
   p.practice||null, p.trace||null, p.soul||null]);}
 catch(e){return String(Math.random());}}
function loopOf(p){
 var s=loopSig(p);
 if(LP.memo&&s===LP.sig)return LP.memo;
 var L=null; try{L=loopRead(p);}catch(e){L=null;}
 LP.memo=L; LP.sig=s; return L;}

/* a count. A zero is a dash, and the label is one word that carries its
   meaning on itself. */
function lpFig(term,label,n){
 return '<div class="lp-f"><span class="lp-fl">'+unp(term,label)+'</span>'
  +'<b class="lp-fv">'+(n?String(n):'–')+'</b></div>';}
function lpPlural(n,one,many){return n+' '+(n===1?one:many);}

/* THE WHY CHAIN for one pattern: each step on the record from what was
   written to what was done about it, in that order, and only the steps the
   record holds, except the answer, which always says where it stands. */
function lpChain(x){
 var st=[];
 if(x.stories)st.push(['Written',lpPlural(x.stories,'entry','entries')+', '
  +(x.named?unp('from your words'):unp('from the seat'))]);
 var op=[];
 if(x.lines)op.push(x.lines+' '+unp('release line',x.lines===1?'release line':'release lines'));
 if(x.truths)op.push(x.truths+' '+unp('truth line',x.truths===1?'truth line':'truth lines'));
 st.push(['Opened',op.length?op.join(', '):'nothing opened here yet']);
 if(x.protocols.length)st.push(['Practice',lpPlural(x.protocols.length,'practice aims','practices aim')+' here'
  +(x.practised?', '+unp('practised','practised')+' '+lpPlural(x.practised,'time','times'):'')]);
 if(x.evFor||x.evAgainst)st.push(['Evidence',unp('evidence',x.evFor+' for')+', '+x.evAgainst+' against']);
 /* WHAT YOU SAID CHANGED after each release here, the answers counted in the
    order the question offers them, in the question's own words (RV_SAY). A
    step of its own and never folded into Evidence above: an answer is what
    the person said, and Evidence counts what bears for or against. */
 if(x.said&&x.said.n){
  var said=RV_ANSWERS.filter(function(k){return x.said.by[k];}).map(function(k){
   return '"'+RV_SAY[k]+'" after '+lpPlural(x.said.by[k],'release','releases');});
  var none=x.said.by[RV_SKIP]||0;
  st.push(['After',(said.length?'You said '+said.join(', ')+'.':'')
   +(none?(said.length?' ':'')+'No answer after '+lpPlural(none,'release','releases')+'.':'')]);}
 st.push(['Answer',x.state==='confirmed'
  ?(x.by==='protocol'?'You chose a practice for it':'You said yes to it')
  :'Not answered yet']);
 return '<ol class="lp-chain" aria-label="Why chain">'+st.map(function(s){
  return '<li><span class="lp-cl">'+s[0]+'</span><span class="lp-cv">'+s[1]+'</span></li>';}).join('')+'</ol>';}

function lpRow(x,i){
 var open=LP.open[x.key]!==undefined?LP.open[x.key]:i===0;
 var seat=x.seat?unp(String(x.seat).toLowerCase(),x.seat+' seat','seat'):'';
 return '<details class="lp-p" data-lpk="'+esc(x.key)+'"'+(open?' open':'')+'>'
  +'<summary><span class="lp-pn"><b>'+esc(x.name)+'</b>'+(seat?'<em>'+seat+'</em>':'')+'</span>'
  +'<span class="lp-st lp-'+x.state+'">'+(x.state==='confirmed'?'Confirmed':'Unanswered')+'</span></summary>'
  +lpChain(x)+'</details>';}

function loopHtml(r,where){
 if(!r||r.unread)return '';
 var p=(typeof CURP!=='undefined')?CURP:null;
 var L=loopOf(p); if(!L)return '';
 /* two halves: the counts, the one Next and what was turned down or not
    done on one side, and the patterns with their chains on the other. On
    the rail and on a phone the halves stack; on Summary they stand side by
    side, so the list is not squeezed into four narrow columns. */
 var a='<div class="lp-figs">'+lpFig('confirmed','Confirmed',L.confirmed)+lpFig('unanswered','Unanswered',L.unanswered)
  +lpFig('declined','Declined',L.declined.length)+lpFig('practised','Practised',L.practice.events)+'</div>';
 var b='';
 if(!L.patterns.length){
  b+='<p class="lp-note">Nothing read yet, so no '+unp('pattern')+' is traced. Write what happened and each '
   +'pattern lands here with the words that placed it.</p>';}
 else{
  /* THE ONE NEXT, because it is the one thing on the block a person can
     press, and it names the pattern it acts on */
  if(L.next)a+='<div class="lp-next"><span class="lp-cl">Next</span>'
   +'<span class="lp-nx">'+esc(L.next.name)+' came '+unp('from your words')+' and has no line opened yet.</span>'
   +'<button type="button" class="btn lp-go" data-lprel="'+L.next.address+'">Run a release</button></div>';
  var show=LP.all?L.patterns:L.patterns.slice(0,LOOP_SHOW);
  b+='<div class="lp-list">'+show.map(lpRow).join('')+'</div>';
  if(L.more)b+='<button type="button" class="btn lp-all" data-lpall="1" aria-expanded="'+(LP.all?'true':'false')+'">'
   +(LP.all?'Show the first '+LOOP_SHOW:'Show all '+L.patterns.length)+'</button>';}
 if(L.declined.length)a+='<div class="lp-dec"><span class="lp-cl">'+unp('declined','Declined')+'</span><ul>'
  +L.declined.map(function(d){
   var what=d.patterns.length?d.patterns.join(', '):'no named pattern';
   return '<li>A '+esc(d.cls||'')+' practice for '+esc(what)+'. '
    +(d.why?esc(d.why):'No reason was recorded.')+'</li>';}).join('')+'</ul></div>';
 if(L.misses.length)a+='<div class="lp-dec"><span class="lp-cl">'+unp('not done','Not done')+'</span><ul>'
  +L.misses.map(function(m){
   return '<li>A ritual came due '+lpPlural(m.run,'time','times in a row')+' and was not marked done. '
    +'Change when it runs or how long it takes.</li>';}).join('')+'</ul></div>';
 return '<div class="lp lp-'+(where||'rail')+'"><div class="lp-a">'+a+'</div><div class="lp-b">'+b+'</div></div>';}

/* SUMMARY'S ZONE. One call from sumFull, on a line of its own. The heading
   is written here with the zone classes Summary already styles, so nothing in
   ui/summary.js has to learn this block's icon. */
var LP_IC='<circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="12" r="2.6"/><circle cx="6" cy="18" r="2.6"/>'
 +'<path d="M8.4 7.2l7.2 3.6M15.6 13.2l-7.2 3.6"/>';
function sumLoopSlot(r){
 var body=loopHtml(r,'sum'); if(!body)return '';
 return '<section id="sumloop" class="sg-z sg-loop" data-slot="loop" data-grp="loop" aria-labelledby="sg-h-loop">'
  +'<h2 class="sg-zh" id="sg-h-loop"><svg class="sg-ic" viewBox="0 0 24 24" aria-hidden="true">'+LP_IC+'</svg>'
  +'<span>Your patterns</span></h2>'+body+'</section>';}

/* THE FIELD'S SIDE COLUMN. Painted from render() on every tab, and empty
   anywhere but the Field, so a hidden section never holds a stale reading. */
function loopPaint(r){
 var h=document.getElementById('loopside'); if(!h)return;
 var onField=document.body.classList.contains('tab-field');
 var html=onField?loopHtml(r,'rail'):'';
 var sec=h.closest?h.closest('.lsec'):null;
 if(sec)sec.classList.toggle('lp-none',!html);
 if(h.innerHTML!==html)h.innerHTML=html;
 loopWire();}

function loopRepaint(){
 var r=(typeof computeSeen==='function')?computeSeen():null;
 loopPaint(r);
 if(document.body.classList.contains('tab-summary')&&typeof sumRender==='function')sumRender();}

/* WIRED ONCE, on the document, so both homes answer the same way and neither
   host's own click handler has to know this block exists. */
function loopWire(){
 if(LP.wired)return; LP.wired=true;
 document.addEventListener('toggle',function(ev){var d=ev.target;
  if(d&&d.getAttribute&&d.getAttribute('data-lpk'))LP.open[d.getAttribute('data-lpk')]=d.open;},true);
 document.addEventListener('click',function(ev){
  var b=ev.target&&ev.target.closest?ev.target.closest('[data-lprel],[data-lpall]'):null;
  if(!b)return;
  if(b.hasAttribute('data-lpall')){LP.all=!LP.all; loopRepaint(); return;}
  var n=+b.getAttribute('data-lprel');
  if(!isNaN(n)&&typeof relPick==='function')relPick([n]);});}
