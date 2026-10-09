/* ============================================================
   THE LEFT MENU, GATED. The P3 menu pass: the Field's readings rail as the
   owner ruled it. node tests/railmenu.js, and called from tests/functional.js
   so a full run holds it through the same code.

   His words, in the order they landed (TASKS.md):
     OT  "coherence just changes CQ, decoherence changes to DQ ... put
         decoherence and coherence on the same bar. Put CQ on one end, DQ on
         the other ... Vitality to me is energy. Energy is yellow. Awareness is
         Indigo will is blue ... benign malignant, I want a halo and a
         pitchfork."
     OV  "we're just going to use CQ and DQ."
     OX  "if there's opposing forces, then let a gradient drive that. And let
         the boundary be the oscillation range."
     PC  "a solid bar of color with two opposing colors and an oscillating
         termination point ... don't use a symbols by themselves they look
         really bad go back to putting them on horizontal stack lines and then
         use the icons"
     RB  "every single element looks completely different ... This stack of
         elements should all be bar style with the symbolic icon and the text
         inside of the bar itself to maximize space. Coherence, decoherence is
         CQ and DQ is on the same bar. As opposing colors with the termination
         gradient as the oscillating the numbers that the user oscillates.
         That's the same mechanic for CQDQ. It's the same mechanic for
         orientation. That's the same mechanic for benign and malignant."
     RZ  "Radiance doesn't have a bar that's doing anything."
     PO  every label, symbol and term shows its plain meaning where it stands.

   Each rule below is one check family, named so a failure says which ruling
   it broke:
     RM1  one bar style: every reading is a bar of one height, one left edge
          and one width, and nothing else stands in the block (no wire, no
          dial, no style switch, no text row, no hash column)
     RM2  CQ and DQ share one bar, named CQ and DQ, each half its own door,
          in two opposing colours
     RM3  the termination oscillates: the CQ edge moves through the band
          coherence wanders in and never leaves it, the fade is that band's
          width, the DQ edge stays inside the shadow's breath, and under Quiet
          nothing moves and each edge rests on its figure
     RM4  orientation and balance are the same pair bar: benign against
          malignant, masculine against feminine, two shares of one whole
          meeting at the left share
     RM5  benign carries the halo and malignant the pitchfork, the compass's
          own two marks
     RM6  vitality is yellow, awareness indigo and will blue, the seat colours
          that carry those three
     RM7  no symbol stands alone: every mark sits beside its word
     RM8  every word carries its plain meaning, the table's own sentence
     RM9  every door is a button a keyboard reaches in reading order, with a
          name a screen reader says, and Enter opens the reading
     RM10 every door is at least 44 by 44
     RM11 on a phone the menu fits: no sideways scroll, a 16 pixel gutter
     RM12 an unread field prints no figure, lays no colour and swings nothing

   Checked against known bad cases first, as the repository asks: a block
   with a mark standing alone and a word with no carrier is put on the page
   and RM7 and RM8 must call both bare before they are trusted on anything
   real. And the gate as a whole was run on the build from before this pass,
   where it fails, before it was run on the build with it.
   ============================================================ */
async function railMenuGate(browser,FILE,ok,booted){
 const SWEEP=async pg=>pg.waitForTimeout(await pg.evaluate(()=>
  (typeof ENTER_SPAN==='number'?ENTER_SPAN:600)+9*(typeof ENTER_STAGGER==='number'?ENTER_STAGGER:62)+400));
 for(const [w,h] of [[1600,1000],[390,844]]){
  const tag=w+': ', phone=w<600;
  const ctx=await browser.newContext({viewport:{width:w,height:h},isMobile:phone,hasTouch:phone});
  const pg=await ctx.newPage();
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  /* the column is opened the way a person who opened it once finds it */
  await pg.addInitScript(()=>{try{localStorage.setItem('lcol','open');}catch(e){}});
  try{ const {FULL_SIGHT}=require('./seed.js'); await pg.addInitScript(FULL_SIGHT); }catch(e){}
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
   /* RM7: a mark is bare unless the bar, or the pole of a pair, that it is
      drawn in carries a word. Outside a bar its own parent has to carry one.
      Figures and dashes are not words. */
   window.__rmBareMarks=function(root){var bad=[];
    root.querySelectorAll('svg').forEach(function(s){if(!__rmVis(s))return;
     var unit=s.closest('.rbar,.rb2-p')||s.parentElement;
     var words=((unit&&unit.innerText)||'').replace(/[\\s\\u2013\\d.%+-]+/g,'');
     if(!words)bad.push((s.outerHTML||'').slice(0,60));});
    return bad;};
   /* RM8: a word is bare when no carrier at its own end of the bar, or above
      it, says the table's sentence for it */
   window.__rmBareWords=function(root,ctx){var out=[];
    root.querySelectorAll('.rb-n,.rb2-n').forEach(function(n){if(!__rmVis(n)||n.closest('[aria-hidden=true]')&&n.closest('.rb-over'))return;
     var word=(n.textContent||'').replace(/\\s+/g,' ').trim(); if(!word)return;
     var say=(typeof unpackOf==='function')?unpackOf(word,ctx):'';
     var tips=[], up=n.closest('[data-tip]'); if(up)tips.push(up.getAttribute('data-tip'));
     var pair=n.closest('.rb2'), side=n.closest('.rb2-p');
     if(pair&&side){var k=pair.querySelector('.rb2-k.'+(side.classList.contains('l')?'l':'r')); if(k)tips.push(k.getAttribute('data-tip')||'');
      var host=pair.parentElement&&pair.parentElement.closest('[data-tip]'); if(host)tips.push(host.getAttribute('data-tip')||'');}
     out.push({word:word,entry:!!say,glossed:!!say&&tips.join(' | ').indexOf(say)>=0});});
    return out;};`;
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
   const kids=[...d.querySelectorAll('*')].filter(e=>__rmVis(e)&&!e.closest('.rbar,.rb2,#bal,#polbar')&&e.children.length===0&&(e.textContent||'').trim());
   const singles=[...d.querySelectorAll('.rbar')].filter(__rmVis);
   const pairs=[...d.querySelectorAll('.rb2')].filter(__rmVis);
   const R=compute();
   return {missing:false,
    order:rows.map(e=>e.classList.contains('rb2')?'pair:'+e.getAttribute('data-pair'):'bar:'+((e.querySelector('.rb-row:not(.rb-over) .rb-n')||e.querySelector('.rb-n')||{}).textContent||'').trim()),
    heights:[...new Set(rr.map(r=>Math.round(r.height)))], lefts:[...new Set(rr.map(r=>Math.round(r.left)))], widths:[...new Set(rr.map(r=>Math.round(r.width)))],
    stacked:rr.every((r,i)=>i===0||r.top>=rr[i-1].bottom-0.5),
    loose:kids.map(e=>e.textContent.trim().slice(0,30)),
    others:['.rw-rad','.rw-bus','.rb-hash','.ax','.fdl','#axpick','[data-axd]','.rb-waverow'].filter(s=>{const e=d.querySelector(s)||document.querySelector(s);return e&&__rmVis(e);}),
    pairNames:pairs.map(p=>[...p.querySelectorAll('.rb2-n')].map(n=>n.textContent.trim())),
    pairFigs:pairs.map(p=>[...p.querySelectorAll('.rb2-v')].map(n=>n.textContent.trim())),
    halves:pairs.map(p=>[...p.querySelectorAll('.rb2-k')].map(k=>k.getAttribute('data-q')).join()),
    cqdqIn:!!document.querySelector('#key .rb2[data-pair=cqdq]'),
    oldDoors:!!d.querySelector('.rbar[data-q=cq],.rbar[data-q=dq]'),
    lc:pairs.map(p=>getComputedStyle(p).getPropertyValue('--lc').trim().toLowerCase()),
    rc:pairs.map(p=>getComputedStyle(p).getPropertyValue('--rc').trim().toLowerCase()),
    singleCol:singles.map(e=>[((e.querySelector('.rb-n')||{}).textContent||'').trim(),(e.style.getPropertyValue('--c')||'').trim().toLowerCase()]),
    want:{Vitality:seatCol('Solar').toLowerCase(),Awareness:seatCol('3rd Eye').toLowerCase(),Will:seatCol('Throat').toLowerCase()},
    accent:getComputedStyle(document.body).getPropertyValue('--accent').trim().toLowerCase(),
    root:seatCol('Root').toLowerCase(),
    cq:R.CQ, dq:R.DQ,
    leanIc:(document.querySelector('#polbar .rb2-p.l svg path')||{getAttribute:()=>''}).getAttribute('d'),
    malIc:(document.querySelector('#polbar .rb2-p.r svg path')||{getAttribute:()=>''}).getAttribute('d'),
    halo:typeof GL_HALO==='string'?GL_HALO:'', fork:typeof GL_FORK==='string'?GL_FORK:'',
    marks:__rmBareMarks(d), words:__rmBareWords(d,'rail'),
    dockR:d.getBoundingClientRect().right, panelR:document.getElementById('lpanel').getBoundingClientRect().right,
    panelScroll:document.getElementById('lpanel').scrollWidth-document.getElementById('lpanel').clientWidth};});
  ok(!st.missing,'RM1: '+tag+'the readings block is on the page');
  if(!st.missing){
   ok(JSON.stringify(st.order)===JSON.stringify(['pair:cqdq','bar:Vitality','bar:Awareness','bar:Will','bar:Radiance','bar:Flow','pair:lean','pair:bal']),
    'RM1: '+tag+'eight bars in reading order, the CQ and DQ pair first and Radiance a bar among the singles, '+JSON.stringify(st.order));
   ok(st.heights.length===1&&st.heights[0]>=44&&st.heights[0]<=46&&st.lefts.length===1&&st.widths.length===1&&st.stacked,
    'RM1: '+tag+'every bar one height at the 44px floor, one left edge, one width, stacked, '+JSON.stringify({h:st.heights,l:st.lefts,w:st.widths,stacked:st.stacked}));
   ok(st.loose.length===0,'RM1: '+tag+'no words stand in the block outside a bar, '+JSON.stringify(st.loose));
   ok(st.others.length===0,'RM1: '+tag+'no wire, no dial, no style switch, no text row and no hash column, '+JSON.stringify(st.others));
   ok(st.cqdqIn&&!st.oldDoors&&JSON.stringify(st.pairNames[0])==='["CQ","DQ"]'&&st.halves[0]==='cq,dq',
    'RM2: '+tag+'CQ and DQ share one bar, named CQ and DQ, each half its own door, '+JSON.stringify({names:st.pairNames[0],halves:st.halves[0],oldDoors:st.oldDoors}));
   ok(st.lc[0]&&st.rc[0]&&st.lc[0]!==st.rc[0]&&st.lc[0]===st.accent&&st.rc[0]===st.root,
    'RM2: '+tag+'in two opposing colours, coherence the accent blue and decoherence the root red, '+JSON.stringify({l:st.lc[0],r:st.rc[0],accent:st.accent,root:st.root}));
   ok(JSON.stringify(st.pairFigs[0])===JSON.stringify([Math.round(st.cq)+'%',Math.round(st.dq)>0?Math.round(st.dq)+'%':'–']),
    'RM2: '+tag+'and it prints the two figures, '+JSON.stringify(st.pairFigs[0])+' for '+st.cq.toFixed(1)+' and '+st.dq.toFixed(1));
   ok(JSON.stringify(st.pairNames.slice(1))==='[["Benign","Malignant"],["Masculine","Feminine"]]',
    'RM4: '+tag+'orientation and balance are the same pair bar, '+JSON.stringify(st.pairNames.slice(1)));
   ok(!!st.halo&&st.leanIc===st.halo&&!!st.fork&&st.malIc===st.fork,'RM5: '+tag+'benign carries the halo and malignant the pitchfork, '+JSON.stringify({l:st.leanIc,r:st.malIc}));
   const col={}; st.singleCol.forEach(x=>col[x[0]]=x[1]);
   ok(['Vitality','Awareness','Will'].every(k=>col[k]===st.want[k]),'RM6: '+tag+'vitality yellow, awareness indigo, will blue, '+JSON.stringify({got:col,want:st.want}));
   ok(st.marks.length===0,'RM7: '+tag+'no mark stands alone in the block, '+JSON.stringify(st.marks));
   const words=st.words.map(x=>x.word);
   ok(['CQ','DQ','Vitality','Awareness','Will','Radiance','Flow','Benign','Malignant','Masculine','Feminine'].every(x=>words.indexOf(x)>=0),
    'RM8: '+tag+'every word the menu prints is found by the scan, '+JSON.stringify(words));
   st.words.forEach(x=>ok(x.entry&&x.glossed,'RM8: '+tag+'"'+x.word+'" carries its plain meaning'+(x.entry?'':' and the table has no sentence for it')));
   ok(st.dockR<=st.panelR+0.5&&st.panelScroll<=1,'RM11: '+tag+'the block stays inside its column and the column does not scroll sideways, '+JSON.stringify({dock:st.dockR,panel:st.panelR,scroll:st.panelScroll}));
  }

  /* ---- RM3: the termination oscillates, driven on the Field's own clock ---- */
  const osc=await pg.evaluate(()=>{
   const el=document.querySelector('#fdock .rb2[data-pair=cqdq]');
   if(!el||typeof rbPairTick!=='function')return {missing:true};
   const R=compute(), W0=el.getBoundingClientRect().width;
   const tx=s=>{const m=new DOMMatrix(getComputedStyle(el.querySelector(s)).transform);return m.m41;};
   const fl=()=>parseFloat(getComputedStyle(el).getPropertyValue('--fl'))||0, fr=()=>parseFloat(getComputedStyle(el).getPropertyValue('--fr'))||0;
   /* the centre of each fade, as a share of the bar */
   const edges=()=>({l:(W0+tx('.rb2-l')-fl()/2)/W0*100, r:100-((tx('.rb2-r')+fr()/2)/W0*100)});
   const rg=cqRange(R.CQ), amp=R.DQ*PUL_WAVE*Math.max(0,Math.min(1,R.DQ/100));
   const ls=[], rs=[], t0=S.t;
   for(let i=0;i<48;i++){S.t=t0+i*0.5; rbPairTick(performance.now()); const e=edges(); ls.push(e.l); rs.push(e.r);}
   document.body.classList.add('quiet'); rbPairTick(performance.now()); const q1=edges();
   S.t=t0+7.3; rbPairTick(performance.now()); const q2=edges();
   document.body.classList.remove('quiet');
   return {missing:false,cq:R.CQ,dq:R.DQ,lo:rg.lo,hi:rg.hi,amp,lmin:Math.min(...ls),lmax:Math.max(...ls),rmin:Math.min(...rs),rmax:Math.max(...rs),
    fadePx:fl(), bandPx:(rg.hi-rg.lo)/100*W0, q1, q2};});
  ok(!osc.missing,'RM3: '+tag+'the CQ and DQ pair runs on the Field\'s clock');
  if(!osc.missing){
   ok(osc.lmax-osc.lmin>1&&osc.lmin>=osc.lo-0.6&&osc.lmax<=osc.hi+0.6,
    'RM3: '+tag+'the CQ edge swings, '+osc.lmin.toFixed(1)+' to '+osc.lmax.toFixed(1)+', inside the band coherence wanders in, '+osc.lo.toFixed(1)+' to '+osc.hi.toFixed(1));
   ok(Math.abs(osc.fadePx-Math.max(osc.bandPx,0))<=1.5||(osc.bandPx<1&&osc.fadePx>0),
    'RM3: '+tag+'the CQ fade is as wide as that band, '+osc.fadePx.toFixed(1)+'px against '+osc.bandPx.toFixed(1)+'px');
   ok(osc.rmin>=osc.dq-osc.amp-0.6&&osc.rmax<=osc.dq+osc.amp+0.6,
    'RM3: '+tag+'the DQ edge stays inside the shadow\'s breath, '+osc.rmin.toFixed(1)+' to '+osc.rmax.toFixed(1)+' about '+osc.dq.toFixed(1));
   ok(Math.abs(osc.q1.l-osc.q2.l)<0.6&&Math.abs(osc.q1.r-osc.q2.r)<0.6&&Math.abs(osc.q1.l-osc.cq)<0.6&&Math.abs(osc.q1.r-osc.dq)<0.6,
    'RM3: '+tag+'under Quiet nothing swings and each edge rests on its figure, '+JSON.stringify({q1:osc.q1,q2:osc.q2}));
  }

  /* ---- RM4: the whole pairs meet at their left share ---- */
  const whole=await pg.evaluate(()=>{
   const R=compute(), L=leanRead(R), b=R.balance, bt=b.outMean+b.inMean;
   const at=k=>{const el=document.querySelector('#fdock .rb2[data-pair='+k+']'); if(!el)return null;
    const n=el.querySelector('.rb2-now.l'); if(!n)return null;
    return new DOMMatrix(getComputedStyle(n).transform).m41/el.getBoundingClientRect().width*100;};
   return {ben:L.ben, masc:bt?b.outMean/bt*100:50, lean:at('lean'), bal:at('bal')};});
  ok(whole.lean!==null&&Math.abs(whole.lean-whole.ben)<0.8,'RM4: '+tag+'orientation meets at the benign share, '+whole.lean+' against '+whole.ben);
  ok(whole.bal!==null&&Math.abs(whole.bal-whole.masc)<0.8,'RM4: '+tag+'balance meets at the masculine share, '+whole.bal+' against '+whole.masc);

  /* ---- RM9 and RM10: doors, names, keyboard ---- */
  const doors=await pg.evaluate(()=>{
   const d=document.getElementById('fdock');
   const all=[...d.querySelectorAll('button,[tabindex="0"]')].filter(__rmVis);
   const named=all.map(e=>{const nm=(e.getAttribute('aria-label')||e.textContent||'').replace(/\s+/g,' ').trim();
    const r=e.getBoundingClientRect(); return {tag:e.tagName, q:e.getAttribute('data-q')||e.id||'', nm, w:r.width, h:r.height};});
   return {named, n:all.length};});
  ok(doors.n>=9,'RM9: '+tag+'every reading is a door or a carrier a keyboard reaches, '+doors.n);
  const small=doors.named.filter(x=>x.w<44||x.h<44);
  ok(small.length===0,'RM10: '+tag+'every door is at least 44 by 44, '+JSON.stringify(small));
  const mean=await pg.evaluate(()=>{
   const need=[['cq','CQ'],['dq','DQ'],['Vitality','Vitality'],['Awareness','Awareness'],['Will','Will'],['Radiance','Radiance'],['Flow','Flow'],['polbar','Benign'],['polbar','Malignant'],['bal','Masculine'],['bal','Feminine']];
   const d=document.getElementById('fdock');
   return need.map(([q,word])=>{
    let el=d.querySelector('[data-q="'+q+'"].rb2-k')||document.getElementById(q)
     ||[...d.querySelectorAll('.rbar')].find(e=>((e.querySelector('.rb-n')||{}).textContent||'').trim()===word);
    const nm=el?(el.getAttribute('aria-label')||''):'';
    const say=typeof unpackOf==='function'?unpackOf(word,'rail'):'';
    return {word, door:!!el&&(el.tagName==='BUTTON'||el.getAttribute('tabindex')==='0'), named:!!say&&nm.indexOf(word)>=0&&nm.indexOf(say)>=0, nm:nm.slice(0,90)};});});
  mean.forEach(m=>ok(m.door&&m.named,'RM9: '+tag+m.word+' has a door whose spoken name carries the word and its meaning, '+JSON.stringify(m)));
  if(!phone){
   /* the real Tab key, from the first door in the block */
   const first=await pg.evaluate(()=>{const d=document.getElementById('fdock'), f=d.querySelector('button,[tabindex="0"]');
    if(!f)return false; f.focus(); return document.activeElement===f;});
   const order=[];
   if(first)for(let i=0;i<14;i++){
    const a=await pg.evaluate(()=>{const a=document.activeElement, d=document.getElementById('fdock');
     if(!a||!d.contains(a))return null;
     return a.getAttribute('data-q')?a.getAttribute('data-q')+':'+((a.querySelector&&a.querySelector('.rb-n'))?a.querySelector('.rb-n').textContent.trim():''):a.id;});
    if(a===null)break; order.push(a); await pg.keyboard.press('Tab');}
   ok(JSON.stringify(order)===JSON.stringify(['cq:','dq:','xyz:Vitality','xyz:Awareness','xyz:Will','xyz:Radiance','flow:Flow','polbar','bal']),
    'RM9: '+tag+'the Tab key walks the doors in reading order, '+JSON.stringify(order));
   await pg.evaluate(()=>{if(typeof rdClose==='function')rdClose(); if(typeof TIP!=='undefined')TIP.hide();});
   const has=await pg.evaluate(()=>{const k=document.querySelector('#fdock .rb2-k[data-q=cq]')||document.querySelector('#fdock .kb[data-q=cq]');
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
    return {side:doc.scrollWidth-innerWidth, left:Math.min(...rows.map(r=>r.left)), right:innerWidth-Math.max(...rows.map(r=>r.right)), n:rows.length,
     clipped:[...d.querySelectorAll('.rb2')].filter(__rmVis).filter(p=>{const l=p.querySelector('.rb2-p.l').getBoundingClientRect(), r=p.querySelector('.rb2-p.r').getBoundingClientRect();return l.right>r.left-4;}).length};});
   ok(fit.side<=0,'RM11: '+tag+'no sideways scroll, '+fit.side+'px over');
   ok(fit.n===8&&fit.left>=16&&fit.right>=16,'RM11: '+tag+'every bar inside a 16 pixel gutter each side, '+JSON.stringify(fit));
   ok(fit.clipped===0,'RM11: '+tag+'the two ends of every pair stay apart, '+fit.clipped+' run together');
  }

  /* ---- RM12: an unread field ---- */
  await load('You');
  const un=await pg.evaluate(()=>{
   const d=document.getElementById('fdock'), R=compute();
   const pairs=[...d.querySelectorAll('.rb2')];
   const figs=[...d.querySelectorAll('.rb2-v,.rb-row:not(.rb-over) .rb-v')].map(v=>v.textContent.trim());
   let swing=0; const el=d.querySelector('.rb2[data-pair=cqdq]');
   if(el&&typeof rbPairTick==='function'){const tx=()=>new DOMMatrix(getComputedStyle(el.querySelector('.rb2-l')).transform).m41;
    const a=tx(); S.t+=3.1; rbPairTick(performance.now()); swing=Math.abs(tx()-a);}
   return {unread:!!R.unread, n:pairs.length, off:pairs.filter(p=>p.classList.contains('off')).length,
    laid:pairs.filter(p=>{const l=p.querySelector('.rb2-l');return l&&getComputedStyle(l).display!=='none';}).length,
    figs, digits:figs.filter(f=>/\d/.test(f)), swing};});
  ok(un.unread,'RM12: '+tag+'the blank profile reads as unread');
  ok(un.n===3&&un.off===3&&un.laid===0,'RM12: '+tag+'every pair lays no colour, '+JSON.stringify({n:un.n,off:un.off,laid:un.laid}));
  ok(un.figs.length>=11&&un.digits.length===0,'RM12: '+tag+'and no figure is printed, only dashes, '+JSON.stringify(un.figs));
  ok(un.swing<0.5,'RM12: '+tag+'and nothing swings, '+un.swing);
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
