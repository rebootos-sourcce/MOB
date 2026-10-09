/* THE SOUND MAP, GENERATED. node tools/soundmap.js [--wav DIR]
   Run from the repo root with NODE_PATH at a playwright install. Build first:
   the page it reads is source.html.

   Nobody can listen in a headless browser, so this renders every interface
   sound offline through the product's own code, sfxRender for the fittings
   and the atmosphere's rows and atmAmbBuild for the room under a zoom, the
   same render tests/sound.js measures, reads the numbers off the samples and
   writes:

     SOUND-MAP.md   one line per event: what happens, the sound it makes, what
                    that sound measures, and the rule it plays under. Every
                    figure is read off a render and none is typed, because a
                    number typed into a document is the defect this repository
                    has been bitten by more times than it has counted.
     DIR/*.wav      with --wav, each atmosphere sound and the Field press at
                    1x and zoomed all the way in, as 16 bit mono at 44.1
                    kilohertz, at the exact level the product plays it and not
                    normalised, so the files are heard against each other the
                    way the product plays them. And one walk through a short
                    session, so a sound can be heard among the others and not
                    only alone. DIR/LISTEN.txt has one line per file.

   Nothing is written into the product. Rerun after any change to ui/sound.js
   and commit SOUND-MAP.md; the wav files are for listening and are not
   committed. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs'), crypto=require('crypto');
const args=process.argv.slice(2), wi=args.indexOf('--wav'), WAV=wi>=0?args[wi+1]:null;
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const SR=44100;
const booted=async p=>{
 try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}); }catch(e){}
 try{ await p.waitForTimeout(600);
  await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); }); }catch(e){}};
/* float samples to a 16 bit PCM wav, mono */
function wav(x){
 const n=x.length, b=Buffer.alloc(44+n*2);
 b.write('RIFF',0); b.writeUInt32LE(36+n*2,4); b.write('WAVE',8); b.write('fmt ',12);
 b.writeUInt32LE(16,16); b.writeUInt16LE(1,20); b.writeUInt16LE(1,22); b.writeUInt32LE(SR,24);
 b.writeUInt32LE(SR*2,28); b.writeUInt16LE(2,32); b.writeUInt16LE(16,34); b.write('data',36); b.writeUInt32LE(n*2,40);
 for(let i=0;i<n;i++){ const v=Math.max(-1,Math.min(1,x[i])); b.writeInt16LE(Math.round(v*32767),44+i*2); }
 return b;}
(async()=>{
 const br=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const pg=await br.newPage({viewport:{width:1600,height:1000}});
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);
 const D=await pg.evaluate(async({SR,wantWav})=>{
  if(typeof ATM==='undefined')return {none:true};
  function fft(re,im){var n=re.length;
   for(var i=1,j=0;i<n;i++){var b=n>>1; for(;j&b;b>>=1)j^=b; j^=b;
    if(i<j){var t=re[i];re[i]=re[j];re[j]=t; t=im[i];im[i]=im[j];im[j]=t;}}
   for(var len=2;len<=n;len<<=1){var a=-2*Math.PI/len, wr=Math.cos(a), wi=Math.sin(a);
    for(var i=0;i<n;i+=len){var cr=1,ci=0;
     for(var k=0;k<len/2;k++){var ur=re[i+k],ui=im[i+k],
      vr=re[i+k+len/2]*cr-im[i+k+len/2]*ci, vi=re[i+k+len/2]*ci+im[i+k+len/2]*cr;
      re[i+k]=ur+vr; im[i+k]=ui+vi; re[i+k+len/2]=ur-vr; im[i+k+len/2]=ui-vi;
      var nr=cr*wr-ci*wi; ci=cr*wi+ci*wr; cr=nr;}}}}
  /* the gate's own meter: peak, length to the last sample over -66 dBFS, rms
     over that length, the centroid */
  function meter(x,t0){
   var pk=0,last=-1,i0=Math.round(t0*SR);
   for(var i=0;i<x.length;i++){var a=Math.abs(x[i]); if(a>pk)pk=a; if(a>0.0005)last=i;}
   var s=0,n=Math.max(1,last-i0); for(var i=i0;i<last;i++)s+=x[i]*x[i];
   var N=1; while(N<x.length)N<<=1;
   var re=new Float64Array(N), im=new Float64Array(N); re.set(x); fft(re,im);
   var tot=0,cen=0; for(var k=1;k<N/2;k++){var e=re[k]*re[k]+im[k]*im[k], f=k*SR/N; tot+=e; cen+=e*f;}
   return {db:20*Math.log10(pk||1e-9), ms:(last-i0)/SR*1000, rms:20*Math.log10(Math.sqrt(s/n)||1e-9), cen:cen/(tot||1)};}
  async function render(sec,fn){
   var ac=new OfflineAudioContext(1,Math.round(sec*SR),SR); fn(ac);
   return (await ac.startRendering()).getChannelData(0);}
  var seats=BANDS.slice(), out={atm:{}, sfx:{}, wav:{}, map:[], layers:[], c:{}};
  /* every atmosphere row at every pitch it can sound at */
  for(var i=0;i<ATM.length;i++){ var x=ATM[i], noise=x.parts.every(function(p){return p.w==='noise';});
   var ss=x.seat?[x.seat]:(noise?[null]:seats), res=[];
   for(var j=0;j<ss.length;j++){ var row=atmRow(x.k,{seat:ss[j]});
    var buf=await render((x.max+300)/1000,function(ac){sfxRender(ac,ac.destination,row,0.01);});
    var m=meter(buf,0.01); res.push({seat:ss[j],hz:noise?0:row.hz,db:m.db,rms:m.rms,ms:m.ms,cen:m.cen,tgt:row.db});
    if(wantWav&&(ss.length===1||ss[j]==='Heart'))out.wav[x.k]=Array.prototype.slice.call(buf);}
   out.atm[x.k]={rows:res, gap:x.gap, max:x.max, seat:x.seat, noise:noise};}
  /* the fittings, at their table level, and a row with a lift at its top too */
  for(var f=0;f<SFX.length;f++){ var s=SFX[f];
   var fb=await render((s.max+300)/1000,function(ac){sfxRender(ac,ac.destination,s,0.01);});
   var fm=meter(fb,0.01), e={k:s.k,at:s.at,db:fm.db,rms:fm.rms,ms:fm.ms,cen:fm.cen,gap:s.gap,ceil:s.ceil,max:s.max,lift:s.lift||0,earn:!!s.earn,buzz:!!s.buzz};
   if(s.lift){ var lb=await render((s.max+300)/1000,function(ac){sfxRender(ac,ac.destination,s,0.01,Math.pow(10,s.lift/20));});
    var lm=meter(lb,0.01); e.top={db:lm.db,rms:lm.rms};
    if(wantWav){ out.wav[s.k+'-1x']=Array.prototype.slice.call(fb); out.wav[s.k+'-full-zoom']=Array.prototype.slice.call(lb); }}
   out.sfx[s.k]=e;}
  /* the room under a zoom: steady at four levels, and a zoom heard whole */
  out.amb=[];
  for(var L of [0.25,0.5,0.75,1]){
   var sx=await render(3,function(ac){var h=atmAmbBuild(ac,ac.destination); for(var t=0;t<2;t+=0.1)atmAmbTo(h,L,t);});
   var seg=sx.slice(Math.round(1.5*SR),Math.round(2*SR)), mm=meter(seg,0), pk=0;
   for(var q=0;q<seg.length;q++)pk=Math.max(pk,Math.abs(seg[q]));
   out.amb.push({L:L, db:20*Math.log10(pk), rms:mm.rms, cen:mm.cen, lp:atmAmbTarget(L).lp, zoom:Math.exp(L*Math.log(WHEEL_ZOOM_MAX))}); }
  if(wantWav){ var zx=await render(3.6,function(ac){var h=atmAmbBuild(ac,ac.destination);
    for(var t=0.1;t<1.4;t+=0.05)atmAmbTo(h,Math.min(1,(t-0.1)/1.2),t);});
   out.wav.room=Array.prototype.slice.call(zx);
   /* A WALK. Eleven seconds of a person using the product, every sound at the
      time it would land and at the level it plays: a tick as the mouse reaches
      a button, its click, an overlay on and later off, a chip, a panel opening
      and shutting, a primary press, a zoom in with the room under it and two
      Field presses as it comes closer, then back out. */
   var walk=await render(11,function(ac){
    var A=function(k,t,o){ sfxRender(ac,ac.destination,atmRow(k,o),t); };
    var F=function(t,L){ sfxRender(ac,ac.destination,SFX_BY.field,t,Math.pow(10,(SFX_BY.field.lift||0)*L/20)); };
    A('hover',0.30); A('click',0.75);
    A('hover',1.40); A('overlay-on',1.80,{seat:'Root'});
    A('hover',2.50); A('click-light',2.85);
    A('air-open',3.50); A('air-close',4.60);
    A('hover',5.10); A('click-heavy',5.45);
    F(6.0,0);
    var h=atmAmbBuild(ac,ac.destination);
    for(var t=6.5;t<8.0;t+=0.08)atmAmbTo(h,Math.min(1,(t-6.5)/1.3),t);
    F(7.4,0.7); F(7.95,1);
    A('overlay-off',9.2,{seat:'Root'}); A('hover',9.9); A('click',10.25);});
   out.wav.walk=Array.prototype.slice.call(walk);}
  out.map=ATM_MAP.map(function(m){ return {kind:m.kind,sel:m.sel||null,hook:m.hook||null,snd:m.snd,hover:!!m.hover,fitting:!!m.fitting}; });
  FB_LAYERS.forEach(function(l){ out.layers.push({surf:'Field',nm:l.nm,seat:ATM_SEAT.fb[l.k]}); });
  Object.keys(BMOVL).forEach(function(k){ out.layers.push({surf:'Body',nm:BMOVL[k].nm,seat:ATM_SEAT.bm[k]}); });
  Object.keys(CN_OV).forEach(function(k){ out.layers.push({surf:'Compass',nm:CN_OV[k].nm,seat:ATM_SEAT.cn[k]}); });
  out.layers.forEach(function(l){ l.hz=seatHz(l.seat); });
  out.seatHz={}; seats.forEach(function(s){ out.seatHz[s]=seatHz(s); });
  ['ATM_MASTER','ATM_CEIL_DB','ATM_BURST','ATM_SPACE','ATM_HOVER_PER_S','ATM_HOVER_EACH','ATM_HOVER_QUIET','ATM_AMB_HOLD','ATM_AMB_END',
   'ATM_AMB_LP0','ATM_AMB_LP1','ATM_NOSEAT','SFX_CEIL','SFX_MAX_MS','SFX_BURST','WHEEL_ZOOM_MAX','FZ_MAX'].forEach(function(k){ try{ out.c[k]=eval(k); }catch(e){} });
  out.db=ATM_DB;
  return out;},{SR,wantWav:!!WAV});
 if(D.none){ console.log('this build has no atmosphere layer, so there is nothing to map'); await br.close(); process.exit(1); }
 await br.close();

 const d1=x=>(Math.round(x*10)/10).toFixed(1), r0=x=>String(Math.round(x));
 const esc=s=>String(s).replace(/\|/g,'\\|');
 const C=D.c, A=D.atm, F=D.sfx;
 /* one cell of measurement, read off the renders: peak, rms, length, centroid */
 const meas=rows=>{ const pk=rows.map(r=>r.db), rm=rows.map(r=>r.rms), ms=rows.map(r=>r.ms), ce=rows.map(r=>r.cen);
  const span=(v,f)=>{ const lo=Math.min(...v), hi=Math.max(...v); return (hi-lo<0.4)?f(lo):f(lo)+' to '+f(hi); };
  return 'peak '+span(pk,d1)+', rms '+span(rm,d1)+' dBFS, '+r0(Math.max(...ms))+' ms, centroid '+span(ce,r0)+' Hz';};
 const pitch=k=>{ const a=A[k]; if(a.noise)return 'band noise';
  const hz=a.rows.map(r=>r.hz); const lo=Math.min(...hz), hi=Math.max(...hz);
  return lo===hi?r0(lo)+' Hz, '+a.rows[0].seat:'the layer\'s seat, '+r0(lo)+' to '+r0(hi)+' Hz';};
 const atmLine=(event,k,rule)=>`| ${esc(event)} | ${k}, ${esc(pitch(k))} | ${meas(A[k].rows)} | ${esc(rule)} |\n`;
 const md5=crypto.createHash('md5').update(fs.readFileSync('atuned_src/ui/sound.js')).digest('hex').slice(0,8);
 const quietFit=Object.values(F).reduce((a,b)=>b.db<a.db?b:a);
 const loudAtm=Math.max(...Object.values(A).map(a=>Math.max(...a.rows.map(r=>r.db))));
 let md=`# Sound map

Generated by \`node tools/soundmap.js\` from the \`atuned_src/ui/sound.js\` whose md5
begins \`${md5}\`. Every figure is read off an offline render of the product's own
sound code, the same render \`tests/sound.js\` measures, and none is typed, so run it
again after any change and commit the result. dBFS is decibels under the loudest a
speaker can play, so a bigger negative number is quieter. rms is the average level
over the sound's length, which is closer to how loud it feels than the peak is.

**The rulings.** Round OU, 1 October, his words: "I want everything to have a very
subtle atmospheric sound. Overlays, clicks, if I click on the field, if I zoom in,
this field sounds a little bit louder. You know, very subtle sci-fi. Sounds nothing
overwhelming." Round OV: "Yeah, hover should make sound." Round OJ: "Yes, sound on
by default. With the sound on off in the profile."

**One switch.** Sound effects, in the profile menu and in Settings, Display. On
until a person turns it off. Quiet turns everything here off too.

**Two families.** The fittings are the events: a keep, a refusal, a practice done.
The atmosphere is their surroundings, quieter and shorter, under nearly every
press. The loudest atmosphere sound peaks at ${d1(loudAtm)} dBFS, under the quietest
fitting, ${quietFit.k} at ${d1(quietFit.db)}. Nothing is carried by sound alone: every
sound echoes something the screen already shows.

## Every event, one line each

### The atmosphere

| Event | Sound | Measured | Rule |
|---|---|---|---|
`;
 md+=atmLine('Press on a button, a link, a menu item, a tab, a switch, a checkbox or a radio','click',
  'one sound per press; a press that earns a fitting or opens a panel gives up its click; '+A.click.gap+' ms before the same again');
 md+=atmLine('Press on a chip, a pill, a pressed toggle, a list row or a section header','click-light','the lightest weight: shortest and highest; '+A['click-light'].gap+' ms gap');
 md+=atmLine('Press on a primary, destructive or upgrade button','click-heavy','the heaviest weight: longest and lowest, for what cannot be taken back; '+A['click-heavy'].gap+' ms gap');
 md+=atmLine('An overlay goes on: a Field, Body or Compass circle, or a Compass seat shell','overlay-on','rises two semitones into the layer\'s seat; up is arriving; one layer keeps one pitch on every surface');
 md+=atmLine('An overlay goes off','overlay-off','falls two semitones away from the same pitch; down is leaving');
 md+=atmLine('A panel or a column opens: the sheet, the left and right columns, the bar\'s fold, a menu','air-open','band noise leaning up, slow in; the click is given up for it');
 md+=atmLine('A panel or a column shuts','air-close','band noise leaning down, quick in, softer; shutting what is already shut is silent');
 md+=atmLine('A mouse or a pen arrives on a control','hover','the quietest sound here; mouse and pen only, never a finger; '+C.ATM_HOVER_PER_S+' a second at most, once per control per '+C.ATM_HOVER_EACH+' ms, none within '+C.ATM_HOVER_QUIET+' ms of another sound, none while dragging, none when the layout moves a control under a resting pointer');
 const amb=D.amb, full=amb[amb.length-1];
 md+=`| A zoom on the Field: the wheel, Frames or Dial, by wheel, keys, buttons or pinch | the room: ${r0(D.seatHz.Sacral)} and ${r0(D.seatHz.Heart)} Hz with a breath of noise, lowpass ${C.ATM_AMB_LP0} to ${C.ATM_AMB_LP1} Hz | silent at 1x; at full zoom peak ${d1(full.db)}, rms ${d1(full.rms)} dBFS, centroid ${r0(full.cen)} Hz | louder and brighter as the picture comes closer; held ${C.ATM_AMB_HOLD} s after the last zoom input, then falls, and exactly zero ${C.ATM_AMB_END} s after it; never a bed under a person reading |\n`;
 const fd=F.field;
 md+=`| A press on the Field: any mark on the wheel, Frames or Dial, an address by mouse, the core by finger | field, the fitting below | at 1x peak ${d1(fd.db)}, rms ${d1(fd.rms)} dBFS; all the way in peak ${d1(fd.top.db)}, rms ${d1(fd.top.rms)} dBFS; ${r0(fd.ms)} ms | comes up ${fd.lift} dB across the zoom on its logarithm, so every notch is the same step; ${fd.gap} ms gap |\n`;
 md+=`
### The fittings

| Event | Sound | Measured | Rule |
|---|---|---|---|
`;
 const fitRule={kept:'replaced by mark when the press earns a mark for the first time',undo:'kept with its envelope reversed, a latch drawn back',
  refuse:'played inside status for every refusal, so no call site can miss one',mark:'the one fitting that rises; replaces kept or done for that press',
  done:'the heaviest thing a person does outside a release',time:'the one sound with no press in front of it; a person timing a practice may have their eyes shut',
  tap:'the bar\'s own tabs; takes the atmosphere\'s click for that press',field:'the Field press, with its lift above',begin:'one of the two sounds that play inside a release, once per run',
  spark:'a wire touched: ticks only, no body; once on arrival on a line, never again while it rests there'};
 Object.values(F).forEach(f=>{
  md+=`| ${esc(f.at.charAt(0).toUpperCase()+f.at.slice(1))} | ${f.k} | peak ${d1(f.db)}, rms ${d1(f.rms)} dBFS, ${r0(f.ms)} ms, centroid ${r0(f.cen)} Hz | ${esc(fitRule[f.k]||'')}${fitRule[f.k]?'; ':''}${f.gap} ms gap, peak cap ${f.ceil} of full scale${f.buzz?', vibrates with the vibration switch on':''} |\n`;});
 md+=`| A release running | the seat tone and the release's four marks, on the release's own switches | not measured here; the release's own checks hold them | every sound above is held silent inside a run, the first release too, which is read by the app's voice; begin and done are the two boundaries let through |
`;
 md+=`
## Every silence, one line each

| Silent when | Rule |
|---|---|
| The switch is off | One switch for both families. The press that turns it off is itself silent |
| Quiet is on | A person who reached for less on the screen did not ask for more in the ear |
| A release is running | It is its own room with its own sounds, and two families at one boundary fight |
| No press yet | A browser opens no audio before a press, and nothing sounds on load. No hover ticks before the first press either |
| A script made the click | A press is a press a person made, so a click the product or a test dispatches sounds nothing |
| A finger arrives on a control | A finger has no hover. Its tap still gets its click |
| The browser has no Web Audio | There is no switch to offer, so none is |

Reduced motion does not silence any of it: that setting is a request about motion,
and the switch is the one place a person has said yes to sound.

## The limits

| Limit | Value |
|---|---|
| Atmosphere, all sounds | ${C.ATM_BURST} in any second, ${C.ATM_SPACE} ms apart at least, and nothing within 150 ms of a fitting |
| Fittings, all sounds | ${C.SFX_BURST} in any second |
| Same sound twice | its own gap, in the Rule column above |
| Longest interface sound | ${C.SFX_MAX_MS} ms for a fitting; the longest atmosphere sound rang ${r0(Math.max(...Object.values(A).map(a=>Math.max(...a.rows.map(r=>r.ms)))))} ms |
| Loudest atmosphere sound | ${C.ATM_CEIL_DB} dBFS at most, and under the quietest fitting |

## Overlay pitches, by layer

| Surface | Layer | Seat | Pitch, Hz |
|---|---|---|---|
`;
 D.layers.forEach(l=>{ md+=`| ${l.surf} | ${esc(l.nm)} | ${esc(l.seat)} | ${r0(l.hz)} |\n`; });
 md+=`| Compass | each of the seven seat shells | the seat it is | ${Object.values(D.seatHz).map(r0).join(', ')} |

## The room under a zoom, by how far in

| Zoom on the wheel | Level of the zoom | Peak, dBFS | rms, dBFS | Centroid, Hz | Lowpass, Hz |
|---|---|---|---|---|---|
`;
 D.amb.forEach(a=>{ md+=`| ${d1(a.zoom)}x | ${a.L} | ${d1(a.db)} | ${d1(a.rms)} | ${r0(a.cen)} | ${r0(a.lp)} |\n`; });
 md+=`
## What to turn to change it

| To change | Edit, in \`ui/sound.js\` |
|---|---|
| The whole atmosphere louder or quieter | \`ATM_MASTER\`, now ${C.ATM_MASTER}. 0.5 is 6 dB down, 2 is 6 dB up |
| One atmosphere sound | its entry in \`ATM_DB\`, in dBFS, under \`ATM_CEIL_DB\` |
| Which control makes which sound | its row in \`ATM_MAP\` |
| Which seat a layer's circle rings | \`ATM_SEAT\` |
| What a seat's pitch is | \`FLOWSEAT\` in \`engine/data/practice.js\`, which the release reads too |
| How much louder the Field press gets zoomed in | \`lift\` on the \`field\` row of \`SFX\` |
| How long the room lasts after a zoom | \`ATM_AMB_HOLD\` and \`ATM_AMB_END\` |

## Left out on purpose, and each is his to reopen

| Not sounded | Why |
|---|---|
| Typing | It would sound every key |
| A slider | It would sound the whole length of a drag |
| A tip appearing | It is a hover already, and the hover ticks |
| A vibration under the atmosphere | On a phone it would buzz every tap. The fittings keep the vibration they had |
| The Body's zoom | Not asked for. The Body's tension lines spark when zoomed in close, which is a fitting |
`;
 fs.writeFileSync('SOUND-MAP.md',md);
 console.log('wrote SOUND-MAP.md');
 if(WAV){
  fs.mkdirSync(WAV,{recursive:true});
  const desc={
   'click-light':'The light click: a chip, a pill, a pressed toggle, a list row or a section header. Brow pitch, 852 Hz, the shortest.',
   'click':'The normal click: a button, a link, a menu item, a tab inside a page, a switch. Heart pitch, 639 Hz.',
   'click-heavy':'The heavy click: a primary, destructive or upgrade button. Sacral pitch, 417 Hz, the longest and lowest of the three.',
   'overlay-on':'An overlay going on, heard at the Heart, 639 Hz. Each layer rises into its own seat\'s pitch.',
   'overlay-off':'The same overlay going off, falling away from the same pitch.',
   'air-open':'A panel or a column opening: a breath of air leaning up.',
   'air-close':'A panel or a column shutting: a quicker, softer breath leaning down.',
   'hover':'The tick when a mouse reaches a button. The faintest sound in the product, 26 ms.',
   'field-1x':'A press on the Field at its normal size. This sound is already on main; it is here to compare with the next file.',
   'field-full-zoom':'The same Field press zoomed all the way in, 3 dB louder.',
   'room':'The low hum under the Field as you zoom in for a second and a quarter and stop. It is gone a second and a half after the zoom stops.',
   'walk':'Eleven seconds of use, every sound where it would land: hovers and clicks, an overlay on and off, a panel open and shut, a heavy press, a zoom with the hum, two Field presses coming closer.'};
  const order=['hover','click-light','click','click-heavy','overlay-on','overlay-off','air-open','air-close','field-1x','field-full-zoom','room','walk'];
  const lines=[];
  order.forEach((k,i)=>{ const x=D.wav[k]; if(!x)return;
   const pad=new Float32Array(Math.round(0.05*SR)), all=Float32Array.from([...pad,...x,...pad]);
   const nm=String(i+1).padStart(2,'0')+'-'+k+'.wav';
   fs.writeFileSync(path.join(WAV,nm),wav(all));
   lines.push(nm+'  '+desc[k]); });
  fs.writeFileSync(path.join(WAV,'LISTEN.txt'),'Atuned interface sounds, rendered offline by the product\'s own sound code at the level the product plays them.\n'
   +'Not normalised, so they are as loud against each other as they are in the app. Set the volume where you work and play them in order.\n\n'+lines.join('\n')+'\n');
  console.log('wrote '+lines.length+' wav files and LISTEN.txt in '+WAV);}
})();
