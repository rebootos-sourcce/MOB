/* The geometry of measure.js, with no browser in it.

   measure.js reads where an address is drawn out of a real page, which needs
   Chromium, and then derives from the two reference charts where each chart
   row of ANAT (atuned_src/engine/data/figure.js, the rows carrying c and f)
   should stand. The second half is pure arithmetic on the body outline and the
   chart landmarks, so it lives here, and both measure.js and tests/anatomy.js
   call this one copy. A second copy would be a second set of rules that could
   disagree with the first, which is the failure CLAUDE.md names.

   Nothing in this file is new. Each function is measure.js's own, moved
   whole: ourFigure, lerp, extrap, scaleOf, warper, the point in polygon test,
   the landmark round trip, the walk of a chart place in toward the midline
   until a mark sits on the body, and the drift check on the ANAT chart rows.
   The report numbers measure.js prints are the same before and after the move,
   which is how the move was checked (its JSON compared field for field).

   WHAT g IS. A plain object with BODYPATH, PMS, PMTX, PMTY, V and E: the
   outline the Body page clips to, and the two head landmarks (ANATHEAD.ytop
   and ANATHEAD.year). measure.js reads them out of the page, tests/anatomy.js
   out of engine.js. */
'use strict';
const ON = 3, NEAR = 6;            /* the bands measure.js grades by, share of height */
const DRIFT_MAX = 0.011;           /* a chart row may differ from its charts by this many figure units */
const EDGE = 0.9;                  /* a mark's radius: it sits on the body only if this much clear all round */

/* ---------- our figure, off its own outline ---------- */
function ourFigure(g){
 const v=g.BODYPATH.match(/-?\d+(\.\d+)?/g).map(Number), pt=[[v[0],v[1]]];
 for(let i=2;i+5<v.length;i+=6)pt.push([v[i+4],v[i+5]]);
 const P=pt.map(p=>[g.PMTX+p[0]*g.PMS,g.PMTY+p[1]*g.PMS]);
 const cross=y=>{const xs=[];for(let a=0,b=P.length-1;a<P.length;b=a++){const A=P[a],B=P[b];
  if((A[1]>y)!==(B[1]>y))xs.push(A[0]+(y-A[1])*(B[0]-A[0])/(B[1]-A[1]));}return xs.sort((a,b)=>a-b);};
 /* the trunk's own two edges on a row: the crossings nearest the midline on
    each side, so a hanging arm beside it is not counted as trunk */
 const trunk=y=>{const xs=cross(y),L=xs.filter(x=>x<50),R=xs.filter(x=>x>50);
  return (L.length&&R.length)?[L[L.length-1],R[0]]:null;};
 const outer=y=>{const xs=cross(y);return xs.length?[xs[0],xs[xs.length-1]]:null;};
 const scan=(a,b,f)=>{const o=[];for(let y=a;y<=b+1e-9;y+=0.05)o.push([+y.toFixed(2),f(y)]);return o;};
 let F=-1e9;P.forEach(p=>{F=Math.max(F,p[1]);});
 /* neck: the narrowest outline between the jaw and the shoulders, and N the
    middle of the run that holds within 0.05 of it */
 const nk=scan(13,20,y=>{const o=outer(y);return o?o[1]-o[0]:99;});
 const nmin=Math.min(...nk.map(r=>r[1])), run=nk.filter(r=>r[1]<nmin+0.05);
 const N=(run[0][0]+run[run.length-1][0])/2;
 /* neck base: going down from N, the first row where the outline runs a
    quarter wider than the neck, the same rule the charts were read by */
 let S=null;for(let y=N;y<26&&S===null;y+=0.01){const o=outer(y);if(o&&o[1]-o[0]>1.25*nmin)S=+y.toFixed(2);}
 /* skull: widest above the ear, from the top of the skull to the brow */
 const sk=scan(g.V+1,g.E-2,y=>{const o=outer(y);return o?o[1]-o[0]:0;});
 const skull=Math.max(...sk.map(r=>r[1]));
 /* waist: the trunk at its narrowest between the chest and the hips */
 const wa=scan(35,46,y=>{const t=trunk(y);return t?t[1]-t[0]:99;});
 const wmin=Math.min(...wa.map(r=>r[1])), wy=wa.find(r=>r[1]===wmin)[0];
 /* crotch: the first row, going down, with outline on both sides of the
    midline within a unit of it, which is the legs parting */
 let C=null;for(let y=50;y<62&&C===null;y+=0.01){const xs=cross(y);
  if(xs.some(x=>x<50&&x>49)&&xs.some(x=>x>50&&x<51))C=+y.toFixed(2);}
 return {V:g.V,E:g.E,N,S,C,F,skull,neck:nmin,waist:wmin,wy,poly:P};}

/* the point in polygon test, on the outline ourFigure read */
function inBodyOf(us){
 return (x,y)=>{const P=us.poly;let c=false;
  for(let a=0,bb=P.length-1;a<P.length;bb=a++)
   if(((P[a][1]>y)!==(P[bb][1]>y))&&(x<(P[bb][0]-P[a][0])*(y-P[a][1])/(P[bb][1]-P[a][1])+P[a][0]))c=!c;
  return c;};}

/* ---------- a chart point onto our figure ---------- */
function lerp(ks,vs,t){
 if(t<=ks[0])return vs[0];
 for(let i=0;i+1<ks.length;i++)if(t<=ks[i+1])return vs[i]+(t-ks[i])*(vs[i+1]-vs[i])/(ks[i+1]-ks[i]);
 return vs[vs.length-1];}
function extrap(ks,vs,t){
 /* above the skull or below the sole, carry the nearest segment's slope on */
 if(t<ks[0])return vs[0]+(t-ks[0])*(vs[1]-vs[0])/(ks[1]-ks[0]);
 const n=ks.length-1;
 if(t>ks[n])return vs[n]+(t-ks[n])*(vs[n]-vs[n-1])/(ks[n]-ks[n-1]);
 return lerp(ks,vs,t);}
/* ONE SCALE ACROSS, NOT THREE. The first cut eased between the skull, the neck
   and the waist, and put the marma chart's Amsa, the top of the shoulder,
   outside our shoulders altogether. Half of that was a misread neck (charts.js
   says which line), and half is real: a neck is the part of a figure drawn
   most by taste, and even read right its ratio sits 2 to 11 percent under the
   other two on all four figures, while skull and waist agree to within four.
   So across is scaled by the mean of skull and waist, and the neck is still
   read and printed so the reason can be checked. */
function scaleOf(fig,us){return (fig.skull/us.skull+fig.waist/us.waist)/2;}
function warper(fig,us){
 const K=['V','E','N','S','C','F'];
 const ky=K.map(k=>fig[k]), uy=K.map(k=>us[k]);
 const s=scaleOf(fig,us), sign=fig.view==='back'?-1:1;
 return ([x,y])=>[50+sign*(x-fig.mid)/s, extrap(ky,uy,y)];}

const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const mirror=p=>[100-p[0],p[1]];

/* every chart point on our figure, one or two per point */
function chartOnUs(us,FIGS,PTS){
 const W={};Object.keys(FIGS).forEach(k=>{W[k]=warper(FIGS[k],us);});
 const onUs={};
 PTS.forEach(q=>{if(!q.p)return;const list=Array.isArray(q.p[0])?q.p:[q.p];
  onUs[q.id]=list.map(W[q.fig]);});
 return {W,onUs};}

/* check the tool on the cases it must get exactly: each figure's own
   landmarks, on its own midline, land on ours. Returns the error of each. */
function landmarkRoundTrip(us,FIGS,W){
 const selftest=[];
 Object.keys(FIGS).forEach(k=>{const f=FIGS[k];['V','E','N','S','C','F'].forEach(L=>{
  const q=W[k]([f.mid,f[L]]);selftest.push(Math.max(Math.abs(q[0]-50),Math.abs(q[1]-us[L])));});});
 return selftest;}

/* WHERE A GATHERED ADDRESS SHOULD STAND, per chart group. The person's right
   side of each chart point (viewer's left, x under 50), then the mean of the
   two charts. Where the two charts disagree by more than the near band they
   are not averaged: the classical marma chart is kept and the other named,
   since a mean of two places that far apart is neither of them. A place the
   page would clip is walked in toward the midline until a mark there sits
   wholly on the body, and how far is recorded.
   gathered(ids) names the ones of a group the page still gathers round a
   seat; the browser knows, a headless caller passes () => []. */
function chartTargets(us,onUs,PTS,MATCH,gathered){
 const inBody=inBodyOf(us), H=us.F-us.V, pct=d=>100*d/H;
 const onBodyMark=(x,y)=>inBody(x,y)&&inBody(x-EDGE,y)&&inBody(x+EDGE,y)&&inBody(x,y-EDGE)&&inBody(x,y+EDGE);
 const right=pid=>{const l=onUs[pid];const r=l.find(q=>q[0]<=50);return r||mirror(l[0]);};
 const groups=[];
 MATCH.forEach(m=>{const key=m.pts.join(' ');let gr=groups.find(t=>t.key===key);
  if(!gr){gr={key,pts:m.pts,ids:[],tiers:[]};groups.push(gr);}
  m.ids.forEach(id=>{gr.ids.push(id);gr.tiers.push(m.tier);});});
 return groups.map(gr=>{
  const use=gr.pts.filter(pid=>{const q=PTS.find(t=>t.id===pid);return q&&q.ok!==false&&onUs[pid];});
  let from=use, split=null;
  if(use.length===2){const d=dist(right(use[0]),right(use[1]));
   if(pct(d)>NEAR){from=use.filter(pid=>pid.startsWith('m.'));split=+pct(d).toFixed(2);}}
  const c=from.map(right), at=[c.reduce((a,q)=>a+q[0],0)/c.length,c.reduce((a,q)=>a+q[1],0)/c.length];
  let x=at[0], walked=0;
  while(!onBodyMark(x,at[1])&&Math.abs(x-50)>0.05){x+=x<50?0.05:-0.05;walked+=0.05;}
  const f=Math.abs(x-50)<0.5?[[50,+at[1].toFixed(2)]]:[[+x.toFixed(2),+at[1].toFixed(2)],[+(100-x).toFixed(2),+at[1].toFixed(2)]];
  return {pts:from,asked:gr.pts,split,ids:gr.ids,gathered:gathered(gr.ids),f,walked:+walked.toFixed(2)};});}

/* and every ANAT row that says it came from a chart must still say what the
   charts say, or the row has drifted from its source. rows are the ANAT rows
   carrying c, each as {ids,c,f}. */
function chartDrift(rows,targets){
 return rows.map(r=>{const t=targets.find(q=>q.pts.join(' ')===r.c.join(' '));
  if(!t)return {ids:r.ids,c:r.c,problem:'no chart group of that name'};
  const worst=Math.max(...r.f.map((q,i)=>t.f[i]?dist(q,t.f[i]):99));
  return worst>DRIFT_MAX?{ids:r.ids,c:r.c,problem:'drifted '+worst.toFixed(3)+' units',want:t.f}:null;}).filter(Boolean);}

module.exports={ON,NEAR,DRIFT_MAX,EDGE,ourFigure,inBodyOf,lerp,extrap,scaleOf,warper,dist,mirror,
 chartOnUs,landmarkRoundTrip,chartTargets,chartDrift};
