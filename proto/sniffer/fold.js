/* THE FOLD, prototyped and measured before it is built. Generates ordinary
   surface forms of the authored keys by named rule, then reports what each
   rule buys and what it costs. */
var path=require('path'), fs=require('fs');
var E=require(path.resolve(process.env.ENGINE||'engine.js'));
var book=fs.readFileSync('/tmp/claude-0/-home-user-MOB/e909b21c-7092-5fcd-af76-1092a869307f/scratchpad/book.txt','utf8').toLowerCase();
var bw={};book.replace(/[^a-z' ]+/g,' ').split(/\s+/).forEach(function(w){if(w)bw[w]=(bw[w]||0)+1;});
console.log('book corpus: '+Object.keys(bw).length+' distinct surface forms, '
 +Object.keys(bw).reduce(function(a,k){return a+bw[k];},0)+' tokens');

var VOW='aeiou';
/* each rule is [id, test, make]. stated, not inherited. */
var RULES=[
 ['s',    function(k){return !/(s|x|z|ch|sh)$/.test(k);},           function(k){return k+'s';}],
 ['es',   function(k){return /(s|x|z|ch|sh)$/.test(k);},            function(k){return k+'es';}],
 ['ies',  function(k){return /[^aeiou]y$/.test(k);},                function(k){return k.slice(0,-1)+'ies';}],
 ['ed',   function(k){return /[^ey]$/.test(k)&&!/ed$/.test(k);},    function(k){return k+'ed';}],
 ['d',    function(k){return /e$/.test(k);},                        function(k){return k+'d';}],
 ['ied',  function(k){return /[^aeiou]y$/.test(k);},                function(k){return k.slice(0,-1)+'ied';}],
 ['ing',  function(k){return /[^e]$/.test(k);},                     function(k){return k+'ing';}],
 ['eing', function(k){return /e$/.test(k);},                        function(k){return k.slice(0,-1)+'ing';}],
 /* backward, off a past participle already in the table */
 ['uned', function(k){return /[a-z]{3}ed$/.test(k);},               function(k){return k.slice(0,-2)+'ing';}],
 ['unedS',function(k){return /[a-z]{3}ed$/.test(k);},               function(k){return k.slice(0,-2)+'s';}],
 /* the noun of a feeling, which is the form a person writes in a report */
 ['ness', function(k){return /(y|ous|ful|less|ed|id|ent|ant)$/.test(k)===false&&/[a-z]{4}$/.test(k);},
          function(k){return k+'ness';}]];

var single=Object.keys(E.LEX).filter(function(w){return w.indexOf(' ')<0;});
var gen={}, perRule={};
single.forEach(function(k){
 RULES.forEach(function(r){
  if(!r[1](k))return;
  var f=r[2](k);
  if(E.LEX[f])return;                    /* already authored */
  if(!gen[f])gen[f]={from:k,rule:r[0]};
  perRule[r[0]]=perRule[r[0]]||[];perRule[r[0]].push(f);});});

var all=Object.keys(gen);
console.log('\nGENERATED FORMS, PER RULE, and how many of each the book confirms');
var keptAll=[], confAll=[];
Object.keys(perRule).forEach(function(r){
 var f=perRule[r], c=f.filter(function(w){return bw[w];});
 console.log('  '+(r+'      ').slice(0,7)+' generated '+String(f.length).padStart(4)
  +'   confirmed in the book '+String(c.length).padStart(3)
  +'   '+Math.round(100*c.length/f.length)+' percent');
 keptAll=keptAll.concat(f);confAll=confAll.concat(c);});
console.log('  TOTAL   generated '+String(all.length).padStart(4)+'   confirmed in the book '
 +String(all.filter(function(w){return bw[w];}).length).padStart(3));

/* WHAT THE FOLD COSTS. A generated form that is an English word meaning
   something else is a false positive. The corpus cannot tell us that, so the
   forms are printed for a human to refuse by name. */
console.log('\nCONFIRMED FORMS, which is what a book sourced fold would admit');
console.log('  '+all.filter(function(w){return bw[w];}).sort().join(' '));

console.log('\nFORMS THE BOOK DOES NOT CONFIRM, a sample of 60 of '+all.filter(function(w){return !bw[w];}).length);
console.log('  '+all.filter(function(w){return !bw[w];}).sort().slice(0,60).join(' '));
