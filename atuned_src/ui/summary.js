/* ============================================================
   SUMMARY. Five lenses. None of them store anything; each is a pure
   function of soul, axes and laws, so they cannot drift from what the
   instrument already knows.
   ============================================================ */
function lensWestern(r){
 var d=DOMAINS[S.doms[0]]||{nm:'',r:''};
 var EL={Architect:'Earth, fixed. Builds and holds.',Engine:'Fire, cardinal. Initiates and burns.',
  Weaver:'Water, mutable. Joins and dissolves.',Witness:'Air. Observes and names.'};
 return {t:'Western',a:d.r,b:EL[d.r]||'',c:'root domain as element'};}
function lensEastern(r){
 var b=r.darkB||'Root';
 var E={Root:'Muladhara, earth, LAM',Sacral:'Svadhisthana, water, VAM',Solar:'Manipura, fire, RAM',
  Heart:'Anahata, air, YAM',Throat:'Vishuddha, ether, HAM','3rd Eye':'Ajna, light, OM',
  Crown:'Sahasrara, thought, silence'};
 return {t:'Eastern',a:b,b:E[b]||'',c:'the seat carrying the most'};}
function lensDesign(r){
 var a=ARCH[r.pi]||{nm:''};
 return {t:'Design',a:a.nm,b:'defined at the '+(r.darkB||'Root').toLowerCase()+', '
  +(r.benign?'initiates':'responds')+', authority at the '
  +(r.darkB==='Heart'?'heart':'solar plexus'),c:'archetype and polarity'};}
function lensGene(r){
 var top=W.filter(function(n){return n.sq>=4;}).sort(function(a,b){return b.sq-a.sq;})[0];
 if(!top)return {t:'Gene keys',a:'nothing held',b:'no shadow running',c:'shadow, gift, siddhi'};
 var c=CHILD.filter(function(x){return x.nm===top.cf;})[0]||{};
 var SID={Fear:'Trust as stillness',Anger:'Equanimity as mercy',Shame:'Worth as sovereignty',
  Disgust:'Acceptance as purity',Apathy:'Vitality as devotion',Shock:'Groundedness as presence',
  Sad:'Joy as bliss',Surprise:'Readiness as wonder',Anticipation:'Presence as timelessness'};
 return {t:'Gene keys',a:top.k,
  b:top.cf+' to '+(c.opp||'')+' to '+(SID[top.cf]||''),c:'shadow, gift, siddhi'};}
function lensName(r){
 var nm=(CURP&&CURP.name)||'You', v=0;
 for(var i=0;i<nm.length;i++){var ch=nm.toUpperCase().charCodeAt(i)-64; if(ch>0&&ch<27)v+=ch;}
 while(v>9&&v!==11&&v!==22) v=String(v).split('').reduce(function(a,b){return a+ +b;},0);
 var M={1:'the one who starts',2:'the one who joins',3:'the one who expresses',
  4:'the one who builds',5:'the one who moves',6:'the one who tends',7:'the one who looks',
  8:'the one who commands',9:'the one who completes',11:'the one who channels',
  22:'the one who makes it real'};
 return {t:'Name',a:nm+', '+v,b:M[v]||'',c:'root meaning, reduced'};}
/* THE SPIRITUAL OVERLAY, lifted into its own function so the unread page can
   carry it. It is the one block on this surface that is not derived from the
   nine axes: it reads a birth date a person typed, so it is either real or it
   says there is none. Nothing here is invented from a default.

   THE CONVERGENCE RING SAID 75 PERCENT AND NOTHING SAID WHAT OF. The owner
   asked. It is the share of the ten pairs among five systems that agree, so
   the sentence now states the fraction it came from and what agreement means.
   A percentage with no denominator is a mood. */
function sumOverlay(r){
 var o='';
 var nm2=(PEOPLE[S.who]||{}).nm||'You';
 var C=converge(nm2,r);
 if(!C){
  o+='<div class="pm-eye" style="margin-top:22px">The spiritual overlay</div>'
   +'<p class="sum-p">No birth data on file. Date, time and place would let the overlay run. '
   +'Nothing else is stored, and every reading is derived from those three.</p>';
  return o;}
 {
  var e=C.e;
  o+='<div class="pm-eye" style="margin-top:22px">The spiritual overlay</div>'
   +'<div class="sum-hero" style="margin-top:8px">'
   /* THE RING SAYS THE FRACTION. It said 75 percent, the owner asked what that
      meant, and he was right to: three of four and seventy five percent are
      the same number and only one of them says how few comparisons it rests
      on. birth.js has carried .of for exactly this reason and this renderer
      was throwing it away. The ring arc still runs on the percentage, because
      an arc is a proportion; the value printed is the count. */
   +cr('Crown',C.score||0,{size:'md',label:'convergence',
     raw:C.agree.length+' of '+C.of,
     title:'Convergence. '+C.agree.length+' of '+C.of+' comparisons between the birth '
      +'chart and the field point the same way.'})
   +'<div class="sum-line">Born '+esc(e.birth.d)+' at '+esc(e.birth.t)+', '+esc(e.birth.p)
   +'. Five systems read independently, and the instrument compares them one pair at a '
   +'time against what is running now. <b>'+C.agree.length+' of '+C.of+'</b> comparisons '
   +'point the same way.'
   +(C.open&&C.open.length?' '+C.open.length+' could not be compared at all: '
     +esc(C.open.join('; '))+'. A gap is not a disagreement.':'')
   +'</div></div>'
   +'<div class="sum-lens">'
   +'<div class="sum-l"><div class="sum-lt">Western</div><div class="sum-la">'
    +(ZGLYPH[e.sun]||'')+' '+e.sun+'</div><div class="sum-lb">'+SIGN_RUNS[e.sun]+'</div>'
    +'<div class="sum-lc">moon '+e.moon+', rising '+e.rising+'</div></div>'
   +'<div class="sum-l"><div class="sum-lt">Eastern</div><div class="sum-la">'+e.celem+' '+e.chinese
    +'</div><div class="sum-lb">'+CH_RUNS[e.chinese]+'</div>'
    +'<div class="sum-lc">'+CE_RUNS[e.celem]+'</div></div>'
   +'<div class="sum-l"><div class="sum-lt">Numerology</div><div class="sum-la">Life path '+e.lp
    +'</div><div class="sum-lb">'+(LP_RUNS[e.lp]||'')+'</div>'
    +'<div class="sum-lc">'+(e.master?'master number, survives reduction':'birth date, reduced')+'</div></div>'
   +'<div class="sum-l"><div class="sum-lt">Human design</div><div class="sum-la">'
    +(e.hd.profile?('profile '+e.hd.profile):'unresolved')+'</div>'
    +'<div class="sum-lb">'+(e.hd.design?('personality gate '+e.hd.personality.gate
      +', design gate '+e.hd.design.gate):'')+'</div>'
    +'<div class="sum-lc">type needs the full bodygraph and is not computed</div></div>'
   +'<div class="sum-l"><div class="sum-lt">Gene keys</div><div class="sum-la">'+e.gk.gate+'.'+e.gk.line
    +'</div><div class="sum-lb">shadow to gift to siddhi, one axis at a time</div>'
    +'<div class="sum-lc">gate and line</div></div></div>';
  o+='<div class="pm-eye" style="margin-top:14px">Where they agree, '+C.agree.length+'</div>';
  o+=C.agree.length?('<div class="sum-agree">'+C.agree.map(function(a){
    return '<div class="sum-ag">'+esc(a)+'</div>';}).join('')+'</div>')
   :'<p class="sum-p">Nothing converges. That is a reading, not a gap.</p>';
  if(C.differ.length){
   o+='<div class="pm-eye" style="margin-top:12px">Where they do not, '+C.differ.length+'</div>'
    +'<div class="sum-agree">'+C.differ.map(function(d){
     return '<div class="sum-dg">'+esc(d)+'</div>';}).join('')+'</div>'
    +'<div class="verdict"><p>The instrument does not pick a winner. A birth chart describes '
    +'the blueprint. The field describes what is running now. They diverge when something has '
    +'been installed on top of the blueprint.</p></div>';}}
 return o;}
function sumCard(t,body){return '<div class="sum-card"><div class="pm-eye">'+t+'</div>'+body+'</div>';}
/* ONE WRAPPER, ONE EXIT. This function used to open the wrapper, then return
   early down the unread path having closed it, then close it again at the
   bottom of the read path. Both paths were correct at runtime and the file
   carried one more closing div than opening, which is what the build's
   balance check counts. It is a crude check on purpose and it was right to
   complain: two exits through one open tag is a structure waiting to leak.
   Each path now returns its own balanced block and the wrapper is written
   once, here. */
function sumRender(){
 /* #sumbody, not #sum. #sum is the tab host and it also carries the folded
    analytics surface, which this function would otherwise overwrite. */
 var h=document.getElementById('sumbody'); if(!h)return;
 var r=compute();
 h.innerHTML='<div class="sum-wrap">'+(r.unread?sumUnread(r):sumFull(r))+'</div>';}

/* NOTHING READ YET IS ITS OWN PAGE.

   The owner ruled that the app opens here, and the moment it did this surface
   became the first thing a stranger sees. It was printing coherence 42 percent
   in the largest ring on the screen off nothing but the default six on the
   laws, which is the one rule this product does not break: a reading is never
   invented, and a percentage is never printed off a default. The functional
   gate caught it within a minute of the tab order changing, which is the gate
   doing its job.

   So the opening is the way in. The ring holds a dash, the band word is not
   said, and everything downstream of the nine axes is left out rather than
   printed at zero, because a grid of zeroes still reads as a measurement.
   The spiritual overlay stays: it is derived from a birth date a person
   entered, not from a default, so it is either real or absent. */
function sumUnread(r){
 var o='';

  o+='<div class="sum-hero">'
   /* a neutral colour, not the darkest seat. darkB falls back to Root on an
      empty field, which paints the largest object on the opening screen in the
      alarm red this product reserves for something being wrong. Nothing is
      wrong. Nothing has been entered. */
   +cr(r.darkB,0,{size:'lg',label:'coherence',raw:'\u2013',hot:false,color:'var(--dim)'})
   +'<div><div class="pm-eye">Coherence, not read yet</div>'
   +'<div class="sum-line">Nothing has been entered, so there is nothing to read. '
   +'The arithmetic underneath works and it is not being shown, because a number '
   +'off a default is a number about the default and not about you.</div></div></div>'
   +'<div class="sum-start">'+startHTML('Four ways in. None of them asks you to know '
   +'a term first, and any one of them fills this page.')+'</div>';
  o+=sumOverlay(r);
 return o;}

function sumFull(r){
 var held=W.filter(function(n){return n.sq>=4;}).sort(function(a,b){return b.sq-a.sq;});
 var installed=W.filter(function(n){return n.pole>=4;});
 var over=r.sabs.filter(function(s){return s.over;});
 var under=r.sabs.filter(function(s){return !s.over;});
 var named=r.sabs.filter(function(s){return s.named;}).sort(function(a,b){return b.score-a.score;});
 var laws=SI.map(function(l){return {nm:l.nm,b:l.b,v:S.law[l.nm]};});
 var strong=laws.slice().sort(function(a,b){return b.v-a.v;}).slice(0,4);
 var shut=laws.slice().sort(function(a,b){return a.v-b.v;}).slice(0,4);
 var out='';
 /* the headline. one value, given room. */
 out+='<div class="sum-hero">'+cr(r.darkB,r.CQ,{size:'lg',label:'coherence'})
  +'<div><div class="pm-eye">Coherence, '+r.tier.toLowerCase()+'</div>'
  +'<div class="sum-line">'+(held.length
    ? 'You are carrying <b>'+held.length+'</b> address'+(held.length===1?'':'es')+' at a shadow weight of <b>'+r.DQ.toFixed(1)+'</b>. '
      +(named.length?'The loudest thing running is <b>'+esc(named[0].nm)+'</b> at '+named[0].score+'% match. ':'')
      +'Flow stops where the '+r.darkB.toLowerCase()+' is holding.'
    : 'Nothing is held above the line. The output matches the shape.')
  +'</div></div></div>';
 out+='<div class="sum-grid">';
 out+=sumCard('What is running',
  (named.length? named.slice(0,8).map(function(x){
    return '<div class="sum-row"><span>'+esc(x.nm)+'</span><em>'+x.score+'% '
     +(x.exact?'exact':'near')+'</em><b>'+x.w.toFixed(1)+'</b></div>';}).join('')
   :'<p class="sum-none">No named saboteur is firing.</p>'));
 /* The card title said Collapsed, which is also the word the scale puts on a
    person at the bottom of the line, so a person reading Collapsed 4 beside
    the band word Collapsed had two meanings for one word on one screen. The
    title says what the address does. The body keeps the codex term and
    defines it. */
 out+=sumCard('Shut '+under.length+', overshot '+over.length,
  '<p class="sum-p">Collapse means the address shuts. Jouissance means it will not shut. '
  +'Both are distortion. Coherence is neither.</p>'
  +(over.length? '<div class="sum-chips">'+over.slice(0,6).map(function(x){
     return '<span class="pm-chip over">'+esc(x.nm)+'</span>';}).join('')+'</div>':''));
 out+=sumCard('The chain',
  '<div class="sum-row"><span>saboteurs</span><b>'+r.sabs.length+'</b></div>'
  +'<div class="sum-row"><span>complexes</span><b>'+r.cxs.length+'</b></div>'
  +'<div class="sum-row"><span>hyper-complexes</span><b>'+r.hys.length+'</b></div>'
  +'<div class="sum-row"><span>character layers</span><b>'+r.sups.length+'</b></div>'
  +(r.sups.length?'<p class="sum-p">A character layer is not something you have. It is '
    +'something you cannot see as separate from you.</p>':''));
 out+=sumCard('Masks', r.maskRing.map(function(m){
   return '<div class="sum-row"><span>'+esc(m.nm)+'</span><em>'+(m.bands||[]).join(' + ')
    +'</em><b>'+m.w.toFixed(1)+'</b></div>';}).join(''));
 out+=sumCard('Laws open', strong.map(function(l){
   return '<div class="sum-row"><span>'+l.nm+'</span><em>'+l.b+'</em><b>'+l.v.toFixed(1)+'</b></div>';}).join(''));
 out+=sumCard('Laws shut', shut.map(function(l){
   return '<div class="sum-row"><span>'+l.nm+'</span><em>'+l.b+'</em><b>'+l.v.toFixed(1)+'</b></div>';}).join(''));
 out+='</div>';
 /* the composite */
 out+='<div class="pm-eye" style="margin-top:22px">The composite</div>'
  +'<p class="sum-p">Five lenses on one profile. Each is a function of the soul, the nine '
  +'axes and the twenty-one laws, so none can drift from what the instrument already knows.</p>'
  +'<div class="sum-lens">';
 [lensWestern,lensEastern,lensDesign,lensGene,lensName].forEach(function(fn){
  var L=fn(r);
  out+='<div class="sum-l"><div class="sum-lt">'+L.t+'</div><div class="sum-la">'+esc(L.a)+'</div>'
   +'<div class="sum-lb">'+esc(L.b)+'</div><div class="sum-lc">'+L.c+'</div></div>';});
 out+='</div>';
 out+=sumOverlay(r);
 var hist=(CURP&&CURP.history)||[];
 out+='<div class="sum-ai"><div class="pm-eye">Source AI</div>'
  +'<p class="sum-p">It reads movement, not definitions. It needs history before it has '
  +'anything to perceive, and there '+(hist.length>1
    ? 'are '+hist.length+' snapshots on file.'
    : 'is not enough yet. Run a release or save the diagnostic and it will start.')+'</p>'
  /* The button had no handler in either state, so it promised a thing that
     did nothing when clicked. It says what it is instead. */
  +'</div>';
 return out;}

