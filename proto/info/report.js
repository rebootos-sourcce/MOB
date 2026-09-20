/* ============================================================
   PASS 0 FIRST, THEN THE REPORT.

   Pass 0 re-derives the numbers DESIGN-tooltip.md measured, by the same
   definitions, off demand.json. If they do not come back the harness is
   wrong and nothing below it is worth reading.
   ============================================================ */
const fs=require('fs'), path=require('path');
const R=JSON.parse(fs.readFileSync(path.join(__dirname,'demand.json'),'utf8'));
const D=R.runs.desktop, P=R.runs.phone;
const pad=(s,n)=>String(s)+' '.repeat(Math.max(0,n-String(s).length));
const rpad=(s,n)=>' '.repeat(Math.max(0,n-String(s).length))+String(s);

console.log('FILE '+R.file+'  md5 '+R.md5+'  commit '+R.commit+'  tree '+R.dirty);
console.log('canonical terms read off the engine: '+D.terms);
console.log('glossary defines: '+D.cover.gloss+'   knowledge rows: '+D.cover.kb);
console.log('page errors: '+(D.errs.length?D.errs.join(' | '):'none'));

/* ---------- PASS 0. THE KNOWN GOOD CASE ---------- */
const KNOWN={'Energetics':89,'Field':98,'Knowledge':93,'Summary':142,'Ritual':89,
 'Body':94,'Games':93,'Settings':8,'Story':198,'Compass':108};
console.log('\n== PASS 0. VALIDATION AGAINST DESIGN-tooltip.md ==');
console.log(pad('surface',12)+rpad('audit',7)+rpad('here',7)+'  delta');
/* THE AUDIT'S "195" IS A COUNT OF DISTINCT STRINGS, not of occurrences,
   because it is stated as "of those" under the 259 distinct. A first pass
   here summed occurrences across ten surfaces and got 739, which is the same
   defect as counting the shared rails nine times. Distinct, keyed on the
   string, and a string is static only when no carrier of it is ever
   focusable on any surface. */
let only=0, statics=0, aria=0, tipped=0, tot=0, T={};
for(const nm of Object.keys(D.surfaces)){
 const s=D.surfaces[nm]; tot+=s.titles.length; aria+=s.aria;
 s.titles.forEach(t=>{
  const r=T[t.s]||(T[t.s]={tip:false, focus:false, lone:true});
  if(t.tip)r.tip=true;
  if(t.focus||t.act)r.focus=true;
  if(!(t.s.length>=24 && !t.tip && (t.txt.indexOf(t.s.slice(0,24))<0)))r.lone=false;});
 const k=KNOWN[nm]; if(k!==undefined)console.log(pad(nm,12)+rpad(k,7)+rpad(s.titles.length,7)+'  '+(s.titles.length-k>0?'+':'')+(s.titles.length-k));
}
const dn=Object.keys(T).length;
Object.keys(T).forEach(k=>{if(T[k].lone){only++; if(!T[k].focus)statics++;} if(T[k].tip)tipped++;});
console.log('\n'+pad('distinct title strings',30)+rpad('259 audit',12)+rpad(dn,8));
console.log(pad('definitions only in a title',30)+rpad('195 audit',12)+rpad(only,8));
console.log(pad('of those, not focusable',30)+rpad('27 audit',12)+rpad(statics,8));
console.log(pad('aria-describedby',30)+rpad('0 audit',12)+rpad(aria,8));
console.log(pad('distinct titles with data-tip',30)+rpad('8 audit',12)+rpad(tipped,8));
let dtipS={};
for(const nm of Object.keys(D.surfaces))D.surfaces[nm].carriers.forEach(c=>{
 if(c.route.indexOf('tip')>=0)dtipS[c.cls+'|'+c.txt]=1;});
console.log(pad('distinct data-tip carriers',30)+rpad('8 audit',12)+rpad(Object.keys(dtipS).length,8));
console.log(pad('title occurrences, all surfaces',30)+rpad('1012 sum',12)+rpad(tot,8));
/* ---------- THE DEMAND ---------- */
const KS=['word','number','reading','control','next'];
function tally(run){
 const out={};
 for(const nm of Object.keys(run.surfaces)){
  const s=run.surfaces[nm], row={};
  KS.forEach(k=>row[k]={n:0,routed:0,none:0});
  s.carriers.forEach(c=>{const r=row[c.k]; if(!r)return; r.n++;
   if(c.route.length)r.routed++; else r.none++;});
  out[nm]=row;}
 return out;}
const TD=tally(D), TP=tally(P);

console.log('\n== THE DEMAND, MEASURED. 1600 x 1000, Lance loaded ==');
console.log(pad('surface',12)+KS.map(k=>rpad(k,10)).join('')+rpad('total',9)+rpad('no route',10));
let G={}; KS.forEach(k=>G[k]={n:0,none:0}); let gt=0, gn=0;
for(const nm of Object.keys(TD)){
 const r=TD[nm]; let t=0,nn=0;
 KS.forEach(k=>{t+=r[k].n; nn+=r[k].none; G[k].n+=r[k].n; G[k].none+=r[k].none;});
 gt+=t; gn+=nn;
 console.log(pad(nm,12)+KS.map(k=>rpad(r[k].n,10)).join('')+rpad(t,9)+rpad(nn,10));}
console.log(pad('ALL',12)+KS.map(k=>rpad(G[k].n,10)).join('')+rpad(gt,9)+rpad(gn,10));
console.log('\nper kind, and how many cannot be answered today:');
console.log(pad('kind',10)+pad('question',34)+rpad('carriers',10)+rpad('no route',10)+rpad('share',8));
KS.forEach(k=>console.log(pad(k,10)+pad(R.kinds[k],34)+rpad(G[k].n,10)+rpad(G[k].none,10)
 +rpad((G[k].n?(100*G[k].none/G[k].n).toFixed(0):'0')+'%',8)));

/* which route answers which kind today */
console.log('\nroutes in use, desktop, by kind:');
const RT={};
for(const nm of Object.keys(D.surfaces))D.surfaces[nm].carriers.forEach(c=>{
 const key=c.k+' | '+(c.route.length?c.route.join('+'):'NONE');
 RT[key]=(RT[key]||0)+1;});
Object.keys(RT).sort((a,b)=>RT[b]-RT[a]).slice(0,22).forEach(k=>console.log('  '+pad(k,30)+rpad(RT[k],7)));

/* the phone delta: what a coarse pointer loses */
console.log('\n== 390 x 844, same profile ==');
let pt=0,pn=0; let PG={}; KS.forEach(k=>PG[k]={n:0,none:0});
for(const nm of Object.keys(TP)){const r=TP[nm];
 KS.forEach(k=>{pt+=r[k].n; pn+=r[k].none; PG[k].n+=r[k].n; PG[k].none+=r[k].none;});}
console.log('carriers '+pt+'   no route '+pn);
KS.forEach(k=>console.log('  '+pad(k,10)+rpad(PG[k].n,8)+rpad(PG[k].none,8)));

/* overlap, so the priority order is not hiding anything */
const OV={};
for(const nm of Object.keys(D.surfaces))D.surfaces[nm].carriers.forEach(c=>{
 if(c.overlap.length>1){const k=c.overlap.join('+'); OV[k]=(OV[k]||0)+1;}});
console.log('\ncarriers that raise more than one question (priority order applied):');
Object.keys(OV).sort((a,b)=>OV[b]-OV[a]).forEach(k=>console.log('  '+pad(k,34)+rpad(OV[k],7)));

/* ---------- VOCABULARY COVERAGE ---------- */
const seen={}, srcs={};
for(const nm of Object.keys(D.surfaces))D.surfaces[nm].carriers.forEach(c=>{
 if(c.k==='word'||c.term){seen[c.txt.toLowerCase()]=1; if(c.term)srcs[c.term]=(srcs[c.term]||0)+1;}});
console.log('\ndistinct canonical terms actually on screen: '+Object.keys(seen).length+' of '+D.terms);
console.log('by table: '+Object.keys(srcs).sort((a,b)=>srcs[b]-srcs[a]).map(k=>k+' '+srcs[k]).join(', '));
