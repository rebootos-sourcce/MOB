/* ============================================================
   THE WALK AND THE COUNT. Drives proto/avatar/seats4/seats4.html with real
   presses and real keystrokes, for each of the five layouts (the graded one
   and the four), for each of the six reference ICPs and a stranger, at 1600
   by 1000 and 390 by 844, and writes what it measured to shots/facts.json.
   The verdict sheet inside the page reads every number from there.

   His criteria, turned into things a machine can count:
     above the fold   what is inside the first screen of the page itself:
                      controls, words, bare figures (a number with no word),
                      how much of it is the figure
     at a glance      three things a stranger must find without scrolling:
                      who they said they are becoming, the thing in the way in
                      their own words, and the one action. Scored 0 to 3.
     a story          whether those three read top to bottom in that order
     what to do       words a person reads before the action, and how long
                      after landing the action is on screen at all
     looks            the figure's share of the first screen, and whether
                      anything moves on landing and after it
     the loop         the release walked end to end on the shipped card: was
                      the result shown where the person is looking, and was
                      the next step (the ritual) on screen after it; a journal
                      entry typed with real keystrokes, same question; and
                      how many presses the ritual is from landing
     floors           controls under 44 pixels, sideways scroll at 390, page
                      errors, requests leaving the file

   Prototype chrome (the dock, the verdict sheet) carries data-proto and is
   never counted.

     node proto/avatar/seats4/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/avatar/seats4/shoot.js
     node proto/avatar/seats4/build.js     (again, to embed the verdict)
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'shots'); fs.mkdirSync(OUT,{recursive:true});
const PAGE='file://'+path.join(__dirname,'seats4.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const PAIRS=require('./pairs.js');
const {STORYBANK}=require(path.join(__dirname,'..','..','..','sim','stories.js'));
const ICPS=(process.env.ICPS||'Sofia,Diane,Marcus,Angela,Derek,James').split(',');
const LS=(process.env.LS||'graded,ring,three,story,loop').split(',');
const WS=(process.env.WS||'1600,390').split(',').map(Number);
const SHOT=['James','Angela','Derek','Sofia','Diane','Marcus'];
const wait=(p,ms)=>p.waitForTimeout(ms);

async function open(p,L,who,settle){
 await p.goto('about:blank'); await p.goto(PAGE+'#L='+L+'&who='+who+'&clean=1');
 await p.waitForFunction(()=>document.documentElement.getAttribute('data-s4-ready')==='1',null,{timeout:30000});
 await wait(p,settle==null?2800:settle);}

/* the one action a layout offers: the release for the lead, or for a
   stranger the first way into writing the pair */
const PRIMARY=`(function(){
 var vis=function(e){var r=e.getBoundingClientRect();return r.width>1&&r.height>1&&getComputedStyle(e).visibility!=='hidden';};
 var c=[].slice.call(document.querySelectorAll('#s4 [data-s4-rel]')).filter(vis);
 if(!c.length)c=[].slice.call(document.querySelectorAll('#s4 #s4-be,#s4 [data-s4-focus]')).filter(vis);
 return c[0]||null;})()`;

const MEASURE=`(function(ideal,gapText,ritName){
 var host=document.getElementById('s4'), H=innerHeight, Wd=innerWidth;
 var inV=function(r){return r.bottom>1&&r.top<H-1&&r.right>1&&r.left<Wd-1;};
 var full=function(r){return r.top>=0&&r.bottom<=H&&r.left>=0&&r.right<=Wd;};
 var shown=function(e){for(var n=e;n&&n!==document.body;n=n.parentElement){var c=getComputedStyle(n);if(c.display==='none'||c.visibility==='hidden')return false;}return true;};
 var sel='button,input,select,textarea,a[href],summary,[role=button],[tabindex]:not([tabindex="-1"])';
 var all=[].slice.call(document.querySelectorAll(sel)).filter(function(e){
  if(e.closest('[data-proto]'))return false; if(e.disabled||e.type==='hidden')return false;
  var r=e.getBoundingClientRect(); if(r.width<2||r.height<2)return false; return shown(e);});
 var mine=all.filter(function(e){return host.contains(e);});
 var small=mine.filter(function(e){var r=e.getBoundingClientRect();return r.height<43.5||r.width<43.5;})
  .map(function(e){var r=e.getBoundingClientRect();return (e.getAttribute('aria-label')||e.textContent||e.tagName).trim().slice(0,30)+' '+Math.round(r.width)+'x'+Math.round(r.height);});
 /* words and figures inside the first screen of the page, SVG text included */
 var words=0, figs=[], textNodes=[];
 var tw=document.createTreeWalker(host,NodeFilter.SHOW_TEXT);
 while(tw.nextNode()){var t=tw.currentNode, el=t.parentElement; if(!el||el.closest('[data-proto],script,style,title'))continue;
  if(!shown(el))continue; var rg=document.createRange(); rg.selectNodeContents(t); var r=rg.getBoundingClientRect();
  if(r.height===0)continue; var toks=(t.textContent.match(/\\S+/g)||[]);
  textNodes.push({t:t.textContent,r:r});
  if(!inV(r))continue; words+=toks.length;
  var whole=t.textContent.trim(); if(/^\\d[\\d.,]*%?$/.test(whole))figs.push(whole);}
 /* where a piece of text sits: the first text node carrying its first words */
 var find=function(s){if(!s)return null;var k=s.slice(0,22);for(var i=0;i<textNodes.length;i++)if(textNodes[i].t.indexOf(k)>=0)return textNodes[i].r;return null;};
 var ri=find(ideal), rgp=find(gapText), rr=find(ritName);
 var act=${PRIMARY}, ra=act?act.getBoundingClientRect():null;
 var wordsBefore=null;
 /* words read before the action, in its own column: above it, and overlapping
    it sideways once it is widened to a reading column of at least 320 pixels */
 if(ra){wordsBefore=0;var cx=(ra.left+ra.right)/2,hw=Math.max(160,(ra.right-ra.left)/2);
  textNodes.forEach(function(x){if(x.r.bottom<=ra.top+2&&x.r.right>cx-hw&&x.r.left<cx+hw)wordsBefore+=(x.t.match(/\\S+/g)||[]).length;});}
 /* the figure: the largest ring drawn, clipped to the first screen */
 var hr=host.getBoundingClientRect(), vis={l:Math.max(hr.left,0),t:Math.max(hr.top,0),r:Math.min(hr.right,Wd),b:Math.min(hr.bottom,H)};
 var hostArea=Math.max(1,(vis.r-vis.l)*(vis.b-vis.t)), fig=0;
 [].forEach.call(host.querySelectorAll('svg.s4-ring,svg.o-orbit'),function(s){var r=s.getBoundingClientRect();
  var a=Math.max(0,Math.min(r.right,vis.r)-Math.max(r.left,vis.l))*Math.max(0,Math.min(r.bottom,vis.b)-Math.max(r.top,vis.t));fig=Math.max(fig,a);});
 var anims=document.getAnimations().filter(function(a){var t=a.effect&&a.effect.target;return t&&host.contains(t)&&a.playState==='running';});
 var all0=all.filter(function(e){return inV(e.getBoundingClientRect());});
 return {
  controlsFirst:mine.filter(function(e){return inV(e.getBoundingClientRect());}).length,
  controlsSurface:mine.length, controlsWholeScreen:all0.length,
  wordsFirst:words, figuresFirst:figs.length, figures:figs.slice(0,8),
  idealSeen:!!(ri&&inV(ri)), gapSeen:!!(rgp&&inV(rgp)), actionSeen:!!(ra&&full(ra)&&ra.height>=43.5),
  ritualNamedFirst:!!(rr&&inV(rr)),
  order:!!(ri&&rgp&&ra&&ri.top<=rgp.top+1&&rgp.top<=ra.top+1),
  actionTop:ra?Math.round(ra.top):null, actionH:ra?Math.round(ra.height):null,
  wordsBeforeAction:wordsBefore,
  figureShare:Math.round(100*fig/hostArea),
  moving:anims.length, pageTop:Math.round(hr.top),
  small:small, sideways:document.documentElement.scrollWidth>Wd+1||document.body.scrollWidth>Wd+1};})`;

/* how long after landing the action is on screen: the latest end of any
   entrance animation on the action or anything holding it */
const ACTION_AT=`(function(){var a=${PRIMARY}; if(!a)return null; var end=0;
 document.getAnimations().forEach(function(an){var t=an.effect&&an.effect.target; if(!t||!t.contains||!t.contains(a))return;
  var tm=an.effect.getComputedTiming(); if(tm.iterations===Infinity)return; end=Math.max(end,(tm.delay||0)+(tm.activeDuration||0));});
 return Math.round(end);})()`;

async function scrollTo(p,sel){const el=await p.$(sel); if(!el)return false;
 const need=await p.evaluate(e=>{const r=e.getBoundingClientRect();return r.top<0||r.bottom>innerHeight;},el);
 if(need)await el.scrollIntoViewIfNeeded(); return need;}

(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const prev=fs.existsSync(path.join(OUT,'facts.json'))&&process.env.MERGE?JSON.parse(fs.readFileSync(path.join(OUT,'facts.json'),'utf8')):null;
 const facts=prev||{first:{},release:{},journal:{},ritual:{},blank:{},people:{},floors:{}};
 for(const W of WS){
  const phone=W<600, H=phone?844:1000;
  const ctx=await b.newContext({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone,deviceScaleFactor:1});
  const p=await ctx.newPage(); const errs=[], reqs=[];
  p.on('pageerror',e=>errs.push(String(e))); p.on('request',r=>{if(!/^(file|data|about|blob):/.test(r.url()))reqs.push(r.url());});
  for(const L of LS){
   /* ---- the stranger, nothing written ---- */
   await open(p,L,'blank',120);
   const at0=await p.evaluate(ACTION_AT); await wait(p,2700);
   const m0=await p.evaluate(MEASURE+'(null,null,null)'); m0.actionAt=at0;
   await p.screenshot({path:path.join(OUT,L+'-blank-'+W+'.jpg'),type:'jpeg',quality:78});
   /* write the pair, with real keystrokes, from the first screen */
   let presses=0, scrolls=0;
   const beVis=async()=>p.evaluate(()=>{var e=document.getElementById('s4-be');return !!e&&e.getBoundingClientRect().height>0;});
   if(!(await beVis())){const f=await p.$('#s4 [data-s4-focus],#s4 [data-s4-st=journal]');
    if(f){if(await scrollTo(p,'#s4 [data-s4-focus],#s4 [data-s4-st=journal]'))scrolls++; await f.click();presses++;await wait(p,250);}
    if(!(await beVis())){const d=await p.$('#s4 details.s4-more summary'); if(d){await d.click();presses++;await wait(p,200);}}}
   if(await scrollTo(p,'#s4-be'))scrolls++;
   await p.click('#s4-be'); await p.type('#s4-be','A great public speaker.',{delay:4});
   await p.click('#s4-not'); await p.type('#s4-not','My chest is tight and my throat closes when I stand up in front of the board.',{delay:4});
   if(await scrollTo(p,'#s4 [data-s4-do=pair]'))scrolls++;
   await p.click('#s4 [data-s4-do=pair]'); presses++; await wait(p,700);
   const aft=await p.evaluate(MEASURE+'("A great public speaker","My chest is tight",null)');
   const fl=await p.evaluate(()=>{var f=document.querySelector('#s4 .s4-flash');if(!f)return false;var q=f.getBoundingClientRect();return q.height>0&&q.bottom>0&&q.top<innerHeight;});
   facts.blank[L+'-'+W]=Object.assign(m0,{write:{presses,scrolls,fields:2,actionSeenAfter:aft.actionSeen,gapSeenAfter:aft.gapSeen,resultSeen:fl}});
   console.log(W,L,'blank','ctl',m0.controlsFirst,'words',m0.wordsFirst,'write presses',presses,'scrolls',scrolls,'action after',aft.actionSeen,'result seen',fl);

   for(const who of ICPS){
    const key=L+'-'+who+'-'+W;
    await open(p,L,who,120);
    const actionAt=await p.evaluate(ACTION_AT);
    const moving0=await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running'&&a.effect&&a.effect.target&&document.getElementById('s4').contains(a.effect.target)).length);
    await wait(p,2700);
    const info=await p.evaluate(()=>{var D=S4.read();var rt=null;try{rt=D.lead?ritFor({darkB:D.lead.seat,DQ:D.r.DQ}):null;}catch(e){}
     var cq=D.r.CQ, lvl=null; for(var i=0;i<TIERDEF.length;i++)if(cq>=TIERDEF[i].at){lvl=TIERDEF.length-i;break;}
     var pr=D.lead?S4.ST.pairs[D.lead.idx[0]]:null;
     return {ideal:D.ideal?D.ideal.be:null, lead:D.lead?{seat:D.lead.seat,load:+D.lead.load.toFixed(2)}:null,
      gapText:pr?pr.notbe:null, ritName:rt&&rt.called?rt.called.nm:null, idealSeat:D.iGap?D.iGap.seat:null,
      top:D.T.map(g=>g.seat+' '+g.load.toFixed(2)), cq:Math.round(cq), level:lvl, unresolved:D.unresolved};});
    const m=await p.evaluate(MEASURE+'('+JSON.stringify(info.ideal)+','+JSON.stringify(info.gapText)+','+JSON.stringify(info.ritName)+')');
    m.actionAt=actionAt; m.movingOnLanding=moving0; m.glance=(m.idealSeen?1:0)+(m.gapSeen?1:0)+(m.actionSeen?1:0);
    facts.first[key]=m; if(W===1600&&L==='graded')facts.people[who]=info;
    if(SHOT.includes(who))await p.screenshot({path:path.join(OUT,L+'-'+who+'-'+W+'.jpg'),type:'jpeg',quality:78});

    /* ---- the ritual: how many presses from landing to its name ---- */
    let ritPress=m.ritualNamedFirst?0:null;
    if(ritPress===null&&info.ritName){
     const s=await p.$('#s4 [data-s4-st=ritual]');
     if(s){await s.scrollIntoViewIfNeeded(); await s.click(); await wait(p,250);
      const seen=await p.evaluate(n=>{var tw=document.createTreeWalker(document.getElementById('s4'),NodeFilter.SHOW_TEXT);
       while(tw.nextNode()){var t=tw.currentNode;if(t.textContent.indexOf(n)>=0){var q=t.parentElement.getBoundingClientRect();if(q.height>0&&q.bottom>0&&q.top<innerHeight)return true;}}return false;},info.ritName);
      ritPress=seen?1:null;}}
    facts.ritual[key]={presses:ritPress, name:info.ritName};

    /* ---- the release, walked on the shipped card ---- */
    await open(p,L,who,2700);
    let rp=0, rs=0; const r={};
    const act=await p.evaluate(()=>{var a=document.querySelector('#s4 [data-s4-rel]');if(!a)return null;a.setAttribute('data-walk','1');return a.getAttribute('data-s4-rel');});
    if(act){
     if(await scrollTo(p,'[data-walk]'))rs++;
     await p.click('[data-walk]'); rp++;
     await p.waitForSelector('#rel #relgo',{timeout:8000});
     const before=await p.evaluate(s=>{var g=null;avRows().forEach(function(x){if(x.gap&&x.gap.seat===s)g=x.gap.load;});return g;},act);
     await p.click('#relgo'); rp++;
     await p.waitForFunction(()=>RUN.phase==='done',null,{timeout:90000}); await wait(p,300);
     const close=await p.$('#relclose'); if(close){await close.click(); rp++;} await wait(p,500);
     Object.assign(r,await p.evaluate(s=>{
      var inV=function(e){if(!e)return false;var q=e.getBoundingClientRect();return q.height>0&&q.bottom>0&&q.top<innerHeight;};
      var f=document.querySelector('#s4 .s4-flash'); var g=null;avRows().forEach(function(x){if(x.gap&&x.gap.seat===s)g=x.gap.load;});
      var nx=[].slice.call(document.querySelectorAll('#s4 [data-s4-st=ritual],#s4 [data-s4-do=ritdone],#s4 .y-rit')).filter(inV);
      return {after:g, flash:f?f.textContent:null, resultSeen:inV(f), nextSeen:nx.length>0};},act));
     r.before=before; r.seat=act; r.fell=r.after<before;}
    r.presses=rp; r.scrolls=rs;
    facts.release[key]=r;
    if(who==='James')await p.screenshot({path:path.join(OUT,L+'-James-after-'+W+'.jpg'),type:'jpeg',quality:78});

    /* ---- a journal entry, typed ---- */
    await open(p,L,who,2700);
    let jp=0, js=0; const bk=STORYBANK[who]||[], line=(bk.filter(x=>x[0]==='crack')[0]||bk[0])[1];
    if(!(await p.$('#s4-story'))){if(await scrollTo(p,'#s4 [data-s4-st=journal]'))js++; await p.click('#s4 [data-s4-st=journal]'); jp++; await wait(p,250);}
    if(await scrollTo(p,'#s4-story'))js++;
    await p.click('#s4-story'); await p.type('#s4-story',line,{delay:3});
    await p.click('#s4 [data-s4-do=story]'); jp++; await wait(p,500);
    const jr=await p.evaluate(()=>{var f=document.querySelector('#s4 .s4-flash');if(!f)return {seen:false,msg:null};var q=f.getBoundingClientRect();
     return {seen:q.height>0&&q.bottom>0&&q.top<innerHeight,msg:f.textContent};});
    facts.journal[key]={presses:jp,scrolls:js,resultSeen:jr.seen,msg:jr.msg};

    console.log(W,L.padEnd(6),who.padEnd(6),'ctl',m.controlsFirst,'words',m.wordsFirst,'figs',m.figuresFirst,'glance',m.glance,'order',m.order,
     'before',m.wordsBeforeAction,'at',m.actionAt,'fig%',m.figureShare,'| rel',r.presses,'+',r.scrolls,'seen',r.resultSeen,'next',r.nextSeen,'fell',r.fell,
     '| jr',jp,'+',js,jr.seen,'| rit',ritPress,'| small',m.small.length,m.sideways?'SIDEWAYS':'');}}
  const was=facts.floors[W]||{pageErrors:[],pageErrorCount:0,outboundRequests:[]};
  facts.floors[W]={pageErrors:was.pageErrors.concat(errs).slice(0,6),pageErrorCount:was.pageErrorCount+errs.length,outboundRequests:was.outboundRequests.concat(reqs)};
  await ctx.close();}
 await b.close();
 fs.writeFileSync(path.join(OUT,'facts.json'),JSON.stringify(facts,null,1));
 console.log('floors',JSON.stringify(facts.floors));})().catch(e=>{console.error(e);process.exit(1);});
