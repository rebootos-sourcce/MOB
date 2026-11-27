/* ============================================================
   REAL DATA FOR THE GOLDEN MASKS. Round IT in TASKS.md, a copy of ../extract.js.

   The mockup draws from this file's output and never from a number typed by
   hand. It opens the COMMITTED build (git show HEAD:source.html, because the
   working tree carries another seat's work in flight), loads each reference
   profile through the app's own loadP, calls compute(), and keeps only what
   the masks need: the six masks, the addresses at their seats with each
   one's charge, the archetype table with its icons, and the seat palette.

   Round JP adds the three groupings compute() already returns and nothing on
   the masks read until now: r.sabs, the saboteurs, each a named cluster of
   addresses with a weight w on the engine's 0 to 10; r.cxs, the complexes,
   each two saboteurs of one family; r.hys, the hyper complexes, each a family
   that compounded on two complexes, or on one running at 6.5 or more. They are
   kept by reference: a saboteur lists address ids, a complex lists saboteur
   indexes, a hyper complex lists complex indexes, so the chain is walked on
   the page exactly as the engine built it. HCX_LIB carries each family's seat
   and its icon, FAM_POLE each family's overshot pole.

     NODE_PATH=/opt/node22/lib/node_modules node proto/masks/golden/extract.js
   ============================================================ */
const {chromium}=require('playwright');
const fs=require('fs'), path=require('path'), cp=require('child_process'), os=require('os');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const src=cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20});
const commit=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
const tmp=path.join(os.tmpdir(),'masks-extract-'+process.pid+'.html');
fs.writeFileSync(tmp,src);
/* the six ICPs, plus the blank profile a stranger arrives on, which is the
   empty mask: nothing written yet. */
const WHO=['You','Sofia','Diane','Marcus','Angela','Derek','James'];
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[];p.on('pageerror',e=>errs.push(String(e.message)));
 await p.goto('file://'+tmp);
 await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000}).catch(()=>{});
 const tables=await p.evaluate(()=>({
  MASKS: MASKS.map(m=>({nm:m.nm,b:m.b,ic:m.ic,v:m.v})),
  ARCH: ARCH.map(a=>({nm:a.nm,v:a.v,b:a.b,ic:a.ic})),
  NODES: NODES.map(n=>({i:n.i,k:n.k,b:n.b,n:n.n,a:n.a,d:n.d,c:n.c})),
  HCX: HCX_LIB.map(h=>({nm:h.nm,d:h.d,b:h.b,ic:h.ic})), FAM_POLE,
  PAL, PEOPLE: PEOPLE.map(q=>q.nm)}));
 const people={};
 for(const who of WHO){
  const r=await p.evaluate(who=>{
   const i=PEOPLE.findIndex(q=>q.nm===who); if(i<0)return null;
   loadP(i); const r=compute();
   return {nm:who, role:PEOPLE[i].role||'', unread:!!r.unread,
    sq:W.map(n=>[n.i,+n.sq.toFixed(2)]),
    masks:r.maskRing.map(m=>({nm:m.nm,w:+m.w.toFixed(3)})),
    sabs:r.sabs.map(x=>({nm:x.nm,hcx:x.hcx,w:+x.w.toFixed(3),over:!!x.over,named:!!x.named,
     unnamed:!!x.unnamed,parts:x.parts.map(n=>n.i)})),
    cxs:r.cxs.map(x=>({nm:x.nm,hcx:x.hcx,w:+x.w.toFixed(3),over:!!x.over,parts:x.parts.map(s=>r.sabs.indexOf(s))})),
    hys:r.hys.map(x=>({nm:x.nm,w:+x.w.toFixed(3),over:!!x.over,parts:x.parts.map(c=>r.cxs.indexOf(c))})),
    sups:r.sups.map(x=>({nm:x.nm,w:+x.w.toFixed(3),parts:x.parts.map(h=>r.hys.indexOf(h))}))};},who);
  if(r)people[who]=r; else console.log('no profile named',who);
 }
 const out={stamp:{commit,read:new Date().toISOString().slice(0,10),errors:errs},tables,people};
 fs.writeFileSync(path.join(D,'data.json'),JSON.stringify(out));
 console.log('wrote data.json',(JSON.stringify(out).length/1024).toFixed(0)+'KB','people',Object.keys(people).join(','),'errors',errs.length);
 await b.close(); fs.unlinkSync(tmp);
})();
