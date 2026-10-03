/* CAPTURE. Everything the four renditions stand on, taken off the live build
   rather than typed in, so no figure in them is one somebody chose.

   Writes, into this folder:
     data-james.js                 James's reading, every layer the Field draws
     shots/today-field-james-1600.png   the Field as it ships, same profile
     shots/chrome-1600.png         the real top bar and rails, the secondary bar
                                   gone and the stage emptied, which is the
                                   rectangle every rendition fills
     shots/stage.json              that rectangle, measured

   The profile is James, a reference case, with his own five story bank lines
   from sim/stories.js committed the way the Story tab commits them. That is
   the only way the stories layer has anything in it, because no reference
   case carries a story. The page is headless and thrown away and source.html
   is loaded, never written.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-rings/capture.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs'),crypto=require('crypto'),cp=require('child_process');
const DIR=__dirname, SHOTS=path.join(DIR,'shots');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const {STORYBANK}=require(path.resolve('sim/stories.js'));
const WHO=6;   /* James, by PEOPLE index, where 0 is the blank profile */
fs.mkdirSync(SHOTS,{recursive:true});
(async()=>{
 const src=path.resolve('source.html');
 const md5=crypto.createHash('md5').update(fs.readFileSync(src)).digest('hex');
 let commit='unknown',dirty='';
 try{commit=cp.execSync('git rev-parse --short HEAD').toString().trim();
  dirty=cp.execSync('git status --short').toString().trim()?' (tree dirty)':'';}catch(e){}
 const b=await chromium.launch({executablePath:EXE});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+src);
 /* the boot sheet is a five second overture over the app, cleared by its own
    timer, which then marks the body. Waiting on the mark rather than on a
    guessed delay: the first run of this script shot the overture twice. */
 await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000});
 await p.waitForTimeout(400);

 const data=await p.evaluate(([who,bank])=>{
  loadP(who);
  const nm=PEOPLE[who].nm, lines=(bank[nm]||[]).map(x=>x[1]);
  lines.forEach(function(t,k){
   applyStory(t); verpApply(t); if(typeof leanApply==='function')leanApply(t);
   if(CURP){CURP.story=CURP.story||{entries:[]};
    const ps=parseStory(t);
    CURP.story.entries.push({t:'2026-09-2'+k+'T08:00:00Z',text:t,
     imprints:ps.imprints.length,bands:ps.bands});}});
  setTab(TAB.FIELD); render&&render();
  const r=compute();
  const pos=new Map(W.map((n,j)=>[n,j]));
  const r2=x=>Math.round(x*100)/100;
  const V=verpRead();
  const atoms=(typeof atomIndex==='function')?atomIndex():{};
  const atomOut={};
  Object.keys(atoms||{}).forEach(k=>{atomOut[k]=atoms[k].map(a=>({amt:r2(a.amt),ei:a.ei}));});
  const acc=(typeof accuracy==='function')?accuracy(r):null;
  const fieldNodes=NODES.filter(n=>n.b.startsWith('Field')).map(n=>({i:n.i,k:n.k,b:n.b,a:n.a}));
  return {
   who:nm, role:PEOPLE[who].role, says:PEOPLE[who].says, lines,
   CQ:r2(r.CQ), DQ:r2(r.DQ), SQm:r2(r.SQm), EX:r2(r.EX), tier:r.tier,
   tierCol:(r.tier&&TIERCOL[r.tier])||null, cqRamp:cqRamp(r.CQ),
   complete:r.complete, unread:r.unread,
   X:r2(r.X), Y:r2(r.Y), Z:r2(r.Z), flow:r2(flSpeed()),
   accuracy:acc?Math.round(acc.pct):null,
   darkB:r.darkB, benign:r.benign,
   carryingN:W.filter(n=>n.sq>=4).length, underN:r.under, addressN:NODES.length,
   /* susc is the Domain Matrix factor the Field draws as a thread's tension */
   nodes:W.map((n,j)=>({j, i:n.i, b:n.b, k:n.k, cf:n.cf, sq:r2(n.sq||0), rep:r2(n.rep||0), susc:r2(n.susc||1)})),
   fieldNodes,
   laws:SI.map(l=>({nm:l.nm, b:l.b, v:r2(S.law[l.nm]), ic:l.ic})),
   seats:BANDS.map(bb=>({b:bb, ig:r2(bandIg(bb)), n:W.filter(n=>n.b===bb).length,
    held:W.filter(n=>n.b===bb&&n.sq>=4).length, glyph:SEATGLYPH[bb]})),
   gates:V.map(v=>({k:v.k, nm:v.nm, side:v.side, pct:v.pct, n:v.n, glyph:GATEGLYPH[v.k]})),
   gateEvidence:V.some(v=>v.pct>0),
   sabs:r.sabs.map(s=>({nm:s.nm, w:r2(s.w||0), unnamed:!!s.unnamed,
    parts:(s.parts||[]).map(n=>pos.get(n)), b:(s.parts&&s.parts[0]&&s.parts[0].b)||null})),
   /* parts by position, never by name: two saboteurs can share a name (the
      roster has two Avoiders and two Loners), so a name would thread a chain
      to the wrong bead */
   cxs:r.cxs.map(c=>({nm:c.nm, w:r2(c.w||0), parts:(c.parts||[]).map(x=>r.sabs.indexOf(x))})),
   hys:r.hys.map(c=>({nm:c.nm, w:r2(c.w||0), parts:(c.parts||[]).map(x=>r.cxs.indexOf(x))})),
   sups:r.sups.map(c=>({nm:c.nm, w:r2(c.w||0), parts:(c.parts||[]).map(x=>r.hys.indexOf(x))})),
   arch:ARCH.map((a,j)=>({nm:a.nm, b:a.b, ic:a.ic, aff:r2(r.aff[j]||0)})), pi:r.pi, si:r.si,
   radiance:r2(r.radiance||0),
   masks:(r.maskRing||[]).map(m=>({nm:m.nm, w:r2(m.w||0)})),
   domains:DOMAINS.map((d,j)=>({nm:d.nm, r:d.r, v:r2(DOMAIN[j]||0), ic:d.ic, sel:S.doms.indexOf(j)>=0})),
   rootCol:ROOTCOL,
   axes:CHILD.map(c=>({nm:c.nm, opp:c.opp, seat:c.seat, ic:c.ic,
    charge:r2(S.charge[c.nm]||0), rep:r2(S.replace[c.nm]||0)})),
   atoms:atomOut, entries:(CURP&&CURP.story&&CURP.story.entries||[]).map(e=>e.text),
   pal:PAL, palLight:PAL_LIGHT, tiercol:TIERCOL, qicon:QICON_D, crgeo:CRGEO, hotAt:HOT_AT,
   /* the product's own pill markup, rendered by cr(), so the readouts in the
      renditions are the shipped component and not an imitation of it */
   keyHTML:document.getElementById('key').innerHTML,
   keyloHTML:document.getElementById('keylo').innerHTML,
   accHTML:document.getElementById('acc').innerHTML,
   /* the range the coherence scale draws as its pill, by the scale's own
      arithmetic in ui/personas.js renderPol2, so the core can carry it */
   range:(function(){var cq=Math.max(0,Math.min(100,r.CQ)),sw=1-cq/100,bp=2.5+sw*sw*26;
    return {lo:r2(Math.max(0,cq-bp/2)),hi:r2(Math.min(100,cq+bp/2))};})()};
 },[WHO,STORYBANK]);
 /* past the Field's own one time assembly, which runs 900ms on arrival */
 await p.waitForTimeout(1600);
 /* the Field as it ships, same profile, same state */
 await p.screenshot({path:path.join(SHOTS,'today-field-james-1600.png')});

 /* the chrome. The secondary bar is the Field's depth ladder, and the layer
    toggles are what replaces it (BA8), so it goes, and the stage takes the
    same rectangle every other tab already has. The stage is emptied so the
    backdrop carries nothing of the old wheel. */
 const stage=await p.evaluate(()=>{
  document.body.classList.remove('hassub');
  const st=document.createElement('style');
  st.textContent='#stage > *{visibility:hidden !important}';
  document.head.appendChild(st);
  window.dispatchEvent(new Event('resize'));
  const e=document.getElementById('stage').getBoundingClientRect();
  const cs=getComputedStyle(document.getElementById('stage'));
  return {x:e.x,y:e.y,w:e.width,h:e.height,radius:cs.borderTopLeftRadius,
   bg:cs.backgroundColor, border:cs.borderTopColor+' '+cs.borderTopWidth,
   bodyBg:getComputedStyle(document.body).backgroundColor};});
 await p.waitForTimeout(800);
 await p.screenshot({path:path.join(SHOTS,'chrome-1600.png')});
 stage.commit=commit+dirty; stage.md5=md5; stage.at='1600x1000';
 fs.writeFileSync(path.join(SHOTS,'stage.json'),JSON.stringify(stage,null,1)+'\n');
 data.build={commit:commit+dirty, md5};
 fs.writeFileSync(path.join(DIR,'data-james.js'),
  '/* Written by capture.js off the live build. Do not edit by hand: run it again. */\n'
  +'window.FIELD='+JSON.stringify(data)+';\n');
 console.log('build',commit+dirty,'md5',md5);
 console.log('stage',JSON.stringify(stage));
 console.log('James CQ',data.CQ,data.tier,'DQ',data.DQ,'SQ',data.SQm,'flow',data.flow,
  'accuracy',data.accuracy,'held',data.carryingN,'of',data.addressN,'gate evidence',data.gateEvidence);
 console.log(errs.length?'JS ERRORS '+errs.join(' | '):'no JS errors');
 await b.close();
})();
