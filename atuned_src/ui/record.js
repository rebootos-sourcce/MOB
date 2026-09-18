
/* ============================================================
   THE RECORD. Every snapshot the profile carries, and the
   distance between any two of them.

   The infrastructure for this existed and was spent on one
   sentence: snapshot() has been writing a full reading into
   CURP.history on every story commit and every release since
   the rebuild, and two places read it, one of them to count.

   What it reports and what it refuses to report matter equally.
   Charge deltas move with how a person happened to word a story,
   so a fall in charge is not evidence of anything on its own.
   Ground opened is evidence, because a line is either spoken at
   an address or it is not. So the record leads with unique
   ground and never says one number caused another.
   ============================================================ */
var REC_A=null, REC_B=null;

function recList(){
 var h=(CURP&&CURP.history)||[];
 return h.slice().sort(function(a,b){return new Date(a.t)-new Date(b.t);});}

function recWhen(t){
 var d=new Date(t); if(isNaN(d.getTime()))return '';
 var mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
 return d.getDate()+' '+mo+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}

function recDays(a,b){
 var d=(new Date(b.t)-new Date(a.t))/86400000;
 /* the plural has to read the same number the label prints, or an hour reads
    as "1 hours". */
 if(d<1){var hr=Math.max(1,Math.round(d*24)); return hr+' hour'+(hr===1?'':'s');}
 return Math.round(d)+' day'+(Math.round(d)===1?'':'s');}

/* one measured line. no causation, and a direction word only where the
   quantity has a direction a person would recognise. */
function recRow(label,a,b,dp,lowerIsBetter){
 var d=b-a, s=d>0?'+':'';
 var dir=Math.abs(d)<Math.pow(10,-dp)/2 ? 'level'
   : (lowerIsBetter ? (d<0?'lighter':'heavier') : (d>0?'up':'down'));
 return '<div class="rec-row"><span class="rec-k">'+esc(label)+'</span>'
  +'<span class="rec-a">'+a.toFixed(dp)+'</span>'
  +'<span class="rec-b">'+b.toFixed(dp)+'</span>'
  +'<span class="rec-d'+(dir==='level'?' lvl':'')+'">'+(dir==='level'?'level':s+d.toFixed(dp))+'</span></div>';}

function recRender(){
 var host=document.getElementById('rec'); if(!host)return;
 var H=recList(), m=meterRead(CURP);
 var h='<div class="pm-eye">The record</div>';
 if(H.length<2){
  h+='<p class="sum-p">'+(H.length?'One snapshot on file. ':'No snapshots yet. ')
   +'A snapshot is written every time a story is committed and every time a release finishes. '
   +'Two are needed before there is a distance to read.</p>';
  host.innerHTML=h; return;}

 if(REC_A===null||REC_A>=H.length)REC_A=0;
 if(REC_B===null||REC_B>=H.length)REC_B=H.length-1;
 if(REC_A>REC_B){var t=REC_A;REC_A=REC_B;REC_B=t;}
 var a=H[REC_A], b=H[REC_B];

 h+='<p class="sum-p">'+H.length+' snapshots. Pick any two. Charge moves with how a story '
  +'was worded, so a lighter number is not on its own evidence of anything. Ground opened is, '
  +'because a line was either spoken at an address or it was not.</p>';

 h+='<div class="rec-strip" role="listbox" aria-label="Snapshots">'
  +H.map(function(s,i){
    var on=(i===REC_A||i===REC_B);
    return '<button type="button" class="rec-p'+(on?' on':'')+'" data-rec="'+i+'" '
     +'style="--c:'+seatCol(s.dark||'Heart')+'" title="'+esc(recWhen(s.t))+', CQ '+s.cq+'">'
     +'<span class="rec-pb" style="height:'+Math.max(6,Math.round(s.cq))+'%"></span>'
     +(on?'<span class="rec-pm">'+(i===REC_A?'A':'B')+'</span>':'')+'</button>';}).join('')
  +'</div>';

 h+='<div class="rec-when"><span>'+esc(recWhen(a.t))+'</span>'
  +'<span class="rec-gap">'+recDays(a,b)+' apart</span>'
  +'<span>'+esc(recWhen(b.t))+'</span></div>';

 /* ground opened first, because it is the only one that cannot drift */
 h+='<div class="rec-lead"><div class="pm-eye">Ground opened, all time</div>'
  +'<div class="rec-big">'+m.unique+'</div>'
  +'<div class="sum-lc">'+(m.unique?'addresses and channels opened at least once, from '
    +m.lines+' lines spoken':'nothing opened yet')
  +(m.estimate?'. Your own horizon reads about '+m.estimate+', give or take '+(m.estimateHigh-m.estimate)+'.':'.')
  +'</div>';
 /* THE LADDER IS THEIRS. A threshold is a fraction of what a person is
    carrying, and what a person is carrying follows how long they have been
    alive to accumulate it. So the distance is computed against them the
    moment a birth date exists, and until it does the surface says whose
    numbers it is showing rather than letting a stranger's total read as
    their own. */
 if(m.next)
  h+='<div class="rec-next"><span class="pm-eye">Next</span>'
   +'<b>'+esc(m.next.nm)+'</b>'
   +'<span class="rec-nl">'+m.next.left+' of new ground away</span>'
   +'<span class="rec-ns">'+(m.scaled
     ?'your own scale, at '+m.next.at+' of about '+m.estimate
     :'the reference scale. Give a birth date and this becomes yours')+'</span>'
   +'</div>';
 h+='</div>';

 h+='<div class="rec-hd"><span class="rec-k">Reading</span><span class="rec-a">A</span>'
  +'<span class="rec-b">B</span><span class="rec-d">move</span></div>'
  +recRow('Coherence',a.cq,b.cq,1,false)
  +recRow('Shadow weight',a.dq,b.dq,1,true)
  +recRow('Segment depth',a.sq,b.sq,2,true)
  +recRow('Opposite installed',a.pole,b.pole,2,false)
  +recRow('Jouissance',a.jq,b.jq,2,true)
  +recRow('Addresses carrying',a.loaded,b.loaded,0,true)
  +recRow('Saboteurs',a.sab,b.sab,0,true)
  +recRow('Complexes',a.cx,b.cx,0,true)
  +recRow('Hyper',a.hy,b.hy,0,true)
  +recRow('Character',a.ch,b.ch,0,true);

 var moved=[];
 if(a.tier!==b.tier)moved.push('the tier read '+a.tier.toLowerCase()+' and now reads '+b.tier.toLowerCase());
 if(a.dark!==b.dark)moved.push('the heaviest seat moved from the '+a.dark.toLowerCase()+' to the '+b.dark.toLowerCase());
 if(a.arch!==b.arch)moved.push('the primary archetype moved from '+a.arch+' to '+b.arch);
 h+='<p class="sum-p" style="margin-top:14px">'+(moved.length
   ? 'Between these two, '+moved.join(', and ')+'.'
   : 'Between these two, the tier, the heaviest seat and the primary archetype all held.')
  +' What moved them is not in this record.</p>';

 host.innerHTML=h;
 host.querySelectorAll('[data-rec]').forEach(function(el){el.onclick=function(){
  var i=+el.getAttribute('data-rec');
  /* nearest end moves, so one click always does something legible */
  if(Math.abs(i-REC_A)<=Math.abs(i-REC_B))REC_A=i; else REC_B=i;
  if(REC_A===REC_B){ if(REC_B<recList().length-1)REC_B++; else REC_A--; }
  recRender();};});}
