/* Builds index.html: the real app's own CSS and markup, with the page content swapped.
   Reads source.html (never edits it). Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/journal-avatar/src/build.js
   The product's stylesheet is copied as is; the only change is the typeface, Onest, the owner's pick,
   in place of the embedded Inter. Interactions are limited to the tabs, loaded or stranger, and the width. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../../..');
const OUT=path.resolve(__dirname,'..');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const MOCKCSS=fs.readFileSync(path.join(__dirname,'mock.css'),'utf8');
const CONTENT=fs.readFileSync(path.join(__dirname,'content.js'),'utf8');
const FONT=fs.readFileSync(path.join(__dirname,'onest.b64'),'utf8').trim();
const TXT="I told my team the launch was fine. It was not fine. I stayed quiet in the meeting while he took the credit, and my chest went tight. I am furious and I feel ashamed that I let it go. I work until the work is done and the work is never done. Rest feels like a moral failure.";
const src=fs.readFileSync(path.join(ROOT,'source.html'),'utf8');
/* the second <style> is the product's stylesheet; the first only carries the embedded Inter */
const styles=[...src.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m=>m[1]);
const PRODUCT_CSS=styles[1];

async function snap(b,page,state,W){
 const p=await b.newPage({viewport:{width:W,height:W===390?844:1000}});
 await p.goto('file://'+path.join(ROOT,'source.html')+'?dev=1');
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
 await p.waitForTimeout(500);
 await p.evaluate(([state])=>{loadP(state==='loaded'?PEOPLE.findIndex(x=>x.nm==='Diane'):PEOPLE.findIndex(x=>x.you));},[state]);
 await p.evaluate(t=>{setTab(t);render&&render();},page==='journal'?0:5);
 await p.waitForTimeout(500);
 if(page==='journal'&&state==='loaded'){await p.fill('#sttext',TXT);await p.waitForTimeout(500);}
 await p.addStyleTag({content:MOCKCSS});await p.addScriptTag({content:CONTENT});
 await p.evaluate(([page,state])=>{(page==='journal'?MOCK.journalPage:MOCK.avatarPage)({state,committed:false});},[page,state]);
 await p.evaluate(()=>window.dispatchEvent(new Event('resize')));await p.waitForTimeout(700);
 const r=await p.evaluate(()=>{
  const app=document.querySelector('.app');
  const clone=app.cloneNode(true);
  /* walk both trees together: keep what is drawn, drop what is not, turn canvases into pictures */
  const A=[],B=[];
  (function w(x,y){A.push(x);B.push(y);for(let i=0;i<x.children.length;i++)w(x.children[i],y.children[i]);})(app,clone);
  for(let i=A.length-1;i>0;i--){
   const x=A[i],y=B[i];if(!y.parentNode)continue;
   const cs=getComputedStyle(x);
   if(x.tagName==='TEXTAREA')y.textContent=x.value;
   if(x.tagName==='SELECT'){[...y.options].forEach((o,j)=>{if(j===x.selectedIndex)o.setAttribute('selected','');else o.removeAttribute('selected');});}
   if(x.tagName==='CANVAS'&&cs.display!=='none'){
    const im=document.createElement('img');im.className=x.className;im.id=x.id;im.setAttribute('style',x.getAttribute('style')||'');
    im.style.width=x.getBoundingClientRect().width+'px';im.style.height=x.getBoundingClientRect().height+'px';
    try{im.src=x.toDataURL('image/webp',.82);}catch(e){}
    y.parentNode.replaceChild(im,y);continue;}
   if(x.tagName==='SCRIPT'||cs.display==='none'){y.remove();continue;}
  }
  const LIVE=[...document.styleSheets].map(sh=>{try{return [...sh.cssRules].map(r=>r.cssText).join('\n');}catch(e){return '';}}).filter(t=>t&&!/font-family: ?"?'?Inter/.test(t.slice(0,200))&&!/\.mk-two/.test(t));
  const bg=document.getElementById('bgaura');let bgd='';try{bgd=bg.toDataURL('image/webp',.8);}catch(e){}
  return {live:LIVE,html:clone.outerHTML,body:document.body.className,bg:bgd,htmlattr:[...document.documentElement.attributes].map(a=>[a.name,a.value])};
 });
 await p.close();return r;
}
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const S={};
 for(const W of [1600,390])for(const page of ['journal','avatar'])for(const state of ['loaded','empty']){const k=page+'-'+state+'-'+(W===390?'p':'d');S[k]=await snap(b,page,state,W);console.log(k,S[k].html.length);}
 await b.close();
 const first=S['journal-loaded-d'];
 const seen=new Set(),LIVE=[];Object.keys(S).forEach(k=>S[k].live.forEach(t=>{if(!seen.has(t)){seen.add(t);LIVE.push(t);}}));
 console.log('live styles',LIVE.length,LIVE.reduce((a,t)=>a+t.length,0));
 const snaps={};Object.keys(S).forEach(k=>{snaps[k]={html:S[k].html,body:S[k].body,bg:S[k].bg}});
 const html=`<!doctype html>
<html lang="en"${first.htmlattr.filter(a=>a[0]!=='lang').map(a=>' '+a[0]+'="'+a[1]+'"').join('')}><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Journal and avatar mockup</title>
<style>@font-face{font-family:'Onest';font-style:normal;font-weight:300 700;font-display:swap;src:url(data:font/woff2;base64,${FONT}) format('woff2')}</style>
<style>${LIVE.join('\n</style><style>')}</style>
<style>:root{--sans:'Onest','Inter',system-ui,-apple-system,'Segoe UI',sans-serif}
html,body{font-family:var(--sans)}
${MOCKCSS}
#mklabel{position:fixed;left:0;right:0;top:0;height:34px;z-index:9999;display:flex;align-items:center;gap:14px;padding:0 14px;background:var(--panel);border-bottom:1px solid var(--edge);font-size:13px;color:var(--ink);font-family:var(--sans)}
#mklabel .t{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#mklabel .seg{display:flex;gap:4px}
#mklabel button{min-height:26px;padding:0 12px;border:1px solid var(--edge-2);border-radius:999px;background:transparent;color:var(--mid);font:inherit;font-size:12px;cursor:pointer}
#mklabel button[aria-pressed=true]{color:var(--ink);border-color:var(--accent);background:color-mix(in srgb,var(--accent) 14%,transparent)}
body.mkpage .app{margin-top:34px}
@media (min-width:821px){body.mkpage .app{height:calc(100vh - 34px)}}
html[data-embed] #mklabel{display:none}html[data-embed] body.mkpage .app{margin-top:0}
@media (min-width:821px){html[data-embed] body.mkpage .app{height:100vh}}
#mkphone{display:none;position:fixed;top:34px;left:0;right:0;bottom:0;background:var(--bg);justify-content:center;z-index:9000;overflow:auto;padding:12px 0}
#mkphone iframe{width:390px;height:calc(100vh - 60px);border:1px solid var(--edge-2);border-radius:18px;background:var(--bg)}
body.mkphone #mkphone{display:flex}
</style></head>
<body class="${first.body}">
<div id="mklabel"><span class="t">Mockup: Journal page and Avatar page. Tabs below switch between them. Nothing here is saved.</span>
<span class="seg" role="group" aria-label="Who is looking"><button type="button" data-st="loaded" aria-pressed="true">Loaded</button><button type="button" data-st="empty" aria-pressed="false">Stranger</button></span>
<span class="seg" role="group" aria-label="Width"><button type="button" data-w="d" aria-pressed="true">Desktop</button><button type="button" data-w="p" aria-pressed="false">Phone 390</button></span></div>
<img id="bgaura" alt="" src="" style="position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none">
<div id="mount"></div><div id="mkphone"></div>
<script>
(function(){
var SNAPS=${JSON.stringify(snaps).replace(/</g,'\\u003c')};
var st='loaded',pg='journal',emb=document.documentElement.hasAttribute('data-embed');
var SELF=null;
function mount(){var s=SNAPS[pg+'-'+st+'-'+(emb?'p':'d')];document.getElementById('bgaura').src=s.bg;document.body.className=s.body+' mkpage'+(document.body.classList.contains('mkphone')?' mkphone':'');
 document.getElementById('mount').innerHTML=s.html;
 [].forEach.call(document.querySelectorAll('#mklabel [data-st]'),function(b){b.setAttribute('aria-pressed',b.dataset.st===st)});}
function goPhone(on){
 document.body.classList.toggle('mkphone',on);
 var host=document.getElementById('mkphone');host.innerHTML='';
 if(on){var f=document.createElement('iframe');f.title='Phone width, 390';f.srcdoc=SELF.replace('<html ','<html data-embed="1" data-pg="'+pg+'" data-st="'+st+'" ');host.appendChild(f);}
 [].forEach.call(document.querySelectorAll('#mklabel [data-w]'),function(b){b.setAttribute('aria-pressed',(b.dataset.w==='p')===on)});}
document.addEventListener('click',function(e){
 var t=e.target.closest('button');if(!t)return;
 if(t.closest('#mklabel')){if(t.dataset.st){st=t.dataset.st;mount();if(document.body.classList.contains('mkphone'))goPhone(true);}
  if(t.dataset.w)goPhone(t.dataset.w==='p');return;}
 var tx=(t.textContent||'').trim();
 if(t.closest('#tabbar')){if(/^Story/.test(tx)){pg='journal';mount();}else if(/^Avatar/.test(tx)){pg='avatar';mount();}}
});
if(emb){pg=document.documentElement.getAttribute('data-pg')||pg;st=document.documentElement.getAttribute('data-st')||st;}
else SELF='<!doctype html>'+document.documentElement.outerHTML;
mount();
})();
</script>
</body></html>`;
 fs.writeFileSync(path.join(OUT,'index.html'),html);
 console.log('index.html',html.length);
})();
