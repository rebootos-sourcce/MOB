/* ============================================================
   THE PRACTITIONER PAGE, GATED. node tests/practitioner.js

   REBUILT, round [Phase 1], his ruling (CLAUDE.md quotes it verbatim):
   "Bring back the left rail, and move the clients there. The right rail is
   our system information window. In the centre, the person's body map."
   The three column layout this replaces (PR1 to PR4, round PT) fails every
   assertion below, which is checked once as the known bad case: a gate
   that cannot fail is not a gate, the rule tests/boot.js and tests/daily.js
   both already carry.

   Run from the repo root: NODE_PATH=<playwright install> node tests/practitioner.js
   ATUNED_FILE overrides the build under test, the same convention every
   other browser gate here uses (tests/collide.js, tests/design.js).
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const booted=async p=>{try{await p.waitForFunction(
 ()=>document.body.classList.contains('booted'),null,{timeout:12000});}
catch(e){/* reduced motion clears it synchronously; a miss is not a failure */}};

let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};

(async()=>{
const b=await chromium.launch({executablePath:CHROME});
require('./net.js').guardBrowser(b);
const p=await b.newPage({viewport:{width:1600,height:1000}});
await p.goto(FILE,{waitUntil:'load'}); await booted(p); await p.waitForTimeout(600);

/* ROUND RB: THE SWITCH IS IN THE MENU THE PROFILE BUTTON OPENS. His words:
   "the practitioner page is not present and nor is the practitioner toggle
   present under the user profile." Walked by pressing, never by calling
   pracSwitch. Known bad: the build before round RB fails the first check. */
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
 /* THE INTRO PARAGRAPH IS GONE, round [Phase 1]: "For a coach or therapist
    who works with other people..." lived as visible prose over the list
    and this page's own column is the left rail now, with nothing printed
    above it that duplicates what the rail's own rows already say. */
 const lhost=q('#prlist');
 o.noIntro=!/coach or therapist/.test(document.body.textContent);
 /* THE CLIENTS HEADING AND ITS BUTTON, signed out, reads Sign in rather
    than Invite: Account, where the switch itself also lives, is one tap
    away through it. */
 o.headings=[].map.call(lhost.querySelectorAll('.pr-rail-h span:first-child'),x=>x.textContent);
 const signin=lhost.querySelector('[data-pr="signin"]');
 o.signin=!!signin&&/Sign in/.test(signin.textContent);
 o.sightN=pracSightList().length;
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
 ok(m.noIntro,w+': the old intro paragraph is gone from the page');
 ok(JSON.stringify(m.headings)==='["Clients","Examples"]',
  w+': the rail reads exactly Clients and Examples, no "Your" and no "Worked", got '+JSON.stringify(m.headings));
 ok(m.signin,w+': signed out, the Clients heading offers Sign in rather than an Invite button');
 ok(m.sightN===0,w+': the real client list is empty, got '+m.sightN);
 ok(m.offAgain,w+': off from the same menu shuts the door and leaves the page');
 if(pg!==p)await pg.close();}

/* the switch, as a device setting, the way a person actually reaches this
   page: turn it on, then press into the section the bar now shows */
await p.evaluate(()=>{pracSwitch(true); setTab(TAB.PRACTITIONER);});
await p.waitForTimeout(150);

console.log('=== the left rail lists real example people, by a real place word or a dash ===');
const rows=await p.evaluate(()=>[].map.call(document.querySelectorAll('#prlist .pr-client[data-pri]'),
 b=>({i:+b.getAttribute('data-pri'),t:b.textContent,
  val:((b.querySelector('.pr-cst')||{}).textContent||'').trim()})));
ok(rows.length>=10,'at least ten example people listed, got '+rows.length);
ok(rows.every(r=>!/not built yet/i.test(r.t)),'no row reads "not built yet"');
ok(rows.some(r=>/Wren/.test(r.t)),'Wren is in the list');
/* THE ONE VALUE IS A PLACE WORD, OR A DASH, NEVER A TIER OR A SCORE. "Get
   rid of the reading where it says severe," his words, named by the
   general case: no tier word, no percent, no fraction prints on this row
   any more, only OB_PLACES's own seven words. */
const PLACE_WORDS=['Pelvis','Belly','Stomach','Chest','Throat','Forehead','Head'];
ok(rows.every(r=>!/%|\b\d+(\.\d+)?\/\d+\b/.test(r.val)),'no row prints a percent or a score, '+JSON.stringify(rows.filter(r=>/%|\/\d/.test(r.val)).map(r=>r.val)));
ok(rows.every(r=>!/severe|moderate|mild|mastery|embodied|oscillating|contracted/i.test(r.val)),
 'no row prints a tier word, '+JSON.stringify(rows.filter(r=>/severe|moderate|mild|mastery|embodied|oscillating|contracted/i.test(r.val)).map(r=>r.val)));
ok(rows.every(r=>r.val==='–'||PLACE_WORDS.indexOf(r.val)>=0),
 'every row value is a real OB_PLACES word or a dash, got '+JSON.stringify(rows.filter(r=>r.val!=='–'&&PLACE_WORDS.indexOf(r.val)<0).map(r=>r.val)));

console.log('\n=== opening a client fills the centre: a name and a real, computed body figure ===');
const wrenIdx=await p.evaluate(()=>PEOPLE.findIndex(x=>x.nm==='Wren'));
ok(wrenIdx>=0,'Wren exists in PEOPLE');
await p.evaluate(i=>document.querySelector('#prlist [data-pri="'+i+'"]').click(),wrenIdx);
await p.waitForTimeout(150);
const detail=await p.evaluate(()=>{
 const h2=(document.querySelector('#prac .pr-centre h2')||{}),
  cv=document.querySelector('#prac canvas[data-prcv]'),
  ov=document.querySelector('#prac svg.pr-fig-ov');
 return {h2:h2.textContent||'', tip:h2.getAttribute('data-tip')||'',
  cv:!!cv, cvW:cv?cv.width:0, cvH:cv?cv.height:0,
  rings:ov?ov.querySelectorAll('.pr-fig-hit').length:0,
  acgf:!!document.querySelector('#prac .ac-gf'), aclead:!!document.querySelector('#prac .ac-lead'),
  /* loaded carries k and b, never i (pracRead, ui/practitioner.js): the
     index is looked up the same way pracAddrIdx already does it */
  top:pracAddrIdx(pracRead(PEOPLE[PRAC_SEL]).loaded[0])};});
ok(detail.h2.indexOf('Wren')>=0,'the centre is headed Wren, got "'+detail.h2+'"');
/* ROLE AND AGE MOVED TO A HOVER, round [Phase 1]: the symbol-first rule.
   The old visible sentence, "Example person, not a client...", is gone
   from the printed page and reachable on the name itself instead. */
ok(/Example person, not a client/.test(detail.tip),'the old description sentence is still reachable, on a hover, got "'+detail.tip+'"');
ok(detail.cv&&detail.cvW>50&&detail.cvH>20,'a real canvas is drawn for the figure, '+detail.cvW+'x'+detail.cvH);
ok(detail.rings>0,'the figure draws at least one pressable place ring, got '+detail.rings);
ok(!detail.acgf&&!detail.aclead,'no .ac-gf or .ac-lead remains on this page: the ring card and its prose are gone');

console.log('\n=== pressing the figure\'s heaviest place opens it, named, in Selection ===');
/* THE SAME CORRECTNESS BUG A DESIGN REVIEW ONCE CAUGHT, held as a gate: the
   row that opens must be the same address pracRead itself calls heaviest,
   never a different reading of the same figure. */
const heavyPress=await p.evaluate(a=>{
 const r=document.querySelector('#prac [data-prd="addr:'+a+'"]');
 if(!r)return {found:false};
 r.dispatchEvent(new MouseEvent('click',{bubbles:true}));
 return {found:true};},detail.top);
ok(heavyPress.found,'the heaviest address has a pressable ring on the figure');
await p.waitForTimeout(150);
const drill=await p.evaluate(()=>{
 const b=document.getElementById('rdrill'), inner=b&&b.querySelector('[data-prdrill]');
 return {shown:b&&b.style.display==='block', named:inner?inner.getAttribute('data-prdrill'):null,
  nm:(b&&b.querySelector('.ad-nm')||{}).textContent||'', marked:!!document.querySelector('#prac .pr-fig-hit.pr-sel')};});
const wantK=await p.evaluate(a=>BY[a].k,detail.top);
ok(drill.shown&&drill.named==='Wren',"the drill opens in Selection, named for Wren, got "+JSON.stringify(drill));
ok(drill.nm===wantK,'it names the same heaviest address pracRead reads, "'+drill.nm+'" vs "'+wantK+'"');
ok(drill.marked,'the pressed ring is marked selected on the figure');

console.log('\n=== round QB: the client\'s analytics, now in What is running, every press answered in Selection ===');
/* the rail reads What is running, Selection and Notes, in that order, and
   the left rail carries Clients. THE LEFT COLUMN STARTS SHUT ON HIS OWN
   RULING (GO, ui/ui.js colFold: "the left starts shut"), the same default
   every other tab already keeps, so this page opens it with its own fold
   control first rather than assuming it arrives open. */
const rail=await p.evaluate(()=>{
 if(document.body.classList.contains('lshut'))document.getElementById('lfold').click();
 const lc=document.getElementById('lcol'), rc=document.getElementById('rcol');
 var shown=[].filter.call(document.querySelectorAll('#rpanel>.lsec'),e=>getComputedStyle(e).display!=='none')
  .map(e=>e.getAttribute('data-sec'));
 var lshown=[].filter.call(document.querySelectorAll('#lpanel>.lsec'),e=>getComputedStyle(e).display!=='none')
  .map(e=>e.getAttribute('data-sec'));
 return {rails:[lc,rc].filter(c=>c&&c.offsetParent).map(c=>c.id).join(','), left:lshown.join(','), right:shown.join(',')};});
ok(rail.rails==='lcol,rcol','both rails stand at 1600, got '+rail.rails);
ok(rail.left==='prlist','the left rail, opened, shows only Clients, got '+rail.left);
ok(rail.right==='prrun,sel,prnotes','the right rail shows What is running, Selection, Notes, got '+rail.right);
const dIdx=await p.evaluate(()=>PEOPLE.findIndex(x=>x.nm==='Diane'));
await p.evaluate(i=>document.querySelector('#prlist [data-pri="'+i+'"]').click(),dIdx);
await p.waitForTimeout(150);
/* the four figures are loopRead's own answer for the same record, now in #prrun */
const figs=await p.evaluate(()=>{var R=pracEx(PEOPLE[PRAC_SEL]), L=R.loop;
 var v=k=>((document.querySelector('#prrun [data-prd="fig:'+k+'"] .lp-fv')||{}).textContent||'');
 var n=x=>x?String(x):'–';
 return {ok:v('confirmed')===n(L.confirmed)&&v('unanswered')===n(L.unanswered)&&v('declined')===n(L.declined.length)
  &&v('practised')===n(L.practice.events), conf:L.confirmed, ev:L.practice.events, days:R.days.length,
  cells:document.querySelectorAll('#prrun .pr-day').length,
  say:(document.querySelector('#prrun .pr-say')||{}).textContent||''};});
ok(figs.ok,'the four figures print loopRead\'s own counts, in the rail');
ok(figs.conf>0&&figs.ev>0,'Diane\'s example has confirmed patterns and practice to show');
ok(figs.cells===figs.days&&figs.days===21,'one cell a day for the window, got '+figs.cells);
ok(/Diane has said yes to/.test(figs.say)&&/not marked done/.test(figs.say),'the plain words name what moved and the miss run, got "'+figs.say+'"');
ok(!/%|\b\d+ ?\/ ?\d+\b|\bof \d+\b|\bscore\b/i.test(figs.say),'the plain words print no percent, no score and no count against a total');
/* every kind of press this page still exposes opens its own drill in
   Selection, named for the client. "seat:" has no element on the page any
   more since the ring card was deleted; its drill function stays reachable
   through pracOpen for a future caller and is not tested by a click here. */
const kinds=await p.evaluate(async()=>{
 var out={}, sel=[];
 ['day:','pat:','dec:','fig:'].forEach(k=>{var e=document.querySelector('[data-prd^="'+k+'"]'); if(e)sel.push(e.getAttribute('data-prd'));});
 for(const k of sel){
  var e=document.querySelector('[data-prd="'+k+'"]');
  if(!e){out[k]='MISSING'; continue;}
  e.dispatchEvent(new MouseEvent('click',{bubbles:true}));
  await new Promise(r=>setTimeout(r,40));
  var b=document.getElementById('rdrill');
  out[k]=(b.style.display==='block'&&!!b.querySelector('[data-prdrill="Diane"]')&&/^Diane, /.test((b.querySelector('.pm-eye')||{}).textContent||'')
   &&e.classList.contains('pr-sel'))?'ok':('BAD '+(b.textContent||'').slice(0,80));}
 return out;});
const kbad=Object.keys(kinds).filter(k=>kinds[k]!=='ok');
ok(Object.keys(kinds).length>=3&&kbad.length===0,'every remaining kind of press answers in Selection, named for the client and marked on the page, '+JSON.stringify(kbad.map(k=>k+' '+kinds[k])));
/* a press inside a drill opens the next drill: a day leads to its pattern */
const chain=await p.evaluate(async()=>{
 const d=document.querySelector('[data-prd^="day:"].st-completed'); if(!d)return 'no completed day on the record';
 d.click();
 await new Promise(r=>setTimeout(r,40));
 var inner=document.querySelector('#rdrill [data-prd^="pat:"]'); if(!inner)return 'no pattern row in the day drill';
 inner.click(); await new Promise(r=>setTimeout(r,40));
 return (document.querySelector('#rdrill .pm-eye')||{}).textContent||'';});
ok(/one pattern/.test(chain),'a day\'s drill leads to the pattern its practice aims at, got "'+chain+'"');
/* silent on an unread field: forced on a cached read, the centre says so
   and draws no figure or pressable rings */
const silent=await p.evaluate(()=>{var nm=PEOPLE[PRAC_SEL].nm, keep=PRAC_RCACHE[nm].unread;
 PRAC_RCACHE[nm].unread=true; renderPrac();
 var n=document.querySelectorAll('#prac [data-prd],#prrun [data-prd]').length;
 var said=/Nothing read yet/.test(document.getElementById('prac').textContent);
 PRAC_RCACHE[nm].unread=keep; renderPrac(); return {n:n, said:said};});
ok(silent.n===0&&silent.said,'an unread field draws no figure, day or pattern and says so');
/* leaving the page empties every host this page owns */
const left=await p.evaluate(()=>{document.querySelector('#prrun [data-prd="fig:practised"]').click();
 setTab(TAB.FIELD);
 var r={drill:document.getElementById('rdrill').innerHTML.length, prac:document.getElementById('prac').innerHTML.length,
  prlist:document.getElementById('prlist').innerHTML.length, prrun:document.getElementById('prrun').innerHTML.length,
  prnotes:document.getElementById('prnotes').innerHTML.length};
 setTab(TAB.PRACTITIONER); return r;});
ok(left.drill===0&&left.prac===0&&left.prlist===0&&left.prrun===0&&left.prnotes===0,
 'leaving the page empties every host it owns, got '+JSON.stringify(left));
await p.evaluate(i=>document.querySelector('#prlist [data-pri="'+i+'"]').click(),wrenIdx);
await p.waitForTimeout(150);

console.log('\n=== opening a client never repoints the rest of the app ===');
const youAfter=await p.evaluate(()=>({who:S.who,rec:S.rec,psel:document.getElementById('psel').value}));
ok(youAfter.who===0,'S.who is still 0, the practitioner\'s own field, got '+youAfter.who);
ok(youAfter.psel==='0','the header\'s own profile picker still reads the practitioner\'s own entry');

console.log('\n=== a private note saves to this device and survives a reload ===');
/* Notes is a folded section by default, the right rail's last (shell/body.
   html), so its own header opens it before the form inside is reachable */
await p.evaluate(()=>{const s=document.querySelector('[data-sec="prnotes"]'); if(s&&!s.classList.contains('open'))s.querySelector('.lsec-hd').click();});
await p.waitForTimeout(150);
const noteText='gate note '+Date.now();
await p.fill('#prnotetxt',noteText);
await p.click('#prnotes #prnoteform button[type="submit"]');
await p.waitForTimeout(120);
let onPage=await p.evaluate(t=>!!document.querySelector('#prnotes .pr-note-item')&&
 document.querySelector('#prnotes').textContent.indexOf(t)>=0,noteText);
ok(onPage,'the note appears in Notes after saving');
const stored=await p.evaluate(()=>{
 try{var o=JSON.parse(localStorage.getItem('source.profiles.device')||'{}');
  return JSON.stringify((o.pracNotes&&o.pracNotes['ex:Wren'])||[]);}catch(e){return 'ERR';}});
ok(stored.indexOf(noteText)>=0,'the note is in this device\'s own store (localStorage), keyed by example, not the profile');
await p.reload({waitUntil:'load'}); await booted(p); await p.waitForTimeout(600);
await p.evaluate(()=>{pracSwitch(true); setTab(TAB.PRACTITIONER);});
await p.waitForTimeout(150);
await p.evaluate(i=>document.querySelector('#prlist [data-pri="'+i+'"]').click(),wrenIdx);
await p.waitForTimeout(150);
const afterReload=await p.evaluate(()=>document.getElementById('prnotes').textContent);
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
