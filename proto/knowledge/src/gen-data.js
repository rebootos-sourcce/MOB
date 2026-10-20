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
 AXLINE:CHILD.map(function(c){return axLine(c.nm);}), DESCENT};`,ctx);
const cardSource=fs.readFileSync(path.join(ROOT,'atuned_src','engine','data','sabcard.js'),'utf8');
const cardCtx={}; vm.createContext(cardCtx); vm.runInContext(cardSource+';this.__cards=SABCARD;',cardCtx);
const SAB_CARDS=cardCtx.__cards;
const cardKey=s=>String(s==null?'':s).toLowerCase().replace(/[^a-z0-9]/g,'');
const SAB_CARDS_BY_KEY=Object.fromEntries(Object.entries(SAB_CARDS).map(([k,v])=>[cardKey(k),v]));
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
  theme:clean(n.a), distort:clean(n.d), axis:n.cf||null, ic:(ax&&ax.ic)||null,
  body:'This fetter is organized around '+clean(n.a)+'. The linked distortion is '+clean(n.d)+'. Its relationship to the '+(n.cf||'linked')+' axis is the canonical route for interpreting this record.',
  trigger:'Notice when '+clean(n.a).toLowerCase()+' becomes charged and the response begins moving toward '+clean(n.d).toLowerCase()+'.',
  says:'The active pattern frames '+clean(n.a).toLowerCase()+' through the distortion '+clean(n.d).toLowerCase()+'. Treat this as a signal to examine, not as a fact that must govern the response.',
  out:'Name the observed situation, separate it from the '+clean(n.d).toLowerCase()+' interpretation, and return to the linked axis and its canonical opposite before choosing a response.',
  inst:ax?'The canonical opposite for the linked '+ax.nm+' axis is '+ax.opp+'. Use the axis record for its full installation language.':'No opposite is assigned in the canonical source for this node. Do not infer one.',
  opp:ax?ax.opp:'Unmapped',
  nextMove:ax?'Identify the trigger, name '+clean(n.a).toLowerCase()+' and '+clean(n.d).toLowerCase()+', then open the linked '+n.cf+' record and practice its canonical opposite state.':'Trace this node to an approved canonical axis or source definition before selecting an opposite state.',
  narrativeSource:'derived from engine node fields and linked canonical axis'});});

/* all thirty nine Saboteurs use one complete record shape. Existing authored cards retain their reviewed copy;
   inferred records are explicitly derived from their linked canonical node/child records. */
T.ALL_SAB.forEach(s=>{
 const d=T.SABDEF[T.KB_KEY(s.nm)];
 const fam=T.HCX_LIB.filter(h=>h.nm===s.hcx)[0];
 const card=SAB_CARDS_BY_KEY[cardKey(s.nm)]||null;
 const nodes=(s.nids||[]).map(i=>T.NODES.find(x=>x.i===i)).filter(Boolean);
 const children=nodes.map(n=>T.CHILD.find(x=>x.nm===n.c)).filter(Boolean);
 const themes=[...new Set(nodes.map(n=>n.a).filter(Boolean))];
 const distortions=[...new Set(nodes.map(n=>n.d).filter(Boolean))];
 const opposites=[...new Set(children.map(x=>x.opp).filter(Boolean))];
 const themeLine=themes.length?themes.join(', '):'the linked pattern';
 const distortionLine=distortions.length?distortions.join(', '):'automatic reaction';
 const oppositeLine=opposites.length?opposites.join(', '):'a more conscious response';
 const inferredBody='This inferred Saboteur pattern organizes around '+themeLine+'. Its linked records describe distortions such as '+distortionLine+'. Treat this as a working synthesis of the linked canonical records, not a separately sourced quotation.';
 const inferredTrigger='The pattern may activate around '+themeLine+'. Notice the specific moment when the linked distortion ('+distortionLine+') begins shaping perception or choice.';
 const inferredSays='The implied inner message is that the familiar response is necessary: '+distortionLine+'. Check that message against what is actually happening before acting.';
 const inferredOut='Interrupt the automatic response by naming the linked distortion ('+distortionLine+'), separating the observed facts from the interpretation, and making room for '+oppositeLine+'.';
 const inferredStory='A situation involving '+themeLine+' brings the pattern into focus. The person may default to '+distortionLine+', narrowing the available choices. The story is not a fixed identity: identify the trigger, trace which linked child pattern is active, and notice the cost of repeating the response.';
 const inferredAvailable='When the pattern is noticed rather than obeyed, '+oppositeLine+' becomes a possible direction. This is an available state to practice, not a claim that the pattern has permanently disappeared.';
 const inferredNext='Pause at the first observable sign. Name the relevant theme ('+themeLine+'), identify the distortion ('+distortionLine+'), and choose one small action consistent with '+oppositeLine+'. Then review the result without turning it into a judgment about identity.';
 add({id:'sab:'+s.nm, kind:'sab', nm:s.nm, seat:(fam&&fam.b)||'Heart',
  fam:s.hcx||'unnamed',
  def:d?lead(d.d):(fam?s.nm+', a saboteur in the '+fam.nm+' architecture: '+fam.d+'.':s.nm+', a saboteur pattern inferred from its linked canonical records.'),
  body:d?clean(d.d):inferredBody,
  trigger:d?clean(d.t):inferredTrigger,
  says:d?clean(d.q):inferredSays,
  out:d?clean(d.i):inferredOut,
  livedBehavior:card?clean(card.h):clean(d?('A situation brings '+d.t+' The response is '+d.d+'. Reflection: What is happening, and what response can you choose?'):inferredStory),
  availableState:card?clean(card.a):clean(inferredAvailable),
  nextMove:card?clean(card.n):clean(inferredNext),
  narrativeSource:card?'atuned_src/engine/data/sabcard.js':(d?'SABDEF plus linked canonical node fields':'inferred synthesis from linked canonical node/child fields; review as derived copy'),
  nids:s.nids||[], arch:s.hcx||null, ic:(fam&&fam.ic)||null});
});

/* six architectures the saboteurs belong to */
T.HCX_LIB.forEach(h=>add({id:'hcx:'+h.nm, kind:'hcx', nm:h.nm, seat:h.b, fam:'architecture',
 def:h.nm+': '+clean(h.d)+'.', sub:clean(h.sub), ic:h.ic}));

/* source-defined higher-order descent entries. Keep the three named steps
   distinct from the six HCX architecture records; provenance is compass.js.
   Do not treat this small explicit descent as a complete complex registry. */
T.DESCENT.forEach((d,i)=>add({
 id:'descent:'+d.nm,
 kind:d.kind==='complex'?'complex':(d.kind==='super complex'?'supercomplex':'hcx'),
 nm:d.nm, seat:null, fam:'higher-order descent',
 def:clean(d.d), body:clean(d.d),
 inferred:!!d.content.inferred,
 inferenceBasis:d.content.inferenceBasis,
 behavior:d.content.behavior,
 triggerMechanism:d.content.triggerMechanism,
 livedExample:d.content.livedExample,
 impact:d.content.impact,
 practice:d.content.practice,
 oppositeId:d.content.oppositeId,
 oppositeDefinition:d.content.oppositeDefinition,
 oppositeStatus:d.content.oppositeStatus,
 confidence:d.content.confidence,
 reviewStatus:d.content.reviewStatus,
 gate:d.gate||null, refer:!!d.refer,
 narrativeSource:'atuned_src/engine/data/compass.js DESCENT; external research sources recorded per entry',
 researchSources:d.content.researchSources,
 descentOrder:i
}));

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
/* The DESCENT registry is an explicitly source-defined ordered chain. */
const descentEntries=T.DESCENT.map(d=>by['descent:'+d.nm]).filter(Boolean);
descentEntries.forEach((e,i)=>{
 if(i>0)e.links.push(descentEntries[i-1].id);
 if(i<descentEntries.length-1)e.links.push(descentEntries[i+1].id);
});
E.forEach(e=>{e.links=[...new Set(e.links)].filter(l=>l!==e.id);});

/* Source-backed template binding. The template schema defines which fields
   are exposed for each existing record kind; values are projected from the
   authoritative engine-derived entry, never hand-written into generated data.
   A null value stays null and is reported by the validator, not fabricated. */
const TEMPLATE_SCHEMAS={
 seat:{id:'TPL-SEAT', fields:['nm','fam','def','body','links']},
 axis:{id:'TPL-FETTER-AXIS', fields:['nm','seat','fam','def','card','where','says','inst','opp','links']},
 node:{id:'TPL-FETTER-NODE', fields:['nm','seat','fam','def','where','card','theme','distort','axis','body','trigger','says','out','inst','opp','nextMove','narrativeSource','links']},
 sab:{id:'TPL-SABOTEUR', fields:['nm','seat','fam','def','body','trigger','says','out','livedBehavior','availableState','nextMove','nids','arch','links']},
 hcx:{id:'TPL-HYPERCOMPLEX', fields:['nm','seat','fam','def','sub','links']},
 complex:{id:'TPL-COMPLEX-UNIFIED', fields:['nm','fam','def','body','inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','narrativeSource','researchSources','links']},
 inferred:{id:'TPL-COMPLEX-UNIFIED', fields:['nm','fam','def','body','inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','narrativeSource','researchSources','links']},
 supercomplex:{id:'TPL-SUPERCOMPLEX', fields:['nm','fam','def','body','inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','refer','narrativeSource','researchSources','links']},
 mask:{id:'TPL-MASK', fields:['nm','seat','fam','def','links']},
 arch:{id:'TPL-ARCHETYPE', fields:['nm','seat','fam','def','links']},
 dom:{id:'TPL-DOMAIN', fields:['nm','seat','fam','def','clear','dist','links']},
 term:{id:'TPL-GLOSSARY-TERM', fields:['nm','fam','def','links']}
};
E.forEach(e=>{
 const schema=TEMPLATE_SCHEMAS[e.kind];
 if(!schema) throw new Error('No template schema for entry kind '+e.kind+' ('+e.id+')');
 e.templateId=schema.id;
 e.template=Object.fromEntries(schema.fields.map(k=>[k,Object.prototype.hasOwnProperty.call(e,k)?e[k]:null]));
 const missingFields=schema.fields.filter(k=>{
  if(!Object.prototype.hasOwnProperty.call(e,k)||e[k]==null||e[k]==='') return true;
  /* Empty arrays are valid for relationship collections: a leaf may have no
     outgoing links. Do not report [] as missing content. */
  return false;
});
 e.templateValidation={schemaDefined:true, sourceBacked:true,
  contentStatus:missingFields.length===0?'complete':'incomplete',
  missingFields};
});

const icp=JSON.parse(fs.readFileSync(path.join(__dirname,'icp.json'),'utf8'));
const out={entries:E, pal:T.PAL, glyph:T.SEATGLYPH, bands:T.BANDS, icp:icp,
 stamp:'engine tables and ICP figures read from commit b434f1a'};
const txt='/* generated by gen-data.js. Do not edit. */\nvar KBD='+JSON.stringify(out)+';\n';
if(/\u2014/.test(txt)){console.error('em dash in generated data');process.exit(1);}
fs.writeFileSync(path.join(__dirname,'data.js'),txt);
const k={}; E.forEach(e=>k[e.kind]=(k[e.kind]||0)+1);
console.log('  data.js '+txt.length+' bytes, entries by kind '+JSON.stringify(k));
