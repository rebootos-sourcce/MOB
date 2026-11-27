/* ============================================================
   P3, THE FIGURE LEADS. The avatar is the centre of the product (his
   ruling, "What is Atuned? Your avatar"), so here the person's own
   figure is the hero and the chain closes round it as rings, the way
   the glossary says the chain is built: saboteurs on the outside,
   complexes one ring in, hyper complexes further in, character the
   innermost ring. The registers and the masks are not rings; they sit
   as two marks on the other side. Every ring and mark says which tier
   opens it.

   THE TWO TENSIONS: each segment is its own button and nothing is
   picked (the sales director's model, as p1). Pointing at a segment,
   or focusing it, fills the rings it opens in one flat colour, which is
   a preview and never a choice: the press is the choice.

   Dark lighting, flat. The figure is engine/data/figure.js, the same
   outline the Body page draws.
   ============================================================ */
const RINGS=[{k:'sab',r:96},{k:'cx',r:89},{k:'hy',r:82},{k:'sup',r:75}];
const MARKS=['reg','mask'];
let PV=Q.get('pv')||null;
function figureSvg(){
 const k=1.36,ox=100-50*k,oy=100-50*k,B=BODY;
 let s='<svg class="fig" viewBox="0 0 200 200" role="img" aria-label="Your figure, with the chain as four rings round it">';
 s+='<g transform="translate('+ox.toFixed(2)+' '+oy.toFixed(2)+') scale('+k+')"><path class="body" transform="translate('+B.tx+','+B.ty+') scale('+B.s+')" d="'+B.d+'"/></g>';
 RINGS.forEach(g=>{
  const seen=seesNow(g.k), fill=PV&&RANK[PV]>=RANK[ROW(g.k).need]&&!seen, tch=TOUCHED&&TOUCHED.k===g.k;
  s+='<circle class="rg'+(seen?' seen':'')+(fill?' fill':'')+(tch?' tch':'')+'" data-k="'+g.k+'" cx="100" cy="100" r="'+g.r+'"/>';});
 return s+'</svg>';}
function labelHtml(k,side){
 const g=ROW(k), seen=seesNow(k), fill=PV&&RANK[PV]>=RANK[g.need]&&!seen;
 return '<li class="lb'+(fill?' fill':'')+(TOUCHED&&TOUCHED.k===k?' tch':'')+'" data-k="'+k+'">'
  +'<span class="disc">'+mark(k,22,!seen&&!fill)+'</span>'
  +'<span class="tx"><b>'+WORD[k]+'</b> <span class="m">'+MEAN[k]+'</span> <span class="tg">'+(seen?W.seen:TIER(g.need).nm)+'</span></span></li>';}
/* ON A PHONE the six labels cannot sit beside the figure, so they become one list in
   chain order, one line each, and each segment carries the marks of what it opens */
function phoneLegend(){
 return '<ul class="plg" aria-label="What each mark means">'+['sab','cx','hy','sup','reg','mask'].map(k=>{const seen=seesNow(k);
  return '<li class="pl" data-k="'+k+'">'+mark(k,20,!seen)+'<span class="tx"><b>'+WORD[k]+'</b> <span class="m">'+MEAN[k]+'</span></span></li>';}).join('')+'</ul>';}
function segHtml(t){
 const now=ON===t.k, fact=DOOR===t.k;
 const body='<span class="cn">'+t.nm+'</span><span class="prw">'+price(t)+'<span class="per">'+W.per+'</span></span>'
  +'<span class="ln">'+W.grant(t)+'</span>'
  +'<span class="srg" role="img" aria-label="Opens '+t.sees.map(k=>ROW(k).nm).join(', ')+'">'+t.sees.map(k=>icon(k)).join('')+'</span>'
  +(fact?'<span class="fl">'+pickSvg(true)+'<span>'+W.opens(TOUCHED.k)+'</span></span>':'');
 if(now)return '<div class="seg now" data-pv="'+t.k+'">'+body+'<span class="sa">'+W.onThis+'</span></div>';
 if(S==='closed')return '<div class="seg" data-pv="'+t.k+'" tabindex="0">'+body+'<span class="sa shutx">'+soonSvg+W.soon+'</span></div>';
 return '<button type="button" class="seg" data-pv="'+t.k+'" data-act="buy" data-t="'+t.k+'">'+body+'<span class="sa"><span class="lg">'+W.open(t)+'</span><span class="sh">'+W.openShort(t)+'</span></span></button>';}
function render(){
 const step2=!SIGNED&&STATE.go;
 const chosen=step2?TIER(STATE.pick||DOOR||'one'):null;
 if(step2)PV=chosen.k;
 return '<div class="sheet p3'+(step2?' s2':'')+'" role="dialog" aria-modal="true" aria-labelledby="t1">'+xBtn()
  +'<header class="hd"><h1 class="t1" id="t1">'+W.title+'</h1>'+ledeP()+'</header>'
  +'<div class="hero"><ul class="lbs left">'+MARKS.map(k=>labelHtml(k)).join('')+'</ul>'
  +'<div class="figwrap">'+figureSvg()
  +'</div>'
  +'<ul class="lbs right">'+RINGS.map(g=>labelHtml(g.k)).join('')+'</ul>'
  +phoneLegend()+'</div>'
  +(step2
   ?'<div class="step2"><div class="seg on one"><span class="cn">'+chosen.nm+'</span><span class="prw">'+price(chosen)+'<span class="per">'+W.per+'</span></span><span class="ln">'+W.grant(chosen)+'</span></div>'+acctHtml(chosen)+'</div>'
   :'<div class="segs">'+TIERS.map(segHtml).join('')+'</div>'+glossP())
  +footHtml()+'<p class="status" role="status" aria-live="polite" id="st"></p></div>';}
/* the preview: pointing at or focusing a segment fills what it opens. It changes no
   state a press reads, so it is never a pick. */
function wire(root){
 const paint=k=>{PV=k;
  RINGS.forEach(g=>{const c=$('circle[data-k="'+g.k+'"]',root);if(c)c.classList.toggle('fill',!!k&&RANK[k]>=RANK[ROW(g.k).need]&&!seesNow(g.k));});
  $$('.lb,.om',root).forEach(el=>{const g=ROW(el.dataset.k),f=!!k&&RANK[k]>=RANK[g.need]&&!seesNow(g.k);el.classList.toggle('fill',f);
   const lk=el.querySelector('.lk');if(lk)lk.style.visibility=f?'hidden':'';});
  $$('.seg',root).forEach(s=>s.classList.toggle('pv',s.dataset.pv===k));};
 $$('.seg[data-pv]',root).forEach(s=>{s.addEventListener('mouseenter',()=>paint(s.dataset.pv));s.addEventListener('focus',()=>paint(s.dataset.pv));});
 const segs=$('.segs',root);if(segs)segs.addEventListener('mouseleave',()=>paint(Q.get('pv')||null));
 if(PV)paint(PV);}
