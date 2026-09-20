/* SHOOTS THE CALENDAR AND MEASURES IT. One run, because a screenshot taken in
   a different session from the measurement is two claims about two builds.

   Everything it asserts:
     the request log            every request, with its url. Anything that is
                                not file: is a failure, not a warning.
     the parse round trip       document.documentElement.outerHTML re-parsed
                                must build the same number of elements. A tag
                                the parser repaired shows up here and does not
                                show up in a text count of the source.
     simultaneous choices       visible interactive elements. A uniform grid of
                                day cells counts as ONE object, because that is
                                what a person treats it as, and the cell count
                                is printed beside it rather than folded in.
     touch targets              nothing interactive below 44 by 44.
     redraw                     median and worst of 40 full redraws.
     page errors                any thrown error fails the run.
*/
const {chromium}=require('playwright');
const fs=require('fs');
const WHO=process.argv[2]||'Marcus';
const SPANS=['month','week','day'];
const URL='file://'+__dirname+'/calendar.html';

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
   if(s&&[...s.options].some(o=>o.value===n)){s.value=n;s.onchange();}},WHO);

  for(const sp of SPANS){
   await pg.evaluate(s=>{[...document.querySelectorAll('#span [data-v]')]
     .filter(b=>b.dataset.v===s)[0].click();},sp);
   await pg.waitForTimeout(160);
   await pg.screenshot({path:__dirname+'/cal-'+WHO+'-'+sp+'-'+tag+'.png',fullPage:true});
  }
  /* the queue, open, at the month span */
  await pg.evaluate(()=>{[...document.querySelectorAll('#span [data-v]')]
    .filter(b=>b.dataset.v==='month')[0].click();
   document.getElementById('qbtn').click();});
  await pg.waitForTimeout(200);
  await pg.screenshot({path:__dirname+'/cal-'+WHO+'-queue-'+tag+'.png',fullPage:true});
  await pg.evaluate(()=>document.getElementById('qclose').click());
  await pg.waitForTimeout(120);

  /* ---------- the measurements ---------- */
  const m=await pg.evaluate(spans=>{
   const out={spans:{}};
   /* parse round trip */
   const live=document.querySelectorAll('*').length;
   const d2=new DOMParser().parseFromString(
     document.documentElement.outerHTML,'text/html');
   out.elements=live; out.reparsed=d2.querySelectorAll('*').length;

   const SEL='button,input,select,textarea,a[href],[role=button]';
   const grid=e=>e.matches('.cell');
   for(const sp of spans){
    [...document.querySelectorAll('#span [data-v]')]
      .filter(b=>b.dataset.v===sp)[0].click();
    const vis=[...document.querySelectorAll(SEL)].filter(e=>e.offsetParent!==null);
    const cells=vis.filter(grid);
    const ctrls=vis.filter(e=>!grid(e));
    const small=vis.filter(e=>{const r=e.getBoundingClientRect();
      return r.width>0&&(r.width<44||r.height<44);})
     .map(e=>{const r=e.getBoundingClientRect();
      return (e.id||e.className||e.tagName)+' '+Math.round(r.width)+'x'+Math.round(r.height);});
    out.spans[sp]={controls:ctrls.length, cells:cells.length,
     choices:ctrls.length+(cells.length?1:0),
     small:small,
     words:document.body.innerText.trim().split(/\s+/).length,
     wordsNoFoot:document.body.innerText
      .replace(document.getElementById('foot').innerText,'').trim().split(/\s+/).length};}
   /* the queue's own choice count, which is a surface of its own */
   [...document.querySelectorAll('#span [data-v]')]
     .filter(b=>b.dataset.v==='month')[0].click();
   document.getElementById('qbtn').click();
   const qv=[...document.querySelectorAll('#q '+SEL)].filter(e=>e.offsetParent!==null);
   out.queue={controls:qv.length,
    rows:document.querySelectorAll('#qlist .qrow').length,
    small:qv.filter(e=>{const r=e.getBoundingClientRect();
      return r.width>0&&(r.width<44||r.height<44);}).length};
   document.getElementById('qclose').click();
   /* redraw, 40 full draws at each span */
   out.redraw={};
   for(const sp of spans){
    const btn=[...document.querySelectorAll('#span [data-v]')]
      .filter(b=>b.dataset.v===sp)[0];
    btn.click();
    const t=[];
    for(let i=0;i<40;i++){const a=performance.now();draw();t.push(performance.now()-a);}
    t.sort((x,y)=>x-y);
    out.redraw[sp]={median:+t[20].toFixed(2), worst:+t[39].toFixed(2)};}
   return out;},SPANS);

  console.log('\n'+WHO+'  '+tag+'  '+w+' by '+h);
  console.log('  elements '+m.elements+', re-parsed '+m.reparsed
   +(m.elements===m.reparsed?'  ok':'  FAIL the parser repaired something'));
  if(m.elements!==m.reparsed)fails++;
  SPANS.forEach(sp=>{const s=m.spans[sp];
   console.log('  '+sp.padEnd(6)+' choices '+String(s.choices).padStart(2)
    +'  (controls '+String(s.controls).padStart(2)+' + the grid as one object, '
    +s.cells+' cells)'
    +'  words '+String(s.wordsNoFoot).padStart(3)
    +'  redraw '+m.redraw[sp].median+'ms median, '+m.redraw[sp].worst+'ms worst');
   if(s.small.length){fails++;console.log('    FAIL sub 44: '+s.small.join(', '));}});
  console.log('  queue   choices '+m.queue.controls+' over '+m.queue.rows
   +' rows, sub 44: '+m.queue.small+(m.queue.small?'  FAIL':''));
  if(m.queue.small)fails++;
  if(errs.length){fails++;console.log('  FAIL '+errs.join(' | '));}
  await pg.close();}

 /* ---------- the request log, printed in full ---------- */
 const off=reqs.filter(u=>!/^file:/.test(u));
 console.log('\nREQUEST LOG  '+reqs.length+' requests');
 [...new Set(reqs)].forEach(u=>console.log('  '+u.replace(__dirname,'.')));
 if(off.length){fails++;console.log('  FAIL '+off.length+' were not file:');}
 else console.log('  every one is file:, nothing left the machine');

 console.log('\n'+(fails?fails+' FAILURES':'all checks green')
  +'   calendar.html '+(fs.statSync(__dirname+'/calendar.html').size/1024).toFixed(1)+' kB');
 await b.close();
 process.exitCode=fails?1:0;
})();
