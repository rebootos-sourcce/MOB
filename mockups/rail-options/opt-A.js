/* OPTION A, THE SPINE. The wire that runs down the gutter today becomes a column of the 112 addresses, seven seat clusters, crown at
   the top, so the readings hang beside the body they come from. One bar carries CQ and DQ (round OT). Under it, rows stay rows: a form
   where the bar was, the name, the figure small, each in its element's colour. Flow is the band under the rows, in a lane CQ sets. */
(function(){
var RL=window.RL, SEAT=RL.SEAT, BANDS=RL.BANDS, f1=RL.f1;
function svg(w,h,inner,cls){return '<svg class="'+(cls||'')+'" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" aria-hidden="true">'+inner+'</svg>';}
function row(key,nm,glyph,sec,title){
 return '<button type="button" class="Arow" data-k="'+key+'" title="'+title+'" aria-label="'+nm+' '+sec+'. '+title+'">'
  +'<span class="Ag">'+glyph+'</span><span class="At"><b>'+nm+'</b><span class="sec-n">'+sec+'</span></span></button>';}

function spine(P,w,h,sc){
 var order=[6,5,4,3,2,1,0], top=30*sc, pitch=(h-60*sc)/6, cx=26*sc, tx=cx+25*sc, dk=RL.darkest(P), lt=RL.lightest(P), out='';
 out+='<path d="M'+f1(cx)+' '+f1(4*sc)+'V'+f1(h-4*sc)+'" stroke="rgba(255,255,255,.12)" stroke-width="1" stroke-dasharray="1 4"/>';
 [0,1].forEach(function(k){var y=7*sc, x=cx+(k?6:-6)*sc; out+='<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(2.4*sc)+'" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"/>';
  out+='<circle cx="'+f1(x)+'" cy="'+f1(h-y)+'" r="'+f1(2.4*sc)+'" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"/>';});
 order.forEach(function(s,k){
  var y=top+k*pitch, n=RL.seatNodes(P,s).length, R=3.85*Math.sqrt(n)*sc;
  out+=RL.cluster(P,s,cx,y,R,{sc:R/20*1.05});
  var isD=s===dk, isL=s===lt;
  out+='<text x="'+f1(tx)+'" y="'+f1(y+(isD||isL?-1:4))+'" font-size="'+f1(11.5*sc)+'" fill="'+(isD||isL?'#EFEDE8':'#94908A')+'" font-weight="'+(isD||isL?600:500)+'">'+BANDS[s]+'</text>';
  if(isD||isL)out+='<text x="'+f1(tx)+'" y="'+f1(y+11*sc)+'" font-size="'+f1(10.5*sc)+'" fill="'+(isD?'#D4736D':'#7EB8D4')+'" font-weight="600">'+(isD?'darkest':'lightest')+'</text>';
 });
 return svg(w,h,out,'spine');}

var BTN='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M9.5 4.5v15M13.5 9.5l3 2.5-3 2.5"/></svg>';
window.OPT={dials:'bar',
 dock:function(P,W,phone){
  var sc=phone?1.12:1, spW=Math.round(90*sc), gap=6, rowsW=W-spW-gap, rh=50, flH=phone?72:72, h=4*rh+10+26+flH+4;
  var vic=svg(44,44,RL.vessel(P,22,24,34)), awc=svg(44,44,RL.iris(P,22,22,36)), wic=svg(44,44,RL.arrow(P,22,24,34)), rdc=svg(44,44,RL.sun(P,22,22,44));
  var fl=RL.band(P,rowsW,flH,{lw:2.6});
  return '<div class="A" style="width:'+W+'px">'
   +'<button type="button" class="Abar" title="CQ is coherence, the 21 laws. DQ is decoherence, all the charge on all 112 addresses, and the seven marks are its seven seats, root to crown. The line is how far the person oscillates, measured as the Compass measures it." aria-label="CQ '+Math.round(P.CQ)+' percent, DQ '+Math.round(P.DQ)+' percent">'+RL.cqdqBar(P,W,48)+'</button>'
   +'<div class="Atop" style="display:flex;gap:'+gap+'px;margin-top:8px"><div class="Aspine" style="width:'+spW+'px;flex:none">'+spine(P,spW,h,sc)+'</div>'
   +'<div class="Arows" style="width:'+rowsW+'px">'
   +row('xyz','Vitality',vic,P.X.toFixed(2),'A vessel, in energy yellow. The fill is the energy left once the shadow is taken off.')
   +row('xyz','Awareness',awc,P.Y.toFixed(2),'An iris, in indigo. The wider the opening, the more of what you mean gets through unbent.')
   +row('xyz','Will',wic,P.Z.toFixed(2),'An arrow, in blue. Its length is the integrity that gets through the charge, and it sways with what does not.')
   +row('xyz','Radiance',rdc,P.rad.toFixed(2),'A sun with a ray each for the three above. Vitality, awareness and will combined: the root of their squares.')
   +'<div class="Aflow"><div class="Afh"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M12 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M18 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8"/></svg><b>Flow</b><span class="sec-n">'+P.flow.toFixed(2)+'</span></div>'+fl.html+'</div>'
   +'</div></div></div>';},
 closed:function(P){
  var h='<button type="button" class="Cbtn" aria-label="Open the left column" title="Open the left column">'+BTN+'</button>';
  h+='<div style="position:absolute;left:0;right:0;top:58px">';
  var forms=[RL.lawRing(P,0,0,15,{tmax:4.2,tmin:.9}),RL.eclipse(P,0,0,14)];
  h+=svg(58,2*40+4,forms.map(function(g,i){return '<g transform="translate(29 '+(22+i*40)+')">'+g+'</g>';}).join(''));
  h+='<div style="display:flex;justify-content:center;margin:2px 0 6px">'+RL.cqdqMini(P,70,8,true)+'</div>';
  var f2=[RL.vessel(P,0,2,26),RL.iris(P,0,0,28),RL.arrow(P,0,2,26),RL.sun(P,0,0,34)];
  h+=svg(58,4*40,f2.map(function(g,i){return '<g transform="translate(29 '+(22+i*40)+')">'+g+'</g>';}).join(''));
  var ls='',order=[6,5,4,3,2,1,0];
  order.forEach(function(s,k){var y=20+k*30,n=RL.seatNodes(P,s).length; ls+=RL.cluster(P,s,29,y,3.1*Math.sqrt(n)*.62,{sc:.5,anim:false});});
  h+='<div style="margin-top:2px">'+svg(58,7*30+10,ls)+'</div>';
  var fl=RL.band(P,150,38,{lw:2.2,pad:4,bgop:.1});
  h+='<div style="position:relative;height:150px;margin-top:2px"><div style="position:absolute;left:10px;top:150px;width:150px;height:38px;transform-origin:0 0;transform:rotate(-90deg)">'+fl.html+'</div></div>';
  h+='</div>'; return h;},
 phoneClosed:function(P){
  var forms=[RL.lawRing(P,0,0,13,{tmax:3.8,tmin:.9,noorbit:true}),RL.eclipse(P,0,0,12),RL.vessel(P,0,2,24),RL.iris(P,0,0,26),RL.arrow(P,0,2,24),RL.sun(P,0,0,30)];
  var fl=RL.band(P,86,36,{lw:2,pad:4,bgop:.1});
  return '<div style="display:flex;align-items:center;gap:0;height:64px;padding:0 4px 0 8px">'
   +svg(2*32+4*32,44,forms.map(function(g,i){return '<g transform="translate('+(16+i*32)+' 22)">'+g+'</g>';}).join(''))
   +'<div style="width:86px;margin-left:4px">'+fl.html+'</div><span style="flex:1"></span>'
   +'<button type="button" class="Cbtn" style="position:static" aria-label="Open the left column"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10l5 5 5-5"/></svg></button></div>';}
};
var st=document.createElement('style');
st.textContent='.Abar{display:block;width:100%;border-radius:9px}.Abar:hover svg,.Abar:focus-visible svg{filter:brightness(1.12)}'
 +'.Arow{display:flex;align-items:center;gap:8px;width:100%;height:50px;border-radius:var(--r-xs);padding:0 4px 0 0}'
 +'.Arow:hover,.Arow:focus-visible{background:rgba(255,255,255,.05)}'
 +'.Ag{width:44px;height:44px;flex:none;display:block}.At{display:flex;flex-direction:column;line-height:1.2;min-width:0}.At b{font-size:13.5px;font-weight:600;color:var(--ink)}'
 +'.Aflow{margin-top:8px}.Afh{display:flex;align-items:center;gap:8px;height:24px;color:var(--mid)}.Afh b{font-size:13.5px;font-weight:600;color:var(--ink)}'
 +'.Aflow>svg{border-radius:var(--r-xs);background:rgba(128,128,128,.10);box-shadow:inset 0 0 0 1px var(--edge)}'
 +'.Cbtn{position:absolute;left:7px;top:7px;width:44px;height:44px;display:grid;place-items:center;color:var(--mid);border-radius:8px}'
 +'.Cbtn:hover{background:rgba(255,255,255,.06)}';
document.head.appendChild(st);
window.mountOption(window.OPT);
})();
