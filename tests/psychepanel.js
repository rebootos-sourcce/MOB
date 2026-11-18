/* ============================================================
   THE PSYCHE PANEL HOLDS THREE THINGS. 18 November.

   His words, twice. First: "I asked you to get rid of everything in these two
   images. I asked you that a long time ago... Maybe keep the matrix for now,
   but get rid of everything else." Then his correction of how that was read:
   "I didn't say strip the psyche panel down to just a matrix. I'm saying
   everything that's from the word psyche. Like, I never asked you to put in
   the book levels. I don't even know what that is. I also asked you to remove
   the child emotions because we're going to have the person do self-reporting
   in the diagnostic. I also asked you to get rid of the chain. I don't even
   know what this is doing here. That got put in there by you automatically or
   automagically. Super ego. It needs to be more iconographic. You can keep
   super ego, but get rid of the laws of action. Or just make that action and
   give me them as 6 icons, so symbolic icons. Actually make it a bar. Make
   them all bars, like the ones for like CQ, vitality, energy, flow, etc. Make
   it a bar. And then super ego, make those icons. 4 icons horizontal. And make
   them symbolic. And give it a %. We don't do points anymore."

   The Field's left rail, under its Psyche heading, is Matrix, Superego and
   Action, in that order, and nothing else. This gate holds that, in a real
   Chromium, at 1600 and at 390, on a blank profile and on a loaded one.

     A  THE PANEL. Exactly those three sections, in that order, under the
        heading, and no sibling of them. None of the removed words is on the
        screen, read off the visible text AND the text inside the SVG, because
        innerText does not see SVG (CLAUDE.md, the monitor's lesson). No
        paragraph and no sub heading in Superego or Action.
     B  SUPEREGO. Four symbols in one row, evenly spaced, each at least the
        tap size, each ring stroked and never filled, each with its name and
        one sentence on hover and tap, each with a percent that is a whole
        number and a percent sign or the dash, and that percent is the ring's
        own fill. A press opens the address.
     C  ACTION. Six bars in the book's order, built by the one bar component
        the readings above them use (same classes, same dimensions as the
        Vitality bar), each with its gate's mark, name, percent and sentence,
        the three that keep the law told apart from the three that break it
        by colour, a gap and a hatch in every lighting. The percent is the
        fill. A press opens that gate's drill.
     D  NO POINTS. No decimal and no word points anywhere in the panel.
     E  AN OLD STORE. A browser carrying section keys from before this round
        loads without an error and the panel is the same three; nothing the
        product writes brings a removed section's key back; and the coercion
        the nine sliders used to share with every caller still turns a stored
        string into a number.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node tests/psychepanel.js
   ATUNED_FILE=path/to/other.html runs another build through the same gate,
   which is how it is shown to fail on the build from before this round (the
   baseline has six sections, so the first check fails there by name).

   CHECKED AGAINST KNOWN BAD CASES FIRST, 18 November, each a copy of the
   built file with one thing wrong, and each fails on the check written for it
   and on nothing it should not: the book's levels put back, Child emotions
   put back, the chain put back, the Superego paragraph and its sub heading put
   back, the Laws of Action paragraphs put back (A); the figure printed as a
   decimal, the word points in a spoken name, the four symbols wrapping to two
   rows at 390 only, a filled symbol, a verdict word on a defence (B and D); a
   bar with a 12 pixel track, a hand drawn copy of the bar, the fill not the
   percent, no hatch on the broken side, one colour for both sides, the six
   bars reversed (C); a stale store key that throws (E). The count is not
   written here: it is read off the run and held by tests/floors.json.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const J=JSON.stringify;
const booted=async p=>{
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}
 try{await p.waitForTimeout(600);
  await p.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();});
  await p.waitForTimeout(120);}catch(e){}};

/* WHAT HE REMOVED, as the words a person could read. Each is looked for in the
   visible text and in the SVG's own text, whatever case it is drawn in (the
   rail capitalises a title, so "Outside The Chain" is the same string). "Child
   emotions" is held to its capital C: the Matrix's own line, "19 domains x 9
   child emotions", is the same words in lower case and it stays. */
const GONE=[
 [/book.s (own )?levels/i,'the book\'s levels'],
 [/nine poled axes/i,'the nine poled axes'],
 [/Child emotions/,'Child emotions as a heading'],
 [/nerve to super-complex/i,'nerve to super-complex'],
 [/outside the chain/i,'outside the chain'],
 [/\bthe chain\b/i,'the chain'],
 [/hyper-complex|super-complex/i,'the legend\'s tier names'],
 [/colou?red by the seat|whichever seat/i,'the legend\'s sentences'],
 [/field anchors/i,'field anchors'],
 [/laws of action/i,'laws of action'],
 [/the six gates/i,'the six gates'],
 [/\bright action\b|\bwrong action\b/i,'the right and wrong action sub headings'],
 [/avoidance/i,'the avoidance line'],
 [/nothing read yet|write a line in the journal/i,'the empty state paragraphs'],
 [/builds a defen[cs]e|why seeing it does not change it/i,'the superego paragraph'],
 [/per cent/i,'per cent']];
/* the verdict words the old superego rows spoke, held off the spoken names and
   the tooltips as well as the page */
const VERDICT=/\b(impaired|heavily|blocked|moderately)\b/i;
const NAMES=['Awareness','Detachment','Intention','Ignorance','Attachment','Aversion'];
const FOUR=['Justification','Entitlement','Perfectionism','Obsession'];

/* in the page: the Psyche heading and everything after it in its column */
const BLOCK=`window.__psy=function(){
 var h=[...document.querySelectorAll('#lpanel h2.rblk')].filter(function(x){return x.textContent.trim()==='Psyche';})[0];
 var secs=[]; if(h)for(var e=h.nextElementSibling;e&&!(e.matches&&e.matches('h2.rblk'));e=e.nextElementSibling)secs.push(e);
 return {h:h,secs:secs};};
window.__R=function(el){var r=el.getBoundingClientRect();return {l:r.left,t:r.top,r:r.right,b:r.bottom,w:r.width,h:r.height};};
window.__openAll=function(){var b=window.__psy();b.secs.forEach(function(s){
 if(s.classList.contains('lsec')&&!s.classList.contains('open'))s.querySelector('.lsec-hd').click();});};`;
/* the person and the evidence, set the way a gate sets them */
const SETUP=(idx,mix)=>`(function(){loadP(${idx}); setTab(TAB.FIELD);
 Object.keys(VERPMIX).forEach(function(k){VERPMIX[k]=0;});
 var m=${J(mix)}; Object.keys(m).forEach(function(k){VERPMIX[k]=m[k];});
 render(); window.__openAll(); render();})()`;
const EVID={aware:3,detach:1,intent:2,ignore:4,attach:2,averse:1};

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 require('./net.js').guardBrowser(browser);
 const SEED=require('./seed.js');
 const states=[['blank',0,{}],['loaded',null,EVID]];

 for(const [W,H] of [[1600,1000],[390,844]]){
  const ctx=await browser.newContext({viewport:{width:W,height:H},reducedMotion:'reduce'});
  const page=await ctx.newPage();
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,140));});
  await page.addInitScript(SEED.FULL_SIGHT); await page.addInitScript(SEED.LCOL_SEED);
  await page.addInitScript(BLOCK);
  await page.goto(FILE,{waitUntil:'load'}); await booted(page);
  const derek=await page.evaluate(()=>PEOPLE.findIndex(x=>x.nm==='Derek'));

  for(const [st,idx0,mix] of states){
   const tag=W+' '+st+': ';
   const idx=idx0===null?derek:idx0;
   await page.evaluate(SETUP(idx,mix)); await page.waitForTimeout(450);

   /* ---------------- A. THE PANEL ---------------- */
   const A=await page.evaluate(()=>{
    var b=window.__psy();
    var norm=function(s){return s.replace(/\s+/g,' ').trim();};
    var svgText=[...document.querySelectorAll('#lpanel svg text,#lpanel svg title,#lpanel svg desc')].filter(function(t){
     return b.secs.some(function(s){return s.contains(t);});}).map(function(t){return t.textContent;}).join(' | ');
    var vis=b.secs.map(function(s){return s.innerText;}).join(' | ');
    var inSec=function(sel){return b.secs.filter(function(s){var d=s.getAttribute('data-sec');return d==='superego'||d==='gates';})
     .reduce(function(n,s){return n+s.querySelectorAll(sel).length;},0);};
    return {head:b.h?norm(b.h.textContent):null,
     kinds:b.secs.map(function(s){return s.tagName+'.'+s.className.split(' ')[0];}),
     keys:b.secs.map(function(s){return s.getAttribute('data-sec');}),
     names:b.secs.map(function(s){var hd=s.querySelector('.lsec-hd');return hd?norm(hd.textContent):'';}),
     open:b.secs.map(function(s){return s.classList.contains('open');}),
     vis:vis, svgText:svgText,
     paras:inSec('p,.tier1,.stk-def,.ad-p,.pm-eye,h3,h4'),
     gone:{chainkey:!!document.getElementById('chainkey'),chg:!!document.getElementById('chg'),
      allCh:!!document.getElementById('allCh'),allRep:!!document.getElementById('allRep'),gateavoid:!!document.getElementById('gateavoid'),
      levels:!!document.querySelector('.lsec[data-sec=levels]'),fetters:!!document.querySelector('.lsec[data-sec=fetters]'),
      chain:!!document.querySelector('.lsec[data-sec=chain]'),chk:document.querySelectorAll('.chk-row').length},
     mx:document.querySelectorAll('#mx button').length,
     mxCap:(document.querySelector('.lsec[data-sec=matrix] .lbl')||{textContent:''}).textContent.replace(/\s+/g,' ').trim()};});
   ok(A.head==='Psyche','A '+tag+'the panel keeps its Psyche heading, got '+J(A.head));
   ok(J(A.names)===J(['Matrix','Superego','Action'])&&J(A.keys)===J(['matrix','superego','gates'])
    &&A.kinds.every(k=>/^DIV\.lsec$/.test(k)),
    'A '+tag+'the panel holds exactly Matrix, Superego and Action, in that order, and nothing else, got '+J([A.names,A.kinds]));
   ok(A.open.every(Boolean),'A '+tag+'all three sections open, as a person opens them, got '+J(A.open));
   const hits=GONE.filter(g=>g[0].test(A.vis)||g[0].test(A.svgText)).map(g=>g[1]);
   ok(hits.length===0,'A '+tag+'none of the removed words is in the visible text or the SVG text, saw '+J(hits));
   ok(!A.gone.chainkey&&!A.gone.chg&&!A.gone.allCh&&!A.gone.allRep&&!A.gone.gateavoid&&!A.gone.levels&&!A.gone.fetters&&!A.gone.chain&&A.gone.chk===0,
    'A '+tag+'no removed section, slider or host is left in the document, '+J(A.gone));
   ok(A.paras===0,'A '+tag+'no paragraph and no sub heading in Superego or Action, saw '+A.paras);
   ok(A.mx===171&&/^19 domains\s*\u00d7\s*9 child emotions$/.test(A.mxCap),'A '+tag+'the Matrix is as it was, 171 cells and its own line, got '+J([A.mx,A.mxCap]));
   /* the sections sit an even distance apart: the gap above each is the same */
   const gaps=await page.evaluate(()=>{var b=window.__psy(),r=b.secs.map(window.__R);
    return r.slice(1).map(function(x,i){return x.t-r[i].b;});});
   ok(gaps.length===2&&Math.abs(gaps[0]-gaps[1])<=2,'A '+tag+'the gap between the three sections is even, got '+J(gaps.map(g=>+g.toFixed(1))));

   /* ---------------- B. SUPEREGO ---------------- */
   const B=await page.evaluate(()=>{
    var sec=document.querySelector('.lsec[data-sec=superego]'), body=sec.querySelector('.lsec-bd');
    var R=window.__R, bd=R(body);
    var cells=[...document.querySelectorAll('#amprows .amp-i')];
    return {n:cells.length, body:bd, unread:!!compute().unread,
     hdTip:sec.querySelector('.lsec-hd').getAttribute('data-tip'), hdTipK:sec.querySelector('.lsec-hd').getAttribute('data-tip-k'),
     want:{hd:unpackOf('Superego')},
     cells:cells.map(function(c){var rc=R(c), g=c.querySelector('.crb-g svg'), path=g&&g.querySelector('path');
      var cs=path?getComputedStyle(path):null, ring=c.querySelector('svg.crb-a circle:last-child');
      var C=ring?parseFloat(ring.getAttribute('stroke-dasharray')):0, off=ring?parseFloat(ring.getAttribute('stroke-dashoffset')):0;
      var v=(c.querySelector('.amp-v')||{}).textContent||'';
      var i=+c.getAttribute('data-amp-i'), a=AMPLIFIER.filter(function(x){return x.i===i;})[0]||{};
      return {nm:a.nm, rect:rc, v:v, tipK:c.getAttribute('data-tip-k'), tip:c.getAttribute('data-tip'), aria:c.getAttribute('aria-label')||'',
       wantTip:unpackOf(a.nm,'superego'), wantV:fmtPct('weight',BY[i].sq,{unread:!!compute().unread}),
       fill:cs?cs.fill:'', stroke:cs?cs.stroke:'', d:path?path.getAttribute('d'):'', arc:C>0?+(100*(1-off/C)).toFixed(1):null,
       scrollW:c.scrollWidth, clientW:c.clientWidth, tag:c.tagName, off:c.classList.contains('off'),
       cf:BY[i].cf};})};});
   ok(B.n===4&&J(B.cells.map(c=>c.nm))===J(FOUR),'B '+tag+'four symbols, Justification, Entitlement, Perfectionism, Obsession, got '+J(B.cells.map(c=>c.nm)));
   const tops=B.cells.map(c=>c.rect.t), lefts=B.cells.map(c=>c.rect.l);
   ok(B.cells.length===4&&Math.max(...tops)-Math.min(...tops)<=1&&lefts.every((l,i)=>i===0||l>lefts[i-1]+20),
    'B '+tag+'the four sit in one row, side by side, got '+J({tops:tops.map(t=>+t.toFixed(1)),lefts:lefts.map(t=>+t.toFixed(1))}));
   ok(B.cells.every(c=>c.rect.w>=40&&c.rect.h>=40),'B '+tag+'each symbol is at least 40 by 40, got '+J(B.cells.map(c=>[+c.rect.w.toFixed(1),+c.rect.h.toFixed(1)])));
   const sg=B.cells.slice(1).map((c,i)=>c.rect.l-B.cells[i].rect.r);
   const lead=B.cells.length?B.cells[0].rect.l-B.body.l:NaN, trail=B.cells.length?B.body.r-B.cells[B.cells.length-1].rect.r:NaN;
   ok(sg.length===3&&Math.max(...sg)-Math.min(...sg)<=1.5&&Math.abs(lead-trail)<=2,
    'B '+tag+'the row is even and centred, gaps '+J(sg.map(g=>+g.toFixed(1)))+' and lead '+lead+' against trail '+trail);
   ok(B.cells.every(c=>c.tag==='BUTTON'&&c.scrollW<=c.clientW+1),'B '+tag+'each is a button and nothing in it overflows');
   ok(B.cells.every(c=>c.d&&c.fill==='none'&&c.stroke!=='none'&&c.stroke!=='rgba(0, 0, 0, 0)')&&new Set(B.cells.map(c=>c.d)).size===4,
    'B '+tag+'each symbol is its own stroked mark and never filled, got '+J(B.cells.map(c=>[c.fill,c.stroke,(c.d||'').slice(0,12)])));
   ok(B.cells.every(c=>/^[0-9]+%$/.test(c.v)||c.v==='\u2013'),'B '+tag+'each figure is a whole number and a percent sign or the dash, got '+J(B.cells.map(c=>c.v)));
   ok(B.cells.every(c=>c.v===c.wantV),'B '+tag+'each figure is the registry\'s own, fmtPct weight, got '+J(B.cells.map(c=>[c.v,c.wantV])));
   ok(B.cells.every(c=>c.v==='\u2013'?(c.arc===null||c.arc<=0.5):(c.arc!==null&&Math.abs(c.arc-parseInt(c.v,10))<=1)),
    'B '+tag+'the ring is filled to the figure it prints, got '+J(B.cells.map(c=>[c.v,c.arc])));
   if(st==='blank')ok(B.cells.every(c=>c.v==='\u2013'&&c.off),'B '+tag+'a profile with nothing read prints the dash four times and draws them unlit, got '+J(B.cells.map(c=>c.v)));
   else ok(B.cells.some(c=>/^[0-9]+%$/.test(c.v)),'B '+tag+'a loaded profile reads a percent on at least one symbol, got '+J(B.cells.map(c=>c.v)));
   ok(B.cells.every(c=>c.tipK===c.nm&&c.tip&&c.tip===c.wantTip&&c.tip.split(/\s+/).length>=8),
    'B '+tag+'each symbol carries its name and its one sentence from the table, on hover and tap, got '+J(B.cells.map(c=>c.tip)));
   ok(B.cells.every(c=>c.aria.indexOf(c.nm)===0&&c.aria.indexOf(c.tip)>=0),'B '+tag+'and the spoken name carries both, got '+J(B.cells.map(c=>c.aria.slice(0,50))));
   ok(B.cells.every(c=>!VERDICT.test(c.aria)&&!VERDICT.test(c.tip)),'B '+tag+'no verdict word on a defence, saw '+J(B.cells.map(c=>c.aria).filter(a=>VERDICT.test(a))));
   const ent=B.cells.filter(c=>c.nm==='Entitlement')[0];
   ok(ent&&(ent.cf?!/no story reaches/.test(ent.tip):(/no story reaches/.test(ent.tip)&&ent.v==='\u2013')),
    'B '+tag+'Entitlement says so when no story can reach its address, and only then, got '+J(ent&&[ent.cf,ent.v,ent.tip]));
   ok(B.hdTip&&B.hdTip===B.want.hd&&B.hdTipK==='Superego','B '+tag+'the Superego header carries the meaning that used to be its paragraph, got '+J(B.hdTip));

   /* ---------------- C. ACTION ---------------- */
   const C=await page.evaluate(()=>{
    var sec=document.querySelector('.lsec[data-sec=gates]');
    var R=window.__R, bars=[...document.querySelectorAll('#gaterows .rbar')];
    var ref=document.querySelector('#keylo .rbar[data-q=xyz]');
    var shape=function(b){var q=function(s){return b.querySelector(s);};
     var f=function(el,p){return el?getComputedStyle(el)[p]:null;};
     return {cls:b.className.split(/\s+/).filter(function(c){return c&&c!=='off'&&c!=='gate-r'&&c!=='rb-gh'&&c!=='rb-hot';}).sort().join(' '),
      kids:[q('.rb-row')?1:0,q('.rb-n svg.rb-ic')?1:0,q('.rb-v')?1:0,q('.rb-t')?1:0,q('.rb-t .rb-f')?1:0,q('.rb-t .rb-h')?1:0,q('.rb-d')?1:0,b.querySelectorAll('.rb-t s').length].join(''),
      h:R(b).h, row:q('.rb-row')?R(q('.rb-row')).h:0, track:q('.rb-t')?R(q('.rb-t')).h:0,
      trackRad:f(q('.rb-t'),'borderTopLeftRadius'), trackBg:f(q('.rb-t'),'backgroundColor'),
      nFs:f(q('.rb-n'),'fontSize'), nFw:f(q('.rb-n'),'fontWeight'), vFs:f(q('.rb-v'),'fontSize'), vFw:f(q('.rb-v'),'fontWeight'),
      ic:q('.rb-ic')?R(q('.rb-ic')).w:0, pad:f(b,'paddingTop')+'/'+f(b,'paddingBottom'), minH:f(b,'minHeight'), disp:f(b,'display')};};
    var rd=compute();
    return {n:bars.length, ref:ref&&ref.offsetParent?shape(ref):null, unread:!!rd.unread,
     hdTip:sec.querySelector('.lsec-hd').getAttribute('data-tip'), hdTipK:sec.querySelector('.lsec-hd').getAttribute('data-tip-k'),
     wantHd:unpackOf('Action','rail'), heart:seatCol('Heart').toLowerCase(), root:seatCol('Root').toLowerCase(),
     bars:bars.map(function(b,i){var f=b.querySelector('.rb-f'), cs=f?getComputedStyle(f):null;
      var nm=(b.querySelector('.rb-n')||{}).textContent||'';
      return {nm:nm, v:(b.querySelector('.rb-v')||{}).textContent, w:parseFloat(b.getAttribute('data-w')), fillW:f?parseFloat(f.style.width):null,
       off:b.classList.contains('off'), gate:b.getAttribute('data-gate'), q:b.getAttribute('data-q'), side:b.getAttribute('data-side'),
       col:b.style.getPropertyValue('--c').trim().toLowerCase(), img:cs?cs.backgroundImage:'', fillBg:cs?cs.backgroundColor:'',
       tipK:b.getAttribute('data-tip-k'), tip:b.getAttribute('data-tip'), wantTip:unpackOf(nm,'gate'), aria:b.getAttribute('aria-label')||'',
       pct:verpRead().filter(function(v){return v.nm===nm;})[0], wantV:fmtPct('gate',(verpRead().filter(function(v){return v.nm===nm;})[0]||{}).pct,{unread:!verpRead().some(function(v){return v.pct>0;})}),
       rect:R(b), shape:shape(b), tag:b.tagName};})};});
   ok(C.n===6&&J(C.bars.map(b=>b.nm))===J(NAMES),'C '+tag+'six bars in the book\'s order, got '+J(C.bars.map(b=>b.nm)));
   ok(C.ref!==null,'C '+tag+'the Vitality bar the others are held against is on the page');
   if(C.ref){
    const same=(a,b)=>['cls','kids','h','row','track','trackRad','trackBg','nFs','nFw','vFs','vFw','ic','pad','minH','disp'].filter(k=>a[k]!==b[k]);
    ok(C.bars.every(b=>same(b.shape,C.ref).length===0),
     'C '+tag+'every bar is the same drawing as the Vitality bar, same classes, same parts and same dimensions, differing: '
     +J(C.bars.map(b=>same(b.shape,C.ref)).filter(d=>d.length)[0]||[])+' ref '+J(C.ref)+' got '+J((C.bars[0]||{}).shape));}
   ok(C.bars.every(b=>b.tag==='BUTTON'&&b.gate&&b.q===null),'C '+tag+'each bar is a button that names its gate and opens no reading');
   const gp=C.bars.slice(1).map((b,i)=>b.rect.t-C.bars[i].rect.b);
   ok(gp.length===5&&Math.abs(gp[0]-gp[1])<=1&&Math.abs(gp[3]-gp[4])<=1&&Math.abs(gp[0]-gp[3])<=1&&gp[2]-gp[0]>=6,
    'C '+tag+'the bars are evenly spaced and the three that keep the law stand apart from the three that break it, gaps '+J(gp.map(g=>+g.toFixed(1))));
   ok(C.bars.every(b=>/^[0-9]+%$/.test(b.v)||b.v==='\u2013'),'C '+tag+'each figure is a whole number and a percent sign or the dash, got '+J(C.bars.map(b=>b.v)));
   ok(C.bars.every(b=>b.v===b.wantV),'C '+tag+'each figure is the registry\'s own, fmtPct gate, got '+J(C.bars.map(b=>[b.v,b.wantV])));
   ok(C.bars.every(b=>b.tipK===b.nm&&b.tip&&b.tip===b.wantTip&&b.aria.indexOf(b.nm)===0&&b.aria.indexOf(b.tip)>=0),
    'C '+tag+'each bar carries its name and its one sentence, on hover, tap and in its spoken name, got '+J(C.bars.map(b=>b.tip&&b.tip.slice(0,30))));
   ok(C.hdTip&&C.hdTip===C.wantHd&&C.hdTipK==='Action','C '+tag+'the Action header carries its meaning, got '+J(C.hdTip));
   ok(C.bars.every((b,i)=>b.side===(i<3?'higher':'lower')),'C '+tag+'three keep the law and three break it, in that order, got '+J(C.bars.map(b=>b.side)));
   if(st==='blank'){
    ok(C.bars.every(b=>b.off&&b.v==='\u2013'&&b.w===0),'C '+tag+'nothing read, so six unlit bars and six dashes, got '+J(C.bars.map(b=>[b.off,b.v,b.w])));
   } else {
    const nums=C.bars.map(b=>parseInt(b.v,10)||0), sum=nums.reduce((a,b)=>a+b,0);
    ok(C.bars.every(b=>!b.off)&&Math.abs(sum-100)<=3,'C '+tag+'six read bars that add to one whole, got '+J(C.bars.map(b=>b.v))+' sum '+sum);
    ok(C.bars.every(b=>b.fillW!==null&&Math.abs(b.fillW-(parseInt(b.v,10)||0))<=1&&Math.abs(b.w-b.fillW)<=0.5),
     'C '+tag+'the percent is the fill, got '+J(C.bars.map(b=>[b.v,b.w,b.fillW])));
    ok(C.bars.every((b,i)=>b.col===(i<3?C.heart:C.root)),'C '+tag+'the three that keep the law are Heart\'s colour and the three that break it Root\'s, got '+J(C.bars.map(b=>b.col))+' want '+C.heart+' and '+C.root);
    ok(C.bars.slice(0,3).every(b=>b.img==='none')&&C.bars.slice(3).every(b=>/repeating-linear-gradient/.test(b.img)),
     'C '+tag+'the broken fill wears the hatch and the kept fill does not, got '+J(C.bars.map(b=>b.img.slice(0,24))));
   }

   /* ---------------- D. NO POINTS ---------------- */
   const D=await page.evaluate(()=>{var b=window.__psy();
    var txt=b.secs.map(function(s){return s.innerText;}).join(' | ');
    var attrs=[];b.secs.forEach(function(s){s.querySelectorAll('[aria-label],[data-tip],[title],[data-v]').forEach(function(e){
     ['aria-label','data-tip','title','data-v'].forEach(function(a){var v=e.getAttribute(a);if(v)attrs.push(v);});});});
    return {txt:txt, attrs:attrs.join(' | ')};});
   ok(!/\d+\.\d+/.test(D.txt)&&!/\d+\.\d+/.test(D.attrs),'D '+tag+'no decimal anywhere in the panel, saw '+J((D.txt+' '+D.attrs).match(/\S*\d+\.\d+\S*/g)));
   ok(!/\bpoints?\b/i.test(D.txt)&&!/\bpoints?\b/i.test(D.attrs),'D '+tag+'the word points is nowhere in the panel');
   ok(errs.length===0,'A '+tag+'no page error, saw '+J(errs.slice(0,3)));
  }

  /* ---------------- C, CONTINUED. A PRESS, A SINGLE GATE, EVERY LIGHTING ---------------- */
  try{
   const tag=W+' loaded: ';
   await page.evaluate(SETUP(derek,EVID)); await page.waitForTimeout(350);
   const P=await page.evaluate(()=>{
    var out={};
    var a=document.querySelector('#amprows .amp-i[data-amp-i]'); var before=(document.getElementById('rdrill')||{innerText:''}).innerText;
    a.click(); var d=document.getElementById('rdrill'); out.ampOpen=!!d&&d.innerText.length>0&&d.innerText!==before;
    out.ampName=(d&&d.innerText||'').slice(0,60);
    var bars=[...document.querySelectorAll('#gaterows .rbar')];
    bars[0].click(); out.kept=(document.querySelector('#rdrill .pm-eye')||{}).textContent;
    out.keptNm=(document.querySelector('#rdrill .ad-nm')||{}).textContent;
    bars=[...document.querySelectorAll('#gaterows .rbar')]; bars[3].click(); out.broke=(document.querySelector('#rdrill .pm-eye')||{}).textContent;
    out.brokeNm=(document.querySelector('#rdrill .ad-nm')||{}).textContent;
    if(typeof rdClose==='function')rdClose();
    return out;});
   ok(P.ampOpen,'B '+tag+'a press on a symbol opens its address, got '+J(P.ampName));
   ok(/^Right action$/i.test(P.kept||'')&&P.keptNm==='Awareness'&&/^Wrong action$/i.test(P.broke||'')&&P.brokeNm==='Ignorance',
    'C '+tag+'a press on a bar opens that gate\'s own drill, got '+J(P));
   /* ONE GATE ALONE reads a whole, and the five others read the dash and never 0% */
   await page.evaluate(SETUP(derek,{aware:1})); await page.waitForTimeout(250);
   const one=await page.evaluate(()=>[...document.querySelectorAll('#gaterows .rb-v')].map(e=>e.textContent));
   ok(one[0]==='100%'&&one.slice(1).every(v=>v==='\u2013'),'C '+tag+'one gate alone reads 100% and the five others the dash, never 0%, got '+J(one));
   /* EVERY LIGHTING. Both sides stay two things in each: two colours, one hatch. */
   await page.evaluate(SETUP(derek,EVID)); await page.waitForTimeout(250);
   const lights=await page.evaluate(async()=>{
    var out={};
    for(var i=0;i<LIGHTINGS.length;i++){
     var k=LIGHTINGS[i][0]; setLighting(k); await new Promise(function(r){setTimeout(r,160);});
     var bars=[...document.querySelectorAll('#gaterows .rbar')];
     var fills=bars.map(function(b){var f=getComputedStyle(b.querySelector('.rb-f'));return {bg:f.backgroundColor,img:f.backgroundImage};});
     var amp=[...document.querySelectorAll('#amprows .amp-i .crb-g svg path')].map(function(p){return getComputedStyle(p).stroke;});
     out[k]={kept:fills[0].bg, broke:fills[3].bg, hatchKept:/repeating/.test(fills[0].img), hatchBroke:/repeating/.test(fills[3].img),
      allKept:fills.slice(0,3).every(function(f){return f.bg===fills[0].bg;}), allBroke:fills.slice(3).every(function(f){return f.bg===fills[3].bg;}),
      amp:amp.every(function(s){return s&&s!=='none';}), ink:getComputedStyle(document.querySelector('#gaterows .rb-n')).color};}
    setLighting('dark'); return out;});
   const lk=Object.keys(lights);
   ok(lk.length>=7,'C '+tag+'every lighting was walked, '+lk.join(', '));
   ok(lk.every(k=>lights[k].kept!==lights[k].broke&&lights[k].allKept&&lights[k].allBroke&&!lights[k].hatchKept&&lights[k].hatchBroke),
    'C '+tag+'in every lighting the two sides are two colours and the broken side is hatched, got '+J(lk.filter(k=>!(lights[k].kept!==lights[k].broke&&lights[k].allKept&&lights[k].allBroke&&!lights[k].hatchKept&&lights[k].hatchBroke)).map(k=>[k,lights[k]])));
   ok(lk.every(k=>lights[k].amp),'B '+tag+'in every lighting the four symbols are drawn in a stroke');
   /* the narrow layout stacks the rail under the stage: every symbol and bar is still whole on the screen */
   const edge=await page.evaluate(()=>{var w=innerWidth;var bad=[...document.querySelectorAll('#amprows .amp-i,#gaterows .rbar')].filter(function(e){
    var r=e.getBoundingClientRect();return r.left<-0.5||r.right>w+0.5;}).length;return {bad:bad,sw:document.documentElement.scrollWidth,w:w};});
   ok(edge.bad===0&&edge.sw<=edge.w+1,'B '+tag+'nothing in the panel runs past the screen\'s edge and the page does not scroll sideways, got '+J(edge));
  }catch(e){ok(false,'B and C '+W+': the press, single gate and lighting checks could not run: '+String(e.message).slice(0,160));}


  /* ---------------- HOVER, once, at the wide size: the sentence shows ---------------- */
  if(W>=1000)try{
   await page.evaluate(SETUP(derek,EVID)); await page.waitForTimeout(250);
   const h1=await page.evaluate(()=>{var e=document.querySelector('#amprows .amp-i'); e.scrollIntoView({block:'center'});var r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,want:e.getAttribute('data-tip')};});
   await page.mouse.move(h1.x,h1.y); await page.waitForTimeout(800);
   const t1=await page.evaluate(()=>{var t=document.getElementById('tip');return t?t.innerText:'';});
   ok(h1.want&&t1.indexOf(h1.want)>=0,'B hover: a symbol shows its sentence in the one tooltip, got '+J(t1.slice(0,120)));
   const h2=await page.evaluate(()=>{var e=document.querySelector('#gaterows .rbar'); e.scrollIntoView({block:'center'});var r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,want:e.getAttribute('data-tip')};});
   await page.mouse.move(2,2); await page.waitForTimeout(300); await page.mouse.move(h2.x,h2.y); await page.waitForTimeout(800);
   const t2=await page.evaluate(()=>{var t=document.getElementById('tip');return t?t.innerText:'';});
   ok(h2.want&&t2.indexOf(h2.want)>=0,'C hover: a bar shows its sentence in the one tooltip, got '+J(t2.slice(0,120)));
  }catch(e){ok(false,'B and C hover: the tooltip checks could not run: '+String(e.message).slice(0,160));}

  await ctx.close();
 }

 /* ---------------- E. AN OLD STORE ----------------
    The five sections' open and shut state lives in memory (OPENSEC, ui/ui.js)
    and nothing the product writes names them, so there is no key to migrate.
    A browser that carries one all the same, from an older build or a tool,
    must load clean: the keys below are the names such a build would have
    used, beside the one real store key the rail does keep. */
 {
  const STALE={'lcol':'open','sec.levels':'1','sec.fetters':'1','sec.chain':'1','sec.superego':'1','sec.gates':'1',
   'opensec':J({left:{levels:1,fetters:1,chain:1,superego:1,gates:1,matrix:1},right:{you:1}}),
   'lsec':J({levels:'open',fetters:'open',chain:'open'}),'lsec.fetters':'open','psyche.levels':'1','psyche.chain':'1'};
  const ctx=await browser.newContext({viewport:{width:1600,height:1000},reducedMotion:'reduce'});
  const page=await ctx.newPage();
  const errs=[]; page.on('pageerror',e=>errs.push(e.message)); page.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,140));});
  await page.addInitScript(SEED.FULL_SIGHT); await page.addInitScript(BLOCK);
  await page.addInitScript(`(function(){try{var s=${J(STALE)};Object.keys(s).forEach(function(k){localStorage.setItem(k,s[k]);});}catch(e){}})();`);
  await page.goto(FILE,{waitUntil:'load'}); await booted(page);
  await page.evaluate(SETUP(0,{}));
  const old=await page.evaluate(()=>{var b=window.__psy();
   return {names:b.secs.map(s=>s.querySelector('.lsec-hd').textContent.trim())};});
  ok(errs.length===0,'E an old store with the removed sections\' keys loads without an error, saw '+J(errs.slice(0,3)));
  ok(J(old.names)===J(['Matrix','Superego','Action']),'E and the panel is the same three, got '+J(old.names));
  /* the product writes nothing under a removed section's name: open and shut every section, then read the store */
  await page.evaluate(()=>{Object.keys(localStorage).filter(k=>/^(sec\.|lsec|opensec|psyche\.)/.test(k)).forEach(k=>localStorage.removeItem(k));
   window.__psy().secs.forEach(s=>{s.querySelector('.lsec-hd').click();}); window.__psy().secs.forEach(s=>{s.querySelector('.lsec-hd').click();});
   if(typeof saveYou==='function')saveYou(); render();});
  const wrote=await page.evaluate(()=>Object.keys(localStorage).filter(k=>/(^|[._:-])(levels|fetters|chain|superego|gates)$/i.test(k)));
  ok(wrote.length===0,'E nothing the product writes brings a removed section\'s key back, saw '+J(wrote));
  /* the coercion the nine sliders shared with every caller still runs */
  const co=await page.evaluate(()=>{var cf=CHILD[0].nm; S.charge[cf]='7.5'; delete S.replace[cf]; syncCh();
   return {c:typeof S.charge[cf], v:S.charge[cf], r:S.replace[cf], all:CHILD.every(function(x){return typeof S.charge[x.nm]==='number'&&typeof S.replace[x.nm]==='number';})};});
  ok(co.c==='number'&&co.v===7.5&&co.r===0&&co.all,'E syncCh still turns a stored string into a number and a missing axis into nought, got '+J(co));
  await ctx.close();
 }

 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);
})().catch(e=>{console.log('FATAL',e.stack||e);process.exit(1);});
