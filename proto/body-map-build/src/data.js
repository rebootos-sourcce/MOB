/* The body map prototype's data, derived, not typed.

   node proto/body-map-build/src/data.js      (from anywhere; paths resolve
                                               off this file)
   Writes src/data.json. build.js embeds it into the page.

   Every table here is read at run time from where it already lives:
     atuned_src/engine/data/nodes.js    NODES, SAB_LIB, HCX_LIB
     atuned_src/engine/data/canon.js    CHILD, the nine fetters and their marks
     atuned_src/engine/data/people.js   PEOPLE, for the mock profiles
     atuned_src/engine/data/practice.js PAINREG, the nine region lines
     proto/body-map-spec/gen.js         every address's place and view
     proto/body-map-spec/merge.js       the 48 regions, as the spec drew them
     proto/body-map-spec/nervous-figures.json   the approved man, option A

   gen.js writes its own metrics and plates when it is required, with a
   timestamp, so its writes are stubbed here: this script must not dirty the
   spec's folder. Nothing in atuned_src is written. */
const fs=require('fs'), path=require('path');
const HERE=__dirname, ROOT=path.resolve(HERE,'..','..','..');
const rd=f=>fs.readFileSync(path.join(ROOT,f),'utf8');

/* borrow gen.js without letting it write */
const realWrite=fs.writeFileSync;
fs.writeFileSync=function(p){ if(String(p).includes('body-map-spec'))return; return realWrite.apply(fs,arguments); };
const GEN=require(path.join(ROOT,'proto/body-map-spec/gen.js'));
fs.writeFileSync=realWrite;
const {G,pts,CM}=GEN;

/* engine tables, evaluated without a host */
function grab(file,names){
 const src=rd(file).replace(/^\s*(const|let)\s+/gm,'var ');
 return new Function(src+';return {'+names.map(n=>n+':typeof '+n+'!=="undefined"?'+n+':null').join(',')+'};')();}
const nodesT=grab('atuned_src/engine/data/nodes.js',['NODES','SAB_LIB','HCX_LIB']);
const canonSrc=rd('atuned_src/engine/data/canon.js');
const CHILD=eval(canonSrc.match(/const CHILD=(\[[\s\S]*?\]);/)[1]);
const PEOPLE=eval(rd('atuned_src/engine/data/people.js').match(/const PEOPLE=(\[[\s\S]*?\}\]);/)[1]);

/* the 48 regions, lifted from merge.js so the two cannot drift */
const mergeSrc=rd('proto/body-map-spec/merge.js');
const REG=new Function(mergeSrc.match(/const FRONT=[\s\S]*?(?=const area)/)[0]+';return {FRONT,BACK};')();

/* the approved figure, taken apart into layers so each can be dulled on its own */
const NF=JSON.parse(rd('proto/body-map-spec/nervous-figures.json'));
const CLS={'#EFEDE8':'cns','#7EB8D4':'auto','#C2A063':'som'};
function layers(inner){
 const out=[];
 const re=/<(path|circle)([^>]*?)(?:\/>|>(?:<title>([^<]*)<\/title>)?<\/\1>)/g; let m;
 while((m=re.exec(inner))){
  const a=m[2], at=k=>{const r=a.match(new RegExp('\\s'+k+'="([^"]*)"'));return r?r[1]:null;};
  if(/class="body"/.test(a))continue;                   /* the outline comes from BODYPATH */
  const st=at('stroke'), nm=m[3]||at('data-nm')||'';
  let kind=CLS[st]||'seat';
  if(kind==='seat'&&m[1]==='path')kind='flow';          /* the dashed line up the spine */
  const e={t:m[1],k:kind,s:st,w:+(at('stroke-width')||0.15),o:+(at('stroke-opacity')||at('opacity')||1),nm};
  const fill=at('fill'); if(fill&&fill!=='none')e.f=fill;
  const da=at('stroke-dasharray'); if(da)e.da=da;
  if(m[1]==='path')e.d=at('d'); else {e.cx=+at('cx');e.cy=+at('cy');e.r=+at('r');}
  out.push(e);}
 return out;}
const nerves=NF.svgs.map(s=>layers(s.inner));
/* spine levels, from the back figure's own labels */
const spine=[...NF.svgs[1].inner.matchAll(/<text class="lbl" x="([\d.]+)" y="([\d.]+)">([^<]+)<\/text>/g)]
 .map(m=>({lv:m[3],y:+m[2]-0.35}));

/* the places, grouped: one record per drawn point */
const somatic=nodesT.NODES.filter(n=>n.b!=='Field-Above'&&n.b!=='Field-Below');
const places=pts.map(p=>({x:+p.x.toFixed(3),y:+p.y.toFixed(3),ids:p.ids,view:p.view,src:p.src,s:p.s}));
const placedIds=new Set(); places.forEach(p=>p.ids.forEach(i=>placedIds.add(i)));

const data={
 read:'derived '+new Date().toISOString().slice(0,10)+' by proto/body-map-build/src/data.js',
 cm:CM, body:{d:G.BODYPATH,tx:G.PMTX,ty:G.PMTY,s:G.PMS},
 nerves, spine,
 nodes:somatic.map(n=>({i:n.i,k:n.k,b:n.b,c:n.c,n:n.n})),
 unplaced:somatic.filter(n=>!placedIds.has(n.i)).map(n=>n.i),
 places,
 child:CHILD.map(c=>({nm:c.nm,ic:c.ic,seat:c.seat,opp:c.opp})),
 sabs:nodesT.SAB_LIB,
 /* the family's plain description and seat only. sub is clinical and is
    never shown to anybody, by the product's own ruling in nodes.js */
 hcx:nodesT.HCX_LIB.map(h=>({nm:h.nm,d:h.d,b:h.b,ic:h.ic})),
 painreg:G.PAINREG.map(r=>({k:r.k,nm:r.nm,common:r.common,pattern:r.pattern})),
 regions:{front:REG.FRONT,back:REG.BACK},
 people:PEOPLE.filter(p=>['Diane','Derek','James','Ana','Sofia','Rosa'].includes(p.nm))
  .map(p=>({nm:p.nm,age:p.age,role:p.role.replace(/\s*·\s*ICP/,''),says:p.says,c:p.c}))};
realWrite(path.join(HERE,'data.json'),JSON.stringify(data));
console.log('  data.json',JSON.stringify(data).length.toLocaleString(),'bytes;',
 'nerve elements',nerves.map(n=>n.length).join('/'),'; places',places.length,
 '; addresses placed',placedIds.size,'of',somatic.length,'; regions',REG.FRONT.length+'+'+REG.BACK.length,
 '; saboteurs',data.sabs.length,'; spine levels',spine.length);
