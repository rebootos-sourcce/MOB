/* ---------- expression ---------- */
function exprFill(nm){
 var e=EXPR.filter(function(x){return x.nm===nm;})[0]; if(!e)return 10;
 var seg=W.filter(function(n){return n.b===e.b;});
 var hot=seg.filter(function(n){return n.sq>=4;});
 var load=hot.reduce(function(a,n){return a+n.sq;},0)/Math.max(1,seg.length)/10;
 var ig=bandIg(e.b);
 return clamp(ig*(1-load*1.25),0,10);}
function exprRead(){return EXPR.map(function(e){var f=exprFill(e.nm);
 return {nm:e.nm, sh:e.sh, b:e.b, fill:f, leak:10-f};});}
