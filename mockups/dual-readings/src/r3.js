/* R3, THE COMMON AXIS. One mark per reading and nothing else drawn: no
   fills. The three pairs share one centre line, drawn once down through all
   three, so the leans can be compared to each other at a glance. The amounts
   share one axis from none to all, gridded at the quarters down through
   every row, so vitality can be compared to will without reading a figure.
   A mark is a ring on a stem: from the centre for a pair, from nought for an
   amount. Flow opens into its own chart under its row: a line that starts at
   all of it at the root and steps down at every seat by what that seat holds
   back, so the cliff is where you are blocked. */
var CONCEPT={
 order:['coherence','orientation','balance','DQ','Vitality','Awareness','Will','Radiance','Flow'],
 kind:function(k){return /coherence|orientation|balance/.test(k)?'mark':'fill';},
 values:function(p){var o={};pairsOf(p).forEach(function(P){o[P.k]=P.x;});
  amountsOf(p).forEach(function(a){o[a.k]=a.k==='Flow'?a.pass.map(function(v){return p.unread?100:v*100;}):a.v;});return o;},
 start:function(p){var o={};pairsOf(p).forEach(function(P){o[P.k]=50;});
  amountsOf(p).forEach(function(a){o[a.k]=a.k==='Flow'?[100,100,100,100,100,100,100]:0;});return o;},
 build:function(p){
  var h='<div class="gh" data-say-k="Where you lean" data-say="'+esc(SAY.groupA)+'">'+ic('lean')+'Where you lean</div><div class="gs">'+esc(SAY.groupA)+'</div>';
  h+='<div class="blk A"><div class="ax"><span></span><span class="even">even</span><span></span></div><i class="spine"></i>';
  pairsOf(p).forEach(function(P){var w=leanWords(P), sc=w.dir<0?P.L.c:w.dir>0?P.R.c:'var(--ink)';
   h+='<div class="rw pr'+(P.unread?' off':'')+'" data-k="'+P.k+'" style="--lc:'+P.L.c+';--rc:'+P.R.c+';--sc:'+sc+'" role="img" aria-label="'
    +esc(P.nm+'. '+(P.unread?'Not read yet.':(w.dir?'Leans '+w.w.toLowerCase()+', '+w.f+'. ':'Even. ')+P.L.nm+' '+P.lr+' per cent, '+P.R.nm+' '+P.rr+' per cent.'))+'">'
    +'<span class="nm" data-say-k="'+P.nm+'" data-say="'+esc(SAY[P.k])+'">'+P.nm+'</span>'
    +'<span class="sc"><span class="pl l" style="color:'+P.L.c+'" data-say-k="'+P.L.nm+'" data-say="'+esc(SAY[P.L.nm])+'">'+ic(P.L.ic)+'</span>'
    +'<span class="ln"><i class="base"></i>'
    +(P.band&&!P.unread?'<i class="band" style="left:'+clamp(Math.min(P.band[0],P.band[1]),0,100).toFixed(2)+'%;width:'+Math.abs(clamp(P.band[1],0,100)-clamp(P.band[0],0,100)).toFixed(2)+'%"></i>':'')
    +(P.unread?'':'<i class="stem l"></i><i class="stem r"></i>')
    +(P.drift&&!P.unread?'<i class="hold gp"><i class="gdot"></i></i>':'')
    +(P.unread?'':'<i class="hold mk"><i class="dot"></i></i>')+'</span>'
    +'<span class="pl r" style="color:'+P.R.c+'" data-say-k="'+P.R.nm+'" data-say="'+esc(SAY[P.R.nm])+'">'+ic(P.R.ic)+'</span>'
    +'<span class="pws"><span class="pw'+(P.side<0?' lit':'')+'">'+P.L.nm+'</span><span class="pw'+(P.side>0?' lit':'')+'">'+P.R.nm+'</span></span></span>'
    +'<b class="fg">'+(w.dir<0?ic('chevL','ch'):'')+'<span>'+w.f+'</span>'+(w.dir>0?ic('chevR','ch'):'')+'</b>'
    +'<div class="rs">'+esc(SAY[P.k])+'</div></div>';});
  h+='</div><div class="sep"></div><div class="gh" data-say-k="How much" data-say="'+esc(SAY.groupB)+'">'+ic('amount')+'How much</div><div class="gs">'+esc(SAY.groupB)+'</div>';
  h+='<div class="blk B"><div class="ax q"><span>none</span><span>25</span><span>50</span><span>75</span><span>all</span></div>'
   +'<i class="gl g0"></i><i class="gl g1"></i><i class="gl g2"></i><i class="gl g3"></i><i class="gl g4"></i>';
  amountsOf(p).forEach(function(a){
   var flow=a.k==='Flow', bl=a.block;
   h+='<div class="rw am'+(a.unread?' off':'')+(flow?' fl':'')+'" data-k="'+a.k+'" style="--c:'+(a.c||'var(--ink)')+'" role="img" aria-label="'+esc(a.nm+', '+(a.unread?'not read yet':fmt(a.v))+(flow&&!a.unread?(bl<0?', no seat blocked':', blocked at '+BANDS[bl]):'')+'.')+'">'
    +'<span class="nm" data-say-k="'+a.nm+'" data-say="'+esc(SAY[a.k])+'">'+liveIc(a.k,a.v)+'<span>'+a.nm+'</span></span>'
    +'<span class="sc"><span class="ln"><i class="base"></i>'+(a.unread?'':'<i class="stem"></i><i class="hold mk"><i class="dot"></i></i>')+'</span></span>'
    +'<b class="fg"><span>'+fmt(a.v,a.unread)+'</span></b>'
    +'<div class="rs">'+esc(SAY[a.k])+'</div></div>';
   if(flow){
    h+='<div class="stair'+(a.unread?' off':'')+'" aria-hidden="true"><svg viewBox="0 0 700 100" preserveAspectRatio="none"><defs><pattern id="r3h-'+p.id+'" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke="rgba(239,237,232,.30)" stroke-width="2"/></pattern></defs>'
     +'<path class="g" d="M0 0H700M0 50H700M0 100H700"/>'
     +BANDS.map(function(b,i){return '<rect class="col'+(i===bl?' bk':'')+'" x="'+(i*100+2)+'" y="0" width="96" height="100" style="fill:'+PAL[b]+'"/>';}).join('')
     +'<path class="lost" d="" style="fill:url(#r3h-'+p.id+')"/><path class="kept" d=""/><path class="edge" d=""/></svg>'
     +'<div class="sl">'+BANDS.map(function(b,i){return '<span class="'+(i===bl?'bk':'')+'" style="--sc:'+PAL[b]+'" data-say-k="'+b+'" data-say="'+esc(b+', at '+PLACE[b]+'. '+(a.unread?'Not read yet.':'Passes on '+pct(a.pass[i]*100)+'% of what reaches it and holds back the rest.'))+'">'+(b==='3rd Eye'?'Eye':b)+'</span>';}).join('')+'</div>'
     +'<div class="key"><span><i class="k1"></i>expressed, still flowing</span><span><i class="k2"></i>collapsed, held back</span>'+(bl>=0?'<span class="kb" style="color:'+PAL[BANDS[bl]]+'">blocked at '+BANDS[bl]+'</span>':'')+'</div></div>';}});
  h+='</div>';
  return h;},
 paint:function(root,p,v,t){
  pairsOf(p).forEach(function(P){var r=root.querySelector('.rw[data-k="'+P.k+'"]'); if(!r||P.unread)return;
   var x=v[P.k];
   r.querySelector('.mk').style.transform='translateX('+x.toFixed(2)+'%)';
   r.querySelector('.stem.l').style.transform='scaleX('+(Math.max(0,50-x)/50).toFixed(4)+')';
   r.querySelector('.stem.r').style.transform='scaleX('+(Math.max(0,x-50)/50).toFixed(4)+')';
   var g=r.querySelector('.gp'); if(g)g.style.transform='translateX('+(t?P.drift(t):P.x).toFixed(2)+'%)';
   var fg=r.querySelector('.fg span'),s=Math.round(x<50?100-x:x),txt=(Math.abs(x-P.x)<.05?(P.side<0?P.lr:P.side>0?P.rr:50):s)+'%';if(fg._t!==txt){fg._t=txt;fg.textContent=txt;}});
  amountsOf(p).forEach(function(a){var r=root.querySelector('.rw[data-k="'+a.k+'"]'); if(!r)return;
   var x=a.k==='Flow'?v.Flow.reduce(function(c,q){return c*q/100;},100):v[a.k];
   if(!a.unread){r.querySelector('.mk').style.transform='translateX('+x.toFixed(2)+'%)';r.querySelector('.stem').style.transform='scaleX('+(x/100).toFixed(4)+')';}
   var fg=r.querySelector('.fg span'),txt=fmt(x,a.unread);if(fg._t!==txt){fg._t=txt;fg.textContent=txt;}
   paintLive(r,a.k,x);
   if(a.k==='Flow'&&!a.unread){var st=root.querySelector('.stair'),c=100,kept='M0 100V0',edge='M0 0',lost='';
    v.Flow.forEach(function(q,i){var c0=c;c=c*q/100;var y0=100-c0,y1=100-c;
     edge+='H'+(i*100+50)+'V'+y1.toFixed(2);
     lost+='M'+(i*100+50)+' '+y0.toFixed(2)+'H'+((i+1)*100)+'V'+y1.toFixed(2)+'H'+(i*100+50)+'Z';
     kept+='H'+(i*100+50)+'V'+y1.toFixed(2);});
    edge+='H700'; kept+='H700V100Z';
    st.querySelector('.kept').setAttribute('d',kept);st.querySelector('.edge').setAttribute('d',edge);
    /* the collapsed area is everything above the line, under the top */
    var la='M0 0H700V'+(100-c).toFixed(2), cc=100, segs=[];
    v.Flow.forEach(function(q,i){segs.push([i*100+50,100-cc]);cc=cc*q/100;segs.push([i*100+50,100-cc]);});
    for(var j=segs.length-1;j>=0;j--)la+='H'+segs[j][0]+'V'+segs[j][1].toFixed(2);
    la+='H0Z'; st.querySelector('.lost').setAttribute('d',la);}});}};
