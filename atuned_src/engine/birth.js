
/* ============================================================
   ENERGETICS. Pure functions of date, time and place, and as of
   this pass they are functions of the actual sky rather than of
   the calendar.

   What changed and why it had to. geneKey was the day of the
   month times three, which could only ever produce 31 of the 64
   gates and left 33 unreachable by anyone alive. hdOf was the
   birth hour plus the life path modulo five. moonSign never read
   the birth time. risingSign never read the birthplace, so the
   same clock reading in Quito and Reykjavik returned the same
   ascendant, and they are not the same.

   All four now run off astro.js. One of them, the Human Design
   type, is not computed at all any more, because computing it
   honestly needs the whole bodygraph and emitting a plausible
   guess was the worse of the two failures.
   ============================================================ */
/* ZSIGN is ordered from Aquarius, the astro module counts from Aries.
   ZI maps a longitude index onto this table rather than reordering a
   table other code indexes by position. */
const ZI=[2,3,4,5,6,7,8,9,10,11,0,1];
function zFromLon(lon){return ZSIGN[ZI[signOf(lon)]];}

/* A reading at every instant the record allows, or null when they do not
   all agree. Without a span there is one instant and it is read as before.
   Two ends are the whole check and not a sample: the sun and the moon only
   ever move forward, the design sun follows the birth sun, and a day moves
   neither of them a full sign or gate, so two ends in the same bin means
   every instant between them is in it too. f must return something ===
   comparable, a sign index or a gate and line, never a fresh object. */
function atSpan(b,f){
 if(!b.span)return f(b.jd);
 var a=f(b.span[0]);
 return a===f(b.span[1])?a:null;}

/* The sun by longitude, so a birth on a cusp lands on the right side of
   it. The old calendar cutoffs drift about a day across the leap cycle,
   which is exactly where a cusp birth sits. And for the same reason a
   timed birth with no time zone and no located place has no sun sign on a
   cusp day: the day is known, the side of the cusp is not. That is null,
   and measured over four years of unlocated births at four clock times it
   was 217 of 5840, one in 27. */
function sunSign(d,bt){
 var b=birthJD(bt||{d:d});
 if(b){var i=atSpan(b,function(jd){return signOf(sunLon(jd));});
  if(i===null)return null;
  var z=ZSIGN[ZI[i]]; return {nm:z[2], el:z[3], mode:z[4]};}
 var p=d.split('-'), m=+p[1], day=+p[2];
 for(var j=0;j<ZSIGN.length;j++){
  var a=ZSIGN[j], c=ZSIGN[(j+1)%12];
  if((m===a[0]&&day>=a[1])||(m===c[0]&&day<c[1]))
   return {nm:a[2], el:a[3], mode:a[4]};}
 return {nm:ZSIGN[11][2], el:ZSIGN[11][3], mode:ZSIGN[11][4]};}

/* The moon moves about thirteen degrees a day, so the birth time is not
   a refinement here, it is most of the answer. Without one the record
   gets local noon and the reading says the time is missing.
   A time with no located place is a day wide window, and the moon crosses
   half a sign in it, so it is null when the window straddles a cusp rather
   than whichever side Greenwich happened to put it on. On the same 5840
   births as the sun above that was 2777, close to half. */
function moonSign(bt){
 var b=birthJD(bt); if(!b)return ZSIGN[0];
 var i=atSpan(b,function(jd){return signOf(moonLon(jd));});
 return i===null?null:ZSIGN[ZI[i]];}

/* The ascendant needs a place. Without one this returns null and the
   product says so, because a rising sign invented from a sunrise that
   was never checked is the kind of claim this instrument does not make. */
function risingSign(bt){
 var b=birthJD(bt);
 if(!b||!b.place||!b.timed)return null;
 return zFromLon(ascendant(b.jd,b.place.lat,b.place.lon));}
function lifePath(d){
 var v=d.replace(/-/g,'').split('').reduce(function(a,c){return a+ +c;},0);
 while(v>9&&v!==11&&v!==22&&v!==33)
  v=String(v).split('').reduce(function(a,c){return a+ +c;},0);
 return v;}
function masterNumber(bt){var lp=lifePath(bt.d);return (lp===11||lp===22||lp===33)?lp:null;}
function chineseElement(y){ return CELEM[y%10]; }
/* The Chinese year turns at Li Chun, when the sun reaches 315 degrees,
   which falls on the 3rd to the 5th of February. Using the Gregorian
   first of January hands the wrong animal to everyone born in the first
   five weeks of a year, which is about a tenth of all births. */
function chineseYear(bt){
 var y=+bt.d.split('-')[0], b=birthJD(bt);
 if(!b)return y;
 var lc=julianDay(y,2,4,0), guard=0;
 while(guard++<8){                     /* solve for the sun at 315 */
  var diff=((sunLon(lc)-315+540)%360)-180;
  if(Math.abs(diff)<1e-4)break;
  lc-=diff/0.9856474;}
 return b.jd<lc ? y-1 : y;}
/* Human Design. The personality gate is the sun at birth and the design
   gate is the sun 88 degrees of arc earlier, and both of those are real
   and computed here.

   The TYPE is not. A type falls out of which centres are defined, which
   needs all thirteen bodies at both moments, and this module has the sun
   and the moon. So type reads unresolved and the product says the word
   rather than printing one of five that happens to sound right. The old
   code returned a type for everybody and four of its thirty combinations
   cannot occur in the real system. */
/* A gate and line as one number, so atSpan can compare the two ends of a
   window with ===. Gate numbers are unique on the wheel, so this is too. */
function _gl(lon){var g=gateOf(lon); return g.gate*10+g.line;}
function hdOf(b){
 var j=birthJD(b);
 if(!j)return {type:null, authority:null, unresolved:'no birth date'};
 var typeWhy='type and authority need the full bodygraph, which is not built';
 /* A line is under one degree of sun and an unlocated day moves the sun
    just over one, so the two ends of the window never share a line and an
    unlocated birth gets no gate here at all. That is measured, not
    assumed, and it is why these come back null rather than a gate with a
    line quietly dropped. Located or untimed, span is null and this is
    the old reading exactly. */
 if(atSpan(j,function(jd){return _gl(sunLon(jd));})===null
  ||atSpan(j,function(jd){return _gl(sunLon(designJD(jd)));})===null)
  return {type:null, authority:null, unresolved:typeWhy,
   personality:null, design:null, profile:null};
 var pers=gateOf(sunLon(j.jd)), des=gateOf(sunLon(designJD(j.jd)));
 return {type:null, authority:null, unresolved:typeWhy,
  personality:pers, design:des,
  profile:pers.line+'/'+des.line};}

/* A gene key is the gate the sun occupied, on the I Ching wheel, which
   is a real position and not the day of the month. Line is the sixth of
   the gate it fell in. It is the personality sun, so an unlocated birth
   loses it for the reason given inside hdOf. */
function geneKey(b){
 var j=birthJD(b);
 if(!j)return {gate:null, line:null, unresolved:'no birth date'};
 if(atSpan(j,function(jd){return _gl(sunLon(jd));})===null)
  return {gate:null, line:null, unresolved:'needs a time zone the instrument can read'};
 var g=gateOf(sunLon(j.jd));
 return {gate:g.gate, line:g.line, lon:g.lon};}
function spiritual(name){
 var bt=BIRTH[name]; if(!bt) return null;
 return spiritualOf(bt);}
/* split out so a live person's own intake can be read the same way a
   reference case is, rather than only through the BIRTH table. */
function spiritualOf(bt){
 if(!bt||!bt.d)return null;
 /* the sun and the moon are null for an unlocated birth whose window
    crosses a cusp, and every field hung off them is null with them, so a
    root or a mode is never derived from a sign that was not read. */
 var sun=sunSign(bt.d,bt)||{nm:null,el:null,mode:null}, mn=moonSign(bt)||[];
 var rs=risingSign(bt), cy=chineseYear(bt), b=birthJD(bt);
 return {sun:sun.nm, sunEl:sun.el, sunMode:sun.mode, moon:mn[2]||null, moonEl:mn[3]||null,
  /* null rather than a guess. the reading prints what is missing. */
  rising:rs?rs[2]:null, risingEl:rs?rs[3]:null,
  needsPlace:!rs&&!!bt.t, needsTime:!(b&&b.timed),
  /* a span on a record means its offset was not known, and what settles it
     is a time zone, so that is what the reading asks for */
  needsZone:!!(b&&b.span&&!b.zone),
  chinese:CHINESE[((cy%12)+12)%12], celem:chineseElement(((cy%10)+10)%10), cyear:cy,
  lp:lifePath(bt.d), master:masterNumber(bt), hd:hdOf(bt), gk:geneKey(bt), birth:bt,
  root:sun.el?ELEM2ROOT[sun.el]:null, mode:sun.mode?MODE2NOTE[sun.mode]:null,
  lpMean:LPMEAN[lifePath(bt.d)]||''};}
/* CONVERGENCE. where independent systems agree, that is the signal.
   where they disagree the instrument says so rather than picking a winner. */
function converge(name,r){
 var e=spiritual(name); if(!e) return null;
 var agree=[],differ=[];
 var rootNow=(DOMAINS[S.doms[0]]||{}).r||'';
 if(e.root===rootNow) agree.push('birth element '+e.sunEl+' and your root domain both read '+e.root);
 else differ.push('birth element points '+e.root+', your domain runs '+rootNow);
 var archNow=(ARCH[r.pi]||{}).nm||'';
 if(LP2ARCH[e.lp]===archNow) agree.push('life path '+e.lp+' and your first archetype both read '+archNow);
 else differ.push('life path '+e.lp+' reads '+(LP2ARCH[e.lp]||'unmapped')+', you run '+archNow);
 var initiating=(e.sunMode==='cardinal');
 /* benign is null while CQ is still filling. A missing direction is a gap,
    for the reason given below for the design type, and scoring it as the
    field contracting made an unanswered intake read as disagreement. */
 var fieldOpen=(r.benign===null||r.benign===undefined);
 if(!fieldOpen){
  if(initiating===!!r.benign) agree.push('birth mode '+e.sunMode+' matches a field that is '
    +(r.benign?'expanding':'contracting'));
  else differ.push('birth mode '+e.sunMode+' against a field that is '+(r.benign?'expanding':'contracting'));}
 /* The fourth comparison used to read a Human Design type that was the
    birth hour modulo five. Now that the type is honestly unresolved
    there is nothing to compare, so it goes in a third bucket. A gap is
    not a disagreement, and scoring it as one made an absent input look
    like evidence against the person. */
 var open=[];
 if(e.hd.unresolved)open.push('Human Design type, which needs the full bodygraph');
 if(!e.rising)open.push('the ascendant, which needs '+(e.needsTime?'a birth time':'a birthplace'));
 /* the design gate is real and independent of the field, so it can be
    compared: a design line of 1 or 4 is an inward profile. */
 if(fieldOpen)open.push('the direction of the field, which needs all '+SI.length+' laws answered');
 else if(e.hd.design){
  var inward=(e.hd.design.line===1||e.hd.design.line===4);
  if(inward===!r.benign)agree.push('design line '+e.hd.design.line+' and a field that is '
    +(r.benign?'expanding':'contracting')+' point the same way');
  else differ.push('design line '+e.hd.design.line+' against a field that is '
    +(r.benign?'expanding':'contracting'));}
 var n=agree.length+differ.length;
 return {e:e, agree:agree, differ:differ, open:open,
  /* reported as a fraction, because three of four and seventy five
     percent are the same number and only one of them says how few
     comparisons it rests on. */
  of:n, score:n?Math.round(agree.length/n*100):null};}

