/* ============================================================
   PRACTITIONER SHARING, END TO END. ROS=<reboot-os checkout> node tests/praclive.js

   Round PS, 26 November, wired for real: the reboot-os Worker (its own
   test/serve.mjs, the real routes over the real migrations on an in-memory
   database) and this build served over http, a practitioner and a client in
   two separate browser profiles, walked by pressing. P1 a link, C1 the yes
   with Body on, P3 and P4 the roster and the client by key, P5 and C3 a
   ritual sent and taken through the client's own writer (ritStartPlan), C2
   Body switched off and gone from the server's answer, C4 a disconnect that
   both sides read.

   It needs the server, which lives in the other repository, so it is not in
   CLAUDE.md's every-commit list: with ROS unset it says so and stops. The
   Worker side has its own gate, reboot-os atuned/server/test/prac.test.mjs.
   Run from the repo root with NODE_PATH at a playwright install.
   ============================================================ */
const path=require('path'), fs=require('fs'), http=require('http'), {spawn}=require('child_process');
const ROS=process.env.ROS;
if(!ROS||!fs.existsSync(path.join(ROS,'atuned/server/test/serve.mjs'))){
 console.log('NOT RUN: set ROS to a reboot-os checkout that has atuned/server/src/prac.js'); process.exit(0);}
const OUT=process.env.OUT||fs.mkdtempSync(path.join(require('os').tmpdir(),'praclive-'));
const API_PORT=8799, APP_PORT=8798;
const {chromium}=require('playwright');
const API='http://127.0.0.1:'+API_PORT, APP='http://localhost:'+APP_PORT+'/source.html?dev=1';
let P=0,F=0; const ok=(c,m)=>{if(c){P++;console.log('  ok   '+m);}else{F++;console.log('  FAIL '+m);}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function open(b,email){
 const ctx=await b.newContext({viewport:{width:1600,height:1000}});
 const pg=await ctx.newPage();
 const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto(APP,{waitUntil:'load'});
 await pg.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}).catch(()=>{});
 await wait(800);
 const r=await pg.evaluate(async([api,email])=>{
  AUTH_API=api; try{sheetShut();loginClose&&loginClose();}catch(e){}
  const r=await authCall('POST','/v1/auth/signup',{email,password:'eight chars!'});
  if(r.ok)authKeep({token:r.body.token,email,accountId:r.body.account.id});
  return {ok:r.ok,status:r.status};},[API,email]);
 return {pg,errs,r};
}
function serve(){
 const file=path.resolve(process.env.ATUNED_FILE||'source.html');
 return new Promise(r=>{const srv=http.createServer((q,res)=>{
  if(!/^\/source\.html/.test(q.url)){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'content-type':'text/html; charset=utf-8'}); fs.createReadStream(file).pipe(res);}).listen(APP_PORT,'127.0.0.1',()=>r(srv));});}
function worker(){
 return new Promise((r,j)=>{const p=spawn(process.execPath,['test/serve.mjs',String(API_PORT)],{cwd:path.join(ROS,'atuned/server')});
  p.stdout.on('data',d=>{if(/listening/.test(String(d)))r(p);}); p.on('exit',c=>j(new Error('the Worker exited '+c)));});}
(async()=>{
 const srv=await serve(), wk=await worker();
 const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 require('./net.js').guardBrowser(b);
 const pr=await open(b,'dana@example.invalid'), cl=await open(b,'wren@example.invalid');
 ok(pr.r.ok&&cl.r.ok,'both sign up against the real Worker '+JSON.stringify([pr.r,cl.r]));

 console.log('P1: the practitioner makes a link');
 await pr.pg.evaluate(()=>{pracSwitch(true); setTab(TAB.PRACTITIONER); render&&render(); renderPrac();});
 await wait(900);
 /* round [Phase 1]: P1 and P2 moved off their own rail cards into a sheet
    the Clients heading's own Invite button opens */
 await pr.pg.click('[data-pr="invite"]'); await wait(400);
 await pr.pg.fill('#pllabel','Dana Okafor');
 await pr.pg.click('#plinvform button[type=submit]'); await wait(900);
 const link=await pr.pg.inputValue('#pllink').catch(()=>'');
 ok(/#prac=[A-Za-z0-9_-]{40,}$/.test(link),'a one-time link is shown: '+link.slice(0,60)+'...');
 const p2=await pr.pg.evaluate(()=>document.querySelector('#sheet-card').innerText);
 ok(/Pending/.test(p2)&&/Not used yet/.test(p2),'P2: Pending lists the open link, in the same sheet');
 await pr.pg.screenshot({path:OUT+'/p1-invite.png'});

 console.log('C1: the client opens the link and answers');
 const tok=link.split('#prac=')[1];
 await cl.pg.evaluate(async(t)=>{history.replaceState(null,'',location.pathname+location.search+'#prac='+t); await pracLiveBoot();},tok);
 await wait(900);
 const sheet=await cl.pg.evaluate(()=>{const c=document.getElementById('sheet-card');return {shown:!document.getElementById('sheet').hidden, t:c?c.innerText:''};});
 ok(sheet.shown&&/Dana Okafor asks to see your record/i.test(sheet.t),'the accept sheet names the practitioner');
 ok(/always shared/.test(sheet.t),'Summary is fixed');
 const offs=await cl.pg.evaluate(()=>[...document.querySelectorAll('#sheet-card [data-plc1s]')].map(b=>b.getAttribute('aria-checked')));
 ok(offs.join()==='false,false','Body and Field start off: '+offs);
 ok(!/#prac=/.test(await cl.pg.evaluate(()=>location.href)),'the link is cleared from the address bar');
 await cl.pg.screenshot({path:OUT+'/c1-accept.png'});
 await cl.pg.click('#sheet-card [data-plc1s="body"]'); await wait(200);
 await cl.pg.click('#sheet-card [data-plc1="yes"]'); await wait(1500);
 const st=await cl.pg.evaluate(()=>({mine:PL.mine&&PL.mine.grants.map(g=>[g.status,g.sight]), own:ritOwn(), pub:PL.pubAt}));
 ok(st.mine&&st.mine[0][0]==='active'&&st.mine[0][1].body===true&&st.mine[0][1].field===false,'C1: live with Summary and Body '+JSON.stringify(st.mine));
 ok(st.pub>0,'the client device published its snapshot (own record '+st.own+')');

 console.log('P3, P4: the practitioner sees the client by key, the figure from the shared Body, Field not shared');
 await pr.pg.evaluate(async()=>{await pracLiveRead(); renderPrac();}); await wait(500);
 const row=await pr.pg.evaluate(()=>{const e=document.querySelector('[data-plo]');return e?e.innerText:'';});
 ok(/^Client [A-Z0-9]{6}/.test(row)&&/Summary/.test(row)&&/Body/.test(row),'P3: the row is a key with the grant level: '+row.replace(/\n/g,' | '));
 ok(!/wren@/i.test(await pr.pg.evaluate(()=>document.body.innerText)),'the client\'s email appears nowhere on the practitioner page');
 await pr.pg.screenshot({path:OUT+'/p3-roster.png'});
 await pr.pg.click('[data-plo]'); await wait(1200);
 /* P4, round [Phase 1]: the Summary/Body/Field tab switcher and plRingCard/
    plBodyCard this used to read (#prmid) are gone; the centre is the name
    and the body figure now, built off the shared Body (plCentreData,
    ui/praclive.js), found by selector rather than by a tab press, the way
    every other check in this file was already told to move. */
 const centre=await pr.pg.evaluate(()=>{
  const h2=document.querySelector('#prac .pr-centre h2'), cv=document.querySelector('#prac canvas[data-prcv]');
  return {h2:h2?h2.textContent:'', cv:!!cv, w:cv?cv.width:0, h:cv?cv.height:0};});
 ok(!!centre.h2&&centre.cv&&centre.w>50&&centre.h>20,
  'P4: the centre draws a named figure off the shared Body, '+JSON.stringify(centre));
 await pr.pg.screenshot({path:OUT+'/p4-figure.png'});
 /* and again at 390, where the figure drops to one view with a Front/Back
    toggle rather than drawing both at a width that has no room for them */
 await pr.pg.setViewportSize({width:390,height:844}); await wait(400);
 const reduced=await pr.pg.evaluate(()=>{
  const cv=document.querySelector('#prac canvas[data-prcv]'), face=document.querySelector('#prac .pr-face');
  return {cv:!!cv, w:cv?cv.width:0, faceShown:!!face&&getComputedStyle(face).display!=='none',
   pills:face?face.querySelectorAll('button').length:0};});
 ok(reduced.cv&&reduced.w>50&&reduced.faceShown&&reduced.pills===2,
  'P4 at 390: the figure is still drawn, reduced to one view with its Front/Back toggle, '+JSON.stringify(reduced));
 await pr.pg.screenshot({path:OUT+'/p4-figure-390.png'});
 await pr.pg.setViewportSize({width:1600,height:1000}); await wait(400);
 /* Field was left off in C1 below, so What is running reads the one value
    CLAUDE.md's symbol-first rule asks for rather than a sentence, and the
    top addresses at or above the display line, since that much is read
    off the shared Body even with Field off. */
 const run=await pr.pg.evaluate(()=>document.querySelector('#prrun').innerText);
 ok(/Field, not shared/.test(run),'P4: What is running reads "Field, not shared" since Field is off, got "'+run.slice(0,160)+'"');
 await pr.pg.screenshot({path:OUT+'/p4-run.png'});

 console.log('P5, C3: a ritual proposed, then accepted through the client\'s own writer');
 /* round [Phase 1]: the writer has no tab of its own any more, it is always
    part of What is running (#prrun), under the client's own rituals */
 await pr.pg.click('[data-pl="write"]'); await wait(300);
 const k=await pr.pg.evaluate(()=>PRACTICE[0].k);
 await pr.pg.selectOption('#plwk',k);
 await pr.pg.click('[data-plwd="0"]'); await pr.pg.click('[data-plwd="2"]');
 await pr.pg.selectOption('#plwb','Heart');
 await pr.pg.fill('#plwy','Ten minutes before you go in.');
 await pr.pg.screenshot({path:OUT+'/p5-writer.png'});
 await pr.pg.click('[data-pl="send"]'); await wait(1500);
 const sent=await pr.pg.evaluate(()=>document.querySelector('#prrun').innerText);
 ok(/Sent/.test(sent)&&/Withdraw/.test(sent),'P5: the sent ritual is listed with Withdraw');
 await pr.pg.screenshot({path:OUT+'/p5-sent.png'});
 const before=await cl.pg.evaluate(()=>(CURP.practice&&CURP.practice.plans||[]).length);
 await cl.pg.evaluate(async()=>{await pracMineRead(); setTab(TAB.RITUAL); render&&render();}); await wait(1200);
 const sug=await cl.pg.evaluate(()=>{const e=document.querySelector('[data-plra]');return e?e.closest('li').innerText:'';});
 ok(/From Dana Okafor/.test(sug)&&/Ten minutes before you go in/.test(sug),'C3: the suggestion row names who sent it and why');
 await cl.pg.screenshot({path:OUT+'/c3-suggested.png'});
 await cl.pg.click('[data-plra]'); await wait(1500);
 const after=await cl.pg.evaluate((k)=>({n:(CURP.practice&&CURP.practice.plans||[]).length, has:(CURP.practice.plans||[]).some(p=>p.steps.join()===k&&p.band==='Heart'&&String(p.on)==='0,2'), left:PL.mine.proposals.length}),k);
 ok(after.n===before+1&&after.has,'C3: the ritual is on the client\'s own record, through ritStartPlan '+JSON.stringify(after));
 ok(after.left===0,'and it leaves the suggestions');
 await pr.pg.evaluate(async()=>{const g=PL.sel; await plOpen(g); renderPrac();}); await wait(800);
 ok(/Accepted/.test(await pr.pg.evaluate(()=>document.querySelector('#prrun').innerText)),'the practitioner reads Accepted');

 console.log('C2: the client turns Body off, and the practitioner loses it at once');
 await cl.pg.evaluate(()=>{ACC_OPEN='privacy'; setTab(TAB.SETTINGS); render&&render(); renderAccount();}); await wait(800);
 const c2=await cl.pg.evaluate(()=>document.querySelector('#settings .ac-pane').innerText);
 ok(/Dana Okafor/.test(c2)&&/always shared/.test(c2)&&/Disconnect/.test(c2),'C2: the practitioner is listed with Summary fixed and Disconnect');
 await cl.pg.evaluate(()=>{const e=document.querySelector('[data-plsw]'); e&&e.scrollIntoView({block:'center'});}); await wait(300);
 await cl.pg.screenshot({path:OUT+'/c2-who.png'});
 await cl.pg.setViewportSize({width:390,height:844}); await wait(500);
 await cl.pg.evaluate(()=>{const e=document.querySelector('[data-plsw]'); e&&e.scrollIntoView({block:'center'});}); await wait(300);
 await cl.pg.screenshot({path:OUT+'/c2-who-390.png'});
 await cl.pg.setViewportSize({width:1600,height:1000}); await wait(400);
 await cl.pg.click('[data-plsw$=":body"]'); await wait(1500);
 const snap=await pr.pg.evaluate(async()=>{const r=await plCall('GET','/v1/prac/grants/'+PL.sel+'/snapshot');return r.body;});
 ok(snap.grant.sight.body===false&&snap.snapshot.body===null&&!!snap.snapshot.sum,'the server answers Summary and no Body '+JSON.stringify(snap.grant.sight));

 console.log('C4: the client disconnects, and both sides read it');
 await cl.pg.click('#settings [data-plend]'); await wait(1500);
 const c4=await cl.pg.evaluate(()=>document.querySelector('#settings .ac-pane').innerText);
 ok(/was ended by you/.test(c4),'C4 client: the ended notice');
 await cl.pg.screenshot({path:OUT+'/c4-client.png'});
 await pr.pg.evaluate(async()=>{PL.sel=null; await pracLiveRead(); renderPrac();}); await wait(600);
 /* round [Phase 1]: a row carries one value and no sentence any more, so an
    ended connection reads "ended" on its own disabled row in the rail
    rather than the old explanatory paragraph (CLAUDE.md, "no third tier
    text"); found by selector on #prlist, not on #prac, which holds nothing
    once PL.sel is cleared. */
 const p4=await pr.pg.evaluate(()=>{
  const row=[].find.call(document.querySelectorAll('#prlist .pr-client[aria-disabled]'),r=>/Dana|Client/i.test(r.textContent));
  return row?row.textContent:'';});
 ok(/ended/i.test(p4),'C4 practitioner: the ended row reads "ended", got "'+p4+'"');
 await pr.pg.screenshot({path:OUT+'/c4-practitioner.png'});

 ok(!pr.errs.length&&!cl.errs.length,'no page errors '+JSON.stringify(pr.errs.concat(cl.errs)).slice(0,300));
 console.log('\n'+P+' passed, '+F+' failed');
 await b.close(); srv.close(); wk.kill(); console.log('pictures in '+OUT); process.exit(F?1:0);
})();
