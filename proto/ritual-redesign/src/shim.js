/* THE PROTOTYPE KEEPS ITS HANDS OFF THE REAL PROFILE.

   Chrome gives every page opened from disk one shared localStorage. This page
   seeds a profile with five weeks of record so the options can be looked at
   full, and if it wrote to the real store it would write over the profile in
   atuned.html the next time that file was opened in the same browser. So the
   store is swapped for one that lives in memory and is gone when the tab
   closes, before the product's own boot binds it. */
(function(){
 var m={};
 var mem={getItem:function(k){return Object.prototype.hasOwnProperty.call(m,k)?m[k]:null;},
  setItem:function(k,v){m[k]=String(v);}, removeItem:function(k){delete m[k];},
  clear:function(){m={};}, key:function(i){return Object.keys(m)[i]||null;},
  get length(){return Object.keys(m).length;}};
 try{Object.defineProperty(window,'localStorage',{value:mem,configurable:true});}catch(e){}
 window.__PROTO_MEM=mem;
})();
