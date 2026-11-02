/* R2, THE INSTRUMENTS. A cluster, the way a cockpit reads: each reading is
   the instrument its meaning calls for, and every instrument sits in the same
   cell, at the same size, with its name above and its figure below.
     a pair     a level dial. 50 is straight up, the needle tilts to the side
                the person leans, and the two halves of the arc are the poles.
     amounts    vitality a charge ring, awareness an aperture, will a shaft
                through a gap, DQ a weight ring, radiance a light, and flow the
                wave root to crown, rbWavePts copied whole. */
var R2W=300,R2H=64;
function r2Arc(cx,cy,r,a0,a1){var p=function(a){return [cx+r*Math.cos(a),cy-r*Math.sin(a)];},s=p(a0),e=p(a1),lg=Math.abs(a1-a0)>Math.PI?1:0;
 return 'M'+s[0].toFixed(2)+' '+s[1].toFixed(2)+'A'+r+' '+r+' 0 '+lg+' '+(a1<a0?1:0)+' '+e[0].toFixed(2)+' '+e[1].toFixed(2);}
var CONCEPT={
 order:['coherence','orientation','balance','Vitality','Awareness','Will','DQ','Radiance','Flow'],
 kind:function(k){return /coherence|orientation|balance/.test(k)?'mark':'fill';},
 values:function(p){var o={};pairsOf(p).forEach(function(P){o[P.k]=P.x;});
  amountsOf(p).forEach(function(a){o[a.k]=a.k==='Flow'?a.pass.map(function(v){return p.unread?100:v*100;}):a.v;});return o;},
 start:function(p){var o={};pairsOf(p).forEach(function(P){o[P.k]=50;});
  amountsOf(p).forEach(function(a){o[a.k]=a.k==='Flow'?[100,100,100,100,100,100,100]:0;});return o;},
 build:function(p){
  var h='<div class="gh" data-say-k="Where you lean" data-say="'+esc(SAY.groupA)+'">'+ic('lean')+'Where you lean</div><div class="gs">'+esc(SAY.groupA)+'</div><div class="dials">';
  pairsOf(p).forEach(function(P){var w=leanWords(P), sc=w.dir<0?P.L.c:w.dir>0?P.R.c:'var(--ink)';
   var band='';
   if(P.band&&!P.unread){var b0=clamp(Math.min(P.band[0],P.band[1]),0,100),b1=clamp(Math.max(P.band[0],P.band[1]),0,100);
    if(b1-b0>.3)band='<path class="band" d="'+r2Arc(40,40,33,Math.PI*(1-b0/100),Math.PI*(1-b1/100))+'"/>';}
   h+='<div class="dial'+(P.unread?' off':'')+'" data-k="'+P.k+'" style="--lc:'+P.L.c+';--rc:'+P.R.c+';--sc:'+sc+'" role="img" aria-label="'
    +esc(P.nm+'. '+(P.unread?'Not read yet.':(w.dir?'Leans '+w.w.toLowerCase()+', '+w.f+'. ':'Even. ')+P.L.nm+' '+P.lr+' per cent, '+P.R.nm+' '+P.rr+' per cent.'))+'">'
    +'<div class="dn" data-say-k="'+P.nm+'" data-say="'+esc(SAY[P.k])+'">'+P.nm+'</div>'
    +'<svg viewBox="0 0 80 46" class="dsv" aria-hidden="true">'
    +'<path class="arc l" d="'+r2Arc(40,40,33,Math.PI,Math.PI/2)+'"/><path class="arc r" d="'+r2Arc(40,40,33,Math.PI/2,0)+'"/>'
    +band+'<path class="tick" d="M40 2.5v6"/>'
    +(P.drift&&!P.unread?'<g class="gn"><path d="M40 40V12"/></g>':'')
    +(P.unread?'':'<g class="nd"><path d="M40 40V9"/></g>')+'<circle class="piv" cx="40" cy="40" r="3.2"/></svg>'
    +'<div class="ends"><span style="color:'+P.L.c+'" data-say-k="'+P.L.nm+'" data-say="'+esc(SAY[P.L.nm])+'">'+ic(P.L.ic)+'</span>'
    +'<b class="fg">'+w.f+'</b><span style="color:'+P.R.c+'" data-say-k="'+P.R.nm+'" data-say="'+esc(SAY[P.R.nm])+'">'+ic(P.R.ic)+'</span></div>'
    +'<div class="dw">'+(P.unread?'not read':esc(/^[A-Z]+$/.test(w.w)?w.w:w.w.toLowerCase()))+'</div></div>';});
  h+='</div><div class="rs">'+pairsOf(p).map(function(P){return '<b>'+P.nm+'.</b> '+esc(SAY[P.k]);}).join(' ')+'</div>';
  h+='<div class="sep"></div><div class="gh" data-say-k="How much" data-say="'+esc(SAY.groupB)+'">'+ic('amount')+'How much</div><div class="gs">'+esc(SAY.groupB)+'</div>';
  var A={};amountsOf(p).forEach(function(a){A[a.k]=a;});
  var cell=function(a,svg){return '<div class="ins'+(a.unread?' off':'')+'" data-k="'+a.k+'" style="--c:'+a.c+'" role="img" aria-label="'+esc(a.nm+', '+(a.unread?'not read yet':fmt(a.v))+'.')+'">'
   +'<div class="dn" data-say-k="'+a.nm+'" data-say="'+esc(SAY[a.k])+'">'+a.nm+'</div><svg viewBox="0 0 64 64" class="isv" aria-hidden="true">'+svg+'</svg><b class="fg">'+fmt(a.v,a.unread)+'</b></div>';};
  var ring=function(k,icon){return '<path class="trk" d="'+r2Arc(32,32,25,Math.PI*1.25,-Math.PI*.25)+'"/><path class="val" pathLength="100" d="'+r2Arc(32,32,25,Math.PI*1.25,-Math.PI*.25)+'"/>'
   +'<g transform="translate(20 20)">'+icon+'</g>';};
  h+='<div class="row3">'
   +cell(A.Vitality,ring('Vitality','<svg width="24" height="24" viewBox="0 0 24 24" class="ic live" data-live="Vitality"><path d="'+vitD(0)+'"/></svg>'))
   +cell(A.Awareness,'<circle class="trk" cx="32" cy="32" r="27"/><path class="iris" d="'+apertureD(0,32,32,25)+'"/>')
   +cell(A.Will,'<path class="trk" d="M32 60V6"/><path class="gate" d="M14 31h12M38 31h12"/><path class="shaft" d=""/>')
   +'</div><div class="row2">'
   +cell(A.DQ,ring('DQ',ic('dq')))
   +cell(A.Radiance,'<defs><radialGradient id="r2g-'+p.id+'"><stop offset="0" stop-color="#E9E2CF" stop-opacity=".55"/><stop offset=".45" stop-color="#E9E2CF" stop-opacity=".18"/><stop offset="1" stop-color="#E9E2CF" stop-opacity="0"/></radialGradient></defs><circle class="glow" cx="32" cy="32" r="30" style="fill:url(#r2g-'+p.id+')"/><path class="sun" d="'+radD(0)+'" transform="translate(32 32) scale(2.1) translate(-12 -12)"/>')
   +'</div>';
  var f=A.Flow, bl=f.block;
  h+='<div class="flow'+(f.unread?' off':'')+'" data-k="Flow" role="img" aria-label="'+esc('Flow, '+(f.unread?'not read yet':fmt(f.v)+(bl<0?', no seat blocked':', blocked at '+BANDS[bl]))+'.')+'">'
   +'<div class="fh"><span class="dn" data-say-k="Flow" data-say="'+esc(SAY.Flow)+'">'+ic('flow')+'Flow'+(f.unread?'':'<em style="color:'+(bl<0?'var(--dim)':PAL[BANDS[bl]])+'">'+(bl<0?'no seat blocked':'blocked at '+BANDS[bl])+'</em>')+'</span><b class="fg">'+fmt(f.v,f.unread)+'</b></div>'
   +'<svg viewBox="0 0 '+R2W+' '+R2H+'" preserveAspectRatio="none" class="fsv" aria-hidden="true">'
   +BANDS.map(function(b,i){return '<rect x="'+(i*R2W/7).toFixed(1)+'" y="0" width="'+(R2W/7).toFixed(1)+'" height="'+R2H+'" style="fill:'+PAL[b]+'" class="fb'+(i===bl?' bk':'')+'"/>';}).join('')
   +'<path class="wm" d="M0 '+R2H/2+'H'+R2W+'"/>'+BANDS.map(function(b){return '<path class="wv" style="stroke:'+PAL[b]+'" d=""/>';}).join('')
   +(f.unread||REDUCED?'':'<circle class="bead" r="2.6"/>')+'</svg>'
   +'<div class="fs">'+BANDS.map(function(b,i){return '<span class="'+(i===bl?'bk':'')+'" style="--sc:'+PAL[b]+'" data-say-k="'+b+'" data-say="'+esc(b+', at '+PLACE[b]+'. '+(f.unread?'Not read yet.':'Passes on '+pct(f.pass[i]*100)+'% of what reaches it.'))+'"><i></i>'+(b==='3rd Eye'?'Eye':b)+'</span>';}).join('')+'</div></div>';
  h+='<div class="rs">'+['DQ','Vitality','Awareness','Will','Radiance','Flow'].map(function(k){return '<b>'+k+'.</b> '+esc(SAY[k]);}).join(' ')+'</div>';
  return h;},
 paint:function(root,p,v,t){
  pairsOf(p).forEach(function(P){var d=root.querySelector('.dial[data-k="'+P.k+'"]'); if(!d)return;
   var ang=function(x){return ((x-50)*1.8).toFixed(2);};
   var n=d.querySelector('.nd'); if(n)n.setAttribute('transform','rotate('+ang(v[P.k])+' 40 40)');
   var g=d.querySelector('.gn'); if(g)g.setAttribute('transform','rotate('+ang(t?P.drift(t):P.x)+' 40 40)');
   var fg=d.querySelector('.fg'); if(fg&&!P.unread){var x=v[P.k],s=Math.round(x<50?100-x:x),txt=(Math.abs(x-P.x)<.05?(P.side<0?P.lr:P.side>0?P.rr:50):s)+'%';if(fg._t!==txt){fg._t=txt;fg.textContent=txt;}}});
  amountsOf(p).forEach(function(a){var el=root.querySelector('[data-k="'+a.k+'"]'); if(!el)return;
   if(a.k==='Flow'){var ps=v.Flow.map(function(x){return x/100;}), key=ps.map(function(q){return q.toFixed(4);}).join(','), N=RB_WV.N, segs=el.querySelectorAll('.wv');
    var P=el._wk===key?el._wp:rbWavePts(ps,R2W,R2H), fresh=el._wk!==key; el._wk=key; el._wp=P;
    if(fresh)for(var s=0;s<7;s++){var i0=Math.round(s*N/7),i1=Math.round((s+1)*N/7),q='';for(var i=i0;i<=i1;i++)q+=(i===i0?'M':'L')+P.pts[i][0].toFixed(1)+' '+P.pts[i][1].toFixed(1);segs[s].setAttribute('d',q);}
    var bd=el.querySelector('.bead'); if(bd&&t){var per=2.8, u=((t%per)/per), k=Math.min(N,Math.floor(u*N)), pt=P.pts[k];bd.setAttribute('cx',pt[0].toFixed(1));bd.setAttribute('cy',pt[1].toFixed(1));
     var sx=Math.min(6,Math.floor(u*7));bd.style.opacity=Math.max(.12,sx===0?1:P.cum[sx-1]).toFixed(2);}
    var f=el.querySelector('.fg'),txt=fmt(P.cum[6]*100,a.unread);if(f._t!==txt){f._t=txt;f.textContent=txt;}return;}
   var x=v[a.k], val=el.querySelector('.val');
   if(val)val.style.strokeDasharray=x.toFixed(2)+' 200';
   if(a.k==='Awareness'){var ir=el.querySelector('.iris'),kk=Math.round(x*2)/2;if(ir._v!==kk){ir._v=kk;ir.setAttribute('d',apertureD(kk,32,32,25));}}
   if(a.k==='Will'){var sh=el.querySelector('.shaft'),top=(59-49*x/100);sh.setAttribute('d',a.unread?'':'M32 59V'+top.toFixed(1)+'M32 '+top.toFixed(1)+'l-6 6M32 '+top.toFixed(1)+'l6 6');el.classList.toggle('thru',x>=56);}
   if(a.k==='Radiance'){var sn=el.querySelector('.sun'),kk2=Math.round(x);if(sn._v!==kk2){sn._v=kk2;sn.setAttribute('d',radD(kk2));}el.querySelector('.glow').style.opacity=(x/100).toFixed(3);}
   if(a.k==='Vitality')paintLive(el,'Vitality',x);
   var fg=el.querySelector('.fg'),txt=fmt(x,a.unread);if(fg._t!==txt){fg._t=txt;fg.textContent=txt;}});}};
