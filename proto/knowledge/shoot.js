/* ============================================================
   Shoots and measures the four mockups, for the ICP walk.

   NODE_PATH=/opt/node22/lib/node_modules node proto/knowledge/shoot.js [outdir]

   For each mockup, each width (1600 by 1000 and 390 by 844) and each
   viewer (a stranger, and the six reference ICPs), it records, read off
   the DOM rather than predicted:

     choices   interactive elements at least partly above the fold,
               excluding the prototype chrome and the navigation stand in
     words     words of text above the fold before the first figure
     yours     whether anything above the fold is about this person
     small     interactive elements under 44 by 44
     overflow  horizontal page scroll, which must be zero
     banned    an em dash or the count below 112 in the rendered text
     firstTap  taps from arrival to an entry's full text

   Then shoots stranger and Diane at both widths, and one opened entry.
   ============================================================ */
const {chromium}=require('playwright'), path=require('path'), fs=require('fs');
const D=__dirname, OUT=process.argv[2]||path.join(D,'shots');
const NAMES=['a-atlas','b-deck','c-codex','d-map'];
const WHO=['','Sofia','Diane','Marcus','Angela','Derek','James'];
fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const rows=[];
 for(const n of NAMES){
  const file=path.join(D,n+'.html'); if(!fs.existsSync(file))continue;
  for(const [W,H] of [[1600,1000],[390,844]]){
   for(const who of WHO){
    const ctx=await b.newContext({viewport:{width:W,height:H}});
    await ctx.addInitScript(w=>{try{localStorage.clear(); if(w)localStorage.setItem('kbp-who',w);}catch(e){}},who);
    const p=await ctx.newPage(); const errs=[];
    p.on('pageerror',e=>errs.push(String(e.message)));
    await p.goto('file://'+file); await p.waitForTimeout(250);
    const m=await p.evaluate(()=>{
     const chrome=el=>el.closest('.proto-bar,.nav-ph,.proto-note');
     const vis=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      return r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0&&s.visibility!=='hidden'&&s.display!=='none';};
     const ia=[...document.querySelectorAll('button,a[href],input,select,[tabindex]:not([tabindex="-1"])')]
      .filter(el=>!chrome(el)&&vis(el));
     const small=ia.filter(el=>{const r=el.getBoundingClientRect();return r.width<44||r.height<44;})
      .map(el=>(el.className||el.tagName)+':'+Math.round(el.getBoundingClientRect().width)+'x'+Math.round(el.getBoundingClientRect().height));
     /* words before the first figure, reading order, above the fold */
     const main=document.querySelector('main'); let words=0, hitFig=false;
     const tw=document.createTreeWalker(main,NodeFilter.SHOW_TEXT);
     while(tw.nextNode()){const t=tw.currentNode, el=t.parentElement; if(!el||!vis(el))continue;
      if(el.getBoundingClientRect().top>innerHeight)break;
      if(/\d+%|weight of \d/.test(t.textContent)){hitFig=true;break;}
      words+=t.textContent.trim().split(/\s+/).filter(Boolean).length;}
     const txt=document.body.innerText;
     return {choices:ia.length, small:small.slice(0,6), nSmall:small.length,
      words:hitFig?words:null, overflow:document.documentElement.scrollWidth>innerWidth,
      banned:/\u2014/.test(txt)||/\b108\b/.test(txt),
      yours:/\d+%|You carry|Held here at|Running in your reading/.test(
        [...main.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0).map(e=>e.textContent).join(' '))};});
    /* taps to an entry's full text: the first entry control, then check a sheet exists */
    let taps=null;
    try{
     const first=await p.$('main [data-open]');
     if(first){await first.click(); await p.waitForTimeout(200);
      taps=(await p.$('.sheet'))?1:null;
      if(taps===null){const s2=await p.$('main [data-open]'); if(s2){await s2.click(); await p.waitForTimeout(200); taps=(await p.$('.sheet'))?2:null;}}}
    }catch(e){}
    rows.push({n,W,who:who||'stranger',...m,taps,errs:errs.length});
    if(who===''||who==='Diane'){
     await p.goto('file://'+file); await p.mouse.move(0,0); await p.waitForTimeout(250);
     await p.screenshot({path:`${OUT}/${n}-${W}-${who||'stranger'}.png`});
     if(who==='Diane'){
      /* each mockup's own first move: a card, the card's last face, a plate, a seated emotion */
      const sel={'a-atlas':'main .card','b-deck':null,'c-codex':'main .plate','d-map':'main .ax'}[n];
      if(sel){const f=await p.$(sel); if(f){await f.click(); await p.waitForTimeout(400);}}
      else{for(let i=0;i<6;i++){const nx=await p.$('#next'); if(!nx)break; await nx.click(); await p.waitForTimeout(80);}}
      if(n==='d-map')await p.evaluate(()=>window.scrollTo(0,0));
      await p.mouse.move(0,0); await p.waitForTimeout(500);
      await p.screenshot({path:`${OUT}/${n}-${W}-Diane-open.png`});}}
    await ctx.close();}}}
 fs.writeFileSync(path.join(OUT,'measure.json'),JSON.stringify(rows,null,1));
 for(const r of rows)console.log([r.n,r.W,r.who.padEnd(8),'choices',r.choices,'small',r.nSmall,'words',r.words,
  'yours',r.yours,'taps',r.taps,'overflow',r.overflow,'banned',r.banned,'errs',r.errs].join(' '));
 await b.close();})();
