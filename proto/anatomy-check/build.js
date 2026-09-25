/* Builds anatomy-check.html: one static file, no script needed to read it,
   no network, the product's own face embedded.

   Inputs, both in this folder:
     today.json   where the shipped build draws every address, read out of
                  source.html by probe.js
     research.js  what the three anatomy passes found

   Run from the repo root:  node proto/anatomy-check/build.js
   Every count on the page is computed here from those two files. */
const fs=require('fs'),path=require('path');
const D=__dirname;
const T=JSON.parse(fs.readFileSync(path.join(D,'today.json'),'utf8'));
const R=require('./research.js');
const FONTCSS=fs.readFileSync(path.join(D,'..','field-rings','inter.css'),'utf8');

const byI={}; T.rows.forEach(r=>{byI[r.i]=r;});
const SK={Root:'root',Sacral:'sacral',Solar:'solar',Heart:'heart',Throat:'throat','3rd Eye':'eye',Crown:'crown'};
const YP={}; T.seats.forEach(s=>{YP[s.b]=s.yp;});
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const r2=v=>Math.round(v*100)/100;
const C=b=>'var(--'+SK[b]+')';
const N=i=>byI[i];
const seatOf=i=>N(i).b;
const WORD=['no','one','two','three','four','five','six','seven','eight','nine','ten',
 'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
const word=n=>WORD[n]||String(n);
const Word=n=>{const w=word(n);return w.charAt(0).toUpperCase()+w.slice(1);};

/* ---------- a frame maps figure units to plate pixels ---------- */
function frame(x0,y0,s,ox,oy){
 return {x0,y0,s,ox,oy,px:x=>r2(ox+(x-x0)*s),py:y=>r2(oy+(y-y0)*s)};}
function figTf(F){
 return 'translate('+r2(F.ox-F.x0*F.s)+','+r2(F.oy-F.y0*F.s)+') scale('+F.s+') translate('
  +T.fig.PMTX+','+T.fig.PMTY+') scale('+T.fig.PMS+')';}
let UID=0;
/* the silhouette, and a clip of it: the same path and transform the Body
   page clips its marks to. fade softens a crop that cuts through the legs. */
function body(F,crop,fade){
 const id='k'+(++UID), tf=figTf(F);
 let defs='<clipPath id="'+id+'"><path transform="'+tf+'" d="'+T.fig.BODYPATH+'"/></clipPath>';
 let mask='';
 if(fade){
  const m='m'+UID;
  defs+='<linearGradient id="'+m+'g" x1="0" y1="0" x2="0" y2="1">'
   +'<stop offset="0" stop-color="#fff"/><stop offset="'+fade[0]+'" stop-color="#fff"/>'
   +'<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
   +'<mask id="'+m+'"><rect x="0" y="0" width="'+crop[0]+'" height="'+crop[1]+'" fill="url(#'+m+'g)"/></mask>';
  mask=' mask="url(#'+m+')"';}
 return {id,defs,draw:'<g'+mask+'><path class="body" transform="'+tf+'" d="'+T.fig.BODYPATH+'"/></g>'};}
/* the seat markers, drawn as the Body page draws its seat cores, at a fixed
   size: scaled with a zoomed panel they grew into discs that took the eye. */
const SEATR=7.5;
function seatDots(F,list){
 return list.map(b=>'<circle class="seatdot" cx="'+F.px(50)+'" cy="'+F.py(YP[b])+'" r="'+SEATR
  +'" style="fill:'+C(b)+'"/>').join('');}
/* plain text wrapped to a character budget, for callout lines */
function wrap(text,n){
 const out=[];let line='';
 String(text).split(' ').forEach(w=>{
  if((line+' '+w).trim().length>n&&line){out.push(line);line=w;}else line=(line?line+' ':'')+w;});
 if(line)out.push(line);return out;}
/* an address. On the body it is a plain ring. Placed off the body, the Body
   page clips it at the skin, so it is drawn twice: the whole ring faint and
   dashed where the formula put it, and solid only where the page would
   actually show it. A ring nothing of which reaches the skin is fainter. */
function ring(F,x,y,b,clipId,state,r){
 r=r||9; const cx=F.px(x),cy=F.py(y);
 if(state==='body'||!clipId)
  return '<circle class="ring" cx="'+cx+'" cy="'+cy+'" r="'+r+'" style="stroke:'+C(b)+'"/>';
 return '<circle class="ring off'+(state==='never'?' never':'')+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'" style="stroke:'+C(b)+'"/>'
  +'<circle class="ring" clip-path="url(#'+clipId+')" cx="'+cx+'" cy="'+cy+'" r="'+r+'" style="stroke:'+C(b)+'"/>';}

/* ---------- callouts: spread down a column so no two collide ---------- */
function spread(items,minY,maxY,gap){
 items.sort((a,b)=>a.want-b.want);
 items.forEach(it=>{it.y=it.want;});
 for(let k=0;k<600;k++){
  let moved=false;
  for(let i=1;i<items.length;i++){
   const a=items[i-1],b=items[i],ov=a.y+a.h+gap-b.y;
   if(ov>0.05){a.y-=ov/2;b.y+=ov/2;moved=true;}}
  items.forEach(it=>{
   if(it.y<minY){it.y=minY;moved=true;}
   if(it.y+it.h>maxY){it.y=maxY-it.h;moved=true;}});
  if(!moved)break;}
 return items;}
const LH=[20,18,18,18,18,18];     /* line advance, first line is the name */
const FIRST=10;                    /* first line's middle, from the block top */
function blockH(lines){let h=0;lines.forEach((l,i)=>{h+=LH[Math.min(i,LH.length-1)];});return h+2;}
/* lines: [{cls, html}] where html is already tspans. side 'l' or 'r'. */
function callout(it,side,colX){
 const anchor=side==='l'?'end':'start';
 let y=it.y+15, out='<text class="co" text-anchor="'+anchor+'">';
 it.lines.forEach((l,i)=>{
  if(i>0)y+=LH[Math.min(i,LH.length-1)];
  out+='<tspan x="'+colX+'" y="'+r2(y)+'" class="'+l.cls+'">'+l.html+'</tspan>';});
 return out+'</text>';}
/* leader: from the mark, optionally through routing points, to a short
   horizontal stub at the label. A leader that leaves by the top or the
   bottom of a pill runs out level to the gutter before it turns toward its
   label, so it can never cut through a neighbouring pill. */
function leader(side,colX,it){
 const ay=r2(it.y+FIRST), sx=side==='l'?colX+10:colX-10, ex=side==='l'?colX+30:colX-30;
 const via=(it.via||[]).slice();
 if(via.length){const last=via[via.length-1]; via.push([side==='l'?colX+50:colX-50,last[1]]);}
 const pts=[[it.mx,it.my]].concat(via).concat([[ex,ay],[sx,ay]]);
 /* start at the ring's edge rather than its centre */
 const [x0,y0]=pts[0],[x1,y1]=pts[1],d=Math.hypot(x1-x0,y1-y0)||1,rr=(it.mr||9)+3;
 pts[0]=[r2(x0+(x1-x0)/d*rr),r2(y0+(y1-y0)/d*rr)];
 return '<path class="lead" d="M'+pts.map(p=>p[0]+','+p[1]).join(' L')+'"/>';}
const num=(i,extra)=>'<tspan class="n" style="fill:'+C(seatOf(i))+'">'+i+'</tspan>'+(extra||'');
const nm=s=>'<tspan class="nm">'+esc(s)+'</tspan>';

/* ======================= view 1 ======================= */
function view1(){
 const W=1440, s=13, crop=[28,72,0,62];
 const fw=(crop[1]-crop[0])*s, fh=(crop[3]-crop[2])*s, ox=(W-fw)/2, oy=18, H=oy+fh+18;
 const F=frame(crop[0],crop[2],s,ox,oy);
 const B=body(F,[W,H],[0.9]);
 const ids=R.NOSTRUCT.map(x=>x.i), set=new Set(ids);
 let g='<svg class="plate" viewBox="0 0 '+W+' '+H+'" role="img" aria-labelledby="v1t">'
  +'<title id="v1t">The addresses that name no real structure, drawn where the Body page places them today</title>'
  +'<defs>'+B.defs+'</defs>'+B.draw
  +seatDots(F,Object.keys(SK));
 /* the rest of the addresses, only where the Body page can show them */
 g+='<g clip-path="url(#'+B.id+')">'+T.rows.filter(r=>!set.has(r.i)).map(r=>
   '<circle class="ctx" cx="'+F.px(r.x)+'" cy="'+F.py(r.y)+'" r="2.3"/>').join('')+'</g>';
 const items=R.NOSTRUCT.map(x=>{
  const r=N(x.i), off=r.state!=='body';
  const lines=[{cls:'l1',html:num(x.i,'<tspan dx="7">'+nm(r.k)+'</tspan>')}];
  wrap(r.b+', claims '+r.n,50).forEach(t=>lines.push({cls:'l2',html:esc(t)}));
  const notes=[]; if(x.kind==='myth')notes.push('Not anatomy at all');
  if(r.state==='never')notes.push('Placed off the body, never shown');
  else if(off)notes.push('Placed off the body, cut at the edge');
  if(notes.length)wrap(notes.join('. '),56).forEach(t=>lines.push({cls:'l3',html:esc(t)}));
  return {i:x.i,side:r.x<50?'l':'r',mx:F.px(r.x),my:F.py(r.y),lines,h:blockH(lines),want:F.py(r.y)-FIRST,state:r.state};});
 let marks='',leads='',texts='';
 ['l','r'].forEach(side=>{
  const col=items.filter(it=>it.side===side), colX=side==='l'?ox-50:ox+fw+50;
  spread(col,8,H-8,14);
  col.forEach(it=>{leads+=leader(side,colX,it); texts+=callout(it,side,colX);});});
 items.forEach(it=>{const r=N(it.i); marks+=ring(F,r.x,r.y,r.b,B.id,r.state,9);});
 g+='<g>'+leads+'</g><g>'+marks+'</g><g>'+texts+'</g></svg>';
 return {svg:g,items};}

/* ======================= view 2 ======================= */
/* Rings here are arranged in seat rows so each group reads as a group. The
   first and third pictures carry the real placements. */
const GP={  /* figure units: ring centres per address, and how each leader leaves */
 'Accessory nerve':{m:{69:[43.5,YP.Throat],73:[46.1,YP.Throat]},side:'l'},
 'Cardiac plexus':{m:{49:[43.5,YP.Heart],55:[46.1,YP.Heart]},side:'l'},
 'Vagus nerve':{m:{65:[55.5,YP.Throat],51:[55.5,YP.Heart]},side:'r'},
 'Celiac plexus':{m:{33:[43.5,YP.Solar],36:[46.1,YP.Solar]},side:'l'},
 'Hepatic plexus':{m:{47:[53.9,YP.Solar],48:[56.5,YP.Solar]},side:'r'},
 'Obturator nerve':{m:{20:[39.6,YP.Sacral],10:[39.6,YP.Root]},side:'l',exit:'mid'},
 'Pudendal nerve':{m:{19:[43.4,YP.Sacral],2:[43.4,YP.Root]},side:'l',exit:'bot'},
 'Pelvic splanchnic nerves':{m:{24:[47.7,YP.Sacral],21:[50.0,YP.Sacral],30:[52.3,YP.Sacral],5:[50.0,YP.Root]},side:'r',exit:'top'},
 'Inferior hypogastric plexus':{m:{26:[56.4,YP.Sacral],3:[56.4,YP.Root]},side:'r',exit:'bot'},
 'Iliac branch':{m:{31:[60.2,YP.Sacral],7:[60.2,YP.Root]},side:'r',exit:'mid'}};
function view2(){
 const W=1440, s=13, crop=[28,72,0,66];
 const fw=(crop[1]-crop[0])*s, fh=(crop[3]-crop[2])*s, ox=(W-fw)/2, oy=18, H=oy+fh+10;
 const F=frame(crop[0],crop[2],s,ox,oy);
 const B=body(F,[W,H],[0.84]);
 const RR=12, PAD=6;
 let g='<svg class="plate" viewBox="0 0 '+W+' '+H+'" role="img" aria-labelledby="v2t">'
  +'<title id="v2t">Addresses that share one real structure, grouped on the figure, and one structure inside another in the head</title>'
  +'<defs>'+B.defs+'</defs>'+B.draw+seatDots(F,['Throat','Heart','Solar','Sacral','Root']);
 let pills='',rings='',leads='',texts='';
 const items=[];
 R.SAME.forEach(grp=>{
  const P=GP[grp.s]; const pts=grp.ids.map(i=>[F.px(P.m[i][0]),F.py(P.m[i][1]),i]);
  const x0=Math.min(...pts.map(p=>p[0]))-RR-PAD, x1=Math.max(...pts.map(p=>p[0]))+RR+PAD;
  const y0=Math.min(...pts.map(p=>p[1]))-RR-PAD, y1=Math.max(...pts.map(p=>p[1]))+RR+PAD;
  const rad=Math.min(x1-x0,y1-y0)/2;
  pills+='<rect class="pill'+(grp.sure==='reading'?' reading':'')+'" x="'+r2(x0)+'" y="'+r2(y0)+'" width="'+r2(x1-x0)
   +'" height="'+r2(y1-y0)+'" rx="'+r2(rad)+'"/>';
  pts.forEach(p=>{rings+='<circle class="ring" cx="'+p[0]+'" cy="'+p[1]+'" r="'+RR+'" style="stroke:'+C(seatOf(p[2]))+'"/>'
   +'<text class="rn" x="'+p[0]+'" y="'+r2(p[1]+4)+'" text-anchor="middle">'+p[2]+'</text>';});
  const mem=grp.ids.map(i=>num(i,'<tspan dx="5">'+esc(N(i).k+', '+N(i).b)+'</tspan>'));
  const memTxt=grp.ids.map(i=>i+' '+N(i).k+', '+N(i).b).join(' · ');
  const lines=[{cls:'l1',html:nm(grp.s)}];
  /* one address per line once the pair would outrun the column */
  if(grp.ids.length>2||memTxt.length>46)mem.forEach(m=>lines.push({cls:'l2',html:m}));
  else lines.push({cls:'l2',html:mem.join('<tspan class="sep">  ·  </tspan>')});
  wrap(grp.how,52).forEach(t=>lines.push({cls:'l3',html:esc(t)}));
  const midY=(y0+y1)/2, side=P.side, edgeX=side==='l'?x0:x1;
  let mx=edgeX, my=midY, via=[], want=midY-FIRST;
  if(P.exit==='top'){mx=(x0+x1)/2+(side==='l'?-12:12); my=y0; via=[[mx,r2(y0-18)]]; want=y0-18-FIRST-4;}
  if(P.exit==='bot'){mx=(x0+x1)/2; my=y1; via=[[mx,r2(y1+20)]]; want=y1+20-FIRST+6;}
  items.push({side,mx:r2(mx),my:r2(my),mr:-3,via,lines,h:blockH(lines),want});});
 /* one inside another: the cortex, named four times at four sizes */
 const cx=50, cy=9.3, K=R.CORTEX;
 const cort=[[K.outer,4.35,cx,cy],[K.twin,3.95,cx,cy],[K.mid,2.45,49.2,10.2],[K.inner,1.15,48.7,10.95]];
 let nest='';
 cort.forEach(([i,rr,x,y])=>{nest+='<circle class="ring nest" cx="'+F.px(x)+'" cy="'+F.py(y)+'" r="'+r2(rr*s)+'" style="stroke:'+C(seatOf(i))+'"/>';});
 const tag=(i,x,y,a)=>'<text class="rn tag" x="'+r2(x)+'" y="'+r2(y)+'" text-anchor="'+(a||'middle')+'" style="fill:'+C(seatOf(i))+'">'+i+'</text>';
 nest+=tag(K.outer,F.px(cx)-4.35*s*0.74-4,F.py(cy)-4.35*s*0.74-2,'end')
  +tag(K.twin,F.px(cx),F.py(cy)-3.95*s+15)
  +tag(K.mid,F.px(49.2)+0.35*s,F.py(10.2)-2.45*s+17)
  +tag(K.inner,F.px(48.7),F.py(10.95)+4);
 const cl=[{cls:'l1',html:nm('One inside another, in the head')},
  {cls:'l2',html:num(K.inner,'<tspan dx="5">'+esc(N(K.inner).k+', '+N(K.inner).n)+'</tspan>')},
  {cls:'l2',html:'<tspan class="sep">inside </tspan>'+num(K.mid,'<tspan dx="5">'+esc(N(K.mid).k+', '+N(K.mid).n)+'</tspan>')},
  {cls:'l2',html:'<tspan class="sep">inside </tspan>'+num(K.outer,'<tspan dx="5">'+esc(N(K.outer).k+', '+N(K.outer).n)+'</tspan>')},
  {cls:'l2',html:num(K.twin,'<tspan dx="5">'+esc(N(K.twin).k+', '+N(K.twin).n+', is nearly all of '+K.outer)+'</tspan>')}];
 items.push({side:'r',mx:r2(F.px(cx)+4.35*s),my:F.py(cy),mr:-3,via:[],lines:cl,h:blockH(cl),want:F.py(cy)-FIRST-20});
 ['l','r'].forEach(side=>{
  const col=items.filter(it=>it.side===side), colX=side==='l'?ox-50:ox+fw+50;
  spread(col,8,H-8,16);
  col.forEach(it=>{leads+=leader(side,colX,it); texts+=callout(it,side,colX);});});
 g+='<g>'+leads+'</g><g>'+pills+nest+'</g><g>'+rings+'</g><g>'+texts+'</g></svg>';
 return g;}

/* ======================= view 3 ======================= */
const HM=R.HEADMAP, kmm=(HM.vertexZ-HM.earZ)/(HM.year-HM.ytop); /* millimetres per figure unit */
const headY=z=>HM.ytop+(HM.vertexZ-z)/kmm;
const headX=x=>50-x/kmm;   /* MNI x is the person's right; a front view shows it on the left */
const vIndex=v=>{const A=R.RULER;
 for(let i=1;i<A.length;i++)if(v<=A[i][0])return A[i-1][1]+(v-A[i-1][0])*(A[i][1]-A[i-1][1])/(A[i][0]-A[i-1][0]);
 return A[A.length-1][1];};
/* where the formula can put a seat's addresses: between the smallest and the
   largest oval pmNode draws, x radius 6.4 to 12.4, y radius 2.4 to 5.4,
   clamped at the top of the figure. */
function band(F,b,clipTop){
 const cx=F.px(50),cy=F.py(YP[b]);
 const ell=(rx,ry,sw)=>{const a=r2(rx*F.s),bb=r2(ry*F.s);
  return 'M'+r2(cx-a)+','+cy+' a'+a+','+bb+' 0 1,'+sw+' '+r2(2*a)+',0 a'+a+','+bb+' 0 1,'+sw+' '+r2(-2*a)+',0 Z';};
 return '<path class="band" fill-rule="evenodd" style="fill:'+C(b)+';stroke:'+C(b)+'" d="'+ell(12.4,5.4,0)+' '+ell(6.4,2.4,1)+'"'
  +(clipTop?' clip-path="url(#'+clipTop+')"':'')+'/>';}
function tagAt(F,i,x,y,side,r){
 const off=(r||10)+5, tx=side==='l'?F.px(x)-off:F.px(x)+off;
 return '<text class="rn tag" x="'+r2(tx)+'" y="'+r2(F.py(y)+4.5)+'" text-anchor="'+(side==='l'?'end':'start')
  +'" style="fill:'+C(seatOf(i))+'">'+i+'</text>';}
function seatName(F,b,x,sub){
 return '<text class="sn" x="'+F.px(x)+'" y="'+r2(F.py(YP[b])+4)+'" text-anchor="end" style="fill:'+C(b)+'">'+esc(b)
  +(sub?'<tspan class="snsub" x="'+F.px(x)+'" dy="15">'+esc(sub)+'</tspan>':'')+'</text>';}
function panel(kind,which){
 const W=680;
 const head=which==='head';
 const crop=head?[42,58,0.9,15.9]:[30,70,23.6,58.6];
 const s=W/(crop[1]-crop[0]), H=r2((crop[3]-crop[2])*s);
 const F=frame(crop[0],crop[2],s,0,0);
 const B=body(F,[W,H],head?null:[0.93]);
 const topId='t'+(++UID);
 /* the formula clamps every address at figure height 2, so a zone is cut
    flat there. The clip runs from that line to well past the panel's foot:
    the first cut of this ended it one panel height below the line, which in
    the torso panel sat above the Solar and Root zones and erased them. */
 let g='<svg class="panel" viewBox="0 0 '+W+' '+H+'" role="img"><defs>'+B.defs
  +'<clipPath id="'+topId+'"><rect x="0" y="'+F.py(2)+'" width="'+W+'" height="'+r2(H-F.py(2)+10)+'"/></clipPath></defs>';
 const seats=head?['Crown','3rd Eye']:['Heart','Solar','Sacral','Root'];
 if(kind==='today')(head?['Crown','3rd Eye']:['Heart','Solar','Root']).forEach(b=>{g+=band(F,b,topId);});
 g+=B.draw+seatDots(F,seats);
 const lvl={Heart:'T4 to T5',Solar:'T12 to L1',Sacral:'L5',Root:'base of the spine'};
 seats.forEach(b=>{g+=seatName(F,b,head?46.9:46.6,(!head&&kind==='measured')?lvl[b]:null);});
 const RR=10;
 if(kind==='today'){
  const set=head?R.HEAD.map(h=>h.i):[].concat(...R.TORSO.map(t=>t.ids));
  const side={107:'r',104:'l',96:'r',79:'r',80:'l',49:'r',55:'l',33:'r',36:'r',1:'l',6:'r'};
  set.forEach(i=>{const r=N(i); g+=ring(F,r.x,r.y,r.b,B.id,r.state,RR)+tagAt(F,i,r.x,r.y,side[i],RR);});
 }else if(head){
  /* the brow line, where the 3rd Eye text says the seat is */
  const by=F.py(headY(HM.browZ));
  g+='<path class="guide" d="M'+F.px(44.4)+','+by+' H'+F.px(55.6)+'"/>'
   +'<text class="gl" x="'+r2(F.px(55.6)+8)+'" y="'+r2(by+4)+'">brow line</text>';
  const side={107:'r',96:'r',79:'r',80:'l'};
  R.HEAD.forEach(h=>{const b=seatOf(h.i);
   h.pts.forEach((p,k)=>{const x=headX(p[0]),y=headY(p[1]);
    g+='<circle class="ring" cx="'+F.px(x)+'" cy="'+F.py(y)+'" r="'+RR+'" style="stroke:'+C(b)+'"/>';
    g+=tagAt(F,h.i,x,y,h.pts.length>1?(x<50?'l':'r'):side[h.i],RR);});});
 }else{
  R.TORSO.forEach(t=>{
   const b=seatOf(t.ids[0]);
   if(t.side){ /* a paired structure: both sides of the spine, over its span */
    [-1,1].forEach(sg=>{const x=50+sg*t.side, y0=vIndex(t.lv[0]), y1=vIndex(t.lv[1]);
     g+='<rect class="span" x="'+r2(F.px(x)-7)+'" y="'+F.py(y0)+'" width="14" height="'+r2(F.py(y1)-F.py(y0))
      +'" rx="7" style="stroke:'+C(b)+'"/>'
      +'<circle class="ring" cx="'+F.px(x)+'" cy="'+F.py((y0+y1)/2)+'" r="'+RR+'" style="stroke:'+C(b)+'"/>';
     if(sg<0)g+=tagAt(F,t.ids[0],x,(y0+y1)/2,'l',RR);});
   }else{
    const y=vIndex(t.lv[0]);
    if(t.ids.length===2){
     t.ids.forEach((i,k)=>{g+='<circle class="ring" cx="'+r2(F.px(50)+(k?5:-5))+'" cy="'+F.py(y)+'" r="'+RR+'" style="stroke:'+C(b)+'"/>';});
     g+='<text class="rn tag" x="'+r2(F.px(50)+22)+'" y="'+r2(F.py(y)+4.5)+'" style="fill:'+C(b)+'">'+t.ids.join(' and ')+'</text>';
    }else{
     g+='<circle class="ring" cx="'+F.px(50)+'" cy="'+F.py(y)+'" r="'+RR+'" style="stroke:'+C(b)+'"/>'+tagAt(F,t.ids[0],50,y,'r',RR);}}});
 }
 return g+'</svg>';}

/* ---------- counts, all computed ---------- */
const V1=R.NOSTRUCT, none=V1.filter(x=>x.kind==='none'), myth=V1.filter(x=>x.kind==='myth');
const reg=i=>i<=48?'low':(i<=75?'mid':'head');
const nLow=none.filter(x=>reg(x.i)==='low').length, nMid=none.filter(x=>reg(x.i)==='mid').length, nHead=none.filter(x=>reg(x.i)==='head').length;
const v1off=V1.filter(x=>N(x.i).state!=='body').length;
const lowerSame=R.SAME.filter(g=>g.ids.every(i=>i<=48));
const lowerAddr=[].concat(...lowerSame.map(g=>g.ids));
const split=[].concat(...lowerSame.filter(g=>new Set(g.ids.map(seatOf)).size>1).map(g=>g.ids));
const chestPairs=R.SAME.filter(g=>g.ids.every(i=>i>=49&&i<=75));
const SEATS=['Crown','3rd Eye','Throat','Heart','Solar','Sacral','Root'];
const tally=SEATS.map(b=>{const rows=T.rows.filter(r=>r.b===b);
 return {b,all:rows.length,body:rows.filter(r=>r.state==='body'),edge:rows.filter(r=>r.state==='edge'),never:rows.filter(r=>r.state==='never')};});
const tb=b=>tally.find(t=>t.b===b);

/* ---------- html pieces ---------- */
const nb=i=>'<b class="nb" style="color:'+C(seatOf(i))+'">'+i+'</b>';
const addr=i=>nb(i)+' '+esc(N(i).k);
function v1table(){
 const row=x=>{const r=N(x.i);
  return '<tr><td class="c-a">'+addr(x.i)+'</td><td class="c-s">'+esc(r.b)+'</td><td>'+esc(r.n)+'</td><td>'+esc(x.why)+'</td><td>'+esc(x.near)+'</td></tr>';};
 return '<div class="tw"><table><thead><tr><th>Address</th><th>Seat</th><th>What it claims</th><th>What the research found</th><th>Nearest real structure</th></tr></thead><tbody>'
  +none.map(row).join('')
  +'<tr class="sub"><td colspan="5">And one that is not anatomy in any sense</td></tr>'
  +myth.map(row).join('')+'</tbody></table></div>';}
function v2lists(){
 return R.INSIDE.map(blk=>'<div class="nestblk"><h4>'+esc(blk.region)+'</h4><ul>'
  +blk.rows.map(([a,rel,b])=>'<li>'+addr(a)+' <span class="dimw">('+esc(N(a).n)+')</span> '+esc(rel)+' '+addr(b)
   +' <span class="dimw">('+esc(N(b).n)+')</span></li>').join('')
  +'</ul>'+(blk.also?'<p class="also">'+esc(blk.also)+'</p>':'')+'</div>').join('');}
function keyRow(list){
 return '<ul class="key">'+list.map(i=>'<li>'+nb(i)+' '+esc(N(i).k)+', <span class="dimw">'+esc(N(i).n)+'</span></li>').join('')+'</ul>';}
function v3table(){
 const rows=R.HEAD.map(h=>({ids:[h.i],s:N(h.i).n,today:h.today,what:h.what,bar:h.bar}))
  .concat(R.TORSO.map(t=>({ids:t.ids,s:t.s,today:t.today,what:t.what,bar:t.bar})));
 return '<div class="tw"><table><thead><tr><th>Address</th><th>Today on the Body page</th><th>Where the structure is</th><th>Measured, against your bar</th></tr></thead><tbody>'
  +rows.map(r=>'<tr><td class="c-a">'+r.ids.map(addr).join('<br>')+'<div class="dimw">'+esc(r.s)+', '+esc(seatOf(r.ids[0]))+'</div></td><td>'
   +esc(r.today)+'</td><td>'+esc(r.what)+'</td><td>'+esc(r.bar)+'</td></tr>').join('')+'</tbody></table></div>';}
/* one ring per address, so a seat's total is the length of its row and needs
   no "of" beside it: a count against a total reads as a score, which is the
   owner's own objection CO-05. The three counts sit in aligned columns. */
function unitChart(){
 const rr=7, gap=5, step=2*rr+gap+2, maxN=Math.max(...tally.map(t=>t.all)), W=maxN*step;
 const head='<div class="urow-w uhead"><span></span><span></span><span>On the body</span><span>Cut at the edge</span><span>Never shown</span></div>';
 return '<div class="units" style="--uw:'+W+'px">'+head+tally.map(t=>{
  const cells=[].concat(t.body.map(r=>['body',r]),t.edge.map(r=>['edge',r]),t.never.map(r=>['never',r]));
  const svg='<svg class="urow" viewBox="0 0 '+W+' 22" width="'+W+'" height="22" aria-hidden="true">'
   +cells.map(([st,r],k)=>'<circle class="u '+st+'" cx="'+(k*step+rr+2)+'" cy="11" r="'+rr+'" style="stroke:'+C(t.b)+'"><title>'
    +r.i+' '+esc(r.k)+'</title></circle>').join('')+'</svg>';
  const cell=(n,strong)=>'<span class="ucount'+(strong&&n?' strong':'')+'">'+n+'</span>';
  return '<div class="urow-w"><span class="useat" style="color:'+C(t.b)+'">'+esc(t.b)+'</span>'+svg
   +cell(t.body.length)+cell(t.edge.length)+cell(t.never.length,true)+'</div>';}).join('')+'</div>';}

const P1=view1(), P2=view2();
const stamp=T.stamp;
const known=T.known.map(k=>k.drawn).join(', ');
const pixNames=T.pixels.map(p=>p.nm).join(' and ');

const css=`
${FONTCSS}
:root{color-scheme:dark;
 --bg:#0C0D12;--panel:#1A1D26;--panel-2:#252833;--sunk:#090A0E;
 --edge:rgba(255,255,255,.09);--edge-2:rgba(255,255,255,.14);
 --ink:#EFEDE8;--mid:#B4B0A8;--dim:#94908A;--accent:#7EB8D4;
 --root:#D6524C;--sacral:#D8924E;--solar:#DABF6A;--heart:#5FD5A6;--throat:#5EBBDB;--eye:#7D93E0;--crown:#A77EDB;
 --body-fill:rgba(150,152,160,.10);--body-line:rgba(239,237,232,.36);--ctx:rgba(239,237,232,.30);
 --lead:rgba(239,237,232,.30);--pill:rgba(239,237,232,.58);--pill-fill:rgba(239,237,232,.045);
 --guide:rgba(239,237,232,.42);
 --sans:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif}
@media (prefers-color-scheme:light){:root:not([data-theme="dark"]){color-scheme:light;
 --bg:#F8F7F3;--panel:#EFEDE7;--panel-2:#F2F0EB;--sunk:#F3F1EC;
 --edge:rgba(20,23,28,.11);--edge-2:rgba(20,23,28,.18);
 --ink:#16171C;--mid:#4E4C48;--dim:#605E59;--accent:#2F6E92;
 --root:#9B4B47;--sacral:#8E6231;--solar:#7E6C29;--heart:#2A7A5C;--throat:#2C6F88;--eye:#4C5F9E;--crown:#6E5490;
 --body-fill:rgba(40,44,56,.075);--body-line:rgba(22,23,28,.34);--ctx:rgba(22,23,28,.30);
 --lead:rgba(22,23,28,.34);--pill:rgba(22,23,28,.55);--pill-fill:rgba(22,23,28,.04);--guide:rgba(22,23,28,.45)}}
:root[data-theme="light"]{color-scheme:light;
 --bg:#F8F7F3;--panel:#EFEDE7;--panel-2:#F2F0EB;--sunk:#F3F1EC;
 --edge:rgba(20,23,28,.11);--edge-2:rgba(20,23,28,.18);
 --ink:#16171C;--mid:#4E4C48;--dim:#605E59;--accent:#2F6E92;
 --root:#9B4B47;--sacral:#8E6231;--solar:#7E6C29;--heart:#2A7A5C;--throat:#2C6F88;--eye:#4C5F9E;--crown:#6E5490;
 --body-fill:rgba(40,44,56,.075);--body-line:rgba(22,23,28,.34);--ctx:rgba(22,23,28,.30);
 --lead:rgba(22,23,28,.34);--pill:rgba(22,23,28,.55);--pill-fill:rgba(22,23,28,.04);--guide:rgba(22,23,28,.45)}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.6;
 -webkit-font-smoothing:antialiased;font-feature-settings:"cv11","ss01"}
.wrap{max-width:1440px;margin:0 auto;padding-inline:clamp(16px,5vw,80px);padding-block:56px 72px}
header{max-width:900px}
.eyebrow{font-size:13px;color:var(--dim);letter-spacing:.01em;margin:0 0 10px}
h1{font-size:38px;line-height:1.12;font-weight:600;letter-spacing:-.015em;margin:0 0 18px;text-wrap:balance}
.lede{font-size:18px;line-height:1.6;color:var(--mid);margin:0 0 14px;max-width:68ch}
.lede q{color:var(--ink);quotes:"\\201C" "\\201D"}
.index{list-style:none;padding:0;margin:26px 0 0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:1100px}
.index li{display:flex}
.index a{flex:1;display:block;padding:14px 16px;border:1px solid var(--edge-2);border-radius:12px;color:var(--ink);text-decoration:none;min-height:44px}
.index a:hover,.index a:focus-visible{border-color:var(--accent);outline:none}
.index b{display:block;font-weight:600;font-size:15px;margin-bottom:2px}
.index span{font-size:14px;color:var(--mid)}
section{margin-top:84px;scroll-margin-top:24px}
h2{font-size:28px;line-height:1.2;font-weight:600;letter-spacing:-.01em;margin:0 0 12px;text-wrap:balance}
h3{font-size:19px;font-weight:600;margin:40px 0 8px}
h4{font-size:15px;font-weight:600;margin:0 0 8px;color:var(--ink)}
.sum{font-size:17px;color:var(--ink);max-width:70ch;margin:0 0 10px}
.note{font-size:15px;color:var(--mid);max-width:74ch;margin:0 0 10px}
.note q{color:var(--ink)}
.legend{display:flex;flex-wrap:wrap;gap:10px 28px;margin:16px 0 8px;font-size:14px;color:var(--mid)}
.legend span{display:inline-flex;align-items:center;gap:9px}
.legend svg{flex:none}
.platewrap{margin:18px 0 8px}
svg.plate,svg.panel{display:block;width:100%;height:auto;font-family:var(--sans)}
.body{fill:var(--body-fill);stroke:var(--body-line);stroke-width:1.4;vector-effect:non-scaling-stroke}
.seatdot{opacity:.42}
.ctx{fill:var(--ctx)}
.ring{fill:none;stroke-width:2.2}
.ring.off{stroke-dasharray:3 3;stroke-width:1.6;opacity:.75}
.ring.off.never{opacity:.42}
.ring.nest{stroke-width:2}
.lead{fill:none;stroke:var(--lead);stroke-width:1}
.co{font-size:13.5px}
.co .l1{font-size:15px;font-weight:600;fill:var(--ink)}
.co .l2{fill:var(--mid)}
.co .l3{font-size:12.5px;fill:var(--dim)}
.co .n,.rn{font-weight:600;font-variant-numeric:tabular-nums}
.co .nm{fill:var(--ink)}
.co .l2 .nm{fill:var(--mid)}
.co .sep{fill:var(--dim)}
.rn{font-size:11px;fill:var(--ink)}
.rn.tag{font-size:13px}
/* a halo in the ground colour, so a tag drawn over the silhouette is read
   against the page and not against the body fill: Root measured 4.36 to 1
   on the fill without it, and 4.78 on the ground with it */
.rn.tag,.sn,.gl{paint-order:stroke;stroke:var(--bg);stroke-width:3.5px;stroke-linejoin:round}
.pill{fill:var(--pill-fill);stroke:var(--pill);stroke-width:1.4}
.pill.reading{stroke-dasharray:5 4}
.band{fill-opacity:.05;stroke-opacity:.22;stroke-width:1;stroke-dasharray:2 3}
.guide{stroke:var(--guide);stroke-width:1.2;stroke-dasharray:4 4;fill:none}
.gl{font-size:12.5px;fill:var(--mid)}
.sn{font-size:12.5px;font-weight:600}
.snsub{font-size:11.5px;font-weight:500;fill:var(--mid)}
.span{fill:none;stroke-width:1.2;stroke-dasharray:3 3;opacity:.8}
.tw{overflow-x:auto;margin:18px 0 0;border:1px solid var(--edge);border-radius:12px}
table{border-collapse:collapse;width:100%;font-size:14.5px;line-height:1.5;min-width:760px}
th{text-align:left;font-weight:600;font-size:13px;color:var(--mid);padding:11px 14px;border-bottom:1px solid var(--edge-2);background:var(--panel)}
td{padding:11px 14px;border-bottom:1px solid var(--edge);vertical-align:top;color:var(--mid)}
td.c-a{color:var(--ink);white-space:nowrap}
td.c-s{white-space:nowrap}
tr:last-child td{border-bottom:0}
tr.sub td{color:var(--ink);font-weight:600;background:var(--panel);font-size:13.5px}
.nb{font-weight:600;font-variant-numeric:tabular-nums}
.dimw{color:var(--dim);font-size:13.5px}
.nests{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:14px}
.nestblk{border:1px solid var(--edge-2);border-radius:12px;padding:16px 18px}
.nestblk ul{margin:0;padding:0;list-style:none;display:grid;gap:7px;font-size:14.5px;color:var(--mid)}
.nestblk li{color:var(--ink)}
.also{font-size:13.5px;color:var(--mid);margin:12px 0 0}
.pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px;margin-top:18px}
.pcap{display:flex;align-items:baseline;gap:10px;margin:0 0 8px}
.pcap b{font-size:16px;font-weight:600}
.pcap span{font-size:14px;color:var(--mid)}
.pbox{border:1px solid var(--edge-2);border-radius:14px;background:var(--bg);padding:10px;overflow:hidden}
.key{list-style:none;padding:0;margin:12px 0 0;display:flex;flex-wrap:wrap;gap:6px 22px;font-size:14.5px}
.key li{color:var(--ink)}
.units{display:grid;gap:9px;margin-top:14px}
.units{overflow-x:auto;max-width:100%}
.urow-w{display:grid;grid-template-columns:80px var(--uw) 104px 120px 104px;align-items:center;gap:16px;width:max-content}
.uhead span{font-size:13px;color:var(--mid);font-weight:600;text-align:right}
.useat{font-size:14px;font-weight:600}
.urow{display:block;max-width:100%;height:auto}
.u{fill:none;stroke-width:1.8}
.u.edge{stroke-dasharray:2.4 2.2;opacity:.8}
.u.never{stroke-dasharray:1 2.6;opacity:.45}
.ucount{font-size:15px;color:var(--mid);font-variant-numeric:tabular-nums;text-align:right}
.ucount.strong{color:var(--ink);font-weight:600}
.method{font-size:14px;color:var(--mid);max-width:80ch}
footer{margin-top:84px;padding-top:22px;border-top:1px solid var(--edge);font-size:13.5px;color:var(--dim);max-width:92ch}
footer p{margin:0 0 8px}
code{font-size:.92em;color:var(--mid)}
a{color:var(--accent)}
@media (max-width:900px){.index,.nests,.pair{grid-template-columns:minmax(0,1fr)}h1{font-size:30px}h2{font-size:24px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

const lg=(inner,w,h)=>'<svg width="'+(w||22)+'" height="'+(h||22)+'" viewBox="0 0 '+(w||22)+' '+(h||22)+'" aria-hidden="true">'+inner+'</svg>';
const legend1='<div class="legend">'
 +'<span>'+lg('<circle cx="11" cy="11" r="8" fill="none" stroke-width="2.2" style="stroke:var(--heart)"/>')+'An address, in its seat’s colour</span>'
 +'<span>'+lg('<circle cx="11" cy="11" r="8" fill="none" stroke-width="1.6" stroke-dasharray="3 3" opacity=".75" style="stroke:var(--crown)"/>')+'Placed off the body today, so the Body page cuts it at the skin</span>'
 +'<span>'+lg('<circle cx="11" cy="11" r="2.3" style="fill:var(--ctx)"/>')+'Every other address, where the Body page can show it</span>'
 +'<span>'+lg('<circle cx="11" cy="11" r="7.5" opacity=".42" style="fill:var(--solar)"/>')+'A seat marker, where the Body page centres each seat</span></div>';
const legend2='<div class="legend">'
 +'<span>'+lg('<rect x="1" y="3" width="52" height="24" rx="12" fill="none" stroke-width="1.4" style="stroke:var(--pill)"/><circle cx="15" cy="15" r="8" fill="none" stroke-width="2" style="stroke:var(--root)"/><circle cx="39" cy="15" r="8" fill="none" stroke-width="2" style="stroke:var(--sacral)"/>',54,30)
 +'One real structure, named by more than one address</span>'
 +'<span>'+lg('<rect x="1" y="3" width="52" height="24" rx="12" fill="none" stroke-width="1.4" stroke-dasharray="5 4" style="stroke:var(--pill)"/><circle cx="15" cy="15" r="8" fill="none" stroke-width="2" style="stroke:var(--solar)"/><circle cx="39" cy="15" r="8" fill="none" stroke-width="2" style="stroke:var(--solar)"/>',54,30)
 +'The same, on the research’s own reading rather than a stated source</span>'
 +'<span>'+lg('<circle cx="15" cy="15" r="13" fill="none" stroke-width="2" style="stroke:var(--crown)"/><circle cx="12" cy="18" r="6" fill="none" stroke-width="2" style="stroke:var(--crown)"/>',30,30)
 +'One structure inside another</span></div>';
const legend3='<div class="legend">'
 +'<span>'+lg('<path fill-rule="evenodd" d="M1,11 a10,7 0 1,0 20,0 a10,7 0 1,0 -20,0 Z M6,11 a5,3 0 1,1 10,0 a5,3 0 1,1 -10,0 Z" style="fill:var(--eye);fill-opacity:.12;stroke:var(--eye);stroke-opacity:.35" stroke-width="1" stroke-dasharray="2 3"/>')
 +'Where today’s formula can put a seat’s addresses</span>'
 +'<span>'+lg('<circle cx="11" cy="11" r="8" fill="none" stroke-width="1.6" stroke-dasharray="3 3" opacity=".75" style="stroke:var(--crown)"/>')+'Placed off the body. The solid part is all the Body page shows</span></div>';

const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Address anatomy check</title>
<style>${css}</style>
</head>
<body>
<div class="wrap">
<header>
 <p class="eyebrow">Atüned · anatomy check · 25 September 2026</p>
 <h1>Where the addresses sit on the body, and what anatomy says about them</h1>
 <p class="lede">Three research passes checked every address on the body against published anatomy. This page draws what they found on the product’s own figure, the outline the Body page uses.</p>
 <p class="lede">The bar is yours: <q>pretty close, but not off to where a clinician will look at it and laugh at me.</q> No address is renamed here. The names stay as they are, and what anatomy says about each one belongs on the information page.</p>
 <ul class="index">
  <li><a href="#none"><b>Names with nothing real behind them</b><span>Where they are, what each one claims, and why it failed.</span></a></li>
  <li><a href="#same"><b>One real structure, more than one name</b><span>The ${lowerAddr.length} in the lower body, the pairs in the chest and neck, and what nesting looks like.</span></a></li>
  <li><a href="#place"><b>Where the Body page puts an address, and where it really is</b><span>Question 6 from the summary, drawn side by side.</span></a></li>
 </ul>
</header>

<section id="none">
 <h2>Names with nothing real behind them</h2>
 <p class="sum">${Word(none.length)} addresses name a structure anatomy does not have, and one more, Endless Seeking at the Crown, claims something that is not anatomy in any sense. Each is drawn where the Body page places it today, labelled with its own name and what it claims to be.</p>
 <p class="note">The summary sent earlier said fourteen. Read address by address, the three reports list ${word(none.length)}: ${word(nLow)} in the lower body, ${word(nMid)} in the chest and neck, ${word(nHead)} in the head. All ${word(none.length)} are drawn. ${Word(v1off)} of them are placed off the body today, so the Body page shows at most an edge of them.</p>
 ${legend1}
 <div class="platewrap">${P1.svg}</div>
 ${v1table()}
</section>

<section id="same">
 <h2>One real structure, more than one name</h2>
 <p class="sum">In the lower body, ${word(lowerAddr.length)} addresses sit on ${word(lowerSame.length)} real structures, and ${word(split.length)} of them split one structure between Root and Sacral. In the chest and neck, ${word(chestPairs.length)} pairs each name one structure twice. The 3rd Eye and Crown have no exact pairs. There, one structure sits inside another instead.</p>
 <p class="note">Same thing, two names, is drawn as one outline around both rings. One thing inside another is drawn as a ring inside a ring. The rings here are grouped by seat so each group can be read; the first picture shows where the Body page puts them today and the third shows where the real structures are.</p>
 ${legend2}
 <div class="platewrap">${P2}</div>
 <h3>One structure inside another, every case the reports name</h3>
 <p class="note">A nerve and its own branch are two real structures, so this is a different question from the pairs above: whether both deserve an address.</p>
 <div class="nests">${v2lists()}</div>
</section>

<section id="place">
 <h2>Where the Body page puts an address, and where it really is</h2>
 <p class="note">Question 6 in the summary asked: <q>Should the body map draw addresses at their real anatomical position, rather than the current hash based scatter around a seat’s centre?</q></p>
 <p class="sum">Today no address has a position of its own. A formula turns each address number into a spot somewhere in a wide ring around its seat’s marker, and the number alone picks the spot. Below, the same addresses twice at the same scale: on the left where the Body page draws them, on the right where the structure is.</p>
 ${legend3}
 <h3>The head</h3>
 <div class="pair">
  <div><div class="pcap"><b>Today</b><span>Where the Body page draws them</span></div><div class="pbox">${panel('today','head')}</div></div>
  <div><div class="pcap"><b>Measured</b><span>Where the structures are</span></div><div class="pbox">${panel('measured','head')}</div></div>
 </div>
 ${keyRow(R.HEAD.map(h=>h.i))}
 <p class="note">The ring around the Crown marker is wider than the head, so most Crown addresses land off it. Measured, all five sit inside the head. The two Crown addresses 104 and 96 sit nearer the 3rd Eye marker than the Crown one, and 107 sits at the Crown. The 3rd Eye marker itself is drawn at nose height, about 4 cm below the brow line on a real head. The second pass found this, and it waits on question 1 in the summary: <q>how should a seat’s own boundary be defined at all</q>.</p>
 <h3>The torso</h3>
 <div class="pair">
  <div><div class="pcap"><b>Today</b><span>Where the Body page draws them</span></div><div class="pbox">${panel('today','torso')}</div></div>
  <div><div class="pcap"><b>Measured</b><span>Where the structures are</span></div><div class="pbox">${panel('measured','torso')}</div></div>
 </div>
 ${keyRow([].concat(...R.TORSO.map(t=>t.ids)))}
 <p class="note">Two addresses on one plexus land in two places today and in one place measured, twice: 49 and 55 at the Heart marker, 33 and 36 at the Solar marker. 1 Fear is filed at Root and its plexus sits above the Sacral marker.</p>
 <h3>What the formula costs today, seat by seat</h3>
 <p class="note">Every address on the body, as the Body page can show it. Crown shows ${tb('Crown').body.length} of its ${tb('Crown').all} on the body and 3rd Eye shows ${tb('3rd Eye').body.length} of its ${tb('3rd Eye').all}. Hover a ring for its address.</p>
 <div class="legend">
  <span>${lg('<circle cx="11" cy="11" r="7" fill="none" stroke-width="1.8" style="stroke:var(--heart)"/>')}On the body</span>
  <span>${lg('<circle cx="11" cy="11" r="7" fill="none" stroke-width="1.8" stroke-dasharray="2.4 2.2" opacity=".8" style="stroke:var(--heart)"/>')}Cut at the edge: placed off the body, at most part of it shows</span>
  <span>${lg('<circle cx="11" cy="11" r="7" fill="none" stroke-width="1.8" stroke-dasharray="1 2.6" opacity=".45" style="stroke:var(--heart)"/>')}Never shown: no ring the page draws reaches the skin</span>
 </div>
 ${unitChart()}
 <h3>The same examples, against your bar</h3>
 <p class="note">Your bar is the place itself, <q>not to the left or right</q> of it. Every example fails it today, because the formula places it and anatomy plays no part. The last column says where measured placement puts it.</p>
 ${v3table()}
 <h3>How the measured side was placed</h3>
 <p class="method">The head. The second pass measured each structure on three published brain atlases, Harvard-Oxford, Juelich and Neuromorphometrics, in millimetres. It then matched the drawn head to a reference head: the top of the drawn skull is its crown, and the middle of the drawn ear is its ear points. That match is reused here unchanged.</p>
 <p class="method">The torso. The first and third passes sourced each structure’s level on the spine. The product’s own seat markers are the ruler: Heart at the 4th and 5th chest vertebrae, Solar at the last chest and first lower back vertebrae, Sacral at the last lower back vertebra, and Root at the base of the spine.</p>
 <p class="method">The figure has no ribs or spine drawn, so these are close placements, which is the bar you set.</p>
</section>

<footer>
 <p>Today’s positions come from the shipped build, <code>source.html</code> at commit ${esc(stamp.commit)}, checksum ${esc(stamp.md5)}. <code>probe.js</code> in this folder runs the product’s own placement function, figure outline and clip in Chromium.</p>
 <p>It was checked three ways before anything here was drawn. The marks the Body page renders on three loaded profiles, ${known} marks, sit where the probe says to within 0.005 of a figure unit. Every address the probe calls never shown was hidden one at a time on ${esc(pixNames)}’s profiles, and the screen did not change. Addresses on the body, used as controls, did change it.</p>
 <p>The findings are the three anatomy reports logged in <code>TASKS.md</code> as BI3a (Heart and Throat), BI3b (3rd Eye and Crown) and BI3c (Root, Sacral and Solar), carried into <code>research.js</code> with the report each line comes from. Nothing under <code>atuned_src</code> was changed.</p>
</footer>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(D,'anatomy-check.html'),html);
console.log('wrote anatomy-check.html',(html.length/1024).toFixed(0)+' KB');
console.log('view 1:',none.length,'no structure,',myth.length,'not anatomy,',v1off,'placed off the body; by region',nLow,nMid,nHead);
console.log('view 2: lower',lowerAddr.length,'addresses on',lowerSame.length,'structures,',split.length,'split Root/Sacral; chest pairs',chestPairs.length);
console.log('view 3:',tally.map(t=>t.b+' '+t.body.length+'/'+t.edge.length+'/'+t.never.length+' of '+t.all).join('  '));
