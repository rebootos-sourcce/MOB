/* avatar-whole-dormant and avatar-remove-old-blocks, round SW, 21 November,
   his words on the avatar system: "as is the avatar system." Two gaps named
   on the board, both checked real against this tip before anything moved:

   1. wholeOf (engine/avatar.js, his 18 November ruling, 35 released, 35
      reframed, 30 practised) was real and already correct, but nothing
      under ui/ called it: the Avatar page's own hero percent was avClosure's
      mean across written stories instead, which never reads CURP.rituals at
      all, so marking a ritual done could never move it. Confirmed below
      against a real profile with zero avatar rows: before this fix,
      avState().overall stayed null across a ritual mark even while wholeOf
      itself already read 1 percent; after, it reads the same number wholeOf
      does, and the ring (.av-prog) is drawn once it is read.

   2. the Avatar page's own Cycles, Rituals and Running cards (avCycHTML,
      avRitHTML, avRunHTML) are superseded and stale per the board's own
      tracking and are gone from the page; the helpers under them
      (avCycles/avCycArc, avRituals, avRunning) stay, because the Ritual
      page still calls them. Release first is checked present and still
      live: it is AVS4's own route to a press that runs the avatar's own
      order, not stale, and tests/becoming.js already exercises the click;
      this file only confirms the card still renders when the avatar carries
      a tag and that the three removed cards do not.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node tests/avatarwhole.js */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 require('./net.js').guardBrowser(b);
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
 await p.goto(FILE);
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}

 console.log('\n=== AVS-WHOLE: a bare profile, a ritual day, and the real figure ===');
 const w1=await p.evaluate(async()=>{
  const w=t=>new Promise(r=>setTimeout(r,t));
  loadP(0); CURP.avatar=avatarBlank(); CURP.story={entries:[]}; CURP.rituals=[];
  setTab(TAB.INTAKE); AV.sub='becoming'; AV.sig=''; renderAvatar(); await w(80);
  const before=avState();
  const o={rowsBefore:before.rows.length, overallBefore:before.overall,
   ringBefore:!!document.querySelector('#avbody .av-prog')};
  CURP.rituals.push({t:Date.now(), min:5, steps:['embody'], done:true});
  renderAvatar(); await w(80);
  const after=avState(), direct=wholeOf(CURP);
  o.overallAfter=after.overall; o.direct=direct;
  o.ringAfter=!!document.querySelector('#avbody .av-prog');
  return o;});
 ok(w1.rowsBefore===0,'the fixture carries no avatar story, so the old mean had nothing to read either way');
 ok(w1.overallBefore===null,'with nothing done at all, the hero reads unread, the dash, not a bare zero');
 ok(w1.direct&&w1.direct.reason==='read'&&w1.direct.n.D===1,'wholeOf itself reads the one ritual day, '+JSON.stringify(w1.direct&&w1.direct.n));
 ok(w1.overallAfter!==null&&Math.round(w1.overallAfter*100)===w1.direct.pct,
  'avState().overall now reads the same pct wholeOf does, '+w1.overallAfter+' vs '+(w1.direct&&w1.direct.pct));
 ok(w1.ringBefore===false&&w1.ringAfter===true,'the ring is undrawn while nothing is read and drawn once the ritual day moves it');

 console.log('\n=== AVS-WHOLE: the three removed cards are gone, Release first still lives ===');
 const w2=await p.evaluate(async()=>{
  const w=t=>new Promise(r=>setTimeout(r,t));
  loadP(0); CURP.avatar=avatarBlank(); CURP.story={entries:[]}; CURP.rituals=[];
  setTab(TAB.INTAKE); AV.sub='becoming'; AV.sig=''; renderAvatar(); await w(80);
  const add=(bb,be,nb)=>{AV.seat=bb; AV.face='story'; AV.edit=null; AV.drafts[bb]={be:be,notbe:nb}; avSeatAdd(bb);};
  add('Heart','Someone who stays close when it gets hard.','My chest aches and I feel lonely when my partner goes quiet.');
  CURP.avatar.tags.Heart={add:['lonely']};
  renderAvatar(); await w(80);
  const st=avState();
  return {rows:st.rows.length,
   avc:!!document.querySelector('#avbody .avc'), avrit:!!document.querySelector('#avbody .av-rit'),
   avrun:!!document.querySelector('#avbody .av-run'), avq:!!document.querySelector('#avbody .avq'),
   avqOne:document.querySelectorAll('#avbody .avq-one').length, first:st.first.length};});
 ok(w2.rows>0,'the fixture now carries a written seat');
 ok(!w2.avc&&!w2.avrit&&!w2.avrun,'Cycles, Rituals and Running are off the Avatar page, '+JSON.stringify(w2));
 ok(w2.avq&&w2.avqOne===w2.first&&w2.first>0,'Release first still renders, carrying the avatar\'s own queue, '+JSON.stringify(w2));

 ok(errs.length===0,'no page errors, '+errs.join(' | '));
 await b.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);
})();
