/* ============================================================
   REAL DATA FOR THE ENERGETICS ART PASS. Round IT in TASKS.md.

   Opens the COMMITTED build (git show HEAD:source.html), and keeps what the
   Energetics section draws from: the 21 laws with their seat and icon, the 63
   questions as iqList() words them, the seat glyphs and palette, and two
   profiles, the blank one a stranger opens on and Marcus, whose 63 are
   answered. CQ and the tier are read off compute(), never typed.

     NODE_PATH=/opt/node22/lib/node_modules node proto/energetics-art/extract.js
   ============================================================ */
const {chromium}=require('playwright');
const fs=require('fs'), path=require('path'), cp=require('child_process'), os=require('os');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const src=cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20});
const commit=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
const tmp=path.join(os.tmpdir(),'en-art-'+process.pid+'.html'); fs.writeFileSync(tmp,src);
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
 await p.goto('file://'+tmp);
 await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000}).catch(()=>{});
 const out=await p.evaluate(()=>{
  const t={SI:SI.map(l=>({nm:l.nm,b:l.b,ic:l.ic})), Q:iqList().map(q=>({i:q.i,side:q.side,q:q.q})),
   SIDE:IQ_SIDE, SEATLINE:IQ_SEATLINE, SEATS:IQ_SEATS, GLYPH:SEATGLYPH, PAL:PAL};
  const people={};
  const blank=compute(); people.You={nm:'You',role:'',answers:{},CQ:null,tier:null};
  const mi=PEOPLE.findIndex(q=>q.nm==='Marcus'); loadP(mi); const r=compute();
  people.Marcus={nm:'Marcus',role:PEOPLE[mi].role||'',quote:PEOPLE[mi].q||PEOPLE[mi].quote||'',
   answers:Object.assign({},CURP.intake.answers),CQ:+r.CQ.toFixed(1),tier:r.tier||null};
  return {tables:t,people};});
 out.stamp={commit,read:new Date().toISOString().slice(0,10),errors:errs};
 fs.writeFileSync(path.join(D,'data.json'),JSON.stringify(out));
 console.log('wrote data.json',(JSON.stringify(out).length/1024).toFixed(0)+'KB','laws',out.tables.SI.length,'questions',out.tables.Q.length,
  'Marcus answered',Object.keys(out.people.Marcus.answers).length,'CQ',out.people.Marcus.CQ,out.people.Marcus.tier,'quote',!!out.people.Marcus.quote,'errors',errs.length);
 await b.close(); fs.unlinkSync(tmp);
})();
