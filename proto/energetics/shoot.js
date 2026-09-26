/* ============================================================
   THE WALK AND THE COUNT. Drives proto/energetics/energetics.html with real
   keystrokes and real presses, for each of the four layouts, for each of the
   six reference ICPs, at 1600 by 1000 and 390 by 844, and writes what it
   measured to shots/facts.json. The panel page reads every number from there.

   What is measured, per layout and width:
     choices     every visible, enabled control on the first screen of a
                 stranger, and on the whole surface, prototype chrome excluded
     words       the words a stranger reads before the first input
     the walk    each ICP types their own full name, birth date, time, place
                 and zone, states a type, answers the archetype question and
                 the nine questions. After every step: did anything read, and
                 did any of it land inside the screen the person is looking
                 at. That is the whole of "the rail activates live", measured.
     actions     keystroke fields plus presses to get everything in
     reach       ten readings pressed on the finished profile: did the card
                 open, and did it open where the person can see it
     floors      controls under 44 pixels, sideways scroll at 390, page
                 errors, requests leaving the file

     node proto/energetics/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/energetics/shoot.js
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'shots'); fs.mkdirSync(OUT,{recursive:true});
const PAGE='file://'+path.join(__dirname,'energetics.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ICPS=(process.env.ICPS||"sofia,diane,marcus,angela,derek,james").split(",");
const SHOTS_FOR=['james','angela','derek'];
const VS=(process.env.VS||"a,b,c,d").split(",");
const wait=(p,ms)=>p.waitForTimeout(ms);
/* the body is the scroller at 390, the document at 1600 */
const SCROLLER=`(function(){var b=document.body;if(b.scrollHeight>b.clientHeight+2&&/(auto|scroll)/.test(getComputedStyle(b).overflowY))return b;return document.scrollingElement;})()`;

async function open(p,hash){
 await p.goto('about:blank'); await p.goto(PAGE+'#'+hash+'-clean');
 await p.waitForFunction(()=>document.documentElement.getAttribute('data-en-ready')==='1',null,{timeout:25000});
 await p.evaluate(()=>{try{localStorage.clear();}catch(e){}});
 await wait(p,450);}
async function shot(p,name,w){await wait(p,250);
 await p.screenshot({path:path.join(OUT,name+'-'+w+'.jpg'),type:'jpeg',quality:80});}

/* every visible enabled control, where it is, and whether it is on screen */
const CONTROLS=`(function(scope){
 var sel='button,input,select,textarea,a[href],[role=button],[tabindex]:not([tabindex="-1"])';
 var all=[].slice.call(document.querySelectorAll(sel)).filter(function(e){
  if(e.closest('[data-proto]'))return false; if(e.disabled)return false;
  if(e.type==='hidden')return false;
  var r=e.getBoundingClientRect(); if(r.width<2||r.height<2)return false;
  var cs=getComputedStyle(e); if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)return false;
  for(var n=e;n;n=n.parentElement){var c=getComputedStyle(n);if(c.display==='none')return false;}
  return true;});
 var surf=function(e){return !!e.closest('#iq,#enrail,#enai,#en-slot-drill');};
 var inV=function(e){var r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;};
 var small=all.filter(surf).filter(function(e){var r=e.getBoundingClientRect();
  var box=e.type==='checkbox'?e.closest('label'):e; var q=box?box.getBoundingClientRect():r;
  return q.height<43.5||q.width<43.5;}).map(function(e){var r=e.getBoundingClientRect();
  return (e.id||e.getAttribute('data-en')||e.getAttribute('data-f')||e.className||e.tagName)+' '+Math.round(r.width)+'x'+Math.round(r.height);});
 return {screen:all.filter(inV).length, screenSurface:all.filter(surf).filter(inV).length,
  surface:all.filter(surf).length, small:small};})()`;
const WORDS_BEFORE_INPUT=`(function(){
 var root=document.querySelector('#iq .en-root'); if(!root)return null;
 var first=[].slice.call(document.querySelectorAll('#iq input,#enrail input,#iq select,#enrail select')).filter(function(e){
  return !e.closest('[data-proto]')&&e.getBoundingClientRect().height>0;})
  .sort(function(a,b){return a.getBoundingClientRect().top-b.getBoundingClientRect().top;})[0];
 if(!first)return null; var top=first.getBoundingClientRect().top;
 var w=0, walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){var t=walker.currentNode, el=t.parentElement;
  if(!el||el.closest('[data-proto],.top,script,style,#enai'))continue;
  if(!el.closest('#iq,#enrail'))continue;
  var r=el.getBoundingClientRect(); if(r.height===0||r.top>=top)continue;
  w+=(t.textContent.trim().match(/\\S+/g)||[]).length;}
 return {words:w, firstInputTop:Math.round(top)};})()`;
/* after a step: what just read, and was any of it inside the screen */
const FRESH=`(function(anchorSel){
 var f=[].slice.call(document.querySelectorAll('.fresh')).filter(function(e){var r=e.getBoundingClientRect();return r.height>0;});
 var inV=function(e){var r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;};
 var a=anchorSel?document.querySelector(anchorSel):null, ar=a?a.getBoundingClientRect():null;
 var near=null;
 f.forEach(function(e){var r=e.getBoundingClientRect(); if(!ar)return;
  var d=Math.max(0,Math.max(r.top-ar.bottom,ar.top-r.bottom)); near=near==null?d:Math.min(near,d);});
 var ai=document.getElementById('enai'), aiIn=ai?inV(ai):false;
 var nai=f.filter(function(e){return !e.closest('#enai');});
 return {fresh:f.length, seen:f.filter(inV).length, readingSeen:nai.filter(inV).length, nearestPx:near==null?null:Math.round(near), aiInView:aiIn};})`;

async function typeField(p,k,v){
 const sel='#en-'+k; const el=await p.$(sel); if(!el)return false;
 await el.scrollIntoViewIfNeeded();
 if(k==='type'||k==='sex'){await p.selectOption(sel,v);}
 else if(k==='date'||k==='time'){await p.fill(sel,v); await p.evaluate(s=>document.querySelector(s).dispatchEvent(new Event('change',{bubbles:true})),sel);}
 else{await p.click(sel); await p.fill(sel,''); await p.type(sel,v,{delay:8}); await p.press(sel,'Tab');}
 return true;}
/* a press, and a second if the first did not take: at 390 the product's own
   tip rule spends a first tap on anything carrying a title. Counted. */
async function press(p,sel,check){
 const el=await p.$(sel); if(!el)return 0;
 await el.scrollIntoViewIfNeeded(); await el.click(); await wait(p,140);
 if(check&&!(await p.evaluate(check))){const e2=await p.$(sel); if(e2){await e2.click(); await wait(p,140);} return 2;}
 return 1;}

(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const facts={blank:{},walk:{},reach:{},floors:{}};
 for(const [W,H] of [[1600,1000],[390,844]]){
  const phone=W<600;
  const ctx=await b.newContext({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone,deviceScaleFactor:1});
  const p=await ctx.newPage(); const errs=[], reqs=[];
  p.on('pageerror',e=>errs.push(String(e))); p.on('request',r=>{if(!/^(file|data|about|blob):/.test(r.url()))reqs.push(r.url());});
  for(const v of VS){
   /* ---- the stranger ---- */
   await open(p,v);
   const c0=await p.evaluate(CONTROLS), w0=await p.evaluate(WORDS_BEFORE_INPUT);
   const ov=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1||document.body.scrollWidth>innerWidth+1);
   facts.blank[v+'-'+W]={choicesOnScreen:c0.screen,choicesOnScreenSurface:c0.screenSurface,choicesSurface:c0.surface,
    wordsBeforeFirstInput:w0&&w0.words, firstInputTop:w0&&w0.firstInputTop, sidewaysScroll:ov};
   await shot(p,v+'-blank',W);
   /* ---- the walk, per person ---- */
   for(const who of ICPS){
    await open(p,v);
    const F=await p.evaluate(k=>{const f=EN_FILL[k];return {name:f.name,d:f.d,t:f.t,pl:f.p,z:f.z,type:f.type,arcs:f.arcs,ans:f.ans,
     order:CHARGES.slice()};},who);
    const parts=F.name.split(' ');
    const val={first:parts[0],middle:parts.slice(1,-1).join(' '),last:parts[parts.length-1],date:F.d,time:F.t,place:F.pl,zone:F.z,type:F.type};
    const steps=[]; let actions=0;
    const record=async(label,anchor)=>{await wait(p,380);
     const r=await p.evaluate(FRESH+'('+JSON.stringify(anchor||null)+')'); r.step=label; steps.push(r);
     if(label==='first'&&SHOTS_FOR.includes(who)){await shot(p,v+'-'+who+'-first',W);}};
    const fields=['first','middle','last','date','time','place','zone','type'];
    if(v==='c'){
     for(let i=0;i<7;i++){
      const s=await p.evaluate(()=>EN.step);
      const ks={0:['first'],1:['middle'],2:['last'],3:['date'],4:['time'],5:['place','zone'],6:['type']}[s]||[];
      let any=false;
      for(const k of ks){if(val[k]){await typeField(p,k,val[k]);actions++;any=true;}}
      if(any&&ks[0]!=='type'){await p.click('#en-next');actions++;}
      else if(ks[0]==='type'&&val.type){await p.click('#en-next');actions++;}
      else{await p.click('#en-skip');actions++;}
      await record(ks.join('+'),'.en-just');}
     /* the archetype, two presses */
     for(const a of F.arcs){actions+=await press(p,'[data-arc="'+a+'"]','EN.arcs&&EN.arcs.indexOf('+a+')>=0');}
     await record('archetype','.en-just');
     for(let i=0;i<9;i++){const c=F.order[i];actions+=await press(p,'[data-ans="'+c+':'+F.ans[c]+'"]','EN.ans["'+c+'"]==='+F.ans[c]);
      await record('q'+i,'.en-just');}
    }else{
     for(const k of fields){if(!val[k])continue; await typeField(p,k,val[k]); actions++; await record(k,'#en-'+k);}
     if(v==='a'){actions+=await press(p,'[data-door="arch"]',phone);}
     for(const a of F.arcs){actions+=await press(p,'[data-arc="'+a+'"]','EN.arcs&&EN.arcs.indexOf('+a+')>=0');}
     await record('archetype','[data-arc="'+F.arcs[0]+'"]');
     if(v==='a'){actions+=await press(p,'[data-door="qs"]',phone);}
     for(let i=0;i<9;i++){const c=F.order[i];actions+=await press(p,'[data-ans="'+c+':'+F.ans[c]+'"]','EN.ans["'+c+'"]==='+F.ans[c]);
      await record('q'+i,'[data-ans="'+c+':'+F.ans[c]+'"]');}}
    const done=await p.evaluate(()=>{const R=enRead();return {names:R.names.length,
     roots:R.names.filter(n=>n.root).length, sky:!!R.sky, pattern:!!R.pattern, channels:R.channels.read,
     arch:!!R.arch, child:R.child?R.child.answered:0, ai:enVoice(R).lines.length, missing:R.missing};});
    const nameSteps=steps.filter(s=>['first','middle','last'].includes(s.step));
    facts.walk[v+'-'+who+'-'+W]={actions, steps, done,
     stepsWithReading:steps.filter(s=>s.fresh>0).length, stepsSeen:steps.filter(s=>s.seen>0).length, stepCount:steps.length,
     stepsReadingSeen:steps.filter(s=>s.readingSeen>0).length,
     aiInViewSteps:steps.filter(s=>s.aiInView).length,
     firstNameSeen:(steps[0]||{}).seen>0, firstNameNearestPx:(steps[0]||{}).nearestPx};
    /* the finished first screen */
    await p.evaluate(`${SCROLLER}.scrollTo(0,0)`); const ih=await p.$('#iq'); if(ih)await p.evaluate(()=>{document.getElementById('iq').scrollTop=0;});
    if(SHOTS_FOR.includes(who)||who==='sofia'||who==='diane'||who==='marcus')await shot(p,v+'-'+who+'-done',W);
    const cD=await p.evaluate(CONTROLS);
    const wordsD=await p.evaluate(()=>{var t='';['iq','enrail','enai'].forEach(function(id){var e=document.getElementById(id);
     if(e&&e.getBoundingClientRect().height>0)t+=' '+e.innerText;});
     var pr=document.querySelector('[data-proto]'); if(pr)t=t.replace(pr.innerText,'');
     return (t.match(/\S+/g)||[]).length;});
    facts.walk[v+'-'+who+'-'+W].finished={choicesOnScreen:cD.screen,choicesSurface:cD.surface,words:wordsD,smallControls:cD.small.length};
    /* ---- reach, on the finished profile, for three of the six ---- */
    if(SHOTS_FOR.includes(who)){
     const top=await p.evaluate(()=>{const R=enRead();return R.child&&R.child.top?'c:'+R.child.top.c:'c:Fear';});
     const keys=['n0','expression','lifePath','sun','moon','p0','out','a1',top,'essence'];
     const rr=[];
     for(const k of keys){
      await p.evaluate(()=>{try{rdClose();}catch(e){}});
      let el=await p.$('[data-en="'+k+'"]');
      if(!el&&v==='a'){await p.click('[data-door="ess"]');await wait(p,200);el=await p.$('[data-en="'+k+'"]');}
      if(!el){rr.push({k,present:false});continue;}
      await el.scrollIntoViewIfNeeded(); let taps=0, opened=null;
      for(let t=0;t<2&&!opened;t++){await el.click();taps++;await wait(p,260);
       opened=await p.evaluate(()=>{const d=document.getElementById('rdrill');if(!d||d.style.display==='none'||d.getBoundingClientRect().height<5)return null;
        const r=d.getBoundingClientRect(); const eye=d.querySelector('.pm-eye'), nm=d.querySelector('.ad-nm');
        return {title:(eye?eye.textContent:'')+' / '+(nm?nm.textContent:''), inView:r.bottom>0&&r.top<innerHeight, top:Math.round(r.top)};});}
      rr.push({k,present:true,taps,opened:!!opened,inView:opened?opened.inView:false,title:opened?opened.title:null});
      if(k==='n0'&&opened)await shot(p,v+'-'+who+'-card-name',W);
      if(k==='out'&&opened&&who==='james')await shot(p,v+'-'+who+'-card-channels',W);}
     facts.reach[v+'-'+who+'-'+W]=rr;
     await p.evaluate(()=>{try{rdClose();}catch(e){}});
     /* the essence page, where each layout keeps it */
     if(who==='james'||who==='angela'){
      if(v==='a'){const d=await p.$('[data-door="ess"]'); const open=await p.evaluate(()=>!!document.querySelector('[data-paint=essence]'));
       if(d&&!open){await d.click();await wait(p,200);}
       await p.evaluate(()=>{const e=document.querySelector('[data-paint=essence]');if(e)e.scrollIntoView({block:'start'});});}
      else if(v==='d'){await p.evaluate(()=>{const e=document.querySelector('[data-paint=essence]');if(e)e.scrollIntoView({block:'start'});});}
      else{await p.click('[data-en="essence"]');await wait(p,250);}
      await shot(p,v+'-'+who+'-essence',W);}
    }
    console.log(W,v,who,'actions',actions,'read',facts.walk[v+'-'+who+'-'+W].stepsWithReading+'/'+steps.length,
     'seen',facts.walk[v+'-'+who+'-'+W].stepsSeen,'first seen',facts.walk[v+'-'+who+'-'+W].firstNameSeen,
     'roots',done.roots+'/'+done.names,'missing',done.missing.join(','));}
  }
  facts.floors[W]={pageErrors:errs,outboundRequests:reqs};
  await ctx.close();}
 /* his own three names, the one full root read on file */
 const ctx=await b.newContext({viewport:{width:1600,height:1000}}); const p=await ctx.newPage();
 for(const v of VS){await open(p,v+'-owner'); await shot(p,v+'-owner',1600);}
 await open(p,'b-owner'); await p.click('[data-en="n1"]'); await wait(p,300); await shot(p,'b-owner-card-oneill',1600);
 await ctx.close(); await b.close();
 fs.writeFileSync(path.join(OUT,'facts.json'),JSON.stringify(facts,null,1));
 console.log('blank',JSON.stringify(facts.blank));
 console.log('floors',JSON.stringify(facts.floors));})().catch(e=>{console.error(e);process.exit(1);});
