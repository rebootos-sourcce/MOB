/* Renders and measures. Run from the repo root, under the shared browser lock:
     flock -o -w 3000 /tmp/atuned-browser.lock env NODE_PATH=/opt/node22/lib/node_modules \
       PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node mockups/paywall/src/shots.js [p1,p2]
   For each version and state, at 1600 by 1000 and 390 by 844, it:
   - saves the picture to shots/
   - FAILS when anything in the sheet is clipped or sits below the fold, because the
     ruling is one screen with no scroll to decide
   - counts the words and the things to press inside the sheet, the demo bar excluded
   - measures contrast against each element's OWN ground, walking up to the first
     surface that paints, never the page: text at 4.5 to 1, a mark at 3 to 1
   - fails on any page error and on any request that leaves the file
   and writes shots/measure.json, which README.md is written from. */
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const DIR=path.resolve(__dirname,'..'),OUT=path.join(DIR,'shots');fs.mkdirSync(OUT,{recursive:true});
const pick=(process.argv[2]||'p1,p2,p3,p4').split(',');
const FILES=fs.readdirSync(DIR).filter(f=>/^p\d-.*\.html$/.test(f)&&pick.some(p=>f.startsWith(p+'-')));
const STATES=['gift','closed','open','out','one','failed','stop'];
const SIZES=[[1600,1000],[390,844]];
const MJ=path.join(OUT,'measure.json');
const M=fs.existsSync(MJ)?JSON.parse(fs.readFileSync(MJ,'utf8')):{};
let bad=0;
function measure(){
 const sheet=document.querySelector('.sheet');if(!sheet)return {err:'no sheet'};
 const H=innerHeight,Wd=innerWidth;
 const parse=c=>{let m=c.match(/rgba?\(([^)]+)\)/);if(m){const p=m[1].split(/[ ,/]+/).filter(Boolean).map(Number);return [p[0],p[1],p[2],p[3]==null?1:p[3]];}
  m=c.match(/color\(srgb ([^)]+)\)/);if(m){const p=m[1].split(/[ /]+/).filter(Boolean).map(Number);return [p[0]*255,p[1]*255,p[2]*255,p[3]==null?1:p[3]];}return null;};
 const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2]);};
 const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
 const over=(f,b)=>[0,1,2].map(i=>f[i]*f[3]+b[i]*(1-f[3])).concat(1);
 const ground=el=>{const layers=[];let e=el;while(e&&e.nodeType===1){const c=parse(getComputedStyle(e).backgroundColor);if(c&&c[3]>0){layers.push(c);if(c[3]>=1)break;}e=e.parentElement;}
  let g=[12,13,18,1];for(let i=layers.length-1;i>=0;i--)g=over(layers[i],g);return g;};
 const vis=el=>{const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&!el.closest('.vh');};
 /* the fold */
 const sr=sheet.getBoundingClientRect();
 let lowest=0,clipped=[];
 sheet.querySelectorAll('*').forEach(el=>{if(!vis(el)||el.closest('.vh'))return;const r=el.getBoundingClientRect();if(r.bottom>lowest)lowest=r.bottom;
  if(r.bottom>H+0.5||r.right>Wd+0.5||r.bottom>sr.bottom+0.5)clipped.push((el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className)+' '+Math.round(r.bottom));});
 /* nothing may hang out of its own card (caught by eye on p5's failed state at 390) */
 sheet.querySelectorAll('.c5,.card').forEach(c=>{const cr=c.getBoundingClientRect();c.querySelectorAll('*').forEach(el=>{if(!vis(el))return;const r=el.getBoundingClientRect();
  if(r.bottom>cr.bottom+0.5||r.right>cr.right+0.5)clipped.push('out of its card: '+(el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className)+' '+Math.round(r.bottom-cr.bottom));});});
 const scrolls=sheet.scrollHeight>sheet.clientHeight+1||document.documentElement.scrollHeight>H+1;
 /* words and presses */
 const cl=sheet.cloneNode(true);cl.querySelectorAll('.vh,.status').forEach(n=>n.remove());
 const hidden=new Set();sheet.querySelectorAll('*').forEach(el=>{if(!vis(el))hidden.add(el);});
 let text=[];const walk=(src)=>{src.childNodes.forEach(n=>{if(n.nodeType===3){if(n.textContent.trim())text.push(n.textContent.trim());}else if(n.nodeType===1&&!hidden.has(n)&&!n.classList.contains('vh')&&!n.classList.contains('status')&&n.tagName!=='svg')walk(n);});};
 walk(sheet);
 const words=text.join(' ').split(/\s+/).filter(w=>/[A-Za-z0-9$]/.test(w)).length;
 const presses=Array.from(sheet.querySelectorAll('button,a,input')).filter(vis);
 const small=presses.filter(p=>{const r=p.getBoundingClientRect();return r.height<43.5||r.width<43.5;}).map(p=>(p.textContent||p.getAttribute('aria-label')||p.type).trim().slice(0,30)+' '+Math.round(p.getBoundingClientRect().width)+'x'+Math.round(p.getBoundingClientRect().height));
 /* contrast */
 const fails=[];let minT=99,minM=99,minTw='',minMw='';
 sheet.querySelectorAll('*').forEach(el=>{if(!vis(el))return;
  const own=Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim());
  if(own&&el.tagName!=='svg'&&!(el instanceof SVGElement)){const c=parse(getComputedStyle(el).color),g=ground(el),r=ratio(over(c,g),g);
   if(r<minT){minT=r;minTw=el.textContent.trim().slice(0,40);}if(r<4.5)fails.push('text '+r.toFixed(2)+' '+el.textContent.trim().slice(0,40));}
  if(el.tagName==='svg'&&el.classList.contains('ri')){const c=parse(getComputedStyle(el).color),g=ground(el.parentElement),r=ratio(over(c,g),g);
   if(r<minM){minM=r;minMw=((el.parentElement&&el.parentElement.getAttribute('class'))||'mark').slice(0,30);}if(r<3)fails.push('mark '+r.toFixed(2)+' '+minMw);}});
 /* the lines a person reads, for the voice gate */
 const lines=[];sheet.querySelectorAll('h1,p,b,span,button,a,div,label,li').forEach(el=>{if(!vis(el))return;
  const t=Array.from(el.childNodes).filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();if(t)lines.push(t);});
 /* an open tooltip (p5): on screen, and its words at 4.5 to 1 against its own ground */
 let tip=null;const tb=document.querySelector('.tip5.on');
 if(tb){const r=tb.getBoundingClientRect();const g=ground(tb);let mt=99;
  tb.querySelectorAll('b,span').forEach(el=>{if(!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))return;
   const rr=ratio(over(parse(getComputedStyle(el).color),g),g);if(rr<mt)mt=rr;});
  tb.querySelectorAll('svg.ri').forEach(el=>{const rr=ratio(over(parse(getComputedStyle(el).color),g),g);if(rr<3)fails.push('tip mark '+rr.toFixed(2));});
  if(mt<4.5)fails.push('tip text '+mt.toFixed(2));
  if(r.left<0||r.top<0||r.right>Wd+.5||r.bottom>H+.5)clipped.push('tip5 off screen');
  tip={text:tb.innerText.replace(/\s+/g,' ').trim(),min:+mt.toFixed(2),words:tb.innerText.split(/\s+/).filter(w=>/[A-Za-z0-9$]/.test(w)).length};
  tb.querySelectorAll('b,span').forEach(el=>{const t=Array.from(el.childNodes).filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();if(t)lines.push(t);});}
 return {tip,lowest:Math.round(lowest),H,clipped:clipped.slice(0,6),scrolls,words,presses:presses.length,small,minText:+minT.toFixed(2),minTextWhat:minTw,minMark:+minM.toFixed(2),minMarkWhat:minMw,fails,lines,sheetH:Math.round(sr.height)};}
(async()=>{const b=await chromium.launch();
 async function shot(file,w,h,q,name,act){
  const pg=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:w<700?2:1,hasTouch:w<700});
  pg.on('pageerror',e=>{bad++;console.log('PAGE ERROR',file,q,e.message);});
  pg.on('request',r=>{if(!r.url().startsWith('file:')&&!r.url().startsWith('data:')){bad++;console.log('NETWORK',file,r.url());}});
  await pg.goto('file://'+path.join(DIR,file)+'?'+q);await pg.waitForTimeout(200);
  if(act){await act(pg,w);await pg.waitForTimeout(150);}
  const m=await pg.evaluate(measure);
  await pg.screenshot({path:path.join(OUT,name)});await pg.close();
  const ok=!m.err&&!m.scrolls&&!m.clipped.length&&!m.fails.length&&!m.small.length;
  if(!ok)bad++;
  M[name]=m;
  console.log((ok?'ok  ':'BAD ')+name.padEnd(30)+' words '+String(m.words).padStart(3)+' presses '+String(m.presses).padStart(2)+' lowest '+m.lowest+'/'+m.H
   +' text '+m.minText+' mark '+m.minMark+(m.scrolls?' SCROLLS':'')+(m.clipped.length?' CLIPPED '+m.clipped.join('; '):'')+(m.fails.length?' CONTRAST '+m.fails.join('; '):'')+(m.small.length?' SMALL '+m.small.join('; '):''));}
 for(const f of FILES){const v=f.slice(0,2);
  for(const s of STATES)for(const [w,h] of SIZES)
   await shot(f,w,h,'s='+s+'&t='+(s==='one'||s==='stop'?'cx':'sab'),v+'-'+s+'-'+w+'.png');
  for(const [w,h] of SIZES){
   await shot(f,w,h,'s=out&t=sab&go=1',v+'-out-account-'+w+'.png');
   await shot(f,w,h,'s=stop&done=1',v+'-stop-done-'+w+'.png');
   await shot(f,w,h,'s=open&t=none',v+'-open-from-billing-'+w+'.png');
   await shot(f,w,h,'s=open&t=hy',v+'-open-touched-hyper-'+w+'.png');
   await shot(f,w,h,'s=open&t=sab&r=1',v+'-open-refund-on-'+w+'.png');}
  if(v==='p3')for(const [w,h] of SIZES)await shot(f,w,h,'s=open&t=sab&pv=three',v+'-open-preview-tier-three-'+w+'.png');
  if(v==='p5')for(const [w,h] of SIZES){
   /* a locked ring on tier one's card: hovered on a desktop, tapped on a phone */
   const sel='.c5[data-pt="one"] .rg5[data-k="hy"]';
   await shot(f,w,h,'s=open&t=sab',v+'-open-tip-locked-'+w+'.png',async(pg,w)=>{if(w<700)await pg.tap(sel);else await pg.hover(sel);});
   /* the number's own meaning, reached by the keyboard alone */
   await shot(f,w,h,'s=open&t=sab',v+'-open-tip-number-'+w+'.png',async(pg)=>{await pg.focus('.c5[data-pt="one"] .hl');});
   await shot(f,w,h,'s=closed&t=cx',v+'-closed-tip-practitioner-'+w+'.png',async(pg,w)=>{if(w<700)await pg.tap('.pn');else await pg.hover('.pn');});}
  if(v==='p4')for(const [w,h] of SIZES)await shot(f,w,h,'s=open&t=sab&all=1',v+'-open-all-plans-'+w+'.png');
  console.log('done',f);}
 fs.writeFileSync(MJ,JSON.stringify(M,null,1));
 await b.close();if(bad){console.log(bad,'problems');process.exit(1);}})();
