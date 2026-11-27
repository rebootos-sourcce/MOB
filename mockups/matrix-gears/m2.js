/* Matrix redesign 2, Polar. The 9 by 19 matrix on the Field's own circle.
   A domain is a sector of 2*PI/19 starting at the top, exactly floor(slot / (108/19)), so a cell is
   the arc the wheel already uses. Each of the 108 addresses is a bead at its real slot angle on its
   fetter's ring. Reads W[108] (slot, cf, sq), the cell table, DOMAIN, S.doms, AFFIN, CQ and DQ. */
(function(){
const U=MGU,S=U.S,clamp=U.clamp,lerp=U.lerp,ent=U.ent,LAND=U.LAND,rgba=U.rgba,TAU=U.TAU,BREATH=U.BREATH,txt=U.txt,C=U.C;
const RG=[[0,4],[5,9],[10,14],[15,18]],A19=TAU/19;
function lay(w,h,rail){const compact=w<420&&!rail,res=rail?0:44,m=rail?4:(compact?6:40);
 const cx=w/2,cy=(h-res)/2,Rmax=Math.min(w/2-m,(h-res)/2-m);
 const R0=Rmax*.27,R1=Rmax-(rail?11:(compact?15:26)),dr=(R1-R0)/9;
 return {compact:compact,rail:rail,cx:cx,cy:cy,Rmax:Rmax,R0:R0,R1:R1,dr:dr,wide:!rail&&!compact};}
const ringR=(Y,rw)=>Y.R0+(rw+.5)*Y.dr;
const wave=(Y,rw,th,t,v)=>Math.sin(3*th-TAU*t/BREATH+rw*.7)*(.25+v*Y.dr*.14)*(Y.rail?.7:1);
function arc(ctx,Y,r,a0,a1,rw,t,v,n){ctx.beginPath();
 for(let i=0;i<=n;i++){const th=lerp(a0,a1,i/n),rr=r+wave(Y,rw,th,t,v),x=Y.cx+Math.cos(th)*rr,y=Y.cy+Math.sin(th)*rr;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}}
function angDiff(a,b){let d=Math.abs(a-b)%TAU;return d>Math.PI?TAU-d:d;}
function draw(ctx,w,h,t,S,v){
 const Y=lay(w,h,!!v.rail),p=S.p,cx=Y.cx,cy=Y.cy,ths=-Math.PI/2+TAU*(t/14);
 /* the sweep: a light that passes over every sector once in 14 s */
 if(ctx.createConicGradient&&Y.R1>20){const g=ctx.createConicGradient(ths-1.1,cx,cy);
  g.addColorStop(0,'rgba(126,184,212,0)');g.addColorStop(1.1/TAU,'rgba(126,184,212,.11)');g.addColorStop(1.1/TAU+.002,'rgba(126,184,212,0)');g.addColorStop(1,'rgba(126,184,212,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,Y.R1+Y.dr*.5,0,TAU);ctx.arc(cx,cy,Y.R0-Y.dr*.2,0,TAU,true);ctx.fill('evenodd');}
 /* the chosen domains: a faint wedge down through every ring */
 p.doms.forEach(c=>{ctx.fillStyle=rgba(U.DCOL[c],.07);ctx.beginPath();ctx.arc(cx,cy,Y.R1+Y.dr*.5,-Math.PI/2+c*A19,-Math.PI/2+(c+1)*A19);ctx.arc(cx,cy,Y.R0-Y.dr*.2,-Math.PI/2+(c+1)*A19,-Math.PI/2+c*A19,true);ctx.closePath();ctx.fill();});
 /* ring guides and sector boundaries: the geometry is visible before any data is */
 ctx.lineWidth=1;ctx.setLineDash([2,5]);
 for(let rw=0;rw<9;rw++){ctx.strokeStyle='rgba(255,255,255,.075)';ctx.beginPath();ctx.arc(cx,cy,ringR(Y,rw),0,TAU);ctx.stroke();}
 ctx.setLineDash([]);ctx.strokeStyle='rgba(255,255,255,.045)';
 for(let c=0;c<19;c++){const a=-Math.PI/2+c*A19;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*(Y.R0-Y.dr*.2),cy+Math.sin(a)*(Y.R0-Y.dr*.2));ctx.lineTo(cx+Math.cos(a)*(Y.R1+Y.dr*.5),cy+Math.sin(a)*(Y.R1+Y.dr*.5));ctx.stroke();}
 /* the domain band, thicker where the blueprint reaches further, and the four roots inside it */
 const Ro=Y.Rmax-(Y.rail?2:3);
 for(let c=0;c<19;c++){const e=ent(t,.1+c*.015,.4),a0=-Math.PI/2+c*A19+.012,a1=-Math.PI/2+(c+1)*A19-.012;
  ctx.strokeStyle=rgba(U.DCOL[c],.9);ctx.lineWidth=(Y.rail?1.2:2)+S.DOM[c]*(Y.rail?2.2:4.5)*e;ctx.lineCap='butt';
  ctx.beginPath();ctx.arc(cx,cy,Ro,a0,lerp(a0,a1,e));ctx.stroke();
  if(Y.wide){const am=(a0+a1)/2,lx=cx+Math.cos(am)*(Y.Rmax+16),ly=cy+Math.sin(am)*(Y.Rmax+16);
   txt(ctx,U.DOMAINS[c].nm,lx,ly,10.5,p.doms.indexOf(c)>=0?C.ink:C.dim,Math.abs(Math.cos(am))<.25?'center':(Math.cos(am)>0?'left':'right'),p.doms.indexOf(c)>=0?500:400);}}
 RG.forEach((g,i)=>{const e=ent(t,.05+i*.08,.4),a0=-Math.PI/2+g[0]*A19+.02,a1=-Math.PI/2+(g[1]+1)*A19-.02;
  ctx.strokeStyle=rgba(U.ROOTC[U.ROOTS[i]],.55);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(cx,cy,Ro-(Y.rail?5:9),a0,lerp(a0,a1,e));ctx.stroke();});
 /* the cells */
 let hc=-1,hr=-1;
 if(S.hover&&S.hover.view===v){const dx=S.hover.x-cx,dy=S.hover.y-cy,d=Math.hypot(dx,dy);
  hr=Math.floor((d-Y.R0)/Y.dr);if(hr>=0&&hr<9){const a=((Math.atan2(dy,dx)+Math.PI/2)%TAU+TAU)%TAU;hc=Math.min(18,Math.floor(a/A19));}else hr=-1;}
 ctx.lineCap='round';ctx.lineJoin='round';
 for(let rw=0;rw<9;rw++){const r=ringR(Y,rw);
  for(let c=0;c<19;c++){const val=S.D[rw][c],e=ent(t,.05*rw+.012*c+.04,.42,LAND),has=p.cnt[rw][c]>0;
   const a0=-Math.PI/2+c*A19+.02,a1=-Math.PI/2+(c+1)*A19-.02,am=(a0+a1)/2;
   const boost=has?Math.exp(-Math.pow(angDiff(am,((ths+Math.PI)%TAU)-Math.PI)/.5,2))*.4:0;
   if(has&&val*e>.01){
    ctx.strokeStyle=rgba(U.DCOL[c],clamp(.3+.62*val+boost,0,1));ctx.lineWidth=Math.max(.8,(1.1+val*Y.dr*.62)*e*(1+boost*.3));
    arc(ctx,Y,r,a0,a1,rw,t,val,Math.max(3,Math.ceil((a1-a0)/.05)));ctx.stroke();}
   if(U.isAff(rw,c)){const inUse=p.aff.indexOf(U.DROOT[c])>=0;
    if(!(Y.rail&&!(inUse&&has))){ctx.strokeStyle=rgba(C.gold,(has?(inUse?.9:.5):.16)*Math.min(1,e));ctx.lineWidth=1;ctx.lineCap='butt';
     ctx.beginPath();ctx.arc(cx,cy,r+Y.dr*.43,a0+.02,a1-.02);ctx.stroke();ctx.lineCap='round';}}
   if(rw===hr&&c===hc){ctx.strokeStyle='#EFEDE8';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(cx,cy,r,a0,a1);ctx.stroke();}}}
 /* the addresses: 108 beads at their real slot angles, one on each fetter's ring */
 for(let i=0;i<p.addr.length;i++){const a=p.addr[i],rw=U.FNAME.indexOf(a.cf);if(rw<0)continue;const c=Math.min(18,Math.floor(a.s/(108/19)));
  const th=-Math.PI/2+(a.s+.5)*TAU/108,e=ent(t,.05*rw+.012*c+.2,.3,LAND),vv=S.D[rw][c],rr=ringR(Y,rw)+wave(Y,rw,th,t,vv);
  if(a.sq>0.02){ctx.strokeStyle=rgba(U.FCOL[rw],.95);ctx.lineWidth=1;const R=(Y.rail?1:1.6)+Math.min(1,a.sq/10)*(Y.rail?1.2:2.2);
   ctx.beginPath();ctx.arc(cx+Math.cos(th)*rr,cy+Math.sin(th)*rr,Math.max(.1,R*e),0,TAU);ctx.stroke();}
  else{ctx.fillStyle='rgba(239,237,232,.2)';ctx.beginPath();ctx.arc(cx+Math.cos(th)*rr,cy+Math.sin(th)*rr,Y.rail?.6:.9,0,TAU);ctx.fill();}}
 /* the centre: CQ as the Field prints it, and DQ as the inner arc */
 const Rc=Y.R0-Y.dr*.5,ec=ent(t,.2,.5,LAND);
 U.ringArc(ctx,cx,cy,Rc,p.cq/100*ec,C.acc,Y.rail?2:3);
 if(Rc>26)U.ringArc(ctx,cx,cy,Rc-(Y.rail?5:8),p.dq/100*ec,'#D6524C',Y.rail?1.4:2);
 txt(ctx,String(Math.round(p.cq)),cx,cy-(Y.rail?1:2),Y.rail?11:(Y.compact?15:22),C.ink,'center',500);
 if(!Y.rail)txt(ctx,'CQ',cx,cy+(Y.compact?10:15),Y.compact?8.5:10,C.dim,'center');
}
function pointer(x,y,v,S){const Y=lay(v.w,v.h,!!v.rail),p=S.p,dx=x-Y.cx,dy=y-Y.cy,d=Math.hypot(dx,dy),rw=Math.floor((d-Y.R0)/Y.dr);
 if(rw<0||rw>8)return null;const a=((Math.atan2(dy,dx)+Math.PI/2)%TAU+TAU)%TAU,c=Math.min(18,Math.floor(a/A19));
 const n=p.cnt[rw][c],sq=p.sq9[rw][c];
 return '<b>'+U.DOMAINS[c].nm+'</b> ('+U.DROOT[c]+') x <b>'+U.FNAME[rw]+'</b>: '+n+' address'+(n===1?'':'es')+', SQ <b>'+sq.toFixed(1)+'</b>'+(U.isAff(rw,c)?', <b>1.3x pair</b> for '+U.DROOT[c]:'');}
function idle(S){const p=S.p;return '<b>'+p.nm+'</b>: CQ '+Math.round(p.cq)+', DQ '+Math.round(p.dq)+'. Rings run Fear (inside) to Anticipation (outside); hover a cell to read it.';}
MGC.register({draw:draw,pointer:pointer,idle:idle});
})();
