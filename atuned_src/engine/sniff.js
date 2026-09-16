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
   if(!hits.some(function(h){return h.at<=at&&at<h.at+h.t.length+2;}))
    hits.push({t:w,kind:'word',band:LEX[w][0],amt:LEX[w][1],at:at});
   at=src.indexOf(' '+w+' ',at+1);}});
 /* adjectives name the charge even when they carry no band */
 Object.keys(ADJ2CHG).forEach(function(w){
  var at=src.indexOf(' '+w+' ');
  while(at>=0){ hits.push({t:w,kind:'adj',charge:ADJ2CHG[w],at:at});
   at=src.indexOf(' '+w+' ',at+1);}});
 hits.sort(function(a,b){return a.at-b.at;});
 return hits;}
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
