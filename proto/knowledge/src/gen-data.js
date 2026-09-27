/* ============================================================
   THE DATA THE FOUR KNOWLEDGE BASE MOCKUPS SHARE.

   Nothing here is written by hand. The entry text is read out of the
   engine's own tables, and the per person figures in icp.json were read
   out of the committed build at b434f1a with loadP(i) then compute(), for
   the six reference profiles in engine/data/people.js. So a figure a
   mockup prints is the figure the shipped app would print for that
   person on the same entry.

   node proto/knowledge/src/gen-data.js [engine.js]  ->  src/data.js

   The engine is read from the path given, default the committed one via
   git, because the working tree engine.js may be mid change by another seat.
   ============================================================ */
const fs=require('fs'), vm=require('vm'), path=require('path'), cp=require('child_process');
const ROOT=path.join(__dirname,'..','..','..');
const src=process.argv[2]?fs.readFileSync(process.argv[2],'utf8')
 :cp.execSync('git show HEAD:engine.js',{cwd:ROOT,maxBuffer:64e6}).toString();
const ctx={console}; vm.createContext(ctx);
vm.runInContext(src+`;this.__={NODES,CHILD,MASKS,ARCH,GLOSS,HCX_LIB,ALL_SAB,SABDEF,
 DOMAINS,DOMDEF,APC,AXCARD,PAL,SEATGLYPH,BANDS,KB_KEY,
 AXLINE:CHILD.map(function(c){return axLine(c.nm);})};`,ctx);
const T=ctx.__;
const clean=s=>String(s==null?'':s).replace(/\s*--\s*/g,', ').replace(/\u2014/g,', ').trim();
/* the first sentence, or two when the first is a fragment under forty
   characters, because E1 wants the definition in the first clause and the
   card only has room for that. */
const lead=s=>{s=clean(s); const m=s.match(/^(.+?[.!?])(\s|$)/); if(!m)return s;
 let a=m[1]; if(a.length<40){const r=s.slice(a.length).trim().match(/^(.+?[.!?])(\s|$)/); if(r)a+=' '+r[1];}
 return a;};

const E=[];   /* every entry, one shape */
const add=o=>{E.push(o); return o;};

/* the seven seats */
T.APC.forEach(c=>add({id:'seat:'+c.b, kind:'seat', nm:c.b, seat:c.b,
 fam:clean(c.nv), def:lead(c.d), body:clean(c.d), ic:null}));

/* the nine child emotions, and the letting go card that speaks each */
T.CHILD.forEach((c,i)=>{const ax=T.AXCARD.filter(a=>a.ax===c.nm)[0]||{};
 add({id:'axis:'+c.nm, kind:'axis', nm:c.nm, seat:c.seat, fam:c.seat+' seat',
  def:c.nm+', one of the nine child emotions, seated in the '+c.seat+' seat.',
  card:'Felt in the '+c.loc+'. Emptied, it fills with '+c.opp+'.',
  where:'Held at: '+c.addr.toLowerCase()+'. Felt in the '+c.loc+'.', says:clean(ax.track), out:clean(T.AXLINE[i]),
  inst:clean(ax.inst), opp:c.opp, ic:c.ic});});

/* the 112 addresses */
T.NODES.forEach(n=>{const field=T.BANDS.indexOf(n.b)<0;
 const seat=field?(n.b==='Field-Above'?'Crown':'Root'):n.b;
 const ax=T.CHILD.filter(c=>c.nm===n.cf)[0];
 add({id:'node:'+n.i, kind:'node', nm:n.k, seat:seat, idx:n.i-1,
  fam:field?'field anchor':n.b+' seat',
  def:n.k+', a fetter held at the '+clean(n.n)+'.',
  where:clean(n.n)+', '+(field?'a field anchor '+(n.b==='Field-Above'?'above':'below')+' the body':'in the '+n.b+' seat')+'.',
  card:'Governs '+clean(n.a).toLowerCase()+'. Distorts into '+clean(n.d).toLowerCase()+'.',
  theme:clean(n.a), distort:clean(n.d), axis:n.cf||null, ic:(ax&&ax.ic)||null});});

/* thirty nine saboteurs, thirty three with the codex's full text */
T.ALL_SAB.forEach(s=>{const d=T.SABDEF[T.KB_KEY(s.nm)];
 const fam=T.HCX_LIB.filter(h=>h.nm===s.hcx)[0];
 add({id:'sab:'+s.nm, kind:'sab', nm:s.nm, seat:(fam&&fam.b)||'Heart',
  fam:s.hcx||'unnamed', def:d?lead(d.d):(fam?s.nm+', a saboteur in the '+fam.nm+' architecture: '+fam.d+'.':s.nm+', a saboteur.'),
  body:d?clean(d.d):'', trigger:d?clean(d.t):'', says:d?clean(d.q):'', out:d?clean(d.i):'',
  nids:s.nids||[], arch:s.hcx||null, ic:(fam&&fam.ic)||null});});

/* six architectures the saboteurs belong to */
T.HCX_LIB.forEach(h=>add({id:'hcx:'+h.nm, kind:'hcx', nm:h.nm, seat:h.b, fam:'architecture',
 def:h.nm+': '+clean(h.d)+'.', sub:clean(h.sub), ic:h.ic}));

/* masks, archetypes, domains */
T.MASKS.forEach(m=>add({id:'mask:'+m.nm, kind:'mask', nm:m.nm, seat:(m.b&&m.b[0])||'Heart',
 fam:(m.b||[]).join(' and '), def:'The '+m.nm.toLowerCase()+' mask '+clean(m.v)+'.', ic:m.ic}));
T.ARCH.forEach((a,i)=>add({id:'arch:'+a.nm, kind:'arch', nm:a.nm, seat:a.b||'Heart', idx:i,
 fam:(a.b||'Heart')+' seat', def:'The '+a.nm.toLowerCase()+' '+clean(a.v)+'.', ic:a.ic}));
T.DOMAINS.forEach((d,i)=>{const x=T.DOMDEF[T.KB_KEY(d.nm)];
 add({id:'dom:'+d.nm, kind:'dom', nm:d.nm, seat:'Heart', idx:i, fam:d.r+' root',
  def:d.nm+', '+clean(d.d)+'.', clear:x?clean(x.c):'', dist:x?clean(x.x):'', ic:d.ic||null});});

/* the glossary, which answers a search first */
T.GLOSS.forEach(g=>add({id:'term:'+g.t, kind:'term', nm:g.t, seat:null, fam:'term',
 def:clean(g.d)}));

/* links, computed from the tables and never typed: an axis links to its
   addresses and its opposite's entry where one exists; an address links to
   its axis, its seat and the saboteurs that sit on it; a saboteur links to
   its addresses and its architecture. */
const by={}; E.forEach(e=>by[e.id]=e);
E.forEach(e=>{e.links=[];});
E.forEach(e=>{
 if(e.kind==='node'){ if(e.axis&&by['axis:'+e.axis])e.links.push('axis:'+e.axis);
  e.links.push('seat:'+e.seat);}
 if(e.kind==='sab'){ e.nids.forEach(i=>{const n='node:'+i; if(by[n]){e.links.push(n); by[n].links.push(e.id);}});
  if(e.arch&&by['hcx:'+e.arch]){e.links.push('hcx:'+e.arch); by['hcx:'+e.arch].links.push(e.id);}}
 if(e.kind==='axis'){ E.filter(n=>n.kind==='node'&&n.axis===e.nm).forEach(n=>e.links.push(n.id));
  e.links.unshift('seat:'+e.seat);}
 if(e.kind==='seat'){ E.filter(x=>x.kind==='axis'&&x.seat===e.nm).forEach(x=>e.links.push(x.id));}
});
E.forEach(e=>{e.links=[...new Set(e.links)].filter(l=>l!==e.id);});

const icp=JSON.parse(fs.readFileSync(path.join(__dirname,'icp.json'),'utf8'));
const out={entries:E, pal:T.PAL, glyph:T.SEATGLYPH, bands:T.BANDS, icp:icp,
 stamp:'engine tables and ICP figures read from commit b434f1a'};
const txt='/* generated by gen-data.js. Do not edit. */\nvar KBD='+JSON.stringify(out)+';\n';
if(/\u2014/.test(txt)){console.error('em dash in generated data');process.exit(1);}
fs.writeFileSync(path.join(__dirname,'data.js'),txt);
const k={}; E.forEach(e=>k[e.kind]=(k[e.kind]||0)+1);
console.log('  data.js '+txt.length+' bytes, entries by kind '+JSON.stringify(k));
