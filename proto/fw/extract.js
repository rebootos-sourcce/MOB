/* ============================================================
   REAL DATA FOR THE FW MOCKUPS. Round FW in TASKS.md.

   Every prototype in proto/fw/ draws from this file's output and never from a
   number typed by hand. It opens the committed build in real Chromium, loads
   each named profile, calls the engine's own compute(), and writes what the
   mockups need to data.json: every address with the Body page's own placement
   (pmNode), the ANAT rows, the patterns with their parts, the tables that
   carry names and icons, and the Body page's figure geometry.

   Reads the COMMITTED source.html (git show HEAD:source.html), because the
   working tree can carry another seat's work in flight.

     NODE_PATH=<playwright> node proto/fw/extract.js
   ============================================================ */
const {chromium}=require('playwright');
const fs=require('fs'), path=require('path'), cp=require('child_process'), os=require('os');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const src=cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20});
const commit=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
const tmp=path.join(os.tmpdir(),'fw-extract-'+process.pid+'.html');
fs.writeFileSync(tmp,src);
const WHO=['Gordon','Angela','Sofia','Derek'];
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[];p.on('pageerror',e=>errs.push(String(e.message)));
 await p.goto('file://'+tmp);
 await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000}).catch(()=>{});
 const tables=await p.evaluate(()=>{
  const pick=(o,ks)=>{const r={};ks.forEach(k=>{if(o[k]!==undefined)r[k]=o[k];});return r;};
  return {
   BODYPATH, PMS, PMTX, PMTY, ANATHEAD, ANATSPINE,
   ANAT: ANAT.map(r=>pick(r,['s','ids','h','v','f','c','at'])),
   PMBANDS: PMBANDS.map(b=>pick(b,['k','nm','b','yp','r'])),
   PAL, PAL_LIGHT, SEATGLYPH,
   NODES: NODES.map(n=>({i:n.i,k:n.k,b:n.b,n:n.n,a:n.a,d:n.d,c:n.c})),
   FLOWSEAT, PAINREG, NERVEBR,
   SI: SI.map(l=>pick(l,['nm','b','ic'])),
   ARCH: ARCH.map(a=>pick(a,['nm','v','b','ic'])),
   MASKS: MASKS.map(m=>pick(m,['nm','b','ic','v'])),
   HCX_LIB, SABDEF, CHILD: CHILD.map(c=>pick(c,['nm','seat','ic','opp','addr','loc'])),
   DOMAINS: DOMAINS.map(d=>pick(d,['nm','b','ic','v','d'])),
   HARM, HARM_AX, SAB33, INFER_NOUN, FAM_POLE, FAM_OF, SAB_PI, IQ_STEM, Q3, TIERDEF, TIERCOL, HARM_FAM, SAB_LIB};
 }).catch(e=>({err:String(e)}));
 if(tables.err){
  /* NODEDEF may not exist under that name; fall back without it */
  console.log('first pass failed:',tables.err);}
 const people={};
 for(const who of WHO){
  people[who]=await p.evaluate(who=>{
   const i=PEOPLE.findIndex(q=>q.nm===who); loadP(i);
   const r=compute();
   const pos={}; W.forEach(n=>{const k=B2K[n.b]; const q=pmNode(n.i,k); pos[n.i]=[+q.x.toFixed(3),+q.y.toFixed(3)];});
   const an=pmAnat();
   const sabs=r.sabs.map(s=>({nm:s.nm,w:+s.w.toFixed(2),hcx:s.hcx,named:!!s.named,score:s.score,over:!!s.over,
     charges:s.charges||null,parts:(s.parts||[]).map(n=>n.i)}));
   const cxs=r.cxs.map(c=>({nm:c.nm,w:+c.w.toFixed(2),hcx:c.hcx,over:!!c.over,parts:c.parts.map(s=>s.nm)}));
   const hys=r.hys.map(h=>({nm:h.nm,d:h.d,w:+h.w.toFixed(2),over:!!h.over,parts:h.parts.map(c=>c.nm)}));
   const sups=r.sups.map(h=>({nm:h.nm,w:+h.w.toFixed(2),parts:h.parts.map(c=>c.nm)}));
   const seats=flSeats().map(s=>({k:s.p.k,pass:+s.pass.toFixed(3),hot:s.hot,tot:s.tot,held:s.held,load:+s.load.toFixed(3)}));
   return {nm:who, role:PEOPLE[i].role, says:PEOPLE[i].says||'',
    sq:W.map(n=>[n.i,+n.sq.toFixed(2),+(n.pole||0).toFixed(2)]),
    pos, anat:Object.keys(an).map(Number),
    sabs,cxs,hys,sups, masks:r.maskRing.map(m=>({nm:m.nm,w:+m.w.toFixed(2)})),
    seats, law:Object.assign({},S.law), arcs:(S.arcs||[]).slice(), doms:(S.doms||[]).slice(),
    CQ:r.CQ, DQ:r.DQ, tier:r.tier, carrying:r.carrying.length,
    aff:(r.aff||[]).map(function(v){return +(+v).toFixed(4);})};
  },who);
 }
 const out={stamp:{commit,read:new Date().toISOString().slice(0,10),errors:errs},tables,people};
 fs.writeFileSync(path.join(D,'data.json'),JSON.stringify(out));
 console.log('wrote data.json',(JSON.stringify(out).length/1024).toFixed(0)+'KB','errors',errs.length);
 await b.close(); fs.unlinkSync(tmp);
})();
