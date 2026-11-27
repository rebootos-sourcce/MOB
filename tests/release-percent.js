/* THE RELEASE SCREEN'S HEADLINE READING CARRIES A PERCENT SIGN, round PQ.
   His words: "No, it doesn't need to be a percent. Just a number." The
   ruling reached the Field's rings, the glass bar, the Summary tile and the
   Compass centre, named by name in CLAUDE.md, but round PO's own words are
   that the release protocol was never touched this round: "the release
   protocol has not been updated at all." Two readings in ui/release.js
   carried the sign anyway: the DQ and Down figures on the row a person
   watches live while a run is open and on the finished card (relShade), and
   the address ring on the running plate, which overrode crNode's own
   default (a bare decimal, n.sq.toFixed(1), the format every other address
   ring in the product reads) to print a percent instead.

   This gate drives a real run on the person's own record, seeded from a
   loaded worked example's charge so the numbers are not zero, reaches the
   run phase and the finished card, and reads the actual text nodes rather
   than the source. Run against the build before this fix it fails, named
   failure for named failure; against the fix it passes. */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
 try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}
 try{ await p.waitForFunction(()=>typeof enterOver!=='function'||enterOver(),null,{timeout:4000}); }catch(e){}};

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(browser);
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 const errs=[];
 page.on('pageerror',e=>errs.push('PAGEERROR: '+e.message));
 await page.goto(FILE,{waitUntil:'load'}); await booted(page); await page.waitForTimeout(500);

 const out=await page.evaluate(()=>{
  var i=PEOPLE.findIndex(function(p){return p.nm==='James';});
  loadP(i);
  var seed=Object.assign({},S.charge);
  var ids=Object.keys(BY).map(Number).filter(function(k){return BY[k]&&BY[k].sq>3;})
   .sort(function(a,b){return BY[b].sq-BY[a].sq;}).slice(0,3);
  loadP(0);
  Object.assign(S.charge,seed);
  compute(); setTab(TAB.FIELD); render();
  relPick(ids);
  var o={};
  // the setup panel's own run offered before anything is spent
  o.setupHtml=document.getElementById('rel').innerHTML;
  /* the setup panel by what it is: the card's own phase, and its one start
     control by id, which reads "Release" (renamed from "Run release" on 29
     October, see the ruling beside it in ui/release.js) */
  o.setupPhase=((document.querySelector('#rel .rel-card')||document.createElement('i')).getAttribute('data-ph'))||'';
  o.go=(document.getElementById('relgo')||{}).textContent||'';
  RUN.phase='run';RUN.idx=0;RUN.pass=3;relRender();
  o.plateText=(document.querySelector('.rel-plate')||{}).textContent||'';
  o.plateHtml=(document.querySelector('.rel-plate')||{}).innerHTML||'';
  /* the plate by what it is: the xs address ring, and the figure inside it */
  o.plateRing=!!document.querySelector('.rel-plate .cr.xs');
  o.plateVal=(document.querySelector('.rel-plate .cr.xs .v')||{}).textContent||'';
  RUN.halted=true; relCoolDown();
  /* round QH: the two minutes are their own screen before the finished card,
     so the card is reached the way a person reaches it early, by Skip */
  var rest=document.getElementById('relrest'); o.rest=!!rest; if(rest)rest.click();
  o.dqFig=Array.from(document.querySelectorAll('.rel-fig')).map(function(e){return e.textContent;});
  o.cardHtml=document.getElementById('rel').innerHTML;
  return o;});

 console.log('=== release screen, the headline reading carries no percent sign ===');
 /* THE TWO CHECKS THAT ENDED IN ||true, repaired. They could not fail. The
    first also tested a regex that was stale: /Pattern|Run release/ matched the
    word "Patterns" on a field label, never the control, because "Run release"
    became "Release" on 29 October. Both now assert the real thing, and a
    build without it fails them, which is shown in the commit that repaired
    them. */
 ok(out.setupPhase==='setup'&&out.go==='Release','setup panel reached, and its start control #relgo reads "Release": '+JSON.stringify([out.setupPhase,out.go]));
 ok(!/\d%/.test(out.plateText),'the running plate\'s address ring is a bare number, not a percent: '+out.plateText);
 ok(out.plateRing&&/^\d+\.\d$/.test(out.plateVal),'plate rendered, with its xs address ring reading a bare one place decimal: '+JSON.stringify([out.plateRing,out.plateVal]));
 const dqLine=out.dqFig.find(t=>/^DQ/.test(t))||'';
 const downLine=out.dqFig.find(t=>/^Down/.test(t))||'';
 ok(dqLine.length>0,'the finished card shows a DQ figure: '+JSON.stringify(out.dqFig));
 ok(!/%/.test(dqLine),'DQ on the finished card carries no percent sign: '+JSON.stringify(dqLine));
 ok(!/%/.test(downLine),'Down on the finished card carries no percent sign: '+JSON.stringify(downLine));
 ok(!/\d\d?%/.test(out.cardHtml.replace(/<[^>]*>/g,' ')),
  'no reading on the whole finished card is printed as a percent: '
  +(out.cardHtml.match(/\d\d?%/g)||[]).join(', '));
 ok(errs.length===0,'no page error: '+errs.join(' | '));

 await browser.close();
 console.log('\n'+PASS+' passed, '+FAIL+' failed');
 process.exit(FAIL?1:0);
})();
