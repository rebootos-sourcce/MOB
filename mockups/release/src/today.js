/* Today's release screens, as built from main. Builds nothing: point it at a built source.html.
   Run from the repo root after ./atuned_src/BUILD.sh, under the browser lock:
     flock -o -w 3000 /tmp/atuned-browser.lock env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
       node mockups/release/src/today.js $PWD/source.html $PWD/mockups/release/shots/today
   Commits a story on loadP(0), picks the three heaviest addresses, opens the release, presses Run release,
   and pictures each phase: set up, settle, opening, the list, rest, results. Prints words, presses in view,
   and the lowest text contrast against each element's own ground (opacity is not seen by this probe). */
const {chromium}=require('playwright');const path=require('path');
const SRC=process.argv[2], OUT=process.argv[3];
const STORY='I am afraid I will be left. When she goes quiet I panic and try to control everything, and my chest goes tight.';
(async()=>{const b=await chromium.launch();
for(const [W,H] of [[1600,1000],[390,844]]){
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:W<700?2:1});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+SRC+'?dev=1');
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}
 await p.waitForTimeout(800);
 await p.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();});
 await p.evaluate(t=>{loadP(0);ST_TEXT=t;ST_PARSED=parseStory(t);stCommit();compute();setTab(TAB.FIELD);render();
  relPick(W.filter(n=>n.cf&&n.sq>=1).sort((a,b)=>b.sq-a.sq).slice(0,3).map(n=>n.i));
  var d=document.getElementById('msgdock');if(d)d.style.visibility='hidden';},STORY);
 await p.waitForTimeout(500);
 const shot=async n=>{const mm=await p.evaluate((function measure(){
 const sheet=(document.querySelector('#rel .rel-card'));if(!sheet)return {err:'no sheet'};
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
 sheet.querySelectorAll('.nonexist').forEach(c=>{const cr=c.getBoundingClientRect();c.querySelectorAll('*').forEach(el=>{if(!vis(el))return;const r=el.getBoundingClientRect();
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
  if(own&&el.tagName!=='svg'&&!(el instanceof SVGElement)){const c=parse(getComputedStyle(el).color);if(!c)return;const g=ground(el),r=ratio(over(c,g),g);
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
 return {tip,lowest:Math.round(lowest),H,clipped:clipped.slice(0,6),scrolls,words,presses:presses.length,small,minText:+minT.toFixed(2),minTextWhat:minTw,minMark:+minM.toFixed(2),minMarkWhat:minMw,fails,lines,sheetH:Math.round(sr.height)};}));console.log('  contrast min text',mm.minText,JSON.stringify(mm.minTextWhat),'fails',mm.fails.length,mm.fails.slice(0,4).join(' | '));await p.screenshot({path:path.join(OUT,n+'-'+W+'.png')});
  const t=await p.evaluate(()=>{const c=document.querySelector('#rel .rel-card')||document.getElementById('rel');return c?c.innerText.split(/\s+/).filter(w=>/[A-Za-z0-9]/.test(w)).length:-1;});
  const pr=await p.evaluate(()=>Array.from(document.querySelectorAll('#rel button,#rel input,#rel a')).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight;}).length);
  console.log(n,W,'words',t,'presses in view',pr);};
 await shot('1-setup');
 await p.evaluate(()=>{var sc=document.getElementById('relsc');if(sc)sc.scrollTop=sc.scrollHeight;});await p.waitForTimeout(200);
 await shot('1b-setup-scrolled');
 await p.evaluate(()=>{var sc=document.getElementById('relsc');if(sc)sc.scrollTop=0;});
 await p.click('#relgo').catch(e=>console.log('no relgo',e.message));await p.waitForTimeout(700);
 await p.evaluate(()=>{RUN.paused=true;relTicker(false);relRender();});
 await shot('2-settle');
 await p.evaluate(()=>{RUN.phase='opening';RUN.line=0;relRender();});await p.waitForTimeout(300);
 await shot('3-opening');
 await p.evaluate(()=>{RUN.phase='run';RUN.idx=0;RUN.pass=3;RUN.paused=false;relRender();RUN.paused=true;relRender();});await p.waitForTimeout(400);
 await shot('4-carousel');
 await p.evaluate(()=>{RUN.idx=1;RUN.pass=7;relRender();});await p.waitForTimeout(300);
 await shot('4b-carousel-later');
 await p.evaluate(()=>{RUN.halted=false;RUN.idx=RUN.plan.length;relCoolDown();});await p.waitForTimeout(500);
 await shot('5-rest');
 await p.evaluate(()=>{RUN.settleAt=Date.now()-121000;relSecond();});await p.waitForTimeout(500);
 await shot('6-results');
 await p.evaluate(()=>{var sc=document.getElementById('relsc');if(sc)sc.scrollTop=sc.scrollHeight;});await p.waitForTimeout(200);
 await shot('6b-results-scrolled');
 console.log('errors',W,errs.slice(0,5));
 await p.close();}
await b.close();})();
