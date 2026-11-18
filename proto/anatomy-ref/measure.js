/* How close the Body page draws each address to where the two reference
   charts put it, as a number.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/anatomy-ref/measure.js [build.html] [tag]
   build.html defaults to source.html. tag names the output, default "now":
   writes proto/anatomy-ref/out/<tag>.json and <tag>-overlay.png, and the two
   chart proofs, proof-112.png and proof-marma.png.

   WHERE AN ADDRESS IS, IS READ OFF THE BUILD. pmNode, PMBANDS, ANATHEAD and
   BODYPATH come out of the page in Chromium, never out of atuned_src, so the
   number is about what ships. And then checked against what the page actually
   paints: a loaded profile is rendered and every drawn mark's own cx and cy is
   compared with pmNode. A probe that reads one thing and grades another lies.

   HOW A CHART POINT REACHES OUR FIGURE. Piecewise straight lines through the
   six landmarks every figure has (charts.js): top of the skull, middle of the
   ear, the neck at its narrowest, the base of the neck, the crotch, the sole. Across, the distance
   from the midline is scaled by one ratio per figure, see scaleOf in
   derive.js, where the geometry now lives. A back view
   is mirrored, since its left is the person's left.

   THE UNIT IS THE PERSON. A distance is given as a share of the height from
   the top of the skull to the sole, and beside it in centimetres on a person
   175 cm tall, because "4 cm" is a thing anyone can hold a finger against and
   "2.1 units" is not. Bands:
     on    within 3 percent, about 5 cm, three finger widths
     near  within 6 percent, about 10 cm, a hand's width
     off   further than that
   The bands are this tool's choice and are said so. The raw distance is
   printed beside every one, and the floor under all of it is printed first:
   how far apart the two charts put the same place, on this same figure. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs'), crypto=require('crypto');
const {execSync}=require('child_process');
const {FIGS,PTS}=require('./charts.js');
const {MATCH,SEATS,AGREE}=require('./match.js');
const D=require('./derive.js');
const ROOT=path.resolve(__dirname,'..','..');
const SRC=path.resolve(process.argv[2]||path.join(ROOT,'source.html'));
const TAG=process.argv[3]||'now';
const OUT=path.join(__dirname,'out');
const STATURE_CM=175, ON=D.ON, NEAR=D.NEAR;

/* The geometry that needs no page (our figure off its outline, a chart point
   onto it, the chart places and their drift) lives in derive.js, which
   tests/anatomy.js calls as well, so there is one copy of it. */
const {ourFigure}=D;
const dist=D.dist, mirror=D.mirror;
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const md5=crypto.createHash('md5').update(fs.readFileSync(SRC)).digest('hex');
 let commit='';try{commit=execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();}catch(e){}
 let dirty=false;try{dirty=execSync('git status --porcelain atuned_src source.html',{cwd:ROOT}).toString().trim()!=='';}catch(e){}
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
 await p.goto('file://'+SRC);
 await p.waitForFunction(()=>typeof pmNode==='function'&&typeof NODES!=='undefined',null,{timeout:20000});
 const g=await p.evaluate(()=>({
  node:NODES.filter(n=>n.i<=108).map(n=>{const q=pmNode(n.i,B2K[n.b]);
   return {i:n.i,k:n.k,b:n.b,n:n.n,x:q.x,y:q.y,anat:!!pmAnat()[n.i],
    chart:ANAT.some(r=>r.c&&r.ids.indexOf(n.i)>=0)};}),
  seats:PMBANDS.map(s=>({k:s.k,nm:s.nm,y:s.yp})),
  anat:ANAT.filter(r=>r.c).map(r=>({ids:r.ids,c:r.c,f:r.f})),
  V:ANATHEAD.ytop,E:ANATHEAD.year,BODYPATH,PMS,PMTX,PMTY}));
 /* the known good case: what the page paints, against what pmNode says */
 const painted=[];
 for(const w of [13,8,6]){
  const d=await p.evaluate(w=>{loadP(w);setTab(TAB.ENERGY);PMLAYER='bands';PMPICK=null;render();
   return {nm:PEOPLE[w].nm,marks:[...document.querySelectorAll('#emap .pm-n[data-node]')].map(el=>{
    const c=el.querySelector('circle');return {i:+el.dataset.node,x:+c.getAttribute('cx'),y:+c.getAttribute('cy')};})};},w);
  let worst=0;d.marks.forEach(m=>{const r=g.node.find(n=>n.i===m.i);worst=Math.max(worst,Math.abs(r.x-m.x),Math.abs(r.y-m.y));});
  painted.push({profile:d.nm,drawn:d.marks.length,worst:+worst.toFixed(3)});}
 const us=ourFigure(g);
 const inBody=D.inBodyOf(us);
 const H=us.F-us.V, pct=d=>100*d/H, cm=d=>STATURE_CM*d/H;
 const band=d=>pct(d)<=ON?'on':pct(d)<=NEAR?'near':'off';
 const {W,onUs}=D.chartOnUs(us,FIGS,PTS);
 /* check the tool on the cases it must get exactly: each figure's own
    landmarks, on its own midline, land on ours */
 const selftest=D.landmarkRoundTrip(us,FIGS,W);
 const near=(pos,ids)=>{/* nearest of every chart point listed, and its mirror */
  let best=null;ids.forEach(id=>{const q=PTS.find(t=>t.id===id);
   if(!q||q.ok===false||!onUs[id])return;
   onUs[id].forEach(c=>[c,mirror(c)].forEach(m=>{const d=dist(pos,m);
    if(!best||d<best.d)best={d,pt:id,at:m};}));});
  return best;};
 const rows=[];
 MATCH.forEach(m=>m.ids.forEach(id=>{const n=g.node.find(t=>t.i===id), pos=[n.x,n.y];
  const per=m.pts.map(pid=>{const r=near(pos,[pid]);return r?{pt:pid,d:+r.d.toFixed(3),pct:+pct(r.d).toFixed(2)}:null;}).filter(Boolean);
  const best=near(pos,m.pts);
  rows.push({i:id,k:n.k,b:n.b,n:n.n,tier:m.tier,measured:n.anat,source:n.chart?'chart':n.anat?'anatomy':'gathered',x:+n.x.toFixed(3),y:+n.y.toFixed(3),
   d:+best.d.toFixed(3),pct:+pct(best.d).toFixed(2),cm:+cm(best.d).toFixed(1),band:band(best.d),
   nearest:best.pt,at:best.at.map(v=>+v.toFixed(3)),per,why:m.why});}));
 const seatRows=SEATS.map(s=>{const st=g.seats.find(t=>t.k===s.k), pos=[50,st.y], best=near(pos,s.pts);
  return {k:s.k,nm:st.nm,y:st.y,d:+best.d.toFixed(3),pct:+pct(best.d).toFixed(2),cm:+cm(best.d).toFixed(1),
   dy:+(best.at[1]-st.y).toFixed(3),nearest:best.pt,at:best.at.map(v=>+v.toFixed(3)),why:s.why};});
 const agree=AGREE.map(([a,c])=>{const A=onUs[a],B=onUs[c];let d=1e9;
  A.forEach(p1=>B.forEach(p2=>[p2,mirror(p2)].forEach(p3=>{d=Math.min(d,dist(p1,p3));})));
  return {a,b:c,d:+d.toFixed(3),pct:+pct(d).toFixed(2),cm:+cm(d).toFixed(1)};});
 const stat=list=>{const s=list.map(r=>r.pct).sort((a,b)=>a-b);if(!s.length)return null;
  const q=f=>s[Math.min(s.length-1,Math.floor(f*(s.length-1)+0.5))];
  return {n:s.length,median:+q(0.5).toFixed(2),mean:+(s.reduce((a,b)=>a+b,0)/s.length).toFixed(2),
   p90:+q(0.9).toFixed(2),max:+s[s.length-1].toFixed(2),
   on:list.filter(r=>r.band==='on').length,near:list.filter(r=>r.band==='near').length,off:list.filter(r=>r.band==='off').length};};
 const t1=rows.filter(r=>r.tier===1), t12=rows;
 /* THE NUMBER THAT IS NOT CIRCULAR. An address placed from a chart scores well
    against that chart by construction, so the after number alone proves only
    that the page draws what it was given. Two numbers carry the real weight:
    the addresses placed by the brain atlas and the spine, which never saw
    either chart, and each chart on its own, since a place taken as the mean
    of two is honest against neither alone. */
 const indep=rows.filter(r=>r.source==='anatomy');
 const perChart=pfx=>stat(rows.map(r=>{const q=r.per.filter(x=>x.pt.startsWith(pfx));
  if(!q.length)return null;const v=Math.min(...q.map(x=>x.pct));
  return {pct:v,band:v<=ON?'on':v<=NEAR?'near':'off'};}).filter(Boolean));
 /* a hand check, printed with its working so it can be redone on paper */
 const hc=(()=>{const f=FIGS.MF, q=PTS.find(t=>t.id==='m.hridaya').p;
  const y=us.S+(q[1]-f.S)/(f.C-f.S)*(us.C-us.S);
  const s=(f.skull/us.skull+f.waist/us.waist)/2;
  const x=50+(q[0]-f.mid)/s, tool=onUs['m.hridaya'][0];
  return {point:'m.hridaya',chart:q,y_working:`${us.S} + (${q[1]} - ${f.S}) / (${f.C} - ${f.S}) x (${us.C} - ${us.S})`,
   x_working:`50 + (${q[0]} - ${f.mid}) / ((${f.skull} / ${us.skull.toFixed(3)} + ${f.waist} / ${us.waist.toFixed(3)}) / 2)`,byHand:[+x.toFixed(3),+y.toFixed(3)],
   tool:tool.map(v=>+v.toFixed(3)),agrees:dist([x,y],tool)<1e-6};})();
 /* every place a matched row is drawn: is it on the body the page clips to */
 const offBody=rows.filter(r=>!inBody(r.x,r.y)).map(r=>r.i);
 /* WHERE A GATHERED ADDRESS SHOULD STAND, per chart group, is derive.js's chartTargets. */
 const targets=D.chartTargets(us,onUs,PTS,MATCH,ids=>ids.filter(id=>!g.node.find(t=>t.i===id).anat));
 /* and every ANAT row that says it came from a chart must still say what the
    charts say, or the row has drifted from its source (derive.js, chartDrift) */
 const drift=D.chartDrift(g.anat,targets);
 const res={stamp:{src:path.relative(ROOT,SRC),commit,md5,dirty,read:new Date().toISOString()},
  figure:{V:us.V,E:us.E,N:us.N,S:us.S,C:us.C,F:us.F,skull:+us.skull.toFixed(3),neck:+us.neck.toFixed(3),
   waist:+us.waist.toFixed(3),wy:us.wy,stature:+H.toFixed(3)},
  check:{landmarkRoundTrip:+Math.max(...selftest).toExponential(2),painted,hand:hc,pageErrors:errs,offBody,
   chartRows:g.anat.length,drift},
  targets,
  bands:{on:ON,near:NEAR,statureCm:STATURE_CM},
  agree,summary:{tier1:stat(t1),all:stat(t12),anatomyOnly:stat(indep),marmaAlone:perChart('m.'),chart112Alone:perChart('112.'),seats:stat(seatRows.map(r=>({pct:r.pct,band:band(r.d)})))},
  rows,seats:seatRows,
  chartOnUs:Object.fromEntries(Object.entries(onUs).map(([k,v])=>[k,v.map(p=>p.map(n=>+n.toFixed(3)))]))};
 fs.writeFileSync(path.join(OUT,TAG+'.json'),JSON.stringify(res,null,1));

 /* ---------- pictures ---------- */
 const ptsOf=id=>onUs[id]||[];
 const PAL={marma:'#d9822b',n112:'#3f8fd2',us:'#e8e8e8',line:'#ff5a5a'};
 let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 0 60 60" width="1200" height="1200" style="background:#15161a">'
  +'<path transform="translate('+g.PMTX+','+g.PMTY+') scale('+g.PMS+')" d="'+g.BODYPATH+'" fill="rgba(150,152,160,.12)" stroke="#777" stroke-width="1.2" vector-effect="non-scaling-stroke"/>';
 g.seats.forEach(s=>{svg+='<circle cx="50" cy="'+s.y+'" r=".9" fill="none" stroke="#999" stroke-width=".12"/>'
  +'<text x="51.2" y="'+(s.y+0.3)+'" font-size=".9" fill="#999" font-family="sans-serif">'+s.nm+'</text>';});
 PTS.forEach(q=>{if(!onUs[q.id])return;const c=q.fig.startsWith('112')?PAL.n112:PAL.marma;
  ptsOf(q.id).forEach(pp=>{svg+='<rect x="'+(pp[0]-.35)+'" y="'+(pp[1]-.35)+'" width=".7" height=".7" fill="'+(q.ok===false?'none':c)
   +'" stroke="'+c+'" stroke-width=".1"/>';});});
 rows.forEach(r=>{svg+='<line x1="'+r.x+'" y1="'+r.y+'" x2="'+r.at[0]+'" y2="'+r.at[1]+'" stroke="'+PAL.line+'" stroke-width=".1"/>'
  +'<circle cx="'+r.x+'" cy="'+r.y+'" r=".38" fill="'+(r.tier===1?PAL.us:'none')+'" stroke="'+PAL.us+'" stroke-width=".1"/>'
  +'<text x="'+(r.x+.5)+'" y="'+(r.y-.4)+'" font-size=".6" fill="#ddd" font-family="sans-serif">'+r.i+'</text>';});
 svg+='<text x="21" y="2" font-size="1.1" fill="#ddd" font-family="sans-serif">'+TAG+'  '+commit+'  tier 1 median '+res.summary.tier1.median
  +'%  all median '+res.summary.all.median+'%</text>'
  +'<text x="21" y="3.4" font-size=".8" fill="#aaa" font-family="sans-serif">white: where the Body page draws the address (filled tier 1, open tier 2). '
  +'<tspan fill="'+PAL.marma+'">orange: marma chart</tspan>, <tspan fill="'+PAL.n112+'">blue: 112 chart</tspan>, hollow: on the chart but drawn on a limb. red: the miss</text></svg>';
 await p.setViewportSize({width:1200,height:1200});
 await p.setContent('<html><body style="margin:0;background:#15161a">'+svg+'</body></html>');
 await p.screenshot({path:path.join(OUT,TAG+'-overlay.png')});
 /* proofs: every annotated point back on its own chart, so the reading of
    the images can be checked by eye against the images */
 for(const [img,figs,name] of [['112-node-chart.png',['112F','112B'],'proof-112'],['marma-points-chart.png',['MF','MB'],'proof-marma']]){
  const buf=fs.readFileSync(path.join(__dirname,'refs',img)).toString('base64');
  const dims=img.startsWith('112')?[1024,559]:[550,494], sc=img.startsWith('112')?2:3;
  let o='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+dims[0]+' '+dims[1]+'" width="'+dims[0]*sc+'" height="'+dims[1]*sc+'">'
   +'<image href="data:image/png;base64,'+buf+'" width="'+dims[0]+'" height="'+dims[1]+'" opacity=".55"/>';
  figs.forEach(k=>{const f=FIGS[k];
   ['V','E','N','S','C','F'].forEach(L=>{o+='<line x1="'+(f.mid-40)+'" x2="'+(f.mid+40)+'" y1="'+f[L]+'" y2="'+f[L]+'" stroke="#0a0" stroke-width=".6"/>'
    +'<text x="'+(f.mid+42)+'" y="'+(f[L]+2)+'" font-size="6" fill="#0a0">'+L+'</text>';});
   o+='<line x1="'+f.mid+'" x2="'+f.mid+'" y1="'+f.V+'" y2="'+f.F+'" stroke="#0a0" stroke-width=".4" stroke-dasharray="2 2"/>';});
  PTS.filter(q=>figs.includes(q.fig)&&q.p).forEach(q=>{(Array.isArray(q.p[0])?q.p:[q.p]).forEach(pp=>{
   o+='<circle cx="'+pp[0]+'" cy="'+pp[1]+'" r="3.2" fill="none" stroke="'+(q.ok===false?'#c00':'#e0f')+'" stroke-width=".9"/>'
    +'<text x="'+(pp[0]+3.5)+'" y="'+(pp[1]-2)+'" font-size="5" fill="'+(q.ok===false?'#c00':'#a0b')+'" font-family="sans-serif">'+q.id.replace(/^(m|112)\./,'')+'</text>';});});
  o+='</svg>';
  await p.setViewportSize({width:dims[0]*sc,height:dims[1]*sc});
  await p.setContent('<html><body style="margin:0;background:#fff">'+o+'</body></html>');
  await p.screenshot({path:path.join(OUT,name+'.png')});}
 await b.close();

 /* ---------- the report ---------- */
 const f2=v=>(v<10?' ':'')+v.toFixed(2);
 console.log('build',res.stamp.src,md5,'at',commit,dirty?'(tree dirty)':'');
 console.log('\nTHE TOOL, CHECKED FIRST');
 console.log(' landmarks round trip, worst',res.check.landmarkRoundTrip,'units');
 console.log(' painted marks against pmNode',painted.map(r=>r.profile+' '+r.drawn+' drawn, worst '+r.worst).join('; '));
 console.log(' by hand, Hridaya:',hc.byHand.join(', '),' tool:',hc.tool.join(', '),hc.agrees?' agree':' DISAGREE');
 console.log('   y =',hc.y_working,'\n   x =',hc.x_working);
 console.log(' page errors',errs.length?errs:'none','  matched addresses drawn off the body',offBody.length?offBody:'none');
 console.log('\nOUR FIGURE  skull top',us.V,' ear',us.E,' neck',us.N.toFixed(2),' neck base',us.S,' crotch',us.C,' sole',us.F.toFixed(2),
  ' widths: skull',us.skull.toFixed(2),'neck',us.neck.toFixed(2),'waist',us.waist.toFixed(2),'at',us.wy,
  '\n ratios, chart pixels to our units: '+Object.keys(FIGS).map(k=>{const f=FIGS[k];
   return k+' skull '+(f.skull/us.skull).toFixed(2)+' neck '+(f.neck/us.neck).toFixed(2)+' waist '+(f.waist/us.waist).toFixed(2);}).join(';  '),
  '\n 1 unit is',(100/H).toFixed(3),'% of height,',cm(1).toFixed(2),'cm on a 175 cm person');
 console.log('\nTHE FLOOR: the two charts, the same place, on our figure');
 agree.forEach(a=>console.log(' ',f2(a.pct)+'%',(a.cm+' cm').padStart(8),' ',a.a,'/',a.b));
 const ag=agree.map(a=>a.pct).sort((x,y)=>x-y);
 console.log('  median',ag[Math.floor(ag.length/2)].toFixed(2)+'%');
 console.log('\nSEAT MARKERS, measured, never moved by this');
 seatRows.forEach(s=>console.log(' ',f2(s.pct)+'%',(s.cm+' cm').padStart(8),' ',s.nm.padEnd(10),'chart point is',
  (s.dy>0?'below':'above'),'by',Math.abs(s.dy).toFixed(2),'units  ',s.nearest));
 console.log('\nADDRESSES');
 rows.slice().sort((a,c)=>c.pct-a.pct).forEach(r=>console.log(' ',f2(r.pct)+'%',(r.cm+' cm').padStart(8),r.band.padEnd(5),
  't'+r.tier,r.source.padEnd(8),String(r.i).padStart(3),r.k.padEnd(28),r.nearest));
 const S=res.summary;
 console.log('\nSUMMARY (share of height; on is within '+ON+'%, near within '+NEAR+'%)');
 [['tier 1',S.tier1],['tier 1 and 2',S.all],['atlas, spine',S.anatomyOnly],['marma alone',S.marmaAlone],['112 alone',S.chart112Alone],['seats',S.seats]].forEach(([nm,s])=>console.log(' ',nm.padEnd(13),
  'n',s.n,' median',s.median+'%',' mean',s.mean+'%',' p90',s.p90+'%',' worst',s.max+'%',' on',s.on,' near',s.near,' off',s.off));
 console.log('\nCHART PLACES, and the ANAT rows that stand on them ('+g.anat.length+' in this build)');
 targets.forEach(t=>console.log(' ',t.pts.join(' + ').padEnd(28),JSON.stringify(t.f).padEnd(30),
  'gathered',JSON.stringify(t.gathered),t.split?' charts '+t.split+'% apart, marma kept':'',t.walked?' walked in '+t.walked:''));
 console.log(drift.length?'DRIFT '+JSON.stringify(drift):' every chart row matches its charts');
 console.log('\nwrote',path.relative(ROOT,path.join(OUT,TAG+'.json')),'and the overlay and proofs beside it');
 if(drift.length||errs.length||offBody.length||Math.max(...selftest)>1e-9||painted.some(r=>r.worst>0.01))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1);});
