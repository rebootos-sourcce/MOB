/* ============================================================
   V2, DIAL. The avatar set inside concentric instrument rings, read
   from the inside out like a watch: the turn ring, then a bezel with a
   tick at every address released (its place round the dial is its
   number, 1 to 112, from twelve o'clock), then the horizon ring. Only
   released addresses have a tick; the bezel has no track and no
   numerals, so it cannot be counted as a total. The ledger runs in a
   column beside the dial.
   ============================================================ */
function dial(D){
 const c=D/2,r1=D*.355,r2=D*.425,r3=D*.475,mob=narrow();
 const h=D*.6,W=h*.5,body=bodySvg({h,ringPx:mob?3:3.8,vx:[25,50]});
 let s='<svg class="dialsvg" data-hit width="'+D+'" height="'+D+'" viewBox="0 0 '+D+' '+D+'" role="img" aria-label="A dial: your figure inside the turn ring, a tick for each address you released, and the horizon ring">'
  +'<defs><radialGradient id="plate"><stop offset="0" stop-color="#191B23"/><stop offset=".7" stop-color="#14161D"/><stop offset=".97" stop-color="#101218"/><stop offset="1" stop-color="#0C0D12"/></radialGradient></defs>'
  +'<circle cx="'+c+'" cy="'+c+'" r="'+(r3+D*.02)+'" fill="url(#plate)"/>';
 /* the bezel: one tick per released address, built like a body ring so the replay and the
    pointer treat both the same way */
 const tk=mob?4:5,warmR=mob?7:10;
 P.opened.filter(r=>placed(r[0])).forEach(r=>{const a=(r[0]-1)/112*360,p0=pol(c,c,r2-tk,a),p1=pol(c,c,r2+tk,a),pm=pol(c,c,r2,a);
  const d='M'+p0[0].toFixed(2)+' '+p0[1].toFixed(2)+'L'+p1[0].toFixed(2)+' '+p1[1].toFixed(2);
  s+='<g class="ar tick" data-id="'+r[0]+'" data-at="'+r[1]+'"><circle class="w" cx="'+pm[0].toFixed(2)+'" cy="'+pm[1].toFixed(2)+'" r="'+warmR+'"/>'
   +'<path class="g" d="'+d+'"/><path class="r" d="'+d+'" pathLength="100"/></g>';});
 s+=turnRing(c,c,r1,P.turn,{w:mob?2.5:3,iconR:r1-(mob?14:20),iconS:mob?13:17});
 s+=horizonRing(c,c,r3,{w:2,bw:mob?7:10});
 s+=body.replace('<svg class="bodysvg"','<svg class="bodysvg" x="'+(c-W/2).toFixed(1)+'" y="'+(c-h/2).toFixed(1)+'"');
 return s+'</svg>';}
const KEY=()=>'<ul class="dkey">'
 +'<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+arc(12,12,9,3,87)+'" style="stroke:var(--sec-discover)"/><path d="'+arc(12,12,9,93,177)+'" style="stroke:var(--sec-play)"/></svg><span><b>Inner ring.</b> One turn of the loop: discover, play, flow, embody. A quarter lights when you do that step.</span></li>'
 +'<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v7" style="stroke:var(--ach-flow)"/><circle cx="12" cy="16" r="3" style="stroke:var(--ach-flow)"/></svg><span><b>Ticks and small rings.</b> Each is a place you let something go. An address is a named place on the body that the instrument reads, such as the vagus nerve in your neck. The tick sits at that address\'s number round the dial, and the small ring sits where it is on your body.</span></li>'
 +(estimate(P).state==='start'?'':'<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+arc(12,12,9,0,70)+'" style="stroke:var(--ach-flow)"/></svg><span><b>Outer ring.</b> What you have released, against the estimate for your age.</span></li>')+'</ul>';
function render(){
 const m=$('#main'),mob=narrow();
 m.innerHTML='<div class="v2"><div class="dialw" id="dw"></div><aside class="col"><h1>Achievements</h1><p class="lede">An achievement is a dated fact about something you did. It stays.</p>'
  +'<div class="hz2">'+horizonText()+'</div>'+KEY()+'<h2 class="lh">What you have done</h2>'
  +'<section class="ledger" aria-label="What you have done, newest first">'+ledgerHtml()+'</section></aside></div>';
 const dw=$('#dw');const top=dw.getBoundingClientRect().top;const D=mob?Math.min(innerWidth-16,420):Math.min(dw.clientWidth-16,innerHeight-top-24,860);
 dw.innerHTML=dial(Math.round(D));}
start();
