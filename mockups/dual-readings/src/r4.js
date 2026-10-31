/* R4, THE MIRROR. Everything is drawn about one vertical line, the body's
   midline, which is also the line the masculine and feminine sides are
   mirrored across (the strip's own ruling, masculine left, logged in
   BOOK-ERRATA as a mirror).
     a pair     sits off the line by its lean: a bead on a beam, and the
                figure over the line it is measured from.
     an amount  is drawn the same on both sides of the line, so its shape says
                it has no direction: only how wide it is.
     flow       is the line itself, root at the foot and crown at the top: a
                channel as wide as what is still getting through, hatched where
                it has collapsed, pinched at the seat that holds back most. */
var CONCEPT={
 order:['coherence','orientation','balance','DQ','Vitality','Awareness','Will','Radiance','Flow'],
 kind:function(k){return /coherence|orientation|balance/.test(k)?'mark':'fill';},
 values:function(p){var o={};pairsOf(p).forEach(function(P){o[P.k]=P.x;});
  amountsOf(p).forEach(function(a){o[a.k]=a.k==='Flow'?a.pass.map(function(v){return p.unread?0:v*100;}):a.v;});return o;},
 start:function(p){var o={};pairsOf(p).forEach(function(P){o[P.k]=50;});
  amountsOf(p).forEach(function(a){o[a.k]=a.k==='Flow'?[0,0,0,0,0,0,0]:0;});return o;},
 build:function(p){
  var h='<div class="m4"><i class="spine"></i>';
  h+='<div class="gh c" data-say-k="Where you lean" data-say="'+esc(SAY.groupA)+'">'+ic('lean')+'Where you lean</div><div class="gs c">'+esc(SAY.groupA)+'</div>';
  pairsOf(p).forEach(function(P){var w=leanWords(P), sc=w.dir<0?P.L.c:w.dir>0?P.R.c:'var(--ink)';
   var pole=function(S,side){var lit=P.side===(side==='l'?-1:1);
    return '<span class="pole '+side+(lit?' lit':'')+'" style="--pc:'+S.c+'" data-say-k="'+S.nm+'" data-say="'+esc(SAY[S.nm])+'">'
     +(side==='l'?ic(S.ic)+'<span>'+S.nm+'</span>':'<span>'+S.nm+'</span>'+ic(S.ic))+'</span>';};
   h+='<div class="rw pr'+(P.unread?' off':'')+'" data-k="'+P.k+'" style="--lc:'+P.L.c+';--rc:'+P.R.c+';--sc:'+sc+'" role="img" aria-label="'
    +esc(P.nm+'. '+(P.unread?'Not read yet.':(w.dir?'Leans '+w.w.toLowerCase()+', '+w.f+'. ':'Even. ')+P.L.nm+' '+P.lr+' per cent, '+P.R.nm+' '+P.rr+' per cent.'))+'">'
    +'<div class="ln">'+pole(P.L,'l')+'<span class="cf" data-say-k="'+P.nm+'" data-say="'+esc(SAY[P.k])+'">'+(w.dir<0?ic('chevL','ch'):'')+'<b>'+w.f+'</b>'+(w.dir>0?ic('chevR','ch'):'')+'</span>'+pole(P.R,'r')+'</div>'
    +'<div class="beam"><i class="hf l"></i><i class="hf r"></i>'
    +(P.band&&!P.unread?'<i class="band" style="left:'+clamp(Math.min(P.band[0],P.band[1]),0,100).toFixed(2)+'%;width:'+Math.abs(clamp(P.band[1],0,100)-clamp(P.band[0],0,100)).toFixed(2)+'%"></i>':'')
    +(P.unread?'':'<i class="fl l"></i><i class="fl r"></i>')
    +(P.drift&&!P.unread?'<i class="hold gp"><i class="gt"></i></i>':'')
    +(P.unread?'':'<i class="hold mk"><i class="bead"></i></i>')+'</div>'
    +'<div class="rs c">'+esc(SAY[P.k])+'</div></div>';});
  h+='<div class="sep"></div><div class="gh c" data-say-k="How much" data-say="'+esc(SAY.groupB)+'">'+ic('amount')+'How much</div><div class="gs c">Each is one reading, drawn the same on both sides of the line, from none of it to as wide as the panel.</div>';
  amountsOf(p).forEach(function(a){if(a.k==='Flow')return;
   h+='<div class="rw am'+(a.unread?' off':'')+'" data-k="'+a.k+'" style="--c:'+a.c+'" role="img" aria-label="'+esc(a.nm+', '+(a.unread?'not read yet':fmt(a.v))+'.')+'">'
    +'<div class="ln c"><span class="nm" data-say-k="'+a.nm+'" data-say="'+esc(SAY[a.k])+'">'+liveIc(a.k,a.v)+'<span>'+a.nm+'</span><b class="fg">'+fmt(a.v,a.unread)+'</b></span></div>'
    +'<div class="sp"><i class="w"></i><i class="hold cl"><i class="cap"></i></i><i class="hold cr"><i class="cap"></i></i></div>'
    +'<div class="rs c">'+esc(SAY[a.k])+'</div></div>';});
  var f=amountsOf(p)[5], bl=f.block;
  h+='<div class="sep"></div><div class="fl4'+(f.unread?' off':'')+'" data-k="Flow" role="img" aria-label="'+esc('Flow, '+(f.unread?'not read yet':fmt(f.v)+(bl<0?', no seat blocked':', blocked at '+BANDS[bl]))+'.')+'">'
   +'<div class="ln c"><span class="nm" data-say-k="Flow" data-say="'+esc(SAY.Flow)+'">'+ic('flow')+'<span>Flow</span><b class="fg">'+fmt(f.v,f.unread)+'</b></span></div>'
   +'<div class="fsub">'+(f.unread?'not read yet':bl<0?'no seat blocked':'<span style="color:'+PAL[BANDS[bl]]+'">blocked at '+BANDS[bl]+'</span>')+'</div>'
   +'<div class="crown-out"><i class="pipe out" style="--sc:'+PAL.Crown+'"><i class="ex"></i></i></div>';
  for(var i=6;i>=0;i--){var b=BANDS[i], hb=f.unread?0:100-pct(f.pass[i]*100);
   h+='<div class="seat'+(i===bl?' bk':'')+'" style="--sc:'+PAL[b]+'" data-i="'+i+'">'
    +'<span class="sn" data-say-k="'+b+'" data-say="'+esc(b+', at '+PLACE[b]+'.')+'">'+b+'</span>'
    +'<span class="mid"><i class="pipe up"><i class="ex"></i></i><i class="pipe dn" style="--sc:'+(i?PAL[BANDS[i-1]]:'var(--mid)')+'"><i class="ex"></i></i><i class="node"></i></span>'
    +'<span class="sv">'+(f.unread?'':hb>0?(i===bl?'blocked, ':'')+'holds back '+hb+'%':'')+'</span></div>';}
  h+='<div class="key c"><span><i class="k1"></i>expressed</span><span><i class="k2"></i>collapsed</span></div><div class="rs c">'+esc(SAY.Flow)+'</div></div></div>';
  return h;},
 paint:function(root,p,v,t){
  pairsOf(p).forEach(function(P){var r=root.querySelector('.rw[data-k="'+P.k+'"]'); if(!r||P.unread)return;
   var x=v[P.k], c=r._c||(r._c={m:r.querySelector('.mk'),l:r.querySelector('.fl.l'),r:r.querySelector('.fl.r'),g:r.querySelector('.gp'),f:r.querySelector('.cf b')});
   c.m.style.transform='translateX('+x.toFixed(2)+'%)';
   c.l.style.transform='scaleX('+(Math.max(0,50-x)/50).toFixed(4)+')';c.r.style.transform='scaleX('+(Math.max(0,x-50)/50).toFixed(4)+')';
   if(c.g)c.g.style.transform='translateX('+(t?P.drift(t):P.x).toFixed(2)+'%)';
   var s=Math.round(x<50?100-x:x),txt=(Math.abs(x-P.x)<.05?(P.side<0?P.lr:P.side>0?P.rr:50):s)+'%';if(c.f._t!==txt){c.f._t=txt;c.f.textContent=txt;}});
  amountsOf(p).forEach(function(a){
   if(a.k==='Flow'){var el=root.querySelector('.fl4'); if(!el)return; var ps=v.Flow, cum=[],c=100;
    ps.forEach(function(q){c=c*q/100;cum.push(c);});
    [].forEach.call(el.querySelectorAll('.seat'),function(s){var i=+s.getAttribute('data-i');
     s.querySelector('.pipe.up .ex').style.transform='scaleX('+(cum[i]/100).toFixed(4)+')';
     s.querySelector('.pipe.dn .ex').style.transform='scaleX('+((i?cum[i-1]:(a.unread?0:100))/100).toFixed(4)+')';});
    el.querySelector('.crown-out .ex').style.transform='scaleX('+(cum[6]/100).toFixed(4)+')';
    var fg=el.querySelector('.fg'),txt=fmt(cum[6],a.unread);if(fg._t!==txt){fg._t=txt;fg.textContent=txt;}return;}
   var r=root.querySelector('.rw[data-k="'+a.k+'"]'); if(!r)return; var x=v[a.k];
   r.querySelector('.w').style.transform='scaleX('+(x/100).toFixed(4)+')';
   r.querySelector('.cl').style.transform='translateX('+(50-x/2).toFixed(2)+'%)';
   r.querySelector('.cr').style.transform='translateX('+(50+x/2).toFixed(2)+'%)';
   r.classList.toggle('z',x<.5);
   var fg=r.querySelector('.fg'),txt=fmt(x,a.unread);if(fg._t!==txt){fg._t=txt;fg.textContent=txt;}
   paintLive(r,a.k,x);});}};
