/* Matrix redesign 3, Loom. The grid is kept: nineteen domain threads down, nine fetter threads across.
   A node is a ring whose size is the charge held in that cell; it plucks both of its threads.
   Reads the 9 by 19 cell table (p.sq9, p.cnt), S.charge, DOMAIN, S.doms, AFFIN. */
(function(){
const U=MGU,S=U.S,clamp=U.clamp,lerp=U.lerp,ent=U.ent,LAND=U.LAND,rgba=U.rgba,TAU=U.TAU,BREATH=U.BREATH,txt=U.txt,C=U.C;
const ABBR=['Fear','Ang','Sha','Dis','Apa','Sho','Sad','Sur','Ant'];
const RG=[[0,4],[5,9],[10,14],[15,18]];
function lay(w,h,rail){const compact=w<420&&!rail;
 const L=rail?44:(compact?80:140),R=rail?10:(compact?12:40),T=rail?42:(compact?52:72),B=rail?8:(compact?66:62);
 return {compact:compact,rail:rail,L:L,R:R,T:T,B:B,gw:w-L-R,cw:(w-L-R)/19,rh:(h-T-B)/9,fs:rail?9:(compact?10.5:12.5)};}
const xc=(Y,c)=>Y.L+(c+.5)*Y.cw, yr=(Y,r)=>Y.T+(r+.5)*Y.rh;
const ph=(r,c)=>r*1.9+c*.7;
/* a pluck: each cell displaces the thread through it, localised, at the Field's 4.2 s */
function dispH(Y,r,x,t,k){let s=0;const i0=clamp(Math.floor((x-Y.L)/Y.cw)-1,0,18),i1=clamp(i0+3,0,18);
 for(let c=i0;c<=i1;c++){const d=(x-xc(Y,c))/(Y.cw*.55);if(d>2.2||d<-2.2)continue;
  s+=S.D[r][c]*Math.exp(-d*d)*Math.sin(TAU*t/BREATH+ph(r,c));}
 return s*Y.rh*.46*k;}
function dispV(Y,c,y,t,k){let s=0;const i0=clamp(Math.floor((y-Y.T)/Y.rh)-1,0,8),i1=clamp(i0+3,0,8);
 for(let r=i0;r<=i1;r++){const d=(y-yr(Y,r))/(Y.rh*.55);if(d>2.2||d<-2.2)continue;
  s+=S.D[r][c]*Math.exp(-d*d)*Math.sin(TAU*t/BREATH+ph(r,c)+1.57);}
 return s*Y.cw*.42*k;}
function draw(ctx,w,h,t,S,v){
 const Y=lay(w,h,!!v.rail),p=S.p,k=ent(t,.35,.5),step=Y.rail?5:4,breath=Math.sin(TAU*t/BREATH);
 const gx1=Y.L+Y.gw,gy1=Y.T+9*Y.rh;
 /* the unstrung grid is always there: dynamic from frame one means the loom stands before it is plucked */
 ctx.lineWidth=1;ctx.strokeStyle='rgba(255,255,255,.05)';ctx.beginPath();
 for(let r=0;r<9;r++){ctx.moveTo(Y.L,yr(Y,r));ctx.lineTo(gx1,yr(Y,r));}
 for(let c=0;c<19;c++){ctx.moveTo(xc(Y,c),Y.T);ctx.lineTo(xc(Y,c),gy1);}ctx.stroke();
 /* top register */
 const ty=Y.T-(Y.rail?20:30);
 RG.forEach((g,i)=>{const e=ent(t,.02+i*.07,.3),x0=Y.L+g[0]*Y.cw+2,x1=Y.L+(g[1]+1)*Y.cw-2,rn=U.ROOTS[i];
  ctx.strokeStyle=U.ROOTC[rn];ctx.lineWidth=2.4;ctx.lineCap='round';ctx.globalAlpha=e;ctx.beginPath();ctx.moveTo(x0,ty);ctx.lineTo(lerp(x0,x1,e),ty);ctx.stroke();
  txt(ctx,rn,x0,ty-9,Y.rail?8.5:(Y.compact?9.5:11),U.mix(U.ROOTC[rn],'#EFEDE8',.35),'left',500);ctx.globalAlpha=1;});
 let hc=-1,hr=-1;if(S.hover&&S.hover.view===v){hc=clamp(Math.floor((S.hover.x-Y.L)/Y.cw),0,18);hr=clamp(Math.floor((S.hover.y-Y.T)/Y.rh),0,8);}
 /* fetter threads, across */
 for(let r=0;r<9;r++){const e=ent(t,.04+.06*r,.5),xe=Y.L+Y.gw*e;
  ctx.strokeStyle=rgba(U.FCOL[r],(r===hr?.95:.22+.45*S.CH[r])*Math.min(1,e*3));ctx.lineWidth=r===hr?1.6:1.15;ctx.beginPath();
  for(let x=Y.L;x<=xe+.1;x+=step){const y=yr(Y,r)+dispH(Y,r,x,t,k);x===Y.L?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();
  const cy=yr(Y,r),ch=p.charge[U.FNAME[r]]||0;
  U.ringArc(ctx,Y.rail?9:16,cy,Y.rail?4.2:6,S.CH[r]*e,U.FCOL[r],Y.rail?1.6:2);
  txt(ctx,Y.rail?ABBR[r]:U.FNAME[r],Y.rail?18:29,cy,Y.fs,r===hr?C.ink:C.mid,'left',r===hr?500:400);
  if(!Y.rail&&!Y.compact)txt(ctx,ch>0?ch.toFixed(1):'-',Y.L-8,cy,Y.fs-1,ch>0?U.mix(U.FCOL[r],'#EFEDE8',.35):C.dim,'right',500);}
 /* domain threads, down */
 for(let c=0;c<19;c++){const e=ent(t,.1+.035*c,.5),ye=Y.T+9*Y.rh*e,on=p.doms.indexOf(c)>=0;
  ctx.strokeStyle=rgba(U.DCOL[c],(c===hc?.95:(on?.8:.16+.38*S.DOM[c]))*Math.min(1,e*3));ctx.lineWidth=(on||c===hc)?1.6:1.1;ctx.beginPath();
  for(let y=Y.T;y<=ye+.1;y+=step){const x=xc(Y,c)+dispV(Y,c,y,t,k);y===Y.T?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();
  ctx.strokeStyle=rgba(U.DCOL[c],on?1:.45);ctx.lineWidth=on?1.6:1;ctx.beginPath();ctx.moveTo(xc(Y,c),ty+5);ctx.lineTo(xc(Y,c),ty+(on?13:9));ctx.stroke();
  if(on&&!Y.rail)txt(ctx,U.DOMAINS[c].nm,xc(Y,c),ty+23,Y.compact?9.5:10.5,U.mix(U.DCOL[c],'#EFEDE8',.4),'center',500);}
 /* light on the threads, quicker where there is more to carry */
 const bx=[],by=[];
 for(let r=0;r<9;r++){bx[r]=-1;if(S.CH[r]>.03){const Pr=BREATH*(1.7-S.CH[r]*.9),u=((t/Pr+r*.29)%1+1)%1;bx[r]=Y.L+Y.gw*u;
  for(let q=0;q<7;q++){const x=bx[r]-q*(Y.rail?3:5);if(x<Y.L)continue;ctx.fillStyle='rgba(239,237,232,'+(.85*(1-q/7)*k).toFixed(3)+')';
   ctx.beginPath();ctx.arc(x,yr(Y,r)+dispH(Y,r,x,t,k),(Y.rail?1.4:2)*(1-q/10),0,TAU);ctx.fill();}}}
 for(let c=0;c<19;c++){by[c]=-1;if(S.DOM[c]>.15){const Pc=BREATH*(1.8-S.DOM[c]*.9)*1.5,u=((t/Pc+c*.17)%1+1)%1;by[c]=Y.T+9*Y.rh*u;
  for(let q=0;q<5;q++){const y=by[c]-q*(Y.rail?3:5);if(y<Y.T)continue;ctx.fillStyle=rgba(U.DCOL[c],(.9*(1-q/5)*k).toFixed(3));
   ctx.beginPath();ctx.arc(xc(Y,c)+dispV(Y,c,y,t,k),y,(Y.rail?1.2:1.7)*(1-q/8),0,TAU);ctx.fill();}}}
 /* the nodes */
 const rmax=Math.min(Y.cw,Y.rh)*.38;
 for(let r=0;r<9;r++)for(let c=0;c<19;c++){const val=S.D[r][c],has=p.cnt[r][c]>0,e=ent(t,.22+.03*r+.02*c,.3,LAND);
  const x=xc(Y,c)+dispV(Y,c,yr(Y,r),t,k),y=yr(Y,r)+dispH(Y,r,xc(Y,c),t,k);
  const lit=Math.max(bx[r]>0?Math.exp(-Math.pow((xc(Y,c)-bx[r])/(Y.cw*.8),2)):0,by[c]>0?Math.exp(-Math.pow((yr(Y,r)-by[c])/(Y.rh*.8),2)):0)*(has?1:0);
  if(has&&val>.012){const rad=(1.5+val*rmax)*e*(1+.22*lit);
   ctx.strokeStyle=rgba(U.DCOL[c],clamp(.38+.58*val+.3*lit,0,1));ctx.lineWidth=Y.rail?1:1.3;ctx.beginPath();ctx.arc(x,y,Math.max(.1,rad),0,TAU);ctx.stroke();}
  else{ctx.fillStyle='rgba(239,237,232,.16)';ctx.beginPath();ctx.arc(x,y,Y.rail?.6:.9,0,TAU);ctx.fill();}
  if(U.isAff(r,c)){const inUse=p.aff.indexOf(U.DROOT[c])>=0;if(!(Y.rail&&!(inUse&&has))){
   ctx.strokeStyle=rgba(C.gold,(has?(inUse?.95:.55):.2)*Math.min(1,e));ctx.lineWidth=1;
   ctx.beginPath();ctx.arc(x,y,Math.max(.1,(has?(1.5+val*rmax):1.5)*e+(Y.rail?1.8:2.6)+(inUse&&has?.7*breath:0)),0,TAU);ctx.stroke();}}
  if(r===hr&&c===hc){ctx.strokeStyle='#EFEDE8';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(x,y,rmax+5,0,TAU);ctx.stroke();}}
 if(!Y.rail&&Object.values(p.charge).every(x=>!x))txt(ctx,'No charge entered. The loom stands unstrung and still sways.',Y.L+Y.gw/2,Y.T+4.5*Y.rh,Y.fs+1,C.dim,'center');
}
function pointer(x,y,v,S){const Y=lay(v.w,v.h,!!v.rail),p=S.p;
 const c=clamp(Math.floor((x-Y.L)/Y.cw),0,18),r=clamp(Math.floor((y-Y.T)/Y.rh),0,8),n=p.cnt[r][c],sq=p.sq9[r][c];
 return '<b>'+U.DOMAINS[c].nm+'</b> ('+U.DROOT[c]+') x <b>'+U.FNAME[r]+'</b>: '+n+' address'+(n===1?'':'es')+', SQ <b>'+sq.toFixed(1)+'</b>'+(U.isAff(r,c)?', <b>1.3x pair</b> for '+U.DROOT[c]:'');}
function idle(S){const p=S.p,n=p.cnt.reduce((a,r)=>a+r.filter(x=>x>0).length,0);return '<b>'+p.nm+'</b>: '+n+' of 171 cells hold addresses. Press or hover a ring to read it.';}
MGC.register({draw:draw,pointer:pointer,idle:idle});
})();
