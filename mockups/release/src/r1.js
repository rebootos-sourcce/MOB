/* ============================================================
   1. ONE STREAM. The whole session is one column of lines on one axis.
   What the voice says to set up, the beginning resonance, every "I am"
   line, the cooldown and the congratulations all arrive in the same
   focus slot, in the order they are said, so there is nothing to jump
   to: the list is already the next thing.
   The prompt waits above it, dim, and lands at full ink on the
   resonance. The count is lines left, under the list, in step with the
   voice: it changes once a line and never ticks.
   ============================================================ */
const V=(()=>{
 const S=SCRIPT.length;
 let tot=0;
 /* one index across the whole session: script, then the list, then the cooldown, then the end */
 function item(g){
  tot=TOTAL();
  if(g<0)return null;
  if(g<S)return {text:SCRIPT[g],cls:'say'};
  if(g<S+tot){const l=lineAt(g-S);return {text:l.text,col:l.col,cls:'ln'};}
  const c=g-S-tot; if(c<W.cool.length)return {text:W.cool[c],cls:'say'};
  /* the congratulations is not shown coming: it arrives when the two minutes end */
  if(c===W.cool.length&&ST.ph==='done')return {text:W.congrats,cls:'end'};
  return null;}
 function focusOf(m){
  if(m.ph==='before')return 0;
  if(m.ph==='script')return m.script.i;
  if(m.ph==='run')return S+m.run.i;
  if(m.ph==='cool')return S+m.run.N+m.cool.said-1;
  return S+m.run.N+W.cool.length;}
 let lastKey='';
 function mount(rs){
  rs.innerHTML=UI.x()+'<div class="r1"><p class="prompt r1p" id="r1p"></p><div class="car r1c" id="r1c" aria-live="polite"></div>'
   +'<div class="r1m" id="r1m"></div><div class="r1t" id="r1t"></div></div>'+UI.crx()+'<div class="r1v" id="r1v"></div>';}
 function figs(m){const d=m.done;
  return '<div class="r1f">'+['released','bank','vault'].map(k=>'<div class="fg"><span class="fl">'+W.fig[k]+'</span><b class="num">'+N(d[k])+'</b><span class="fu">'+W.figU[k]+'</span><span class="fm">'+W.figM[k]+'</span></div>').join('')+'</div>';}
 function paint(m){
  const rs=$('#rs');rs.dataset.ph=m.ph;rs.classList.toggle('paused',m.paused);
  $('.x',rs).hidden=!(m.ph==='before'||m.ph==='done');
  /* the prompt: dim while it waits, full once the resonance is said */
  const p=$('#r1p'), live=m.ph==='run'||(m.ph==='script'&&m.script.i>=S-1);
  p.textContent=m.ph==='run'?m.run.prompt:W.prompt.release;
  p.classList.toggle('wait',!live);p.classList.toggle('off',m.ph==='cool'||m.ph==='done');
  /* the dose changes what the list holds, so the rows are rebuilt when it does */
  const key=m.dose+'';if(key!==lastKey){carReset($('#r1c'));lastKey=key;}
  carSync($('#r1c'),item,focusOf(m),3);
  /* under the list: where the line is in the body, and what is left */
  let meta='';
  if(m.ph==='run'){const a=m.run.addr;
   meta='<span class="ad">'+seatMk(a)+'<b>'+esc(a.k)+'</b><span>'+esc(W.place(a))+'</span></span>'
    +'<span class="ct num">'+(m.paused?esc(W.pausedSay):W.left(m.run.left))+'</span>';}
  else if(m.ph==='script')meta=UI.vm(m.voice&&!m.paused,'');
  else if(m.ph==='cool')meta='<span class="cd"><span class="cl">'+W.coolNm+'</span><b class="num">'+mmss(m.cool.left)+'</b></span>';
  else if(m.ph==='done')meta='<span class="dn">'+esc(m.done.halted?W.ended(m.done.released,m.done.places):W.did(m.done.released,m.done.places))+'</span>';
  $('#r1m').innerHTML=meta;
  /* the tray: the setup before, the one control while it runs, the numbers at the end */
  let t='';
  if(m.ph==='before')t='<div class="r1s"><div class="row">'+UI.from(m)+'<span class="lb"><span class="ll">'+W.dose+'</span>'+UI.dose(m)+'</span>'+UI.voice(m)+UI.tone(m)+'</div>'
   +'<div class="row r1e"><span class="pl">'+ADDR.map(a=>'<span class="ad">'+seatMk(a)+'<span>'+esc(W.place(a))+'</span></span>').join('')+'</span></div>'
   +'<p class="r1x num">'+esc(W.est(m.dose,m.est.lines,m.est.min))+'</p>'
   +'<div class="row">'+UI.begin()+'</div></div>';
  else if(m.ph==='script'||m.ph==='run')t='<div class="row">'+UI.pause(m)+'</div>';
  else if(m.ph==='cool')t='<div class="row"><button type="button" class="lk" data-act="finish">'+W.finish+'</button></div>';
  else t=figs(m)+'<p class="r1x">'+esc(W.pattern)+' '+(m.done.canRun?esc(W.month(m.done.left)):'')+'</p>'
   +(m.done.canRun?'':'<p class="r1sp">'+esc(W.spent)+'</p>')
   +'<div class="row">'+UI.after(m)+(m.done.canRun?'':'<span class="shut">'+MK.clock+'<span>'+W.spentSlot+'</span></span>')+'</div>'
   +(m.done.canRun?'':'<div class="row"><button type="button" class="lk" data-act="tiers">'+W.tiers+'</button></div>');
  $('#r1t').innerHTML=t;
  $('#r1v').innerHTML=(m.ph==='run'||m.ph==='cool')&&m.voice?UI.vm(!m.paused,W.voice):'';}
 return {mount,paint};})();
