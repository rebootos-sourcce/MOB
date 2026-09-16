/* ============================================================
   THE SNIFFER. scanStory finds every hit, parseStory turns tags
   into imprints, applyStory is the only function that mutates.
   ============================================================ */
var K2BAND={crown:'Crown',eye:'3rd Eye',throat:'Throat',heart:'Heart',
 solar:'Solar',sacral:'Sacral',root:'Root'};
var B2K={Crown:'crown','3rd Eye':'eye',Throat:'throat',Heart:'heart',
 Solar:'solar',Sacral:'sacral',Root:'root'};
var K2B={};Object.keys(B2K).forEach(function(b){K2B[B2K[b]]=b;});
var PMC={};BANDS.forEach(function(b){PMC[b]=PAL[b];});
function scanStory(text){
 var src=' '+String(text||'').toLowerCase().replace(/[^a-z' ]+/g,' ').replace(/\s+/g,' ')+' ';
 var hits=[];
 /* phrases first: an idiom outranks its own words */
 PHRASES.forEach(function(row){
  var words=row[0], band=row[1], amt=row[2], label=row[3];
  words.forEach(function(w){
   var at=src.indexOf(' '+w+' ');
   while(at>=0){ hits.push({t:w,kind:'phrase',band:band,amt:amt,label:label,at:at});
    at=src.indexOf(' '+w+' ',at+1); }});});
 /* multi-word LEX entries next, then single words */
 var keys=Object.keys(LEX).sort(function(a,b){return b.length-a.length;});
 keys.forEach(function(w){
  var at=src.indexOf(' '+w+' ');
  while(at>=0){
   /* The window was t.length+2. A match of ' w ' occupies [at, at+len+2), but
      its trailing space IS the next word's leading space, so the next word
      starts at at+len+1 and fell inside the window. Every word directly
      following a longer one was suppressed, and keys are scanned longest
      first, so it bit constantly: a third of legitimate matches never landed.
      The phrase still outranks the words inside it, which is what this is for. */
   if(!hits.some(function(h){return h.at<=at&&at<h.at+h.t.length+1;}))
    hits.push({t:w,kind:'word',band:LEX[w][0],amt:LEX[w][1],at:at});
   at=src.indexOf(' '+w+' ',at+1);}});
 /* adjectives name the charge even when they carry no band */
 Object.keys(ADJ2CHG).forEach(function(w){
  var at=src.indexOf(' '+w+' ');
  while(at>=0){ hits.push({t:w,kind:'adj',charge:ADJ2CHG[w],at:at});
   at=src.indexOf(' '+w+' ',at+1);}});
 hits.sort(function(a,b){return a.at-b.at;});
 return hits;}
/* ============================================================
   THE PATH.

   scanStory already records `at`, the character offset of every hit, and
   sorts the hits by it. parseStory then collapsed everything into per band
   totals, so the route a sentence takes through the body was computed once
   per parse and thrown away. This keeps it.

   Every step sits at a measured position: the centroid of that seat's own
   traced nerve branches, SEATXY. No invented anatomy. What the path adds is
   order, direction and distance, which the totals cannot carry.

   It is a record, not an input. applyStory does not read it and no number in
   the app moves because of it. That is deliberate: the claim it encodes is
   not measured yet, and an unmeasured claim must not reach the arithmetic.
   ============================================================ */

/* Where a named charge sits. Mirrors CHG2SEAT, which is the app's existing
   answer, lowercased to the seat keys the artwork uses. Three charges have no
   entry there: silence and doubt are routed the way CHG2FET already routes
   them, through apathy and shock. joy is coherent and places nothing. */
var PATHSEAT={fear:'root',anger:'solar',shame:'sacral',disgust:'sacral',
 apathy:'throat',shock:'eye',sadness:'heart',grief:'heart',surprise:'heart',
 anticipation:'solar',anxiety:'solar',pride:'crown',guilt:'sacral',
 craving:'sacral',separation:'crown',silence:'throat',doubt:'eye',joy:null};
var PATHMAX=28;                       /* the largest charged amount in LEX */

/* Match precedence, and the reason it is written down rather than inherited.
   scanStory adds phrases, then LEX words, then adjectives, and sorts by
   offset. Sort is stable, so equal offsets keep that insertion order, which
   means the route silently depended on the order of three loops. Stating the
   precedence here makes the path a property of the text instead. */
var PATHRANK={phrase:0, word:1, adj:2};

function seatOf(h){
 if(h.kind==='adj') return PATHSEAT[h.charge]||null;
 if(!h.band||h.band==='coherent') return null;
 return K2BAND[h.band]?h.band:null;}

/* A step is a word occurrence, not a lexicon match. One word can match a
   phrase, a LEX entry and an adjective at once, and those are the same event
   in the body, not three. The occurrence keeps every seat it names, primary
   first, because a word reaching two places is the thing being recorded. */
function pathOf(hits){
 var byAt={}, order=[];
 hits.forEach(function(h){
  if(byAt[h.at]===undefined){byAt[h.at]=[];order.push(h.at);}
  byAt[h.at].push(h);});
 order.sort(function(a,b){return a-b;});

 var steps=order.map(function(at,i){
  var g=byAt[at].slice().sort(function(a,b){
   var r=PATHRANK[a.kind]-PATHRANK[b.kind];
   if(r)return r;
   return String(a.t)<String(b.t)?-1:String(a.t)>String(b.t)?1:0;});
  var seats=[], seen={};
  g.forEach(function(h){var k=seatOf(h);
   if(k&&!seen[k]){seen[k]=1;seats.push(k);}});
  /* the amount comes from whichever match carries one. an adjective names the
     charge without scoring it, and reading that as zero made the adjective the
     minimum of every path it appeared in. */
  var scored=g.filter(function(h){return h.amt!=null;});
  var amt=scored.length?scored.reduce(function(a,h){
   return Math.abs(h.amt)>Math.abs(a)?h.amt:a;},scored[0].amt):null;
  var k=seats[0]||null, xy=k?SEATXY[k]:null;
  return {i:i, at:at, word:g[0].t, kind:g[0].kind,
   seat:k, band:k?K2BAND[k]:null, seats:seats,
   x:xy?xy.x:null, y:xy?xy.y:null,
   amt:amt, depth:amt!=null?clamp(amt/PATHMAX,0,1):null,
   coherent:g.some(function(h){return h.band==='coherent';})};});

 var on=steps.filter(function(s){return s.seat;});
 var sc=on.filter(function(s){return s.amt!=null;});
 var span=0, net=0, drop=0, rise=0, dwell=null, kink=null, floor=null;
 if(on.length){
  for(var j=1;j<on.length;j++){
   var dx=on[j].x-on[j-1].x, dy=on[j].y-on[j-1].y;
   span+=Math.sqrt(dx*dx+dy*dy);
   if(dy>drop)drop=dy; if(dy<rise)rise=dy;}
  net=on[on.length-1].y-on[0].y;      /* positive is downward, toward root */
  var tal={};on.forEach(function(s){tal[s.seat]=(tal[s.seat]||0)+1;});
  dwell=on.reduce(function(a,s){return tal[s.seat]>tal[a]?s.seat:a;},on[0].seat);}
 /* The kink. parseStory sorts by susceptibility and takes the top, which is to
    say the app already assumed the block sits at the highest charge. Nobody
    ruled that. Both ends are reported so it can be ruled from data rather than
    from a sort order. */
 if(sc.length){
  kink =sc.reduce(function(a,s){return s.amt>a.amt?s:a;},sc[0]);
  floor=sc.reduce(function(a,s){return s.amt<a.amt?s:a;},sc[0]);}

 function end(s){return s?{seat:s.seat,word:s.word,amt:s.amt,i:s.i}:null;}
 return {steps:steps, located:on.length, scored:sc.length,
  span:Math.round(span*100)/100, net:Math.round(net*100)/100,
  drop:Math.round(drop*100)/100, rise:Math.round(rise*100)/100,
  dwell:dwell, start:on.length?on[0].seat:null, end:on.length?on[on.length-1].seat:null,
  kink:end(kink), floor:end(floor)};}

function parseStory(text){
 var hits=scanStory(text), byBand={}, byChg={}, imprints=[];
 hits.forEach(function(h){
  if(h.band&&h.band!=='coherent'){ byBand[h.band]=(byBand[h.band]||0)+h.amt; }
  if(h.charge){ byChg[h.charge]=(byChg[h.charge]||0)+1; }});
 var wanted={}; Object.keys(byChg).forEach(function(c){var f=CHG2FET[c]; if(f)wanted[f]=true;});
 var anyNamed=Object.keys(wanted).length>0;
 Object.keys(byBand).forEach(function(k){
  var bn=K2BAND[k]; if(!bn) return;
  var all=W.filter(function(n){return n.b===bn&&n.cf;});
  /* Band says WHERE, the adjective says WHAT. But a named fetter only governs
     a band it actually occupies. The original accepted any non-empty match, so
     one Shame address at the heart was enough to route the whole heart band --
     including everything the despair idioms carried -- onto Shame, and grief
     was filed as shame. A named fetter now has to hold at least a quarter of
     the band, otherwise the band's own modal fetter is the better read. */
  var seg=anyNamed? all.filter(function(n){return wanted[n.cf];}) : [];
  if(seg.length < all.length*0.25){
   var tally={}; all.forEach(function(n){tally[n.cf]=(tally[n.cf]||0)+1;});
   var modal=Object.keys(tally).sort(function(a,b){return tally[b]-tally[a];})[0];
   var mseg=all.filter(function(n){return n.cf===modal;});
   /* keep whichever reading is better represented at this seat */
   if(mseg.length>seg.length) seg=mseg;
   if(!seg.length) seg=all;}
  seg=seg.sort(function(a,b){return (b.susc||1)-(a.susc||1);});
  if(!seg.length) return;
  /* the intensity curve is 0-30ish. normalise to a 0-10 charge delta. */
  var total=Math.min(10,byBand[k]/3), share=total/Math.min(4,seg.length);
  seg.slice(0,4).forEach(function(n){
   imprints.push({node:n.i, name:n.k, band:bn, fetter:n.cf,
    amt:Math.round(share*10)/10, from:k});});});
 var nm={}; Object.keys(byChg).forEach(function(c){
  var f=CHG2FET[c]; if(f) nm[f]=(nm[f]||0)+byChg[c];});
 var named=Object.keys(nm).sort(function(a,b){return nm[b]-nm[a];});
 return {hits:hits, bands:byBand, charges:byChg, named:named, weights:nm, imprints:imprints,
  path:pathOf(hits),
  words:hits.filter(function(h){return h.kind!=='adj';}).length};}
function applyStory(text){
 var p=parseStory(text), touched={};
 p.imprints.forEach(function(im){ var f=im.fetter; if(!f) return;
  touched[f]=(touched[f]||0)+im.amt;});
 /* an adjective sharpens which fetter; repeated mentions weigh more */
 p.named.forEach(function(f,i){ touched[f]=(touched[f]||0)+0.8/(1+i*0.5); });
 Object.keys(touched).forEach(function(f){
  S.charge[f]=clamp((S.charge[f]||0)+touched[f]*0.35,0,10);});
 /* the coherent words pull the other way */
 var calm=p.hits.filter(function(h){return h.band==='coherent';})
  .reduce(function(a,h){return a+Math.abs(h.amt);},0);
 if(calm)CHARGES.forEach(function(c){S.charge[c]=clamp(S.charge[c]-calm/140,0,10);});
 return {parsed:p, applied:touched};}
