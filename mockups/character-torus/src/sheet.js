/* The state sheet. Two axes, drawn apart so they can be judged apart: load bends the shape, coherence lights it.
   Every picture is the same scene the page draws, frozen at three seconds. The view parameter picks the block:
   view=ladder   one mask, load high and low down the side, coherence 10, 55 and 100 across the top
   view=masks    all five masks, coherence 10, 55, 100 at high load, then load high, mid, low at full coherence */
const COHROWS=[['10%',.1],['55%',.55],['100%',1]];
const LOADROWS=[['High',1],['Mid',.55],['Low',.06]];
function sheetCss(){return '.sheet{padding:20px 24px 40px;max-width:1500px;margin:0 auto}.sheet h2{font-size:17px;margin:28px 0 4px;font-weight:600}.sheet .sub2{color:var(--mid);font-size:13px;margin:0 0 14px;max-width:900px}'
 +'.grid{display:grid;gap:10px;align-items:stretch}.sheetpage .app{display:block;height:auto}.gh{display:flex;flex-direction:column;gap:6px;padding:4px 4px 8px}.gh .gt{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600}'
 +'.gh svg{width:30px;height:30px}.gh p{margin:0;color:var(--mid);font-size:12.5px;line-height:1.35}.rl2{display:flex;align-items:center;justify-content:flex-end;color:var(--mid);font-size:13px;padding-right:4px;text-align:right}'
 +'.cellw{position:relative;height:330px;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:radial-gradient(ellipse at 50% 44%,#13151C 0%,#0C0D12 70%)}.cellw.big{height:430px}'
 +'.cellw .cl{position:absolute;left:10px;bottom:8px;font-size:12px;color:var(--dim);z-index:2}.cellw .cm2{position:absolute;right:10px;bottom:8px;font-size:12px;color:var(--mid);z-index:2}'
 +'body.sheetpage{overflow:auto;height:auto}.hd.sh{position:sticky;top:0;background:var(--bg);z-index:5}'
 +'@media (max-width:860px){.cellw{height:250px}.sheet{padding:12px 12px 40px}.gh p{display:none}}';}
function bootSheet(sys){
 document.title=sys.name+', two axes';document.body.classList.add('sheetpage');
 const view=Q.get('view')||'all',lm=Q.get('mask')||'Preteen',pk=Q.get('profile')||'anger',P=PROFILES[pk],li=leadPat(P.w);
 const style=document.createElement('style');style.textContent=sheetCss();document.head.appendChild(style);
 const cells=[];
 const cell=(mask,load,coh,big,lab)=>{cells.push({mask,load,coh});return '<div class="cellw'+(big?' big':'')+'" data-i="'+(cells.length-1)+'"><span class="cl">'+lab+'</span><span class="cm2"></span></div>';};
 let h='<header class="hd sh"><div><div class="ey">Character, round OV and OW state sheet</div><h1>'+sys.name+', load and coherence</h1><p>Load bends the shape. Coherence lights it. The same scene as the page, frozen at three seconds. '+P.label+': '+AX[li].nm+' at '+P.w[AX[li].nm].toFixed(1)+', '+VERB[li]+'.</p></div>'
  +'<nav class="nav"><a href="index.html">Contact sheet</a>'+VARIANTS.map(v=>'<a class="opt" href="states-'+v[0]+'.html"'+(v[0]===sys.id?' aria-current="page"':'')+'>'+v[1]+'</a>').join('')+'</nav></header><div class="sheet">';
 if(view==='all'||view==='ladder'){
  h+='<h2>Both axes, '+lm+' mask</h2><p class="sub2">Across: coherence 10, 55 and 100 percent. Down: load high and low. The top row is a bent body in the dark, then lit. The bottom row is a plain calm person in the dark, then lit.</p>';
  h+='<div class="grid" style="grid-template-columns:72px repeat(3,minmax(0,1fr))"><div></div>'+COHROWS.map(r=>'<div class="gh"><div class="gt">Coherence '+r[0]+'</div></div>').join('');
  [['High load',1],['Low load',.06]].forEach(lr=>{h+='<div class="rl2">'+lr[0]+'<br>'+Math.round(lr[1]*100)+'%</div>';COHROWS.forEach(cr=>{h+=cell(lm,lr[1],cr[1],true,lm+', coherence '+cr[0]);});});
  h+='</div>';}
 if(view==='all'||view==='masks'){
  const heads='<div></div>'+MASKS.map(m=>{const c=maskCols(m);return '<div class="gh"><div class="gt"><svg viewBox="0 0 32 32" fill="none" stroke="'+c[1]+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+glyphFor(sys.ver,m.nm)+'</svg>'+m.nm+'</div><p>'+sys.glance[m.nm]+'</p></div>';}).join('');
  h+='<h2>Coherence, all five masks, load held high</h2><p class="sub2">The shape is the same down the column. Only the light changes.</p><div class="grid" style="grid-template-columns:72px repeat(5,minmax(0,1fr))">'+heads;
  COHROWS.forEach(cr=>{h+='<div class="rl2">Coherence<br>'+cr[0]+'</div>';MASKS.forEach(m=>{h+=cell(m.nm,1,cr[1],false,m.nm);});});
  h+='</div><h2>Load, all five masks, coherence held at 100 percent</h2><p class="sub2">The light is the same down the column. Only the shape changes. Low load is a plain calm person.</p><div class="grid" style="grid-template-columns:72px repeat(5,minmax(0,1fr))"><div></div>'+MASKS.map(m=>'<div class="gh"><div class="gt">'+m.nm+'</div></div>').join('');
  LOADROWS.forEach(lr=>{h+='<div class="rl2">Load<br>'+lr[0].toLowerCase()+' '+Math.round(lr[1]*100)+'%</div>';MASKS.forEach(m=>{h+=cell(m.nm,lr[1],1,false,m.nm);});});
  h+='</div>';}
 h+='</div>';$('app').innerHTML=h;
 const scenes=[];
 document.querySelectorAll('.cellw').forEach(el=>{const c=cells[+el.dataset.i];
  const sc=new Scene(el,sys,{mask:c.mask,prof:pk,load:c.load,coh:c.coh,snap:true,nogrow:true,lineup:true,small:false,carry:true});sc.t=3.2;sc.resize();scenes.push(sc);
  el.querySelector('.cm2').textContent='shape '+Math.round(sc.tm*100)+'%';});
 scenes.forEach(s=>{s.render();});
 window.__sheetStep=sec=>{scenes.forEach(s=>{s.t=sec;s.render();});};
 window.__sheetCost=()=>{const a=performance.now();scenes.forEach(s=>s.render());return(performance.now()-a)/scenes.length;};
 if(MANUAL)return;
 let last=performance.now(),acc=0;
 function frame(now){const dt=clamp((now-last)/1000,0,.1);last=now;acc+=dt;if(acc>=1/8){scenes.forEach(s=>{s.t+=acc;s.render();});acc=0;}requestAnimationFrame(frame);}
 requestAnimationFrame(frame);}
