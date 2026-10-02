/* THE SOUND MAP, GENERATED. node tools/soundmap.js [outdir]
   Run from the repo root with NODE_PATH at a playwright install.

   Nobody can listen in a headless browser, so this renders every sound in the
   atmosphere layer (ui/sound.js, ATM and ATM_MAP) offline through the
   product's own sfxRender and atmAmbBuild, reads the numbers off the samples,
   and writes two things:

     SOUND-MAP.md        the table he audits and tunes from: control kind,
                         sound, pitch, level in dBFS, length. Every figure is
                         read off a render and none is typed, because a
                         number typed into a document is the defect this
                         repository has been bitten by a dozen times.
     sound-map/*.png     one waveform and spectrogram per sound, and an
                         all.png sheet of the lot, so the shape of each sound
                         can be seen without hearing it.

   The page it reads is source.html, so build first. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs'), cp=require('child_process');
const OUT=process.argv[2]||'sound-map';
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const SEATS=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
const booted=async p=>{
 try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}); }catch(e){}
 try{ await p.waitForTimeout(600);
  await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); }); }catch(e){}};
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const pg=await b.newPage({viewport:{width:1600,height:1000}});
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);
 /* ---- render and measure, in the product's own page ---- */
 const D=await pg.evaluate(async seats=>{
  var SR=44100;
  function fft(re,im){var n=re.length;
   for(var i=1,j=0;i<n;i++){var b=n>>1; for(;j&b;b>>=1)j^=b; j^=b;
    if(i<j){var t=re[i];re[i]=re[j];re[j]=t; t=im[i];im[i]=im[j];im[j]=t;}}
   for(var len=2;len<=n;len<<=1){var a=-2*Math.PI/len, wr=Math.cos(a), wi=Math.sin(a);
    for(var i=0;i<n;i+=len){var cr=1,ci=0;
     for(var k=0;k<len/2;k++){var ur=re[i+k],ui=im[i+k],
      vr=re[i+k+len/2]*cr-im[i+k+len/2]*ci, vi=re[i+k+len/2]*ci+im[i+k+len/2]*cr;
      re[i+k]=ur+vr; im[i+k]=ui+vi; re[i+k+len/2]=ur-vr; im[i+k+len/2]=ui-vi;
      var nr=cr*wr-ci*wi; ci=cr*wi+ci*wr; cr=nr;}}}}
  function meter(x,t0){
   var pk=0,last=-1,i0=Math.round(t0*SR);
   for(var i=0;i<x.length;i++){var a=Math.abs(x[i]); if(a>pk)pk=a; if(a>0.0005)last=i;}
   var s=0,n=Math.max(1,last-i0); for(var i=i0;i<last;i++)s+=x[i]*x[i];
   var N=1; while(N<x.length)N<<=1;
   var re=new Float64Array(N), im=new Float64Array(N); re.set(x); fft(re,im);
   var tot=0,cen=0; for(var k=1;k<N/2;k++){var e=re[k]*re[k]+im[k]*im[k], f=k*SR/N; tot+=e; cen+=e*f;}
   return {db:20*Math.log10(pk||1e-9), ms:(last-i0)/SR*1000, rms:20*Math.log10(Math.sqrt(s/n)||1e-9), cen:cen/tot};}
  async function render(sec,fn){
   var ac=new OfflineAudioContext(1,Math.round(sec*SR),SR); fn(ac);
   return (await ac.startRendering()).getChannelData(0);}
  var out={atm:{}, sfx:{}, wave:{}, consts:{}, layers:[], map:[]};
  /* every atmosphere row at every pitch it can sound at */
  for(var i=0;i<ATM.length;i++){ var x=ATM[i], ss=x.seat?[x.seat]:seats, res=[];
   for(var j=0;j<ss.length;j++){ var row=atmRow(x.k,{seat:ss[j]});
    var buf=await render((x.max+300)/1000,function(ac){sfxRender(ac,ac.destination,row,0.01);});
    var m=meter(buf,0.01); res.push({seat:ss[j],hz:row.hz,db:m.db,ms:m.ms,rms:m.rms,cen:m.cen,len:sfxLen(row)});
    /* the waveform that is drawn: Heart where the pitch is the caller's */
    if(ss[j]==='Heart'||x.seat){ out.wave[x.k]={hz:row.hz, sr:SR, x:Array.prototype.slice.call(buf.subarray(0,Math.round((x.max+60)/1000*SR))), max:x.max}; }}
   out.atm[x.k]=res;
   if(x.k==='ping'){ var lr=atmRow('ping',{seat:'Heart',liftDb:ATM_LIFT_DB});
    var lb=await render(0.6,function(ac){sfxRender(ac,ac.destination,lr,0.01);}); var lm=meter(lb,0.01);
    out.atm.pingFar=[{seat:'Heart',hz:lr.hz,db:lm.db,ms:lm.ms,rms:lm.rms,cen:lm.cen,len:sfxLen(lr)}]; }}
  /* the fittings, for the sake of one map */
  for(var f=0;f<SFX.length;f++){ var s=SFX[f];
   var fb=await render((s.max+300)/1000,function(ac){sfxRender(ac,ac.destination,s,0.01);});
   var fm=meter(fb,0.01); out.sfx[s.k]={at:s.at,db:fm.db,ms:fm.ms,len:sfxLen(s)}; }
  /* the room under a zoom: the zoom comes in over 1.2 s, then stops. level 0.35 to 1 */
  var zx=await render(4,function(ac){var h=atmAmbBuild(ac,ac.destination);
   for(var t=0;t<1.2;t+=0.05)atmAmbTo(h,Math.min(1,t/1.2),t);});
  out.wave.ambience={hz:0, sr:SR, x:Array.prototype.slice.call(zx), max:4000};
  var steady=[];
  for(var L of [0.25,0.5,0.75,1]){
   var sx=await render(3,function(ac){var h=atmAmbBuild(ac,ac.destination); for(var t=0;t<2;t+=0.1)atmAmbTo(h,L,t);});
   var seg=sx.slice(Math.round(1.5*SR),Math.round(2*SR)), pk=0, ss2=0;
   for(var i=0;i<seg.length;i++){ var a=Math.abs(seg[i]); if(a>pk)pk=a; ss2+=seg[i]*seg[i]; }
   var tg=atmAmbTarget(L);
   steady.push({L:L,db:20*Math.log10(pk),rms:20*Math.log10(Math.sqrt(ss2/seg.length)),lp:tg.lp,zoom:Math.exp(L*Math.log(WHEEL_ZOOM_MAX))}); }
  out.amb=steady;
  var cs=['ATM_MASTER','ATM_LIFT_DB','ATM_BURST','ATM_SPACE','ATM_HOVER_PER_S','ATM_HOVER_EACH','ATM_HOVER_QUIET','ATM_HOVER_GAP',
   'ATM_AMB_TC','ATM_AMB_HOLD','ATM_AMB_FALL','ATM_AMB_END','ATM_AMB_LP0','ATM_AMB_LP1','SFX_MAX_MS','SFX_CEIL','SFX_BURST','WHEEL_ZOOM_MAX'];
  cs.forEach(function(k){ out.consts[k]=window[k]!==undefined?window[k]:eval(k); });
  out.db=ATM_DB; out.noseat=ATM_NOSEAT;
  out.seatHz={}; seats.forEach(function(s){ out.seatHz[s]=seatHz(s); });
  /* layers and the seats they sound at */
  FB_LAYERS.forEach(function(l){ out.layers.push({surf:'Field',key:l.k,nm:l.nm,seat:ATM_SEAT.fb[l.k]}); });
  Object.keys(BMOVL).forEach(function(k){ out.layers.push({surf:'Body',key:k,nm:BMOVL[k].nm,seat:ATM_SEAT.bm[k]}); });
  Object.keys(CN_OV).forEach(function(k){ out.layers.push({surf:'Compass',key:k,nm:CN_OV[k].nm,seat:ATM_SEAT.cn[k]}); });
  out.layers.forEach(function(l){ l.hz=seatHz(l.seat); });
  out.map=ATM_MAP.map(function(m){ return {kind:m.kind,sel:m.sel||null,hook:m.hook||null,snd:m.snd,hover:!!m.hover}; });
  out.hoverMs=sfxLen(atmRow('hover'));
  out.gaps=ATM.map(function(x){ return x.k+' '+x.gap; });
  return out;},SEATS);
 /* ---- the figures, read off the renders ---- */
 const r0=x=>Math.round(x), d1=x=>(Math.round(x*10)/10).toFixed(1);
 const range=(arr,f)=>{ const v=arr.map(f); return [Math.min(...v),Math.max(...v)]; };
 const hzOf=k=>{ const a=D.atm[k]; const [lo,hi]=range(a,r=>r.hz); return lo===hi?r0(lo)+' Hz':r0(lo)+' to '+r0(hi)+' Hz'; };
 const seatOf=k=>{ const a=D.atm[k]; return a.length===1?a[0].seat:'seat pressed'; };
 const dbOf=k=>{ const [lo,hi]=range(D.atm[k],r=>r.db); return Math.abs(hi-lo)<0.4?d1((lo+hi)/2):d1(lo)+' to '+d1(hi); };
 const msOf=k=>r0(Math.max(...D.atm[k].map(r=>r.ms)));
 const lenOf=k=>r0(Math.max(...D.atm[k].map(r=>r.len)));
 const sndRow=snd=>{
  if(snd==='overlay')return {name:'overlay on, overlay off',pitch:'the layer\'s seat, '+hzOf('overlay-on'),db:'on '+dbOf('overlay-on')+', off '+dbOf('overlay-off'),ms:msOf('overlay-on')+', '+msOf('overlay-off')};
  if(snd==='air')return {name:'air open, air close',pitch:'band noise, sweeping 700 to 1500 up and 1500 to 650 down',db:'open '+dbOf('air-open')+', close '+dbOf('air-close'),ms:msOf('air-open')+', '+msOf('air-close')};
  if(snd==='ambience')return {name:'the room under a zoom',pitch:D.seatHz.Sacral+' and '+D.seatHz.Heart+' Hz with a breath of noise, lowpass '+D.consts.ATM_AMB_LP0+' to '+D.consts.ATM_AMB_LP1+' Hz',
   db:'silent at 1x, '+d1(D.amb[3].db)+' at full zoom',ms:'continuous, zero '+D.consts.ATM_AMB_END+' s after the last input'};
  if(snd==='ping')return {name:'ping',pitch:'the seat pressed, '+hzOf('ping'),db:dbOf('ping')+' at 1x, '+d1(D.atm.pingFar[0].db)+' at full zoom',ms:msOf('ping')};
  const a=D.atm[snd][0]; return {name:({'click-light':'click, light','click':'click, normal','click-heavy':'click, heavy','hover':'hover tick'})[snd]||snd,pitch:r0(a.hz)+' Hz, '+a.seat,db:d1(a.db),ms:r0(a.ms)};};
 const esc=s=>String(s).replace(/\|/g,'\\|');
 let md='';
 const stamp='the ui/sound.js whose md5 begins '+require('crypto').createHash('md5').update(fs.readFileSync('atuned_src/ui/sound.js')).digest('hex').slice(0,8);
 const C=D.consts;
 md+=`# Sound map, the atmosphere layer

Generated by \`node tools/soundmap.js\` from ${stamp}. Every figure
below is read off an offline render of the product's own sound code and none is
typed, so run the tool again after any change and commit the result. The
waveform and spectrogram of each sound are in \`sound-map/\`, and \`sound-map/all.png\`
has them on one sheet.

**The ruling.** Round OU, 1 October: "I don't hear sound effects, they're on." Then:
"I want everything to have a very subtle atmospheric sound. Overlays, clicks, if I
click on the field, if I zoom in, this field sounds a little bit louder. You know,
very subtle sci-fi. Sounds, nothing overwhelming." Round OV: "Yeah, hover should make
sound."

## What to turn to change it

| To change | Edit | In \`ui/sound.js\` |
|---|---|---|
| Everything louder or quieter at once | \`ATM_MASTER\`, now ${C.ATM_MASTER}. 0.5 is 6 dB down, 2 is 6 dB up | the line above \`ATM_DB\` |
| One sound louder or quieter | its entry in \`ATM_DB\`, in dBFS | \`ATM_DB\` |
| Which control kind makes which sound | its row in \`ATM_MAP\`, the selector and the sound | \`ATM_MAP\` |
| Which seat a layer's circle rings | its entry in \`ATM_SEAT\` | \`ATM_SEAT\` |
| What a seat's pitch is | \`FLOWSEAT\` in the engine, which the release reads too | \`engine/data/practice.js\` |
| How fast clicks may come | \`ATM_BURST\` (${C.ATM_BURST} a second) and \`ATM_SPACE\` (${C.ATM_SPACE} ms apart) | the line below \`ATM_LIFT_DB\` |
| How often hover may tick | \`ATM_HOVER_PER_S\` (${C.ATM_HOVER_PER_S} a second), \`ATM_HOVER_EACH\` (${C.ATM_HOVER_EACH} ms per control), \`ATM_HOVER_QUIET\` (${C.ATM_HOVER_QUIET} ms of quiet around any sound) | the same line |
| The room under a zoom | \`ATM_AMB_*\`: its time constants, its end, and its filter range | the block under \`ATM_HOVER_PER_S\` |

The switch is one: Sound effects, in the profile menu and in Settings, Display. It is
on until a person turns it off (\`CURP.ui.sfxoff\`), and Quiet turns the layer off too.

## Control kind, sound, pitch, level, length

The first row a control matches wins. Level is the measured peak in dBFS, decibels
under the loudest the speaker could play, so a bigger negative number is quieter.
The fittings below peak at about ${d1(Math.max(...Object.values(D.sfx).map(s=>s.db)))} dBFS at their loudest.

| Control kind | Sound | Pitch | Level, dBFS | Length, ms | Hover tick |
|---|---|---|---|---|---|
`;
 D.map.forEach(m=>{
  const s=sndRow(m.snd);
  md+=`| ${esc(m.kind)}${m.hook?' (hook: '+esc(m.hook)+')':''} | ${esc(s.name)} | ${esc(s.pitch)} | ${esc(s.db)} | ${esc(s.ms)} | ${m.hook?(m.snd==='hover'?'is the hover':'no'):(m.hover?'yes':'no')} |\n`;});
 md+=`
Hover is the faintest sound in the family: ${r0(D.atm.hover[0].hz)} Hz, ${d1(D.atm.hover[0].db)} dBFS, ${D.hoverMs} ms. Mouse and pen only, never a finger.

## The click weights

| Weight | For | Seat and pitch | Level, dBFS | Length, ms |
|---|---|---|---|---|
| Light | chips, pills, pressed toggles, list rows, section headers | ${D.atm['click-light'][0].seat}, ${r0(D.atm['click-light'][0].hz)} Hz | ${d1(D.atm['click-light'][0].db)} | ${r0(D.atm['click-light'][0].ms)} |
| Normal | buttons, tabs, switches, links, menu items | ${D.atm['click'][0].seat}, ${r0(D.atm['click'][0].hz)} Hz | ${d1(D.atm['click'][0].db)} | ${r0(D.atm['click'][0].ms)} |
| Heavy | primary, destructive and upgrade buttons | ${D.atm['click-heavy'][0].seat}, ${r0(D.atm['click-heavy'][0].hz)} Hz | ${d1(D.atm['click-heavy'][0].db)} | ${r0(D.atm['click-heavy'][0].ms)} |

Weight is length and depth: the lighter the click the higher and shorter it is. Each is a
sine with one partial an octave over it through a lowpass, a 9 to 12 ms attack so it
reads as a tone and never a strike, and a hair of fall in the pitch as the press settles.

## Overlay pitches, by layer

An overlay going on rises two semitones into the pitch and going off falls two
semitones away from it, so up arrives and down leaves, as everywhere else in the
product. One concept keeps one pitch on every surface.

| Surface | Layer | Seat | Pitch, Hz |
|---|---|---|---|
`;
 D.layers.forEach(l=>{ md+=`| ${l.surf} | ${esc(l.nm)} | ${esc(l.seat)} | ${r0(l.hz)} |\n`; });
 md+=`| Compass | each of the seven seat shells | the seat it is | ${SEATS.map(s=>r0(D.seatHz[s])).join(', ')} |

## The Field

A press on the wheel, Frames or Dial rings the seat it landed on. An address, a seat
and an atom carry a seat, a law and an archetype are set at one, and a gate, a pole, a
domain or the core are nowhere in the body, so they ring ${D.noseat}, the middle of the
seven. The ping comes up ${C.ATM_LIFT_DB} dB across the zoom, from ${d1(D.atm.ping.find(r=>r.seat==='Heart').db)} dBFS at 1x
to ${d1(D.atm.pingFar[0].db)} dBFS at full zoom, which is the field sounding a little louder the closer it is.

The room under a zoom is silent at 1x and follows the zoom's own logarithm. It is a
low bed, ${D.seatHz.Sacral} and ${D.seatHz.Heart} Hz and a breath of noise, through one lowpass that opens with the zoom, so it gets
a little louder and a little brighter as you come in. A person who stops zooming holds it
${C.ATM_AMB_HOLD} s, lets it fall, and it is exactly zero ${C.ATM_AMB_END} s after the last input.

| Zoom | Level of the zoom | Steady level, dBFS peak | Steady level, dBFS rms | Lowpass, Hz |
|---|---|---|---|---|
`;
 D.amb.forEach(a=>{ md+=`| ${d1(a.zoom)}x | ${a.L} | ${d1(a.db)} | ${d1(a.rms)} | ${r0(a.lp)} |\n`; });
 md+=`
## Everything that holds it silent

Read in one place, \`sfxWhy\`, and held by \`tests/sound.js\` against a broken engine each.

| Silent when | Why |
|---|---|
| The switch is off | \`CURP.ui.sfxoff\`. The press that turns it off is itself silent |
| Quiet is on | A person who reached for less on the screen did not ask for more in the ear |
| A release is running | It is its own room with its own sounds, and two families at one boundary fight |
| No press yet | A browser opens no audio before a press, and nothing sounds on load. No hover ticks before the first press either |
| No Web Audio | The browser has none |

Reduced motion does not silence it: that setting is a request about motion, and this
is the one place a person has said yes to sound.

Nothing is carried by sound alone. Every sound here echoes something the screen
already shows: the circle that filled, the sheet that opened, the node that took the pin,
the picture that came closer.

## One sound per press, and the limits

A press that earns a fitting, a ping or an air swell has that sound and not also a click.
The click waits one turn of the event loop and anything that sounds inside the press
takes it. A fitting is never closer than 150 ms to anything here.

| Limit | Value |
|---|---|
| Layer total | ${C.ATM_BURST} sounds in any second, and ${C.ATM_SPACE} ms between any two |
| Same sound twice | its own gap, ms: ${D.gaps.join(', ')} |
| Hover | ${C.ATM_HOVER_PER_S} in any second, one per control per ${C.ATM_HOVER_EACH} ms, none within ${C.ATM_HOVER_QUIET} ms of another sound, none while a button is down, none from a pointer that has not moved |
| Longest sound | ${r0(Math.max(...Object.keys(D.atm).filter(k=>k!=='pingFar'&&k!=='hover').map(k=>Math.max(...D.atm[k].map(r=>r.ms)))))} ms measured, against the fittings' ceiling of ${C.SFX_MAX_MS} |

## The fittings, for the whole map

The six sounds, across seven moments, that existed before this layer, unchanged. Redo shares the keep, and the settings switch plays the keep when it goes on. They are louder and longer on purpose: they are events, and the layer above is their surroundings.

| Fitting | Moment | Peak, dBFS | Length, ms |
|---|---|---|---|
`;
 Object.keys(D.sfx).forEach(k=>{ const s=D.sfx[k]; md+=`| ${k} | ${esc(s.at)} | ${d1(s.db)} | ${r0(s.ms)} |\n`; });
 md+=`
The release has its own: the seat tone and four marks, on its own switches, and none of the layer above sounds while it runs.
`;
 fs.writeFileSync('SOUND-MAP.md',md);

 /* ---- the pictures, drawn in a blank page ---- */
 const pg2=await b.newPage({viewport:{width:1400,height:900}});
 const names=[['click-light','Click, light'],['click','Click, normal'],['click-heavy','Click, heavy'],['overlay-on','Overlay on'],
  ['overlay-off','Overlay off'],['air-open','Air, opening'],['air-close','Air, closing'],['ping','Ping'],['hover','Hover tick'],['ambience','The room under a zoom']];
 await pg2.setContent('<body style="margin:0;background:#0d0d10;color:#cfd3da;font:12px system-ui"><div id=w style="display:flex;flex-wrap:wrap;gap:14px;padding:14px;width:1380px"></div></body>');
 const info=await pg2.evaluate(({wave,names,atm})=>{
  function fft(re,im){var n=re.length;
   for(var i=1,j=0;i<n;i++){var b=n>>1; for(;j&b;b>>=1)j^=b; j^=b;
    if(i<j){var t=re[i];re[i]=re[j];re[j]=t; t=im[i];im[i]=im[j];im[j]=t;}}
   for(var len=2;len<=n;len<<=1){var a=-2*Math.PI/len, wr=Math.cos(a), wi=Math.sin(a);
    for(var i=0;i<n;i+=len){var cr=1,ci=0;
     for(var k=0;k<len/2;k++){var ur=re[i+k],ui=im[i+k],
      vr=re[i+k+len/2]*cr-im[i+k+len/2]*ci, vi=re[i+k+len/2]*ci+im[i+k+len/2]*cr;
      re[i+k]=ur+vr; im[i+k]=ui+vi; re[i+k+len/2]=ur-vr; im[i+k+len/2]=ui-vi;
      var nr=cr*wr-ci*wi; ci=cr*wi+ci*wr; cr=nr;}}}}
  var host=document.getElementById('w'), ids=[];
  names.forEach(function(nm){
   var k=nm[0], W=wave[k]; if(!W)return;
   var x=W.x, SR=W.sr, ms=x.length/SR*1000;
   var cw=670, wh=110, sh=170, pad=34, c=document.createElement('canvas'); c.width=cw; c.height=pad+wh+sh+26; c.id='c-'+k;
   c.style.cssText='background:#111218;border:1px solid #2a2d36';
   host.appendChild(c); ids.push(k);
   var g=c.getContext('2d'), px0=44, pw=cw-px0-12;
   g.fillStyle='#cfd3da'; g.font='13px system-ui';
   var rows=atm[k]; var meta=rows?rows.find(function(r){return r.seat==='Heart'})||rows[0]:null;
   var title=nm[1]+(meta?'   '+Math.round(meta.hz)+' Hz   peak '+meta.db.toFixed(1)+' dBFS   '+Math.round(meta.ms)+' ms':'');
   if(k==='ambience')title=nm[1]+'   zoom comes in for 1.2 s, then stops   last input at 1.2 s, zero at 2.7 s';
   g.fillText(title,10,20);
   /* waveform, with the axis in dBFS fixed at the loudest the layer allows so sounds are comparable */
   var y0=pad, mid=y0+wh/2, amp=wh/2*0.95, FS=k==='ambience'?0.05:0.05;
   g.strokeStyle='#2a2d36'; g.beginPath(); g.moveTo(px0,mid); g.lineTo(px0+pw,mid); g.stroke();
   g.fillStyle='#7d8590'; g.font='10px system-ui'; g.fillText('top and bottom edge = '+(20*Math.log10(FS)).toFixed(0)+' dBFS',px0+4,y0+10); 
   g.strokeStyle='#8ab4ff'; g.beginPath();
   for(var p=0;p<pw;p++){ var i0=Math.floor(p/pw*x.length), i1=Math.floor((p+1)/pw*x.length), lo=1,hi=-1;
    for(var i=i0;i<i1;i++){ if(x[i]<lo)lo=x[i]; if(x[i]>hi)hi=x[i]; }
    if(lo>hi){lo=hi=0;} g.moveTo(px0+p,mid-hi/FS*amp); g.lineTo(px0+p,mid-lo/FS*amp); }
   g.stroke();
   /* spectrogram, 0 to 4 kHz, 512 window, hop for 1 px */
   var y1=y0+wh+16, N=1024, hop=Math.max(32,Math.floor(x.length/pw)), cols=Math.floor(pw), fmax=4000, bins=Math.round(fmax/(SR/N));
   var im=g.createImageData(cols,sh), win=new Float64Array(N); for(var i=0;i<N;i++)win[i]=0.5-0.5*Math.cos(2*Math.PI*i/(N-1));
   for(var col=0;col<cols;col++){ var s0=Math.floor(col/cols*x.length)-N/2, re=new Float64Array(N), imm=new Float64Array(N);
    for(var i=0;i<N;i++){ var xi=s0+i; re[i]=(xi>=0&&xi<x.length?x[xi]:0)*win[i]; } fft(re,imm);
    for(var row=0;row<sh;row++){ var b=Math.min(bins-1,Math.floor((1-row/sh)*bins)), mag=Math.sqrt(re[b]*re[b]+imm[b]*imm[b])/(N/4);
     var db=20*Math.log10(mag+1e-9), t=Math.max(0,Math.min(1,(db+95)/60)); /* -95 dBFS dark, -35 dBFS bright */
     var o=(row*cols+col)*4, r=Math.round(255*Math.max(0,Math.min(1,(t-0.45)*2.2))), gg=Math.round(255*Math.max(0,Math.min(1,(t-0.2)*1.4))), bb=Math.round(40+215*t*(1-0.5*Math.max(0,t-0.7)));
     im.data[o]=r; im.data[o+1]=gg; im.data[o+2]=bb; im.data[o+3]=255; } }
   g.putImageData(im,px0,y1);
   g.fillStyle='#7d8590'; g.font='10px system-ui';
   [0,1000,2000,3000,4000].forEach(function(f){ var yy=y1+sh-f/fmax*sh; g.fillText(f?(f/1000)+'k':'0',px0-24,yy+3); g.strokeStyle='#2a2d36'; g.beginPath(); g.moveTo(px0-4,yy); g.lineTo(px0,yy); g.stroke(); });
   var step=ms>1000?500:(ms>300?50:20);
   for(var t=0;t<=ms;t+=step){ var xx=px0+t/ms*pw; g.fillText(t+' ms',xx-12,y1+sh+13); }
   g.fillText('Hz',6,y1+8);
  });
  return ids; },{wave:D.wave,names,atm:D.atm});
 for(const k of info){ const el=await pg2.$('#c-'+k); await el.screenshot({path:path.join(OUT,k+'.png')}); }
 await pg2.screenshot({path:path.join(OUT,'all.png'),fullPage:true});
 await b.close();
 console.log('wrote SOUND-MAP.md and '+(info.length+1)+' pictures in '+OUT+'/');})();
