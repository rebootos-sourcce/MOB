/* The new content for two pages, written to run INSIDE the real app (source.html).
   It uses the product's own classes (.st-pan, .av-card, .pm-eye, .btn, .avs-subs),
   its own tokens, and its own ring badge component crBadge(). Only the pieces the
   product does not have are styled here, in MOCK_CSS, from the same tokens.
   Worked example: a founder, 46 (the Diane reference person), Fri 2 Oct 2026. */
(function(){
"use strict";
var BAND={crown:'Crown',eye:'3rd Eye',throat:'Throat',heart:'Heart',solar:'Solar',sacral:'Sacral',root:'Root'};
var NAME={crown:'Crown',eye:'Third eye',throat:'Throat',heart:'Heart',solar:'Solar plexus',sacral:'Sacral',root:'Root'};
var SEATS=[{k:'crown',y:4.98},{k:'eye',y:10.57},{k:'throat',y:20.91},{k:'heart',y:30.51},{k:'solar',y:40.21},{k:'sacral',y:47.02},{k:'root',y:53.55}];
/* glyphs, 24 box, drawn the way the product's own SEATGLYPH are: stroke only, round caps */
var G={
 feel:'<circle cx="12" cy="12" r="6.5"/><path d="M9 12.2c1-1.4 2-1.4 3 0s2 1.4 3 0"/>',
 where:'<path d="M12 19s-5-4.2-5-8a5 5 0 0 1 10 0c0 3.8-5 8-5 8z"/><circle cx="12" cy="11" r="1.7"/>',
 story:'<path d="M7.5 5h6.5l3 3v11h-9.5z"/><path d="M10 12h5M10 15h5"/>',
 imprint:'<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2.3"/>',
 release:'<path d="M16.5 8A6 6 0 1 0 18 12"/><path d="M12.5 11.5 18 6M14 6h4v4"/>',
 ritual:'<path d="M6.5 11.5a5.5 5.5 0 0 1 9.6-3L17.5 10M17.5 12.5a5.5 5.5 0 0 1-9.6 3L6.5 14"/><path d="M17.5 6v4h-4M6.5 18v-4h4"/>',
 statement:'<path d="M6 7h12v8h-7l-3 3v-3H6z"/>',
 eye:'<path d="M5 12s2.6-4.5 7-4.5S19 12 19 12s-2.6 4.5-7 4.5S5 12 5 12z"/><circle cx="12" cy="12" r="2"/>',
 play:'<path d="M10 8.5v7l5.5-3.5z"/>',
 flow:'<path d="M5.5 10c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4 0M5.5 14.5c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4 0"/>',
 embody:'<circle cx="12" cy="7" r="1.8"/><path d="M12 9.5v4.5M8 11l4-1 4 1M12 14l-2.2 4.5M12 14l2.2 4.5"/>',
 avatar:'<circle cx="12" cy="9" r="3"/><path d="M6.5 18c.8-3.2 3-4.8 5.5-4.8s4.7 1.6 5.5 4.8"/>',
 psyche:'<circle cx="9.5" cy="12" r="3.8"/><circle cx="14.5" cy="12" r="3.8"/>',
 body:'<circle cx="12" cy="7" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="17" r="1.8"/>',
 mask:'<circle cx="12" cy="12" r="6.5"/><path d="M9.3 11h.01M14.7 11h.01M9.7 14.4c1.4.9 3.2.9 4.6 0"/>',
 lock:'<rect x="7" y="11" width="10" height="7" rx="2"/><path d="M9.5 11V9a2.5 2.5 0 0 1 5 0v2"/>',
 held:'<circle cx="12" cy="12" r="6.5"/><path d="M9 12h6"/>',
 check:'<path d="M8 12.5l2.7 2.7L16 9.5"/>',
 x:'<path d="M9 9l6 6M15 9l-6 6"/>',
 arrow:'<path d="M7 12h10M13 8l4 4-4 4"/>',
 mic:'<rect x="10" y="6" width="4" height="7" rx="2"/><path d="M7.5 11.5a4.5 4.5 0 0 0 9 0M12 16v2"/>'
};
var TYPES=[ /* TDD section 17: the six intervention types. Exact colours belong to the design system; these are muted and sit apart from the seven seat hues by form as well as colour. */
 {k:'release',n:'Release',c:'#8FA3B8',m:'let a pattern go'},
 {k:'reframe',n:'Reframe',c:'#B9A58C',m:'change the sentence you tell yourself'},
 {k:'behavior',n:'Behavior',c:'#8FB39B',m:'do the new thing'},
 {k:'integrity',n:'Integrity',c:'#B88C8C',m:'keep a promise to yourself'},
 {k:'embodiment',n:'Embodiment',c:'#A596B8',m:'feel it in the body'},
 {k:'observation',n:'Observation',c:'#9AA7A0',m:'notice it and write it down'}];
var TC={};TYPES.forEach(function(t){TC[t.k]=t});

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
/* the product's own ring badge, bare, with a glyph of ours inside */
function bdg(glyph,col,size,pct){
 return crBadge('Heart',pct==null?100:pct,{size:size||'sm',bare:true,glyph:G[glyph]||glyph,color:col||'var(--accent)'});}
function seatBdg(k,pct,size){return crBadge(BAND[k],pct==null?0:pct,{size:size||'xs',bare:true});}
function head(glyph,title,meaning,col){
 return '<div class="mk-hd">'+bdg(glyph,col)+'<div><b>'+title+'</b><span>'+meaning+'</span></div></div>';}
function chip(label,on,data){return '<button type="button" class="btn mk-chip" aria-pressed="'+(on?'true':'false')+'"'+(data||'')+'>'+label+'</button>';}
function sr(k,dash){return '<i class="mk-sr'+(dash?' d':'')+'" style="--c:var(--'+k+')"></i>';}

/* ================= THE FIGURE, one drawing used by every page ================= */
var BODY='M45.8 15.5 L45.6 19.6 C41 20.6 36 21.8 33.5 24.2 C31.8 26 31 30 30.2 36 L28.8 46 L27.4 55 L29.8 55.6 L31.8 46.5 L33.8 38 C34.8 34.5 35.5 33 36 32.2 L36 47 C36 50 36.8 53 37.4 56 L38.4 77 L38 98 L37.4 99.6 L44.8 99.6 L45 98 L47.2 78 L48.6 62 L49.2 57.6 L50.8 57.6 L51.4 62 L52.8 78 L55 98 L55.2 99.6 L62.6 99.6 L62 98 L61.6 77 L62.6 56 C63.2 53 64 50 64 47 L64 32.2 C64.5 33 65.2 34.5 66.2 38 L68.2 46.5 L70.2 55.6 L72.6 55 L71.2 46 L69.8 36 C69 30 68.2 26 66.5 24.2 C64 21.8 59 20.6 54.4 19.6 L54.2 15.5';
/* the segment bands the armature hangs off each seat, in figure units */
var BANDS=[{k:'crown',a:-2,b:8},{k:'eye',a:8,b:16.6},{k:'throat',a:16.6,b:26},{k:'heart',a:26,b:36},{k:'solar',a:36,b:44},{k:'sacral',a:44,b:50.5},{k:'root',a:50.5,b:101}];
/* o.reach: seats the record has reached (solid line work, ring arcs). o.touch, o.empty: arc lengths 0..1.
   o.stand, o.reachEnd, o.carry: gauge ends 0..1 per seat. Nothing here is a score and nothing is printed. */
function armature(o){
 var id=o.id,g='<g class="mk-fig">';
 g+='<defs>';
 BANDS.forEach(function(b){g+='<clipPath id="'+id+'c'+b.k+'"><rect x="0" y="'+b.a+'" width="100" height="'+(b.b-b.a)+'"/></clipPath>';});
 SEATS.forEach(function(s){g+='<radialGradient id="'+id+'g'+s.k+'"><stop offset="0" stop-color="var(--'+s.k+')" stop-opacity=".62"/><stop offset="1" stop-color="var(--'+s.k+')" stop-opacity="0"/></radialGradient>';});
 g+='<radialGradient id="'+id+'fl"><stop offset="0" stop-color="var(--sacral)" stop-opacity=".14"/><stop offset="1" stop-color="var(--sacral)" stop-opacity="0"/></radialGradient></defs>';
 g+='<ellipse cx="50" cy="100.5" rx="24" ry="2.6" fill="url(#'+id+'fl)"/>';
 g+='<path d="M50 6 L50 56" stroke="var(--ink)" stroke-opacity=".16" stroke-width="1" fill="none"/>';
 BANDS.forEach(function(b){
  var on=o.reach.indexOf(b.k)>=0;
  g+='<g clip-path="url(#'+id+'c'+b.k+')">'
   +'<ellipse cx="50" cy="8.5" rx="6.4" ry="7.6" fill="none" stroke="var(--'+b.k+')" stroke-width="1.5" stroke-opacity="'+(on?.95:.5)+'"'+(on?'':' stroke-dasharray="3 4"')+'/>'
   +'<path d="'+BODY+'" fill="none" stroke="var(--'+b.k+')" stroke-width="1.5" stroke-opacity="'+(on?.95:.5)+'" stroke-linejoin="round" stroke-linecap="round"'+(on?'':' stroke-dasharray="3 4"')+'/></g>';});
 SEATS.forEach(function(s){
  var on=o.reach.indexOf(s.k)>=0,r=(s.k==='heart'?3.3:3);
  if(on){
   var C=2*Math.PI*r,t=(o.touch&&o.touch[s.k])||.7,e=(o.empty&&o.empty[s.k])||.4;
   g+='<circle class="mk-glow" cx="50" cy="'+s.y+'" r="11" fill="url(#'+id+'g'+s.k+')"/>';
   g+='<circle cx="50" cy="'+s.y+'" r="'+r+'" fill="var(--panel-2)" stroke="var(--'+s.k+')" stroke-opacity=".28" stroke-width="2.4"/>';
   g+='<circle cx="50" cy="'+s.y+'" r="'+r+'" fill="none" stroke="var(--'+s.k+')" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="'+(C*t).toFixed(2)+' '+C.toFixed(2)+'" transform="rotate(-90 50 '+s.y+')"/>';
   var r2=r-1.7,C2=2*Math.PI*r2;
   g+='<circle cx="50" cy="'+s.y+'" r="'+r2+'" fill="none" stroke="var(--'+s.k+')" stroke-opacity=".85" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="'+(C2*e).toFixed(2)+' '+C2.toFixed(2)+'" transform="rotate(-90 50 '+s.y+')"/>';
   if(o.newest===s.k)g+='<circle class="mk-pulse" cx="50" cy="'+s.y+'" r="'+r+'" fill="none" stroke="var(--'+s.k+')" stroke-width="1.4"/>';
  }else{
   g+='<circle cx="50" cy="'+s.y+'" r="'+r+'" fill="var(--panel-2)" stroke="var(--ink)" stroke-opacity=".45" stroke-width="1.3" stroke-dasharray="2 2.4"/>';
  }
 });
 return g+'</g>';
}
/* the gauge beside each seat: dotted to the reach, solid to where it stands with a bead, grey bar under it for what is carrying.
   Only the bead and the grey bar ever move both ways. */
function gauges(o,x0,w,SC,FY,font){
 var g='';
 SEATS.forEach(function(s){
  var y=FY+s.y*SC, on=o.reach.indexOf(s.k)>=0;
  var re=(o.reachEnd||{})[s.k]||.88, st=(o.stand||{})[s.k]||.5, ca=(o.carry||{})[s.k]||.3;
  g+='<line x1="'+x0+'" y1="'+y+'" x2="'+(x0+w*re)+'" y2="'+y+'" stroke="var(--'+s.k+')" stroke-opacity=".55" stroke-width="2" stroke-dasharray="1.5 5" stroke-linecap="round"/>';
  g+='<line x1="'+x0+'" y1="'+y+'" x2="'+(x0+w*st)+'" y2="'+y+'" stroke="var(--'+s.k+')" stroke-width="3" stroke-linecap="round"/>';
  g+='<circle cx="'+(x0+w*st)+'" cy="'+y+'" r="4.6" fill="var(--panel-2)" stroke="var(--'+s.k+')" stroke-width="2"/>';
  g+='<line x1="'+x0+'" y1="'+(y+8)+'" x2="'+(x0+w*ca)+'" y2="'+(y+8)+'" stroke="#94908A" stroke-width="3" stroke-linecap="round"/>';
  if(font)g+='<text class="mk-gl" x="'+(x0-10)+'" y="'+(y+4)+'" text-anchor="end" font-size="'+font+'" fill="'+(on?'var(--ink)':'var(--dim)')+'">'+NAME[s.k]+'</text>';
 });
 return g;
}

/* the four loop arcs, the same function the small ring in the bar would use */
var LOOP=[{k:'discover',n:'Discover',g:'eye'},{k:'play',n:'Play',g:'play'},{k:'flow',n:'Flow',g:'flow'},{k:'embody',n:'Embody',g:'embody'}];
function pol(cx,cy,r,deg){var a=deg*Math.PI/180;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];}
function arc(cx,cy,r,a0,a1){var p=pol(cx,cy,r,a0),q=pol(cx,cy,r,a1);return 'M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' A'+r+' '+r+' 0 0 1 '+q[0].toFixed(1)+' '+q[1].toFixed(1);}
function ring(cx,cy,r,lit,newest){
 var g='';
 LOOP.forEach(function(L,q){
  var a0=-90+q*90+8,a1=a0+74,on=lit[q];
  g+='<path d="'+arc(cx,cy,r,a0,a1)+'" fill="none" stroke="'+(on?'var(--sec-'+L.k+')':'var(--ink)')+'" stroke-opacity="'+(on?1:.42)+'" stroke-width="'+(on?5:2.4)+'" stroke-linecap="round"'+(on?'':' stroke-dasharray="3 9"')+'/>';
  var m=pol(cx,cy,r,(a0+a1)/2);
  g+='<circle cx="'+m[0]+'" cy="'+m[1]+'" r="15" fill="var(--panel-2)" stroke="'+(on?'var(--sec-'+L.k+')':'var(--ink)')+'" stroke-opacity="'+(on?1:.42)+'" stroke-width="1.6"'+(on?'':' stroke-dasharray="2 3"')+'/>';
  g+='<g transform="translate('+(m[0]-9)+' '+(m[1]-9)+') scale(.75)" fill="none" stroke="'+(on?'var(--sec-'+L.k+')':'var(--dim)')+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+G[L.g]+'</g>';
  if(on&&newest===q)g+='<circle class="mk-pulse" cx="'+m[0]+'" cy="'+m[1]+'" r="15" fill="none" stroke="var(--sec-'+L.k+')" stroke-width="1.4"/>';
 });
 var t=pol(cx,cy,r,-90);
 g+='<path d="M'+(t[0]-7)+' '+(t[1]-8)+' L'+(t[0]+3)+' '+t[1]+' L'+(t[0]-7)+' '+(t[1]+8)+'" fill="none" stroke="var(--mid)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
 return g;
}

/* ================= JOURNAL ================= */
var FEELS=['Overwhelmed','Heavy','Angry','Ashamed','Afraid','Sad','Numb'];
function stepFeel(loaded){
 var h='<section class="st-pan mk-card">'+head('feel','Feel','Wave in a ring: the word closest to what is here right now. Pick one or two.');
 h+='<div class="mk-chips">';FEELS.forEach(function(f){h+=chip(f,loaded&&(f==='Heavy'||f==='Angry'));});
 return h+'</div></section>';}
function figMini(zone){
 var Z={head:[41,0,18,17],upper:[28,17,44,28],lower:[30,45,40,13]};
 var s='<svg class="mk-zfig" viewBox="22 -3 56 66" role="img" aria-label="Body in three parts">'
  +armature({id:'wz',reach:[],touch:{},empty:{}}).replace(/stroke-opacity="\.5"/g,'stroke-opacity=".7"');
 Object.keys(Z).forEach(function(k){var z=Z[k];s+='<rect class="mk-zone'+(zone===k?' on':'')+'" x="'+z[0]+'" y="'+z[1]+'" width="'+z[2]+'" height="'+z[3]+'" rx="3.5"/>';});
 return s+'</svg>';}
function stepWhere(loaded){
 var z=loaded?'upper':'';
 var h='<section class="st-pan mk-card">'+head('where','Where','Pin: where in the body you notice it. Tap a part.')+'<div class="mk-wh">'+figMini(z)+'<div><div class="mk-chips">';
 h+=chip('Head',z==='head')+chip('Upper torso',z==='upper')+chip('Lower torso',z==='lower');
 return h+'</div><p class="mk-note">'+(loaded?'You said: <b>upper torso</b>. Say it your own way in the story if you want.':'Nothing picked yet. You can skip this and just write.')+'</p></div></div></section>';}
function mirror(loaded){
 if(!loaded)return '<section class="st-pan mk-card mk-ghost">'+head('eye','Here is what I heard','When you have written a few lines, I say back what I heard. You tell me if it is right.','var(--mid)')+'</section>';
 var h='<section class="st-pan mk-card mk-mirror">'+head('eye','Here is what I heard','Eye: what I read in your words. You decide if it is right.');
 h+='<p class="mk-say">You stayed quiet while he took the credit. It sat in your throat first, then tightened in your chest, and it ended as anger low in your belly.</p>';
 h+='<div class="mk-quote"><span>'+sr('throat')+'“stayed quiet”<em>Throat</em></span><span>'+sr('heart')+'“tight”<em>Heart</em></span><span>'+sr('solar')+'“furious”<em>Solar plexus</em></span></div>';
 h+='<div class="mk-route"><span><b>Route</b>throat, then heart, then solar plexus</span><span><b>Stays longest</b>solar plexus</span><span><b>Heaviest word</b>\u201Cfurious\u201D</span></div><p class="mk-note" style="margin:0 0 12px">The order is a record. No number moves with it.</p>';
 h+='<div class="mk-fb"><button type="button" class="btn pri">'+'That is me</button><button type="button" class="btn">Not quite</button></div>';
 h+='<div class="mk-found"><div class="pm-eye">What I found in this entry, for you to confirm</div>';
 /* TDD section 11: what an entry may produce. Candidates are dashed until the person says yes. */
 function row(k,items,cand){h+='<div class="mk-fr"><span class="k">'+k+'</span><span class="v">'+items.map(function(t){return '<i class="mk-tag'+(cand?' cand':'')+'">'+t+'</i>';}).join('')+'</span></div>';}
 row('Observations',['chest went tight']);
 row('Emotions',['furious','ashamed']);
 row('Behaviours',['stayed quiet','told the team it was fine']);
 row('Beliefs',['rest is a moral failure']);
 row('Decisions',['let it go']);
 row('Context',['a team meeting, a launch']);
 row('Boundary',['work crossed into rest']);
 row('Integrity',['said fine, meant not fine']);
 row('Pattern candidates',['Self-Silencing','People Pleasing'],true);
 row('Evidence',['“stayed quiet”, Fri 2 Oct']);
 h+='<p class="mk-note">Dashed means I am guessing. Nothing dashed counts until you say yes. A guess never becomes a fact on its own.</p></div></section>';
 return h;}
function goes(loaded,committed){
 if(!loaded){
  var g='<section class="st-pan mk-card mk-ghost">'+head('arrow','Where your words go','Everything you write is read first. Then it can become four things. Nothing is lost.','var(--mid)')+'<div class="mk-chain">';
  [['imprint','Imprints','Always','Your words are added to the patterns your body is still holding. An imprint is one of those patterns.'],
   ['release','Release','Part of it','A pattern you want out becomes a story to release. It waits in your release queue.'],
   ['ritual','Ritual','Part of it','A pattern becomes a short daily practice, built from your own words.'],
   ['statement','Statement','Sometimes','If you wrote something absolute about yourself, you get it back as a sentence to test.']].forEach(function(r,i){
    g+='<div class="mk-hop'+(i===3?' maybe':'')+'">'+bdg(r[0],'var(--dim)')+'<div><b>'+r[1]+' <em>'+r[2]+'</em></b><p>'+r[3]+'</p></div></div>';});
  return g+'</div></section>';}
 var tag=committed?'Done':'On commit';
 var h='<section class="st-pan mk-card'+(committed?' mk-new':'')+'">'+head('arrow',committed?'Where this entry went':'Where this entry will go','Arrow: the road from your words to your body, your release queue and your ritual.')+'<div class="mk-chain">';
 h+='<div class="mk-hop">'+bdg('imprint')+'<div><b>Imprints <em>Always. '+tag+'.</em></b><p>Ring in a ring: patterns your body is still holding. Your words are added to them.</p><div class="mk-val"><span>'+sr('throat')+'Throat</span><span>'+sr('heart')+'Heart</span><span>'+sr('solar')+'Solar plexus</span></div></div></div>';
 h+='<div class="mk-hop">'+bdg('release')+'<div><b>Release <em>Part of it. '+tag+'.</em></b><p>Open ring with an arrow out: a pattern you can let go of. It waits in your release queue.</p><div class="mk-val"><span>'+sr('throat')+'Self-Silencing, queued first</span><button type="button" class="btn">Run release</button></div></div></div>';
 h+='<div class="mk-hop">'+bdg('ritual')+'<div><b>Ritual <em>Part of it. '+tag+'.</em></b><p>Two arrows in a loop: a daily practice built from your own words.</p><div class="mk-val"><span>Somatic truth check, 2 minutes. Hold “stayed quiet” against the body.</span></div></div></div>';
 h+='<div class="mk-hop maybe">'+bdg('statement','var(--dim)')+'<div><b>Statement <em>Sometimes. Not this time.</em></b><p>Speech ring: a sentence to test, made only when you write something absolute about yourself. Nothing here said never or always.</p></div></div>';
 return h+'</div><p class="mk-note">I find, cut and mark your words. I do not write them.</p></section>';}
function ent(d,line,dests){
 var x='<div class="mk-ent"><div class="d">'+d+'</div><p>'+line+'</p><div class="mk-dest">';
 dests.forEach(function(q){x+='<div class="mk-dst'+(q[3]?' none':'')+'">'+bdg(q[0],q[3]?'var(--dim)':'var(--accent)','xs')+'<div><b>'+q[1]+'</b><span>'+q[2]+'</span></div></div>';});
 return x+'</div></div>';}
function entries(loaded,committed){
 var h='<section class="st-pan mk-card">'+head('story','Earlier entries',loaded?'Newest first. Each one shows where it went.':'Each one is dated and kept here, with where it went.');
 if(!loaded)return h+'<p class="mk-note">No entries yet. The first one will show here.</p></section>';
 if(committed)h+=ent('Fri 2 Oct, just now','I told my team the launch was fine. It was not fine.',[['imprint','Imprints','Throat, heart, solar plexus'],['release','Release','Self-Silencing, in the queue'],['ritual','Ritual','Somatic truth check, 2 min'],['statement','Statement','None this time',1]]);
 h+=ent('Wed 30 Sep, 18:10','I can never say what I actually mean in front of them.',[['imprint','Imprints','Throat, heart'],['release','Release','Self-Silencing, released Thu 1 Oct'],['ritual','Ritual','Somatic truth check, kept Thu 1 and Fri 2 Oct'],['statement','Statement','I can <s>never</s> <ins>not yet</ins> say what I actually mean in front of them']]);
 h+=ent('Sun 27 Sep, 07:40','I woke with my jaw clamped and the launch date already in my head.',[['imprint','Imprints','Throat, solar plexus'],['release','Release','Anger, in the queue'],['ritual','Ritual','Slow exhale, 3 min, not started'],['statement','Statement','None',1]]);
 h+=ent('Wed 16 Sep, 21:55','I stayed late again. Nobody asked me to.',[['imprint','Imprints','Solar plexus'],['release','Release','Judgment, released Fri 18 Sep'],['ritual','Ritual','None',1],['statement','Statement','None',1]]);
 return h+'</section>';}

/* The real story page does the work of the box, the marks and the trace. This arranges what it drew
   into two columns and adds the new parts. */
function journalPage(opt){
 var loaded=opt.state==='loaded',host=document.getElementById('story'),fl=document.getElementById('stflow');
 var jr=document.getElementById('stjr'),ch=document.getElementById('stch');
 var glow=jr.querySelector('.st-glow');if(glow)glow.style.display='none';
 var wrap=document.createElement('div');wrap.className='mk-two';
 var L=document.createElement('div');L.className='mk-col';var R=document.createElement('div');R.className='mk-col';
 var pre=document.createElement('div');pre.className='mk-pair';
 pre.innerHTML=stepFeel(loaded)+stepWhere(loaded);
 var intro=document.createElement('div');intro.className='mk-intro';intro.innerHTML='<h1>What is here?</h1><p>Do not solve it yet. Say how it feels, then where, then tell it.</p>';
 L.appendChild(intro);L.appendChild(pre);L.appendChild(jr);
 var m=document.createElement('div');m.innerHTML=mirror(loaded);L.appendChild(m.firstChild);
 var cta=document.createElement('div');cta.className='mk-cta';cta.innerHTML='<button type="button" class="btn">Clear</button><button type="button" class="btn pri"'+(loaded&&!opt.committed?'':' disabled')+'>'+(opt.committed?'Committed':'Commit')+'</button>';L.appendChild(cta);
 R.appendChild(ch);
 var g=document.createElement('div');g.innerHTML=goes(loaded,opt.committed);R.appendChild(g.firstChild);
 var e=document.createElement('div');e.innerHTML=entries(loaded,opt.committed);R.appendChild(e.firstChild);
 wrap.appendChild(L);wrap.appendChild(R);
 fl.innerHTML='';fl.appendChild(wrap);
 /* the real journal's own bar still has Clear and Commit; ours carries them once, under the mirror */
 var bar=jr.querySelector('.st-bar');if(bar)bar.style.display='none';
 jr.style.setProperty('--lead',loaded?'var(--solar)':'var(--edge-2)');jr.classList.add('mk-lead');var ed=jr.querySelector('.st-ed');if(ed)ed.style.cssText='flex:none;height:'+(innerWidth<=820?'250px':(loaded?'168px':'150px'))+';min-height:0';jr.style.cssText+=';flex:none;height:auto;min-height:0';
}

/* ================= AVATAR ================= */
var LATER={reach:['sacral','solar','throat'],touch:{sacral:.55,solar:.8,throat:.5},empty:{sacral:.3,solar:.5,throat:.25},newest:'throat',
 reachEnd:{crown:.9,eye:.9,throat:.9,heart:.88,solar:.95,sacral:.92,root:.88},
 stand:{crown:.7,eye:.66,throat:.78,heart:.58,solar:.84,sacral:.8,root:.62},
 carry:{crown:.16,eye:.2,throat:.4,heart:.52,solar:.46,sacral:.3,root:.36}};
var EARLY={reach:['solar'],touch:{solar:.4},empty:{solar:.15},reachEnd:LATER.reachEnd,
 stand:{crown:.7,eye:.66,throat:.6,heart:.58,solar:.62,sacral:.6,root:.62},carry:{crown:.16,eye:.2,throat:.5,heart:.55,solar:.7,sacral:.55,root:.4}};
var HARD={reach:LATER.reach,touch:LATER.touch,empty:LATER.empty,reachEnd:LATER.reachEnd,
 stand:{crown:.58,eye:.54,throat:.6,heart:.42,solar:.66,sacral:.62,root:.46},carry:{crown:.4,eye:.46,throat:.72,heart:.8,solar:.78,sacral:.6,root:.64}};
var BLANK={reach:[],touch:{},empty:{},reachEnd:LATER.reachEnd,stand:{},carry:{}};

function heroSvg(loaded){
 var o=loaded?LATER:BLANK,SC=3.6,FY=255-180,CX=210;
 var s='<svg class="mk-hero" viewBox="0 0 640 510" role="img" aria-label="Your avatar: a body outline built on seven seats, inside the loop ring, with a gauge beside each seat">';
 s+='<g class="mk-ringg">'+ring(CX,255,196,loaded?[1,1,1,0]:[0,0,0,0],loaded?0:-1)+'</g>';
 s+='<g transform="translate('+(CX-50*SC)+' '+FY+') scale('+SC+')">'+armature({id:'h',reach:o.reach,touch:o.touch,empty:o.empty,newest:o.newest})+'</g>';
 if(loaded)s+='<g class="mk-gg">'+gauges(o,500,124,SC,FY,12.5)+'</g>';
 else{s+='<g class="mk-gg">';SEATS.forEach(function(q){var y=FY+q.y*SC;s+='<line x1="500" y1="'+y+'" x2="624" y2="'+y+'" stroke="var(--ink)" stroke-opacity=".3" stroke-width="2" stroke-dasharray="1.5 5" stroke-linecap="round"/><text class="mk-gl" x="490" y="'+(y+4)+'" text-anchor="end" font-size="12.5" fill="var(--dim)">'+NAME[q.k]+'</text>';});s+='</g>';}
 return s+'</svg>';}
function sentence(loaded){
 if(!loaded)return '<p class="av-p mk-under">Dashed means not yet. Nothing here can go down. The avatar only adds.</p>';
 return '<p class="av-p mk-under"><b>For you, right now,</b> releasing moves how far you can get faster than raising a law does. The next place is the heart.</p>';}
function chanKey(){
 return '<p class="mk-note mk-c" style="margin:0 0 8px">Seven lines beside the body, one for each seat. Crown is at the top and root is at the bottom.</p><div class="mk-chk">'
  +'<span><svg width="30" height="12"><path d="M2 6h26" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/></svg><b>Solid line and rings</b>what you have done, with dates. It only adds.</span>'
  +'<span><svg width="30" height="12"><path d="M2 6h26" stroke="var(--ink)" stroke-opacity=".6" stroke-width="2" stroke-dasharray="1.5 5" stroke-linecap="round"/></svg><b>Dotted line</b>how far you could get with nothing held.</span>'
  +'<span><svg width="30" height="12"><circle cx="15" cy="6" r="4.6" fill="none" stroke="var(--ink)" stroke-width="2"/></svg><b>Ring at the end</b>where you stand today.</span>'
  +'<span><svg width="30" height="12"><path d="M2 6h26" stroke="#94908A" stroke-width="3" stroke-linecap="round"/></svg><b>Grey bar</b>what is carrying this week. It is the only thing that moves both ways.</span></div>';}
function loopKey(loaded){
 var d=loaded?[['Wrote Fri 2 Oct',1],['Released Thu 1 Oct',1],['Kept the ritual Thu 1 Oct',1],['Not yet. Read yourself again after a release.',0]]:[['Write one sentence.',0],['Release what it found.',0],['Keep a short daily practice.',0],['Read yourself again.',0]];
 var h='<div class="mk-lp">';
 LOOP.forEach(function(L,i){h+='<div class="mk-lg'+(d[i][1]?'':' off')+'" style="--c:var(--sec-'+L.k+')">'+bdg(L.g,d[i][1]?'var(--sec-'+L.k+')':'var(--dim)','xs',d[i][1]?100:0)+'<b>'+L.n+'</b><span>'+d[i][0]+'</span></div>';});
 return h+'</div><p class="mk-note mk-c">Four arcs around your avatar are the loop. Solid: you did it, with a date. Dashed: not yet. The arrow at the top means that after embody you start again at discover.</p>';}
function becomingCards(loaded){
 var not=loaded?{q:['stays silent'],b:['Rest is a moral failure'],h:['Lets him take the credit'],p:['Self-Silencing'],c:['Late nights before a launch']}:null;
 var be=loaded?{q:['direct','calm'],v:['honesty'],b:['Rest is part of the work'],h:['Says it in the room, at the time'],c:['plain words'],r:['Honest with her team'],e:['Steady breath when it is tense'],o:['A team that tells her the truth']}:null;
 function rows(spec,map){return Object.keys(map).map(function(k){var v=spec&&spec[k];return '<div class="mk-fr"><span class="k">'+map[k]+'</span><span class="v">'+(v?v.map(function(t){return '<i class="mk-tag">'+t+'</i>';}).join(''):'<i class="mk-tag empty">add</i>')+'</span></div>';}).join('');}
 var left='<section class="av-card mk-card"><div class="pm-eye">Who I am not becoming</div>'+(loaded?'<p class="mk-big">I stay quiet and let him take the credit.</p>':'<p class="mk-big mk-dimt">What you want to let go of. In your words.</p>')
  +rows(not,{q:'Qualities',b:'Beliefs',h:'Behaviours',p:'Patterns',c:'Conditions'})+'<p class="mk-note">The left side is released, never kept.</p></section>';
 var right='<section class="av-card mk-card"><div class="pm-eye">Who I am becoming</div>'+(loaded?'<p class="mk-big">Someone who says it in the room, at the time.</p>':'<p class="mk-big mk-dimt">Who you are becoming. In your words.</p>')
  +rows(be,{q:'Qualities',v:'Values',b:'Beliefs',h:'Behaviours',c:'Communication',r:'Relationships',e:'Embodiment',o:'Contribution'});
 if(loaded)right+='<div class="mk-sug"><span class="mk-tag cand">direct</span><span>Suggested from your journal. Not yours until you say yes.</span><div class="mk-fb"><button type="button" class="btn">Keep</button><button type="button" class="btn">Not me</button></div></div>';
 right+='<p class="mk-note">You own this. I may suggest words. I never write who you are.</p></section>';
 return [left,right];}
function moved(loaded){
 if(!loaded)return '<section class="av-card mk-card"><div class="pm-eye">Since your last visit</div><p class="mk-note">Nothing yet. After your first entry, this says in plain words what moved.</p></section>';
 var rowsD=[['release','You released <b>Self-Silencing</b> at the throat. The throat ring is lit now.','Thu 1 Oct','Open ring with an arrow out: a release.'],
  ['ritual','You kept the <b>Somatic truth check</b> two days running.','Thu 1 and Fri 2 Oct','Two arrows in a loop: your ritual.'],
  ['story','Today’s words, “stayed quiet”, landed in your throat, heart and solar plexus.','Fri 2 Oct','Page: a journal entry.'],
  ['held','Your sacral place has stayed open.','Since Sat 26 Sep','Ring with a bar: held. Not released, kept.']];
 var h='<section class="av-card mk-card"><div class="pm-eye">Since your last visit, Wed 30 Sep</div>';
 rowsD.forEach(function(r){h+='<div class="mk-mv">'+bdg(r[0],'var(--accent)','xs')+'<div><p>'+r[1]+'</p><small>'+r[2]+'. '+r[3]+'</small></div></div>';});
 return h+'</section>';}
function nextUp(loaded){
 if(!loaded)return '';
 return '<section class="av-card mk-card"><div class="pm-eye">What needs attention</div><p class="mk-big" style="font-size:15px">The heart is the next place. Your throat is lit and your solar plexus is lit. The heart sits between them.</p>'
  +'<div class="mk-mv">'+bdg('ritual','var(--sec-flow)','xs')+'<div><p>Next in your ritual: <b>Somatic truth check</b>, 2 minutes. Today, 07:30.</p></div></div>'
  +'<div class="mk-mv">'+bdg('release','var(--sec-play)','xs')+'<div><p>First in your release queue: <b>Self-Silencing</b>, then <b>Anger</b>.</p></div></div></section>';}

/* TDD section 17: per seat, a row of small clickable ticks, one per real Ritual Element, coloured by type. */
var ELS={
 crown:[],
 eye:[['observation','Notice the first thought after waking','Morning check','Check-in, 1 minute']],
 throat:[['release','Release Self-Silencing','Say it in the room','Somatic truth check'],['reframe','Say “I disagree” once a day','Say it in the room','Somatic truth check'],['behavior','Speak first in Thursday’s meeting','Say it in the room','Rehearse aloud, 3 minutes'],['integrity','Say what is true when asked','Say it in the room','Somatic truth check'],['observation','Note when you went quiet','Say it in the room','Evening note']],
 heart:[['embodiment','Hand on chest, three slow breaths','Evening settle','Box breathing'],['observation','Note who you were guarded with','Evening settle','Evening note']],
 solar:[['release','Release Anger','Release Anger, weekly','Rapid release'],['release','Release Judgment','Release Anger, weekly','Rapid release'],['embodiment','Slow exhale, 3 minutes','Morning exhale','Controlled breath']],
 sacral:[['release','Release Co-Dependency','Release weekly','Rapid release'],['behavior','Say no once without explaining','Say it in the room','Rehearse aloud, 3 minutes']],
 root:[['observation','Note when rest feels like failing','Evening settle','Evening note']]};
var DONE={'throat:1':1,'solar:2':1,'throat:0':1,'throat:4':1};
function tick(seat,i,sel,done){
 var e=ELS[seat][i],t=TC[e[0]];
 return '<button type="button" class="mk-tick'+(sel?' sel':'')+'" style="--c:'+t.c+'" aria-pressed="'+(sel?'true':'false')+'" title="'+t.n+': '+esc(e[1])+'"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6.5" fill="none" stroke="var(--c)" stroke-width="2.2"/>'+(done?'<circle cx="12" cy="12" r="2.2" fill="none" stroke="var(--c)" stroke-width="1.8"/>':'')+'</svg></button>';}
function workRows(loaded){
 var order=['crown','eye','throat','heart','solar','sacral','root'];
 var h='<section class="av-card mk-card mk-work"><div class="mk-whd"><div><div class="pm-eye">Work on each seat</div><p class="mk-note" style="margin:2px 0 0">What work is currently tied to becoming this person. One ring for each real step of a ritual. Press one to follow it down to the practice.</p></div></div>';
 h+='<div class="mk-types">';TYPES.forEach(function(t){h+='<span class="mk-ty" style="--c:'+t.c+'"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="6.5" fill="none" stroke="'+t.c+'" stroke-width="2.4"/></svg><b>'+t.n+'</b>'+t.m+'</span>';});
 h+='<span class="mk-ty"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="6.5" fill="none" stroke="var(--mid)" stroke-width="2.4"/><circle cx="12" cy="12" r="2.2" fill="none" stroke="var(--mid)" stroke-width="1.8"/></svg><b>Dot inside</b>done this week</span></div>';
 if(!loaded){return h+'<p class="mk-note">Nothing yet. Each real step of a ritual you add shows here as a ring, in its seat. Press one to follow it down to the practice.</p></section>';}
 order.forEach(function(k){
  var els=ELS[k]||[];
  h+='<div class="mk-wr"><div class="mk-wn">'+seatBdg(k,loaded&&LATER.reach.indexOf(k)>=0?100:0,'sm')+'<b>'+NAME[k]+'</b></div><div class="mk-wt">';
  if(!loaded||!els.length)h+='<span class="mk-none">'+(loaded?'No work here yet':'Nothing yet')+'</span>';
  else els.forEach(function(e,i){h+=tick(k,i,loaded&&k==='throat'&&i===1,!!DONE[k+':'+i]);});
  h+='</div></div>';});
 if(loaded){
  var e=ELS.throat[1];
  h+='<div class="mk-path" aria-label="Where this step sits"><span class="pm-eye">Followed down from the throat</span><div class="mk-crumbs">'
   +'<button type="button" class="btn">'+bdg('avatar','var(--accent)','xs')+'Avatar</button><i></i>'
   +'<button type="button" class="btn">'+seatBdg('throat',100,'xs')+'Throat</button><i></i>'
   +'<button type="button" class="btn" style="--c:'+TC.reframe.c+'"><span class="mk-dot"></span>Reframe: '+esc(e[1])+'</button><i></i>'
   +'<button type="button" class="btn">'+bdg('ritual','var(--sec-flow)','xs')+'Ritual: '+e[2]+'</button><i></i>'
   +'<button type="button" class="btn">Protocol: '+e[3]+'</button><i></i>'
   +'<button type="button" class="btn">Practice: hold the statement and read the body</button></div>'
   +'<p class="mk-note">Ritual is when. Protocol is what, why and how. A practice is what you actually did. Done Thu 1 and Fri 2 Oct.</p></div>';}
 return h+'</section>';}
function stateCard(title,date,o,lines,cls,stack){
 var SC=2.6,FY=14;
 var s='<svg class="mk-sfig" viewBox="0 0 330 285" role="img" aria-label="'+title+' state of the avatar">'
  +'<g transform="translate('+(90-50*SC)+' '+FY+') scale('+SC+')">'+armature({id:'s'+title.replace(/\W/g,''),reach:o.reach,touch:o.touch,empty:o.empty})+'</g>'+gauges(o,185,120,SC,FY,0)+'</svg>';
 return '<article class="av-card mk-st '+(cls||'')+'"><div class="mk-sh"><b>'+title+'</b><span>'+date+'</span></div>'+s+'<ul>'+lines.map(function(l){return '<li>'+l+'</li>';}).join('')+'</ul></article>';}
function states(){
 return '<section class="mk-states"><div class="pm-eye">How the avatar improves, and what a hard month does</div><p class="mk-note" style="margin:2px 0 10px;max-width:74ch">Same person, three dates. The drawing is built from things that happened, with dates. It only adds. In a hard month only the grey bars and the rings at the end of each line move. Nothing is taken away, nothing goes grey, no word changes.</p><div class="mk-sg">'
  +stateCard('Early','Sun 13 Sep',EARLY,['Solar plexus is the first seat reached. First release: Anger.','Outline is dashed where nothing has reached.','Loop: discover and play are lit.'])
  +stateCard('Now','Fri 2 Oct',LATER,['Throat, solar plexus and sacral are reached. Self-Silencing released Thu 1 Oct.','Outline is solid there. It stops before the heart.','Loop: discover, play and flow are lit. Embody is next.'],'now')
  +stateCard('After a hard month','Fri 30 Oct, if it came to that',HARD,['The drawing is exactly the same.','The grey bars are longer. The rings at the ends of the lines slid in.','Nothing was taken away.'])
  +'</div><div class="mk-cause"><div class="mk-cs">'+bdg('release','var(--accent)','xs')+'<div><b>What changed it: releases</b><p>13 Sep Anger, solar plexus. 18 Sep Judgment, solar plexus. 24 Sep Co-Dependency, sacral. 1 Oct Self-Silencing, throat.</p></div></div>'
  +'<div class="mk-cs">'+bdg('ritual','var(--accent)','xs')+'<div><b>What changed it: practices</b><p>21 and 24 Sep Slow exhale, 3 minutes, kept. 1 and 2 Oct Somatic truth check, 2 minutes, kept.</p></div></div></div></section>';}
function sewn(loaded){
 var N=[['avatar','Avatar','Who you are becoming','Someone who says it in the room, at the time.','var(--accent)'],['ritual','Ritual','The practice that trains it','<b>Somatic truth check</b>, 2 minutes, today.','var(--sec-flow)'],['psyche','Psyche','The patterns in the way','<b>Self-Silencing</b> and <b>People Pleasing</b> keep you quiet.','var(--throat)'],['body','Body','Where they sit','Your <b>throat</b> and <b>chest</b>. The throat ring is lit.','var(--heart)'],['story','Story','What you told','“<b>stayed quiet</b>”, Fri 2 Oct.','var(--sec-discover)']];
 var h='<section class="mk-sewn"><div class="pm-eye">The layers, sewn</div><p class="mk-note" style="margin:2px 0 10px">One thread runs through all five. Press any one to open it. Your story tells the avatar who to become, then the loop runs again.</p><div class="mk-th">';
 N.forEach(function(n,i){h+='<div class="mk-nd">'+bdg(n[0],n[4],'sm',loaded?100:0)+'<div class="av-card mk-card"><b>'+n[1]+'</b><small>'+n[2]+'</small><p>'+(loaded?n[3]:'<span class="mk-dimt">Fills in as you write.</span>')+'</p></div></div>';});
 return h+'</div></section>';}
function masks(){
 var M=[['Child','Gets small so somebody else decides.',['root','sacral']],['Preteen','Checks the room before it says the thing.',['solar','throat']],['Teen','Pushes back on the person, not the problem.',['throat']],['Adult','Handles it, and files what it cost.',['sacral','solar']],['Professional','Performs competence until the feeling passes.',['solar','throat']],['Ideological','Answers from the position instead of the moment.',['eye']]];
 var h='<section class="mk-masks"><div class="pm-eye">Masks</div><p class="mk-note" style="margin:2px 0 10px">Ring with a face: a mask is a way of protecting yourself that you learned at an age. Under each, the places it protects.</p><div class="mk-mg">';
 M.forEach(function(m){h+='<div class="mk-mk">'+bdg('mask','var(--dim)','xs',0)+'<div><b>'+m[0]+'</b><p>'+m[1]+'</p><div class="mk-pl">'+m[2].map(function(s){return seatBdg(s,0,'xs');}).join('')+'<span>'+m[2].map(function(s){return NAME[s]}).join(', ')+'</span></div></div></div>';});
 return h+'</div><div class="mk-seal">'+bdg('lock','var(--dim)','sm',0)+'<p><b>Opens on tier three.</b> Lock: the masks are drawn on your avatar and lit by what you wrote. Until then you see their names and what each one does.</p><button type="button" class="btn">See tiers</button></div></section>';}
function avatarPage(opt){
 var loaded=opt.state==='loaded',av=document.getElementById('avbody');
 var subs='<header class="av-hd avs-top"><div class="avs-subs"><button class="avs-sb av-on" type="button">Becoming</button><button class="avs-sb" type="button">Archetypes</button></div></header>';
 var bc=becomingCards(loaded);
 var top='<div class="mk-atop"><div class="mk-acol">'+bc[0]+moved(loaded)+'</div><div class="mk-actr"><div class="mk-ttl"><h1>'+(loaded?'Your avatar':'There is more running you than you can see.')+'</h1><p>'+(loaded?'The part of you the work has reached. A solid line means a release reached that place.':'Your avatar starts as an outline. It fills in as you write, release and keep a practice.')+'</p></div>'+heroSvg(loaded)+sentence(loaded)+(loaded?chanKey():'')+loopKey(loaded)+'</div><div class="mk-acol">'+bc[1]+nextUp(loaded)+'</div></div>';
 var doors='';var _unused=loaded?'':'<div class="mk-doors">'+LOOP.map(function(L,i){return '<button type="button" class="btn" style="--c:var(--sec-'+L.k+')">'+bdg(L.g,'var(--sec-'+L.k+')','xs',0)+L.n+'</button>';}).join('')+'</div>';
 av.innerHTML='<div class="av mk-av">'+subs+top+doors+workRows(loaded)+(loaded?states():'')+sewn(loaded)+masks()+'</div>';
}
window.MOCK={journalPage:journalPage,avatarPage:avatarPage};
})();
