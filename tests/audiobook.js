#!/usr/bin/env node
/* Audiobook release regression: controls, default Marin, mode persistence,
   binaural mix, and voice passed to the existing server endpoint. No real API call. */
const path=require('path');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const SRC='file://'+path.resolve(process.env.AUDIOBOOK_HTML||path.join(ROOT,'source.html'));
const CHROME=process.env.CHROME||chromium.executablePath();
(async()=>{
 const browser=await chromium.launch({executablePath:CHROME});
 let fail=0, pass=0;
 for(const width of [390,1600]){
  const page=await browser.newPage({viewport:{width,height:960}});
  await page.goto(SRC,{waitUntil:'load'});
  await page.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});
  const result=await page.evaluate(async()=>{
   loadP(0);
   // The Release controls are offered only when this fixture has releasable charge.
   CHARGES.forEach(c=>{S.charge[c]=7;});
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
  if(success)pass++;else fail++;
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
  if(success)pass++;else fail++;
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
  if(success)pass++;else fail++;
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
  if(success)pass++;else fail++;
  await page.close();
 }
 // A near-instant audio completion must not credit a line in Audiobook mode.
 // Play retries that same line rather than advancing the release cursor.
 {
  const page=await browser.newPage({viewport:{width:390,height:960}});
  await page.goto(SRC,{waitUntil:'load'});
  await page.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});
  const result=await page.evaluate(async()=>{
   loadP(0);
   CHARGES.forEach(c=>{S.charge[c]=7;});
   CURP.ui.voice=true;CURP.ui.tone=false;CURP.ui.releaseMode='listen';
   relPick(compute().carrying.slice(0,1).map(n=>n.i));
   const oldSay=window.speakStudio,oldWarm=window.studioWarm;
   let attempts=0;
   window.studioWarm=function(){};
   window.speakStudio=function(text,rate,style,onend,onfail){
    attempts++;setTimeout(()=>onend(1),0);return true;
   };
   try{
    document.getElementById('relgo').click();
    await new Promise(r=>setTimeout(r,75));
    const before={paused:RUN.paused,phase:RUN.phase,line:RUN.line,
     idx:RUN.idx,pass:RUN.pass,attempts};
    window.speakStudio=function(text,rate,style,onend,onfail){
     attempts++;setTimeout(()=>onend(10000),0);return true;
    };
    const button=document.getElementById('relpause');
    if(button)button.click();
    await new Promise(r=>setTimeout(r,65));
    const after={paused:RUN.paused,phase:RUN.phase,line:RUN.line,
     idx:RUN.idx,pass:RUN.pass,attempts};
    return {before,after,play:!!button};
   }finally{
    relClose();
    window.speakStudio=oldSay;window.studioWarm=oldWarm;
   }
  });
  const success=result.play&&result.before.paused===true&&
   result.before.phase==='opening'&&result.before.line===0&&
   result.before.idx===0&&result.before.pass===0&&
   result.after.attempts>result.before.attempts&&
   (result.after.phase!==result.before.phase||result.after.line>result.before.line);
  console.log((success?'ok':'FAIL')+' audiobook near-instant completion holds cursor '+JSON.stringify(result));
  if(success)pass++;else fail++;
  await page.close();
 }
 // In-flight requests share one synthesis, cached speech is isolated by voice,
 // and a failed request can be retried. The words are synthetic test fixtures.
 {
  const page=await browser.newPage({viewport:{width:390,height:960}});
  await page.goto(SRC,{waitUntil:'load'});
  await page.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});
  const result=await page.evaluate(async()=>{
   loadP(0);
   const original=window.authVoice, originalName=CURP.ui.voiceName;
   const text='Audiobook cache isolation fixture.';
   const calls=[];
   let shared=false, cached=false, otherVoice=false, rejected=false, retried=false;
   try{
    window.authVoice=(line,style,voice)=>{
     calls.push({line,style,voice});
     return new Promise(resolve=>setTimeout(()=>
      resolve({ok:true,blob:new Blob(['synthetic'],{type:'audio/mpeg'})}),20));
    };
    CURP.ui.voiceName='marin';
    const pair=await Promise.all([studioAsk(text,'list'),studioAsk(text,'list')]);
    shared=pair[0].ok&&pair[1].ok&&pair[0].blob===pair[1].blob&&calls.length===1;
    await studioAsk(text,'list');
    cached=calls.length===1;
    CURP.ui.voiceName='cedar';
    const alternate=await studioAsk(text,'list');
    otherVoice=alternate.ok&&calls.length===2&&calls[0].voice==='marin'&&
     calls[1].voice==='cedar'&&alternate.blob!==pair[0].blob;
    let attempts=0;
    window.authVoice=()=>{
     attempts++;
     return attempts===1?Promise.reject(new Error('synthetic transient failure')):
      Promise.resolve({ok:true,blob:new Blob(['retry'],{type:'audio/mpeg'})});
    };
    const retryText='Audiobook failed cache request fixture.';
    try{await studioAsk(retryText,'frame');}catch(e){rejected=true;}
    const done=await studioAsk(retryText,'frame');
    retried=done.ok&&attempts===2;
   }finally{
    window.authVoice=original;
    if(originalName===undefined)delete CURP.ui.voiceName;
    else CURP.ui.voiceName=originalName;
   }
   return {shared,cached,otherVoice,rejected,retried,calls:calls.length};
  });
  const success=result.shared&&result.cached&&result.otherVoice&&
   result.rejected&&result.retried&&result.calls===2;
  console.log((success?'ok':'FAIL')+' audiobook voice cache isolation and retry '+JSON.stringify(result));
  if(success)pass++;else fail++;
  await page.close();
 }
 await browser.close();
 console.log('===== '+pass+' passed, '+fail+' failed =====');
 if(fail)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1);});
