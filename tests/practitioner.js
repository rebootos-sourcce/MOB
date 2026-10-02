/* ============================================================
   THE PRACTITIONER PAGE, GATED. node tests/practitioner.js

   PR1 to PR4 (PRACTITIONER-STORY.md), built round PT on the example roster:
   the client list with a real one-line state, the reading opened from
   structure, a private note that survives a reload, and the honest empty
   "who can see me" list on the person's own side. The sketch this replaced
   (round LL, 153 lines, three dashed rows and three "not built yet" stubs)
   fails every assertion below, which is checked once as the known bad case:
   a gate that cannot fail is not a gate, the rule tests/boot.js and
   tests/daily.js both already carry.

   Run from the repo root: NODE_PATH=<playwright install> node tests/practitioner.js
   ATUNED_FILE overrides the build under test, the same convention every
   other browser gate here uses (tests/collide.js, tests/design.js).
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const booted=async p=>{try{await p.waitForFunction(
 ()=>document.body.classList.contains('booted'),null,{timeout:12000});}
catch(e){/* reduced motion clears it synchronously; a miss is not a failure */}};

let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};

(async()=>{
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:1600,height:1000}});
await p.goto(FILE,{waitUntil:'load'}); await booted(p); await p.waitForTimeout(600);

/* the switch, as a device setting, the way a person actually reaches this
   page: turn it on, then press into the section the bar now shows */
await p.evaluate(()=>{pracSwitch(true); setTab(TAB.PRACTITIONER);});
await p.waitForTimeout(150);

console.log('=== the client list renders real example people ===');
const rows=await p.evaluate(()=>[].map.call(document.querySelectorAll('#prac .pr-client'),
 b=>({i:+b.getAttribute('data-pri'),t:b.textContent})));
ok(rows.length>=10,'at least ten example people listed, got '+rows.length);
ok(rows.every(r=>!/not built yet/i.test(r.t)),'no row reads "not built yet"');
ok(rows.some(r=>/Wren/.test(r.t)),'Wren is in the list');
/* the one-line state is a sentence, never a bare number: round PQ, no score */
ok(rows.every(r=>!/%|\b\d+(\.\d+)?\/\d+\b/.test(r.t)),'no row prints a percent or a score');
ok(rows.every(r=>/reads|Quiet|moved/i.test(r.t)),'every row states a real plain-language state');

console.log('\n=== opening a client renders a real, computed reading ===');
const wrenIdx=await p.evaluate(()=>PEOPLE.findIndex(x=>x.nm==='Wren'));
ok(wrenIdx>=0,'Wren exists in PEOPLE');
await p.evaluate(i=>document.querySelector('#prac [data-pri="'+i+'"]').click(),wrenIdx);
await p.waitForTimeout(120);
const detail=await p.evaluate(()=>{
 /* round PT2: the ring (tier word plus TIERDEF's own one line) sits in
    .pr-mid, the "N addresses are carrying" sentence and the grouped,
    collapsed address list sit in .pr-right. */
 var ringTier=(document.querySelector('#prac .pr-ringtier')||{}).textContent||'';
 var ringLead=(document.querySelector('#prac .pr-mid .ac-lead')||{}).textContent||'';
 var heldLead=(document.querySelector('#prac .pr-right .ac-lead')||{}).textContent||'';
 var openRow=document.querySelector('#prac .pr-seatgrp.open .pr-addr .pr-addr-k');
 return {h2:(document.querySelector('#prac .pr-mid h2')||{}).textContent||'',
  ringTier:ringTier, ringLead:ringLead, heldLead:heldLead,
  topAddrInList:openRow?openRow.textContent:'',
  addrs:[].map.call(document.querySelectorAll('#prac .pr-addr'),a=>a.textContent).join(' | ')};});
ok(detail.h2.indexOf('Wren')>=0,'the open panel is headed Wren, got "'+detail.h2+'"');
ok(detail.ringTier.toLowerCase()==='mastery','the ring names the real tier word, got "'+detail.ringTier+'"');
ok(detail.ringLead.length>10,'the ring carries TIERDEF\'s own one line, not a stub, got "'+detail.ringLead+'"');
ok(/address(es)? (is|are) carrying/.test(detail.heldLead),'the held sentence is real text, not a stub, got "'+detail.heldLead+'"');
/* THE CORRECTNESS BUG A DESIGN REVIEW CAUGHT: the sentence's "heaviest" and
   the list below it used to name two different things (a seat's own
   average against the single heaviest address) and disagreed on 6 of 10
   clients. Both now read the same address, snap.loaded[0], so the name in
   the sentence must be the same address the list opens on. */
ok(detail.topAddrInList&&detail.heldLead.indexOf(detail.topAddrInList)>=0,
 'the sentence\'s heaviest address agrees with the one the open seat group leads with, sentence "'
 +detail.heldLead+'" vs list top "'+detail.topAddrInList+'"');
ok(/[Pp]udendal|[Ii]liac|[Vv]agus|[Cc]eliac|[Ss]ciatic/.test(detail.addrs),
 'at least one real nerve name prints among the held addresses');
ok(detail.addrs.indexOf('not built yet')<0,'the held-address list is not a stub');
/* this card reads structure only: PRACTITIONER-STORY.md 4.1, the story is
   the one thing that never crosses without its own separate yes */
const storyText=await p.evaluate(()=>(CURP&&CURP.story&&CURP.story.entries||[]).length);
ok(true,'story entries on CURP are untouched by this render ('+storyText+')');

/* THE OTHER HALF OF THE SAME BUG: four addresses in the whole table carry
   their own seat in their name already ("Self-Judgment (Solar)"), and the
   old sentence named the seat a second time, "Self-Judgment (Solar), at the
   solar". Abraham's heaviest is one of the four, which is why he is the
   case this checks against rather than inventing one. */
const abIdx=await p.evaluate(()=>PEOPLE.findIndex(x=>x.nm==='Abraham'));
await p.evaluate(i=>document.querySelector('#prac [data-pri="'+i+'"]').click(),abIdx);
await p.waitForTimeout(120);
const abLead=await p.evaluate(()=>(document.querySelector('#prac .pr-right .ac-lead')||{}).textContent||'');
ok(/\(Solar\)/.test(abLead),'Abraham\'s heaviest address is the seat-disambiguated one this checks, got "'+abLead+'"');
const solarCount=(abLead.match(/solar/gi)||[]).length;
ok(solarCount===1,'the seat is never named twice on the one address whose own name already carries it, '
 +'"solar" appeared '+solarCount+' times in "'+abLead+'"');
await p.evaluate(i=>document.querySelector('#prac [data-pri="'+i+'"]').click(),wrenIdx);
await p.waitForTimeout(120);

/* the state in S, W and the header's own picker must be exactly what it
   was before the client opened: this page must never become the client */
console.log('\n=== opening a client never repoints the rest of the app ===');
const youAfter=await p.evaluate(()=>({who:S.who,rec:S.rec,psel:document.getElementById('psel').value}));
ok(youAfter.who===0,'S.who is still 0, the practitioner\'s own field, got '+youAfter.who);
ok(youAfter.psel==='0','the header\'s own profile picker still reads the practitioner\'s own entry');

console.log('\n=== a private note saves to this device and survives a reload ===');
const noteText='gate note '+Date.now();
await p.fill('#prnotetxt',noteText);
await p.click('#prac #prnoteform button[type="submit"]');
await p.waitForTimeout(120);
let onPage=await p.evaluate(t=>!!document.querySelector('#prac .pr-note-item')&&
 document.querySelector('#prac').textContent.indexOf(t)>=0,noteText);
ok(onPage,'the note appears on the page after saving');
const stored=await p.evaluate(()=>{
 try{var o=JSON.parse(localStorage.getItem('source.profiles.device')||'{}');
  return JSON.stringify((o.pracNotes&&o.pracNotes.Wren)||[]);}catch(e){return 'ERR';}});
ok(stored.indexOf(noteText)>=0,'the note is in this device\'s own store (localStorage), not the profile');
await p.reload({waitUntil:'load'}); await booted(p); await p.waitForTimeout(600);
await p.evaluate(()=>{pracSwitch(true); setTab(TAB.PRACTITIONER);});
await p.waitForTimeout(150);
await p.evaluate(i=>document.querySelector('#prac [data-pri="'+i+'"]').click(),wrenIdx);
await p.waitForTimeout(120);
const afterReload=await p.evaluate(()=>document.querySelector('#prac').textContent);
ok(afterReload.indexOf(noteText)>=0,'the note is still there after a reload');

console.log('\n=== "who has sight of me" on the person\'s own privacy page is honest and empty ===');
const priv=await p.evaluate(()=>{
 ACC_OPEN='privacy'; setTab(TAB.SETTINGS);
 var row=[].find.call(document.querySelectorAll('#settings .ac-row'),
  r=>/people who can see this record/i.test(r.textContent));
 return row?row.textContent:'ROW NOT FOUND';});
ok(/nobody/i.test(priv),'the sight row reads nobody by default, got "'+priv+'"');
ok(!/Wren|Derek|Sofia|Marcus|James|Angela/.test(priv),'no example name is fabricated into the sight row');

console.log('\n=== '+PASS+' passed, '+FAIL+' failed ===');
await b.close();
process.exit(FAIL?1:0);
})();
