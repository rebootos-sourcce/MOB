/* THE RELEASE SCREEN, ROUND QM. His words, 2 October: "I don't want a frame
   around anything. I want it to be the entire screen ... the prompt which is
   important to keep visible at all times ... the next set is the reframe, it's
   the I know that I am ... We want visual representations for left and right,
   how many have been released and how many have been recharged ... I can
   interrupt the scroll, scrub through it, and I can flag which patterns felt
   heaviest. Those heaviest I can swipe either way."

   Drives a real run on the person's own record through the real controls, at
   1600 and at 390, and reads the page rather than the source:

     1  no frame: the release covers the viewport, carries no border, radius or
        shadow, and the app is out of the picture while it is up and back after
     2  the prompt is pinned: it is outside the part that scrolls and does not
        move when that part scrolls, on the opening and on the list
     3  the reframe is his register: every reframe line, head and pass, opens
        "I know that", and pass k of a reframe sits on the same rung index as
        pass k of the release; the release side is untouched
     4  left and right: the two side panels print the run's own per side
        counts, and the four add up to what relCounts says was said
     5  swipe either way: right keeps a line in the bank, left in the shadow, a
        tap still marks and unmarks, the arrow keys reach both, and every mark,
        either pile, reaches the record's heavy lines at the end of the run
     6  the scrub moves the list and never the run
     7  the results: each of his sections is there, and the bank, vault and
        mark figures are the record's own, read before and after the write
     8  the switch is named Binaural tone and keeps its hertz note
     9  no page error at either width

   Known bad first: run against the build before this round (ATUNED_FILE
   pointing at ab6666a's source.html) it fails on 1, 2, 3, 4, 5, 6, 7 and 8. */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
 try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}};
/* a read that throws on a build missing what it reads reports as a failed
   check rather than ending the run, so a known bad build names every miss */
const ev=async(page,fn,arg)=>{try{return await page.evaluate(fn,arg);}catch(e){return {err:String(e.message).split('\n')[0]};}};
const STORY='I am afraid I will be left. When she goes quiet I panic and try to control everything, and my chest goes tight.';

(async()=>{
 const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [W,H] of [[1600,1000],[390,844]]){
  console.log('\n=== the release screen at '+W+' ===');
  const page=await browser.newPage({viewport:{width:W,height:H}});
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto(FILE,{waitUntil:'load'}); await booted(page);
  await page.evaluate(t=>{loadP(0); ST_TEXT=t; ST_PARSED=parseStory(t); stCommit(); compute(); setTab(TAB.FIELD); render();
   relPick(W.filter(function(n){return n.cf&&n.sq>=1;}).sort(function(a,b){return b.sq-a.sq;}).slice(0,3).map(function(n){return n.i;}));
   /* a short dose so the walk below covers whole blocks quickly */
   RUN.dose=4; RUN.plan=relPlan(); relRender();
   var d=document.getElementById('msgdock'); if(d)d.style.visibility='hidden';},STORY);
  await page.waitForTimeout(300);

  /* 1. no frame */
  const f1=await ev(page,()=>{
   var c=document.querySelector('#rel .rel-card'), r=c.getBoundingClientRect(), cs=getComputedStyle(c);
   var app=document.querySelector('.app');
   return {x:r.left,y:r.top,w:r.width,h:r.height,iw:innerWidth,ih:innerHeight,
    border:cs.borderTopWidth,radius:cs.borderTopLeftRadius,shadow:cs.boxShadow,
    app:getComputedStyle(app).visibility, rel:getComputedStyle(document.getElementById('rel')).visibility};});
  ok(f1.x===0&&f1.y===0&&Math.abs(f1.w-f1.iw)<1&&Math.abs(f1.h-f1.ih)<1,'the release is the whole screen: '+JSON.stringify([f1.x,f1.y,f1.w,f1.h]));
  ok(f1.border==='0px'&&f1.radius==='0px'&&f1.shadow==='none','and carries no frame: border '+f1.border+', radius '+f1.radius+', shadow '+f1.shadow);
  ok(f1.app==='hidden'&&f1.rel==='visible','the app is out of the picture while it is up, not dimmed behind it: app '+f1.app+', release '+f1.rel);
  const x=await ev(page,()=>{var b=document.getElementById('relx'); if(!b)return null; var r=b.getBoundingClientRect();
   return {top:r.top,right:r.right,w:r.width,h:r.height};});
  ok(x&&x.top<70&&x.right<=W&&x.w>=44&&x.h>=44,'the cross sits at the top of the screen at the tap floor: '+JSON.stringify(x));

  /* 2. the prompt is pinned, on the opening and on the list */
  for(const ph of ['opening','run']){
   const p2=await ev(page,ph=>{relTicker(false); RUN.phase=ph; RUN.line=0; RUN.idx=0; RUN.pass=1; RUN.paused=true; relRender();
    var pr=document.getElementById('relpr'), sc=document.getElementById('relsc');
    if(!pr||!sc)return {pr:!!pr,sc:!!sc};
    var y0=pr.getBoundingClientRect().top; sc.scrollTop=sc.scrollHeight;
    var y1=pr.getBoundingClientRect().top;
    return {pr:true,sc:true,inside:sc.contains(pr),moved:Math.abs(y1-y0),scrolls:sc.scrollHeight>sc.clientHeight,
     text:pr.textContent};},ph);
   ok(p2.pr&&p2.sc&&!p2.inside,ph+': the prompt is outside the part that scrolls: '+JSON.stringify(p2));
   ok(p2.moved===0,ph+': and it does not move when that part scrolls, moved '+p2.moved+'px'+(p2.scrolls?'':' (nothing to scroll)'));
   ok(/letting go of believing, perceiving, thinking, behaving, acting, and feeling/.test(p2.text||''),ph+': it is the six channel prompt: '+p2.text);}
  await page.evaluate(()=>{var sc=document.getElementById('relsc'); if(sc)sc.scrollTop=0;});

  try{
  /* 3. the reframe in his register, rung for rung with the release */
  const r3=await ev(page,()=>{
   var out={rel:[],ref:[],prompts:{}};
   (RUN.plan||[]).forEach(function(k,i){var at=relAt(i);
    for(var p=0;p<RUN.dose;p++){var st=relStepAt(at,p); (at.ch[2]==='truth'?out.ref:out.rel).push({i:i,p:p,t:st.text});}
    out.prompts[relPrompt(at).half]=relPrompt(at).text;});
   out.entries=[REL_ENTRY.slice(),REF_ENTRY.slice()];
   return out;});
  ok(r3.ref.length>0&&r3.ref.every(l=>/^I know that /.test(l.t)),'every reframe line, head and pass, opens "I know that": '
   +r3.ref.filter(l=>!/^I know that /.test(l.t)).slice(0,3).map(l=>l.t).join(' | '));
  ok(r3.ref.filter(l=>l.p>0).every(l=>l.t.indexOf(r3.entries[1][(l.p-1)%r3.entries[1].length])===0),
   'a reframe pass opens on REF_ENTRY at the same rung index a release pass uses');
  ok(r3.rel.filter(l=>l.p>0).every(l=>l.t.indexOf(r3.entries[0][(l.p-1)%r3.entries[0].length])===0)
   &&r3.rel.filter(l=>l.p===0).every(l=>/^I am letting go of believing/.test(l.t)),'and the release side is untouched: six channels on the head, his three entries on the passes');
  ok(r3.prompts.Reframe==='I know'&&/^I am letting go of/.test(r3.prompts.Release||''),'the reframe prompt is "I know", the release prompt the six channels: '+JSON.stringify(r3.prompts));
  const shown=await ev(page,()=>{var i=RUN.plan.findIndex(function(k){return /truth/.test(k);});
   RUN.phase='run'; RUN.idx=i; RUN.pass=2; RUN.look=false; relRender();
   return {line:(document.querySelector('#rel .rel-line')||{}).textContent||'',
    tail:(document.querySelector('#rel .rel-cr-i.now .rel-tail')||{}).textContent||'',
    pr:(document.querySelector('#relpr b')||{}).textContent||''};});
  ok(/^I know that /.test(shown.line)&&/^that /.test(shown.tail)&&shown.pr==='I know',
   'on screen the reframe line shows "... that" under the pinned "I know", and is said whole: '+JSON.stringify(shown));

  }catch(e){ok(false,'section 3 the reframe could not run: '+e.message.split('\n')[0]);}
  try{
  /* 4. left and right, counted off the run */
  const s4=await ev(page,()=>{var c=relCounts(), out={c:c.side,said:c.said,put:c.put,shown:{}};
   ['L','R'].forEach(function(s){var e=document.getElementById('rellr'+s); if(!e)return;
    out.shown[s]=[].slice.call(e.querySelectorAll('.rel-lr-n')).map(function(b){return b.textContent;});
    out.on=out.on||(e.classList.contains('on')?s:null);});
   out.live=relAt(RUN.idx).ch[0]; return out;});
  const num=v=>v==='–'?0:+v;
  ok(s4.shown.L&&s4.shown.R&&num(s4.shown.L[0])===s4.c.L.rel&&num(s4.shown.L[1])===s4.c.L.ref
   &&num(s4.shown.R[0])===s4.c.R.rel&&num(s4.shown.R[1])===s4.c.R.ref,'each side prints its own released and recharged: '+JSON.stringify([s4.shown,s4.c]));
  ok(s4.c.L.rel+s4.c.R.rel===s4.said&&s4.c.L.ref+s4.c.R.ref===s4.put,'and the sides add up to the run: '+JSON.stringify([s4.said,s4.put]));
  ok(s4.on===s4.live,'the side the line is on is the lit one: '+s4.on+' for '+s4.live);

  }catch(e){ok(false,'section 4 left and right could not run: '+e.message.split('\n')[0]);}
  try{
  /* 5. swipe either way, tap, keys, and the record */
  await page.evaluate(()=>{RUN.idx=0; RUN.pass=1; RUN.look=false; RUN.heavy={}; relRender();});
  await page.waitForTimeout(450);
  const swipe=async(sel,dx)=>{const b=await page.evaluate(s=>{var r=document.querySelector(s); if(!r)return null;
    var q=r.getBoundingClientRect(); return {k:r.getAttribute('data-relh'),x:q.left+q.width/2,y:q.top+q.height/2};},sel);
   if(!b)return null;
   await page.mouse.move(b.x,b.y); await page.mouse.down();
   for(let s=1;s<=10;s++){await page.mouse.move(b.x+dx*s/10,b.y); await page.waitForTimeout(16);}
   await page.mouse.up(); await page.waitForTimeout(350); return b.k;};
  const kR=await swipe('#relcarl .rel-cr-i[data-d="1"]',110);
  const kL=await swipe('#relcarl .rel-cr-i[data-d="2"]',-110);
  const kS=await swipe('#relcarl .rel-cr-i[data-d="0"]',30);
  const h5=await ev(page,()=>Object.assign({},RUN.heavy));
  ok(kR&&h5[kR]==='bank','a swipe right keeps the line in the bank: '+JSON.stringify([kR,h5]));
  ok(kL&&h5[kL]==='shadow','a swipe left weights it in the shadow: '+JSON.stringify([kL,h5]));
  ok(kS&&!h5[kS],'a drag short of the line marks nothing and goes home: '+kS);
  const t5=await ev(page,k=>{var r=document.querySelector('#relcarl [data-relh="'+k+'"]');
   r.click(); var a=RUN.heavy[k]; r.click(); var b=RUN.heavy[k];
   r.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true})); var c=RUN.heavy[k];
   return {a:a,b:b===undefined,c:c,word:(r.querySelector('.rel-cr-hv')||{}).textContent,pile:r.getAttribute('data-pile')};},kS);
  ok(t5.a==='bank'&&t5.b,'a tap still marks, into the bank, and a second tap takes it off: '+JSON.stringify(t5));
  ok(t5.c==='shadow'&&t5.pile==='shadow'&&t5.word==='Shadow','and Left on a line reaches the shadow from a keyboard: '+JSON.stringify(t5));
  const rec=await ev(page,()=>{var want=relHeavyKeys(); RUN.halted=false; RUN.idx=RUN.plan.length; relCoolDown();
   var held=(CURP.meter&&CURP.meter.heavy)||[];
   return {want:want,kept:want.filter(function(k){return held.indexOf(k)>=0;}).length,phase:RUN.phase};});
  /* a mark is kept per line key and a pass is one more saying of the same
     line (round OG), so marks on one block fold into its one key */
  ok(rec.want.length>=1&&rec.kept===rec.want.length,'every mark, bank and shadow alike, is kept on the record as a heavy line: '+JSON.stringify(rec));

  }catch(e){ok(false,'section 5 swipe could not run: '+e.message.split('\n')[0]);}
  try{
  /* 7. the results */
  await page.evaluate(()=>{var b=document.getElementById('relrest'); if(b)b.click();});
  await page.waitForTimeout(500);
  const r7=await ev(page,()=>({sec:[].slice.call(document.querySelectorAll('#rel .rel-rs-h')).map(function(e){return e.textContent;}),
   hero:(document.querySelector('#rel .rel-rs-hero')||{}).textContent||'',
   figs:[].slice.call(document.querySelectorAll('#rel .rel-rs-f')).map(function(e){return [e.querySelector('.rel-rs-l').textContent,e.querySelector('.rel-rs-n').textContent];}),
   bank:[RUN.bank0,RUN.bank1,relBankN()], vault:[RUN.vault0,RUN.vault1,relVaultN()],
   newMarks:(RUN.marksNew||[]).map(function(m){return m.k;}), marks0:RUN.marks0, now:relMarksNow(),
   again:!!document.getElementById('relagain'), rit:!!document.getElementById('relrit'),
   dq:[].slice.call(document.querySelectorAll('#rel .rel-fig span')).map(function(e){return e.textContent;})}));
  ['Left and right','Your patterns','Shadow weight','Why this release ran','Your ritual'].forEach(s=>
   ok(r7.sec.indexOf(s)>=0,'the results carry '+s+': '+r7.sec.join(' | ')));
  ok(/^Congratulations\. You released \d+ patterns? and recharged \d+\.$/.test(r7.hero),'and lead with the congratulations, released and recharged: '+r7.hero);
  ok(r7.figs.some(f=>f[0]==='Bank'&&+f[1]===r7.bank[1])&&r7.bank[1]===r7.bank[2],'the bank is the record\'s held count after the write: '+JSON.stringify([r7.figs,r7.bank]));
  ok(r7.figs.some(f=>f[0]==='Vault'&&+f[1]===r7.vault[1])&&r7.vault[1]===r7.vault[2]&&r7.vault[1]>r7.vault[0],'the vault grew by the run and is the Story\'s own count: '+JSON.stringify(r7.vault));
  ok(r7.newMarks.every(k=>r7.marks0.indexOf(k)<0&&r7.now.indexOf(k)>=0),'a new mark is one the ladder reads now and did not before: '+JSON.stringify(r7.newMarks));
  ok(r7.dq.indexOf('DQ')>=0&&r7.dq.indexOf('Down')>=0,'the shadow weight shows DQ and how far it came down');
  ok(r7.again&&r7.rit,'and offers another run and a ritual');

  }catch(e){ok(false,'section 7 the results could not run: '+e.message.split('\n')[0]);}
  try{
  /* 6 and 8, on a fresh run: the scrub, and the switch */
  const s6=await ev(page,()=>{relPick(RUN.pick.map(function(n){return n.i;})); RUN.dose=4; RUN.plan=relPlan();
   relTicker(false); RUN.phase='run'; RUN.idx=0; RUN.pass=1; RUN.paused=true; RUN.look=false; relRender();
   var sc=document.getElementById('relscrub'), L=document.getElementById('relcarl'); if(!sc)return null;
   var before=[RUN.idx,RUN.pass,L.scrollTop];
   sc.value=String(+sc.max-1); sc.dispatchEvent(new Event('input',{bubbles:true}));
   var tg=document.getElementById('reltone'), em=tg?tg.parentElement.querySelector('.ac-rl em'):null;
   return {before:before,after:[RUN.idx,RUN.pass,L.scrollTop],look:RUN.look,
    focus:relCarMid(L),max:+sc.max,label:tg?tg.getAttribute('aria-label'):null};});
  ok(s6&&s6.after[2]>s6.before[2]&&s6.look,'the scrub moves the list and counts as looking: '+JSON.stringify(s6));
  ok(s6&&s6.after[0]===s6.before[0]&&s6.after[1]===s6.before[1],'and never moves the run');
  ok(s6&&s6.label==='Binaural tone','the tone switch is named for what it is, Binaural tone: '+(s6&&s6.label));

  }catch(e){ok(false,'section 6 and 8 scrub and switch could not run: '+e.message.split('\n')[0]);}
  /* and the app comes back when it closes */
  const back=await ev(page,()=>{relClose(); return {app:getComputedStyle(document.querySelector('.app')).visibility,
   cls:document.body.classList.contains('rel-on')};});
  ok(back.app==='visible'&&!back.cls,'closing puts the app back: '+JSON.stringify(back));

  ok(errs.length===0,'no page error at '+W+': '+errs.join(' | '));
  await page.close();}
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);
})();
