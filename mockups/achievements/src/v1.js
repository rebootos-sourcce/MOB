/* ============================================================
   V1, BODY WITH RINGS. The figure is the page. A large whole body,
   centred, with a thin cool ring on every place something was released,
   the turn ring round it and the horizon ring just outside that, and a
   quiet dated ledger under it. At phone width the ledger is a bottom
   sheet, folded to one line, under a figure that fits the screen whole.
   ============================================================ */
function stage(Wd,avail){
 /* desktop: the circle holds the whole figure. phone: a circle that fits the width cannot hold a
    figure worth looking at, so it is centred on the navel the way Leonardo drew it, holding the head
    and the hands, and only the shins pass out of it */
 const mob=narrow();let h,cx,cy,r,fy,S;
 if(!mob){h=Math.min(620,avail-60);r=h*.5+24;cx=Wd/2;cy=r+40;fy=cy-h/2;S=cy+r+40;}
 else{r=Math.min(Wd/2-24,172);h=Math.min((r-6)/.41,avail-8);cx=Wd/2;fy=r+12-.43*h;cy=fy+.43*h;S=Math.max(cy+r+14,fy+h+6);}
 const W=h*.5,body=bodySvg({h,ringPx:mob?3.4:4.2,vx:[25,50]});
 return '<svg class="stagesvg" data-hit width="'+Wd+'" height="'+S.toFixed(0)+'" viewBox="0 0 '+Wd+' '+S.toFixed(0)+'">'
  +horizonRing(cx,cy,r+(mob?8:11),{w:2,bw:mob?6:8})
  +turnRing(cx,cy,r,P.turn,{w:2,iconR:mob?r-18:r+32,iconS:mob?15:18})
  +body.replace('<svg class="bodysvg"','<svg class="bodysvg" x="'+(cx-W/2).toFixed(1)+'" y="'+fy.toFixed(1)+'"')+'</svg>';}
const RINGS_SAY='A thin ring sits on each place where you let something go. Point at one to see what it held and when.';
const HZ_SAY='The outer arc is what you have released, against the estimate for your age.';
function render(){
 const m=$('#main'),mob=narrow(),E=estimate(P);
 const ledger='<section class="ledger" aria-label="What you have done, newest first">'+ledgerHtml()+'</section>';
 if(!mob){
  m.innerHTML='<div class="v1"><div class="side l"><h1>Achievements</h1><p class="lede">An achievement is a dated fact about something you did. It stays.</p>'
   +'<p class="small rk">'+RINGS_SAY+'</p>'
   +'<div class="turnk">'+turnKey(P.turn)+'<p class="small">'+TURN_SAYS+'</p></div></div>'
   +'<div class="mid" id="stage"></div><div class="side r"><div class="hz1">'+horizonText()+arcSays(HZ_SAY)+'</div></div></div>'
   +'<div class="lw"><h2 class="lh">What you have done</h2>'+ledger+'</div>';
  const st=$('#stage');st.innerHTML=stage(Math.min(760,st.clientWidth),innerHeight-110);
 }else{
  m.innerHTML='<div class="v1 mob"><div class="mh"><h1>Achievements</h1><p class="lede">An achievement is a dated fact about something you did. It stays.</p></div>'
   +'<div class="mid" id="stage"></div></div>'
   +'<div class="sheet" id="sheet"><button class="grab" type="button" aria-expanded="false" aria-controls="sheetbody">'
   +'<span class="hb" aria-hidden="true"></span><span class="st"><b class="num">'+(E.state==='pct'?E.txt+' of your estimate':fmt(P.released)+' released')+'</b><span>What you have done, newest first</span></span></button>'
   +'<div class="sbody" id="sheetbody">'+ledger+'<div class="hz1">'+horizonText().replace(/<div class="fig num">[\s\S]*?<\/div>/,'')+arcSays(HZ_SAY)+'</div>'
   +'<p class="small">'+RINGS_SAY+'</p><div class="turnk">'+turnKey(P.turn)+'<p class="small">'+TURN_SAYS+'</p></div></div></div>';
  const st=$('#stage');const top=st.getBoundingClientRect().top+scrollY;
  st.innerHTML=stage(st.clientWidth,innerHeight-top-78);
  const sh=$('#sheet'),g=sh.querySelector('.grab');
  /* the folded sheet takes the room left under the figure, so the newest dated line shows without a tap */
  sh.style.setProperty('--sh',Math.max(92,Math.round(innerHeight-st.getBoundingClientRect().bottom-2))+'px');
  g.addEventListener('click',()=>{const o=sh.classList.toggle('open');g.setAttribute('aria-expanded',String(o));});
  if(Q.has('open'))g.click();}}
start();
