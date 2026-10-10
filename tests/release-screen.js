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
   pointing at ab6666a's source.html) it fails on 1, 2, 3, 4, 5, 6, 7 and 8.

   ROUND QQ, his feedback on those pictures, added at the foot: the sides are
   Left channel and Right channel; the scrub reads Release and Reframe; the
   rows carry numbers only, no Now or Next; End session, Pause and Play, and
   Bookmark are on the running screen at the tap floor; the heavy count
   sentence is gone and the bank pick has its own count, Submit and Recycle,
   acting on RUN.heavy; CQ and Up count up on the run and land exactly on the
   record's CQ after the write, and the results show both. Known bad: run
   against f164f17's own source.html, the build before it, every one of those
   checks fails.

   ROUND QR, "simplify the UI and remember the progression starts with dot dot
   dot that I am and it's the color of the chakra being", added after QQ: every
   release pass is "that I am" and the head's own words; every row is in its
   seat's colour; the channel heading is heard and not drawn; the scrub drops
   its side words; the top word hides on the list; This session moves to the
   plate; and at 1600 by 1000 the readings end above the controls. */
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
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(browser);
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
   &&r3.rel.filter(l=>l.p===0).every(l=>/^I am letting go of believing/.test(l.t)),'and the release side keeps its own: six channels on the head, REL_ENTRY on the passes');
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
  /* ============================================================
     ROUND QQ, his feedback on the round QM pictures. Read off the page on a
     fresh run, the same discipline as above.
     ============================================================ */
  try{
  const q=await ev(page,()=>{relPick(RUN.pick.map(function(n){return n.i;})); RUN.dose=4; RUN.plan=relPlan();
   relTicker(false); RUN.phase='run'; RUN.idx=0; RUN.pass=1; RUN.paused=false; RUN.look=false; RUN.heavy={}; relRender();
   var rel=document.getElementById('rel'), o={};
   o.sides=[].slice.call(document.querySelectorAll('#rel .rel-lr-h')).map(function(e){return e.textContent;});
   o.inout=/inward|outward/i.test(rel.innerText);
   o.scr=[].slice.call(document.querySelectorAll('#rel .rel-scr-h span')).map(function(e){return e.textContent;});
   var i=RUN.plan.findIndex(function(k){return /truth/.test(k);}); RUN.idx=i; RUN.pass=1; relRender();
   o.prRef=(document.querySelector('#relpr span')||{}).textContent;
   o.recharge=/the recharge/.test(rel.innerText);
   RUN.idx=0; RUN.pass=1; relRender();
   /* the number column: a number on every row, and no Now or Next among them */
   var rows=[].slice.call(document.querySelectorAll('#relcarl .rel-cr-i[data-relh]')).filter(function(r){return r.getAttribute('data-relh')!=='end';});
   o.words=rows.map(function(r){return r.querySelector('.rel-cr-n').textContent;}).filter(function(t){return /now|next/i.test(t);});
   o.nums=rows.every(function(r){var p=+r.getAttribute('data-relh').split(':')[1]; return r.querySelector('.rel-cr-n').textContent===String(p+1);});
   var live=document.querySelector('#relcarl .rel-cr-i[aria-current="step"]');
   o.live=live?live.getAttribute('data-relh'):null;
   /* the three controls he named, on the screen and at the tap floor */
   o.ctl=['relpause','relstop','relbook'].map(function(id){var e=document.getElementById(id); if(!e)return {id:id};
    var r=e.getBoundingClientRect(); return {id:id,t:e.textContent.trim(),w:r.width,h:r.height,
     seen:r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth};});
   return o;});
  ok(q.sides&&q.sides.join('|')==='Left channel|Right channel'&&!q.inout,'the two sides are Left channel and Right channel, and inward and outward are gone: '+JSON.stringify(q.sides));
  ok(q.scr&&q.scr.join('|')==='Release|Reframe'&&q.prRef==='Reframe'&&!q.recharge,'the scrub reads Release and Reframe, and nothing says "the recharge": '+JSON.stringify([q.scr,q.prRef]));
  ok(q.words&&q.words.length===0&&q.nums,'every row carries its number, and no row reads Now or Next: '+JSON.stringify(q.words));
  ok(q.live==='0:1','the live row is still marked for a screen reader, aria-current on '+q.live);
  const cmap={}; (q.ctl||[]).forEach(c=>cmap[c.id]=c);
  ok(cmap.relstop&&cmap.relstop.t==='End session'&&cmap.relpause&&cmap.relpause.t==='Pause'&&cmap.relbook&&cmap.relbook.t==='Bookmark',
   'End session, Pause and Bookmark are on the running screen in his words: '+JSON.stringify(q.ctl&&q.ctl.map(c=>c.t)));
  ok((q.ctl||[]).length===3&&q.ctl.every(c=>c.w>=44&&c.h>=44&&c.seen),'each is at least 44 by 44 and inside the screen: '+JSON.stringify(q.ctl));
  await page.click('#relpause'); await page.waitForTimeout(120);
  const play=await ev(page,()=>({t:(document.getElementById('relpause')||{}).textContent,p:RUN.paused}));
  ok(play.p===true&&/^Play$/.test((play.t||'').trim()),'Pause turns to Play while the run is held: '+JSON.stringify(play));
  await page.click('#relpause'); await page.waitForTimeout(120);
  await ev(page,()=>{relHush(); RUN.paused=true; relRender();});

  /* the bank pick: a count, Submit and Recycle, on RUN.heavy itself */
  await page.waitForTimeout(400);
  const kB=await (async()=>{const b=await page.evaluate(()=>{var r=document.querySelector('#relcarl .rel-cr-i[data-d="1"]'); if(!r)return null;
    var q=r.getBoundingClientRect(); return {k:r.getAttribute('data-relh'),x:q.left+q.width/2,y:q.top+q.height/2};});
   if(!b)return null;
   await page.mouse.move(b.x,b.y); await page.mouse.down();
   for(let s=1;s<=10;s++){await page.mouse.move(b.x+110*s/10,b.y); await page.waitForTimeout(16);}
   await page.mouse.up(); await page.waitForTimeout(350); return b.k;})();
  const bk=await ev(page,k=>{var o={k:k,h1:Object.assign({},RUN.heavy)};
   var n=function(){return (document.getElementById('relbkn')||{}).textContent;};
   o.n1=n(); o.heavyWords=/marked heavy|kept in your bank|weighted in your shadow/.test(document.getElementById('rel').innerText);
   /* a second pick by tap and a shadow mark beside them */
   var rows=[].slice.call(document.querySelectorAll('#relcarl .rel-cr-i[data-relh]')).filter(function(r){return r.getAttribute('data-relh')!==k&&r.getAttribute('data-relh')!=='end';});
   rows[0].click(); relMarkSet(rows[1].getAttribute('data-relh'),'shadow',rows[1]);
   o.n2=n(); o.sub0=document.getElementById('relbksub').disabled;
   document.getElementById('relbksub').click();
   o.h3=Object.assign({},RUN.heavy); o.n3=n(); o.sub1=document.getElementById('relbksub').disabled;
   o.word=(document.querySelector('#relcarl [data-relh="'+k+'"] .rel-cr-hv')||{}).textContent;
   /* a submitted line stays put under a tap, and Recycle leaves it */
   document.querySelector('#relcarl [data-relh="'+k+'"]').click(); o.h4=RUN.heavy[k];
   rows[2].click(); o.n5=n();
   document.getElementById('relbkrec').click(); o.h6=Object.assign({},RUN.heavy); o.n6=n();
   o.r2=rows[2].getAttribute('aria-pressed');
   var t=document.getElementById('relbksub'), r=t.getBoundingClientRect(); o.tap=[r.width,r.height];
   return o;},kB);
  ok(bk.h1&&bk.h1[kB]==='bank'&&bk.n1==='1','a swipe right picks the line, and the bank count reads 1: '+JSON.stringify([bk.h1,bk.n1]));
  /* read on its own, with one mark in each pile, so a build that cannot reach
     the bank pick above still answers this one */
  const hw=await ev(page,()=>{var rows=[].slice.call(document.querySelectorAll('#relcarl .rel-cr-i[data-relh]')).filter(function(r){return r.getAttribute('data-relh')!=='end';});
   var keep=Object.assign({},RUN.heavy), a=rows[rows.length-1], b=rows[rows.length-2];
   relMarkSet(a.getAttribute('data-relh'),'bank',a); relMarkSet(b.getAttribute('data-relh'),'shadow',b);
   var t=document.getElementById('rel').innerText;
   RUN.heavy=keep; if(typeof relMarksRedraw==='function')relMarksRedraw(); else relRender();
   return /marked heavy|kept in your bank|weighted in your shadow/.test(t);});
  ok(hw===false,'the sentence counting lines marked heavy is gone from the screen, with a mark in each pile: '+JSON.stringify(hw));
  ok(bk.n2==='2'&&bk.sub0===false,'a tap picks a second, the shadow mark is not counted, and Submit is live: '+bk.n2);
  ok(bk.h3&&Object.keys(bk.h3).filter(k=>bk.h3[k]==='kept').length===2&&Object.keys(bk.h3).filter(k=>bk.h3[k]==='shadow').length===1
   &&bk.n3==='–'&&bk.sub1===true&&bk.word==='Banked','Submit moves both picks into the bank, leaves the shadow mark, and the count empties: '+JSON.stringify([bk.h3,bk.n3,bk.word]));
  ok(bk.h4==='kept','a submitted line is not taken off by a tap: '+bk.h4);
  ok(bk.n5==='1'&&Object.keys(bk.h6).filter(k=>bk.h6[k]==='kept').length===2&&Object.keys(bk.h6).filter(k=>bk.h6[k]==='bank').length===0
   &&bk.n6==='–'&&bk.r2==='false','Recycle takes back the one unsubmitted pick, unmarked, and leaves what was submitted: '+JSON.stringify([bk.n5,bk.h6,bk.n6]));
  ok(bk.tap&&bk.tap[0]>=44&&bk.tap[1]>=44,'Submit is at the tap floor: '+JSON.stringify(bk.tap));

  /* bookmark: the line being said, on the row, off again, and on the results */
  const bm=await ev(page,()=>{var o={}; RUN.look=false; relRender();
   var k=RUN.idx+':'+RUN.pass;
   document.getElementById('relbook').click(); o.on=!!RUN.books[k]; o.row=!!document.querySelector('#relcarl [data-relh="'+k+'"][data-book]');
   o.pressed=document.getElementById('relbook').getAttribute('aria-pressed');
   document.getElementById('relbook').click(); o.off=!RUN.books[k]&&!document.querySelector('#relcarl [data-relh="'+k+'"][data-book]');
   document.getElementById('relbook').click();
   o.u0=CURP.meter.unique.length; o.c0=compute().DQ;
   return o;});
  ok(bm.on&&bm.row&&bm.pressed==='true','Bookmark marks the line being said, on its row: '+JSON.stringify(bm));
  ok(bm.off,'and a second press takes it off');

  /* CQ: not read yet with no law answered, then counted up with them answered,
     landing on the number the record reads after the write */
  const cq0=await ev(page,()=>{RUN.proj=null; relRender();
   return {fig:(document.querySelector('#relcq b')||{}).textContent,up:!!document.getElementById('relcqup'),
    mean:(document.getElementById('relfigmean')||{}).textContent,answered:compute().answered};});
  ok(cq0.answered===0&&cq0.fig==='–'&&!cq0.up&&/CQ is your coherence number/.test(cq0.mean||'')&&/not read yet/.test(cq0.mean||''),
   'with no law answered CQ reads a dash and says it is not read yet: '+JSON.stringify(cq0));
  const cq=await ev(page,()=>{SI.forEach(function(l){CURP.laws[l.nm]=5; S.law[l.nm]=5;}); compute();
   RUN.proj=null; RUN.idx=Math.min(5,RUN.plan.length-1); RUN.pass=2; relRender();
   var o={proj:RUN.proj&&RUN.proj.cq, cq0:compute().CQ, work:JSON.stringify(CURP.work||{})};
   o.fig=+(document.querySelector('#relcq b')||{}).textContent; o.up=+(document.querySelector('#relcqup b')||{}).textContent;
   o.mean=(document.getElementById('relfigmean')||{}).textContent;
   var j=RUN.idx; o.want=o.proj?o.proj[j]+(RUN.pass/RUN.dose)*(o.proj[j+1]-o.proj[j]):null;
   RUN.halted=false; RUN.idx=RUN.plan.length; relCoolDown();
   o.after=compute().CQ; o.end=o.proj?o.proj[o.proj.length-1]:null; o.rec0=RUN.cq0;
   var b=document.getElementById('relrest'); if(b)b.click();
   o.res=[].slice.call(document.querySelectorAll('#relrscq .rel-fig b')).map(function(e){return +e.textContent;});
   o.sec=[].slice.call(document.querySelectorAll('#rel .rel-rs-h')).map(function(e){return e.textContent;});
   o.books=(document.getElementById('relbooks')||{}).textContent;
   return o;});
  ok(cq.proj&&cq.proj.length>1&&cq.proj[cq.proj.length-1]>cq.proj[0],'with laws answered the run projects CQ rising: '+JSON.stringify(cq.proj&&[cq.proj[0],cq.proj[cq.proj.length-1]]));
  ok(cq.want!=null&&Math.abs(cq.fig-cq.want)<0.006&&Math.abs(cq.up-(cq.want-cq.proj[0]))<0.006,'the row prints CQ and Up where the walker is: '+JSON.stringify([cq.fig,cq.up,cq.want]));
  ok(/Up is how far/.test(cq.mean||'')&&/DQ is your shadow reading/.test(cq.mean||''),'and says what CQ, Up, DQ and Down are, in the same place');
  ok(cq.end!=null&&Math.abs(cq.end-cq.after)<1e-9,'the projection lands exactly on the CQ the record reads after the write: '+JSON.stringify([cq.end,cq.after]));
  ok(cq.sec.indexOf('Your CQ')>=0&&Math.abs(cq.res[0]-cq.after)<0.006&&Math.abs(cq.res[1]-(cq.after-cq.rec0))<0.006&&cq.res[1]>0,
   'the results show CQ after and how far it came up: '+JSON.stringify([cq.res,cq.after,cq.rec0]));
  ok(cq.sec.indexOf('Bookmarked')>=0&&/not saved to your record/.test(cq.books||''),'the bookmarked line is on the results, and they say it is not saved to the record: '+JSON.stringify(cq.books));
  }catch(e){ok(false,'round QQ could not run: '+e.message.split('\n')[0]);}
  /* ============================================================
     ROUND QR, 3 October. His words over a picture of the run: "this version
     just simplify the UI and remember the progression starts with dot dot dot
     that I am and it's the color of the chakra being." Read off the page on a
     fresh run. Known bad: run against 0634a16's own source.html, the build
     before it, every check in this block fails.
     ============================================================ */
  try{
  const qr=await ev(page,()=>{relPick(RUN.pick.map(function(n){return n.i;})); RUN.dose=4; RUN.plan=relPlan();
   relTicker(false); RUN.phase='run'; RUN.idx=0; RUN.pass=2; RUN.paused=true; RUN.look=false; RUN.heavy={}; relRender();
   var o={passes:[]};
   /* every release pass is "that I am" and the head's own first sentence */
   (RUN.plan||[]).forEach(function(k,i){var at=relAt(i); if(!at||at.ch[2]!=='limit')return;
    var h=relStepAt(at,0).text, tail=h.indexOf(C3_STEM)===0?h.slice(C3_STEM.length).split(/\.\s/)[0].replace(/\.$/,'').trim():null;
    for(var p=1;p<RUN.dose;p++)o.passes.push({t:relStepAt(at,p).text,want:tail?'that I am '+tail+'.':null});});
   var tl=document.querySelector('#rel .rel-cr-i.now .rel-tail');
   o.liveTail=tl?tl.textContent:null;
   o.liveDot=tl?getComputedStyle(tl,'::before').content:null;
   o.liveLine=(document.querySelector('#rel .rel-line')||{}).textContent||'';
   o.prompt=(document.querySelector('#relpr b')||{}).textContent||'';
   /* every row in its seat's colour, the next address in its own */
   var rows=[].slice.call(document.querySelectorAll('#relcarl .rel-cr-i[data-relh]')).filter(function(r){return r.getAttribute('data-relh')!=='end';});
   o.cols=rows.map(function(r){var at=relAt(+r.getAttribute('data-relh').split(':')[0]);
    return {got:r.style.getPropertyValue('--c'),want:at&&at.n?seatCol(at.n.b):null};});
   o.cBad=o.cols.filter(function(c){return !c.want||c.got!==c.want;}).length;
   var now=document.querySelector('#relcarl .rel-cr-i.now');
   o.nowCol=now?getComputedStyle(now).color:null; o.inkCol=getComputedStyle(document.querySelector('#relpr b')).color;
   /* the channel heading is heard and not drawn, and says no pole */
   o.heads=[].slice.call(document.querySelectorAll('#relcarl .rel-cr-h')).filter(function(h){return /channel/.test(h.textContent);})
    .map(function(h){var r=h.getBoundingClientRect(); return {t:h.textContent,w:r.width,h:r.height};});
   /* no side word under the scrub, the top word hidden on the list */
   o.scrWords=((document.querySelector('#rel .rel-scr-sg')||{}).textContent||'').trim();
   var wd=document.querySelector('#rel .rel-word'); o.word=wd?getComputedStyle(wd).visibility:null;
   /* the row carries what moves; the session's size is on the plate */
   o.figs=[].slice.call(document.querySelectorAll('#relft .rel-figs .rel-fig span')).map(function(e){return e.textContent;});
   o.plate=(document.querySelector('#relhd .rel-ct')||{}).textContent||'';
   var fg=document.querySelector('#relft .rel-figs'), ft=document.getElementById('relfoot');
   o.figB=fg?fg.getBoundingClientRect().bottom:null; o.footT=ft?ft.getBoundingClientRect().top:null;
   return o;});
  const bad=qr.passes.filter(p=>!p.want||p.t!==p.want);
  ok(qr.passes.length>0&&bad.length===0,'every release pass reads "that I am" and the head\'s own words, '+qr.passes.length+' checked'
   +(bad.length?': '+bad.slice(0,3).map(p=>p.t+' (want '+p.want+')').join(' | '):', first "'+(qr.passes[0]||{}).t+'"'));
  ok(qr.passes.every(p=>!/^I (let go of|give up|forgive myself for) /.test(p.t)),'and none says I let go of, I give up or I forgive myself for');
  ok(/^that I am /.test(qr.liveTail||'')&&/…/.test(qr.liveDot||'')&&qr.liveLine===qr.liveTail&&/feeling$/.test(qr.prompt),
   'on screen the live pass continues the pinned prompt, "... that I am", and is said as shown: '+JSON.stringify([qr.prompt,qr.liveDot,qr.liveTail]));
  ok(qr.cols.length>0&&qr.cBad===0,'every row of the list is set in its own seat\'s colour, '+qr.cols.length+' rows, '+qr.cBad+' wrong: '+JSON.stringify(qr.cols.slice(0,2)));
  ok(qr.nowCol&&qr.nowCol!==qr.inkCol,'and the live line is not the plain ink of the prompt: '+JSON.stringify([qr.nowCol,qr.inkCol]));
  ok(qr.heads.length>0&&qr.heads.every(h=>h.w<=1&&h.h<=1&&/^(Release|Reframe), (left|right) channel$/.test(h.t)),
   'the channel heading is for a screen reader only and names no pole: '+JSON.stringify(qr.heads.slice(0,2)));
  ok(qr.scrWords==='','the scrub carries no left or right under its segments: '+JSON.stringify(qr.scrWords));
  ok(qr.word==='hidden','the top word Release is hidden on the list, where the rail and the prompt say it: '+qr.word);
  ok(qr.figs.indexOf('This session')<0&&qr.figs[0]==='Remaining'&&qr.figs.indexOf('DQ')>=0&&/\d+ lines this session$/.test(qr.plate),
   'the row keeps what moves and the session\'s size is on the plate: '+JSON.stringify([qr.figs,qr.plate]));
  if(W===1600)ok(qr.figB!=null&&qr.footT!=null&&qr.figB<=qr.footT,'at 1600 by 1000 the readings end above the controls: '+qr.figB+' against '+qr.footT);
  }catch(e){ok(false,'round QR could not run: '+e.message.split('\n')[0]);}
  /* P0: a refused release save must not manufacture server evidence,
     ritual completion, or a misleading early-stop notice. */
  const saveFault=await ev(page,()=>{
   var ids=(RUN.pick||[]).slice(0,1).map(function(n){return n.i;});
   if(!ids.length)return {error:'no selected address'};
   relPick(ids);
   RUN.dose=4; RUN.plan=relPlan(); RUN.phase='run'; RUN.idx=Math.min(1,RUN.plan.length-1);
   RUN.pass=0; RUN.paused=true; RUN.halted=true; RUN.reach=null; RUN.done=false;
   RUN.rerun=false; RUN.open=true; RUN.first=true;
   var ps=pSaveSnap, cp=authFunnelCheckpoint, rit=ritRelDone, calls={checkpoint:0,ritual:0};
   var thrown=null, out=null;
   pSaveSnap=function(){return false;};
   authFunnelCheckpoint=function(){calls.checkpoint++;return Promise.resolve({ok:true});};
   ritRelDone=function(){calls.ritual++;return 1;};
   try{
    relCoolDown();
    out={saved:RUN.saved, ask:RUN.ask, ritualDone:RUN.ritDone, calls:calls,
     status:(document.getElementById('status')||{}).textContent||'', halted:RUN.halted};
   }catch(e){thrown=String(e&&e.message||e);}
   finally{pSaveSnap=ps;authFunnelCheckpoint=cp;ritRelDone=rit;relTicker(false);}
   return thrown?{error:thrown}:out;
  });
  ok(!saveFault.error&&saveFault.saved===false,'a refused save stays marked unsaved: '+JSON.stringify(saveFault));
  ok(!saveFault.error&&saveFault.calls.checkpoint===0&&saveFault.calls.ritual===0&&saveFault.ritualDone===0&&saveFault.ask===false,
   'failed release cannot checkpoint, finish a ritual, or ask for an answer: '+JSON.stringify(saveFault));
  ok(!saveFault.error&&/would not save/i.test(saveFault.status),'stopping an unsaved run does not overwrite the save failure notice: '+JSON.stringify(saveFault.status));

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
