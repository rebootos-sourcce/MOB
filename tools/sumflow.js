/* THE SUMMARY'S FLOW, MEASURED. Round RF, 3 October.

   Renders the Summary on named profiles at a given width, writes a first
   screen shot and a full length shot of each, and prints the numbers the
   page is judged by, so a change to its order is a named difference between
   two runs rather than an impression of two pictures.

     choices        interactive things on the first screen, the whole shell
                    and the Summary column on its own. Working memory is
                    about four and the house target is under twelve.
     todo           how far down the column What to do starts, in pixels and
                    in screens, and the first button a person can press
     words above    words of text standing above What to do, which is what a
                    person reads before they reach the thing they can do
     small text     characters of visible text under 16px and under 13px
     low contrast   characters of visible text under 4.5 to 1 against what
                    is actually behind them
     length         the column's full height, in screens

   Run from the repo root, with NODE_PATH pointing at a playwright install:
     node tools/sumflow.js OUT 1600 1000 Gordon,Diane,Wren
   Prints one JSON line per profile and writes OUT/<w>-<name>.png and
   OUT/<w>-<name>-full.png. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'shots/sumflow';
const W=+(process.argv[3]||1600), H=+(process.argv[4]||1000);
const NAMES=(process.argv[5]||'Gordon,Diane,Wren').split(',');
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:fs.existsSync(CHROME)?CHROME:undefined});
 const errs=[];
 for(const nm of NAMES){
  const p=await b.newPage({viewport:{width:W,height:H}});
  p.on('pageerror',e=>errs.push(nm+': '+String(e.message)));
  await p.goto('file://'+path.resolve('source.html')+'?dev=1');
  await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000}).catch(()=>{});
  await p.evaluate(n=>{var i=PEOPLE.findIndex(function(x){return x.nm===n;});
   if(i<0)throw new Error('no profile named '+n);
   loadP(i); setTab(TAB.SUMMARY); render();},nm);
  await p.waitForTimeout(900);
  const m=await p.evaluate(()=>{
   const body=document.getElementById('sumbody');
   /* the column scrolls inside #sum on a desktop and the page scrolls on a
      phone, so the scroller is found and not assumed */
   let host=body; while(host&&host!==document.documentElement){const cs=getComputedStyle(host);
    if(/(auto|scroll)/.test(cs.overflowY)&&host.scrollHeight>host.clientHeight+1)break; host=host.parentElement;}
   if(!host||host===document.documentElement)host=document.scrollingElement;
   host.scrollTop=0;
   const vis=el=>{const r=el.getBoundingClientRect(); if(r.width<2||r.height<2)return false;
    const cs=getComputedStyle(el); if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)return false;
    if(el.closest('details:not([open])')&&!el.matches('summary'))return false;
    return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;};
   const ISEL='button,a[href],summary,input,select,textarea,[tabindex="0"],[role="button"]';
   const inView=root=>[...root.querySelectorAll(ISEL)].filter(vis);
   const top0=(host===document.scrollingElement||host===document.body)?0:host.getBoundingClientRect().top;
   const at=el=>el?Math.round(el.getBoundingClientRect().top-top0+host.scrollTop):null;
   const todo=body.querySelector('#sg-h-todo');
   const act=body.querySelector('.s-oact');
   /* words standing above What to do, read off the geometry and not the
      markup order, because beside is not before */
   let wordsAbove=0;
   if(todo){const ty=todo.getBoundingClientRect().top;
    const tw=document.createTreeWalker(body,NodeFilter.SHOW_TEXT);
    let n; while((n=tw.nextNode())){const el=n.parentElement; if(!el||!vis2(el))continue;
     const r=el.getBoundingClientRect(); if(r.top<ty)wordsAbove+=(n.textContent.trim().match(/\S+/g)||[]).length;}}
   function vis2(el){const r=el.getBoundingClientRect(); if(r.width<1||r.height<1)return false;
    const cs=getComputedStyle(el); if(cs.visibility==='hidden'||cs.display==='none')return false;
    if(el.closest('details:not([open])')&&!el.closest('summary'))return false; return true;}
   /* legibility: every visible text node, by characters */
   const rgb=s=>{const m=String(s).match(/rgba?\(([^)]+)\)/); if(!m)return null;
    const v=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return {r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1};};
   const lum=c=>{const f=x=>{x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4);};
    return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b);};
   const mix=(top,bot)=>({r:top.r*top.a+bot.r*(1-top.a),g:top.g*top.a+bot.g*(1-top.a),b:top.b*top.a+bot.b*(1-top.a),a:1});
   const bgOf=el=>{const stack=[]; let e=el; while(e){const c=rgb(getComputedStyle(e).backgroundColor);
     if(c&&c.a>0){stack.push(c); if(c.a>=1)break;} e=e.parentElement;}
    let base=rgb(getComputedStyle(document.body).backgroundColor)||{r:0,g:0,b:0,a:1}; if(base.a<1)base.a=1;
    for(let i=stack.length-1;i>=0;i--)base=mix(stack[i],base); return base;};
   let chars=0, small16=0, small13=0, low=0; const lows={};
   const tw2=document.createTreeWalker(body,NodeFilter.SHOW_TEXT);
   let t; while((t=tw2.nextNode())){const s=t.textContent.replace(/\s+/g,''); if(!s)continue;
    const el=t.parentElement; if(!el||!vis2(el))continue;
    const cs=getComputedStyle(el), fs=parseFloat(cs.fontSize);
    let fg=rgb(cs.color); if(!fg)continue; const bg=bgOf(el); fg=mix({...fg,a:fg.a*(+cs.opacity||1)},bg);
    const L1=lum(fg), L2=lum(bg), cr=(Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
    chars+=s.length; if(fs<16)small16+=s.length; if(fs<13)small13+=s.length;
    if(cr<4.5){low+=s.length; const k=(el.className&&String(el.className).split(' ')[0])||el.tagName.toLowerCase(); lows[k]=(lows[k]||0)+s.length;}}
   const shell=inView(document.body).length, col=inView(body).length;
   return {sumH:body.scrollHeight, screens:+(host.scrollHeight/host.clientHeight).toFixed(2),
    viewH:host.clientHeight, choicesShell:shell, choicesCol:col,
    interactiveCol:body.querySelectorAll(ISEL).length,
    todoY:at(todo), todoScreens:todo?+(at(todo)/host.clientHeight).toFixed(2):null,
    firstActionY:at(act), firstAction:act?act.textContent.trim():null,
    wordsAbove, chars, small16, small13, lowContrast:low,
    lowBy:Object.entries(lows).sort((a,b)=>b[1]-a[1]).slice(0,6)};});
  console.log(JSON.stringify({w:W,profile:nm,...m}));
  await p.screenshot({path:`${OUT}/${W}-${nm.toLowerCase()}.png`});
  /* the full length, by growing the viewport to the column, since the
     column scrolls inside #sum and a page screenshot does not see it */
  const full=await p.evaluate(()=>{const body=document.getElementById('sumbody');
   let h=body; while(h&&h!==document.documentElement){const cs=getComputedStyle(h);
    if(/(auto|scroll)/.test(cs.overflowY)&&h.scrollHeight>h.clientHeight+1)break; h=h.parentElement;}
   if(!h||h===document.documentElement)h=document.scrollingElement;
   return h.scrollHeight+(innerHeight-h.clientHeight);});
  await p.setViewportSize({width:W,height:Math.min(full,16000)});
  await p.waitForTimeout(500);
  await p.screenshot({path:`${OUT}/${W}-${nm.toLowerCase()}-full.png`});
  await p.close();
 }
 console.log(errs.length?'JS ERRORS: '+errs.join(' | '):'no JS errors');
 await b.close();
})();
