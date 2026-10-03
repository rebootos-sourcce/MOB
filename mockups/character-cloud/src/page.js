/* ---------- icons, ring not fill ---------- */
function ico(d,c,w,vb){return '<svg viewBox="'+(vb||'0 0 24 24')+'" fill="none" stroke="'+c+'" stroke-width="'+(w||1.6)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+d+'"/></svg>';}
const TRACE_IC='M7 7.5m-2.4 0a2.4 2.4 0 104.8 0a2.4 2.4 0 10-4.8 0M17 16.5m-2.4 0a2.4 2.4 0 104.8 0a2.4 2.4 0 10-4.8 0M8.9 9l6.2 6M17 7h3M4 17h3';
const LOADS={High:1,Mid:.55,Low:.06};
const S={sc:null,sys:null,prof:PROFILES[Q.get('profile')]||PROFILES.anger,mask:null,sel:-1,load:1,carry:Q.has('carry')};
/* The mask icons sit at the upper left of the page, full colour. Each is a button, because each
   becomes a protocol. The ring is one gradient from the mask's first seat to its last, the wash
   behind the mark is the same two colours, the arc is how loaded the mask is, and the mark inside
   is a small drawing of that mask's own symbol in the system on show. */
function maskBtn(m,sys){const c=maskCols(m),R=26,C=2*Math.PI*R,id=m.nm.replace(/\W/g,'');
 return '<button class="mb" data-m="'+m.nm+'" aria-pressed="false" aria-label="'+m.nm+' mask. '+m.v+'" style="--mc1:'+c[0]+';--mc2:'+c[1]+'">'
  +'<svg class="bt" viewBox="0 0 60 60" aria-hidden="true"><defs>'
  +'<linearGradient id="lg'+id+'" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient>'
  +'<radialGradient id="rg'+id+'" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="'+c[1]+'" stop-opacity=".34"/><stop offset=".6" stop-color="'+c[0]+'" stop-opacity=".16"/><stop offset="1" stop-color="'+c[0]+'" stop-opacity=".05"/></radialGradient></defs>'
  +'<circle class="wash" cx="30" cy="30" r="27" fill="url(#rg'+id+')"/>'
  +'<circle cx="30" cy="30" r="'+R+'" fill="none" stroke="url(#lg'+id+')" stroke-width="2" opacity=".4"/>'
  +'<circle class="ld" cx="30" cy="30" r="'+R+'" fill="none" stroke="url(#lg'+id+')" stroke-width="3" stroke-linecap="round" transform="rotate(-90 30 30)" stroke-dasharray="0 '+C.toFixed(1)+'"/>'
  +'<g transform="translate(13 13) scale(1.0)" fill="none" stroke="url(#lg'+id+')" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+sys.glyph[m.nm]+'</g></svg>'
  +'<span class="tip"><b>'+m.nm+'</b>'+m.b.join(' and ')+'. '+cap1(m.v)+'.</span></button>';}
function build(sys){
 document.title='Character, '+sys.name;
 $('app').innerHTML=
 '<header class="hd"><div><div class="ey">Character, rounds ON to OQ mockup</div><h1>'+sys.name+'</h1><p>'+sys.blurb+'</p></div>'
 +'<nav class="nav" aria-label="Systems"><a href="index.html">Contact sheet</a>'
 +SYSTEMS.map(s=>'<a class="opt" href="'+s.id+'.html'+location.search+'"'+(s.id===sys.id?' aria-current="page"':'')+'>'+s.name+'</a>').join('')+'</nav></header>'
 +'<main class="stage'+(sys.bg?' opaque':'')+'" id="stage" aria-label="Character"><div class="stk" id="stk">'
 +'<div class="mrow" id="mrow" role="group" aria-label="Masks">'+MASKS.map(m=>maskBtn(m,sys)).join('')+'</div>'
 +'<button class="tbtn" id="tbtn" aria-pressed="false">'+ico(TRACE_IC,'currentColor',1.5)+'Trace</button>'
 +'<div class="badge" id="badge" aria-live="polite"></div>'
 +'<div class="cap" id="cap"></div><div class="hover" id="hover"></div></div>'
 +'<section class="trace" id="trace" aria-live="polite" aria-label="Trace"></section></main>'
 +'<aside class="lrail" id="lrail" aria-label="Left menu, drawn for the shared rhythm only"></aside>'
 +'<aside class="rail" id="rail"></aside>';
 buildRail();buildLeft();}
function buildRail(){const r=$('rail');
 r.innerHTML='<section class="read" aria-live="polite"><div class="lab">Leading</div><div class="lead"><span id="ldI"></span><b id="ldN"></b><span class="fig" id="ldW"></span></div><div class="where" id="ldL"></div>'
 +'<div class="blk"><div class="lab">Mask</div><div class="val" id="mkN"></div><div class="sub" id="mkV"></div></div></section>'
 +'<section class="sec"><div class="lab">Load on the person</div><div class="chips" id="loads">'
 +Object.keys(LOADS).map(k=>'<button class="chip" data-l="'+k+'" aria-pressed="false">'+k+'</button>').join('')+'</div>'
 +'<div class="range"><input type="range" id="loadR" min="0" max="100" step="1" aria-label="Load on the person"><output id="loadO"></output></div>'
 +'<button class="chip" id="carry" aria-pressed="false" style="margin-top:12px">Show as if this mask carries the load</button>'
 +'<p class="note">Every weight is scaled by this. At zero the figure is a plain, calm person. The carry button lifts the chosen mask\u2019s own patterns near the leader, so a mask that is quiet in this profile can still be seen at full shape.</p></section>'
 +'<section class="sec"><div class="lab">Example profile</div><div class="chips">'
 +Object.values(PROFILES).map(p=>{const i=leadPat(p.w);return '<button class="chip" data-p="'+p.key+'" aria-pressed="false" style="--c:'+hex(PCOL[i])+'"><i></i>'+p.label+'</button>';}).join('')+'</div></section>'
 +'<section class="sec"><div class="lab">Patterns, by the colour of their points</div><div class="leg" id="leg">'
 +AX.map((a,i)=>'<button class="lg" data-i="'+i+'">'+ico(a.ic,hex(PCOL[i]),1.5)+'<span class="n">'+a.nm+'</span><span class="tr"><i style="background:'+hex(PCOL[i])+'"></i></span><span class="f"></span></button>').join('')
 +'</div><p class="note">Colour is the pattern that put the charge there. Brightness and density are how much. A pattern in a seat the mask does not wear is held back to a third.</p></section>';
 r.querySelectorAll('.chip[data-p]').forEach(b=>b.onclick=()=>setProfile(b.dataset.p));
 r.querySelectorAll('.chip[data-l]').forEach(b=>b.onclick=()=>setLoad(LOADS[b.dataset.l]));
 $('loadR').oninput=e=>setLoad(+e.target.value/100);
 $('carry').onclick=()=>{S.carry=!S.carry;S.sc.set({carry:S.carry});syncUI();renderTrace();};
 r.querySelectorAll('.lg').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;setTrace(S.sel===i?-1:i);});}
/* ---------- the left menu strip. Drawn to show shared colour and rhythm, and nothing else.
   No line runs from it to the page. The row a mask draws on takes that mask's two colours and its tempo. ---------- */
const ROWS=[{k:'Coherence',v:.62,c:[126,184,212],per:6.3,ph:.1},{k:'Decoherence',v:.11,c:[196,99,94],per:8.1,ph:.4},
 {k:'Vitality',v:.42,c:[190,120,112],per:5.3,ph:.7},{k:'Awareness',v:.77,c:[120,190,225],per:6.9,ph:.2},{k:'Will',v:.62,c:[140,152,198],per:5.9,ph:.55},{k:'Flow',v:1,c:[226,228,236],per:7.7,ph:.85}];
const KIND={Child:'swell',Preteen:'ripple',Teen:'chop',Ideological:'flat'};
function wave(kind,u,ph){ /* u 0..1 along the row, ph 0..1, result -1..1 */
 const TAU=Math.PI*2;
 if(kind==='swell')return Math.sin(TAU*(u*.9-ph))*.8+.2*Math.sin(TAU*(u*2.1-2*ph));
 if(kind==='ripple')return .5*Math.sin(TAU*(u*2-ph))+.35*Math.sin(TAU*(u*3-ph+.18))+.25*Math.sin(TAU*(u*4-ph+.36));
 if(kind==='chop'){const x=((u*2.6-ph)%1+1)%1,tri=x<.5?x*4-1:3-x*4;return clamp(tri*1.5,-1,1)*.9;}
 return .0;}
function buildLeft(){const el=$('lrail');
 el.innerHTML='<div class="lh">'+ico('M12 3a9 9 0 100 18 9 9 0 000-18zM12 8v4l3 2','currentColor',1.5)+'Root energetics</div>'
 +ROWS.map((r,i)=>'<div class="rw" data-r="'+r.k+'"><canvas></canvas><span class="rl">'+r.k+'</span><span class="rv"></span></div>').join('')
 +'<p class="ln">The row a mask draws on takes that mask’s colours and tempo. Nothing is drawn between this menu and the page.</p>';
 el.querySelectorAll('.rw').forEach(r=>{r._cv=r.querySelector('canvas');});}
function drawLeft(sc){const t=sc.t,M=MASKS.find(x=>x.nm===S.mask),d=sc.dpr;
 document.querySelectorAll('#lrail .rw').forEach((el,i)=>{const R=ROWS[i],cv=el._cv,r=el.getBoundingClientRect();
  const w=Math.round(r.width*d),h=Math.round(r.height*d);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}
  const g=cv.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,w,h);
  const linked=R.k===M.row,W=r.width,H=r.height;
  const c1=hx(maskCols(M)[0]),c2=hx(maskCols(M)[1]);const col=linked?c2:R.c;
  const amp=linked?.28+.72*sc.m:.22;const per=linked?M.per:R.per;const ph=linked?(t/per)%1:((t/per)+R.ph)%1;
  const kind=linked?KIND[M.nm]:'swell';
  /* the bar: its edge is a sine, so the bar flows */
  const v=linked?clamp(.25+.7*sc.m,0,1):R.v;
  g.save();g.scale(d,d);
  const gr=g.createLinearGradient(0,0,W*v,0);gr.addColorStop(0,css(linked?c1:R.c,linked?.62:.36));gr.addColorStop(1,css(col,linked?.34:.14));
  g.fillStyle=gr;g.beginPath();g.moveTo(0,0);for(let y=0;y<=H;y+=2){const e=W*v+Math.sin(Math.PI*2*(y/H*1.1-ph))*4*amp*(linked?1.6:1);g.lineTo(e,y);}g.lineTo(0,H);g.closePath();g.fill();
  /* the wave through it, dotted, the same wave the page's symbol is keeping time with */
  const n=Math.floor(W/4.2);
  for(let j=0;j<n;j++){const u=j/n;const y=H/2+wave(kind,u,ph)*H*.3*amp*(linked?1.35:1);
   const cc=linked?mixc(c1,c2,u):R.c;g.globalAlpha=linked?.9:.34;g.fillStyle=css(cc);g.fillRect(u*W-.7,y-.7,1.7,1.7);}
  if(linked){const u=(ph*1.0)%1,y=H/2+wave(kind,u,ph)*H*.3*amp*1.35;g.globalAlpha=1;g.fillStyle=css(mixc(c2,INK,.6));g.fillRect(u*W-2.5,y-2.5,5,5);
   if(kind==='flat'){const x=((t/M.per)%1)*W;const gg=g.createLinearGradient(x-26,0,x+26,0);gg.addColorStop(0,css(c2,0));gg.addColorStop(.5,css(c2,.5));gg.addColorStop(1,css(c2,0));g.globalAlpha=1;g.fillStyle=gg;g.fillRect(x-26,0,52,H);}}
  g.restore();
  el.classList.toggle('linked',linked);el.style.setProperty('--mc1',maskCols(M)[0]);
  const lab=el.querySelector('.rl');if(linked&&!el._lk){el._lk=1;}
  if(linked){const gl='<svg viewBox="0 0 32 32" fill="none" stroke="'+maskCols(M)[1]+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+sc.sys.glyph[M.nm]+'</svg>';
   if(el._g!==M.nm){lab.innerHTML=gl+R.k;el._g=M.nm;}}else if(el._g){lab.textContent=R.k;el._g=null;}
  el.querySelector('.rv').textContent=linked?(v).toFixed(2):R.v.toFixed(2);});}

function syncUI(){const p=S.prof,w=S.sc.weights(),li=leadPat(w),a=AX[li],col=hex(PCOL[li]),m=MASKS.find(x=>x.nm===S.mask);
 document.documentElement.style.setProperty('--lead',col);
 $('ldI').innerHTML=ico(a.ic,col,1.4);$('ldN').textContent=a.nm;$('ldW').textContent=w[a.nm].toFixed(1);
 $('ldL').textContent=cap1(a.loc);
 $('mkN').textContent=m.nm+' mask';$('mkV').textContent=cap1(m.v)+'.';
 document.querySelectorAll('.chip[data-p]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.p===p.key?'true':'false'));
 document.querySelectorAll('.chip[data-l]').forEach(b=>b.setAttribute('aria-pressed',Math.abs(LOADS[b.dataset.l]-S.load)<.02?'true':'false'));
 $('carry').setAttribute('aria-pressed',S.carry?'true':'false');$('loadR').value=Math.round(S.load*100);$('loadO').textContent=Math.round(S.load*100)+'%';
 document.querySelectorAll('.lg').forEach((b,i)=>{const v=w[AX[i].nm],on=m.b.indexOf(AX[i].seat)>=0;
  b.querySelector('.tr i').style.width=(v/10*100)+'%';b.querySelector('.tr i').style.opacity=on?1:.38;b.querySelector('.f').textContent=v.toFixed(1);
  b.classList.toggle('on',S.sel===i);b.setAttribute('aria-pressed',S.sel===i?'true':'false');});
 document.querySelectorAll('.mb').forEach(b=>{const on=b.dataset.m===S.mask;b.setAttribute('aria-pressed',on?'true':'false');
  const mm=MASKS.find(x=>x.nm===b.dataset.m),ld=Math.min(1,maskLoad(mm,w)/9),R=26,C=2*Math.PI*R;b.querySelector('.ld').setAttribute('stroke-dasharray',(C*ld).toFixed(1)+' '+C.toFixed(1));});
 $('stage').style.setProperty('--mc1',maskCols(m)[0]);
 const ticks=Array.from({length:9},(_,i)=>'<u'+(i<Math.round(w[a.nm])?' class="on"':'')+'></u>').join('');
 $('badge').innerHTML=ico(a.ic,col,1.5)+'<span class="bt"><b>'+a.nm+'</b><i>'+VERB[li]+'</i></span><span class="ticks" style="--tc:'+col+'" aria-label="Weight '+w[a.nm].toFixed(1)+' of 10">'+ticks+'</span>';
 $('cap').innerHTML='<b>'+m.nm+'</b> mask. '+m.b.join(' and ')+'. '+cap1(m.v)+'.<span class="cap2">Press a region of the figure to trace what put the charge there.</span>';}
function setMask(nm){S.mask=nm;S.sc.set({mask:nm});S.sc.mem={};if(S.sys.init)S.sys.init(S.sc);syncUI();renderTrace();setTimeout(placeAnchor,0);}
function setProfile(key){S.prof=PROFILES[key];S.mask=leadMask(S.prof.w).nm;S.sc.set({prof:key,mask:S.mask});syncUI();renderTrace();}
function setLoad(k){S.load=clamp(k,0,1);S.sc.set({load:S.load});syncUI();renderTrace();}
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
 S.sys=sys;build(sys);
 const stk=$('stk');
 const lm=Q.get('load');const ld=lm?(LOADS[cap1(lm)]!==undefined?LOADS[cap1(lm)]:+lm):1;S.load=ld;
 const mq=Q.get('mask');S.mask=mq?(MASKS.find(m=>m.nm.toLowerCase()===mq.toLowerCase())||{}).nm:null;
 if(!S.mask)S.mask=leadMask(S.prof.w).nm;
 S.sc=new Scene(stk,sys,{mask:S.mask,prof:S.prof.key,load:ld,snap:Q.has('snap'),carry:S.carry});
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
 const pulse=()=>{const b=document.querySelector('.mb[aria-pressed="true"]');if(b)b.style.setProperty('--pu',(.5+.5*Math.sin(Math.PI*2*sc.t/sc.per)).toFixed(3));};
 window.__step=sec=>{const n=Math.round(sec*60);for(let i=0;i<n;i++)sc.update(1/60);sc.resize();if(S.sel>=0)placeAnchor();sc.render();drawLeft(sc);pulse();};
 window.__S=S;window.__setTrace=setTrace;window.__setMask=setMask;window.__setProfile=setProfile;window.__setLoad=setLoad;
 if(MANUAL){sc.render();drawLeft(sc);return;}
 let last=performance.now();
 function frame(now){const dt=clamp((now-last)/1000,0,.05);last=now;sc.resize();if(S.sel>=0&&!sc.anchor)placeAnchor();
  sc.update(dt);const a=performance.now();sc.render();const b=performance.now()-a;window.__perf.n++;window.__perf.ms+=b;window.__perf.max=Math.max(window.__perf.max,b);
  drawLeft(sc);pulse();requestAnimationFrame(frame);}
 requestAnimationFrame(frame);}
