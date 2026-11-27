(function(){
 if(window.__probe)return; window.__probe=1;
 var L=window.__ls=[], S=Storage.prototype, si=S.setItem, ri=S.removeItem, cl=S.clear;
 S.setItem=function(k,v){var e=null;try{return si.call(this,k,v);}catch(x){e=x;throw x;}
  finally{L.push([Date.now(),'set',k,String(v).length,e&&e.name]);}};
 S.removeItem=function(k){L.push([Date.now(),'remove',k]);return ri.call(this,k);};
 S.clear=function(){L.push([Date.now(),'clear']);return cl.call(this);};
 try{new PerformanceObserver(function(l){var a=window.__lt=window.__lt||[];
  l.getEntries().forEach(function(x){a.push([Math.round(performance.timeOrigin+x.startTime),Math.round(x.duration)]);});})
  .observe({type:'longtask',buffered:true});}catch(e){}
 addEventListener('pagehide',function(){L.push([Date.now(),'pagehide']);});
})();
