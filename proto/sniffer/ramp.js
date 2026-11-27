/* ============================================================
   THE BAND EDGE MEASUREMENT.

   The spec rules that a band edge is a ramp and not a cliff, and prices the
   ruling: a hard edge scores 94 percent on exact readings and collapses to 73
   percent when the reader is off by one point. This probe reproduces that
   measurement, because a number inherited is a number nobody checked.

   WHAT THE NUMBER IS, IN ONE SENTENCE. There is no labelled set and there is
   not going to be one, so this is not accuracy. It is AGREEMENT: the saboteur
   set read at a stated field against the set read at the same field off by one
   point, which the spec itself calls the normal condition of a reader. A
   detector that answers differently when the reading moves by less than the
   instrument's own resolution is reporting its own quantisation as a finding.

   Agreement is Jaccard over the firing sets, |A and B| / |A or B|, because the
   product shows a SET of saboteurs and not a single winner. Empty against
   empty scores 1: both readings agreed that nothing fired.

   KNOWN GOOD CHECK FIRST. Two of them, in both directions, and the probe
   refuses to run if either fails. A tool that lies is worse than no tool.
   ============================================================ */
var SPECBANDS=require('./bands.js');

/* ---------- the two detectors, same input, same output shape ---------- */

/* AS SHIPPED. core.js sab33Detect, lifted verbatim in its arithmetic so this
   measures the shipped rule and not a paraphrase of it. Note Math.round: the
   level is quantised to an integer BEFORE the band is read, so 6.9 and 7.1 are
   in fact the same answer and the spec's own example is not quite the defect.
   The cliff is real, it just sits at x.5 rather than at the band edge. */
function fitStair(lvl,lo,hi){
 var v=Math.round(lvl);
 if(v>=lo&&v<=hi) return 1;
 if(v===lo-1||v===hi+1) return 0.5;
 return 0;}

/* THE RAMP. Three properties the spec asks for by name, and nothing else.

   1. NO QUANTISATION. The level is read as given. This alone removes the x.5
      cliff, and it is the whole of the "6.9 and 7.1" complaint.
   2. IT PEAKS INSIDE THE BAND. Full membership at the band's midpoint, falling
      to SAB_EDGE at either edge. Flat-inside was the shipped behaviour and it
      cannot express "peaks inside", which the spec states outright.
   3. IT TAPERS, AND FURTHER ABOVE THAN BELOW. The spec says "tapers above it".

   Every width has a reason or it is a magic number.

   SAB_EDGE 0.75      membership at the band edge. not 1, because a peak needs
                      somewhere to fall to, and not lower, because the edge is
                      inside the band the canon states and must not read as
                      half-absent.
   SAB_BELOW 2        points below the low edge before membership reaches zero.
                      Two, so that a reading ONE point under the band, which
                      the spec calls the normal error, keeps half the
                      membership it would have at the edge. One would put the
                      normal error at zero, which is the failure being fixed.
   SAB_ABOVE 3        points above the high edge before zero. Wider than below,
                      on the spec's own asymmetry. The reason it is asymmetric:
                      the low edge is a threshold of PRESENCE, and under it the
                      configuration has not formed. The high edge is a
                      threshold of DISPLACEMENT, and over it the configuration
                      has formed and is being overrun by a heavier one, so the
                      evidence decays rather than never arriving. */
var SAB_EDGE=0.75, SAB_BELOW=2, SAB_ABOVE=3;
function fitRamp(lvl,lo,hi){
 var m=(lo+hi)/2, h=(hi-lo)/2;
 if(lvl>=lo&&lvl<=hi)
  return h>0?1-(1-SAB_EDGE)*Math.abs(lvl-m)/h:1;
 if(lvl<lo) return Math.max(0,SAB_EDGE*(1-(lo-lvl)/SAB_BELOW));
 return Math.max(0,SAB_EDGE*(1-(lvl-hi)/SAB_ABOVE));}

/* COMBINING THE PARTS. The shipped rule takes the arithmetic mean, and the
   spec's own sentence refuses it: "a saboteur is a configuration of fetters at
   specific intensities. Break the co-mingling and the saboteur is gone." An
   arithmetic mean cannot go: on a three part row, 1 and 1 and 0 averages 0.67
   and fires with one fetter entirely absent. The spec's ported table has five
   three part rows where the shipped one had none, so this stopped being
   academic with the port. The geometric mean is zero on any absent part, which
   is what "break it and it is gone" means arithmetically. */
function fitAll(parts,L,fit){
 var p=1;
 for(var i=0;i<parts.length;i++){
  var f=fit(L[parts[i][0]]||0,parts[i][1],parts[i][2]);
  if(f<=0) return 0;
  p*=f;}
 return Math.pow(p,1/parts.length);}

var FLOOR=0.6;   /* fires at or above. the shipped threshold, kept, so the
                    measurement isolates the edge rule and changes nothing
                    else. */
function detect(table,L,fit){
 var out={};
 table.forEach(function(r){
  var s=fitAll(r[1],L,fit);
  if(s>=FLOOR) out[r[0]]=s;});
 return out;}

function jaccard(a,b){
 var ka=Object.keys(a), kb=Object.keys(b), set={};
 ka.forEach(function(k){set[k]=1;});kb.forEach(function(k){set[k]=1;});
 var all=Object.keys(set);
 if(!all.length) return 1;
 var both=all.filter(function(k){return a[k]!==undefined&&b[k]!==undefined;});
 return both.length/all.length;}

/* ---------- the known good check, both directions ---------- */
function selfCheck(){
 var bad=[];
 /* a detector must agree with itself perfectly. if this fails the harness is
    broken and every number after it is noise. */
 var L={fear:7,anger:6,apathy:5,shame:4,disgust:5,shock:3,sadness:6,surprise:0,anticipation:6};
 if(jaccard(detect(SPECBANDS,L,fitStair),detect(SPECBANDS,L,fitStair))!==1)
  bad.push('stair does not agree with itself');
 if(jaccard(detect(SPECBANDS,L,fitRamp),detect(SPECBANDS,L,fitRamp))!==1)
  bad.push('ramp does not agree with itself');
 /* and it must DISAGREE with a field that shares nothing. a harness that
    always returns 1 would pass the check above and measure nothing. */
 var hi={fear:10,anger:9,apathy:8,shame:7,disgust:8,shock:7,sadness:8,surprise:0,anticipation:7};
 var lo={fear:0,anger:0,apathy:0,shame:0,disgust:0,shock:0,sadness:0,surprise:0,anticipation:0};
 if(jaccard(detect(SPECBANDS,hi,fitRamp),detect(SPECBANDS,lo,fitRamp))>=1)
  bad.push('ramp agrees a full field with an empty one');
 /* the ramp must be continuous where the stair is not. this is the whole
    claim, so it is checked rather than assumed. */
 if(!(Math.abs(fitRamp(6.49,7,9)-fitRamp(6.51,7,9))<0.02))
  bad.push('ramp is not continuous across x.5');
 if(!(fitStair(6.49,7,9)!==fitStair(6.51,7,9)))
  bad.push('stair is continuous across x.5, so there is nothing to fix');
 /* and it must peak inside the band rather than sitting flat across it */
 if(!(fitRamp(8,7,9)>fitRamp(7,7,9)))bad.push('ramp does not peak inside the band');
 if(!(fitStair(8,7,9)===fitStair(7,7,9)))bad.push('stair is not flat inside the band');
 return bad;}

/* ---------- the measurement ---------- */
var AX=['fear','anger','shame','disgust','apathy','shock','sadness','surprise','anticipation'];
function rng(seed){var s=seed;return function(){s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff;};}

/* CONFIDENCE, not a boolean. Every row gets a number and nothing is discarded,
   because the discarding is where the cliff went. See the finding below. */
function score(table,L,fit){
 var out={};
 table.forEach(function(r){out[r[0]]=fitAll(r[1],L,fit);});
 return out;}

/* WHAT THE PERSON SEES. The product shows a handful of saboteurs in rank
   order, not everything over a line, so the agreement that matters is
   agreement on the top N. */
function topN(sc,n){
 return Object.keys(sc).filter(function(k){return sc[k]>0;})
  .sort(function(a,b){return sc[b]-sc[a];}).slice(0,n);}
function setAgree(a,b){
 var set={};a.concat(b).forEach(function(k){set[k]=1;});
 var all=Object.keys(set);
 if(!all.length) return 1;
 return all.filter(function(k){return a.indexOf(k)>=0&&b.indexOf(k)>=0;}).length/all.length;}

/* RESOLUTION. The largest jump in confidence any one tenth of a point of input
   can cause. This is the claim under "no practitioner reads a body to a tenth
   of a point" and it needs no cohort to measure, which is why it is the number
   this seat trusts most. */
function resolution(table,fit){
 var worst=0, at=null;
 table.forEach(function(r){
  r[1].forEach(function(p){
   for(var v=0;v<=10;v+=0.1){
    var a=fit(Math.round(v*10)/10,p[1],p[2]), b=fit(Math.round((v+0.1)*10)/10,p[1],p[2]);
    if(Math.abs(a-b)>worst){worst=Math.abs(a-b);at=r[0]+' '+p[0]+' at '+v.toFixed(1);}}});});
 return {worst:worst, at:at};}

function run(n,seed,jitter,N){
 var r=rng(seed), st={set:0,conf:0}, rm={set:0,conf:0};
 for(var i=0;i<n;i++){
  var A={},B={};
  AX.forEach(function(a){
   var v=Math.round(r()*10*10)/10;
   A[a]=v;
   B[a]=Math.max(0,Math.min(10,v+(Math.floor(r()*3)-1)*jitter));});
  var sa=score(SPECBANDS,A,fitStair), sb=score(SPECBANDS,B,fitStair);
  var ra=score(SPECBANDS,A,fitRamp ), rb=score(SPECBANDS,B,fitRamp );
  st.set+=setAgree(topN(sa,N),topN(sb,N));
  rm.set+=setAgree(topN(ra,N),topN(rb,N));
  var ks=Object.keys(sa);
  st.conf+=ks.reduce(function(x,k){return x+Math.abs(sa[k]-sb[k]);},0)/ks.length;
  rm.conf+=ks.reduce(function(x,k){return x+Math.abs(ra[k]-rb[k]);},0)/ks.length;}
 return {stairSet:st.set/n*100, rampSet:rm.set/n*100,
         stairConf:st.conf/n, rampConf:rm.conf/n};}

/* AND THE MEASUREMENT THAT FOUND THE DEFECT. A boolean firing set behind a
   hard confidence floor. Kept, because it is the reason the design changed. */
function runFloor(n,seed,jitter){
 var r=rng(seed), st=0, rm=0;
 for(var i=0;i<n;i++){
  var A={},B={};
  AX.forEach(function(a){var v=Math.round(r()*10*10)/10;A[a]=v;
   B[a]=Math.max(0,Math.min(10,v+(Math.floor(r()*3)-1)*jitter));});
  st+=jaccard(detect(SPECBANDS,A,fitStair),detect(SPECBANDS,B,fitStair));
  rm+=jaccard(detect(SPECBANDS,A,fitRamp ),detect(SPECBANDS,B,fitRamp ));}
 return {stair:st/n*100, ramp:rm/n*100};}

if(require.main===module){
 var bad=selfCheck();
 if(bad.length){console.log('PROBE REFUSES TO RUN');bad.forEach(function(b){console.log('  '+b);});process.exit(1);}
 console.log('known good check passed, both directions\n');

 console.log('1 · RESOLUTION. largest change in confidence one tenth of a point');
 console.log('     of input can cause. no cohort needed.');
 var rs=resolution(SPECBANDS,fitStair), rr=resolution(SPECBANDS,fitRamp);
 console.log('     hard edge  '+rs.worst.toFixed(4)+'   at '+rs.at);
 console.log('     ramp       '+rr.worst.toFixed(4)+'   at '+rr.at);
 console.log('     the ramp is '+(rs.worst/rr.worst).toFixed(0)+' times finer.\n');

 console.log('2 · THE MEASUREMENT THAT FOUND THE DEFECT. agreement on the');
 console.log('     BOOLEAN firing set behind a hard floor at '+FLOOR+'.');
 console.log('     jitter    hard edge    ramp');
 [0,0.5,1,2].forEach(function(j){var m=runFloor(4000,12345,j);
  console.log('     '+String(j).padEnd(10)+m.stair.toFixed(1).padEnd(13)+m.ramp.toFixed(1));});
 console.log('     THE RAMP IS WORSE HERE, and that is the finding. A ramp');
 console.log('     inside the membership does nothing while the OUTPUT is');
 console.log('     still a cliff: the edge simply moved to the floor.\n');

 console.log('3 · THE SAME FIELDS, OUTPUT AS RANKED CONFIDENCE, TOP 3.');
 console.log('     no boolean, nothing discarded, which is the design that ships.');
 console.log('     jitter    hard edge    ramp    ramp gains');
 [0,0.5,1,2].forEach(function(j){var m=run(4000,12345,j,3);
  console.log('     '+String(j).padEnd(10)+m.stairSet.toFixed(1).padEnd(13)+
   m.rampSet.toFixed(1).padEnd(8)+(m.rampSet-m.stairSet>=0?'+':'')+
   (m.rampSet-m.stairSet).toFixed(1));});

 console.log('\n4 · MEAN ABSOLUTE MOVE IN CONFIDENCE, per saboteur, 0 to 1.');
 console.log('     jitter    hard edge    ramp    ramp steadier by');
 [0.5,1,2].forEach(function(j){var m=run(4000,12345,j,3);
  console.log('     '+String(j).padEnd(10)+m.stairConf.toFixed(4).padEnd(13)+
   m.rampConf.toFixed(4).padEnd(8)+
   ((1-m.rampConf/m.stairConf)*100).toFixed(0)+' percent');});

 console.log('\n5 · HAS IT STOPPED MOVING. jitter 1, top 3, growing n.');
 [250,500,1000,2000,4000,8000,16000].forEach(function(n){var m=run(n,999,1,3);
  console.log('     n='+String(n).padEnd(8)+'hard '+m.stairSet.toFixed(1)+'   ramp '+m.rampSet.toFixed(1));});}

module.exports={fitStair:fitStair,fitRamp:fitRamp,fitAll:fitAll,detect:detect,
 jaccard:jaccard,selfCheck:selfCheck,run:run,runFloor:runFloor,score:score,
 topN:topN,resolution:resolution,SAB_EDGE:SAB_EDGE,
 SAB_BELOW:SAB_BELOW,SAB_ABOVE:SAB_ABOVE,FLOOR:FLOOR};
