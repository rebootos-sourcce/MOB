#!/usr/bin/env node
/* Audiobook release regression: controls, default Marin, mode persistence,
   binaural mix, and voice passed to the existing server endpoint. No real API call. */
const path=require('path');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const SRC='file://'+path.resolve(process.env.AUDIOBOOK_HTML||path.join(ROOT,'source.html'));
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async()=>{
 const browser=await chromium.launch({executablePath:CHROME});
 let fail=0;
 for(const width of [390,1600]){
  const page=await browser.newPage({viewport:{width,height:960}});
  await page.goto(SRC,{waitUntil:'load'});
  await page.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});
  const result=await page.evaluate(async()=>{
   loadP(0);
   if(!CURP.ui)CURP.ui={};
   CURP.ui.voice=true; CURP.ui.tone=false;
   delete CURP.ui.voiceName; delete CURP.ui.releaseMode;
   relPick(compute().carrying.slice(0,1).map(n=>n.i));
   const a=document.getElementById('relvoicepick'),m=document.getElementById('relplaymode');
   if(!a||!m)return {error:'release voice and mode selects missing'};
   const initial={voice:a.value,mode:m.value,on:relVoiceWanted()};
   a.value='cedar';a.dispatchEvent(new Event('change',{bubbles:true}));
   const chosen=relVoiceName();
   // Guided tone is exclusive: enabling tone turns narration off.
   document.getElementById('reltone')?.click();
   const guided={voice:relVoiceWanted(),tone:relToneOn()};
   const mode=document.getElementById('relplaymode');
   mode.value='listen';mode.dispatchEvent(new Event('change',{bubbles:true}));
   const listen={voice:relVoiceWanted(),tone:relToneOn(),mode:CURP.ui.releaseMode,
     spacing:relStepSec({kind:'pass',text:'I let go.'}),guidedSpacing:relSpace()};
   const old=authCall;let body=null;
   window.authCall=function(method,url,payload){body=payload;return Promise.resolve({ok:false,status:503});};
   await authVoice('A short release line.','list');
   window.authCall=old;
   const selected=body&&body.voice, style=body&&body.style;
   relClose();
   return {initial,chosen,guided,listen,selected,style};
  });
  const success=!result.error&&result.initial.voice==='marin'&&result.initial.mode==='guided'&&
   result.initial.on===true&&result.chosen==='cedar'&&result.guided.voice===false&&
   result.guided.tone===true&&result.listen.voice===true&&result.listen.tone===true&&
   result.listen.mode==='listen'&&result.listen.spacing<result.listen.guidedSpacing&&
   result.selected==='cedar'&&result.style==='list';
  console.log((success?'ok':'FAIL')+' audiobook '+width+'px '+JSON.stringify(result));
  if(!success)fail++;
  await page.close();
 }
 // Audio failure must pause Audiobook rather than silently complete a Release.
 // The next Play press retries the identical step, never a new release record.
 {
  const page=await browser.newPage({viewport:{width:390,height:960}});
  await page.goto(SRC,{waitUntil:'load'});
  await page.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});
  const result=await page.evaluate(async()=>{
   loadP(0);
   CHARGES.forEach(c=>{S.charge[c]=7;});
   CURP.ui.voice=true;CURP.ui.tone=false;CURP.ui.releaseMode='listen';
   relPick(compute().carrying.slice(0,1).map(n=>n.i));
   const start=document.getElementById('relgo');
   if(!start)return {error:'Release button missing'};
   const oldSay=window.speakStudio,oldWarm=window.studioWarm;
   let attempts=0;
   window.studioWarm=function(){};
   window.speakStudio=function(text,rate,style,onend,onfail){
    attempts++;
    setTimeout(()=>onfail(502),0);return true;
   };
   start.click();
   await new Promise(r=>setTimeout(r,80));
   const before={paused:RUN.paused,phase:RUN.phase,line:RUN.line,
    idx:RUN.idx,pass:RUN.pass,attempts,studioLost:RUN.studioLost};
   window.speakStudio=function(text,rate,style,onend,onfail){
    attempts++;
    setTimeout(()=>onend(10000),25);return true;
   };
   const play=document.getElementById('relpause');
   if(play)play.click();
   await new Promise(r=>setTimeout(r,45));
   const after={paused:RUN.paused,phase:RUN.phase,line:RUN.line,
    idx:RUN.idx,pass:RUN.pass,attempts,studioLost:RUN.studioLost};
   relClose();
   window.speakStudio=oldSay;window.studioWarm=oldWarm;
   return {before,after,play:!!play};
  });
  const success=!result.error&&result.play&&result.before.paused===true&&
   result.before.studioLost===true&&result.before.phase==='opening'&&
   result.before.idx===0&&result.before.line===0&&result.before.pass===0&&
   result.after.paused===false&&result.after.attempts>result.before.attempts&&
   (result.after.line>result.before.line||result.after.phase!==result.before.phase);
  console.log((success?'ok':'FAIL')+' audiobook narration failure and retry '+JSON.stringify(result));
  if(!success)fail++;
  await page.close();
 }
 // If the narrator stalls without calling back, the fallback timer must pause,
 // not complete a line that was never spoken. Run the real scheduled callback.
 {
  const page=await browser.newPage({viewport:{width:390,height:960}});
  await page.goto(SRC,{waitUntil:'load'});
  await page.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});
  const result=await page.evaluate(()=>{
   loadP(0);
   CHARGES.forEach(c=>{S.charge[c]=7;});
   CURP.ui.voice=true; CURP.ui.tone=false; CURP.ui.releaseMode='listen';
   relPick(compute().carrying.slice(0,1).map(n=>n.i));
   const start=document.getElementById('relgo');
   if(!start)return {error:'Release button missing'};
   const oldSay=window.speakStudio,oldWarm=window.studioWarm,oldTimeout=window.setTimeout;
   window.speakStudio=function(){return true;};
   window.studioWarm=function(){};
   start.click();
   RUN.phase='opening';RUN.line=0;RUN.paused=false;
   let held=null;
   window.setTimeout=function(fn,ms,...args){
    if(ms>=9000&&!held){held=()=>fn(...args);return 987654321;}
    return oldTimeout(fn,ms,...args);
   };
   relStep();
   window.setTimeout=oldTimeout;
   const before={phase:RUN.phase,line:RUN.line,idx:RUN.idx,pass:RUN.pass,paused:RUN.paused};
   if(held)held();
   const after={phase:RUN.phase,line:RUN.line,idx:RUN.idx,pass:RUN.pass,paused:RUN.paused};
   window.speakStudio=oldSay;window.studioWarm=oldWarm;relClose();
   return {before,after,held:!!held};
  });
  const success=!result.error&&result.held&&result.before.paused===false&&
   result.after.paused===true&&result.after.phase===result.before.phase&&
   result.after.line===result.before.line&&result.after.idx===result.before.idx&&
   result.after.pass===result.before.pass;
  console.log((success?'ok':'FAIL')+' audiobook stalled speech timeout '+JSON.stringify(result));
  if(!success)fail++;
  await page.close();
 }
 // A rejected network promise must produce exactly one audio failure callback.
 {
  const page=await browser.newPage({viewport:{width:390,height:960}});
  await page.goto(SRC,{waitUntil:'load'});
  await page.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});
  const result=await page.evaluate(async()=>{
   const old=window.authVoice,unhandled=[];
   const track=e=>{unhandled.push(String(e.reason));e.preventDefault();};
   window.addEventListener('unhandledrejection',track);
   window.authVoice=()=>Promise.reject(new Error('test network rejection'));
   let failures=0,completed=0;
   const started=speakStudio('Private network rejection fixture.',1,'list',
    ()=>{completed++;},()=>{failures++;});
   await new Promise(r=>setTimeout(r,90));
   window.authVoice=old;
   window.removeEventListener('unhandledrejection',track);
   speakStop();
   return {started,failures,completed,unhandled};
  });
  const success=result.started&&result.failures===1&&result.completed===0&&
   result.unhandled.length===0;
  console.log((success?'ok':'FAIL')+' audiobook rejected network promise '+JSON.stringify(result));
  if(!success)fail++;
  await page.close();
 }
 await browser.close();
 if(fail)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1);});
