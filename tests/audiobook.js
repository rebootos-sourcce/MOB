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
 await browser.close();
 if(fail)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1);});
