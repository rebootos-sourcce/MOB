/* ============================================================
   THE VERDICT SHEET. Reads shots/facts.json (written by shoot.js) and
   returns the HTML the page opens as a sheet over itself, with a close and
   Escape, never a link to anywhere else (the EA ruling).

   Every number here is computed from the facts at build time. The words
   around them are the reading, and the reactions are simulated: one model
   reading six persona records, said so on the sheet.
   ============================================================ */
const PEOPLE=['Sofia','Diane','Marcus','Angela','Derek','James'];
const LAYS=[['graded','Graded, D minus'],['ring','Ring'],['three','Three'],['story','Story'],['loop','Loop'],['told','Told']];
const REACT=require('./reactions.js');
function mean(a){a=a.filter(x=>x!=null&&!isNaN(x));return a.length?a.reduce((s,x)=>s+x,0)/a.length:null;}
function f1(x){return x==null?'-':(Math.round(x*10)/10).toString();}
function f0(x){return x==null?'-':Math.round(x).toString();}
function count(a){return a.filter(Boolean).length;}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

function computeAll(F){
 const agg={};
 LAYS.forEach(([L])=>{agg[L]={};[1600,390].forEach(W=>{
  const fs=PEOPLE.map(p=>F.first[L+'-'+p+'-'+W]).filter(Boolean);
  const rs=PEOPLE.map(p=>F.release[L+'-'+p+'-'+W]).filter(Boolean);
  const js=PEOPLE.map(p=>F.journal[L+'-'+p+'-'+W]).filter(Boolean);
  const ri=PEOPLE.map(p=>F.ritual[L+'-'+p+'-'+W]).filter(Boolean);
  const bl=F.blank[L+'-'+W]||{};
  agg[L][W]={n:fs.length,
   ctl:mean(fs.map(x=>x.controlsFirst)), ctlAll:mean(fs.map(x=>x.controlsSurface)), whole:mean(fs.map(x=>x.controlsWholeScreen)),
   words:mean(fs.map(x=>x.wordsFirst)), figs:mean(fs.map(x=>x.figuresFirst)),
   glance:mean(fs.map(x=>x.glance)), glance3:count(fs.map(x=>x.glance===3)),
   order:count(fs.map(x=>x.order)), storyTold:count(fs.map(x=>x.order&&x.glance===3)), actionSeen:count(fs.map(x=>x.actionSeen)), before:mean(fs.map(x=>x.wordsBeforeAction)),
   at:mean(fs.map(x=>x.actionAt)), fig:mean(fs.map(x=>x.figureShare)), moving:mean(fs.map(x=>x.movingOnLanding)),
   small:mean(fs.map(x=>x.small.length)), sideways:count(fs.map(x=>x.sideways)),
   ritFirst:count(fs.map(x=>x.ritualNamedFirst)),
   relSeen:count(rs.map(x=>x.resultSeen)), relNext:count(rs.map(x=>x.nextSeen)), relFell:count(rs.map(x=>x.fell)),
   relSteps:mean(rs.map(x=>x.presses+x.scrolls)),
   jSteps:mean(js.map(x=>x.presses+x.scrolls)), jSeen:count(js.map(x=>x.resultSeen)),
   rit:mean(ri.map(x=>x.presses==null?null:x.presses)), ritMiss:count(ri.map(x=>x.presses==null)),
   bCtl:bl.controlsFirst, bWords:bl.wordsFirst, bWrite:bl.write?bl.write.presses+bl.write.scrolls:null, bSeen:bl.write?bl.write.resultSeen:null};});});
 /* THE SCORE. His five criteria, in his words, each 0 to 1 per width, then
    the loop, which is the product's own spine. Written down so the ranking
    can be argued with rather than taken on trust.
    A first scoring gave every criterion its own ceiling and no gates. It put
    the graded layout within a point of the rest, because an empty first
    screen on a phone scored as uncluttered. That was the measurement failing,
    so two gates went in: clutter only counts against a first screen that
    carries the three things, and a story only counts if it is told on the
    first screen, because his criterion is a glance and not a scroll. */
 const cl=(v)=>Math.max(0,Math.min(1,v));
 const score={};
 LAYS.forEach(([L])=>{if(!agg[L][1600].n)return;let s=0,parts={};[1600,390].forEach(W=>{const a=agg[L][W];
  const clutter=(cl(1-(a.ctl-6)/12)+cl(1-(a.words-50)/150))/2;
  parts[W]={
   fold:(a.glance/3)*(0.5+0.5*clutter),
   info:0.5*cl(1-a.figs/4)+0.5*cl(1-(a.before-15)/65),
   looks:0.7*cl(a.fig/40)+(a.moving>0?0.3:0),
   story:a.storyTold/a.n,
   act:(a.actionSeen/a.n)*(1-0.6*cl(((a.at||0)-700)/1800)),
   loop:(a.relSeen+a.relNext+a.jSeen)/(3*a.n)};
  const v=parts[W]; s+=(v.fold+v.info+v.looks+v.story+v.act+v.loop)/6;});
  score[L]={total:s/2,parts};});
 const rank=LAYS.map(([L])=>L).filter(L=>agg[L][1600].n).sort((a,b)=>score[b].total-score[a].total);
 return {agg,score,rank};}
module.exports=function(F,commit){
 const {agg,score,rank}=computeAll(F);
 const win=rank[0], winNm=LAYS.filter(x=>x[0]===win)[0][1];
 const lvl=p=>F.people[p]?F.people[p].level:null;

 const best=(W,key,lowIsGood)=>{const vals=LAYS.map(([L])=>agg[L][W][key]).filter(v=>v!=null);
  return v=>v!=null&&(lowIsGood?v===Math.min.apply(null,vals):v===Math.max.apply(null,vals));};
 const row=(label,key,fmt,low,W)=>{const b=best(W,key,low);
  return '<tr><td>'+label+'</td>'+LAYS.map(([L])=>{const v=agg[L][W][key];return '<td class="'+(b(v)?'best':'')+'">'+fmt(v,agg[L][W])+'</td>';}).join('')+'</tr>';};
 const of6=(v,a)=>v==null?'-':v+' of '+a.n;
 const table=W=>'<div class="wrap"><table><tr><th>'+(W===1600?'At a desk, 1600 by 1000':'On a phone, 390 by 844')+'</th>'+LAYS.map(x=>'<th>'+x[1]+'</th>').join('')+'</tr>'
  +row('Controls on the first screen of the page','ctl',f1,true,W)
  +row('Words on the first screen of the page','words',f0,true,W)
  +row('Bare figures on the first screen','figs',f1,true,W)
  +row('At a glance: ideal, their words, the action (of 3)','glance',f1,false,W)
  +row('Those three read top to bottom, in order','order',of6,false,W)
  +row('The story told on the first screen: all three, in order','storyTold',of6,false,W)
  +row('The action whole on the first screen, 44 pixels or more','actionSeen',of6,false,W)
  +row('Words read before the action','before',f0,true,W)
  +row('Milliseconds before the action is on screen','at',f0,true,W)
  +row('Figure, share of the first screen (percent)','fig',f0,false,W)
  +row('Release walked: the result shown in view','relSeen',of6,false,W)
  +row('Release walked: the next step shown in view','relNext',of6,false,W)
  +row('Presses and scrolls, landing to release run','relSteps',f1,true,W)
  +row('Journal entry typed: the result in view','jSeen',of6,false,W)
  +row('Presses to the ritual for the lead','rit',f1,true,W)
  +row('A stranger: controls on the first screen','bCtl',f0,true,W)
  +row('A stranger: presses and scrolls to write the pair','bWrite',f0,true,W)
  +row('Controls under 44 pixels','small',f1,true,W)
  +'</table></div>';

 let h='<h2>'+esc(REACT.headline(winNm))+'</h2>'
  +'<p class="lede">'+REACT.lede+'</p>'
  +'<div class="open-row">'+LAYS.map(([L,nm])=>'<button type="button" data-s4-openL="'+L+'" class="'+(L===win?'win':'')+'">Open '+nm+'</button>').join('')+'</div>'
  +'<div class="finding">'+REACT.verdict(agg,score,rank)+'</div>'
  +'<h3>What was measured</h3><p>The mean over the six reference people, each loaded with their own story bank and their own pairs, on build '+esc(commit)
  +'. The first screen is the page itself, from where it starts to the bottom of the window; the Field\'s own header and rails are the same on every layout and are counted apart. Best in each row is in white.</p>'
  +table(1600)+table(390)
  +'<p class="rests">Floors: page errors at 1600 '+(F.floors[1600]?F.floors[1600].pageErrorCount:'-')+', at 390 '+(F.floors[390]?F.floors[390].pageErrorCount:'-')
  +'; requests leaving the file '+((F.floors[1600]||{outboundRequests:[]}).outboundRequests.length+(F.floors[390]||{outboundRequests:[]}).outboundRequests.length)
  +'; sideways scroll at 390 on '+LAYS.reduce((s,[L])=>s+agg[L][390].sideways,0)+' of '+(LAYS.length*6)+' screens. Every release walked here ran on the shipped release card and its weight fell at the seat it aimed at: '
  +LAYS.map(([L,nm])=>nm+' '+(agg[L][1600].relFell+agg[L][390].relFell)+' of 12').join(', ')+'.</p>'
  +'<h3>How the ranking was scored</h3><p>'+REACT.scoring+'</p><div class="wrap"><table><tr><th>Layout</th><th>Above the fold</th><th>How it displays</th><th>How it looks</th><th>Tells a story</th><th>What to do, at a glance</th><th>The loop closes</th><th>Overall, of 10</th></tr>'
  +rank.map(L=>{const s=score[L], pw=k=>f1((s.parts[1600][k]+s.parts[390][k])/2*10);
   return '<tr><td><b>'+LAYS.filter(x=>x[0]===L)[0][1]+'</b></td><td>'+pw('fold')+'</td><td>'+pw('info')+'</td><td>'+pw('looks')+'</td><td>'+pw('story')+'</td><td>'+pw('act')+'</td><td>'+pw('loop')+'</td><td class="'+(L===win?'best':'')+'">'+f1(s.total*10)+'</td></tr>';}).join('')
  +'</table></div>'
  +'<h3>The six, on all five</h3><p>Simulated. One model reading the six persona records in engine/data/people.js and RESEARCH-icp.md, with each person\'s measured numbers under their words. Nobody said any of it. Grid level is each person\'s own band off the engine, read at run time.</p>'
  +'<div class="wrap"><table><tr><th>Person</th>'+LAYS.map(x=>'<th>'+x[1]+'</th>').join('')+'</tr>'
  +PEOPLE.map(p=>'<tr><td><b>'+p+'</b>'+(lvl(p)?', level '+lvl(p):'')+'<br><span class="rests">'+esc(REACT.who[p]||'')+'</span></td>'+LAYS.map(([L])=>{
   const r=(REACT.react[p]||{})[L]||['hold','',''];
   const m1=F.first[L+'-'+p+'-1600']||{}, m3=F.first[L+'-'+p+'-390']||{};
   return '<td><span class="tag '+r[0]+'">'+r[0].toUpperCase()+'</span><p class="voice">'+esc(r[1])+'</p><p class="rests">Glance '+(m1.glance!=null?m1.glance:'-')+' and '+(m3.glance!=null?m3.glance:'-')+' of 3. '+esc(r[2]||'')+'</p></td>';}).join('')+'</tr>').join('')
  +'</table></div>'
  +'<h3>What was looked at first</h3>'+REACT.research
  +'<h3>Found underneath, not about layout</h3>'+REACT.found
  +(REACT.questions?'<h3>For him</h3>'+REACT.questions:'')
  +'<p class="rests">Every layout here is laid over build '+esc(commit)+' and uses the shipped mechanic: the pairs through the real resolver, one gap per seat, the top three by real seat weight, the shipped release card, and the ritual the product itself calls for that seat. The pairs for all six are illustrative, written in each person\'s voice, because no reference person carries any and nothing shipped can write one yet.</p>';
 return h;};
module.exports.computeAll=computeAll;
