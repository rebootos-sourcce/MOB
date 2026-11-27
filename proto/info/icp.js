/* ============================================================
   THE SIX ICPs THROUGH A FIRST SESSION.

   Six entries in PEOPLE carry "· ICP" and they are the panel
   RESEARCH-icp.md uses. Each one's charge vector produces a different
   reading, so each one faces a different set of named things. This counts,
   per person, how many of them the product cannot explain.

   The first session is the loop CLAUDE.md rules: discover, play, flow,
   body. In surfaces, and in the order the app itself moves a person
   through them, starting where the app opens.

   THE ONBOARDING SHEET IS DISMISSED FIRST. It covers the rails on a fresh
   load: measured, document.elementFromPoint over a right rail row returned
   DIV.ob, and every hover test failed until it was gone. A probe that
   measures an overlay and reports the product is a probe that lies.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const FILE=path.resolve(__dirname,'..','..','source.html');
const ICPS=['Diane','Derek','Marcus','Angela','Sofia','James'];
/* the app opens on Summary. core.js: "THE APP OPENS ON SUMMARY". */
const SESSION=[['Summary','discover'],['Energetics','play'],['Story','play'],
               ['Field','flow'],['Body','body'],['Summary','discover']];

const DISMISS=()=>{var o=document.querySelector('.ob'); if(o)o.remove(); return !!o;};

const COUNT=function(TERMS){
 var vis=function(e){var b=e.getBoundingClientRect(); if(b.width<=0||b.height<=0)return false;
  var s=getComputedStyle(e);
  return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity)!==0;};
 var own=function(e){var t=e.textContent||'';
  for(var i=0;i<e.children.length;i++)t=t.replace(e.children[i].textContent,'');
  return t.replace(/\s+/g,' ').trim();};
 var SCALE=/\bof\s+\d|out of|%|summed|no ceiling|plus or minus/i;
 var out={word:0,wordNone:0,number:0,numberNone:0,numberNonePhone:0,
          wordNonePhone:0, terms:{}, worst:[]};
 var all=document.body.querySelectorAll('*');
 for(var i=0;i<all.length;i++){
  var e=all[i]; if(!vis(e))continue;
  var o=own(e); if(!o)continue;
  var hit=TERMS[o.toLowerCase()];
  if(!hit&&o.length<40)hit=TERMS[o.toLowerCase().replace(/[.,·:].*$/,'').trim()];
  var tip=!!(e.getAttribute('data-tip')||e.closest('[data-tip]'));
  var kb=!!(e.getAttribute('data-kbs')||e.closest('[data-kbs]'));
  var drill=!!(e.getAttribute('data-addr')||e.getAttribute('data-kbi')
    ||(e.closest&&(e.closest('.ad-r')||e.closest('.kb-c'))));
  var ti=!!(e.getAttribute('title')||e.closest('[title]'));
  if(hit){out.word++; out.terms[o.toLowerCase()]=1;
   if(!(tip||kb||drill||ti)){out.wordNone++; if(out.worst.length<400)out.worst.push(o);}
   if(!(tip||kb||drill))out.wordNonePhone++;}
  else if(/(^|[^A-Za-z0-9])\d/.test(o)){
   out.number++;
   var blk=e.closest('.lsec,.card,.rd-card,.pm,.sum-hero,.panel,section,li')||document.body;
   var sc=SCALE.test(o)||SCALE.test((blk.textContent||'').replace(/\s+/g,' '));
   if(!sc&&!tip&&!kb&&!drill&&!ti)out.numberNone++;
   if(!sc&&!(tip||kb||drill))out.numberNonePhone++;}}
 return out;};

const TERMS_JS=`(function(){var s={},add=function(t,src){t=String(t||'').trim();
 if(t.length<2)return; if(!s[t.toLowerCase()])s[t.toLowerCase()]=src;};
 W.forEach(function(n){add(n.k,'address');});
 CHILD.forEach(function(c){add(c.nm,'fetter');add(c.opp,'opposite');});
 ALL_SAB.forEach(function(x){add(x.nm,'saboteur');});
 SI.forEach(function(l){add(l.nm,'law');});
 MASKS.forEach(function(m){add(m.nm,'mask');});
 DOMAINS.forEach(function(d){add(d.nm,'domain');});
 ARCH.forEach(function(a){add(a.nm,'archetype');});
 HARM.forEach(function(e){add(e.t,'universal law');});
 GLOSS.forEach(function(g){add(g.t,'glossary');});
 BANDS.forEach(function(b){add(b,'seat');});
 HCX_LIB.forEach(function(h){add(h.nm,'hyper-complex');});
 return s;})()`;

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 /* 390, because that is the arrival device and it is the one with no hover. */
 const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const p=await c.newPage();
 await p.goto('file://'+FILE); await p.waitForTimeout(7000);
 await p.evaluate(DISMISS);
 const TERMS=await p.evaluate(TERMS_JS);
 const GL=await p.evaluate(`(function(){var g={};GLOSS.forEach(function(x){g[x.t.toLowerCase()]=1;});return g;})()`);
 const KBR=await p.evaluate(`(function(){var k={},s=['addr','fetter','sab','law','mask','dom','arch','gate','harm','gloss','card'];
  s.forEach(function(x){try{(kbRows(x)||[]).forEach(function(r){k[String(r.t).toLowerCase()]=1;});}catch(e){}});return k;})()`);
 const IDS=await p.evaluate(TABDEF=>0,0);
 const TABK=await p.evaluate(`(function(){var m={};TABDEF.forEach(function(t){m[t.nm]=t.k;});
  Object.keys(TABEXTRA).forEach(function(k){m[TABEXTRA[k].nm]=TABEXTRA[k].k;});return m;})()`);
 const EV=new Function('a','return ('+COUNT.toString()+')(a);');
 const rows=[], allTerms={};
 for(const who of ICPS){
  const i=await p.evaluate(n=>PEOPLE.findIndex(x=>x.nm===n),who);
  await p.evaluate(i=>loadP(i),i); await p.waitForTimeout(500); await p.evaluate(DISMISS);
  const r={who, i, stops:[], word:0,wordNone:0,wordNonePhone:0,number:0,numberNone:0,numberNonePhone:0,terms:{}};
  for(const [nm,beat] of SESSION){
   await p.evaluate(k=>setTab(k),TABK[nm]); await p.waitForTimeout(450); await p.evaluate(DISMISS);
   const s=await p.evaluate(EV,TERMS);
   r.stops.push({nm, beat, word:s.word, wordNone:s.wordNone, wordNonePhone:s.wordNonePhone,
     number:s.number, numberNone:s.numberNone, numberNonePhone:s.numberNonePhone});
   r.word+=s.word; r.wordNone+=s.wordNone; r.wordNonePhone+=s.wordNonePhone;
   r.number+=s.number; r.numberNone+=s.numberNone; r.numberNonePhone+=s.numberNonePhone;
   Object.keys(s.terms).forEach(t=>{r.terms[t]=1; allTerms[t]=(allTerms[t]||0)+1;});}
  r.distinct=Object.keys(r.terms).length;
  r.inGloss=Object.keys(r.terms).filter(t=>GL[t]).length;
  r.inKb=Object.keys(r.terms).filter(t=>KBR[t]).length;
  r.nowhere=Object.keys(r.terms).filter(t=>!GL[t]&&!KBR[t]).length;
  rows.push(r);
  console.log(who.padEnd(8)+' stops '+r.stops.length
   +'  word carriers '+String(r.word).padStart(5)
   +'  unanswerable on a phone '+String(r.wordNonePhone).padStart(5)
   +'  distinct terms '+String(r.distinct).padStart(4)
   +'  of those in the glossary '+String(r.inGloss).padStart(3)
   +'  reachable as a knowledge row '+String(r.inKb).padStart(4)
   +'  nowhere '+String(r.nowhere).padStart(3));}
 fs.writeFileSync(path.join(__dirname,'icp.json'),JSON.stringify({rows,session:SESSION,
   glossSize:Object.keys(GL).length, kbSize:Object.keys(KBR).length,
   termsAcrossPanel:Object.keys(allTerms).length},null,1));
 console.log('\nterms seen by at least one of the six: '+Object.keys(allTerms).length);
 console.log('glossary: '+Object.keys(GL).length+'   knowledge rows: '+Object.keys(KBR).length);
 await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
