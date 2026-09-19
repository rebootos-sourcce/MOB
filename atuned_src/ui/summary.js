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
/* lensName is gone. It reduced a whole name to one digit and called that the
   name lens, which is the Expression and only one of six numbers, and it was
   computing it off a first name. numerology.js does the job properly and the
   spiritual block reads that. */

/* ============================================================
   THE SUMMARY.

   Redesigned on the owner's ruling. The app opens here, so this is
   the first screen and the whole reading has to be on it.

   Analytics across the top as a strip of rings. The story on the
   left, in prose, as the instrument would say it out loud. The
   structures on the right, at a glance. The spiritual layer beneath
   as glyphs with no boxes around them. Full numerology under that.

   THREE COLUMNS ON A DESKTOP, ONE SEQUENCE ON A PHONE. The order in
   the document is the order a phone reads: verdict, story,
   structures, spiritual, numbers. The grid puts the middle two side
   by side when there is room and stacks them when there is not, so
   it is one build and not two.

   EVERY PERCENTAGE IS THE SAME OBJECT. An icon, a ring carrying the
   percentage as an arc, and a pill carrying the number. cr() is that
   object and nothing on this surface prints a bare figure.

   NOTHING HERE IS INVENTED. Every sentence in the prose is
   conditional on the value it names existing. A selection is drawn
   as a selection and never given a ring, because a ring is a
   measurement and a blueprint domain is a choice.
   ============================================================ */

/* ---- the strip. all analytics at a glance, which is what was asked for. ---- */
function sumGlance(r){
 var acc=(typeof accuracy==='function')?accuracy(r):null;
 var e=(r.X+r.Y+r.Z)/3;
 var row=[
  ['coherence', r.darkB, r.CQ, Math.round(r.CQ)+'%', 'Where the field sits, 0 to 100.'],
  ['shadow weight', 'Root', r.DQ*10, r.DQ.toFixed(1), 'What is held, 0 to 10.'],
  /* THIS PRINTED THE OPPOSITE OF WHAT IT MEASURES. It was labelled "installed"
     and glossed "what has been filled in". SQm is built in compute.js from
     sum+=n.sq over the loaded addresses, and n.sq is HELD charge: an address
     joins `loaded` precisely because it is carrying. Installed is the other
     pole, n.rep, and it is not in this figure at all. So the second screen of
     the product printed a person's carried load and told them it was the part
     of them that had been filled in, which is not a wording problem, it is a
     reading that says the reverse of the truth. */
  ['carried depth', 'Root', r.SQm*10, r.SQm.toFixed(1),
   'How deep the carrying addresses run, meaned, 0 to 10.'],
  ['pole', 'Heart', r.poleMean*10, r.poleMean.toFixed(2), 'Coherent opposites standing, 0 to 1.'],
  ['energy', 'Solar', e*100, e.toFixed(2), 'Vitality, awareness and will, meaned, 0 to 1.']];
 if(acc)row.push(['identification','3rd Eye',acc.pct,acc.pct.toFixed(0)+'%',
  'How much of you the instrument has actually measured, plus or minus '+acc.band.toFixed(0)+'.']);
 return '<div class="s-glance">'+row.map(function(x){
  return '<button type="button" class="s-gl" data-gl="'+esc(x[0])+'" title="'+esc(x[4])+'">'
   +cr(x[1],x[2],{size:'sm',label:x[0],raw:x[3]})
   +'<span class="s-gl-k">'+esc(x[0])+'</span></button>';}).join('')+'</div>';}

/* ---- the story. three paragraphs, in the instrument's voice. ----

   Spiritual into psychological, psychological into the body, and then what the
   patterns are doing to momentum. The owner asked for this in his words and
   these are the three joints he named.

   Every clause is guarded. A person with no birth data gets two paragraphs and
   a line saying what is missing, rather than a paragraph of hedges. */
function sumStory(r){
 var nm2=(PEOPLE[S.who]||{}).nm||'You';
 var C=converge(nm2,r), e=C?C.e:null;
 var held=W.filter(function(n){return n.sq>=4;}).sort(function(a,b){return b.sq-a.sq;});
 var named=r.sabs.filter(function(s){return s.named;}).sort(function(a,b){return b.score-a.score;});
 var loud=[].concat(r.sups,r.hys,r.cxs,r.sabs).sort(function(a,b){return b.w-a.w;})[0];
 var seats=flSeats(), stop=null;
 seats.slice().reverse().forEach(function(x){if(!stop&&x.held)stop=x;});
 var arch=(ARCH[r.pi]||{}).nm||'';
 var rootNow=(DOMAINS[S.doms[0]]||{}).r||'';
 var lean=leanRead(r);
 var p=[];

 /* ONE. the spiritual into the psychological. */
 if(e){
  var elRoot=ELEM2ROOT[e.sunEl]||'';
  var num=numerologyOf(nm2,CURP);
  p.push('The blueprint you were born on reads <b>'+esc(e.sunEl)+'</b>, which is the <b>'
   +esc(elRoot)+'</b> root, on life path <b>'+e.lp+'</b>, the one who '
   +esc(e.lpMean||'runs')+'.'
   +(num?' The name carries an expression of <b>'+num.expression+'</b>, '
     +esc(numSays('expression',num.expression))+'.':'')
   +' What is actually running is <b>'+esc(rootNow)+'</b>, through <b>'+esc(arch)+'</b>. '
   +(elRoot===rootNow
     ? 'Those agree, so what you are doing is what you were built for and the cost is elsewhere.'
     : 'Those do not agree. A blueprint that says '+esc(elRoot)+' and a field that runs '
       +esc(rootNow)+' means something was installed on top of the blueprint, and it has been '
       +'carried long enough to feel like a personality.'));
 }else{
  p.push('There is no birth data on file, so the spiritual layer is not in this reading. '
   +'Date, time and place would put it in. What is running now is <b>'+esc(rootNow)
   +'</b>, through <b>'+esc(arch)+'</b>.');}

 /* TWO. the psychological into the body. */
 if(held.length){
  p.push('That reaches the body at <b>'+esc(held[0].k)+'</b>, on the <b>'
   +esc(String(held[0].cf).toLowerCase())+'</b> axis, at '+held[0].sq.toFixed(1)+' of 10.'
   +(loud?' The biggest thing compounding on it is <b>'+esc(loud.nm)+'</b>'
     +(named.length&&named[0]===loud?', at a '+named[0].score+' percent match':'')+'.':'')
   +(stop?' Flow stops at the <b>'+esc(String(stop.p.n).toLowerCase())
     +'</b>, which is where the charge is dense enough to close the seat.'
    :' No seat is closed, so what is held is not yet stopping flow.')
   +' Shadow weight is '+r.DQ.toFixed(1)+' and the law furthest shut is <b>'
   +esc(r.weakL.nm)+'</b>, at the '+esc(String(r.weakL.b).toLowerCase())+'.');
 }else{
  p.push('Nothing is held above the line, so nothing is reaching the body as load. '
   +(r.under?'There are '+r.under+' addresses carrying under it, which is signal and not yet cost.':''));}

 /* THREE. momentum, and what stands between here and the avatar. */
 var av=(CURP&&CURP.avatar)||null;
 var pairs=(av&&av.pairs)?av.pairs.filter(avatarValid):[];
 var gapLine='';
 if(pairs.length){
  var blocked=pairs.map(function(pair){
   var st=seats.filter(function(x){return x.p.n===pair.seat;})[0];
   return {pair:pair, clear:!(st&&st.held)};}).filter(function(x){return !x.clear;});
  gapLine=blocked.length
   ? ' Against the avatar you stated, '+blocked.map(function(x){
       return '<b>'+esc(x.pair.becoming||x.pair.seat)+'</b>';}).join(' and ')
     +' is the part still blocked, and it is blocked by the same charge named above.'
   : ' Every seat your avatar depends on is passing. What you stated you are becoming is not '
     +'being blocked by the field.';
 }else{
  gapLine=' No avatar has been stated, so there is nothing to measure this against. '
   +'Say who you are becoming and this paragraph names what stands in the way.';}
 p.push('Momentum: the field leans <b>'+(lean.ben>=lean.mal?'benign':'malignant')
  +'</b> at '+Math.round(Math.max(lean.ben,lean.mal))+' percent, '
  +(r.benign?'which means it is expanding':'which means it is contracting')+'.'
  +(r.excess?' Installed pole is past the point where it pays, so some of the work is now costing.':'')
  +gapLine);

 return '<div class="s-story"><div class="pm-eye">Reading</div>'
  +p.map(function(t){return '<p class="s-p">'+t+'</p>';}).join('')
  +'<p class="s-src">Written from the nine axes, the twenty one laws, the blueprint and '
  +'the birth data. Nothing here is generated from anything the instrument has not measured.</p>'
  +'</div>';}

/* ---- structures at a glance. the right hand panel. ---- */
function sumStructRow(nm,sub,band,pct,raw,glyph,data){
 return '<button type="button" class="s-row"'+(data||'')+'>'
  +cr(band,pct,{size:'sm',raw:raw,glyph:glyph,label:nm})
  +'<span class="s-row-t"><b>'+esc(nm)+'</b>'+(sub?'<em>'+esc(sub)+'</em>':'')+'</span></button>';}
function sumStruct(r){
 var out='<div class="s-struct">';
 /* the blueprint. a selection, drawn as a selection: icons and names, and no
    ring on any of them, because a ring is a measurement and this is a choice. */
 var rootNow=(DOMAINS[S.doms[0]]||{}).r||'';
 out+='<div class="pm-eye">Blueprint</div><div class="s-sel">'
  +'<span class="s-sel-r" style="--rc:'+(ROOTCOL[rootNow]||'var(--accent)')+'">'
  +esc(rootNow)+'</span>'
  +S.doms.map(function(di){var d=DOMAINS[di]; if(!d)return '';
   return '<button type="button" class="s-dom" data-dom="'+di+'" style="--rc:'+ROOTCOL[d.r]+'" '
    +'title="'+esc(d.nm+'. '+d.d)+'">'+svgI('<path d="'+d.ic+'"/>')
    +'<span>'+esc(d.nm)+'</span></button>';}).join('')+'</div>';
 /* the archetypes. these ARE measured: aff is a real proportion. */
 var aff=(r.aff||[]).map(function(v,i){return {i:i,nm:(ARCH[i]||{}).nm||'',ic:(ARCH[i]||{}).ic,v:v};})
  .filter(function(x){return x.nm;}).sort(function(a,b){return b.v-a.v;});
 var tot=aff.reduce(function(a,x){return a+x.v;},0)||1;
 out+='<div class="pm-eye" style="margin-top:18px">Primary and secondary</div>';
 out+=aff.slice(0,4).map(function(x,i){
  return sumStructRow(x.nm, i===0?'primary':(i===1?'secondary':'also'), 'Heart',
   x.v/tot*100, Math.round(x.v/tot*100)+'%', x.ic?'<path d="'+x.ic+'"/>':null,
   ' data-arch="'+x.i+'"');}).join('');
 /* masks. weight on 0 to 10, so the arc is the weight and the pill is the value. */
 if(r.maskRing&&r.maskRing.length){
  out+='<div class="pm-eye" style="margin-top:18px">Masks</div>';
  out+=r.maskRing.slice(0,6).map(function(m){
   return sumStructRow(m.nm, (m.bands||[]).join(' and '), (m.bands||['Heart'])[0],
    m.w*10, m.w.toFixed(1), null, ' data-mask="'+esc(m.nm)+'"');}).join('');}
 /* the seats. load is measured and the ring is the load. */
 var seats=flSeats().filter(function(x){return x.load>0;})
  .sort(function(a,b){return b.load-a.load;}).slice(0,4);
 if(seats.length){
  out+='<div class="pm-eye" style="margin-top:18px">Where it sits</div>';
  out+=seats.map(function(x){
   return sumStructRow(x.p.n, x.held?'closed':'passing', x.p.n,
    Math.min(100,x.load*100), Math.round(x.load*100)+'%', null,
    ' data-seat="'+esc(x.p.n)+'"');}).join('');}
 /* the chain. counts, never against a total. */
 out+='<div class="pm-eye" style="margin-top:18px">The chain</div><div class="s-chain">'
  +[['saboteurs',r.sabs.length],['complexes',r.cxs.length],
    ['hyper',r.hys.length],['character',r.sups.length]].map(function(x){
   return '<span class="s-ch"><b>'+x[1]+'</b>'+x[0]+'</span>';}).join('')+'</div>';
 return out+'</div>';}

/* ---- the spiritual layer. glyphs, no boxes. ----
   The owner ruled the little boxes out and icons in: a sign, an animal with
   its element, a life path. Each opens its own detail. Date of birth came out
   with the boxes, because a birth date is an input and this is a reading. */
const CELEM_IC={
 Metal:'<circle cx="12" cy="12" r="7"/><path d="M12 5v14"/>',
 Water:'<path d="M4 10c3 3 5 3 8 0s5-3 8 0M4 16c3 3 5 3 8 0s5-3 8 0"/>',
 Wood:'<path d="M12 21V7M12 7L7 3M12 7l5-4M12 13l-5-3M12 13l5-3"/>',
 Fire:'<path d="M12 21c4 0 6-2.6 6-6 0-4-4-5-4-9 0 0-3 2-3 5 0-1-1.6-2-1.6-2C9.4 11 6 12 6 15c0 3.4 2 6 6 6z"/>',
 Earth:'<path d="M3 17h18M6 13h12M9 9h6"/>'};
function sumSpirit(r){
 var nm2=(PEOPLE[S.who]||{}).nm||'You';
 var C=converge(nm2,r);
 if(!C)return '<div class="s-spirit"><div class="pm-eye">The spiritual layer</div>'
  +'<p class="s-p">No birth data on file. Date, time and place would let this run, and '
  +'nothing else is stored, because every reading here is derived from those three.</p></div>';
 var e=C.e;
 function chip(k,v,glyph,lab,val,t){
  return '<button type="button" class="s-chip" data-sp="'+k+'" data-spv="'+esc(String(v))+'" '
   +'title="'+esc(t)+'"><span class="s-chip-g">'+glyph+'</span>'
   +'<span class="s-chip-l">'+esc(lab)+'</span>'
   +(val?'<span class="s-chip-v">'+esc(val)+'</span>':'')+'</button>';}
 function uni(ch){return '<span class="s-uni">'+ch+'</span>';}
 var out='<div class="s-spirit"><div class="pm-eye">The spiritual layer</div>'
  +'<p class="s-p">Five systems, read independently off one birth date. '
  +'<b>'+C.agree.length+' of '+C.of+'</b> comparisons between them and the field point the '
  +'same way. That is what the convergence is: agreements over comparisons, not a score.'
  +(C.open&&C.open.length?' '+C.open.length+' could not be compared at all: '
    +esc(C.open.join('; '))+'. A gap is not a disagreement.':'')+'</p>'
  +'<div class="s-chips">';
 out+=chip('sign',e.sun,uni(ZGLYPH[e.sun]||'*'),e.sun,'',
  'Sun sign. '+(SIGN_RUNS[e.sun]||''));
 if(e.moon)out+=chip('sign',e.moon,uni(ZGLYPH[e.moon]||'*'),e.moon,'moon',
  'Moon sign. What it runs on underneath.');
 if(e.rising)out+=chip('sign',e.rising,uni(ZGLYPH[e.rising]||'*'),e.rising,'rising',
  'Rising sign. What arrives in the room first.');
 out+=chip('celem',e.celem,svgI(CELEM_IC[e.celem]||CELEM_IC.Earth),e.celem+' '+e.chinese,'',
  'Year animal and element. '+(CH_RUNS[e.chinese]||''));
 out+=chip('lp',e.lp,'<span class="s-num-g">'+e.lp+'</span>','Life path',String(e.lp),
  'Life path. '+(LP_RUNS[e.lp]||''));
 out+=chip('hd',(e.hd.profile||'unresolved'),
  svgI('<path d="M7 4v16M17 4v16M7 9h10M7 15h10"/>'),'Human design',
  e.hd.profile?('profile '+e.hd.profile):'unresolved',
  e.hd.unresolved?'Type needs the full bodygraph and is not computed. The profile is.'
   :'Design profile.');
 out+=chip('gk',e.gk.gate,svgI('<circle cx="12" cy="12" r="8.4"/><path d="M12 3.6v16.8"/>'),
  'Gene key',e.gk.gate+'.'+e.gk.line,'Gate and line. Shadow to gift to siddhi.');
 out+='</div>';
 if(C.agree.length||C.differ.length){
  out+='<div class="s-agree">';
  out+=C.agree.map(function(a){return '<div class="s-ag">'+esc(a)+'</div>';}).join('');
  out+=C.differ.map(function(d){return '<div class="s-dg">'+esc(d)+'</div>';}).join('');
  out+='</div>';
  if(C.differ.length)out+='<p class="s-src">The instrument does not pick a winner. A birth '
   +'chart describes the blueprint and the field describes what is running now. They diverge '
   +'where something was installed on top of the blueprint.</p>';}
 return out+'</div>';}

/* ---- full numerology. six numbers, and every name part on its own. ---- */
function sumNum(r){
 /* NOTHING ENTERED MEANS NOTHING READ, AND THIS SURFACE SAID BOTH.
    sumUnread prints "a number off a default is a number about the default and
    not about you" and then called this, which fell back to the name "You" and
    computed a full numerology reading off it, ending in a karmic debt line
    about something built on a false footing coming down. Twenty lines under
    the sentence forbidding exactly that. The guard belongs here rather than at
    the caller, because any future caller has the same problem. */
 if(r&&r.unread)return '';
 var nm2=(PEOPLE[S.who]||{}).nm||'You';
 var N=numerologyOf(nm2,CURP);
 if(!N)return '';
 var rows=[
  ['expression','Expression',N.expression,'every letter of the full name'],
  ['soul','Soul urge',N.soul,'the vowels. what is wanted when nobody is asked'],
  ['personality','Personality',N.personality,'the consonants. what arrives first']];
 if(N.lifePath!==null)rows.unshift(['lifePath','Life path',N.lifePath,'the birth date']);
 if(N.birthday!==null)rows.push(['birthday','Birthday',N.birthday,'the day of the month, unreduced']);
 if(N.maturity!==null)rows.push(['maturity','Maturity',N.maturity,'life path plus expression']);
 var out='<div class="s-numer"><div class="pm-eye">Numerology, in full</div>'
  +'<p class="s-p">Read off <b>'+esc(N.parts.map(function(p){
    return p.charAt(0)+p.slice(1).toLowerCase();}).join(' '))+'</b>. Pythagorean, with 11, 22 '
  +'and 33 surviving reduction at every step.</p>'
  +'<div class="s-nrows">';
 out+=rows.map(function(x){
  var v=x[2], master=NUM_MASTER.indexOf(v)>=0;
  return '<button type="button" class="s-nrow'+(master?' master':'')+'" data-num="'+x[0]+'" '
   +'title="'+esc(x[3])+'"><span class="s-nv">'+v+'</span>'
   +'<span class="s-nt"><b>'+esc(x[1])+'</b><em>'
   +esc(numSays(x[0],v)||x[3])+'</em></span></button>';}).join('');
 out+='</div>';
 /* every name part on its own, which is what was asked for */
 out+='<div class="pm-eye" style="margin-top:16px">Each name</div><div class="s-nparts">';
 out+=N.each.map(function(x){
  return '<div class="s-npart"><span class="s-nv sm">'+x.v+'</span>'
   +'<span class="s-nt"><b>'+esc(x.nm)+'</b><em>'+esc(x.role)+'. '+esc(x.says).toLowerCase()
   +(x.debt?'. karmic debt '+x.debt:'')+'</em></span></div>';}).join('');
 out+='</div>';
 out+='<p class="s-src">Cornerstone <b>'+esc(N.cornerstone)+'</b>, '+esc(N.cornerSays)
  +'. Capstone <b>'+esc(N.capstone)+'</b>, '+esc(N.capSays)+'.'
  +(N.debt?' Karmic debt '+N.debt+' on the whole name. '+esc(NUM_DEBT_SAYS[N.debt]):'')
  +(N.split?' The parts reduce to '+N.split.byPart+' and the flat sum to '+N.split.flat
    +', which happens when one name carries a master. The parts are the reading.':'')
  +'</p>';
 return out+'</div>';}

/* ---- the two paths, each balanced, and one wrapper written once ---- */
function sumRender(){
 /* #sumbody, not #sum. #sum is the tab host and it also carries the folded
    analytics surface, which this function would otherwise overwrite. */
 var h=document.getElementById('sumbody'); if(!h)return;
 var r=compute();
 h.innerHTML='<div class="sum-wrap">'+(r.unread?sumUnread(r):sumFull(r))+'</div>';
 sumWire();}

/* NOTHING READ YET IS ITS OWN PAGE.

   The app opens here, so this surface is the first thing a stranger sees. It
   was printing coherence 42 percent in the largest ring on the screen off
   nothing but the default six on the laws. A reading is never invented and a
   percentage is never printed off a default, so the ring holds a dash and the
   page is the way in instead. The spiritual layer stays: it is derived from a
   birth date a person entered, not from a default, so it is real or absent. */
function sumUnread(r){
 return '<div class="sum-hero">'
  +cr(r.darkB,0,{size:'lg',label:'coherence',raw:'–',hot:false,color:'var(--dim)'})
  +'<div><div class="pm-eye">Coherence, not read yet</div>'
  +'<div class="sum-line">Nothing has been entered, so there is nothing to read. '
  +'The arithmetic underneath works and it is not being shown, because a number off a '
  +'default is a number about the default and not about you.</div></div></div>'
  +'<div class="sum-start">'+startHTML('Four ways in. None of them asks you to know a term '
  +'first, and any one of them fills this page.')+'</div>'
  +sumSpirit(r)+sumNum(r);}

/* ============================================================
   THE SUMMARY, REBUILT. Named wrong four times and this is the correction.

   What it was: a glance strip, then the reading and the blueprint stack side
   by side, then the spiritual layer, then numerology at the very bottom.
   Measured at 3990px and 115 interactive elements, with the person's name
   first appearing 1.9 screens down inside a numerology sentence, and the
   reading itself sitting as bare text on the page ground with nothing around
   it. The owner: terrible layout, terrible use of space, the chain beneath
   the stack is weird, the numerology should be above, and the reading needs
   a home.

   What it is now, and every part of this is his instruction:

   THE PLATE. The first name at display size, because this page has one job
   before any other and that job is to say this is you. The band beside it,
   and the direction out of that band, which lives in TIERDEF and has only
   ever been reachable through a tooltip.

   THE READING HAS A HOME. A display panel with its own ground and its own
   edge, so the paragraph a person came here to read is a thing on the page
   rather than text on the background.

   EVERYTHING STRUCTURAL GOES RIGHT. Blueprint, primary, secondary, masks,
   expression, soul urge, numerology, the spiritual layer. He asked for it
   above and he asked for it on the right in the same breath; the right is
   the one that holds, because the centre then carries the reading and
   nothing else, and the right column is what this product already calls the
   information panel. The best arrangement inside that column is the thing
   the ICPs are being simulated on.

   THE OUTPUT ROW. The block this page has never had: what this state calls
   for, what to release, and how far to the next marker. A summary with no
   next action is a diagnosis with no prescription.
   ============================================================ */
function sumPlate(r){
 var who=(CURP&&CURP.name)||'You';
 var first=String(who).trim().split(/\s+/)[0]||'You';
 var t=TIER_BY[r.tier]||null;
 return '<div class="s-plate">'
  +'<div class="s-pl-l">'
   +'<div class="s-pname">'+esc(first)+'</div>'
   +(CURP&&CURP.who&&CURP.who.line?'<div class="s-pwho">'+esc(CURP.who.line)+'</div>':'')
  +'</div>'
  +'<div class="s-pl-r">'
   +cr(r.darkB,r.CQ,{size:'lg',label:'coherence',raw:Math.round(r.CQ)+'%',hot:false})
   +'<div class="s-pband"><b>'+esc(r.tier)+'</b>'
   +(t&&t.state?'<em>'+esc(t.state)+'</em>':'')+'</div>'
  +'</div>'
  /* the direction out, which has never been on a surface a touch screen can
     reach. It is the third of the three things a band is required to carry. */
  +(t&&t.toward?'<div class="s-ptoward"><span class="pm-eye">Where it goes</span>'
    +esc(t.toward)+'</div>':'')
  +'</div>';}

/* WHAT THIS STATE CALLS FOR. ritFor is a pure function of the reading and has
   only ever been called from inside the ritual overlay, which opens after a
   release run, which means a person who has not run one has never seen it. */
function sumOutput(r){
 var rit=(typeof ritFor==='function')?ritFor(r):null;
 var m=(typeof meterRead==='function')?meterRead(CURP):null;
 var hot=r.loaded.slice().sort(function(a,b){return b.sq-a.sq;})[0];
 var card=function(eye,nm,sub,act){
  return '<div class="s-out">'
   +'<span class="pm-eye">'+eye+'</span>'
   +'<div class="s-out-n">'+esc(nm)+'</div>'
   +(sub?'<div class="s-out-s">'+esc(sub)+'</div>':'')
   +(act||'')+'</div>';};
 return '<div class="s-outrow">'
  +(rit?card('The protocol this calls for',rit.nm||'A practice',
     rit.how||rit.d||'','<button class="btn s-oact" data-sout="rit">Open it</button>')
    :card('The protocol this calls for','Not enough read yet',
     'Write what happened and this fills in',''))
  +(hot?card('Release this first',hot.k,
     hot.b+' seat, holding '+hot.sq.toFixed(1),
     '<button class="btn s-oact" data-sout="rel" data-n="'+hot.i+'">Run a release</button>')
    :card('Release this first','Nothing is carrying',
     'Nothing is held above the line',''))
  +(m&&m.next?card('Next marker',m.next.nm,m.next.left+' away','')
    :card('Next marker','The first one','Open some ground and it appears',''))
  +'</div>';}

function sumFull(r){
 return sumPlate(r)
  +'<div class="s-cols">'
   +'<div class="s-main">'
    +'<div class="s-readbox">'+sumStory(r)+'</div>'
    +sumOutput(r)
    +sumGlance(r)
   +'</div>'
   /* THE INFORMATION PANEL. Everything structural, in one column, in the
      order a person asks for it: what is running, then the blueprint it runs
      on, then the spiritual layer, then the numbers. */
   +'<aside class="s-side">'
    +sumStruct(r)
    +sumSpirit(r)
    +sumNum(r)
   +'</aside>'
  +'</div>';}

/* ---- one delegated listener for everything on this surface ---- */
function sumWire(){
 var h=document.getElementById('sumbody'); if(!h||h.dataset.wired)return;
 h.dataset.wired='1';
 h.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-sout],[data-sp],[data-num],[data-arch],[data-dom],[data-seat],[data-mask],[data-gl]'):null;
  if(!b)return;
  /* THE TWO PRIMARY ACTIONS ON THIS PAGE DID NOTHING.

     The output row prints "Open it" under the protocol and "Run a release"
     under the heaviest address, and data-sout was not in the selector above,
     so closest() returned null and the handler returned on its first line.
     Both buttons have been inert since the row was built. They are the only
     two actions on the surface a stranger opens on, so the product's front
     door had no handle on it.

     They go to the surfaces that already exist. Open it opens the ritual
     builder. Run a release picks the one address the card names and opens the
     run, which is the same call the Story panel makes. */
  if(b.hasAttribute('data-sout')){
   var w=b.getAttribute('data-sout');
   if(w==='rit'&&typeof ritOpen==='function'){ritOpen(null);return;}
   if(w==='rel'&&typeof relPick==='function'){
    var nid=+b.getAttribute('data-n');
    if(!isNaN(nid)){relPick([nid]);return;}}
   return;}
  if(b.hasAttribute('data-sp'))return runSpDrill(b.getAttribute('data-sp'),b.getAttribute('data-spv'));
  if(b.hasAttribute('data-num'))return runNumDrill(b.getAttribute('data-num'));
  if(b.hasAttribute('data-dom'))return runCellDrill(+b.getAttribute('data-dom'),0);
  if(b.hasAttribute('data-seat')){
   /* runSeatDrill takes the APC entry, not a name. Looked up by band rather
      than passed a string it would then have to parse. */
   var sn=b.getAttribute('data-seat');
   var sc=APC.filter(function(x){return x.b===sn;})[0];
   return sc?runSeatDrill(sc):runCoreDrill();}
  if(b.hasAttribute('data-gl'))return runCoreDrill();
  /* an archetype or a mask has no drill of its own yet, so the core reading is
     the honest destination rather than a button that does nothing. */
  return runCoreDrill();});}
