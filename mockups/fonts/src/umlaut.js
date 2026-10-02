// u versus u with a diaeresis, every UI face at 14 px on a 1x screen, then cropped and enlarged 5x with no smoothing.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const list=JSON.parse(fs.readFileSync(path.join(__dirname,'fonts.json')));
const url='file://'+path.join(__dirname,'..','specimen.html');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:900,height:900},deviceScaleFactor:1});await p.goto(url+'?f=geist');
 await p.evaluate(async(list)=>{
  document.body.innerHTML='<div id="t" style="padding:12px;background:#1A1D26;color:#EFEDE8;width:860px"></div>';
  const t=document.getElementById('t');
  t.innerHTML=list.map(f=>'<div style="display:flex;align-items:baseline;gap:18px;height:30px"><span style="width:130px;font:11px Inter,sans-serif;color:#94908A">'+f.name+'</span>'+
   '<span style="font:400 14px \''+f.slug+'\'">atuned atüned u ü</span><span style="font:600 14px \''+f.slug+'\'">atuned atüned u ü</span><span style="font:400 13px \''+f.slug+'\'">atuned atüned</span><span style="font:500 56px/30px \''+f.slug+'\';letter-spacing:-.02em;margin-left:20px;position:relative;top:10px">uü</span></div>').join('');
  await document.fonts.ready;},list);
 await p.waitForTimeout(200);
 const el=await p.$('#t');await el.screenshot({path:'/tmp/umlaut-raw.png'});await b.close();})();
