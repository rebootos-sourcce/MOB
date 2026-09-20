/* ============================================================
   THE AVATAR DATA GENERATOR.

   Every number the three prototypes draw comes out of engine.js
   at run time. Nothing is typed in.

   The record channel is append only by construction: an address
   counted as opened is never uncounted, even when charge comes
   back. That is the whole honesty mechanism, so it is arithmetic
   here and not a rule in a renderer.
   ============================================================ */
const E=require('/home/user/MOB/engine.js');
const {S,CHARGES,SINAMES,BANDS,W,PEOPLE,LAWSET,CHILD,SI,compute,buildSoul,bandIg,
       tierOf,TIERCOL,PAL,PMBANDS,mirrorAt,MASKS,ARCH}=E;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function load(nm){const p=PEOPLE.find(x=>x.nm===nm);
 S.doms=[p.dom];S.arcs=[p.a1,p.a2];S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=p.c[c]||0;S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[nm]||{_:5.5};SINAMES.forEach(l=>S.law[l]=LS[l]!==undefined?LS[l]:LS._);
 return p;}
/* ui/release.js:88 to 99, verbatim arithmetic, eight addresses a run */
function release(r,n){
 const q=r.carrying.slice(0,n||8).filter(x=>x.cf);
 q.forEach(x=>{const w0=x.sq*10, d=-Math.round(w0*0.21+2);
  const share=Math.abs(d)/10/Math.max(1,q.filter(y=>y.cf===x.cf).length);
  S.charge[x.cf]=clamp((S.charge[x.cf]||0)-share,0,10);
  S.replace[x.cf]=clamp((S.replace[x.cf]||0)+share*0.62,0,10);});
 return q.map(x=>x.i);}
/* a hard month. charge comes back at every axis, which is what an intake
   after a bad stretch actually does to the field. */
function harden(k){CHARGES.forEach(c=>{S.charge[c]=clamp((S.charge[c]||0)+k,0,10);});}

function frame(nm,label,rec){
 const r=compute();
 const seats=BANDS.map(b=>{
  const g=W.filter(n=>n.b===b);
  return {b, n:g.length,
   load:+(g.reduce((a,n)=>a+n.sq,0)/g.length).toFixed(3),
   pole:+(g.reduce((a,n)=>a+n.pole,0)/g.length).toFixed(3),
   peak:+Math.max.apply(null,g.map(n=>n.sq)).toFixed(2),
   ig:+bandIg(b).toFixed(2),
   mirror:mirrorAt(g.reduce((a,n)=>a+n.sq,0)/g.length,bandIg(b)),
   carrying:g.filter(n=>n.sq>0).length,
   /* THE RECORD. addresses at this seat ever taken to nothing. append only. */
   opened:g.filter(n=>rec.addr[n.i]).length,
   touched:g.filter(n=>rec.touch[n.i]).length,
   laws:SI.filter(l=>l.b===b).length};});
 return {label, CQ:+r.CQ.toFixed(2), tier:r.tier, tierCol:TIERCOL[r.tier],
  DQ:+r.DQ.toFixed(2), Ig:+r.Ig.toFixed(2), It:+r.It.toFixed(2),
  poleMean:+r.poleMean.toFixed(3), SQm:+r.SQm.toFixed(2),
  carrying:r.carrying.length, loaded:r.loaded.length, under:r.under, unread:r.unread,
  heaviest:r.heaviest?{k:r.heaviest.k,b:r.heaviest.b,sq:+r.heaviest.sq.toFixed(2),
    cf:r.heaviest.cf,opp:(CHILD.filter(c=>c.nm===r.heaviest.cf)[0]||{}).opp||''}:null,
  chainHeld:r.sabs.filter(s=>!s.over).length,
  chainOver:r.sabs.filter(s=>s.over).length,
  cxs:r.cxs.length, hys:r.hys.length, sups:r.sups.length,
  hyHeld:r.hys.filter(h=>!h.over).map(h=>h.nm),
  hyOver:r.hys.filter(h=>h.over).map(h=>h.nm),
  darkB:r.darkB, weakL:r.weakL.nm, dch:r.dch, balance:+r.balance.lean.toFixed(3),
  seats,
  /* the record, totalled */
  rec:{runs:rec.runs, addr:Object.keys(rec.addr).length,
       touch:Object.keys(rec.touch||{}).length,
       seats:BANDS.filter(b=>W.some(n=>n.b===b&&(rec.touch||{})[n.i])).length,
       emptied:BANDS.filter(b=>W.some(n=>n.b===b&&rec.addr[n.i])).length,
       laws:SINAMES.length, days:rec.days}};}

/* the four points every persona is shown at, and they are the same four for
   everybody so a design cannot be tuned to one profile. */
const PLAN=[
 {k:'m0', n:0,  hard:0, nm:'Month 0. Nothing run.'},
 {k:'m1', n:4,  hard:0, nm:'Month 1. Four runs.'},
 {k:'m3', n:12, hard:0, nm:'Month 3. Twelve runs.'},
 {k:'bad',n:12, hard:2.2, nm:'Month 4. A hard month on top of twelve runs.'}];

const OUT={};
['Diane','Marcus','Gordon','Sofia'].forEach(nm=>{
 const p=load(nm);
 const rec={runs:0, addr:{}, touch:{}, days:0};
 const frames={};
 let at=0;
 PLAN.forEach(step=>{
  while(at<step.n){
   const r=compute();
   /* which addresses this run takes to nothing. recorded before the charge
      can come back, which is why the record survives a hard month. */
   const before=W.filter(n=>n.sq>0).map(n=>n.i);
   const q=release(r,8); at++; rec.runs=at; rec.days+=7;
   /* CONTACT, NOT COMPLETION. meterFirst already stamps an address the first
      time a release touches it, at ui/release.js:126. Keying the record on
      emptied instead gave Gordon nothing for six runs of real work, which is
      the most loaded profile in the roster being told he has done nothing. */
   q.forEach(i=>{rec.touch[i]=1;});
   /* W.sq is only written by compute(), so the after state has to be computed
      rather than read. Reading it straight back off W gave zero addresses
      opened for every persona at every point, which looked like a design
      finding and was a stale read. */
   compute();
   const after={}; W.forEach(n=>{if(n.sq>0)after[n.i]=1;});
   before.forEach(i=>{if(!after[i])rec.addr[i]=1;});
  }
  if(step.hard){harden(step.hard); compute(); rec.days+=30;}
  frames[step.k]=frame(nm,step.nm,rec);
  if(step.hard){/* the hard month is the last frame, so nothing after it */}
 });
 OUT[nm]={nm, age:p.age, role:p.role, says:p.says, frames};
});

/* AND THE BLANK PROFILE, because the app opens on it and every surface that
   prints a reading has to survive somebody who has entered nothing. */
(function(){
 S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=0;S.replace[c]=0;});
 SINAMES.forEach(l=>S.law[l]=6);
 const f=frame('Blank','Nothing entered.',{runs:0,addr:{},touch:{},days:0});
 f.rec.laws=0;
 OUT.Blank={nm:'Blank', age:'', role:'nothing entered', says:'', frames:{m0:f}};
})();

OUT._meta={PAL:PAL, PMBANDS:PMBANDS.map(b=>({k:b.k,nm:b.nm,b:b.b,yp:b.yp,r:b.r,c:b.c})),
 BANDS:BANDS, TIERCOL:TIERCOL,
 SEATLAW:BANDS.reduce((o,b)=>{o[b]=SI.filter(l=>l.b===b).map(l=>l.nm);return o;},{}),
 CHILD:CHILD.map(c=>({nm:c.nm,opp:c.opp,seat:c.seat,addr:c.addr,loc:c.loc})),
 NADDR:BANDS.reduce((o,b)=>{o[b]=W.filter(n=>n.b===b).length;return o;},{}),
 total:W.length};
console.log('window.AVDATA='+JSON.stringify(OUT)+';');
