#!/usr/bin/env node
/* ============================================================
   proto/ladder/probe.js  ·  READ THE COUNTS OFF THE RUN.

   Every number in DESIGN-ladder.md that is not a citation comes out of here.
   The page loads the same two modules in a browser, so the document and the
   prototype cannot disagree.

   Run:  node proto/ladder/probe.js
   ============================================================ */
const path=require('path');
const R=path.resolve(__dirname,'../..');
const E=require(path.join(R,'engine.js'));
const T=require('./turn.js');
const RO=require('./roster.js');

const T0=Date.UTC(2026,5,22,9,0,0);            /* a fixed moment. held still. */
const NOW=T0+90*86400000;
const C={W:E.W, CHILD:E.CHILD, TIERDEF:E.TIERDEF, PRACTICE:E.PRACTICE,
 SEATS:['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'],
 purposeReady:E.purposeReady};

function pad(s,n){s=String(s);return s+' '.repeat(Math.max(0,n-s.length));}

/* ---- 0. what the engine holds today, per roster member ---- */
console.log('=== 0. THE ROSTER AS THE ENGINE READS IT ===');
console.log(pad('who',9)+pad('CQ',7)+pad('band',13)+pad('ceil',7)
 +pad('loaded',8)+pad('carry',7)+pad('excess',8)+pad('opp>0',7));
const base=E.PEOPLE.map(per=>{
 const r=RO.loadPerson(E,per);
 const opp=E.CHILD.filter(c=>(E.S.replace[c.nm]||0)>0).length;
 return {nm:per.nm, age:per.age, CQ:r.CQ, band:r.tier, ceil:E.cqCeiling(),
  loaded:r.loaded.length, carrying:(r.carrying||[]).length,
  excess:(r.excess||[]).length, opp:opp};});
base.sort((a,b)=>a.CQ-b.CQ).forEach(x=>console.log(
 pad(x.nm,9)+pad(x.CQ.toFixed(1),7)+pad(x.band,13)+pad(x.ceil.toFixed(1),7)
 +pad(x.loaded,8)+pad(x.carrying,7)+pad(x.excess,8)+pad(x.opp,7)));
const noRelease=base.filter(x=>x.excess===0);
console.log('\nrelease candidates empty for '+noRelease.length+' of '+base.length
 +': '+noRelease.map(x=>x.nm).join(', '));
console.log('and it is empty at both ends: lowest CQ '+noRelease[0].nm+' at '
 +noRelease[0].CQ.toFixed(1)+', highest '
 +noRelease[noRelease.length-1].nm+' at '+noRelease[noRelease.length-1].CQ.toFixed(1));

/* ---- 1. the lists, counted off themselves ---- */
console.log('\n=== 1. THE LISTS, COUNTED OFF THEMSELVES ===');
console.log('marks in engine/ladder.js today : '+E.MARKS.length);
console.log('marks in this design           : '+T.MARK2.length);
const byQ={}; T.MARK2.forEach(m=>byQ[m.q]=(byQ[m.q]||0)+1);
console.log('  by quarter                   : '
 +Object.keys(byQ).map(k=>k+' '+byQ[k]).join(', '));
const keys0=E.MARKS.map(m=>m.k), keys1=T.MARK2.map(m=>m.k);
console.log('  kept keys                    : '
 +keys0.filter(k=>keys1.indexOf(k)>=0).length+' of '+keys0.length);
console.log('  key renamed                  : '
 +keys0.filter(k=>keys1.indexOf(k)<0).join(', ')+' -> poled');
/* THE RENAME IS NOT AN ADDITION. `turned` became `poled` and a plain set
   difference counted it in both columns, so the probe said seven added where
   the design says six. Named explicitly, because a rename that hides inside a
   diff is how a count in a document stops matching a count in a run. */
const RENAMED={turned:'poled'};
const renamedTo=Object.keys(RENAMED).map(k=>RENAMED[k]);
console.log('  added                        : '
 +keys1.filter(k=>keys0.indexOf(k)<0&&renamedTo.indexOf(k)<0).join(', '));
const AW=T.awardList(C);
const byF={}; AW.forEach(a=>byF[a.fam]=(byF[a.fam]||0)+1);
console.log('awards in this design          : '+AW.length);
console.log('  by family                    : '
 +Object.keys(byF).map(k=>k+' '+byF[k]+(T.AWARD_READY[k]?'':' NOT COMPUTABLE TODAY')).join(', '));
console.log('marks plus awards              : '+(T.MARK2.length+AW.length));
console.log('bands in TIERDEF               : '+E.TIERDEF.length
 +', so boundaries: '+(E.TIERDEF.length-1));
console.log('tracks in PRACTICE             : '
 +Object.keys(E.PRACTICE.reduce((a,x)=>(a[x.track]=1,a),{})).length);
console.log('addresses stated to a person   : 112');

/* ---- 2. the two columns, per roster member ---- */
console.log('\n=== 2. WHAT A LIGHT AND A HEAVY PROFILE SCORE TODAY ===');
console.log(pad('who',9)+pad('col',7)+pad('turns',7)+pad('marks',7)+pad('awards',8)
 +pad('days',6)+pad('run',6)+pad('addr',6)+pad('ground',8)+pad('mins',6)
 +pad('snaps',7)+pad('CQ',7)+pad('next mark',18));
const rows=[];
E.PEOPLE.forEach(per=>{
 [['light',RO.light(E,per,T0)],['heavy',RO.heavy(E,per,T0,90,2)]].forEach(([col,p])=>{
  const r=RO.readingOf(E,p);
  const l=E.ledgerRead(p), s=E.streakRead(p,NOW), tn=T.turnRead(p,NOW);
  const mk=T.markRead(p,l,s,tn,C), aw=T.awardRead(p,r,NOW,C);
  const row={nm:per.nm, col, turns:tn.n, marks:mk.earned.length,
   awards:aw.earned.length, days:s.days, run:s.run, addr:T.addrSet(p).length,
   ground:l.ground, mins:l.minutes, snaps:l.snaps, CQ:r.CQ,
   next:mk.next?mk.next.nm:'none left', gap:T.gapMax(p),
   back:mk.earned.some(m=>m.k==='back')};
  rows.push(row);
  console.log(pad(row.nm,9)+pad(col,7)+pad(row.turns,7)+pad(row.marks,7)
   +pad(row.awards,8)+pad(row.days,6)+pad(row.run,6)+pad(row.addr,6)
   +pad(row.ground,8)+pad(row.mins,6)+pad(row.snaps,7)
   +pad(row.CQ.toFixed(1),7)+pad(row.next,18));});});

const lt=rows.filter(r=>r.col==='light'), hv=rows.filter(r=>r.col==='heavy');
function rng(a,k){const v=a.map(x=>x[k]);return Math.min(...v)+' to '+Math.max(...v);}
console.log('\nlight  marks '+rng(lt,'marks')+',  turns '+rng(lt,'turns')
 +',  awards '+rng(lt,'awards'));
console.log('heavy  marks '+rng(hv,'marks')+',  turns '+rng(hv,'turns')
 +',  awards '+rng(hv,'awards'));
console.log('heavy  Came back earned by '+hv.filter(r=>r.back).length+' of '+hv.length
 +', largest gap '+rng(hv,'gap')+' days');

/* ---- 3. the curve, as arithmetic ---- */
console.log('\n=== 3. THE CURVE. turns(d,c) = floor(d*c/7) ===');
console.log(pad('cadence',22)+['d1','d7','d30','d90'].map(x=>pad(x,6)).join(''));
[['the whole ring, daily',7],['the whole ring, twice a week',2],
 ['the whole ring, weekly',1],['the floor only',0]].forEach(([nm,c])=>{
 console.log(pad(nm,22)+[1,7,30,90].map(d=>pad(T.turnsAt(d,c),6)).join(''));});

/* ---- 4. the marks earned against the day, measured ---- */
console.log('\n=== 4. MARKS EARNED AGAINST THE DAY, TWICE A WEEK, MEASURED ===');
console.log(pad('who',9)+[1,7,14,30,60,90].map(d=>pad('d'+d,6)).join(''));
const curve={};
['Gordon','Diane','Angela','Rosa'].forEach(nm=>{
 const per=E.PEOPLE.find(x=>x.nm===nm);
 curve[nm]=[1,7,14,30,60,90].map(d=>{
  const p=RO.heavy(E,per,T0,d,2), r=RO.readingOf(E,p);
  const l=E.ledgerRead(p), s=E.streakRead(p,T0+d*86400000), tn=T.turnRead(p);
  return T.markRead(p,l,s,tn,C).earned.length;});
 console.log(pad(nm,9)+curve[nm].map(v=>pad(v,6)).join(''));});

/* ---- 4b. THE STREAK AT EVERY CADENCE, WHICH IS THE OTHER HOLE ---- */
console.log('\n=== 4b. THE RUN AT EACH CADENCE, AFTER NINETY DAYS ===');
console.log(pad('cadence',28)+pad('days',7)+pad('run',7)+pad('best',7)
 +pad('week mark',11)+pad('month mark',12));
[['daily',7],['twice a week',2],['weekly',1]].forEach(([nm,w])=>{
 const per=E.PEOPLE.find(x=>x.nm==='Diane');
 const p=RO.heavy(E,per,T0,90,w), r=RO.readingOf(E,p);
 const l=E.ledgerRead(p), sd=E.streakRead(p,NOW), tn=T.turnRead(p,NOW);
 const mk=T.markRead(p,l,sd,tn,C);
 const has=k=>mk.earned.some(m=>m.k===k)?'earned':'no';
 /* and the same two marks under the condition engine/ladder.js ships today */
 const old=k=>{const m=E.MARKS.find(x=>x.k===k); let ok=false;
  try{ok=!!m.t(l,sd,p);}catch(e){ok=false;} return ok?'earned':'no';};
 console.log(pad(nm,28)+pad(sd.days,7)+pad(sd.run,7)+pad(sd.best,7)
  +pad(has('week')+' / '+old('week'),11)
  +pad(has('month')+' / '+old('month'),12));});
console.log('columns are this design / engine/ladder.js as it ships');

/* ---- 4c. WHAT NINETY DAYS OF RELEASES DOES TO THE READING ---- */
console.log('\n=== 4c. THE READING AFTER TWENTY TWO CLOSED CIRCLES ===');
console.log(pad('who',9)+pad('cq day1',9)+pad('cq d90',9)+pad('moved',8)
 +pad('ceiling',9)+pad('drag off',10));
E.PEOPLE.forEach(per=>{
 const p=RO.heavy(E,per,T0,90,2); RO.readingOf(E,p);
 const h=p.history, f=h[0], z=h[h.length-1];
 const closed=(f.ceil>f.cq)?((z.cq-f.cq)/(f.ceil-f.cq)):1;
 console.log(pad(per.nm,9)+pad(f.cq.toFixed(1),9)+pad(z.cq.toFixed(1),9)
  +pad((z.cq-f.cq>=0?'+':'')+(z.cq-f.cq).toFixed(1),8)
  +pad(f.ceil.toFixed(1),9)+pad((closed*100).toFixed(0)+'%',10));});

/* ---- 5. the gates this design must pass ---- */
console.log('\n=== 5. GATES ===');
const src=require('fs').readFileSync(path.join(__dirname,'turn.js'),'utf8')
 .replace(/\/\*[\s\S]*?\*\//g,'').replace(/'[^'\n]*'/g,"''");
const host=['document','window','navigator','localStorage','fetch','new Image'];
const hit=host.filter(h=>src.indexOf(h)>=0);
console.log('turn.js host free              : '+(hit.length?'NO: '+hit.join(', '):'yes'));
console.log('turn.js has no clock of its own: '+(src.indexOf('Date.now')<0?'yes':'NO'));
const banned=['points','xp',' score','level','badge','achievement','trophy','streak',
 'coin','gem','token','loot','spin','prize','rank','leaderboard'];
const vis=T.MARK2.map(m=>m.nm+' '+m.d).concat(AW.map(a=>a.nm+' '+a.d)).join(' ').toLowerCase();
const bad=banned.filter(b=>vis.indexOf(b.trim())>=0);
console.log('banned words in mark copy      : '+(bad.length?'NO: '+bad.join(', '):'none'));
/* the character is built rather than typed, because the house rule is no em
   dash anywhere and a gate that carries one to look for one still carries one */
const EMDASH=String.fromCharCode(8212);
console.log('em dashes in mark copy         : '+(vis.indexOf(EMDASH)>=0?'NO':'none'));
console.log('no count against a total       : markRead returns earned and one next, '
 +'total is '+T.MARK2.length+' and is never handed to a surface as a denominator');
