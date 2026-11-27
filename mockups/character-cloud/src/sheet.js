/* The state sheet: each mask at high, mid and low load, for both example profiles, drawn by the same
   scene the page uses, so what is judged here is what the page does. */
const GLANCE={ /* how each mask is meant to be read in one look, set per system by the system itself */ };
const LOADROWS=[['High',1],['Mid',.55],['Low',.06]];
function sheetCss(){return '.sheet{padding:20px 24px 40px;max-width:1500px;margin:0 auto}.sheet h2{font-size:17px;margin:28px 0 4px;font-weight:600}.sheet .sub2{color:var(--mid);font-size:13px;margin:0 0 14px}'
 +'.grid{display:grid;grid-template-columns:64px repeat(4,minmax(0,1fr));gap:10px;align-items:stretch}.sheetpage .app{display:block;height:auto}.gh{display:flex;flex-direction:column;gap:6px;padding:4px 4px 8px}.gh .gt{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600}'
 +'.gh svg{width:30px;height:30px}.gh p{margin:0;color:var(--mid);font-size:12.5px;line-height:1.35}.rl2{display:flex;align-items:center;justify-content:flex-end;color:var(--mid);font-size:13px;padding-right:4px;text-align:right}'
 +'.cellw{position:relative;height:330px;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:radial-gradient(ellipse at 50% 44%,#13151C 0%,#0C0D12 70%)}.cellw.opq{background:#0C0D12}'
 +'.cellw .cl{position:absolute;left:10px;bottom:8px;font-size:12px;color:var(--dim);z-index:2}.cellw .cm{position:absolute;right:10px;bottom:8px;font-size:12px;color:var(--mid);z-index:2}'
 +'body.sheetpage{overflow:auto;height:auto}.hd.sh{position:sticky;top:0;background:var(--bg);z-index:5}'
 +'@media (max-width:860px){.grid{grid-template-columns:44px repeat(2,minmax(0,1fr))}.gh p{display:none}.cellw{height:250px}.sheet{padding:12px 12px 40px}}';}
function bootSheet(sys){
 document.title='Character, '+sys.name+', three loads';document.body.classList.add('sheetpage');
 const prof=Q.get('profile');const profs=prof?[prof]:['anger','apathy'];
 const style=document.createElement('style');style.textContent=sheetCss();document.head.appendChild(style);
 let h='<header class="hd sh"><div><div class="ey">Character, round OQ state sheet</div><h1>'+sys.name+', each mask at high, mid and low load</h1><p>The same scene as the page, frozen at three seconds. Low is a plain calm person. The leading pattern is changed between the two profiles, so the same mask bends differently.</p></div>'
  +'<nav class="nav"><a href="index.html">Contact sheet</a>'+SYSTEMS.map(s=>'<a class="opt" href="states-'+s.id+'.html"'+(s.id===sys.id?' aria-current="page"':'')+'>'+s.name+'</a>').join('')+'</nav></header><div class="sheet">';
 profs.forEach(pk=>{const P=PROFILES[pk],li=leadPat(P.w);
  h+='<h2>'+P.label+'</h2><p class="sub2">'+AX[li].nm+' at '+P.w[AX[li].nm].toFixed(1)+', '+VERB[li]+'. Mask that leads: '+leadMask(P.w).nm+'.</p><div class="grid"><div></div>';
  MASKS.forEach(m=>{const c=maskCols(m);h+='<div class="gh"><div class="gt"><svg viewBox="0 0 32 32" fill="none" stroke="'+c[1]+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+sys.glyph[m.nm]+'</svg>'+m.nm+'</div><p>'+sys.glance[m.nm]+'</p></div>';});
  LOADROWS.forEach(r=>{h+='<div class="rl2">'+r[0]+'<br>'+Math.round(r[1]*100)+'%</div>';
   MASKS.forEach(m=>{h+='<div class="cellw'+(sys.bg?' opq':'')+'" data-p="'+pk+'" data-m="'+m.nm+'" data-l="'+r[1]+'"><span class="cl">'+m.nm+', '+r[0].toLowerCase()+'</span><span class="cm"></span></div>';});});
  h+='</div>';});
 h+='</div>';$('app').innerHTML=h;
 const scenes=[];
 document.querySelectorAll('.cellw').forEach(el=>{const w=PROFILES[el.dataset.p].w,m=MASKS.find(x=>x.nm===el.dataset.m),k=+el.dataset.l;
  const sc=new Scene(el,sys,{mask:m.nm,prof:el.dataset.p,load:k,snap:true,lineup:true,small:false,carry:true});sc.t=2.8;sc.resize();scenes.push(sc);
  const ws=sc.weights();el.querySelector('.cm').textContent='shape '+Math.round(sc.tm*100)+'%';});
 scenes.forEach(s=>{s.render();});
 window.__sheetStep=sec=>{scenes.forEach(s=>{s.t=sec;s.render();});};
 if(MANUAL)return;
 let last=performance.now(),acc=0;
 function frame(now){const dt=clamp((now-last)/1000,0,.1);last=now;acc+=dt;if(acc>=1/24){scenes.forEach(s=>{s.t+=acc;s.render();});acc=0;}requestAnimationFrame(frame);}
 requestAnimationFrame(frame);}
