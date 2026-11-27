/* Views mockups, drawn inside the real app shell.
   VW.mount(tab, who) fills the centre stage host of the live document.
   Real reads come from DATA, dumped from the product's own engine
   (profiles Derek, Wren, James, Ana, Marcus, Nkem, Sofia and a blank).
   Hand written things sit under MOCK and are listed in NOTES.md. */
const VW=(function(){
const D=VWDATA, BODY=VWBODY;
const SC={Root:'var(--root)',Sacral:'var(--sacral)',Solar:'var(--solar)',Heart:'var(--heart)',Throat:'var(--throat)','3rd Eye':'var(--eye)',Crown:'var(--crown)'};
const BK={Crown:'crown','3rd Eye':'eye',Throat:'throat',Heart:'heart',Solar:'solar',Sacral:'sacral',Root:'root'};
const OUTAX=['Anger','Disgust','Anticipation','Surprise'];
const ROOTSAY={Architect:'earth, fixed. It builds and holds',Engine:'fire, cardinal. It starts things and burns',Weaver:'water, mutable. It joins and dissolves',Witness:'air. It watches and names'};
const NW=['none','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
const nw=n=>NW[n]!==undefined?NW[n]:String(n);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const lc=s=>String(s||'').toLowerCase();
const cap=s=>{s=String(s||'');return s.charAt(0).toUpperCase()+s.slice(1);};
const sent=s=>cap(lc(s));
const about=a=>lc(a).replace(/^([^,]+), ([^,]+)$/,'$1 and $2');
const col=b=>SC[b]||'var(--mid)';
const DIM='color-mix(in srgb,var(--ink) 34%,transparent)';

/* ---------- MOCK. Hand written, not read from the engine ---------- */
const BEH={ /* one plain sentence per behaviour word. The engine holds only the one word, field d. */
 'Need For Approval':'You check the room before you decide. You shape what you say to fit it.',
 'Manipulation Through Emotion':'You get what you need through how other people feel, and stop short of asking.',
 'Shame':'You treat what the body says as weakness, and you override it.',
 'Guilt':'You do more than your share, to pay a debt nobody asked for.',
 'Compulsion':'You repeat the same drive again and again, because stopping feels unsafe.',
 'Pride':'You hold yourself above the field, and it costs you the people in it.',
 'Speaking To Be Right':'You argue to win the point, and the point outlasts the person.',
 'Self-Exclusion':'You stand a little outside the group, so you are never refused.',
 'False Humility':'You play yourself down, so that someone else will say it for you.',
 'Seeking Validation':'You wait for a nod before you trust your own work.',
 'Blame':'You place the cause outside yourself, so it stays unfixed.',
 'Arrogance':'You decide you know better, and stop listening.',
 'Competition':'You turn every exchange into a count.',
 'Obsession':'You return to the same thought until it crowds out the day.'};
const HIST={Derek:{when:'24 September',up:true,prevHeavy:'Solar',rising:['Need for approval','Pride'],easing:['Blame'],steady:6,entries:2,trend:['Up, a little','Level','Not enough yet'],bars:[3,4,4,5,4,5,6]},
 Wren:{when:'12 September',up:false,flat:true,prevHeavy:'Root',rising:[],easing:['Self-exclusion'],steady:0,entries:0,trend:['Level','Level','Level'],bars:[2,2,2,2,2,2,2]}};
const CLIENTS=[
 {k:'Nkem',active:false,ch:'No entries for nine days. The heaviest seat has not moved.',date:'Reading of 23 September'},
 {k:'Ana',active:true,ch:'Self-judgment at the heart is heavier since your last visit.',date:'Reading of 1 October'},
 {k:'James',active:true,ch:'Blame eased at the heart after a release.',date:'Reading of 1 October'},
 {k:'Derek',active:true,ch:'Need for approval rose at the sacral. Two new entries.',date:'Reading of 1 October'},
 {k:'Wren',active:false,ch:'Quiet. Nothing new since 12 September.',date:'Reading of 12 September'},
 {k:'Marcus',revoked:'14 September',date:'Last reading 12 September'}];

/* ---------- reads over the data ---------- */
const person=k=>D[k]||D.You;
const isStranger=d=>!!d.unread;
const seatName=b=>b;
function intensity(s){return Math.max(0,Math.min(1,Math.max((s.max-2.5)/4.5,s.load/0.22)));}
/* the heaviest seat, read off the same brightness the picture draws. The engine's darkB is a mean over every address in a seat, which names Throat for Wren, who holds nothing there. */
function hb(d){const t=d.seats.slice().sort((a,b)=>intensity(b)-intensity(a)||b.max-a.max)[0];return (t&&intensity(t)>0)?t.band:d.darkB;}
function stopSeat(d){let o=null;d.seats.forEach(s=>{if(s.held)o=s;});return o;}
function seatOf(d,b){return d.seats.find(s=>s.band===b);}
function pats(d,n){
 const all=d.top.filter(p=>p.sq>=3), base=all.length?all:d.top.slice(0,1).filter(p=>p.sq>=1), pick=[], seen={};
 d.seats.filter(s=>intensity(s)>=.5).sort((a,b)=>b.max-a.max).forEach(s=>{const p=base.find(x=>x.b===s.band);if(p&&pick.length<n){pick.push(p);seen[p.i]=1;}});
 base.forEach(p=>{if(pick.length<n&&!seen[p.i]){pick.push(p);seen[p.i]=1;}});
 return pick.sort((a,b)=>b.sq-a.sq);}
function energyWord(X){return X<.2?'Almost none of it is left for use.':X<.4?'Little of it is left for use.':X<.65?'Some of it is left for use.':'Most of it is still yours to use.';}
function leanWord(l){return l<-.2?'The field leans inward.':l>.2?'The field leans outward.':'Inward and outward are about level.';}
function steerWord(d){return d.steer==='withheld'?'The drag is steering. The day decides.':'The will is steering.';}
const dirOf=p=>OUTAX.includes(p.cf)?'out':'in';
const NOSTORY='No story yet. Write what happened and this fills in.';

/* ---------- icons, ring not fill ---------- */
const SUMIC={
 read:'<circle cx="12" cy="12" r="8.4"/><path d="M12 6.2v2.2M12 15.6v2.2M6.2 12h2.2M15.6 12h2.2"/><circle cx="12" cy="12" r="1.6"/>',
 drive:'<path d="M4 6h6v6h6v6h4"/>',
 run:'<path d="M19.5 12a7.5 7.5 0 11-2.2-5.3"/><path d="M19.5 4.5v4h-4"/>',
 cost:'<path d="M8.4 10a3.6 3.6 0 117.2 0"/><path d="M6 10h12l2 10H4z"/>',
 todo:'<circle cx="12" cy="12" r="8.4"/><path d="M8.4 12h7M12.6 8.4L16.2 12l-3.6 3.6"/>',
 src:'<circle cx="12" cy="12" r="8.4"/><path d="M12 8v4.4l2.8 1.8"/>',
 who:'<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-4 3.5-6 7-6s6.2 2 7 6"/>',
 show:'<circle cx="12" cy="12" r="8.4"/><path d="M7.5 12.5c1.4-2.6 3-3.8 4.5-3.8s3.1 1.2 4.5 3.8c-1.4 2.6-3 3.8-4.5 3.8s-3.1-1.2-4.5-3.8z"/>',
 chg:'<circle cx="12" cy="12" r="8.4"/><path d="M8 14l3-3 2 2 3-3.4"/>',
 int:'<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="3.2"/>',
 exp:'<circle cx="12" cy="12" r="8.4"/><path d="M15.2 8.8l-1.6 4.8-4.8 1.6 1.6-4.8z"/>',
 chev:'<path d="M6 9.5l6 6 6-6"/>'};
const sumIc=(k,cls)=>`<svg class="${cls||'sg-ic'}" viewBox="0 0 24 24" aria-hidden="true">${SUMIC[k]}</svg>`;
const ring=(c,r=9,w=1.8,inner='',z=26)=>`<svg width="${z}" height="${z}" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="${r}" fill="none" stroke="${c}" stroke-width="${w}"/>${inner}</svg>`;
const stk=(c,w=1.6)=>`fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const icIn=c=>ring(c,10,1.8,`<g ${stk(c)}><path d="M5.5 13h4M20.5 13h-4M13 5.5v4M13 20.5v-4"/></g>`);
const icOut=c=>ring(c,10,1.8,`<g ${stk(c)}><path d="M9.5 13h-4M16.5 13h4M13 9.5v-4M13 16.5v4"/></g>`);
const icBeh=c=>ring(c,10,1.8,`<path d="M8 13h10M14.5 9.5L18 13l-3.5 3.5" ${stk(c)}/>`);
const icUp=c=>ring(c,10,1.8,`<path d="M13 18V8M8.5 12.5L13 8l4.5 4.5" ${stk(c)}/>`);
const icDn=c=>ring(c,10,1.8,`<path d="M13 8v10M8.5 13.5L13 18l4.5-4.5" ${stk(c)}/>`);
const icPlus=c=>ring(c,10,1.8,`<path d="M13 8v10M8 13h10" ${stk(c)}/>`);
const icLevel=c=>ring(c,10,1.8,`<path d="M7.5 13h11" ${stk(c)}/>`);
const avatar=(nm,c,z)=>`<svg width="${z}" height="${z}" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16.5" fill="none" style="stroke:${c}" stroke-width="1.7"/><text x="20" y="26" text-anchor="middle" font-size="17" font-weight="500" style="fill:var(--ink)">${esc(nm.charAt(0))}</text></svg>`;
const lampIc=c=>`<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="${c}" stroke-width="1.8"/><circle cx="12" cy="12" r="11" fill="none" stroke="${c}" stroke-opacity=".25" stroke-width="1"/></svg>`;
const ELEM={Fire:'<path d="M12 4c.6 3 3.6 4.2 3.6 8a3.6 3.6 0 0 1-7.2 0c0-1.8 1.2-2.4 1.8-4.2.6 1.2 1.2 1.2 1.8.6-.6-1.8-.6-3 0-4.4z"/>',Earth:'<path d="M6 16.5h12M7.5 13h9M9.5 9.5h5"/>',Water:'<path d="M12 5c2.4 3 4.2 4.8 4.2 7.2a4.2 4.2 0 0 1-8.4 0C7.8 9.8 9.6 8 12 5z"/>',Wood:'<path d="M12 18V8M12 12.5c-3 0-4.2-1.8-4.2-3.6 3 0 4.2 1.2 4.2 3.6zM12 14.5c2.4 0 4.2-1.2 4.2-3.6-3 0-4.2 1.8-4.2 3.6z"/>',Metal:'<circle cx="12" cy="12" r="3.4"/>'};
/* a mark in a ring, the product's own .sg-c-g */
const sgRing=(inner,c)=>`<span class="sg-c-g" style="--rc:${c||'var(--accent)'}">${inner}</span>`;
const sgSvg=(inner)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;
const glyphMark=g=>`<span class="s-uni" style="font-size:20px;line-height:1">${g}</span>`;
const numMark=n=>`<span class="s-num-g">${n}</span>`;

/* ============ 1. THE READING ============ */
function conDraw(root,d,o){
 o=o||{};
 const stranger=isStranger(d), tier=d.tierObj, stop=stopSeat(d), heavy=stranger?null:hb(d);
 const lamp=(lab,val,c)=>`<div class="lamp">${lampIc(c)}<div><span>${lab}</span><b>${val}</b></div></div>`;
 const lamps=`<div class="lamps">${lamp('Heaviest seat',stranger?'–':esc(heavy),stranger?DIM:col(heavy))}${lamp('Flow stops at',stranger?'–':(stop?esc(stop.band):'Nowhere'),stranger?DIM:(stop?col(stop.band):'var(--mid)'))}${lamp('Steering',stranger?'–':(d.steer==='withheld'?'The day':'The will'),'var(--accent)')}</div>`;
 const head=o.nohead?'':`<div class="con-h"><div class="con-t"><b>${stranger?'–':esc(tier.nm)}${stranger?'':`<small>${esc(tier.state)}</small>`}</b><p>${stranger?esc(NOSTORY):esc(tier.energy)}</p></div>${lamps}</div>`;
 root.className='vw-well'+(o.sm?' sm':'');
 root.style.setProperty('--glow',stranger?'var(--accent)':col(heavy));
 root.innerHTML=head+'<div class="con-stage"></div><div class="con-note"></div><div class="con-key"></div>';
 const st=root.querySelector('.con-stage'), W=st.clientWidth||800, narrow=W<640, id=o.id||'x';
 const maxC=o.max||(narrow?4:5), minH=narrow?440:(o.minH||580), sc=minH/640, padT=8;
 const crop=narrow?[196,376]:[110,462], gut=narrow?0:176;
 const figW=(crop[1]-crop[0])*sc, cx=gut+(286-crop[0])*sc, callX=gut+figW+(narrow?18:100), cw=Math.min(W-callX,narrow?9999:600);
 const sy=s=>padT+s.src*sc;
 const P=stranger?[]:pats(d,maxC);
 let html='';
 if(stranger){for(let i=0;i<(narrow?3:4);i++)html+=`<div class="cl dash" style="--c:${DIM};width:${cw}px"><div class="cl-n">–</div><div class="cl-s">–</div><p class="cl-m">–</p><div class="cl-g"></div></div>`;}
 P.forEach(p=>{const s=seatOf(d,p.b),c=col(p.b);
  html+=`<div class="cl" style="--c:${c};width:${cw}px"><div class="cl-n">${esc(sent(p.k))}</div><div class="cl-s"><i></i>${esc(s.band)}, ${esc(s.seat)}</div><p class="cl-m">Concerns ${esc(about(p.a))}. Shows up as ${esc(lc(p.d))}.</p><div class="cl-g"><b style="width:${Math.min(100,p.sq*10)}%"></b><u style="left:40%"></u><u style="left:50%"></u></div></div>`;});
 st.insertAdjacentHTML('beforeend',html);
 const els=[...st.querySelectorAll('.cl')], hs=els.map(e=>e.offsetHeight);
 const tgt=P.map((p,i)=>sy(seatOf(d,p.b))-hs[i]/2+8);
 const order=P.map((p,i)=>i).sort((a,b)=>tgt[a]-tgt[b]||P[b].sq-P[a].sq), top=P.map(()=>0);
 let prev=-1e9; order.forEach(i=>{top[i]=Math.max(tgt[i],prev+14,0);prev=top[i]+hs[i];});
 if(P.length){let sh=0;order.forEach(i=>sh+=tgt[i]-top[i]);sh/=order.length;sh=Math.max(sh,-top[order[0]]);if(sh<0)order.forEach(i=>top[i]+=sh);}
 if(stranger){let y=sy(d.seats[2])-30;els.forEach((e,i)=>{e.style.top=y+'px';e.style.left=callX+'px';y+=hs[i]+22;});}
 else els.forEach((e,i)=>{e.style.top=top[i]+'px';e.style.left=callX+'px';});
 let H=minH+padT*2; els.forEach((e,i)=>{H=Math.max(H,e.offsetTop+hs[i]+12);});
 st.style.height=H+'px';
 /* the tube: a pinched column. Its half width at each seat is the seat's own pass, the share of flow it lets through. */
 const hw=s=>stranger?11:5+22*Math.pow(Math.max(0,Math.min(1,s.pass)),3);
 const ys=d.seats.map(sy), ws=d.seats.map(hw);
 const edge=sgn=>{let p=`M${cx+sgn*ws[0]} ${ys[0]-16}`;p+=` L${cx+sgn*ws[0]} ${ys[0]}`;for(let i=1;i<ys.length;i++){const m=(ys[i-1]+ys[i])/2;p+=` C${cx+sgn*ws[i-1]} ${m} ${cx+sgn*ws[i]} ${m} ${cx+sgn*ws[i]} ${ys[i]}`;}return p+` L${cx+sgn*ws[6]} ${ys[6]+22}`;};
 let defs=`<linearGradient id="fd${id}" x1="0" y1="0" x2="0" y2="1"><stop offset=".70" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>`;
 Object.keys(SC).forEach(b=>{defs+=`<radialGradient id="hg${id}${BK[b]}"><stop offset="0" style="stop-color:${SC[b]};stop-opacity:.85"/><stop offset=".45" style="stop-color:${SC[b]};stop-opacity:.28"/><stop offset="1" style="stop-color:${SC[b]};stop-opacity:0"/></radialGradient>`;});
 const figH=640*sc;
 let g='';
 d.seats.forEach(s=>{const y=sy(s);g+=`<line x1="${narrow?0:gut-8}" x2="${cx}" y1="${y}" y2="${y}" stroke="color-mix(in srgb,var(--ink) 9%,transparent)" stroke-dasharray="2 5"/>`;});
 g+=`<mask id="mk${id}"><rect x="${gut}" y="${padT}" width="${figW}" height="${figH}" fill="url(#fd${id})"/></mask>`;
 g+=`<svg x="${gut}" y="${padT}" width="${figW}" height="${figH}" viewBox="${crop[0]} 0 ${crop[1]-crop[0]} 640" mask="url(#mk${id})" overflow="hidden"><path d="${BODY}" fill="none" style="stroke:color-mix(in srgb,var(--ink) 40%,transparent)" stroke-width="1.3" vector-effect="non-scaling-stroke"/></svg>`;
 g+=`<path d="${edge(-1)}" fill="none" style="stroke:color-mix(in srgb,var(--ink) 30%,transparent)" stroke-width="1.2" ${stranger?'stroke-dasharray="3 4"':''}/><path d="${edge(1)}" fill="none" style="stroke:color-mix(in srgb,var(--ink) 30%,transparent)" stroke-width="1.2" ${stranger?'stroke-dasharray="3 4"':''}/>`;
 const xs={}, baseX=gut+figW+(narrow?2:12), stepX=narrow?5:9;
 const up=P.map((p,i)=>i).filter(i=>els[i].offsetTop+12<sy(seatOf(d,P[i].b))).sort((a,b)=>els[a].offsetTop-els[b].offsetTop);
 const dn=P.map((p,i)=>i).filter(i=>els[i].offsetTop+12>=sy(seatOf(d,P[i].b))).sort((a,b)=>els[b].offsetTop-els[a].offsetTop);
 up.forEach((i,r)=>xs[i]=baseX+r*stepX); dn.forEach((i,r)=>xs[i]=baseX+r*stepX);
 P.forEach((p,i)=>{const s=seatOf(d,p.b),y=sy(s),c=col(p.b),ty=els[i].offsetTop+12;
  g+=`<path d="M${cx+30} ${y} H${xs[i]} V${ty} H${callX-4}" fill="none" style="stroke:${c}" stroke-opacity=".55" stroke-width="1"/><circle cx="${callX-4}" cy="${ty}" r="2.3" fill="none" style="stroke:${c}" stroke-width="1.2"/>`;});
 d.seats.forEach(s=>{const I=stranger?0:intensity(s),y=sy(s),c=col(s.band);
  const lab=narrow?'':`<text x="${gut-12}" y="${y-1}" text-anchor="end" font-size="13.5" font-weight="600" style="fill:${I>0.05?'var(--ink)':'var(--mid)'}">${esc(s.band)}</text><text x="${gut-12}" y="${y+14}" text-anchor="end" font-size="12" style="fill:var(--dim)">${esc(s.seat)}</text>`;
  if(I>0.02)g+=`<circle class="halo" cx="${cx}" cy="${y}" r="${(20+46*I).toFixed(1)}" fill="url(#hg${id}${BK[s.band]})" opacity="${(.3+.7*I).toFixed(2)}"/>`;
  g+=`<circle cx="${cx}" cy="${y}" r="${(I>0.02?6.5+4.5*I:5).toFixed(1)}" fill="none" style="stroke:${I>0.02?c:DIM}" stroke-width="${I>0.02?1.9:1.4}" stroke-opacity="${I>0.02?(.55+.45*I).toFixed(2):1}"/>`+lab;});
 st.insertAdjacentHTML('afterbegin',`<svg width="${W}" height="${H}" aria-hidden="true"><defs>${defs}</defs>${g}</svg>`);
 const shownHeld=P.filter(p=>p.sq>=4).length, rest=Math.max(0,d.carrying-shownHeld);
 root.querySelector('.con-note').textContent=stranger?'':
  (P.length?'':'Nothing held.')+(rest?`${P.length?' ':''}${cap(nw(rest))} more addresses are held, lighter than these. The Field draws every one.`:(P.length?'Nothing else is held.':''));
 const sm=(x)=>x.replace('width="26" height="26"','width="20" height="20"');
 root.querySelector('.con-key').innerHTML=
  `<span>${sm(ring('var(--solar)',8,1.8))}A brighter ring holds more charge at that seat.</span>
   <span>${sm(ring(DIM,7,1.4))}A dim ring holds nothing.</span>
   <span><svg width="22" height="30" viewBox="0 0 22 30" aria-hidden="true"><path d="M4 2C4 9 7 12 7 15S4 21 4 28M18 2C18 9 15 12 15 15S18 21 18 28" fill="none" style="stroke:var(--mid)" stroke-width="1.2"/></svg>The tube narrows where a seat lets less flow through.</span>
   <span><svg width="46" height="12" aria-hidden="true"><rect x="0" y="4" width="46" height="4" rx="2" style="fill:color-mix(in srgb,var(--ink) 12%,transparent)"/><rect x="0" y="4" width="26" height="4" rx="2" style="fill:var(--sacral)"/><rect x="18" y="1" width="1" height="10" style="fill:var(--ink)" fill-opacity=".5"/><rect x="23" y="1" width="1" height="10" style="fill:var(--ink)" fill-opacity=".5"/></svg>The gauge fills with charge. The first tick is where an address counts as held. The second is where it runs hot.</span>`;
}
function readingCard(d,o){
 return `<section class="sg-card vw-card" data-grp="read"><h2 class="sg-zh">${sumIc('read')}<span>The Reading</span><span class="vw-flag">mock</span></h2>
  <p class="sum-p plain">Where charge is held in the body, and the addresses holding the most. A brighter ring is more charge.</p><div id="${o.id}"></div></section>`;
}

/* ============ 2. WHAT IT DRIVES ============ */
function flowDraw(root,d,o){
 o=o||{};
 const stranger=isStranger(d);
 root.className='vw-well vw-wellflow';
 const energy=stranger?'–':energyWord(d.X), lean=stranger?'–':leanWord(d.lean);
 root.innerHTML=`<div class="fl-h"><b>${stranger?'Nothing is running yet':'What runs, and what it costs'}</b><p>${stranger?esc(NOSTORY):'Read left to right. What is held, what you do because of it, and where the cost lands.'}</p></div><div class="fl-body"></div><div class="fl-verdict"></div><div class="fl-key"></div>`;
 const body=root.querySelector('.fl-body');
 body.innerHTML='<div class="fl-stage"></div>';
 const st=body.querySelector('.fl-stage'), W=st.clientWidth||900, narrow=W<700;
 const maxP=o.max||(narrow?4:5);
 const sel=stranger?[]:pats(d,maxP);
 const ins=sel.filter(p=>dirOf(p)==='in'), outs=sel.filter(p=>dirOf(p)==='out'), rows=ins.concat(outs);
 const verdict=stranger?'<span>No story yet.</span>':`<b>${esc(steerWord(d))}</b><span>${esc(d.tierObj.energy)}</span>`;
 const idp=o.id||'f';
 if(!narrow){
  const wA=Math.round(W*.27), wB=Math.round(W*.27), wC=Math.round(W*.24), gap=(W-wA-wB-wC)/2, rg=10, gg=34, k=4.3;
  const nodeA=(p,w,h)=>{const s=seatOf(d,p.b);return `<div class="nd" style="left:0;top:0;width:${w}px;${h?'height:'+h+'px':''}">${ring(col(p.b),10,2)}<div class="tx"><div class="nm">${esc(sent(p.k))}</div><div class="sb">Held at the ${esc(lc(s.band))} seat, ${esc(s.seat)}</div><div class="ml">Concerns ${esc(about(p.a))}.</div></div></div>`;};
  const nodeB=(p,w,h)=>`<div class="nd" style="left:0;top:0;width:${w}px;${h?'height:'+h+'px':''}">${icBeh('var(--mid)')}<div class="tx"><div class="sb">Shows up as</div><div class="nm">${esc(sent(p.d))}</div><div class="ml">${esc(BEH[p.k]||'It shows up as '+lc(p.d)+'.')}</div></div></div>`;
  const HM={};
  if(!stranger){const m=document.createElement('div');m.style.cssText='position:absolute;left:0;top:0;visibility:hidden';st.appendChild(m);
   sel.forEach(p=>{m.innerHTML=nodeA(p,wA)+nodeB(p,wB);const a=m.children[0],b=m.children[1];a.style.position=b.style.position='static';a.style.height=b.style.height='auto';a.style.display=b.style.display='flex';HM[p.i]=Math.max(a.offsetHeight,b.offsetHeight,84);});m.remove();}
  const labeled=[]; let yy=0;
  const lay=(arr,lab)=>{if(!arr.length)return;labeled.push({lab,y:yy});yy+=22;arr.forEach(p=>{labeled.push({p,y:yy,h:HM[p.i]});yy+=HM[p.i]+rg;});yy+=gg-rg;};
  if(!stranger){lay(ins,'Turns inward');lay(outs,'Goes outward');}
  const rowsL=labeled.filter(x=>x.p), xC=W-wC, xB=wA+gap;
  const costCard=(arr,which)=>{const g=rowsL.filter(r=>arr.includes(r.p));if(!g.length)return null;
   const sumT=arr.reduce((a,p)=>a+p.sq*k,0)+(arr.length-1)*4, h=Math.max(150,sumT+64), cy=(g[0].y+g[g.length-1].y+g[g.length-1].h)/2;return {arr,which,h,y:cy-h/2};};
  const cI=costCard(ins,'in'), cO=costCard(outs,'out');
  if(cI&&cI.y<0)cI.y=0; if(cI&&cO&&cO.y<cI.y+cI.h+12)cO.y=cI.y+cI.h+12;
  let H=yy; [cI,cO].forEach(c=>{if(c)H=Math.max(H,c.y+c.h+4);});
  let svg='',nodes='';
  rowsL.forEach(r=>{const p=r.p,c=col(p.b),t=p.sq*k,cyy=r.y+r.h/2,s=seatOf(d,p.b);
   nodes+=nodeA(p,wA,r.h).replace('left:0;top:0','left:0;top:'+r.y+'px')+nodeB(p,wB,r.h).replace('left:0;top:0','left:'+xB+'px;top:'+r.y+'px');
   svg+=`<defs><linearGradient id="rA${idp}${p.i}" x1="0" x2="1"><stop offset="0" style="stop-color:${c};stop-opacity:.42"/><stop offset="1" style="stop-color:${c};stop-opacity:.22"/></linearGradient></defs>
    <path d="M${wA} ${cyy-t/2} L${xB} ${cyy-t/2} L${xB} ${cyy+t/2} L${wA} ${cyy+t/2}Z" fill="url(#rA${idp}${p.i})" style="stroke:${c}" stroke-opacity=".7" stroke-width="1"/><path class="flp" d="M${wA} ${cyy} L${xB} ${cyy}"/>`;});
  [cI,cO].forEach(cc=>{if(!cc)return;const isIn=cc.which==='in', c=isIn?'var(--accent)':'var(--mid)';let sy=cc.y+22;
   cc.arr.forEach(p=>{const r=rowsL.find(x=>x.p===p),cl=col(p.b),t=p.sq*k,y1=r.y+r.h/2,x1=xB+wB,x2=xC,xm=(x1+x2)/2,y2=sy+t/2;
    svg+=`<defs><linearGradient id="rB${idp}${p.i}" x1="0" x2="1"><stop offset="0" style="stop-color:${cl};stop-opacity:.30"/><stop offset="1" style="stop-color:${cl};stop-opacity:.48"/></linearGradient></defs>
     <path d="M${x1} ${y1-t/2} C${xm} ${y1-t/2} ${xm} ${sy} ${x2} ${sy} L${x2} ${sy+t} C${xm} ${sy+t} ${xm} ${y1+t/2} ${x1} ${y1+t/2}Z" fill="url(#rB${idp}${p.i})" style="stroke:${cl}" stroke-opacity=".7" stroke-width="1"/><path class="flp" d="M${x1} ${y1} C${xm} ${y1} ${xm} ${y2} ${x2} ${y2}"/>`;sy+=t+4;});
   nodes+=`<div class="nd cost" style="left:${xC}px;top:${cc.y}px;width:${wC}px;height:${cc.h}px">${isIn?icIn(c):icOut(c)}<div class="tx"><div class="nm">${isIn?'Your energy':'Other people'}</div><div class="sb">${isIn?'Charge that turns inward':'Charge that goes outward'}</div><div class="ml">${esc(isIn?energy:'It lands on whoever is near. '+lean)}</div></div></div>`;});
  if(!cO&&!stranger){const y0=cI?cI.y+cI.h+14:0;nodes+=`<div class="nd cost none" style="left:${xC}px;top:${y0}px;width:${wC}px;height:96px">${icOut(DIM)}<div class="tx"><div class="nm">Other people</div><div class="ml">Nothing is going outward here.</div></div></div>`;H=Math.max(H,y0+100);}
  if(!cI&&!stranger){nodes+=`<div class="nd cost none" style="left:${xC}px;top:0;width:${wC}px;height:96px">${icIn(DIM)}<div class="tx"><div class="nm">Your energy</div><div class="ml">Nothing is turning inward here.</div></div></div>`;}
  if(stranger){H=360;const gh=(x,w)=>[0,1,2].map(i=>`<div class="nd none" style="left:${x}px;top:${i*120}px;width:${w}px;height:104px"><div class="tx"><div class="nm">–</div><div class="ml">–</div></div></div>`).join('');
   nodes=gh(0,wA)+gh(xB,wB)+`<div class="nd none" style="left:${xC}px;top:0;width:${wC}px;height:170px"><div class="tx"><div class="nm">Your energy</div><div class="ml">–</div></div></div><div class="nd none" style="left:${xC}px;top:186px;width:${wC}px;height:170px"><div class="tx"><div class="nm">Other people</div><div class="ml">–</div></div></div>`;
   [0,1,2].forEach(i=>{const cyy=i*120+52;svg+=`<path d="M${wA} ${cyy} H${xB} M${xB+wB} ${cyy} H${xC}" style="stroke:${DIM}" stroke-dasharray="4 6" fill="none"/>`;});}
  labeled.filter(x=>x.lab).forEach(x=>{nodes+=`<div class="grp" style="left:0;top:${x.y-2}px">${x.lab}</div>`;});
  st.style.height=H+'px';
  st.innerHTML=`<svg width="${W}" height="${H}" aria-hidden="true">${svg}</svg>`+nodes;
  st.querySelectorAll('.nd').forEach(n=>{if(n.scrollHeight>n.offsetHeight+1)n.style.height=n.scrollHeight+'px';});
  const hd=document.createElement('div');hd.className='fl-cols';hd.style.gridTemplateColumns=`${wA}px ${gap}px ${wB}px ${gap}px ${wC}px`;
  hd.innerHTML='<span>What is held</span><span></span><span>What you do</span><span></span><span>What it costs</span>';
  body.insertBefore(hd,st);
 } else {
  body.className='fl-body fl-nar';
  let h='';
  if(stranger)h=[0,1,2].map(()=>`<div class="rl" style="--c:${DIM};--t:5px;--rw:28px"><div class="rail"><i style="opacity:.35"></i></div><div><div class="st"><div class="k">Held</div><div class="nm">–</div></div><div class="st"><div class="k">Shows up as</div><div class="nm">–</div></div><div class="st"><div class="k">Costs</div><div class="nm">–</div></div></div></div>`).join('');
  rows.forEach(p=>{const c=col(p.b),s=seatOf(d,p.b),isIn=dirOf(p)==='in';
   h+=`<div class="rl" style="--c:${c};--t:${Math.max(5,p.sq*1.7).toFixed(1)}px;--rw:30px"><div class="rail"><i></i></div><div>
    <div class="st"><div class="k">Held at the ${esc(lc(s.band))} seat, ${esc(s.seat)}</div><div class="nm">${esc(sent(p.k))}</div><div class="ml">Concerns ${esc(about(p.a))}.</div></div>
    <div class="st"><div class="k">Shows up as</div><div class="nm">${esc(sent(p.d))}</div><div class="ml">${esc(BEH[p.k]||'It shows up as '+lc(p.d)+'.')}</div></div>
    <div class="st"><div class="k">Costs</div><span class="chip">${isIn?icIn('var(--accent)'):icOut('var(--mid)')}${isIn?'Your energy':'Other people'}</span></div></div></div>`;});
  if(!stranger)h+=`<div class="nd cost"><div>${icIn('var(--accent)')}</div><div class="tx"><div class="nm">Your energy</div><div class="sb">Charge that turns inward</div><div class="ml">${esc(energy)}</div></div></div>
   <div class="nd cost${outs.length?'':' none'}"><div>${icOut(outs.length?'var(--mid)':DIM)}</div><div class="tx"><div class="nm">Other people</div><div class="sb">Charge that goes outward</div><div class="ml">${outs.length?esc('It lands on whoever is near. '+lean):'Nothing is going outward here.'}</div></div></div>`;
  st.style.height='auto'; st.innerHTML=h;
 }
 root.querySelector('.fl-verdict').innerHTML=verdict;
 root.querySelector('.fl-key').innerHTML=`<span><svg width="44" height="16" aria-hidden="true"><path d="M0 3H44V13H0Z" style="fill:color-mix(in srgb,var(--solar) 30%,transparent);stroke:var(--solar)"/></svg>A wider ribbon is more charge. Its colour is the seat it starts at.</span>`+(narrow?'':`<span><svg width="44" height="10" aria-hidden="true"><path d="M2 5H42" style="stroke:var(--ink)" stroke-opacity=".6" stroke-dasharray="2 8" stroke-linecap="round"/></svg>The moving dots show which way it runs.</span>`);
}
function drivesCard(d,o){
 return `<section class="sg-card vw-card" data-grp="drive"><h2 class="sg-zh">${sumIc('drive')}<span>What It Drives</span><span class="vw-flag">mock</span></h2>
  <p class="sum-p plain">The same address, followed through. What is held, what you do because of it, and what it costs.</p><div id="${o.id}"></div></section>`;
}

/* ============ 3. THE WHOLE SUMMARY ============ */
const sw=(b,t)=>`<span class="sw" style="--c:${col(b)}">${esc(t)}</span>`;
function paragraph(d){
 if(isStranger(d))return esc(NOSTORY)+' This paragraph is built from your birth, what is held and the way your charge moves.';
 const stop=stopSeat(d), h=d.top[0], born=d.sp&&d.sp.root, run=d.root, nm=esc(d.nm);
 const s1=born?`<b>${nm} was born on an ${born} blueprint,</b> which is ${ROOTSAY[born]||''}. `:`${nm} has no birth data on file, so there is no blueprint to read against. `;
 const s2=born&&run?(born===run?`What is running now is the same, ${run}, so the build and the field agree. `:`What is running now is ${run}, which is ${ROOTSAY[run]||''}. The two do not agree, so the field is working against the build. `):'';
 const s3=d.carrying?`Charge sits most at the ${sw(hb(d),lc(hb(d)))} seat${stop?`, and flow stops at the ${sw(stop.band,lc(stop.band))}`:''}. The heaviest address is ${esc(lc(h.k))}, which shows up as ${esc(lc(h.d))}. `:`Almost nothing is held. ${h&&h.sq>=3?`What is held is ${esc(lc(h.k))}, at the ${sw(h.b,lc(h.b))} seat, and it is light. `:''}`;
 const s4=`${d.carrying?`It costs energy first. ${energyWord(d.X)} `:'Most of your energy is still yours to use. '}${steerWord(d)} `;
 return s1+s2+s3+s4+`Right now the field reads <b>${esc(lc(d.tierObj.nm))}</b>.`;
}
function nowPanel(d){
 const st=isStranger(d),stop=stopSeat(d),t=d.tierObj;
 const lamp=(lab,val,c)=>`<div class="lamp">${lampIc(c)}<div><span>${lab}</span><b>${val}</b></div></div>`;
 return `<div class="vw-well sm" style="--glow:${st?'var(--accent)':col(hb(d))}"><div class="con-h" style="flex-direction:column;gap:12px;padding-bottom:16px">
  <div class="con-t" style="flex:0 0 auto"><span class="vw-eye">Working on you now</span><b>${st?'–':esc(t.nm)}${st?'':`<small>${esc(t.state)}</small>`}</b><p>${st?esc(NOSTORY):esc(t.energy)}</p></div>
  <div class="lamps" style="flex-direction:column;gap:10px">${lamp('Heaviest seat',st?'–':esc(hb(d)),st?DIM:col(hb(d)))}${lamp('Flow stops at',st?'–':(stop?esc(stop.band):'Nowhere'),st?DIM:(stop?col(stop.band):'var(--mid)'))}${lamp('Steering',st?'–':(d.steer==='withheld'?'The day':'The will'),'var(--accent)')}</div></div></div>`;
}
function marksRows(d){
 const sp=d.sp,r=d.runs;
 if(isStranger(d)||!sp)return [['Sun','The sign the sun was in at your birth.'],['Moon','The sign the moon was in.'],['Rising','The sign rising at your birth.'],['Year animal','Your birth year in the twelve year cycle.'],['Life path','Your birth date added down to one digit.']].map(x=>
  `<div class="sg-m"><span class="sg-c-g" style="--rc:${DIM}">${sgSvg('<circle cx="12" cy="12" r="6" stroke-dasharray="3 3"/>')}</span><div class="sg-m-t"><b>${x[0]}: –</b><p>Add a birth date and this fills in.</p><small>${x[1]}</small></div></div>`).join('');
 const row=(mark,c,t,mean,what)=>`<div class="sg-m"><span class="sg-c-g" style="--rc:${c}">${mark}</span><div class="sg-m-t"><b>${esc(t)}</b><p>${esc(sent(mean))}.</p><small>${esc(what)}</small></div></div>`;
 return row(glyphMark(r.glyph.sun),'var(--solar)',`Sun in ${sp.sun}`,r.sun,'The sign the sun was in at your birth. Your core drive.')
  +row(glyphMark(r.glyph.moon),'var(--eye)',`Moon in ${sp.moon}`,r.moon,'The sign the moon was in. What you run on underneath.')
  +row(glyphMark(r.glyph.rising),'var(--heart)',`Rising ${sp.rising}`,r.rising,'The sign on the horizon at your birth. What arrives in the room first.')
  +row(sgSvg(`<g>${ELEM[sp.celem]||ELEM.Earth}</g>`),'var(--sacral)',`${sp.celem} ${sp.chinese}`,r.ch,'Your birth year in the twelve year cycle, with its element.')
  +row(numMark(sp.lp),'var(--crown)',`Life path ${sp.lp}`,r.lp,'Your birth date added down to one digit.');
}
function meetHtml(d){
 if(isStranger(d)||!d.sp)return '';
 const ag=(d.agree||[]).slice(0,2), df=(d.differ||[]).slice(0,3);
 return `<div class="vw-meet"><div><h4>Where your birth and your field agree</h4>${ag.length?`<ul>${ag.map(x=>`<li>${esc(cap(x))}.</li>`).join('')}</ul>`:'<p class="sum-p plain" style="margin:0">Nothing lines up yet.</p>'}</div>
  <div><h4>Where they differ</h4>${df.length?`<ul>${df.map(x=>`<li>${esc(cap(x))}.</li>`).join('')}</ul>`:'<p class="sum-p plain" style="margin:0">Nothing differs.</p>'}</div></div>`;
}
function fold(title,body,open){return `<details class="sg-fold"${open?' open':''}><summary><span>${esc(title)}</span>${sumIc('chev','sg-chev')}</summary><div class="sg-fold-b">${body}</div></details>`;}
function summaryPage(d){
 const st=isStranger(d), h=HIST[d.nm_key]||null, today='Friday 2 October';
 const arch=d.archTop||[];
 const story=d.says?`<q>${esc(d.says)}</q>`:'';
 const obs=st?`<li><span>${esc(NOSTORY)}</span></li>`:
  `<li><span><b>You lean toward the ${esc(arch[0].nm)}.</b> It ${esc(arch[0].v)}.</span></li>
   <li><span>Then the ${esc(arch[1].nm)}. It ${esc(arch[1].v)}.</span></li>
   <li><span><b>In your own words.</b>${story||'<q>No entry yet.</q>'}</span></li>`;
 const A=`<section class="sg-card vw-card" data-grp="today"><div class="vw-a"><div><span class="vw-eye">Today, ${today}</span><div class="vw-name">${st?'You':esc(d.nm)}<small>${st?'Nothing entered yet':esc(d.role)}</small></div>
  <p class="vw-para">${paragraph(d)}</p>${st?'':`<p class="vw-src">Mock note, fields read: the blueprint (sp.root), what is running (root), the heaviest seat (darkB), where flow stops (seats.held), the heaviest address (top[0].k and .d), vitality (X), who steers (steer) and the tier (tierObj).</p>`}</div>
  <div>${nowPanel(d)}</div></div></section>`;
 const B=`<section class="sg-card vw-card vw-marks" data-grp="show"><h2 class="sg-zh">${sumIc('show')}<span>What Is Showing Up</span></h2>
  <p class="sum-p plain">Several parts of your profile point toward the same themes. Each one is named, with what it means.</p>
  <ul class="vw-obs">${obs}</ul><div class="sg-gap" style="margin-top:16px"><span class="vw-eye">Your marks</span></div><div class="sg-meets" style="margin-top:6px">${marksRows(d)}</div>${meetHtml(d)}</section>`;
 const C=`<div class="vw-two">${readingCard(d,{id:'s-c'})}${drivesCard(d,{id:'s-f'})}</div>
  <p class="vw-lock">${sumIc('src','sg-ic')}<span>Masks and the chain: unlocked on tier one and above, as shipped. Nothing here changes that.</span></p>`;
 const D_=st?`<section class="sg-card vw-card" data-grp="chg"><h2 class="sg-zh">${sumIc('chg')}<span>What Is Changing</span><span class="vw-flag">mock</span></h2><p class="sum-p plain" style="margin:0">Nothing to compare yet. A second snapshot is needed.</p></section>`:
  `<section class="sg-card vw-card" data-grp="chg"><h2 class="sg-zh">${sumIc('chg')}<span>What Is Changing</span><span class="vw-flag">mock</span></h2>
  <p class="sum-p plain">Since your last snapshot, ${esc(h?h.when:'')}. Compared with that day, not with anybody else.</p>
  <div class="vw-chg"><div>${icUp('var(--accent)')}<span><b>Rising</b><p>${h&&h.rising.length?esc(h.rising.join(' and ')):'Nothing is rising.'}</p></span></div>
  <div>${icDn('var(--heart)')}<span><b>Easing</b><p>${h&&h.easing.length?esc(h.easing.join(' and ')):'Nothing is easing.'}</p></span></div>
  <div>${icPlus('var(--mid)')}<span><b>New evidence</b><p>${h&&h.entries?esc(cap(nw(h.entries)))+' entries since then.':'No new entries since then.'}</p></span></div></div></section>`;
 const hp=d.top[0];
 const E=`<section class="sg-card vw-card" data-grp="todo"><h2 class="sg-zh">${sumIc('todo')}<span>What Needs Attention</span></h2>
  <p class="sum-p plain">${st?esc(NOSTORY):(hp&&hp.sq>=3?`<b>The highest lever is ${esc(lc(hp.k))}, at the ${esc(lc(hp.b))} seat.</b> It concerns ${esc(about(hp.a))} and shows up as ${esc(lc(hp.d))}, so it feeds the cost above. Releasing it first moves the most.`:'Nothing is held above the line, so there is nothing to release first.')}</p>
  <div class="s-outrow">
   <div class="s-out"><span class="pm-eye">The protocol</span><div class="s-out-n">${st?'Not read yet':'A practice'}</div>${st?'<div class="s-out-s">Write what happened and this fills in</div>':''}${st?'':'<button class="btn s-oact" type="button">Open it</button>'}</div>
   <div class="s-out"><span class="pm-eye">Release this first</span><div class="s-out-n">${st?'Nothing held':(hp&&hp.sq>=3?esc(hp.k):'Nothing held')}</div>${hp&&hp.sq>=3&&!st?`<div class="s-out-s">${esc(hp.b)} seat, held at the top of your field</div><button class="btn s-oact" type="button">Run a release</button>`:'<div class="s-out-s">No address is holding anything</div>'}</div>
   <div class="s-out"><span class="pm-eye">Next marker</span><div class="s-out-n">${d.next?esc(d.next.nm):'None left'}</div>${d.next?`<div class="s-out-s">${esc(String(d.next.left))} new address away</div>`:''}</div></div></section>`;
 const F=`<section class="sg-card vw-card" data-grp="int"><h2 class="sg-zh">${sumIc('int')}<span>Today's Intention</span><span class="vw-flag">mock, not in the product</span></h2>
  <p class="sum-p plain">${st?'Choose one thing for today once there is something to choose against.':`No intention chosen for today. A good one answers the highest lever: <b>${hp&&hp.sq>=3?esc(lc(hp.d)):'none held'}</b> is what to watch for.`}</p>
  <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" type="button">Choose an intention</button><span class="vw-sub" style="margin:0;align-self:center">At the end of the day you are asked one question: what did you do?</span></div></section>`;
 const bars=h?h.bars:[1,1,1,1,1,1,1];
 const G=`<section class="sg-card vw-card" data-grp="hist"><h2 class="sg-zh">${sumIc('src')}<span>History</span><span class="vw-flag">mock</span></h2>
  ${st?'<p class="sum-p plain" style="margin:0">No snapshots yet. Two are needed before there is a trend.</p>':`<div class="vw-hist"><div class="vw-trend"><div><small>Last 7 days</small><b>${esc(h.trend[0])}</b></div><div><small>Last 30 days</small><b>${esc(h.trend[1])}</b></div><div><small>Last 90 days</small><b>${esc(h.trend[2])}</b></div></div>
  <div><div class="vw-strip">${bars.map(b=>`<i style="--c:${col(hb(d))};height:${b*10}px"></i>`).join('')}</div><p class="vw-sub" style="margin:8px 0 0">Seven snapshots. Each bar is one, coloured by its heaviest seat.</p></div></div>`}</section>`;
 const exp=[['Address','Open the addresses behind a statement',1],['Ritual','Your practice for this',1],['Journal','The entries it came from',1],['Avatar','What it looks like on you',1],['Purpose','What you said you are for',0],['Boundary','What you will not do',0],['Archetype','The role it points to',1],['Knowledge','The reference page',1],['Achievement','What you have earned',0]];
 const H_=`<section class="sg-card vw-card" data-grp="exp"><h2 class="sg-zh">${sumIc('exp')}<span>Explore</span></h2><p class="sum-p plain">Any statement above opens into one of these. A dashed one is not in the product yet.</p>
  <div class="vw-exp">${exp.map(e=>`<a class="${e[2]?'':'off'}">${ring(e[2]?'var(--accent)':DIM,10,1.6)}<span><b>${e[0]}</b><small>${e[1]}</small></span></a>`).join('')}</div></section>`;
 return `<div class="vw vw-stack">${A}${B}${C}${D_}${E}${F}${G}${H_}</div>`;
}

/* ============ 4. ANALYTICS ============ */
function anaPage(d){
 const st=isStranger(d), h=HIST[d.nm_key]||null, t=d.tierObj;
 const heavy=d.top[0], hs=heavy&&seatOf(d,heavy.b), stop=stopSeat(d);
 const cqw=!h?'–':(h.flat?'Barely moved':(h.up?'Up, a little':'Down, a little'));
 const aic=!h||h.flat?icLevel('var(--mid)'):(h.up?icUp('var(--accent)'):icDn('var(--accent)'));
 const moved=h?`Since ${h.when}. ${h.prevHeavy!==hb(d)?`The heaviest seat moved from the ${lc(h.prevHeavy)} to the ${lc(hb(d))}.`:`The heaviest seat is the same, the ${lc(hb(d))}.`}`:'No earlier snapshot, so there is nothing to compare yet.';
 const rise=h?h.rising.length:0, ease=h?h.easing.length:0, hot=d.top.filter(p=>p.sq>5);
 const tile=(k,v,l,g)=>`<div class="rd"><span class="k">${k}</span><div class="v">${v}</div>${g?`<div class="g">${g}</div>`:''}<div class="l">${l}</div></div>`;
 const hero=`<div class="rd hero"><span class="k">Coherence</span><div class="g">${ring(st?DIM:'var(--accent)',11,2)}<div class="v">${st?'–':esc(t.nm)}</div></div><div class="l">${st?esc(NOSTORY):esc(t.energy)}</div></div>`;
 const t1=tile('What changed',st?'–':esc(cqw),esc(st?NOSTORY:moved),st?'':aic);
 const t2=tile('What is heaviest',st||!heavy||heavy.sq<1?'Nothing held':esc(sent(heavy.k)),st?esc(NOSTORY):(heavy&&heavy.sq>=1?`At the ${esc(lc(hs.band))} seat. Concerns ${esc(about(heavy.a))}.`:'No address is holding anything.'),
  st||!heavy||heavy.sq<1?'':`<div style="flex:1;height:6px;border-radius:3px;background:color-mix(in srgb,var(--ink) 9%,transparent);position:relative"><i style="position:absolute;inset:0 auto 0 0;width:${Math.min(100,heavy.sq*10)}%;background:${col(heavy.b)};border-radius:3px;box-shadow:0 0 10px ${col(heavy.b)}"></i></div>`);
 const t3=tile('What is moving',st?'–':(h&&(rise||ease)?`${cap(nw(rise))} rising, ${nw(ease)} easing`:'Nothing is moving'),
  st?esc(NOSTORY):(hot.length?`${cap(nw(hot.length))} addresses are past five. ${h&&h.steady?cap(nw(h.steady))+' are not moving.':''}`:'No address is past five.'),'');
 const t4=tile('Where flow stops',st?'–':(stop?esc(stop.band):'Nowhere'),st?esc(NOSTORY):(stop?`Past the ${esc(lc(stop.band))} seat, less gets through.`:'Every seat is passing.'),
  st?'':`<svg width="154" height="22" viewBox="0 0 154 22" aria-hidden="true">${d.seats.map((s,i)=>{const I=intensity(s);return `<circle cx="${11+i*22}" cy="11" r="${I>0.02?4.5+2.5*I:3.5}" fill="none" style="stroke:${I>0.02?col(s.band):DIM}" stroke-width="1.7"/>`;}).join('')}</svg>`);
 const strip=d.seats.map(s=>{const I=st?0:intensity(s),hg=Math.max(8,Math.round(8+I*132));
  return `<div class="seatcol" style="--c:${col(s.band)}"><div class="bar" style="height:${hg}px;opacity:${I>0.02?(.55+.45*I).toFixed(2):.35}"></div><div class="n">${esc(s.band)}</div><div class="w">${st?'–':(s.hot?cap(nw(s.hot))+' held':'Nothing held')}</div></div>`;}).join('');
 const ax=d.charge.slice().sort((a,b)=>b.v-a.v).map(a=>`<div class="ax" style="--c:${col(a.seat)}"><div class="t"><b>${esc(a.nm)}</b><small>${esc(a.loc)}</small></div><div class="tr"><i style="width:${st?0:Math.max(2,a.v*10)}%"></i></div></div>`).join('');
 const hotRows=d.top.filter(p=>p.sq>5);
 const fr=(c)=>ring(c,8,1.8,'',20);
 const folds=`<div class="an-folds">
  ${fold('Running hot, in full',hotRows.length?`<ul class="fdl">${hotRows.map(p=>`<li>${fr(col(p.b))}${esc(sent(p.k))}<em>${esc(p.b)}, ${h&&h.rising.includes(sent(p.k))?'rising':'not moving'}</em></li>`).join('')}</ul>`:'<p class="sum-p plain" style="margin:0">No address is past five.</p>')}
  ${fold('Domains, archetypes, masks','<p class="sum-p plain" style="margin:0">The three bubble charts exactly as shipped, folded. Nothing in them is read at a glance.</p>')}
  ${fold('Moral integrity and your record',`<p class="sum-p plain" style="margin:0">The twenty one law bars and the snapshot strip, as shipped, folded. ${st?'':`Shut: ${d.shut.length?esc(d.shut.map(x=>x.nm).join(', ')):'none'}.`}</p>`)}</div>`;
 return `<div class="vw"><section class="sg-card vw-card" data-grp="ana"><h2 class="sg-zh">${sumIc('chg')}<span>Analytics</span><span class="vw-flag">mock</span></h2>
  <div class="an-hero">${hero}${t1}${t2}${t3}${t4}</div>
  <div class="an-row"><div class="pn"><h3>The seven seats, from the crown down</h3><div class="seatstrip">${strip}</div></div><div class="pn"><h3>The nine axes, heaviest first</h3><div class="axes">${ax}</div></div></div>
  ${folds}<p class="an-more">Folded, not removed: running hot in full, the three bubble charts, moral integrity and your record.</p></section></div>`;
}

/* ============ 5. PRACTITIONER ============ */
function sightCard(d){
 const on=`<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="8.6" fill="none" style="stroke:var(--heart)" stroke-width="1.7"/><path d="M7 11.2l2.7 2.7 5.3-5.5" fill="none" style="stroke:var(--heart)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
 const off=`<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="8.6" fill="none" style="stroke:var(--dim)" stroke-width="1.5" stroke-dasharray="3 3"/></svg>`;
 const n=esc(d.nm);
 return `<div class="sightc"><h3>What ${n} lets you see <span class="vw-flag2">mock</span></h3>
  <div class="gr"><div>${on}<span>Where charge is held, by seat<small>The addresses that are held and the seats they sit at.</small></span></div>
  <div>${on}<span>Analytics<small>The readings on the Analytics page, each dated.</small></span></div>
  <div>${on}<span>Notes you write<small>Private to you. They reach ${n} only when you press Share.</small></span></div>
  <div>${off}<span>The story, in ${n}'s own words<small>Off. It stays off unless ${n} turns it on.</small></span></div></div>
  <span class="vw-eye">Who has sight of ${n}</span>
  <div class="who">${ring('var(--accent)',10,1.8)}<div>You, practitioner<small>Since 3 September</small></div></div>
  <div class="who">${ring(DIM,10,1.4)}<div>Nobody else<small>No other person or service</small></div></div>
  <p class="end">${n} can end this on their Privacy page. Revoking stops new readings reaching you now. It cannot unsee what you have read. If you unlink, sight ends at once and ${n}'s record is not touched.</p>
  <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button class="btn" type="button">Edit what I can see</button><button class="btn" type="button">Unlink</button></div></div>`;
}
function infoCard(d){
 const p=d.top[0]; if(!p||p.sq<1)return `<div class="infoc"><h3>Selected in the centre</h3><p class="meta">Nothing held.</p></div>`;
 const s=seatOf(d,p.b);
 const rows=d.top.filter(x=>x.sq>=1).slice(0,6).map(x=>`<div style="--c:${col(x.b)}"><span>${esc(sent(x.k))}</span><span class="tr"><i style="width:${Math.min(100,x.sq*10)}%"></i></span></div>`).join('');
 return `<div class="infoc"><span class="vw-eye">Selected in the centre</span><h3 style="margin-top:2px">${esc(sent(p.k))}</h3>
  <p class="meta">Held at the ${esc(lc(s.band))} seat, ${esc(s.seat)}. The nerve that serves that place is the ${esc(lc(p.n))}. It concerns ${esc(about(p.a))} and shows up as ${esc(lc(p.d))}.</p>
  <p class="meta">This says where charge is held and which nerve serves the place. It is not a reading of nerve health.</p>
  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:12px;flex-wrap:wrap"><span class="vw-eye">Shadow weight, heaviest first</span><span><button class="chipb" aria-pressed="true">By weight</button> <button class="chipb" aria-pressed="false">By name</button></span></div>
  <div class="shl">${rows}</div>
  <p class="meta" style="margin:12px 0 0">Coherence reads <b style="color:var(--ink)">${esc(lc(d.tierObj.nm))}</b>. Shadow weight reads <b style="color:var(--ink)">${d.hotN>=15?'heavy':d.hotN>=5?'moderate':'light'}</b>. Neither ranks the list on the left.</p></div>`;
}
function runCard(d){
 const p=d.top[0]; if(!p||p.sq<3)return `<div class="runc"><h3>What to run <span class="vw-flag2">mock</span></h3><p class="meta">Nothing is held above the line, so no release is queued.</p></div>`;
 const q=d.top.filter(x=>x.sq>=4).slice(0,3);
 return `<div class="runc"><h3>What to run <span class="vw-flag2">mock</span></h3><p class="meta">The release queue the app would pick for ${esc(d.nm)}, heaviest seat first.</p>
  <ol>${q.map((x,i)=>`<li>${ring(col(x.b),9,1.8,'',24)}<span><b>${esc(sent(x.k))}</b>, ${esc(lc(x.b))} seat</span></li>`).join('')}</ol>
  <p class="meta" style="margin:10px 0 0">Released so far: two. Still held: ${esc(nw(Math.min(d.carrying,12)))}${d.carrying>12?' or more':''}.</p></div>`;
}
function noteCard(d){
 const n=esc(d.nm);
 return `<div class="notec"><h3>Notes on ${n} <span class="vw-flag2">mock</span></h3><textarea placeholder="Write a note"></textarea>
  <div class="seg"><button class="chipb" aria-pressed="true" type="button">Private to me</button><button class="chipb" aria-pressed="false" type="button">Share with ${n}</button></div>
  <p class="meta" style="font-size:12.5px;color:var(--dim);margin:0;line-height:1.45">Saved notes keep their date. A shared note shows ${n} the day you shared it.</p></div>`;
}
function clientRow(c,sel,narrow){
 if(c.revoked){return `<div class="pcr rev" data-k="${c.k}"><div>${avatar(c.k,DIM,40)}</div><div><div class="nm">${esc(c.k)} <span class="st"><i></i>Sight ended</span></div><div class="ch">Sight ended ${esc(c.revoked)}. No numbers are shown.</div><div class="tr">${esc(c.date)}</div></div></div>`;}
 const d=D[c.k];
 return `<div class="pcr" data-k="${c.k}" ${sel?'data-sel="1"':''}><div>${avatar(d.nm,c.active?'var(--accent)':DIM,40)}</div><div>
  <div class="nm">${esc(d.nm)} <span class="st ${c.active?'on':''}"><i></i>${c.active?'Active':'Quiet'}</span></div>
  <div class="tr">${esc(d.tierObj.nm)}. Heaviest at the ${esc(lc(hb(d)))}.</div>
  <div class="ch">${esc(c.ch)}</div><div class="tr">${esc(c.date)}</div>
  ${sel?`<div class="act"><button type="button">Edit access</button><button type="button">Unlink</button></div>`:''}</div></div>`;
}
function pracList(sel,narrow){
 return `<div class="pr-l"><div class="pr-lh"><span class="vw-eye">Practitioner</span><b>Your clients <span class="vw-flag2">mock</span></b>
  <div class="srt"><span>Sorted by what needs attention.</span><button class="chipb" aria-pressed="true" type="button">Attention</button><button class="chipb" aria-pressed="false" type="button">Name</button></div></div>
  ${CLIENTS.map(c=>clientRow(c,c.k===sel,narrow)).join('')}
  <div class="pr-lf">Active means a ritual or a release in the last seven days. These are the product's example people, not clients. ${narrow?'Swipe right to edit what you can see. Swipe left to unlink.':'Select a row to see its buttons. The list is never ranked by who is ahead.'}</div></div>`;
}
function pracPage(who,view,narrow){
 const dd=person(CLIENTS.find(c=>c.k===who&&!c.revoked)?who:'Derek');
 const list=pracList(dd.nm_key,narrow);
 const centre=`<div class="pr-c"><div class="pr-ph">${avatar(dd.nm,'var(--accent)',46)}<div><b>${esc(dd.nm)}</b><small>${esc(dd.role)}. Example person, not a client. Reading of 1 October.</small></div><div class="sp"><button class="btn" type="button" style="background:var(--accent);color:var(--on-accent);border-color:var(--accent)">Add a note</button></div></div>
  ${readingCard(dd,{id:'p-c'})}${drivesCard(dd,{id:'p-f'})}${runCard(dd)}</div>`;
 const right=`<div class="pr-r">${sightCard(dd)}${infoCard(dd)}${noteCard(dd)}</div>`;
 if(narrow)return `<div class="vw">${view==='list'?list:`<div class="pr-back"><button class="btn" type="button">Back to clients</button></div><div class="pr" style="display:grid;grid-template-columns:1fr;padding:0">${centre}${right}</div>`}</div>`;
 return `<div class="pr">${list}${centre}${right}</div>`;
}

/* ============ mount ============ */
function after(fn){(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(()=>requestAnimationFrame(fn)));}
function mount(tab,who,opts){
 opts=opts||{};
 Object.keys(D).forEach(k=>{D[k].nm_key=k;});
 const d=person(who||'Derek');
 const vwid=opts.vwid||'';
 if(tab==='analytics'){const h=document.getElementById('ana');h.innerHTML=anaPage(d);return;}
 if(tab==='practitioner'){const h=document.getElementById('prac');const narrow=window.innerWidth<=820;h.innerHTML=pracPage(who,opts.view||'list',narrow);
  const c=h.querySelector('#p-c'),f=h.querySelector('#p-f');after(()=>{if(c){conDraw(c,d,{id:'p'+vwid,sm:true,max:4,minH:520});flowDraw(f,d,{max:4,id:'pf'});}});return;}
 const host=document.getElementById('sumbody')||document.getElementById('sum');
 if(tab==='reading'){host.innerHTML=`<div class="vw vw-stack">${readingCard(d,{id:'r-c'})}</div>`;after(()=>conDraw(host.querySelector('#r-c'),d,{id:'r'+vwid}));}
 else if(tab==='drives'){host.innerHTML=`<div class="vw vw-stack">${drivesCard(d,{id:'d-f'})}</div>`;after(()=>flowDraw(host.querySelector('#d-f'),d,{id:'d'}));}
 else {host.innerHTML=summaryPage(d);after(()=>{conDraw(host.querySelector('#s-c'),d,{id:'sc',sm:true,max:4,minH:520});flowDraw(host.querySelector('#s-f'),d,{max:4,id:'sf'});});}
}
return {mount,D,paragraph};
})();
