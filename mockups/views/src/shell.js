/* The playable: the real shell, the five views, shipped or new. Nothing is saved. */
(function(){
 const SURF=[['reading','The reading'],['drives','What it drives'],['summary','Whole summary'],['analytics','Analytics'],['practitioner','Practitioner']];
 const WHO=[['Derek','Derek, mid coherence'],['Wren','Wren, quiet'],['You','Stranger']];
 const Q=new URLSearchParams(location.search);
 let surf=Q.get('tab')||'reading', who=Q.get('who')||'Derek', mode=Q.get('mode')||'new', view=Q.get('v')||'list';
 const family=s=>s==='analytics'?'analytics':s==='practitioner'?'practitioner':'summary';
 const bar=document.getElementById('mockbar'), root=document.getElementById('root');
 function paintBar(){
  bar.innerHTML=`<div class="mb-line"><b>Mockup: five screens.</b> Tabs below switch between them. Nothing here is saved. The shell is the real app; only the centre changes.</div>
  <div class="mb-row"><div class="mb-grp"><span>Screen</span>${SURF.map(s=>`<button type="button" data-s="${s[0]}" aria-pressed="${s[0]===surf}">${s[1]}</button>`).join('')}</div>
  <div class="mb-grp"><span>Example</span>${WHO.map(w=>`<button type="button" data-w="${w[0]}" aria-pressed="${w[0]===who}">${w[1]}</button>`).join('')}</div>
  <div class="mb-grp"><span>Show</span><button type="button" data-m="before" aria-pressed="${mode==='before'}">Shipped</button><button type="button" data-m="new" aria-pressed="${mode==='new'}">New</button></div></div>`;
  document.documentElement.style.setProperty('--mbh',bar.offsetHeight+'px');
  bar.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{surf=b.dataset.s;draw();});
  bar.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{who=b.dataset.w;draw();});
  bar.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m;draw();});
 }
 function draw(){
  const fam=family(surf), S=SNAP.tabs[fam];
  document.body.className=S.cls;
  root.innerHTML=S.app;
  const rail=root.querySelector('#rcol');
  if(rail&&fam!=='practitioner'&&SNAP.rail[who]){rail.outerHTML=SNAP.rail[who];}
  const sel=root.querySelector('#psel'); if(sel){const v=fam==='practitioner'?SNAP.psel.Sofia:SNAP.psel[who]; if(v!=null)sel.value=v;}
  paintBar();
  const host=document.getElementById(fam==='summary'?'sumbody':fam==='analytics'?'ana':'prac');
  if(!host)return;
  if(mode==='before'){host.innerHTML=fam==='practitioner'?SNAP.before.practitioner:SNAP.before[fam][who];return;}
  VW.mount(surf,who,{view,vwid:'i'});
 }
 /* the real top bar: Summary, Analytics and the Practitioner door move between the three screens */
 root.addEventListener('click',e=>{
  const t=e.target.closest('[data-tabk],.secb');if(!t)return;
  const k=t.getAttribute('data-tabk'), sec=t.getAttribute('data-sec');
  if(k==='1'){surf=(family(surf)==='summary')?surf:'summary';draw();}
  else if(k==='4'){surf='analytics';draw();}
  else if(k==='12'||sec==='practitioner'){surf='practitioner';draw();}
  else if(sec==='discover'){surf=(family(surf)==='summary')?surf:'summary';draw();}
 });
 root.addEventListener('click',e=>{const r=e.target.closest('.pcr');if(r&&surf==='practitioner'&&!r.classList.contains('rev')){who=r.dataset.k;view='person';draw();}});
 let rz;window.addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(draw,200);});
 (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>{draw();document.documentElement.setAttribute('data-ready','1');});
})();
