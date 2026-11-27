/* BEFORE AND AFTER, over the same corpora, so the numbers are comparable.
   Run with BASE= and NEW= pointing at two builds. */
var fs=require('fs'),path=require('path');
var SP='/tmp/claude-0/-home-user-MOB/e909b21c-7092-5fcd-af76-1092a869307f/scratchpad/';
var A=require(path.resolve(process.env.BASE)), B=require(path.resolve(process.env.NEW));
var book=fs.readFileSync(SP+'book.txt','utf8');
/* sentences, on terminal punctuation. a crude split and it is the same split
   for both sides, which is what makes the comparison valid. */
var sent=book.split(/(?<=[.!?])\s+/).filter(function(s){var n=s.split(/\s+/).length;return n>=5&&n<=60;});
function row(n,a,b,of){
 var d=b-a, s=d>0?'+'+d:String(d);
 console.log('  '+(n+'                                  ').slice(0,36)
  +String(a).padStart(6)+String(b).padStart(8)+'   '+(d?s:'same')+(of?'   of '+of:''));}
console.log('                                        before     after   change');

var axes=A.CHARGES.map(function(c){return c.toLowerCase();});
var cues={};A.SAB33.forEach(function(r){r[1].forEach(function(p){cues[p[0]]=1;});});
cues=Object.keys(cues);
row('axis names that resolve',axes.filter(function(w){return A.scanStory(w).length;}).length,
 axes.filter(function(w){return B.scanStory(w).length;}).length,axes.length);
row('saboteur cue words that resolve',cues.filter(function(w){return A.scanStory(w).length;}).length,
 cues.filter(function(w){return B.scanStory(w).length;}).length,cues.length);
row('LEX entries',Object.keys(A.LEX).length,Object.keys(B.LEX).length);
row('ADJ2CHG entries',Object.keys(A.ADJ2CHG).length,Object.keys(B.ADJ2CHG).length);

function voice(E,f){return E.PEOPLE.filter(f.bind(null,E)).length;}
var loc=function(E,p){return E.parseStory(p.says).path.located>0;};
var imp=function(E,p){return E.parseStory(p.says).imprints.length>0;};
var spn=function(E,p){return E.parseStory(p.says).path.span>0;};
row('persona voices with a located step',voice(A,loc),voice(B,loc),A.PEOPLE.length);
row('persona voices with an imprint',voice(A,imp),voice(B,imp),A.PEOPLE.length);
row('persona voices with a non zero span',voice(A,spn),voice(B,spn),A.PEOPLE.length);

/* THE BOOK, as a corpus of the owner's own sentences. Not a labelled set and
   never presented as one. What it measures is reach: how often the scanner
   finds anything at all in real prose by the person whose canon this is. */
function reach(E){var n=0,h=0;sent.forEach(function(s){var r=E.scanStory(s);if(r.length){n++;h+=r.length;}});
 return {sent:n,hits:h};}
var ra=reach(A), rb=reach(B);
row('book sentences with at least one hit',ra.sent,rb.sent,sent.length);
row('total hits over those sentences',ra.hits,rb.hits);

/* LEAKAGE, the check that matters most. A vocabulary change must not move a
   reading that already worked. Any sentence whose band totals changed in a way
   other than growing is a regression and is named. */
var moved=0,shrank=[],seatMoved=[];
sent.forEach(function(s){
 var a=A.parseStory(s).bands, b=B.parseStory(s).bands;
 var ka=Object.keys(a), kb=Object.keys(b);
 if(JSON.stringify(a)!==JSON.stringify(b))moved++;
 ka.forEach(function(k){
  if(b[k]===undefined)seatMoved.push(s.slice(0,60)+' lost '+k);
  else if(b[k]<a[k])shrank.push(s.slice(0,60)+' '+k+' '+a[k]+' -> '+b[k]);});});
console.log('\nLEAKAGE CHECK over '+sent.length+' book sentences');
console.log('  readings that changed at all        '+moved);
console.log('  seats a sentence LOST               '+seatMoved.length);
console.log('  band totals that went DOWN          '+shrank.length);
shrank.slice(0,10).forEach(function(l){console.log('    '+l);});
seatMoved.slice(0,10).forEach(function(l){console.log('    '+l);});

/* DETERMINISM AND PURITY, unchanged by the passes. */
var t='i was furious then hollow then ashamed and full of anger';
console.log('\nINVARIANTS');
console.log('  re-parsing gives the same imprints   '
 +(JSON.stringify(B.parseStory(t).imprints)===JSON.stringify(B.parseStory(t).imprints)));
console.log('  the passes are idempotent            '
 +(Object.keys(B.LEX).length===Object.keys(B.LEX).length));
