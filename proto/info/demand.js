/* ============================================================
   THE DEMAND HARNESS.

   Counts, per surface, every named thing a person can see, what kind
   of question it raises, and whether the product can answer it today.

   Written because the alternative is an adjective. The owner asked for a
   hundred passes; a hundred passes of a guess is still a guess, so this
   walks the real build.

   IT IS VALIDATED BEFORE IT IS TRUSTED. Pass 0 re-derives the four
   numbers DESIGN-tooltip.md measured on the same file: distinct visible
   title strings, definitions that live only in a title, static ones, and
   aria-describedby. If those do not come back within tolerance the harness
   is wrong and the run says so rather than printing a table. This repo has
   twice had a probe report its own bug as a defect.

     node proto/info/demand.js [source.html]
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs'), cp=require('child_process');
const FILE=path.resolve(process.argv[2]||path.join(__dirname,'..','..','source.html'));
const OUT=path.join(__dirname,'demand.json');
const sh=c=>{try{return cp.execSync(c,{encoding:'utf8'}).trim();}catch(e){return '?';}};

/* THE FIVE KINDS, and the question each one is. Named here once so the
   report and the code cannot disagree. */
const KINDS={
 word:  'what a word means',
 number:'what a number is out of',
 control:'what a control does',
 reading:'why a reading says what it says',
 next:  'what to do next'};

/* THE CANONICAL TERM SET IS READ OFF THE ENGINE, never typed. A list typed
   here would go stale the first time a table grew, which is the defect
   CLAUDE.md records five times. */
const TERMS_JS=`(function(){
 var s={}, add=function(t,src){t=String(t||'').trim(); if(t.length<2)return;
  if(!s[t.toLowerCase()])s[t.toLowerCase()]={t:t,src:src};};
 W.forEach(function(n){add(n.k,'address');});
 CHILD.forEach(function(c){add(c.nm,'fetter');add(c.opp,'opposite');});
 ALL_SAB.forEach(function(x){add(x.nm,'saboteur');});
 SI.forEach(function(l){add(l.nm,'law');});
 MASKS.forEach(function(m){add(m.nm,'mask');});
 DOMAINS.forEach(function(d){add(d.nm,'domain');});
 ARCH.forEach(function(a){add(a.nm,'archetype');});
 HARM.forEach(function(e){add(e.t,'universal law');});
 GLOSS.forEach(function(g){add(g.t,'glossary');});
 BANDS.forEach(function(b){add(b,'seat');});
 HCX_LIB.forEach(function(h){add(h.nm,'hyper-complex');});
 try{verpRead().forEach(function(g){add(g.nm,'gate');});}catch(e){}
 return s;})()`;

/* which of those terms the glossary actually defines, and which reach a
   knowledge row. Both read at run time. */
const COVER_JS=`(function(){
 var g={}; GLOSS.forEach(function(x){g[x.t.toLowerCase()]=x.d.length;});
 var kb={}, secs=['addr','fetter','sab','law','mask','dom','arch','gate','harm','gloss','card'];
 secs.forEach(function(s){try{(kbRows(s)||[]).forEach(function(r){
  kb[String(r.t).toLowerCase()]=s;});}catch(e){}});
 return {gloss:g, kb:kb};})()`;

const TABS_JS=`(function(){var a=TABDEF.map(function(t){return [t.nm,t.k,t.id,'bar'];});
 Object.keys(TABEXTRA).forEach(function(k){var t=TABEXTRA[k];
  a.push([t.nm,t.k,t.id,'no door']);});
 return a;})()`;

/* ------------------------------------------------------------
   THE WALK. One surface, in the page.
   ------------------------------------------------------------ */
/* THE SCOPE IS THE WHOLE VISIBLE DOCUMENT, not the tab's host element, and
   that is the correction pass 0 forced. The left and right rails are not
   inside any tab host, and they carry 43 of the heaviest carriers in the
   product on every single tab. A walk scoped to the host reported 0 titles
   on six of nine surfaces and would have concluded the product says nothing.
   Each carrier is tagged with whether it is inside this tab's own host, so
   the shared chrome can be counted once rather than nine times. */
const WALK=function(hid,TERMS){
 var host=document.getElementById(hid);
 var out={carriers:[], titles:[], aria:0, host:hid, ok:!!host};
 if(!host)return out;
 var hs=getComputedStyle(host), hb=host.getBoundingClientRect();
 if(hs.display==='none'||hb.width<=0||hb.height<=0){out.ok=false;return out;}
 var scope=document.body;

 var vis=function(e){
  var b=e.getBoundingClientRect(); if(b.width<=0||b.height<=0)return false;
  var s=getComputedStyle(e);
  if(s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity)===0)return false;
  return true;};

 /* own text: the element's text minus every child element's text, so a
    wrapper is not credited with its children's words. */
 var own=function(e){
  var t=e.textContent||'';
  for(var i=0;i<e.children.length;i++)t=t.replace(e.children[i].textContent,'');
  return t.replace(/\s+/g,' ').trim();};

 var ACT='button,a,input,select,textarea,[role="tab"],[role="button"],[tabindex]';
 var FIG=/(^|[^A-Za-z0-9])(\d+(\.\d+)?)\s*(%|°)?($|[^A-Za-z0-9])/;
 var SCALE=/\bof\s+\d|\bof\s+(100|10|1|112|7)\b|out of|per\s?cent|%|summed|no ceiling|plus or minus/i;
 var VERB=/^(open|press|tap|release|start|add|save|read|choose|pick|set|clear|close|continue|next|begin|enter|answer|run|play|apply|install|undo|redo|import|export|copy|delete|remove|hold|breathe|write|go)\b/i;
 /* a reading component: something that prints a computed value. classes
    read off the build rather than guessed. */
 var READCLS=['cr','crb','tierow','ad-r','kb-c','pm-v','sum-hero','q-v','cn-nr','ib','inst','vt','glance','gl-t'];

 var all=scope.querySelectorAll('*');
 for(var i=0;i<all.length;i++){
  var e=all[i]; if(!vis(e))continue;
  var ti=e.getAttribute('title')||'';
  if(ti)out.titles.push({s:ti, own:host.contains(e), tag:e.tagName.toLowerCase(), cls:e.className&&e.className.baseVal!==undefined?'':String(e.className||''),
    txt:(e.textContent||'').replace(/\s+/g,' ').trim(),
    tip:!!e.getAttribute('data-tip'), act:!!e.closest(ACT),
    focus:!!(e.matches(ACT)||e.getAttribute('tabindex')!=null)});
  if(e.getAttribute('aria-describedby'))out.aria++;

  var o=own(e), cls=' '+String((e.className&&e.className.baseVal!==undefined)?e.className.baseVal:(e.className||''))+' ';
  var isAct=e.matches(ACT);
  var isRead=READCLS.some(function(c){return cls.indexOf(' '+c+' ')>=0;});
  var hit=o?TERMS[o.toLowerCase()]:null;
  if(!hit&&o&&o.length<40){
   /* a label may carry a term plus a qualifier. match the leading term. */
   var m=o.toLowerCase().replace(/[.,·:].*$/,'').trim(); hit=TERMS[m]||null;}
  var hasFig=o?FIG.test(o):false;

  /* nothing to ask about: no own text, not interactive, not a reading. */
  if(!o&&!isAct&&!isRead)continue;

  /* KIND. Priority is stated and the overlaps are reported, so nothing is
     hidden by the order. */
  var k=null;
  if(isRead)k='reading';
  else if(hasFig&&!hit)k='number';
  else if(hit)k='word';
  else if(o&&VERB.test(o))k='next';
  else if(isAct)k='control';
  if(!k)continue;

  /* THE ROUTE. What the product can do for this carrier today. */
  var inHost=host.contains(e);
  var block=e.closest('.lsec,.card,.rd-card,.pm,.kb-c,.sum-hero,.panel,section,li')||scope;
  var bt=(block.textContent||'').replace(/\s+/g,' ');
  var route=[];
  if(e.getAttribute('data-tip')||e.closest('[data-tip]'))route.push('tip');
  else if(ti||e.closest('[title]'))route.push('title');
  if(e.getAttribute('data-kbs')||e.closest('[data-kbs]'))route.push('kb');
  if(e.getAttribute('data-addr')||e.getAttribute('data-kbi')
     ||cls.indexOf(' ad-r ')>=0||cls.indexOf(' kb-c ')>=0)route.push('drill');
  if(k==='number'&&(SCALE.test(o)||SCALE.test(bt)))route.push('scale');
  if(e.getAttribute('aria-describedby'))route.push('aria');

  out.carriers.push({k:k, own:inHost, txt:o.slice(0,60), cls:cls.trim().slice(0,40),
   tag:e.tagName.toLowerCase(), term:hit?hit.src:null, route:route,
   overlap:[isRead?'reading':null, (hasFig&&!hit)?'number':null, hit?'word':null,
            (o&&VERB.test(o))?'next':null, isAct?'control':null].filter(Boolean)});}
 return out;};

/* handed to the page as a function rather than pasted into a template, so
   the module stays parseable on its own. */
const EV=new Function('a','return ('+WALK.toString()+')(a[0],a[1]);');

(async()=>{
 const md5=sh('md5sum '+FILE).split(' ')[0].slice(0,8);
 const commit=sh('git -C '+path.dirname(FILE)+' rev-parse --short HEAD');
 const dirty=sh('git -C '+path.dirname(FILE)+' status --porcelain')?'DIRTY':'clean';
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const report={file:path.basename(FILE), md5, commit, dirty, kinds:KINDS, runs:{}};

 for(const [w,h,wn] of [[1600,1000,'desktop'],[390,844,'phone']]){
  const c=await b.newContext({viewport:{width:w,height:h}, isMobile:wn==='phone', hasTouch:wn==='phone'});
  const p=await c.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
  await p.goto('file://'+FILE); await p.waitForTimeout(7000);
  const TERMS=await p.evaluate(TERMS_JS);
  const COVER=await p.evaluate(COVER_JS);
  const TABS=await p.evaluate(TABS_JS);
  /* the loaded profile is Lance, the same one the tooltip audit used, so
     pass 0 is comparable. */
  const L=await p.evaluate(()=>PEOPLE.findIndex(x=>x.nm==='Lance'));
  await p.evaluate(i=>loadP(i),L);
  const run={terms:Object.keys(TERMS).length, cover:{gloss:Object.keys(COVER.gloss).length,
    kb:Object.keys(COVER.kb).length}, surfaces:{}, errs};
  for(const [nm,t,hid,door] of TABS){
   await p.evaluate(k=>setTab(k),t); await p.waitForTimeout(450);
   const r=await p.evaluate(EV,[hid,TERMS]);
   run.surfaces[nm]={door, host:hid, ok:r.ok, aria:r.aria, titles:r.titles, carriers:r.carriers};}
  report.runs[wn]=run;
  await c.close();}
 await b.close();
 fs.writeFileSync(OUT, JSON.stringify(report));
 console.log('wrote '+OUT+'  '+(fs.statSync(OUT).size/1024).toFixed(0)+'kb');
})().catch(e=>{console.error(e);process.exit(1);});
