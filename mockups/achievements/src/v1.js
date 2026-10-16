/* ============================================================
   V1, BODY WITH RINGS. The figure is the page. A large whole body,
   centred, with a thin cool ring on every place something was released,
   the turn ring round it, and a quiet dated ledger under it. At phone
   width the ledger is a bottom sheet over the figure, folded to one line.
   ============================================================ */
function stage(Wd,Ht){
 /* desktop: the circle holds the whole figure. phone: the figure is too
    tall for a circle that fits the width, so the circle is centred on the
    chest and holds the head to the hips, the way Leonardo drew it */
 const mob=narrow();let h,cx,cy,r,fy;
 if(!mob){h=Math.min(640,Ht-40);r=h*.5+26;cx=Wd/2;cy=r+34;fy=cy-h/2;}
 else{h=Math.min(560,Wd*1.42);r=Math.min(Wd/2-26,176);cx=Wd/2;fy=24;cy=fy+h*.36;}
 const W=h*.5,body=bodySvg({h,ringPx:mob?3.6:4.2,vx:[25,50]});
 const S=mob?Math.max(cy+r+40,fy+h+16):cy+r+34;
 return '<svg class="stagesvg" data-hit width="'+Wd+'" height="'+S.toFixed(0)+'" viewBox="0 0 '+Wd+' '+S.toFixed(0)+'">'
  +turnRing(cx,cy,r,P.turn,{w:mob?2.5:3,iconR:r+(mob?-16:22),iconS:mob?15:18})
  +body.replace('<svg class="bodysvg"','<svg class="bodysvg" x="'+(cx-W/2).toFixed(1)+'" y="'+fy.toFixed(1)+'"')+'</svg>';}
function render(){
 const m=$('#main'),mob=narrow();
 const E=estimate(P);
 const hz='<div class="hz"><svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">'+horizonRing(48,48,40,{w:2,bw:8})+'</svg><div>'+horizonText()+'</div></div>';
 const ledger='<section class="ledger" aria-label="What you have done, newest first">'+ledgerHtml()+'</section>';
 const kept=P.ledger.filter(e=>e.kind!=='buy').length;
 if(!mob){
  m.innerHTML='<div class="v1"><div class="side l"><h1>Achievements</h1><p class="lede">An achievement is a dated fact about something you did. It stays.</p>'
   +'<p class="small rk">A thin ring sits on each place where you let something go. Point at one to see what it held and when.</p>'
   +'<div class="turnk">'+turnKey(P.turn)+'<p class="small">'+TURN_SAYS+'</p></div></div>'
   +'<div class="mid" id="stage"></div><div class="side r">'+hz+'</div></div>'
   +'<h2 class="lh">What you have done</h2>'+ledger;
  const st=$('#stage');st.innerHTML=stage(Math.min(720,st.clientWidth),innerHeight-120);
 }else{
  m.innerHTML='<div class="v1 mob"><div class="mh"><h1>Achievements</h1><p class="lede">An achievement is a dated fact about something you did. It stays.</p></div>'
   +'<div class="mid" id="stage"></div></div>'
   +'<div class="sheet" id="sheet"><button class="grab" type="button" aria-expanded="false" aria-controls="sheetbody">'
   +'<span class="hb" aria-hidden="true"></span><span class="sl"><svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">'+horizonRing(20,20,15,{w:2,bw:5})+'</svg>'
   +'<span class="st"><b class="num">'+(E.state==='pct'?E.txt+' of your estimate':fmt(P.released)+' released')+'</b><span>'+kept+' kinds of thing done. Open to read them.</span></span></span></button>'
   +'<div class="sbody" id="sheetbody">'+hz+'<div class="turnk">'+turnKey(P.turn)+'<p class="small">'+TURN_SAYS+'</p></div>'+ledger+'</div></div>';
  const st=$('#stage');st.innerHTML=stage(st.clientWidth,innerHeight);
  const sh=$('#sheet'),g=sh.querySelector('.grab');
  g.addEventListener('click',()=>{const o=sh.classList.toggle('open');g.setAttribute('aria-expanded',String(o));});
  if(Q.has('open'))g.click();}}
start();
