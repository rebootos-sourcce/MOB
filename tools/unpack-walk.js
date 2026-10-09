/* ============================================================
   THE UNPACK WALK. Round PO, "unpack every symbol".

   His words: "you have to unpack blueprint. They don't know what that means.
   Earth, they don't know what that means. Architect, they don't know what
   that means... this is going to be a general rule for all information
   across the board."

   This tool finds the symbols. It loads a built file on a blank profile and
   on a loaded worked example, opens every tab and every drill it can name,
   at 1600 and at 390, and records every visible string and every tooltip
   (title, aria-label, data-tip). Then it reports each seeded term that
   stands on a surface with no meaning beside it, and a second list of short
   labels the walk found that nobody seeded.

   "Beside it" is one definition, the same one tests/unpack.js holds: the
   term is inside a carrier whose sentence is the table's sentence for it
   (class un, data-tip), or the table's sentence is printed in the same block.
   The table is engine/data/gloss.js, read here by running the file in a
   sandbox, so there is one list and the tool cannot drift from it.

   Usage, from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node tools/unpack-walk.js [FILE] [--out FILE.json]
   Exit code is 0. This is a finder, and the gate is tests/unpack.js.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs'), vm=require('vm');

const args=process.argv.slice(2);
const VALS=['--out','--find','--load-views','--save-views'].map(f=>args.indexOf(f)>=0?args[args.indexOf(f)+1]:null);
const FILE=path.resolve(args.find(a=>!a.startsWith('--')&&VALS.indexOf(a)<0)||'source.html');
const OUT=args.indexOf('--out')>=0?args[args.indexOf('--out')+1]:null;
/* --find REGEX lists every surface view where a visible string or tooltip matches. */
const LOADV=args.indexOf('--load-views')>=0?args[args.indexOf('--load-views')+1]:null;
const SAVEV=args.indexOf('--save-views')>=0?args[args.indexOf('--save-views')+1]:null;
const FIND=args.indexOf('--find')>=0?new RegExp(args[args.indexOf('--find')+1],'i'):null;

/* THE SEEDS. A term, and the pattern that finds it as a whole word. Some are
   only a symbol when they stand alone (a sign name, a number after "life
   path"), so each carries its own pattern. */
const SIGNS=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SEEDS=[
 ['blueprint','\\bblueprint\\b'],
 ['earth','\\bearth\\b'],['water','\\bwater\\b'],['fire','\\bfire\\b'],['air','\\bair\\b'],
 ['architect','\\barchitect\\b'],['engine','\\bengine\\b'],['witness','\\bwitness\\b'],['weaver','\\bweaver\\b'],
 ['root','\\broot\\b'],
 ['life path','\\blife path\\b'],
 ['sun sign','\\bsun\\b'],['moon sign','\\bmoon\\b'],['rising sign','\\brising\\b'],
 ['fixed','\\bfixed\\b'],['cardinal','\\bcardinal\\b'],['mutable','\\bmutable\\b'],
 ['expression','\\bexpression\\b'],['soul urge','\\bsoul urge\\b'],
 ['design','\\bhuman design\\b'],['gene key','\\bgene key\\b'],['profile','\\bprofile \\d/\\d\\b'],
 ['overlap','\\boverlaps?\\b'],
 ['western','\\bwestern\\b'],['eastern','\\beastern\\b'],
 ['seat:sacral','\\bsacral\\b'],['seat:solar','\\bsolar\\b'],['seat:heart','\\bheart\\b'],['seat:throat','\\bthroat\\b'],
 ['seat:3rd eye','\\bbrow\\b|\\b3rd eye\\b'],['seat:crown','\\bcrown\\b'],['seat:root','\\broot\\b'],
 ['assemblage point','\\bassemblage points?\\b'],
 ['fetter','\\bfetters?\\b'],['saboteur','\\bsaboteurs?\\b'],
 ['complex','\\bcomplex(es)?\\b'],['hyper complex','\\bhyper[- ]?complex(es)?\\b'],
 ['character','\\bcharacter\\b'],['mask','\\bmasks?\\b'],
 ['cq','\\bCQ\\b'],
 ['charge','\\bcharge\\b'],['law','\\blaws?\\b'],
 ['pole','\\bpoles?\\b'],['address','\\baddress(es)?\\b'],['seat','\\bseats?\\b'],
 ['archetype','\\barchetypes?\\b'],['axis','\\baxis\\b|\\baxes\\b'],
 ['coherence','\\bcoherence\\b'],
 ['inversion','\\binversion\\b'],['teacher','\\bteachers?\\b'],
 ['axis:light','^light$'],['axis:revelation','^revelation$'],['axis:trust','^trust$'],['axis:perception','^perception$'],
 ['axis:order','^order$'],['axis:power','^power$'],['axis:charge','^charge$'],['axis:desire and will','^desire and will$']
].concat(SIGNS.map(s=>['sign:'+s.toLowerCase(),'\\b'+s+'\\b']));

/* the table, read from the built engine, which carries the same file the page
   does. One table, so the tool cannot drift from it. A missing engine.js is a
   finding and the table is then empty. */
function loadTable(){
 try{return require(path.resolve(__dirname,'..','engine.js')).unpackAll();}catch(e){return {};}}

/* the page side: every visible string with the block it sits in, and the
   tooltips on that block. It runs inside the page. The seeds are matched in
   the page so the block and its tips are only read for a string that is a
   symbol, which keeps a walk of forty thousand strings fast. */
function snap(seedSrc){
 var rx=new RegExp(seedSrc.join('|'),'i');
 function vis(e){
  var s=getComputedStyle(e); if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0)return false;
  var r=e.getBoundingClientRect(); return r.width>0&&r.height>0;}
 var out=[], tips=[];
 var all=document.body.querySelectorAll('*');
 for(var i=0;i<all.length;i++){
  var e=all[i], tg=e.tagName.toLowerCase();
  if(tg==='script'||tg==='style'||tg==='noscript')continue;
  if(!vis(e))continue;
  var own='';
  for(var n=e.firstChild;n;n=n.nextSibling)if(n.nodeType===3)own+=n.nodeValue;
  own=own.replace(/\s+/g,' ').trim();
  var t=e.getAttribute('data-tip')||e.getAttribute('title')||'', a=e.getAttribute('aria-label')||'';
  if(t)tips.push({s:t,k:e.getAttribute('data-tip-k')||''});
  if(a)tips.push({s:a,k:'aria'});
  if(own.length>1){
   var o={s:own,tag:tg};
   if(rx.test(own)){
    var blk=e.closest('p,li,dd,dt,button,.sg-m,.sp-row,.tcx-col,.ad-r,div')||e;
    o.blk=blk.innerText.replace(/\s+/g,' ').trim().slice(0,900);
    var bt=[], q=blk.querySelectorAll('[data-tip],[title]');
    for(var j=0;j<q.length;j++)bt.push(q[j].getAttribute('data-tip')||q[j].getAttribute('title'));
    var up=e.closest('[data-tip],[title]'); if(up)bt.push(up.getAttribute('data-tip')||up.getAttribute('title'));
    var bp=blk.closest('[data-tip],[title]'); if(bp)bt.push(bp.getAttribute('data-tip')||bp.getAttribute('title'));
    o.bt=bt.join(' | ').slice(0,1800);}
   out.push(o);}}
 return {out:out,tips:tips};}

const WIDTHS=[[1600,1000,'1600'],[390,844,'390']];
const PROFILES=['blank','Derek','Sofia'];

(async()=>{
 const T=loadTable(), tkeys=Object.keys(T);
 const b=LOADV?{close:async()=>{}}:await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const missed=[];
 let surfaces=[];            /* {w, who, surface, out, tips} */
 if(LOADV)surfaces=JSON.parse(fs.readFileSync(LOADV,'utf8'));
 for(const [w,h,wn] of (LOADV?[]:WIDTHS)){
  const c=await b.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
  const p=await c.newPage();
  await p.addInitScript(require('../tests/seed.js').FULL_SIGHT);
  p.on('pageerror',e=>console.error('page error:',e.message.slice(0,120)));
  await p.goto('file://'+FILE+'?dev=1'); await p.waitForTimeout(6500);
  const TABS=await p.evaluate(`(function(){var a=TABDEF.map(function(t){return [t.nm,t.k];});
   Object.keys(TABEXTRA).forEach(function(k){a.push([TABEXTRA[k].nm,TABEXTRA[k].k]);});return a;})()`);
  for(const who of PROFILES){
   if(who!=='blank')await p.evaluate(n=>loadP(PEOPLE.findIndex(x=>x.nm===n)),who);
   else await p.evaluate(()=>loadP(0));
   const take=async(name)=>{const s=await p.evaluate(snap,SEEDS.map(x=>x[1])); surfaces.push({w:wn,who,surface:name,out:s.out,tips:s.tips});};
   for(const [nm,k] of TABS){
    await p.evaluate(k=>setTab(k),k); await p.waitForTimeout(450);
    await take('tab:'+nm);
   }
   /* the drills, by name. Each writes into the one drill sheet. */
   const DR=[
    ['teacher IL up','runTeacherDrill(MIRROR[0],"up")'],['teacher IL dn','runTeacherDrill(MIRROR[0],"dn")'],
    ['teacher DE up','runTeacherDrill(MIRROR[1],"up")'],['teacher OR up','runTeacherDrill(MIRROR[2],"up")'],
    ['teacher PO up','runTeacherDrill(MIRROR[3],"up")'],['teacher PE up','runTeacherDrill(MIRROR[4],"up")'],
    ['teacher TR up','runTeacherDrill(MIRROR[5],"up")'],['teacher CH up','runTeacherDrill(MIRROR[6],"up")'],
    ['teacher RE up','runTeacherDrill(MIRROR[7],"up")'],
    ['mirror IL','runMirrorDrill("IL")'],['mirror RE','runMirrorDrill("RE")'],
    ['pole up','runPoleDrill("up")'],['pole dn','runPoleDrill("dn")'],['compass','runCompassDrill()'],
    ['path 0','runPathDrill(PATHS[0])'],['path 1','runPathDrill(PATHS[1])'],
    ['sign sun','runSpDrill("sign",(spiritual(PEOPLE[S.who].nm)||{}).sun||"Capricorn")'],
    ['sign moon','runSpDrill("sign",(spiritual(PEOPLE[S.who].nm)||{}).moon||"Virgo")'],
    ['sign rising','runSpDrill("sign",(spiritual(PEOPLE[S.who].nm)||{}).rising||"Capricorn")'],
    ['life path','runSpDrill("lp",String((spiritual(PEOPLE[S.who].nm)||{}).lp||9))'],
    ['year animal','runSpDrill("chinese","Tiger")'],['element','runSpDrill("celem","Fire")'],
    ['design type','runSpDrill("hd","1/4")'],['gene key','runSpDrill("gk","60")'],
    ['number expression','runNumDrill("expression")'],
    ['law 1','runLawDrill(0)'],['seat','runSeatDrill("Root")']];
   for(const [nm,js] of DR){
    /* the drill sheet shows only on some tabs, so each drill is tried on the
       Compass, then the Field, then the Summary, and read where it is up */
    let got=false;
    for(const t of ['COMPASS','FIELD','SUMMARY']){
     try{
      await p.evaluate(t=>{setTab(TAB[t]);},t); await p.waitForTimeout(260);
      await p.evaluate(js); await p.waitForTimeout(260);
      const up=await p.evaluate(()=>{var e=document.getElementById('rdrill');if(!e)return 0;var r=e.getBoundingClientRect();return (r.width>0&&r.height>0&&e.innerText.trim().length>20)?1:0;});
      if(up){await take('drill:'+nm); got=true;}
     }catch(e){/* a drill with other arguments is not reached */}
     try{await p.evaluate(()=>{rdClose();});}catch(e){}
     if(got)break;}
    if(!got)missed.push(nm);
   }
  }
  await c.close();}
 await b.close();
 if(SAVEV)fs.writeFileSync(SAVEV,JSON.stringify(surfaces));

 if(FIND){const hit={};
  surfaces.forEach(sf=>{sf.out.concat(sf.tips).forEach(o=>{if(FIND.test(o.s)){const k=sf.surface+' ['+sf.w+'/'+sf.who+']'; (hit[k]=hit[k]||[]).push((o.tag?'text':'tip')+': '+o.s.slice(0,140));}});});
  Object.keys(hit).forEach(k=>console.log(k+'\n   '+Array.from(new Set(hit[k])).slice(0,3).join('\n   ')));}
 /* ---- the report ---- */
 const seen={};                /* term -> {surfaces:Set, bare:Set, ctx:[]} */
 const sayset=new Set(Object.keys(T).map(k=>T[k]));
 const sentenceList=Array.from(sayset).sort((a,b)=>b.length-a.length);
 for(const sf of surfaces){
  for(const o of sf.out){
   if(!o.blk||sayset.has(o.s))continue;          /* the explanation itself is not a use */
   /* and a run of explanations in one element, such as a drill's three sentences,
      is the explanation too: every table sentence is cut out before the seeds
      are looked for, longest first so a sentence holding a shorter one goes whole */
   let txt=o.s; sentenceList.forEach(x=>{if(txt.indexOf(x)>=0)txt=txt.split(x).join(' ');});
   if(txt.trim().length<2)continue;
   for(const [term,rx] of SEEDS){
    const re=new RegExp(rx,'i'); if(!re.test(txt))continue;
    const key=term, say=T[key]||'';
    /* glossed: the table's sentence is printed in the same block, or the block
       or the element carries it as its tooltip */
    const glossed=!!say&&(o.blk.indexOf(say)>=0||(o.bt||'').indexOf(say)>=0);
    const e=seen[term]=seen[term]||{surfaces:new Set(),bare:new Set(),ctx:[],hasEntry:!!say};
    e.surfaces.add(sf.surface);
    if(!glossed){e.bare.add(sf.surface); if(e.ctx.length<4&&e.ctx.indexOf(o.s)<0)e.ctx.push(o.s.slice(0,90));}
   }}}
 const rows=Object.keys(seen).map(k=>({term:k,entry:seen[k].hasEntry,surfaces:seen[k].surfaces.size,bare:seen[k].bare.size,ctx:seen[k].ctx}))
  .sort((a,b)=>b.bare-a.bare);

 /* what the walk found that nobody seeded: short strings, one to three
    words, that stand as a label or a value on three or more surfaces and are
    not a word the language already carries. Reported for a person to triage.
    It is a net, and it is wide on purpose. */
 const PLAIN=new Set('the a an and or of to in on at is are no yes new add all none open close back next save done edit delete remove cancel go set off on more less show hide name date time place today week day days min mins ok you your me my it its this that with from for not'.split(' '));
 const freq={};
 for(const sf of surfaces){const here=new Set();
  for(const o of sf.out){const s=o.s; const n=s.split(/\s+/).length;
   if(n>3||s.length<3||s.length>28||/\d{3,}/.test(s)||/[.,:;!?]$/.test(s))continue;
   if(!/^[A-Z0-9][A-Za-z0-9 '\\/&-]*$/.test(s))continue;
   const lw=s.toLowerCase(); if(PLAIN.has(lw))continue; here.add(s);}
  here.forEach(s=>{freq[s]=(freq[s]||0)+1;});}
 const net=Object.keys(freq).filter(s=>freq[s]>=3).sort((a,b)=>freq[b]-freq[a]);

 const n=surfaces.length, strings=surfaces.reduce((a,s)=>a+s.out.length,0), tipsN=surfaces.reduce((a,s)=>a+s.tips.length,0);
 const uniqSurf=new Set(surfaces.map(s=>s.surface)).size;
 console.log('walked '+n+' surface views ('+uniqSurf+' distinct surfaces, '+WIDTHS.length+' widths, '+PROFILES.length+' profiles); '
  +strings+' visible strings, '+tipsN+' tooltips; table entries read: '+tkeys.length);
 const bare=rows.filter(r=>r.bare>0);
 console.log('seeded terms on screen: '+rows.length+'; with at least one bare occurrence: '+bare.length);
 bare.forEach(r=>console.log(('  '+r.term).padEnd(20)+(r.entry?'[has entry] ':'[no entry]  ')+'bare on '+r.bare+' of '+r.surfaces+' views   e.g. '+JSON.stringify(r.ctx[0]||'')));
 console.log('\nshort labels the walk found on 3 or more views, not seeded ('+net.length+'):');
 console.log('  '+net.slice(0,200).join(' | '));
 if(missed.length)console.log('\ndrills not reached: '+Array.from(new Set(missed)).join(', '));
 if(OUT)fs.writeFileSync(OUT,JSON.stringify({file:FILE,views:n,distinct:uniqSurf,strings,tooltips:tipsN,seeded:rows,net},null,1));
})();
