/* KIT. What the four Field renditions share: the reading, where every item
   sits around the loop, the shapes the rings are drawn on, and the parts that
   are the same in all four (the toggles, the lower strip, the core, a gate).
   Each rendition draws its own composition with these. Nothing here decides
   how a rendition looks.

   Reads window.FIELD, written by capture.js off the live build. */
(function(){
'use strict';
const F=window.FIELD, NS='http://www.w3.org/2000/svg', TAU=Math.PI*2;
const K=window.K={F:F,TAU:TAU};

/* ---------- colour ---------- */
K.hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
K.mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
K.rgb=c=>'rgb('+c.map(v=>Math.round(v)).join(',')+')';
K.rgba=(c,a)=>'rgba('+c.map(v=>Math.round(v)).join(',')+','+Math.max(0,Math.min(1,a)).toFixed(3)+')';
K.clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
K.lerp=(a,b,t)=>a+(b-a)*t;
K.INK=[239,237,232]; K.MID=[180,176,168]; K.DIM=[148,144,138];
K.GROUND=[16,16,16];
K.ACCENT=K.hx('#7EB8D4'); K.ALARM=K.hx('#FF2E1F');
K.seat=b=>K.hx(F.pal[b]);
/* the tier's own colour, from TIERCOL in engine/data/canon.js */
K.TIER=K.hx(F.tierCol||'#7EB8D4');
/* nodeCol, ported from ui/component.js: a light address is its seat colour
   washed toward slate, and it takes its full hue as the charge comes up */
K.nodeCol=(b,sq)=>{const base=K.seat(b),ld=K.clamp(sq/10,0,1);
 return K.mix(K.mix(base,[150,160,180],.74),base,Math.pow(ld,.55));};
K.rootCol=r=>K.hx(F.rootCol[r]);
K.SEATS=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];

/* ---------- svg ---------- */
K.el=function(tag,at,parent){const e=document.createElementNS(NS,tag);
 for(const k in (at||{})) if(at[k]!==undefined&&at[k]!==null) e.setAttribute(k,at[k]);
 if(parent)parent.appendChild(e); return e;};
K.title=function(e,s){const t=document.createElementNS(NS,'title');t.textContent=s;e.appendChild(t);return e;};
K.text=function(parent,s,x,y,at){const e=K.el('text',Object.assign({x:(+x).toFixed(1),y:(+y).toFixed(1)},at||{}),parent);
 e.textContent=s;return e;};
/* a label over line work gets a halo of the ground behind it, the way a map
   sets a name over contours, so a thread crossing it cannot take a letter */
K.label=function(parent,s,x,y,at){return K.text(parent,s,x,y,Object.assign({stroke:K.rgb(K.GROUND),
 'stroke-width':4,'stroke-linejoin':'round','paint-order':'stroke'},at||{}));};
/* a label set along a frame, the way a drawing sets a dimension: horizontal
   on a flat run, turned a quarter on an upright one, never on a diagonal and
   never upside down */
K.edgeAngle=function(p){const a=Math.atan2(p.ny,p.nx)*180/Math.PI;   /* the inward normal */
 const n=((a%360)+360)%360;
 if(n>45&&n<135)return 0;          /* top run, normal points down */
 if(n>225&&n<315)return 0;         /* bottom run */
 /* normal pointing right is the left run, which reads bottom to top; normal
    pointing left is the right run, which reads top to bottom */
 return (n<=45||n>=315)?-90:90;};
/* a quadratic from a to b whose middle is pulled toward the centre, so a
   thread between two rings bows inward the way the Field's chords do */
K.bowD=function(a,b,cx,cy,pull){const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
 const qx=mx+(cx-mx)*pull,qy=my+(cy-my)*pull;
 return 'M'+a.x.toFixed(1)+' '+a.y.toFixed(1)+'Q'+qx.toFixed(1)+' '+qy.toFixed(1)+' '+b.x.toFixed(1)+' '+b.y.toFixed(1);};
/* a 24 unit stroked glyph, centred, at a size. Ring, never fill. */
K.glyph=function(parent,d,x,y,size,col,w,op){const s=size/24;
 const g=K.el('g',{transform:'translate('+(x-size/2).toFixed(2)+' '+(y-size/2).toFixed(2)+') scale('+s.toFixed(4)+')'},parent);
 K.el('path',{d:d,fill:'none',stroke:col,'stroke-width':(w/s).toFixed(2),'stroke-linecap':'round',
  'stroke-linejoin':'round',opacity:op==null?1:op},g); return g;};
K.arcD=function(cx,cy,r,a0,a1){const large=(a1-a0)%TAU>Math.PI?1:0;
 const x0=cx+Math.cos(a0)*r,y0=cy+Math.sin(a0)*r,x1=cx+Math.cos(a1)*r,y1=cy+Math.sin(a1)*r;
 return 'M'+x0.toFixed(2)+' '+y0.toFixed(2)+'A'+r+' '+r+' 0 '+large+' 1 '+x1.toFixed(2)+' '+y1.toFixed(2);};

/* ---------- the loop. 112 places, the seam at twelve o'clock ----------
   Clockwise from the top, as the Field already runs: Root first, round to
   Crown. The four addresses outside the body have never been drawn on the
   Field, so its ring ran four places short. They sit at the seam, because that is where
   the loop closes: below the root on the root side, above the crown on the
   crown side, and the two gateways meet at the top. So the ring now has the
   112 places the product says it has. */
const FN={}; F.fieldNodes.forEach(n=>{FN[n.k]=n;});
const fld=k=>({field:true,k:k,b:FN[k].b,a:FN[k].a,sq:0});
K.slots=[fld('Gaia Gateway'),fld('Earth Star')]
 .concat(F.nodes.map(n=>Object.assign({field:false},n)))
 .concat([fld('Sol Star'),fld('Stellar Gateway')]);
K.N=K.slots.length;
K.slots.forEach((s,i)=>{s.s=i;s.t=(i+.5)/K.N;});
K.tOfNode=j=>K.slots[j+2].t;
K.sector={};
K.SEATS.forEach(b=>{const ss=K.slots.filter(s=>s.b===b);
 K.sector[b]={t0:ss[0].s/K.N,t1:(ss[ss.length-1].s+1)/K.N,n:ss.length,tm:(ss[0].s+ss[ss.length-1].s+1)/2/K.N};});
K.tmean=function(ts){let x=0,y=0;ts.forEach(t=>{x+=Math.cos(t*TAU);y+=Math.sin(t*TAU);});
 return ((Math.atan2(y,x)/TAU)+1)%1;};
/* everything inside the loop takes its place from the loop.
   A pattern sits over the addresses that built it, a chain over its parts,
   and a law or an archetype inside the seat it runs through, so one line from
   the rim to the core is one seat's whole account. */
F.sabs.forEach(s=>{s.t=s.parts.length?K.tmean(s.parts.map(K.tOfNode)):0;});
F.cxs.forEach(c=>{c.t=K.tmean(c.parts.map(k=>F.sabs[k].t));});
F.hys.forEach(c=>{c.t=K.tmean(c.parts.map(k=>F.cxs[k].t));});
F.sups.forEach(c=>{c.t=K.tmean(c.parts.map(k=>F.hys[k].t));});
function seatSpread(list){K.SEATS.forEach(b=>{const mine=list.filter(x=>x.b===b),S=K.sector[b];
 mine.forEach((x,i)=>{x.t=S.t0+(i+.5)/mine.length*(S.t1-S.t0);});});}
seatSpread(F.laws); seatSpread(F.arch);
F.masks.forEach((m,i)=>{m.t=(i+.5)/F.masks.length;});
F.domains.forEach((d,i)=>{d.t=(i+.5)/F.domains.length;});

/* ---------- shapes ----------
   Every ring is a superellipse, |x/a|^n + |y/b|^n = 1. n at 2 with a equal to
   b is a circle; n near 10 is the rectangle with its corners eased. One family
   covers the frame, the circle and everything between, and disp lets a
   rendition push the line in or out with a reading. */
K.Ring=function(cx,cy,a,b,n,disp){
 const N=1440, P=[];
 const rAt=function(th){const c=Math.cos(th),s=Math.sin(th);
  let r=Math.pow(Math.pow(Math.abs(c/a),n)+Math.pow(Math.abs(s/b),n),-1/n);
  if(disp)r+=disp(th); return r;};
 for(let i=0;i<N;i++){const th=-Math.PI/2+i/N*TAU,r=rAt(th);P.push([cx+Math.cos(th)*r,cy+Math.sin(th)*r,th]);}
 const L=[0];for(let i=1;i<=N;i++){const p=P[i%N],q=P[i-1];L.push(L[i-1]+Math.hypot(p[0]-q[0],p[1]-q[1]));}
 const R={cx:cx,cy:cy,a:a,b:b,n:n,P:P,len:L[N],rAt:rAt};
 /* the point on this ring along a bearing from the centre, with the inward
    normal, which is the direction a mark stands off a flat edge */
 R.at=function(th){const r=rAt(th),e=.002;
  const x=cx+Math.cos(th)*r,y=cy+Math.sin(th)*r;
  const r1=rAt(th+e),r0=rAt(th-e);
  const tx=(cx+Math.cos(th+e)*r1)-(cx+Math.cos(th-e)*r0), ty=(cy+Math.sin(th+e)*r1)-(cy+Math.sin(th-e)*r0);
  const m=Math.hypot(tx,ty)||1; return {x:x,y:y,r:r,nx:-ty/m,ny:tx/m,th:th};};
 /* the bearing at a share of the way round by length, so places spaced evenly
    along this ring can be carried inward to every other ring on their bearing */
 R.thAt=function(t){t=((t%1)+1)%1;const want=t*L[N];let lo=0,hi=N;
  while(hi-lo>1){const mid=(lo+hi)>>1;if(L[mid]<=want)lo=mid;else hi=mid;}
  const f=(want-L[lo])/((L[lo+1]-L[lo])||1);return -Math.PI/2+(lo+f)/N*TAU;};
 R.d=function(){return 'M'+P.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z';};
 /* the stretch of this ring between two bearings, clockwise */
 R.seg=function(th0,th1,steps){steps=steps||Math.max(4,Math.ceil((th1-th0)/TAU*360));const pts=[];
  for(let i=0;i<=steps;i++){const th=th0+(th1-th0)*i/steps,r=rAt(th);pts.push([cx+Math.cos(th)*r,cy+Math.sin(th)*r]);}
  return pts;};
 return R;};
K.polyD=(pts,close)=>'M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+(close?'Z':'');
/* a band between two rings over a stretch of bearings */
K.bandD=function(outer,inner,th0,th1){const a=outer.seg(th0,th1),b=inner.seg(th0,th1).reverse();
 return K.polyD(a.concat(b),true);};
/* the bearing for a place on the loop. Set by each rendition from its own
   address ring, so the loop is spaced evenly along the ring a person reads
   it on and every other ring takes its bearings from there. */
K.th=t=>-Math.PI/2+t*TAU;
K.useLoop=function(ring){K.th=t=>ring.thAt(t);};

/* ---------- the core. the product's own ring grammar at hero size ----------
   An arc for the share, the number inside it in the tier colour, and its scale
   under it, because every number says what it is out of. The range the
   coherence scale draws as its pill rides outside the arc, drawn and never
   stated. No glow: the Field earns its glow above the median and this reading
   is under it. */
K.core=function(g,cx,cy,R,o){o=o||{};
 const w=o.w||6,col=o.col||K.TIER,f=K.clamp(F.CQ/100,0,1);
 if(o.ground!==false)K.el('circle',{cx:cx,cy:cy,r:R+w/2+10,fill:K.rgb(K.GROUND)},g);
 K.el('circle',{cx:cx,cy:cy,r:R,fill:'none',stroke:'rgba(128,128,128,.22)','stroke-width':w},g);
 K.el('path',{d:K.arcD(cx,cy,R,-Math.PI/2,-Math.PI/2+TAU*f),fill:'none',stroke:K.rgb(col),'stroke-width':w,'stroke-linecap':'round'},g);
 const lo=F.range.lo/100,hi=F.range.hi/100,rr=R+w/2+5;
 K.title(K.el('path',{d:K.arcD(cx,cy,rr,-Math.PI/2+TAU*lo,-Math.PI/2+TAU*hi),fill:'none',
  stroke:K.rgba(col,.55),'stroke-width':3,'stroke-linecap':'round'},g),'Where coherence swings.');
 const fs=o.fs||Math.round(R*.78), cap=fs*.727, sub=o.sub||12, gap=o.gap||Math.max(8,fs*.16);
 const top=cy-(cap+gap+sub*.72)/2;
 const n=K.text(g,String(Math.round(F.CQ)),cx,top+cap,{'text-anchor':'middle',fill:K.rgb(col),
  'font-size':fs,'font-weight':o.weight||300,'letter-spacing':'-0.02em'});
 K.title(n,'Coherence. The 21 laws, summed.');
 K.text(g,'of 100',cx,top+cap+gap+sub*.72,{'text-anchor':'middle',fill:'var(--dim)','font-size':sub,'font-weight':500});
 return {fs:fs};};

/* ---------- one gate, ported from verpArrows in ui/wheel.js ----------
   The ring, the glyph, and the pill that holds a dash until a story has run
   through the gate. The pill's figure is set at 11px here: the Field draws it
   at 8.5, under the product's own floor, where no gate can see it. */
K.gate=function(g,x,y,v,R,o){R=R||13;o=o||{};
 const up=v.side==='higher',c=K.seat(up?'Heart':'Root'),ev=F.gateEvidence,f=v.pct/100;
 const gg=K.el('g',{},g);
 K.el('circle',{cx:x,cy:y,r:R,fill:K.rgb(o.bg||[23,25,34])},gg);
 K.el('circle',{cx:x,cy:y,r:R,fill:'none',stroke:K.rgba(c,ev?.22:.46),'stroke-width':2.2},gg);
 if(f>0)K.el('path',{d:K.arcD(x,y,R,-Math.PI/2,-Math.PI/2+TAU*f),fill:'none',stroke:K.rgba(c,.95),'stroke-width':2.2,'stroke-linecap':'round'},gg);
 K.glyph(gg,v.glyph,x,y,R*1.15,K.rgba(K.INK,ev?.95:.86),1.6);
 const pw=24,ph=15,px=x+R-4,py=y+R-7;
 K.el('rect',{x:px,y:py,width:pw,height:ph,rx:ph/2,fill:ev?K.rgb(c):K.rgb([58,58,62])},gg);
 K.text(gg,ev?v.pct+'%':'–',px+pw/2,py+ph/2+4,{'text-anchor':'middle','font-size':11,'font-weight':600,
  fill:ev?K.rgb([16,16,16]):K.rgba(K.INK,.8)});
 K.title(gg,v.nm+'. '+(ev?v.pct+'% of the story ran through it.':'Nothing read yet, so the ring is empty. A story fills it.'));
 return gg;};

/* ---------- the toggles ----------
   In the order the rings sit, outside first. Every icon is a ring drawn in
   the ring's own mark, on the product's 24 unit grid. */
function segRing(n,r,gapDeg){let d='';const g=gapDeg/360*TAU,step=TAU/n;
 for(let i=0;i<n;i++){const a0=-Math.PI/2+i*step+g/2,a1=a0+step-g;
  d+=K.arcD(12,12,r,a0,a1);}return d;}
function ticks(n,r0,r1,lens){let d='';for(let i=0;i<n;i++){const a=-Math.PI/2+i/n*TAU,l=lens?lens[i%lens.length]:1;
 d+='M'+(12+Math.cos(a)*r0).toFixed(2)+' '+(12+Math.sin(a)*r0).toFixed(2)+'L'+(12+Math.cos(a)*(r0+(r1-r0)*l)).toFixed(2)+' '+(12+Math.sin(a)*(r0+(r1-r0)*l)).toFixed(2);}return d;}
const circ=(x,y,r)=>'M'+(x-r)+' '+y+'a'+r+' '+r+' 0 1 0 '+(2*r)+' 0a'+r+' '+r+' 0 1 0 '+(-2*r)+' 0';
K.TOGGLES=[
 {k:'domains',nm:'Domains',d:segRing(5,8.6,20),
  tip:'Domains. The nineteen blueprint domains, what was there before any of it.'},
 {k:'addresses',nm:'Addresses',d:circ(12,12,4.2)+ticks(8,7,10.4),
  tip:'Addresses. Your 112 addresses. Each mark is the charge held at one place.'},
 {k:'stories',nm:'Stories',d:circ(12,12,2.6)+'M12 9V4.4M14.6 13.5l4 2.3M9.4 13.5l-4 2.3'+circ(12,3.4,1.1)+circ(19.4,16.2,1.1)+circ(4.6,16.2,1.1),
  tip:'Stories. One line for each story that put charge on an address.'},
 {k:'masks',nm:'Masks',d:'M4.5 8.5C4.5 6.4 8 5 12 5s7.5 1.4 7.5 3.5c0 5.6-3.4 10.5-7.5 10.5S4.5 14.1 4.5 8.5zM8.2 10.3h2.6M13.2 10.3h2.6',
  tip:'Masks. The six masks, each at its weight.'},
 {k:'archetypes',nm:'Archetypes',d:'M12 3.8l2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.6-5.1 2.6 1-5.6-4-3.9 5.6-.8z',
  tip:'Archetypes. The twelve, each set in the seat it runs through.'},
 {k:'patterns',nm:'Patterns',d:circ(15.6,8.4,3.2)+'M13.3 10.7L5 19',
  tip:'Patterns. The saboteurs running on the charge, threaded to the addresses that built them.'},
 {k:'chains',nm:'Chains',d:circ(5.4,18.6,1.6)+circ(11,13,2.3)+circ(17.4,6.6,3)+'M6.6 17.4l2.8-2.8M12.7 11.3l2.6-2.6',
  tip:'Chains. How a pattern compounds: complex, hyper complex, character, inward.'},
 {k:'laws',nm:'Laws',d:circ(12,12,2.4)+ticks(7,5.2,10,[1,.6,.9,.45,.8,.55,.95]),
  tip:'Laws. The twenty one laws, set by seat. Their sum is the number at the centre.'},
 {k:'gates',nm:'Gates',d:circ(12,12,3.1)+'M12 8.9V3.6M9.6 6L12 3.6 14.4 6M12 15.1v5.3',
  tip:'Gates. Three higher above the core and three lower below it.'},
 {sep:true},
 {k:'shadow',nm:'Shadow',d:circ(12,12,8.5)+'M7.2 16.6l3.4-3.4M10.2 19.2l6-6M14.6 19.9l4.6-4.6',
  tip:'Shadow. The weight on all 112 addresses, as a wash behind everything.'}];

/* ---------- the page ---------- */
K.mount=function(o){
 const st=document.createElement('div');st.className='stage';st.id='stage';
 st.setAttribute('role','img');st.setAttribute('aria-label','The Field, '+o.name+'. Mockup.');
 document.body.appendChild(st);
 const W=920,H=903;
 const svg=K.el('svg',{class:'field',width:W,height:H,viewBox:'0 0 '+W+' '+H},st);
 const defs=K.el('defs',{},svg);
 const L={};
 ['shadow','ground','domains','stories','addresses','masks','archetypes','patterns','chains','laws','gates','core']
  .forEach(k=>{L[k]=K.el('g',{class:'L-'+k},svg);});
 /* labels ride on top of every mark, in their layer's class, so a hidden
    layer takes its words with it */
 const T={};
 ['domains','addresses','stories','masks','archetypes','patterns','chains','laws','gates','seats']
  .forEach(k=>{T[k]=K.el('g',{class:'L-'+k},svg);});
 const row=document.createElement('div');row.className='lays';row.setAttribute('role','toolbar');
 row.setAttribute('aria-label','Layers');
 K.TOGGLES.forEach(t=>{
  if(t.sep){const s=document.createElement('span');s.className='lay-sep';row.appendChild(s);return;}
  const b=document.createElement('button');b.className='lay';b.type='button';b.title=t.tip;
  b.setAttribute('aria-pressed','true');b.dataset.k=t.k;
  b.innerHTML='<span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+t.d+'"/></svg></span><span class="nm">'+t.nm+'</span>';
  b.addEventListener('click',()=>{const on=b.getAttribute('aria-pressed')!=='true';
   b.setAttribute('aria-pressed',String(on));st.classList.toggle('off-'+t.k,!on);});
  row.appendChild(b);});
 st.appendChild(row);
 const css=document.createElement('style');
 css.textContent=K.TOGGLES.filter(t=>t.k).map(t=>'.stage.off-'+t.k+' .L-'+t.k+'{display:none}').join('\n');
 document.head.appendChild(css);
 /* the lower strip, from the product's own markup */
 const strip=document.createElement('div');strip.className='strip';
 const tmp=document.createElement('div');tmp.innerHTML=F.keyHTML;
 const q=document.createElement('div');q.className='grp';
 Array.from(tmp.querySelectorAll('.kb')).filter(b=>b.dataset.q!=='cq').forEach(b=>q.appendChild(b));
 const sep=document.createElement('span');sep.className='sep';
 const fl=document.createElement('div');fl.className='grp';fl.innerHTML=F.keyloHTML;
 const sp=document.createElement('span');sp.className='sp';
 const ac=document.createElement('div');ac.className='grp';ac.innerHTML=F.accHTML;
 strip.append(q,sep,fl,sp,ac);st.appendChild(strip);
 const pv=document.createElement('div');pv.className='prov';
 pv.innerHTML='<b>'+o.name+'</b>'+F.who+', example. Mockup';
 st.appendChild(pv);
 /* the window the rings fill: under the toggles, over the strip */
 const win={x0:14,y0:74,x1:906,y1:836};
 win.cx=(win.x0+win.x1)/2; win.cy=(win.y0+win.y1)/2;
 win.a=(win.x1-win.x0)/2; win.b=(win.y1-win.y0)/2;
 /* hooks for the shooter */
 window.__off=function(keys){keys.forEach(k=>{const b=row.querySelector('[data-k="'+k+'"]');if(b&&b.getAttribute('aria-pressed')==='true')b.click();});};
 return {st:st,svg:svg,defs:defs,L:L,T:T,W:W,H:H,win:win};};

/* ---------- the shadow wash, drawAura in ui/wheel.js, redrawn ----------
   Four soft pools in the corners, the seat that runs darkest and the root,
   at a density read off DQ over its own 100. The Field divides DQ by 7,
   which was the scale before DQ was made a share: every profile past 7
   draws the same full wash, so it cannot tell 11 from 54. */
K.shadow=function(M,o){o=o||{};const g=M.L.shadow,dens=K.clamp(F.DQ/100,0,1);
 const lead=K.seat(F.darkB||'Sacral'),warm=F.benign===false?K.seat('Root'):K.seat('Heart');
 /* a rendition that sets words in its corners passes its own pool centres,
    so the wash is not under the words it has to stay out from */
 const at=o.at||[[.13,.24],[.92,.25],[.09,.83],[.91,.84]], reach=o.reach||1;
 /* the Field's own arrangement: the darkest seat top left and bottom right,
    the root top right and bottom left */
 const col=[lead,warm,warm,lead];
 at.map((p,i)=>[p[0],p[1],col[i%4]]).forEach((p,i)=>{
  const id='sh'+i+Math.random().toString(36).slice(2,6);
  const gr=K.el('radialGradient',{id:id,cx:p[0]*M.W,cy:p[1]*M.H,r:Math.max(M.W,M.H)*(.30+dens*.30)*reach,gradientUnits:'userSpaceOnUse'},M.defs);
  K.el('stop',{offset:0,'stop-color':K.rgb(p[2]),'stop-opacity':(.03+.20*dens).toFixed(3)},gr);
  K.el('stop',{offset:1,'stop-color':K.rgb(p[2]),'stop-opacity':0},gr);
  K.el('rect',{x:0,y:0,width:M.W,height:M.H,fill:'url(#'+id+')'},g);});};

/* ---------- the seat's own mark ----------
   Law 8 in DESIGN.md: no text over the hero graphic, ever. So a seat is
   named on the drawing by its glyph, which engine/data/canon.js carries for
   exactly this: "each seat has a mark, so the ring can name where it sits
   without a word". The word lives in the tooltip. */
K.seatGlyph=function(parent,b,x,y,size,col){const s=size/24;
 const g=K.el('g',{transform:'translate('+(x-size/2).toFixed(2)+' '+(y-size/2).toFixed(2)+') scale('+s.toFixed(4)+')',
  fill:'none',stroke:col||K.rgb(K.seat(b)),'stroke-width':(1.8/s).toFixed(2),'stroke-linecap':'round','stroke-linejoin':'round'},parent);
 const seat=F.seats.find(z=>z.b===b); g.innerHTML=(seat&&seat.glyph)||'<circle cx="12" cy="12" r="7"/>';
 const hit=K.el('circle',{cx:12,cy:12,r:13,fill:'transparent',stroke:'none'},g);
 K.title(g,b+'. '+K.sector[b].n+' addresses.');
 return g;};
/* ---------- tension, ported from ui/wheel.js ----------
   A thread from an address to its pattern runs taut where the person is
   susceptible and hangs slack where they are not. Susceptibility is the
   Domain Matrix factor, 0.45 to 1.30, and it is the one reading that varies
   per connection rather than per place. sag() gives the bow for a thread
   off that address: the Field's own curve, base times (1.28 less 0.62 of the
   tension). */
K.sag=(j,base)=>{const n=F.nodes[j],t=K.clamp((((n&&n.susc)||1)-0.45)/0.85,0,1);return base*(1.28-0.62*t);};

/* the heaviest few, by charge, for any rendition that names them */
K.heaviest=n=>F.nodes.slice().sort((a,b)=>b.sq-a.sq).slice(0,n);
})();
