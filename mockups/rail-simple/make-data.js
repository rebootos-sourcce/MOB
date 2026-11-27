/* Reads the four example people's real readings out of the built app and writes
   data.json. Run from the repo root:
   NODE_PATH=/opt/node22/lib/node_modules node mockups/rail-simple/make-data.js */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const ROOT=path.resolve(__dirname,'..','..');
const WHO=[['Marcus',3],['Tomas',9],['Diane',2],['You',0]];
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 await p.goto('file://'+path.join(ROOT,'source.html')+'?dev=1');
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
 await p.waitForTimeout(400);
 const out=await p.evaluate((WHO)=>{
  const res={};
  WHO.forEach(([nm,i])=>{
   loadP(i); setTab(TAB.FIELD); render&&render();
   const r=compute(), rg=cqRange(r.CQ), bal=balance();
   res[nm.toLowerCase()]={
    nm, index:i, unread:!!r.unread,
    cq:+r.CQ.toFixed(2), dq:+r.DQ.toFixed(2),
    sq:+(r.SQ.reduce((a,v)=>a+v,0)/1120*100).toFixed(2),
    x:+r.X.toFixed(3), y:+r.Y.toFixed(3), z:+r.Z.toFixed(3), rad:+r.radiance.toFixed(3),
    flow:+flSpeed().toFixed(3), benign:!!r.benign, malig:r.malig, tier:r.tier||null,
    lean:+bal.lean.toFixed(3), balRead:!!bal.read,
    band:+rg.band.toFixed(2), lo:+rg.lo.toFixed(2), hi:+rg.hi.toFixed(2),
    seatShadow:rbSeatShadow().map(v=>+v.toFixed(3)),
    pass:rbSeatPass().map(v=>+v.toFixed(3)),
    seatCols:BANDS.map(b=>seatCol(b)),
    bands:BANDS.slice()};});
  return res;}, WHO);
 Object.values(out).forEach(o=>{o.pal={seat:o.seatCols.slice(),vit:o.seatCols[2],aw:o.seatCols[5],wi:o.seatCols[4]};});
 fs.writeFileSync(path.join(__dirname,'data.json'),JSON.stringify(out,null,1));
 fs.writeFileSync(path.join(__dirname,'data.js'),'window.RS_DATA='+JSON.stringify(out)+';\n');
 Object.values(out).forEach(o=>console.log(o.nm,'CQ',o.cq,'DQ',o.dq,'SQ',o.sq,'X',o.x,'Y',o.y,'Z',o.z,'rad',o.rad,'flow',o.flow,'lean',o.lean,'band',o.band,'unread',o.unread));
 console.log(JSON.stringify(out.marcus.seatCols), JSON.stringify(out.marcus.pass), JSON.stringify(out.marcus.seatShadow));
 await b.close();
})();
