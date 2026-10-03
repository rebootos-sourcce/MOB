#!/usr/bin/env node
/* ============================================================
   proto/ladder/shot.js  ·  LOOK AT IT, AND PROVE IT FETCHES NOTHING.

   Run from the repo root:
     NODE_PATH=$(npm root -g) node proto/ladder/shot.js

   It counts every request the page makes, fails on any that is not the file it
   loaded or one of its three local scripts, and writes both widths.
   ============================================================ */
const path=require('path');
const {chromium}=require('playwright');
const R=path.resolve(__dirname,'../..');
const URL='file://'+path.join(__dirname,'index.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const out=[];
 for(const [w,h,nm] of [[1600,1000,'wide'],[390,844,'phone']]){
  const ctx=await b.newContext({viewport:{width:w,height:h},
   deviceScaleFactor:1});
  const page=await ctx.newPage();
  const reqs=[], errs=[];
  page.on('request',r=>reqs.push(r.url()));
  page.on('pageerror',e=>errs.push(String(e&&e.message||e)));
  page.on('console',m=>{ if(m.type()==='error')errs.push('console: '+m.text()); });
  await page.goto(URL,{waitUntil:'load'});
  await page.waitForFunction(()=>{
   const el=document.getElementById('body');
   return el&&el.innerHTML.length>2000;},null,{timeout:30000});
  await page.waitForTimeout(400);
  /* THE REQUEST GATE. Anything not a file:// url under this repo is an
     outbound request and fails the run. */
  const bad=reqs.filter(u=>!/^file:\/\//.test(u));
  const files=reqs.filter(u=>/^file:\/\//.test(u))
   .map(u=>u.replace('file://'+R+'/',''));
  console.log('\n== '+nm+' '+w+'x'+h+' ==');
  console.log('requests           : '+reqs.length);
  files.forEach(f=>console.log('  file             : '+f));
  console.log('outbound requests  : '+(bad.length?('FAIL '+bad.join(', ')):'none'));
  console.log('page errors        : '+(errs.length?('FAIL '+errs.join(' | ')):'none'));
  const m=await page.evaluate(()=>({
   body:document.getElementById('body').innerHTML.length,
   marks:document.querySelectorAll('.mk').length,
   svg:document.querySelectorAll('svg').length,
   scrollW:document.documentElement.scrollWidth,
   clientW:document.documentElement.clientWidth,
   fills:Array.from(document.querySelectorAll('svg path'))
    .filter(p=>{const f=p.getAttribute('fill');return f&&f!=='none';}).length,
   dash:document.body.innerText.indexOf(String.fromCharCode(8212))>=0}));
  console.log('markup, centre     : '+m.body+' characters');
  console.log('mark and award tiles: '+m.marks);
  console.log('svg figures        : '+m.svg);
  console.log('filled icon paths  : '+(m.fills?('FAIL '+m.fills):'none, ring only'));
  console.log('em dash on the page: '+(m.dash?'FAIL':'none'));
  console.log('horizontal scroll  : '+(m.scrollW>m.clientW+1
   ?('FAIL '+m.scrollW+' > '+m.clientW):'none'));
  await page.screenshot({path:path.join(__dirname,'shot-'+nm+'.png'),
   fullPage:true});
  out.push({nm,bad:bad.length,errs:errs.length,
   over:m.scrollW>m.clientW+1,fills:m.fills,dash:m.dash});
  await ctx.close();}
 await b.close();
 const fail=out.filter(o=>o.bad||o.errs||o.over||o.fills||o.dash);
 console.log('\n'+(fail.length?'GATE FAILED: '+fail.map(o=>o.nm).join(', ')
  :'gate passed at both widths'));
 process.exit(fail.length?1:0);})();
