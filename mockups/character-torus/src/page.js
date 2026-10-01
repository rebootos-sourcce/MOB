/* ---------- icons, ring not fill ---------- */
function ico(d,c,w,vb){return '<svg viewBox="'+(vb||'0 0 24 24')+'" fill="none" stroke="'+c+'" stroke-width="'+(w||1.6)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+d+'"/></svg>';}
const TRACE_IC='M7 7.5m-2.4 0a2.4 2.4 0 104.8 0a2.4 2.4 0 10-4.8 0M17 16.5m-2.4 0a2.4 2.4 0 104.8 0a2.4 2.4 0 10-4.8 0M8.9 9l6.2 6M17 7h3M4 17h3';
const COH_IC='M12 12m-3 0a3 3 0 106 0a3 3 0 10-6 0M12 12m-7.5 0a7.5 7.5 0 1015 0a7.5 7.5 0 10-15 0';
const RING_IC='M12 12m-6 0a6 6 0 1012 0a6 6 0 10-12 0';
const LOADS={High:1,Mid:.55,Low:.06};
const COHS={'10%':.1,'55%':.55,'100%':1};
const S={sc:null,sys:null,prof:PROFILES[Q.get('profile')]||PROFILES.anger,mask:null,sel:-1,selAddr:-1,load:1,coh:1,flow:Q.get('flow')==='axis'?-1:1,stories:[],carry:Q.has('carry')};
const SEATPAT=[[0],[2,3],[1,8],[6,7],[4],[5],[]];             /* the patterns each seat holds, as AX indexes */
const PAT2CH={Fear:'Fear',Anger:'Anger',Shame:'Shame',Disgust:'Disgust',Shock:'Shock',Sad:'Sadness'};
const seatName=k=>k===5?'3rd eye':SEATN[k];
function parseNum(v,names,dflt){if(v===null||v===undefined||v==='')return dflt;if(names&&names[cap1(v)]!==undefined)return names[cap1(v)];const n=parseFloat(v);if(isNaN(n))return dflt;return n>1?n/100:n;}
/* The mask icons sit at the upper left of the page, full colour. Each is a button, because each becomes a protocol.
   The ring is one gradient from the mask's first seat to its last, the wash behind the sign is the same two colours,
   the arc is how loaded the mask is, and the sign inside is that mask's own symbol, drawn in this treatment's light.
   Nothing about a mask is tied to a row of the left menu. */
function maskBtn(m,sys){const c=maskCols(m),R=26,C=2*Math.PI*R,id=m.nm.replace(/\W/g,'');
 return '<button class="mb" data-m="'+m.nm+'" aria-pressed="false" aria-label="'+m.nm+' mask. '+m.v+'" style="--mc1:'+c[0]+';--mc2:'+c[1]+'">'
  +'<svg class="bt" viewBox="0 0 60 60" aria-hidden="true"><defs>'
  +'<linearGradient id="lg'+id+'" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient>'
  +'<radialGradient id="rg'+id+'" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="'+c[1]+'" stop-opacity=".34"/><stop offset=".6" stop-color="'+c[0]+'" stop-opacity=".16"/><stop offset="1" stop-color="'+c[0]+'" stop-opacity=".05"/></radialGradient></defs>'
  +'<circle class="wash" cx="30" cy="30" r="27" fill="url(#rg'+id+')"/>'
  +'<circle cx="30" cy="30" r="'+R+'" fill="none" stroke="url(#lg'+id+')" stroke-width="2" opacity=".4"/>'
  +'<circle class="ld" cx="30" cy="30" r="'+R+'" fill="none" stroke="url(#lg'+id+')" stroke-width="3" stroke-linecap="round" transform="rotate(-90 30 30)" stroke-dasharray="0 '+C.toFixed(1)+'"/>'
  +'<g transform="translate(14 14) scale(.875)" fill="none" stroke="url(#lg'+id+')" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+glyphFor(sys.ver,m.nm)+'</g></svg>'
  +'<span class="tip"><b>'+m.nm+'</b>'+m.b.join(' and ')+'. '+cap1(m.v)+'.</span></button>';}
const VARIANTS=[['torus-1','Flow'],['torus-2','Slices'],['torus-3','Shell']];
function build(sys){
 document.title='Character, '+sys.name;const rail=Q.get('rail')!=='0';
 $('app').classList.toggle('norail',!rail);
 $('app').innerHTML=
 '<header class="hd"><div><div class="ey">Character, round OV and OW mockup. Orbit with a torus field. Three versions.</div><h1>'+sys.name+'</h1><p>'+sys.blurb+'</p></div>'
 +'<nav class="nav" aria-label="Versions"><a href="index.html">Contact sheet</a>'
 +VARIANTS.map(v=>'<a class="opt" href="'+v[0]+'.html'+location.search+'"'+(v[0]===sys.id?' aria-current="page"':'')+'>'+v[1]+'</a>').join('')+'</nav></header>'
 +'<main class="stage" id="stage" aria-label="Character"><div class="stk" id="stk">'
 +'<div class="mrow" id="mrow" role="group" aria-label="Masks">'+MASKS.map(m=>maskBtn(m,sys)).join('')+'</div>'
 +'<button class="tbtn" id="tbtn" aria-pressed="false">'+ico(TRACE_IC,'currentColor',1.5)+'Trace</button>'
 +'<div class="badge" id="badge" aria-live="polite"></div>'
 +'<div class="cm" id="cm" aria-live="polite"></div>'
 +'<div class="cap" id="cap"></div><div class="hover" id="hover"></div></div>'
 +'<section class="trace" id="trace" aria-live="polite" aria-label="Trace"></section></main>'
 +(rail?'<aside class="lrail" id="lrail" aria-label="Left menu, a screenshot of the built app"><img src="shots/rail-tomas.png" alt="The left menu of the built app, Tomas example profile. Shown beside the page for scale and rhythm only. It is not part of this mockup and nothing joins it to the page."></aside>':'')
 +'<aside class="rail" id="rail"></aside>';
 buildRail();}
function buildRail(){const r=$('rail');
 r.innerHTML='<section class="read" aria-live="polite"><div class="lab">Leading</div><div class="lead"><span id="ldI"></span><b id="ldN"></b><span class="fig" id="ldW"></span></div><div class="where" id="ldL"></div>'
 +'<div class="blk"><div class="lab">Mask</div><div class="val" id="mkN"></div><div class="sub" id="mkV"></div></div></section>'
 +'<section class="sec"><div class="lab">Load on the person. Bends the shape and sets the shadow.</div><div class="chips" id="loads">'
 +Object.keys(LOADS).map(k=>'<button class="chip" data-l="'+k+'" aria-pressed="false">'+k+'</button>').join('')+'</div>'
 +'<div class="range"><input type="range" id="loadR" min="0" max="100" step="1" aria-label="Load on the person"><output id="loadO"></output></div>'
 +'<button class="chip" id="carry" aria-pressed="false" style="margin-top:12px">Show as if this mask carries the load</button></section>'
 +'<section class="sec"><div class="lab">Coherence, CQ. Lights the figure and shapes the torus.</div><div class="chips" id="cohs">'
 +Object.keys(COHS).map(k=>'<button class="chip" data-c="'+k+'" aria-pressed="false">'+k+'</button>').join('')+'</div>'
 +'<div class="range"><input type="range" id="cohR" min="0" max="100" step="1" aria-label="Coherence"><output id="cohO"></output></div>'
 +'<p class="note" id="cohN"></p></section>'
 +'<section class="sec"><div class="lab">Write a story. The sniffer reads the charge out of it and the cloud answers.</div><div class="chips" id="stories">'
 +STORIES.map(s=>'<button class="chip" data-s="'+s.id+'" aria-pressed="false" style="--c:'+PAL[SEATN[s.seat]]+'"><i></i>'+s.short+'</button>').join('')+'</div>'
 +'<p class="note" id="stN">Each story lands charge on the addresses of one seat. The cloud there thickens and brightens, the points round it grow, and the torus at that height pinches.</p></section>'
 +'<section class="sec"><div class="lab">The seven seats. Press one to trace it.</div><div class="leg" id="leg">'
 +SEATN.map((n,i)=>'<button class="lg" data-i="'+i+'"><svg viewBox="0 0 24 24" fill="none" stroke="'+PAL[n]+'" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="6.5"/></svg><span class="n">'+seatName(i)+'</span><span class="tr"><i style="background:'+PAL[n]+'"></i></span><span class="f"></span></button>').join('')
 +'</div><p class="note">The bar is the seat\'s shadow, the share of its addresses that is held. Past about a third the torus pinches there, runs slow and breaks up. An open seat swells.</p></section>'
 +'<section class="sec"><div class="lab">What the points round the body are</div>'
 +'<p class="para">Each outer point is one of the 112 addresses. A hundred and eight sit round the body at the height of their seat, going slowly round the spine. Four are field anchors, two above the head and two below the feet, drawn as rings. Size and brightness are the address\'s charge.</p>'
 +'<div class="keyrow" aria-label="Size and brightness by charge"><span><u class="kd" style="--s:3px;--o:.4"></u>Charge 1</span><span><u class="kd" style="--s:5px;--o:.7"></u>Charge 5</span><span><u class="kd" style="--s:8px;--o:1"></u>Charge 9</span></div>'
 +'<div class="counts" id="counts">'+SEATN.map((n,i)=>'<span><i style="border-color:'+PAL[n]+'"></i>'+seatName(i)+' <b>'+BYSEAT[i].length+'</b></span>').join('')+'<span><i class="ring2"></i>Anchors <b>4</b></span></div>'
 +'<p class="note">Hover a point to read which address it is. A ring round a point is a charge above seven tenths. Trace shows the address behind a leak.</p></section>'
 +'<section class="sec"><div class="lab">Which way the flow runs</div><div class="chips" id="flows"><button class="chip" data-f="1" aria-pressed="false">Climbs the outside</button><button class="chip" data-f="-1" aria-pressed="false">Rises through the axis</button></div>'
 +'<p class="note">Either way it enters under the feet. Climbing the outside is the default because the outside is what you see, so the motion you see goes up.</p></section>'
 +'<section class="sec"><div class="lab">Example profile</div><div class="chips">'
 +Object.values(PROFILES).map(p=>{const i=leadPat(p.w);return '<button class="chip" data-p="'+p.key+'" aria-pressed="false" style="--c:'+hex(PCOL[i])+'"><i></i>'+p.label+'</button>';}).join('')+'</div></section>';
 r.querySelectorAll('.chip[data-p]').forEach(b=>b.onclick=()=>setProfile(b.dataset.p));
 r.querySelectorAll('.chip[data-l]').forEach(b=>b.onclick=()=>setLoad(LOADS[b.dataset.l]));
 r.querySelectorAll('.chip[data-c]').forEach(b=>b.onclick=()=>setCoh(COHS[b.dataset.c]));
 r.querySelectorAll('.chip[data-s]').forEach(b=>b.onclick=()=>toggleStory(b.dataset.s));
 r.querySelectorAll('.chip[data-f]').forEach(b=>b.onclick=()=>setFlow(+b.dataset.f));
 $('loadR').oninput=e=>setLoad(+e.target.value/100);$('cohR').oninput=e=>setCoh(+e.target.value/100);
 $('carry').onclick=()=>{S.carry=!S.carry;S.sc.set({carry:S.carry});syncUI();renderTrace();};
 r.querySelectorAll('.lg').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;setTrace(S.sel===i?-1:i);});}
const dqNow=()=>{const a=S.sc.achT;let s=0;for(let i=0;i<112;i++)s+=a[i];return Math.round(s/112*100);};
function cmHtml(){const c=S.coh;
 return ico(COH_IC,'currentColor',1.5)+'<span class="ct"><b>Coherence '+Math.round(c*100)+'%</b><i>'+cohShort(c)+', shadow '+dqNow()+'%</i></span><span class="seats" aria-hidden="true">'
  +SEATN.map((n,k)=>'<u style="--sc:'+PAL[n]+'"></u>').join('')+'</span>';}
function seatShadowNow(k){const L=BYSEAT[k],a=S.sc.achT;let s=0;for(let i=0;i<L.length;i++)s+=a[L[i]];return sstep(SEATLO,SEATFULL,s/L.length);}
function syncUI(){const p=S.prof,w=S.sc.weights(),li=leadPat(w),a=AX[li],col=hex(PCOL[li]),m=MASKS.find(x=>x.nm===S.mask);
 document.documentElement.style.setProperty('--lead',col);
 $('ldI').innerHTML=ico(a.ic,col,1.4);$('ldN').textContent=a.nm;$('ldW').textContent=w[a.nm].toFixed(1);
 $('ldL').textContent=cap1(a.loc);
 $('mkN').textContent=m.nm+' mask';$('mkV').textContent=cap1(m.v)+'.';
 document.querySelectorAll('.chip[data-p]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.p===p.key?'true':'false'));
 document.querySelectorAll('.chip[data-l]').forEach(b=>b.setAttribute('aria-pressed',Math.abs(LOADS[b.dataset.l]-S.load)<.02?'true':'false'));
 document.querySelectorAll('.chip[data-c]').forEach(b=>b.setAttribute('aria-pressed',Math.abs(COHS[b.dataset.c]-S.coh)<.02?'true':'false'));
 document.querySelectorAll('.chip[data-s]').forEach(b=>b.setAttribute('aria-pressed',S.stories.some(s=>s.id===b.dataset.s)?'true':'false'));
 document.querySelectorAll('.chip[data-f]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.f===S.flow?'true':'false'));
 $('carry').setAttribute('aria-pressed',S.carry?'true':'false');$('loadR').value=Math.round(S.load*100);$('loadO').textContent=Math.round(S.load*100)+'%';
 $('cohR').value=Math.round(S.coh*100);$('cohO').textContent=Math.round(S.coh*100)+'%';
 $('cohN').textContent=cohWord(S.coh)+' CQ sets the torus: how wide, how fast, how bright and how in step. The shadow, from the load, opens the gaps.';
 $('cm').innerHTML=cmHtml();
 document.querySelectorAll('.lg').forEach((b,i)=>{const sh=seatShadowNow(i);
  b.querySelector('.tr i').style.width=(sh*100)+'%';b.querySelector('.f').textContent=Math.round(sh*100);
  b.title=sh<.25?'Open':sh<.6?'Loaded':'Closed';b.classList.toggle('on',S.sel===i);b.setAttribute('aria-pressed',S.sel===i?'true':'false');});
 document.querySelectorAll('.mb').forEach(b=>{const on=b.dataset.m===S.mask;b.setAttribute('aria-pressed',on?'true':'false');
  const mm=MASKS.find(x=>x.nm===b.dataset.m),ld=Math.min(1,maskLoad(mm,w)/9),R=26,C=2*Math.PI*R;b.querySelector('.ld').setAttribute('stroke-dasharray',(C*ld).toFixed(1)+' '+C.toFixed(1));});
 $('stage').style.setProperty('--mc1',maskCols(m)[0]);
 const ticks=Array.from({length:9},(_,i)=>'<u'+(i<Math.round(w[a.nm])?' class="on"':'')+'></u>').join('');
 $('badge').innerHTML=ico(a.ic,col,1.5)+'<span class="bt"><b>'+a.nm+'</b><i>'+VERB[li]+'</i></span><span class="ticks" style="--tc:'+col+'" aria-label="Weight '+w[a.nm].toFixed(1)+' of 10">'+ticks+'</span>';
 $('cap').innerHTML='<b>'+m.nm+'</b> mask. '+m.b.join(' and ')+'. '+cap1(m.v)+'.';}
function updSeats(){const c=S.sc.c;document.querySelectorAll('#cm .seats u').forEach((u,k)=>{u.style.opacity=(.22+.78*litAt(k,c)).toFixed(2);});}
function retarget(){S.sc.stories=S.stories;S.sc.set({});}
function setMask(nm){S.mask=nm;S.sc.set({mask:nm});S.sc.mem={};S.sys.init(S.sc);syncUI();renderTrace();setTimeout(placeAnchor,0);}
function setProfile(key){S.prof=PROFILES[key];S.mask=leadMask(S.prof.w).nm;S.sc.set({prof:key,mask:S.mask});S.sc.mem={};S.sys.init(S.sc);syncUI();renderTrace();}
function setLoad(k){S.load=clamp(k,0,1);S.sc.set({load:S.load});syncUI();renderTrace();}
function setCoh(c){S.coh=clamp(c,0,1);S.sc.set({coh:S.coh});syncUI();renderTrace();}
function setFlow(f){S.flow=f;S.sc.flow=f;syncUI();}
function toggleStory(id){const i=S.stories.findIndex(s=>s.id===id);if(i>=0)S.stories.splice(i,1);else S.stories.push(STORIES.find(s=>s.id===id));retarget();syncUI();renderTrace();}
function setTrace(k,addr){S.sel=k;S.selAddr=k>=0&&addr!==undefined?addr:-1;S.sc.sel=k;S.sc.selAddr=S.selAddr;S.sc.tsT=k>=0?1:0;if(k<0)S.sc.threadFrom=null;$('app').classList.toggle('tracing',k>=0);
 $('tbtn').setAttribute('aria-pressed',k>=0?'true':'false');renderTrace();syncUI();setTimeout(placeAnchor,0);}
/* what stands behind a leak: the story, the address, the mask. a story the person wrote on the page wins over the example record. */
function leakChain(k){const sc=S.sc,own=S.stories.filter(s=>s.seat===k).pop();let T=null,chan=null,patName=null;
 if(own){T={date:own.date,q:own.text,prov:'inferred',rel:0,last:''};chan=Object.keys(own.add).sort((a,b)=>own.add[b]-own.add[a])[0];}
 else{const w=sc.weights();const pats=SEATPAT[k].slice().sort((a,b)=>w[AX[b].nm]-w[AX[a].nm]);for(const pi of pats){const t=(TRACES[S.prof.key]||{})[AX[pi].nm];if(t){T=t;patName=AX[pi].nm;chan=PAT2CH[patName];break;}}}
 let j=S.selAddr>=0&&ADDR[S.selAddr].seat===k?S.selAddr:topAddr(sc,k,chan);return{T,j,chan,patName};}
function renderTrace(){const el=$('trace');if(S.sel<0){el.innerHTML='';return;}
 const sc=S.sc,k=S.sel,ss=seatState(sc,true),col=PAL[SEATN[k]],ch=leakChain(k),T=ch.T,A=ch.j>=0?ADDR[ch.j]:null,m=MASKS.find(x=>x.nm===S.mask);
 const under=MASKS.filter(mm=>mm.b.indexOf(SEATN[k])>=0).map(mm=>mm.nm);
 const tabs=ss.leaks.slice();if(tabs.indexOf(k)<0)tabs.push(k);
 const lk=ss.lk[k];el.style.setProperty('--tc',col);
 let h='<h2>'+ico(TRACE_IC,'currentColor',1.6)+'Trace. Where the energy leaks.</h2>'
  +'<div class="ltabs" role="tablist">'+tabs.map(t=>'<button class="lt" role="tab" data-k="'+t+'" aria-pressed="'+(t===k?'true':'false')+'" style="--lc:'+PAL[SEATN[t]]+'"><i></i>'+seatName(t)+'</button>').join('')+'</div>'
  +'<div class="ttl">'+ico(RING_IC,col,1.6)+'<b>'+cap1(seatName(k))+' seat</b><span>'+(lk>.12?'Leaking, '+Math.round(lk*100)+' percent':'Holding. No leak')+'</span></div>';
 if(T){h+='<div class="step"><div class="k">Story, '+T.date+'<i>'+T.prov+'</i></div><p class="q">“'+T.q+'”</p></div>'
  +'<div class="edge">supports</div>';}
 else h+='<div class="step"><div class="k">Story<i>none</i></div><p class="m">No story has landed here. The charge is from the seed.</p></div><div class="edge">supports</div>';
 if(A){h+='<div class="step"><div class="k">Address '+A.i+'<i>known</i></div><p class="m"><span style="color:var(--ink)">'+A.k+'</span>'+(A.plex?', '+A.plex.toLowerCase():'')+'. '+A.b+' seat'+(A.c?', '+A.c.toLowerCase()+' channel':'')+'. Charge '+(sc.achT[ch.j]*10).toFixed(1)+' of 10.</p></div>';}
 h+='<div class="edge">worn under</div><div class="step"><div class="k">Mask<i>known</i></div><p class="m"><span style="color:var(--ink)">'+(under.join(', ')||'No mask')+'</span>, by the '+seatName(k)+' seat.'+(T&&T.rel?' Released '+T.rel+(T.rel>1?' times':' time')+', last '+T.last+'.':' Not released yet.')+'</p></div>'
  +'<p class="why">Supports, not causes. The ring on the torus marks where the flow leaves at this seat. The story put charge on the address; nothing on the record says it is the only cause.</p>'
  +'<div class="acts"><button id="tOpen">Open the story</button><button id="tClose">Close trace</button></div>';
 el.innerHTML=h;$('tClose').onclick=()=>setTrace(-1);el.querySelectorAll('.lt').forEach(b=>b.onclick=()=>setTrace(+b.dataset.k));}
function placeAnchor(){const s=S.sc;if(!s)return;const st=$('stk').getBoundingClientRect();const c=$('trace').getBoundingClientRect();
 if(S.sel<0){s.anchor=null;return;}
 if(innerWidth<=860)s.anchor=[34,st.height];
 else s.anchor=[c.left-st.left-4,c.top-st.top+54];}
function addrTip(j){const a=ADDR[j],ch=S.sc.ach[j]*10;return '<b>'+a.k+'</b>, '+(a.fld?a.b:a.b+' seat')+(a.plex?', '+a.plex.toLowerCase():'')+'. Charge '+ch.toFixed(1)+' of 10.';}
function boot(sys){
 S.sys=sys;
 const lm=Q.get('load');S.load=parseNum(lm,LOADS,1);S.coh=parseNum(Q.get('coh'),{Low:.1,Mid:.55,High:1,Compressed:.1,Partial:.55,Full:1},1);
 const sq=Q.get('stories');if(sq)sq.split(',').forEach(id=>{const s=STORIES.find(x=>x.id===id);if(s)S.stories.push(s);});
 build(sys);
 const stk=$('stk');
 const mq=Q.get('mask');S.mask=mq?(MASKS.find(m=>m.nm.toLowerCase()===mq.toLowerCase())||{}).nm:null;
 if(!S.mask)S.mask=leadMask(S.prof.w).nm;
 S.sc=new Scene(stk,sys,{mask:S.mask,prof:S.prof.key,load:S.load,coh:S.coh,snap:Q.has('snap'),nogrow:Q.has('nogrow'),carry:S.carry,stories:S.stories,flow:S.flow});
 document.querySelectorAll('.mb').forEach(b=>{b.onclick=()=>setMask(b.dataset.m);});
 $('tbtn').onclick=()=>{if(S.sel>=0)setTrace(-1);else{const ss=seatState(S.sc,true);setTrace(ss.leaks.length?ss.leaks[0]:SEATI[MASKS.find(x=>x.nm===S.mask).b[0]]);}};
 const cv=S.sc.cv,sc=S.sc,hv=$('hover');
 const showHov=(html,x,y)=>{hv.style.left=x+'px';hv.style.top=y+'px';hv.innerHTML=html;hv.style.opacity=1;};
 cv.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
  const a=sc.nearAddr(px,py,sc.mobile?22:15);sc.hovAddr=a;
  const seat=a<0?sc.near(px,py,sc.mobile?46:38):-1;sc.hov=seat;cv.classList.toggle('hit',a>=0||seat>=0);
  if(e.pointerType==='touch'){hv.style.opacity=0;return;}
  const sr=$('stk').getBoundingClientRect();
  if(a>=0)showHov(addrTip(a),e.clientX-sr.left+16,e.clientY-sr.top+14);
  else if(seat>=0)showHov('<b>'+cap1(seatName(seat))+' seat</b>, shadow '+Math.round(seatShadowNow(seat)*100)+' percent. Press to trace.',e.clientX-sr.left+16,e.clientY-sr.top+14);else hv.style.opacity=0;});
 cv.addEventListener('pointerleave',()=>{sc.hov=-1;sc.hovAddr=-1;hv.style.opacity=0;});
 cv.addEventListener('click',e=>{const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;const a=sc.nearAddr(px,py,sc.mobile?22:15);
  if(a>=0){setTrace(ADDR[a].seat,a);return;}const seat=sc.near(px,py,sc.mobile?46:38);if(seat>=0){setTrace(S.sel===seat?-1:seat);return;}if(S.sel>=0)setTrace(-1);});
 addEventListener('resize',()=>{sc.resize();placeAnchor();});
 syncUI();
 const tq=Q.get('trace');if(tq){const k=tq==='1'?-2:SEATN.findIndex(n=>n.toLowerCase()===tq.toLowerCase());
  if(k===-2){const ss=seatState(sc,true);setTrace(ss.leaks.length?ss.leaks[0]:2);}else if(k>=0)setTrace(k);}
 const ft=Q.get('tip');if(ft){const b=document.querySelector('.mb[data-m="'+ft+'"]');if(b)b.classList.add('showtip');}
 sc.resize();placeAnchor();
 window.__perf={n:0,ms:0,max:0};
 const pulse=()=>{const b=document.querySelector('.mb[aria-pressed="true"]');if(b)b.style.setProperty('--pu',(.5+.5*Math.sin(Math.PI*2*sc.t/sc.per)).toFixed(3));updSeats();};
 /* ?addr=Fear pins the hover on the first address of that name, for a still picture */
 const pin=()=>{const an=Q.get('addr');if(!an)return;const j=ADDR.findIndex(a=>a.k.toLowerCase()===an.toLowerCase());if(j<0)return;sc.hovAddr=j;
  for(const q of sc.AP)if(q[2]===j){const sr=$('stk').getBoundingClientRect();showHov(addrTip(j),q[0]+16,q[1]+14);}};
 window.__step=sec=>{const n=Math.round(sec*60);for(let i=0;i<n;i++)sc.update(1/60);sc.resize();if(S.sel>=0)placeAnchor();const a=performance.now();sc.render();window.__lastMs=performance.now()-a;pin();pulse();};
 window.__S=S;window.__setTrace=setTrace;window.__setMask=setMask;window.__setProfile=setProfile;window.__setLoad=setLoad;window.__setCoh=setCoh;window.__toggleStory=toggleStory;window.__setFlow=setFlow;
 if(MANUAL){sc.render();pulse();return;}
 let last=performance.now();
 function frame(now){const dt=clamp((now-last)/1000,0,.05);last=now;sc.resize();if(S.sel>=0&&!sc.anchor)placeAnchor();
  sc.update(dt);const a=performance.now();sc.render();const b=performance.now()-a;window.__perf.n++;window.__perf.ms+=b;window.__perf.max=Math.max(window.__perf.max,b);
  pulse();requestAnimationFrame(frame);}
 requestAnimationFrame(frame);}
