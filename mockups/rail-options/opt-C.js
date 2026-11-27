/* OPTION C, THE COMMON AXIS. The seven seats run left to right, root to crown, the way the Flow band already runs, and three layers
   stand on that one axis so a seat can be read straight down:
     laws        what the seat holds of Coherence, one bar for each of its laws
     addresses   what it carries, one cell for each address, a tray of 21 slots, black where it is held
     flow        what gets through it, the band
   Above the axis the six readings are tiles with a form each. Decoherence is the total of the middle layer. */
(function(){
var RL=window.RL, SEAT=RL.SEAT, BANDS=RL.BANDS, f1=RL.f1;
function svg(w,h,inner,cls,extra){return '<svg class="'+(cls||'')+'" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" '+(extra||'')+'>'+inner+'</svg>';}
var W0=264, CW=W0/7;

function axis(P){
 var dk=RL.darkest(P), lt=RL.lightest(P), out='', LAWY=2, LAWH=18, BLY=LAWH+22, CELL=9, GAP=2, TRAYH=7*(CELL+GAP)+2, H=BLY+TRAYH+24;
 /* the seat columns, one tint behind all three layers */
 for(var s=0;s<7;s++)out+='<rect x="'+f1(s*CW+1)+'" y="0" width="'+f1(CW-2)+'" height="'+(BLY+TRAYH+4)+'" rx="5" fill="'+SEAT[s]+'" opacity="'+(s===dk||s===lt?.12:.06)+'"/>';
 /* layer one: the laws of the seat, a bar each */
 var spans=[];for(s=0;s<7;s++){spans.push([]);for(var i=0;i<21;i++)if(RD().lawSeat[i]===s)spans[s].push(i);}
 for(s=0;s<7;s++){var ids=spans[s], bw=6, g=2, tw=ids.length*bw+(ids.length-1)*g, x0=s*CW+(CW-tw)/2;
  ids.forEach(function(li,k){var v=P.laws[li]/10, h=3+14*v; out+='<rect x="'+f1(x0+k*(bw+g))+'" y="'+f1(LAWY+LAWH-h)+'" width="'+bw+'" height="'+f1(h)+'" rx="1.5" fill="'+SEAT[s]+'" opacity="'+(.45+.55*v).toFixed(2)+'"><title>'+RD().lawNames[li]+'</title></rect>';});}
 /* layer two: the addresses, a tray of 3 by 7 slots, filled from the floor up */
 for(s=0;s<7;s++){
  var nodes=RL.seatNodes(P,s), n=nodes.length, x0=s*CW+(CW-(3*CELL+2*GAP))/2, us=RL.seatDisp(P,s);
  out+='<rect x="'+f1(x0-2)+'" y="'+BLY+'" width="'+(3*CELL+2*GAP+4)+'" height="'+TRAYH+'" rx="4" fill="#2a2e3b" stroke="rgba(255,255,255,.07)"/>';
  out+='<rect x="'+f1(x0-2)+'" y="'+BLY+'" width="'+(3*CELL+2*GAP+4)+'" height="'+TRAYH+'" rx="4" fill="'+SEAT[s]+'" opacity="'+(.2*(1-us)).toFixed(2)+'" class="pulse" style="--bd:'+RL.seatDelay(P,s)+'"/>';
  nodes.forEach(function(nd,k){var col=k%3, row=Math.floor(k/3), rows=Math.ceil(n/3);
   var x=x0+col*(CELL+GAP), y=BLY+TRAYH-2-(row+1)*(CELL+GAP)+GAP, u=RL.U(nd[3]),
    fill=u<.12?SEAT[s]:RL.mix(SEAT[s],'#05060a',RL.clamp((u-.1)/.75,0,1));
   out+='<rect x="'+f1(x)+'" y="'+f1(y)+'" width="'+CELL+'" height="'+CELL+'" rx="2.5" fill="'+fill+'" opacity="'+(.8-.2*u).toFixed(2)+'"'
    +(u<.12?'':' stroke="'+SEAT[s]+'" stroke-opacity="'+(.85-.3*u).toFixed(2)+'" stroke-width="'+(.7+.5*u).toFixed(2)+'"')+(u>.35?' class="pulse" style="--bd:-'+((nd[0]*.37)%4.2).toFixed(2)+'s"':'')+'><title>'+nd[1]+'</title></rect>';});
  if(s===dk||s===lt)out+='<rect x="'+f1(x0-3.5)+'" y="'+(BLY-1.5)+'" width="'+(3*CELL+2*GAP+7)+'" height="'+(TRAYH+3)+'" rx="5.5" fill="none" stroke="'+(s===dk?'#D4736D':'#7EB8D4')+'" stroke-width="1.2" stroke-dasharray="3 3"/>';}
 /* the four outside the body: two above the crown column, two below the root column, as open rings in the tray's margin */
 [[6,-1],[6,1]].forEach(function(k){out+='<circle cx="'+f1(k[0]*CW+CW/2+k[1]*5)+'" cy="'+(BLY-6)+'" r="2.2" fill="none" stroke="rgba(255,255,255,.4)"/>';});
 [[0,-1],[0,1]].forEach(function(k){out+='<circle cx="'+f1(k[0]*CW+CW/2+k[1]*5)+'" cy="'+(BLY-6)+'" r="2.2" fill="none" stroke="rgba(255,255,255,.4)"/>';});
 return {svg:svg(W0,H,out,'ax','role="img" aria-label="Seven seats, root to crown. Top, the laws of each seat. Middle, its addresses. Charge held shows dark."'),H:H,BLY:BLY};}
function RD(){return window.RD;}

function names(P){
 var dk=RL.darkest(P), lt=RL.lightest(P), out='';
 for(var s=0;s<7;s++){var on=(s===dk||s===lt);
  out+='<text x="'+f1(s*CW+CW/2)+'" y="12" text-anchor="middle" font-size="10" font-weight="500" fill="'+(on?'#EFEDE8':'#94908A')+'" letter-spacing="-.2">'+BANDS[s]+'</text>';
  if(on)out+='<rect x="'+f1(s*CW+CW/2-9)+'" y="17" width="18" height="2" rx="1" fill="'+(s===dk?'#D4736D':'#7EB8D4')+'"/>';}
 return svg(W0,22,out,'nm');}

function tile(k,nm,val,glyph,wide,title){
 return '<button type="button" class="Ct'+(wide?' wide':'')+'" data-k="'+k+'" title="'+title+'" aria-label="'+nm+' '+val+'. '+title+'"><span class="Cg">'+glyph+'</span><span class="Cn"><b>'+nm+'</b><span class="sec-n">'+val+'</span></span></button>';}

window.OPT={dials:'bar',
 dock:function(P,W,phone){
  var ax=axis(P), fl=RL.band(P,W0,phone?64:50,{lw:2.8}), dk=RL.darkest(P), lt=RL.lightest(P);
  var g=function(f,s){return svg(s||40,s||40,f);};
  /* the layers are one picture: laws, then addresses, then flow, then names. the captions are written over the gaps */
  var cap=function(t){return '<div class="Ccap"><span>'+t+'</span></div>';};
  var html='<div class="C" style="width:'+W+'px">'
   +'<button type="button" class="Cbar" title="CQ is coherence, the 21 laws. DQ is decoherence, the total of the 112 addresses in the trays below, and the seven marks across the bar are its seats. The line is how far the person oscillates." aria-label="CQ '+Math.round(P.CQ)+' percent, DQ '+Math.round(P.DQ)+' percent">'+RL.cqdqBar(P,W,48)+'</button>'
   +'<div class="Crow2">'
   +tile('xyz','Vitality',P.X.toFixed(2),g(RL.vessel(P,20,22,34),40),false,'A vessel in energy yellow, filled to the energy left once the shadow is taken off.')
   +tile('xyz','Awareness',P.Y.toFixed(2),g(RL.iris(P,20,20,34),40),false,'An iris in indigo. The wider it is open, the more of what you mean gets through unbent.')
   +tile('xyz','Will',P.Z.toFixed(2),g(RL.arrow(P,20,22,34),40),false,'An arrow in blue. Its length is the integrity that gets through the charge.')
   +tile('xyz','Radiance',P.rad.toFixed(2),g(RL.sun(P,20,20,40),40),false,'A sun with a ray each for the three. Vitality, awareness and will combined, the root of their squares.')
   +'</div>'
   +'<div class="Cax">'
   +cap('<b>By seat</b>, root to crown')
   +'<div class="Caxsvg" style="width:'+W+'px">'+ax.svg.replace('width="264"','width="'+W+'"').replace('height="'+ax.H+'"','height="'+(ax.H*W/W0).toFixed(1)+'"')+'</div>'
   +'<div class="Cflh"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M12 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M18 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8"/></svg><b>Flow</b><span class="sec-n">'+P.flow.toFixed(2)+'</span><span class="Cmk"><i style="color:#D4736D">darkest</i> '+BANDS[dk]+' <i style="color:#7EB8D4">lightest</i> '+BANDS[lt]+'</span></div>'
   +'<div class="Cband" style="width:'+W+'px;height:'+(phone?64:50)+'px">'+fl.html.replace('width="264"','width="'+W+'"')+'</div>'
   +'<div class="Cnames" style="width:'+W+'px">'+names(P).replace('width="264"','width="'+W+'"').replace('height="22"','height="'+(22*W/W0).toFixed(1)+'"')+'</div>'
   +'</div></div>';
  return html;},
 closed:function(P){
  var h='<button type="button" class="Cbtn" aria-label="Open the left column" title="Open the left column"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M9.5 4.5v15M13.5 9.5l3 2.5-3 2.5"/></svg></button>';
  h+='<div style="position:absolute;left:0;right:0;top:64px">';
  /* seven strips, crown at the top: the trays lying down. one cell an address, black where held */
  var o='',order=[6,5,4,3,2,1,0];
  order.forEach(function(s,k){var nodes=RL.seatNodes(P,s), y=6+k*15; o+='<rect x="2" y="'+y+'" width="54" height="11" rx="3" fill="#2a2e3b"/>';
   nodes.forEach(function(nd,i){var u=RL.U(nd[3]), fill=u<.12?SEAT[s]:RL.mix(SEAT[s],'#05060a',RL.clamp((u-.1)/.75,0,1));
    o+='<rect x="'+f1(3.5+i*2.4)+'" y="'+(y+2)+'" width="1.9" height="7" rx=".6" fill="'+fill+'"/>';});});
  h+=svg(58,7*15+8,o);
  h+='<div class="sec-n" style="text-align:center;margin-top:8px;line-height:1.25"><span style="color:var(--ink);font-weight:600">'+Math.round(P.CQ)+'%</span><br>'+Math.round(P.DQ)+'%</div>';
  var forms=[RL.lawRing(P,0,0,12,{tmax:3.4,tmin:.8,sectors:true,seat:true,gap:.05}),RL.eclipse(P,0,0,11)];
  h+=svg(58,2*30+4,forms.map(function(g,i){return '<g transform="translate(29 '+(18+i*30)+')">'+g+'</g>';}).join(''));
  var fl=RL.band(P,190,40,{lw:2.2,pad:4,bgop:.1});
  h+='<div style="position:relative;height:196px;margin-top:6px"><div style="position:absolute;left:9px;top:196px;width:190px;height:40px;transform-origin:0 0;transform:rotate(-90deg)">'+fl.html+'</div></div>';
  h+='</div>'; return h;},
 phoneClosed:function(P){
  var o='';
  for(var s=0;s<7;s++){var nodes=RL.seatNodes(P,s), x=s*30; o+='<rect x="'+x+'" y="1" width="28" height="46" rx="4" fill="#2a2e3b"/>';
   nodes.forEach(function(nd,i){var u=RL.U(nd[3]), fill=u<.12?SEAT[s]:RL.mix(SEAT[s],'#05060a',RL.clamp((u-.1)/.75,0,1)); var col=i%3,row=Math.floor(i/3);
    o+='<rect x="'+f1(x+3+col*8)+'" y="'+f1(41-row*5.6)+'" width="7" height="4.4" rx="1.4" fill="'+fill+'"/>';});}
  var fl=RL.band(P,110,36,{lw:2,pad:4,bgop:.1});
  return '<div style="display:flex;align-items:center;gap:10px;height:64px;padding:0 4px 0 12px">'+svg(210,48,o)+'<div style="width:0"></div>'
   +'<div class="sec-n" style="line-height:1.25"><span style="color:var(--ink);font-weight:600">'+Math.round(P.CQ)+'%</span><br>'+Math.round(P.DQ)+'%</div><span style="flex:1"></span>'
   +'<button type="button" class="Cbtn" style="position:static" aria-label="Open the left column"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10l5 5 5-5"/></svg></button></div>';}
};
var st=document.createElement('style');
st.textContent='.Cbar{display:block;width:100%;border-radius:9px}.Crow2{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:6px}'
 +'.Ct{display:flex;align-items:center;gap:8px;border-radius:var(--r-xs);background:rgba(128,128,128,.10);box-shadow:inset 0 0 0 1px var(--edge);padding:6px 8px;min-height:56px}'
 +'.Ct:hover,.Ct:focus-visible{background:rgba(255,255,255,.07)}'
 +'.Ct .Cg{flex:none;display:block}.Ct .Cn{display:flex;flex-direction:column;line-height:1.2;min-width:0}.Ct b{font-size:12.5px;font-weight:600;color:var(--ink)}'
 +'.Crow2 .Ct{flex-direction:column;justify-content:center;gap:2px;padding:6px 2px 5px;min-height:70px;text-align:center}.Crow2 .Ct .Cn{align-items:center}.Crow2 .Ct b{font-size:11.5px}'
 +'.Cax{margin-top:6px}.Ccap{display:flex;justify-content:space-between;align-items:baseline;font-size:11px;color:var(--dim);height:18px;padding:0 2px}.Ccap b{color:var(--mid);font-weight:600}'
 +'.Cflh{display:flex;align-items:center;gap:8px;height:24px;color:var(--mid);margin-top:2px}.Cflh b{font-size:12.5px;font-weight:600;color:var(--ink)}'
 +'.Cmk{margin-left:auto;font-size:11px;color:var(--dim)}.Cmk i{font-style:normal;font-weight:600;margin-left:6px}.Cmk i:first-child{margin-left:0}'
 +'.Cband svg{border-radius:var(--r-xs);box-shadow:inset 0 0 0 1px var(--edge)}'
 +'.Caxsvg svg{display:block}.Cnames{margin-top:1px}'
 +'.Cbtn{position:absolute;left:7px;top:7px;width:44px;height:44px;display:grid;place-items:center;color:var(--mid);border-radius:8px}.Cbtn:hover{background:rgba(255,255,255,.06)}';
document.head.appendChild(st);
window.mountOption(window.OPT);
})();
