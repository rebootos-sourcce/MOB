/* THE FUZZY PROBE. Measures recall on painful writing and false lighting on
   quiet writing, for one engine or for two side by side.

     node proto/sniffer/fuzzy-measure.js                     this tree's engine.js
     ENGINE=a.js BASE=b.js node proto/sniffer/fuzzy-measure.js   b is before, a is after
     BOOK=book.txt ...                                       also the owner's prose

   WHAT "LIT" MEANS, in one sentence: parseStory returned at least one
   imprint, which is the condition the Story page uses to say anything at all
   and the one that keeps Commit disabled when it is false. A coherent word on
   its own places no imprint and so does not count as lit.

   RIGHT means the heaviest seat the reading lit is one of the seats the line
   is labelled with. WRONG ONLY means it lit and none of its seats is in the
   label, which is the failure a looser rule risks and the one that costs the
   instrument its credibility.

   Checked against known cases first, because this repository has been bitten
   by a probe reporting its own bug. */
var path=require('path'), fs=require('fs');
var A=require(path.resolve(process.env.ENGINE||'engine.js'));
var B=process.env.BASE?require(path.resolve(process.env.BASE)):null;
var C=require('./fuzzy-corpus.js');

function chk(name,cond){console.log((cond?'  ok   ':'  BAD  ')+name);if(!cond)process.exitCode=1;}
console.log('PROBE CHECKED AGAINST KNOWN CASES');
chk('a word in the table lights',lit(A,'i was furious'));
chk('a word not in the table does not',!lit(A,'i was xyzzy'));
chk('a coherent word alone does not count as lit',!lit(A,'i was calm'));
chk('the heaviest seat of furious is solar',top(A,'i was furious')==='solar');

function lit(E,t){return E.parseStory(t).imprints.length>0;}
function top(E,t){var b=E.parseStory(t).bands,k=Object.keys(b).filter(function(s){return b[s]>0;});
 k.sort(function(x,y){return b[y]-b[x]||(x<y?-1:1);});return k[0]||null;}
function words(E,t){return E.parseStory(t).hits.filter(function(h){return h.kind!=='adj';})
 .map(function(h){return h.t+'>'+(h.band||'');}).join(', ');}

function pain(E,which){
 var n=0,l=0,r=0,w=0,miss=[],wrong=[];
 C.PAIN.forEach(function(row,i){
  if(which==='dev'&&i%2)return; if(which==='held'&&!(i%2))return;
  n++; var t=row[0], ok=row[1];
  if(!lit(E,t)){miss.push(t);return;}
  l++;
  var b=E.parseStory(t).bands, seats=Object.keys(b).filter(function(s){return b[s]>0;});
  if(ok.indexOf(top(E,t))>=0)r++;
  if(!seats.some(function(s){return ok.indexOf(s)>=0;})){w++;wrong.push(t+'  ['+words(E,t)+'] wanted '+ok.join('/'));}});
 return {n:n,lit:l,right:r,wrong:w,miss:miss,wrongs:wrong};}
function quiet(E,kind){
 var rows=C.QUIET[kind], out=[];
 rows.forEach(function(t){if(lit(E,t))out.push(t+'  ['+words(E,t)+']');});
 return {n:rows.length,lit:out.length,lines:out};}
function pct(a,b){return b?Math.round(1000*a/b)/10:0;}

function report(E,label){
 console.log('\n'+label);
 ['dev','held','all'].forEach(function(s){
  var p=pain(E,s);
  console.log('  pain '+(s+'    ').slice(0,4)+'  lit '+p.lit+' of '+p.n+' ('+pct(p.lit,p.n)+'%)'
   +'   heaviest seat right '+p.right+' ('+pct(p.right,p.n)+'%)'
   +'   lit but every seat wrong '+p.wrong);});
 Object.keys(C.QUIET).forEach(function(k){
  var q=quiet(E,k);
  console.log('  quiet '+(k+'     ').slice(0,5)+' lit '+q.lit+' of '+q.n+' ('+pct(q.lit,q.n)+'%)');});
 var v=E.PEOPLE.map(function(p){return p.says;}), vl=v.filter(function(t){return lit(E,t);}).length;
 console.log('  persona says lines lit '+vl+' of '+v.length);}

report(A,'AFTER, or THIS ENGINE  '+(process.env.ENGINE||'engine.js')+'  lexicon '+A.LEX_VERSION+', '+Object.keys(A.LEX).length+' entries');
if(B)report(B,'BEFORE  '+process.env.BASE+'  lexicon '+B.LEX_VERSION+', '+Object.keys(B.LEX).length+' entries');

var all=pain(A,'all');
if(process.env.VERBOSE){
 console.log('\nPAIN STILL UNREAD ('+all.miss.length+')'); all.miss.forEach(function(t){console.log('  '+t);});
 console.log('\nPAIN LIT, EVERY SEAT WRONG ('+all.wrongs.length+')'); all.wrongs.forEach(function(t){console.log('  '+t);});
 Object.keys(C.QUIET).forEach(function(k){var q=quiet(A,k);
  console.log('\nQUIET '+k.toUpperCase()+' THAT LIT ('+q.lines.length+')');q.lines.forEach(function(t){console.log('  '+t);});});}
if(B&&process.env.VERBOSE){
 var before=quiet(B,'trap').lines.concat(quiet(B,'plain').lines,quiet(B,'warm').lines).map(function(s){return s.split('  [')[0];});
 console.log('\nQUIET LINES THAT LIGHT AFTER AND DID NOT BEFORE');
 Object.keys(C.QUIET).forEach(function(k){quiet(A,k).lines.forEach(function(s){
  if(before.indexOf(s.split('  [')[0])<0)console.log('  '+k+'  '+s);});});}

/* THE OWNER'S PROSE. Unlabelled, so it cannot give a recall number, only how
   much of it lights at all and, with BASE, which sentences a change newly
   lights, a seeded sample of which is printed to be read by a person. */
if(process.env.BOOK){
 var txt=fs.readFileSync(process.env.BOOK,'utf8');
 var sents=txt.split(/(?<=[.!?])\s+|\n/).map(function(s){return s.trim();})
  .filter(function(s){return s.split(/\s+/).length>=4;});
 var la=sents.filter(function(s){return lit(A,s);});
 console.log('\nBOOK  '+sents.length+' sentences of four words or more');
 console.log('  lit, this engine   '+la.length+' ('+pct(la.length,sents.length)+'%), unread '+pct(sents.length-la.length,sents.length)+'%');
 if(B){
  var lb=sents.filter(function(s){return lit(B,s);});
  console.log('  lit, before        '+lb.length+' ('+pct(lb.length,sents.length)+'%), unread '+pct(sents.length-lb.length,sents.length)+'%');
  var set={}; lb.forEach(function(s){set[s]=1;});
  var fresh=la.filter(function(s){return !set[s];});
  console.log('  newly lit          '+fresh.length);
  var seed=7, pick=[]; function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
  var pool=fresh.slice(); while(pick.length<Math.min(+(process.env.SAMPLE||40),pool.length)){
   pick.push(pool.splice(Math.floor(rnd()*pool.length),1)[0]);}
  console.log('  a seeded sample of the newly lit, to be read by a person:');
  pick.forEach(function(s){console.log('    '+s.slice(0,150)+'  ['+words(A,s)+']');});}}
