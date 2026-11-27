#!/usr/bin/env node
/* Shoots proto/release/index.html and measures it in the same run.

   Asserts, and exits non zero on any of them:

     requests        anything the page fetched that is not engine.js itself.
                     Audio is the first capability here that could reach a
                     network without anybody deciding to, so this is the gate
                     that matters most on this page.
     page errors     any thrown error or console error fails the run.
     touch targets   nothing interactive under 44 by 44.
     the clock       the countdown is minutes and seconds and it moves down.
     the four phases  every phase renders something: the panel, the release
                     half, the reframe half, the cooldown.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/release/shots.js
*/
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const URL='file://'+path.join(__dirname,'index.html');
const SEL='button,input,select,textarea,a[href],[role=button]';
const OUT=__dirname;

/* the run is driven straight into a phase rather than waited out, because the
   canonical dose is twenty seven minutes and a screenshot should not cost
   that. The page is stepped by setting REL.at, which is the same index the
   timer moves. */
async function jump(pg,frac){
 await pg.evaluate(f=>{
  clearTimeout(REL.stepT);
  REL.at=Math.min(REL.steps.length-1,Math.floor(REL.steps.length*f));
  REL.paused=true; paintRun(); paintClock();
 },frac);
 await pg.waitForTimeout(160);
}

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 let bad=0, notes=[];
 for(const [w,h] of [[1600,1000],[390,844]]){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const pg=await ctx.newPage();
  const reqs=[], errs=[];
  pg.on('request',r=>reqs.push(r.url()));
  pg.on('pageerror',e=>errs.push(String(e)));
  pg.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text());});
  await pg.goto(URL,{waitUntil:'load'});
  await pg.waitForTimeout(700);

  const shot=async(tag)=>{
   await pg.screenshot({path:path.join(OUT,'rel-'+tag+'-'+w+'.png'),fullPage:true});
   const n=await pg.evaluate(()=>document.getElementById('app').innerHTML.length);
   if(n<600){console.log('EMPTY SURFACE '+tag+' at '+w);bad++;}
   notes.push(w+'  '+tag.padEnd(14)+'  '+n+' chars of markup');
  };

  /* 1. the panel before it begins */
  await shot('panel');

  /* 2. the panel with the selection list open */
  await pg.click('#open'); await pg.waitForTimeout(220);
  await shot('select');
  await pg.click('#open'); await pg.waitForTimeout(160);

  /* touch targets, measured on the busiest surface */
  const small=await pg.evaluate(sel=>{
   const out=[];
   document.querySelectorAll(sel).forEach(el=>{
    const r=el.getBoundingClientRect();
    if(r.width===0&&r.height===0)return;
    if(r.width<44||r.height<44)
     out.push((el.id||el.tagName)+' '+Math.round(r.width)+'x'+Math.round(r.height));});
   return out;},SEL);
  if(small.length){console.log('UNDER 44 at '+w+': '+small.join(', '));bad++;}

  const choices=await pg.evaluate(sel=>{
   let n=0; document.querySelectorAll(sel).forEach(el=>{
    const r=el.getBoundingClientRect(); if(r.width>0&&r.height>0)n++;}); return n;},SEL);
  notes.push(w+'  choices        '+choices+' visible interactive elements');

  /* the planned figure, read off the page */
  const planned=await pg.evaluate(()=>{
   const f=[...document.querySelectorAll('.fig')].find(d=>/Planned/.test(d.textContent));
   return f?f.querySelector('b').textContent:null;});
  notes.push(w+'  planned        '+planned);
  if(!/^\d+:\d\d$/.test(planned||'')){console.log('PLANNED IS NOT A CLOCK at '+w);bad++;}

  /* 3. the run, release half */
  await pg.click('#go'); await pg.waitForTimeout(500);
  await jump(pg,0.06);
  const half1=await pg.evaluate(()=>document.getElementById('halfline').textContent);
  notes.push(w+'  half at 6%        '+half1);
  await shot('release');

  /* 4. the run, reframe half */
  await jump(pg,0.22);
  const half2=await pg.evaluate(()=>document.getElementById('halfline').textContent);
  notes.push(w+'  half at 22%       '+half2);
  await shot('reframe');

  /* the clock counts down */
  const c1=await pg.evaluate(()=>document.getElementById('cleft').textContent);
  await jump(pg,0.90);
  const c2=await pg.evaluate(()=>document.getElementById('cleft').textContent);
  const secs=s=>{const p=String(s).split(':');return +p[0]*60+ +p[1];};
  if(!(secs(c2)<secs(c1))){console.log('CLOCK DID NOT FALL at '+w+': '+c1+' then '+c2);bad++;}
  notes.push(w+'  clock          '+c1+' then '+c2);

  /* 5. the cooldown, reached through End */
  await pg.evaluate(()=>{REL.paused=false;});
  await pg.click('#end'); await pg.waitForTimeout(500);
  const half3=await pg.evaluate(()=>document.getElementById('halfline')
   ?document.getElementById('halfline').textContent:'gone');
  notes.push(w+'  after End      '+half3);
  await pg.waitForTimeout(400);
  await shot('cool');

  const stray=reqs.filter(u=>!/index\.html$/.test(u)&&!/engine\.js$/.test(u));
  if(stray.length){console.log('REQUESTS at '+w+': '+stray.join(', '));bad++;}
  else notes.push(w+'  requests       none but the page and engine.js');
  if(errs.length){console.log('ERRORS at '+w+':\n  '+errs.join('\n  '));bad++;}
  await ctx.close();
 }
 await b.close();
 console.log(notes.join('\n'));
 console.log(bad?('\n'+bad+' failures'):'\nall checks green');
 process.exit(bad?1:0);
})();
