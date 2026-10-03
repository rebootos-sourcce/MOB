/* Matrix redesign 1, Ridgeline. Nine fetter bands, nineteen domain columns, no cells.
   Reads: p.sq9 (mean SQ of the addresses in each domain x fetter cell), p.cnt, p.charge,
   p.domain (DOMAIN reach), p.doms, AFFIN. The band is the Flow sine band's cousin: a carrier
   wave whose height is the data. */
(function(){
const U=MGU,S=U.S,clamp=U.clamp,lerp=U.lerp,ent=U.ent,LAND=U.LAND,rgba=U.rgba,TAU=U.TAU,BREATH=U.BREATH,txt=U.txt,C=U.C;
const ABBR=['Fear','Ang','Sha','Dis','Apa','Sho','Sad','Sur','Ant'];
const RG=[[0,4],[5,9],[10,14],[15,18]];
function lay(w,h,rail){const compact=w<420&&!rail;
 const L=rail?46:(compact?78:130),R=rail?26:(compact?36:66),T=rail?42:(compact?46:58),B=rail?8:(compact?66:60);
 const gw=w-L-R,cw=gw/19,rh=(h-T-B)/9;
 return {compact:compact,rail:rail,L:L,R:R,T:T,B:B,gw:gw,cw:cw,rh:rh,amax:rh*(rail?2.3:2.25),fs:rail?9:(compact?10.5:12.5),lam:rail?70:(compact?95:160)};}
const xc=(Y,c)=>Y.L+(c+.5)*Y.cw;
function env(Y,r,x){const u=(x-Y.L)/Y.cw-.5,i=Math.floor(u),f=u-i,s=f*f*(3-2*f);
 const a=S.D[r][clamp(i,0,18)],b=S.D[r][clamp(i+1,0,18)];return lerp(a,b,s);}
function ridgeY(Y,r,x,t,amp){
 const yb=Y.T+(r+1)*Y.rh,f=(1/BREATH)*(.55+.9*S.CH[r]),ph=r*1.3;
 const s=Math.sin(TAU*(x/Y.lam-t*f)+ph);
 const rest=1.15*(.5+.5*Math.sin(TAU*(x/(Y.lam*1.7)-t/BREATH*.8)+ph*1.7))*(Y.rail?.8:1);
 return yb-env(Y,r,x)*amp*(.6+.4*s)-rest;}
function draw(ctx,w,h,t,S,v){
 const Y=lay(w,h,!!v.rail),p=S.p,breath=Math.sin(TAU*t/BREATH);
 /* the colour registers: one gradient across the columns, root by root */
 const g1=ctx.createLinearGradient(Y.L,0,Y.L+Y.gw,0),g2=ctx.createLinearGradient(Y.L,0,Y.L+Y.gw,0);
 for(let c=0;c<19;c++){g1.addColorStop((c+.5)/19,rgba(U.DCOL[c],.95));g2.addColorStop((c+.5)/19,rgba(U.DCOL[c],.2));}
 /* top register: four roots, nineteen ticks, the chosen domain lit */
 const ty=Y.T-(Y.rail?20:28);
 RG.forEach((g,i)=>{const e=ent(t,.02+i*.07,.3),x0=Y.L+g[0]*Y.cw+2,x1=Y.L+(g[1]+1)*Y.cw-2,rn=U.ROOTS[i];
  ctx.globalAlpha=e;ctx.strokeStyle=U.ROOTC[rn];ctx.lineWidth=2.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,ty);ctx.lineTo(lerp(x0,x1,e),ty);ctx.stroke();
  txt(ctx,rn,x0,ty-9,Y.rail?8.5:(Y.compact?9.5:11),U.mix(U.ROOTC[rn],'#EFEDE8',.35),'left',500);ctx.globalAlpha=1;});
 for(let c=0;c<19;c++){const on=p.doms.indexOf(c)>=0;ctx.strokeStyle=rgba(U.DCOL[c],on?1:.45);ctx.lineWidth=on?1.6:1;
  ctx.beginPath();ctx.moveTo(xc(Y,c),ty+5);ctx.lineTo(xc(Y,c),ty+(on?13:9));ctx.stroke();
  if(on){ctx.strokeStyle=rgba(U.DCOL[c],.28);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(xc(Y,c),ty+13);ctx.lineTo(xc(Y,c),Y.T+9*Y.rh);ctx.stroke();
   if(!Y.rail)txt(ctx,U.DOMAINS[c].nm,xc(Y,c),ty+23,Y.compact?9.5:10.5,U.mix(U.DCOL[c],'#EFEDE8',.4),'center',500);}}
 /* hover scrub */
 let hc=-1,hr=-1;if(S.hover&&S.hover.view===v){hc=clamp(Math.floor((S.hover.x-Y.L)/Y.cw),0,18);hr=clamp(Math.floor((S.hover.y-Y.T)/Y.rh),0,8);
  ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(xc(Y,hc),ty+14);ctx.lineTo(xc(Y,hc),Y.T+9*Y.rh);ctx.stroke();}
 /* bands, top to bottom */
 for(let r=0;r<9;r++){
  const yb=Y.T+(r+1)*Y.rh,e=ent(t,.06+.07*r,.46,LAND),amp=Y.amax*e;
  ctx.strokeStyle='rgba(255,255,255,.055)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(Y.L,yb+.5);ctx.lineTo(Y.L+Y.gw,yb+.5);ctx.stroke();
  const pts=[];for(let x=Y.L;x<=Y.L+Y.gw+.1;x+=3)pts.push([x,ridgeY(Y,r,x,t,amp)]);
  ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));
  ctx.lineTo(Y.L+Y.gw,yb);ctx.lineTo(Y.L,yb);ctx.closePath();ctx.fillStyle=g2;ctx.fill();
  ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));
  ctx.lineJoin='round';ctx.strokeStyle=g1;ctx.globalAlpha=.1;ctx.lineWidth=Y.rail?3.5:5;ctx.stroke();
  ctx.globalAlpha=r===hr?1:.92;ctx.lineWidth=r===hr?2:(Y.rail?1.1:1.5);ctx.stroke();ctx.globalAlpha=1;
  /* a bead rides each band; the more charge, the quicker */
  if(S.CH[r]>.03&&!U.REDUCED||(U.REDUCED&&S.CH[r]>.03)){
   const Pb=BREATH*(1.9-S.CH[r]*1.1),u=((t/Pb+r*.37)%1+1)%1;
   for(let k=0;k<7;k++){const x=Y.L+Y.gw*u-k*(Y.rail?3:5);if(x<Y.L)continue;
    ctx.fillStyle='rgba(239,237,232,'+(.85*(1-k/7)*e).toFixed(3)+')';ctx.beginPath();ctx.arc(x,ridgeY(Y,r,x,t,amp),(Y.rail?1.5:2.1)*(1-k/10),0,TAU);ctx.fill();}}
  /* the 1.3x pairs, as gold rings riding the band at their domain */
  for(let c=0;c<19;c++){if(!U.isAff(r,c))continue;
   const inUse=p.aff.indexOf(U.DROOT[c])>=0,has=p.cnt[r][c]>0;
   if(Y.rail&&!(inUse&&has))continue;
   const pop=ent(t,.06+.07*r+.28+c*.004,.26,LAND);
   const rad=(Y.rail?2.3:(Y.compact?2.6:3.4))*pop+(inUse&&has?.8*breath:0);
   ctx.strokeStyle=rgba(C.gold,(has?(inUse?.95:.6):.22)*Math.min(1,pop));ctx.lineWidth=1.1;
   const x=xc(Y,c);ctx.beginPath();ctx.arc(x,ridgeY(Y,r,x,t,amp),Math.max(.1,rad),0,TAU);ctx.stroke();}
  /* left: the ring carrying the fetter's own number, and its name */
  const cy=yb-(Y.rail?6:7),ch=p.charge[U.FNAME[r]]||0,lit=r===hr;
  U.ringArc(ctx,Y.rail?9:16,cy,Y.rail?4.2:6,S.CH[r]*e,U.FCOL[r],Y.rail?1.6:2);
  txt(ctx,Y.rail?ABBR[r]:U.FNAME[r],Y.rail?18:29,cy,Y.fs,lit?C.ink:C.mid,'left',lit?500:400);
  txt(ctx,ch>0?ch.toFixed(1):'-',Y.L+Y.gw+(Y.rail?6:10),cy,Y.fs,ch>0?U.mix(U.FCOL[r],'#EFEDE8',.35):C.dim,'left',500);
  if(r===hr&&hc>=0){const x=xc(Y,hc);ctx.strokeStyle='#EFEDE8';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(x,ridgeY(Y,r,x,t,amp),4.6,0,TAU);ctx.stroke();}}
 if(!Y.rail){const none=p.charge&&Object.values(p.charge).every(x=>!x);
  if(none)txt(ctx,'No charge entered. The bands rest as lines and still breathe.',Y.L+Y.gw/2,Y.T+4.5*Y.rh,Y.fs+1,C.dim,'center');}
}
function pointer(x,y,v,S){const Y=lay(v.w,v.h,!!v.rail),p=S.p;
 const c=clamp(Math.floor((x-Y.L)/Y.cw),0,18),r=clamp(Math.floor((y-Y.T)/Y.rh),0,8);
 const n=p.cnt[r][c],sq=p.sq9[r][c],su=p.susc[r][c];
 return '<b>'+U.DOMAINS[c].nm+'</b> ('+U.DROOT[c]+') x <b>'+U.FNAME[r]+'</b>: '+n+' address'+(n===1?'':'es')+', SQ <b>'+sq.toFixed(1)+'</b>'
  +(U.isAff(r,c)?', <b>1.3x pair</b> for '+U.DROOT[c]:'');}
function idle(S){const p=S.p;const a=Object.keys(p.charge).map(k=>[k,p.charge[k]]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,3);
 if(!a.length)return '<b>'+p.nm+'</b>: no charge entered. Nothing climbs; the lines still breathe.';
 return '<b>'+p.nm+'</b>: loudest '+a.map(x=>x[0]+' '+x[1].toFixed(1)).join(', ')+'. Press or hover a band to read a domain.';}
MGC.register({draw:draw,pointer:pointer,idle:idle});
})();
