/* ============================================================
   3. THE DIAL. One object for the whole session, an instrument face.
   The ring is cut into twelve marks, one per pattern this run opens:
   three places, each with four tracks (left release, right release,
   left reframe, right reframe). A mark fills in its place's seat
   colour as its lines are said, so the ring is the countdown, read as
   a share and never as a number that ticks. The lines left sit small
   at the foot of the face for anyone who wants the figure.
   The same ring holds the setup, the list, the two minutes (a thin
   inner ring unwinds) and the finish (every mark lit). Nothing on the
   screen is replaced; the face changes what it shows.
   ============================================================ */
const V=(()=>{
 const R=94, GAP_C=2.2, GAP_A=9;
 const segs=[];
 (function(){ /* twelve arcs, clockwise from the top, a wider gap between places */
  const n=ADDR.length*4, total=360-ADDR.length*GAP_A-ADDR.length*3*GAP_C, each=total/n;
  let at=-90+GAP_A/2;
  for(let a=0;a<ADDR.length;a++){for(let c=0;c<4;c++){segs.push({a,c,from:at,to:at+each});at+=each+(c<3?GAP_C:GAP_A);}}})();
 const pt=deg=>{const r=deg*Math.PI/180;return (100+R*Math.cos(r)).toFixed(2)+' '+(100+R*Math.sin(r)).toFixed(2);};
 const arc=s=>'M'+pt(s.from)+'A'+R+' '+R+' 0 0 1 '+pt(s.to);
 function ring(m){
  /* his 18 October ruling: an early end lights only the marks actually
     reached, never the whole ring. i is the same global channel order as
     m.done.released (one mark, one channel, one pattern), so a run ended
     after 5 of 12 shows 5 lit and 7 still grey, on the cooldown and on
     the completion both. */
  const done=i=>{if(m.ph==='done'||m.ph==='cool')return m.done.halted?(i<m.done.released?1:0):1;if(m.ph!=='run')return 0;
   const k=Math.floor(m.run.i/m.dose), f=(m.run.i%m.dose)/m.dose;return i<k?1:i===k?f:0;};
  let s='<svg class="ring" viewBox="0 0 200 200" aria-hidden="true">';
  segs.forEach((g,i)=>{const p=done(i);
   s+='<path class="tr" d="'+arc(g)+'"/>';
   if(p>0)s+='<path class="fl" pathLength="1" stroke-dasharray="'+p.toFixed(4)+' 1" d="'+arc(g)+'" style="stroke:var('+ADDR[g.a].col+')"/>';});
  if(m.ph==='cool'){const f=m.cool.left/TIMING.settle;
   s+='<circle class="ct" cx="100" cy="100" r="84"/><circle class="cp" cx="100" cy="100" r="84" pathLength="1" stroke-dasharray="'+f.toFixed(4)+' 1" transform="rotate(-90 100 100)"/>';}
  return s+'</svg>';}
 function mount(rs){
  rs.innerHTML=UI.x()+'<div class="r3"><p class="prompt r3p" id="r3p"></p><div class="face" id="face"><div class="rg" id="rg"></div>'
   +'<div class="in" id="in"></div><div class="car r3c" id="r3c" aria-live="polite"></div><div class="ft" id="ft"></div></div>'
   +'<div class="r3t" id="r3t"></div></div>';}
 let mode='';
 function paint(m){
  const rs=$('#rs');rs.dataset.ph=m.ph;
  $('.x',rs).hidden=!(m.ph==='before'||m.ph==='done');
  const p=$('#r3p');p.textContent=m.ph==='run'?m.run.prompt:W.prompt.release;
  p.classList.toggle('wait',m.ph==='before'||(m.ph==='script'&&m.script.i<SCRIPT.length-1));
  p.classList.toggle('off',m.ph==='cool'||m.ph==='done');
  $('#rg').innerHTML=ring(m);
  /* inside the face: a list while something is being said, words when nothing is */
  const car=$('#r3c'), want=m.ph==='script'?'script':m.ph==='run'?'run':'none';
  if(want!==mode){carReset(car);mode=want;}
  car.hidden=want==='none';
  if(want==='script')carSync(car,i=>i>=0&&i<SCRIPT.length?{text:SCRIPT[i]}:null,m.script.i,2);
  if(want==='run')carSync(car,i=>{const l=lineAt(i);return l?{text:l.text}:null;},m.run.i,2);
  let inn='';
  if(m.ph==='before')inn='<p class="lede">'+esc(W.releasing)+'</p><p class="sm">'+esc(W.ringMeans)+'</p>';
  else if(m.ph==='cool')inn='<span class="cl">'+W.coolNm+'</span><b class="num clk">'+mmss(m.cool.left)+'</b><p class="cs">'+esc(W.cool[m.cool.said-1])+'</p>';
  else if(m.ph==='done')inn='<p class="cg">'+W.congrats+'</p><p class="sm">'+esc(m.done.halted?W.ended(m.done.released,m.done.places):W.did(m.done.released,m.done.places))+'</p>';
  $('#in').innerHTML=inn;
  $('#ft').innerHTML=m.ph==='run'?'<span class="num">'+(m.paused?esc(W.pausedSay):esc(W.split(m.run.split.left,m.run.split.right)))+'</span>':'';
  /* under the face */
  let t='';
  if(m.ph==='before')t='<div class="row">'+UI.from(m)+'<span class="lb"><span class="ll">'+W.dose+'</span>'+UI.dose(m)+'</span>'+UI.voice(m)+UI.tone(m)+'</div>'
   +'<p class="sm ss num">'+ADDR.map(a=>seatMk(a,12)+'<span>'+esc(a.k)+'</span>').join('')+'<span class="es">'+esc(W.est(m.dose,m.est.lines,m.est.min))+'</span></p><div class="row">'+UI.begin()+'</div>';
  else if(m.ph==='script'||m.ph==='run'){const a=m.run.addr;
   /* his 18 October ask: just the feeling word, no address/body jargon beside it */
   t=(m.ph==='run'?'<p class="ad">'+seatMk(a)+'<b>'+esc(a.k)+'</b></p>':'')+'<div class="row">'+UI.quad(m)+'</div>';}
  else if(m.ph==='cool')t='<div class="row"><button type="button" class="q qi" data-act="crisis" aria-haspopup="dialog" aria-label="'+esc(CRISIS.say.open)+'" title="'+esc(CRISIS.say.open)+'">'+MK.help+'</button>'
   +'<button type="button" class="lk" data-act="finish">'+W.finish+'</button></div>';
  else{const d=m.done;
   t='<div class="r3f">'+['released','bank','vault'].map(k=>'<div class="fg"><b class="num">'+N(d[k])+'</b><span class="fl">'+W.fig[k]+', '+W.figU[k]+'</span><span class="fm">'+W.figM[k]+'</span></div>').join('')+'</div>'
    +(d.canRun?'<p class="sm">'+esc(W.month(d.left))+'</p>':'<p class="sp">'+esc(W.spent)+'</p>')
    +'<div class="row doneacts">'+UI.after(m)+UI.endsession()+'</div>'
    +(d.canRun?'':'<div class="row"><span class="shut">'+MK.clock+'<span>'+W.spentSlot+'</span></span><button type="button" class="lk" data-act="tiers">'+W.tiers+'</button></div>');}
  $('#r3t').innerHTML=t;}
 return {mount,paint};})();
W.ringMeans='Each mark on the ring is one pattern: one place, one side, letting go or putting back.';
