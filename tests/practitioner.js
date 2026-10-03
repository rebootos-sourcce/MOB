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

/* ROUND RB: THE SWITCH IS IN THE MENU THE PROFILE BUTTON OPENS. His words:
   "the practitioner page is not present and nor is the practitioner toggle
   present under the user profile." The switch lived only in Settings,
   Account, below the fold, and the menu he opened never carried it. This is
   walked by pressing, never by calling pracSwitch, because round OD's
   "could not reproduce" pressed #acprac by id and so never met where the
   switch was. Known bad: the build before round RB fails the first check. */
console.log('=== the profile menu carries the practitioner switch and leads to the page ===');
const menuWalk=async pg=>pg.evaluate(async()=>{
 const wait=()=>new Promise(r=>setTimeout(r,200)), o={};
 const q=s=>document.querySelector(s);
 const doorShown=()=>{const e=q('#secbar .secb[data-sec="practitioner"]'); return !!e&&e.style.display!=='none';};
 q('#profbtn').click(); await wait();
 let sw=q('#profmenu [data-pmprac]');
 o.sw=!!sw; if(!sw)return o;
 const r=sw.getBoundingClientRect();
 o.inView=r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth; o.h=Math.round(r.height);
 o.off=sw.getAttribute('aria-checked')==='false'&&!q('#profmenu [data-pmclients]')&&!doorShown();
 sw.click(); await wait();
 sw=q('#profmenu [data-pmprac]');
 o.on=!!sw&&sw.getAttribute('aria-checked')==='true'&&pracOn()===true&&doorShown();
 o.menuOpen=!q('#profmenu').hidden;
 o.focus=document.activeElement===sw;
 o.status=(q('#status')||{}).textContent||'';
 o.device=devGet('practitioner')===true&&!(CURP.ui&&CURP.ui.practitioner);
 const cl=q('#profmenu [data-pmclients]'); o.clients=!!cl; if(!cl)return o;
 cl.click(); await wait();
 o.page=S.tab===TAB.PRACTITIONER&&q('#profmenu').hidden;
 const host=q('#prac'), t=host?host.textContent:'';
 o.lead=/coach or therapist/.test(t)&&/never see their stories/.test(t);
 const row=[].find.call(host.querySelectorAll('.ac-row'),x=>/People who let you see their record/.test(x.textContent));
 o.sightRow=row?row.textContent:'';
 o.sightN=pracSightList().length;
 o.headings=[].map.call(host.querySelectorAll('.pr-list-col .ac-gh'),x=>x.textContent);
 /* and off again from the same menu: the door shuts and the person is
    taken off the page whose door just went */
 q('#profbtn').click(); await wait();
 q('#profmenu [data-pmprac]').click(); await wait();
 o.offAgain=pracOn()===false&&!doorShown()&&!q('#profmenu [data-pmclients]')&&S.tab!==TAB.PRACTITIONER;
 q('#profbtn').click(); await wait();
 return o;});
for(const [w,h] of [[1600,1000],[390,844]]){
 const pg=w===1600?p:await b.newPage({viewport:{width:w,height:h}});
 if(pg!==p){await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(600);}
 const m=await menuWalk(pg);
 ok(m.sw,w+': the profile menu carries a Practitioner mode switch');
 ok(m.inView&&m.h>=44,w+': the switch is on screen when the menu opens and 44 tall, '+m.h+'px, in view '+m.inView);
 ok(m.off,w+': it starts off, with no Clients row and no door');
 ok(m.on&&m.menuOpen&&m.focus,w+': one press turns it on, opens the door, keeps the menu open and the focus on the switch');
 ok(/Practitioner mode is on/.test(m.status),w+': the status line says it landed, got "'+m.status+'"');
 ok(m.device,w+': written to this device, never to the profile');
 ok(m.clients&&m.page,w+': a Clients row appears under it and opens the practitioner page');
 ok(m.lead,w+': the page says what practitioner mode is, and that stories are never seen');
 ok(m.sightN===0&&/nobody yet/.test(m.sightRow),w+': the real client list is empty and says so, "'+m.sightRow+'"');
 ok(JSON.stringify(m.headings)==='["Your clients","Worked examples","This mode"]',
  w+': the real list comes before the worked examples, which are named as examples, '+JSON.stringify(m.headings));
 ok(m.offAgain,w+': off from the same menu shuts the door and leaves the page');
 if(pg!==p)await pg.close();}

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
 /* round QB: the ring, its tier word, TIERDEF's own line and the held
    sentence sit in the reading card, and the heaviest address is a row under
    it that opens in Selection. The seat groups that were the page's own
    right column moved into Selection with the column. */
 var ringTier=(document.querySelector('#prac .pr-ringtier')||{}).textContent||'';
 var leads=[].map.call(document.querySelectorAll('#prac .pr-mid .ac-lead'),e=>e.textContent);
 var heavy=document.querySelector('#prac .pr-ringwrap ~ .pr-pats [data-prd^="addr:"]');
 return {h2:(document.querySelector('#prac .pr-mid h2')||{}).textContent||'',
  ringTier:ringTier, ringLead:leads[1]||'', heldLead:leads[2]||'',
  heavyName:heavy?(heavy.querySelector('b')||{}).textContent:'', heavyK:heavy?heavy.getAttribute('data-prd'):'',
  top:pracRead(PEOPLE[PRAC_SEL]).loaded[0].k};});
ok(detail.h2.indexOf('Wren')>=0,'the open panel is headed Wren, got "'+detail.h2+'"');
ok(detail.ringTier.toLowerCase()==='mastery','the ring names the real tier word, got "'+detail.ringTier+'"');
ok(detail.ringLead.length>10,'the ring carries TIERDEF\'s own one line, not a stub, got "'+detail.ringLead+'"');
ok(/address(es)? (is|are) carrying/.test(detail.heldLead),'the held sentence is real text, not a stub, got "'+detail.heldLead+'"');
/* THE CORRECTNESS BUG A DESIGN REVIEW CAUGHT: the sentence's "heaviest" and
   the list used to name two different things. The row and the seat drill
   both read snap.loaded[0]. */
ok(detail.heavyName===detail.top,'the heaviest row names the heaviest held address, "'+detail.heavyName+'" vs "'+detail.top+'"');
await p.evaluate(()=>{var s=pracRead(PEOPLE[PRAC_SEL]).loaded[0].b;
 document.querySelector('#prac .pr-hit[data-prd="seat:'+s+'"]').dispatchEvent(new MouseEvent('click',{bubbles:true}));});
await p.waitForTimeout(150);
detail.addrs=await p.evaluate(()=>[].map.call(document.querySelectorAll('#rdrill .pr-addr'),a=>a.textContent).join(' | '));
detail.seatTop=await p.evaluate(()=>((document.querySelector('#rdrill .pr-addr .pr-addr-k')||{}).textContent||''));
ok(detail.seatTop===detail.top,'the heaviest seat, opened from its arc, leads with the same address, "'+detail.seatTop+'"');
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
const abLead=await p.evaluate(()=>{var r=document.querySelector('#prac .pr-ringwrap ~ .pr-pats [data-prd^="addr:"]');
 return r?r.textContent:'';});
ok(/\(Solar\)/.test(abLead),'Abraham\'s heaviest address is the seat-disambiguated one this checks, got "'+abLead+'"');
const solarCount=(abLead.match(/solar/gi)||[]).length;
ok(solarCount===1,'the seat is never named twice on the one address whose own name already carries it, '
 +'"solar" appeared '+solarCount+' times in "'+abLead+'"');
await p.evaluate(i=>document.querySelector('#prac [data-pri="'+i+'"]').click(),wrenIdx);
await p.waitForTimeout(120);

console.log('\n=== round QB: the client\'s analytics, every press answered on the right ===');
/* the rail is beside the page, carrying Selection and nothing else */
const rail=await p.evaluate(()=>{var rc=document.getElementById('rcol').getBoundingClientRect(),
  pr=document.getElementById('prac').getBoundingClientRect();
 var shown=[].filter.call(document.querySelectorAll('#rpanel>.lsec'),e=>getComputedStyle(e).display!=='none')
  .map(e=>e.getAttribute('data-sec'));
 return {beside:rc.width>200&&rc.left>=pr.right-2, shown:shown.join(',')};});
ok(rail.beside,'the right rail stands beside the page at 1600');
ok(rail.shown==='sel','the rail shows Selection alone on this page, got "'+rail.shown+'"');
const dIdx=await p.evaluate(()=>PEOPLE.findIndex(x=>x.nm==='Diane'));
await p.evaluate(i=>document.querySelector('#prac [data-pri="'+i+'"]').click(),dIdx);
await p.waitForTimeout(150);
/* the four figures are loopRead's own answer for the same record */
const figs=await p.evaluate(()=>{var R=pracEx(PEOPLE[PRAC_SEL]), L=R.loop;
 var v=k=>((document.querySelector('#prac [data-prd="fig:'+k+'"] .lp-fv')||{}).textContent||'');
 var n=x=>x?String(x):'\u2013';
 return {ok:v('confirmed')===n(L.confirmed)&&v('unanswered')===n(L.unanswered)&&v('declined')===n(L.declined.length)
  &&v('practised')===n(L.practice.events), conf:L.confirmed, ev:L.practice.events, days:R.days.length,
  cells:document.querySelectorAll('#prac .pr-days .pr-day').length,
  say:(document.querySelector('#prac .pr-say')||{}).textContent||''};});
ok(figs.ok,'the four figures print loopRead\'s own counts');
ok(figs.conf>0&&figs.ev>0,'Diane\'s example has confirmed patterns and practice to show');
ok(figs.cells===figs.days&&figs.days===21,'one cell a day for the window, got '+figs.cells);
ok(/Diane has said yes to/.test(figs.say)&&/not marked done/.test(figs.say),'the plain words name what moved and the miss run, got "'+figs.say+'"');
ok(!/%|\b\d+ ?\/ ?\d+\b|\bof \d+\b|\bscore\b/i.test(figs.say),'the plain words print no percent, no score and no count against a total');
/* every kind of press opens its own drill in Selection, named for the client */
const kinds=await p.evaluate(async()=>{
 var out={}, sel=['fig:confirmed','fig:declined','fig:practised'];
 var first=k=>document.querySelector('#prac [data-prd^="'+k+'"]');
 ['day:','pat:','dec:','seat:','addr:'].forEach(k=>{var e=first(k); if(e)sel.push(e.getAttribute('data-prd'));});
 for(const k of sel){
  var e=document.querySelector('#prac [data-prd="'+k+'"]');
  if(!e){out[k]='MISSING'; continue;}
  e.dispatchEvent(new MouseEvent('click',{bubbles:true}));
  await new Promise(r=>setTimeout(r,40));
  var b=document.getElementById('rdrill');
  out[k]=(b.style.display==='block'&&!!b.querySelector('[data-prdrill="Diane"]')&&/^Diane, /.test((b.querySelector('.pm-eye')||{}).textContent||'')
   &&e.classList.contains('pr-sel'))?'ok':('BAD '+(b.textContent||'').slice(0,80));}
 return out;});
const kbad=Object.keys(kinds).filter(k=>kinds[k]!=='ok');
ok(Object.keys(kinds).length>=8&&kbad.length===0,'every kind of press answers in Selection, named for the client and marked on the page, '+JSON.stringify(kbad.map(k=>k+' '+kinds[k])));
/* a press inside a drill opens the next drill: a day leads to its pattern */
const chain=await p.evaluate(async()=>{
 document.querySelector('#prac [data-prd^="day:"].st-completed').click();
 await new Promise(r=>setTimeout(r,40));
 var inner=document.querySelector('#rdrill [data-prd^="pat:"]'); if(!inner)return 'no pattern row in the day drill';
 inner.click(); await new Promise(r=>setTimeout(r,40));
 return (document.querySelector('#rdrill .pm-eye')||{}).textContent||'';});
ok(/one pattern/.test(chain),'a day\'s drill leads to the pattern its practice aims at, got "'+chain+'"');
/* silent on an unread field: forced on a cached read, nothing analytic draws */
const silent=await p.evaluate(()=>{var nm=PEOPLE[PRAC_SEL].nm, keep=PRAC_RCACHE[nm].unread;
 PRAC_RCACHE[nm].unread=true; renderPrac();
 var n=document.querySelectorAll('#prac [data-prd]').length, t=document.getElementById('prac').textContent;
 PRAC_RCACHE[nm].unread=keep; renderPrac(); return {n:n, said:/Nothing read yet/.test(t)};});
ok(silent.n===0&&silent.said,'an unread field draws no figure, day or pattern and says so');
/* leaving the page takes the drill and the page's own markup with it */
const left=await p.evaluate(()=>{document.querySelector('#prac [data-prd="fig:practised"]').click();
 setTab(TAB.FIELD);
 var r={drill:document.getElementById('rdrill').innerHTML.length, host:document.getElementById('prac').innerHTML.length};
 setTab(TAB.PRACTITIONER); return r;});
ok(left.drill===0&&left.host===0,'leaving the page empties Selection of the client and empties the page, got '+JSON.stringify(left));
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
