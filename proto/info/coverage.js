/* ============================================================
   WHERE IS EVERY NAME DEFINED, IF ANYWHERE.

   The first pass of this looked in GLOSS and in the knowledge rows only,
   and reported that the seven seats and the four hyper-complexes are
   defined nowhere. Both were wrong: APC carries 297 to 438 characters per
   seat and HCX_LIB carries a line per hyper-complex. A probe that looks in
   two places and concludes "nowhere" is a probe that lies, which is the
   failure this repo records twice.

   So this walks EVERY table the engine exports, looks for an object whose
   name field equals the term, and reports the longest description field it
   finds and which table held it. Nowhere means nowhere.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const FILE=path.resolve(__dirname,'..','..','source.html');

const SCAN=function(NAMES){
 /* the name fields and the description fields any table in this engine uses */
 var NAMEK=['nm','t','k','b','term','name'], DESCK=['d','v','x','c','def','desc','n'];
 /* every table, by the name the engine knows it by. exportAll is the list the
    engine already keeps of what it holds, so nothing is typed here. */
 /* EVERY TOP LEVEL TABLE, BY NAME, and the names are read off the source
     rather than typed here. A const at the top level of a classic script does
     not appear on window, so the first pass found five tables out of a
     hundred and eleven and concluded the seats are defined nowhere. They are
     defined in APC, which it never opened. eval by identifier is the only way
     to reach a lexical binding, and it is what the honest answer costs. */
 var TABLES={};
 NAMES.forEach(function(k){
  try{var v=eval(k); if(v&&typeof v==='object')TABLES[k]=v;}catch(e){}});
 var terms={};
 var add=function(t,src){t=String(t||'').trim(); if(t.length<2)return;
  var k=t.toLowerCase(); if(!terms[k])terms[k]={t:t, src:src, where:[], best:0, bestIn:''};};
 W.forEach(function(n){add(n.k,'address');});
 CHILD.forEach(function(c){add(c.nm,'fetter'); add(c.opp,'opposite');});
 ALL_SAB.forEach(function(x){add(x.nm,'saboteur');});
 SI.forEach(function(l){add(l.nm,'law');});
 MASKS.forEach(function(m){add(m.nm,'mask');});
 DOMAINS.forEach(function(d){add(d.nm,'domain');});
 ARCH.forEach(function(a){add(a.nm,'archetype');});
 HARM.forEach(function(e){add(e.t,'universal law');});
 GLOSS.forEach(function(g){add(g.t,'glossary');});
 BANDS.forEach(function(b){add(b,'seat');});
 HCX_LIB.forEach(function(h){add(h.nm,'hyper-complex');});

 var look=function(tname, obj, depth){
  if(!obj||depth>3)return;
  if(Array.isArray(obj)){obj.forEach(function(o){look(tname,o,depth+1);});return;}
  if(typeof obj!=='object')return;
  var nm=null;
  NAMEK.forEach(function(k){if(nm==null&&typeof obj[k]==='string')nm=obj[k];});
  if(nm){var e=terms[String(nm).trim().toLowerCase()];
   if(e){var best=0;
    DESCK.forEach(function(k){if(typeof obj[k]==='string'&&obj[k].length>best)best=obj[k].length;});
    if(best>=20){ if(e.where.indexOf(tname)<0)e.where.push(tname);
     if(best>e.best){e.best=best; e.bestIn=tname;} }}}
  /* an object keyed by the term, which is how SABDEF and DOMDEF are shaped */
  Object.keys(obj).forEach(function(k){
   var e=terms[k.trim().toLowerCase()];
   if(e&&obj[k]&&typeof obj[k]==='object'){var best=0;
    DESCK.forEach(function(q){if(typeof obj[k][q]==='string'&&obj[k][q].length>best)best=obj[k][q].length;});
    if(best>=20){if(e.where.indexOf(tname)<0)e.where.push(tname);
     if(best>e.best){e.best=best;e.bestIn=tname;}}}
   if(depth<2&&obj[k]&&typeof obj[k]==='object')look(tname,obj[k],depth+1);});};

 Object.keys(TABLES).forEach(function(t){look(t,TABLES[t],0);});
 /* and the knowledge rows, which are built rather than stored */
 var kb={};
 ['addr','fetter','sab','law','mask','dom','arch','gate','harm','gloss','card'].forEach(function(s){
  try{(kbRows(s)||[]).forEach(function(r){kb[String(r.t).toLowerCase()]=s;});}catch(e){}});
 var gl={}; GLOSS.forEach(function(g){gl[g.t.toLowerCase()]=g.d.length;});
 return {terms:terms, kb:kb, gl:gl, tables:Object.keys(TABLES).length};};

/* the table names, read off the engine source. A list typed into this file
   would go stale the first time a table landed, which is the defect the whole
   repository records. */
const NAMES=(function(){
 const dir=path.resolve(__dirname,'..','..','atuned_src');
 const out={};
 const walk=d=>fs.readdirSync(d,{withFileTypes:true}).forEach(f=>{
  const q=path.join(d,f.name);
  if(f.isDirectory())return walk(q);
  if(!/\.js$/.test(f.name))return;
  const s=fs.readFileSync(q,'utf8');
  let m; const re=/^(?:const|var|let)\s+([A-Z][A-Z0-9_]*)\s*=/gm;
  while((m=re.exec(s)))out[m[1]]=1;});
 walk(path.join(dir,'engine'));
 return Object.keys(out);})();
console.log('table names read off the source: '+NAMES.length);

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const c=await b.newContext({viewport:{width:1600,height:1000}});
 const p=await c.newPage();
 await p.goto('file://'+FILE); await p.waitForTimeout(7000);
 await p.evaluate(()=>{var o=document.querySelector('.ob'); if(o)o.remove();});
 const R=await p.evaluate(new Function('n','return ('+SCAN.toString()+')(n);'),NAMES);
 const T=R.terms, ks=Object.keys(T);
 const pad=(s,n)=>String(s)+' '.repeat(Math.max(0,n-String(s).length));
 console.log('tables scanned: '+R.tables+'   terms: '+ks.length);
 const bySrc={};
 ks.forEach(k=>{const e=T[k], s=e.src;
  const g=!!R.gl[k], row=!!R.kb[k], tab=e.best>=20;
  const b=bySrc[s]||(bySrc[s]={n:0, gloss:0, row:0, table:0, nowhere:0, none:[]});
  b.n++; if(g)b.gloss++; if(row)b.row++; if(tab)b.table++;
  if(!g&&!row&&!tab){b.nowhere++; b.none.push(e.t);}});
 console.log('\n'+pad('kind of name',16)+pad('names',7)+pad('in GLOSS',10)+pad('a kb row',10)+pad('in a table',12)+'defined nowhere');
 let N=0,G=0,RO=0,TA=0,NO=0;
 Object.keys(bySrc).sort((a,b)=>bySrc[b].n-bySrc[a].n).forEach(s=>{const b=bySrc[s];
  N+=b.n;G+=b.gloss;RO+=b.row;TA+=b.table;NO+=b.nowhere;
  console.log(pad(s,16)+pad(b.n,7)+pad(b.gloss,10)+pad(b.row,10)+pad(b.table,12)+b.nowhere
   +(b.none.length?'   '+b.none.slice(0,9).join(', '):''));});
 console.log(pad('ALL',16)+pad(N,7)+pad(G,10)+pad(RO,10)+pad(TA,12)+NO);
 /* and where the longest definition of each kind actually lives */
 const tb={};
 ks.forEach(k=>{const e=T[k]; if(e.bestIn)tb[e.bestIn]=(tb[e.bestIn]||0)+1;});
 console.log('\nthe table that holds the longest definition, by count of names:');
 Object.keys(tb).sort((a,b)=>tb[b]-tb[a]).forEach(t=>console.log('  '+pad(t,18)+tb[t]));
 fs.writeFileSync(path.join(__dirname,'coverage.json'),JSON.stringify({bySrc,terms:T},null,1));
 await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
