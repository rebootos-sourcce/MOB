/* one option, full size. OPT is set by the build. */
(function(){
 var cv=document.getElementById('cv'),hov=document.getElementById('hov');
 var I=Compass(cv,OPT,function(e){hov.innerHTML=hoverHtml(e);});
 function paint(){document.getElementById('tools').innerHTML=toolsHtml();
  document.getElementById('info').innerHTML=readHtml(OPT);
  document.getElementById('key').innerHTML=keyHtml(OPT);}
 ST.listeners.push(paint);
 bindTools(document.getElementById('tools'),function(){});
 paint();
 window.__CX_I=I;
})();
