/* ============================================================
   proto/quotients/measure.js  ·  THE HEADLESS RUN.

   Every table in DESIGN-quotients.md came out of this file. Run it and the
   numbers are current; read them out of the document and they are dated.

     node proto/quotients/measure.js

   It loads the real engine at ../../engine.js, builds an actual profile record
   for every roster persona, pushes each one through the import boundary, and
   prints the five readings, the two ablations, the Gordon and Tomas separation
   and Ana across three readings.
   ============================================================ */
var E=require('../../engine.js');
var Q=require('./quotients.js');
var R=require('./roster.js');
var bound=Q.bind(E);
R.bindMemory(E);

function f(v){return v==null?'unread':Number(v).toFixed(1);}
function pad(s,n){s=String(s);while(s.length<n)s+=' ';return s;}
function rpad(s,n){s=String(s);while(s.length<n)s=' '+s;return s;}
function line(cells,w){return cells.map(function(c,i){
 return i?rpad(c,w[i]):pad(c,w[i]);}).join('  ');}

console.log('engine bound. addresses that can hold: '+bound.reach+
 '. open ceiling read off compute(): '+bound.openMax.toFixed(2)+'\n');

/* ---- 1. the roster ---- */
var W=[9,10,9,7,7,7,11,10,9];
var head=['person','coherence','aperture','turn','release','boundary','tier','narrowest','carrying'];
console.log('THE ROSTER');
console.log(line(head,W));
var rows=[];
[null].concat(E.PEOPLE).forEach(function(per){
 var o=R.run(E,per);
 if(o.errs){console.log(pad(per?per.nm:'Nobody',9)+'  REFUSED: '+o.errs.join('; '));return;}
 var q=Q.quotients(o.p,o.r);
 rows.push({nm:per?per.nm:'Nobody', q:q, r:o.r});
 function c(x){return x.unread||x.pct==null?'unread':f(x.pct);}
 console.log(line([per?per.nm:'Nobody', c(q.cq), c(q.iq), c(q.eq), c(q.aq), c(q.pq),
  q.cq.unread?'unread':q.cq.tier, q.iq.narrow?q.iq.narrow.b:'flat',
  String(o.r.carrying.length)],W));});

/* ---- 2. is the aperture coherence restated ---- */
function synth(charge,law,rep){
 var per={nm:'synth',dom:0,a1:0,a2:1,c:{},rep:{}};
 E.CHARGES.forEach(function(c){per.c[c]=charge;per.rep[c]=rep;});
 var p=R.profileFor(E,per);
 E.SINAMES.forEach(function(l){p.laws[l]=law;});
 E.gatesClear();
 var got=E.pImport(JSON.stringify(p));
 if(!got)throw new Error('refused: '+(E.importError()||[]).join('; '));
 var r=E.compute();
 return {q:Q.quotients(got,r), r:r};}

function sweep(title,vals,make){
 console.log('\n'+title);
 var a=['             '],b=['coherence    '],c=['aperture, raw'],
     c2=['aperture     '],d=['turn         '],e=['overshoot    '];
 vals.forEach(function(v){var s=make(v);
  var raw=Math.max(0,Math.min(1,s.q.iq.area*s.q.iq.rec.f))*100;
  a.push(rpad(String(v),7)); b.push(rpad(f(s.q.cq.pct),7));
  c.push(rpad(f(raw),7)); c2.push(rpad(f(s.q.iq.pct),7));
  d.push(rpad(f(s.q.eq.pct),7)); e.push(rpad(f(s.r.JQ),7));});
 /* aperture, raw is before overshoot is subtracted. the two rows are printed
    together because the gap between them IS the argument for the term. */
 [a,b,c,c2,d,e].forEach(function(x){console.log(x.join(''));});}

sweep('LAWS HELD AT SIX, CHARGE SWEPT',[0,1,2,3,4,5,6,7,8,9,10],
 function(v){return synth(v,6,0);});
sweep('CHARGE HELD AT FOUR, LAWS SWEPT',[1,2,3,4,5,6,7,8,9,10],
 function(v){return synth(4,v,0);});
sweep('CHARGE FOUR AND LAWS SIX, THE OPPOSITE SWEPT',[0,2,4,6,7,8,9,10],
 function(v){return synth(4,6,v);});

function corr(a,b){var n=a.length,ma=0,mb=0,i;
 for(i=0;i<n;i++){ma+=a[i];mb+=b[i];} ma/=n; mb/=n;
 var sa=0,sb=0,sab=0;
 for(i=0;i<n;i++){sa+=Math.pow(a[i]-ma,2);sb+=Math.pow(b[i]-mb,2);sab+=(a[i]-ma)*(b[i]-mb);}
 return sab/Math.sqrt(sa*sb);}
var u=rows.filter(function(x){return !x.q.cq.unread&&x.q.eq.pct!=null;});
console.log('\nCORRELATION ACROSS THE ROSTER, WHICH IS A PROPERTY OF THE ROSTER');
console.log('  n '+u.length+
 '  coherence to aperture '+corr(u.map(function(x){return x.q.cq.pct;}),u.map(function(x){return x.q.iq.pct;})).toFixed(3)+
 '  coherence to turn '+corr(u.map(function(x){return x.q.cq.pct;}),u.map(function(x){return x.q.eq.pct;})).toFixed(3));
console.log('  the two sweeps above are what settle it. a correlation across');
console.log('  fourteen personas built as coherent characters is not evidence.');

/* ---- 3. what load alone cannot see ---- */
var VOICE={
 Gordon:'There is nothing wrong with me. I did not see any of it coming and I had no idea anybody was unhappy. I chose not to look.',
 Tomas:'I noticed it first in my hands on the ramp. I could feel the dread before the engine turned over. I was aware of it every morning and I kept going.'};
console.log('\nWHAT LOAD ALONE CANNOT SEE');
console.log(line(['person','load only','cues','factor','with words'],[9,10,6,8,11]));
['Gordon','Tomas'].forEach(function(nm){
 var per=E.PEOPLE.filter(function(p){return p.nm===nm;})[0];
 var o=R.run(E,per);
 var a=Q.quotients(o.p,E.compute());
 E.verpApply(VOICE[nm]);
 var b=Q.quotients(o.p,E.compute());
 console.log(line([nm,f(a.iq.pct),String(b.iq.rec.n),b.iq.rec.f.toFixed(2),f(b.iq.pct)],
  [9,10,6,8,11]));});

/* ---- 4. ana, across three readings ---- */
console.log('\nANA, ACROSS THREE READINGS');
var AW=[13,10,8,9,9,6,8,7,9];
console.log(line(['reading','coherence','ceiling','headroom','aperture','turn','release','weight','carrying'],AW));
var ana=E.PEOPLE.filter(function(p){return p.nm==='Ana';})[0];
var o=R.run(E,ana), p=o.p, r=E.compute();
p.history=[E.snapshot(p)];
function say(lbl){
 var q=Q.quotients(p,r);
 console.log(line([lbl,f(q.cq.pct),f(E.cqCeiling()),f(E.cqHeadroom(r.CQ)),
  f(q.iq.pct),f(q.eq.pct),q.aq.unread?q.aq.state:f(q.aq.pct),f(r.DQ),
  String(r.carrying.length)],AW));}
say('first reading');
[2,3].forEach(function(d,i){
 E.CHARGES.forEach(function(c){E.S.charge[c]=Math.max(0,E.S.charge[c]-d);});
 r=E.compute(); p.history.push(E.snapshot(p));
 say('after run '+(i+1));});
console.log('\nthe release control\'s own arithmetic lives in ui/release.js and is not');
console.log('reproduced here. charge comes off the axes, which is what it does to the field.');
