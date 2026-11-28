/* ============================================================
   THE SUMMARY'S LEFT RAIL: THE PERSON'S WHOLE ROOT ENERGETICS, STACKED.

   His words, 27 November: the left rail is the root energetics "as bars
   stacked on top of each other", with the names printed (Virgo, Aries,
   Capricorn), "no hover needed", and none of the birth suggestion, What is
   running or the masks. The old rail drew the same facts as circles whose
   words were clipped off the screen and said only on hover, which is the
   defect he named, so a bar here prints the fact: a mark, the name of the
   fact, and the value, in that order.

   WHAT FILLS AND WHAT DOES NOT. Only the two archetypes carry a percent, the
   16 October ruling: an archetype's figure is how fully it is expressed
   (archExpr, engine/archexpr.js), the same figure the rail printed before. So
   they, and nothing else, draw a fill behind the bar. A sun sign or a gate has
   no percent anywhere in this product, and a fill drawn for one would be a
   measurement invented for the picture.

   NOTHING PRINTS OFF A DEFAULT. A value the record cannot settle is a dash
   with one line under it saying what is missing, in the words personas.js
   already uses for the same gaps (renderSpirit: noZone, noPlace, needsTime),
   so the two never name one gap two ways. A person with no birth at all gets
   the Born bar and nothing under it, because fourteen bars of dashes is a page
   of absence and the one line says what unlocks them.

   THE MEANING OF EVERY BAR is on hover, tap and focus (data-tip), from the
   same unpackOf calls renderSpirit makes, so a sign says the same thing here
   as on the Field. The visible text is the fact itself, never a caption about
   it. The "what is missing" line is an empty state and is marked as one
   (data-say="empty"), which the no caption rule of 27 November allows.

   READ ONLY. Painted from sumRender, off the reading the page holds, and
   written to #sumstackl only when the markup has changed, so a render that
   changes nothing leaves a tip that is open on a bar where it was.
   ============================================================ */
var SS_LAST='';
/* a bar. k is the fact, v its value (already markup), tip the meaning. A
   missing value passes miss, the one line saying what would settle it. A fill
   passes {c,v}: the colour and how far across, 0 to 100. */
function ssBar(k,mark,v,tip,miss,fill){
 return '<li class="ss-bar'+(fill?' ss-fill':'')+'" tabindex="0" data-tip-k="'+esc(k)+'" data-tip="'+esc(tip)+'"'
  +(fill?' style="--c:'+esc(fill.c)+';--v:'+(+fill.v).toFixed(1)+'"':'')+'>'
  +'<span class="ss-ic" aria-hidden="true">'+mark+'</span>'
  +'<span class="ss-k">'+esc(k)+'</span>'
  +'<span class="ss-v">'+v+'</span>'
  +(miss?'<span class="ss-miss" data-say="empty">'+esc(miss)+'</span>':'')+'</li>';}
function ssSvg(inner){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+inner+'</svg>';}
/* a sign's own character, forced to its text form with VS15 so a device does
   not paint it as a coloured emoji, the way reTile does (ui/personas.js) */
function ssSign(z){return '<span class="ss-g">'+esc(ZGLYPH[z]||'')+'\uFE0E</span>';}
var SS_DASH='–';
/* THE ROOTS A PERSON RUNS: the one the sun gives at birth, then every root the
   chosen domains sit under, then any the person added, each once. Read by the
   bar and by what Source AI says of the stack (ui/sumtalk.js), so the two
   cannot name different roots. sp may be null: then only the chosen ones. */
function ssRoots(sp){
 var roots=[]; function add(x){if(x&&roots.indexOf(x)<0)roots.push(x);}
 add(sp&&sp.root); Object.keys(rootsLit()).forEach(add); (S.roots||[]).forEach(add);
 return roots;}
function ssPlain(a){return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');}
function sumStackHtml(r){
 var p=PEOPLE[S.who]||PEOPLE[0], sp=spiritual(p.nm)||spiritualOf(bornAsBirth(CURP));
 /* no birth: the Born bar, and what unlocks the rest */
 if(!sp)return ssBar('Born',ssSvg(SYSGLYPH.born),SS_DASH,
  'Date, time and place of birth unlock the sun, moon, rising, the year animal, the life path and the gene key.',
  'needs a birth date, time and place');
 /* the name's numbers only off a name that is somebody's, for the reason
    spNumRows gives: a blank profile's roster name is the word You */
 var N=numFullName(CURP)?numerologyOf(p.nm,CURP):null;
 var AX=(!r.unread&&typeof archExprAll==='function')?archExprAll():null;
 /* the same three gaps renderSpirit names, in the same words. An untimed birth
    is refused for its day and not its offset, so needsTime is read first. */
 var noPlace='needs a birthplace the instrument can locate';
 var noZone=sp.needsTime?'needs a birth time'
  :!sp.needsZone?'the clocks changed at that hour'
  :sp.birth.z?'needs a time zone the instrument can read':'needs a birth time zone';
 var rows=[];
 /* BORN: the day, and under it the place. The tip carries the time and the
    zone, which is the line renderSpirit's Born tile gives. */
 var bornSay=[sp.birth.d,sp.birth.t].filter(Boolean).join(' ')+(sp.birth.p?', '+sp.birth.p:'')+(sp.birth.z?', '+sp.birth.z:'');
 rows.push(ssBar('Born',ssSvg(SYSGLYPH.born),
  esc(sp.birth.d)+(sp.birth.p?'<span class="ss-x">'+esc(sp.birth.p)+'</span>':''),bornSay));
 /* SUN, MOON, RISING. A sign nobody read is a dash and the reason under it. */
 function sign(k,z,nm,why){
  return z?ssBar(k,ssSign(z),esc(z),ssPlain(unpackOf(nm),unpackOf(z,'sign')))
   :ssBar(k,ssSvg(SYSGLYPH.W),SS_DASH,'Not read. '+why.charAt(0).toUpperCase()+why.slice(1)+'.',why);}
 rows.push(sign('Sun',sp.sun,'sun sign',noZone));
 rows.push(sign('Moon',sp.moon,'moon sign',noZone));
 rows.push(sign('Rising',sp.rising,'rising sign',sp.needsTime?'needs a birth time':sp.needsPlace?noPlace:noZone));
 /* YEAR: the element and the animal, one reading, wearing the element's mark */
 var cic=(typeof CELEM_IC!=='undefined'&&CELEM_IC[sp.celem])||SYSGLYPH.E;
 rows.push(sp.chinese
  ?ssBar('Year',ssSvg(cic),esc(sp.celem+' '+sp.chinese),
    ssPlain(unpackOf('year animal'),unpackOf(sp.chinese,'animal'),unpackOf('year element'),unpackOf(sp.celem,'year')))
  :ssBar('Year',ssSvg(SYSGLYPH.E),SS_DASH,'Not read. Needs a birth time.','needs a birth time'));
 /* THE NUMBERS. Life path and a master number come off the birth date alone;
    the other five need the full name. Without one they are a single bar, not
    five dashes in a column. */
 rows.push(ssBar('Life path',ssSvg(NUMFIELD_IC.path),esc(String(sp.lp)),
  ssPlain(unpackOf('life path'),unpackOf('path:'+sp.lp))||'Life path '+sp.lp+'.'));
 if(sp.master)rows.push(ssBar('Master',ssSvg(NUMFIELD_IC.master),esc(String(sp.master)),
  unpackOf('master number')||'Master number '+sp.master+'.'));
 if(N){
  [['expression','Expression'],['soul','Soul urge'],['personality','Personality'],['birthday','Birthday'],['maturity','Maturity']]
   .forEach(function(x){var v=N[x[0]]; if(v===null||v===undefined)return;
    rows.push(ssBar(x[1],ssSvg(NUMFIELD_IC[x[0]]||''),esc(String(v)),unpackOf(x[1].toLowerCase())||x[1]+' '+v+'.'));});
 }else rows.push(ssBar('Name numbers',ssSvg(NUMFIELD_IC.expression),SS_DASH,
  'Expression, soul urge, personality, birthday and maturity are read off your full name.','needs your full name'));
 /* THE DESIGN READING: the profile, the two gates and the gene key */
 var gnum=function(g){return g.gate+'.'+g.line;};
 function gate(k,ic,g,tipk){
  return g?ssBar(k,ssSvg(ic),esc('gate '+gnum(g)),ssPlain(unpackOf(tipk),unpackOf('gate'),unpackOf('line')))
   :ssBar(k,ssSvg(ic),SS_DASH,'Not read. '+noZone.charAt(0).toUpperCase()+noZone.slice(1)+'.',noZone);}
 rows.push(sp.hd.profile
  ?ssBar('Profile',ssSvg(DESIGNFIELD_IC.profile),esc(sp.hd.profile),unpackOf('profile')||'Profile '+sp.hd.profile+'.')
  :ssBar('Profile',ssSvg(DESIGNFIELD_IC.profile),SS_DASH,'Not read. '+noZone.charAt(0).toUpperCase()+noZone.slice(1)+'.',noZone));
 rows.push(gate('Personality gate',DESIGNFIELD_IC.personality,sp.hd.personality,'personality gate'));
 rows.push(gate('Design gate',DESIGNFIELD_IC.design,sp.hd.design,'design gate'));
 rows.push(sp.gk.gate!=null
  ?ssBar('Gene key',ssSvg(DESIGNFIELD_IC.genekey),esc(gnum(sp.gk)),ssPlain(unpackOf('gene key'),unpackOf('gate'),unpackOf('line')))
  :ssBar('Gene key',ssSvg(DESIGNFIELD_IC.genekey),SS_DASH,'Not read. '+noZone.charAt(0).toUpperCase()+noZone.slice(1)+'.',noZone));
 /* ROOT: the one the sun gives at birth, then every root the chosen domains
    sit under, then any the person added, each once */
 var roots=ssRoots(sp);
 rows.push(roots.length
  ?ssBar('Root',ssSvg(glyphPath(ROOTGLYPH[roots[0]])),esc(roots.join(', ')),
    roots.map(function(x){return unpackOf(x.toLowerCase());}).filter(Boolean).join(' ')||roots.join(', ')+'.')
  :ssBar('Root',ssSvg(glyphPath(ROOTGLYPH.Architect)),SS_DASH,'The root is the part of the blueprint your sun element and your domains sit under.','not chosen'));
 /* DOMAIN */
 var doms=(S.doms||[]).filter(function(i){return DOMAINS[i];});
 rows.push(doms.length
  ?ssBar('Domain',ssSvg(glyphPath(DOMAINS[doms[0]].ic)),esc(doms.map(function(i){return DOMAINS[i].nm;}).join(', ')),
    doms.map(function(i){return DOMAINS[i].nm+'. '+DOMAINS[i].d;}).join(' '))
  :ssBar('Domain',ssSvg(glyphPath(DOMAINS[0].ic)),SS_DASH,unpackOf('domain')||'A domain is a named part of your blueprint.','not chosen'));
 /* THE TWO ARCHETYPES, the only bars that fill. The figure is how fully each
    is expressed and the colour is its seat's. */
 [['First archetype',0],['Second archetype',1]].forEach(function(x){
  var i=(S.arcs||[])[x[1]], A=ARCH[i];
  if(!A){rows.push(ssBar(x[0],ssSvg(glyphPath(ARCH[0].ic)),SS_DASH,unpackOf('archetype')||'An archetype is a kind of character.','not chosen')); return;}
  var ax=AX&&AX[i]!=null?AX[i]:null, f=ax!=null?fmtPct('archetype',ax):'';
  var shown=f&&f!==PCT_DASH?f:'';
  rows.push(ssBar(x[0],ssSvg(glyphPath(A.ic)),esc(A.nm)+(shown?'<i class="ss-f">'+esc(shown)+'</i>':''),
   A.nm+'. '+A.d+(shown?' Expressed '+shown+'.':''),'',
   ax!=null&&shown?{c:seatCol(A.b),v:ax*100}:null));});
 return rows.join('');}
function sumStackPaint(r){
 var h=document.getElementById('sumstackl'); if(!h)return;
 var html=r?sumStackHtml(r):'';
 if(html===SS_LAST&&h.innerHTML)return;
 SS_LAST=html; h.innerHTML=html;}
/* leaving the Summary empties the bars, as it empties the page: a hidden
   surface never sits in the document asserting a stale reading */
function sumStackClear(){
 var h=document.getElementById('sumstackl'); if(h)h.innerHTML='';
 SS_LAST='';}
