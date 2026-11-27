/* SYSTEM C, MOSAIC. The person is a field of square cells, the way the Body page's mask pixels already
   read. Each mask is a rule applied to the cells, not a drawing laid on top: Child goes chunky and
   small under a big block, Preteen shears and echoes sideways in a wave of copying, Teen fractures
   into slabs that snap out of line, Ideological is quantised to a rigid ruled column. The leading
   patterns bend the person underneath, and the cells carry the pattern colour of the place they sit. */
const SYS_C={id:'c-mosaic',name:'Mosaic',noMaskPose:true,dimTo:.4,bg:'#0C0D12',N:{d:0,m:0,l:0},
 blurb:'The person is a field of square cells. Each mask is a rule on the cells: chunky and small, sheared and echoed, fractured into slabs, or ruled into a column. At zero load it is a calm figure.',
 init(sc){},
 draw(sc){const g=sc.g,d=sc.dpr,k=sc.k,cx=sc.cx,cy=sc.cy,t=sc.t,m=sc.m,nm=sc.mask,F=sc.fig;
  const s=Math.max(sc.lineup?6:9,Math.round(k/(sc.lineup?17:sc.mobile?17:25)));const X=sc.lineup?1.28:1.3,y0=-1.14,y1=1.1;
  const cols=Math.floor(2*X*k/s),rows=Math.floor((y1-y0)*k/s);
  const ox=cx-cols*s/2,oy=cy+y0*k;
  const per=MASKS.find(q=>q.nm===nm).per,ph=(t/per)%1,lp=sc.lead,beat=.5+.5*Math.sin(Math.PI*2*t/per);
  const sh=shares(sc);
  const gap=Math.max(1.5,s*.13);
  /* a cell's coverage and how deep inside the form it is */
  let dep=0;const cov=(x,y)=>{const D=figD(F,x,y,.03);dep=sat(0,.09,-D);return sstep(.045,-.03,D);};
  g.globalCompositeOperation='lighter';
  const slab=Math.floor(t/per),sl=t/per-slab,snap=sstep(0,.12,sl);
  const B=Math.max(2,Math.round(k/160));          /* the child's coarse cell is B fine cells across */
  const blk=nm==='Child'&&m>.02;
  const bobY=.05*Math.sin(Math.PI*2*ph);
  for(let j=0;j<rows;j++){const yy=(oy+(j+.5)*s-cy)/k;
   for(let i=0;i<cols;i++){const xx=(ox+(i+.5)*s-cx)/k;
    const e=sstep(0,1.1,t+.25-hash(i*131+j,7)*.9);
    const ccx=ox+(i+.5)*s,ccy=oy+(j+.5)*s;
    let cp=0,cm=0,dp=0,dm_=0;
    if(1-m>.02){cp=cov(xx,yy);dp=dep;}
    if(m>.02){
     if(nm==='Child'){const bi=Math.floor(i/B),bj=Math.floor(j/B);const bx=(ox+(bi*B+B/2)*s-cx)/k,by=(oy+(bj*B+B/2)*s-cy)/k;
      const sF=.6,brt=1+.035*Math.sin(Math.PI*2*ph);
      cm=cov(bx/sF/brt,.96+(by-.96)/sF/brt);dm_=dep;}
     else if(nm==='Preteen'){const row=Math.round(1.4*Math.sin(Math.PI*2*(yy*1.2-ph)));const off=row*s/k;
      const c0=cov(xx-off,yy),d0=dep,cl=.6*cov(xx-off*.7+.8,yy*.96+.03),dl=dep,cr=.6*cov(xx-off*1.3-.8,yy*1.04-.03),dr=dep;
      cm=Math.max(c0,cl,cr);dm_=cm===c0?d0:cm===cl?dl:dr;}
     else if(nm==='Teen'){const sid=Math.floor((xx*1.0+yy*.55+3)*4.2);const hv=hash(sid+slab*7,3),hp=hash(sid+(slab-1)*7,3);
      const dx=((hp+(hv-hp)*snap)-.5)*.62*m,dy=((hash(sid+slab*5,9)-.5)*.12)*m;
      cm=cov(xx-dx,yy-dy);dm_=dep;
      /* every other slab is the negative of itself */
      if((sid&1)&&m>.35&&cm>.1)cm=((i+j)&1)?cm:cm*.2;
      /* a hairline crack where one slab meets the next */
      const fr=(xx*1.0+yy*.55+3)*4.2-sid;if(fr<.06||fr>.95)cm*=.2;}
     else{const box=sstep(.03,-.03,sdBox(xx,yy,0,-.015,.2,.97));
      const stripe=(((i*2)%7)<5)?1:.2,rule=(j%6===5)?.2:1;
      cm=box*stripe*rule;dm_=.6;}
    }
    let a=(1-m)*cp+m*cm,dd=(1-m)*dp+m*dm_;
    if(blk){const ox0=-.4,ox1=.4,oy0=-.92+bobY,oy1=-.46+bobY;
     if(xx>ox0&&xx<ox1&&yy>oy0&&yy<oy1){const bi=Math.floor(i/B),bj=Math.floor(j/B);a=Math.max(a,(.2+.06*(((bi+bj)&1)))*m);}}
    if(a<.04){g.globalAlpha=.05*(.6+.4*e)*sc.fade;g.fillStyle='rgb(200,205,220)';g.fillRect((ccx-s/2+gap/2)*d,(ccy-s/2+gap/2)*d,(s-gap)*d,(s-gap)*d);continue;}
    const pt=sc.patAt(xx,yy);let col=sc.rgbAt(xx,yy,0);
    if(blk&&xx>-.4&&xx<.4&&yy<-.44&&cm<.1&&cp<.1)col=[196,192,186];
    /* five levels, so it reads as a mosaic and not a blur. depth and the light from the left set the level. */
    const lit=clamp(.55+.45*dd+.1*clamp(-xx*1.2,-1,1),0,1.1);
    const lv=Math.min(4,Math.floor(clamp(a*lit,0,1)*4.99)),q=(lv+1)/5;
    let al=(.2+.8*q)*sc.bright(pt)*sc.pa(pt)*sc.fade*e;
    al*=1+.1*Math.sin(t*1.1+i*.37+j*.21);
    if(pt===lp)al*=.84+.3*beat;
    col=mixc(col,INK,.03+.36*q*q);
    if(nm==='Ideological'&&m>.05){const sy=-1.14+((t/7.2)%1)*2.24;al*=1+1.5*Math.exp(-Math.pow((yy-sy)/.05,2))*m;}
    g.globalAlpha=clamp(al,0,1);g.fillStyle='rgb('+(col[0]|0)+','+(col[1]|0)+','+(col[2]|0)+')';
    g.fillRect((ccx-s/2+gap/2)*d,(ccy-s/2+gap/2)*d,(s-gap)*d,(s-gap)*d);
    sc.reg(ccx,ccy,pt);}}
  g.globalAlpha=1;
  for(let p=0;p<9;p++){const c=sc.pc[p];if(c<.1)continue;const f=PFIELD[p];sc.glow(cx+f.x*k*.8,cy+(p===0?.45:f.y)*k,k*(.3+.2*c),PCOL[p],.06*c*sc.pa(p)*(p===lp?.7+.6*beat:1)*sc.fade);}},
 glance:{Child:'The person resolves into fewer, bigger cells and settles low, under a block that rides above.',Preteen:'The rows slide sideways in a wave and two faint copies stand either side. Copying, row by row.',Teen:'The figure breaks into slabs that snap out of line on a fast beat, some inverted.',Ideological:'The figure is ruled into a stiff striped column. Only the scan line moves.'},
 glyph:{
  Child:'<rect x="9" y="4" width="14" height="8" rx="1" stroke-dasharray="1.6 2.4"/><rect x="11" y="19" width="4" height="4"/><rect x="17" y="19" width="4" height="4"/><rect x="14" y="24.5" width="4" height="4"/>',
  Preteen:'<rect x="4" y="6" width="5" height="5"/><rect x="13.5" y="6" width="5" height="5"/><rect x="23" y="6" width="5" height="5"/><rect x="9" y="13.5" width="5" height="5"/><rect x="18.5" y="13.5" width="5" height="5"/><rect x="4" y="21" width="5" height="5"/><rect x="13.5" y="21" width="5" height="5"/>',
  Teen:'<path d="M4 4h10v10H4zM18 18h10v10H18z"/><path d="M18 4h10v10H18zM4 18h10v10H4z" stroke-dasharray="1.6 2.4"/>',
  Ideological:'<path d="M9 4v24M14 4v24M19 4v24M24 4v24"/><path d="M5 4h22M5 28h22" stroke-dasharray="1.6 2.4"/>'}};
