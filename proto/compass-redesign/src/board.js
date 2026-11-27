/* the four side by side, same profile, same release, moving together.
   A question about a drawing is asked with the drawing. */
(function(){
 var grid=document.getElementById('grid'),hov=document.getElementById('hov'),INST={};
 grid.innerHTML=['a','b','c','d'].map(function(k){var o=OPTS[k];
  return '<div class="cell"><div class="ch"><span class="let">'+k.toUpperCase()+'</span><a href="'+FILES[k]+'">'+esc(o.nm)+'</a></div>'
   +'<div class="stage"><canvas id="cv-'+k+'" aria-label="Option '+k.toUpperCase()+', '+esc(o.nm)+'"></canvas></div>'
   +'<div class="w">'+esc(o.what)+'</div></div>';}).join('');
 ['a','b','c','d'].forEach(function(k){INST[k]=Compass(document.getElementById('cv-'+k),k,function(e){hov.innerHTML=hoverHtml(e);});});
 /* HOW FAR EACH ONE MOVES, MEASURED ON THIS SCREEN. The largest distance any
    element travels between now and the stage shown, in pixels at the size
    the drawing is actually drawn. A move under a pixel is a move nobody sees. */
 function moved(k){var I=INST[k],G=I.geo(),P=CX.people[ST.p],o=OPTS[k];
  var A=o.els(P,P.stages[0]),B=o.els(P,P.stages[ST.s]),m=0;
  A.forEach(function(e,i){m=Math.max(m,Math.abs(G.rad(B[i].v)-G.rad(e.v)));});return m;}
 function paint(){document.getElementById('tools').innerHTML=toolsHtml();
  var P=CX.people[ST.p],st=P.stages[ST.s],one=P.stages[1];
  var h=readHtml('a').split('<div class="blk">')[0];
  h+='<div class="blk"><div class="hd">'+ico(ICON[STAGE_IC[ST.s]],C('mid'))+(ST.s?'Largest move since now':'Largest move after one run')+'</div><table class="mv">';
  var keep=ST.s;if(!ST.s){ST.s=1;}
  ['a','b','c','d'].forEach(function(k){var px=moved(k);
   h+='<tr><td><span class="let" style="width:20px;height:20px;font-size:11px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;border:1.5px solid var(--accent);color:var(--accent)">'+k.toUpperCase()+'</span>'+esc(OPTS[k].short)+'</td><td>'+fmt(px,px<10?1:0)+' px</td></tr>';});
  ST.s=keep;
  h+='</table><p class="p q">'+(ST.s?stageNm(ST.s,st)+', projected with the engine\'s own release arithmetic.':'One run is '+one.patterns+' patterns, projected with the engine\'s own release arithmetic. Coherence moves '+fmt(one.cq-P.stages[0].cq,2)+' of 100.')+'</p></div>';
  document.getElementById('info').innerHTML=h;}
 ST.listeners.push(function(){setTimeout(paint,0);});
 bindTools(document.getElementById('tools'),function(){});
 paint();
 window.__CX_INST=INST;
})();
