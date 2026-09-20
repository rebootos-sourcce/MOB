
/* ============================================================
   COMPUTE. Everything downstream is a pure function of this.
   ============================================================ */
/* the Domain Matrix. the root domain a person runs makes them 1.3x more
   susceptible to its affine child fetters. that is the Distortion wiring.
   This was the first thing compute() did, and it was the only place n.susc
   was written. applyStory() reads n.susc to decide which addresses a story
   lands on, and the front door applies the story before compute() runs, so
   a story was attributed by whichever profile had been computed last. 944
   of 1560 profile pairs read differently by order. loadProfile() now runs
   this pass, so susceptibility always belongs to the profile being read. */
function suscAll(){
 const rootsIn=[...new Set(S.doms.map(d=>DOMAINS[d].r).concat(S.roots))];
 const aff=[...new Set(rootsIn.flatMap(rn=>AFFIN[rn]||[]))];
 W.forEach(n=>{
  const arc=Math.min(18,Math.floor(n.slot/(108/19)));
  const prox=aff.includes(n.cf)?1.3:1;
  n.susc=(0.40+0.60*DOMAIN[arc])*prox;});
 return aff;}
/* BALANCE. The nine child fetters split by the direction the body takes
   under them. Four discharge outward, five withdraw inward. That is the
   approach and withdrawal split, not a claim about anyone's character.
   The reading is the difference over the total, minus one to one, so an
   empty field reads zero rather than either pole. Sex at birth is stored
   and shown beside it; it does not enter the arithmetic. */
const OUTWARD=['Anger','Disgust','Anticipation','Surprise'];
const INWARD=['Fear','Shame','Sad','Apathy','Shock'];
function balance(){
 var o=0,i=0;
 OUTWARD.forEach(function(c){o+=S.charge[c]||0;});
 INWARD.forEach(function(c){i+=S.charge[c]||0;});
 /* Raw sums are not comparable: four axes discharge outward and five
    withdraw, so summing them biased every reading inward by a fifth. A
    simulation over 50,000 profiles put the split at 28 against 72 with no
    person in it. The means are what compare. */
 var om=o/OUTWARD.length, im=i/INWARD.length, t=om+im;
 /* And a field with nothing in it is not balanced, it is unread. Below a
    mean of 1 on both sides the strip says so rather than naming a pole. */
 return {out:o, in:i, outMean:om, inMean:im,
  read: (om>=1||im>=1),
  lean: t?(om-im)/t : 0};}
function compute(){
 const root=DOMAINS[S.dom].r;
 const rootsIn=[...new Set(S.doms.map(d=>DOMAINS[d].r).concat(S.roots))];
 const aff=suscAll();
 let loaded=[],sum=0;
 W.forEach(n=>{
  /* a closed law at this band lets charge sit deeper. integrity is local. */
  const relief=bandIg(n.b)/10;
  n.held = n.cf?clamp(S.charge[n.cf]*n.susc*(1-relief*0.42),0,10):0;
  /* the coherent opposite installed at the same address. an address with the
     opposite in does not merely read zero, it conducts. */
  n.rep  = n.cf?clamp((S.replace[n.cf]||0)*(0.72+0.28*relief),0,10):0;
  /* the binary. SQ is what is left of the held state after the pole is in. */
  n.sq   = clamp(n.held - n.rep*0.86,0,10);
  n.pole = clamp(n.rep - n.held,0,10);
  /* JOUISSANCE. the opposite overshot past the point where it serves.
     overshoot begins at 6. being loaded as well does not protect you from it;
     carrying the fetter and overdoing the cure is the commonest split there is. */
  n.jq   = clamp(n.rep - 6,0,4)/4*10;
  n.open = clamp(1-n.sq/10 + n.pole/26,0,1.18);
  if(n.sq>=4){loaded.push(n);sum+=n.sq;}});
 FIELD.forEach(n=>{n.sq=0;n.open=1;n.held=0;n.rep=0;n.pole=0;n.jq=0;});
 const SQm=loaded.length?sum/loaded.length:0;

 const sabs=[];
 /* SAB33: 33 named saboteurs matched on charge RANGES. */
 sab33Detect().forEach(function(d){
  const parts=W.filter(n=>n.b===d.band&&n.sq>=3).sort((a,b)=>b.sq-a.sq).slice(0,4);
  if(!parts.length)return;
  const key=d.charges[0]==='anxiety'?'Anticipation':
   ({fear:'Fear',anger:'Anger',shame:'Shame',disgust:'Disgust',apathy:'Apathy',
     shock:'Shock',sadness:'Sad',surprise:'Surprise'})[d.charges[0]];
  sabs.push({kind:'sab',nm:d.nm,hcx:FAM_OF[key]||'Collapse',named:true,
   score:d.score,exact:d.exact,charges:d.charges,auth:SABAUTH[d.nm]||null,
   parts,w:d.w,ang:meanAng(parts.map(n=>n.ang))});});
 ALL_SAB.forEach(s=>{const parts=s.nids.map(i=>BY[i]).filter(Boolean);
  const w=parts.reduce((a,n)=>a+n.sq,0)/parts.length;
  if(w>=3.7)sabs.push({kind:'sab',nm:s.nm,hcx:s.hcx,unnamed:!!s.unnamed,parts,w,
   auth:SABAUTH[s.nm]||null,ang:meanAng(parts.map(n=>n.ang))});
  /* the same cluster, overshot. a voice that will not stop rather than one that shuts. */
  const j=parts.reduce((a,n)=>a+n.jq,0)/parts.length;
  if(j>=3.7)sabs.push({kind:'sab',nm:s.nm+' overshot',hcx:FAM_POLE[s.hcx]||s.hcx,
   over:true,unnamed:!!s.unnamed,parts,w:j,ang:meanAng(parts.map(n=>n.ang))});});
 sabs.sort((a,b)=>b.w-a.w);

 const cxs=[];
 /* d is the line a person is shown and sub is the clinical correspondence,
    which is internal. Both are carried so the codex keeps its mapping and the
    card has something true to print that is not a diagnosis. */
 const FAMS=HCX_LIB.map(h=>({nm:h.nm,d:h.d,sub:h.sub})).concat(
  HCX_LIB.map(h=>({nm:FAM_POLE[h.nm],d:'the cure for '+h.nm.toLowerCase()
    +', done past the point where it helps',sub:'overshoot of '+h.nm,over:true})));
 FAMS.forEach(h=>{const fam=sabs.filter(s=>s.hcx===h.nm);
  for(let i=0;i+1<fam.length;i+=2){const parts=fam.slice(i,i+2);
   cxs.push({kind:'cx',nm:parts[0].nm+' + '+parts[1].nm,hcx:h.nm,over:!!h.over,parts,
    w:(parts[0].w+parts[1].w)/2,ang:meanAng(parts.map(p=>p.ang))});}});
 /* a family compounds into a hyper on two complexes, or on one complex that is
    already running hard. a two-complex-only gate makes the top unreachable. */
 const hys=[];
 FAMS.forEach(h=>{const fam=cxs.filter(c=>c.hcx===h.nm);
  if(fam.length>=2 || (fam.length===1 && fam[0].w>=6.5))
   hys.push({kind:'hy',nm:h.nm,d:h.d,sub:h.sub,over:!!h.over,parts:fam,
    w:fam.reduce((a,p)=>a+p.w,0)/fam.length,ang:meanAng(fam.map(p=>p.ang))});});
 hys.sort((a,b)=>b.w-a.w);
 const sups=[];
 for(let i=0;i+1<hys.length;i+=2){const parts=hys.slice(i,i+2),w=(parts[0].w+parts[1].w)/2;
  if(w>=5.6)sups.push({kind:'sup',nm:parts[0].nm+' / '+parts[1].nm,parts,w,
   ang:meanAng(parts.map(p=>p.ang))});}
 /* the six masks, one per developmental era, lit by what sits under it. */
 const maskRing=MASKS.map(m=>{
  const seg=W.filter(n=>m.b.indexOf(n.b)>=0);
  return {nm:m.nm,bands:m.b,w:seg.reduce((a,n)=>a+n.sq,0)/seg.length,
   ang:meanAng(seg.map(n=>n.ang))};});

 const dist=clamp(sabs.length*.19+cxs.length*.55+hys.length*1.35+sups.length*2.4,0,10);
 /* installed poles feed integrity. CQ and SQ are the same coordinate system read
    from opposite ends, so clearing one end must raise the other. But only up to
    the point of excess: past that the pole costs, it does not pay. */
 const poleMean=W.reduce((a,n)=>a+n.pole,0)/108;
 const JQ=W.reduce((a,n)=>a+n.jq,0)/108;
 const excess=W.filter(n=>n.jq>=4);
 const Ig=clamp(SINAMES.reduce((a,l)=>a+S.law[l],0)/21 + poleMean*0.30 - JQ*0.42,0,10);
 const It=clamp(BANDS.reduce((a,b)=>a+bandIg(b),0)/7 + poleMean*0.22 - JQ*0.30,0,10);
 /* DQ: the fractional sum of shadow weight across collapsed addresses. */
 const DQraw=loaded.reduce((a,n)=>a+n.sq/10,0);
 /* THE SIX AXES multiply what every held pattern costs. Detachment is the
    cheapest gate at 0.60, attachment the most expensive at 1.35. No story
    means no gate evidence, so the factor is 1 and nothing changes. */
 const _vf=verpFactor();
 /* Resistance = floor + DQ. compounding raises the floor, it is not a term. */
 /* Distortion is struck as a formula variable, the author's ruling of 13 May,
    because Distortion and SQ are the same reading under two names and
    multiplying one by the other counted the same charge twice. It is still
    computed and still reported, because Analytics reads it. It no longer
    divides CQ. */
 const Rz=Math.max(1,(1+DQraw*0.05)*_vf);
 /* CQ = (Intention x Integrity) / Resistance. 100 when all 21 laws read 10. */
 const CQ=clamp((It*Ig)/Rz,0,100);
 /* One table. This was a literal copy of the thresholds and the names, and a
    previous commit claimed to have removed the duplicate after removing only
    the one in the renderer. A rename would have drifted silently between the
    engine and the definitions. canon.js loads before this file, which is what
    makes tierOf reachable here. */
 const tier=tierOf(CQ).nm;
 /* UNREAD. With nothing held and no law measured, CQ is a pure function of
    the default 6 on all 21 laws: it comes out 36 and the tier comes out
    Incoherent. That is not a reading of a person, it is a reading of the
    defaults, and the product was printing it in the largest type on screen to
    someone who had not yet typed a word. The number is still computed, because
    everything downstream needs it, but the field says plainly that nothing has
    been read yet and every surface that names a tier checks this first. */
 const measured=SI.filter(function(l){return CURP&&CURP.laws&&CURP.laws[l.nm]!=null;}).length;
 /* BELOW THE LINE. An address counts as carrying at SQ 4. Under that the
    charge is real, a person entered it, and every surface reported nothing
    held. Setting all nine axes to 4 gave an identical reading to setting them
    to 0: CQ 92.2, DQ 0.0, nothing carrying. That is the instrument saying
    nothing about something. The threshold stays, because it is what the
    arithmetic is built on, but the fact that there is charge underneath it is
    now reportable instead of invisible. */
 const under=W.filter(function(n){return n.sq>0&&n.sq<4;}).length;
 /* AND UNREAD COUNTS IT, because unread is a claim that nothing was entered
    and not a claim that nothing crossed the display line. Measured with all
    nine axes at 3.9: 107 addresses carrying, DQ 0.0, unread true, so Summary
    showed the four doors and said nothing had been entered while the release
    control offered the same 107 addresses and spent eight patterns a press on
    them. One surface billing for a field another surface denies exists is the
    worst version of this, so under is counted here. The display line is
    unchanged: DQ still reads 0 and nothing is called held, which is true. */
 const unread=(loaded.length===0&&measured===0&&under===0);
 /* benign and malig were CQ restated: malig was (50 minus CQ) doubled, so a
    surface asking whether a field was malignant AND decoherent was asking one
    question twice and could never get a no from one and a yes from the other.
    The owner's model needs two independent axes, so there are two now.

    SHAPE. Where the firing stack points. Predatory and Grandiosity run at
    other people, and Mania is Collapse turned outward. The rest lands on the
    person carrying it. This is the axis the book calls malignancy, and its
    threshold is the book's: harm to others becoming instrumental.

    CONTROL. Whether the will is directing or the drag is. Organised against
    chaotic, which is the difference between the devil and the demon.

    benign and malig keep their old meaning and their old callers, because
    they are the coherence read and several surfaces already print them. They
    are just no longer pretending to be a second axis. */
 const benign=CQ>=50,malig=benign?0:Math.round((50-CQ)/50*100);
 const X=clamp((1-S.charge.Apathy/10)*.3+(1-clamp(DQraw/14,0,1))*.7,0,1);
 const Y=clamp((It/10)*.6+(1-dist/10)*.4,0,1);
 const Z=clamp((Ig/10)*(1-SQm/10),0,1);
 const radiance=Math.sqrt(X*X+Y*Y+Z*Z)/Math.sqrt(3);
 const af=affinity();
 let pi=0;af.forEach((v,i)=>{if(v>af[pi])pi=i;});
 let si=(pi+1)%12;af.forEach((v,i)=>{if(i!==pi&&v>af[si])si=i;});
 let dch=CHARGES[0];CHARGES.forEach(c=>{if(S.charge[c]>S.charge[dch])dch=c;});
 const will=(Ig/10)*(It/10),drag=clamp(DQraw/14,0,1)*1.6+dist/10;
 const steer=will>=drag?'forced':'withheld';
 const mask=sups[0]||hys[0]||cxs[0]||sabs[0]||null;
 let darkB=BANDS[0],darkV=-1;
 BANDS.forEach(b=>{const gp=W.filter(n=>n.b===b),v=gp.reduce((a,n)=>a+n.sq,0)/gp.length;
  if(v>darkV){darkV=v;darkB=b;}});
 let weakL=SI[0];SI.forEach(l=>{if(S.law[l.nm]<S.law[weakL.nm])weakL=l;});
 /* THE TWO REAL AXES. Shape is where what is running points. Control is how
    far it has compounded, which is what conditioning is, and not whether the
    will is winning: at low coherence the will always loses, so measuring it
    that way made the devil unreachable and put every adversarial field in the
    chaotic corner. */
 const chain=sabs.concat(cxs).concat(hys).concat(sups);
 const outward=outwardShare(chain);
 const organized=organisedShare(chain);
 const gov=quadrant(outward,organized,CQ);
 /* CARRYING IS NOT THE SAME AS HELD, and the product had only the second word.
    `loaded` is every address at or above the line at sq 4, and it drives the
    arithmetic: DQ, resistance, the saboteur scan. That stays exactly as it is.

    But every action surface also read `loaded`, and an absolute cut at 4 on a
    quantity that is often spread thin means a person can carry real load at
    every address and be told nothing is carrying. Measured across the roster:
    Marcus carries 99 addresses with his heaviest at 2.51 and is told nothing
    is carrying while the same screen calls him Incoherent. Sofia carries 52,
    Angela 74. Three of the six ICPs. And it is also where the release curve
    ran out: after two runs James is still Severe at CQ 18.6 with 72 addresses
    carrying, and every release control refused him.

    So `carrying` is its own word for its own thing: every address holding
    anything at all, heaviest first. `heaviest` is the top of it. Nothing here
    divides, multiplies or feeds CQ. It is a sort of what the field already
    says, so the arithmetic core keeps its bodies, and the action surfaces get
    something true to point at. */
 const carrying=W.filter(n=>n.sq>0).sort((a,b)=>b.sq-a.sq);
 return {loaded,carrying,heaviest:carrying[0]||null,
  sabs,cxs,hys,sups,maskRing,DQ:DQraw,Rz,vf:_vf,SQm,poleMean,JQ,excess,
  FAM_POLE,dist,Ig,It,CQ,tier,unread,measured,under,benign,malig,X,Y,Z,radiance,aff:af,pi,si,dch,steer,
  outward,organized,gov,
  will,drag,mask,darkB,darkV,root,rootsIn,weakL,balance:balance()};
}

/* ============================================================
   THE CEILING ON RELEASE. What coherence reads once every charge is gone,
   which is the most a release can ever achieve, and the gap to it.

   Why this exists. CQ is (Intention x Integrity) / Resistance. A release
   empties addresses, so it works on Resistance and on the installed pole. It
   cannot manufacture Integrity, because Integrity is the twenty one laws and
   those move only when a person answers them or changes what they do. The
   product never said so, and offered release as its core loop, so a person
   pulled the one lever the arithmetic had already spent.

   Measured across the roster by zeroing every charge and reading CQ back.
   Marcus has 0.3 points of headroom and stays Incoherent. Sofia has 1.5 and
   stays Even. Angela 1.0. Three of the six ICPs can run every release the
   product will ever offer them and not move the number they were shown. James
   has 7.2 and stays Severe at the end of it. The ceiling tracks the square of
   the law mean: James law mean 4.37, ceiling 20.0; Marcus 6.21, ceiling 39.4;
   Tomas 3.08, ceiling 9.5.

   It is computed rather than simulated. With charge at zero, held is zero, sq
   is zero and the pole is the whole of the installed side. jq reads off rep
   alone so it does not move, bandIg reads off S.law alone so it does not move,
   and DQ is zero by construction, which puts resistance on its floor. Nothing
   is mutated and nothing is guessed. */
function cqCeiling(){
 const lawMean=SINAMES.reduce((a,l)=>a+S.law[l],0)/21;
 const bandMean=BANDS.reduce((a,b)=>a+bandIg(b),0)/7;
 let poleSum=0,jqSum=0;
 W.forEach(n=>{
  const relief=bandIg(n.b)/10;
  const rep=n.cf?clamp((S.replace[n.cf]||0)*(0.72+0.28*relief),0,10):0;
  poleSum+=rep;                                  /* held is 0, so pole is rep */
  jqSum+=clamp(rep-6,0,4)/4*10;});
 const poleMean=poleSum/108, JQ=jqSum/108;
 const Ig=clamp(lawMean+poleMean*0.30-JQ*0.42,0,10);
 const It=clamp(bandMean+poleMean*0.22-JQ*0.30,0,10);
 const Rz=Math.max(1,verpFactor());             /* DQ is 0, so only the gate */
 return clamp((It*Ig)/Rz,0,100);
}
/* the gap a release still has in it, for the person about to run one */
function cqHeadroom(cqNow){return Math.max(0,cqCeiling()-cqNow);}

/* ============================================================
   ACCURACY. Rebuilt from a layer ablation across visible axes x law
   coverage x expression. Both an additive and a multiplicative
   evidence form were fitted; additive won, 5.68 mean absolute error
   against 7.28.

     accuracy = 10 + 43*(1 - e^(-held/13)) + 28*lawCoverage + 18*expression

   Signal SATURATES rather than rising linearly: the curve is steep to
   about eight held addresses and flat after. A profile with 21/21 laws
   measured and an empty field is not at chance, it runs near 60.
   ============================================================ */
var ACC_BASE=10, ACC_AXG=43, ACC_K=13, ACC_LAWG=28, ACC_EXPG=18;
/* the profile is an argument, not ambient state. it defaults to the live one so
   every call site reads the same, but the fit stays measurable on any profile
   without first making it current. */
function accuracy(r,prof){
 var P=prof||CURP;
 var meas=SI.filter(function(l){return P&&P.laws&&P.laws[l.nm]!=null;}).length;
 var cov=meas/21;
 var sc=P?iqScore(P):{};
 var ks=Object.keys(sc);
 var rel=ks.length?ks.filter(function(k){return sc[k].reliable;}).length/ks.length:0;
 var held=W.filter(function(n){return n.sq>=4;}).length;
 var inst=W.filter(function(n){return n.pole>=4;}).length;
 /* an installed pole is readable signal too: a cleared address still says something */
 var eff=held+inst*0.35;
 var sig=eff>0?(1-Math.exp(-eff/ACC_K)):0;
 var E=exprRead();
 var exq=clamp(E.reduce(function(a,x){return a+x.fill;},0)/E.length/10,0,1);
 var fams={};[].concat(r.hys,r.sups).forEach(function(o){fams[o.nm]=1;});
 var deg=0;
 [['Collapse','Self-erasure'],['Numbness','Dissociation']].forEach(function(p){
  if(fams[p[0]]&&fams[p[1]])deg++;});
 var pct=ACC_BASE + ACC_AXG*sig + ACC_LAWG*cov + ACC_EXPG*exq;
 pct=clamp(pct*(1-deg*0.10),8.3,99);
 /* the interval is the fit's own error plus what is missing */
 var band=5.7*0.5 + (1-cov)*6 + (1-sig)*8 + deg*4 + (1-rel)*1.2 + (1-exq)*3;
 return {pct:pct, band:band, exq:exq, sig:sig, cov:meas, rel:Math.round(rel*100), relN:rel,
  held:held, inst:inst, deg:deg, signal:Math.round(sig*100)};}
