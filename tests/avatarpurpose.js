/* THE AVATAR'S PURPOSE VIEW WITHOUT RAILS, AND ARCHETYPES HIDDEN. 18 November.

   His words: "for the avatar purpose, let's remove the left and right rail.
   And let's hide the archetype tab under avatar. Archetype. I don't know
   what it's for. I don't know where it came from. I don't know what it
   does."

   What this holds, in a real Chromium, at 1600 by 1000 and at 390 by 844, on
   a blank profile and a loaded one:

     Purpose  neither rail is drawn, the centre takes the row, nothing runs
              off the side, and a rail folded on another page does not
              squeeze it into the fold's narrow track
     Becoming keeps both rails, and gets them back on the way out of Purpose
     the pill bar shows exactly AV_SUBS less what AV_ARCH_SHOWN hides, read
              off the code and never typed here
     no door  no pill, no Discover card and no Character mark leads into the
              hidden view, and the card no longer says it does
     stale    a view left set to 'arch', or to a word the page does not know,
              paints Becoming and throws nothing
     engine   with the view hidden and ratings on the record, the quiz's self
              report still moves affinity(), the ratings still cross the
              boundary, and the one line turns the wheel back on

   CHECKED AGAINST THE BUILD FROM BEFORE THIS CHANGE FIRST: run with
   ATUNED_FILE at the live build (c2bf52a2) it fails, by name, on the rails,
   the pills, the doors and the stale view. Each check was also run against a
   copy of the new build broken in exactly its own place.

   No count is typed into this file. Read the counts off the run.

   Run from the repo root:
     CHROME=... NODE_PATH=$(npm root -g) node tests/avatarpurpose.js */
const {chromium}=require('playwright');
const path=require('path');
const {FULL_SIGHT,LCOL_SEED}=require('./seed.js');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));

/* the layout of the page as it stands: each rail shown or not, and the
   centre's width against the row it sits in */
const LAYOUT=()=>{
 const vis=id=>{const e=document.getElementById(id); if(!e)return false;
  const r=e.getBoundingClientRect(); return getComputedStyle(e).display!=='none'&&r.width>0&&r.height>0;};
 const mid=document.querySelector('.mid'), st=document.getElementById('stage');
 return {l:vis('lcol'), r:vis('rcol'), mid:mid?Math.round(mid.getBoundingClientRect().width):0,
  stage:st?Math.round(st.getBoundingClientRect().width):0,
  over:document.documentElement.scrollWidth-innerWidth,
  sub:AV.sub, avp:!!document.querySelector('#avbody .avp'), wheel:!!document.querySelector('#avbody .av-arch')};};

(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 require('./net.js').guardBrowser(b);
 const errs=[];
 for(const [w,h] of [[1600,1000],[390,844]]){
  const ctx=await b.newContext({viewport:{width:w,height:h}});
  await ctx.addInitScript(FULL_SIGHT); await ctx.addInitScript(LCOL_SEED);
  const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(w+': '+String(e.message)));
  await p.goto(FILE); await booted(p); await wait(300);

  for(const who of ['blank','James']){
   const tag=w+' '+who;
   console.log('\n=== '+tag+': Purpose without rails, Becoming with them ===');
   const s=await p.evaluate(async({who,LAYOUT})=>{
    const L=new Function('return ('+LAYOUT+')()');
    const f=t=>new Promise(r=>setTimeout(r,t));
    loadP(who==='blank'?0:PEOPLE.findIndex(x=>x.nm===who));
    setTab(TAB.INTAKE); AV.sub='becoming'; AV.sig=''; renderAvatar(); await f(120);
    const o={becoming:L()};
    const pill=document.querySelector('#avbody [data-avsub="purpose"]'); if(pill)pill.click(); await f(160);
    o.purpose=L();
    /* a rail folded on another page: the fold rules weigh what a plain
       rule here would, so this is the case that squeezes the centre */
    document.body.classList.add('lshut','rshut'); await f(80);
    o.shut=L(); document.body.classList.remove('lshut','rshut');
    const back=document.querySelector('#avbody [data-avsub="becoming"]'); if(back)back.click(); await f(160);
    o.back=L();
    return o;},{who,LAYOUT:LAYOUT.toString()});
   ok(s.becoming.l&&s.becoming.r,tag+': Becoming keeps both rails, '+JSON.stringify(s.becoming));
   ok(s.purpose.avp,tag+': the Purpose pill opens Purpose');
   ok(!s.purpose.l&&!s.purpose.r,tag+': Purpose draws neither rail, '+JSON.stringify(s.purpose));
   ok(s.purpose.stage>=s.purpose.mid-2,tag+': the centre takes the whole row, stage '+s.purpose.stage+' of '+s.purpose.mid);
   ok(s.purpose.over<=0,tag+': nothing on Purpose runs off the side, '+s.purpose.over+' px over');
   ok(!s.shut.l&&!s.shut.r&&s.shut.stage>=s.shut.mid-2,tag+': with both rails folded elsewhere Purpose still takes the row, '+JSON.stringify(s.shut));
   ok(s.back.l&&s.back.r&&s.back.sub==='becoming',tag+': Becoming brings both rails back, '+JSON.stringify(s.back));}

  console.log('\n=== '+w+': the pill bar, the doors, a stale view ===');
  const d=await p.evaluate(async()=>{
   const f=t=>new Promise(r=>setTimeout(r,t));
   const o={};
   loadP(0); setTab(TAB.INTAKE); AV.sub='becoming'; AV.sig=''; renderAvatar(); await f(80);
   /* what remains is read off the code: the whole list less what the flag
      hides. A build with no flag hides nothing. */
   const shown=typeof AV_ARCH_SHOWN==='undefined'?true:AV_ARCH_SHOWN;
   o.flag=shown;
   o.want=AV_SUBS.filter(s=>s[0]!=='arch'||shown).map(s=>s[0]).join(',');
   o.pills=[...document.querySelectorAll('#avbody .avs-subs [data-avsub]')].map(e=>e.dataset.avsub).join(',');
   /* nothing anywhere in the document names the hidden view as a place to go */
   o.anyArchPill=document.querySelectorAll('[data-avsub="arch"]').length;
   o.archStillHidden=!shown;
   /* the pill's own function lands on Becoming. avSub refuses the key and
      renderAvatar's guard would paint Becoming anyway, so a mutant that
      breaks only the refusal is the same page and is not seen here; the
      guard is held on its own just below */
   avSub('arch'); await f(60); o.avSub=AV.sub; o.avSubWheel=!!document.querySelector('#avbody .av-arch');
   /* a view left at 'arch', and one the page does not know, paint Becoming */
   AV.sub='arch'; AV.sig=''; renderAvatar(); await f(60);
   o.stale=AV.sub; o.staleWheel=!!document.querySelector('#avbody .av-arch');
   o.stalePressed=(document.querySelector('#avbody .avs-sb[aria-pressed="true"]')||{}).dataset;
   o.stalePressed=o.stalePressed?o.stalePressed.avsub:null;
   AV.sub='nonsense'; AV.sig=''; renderAvatar(); await f(60); o.junk=AV.sub;
   /* the Discover card. Off Discover since 27 November (the Journal draws
      none of the seven cards), its code kept for his own placement, so it is
      checked gone from the page and then built the way stRender built it,
      in a box of this gate's own, where its link still answers */
   setTab(TAB.STORY); await f(60);
   o.cardGone=!document.querySelector('#story [data-stgo]');
   o.cardSays=STGO_LABEL.stavatar;
   const tb=document.getElementById('tcards')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'tcards'}));
   tb.innerHTML=stMiniShell('stavatar','Avatar',stMiniAvatar(compute()),'stavatar');
   const card=document.querySelector('#tcards [data-stgo="stavatar"]');
   o.cardAria=card?card.getAttribute('aria-label')+' | '+((card.querySelector('[data-tip]')||{}).dataset||{}).tip:'';
   STGO.stavatar(); await f(120);
   o.cardTab=S.tab===TAB.INTAKE; o.cardSub=AV.sub; o.cardWheel=!!document.querySelector('#avbody .av-arch');
   /* the Character page's twelve: marks, not doors, while the view is hidden */
   loadP(PEOPLE.findIndex(x=>x.nm==='James')); setTab(TAB.MASKS); render(); await f(160);
   const marks=[...document.querySelectorAll('#charrail [data-charch]')];
   o.marks=marks.length; o.markButtons=marks.filter(e=>e.tagName==='BUTTON').length;
   o.markTips=marks.every(e=>(e.getAttribute('data-tip')||'').length>20);
   if(marks[0]){marks[0].click(); await f(100);}
   o.markStays=S.tab===TAB.MASKS; o.markSub=AV.sub;
   return o;});
  ok(d.pills===d.want&&d.pills.length>0,w+': the pill bar is exactly what the code leaves shown, '+d.pills+' against '+d.want);
  ok(d.archStillHidden,w+': Archetypes is hidden, AV_ARCH_SHOWN reads '+d.flag);
  ok(d.anyArchPill===0,w+': nothing in the document offers the hidden view, '+d.anyArchPill+' found');
  ok(d.avSub==='becoming'&&!d.avSubWheel,w+': avSub(\'arch\') lands on Becoming, AV.sub '+d.avSub);
  ok(d.stale==='becoming'&&!d.staleWheel&&d.stalePressed==='becoming',w+': a view left at arch paints Becoming, pressed, '+JSON.stringify([d.stale,d.staleWheel,d.stalePressed]));
  ok(d.junk==='becoming',w+': a view the page does not know paints Becoming, got '+d.junk);
  ok(d.cardGone,w+': 27 November: no card of the seven is drawn on the Journal');
  ok(!!d.cardAria&&!/Archetypes/.test(d.cardSays)&&!/Archetypes/.test(d.cardAria),w+': the Discover card no longer says it opens Archetypes, '+d.cardSays+' | '+d.cardAria);
  ok(d.cardTab&&d.cardSub==='becoming'&&!d.cardWheel,w+': the Discover card opens Becoming, '+JSON.stringify([d.cardTab,d.cardSub,d.cardWheel]));
  ok(d.marks>0&&d.markButtons===0&&d.markTips,w+': Character\'s archetypes are marks with their meaning, not doors, '+d.markButtons+' of '+d.marks+' are buttons');
  ok(d.markStays&&d.markSub!=='arch',w+': a press on one goes nowhere hidden, tab kept, AV.sub '+d.markSub);
  await ctx.close();}

 console.log('\n=== the engine, with the view hidden and ratings on the record ===');
 {
  const ctx=await b.newContext({viewport:{width:1600,height:1000}});
  await ctx.addInitScript(FULL_SIGHT); await ctx.addInitScript(LCOL_SEED);
  const p=await ctx.newPage(); p.on('pageerror',e=>errs.push('engine: '+String(e.message)));
  await p.goto(FILE); await booted(p); await wait(300);
  const e=await p.evaluate(async()=>{
   const f=t=>new Promise(r=>setTimeout(r,t));
   const o={hidden:typeof AV_ARCH_SHOWN!=='undefined'&&AV_ARCH_SHOWN===false};
   loadP(0);
   CURP.avatar=CURP.avatar||{}; CURP.avatar.arch={Warrior:5,Sage:1};
   const blank=compute().aff.slice();
   /* the quiz's twelve, each 0 to 1 as archSelfValid takes them: Innocent
      strongest, Rebel next, the rest low */
   const vals=ARCH.map(a=>a.nm==='Innocent'?1:a.nm==='Rebel'?0.8:0.2);
   const p2=JSON.parse(JSON.stringify(CURP)); p2.archSeed=null; p2.soul.arcs=[0,1];
   o.applied=!!archSeedApply(p2,vals);
   loadProfile(p2); const aff=compute().aff.slice();
   const iI=ARCH.findIndex(a=>a.nm==='Innocent');
   o.moved=aff.some((v,i)=>Math.abs(v-blank[i])>1e-6);
   o.innocentFirst=aff.indexOf(Math.max(...aff))===iI;
   /* the ratings cross the boundary untouched */
   p2.avatar=p2.avatar||{}; p2.avatar.arch={Warrior:5,Sage:1};
   const v=validateProfile(JSON.parse(JSON.stringify(p2)));
   o.trip=v.ok&&v.profile.avatar.arch.Warrior===5&&v.profile.avatar.arch.Sage===1;
   /* and the one line puts the wheel back */
   loadP(0); setTab(TAB.INTAKE);
   const was=AV_ARCH_SHOWN; AV_ARCH_SHOWN=true; AV.sig='';
   avSub('arch'); await f(80);
   o.back=!!document.querySelector('#avbody .av-arch')&&!!document.querySelector('#avbody [data-avsub="arch"]');
   AV_ARCH_SHOWN=was; AV.sig=''; renderAvatar(); await f(60);
   o.again=AV.sub==='becoming'&&!document.querySelector('#avbody .av-arch');
   return o;}).catch(x=>({err:String(x.message||x)}));
  ok(!e.err,'the engine block ran, '+(e.err||''));
  ok(e.hidden,'the view is hidden for this block');
  ok(e.applied&&e.moved&&e.innocentFirst,'the quiz\'s self report still moves affinity with the view hidden, '+JSON.stringify(e));
  ok(e.trip,'saved ratings still cross the boundary');
  ok(e.back,'setting AV_ARCH_SHOWN true brings the pill and the wheel back');
  ok(e.again,'and false hides them again');
  await ctx.close();}

 ok(errs.length===0,'no page errors, '+errs.join(' | '));
 await b.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);
})();
