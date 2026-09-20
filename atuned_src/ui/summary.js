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

/* which span the integrity chart is showing. its own, not the compass's, so
   a person looking at a year here does not change what the compass shows. */
var SUM_SPAN='quarter';
/* a small number, spelled, for the start of a sentence */
const SUM_WORDS=['no','One','Two','Three','Four','Five','Six','Seven','Eight','Nine'];
function SUM_WORD(n){return SUM_WORDS[n]||String(n);}
/* ---- the strip. all analytics at a glance, which is what was asked for. ---- */
function sumGlance(r){
 var acc=(typeof accuracy==='function')?accuracy(r):null;
 var e=(r.X+r.Y+r.Z)/3;
 var row=[
  /* the glance row's coherence ring reads the tier too, for the same reason */
  ['coherence', r.darkB, r.CQ, Math.round(r.CQ)+'%', 'Where the field sits, 0 to 100.',
   'of 100', TIERCOL[r.tier]],
  /* THE LABEL SAID 0 TO 10 AND THE NUMBER GOES PAST 54. Measured across the
     roster: Gordon 54.7, Tomas 45.9, Ana 22.8. It is a sum over every address
     carrying, so it has no ceiling of ten or of anything else, and a stated
     range the data walks straight through is a lie on the surface.

     The ring is a second half of the same lie and is not fixed here: r.DQ*10
     clamps at 100, so every profile past ten draws an identical full ring.
     Replacing this figure with the two facts it sums is the right answer and
     it is a design change, so it is the owner's. The label tells the truth in
     the meantime. */
  ['shadow weight', 'Root', r.DQ*10, r.DQ.toFixed(1),
   'Everything held, summed across the addresses carrying it. No ceiling.',
   'summed, no ceiling'],
  /* THIS PRINTED THE OPPOSITE OF WHAT IT MEASURES. It was labelled "installed"
     and glossed "what has been filled in". SQm is built in compute.js from
     sum+=n.sq over the loaded addresses, and n.sq is HELD charge: an address
     joins `loaded` precisely because it is carrying. Installed is the other
     pole, n.rep, and it is not in this figure at all. So the second screen of
     the product printed a person's carried load and told them it was the part
     of them that had been filled in, which is not a wording problem, it is a
     reading that says the reverse of the truth. */
  ['carried depth', 'Root', r.SQm*10, r.SQm.toFixed(1),
   'How deep the carrying addresses run, meaned, 0 to 10.', 'of 10'],
  /* and this said 0 to 1 while reading 8.49. It is a mean of values clamped
     to 0 and 10, so ten is the ceiling and always was. */
  ['pole', 'Heart', r.poleMean*10, r.poleMean.toFixed(2),
   'Coherent opposites standing, 0 to 10.', 'of 10'],
  ['energy', 'Solar', e*100, e.toFixed(2),
   'Vitality, awareness and will, meaned, 0 to 1.', 'of 1']];
 if(acc)row.push(['identification','3rd Eye',acc.pct,acc.pct.toFixed(0)+'%',
  'How much of you the instrument has actually measured, plus or minus '+acc.band.toFixed(0)+'.',
  'of 100, plus or minus '+acc.band.toFixed(0)]);
 /* THE SCALE IS ON THE SCREEN, NOT IN A TOOLTIP. Two rulings meet here and
    both were being broken by the same line.

    "You read 13, what does that mean." Every number says what it is out of.
    This row printed 8.49 beside the word pole and 0.83 beside the word
    energy, on two different scales, with nothing to measure either against.

    And a title attribute is not an answer, because a phone has no hover. Eight
    definitions in this product live only in a title and a person on a phone
    can reach none of them. The scale is now a third line in the button, where
    everybody can see it, and the title keeps the longer sentence. */
 return '<div class="s-glance">'+row.map(function(x){
  return '<button type="button" class="s-gl" data-gl="'+esc(x[0])+'" title="'+esc(x[4])+'">'
   +cr(x[1],x[2],{size:'sm',label:x[0],raw:x[3],color:x[6]||undefined,
     /* A READING WHERE HIGH IS THE GOOD END NEVER PRINTS RED. Ruled: "96 per
        cent flow accuracy and yet it is red. Red is a colour of danger. That
        is bad colouring." cr reddens anything past ninety, which is correct
        for shadow weight and exactly backwards for coherence, energy and
        identification. */
     hot:(x[0]==='shadow weight'||x[0]==='carried depth')?undefined:false})
   +'<span class="s-gl-k">'+esc(x[0])
   +'<em class="s-gl-s">'+esc(x[5]||'')+'</em></span></button>';}).join('')+'</div>';}

/* ---- the story. three paragraphs, in the instrument's voice. ----

   Spiritual into psychological, psychological into the body, and then what the
   patterns are doing to momentum. The owner asked for this in his words and
   these are the three joints he named.

   Every clause is guarded. A person with no birth data gets two paragraphs and
   a line saying what is missing, rather than a paragraph of hedges. */
/* ============================================================
   THE STORY, IN THE PERSON'S OWN WORDS, COLOURED BY WHERE IT LANDED.

   Ruled: the centre of this page is the story, and every word that names a
   behaviour is bold and carries the colour of the seat it belongs to.

   storyui already does this while somebody types, but only for the text in
   the box, because it reads ST_PARSED, the live parse. A committed entry is
   just text on the record, so it has to be parsed again here. Same colour
   rule, same seat map, so a word looks the same after it is committed as it
   did while it was being written, which is the whole point of colouring it.

   K2BAND is the map between the two, and it is the thing that was missed once
   already: the sniffer stores a seat key like throat and seatCol wants Throat,
   so without it every word in every seat comes out one colour.
   ============================================================ */
function sumWords(text){
 if(!text)return '';
 var pr=(typeof parseStory==='function')?parseStory(text):null;
 if(!pr||!pr.hits||!pr.hits.length)return esc(text);
 var band={};
 pr.hits.forEach(function(h){ if(h.t&&h.band&&h.band!=='coherent')band[h.t]=h.band; });
 var words=Object.keys(band).sort(function(a,b){return b.length-a.length;});
 if(!words.length)return esc(text);
 var rx;
 try{ rx=new RegExp('\\b('+words.map(function(w){
   return w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|')+')\\b','gi'); }
 catch(e){ return esc(text); }
 var out='', last=0, m;
 while((m=rx.exec(text))!==null){
  out+=esc(text.slice(last,m.index));
  var k=band[m[0].toLowerCase()]||band[m[0]];
  var bn=K2BAND[k]||k;
  out+='<b class="s-w" style="--c:'+(bn?seatCol(bn):'var(--accent)')+'">'
   +esc(m[0])+'</b>';
  last=m.index+m[0].length;
  if(rx.lastIndex===m.index)rx.lastIndex++;}
 out+=esc(text.slice(last));
 return out;}

/* the entries a person has actually committed, newest first, capped so the
   page stays a reading and does not become a journal. The journal is Story. */
function sumEntries(){
 var es=((CURP&&CURP.story&&CURP.story.entries)||[]).slice();
 return es.reverse().slice(0,3);}
function sumToldHtml(){
 var es=sumEntries();
 if(!es.length)return '';
 return '<div class="s-told"><div class="pm-eye">What You Told It</div>'
  +es.map(function(e){
    var d=new Date(e.t);
    return '<div class="s-told-e"><time>'+(isNaN(d)?'':d.toLocaleDateString())
     +'</time><p>'+sumWords(String(e.text||''))+'</p></div>';}).join('')
  +'</div>';}
/* A BOLD NAME WEARS ITS OWN FAMILY'S COLOUR. Ruled: "where it's bold text,
   like Witness, Architect, Sage, those bold colours need to relate back to
   their icon colours."

   Measured before: twelve bold names in the reading and every one of them
   computed to plain ink. The mechanism already worked four inches away, in
   sumWords, where a matched word in a story wears its seat. This is that rule
   applied to the block that lacked it, not a new one.

   A name with no family stays plain rather than being given a colour it has
   not earned. The numerology figures are the case: an expression of 1 belongs
   to no seat and no root, so it is not painted. */
function sumB(text,col){
 return '<b'+(col?' class="s-w" style="--c:'+col+'"':'')+'>'+esc(text)+'</b>';}
function rootB(nm){return sumB(nm,ROOTCOL[nm]||null);}
function archB(nm){
 var a=ARCH.filter(function(x){return x.nm===nm;})[0];
 return sumB(nm,a&&a.b?seatCol(a.b):null);}
function seatB(nm,band){return sumB(nm,band?seatCol(band):null);}
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
  p.push('The blueprint you were born on reads '+sumB(e.sunEl,ROOTCOL[elRoot]||null)
   +', which is the '+rootB(elRoot)+' root, on life path <b>'+e.lp+'</b>, the one who '
   +esc(e.lpMean||'runs')+'.'
   +(num?' The name carries an expression of <b>'+num.expression+'</b>, '
     +esc(numSays('expression',num.expression))+'.':'')
   +' What is actually running is '+rootB(rootNow)+', through '+archB(arch)+'. '
   +(elRoot===rootNow
     ? 'Those agree, so what you are doing is what you were built for and the cost is elsewhere.'
     : 'Those do not agree. A blueprint that says '+esc(elRoot)+' and a field that runs '
       +esc(rootNow)+' means something was installed on top of the blueprint, and it has been '
       +'carried long enough to feel like a personality.'));
 }else{
  p.push('There is no birth data on file, so the spiritual layer is not in this reading. '
   +'Date, time and place would put it in. What is running now is '+rootB(rootNow)
   +', through '+archB(arch)+'.');}

 /* TWO. the psychological into the body. */
 if(held.length){
  p.push('That reaches the body at '+seatB(held[0].k,held[0].b)+', on the '
   /* the weight is the reading. "of 10" made it a mark out of ten. */
   +seatB(String(held[0].cf).toLowerCase(),held[0].b)+' axis, at a weight of '
   +held[0].sq.toFixed(1)+'.'
   +(loud?' The biggest thing compounding on it is <b>'+esc(loud.nm)+'</b>'
     +(named.length&&named[0]===loud?', at a '+named[0].score+' percent match':'')+'.':'')
   +(stop?' Flow stops at the '+seatB(String(stop.p.n).toLowerCase(),stop.p.b)
     +', which is where the charge is dense enough to close the seat.'
    :' No seat is closed, so what is held is not yet stopping flow.')
   +' Shadow weight is '+r.DQ.toFixed(1)+' and the law furthest shut is '
   +seatB(r.weakL.nm,r.weakL.b)+', at the '+seatB(String(r.weakL.b).toLowerCase(),r.weakL.b)+'.');
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
 /* "100 percent" OF WHAT. The sentence read "the field leans benign at 100
    percent", which is a share with no denominator on a surface where a
    percentage could mean the share of the field, the share of the stack or a
    confidence. It is the split between the two leans, so the sentence says
    that: benign against malignant, and the two add to a hundred. */
 p.push('Momentum: of the two leans the field is <b>'
  +Math.round(Math.max(lean.ben,lean.mal))+' per cent '
  +(lean.ben>=lean.mal?'benign':'malignant')+'</b> and '
  +(100-Math.round(Math.max(lean.ben,lean.mal)))+' per cent '
  +(lean.ben>=lean.mal?'malignant':'benign')+', '
  +(r.benign?'which means it is expanding':'which means it is contracting')+'.'
  +(r.excess?' Installed pole is past the point where it pays, so some of the work is now costing.':'')
  +gapLine);

 return '<div class="s-story"><div class="pm-eye">Reading</div>'
  +p.map(function(t){return '<p class="s-p">'+t+'</p>';}).join('')
  +'<p class="s-src">Written from the nine axes, the twenty one laws, the blueprint and '
  +'the birth data. Nothing here is generated from anything the instrument has not measured.</p>'
  +'</div>';}

/* ---- structures at a glance. the right hand panel. ---- */
/* hot is handed in because these rows carry two opposite kinds of reading.
   A mask weight and a seat load are charge, where high is the cost. An
   archetype share is a proportion of a blueprint, where high is only how
   much of the blueprint it is. The alarm colour belongs to the first kind
   and nowhere near the second. */
function sumStructRow(nm,sub,band,pct,raw,glyph,data,hot){
 return '<button type="button" class="s-row"'+(data||'')+'>'
  +cr(band,pct,{size:'sm',raw:raw,glyph:glyph,label:nm,hot:hot})
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
 /* EVERY ARCHETYPE IN ITS OWN SEAT'S COLOUR. Ruled. Twelve named things were
    passed the literal 'Heart' here, so a primary Warrior and a primary Sage
    printed in the same green, and the family the mark belongs to was invisible
    on the one surface that names it. The seat is on the record now. */
 /* EVERY NAMED THING IS DESCRIBED AS A BEHAVIOUR, NOT A LABEL. Ruled.

    This printed "Warrior, primary" and "Innocent, secondary", which is a
    label with a second label under it and tells a person nothing they can
    act on. The behaviour was already on the record and had never been
    rendered: ARCH carries a v, and the Warrior's is "moves on the threat".
    The rank is still there, because first and second do mean something, but
    it is carried by the order of the rows and by the percentage, which is
    what an ordered list with a number on it already says. */
 var aff=(r.aff||[]).map(function(v,i){return {i:i,nm:(ARCH[i]||{}).nm||'',
   ic:(ARCH[i]||{}).ic, b:(ARCH[i]||{}).b||'Heart', d:(ARCH[i]||{}).v||'', v:v};})
  .filter(function(x){return x.nm;}).sort(function(a,b){return b.v-a.v;});
 var tot=aff.reduce(function(a,x){return a+x.v;},0)||1;
 out+='<div class="pm-eye" style="margin-top:18px">Primary and secondary</div>';
 out+=aff.slice(0,4).map(function(x,i){
  return sumStructRow(x.nm, x.d, x.b,
   x.v/tot*100, Math.round(x.v/tot*100)+'%', x.ic?'<path d="'+x.ic+'"/>':null,
   ' data-arch="'+x.i+'"', false);}).join('');
 /* masks. weight on 0 to 10, so the arc is the weight and the pill is the value. */
 if(r.maskRing&&r.maskRing.length){
  out+='<div class="pm-eye" style="margin-top:18px">Masks</div>';
  out+=r.maskRing.slice(0,6).map(function(m){
   /* the mask's behaviour, not its two seats. the seats are the ring colour
      and the drill, and a person cannot do anything with "Root and Sacral". */
   var md=(MASKS.filter(function(x){return x.nm===m.nm;})[0]||{}).v
     ||(m.bands||[]).join(' and ');
   return sumStructRow(m.nm, md, (m.bands||['Heart'])[0],
    m.w*10, m.w.toFixed(1), null, ' data-mask="'+esc(m.nm)+'"');}).join('');}
 /* the seats. load is measured and the ring is the load. */
 var seats=flSeats().filter(function(x){return x.load>0;})
  .sort(function(a,b){return b.load-a.load;}).slice(0,4);
 if(seats.length){
  out+='<div class="pm-eye" style="margin-top:18px">Where it sits</div>';
  out+=seats.map(function(x){
   /* and a seat says what a closed one does rather than the word closed */
   return sumStructRow(x.p.n,
    x.held?'shut, so charge sits under it':'open, so charge passes through',
    x.p.n,
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
  /* This was a fraction with a sentence after it explaining that it was not a
     score, which is an admission that it read as one. Two facts in sequence
     need no defending and say the same thing. */
  +'<b>'+C.of+'</b> comparison'+(C.of===1?'':'s')+' could be made between them and the '
  +'field. <b>'+C.agree.length+'</b> point the same way. That is what the convergence is.'
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
 var out='<div class="s-numer"><div class="pm-eye plain">Numerology, in full</div>'
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
  /* ONE SLOT, ONE LABEL, the same correction as the analytics hero. The
     label said "Coherence, not read yet" and the line directly under it says
     the same thing in a full sentence, so the label was both changing with the
     data and repeating the line. */
  +'<div><div class="pm-eye">Coherence</div>'
  +'<div class="sum-line">Not read yet. Nothing has been entered, so there is nothing to read. '
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
   /* THE TIER'S OWN COLOUR, not the heaviest seat's. Ruled. The plate is the
      one place on this page that names the band, so its ring has to mean the
      band. It was drawn in r.darkB, so a person at Embodied whose heaviest
      seat was the Root got a red ring on the second best reading there is. */
   +cr(r.darkB,r.CQ,{size:'lg',label:'coherence',raw:Math.round(r.CQ)+'%',hot:false,
      color:TIERCOL[r.tier]||undefined})
   /* and the word wears it too. A ring in one colour beside the same band
      printed in the body colour reads as two facts, not one. */
   +'<div class="s-pband"><b style="color:'+(TIERCOL[r.tier]||'var(--ink)')+'">'
   +esc(r.tier)+'</b>'
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
 /* how much of the reading a release can still reach, from the engine */
 var rhead=(typeof cqHeadroom==='function')?cqHeadroom(r.CQ):99;
 var card=function(eye,nm,sub,act){
  return '<div class="s-out">'
   +'<span class="pm-eye">'+eye+'</span>'
   +'<div class="s-out-n">'+esc(nm)+'</div>'
   +(sub?'<div class="s-out-s">'+esc(sub)+'</div>':'')
   +(act||'')+'</div>';};
 return '<div class="s-outrow">'
  /* A LABEL, NOT A CLAUSE. "The protocol this calls for" is five words and
     came back as "The Protocol This Calls For". card() writes one eyebrow for
     every card in this row, so the fix belongs in the string rather than in a
     per call opt out: the row is driven by the reading, which is what "this
     calls for" was there to say, and the row says it already. */
  +(rit?card('The protocol',rit.nm||'A practice',
     rit.how||rit.d||'','<button class="btn s-oact" data-sout="rit">Open it</button>')
    :card('The protocol','Not enough read yet',
     'Write what happened and this fills in',''))
  /* WHAT RELEASE HAS LEFT IN IT, said before the person spends the time, and
     only when there is something to spend it on.

     CQ is intention times integrity over resistance. A release works on
     resistance and on the installed pole; it cannot manufacture integrity,
     because integrity is the twenty one laws and those move when a person
     answers them or when what they do changes. Measured by clearing every
     charge and reading CQ back: Marcus can run every release this product will
     ever offer him and move 0.3, Sofia 1.5, Angela 1.0, and all three stay in
     the same band. They were being pointed at the one lever already spent with
     nothing on the screen saying so.

     Four cases, and each says only what is true of it. Something above the
     line, release it. Carrying below the line with room left, release that.
     Carrying with the room gone, name the lever that is not gone. Carrying
     nothing, say so, which is the right answer for the people it is true of
     and was previously said to everybody.

     THIN is 1.5 points of CQ. Not a tuned constant: the reading is published
     to plus or minus about thirteen, so a lever with under one and a half in
     it cannot produce a move this instrument would call a reading, and the
     product should not spend a person's fifteen minutes pretending otherwise. */
  +(function(){
    var THIN=1.5;
    if(hot)return card('Release this first',hot.k,
     hot.b+' seat, holding '+hot.sq.toFixed(1)
      +(r.unread?'':'. Release has about '+rhead.toFixed(1)+' in it'),
     '<button class="btn s-oact" data-sout="rel" data-n="'+hot.i+'">Run a release</button>');
    if(r.heaviest&&(r.unread||rhead>=THIN))return card('Release this first',r.heaviest.k,
     r.heaviest.b+' seat, below the line at '+r.heaviest.sq.toFixed(1)
      +'. The heaviest thing you are holding',
     '<button class="btn s-oact" data-sout="rel" data-n="'+r.heaviest.i+'">Run a release</button>');
    /* four words, so it is a label. "now" was the fifth and it was carrying
       nothing: the whole surface is the reading now. */
    if(r.heaviest)return card('What moves the reading','The twenty one laws',
     'Release has about '+rhead.toFixed(1)+' left in it for you. The rest of the reading '
     +'is integrity, and that moves when you answer the laws or when what you do changes',
     '<button class="btn s-oact" data-sout="iq">Answer the laws</button>');
    return card('Release this first','Nothing is carrying',
     'No address is holding anything','');}())
  +(m&&m.next?card('Next marker',m.next.nm,m.next.left+' away','')
    :card('Next marker','The first one','Open some ground and it appears',''))
  +'</div>';}

function sumFull(r){
 return sumPlate(r)
  +'<div class="s-cols">'
   +'<div class="s-main">'
    /* THE CENTRE IS THE STORY. Ruled. Their own words first, coloured where
       they landed, then the reading built from them. The order matters: the
       reading is a claim about the person and the story is the evidence for
       it, and evidence goes first. */
    +sumToldHtml()
    +'<div class="s-readbox">'+sumStory(r)+'</div>'
    +sumOutput(r)
    +sumAxes(r)
   +'</div>'
   /* THE INFORMATION PANEL. Everything structural, in one column, in the
      order a person asks for it: what is running, then the blueprint it runs
      on, then the spiritual layer, then the numbers.

      AND THE GLANCE ROW COMES WITH IT. Ruled: "the centre column becomes text
      about you, and everything energetic moves right." Six rings reading
      coherence, shadow weight, carried depth, pole, energy and identification
      are as energetic as anything on this page, and they were sitting under
      the reading in the centre. The centre is the story and the actions it
      calls for. Everything measured is on the right. */
   +'<aside class="s-side">'
    +sumGlance(r)
    +sumStruct(r)
    +sumLens(r)
    +sumSpirit(r)
    +sumNum(r)
   +'</aside>'
  +'</div>'
  /* INTEGRITY OVER TIME, FULL WIDTH, DAY TO FIVE YEARS. Ruled, and it is the
     one thing this page had no version of. Coherence over time lives on the
     compass; integrity is the other half and it is the half a person can
     actually move, because integrity is the twenty one laws and a law closes
     by being kept. Full width under both columns, because a line five years
     long inside a column is a scribble. */
  +sumIg(r);}

/* ============================================================
   WHAT YOU ARE CARRYING, IN SENTENCES, IN THE BODY.

   Ruled: "the centre column becomes text about you." The centre had the
   reading and the three action cards and then half a screen of nothing,
   because everything else on the page is a measurement and every measurement
   moved right.

   This is the nine, written rather than tabled. The right rail already has
   them as a table of held against opposite, which is the correct place for a
   table, and a table is not text about anybody. What a person cannot get from
   that table is where it is, which the engine has known all along: every one
   of the nine carries its plexus and the part of the body it sits in, and
   neither has ever been on this surface.

   Three sentences at most, because a paragraph naming nine things is a list
   with full stops in it.
   ============================================================ */
function sumAxes(r){
 var C=(typeof CHILD!=='undefined')?CHILD:[];
 if(!C.length)return '';
 /* THE AXIS VALUE, NOT THE MEAN OF ITS NODES. The first cut meaned n.sq over
    every node on the axis, and most nodes on an axis are at zero, so a person
    whose nine axes all read half a point came out at a mean of nought and was
    told nothing was carrying while the rail beside it listed Fear at 0.5. Two
    panels on one screen disagreeing about whether anything is there is worse
    than either of them being wrong alone. S.charge is what the person
    entered and what every other surface prints. */
 var held=C.map(function(c){
   return {c:c, sq:+(S.charge[c.nm]||0), rep:+(S.replace[c.nm]||0)};})
  .sort(function(a,b){return b.sq-a.sq;});
 var live=held.filter(function(x){return x.sq>0;});
 var standing=held.filter(function(x){return x.rep>0;})
  .sort(function(a,b){return b.rep-a.rep;});
 var p=[];
 if(!live.length){
  p.push('Nothing is carrying on any of the nine. That is the reading, not a '
   +'gap in it.');
 }else{
  var top=live[0];
  /* NO "the" IN FRONT OF THE ADDRESS. Half the nine carry a plexus, which
     takes an article, and half carry a phrase like "Below the heart", which
     does not. "It sits at the Below the heart" is what a template does when
     it assumes one shape of noun. */
  p.push('The heaviest of the nine is <b>'+esc(top.c.nm)+'</b>, at <b>'
   +top.sq.toFixed(1)+' of 10</b>. It sits at '+esc(top.c.addr)
   +', which you feel in the '+esc(top.c.loc)+'. The quality on the far side '
   +'of it is <b>'+esc(top.c.opp)+'</b>.');
  if(live.length>1){
   var rest=live.slice(1,4);
   p.push('Under it, '+rest.map(function(x){
     return '<b>'+esc(x.c.nm)+'</b> in the '+esc(x.c.loc)
      +' at '+x.sq.toFixed(1);}).join(', ')
    /* AND THE COUNT IS COUNTED. This said "five more" whatever the number
       was, which is the same defect as a gate that counts by hand. */
    /* and the number is spelled, because it opens a sentence and a sentence
       that opens with a digit reads as a list item */
    +'. '+(live.length>4?SUM_WORD(live.length-4)+' more '
      +(live.length-4===1?'is':'are')+' carrying something.':'')
    +' Each one is a place in the body before it is a word.');}
 }
 if(standing.length){
  p.push('Standing against them: <b>'+esc(standing[0].c.opp)+'</b> at <b>'
   +standing[0].rep.toFixed(1)+' of 10</b>'
   +(standing.length>1?', and '+(standing.length-1)+' other'
     +(standing.length>2?'s':'')+' installed':'')
   +'. An address with the opposite in does not read zero. It conducts.');}
 return '<div class="s-axes"><div class="pm-eye">In The Body</div>'
  +p.map(function(t){return '<p class="s-p">'+t+'</p>';}).join('')+'</div>';}

/* ============================================================
   THE FIVE LENSES, ON THE PAGE AT LAST.

   He has asked for Eastern and Western on this rail twice. Both were built:
   lensWestern, lensEastern, lensDesign and lensGene sit at the top of this
   file, pure functions of soul, axes and laws, four of them, and NOTHING IN
   THE BUILD HAS EVER CALLED ONE. That is the third time this session the
   thing he asked for was already written and simply not rendered, after the
   archetype behaviours and the mask behaviours.

   One lens is deliberately gone and stays gone: lensName reduced a whole name
   to one digit and called that the name lens, which is the Expression and one
   of six. numerology.js does that properly and the spiritual block reads it.

   Each lens says what it read, what it means, and what it was read off, which
   is the third thing a label owes the person it is put on. Nothing here is
   stored, so none of it can drift from the instrument.
   ============================================================ */
function sumLens(r){
 var L=[lensWestern(r),lensEastern(r),lensDesign(r),lensGene(r)]
  .filter(function(x){return x&&x.a;});
 if(!L.length)return '';
 return '<div class="pm-eye" style="margin-top:18px">Four Lenses</div>'
  +'<div class="s-lens">'+L.map(function(x){
   return '<div class="s-ln">'
    +'<span class="s-ln-t">'+esc(x.t)+'</span>'
    +'<b class="s-ln-a">'+esc(x.a)+'</b>'
    +'<span class="s-ln-b">'+esc(x.b)+'</span>'
    +'<em class="s-ln-c">read off '+esc(x.c)+'</em>'
   +'</div>';}).join('')+'</div>';}

/* ---- integrity over time ---- */
function sumIg(r){
 var sr=(typeof seriesRead==='function')?seriesRead(CURP,SUM_SPAN,Date.now()):null;
 var head='<div class="s-ig"><div class="s-ig-h">'
  +'<span class="pm-eye">Integrity Over Time</span>'
  +'<div class="s-ig-sp">'+SPANS.map(function(sp){
    return '<button type="button" class="cn-sb'+(sp.k===SUM_SPAN?' on':'')+'" '
     +'data-igspan="'+sp.k+'" aria-pressed="'+(sp.k===SUM_SPAN)+'">'
     +esc(sp.nm)+'</button>';}).join('')+'</div></div>';
 /* THE POINTS THAT HAVE AN INTEGRITY ON THEM, which is not all of them: the
    field carries ig as null on any snapshot written before it was recorded,
    and a null drawn as a zero is a claim that integrity was nothing. */
 var pts=sr?sr.pts.filter(function(x){return typeof x.ig==='number';}):[];
 /* ONE EXIT, ONE CLOSING TAG. Two returns each closing the same wrapper reads
    correctly at run time and counts as one div too many to the build's
    balance check, which walks the string literals and cannot know that only
    one of the two ever runs. The check is right to be dumb about it: a
    renderer with two exits is a renderer with two places to forget a tag. */
 var body;
 if(pts.length<2){
  body='<p class="cn-gp">'
   +(pts.length?'One reading with an integrity on it in this span, at <b>'
     +pts[0].ig.toFixed(1)+' of 10</b>. Two makes a line.'
    :'Nothing on the record for this span. Every save writes a point, so this '
     +'fills in as you go.')
   +'</p>';}
 else {
  var lo=0, hi=10;                       /* integrity's real scale, both ends */
  var t0=sr.t0, tspan=(sr.t1-sr.t0)||1;
  var xy=pts.map(function(x){
   return {x:((x.ms-t0)/tspan*100), y:(100-((x.ig-lo)/(hi-lo)*100))};});
  var d=xy.map(function(q,i){return (i?'L':'M')+q.x.toFixed(2)+','+q.y.toFixed(2);}).join(' ');
  var area=d+' L'+xy[xy.length-1].x.toFixed(2)+',100 L'+xy[0].x.toFixed(2)+',100 Z';
  var first=pts[0].ig, last=pts[pts.length-1].ig;
  var dir=last>first?'up':(last<first?'down':'level');
  var col=dir==='down'?'var(--bad)':(dir==='up'?'var(--good)':'var(--accent)');
  body=''
  +'<svg class="s-ig-g" viewBox="0 0 100 100" preserveAspectRatio="none" '
  +'aria-label="Integrity over the last '+esc(sr.span.nm.toLowerCase())
  +', on a scale of nought to ten">'
  /* the axis is nought to ten and never the range that happens to be there.
     integrity has two real ends, so a chart drawn to fit the data would make
     a quiet month look like a cliff and a good one look flat. */
  +'<line x1="0" y1="50" x2="100" y2="50" stroke="var(--edge)" stroke-width="1" '
  +'vector-effect="non-scaling-stroke"/>'
  +'<path d="'+area+'" fill="'+col+'" opacity=".12"/>'
  +'<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="1.6" '
  +'vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>'
  +'</svg>'
  +'<div class="s-ig-f"><span>'+first.toFixed(1)+' of 10</span>'
  +'<b>'+dir+'</b><span>'+last.toFixed(1)+' of 10</span></div>';}
 return head+body+'</div>';}

/* ---- one delegated listener for everything on this surface ---- */
function sumWire(){
 var h=document.getElementById('sumbody'); if(!h||h.dataset.wired)return;
 h.dataset.wired='1';
 h.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-sout],[data-sp],[data-num],[data-arch],[data-dom],[data-seat],[data-mask],[data-gl],[data-igspan]'):null;
  if(!b)return;
  /* the integrity chart's own span. It repaints the surface rather than the
     chart alone, so the pressed button and the drawn line cannot disagree. */
  var ig=b.getAttribute('data-igspan');
  if(ig){SUM_SPAN=ig; sumRender(); return;}
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
   /* the intake, for the person whose release ground is already spent. it is
      the only lever left that moves integrity, so it needs a door from here. */
   if(w==='iq'){setTab(TAB.INTAKE);return;}
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
