/* Puts an option's rail on the real page. 1600 wide: a screenshot of the built app with the left column emptied (ctx/), the rail drawn over
   its place, open or closed. 390 wide: the rail as the card the phone stacks under the picture.
   ?p=marcus|diane|tomas   ?v=1600|390   ?s=open|closed   ?still=1 draws the end state with no motion   ?t=2.4 freezes the clock at 2.4 s
   ?aw=open opens the Awareness section (and, at 1600, draws the right panel as Summary over Reading)   ?sel=Weaver is the item pressed */
(function(){
var RL=window.RL, U=RL.URL;
window.mountOption=function(opt){
 var v=U.get('v')||(window.innerWidth<700?'390':'1600'), st=U.get('s')||'open', P=RL.person(U.get('p')||'marcus'), app=document.getElementById('app');
 var aw=U.get('aw')==='open', sel=U.get('sel')||'';
 document.body.insertAdjacentHTML('afterbegin',RL.defs());
 var style=U.get('style')||opt.dials||'bar';
 var en=function(){return aw&&window.RA?'<div class="energy"><h3>Energy</h3>'+RA.awareness(P,{sel:sel,state:{allDom:U.get('all')==='1'}})+'</div>':RL.energy(P);};
 if(v==='390'){
  document.body.style.width='390px'; document.body.style.minHeight='0';
  if(st==='closed'){
   app.innerHTML='<div class="card390 closed390" style="padding:0">'+opt.phoneClosed(P)+'</div>';
  } else {
   app.innerHTML='<div class="card390">'+RL.header()+'<div class="dock" style="margin-top:12px">'+opt.dock(P,330,true)+'</div>'+RL.dialsBlock(P,style,{aw:150})+en()+'</div>';
  }
 } else {
  var full=U.get('full')==='1';
  app.className='stagebg'; app.style.setProperty('--ctx','url(ctx/'+(full?'full-'+P.key:(st==='closed'?'closed':'open')+'-'+P.key)+'.png)');
  if(st==='closed'){
   app.innerHTML='<aside class="rail closed" aria-label="Left column, closed">'+opt.closed(P)+'</aside>';
  } else {
   app.innerHTML='<aside class="rail" aria-label="Left column">'+RL.header()+'<div class="dock">'+opt.dock(P,264,false)+'</div>'+RL.dialsBlock(P,style,{aw:122})+en()+'</aside>'
    +(full&&window.RA?'<aside class="rpbox" aria-label="Right panel">'+RA.rightPanel(P,sel)+'</aside>':'');
   if(aw){var r=app.querySelector('.rail'), h=r.querySelector('.energy'); if(h)r.scrollTop=Math.max(0,h.offsetTop-70);}
  }
 }
 if(opt.after)opt.after(P,v,st);
};
})();
