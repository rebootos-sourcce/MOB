/* ============================================================
   V4, RECEIPT. The most restrained. The figure stands at full height on
   the left, the turn ring drawn the way Leonardo drew his circle, round
   the navel, holding the head to the hips. On the right, a long dated
   receipt of what left: one line for every place released, and a line
   for each thing done, newest first, with the total at the foot the way
   a receipt carries one. No tiles, no panels, one ink and one rule.
   ============================================================ */
function figure(Ht,Wd){
 /* Leonardo's circle: centred on the navel, holding the head and the hands; the shins pass out of it */
 const mob=narrow();const r=mob?Math.min(Wd/2-22,172):Math.min(Wd/2-24,Ht*.41+6);
 const h=Math.min((r-6)/.41,mob?9999:Ht),k=h/100,W=h*.5,top=r+14-.43*h,cy=top+.43*h,cx=Wd/2,S=Math.max(top+h+10,cy+r+16);
 const body=bodySvg({h,ringPx:mob?3.4:4,vx:[25,50]});
 return '<svg class="stagesvg" data-hit width="'+Wd+'" height="'+S.toFixed(0)+'" viewBox="0 0 '+Wd+' '+S.toFixed(0)+'">'
  +horizonRing(cx,cy,r+10,{w:2,bw:mob?6:8})
  +turnRing(cx,cy,r,P.turn,{w:2,gap:5})
  +body.replace('<svg class="bodysvg"','<svg class="bodysvg" x="'+(cx-W/2).toFixed(1)+'" y="'+top.toFixed(1)+'"')+'</svg>';}
/* every line of the receipt: each place released, and each thing done */
function lines(){
 const L=[];
 P.opened.filter(r=>placed(r[0])).forEach(r=>L.push({at:r[1],place:r[0]}));
 P.ledger.forEach(e=>L.push({at:e.at,e}));
 return L.sort((a,b)=>a.at<b.at?1:a.at>b.at?-1:(a.e&&a.e.kind==='buy'?1:b.e&&b.e.kind==='buy'?-1:(a.e?-1:1)));}
function short(iso){const p=iso.split('-').map(Number);return p[2]+' '+MON[p[1]-1].slice(0,3);}
function lineHtml(x){
 if(x.place)return '<li class="rl ar-row" data-ids="'+x.place+'"><span class="d num">'+short(x.at)+'</span><span class="w"><b>'+cap1(nerve(x.place))+', '+where(x.place)+'</b><i>It held '+held(x.place)+'.</i></span></li>';
 const e=x.e;if(e.kind==='buy')return '<li class="rl buyl"><span class="d num">'+short(e.at)+'</span><p class="buy">You took a risk on yourself. '+dstr(e.at)+'.</p></li>';
 const w=tileWords(e),fam=FAMILY[e.kind];
 return '<li class="rl mk" style="--c:var(--ach-'+fam+')"><span class="d num">'+short(e.at)+'</span><span class="w"><b><svg viewBox="0 0 24 24" aria-hidden="true">'+iconFor(e)+'</svg>'+w.t+'</b><i>'+w.s+' '+(w.l&&w.l!=='Set'&&w.l!=='Reached'&&w.l!=='Latest,'?w.l:'')+'</i></span></li>';}
function render(){
 const m=$('#main'),mob=narrow(),E=estimate(P);
 const all=lines();
 m.innerHTML='<div class="v4"><div class="fcol" id="fc"></div><section class="rcpt" aria-label="A receipt of what left, newest first">'
  +'<h1>Achievements</h1><p class="lede">A receipt of what left you, newest first. Each line is dated, and none is taken back.</p>'
  +'<p class="small kk">'+TURN_SAYS+'</p>'+turnKey(P.turn)
  +'<ol class="rlist">'+all.map(lineHtml).join('')+'</ol>'
  +'<div class="tot"><div class="trow"><span>Released, patterns</span><span class="lead" aria-hidden="true"></span><b class="num">'+fmt(P.released)+'</b></div>'
  +'<div class="trow"><span>Places released</span><span class="lead" aria-hidden="true"></span><b class="num">'+fmt(P.opened.filter(r=>placed(r[0])).length)+'</b></div>'
  +'<div class="hz1">'+horizonText()+arcSays('The outer arc round the figure is what you have released, against the estimate for your age.')+'</div></div></section></div>';
 const fc=$('#fc');fc.innerHTML=figure(innerHeight-fc.getBoundingClientRect().top-24,mob?fc.clientWidth:Math.min(fc.clientWidth,820));
 $$('.ar-row').forEach(r=>{const id=+r.dataset.ids;r.addEventListener('mouseenter',()=>hot([id]));r.addEventListener('mouseleave',()=>hot([]));});}
start();
