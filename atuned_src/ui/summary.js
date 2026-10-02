/* ============================================================
   SUMMARY. Five lenses. None of them store anything; each is a pure
   function of soul, axes and laws, so they cannot drift from what the
   instrument already knows.
   ============================================================ */
/* what each of the four roots is, said once. The Western lens reads it and so
   does the person header, so the two cannot say it two ways. */
const ROOT_ELSAYS={Architect:'Earth, fixed. Builds and holds.',Engine:'Fire, cardinal. Initiates and burns.',
 Weaver:'Water, mutable. Joins and dissolves.',Witness:'Air. Observes and names.'};
function lensWestern(r){
 var d=DOMAINS[S.doms[0]]||{nm:'',r:''};
 return {t:'Western',a:d.r,b:ROOT_ELSAYS[d.r]||'',c:'root domain as element'};}
function lensEastern(r){
 var b=r.darkB||'Root';
 var E={Root:'Muladhara, earth, Lam',Sacral:'Svadhisthana, water, Vam',Solar:'Manipura, fire, Ram',
  Heart:'Anahata, air, Yam',Throat:'Vishuddha, ether, Ham','3rd Eye':'Ajna, light, OM',
  Crown:'Sahasrara, thought, silence'};
 return {t:'Eastern',a:b,b:E[b]||'',c:'the seat carrying the most'};}
function lensDesign(r){
 var a=ARCH[r.pi]||{nm:''};
 return {t:'Design',a:a.nm,b:'defined at the '+(r.darkB||'Root').toLowerCase()+', '
  /* benign is null while CQ is still filling, and the clause waits with it */
  +(r.benign===null?'':(r.benign?'initiates':'responds')+', ')+'authority at the '
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
function sumGlance(r,noCQ){
 var acc=(typeof accuracy==='function')?accuracy(r):null;
 var e=(r.X+r.Y+r.Z)/3;
 var row=[
  /* the glance row's coherence ring reads the tier too, for the same reason */
  /* A PERCENT IS ALREADY OUT OF A HUNDRED. The third line read "of 100" under
     every figure that already ends in a percent sign, which is the same
     number's scale said twice on one tile, the "of the same 90 days" he struck
     (V17), and the third tier small print he named in GX: "I don't need this
     like third tier tiny information that no one's ever going to read." The
     line stays only where the figure has no unit of its own, which is where
     the scale is information. */
  ['coherence', r.darkB, r.CQ, Math.round(r.CQ)+'%', 'How closely you keep the 21 laws, all added up.',
   '', TIERCOL[r.tier]],
  /* THE LABEL SAID 0 TO 10 AND THE NUMBER GOES PAST 54. Measured across the
     roster: Gordon 54.7, Tomas 45.9, Ana 22.8. It is a sum over every address
     carrying, so it has no ceiling of ten or of anything else, and a stated
     range the data walks straight through is a lie on the surface.

     The ring was a second half of the same lie: r.DQ*10 clamped at 100, so
     every profile past ten drew an identical full ring.

     BOTH ARE FIXED BY THE RULING OF 25 SEPTEMBER rather than here. DQ is the
     total shadow on all 112 over the most they can hold, so it has a ceiling
     of 100 and the ring is the figure, on the same scale as coherence. */
  ['shadow weight', 'Root', r.DQ, Math.round(r.DQ)+'%',
   'All the charge on all 112 addresses, against the most they could hold.',
   ''],
  /* THIS PRINTED THE OPPOSITE OF WHAT IT MEASURES. It was labelled "installed"
     and glossed "what has been filled in". SQm is built in compute.js from
     sum+=n.sq over the loaded addresses, and n.sq is HELD charge: an address
     joins `loaded` precisely because it is carrying. Installed is the other
     pole, n.rep, and it is not in this figure at all. So the second screen of
     the product printed a person's carried load and told them it was the part
     of them that had been filled in, which is not a wording problem, it is a
     reading that says the reverse of the truth. */
  ['carried depth', 'Root', r.SQm*10, r.SQm.toFixed(1),
   'How deep the charge runs, on average, across the addresses carrying it.', ''],
  /* and this said 0 to 1 while reading 8.49. It is a mean of values clamped
     to 0 and 10, so ten is the ceiling and always was. */
  ['pole', 'Heart', r.poleMean*10, r.poleMean.toFixed(2),
   'How much of each opposite is installed, on average, across the body.', ''],
  ['energy', 'Solar', e*100, e.toFixed(2),
   'The average of vitality, awareness and will.', '']];
 /* THE TOLERANCE CAME OFF THIS ROW TOO. It read "of 100, plus or minus 11"
    on the third line of a glance tile, which is the smallest place in the
    product and the last place a lab readout belongs. Ruled with the rest of
    the class. The scale stays: every number says what it is out of, and that
    rule is the reason the third line exists at all. */
 if(acc)row.push(['identification','3rd Eye',acc.pct,acc.pct.toFixed(0)+'%',
  'How much of you the instrument has actually measured.','']);
 /* SUPERSEDED ON 2 OCTOBER, CO-31: the third line no longer carries "of 10" or
    "of 1". A count against a total is a score at any scale, and he read it as
    one. What follows is the ruling it replaced.

    THE SCALE IS ON THE SCREEN, NOT IN A TOOLTIP. Two rulings meet here and
    both were being broken by the same line.

    "You read 13, what does that mean." Every number says what it is out of.
    This row printed 8.49 beside the word pole and 0.83 beside the word
    energy, on two different scales, with nothing to measure either against.

    And a title attribute is not an answer, because a phone has no hover. Eight
    definitions in this product live only in a title and a person on a phone
    can reach none of them. The scale is now a third line in the button, where
    everybody can see it, and the title keeps the longer sentence. */
 return '<div class="s-glance">'+row.filter(function(x){return !(noCQ&&x[0]==='coherence');}).map(function(x){
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
 return '<div class="s-told"><div class="pm-eye">What you told it</div>'
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
function rootB(nm){return sumB(nm,rootPlain(nm)||null);}
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
  p.push('The blueprint you were born on reads '+sumB(e.sunEl,rootPlain(elRoot)||null)
   +', which is the '+rootB(elRoot)+' root, on life path <b>'+e.lp+'</b>, the one who '
   +esc(e.lpMean||'runs')+'.'
   +(num?' The name carries an expression of <b>'+num.expression+'</b>, '
     +esc(numSays('expression',num.expression))+'.':'')
   +' What is actually running is '+rootB(rootNow)+', through '+archB(arch)+'. '
   +(elRoot===rootNow
     /* A CAUSE IS NOT A READING. The blueprint says one thing and the field
        runs another, and the instrument can say they differ. It cannot say
        why, and "something was installed on top" was a story about a person
        the ledger cannot show. Round J13. */
     ? 'Those agree.'
     : 'The blueprint says '+esc(elRoot)+'. The field runs '+esc(rootNow)+'. These differ.'));
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
   +(loud?' The biggest thing compounding on it is <b>'+esc(loud.nm)+'</b>.':'')
   +(stop?' Flow stops at the '+seatB(String(stop.p.n).toLowerCase(),stop.p.b)
     +', which is where the charge is dense enough to close the seat.'
    :' No seat is closed, so what is held is not yet stopping flow.')
   +' Shadow weight is '+Math.round(r.DQ)+'. The law furthest shut is '
   +seatB(r.weakL.nm,r.weakL.b)+', at the '+seatB(String(r.weakL.b).toLowerCase(),r.weakL.b)+'.');
 }else{
  p.push('Nothing is held above the line, so nothing is reaching the body as load. '
   +(r.under?'There are '+r.under+' addresses carrying under it, which is signal and not yet cost.':''));}

 /* THREE. momentum, and what stands between here and the avatar.
    A PAIR IS {be,notbe}, NOT {seat,becoming}. This read pair.seat and
    pair.becoming, which round HG's own pairs never carried, so st was
    always undefined, blocked was always empty and every avatar read as
    passing. avRows() is the one place a pair resolves to a seat and a
    gap, shared with the Avatar tab itself, so this asks it rather than
    keeping a second, wrong resolver. Found by the uiux-architect dispatch,
    round HS, measured against three held pairs before this fix shipped. */
 var rows=(typeof avRows==='function')?avRows():[];
 var blocked=rows.filter(function(x){return x.gap&&!x.gap.clear;});
 var gapLine='';
 if(rows.length){
  gapLine=blocked.length
   /* A CAUSE IS NOT A READING. "Blocked by the same charge named above" said
      why the avatar is short, and the ledger cannot show the chain. What the
      instrument can say is that the part is not passing and which charge sits
      under it. Round J13. */
   ? ' Against the avatar you stated, '+blocked.map(function(x){
       return '<b>'+esc(x.pair.be)+'</b>';}).join(' and ')
     +(blocked.length>1?' are not passing. The charge named above sits under them.'
                       :' is not passing. The charge named above sits under it.')
   : ' Every seat your avatar depends on is passing.';
 }else{
  gapLine=' No avatar has been stated, so there is nothing to measure this against. '
   +'Say who you are becoming and this paragraph names what stands in the way.';}
 /* "100 percent" OF WHAT. The sentence read "the field leans benign at 100
    percent", which is a share with no denominator on a surface where a
    percentage could mean the share of the field, the share of the stack or a
    confidence. It is the split between the two leans, so the sentence says
    that: benign against malignant, and the two add to a hundred. */
 /* AND THE LABEL COMES OFF THE FRONT OF IT. "Momentum:" is a Label and the
    rest of the string is a Reading, so one string was doing two jobs, and
    neither of the other two paragraphs on this surface carries a label. The
    sentence also opened on its denominator, "of the two leans the field is",
    which defers its subject by five words. Both ends are still named and they
    still add to a hundred, which is what that clause was there for. */
 /* no lean sentence at all while CQ is still filling and no story cue has
    come in: leanRead reports read false, and 100 per cent benign off a field
    with no laws answered is a reading nobody took */
 /* NO PERCENT. "Leans 100 per cent benign against 0 per cent malignant" was
    a score, and on a field with one cue in it a share of a hundred reads as a
    finding. The direction is the reading and the sentence says it once. The
    clause "which means it is expanding" stated a cause and is now a
    direction. Round J13, his words: "I keep seeing this percent shit, the
    hardest carrying zero percent. I don't want that." */
 p.push(((lean.read===false?'':'The field leans <b>'
  +(lean.ben>=lean.mal?'benign':'malignant')+'</b>'
  +(r.benign===null?'':', toward '+(r.benign?'expanding':'contracting'))+'.')
  /* .length, because r.excess is a list and an empty list is truthy: this
     told every one of the fourteen reference cases the pole was past paying,
     including the ones with nothing past it. ui.js reads it the same way. */
  +(r.excess.length?' Installed pole is past the point where it pays, so some of the work is now costing.':'')
  +gapLine).trim());

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
/* THE STRUCTURES, IN PIECES. sumStruct was one block of five headings in one
   column, and the page now places them by what they mean, so each piece is its
   own function. The markup of every row is the markup it always had, so the
   drills, the gates and the delegated listener read them exactly as before. */
function sumBlueprint(){
 /* the blueprint. a selection, drawn as a selection: icons and names, and no
    ring on any of them, because a ring is a measurement and this is a choice. */
 var rootNow=(DOMAINS[S.doms[0]]||{}).r||'';
 return '<div class="pm-eye">Blueprint</div><div class="s-sel">'
  +'<span class="s-sel-r" style="--rc:'+(rootPlain(rootNow)||'var(--accent)')+'">'
  +esc(rootNow)+'</span>'
  +S.doms.map(function(di){var d=DOMAINS[di]; if(!d)return '';
   return '<button type="button" class="s-dom" data-dom="'+di+'" style="--rc:'+rootPlain(d.r)+'" '
    +'title="'+esc(d.nm+'. '+d.d)+'">'+svgI('<path d="'+d.ic+'"/>')
    +'<span>'+esc(d.nm)+'</span></button>';}).join('')+'</div>';}
function sumArch(r){
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
 return '<div class="pm-eye">Primary and secondary</div>'
  +aff.slice(0,4).map(function(x){
  return sumStructRow(x.nm, x.d, x.b,
   x.v/tot*100, Math.round(x.v/tot*100)+'%', x.ic?'<path d="'+x.ic+'"/>':null,
   ' data-arch="'+x.i+'"', false);}).join('');}
function sumMasks(r,from,to){
 /* masks. weight on 0 to 10, so the arc is the weight and the pill is the value. */
 if(!(r.maskRing&&r.maskRing.length))return '';
 /* THE MASKS ARE THE TIER'S, ruled 1 October. The list is replaced by the
    lock's own line and not left empty or shortened, so the section never
    reads as if a person had no masks. Said once, on the first slice. */
 if(!lockSees('mask'))return from?'':lockPanelHtml('mask',{brief:true});
 return r.maskRing.slice(from,to).map(function(m){
   /* the mask's behaviour, not its two seats. the seats are the ring colour
      and the drill, and a person cannot do anything with "Root and Sacral". */
   var md=(MASKS.filter(function(x){return x.nm===m.nm;})[0]||{}).v
     ||(m.bands||[]).join(' and ');
   return sumStructRow(m.nm, md, (m.bands||['Heart'])[0],
    m.w*10, m.w.toFixed(1), null, ' data-mask="'+esc(m.nm)+'"');}).join('');}
function sumSeats(){
 /* the seats. load is measured and the ring is the load. */
 var seats=flSeats().filter(function(x){return x.load>0;})
  .sort(function(a,b){return b.load-a.load;}).slice(0,4);
 if(!seats.length)return '';
 /* "Where it sits" labelled a list of body places with a pronoun that has
    nothing to point back to. His words, GX: "'where it sits, crown, third
    eye, throat,' and then the patterns underneath, I don't understand the
    screen." A label names the slot, and this slot is the four seats carrying
    the most, sorted by load. "In the body" is already the axes' eyebrow on
    this page, and ui/mapshelf.js already calls the top one "Heaviest seat". */
 return '<div class="pm-eye">Heaviest seats</div>'+seats.map(function(x){
   /* and a seat says what a closed one does rather than the word closed */
   return sumStructRow(x.p.n,
    x.held?'shut, so charge sits under it':'open, so charge passes through',
    x.p.n,
    Math.min(100,x.load*100), Math.round(x.load*100)+'%', null,
    ' data-seat="'+esc(x.p.n)+'"');}).join('');}
function sumChain(r){
 /* the chain. counts, never against a total. */
 /* ONLY THE RUNGS THE PLAN CAN SEE ARE COUNTED, and the first one it cannot is
    said to be locked: a "0" under saboteurs on a person who has some would be
    a false count, and a row of four zeros says the chain is empty. */
 return '<div class="pm-eye">The chain</div><div class="s-chain">'
  +[['saboteurs',r.sabs.length,'sab'],['complexes',r.cxs.length,'cx'],
    ['hyper',r.hys.length,'hy'],['character',r.sups.length,'sup']].filter(function(x){
   return lockSees(x[2]);}).map(function(x){
   return '<span class="s-ch"><b>'+x[1]+'</b>'+x[0]+'</span>';}).join('')+'</div>'
  +(r.locked&&r.locked.length?lockPanelHtml(r.locked[0],{brief:true}):'');}

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
/* THE BIRTH MARKS, AS ONE STRIP, and the comparison under them as its own
   piece. The strip is evidence for the person's root energetics and sits with
   them; the comparison is working, and folds. sumSpirit is both together, kept
   for the page that has no reading yet. */
function sumChips(C){
 var e=C.e;
 function chip(k,v,glyph,lab,val,t){
  return '<button type="button" class="s-chip" data-sp="'+k+'" data-spv="'+esc(String(v))+'" '
   +'title="'+esc(t)+'"><span class="s-chip-g">'+glyph+'</span>'
   +'<span class="s-chip-l">'+esc(lab)+'</span>'
   +(val?'<span class="s-chip-v">'+esc(val)+'</span>':'')+'</button>';}
 function uni(ch){return '<span class="s-uni">'+ch+'</span>';}
 var out='<div class="s-chips">';
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
 return out+'</div>';}
function sumConverge(C){
 var out='<p class="s-p">Five systems, read independently off one birth date. '
  /* This was a fraction with a sentence after it explaining that it was not a
     score, which is an admission that it read as one. Two facts in sequence
     need no defending and say the same thing. */
  +'<b>'+C.of+'</b> comparison'+(C.of===1?'':'s')+' could be made between them and the '
  +'field. <b>'+C.agree.length+'</b> point the same way. That is what the convergence is.'
  +(C.open&&C.open.length?' '+C.open.length+' could not be compared at all: '
    +esc(C.open.join('; '))+'. Those count for neither side.':'')+'</p>';
 if(C.agree.length||C.differ.length){
  out+='<div class="s-agree">';
  out+=C.agree.map(function(a){return '<div class="s-ag">'+esc(a)+'</div>';}).join('');
  out+=C.differ.map(function(d){return '<div class="s-dg">'+esc(d)+'</div>';}).join('');
  out+='</div>';
  /* HS sweep. A three sentence footnote under the list explained how to read
     a disagreement in it. The Reading paragraph at the top of this page
     already says what a split between blueprint and field means, in this
     person's own names, which is the useful half of the same sentence. */}
 return out;}
function sumSpirit(r){
 var nm2=(PEOPLE[S.who]||{}).nm||'You';
 var C=converge(nm2,r);
 if(!C)return '<div class="s-spirit"><div class="pm-eye">The spiritual layer</div>'
  /* HS sweep: the refusal keeps what is missing and what would put it in.
     The tail on what is stored and why explained the section. */
  +'<p class="s-p">No birth data on file. Date, time and place would let this run.</p></div>';
 return '<div class="s-spirit"><div class="pm-eye">The spiritual layer</div>'
  +(function(){var cv=sumConverge(C), i=cv.indexOf('class="s-agree"');
   if(i>=0)i=cv.lastIndexOf('<',i);
   return i<0?cv+sumChips(C):cv.slice(0,i)+sumChips(C)+cv.slice(i);}())+'</div>';}

/* ---- full numerology. six numbers, and every name part on its own. ---- */
function sumNum(r,bare){
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
 var out='<div class="s-numer">'+(bare?'':'<div class="pm-eye plain">Numerology, in full</div>')
  /* HS sweep: the name it was read off stays, because a person checks the
     spelling. The method sentence after it explained the arithmetic. */
  +'<p class="s-p">Read off <b>'+esc(N.parts.map(function(p){
    return p.charAt(0)+p.slice(1).toLowerCase();}).join(' '))+'</b>.</p>'
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
 /* the reading this plan may see: the chain below and the story's biggest
    compounding pattern are only what a plan can see (ui/lock.js) */
 var r=computeSeen();
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
 var B=sumBirth(), rc=sumDrivers(B,r);
 var hero='<div class="sum-hero">'
  +cr(r.darkB,0,{size:'lg',label:'coherence',raw:'–',hot:false,color:'var(--dim)'})
  /* ONE SLOT, ONE LABEL, the same correction as the analytics hero. The
     label said "Coherence, not read yet" and the line directly under it says
     the same thing in a full sentence, so the label was both changing with the
     data and repeating the line. */
  +'<div><div class="pm-eye">Coherence</div>'
  /* ONE WORDING FOR THE EMPTY STATE, and nothing after it. This said "Nothing
     has been entered" where the canonical sentence is "Nothing has been read
     yet" (objections.json, canonical), then spent a sentence on why the
     arithmetic is hidden, which is the product explaining itself to a person
     who did not ask, and then reassured them they would not need a term. The
     doors underneath are the route. */
  +'<div class="sum-line">Nothing has been read yet.</div></div></div>'
  +'<div class="sum-start">'+startHTML('Four ways in.')+'</div>';
 /* A NAME OR A BIRTH WAS ENTERED. Then what it says stands on the right, the
    first drivers, and the four doors stand on the left, so the way in is on the
    first screen beside it and the page is two equal halves, not one half and a
    hole. Nothing here is read off the field, so nothing here is a reading. */
 if(rc)return sumWho(r,B,false)
  +'<div class="sg-two sg-lead"><section class="sg-card sg-start" data-grp="start">'+hero+'</section>'+rc+'</div>'
  +sumMarks(B,r)
  +(B.N?'<div class="sg-folds sg-one">'+sgFold('num','Numerology, in full',sumNum(r,true))+'</div>':'');
 return sumWho(r,B,false)+hero+sumSpirit(r)+sumNum(r);}

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
/* ============================================================
   WHO THIS IS. Ruled, his words today: "for a summary, we want to add their
   name, root meaning, energetics as well, as if it's the person, written in
   grounded language, whatever our documentation says."

   Read as: the name, then what their root energetics mean, said as the person
   and not as a table. EVERY SENTENCE HERE COMES OUT OF A TABLE THE PRODUCT
   ALREADY HOLDS and names it in data-src, so nothing on this block is
   written for the occasion:

     the born root and the running root   ROOT_ELSAYS, DOMAINS d
     a meeting of the four systems        ROOT_SAYS, off rootOverlap
     any other way it shows up            SIGN_RUNS, CH_RUNS, CE_RUNS,
                                          LP_RUNS, HD_LINE_RUNS
     the name's number                    NUM_CORE ex, so and pe

   A name's etymology is not here and is not coming from here: DECISIONS.md
   rules it out, because a meaning for an arbitrary name cannot be looked up on
   a device that makes no request, and inventing one is a claim this
   instrument does not make. What a name carries is its number.

   Nothing prints off a default. The block reads only what the person entered,
   a name and a birth, so it is the same on a profile that has been read and on
   one that has not, and it is empty on one that has neither.
   ============================================================ */
/* one profile's birth reading and name numbers, read once per render and
   handed to every piece that needs them */
function sumBirth(){
 var p=PEOPLE[S.who]||PEOPLE[0], sp=spiritual(p.nm);
 if(!sp&&CURP&&CURP.who&&CURP.who.born&&CURP.who.born.date){var bn=CURP.who.born;
  sp=spiritualOf({d:bn.date, t:(bn.timeUnknown?'':(bn.time||'')), p:bn.place||'', z:bn.zone||''});}
 /* the name's numbers only off a name that is somebody's, for the reason
    spNumRows gives: a blank profile's roster name is the word You */
 var full=numFullName(CURP)||(typeof FULLNAME!=='undefined'&&FULLNAME[p.nm])||'';
 var N=full?numerologyOf(p.nm,CURP):null;
 return {p:p,sp:sp,N:N,full:full,R:rootOverlap(sp,N)};}
const SUM_IC={
 who:'<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-4 3.5-6 7-6s6.2 2 7 6"/>',
 run:'<path d="M19.5 12a7.5 7.5 0 11-2.2-5.3"/><path d="M19.5 4.5v4h-4"/>',
 cost:'<path d="M8.4 10a3.6 3.6 0 117.2 0"/><path d="M6 10h12l2 10H4z"/>',
 todo:'<circle cx="12" cy="12" r="8.4"/><path d="M8.4 12h7M12.6 8.4L16.2 12l-3.6 3.6"/>',
 src:'<circle cx="12" cy="12" r="8.4"/><path d="M12 8v4.4l2.8 1.8"/>',
 drive:'<path d="M4 6h6v6h6v6h4"/>',
 down:'<circle cx="12" cy="12" r="8.4"/><path d="M12 8v8M8.6 12.8L12 16.2l3.4-3.4"/>',
 chev:'<path d="M6 9.5l6 6 6-6"/>'};
function sumIc(k,cls){return '<svg class="'+(cls||'sg-ic')+'" viewBox="0 0 24 24" aria-hidden="true">'+SUM_IC[k]+'</svg>';}
function sgSvg(inner){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+inner+'</svg>';}
function sgCap(t){t=String(t||'');return t.charAt(0).toUpperCase()+t.slice(1);}
/* a mark in a ring, never a fill */
function sgRing(inner,col,tipT,tip){
 return '<span class="sg-c-g" style="--rc:'+(col||'var(--accent)')+'"'
  +(tip?' data-tip-t="'+esc(tipT)+'" data-tip="'+esc(tip)+'"':'')+'>'+inner+'</span>';}
/* ============================================================
   THE FIRST DRIVERS, ON THE RIGHT. Round OJ, his words: "for the summary, on
   the right side, because this is information that won't change, we want the
   root energetic meanings of their name... After you get your first root
   energetics, after you are severed from your mother's umbilical cord, the
   very next thing is your name... this is really kind of like a cascade of
   drivers."

   So the right hand card is the part of the person that does not move, in the
   order it arrived: one, where they were born, the root energetics the four
   systems give; two, what they were named, a meaning for each part of the
   name; then everything else on the page, which is what those drivers are
   running. A numbered ring on a line is the cascade, and nothing explains it.

   THE ROOT OF A NAME HAS NO TABLE IN THIS PRODUCT, and this file does not
   write one. NAME_MEANINGS below is the slot for it, read by name part, and it
   holds the owner's three worked examples marked as his and nothing else. A
   part with no entry says so and never shows a guess. DECISIONS.md, "No
   etymology table", is the standing ruling this sits against, and DM and DZ in
   TASKS.md found the references give other roots for the same three names,
   which is held in each entry's note and not printed.
   ============================================================ */
const NAME_MEANINGS={
 /* RESEARCHED AGAIN, round OK, on his word: "Lance means to pierce, right?
    It's a weapon that a knight uses. So you need to go do your research
    again." The meaning of a name for this page is its root as a word, which is
    what a person grows into, and not only the line of descent. Lance is the
    lance, the knight's spear, from Latin lancea (a second line of descent runs
    to Germanic land, which is the lesser one). O'Neill is the descendant of
    Niall, which most authorities give as champion (also cloud, passionate).
    Powell is ap Hywel, the son of Hywel, and Hywel is eminent, which is
    exalted. Sources are Wikipedia's entries on Lance (given name), O'Neill
    (surname) and Powell (surname), and Behind the Name. This is still a
    stub of three, and the table that replaces it is vetted before it ships. */
 lance:{part:'Lance',says:'to pierce',
  src:'Lance: Old French lance, Latin lancea, the knight\'s spear (Wikipedia, Lance given name; Ancestry; Behind the Name)',
  note:'A second line runs to Germanic land. The weapon is the root as a word.'},
 oneill:{part:"O'Neill",says:'champion',
  src:'O\'Neill: Ó Néill, descendant of Niall, champion (Wikipedia, O\'Neill surname; Library Ireland)',
  note:'Niall is also given as cloud or passionate. Most authorities give champion.'},
 powell:{part:'Powell',says:'exalted',
  src:'Powell: ap Hywel, son of Hywel, eminent (Wikipedia, Powell surname; Behind the Name)',
  note:'Hywel is eminent, remarkable. Exalted is the same sense.'}};
function nameKey(s){return String(s||'').toLowerCase().replace(/[^a-z]/g,'');}
/* the parts of a name as the person entered them, first, middle and last. A
   reference case has only a full name, so it is split the way numerology
   splits it. An apostrophe stays inside its part. */
function sumNameParts(B){
 var w=CURP&&CURP.who||{}, f=String(w.first||'').trim(), m=String(w.middle||'').trim(), l=String(w.last||'').trim();
 if(!(f||m||l)&&B.full){var ws=String(B.full).trim().split(/\s+/);
  f=ws[0]||''; l=ws.length>1?ws[ws.length-1]:''; m=ws.slice(1,-1).join(' ');}
 var out=[]; if(f)out.push({role:'First',text:f}); if(m)out.push({role:'Middle',text:m}); if(l)out.push({role:'Last',text:l});
 return out;}
function nameMeaning(text){
 var hit=NAME_MEANINGS[nameKey(text)]; if(hit)return hit;
 var ws=String(text).split(/\s+/);
 for(var i=0;i<ws.length;i++){if(NAME_MEANINGS[nameKey(ws[i])])return NAME_MEANINGS[nameKey(ws[i])];}
 return null;}
/* one row of what a table says about a person, a mark in a ring, a label, a
   title and the one line the table gives it */
function sgMeet(src,glyph,k,t,say,tip,col){
 return '<div class="sg-m" data-src="'+esc(src)+'">'+sgRing(glyph,col,t,tip)
  +'<div class="sg-m-t"><span class="sg-c-k">'+esc(k)+'</span><b>'+esc(t)+'</b>'
  +'<p>'+esc(say)+'</p></div></div>';}
function sgStage(n,title,body){
 return '<div class="sg-st" data-stage="'+n+'"><div class="sg-st-h"><span class="sg-st-n">'+n+'</span>'
  +'<b>'+esc(title)+'</b></div><div class="sg-st-b">'+body+'</div></div>';}
/* the systems that met, in words, and how strongly only when it is more than
   light, because most meetings are light and say so once under the stage */
function sgMeetRow(a){
 return sgMeet('ROOT_SAYS',sgSvg(rsThemeIc(a)),
  a.sys.map(function(x){return SYSNAME[x];}).join(', ')
   +(a.strength==='light'?'':'. '+RS_STRENGTH[a.strength].replace(/\.$/,'')),
  a.t,ROOT_SAYS[a.t]||'',RS_BRIDGE[a.voc]);}
/* STAGE ONE. Where they were born: the root the sun sign gives, then where the
   four systems meet, led by the meeting least likely by chance, which is how
   rootOverlap orders them. FV: "where they overlap, because that's the truth." */
function sumBorn(B){
 var sp=B.sp, R=B.R, rows='', more=[];
 if(!sp)return sgStage(1,'Born',
  '<p class="sg-note">No birth data on file. Date, time and place would put it in.</p>'
  +'<button type="button" class="btn s-oact" data-sout="iq">Open Energetics</button>');
 rows+=sgMeet('ROOT_ELSAYS',sgSvg(glyphPath(ROOTGLYPH[sp.root])),
  'Root',sp.root,ROOT_ELSAYS[sp.root]||'','',rootPlain(sp.root));
 var sh=R.shown||[], anyLight=sh.some(function(a){return a.strength==='light';});
 if(sh.length)rows+=(anyLight?'<p class="sg-note">A light overlap is one many people share. A strong one is rare.</p>':'');
 sh.slice(0,2).forEach(function(a){rows+=sgMeetRow(a);});
 if(!sh.length)rows+='<p class="sg-note">These four do not land on the same thing.</p>';
 more=sh.slice(2).map(sgMeetRow).concat((R.range||[]).map(function(x){var say=rsSays(x); if(!say)return '';
  return sgMeet('range',sgSvg(SYSGLYPH[x.sys]),SYSNAME[x.sys],rsName(x),sgCap(say)+'.','');}));
 return {stage:sgStage(1,'Born',rows),more:more.join('')};}
/* STAGE TWO. What they were named: a root meaning for each part of the name,
   from NAME_MEANINGS and from nowhere else, then the number the whole name
   adds to. A part with no entry is said to have none. */
function sumNamed(B){
 var parts=sumNameParts(B); if(!parts.length)return '';
 var any=false, rows='', N=B.N, c=N?NUM_CORE[N.expression]:null;
 parts.forEach(function(p){p.mn=nameMeaning(p.text); if(p.mn)any=true;});
 if(any)parts.forEach(function(p){
  rows+=sgMeet('NAME_MEANINGS','<span class="s-num-g">'+esc(p.text.charAt(0).toUpperCase())+'</span>',
   p.role,p.text,p.mn?sgCap(p.mn.says):'No meaning on file.',p.mn?'Source. '+p.mn.src+'.':'');});
 else rows+='<p class="sg-note">No root meaning on file for '
  +parts.map(function(p){return esc(p.text);}).join(', ').replace(/, ([^,]*)$/,' or $1')+'.</p>';
 if(c)rows+=sgMeet('NUM_CORE','<span class="s-num-g">'+N.expression+'</span>','Expression',
  String(N.expression),sgCap(c.ex)+'.','');
 return sgStage(2,'Named',rows);}
function sumRealName(){
 var nm=capName(String((CURP&&CURP.name)||'').trim());
 return (nm&&nm!=='You')?nm:'';}
function sumNameBlock(B,fallback){
 var nm=sumRealName(), first=nm.split(/\s+/)[0]||(fallback?'You':'');
 var line=(CURP&&CURP.who&&CURP.who.line)?'<div class="s-pwho">'+esc(CURP.who.line)+'</div>':'';
 var full=(B.full&&B.full!==first)?'<div class="s-pwho">'+esc(B.full)+'</div>':'';
 return first?'<div class="s-pname">'+esc(first)+'</div>'+full+line:'';}
function sumPlate(r,B){
 var t=TIER_BY[r.tier]||null;
 return '<div class="s-plate">'
  +'<div class="s-pl-l">'+sumNameBlock(B,true)+'</div>'
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
   /* no band yet while CQ is still filling, so the slot says what is left */
   +esc(tierSay(r))+'</b>'
   +(t&&t.state?'<em>'+esc(t.state)+'</em>':'')+'</div>'
  +'</div>'
  /* the direction out, which has never been on a surface a touch screen can
     reach. It is the third of the three things a band is required to carry. */
  +(t&&t.toward?'<div class="s-ptoward"><span class="pm-eye">Where it goes</span>'
    +esc(t.toward)+'</div>':'')
  +'</div>';}
/* the head of the page: the plate. On a read profile it is the name, the band
   and where it goes. On an unread one it is what was entered and nothing else,
   so a name and a birth date still read and a default never does. */
function sumWho(r,B,full){
 /* A NAME IS ENTERED OR IT IS NOT. A blank profile carries the roster word
    You, which is a default and not somebody, so it never counts. */
 if(!full&&!(B.sp||B.N||sumRealName()))return '';
 return sgZone('who','Who this is',
  full?sumPlate(r,B):'<div class="s-plate sg-plain"><div class="s-pl-l">'+sumNameBlock(B,false)+'</div></div>');}
/* the first drivers card. Unread or read, it is only what a birth and a name
   say, so it is real or it is absent. */
function sumDrivers(B,r){
 var parts=sumNameParts(B);
 if(!(B.sp||B.N||parts.length))return '';
 var born=sumBorn(B), isObj=typeof born==='object';
 return '<section class="sg-card sg-drive" data-grp="drive">'+sgHead('drive','What drives it')
  +(isObj?born.stage:born)+sumNamed(B)
  +'<span class="sg-down" aria-hidden="true">'+sumIc('down','sg-ic')+'</span>'
  +(isObj?sgFold('range','Other ways this shows up',born.more):'')+'</section>';}
/* the birth marks, one strip across the page under the story and the roots, so
   neither card has to make room for them and a five or a seven stands level */
function sumMarks(B,r){
 var C=B.sp?converge(B.p.nm,r):null;
 return C?'<div class="sg-marks" data-grp="marks">'+sumChips(C)+'</div>':'';}
/* a zone is a heading with a mark and one body. The heading names the slot and
   the slot keeps its name whatever the data says. */
function sgHead(k,title){
 return '<h2 class="sg-zh" id="sg-h-'+k+'">'+sumIc(SUM_IC[k]?k:'src')+'<span>'+esc(title)+'</span></h2>';}
function sgZone(k,title,body,cls){
 return '<section class="sg-z sg-'+k+(cls?' '+cls:'')+'" data-grp="'+k+'" aria-labelledby="sg-h-'+k+'">'
  +sgHead(k,title)+body+'</section>';}
var SUM_OPEN={};
function sgFold(k,title,body){
 if(!body)return '';
 return '<details class="sg-fold" data-fold="'+k+'" data-grp="fold"'+(SUM_OPEN[k]?' open':'')+'>'
  +'<summary><span>'+esc(title)+'</span>'+sumIc('chev','sg-chev')+'</summary>'
  +'<div class="sg-fold-b">'+body+'</div></details>';}
/* THE NINE, AS THE PERSON'S OWN SET. Nine cells in a fixed order, three by
   three, each with its mark, the place in the body it is felt and the weight.
   A fixed order because a slot keeps its place and the value carries the
   state: a person finds Fear where Fear was. */
function sumNine(){
 var C=(typeof CHILD!=='undefined')?CHILD:[]; if(!C.length)return '';
 var top=C.map(function(c){return +(S.charge[c.nm]||0);});
 var mx=Math.max.apply(null,top);
 return '<div class="sg-nine">'+C.map(function(c,i){var sq=top[i];
  return '<div class="sg-n'+(sq>0&&sq===mx?' top':'')+'" data-nine="'+esc(c.nm)+'">'
   +cr(c.seat,sq*10,{size:'sm',raw:sq.toFixed(1),glyph:'<path d="'+c.ic+'"/>',label:c.nm})
   +'<span class="sg-n-t"><b>'+esc(c.nm)+'</b><em>'+esc(c.loc)+'</em></span></div>';}).join('')+'</div>';}
/* THE DAY SLOT. Another seat builds the Daily Summary, engine/daily.js, and
   this is where its block goes: under the story, above the output row, full
   width. It renders nothing until sumDayHtml returns something, and an empty
   slot takes no room. Whoever fills it returns the markup from sumDayHtml and
   touches nothing else on this page. */
function sumDayHtml(r){return '';}
function sumDaySlot(r){
 return '<div id="sumday" class="sg-day" data-slot="daily" data-grp="day">'+sumDayHtml(r)+'</div>';}

/* WHAT THIS STATE CALLS FOR. ritFor is a pure function of the reading and has
   only ever been called from inside the ritual overlay, which opens after a
   release run, which means a person who has not run one has never seen it. */
function sumOutput(r){
 var rit=(typeof ritFor==='function')?ritFor(r):null;
 var m=(typeof meterRead==='function')?meterRead(CURP):null;
 var hot=r.loaded.slice().sort(function(a,b){return b.sq-a.sq;})[0];
 /* how much of the reading a release can still reach, from the engine. It
    is expression's headroom since 25 September. CQ is the laws alone and a
    release lifts them only slowly (LIFT_R), so a CQ headroom read almost 0 for
    everybody; what a release moves visibly is the shadow, through expression. */
 var rhead=(typeof exHeadroom==='function')?exHeadroom(r.EX):99;
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
    :card('The protocol','Not read yet',
     'Write what happened and this fills in',''))
  /* WHAT RELEASE HAS LEFT IN IT, said before the person spends the time, and
     only when there is something to spend it on.

     A release works on the shadow; it cannot manufacture integrity, because
     integrity is the twenty one laws and those move when a person answers
     them or when what they do changes. Measured under the old formula by
     clearing every charge and reading CQ back: Marcus could run every release
     this product would ever offer him and move 0.3, Sofia 1.5, Angela 1.0.
     Since 25 September CQ is the laws alone and a release moves it by
     nothing, so what is measured here is expression, which is CQ times what
     the shadow leaves: the most a release can still give back.

     Four cases, and each says only what is true of it. Something above the
     line, release it. Carrying below the line with room left, release that.
     Carrying with the room gone, name the lever that is not gone. Carrying
     nothing, say so, which is the right answer for the people it is true of
     and was previously said to everybody.

     THIN is 1.5 points of expression. Not a tuned constant: the reading is published
     to plus or minus about thirteen, so a lever with under one and a half in
     it cannot produce a move this instrument would call a reading, and the
     product should not spend a person's fifteen minutes pretending otherwise. */
  +(function(){
    var THIN=1.5;
    if(hot)return card('Release this first',hot.k,
     hot.b+' seat, holding '+hot.sq.toFixed(1)
      +(r.unread||!r.complete?'':'. Release has about '+rhead.toFixed(1)+' points of expression in it'),
     '<button class="btn s-oact" data-sout="rel" data-n="'+hot.i+'">Run a release</button>');
    if(r.heaviest&&(r.unread||rhead>=THIN))return card('Release this first',r.heaviest.k,
     r.heaviest.b+' seat, below the line at '+r.heaviest.sq.toFixed(1)
      +'. The heaviest thing you are holding',
     '<button class="btn s-oact" data-sout="rel" data-n="'+r.heaviest.i+'">Run a release</button>');
    /* four words, so it is a label. "now" was the fifth and it was carrying
       nothing: the whole surface is the reading now. */
    /* while CQ is still filling, expression cannot rise above it, so the
       headroom is near 0 whatever is held and the figure says nothing */
    if(!r.complete)return card('What moves the reading','The twenty one laws',
     'Coherence fills as you answer them, and expression cannot rise above it',
     '<button class="btn s-oact" data-sout="iq">Answer the laws</button>');
    if(r.heaviest)return card('What moves the reading','The twenty one laws',
     (rhead>=0.05?'Release has about '+rhead.toFixed(1)+' points of expression left in it for you. The rest '
      +'is the laws, and they move when you answer them or when what you do changes'
      :'Release has no expression left in it for you. What is left is the laws, and they move '
      +'when you answer them or when what you do changes'),
     '<button class="btn s-oact" data-sout="iq">Answer the laws</button>');
    return card('Release this first','Nothing is carrying',
     'No address is holding anything','');}())
  /* A NUMBER CARRIES ITS UNIT. This read "12 away", twelve of what; the
     record card says the same distance in addresses, so this does too. And
     the fallback said "The first one. Open some ground and it appears",
     which is false: markersFor() always returns the ladder, on a reference
     age when there is no birth date, so m.next is null only once every
     marker is behind the person. */
  +(m&&m.next?card('Next marker',m.next.nm,
      m.next.left+(m.next.left===1?' new address':' new addresses')+' away','')
    :m?card('Next marker','None left','Every marker is behind you',''):'')
  +'</div>';}

function sumFull(r){
 var B=sumBirth(), C=B.sp?converge(B.p.nm,r):null;
 /* THE ORDER IS THE ORDER A PERSON ASKS IN, and every group is one question.
    Who is this. What did they say, and what do their roots say beside it. What
    is running, and what does it cost. What do they do about it. Then, folded
    away, where each of those comes from. Every row is two equal halves or
    three equal thirds. */
 return sumWho(r,B,true)
  /* THE CENTRE IS THE STORY. Ruled. Their own words first, coloured where
     they landed, then the reading built from them. The order matters: the
     reading is a claim about the person and the story is the evidence for
     it, and evidence goes first. It stands on the first screen, left of the
     roots, and the phone reads it before them. */
  +'<div class="sg-two sg-lead">'
   +'<section class="sg-card sg-story" data-grp="story">'+sumToldHtml()
    +'<div class="s-readbox sg-flat">'+sumStory(r)+'</div></section>'
   +sumDrivers(B,r)
  +'</div>'
  +sumMarks(B,r)
  +'<div class="sg-two">'
   +'<section class="sg-card" data-grp="run">'+sgHead('run','What is running')
    +sumBlueprint()
    +'<div class="sg-gap">'+sumArch(r)+'</div>'
    +'<div class="sg-gap"><div class="pm-eye">Masks</div>'+sumMasks(r,0,3)+'</div>'
    +'<div class="sg-gap">'+sumChain(r)+'</div>'
    +sgFold('masks','All masks',sumMasks(r,3,99)||'')
   +'</section>'
   +'<section class="sg-card" data-grp="cost">'+sgHead('cost','What it costs')
    +sumGlance(r,true)
    +'<div class="sg-gap"><div class="pm-eye">In the body</div>'+sumNine()+sumAxes(r,true)+'</div>'
    +sgFold('seats','Heaviest seats',sumSeats())
    +sgFold('ig','Integrity over time',sumIg(r))
   +'</section>'
  +'</div>'
  +sumDaySlot(r)
  +sgZone('todo','What to do',sumOutput(r))
  +'<div class="sg-folds">'
   +sgFold('lens','Four lenses',sumLens(r,true))
   +(C?sgFold('conv','Birth comparison',sumConverge(C)):'')
   +sgFold('num','Numerology, in full',sumNum(r,true))
  +'</div>';}

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
function sumAxes(r,bare){
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
  p.push('Nothing is carrying on any of the nine.');
 }else{
  var top=live[0];
  /* NO "the" IN FRONT OF THE ADDRESS. Half the nine carry a plexus, which
     takes an article, and half carry a phrase like "Below the heart", which
     does not. "It sits at the Below the heart" is what a template does when
     it assumes one shape of noun. */
  /* "of 10" made a weight a mark out of ten. V8, and ui/summary.js was its
     own named corpse: "at a weight of 7.4" is what ships, so this says it. */
  p.push('The heaviest of the nine is <b>'+esc(top.c.nm)+'</b>, at a weight of <b>'
   +top.sq.toFixed(1)+'</b>. It sits at '+esc(top.c.addr)
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
      +(live.length-4===1?'is':'are')+' carrying something.':''));}
 }
 if(standing.length){
  p.push('Standing against them: <b>'+esc(standing[0].c.opp)+'</b> at <b>'
   +standing[0].rep.toFixed(1)+'</b>'
   +(standing.length>1?', and '+(standing.length-1)+' other'
     +(standing.length>2?'s':'')+' installed':'')
   +'. An address with the opposite installed conducts.');}
 return '<div class="s-axes">'+(bare?'':'<div class="pm-eye">In the body</div>')
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
function sumLens(r,bare){
 var L=[lensWestern(r),lensEastern(r),lensDesign(r),lensGene(r)]
  .filter(function(x){return x&&x.a;});
 if(!L.length)return '';
 return (bare?'':'<div class="pm-eye" style="margin-top:18px">Four lenses</div>')
  +'<div class="s-lens">'+L.map(function(x){
   /* WHAT IT WAS READ OFF MOVES TO THE ROW'S TITLE, round HS. It was a
      fourth line in small italics under every lens, "read off root domain as
      element", the third tier text he asked to have swept off the site. It
      is kept, one hover away, because it is the provenance of a label put
      on a person; it is not printed on the page. */
   return '<div class="s-ln" title="'+esc('Read off '+x.c+'.')+'">'
    +'<span class="s-ln-t">'+esc(x.t)+'</span>'
    +'<b class="s-ln-a">'+esc(x.a)+'</b>'
    +'<span class="s-ln-b">'+esc(x.b)+'</span>'
   +'</div>';}).join('')+'</div>';}

/* ---- integrity over time ---- */
function sumIg(r){
 var sr=(typeof seriesRead==='function')?seriesRead(CURP,SUM_SPAN,Date.now()):null;
 var head='<div class="s-ig"><div class="s-ig-h">'
  +'<span class="pm-eye">Integrity over time</span>'
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
     +pts[0].ig.toFixed(1)+'</b>. Two makes a line.'
    :'Nothing on the record for this span.')
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
  +'<div class="s-ig-f"><span>'+first.toFixed(1)+'</span>'
  +'<b>'+dir+'</b><span>'+last.toFixed(1)+'</span></div>';}
 return head+body+'</div>';}

/* ---- one delegated listener for everything on this surface ---- */
function sumWire(){
 var h=document.getElementById('sumbody'); if(!h||h.dataset.wired)return;
 h.dataset.wired='1';
 /* a fold remembers that it was opened through the next repaint, because
    the surface is rewritten whole whenever a reading changes. toggle does not
    bubble, so it is caught on the way down. */
 h.addEventListener('toggle',function(ev){var d=ev.target;
  if(d&&d.getAttribute&&d.getAttribute('data-fold'))SUM_OPEN[d.getAttribute('data-fold')]=d.open;},true);
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
