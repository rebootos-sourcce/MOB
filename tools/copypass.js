/* ============================================================
   THE COPY PASS, CAPTURED OFF THE LIVE BUILD.

   His words, and they are the reason this file exists: "you have got copy
   objections, but I do not see your editorial pass. So update that with the
   editorial pass so I can see. I want a copy pass that shows me what the
   tooltip text looks like, what the information text looks like, what the
   summary text looks like, and any of their special text, rituals or whatever
   else, so that it is in front of me so I can react to it."

   So it is a specimen sheet and not a list, and a specimen has to be the real
   string. This walks source.html in Chromium, on a blank profile and on a
   loaded one, and writes every string a person actually reads to a JSON file.
   tools/copypass.py renders the sheet from it.

   WHY IT IS A BROWSER AND NOT A GREP. Half the copy in this product does not
   exist until a value is substituted into it. "at a weight of 7.4" is three
   literals and a number, and the number comes out of the engine. A sentence
   with the number missing from it is not the sentence a person reads, so the
   specimen is taken after the render and not before it.

   THREE LESSONS ARE CARRIED OVER FROM monitor.js RATHER THAN RELEARNED.

   1. THE HOST IS LOOKED UP BY ITS ID. monitor.js took the first visible child
      of .stage and measured the Field's key strip nine times. Anything needing
      a tab's entry looks it up by identity, never by position.
   2. THE SURFACE LIST IS READ OFF TABDEF AND TABEXTRA AT RUN TIME. A hand
      written list of surfaces went stale the day Ritual landed.
   3. innerText DOES NOT SEE SVG. The Body page is one SVG. Text inside it is
      read out of the SVG text nodes as well, or that surface reports nothing.

   AND ONE THAT IS THIS FILE'S OWN. A tooltip carrier is found by attribute and
   not by class. tip.js falls back to the native title, so a carrier is
   anything holding data-tip or title, and the audit that counted them by class
   was wrong by a factor of twenty four.

       NODE_PATH=/opt/node22/lib/node_modules node tools/copypass.js
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs'), cp=require('child_process');

const FILE=path.resolve(process.argv[2]||path.join(__dirname,'..','source.html'));
const OUT=path.resolve(process.argv[3]||path.join(__dirname,'..','.copypass.json'));
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const sh=c=>{try{return cp.execSync(c,{encoding:'utf8'}).trim();}catch(e){return '?';}};

/* WHOSE PROFILE THE LOADED READINGS COME FROM, and the sheet says so beside
   every one of them. Derek is level 7 on the grid in BUYERS.md, endurance, and
   he wants the diagnostic, so he is the reader who most quickly catches a
   figure with no instrument behind it. A reading shown on his numbers is the
   reading under the most load. */
const WHO='Derek';

const TABS_JS=`(function(){var a=TABDEF.map(function(t){return [t.nm,t.k,t.id];});
 Object.keys(TABEXTRA).forEach(function(k){var t=TABEXTRA[k];a.push([t.nm,t.k,t.id]);});
 return a;})()`;

/* EVERY TOOLTIP ON THE SCREEN, read the way tip.js reads one. The panel is
   built from data-tip with the native title as the body of last resort, plus
   four optional parts, so a specimen of a tooltip is those five fields and not
   the attribute alone. The carrier's own text goes with it, because a
   definition is read against the thing it defines. */
const TIPS_JS=`(function(){
 var seen={}, out=[];
 [].forEach.call(document.querySelectorAll('[data-tip],[title]'),function(e){
  var b=e.getAttribute('data-tip'); if(b==null)b=e.getAttribute('title');
  if(!b)return;
  var r=e.getBoundingClientRect();
  if(!(r.width>0&&r.height>0))return;
  var st=getComputedStyle(e);
  if(st.display==='none'||st.visibility==='hidden')return;
  var d={b:b,
   t:e.getAttribute('data-tip-t')||'',
   k:e.getAttribute('data-tip-k')||'',
   a:e.getAttribute('data-tip-a')||'',
   n:(e.getAttribute('data-tip-n')||'').split(';').filter(Boolean),
   on:(e.innerText||e.textContent||'').trim().replace(/\\s+/g,' ').slice(0,60),
   cls:(typeof e.className==='string'?e.className:'').slice(0,40)};
  var key=d.k+'|'+d.t+'|'+d.b+'|'+d.a;
  if(seen[key])return; seen[key]=1; out.push(d);});
 return out;})()`;

/* EVERY BLOCK OF WORDS ON THE SURFACE, in the order the eye meets them, with
   enough about each one to tell prose from a label from a figure. The class
   list rides along because the sheet has to draw a figure as a figure, and the
   stylesheet is the only thing that knows which is which.

   A HEADING, A LABEL AND A VALUE ARE TAKEN FROM THE LEAF AND PROSE FROM THE
   BLOCK. Reading every element gives the same sentence six times, once per
   ancestor. Reading only leaves loses a paragraph that carries a bold word
   inside it. So: a node qualifies if it has no element child that itself
   qualifies, or if its own direct text runs to a sentence. */
const BLOCKS_JS=`(function(id){
 var host=document.getElementById(id); if(!host)return [];
 var out=[], seen={};
 function txt(e){
  var s=e.tagName==='svg'||e.closest('svg')?(e.textContent||''):(e.innerText||e.textContent||'');
  return s.replace(/\\s+/g,' ').trim();}
 function vis(e){
  var r=e.getBoundingClientRect(); if(!(r.width>0||r.height>0))return false;
  var st=getComputedStyle(e);
  return st.display!=='none'&&st.visibility!=='hidden';}
 function own(e){
  var s=''; [].forEach.call(e.childNodes,function(n){
   if(n.nodeType===3)s+=n.nodeValue;});
  return s.replace(/\\s+/g,' ').trim();}
 var all=host.querySelectorAll('*');
 [].forEach.call(all,function(e){
  if(/^(SCRIPT|STYLE|BR|CANVAS)$/.test(e.tagName))return;
  if(!vis(e))return;
  var t=txt(e); if(!t||t.length<2)return;
  var kids=[].filter.call(e.children,function(c){
   var ct=txt(c); return ct&&ct.length>=2&&vis(c);});
  var o=own(e);
  /* a container whose words all live in its children is not a specimen, unless
     its own direct text is itself a sentence wrapped round them. */
  if(kids.length&&!(o.length>24&&/[a-z] [a-z]/.test(o)))return;
  if(t.length>900)return;
  if(seen[t])return; seen[t]=1;
  var st=getComputedStyle(e);
  out.push({t:t, tag:e.tagName.toLowerCase(),
   cls:(typeof e.className==='string'?e.className:'').slice(0,60),
   fam:(st.fontFamily||'').slice(0,24),
   size:parseFloat(st.fontSize)||0,
   caps:st.textTransform==='uppercase',
   num:/var\\(--num\\)|mono|tabular/i.test(st.fontFamily||'')});});
 return out;})`;

/* THE SHELL, WHICH IS COPY TOO AND SITS OUTSIDE EVERY SURFACE. The tab bar,
   the rails, the profile control and the boot card. A walk that starts at the
   tab host never sees the first words a person reads. */
const SHELL_JS=`(function(){
 var out=[];
 ['.top','[data-rail]','.boot','#bootcard','.lrail','.rrail'].forEach(function(sel){
  [].forEach.call(document.querySelectorAll(sel),function(h){
   var t=(h.innerText||'').replace(/\\s+/g,' ').trim();
   if(t)out.push({sel:sel,t:t.slice(0,600)});});});
 return out;})()`;

(async()=>{
 if(!fs.existsSync(FILE)){console.error('no build at '+FILE);process.exit(1);}
 const md5=sh('md5sum '+FILE).split(' ')[0].slice(0,12);
 const commit=sh('git -C '+path.dirname(FILE)+' rev-parse --short HEAD');
 const dirty=!!sh('git -C '+path.dirname(FILE)+' status --porcelain');
 const b=await chromium.launch({executablePath:CHROME});
 const c=await b.newContext({viewport:{width:1600,height:1000}});
 const p=await c.newPage();
 const errs=[];
 p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
 await p.goto('file://'+FILE);
 await p.waitForTimeout(7000);

 const TABS=await p.evaluate(TABS_JS);
 const idx=await p.evaluate(w=>PEOPLE.findIndex(x=>x.nm===w),WHO);
 if(idx<0){console.error('no profile named '+WHO);process.exit(1);}

 const cap={file:path.basename(FILE), md5:md5, commit:commit, dirty:dirty,
   who:WHO, when:new Date().toISOString().slice(0,19).replace('T',' '),
   surfaces:[], shell:[], errors:errs};

 for(const who of ['blank','loaded']){
  if(who==='loaded')await p.evaluate(i=>loadP(i),idx);
  await p.waitForTimeout(500);
  cap.shell.push({who:who, blocks:await p.evaluate(SHELL_JS)});
  for(const [nm,k,id] of TABS){
   await p.evaluate(t=>setTab(t),k);
   await p.waitForTimeout(460);
   const blocks=await p.evaluate(BLOCKS_JS+'("'+id+'")');
   const tips=await p.evaluate(TIPS_JS);
   cap.surfaces.push({surface:nm, id:id, who:who, blocks:blocks, tips:tips});
   process.stderr.write(who+'/'+nm+': '+blocks.length+' blocks, '+tips.length+' tips\n');}}

 await b.close();
 fs.writeFileSync(OUT,JSON.stringify(cap,null,1));
 const nb=cap.surfaces.reduce((a,s)=>a+s.blocks.length,0);
 const nt=cap.surfaces.reduce((a,s)=>a+s.tips.length,0);
 console.log('captured '+nb+' blocks and '+nt+' tooltip readings off '
  +cap.file+' md5 '+md5+(dirty?', tree dirty':'')+' -> '+path.basename(OUT));
 if(errs.length)console.log('the page threw: '+errs.join(' | '));
})();
