/* SYSTEM B, CONTOUR. The person is a stack of signal lines, each one lifted where the body is, the
   way a pulsar plot is drawn. A mask does not bend the body, it turns the person into the mask's own
   symbol: the silhouette field is blended from the person to the symbol by how loaded the mask is,
   so the lines flow from a figure into a seed under an arch, a row of copies, a star, a monolith.
   The leading patterns bend the person and stretch or sag the symbol. Colour runs along each line by
   pattern. The left menu's bars are sines, and these are sines too, which is why they can share a beat. */
const SYS_B={id:'b-contour',name:'Contour',noMaskPose:true,dimTo:.45,bg:'#0C0D12',N:{d:0,m:0,l:0},
 blurb:'The person is a stack of signal lines. A mask turns the person into its own symbol by how loaded it is, and the leading patterns stretch, sag or narrow the form. At zero load it is a calm figure.',
 init(sc){sc.mem.rows=sc.lineup?44:sc.small?54:70;sc.mem.ns=sc.lineup?84:sc.small?96:140;},
 /* the symbol for each mask, as distance fields, in figure units. [main, dim] */
 sym(sc,nm,x,y,t,w){
  const per=MASKS.find(q=>q.nm===nm).per,ph=(t/per)%1;
  /* the leading patterns bend the symbol: narrower, wider, taller, sagged */
  const sh=w.sh;const sx=1+.16*(sh[1]+sh[5]+sh[7])-.16*(sh[0]+sh[2]),sy=1+.12*(sh[1]+sh[8])-.14*(sh[4]+sh[6]+sh[2]);
  const dy=.06*(sh[4]+sh[6]+sh[2])-.05*sh[1];
  x=x/sx;y=(y-dy)/sy;
  if(nm==='Child'){const br=1+.03*Math.sin(Math.PI*2*ph);
   const body=sdEll(x,y,0,.6,.3*br,.31*br),head=sdEll(x,y,0,.22,.13*br,.14*br);
   const dm=Math.min(body,head);
   const R=Math.hypot(x,y-.42);const band=Math.abs(R-.98)-.085;const arch=Math.max(band,y-.18);
   return [dm,arch];}
  if(nm==='Preteen'){let dm=9;const sp=1-.26*sc.ts,xs=[-.92*sp,-.46*sp,0,.46*sp,.92*sp];
   xs.forEach((cx,i)=>{const c=i===2?1:0;const s_=c?.86:.62;const by=(c?.14:.3)+.07*Math.sin(Math.PI*2*(ph-Math.abs(i-2)*.14));
    const hd=sdEll(x,y,cx,by-.54*s_,.15*s_*1.15,.16*s_*1.15),bd=sdEll(x,y,cx,by+.1*s_,.25*s_*1.15,.37*s_*1.15);dm=Math.min(dm,hd,bd);});
   return [dm,9];}
  if(nm==='Teen'){y+=.3;
   /* a crown of spikes, each one jolting at its own offset on the beat, in front of the big dim person it pushes against */
   let dm=9;for(let i=0;i<6;i++){const xi=-.8+i*.32,h=.62+.34*hash(i,11)+.16*saw((ph+i*.17)%1);const apex=.7-h,dx=Math.abs(x-xi),sl=h/.14;
    const dE=(apex+dx*sl-y)/Math.sqrt(1+sl*sl);dm=Math.min(dm,Math.max(dE,y-.7));}
   const mass=sdEll(x,y,0,.18,.7,.5);
   return [dm,mass];}
  const mon=sdBox(x,y,0,-.0,.17,.97);
  const post=Math.max(Math.abs(Math.abs(x)-.6)-.012,Math.abs(y)-.99);
  return [mon,post];},
 draw(sc){const g=sc.g,d=sc.dpr,k=sc.k,cx=sc.cx,cy=sc.cy,t=sc.t,m=sc.m,nm=sc.mask,R=sc.mem.rows,ns=sc.mem.ns,F=sc.fig;
  const w={sh:shares(sc)};const wp=1-m*1.0,fade=sc.fade;
  const y0=-1.16,y1=1.08,dyr=(y1-y0)/(R-1),X=sc.lineup?1.28:1.3,dxs=2*X/ns;
  const per=MASKS.find(q=>q.nm===nm).per,ph=(t/per)%1;
  const bg=SYS_B.bg;
  const stops=[-X,-.62,-.34,-.12,.12,.34,.62,X];
  const lp=sc.lead,beat=.5+.5*Math.sin(Math.PI*2*t/per);
  for(let j=0;j<R;j++){const yy=y0+j*dyr;const e=sstep(0,1.3,t-.1-j*.012-hash(j,2)*.15);
   const n=ns;const px=new Array(n+1),py=new Array(n+1),rh=new Array(n+1),rdm=new Array(n+1);
   for(let i=0;i<=n;i++){const xx=-X+i*dxs;let dm=9;
    if(wp>.02)dm=figD(F,xx,yy,.03);
    let dd=9;
    if(m>.02){const s=SYS_B.sym(sc,nm,xx,yy,t,w);dm=wp>.02?(dm*wp+s[0]*m):s[0];dd=s[1];}
    let rho=sstep(.03,-.045,dm);const inner=sat(0,.1,-dm);
    let hgt=.085*rho*(.58+.42*inner);
    let r2=0;if(dd<9){r2=sstep(.02,-.03,dd)*m;hgt=Math.max(hgt,.05*r2*(.6+.4*sat(0,.12,-dd)));}
    /* a ridge lit from the left, so the body has a side */
    hgt*=.8+.2*clamp(.5-xx*.9,0,1.2);
    /* a quiet life in the ground itself */
    const gnd=(.0035*Math.sin(xx*9+yy*4+t*.7)+.002*Math.sin(xx*23-yy*7+t*1.3))*(1-.4*rho);
    /* the monolith never moves, light crosses it. the person breathes, in the pose. */
    rh[i]=rho;rdm[i]=r2;px[i]=cx+xx*k;py[i]=cy+(yy-hgt*e+gnd)*k;}
   /* hide the rows behind this one, so the form stands out of the lines */
   g.globalCompositeOperation='source-over';g.globalAlpha=1;g.fillStyle=bg;g.beginPath();g.moveTo(px[0]*d,py[0]*d);
   for(let i=1;i<=n;i++)g.lineTo(px[i]*d,py[i]*d);g.lineTo(px[n]*d,(cy+(y1+.2)*k)*d);g.lineTo(px[0]*d,(cy+(y1+.2)*k)*d);g.closePath();g.fill();
   g.globalCompositeOperation='lighter';
   const gr=g.createLinearGradient((cx-X*k)*d,0,(cx+X*k)*d,0);
   stops.forEach((sx,si)=>{const pt=sc.patAt(sx,yy);const c=sc.rgbAt(sx,yy,.08);const a=(.32+.68*sc.bright(pt))*sc.pa(pt);gr.addColorStop((sx+X)/(2*X),css(c,clamp(a,0,1)));});
   g.strokeStyle=gr;g.lineJoin='round';
   /* the floor of the line, faint */
   g.globalAlpha=.3*fade;g.lineWidth=1*d;g.beginPath();g.moveTo(px[0]*d,py[0]*d);for(let i=1;i<=n;i++)g.lineTo(px[i]*d,py[i]*d);g.stroke();
   /* the dim part of a symbol, the one the mask is held against, at a third of the strength */
   g.globalAlpha=.36*fade;g.lineWidth=(sc.lineup?1.2:1.5)*d;g.beginPath();let od=false;
   for(let i=0;i<=n;i++){const l2=rdm[i]>.14&&rh[i]<=.14;if(l2){if(!od){g.moveTo(px[i]*d,py[i]*d);od=true;}else g.lineTo(px[i]*d,py[i]*d);}else od=false;}
   g.stroke();
   /* where the line is lifted by the person or the symbol itself, bright, with a scan for the mask that does not move */
   let bright=.92;if(nm==='Ideological'&&m>.05){const sy=-1.16+((t/7.2)%1)*2.3;g.globalAlpha=clamp(.9*fade*(1+1.4*Math.exp(-Math.pow((yy-sy)/.06,2))*m),0,1);}else g.globalAlpha=bright*fade;
   g.lineWidth=(sc.lineup?1.3:1.7)*d;g.beginPath();let on=false;
   for(let i=0;i<=n;i++){const lift=rh[i]>.14;if(lift){if(!on){g.moveTo(px[i]*d,py[i]*d);on=true;}else g.lineTo(px[i]*d,py[i]*d);}else on=false;}
   g.stroke();
   for(let i=0;i<=n;i+=4)if(rh[i]>.3||rdm[i]>.5){const xx=-X+i*dxs;sc.reg(px[i],py[i],sc.patAt(xx,yy));}}
  g.globalAlpha=1;g.globalCompositeOperation='lighter';
  /* the light the lead pours into the form, on the beat */
  for(let p=0;p<9;p++){const c=sc.pc[p];if(c<.1)continue;const f=PFIELD[p];sc.glow(cx+f.x*k*.8,cy+(p===0?.45:f.y)*k,k*(.3+.2*c),PCOL[p],.07*c*sc.pa(p)*(p===lp?.7+.6*beat:1)*fade);}},
 glance:{Child:'A figure that folds into a small seed under a big dim arch. The arch is the one who decides.',Preteen:'The person splits into a row of copies that nod one after another, the middle one watching.',Teen:'The person goes to a crown of spikes, each jolting on a fast beat, in front of a big dim round mass.',Ideological:'The person goes to a tall plain pillar in a thin frame. Only the light moves across it.'},
 glyph:{
  Child:'<path d="M3 11C8 3 24 3 29 11" stroke-dasharray="1.6 2.4"/><ellipse cx="16" cy="21.5" rx="5.6" ry="5.6"/><circle cx="16" cy="14.5" r="2.4"/>',
  Preteen:'<circle cx="5.5" cy="12" r="2"/><circle cx="11" cy="10" r="2"/><circle cx="16" cy="9" r="2.8"/><circle cx="21" cy="10" r="2"/><circle cx="26.5" cy="12" r="2"/><path d="M3 22q2-3 4 0t4 0t5 0t4 0t4 0t4 0"/>',
  Teen:'<path d="M3 26L7.5 9 12 26 16 5 20 26 24.5 11 29 26"/><path d="M3 26h26" stroke-dasharray="1.6 2.4"/>',
  Ideological:'<rect x="11.5" y="4" width="9" height="24" rx="1"/><path d="M5 4v24M27 4v24" stroke-dasharray="1.6 2.4"/>'}};
