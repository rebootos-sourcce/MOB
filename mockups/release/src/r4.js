/* ============================================================
   4. THE FIGURE. His centre: "What is Atuned? Your avatar." The body
   outline the Body page draws stands beside the list for the whole
   session, with the three places being released marked on it as rings
   in their seat colours. The place being said is the larger ring; a
   place whose lines are all said carries a dot inside its ring. In the
   cooldown, when the voice asks where the energy is moving, the figure
   is what the eye has to go to.
   The count here is lines left at the place being said, and the whole
   session's lines left beside it, so the figure and the figure's own
   count agree.
   ============================================================ */
const V=(()=>{
 /* the seat heights on the figure, a share of its height from the crown down.
    The Body page places each of the 112 addresses exactly; a mockup places them
    by seat, which is near enough to read and is said so in the README. */
 const SEATY={Crown:.03,'3rd Eye':.075,Throat:.15,Heart:.27,Solar:.355,Sacral:.45,Root:.5};
 let geo=null;
 function figure(){
  return '<svg class="fig" viewBox="0 0 100 100" role="img" aria-label="Your figure, with the three places this release runs"><path class="body" id="bodyp" transform="translate('+BODY.tx+','+BODY.ty+') scale('+BODY.s+')" d="'+BODY.d+'"/><g id="marks"></g></svg>';}
 function measure(){
  const p=$('#bodyp');if(!p)return;const b=p.getBBox();
  geo={x:BODY.tx+BODY.s*(b.x+b.width/2),y0:BODY.ty+BODY.s*b.y,h:BODY.s*b.height};}
 function marks(m){
  if(!geo)measure();if(!geo)return;
  const cur=m.ph==='run'?m.run.cur.a:-1;
  const finished=a=>m.ph==='done'||m.ph==='cool'||(m.ph==='run'&&a<cur);
  $('#marks').innerHTML=ADDR.map((a,i)=>{const y=geo.y0+geo.h*SEATY[a.seat], on=i===cur, r=on?4.2:2.6;
   /* two places on one seat would sit on top of each other: step them sideways */
   const x=geo.x+(ADDR.filter((b,j)=>j<i&&b.seat===a.seat).length*7);
   return '<g style="color:var('+a.col+')" class="mk'+(on?' on':'')+'"><circle cx="'+x.toFixed(2)+'" cy="'+y.toFixed(2)+'" r="'+r+'" fill="none" stroke="currentColor" stroke-width="'+(on?1.1:.8)+'"/>'
    +(finished(i)?'<circle cx="'+x.toFixed(2)+'" cy="'+y.toFixed(2)+'" r="1.1" fill="currentColor"/>':'')+'</g>';}).join('');}
 function mount(rs){
  rs.innerHTML=UI.x()+'<div class="r4"><div class="fw" id="fw">'+figure()+'</div><div class="col" id="col"><p class="prompt r4p" id="r4p"></p>'
   +'<div class="car r4c" id="r4c" aria-live="polite"></div><div class="mid" id="mid"></div><div class="r4t" id="r4t"></div></div></div>'+UI.crx()+'<div class="r4v" id="r4v"></div>';}
 let mode='';
 function paint(m){
  const rs=$('#rs');rs.dataset.ph=m.ph;
  $('.x',rs).hidden=!(m.ph==='before'||m.ph==='done');
  marks(m);
  const p=$('#r4p');p.textContent=m.ph==='run'?m.run.prompt:W.prompt.release;
  p.classList.toggle('wait',m.ph==='before'||(m.ph==='script'&&m.script.i<SCRIPT.length-1));
  p.classList.toggle('off',m.ph==='cool'||m.ph==='done');
  const car=$('#r4c'), want=m.ph==='script'?'script':m.ph==='run'?'run':m.ph==='cool'?'cool':'none';
  if(want!==mode){carReset(car);mode=want;}
  car.hidden=want==='none';
  if(want==='script')carSync(car,i=>i>=0&&i<SCRIPT.length?{text:SCRIPT[i]}:null,m.script.i,2);
  if(want==='run')carSync(car,i=>{const l=lineAt(i);return l?{text:l.text}:null;},m.run.i,2);
  if(want==='cool')carSync(car,i=>i>=0&&i<W.cool.length?{text:W.cool[i]}:null,m.cool.said-1,2);
  let mid='';
  if(m.ph==='before')mid='<p class="lede">'+esc(W.releasing)+'</p>'
   +(m.from==='story'?'<blockquote>'+esc(W.story)+'<span>'+esc(W.written)+'</span></blockquote>':'<p class="sm">'+esc(W.seatLine)+'</p>')
   +'<ul class="pl">'+ADDR.map(a=>'<li>'+seatMk(a,14)+'<b>'+esc(a.k)+'</b><span>'+esc(W.place(a))+'</span></li>').join('')+'</ul>';
  else if(m.ph==='run'){const a=m.run.addr, atLeft=PER_ADDR()-(m.run.i%PER_ADDR());
   mid='<p class="ad">'+seatMk(a)+'<b>'+esc(a.k)+'</b><span>'+esc(W.place(a))+'</span></p>'
    +'<p class="ct num">'+(m.paused?esc(W.pausedSay):W.here(atLeft)+' <span>'+W.left(m.run.left)+' in all</span>')+'</p>';}
  else if(m.ph==='cool')mid='<p class="cd"><span>'+W.coolNm+'</span><b class="num">'+mmss(m.cool.left)+'</b></p>';
  else if(m.ph==='done'){const d=m.done;
   mid='<p class="cg">'+W.congrats+'</p><p class="dn">'+esc(d.halted?W.ended(d.released,d.places):W.did(d.released,d.places))+'</p>'
    +'<div class="r4f">'+['released','bank','vault'].map(k=>'<div class="fg"><span class="fl">'+W.fig[k]+'</span><b class="num">'+N(d[k])+'</b><span class="fu">'+W.figU[k]+'</span><span class="fm">'+W.figM[k]+'</span></div>').join('')+'</div>'
    +'<p class="sm">'+esc(W.pattern)+(d.canRun?' '+esc(W.month(d.left)):'')+'</p>'+(d.canRun?'':'<p class="sp">'+esc(W.spent)+'</p>');}
  $('#mid').innerHTML=mid;
  let t='';
  if(m.ph==='before')t='<div class="row">'+UI.from(m)+'<span class="lb"><span class="ll">'+W.dose+'</span>'+UI.dose(m)+'</span></div><div class="row">'+UI.voice(m)+UI.tone(m)+'</div>'
   +'<div class="row go1"><span class="es num">'+esc(W.est(m.dose,m.est.lines,m.est.min))+'</span>'+UI.begin()+'</div>';
  else if(m.ph==='script'||m.ph==='run')t='<div class="row">'+UI.pause(m)+'</div>';
  else if(m.ph==='cool')t='<div class="row"><button type="button" class="lk" data-act="finish">'+W.finish+'</button></div>';
  else t='<div class="row">'+UI.after(m)+(m.done.canRun?'':'<span class="shut">'+MK.clock+'<span>'+W.spentSlot+'</span></span><button type="button" class="lk" data-act="tiers">'+W.tiers+'</button>')+'</div>';
  $('#r4t').innerHTML=t;
  $('#r4v').innerHTML=(m.ph==='run'||m.ph==='cool'||m.ph==='script')&&m.voice?UI.vm(!m.paused,W.voice):'';}
 return {mount,paint};})();
W.here=n=>N(n)+' here,';
