/* R1, THE LEVEL. One row, one grammar, for both families: a line of words
   over one track. A pair's track has a line at 50 and one mark, and the
   figure sits over the centre line because that is where it is measured
   from. An amount's track fills from the left end and its figure sits at the
   right, where the fill is heading. Same height, same gap, same track. */
var CONCEPT={
 order:['coherence','orientation','balance','DQ','Vitality','Awareness','Will','Radiance','Flow'],
 kind:function(k){return /coherence|orientation|balance/.test(k)?'mark':'fill';},
 values:function(p){var o={};pairsOf(p).forEach(function(P){o[P.k]=P.x;});
  amountsOf(p).forEach(function(a){o[a.k]=a.k==='Flow'?a.pass.map(function(v){return p.unread?0:v*100;}):a.v;});return o;},
 start:function(p){var o={};pairsOf(p).forEach(function(P){o[P.k]=50;});
  amountsOf(p).forEach(function(a){o[a.k]=a.k==='Flow'?[0,0,0,0,0,0,0]:0;});return o;},
 build:function(p){
  var h='<div class="gh" data-say-k="Where you lean" data-say="'+esc(SAY.groupA)+'">'+ic('lean')+'Where you lean</div><div class="gs">'+esc(SAY.groupA)+'</div>';
  pairsOf(p).forEach(function(P){var w=leanWords(P);
   var pole=function(S,side){var lit=P.side===(side==='l'?-1:1);
    return '<span class="pole '+side+(lit?' lit':'')+'" style="--pc:'+S.c+'" data-say-k="'+S.nm+'" data-say="'+esc(SAY[S.nm])+'">'
     +(side==='l'?ic(S.ic)+'<span>'+S.nm+'</span>':'<span>'+S.nm+'</span>'+ic(S.ic))+'</span>';};
   var sc=w.dir<0?P.L.c:w.dir>0?P.R.c:'var(--ink)';
   h+='<div class="row pair'+(P.unread?' off':'')+'" data-k="'+P.k+'" style="--lc:'+P.L.c+';--rc:'+P.R.c+';--sc:'+sc+'"'
    +' role="img" aria-label="'+esc(P.nm+'. '+(P.unread?'Not read yet.':(w.dir?'Leans '+w.w.toLowerCase()+', '+w.f+'. ':'Even. ')+P.L.nm+' '+P.lr+' per cent, '+P.R.nm+' '+P.rr+' per cent.'))+'">'
    +'<div class="ln">'+pole(P.L,'l')
    +'<span class="lw" data-say-k="'+P.nm+'" data-say="'+esc(SAY[P.k])+'">'+(w.dir<0?ic('chevL','ch'):'')+'<b class="fg">'+w.f+'</b>'+(w.dir>0?ic('chevR','ch'):'')+'</span>'
    +pole(P.R,'r')+'</div>'
    +'<div class="tk"><i class="h l"></i><i class="h r"></i>'
    +(P.band&&!P.unread?'<i class="band" style="left:'+clamp(Math.min(P.band[0],P.band[1]),0,100).toFixed(2)+'%;width:'+Math.abs(clamp(P.band[1],0,100)-clamp(P.band[0],0,100)).toFixed(2)+'%"></i>':'')
    +'<i class="fl l"></i><i class="fl r"></i><i class="mid"></i>'
    +(P.drift?'<i class="hold gh2"><i class="ghost"></i></i>':'')
    +(P.unread?'':'<i class="hold nd"><i class="needle"></i></i>')+'</div>'
    +'<div class="rs">'+esc(SAY[P.k])+'</div></div>';});
  h+='<div class="sep"></div><div class="gh" data-say-k="How much" data-say="'+esc(SAY.groupB)+'">'+ic('amount')+'How much</div><div class="gs">'+esc(SAY.groupB)+'</div>';
  amountsOf(p).forEach(function(a){
   var flow=a.k==='Flow', bl=a.block, sub=flow&&!a.unread?(bl<0?'no seat blocked':'blocked at '+BANDS[bl]):'';
   h+='<div class="row amt'+(a.unread?' off':'')+(flow?' flow':'')+'" data-k="'+a.k+'" style="--c:'+(a.c||'var(--ink)')+'"'
    +' role="img" aria-label="'+esc(a.nm+', '+(a.unread?'not read yet':fmt(a.v))+(sub?', '+sub:'')+'.')+'">'
    +'<div class="ln"><span class="nm" data-say-k="'+a.nm+'" data-say="'+esc(SAY[a.k])+'">'+liveIc(a.k,a.v)+'<span>'+a.nm+'</span>'
    +(sub?'<em class="'+(bl<0?'':'blk')+'" style="--bc:'+(bl<0?'var(--dim)':PAL[BANDS[bl]])+'">'+sub+'</em>':'')+'</span>'
    +'<b class="fg">'+fmt(a.v,a.unread)+'</b></div>';
   if(!flow)h+='<div class="tk"><i class="q" style="left:25%"></i><i class="q" style="left:50%"></i><i class="q" style="left:75%"></i><i class="fill"></i><i class="hold hd"><i class="head"></i></i></div>';
   else{h+='<div class="tk cells">';
    BANDS.forEach(function(b,i){h+='<i class="cell'+(i===bl?' bk':'')+'" style="--sc:'+PAL[b]+'" data-say-k="'+b+'" data-say="'+esc(b+', at '+PLACE[b]+'. '+(a.unread?'Not read yet.':'Passes on '+pct(a.pass[i]*100)+'% of what reaches it and holds back '+(100-pct(a.pass[i]*100))+'%.'))+'"><i class="ex"></i></i>';});
    h+='<svg class="step" viewBox="0 0 700 100" preserveAspectRatio="none" aria-hidden="true"><path d=""/></svg></div>';
    h+='<div class="seats" aria-hidden="true">'+BANDS.map(function(b,i){return '<span'+(i===bl?' class="bk" style="color:'+PAL[b]+'"':'')+'>'+(b==='3rd Eye'?'Eye':b)+'</span>';}).join('')+'</div>';}
   h+='<div class="rs">'+esc(SAY[a.k])+'</div></div>';});
  return h;},
 paint:function(root,p,v,t){
  var self=this;
  pairsOf(p).forEach(function(P){
   var row=root.querySelector('.row[data-k="'+P.k+'"]'); if(!row)return;
   var x=v[P.k], c=row._c||(row._c={nd:row.querySelector('.nd'),l:row.querySelector('.fl.l'),r:row.querySelector('.fl.r'),g:row.querySelector('.gh2'),f:row.querySelector('.lw .fg')});
   if(c.nd)c.nd.style.transform='translateX('+x.toFixed(2)+'%)';
   if(!P.unread){c.l.style.transform='scaleX('+(Math.max(0,50-x)/50).toFixed(4)+')';c.r.style.transform='scaleX('+(Math.max(0,x-50)/50).toFixed(4)+')';}
   if(c.g){var gx=t?P.drift(t):P.x;c.g.style.transform='translateX('+gx.toFixed(2)+'%)';}
   /* the figure counts with the mark and lands on the reading */
   if(c.f&&!P.unread){var s=x<50?100-x:x, n=Math.round(s), fin=P.side<0?P.lr:P.side>0?P.rr:50;
    var txt=(Math.abs(x-P.x)<.05?fin:n)+'%'; if(c.f._t!==txt){c.f._t=txt;c.f.textContent=txt;}}});
  amountsOf(p).forEach(function(a){
   var row=root.querySelector('.row[data-k="'+a.k+'"]'); if(!row)return;
   if(a.k==='Flow'){var ps=v.Flow, cells=row.querySelectorAll('.cell .ex'), cum=100, d='M0 '+(100-cum).toFixed(1);
    for(var i=0;i<7;i++){cells[i].style.transform='scaleY('+(ps[i]/100).toFixed(4)+')'; cum=cum*ps[i]/100; d+='H'+(i*100)+'V'+(100-cum).toFixed(1)+'H'+((i+1)*100);}
    if(!a.unread)row.querySelector('.step path').setAttribute('d',d);
    var f=row.querySelector('.fg'), txt=fmt(cum,a.unread); if(f._t!==txt){f._t=txt;f.textContent=txt;}
    return;}
   var x=v[a.k], c=row._c||(row._c={f:row.querySelector('.fill'),h:row.querySelector('.hd'),g:row.querySelector('.fg')});
   c.f.style.transform='scaleX('+(x/100).toFixed(4)+')'; c.h.style.transform='translateX('+x.toFixed(2)+'%)';
   c.h.style.opacity=(a.unread||x<.5)?'0':'1';
   var txt=fmt(x,a.unread); if(c.g._t!==txt){c.g._t=txt;c.g.textContent=txt;}
   paintLive(row,a.k,x);});}};
