/* PROBE. Measures the sniffer's reach before any change. Checked against a
   known good case first: the repository has been bitten three times by a
   probe reporting its own bug. */
var path=require('path');
var E=require(path.resolve(process.env.ENGINE||'engine.js'));

function chk(name,cond,detail){
 console.log((cond?'  ok   ':'  BAD  ')+name+(detail?'  '+detail:''));
 if(!cond)process.exitCode=1;}

console.log('PROBE CHECKED AGAINST KNOWN GOOD CASES');
chk('a word that is in the table is found',E.scanStory('i was furious').length>0,
 JSON.stringify(E.scanStory('i was furious').map(h=>h.t)));
chk('a word that is not in the table is not found',E.scanStory('i was xyzzy').length===0);
chk('a phrase outranks its own words',
 E.scanStory('i felt flattened me afterwards').some(h=>h.kind==='phrase'));
chk('the same text twice gives the same hits',
 JSON.stringify(E.scanStory('i was furious and numb'))===JSON.stringify(E.scanStory('i was furious and numb')));

var single=Object.keys(E.LEX).filter(w=>w.indexOf(' ')<0);
var multi=Object.keys(E.LEX).filter(w=>w.indexOf(' ')>=0);
var phrases=[];E.PHRASES.forEach(r=>{phrases=phrases.concat(r[0]);});
console.log('\nTHE TABLES');
console.log('  LEX             '+Object.keys(E.LEX).length+' entries, '+single.length+' single word, '+multi.length+' multi word');
console.log('  PHRASES         '+E.PHRASES.length+' rows carrying '+phrases.length+' phrases');
console.log('  ADJ2CHG         '+Object.keys(E.ADJ2CHG).length+' adjectives');
console.log('  CHARGES         '+E.CHARGES.length+' axes');

function res(w){return E.scanStory(w).length;}
var axes=E.CHARGES.map(c=>c.toLowerCase());
var cues={};E.SAB33.forEach(r=>r[1].forEach(p=>{cues[p[0]]=1;}));
cues=Object.keys(cues);
var axeOk=axes.filter(res), cueOk=cues.filter(res);
console.log('\nTHE CANON THE INSTRUMENT IS BUILT ON');
console.log('  axis names that resolve       '+axeOk.length+' of '+axes.length+'   present: '+JSON.stringify(axeOk));
console.log('  saboteur cues that resolve    '+cueOk.length+' of '+cues.length+'   present: '+JSON.stringify(cueOk));
console.log('  saboteurs named in SAB33      '+E.SAB33.length);

console.log('\nTHE FOURTEEN PERSONA VOICES');
var located=0,imp=0,span=0;
E.PEOPLE.forEach(p=>{var r=E.parseStory(p.says);
 if(r.path.located>0)located++; if(r.imprints.length)imp++; if(r.path.span>0)span++;});
console.log('  at least one located step     '+located+' of '+E.PEOPLE.length);
console.log('  at least one imprint          '+imp+' of '+E.PEOPLE.length);
console.log('  a non zero span               '+span+' of '+E.PEOPLE.length);

console.log('\nWHAT THE CHAIN DOES NOT READ');
function seatsOf(t){return E.parseStory(t).imprints.map(i=>i.band+'/'+i.fetter).join(' ');}
var pairs=[
 ['negation',    'i was angry',                'i was not angry'],
 ['attribution', 'i shouted at him',           'he shouted at me'],
 ['tense',       'i panic every day',          'i used to panic and i do not any more'],
 ['intensity',   'i was a bit sad',            'i was unbearably sad'],
 ['hypothetical','i am afraid',                'i am not afraid but i could be afraid']];
pairs.forEach(function(p){
 var a=E.parseStory(p[1]), b=E.parseStory(p[2]);
 var same=JSON.stringify(a.bands)===JSON.stringify(b.bands);
 console.log('  '+(p[0]+'            ').slice(0,13)+(same?'NOT READ ':'read     ')
  +JSON.stringify(a.bands)+' vs '+JSON.stringify(b.bands));});

console.log('\nWHETHER THE PRODUCT CAN SHOW A PERSON ITS OWN EVIDENCE');
var orig='I was FURIOUS, and then, numb.';
var h=E.scanStory(orig);
console.log('  text            '+JSON.stringify(orig));
h.forEach(function(x){
 console.log('  hit '+JSON.stringify(x.t)+' at offset '+x.at
  +'  original slice at that offset: '+JSON.stringify(orig.substr(x.at,x.t.length+2)));});
