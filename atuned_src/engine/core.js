
/* ============================================================
   DERIVED INDEXES
   ============================================================ */
const SOM=NODES.filter(n=>!n.b.startsWith('Field'));
const FIELD=NODES.filter(n=>n.b.startsWith('Field'));
const W=[];BANDS.forEach(b=>SOM.filter(n=>n.b===b).forEach(n=>W.push(n)));
W.forEach((n,i)=>{n.slot=i;n.ang=(i/108)*Math.PI*2-Math.PI/2;
 n.cf = ANTKEY.test(n.k)?'Anticipation' : SURPKEY.test(n.k)?'Surprise'
      : HEARTKEY.test(n.k)?'Sad' : (REROUTE[n.c]||null);});
const BY={};NODES.forEach(n=>BY[n.i]=n);
const NAMED=new Set();SAB_LIB.forEach(s=>s.nids.forEach(i=>NAMED.add(i)));
/* the six families are poled. collapsed on the left, overshot on the right.
   the roster doubles at the family tier, not the saboteur tier. */
const FAM_POLE={Dysregulation:'Numbness',Collapse:'Mania',Rigidity:'Indiscriminate',
 Predatory:'Enabling',Grandiosity:'Self-erasure',Dissociation:'Enmeshment'};
const FAM_OF={Fear:'Dysregulation',Shock:'Dysregulation',Anticipation:'Dysregulation',
 Anger:'Predatory',Shame:'Collapse',Sad:'Collapse',Surprise:'Dysregulation',
 Disgust:'Rigidity',Apathy:'Dissociation'};
const GRAND=/PRIDE|SUPERIOR|ENTITLE|HUBRIS|ARROGAN|GRANDIOS|SPECIAL/i;
const UNNAMED=[],PLACED=new Set();
BANDS.forEach(b=>{const grp={};
 W.filter(n=>n.b===b&&!NAMED.has(n.i)&&n.cf).forEach(n=>{(grp[n.cf]=grp[n.cf]||[]).push(n);});
 Object.keys(grp).forEach(c=>{if(grp[c].length<2)return;
  const fam=GRAND.test(grp[c].map(n=>n.k).join(' '))?'Grandiosity':FAM_OF[c];
  grp[c].forEach(n=>PLACED.add(n.i));
  UNNAMED.push({nm:b+' '+c.toLowerCase(),hcx:fam,nids:grp[c].map(n=>n.i),unnamed:true});});});
/* leftovers. a singleton in its band joins the cross-band cluster for its own
   child fetter, so every address that can hold charge can also compound. */
const LEFT={};
W.filter(n=>n.cf&&!NAMED.has(n.i)&&!PLACED.has(n.i)).forEach(n=>{(LEFT[n.cf]=LEFT[n.cf]||[]).push(n);});
Object.keys(LEFT).forEach(c=>{
 const fam=GRAND.test(LEFT[c].map(n=>n.k).join(' '))?'Grandiosity':FAM_OF[c];
 UNNAMED.push({nm:'diffuse '+c.toLowerCase(),hcx:fam,nids:LEFT[c].map(n=>n.i),unnamed:true,diffuse:true});});
const ALL_SAB=SAB_LIB.concat(UNNAMED);
const TAU=Math.PI*2, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const CHG2SEAT={fear:'Root',anger:'Solar',shame:'Sacral',disgust:'Sacral',apathy:'Throat',
 shock:'3rd Eye',sadness:'Heart',grief:'Heart',surprise:'Heart',anticipation:'Solar',
 anxiety:'Solar',pride:'Crown',guilt:'Sacral',craving:'Sacral',separation:'Crown'};
const CHG2FET={anxiety:'Anticipation',fear:'Fear',anger:'Anger',shame:'Shame',
 disgust:'Disgust',apathy:'Apathy',shock:'Shock',sadness:'Sad',sad:'Sad',
 grief:'Sad',surprise:'Surprise',separation:'Apathy',silence:'Apathy',
 doubt:'Shock',pride:'Shame',guilt:'Shame',craving:'Disgust'};

/* ============================================================
   TABS. A stale tab index caused the same class of bug four times in
   this codebase, so the integers are named once and never typed again.
   Order is load bearing and must not change.
   ============================================================ */
const TAB={STORY:0,SUMMARY:1,FIELD:2,ENERGY:3,ANALYTICS:4};
/* TABDEF is DISPLAY order. TAB above is identity and does not move: the
   integers are persisted, compared and passed around, and renumbering them
   is the bug this file already warns about. Summary reads last because it is
   the conclusion, so it sits after the instruments that produce it. Anything
   that needs the entry for a tab looks it up by .k, never by position. */
const TABDEF=[
 {k:TAB.STORY,    id:'story', nm:'Story',     cls:'tab-story'},
 {k:TAB.FIELD,    id:'cv',    nm:'Field',     cls:'tab-field'},
 {k:TAB.ENERGY,   id:'emap',  nm:'Energy',    cls:'tab-energy'},
 {k:TAB.ANALYTICS,id:'ana',   nm:'Analytics', cls:'tab-analytics'},
 {k:TAB.SUMMARY,  id:'sum',   nm:'Summary',   cls:'tab-summary'}];
const TABOF=function(k){for(var i=0;i<TABDEF.length;i++)if(TABDEF[i].k===k)return TABDEF[i];
 return TABDEF[0];};

/* ============================================================
   STATE
   ============================================================ */
const S={dom:0,doms:[0],arcs:[0,1],roots:[],a1:0,a2:1,charge:{},law:{},
 theme:'dark',legible:false,hover:null,pin:null,t:0,replace:{},view:1,who:0,tab:TAB.FIELD};
CHARGES.forEach(c=>{S.charge[c]=3;S.replace[c]=0;});
SINAMES.forEach(l=>S.law[l]=6);

/* ============================================================
   THE SOUL. Multi-select: any number of blueprint domains, root
   clusters and archetypes. Each selection lays a lobe on the
   19-slot ring and the lobes accumulate.
   ============================================================ */
let DOMAIN=new Array(19).fill(.3);
function buildSoul(){
 DOMAIN=new Array(19).fill(0);
 if(!S.doms.length)S.doms=[S.dom];
 if(!S.arcs.length)S.arcs=[S.a1];
 S.dom=S.doms[0];S.a1=S.arcs[0];S.a2=S.arcs[1]!==undefined?S.arcs[1]:(S.arcs[0]+1)%12;
 S.doms.forEach((sd,i)=>{const wgt=i===0?1:Math.max(.5,.92-i*.14);
  for(let d=0;d<19;d++){let k=Math.abs(d-sd);k=Math.min(k,19-k);
   DOMAIN[d]=Math.max(DOMAIN[d],wgt*Math.exp(-(k*k)/4.2));}});
 S.roots.forEach(rn=>{DOMAINS.forEach((D,d)=>{if(D.r===rn)DOMAIN[d]=Math.max(DOMAIN[d],.72);});});
 S.arcs.forEach((j,i)=>{const c=(j/12)*19+19/24, wgt=i===0?.86:i===1?.62:Math.max(.34,.55-i*.06);
  for(let d=0;d<19;d++){let k=Math.abs(d-c);k=Math.min(k,19-k);
   DOMAIN[d]=Math.max(DOMAIN[d],wgt*Math.exp(-(k*k)/2.6));}});
 const mx=Math.max(...DOMAIN)||1;DOMAIN=DOMAIN.map(v=>.08+.92*v/mx);
}
/* 19 does not divide 360 evenly, so the domain arc is 18.947 degrees and the
   overlap against the 30 degree archetype arcs is computed, not snapped. */
const DARC=360/19;
function affinity(){const a=new Array(12).fill(0);
 for(let d=0;d<19;d++){const d0=d*DARC,d1=d0+DARC;
  for(let j=0;j<12;j++){const a0=j*30,a1=a0+30;
   a[j]+=DOMAIN[d]*(Math.max(0,Math.min(d1,a1)-Math.max(d0,a0))/DARC);}}
 const mx=Math.max(...a)||1;return a.map(v=>v/mx);}
function coreAt(ang){const deg=((ang+Math.PI/2)/TAU*360+3600)%360,f=deg/DARC,i=Math.floor(f),t=f-i,
 s=t*t*(3-2*t);return DOMAIN[i%19]*(1-s)+DOMAIN[(i+1)%19]*s;}
function meanAng(l){let x=0,y=0;l.forEach(a=>{x+=Math.cos(a);y+=Math.sin(a);});return Math.atan2(y,x);}
function bandIg(b){const g=SI.filter(l=>l.b===b);return g.reduce((a,l)=>a+S.law[l.nm],0)/g.length;}

/* ---------- SAB33 detection ---------- */
function sabLevels(){
 var L={},F={Fear:'fear',Anger:'anger',Shame:'shame',Disgust:'disgust',Apathy:'apathy',
  Shock:'shock',Sad:'sadness',Surprise:'surprise',Anticipation:'anticipation'};
 CHILD.forEach(function(c){L[F[c.nm]||c.nm.toLowerCase()]=Math.round(S.charge[c.nm]||0);});
 L.anxiety=L.anticipation;
 return L;}
/* fit scoring against the ranges. 1.0 inside the band, 0.5 for adjacent. */
function sab33Detect(){
 var L=sabLevels(), out=[];
 SAB33.forEach(function(row){
  var nm=row[0], parts=row[1], fit=0, inAll=true;
  parts.forEach(function(p){
   var lvl=L[p[0]]||0, lo=p[1], hi=p[2];
   if(lvl>=lo && lvl<=hi){ fit+=1; }
   else if(lvl===lo-1 || lvl===hi+1){ fit+=0.5; inAll=false; }
   else { inAll=false; }});
  var score=Math.round(fit/parts.length*100);
  if(score>=60) out.push({nm:nm, score:score, exact:inAll, parts:parts,
   charges:parts.map(function(p){return p[0];}),
   band:CHG2SEAT[parts[0][0]]||'Root',
   w:Math.min(10, parts.reduce(function(a,p){return a+(L[p[0]]||0);},0)/parts.length)});});
 return out.sort(function(a,b){return b.score-a.score || b.w-a.w;});}

