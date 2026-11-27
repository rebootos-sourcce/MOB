/* The merged base figure, as he asked on 27 September: "Use this as our new
   man", front and back, with the nervous system, the seats, the addresses, a
   grid behind it as the map, his selectable regions, and one region pressed.

   Drawn ON the approved figure itself (nervous-figures.json, extracted from
   proto/fw/out/nervous.html option A by extract-nervous.js), not a redraw.
   Same figure units as the product, so every layer registers exactly.
   Run from the repo root after gen.js and extract-nervous.js:
     node proto/body-map-spec/merge.js
   Writes merge.svg. render.js turns it into merge.png. */
const fs=require('fs'),path=require('path');
const {G,M,pts,CM}=require('./gen.js');
const NF=JSON.parse(fs.readFileSync(path.join(__dirname,'nervous-figures.json'),'utf8'));
const C={bg:'#0C0D12',ink:'#EFEDE8',mid:'#B4B0A8',dim:'#8a8f9c',grid:'#232734',line:'#3a3f4b',
 heat:'#D8924E',hot:'#D6524C',acc:'#7EB8D4',addr:'#9cc3b0',prop:'#d8b27a'};
const f=(n,d=2)=>(+n).toFixed(d);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const T=(x,y,s,o={})=>`<text x="${f(x)}" y="${f(y)}" fill="${o.c||C.ink}" font-size="${o.fs||14}" ${o.a?`text-anchor="${o.a}"`:''} ${o.w?`font-weight="${o.w}"`:''} font-family="Inter,Helvetica,Arial,sans-serif">${esc(s)}</text>`;

/* his regions, a first taxonomy. Boxes in figure units, clipped to the
   outline when drawn, smaller drawn last so they win the press, the way
   PAINREG already works. side: r is the person's right. */
const FRONT=[
 ['Head',[43,2,57,15.6]],['Neck',[45.5,15.6,54.5,19.4]],
 ['Chest',[41,19.4,59,33]],['Abdomen',[41,33,59,45]],
 ['Shoulder',[35,19.4,42,25],'r'],['Shoulder',[58,19.4,65,25],'l'],
 ['Upper arm',[32,25,41,36],'r'],['Upper arm',[59,25,68,36],'l'],
 ['Forearm',[29,36,40,48],'r'],['Forearm',[60,36,71,48],'l'],
 ['Palm',[27,48,40,62],'r'],['Palm',[60,48,73,62],'l'],
 ['Hip',[40,45,50,57],'r'],['Hip',[50,45,60,57],'l'],
 ['Thigh',[40,57,50,68],'r'],['Thigh',[50,57,60,68],'l'],
 ['Knee',[40,68,50,74],'r'],['Knee',[50,68,60,74],'l'],
 ['Shin',[40,74,50,88],'r'],['Shin',[50,74,60,88],'l'],
 ['Ankle',[40,88,50,92.5],'r'],['Ankle',[50,88,60,92.5],'l'],
 ['Foot',[38,92.5,50,99],'r'],['Foot',[50,92.5,62,99],'l']];
/* the back is seen from behind: the person's right is on the viewer's right */
const mir=b=>[100-b[2],b[1],100-b[0],b[3]];
const BACK=[
 ['Back of head',[43,2,57,15.6]],['Back of neck',[45.5,15.6,54.5,19.4]],
 ['Upper back',[41,24.5,59,33]],['Mid back',[41,33,59,40]],['Low back',[41,40,59,47]],['Sacrum',[46,47,54,53]],
 ['Trap',mir([37,18.6,49.4,24.5]),'r'],['Trap',mir([50.6,18.6,63,24.5]),'l'],
 ['Upper arm',mir([32,24.5,41,36]),'r'],['Upper arm',mir([59,24.5,68,36]),'l'],
 ['Forearm',mir([29,36,40,48]),'r'],['Forearm',mir([60,36,71,48]),'l'],
 ['Back of hand',mir([27,48,40,62]),'r'],['Back of hand',mir([60,48,73,62]),'l'],
 ['Buttock',mir([40,47,50,57]),'r'],['Buttock',mir([50,47,60,57]),'l'],
 ['Back of thigh',mir([40,57,50,68]),'r'],['Back of thigh',mir([50,57,60,68]),'l'],
 ['Back of knee',mir([40,68,50,74]),'r'],['Back of knee',mir([50,68,60,74]),'l'],
 ['Calf',mir([40,74,50,88]),'r'],['Calf',mir([50,74,60,88]),'l'],
 ['Heel',mir([40,88,50,99]),'r'],['Heel',mir([50,88,60,99]),'l']];
const area=b=>(b[2]-b[0])*(b[3]-b[1]);
const PRESS={view:'back',nm:'Trap',side:'l'};

function panel(ox,oy,S,vi){
 const view=vi===0?'front':'back', R=vi===0?FRONT:BACK, svg=NF.svgs[vi];
 const id='bc'+vi;
 let g=`<g transform="translate(${ox},${oy}) scale(${S}) translate(-24,0)">`;
 g+=`<defs><clipPath id="${id}"><path d="${G.BODYPATH}" transform="translate(${G.PMTX},${G.PMTY}) scale(${G.PMS})"/></clipPath>
  <radialGradient id="aoe${vi}"><stop offset="0" stop-color="${C.hot}" stop-opacity=".55"/><stop offset=".55" stop-color="${C.heat}" stop-opacity=".22"/><stop offset="1" stop-color="${C.heat}" stop-opacity="0"/></radialGradient></defs>`;
 /* 1. the grid, behind everything: the map */
 const u=5/CM;
 let gp='';for(let y=2;y<=98.01;y+=u)gp+=`M24 ${f(y)}H76`;for(let x=50-u*5;x<=50+u*5+.01;x+=u)gp+=`M${f(x)} 0V100`;
 g+=`<path d="${gp}" stroke="${C.grid}" stroke-width=".07" fill="none"/>`;
 /* 2. the man, opaque. The approved figure's own fill is 7 percent, which is
    what lets a glow read through him; here he is a solid surface. */
 g+=`<path d="${G.BODYPATH}" transform="translate(${G.PMTX},${G.PMTY}) scale(${G.PMS})" fill="#15171e" stroke="none"/>`;
 /* 3. regions: faint boundaries, clipped to him */
 const sorted=R.map((r,i)=>({r,i})).sort((a,b)=>area(b.r[1])-area(a.r[1]));
 let rg=`<g clip-path="url(#${id})">`;
 /* painted heat: cells a person painted, merged per step into one path each */
 const pressed=(r)=>view===PRESS.view&&r[0]===PRESS.nm&&r[2]===PRESS.side;
 sorted.forEach(({r})=>{const b=r[1];
  rg+=`<rect x="${b[0]}" y="${b[1]}" width="${f(b[2]-b[0])}" height="${f(b[3]-b[1])}" fill="${pressed(r)?'rgba(126,184,212,.16)':'none'}" stroke="${pressed(r)?C.acc:'#4a5060'}" stroke-width="${pressed(r)?.22:.09}"/>`;});
 if(view===PRESS.view){
  const b=R.find(pressed)[1], cx=(b[0]+b[2])/2, cy=(b[1]+b[3])/2;
  /* area of effect: one pre-soft radial gradient, no blur filter */
  rg+=`<ellipse cx="${f(cx)}" cy="${f(cy+1)}" rx="${f(8/CM)}" ry="${f(6/CM)}" fill="url(#aoe${vi})"/>`;
  /* heat cells, the painted ones only */
  const cells=[[0,0,.9],[1,0,.7],[0,1,.6],[-1,0,.45],[1,1,.35]];
  cells.forEach(([i,j,k])=>{rg+=`<rect x="${f(cx-u/2+i*u)}" y="${f(cy-u/2+j*u)}" width="${f(u)}" height="${f(u)}" fill="${C.hot}" fill-opacity="${f(k*0.38)}" stroke="none"/>`;});
 }
 rg+='</g>';g+=rg;
 /* 4. the nervous system and seats, as approved, untouched */
 g+=`<g>${svg.inner.replace(/class="body"[^>]*d="[^"]*"/,'fill="none" stroke="rgba(239,237,232,.26)" stroke-width=".13" d="'+G.BODYPATH+'"').replace(/<text[^>]*class="lbl"[^>]*>[^<]*<\/text>/g,'')}</g>`;
 /* 5. the tension line: pressed region to the spine at its nerve's level,
    the accessory nerve rising to C1 to C5. Brighter by tension. */
 if(view===PRESS.view){const b=R.find(pressed)[1],cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2;
  g+=`<path d="M${f(cx)} ${f(cy)} Q${f((cx+50)/2)} ${f(cy-3.2)} 50 ${f(17.2)}" fill="none" stroke="${C.hot}" stroke-width=".5" stroke-linecap="round" opacity=".95"/>`;
  g+=`<path d="M${f(cx)} ${f(cy)} Q${f((cx+50)/2)} ${f(cy-3.2)} 50 ${f(17.2)}" fill="none" stroke="${C.hot}" stroke-width="1.4" stroke-linecap="round" opacity=".18"/>`;}
 /* 6. the addresses on this view */
 pts.filter(p=>p.view===view||p.view==='both'||(view==='front'&&p.view==='head')).forEach(p=>{
  const x=view==='back'?100-p.x:p.x, r=p.view==='head'?.28:.36+.08*Math.min(p.ids.length,6);
  g+=`<circle cx="${f(x)}" cy="${f(p.y)}" r="${f(r)}" fill="${p.src==='proposed'?'#0C0D12':C.addr}" stroke="${p.src==='proposed'?C.prop:C.addr}" stroke-width=".13"/>`;});
 g+='</g>';
 /* region labels at plate scale: midline, and the person's right side */
 R.forEach(r=>{if(r[2]==='l')return;const b=r[1];const cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2;
  const sc=x=>ox+(x-24)*S;
  if(r[2]==='r'){const outer=view==='front'?b[0]:b[2];const lx=view==='front'?Math.min(outer,40)-0.6:Math.max(outer,60)+0.6;
   g+=`<line x1="${f(sc(cx))}" y1="${f(oy+cy*S)}" x2="${f(sc(view==='front'?25:75))}" y2="${f(oy+cy*S)}" stroke="#3a3f4b" stroke-width="1"/>`;
   g+=T(sc(view==='front'?24.6:75.4),oy+cy*S+4,r[0],{fs:11.5,c:C.mid,a:view==='front'?'end':'start'});}
  else g+=T(sc(view==='front'?76:24),oy+cy*S+4,r[0],{fs:11.5,c:C.dim,a:view==='front'?'start':'end'});});
 return g;}

const W=2140,H=1240,S=10.6;
let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${C.bg}"/>`;
s+=T(40,46,'The new man, merged: nervous system, seats, addresses, grid, regions',{fs:26,w:600});
s+=T(40,72,'Drawn on the front and back nervous system figure he locked in on 27 September (FW, option A). A proposal to react to, not the build.',{fs:13.5,c:C.dim});
s+=T(250,112,'Front',{fs:17,w:600});s+=panel(150,125,S,0);
s+=T(1010,112,'Back, seen from behind. Trap pressed',{fs:17,w:600});s+=panel(910,125,S,1);
/* the panel a press opens, his words turned into its parts */
const px=1560,py=130;let q=`<g transform="translate(${px},${py})"><rect width="540" height="560" rx="14" fill="#1A1D26" stroke="rgba(255,255,255,.09)"/>`;
const ex=M.regionExamples.find(e=>e.nm.startsWith('Trap'));
const L=[[26,40,'Trap, left, back view',{fs:20,w:600}],
 [26,68,'Tension here 40 percent',{fs:15,c:C.hot,w:600}],
 [26,88,'The number is his example. What it measures is question K.',{fs:12,c:C.dim}],
 [26,122,'Commonly presents as',{fs:12,c:C.dim}],
 [26,142,'Shoulders risen, trapezius knots, upper back burn.',{fs:14}],
 [26,176,'Your stories here',{fs:12,c:C.dim}],
 [26,196,`${ex.placedAddresses} addresses stand on this place: ${ex.placed.join(', ')}.`,{fs:14}],
 [26,216,`Today the whole shoulder band pulls ${ex.todayAddresses}.`,{fs:14,c:C.mid}],
 [26,236,'Stories that charged them are listed here, from the journal.',{fs:14,c:C.mid}],
 [26,270,'The pattern under it',{fs:12,c:C.dim}],
 [26,290,'Carrying what is not yours. Duty overshot into martyrdom.',{fs:14}],
 [26,310,'(today\'s shoulders line, in the engine)',{fs:12,c:C.dim}],
 [26,344,'What helps',{fs:12,c:C.dim}],
 [26,364,'Practices for this region. Content still to write, one set',{fs:14,c:C.mid}],
 [26,384,'per region, in the content pass he named.',{fs:14,c:C.mid}],
 [26,428,'The red line is the tension line: from the painted area',{fs:13,c:C.ink}],
 [26,448,'along its nerve (here the accessory nerve) to the spine.',{fs:13,c:C.ink}],
 [26,476,'The soft red patch is the area of effect. The squares',{fs:13,c:C.ink}],
 [26,496,'are the grid cells a person painted, 5 cm each.',{fs:13,c:C.ink}],
 [26,528,'Nothing here is a reading. The layout is the proposal.',{fs:12,c:C.dim}]];
L.forEach(l=>q+=T(...l));q+='</g>';s+=q;
const nx=1560;let ny=730;
[[`Regions: ${FRONT.length} on the front, ${BACK.length} on the back. A first taxonomy`,C.ink],
 ['from his list: head, neck, shoulders, torso, palms, hips,',C.ink],
 ['legs, knees, shins, ankle, feet. Arms, the back and the trap',C.ink],
 ['added, since he pressed "my back" and "my trap".',C.ink],
 [`Grid: ${M.grid.cells5cm} cells of 5 cm cover each view. A region is a set`,C.ink],
 ['of cells, so a press and a paint land on one map.',C.ink],
 [`Dots: ${pts.length} places for the addresses inside the body.`,C.ink],
 ['Hollow: proposed in FW, not yet in the engine.',C.ink],
 ['He is opaque here. The approved figure fills him at 7 percent',C.ink],
 ['and the shipped page at 8.5, which is what lets the glow read',C.ink],
 ['through him (glow.png).',C.ink],
 ['Labels on one side only. The other side mirrors it.',C.dim]].forEach(([t,c])=>{s+=T(nx,ny,t,{fs:12.5,c});ny+=22;});
s+=`<g transform="translate(${nx},${ny+14})">`+
 `<circle cx="7" cy="0" r="6" fill="${C.addr}"/>`+T(22,4.5,'address, measured',{fs:12.5})+
 `<circle cx="187" cy="0" r="6" fill="#0C0D12" stroke="${C.prop}" stroke-width="1.5"/>`+T(202,4.5,'address, proposed',{fs:12.5})+
 `<rect x="356" y="-7" width="14" height="14" fill="${C.hot}" fill-opacity=".3"/>`+T(378,4.5,'painted cell',{fs:12.5})+'</g>';
s+='</svg>';
fs.writeFileSync(path.join(__dirname,'merge.svg'),s);
console.log('merge.svg',FRONT.length,BACK.length);
