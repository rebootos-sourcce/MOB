/* ============================================================
   P1, THREE FLAT CARDS. Closest to his web example: three columns, the
   price the biggest thing on each, the marks for what each opens.

   THE ALTERNATE TO THE LEAD (p2). It keeps tier four's line, which Emmy cut
   from the lead, so the owner sees his own brief beside her call.

   THE TWO TENSIONS, AND WHICH SIDE THIS ONE SHOWS. Each card carries its
   own button (the sales director's model, and ui/plans.js: no single
   start with a card pre-picked). Nothing is picked. The one card that
   opens what the person just touched takes the lighter flat tone and
   says so in words, "Opens saboteurs", which is a fact about the door
   and not a nudge: it is the tier SIGHT names for that layer.
   ============================================================ */
function legendHtml(){
 return '<ul class="legend" aria-label="What a tier opens">'+ROWS.map(g=>
  '<li'+(TOUCHED&&g.k===TOUCHED.k?' class="touched"':'')+'>'+mark(g.k,28,!seesNow(g.k))
  +'<span><b>'+WORD[g.k]+'</b><span class="m">'+MEAN[g.k]+'</span></span></li>').join('')+'</ul>';}
function cardHtml(t){
 const fact=DOOR===t.k, now=ON===t.k, below=RANK[t.k]<RANK[ON];
 let act;
 if(now)act='<div class="nowis">'+W.onThis+'</div>';
 else if(below)act='';
 else if(S==='closed')act='<div class="shut">'+soonSvg+'<span>'+W.soon+'</span></div>';
 else act='<button class="'+(fact?'go':'go quiet')+'" type="button" data-act="buy" data-t="'+t.k+'" aria-label="'+W.start(t)+'">'
  +'<span class="lg">'+W.open(t)+'</span><span class="sh">'+W.openShort(t)+'</span></button>';
 return '<div class="card'+(fact?' fact':'')+(now?' now':'')+'" data-pt="'+t.k+'">'
  +'<div class="cn">'+t.nm+'</div>'
  +'<div class="pr">'+price(t)+'<span class="per">'+W.per+'</span></div>'
  +'<div class="ln">'+W.grant(t)+'</div>'
  +'<div class="rf"><div class="rings" role="img" aria-label="Opens '+t.sees.map(k=>ROW(k).nm).join(', ')+'">'
  +t.sees.map(k=>'<span>'+icon(k)+'</span>').join('')+'</div>'
  +(fact?'<div class="fl">'+pickSvg(true)+'<span>'+W.opens(TOUCHED.k)+'</span></div>':'<div class="fl blank"></div>')+'</div>'
  +'<div class="act">'+act+'</div></div>';}
function render(){
 const step2=!SIGNED&&STATE.go;
 const chosen=step2?TIER(STATE.pick||DOOR||'one'):null;
 return '<div class="sheet p1" role="dialog" aria-modal="true" aria-labelledby="t1">'+xBtn()
  +'<header class="hd"><h1 class="t1" id="t1">'+W.title+'</h1>'+ledeP()+'</header>'
  +(step2
   ?'<div class="step2"><div class="card fact one">'
     +'<div class="cn">'+chosen.nm+'</div><div class="pr">'+price(chosen)+'<span class="per">'+W.per+'</span></div>'
     +'<div class="ln">'+W.grant(chosen)+'</div>'
     +'<div class="rings">'+chosen.sees.map(k=>'<span>'+icon(k)+'</span>').join('')+'</div></div>'
     +acctHtml(chosen)+'</div>'
   :legendHtml()+failHtml()+'<div class="cards">'+TIERS.map(cardHtml).join('')+'</div>')
  +'<div class="meta">'+glossP()+'<p class="four">'+W.four+'</p></div>'
  +footHtml()+'<p class="status" role="status" aria-live="polite" id="st"></p></div>';}
