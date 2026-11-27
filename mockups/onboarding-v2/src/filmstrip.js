/* filmstrip.js. Two contact sheets per width, built from the real page so the owner can see the motion on a still page.
     filmstrip-1600.png, filmstrip-390.png : six states across, in the order a person meets them.
     motion-1600.png, motion-390.png       : the Field answering a tap, in time. Row 1 is a feeling tap (Heavy), row 2 a body
                                             tap (Chest). The clock is stepped by hand at 60 steps a second, so each frame is
                                             exactly that many milliseconds after the tap, whatever the machine is doing.
   Run from the repo root after shots.js has drawn ../png:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/onboarding-v2/src/filmstrip.js */
var pw=require('playwright'),path=require('path'),fs=require('fs');
var root=path.join(__dirname,'..'),png=process.env.SHOTS_OUT||path.join(root,'png'),url='file://'+path.join(root,'index.html')+'?clean';
var SEQ=[['arrive-invitation','04','1 Arrive'],['ask','05','2 Ask'],['settle-notice','08','3 Settle'],['feel-tap','10','4 Feel'],['body-tap','12','5 Body'],['mirror','15','6 Mirror']];
function b64(f){return 'data:image/png;base64,'+fs.readFileSync(f).toString('base64');}
async function compose(br,html,w,h,out){
 var pg=await br.newPage({viewport:{width:w,height:h}});await pg.setContent(html);await pg.waitForTimeout(300);
 await pg.screenshot({path:out});await pg.close();console.log(path.basename(out));}
function sheet(rows,fw,gap,label){
 return '<!doctype html><body style="margin:0;background:#0a0a0f;color:#B4B0A8;font:13px/18px system-ui,sans-serif;padding:'+gap+'px">'
  +rows.map(function(row){return '<div style="margin:0 0 '+gap+'px"><div style="margin:0 0 6px;color:#EFEDE8">'+row.title+'</div><div style="display:flex;gap:'+gap+'px">'
   +row.frames.map(function(f){return '<figure style="margin:0;width:'+fw+'px"><img src="'+f.src+'" style="display:block;width:'+fw+'px;border:1px solid rgba(255,255,255,.14);border-radius:6px"><figcaption style="padding-top:4px">'+f.cap+'</figcaption></figure>';}).join('')
   +'</div></div>';}).join('')+'</body>';}
(async function(){
 var br=await pw.chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(var W of [1600,390]){
  var H=W===1600?1000:844,fw=W===1600?318:236,gap=8;
  /* the sequence */
  var frames=SEQ.map(function(s){return {src:b64(path.join(png,W+'-'+s[1]+'-'+s[0]+'.png')),cap:s[2]};});
  var total=SEQ.length*fw+(SEQ.length-1)*gap+gap*2,h=Math.round(fw*H/W)+60;
  await compose(br,sheet([{title:'The first minutes at '+W+', six states on one Field',frames:frames}],fw,gap),total,h,path.join(png,'filmstrip-'+W+'.png'));
  /* the answer in time */
  var ctx=await br.newContext({viewport:{width:W,height:H}}),pg=await ctx.newPage();
  await pg.goto(url);await pg.waitForTimeout(500);
  var CLIP=W===1600?{feel:{x:560,y:320,width:480,height:480},body:{x:300,y:60,width:1000,height:900}}:{feel:{x:0,y:0,width:390,height:470},body:{x:0,y:110,width:390,height:700}};
  var TIMES={feel:[0,.45,.62,.8,1.15,1.7],body:[0,.12,.3,.55,1.0,1.9]};
  var rows=[];
  for(var kind of ['feel','body']){
   await pg.evaluate(function(k){MOCK.restart(true);MOCK.jump(k,3,{freeze:true});MOCK.MEAS.manual=true;},kind);
   await pg.waitForTimeout(900);
   await pg.evaluate(function(k){if(k==='feel')MOCK.pickFeel(0);else MOCK.pickPlace(3);},kind);
   var fr=[],t=0;
   for(var i=0;i<TIMES[kind].length;i++){
    await pg.evaluate(function(d){MOCK.advance(d);},TIMES[kind][i]-t);t=TIMES[kind][i];
    var f=path.join(process.env.TMPDIR||'/tmp','motion-'+W+'-'+kind+'-'+i+'.png');
    await pg.screenshot({path:f,clip:CLIP[kind]});fr.push({src:b64(f),cap:'+'+Math.round(t*1000)+' ms'});fs.unlinkSync(f);}
   await pg.evaluate(function(){MOCK.MEAS.manual=false;});
   rows.push({title:kind==='feel'?'Tap Heavy: pull in, then the wave leaves the centre and each tick overshoots':'Tap Chest: pull in, ripple 1.6 ticks high, the lean, then the colour and the motes arrive late',frames:fr});}
  await ctx.close();
  var cw=CLIP.body.width,fw2=W===1600?318:236;
  var tot=6*fw2+5*gap+gap*2,hh=Math.round(fw2*CLIP.feel.height/CLIP.feel.width)+Math.round(fw2*CLIP.body.height/CLIP.body.width)+120;
  await compose(br,sheet(rows,fw2,gap),tot,hh,path.join(png,'motion-'+W+'.png'));}
 await br.close();})();
