/* OPTION D, THE FIGURE. The 112 addresses are a body: each seat is a slab of dots at its own height on one standing figure whose outline
   follows the slabs. Shadow is fog over the slab, light and density say where it is darkest and lightest. The readings are placed on the
   body where they live: CQ is the halo of laws round the head, awareness the iris at the brow, will the arrow at the solar seat, vitality
   the vessel low in the belly, radiance the aura behind the whole figure and its sun at the heart. CQ and DQ also sit on the one bar above. */
(function(){
var RL=window.RL, SEAT=RL.SEAT, BANDS=RL.BANDS, f1=RL.f1, ELEM=RL.ELEM;
function svg(w,h,inner,cls,extra){return '<svg class="'+(cls||'')+'" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" '+(extra||'')+'>'+inner+'</svg>';}
var VW=264, VH=318, CX=132;
/* seat slabs, root to crown: rows by columns, centre height */
var SLAB=[{c:6,y:284},{c:6,y:246},{c:6,y:206},{c:5,y:160},{c:3,y:118},{c:6,y:86},{c:7,y:52}];
var DX=8.2, DY=7.2;
function silhouette(){
 /* half widths at heights: head, jaw, neck, shoulder, chest, waist, hip, root */
 var pts=[[14,5],[26,20],[44,31],[64,33],[84,28],[98,22],[106,20],[122,20],[130,28],[138,52],[146,66],[158,62],[172,56],[190,50],[208,44],[226,42],[246,48],[266,54],[286,52],[300,40],[308,18]];
 var L=pts.map(function(p){return [CX-p[1],p[0]];}), R=pts.slice().reverse().map(function(p){return [CX+p[1],p[0]];});
 var all=L.concat(R), d='M'+f1(all[0][0])+' '+f1(all[0][1]);
 for(var i=1;i<all.length-1;i++){var mx=(all[i][0]+all[i+1][0])/2, my=(all[i][1]+all[i+1][1])/2; d+='Q'+f1(all[i][0])+' '+f1(all[i][1])+' '+f1(mx)+' '+f1(my);}
 return d+'L'+f1(all[all.length-1][0])+' '+f1(all[all.length-1][1])+'Z';}
function slab(P,s,o){
 var sp=SLAB[s], nodes=RL.seatNodes(P,s), n=nodes.length, cols=sp.c, rows=Math.ceil(n/cols), us=RL.seatDisp(P,s), out='';
 var w=(cols-1)*DX, h=(rows-1)*DY, x0=CX-w/2, y0=sp.y-h/2;
 /* plate, well, umbra, the way a cluster draws them, stretched to the slab */
 var pw=w+22, ph=h+20;
 out+='<g transform="translate('+CX+' '+f1(sp.y)+') scale('+f1(pw*.95/23)+' '+f1(ph*1.6/23)+')"><circle r="23" fill="url(#umbra)" opacity="'+RL.clamp(us*.8,0,.85).toFixed(2)+'"/></g>';
 out+='<rect x="'+f1(CX-pw/2)+'" y="'+f1(sp.y-ph/2)+'" width="'+f1(pw)+'" height="'+f1(ph)+'" rx="'+f1(ph/2)+'" fill="url(#plate)" stroke="rgba(255,255,255,.08)"/>';
 out+='<g transform="translate('+CX+' '+f1(sp.y)+') scale('+f1(pw/46)+' '+f1(ph/46)+')"><circle r="23" fill="url(#well'+s+')" opacity="'+(.95-.45*us).toFixed(2)+'" class="pulse" style="--bd:'+RL.seatDelay(P,s)+'"/><circle r="21" fill="url(#umbra)" opacity="'+RL.clamp(us*1.08,0,.98).toFixed(2)+'"/></g>';
 /* the lattice: a hairline between neighbours */
 var pos=[]; nodes.forEach(function(nd,k){var r=Math.floor(k/cols), c=k%cols; pos.push([x0+c*DX+(r%2?DX/2*0:0),y0+r*DY]);});
 var lat='';nodes.forEach(function(nd,k){var r=Math.floor(k/cols), c=k%cols;
  if(c<cols-1&&k+1<n)lat+='M'+f1(pos[k][0])+' '+f1(pos[k][1])+'L'+f1(pos[k+1][0])+' '+f1(pos[k+1][1]);
  if(k+cols<n)lat+='M'+f1(pos[k][0])+' '+f1(pos[k][1])+'L'+f1(pos[k+cols][0])+' '+f1(pos[k+cols][1]);});
 out+='<path d="'+lat+'" stroke="'+SEAT[s]+'" stroke-opacity="'+(.3*(1-us)+.1).toFixed(2)+'" stroke-width=".7" fill="none"/>';
 nodes.forEach(function(nd,k){out+=RL.dot(nd,s,pos[k][0],pos[k][1],.8,true);});
 return out;}
function figure(P,o){
 o=o||{}; var dk=RL.darkest(P), lt=RL.lightest(P), out='';
 /* aura behind everything: radiance */
 out+='<defs><radialGradient id="aura"><stop offset="0" stop-color="'+ELEM.rad+'" stop-opacity=".5"/><stop offset=".6" stop-color="'+ELEM.rad+'" stop-opacity=".12"/><stop offset="1" stop-color="'+ELEM.rad+'" stop-opacity="0"/></radialGradient></defs>';
 out+='<ellipse cx="'+CX+'" cy="170" rx="'+f1(70+80*P.rad)+'" ry="'+f1(100+70*P.rad)+'" fill="url(#aura)" opacity="'+(.2+.8*P.rad).toFixed(2)+'" class="pulse"/>';
 out+='<path d="'+silhouette()+'" fill="rgba(255,255,255,.035)" stroke="rgba(239,237,232,.38)" stroke-width="1.3" stroke-linejoin="round"/>';
 out+='<path d="M'+CX+' 16V'+(VH-16)+'" stroke="rgba(255,255,255,.12)" stroke-dasharray="1 4"/>';
 /* the four outside the body */
 [-6,6].forEach(function(dx){out+='<circle cx="'+(CX+dx)+'" cy="6" r="2.3" fill="none" stroke="rgba(255,255,255,.4)"/><circle cx="'+(CX+dx)+'" cy="'+(VH-8)+'" r="2.3" fill="none" stroke="rgba(255,255,255,.4)"/>';});
 for(var s=0;s<7;s++)out+=slab(P,s,o);
 /* CQ, the halo of laws round the head */
 out+=RL.lawRing(P,CX,66,51,{tmax:4.6,tmin:1,sectors:false,gap:.05});
 if(o.mini)return out;
 /* marks for the darkest and the lightest, on the body */
 [[dk,'darkest','#D4736D'],[lt,'lightest','#7EB8D4']].forEach(function(m){var sp=SLAB[m[0]], nodes=RL.seatNodes(P,m[0]).length, w=(sp.c-1)*DX/2+14;
  out+='<text x="'+f1(m[0]>=5?192:CX+w+4)+'" y="'+f1(sp.y+3.5)+'" font-size="10.5" font-weight="700" fill="'+m[2]+'">'+m[1]+'</text>';
  out+='<rect x="'+f1(CX-w)+'" y="'+f1(sp.y-(Math.ceil(nodes/sp.c)-1)*DY/2-10)+'" width="'+f1(2*w)+'" height="'+f1((Math.ceil(nodes/sp.c)-1)*DY+20)+'" rx="10" fill="none" stroke="'+m[2]+'" stroke-width="1.1" stroke-dasharray="3 3" opacity=".85"/>';});
 /* the readings, on the body's own seats, each with its name and a leader to the body */
 function lead(x1,y1,x2,y2){return '<path d="M'+x1+' '+y1+'L'+x2+' '+y2+'" stroke="rgba(255,255,255,.18)" stroke-dasharray="1 3"/>';}
 function put(glyph,x,y,nm,val,anchor,tx,tyoff){return glyph+'<text x="'+tx+'" y="'+(y+tyoff)+'" text-anchor="'+anchor+'" font-size="11.5" font-weight="600" fill="#EFEDE8">'+nm+'</text><text x="'+tx+'" y="'+(y+tyoff+13)+'" text-anchor="'+anchor+'" font-size="11" fill="#94908A" font-weight="500">'+val+'</text>';}
 out+=lead(66,86,CX-36,86)+put(RL.iris(P,38,86,34),38,86,'Awareness',P.Y.toFixed(2),'middle',38,32);
 out+=lead(CX+66,150,200,150)+put(RL.sun(P,226,140,42),226,140,'Radiance',P.rad.toFixed(2),'middle',226,36);
 out+=lead(CX+48,214,200,214)+put(RL.arrow(P,226,216,34),226,216,'Will',P.Z.toFixed(2),'middle',226,34);
 out+=lead(66,248,CX-44,246)+put(RL.vessel(P,38,244,34),38,244,'Vitality',P.X.toFixed(2),'middle',38,32);
 return out;}

/* the four readings on the body are real buttons, 44 square, laid over their forms */
function hit(P,sz,H,k){
 var sx=sz/VW*k, sy=H/VH, ox=(sz-VW*sx)/2, items=[['Awareness',38,86,'Awareness '+P.Y.toFixed(2)],['Radiance',226,140,'Radiance '+P.rad.toFixed(2)],['Will',226,216,'Will '+P.Z.toFixed(2)],['Vitality',38,244,'Vitality '+P.X.toFixed(2)]];
 return items.map(function(it){var x=ox+it[1]*sx, y=it[2]*sy; return '<button type="button" class="Dhit" style="left:'+(x-22).toFixed(1)+'px;top:'+(y-22).toFixed(1)+'px" aria-label="'+it[3]+'" title="'+it[3]+'"></button>';}).join('');}
var BTN='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M9.5 4.5v15M13.5 9.5l3 2.5-3 2.5"/></svg>';
window.OPT={dials:'arc',
 dock:function(P,W,phone){
  var sz=phone?W:W, k=phone?1:.9, fl=RL.band(P,W,phone?70:50,{lw:2.8}), H=Math.round(VH*sz/VW*k), FW=Math.round(sz*k);
  return '<div class="D" style="width:'+W+'px">'
   +'<button type="button" class="Dbar" title="CQ is coherence, the halo of laws round the head. DQ is decoherence, the fog over the body, and the seven marks across the bar are its seats. The line is how far the person oscillates." aria-label="CQ '+Math.round(P.CQ)+' percent, DQ '+Math.round(P.DQ)+' percent">'+RL.cqdqBar(P,W,48)+'</button>'
   +'<div class="Dfig" style="margin-top:2px;position:relative;width:'+sz+'px;height:'+H+'px">'+svg(FW,H,figure(P),'fig','viewBox="0 0 '+VW+' '+VH+'" role="img" aria-label="A standing figure made of the 112 addresses, seven seats from the root to the crown. Dark where charge is held."').replace('viewBox="0 0 '+FW+' '+H+'" ','').replace('<svg class="fig"','<svg style="margin:0 auto" class="fig"')+hit(P,sz,H,k)+'</div>'
   +'<div class="Dfl"><div class="Dfh"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M12 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M18 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8"/></svg><b>Flow</b><span class="sec-n">'+P.flow.toFixed(2)+'</span></div>'+fl.html+'</div></div>';},
 closed:function(P){
  var h='<button type="button" class="Cbtn" aria-label="Open the left column" title="Open the left column">'+BTN+'</button><div style="position:absolute;left:0;right:0;top:60px">';
  h+='<div style="margin:0 4px;width:50px">'+svg(50,Math.round(50*VH/VW),figure(P,{mini:true}),'','viewBox="0 0 '+VW+' '+VH+'"').replace('viewBox="0 0 50 '+Math.round(50*VH/VW)+'" ','')+'</div>';
  h+='<div style="display:flex;justify-content:center;margin:12px 0 6px">'+RL.cqdqMini(P,70,8,true)+'</div>';
  h+='<div class="sec-n" style="text-align:center;line-height:1.25"><span style="color:var(--ink);font-weight:600">'+Math.round(P.CQ)+'%</span><br>'+Math.round(P.DQ)+'%</div>';
  var f2=[RL.vessel(P,0,2,26),RL.iris(P,0,0,28),RL.arrow(P,0,2,26),RL.sun(P,0,0,34)];
  h+=svg(58,4*40+8,f2.map(function(g,i){return '<g transform="translate(29 '+(26+i*40)+')">'+g+'</g>';}).join(''));
  var fl=RL.band(P,170,38,{lw:2.2,pad:4,bgop:.1});
  h+='<div style="position:relative;height:170px;margin-top:6px"><div style="position:absolute;left:10px;top:170px;width:170px;height:38px;transform-origin:0 0;transform:rotate(-90deg)">'+fl.html+'</div></div></div>';
  return h;},
 phoneClosed:function(P){
  var fl=RL.band(P,100,36,{lw:2,pad:4,bgop:.1});
  var f=[RL.vessel(P,0,2,24),RL.iris(P,0,0,26),RL.arrow(P,0,2,24),RL.sun(P,0,0,30)];
  return '<div style="display:flex;align-items:center;gap:6px;height:64px;padding:0 4px 0 10px"><div style="width:36px">'+svg(36,44,figure(P,{mini:true}),'','viewBox="0 0 '+VW+' '+VH+'"').replace('viewBox="0 0 36 44" ','')+'</div>'
   +'<div style="width:70px">'+RL.cqdqMini(P,70,10,false)+'</div>'
   +svg(4*30,44,f.map(function(g,i){return '<g transform="translate('+(15+i*30)+' 22)">'+g+'</g>';}).join(''))
   +'<div style="width:86px">'+fl.html+'</div><span style="flex:1"></span>'
   +'<button type="button" class="Cbtn" style="position:static" aria-label="Open the left column"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10l5 5 5-5"/></svg></button></div>';}
};
var st=document.createElement('style');
st.textContent='.Dhit{position:absolute;width:44px;height:44px;border-radius:50%}.Dhit:hover,.Dhit:focus-visible{background:rgba(255,255,255,.07)}.Dbar{display:block;width:100%;border-radius:9px}.Dfl{margin-top:4px}.Dfh{display:flex;align-items:center;gap:8px;height:24px;color:var(--mid)}.Dfh b{font-size:13.5px;font-weight:600;color:var(--ink)}'
 +'.Dfl>svg{border-radius:var(--r-xs);background:rgba(128,128,128,.10);box-shadow:inset 0 0 0 1px var(--edge)}'
 +'.Cbtn{position:absolute;left:7px;top:7px;width:44px;height:44px;display:grid;place-items:center;color:var(--mid);border-radius:8px}.Cbtn:hover{background:rgba(255,255,255,.06)}';
document.head.appendChild(st);
window.mountOption(window.OPT);
})();
