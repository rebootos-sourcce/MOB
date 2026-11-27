/* Shoots every frame of the contact sheet, deterministically (?t=), at 1600x1000,
   390x844 and the 360x640 floor, into frames/. A frame is a function of the
   time since Begin, so the same URL is the same picture every run.

     NODE_PATH=/opt/node22/lib/node_modules node mockups/release-redesign/shots.js [filter]

   It also measures, per frame: that nothing scrolls (the document is no taller
   than the viewport), that every button is at least 44 by 44, and which text is
   under 16 pixels, and writes them to frames/measure.json for index.html. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const DIR=__dirname, OUT=path.join(DIR,'frames');
fs.mkdirSync(OUT,{recursive:true});
const FILTER=process.argv[2]||'';
const SIZES={d:[1600,1000],p:[390,844],f:[360,640]};

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const probe=await b.newPage({viewport:{width:1600,height:1000}});
 await probe.goto('file://'+path.join(DIR,'room.html')+'?bare=1&first=1');
 const M=await probe.evaluate(()=>({cues:REL.CUES,openEnd:REL.OPEN_END,runEnd:REL.RUN_END,
  blocks:REL.BLOCKS.map(b=>({t0:b.t0,hd:b.hd,dur:b.dur,ai:b.ai,ci:b.ci}))}));
 await probe.close();
 const S=M.cues.lines[0], T=M.cues.lines[1], OE=M.openEnd, run=(ai,ci,p,f)=>`at=${ai}.${ci}.${p}&f=${f===undefined?.5:f}`;
 const stemW=(frac)=>T.start+(T.end-T.start)*frac;
 const jobs=[];
 const J=(name,size,q)=>jobs.push({name,size,q});
 /* THE OPENING, as a strip at 0, 1, 2, 3 and 5 seconds, both widths, then the stem */
 for(const sz of ['d','p','f']){
  for(const t of [0,1,2,3,5]) J(`open-${t}s-${sz}`,sz,`t=${t}&first=1`);
  for(const [n,t] of [['intro-end',S.end+0.2],['stem-half',stemW(0.5)],['stem-written',T.end+0.1],['stem-pulse-a',T.end+0.5+0.65],['stem-pulse-b',T.end+0.5+1.95],['stem-frozen',OE-0.05]])
   J(`open-${n}-${sz}`,sz,`t=${t.toFixed(2)}&first=1`);
 }
 /* THE RUN, three directions, every state that carries a different picture */
 for(const dir of ['edges','ring','stage']) for(const sz of ['d','p','f']){
  const d=`dir=${dir}&first=1`, who=(w)=>`&who=${w}`;
  J(`run-${dir}-head-${sz}`,sz,`${d}&at=0.0.0&f=.7`);
  J(`run-${dir}-lrel-${sz}`,sz,`${d}&at=0.0.31&f=.5`);
  J(`run-${dir}-rrel-${sz}`,sz,`${d}&at=0.1.58&f=.5`);
  J(`run-${dir}-lins-${sz}`,sz,`${d}&at=0.2.17&f=.5`);
  J(`run-${dir}-rins-${sz}`,sz,`${d}&at=0.3.76&f=.5`);
  J(`run-${dir}-addr2-${sz}`,sz,`${d}&at=1.1.40&f=.5`);
  J(`run-${dir}-heavy-${sz}`,sz,`${d}&at=0.0.31&f=.5&heavy=1`);
  J(`run-${dir}-paused-${sz}`,sz,`${d}&at=0.1.58&f=.5&paused=1`);
  J(`run-${dir}-sheet-${sz}`,sz,`${d}&at=0.1.58&f=.5&sheet=1`);
  J(`run-${dir}-later-${sz}`,sz,`dir=${dir}&first=0&at=0.0.31&f=.5`);
  for(const w of ['derek','angela','sofia']) J(`run-${dir}-${w}-${sz}`,sz,`${d}${who(w)}&at=0.1.58&f=.5`);
 }
 /* THE DONE STATE, in the same language */
 for(const sz of ['d','p','f']){
  const E=OE+M.runEnd;
  J(`done-cool-a-${sz}`,sz,`dir=ring&dt=2&ended=${M.runEnd}`);
  J(`done-cool-b-${sz}`,sz,`dir=ring&dt=28&ended=${M.runEnd}`);
  J(`done-sum-${sz}`,sz,`dir=ring&dt=125&ended=${M.runEnd}&sum=1&heavy=1`);
  J(`done-sum-more-${sz}`,sz,`dir=ring&dt=125&ended=${M.runEnd}&sum=1&heavy=1&more=1`);
  J(`done-early-${sz}`,sz,`dir=ring&dt=28&ended=${(M.blocks[1].t0+M.blocks[1].hd+40*4).toFixed(1)}`);
 }
 const todo=jobs.filter(j=>!FILTER||j.name.includes(FILTER));
 const measure={};
 for(const sz of Object.keys(SIZES)){
  const p=await b.newPage({viewport:{width:SIZES[sz][0],height:SIZES[sz][1]}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  for(const j of todo.filter(j=>j.size===sz)){
   await p.goto('file://'+path.join(DIR,'room.html')+'?bare=1&'+j.q);
   await p.waitForTimeout(350);
   await p.screenshot({path:path.join(OUT,j.name+'.png')});
   measure[j.name]=await p.evaluate(()=>{
    const bt=[...document.querySelectorAll('.rel button,.rel [role=button],.rel [role=switch],.rel .sw')].filter(e=>e.offsetParent!==null&&getComputedStyle(e).visibility!=='hidden'&&e.getBoundingClientRect().width>0&&!e.closest('.rel-sheet:not(.on)'));
    const small=bt.filter(e=>{const r=e.getBoundingClientRect();return r.width<43.5||r.height<43.5;}).map(e=>(e.id||e.className)+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height));
    const txt=[...document.querySelectorAll('.rel *')].filter(e=>e.children.length===0&&e.textContent.trim()&&e.offsetParent!==null&&getComputedStyle(e).visibility!=='hidden'&&+getComputedStyle(e).opacity>0&&getComputedStyle(e.closest('.rel-scene')||document.body).opacity!=='0');
    const sm=[...new Set(txt.filter(e=>parseFloat(getComputedStyle(e).fontSize)<16&&!e.closest('svg')).map(e=>Math.round(parseFloat(getComputedStyle(e).fontSize))+'px "'+e.textContent.trim().slice(0,18)+'"'))];
    const room=document.querySelector('.rel-room').getBoundingClientRect();
    const sc=document.querySelector('.rel-scene.on'); const vis=[...document.querySelectorAll('.rel-room > *, .rel-room .rel-scene.on > *')];
    const over=vis.filter(e=>e.offsetParent!==null&&e.getBoundingClientRect().bottom>innerHeight+1&&!e.classList.contains('rel-sheet')).map(e=>e.className);
    return {scrollH:document.documentElement.scrollHeight,vh:innerHeight,sceneOverflow:sc?sc.scrollHeight-sc.clientHeight:0,small,sm,over,
     choices:document.querySelectorAll('.rel button:not([hidden]),.rel [role=switch]').length};});
  }
  if(errs.length)console.log(sz,'errors',errs.slice(0,3));
  await p.close();}
 const prev=fs.existsSync(path.join(OUT,'measure.json'))?JSON.parse(fs.readFileSync(path.join(OUT,'measure.json'))):{};
 fs.writeFileSync(path.join(OUT,'measure.json'),JSON.stringify(Object.assign(prev,measure),null,1));
 fs.writeFileSync(path.join(OUT,'times.json'),JSON.stringify({openEnd:OE,runEnd:M.runEnd,stemStart:T.start,stemEnd:T.end,introEnd:S.end},null,1));
 console.log('shot',todo.length,'frames; open ends at',OE.toFixed(1),'s; run is',(M.runEnd/60).toFixed(1),'min');
 await b.close();
})();
