/* ============================================================
   THE SAME TWO EDGE RULES, MEASURED ON THE POPULATION THIS REPOSITORY
   ACTUALLY HAS, rather than on uniform noise.

   Uniform random fields over nine axes are not a cohort. They put every axis
   independently anywhere in 0 to 10, which no body does, and they make
   saboteurs tie at the top constantly, so a rank agreement measured on them is
   mostly measuring tie-breaking. The 14 reference profiles in people.js are a
   real population of stated fields with an owner. Small, and stated rather
   than sampled, so it is not a validation set and is not called one. It is the
   only population here that is not invented by the probe.

   THIS PROBE CANNOT REPRODUCE THE SPEC'S 94 AND 73. Those need the cohort they
   were measured on and it is not in this repository. What is reported is what
   this seat can stand behind, with the definition stated beside each number.
   ============================================================ */
var R=require('./ramp.js'), SPECBANDS=require('./bands.js');
var E=require('/home/user/MOB/engine.js');
var PEOPLE=E.PEOPLE;
var AXMAP={Fear:'fear',Anger:'anger',Shame:'shame',Disgust:'disgust',Apathy:'apathy',
 Shock:'shock',Sad:'sadness',Surprise:'surprise',Anticipation:'anticipation'};
function fieldOf(p){var L={};Object.keys(AXMAP).forEach(function(k){L[AXMAP[k]]=(p.c&&p.c[k])||0;});return L;}
function rng(seed){var s=seed;return function(){s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff;};}

function selfCheck(){
 var bad=R.selfCheck();
 if(PEOPLE.length<10)bad.push('the roster is smaller than the probe assumes');
 var L=fieldOf(PEOPLE.find(function(p){return p.nm==='Ana';}));
 if(!(L.fear===9&&L.sadness===9))bad.push('Ana does not read as people.js states her, so the mapping is wrong');
 var R0=fieldOf(PEOPLE.find(function(p){return p.nm==='Rosa';}));
 if(Object.keys(R.score(SPECBANDS,R0,R.fitRamp)).filter(function(k){
   return R.score(SPECBANDS,R0,R.fitRamp)[k]>=0.6;}).length>3)
  bad.push('an empty field fires more than three saboteurs, so the floor is wrong');
 return bad;}

if(require.main===module){
 var bad=selfCheck();
 if(bad.length){console.log('PROBE REFUSES TO RUN');bad.forEach(function(b){console.log('  '+b);});process.exit(1);}
 console.log('known good check passed\n');

 console.log('1 · AGREEMENT ON THE 14 STATED PROFILES, off by one point.');
 console.log('    each profile jittered 400 ways, top 3 by confidence.\n');
 console.log('    profile      hard edge   ramp');
 var ts=0,tr=0;
 PEOPLE.forEach(function(p){
  var base=fieldOf(p), r=rng(4242), s=0,m=0, n=400;
  for(var i=0;i<n;i++){
   var B={};Object.keys(base).forEach(function(a){
    B[a]=Math.max(0,Math.min(10,base[a]+(Math.floor(r()*3)-1)));});
   s+=R.setAgree?0:0;
   var sa=R.score(SPECBANDS,base,R.fitStair), sb=R.score(SPECBANDS,B,R.fitStair);
   var ra=R.score(SPECBANDS,base,R.fitRamp ), rb=R.score(SPECBANDS,B,R.fitRamp );
   s+=agree(R.topN(sa,3),R.topN(sb,3));
   m+=agree(R.topN(ra,3),R.topN(rb,3));}
  s=s/n*100;m=m/n*100;ts+=s;tr+=m;
  console.log('    '+p.nm.padEnd(13)+s.toFixed(1).padEnd(12)+m.toFixed(1));});
 console.log('    '+'MEAN'.padEnd(13)+(ts/PEOPLE.length).toFixed(1).padEnd(12)+
  (tr/PEOPLE.length).toFixed(1));

 console.log('\n2 · AVOIDER. the spec says it fires in 81 percent of runs and');
 console.log('    should be weighted low. measured on the ported bands.\n');
 var fired={}, runs=0, r2=rng(77), ROWS=SPECBANDS.map(function(x){return x[0];});
 PEOPLE.forEach(function(p){var base=fieldOf(p);
  for(var i=0;i<600;i++){runs++;
   var B={};Object.keys(base).forEach(function(a){
    B[a]=Math.max(0,Math.min(10,base[a]+(Math.floor(r2()*3)-1)));});
   var sc=R.score(SPECBANDS,B,R.fitRamp);
   R.topN(sc,3).forEach(function(k){fired[k]=(fired[k]||0)+1;});}});
 var rank=ROWS.slice().sort(function(a,b){return (fired[b]||0)-(fired[a]||0);});
 console.log('    the ten that reach the top three most often, of '+runs+' runs');
 rank.slice(0,10).forEach(function(k){
  console.log('    '+k.padEnd(18)+((fired[k]||0)/runs*100).toFixed(1)+' percent');});
 console.log('\n    Avoider reaches the top three in '+((fired.Avoider||0)/runs*100).toFixed(1)+
  ' percent of runs on this population.');

 console.log('\n3 · WHAT THE PORT MOVES. saboteurs on each stated profile,');
 console.log('    shipped bands and staircase against ported bands and ramp.\n');
 console.log('    profile      shipped top 3                      ported top 3');
 var OLD=E.SAB33.map(function(r){return [r[0],r[1].map(function(p){
  return [p[0]==='anxiety'?'anticipation':p[0],p[1],p[2]];})];});
 PEOPLE.forEach(function(p){var L=fieldOf(p);
  var a=R.topN(R.score(OLD,L,R.fitStair),3).join(', ')||'(none)';
  var b=R.topN(R.score(SPECBANDS,L,R.fitRamp),3).join(', ')||'(none)';
  console.log('    '+p.nm.padEnd(13)+a.padEnd(35)+b);});}

function agree(a,b){var set={};a.concat(b).forEach(function(k){set[k]=1;});
 var all=Object.keys(set);if(!all.length)return 1;
 return all.filter(function(k){return a.indexOf(k)>=0&&b.indexOf(k)>=0;}).length/all.length;}
module.exports={fieldOf:fieldOf,selfCheck:selfCheck,agree:agree};
