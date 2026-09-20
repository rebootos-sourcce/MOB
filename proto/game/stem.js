/* ============================================================
   THE STEMMER. The proposed change to engine/sniff.js, built here so it can
   be MEASURED rather than argued about.

   Measured on the built product: 29 of 63 ordinary inflections and near
   synonyms of words the sniffer already knows are read, and the three the
   product misses include fear, shame and anger, which are the names of three
   of the nine axes. One of fourteen of the repository's own persona lines
   produces a single imprint. The content chain cannot be sticky if the
   content engine reads one voice in fourteen.

   The fix is not a bigger table. It is one fold at the boundary: a word the
   table does not hold is reduced to its stem, and if a key shares that stem
   the word is read as that key. One entry then covers its family.

   It carries a BACK MAP, because the span the person reads must be a verbatim
   cut of what they typed and the fold changes the word the engine reports.
   ============================================================ */
(function(root){

/* suffixes, longest first, with what the strip leaves behind. Deliberately
   small: this is a fold for one lexicon, not a linguistics project. */
var SUF=[['iness','y'],['ingly',''],['ation',''],['ement',''],['ness',''],
 ['ment',''],['ings',''],['tion',''],['sion',''],['ing',''],['ies','y'],
 ['ied','y'],['est',''],['ers',''],['er',''],['ed',''],['ly',''],
 ['es',''],['s','']];

function stems(w){
 var out={}, i, s;
 out[w]=1;
 for(i=0;i<SUF.length;i++){
  if(w.length>SUF[i][0].length+2&&w.slice(-SUF[i][0].length)===SUF[i][0]){
   s=w.slice(0,w.length-SUF[i][0].length)+SUF[i][1];
   out[s]=1;
   /* a doubled final consonant, as in slammed and slamming */
   if(s.length>2&&s.charAt(s.length-1)===s.charAt(s.length-2))out[s.slice(0,-1)]=1;
   /* and a dropped e, as in froze and frozen off freeze */
   out[s+'e']=1;}}
 return Object.keys(out);}

/* an index from every stem of every key to that key. Built once. */
function index(keys){
 var ix={};
 keys.forEach(function(k){
  if(k.indexOf(' ')>=0)return;          /* phrases are matched whole already */
  stems(k).forEach(function(s){ if(!ix[s])ix[s]=k; });});
 return ix;}

/* fold the text. Returns the rewritten text and a map from the word the
   engine will now report back to the word the person actually typed, so the
   span stays verbatim. */
function fold(text,ix,known){
 var back={}, any=0;
 var out=String(text||'').replace(/[A-Za-z']+/g,function(w){
  var lo=w.toLowerCase();
  if(known[lo])return w;                /* already a key, leave it alone */
  var ss=stems(lo);
  for(var i=0;i<ss.length;i++){
   var k=ix[ss[i]];
   if(k&&k!==lo){ back[k]=w; any++; return k; }}
  return w;});
 return {text:out, back:back, folded:any};}

var API={stems:stems, index:index, fold:fold, SUF:SUF};
if(typeof module!=='undefined'&&module.exports)module.exports=API;
else root.STEM=API;
})(typeof globalThis!=='undefined'?globalThis:this);
