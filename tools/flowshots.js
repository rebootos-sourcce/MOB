/* THE FLOW PAGE, SHOT. node tools/flowshots.js [outdir]

   Round QN. The Ritual page is judged by looking, and tools/shots.js shoots
   every tab once on whatever profile happens to be open, which on Flow is a
   blank one: every new part this round (the thirty day loop, History, what is
   Suggested, the six cards) would be photographed empty. So this seeds the
   person's own record through the product's own writers and shoots the page
   at 1600 and at 390, whole, and each new part on its own.

   WHAT THE SEED IS, said so nobody reads a picture as a real person's record.
   Six stories committed through stCommit, the Story page's own Apply, with the
   snapshots they leave moved back in time so there is a reading from before
   the rituals started. One pass of relWrite, the release's own arithmetic,
   then a snapshot, so the held count has moved since. Three avatar stories.
   Four rituals over thirty days with a record of kept and missed days: one
   with no end, one in its last day, one that ended, and one older record with
   no plan left. Every number on the page is then the page's own read of that.

   And a blank profile, so the empty states are photographed too. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'mockups/flow-qn';
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';

const SEED=()=>{
 loadP(0); CURP.rituals=[]; CURP.history=[]; ritPlanPut([]);
 const DAY=86400000, off=new Date().getTimezoneOffset()*60000;
 const today=Math.floor((Date.now()-off)/DAY);
 const iso=d=>new Date(d*DAY+off+12*3600000).toISOString();
 const texts=['I am terrified of being abandoned and I panic and cannot breathe. My chest is tight.',
  'I am full of anger and rage at my father, I resent him and I hate that I blame myself.',
  'I feel worthless and ashamed, I am never enough, I am a failure.',
  'I go quiet and pull away from my partner when I feel judged and rejected.',
  'I am anxious all the time, worried, my stomach knots, I feel powerless and controlled.',
  'I feel guilty and I hide, I cannot speak my truth, my throat closes, I lie to keep the peace.'];
 texts.forEach(t=>{ST_TEXT=t; ST_PARSED=parseStory(t); stCommit();});
 /* the snapshots the commits left, moved back to five days before anything
    started, in their order */
 CURP.history.forEach((h,i)=>{h.t=iso(today-34+i);});
 CURP.avatar=CURP.avatar||avatarBlank();
 CURP.avatar.pairs=[
  {be:'I feel safe in my own body',notbe:'I am terrified of being abandoned and I panic and cannot breathe'},
  {be:'I speak up calmly in the room',notbe:'I feel worthless and ashamed, I am never enough'},
  {be:'I stay close to the people I love',notbe:'I go quiet and pull away from my partner when I feel judged and rejected'}];
 CURP.avatar.built=true; CURP.avatar.at=iso(today-30);
 /* ROUND QS: each avatar story's starting weight, kept the way the Avatar
    page's own Save keeps it (avSideWrite, load0 = the row's load once the story
    has landed), and before the release below, so the percent complete the
    Ritual page now draws is the release's real movement and not a number
    typed here */
 compute(); avSideWrite(e=>{avRows().forEach(x=>{if(x.gap)e.load0[avKey(x.pair)]=x.gap.load;});});
 /* one pass of the release's own arithmetic, and the reading it leaves */
 for(let k=0;k<2;k++){const q=relQueueOf(8); q.forEach(n=>relWrite(q,n,n.sq));}
 CURP.history.push(snapshot(CURP)); CURP.history[CURP.history.length-1].t=iso(today-3);
 const P=(id,k,band,from,days,extra)=>Object.assign({id,steps:[k],when:'',where:'',days,from:iso(from),stop:null,
  band,track:(PRACTICE.find(p=>p.k===k)||{}).track||'',rel:null,tc:null,tags:[band],on:null,tm:null},extra||{});
 const plans=[P('rt','truth','Solar',today-26,0),P('rl','listen','Throat',today-6,7),
  P('rh','heartpt','Heart',today-21,7)];
 const done=(k,band,d,min)=>CURP.rituals.push({t:iso(d),steps:[k],min,when:'',where:'',band,done:iso(d)});
 for(let d=today-26;d<=today;d++)if(![today-19,today-18,today-11,today-4,today].includes(d))done('truth','Solar',d,2);
 [today-6,today-5,today-3,today-2,today-1].forEach(d=>done('listen','Throat',d,10));
 [today-21,today-20,today-19,today-17,today-16].forEach(d=>done('heartpt','Heart',d,10));
 [today-29,today-28,today-27].forEach(d=>done('slow','Root',d,10));
 CURP.rituals.sort((a,b)=>Date.parse(a.t)-Date.parse(b.t));
 ritPlanPut(plans); pSave();
 RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null;
 setTab(TAB.RITUAL); ritRender(); status('');};
const BLANK=()=>{loadP(0); CURP.rituals=[]; CURP.history=[]; ritPlanPut([]); CURP.story={entries:[]};
 CURP.avatar=avatarBlank(); pSave(); setTab(TAB.RITUAL); ritRender(); status('');};

(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const errs=[];
 const open=async(W,H,phone)=>{
  const p=await b.newPage({viewport:{width:W,height:H},hasTouch:!!phone,isMobile:!!phone});
  await p.addInitScript("window.SIGHT_PLAN={tier:'four',status:'active'};");
  p.on('pageerror',e=>errs.push(W+': '+e.message));
  await p.goto(FILE);
  try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}
  await p.waitForTimeout(700);
  await p.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();});
  return p;};
 const shot=async(p,sel,name)=>{const e=await p.$(sel); if(!e){errs.push('no '+sel);return;}
  await e.scrollIntoViewIfNeeded(); await p.waitForTimeout(250); await e.screenshot({path:path.join(OUT,name)});};
 /* 1600: the first screen as a person lands on it, then the whole centre on a
    tall window so all six cards are in one picture, then each new part */
 {const p=await open(1600,1000);
  await p.evaluate(SEED); await p.waitForTimeout(1600);
  await p.screenshot({path:path.join(OUT,'flow-1600.png')});
  await shot(p,'#flowleft .rv-sug','suggested-1600.png');
  await shot(p,'#flowside .rv-loopw','loop-1600.png');
  await shot(p,'#flowside .rv-hist','history-1600.png');
  await p.setViewportSize({width:1600,height:2300}); await p.waitForTimeout(800);
  await p.screenshot({path:path.join(OUT,'flow-1600-tall.png')});
  await shot(p,'#rit .rv-six','stack-1600.png');
  await shot(p,'#rit .rv-c-av','avatar-1600.png');
  await shot(p,'#rit .rv-act','active-1600.png');
  await p.close();}
 /* 390: the page is one scroll on a phone, so it is shot whole */
 {const p=await open(390,844,true);
  await p.evaluate(SEED); await p.waitForTimeout(1600);
  await p.screenshot({path:path.join(OUT,'flow-390.png')});
  /* THE PHONE SHELL SCROLLS INSIDE ITSELF, not the document, so a full page
     capture paints the first screen and then nothing: measured, the document
     reads 844 tall while the three columns run past six thousand. So the
     scroller is found by what it does, the nearest ancestor of the stage
     that actually scrolls, and the page is shot a screen at a time down it. */
  const n=await p.evaluate(()=>{let e=document.getElementById('rit');
   while(e&&!(e.scrollHeight>e.clientHeight+4&&/auto|scroll/.test(getComputedStyle(e).overflowY)))e=e.parentElement;
   window.__sc=e||document.scrollingElement; return Math.ceil(window.__sc.scrollHeight/(window.__sc.clientHeight-80));});
  for(let i=0;i<Math.min(n,12);i++){
   await p.evaluate(i=>{window.__sc.scrollTop=i*(window.__sc.clientHeight-80);},i); await p.waitForTimeout(250);
   await p.screenshot({path:path.join(OUT,'flow-390-'+String(i+1).padStart(2,'0')+'.png')});}
  await p.evaluate(()=>{window.__sc.scrollTop=0;});
  await shot(p,'#flowside .rv-loopw','loop-390.png');
  await shot(p,'#flowside .rv-hist','history-390.png');
  await shot(p,'#flowleft .rv-sug','suggested-390.png');
  await p.close();}
 /* a stranger's first visit: nothing written, nothing kept */
 {const p=await open(1600,1000);
  await p.evaluate(BLANK); await p.waitForTimeout(1400);
  await p.screenshot({path:path.join(OUT,'flow-1600-blank.png')});
  await p.close();}
 /* and the same first visit on a phone, where the column that starts a ritual
    comes first when nothing is active (ritnone, FT24) */
 {const p=await open(390,844,true);
  await p.evaluate(BLANK); await p.waitForTimeout(1400);
  await p.screenshot({path:path.join(OUT,'flow-390-blank.png')});
  await p.close();}
 await b.close();
 console.log('shots in '+OUT+(errs.length?'\nERRORS '+errs.join(' | '):''));
 process.exit(errs.length?1:0);})();
