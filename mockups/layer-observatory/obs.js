/* The layer observatory. One canvas, two halves that share one clock, one selection and one summary.

   LEFT, the observatory: the nested rings (sky, roots, domains) with the ridgeline folded into the ring beneath them,
   nine wave bands, one per child fetter, in the Flow band's grammar. The centre ring of addresses is gone. In its place
   is the popping layer: lamps for whatever level is picked (fetters, saboteurs, complexes, hyper complexes).
   RIGHT, the chain: four columns, fetters to saboteurs to complexes to hyper complexes, with every link a thin Bezier
   that lights while both of its ends are flaring.

   REAL: the nine charges, the SQ of every body address and their slots (data.js), the domain reach, the sky, the
   saboteurs, complexes and hyper complexes and their weights (chain.js, the engine's own compute()).
   MOCK: the history behind Scrub (chain.js says how), the plan switch (a demo of the lock), the tiers sheet.

   POP RULE, one rule for every level. Every address that holds charge beats on its own clock. The beat is 7.2 s minus
   0.62 s per point of SQ, never under 1.4 s. It flares for 12 percent of the beat, never under 0.3 s: a fast rise, a
   slow fall. Its phase is its slot times 0.618 of a turn, so the beats never line up. Its brightness is its SQ through
   the ridgeline's gamma. A node shows the beats of the addresses it is made of: a fetter its own addresses, a saboteur
   its parts, a complex and a hyper complex the parts beneath them. Nothing is random. */
(function(){
'use strict';
const MG=window.MG, OB=window.OBS, Q=new URLSearchParams(location.search);
const REDUCED=Q.get('still')==='1'||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const TAU=Math.PI*2, PI=Math.PI, clamp=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,k)=>a+(b-a)*k, frac=v=>v-Math.floor(v);
function bez(a,b,c,d){const cx=3*a,bx=3*(c-a)-cx,ax=1-cx-bx,cy=3*b,by=3*(d-b)-cy,ay=1-cy-by;
 const X=t=>((ax*t+bx)*t+cx)*t,Y=t=>((ay*t+by)*t+cy)*t,dX=t=>(3*ax*t+2*bx)*t+cx;
 return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<8;i++){const e=X(t)-x;if(Math.abs(e)<1e-5)break;const dd=dX(t);if(Math.abs(dd)<1e-6)break;t-=e/dd;}return Y(t);};}
const OUT=bez(.22,1,.36,1), LAND=bez(.34,1.56,.64,1);
const ent=(t,delay,dur,ease)=>REDUCED?1:(ease||OUT)(clamp((t-delay)/dur,0,1));
const BREATH=4.2;
const LITE=Q.get('lite')==='1';   /* the cheapest version: no glow pass, coarser rings, flat halos, whole pixels, 30 frames a second */
const hex2=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const rgba=(h,a)=>{const c=hex2(h);return 'rgba('+c[0]+','+c[1]+','+c[2]+','+clamp(+a,0,1).toFixed(3)+')';};
const mix=(h1,h2,k)=>{const a=hex2(h1),b=hex2(h2);return 'rgb('+Math.round(lerp(a[0],b[0],k))+','+Math.round(lerp(a[1],b[1],k))+','+Math.round(lerp(a[2],b[2],k))+')';};
const G=v=>Math.pow(clamp(v,0,1),.62);
const FONT='Inter,system-ui,-apple-system,"Segoe UI",sans-serif';
const C={ink:'#EFEDE8',mid:'#B4B0A8',dim:'#94908A',gold:'#DFCC7E',acc:'#7EB8D4'};
const ROOTS=['Architect','Engine','Weaver','Witness'];
const ROOTC={Architect:'#7D93E0',Engine:'#D8924E',Weaver:'#5FD5A6',Witness:'#A77EDB'};
const PAL={'Root':'#D6524C','Sacral':'#D8924E','Solar':'#DABF6A','Heart':'#5FD5A6','Throat':'#5EBBDB','3rd Eye':'#7D93E0','Crown':'#A77EDB'};
/* the families, in the order that keeps a family and its overshoot side by side, and the seat each one sits at (HCX_LIB) */
const FAMS=['Collapse','Mania','Dysregulation','Numbness','Rigidity','Indiscriminate','Predatory','Enabling','Grandiosity','Self-erasure','Dissociation','Enmeshment'];
const FAMBASE={};Object.keys(OB.famPole).forEach(k=>FAMBASE[OB.famPole[k]]=k);
const FAMSEAT={Grandiosity:'Throat',Predatory:'3rd Eye',Collapse:'Root',Rigidity:'Solar',Dysregulation:'Sacral',Dissociation:'Crown'};
const famCol=f=>PAL[FAMSEAT[FAMBASE[f]||f]]||C.mid;
const famIdx=f=>{const i=FAMS.indexOf(f);return i<0?99:i;};
const CHILD=MG.child, DOMAINS=MG.domains, AFFIN=MG.affin;
const FNAME=CHILD.map(c=>c.nm), FCOL=CHILD.map(c=>PAL[c.seat]);
const ABBR=['Fear','Ang','Sha','Dis','Apa','Sho','Sad','Sur','Ant'];
const DROOT=DOMAINS.map(d=>d.r), DCOL=DROOT.map(r=>ROOTC[r]);
const RG=[[0,4],[5,9],[10,14],[15,18]];
const isAff=(rw,c)=>AFFIN[DROOT[c]].indexOf(FNAME[rw])>=0;
const LV=['fet','sab','cx','hy'], LVNAME=['Fetters','Saboteurs','Complexes','Hyper complexes'], LVLOW=['fetters','saboteurs','complexes','hyper complexes'];
const LVSING=['fetter','saboteur','complex','hyper complex'];
/* SIGHT, copied from engine/plan.js: which tier opens which rung, and the one sentence a lock says. FREE sees the fetters. */
const SIGHT=[null,{need:'one',what:'Which saboteurs are running on your charge.'},{need:'two',what:'Where your saboteurs join into complexes.'},{need:'three',what:'Where your complexes join into hyper complexes.'}];
const PLANRANK={free:0,one:1,two:2,three:3,four:3};
const TIERNM={one:'tier one',two:'tier two',three:'tier three'};
const PLANNM={free:'Free',one:'Tier one',two:'Tier two',three:'Tier three'};
const LOCK_PATH='<rect x="5" y="10.8" width="14" height="9.7" rx="2.4"/><path d="M8.3 10.8V8.2a3.7 3.7 0 017.4 0v2.6"/>';
const LOCKMK='<svg class="lk-mk" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+LOCK_PATH+'</svg>';
const lockSay=l=>SIGHT[l].what+' Unlocked on '+TIERNM[SIGHT[l].need]+' and above.';
const WHO=[['Sofia','Sofia'],['Marcus','Marcus'],['Derek','Derek, mid'],['Tomas','Tomas, heavy'],['Wren','Wren, sparse'],['Rosa','Rosa, at rest']];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ------------------------------------------------------------------ state */
const S={who:WHO.some(w=>w[0]===Q.get('p'))?Q.get('p'):'Derek',view:LV.indexOf(Q.get('view'))>=0?LV.indexOf(Q.get('view')):0,
 mode:['lens','thread','scrub'].indexOf(Q.get('mode'))>=0?Q.get('mode'):'lens',plan:PLANRANK[Q.get('plan')]!=null?Q.get('plan'):'three',
 step:Q.get('step')!=null?clamp(+Q.get('step'),0,11):11,play:false,pin:null,hover:null,showAll:Q.get('all')==='1',t:0,
 hlk:null,P:null,C:null};
const sees=l=>l===0||PLANRANK[S.plan]>=PLANRANK[SIGHT[l].need];
if(!sees(S.view))S.view=0;
const effStep=()=>S.mode==='scrub'?S.step:11;
let NODES=new Map(), LINKS=new Map(), UP={}, DOWN={}, MODEL=null, DIRTY=true;
let HITS=[], GEO=null, FL=new Float32Array(120), SLOTQ=new Float32Array(120);
let cost=[],frameGap=[],lastNow=null,simT=0,raf=0,seeking=false;

/* ------------------------------------------------------------------ the pop rule */
const beatT=q=>Math.max(1.4,7.2-.62*q);
const amp=q=>.3+.7*G(q/10);
function beat(slot,q,t){
 if(q<.02)return 0;
 const T=beatT(q),win=clamp(.12*T,.3,.8),u=((t+frac(slot*.618034)*T)%T)/win;
 if(u>=1)return 0;
 return u<.18?OUT(u/.18):Math.pow(1-(u-.18)/.82,1.8);}

/* ------------------------------------------------------------------ model: nodes and links from the reading */
function mkNode(id,lvl){let n=NODES.get(id);if(!n){n={id:id,lvl:lvl,a:0,hl:1,y:null,ty:0,slots:[],kids:[],w:0,wd:0,fl:0,ghost:false,alive:false,born:S.t,lab:'',nm:''};NODES.set(id,n);}return n;}
function rebuild(){
 const C0=S.C,st=C0.steps[effStep()],cf=C0.cf;
 NODES.forEach(n=>{n.alive=false;n.ghost=false;});
 LINKS.forEach(l=>{l.alive=false;});
 const link=(a,b,w)=>{const k=a+'>'+b;let l=LINKS.get(k);if(!l){l={k:k,a:a,b:b,la:0,hl:1};LINKS.set(k,l);}l.w=w;l.alive=true;l.main=false;return l;};
 UP={};DOWN={};
 const addAdj=(lo,hi)=>{(UP[lo]=UP[lo]||[]).push(hi);(DOWN[hi]=DOWN[hi]||[]).push(lo);};
 /* fetters, always nine, in the matrix's row order */
 FNAME.forEach((nm,i)=>{const n=mkNode('f:'+nm,0);n.nm=nm;n.lab=nm;n.fi=i;n.col=FCOL[i];n.w=st.ch[i]||0;n.alive=true;
  n.slots=[];for(let s=0;s<cf.length;s++)if(cf[s]===nm&&st.q[s]>.02)n.slots.push(s);n.kids=[];});
 const fi=nm=>FNAME.indexOf(nm);
 const slotsW=s=>s.reduce((a,x)=>a+st.q[x],0);
 /* scrub keeps every node that ever lights as a ghost, so the rows do not jump while the scrubber moves */
 if(S.mode==='scrub'){
  C0.steps.forEach(stp=>{
   if(sees(1))stp.sab.forEach(s=>{const n=mkNode('s:'+s[0],1);if(!n.alive){n.ghost=true;n.nm=s[0];n.lab=s[0].replace(/ overshot$/,'');n.fam=s[3];n.over=!!s[2];n.col=famCol(s[3]);n.slots=s[4].slice();n.w=s[1];}});
   if(sees(3))stp.hy.forEach(h=>{const n=mkNode('h:'+h[0],3);if(!n.alive){n.ghost=true;n.nm=h[0];n.lab=h[0];n.fam=h[0];n.over=!!h[2];n.col=famCol(h[0]);n.kids=h[3].map(x=>'c:'+x);n.w=h[1];}});});}
 /* scrub: keep at most as many ghost rows as the column can hold at a readable pitch, heaviest first */
 if(S.mode==='scrub'){const stg=document.getElementById('stage'),room=(GEO&&GEO.narrow)?44:Math.max(12,Math.floor(((stg?stg.clientHeight:740)-130)/17));
  const live=new Set();if(sees(1))st.sab.forEach(x=>live.add('s:'+x[0]));
  const gh=[];NODES.forEach(n=>{if(n.lvl===1&&n.ghost&&!live.has(n.id))gh.push(n);});gh.sort((x,y)=>y.w-x.w);
  gh.forEach((n,i)=>{if(i>=Math.max(0,room-live.size))n.ghost=false;});}
 const sabSlots={},cxSlots={};
 if(sees(1))st.sab.forEach(s=>{const n=mkNode('s:'+s[0],1);n.ghost=false;n.alive=true;n.nm=s[0];n.lab=s[0].replace(/ overshot$/,'');n.fam=s[3];n.over=!!s[2];n.col=famCol(s[3]);n.w=s[1];
  n.slots=s[4].slice();n.kids=[];sabSlots[s[0]]=n.slots;
  const by={},cn={};let tot=0;s[4].forEach(x=>{const f=cf[x];if(f){by[f]=(by[f]||0)+st.q[x];cn[f]=(cn[f]||0)+(st.q[x]>.02?1:0);tot+=st.q[x];}});
  const fs=Object.keys(by).filter(f=>by[f]>.04).sort((a,b)=>by[b]-by[a]);
  fs.forEach((f,ix)=>{const l=link('f:'+f,n.id,by[f]);l.n=cn[f];l.share=tot>0?by[f]/tot:0;l.main=ix===0;addAdj('f:'+f,n.id);n.kids.push('f:'+f);});});
 if(sees(2))st.cx.forEach(c=>{const n=mkNode('c:'+c[0],2);n.ghost=false;n.alive=true;n.nm=c[0];n.lab=c[0].replace(/ overshot/g,'');n.fam=c[3];n.over=!!c[2];n.col=famCol(c[3]);n.w=c[1];
  n.kids=c[4].map(x=>'s:'+x);let u=[];c[4].forEach(x=>{(sabSlots[x]||[]).forEach(s=>{if(u.indexOf(s)<0)u.push(s);});});n.slots=u;cxSlots[c[0]]=u;
  c[4].forEach(x=>{link('s:'+x,n.id,n.w);addAdj('s:'+x,n.id);});});
 if(sees(3))st.hy.forEach(h=>{const n=mkNode('h:'+h[0],3);n.ghost=false;n.alive=true;n.nm=h[0];n.lab=h[0];n.fam=h[0];n.over=!!h[2];n.col=famCol(h[0]);n.w=h[1];n.d=OB.families[h[0]];
  n.kids=h[3].map(x=>'c:'+x);let u=[];h[3].forEach(x=>{(cxSlots[x]||[]).forEach(s=>{if(u.indexOf(s)<0)u.push(s);});});n.slots=u;
  h[3].forEach(x=>{link('c:'+x,n.id,n.w);addAdj('c:'+x,n.id);});});
 LINKS.forEach((l,k)=>{if(!l.alive&&l.la<.01)LINKS.delete(k);});
 NODES.forEach((n,k)=>{if(!n.alive&&!n.ghost&&n.a<.01)NODES.delete(k);});
 SLOTQ.fill(0);for(let s=0;s<cf.length;s++)SLOTQ[s]=cf[s]?st.q[s]:0;
 MODEL={st:st,step:effStep()};DIRTY=true;
 if(S.pin&&!(NODES.get(S.pin)&&NODES.get(S.pin).alive))S.pin=null;}
function ofLevel(l){const o=[];NODES.forEach(n=>{if(n.lvl===l&&(n.alive||n.ghost||n.a>.01))o.push(n);});return o;}
function liveOf(l){const o=[];NODES.forEach(n=>{if(n.lvl===l&&n.alive)o.push(n);});return o;}
/* the thread of a node: everything it stands on and everything that stands on it, nothing sideways */
function lineage(id){const set=new Set([id]);
 const walk=(adj)=>{const q=[id];while(q.length){const x=q.pop();(adj[x]||[]).forEach(y=>{if(!set.has(y)){set.add(y);q.push(y);}});}};
 walk(UP);walk(DOWN);return set;}

/* ------------------------------------------------------------------ geometry */
function geom(w,h){
 const narrow=w<760;
 let obs,lad;
 if(!narrow){const ow=Math.min(h,Math.round(w*.5));obs={x:0,y:0,w:ow,h:h};lad={x:ow+4,y:0,w:w-ow-10,h:h};}
 else{const oh=Math.round(Math.min(w*.97,560))+44;obs={x:0,y:0,w:w,h:oh};lad={x:0,y:oh,w:w,h:h-oh};}
 const ro=narrow?44:58;
 const Rm=Math.min(obs.w/2,(obs.h-ro)/2)-(narrow?8:10);
 obs.cx=obs.x+obs.w/2;obs.cy=obs.y+(obs.h-ro)/2+(narrow?2:0);obs.Rm=Rm;
 const pad=narrow?8:16,W=lad.w-pad*2,gap=narrow?10:(W>540?38:30),cw=(W-3*gap)/4;
 lad.pad=pad;lad.cw=cw;lad.gap=gap;lad.colX=[0,1,2,3].map(i=>lad.x+pad+i*(cw+gap));
 lad.top=lad.y+(narrow?64:72);lad.bottom=lad.y+lad.h-(narrow?14:44);
 return {w:w,h:h,narrow:narrow,obs:obs,lad:lad};}
/* how tall the stage must be on a phone, where the page scrolls: the observatory square, then the ladder at its own pitch */
function phoneHeight(w){
 const oh=Math.round(Math.min(w*.97,560))+44;
 const nS=ofLevel(1).length,nC=ofLevel(2).length,nH=ofLevel(3).length;
 const rows=Math.max(9*32,nS*23+10*3,nC*38,nH*40,200);
 return oh+clamp(rows+128,380,1040);}
/* ladder rows. sabs stack by family; complexes sit between their two saboteurs; hyper complexes between their complexes. */
function layoutLadder(g){
 const L=g.lad,mid=(L.top+L.bottom)/2,H=L.bottom-L.top;
 const F=ofLevel(0).sort((a,b)=>a.fi-b.fi),Sx=ofLevel(1).sort((a,b)=>famIdx(a.fam)-famIdx(b.fam)||b.w-a.w||(a.nm<b.nm?-1:1));
 const Cx=ofLevel(2),Hx=ofLevel(3);
 let br=0;Sx.forEach((n,i)=>{if(i&&n.fam!==Sx[i-1].fam)br++;});
 const ps=Math.min(g.narrow?24:30,H/Math.max(1,Sx.length+br*.4));
 let y=0;const ys=[];Sx.forEach((n,i)=>{if(i&&n.fam!==Sx[i-1].fam)y+=ps*.4;ys.push(y);y+=ps;});
 const blockS=Sx.length?y-ps:0,y0=mid-blockS/2;
 Sx.forEach((n,i)=>{n.ty=y0+ys[i];n.ph=Math.min(ps-3,g.narrow?19:22);n.lblock=blockS;});
 const pos=id=>{const n=NODES.get(id);return n&&n.ty!=null&&n.lvl>0?n.ty:null;};
 const bary=(n)=>{const v=n.kids.map(pos).filter(x=>x!=null);return v.length?v.reduce((a,b)=>a+b,0)/v.length:mid;};
 const stack=(arr,minGap,ph)=>{arr.forEach(n=>{n.ty=bary(n);n.ph=ph;});arr.sort((a,b)=>a.ty-b.ty);
  const gp=Math.min(minGap,arr.length>1?(H-ph)/(arr.length-1):minGap);
  for(let i=1;i<arr.length;i++)if(arr[i].ty<arr[i-1].ty+gp)arr[i].ty=arr[i-1].ty+gp;
  if(arr.length){const lo=L.top+ph/2,hi=L.bottom-ph/2;const mn=arr[0].ty,mx=arr[arr.length-1].ty;
   let sh=0;if(mx>hi)sh=hi-mx;if(mn+sh<lo)sh=lo-mn;arr.forEach(n=>n.ty+=sh);}};
 stack(Cx,g.narrow?36:42,g.narrow?30:34);
 stack(Hx,g.narrow?44:52,g.narrow?28:30);
 const pf=clamp((blockS+ps)/9,g.narrow?30:34,g.narrow?36:46),fy0=mid-pf*4;
 F.forEach((n,i)=>{n.ty=fy0+i*pf;n.ph=g.narrow?24:28;});
 DIRTY=false;}

/* ------------------------------------------------------------------ text helpers */
const mcache={};
function fitText(ctx,s,font,maxW){const k=font+'|'+s+'|'+(maxW|0);if(mcache[k]!=null)return mcache[k];
 ctx.font=font;let t=s;if(ctx.measureText(t).width>maxW){while(t.length>2&&ctx.measureText(t+'…').width>maxW)t=t.slice(0,-1);t=t.trim()+'…';}
 mcache[k]=t;return t;}
function txt(ctx,s,x,y,size,col,align,weight){ctx.font=(weight||400)+' '+size+'px '+FONT;ctx.fillStyle=col;ctx.textAlign=align||'left';ctx.textBaseline='middle';ctx.fillText(s,x,y);}
function rr(ctx,x,y,w,h,r){r=Math.min(r,h/2,w/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arc(x+w-r,y+r,r,-PI/2,0);ctx.lineTo(x+w,y+h-r);ctx.arc(x+w-r,y+h-r,r,0,PI/2);
 ctx.lineTo(x+r,y+h);ctx.arc(x+r,y+h-r,r,PI/2,PI);ctx.lineTo(x,y+r);ctx.arc(x+r,y+r,r,PI,PI*1.5);ctx.closePath();}
function glyph(ctx,k,x,y,r,col,al){ctx.strokeStyle=rgba(col,al);ctx.lineWidth=1.3;ctx.beginPath();
 if(k==='Moon'){ctx.arc(x,y,r,-1.2,1.2);ctx.stroke();ctx.beginPath();ctx.arc(x+r*.55,y,r*.8,1.2,TAU-1.2,true);ctx.stroke();return;}
 ctx.arc(x,y,r,0,TAU);ctx.stroke();
 if(k==='Sun'){ctx.beginPath();ctx.arc(x,y,r*.28,0,TAU);ctx.stroke();}
 if(k==='Rising'){ctx.beginPath();ctx.moveTo(x-r*1.5,y);ctx.lineTo(x+r*1.5,y);ctx.stroke();}
 if(k==='Design Sun'){ctx.setLineDash([2,2]);ctx.beginPath();ctx.arc(x,y,r*.55,0,TAU);ctx.stroke();ctx.setLineDash([]);}}
function signOf(lon){const i=Math.floor(((lon%360)+360)%360/30)%12;const z=MG.zsign[MG.zi[i]];return {i:i,nm:z.nm,el:z.el,root:MG.elem2root[z.el]};}
function skyOf(p){if(!p||!p.sky)return [];const s=p.sky,o=[];
 o.push(Object.assign({k:'Sun',lon:s.sun},signOf(s.sun)));o.push(Object.assign({k:'Moon',lon:s.moon},signOf(s.moon)));
 if(s.asc!=null)o.push(Object.assign({k:'Rising',lon:s.asc},signOf(s.asc)));o.push(Object.assign({k:'Design Sun',lon:s.des},signOf(s.des)));return o;}

/* ------------------------------------------------------------------ the wave: the Flow band's grammar, closed into a ring */
const D2R=PI/180;
function sectorEnv(Dr,th){ /* th from the top, clockwise, 0..TAU. smooth between the nineteen sector centres, wrapping */
 const u=th/(TAU/19)-.5,i=Math.floor(u),f=u-i,s=f*f*(3-2*f);
 return lerp(Dr[((i%19)+19)%19],Dr[(((i+1)%19)+19)%19],s);}
function ringR(g,r,th,t,Rm,ampMax,ch,Dr,nW){
 const R0=g.R0[r],f=(1/BREATH)*(.55+.9*ch),ph=r*1.3;
 const s=Math.sin(TAU*(th/TAU*nW[r]-t*f)+ph);
 const rest=(1.0+.25*Math.min(1,Rm/300))*(.5+.5*Math.sin(TAU*(th/TAU*Math.max(3,Math.round(nW[r]/1.7))-t/BREATH*.8)+ph*1.7));
 return R0+sectorEnv(Dr,th)*ampMax*(.6+.4*s)+rest;}

/* ------------------------------------------------------------------ eased display state */
const SD={D:[],CH:[]};
S.tw=0;S.cqE=0;S.dqE=0;
function setDisp(instant){const q=S.C.steps[effStep()],p=S.P;
 const T={D:[],CH:q.ch.map(v=>clamp(v/10,0,1))};
 /* cell means of SQ by (fetter, domain), from the body addresses as dumped at this step: cell of slot s is floor(s*19/n), n the slot count */
 for(let r=0;r<9;r++){T.D.push(Array(19).fill(0));}
 const cnt=[];for(let r=0;r<9;r++)cnt.push(Array(19).fill(0));
 const n=S.C.cf.length;
 for(let s=0;s<n;s++){const f=FNAME.indexOf(S.C.cf[s]);if(f<0)continue;const c=Math.floor(s*19/n);cnt[f][c]++;T.D[f][c]+=q.q[s];}
 for(let r=0;r<9;r++)for(let c=0;c<19;c++)T.D[r][c]=cnt[r][c]?G(T.D[r][c]/cnt[r][c]/10):0;
 SD.T=T;SD.cq=q.cq;SD.dq=q.dq;if(instant||!SD.D.length){SD.D=T.D.map(r=>r.slice());SD.CH=T.CH.slice();S.cqE=q.cq;S.dqE=q.dq;}}
function ensureGeo(){const cv=document.getElementById('cv');sizeStage();const r=cv.getBoundingClientRect(),w=Math.max(60,Math.round(r.width)),h=Math.max(60,Math.round(r.height));
 if(!GEO||GEO.w!==w||GEO.h!==h){GEO=geom(w,h);DIRTY=true;const st=document.getElementById('stage');st.style.setProperty('--obsw',GEO.obs.w+'px');st.style.setProperty('--obsh',GEO.obs.h+'px');st.classList.toggle('nar',GEO.narrow);}
 if(DIRTY){layoutLadder(GEO);NODES.forEach(n=>{if(n.y==null||n.a<.02&&!n.ghost)n.y=n.ty;});}}
function stepDisp(dt){ensureGeo();const k=REDUCED?1:1-Math.pow(.86,dt*60);
 S.tw+=dt*pulseRate(S.dqE);S.cqE+=(SD.cq-S.cqE)*k;S.dqE+=(SD.dq-S.dqE)*k;
 for(let r=0;r<9;r++){for(let c=0;c<19;c++)SD.D[r][c]+=(SD.T.D[r][c]-SD.D[r][c])*k;SD.CH[r]+=(SD.T.CH[r]-SD.CH[r])*k;}
 const kn=REDUCED?1:1-Math.pow(.86,dt*60);
 NODES.forEach(n=>{n.a+=((n.alive?1:0)-n.a)*kn;n.y+=(n.ty-n.y)*kn;n.wd+=(n.w-n.wd)*kn;
  if(n.alive&&n.a>.99)n.a=1;});
 LINKS.forEach(l=>{l.la+=((l.alive?1:0)-l.la)*kn;});
 const f=focusSet();
 NODES.forEach(n=>{let tgt=1;if(f)tgt=f.has(n.id)?1:.13;n.hl+=(tgt-n.hl)*kn;});
 LINKS.forEach(l=>{let tgt=1;if(f)tgt=(f.has(l.a)&&f.has(l.b))?1:.04;l.hl+=(tgt-l.hl)*kn;});}
function focusSet(){const id=S.hover&&NODES.get(S.hover)&&NODES.get(S.hover).alive?S.hover:S.pin;return id?lineage(id):null;}

/* ------------------------------------------------------------------ the Field's own grammar, ported
   Pulses: a dash seven pixels long runs down a thread, its speed the square root of the thread's tension, on one clock
   that the person's Shadow (DQ) sets, as wheel.js does (PUL_LO, PUL_HI, PUL_WAVE, PUL_WAVE_HZ). The clock is integrated,
   so a change of rate never makes a dash jump. The wash: a gold pool for coherence and four colour pools for shadow, as
   drawAura does. The core orb: cqRamp, alarm red at the floor, slate at the median, the accent at the crown. */
const PULSE_LEN=7,PUL_LO=.7,PUL_HI=1.5,PUL_WAVE=.22,PUL_WAVE_HZ=.11;
function pulseRate(dq){const d=clamp(dq/100,0,1);return lerp(PUL_LO,PUL_HI,d)*(1+PUL_WAVE*d*Math.sin(S.t*TAU*PUL_WAVE_HZ));}
function cqRamp(cq){const t=clamp(cq,0,100)/100,ST=[[0,[58,23,20]],[.28,[163,58,50]],[.5,[90,96,112]],[.76,[126,184,212]],[1,[234,244,249]]];
 for(let i=1;i<ST.length;i++){if(t<=ST[i][0]){const a=ST[i-1],b=ST[i],f=(t-a[0])/(b[0]-a[0]);return [0,1,2].map(k=>Math.round(a[1][k]+(b[1][k]-a[1][k])*f));}}return ST[4][1];}
function dashRun(ctx,tension,a,col,seed){ /* the caller has already built the path; this strokes pulses along it */
 const per=96-48*tension,sp=16+68*Math.sqrt(tension),ph=frac(seed*12.9898)*per;
 ctx.setLineDash([PULSE_LEN,per-PULSE_LEN]);ctx.lineDashOffset=-((S.tw*sp+ph)%per);
 ctx.strokeStyle=rgba(mixHex(col,'#FFFFFF',.42),a*(.28+.72*tension));ctx.lineWidth=1.3;ctx.lineCap='round';ctx.stroke();
 ctx.setLineDash([]);ctx.lineDashOffset=0;}
let AUR=null,AUR_SIG='';
function drawAura(ctx,g,t){
 if(LITE)return;
 const dpr=Math.min(window.devicePixelRatio||1,2);
 let hi=0;for(let r=1;r<9;r++)if(SD.CH[r]>SD.CH[hi])hi=r;
 /* as the Field does, the wash is repainted only when its signature moves: the drift is quantised to twelfths of a slow clock, and the frame blits it */
 const tt=REDUCED?0:Math.round(t*.09*12)/12,sig=[g.w,g.h,dpr,Math.round(S.cqE),Math.round(S.dqE),hi,tt,g.obs.cx|0,g.obs.Rm|0].join('|');
 if(sig!==AUR_SIG){AUR_SIG=sig;if(!AUR)AUR=document.createElement('canvas');AUR.width=Math.round(g.w*dpr);AUR.height=Math.round(g.h*dpr);
  const c=AUR.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);
  const O=g.obs,rad=clamp(S.cqE/100,0,1),dens=clamp(S.dqE/100,0,1),gc='#DFCC7E';
  const gr0=c.createRadialGradient(O.cx,O.cy,0,O.cx,O.cy,O.Rm*1.25);
  gr0.addColorStop(0,rgba(gc,.12+.2*rad));gr0.addColorStop(.4,rgba(gc,.04+.05*rad));gr0.addColorStop(1,rgba(gc,0));
  c.fillStyle=gr0;c.fillRect(0,0,g.w,g.h);
  const lead=FCOL[hi],warm=S.cqE<50?PAL.Root:PAL.Heart,d=Math.max(.16,dens);
  [[.13+Math.sin(tt)*.05,.19+Math.cos(tt*.8)*.05],[.87+Math.cos(tt*.7)*.05,.25+Math.sin(tt)*.05],[.09,.83+Math.sin(tt*.6)*.05],[.91,.79+Math.cos(tt*.9)*.05]].forEach((xy,i)=>{
   const col=i%2?warm:lead,gr=c.createRadialGradient(xy[0]*g.w,xy[1]*g.h,0,xy[0]*g.w,xy[1]*g.h,Math.max(g.w,g.h)*(.2+d*.3));
   gr.addColorStop(0,rgba(col,.30*d));gr.addColorStop(1,rgba(col,0));c.fillStyle=gr;c.fillRect(0,0,g.w,g.h);});}
 ctx.drawImage(AUR,0,0,g.w,g.h);}

/* ------------------------------------------------------------------ draw: the observatory */
function drawObs(ctx,g,t,Fq){
 const O=g.obs,cx=O.cx,cy=O.cy,Rm=O.Rm,sm=g.narrow,p=S.P,C0=S.C,breath=Math.sin(TAU*t/BREATH),tw=REDUCED?10:S.tw;
 const eR=i=>ent(t,.04+i*.08,.5,LAND);
 const focus=focusSet(),lit=(S.hover||S.pin)?litSlots():null;
 const TOP=-PI/2,arc=(r,a0,a1)=>{ctx.beginPath();ctx.arc(cx,cy,Math.max(.1,r),a0,a1);};
 /* the geometry stands before the data arrives */
 ctx.setLineDash([2,6]);ctx.strokeStyle='rgba(255,255,255,.07)';ctx.lineWidth=1;
 [.99,.755,.40].forEach(f=>{ctx.beginPath();ctx.arc(cx,cy,Rm*f,0,TAU);ctx.stroke();});ctx.setLineDash([]);
 /* ---- sky: twelve signs tinted by the root their element reads as, and the four points ---- */
 {const e=eR(0),sc=lerp(.6,1,e);ctx.globalAlpha=Math.min(1,e*1.6);
  const spin=REDUCED?0:t*.9*D2R,sunLon=p.sky?p.sky.sun:0,base=TOP-sunLon*D2R+spin,bw=Rm*.034*sc,rs=Rm*.972*sc;
  for(let k=0;k<12;k++){const z=MG.zsign[MG.zi[k]],a=base+k*30*D2R,rc=ROOTC[MG.elem2root[z.el]];
   ctx.strokeStyle=rgba(rc,.24);ctx.lineWidth=bw;ctx.lineCap='butt';arc(rs,a+.012,a+30*D2R-.012);ctx.stroke();}
  skyOf(p).forEach(s=>{const a=base+s.lon*D2R,x=cx+Math.cos(a)*rs,y=cy+Math.sin(a)*rs,mr=clamp(Rm*.024,4,7.5);
   ctx.fillStyle='rgba(9,10,14,.92)';ctx.beginPath();ctx.arc(x,y,mr+1.6,0,TAU);ctx.fill();glyph(ctx,s.k,x,y,mr,s.k==='Design Sun'?'#B4B0A8':ROOTC[s.root],1);});
  ctx.globalAlpha=1;}
 /* ---- roots: four arcs over their domains, and the domains: nineteen registers, thickness is the blueprint's reach ---- */
 {const e=eR(1),sc=lerp(.6,1,e),secA=TAU/19;ctx.globalAlpha=Math.min(1,e*1.6);
  RG.forEach((gr,i)=>{const rn=ROOTS[i],inUse=p.aff.indexOf(rn)>=0,a0=TOP+gr[0]*secA,a1=TOP+(gr[1]+1)*secA;
   ctx.strokeStyle=rgba(ROOTC[rn],inUse?.95:.5);ctx.lineWidth=sm?2:2.6;ctx.lineCap='butt';arc(Rm*.912*sc,a0+.02,a1-.02);ctx.stroke();
   if(!sm){const am=(a0+a1)/2,q=[cx+Math.cos(am)*Rm*.936*sc,cy+Math.sin(am)*Rm*.936*sc];
    ctx.save();ctx.translate(q[0],q[1]);let rot=am+PI/2;if(Math.sin(am)>0)rot+=PI;ctx.rotate(rot);txt(ctx,rn,0,0,9.5,mix(ROOTC[rn],'#EFEDE8',.4),'center',500);ctx.restore();}});
  ctx.globalAlpha=Math.min(1,ent(t,.12,.5,LAND)*1.6);
  for(let c=0;c<19;c++){const a=TOP+c*secA,on=p.doms.indexOf(c)>=0,col=DCOL[c],reach=p.domain[c];
   ctx.strokeStyle=rgba(col,on?1:.42+.3*reach);ctx.lineWidth=(1.6+reach*Rm*.035)*(on?1.25:1)*sc;ctx.lineCap='butt';arc(Rm*.868*sc,a+.014,a+secA-.014);ctx.stroke();
   if(on){const am=a+secA/2;ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(cx+Math.cos(am)*Rm*.896*sc,cy+Math.sin(am)*Rm*.896*sc,2,0,TAU);ctx.fill();}}
  ctx.globalAlpha=1;}
 /* ---- the address tiles: the Field's ring, one tile per address at its slot, brightness is its SQ, and it flares on its own beat ---- */
 {const ln=C0.cf.length,dA=TAU/ln,e=ent(t,.2,.7,OUT),r0=Rm*.772;
  for(let s=0;s<ln;s++){const f=FNAME.indexOf(C0.cf[s]);if(f<0)continue;const q=SLOTQ[s],gq=G(q/10),fl=REDUCED?0:Fq[s];
   const dim=lit?(lit.has(s)?1:.22):1,len=Rm*(.010+.040*gq+.026*fl*amp(q))*e,a0=TOP+s*dA+dA*.1,a1=TOP+(s+1)*dA-dA*.1;
   const al=q>.02?(.26+.5*gq+.5*fl*amp(q))*dim*e:.07*dim*e;
   ctx.beginPath();ctx.arc(cx,cy,r0,a0,a1);ctx.arc(cx,cy,r0+Math.max(1.4,len),a1,a0,true);ctx.closePath();
   ctx.fillStyle=rgba(fl>.35&&q>.02?mixHex(FCOL[f],'#FFFFFF',.35*fl):FCOL[f],Math.min(1,al));ctx.fill();}}
 /* ---- the nine wave bands. Fear outermost, Anticipation innermost, colour is the fetter's seat ---- */
 const bandHi=.69,pitch=.0365;
 if(!g.R0)g.R0=[];const R0=g.R0;for(let r=0;r<9;r++)R0[r]=Rm*(bandHi-r*pitch);
 const ampMax=Rm*pitch*1.75,nW=[];for(let r=0;r<9;r++)nW[r]=Math.max(7,Math.round(TAU*R0[r]/(sm?70:120)));
 const fnode=r=>NODES.get('f:'+FNAME[r]);
 for(let r=0;r<9;r++){
  const e=ent(t,.24+.06*r,.46,LAND),amx=ampMax*e,col=FCOL[r],ch=SD.CH[r],n=fnode(r);
  const step=LITE?5:Math.max(1.6,Math.min(3.2,TAU*R0[r]/360)),N=Math.ceil(TAU*R0[r]/step);
  const px=new Float32Array(N+1),py=new Float32Array(N+1);
  for(let i=0;i<=N;i++){const th=i/N*TAU,rad=ringR(g,r,th,tw,Rm,amx,ch,SD.D[r],nW);const a=TOP+th;px[i]=cx+Math.cos(a)*rad;py[i]=cy+Math.sin(a)*rad;}
  const dimF=focus?(focus.has('f:'+FNAME[r])?1:.2):1;
  const base=(.34+.55*G(ch))*(.6+.4*e)*dimF;
  ctx.beginPath();for(let i=0;i<=N;i++)i?ctx.lineTo(px[i],py[i]):ctx.moveTo(px[i],py[i]);
  ctx.arc(cx,cy,R0[r],TAU+TOP,TOP,true);ctx.closePath();ctx.fillStyle=rgba(col,(.12*G(ch)+.025)*dimF);ctx.fill();
  ctx.beginPath();for(let i=0;i<=N;i++)i?ctx.lineTo(px[i],py[i]):ctx.moveTo(px[i],py[i]);ctx.closePath();
  ctx.lineJoin='round';if(!LITE){ctx.strokeStyle=rgba(col,.12*dimF);ctx.lineWidth=sm?3.4:5;ctx.stroke();}
  const lt=n?n.fl:0;
  ctx.strokeStyle=rgba(col,Math.min(1,base+.4*lt*dimF));ctx.lineWidth=sm?1:1.35+.5*lt;ctx.stroke();
  if(ch>.03&&!REDUCED){const Pb=BREATH*(2.4-ch*1.4),u=frac(tw/Pb+r*.37);
   for(let k=0;k<6;k++){const th=frac(u-k*(sm?.0045:.0032))*TAU,rad=ringR(g,r,th,tw,Rm,amx,ch,SD.D[r],nW),a=TOP+th;
    ctx.fillStyle='rgba(239,237,232,'+(.8*(1-k/6)*e*dimF).toFixed(3)+')';ctx.beginPath();ctx.arc(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad,(sm?1.3:1.9)*(1-k/9),0,TAU);ctx.fill();}}
  for(let c=0;c<19;c++){if(!isAff(r,c))continue;const inUse=p.aff.indexOf(DROOT[c])>=0;
   if(!(inUse&&SD.T.D[r][c]>.02))continue;const th=(c+.5)*TAU/19,rad=ringR(g,r,th,tw,Rm,amx,ch,SD.D[r],nW),a=TOP+th;
   ctx.strokeStyle=rgba(C.gold,.9*e*dimF);ctx.lineWidth=1.05;ctx.beginPath();ctx.arc(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad,(sm?2.2:3.1)+(REDUCED?0:.7*breath),0,TAU);ctx.stroke();}}
 /* the seam labels: the nine bands, named once, where the ring starts */
 if(!sm){ctx.font='500 9.5px '+FONT;ctx.textAlign='right';ctx.textBaseline='middle';
  for(let r=0;r<9;r++){const y=cy-R0[r]-1.5,e=ent(t,.4+.04*r,.3);ctx.lineWidth=3;ctx.strokeStyle='rgba(9,10,14,.9)';ctx.strokeText(ABBR[r],cx-6,y);
   ctx.fillStyle='rgba(200,198,192,'+(.9*e).toFixed(3)+')';ctx.fillText(ABBR[r],cx-6,y);}}
 /* ---- sparks: an address that is beating throws a ring on its own band, where it really sits ---- */
 if(!REDUCED){const esp=ent(t,.9,.5),ln=C0.cf.length;
  for(let s=0;s<ln;s++){const q=SLOTQ[s];if(q<.02)continue;const e=Fq[s];if(e<.05)continue;const r=FNAME.indexOf(C0.cf[s]);if(r<0)continue;
   const dim=lit?(lit.has(s)?1:.15):1,th=(s+.5)/ln*TAU,rad=ringR(g,r,th,tw,Rm,ampMax*ent(t,.24+.06*r,.46,LAND),SD.CH[r],SD.D[r],nW),a=TOP+th,x=cx+Math.cos(a)*rad,y=cy+Math.sin(a)*rad,am=amp(q)*esp*dim;
   ctx.strokeStyle=rgba(FCOL[r],.5*e*am);ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,2.5+(sm?5:8)*(1-e),0,TAU);ctx.stroke();
   ctx.fillStyle=rgba(mixHex(FCOL[r],'#EFEDE8',.45),Math.min(1,.95*e*am+.05));ctx.beginPath();ctx.arc(x,y,(sm?1.3:1.8)+1.4*e*am,0,TAU);ctx.fill();}}
 drawCore(ctx,g,t);
 if(!sm&&O.w>=480)txt(ctx,'Outside in: sky, roots, domains, addresses, nine fetter bands, the core.',cx,cy+Rm+14,10.5,C.dim,'center');}
function mix2(h){return mixHex(h,'#EFEDE8',.45);}
function mixHex(h1,h2,k){const a=hex2(h1),b=hex2(h2);const f=v=>Math.round(v).toString(16).padStart(2,'0');return '#'+f(lerp(a[0],b[0],k))+f(lerp(a[1],b[1],k))+f(lerp(a[2],b[2],k));}
function litSlots(){const id=S.hover&&NODES.get(S.hover)&&NODES.get(S.hover).alive?S.hover:S.pin;const n=id&&NODES.get(id);if(!n)return null;return new Set(n.slots);}

/* the lamps */
function coreList(){const l=liveOf(S.view);
 if(S.view===0)return l.sort((a,b)=>a.fi-b.fi);
 return l.sort((a,b)=>b.w-a.w||(a.nm<b.nm?-1:1));}
function drawCore(ctx,g,t){
 const O=g.obs,cx=O.cx,cy=O.cy,Rm=O.Rm,sm=g.narrow,ec=ent(t,.46,.5,LAND);
 const list=coreList(),n=list.length,view=S.view,focus=focusSet();
 if(!LITE){const gr=ctx.createRadialGradient(cx,cy,0,cx,cy,Rm*.4);gr.addColorStop(0,'rgba(126,184,212,.08)');gr.addColorStop(1,'rgba(126,184,212,0)');
  ctx.fillStyle=gr;ctx.beginPath();ctx.arc(cx,cy,Rm*.4*ec,0,TAU);ctx.fill();}
 ctx.strokeStyle='rgba(255,255,255,.07)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,Rm*.37*ec,0,TAU);ctx.stroke();
 const capA=view===0?9:12,capB=8,shown=Math.min(n,capA+capB),two=shown>capA;
 const rA=Rm*(two?.275:.25),rB=Rm*.155,Rl=clamp(Rm*(two?.030:.036),4.6,11),Ro=Rm*(two?.06:.075)*ec;
 CORE=[];
 /* the orb: coherence, sized and coloured by CQ the way the Field's core is. its number is the one figure the Field already shows. */
 {const c=cqRamp(S.cqE),col='rgb('+c[0]+','+c[1]+','+c[2]+')',og=ctx.createRadialGradient(cx-Ro*.3,cy-Ro*.35,Ro*.1,cx,cy,Ro);
  og.addColorStop(0,'rgba('+Math.min(255,c[0]+60)+','+Math.min(255,c[1]+60)+','+Math.min(255,c[2]+60)+',.95)');og.addColorStop(1,'rgba('+c[0]+','+c[1]+','+c[2]+',.9)');
  ctx.fillStyle=og;ctx.beginPath();ctx.arc(cx,cy,Math.max(1,Ro),0,TAU);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=1;ctx.stroke();
  txt(ctx,String(Math.round(S.cqE)),cx,cy+.5,clamp(Ro*.9,10,20),S.cqE>60?'#0C0D12':'#EFEDE8','center',600);}
 const clk=ent(t,.46,.4);
 for(let i=0;i<shown;i++){const nd=list[i],ring=i<capA?0:1,idx=ring?i-capA:i,cnt=ring?Math.min(capB,shown-capA):Math.min(capA,shown);
  const a=TOP0+(idx+(ring?.5:0))/cnt*TAU,r=ring?rB:rA,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;
  const en=ent(t,.5+i*.035,.34,LAND),col=nd.col,dim=nd.hl,fl=nd.fl*dim,rad=Rl*lerp(.5,1,en);
  CORE.push({id:nd.id,x:x,y:y,r:Rl+6});
  /* the spoke: a thread from the lamp in to the orb, with a pulse running down it while the lamp is on */
  const sx0=x-Math.cos(a)*(rad+3),sy0=y-Math.sin(a)*(rad+3),sx1=cx+Math.cos(a)*(Ro+3),sy1=cy+Math.sin(a)*(Ro+3);
  ctx.strokeStyle=rgba(col,(.10+.34*fl)*dim*en);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx0,sy0);ctx.lineTo(sx1,sy1);ctx.stroke();
  if(!REDUCED&&!LITE&&fl>.08){ctx.beginPath();ctx.moveTo(sx0,sy0);ctx.lineTo(sx1,sy1);dashRun(ctx,clamp(nd.w/10,0,1),fl*dim*en,col,i+.5);}
  if(fl>.03){if(LITE){ctx.fillStyle=rgba(col,.22*fl*en);ctx.beginPath();ctx.arc(x,y,rad*2.2,0,TAU);ctx.fill();}else{const hg=ctx.createRadialGradient(x,y,0,x,y,rad*3.6);hg.addColorStop(0,rgba(col,.55*fl*en));hg.addColorStop(1,rgba(col,0));ctx.fillStyle=hg;ctx.beginPath();ctx.arc(x,y,rad*3.6,0,TAU);ctx.fill();}}
  /* ticks: one for each of its heaviest addresses, each popping on its own beat */
  const sl=nd.slots.slice().sort((p,q)=>SLOTQ[q]-SLOTQ[p]).slice(0,sm?5:8),m=sl.length;
  for(let k=0;k<m;k++){const ak=-PI/2+k/m*TAU,e=REDUCED?0:Fq0[sl[k]],tl=2.5+3.5*e;
   ctx.strokeStyle=rgba(col,(.18+.82*e)*dim*en);ctx.lineWidth=sm?1.1:1.4;ctx.beginPath();ctx.moveTo(x+Math.cos(ak)*(rad+3),y+Math.sin(ak)*(rad+3));ctx.lineTo(x+Math.cos(ak)*(rad+3+tl),y+Math.sin(ak)*(rad+3+tl));ctx.stroke();}
  /* the node: a ring, never a fill. the pop is the dot inside it. */
  ctx.strokeStyle=rgba(col,(.4+.6*fl)*dim*en);ctx.lineWidth=1.6;if(nd.over)ctx.setLineDash([2.5,2.5]);ctx.beginPath();ctx.arc(x,y,rad,0,TAU);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=rgba(col,(.06+.9*fl)*dim*en);ctx.beginPath();ctx.arc(x,y,rad*(.28+.5*fl),0,TAU);ctx.fill();
  /* the value pill the Field hangs under its nodes */
  if(!sm&&shown<=capA){const v=nd.w>0?nd.w.toFixed(1):'-',py=y+rad+9,pw=22;ctx.fillStyle='rgba(20,22,29,'+(.9*dim*en).toFixed(3)+')';rr(ctx,x-pw/2,py-6,pw,12,6);ctx.fill();
   ctx.strokeStyle=rgba(col,.35*dim*en);ctx.lineWidth=1;ctx.stroke();txt(ctx,v,x,py+.5,8.5,'rgba(220,218,212,'+(.9*dim*en).toFixed(3)+')','center',500);}
  if(view===0&&!sm){const lx=cx+Math.cos(a)*(r+Rl+(shown<=capA?25:13)),ly=cy+Math.sin(a)*(r+Rl+(shown<=capA?25:13));txt(ctx,ABBR[nd.fi],lx,ly,9.5,'rgba(200,198,192,'+(.85*dim*en).toFixed(3)+')','center',500);}
  else if(view!==0&&(S.hover===nd.id||S.pin===nd.id)){const out=Math.cos(a)>=0,tx=fitText(ctx,nd.lab,'500 10px '+FONT,120);ctx.font='500 10px '+FONT;const tw=ctx.measureText(tx).width;
   const bx=out?x+Rl+5:x-Rl-5-tw-10;ctx.fillStyle='rgba(9,10,14,.9)';rr(ctx,bx,y-9,tw+10,18,8);ctx.fill();txt(ctx,tx,bx+5,y,10,'#EFEDE8','left',500);}
  if(S.pin===nd.id||S.hover===nd.id){ctx.strokeStyle=rgba('#EFEDE8',.9);ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(x,y,rad+3,0,TAU);ctx.stroke();}}
 ctx.globalAlpha=1;}
const TOP0=-PI/2;
let CORE=[],Fq0=new Float32Array(120);

/* ------------------------------------------------------------------ draw: the chain */
function drawChain(ctx,g,t){
 const L=g.lad,sm=g.narrow,view=S.view,focus=focusSet();
 HITS=[];
 /* headers, which are also the lens */
 const hy=L.y+(sm?18:24);
 for(let l=0;l<4;l++){const x=L.colX[l],e=ent(t,.1+l*.06,.3),open=sees(l),cnt=l===0?liveOf(0).filter(n=>n.w>0).length:liveOf(l).length,on=l===view;
  ctx.globalAlpha=e;
  const hf=sm?10:10.5,HEAD=['Fetters','Saboteurs','Complexes',sm?'Hyper':'Hyper complexes'];
  txt(ctx,fitText(ctx,HEAD[l],'600 '+hf+'px '+FONT,L.cw-(open?4:18)),x+2,hy,hf,open?(on?C.ink:C.mid):C.dim,'left',on?600:500);
  if(open)txt(ctx,l===0?cnt+' carrying':cnt+' running',x+2,hy+15,sm?9.5:10.5,on?C.acc:C.dim,'left',500);
  else{lockGlyph(ctx,x+L.cw-8,hy,6,C.dim);txt(ctx,'locked',x+2,hy+15,sm?9.5:10.5,C.dim,'left',500);}
  ctx.strokeStyle=on?rgba(C.acc,.9):'rgba(255,255,255,.12)';ctx.lineWidth=on?2:1;ctx.beginPath();ctx.moveTo(x,hy+26);ctx.lineTo(x+L.cw,hy+26);ctx.stroke();
  ctx.globalAlpha=1;HITS.push({kind:'head',lvl:l,x:x,y:hy-14,w:L.cw,h:44});}
 /* what a locked column says, where the nodes would have been */
 for(let l=1;l<4;l++){if(sees(l))continue;const x=L.colX[l],mid=(L.top+L.bottom)/2,e=ent(t,.3+l*.06,.4);
  ctx.globalAlpha=e;ctx.setLineDash([3,5]);ctx.strokeStyle='rgba(255,255,255,.16)';ctx.lineWidth=1;rr(ctx,x,L.top+4,L.cw,L.bottom-L.top-8,10);ctx.stroke();ctx.setLineDash([]);
  lockGlyph(ctx,x+L.cw/2,mid-14,10,C.dim);
  txt(ctx,'Locked',x+L.cw/2,mid+10,sm?10:11,C.dim,'center',500);txt(ctx,TIERNM[SIGHT[l].need]+' and above',x+L.cw/2,mid+25,sm?9:10,C.dim,'center');ctx.globalAlpha=1;}
 /* links first, so the nodes sit on them */
 const fl=[];let maxW=.1;LINKS.forEach(l=>{if(l.a.charAt(0)==='f'&&(l.alive||l.la>.01)){fl.push(l);if(l.alive&&l.w>maxW)maxW=l.w;}});
 /* each saboteur keeps its strongest link, so none floats free. every other fetter link is drawn only while it is among the heaviest. */
 const nMain=fl.filter(l=>l.main).length,cap=nMain+(sm?4:12);
 fl.sort((a,b)=>b.w-a.w);const shownF=new Set();let extra=0;
 fl.forEach(l=>{if(S.showAll||l.main||(focus&&focus.has(l.a)&&focus.has(l.b)))shownF.add(l.k);else if(extra<cap-nMain){extra++;shownF.add(l.k);}});
 HIDDEN=fl.filter(l=>l.alive&&!shownF.has(l.k)).length;
 const eL=ent(t,.8,.5);
 ctx.lineCap='round';
 LINKS.forEach(l=>{
  const A=NODES.get(l.a),B=NODES.get(l.b);if(!A||!B||(A.a<.02&&!A.ghost)||(B.a<.02&&!B.ghost))return;
  const isF=l.a.charAt(0)==='f';if(isF&&!shownF.has(l.k))return;
  const wn=clamp(l.w/(isF?maxW:10),0,1),xa=L.colX[A.lvl]+L.cw,xb=L.colX[B.lvl],ya=A.y,yb=B.y,dx=xb-xa;
  const nowAct=Math.min(A.fl*A.hl,B.fl*B.hl);
  const emph=(A.lvl===view||B.lvl===view)?1:.62;
  let al=((.07+.30*wn)*emph+.55*nowAct)*l.la*l.hl*eL*Math.min(A.a,B.a);
  if(focus&&l.hl>.5)al=Math.max(al,.55);
  if(al<.01)return;
  ctx.lineWidth=.7+1.5*wn+(focus&&l.hl>.5?.5:0);
  if(focus&&l.hl>.5){const gr=ctx.createLinearGradient(xa,0,xb,0);gr.addColorStop(0,rgba(A.col,Math.min(1,al)));gr.addColorStop(1,rgba(B.col,Math.min(1,al)));ctx.strokeStyle=gr;}
  else ctx.strokeStyle=rgba(B.col,Math.min(1,al));
  ctx.beginPath();ctx.moveTo(xa,ya);ctx.bezierCurveTo(xa+dx*.52,ya,xb-dx*.52,yb,xb,yb);ctx.stroke();
  /* the Field's pulse: a short dash runs down the thread toward the core, the way a chain compounds. its speed is the thread's tension. */
  if(!REDUCED&&!LITE&&al>.05){ctx.beginPath();ctx.moveTo(xa,ya);ctx.bezierCurveTo(xa+dx*.52,ya,xb-dx*.52,yb,xb,yb);dashRun(ctx,wn,Math.min(1,al*1.6+.1),B.col,ya*.013+yb*.007);}});
 /* nodes */
 const all=[];NODES.forEach(n=>{if(n.a>.02||n.ghost)all.push(n);});
 all.sort((a,b)=>a.hl-b.hl);
 all.forEach(n=>{
  const x=L.colX[n.lvl],w=L.cw,h=n.ph||24,y=n.y-h/2,idx=Math.max(0,n.idx||0);
  const en=ent(t,.3+n.lvl*.13+(n.rank||0)*.016,.34,LAND),a0=n.ghost&&!n.alive?.2+.8*n.a:n.a;
  const dim=n.hl*(n.lvl===view?1:.66);
  const al=a0*dim*Math.min(1,en*1.4),fl=n.fl*n.hl;
  const sc=lerp(.9,1,en);
  ctx.save();ctx.translate(x+w/2,y+h/2);ctx.scale(sc,sc);ctx.translate(-(x+w/2),-(y+h/2));
  const col=n.col,lit=hover(n)||S.pin===n.id;
  /* ring, never fill: the pop is the glow inside it */
  rr(ctx,x,y,w,h,Math.min(9,h/2));
  ctx.fillStyle=rgba(col,(.04+.22*fl)*al);ctx.fill();
  if(n.over)ctx.setLineDash([3,3]);
  ctx.strokeStyle=rgba(col,(.34+.66*fl+(lit?.3:0))*al);ctx.lineWidth=lit?1.8:1.2;ctx.stroke();ctx.setLineDash([]);
  /* the same node the core wears: a small ring, with the pop as the dot inside it */
  if(!sm){const dx0=x+h/2+1,dy0=y+h/2-(n.lvl===2&&h>=26?0:0);ctx.strokeStyle=rgba(col,(.5+.5*fl)*al);ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(dx0,dy0,3.7,0,TAU);ctx.stroke();
   ctx.fillStyle=rgba(col,(.1+.9*fl)*al);ctx.beginPath();ctx.arc(dx0,dy0,1.2+1.5*fl,0,TAU);ctx.fill();}
  /* weight, a bar along the foot */
  if(n.ghost&&!n.alive){}else if(h<22&&!sm||h<20){const wn=clamp(n.wd/10,0,1);ctx.strokeStyle=rgba(col,.85*al);ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+w-5,y+h-4);ctx.lineTo(x+w-5,y+h-4-(h-8)*wn);ctx.stroke();ctx.lineCap='butt';}else{const wn=clamp(n.wd/10,0,1);ctx.strokeStyle=rgba(col,.8*al);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+(sm?7:h/2+8),y+h-3);ctx.lineTo(x+(sm?7:h/2+8)+(w-(sm?14:h/2+18))*wn,y+h-3);ctx.stroke();}
  const fs=n.lvl===0?10:(sm?9.5:10.5);
  const tc=rgba(mixHex(col,'#EFEDE8',.6),.95*al);
  if(n.lvl===2&&h>=26&&n.lab.indexOf(' + ')>0){const parts=n.lab.split(' + '),f2='500 '+(sm?9:10)+'px '+FONT;
   const lx0=sm?x+7:x+h/2+10,lw=sm?w-12:w-h/2-14;txt(ctx,fitText(ctx,parts[0]+' +',f2,lw),lx0,y+h/2-6,sm?9:10,tc,'left',500);txt(ctx,fitText(ctx,parts[1],f2,lw),lx0,y+h/2+5,sm?9:10,tc,'left',500);}
  else{const room=(sm?w-12:w-h/2-12)-(n.lvl===0?24:0),f1='500 '+fs+'px '+FONT;txt(ctx,fitText(ctx,sm&&n.lvl===0?ABBR[n.fi]:n.lab,f1,room),sm?x+7:x+h/2+10,y+h/2-(n.lvl===0?0:1),fs,tc,'left',500);}
  if(n.lvl===0){txt(ctx,n.w>0?n.w.toFixed(1):'-',x+w-8,y+h/2,fs,n.w>0?rgba(mixHex(col,'#EFEDE8',.4),al):rgba(C.dim,al),'right',500);}
  ctx.restore();
  if(n.alive)HITS.push({kind:'node',id:n.id,x:x,y:y,w:w,h:h});});
 /* the core lamps are hits too */
 CORE.forEach(c=>HITS.push({kind:'lamp',id:c.id,x:c.x-c.r,y:c.y-c.r,w:c.r*2,h:c.r*2,round:true,cx:c.x,cy:c.y,r:c.r}));
 /* when a thread is lit, say what is hidden or kept */
 if(!focus&&HIDDEN>0&&!sm){txt(ctx,HIDDEN+' weaker fetter links hidden',L.x+L.pad,L.bottom+22,11,C.dim,'left');}
 else if(!focus&&HIDDEN>0){txt(ctx,HIDDEN+' weaker fetter links hidden',L.x+L.pad,L.bottom+8,10,C.dim,'left');}}
let HIDDEN=0;
function bz(a,b,c,d,u){const v=1-u;return v*v*v*a+3*v*v*u*b+3*v*u*u*c+u*u*u*d;}
function hover(n){return S.hover===n.id;}
function lockGlyph(ctx,x,y,s,col){ctx.save();ctx.translate(x-s,y-s);ctx.scale(s*2/24,s*2/24);ctx.strokeStyle=col;ctx.lineWidth=1.9;ctx.lineCap='round';ctx.lineJoin='round';
 ctx.beginPath();ctx.moveTo(5+2.4,10.8);ctx.lineTo(19-2.4,10.8);ctx.arcTo(19,10.8,19,13.2,2.4);ctx.lineTo(19,18.1);ctx.arcTo(19,20.5,16.6,20.5,2.4);ctx.lineTo(7.4,20.5);ctx.arcTo(5,20.5,5,18.1,2.4);ctx.lineTo(5,13.2);ctx.arcTo(5,10.8,7.4,10.8,2.4);ctx.closePath();ctx.stroke();
 ctx.beginPath();ctx.moveTo(8.3,10.8);ctx.lineTo(8.3,8.2);ctx.arc(12,8.2,3.7,PI,0);ctx.lineTo(15.7,10.8);ctx.stroke();ctx.restore();}

/* ------------------------------------------------------------------ one frame */
function flares(t){
 const n=S.C.cf.length;
 for(let s=0;s<n;s++)FL[s]=SLOTQ[s]>.02?(REDUCED?0:beat(s,SLOTQ[s],t)):0;
 Fq0=FL;
 NODES.forEach(nd=>{let m=0,mq=0;for(let i=0;i<nd.slots.length;i++){const s=nd.slots[i],q=SLOTQ[s];if(q<.02)continue;const e=REDUCED?1:FL[s],v=amp(q)*e;if(v>m)m=v;if(q>mq)mq=q;}
  nd.fl=REDUCED?(nd.alive&&mq>0?.18+.5*G(mq/10):0):m;});}
function sizeStage(){const st=document.getElementById('stage'),w=st.clientWidth;
 if(w<760){const h=phoneHeight(w);if(st.dataset.h!==String(h)){st.style.height=h+'px';st.dataset.h=h;}}else if(st.dataset.h){st.style.height='';st.dataset.h='';}}
function drawAll(t){const t0=performance.now();
 S.t=t;sizeStage();
 ensureGeo();const cv=document.getElementById('cv'),dpr=LITE?1:Math.min(window.devicePixelRatio||1,2),w=GEO.w,h=GEO.h;
 if(cv.width!==Math.round(w*dpr)||cv.height!==Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);}
 const ctx=cv.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 flares(t);
 drawAura(ctx,GEO,t);
 drawObs(ctx,GEO,t,FL);
 drawChain(ctx,GEO,t);
 cost.push(performance.now()-t0);if(cost.length>180)cost.shift();}
let skipF=false;
function loop(now){raf=requestAnimationFrame(loop);if(LITE){skipF=!skipF;if(skipF)return;}
 if(lastNow!=null)frameGap.push(now-lastNow);if(frameGap.length>180)frameGap.shift();
 const dt=lastNow==null?0:Math.min(.05,(now-lastNow)/1000);lastNow=now;
 if(S.play&&!REDUCED){S.playT=(S.playT||0)+dt;if(S.playT>.95){S.playT=0;setStep(S.step>=11?0:S.step+1);}}
 stepDisp(dt);simT+=dt;drawAll(simT);}
function seek(t){cancelAnimationFrame(raf);seeking=true;simT=0;{const pn=S.pin,hv=S.hover;setPerson(S.who,true);S.pin=pn;S.hover=hv;}let tt=0;while(tt<t-1e-9){const dt=Math.min(1/60,t-tt);stepDisp(dt);tt+=dt;}simT=t;syncUI();drawAll(t);}
function redraw(){if(REDUCED||seeking){stepDisp(1);drawAll(REDUCED?10:simT);}}

/* ------------------------------------------------------------------ page */
function build(){
 document.title='Layer observatory | Mockups';
 const b=document.body;
 b.innerHTML='<header class="top"><div class="ey">Fetters, saboteurs, complexes and hyper complexes in one picture, round OY</div><h1>Layer observatory</h1>'
 +'<p class="lede">Sky, roots, domains and the address tiles around nine fetter wave bands. The core pops by level. The chain joins the levels, and a link lights while both of its ends flare.</p></header>'
 +'<div class="bar" id="bar"></div>'
 +'<div class="wrap"><div class="main"><section class="stage" id="stage" aria-label="Layer observatory"><canvas id="cv" role="img" aria-label="The observatory and the chain. The summary beside it says the same in words."></canvas><div class="ro" id="ro"></div>'
 +'<div class="hid" id="hid"></div></section>'
 +'<div class="scrub" id="scrub"></div>'
 +'<p class="rule" id="rule"></p></div>'
 +'<aside class="side" id="side"></aside></div>'
 +'<div class="tip" id="tip" role="dialog" aria-label="Locked on your plan"></div><div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-label="Tiers"></div>';
 const bar=document.getElementById('bar');
 const mk=(cls,h)=>{const d=document.createElement('div');d.className=cls;d.innerHTML=h;bar.appendChild(d);return d;};
 const who=mk('grp who','<span class="l">Person</span>');
 WHO.forEach(a=>{const bt=document.createElement('button');bt.type='button';bt.className='chip';bt.dataset.n=a[0];bt.textContent=a[1];bt.setAttribute('aria-pressed','false');bt.onclick=()=>setPerson(a[0],false,true);who.appendChild(bt);});
 const vw=mk('grp v','<span class="l">View by</span>');
 const sg=document.createElement('div');sg.className='seg';sg.setAttribute('role','group');sg.setAttribute('aria-label','View by');
 LV.forEach((k,i)=>{const bt=document.createElement('button');bt.type='button';bt.className='chip';bt.dataset.v=i;bt.setAttribute('aria-pressed','false');bt.innerHTML='<span>'+LVNAME[i]+'</span>';bt.onclick=()=>onViewBtn(i,bt);bt.onfocus=()=>{if(!sees(i))showTip(bt,i);};bt.onmouseenter=()=>{if(!sees(i))showTip(bt,i);};bt.onmouseleave=()=>hideTipSoon();sg.appendChild(bt);});
 vw.appendChild(sg);
 const mw=mk('grp v','<span class="l">Interaction</span>');
 const sg2=document.createElement('div');sg2.className='seg three';sg2.setAttribute('role','group');sg2.setAttribute('aria-label','Interaction');
 [['lens','Lens'],['thread','Follow a thread'],['scrub','Scrub']].forEach(a=>{const bt=document.createElement('button');bt.type='button';bt.className='chip';bt.dataset.m=a[0];bt.textContent=a[1];bt.setAttribute('aria-pressed','false');bt.onclick=()=>setMode(a[0]);sg2.appendChild(bt);});
 mw.appendChild(sg2);
 const pw=mk('grp plan','<span class="l">Your plan, demo</span>');
 const sel=document.createElement('select');sel.className='chip';sel.id='plan';sel.setAttribute('aria-label','Your plan, a demo of the lock');
 [['free','Free'],['one','Tier one'],['two','Tier two'],['three','Tier three']].forEach(a=>{const o=document.createElement('option');o.value=a[0];o.textContent=a[1];sel.appendChild(o);});
 sel.value=S.plan;sel.onchange=()=>setPlan(sel.value);pw.appendChild(sel);
 /* scrub bar */
 const sc=document.getElementById('scrub');
 sc.innerHTML='<button type="button" class="go" id="play" aria-label="Play the history"><svg viewBox="0 0 24 24" id="playsvg"><path d="M8 5.5v13l10-6.5z"/></svg></button><div class="tr"><div class="lab"><span id="sclab"></span><span id="scnote">Mock history. The dates are not real.</span></div><canvas id="spark"></canvas><input type="range" id="rng" min="0" max="11" step="1" value="11" aria-label="Entry"></div>';
 document.getElementById('rng').oninput=e=>setStep(+e.target.value,true);
 document.getElementById('play').onclick=togglePlay;
 document.getElementById('rule').innerHTML='<b>Pop rule.</b> Every address that holds charge beats on its own clock: 7.2 s minus 0.62 s per point of SQ, never under 1.4 s. It flares for 12 percent of the beat, with a fast rise and a slow fall. Its phase is its slot times 0.618 of a turn, so beats never line up. Brightness is its SQ. A node shows the beats of the addresses it is made of. Same person and same time always draw the same picture.';
 document.getElementById('hid').innerHTML='<span id="hidn"></span><button type="button" id="alllinks">Show all links</button>';
 document.getElementById('alllinks').onclick=()=>{S.showAll=!S.showAll;syncUI();redraw();};
 /* tip + sheet */
 const tip=document.getElementById('tip');tip.onmouseenter=()=>{clearTimeout(tipT);};tip.onmouseleave=()=>hideTipSoon();
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){hideTip();closeSheet();}});
 document.addEventListener('click',e=>{if(!e.target.closest('.tip,.seg .chip.lk,.lk-go'))hideTip();});
 const cv=document.getElementById('cv');pointers(cv);
 window.addEventListener('resize',()=>{DIRTY=true;redraw();});}
let tipT=0;
function showTip(btn,l){clearTimeout(tipT);const tip=document.getElementById('tip');
 tip.innerHTML='<div class="t">'+esc(LVNAME[l])+', locked on your plan</div><p>'+esc(lockSay(l))+'</p><button type="button" class="tip-go">See tiers</button>';
 const r=btn.getBoundingClientRect();tip.classList.add('on');const tw=tip.offsetWidth;tip.style.left=clamp(r.left,8,window.innerWidth-tw-8)+'px';tip.style.top=(r.bottom+8)+'px';
 tip.querySelector('.tip-go').onclick=()=>{hideTip();openSheet();};}
function hideTip(){const t=document.getElementById('tip');if(t)t.classList.remove('on');}
function hideTipSoon(){clearTimeout(tipT);tipT=setTimeout(hideTip,260);}
function openSheet(){const sh=document.getElementById('sheet');
 const rows=[['free','Free','Ten patterns a week, for life.','Your own reading at the 112 addresses, the domains, the archetypes, the laws, the gates and the shadow.'],
  ['one','Tier one','Four hundred patterns a month.','Adds saboteurs.'],['two','Tier two','Eight hundred patterns a month.','Adds saboteurs and complexes.'],
  ['three','Tier three','Twelve hundred patterns a month.','Adds saboteurs, complexes and hyper complexes, and the character, the registers and the masks.']];
 sh.innerHTML='<div class="in"><h3>Tiers</h3><p class="sub">A stand-in for the Billing tiers page. What each tier sees is read off SIGHT in engine/plan.js; the grants are PLANS. Nothing here sells anything.</p>'
  +rows.map(r=>'<div class="row'+(r[0]===S.plan?' you':'')+'"><b>'+r[1]+(r[0]===S.plan?' (your plan, demo)':'')+'</b><span class="n">'+r[2]+'</span><p>'+r[3]+'</p></div>').join('')
  +'<div class="x"><button type="button" id="shx">Close</button></div></div>';
 sh.classList.add('on');const x=document.getElementById('shx');x.onclick=closeSheet;x.focus();sh.onclick=e=>{if(e.target===sh)closeSheet();};}
function closeSheet(){const sh=document.getElementById('sheet');if(sh)sh.classList.remove('on');}

/* ------------------------------------------------------------------ actions */
function setPerson(n,instant,fromUI){S.who=n;S.P=MG.people.find(p=>p.nm===n);S.C=OB.people[n];S.pin=null;S.hover=null;if(S.mode==='scrub'&&fromUI)S.step=11;
 rebuild();setDisp(!!instant);syncUI();DIRTY=true;if(fromUI)redraw();}
function setView(l){if(!sees(l)){return;}S.view=l;DIRTY=true;syncUI();redraw();}
function onViewBtn(i,bt){if(!sees(i)){showTip(bt,i);return;}hideTip();setView(i);}
function setMode(m){if(S.mode===m)return;const was=S.mode;S.mode=m;document.getElementById('stage').classList.toggle('sm',m==='scrub');if(m!=='scrub'){S.play=false;S.step=11;}if(m==='lens'||(was==='scrub'&&m==='lens'))S.pin=null;
 rebuild();setDisp(false);syncUI();DIRTY=true;redraw();}
function setPlan(p){S.plan=p;if(!sees(S.view))S.view=0;if(S.pin&&!sees(NODES.get(S.pin)?NODES.get(S.pin).lvl:0))S.pin=null;rebuild();setDisp(false);syncUI();DIRTY=true;redraw();}
function setStep(i,fromUI){S.step=clamp(Math.round(i),0,11);if(fromUI)S.play=false;rebuild();setDisp(false);syncUI();DIRTY=true;redraw();}
function togglePlay(){if(REDUCED)return;S.play=!S.play;S.playT=0;if(S.play&&S.step>=11)setStep(0);syncUI();}
function clickNode(id){const n=NODES.get(id);if(!n)return;
 if(S.mode==='lens'){S.pin=null;setView(n.lvl);return;}
 S.pin=(S.pin===id)?null:id;S.hover=null;syncUI();redraw();}

/* ------------------------------------------------------------------ pointer */
function pointers(cv){
 const at=e=>{const r=cv.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};};
 const hit=(x,y)=>{for(let i=HITS.length-1;i>=0;i--){const h=HITS[i];
   if(h.round){if(Math.hypot(x-h.cx,y-h.cy)<=h.r)return h;}else if(x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h)return h;}return null;};
 const mv=e=>{const q=at(e),h=hit(q.x,q.y);let id=null;
  if(h&&(h.kind==='node'||h.kind==='lamp'))id=h.id;
  cv.style.cursor=h?'pointer':'default';
  const ring=(!h&&GEO)?ringHtml(q.x,q.y):null;
  if(id!==S.hover){S.hover=id;say(id?hoverHtml(id):(h&&h.kind==='head'?headHtml(h.lvl):ring));redraw();}
  else if(!id)say(h&&h.kind==='head'?headHtml(h.lvl):ring);};
 cv.addEventListener('pointermove',mv);
 cv.addEventListener('pointerdown',e=>{const q=at(e),h=hit(q.x,q.y);
  if(e.pointerType==='touch'||e.pointerType==='pen'){mv(e);}
  if(!h){if(S.pin&&S.mode!=='lens'){S.pin=null;syncUI();redraw();}return;}
  if(h.kind==='head'){if(sees(h.lvl))setView(h.lvl);else showTip({getBoundingClientRect:()=>({left:e.clientX-80,bottom:e.clientY+10})},h.lvl);return;}
  if(h.kind==='node'||h.kind==='lamp')clickNode(h.id);});
 cv.addEventListener('pointerleave',()=>{if(S.hover){S.hover=null;say(null);redraw();}});}
/* a ring under the pointer, read in words: the sky, the roots, the domains, the address tiles, the nine bands */
function ringHtml(x,y){const O=GEO.obs,dx=x-O.cx,dy=y-O.cy,r=Math.hypot(dx,dy)/O.Rm;if(r>1.02||x>O.x+O.w)return null;
 const TOP=-PI/2,th=((Math.atan2(dy,dx)-TOP)%TAU+TAU)%TAU,p=S.P,C0=S.C,n=C0.cf.length,c=Math.floor(th/(TAU/19))%19;
 if(r>.955){const sunLon=p.sky?p.sky.sun:0,base=TOP-sunLon*D2R+(REDUCED?0:S.t*.9*D2R),k=Math.floor((((Math.atan2(dy,dx)-base)%TAU+TAU)%TAU)/(30*D2R))%12,z=MG.zsign[MG.zi[k]];
  return '<b>Sky, '+z.nm+'</b> ('+z.el+') reads '+MG.elem2root[z.el]+'. Twelve signs turn slowly; the four glyphs are the Sun, Moon, Rising and Design Sun.';}
 if(r>.895){const rn=DROOT[c],inUse=p.aff.indexOf(rn)>=0;return '<b>Root '+rn+'</b>: '+DOMAINS.filter(d=>d.r===rn).map(d=>d.nm).join(', ')+'. '+(inUse?'This person runs it.':'This person does not run it.');}
 if(r>.845)return '<b>Domain '+DOMAINS[c].nm+'</b> ('+DROOT[c]+'): the blueprint reaches it at '+Math.round(p.domain[c]*100)+' of 100.'+(p.doms.indexOf(c)>=0?' Chosen.':'');
 if(r>.755){const s=Math.floor(th/(TAU/n)),f=C0.cf[s];if(!f)return null;const q=SLOTQ[s];return '<b>Address '+esc(C0.addrName[s])+'</b> ('+C0.band[s]+' band): SQ '+q.toFixed(1)+', under '+f+'.'+(q>.02?' It beats every '+beatT(q).toFixed(1)+' s.':' It holds no charge, so it does not beat.');}
 if(r>.385){let best=0,bd=9;for(let i=0;i<9;i++){const d=Math.abs(r-GEO.R0[i]/O.Rm-.012);if(d<bd){bd=d;best=i;}}
  let k=0;for(let s=0;s<n;s++)if(C0.cf[s]===FNAME[best]&&Math.floor(s*19/n)===c&&SLOTQ[s]>.02)k++;
  return '<b>'+FNAME[best]+' band</b>, charge '+(S.C.steps[effStep()].ch[best]).toFixed(1)+'. At '+DOMAINS[c].nm+': '+(k?k+' address'+(k===1?'':'es')+' holding charge.':'nothing held here.');}
 return null;}
function say(h){const ro=document.getElementById('ro');if(!ro)return;if(h==null)h=hintHtml();ro.innerHTML=h;}
function hintHtml(){
 if(S.mode==='thread')return S.pin?'<b>'+esc(NODES.get(S.pin).lab)+'</b> is followed. Pressing it again, or an empty spot, lets it go.':'A node pressed in the chain or the core holds its thread lit. Everything not joined to it dims.';
 if(S.mode==='scrub')return 'The scrubber moves through twelve entries. Layers light and leave as they come in. This history is a mock.';
 return 'A level picked above re-reads the whole picture. A node under the pointer lights its thread. Each ring reads out as you pass over it.';}
function headHtml(l){return sees(l)?'<b>'+LVNAME[l]+'</b>: press to read the picture through this level.':'<b>'+LVNAME[l]+'</b> is locked on your plan. Press the control above to see why.';}
function hoverHtml(id){const n=NODES.get(id);if(!n)return null;const C0=S.C;
 if(n.lvl===0){const ss=n.slots.slice().sort((a,b)=>SLOTQ[b]-SLOTQ[a]);const nS=(UP[id]||[]).length;
  return '<b>'+esc(n.nm)+'</b>: charge '+n.w.toFixed(1)+'. '+n.slots.length+' addresses hold charge under it'+(ss.length?', heaviest '+esc(C0.addrName[ss[0]])+' at '+SLOTQ[ss[0]].toFixed(1):'')+'.'+(sees(1)?(nS?' '+nS+' saboteur'+(nS===1?'':'s')+' stand on it.':' No saboteur stands on it.'):'');}
 if(n.lvl===1){const nm=n.slots.slice(0,4).map(s=>C0.addrName[s]);return '<b>'+esc(n.lab)+'</b> ('+esc(n.fam)+'): weight '+n.w.toFixed(1)+'. Built from '+n.slots.length+' addresses: '+esc(nm.join(', '))+'.'+(n.over?' Overshot: the fix held past the point where it helps.':'');}
 if(n.lvl===2)return '<b>'+esc(n.lab)+'</b> ('+esc(n.fam)+'): weight '+n.w.toFixed(1)+'. Two saboteurs joined.';
 return '<b>'+esc(n.nm)+'</b>: weight '+n.w.toFixed(1)+', '+n.kids.length+' complexes. '+cap1(OB.families[n.nm]||'')+'.';}
const cap1=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;

/* ------------------------------------------------------------------ the summary: plain words, only facts in the data */
const j=(a)=>a.length<=1?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
const f1=v=>v.toFixed(1);
function summary(){
 const p=S.P,F=liveOf(0),Sx=liveOf(1).sort((a,b)=>b.w-a.w),Cx=liveOf(2).sort((a,b)=>b.w-a.w),Hx=liveOf(3).sort((a,b)=>b.w-a.w);
 const carrying=F.filter(n=>n.w>0).sort((a,b)=>b.w-a.w);
 const lv=[carrying,Sx,Cx,Hx];
 const top=(arr,k)=>arr.slice(0,k).map(n=>'<b>'+esc(n.lvl===3?n.nm:n.lab)+'</b> '+f1(n.w));
 const arr=lv[S.view],nm=LVLOW[S.view],cnt=arr.length;
 /* the one sentence */
 let h;
 if(!cnt)h=S.view===0?'Nothing carries charge yet.':'No '+nm+' are running'+(S.mode==='scrub'?' at this entry':'')+'.';
 else if(S.view===0)h=cnt+' of 9 fetters carry charge. '+esc(arr[0].lab)+' is the heaviest.';
 else if(S.view===3)h=cnt+' hyper complex'+(cnt===1?'':'es')+': '+j(arr.map(n=>esc(n.nm)))+'.';
 else h=cnt+' '+(cnt===1?LVSING[S.view]:nm)+' running. '+esc(arr[0].lab)+' is the heaviest.';
 let html='<div class="k">Reading '+esc(p.nm)+(S.mode==='scrub'?', entry '+(S.step+1)+' of 12':'')+'</div>';
 let top0='';
 /* four counts, which are also the lens */
 html+='<div class="tiles" role="group" aria-label="Counts by level">';
 for(let l=0;l<4;l++){const open=sees(l),n=lv[l].length,col=l===0?C.mid:famCol(['','Collapse','Dysregulation','Rigidity'][l]);
  html+='<button type="button" class="tile'+(l===S.view?' on':'')+(open?'':' lk')+'" data-l="'+l+'" aria-pressed="'+(open&&l===S.view)+'"'+(open?'':' aria-disabled="true"')+'><b>'+(open?n:LOCKMK)+'</b><span>'+LVLOW[l]+'</span></button>';}
 html+='</div><h2>'+h+'</h2>';top0=html;html='<ul class="b">';
 /* what is active, what is heaviest, what connects to what */
 const act=[];if(carrying.length)act.push(carrying.length+' fetter'+(carrying.length===1?'':'s')+' carry charge');
 if(sees(1)&&Sx.length)act.push(Sx.length+' saboteur'+(Sx.length===1?'':'s'));if(sees(2)&&Cx.length)act.push(Cx.length+' complex'+(Cx.length===1?'':'es'));if(sees(3)&&Hx.length)act.push(Hx.length+' hyper complex'+(Hx.length===1?'':'es'));
 html+='<li><i>Active</i>'+(act.length?j(act)+'.':'Nothing is running.')+(sees(3)?'':' Higher levels are locked on your plan.')+'</li>';
 if(cnt)html+='<li><i>Heaviest '+LVLOW[S.view]+'</i>'+j(top(arr,3))+'.</li>';
 const sab=[];F.forEach(n=>{sab.push([n,(UP[n.id]||[]).length]);});sab.sort((a,b)=>b[1]-a[1]);
 const con=[];
 if(sees(1)&&Sx.length){if(sab[0][1])con.push('<b>'+esc(sab[0][0].lab)+'</b> holds the most: '+sab[0][1]+' saboteur'+(sab[0][1]===1?'':'s')+' stand on it');
  if(sees(2)&&Cx.length)con.push(Sx.filter(s=>(UP[s.id]||[]).length).length+' of '+Sx.length+' saboteurs have joined a complex');
  if(sees(3)&&Hx.length)con.push('the complexes sit in '+j(Hx.map(n=>esc(n.nm))));}
 else if(!sees(1))con.push('the chain above the fetters is locked on your plan');
 else con.push('no saboteur stands on a fetter yet');
 html+='<li><i>What connects</i>'+con.join('; ')+'.'+(HIDDEN>0&&!S.showAll?' <span class="dm">'+HIDDEN+' weaker fetter links are hidden.</span>':'')+'</li></ul>';
 const ch=chains();
 html+='<div class="sec">Three strongest chains</div>';
 if(!ch.length)html+='<p class="dm">'+(sees(1)?'No chain to read yet.':'Chains start at saboteurs, which are above your plan.')+'</p>';
 else{ch.forEach((c,i)=>{const nd=id=>{const n=NODES.get(id);return '<span class="cn" title="'+esc(n.lvl===3?n.nm:n.lab)+'"><u style="--c:'+n.col+'"></u>'+esc(n.lvl===3?n.nm:n.lab)+'</span>';};
   html+='<button type="button" class="chain" data-id="'+esc(c.pick)+'" aria-pressed="'+(S.pin===c.pick)+'"><span class="st">'+f1(c.s)+'</span><span class="ln">'+(c.ids.length>1?nd(c.ids[0])+'<i>\u203A</i>'+nd(c.ids[1]):nd(c.ids[0]))+'</span>'+c.ids.slice(2).map(id=>'<span class="ln">'+nd(id)+'</span>').join('')+'</button>';});
  html+='<p class="dm" style="margin:2px 0 0">Strength is the mean weight along the chain, out of 10.</p>';}
 if(S.pin&&NODES.get(S.pin)&&NODES.get(S.pin).alive)top0=threadCard(S.pin)+top0;
 if(S.mode==='scrub')top0=scrubCard()+top0;
 return {top:top0,rest:html};}
function chains(){
 const out=[],sabs=liveOf(1);if(!sabs.length)return out;
 const used=new Set(),cand=[];
 sabs.forEach(s=>{
  const fs=(DOWN[s.id]||[]).map(id=>NODES.get(id)).filter(Boolean);
  const lk=id=>LINKS.get(id+'>'+s.id);fs.sort((a,b)=>(lk(b.id)?lk(b.id).w:0)-(lk(a.id)?lk(a.id).w:0));
  /* an overshot saboteur is built from the installed opposite, not from held charge, so it can stand on no fetter and its chain starts at itself */
  const base=fs.length?[fs[0]]:[],cxs=(UP[s.id]||[]).map(id=>NODES.get(id)).filter(Boolean);
  const mk=(rest,pick,key)=>{const all=base.concat([s],rest);cand.push({ids:all.map(n=>n.id),s:all.reduce((a,n)=>a+n.w,0)/all.length,pick:pick,key:key,sid:s.id});};
  if(!cxs.length)mk([],s.id,s.id);
  cxs.forEach(c=>{const hs=(UP[c.id]||[]).map(id=>NODES.get(id)).filter(Boolean);
   if(!hs.length)mk([c],c.id,c.id);
   hs.forEach(hy=>mk([c,hy],hy.id,c.id));});});
 cand.sort((a,b)=>b.s-a.s);
 cand.forEach(c=>{if(out.length<3&&!used.has(c.key)&&!used.has(c.sid)){used.add(c.key);used.add(c.sid);out.push(c);}});
 return out;}
function threadCard(id){const n=NODES.get(id),C0=S.C,f=lineage(id);
 const by=l=>[...f].map(i=>NODES.get(i)).filter(x=>x&&x.lvl===l&&x.alive).sort((a,b)=>b.w-a.w);
 const names=a=>j(a.slice(0,4).map(x=>esc(x.lab))+(a.length>4?'':'')?a.slice(0,4).map(x=>esc(x.lab)):[])+(a.length>4?' and '+(a.length-4)+' more':'');
 let t='';
 if(n.lvl===0)t=esc(n.nm)+' carries '+f1(n.w)+'. '+(by(1).length?by(1).length+' saboteur'+(by(1).length===1?'':'s')+' stand on it: '+names(by(1))+'.':(sees(1)?'No saboteur stands on it.':'The saboteurs above it are locked on your plan.'))
  +(by(2).length?' They sit in '+by(2).length+' complex'+(by(2).length===1?'':'es')+(by(3).length?', and those in the hyper complex'+(by(3).length===1?'':'es')+' '+names(by(3))+'.':'.'):'');
 else if(n.lvl===1)t=esc(n.lab)+', weight '+f1(n.w)+', family '+esc(n.fam)+'. It is built from '+n.slots.length+' addresses and stands on '+(by(0).length?names(by(0)):'no fetter')+'.'
  +(by(2).length?' It joins '+j(by(2).map(c=>esc(c.lab)))+(by(3).length?', which sits in the hyper complex '+names(by(3))+'.':', which has not compounded into a hyper complex.'):' It has not joined a complex: a complex needs two saboteurs of one family.')
  +(n.over?' It is overshot: the fix held past the point where it helps.':'');
 else if(n.lvl===2)t=esc(n.lab)+', weight '+f1(n.w)+'. It joins '+j(by(1).map(x=>esc(x.lab)))+', which stand on '+(by(0).length?names(by(0)):'no fetter')+'.'+(by(3).length?' It sits in the hyper complex '+names(by(3))+'.':' It has not compounded into a hyper complex.');
 else t=esc(n.nm)+', weight '+f1(n.w)+'. '+cap1(OB.families[n.nm]||'')+'. It holds '+by(2).length+' complexes, built from '+by(1).length+' saboteurs standing on '+by(0).length+' fetters.';
 return '<div class="k">Followed thread, '+LVSING[n.lvl]+'</div><h2>'+esc(n.lvl===3?n.nm:n.lab)+'</h2><p>'+t+'</p><hr class="sp">';}
function scrubCard(){const i=S.step,C0=S.C,cur=C0.steps[i],prev=i?C0.steps[i-1]:null;
 const ids=st=>{const o={};if(sees(1))st.sab.forEach(s=>o['s:'+s[0]]=s[0].replace(/ overshot$/,''));if(sees(2))st.cx.forEach(c=>o['c:'+c[0]]=c[0]);if(sees(3))st.hy.forEach(h=>o['h:'+h[0]]=h[0]);return o;};
 const a=ids(cur),b=prev?ids(prev):{};const nw=Object.keys(a).filter(k=>!(k in b)),gone=Object.keys(b).filter(k=>!(k in a));
 const ft=cur.ch.map((v,k)=>[FNAME[k],v,prev?prev.ch[k]:0]).filter(x=>x[1]>0&&x[2]<=0).map(x=>x[0]);
 let t='Entry '+(i+1)+' of 12. This history is a mock: the charge is scaled up on a fixed schedule and the engine runs on it, so the chain is real arithmetic over made-up input.';
 const bits=[];
 if(ft.length)bits.push('Newly carrying: '+j(ft)+'.');
 if(nw.length)bits.push('Lit this entry: '+j(nw.slice(0,5).map(k=>esc(a[k])))+(nw.length>5?' and '+(nw.length-5)+' more':'')+'.');
 if(gone.length)bits.push('Left this entry: '+j(gone.slice(0,4).map(k=>esc(b[k])))+(gone.length>4?' and '+(gone.length-4)+' more':'')+'.');
 if(!bits.length)bits.push(i?'Nothing joined or left this entry.':'Nothing is lit before the first entry.');
 return '<div class="k">Scrub</div><p>'+t+'</p><p>'+bits.join(' ')+'</p><hr class="sp">';}
function lockPanels(){let h='';
 for(let l=1;l<4;l++){if(sees(l))continue;
  h+='<div class="lk-panel" role="note"><span class="lk-pm">'+LOCKMK+'</span><div class="lk-pt"><p>'+esc(lockSay(l))+'</p></div><button type="button" class="lk-go">See tiers</button></div>';}
 return h;}
function legendHtml(){
 return '<details class="card"><summary>Legend: what each colour is</summary><ul class="legend">'
  +FNAME.map((n,i)=>'<li><i style="--c:'+FCOL[i]+'"></i>'+n+'</li>').join('')+'</ul>'
  +'<p style="margin:10px 0 6px;font-size:12px;color:var(--dim)">Saboteurs, complexes and hyper complexes take the colour of their family. A dashed ring is the overshot side of a family.</p>'
  +'<ul class="legend">'+['Collapse','Dysregulation','Rigidity','Predatory','Grandiosity','Dissociation'].map(f=>'<li><i style="--c:'+famCol(f)+'"></i>'+f+'</li>').join('')+'</ul>'
  +'<p style="margin:10px 0 0;font-size:12px;color:var(--dim)">Real: the charges, the address SQ, the domain reach, the sky, every saboteur, complex and hyper complex and its weight. Mock: the history behind Scrub, the plan switch and the tiers sheet.</p></details>';}
function syncUI(){
 document.querySelectorAll('.chip[data-n]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.n===S.who?'true':'false'));
 document.querySelectorAll('.chip[data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===S.mode?'true':'false'));
 document.querySelectorAll('.chip[data-v]').forEach(b=>{const l=+b.dataset.v,open=sees(l);
  b.setAttribute('aria-pressed',String(open&&l===S.view));
  const has=b.querySelector('.lk-mk');
  if(!open){b.classList.add('lk');b.setAttribute('aria-disabled','true');b.setAttribute('aria-label',LVNAME[l]+', locked');if(!has)b.insertAdjacentHTML('beforeend',LOCKMK);}
  else{b.classList.remove('lk');b.removeAttribute('aria-disabled');b.removeAttribute('aria-label');if(has)has.remove();}});
 const sc=document.getElementById('scrub');sc.classList.toggle('on',S.mode==='scrub');document.getElementById('stage').classList.toggle('sm',S.mode==='scrub');
 const rng=document.getElementById('rng');rng.value=S.step;
 document.getElementById('sclab').innerHTML='Entry <b>'+(S.step+1)+'</b> of 12';
 document.getElementById('play').setAttribute('aria-label',S.play?'Pause the history':'Play the history');
 document.getElementById('playsvg').innerHTML=S.play?'<path d="M8 5.5v13M16 5.5v13"/>':'<path d="M8 5.5v13l10-6.5z"/>';
 document.getElementById('play').style.display=REDUCED?'none':'';
 document.getElementById('alllinks').textContent=S.showAll?'Show fewer links':'Show all links';
 if(MODEL){const side=document.getElementById('side');
  const sm0=summary();side.innerHTML='<div class="card sumtop" id="sum">'+sm0.top+'</div><div class="card sumrest">'+sm0.rest+'</div>'+lockPanels()+legendHtml();
  side.querySelectorAll('.chain').forEach(bt=>{bt.onclick=()=>{const id=bt.dataset.id;S.pin=(S.pin===id)?null:id;if(S.mode==='lens')S.mode='thread';syncUI();redraw();};
   bt.onmouseenter=()=>{S.hover=bt.dataset.id;redraw();};bt.onmouseleave=()=>{S.hover=null;redraw();};});
  side.querySelectorAll('.lk-go').forEach(b=>b.onclick=openSheet);
  side.querySelectorAll('.tile').forEach(bt=>{const l=+bt.dataset.l;bt.onclick=()=>{if(sees(l)){hideTip();setView(l);}else showTip(bt,l);};});}
 say(null);drawSpark();}
function syncSummaryHover(){}
function drawSpark(){const cv=document.getElementById('spark');if(!cv||S.mode!=='scrub')return;
 const r=cv.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2),w=Math.round(r.width),h=Math.round(r.height);if(!w)return;
 cv.width=w*dpr;cv.height=h*dpr;const ctx=cv.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const C0=S.C,series=[[ 'fet',st=>st.ch.filter(v=>v>0).length,9,C.mid],['sab',st=>st.sab.length,Math.max(1,...C0.steps.map(s=>s.sab.length)),PAL['Solar']],['cx',st=>st.cx.length,Math.max(1,...C0.steps.map(s=>s.cx.length)),PAL['Sacral']],['hy',st=>st.hy.length,Math.max(1,...C0.steps.map(s=>s.hy.length)),PAL['Root']]];
 const lvOf={fet:0,sab:1,cx:2,hy:3};
 series.forEach(sr=>{if(!sees(lvOf[sr[0]]))return;ctx.strokeStyle=rgba(sr[3],.75);ctx.lineWidth=1.4;ctx.beginPath();
  C0.steps.forEach((st,i)=>{const x=6+i/11*(w-12),y=h-3-(sr[1](st)/sr[2])*(h-8);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();});
 const x=6+S.step/11*(w-12);ctx.strokeStyle=rgba(C.acc,.9);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}

/* ------------------------------------------------------------------ start */
window.OBSC={
 seek:seek,
 set:function(o){Object.assign(S,o);if(o.plan||o.view!=null){if(!sees(S.view))S.view=0;}rebuild();setDisp(true);syncUI();DIRTY=true;redraw();},
 person:function(n){setPerson(n,true,true);},mode:setMode,view:setView,plan:setPlan,step:function(i){setStep(i,true);},pin:function(id){S.pin=id;syncUI();redraw();},hover:function(id){S.hover=id;redraw();},
 nodes:function(){const o=[];NODES.forEach(n=>o.push({id:n.id,x:GEO?GEO.lad.colX[n.lvl]:0,y:n.y,a:n.a}));return o;},
 cost:function(){const a=cost.slice(),m=a.reduce((x,y)=>x+y,0)/Math.max(1,a.length),g=frameGap.slice(),so=a.slice().sort((x,y)=>x-y),md=so.length?so[so.length>>1]:0;return {scriptMs:+m.toFixed(2),medianMs:+md.toFixed(2),worstMs:+Math.max.apply(null,a.concat([0])).toFixed(2),frameGapMs:+(g.reduce((x,y)=>x+y,0)/Math.max(1,g.length)).toFixed(1),n:a.length};},
 resetCost:function(){cost=[];frameGap=[];},
 summary:function(){return document.getElementById('sum').innerText;},
 reduced:REDUCED,S:S};
build();document.getElementById('stage').classList.toggle('sm',S.mode==='scrub');
setPerson(S.who,true);
if(S.mode==='scrub'){document.getElementById('scrub').classList.add('on');}
if(Q.get('sel')){S.pin=Q.get('sel');}
syncUI();
if(Q.get('seek')!=null){seek(+Q.get('seek'));}
else if(REDUCED){seeking=false;stepDisp(1);drawAll(10);}
else raf=requestAnimationFrame(loop);
})();
