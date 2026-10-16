/* ============================================================
   Achievements mockups, shared parts. Mika's seat, 16 October 2026.
   Everything here is demo data, labelled as demo on the page. Nothing is
   read from a profile and nothing is stored.

   THE RULES THESE PAGES HOLD, every version, from the room's round 2:
   - the avatar is a whole figure; a ring appears only where something was
     released. No empty sockets, no grey track on a record surface, no
     "3 of 108", no grid of 112.
   - a released place cools from a warm wash to a thin ring in --sec-flow, as
     two layers: the warm fades out while the cool draws in. Only a release
     gives off light.
   - the turn ring has four quarters in the nav's four loop colours and is
     never printed as a number.
   - the horizon ring: a solid arc to the middle estimate whose fill equals the
     printed percent, a faint arc across how far off the estimate could be, and
     "A working figure, not a measurement." beside it.
   - points are called released and only rise. The buy line is one line of
     type, no light, no ring. Share is two rings that touch and never overlap.
   - nothing names an absence, there is no Next, no sound, no confetti, no
     toast, no alarm colour.
   ============================================================ */
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const Q=new URLSearchParams(location.search);
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
const dstr=iso=>{const p=iso.split('-').map(Number);return p[2]+' '+MON[p[1]-1];};
const fmt=n=>Math.round(n).toLocaleString('en-GB');
function hash(i,k){let h=(i*374761393+(k||0)*668265263)|0;h=(h^(h>>>13))*1274126177|0;h^=h>>>16;return (h>>>0)/4294967296;}
const PLACED=Object.keys(DATA.place).map(Number).sort((a,b)=>a-b);
const placed=id=>!!DATA.place[id];

/* plain words for an address: its nerve in lower case, and where on the body */
const nerve=id=>DATA.node[id].n.toLowerCase().replace(/\bl(\d)/g,'L$1');
const where=id=>{const y=DATA.place[id][1];return y<13?'in your head':y<21?'in your neck':y<34?'in your chest':y<45?'in your belly':'in your pelvis';};
const held=id=>DATA.node[id].k.replace(/-/g,' ').toLowerCase();
const cap1=s=>s.charAt(0).toUpperCase()+s.slice(1);

/* ---------- the three demo people ---------- */
const SAB_MEAN={Pleaser:'gives way so other people stay happy',Worrywart:'runs the worst case before it happens',
 Controller:'holds on by force',Avoider:'steps round whatever hurts',Judge:'measures everyone, starting with you'};
function people(){
 /* the third person has released at most of the measured places; which ones, and when, is fixed by a hash */
 const many=PLACED.filter(id=>hash(id,7)<.8&&id!==8);
 const start=Date.UTC(2026,0,20),span=Date.UTC(2026,9,15)-start;
 const iso=t=>new Date(t).toISOString().slice(0,10);
 const P3open=many.map(id=>[id,iso(start+span*hash(id,3))]);
 const last3=64;P3open.forEach(r=>{if(r[0]===last3)r[1]='2026-10-15';});
 if(!P3open.some(r=>r[0]===last3))P3open.push([last3,'2026-10-15']);
 return [
 {k:'new',label:'New, 3 released',age:29,released:3,turn:['discover','play'],last:65,
  opened:[[49,'2026-10-12'],[33,'2026-10-14'],[65,'2026-10-16']],
  ledger:[
   {kind:'open',n:1,at:'2026-10-16',what:65,ids:[65]},
   {kind:'buy',at:'2026-10-16'}]},
 {k:'mid',label:'Age 36, 120 released',age:36,released:120,turn:['discover','play','flow'],last:33,
  opened:[[79,'2026-08-11'],[1,'2026-08-19'],[54,'2026-08-30'],[2,'2026-09-06'],[75,'2026-09-14'],[66,'2026-09-20'],
   [65,'2026-09-27'],[49,'2026-10-02'],[44,'2026-10-07'],[64,'2026-10-10'],[33,'2026-10-14']],
  ledger:[
   {kind:'open',n:3,at:'2026-10-14',what:33,ids:[65,2,33]},
   {kind:'relrun',n:4,at:'2026-10-14'},
   {kind:'rituals',n:30,at:'2026-10-11'},
   {kind:'sab',n:1,at:'2026-10-02',what:'Pleaser',ids:[66,2,65]},
   {kind:'ritrun',n:12,at:'2026-09-28'},
   {kind:'shared',n:1,at:'2026-09-21'},
   {kind:'mask',n:1,at:'2026-09-20',what:'Preteen',means:'checks the room before it says the thing'},
   {kind:'recipe',n:1,at:'2026-09-08',what:'Box breathing, then a cold rinse'},
   {kind:'buy',at:'2026-09-03'}]},
 {k:'old',label:'Age 54, 18,000 released',age:54,released:18000,turn:['discover','play','flow','embody'],last:last3,
  opened:P3open,
  ledger:[
   {kind:'open',n:52,at:'2026-10-15',what:last3,ids:many},
   {kind:'relrun',n:26,at:'2026-10-15'},
   {kind:'rituals',n:90,at:'2026-10-13'},
   {kind:'recdone',n:3,at:'2026-10-12',what:'Cold water, then the long exhale'},
   {kind:'sab',n:9,at:'2026-10-09',what:'Worrywart',ids:[45,1,3]},
   {kind:'shared',n:5,at:'2026-10-04'},
   {kind:'recipe',n:7,at:'2026-10-01',what:'Cold water, then the long exhale'},
   {kind:'mask',n:4,at:'2026-09-30',what:'Ideological',means:'answers from the position instead of the moment'},
   {kind:'cx',n:6,at:'2026-09-22',what:'Self silencing with people pleasing',ids:[65,66]},
   {kind:'hx',n:2,at:'2026-08-05',what:'Collapse',means:DATA.hcx.find(h=>h.nm==='Collapse').d},
   {kind:'ritrun',n:41,at:'2026-07-19'},
   {kind:'buy',at:'2026-01-12'}]}];}
const PEOPLE=people();
let PI=Math.max(0,Math.min(2,+(Q.get('p')||1)));
let P=PEOPLE[PI];

/* ---------- the estimate. The owner's working figure: 2,000 patterns a decade of life,
   and how far off it could be, 1,000 to 3,000 a decade. No sex factor is applied. ---------- */
function estimate(p){
 const mid=200*p.age,lo=100*p.age,hi=300*p.age;
 const raw=p.released/mid*100;
 if(p.released>=mid)return {mid,lo,hi,state:'past'};
 if(raw<0.5)return {mid,lo,hi,state:'start'};
 /* the printed figure, and the fill drawn from the printed figure, so the two can never disagree */
 const shown=raw<10?Math.round(raw*10)/10:Math.round(raw);
 const bandLo=p.released/hi*100,bandHi=Math.min(100,p.released/lo*100);
 return {mid,lo,hi,state:'pct',pct:shown,txt:(raw<10?shown.toFixed(1):String(shown))+'%',bandLo,bandHi};}

/* ---------- geometry: angles are degrees clockwise from twelve o'clock ---------- */
const pol=(cx,cy,r,a)=>[cx+r*Math.sin(a*Math.PI/180),cy-r*Math.cos(a*Math.PI/180)];
function arc(cx,cy,r,a0,a1){const p0=pol(cx,cy,r,a0),p1=pol(cx,cy,r,a1);const big=(a1-a0)%360>180?1:0;
 return 'M'+p0[0].toFixed(2)+' '+p0[1].toFixed(2)+'A'+r+' '+r+' 0 '+big+' 1 '+p1[0].toFixed(2)+' '+p1[1].toFixed(2);}

/* ---------- the four loop steps, their nav icons from shell/body.html ---------- */
const LOOP=[
 {k:'discover',nm:'Discover',ic:'<path d="M2.8 12c2.4-4.2 5.5-6.3 9.2-6.3s6.8 2.1 9.2 6.3c-2.4 4.2-5.5 6.3-9.2 6.3S5.2 16.2 2.8 12z"/><circle cx="12" cy="12" r="2.9"/>'},
 {k:'play',nm:'Play',ic:'<circle cx="12" cy="12" r="9.2"/><path d="M10.2 8.6l5.2 3.4-5.2 3.4z"/>'},
 {k:'flow',nm:'Flow',ic:'<path d="M3 9.2c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0M3 14.8c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0"/>'},
 {k:'embody',nm:'Embody',ic:'<circle cx="12" cy="7.8" r="2.3"/><path d="M3.6 4.4c1.7 4.9 4.5 7.4 8.4 7.4s6.7-2.5 8.4-7.4M12 11.8v4.4M7.4 21c1.2-3.2 2.7-4.8 4.6-4.8s3.4 1.6 4.6 4.8"/>'}];

/* the turn ring. Four quarters, discover from twelve o'clock, each drawn only once that step is
   done in this turn. No track under it and no number on it. */
function turnRing(cx,cy,r,lit,o){o=o||{};const w=o.w||3,gap=o.gap||6,ir=o.iconR,is=o.iconS||18;let s='<g class="turn" aria-hidden="true">';
 LOOP.forEach((q,i)=>{if(lit.indexOf(q.k)<0)return;
  s+='<path d="'+arc(cx,cy,r,i*90+gap/2,i*90+90-gap/2)+'" fill="none" stroke-width="'+w+'" stroke-linecap="round" style="stroke:var(--sec-'+q.k+')"/>';
  if(ir){const c=pol(cx,cy,ir,i*90+45);s+='<g transform="translate('+(c[0]-is/2).toFixed(1)+' '+(c[1]-is/2).toFixed(1)+') scale('+(is/24)+')" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--sec-'+q.k+')">'+q.ic+'</g>';}});
 return s+'</g>';}
function turnKey(lit){return '<div class="tk">'+LOOP.filter(q=>lit.indexOf(q.k)>=0).map(q=>'<span style="--c:var(--sec-'+q.k+')"><svg viewBox="0 0 24 24" aria-hidden="true">'+q.ic+'</svg>'+q.nm+'</span>').join('')+'</div>';}
const TURN_SAYS='The ring round you is one turn of the loop: discover, play, flow, embody. A quarter lights when you do that step.';

/* the horizon ring. The solid arc is the printed percent, drawn from the printed figure. The faint
   arc is how far off the estimate could be. Past the middle estimate the ring is closed and no
   percent is printed, because no ring can be filled past full and stay true. */
function horizonRing(cx,cy,r,o){o=o||{};const E=estimate(P),sw=o.w||2,bw=o.bw||8;let s='<g class="horizon">';
 if(E.state==='pct'){
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" pathLength="1000" stroke-width="'+bw+'" stroke-dasharray="0 '+(E.bandLo*10).toFixed(2)+' '+((E.bandHi-E.bandLo)*10).toFixed(2)+' 1000" transform="rotate(-90 '+cx+' '+cy+')" style="stroke:var(--ach-flow);opacity:.26"/>';
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" pathLength="1000" stroke-width="'+sw+'" stroke-linecap="butt" stroke-dasharray="'+(E.pct*10).toFixed(2)+' 1000" transform="rotate(-90 '+cx+' '+cy+')" style="stroke:var(--ach-flow)"/>';
  const e=pol(cx,cy,r,E.pct*3.6);s+='<circle cx="'+e[0].toFixed(2)+'" cy="'+e[1].toFixed(2)+'" r="'+(sw*1.5)+'" style="fill:var(--bg);stroke:var(--ach-flow)" stroke-width="1.5"/>';}
 else if(E.state==='past'){s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke-width="'+sw+'" style="stroke:var(--ach-flow)"/>';}
 return s+'</g>';}
function horizonText(o){o=o||{};const E=estimate(P);let big,line;
 if(E.state==='pct'){big=E.txt+' <small>of your estimate</small>';line=fmt(P.released)+' released. About '+fmt(E.mid)+' patterns is the estimate for a person of '+P.age+'.';}
 else if(E.state==='start'){big=fmt(P.released)+' <small>released</small>';line='About '+fmt(E.mid)+' patterns is the estimate for a person of '+P.age+'.';}
 else{big=fmt(P.released)+' <small>released</small>';line='More than the whole estimate for a person of '+P.age+', which is about '+fmt(E.mid)+'. The estimate was too small for you.';}
 return '<div class="fig num">'+big+'</div><p>'+line+' <span class="wf">A working figure, not a measurement.</span></p>'
  +(o.how===false?'':howTo(E));}
function howTo(E){E=E||estimate(P);return '<details class="how"><summary>How this is worked out</summary>'
  +'<p>A pattern is one line of charge you let go. Each one counts once, and the count only rises.</p>'
  +'<p>The estimate is 2,000 patterns for every ten years of life. It is the founder\'s own figure, from one person, and it will be worked out again from real data.</p>'
  +(E.state==='pct'?'<p>The faint arc is how far off the estimate could be.</p>':'')
  +'<p>Your age is taken on the day the estimate is first shown, so a birthday never moves it.</p></details>';}

/* ---------- the icon grammar (Petra). Released: a ring with a 40 degree gap at one o'clock, and what
   was released drawn inside. Kept: a closed ring with the practice inside. Passed on: two rings that
   touch at one point and never overlap. ---------- */
const GAPRING='<path d="'+arc(12,12,10,50,370)+'"/>';
const ICON={
 open:GAPRING+'<path d="M7.4 12.6c1.15-1.25 2.3-1.25 3.45 0s2.3 1.25 3.45 0 2.3-1.25 3.45 0"/>',
 sab:GAPRING+'<circle cx="12" cy="12" r="2.8"/>',
 mask:GAPRING+'<path d="M7.5 12h9"/>',
 cx:GAPRING+'<circle cx="12" cy="8.9" r="1.7"/><circle cx="8.9" cy="14.2" r="1.7"/><circle cx="15.1" cy="14.2" r="1.7"/>',
 hx:GAPRING+'<path d="M12 8.9L8.9 14.2h6.2z"/><circle cx="12" cy="8.9" r="1.4"/><circle cx="8.9" cy="14.2" r="1.4"/><circle cx="15.1" cy="14.2" r="1.4"/>',
 relrun:GAPRING+'<circle cx="8" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="16" cy="12" r="1.3"/>',
 recipe:'<circle cx="12" cy="12" r="10"/><path d="M8.5 10h7M8.5 14h4.5"/>',
 recdone:'<circle cx="12" cy="12" r="10"/><path d="M8 9h8M8 12h8M8 15h8"/>',
 rituals1:'<circle cx="12" cy="12" r="10"/>',
 rituals2:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/>',
 rituals3:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2.2"/>',
 ritrun:'<circle cx="12" cy="12" r="10"/><circle cx="8" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="16" cy="12" r="1.3"/>',
 shared:'<circle cx="6.6" cy="12" r="5.4"/><circle cx="17.4" cy="12" r="5.4"/>'};
const FAMILY={open:'flow',sab:'flow',mask:'flow',cx:'flow',hx:'flow',relrun:'flow',recipe:'kept',recdone:'kept',rituals:'kept',ritrun:'kept',shared:'kept'};

/* ---------- the words, one sentence of meaning per tile, run through the voice gate ---------- */
function tileWords(e){const n=e.n,one=n===1;
 const W={
  get open(){return {t:one?'A nerve opened':fmt(n)+' nerves opened',s:(one?'It':'Each')+' went from impaired, where its charge got in the way, to open, where it no longer does.',
   l:(one?'':'Latest, ')+(one?cap1(nerve(e.what)):nerve(e.what))+', '+where(e.what)+'.'}},
  get sab(){return {t:one?'A saboteur released':fmt(n)+' saboteurs released',s:'A saboteur is a habit that works against what you want, and after your release the reading stopped finding it running.',
   l:(one?'The ':'Latest, the ')+e.what.toLowerCase()+': '+SAB_MEAN[e.what]+'.'}},
  get mask(){return {t:one?'A mask released':fmt(n)+' masks released',s:'A mask is a way of acting you learned to stay safe, and '+(one?'this one':'each of these')+' now reads quiet.',
   l:(one?'The ':'Latest, the ')+e.what.toLowerCase()+' mask: '+e.means+'.'}},
  get cx(){return {t:one?'A complex released':fmt(n)+' complexes released',s:'A complex is two patterns that fire together, and '+(one?'this pair':'each pair')+' no longer reads as running.',
   l:(one?'':'Latest, ')+(one?e.what:e.what.toLowerCase())+'.'}},
  get hx(){return {t:one?'A hypercomplex released':fmt(n)+' hypercomplexes released',s:'A hypercomplex is a family of patterns locked together, and '+(one?'this family':'each family')+' no longer reads as running.',
   l:(one?'':'Latest, ')+(one?e.what:e.what.toLowerCase())+': '+e.means+'.'}},
  get relrun(){return {t:'Longest release run, '+fmt(n)+' weeks',s:'Your most weeks in a row with at least one release.',l:'Set'}},
  get recipe(){return {t:one?'A recipe made':fmt(n)+' recipes made',s:'A recipe is a ritual you put together yourself.',l:(one?'':'Latest, ')+(one?e.what:e.what.toLowerCase())+'.'}},
  get recdone(){return {t:one?'A recipe completed':fmt(n)+' recipes completed',s:'You did every ritual in '+(one?'the recipe':'each recipe')+' at least once.',l:(one?'':'Latest, ')+(one?e.what:e.what.toLowerCase())+'.'}},
  get rituals(){return {t:'Rituals done on '+fmt(n)+' days',s:'A ritual counts once on each day you mark it done.',l:'Reached'}},
  get ritrun(){return {t:'Longest ritual run, '+fmt(n)+' days',s:'Your most days in a row with a ritual marked done.',l:'Set'}},
  get shared(){return {t:one?'You passed it on':'Passed on '+fmt(n)+' times',s:one?'You sent the app to someone.':'Each time, you sent the app to someone.',l:one?'':'Latest,'}}};
 return W[e.kind];}
function iconFor(e){if(e.kind==='rituals'){const tier=[1,7,30,90,365].indexOf(e.n)+1;return ICON['rituals'+Math.min(3,Math.max(1,tier-1))];}return ICON[e.kind];}

/* one tile. The buy line is not a tile: one line of type, no light, no ring */
function tileHtml(e){
 if(e.kind==='buy')return '<p class="buy" data-kind="buy">You took a risk on yourself. '+dstr(e.at)+'.</p>';
 const w=tileWords(e),fam=FAMILY[e.kind],ids=(e.ids||[]).filter(id=>P.opened.some(r=>r[0]===id));
 return '<article class="tile" data-kind="'+e.kind+'"'+(ids.length?' data-ids="'+ids.join(',')+'" tabindex="0"':'')+' style="--c:var(--ach-'+fam+')">'
  +'<span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">'+iconFor(e)+'</svg></span>'
  +'<h3>'+w.t+'</h3><p>'+w.s+'</p><div class="lt"><b>'+w.l+'</b> <span class="num">'+dstr(e.at)+'.</span></div></article>';}
function ledgerHtml(){return P.ledger.slice().sort((a,b)=>a.at<b.at?1:a.at>b.at?-1:(a.kind==='buy'?1:b.kind==='buy'?-1:0)).map(tileHtml).join('');}

/* ---------- the body. The product's own outline (engine/data/figure.js BODYPATH) in figure units,
   a 100 by 100 box, outlined in --dim, lit from the upper left. A ring at every released place,
   on the pixel the Body page puts that address. ---------- */
let SVGN=0;
function bodySvg(o){
 const h=o.h,k=h/100,vx=o.vx||[25,50],W=vx[1]*k,ringR=(o.ringPx||4)/k,id='b'+(SVGN++),B=DATA.body;
 let s='<svg class="bodysvg" width="'+W.toFixed(1)+'" height="'+h+'" viewBox="'+vx[0]+' 0 '+vx[1]+' 100" role="img" aria-label="Your figure, with a ring at each place you released something">'
  +'<defs><radialGradient id="figLight" cx=".34" cy=".14" r=".95"><stop offset="0" stop-color="#EFEDE8" stop-opacity=".085"/><stop offset=".55" stop-color="#EFEDE8" stop-opacity=".03"/><stop offset="1" stop-color="#EFEDE8" stop-opacity=".012"/></radialGradient>'
  +'<radialGradient id="warm"><stop offset="0" stop-color="#D19255" stop-opacity=".7"/><stop offset=".55" stop-color="#C4635E" stop-opacity=".28"/><stop offset="1" stop-color="#C4635E" stop-opacity="0"/></radialGradient>'
  +'<filter id="soft" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="'+(1.6/k).toFixed(3)+'"/></filter></defs>'
  +(o.under||'')
  +'<path class="fig" transform="translate('+B.tx+','+B.ty+') scale('+B.s+')" d="'+B.d+'"/>'
  +(o.noRings?'':ringsSvg(ringR))+(o.over||'')+'</svg>';
 /* stroke widths are set in pixels and turned into figure units here, so a ring is 1.5px at any size */
 s=s.replace('<svg class="bodysvg"','<svg class="bodysvg" style="--rw:'+(1.5/k).toFixed(4)+'px;--gw:'+(4/k).toFixed(4)+'px"');
 return s;}
function ringsSvg(R){return P.opened.filter(r=>placed(r[0])).map(r=>{const p=DATA.place[r[0]];
 return '<g class="ar" data-id="'+r[0]+'" data-at="'+r[1]+'" transform="translate('+p[0]+' '+p[1]+')">'
  +'<circle class="w" r="'+(R*3.2).toFixed(3)+'"/><circle class="g" r="'+R.toFixed(3)+'"/>'
  +'<circle class="r" r="'+R.toFixed(3)+'" pathLength="100" stroke-dasharray="100" stroke-dashoffset="0" transform="rotate(-90)"/></g>';}).join('');}

/* ---------- the tooltip: press or hover near a ring ---------- */
let TIP;
function tipAt(el,x,y){const id=+el.dataset.id,at=el.dataset.at;
 TIP.innerHTML='<b>'+cap1(nerve(id))+', '+where(id)+'</b>It held '+held(id)+'. Released '+dstr(at)+'.';
 TIP.classList.add('on');const r=TIP.getBoundingClientRect();
 let L=x+14,T=y-r.height-10;if(L+r.width>innerWidth-8)L=x-r.width-14;if(T<8)T=y+16;TIP.style.left=L+'px';TIP.style.top=T+'px';}
function nearestRing(x,y,max){let b=null,bd=max*max;$$('.ar').forEach(g=>{const r=g.getBoundingClientRect();if(!r.width&&!r.height)return;
 const dx=r.left+r.width/2-x,dy=r.top+r.height/2-y,d=dx*dx+dy*dy;if(d<bd){bd=d;b=g;}});return b;}
function wireTips(){
 document.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const g=e.target.closest&&e.target.closest('[data-hit]');
  const n=g?nearestRing(e.clientX,e.clientY,22):null;if(n){tipAt(n,e.clientX,e.clientY);hot([+n.dataset.id]);}else if(TIP.classList.contains('on')&&!TIP.dataset.pin){TIP.classList.remove('on');hot([]);}});
 document.addEventListener('click',e=>{const g=e.target.closest&&e.target.closest('[data-hit]');const n=g?nearestRing(e.clientX,e.clientY,26):null;
  if(n){tipAt(n,e.clientX,e.clientY);TIP.dataset.pin=1;hot([+n.dataset.id]);}else if(!e.target.closest('.tile')){TIP.classList.remove('on');delete TIP.dataset.pin;hot([]);}});}
function hot(ids){$$('.ar').forEach(g=>g.classList.toggle('hot',ids.indexOf(+g.dataset.id)>=0));}
function wireTiles(){$$('.tile[data-ids]').forEach(t=>{const ids=t.dataset.ids.split(',').map(Number);
 const on=()=>{$$('.tile.on').forEach(x=>x.classList.remove('on'));t.classList.add('on');hot(ids);};
 const off=()=>{t.classList.remove('on');hot([]);};
 t.addEventListener('mouseenter',on);t.addEventListener('mouseleave',off);t.addEventListener('focus',on);t.addEventListener('blur',off);
 t.addEventListener('click',on);});}

/* ---------- the release moment: the warm fades out (900ms, ease in) while from 500ms the cool ring
   draws clockwise from twelve o'clock (700ms, ease out). It ends still. A person who asked for less
   motion gets the end state, which is what is already on the page. ---------- */
const HOOKS={replay:[],render:[]};
const EASE_IN='cubic-bezier(.4,0,1,1)',EASE_OUT='cubic-bezier(.22,1,.36,1)';
function replay(){
 const st=$('#demo-status');
 if(REDUCED){st.textContent='Less motion is on in your system, so the end state is shown and nothing moves.';return;}
 st.textContent='';
 document.getAnimations().forEach(a=>a.cancel());
 $$('.ar[data-id="'+P.last+'"]').forEach(g=>{
  const w=g.querySelector('.w'),r=g.querySelector('.r'),gl=g.querySelector('.g');
  if(w)w.animate([{opacity:1},{opacity:0}],{duration:900,easing:EASE_IN,fill:'both'});
  if(r)r.animate([{strokeDashoffset:100},{strokeDashoffset:0}],{duration:700,delay:500,easing:EASE_OUT,fill:'both'});
  if(gl)gl.animate([{opacity:0},{opacity:.35}],{duration:700,delay:500,easing:EASE_OUT,fill:'both'});});
 HOOKS.replay.forEach(f=>f());}
/* for the pictures: hold every animation at one moment */
window.__hold=t=>{replay();document.getAnimations().forEach(a=>{a.pause();a.currentTime=t;});HOOKS.replay.forEach(f=>f.hold&&f.hold(t));};

/* ---------- the page frame: the demo bar and the product's bar ---------- */
function frame(){
 const app=$('#app');
 const vlinks=VERSIONS.map(v=>'<a href="'+v.id+'.html?p='+PI+'"'+(v.id===VERSION.id?' aria-current="page"':'')+'>'+v.n+'. '+v.name+'</a>').join('');
 app.innerHTML='<div class="demo" role="region" aria-label="Mockup controls">'
  +'<span class="dl"><b>Achievements mockup '+VERSION.n+', '+VERSION.name.toLowerCase()+'.</b> Demo data, not a real person.</span>'
  +'<nav aria-label="The four mockups">'+vlinks+'</nav><span class="sp"></span>'
  +'<div class="grp" role="group" aria-label="Demo person">'+PEOPLE.map((p,i)=>'<button class="chip" type="button" data-p="'+i+'" aria-pressed="'+(i===PI)+'">'+p.label+'</button>').join('')+'</div>'
  +'<button class="chip" type="button" id="rp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="'+arc(12,12,8,40,330)+'"/><path d="M8.7 4.6 12 4l-.7 3.3"/></svg>Replay the last release</button>'
  +'<span id="demo-status" class="small" role="status" aria-live="polite"></span></div>'
  +'<header class="appbar"><span class="wm">atüned</span><div class="secs" aria-hidden="true">'
  +LOOP.map(q=>'<span class="sec" style="--c:var(--sec-'+q.k+')"><svg viewBox="0 0 24 24">'+q.ic+'</svg><span>'+q.nm+'</span></span>').join('')
  +'</div><span class="pg">Achievements</span></header><main id="main"></main>';
 TIP=document.createElement('div');TIP.className='tip';TIP.setAttribute('role','tooltip');document.body.appendChild(TIP);
 $$('.demo [data-p]').forEach(b=>b.addEventListener('click',()=>{PI=+b.dataset.p;P=PEOPLE[PI];
  $$('.demo [data-p]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  $$('.demo nav a').forEach((a,i)=>a.href=VERSIONS[i].id+'.html?p='+PI);draw();}));
 $('#rp').addEventListener('click',replay);
 wireTips();}
function draw(){TIP.classList.remove('on');delete TIP.dataset.pin;render();wireTiles();HOOKS.render.forEach(f=>f());}
let RT;addEventListener('resize',()=>{clearTimeout(RT);RT=setTimeout(draw,120);});
function start(){frame();draw();if(Q.has('t'))window.__hold(+Q.get('t'));}
const narrow=()=>innerWidth<700;
