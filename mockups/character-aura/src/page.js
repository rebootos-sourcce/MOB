/* ---------- icons, ring not fill ---------- */
function ico(d,c,w,vb){return '<svg viewBox="'+(vb||'0 0 24 24')+'" fill="none" stroke="'+c+'" stroke-width="'+(w||1.6)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+d+'"/></svg>';}
const TRACE_IC='M7 7.5m-2.4 0a2.4 2.4 0 104.8 0a2.4 2.4 0 10-4.8 0M17 16.5m-2.4 0a2.4 2.4 0 104.8 0a2.4 2.4 0 10-4.8 0M8.9 9l6.2 6M17 7h3M4 17h3';
const COH_IC='M12 12m-3 0a3 3 0 106 0a3 3 0 10-6 0M12 12m-7.5 0a7.5 7.5 0 1015 0a7.5 7.5 0 10-15 0';
const LOADS={High:1,Mid:.55,Low:.06};
const COHS={'10%':.1,'55%':.55,'100%':1};
const S={sc:null,sys:null,prof:PROFILES[Q.get('profile')]||PROFILES.anger,mask:null,sel:-1,load:1,coh:1,carry:Q.has('carry')};
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
const VARIANTS=[['aura-1','Prism'],['aura-2','Corona'],['aura-3','Orbit']];
function build(sys){
 document.title='Character, '+sys.name;const rail=Q.get('rail')!=='0';
 $('app').classList.toggle('norail',!rail);
 $('app').innerHTML=
 '<header class="hd"><div><div class="ey">Character, round OR mockup. Three versions of Aura.</div><h1>'+sys.name+'</h1><p>'+sys.blurb+'</p></div>'
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
 +'<section class="sec"><div class="lab">Load on the person. Bends the shape.</div><div class="chips" id="loads">'
 +Object.keys(LOADS).map(k=>'<button class="chip" data-l="'+k+'" aria-pressed="false">'+k+'</button>').join('')+'</div>'
 +'<div class="range"><input type="range" id="loadR" min="0" max="100" step="1" aria-label="Load on the person"><output id="loadO"></output></div>'
 +'<button class="chip" id="carry" aria-pressed="false" style="margin-top:12px">Show as if this mask carries the load</button></section>'
 +'<section class="sec"><div class="lab">Coherence. Lights the figure.</div><div class="chips" id="cohs">'
 +Object.keys(COHS).map(k=>'<button class="chip" data-c="'+k+'" aria-pressed="false">'+k+'</button>').join('')+'</div>'
 +'<div class="range"><input type="range" id="cohR" min="0" max="100" step="1" aria-label="Coherence"><output id="cohO"></output></div>'
 +'<p class="note" id="cohN"></p></section>'
 +'<section class="sec"><div class="lab">Example profile</div><div class="chips">'
 +Object.values(PROFILES).map(p=>{const i=leadPat(p.w);return '<button class="chip" data-p="'+p.key+'" aria-pressed="false" style="--c:'+hex(PCOL[i])+'"><i></i>'+p.label+'</button>';}).join('')+'</div></section>'
 +'<section class="sec"><div class="lab">Patterns, by the colour of their seat</div><div class="leg" id="leg">'
 +AX.map((a,i)=>'<button class="lg" data-i="'+i+'">'+ico(a.ic,hex(PCOL[i]),1.5)+'<span class="n">'+a.nm+'</span><span class="tr"><i style="background:'+hex(PCOL[i])+'"></i></span><span class="f"></span></button>').join('')
 +'</div><p class="note">Load decides how far a pattern bends the body. Coherence decides how much light the body gives. A pattern in a seat the mask does not wear is held back to a third.</p></section>';
 r.querySelectorAll('.chip[data-p]').forEach(b=>b.onclick=()=>setProfile(b.dataset.p));
 r.querySelectorAll('.chip[data-l]').forEach(b=>b.onclick=()=>setLoad(LOADS[b.dataset.l]));
 r.querySelectorAll('.chip[data-c]').forEach(b=>b.onclick=()=>setCoh(COHS[b.dataset.c]));
 $('loadR').oninput=e=>setLoad(+e.target.value/100);$('cohR').oninput=e=>setCoh(+e.target.value/100);
 $('carry').onclick=()=>{S.carry=!S.carry;S.sc.set({carry:S.carry});syncUI();renderTrace();};
 r.querySelectorAll('.lg').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;setTrace(S.sel===i?-1:i);});}
function cmHtml(){const c=S.coh;
 return ico(COH_IC,'currentColor',1.5)+'<span class="ct"><b>Coherence '+Math.round(c*100)+'%</b><i>'+cohShort(c)+'</i></span><span class="seats" aria-hidden="true">'
  +SEATN.map((n,k)=>'<u style="--sc:'+PAL[n]+'"></u>').join('')+'</span>';}
function syncUI(){const p=S.prof,w=S.sc.weights(),li=leadPat(w),a=AX[li],col=hex(PCOL[li]),m=MASKS.find(x=>x.nm===S.mask);
 document.documentElement.style.setProperty('--lead',col);
 $('ldI').innerHTML=ico(a.ic,col,1.4);$('ldN').textContent=a.nm;$('ldW').textContent=w[a.nm].toFixed(1);
 $('ldL').textContent=cap1(a.loc);
 $('mkN').textContent=m.nm+' mask';$('mkV').textContent=cap1(m.v)+'.';
 document.querySelectorAll('.chip[data-p]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.p===p.key?'true':'false'));
 document.querySelectorAll('.chip[data-l]').forEach(b=>b.setAttribute('aria-pressed',Math.abs(LOADS[b.dataset.l]-S.load)<.02?'true':'false'));
 document.querySelectorAll('.chip[data-c]').forEach(b=>b.setAttribute('aria-pressed',Math.abs(COHS[b.dataset.c]-S.coh)<.02?'true':'false'));
 $('carry').setAttribute('aria-pressed',S.carry?'true':'false');$('loadR').value=Math.round(S.load*100);$('loadO').textContent=Math.round(S.load*100)+'%';
 $('cohR').value=Math.round(S.coh*100);$('cohO').textContent=Math.round(S.coh*100)+'%';$('cohN').textContent=cohWord(S.coh)+' The shape does not change with it.';
 $('cm').innerHTML=cmHtml();
 document.querySelectorAll('.lg').forEach((b,i)=>{const v=w[AX[i].nm],on=m.b.indexOf(AX[i].seat)>=0;
  b.querySelector('.tr i').style.width=(v/10*100)+'%';b.querySelector('.tr i').style.opacity=on?1:.38;b.querySelector('.f').textContent=v.toFixed(1);
  b.classList.toggle('on',S.sel===i);b.setAttribute('aria-pressed',S.sel===i?'true':'false');});
 document.querySelectorAll('.mb').forEach(b=>{const on=b.dataset.m===S.mask;b.setAttribute('aria-pressed',on?'true':'false');
  const mm=MASKS.find(x=>x.nm===b.dataset.m),ld=Math.min(1,maskLoad(mm,w)/9),R=26,C=2*Math.PI*R;b.querySelector('.ld').setAttribute('stroke-dasharray',(C*ld).toFixed(1)+' '+C.toFixed(1));});
 $('stage').style.setProperty('--mc1',maskCols(m)[0]);
 const ticks=Array.from({length:9},(_,i)=>'<u'+(i<Math.round(w[a.nm])?' class="on"':'')+'></u>').join('');
 $('badge').innerHTML=ico(a.ic,col,1.5)+'<span class="bt"><b>'+a.nm+'</b><i>'+VERB[li]+'</i></span><span class="ticks" style="--tc:'+col+'" aria-label="Weight '+w[a.nm].toFixed(1)+' of 10">'+ticks+'</span>';
 $('cap').innerHTML='<b>'+m.nm+'</b> mask. '+m.b.join(' and ')+'. '+cap1(m.v)+'.';}
function updSeats(){const c=S.sc.c;document.querySelectorAll('#cm .seats u').forEach((u,k)=>{u.style.opacity=(.22+.78*litAt(k,c)).toFixed(2);});}
function setMask(nm){S.mask=nm;S.sc.set({mask:nm});S.sc.mem={};if(S.sys.init)S.sys.init(S.sc);syncUI();renderTrace();setTimeout(placeAnchor,0);}
function setProfile(key){S.prof=PROFILES[key];S.mask=leadMask(S.prof.w).nm;S.sc.set({prof:key,mask:S.mask});S.sc.mem={};S.sys.init(S.sc);syncUI();renderTrace();}
function setLoad(k){S.load=clamp(k,0,1);S.sc.set({load:S.load});syncUI();renderTrace();}
function setCoh(c){S.coh=clamp(c,0,1);S.sc.set({coh:S.coh});syncUI();}
function setTrace(i){S.sel=i;S.sc.sel=i;S.sc.tsT=i>=0?1:0;$('app').classList.toggle('tracing',i>=0);
 $('tbtn').setAttribute('aria-pressed',i>=0?'true':'false');renderTrace();syncUI();setTimeout(placeAnchor,0);}
function renderTrace(){const el=$('trace');if(S.sel<0){el.innerHTML='';return;}
 const a=AX[S.sel],col=hex(PCOL[S.sel]),T=(TRACES[S.prof.key]||{})[a.nm],v=S.sc.weights()[a.nm];
 const under=MASKS.filter(m=>m.b.indexOf(a.seat)>=0).map(m=>m.nm);
 el.style.setProperty('--tc',col);
 let h='<h2>'+ico(TRACE_IC,'currentColor',1.6)+'Trace</h2><div class="ttl">'+ico(a.ic,col,1.5)+'<b>'+a.nm+'</b><span>'+v.toFixed(1)+' of 10, '+VERB[S.sel]+'</span></div>';
 if(T){h+='<div class="step"><div class="k">Story, '+T.date+'<i>'+T.prov+'</i></div><p class="q">“'+T.q+'”</p></div>'
  +'<div class="edge">supports</div>'
  +'<div class="step"><div class="k">Pattern<i>known</i></div><p class="m"><span style="color:var(--ink)">'+a.nm+'</span>, '+a.addr.toLowerCase()+'. '+cap1(a.loc)+'.</p></div>'
  +'<div class="edge">worn under</div>'
  +'<div class="step"><div class="k">Mask<i>known</i></div><p class="m"><span style="color:var(--ink)">'+(under.join(', ')||'No mask')+'</span>, by the '+a.seat+' seat.'+(T.rel?' Released '+T.rel+(T.rel>1?' times':' time')+', last '+T.last+'.':' Not released yet.')+'</p></div>'
  +'<p class="why">Supports, not causes. The story put charge here. Nothing on the record says it is the only cause.</p>';}
 else h+='<div class="step"><div class="k">Story<i>none</i></div><p class="m">No story has landed here. The charge is from the seed.</p></div><p class="why">A seed is the stated type before any story. It fades only when you move it.</p>';
 h+='<div class="acts"><button id="tOpen">Open the story</button><button id="tClose">Close trace</button></div>';
 el.innerHTML=h;$('tClose').onclick=()=>setTrace(-1);}
function placeAnchor(){const s=S.sc;if(!s)return;const st=$('stk').getBoundingClientRect();const c=$('trace').getBoundingClientRect();
 if(S.sel<0){s.anchor=null;return;}
 if(innerWidth<=860)s.anchor=[34,st.height];
 else s.anchor=[c.left-st.left-4,c.top-st.top+54];}

function boot(sys){
 S.sys=sys;
 const lm=Q.get('load');S.load=parseNum(lm,LOADS,1);S.coh=parseNum(Q.get('coh'),{Low:.1,Mid:.55,High:1,Compressed:.1,Partial:.55,Full:1},1);
 build(sys);
 const stk=$('stk');
 const mq=Q.get('mask');S.mask=mq?(MASKS.find(m=>m.nm.toLowerCase()===mq.toLowerCase())||{}).nm:null;
 if(!S.mask)S.mask=leadMask(S.prof.w).nm;
 S.sc=new Scene(stk,sys,{mask:S.mask,prof:S.prof.key,load:S.load,coh:S.coh,snap:Q.has('snap'),carry:S.carry});
 document.querySelectorAll('.mb').forEach(b=>{b.onclick=()=>setMask(b.dataset.m);});
 $('tbtn').onclick=()=>{if(S.sel>=0)setTrace(-1);else{const m=MASKS.find(x=>x.nm===S.mask);setTrace(maskTop(m,S.sc.weights()));}};
 const cv=S.sc.cv,sc=S.sc;
 const patFrom=e=>{const r=cv.getBoundingClientRect();return sc.near(e.clientX-r.left,e.clientY-r.top,sc.mobile?46:38);};
 cv.addEventListener('pointermove',e=>{const p=patFrom(e);sc.hov=p;cv.classList.toggle('hit',p>=0);const hv=$('hover');
  if(p>=0&&e.pointerType!=='touch'){const r=$('stk').getBoundingClientRect();hv.style.left=(e.clientX-r.left+16)+'px';hv.style.top=(e.clientY-r.top+14)+'px';
   hv.innerHTML='<b>'+AX[p].nm+'</b>, '+sc.weights()[AX[p].nm].toFixed(1)+'. Press to trace.';hv.style.opacity=1;}else hv.style.opacity=0;});
 cv.addEventListener('pointerleave',()=>{sc.hov=-1;$('hover').style.opacity=0;});
 cv.addEventListener('click',e=>{const p=patFrom(e);if(p<0){if(S.sel>=0)setTrace(-1);return;}setTrace(S.sel===p?-1:p);});
 addEventListener('resize',()=>{sc.resize();placeAnchor();});
 syncUI();
 const tq=Q.get('trace');if(tq){const i=tq==='1'?maskTop(MASKS.find(x=>x.nm===S.mask),sc.weights()):AX.findIndex(a=>a.nm.toLowerCase()===tq.toLowerCase());if(i>=0)setTrace(i);}
 const ft=Q.get('tip');if(ft){const b=document.querySelector('.mb[data-m="'+ft+'"]');if(b)b.classList.add('showtip');}
 sc.resize();placeAnchor();
 window.__perf={n:0,ms:0,max:0};
 const pulse=()=>{const b=document.querySelector('.mb[aria-pressed="true"]');if(b)b.style.setProperty('--pu',(.5+.5*Math.sin(Math.PI*2*sc.t/sc.per)).toFixed(3));updSeats();};
 window.__step=sec=>{const n=Math.round(sec*60);for(let i=0;i<n;i++)sc.update(1/60);sc.resize();if(S.sel>=0)placeAnchor();const a=performance.now();sc.render();window.__lastMs=performance.now()-a;pulse();};
 window.__S=S;window.__setTrace=setTrace;window.__setMask=setMask;window.__setProfile=setProfile;window.__setLoad=setLoad;window.__setCoh=setCoh;
 if(MANUAL){sc.render();pulse();return;}
 let last=performance.now();
 function frame(now){const dt=clamp((now-last)/1000,0,.05);last=now;sc.resize();if(S.sel>=0&&!sc.anchor)placeAnchor();
  sc.update(dt);const a=performance.now();sc.render();const b=performance.now()-a;window.__perf.n++;window.__perf.ms+=b;window.__perf.max=Math.max(window.__perf.max,b);
  pulse();requestAnimationFrame(frame);}
 requestAnimationFrame(frame);}
