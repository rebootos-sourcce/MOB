/* Renders and measures. Run from the repo root, under the shared browser lock:
     flock -o -w 3000 /tmp/atuned-browser.lock env NODE_PATH=/opt/node22/lib/node_modules \
       PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node mockups/release/src/shots.js [r1,r2]
   For each version and state, at 1600 by 1000 and 390 by 844, and for the run and
   the cooldown again with reduced motion, it:
   - saves the picture to shots/ (JPEG, so the folder stays small)
   - FAILS when anything sits below the fold or off the side, because the ruling is
     one screen with no scroll
   - counts the words and the things to press on the screen, the demo bar excluded,
     and FAILS when the running list offers more than two things to press
   - measures contrast against each element's OWN ground, walking up to the first
     surface that paints, never the page: text at 4.5 to 1, a mark at 3 to 1. Rows
     faded on purpose by opacity (the carousel's neighbours) are not seen by this
     probe; the line in focus is.
   - fails on any page error and on any request that leaves the file
   and writes shots/measure.json, which README.md is written from. */
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const DIR=path.resolve(__dirname,'..'),OUT=path.join(DIR,'shots');fs.mkdirSync(OUT,{recursive:true});
const pick=(process.argv[2]||'r1,r2,r3,r4').split(',');
const FILES=fs.readdirSync(DIR).filter(f=>/^r\d-.*\.html$/.test(f)&&pick.some(p=>f.startsWith(p+'-')));
const STATES=process.argv[3]?process.argv[3].split(','):['before','script','run','reframe','paused','cool','done','spent'];
const EXTRA=!process.argv[3];
const SIZES=[[1600,1000],[390,844]];
const MJ=path.join(OUT,'measure.json');
const M=fs.existsSync(MJ)?JSON.parse(fs.readFileSync(MJ,'utf8')):{};
let bad=0;
function measure(){
 const root=document.querySelector('#rs');if(!root)return {err:'no screen'};
 const H=innerHeight,Wd=innerWidth;
 const parse=c=>{let m=c.match(/rgba?\(([^)]+)\)/);if(m){const p=m[1].split(/[ ,/]+/).filter(Boolean).map(Number);return [p[0],p[1],p[2],p[3]==null?1:p[3]];}
  m=c.match(/color\(srgb ([^)]+)\)/);if(m){const p=m[1].split(/[ /]+/).filter(Boolean).map(Number);return [p[0]*255,p[1]*255,p[2]*255,p[3]==null?1:p[3]];}return null;};
 const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2]);};
 const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
 const over=(f,b)=>[0,1,2].map(i=>f[i]*f[3]+b[i]*(1-f[3])).concat(1);
 const ground=el=>{const layers=[];let e=el;while(e&&e.nodeType===1){const c=parse(getComputedStyle(e).backgroundColor);if(c&&c[3]>0){layers.push(c);if(c[3]>=1)break;}e=e.parentElement;}
  let g=parse(getComputedStyle(document.body).backgroundColor)||[18,19,26,1];for(let i=layers.length-1;i>=0;i--)g=over(layers[i],g);return g;};
 /* seen: has a box, is not hidden, and is not a carousel row faded out of focus */
 const vis=el=>{const r=el.getBoundingClientRect();const cs=getComputedStyle(el);
  if(!(r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'))return false;
  if(el.closest('.vh'))return false;
  const row=el.closest('.cr');if(row&&(row.dataset.d!=='0'||row.classList.contains('gone')||getComputedStyle(row).opacity<.05))return false;
  let e=el;while(e&&e!==document.body){if(+getComputedStyle(e).opacity<.05)return false;e=e.parentElement;}
  return true;};
 const name=el=>(el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className)||el.tagName;
 let lowest=0,clipped=[];
 root.querySelectorAll('*').forEach(el=>{if(!vis(el))return;const r=el.getBoundingClientRect();if(r.bottom>lowest)lowest=r.bottom;
  if(r.bottom>H+0.5||r.right>Wd+0.5||r.left<-0.5||r.top<-0.5)clipped.push(name(el)+' '+Math.round(r.top)+'..'+Math.round(r.bottom));});
 /* nothing the eye reads may sit under anything else the eye reads: the cheap
    collision check, over text blocks and presses only */
 const blocks=Array.from(root.querySelectorAll('button,a,p,b,.t,.fg,.vm,.prompt,span')).filter(vis).filter(el=>!el.closest('button')||el.tagName==='BUTTON');
 const hits=[];
 for(let i=0;i<blocks.length;i++)for(let j=i+1;j<blocks.length;j++){const a=blocks[i],b=blocks[j];if(a.contains(b)||b.contains(a))continue;
  const A=a.getBoundingClientRect(),B=b.getBoundingClientRect();const ix=Math.min(A.right,B.right)-Math.max(A.left,B.left),iy=Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top);
  if(ix>2&&iy>2&&(a.matches('button,a')||b.matches('button,a')||(a.textContent.trim()&&b.textContent.trim()&&!a.closest('svg')&&!b.closest('svg'))))hits.push(name(a)+' x '+name(b));}
 const scrolls=document.documentElement.scrollHeight>H+1||root.scrollHeight>root.clientHeight+1;
 /* words and presses */
 let text=[];const walk=src=>{src.childNodes.forEach(n=>{if(n.nodeType===3){if(n.textContent.trim()&&vis(n.parentElement))text.push(n.textContent.trim());}
  else if(n.nodeType===1&&n.tagName!=='svg'&&!n.classList.contains('st')&&vis(n))walk(n);});};
 walk(root);
 const words=text.join(' ').split(/\s+/).filter(w=>/[A-Za-z0-9$]/.test(w)).length;
 const presses=Array.from(root.querySelectorAll('button,a,input')).filter(vis);
 const small=presses.filter(p=>{const r=p.getBoundingClientRect();return r.height<43.5||r.width<43.5;}).map(p=>(p.textContent||p.getAttribute('aria-label')||'').trim().slice(0,30)+' '+Math.round(p.getBoundingClientRect().width)+'x'+Math.round(p.getBoundingClientRect().height));
 const fails=[];let minT=99,minM=99,minTw='',minMw='';
 root.querySelectorAll('*').forEach(el=>{if(!vis(el)||el.closest('.st'))return;
  const own=Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim());
  if(own&&!(el instanceof SVGElement)){const c=parse(getComputedStyle(el).color);if(!c)return;const g=ground(el),r=ratio(over(c,g),g);
   if(r<minT){minT=r;minTw=el.textContent.trim().slice(0,40);}if(r<4.5)fails.push('text '+r.toFixed(2)+' '+el.textContent.trim().slice(0,40));}
  if(el.tagName==='svg'&&(el.classList.contains('ri')||el.classList.contains('mk'))){const c=parse(getComputedStyle(el).color);if(!c)return;const g=ground(el.parentElement),r=ratio(over(c,g),g);
   if(r<minM){minM=r;minMw=name(el.parentElement).slice(0,30);}if(r<3)fails.push('mark '+r.toFixed(2)+' '+minMw);}});
 const lines=[];root.querySelectorAll('h1,h2,p,b,span,button,a,div').forEach(el=>{if(!vis(el)||el.closest('.st'))return;
  const t=Array.from(el.childNodes).filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();if(t)lines.push(t);});
 return {lowest:Math.round(lowest),H,clipped:clipped.slice(0,6),hits:hits.slice(0,6),scrolls,words,presses:presses.length,
  pressNames:presses.map(p=>(p.textContent||p.getAttribute('aria-label')||'').trim().slice(0,24)),small,
  minText:+minT.toFixed(2),minTextWhat:minTw,minMark:+minM.toFixed(2),minMarkWhat:minMw,fails,lines};}
(async()=>{const b=await chromium.launch();
 async function shot(file,w,h,q,name,act){
  const pg=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:w<700?2:1,hasTouch:w<700});
  pg.on('pageerror',e=>{bad++;console.log('PAGE ERROR',file,q,e.message);});
  pg.on('request',r=>{if(!r.url().startsWith('file:')&&!r.url().startsWith('data:')){bad++;console.log('NETWORK',file,r.url());}});
  await pg.goto('file://'+path.join(DIR,file)+'?'+q);await pg.waitForTimeout(250);
  if(act){await act(pg,w);await pg.waitForTimeout(150);}
  await pg.waitForTimeout(650);
  const m=await pg.evaluate(measure);
  await pg.screenshot({path:path.join(OUT,name),type:'jpeg',quality:82});await pg.close();
  const running=/-(run|reframe|script)(-rm)?-/.test(name);
  const tooMany=running&&m.presses>2;
  const ok=!m.err&&!m.scrolls&&!m.clipped.length&&!m.fails.length&&!m.small.length&&!m.hits.length&&!tooMany;
  if(!ok)bad++;
  M[name]=m;
  console.log((ok?'ok  ':'BAD ')+name.padEnd(30)+' words '+String(m.words).padStart(3)+' presses '+String(m.presses).padStart(2)+' lowest '+m.lowest+'/'+m.H
   +' text '+m.minText+' mark '+m.minMark+(m.scrolls?' SCROLLS':'')+(m.clipped.length?' CLIPPED '+m.clipped.join('; '):'')+(m.hits.length?' OVERLAP '+m.hits.join('; '):'')
   +(m.fails.length?' CONTRAST '+m.fails.join('; '):'')+(m.small.length?' SMALL '+m.small.join('; '):'')+(tooMany?' TOO MANY PRESSES '+m.pressNames.join(' | '):''));}
 for(const f of FILES){const v=f.slice(0,2);
  for(const s of STATES)for(const [w,h] of SIZES)await shot(f,w,h,'embed=1&s='+s,v+'-'+s+'-'+w+'.jpg');
  if(EXTRA)for(const s of ['run','cool'])for(const [w,h] of SIZES)await shot(f,w,h,'embed=1&rm=1&s='+s,v+'-'+s+'-rm-'+w+'.jpg');
  /* the crisis door, opened from the running list: reachable, and its panel fits */
  if(EXTRA)for(const [w,h] of SIZES)await shot(f,w,h,'embed=1&s=run',v+'-run-crisis-'+w+'.jpg',async pg=>{await pg.click('.crx');});
  console.log('done',f);}
 fs.writeFileSync(MJ,JSON.stringify(M,null,1));
 await b.close();if(bad){console.log(bad,'problems');process.exit(1);}})();
