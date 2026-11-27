/* SHOOTS THE RITUAL PAGE AND MEASURES IT. One run, because a screenshot taken
   in a different session from the measurement is two claims about two builds.

   Everything it asserts:
     the request log            every request, with its url. Anything that is
                                not file: is a failure, not a warning.
     the parse round trip       document.documentElement.outerHTML re-parsed
                                must build the same number of elements. A tag
                                the parser repaired shows up here and does not
                                show up in a text count of the source.
     simultaneous choices       visible interactive elements. The seven column
                                waveform counts as ONE object, because that is
                                what a person treats it as, and the column
                                count is printed beside it rather than folded
                                in. The popup is counted as its own surface.
     touch targets              nothing interactive below 44 by 44. Anything
                                with a click handler and no button role is
                                counted too, which is the dodge the calendar's
                                heat map got away with.
     redraw                     median and worst of 40 full redraws.
     page errors                any thrown error fails the run.
*/
const {chromium}=require('playwright');
const fs=require('fs');
const WHO=process.argv[2]||'Marcus';
const URL='file://'+__dirname+'/ritual.html';
const SEL='button,input,select,textarea,a[href],[role=button]';

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
  await pg.screenshot({path:__dirname+'/rit-'+WHO+'-page-'+tag+'.png',fullPage:true});

  /* the card popup, which is his own design and its own surface */
  await pg.evaluate(()=>{const c=document.querySelector('[data-open]');if(c)c.click();});
  await pg.waitForTimeout(200);
  await pg.screenshot({path:__dirname+'/rit-'+WHO+'-card-'+tag+'.png',fullPage:true});
  /* THE SAME CONVENTION AS THE WEEK. A uniform row of seven weekday toggles
     is one object a person reaches for, not seven decisions, so it counts as
     one and the cell count is printed beside it. Counting every cell put the
     card at 24 against a working memory of about four, which is a number that
     describes the counting rule and not the surface. */
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

  /* a stance card, where there is one. It is the shape that needed solving,
     so it is the one frame worth having on its own. */
  const hasStance=await pg.evaluate(()=>{
   const c=[...document.querySelectorAll('[data-open]')].filter(e=>
    /stance/.test(e.querySelector('.card-p').textContent))[0];
   if(!c)return false; c.click(); return true;});
  if(hasStance){await pg.waitForTimeout(200);
   await pg.screenshot({path:__dirname+'/rit-'+WHO+'-stance-'+tag+'.png',fullPage:true});
   await pg.evaluate(()=>document.getElementById('s-close').click());}

  /* THE MECHANIC, DEMONSTRATED RATHER THAN DESCRIBED. Every offer on the
     page taken, so the waveform shows the shape he asked for: a column per
     day whose height is that day's load, varying because a behaviour is set
     on weekdays and always on is set on all seven. Nothing here is fabricated
     data: it is the real proposals, taken by a real control, counting from
     today forward. */
  await pg.evaluate(()=>{
   let n=0;
   while(document.querySelector('.card.offer')&&n<8){
    document.querySelector('.card.offer').click();
    const t=document.getElementById('s-take'); if(t)t.click(); n++;}
   const c=document.getElementById('s-close'); if(c)c.click();});
  await pg.waitForTimeout(220);
  await pg.screenshot({path:__dirname+'/rit-'+WHO+'-taken-'+tag+'.png',fullPage:true});
  await pg.reload(); await pg.waitForTimeout(260);
  await pg.evaluate(n=>{const s=document.getElementById('who');
   if(s&&[...s.options].some(o=>o.value===n)){s.value=n;
    s.dispatchEvent(new Event('change',{bubbles:true}));}},WHO);
  await pg.waitForTimeout(160);

  /* the queue */
  await pg.evaluate(()=>document.getElementById('addbtn').click());
  await pg.waitForTimeout(200);
  await pg.screenshot({path:__dirname+'/rit-'+WHO+'-queue-'+tag+'.png',fullPage:true});
  const queueM=await pg.evaluate(s=>{
   const v=[...document.querySelectorAll('#sheet '+s+',#sheet [data-q]')]
    .filter(e=>e.offsetParent!==null);
   return {n:v.length, rows:document.querySelectorAll('#sheet [data-q]').length,
    small:v.filter(e=>{const r=e.getBoundingClientRect();
     return r.width>0&&(r.width<44||r.height<44);}).length};},SEL);
  await pg.evaluate(()=>document.getElementById('s-close').click());
  await pg.waitForTimeout(120);

  /* ---------- the measurements on the page itself ---------- */
  const m=await pg.evaluate(s=>{
   const out={};
   const live=document.querySelectorAll('*').length;
   const d2=new DOMParser().parseFromString(
     document.documentElement.outerHTML,'text/html');
   out.elements=live; out.reparsed=d2.querySelectorAll('*').length;

   const vis=[...document.querySelectorAll(s)].filter(e=>e.offsetParent!==null);
   const wave=vis.filter(e=>e.classList.contains('wcol'));
   const ctrls=vis.filter(e=>!e.classList.contains('wcol'));
   /* ANYTHING WITH A POINTER AND NO INTERACTIVE ANCESTOR IS COUNTED TOO. The
      calendar's heat map cells had cursor:pointer and a click path and were
      <i>, so the touch target check never saw them.

      THE FIRST CUT OF THIS CHECK LIED, and it is the known good case rule in
      CLAUDE.md biting: cursor is inherited, so every span inside a button
      came back as its own sub 44 target and the run reported forty false
      failures. What makes an element a target is having no interactive
      ancestor, which is exactly the calendar's case and not this one. */
   const name=e=>((e.id||(typeof e.className==='string'?e.className:e.tagName)
     ||e.tagName)+' '+Math.round(e.getBoundingClientRect().width)+'x'
     +Math.round(e.getBoundingClientRect().height));
   const sneaky=[...document.querySelectorAll('body *')].filter(e=>
    e.offsetParent!==null && !e.matches(s) &&
    getComputedStyle(e).cursor==='pointer' &&
    !e.parentElement.closest(s));
   const small=[...vis,...sneaky].filter(e=>{const r=e.getBoundingClientRect();
     return r.width>0&&(r.width<44||r.height<44);}).map(name);
   out.controls=ctrls.length; out.waveCols=wave.length;
   out.choices=ctrls.length+(wave.length?1:0);
   out.sneaky=sneaky.length;
   out.small=small;
   out.words=document.body.innerText.trim().split(/\s+/).length;
   out.wordsNoFoot=document.body.innerText
    .replace(document.getElementById('foot').innerText,'').trim().split(/\s+/).length;
   out.scrollW=document.documentElement.scrollWidth;
   out.clientW=document.documentElement.clientWidth;
   /* every figure says what it is out of */
   out.figs=[...document.querySelectorAll('.fig')].map(e=>
    e.querySelector('.fig-n').textContent+' | '
    +e.querySelector('.fig-k').textContent+' | '
    +e.querySelector('.fig-o').textContent);
   /* redraw, 40 full draws */
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
   +'  (controls '+m.controls+' + the week as one object, '+m.waveCols+' columns)'
   +'  words '+m.wordsNoFoot
   +'  redraw '+m.redraw.median+'ms median, '+m.redraw.worst+'ms worst');
  console.log('  card    choices '+cardM.n+'  (controls '+cardM.ctrls
   +' + '+cardM.rows+' weekday rows as one object each, '+cardM.cells+' cells)'
   +'   queue   choices '+queueM.n+' over '+queueM.rows+' rows');
  console.log('  horizontal scroll: '+m.scrollW+' against a viewport of '+m.clientW
   +(m.scrollW>m.clientW?'  FAIL':'  none'));
  if(m.scrollW>m.clientW)fails++;
  if(m.redraw.worst>16.7){fails++;console.log('    FAIL redraw over one frame');}
  if(m.small.length){fails++;console.log('    FAIL sub 44 on the page: '+m.small.join(', '));}
  if(cardM.small.length){fails++;console.log('    FAIL sub 44 in the card: '+cardM.small.join(', '));}
  if(queueM.small){fails++;console.log('    FAIL sub 44 in the queue: '+queueM.small);}
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
  +'   ritual.html '+(fs.statSync(__dirname+'/ritual.html').size/1024).toFixed(1)+' kB');
 await b.close();
 process.exitCode=fails?1:0;
})();
