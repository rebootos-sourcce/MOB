/* ============================================================
   RELEASE OR PROTOCOL, ON THE REAL BUILD. Round DY.

   He asked: "simulate the word release or protocol with the ICPs a thousand
   times, like see what gets them to feel one's more realistic, and then tell
   me why." A persona reacting to a word in a list is reacting to a list, so
   the words are put where a person meets them: source.html, read only, with
   a persona loaded, and every surface that carries the word driven by the
   product's own entry points.

   Two variants, and only the words move:

     release    release is the one word for the mechanic. The two places the
                shipped build says "protocol" for a release run are swapped
                to release, and nothing else changes.
     protocol   protocol is the one word. Every shipped release string on
                these surfaces is swapped to the best protocol sentence that
                keeps its meaning, rewritten where the grammar forces it
                (protocol has no verb, so "nothing to release" cannot become
                "nothing to protocol").

   In both, the Summary card that the shipped build titles "The protocol",
   which names a breathing practice and opens the ritual builder, reads "The
   practice", so neither variant is handicapped by a collision the other
   escapes. That collision is real in the shipped build and is reported as
   its own finding, not as a point against either word.

   The swap is a text substitution on the rendered page, applied by a
   MutationObserver so a re-render is swapped too. It writes nothing to
   atuned_src and nothing to source.html. The run itself is the product's own:
   the example refusal is lifted inside relCoolDown only, the way
   proto/field-overlay/release.js lifts it, and the speed is shortened so the
   run finishes inside the capture.

     NODE_PATH=/opt/node22/lib/node_modules node proto/release-protocol/shoot.js
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const ROOT=path.resolve(__dirname,'..','..');
const OUT=path.join(__dirname,'shots');
const PAGE='file://'+path.join(ROOT,'source.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const WHO=process.env.WHO||'James';
fs.mkdirSync(OUT,{recursive:true});
const wait=(p,ms)=>p.waitForTimeout(ms);

/* the substitutions, as [pattern source, flags, replacement]. Kept as strings
   so they cross into the page. Ordered, and each is written so that its own
   output never matches a later rule. */
const SWAP={
 release:[
  ['^Run the protocol here$','','Run a release here'],
  ['The protocol opens once this address is carrying\\.','g','A release opens once this address is carrying.']],
 protocol:[
  ['^Release this first$','','First protocol'],
  ['^Run a release$','','Run the protocol'],
  ['\\bRelease has about\\b','g','The protocol has about'],
  ['^Release and reframe$','','Protocol, opening'],
  ['^Released$','','Protocol complete'],
  ['\\bRelease empties the address\\b','g','The protocol empties the address'],
  ['so there is nothing to release\\.','g','so there is nothing for the protocol to run on.'],
  ['^Nothing released on a worked example\\.$','','No protocol runs on a worked example.'],
  ['^Release$','','Protocol'],
  ['^Release (\\d*)$','','Run protocol $1']]};

async function boot(p,variant){
 await p.goto('about:blank');
 await p.goto(PAGE);
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}
 await p.evaluate(()=>{try{localStorage.clear();}catch(e){}});
 await p.evaluate(({rules})=>{
  const R=rules.map(r=>[new RegExp(r[0],r[1]),r[2]]);
  function swapNode(t){
   let v=t.nodeValue, o=v, core=v.trim();
   /* the practice card, whichever variant: an eyebrow on the Summary output row */
   if(core==='The protocol'&&t.parentElement&&t.parentElement.closest('.s-out'))v=v.replace('The protocol','The practice');
   else for(const [re,to] of R){
    if(re.source.startsWith('^')){ if(re.test(core))v=v.replace(core,core.replace(re,to)); }
    else v=v.replace(re,to);}
   if(v!==o)t.nodeValue=v;}
  function sweep(root){
   const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let t;
   while((t=w.nextNode()))swapNode(t);}
  window.__sweep=()=>sweep(document.body);
  new MutationObserver(ms=>{for(const m of ms){
    if(m.type==='characterData')swapNode(m.target);
    else m.addedNodes.forEach(n=>n.nodeType===3?swapNode(n):sweep(n));}})
   .observe(document.body,{subtree:true,childList:true,characterData:true});
  sweep(document.body);},{rules:SWAP[variant]||[]});}

async function load(p,who){
 const lines=(STORYBANK[who]||[]).map(x=>x[1]);
 return p.evaluate(({who,lines})=>{
  const i=PEOPLE.findIndex(q=>q.nm===who); loadP(i);
  lines.forEach(function(t,k){applyStory(t);verpApply(t);
   if(typeof leanApply==='function')leanApply(t);
   CURP.story=CURP.story||{entries:[]};var ps=parseStory(t);
   CURP.story.entries.push({t:'2026-09-2'+k+'T08:00:00Z',text:t,imprints:ps.imprints.length,bands:ps.bands});});
  render();
  const held=W.filter(n=>n.sq>0&&n.cf).sort((a,b)=>b.sq-a.sq);
  const empty=W.filter(n=>n.cf&&n.sq<1)[0]||null;
  return {who,top:held.slice(0,3).map(n=>({i:n.i,k:n.k,b:n.b,sq:+n.sq.toFixed(1)})),empty:empty?{i:empty.i,k:empty.k}:null};},{who,lines});}

/* every visible text node under a host, joined, so the page can quote what
   each capture actually said rather than what the swap table meant it to */
const said=(p,sel)=>p.evaluate(s=>{const h=document.querySelector(s);return h?h.innerText.replace(/\s+\n/g,'\n').trim():null;},sel);

/* THE CARD BY IDENTITY, NOT THE VIEWPORT. At 390 the drill opens below the
   fold, and the first run wrote the Summary page to disk under the name of
   the address card. The card is found by its class and shot as itself. */
async function card(p,file){
 const c=await p.$('.rd-card');
 if(!c){await p.screenshot({quality:84,path:file});return;}
 await c.scrollIntoViewIfNeeded();await wait(p,300);await c.screenshot({quality:84,path:file});}

async function shots(b,variant,w,h){
 const p=await b.newPage({viewport:{width:w,height:h}});
 const errs=[];p.on('pageerror',e=>errs.push(String(e.message)));
 await boot(p,variant);
 const who=await load(p,WHO);
 const tag=`${WHO.toLowerCase()}-${variant}-${w}`;
 const facts={variant,width:w,who};

 /* 1. Summary, the output row */
 await p.evaluate(()=>{setTab(TAB.SUMMARY);render();});await wait(p,900);
 await p.evaluate(()=>window.__sweep());
 const row=await p.$('.s-outrow');
 if(row){await row.scrollIntoViewIfNeeded();await wait(p,300);await row.screenshot({quality:84,path:path.join(OUT,tag+'-1-summary.jpg')});}
 facts.summary=await said(p,'.s-outrow');

 /* 2. the address card on the heaviest address, with its button */
 await p.evaluate(i=>{runNodeDrill(BY[i]);},who.top[0].i);await wait(p,700);
 await p.evaluate(()=>window.__sweep());
 await card(p,path.join(OUT,tag+'-2-address.jpg'));
 facts.address=await said(p,'.rd-card');
 await p.evaluate(()=>{if(typeof rdClose==='function')rdClose();});await wait(p,300);

 /* 3. the refusal on an address holding nothing */
 if(who.empty){
  await p.evaluate(i=>{runNodeDrill(BY[i]);},who.empty.i);await wait(p,700);
  await p.evaluate(()=>window.__sweep());
  await card(p,path.join(OUT,tag+'-3-refusal.jpg'));
  facts.refusal=await said(p,'.rd-card');
  await p.evaluate(()=>{if(typeof rdClose==='function')rdClose();});await wait(p,300);}

 /* 4. the run card, before Begin, on the three heaviest */
 await p.evaluate(()=>{setTab(TAB.FIELD);render();});await wait(p,500);
 await p.evaluate(ids=>{relPick(ids);},who.top.map(n=>n.i));await wait(p,700);
 await p.evaluate(()=>window.__sweep());
 await p.screenshot({quality:84,path:path.join(OUT,tag+'-4-pick.jpg')});
 facts.pick=await said(p,'#rel');

 /* 5. the run, walked to its end by the product itself, and the card it leaves */
 await p.evaluate(()=>{var f=relCoolDown;window.__who0=S.who;
  relCoolDown=function(){S.who=0;try{return f.apply(this,arguments);}finally{S.who=window.__who0;}};
  RUN.speed=0.04;var g=document.getElementById('relgo');if(g)g.click();});
 await p.waitForFunction(()=>RUN.phase==='done',null,{timeout:20000});
 await wait(p,600);await p.evaluate(()=>window.__sweep());
 await p.screenshot({quality:84,path:path.join(OUT,tag+'-5-done.jpg')});
 facts.done=await said(p,'#rel');
 facts.errors=errs;
 await p.close();
 return facts;}

(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const all=[];
 for(const v of ['release','protocol'])for(const [w,h] of [[1600,1000],[390,844]]){
  const f=await shots(b,v,w,h); all.push(f);
  console.log(v,w,'errors',f.errors.length);}
 fs.writeFileSync(path.join(OUT,'facts-'+WHO.toLowerCase()+'.json'),JSON.stringify(all,null,1));
 await b.close();})();
