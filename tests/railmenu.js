/* ============================================================
   THE LEFT MENU, GATED. The Field's readings rail as the owner ruled it.
   node tests/railmenu.js, and called from tests/functional.js so a full run
   holds it through the same code.

   His words, in the order they landed (TASKS.md):
     OT  "coherence just changes CQ, decoherence changes to DQ ... Vitality to
         me is energy. Energy is yellow. Awareness is Indigo will is blue ...
         benign malignant, I want a halo and a pitchfork."
     OV  "we're just going to use CQ and DQ."
     OX  "let the boundary be the oscillation range."
     PC  "don't use a symbols by themselves they look really bad"
     PO  every label, symbol and term shows its plain meaning where it stands.
     30 October, r1 "the level" from mockups/dual-readings, picked for the
         left-hand side: "Yeah, those are the menus I like. For the left-hand
         side." It replaced round RB's bar, every row one 44px fill with the
         words inside it, which the review graded C+ because "the rail draws
         a lean and an amount with the same shape, so the eye cannot tell
         which way from how much without reading the words."

   NAMED CHANGE, 30 October. RM1 to RM4 and RM12 held round RB's drawing and
   are rewritten to hold r1's: what each family checks is said below, and
   RB's CQ and DQ on one bar became CQ against its own shadow, with DQ an
   amount, because DQ is not 100 less CQ (engine/compute.js) and a line at 50
   between them drew a figure the engine does not compute.

   Each rule below is one check family, named so a failure says which ruling
   it broke:
     RM1  two families, one grammar: every row one line of words over one
          track, one left edge, one width, stacked, pairs first; the pairs'
          and the amounts' line and track the same height, Flow's track the
          only taller one; a head for each family; nothing else in the block
     RM2  coherence is CQ against its own shadow, lawSQ, in the accent and the
          root red, both halves doors to CQ's reading, one figure over the
          centre; DQ is an amount, its own door, in the root red
     RM3  the swing: a faint mark wanders on the Field's clock inside the band
          the reading wanders in, the solid mark holds the figure, and under
          Quiet nothing wanders
     RM4  a pair's mark stands at the right pole's share from the left end,
          its fill grows from the centre line toward the lean, and its figure
          is the leaning side's share
     RM5  benign carries the halo and malignant the pitchfork
     RM6  vitality is yellow, awareness indigo and will blue
     RM7  no symbol stands alone: every mark sits beside its word
     RM8  every word carries its plain meaning, the table's own sentence
     RM9  every door is a button a keyboard reaches in reading order, with a
          name a screen reader says, and Enter opens the reading
     RM10 every door is at least 44 by 44
     RM11 on a phone the menu fits: no sideways scroll, a 16 pixel gutter
     RM12 an unread field prints no figure, lays no colour and swings nothing
     RM13 Flow is seven cells root to crown, each filled to its seat's pass,
          and it is blocked only at a seat flSeats calls held

   Checked against known bad cases first, as the repository asks: a block
   with a mark standing alone and a word with no carrier is put on the page
   and RM7 and RM8 must call both bare before they are trusted on anything
   real. And on 30 October this file was run against the build from before
   r1 first, where it read 56 passed and 24 failed, in RM1, RM2, RM3, RM4 and
   RM8, and the RM13 step threw (that build has no rbSeatHeld) and was
   counted under RM1; then on r1, where it read 134 passed, 0 failed.
   ============================================================ */
async function railMenuGate(browser,FILE,ok,booted){
 const SWEEP=async pg=>pg.waitForTimeout(await pg.evaluate(()=>
  (typeof ENTER_SPAN==='number'?ENTER_SPAN:600)+9*(typeof ENTER_STAGGER==='number'?ENTER_STAGGER:62)+400));
 for(const [w,h] of [[1600,1000],[390,844]]){
  const tag=w+': ', phone=w<600;
  const ctx=await browser.newContext({viewport:{width:w,height:h},isMobile:phone,hasTouch:phone});
  const pg=await ctx.newPage();
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  /* the column is opened the way a person who opened it once finds it, by the
     seed in tests/seed.js and not by a setItem at document start: a store
     touched that early can be one the browser never connected (17 October).
     One document on a fresh context, so the seed's "only when lcol is unset"
     is the unconditional write this was. */
  try{ const {FULL_SIGHT,LCOL_SEED}=require('./seed.js'); await pg.addInitScript(LCOL_SEED); await pg.addInitScript(FULL_SIGHT); }catch(e){}
  await pg.goto(FILE); await booted(pg);
  try{
  const load=async nm=>{await pg.evaluate(nm=>{var i=PEOPLE.findIndex(x=>x.nm===nm); if(i<0)i=0;
    loadP(i); setTab(TAB.FIELD);
    if(document.body.classList.contains('lshut')){var f=document.getElementById('lfold'); if(f)f.click();}
    render();},nm); await SWEEP(pg);};

  /* ---- the scans, and the known bad case they must call bare first ---- */
  const scans=`
   window.__rmVis=function(e){var s=getComputedStyle(e);if(s.display==='none'||s.visibility==='hidden')return false;
    var r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
   /* RM7: a mark is bare unless the row, the pole of a pair, or the family
      head it is drawn in carries a word. Outside those its own parent has to
      carry one. Figures, dashes and the pair's chevrons beside its figure
      are not words, and a chevron is not a mark that needs one: it points at
      the lit pole's word on the same line. */
   window.__rmBareMarks=function(root){var bad=[];
    root.querySelectorAll('svg').forEach(function(s){if(!__rmVis(s))return;
     if(s.closest('.rb2-f,.rb-cells'))return;
     var unit=s.closest('.rbar,.rb2-p,.rb-fam')||s.parentElement;
     var words=((unit&&unit.innerText)||'').replace(/[\\s\\u2013\\d.%+-]+/g,'');
     if(!words)bad.push((s.outerHTML||'').slice(0,60));});
    return bad;};
   /* RM8: a word is bare when no carrier at its own end of the row, or above
      it, says the table's sentence for it */
   window.__rmBareWords=function(root,ctx){var out=[];
    root.querySelectorAll('.rb-n,.rb2-n,.rb-fam').forEach(function(n){if(!__rmVis(n))return;
     var word=(n.textContent||'').replace(/\\s+/g,' ').trim(); if(!word)return;
     var say=(typeof unpackOf==='function')?unpackOf(word,ctx):'';
     var tips=[], up=n.closest('[data-tip]'); if(up)tips.push(up.getAttribute('data-tip'));
     var pair=n.closest('.rb2'), side=n.closest('.rb2-p');
     if(pair&&side){var k=pair.querySelector('.rb2-k.'+(side.classList.contains('l')?'l':'r')); if(k)tips.push(k.getAttribute('data-tip')||'');
      var host=pair.parentElement&&pair.parentElement.closest('[data-tip]'); if(host)tips.push(host.getAttribute('data-tip')||'');}
     out.push({word:word,entry:!!say,glossed:!!say&&tips.join(' | ').indexOf(say)>=0});});
    return out;};
   /* where a percent transform puts a layer, as a share of its own width */
   window.__rmX=function(e){if(!e)return null;var t=e.style.transform||'';
    var m=/translateX\\((-?[\\d.]+)%\\)/.exec(t); if(m)return +m[1];
    m=/scaleX\\((-?[\\d.]+)\\)/.exec(t); return m?+m[1]:null;};`;
  await pg.addScriptTag({content:scans});
  const bad=await pg.evaluate(()=>{
   const d=document.createElement('div'); d.id='rm-bad'; d.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#fff;color:#000;width:300px';
   d.innerHTML='<span class="x"><svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg></span>'
    +'<div class="rbar"><span class="rb-row"><span class="rb-n">Vitality</span><span class="rb-v">0.42</span></span></div>';
   document.body.appendChild(d);
   const r={marks:__rmBareMarks(d).length, words:__rmBareWords(d,'rail')}; d.remove(); return r;});
  ok(bad.marks===1,'RM7: '+tag+'the scan calls a mark standing alone bare before it is trusted, found '+bad.marks);
  ok(bad.words.length===1&&!bad.words[0].glossed,'RM8: '+tag+'the scan calls a word with no carrier bare before it is trusted, '+JSON.stringify(bad.words));

  /* ---- a loaded field, Tomas, who carries the widest coherence band ---- */
  await load('Tomas');
  const st=await pg.evaluate(()=>{
   const d=document.getElementById('fdock'); if(!d)return {missing:true};
   const rows=[...d.querySelectorAll('.rbar,.rb2')].filter(__rmVis), rr=rows.map(e=>e.getBoundingClientRect());
   const kids=[...d.querySelectorAll('*')].filter(e=>__rmVis(e)&&!e.closest('.rbar,.rb2,#bal,#polbar,.rb-fam')&&e.children.length===0&&(e.textContent||'').trim());
   const singles=[...d.querySelectorAll('.rbar')].filter(__rmVis);
   const pairs=[...d.querySelectorAll('.rb2')].filter(__rmVis);
   const R=compute();
   const hOf=s=>[...new Set(rows.map(e=>{const x=e.querySelector(s);return x?Math.round(x.getBoundingClientRect().height):null;}).filter(v=>v!==null))];
   return {missing:false,
    order:rows.map(e=>e.classList.contains('rb2')?'pair:'+e.getAttribute('data-pair'):'bar:'+((e.querySelector('.rb-n')||{}).textContent||'').trim()),
    heights:rr.map(r=>Math.round(r.height)), lefts:[...new Set(rr.map(r=>Math.round(r.left)))], widths:[...new Set(rr.map(r=>Math.round(r.width)))],
    lines:[...new Set(hOf('.rb-row').concat(hOf('.rb2-ln')))],
    tracks:[...new Set(rows.filter(e=>!e.classList.contains('rb-flow')).map(e=>Math.round((e.querySelector('.rb-t,.rb2-t')||{getBoundingClientRect:()=>({height:0})}).getBoundingClientRect().height)))],
    flowTrack:Math.round((d.querySelector('.rbar.rb-flow .rb-t')||{getBoundingClientRect:()=>({height:0})}).getBoundingClientRect().height),
    stacked:rr.every((r,i)=>i===0||r.top>=rr[i-1].bottom-0.5),
    heads:[...d.querySelectorAll('.rb-fam')].filter(__rmVis).map(e=>e.textContent.trim()),
    headAbove:(()=>{const a=document.getElementById('rbgha'),b=document.getElementById('rbghb');if(!a||!b)return false;
     const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect(),firstPair=pairs[0],firstBar=singles[0];
     return ar.bottom<=firstPair.getBoundingClientRect().top+0.5&&br.top>=pairs[pairs.length-1].getBoundingClientRect().bottom-0.5&&br.bottom<=firstBar.getBoundingClientRect().top+0.5;})(),
    loose:kids.map(e=>e.textContent.trim().slice(0,30)),
    others:['.rw-rad','.rw-bus','.rb-hash','.ax','.fdl','#axpick','[data-axd]','.rb-waverow','.rb-wave','.rb-over','.rb2-now'].filter(s=>{const e=d.querySelector(s)||document.querySelector(s);return e&&__rmVis(e);}),
    pairNames:pairs.map(p=>[...p.querySelectorAll('.rb2-n')].map(n=>n.textContent.trim())),
    pairFigs:pairs.map(p=>[...p.querySelectorAll('.rb2-v')].map(n=>n.textContent.trim())),
    halves:pairs.map(p=>[...p.querySelectorAll('.rb2-k')].map(k=>k.getAttribute('data-q')).join()),
    cohIn:!!document.querySelector('#key .rb2[data-pair=coh]'),
    dqRow:(()=>{const e=d.querySelector('#keylo .rbar[data-q=dq]');return e?{nm:(e.querySelector('.rb-n')||{}).textContent.trim(),c:(e.style.getPropertyValue('--c')||'').trim().toLowerCase(),
     fill:parseFloat((e.querySelector('.rb-f')||{style:{}}).style.width),v:(e.querySelector('.rb-v')||{}).textContent.trim()}:null;})(),
    dqOnPair:pairs.some(p=>/\bDQ\b/.test(p.textContent)),
    lc:pairs.map(p=>getComputedStyle(p).getPropertyValue('--lc').trim().toLowerCase()),
    rc:pairs.map(p=>getComputedStyle(p).getPropertyValue('--rc').trim().toLowerCase()),
    singleCol:singles.map(e=>[((e.querySelector('.rb-n')||{}).textContent||'').trim(),(e.style.getPropertyValue('--c')||'').trim().toLowerCase()]),
    want:{Vitality:seatCol('Solar').toLowerCase(),Awareness:seatCol('3rd Eye').toLowerCase(),Will:seatCol('Throat').toLowerCase()},
    accent:getComputedStyle(document.body).getPropertyValue('--accent').trim().toLowerCase(),
    root:seatCol('Root').toLowerCase(),
    cq:R.CQ, dq:R.DQ, lawSQ:R.lawSQ,
    leanIc:(document.querySelector('#polbar .rb2-p.l svg path')||{getAttribute:()=>''}).getAttribute('d'),
    malIc:(document.querySelector('#polbar .rb2-p.r svg path')||{getAttribute:()=>''}).getAttribute('d'),
    halo:typeof GL_HALO==='string'?GL_HALO:'', fork:typeof GL_FORK==='string'?GL_FORK:'',
    marks:__rmBareMarks(d), words:__rmBareWords(d,'rail'),
    dockR:d.getBoundingClientRect().right, panelR:document.getElementById('lpanel').getBoundingClientRect().right,
    panelScroll:document.getElementById('lpanel').scrollWidth-document.getElementById('lpanel').clientWidth};});
  ok(!st.missing,'RM1: '+tag+'the readings block is on the page');
  if(!st.missing){
   ok(JSON.stringify(st.order)===JSON.stringify(['pair:coh','pair:lean','pair:bal','bar:DQ','bar:Vitality','bar:Awareness','bar:Will','bar:Radiance','bar:Flow']),
    'RM1: '+tag+'nine rows, the three pairs first and then the six amounts, DQ leading them, '+JSON.stringify(st.order));
   ok(st.heights.every(x=>x>=44)&&st.lefts.length===1&&st.widths.length===1&&st.stacked,
    'RM1: '+tag+'every row at the 44px floor, one left edge, one width, stacked, '+JSON.stringify({h:st.heights,l:st.lefts,w:st.widths,stacked:st.stacked}));
   ok(st.lines.length===1&&st.tracks.length===1&&st.tracks[0]===16&&st.flowTrack===24,
    'RM1: '+tag+'one grammar: every line of words one height, every track 16px but Flow\'s 24, '+JSON.stringify({lines:st.lines,tracks:st.tracks,flow:st.flowTrack}));
   ok(JSON.stringify(st.heads)==='["Where you lean","How much"]'&&st.headAbove,
    'RM1: '+tag+'each family has its head, over the pairs and over the amounts, '+JSON.stringify({heads:st.heads,above:st.headAbove}));
   ok(st.loose.length===0,'RM1: '+tag+'no words stand in the block outside a row or a head, '+JSON.stringify(st.loose));
   ok(st.others.length===0,'RM1: '+tag+'no wire, no dial, no style switch, no text row, no hash column, no wave and no words drawn inside a fill, '+JSON.stringify(st.others));
   ok(st.cohIn&&JSON.stringify(st.pairNames[0])==='["CQ","Shadow"]'&&st.halves[0]==='cq,cq'&&!st.dqOnPair,
    'RM2: '+tag+'coherence is CQ against its shadow, both halves doors to CQ\'s reading, and DQ is on no pair, '+JSON.stringify({names:st.pairNames[0],halves:st.halves[0],dqOnPair:st.dqOnPair}));
   ok(st.lc[0]&&st.rc[0]&&st.lc[0]!==st.rc[0]&&st.lc[0]===st.accent&&st.rc[0]===st.root,
    'RM2: '+tag+'in two opposing colours, CQ the accent blue and its shadow the root red, '+JSON.stringify({l:st.lc[0],r:st.rc[0],accent:st.accent,root:st.root}));
   const pc=v=>Math.round(v)>0?Math.round(v)+'%':'–';
   const lean=Math.round(st.cq)>50?pc(st.cq):Math.round(st.cq)<50?pc(st.lawSQ):'50%';
   ok(st.lawSQ!==null&&Math.abs(st.lawSQ-(100-st.cq))<1e-6&&JSON.stringify(st.pairFigs[0])===JSON.stringify([lean]),
    'RM2: '+tag+'the pair prints one figure, the leaning side\'s share, '+JSON.stringify(st.pairFigs[0])+' for CQ '+st.cq.toFixed(1)+' and shadow '+(st.lawSQ===null?'null':st.lawSQ.toFixed(1)));
   ok(!!st.dqRow&&st.dqRow.nm==='DQ'&&st.dqRow.c===st.root&&Math.abs(st.dqRow.fill-Math.round(st.dq))<0.1&&st.dqRow.v===pc(st.dq),
    'RM2: '+tag+'DQ is an amount in the root red, filled to its own figure and printing it, '+JSON.stringify(st.dqRow)+' for '+st.dq.toFixed(1));
   ok(JSON.stringify(st.pairNames.slice(1))==='[["Benign","Malignant"],["Masculine","Feminine"]]',
    'RM4: '+tag+'orientation and balance are the same pair, '+JSON.stringify(st.pairNames.slice(1)));
   ok(!!st.halo&&st.leanIc===st.halo&&!!st.fork&&st.malIc===st.fork,'RM5: '+tag+'benign carries the halo and malignant the pitchfork, '+JSON.stringify({l:st.leanIc,r:st.malIc}));
   const col={}; st.singleCol.forEach(x=>col[x[0]]=x[1]);
   ok(['Vitality','Awareness','Will'].every(k=>col[k]===st.want[k]),'RM6: '+tag+'vitality yellow, awareness indigo, will blue, '+JSON.stringify({got:col,want:st.want}));
   ok(st.marks.length===0,'RM7: '+tag+'no mark stands alone in the block, '+JSON.stringify(st.marks));
   const words=st.words.map(x=>x.word);
   ok(['CQ','Shadow','DQ','Vitality','Awareness','Will','Radiance','Flow','Benign','Malignant','Masculine','Feminine','Where you lean','How much'].every(x=>words.indexOf(x)>=0),
    'RM8: '+tag+'every word the menu prints is found by the scan, '+JSON.stringify(words));
   st.words.forEach(x=>ok(x.entry&&x.glossed,'RM8: '+tag+'"'+x.word+'" carries its plain meaning'+(x.entry?'':' and the table has no sentence for it')));
   ok(st.dockR<=st.panelR+0.5&&st.panelScroll<=1,'RM11: '+tag+'the block stays inside its column and the column does not scroll sideways, '+JSON.stringify({dock:st.dockR,panel:st.panelR,scroll:st.panelScroll}));
  }

  /* ---- RM3: the swing, driven on the Field's own clock ---- */
  const osc=await pg.evaluate(()=>{
   const el=document.querySelector('#fdock .rb2[data-pair=coh]');
   if(!el||typeof rbPairTick!=='function')return {missing:true};
   const R=compute(), rg=cqRange(R.CQ), band=el.querySelector('.rb2-band');
   const gx=()=>__rmX(el.querySelector('.rb2-gh')), nx=()=>__rmX(el.querySelector('.rb2-nd'));
   const gs=[], ns=[], t0=S.t;
   for(let i=0;i<48;i++){S.t=t0+i*0.5; rbPairTick(performance.now()); gs.push(gx()); ns.push(nx());}
   document.body.classList.add('quiet'); rbPairTick(performance.now()); const q1=[gx(),nx()];
   S.t=t0+7.3; rbPairTick(performance.now()); const q2=[gx(),nx()];
   document.body.classList.remove('quiet');
   return {missing:false,cq:R.CQ,lo:100-rg.hi,hi:100-rg.lo,
    bandL:band?parseFloat(band.style.left):null, bandW:band?parseFloat(band.style.width):null,
    gmin:Math.min(...gs),gmax:Math.max(...gs),nmin:Math.min(...ns),nmax:Math.max(...ns),q1,q2};});
  ok(!osc.missing,'RM3: '+tag+'the coherence pair runs on the Field\'s clock');
  if(!osc.missing){
   ok(osc.bandL!==null&&Math.abs(osc.bandL-osc.lo)<0.05&&Math.abs(osc.bandW-(osc.hi-osc.lo))<0.05,
    'RM3: '+tag+'the pale band is the range coherence wanders in, as the mark is placed, '+JSON.stringify({left:osc.bandL,width:osc.bandW,lo:osc.lo,hi:osc.hi}));
   ok(osc.gmax-osc.gmin>1&&osc.gmin>=osc.lo-0.6&&osc.gmax<=osc.hi+0.6,
    'RM3: '+tag+'the faint mark wanders, '+osc.gmin.toFixed(1)+' to '+osc.gmax.toFixed(1)+', inside that band, '+osc.lo.toFixed(1)+' to '+osc.hi.toFixed(1));
   ok(osc.nmax-osc.nmin<0.01&&Math.abs(osc.nmin-(100-osc.cq))<0.05,
    'RM3: '+tag+'and the solid mark holds the figure, at '+osc.nmin.toFixed(2)+' for a shadow of '+(100-osc.cq).toFixed(2));
   ok(Math.abs(osc.q1[0]-osc.q2[0])<0.01&&Math.abs(osc.q1[0]-osc.q1[1])<0.05,
    'RM3: '+tag+'under Quiet nothing wanders and the faint mark rests on the solid one, '+JSON.stringify({q1:osc.q1,q2:osc.q2}));
  }

  /* ---- RM4: a pair's mark, fill and figure ---- */
  const whole=await pg.evaluate(()=>{
   const R=compute(), L=leanRead(R), b=R.balance, bt=b.outMean+b.inMean;
   const at=k=>{const el=document.querySelector('#fdock .rb2[data-pair='+k+']'); if(!el)return null;
    return {x:__rmX(el.querySelector('.rb2-nd')), fl:__rmX(el.querySelector('.rb2-fl.l')), fr:__rmX(el.querySelector('.rb2-fl.r')),
     fig:(el.querySelector('.rb2-v')||{}).textContent, lit:[...el.querySelectorAll('.rb2-p.lit .rb2-n')].map(n=>n.textContent)};};
   return {ben:L.ben, mal:L.mal, masc:bt?b.outMean/bt*100:50, lean:at('lean'), bal:at('bal')};});
  const pairOk=(p,left,lw,rw)=>{if(!p)return false; const x=100-left, lr=Math.round(left), fig=lr>50?lr+'%':lr<50?(100-lr)+'%':'50%';
   return Math.abs(p.x-x)<0.05&&Math.abs(p.fl-Math.max(0,50-x)/50)<0.001&&Math.abs(p.fr-Math.max(0,x-50)/50)<0.001
    &&p.fig===fig&&JSON.stringify(p.lit)===JSON.stringify(lr>50?[lw]:lr<50?[rw]:[]);};
  ok(pairOk(whole.lean,whole.ben,'Benign','Malignant'),'RM4: '+tag+'orientation: mark at the malignant share, fill from the centre toward the lean, the leaning figure, the leaning pole lit, '+JSON.stringify({got:whole.lean,ben:whole.ben}));
  ok(pairOk(whole.bal,whole.masc,'Masculine','Feminine'),'RM4: '+tag+'balance, the same, '+JSON.stringify({got:whole.bal,masc:whole.masc}));

  /* ---- RM13: flow ---- */
  const fl=await pg.evaluate(()=>{
   const e=document.querySelector('#fdock .rbar[data-q=flow]'); if(!e)return null;
   const pass=rbSeatPass(), seats=flSeats(), held=rbSeatHeld();
   const cells=[...e.querySelectorAll('.rb-cell')];
   const bk=cells.findIndex(c=>c.classList.contains('bk'));
   let want=-1; pass.forEach((v,j)=>{if(held[j]&&(want<0||v<pass[want]))want=j;});
   return {n:cells.length, fills:cells.map((c,i)=>Math.abs(__rmX2(c)-pass[i])<0.001),
    cols:cells.map((c,i)=>c.style.getPropertyValue('--sc').trim().toLowerCase()===seatCol(BANDS[i]).toLowerCase()),
    bk, want, heldN:held.filter(Boolean).length, sub:(e.querySelector('.rb-sub')||{}).textContent||'',
    seatsN:seats.length, step:!!e.querySelector('.rb-step path')};
   function __rmX2(c){const b=c.querySelector('b');const m=/scaleY\(([\d.]+)\)/.exec(b.style.transform||'');return m?+m[1]:-1;}});
  ok(!!fl&&fl.n===7&&fl.fills.every(Boolean)&&fl.cols.every(Boolean)&&fl.step,'RM13: '+tag+'Flow is seven cells, root to crown, each in its seat\'s colour filled to what it passes, with the step line, '+JSON.stringify(fl));
  ok(!!fl&&fl.bk===fl.want&&(fl.want<0?/no seat blocked/.test(fl.sub):/^blocked at /.test(fl.sub)),
   'RM13: '+tag+'it is ringed and said blocked only at the held seat passing the least, '+JSON.stringify(fl&&{bk:fl.bk,want:fl.want,held:fl.heldN,sub:fl.sub}));

  /* ---- RM9 and RM10: doors, names, keyboard ---- */
  const doors=await pg.evaluate(()=>{
   const d=document.getElementById('fdock');
   const all=[...d.querySelectorAll('button,[tabindex="0"]')].filter(__rmVis);
   const named=all.map(e=>{const nm=(e.getAttribute('aria-label')||e.textContent||'').replace(/\s+/g,' ').trim();
    const r=e.getBoundingClientRect(); return {tag:e.tagName, q:e.getAttribute('data-q')||e.id||'', nm, w:r.width, h:r.height};});
   return {named, n:all.length};});
  ok(doors.n>=12,'RM9: '+tag+'every reading and both heads are a door or a carrier a keyboard reaches, '+doors.n);
  const small=doors.named.filter(x=>x.w<44||x.h<44);
  ok(small.length===0,'RM10: '+tag+'every door is at least 44 by 44, '+JSON.stringify(small));
  const mean=await pg.evaluate(()=>{
   const d=document.getElementById('fdock');
   const half=s=>d.querySelector('.rb2[data-pair=coh] .rb2-k.'+s);
   const row=word=>[...d.querySelectorAll('.rbar')].find(e=>((e.querySelector('.rb-n')||{}).textContent||'').trim()===word);
   const need=[[half('l'),'CQ'],[half('r'),'Shadow'],[row('DQ'),'DQ'],[row('Vitality'),'Vitality'],[row('Awareness'),'Awareness'],[row('Will'),'Will'],
    [row('Radiance'),'Radiance'],[row('Flow'),'Flow'],[document.getElementById('polbar'),'Benign'],[document.getElementById('polbar'),'Malignant'],
    [document.getElementById('bal'),'Masculine'],[document.getElementById('bal'),'Feminine'],
    [document.getElementById('rbgha'),'Where you lean'],[document.getElementById('rbghb'),'How much']];
   return need.map(([el,word])=>{
    const nm=el?(el.getAttribute('aria-label')||''):'';
    const say=typeof unpackOf==='function'?unpackOf(word,'rail'):'';
    return {word, door:!!el&&(el.tagName==='BUTTON'||el.getAttribute('tabindex')==='0'), named:!!say&&nm.indexOf(word)>=0&&nm.indexOf(say)>=0, nm:nm.slice(0,90)};});});
  mean.forEach(m=>ok(m.door&&m.named,'RM9: '+tag+m.word+' has a door whose spoken name carries the word and its meaning, '+JSON.stringify(m)));
  if(!phone){
   /* the real Tab key, from the first door in the block */
   const first=await pg.evaluate(()=>{const d=document.getElementById('fdock'), f=d.querySelector('button,[tabindex="0"]');
    if(!f)return false; f.focus(); return document.activeElement===f;});
   const order=[];
   if(first)for(let i=0;i<16;i++){
    const a=await pg.evaluate(()=>{const a=document.activeElement, d=document.getElementById('fdock');
     if(!a||!d.contains(a))return null;
     return a.getAttribute('data-q')?a.getAttribute('data-q')+':'+((a.querySelector&&a.querySelector('.rb-n'))?a.querySelector('.rb-n').textContent.trim():''):a.id;});
    if(a===null)break; order.push(a); await pg.keyboard.press('Tab');}
   ok(JSON.stringify(order)===JSON.stringify(['rbgha','cq:','cq:','polbar','bal','rbghb','dq:DQ','xyz:Vitality','xyz:Awareness','xyz:Will','xyz:Radiance','flow:Flow']),
    'RM9: '+tag+'the Tab key walks the doors in reading order, '+JSON.stringify(order));
   await pg.evaluate(()=>{if(typeof rdClose==='function')rdClose(); if(typeof TIP!=='undefined')TIP.hide();});
   const has=await pg.evaluate(()=>{const k=document.querySelector('#fdock .rb2-k[data-q=cq]');
    if(!k)return false; k.focus(); return document.activeElement===k;});
   let enter={missing:!has,open:false};
   if(has){await pg.keyboard.press('Enter'); await pg.waitForTimeout(300);
    enter.open=await pg.evaluate(()=>{const dr=document.getElementById('rdrill');
     return !!dr&&dr.style.display!=='none'&&(dr.textContent||'').trim().length>0;});}
   ok(!enter.missing&&enter.open,'RM9: '+tag+'Enter on the CQ door opens its reading, '+JSON.stringify(enter));
  }

  /* ---- RM11: the phone ---- */
  if(phone){
   const fit=await pg.evaluate(()=>{
    const d=document.getElementById('fdock'); d.scrollIntoView({block:'start'});
    const rows=[...d.querySelectorAll('.rbar,.rb2')].filter(__rmVis).map(e=>e.getBoundingClientRect());
    const doc=document.scrollingElement||document.documentElement;
    const apart=p=>{const l=p.querySelector('.rb2-p.l').getBoundingClientRect(), f=p.querySelector('.rb2-f').getBoundingClientRect(), r=p.querySelector('.rb2-p.r').getBoundingClientRect();
     return l.right<=f.left-2&&f.right<=r.left-2;};
    return {side:doc.scrollWidth-innerWidth, left:Math.min(...rows.map(r=>r.left)), right:innerWidth-Math.max(...rows.map(r=>r.right)), n:rows.length,
     clipped:[...d.querySelectorAll('.rb2')].filter(__rmVis).filter(p=>!apart(p)).length,
     cut:[...d.querySelectorAll('.rb2-n,.rb-n,.rb-seats span')].filter(__rmVis).filter(n=>n.scrollWidth>n.clientWidth+0.5).map(n=>n.textContent)};});
   ok(fit.side<=0,'RM11: '+tag+'no sideways scroll, '+fit.side+'px over');
   ok(fit.n===9&&fit.left>=16&&fit.right>=16,'RM11: '+tag+'every row inside a 16 pixel gutter each side, '+JSON.stringify(fit));
   ok(fit.clipped===0&&fit.cut.length===0,'RM11: '+tag+'the two poles and the figure of every pair stay apart and no word is cut, '+JSON.stringify({clipped:fit.clipped,cut:fit.cut}));
  }
  else{
   const cut=await pg.evaluate(()=>[...document.querySelectorAll('#fdock .rb2-n,#fdock .rb-n,#fdock .rb-seats span')].filter(__rmVis)
    .filter(n=>n.scrollWidth>n.clientWidth+0.5).map(n=>n.textContent));
   ok(cut.length===0,'RM11: '+tag+'no word on the rail is cut short, the seats under Flow included, '+JSON.stringify(cut));
  }

  /* ---- RM12: an unread field ---- */
  await load('You');
  const un=await pg.evaluate(()=>{
   const d=document.getElementById('fdock'), R=compute();
   const pairs=[...d.querySelectorAll('.rb2')];
   const figs=[...d.querySelectorAll('.rb2-v,.rb-v')].map(v=>v.textContent.trim());
   let swing=0; const el=d.querySelector('.rb2[data-pair=coh]');
   if(el&&typeof rbPairTick==='function'){const a=el.innerHTML; S.t+=3.1; rbPairTick(performance.now()); swing=a===el.innerHTML?0:1;}
   return {unread:!!R.unread, n:pairs.length, off:pairs.filter(p=>p.classList.contains('off')).length,
    marks:d.querySelectorAll('.rb2-nd,.rb2-gh,.rb2-band').length,
    laid:pairs.filter(p=>[...p.querySelectorAll('.rb2-fl')].some(f=>(__rmX(f)||0)>0)).length,
    fills:[...d.querySelectorAll('.rbar .rb-f')].filter(__rmVis).length,
    cells:[...d.querySelectorAll('.rb-cell b')].filter(b=>!/scaleY\(0(\.0+)?\)/.test(b.style.transform||'')).length,
    figs, digits:figs.filter(f=>/\d/.test(f)), swing, sub:!!d.querySelector('.rb-sub')};});
  ok(un.unread,'RM12: '+tag+'the blank profile reads as unread');
  ok(un.n===3&&un.off===3&&un.laid===0&&un.marks===0,'RM12: '+tag+'every pair lays no colour and stands no mark, '+JSON.stringify({n:un.n,off:un.off,laid:un.laid,marks:un.marks}));
  ok(un.fills===0&&un.cells===0&&!un.sub,'RM12: '+tag+'no amount is filled, no Flow cell risen, and nothing is called blocked, '+JSON.stringify({fills:un.fills,cells:un.cells,sub:un.sub}));
  ok(un.figs.length===9&&un.digits.length===0,'RM12: '+tag+'and no figure is printed, only dashes, '+JSON.stringify(un.figs));
  ok(un.swing===0,'RM12: '+tag+'and nothing swings, '+un.swing);
  }catch(e){ok(false,'RM1: '+tag+'the menu group threw, '+String(e.message).split('\n')[0]);}
  ok(err.length===0,'RM1: '+tag+'no page errors on the menu, '+err.join(' | '));
  await ctx.close();}}
module.exports={railMenuGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const path=require('path');
 (async()=>{
  const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(browser);
  let PASS=0,FAIL=0;
  const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
  const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}
   try{await p.waitForTimeout(600); await p.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();});
    await p.waitForTimeout(120);}catch(e){}};
  await railMenuGate(browser,FILE,ok,booted);
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);
 })();
}
