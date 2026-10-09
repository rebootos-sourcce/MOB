/* ============================================================
   THE FIRST RUN, WALKED END TO END, AT BOTH WIDTHS. F13.

   tests/journey.js holds the journey record headlessly, against the engine.
   This file walks it in a real Chromium, through the real door (ui/login.js,
   Guest), the way a stranger meets it, at 1600 by 1000 and at 390 by 844, and
   reloads the page part way through on purpose, because a first run a person
   loses to a reload is a first run that did not work.

   WHAT A FINISHED FIRST RUN IS, and each line below is asserted:

     1  THE RECORD IS KEPT. From the first card the person's own record
        carries a journey: where they stand (the walk), and a log of what they
        did, with no free text in it.
     2  A RELOAD RESUMES IN THE RIGHT PLACE. Reloaded at the starting point,
        at the story with words half typed, at the mirror with answers given,
        at the card before the release, after handing off to a release that
        never ran, and on the end card, the person is put back exactly there
        with what they had given, and no typed word is lost.
     3  THE GIFT COUNTS AND SHOWS. The gift is a counter of a hundred (round
        OX, ruling 3). It is issued when a starting point is picked, the card
        before the release says what is left of it and what the release
        opens, and after the release the counter has moved by exactly the new
        ground opened, on the screen and on the record.
     4  THE CLAIM PACKAGES WHAT THE PERSON MADE. After the first release the
        end card shows what was made, the story, what was read, what was
        released, the answer to What changed and the gift, and every figure on
        it is the claim packet's (journeyClaim), which carries no name and no
        birth data. Go in ends the first run and it never opens again.
     5  NOTHING IS BROKEN ON THE WAY. No script error, no console error from
        the product, no placeholder word on any card, and every control on the
        end card does something and is at least 44 by 44.

   The walk keeps going when a piece is missing, so on a build without the
   journey every missing piece prints its own FAIL line rather than the first
   one hiding the rest.

       NODE_PATH=/opt/node22/lib/node_modules node tests/journey2.js

   Run from the repository root. ATUNED_FILE points it at another build, which
   is how its mutants are run. Exits non zero on any failure.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html');
const WIDTHS=(process.env.JY2_WIDTHS||'1600x1000,390x844').split(',').map(s=>s.split('x').map(Number));
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const J=x=>JSON.stringify(x);
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}};
/* the release clock, shrunk the way tests/onboarding2.js shrinks it, so the
   run goes through relStep and relCoolDown in order in seconds */
const SHRINK=`REL_WORD_S=0.0004;REL_GAP_S=0.001;REL_HEAD_S=0;REL_FRAME_S=0;`;
/* the sentence tests/onboarding2.js already checks against the engine: it
   reads at the Heart and the Solar seats, more than three places */
const STORY='I felt tight in my chest when my boss yelled at me and I could not breathe.';
const HALF='I felt tight in my chest when my boss';
/* words that mean a card was shipped unfinished, or a value that never arrived */
/* JY2_SHOTS=dir saves a picture of the card before the release and of the
   end card at each width, for a person to look at. Off by default. */
const SHOTS=process.env.JY2_SHOTS||'';
const PLACEHOLDER=/\b(TODO|TBD|FIXME|lorem|ipsum|placeholder|undefined|NaN|null)\b|\[object/i;

(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(browser);

for(const [W,H] of WIDTHS){
 const tag=W+': ';
 console.log('\n=== the first run, end to end, at '+W+' by '+H+' ===');
 const ctx=await browser.newContext({viewport:{width:W,height:H}});
 /* A GATE NEVER REACHES THE REAL SERVER. The first visit funnel calls the
    Worker, and on a runner with a network that call went out for real: from a
    file page its origin is null, which the Worker refuses by design, so the
    browser logged a CORS error that is the test's and not the product's, and
    every run would also have made a real session in the production store.
    The Worker's host is cut here, and what the page does when its server is
    unreachable is exactly what the first run is meant to survive. */
 await ctx.route(/workers\.dev/,r=>r.abort('failed'));
 const page=await ctx.newPage();
 const errs=[], cerrs=[];
 page.on('pageerror',e=>errs.push(e.message));
 /* a console error from the product is a failure. A resource the file:// page
    cannot reach (the first visit funnel's server, which a gate never has) is
    the network's and is reported, not failed: the funnel is not this file's. */
 page.on('console',m=>{if(m.type()==='error'){const t=m.text();
  if(/Failed to load resource|net::ERR_|ERR_FILE_NOT_FOUND|Failed to fetch/i.test(t))return; cerrs.push(t);}});
 const st=()=>page.evaluate(()=>({open:!!(typeof OB!=='undefined'&&OB.open),step:(typeof OB!=='undefined')?OB.step:null,
  h:(document.querySelector('#ob .ob-h')||{}).textContent||'',
  card:(document.querySelector('#ob .ob-card')||{}).innerText||''}));
 const rec=()=>page.evaluate(()=>{const j=(typeof CURP!=='undefined'&&CURP&&CURP.journey)||null;
  return j?JSON.parse(JSON.stringify(j)):null;});
 const logged=(j,t)=>!!(j&&Array.isArray(j.log)&&j.log.some(e=>e.type===t));
 const click=async(sel)=>{try{await page.click(sel,{timeout:4000}); await page.waitForTimeout(90); return true;}
  catch(e){return page.evaluate(s=>{const b=document.querySelector(s); if(b){b.click(); return true;} return false;},sel);}};
 const shot=async(name)=>{ if(!SHOTS)return; try{ await page.waitForTimeout(2600); await page.screenshot({path:path.join(SHOTS,W+'-'+name+'.png')}); }catch(e){} };
 const placeholders=async(where)=>{const s=await st(); ok(!PLACEHOLDER.test(s.card),tag+where+' carries no placeholder word: '
  +((s.card.match(PLACEHOLDER)||[''])[0]));};
 /* THROUGH THE DOOR, as a guest, which is the request-free way in. A reload
    meets the door again, so every reload comes back through it. */
 const door=async()=>{await booted(page);
  const g=await page.$('#loginb-skip'); if(g){await click('#loginb-skip'); await page.waitForTimeout(350);}};
 const reload=async()=>{await page.waitForTimeout(250); await page.reload({waitUntil:'load'}); await door();};
 /* FROM WHEREVER THE SHEET IS, ON TO A STEP, the way a person would press it.
    Used after a reload that did not resume, so the walk can go on and every
    later piece is still asserted. */
 const driveTo=async(to)=>{
  for(let guard=0;guard<12;guard++){
   let s=await st();
   if(!s.open){await page.evaluate(()=>{if(typeof obOpen==='function')obOpen(false);}); await page.waitForTimeout(150); s=await st();}
   if(s.step>=to)return s;
   if(s.step===0||s.step===2)await click('[data-ob="next"]');
   else if(s.step===1)await click('[data-obpick="0"]');
   else if(s.step===3)await click('[data-obfeel="1"]');
   else if(s.step===4)await click('[data-obplace="3"]');
   else if(s.step===5){await page.fill('#obtext',STORY); await page.dispatchEvent('#obtext','input'); await click('#obdone');}
   else if(s.step===6){await page.evaluate(()=>{let b;
     while((b=document.querySelector('[data-obmore]')))b.click();
     document.querySelectorAll('[data-obans="yes"][aria-pressed="false"]').forEach(x=>x.click());});
    await click('[data-ob="mirrorcommit"]');}
   else return s;}
  return st();};

 await page.goto(FILE,{waitUntil:'load'}); await door();

 /* ---- 1. arrive: the record starts ---- */
 let s=await st();
 ok(s.open&&s.step===0,tag+'a fresh guest meets the first run on its first card, step '+s.step);
 let j=await rec();
 ok(!!j&&j.v===1,tag+'the person\'s record carries a journey from the first card: '+J(j&&{v:j.v}));
 ok(logged(j,'tutorial_started'),tag+'and its log says the first run started');
 ok(!!(j&&j.walk&&j.walk.step==='arrive'),tag+'and the walk stands at arrive: '+J(j&&j.walk&&j.walk.step));
 await placeholders('arrive');

 /* ---- 2. ask, and a reload there ---- */
 await click('[data-ob="next"]'); s=await st();
 ok(s.step===1,tag+'next is the starting point, step '+s.step);
 await reload(); s=await st();
 ok(s.open&&s.step===1,tag+'a reload on the starting point resumes on it, not at the start: open '+s.open+' step '+s.step);
 s=await driveTo(1);

 /* ---- 3. the pick issues the gift ---- */
 await click('[data-obpick="0"]'); s=await st();
 ok(s.step===2,tag+'picking a starting point moves on, step '+s.step);
 j=await rec();
 const gp=await page.evaluate(()=>(typeof OB_STARTS!=='undefined'&&OB_STARTS[0])?OB_STARTS[0].k:null);
 ok(!!(j&&j.log.some(e=>e.type==='ground_selected'&&e.ref===gp)),tag+'the pick is on the log by its key, '+gp);
 const GIFT=await page.evaluate(()=>typeof GIFT_N==='number'?GIFT_N:null);
 ok(!!(j&&j.gift&&j.gift.granted===GIFT&&j.gift.used===0&&j.gift.remaining===GIFT&&j.gift.src==='app'),
  tag+'the gift is issued at the pick, a counter of '+GIFT+' with nothing used: '+J(j&&j.gift));
 ok(logged(j,'starter_gift_issued'),tag+'and the issue is on the log');

 /* ---- 4. settle, feel, body, and a reload on the story ---- */
 await click('[data-ob="next"]'); await click('[data-obfeel="1"]'); await click('[data-obplace="3"]');
 s=await st(); ok(s.step===5,tag+'feel and body lead to the story, step '+s.step);
 await page.fill('#obtext',''); await page.type('#obtext',HALF,{delay:4});
 await page.waitForTimeout(1100);
 j=await rec();
 ok(!!(j&&j.walk&&j.walk.step==='story'&&j.walk.text===HALF),tag+'the half typed story is kept on the walk as it is typed: '+J(j&&j.walk&&j.walk.text));
 await reload(); s=await st();
 const back=await page.evaluate(()=>({t:(document.getElementById('obtext')||{}).value,
  pick:typeof OB!=='undefined'?OB.pick:null, feel:typeof OB!=='undefined'?OB.feel:null, place:typeof OB!=='undefined'?OB.place:null,
  done:!!(document.getElementById('obdone')&&!document.getElementById('obdone').disabled)}));
 ok(s.open&&s.step===5,tag+'a reload on the story resumes on the story: open '+s.open+' step '+s.step);
 ok(back.t===HALF,tag+'and not one typed word is lost: '+J(back.t));
 ok(back.pick===0&&back.feel===1&&back.place===3,tag+'and the three taps are kept: '+J(back));
 ok(back.done,tag+'and Done is ready, because the words in the box are enough');
 s=await driveTo(5);
 await page.fill('#obtext',STORY); await page.dispatchEvent('#obtext','input');
 await click('#obdone'); s=await st();
 ok(s.step===6,tag+'Done reads the story into the mirror, step '+s.step);
 j=await rec();
 ok(logged(j,'story_submitted')&&logged(j,'story_signal_generated'),tag+'the story and its reading are on the log');
 ok(!!(j&&j.log.every(e=>J(e).indexOf('chest')<0)),tag+'and no word of the story is in the log');

 /* ---- 5. the mirror's answers, and a reload there ---- */
 await page.evaluate(()=>{let b; while((b=document.querySelector('[data-obmore]')))b.click();});
 await page.waitForTimeout(80);
 const rows=await page.evaluate(()=>[...document.querySelectorAll('[data-obrow]')].map(r=>+r.getAttribute('data-obrow')));
 for(let i=0;i<rows.length;i++){
  const v=i===rows.length-1&&rows.length>4?'no':'yes';
  await page.evaluate(([n,v])=>{const b=document.querySelector('[data-obans="'+v+'"][data-obi="'+n+'"]'); if(b)b.click();},[rows[i],v]);}
 await page.waitForTimeout(150);
 const ans0=await page.evaluate(()=>typeof OB!=='undefined'?JSON.stringify(OB.ans):'');
 ok(rows.length>3&&ans0.length>2,tag+'the mirror shows the places it read and each is answered, '+rows.length+' rows');
 await page.waitForTimeout(400);
 await reload(); s=await st();
 const ans1=await page.evaluate(()=>typeof OB!=='undefined'?JSON.stringify(OB.ans):'');
 ok(s.open&&s.step===6,tag+'a reload on the mirror resumes on the mirror: open '+s.open+' step '+s.step);
 ok(ans1===ans0,tag+'with every answer kept: '+ans1.slice(0,80));
 ok(/tight in my chest/.test(s.card),tag+'and the story it read is still the one quoted');
 if(s.step!==6||ans1!==ans0){ s=await driveTo(6);
  await page.evaluate(a=>{const A=JSON.parse(a||'{}'); Object.keys(A).forEach(n=>{
   const b=document.querySelector('[data-obans="'+A[n]+'"][data-obi="'+n+'"]'); if(b&&b.getAttribute('aria-pressed')!=='true')b.click();});},ans0);}
 await placeholders('mirror'); await shot('mirror');

 /* ---- 6. commit, the card before the release, and the gift on it ---- */
 await click('[data-ob="mirrorcommit"]'); s=await st();
 ok(s.step===7,tag+'Commit leads to the card before the release, step '+s.step);
 const plan=await page.evaluate(()=>(typeof OB!=='undefined'&&OB.plan)?JSON.parse(JSON.stringify(OB.plan)):null);
 const size=await page.evaluate(()=>(typeof ONB_MINI_ADDRS==='number'&&typeof RUN_MIN==='number')?ONB_MINI_ADDRS*RUN_MIN:null);
 ok(!!(plan&&plan.ok&&plan.lines===size),tag+'the first release is the ruled '+size+' lines: '+J(plan&&{l:plan.lines,a:plan.addrs}));
 ok(new RegExp('You have '+GIFT+' patterns left of the '+GIFT+' you were given').test(s.card),
  tag+'the card says what is left of the gift, read off the counter: '+((s.card.match(/You have [^.]*given/)||['none'])[0]));
 ok(!!plan&&new RegExp('This release opens '+plan.lines+' of them').test(s.card),tag+'and how many of them this release opens');
 ok(/A pattern is one line you have not said before/.test(s.card),tag+'and what a pattern is, beside the word (round PO)');
 j=await rec();
 ok(logged(j,'story_signal_confirmed'),tag+'the yes answers are on the log as confirmed');
 ok(!!(j&&j.walk&&j.walk.step==='next'&&j.walk.text===null&&j.walk.t),tag+'the walk stands at the card before the release, holding the entry and no draft: '+J(j&&j.walk&&{s:j.walk.step,t:!!j.walk.t,x:j.walk.text}));
 await placeholders('the card before the release'); await shot('next');
 await reload(); s=await st();
 const plan2=await page.evaluate(()=>(typeof OB!=='undefined'&&OB.plan)?JSON.parse(JSON.stringify(OB.plan)):null);
 ok(s.open&&s.step===7,tag+'a reload there resumes there: open '+s.open+' step '+s.step);
 ok(!!(plan&&plan2&&J(plan2.keys)===J(plan.keys)),tag+'with the same plan, line for line');
 if(s.step!==7)s=await driveTo(7);

 /* ---- 7. the hand off, and a reload before the release ran ---- */
 await click('[data-ob="release"]'); await page.waitForTimeout(200);
 let rel=await page.evaluate(()=>({open:!!(typeof RUN!=='undefined'&&RUN.open),ob:!!(typeof OB!=='undefined'&&OB.open),
  q:(typeof RUN!=='undefined'&&RUN.queue||[]).map(n=>n.i)}));
 ok(rel.open&&!rel.ob,tag+'Begin opens the release card and the sheet steps aside');
 j=await rec();
 ok(!!(j&&j.walk&&j.walk.step==='release'&&j.walk.base&&typeof j.walk.base.lines==='number'),tag+'the walk records the hand off and what the meter held at it: '+J(j&&j.walk&&j.walk.base));
 ok(logged(j,'first_release_started'),tag+'and the log says the first release started');
 const onb0=await page.evaluate(()=>!!(CURP&&CURP.ui&&CURP.ui.onboarded));
 ok(!onb0,tag+'and the first run is not marked finished while the release is still ahead');
 await reload(); s=await st();
 ok(s.open&&s.step===7,tag+'a reload before the release ran puts the person back on the card that offers it: open '+s.open+' step '+s.step);
 if(s.open&&s.step===7){ await click('[data-ob="release"]'); await page.waitForTimeout(200); }
 else if(plan&&plan.ok){ await page.evaluate(ids=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();
  if(typeof relPick==='function')relPick(ids,null);},plan.addrs); await page.waitForTimeout(200); }

 /* ---- 8. the release, run to its end, and What changed ---- */
 await page.evaluate(SHRINK);
 await page.evaluate(()=>{const d=document.getElementById('reldose'); if(d){d.value='1'; d.dispatchEvent(new Event('change'));}});
 await click('#relgo');
 await page.waitForFunction(()=>typeof RUN!=='undefined'&&RUN.phase==='done'&&RUN.cool>=COOLING.length,null,{timeout:90000}).catch(()=>{});
 rel=await page.evaluate(()=>({ph:RUN.phase,lines:(CURP.meter&&CURP.meter.unique||[]).length}));
 ok(rel.ph==='done'&&rel.lines===size,tag+'the release ran to its end and opened '+rel.lines+' lines of new ground');
 await page.evaluate(()=>{const r=document.getElementById('relrest'); if(r)r.click();}); await page.waitForTimeout(150);
 const said=await page.evaluate(()=>{const b=document.querySelector('[data-relsaid="something_moved"]'); if(b){b.click(); return true;} return false;});
 ok(said,tag+'What changed is asked, and answered');
 await page.waitForTimeout(150);
 await click('#relclose'); await page.waitForTimeout(500);

 /* ---- 9. the end card: what was made, the gift moved, the claim ---- */
 /* the end card's step is read off the sheet, never typed: it is the end
    station's place in the journey's own list */
 const END=await page.evaluate(()=>typeof OB_END==='number'?OB_END:-1);
 s=await st();
 ok(s.open&&s.step===END,tag+'Done on the release brings the person to the end of the first run: open '+s.open+' step '+s.step);
 const made=await page.evaluate(()=>{
  if(typeof journeyClaim!=='function'||typeof journeyMade!=='function')return null;
  const c=journeyClaim(CURP); if(!c.ok)return {err:c.errs};
  const m=journeyMade(c.claim.body);
  return {m:m, keys:Object.keys(c.claim.body), txt:JSON.stringify(c.claim), name:CURP.name,
   left:meterBudget(CURP).allow.left};});
 ok(!!(made&&made.m&&made.m.ok),tag+'the claim packet reads what the first release made: '+J(made&&(made.err||made.m&&made.m.why)));
 const m=made&&made.m&&made.m.ok?made.m:null;
 ok(/Here is what you made/.test(s.card),tag+'the end card says what it is: '+J(s.h));
 ok(/tight in my chest/.test(s.card),tag+'it quotes the story the person wrote');
 ok(!!m&&new RegExp('\\b'+m.lines+' lines at '+m.addrs.length+' places\\b').test(s.card),tag+'it says what was released, read off the packet: '+J(m&&{l:m.lines,a:m.addrs.length}));
 ok(!!m&&m.entry&&new RegExp('You said yes to '+m.entry.yes+'\\b').test(s.card),tag+'and how many places the person said yes to: '+J(m&&m.entry&&m.entry.yes));
 ok(/You said: Something moved/.test(s.card),tag+'and the answer to What changed, in the release card\'s own words');
 ok(!!m&&m.gift.used===size&&m.gift.remaining===GIFT-size,tag+'the gift counter has counted the release: '+J(m&&m.gift));
 ok(!!m&&new RegExp('You have '+(GIFT-size)+' patterns left of the '+GIFT+' you were given').test(s.card),
  tag+'and the card shows it moved: '+((s.card.match(/You have [^.]*given/)||['none'])[0]));
 ok(!!made&&made.left===GIFT-size,tag+'and it agrees with the allowance a run is charged against: '+(made&&made.left));
 j=await rec();
 ok(!!(j&&j.gift&&j.gift.used===size&&j.gift.remaining===GIFT-size),tag+'and the stored counter on the record moved in the same write: '+J(j&&j.gift));
 ok(logged(j,'first_release_completed')&&logged(j,'post_release_observation'),tag+'the log says the first release landed and what was observed');
 ok(!!made&&made.keys&&['who','name','id','ui','plan'].every(k=>made.keys.indexOf(k)<0),tag+'the packet carries no name, birth data, id, switches or plan: '+J(made&&made.keys));
 ok(!!made&&made.txt&&made.txt.indexOf('"'+made.name+'"')<0,tag+'and the profile\'s name is nowhere in it');
 const ends=await page.evaluate(()=>[...document.querySelectorAll('#ob .ob-card button,#ob .obx-x')].map(b=>{const r=b.getBoundingClientRect();
  const cs=getComputedStyle(b); return {k:b.getAttribute('data-ob'),t:b.textContent.trim(),w:r.width,h:r.height,
   shown:cs.visibility!=='hidden'&&cs.display!=='none'&&r.width>0};}).filter(b=>b.shown));
 ok(ends.length>=1&&ends.every(b=>b.k==='endin'),tag+'the end card has one way on, Go in, and nothing else to press: '+J(ends.map(b=>b.t)));
 ok(ends.every(b=>b.w>=44&&b.h>=44),tag+'and it is at least 44 by 44: '+J(ends.map(b=>[Math.round(b.w),Math.round(b.h)])));
 await placeholders('the end card'); await shot('end');
 const card0=s.card;
 await reload(); s=await st();
 ok(s.open&&s.step===END,tag+'a reload on the end card resumes on it: open '+s.open+' step '+s.step);
 ok(s.card===card0,tag+'and it says exactly what it said before the reload');

 /* ---- 10. go in, and the first run is over ---- */
 const went=await click('[data-ob="endin"]'); await page.waitForTimeout(700);
 s=await st();
 const fin=await page.evaluate(()=>({onb:!!(CURP&&CURP.ui&&CURP.ui.onboarded)}));
 ok(went&&!s.open&&fin.onb,tag+'Go in closes the first run and marks it finished: '+J({went:went,open:s.open,onb:fin.onb}));
 j=await rec();
 ok(logged(j,'tutorial_completed')&&logged(j,'software_entered'),tag+'and the log says it ended and the person went in');
 await reload(); s=await st();
 ok(!s.open,tag+'a reload after that opens no first run again');
 ok(errs.length===0,tag+'no script error the whole way: '+errs.slice(0,3).join(' | '));
 ok(cerrs.length===0,tag+'no console error from the product the whole way: '+cerrs.slice(0,3).join(' | '));
 await ctx.close();
}

/* ============================================================
   THE OTHER DOOR. The Day One tutorial reaches the same first release
   (ui/tutorial.js), behind its developer switch, DEV_PLAY_TUTORIAL, which is
   how loginEnter opens it on a first run. It writes the same record, a reload
   after its hand off comes back to the card that offers the release (planned
   from what the story read, since this door has no yes rows), and the release
   ends on the same end card.
   ============================================================ */
console.log('\n=== the tutorial door: the same record, the same resume, the same end ===');
{
 const tag='tutorial: ';
 const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
 await ctx.route(/workers\.dev/,r=>r.abort('failed'));
 const page=await ctx.newPage();
 const errs=[]; page.on('pageerror',e=>errs.push(e.message));
 const click=async(sel)=>{try{await page.click(sel,{timeout:4000}); await page.waitForTimeout(90); return true;}
  catch(e){return page.evaluate(s=>{const b=document.querySelector(s); if(b){b.click(); return true;} return false;},sel);}};
 const rec=()=>page.evaluate(()=>(typeof CURP!=='undefined'&&CURP&&CURP.journey)?JSON.parse(JSON.stringify(CURP.journey)):null);
 const door=async()=>{await booted(page);
  await page.evaluate(()=>{ if(typeof DEV_PLAY_TUTORIAL!=='undefined')DEV_PLAY_TUTORIAL=true; });
  if(await page.$('#loginb-skip')){await click('#loginb-skip'); await page.waitForTimeout(350);}};
 await page.goto(FILE,{waitUntil:'load'}); await door();
 const open=await page.evaluate(()=>!!(typeof TUT!=='undefined'&&TUT.open));
 ok(open,tag+'the switch opens the tutorial on a first run');
 let j=await rec();
 ok(!!(j&&j.log.some(e=>e.type==='tutorial_started'&&e.d&&e.d.door==='tutorial')),tag+'its start is on the log, with the door it came through');
 await page.fill('#tuttext',STORY); await click('[data-tut="commit"]');
 j=await rec();
 ok(!!(j&&j.log.some(e=>e.type==='story_submitted')&&j.log.every(e=>J(e).indexOf('chest')<0)),tag+'the story is on the log, and no word of it');
 await click('[data-tut="next"]'); await click('[data-tut="next"]');
 const card=await page.evaluate(()=>(document.querySelector('#tutorial .ob-card')||{}).innerText||'');
 ok(/You have \d+ patterns left of the \d+ you were given\. This release opens \d+ of them/.test(card),
  tag+'the Release card says what is left of the gift and what this release opens');
 await click('[data-tut="release"]'); await page.waitForTimeout(200);
 j=await rec();
 ok(!!(j&&j.walk&&j.walk.step==='release'&&j.walk.door==='tutorial'&&j.walk.base&&j.walk.t),tag+'the hand off is on the walk, by door: '+J(j&&j.walk&&{s:j.walk.step,d:j.walk.door}));
 ok(!!(j&&j.gift&&j.gift.used===0)&&!!(j&&j.log.some(e=>e.type==='first_release_started')),tag+'the gift is issued and the start of the release is logged');
 await page.reload({waitUntil:'load'}); await door();
 const back=await page.evaluate(()=>({open:!!(typeof OB!=='undefined'&&OB.open),step:typeof OB!=='undefined'?OB.step:null,
  door:typeof OB!=='undefined'?OB.door:null, plan:(typeof OB!=='undefined'&&OB.plan&&OB.plan.ok)?OB.plan.lines:null,
  card:(document.querySelector('#ob .ob-card')||{}).innerText||''}));
 ok(back.open&&back.step===7&&back.door==='tutorial',tag+'a reload before the release ran comes back to the card that offers it: '+J({o:back.open,s:back.step,d:back.door}));
 ok(back.plan>0&&/Your story touched/.test(back.card)&&/Begin the release/.test(back.card),tag+'planned from what the story read, '+back.plan+' lines');
 await click('[data-ob="release"]'); await page.waitForTimeout(200);
 await page.evaluate(SHRINK);
 await page.evaluate(()=>{const d=document.getElementById('reldose'); if(d){d.value='1'; d.dispatchEvent(new Event('change'));}});
 await click('#relgo');
 await page.waitForFunction(()=>typeof RUN!=='undefined'&&RUN.phase==='done'&&RUN.cool>=COOLING.length,null,{timeout:90000}).catch(()=>{});
 await page.evaluate(()=>{const r=document.getElementById('relrest'); if(r)r.click();}); await page.waitForTimeout(150);
 await click('#relclose'); await page.waitForTimeout(500);
 const end=await page.evaluate(()=>({open:!!(typeof OB!=='undefined'&&OB.open),step:typeof OB!=='undefined'?OB.step:null,
  end:typeof OB_END==='number'?OB_END:-1, card:(document.querySelector('#ob .ob-card')||{}).innerText||''}));
 ok(end.open&&end.step===end.end&&/Here is what you made/.test(end.card)&&/\d+ lines? at \d+ places?/.test(end.card),
  tag+'its release ends on the same end card: '+J({o:end.open,s:end.step}));
 await click('[data-ob="endin"]'); await page.waitForTimeout(600);
 const fin=await page.evaluate(()=>({open:!!(typeof OB!=='undefined'&&OB.open),onb:!!(CURP&&CURP.ui&&CURP.ui.onboarded)}));
 ok(!fin.open&&fin.onb,tag+'and Go in finishes the first run');
 ok(errs.length===0,tag+'no script error: '+errs.slice(0,3).join(' | '));
 await ctx.close();
}

await browser.close();
console.log('\n'+PASS+' passed, '+FAIL+' failed');
process.exit(FAIL?1:0);
})().catch(e=>{console.log('  FAIL the walk threw: '+((e&&e.stack)||e)); process.exit(1);});
