/* OPTION B, THE ORRERY. The six readings stop being rows and become one instrument, a ring of rings, in the Field's own orientation
   (Root at the top, clockwise to Crown). The outer ring is the 21 laws, seated by seat. The seven rosettes are the seats, each made of
   its own addresses. The trefoil at the centre is vitality, awareness and will, and the glow where they meet is radiance. */
(function(){
var RL=window.RL, SEAT=RL.SEAT, BANDS=RL.BANDS, f1=RL.f1, TAU=RL.TAU;
function svg(w,h,inner,cls,extra){return '<svg class="'+(cls||'')+'" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" '+(extra||'')+'>'+inner+'</svg>';}

function orrery(P,S){ /* S is the drawing size; the design is made at 264 and scaled by viewBox */
 var c=132, out='', dk=RL.darkest(P), lt=RL.lightest(P);
 out+=RL.lawRing(P,c,c,118,{tmax:6.5,tmin:1.2,sectors:true,seat:true,gap:.05});
 out+='<circle cx="'+c+'" cy="'+c+'" r="80" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1" stroke-dasharray="1 5"/>';
 var pos=[];
 for(var s=0;s<7;s++){var a=-Math.PI/2+s*TAU/7, x=c+80*Math.cos(a), y=c+80*Math.sin(a), n=RL.seatNodes(P,s).length, R=4.55*Math.sqrt(n);
  pos.push([x,y,a,R]); out+=RL.cluster(P,s,x,y,R,{sc:R/20*1.05});}
 /* the four outside the body, as open rings beyond the root and the crown */
 [[0,-1],[0,1]].forEach(function(k){var a=pos[0][2]+k[1]*.1, x=c+103*Math.cos(a), y=c+103*Math.sin(a); out+='<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="2.3" fill="none" stroke="rgba(255,255,255,.4)"/>';});
 [[0,-1],[0,1]].forEach(function(k){var a=pos[6][2]+k[1]*.1, x=c+103*Math.cos(a), y=c+103*Math.sin(a); out+='<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="2.3" fill="none" stroke="rgba(255,255,255,.4)"/>';});
 /* the marks: a ring round the darkest, a ring round the lightest */
 [[dk,'#D4736D'],[lt,'#7EB8D4']].forEach(function(m){var p=pos[m[0]]; out+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="'+f1(p[3]*1.34)+'" fill="none" stroke="'+m[1]+'" stroke-width="1.2" stroke-dasharray="3 3" opacity=".9"><title>'+(m[0]===dk?'darkest':'lightest')+', '+BANDS[m[0]]+'</title></circle>';});
 /* the trefoil */
 out+=RL.triad(P,c,c,40,{noTips:true});
 /* the forms on the tips: iris on top (awareness), arrow lower right (will), vessel lower left (vitality) */
 var ang=[-90,30,150],vals=[P.Y,P.Z,P.X],fn=[RL.iris,RL.arrow,RL.vessel];
 ang.forEach(function(a,i){var x=c+Math.cos(a*Math.PI/180)*40,y=c+Math.sin(a*Math.PI/180)*40;
  out+='<circle cx="'+RL.f1(x)+'" cy="'+RL.f1(y)+'" r="11.5" fill="#1A1D26" stroke="rgba(255,255,255,.1)"/>'+fn[i](P,x,y+(i?1:0),i===0?19:21);});
 /* corner labels. coherence and decoherence keep their percent, small */
 var tl='',tr='';
 var bl='<g><text x="2" y="240" font-size="10.5" fill="#D4736D" font-weight="600">darkest</text><text x="2" y="255" font-size="12" font-weight="600" fill="#EFEDE8">'+BANDS[dk]+'</text></g>';
 var br='<g><text x="262" y="240" text-anchor="end" font-size="10.5" fill="#7EB8D4" font-weight="600">lightest</text><text x="262" y="255" text-anchor="end" font-size="12" font-weight="600" fill="#EFEDE8">'+BANDS[lt]+'</text></g>';
 return svg(264,264,out+tl+tr+bl+br,'orr','role="img" aria-label="Seven seats, root at the top, clockwise to crown. Outer ring, the 21 laws. Centre, vitality, awareness and will."');}

function chip(nm,val,glyph,title){
 return '<button type="button" class="Bchip" title="'+title+'" aria-label="'+nm+' '+val+'"><span class="Bg">'+glyph+'</span><b>'+nm+'</b><span class="sec-n">'+val+'</span></button>';}

window.OPT={dials:'arc',
 dock:function(P,W,phone){
  var sz=phone?W:204, fl=RL.band(P,W,phone?76:54,{lw:2.8});
  var g=function(f){return svg(26,26,f);};
  var html='<div class="B" style="width:'+W+'px"><div class="Borr" style="width:'+sz+'px;height:'+sz+'px;margin:0 auto">'+orrery(P).replace('width="264" height="264"','width="'+sz+'" height="'+sz+'"')+'</div>'
   +'<button type="button" class="Bbar" style="margin-top:8px" title="CQ is coherence, the 21 laws, the outer ring above. DQ is decoherence, the 112 addresses, the seven balls above, and the seven marks across the bar are its seats, root to crown. The line is how far the person oscillates." aria-label="CQ '+Math.round(P.CQ)+' percent, DQ '+Math.round(P.DQ)+' percent">'+RL.cqdqBar(P,W,48)+'</button>'
   +'<div class="Bchips" style="margin-top:6px">'
   +chip('Vitality',P.X.toFixed(2),g(RL.vessel(P,13,14,22)),'Vitality, in energy yellow. The lower left arm of the trefoil, and a vessel: the energy left once the shadow is taken off.')
   +chip('Awareness',P.Y.toFixed(2),g(RL.iris(P,13,13,22)),'Awareness, in indigo. The top arm, an iris: how much of what you mean gets through unbent.')
   +chip('Will',P.Z.toFixed(2),g(RL.arrow(P,13,14,22)),'Will, in blue. The lower right arm, an arrow: the integrity that gets through the charge.')
   +chip('Radiance',P.rad.toFixed(2),g(RL.sun(P,13,13,26)),'Radiance. The glow where the three meet, the root of their squares.')
   +'</div>'
   +'<div class="Bfl"><div class="Bfh"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M12 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M18 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8"/></svg><b>Flow</b><span class="sec-n">'+P.flow.toFixed(2)+'</span></div>'+fl.html+'</div></div>';
  return html;},
 closed:function(P){
  var h='<button type="button" class="Cbtn" aria-label="Open the left column" title="Open the left column"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M9.5 4.5v15M13.5 9.5l3 2.5-3 2.5"/></svg></button>';
  h+='<div style="position:absolute;left:0;right:0;top:64px">';
  var mini=orrery(P).replace('width="264" height="264"','width="50" height="50"').replace(/<text[^>]*>[^<]*<\/text>/g,'');
  h+='<div style="margin:0 4px;width:50px;height:50px">'+mini+'</div>';
  h+='<div class="sec-n" style="text-align:center;margin-top:6px;line-height:1.25"><span style="color:var(--ink);font-weight:600">'+Math.round(P.CQ)+'%</span><br><span style="color:var(--dim)">'+Math.round(P.DQ)+'%</span></div>';
  var fl=RL.band(P,200,40,{lw:2.2,pad:4,bgop:.1});
  h+='<div style="position:relative;height:210px;margin-top:10px"><div style="position:absolute;left:9px;top:210px;width:200px;height:40px;transform-origin:0 0;transform:rotate(-90deg)">'+fl.html+'</div></div>';
  /* three arms as three small bars standing in the closed state */
  h+='</div>'; return h;},
 phoneClosed:function(P){
  var mini=orrery(P).replace('width="264" height="264"','width="48" height="48"').replace(/<text[^>]*>[^<]*<\/text>/g,'');
  var fl=RL.band(P,150,36,{lw:2,pad:4,bgop:.1});
  return '<div style="display:flex;align-items:center;gap:10px;height:64px;padding:0 4px 0 12px"><div style="width:48px;height:48px">'+mini+'</div>'
   +'<div class="sec-n" style="line-height:1.25"><span style="color:var(--ink);font-weight:600">'+Math.round(P.CQ)+'%</span><br>'+Math.round(P.DQ)+'%</div><div style="width:150px;margin-left:6px">'+fl.html+'</div><span style="flex:1"></span>'
   +'<button type="button" class="Cbtn" style="position:static" aria-label="Open the left column"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10l5 5 5-5"/></svg></button></div>';}
};
var st=document.createElement('style');
st.textContent='.Bbar{display:block;width:100%;border-radius:9px}.Bchips{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}'
 +'.Bchip{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:62px;border-radius:var(--r-xs);padding:4px 0;gap:0;text-align:center}'
 +'.Bchip:hover,.Bchip:focus-visible{background:rgba(255,255,255,.05)}'
 +'.Bchip .Bg{height:26px}.Bchip b{font-size:12px;font-weight:600;color:var(--ink);line-height:1.25}'
 +'.Bfl{margin-top:10px}.Bfh{display:flex;align-items:center;gap:8px;height:24px;color:var(--mid)}.Bfh b{font-size:13.5px;font-weight:600;color:var(--ink)}'
 +'.Bfl>svg{border-radius:var(--r-xs);background:rgba(128,128,128,.10);box-shadow:inset 0 0 0 1px var(--edge)}'
 +'.Cbtn{position:absolute;left:7px;top:7px;width:44px;height:44px;display:grid;place-items:center;color:var(--mid);border-radius:8px}.Cbtn:hover{background:rgba(255,255,255,.06)}';
document.head.appendChild(st);
window.mountOption(window.OPT);
})();
