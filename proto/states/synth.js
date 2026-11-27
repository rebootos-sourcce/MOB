/* ============================================================
   THE STACK. Prototype, round DK, 26 September.

   readStack(e) takes what spiritualOf already returns and composes the
   reading. It computes nothing astronomical: every sign, animal and element
   is the engine's own, so where the engine says null this says not read yet
   and draws no joint through it. Pure, so the same function prints the
   roster headless and renders the page.

   The first cut read every joint on push and hold alone. Run over the
   roster it put seven of nine people at two shears and Diane at four, a
   reading that says the same thing about everybody, which is noise. The
   western joints now read the way that system actually relates two signs,
   by how far apart they sit on the wheel, and shear falls to a quarter of
   joints. Measured, below, in roster.txt.
   ============================================================ */
function stCap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s;}
function stLow(s){return s?s.toLowerCase():s;}
/* the element and mode of a sign, off the engine's own ZSIGN table */
function stSignOf(nm,Z){var z=null;(Z||[]).forEach(function(x){if(x[2]===nm)z=x;});
 return z?{el:z[3],mode:z[4]}:{el:null,mode:null};}
function stLayers(e,Z){
 var L={};
 function west(k,nm){
  if(!nm){L[k]={k:k,open:true};return;}
  var s=stSignOf(nm,Z);
  L[k]={k:k,sign:nm,el:s.el,mode:s.mode,push:ST_PUSH[s.el],at:ST_WHEEL.indexOf(nm),
   line:(k==='sun'?ST_SUN:k==='moon'?ST_MOON:ST_RISE)[nm],
   ph:(k==='sun'?ST_SUN_PH:k==='moon'?ST_MOON_PH:ST_RISE_PH)[nm]};}
 west('sun',e.sun); west('moon',e.moon); west('rising',e.rising);
 /* a yang year pushes. the stem is the last digit of the year chineseYear
    returned, even stems are yang, and the animal always shares it */
 var yang=(((e.cyear%10)+10)%10)%2===0;
 L.year=e.chinese?{k:'year',animal:e.chinese,celem:e.celem,el:stLow(e.celem),push:yang?1:0,yang:yang,
  nm:e.celem+' '+stLow(e.chinese),
  line:ST_ANIMAL[e.chinese]+' '+ST_CELEM[e.celem]}:{k:'year',open:true};
 return L;}
/* the whole sign aspect between two western layers: 0 to 6 signs apart */
function stApart(a,b){var d=Math.abs(a.at-b.at)%12; return Math.min(d,12-d);}
function stJoint(a,b){
 if(!a||!b||a.open||b.open)return 'open';
 var d=stApart(a,b);
 return d===0?'flush':(d===2||d===4)?'braced':(d===1||d===5)?'offset':'shear';}
/* the clause that says what a joint is, in the two layers' own terms */
function stPair(a,b){
 var d=stApart(a,b);
 if(d===0)return stCap(ST_POS[a.k].nm)+' and '+stLow(ST_POS[b.k].nm)+' are both '+a.sign+'.';
 if(d===6)return a.sign+' and '+b.sign+' sit at opposite ends of one axis, so the two layers pull on the same rope from both ends.';
 return stCap(ST_POS_POL(a))+', and '+ST_POS_POL(b)+'.';}
function ST_POS_POL(l){return ST_POL[l.k][l.push];}
/* the direction of the layers standing on the ground: the majority of push
   and hold among those that were read. a tie has no direction. */
function stLean(L){
 var w=['moon','rising','sun'].map(function(k){return L[k];}).filter(function(l){return !l.open;});
 var p=w.filter(function(l){return l.push;}).length, h=w.length-p;
 return p===h?null:p>h?1:0;}
function readStack(e,Z){
 if(!e)return null;
 var L=stLayers(e,Z), O=ST_ORDER.map(function(k){return L[k];});
 var lean=stLean(L);
 var ground=(L.year.open||lean===null)?'open':(L.year.push===lean?'braced':'offset');
 var joints=[{a:'year',b:'moon',key:'ground',kind:ground},
  {a:'moon',b:'rising',key:'moon>rising',kind:stJoint(L.moon,L.rising)},
  {a:'rising',b:'sun',key:'rising>sun',kind:stJoint(L.rising,L.sun)},
  {a:'sun',b:'moon',key:'sun>moon',kind:stJoint(L.sun,L.moon)}];
 /* the headline: the year, then the body, the voice and the drive */
 var ph=[L.sun.ph,L.moon.ph,L.rising.ph].filter(Boolean);
 var head=(L.year.open?'':L.year.nm+'. ')+(ph.length?stCap(ph.join(', '))+'.':'');
 /* where it shears, and what that costs at that point in the circuit */
 var seams=joints.filter(function(j){return j.kind==='shear';}).map(function(j){
  var a=L[j.a], b=L[j.b];
  return {key:j.key, a:j.a, b:j.b,
   say:ST_POS[j.a].nm+' to '+stLow(ST_POS[j.b].nm)+'. '+stPair(a,b)+' '+ST_SHEAR_COST[j.key]};});
 /* the weight of the three western layers */
 var els=['sun','moon','rising'].map(function(k){return L[k].el;}).filter(Boolean), cnt={};
 els.forEach(function(x){cnt[x]=(cnt[x]||0)+1;});
 var top=Object.keys(cnt).sort(function(x,y){return cnt[y]-cnt[x];})[0], weight=null;
 if(els.length>=2&&cnt[top]>=2){weight=ST_WEIGHT[top];
  if(cnt[top]===3)weight=weight.replace(/^Mostly /,'All ');}
 else if(els.length===3)weight=ST_WEIGHT.none;
 /* the limit, said once at the end, and what would put it in */
 var need=e.needsTime?'a birth time':e.needsZone?'a birth time zone':'a birthplace the instrument can locate';
 var open=['sun','moon','rising'].filter(function(k){return L[k].open;});
 var limit=open.length?(open.map(function(k){return ST_POS[k].nm;}).join(' and ')
  +(open.length===1?' is':' are')+' not read yet, so '+(open.length===1?'its joints are':'their joints are')
  +' not read either. '+stCap(need)+' would put '+(open.length===1?'it':'them')+' in.'):'';
 var rail=seams.length===0?(open.length?'not fully read':'no shear')
  :seams.length===1?'shears, '+stLow(ST_POS[seams[0].a].nm)+' to '+stLow(ST_POS[seams[0].b].nm)
  :'shears in '+['','one','two','three'][seams.length]+' places';
 return {L:L, order:O, joints:joints, lean:lean, head:head, seams:seams, weight:weight,
  ground:ground==='open'?'':ST_GROUND[ground].replace('{Y}',stCap(ST_POL.year[L.year.push]))
   .replace('{D}',ST_LEANS[lean]), limit:limit, rail:rail};}
if(typeof module!=='undefined')module.exports={readStack:readStack,stJoint:stJoint,stPair:stPair,
 stLayers:stLayers,stCap:stCap,stApart:stApart};
