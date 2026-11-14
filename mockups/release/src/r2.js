/* ============================================================
   2. THREE BANDS. A fixed stage in three bands, the paywall's flat
   card family. The top band holds the prompt and never moves. The
   middle band is one well: before Begin it shows the whole script the
   voice will say, so a person reads it before hearing it; while the
   voice speaks the line being said lights in place; then the same well
   carries the list. The bottom band changes what it holds: the setup,
   then Pause, then the cooldown clock, then the numbers.
   The count here is TIME, in whole minutes, because the body's
   question is how long to sit. It changes once a minute and never
   shows seconds while the list runs.
   ============================================================ */
const V=(()=>{
 let mode='';
 function mount(rs){
  rs.innerHTML=UI.x()+'<div class="r2"><header class="r2h"><p class="prompt" id="r2p"></p></header>'
   +'<section class="r2w" id="r2w"></section><footer class="r2b" id="r2b"></footer></div>'+UI.crx();}
 function scriptList(items,cur,cls){
  return '<ol class="r2s '+(cls||'')+'">'+items.map((t,i)=>'<li class="'+(i===cur?'on':i<cur?'past':'')+'">'+esc(t)+'</li>').join('')+'</ol>';}
 function paint(m){
  const rs=$('#rs');rs.dataset.ph=m.ph;
  $('.x',rs).hidden=!(m.ph==='before'||m.ph==='done');
  const p=$('#r2p');
  p.textContent=m.ph==='cool'?W.coolNm:m.ph==='done'?W.congrats:(m.ph==='run'?m.run.prompt:W.prompt.release);
  p.classList.toggle('big',m.ph==='done');
  const w=$('#r2w'), want=m.ph==='run'?'car':m.ph;
  if(want!==mode){w.innerHTML=want==='car'?'<div class="car r2c" id="r2c" aria-live="polite"></div>':'';mode=want;}
  if(m.ph==='before')w.innerHTML='<div class="r2pre"><div class="r2what"><p class="lede">'+esc(W.releasing)+'</p>'
   +(m.from==='story'?'<blockquote>'+esc(W.story)+'<span>'+esc(W.written)+'</span></blockquote>':'<p class="sl">'+esc(W.seatLine)+'</p>')
   +'<ul class="pl">'+ADDR.map(a=>'<li>'+seatMk(a,16)+'<b>'+esc(a.k)+'</b><span>'+esc(W.place(a))+'</span></li>').join('')+'</ul></div>'
   +'<div class="r2say"><p class="sh">What the voice says first</p>'+scriptList(SCRIPT,-1,'pre')+'</div></div>';
  else if(m.ph==='script')w.innerHTML='<div class="r2say solo">'+scriptList(SCRIPT,m.script.i)+'</div>';
  else if(m.ph==='run')carSync($('#r2c'),i=>{const l=lineAt(i);return l?{text:l.text,col:l.col}:null;},m.run.i,3);
  else if(m.ph==='cool')w.innerHTML='<div class="r2say solo">'+scriptList(W.cool,m.cool.said-1)+'</div>';
  else{const d=m.done;
   w.innerHTML='<div class="r2d"><p class="lede">'+esc(d.halted?W.ended(d.released,d.places):W.did(d.released,d.places))+'</p>'
    +'<div class="r2f">'+['released','bank','vault'].map(k=>'<div class="fg"><span class="fl">'+W.fig[k]+'</span><b class="num">'+N(d[k])+'</b><span class="fu">'+W.figU[k]+'</span><span class="fm">'+W.figM[k]+'</span></div>').join('')+'</div>'
    +'<p class="sm">'+esc(W.pattern)+'</p></div>';}
  const b=$('#r2b');
  if(m.ph==='before')b.innerHTML='<div class="r2set">'+UI.from(m)+'<span class="lb"><span class="ll">'+W.dose+'</span>'+UI.dose(m)+'</span>'+UI.voice(m)+UI.tone(m)+'</div>'
   +'<div class="r2go"><span class="est num">'+esc(W.est(m.dose,m.est.lines,m.est.min))+'</span>'+UI.begin()+'</div>';
  else if(m.ph==='script'||m.ph==='run'){
   const a=m.run.addr;
   b.innerHTML='<div class="r2l">'+(m.ph==='run'?'<span class="ad">'+seatMk(a)+'<b>'+esc(a.k)+'</b><span>'+esc(W.place(a))+'</span></span>':(m.voice?UI.vm(!m.paused,W.voice):''))+'</div>'
    +'<div class="r2m">'+UI.pause(m)+'</div>'
    +'<div class="r2r num">'+(m.paused?esc(W.pausedSay):esc(W.minLeft(m.ph==='run'?m.run.min:m.est.min)))+'</div>';}
  else if(m.ph==='cool')b.innerHTML='<div class="r2l">'+(m.voice?UI.vm(true,W.voice):'')+'</div><div class="r2m"><b class="clk num">'+mmss(m.cool.left)+'</b></div>'
   +'<div class="r2r"><button type="button" class="lk" data-act="finish">'+W.finish+'</button></div>';
  else{const d=m.done;
   b.innerHTML=d.canRun?'<div class="r2end"><span class="sm num">'+esc(W.month(d.left))+'</span>'+UI.after(m)+'</div>'
    :'<div class="r2end spent"><p class="sp">'+esc(W.spent)+'</p><div class="acts">'+UI.after(m)+'<span class="shut">'+MK.clock+'<span>'+W.spentSlot+'</span></span>'
     +'<button type="button" class="lk" data-act="tiers">'+W.tiers+'</button></div></div>';}}
 return {mount,paint};})();
