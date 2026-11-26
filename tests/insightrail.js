#!/usr/bin/env node
/* ============================================================
   THE INSIGHT RAIL, IN A REAL BROWSER. 18 November.

   env NODE_PATH=$(npm root -g) CHROME=/path/to/chromium node tests/insightrail.js
   INSIGHT_HTML=file      runs against another build, for checking the checker
   MUTANTS=1              runs the gate against its own mutants and says which
                          check caught each one
   MUT_ONLY=a,b           with MUTANTS=1, only the mutants named

   The owner, 18 November, on the right rail: "The insight panel at the very top
   should say insight. Whatever I select, it should give me source AI's reading
   of the cascade of that information, how it flows through me, and what the
   appropriate actions are. And then underneath that, it lists the stack from
   superego down, which I can run protocols against. When I click on the icons
   for saboteur, complex, hypercomplex, supercomplex, there's too much text in
   there. This should just be the bars... The insight panel will always show 3
   paragraphs with dots for more information that you can select and click
   through that panel. I don't think the nested complex or super complex, hyper
   complex, etc. on that right rail is the way to go. Let's unnest them." And
   then: "Everything beneath selection, including flow, including seats,
   including grandiosity and predatory and unbending and collapse... it's all
   repeat. Running now, grandiosity, that's all repeat, get rid of that. Laws of
   integrity. Yeah, they're all on diagnostics. Get rid of that."

   WHAT IT HOLDS, each a named check below:

     Insight is the first block of the rail and nothing of the old card is left
     nothing renders after Selection, on every surface
     whatever is selected is read: every kind of door fills Insight, and
       Insight never says nothing is selected while Selection shows a card
     the reading is three paragraphs, under their three fixed headers, carries
       the one Source AI mark, and stays short enough to reach the stack
     the dots page it: tap, arrow keys and swipe, a name each, 44 pixels each,
       a new selection starts at the first, and the block never changes height
     the stack is six levels from Superego down, in that order, unnested: no
       tab, no chevron, no Open all, no well, no Built from, and no paragraph in
       a row, each row a bar with a figure, each at least 44 pixels tall
     a level shows its six heaviest bars and ends in one More chip that opens
       the rest in place
     a bar has a second target, a run glyph at 44 pixels, that opens that
       item's release already loaded and never starts a run
     an overshot item is offered no release, and the safety line is the whole
       third paragraph, with no Release drawn, while the check holds
     the Selection card holds none of what it borrowed from Insight
     percents only, in the rail, in the dark and in Glass white
     an old store carrying keys the old rail kept loads clean
     390 wide fits: no sideways scroll, a gutter on both sides
     an unread record shows the doors and nothing else

   CHECKED AGAINST THE BUILD FROM BEFORE THIS CHANGE FIRST, the standing rule:
   run with INSIGHT_HTML at the c2bf52a2 build it fails the first thing it
   reads, by name, and passes on this one. MUTANTS=1 then breaks this build one
   way at a time and shows that each check is the one that notices.
   ============================================================ */
'use strict';
const fs=require('fs'), path=require('path'), os=require('os');
const {chromium}=require('playwright');
const SEED=require('./seed.js');
const SRC=process.env.INSIGHT_HTML?path.resolve(process.env.INSIGHT_HTML):path.resolve(__dirname,'..','source.html');
const CHROME=process.env.CHROME||chromium.executablePath();
const booted=pg=>pg.waitForFunction(()=>typeof isBooted==='function'&&isBooted(),null,{timeout:30000});

/* PERSON is the test helper every gate injects: a name to a roster index, and a
   throw rather than a wrong row when the roster changes (functional.js says why) */
const PERSON_FN=`window.PERSON=function(nm){
 for(var i=0;i<PEOPLE.length;i++)if(PEOPLE[i].nm===nm)return i;
 throw new Error(nm+' is not in the roster any more');};`;
async function open(browser,file,w,h,extra){
 const ctx=await browser.newContext({viewport:{width:w,height:h}});
 await ctx.addInitScript(SEED.FULL_SIGHT); await ctx.addInitScript(SEED.LCOL_SEED);
 await ctx.addInitScript(PERSON_FN);
 if(extra)await ctx.addInitScript(extra);
 const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(String(e.message)));
 await pg.goto('file://'+file+'?dev=1',{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(500);
 pg.errs=errs; return pg;}

/* the gate itself. ok() records into one list, so MUTANTS=1 can read which
   check noticed each break. */
async function gate(browser,file,ok){
 /* ---------- 1600, a loaded record, the heaviest in the roster ---------- */
 const pg=await open(browser,file,1600,1000);
 await pg.evaluate(()=>{loadP(PERSON('Lance 15'));setTab(TAB.FIELD);S.pin=null;rdClose();render();});
 await pg.waitForTimeout(300);

 /* FIRST: Insight is the first block, and the old card is gone */
 const top=await pg.evaluate(()=>{
  const rp=document.getElementById('rpanel');
  const vis=e=>e&&e.getBoundingClientRect().height>0&&getComputedStyle(e).display!=='none';
  const kids=[...rp.children].filter(e=>vis(e)&&!e.classList.contains('rfold')).map(e=>(e.getAttribute&&e.getAttribute('data-sec'))||e.id||e.className);
  const hd=document.querySelector('#rpanel .lsec[data-sec="you"] .lsec-hd');
  return {kids,head:hd?hd.textContent.trim():'',person:!!document.getElementById('person'),psum:!!document.getElementById('psum'),
   firstText:(rp.innerText||'').trim().split('\n')[0]};});
 ok(top.kids[0]==='you'&&top.head==='Insight'&&!top.person&&!top.psum,
  'FIRST: the rail opens on the word Insight and the Blueprint domain card is gone, '+JSON.stringify({kids:top.kids.slice(0,4),head:top.head,person:top.person}));

 /* NOTHING SELECTED: said in two parts, in both places */
 const none=await pg.evaluate(()=>({ins:(document.getElementById('insight')||{}).innerText||'',
  sel:(document.getElementById('rdrill-none')||{}).innerText||'',bRel:!!document.getElementById('bRel'),
  dots:document.querySelectorAll('#insight .ins-dot').length}));
 ok(/Nothing selected\./.test(none.ins)&&/Pick an address, a pattern or a row below to read it here\./.test(none.ins)&&!none.bRel&&none.dots===0,
  'NONE: with nothing picked Insight says so in two parts, draws no Release and no dots, '+JSON.stringify(none.ins.slice(0,90)));
 ok(/Nothing selected\./.test(none.sel)&&/Pick an address, a pattern or a row above to read it here\./.test(none.sel),
  'NONE: and so does Selection, in the same two parts, got '+JSON.stringify(none.sel.slice(0,90)));

 /* A HYPER COMPLEX SELECTED: the reading */
 await pg.evaluate(()=>{const r=computeSeen();S.pin=r.hys[0];runDrill(S.pin);render();});
 await pg.waitForTimeout(250);
 const rd=await pg.evaluate(()=>{
  const ins=document.getElementById('insight'); if(!ins)return null;
  const ps=[...ins.querySelectorAll('.ins-pg[data-on] .ins-p')];
  const words=ps.reduce((a,p)=>a+p.innerText.trim().split(/\s+/).length,0);
  const rdb=document.getElementById('insrd');
  const st=document.getElementById('stack');
  return {name:(ins.querySelector('.ins-nm')||{}).textContent||'',kind:(ins.querySelector('.ins-kd')||{}).textContent||'',
   fig:(ins.querySelector('.ins-fg')||{}).textContent||'',paras:ps.length,
   heads:ps.map(p=>(p.querySelector('b')||{}).textContent||''),words,
   marks:ins.querySelectorAll('.src-mk').length,ai:ps.filter(p=>p.classList.contains('src-ai')).length,
   italic:ps.some(p=>getComputedStyle(p).fontStyle==='italic'),
   rdTop:rdb?rdb.getBoundingClientRect().top:0,stackTop:st?st.getBoundingClientRect().top:0,
   rdH:rdb?Math.round(rdb.getBoundingClientRect().height):0,
   selHead:(document.getElementById('rdrill')||{}).innerText||''};});
 ok(rd&&rd.paras===3&&rd.heads.join('|')==='Where it sits.|How it runs.|What to do.',
  'READING: three paragraphs under the three fixed headers, '+JSON.stringify(rd&&rd.heads));
 ok(rd&&rd.marks===1&&rd.ai===3&&!rd.italic,
  'READING: one Source AI mark at the head of the block, every paragraph in the Source AI colour, none slanted, '+JSON.stringify({m:rd&&rd.marks,ai:rd&&rd.ai}));
 ok(rd&&rd.words>=60&&rd.words<=210,'READING: longer than the old one line and inside 210 words, '+(rd&&rd.words));
 ok(rd&&rd.name&&rd.kind==='Hyper complex'&&/^\d+%$/.test(rd.fig),
  'READING: the identity line is the name, the kind in words and a percent, '+JSON.stringify(rd&&{n:rd.name,k:rd.kind,f:rd.fig}));
 ok(rd&&rd.stackTop-rd.rdTop<800,'READING: the stack starts within a short scroll of the reading, '+(rd&&Math.round(rd.stackTop-rd.rdTop))+'px');

 /* THE SELECTION CARD HOLDS NONE OF WHAT IT BORROWED */
 const card=await pg.evaluate(()=>{
  const out={};
  const read=()=>(document.getElementById('rdrill').innerText||'').replace(/\s+/g,' ');
  const r=computeSeen();
  ['sab','cx','hy','sup'].forEach(k=>{const o=r[({sab:'sabs',cx:'cxs',hy:'hys',sup:'sups'})[k]][0]; S.pin=o; runDrill(o); out[k]=read();});
  S.pin=null; runFetterDrill(CHILD[4]); out.fet=read();
  return out;});
 const BORROWED=['The opposite','What happens','The sentence it runs','What becomes available','Next move','Runs under','Made of',
  'How it runs through you','Where it sits','Both halves','Which way it leans','What you might recognise','What it costs'];
 /* innerText applies the stylesheet's capitalize, so an eyebrow written 'Made of' reads 'Made Of'
    and a case sensitive match never saw it: found by the mutant that put Made of back */
 const dirty=[]; Object.keys(card).forEach(k=>BORROWED.forEach(b=>{if(card[k].toLowerCase().indexOf(b.toLowerCase())>=0)dirty.push(k+': '+b);}));
 ok(dirty.length===0,'CARD: the Selection card holds none of what it borrowed from Insight, '+JSON.stringify(dirty.slice(0,4)));
 ok(Object.keys(card).every(k=>/Addresses/.test(card[k])&&/\d+%|toward/.test(card[k])),
  'CARD: it keeps identity, the name, the kind, a figure and the addresses as rows, '+JSON.stringify(card.hy&&card.hy.slice(0,120)));

 /* A CHILD EMOTION: the line that used to sit in the card sits in the reading.
    Apathy's opposite is Joy since 21 November (engine/data/canon.js, the book's
    own words, 74564639). This asserted Vitality and went red on that ruling. */
 const fe=await pg.evaluate(()=>{S.pin=null;runFetterDrill(CHILD.find(c=>c.nm==='Apathy'));
  const ins=document.getElementById('insight');
  return {name:(ins.querySelector('.ins-nm')||{}).textContent||'',kind:(ins.querySelector('.ins-kd')||{}).textContent||'',
   text:ins.querySelector('.ins-pg[data-on]')?ins.querySelector('.ins-pg[data-on]').innerText.replace(/\s+/g,' '):'',
   card:(document.getElementById('rdrill').innerText||'').replace(/\s+/g,' ')};});
 ok(fe.name==='Apathy'&&fe.kind==='Child emotion'&&/Joy is its opposite/.test(fe.text)&&/Apathy is a child emotion/.test(fe.text)&&!/Where it sits|Both halves/.test(fe.card),
  'BORROWED: "child emotion Apathy", its opposite and where it sits are in the reading and not in the card, '+JSON.stringify({n:fe.name,k:fe.kind}));

 /* EVERY DOOR FILLS INSIGHT, and Insight never says nothing while Selection shows a card */
 const doors=await pg.evaluate(()=>{
  const out=[]; const r=computeSeen();
  const tries=[
   ['address',()=>runNodeDrill(W.slice().sort((a,b)=>b.sq-a.sq)[0])],
   ['child emotion',()=>runFetterDrill(CHILD[0])],
   ['domain',()=>runDomDrill(DOMAINS[S.doms[0]])],
   ['archetype',()=>runArchDrill(ARCH[0])],
   ['mask',()=>runMaskDrill(MASKS[0])],
   ['law',()=>runLawDrill(SI[0])],
   ['seat',()=>runSeatDrill(APC[0])],
   ['core',()=>runCoreDrill()],
   ['path',()=>runCompassDrill()],
   ['balance',()=>runBalDrill()],
   ['pole',()=>runPoleDrill('up')],
   ['saboteur',()=>{S.pin=r.sabs[0];runDrill(S.pin);}],
   ['complex',()=>{S.pin=r.cxs[0];runDrill(S.pin);}],
   ['super complex',()=>{S.pin=r.sups[0];runDrill(S.pin);}]];
  tries.forEach(([nm,fn])=>{
   S.pin=null; rdClose(); try{fn();}catch(e){out.push({nm,err:String(e.message)});return;}
   const card=document.getElementById('rdrill'), ins=document.getElementById('insight');
   const shown=card&&card.style.display!=='none'&&card.innerText.trim().length>0;
   out.push({nm,shown,nm2:(ins.querySelector('.ins-nm')||{}).textContent||'',
    none:/Nothing selected/.test(ins.innerText),paras:ins.querySelectorAll('.ins-pg[data-on] .ins-p').length});});
  S.pin=null; rdClose();
  return out;});
 const bad=doors.filter(d=>d.err||!d.shown||d.none||!d.nm2||d.paras!==3);
 ok(doors.length===14&&bad.length===0,'DOORS: every kind of selection is read by Insight in three paragraphs while Selection shows its card, '
  +JSON.stringify(bad.slice(0,3)));

 /* THE DOTS */
 await pg.evaluate(()=>{const r=computeSeen();S.pin=r.sabs[0];runDrill(S.pin);render();});
 await pg.waitForTimeout(250);
 const dots=await pg.evaluate(()=>{
  const ds=[...document.querySelectorAll('#insight .ins-dot')];
  const h=()=>{const r=document.getElementById('insrd').getBoundingClientRect(); return Math.round(r.height);};
  const txt=()=>((document.querySelector('#insight .ins-pg[data-on]')||{}).innerText||'').replace(/\s+/g,' ').slice(0,60);
  const o={n:ds.length,sizes:ds.map(d=>{const r=d.getBoundingClientRect();return Math.round(r.width)+'x'+Math.round(r.height);}),
   labels:ds.map(d=>d.getAttribute('aria-label')),tips:ds.map(d=>d.getAttribute('data-tip')),
   current:ds.map(d=>d.getAttribute('aria-current')==='true'?1:0).join(''),first:txt(),h0:h(),hs:[]};
  for(let i=1;i<ds.length;i++){ds[i].click(); o.hs.push(h());}
  o.second=null;
  if(ds[1]){ds[1].click(); o.second=txt(); o.cur2=[...document.querySelectorAll('#insight .ins-dot')].map(d=>d.getAttribute('aria-current')==='true'?1:0).join('');}
  return o;});
 ok(dots.n>=2&&dots.n<=5&&dots.sizes.every(s=>{const [w,h]=s.split('x').map(Number);return w>=44&&h>=44;}),
  'DOTS: between two and five, each a 44 by 44 target, '+JSON.stringify({n:dots.n,s:dots.sizes}));
 ok(dots.labels.every((l,i)=>l===('Page '+(i+1)+' of '+dots.n+', '+l.replace(/^Page \d+ of \d+, /,'')))&&dots.labels.every(l=>/^Page \d+ of \d+, \S/.test(l||''))&&dots.tips.every(t=>/^Page \d+: .+\.$/.test(t||'')),
  'DOTS: each has its name and its short sentence, '+JSON.stringify(dots.labels));
 ok(dots.current==='10000'.slice(0,dots.n)&&dots.second&&dots.second!==dots.first&&dots.cur2==='01'+'000'.slice(0,dots.n-2),
  'DOTS: the first page is current, a tap on the second pages the reading to it, '+JSON.stringify({a:dots.first,b:dots.second,cur:dots.current,cur2:dots.cur2}));
 ok(dots.hs.every(h=>Math.abs(h-dots.h0)<=1),'DOTS: the reading never changes height as it pages, '+dots.h0+' then '+dots.hs.join(','));
 const keys=await pg.evaluate(()=>{
  const rdb=document.getElementById('insrd'); rdb.focus();
  const cur=()=>[...document.querySelectorAll('#insight .ins-dot')].findIndex(d=>d.getAttribute('aria-current')==='true');
  const k=(key)=>rdb.dispatchEvent(new KeyboardEvent('keydown',{key:key,bubbles:true}));
  insPage(0); const a=cur(); k('ArrowRight'); const b=cur(); k('ArrowRight'); const c=cur(); k('ArrowLeft'); const d=cur();
  return [a,b,c,d];});
 ok(keys.join()==='0,1,2,1','DOTS: the arrow keys page it, right and left, from the reading, '+keys.join());
 const swipe=await pg.evaluate(()=>{
  const rdb=document.getElementById('insrd'); insPage(0);
  const cur=()=>[...document.querySelectorAll('#insight .ins-dot')].findIndex(d=>d.getAttribute('aria-current')==='true');
  const ev=(t,x,y)=>rdb.dispatchEvent(new PointerEvent(t,{clientX:x,clientY:y,bubbles:true,pointerId:1}));
  ev('pointerdown',300,200); ev('pointerup',200,205); const a=cur();
  ev('pointerdown',200,200); ev('pointerup',300,205); const b=cur();
  ev('pointerdown',200,200); ev('pointerup',205,380); const c=cur();
  return [a,b,c];});
 ok(swipe.join()==='1,0,0','DOTS: a swipe left pages forward, a swipe right pages back, a scroll does neither, '+swipe.join());
 const reset=await pg.evaluate(()=>{
  const r=computeSeen(); insPage(2);
  S.pin=r.sabs[1];runDrill(S.pin);render();
  return [...document.querySelectorAll('#insight .ins-dot')].findIndex(d=>d.getAttribute('aria-current')==='true');});
 ok(reset===0,'DOTS: a new selection starts at the first page, '+reset);

 /* THE STACK */
 const st=await pg.evaluate(()=>{
  const lv=[...document.querySelectorAll('#stack .stk-lv')];
  const rows=[...document.querySelectorAll('#stack .stk-row')];
  const r=computeSeen();
  return {order:lv.map(l=>l.getAttribute('data-lv')),
   counts:lv.map(l=>({k:l.getAttribute('data-lv'),n:(l.querySelector('.stk-lc')||{}).textContent||'',rows:l.querySelectorAll('.stk-row').length,
     more:(l.querySelector('.stk-more')||{}).textContent||''})),
   want:{sup:r.sups.length,hy:r.hys.length,cx:r.cxs.length,sab:r.sabs.length},
   tip:lv.every(l=>(l.querySelector('.stk-lh').getAttribute('data-tip')||'').length>20),
   head:lv.map(l=>l.querySelector('.stk-lh svg')?1:0).join(''),
   old:{tab:document.querySelectorAll('#stack .stk-t,#stack .stk-tabs,#stack .stk-ind').length,
    chev:document.querySelectorAll('#stack .stk-x').length,all:document.querySelectorAll('#stack .stk-all,#stack .stk-tl').length,
    well:document.querySelectorAll('#stack .stk-well,#stack .stk-sum,#stack .stk-sl,#stack .stk-tier,#stack .stk-none').length,
    words:/Built from|Feeds|Reading|Open all|Close all/.test(document.getElementById('stack').innerText)},
   paras:document.querySelectorAll('#stack p').length,
   rowText:rows.map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(t=>/\.\s|[a-z]{4,}\s[a-z]{4,}\s[a-z]{4,}\s[a-z]{4,}/.test(t)).slice(0,3),
   rowH:Math.min.apply(null,rows.map(e=>Math.round(e.getBoundingClientRect().height))),
   rows:rows.length,bars:rows.filter(e=>e.querySelector('.rb-t,.rb2-t')).length,
   figs:rows.filter(e=>/(\d+%|–)/.test(e.innerText)).length};});
 const want=['ego','sup','hy','cx','sab','fet'];
 ok(st.order.join()===want.filter(k=>st.order.indexOf(k)>=0).join()&&['sup','hy','cx','sab','fet'].every(k=>st.order.indexOf(k)>=0),
  'STACK: six levels from Superego down, in that order, each one drawn, '+st.order.join());
 ok(st.old.tab===0&&st.old.chev===0&&st.old.all===0&&st.old.well===0&&!st.old.words&&st.paras===0,
  'STACK: unnested: no tab, no indicator, no chevron, no Open all, no well, no Built from or Feeds or Reading, no paragraph, '+JSON.stringify(st.old));
 ok(st.rowText.length===0&&st.bars===st.rows&&st.figs===st.rows,
  'STACK: every row is a bar with a figure and no sentence, '+JSON.stringify({rows:st.rows,bars:st.bars,figs:st.figs,text:st.rowText}));
 ok(st.rowH>=44,'STACK: every row is at least 44 pixels tall, '+st.rowH);
 ok(st.tip&&st.head==='1'.repeat(st.order.length),'STACK: every level header carries its symbol and its meaning on hover and tap, '+st.head);
 const cap=st.counts.filter(c=>['sup','hy','cx','sab'].indexOf(c.k)>=0);
 ok(cap.every(c=>+c.n===st.want[c.k]&&(c.rows<=6+0||/more/.test(c.more)||c.rows===st.want[c.k]))&&cap.some(c=>/\d+ more/.test(c.more)),
  'STACK: a level counts what runs, shows its six heaviest, and ends in one More chip for the rest, '+JSON.stringify(cap));
 /* NERVE STATE, 20 November: "I want to see those tiny little icons on these
    bars so people can see very clearly what the state of their nerve is."
    Every row in every tier wears one mark, its state is the one its own value
    reads through nerveStateOf, the four marks are four different drawings and
    not one drawing in four colours, and each one unpacks on hover and tap to
    its name and the range it covers. The value is read off the same field the
    row's own figure is printed from, never off the mark. */
 const ns=await pg.evaluate(()=>{
  const r=computeSeen(), rows=[...document.querySelectorAll('#stack .stk-row')];
  const valOf=row=>{
   const b=row.querySelector('.stk-r');
   if(b.hasAttribute('data-fet'))return S.charge[CHILD[+b.getAttribute('data-fet')].nm]||0;
   if(b.hasAttribute('data-amp'))return BY[+b.getAttribute('data-amp')].sq;
   const o=(r[INS_LIST[b.getAttribute('data-sk')]]||[])[+b.getAttribute('data-si')]; return o?o.w:null;};
  const per=rows.map(row=>{const m=row.querySelectorAll('.stk-ns'), v=valOf(row);
   return {n:m.length,k:m[0]&&m[0].getAttribute('data-ns'),want:v==null?null:nerveStateOf(v).k,
    tip:m[0]&&m[0].getAttribute('data-tip')||'',tk:m[0]&&m[0].getAttribute('data-tip-k')||'',
    lv:row.closest('.stk-lv').getAttribute('data-lv'),d:m[0]&&(m[0].querySelector('path')||{}).getAttribute&&m[0].querySelector('path').getAttribute('d'),
    w:m[0]?Math.round(m[0].getBoundingClientRect().width):0,first:row.firstElementChild&&row.firstElementChild.classList.contains('stk-ns')};});
  const draw={}; per.forEach(p=>{if(p.k)draw[p.k]=p.d;});
  const all=NERVESTATE.map(s=>s.k), glyph=all.map(k=>STK_NSGLYPH[k]);
  return {rows:per.length,lv:[...new Set(per.map(p=>p.lv))].join(','),
   one:per.every(p=>p.n===1&&p.first),wrong:per.filter(p=>p.k!==p.want).slice(0,3),
   tips:per.every(p=>/^Nerve state: /.test(p.tk)&&p.tip.indexOf(NERVESTATE.filter(s=>s.k===p.k)[0].def)===0),
   size:per.every(p=>p.w>=14&&p.w<=18),seen:Object.keys(draw).sort().join(','),
   glyphs:new Set(glyph).size===all.length&&per.every(p=>p.d===STK_NSGLYPH[p.k])};});
 ok(ns.rows>0&&ns.one,'NERVE: every row in every tier carries one nerve state mark, first in the row, '+JSON.stringify({rows:ns.rows,lv:ns.lv}));
 ok(!ns.wrong.length,'NERVE: each mark is the state its own row reads through nerveStateOf, '+JSON.stringify(ns.wrong));
 ok(ns.glyphs,'NERVE: the four states are four different drawings, and every mark draws its own');
 ok(ns.tips,'NERVE: every mark unpacks on hover and tap to its state and the range it covers');
 ok(ns.size,'NERVE: the mark is small, the level header glyph\'s own size');
 ok(ns.seen.split(',').length>=3,'NERVE: the loaded record shows a real spread of states, '+ns.seen);
 const more=await pg.evaluate(()=>{
  const lv=document.querySelector('#stack .stk-lv[data-lv="sab"]'); const before=lv.querySelectorAll('.stk-row').length;
  lv.querySelector('.stk-more').click();
  const lv2=document.querySelector('#stack .stk-lv[data-lv="sab"]');
  const after=lv2.querySelectorAll('.stk-row').length, w=computeSeen().sabs.length;
  const fewer=!!lv2.querySelector('.stk-more[data-less]');
  lv2.querySelector('.stk-more').click();
  return {before,after,w,fewer,back:document.querySelectorAll('#stack .stk-lv[data-lv="sab"] .stk-row').length,
   tabs:document.querySelectorAll('#stack .stk-t').length};});
 ok(more.before<more.w&&more.after===more.w&&more.fewer&&more.back===more.before&&more.tabs===0,
  'STACK: the More chip opens the rest of the level in place and Fewer shuts it, '+JSON.stringify(more));

 /* THE RUN GLYPH, the second target of a bar */
 const run=await pg.evaluate(async()=>{
  S.pin=null; rdClose(); render();
  const gl=[...document.querySelectorAll('#stack .stk-run:not(.off)')];
  const sizes=gl.map(g=>{const r=g.getBoundingClientRect();return Math.round(r.width)+'x'+Math.round(r.height);});
  const o={n:gl.length,small:sizes.filter(s=>{const [w,h]=s.split('x').map(Number);return w<44||h<44;}).length,names:gl.slice(0,3).map(g=>g.getAttribute('aria-label'))};
  const hy=document.querySelector('#stack .stk-run[data-run="hy"]');
  const was=RUN.open; o.was=was;
  /* a worked example first: it can never run (showOnly), so the press stops
     on the card, loaded, with the preview line in Begin's place */
  if(hy){o.example=showOnly(); hy.click(); await new Promise(z=>setTimeout(z,80));
   o.exOpen=RUN.open; o.exPhase=RUN.phase; o.exQueue=RUN.queue.length; relClose();}
  /* then the same record as a person's own, which is the case he pressed:
     the press goes past the card and the run has begun */
  const at=SHOW_RECS.indexOf(CURP); if(at>=0)SHOW_RECS.splice(at,1);
  render(); const hy2=document.querySelector('#stack .stk-run[data-run="hy"]');
  if(hy2){hy2.click(); await new Promise(z=>setTimeout(z,80));
   o.opened=RUN.open; o.queue=RUN.queue.length; o.phase=RUN.phase; o.started=RUN.t0>0&&RUN.phase!=='idle';
   if(RUN.open){relHush();RUN.phase='run';RUN.idx=1e9;relCoolDown();relClose();}}
  if(at>=0)SHOW_RECS.push(CURP);
  return o;});
 ok(run.n>0&&run.small===0,'RUN: every bar that can run has a 44 by 44 run glyph, '+JSON.stringify({n:run.n,small:run.small}));
 ok(run.example&&run.exOpen&&run.exPhase==='idle'&&run.exQueue>0,
  'RUN: on a worked example pressing it opens that item\'s release loaded and starts nothing, '+JSON.stringify(run));
 ok(run.opened&&run.queue>0&&run.started&&!run.was,
  'RUN: on a person\'s own record pressing it goes straight into the release protocol, '+JSON.stringify(run));

 /* BOTH POLES AND PICK SEVERAL, 20 November */
 const pk=await pg.evaluate(async()=>{
  S.pin=null; rdClose(); render();
  const r=computeSeen(), o={};
  const pl=[...document.querySelectorAll('#stack .stk-pl')];
  o.pl=pl.length; o.hy=r.hys.filter(x=>!x.over).length;
  o.hyPl=document.querySelectorAll('#stack .stk-lv[data-lv="hy"] .stk-pl').length;
  o.right=pl.map(e=>(e.querySelector('.rb2-p.r')||{}).textContent||'');
  o.agree=r.hys.filter(x=>!x.over).every(x=>{const p=insPole(x);
   const row=document.querySelector('#stack .stk-pl[data-sk="hy"][data-si="'+r.hys.indexOf(x)+'"] .rb2-p.r');
   return !row||(p&&row.textContent===p.t);});
  o.egoPl=document.querySelectorAll('#stack .stk-lv[data-lv="ego"] .stk-pl,#stack .stk-lv[data-lv="sup"] .stk-pl,#stack .stk-lv[data-lv="cx"] .stk-pl').length;
  stkPickToggle(true);
  o.rings=document.querySelectorAll('#stack .stk-pk').length; o.runs=document.querySelectorAll('#stack .stk-run[data-run]').length;
  document.querySelector('#stack .stk-pk[data-pk="hy"]').click();
  document.querySelector('#stack .stk-pk[data-pk="fet"]').click();
  o.n=STK_PICK.length; o.checked=document.querySelectorAll('#stack .stk-pk[aria-checked=true]').length;
  o.word=((document.getElementById('relq')||{}).innerText||'').indexOf('2 picked')>=0;
  const want=stkPickIds().ids; o.want=want.length;
  let got=null; const keep=window.relPick; window.relPick=function(ids){got=ids.slice(); return keep.apply(this,arguments);};
  document.getElementById('stkgo').click(); await new Promise(z=>setTimeout(z,80));
  window.relPick=keep;
  o.calls=got?got.length:-1; o.same=!!got&&got.join()===want.join(); o.open=RUN.open; o.cleared=STK_PICK.length===0&&!STK_PICKING;
  if(RUN.open)relClose();
  return o;});
 ok(pk.hyPl===pk.hy&&pk.agree&&pk.egoPl===0&&pk.right.every(t=>t.length>0),
  'POLES: every hyper complex and named saboteur draws its sourced opposite, and no level without one invents it, '+JSON.stringify(pk));
 ok(pk.rings>0&&pk.runs===0&&pk.n===2&&pk.checked===2&&pk.word&&pk.calls===pk.want&&pk.same&&pk.open&&pk.cleared,
  'PICK: Pick several turns the rings to picks, counts them, and releases them together in one relPick, '+JSON.stringify(pk));

 /* THE RELEASE BUTTON, in the reading */
 const rel=await pg.evaluate(async()=>{
  const r=computeSeen(); S.pin=r.hys[0]; runDrill(S.pin); render();
  const b=document.getElementById('bRel');
  const o={drawn:!!b,inReading:!!(b&&b.closest('#insight')),word:b?b.textContent.trim():'',
   h:b?Math.round(b.getBoundingClientRect().height):0,old:!!document.querySelector('#rpanel > div > #bRel,#rpanel > #bRel')};
  if(b){b.click(); await new Promise(z=>setTimeout(z,80)); o.opened=RUN.open; o.phase=RUN.phase; o.queue=RUN.queue.length;
   if(RUN.open){RUN.phase='run';RUN.idx=1e9;relCoolDown();relClose();}}
  return o;});
 ok(rel.drawn&&rel.inReading&&rel.word==='Release'&&rel.h>=44&&!rel.old,'RELEASE: one Release under the reading, in the reading, 44 pixels tall, '+JSON.stringify(rel));
 ok(rel.opened&&rel.phase!=='run'&&rel.queue>0,'RELEASE: it opens the release for what is selected and starts nothing, '+JSON.stringify({o:rel.opened,p:rel.phase,q:rel.queue}));

 /* THE REPEAT BLOCKS ARE GONE FROM EVERY SURFACE, and nothing renders after Selection */
 const surf=await pg.evaluate(async()=>{
  const out=[]; const tabs=TABDEF.map(t=>t.k).concat(Object.keys(TABEXTRA||{}).map(k=>TABEXTRA[k].k));
  const dupe=(a)=>a.filter((x,i)=>a.indexOf(x)===i);
  for(const k of dupe(tabs)){
   try{setTab(k); render();}catch(e){continue;}
   await new Promise(z=>setTimeout(z,60));
   const rp=document.getElementById('rpanel'); if(!rp)continue;
   const kids=[...rp.children];
   const selI=kids.findIndex(e=>e.getAttribute&&e.getAttribute('data-sec')==='sel');
   const after=kids.slice(selI+1).filter(e=>e.getBoundingClientRect().height>0&&getComputedStyle(e).display!=='none'&&!e.classList.contains('rfold'));
   out.push({k,selI,after:after.map(e=>e.id||e.getAttribute('data-sec')||e.className),
    bad:!!rp.querySelector('#eshelf,#run,#fire,[data-sec="flow"],[data-sec="running"],[data-sec="laws"]')});}
  return out;});
 ok(surf.length>=8&&surf.every(s=>s.selI>=0&&s.after.length===0&&!s.bad),
  'AFTER: on every surface nothing renders after Selection and Flow, Seats, Running now and the Laws are not on the rail, '
  +JSON.stringify(surf.filter(s=>s.selI<0||s.after.length||s.bad).slice(0,3))+' of '+surf.length);
 const laws=await pg.evaluate(()=>({n:document.querySelectorAll('#laws .nf').length,all:!!document.getElementById('allLaw'),
  inRail:!!document.querySelector('#rpanel #laws,#rpanel #allLaw'),hand:!!document.querySelector('#iqhand')}));
 ok(laws.n===21&&laws.all&&!laws.inRail&&laws.hand,'LAWS: the 21 law boxes and the all slider moved to the Intake fold, not lost, '+JSON.stringify(laws));
 await pg.evaluate(()=>{setTab(TAB.QUESTIONS);render();}); await pg.waitForTimeout(500);
 /* the Intake page is TAB.QUESTIONS (host #iqp). TAB.INTAKE is the Avatar and keeps its old name,
    and its Energetics body is hidden there, so the fold has no height on that tab and is not lost */
 const fold=await pg.evaluate(()=>{const f=document.getElementById('iqhand'); return {inPage:!!(f&&f.closest('#iqp')),seen:!!(f&&f.getBoundingClientRect().height>0),
  boxes:f?f.querySelectorAll('.nf').length:0};});
 ok(fold.inPage&&fold.seen&&fold.boxes===21,'LAWS: and the fold is on the Intake page with all 21, '+JSON.stringify(fold));

 /* PERCENTS ONLY, in the rail, dark and Glass white */
 const dec=[];
 for(const th of ['','glass white']){
  const d=await pg.evaluate(async(th)=>{
   if(th){const b=[...document.querySelectorAll('#themes button')].find(x=>/glass white|glasswhite/i.test((x.getAttribute('aria-label')||'')+' '+x.textContent+' '+(x.getAttribute('data-theme')||'')));
    if(b)b.click();}
   setTab(TAB.FIELD); const r=computeSeen(); S.pin=r.cxs[0]; runDrill(S.pin); render(); await new Promise(z=>setTimeout(z,300));
   const t=document.getElementById('rpanel').innerText;
   return {th,theme:document.body.className,n:(t.match(/\d+(\.\d+)?%/g)||[]).length,bad:(t.match(/\d+\.\d+/g)||[]).slice(0,4),
    nan:/NaN|undefined|null/.test(t)};},th);
  dec.push(d);}
 ok(dec.every(d=>d.n>10&&d.bad.length===0&&!d.nan),'PERCENT: only whole percents in the rail, no decimal, no NaN, in both lightings, '+JSON.stringify(dec.map(d=>({n:d.n,bad:d.bad}))));
 await pg.evaluate(()=>{const b=[...document.querySelectorAll('#themes button')].find(x=>/dark|lumen|night/i.test((x.getAttribute('aria-label')||'')+' '+x.textContent)); if(b)b.click();});

 /* OVERSHOT: no release, anywhere in the rail */
 await pg.evaluate(()=>{loadP(PERSON('Sofia'));setTab(TAB.FIELD);S.pin=null;rdClose();render();});
 const ov=await pg.evaluate(async()=>{
  const r=computeSeen();
  const o=[].concat(r.sups,r.hys,r.cxs,r.sabs).find(x=>x.over);
  if(!o)return {none:true};
  S.pin=o; runDrill(o); render(); await new Promise(z=>setTimeout(z,150));
  const row=[...document.querySelectorAll('#stack .stk-r[data-sk]')].find(b=>{const rr=computeSeen()[({sab:'sabs',cx:'cxs',hy:'hys',sup:'sups'})[b.getAttribute('data-sk')]][+b.getAttribute('data-si')];return rr&&rr.nm===o.nm&&rr.kind===o.kind;});
  const glyph=row&&row.parentNode.querySelector('.stk-run:not(.off)');
  const p3=[...document.querySelectorAll('#insight .ins-pg[data-on] .ins-p')][2];
  return {nm:o.nm,bRel:!!document.getElementById('bRel'),glyph:!!glyph,p3:p3?p3.innerText.replace(/\s+/g,' '):'',tip:row?(row.getAttribute('data-tip')||''):''};});
 ok(!ov.none&&!ov.bRel&&!ov.glyph&&/opposite pushed past where it helps/.test(ov.p3),
  'OVERSHOT: no Release and no run glyph on an overshot pattern, and the reading says why, '+JSON.stringify(ov));

 /* THE SAFETY LINE is the whole third paragraph and no Release is drawn */
 await pg.evaluate(()=>{loadP(PERSON('Lance 15'));setTab(TAB.FIELD);const r=computeSeen();S.pin=r.hys[0];runDrill(S.pin);render();});
 const safe=await pg.evaluate(async()=>{
  const was=window.stSafe; window.stSafe=function(){return true;}; stSafe=window.stSafe;
  insRefresh(); await new Promise(z=>setTimeout(z,100));
  const ps=[...document.querySelectorAll('#insight .ins-pg[data-on] .ins-p')];
  const o={bRel:!!document.getElementById('bRel'),glyphs:document.querySelectorAll('#stack .stk-run:not(.off)').length,
   p3:ps[2]?ps[2].innerText.replace(/\s+/g,' ').trim():'',q:CRISIS_SAY.q};
  window.stSafe=was; stSafe=was; insRefresh();
  return o;});
 ok(!safe.bRel&&safe.glyphs===0&&safe.p3==='What to do. '+safe.q,
  'SAFETY: with the check on, the third paragraph is the one safety line and no Release is drawn anywhere, '+JSON.stringify({b:safe.bRel,g:safe.glyphs,p3:safe.p3.slice(0,80)}));

 /* A STALE STORE LOADS CLEAN */
 const stale=await open(browser,file,1600,1000,`(function(){try{
  localStorage.setItem('rcol','open'); localStorage.setItem('stacktab','sab'); localStorage.setItem('stkopen','{"/sup:Grandiosity":true}');
  localStorage.setItem('stk','{"tab":"hy","open":{"/hy:Collapse":1}}'); localStorage.setItem('opensec','{"right":{"flow":1,"running":1,"laws":1}}');
  localStorage.setItem('source.rail','{"tab":"fet","well":true}');}catch(e){}})();`);
 /* a throw in the render is a failed check with a name, not a dead gate */
 let stThrew='';
 try{await stale.evaluate(()=>{loadP(PERSON('Gordon'));setTab(TAB.FIELD);const r=computeSeen();S.pin=r.sabs[0];runDrill(S.pin);render();});}
 catch(e){stThrew=String((e&&e.message)||e).split('\n')[0].slice(0,80);}
 await stale.waitForTimeout(300);
 const sv=await stale.evaluate(()=>({reads:document.querySelectorAll('#insight .ins-pg[data-on] .ins-p').length,levels:document.querySelectorAll('#stack .stk-lv').length}));
 ok(!stThrew&&stale.errs.length===0&&sv.reads===3&&sv.levels>=5,'STALE: a store that carries the old rail\'s keys loads clean and reads, '+JSON.stringify({threw:stThrew,errs:stale.errs.slice(0,2),sv}));
 await stale.context().close();

 ok(pg.errs.length===0,'ERRORS: no page error through the whole walk, '+JSON.stringify(pg.errs.slice(0,2)));
 await pg.context().close();

 /* ---------- an unread record: the doors and nothing else ---------- */
 const bl=await open(browser,file,1600,1000);
 await bl.evaluate(()=>{loadP(0);setTab(TAB.FIELD);S.pin=null;rdClose();render();});
 await bl.waitForTimeout(300);
 const b0=await bl.evaluate(()=>({start:(document.getElementById('start')||{}).innerText||'',startShown:!!document.getElementById('start')&&!document.getElementById('start').hidden,
  ins:(document.getElementById('insight')||{}).innerHTML||'',stack:(document.getElementById('stack')||{}).innerHTML||'',
  bars:document.querySelectorAll('#stack .stk-row,#stack .rb-f,#insight .ins-dot').length,bRel:!!document.getElementById('bRel'),
  head:((document.querySelector('#rpanel .lsec[data-sec="you"] .lsec-hd')||{}).textContent||'').trim()}));
 ok(b0.head==='Insight'&&b0.startShown&&b0.start.length>20&&b0.ins.trim()===''&&b0.stack.trim()===''&&b0.bars===0&&!b0.bRel,
  'BLANK: an unread record shows Insight and the Where to start doors, no reading, no dots, no Release and no bar, '+JSON.stringify({s:b0.start.slice(0,40),bars:b0.bars,ins:b0.ins.length}));
 await bl.context().close();

 /* ---------- 390: it fits ---------- */
 const ph=await open(browser,file,390,844);
 await ph.evaluate(()=>{loadP(PERSON('Lance 15'));setTab(TAB.FIELD);const r=computeSeen();S.pin=r.hys[0];runDrill(S.pin);render();});
 await ph.waitForTimeout(400);
 const fit=await ph.evaluate(()=>{
  const de=document.documentElement, W=innerWidth;
  const els=[...document.querySelectorAll('#insight .ins-id,#insight .ins-rd,#insight .ins-dots,#bRel,#stack .stk-lv,#stack .stk-row,#insight .ins-p')];
  const lo=Math.min.apply(null,els.map(e=>e.getBoundingClientRect().left)), hi=Math.max.apply(null,els.map(e=>e.getBoundingClientRect().right));
  const ins=document.getElementById('insight'); const f=document.querySelector('#rpanel .lsec[data-sec="you"]');
  const fr=f.getBoundingClientRect();
  return {over:de.scrollWidth>de.clientWidth+1,lo:Math.round(lo),hi:Math.round(hi),W,left:Math.round(fr.left),right:Math.round(W-fr.right),
   first:!!ins&&ins.querySelectorAll('.ins-p').length>=3,small:[...document.querySelectorAll('#insight .ins-dot,#bRel,#stack .stk-run:not(.off),#stack .stk-r')].filter(e=>{const r=e.getBoundingClientRect();return r.height>0&&(r.width<44||r.height<44);}).length};});
 ok(!fit.over&&fit.lo>=0&&fit.hi<=fit.W&&fit.left>=12&&fit.right>=12&&fit.small===0,
  '390: the rail fits, no sideways scroll, a gutter on both sides, every control 44 pixels, '+JSON.stringify(fit));
 const order=await ph.evaluate(()=>{const g=id=>{const e=document.getElementById(id); return e?e.getBoundingClientRect().top:-1;};
  return {stage:document.querySelector('.stage').getBoundingClientRect().top,insight:g('insight'),stack:g('stack'),sel:document.getElementById('rdrill').getBoundingClientRect().top};});
 ok(order.insight>order.stage&&order.stack>order.insight&&order.sel>order.stack,'390: stacked under the stage in the same order, the reading, the stack, then Selection, '+JSON.stringify(order));
 ok(ph.errs.length===0,'390: no page error, '+JSON.stringify(ph.errs.slice(0,2)));
 await ph.context().close();
}

/* ============================================================
   THE MUTANTS. Each one breaks this build in one way, by editing the built
   file, and names the check that must notice. A check that nothing notices is
   decoration, which is the standing rule for every gate here.
   ============================================================ */
const MUT=[
 ['person-card-back',"<div class=\"lsec open\" data-rail=\"right\" data-sec=\"you\">",'<div class="person" id="person">Blueprint Domain</div><div class="lsec open" data-rail="right" data-sec="you">','FIRST:'],
 ['flow-section-back','<!-- FLOW, SEATS, RUNNING NOW, THE LAWS AND THE OLD FOOT','<div class="lsec" data-rail="right" data-sec="flow"><button class="lsec-hd" type="button">Flow</button><div class="lsec-bd"><div id="eshelf">x</div></div></div><!-- FLOW, SEATS, RUNNING NOW, THE LAWS AND THE OLD FOOT','AFTER:'],
 ['two-paragraphs',"pg.paras.map(insParaHtml).join('')","pg.paras.slice(0,2).map(insParaHtml).join('')",'READING: three paragraphs'],
 ['no-source-mark',"'<div class=\"ins-mk\">'+srcMark()+","'<div class=\"ins-mk\">'+",'READING: one Source AI mark'],
 ['small-dots','.ins-dot{flex:0 0 var(--tap);width:var(--tap);height:var(--tap);','.ins-dot{flex:0 0 30px;width:30px;height:30px;','DOTS: between two and five'],
 ['dots-dead','function insPage(n){\n if(!INS_OUT)return;','function insPage(n){\n return;','DOTS: the first page is current'],
 ['no-arrow-keys',"if(e.key==='ArrowRight'){e.preventDefault(); insPage(INS_PAGE+1);}","",'DOTS: the arrow keys'],
 ['no-swipe','Math.abs(dx)>40&&','Math.abs(dx)>4000&&','DOTS: a swipe left'],
 ['page-kept-across-selections','if(out.id.key!==INS_KEY){INS_KEY=out.id.key; INS_PAGE=0;}','INS_KEY=out.id.key;','DOTS: a new selection starts'],
 ['height-jumps','.ins-pg[data-on]{opacity:1;visibility:visible;transition-delay:0s}','.ins-pg[data-on]{opacity:1;visibility:visible;transition-delay:0s}.ins-pg:not([data-on]){display:none}','DOTS: the reading never changes height'],
 ['levels-out-of-order',"[['sup','sups'],['hy','hys'],['cx','cxs'],['sab','sabs']].forEach(","[['hy','hys'],['sup','sups'],['cx','cxs'],['sab','sabs']].forEach(",'STACK: six levels'],
 ['sentence-in-a-row',"+stkAmount(o,nm,f)+'</button>'","+stkAmount(o,nm,f)+'</button><p class=\"stk-def\">Built from 5 held addresses. It runs on the charge at several places.</p>'",'STACK: unnested'],
 ['tab-row-back',"var sel=insSelNow(), L=stkLineage(sel,r), selKey=stkSelKey(sel), ctx=insCtx(), h='';","var sel=insSelNow(), L=stkLineage(sel,r), selKey=stkSelKey(sel), ctx=insCtx(), h='<div class=\"stk-tabs\"><button class=\"stk-t\" data-st=\"sab\">x</button></div>';",'STACK: unnested'],
 ['no-more-chip',"+(hidden>0?'<button type=\"button\" class=\"stk-more\"","+(false?'<button type=\"button\" class=\"stk-more\"",'STACK: a level counts what runs'],
 ['small-run-glyph','.stk-run{flex:0 0 var(--tap);width:var(--tap);min-height:var(--tap);','.stk-run{flex:0 0 30px;width:30px;min-height:30px;','RUN: every bar that can run'],
 ['run-glyph-stops-at-card',"if(RUN.open&&!RUN.mini&&!example&&(RUN.plan||[]).length&&typeof relBegin==='function')relBegin();","",'RUN: on a person'],
 ['pole-invented-for-superego',"var pole=o.over?null:stkPoleOf(o)","var pole=o.over?null:(stkPoleOf(o)||{nm:'Invented',def:''})",'POLES:'],
 ['picks-run-one-at-a-time',"var ok=insRunGo(got.ids);","var ok=insRunGo(got.ids.slice(0,1));",'PICK:'],
 ['borrowed-text-in-card',"+'<div class=\"pm-eye\">Addresses</div><div class=\"ad-rows\">'\n  +lv.slice(0,8)","+'<div class=\"pm-eye\">Made of</div><div class=\"ad-rows\">'\n  +lv.slice(0,8)",'CARD: the Selection card holds none'],
 ['decimal-in-identity',"if(obj)fig=fmtPct('chain',obj.w);","if(obj)fig=obj.w.toFixed(1)+'%';",'PERCENT:'],
 ['stale-key-throws',"function railStack(r){\n var e=document.getElementById('stack'); if(!e)return;","function railStack(r){\n var e=document.getElementById('stack'); if(!e)return;\n try{if(localStorage.getItem('stkopen'))throw new Error('stale key');}catch(x){if(x.message==='stale key')throw x;}",'STALE:'],
 ['rail-overflows-390','.ins-rd{position:relative;outline:none;border-radius:var(--r-xs)}','.ins-rd{position:relative;outline:none;border-radius:var(--r-xs);min-width:900px}','390: the rail fits'],
 ['blank-draws-bars',"if(r.unread){e.innerHTML=''; return;}","",'BLANK:'],
 ['safety-offer-kept',"if(x.ok&&ctx.safe)return {ok:false,ids:[],first:null,why:'safe'};","",'SAFETY:'],
 ['door-silent',"function runLawDrill(l){if(l){insDoor('law',l.nm);rdShell","function runLawDrill(l){if(l){rdShell",'DOORS:'],
 ['overshot-releases',"if(p.over){base.why='over';return base;}","",'OVERSHOT:'],
 ['nerve-mark-dropped-from-fet',"+stkNsHtml(cv,c.nm,fmtPct('charge',cv))+stkFetBar(ci,0)","+stkFetBar(ci,0)",'NERVE: every row'],
 ['nerve-state-read-off-wrong-value',"+stkNsHtml(o.w,o.nm,f)","+stkNsHtml(o.w/2,o.nm,f)",'NERVE: each mark is the state'],
 ['nerve-marks-one-drawing',"heavy:chainRing(12,12,STK_NSR)+'M4.8 12h14.4',","heavy:chainRing(12,12,STK_NSR)+'M4.8 12H12',",'NERVE: the four states'],
 ['nerve-mark-unexplained',"+' data-tip-k=\"'+esc('Nerve state: '+s.nm)+'\" data-tip=\"'+esc(s.def+' '+nm","+' data-tip-k=\"'+esc('Nerve state: '+s.nm)+'\" data-tip=\"'+esc(' '+nm",'NERVE: every mark unpacks'],
 ['laws-lost-from-intake',"if(f.parentNode!==host)host.appendChild(f);}","}",'LAWS: and the fold'],
];

async function main(){
 const browser=await chromium.launch({executablePath:CHROME});
 try{require('./net.js').guardBrowser(browser);}catch(e){}
 if(process.env.MUTANTS){
  const src=fs.readFileSync(SRC,'utf8'); let bad=0;
  const only=process.env.MUT_ONLY?process.env.MUT_ONLY.split(','):null;
  for(const [id,a,b,want] of MUT){
   if(only&&only.indexOf(id)<0)continue;
   const n=src.split(a).length-1;
   if(n!==1){console.log('  MUTANT '+id+': the text to break appears '+n+' times, not once'); bad++; continue;}
   const f=path.join(os.tmpdir(),'insightrail-mutant-'+id+'.html');
   fs.writeFileSync(f,src.replace(a,()=>b));
   const fails=[]; let threw='';
   try{await gate(browser,f,(c,m)=>{if(!c)fails.push(m);});}catch(e){threw=String(e&&e.message||e).slice(0,100);}
   try{fs.unlinkSync(f);}catch(e){}
   const hit=fails.filter(m=>m.indexOf(want)===0||m.indexOf(want)>=0);
   console.log((hit.length?'  CAUGHT ':'  MISSED ')+id.padEnd(30)+' by '+(hit[0]||fails[0]||threw||'nothing').slice(0,90)+(fails.length>1?'  (+'+(fails.length-1)+' more)':''));
   if(!hit.length)bad++;}
  await browser.close();
  console.log('\n  '+(only?only.length:MUT.length)+' mutants, '+bad+' missed');
  process.exit(bad?1:0);}
 let P=0,F=0;
 const ok=(c,m)=>{if(c)P++; else{F++;console.log('  FAIL  '+m);}};
 try{await gate(browser,SRC,ok);}catch(e){F++;console.log('  FAIL  the gate threw: '+(e&&e.stack||e));}
 await browser.close();
 console.log('\n===== '+P+' passed, '+F+' failed =====');
 process.exit(F?1:0);}
if(require.main===module)main();
module.exports={MUT,gate,SRC};
