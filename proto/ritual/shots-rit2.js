/* SHOOTS THE SECOND REBUILD AND MEASURES IT. One run, because a screenshot
   taken in a different session from the measurement is two claims about two
   builds.

   Everything it asserts:
     the request log        every request, with its url. Anything that is not
                            file: is a failure, not a warning.
     the parse round trip   document.documentElement.outerHTML re-parsed must
                            build the same number of elements. A tag the
                            parser repaired shows up here and does not show up
                            in a text count of the source.
     the dash count         HIS IDEA, GATED. Every ring on the page is read
                            back out of its own stroke-dasharray and the
                            number of dashes it draws is compared with the
                            number the model says that ritual carries. A ring
                            that says four when the target is eight is a lie
                            drawn in a circle and nothing in the source would
                            show it.
     eye travel             the two questions the page exists to answer, and
                            how far down the page the answer sits.
     simultaneous choices   visible interactive elements. The seven day week
                            counts as ONE object, because that is what a
                            person treats it as, and the day count is printed
                            beside it. The same convention covers the three
                            way summary control.
     touch targets          nothing interactive below 44 by 44, including
                            anything with a pointer cursor and no interactive
                            ancestor.
     redraw                 median and worst of 40 full redraws.
     page errors            any thrown error fails the run.
*/
const {chromium}=require('playwright');
const fs=require('fs');
const WHO=process.argv[2]||'Marcus';
const URL='file://'+__dirname+'/ritual2.html';
const SEL='button,input,select,textarea,a[href],[role=button]';

/* THE TWO QUESTIONS. A ritual page exists to answer these and nothing else
   it does matters if they are buried. */
const Q1='What do I do today', Q2='Am I keeping it';

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 let fails=0;
 const reqs=[];
 for(const [w,h,tag] of [[1600,1000,'wide'],[390,844,'narrow']]){
  const pg=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
  const errs=[];
  pg.on('pageerror',e=>errs.push('PAGEERROR '+e));
  pg.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text());});
  pg.on('request',r=>reqs.push(r.url()));
  await pg.goto(URL);
  await pg.waitForTimeout(300);
  await pg.evaluate(n=>{const s=document.getElementById('who');
   if(s&&[...s.options].some(o=>o.value===n)){s.value=n;
    s.dispatchEvent(new Event('change',{bubbles:true}));}},WHO);
  await pg.waitForTimeout(200);
  await pg.screenshot({path:__dirname+'/r2-'+WHO+'-page-'+tag+'.png',fullPage:true});

  /* the summary, all three ranges, because each one refuses differently */
  for(const r of ['week','month']){
   await pg.evaluate(x=>{const b=document.querySelector('#sumseg [data-range="'+x+'"]');
    if(b)b.click();},r);
   await pg.waitForTimeout(140);
   /* the panel itself, not a clip on the page. A clip is computed against a
      viewport the panel may not be inside at 390 and the run then dies on a
      screenshot rather than on a defect. */
   await pg.locator('#sump').screenshot(
    {path:__dirname+'/r2-'+WHO+'-sum-'+r+'-'+tag+'.png'});}
  await pg.evaluate(()=>document.querySelector('#sumseg [data-range=day]').click());
  await pg.waitForTimeout(120);

  /* the card popup */
  await pg.evaluate(()=>{const c=document.querySelector('[data-open]');if(c)c.click();});
  await pg.waitForTimeout(200);
  await pg.screenshot({path:__dirname+'/r2-'+WHO+'-card-'+tag+'.png',fullPage:true});
  const cardM=await pg.evaluate(s=>{
   const v=[...document.querySelectorAll('#sheet '+s)].filter(e=>e.offsetParent!==null);
   const grid=e=>e.classList.contains('dayb')||e.classList.contains('histb');
   const cells=v.filter(grid), ctrls=v.filter(e=>!grid(e));
   const rows=new Set(cells.map(e=>e.parentElement.id||'g')).size;
   return {n:ctrls.length+rows, ctrls:ctrls.length, cells:cells.length, rows:rows,
    small:v.filter(e=>{const r=e.getBoundingClientRect();
     return r.width>0&&(r.width<44||r.height<44);})
    .map(e=>((e.id||(typeof e.className==='string'?e.className:e.tagName))+' '
     +Math.round(e.getBoundingClientRect().width)+'x'
     +Math.round(e.getBoundingClientRect().height)))};},SEL);
  await pg.evaluate(()=>document.getElementById('s-close').click());

  /* THE ADD SHEET, which is where add and generate live together now */
  await pg.evaluate(()=>document.getElementById('addbtn').click());
  await pg.waitForTimeout(220);
  await pg.screenshot({path:__dirname+'/r2-'+WHO+'-add-'+tag+'.png',fullPage:true});
  const addM=await pg.evaluate(s=>{
   const v=[...document.querySelectorAll('#sheet '+s+',#sheet [data-q],#sheet [data-lib]')]
    .filter(e=>e.offsetParent!==null);
   return {n:v.length, q:document.querySelectorAll('#sheet [data-q]').length,
    lib:document.querySelectorAll('#sheet [data-lib]').length,
    small:v.filter(e=>{const r=e.getBoundingClientRect();
     return r.width>0&&(r.width<44||r.height<44);}).length};},SEL);

  /* HIS IDEA, DEMONSTRATED RATHER THAN DESCRIBED. Four library rituals taken
     in one go, chosen because their targets are ten, eight, one and none:
     an affirmation said ten times, eight glasses by night, no phone for the
     first thirty minutes which is a window and therefore one dash, and
     practise honesty which is a stance and carries a dot ring until a day
     tests it. Four rings in one column, four different counts. */
  await pg.evaluate(()=>{
   ['aff','wat8','phone','hon'].forEach(k=>{
    document.getElementById('addbtn').click();
    const r=document.querySelector('[data-lib="'+k+'"]');
    if(r)r.click();});
   const c=document.getElementById('s-close'); if(c)c.click();});
  await pg.waitForTimeout(240);
  /* MARK BY NAME, NOT BY POSITION. Three of the ten affirmations and five of
     the eight glasses, so the shot carries a part lit ring beside an unlit
     one and the gate has a non zero done to check. Marking by index picked a
     different ritual once the library items landed, which is the rule this
     repository already carries about looking a thing up by identity. */
  await pg.evaluate(()=>{
   /* AND THE BUTTON IS RE QUERIED ON EVERY PRESS. Every mark redraws the
      bands, so the node held from before the first press is detached and the
      four presses after it land on nothing. The run reported one of eight
      where it had asked for five, which the gate then agreed with because the
      model also said one. A probe that agrees with itself is not a check. */
   const hit=(nm,n)=>{
    for(let i=0;i<n;i++){
     const c=[...document.querySelectorAll('.card')].filter(e=>
      e.querySelector('.card-n').textContent===nm)[0];
     const b=c&&c.querySelector('[data-mark]');
     if(b)b.click();}};
   hit('An affirmation',3); hit('Water, by night',5);});
  await pg.waitForTimeout(200);
  await pg.screenshot({path:__dirname+'/r2-'+WHO+'-rings-'+tag+'.png',fullPage:true});

  /* ---------- THE DASH GATE ----------
     Every ring read back out of the drawn dasharray and compared with what
     the model says the ritual carries. */
  const rings=await pg.evaluate(()=>{
   const out=[];
   document.querySelectorAll('.card').forEach(card=>{
    const it=M.items.filter(x=>x.id===card.dataset.open)[0];
    if(!it)return;
    const want=segOf(it);
    const svg=card.querySelector('svg.segring');
    if(!svg){out.push({nm:it.nm,err:'no ring drawn'});return;}
    const cs=[...svg.querySelectorAll('circle')];
    const r=parseFloat(cs[0].getAttribute('r')), C=2*Math.PI*r;
    const da=cs[0].getAttribute('stroke-dasharray').trim().split(/\s+/).map(Number);
    let drawn, kind;
    if(da[0]<=0.05){kind='dots'; drawn=null;}
    else if(da.length===1){kind='arc'; drawn='over';}
    else {kind='dashes'; drawn=Math.round(C/(da[0]+da[1]));}
    /* the lit dashes, off the second circle */
    let lit=0;
    if(cs[1]&&kind==='dashes'){
     const d2=cs[1].getAttribute('stroke-dasharray').trim().split(/\s+/);
     lit=(d2.length-2)/2;}
    else if(cs[1]&&kind==='arc'){lit='arc';}
    out.push({nm:it.nm, shape:it.shape, kind:kind, drawn:drawn, lit:lit,
     wantN:want.n, wantDone:want.done, standing:it.standing,
     seat:it.seat||null,
     colour:getComputedStyle(card).getPropertyValue('--c').trim()});});
   return out;});
  rings.forEach(r=>{
   let ok;
   if(r.err)ok=false;
   else if(r.wantN===null)ok=(r.kind==='dots');
   else if(r.kind==='arc')ok=true;               /* past the readable cap */
   else ok=(r.drawn===r.wantN)&&(r.lit===r.wantDone);
   if(!ok){fails++;
    console.log('    FAIL ring '+r.nm+': drew '+r.kind+' '+r.drawn+'/'+r.lit
     +' against a model of '+r.wantN+'/'+r.wantDone);}});

  /* THE PAGE IS MEASURED ON WHAT IT DEALS, NOT ON WHAT THE RUN ADDED. The
     four library rituals above are a demonstration of the ring and they are
     four cards a person did not ask for, so the choice count is taken after
     a reload. Counting them put the first run at 21 against a page that
     deals fewer. */
  await pg.reload(); await pg.waitForTimeout(280);
  await pg.evaluate(n=>{const s=document.getElementById('who');
   if(s&&[...s.options].some(o=>o.value===n)){s.value=n;
    s.dispatchEvent(new Event('change',{bubbles:true}));}},WHO);
  await pg.waitForTimeout(180);

  /* ---------- EYE TRAVEL, AND THE VOID ----------
     "Weight space isn't wasted." The two columns end at different heights and
     the shorter one leaves a hole. It is measured rather than argued about,
     per profile, because how much a column has to say depends on how much
     record the person has. */
  const eye=await pg.evaluate(()=>{
   const y=e=>{if(!e)return null;const b=e.getBoundingClientRect();
    return Math.round(b.y+window.scrollY);};
   const first=document.querySelector('.card:not(.offer)');
   const streak=document.querySelectorAll('.fig')[2];
   const bot=e=>{const b=e.getBoundingClientRect();
    return Math.round(b.bottom+window.scrollY);};
   const L=[...document.querySelectorAll('.colL section')],
         R=[...document.querySelectorAll('.colR section')];
   const lb=L.length?Math.max(...L.map(bot)):0,
         rb=R.length?Math.max(...R.map(bot)):0;
   const top=Math.round(document.querySelector('.grid')
     .getBoundingClientRect().y+window.scrollY);
   /* AND IT IS ONLY A MEASUREMENT WHERE THERE ARE TWO COLUMNS. Below the
      breakpoint the wrappers are display:contents, so their boxes span every
      section and the run reported a 1371 pixel hole in a single column page
      that has none. A tool that lies is worse than no tool. */
   const twoCol=getComputedStyle(document.querySelector('.colL'))
     .display!=='contents';
   return {today:y(first), todayIn:first?first.closest('section').id:null,
    keeping:y(streak), page:document.documentElement.scrollHeight,
    twoCol:twoCol, colL:lb-top, colR:rb-top, void:Math.abs(lb-rb),
    shortSide:lb<rb?'left':'right'};});

  /* ---------- the measurements on the page itself ---------- */
  const m=await pg.evaluate(s=>{
   const out={};
   out.elements=document.querySelectorAll('*').length;
   const d2=new DOMParser().parseFromString(
     document.documentElement.outerHTML,'text/html');
   out.reparsed=d2.querySelectorAll('*').length;

   const vis=[...document.querySelectorAll(s)].filter(e=>e.offsetParent!==null);
   const days=vis.filter(e=>e.classList.contains('dcol'));
   const segs=vis.filter(e=>e.closest('#sumseg'));
   const ctrls=vis.filter(e=>!e.classList.contains('dcol')&&!e.closest('#sumseg'));
   const name=e=>((e.id||(typeof e.className==='string'?e.className:e.tagName)
     ||e.tagName)+' '+Math.round(e.getBoundingClientRect().width)+'x'
     +Math.round(e.getBoundingClientRect().height));
   /* anything with a pointer and no interactive ancestor is a target too */
   const sneaky=[...document.querySelectorAll('body *')].filter(e=>
    e.offsetParent!==null && !e.matches(s) &&
    getComputedStyle(e).cursor==='pointer' &&
    !e.parentElement.closest(s));
   out.small=[...vis,...sneaky].filter(e=>{const r=e.getBoundingClientRect();
     return r.width>0&&(r.width<44||r.height<44);}).map(name);
   out.controls=ctrls.length; out.dayCols=days.length; out.segBtns=segs.length;
   out.choices=ctrls.length+(days.length?1:0)+(segs.length?1:0);
   out.sneaky=sneaky.length;
   out.words=document.body.innerText.trim().split(/\s+/).length;
   out.wordsNoFoot=document.body.innerText
    .replace(document.getElementById('foot').innerText,'').trim().split(/\s+/).length;
   out.scrollW=document.documentElement.scrollWidth;
   out.clientW=document.documentElement.clientWidth;
   out.figs=[...document.querySelectorAll('.fig')].map(e=>
    e.querySelector('.fig-n').textContent+' '+e.querySelector('.fig-k').textContent
    +'   [title] '+e.getAttribute('title'));
   const t=[];
   for(let i=0;i<40;i++){const a=performance.now();draw();t.push(performance.now()-a);}
   t.sort((x,y)=>x-y);
   out.redraw={median:+t[20].toFixed(2), worst:+t[39].toFixed(2)};
   return out;},SEL);

  console.log('\n'+WHO+'  '+tag+'  '+w+' by '+h);
  console.log('  elements '+m.elements+', re-parsed '+m.reparsed
   +(m.elements===m.reparsed?'  ok':'  FAIL the parser repaired something'));
  if(m.elements!==m.reparsed)fails++;
  console.log('  page    choices '+String(m.choices).padStart(2)
   +'  (controls '+m.controls+', the week as one object over '+m.dayCols
   +' days, the summary as one over '+m.segBtns+')'
   +'  words '+m.wordsNoFoot
   +'  redraw '+m.redraw.median+'ms median, '+m.redraw.worst+'ms worst');
  console.log('  card    choices '+cardM.n+'  (controls '+cardM.ctrls
   +' + '+cardM.rows+' weekday rows as one object each, '+cardM.cells+' cells)'
   +'   add     '+addM.n+' rows: '+addM.q+' generated, '+addM.lib+' library');
  console.log('  rings   '+rings.length+' drawn: '
   +rings.map(r=>r.nm.split(' ')[0]+' '+(r.wantN===null?'dots':r.wantN+'d')
     +(r.wantDone?'/'+r.wantDone:'')).join(', '));
  console.log('  eye     "'+Q1+'" at y='+eye.today+' in #'+eye.todayIn
   +(eye.today<h?', inside the first screen':', BELOW the first screen')
   +'   "'+Q2+'" at y='+eye.keeping
   +(eye.keeping<h?', inside the first screen':', BELOW the first screen')
   +'   page is '+eye.page+' tall');
  console.log(eye.twoCol
   ?('  columns left '+eye.colL+', right '+eye.colR+', so the '
     +eye.shortSide+' leaves '+eye.void+' pixels, '
     +Math.round(100*eye.void/Math.max(eye.colL,eye.colR))+' per cent of the '
     +'taller column')
   :'  columns one at this width, so there is no column to leave a hole');
  console.log('  horizontal scroll: '+m.scrollW+' against a viewport of '+m.clientW
   +(m.scrollW>m.clientW?'  FAIL':'  none'));
  if(m.scrollW>m.clientW)fails++;
  if(m.redraw.worst>16.7){fails++;console.log('    FAIL redraw over one frame');}
  if(m.small.length){fails++;console.log('    FAIL sub 44 on the page: '+m.small.join(', '));}
  if(cardM.small.length){fails++;console.log('    FAIL sub 44 in the card: '+cardM.small.join(', '));}
  if(addM.small){fails++;console.log('    FAIL sub 44 in the add sheet: '+addM.small);}
  m.figs.forEach(f=>console.log('    figure  '+f));
  if(errs.length){fails++;console.log('  FAIL '+errs.join(' | '));}
  await pg.close();}

 /* ---------- the request log, printed in full ---------- */
 const off=reqs.filter(u=>!/^file:/.test(u));
 console.log('\nREQUEST LOG  '+reqs.length+' requests');
 [...new Set(reqs)].forEach(u=>console.log('  '+u.replace(__dirname,'.')));
 if(off.length){fails++;console.log('  FAIL '+off.length+' were not file:');}
 else console.log('  every one is file:, nothing left the machine');

 console.log('\n'+(fails?fails+' FAILURES':'all checks green')
  +'   ritual2.html '+(fs.statSync(__dirname+'/ritual2.html').size/1024).toFixed(1)+' kB');
 await b.close();
 process.exitCode=fails?1:0;
})();
